import { appendFile, mkdir, rename, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { updateRuntimeMapEntryForBridge } from "./opencode-host-integration.ts";

/**
 * This is the OpenCode-specific child of the host-neutral supervisor.  The
 * supervisor starts this wrapper; the wrapper starts one real `opencode run`
 * process and records only redacted session/task metadata for the adapter.
 * No OpenCode command or event shape is imported by the generic supervisor.
 */

interface EventMetadata {
  kind: "opencode-event";
  observedAt: string;
  eventType: string;
  sessionId: string | null;
  parentSessionId: string | null;
  agent: string | null;
  target: string | null;
  model: string | null;
  tokenCount: number | null;
}

interface BridgeSummary {
  version: 1;
  source: "opencode-run-json-events";
  command: string[];
  requestedAgent: "as-is";
  componentPath: string;
  projectRoot: string;
  eventPath: string;
  summaryPath: string;
  observedAt: string;
  exitCode: number | null;
  eventCount: number;
  sessions: Array<{
    sessionId: string;
    parentSessionId: string | null;
    agent: string | null;
  }>;
  taskEvents: EventMetadata[];
  forbiddenFallbacks: string[];
  mediation: {
    asIsSessionObserved: boolean;
    orchestratorTaskObserved: boolean;
    implementerTaskObserved: boolean;
    parentAttributionObserved: boolean;
    status: "proven" | "blocked";
    blocker: string | null;
  };
  error: string | null;
}

function now(): string {
  return new Date().toISOString();
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function numberValue(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function recordValue(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function firstValue(root: unknown, keys: string[]): unknown {
  const pending: unknown[] = [root];
  const visited = new Set<object>();
  while (pending.length > 0) {
    const current = pending.shift();
    const object = recordValue(current);
    if (!object) continue;
    if (visited.has(object)) continue;
    visited.add(object);
    for (const key of keys) {
      if (key in object) return object[key];
    }
    for (const value of Object.values(object)) pending.push(value);
  }
  return null;
}

function metadata(payload: Record<string, unknown>): EventMetadata {
  const eventType = stringValue(firstValue(payload, ["type", "event", "eventType", "event_type"])) ?? "unknown";
  const sessionId = stringValue(firstValue(payload, ["sessionID", "sessionId", "session_id", "id"]));
  const parentSessionId = stringValue(firstValue(payload, ["parentID", "parentId", "parentSessionId", "parent_session_id"]));
  const agent = stringValue(firstValue(payload, ["agent", "agentName", "agent_name"]));
  const target = stringValue(firstValue(payload, ["subagent_type", "subagentType", "target", "taskTarget", "task_target"]));
  const model = stringValue(firstValue(payload, ["model", "modelID", "modelId", "model_id"]));
  const tokenCount = numberValue(firstValue(payload, ["tokens", "tokenCount", "token_count", "totalTokens", "total_tokens"]));
  return {
    kind: "opencode-event",
    observedAt: now(),
    eventType,
    sessionId,
    parentSessionId,
    agent,
    target,
    model,
    tokenCount,
  };
}

async function appendMetadata(path: string, value: unknown): Promise<void> {
  await appendFile(path, `${JSON.stringify(value)}\n`, { encoding: "utf8", mode: 0o600 });
}

async function atomicJson(path: string, value: unknown): Promise<void> {
  const temporary = `${path}.tmp-${process.pid}-${Date.now()}`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, path);
}

async function lines(stream: ReadableStream<Uint8Array>, callback: (line: string) => Promise<void>): Promise<void> {
  const decoder = new TextDecoder();
  let pending = "";
  for await (const chunk of stream as AsyncIterable<Uint8Array>) {
    pending += decoder.decode(chunk, { stream: true });
    const split = pending.split("\n");
    pending = split.pop() ?? "";
    for (const line of split) await callback(line);
  }
  pending += decoder.decode();
  if (pending) await callback(pending);
}

function argument(args: string[], name: string): string {
  const index = args.findIndex((value) => value === name || value.startsWith(`${name}=`));
  if (index < 0) throw new Error(`${name} is required`);
  const value = args[index].includes("=") ? args[index].slice(args[index].indexOf("=") + 1) : args[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${name} requires a value`);
  return value;
}

function canonicalComponentPath(projectRoot: string, componentPath: string): string {
  const root = resolve(projectRoot);
  const candidate = resolve(root, componentPath);
  if (candidate !== root && !candidate.startsWith(`${root}/`)) throw new Error("component path escapes project root");
  return candidate.slice(root.length).replace(/^\//, "") || ".";
}

function mediation(summary: Omit<BridgeSummary, "mediation">): BridgeSummary["mediation"] {
  const asIsSessionObserved = summary.sessions.some((session) => session.agent === "as-is");
  const orchestratorTaskObserved = summary.taskEvents.some((event) => event.target === "orchestrator");
  const implementerTaskObserved = summary.taskEvents.some((event) => event.target === "implementer");
  const implementer = summary.taskEvents.find((event) => event.target === "implementer");
  const orchestrator = summary.taskEvents.find((event) => event.target === "orchestrator");
  const parentAttributionObserved = Boolean(
    implementer?.parentSessionId
      && orchestrator?.sessionId
      && implementer.parentSessionId === orchestrator.sessionId,
  );
  const forbidden = summary.forbiddenFallbacks.length > 0;
  let blocker: string | null = null;
  if (forbidden) blocker = `wrong-role OpenCode task event: ${summary.forbiddenFallbacks.join(", ")}`;
  else if (!asIsSessionObserved) blocker = "OpenCode session event did not identify the requested as-is primary";
  else if (!orchestratorTaskObserved) blocker = "OpenCode event stream did not identify an orchestrator task event";
  else if (!implementerTaskObserved) blocker = "OpenCode event stream did not identify an implementer task event";
  else if (!parentAttributionObserved) blocker = "OpenCode implementer task event lacks orchestrator parent-session attribution";
  return {
    asIsSessionObserved,
    orchestratorTaskObserved,
    implementerTaskObserved,
    parentAttributionObserved,
    status: blocker ? "blocked" : "proven",
    blocker,
  };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const projectRoot = resolve(argument(args, "--project-root"));
  const componentPath = canonicalComponentPath(projectRoot, argument(args, "--component-path"));
  const stateHome = resolve(argument(args, "--state-home"));
  const attempt = Number(argument(args, "--attempt"));
  if (!Number.isInteger(attempt) || attempt < 1) throw new Error("--attempt must be a one-based integer");
  const opencodeBinary = argument(args, "--opencode-bin");
  const workspace = resolve(process.env.AS_IS_APPROVED_WORKSPACE ?? process.cwd());
  await mkdir(workspace, { recursive: true, mode: 0o700 });
  const eventPath = join(workspace, "opencode-events.jsonl");
  const summaryPath = join(workspace, "opencode-summary.json");
  const prompt = [
    `Read the durable component record for ${componentPath} from the current project.`,
    "This is a mediated non-blocking launch: as-is must route to orchestrator, and orchestrator must submit the configured implementer through opencode-launch-adapter.",
    "Do not substitute general or explore, do not direct-launch a worker, and do not treat this request or a process exit as task completion.",
  ].join(" ");
  const command = [
    opencodeBinary,
    "run",
    "--format",
    "json",
    "--agent",
    "as-is",
    "--dir",
    projectRoot,
    prompt,
  ];
  const summary: Omit<BridgeSummary, "mediation"> = {
    version: 1,
    source: "opencode-run-json-events",
    command: [opencodeBinary, "run", "--format", "json", "--agent", "as-is", "--dir", projectRoot, "<durable-mediation-request>"],
    requestedAgent: "as-is",
    componentPath,
    projectRoot,
    eventPath,
    summaryPath,
    observedAt: now(),
    exitCode: null,
    eventCount: 0,
    sessions: [],
    taskEvents: [],
    forbiddenFallbacks: [],
    error: null,
  };

  async function publish(runtimeState: "running" | "terminal" | "cancellation"): Promise<boolean> {
    const reconciliationState = runtimeState === "terminal" ? "unknown" : runtimeState === "cancellation" ? "unknown" : "live";
    try {
      return await updateRuntimeMapEntryForBridge(projectRoot, stateHome, componentPath, attempt, {
        runtimeState,
        reconciliationState,
        blocker: null,
      });
    } catch {
      return false;
    }
  }

  // Launch and map publication race: the parent writes launch-accepted after
  // the supervisor checkpoint.  Retry only this bounded local association;
  // never retry OpenCode or substitute a role.
  async function publishBounded(runtimeState: "running" | "terminal" | "cancellation"): Promise<boolean> {
    for (let retry = 0; retry < 100; retry += 1) {
      if (await publish(runtimeState)) return true;
      await Bun.sleep(10);
    }
    return false;
  }

  let cancellationSignal = false;
  process.once("SIGTERM", () => {
    cancellationSignal = true;
    void publishBounded("cancellation").finally(() => process.exit(143));
  });
  await publishBounded("running");

  let child: ReturnType<typeof Bun.spawn>;
  try {
    child = Bun.spawn(command, { cwd: projectRoot, stdin: "ignore", stdout: "pipe", stderr: "pipe" } as any);
  } catch (error) {
    summary.error = `OpenCode process unavailable: ${error instanceof Error ? error.message : String(error)}`;
    const complete = { ...summary, mediation: mediation(summary) } satisfies BridgeSummary;
    await atomicJson(summaryPath, complete);
    process.exitCode = 1;
    return;
  }

  const stdout = lines(child.stdout as ReadableStream<Uint8Array>, async (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      // Warnings are not task events and are not copied into durable state.
      await appendMetadata(eventPath, { kind: "opencode-non-json-output", observedAt: now(), length: trimmed.length });
      return;
    }
    const object = recordValue(parsed);
    if (!object) return;
    const event = metadata(object);
    summary.eventCount += 1;
    await appendMetadata(eventPath, event);
    if (event.sessionId && !summary.sessions.some((session) => session.sessionId === event.sessionId)) {
      summary.sessions.push({ sessionId: event.sessionId, parentSessionId: event.parentSessionId, agent: event.agent });
    }
    if (event.target || event.eventType.toLowerCase().includes("task")) summary.taskEvents.push(event);
    for (const value of [event.agent, event.target]) {
      if (value === "general" || value === "explore") summary.forbiddenFallbacks.push(value);
    }
  });
  const stderr = lines(child.stderr as ReadableStream<Uint8Array>, async (line) => {
    if (line.trim()) await appendMetadata(eventPath, { kind: "opencode-stderr", observedAt: now(), length: line.length });
  });
  const [exitCode] = await Promise.all([child.exited, stdout, stderr]);
  summary.exitCode = exitCode;
  await publishBounded(cancellationSignal ? "cancellation" : "terminal");
  const complete = { ...summary, mediation: mediation(summary) } satisfies BridgeSummary;
  await atomicJson(summaryPath, complete);
  if (exitCode !== 0 || complete.mediation.status !== "proven") {
    process.exitCode = 1;
  }
}

if (import.meta.main && process.argv.includes("--project-root")) await main();
