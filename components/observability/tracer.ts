import { randomUUID } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";

export type TraceValue = string | number | boolean | undefined;

export type TraceEvent = {
  name: string;
  timestamp?: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  durationMs?: number;
  attributes: Record<string, TraceValue>;
};

export type SpanOutcome = "success" | "failure";

export type SpanLifecycleOptions = {
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  cwd: string;
  config?: TracerConfig;
  now?: () => number;
  id?: () => string;
  emit?: typeof emitTrace;
};

export type SpanLifecycle = {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  startedAt: string;
  finish(outcome: SpanOutcome, attributes?: Record<string, TraceValue>): Promise<void>;
};

export type TracerConfig = {
  backend?: "disabled" | "file" | "jaeger" | "phoenix" | string;
  enabled?: boolean;
  endpoint?: string;
  directory?: string;
};

const defaultDirectory = ".as-is/tracing.jsonl";
const defaultEndpoint = "http://127.0.0.1:4318/v1/traces";

const attributeValue = (value: TraceValue) => {
  if (typeof value === "boolean") return { boolValue: value };
  if (typeof value === "number") return { intValue: value };
  return { stringValue: value ?? "" };
};

export function otlpPayload(event: TraceEvent) {
  const start = event.timestamp ?? new Date().toISOString();
  const startTimeUnixNano = Date.parse(start) * 1_000_000;
  const endTimeUnixNano = startTimeUnixNano + Math.max(0, event.durationMs ?? 0) * 1_000_000;
  return {
    resourceSpans: [{
      resource: { attributes: [{ key: "service.name", value: { stringValue: "as-is" } }] },
      scopeSpans: [{
        scope: { name: "as-is.tracing" },
        spans: [{
          traceId: event.traceId.slice(0, 32).padStart(32, "0"),
          spanId: event.spanId.slice(0, 16).padStart(16, "0"),
          parentSpanId: event.parentSpanId?.slice(0, 16).padStart(16, "0"),
          name: event.name,
          kind:  INTERNAL_KIND,
          startTimeUnixNano: String(startTimeUnixNano),
          endTimeUnixNano: String(endTimeUnixNano),
          attributes: Object.entries(event.attributes)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => ({ key, value: attributeValue(value) })),
          status: { code: 1 },
        }],
      }],
    }],
  };
}

// OTLP SpanKind.INTERNAL.
const INTERNAL_KIND = 1;

async function projectConfig(cwd: string): Promise<TracerConfig> {
  try {
    const text = await Bun.file(resolve(cwd, "as-is.md")).text();
    const block = text.match(/tracing:\r?\n((?:      [^\r\n]+\r?\n?)+)/m)?.[1] ?? "";
    const value = (name: string) => block.match(new RegExp(`^      ${name}:\\s*[\\\"']?([^\\\"'\\s#]+)[\\\"']?\\s*$`, "m"))?.[1];
    const enabled = value("enabled");
    return {
      backend: value("backend"),
      enabled: enabled === undefined ? undefined : enabled === "true",
      endpoint: value("endpoint"),
      directory: value("local-directory"),
    };
  } catch {
    return {};
  }
}

async function envConfig(cwd: string): Promise<TracerConfig> {
  const project = await projectConfig(cwd);
  return {
    ...project,
    backend: process.env.AS_IS_COMPONENT_BUILD_TRACER ?? project.backend ?? "file",
    endpoint: process.env.AS_IS_COMPONENT_BUILD_TRACER_ENDPOINT || project.endpoint,
    directory: process.env.AS_IS_COMPONENT_BUILD_TRACER_DIRECTORY || project.directory,
  };
}

/**
 * Start a bounded span and emit it when finished. This helper records only
 * lifecycle metadata and caller-supplied bounded attributes; it never captures
 * model or tool output. Emission is best effort, including custom emitters.
 */
export function startSpan(name: string, options: SpanLifecycleOptions): SpanLifecycle {
  const now = options.now ?? Date.now;
  const makeId = options.id ?? (() => randomUUID().replaceAll("-", ""));
  const startedMs = now();
  const traceId = options.traceId ?? makeId();
  const spanId = options.spanId ?? makeId();
  const startedAt = new Date(startedMs).toISOString();
  let finished = false;

  return {
    traceId,
    spanId,
    parentSpanId: options.parentSpanId,
    startedAt,
    async finish(outcome, attributes = {}) {
      if (finished) return;
      finished = true;
      const durationMs = Math.max(0, now() - startedMs);
      const emitter = options.emit ?? emitTrace;
      try {
        await emitter({ name, timestamp: startedAt, traceId, spanId, parentSpanId: options.parentSpanId, durationMs, attributes: { ...attributes, outcome } }, options.cwd, options.config);
      } catch {
        // A custom emitter must not make instrumented work fail.
      }
    },
  };
}

/** Emit one redacted event. Telemetry failures are intentionally swallowed. */
export async function emitTrace(event: TraceEvent, cwd: string, config?: TracerConfig): Promise<void> {
  const resolved = config ?? await envConfig(cwd);
  if (resolved.enabled === false || resolved.backend === "disabled") return;
  try {
    const backend = resolved.backend ?? "file";
    if (backend === "file") {
      const directory = resolve(cwd, resolved.directory ?? defaultDirectory);
      const filePath = directory.endsWith(".jsonl") ? directory : join(directory, "trace.jsonl");
      await mkdir(resolve(filePath, ".."), { recursive: true });
      await appendFile(filePath, `${JSON.stringify({
        ...event,
        timestamp: event.timestamp ?? new Date().toISOString(),
      })}\n`);
      return;
    }
    if (backend === "jaeger" || backend === "phoenix") {
      await fetch(resolved.endpoint ?? defaultEndpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(otlpPayload(event)),
      });
    }
  } catch {
    // Observability is best effort and never blocks execution.
  }
}
