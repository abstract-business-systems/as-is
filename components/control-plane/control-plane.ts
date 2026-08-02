#!/usr/bin/env bun
/**
 * Host-neutral durable control-plane operations.
 *
 * The repository task records are the only authority used by this module. It
 * deliberately has no host, session, process, network, or runtime-state
 * integration. A host can call these operations and map the returned durable
 * observations to its own lifecycle, but a host observation cannot replace a
 * record checkpoint.
 */

import {
  closeSync,
  existsSync,
  fchmodSync,
  fsyncSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmdirSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { createHash, randomBytes } from "node:crypto";

export const STATUSES = new Set([
  "ready",
  "active",
  "blocked",
  "awaiting-approval",
  "completed",
  "failed",
  "cancelled",
]);
export const TERMINAL = new Set(["completed", "failed", "cancelled"]);
const EFFECT_RANK: Record<string, number> = {
  prohibited: 0,
  "require-current-turn-user-approval": 1,
};
const UTC = "UTC";

type UnknownRecord = Record<string, any>;
type Clock = () => Date;

export class ControlPlaneError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ControlPlaneError";
  }
}

function isMapping(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function scalar(value: string): unknown {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith('"')) {
    try {
      return JSON.parse(trimmed);
    } catch (error) {
      throw new ControlPlaneError(`invalid quoted YAML scalar: ${trimmed}`);
    }
  }
  if (trimmed === "true" || trimmed === "false") return trimmed === "true";
  if (trimmed === "null" || trimmed === "~") return null;
  if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(trimmed)) {
    return trimmed.includes(".") ? Number.parseFloat(trimmed) : Number.parseInt(trimmed, 10);
  }
  return trimmed;
}

function indentation(line: string): number {
  return line.length - line.trimStart().length;
}

/** Parse the small mapping/list YAML subset used by as-is.md records. */
function parseYamlSubset(text: string): UnknownRecord {
  const rawLines = text
    .split("\n")
    .map((line) => line.replace(/\r$/, ""))
    .filter((line) => line.trim() && !line.trimStart().startsWith("#"));

  function block(index: number, level: number): [unknown, number] {
    if (index >= rawLines.length || indentation(rawLines[index]) !== level) {
      throw new ControlPlaneError("invalid YAML indentation");
    }
    const isList = rawLines[index].slice(level).startsWith("- ");
    const result: UnknownRecord | unknown[] = isList ? [] : {};

    while (index < rawLines.length) {
      const line = rawLines[index];
      const current = indentation(line);
      if (current < level) break;
      if (current !== level) throw new ControlPlaneError(`unexpected YAML indentation: ${line}`);
      const content = line.slice(level);

      if (isList) {
        if (!content.startsWith("- ")) throw new ControlPlaneError("mixed YAML list and mapping");
        const value = content.slice(2).trim();
        if (!value) {
          if (index + 1 >= rawLines.length || indentation(rawLines[index + 1]) <= level) {
            throw new ControlPlaneError("empty YAML list item");
          }
          const [item, next] = block(index + 1, indentation(rawLines[index + 1]));
          (result as unknown[]).push(item);
          index = next;
          continue;
        }
        const pieces = [value];
        index += 1;
        while (index < rawLines.length && indentation(rawLines[index]) > level) {
          pieces.push(rawLines[index].trim());
          index += 1;
        }
        (result as unknown[]).push(scalar(pieces.join(" ")));
        continue;
      }

      const separator = content.indexOf(":");
      if (separator < 0) throw new ControlPlaneError(`expected YAML mapping entry: ${line}`);
      const key = content.slice(0, separator);
      if (!key || key.trim() !== key || Object.hasOwn(result, key)) {
        throw new ControlPlaneError(`invalid or duplicate YAML key: ${JSON.stringify(key)}`);
      }
      const value = content.slice(separator + 1).trim();
      if (value) {
        (result as UnknownRecord)[key] = scalar(value);
        index += 1;
      } else {
        if (index + 1 >= rawLines.length || indentation(rawLines[index + 1]) <= level) {
          throw new ControlPlaneError(`missing nested YAML value for ${key}`);
        }
        const [nested, next] = block(index + 1, indentation(rawLines[index + 1]));
        (result as UnknownRecord)[key] = nested;
        index = next;
      }
    }
    return [result, index];
  }

  if (!rawLines.length) throw new ControlPlaneError("empty front matter");
  const [parsed, index] = block(0, 0);
  if (index !== rawLines.length || !isMapping(parsed)) {
    throw new ControlPlaneError("front matter must be a mapping");
  }
  return parsed;
}

function frontMatter(text: string): [UnknownRecord, string] {
  if (!text.startsWith("---\n")) throw new ControlPlaneError("missing opening front-matter delimiter");
  const end = text.indexOf("\n---\n", 4);
  if (end < 0) throw new ControlPlaneError("missing closing front-matter delimiter");
  return [parseYamlSubset(text.slice(4, end)), text.slice(end + 5)];
}

export class DurableRecord {
  constructor(
    readonly path: string,
    readonly text: string,
    readonly data: UnknownRecord,
    readonly body: string,
  ) {}

  get directory(): string {
    return dirname(this.path);
  }

  get status(): string {
    return isMapping(this.data.task) ? String(this.data.task.status ?? "") : "";
  }

  get worker(): string {
    return isMapping(this.data.task) ? String(this.data.task.worker ?? "") : "";
  }

  get updated(): string {
    return isMapping(this.data.task) ? String(this.data.task.updated ?? "") : "";
  }
}

function loadRecord(path: string): DurableRecord {
  let text: string;
  try {
    text = readFileSync(path, "utf8");
  } catch (error) {
    throw new ControlPlaneError(`cannot read ${path}: ${String(error)}`);
  }
  const [data, body] = frontMatter(text);
  return new DurableRecord(path, text, data, body);
}

function isTaskRecord(record: DurableRecord): boolean {
  return (
    (record.data["as-is-version"] === 1 || record.data["as-is-version"] === 2) &&
    isMapping(record.data.task) &&
    isMapping(record.data.constraints) &&
    Array.isArray(record.data.acceptance)
  );
}

function sectionBounds(body: string, name: string): [number, number] | null {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const heading = new RegExp(`^## ${escaped}\\s*$`, "m").exec(body);
  if (!heading || heading.index === undefined) return null;
  const contentStart = heading.index + heading[0].length;
  const rest = body.slice(contentStart);
  const next = /^## /m.exec(rest);
  return [contentStart, next ? contentStart + next.index : body.length];
}

function section(body: string, name: string): string {
  const bounds = sectionBounds(body, name);
  return bounds ? body.slice(bounds[0], bounds[1]) : "";
}

function events(body: string): UnknownRecord[] {
  const found: UnknownRecord[] = [];
  for (const line of body.split("\n")) {
    const match = /^- control-plane: (\{.*\})\s*$/.exec(line);
    if (!match) continue;
    try {
      const value = JSON.parse(match[1]);
      if (isMapping(value)) found.push(value);
    } catch {
      // A malformed event line is ignored just as an unknown durable note is.
    }
  }
  return found;
}

function sortedJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortedJson);
  if (!isMapping(value)) return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortedJson(value[key])]));
}

function eventLine(event: UnknownRecord): string {
  return `- control-plane: ${JSON.stringify(sortedJson(event))}`;
}

function appendEvent(body: string, event: UnknownRecord): string {
  const line = eventLine(event);
  const marker = "## Control Plane";
  if (!body.includes(marker)) {
    const insertion = `${marker}\n\n${line}\n\n`;
    const nextAction = "## Next Action";
    const position = body.indexOf(nextAction);
    return position >= 0 ? body.slice(0, position) + insertion + body.slice(position) : `${body.trimEnd()}\n\n${insertion}`;
  }

  const bounds = sectionBounds(body, "Control Plane");
  if (!bounds) return `${body.trimEnd()}\n\n${line}\n`;
  const content = body.slice(bounds[0], bounds[1]).trimEnd();
  const replacement = `\n${content ? `${content}\n` : ""}${line}\n`;
  return body.slice(0, bounds[0]) + replacement + body.slice(bounds[1]);
}

function appendResult(body: string, result: string): string {
  const bounds = sectionBounds(body, "Result");
  if (!bounds) throw new ControlPlaneError("task record has no Result section");
  const content = body.slice(bounds[0], bounds[1]).trimEnd();
  const addition = result.trimEnd();
  const replacement = `\n${content ? `${content}\n\n` : ""}${addition}\n`;
  return body.slice(0, bounds[0]) + replacement + body.slice(bounds[1]);
}

function utcString(value: Date): string {
  return value.toISOString().replace(/\.\d{3}Z$/, "Z");
}

function timestamp(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)) {
    throw new ControlPlaneError(`invalid UTC checkpoint: ${JSON.stringify(value)}`);
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) throw new ControlPlaneError(`invalid UTC checkpoint: ${JSON.stringify(value)}`);
  return parsed;
}

function replaceTaskScalars(front: string, status: string | null, updated: string | null): string {
  let result = front;
  if (status !== null) {
    const match = /^  status: [^\n]*$/m.exec(result);
    if (!match) throw new ControlPlaneError("task status field is missing");
    result = result.slice(0, match.index) + `  status: ${status}` + result.slice(match.index + match[0].length);
  }
  if (updated !== null) {
    const match = /^  updated: [^\n]*$/m.exec(result);
    if (!match) throw new ControlPlaneError("task updated field is missing");
    result = result.slice(0, match.index) + `  updated: ${updated}` + result.slice(match.index + match[0].length);
  }
  return result;
}

function renderRecord(record: DurableRecord, body: string, status: string | null, updated: string | null): string {
  const end = record.text.indexOf("\n---\n", 4);
  if (end < 0) throw new ControlPlaneError("record lost its front matter delimiter");
  const front = replaceTaskScalars(record.text.slice(4, end), status, updated);
  return `---\n${front}\n---\n${body}`;
}

function atomicWrite(path: string, text: string): void {
  const parent = dirname(path);
  let temporary = "";
  let descriptor: number | undefined;
  try {
    for (;;) {
      temporary = join(parent, `.${path.split(sep).pop()}.${randomBytes(8).toString("hex")}`);
      try {
        descriptor = openSync(temporary, "wx", 0o600);
        break;
      } catch (error: any) {
        if (error?.code !== "EEXIST") throw error;
      }
    }
    writeFileSync(descriptor, text, "utf8");
    fsyncSync(descriptor);
    closeSync(descriptor);
    descriptor = undefined;
    renameSync(temporary, path);
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
    if (temporary && existsSync(temporary)) unlinkSync(temporary);
  }
}

function constraints(record: DurableRecord): UnknownRecord {
  if (!isMapping(record.data.constraints)) throw new ControlPlaneError(`${record.path}: missing constraints mapping`);
  return record.data.constraints;
}

function resource(values: UnknownRecord, name: string): UnknownRecord {
  if (!isMapping(values[name])) throw new ControlPlaneError(`missing constraints.${name} mapping`);
  return values[name];
}

function recordBudget(record: DurableRecord): [UnknownRecord, UnknownRecord] {
  const values = constraints(record);
  const cost = resource(values, "cost");
  const execution = isMapping(values.execution) ? values.execution : {};
  let wall = execution["wall-clock"];
  if (!isMapping(wall)) {
    wall = {
      "allocated-seconds": null,
      "spent-seconds": null,
      "reserve-seconds": null,
      source: "unavailable",
      "fallback-metric": "unavailable",
    };
  }
  return [cost, wall];
}

function observedBudget(values: UnknownRecord, spentKey: string): UnknownRecord {
  const source = values.source ?? "unavailable";
  const spent = values[spentKey];
  const available = source !== "unavailable" && typeof spent === "number";
  return {
    allocated: values.allocated ?? values["allocated-seconds"],
    observed: available ? spent : null,
    source,
    "fallback-metric": values["fallback-metric"] ?? "unavailable",
  };
}

function blockers(body: string): string[] {
  const lines = section(body, "Blockers And Escalations")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.filter((line) => !["none", "none."].includes(line.toLowerCase()));
}

function maxChildren(record: DurableRecord): number {
  const value = constraints(record).delegation;
  if (!isMapping(value) || !Number.isInteger(value["maximum-children"])) {
    throw new ControlPlaneError(`${record.path}: invalid maximum-children`);
  }
  return value["maximum-children"];
}

function maxDepth(record: DurableRecord): number {
  const value = constraints(record).delegation;
  if (!isMapping(value) || !Number.isInteger(value["maximum-depth"])) {
    throw new ControlPlaneError(`${record.path}: invalid maximum-depth`);
  }
  return value["maximum-depth"];
}

function effect(record: DurableRecord): string {
  const value = constraints(record)["external-effects"];
  if (typeof value !== "string" || !(value in EFFECT_RANK)) {
    throw new ControlPlaneError(`${record.path}: unsupported external-effects policy`);
  }
  return value;
}

function yamlQuote(value: string): string {
  return JSON.stringify(value);
}

function isStrictDescendant(parent: string, candidate: string): boolean {
  const childRelative = relative(parent, candidate);
  return Boolean(childRelative) && childRelative !== ".." && !childRelative.startsWith(`..${sep}`) && !childRelative.startsWith(sep);
}

function pathExistsAsDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

function walkRecords(root: string): string[] {
  const found: string[] = [];
  function visit(directory: string): void {
    let entries;
    try { entries = readdirSync(directory, { withFileTypes: true }); } catch { return; }
    for (const entry of entries) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) visit(path);
      else if (entry.name === "tasks.md" || entry.name === "task.md" || entry.name === "as-is.md") found.push(path);
    }
  }
  visit(root);
  return found.sort();
}

export interface TaskSnapshot {
  path: string;
  status: string;
  worker: string;
  cost: UnknownRecord;
  "wall-clock": UnknownRecord;
  blockers: string[];
  decisions: UnknownRecord[];
  "next-check-in": string | null;
}

export class ControlPlane {
  readonly root: string;
  readonly rootRecordPath: string | null;
  readonly clock: Clock;

  constructor(root: string, options: { clock?: Clock } = {}) {
    this.root = resolve(root);
    const durableRoot = join(this.root, "as-is.md");
    this.rootRecordPath = existsSync(join(this.root, "tasks.md"))
      ? join(this.root, "tasks.md")
      : existsSync(join(this.root, "task.md"))
        ? join(this.root, "task.md")
        : null;
    this.clock = options.clock ?? (() => new Date());
    if (!existsSync(durableRoot)) throw new ControlPlaneError(`root durable record does not exist: ${durableRoot}`);
    const rootRecord = loadRecord(durableRoot);
    if (rootRecord.data["as-is-version"] !== 1 && rootRecord.data["as-is-version"] !== 2) {
      throw new ControlPlaneError(`root durable record has unsupported as-is-version: ${durableRoot}`);
    }
    if (existsSync(this.rootRecordPath) && !isTaskRecord(loadRecord(this.rootRecordPath))) {
      throw new ControlPlaneError(`root task record is invalid: ${this.rootRecordPath}`);
    }
  }

  private records(): DurableRecord[] {
    const records: DurableRecord[] = [];
    for (const path of walkRecords(this.root)) {
      try {
        const record = loadRecord(path);
        if (isTaskRecord(record) && (path === this.rootRecordPath || path.endsWith("/tasks.md") || path.endsWith("\\tasks.md") || path.endsWith("/task.md") || path.endsWith("\\task.md") || path.endsWith("/as-is.md") || path.endsWith("\\as-is.md"))) records.push(record);
      } catch (error) {
        if (path === this.rootRecordPath) throw error;
        let raw = "";
        try {
          raw = readFileSync(path, "utf8");
        } catch {
          throw error;
        }
        if (/^as-is-version:\s*/m.test(raw)) throw error;
        // Agent definitions and other Markdown files may use the same filename.
      }
    }
    return records;
  }

  private recordFor(component: string): DurableRecord {
    let candidate = resolve(this.root, component);
    if (pathExistsAsDirectory(candidate)) candidate = join(candidate, "as-is.md");
    const outside = relative(this.root, candidate);
    if (outside === ".." || outside.startsWith(`..${sep}`) || outside.startsWith(sep)) {
      throw new ControlPlaneError("component is outside the root task scope");
    }
    if (candidate !== (this.rootRecordPath ?? join(this.root, "as-is.md")) && !existsSync(candidate)) {
      throw new ControlPlaneError(`component task record does not exist: ${candidate}`);
    }
    const record = loadRecord(candidate);
    if (!isTaskRecord(record)) throw new ControlPlaneError(`not a task record: ${candidate}`);
    return record;
  }

  private rootRecord(): DurableRecord {
    return loadRecord(this.rootRecordPath ?? join(this.root, "as-is.md"));
  }

  private now(): string {
    return utcString(this.clock());
  }

  private writeEvent(record: DurableRecord, event: UnknownRecord): DurableRecord {
    const checkpoint = { ...event };
    checkpoint.checkpoint ??= this.now();
    const body = appendEvent(record.body, checkpoint);
    atomicWrite(record.path, renderRecord(record, body, null, checkpoint.checkpoint));
    return loadRecord(record.path);
  }

  private transition(record: DurableRecord, status: string): DurableRecord {
    if (!STATUSES.has(status)) throw new ControlPlaneError(`unsupported task status: ${status}`);
    if (record.status === status) return record;
    const allowed: Record<string, Set<string>> = {
      ready: new Set(["active", "cancelled"]),
      active: new Set(["blocked", "awaiting-approval", "completed", "failed", "cancelled"]),
      blocked: new Set(["active", "cancelled"]),
      "awaiting-approval": new Set(["active", "cancelled"]),
      failed: new Set(["active", "cancelled"]),
      completed: new Set(),
      cancelled: new Set(),
    };
    if (!allowed[record.status]?.has(status)) {
      throw new ControlPlaneError(`cannot transition ${JSON.stringify(record.status)} to ${JSON.stringify(status)}`);
    }
    const checkpoint = this.now();
    atomicWrite(record.path, renderRecord(record, record.body, status, checkpoint));
    return loadRecord(record.path);
  }

  private descendants(parent: DurableRecord, records?: DurableRecord[]): DurableRecord[] {
    const values = records ?? this.records();
    return values
      .filter((record) => record.path !== parent.path && isStrictDescendant(parent.directory, record.directory))
      .sort((a, b) => a.path.localeCompare(b.path));
  }

  private directChildren(parent: DurableRecord, records?: DurableRecord[]): DurableRecord[] {
    const values = records ?? this.records();
    return values
      .filter((record) => record.path !== parent.path && dirname(record.path) === parent.directory)
      .sort((a, b) => a.path.localeCompare(b.path));
  }

  private rootMaxConcurrent(): number {
    const config = this.rootRecord().data.config;
    const configMap = isMapping(config) ? config : {};
    const scheduling = isMapping(configMap.scheduling) ? configMap.scheduling :
      (isMapping(configMap.tasks) && isMapping(configMap.tasks.scheduling) ? configMap.tasks.scheduling : {});
    const value = scheduling.maxConcurrentTasks;
    if (value === undefined) return 1;
    if (!Number.isInteger(value) || value < 1) {
      throw new ControlPlaneError("config.scheduling.maxConcurrentTasks must be a positive integer");
    }
    return value;
  }

  private leaf(record: DurableRecord, records: DurableRecord[]): boolean {
    return this.descendants(record, records).length === 0;
  }

  private checkLeafSlot(target: DurableRecord, records?: DurableRecord[]): void {
    const values = records ?? this.records();
    if (!this.leaf(target, values)) return;
    const limit = this.rootMaxConcurrent();
    const activeLeaves = values.filter((record) => record.status === "active" && this.leaf(record, values)).length;
    if (target.status !== "active" && activeLeaves >= limit) {
      throw new ControlPlaneError(`maxConcurrentTasks=${limit} permits no additional active leaf; parent orchestration remains queued`);
    }
  }

  private validateProposal(record: DurableRecord, proposal: UnknownRecord | undefined): void {
    if (!proposal) return;
    const unknown = Object.keys(proposal).filter((key) => !["external-effects", "maxConcurrentTasks"].includes(key));
    if (unknown.length) throw new ControlPlaneError(`unsupported constraint proposal: ${unknown.sort().join(", ")}`);
    if (Object.hasOwn(proposal, "external-effects")) {
      const proposed = proposal["external-effects"];
      if (typeof proposed !== "string" || !(proposed in EFFECT_RANK)) {
        throw new ControlPlaneError("unsupported proposed external-effects policy");
      }
      if (EFFECT_RANK[proposed] > EFFECT_RANK[effect(record)]) {
        throw new ControlPlaneError("answer would weaken the higher-authority external-effects constraint");
      }
    }
    if (Object.hasOwn(proposal, "maxConcurrentTasks")) {
      const proposed = proposal.maxConcurrentTasks;
      if (!Number.isInteger(proposed) || proposed < 1) {
        throw new ControlPlaneError("proposed maxConcurrentTasks must be a positive integer");
      }
      if (proposed > this.rootMaxConcurrent()) {
        throw new ControlPlaneError("answer would weaken the higher-authority concurrency constraint");
      }
    }
  }

  status(): UnknownRecord {
    const records = this.records();
    const root = loadRecord(join(this.root, "as-is.md"));
    const config = root.data.config;
    const configMap = isMapping(config) ? config : {};
    const scheduling = isMapping(configMap.scheduling) ? configMap.scheduling :
      (isMapping(configMap.tasks) && isMapping(configMap.tasks.scheduling) ? configMap.tasks.scheduling : {});
    const configuredInterval = scheduling.checkInSeconds ?? (isMapping(configMap.tasks) && isMapping(configMap.tasks.scheduling) ? configMap.tasks.scheduling.checkInSeconds : undefined);
    const interval = Number.isInteger(configuredInterval) && configuredInterval > 0 ? configuredInterval : null;
    const snapshots: TaskSnapshot[] = [];

    for (const record of records) {
      const [cost, wall] = recordBudget(record);
      let nextCheckIn: string | null = null;
      if (record.status === "active" && interval !== null) {
        try {
          nextCheckIn = utcString(new Date(timestamp(record.updated).valueOf() + interval * 1000));
        } catch {
          nextCheckIn = null;
        }
      }
      const relativePath = record.path === (this.rootRecordPath ?? join(this.root, "as-is.md")) ? "." : relative(this.root, record.directory).split(sep).join("/");
      const recordEvents = events(record.body);
      const decisions = recordEvents.filter((event) => ["question", "answer", "direction", "approval", "cancellation", "constraint-rejection"].includes(event.event));
      const recordBlockers = blockers(record.body);
      const completedQuestions = new Set(
        recordEvents
          .filter((event) => ["answer", "direction", "approval"].includes(event.event))
          .map((event) => event["question-id"]),
      );
      for (const event of recordEvents) {
        if (event.event === "question" && !completedQuestions.has(event.id)) {
          recordBlockers.push(`${event["approval-required"] ? "approval required" : "answer required"}: ${event.question}`);
        }
      }
      snapshots.push({
        path: relativePath,
        status: record.status,
        worker: record.worker,
        cost: observedBudget(cost, "spent"),
        "wall-clock": observedBudget(wall, "spent-seconds"),
        blockers: recordBlockers,
        decisions,
        "next-check-in": nextCheckIn,
      });
    }
    const active = snapshots.filter((snapshot) => snapshot.status === "active");
    const delegated = snapshots.filter((snapshot) => snapshot.path !== ".");
    const nextCheckIns = active.map((snapshot) => snapshot["next-check-in"]).filter((value): value is string => value !== null);
    return {
      root: ".",
      "active-tasks": active,
      "delegated-tasks": delegated,
      tasks: snapshots,
      "configured-max-concurrent-tasks": this.rootMaxConcurrent(),
      "next-check-in": nextCheckIns.length ? nextCheckIns.sort()[0] : null,
      source: "repository task records only",
    };
  }

  generalQuestion(question: string): UnknownRecord {
    if (!question.trim()) throw new ControlPlaneError("general question must not be empty");
    const report = this.status();
    const lowered = question.toLowerCase();
    const answer = ["status", "progress", "budget", "check-in", "checkin"].some((word) => lowered.includes(word))
      ? JSON.stringify(sortedJson(report))
      : "No record-backed answer is available for this general question. It was not persisted as worker direction and no task was changed.";
    return {
      kind: "read-only-general-question",
      question,
      answer,
      "read-only": true,
      changed: false,
      sources: ["root and component as-is.md task records"],
    };
  }

  recordQuestion(component: string, question: string, options: { approvalRequired?: boolean } = {}): string {
    if (!question.trim()) throw new ControlPlaneError("question must not be empty");
    let record = this.recordFor(component);
    if (record.status !== "active") throw new ControlPlaneError("only an active task can record a new question");
    const approvalRequired = options.approvalRequired ?? false;
    const questionId = `q-${createHash("sha256").update(`${relative(this.root, record.path)}\0${record.updated}\0${question}\0${events(record.body).length}`).digest("hex").slice(0, 12)}`;
    record = this.writeEvent(record, {
      event: "question",
      id: questionId,
      kind: approvalRequired ? "approval-request" : "worker-question",
      question,
      "approval-required": approvalRequired,
      "status-before": record.status,
    });
    this.transition(record, approvalRequired ? "awaiting-approval" : "blocked");
    return questionId;
  }

  private question(record: DurableRecord, questionId: string): UnknownRecord {
    const questions = events(record.body).filter((event) => event.event === "question" && event.id === questionId);
    if (!questions.length) throw new ControlPlaneError(`unknown durable question: ${questionId}`);
    const question = questions[questions.length - 1];
    const followups = events(record.body).filter((event) => event["question-id"] === questionId);
    if (followups.some((event) => ["answer", "direction", "approval"].includes(event.event))) {
      throw new ControlPlaneError(`durable question already has a response: ${questionId}`);
    }
    return question;
  }

  answerQuestion(component: string, questionId: string, answer: string, options: { direction?: boolean; proposedConstraints?: UnknownRecord } = {}): void {
    if (!answer.trim()) throw new ControlPlaneError("answer must not be empty");
    let record = this.recordFor(component);
    const question = this.question(record, questionId);
    if (question["approval-required"]) throw new ControlPlaneError("approval-required question must be answered with approve");
    this.validateProposal(record, options.proposedConstraints);
    record = this.writeEvent(record, {
      event: options.direction ? "direction" : "answer",
      "question-id": questionId,
      answer,
      "proposed-constraints": options.proposedConstraints ?? {},
    });
    record = this.recordFor(component);
    this.checkLeafSlot(record);
    this.transition(record, "active");
  }

  requestApproval(component: string, effectDescription: string): string {
    if (!effectDescription.trim()) throw new ControlPlaneError("approval effect must not be empty");
    return this.recordQuestion(component, effectDescription, { approvalRequired: true });
  }

  approve(component: string, questionId: string, approval: string, options: { proposedConstraints?: UnknownRecord } = {}): void {
    if (!approval.trim()) throw new ControlPlaneError("approval must not be empty");
    let record = this.recordFor(component);
    const question = this.question(record, questionId);
    if (!question["approval-required"]) throw new ControlPlaneError("durable question does not require approval");
    this.validateProposal(record, options.proposedConstraints);
    record = this.writeEvent(record, {
      event: "approval",
      "question-id": questionId,
      approval,
      "proposed-constraints": options.proposedConstraints ?? {},
    });
    record = this.recordFor(component);
    this.checkLeafSlot(record);
    this.transition(record, "active");
  }

  cancel(component: string, reason: string): void {
    if (!reason.trim()) throw new ControlPlaneError("cancellation reason must not be empty");
    let record = this.recordFor(component);
    if (TERMINAL.has(record.status)) throw new ControlPlaneError("terminal tasks cannot be cancelled again");
    record = this.writeEvent(record, { event: "cancellation", reason, "status-before": record.status });
    this.transition(record, "cancelled");
  }

  activate(component: string): void {
    const record = this.recordFor(component);
    if (!["ready", "blocked", "awaiting-approval", "failed"].includes(record.status)) {
      throw new ControlPlaneError(`task is not recoverable/launchable from ${JSON.stringify(record.status)}`);
    }
    this.checkLeafSlot(record);
    this.transition(record, "active");
  }

  canComplete(component: string): UnknownRecord {
    const parent = this.recordFor(component);
    const descendants = this.descendants(parent);
    const result = section(parent.body, "Result");
    const nonTerminal = descendants
      .filter((record) => !TERMINAL.has(record.status))
      .map((record) => relative(parent.directory, record.directory).split(sep).join("/"));
    const unaccounted = descendants
      .filter((record) => ["failed", "cancelled"].includes(record.status))
      .map((record) => relative(parent.directory, record.directory).split(sep).join("/"))
      .filter((path) => !result.includes(path));
    return {
      eligible: !nonTerminal.length && !unaccounted.length,
      "non-terminal-descendants": nonTerminal,
      "unaccounted-failed-or-cancelled-descendants": unaccounted,
    };
  }

  complete(component: string, result: string): void {
    if (!result.trim()) throw new ControlPlaneError("completion result must not be empty");
    let record = this.recordFor(component);
    if (record.status !== "active") throw new ControlPlaneError("only an active task can complete");
    const closure = this.canComplete(component) as {
      "non-terminal-descendants": string[];
      "unaccounted-failed-or-cancelled-descendants": string[];
      eligible: boolean;
    };
    const missingAccounting = closure["unaccounted-failed-or-cancelled-descendants"].filter((path) => !result.includes(path));
    if (closure["non-terminal-descendants"].length || missingAccounting.length) {
      throw new ControlPlaneError(`descendant closure is not complete: ${JSON.stringify({ ...closure, "unaccounted-failed-or-cancelled-descendants": missingAccounting, eligible: false })}`);
    }
    record = this.writeEvent(record, { event: "completion-result", result });
    record = this.recordFor(component);
    const body = appendResult(record.body, result);
    atomicWrite(record.path, renderRecord(record, body, null, this.now()));
    this.transition(this.recordFor(component), "completed");
  }

  private childRecordText(options: {
    childName: string;
    worker: string;
    updated: string;
    allocatedCost: number;
    costReserve: number;
    allocatedWall: number;
    wallReserve: number;
    maximumDepth: number;
    maximumChildren: number;
    externalEffects: string;
    requirement: string;
    acceptance: string[];
    parent: string;
  }): string {
    const acceptanceLines = options.acceptance.map((item) => `  - ${yamlQuote(item)}`).join("\n");
    const delegated = eventLine({
      event: "delegated",
      by: "parent-builder",
      parent: options.parent,
      execution: "queued",
      maxConcurrentTasks: 1,
    });
    return `---
as-is-version: 2
task:
  status: ready
  worker: ${yamlQuote(options.worker)}
  updated: ${options.updated}
constraints:
  cost:
    currency: USD
    allocated: ${options.allocatedCost}
    spent: 0
    reserve: ${options.costReserve}
    source: unavailable
    fallback-metric: unavailable
  delegation:
    maximum-depth: ${options.maximumDepth}
    maximum-children: ${options.maximumChildren}
  execution:
    wall-clock:
      allocated-seconds: ${options.allocatedWall}
      spent-seconds: 0
      reserve-seconds: ${options.wallReserve}
      source: unavailable
  external-effects: ${options.externalEffects}
acceptance:
${acceptanceLines}
---
# ${options.childName}

## Purpose

Provide a bounded child component for parent-builder delegation.

## Requirement

${options.requirement}

## Plan

The configured worker performs only this child scope and records its durable handoff.

## Progress

Created in \`ready\` state by the parent builder; execution remains queued while
the effective leaf limit is \`maxConcurrentTasks: 1\`.

## Validation

Not yet run.

## Result

Not yet available.

## Blockers And Escalations

None.

## Recovery

Recover from this record and preserve its independent allocation; do not infer
completion from a host process or private runtime state.

## Control Plane

${delegated}

## Next Action

The parent builder observes this record and activates it only when the
configured leaf slot is available.
`;
  }

  delegate(parent: string, child: string, options: {
    requirement: string;
    acceptance: string[];
    allocatedCost: number;
    costReserve: number;
    allocatedWall: number;
    wallReserve: number;
    worker?: string;
    externalEffects?: string;
    delegatedBy?: string;
  }): string {
    const delegatedBy = options.delegatedBy ?? "parent-builder";
    if (delegatedBy !== "parent-builder") throw new ControlPlaneError("new parallel work must be requested by parent-builder");
    if (this.rootMaxConcurrent() !== 1) throw new ControlPlaneError("initiative 1 requires config.scheduling.maxConcurrentTasks to remain 1");
    if (!options.requirement.trim() || !options.acceptance.length || options.acceptance.some((item) => !item.trim())) {
      throw new ControlPlaneError("delegated requirement and acceptance must be non-empty");
    }
    if (typeof options.allocatedCost !== "number" || options.allocatedCost <= 0) throw new ControlPlaneError("child allocated cost must be positive");
    if (typeof options.costReserve !== "number" || options.costReserve < 0 || options.costReserve > options.allocatedCost) {
      throw new ControlPlaneError("child cost reserve must fit its allocation");
    }
    if (!Number.isInteger(options.allocatedWall) || options.allocatedWall <= 0) throw new ControlPlaneError("child allocated wall-clock must be positive");
    if (!Number.isInteger(options.wallReserve) || options.wallReserve < 0 || options.wallReserve > options.allocatedWall) {
      throw new ControlPlaneError("child wall-clock reserve must fit its allocation");
    }
    let parentRecord = this.recordFor(parent);
    if (!["active", "blocked", "awaiting-approval"].includes(parentRecord.status)) throw new ControlPlaneError("only a live parent task can delegate");
    const parentMaximumDepth = maxDepth(parentRecord);
    const parentChildrenLimit = maxChildren(parentRecord);
    if (parentMaximumDepth <= 0) throw new ControlPlaneError("parent maximum-depth does not permit a child");
    const records = this.records();
    const children = this.directChildren(parentRecord, records);
    if (children.length >= parentChildrenLimit) throw new ControlPlaneError("parent maximum-children does not permit another child");
    const parentCost = resource(constraints(parentRecord), "cost");
    const execution = resource(constraints(parentRecord), "execution");
    const parentWall = execution["wall-clock"];
    if (!isMapping(parentWall)) throw new ControlPlaneError("parent has no allocatable wall-clock budget");
    const existingCost = children.reduce((sum, item) => sum + Number(resource(constraints(item), "cost").allocated ?? 0), 0);
    const existingWall = children.reduce((sum, item) => sum + Number(resource(resource(constraints(item), "execution"), "wall-clock")["allocated-seconds"] ?? 0), 0);
    const remainingCost = Number(parentCost.allocated ?? 0) - Number(parentCost.spent ?? 0) - Number(parentCost.reserve ?? 0);
    const remainingWall = Number(parentWall["allocated-seconds"] ?? 0) - Number(parentWall["spent-seconds"] ?? 0) - Number(parentWall["reserve-seconds"] ?? 0);
    if (existingCost + options.allocatedCost > remainingCost) throw new ControlPlaneError("child cost allocations exceed parent remaining budget");
    if (existingWall + options.allocatedWall > remainingWall) throw new ControlPlaneError("child wall-clock allocations exceed parent remaining budget");
    const externalEffects = options.externalEffects ?? effect(parentRecord);
    if (!(externalEffects in EFFECT_RANK) || EFFECT_RANK[externalEffects] > EFFECT_RANK[effect(parentRecord)]) {
      throw new ControlPlaneError("child external-effects policy weakens its parent");
    }
    const worker = options.worker ?? "component-builder";
    if (!worker.trim()) throw new ControlPlaneError("child worker must be non-empty");

    const childDir = resolve(parentRecord.directory, child);
    if (dirname(childDir) !== resolve(parentRecord.directory)) throw new ControlPlaneError("parallel child components must be independent immediate child scopes");
    if (childDir === resolve(parentRecord.directory) || ["", ".", ".."].includes(childDir.split(sep).pop() ?? "")) {
      throw new ControlPlaneError("child component path is invalid");
    }
    if (existsSync(childDir)) throw new ControlPlaneError(`child component already exists: ${childDir}`);
    if (!pathExistsAsDirectory(dirname(childDir))) throw new ControlPlaneError("child parent directory must already exist");

    const requestId = `d-${createHash("sha256").update(`${parentRecord.path}\0${childDir}\0${options.requirement}\0${children.length}`).digest("hex").slice(0, 12)}`;
    parentRecord = this.writeEvent(parentRecord, {
      event: "delegation-request",
      id: requestId,
      by: "parent-builder",
      child: relative(parentRecord.directory, childDir).split(sep).join("/"),
      execution: "queued",
      maxConcurrentTasks: 1,
      "allocated-cost": options.allocatedCost,
      "allocated-wall-clock": options.allocatedWall,
    });
    let createdDir = false;
    try {
      mkdirSync(childDir);
      createdDir = true;
      atomicWrite(join(childDir, "as-is.md"), this.childRecordText({
        childName: childDir.split(sep).pop()!,
        worker,
        updated: this.now(),
        allocatedCost: options.allocatedCost,
        costReserve: options.costReserve,
        allocatedWall: options.allocatedWall,
        wallReserve: options.wallReserve,
        maximumDepth: parentMaximumDepth - 1,
        maximumChildren: parentChildrenLimit,
        externalEffects,
        requirement: options.requirement,
        acceptance: options.acceptance,
        parent: relative(this.root, parentRecord.directory).split(sep).join("/") || ".",
      }));
    } catch (error) {
      if (createdDir) {
        try {
          rmdirSync(childDir);
        } catch {
          // Preserve a non-empty partial child for recovery/audit.
        }
      }
      const latest = this.recordFor(parentRecord.directory);
      this.writeEvent(latest, { event: "delegation-failed", id: requestId, reason: "child creation failed" });
      throw error;
    }
    const latest = this.recordFor(parentRecord.directory);
    this.writeEvent(latest, {
      event: "delegation-committed",
      id: requestId,
      child: relative(parentRecord.directory, childDir).split(sep).join("/"),
      execution: "queued",
      maxConcurrentTasks: 1,
    });
    return childDir;
  }
}

function jsonPrint(value: unknown): void {
  console.log(JSON.stringify(value, null, 2));
}

function optionValues(args: string[]): { positional: string[]; flags: Set<string>; values: Map<string, string[]> } {
  const positional: string[] = [];
  const flags = new Set<string>();
  const values = new Map<string, string[]>();
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith("--")) {
      positional.push(arg);
      continue;
    }
    const key = arg.slice(2);
    if (["approval", "direction"].includes(key)) flags.add(key);
    else {
      const value = args[++index];
      if (value === undefined) throw new ControlPlaneError(`missing value for --${key}`);
      values.set(key, [...(values.get(key) ?? []), value]);
    }
  }
  return { positional, flags, values };
}

export function main(argv: string[] = process.argv.slice(2)): number {
  try {
    const [command, ...rest] = argv;
    if (!command) throw new ControlPlaneError("a command is required");
    const parsed = optionValues(rest);
    const positional = parsed.positional;
    const root = positional[0];
    if (!root) throw new ControlPlaneError("root task record path is required");
    const control = new ControlPlane(root);
    if (command === "status") jsonPrint(control.status());
    else if (command === "general-question") jsonPrint(control.generalQuestion(positional[1] ?? ""));
    else if (command === "can-complete") jsonPrint(control.canComplete(positional[1] ?? ""));
    else if (command === "cancel") {
      control.cancel(positional[1] ?? "", positional[2] ?? "");
      jsonPrint({ status: "cancelled", component: positional[1] });
    } else if (command === "question") {
      const questionId = control.recordQuestion(positional[1] ?? "", positional[2] ?? "", { approvalRequired: parsed.flags.has("approval") });
      jsonPrint({ "question-id": questionId, status: parsed.flags.has("approval") ? "awaiting-approval" : "blocked" });
    } else if (command === "answer" || command === "approve") {
      const proposalText = parsed.values.get("proposed-constraints")?.[0] ?? "{}";
      const proposal = JSON.parse(proposalText);
      if (!isMapping(proposal)) throw new ControlPlaneError("--proposed-constraints must be a JSON object");
      if (command === "answer") control.answerQuestion(positional[1] ?? "", positional[2] ?? "", positional[3] ?? "", { direction: parsed.flags.has("direction"), proposedConstraints: proposal });
      else control.approve(positional[1] ?? "", positional[2] ?? "", positional[3] ?? "", { proposedConstraints: proposal });
      jsonPrint({ status: "active", component: positional[1] });
    } else if (command === "activate") {
      control.activate(positional[1] ?? "");
      jsonPrint({ status: "active", component: positional[1] });
    } else if (command === "complete") {
      control.complete(positional[1] ?? "", positional[2] ?? "");
      jsonPrint({ status: "completed", component: positional[1] });
    } else if (command === "delegate") {
      const child = control.delegate(positional[1] ?? "", positional[2] ?? "", {
        requirement: parsed.values.get("requirement")?.[0] ?? "",
        acceptance: parsed.values.get("acceptance") ?? [],
        allocatedCost: Number(parsed.values.get("cost")?.[0]),
        costReserve: Number(parsed.values.get("cost-reserve")?.[0]),
        allocatedWall: Number(parsed.values.get("wall-clock")?.[0]),
        wallReserve: Number(parsed.values.get("wall-clock-reserve")?.[0]),
        worker: parsed.values.get("worker")?.[0],
        externalEffects: parsed.values.get("external-effects")?.[0],
      });
      jsonPrint({ status: "ready", execution: "queued", child });
    } else throw new ControlPlaneError(`unsupported command: ${command}`);
    return 0;
  } catch (error) {
    const message = error instanceof ControlPlaneError ? error.message : String(error);
    console.error(`control-plane: ${message}`);
    return 2;
  }
}

if (import.meta.main) process.exitCode = main();
