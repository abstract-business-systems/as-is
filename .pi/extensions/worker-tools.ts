import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createHash, randomUUID } from "node:crypto";
import {
  createAgentSession,
  createExtensionRuntime,
  SessionManager,
  type ResourceLoader,
  type ToolDefinition,
  type ExtensionAPI,
} from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { emitTrace } from "../../observability/tracer.ts";

const workerRolePath = ".agents/agents/worker/agent.md";
const maxResultCharacters = 12_000;
const defaultTimeoutMs = 60_000;

type TraceContext = {
  traceId?: string;
  runId?: string;
  parentSessionId?: string;
};

type TraceEvent = {
  name: string;
  timestamp: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  attributes: Record<string, string | number | boolean | undefined>;
};

function newId(): string {
  return randomUUID().replaceAll("-", "");
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

async function readTraceEvents(cwd: string): Promise<TraceEvent[]> {
  const filePath = join(cwd, ".as-is", "tracing.jsonl");
  const events: TraceEvent[] = [];
  try {
    const lines = (await readFile(filePath, "utf8")).split("\n");
    for (const line of lines) {
      if (!line.trim()) continue;
        try {
          const event = JSON.parse(line) as TraceEvent;
          if (event && typeof event.name === "string") events.push(event);
        } catch {
          // Ignore incomplete or malformed best-effort trace lines.
        }
    }
  } catch {
    // A missing optional trace file is an empty result.
  }
  return events.sort((left, right) => left.timestamp.localeCompare(right.timestamp));
}

function boundedJson(value: unknown): string {
  return JSON.stringify(value, null, 2).slice(0, maxResultCharacters);
}

const traceQueryTools: ToolDefinition[] = [
  {
    name: "search_traces",
    label: "Search local traces",
    description: "Search bounded, redacted local trace events by name or trace ID.",
    parameters: Type.Object({
      name: Type.Optional(Type.String()),
      traceId: Type.Optional(Type.String()),
      limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
    }),
    async execute(_id, params, _signal, _update, ctx) {
      const events = await readTraceEvents(ctx.cwd);
      const matches = events.filter((event) =>
        (!params.name || event.name.includes(params.name)) &&
        (!params.traceId || event.traceId === params.traceId),
      ).slice(-(params.limit ?? 20));
      return { content: [{ type: "text", text: boundedJson(matches) }], details: { count: matches.length } };
    },
  },
  {
    name: "get_trace",
    label: "Get local trace",
    description: "Get redacted events for one local trace ID.",
    parameters: Type.Object({ traceId: Type.String(), limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })) }),
    async execute(_id, params, _signal, _update, ctx) {
      const events = (await readTraceEvents(ctx.cwd)).filter((event) => event.traceId === params.traceId).slice(-(params.limit ?? 100));
      return { content: [{ type: "text", text: boundedJson(events) }], details: { count: events.length } };
    },
  },
  {
    name: "summarize_trace",
    label: "Summarize local trace",
    description: "Summarize event names, outcomes, and durations for one local trace.",
    parameters: Type.Object({ traceId: Type.String() }),
    async execute(_id, params, _signal, _update, ctx) {
      const events = (await readTraceEvents(ctx.cwd)).filter((event) => event.traceId === params.traceId);
      const outcomes: Record<string, number> = {};
      for (const event of events) {
        const outcome = String(event.attributes?.["as_is.outcome"] ?? "unspecified");
        outcomes[outcome] = (outcomes[outcome] ?? 0) + 1;
      }
      return { content: [{ type: "text", text: boundedJson({ traceId: params.traceId, eventCount: events.length, names: [...new Set(events.map((event) => event.name))], outcomes }) }], details: { eventCount: events.length } };
    },
  },
  {
    name: "compare_traces",
    label: "Compare local traces",
    description: "Compare bounded event counts and outcomes for two local traces.",
    parameters: Type.Object({ leftTraceId: Type.String(), rightTraceId: Type.String() }),
    async execute(_id, params, _signal, _update, ctx) {
      const events = await readTraceEvents(ctx.cwd);
      const summarize = (traceId: string) => {
        const selected = events.filter((event) => event.traceId === traceId);
        return { traceId, eventCount: selected.length, names: [...new Set(selected.map((event) => event.name))] };
      };
      return { content: [{ type: "text", text: boundedJson({ left: summarize(params.leftTraceId), right: summarize(params.rightTraceId) }) }], details: {} };
    },
  },
];

async function recordTrace(event: TraceEvent, cwd: string): Promise<void> {
  await emitTrace(event, cwd);
}

function createWorkerLoader(role: string): ResourceLoader {
  return {
    getExtensions: () => ({ extensions: [], errors: [], runtime: createExtensionRuntime() }),
    getSkills: () => ({ skills: [], diagnostics: [] }),
    getPrompts: () => ({ prompts: [], diagnostics: [] }),
    getThemes: () => ({ themes: [], diagnostics: [] }),
    getAgentsFiles: () => ({ agentsFiles: [] }),
    getSystemPrompt: () => role,
    getSystemPromptSource: () => undefined,
    getAppendSystemPrompt: () => [],
    getAppendSystemPromptSources: () => [],
    extendResources: () => undefined,
    reload: async () => undefined,
  };
}

function extractWorkerText(session: { messages: Array<{ role?: string; content?: unknown }> }): string {
  const messages = [...session.messages].reverse();
  for (const message of messages) {
    if (message.role !== "assistant" || !Array.isArray(message.content)) continue;
    const text = message.content
      .filter((part): part is { type: "text"; text: string } =>
        typeof part === "object" && part !== null && (part as { type?: string }).type === "text" &&
        typeof (part as { text?: unknown }).text === "string",
      )
      .map((part) => part.text)
      .join("\n")
      .trim();
    if (text) return text.slice(0, maxResultCharacters);
  }
  return "Worker completed without a text report.";
}

const callSubagent: ToolDefinition = {
  name: "call_subagent",
  label: "Call read-only worker",
  description: "Ask a bounded read-only worker agent a question without spawning a subprocess.",
  parameters: Type.Object({
    role: Type.Optional(Type.Literal("worker")),
    task: Type.String({ description: "One bounded read-only question or investigation." }),
    timeoutMs: Type.Optional(Type.Integer({ minimum: 1_000, maximum: 120_000 })),
    traceId: Type.Optional(Type.String()),
    runId: Type.Optional(Type.String()),
  }),
  async execute(_toolCallId, params, signal, _onUpdate, ctx) {
    const callId = newId();
    const traceId = params.traceId ?? newId();
    const spanId = newId();
    const started = Date.now();
    const cwd = ctx.cwd;
    const timeoutMs = params.timeoutMs ?? defaultTimeoutMs;
    const rolePath = join(cwd, workerRolePath);

    await recordTrace({
      name: "call_subagent",
      timestamp: new Date().toISOString(),
      traceId,
      spanId,
      attributes: {
        "as_is.session_id": ctx.sessionManager.getSessionId?.() as string | undefined,
        "as_is.run_id": params.runId,
        "as_is.role": "worker",
        "as_is.call_id": callId,
        "as_is.task_digest": hash(params.task),
      },
    }, cwd);

    if (params.role && params.role !== "worker") {
      throw new Error(`Unsupported worker role: ${params.role}`);
    }

    const role = await readFile(rolePath, "utf8");
    const controller = new AbortController();
    const abortFromParent = () => controller.abort(signal?.reason);
    signal?.addEventListener("abort", abortFromParent, { once: true });

    let worker;
    try {
      const result = await createAgentSession({
        cwd,
        model: ctx.model,
        resourceLoader: createWorkerLoader(role),
        tools: ["read", "grep", "find", "ls"],
        sessionManager: SessionManager.inMemory(cwd),
        customTools: traceQueryTools,
      });
      worker = result.session;

      const prompt = `Bounded worker request (call ${callId}):\n\n${params.task}\n\nReturn only the worker report format from your role contract.`;
      await Promise.race([
        worker.prompt(prompt),
        new Promise<never>((_, reject) => {
          const timer = setTimeout(() => {
            void worker.abort();
            reject(new Error(`Worker timed out after ${timeoutMs}ms`));
          }, timeoutMs);
          timer.unref?.();
          controller.signal.addEventListener("abort", () => {
            clearTimeout(timer);
            void worker.abort();
            reject(new Error("Worker call aborted"));
          }, { once: true });
        }),
      ]);
      const report = extractWorkerText(worker);
      await recordTrace({
        name: "worker.result",
        timestamp: new Date().toISOString(),
        traceId,
        spanId: newId(),
        parentSpanId: spanId,
        attributes: {
          "as_is.role": "worker",
          "as_is.call_id": callId,
          "as_is.outcome": "success",
          "as_is.duration_ms": Date.now() - started,
          "as_is.result_digest": hash(report),
        },
      }, cwd);
      return { content: [{ type: "text", text: report }], details: { callId, traceId, durationMs: Date.now() - started } };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await recordTrace({
        name: "worker.result",
        timestamp: new Date().toISOString(),
        traceId,
        spanId: newId(),
        parentSpanId: spanId,
        attributes: {
          "as_is.role": "worker",
          "as_is.call_id": callId,
          "as_is.outcome": "failure",
          "as_is.duration_ms": Date.now() - started,
          "as_is.error_type": error instanceof Error ? error.name : "unknown",
        },
      }, cwd);
      throw new Error(`Read-only worker failed: ${message}`);
    } finally {
      signal?.removeEventListener("abort", abortFromParent);
      worker?.dispose();
    }
  },
};

export default function workerTools(pi: ExtensionAPI): void {
  pi.registerTool(callSubagent);
  for (const tool of traceQueryTools) pi.registerTool(tool);
}
