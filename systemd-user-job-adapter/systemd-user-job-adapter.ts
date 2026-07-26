#!/usr/bin/env bun
/**
 * Small, local systemd user-job adapter.
 *
 * The component task record is the authority.  systemd units, cgroups,
 * captured output, and this adapter's temporary directory are only labelled
 * host observations.  In particular, a completed process never changes the
 * task record to `completed`.
 */

import {
  chmodSync,
  closeSync,
  existsSync,
  fsyncSync,
  mkdirSync,
  openSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";

export type RoleChain = {
  asIs: string;
  orchestrator: string;
  implementer: string;
};

export type CommandResult = {
  code: number;
  stdout: string;
  stderr: string;
};

export type CommandRunner = (argv: string[]) => Promise<CommandResult>;

export type HostState = "running" | "completed" | "failed" | "unknown";
export type RecoveryState = "none" | "stale-candidate" | "required" | "escalated";

export type AdapterOptions = {
  recordPath: string;
  runtimeDirectory?: string;
  boundedSeconds: number;
  staleAfterSeconds?: number;
  maxRecoveryAttempts?: number;
  retryBackoffSeconds?: number;
  unitName?: string;
  mediation?: RoleChain;
  approvedExternalEffect?: boolean;
  recordRevision?: string;
  clock?: () => Date;
  runCommand?: CommandRunner;
};

export type LaunchResult = {
  outcome: "started" | "rejected" | "failed";
  unit: string | null;
  checkpoint: string | null;
  submission: {
    source: "systemd-run --user --no-block";
    code: number | null;
    stderr: string;
  };
  reason?: string;
};

export type PollResult = {
  outcome: "waiting" | "progressed" | "failed" | "unavailable" | "cancelled";
  jobState: HostState;
  recordStatus: string;
  unit: string | null;
  completionAuthority: "component task record";
  hostObservation: {
    source: "systemctl --user show";
    activeState: string | null;
    subState: string | null;
    result: string | null;
    execMainStatus: number | null;
    mainPid: number | null;
    controlGroup: string | null;
  };
  output: {
    stdout: CapturedOutput;
    stderr: CapturedOutput;
  };
  cancellationConfirmed: boolean;
  stale: {
    state: "not-stale" | "stale-candidate" | "unknown";
    source: "task.updated plus adapter clock";
    checkpoint: string | null;
    intervalSeconds: number;
    reason?: string;
  };
  recovery: {
    state: RecoveryState;
    attempts: number;
    maximum: number;
    nextAction: string;
  };
  reason?: string;
};

export type CancelResult = {
  outcome: "progressed" | "unavailable" | "rejected";
  unit: string | null;
  requestDurable: boolean;
  terminationConfirmed: false;
  recordStatus: string;
  reason?: string;
};

export type RecoveryResult = {
  outcome: "scheduled" | "escalated" | "rejected";
  state: "required" | "escalated" | "rejected";
  attempt: number;
  maximum: number;
  delaySeconds: number;
  nextAction: string;
  reason?: string;
};

type JsonRecord = Record<string, any>;

type TaskRecord = {
  path: string;
  text: string;
  front: string;
  body: string;
  status: string;
  worker: string;
  updated: string;
};

type SystemdProperties = {
  activeState: string | null;
  subState: string | null;
  result: string | null;
  execMainStatus: number | null;
  mainPid: number | null;
  controlGroup: string | null;
};

export type CapturedOutput = {
  source: "systemd transient-unit stdout" | "systemd transient-unit stderr";
  path: string | null;
  available: boolean;
  bytes: number;
  text: string;
};

const ALLOWED_TRANSITIONS: Record<string, Set<string>> = {
  ready: new Set(["active", "cancelled"]),
  active: new Set(["blocked", "awaiting-approval", "completed", "failed", "cancelled"]),
  blocked: new Set(["active", "cancelled"]),
  "awaiting-approval": new Set(["active", "cancelled"]),
  failed: new Set(["active", "cancelled"]),
  completed: new Set(),
  cancelled: new Set(),
};

const EMPTY_SYSTEMD_PROPERTIES: SystemdProperties = {
  activeState: null,
  subState: null,
  result: null,
  execMainStatus: null,
  mainPid: null,
  controlGroup: null,
};

function utcString(value: Date): string {
  return value.toISOString().replace(/\.\d{3}Z$/, "Z");
}

function nowDate(clock: () => Date): Date {
  const date = clock();
  if (Number.isNaN(date.valueOf())) throw new Error("adapter clock returned an invalid date");
  return date;
}

function sortedJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortedJson);
  if (value === null || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value as JsonRecord).sort().map((key) => [key, sortedJson((value as JsonRecord)[key])]));
}

function eventLine(event: JsonRecord): string {
  return `- control-plane: ${JSON.stringify(sortedJson(event))}`;
}

function sectionBounds(body: string, name: string): [number, number] | null {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const heading = new RegExp(`^## ${escaped}\\s*$`, "m").exec(body);
  if (!heading || heading.index === undefined) return null;
  const start = heading.index + heading[0].length;
  const rest = body.slice(start);
  const next = /^## /m.exec(rest);
  return [start, next ? start + next.index : body.length];
}

function appendEvent(body: string, event: JsonRecord): string {
  const line = eventLine(event);
  if (!body.includes("## Control Plane")) {
    const nextAction = "## Next Action";
    const position = body.indexOf(nextAction);
    const insertion = `## Control Plane\n\n${line}\n\n`;
    return position >= 0 ? body.slice(0, position) + insertion + body.slice(position) : `${body.trimEnd()}\n\n${insertion}`;
  }
  const bounds = sectionBounds(body, "Control Plane");
  if (!bounds) return `${body.trimEnd()}\n\n${line}\n`;
  const content = body.slice(bounds[0], bounds[1]).trimEnd();
  const replacement = `\n${content ? `${content}\n` : ""}${line}\n`;
  return body.slice(0, bounds[0]) + replacement + body.slice(bounds[1]);
}

function parseEvents(body: string): JsonRecord[] {
  const result: JsonRecord[] = [];
  for (const line of body.split("\n")) {
    const match = /^- control-plane: (\{.*\})\s*$/.exec(line);
    if (!match) continue;
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) result.push(parsed);
    } catch {
      // Unknown or malformed notes are not treated as authoritative events.
    }
  }
  return result;
}

function frontAndBody(text: string): { front: string; body: string } {
  if (!text.startsWith("---\n")) throw new Error("task record is missing opening front matter");
  const end = text.indexOf("\n---\n", 4);
  if (end < 0) throw new Error("task record is missing closing front matter");
  return { front: text.slice(4, end), body: text.slice(end + 5) };
}

function scalar(front: string, field: string): string {
  const match = new RegExp(`^  ${field}: ([^\\n]+)$`, "m").exec(front);
  if (!match) throw new Error(`task record is missing task.${field}`);
  return match[1].trim().replace(/^"|"$/g, "");
}

function loadRecord(path: string): TaskRecord {
  const resolved = resolve(path);
  if (basename(resolved) !== "as-is.md") throw new Error("record path must end in as-is.md");
  const text = readFileSync(resolved, "utf8");
  const { front, body } = frontAndBody(text);
  const status = scalar(front, "status");
  const worker = scalar(front, "worker");
  const updated = scalar(front, "updated");
  if (!status || !worker || !updated) throw new Error("task record has incomplete task authority");
  return { path: resolved, text, front, body, status, worker, updated };
}

function replaceTaskFields(front: string, status: string | null, updated: string): string {
  let result = front;
  if (status !== null) {
    const match = /^  status: [^\n]*$/m.exec(result);
    if (!match) throw new Error("task status field is missing");
    result = result.slice(0, match.index) + `  status: ${status}` + result.slice(match.index + match[0].length);
  }
  const updatedMatch = /^  updated: [^\n]*$/m.exec(result);
  if (!updatedMatch) throw new Error("task updated field is missing");
  return result.slice(0, updatedMatch.index) + `  updated: ${updated}` + result.slice(updatedMatch.index + updatedMatch[0].length);
}

function renderRecord(record: TaskRecord, body: string, status: string | null, checkpoint: string): string {
  return `---\n${replaceTaskFields(record.front, status, checkpoint)}\n---\n${body}`;
}

function atomicWrite(path: string, text: string): void {
  const temporary = `${path}.${randomUUID()}.tmp`;
  const descriptor = openSync(temporary, "wx", 0o600);
  try {
    writeFileSync(descriptor, text, "utf8");
    fsyncSync(descriptor);
    closeSync(descriptor);
    renameSync(temporary, path);
  } finally {
    try {
      closeSync(descriptor);
    } catch {
      // The descriptor was already closed on the normal path.
    }
    if (existsSync(temporary)) unlinkSync(temporary);
  }
}

function transitionAllowed(from: string, to: string): boolean {
  return from === to || Boolean(ALLOWED_TRANSITIONS[from]?.has(to));
}

function recordCheckpoint(
  path: string,
  event: JsonRecord,
  clock: () => Date,
  status: string | null = null,
  expectedUpdated?: string,
): TaskRecord {
  const current = loadRecord(path);
  if (expectedUpdated !== undefined && current.updated !== expectedUpdated) {
    throw new Error(`stale task record revision: expected ${expectedUpdated}, found ${current.updated}`);
  }
  if (status !== null && !transitionAllowed(current.status, status)) {
    throw new Error(`cannot transition task from ${JSON.stringify(current.status)} to ${JSON.stringify(status)}`);
  }
  const checkpoint = utcString(nowDate(clock));
  const checkpointedEvent = { ...event, checkpoint };
  const body = appendEvent(current.body, checkpointedEvent);
  atomicWrite(current.path, renderRecord(current, body, status, checkpoint));
  return loadRecord(current.path);
}

function numberFromFront(front: string, pattern: RegExp): number | null {
  const match = pattern.exec(front);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

function latestEvent(record: TaskRecord, eventName: string): JsonRecord | null {
  const matches = parseEvents(record.body).filter((event) => event.event === eventName);
  return matches.length ? matches[matches.length - 1] : null;
}

function latestLaunch(record: TaskRecord): JsonRecord | null {
  const events = parseEvents(record.body).filter((event) => event.event === "launch-accepted");
  return events.length ? events[events.length - 1] : null;
}

function recoveryAttempts(record: TaskRecord): number {
  return parseEvents(record.body).filter((event) => event.event === "recovery-attempt").length;
}

function isCancellationRequested(record: TaskRecord): boolean {
  return parseEvents(record.body).some((event) => event.event === "cancellation-requested") && !parseEvents(record.body).some((event) => event.event === "cancellation-confirmed");
}

function parseSystemdProperties(text: string): SystemdProperties {
  const values: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const separator = line.indexOf("=");
    if (separator >= 0) values[line.slice(0, separator)] = line.slice(separator + 1).trim();
  }
  const numberValue = (key: string): number | null => {
    const value = Number(values[key]);
    return Number.isFinite(value) ? value : null;
  };
  return {
    activeState: values.ActiveState ?? null,
    subState: values.SubState ?? null,
    result: values.Result ?? null,
    execMainStatus: numberValue("ExecMainStatus"),
    mainPid: numberValue("MainPID"),
    controlGroup: values.ControlGroup ?? null,
  };
}

function hostState(properties: SystemdProperties): HostState {
  if (properties.activeState === "active" && properties.subState !== "exited") return "running";
  if ((properties.activeState === "active" && properties.subState === "exited") || properties.activeState === "inactive") {
    if (properties.result === "success") return "completed";
    if (properties.result && properties.result !== "success") return "failed";
  }
  if (properties.activeState === "failed") return "failed";
  return "unknown";
}

function readCapture(path: string | null, source: CapturedOutput["source"]): CapturedOutput {
  if (!path) return { source, path: null, available: false, bytes: 0, text: "" };
  try {
    const text = readFileSync(path, "utf8");
    const bounded = text.length > 8192 ? text.slice(-8192) : text;
    return { source, path, available: true, bytes: text.length, text: bounded };
  } catch {
    return { source, path, available: false, bytes: 0, text: "" };
  }
}

function validUnitName(value: string): boolean {
  return /^[a-z0-9][a-z0-9-]{0,62}\.service$/.test(value);
}

function validateRuntimeDirectory(path: string): string {
  const resolved = resolve(path);
  if (resolved === "/" || resolved === dirname(resolved)) throw new Error("runtime directory is unsafe");
  return resolved;
}

async function defaultCommandRunner(argv: string[]): Promise<CommandResult> {
  const child = Bun.spawn({ cmd: argv, stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  return { code, stdout, stderr };
}

export class SystemdUserJobAdapter {
  private readonly recordPath: string;
  private readonly runtimeDirectory?: string;
  private readonly boundedSeconds: number;
  private readonly staleAfterSeconds: number;
  private readonly maxRecoveryAttempts: number;
  private readonly retryBackoffSeconds: number;
  private readonly requestedUnit?: string;
  private readonly mediation: RoleChain;
  private readonly approvedExternalEffect: boolean;
  private readonly recordRevision?: string;
  private readonly clock: () => Date;
  private readonly runCommand: CommandRunner;

  constructor(options: AdapterOptions) {
    if (!Number.isInteger(options.boundedSeconds) || options.boundedSeconds <= 0) throw new Error("boundedSeconds must be a positive integer");
    if (options.staleAfterSeconds !== undefined && (!Number.isInteger(options.staleAfterSeconds) || options.staleAfterSeconds <= 0)) throw new Error("staleAfterSeconds must be a positive integer");
    if (options.maxRecoveryAttempts !== undefined && (!Number.isInteger(options.maxRecoveryAttempts) || options.maxRecoveryAttempts < 0)) throw new Error("maxRecoveryAttempts must be a non-negative integer");
    if (options.retryBackoffSeconds !== undefined && (!Number.isInteger(options.retryBackoffSeconds) || options.retryBackoffSeconds < 0)) throw new Error("retryBackoffSeconds must be a non-negative integer");
    if (options.unitName !== undefined && !validUnitName(options.unitName)) throw new Error("unitName must be a valid transient .service name");
    if (options.mediation !== undefined && (options.mediation.asIs !== "as-is" || options.mediation.orchestrator !== "orchestrator" || options.mediation.implementer !== "implementer")) {
      throw new Error("role substitution rejected: mediation must be as-is -> orchestrator -> implementer");
    }
    this.recordPath = resolve(options.recordPath);
    this.runtimeDirectory = options.runtimeDirectory ? validateRuntimeDirectory(options.runtimeDirectory) : undefined;
    this.boundedSeconds = options.boundedSeconds;
    this.staleAfterSeconds = options.staleAfterSeconds ?? 300;
    this.maxRecoveryAttempts = options.maxRecoveryAttempts ?? 2;
    this.retryBackoffSeconds = options.retryBackoffSeconds ?? 300;
    this.requestedUnit = options.unitName;
    this.mediation = options.mediation ?? { asIs: "as-is", orchestrator: "orchestrator", implementer: "implementer" };
    this.approvedExternalEffect = options.approvedExternalEffect ?? false;
    this.recordRevision = options.recordRevision;
    this.clock = options.clock ?? (() => new Date());
    this.runCommand = options.runCommand ?? defaultCommandRunner;
  }

  private unitName(): string {
    return this.requestedUnit ?? `as-is-job-${randomUUID().replaceAll("-", "")}.service`;
  }

  private requireLaunchAuthority(record: TaskRecord): void {
    if (record.status !== "ready") throw new Error(`launch requires a ready task record, found ${JSON.stringify(record.status)}`);
    if (record.worker !== "implementer") throw new Error(`configured worker must be implementer, found ${JSON.stringify(record.worker)}`);
    if (this.mediation.asIs !== "as-is" || this.mediation.orchestrator !== "orchestrator" || this.mediation.implementer !== record.worker) {
      throw new Error("role substitution rejected: expected as-is -> orchestrator -> implementer");
    }
    if (this.recordRevision !== undefined && record.updated !== this.recordRevision) {
      throw new Error(`stale task record revision: expected ${this.recordRevision}, found ${record.updated}`);
    }
    const allocatedWall = numberFromFront(record.front, /^      allocated-seconds: (\d+(?:\.\d+)?)$/m);
    if (allocatedWall !== null && this.boundedSeconds > allocatedWall) {
      throw new Error(`bounded job exceeds task wall-clock allocation: ${this.boundedSeconds} > ${allocatedWall}`);
    }
    const effects = /^  external-effects: ([^\n]+)$/m.exec(record.front)?.[1]?.trim();
    if (effects === "require-current-turn-user-approval" && !this.approvedExternalEffect) {
      throw new Error("current-turn approval is required before submitting a user job");
    }
  }

  private runtimePaths(unit: string): { directory: string; marker: string; stdout: string; stderr: string } {
    if (!this.runtimeDirectory) throw new Error("runtimeDirectory is required for launch");
    const directory = validateRuntimeDirectory(this.runtimeDirectory);
    if (existsSync(directory)) throw new Error(`runtime directory already exists: ${directory}`);
    mkdirSync(directory, { mode: 0o700 });
    chmodSync(directory, 0o700);
    const marker = join(directory, ".systemd-user-job-adapter");
    writeFileSync(marker, "systemd-user-job-adapter temporary state\n", { encoding: "utf8", mode: 0o600 });
    const stdout = join(directory, `${unit}.stdout.log`);
    const stderr = join(directory, `${unit}.stderr.log`);
    writeFileSync(stdout, "", { encoding: "utf8", mode: 0o600 });
    writeFileSync(stderr, "", { encoding: "utf8", mode: 0o600 });
    return { directory, marker, stdout, stderr };
  }

  async launch(command: readonly string[]): Promise<LaunchResult> {
    const record = loadRecord(this.recordPath);
    try {
      this.requireLaunchAuthority(record);
    } catch (error) {
      return {
        outcome: "rejected",
        unit: null,
        checkpoint: null,
        submission: { source: "systemd-run --user --no-block", code: null, stderr: "" },
        reason: String(error instanceof Error ? error.message : error),
      };
    }
    if (!command.length || command.some((part) => !part.length)) {
      return { outcome: "rejected", unit: null, checkpoint: null, submission: { source: "systemd-run --user --no-block", code: null, stderr: "" }, reason: "bounded command must be non-empty" };
    }

    const unit = this.unitName();
    const paths = this.runtimePaths(unit);
    const program = command[0];
    try {
      recordCheckpoint(this.recordPath, {
        event: "launch-requested",
        operation: "launch",
        unit,
        source: "systemd-user-job-adapter",
        "task-authority": "component as-is.md",
        "role-chain": "as-is -> orchestrator -> implementer",
        "command-program": program,
        "bounded-seconds": this.boundedSeconds,
        "runtime-directory": paths.directory,
      }, this.clock, "active", record.updated);
    } catch (error) {
      rmSync(paths.directory, { recursive: true, force: true });
      return { outcome: "rejected", unit: null, checkpoint: null, submission: { source: "systemd-run --user --no-block", code: null, stderr: "" }, reason: String(error instanceof Error ? error.message : error) };
    }

    const argv = [
      "systemd-run",
      "--user",
      "--no-block",
      `--unit=${unit}`,
      `--property=RuntimeMaxSec=${this.boundedSeconds}s`,
      `--property=StandardOutput=append:${paths.stdout}`,
      `--property=StandardError=append:${paths.stderr}`,
      "--",
      ...command,
    ];
    let submission: CommandResult;
    try {
      submission = await this.runCommand(argv);
    } catch (error) {
      const failed = recordCheckpoint(this.recordPath, {
        event: "launch-failed",
        operation: "launch",
        unit,
        source: "systemd-run --user --no-block",
        reason: String(error instanceof Error ? error.message : error),
        recovery: "required",
      }, this.clock);
      rmSync(paths.directory, { recursive: true, force: true });
      return { outcome: "failed", unit, checkpoint: failed.updated, submission: { source: "systemd-run --user --no-block", code: null, stderr: String(error instanceof Error ? error.message : error) }, reason: "submission command failed" };
    }
    if (submission.code !== 0) {
      const failed = recordCheckpoint(this.recordPath, {
        event: "launch-failed",
        operation: "launch",
        unit,
        source: "systemd-run --user --no-block",
        "submission-exit-code": submission.code,
        stderr: submission.stderr.slice(-2048),
        recovery: "required",
      }, this.clock);
      rmSync(paths.directory, { recursive: true, force: true });
      return { outcome: "failed", unit, checkpoint: failed.updated, submission: { source: "systemd-run --user --no-block", code: submission.code, stderr: submission.stderr }, reason: "systemd rejected the bounded job" };
    }

    const accepted = recordCheckpoint(this.recordPath, {
      event: "launch-accepted",
      operation: "launch",
      unit,
      source: "systemd-run --user --no-block",
      "task-authority": "component as-is.md",
      "submission-exit-code": submission.code,
      "runtime-observation": {
        source: "systemd transient unit",
        "stdout-path": paths.stdout,
        "stderr-path": paths.stderr,
        "control-group": "pending later systemctl --user show observation",
      },
      "return-condition": "durable launch checkpoint only; worker completion not awaited",
    }, this.clock);
    return {
      outcome: "started",
      unit,
      checkpoint: accepted.updated,
      submission: { source: "systemd-run --user --no-block", code: submission.code, stderr: submission.stderr },
    };
  }

  private launchInfo(record: TaskRecord): { unit: string; stdout: string | null; stderr: string | null } | null {
    const event = latestLaunch(record);
    if (!event || typeof event.unit !== "string") return null;
    const observation = event["runtime-observation"] as JsonRecord | undefined;
    return {
      unit: event.unit,
      stdout: typeof observation?.["stdout-path"] === "string" ? observation["stdout-path"] : null,
      stderr: typeof observation?.["stderr-path"] === "string" ? observation["stderr-path"] : null,
    };
  }

  private staleObservation(record: TaskRecord): PollResult["stale"] {
    const checkpoint = record.updated;
    const parsed = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(checkpoint) ? new Date(checkpoint) : new Date(Number.NaN);
    const now = nowDate(this.clock);
    if (Number.isNaN(parsed.valueOf()) || Number.isNaN(now.valueOf())) {
      return { state: "unknown", source: "task.updated plus adapter clock", checkpoint, intervalSeconds: this.staleAfterSeconds, reason: "malformed or unavailable checkpoint clock" };
    }
    const ageSeconds = (now.valueOf() - parsed.valueOf()) / 1000;
    if (ageSeconds > this.staleAfterSeconds) return { state: "stale-candidate", source: "task.updated plus adapter clock", checkpoint, intervalSeconds: this.staleAfterSeconds };
    return { state: "not-stale", source: "task.updated plus adapter clock", checkpoint, intervalSeconds: this.staleAfterSeconds };
  }

  private recoveryObservation(record: TaskRecord, stale: boolean, failed: boolean): PollResult["recovery"] {
    const attempts = recoveryAttempts(record);
    const state: RecoveryState = stale ? "stale-candidate" : failed ? (attempts >= this.maxRecoveryAttempts ? "escalated" : "required") : "none";
    return {
      state,
      attempts,
      maximum: this.maxRecoveryAttempts,
      nextAction: state === "none" ? "orchestrator continues polling the durable record" : attempts >= this.maxRecoveryAttempts ? "record durable escalation and obtain explicit direction; do not retry or substitute a role" : "orchestrator rereads the record and schedules only a bounded configured-worker recovery",
    };
  }

  async poll(): Promise<PollResult> {
    const record = loadRecord(this.recordPath);
    const info = this.launchInfo(record);
    if (!info) {
      return {
        outcome: "unavailable",
        jobState: "unknown",
        recordStatus: record.status,
        unit: null,
        completionAuthority: "component task record",
        hostObservation: { source: "systemctl --user show", ...EMPTY_SYSTEMD_PROPERTIES },
        output: { stdout: readCapture(null, "systemd transient-unit stdout"), stderr: readCapture(null, "systemd transient-unit stderr") },
        cancellationConfirmed: false,
        stale: { state: "unknown", source: "task.updated plus adapter clock", checkpoint: record.updated, intervalSeconds: this.staleAfterSeconds, reason: "no durable launch handle" },
        recovery: { state: "required", attempts: recoveryAttempts(record), maximum: this.maxRecoveryAttempts, nextAction: "reread the component record; a missing handle is not completion" },
        reason: "no durable launch-accepted checkpoint",
      };
    }

    const show = await this.runCommand([
      "systemctl",
      "--user",
      "show",
      "--no-pager",
      "--property=ActiveState",
      "--property=SubState",
      "--property=Result",
      "--property=ExecMainStatus",
      "--property=MainPID",
      "--property=ControlGroup",
      info.unit,
    ]);
    const properties = show.code === 0 ? parseSystemdProperties(show.stdout) : { ...EMPTY_SYSTEMD_PROPERTIES };
    const state = show.code === 0 ? hostState(properties) : "unknown";
    const stdout = readCapture(info.stdout, "systemd transient-unit stdout");
    const stderr = readCapture(info.stderr, "systemd transient-unit stderr");
    const stale = this.staleObservation(record);
    const cancellationRequested = isCancellationRequested(record);
    const cancellationConfirmed = cancellationRequested && show.code === 0 && properties.mainPid === 0 && (state === "completed" || state === "failed" || (properties.activeState === "inactive" && properties.subState === "dead"));
    const recovery = this.recoveryObservation(record, stale.state === "stale-candidate", state === "failed" || state === "unknown");
    let nextRecord = record;
    try {
      if (cancellationConfirmed && record.status === "active") {
        nextRecord = recordCheckpoint(this.recordPath, {
          event: "cancellation-confirmed",
          operation: "cancel",
          unit: info.unit,
          source: "systemctl --user show",
          "termination-confirmed": true,
          "host-state": state,
          "main-pid": properties.mainPid,
          result: "routed cancellation reached terminated process state",
          recovery: "private runtime retained until cleanup",
        }, this.clock, "cancelled");
      } else {
        nextRecord = recordCheckpoint(this.recordPath, {
          event: "host-observation",
          operation: "observe",
          unit: info.unit,
          source: "systemctl --user show",
          "host-state": state,
          "active-state": properties.activeState,
          "sub-state": properties.subState,
          result: properties.result,
          "exec-main-status": properties.execMainStatus,
          "main-pid": properties.mainPid,
          "control-group": properties.controlGroup,
          output: {
            stdout: { source: stdout.source, path: stdout.path, available: stdout.available, bytes: stdout.bytes },
            stderr: { source: stderr.source, path: stderr.path, available: stderr.available, bytes: stderr.bytes },
          },
          stale: stale.state,
          recovery: recovery.state,
          "task-authority": "component as-is.md; host state is supplementary",
        }, this.clock);
      }
    } catch (error) {
      return {
        outcome: "unavailable",
        jobState: state,
        recordStatus: record.status,
        unit: info.unit,
        completionAuthority: "component task record",
        hostObservation: { source: "systemctl --user show", ...properties },
        output: { stdout, stderr },
        cancellationConfirmed: false,
        stale,
        recovery,
        reason: `durable observation was not saved: ${String(error instanceof Error ? error.message : error)}`,
      };
    }
    const outcome = cancellationConfirmed ? "cancelled" : state === "running" ? "waiting" : state === "completed" ? "progressed" : state === "failed" ? "failed" : "unavailable";
    return {
      outcome,
      jobState: state,
      recordStatus: nextRecord.status,
      unit: info.unit,
      completionAuthority: "component task record",
      hostObservation: { source: "systemctl --user show", ...properties },
      output: { stdout, stderr },
      cancellationConfirmed,
      stale,
      recovery,
      reason: show.code === 0 ? undefined : show.stderr.trim() || "systemd unit handle is unavailable; this is not completion",
    };
  }

  async cancel(reason: string): Promise<CancelResult> {
    if (!reason.trim()) return { outcome: "rejected", unit: null, requestDurable: false, terminationConfirmed: false, recordStatus: loadRecord(this.recordPath).status, reason: "cancellation reason must not be empty" };
    const record = loadRecord(this.recordPath);
    const info = this.launchInfo(record);
    if (record.status !== "active") return { outcome: "rejected", unit: info?.unit ?? null, requestDurable: false, terminationConfirmed: false, recordStatus: record.status, reason: `only an active task can be cancelled, found ${record.status}` };
    if (!info) return { outcome: "unavailable", unit: null, requestDurable: false, terminationConfirmed: false, recordStatus: record.status, reason: "no durable launch handle; cancellation was not routed" };
    try {
      recordCheckpoint(this.recordPath, {
        event: "cancellation-requested",
        operation: "cancel",
        unit: info.unit,
        source: "systemd-user-job-adapter",
        reason,
        "task-authority": "component as-is.md",
        "return-condition": "durable cancellation request before host stop; termination requires later poll",
      }, this.clock, null, record.updated);
    } catch (error) {
      return { outcome: "unavailable", unit: info.unit, requestDurable: false, terminationConfirmed: false, recordStatus: record.status, reason: String(error instanceof Error ? error.message : error) };
    }
    const stop = await this.runCommand(["systemctl", "--user", "stop", "--no-block", info.unit]);
    if (stop.code !== 0) {
      recordCheckpoint(this.recordPath, { event: "cancellation-routing-failed", operation: "cancel", unit: info.unit, source: "systemctl --user stop --no-block", stderr: stop.stderr.slice(-2048), recovery: "required" }, this.clock);
      return { outcome: "unavailable", unit: info.unit, requestDurable: true, terminationConfirmed: false, recordStatus: loadRecord(this.recordPath).status, reason: stop.stderr.trim() || "systemd stop request failed" };
    }
    recordCheckpoint(this.recordPath, { event: "cancellation-routed", operation: "cancel", unit: info.unit, source: "systemctl --user stop --no-block", "submission-exit-code": stop.code, "termination-confirmed": false }, this.clock);
    return { outcome: "progressed", unit: info.unit, requestDurable: true, terminationConfirmed: false, recordStatus: loadRecord(this.recordPath).status };
  }

  async recover(reason: string): Promise<RecoveryResult> {
    const record = loadRecord(this.recordPath);
    if (!reason.trim()) return { outcome: "rejected", state: "rejected", attempt: recoveryAttempts(record), maximum: this.maxRecoveryAttempts, delaySeconds: 0, nextAction: "record a durable reason before recovery", reason: "recovery reason must not be empty" };
    if (!["active", "blocked", "failed"].includes(record.status)) return { outcome: "rejected", state: "rejected", attempt: recoveryAttempts(record), maximum: this.maxRecoveryAttempts, delaySeconds: 0, nextAction: "terminal records are not reopened", reason: `task status ${record.status} is not recoverable` };
    const currentAttempts = recoveryAttempts(record);
    if (currentAttempts >= this.maxRecoveryAttempts) {
      recordCheckpoint(this.recordPath, { event: "recovery-escalated", operation: "recover", source: "systemd-user-job-adapter", reason, attempt: currentAttempts, maximum: this.maxRecoveryAttempts, nextAction: "explicit direction required; do not retry or substitute a role" }, this.clock);
      return { outcome: "escalated", state: "escalated", attempt: currentAttempts, maximum: this.maxRecoveryAttempts, delaySeconds: 0, nextAction: "explicit direction required; do not retry or substitute a role" };
    }
    const attempt = currentAttempts + 1;
    const delaySeconds = this.retryBackoffSeconds * 2 ** (attempt - 1);
    const due = utcString(new Date(nowDate(this.clock).valueOf() + delaySeconds * 1000));
    recordCheckpoint(this.recordPath, { event: "recovery-attempt", operation: "recover", source: "systemd-user-job-adapter", reason, attempt, maximum: this.maxRecoveryAttempts, "delay-seconds": delaySeconds, "due-at": due, "configured-worker": record.worker, nextAction: "orchestrator rereads the record and delegates only implementer through as-is -> orchestrator -> implementer" }, this.clock);
    return { outcome: "scheduled", state: "required", attempt, maximum: this.maxRecoveryAttempts, delaySeconds, nextAction: "orchestrator rereads the record and delegates only implementer through as-is -> orchestrator -> implementer" };
  }

  async cleanup(): Promise<void> {
    const record = loadRecord(this.recordPath);
    const info = this.launchInfo(record);
    if (!info) throw new Error("cannot clean private runtime without a durable launch handle");
    const current = await this.poll();
    if (current.jobState === "running" || current.jobState === "unknown") throw new Error("cannot clean private runtime while systemd state is running or unknown");
    const directory = info.stdout ? dirname(info.stdout) : this.runtimeDirectory;
    if (!directory || !existsSync(directory)) return;
    const marker = join(directory, ".systemd-user-job-adapter");
    if (!existsSync(marker) || !statSync(marker).isFile()) throw new Error("refusing to remove an unowned runtime directory");
    const stop = await this.runCommand(["systemctl", "--user", "stop", "--no-block", info.unit]);
    const unitAlreadyGone = /not loaded|not found/i.test(stop.stderr);
    if (stop.code !== 0 && !unitAlreadyGone) throw new Error(`systemd unit cleanup failed: ${stop.stderr.trim()}`);
    const reset = await this.runCommand(["systemctl", "--user", "reset-failed", info.unit]);
    if (reset.code !== 0 && !unitAlreadyGone && current.jobState !== "completed") throw new Error(`systemd failure-state cleanup failed: ${reset.stderr.trim()}`);
    recordCheckpoint(this.recordPath, { event: "private-runtime-cleanup", operation: "cleanup", unit: info.unit, source: "systemd-user-job-adapter", "runtime-state": "durable observations saved before private files removed", "task-authority": "component as-is.md" }, this.clock);
    rmSync(directory, { recursive: true, force: true });
  }
}
