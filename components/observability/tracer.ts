import { randomUUID } from "node:crypto";
import { appendFile, chmod, mkdir, readdir, stat, unlink } from "node:fs/promises";
import { join, resolve } from "node:path";

export type TraceValue = string | number | boolean | undefined;
export type SessionReference = { sessionId: string };
export type TraceEvent = {
  name: string;
  timestamp?: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  durationMs?: number;
  attributes: Record<string, TraceValue>;
  sessionReference?: SessionReference;
};
export type SpanOutcome = "success" | "failure";
export type SpanLifecycleOptions = {
  traceId?: string;
  sessionReference?: SessionReference;
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
  maxFileBytes?: number;
  retentionDays?: number;
};

const defaultDirectory = ".as-is/tracing.jsonl";
const defaultEndpoint = "http://127.0.0.1:4318/v1/traces";
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const RETENTION_DAYS = 7;
const MAX_SESSION_ID_BYTES = 128;

const sessionId = (value: unknown): value is string =>
  typeof value === "string" &&
  new TextEncoder().encode(value).byteLength <= MAX_SESSION_ID_BYTES &&
  !(/[\\/\u0000]/u).test(value) &&
  !/^[A-Za-z][A-Za-z0-9+.-]*:/u.test(value);

/** Serialize only the opaque session ID; never accept a store, path, range, or payload. */
export function serializeSessionReference(value: unknown): SessionReference | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const input = value as Record<string, unknown>;
  if (Object.keys(input).length !== 1 || !sessionId(input.sessionId)) return undefined;
  return { sessionId: input.sessionId };
}

const attributeValue = (value: TraceValue) =>
  typeof value === "boolean"
    ? { boolValue: value }
    : typeof value === "number"
      ? { intValue: value }
      : { stringValue: value ?? "" };

export function otlpPayload(event: TraceEvent) {
  const start = event.timestamp ?? new Date().toISOString();
  const startTimeUnixNano = Date.parse(start) * 1_000_000;
  const attrs = Object.entries(event.attributes)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => ({ key, value: attributeValue(value) }));
  const reference = serializeSessionReference(event.sessionReference);
  if (reference) {
    // External sinks receive the correlation ID only. They never receive a
    // session-store reference or content resolved from the local session.
    attrs.push({ key: "session.id", value: { stringValue: reference.sessionId } });
  }
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
          kind: 1,
          startTimeUnixNano: String(startTimeUnixNano),
          endTimeUnixNano: String(startTimeUnixNano + Math.max(0, event.durationMs ?? 0) * 1_000_000),
          attributes: attrs,
          status: { code: 1 },
        }],
      }],
    }],
  };
}

async function projectConfig(cwd: string): Promise<TracerConfig> {
  try {
    const data = JSON.parse(await Bun.file(resolve(cwd, "as-is.json")).text()) as { configuration?: { observability?: { tracing?: Record<string, unknown> } } };
    const tracing = data.configuration?.observability?.tracing ?? {};
    return {
      backend: typeof tracing.backend === "string" ? tracing.backend : undefined,
      enabled: typeof tracing.enabled === "boolean" ? tracing.enabled : undefined,
      endpoint: typeof tracing.endpoint === "string" ? tracing.endpoint : undefined,
      directory: typeof tracing["local-directory"] === "string" ? tracing["local-directory"] : undefined,
      maxFileBytes: typeof tracing["max-file-bytes"] === "number" ? tracing["max-file-bytes"] : undefined,
      retentionDays: typeof tracing["retention-days"] === "number" ? tracing["retention-days"] : undefined,
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
      try {
        await (options.emit ?? emitTrace)({
          name,
          timestamp: startedAt,
          traceId,
          spanId,
          parentSpanId: options.parentSpanId,
          durationMs: Math.max(0, now() - startedMs),
          attributes: { ...attributes, outcome },
          sessionReference: options.sessionReference,
        }, options.cwd, options.config);
      } catch {
        // Telemetry never blocks execution.
      }
    },
  };
}

async function cleanup(filePath: string, days: number) {
  try {
    const cutoff = Date.now() - days * 86400000;
    const files = filePath.endsWith(".jsonl") ? [filePath] : (await readdir(filePath)).map(file => join(filePath, file));
    for (const file of files) if ((await stat(file)).mtimeMs < cutoff) await unlink(file);
  } catch {
    // Best effort retention cleanup.
  }
}

export async function emitTrace(event: TraceEvent, cwd: string, config?: TracerConfig): Promise<void> {
  const resolved = config ?? await envConfig(cwd);
  if (resolved.enabled === false || resolved.backend === "disabled") return;
  try {
    const backend = resolved.backend ?? "file";
    const record = {
      ...event,
      sessionReference: serializeSessionReference(event.sessionReference),
      timestamp: event.timestamp ?? new Date().toISOString(),
    };
    if (backend === "file") {
      const output = resolve(cwd, resolved.directory ?? defaultDirectory);
      const filePath = output.endsWith(".jsonl") ? output : join(output, "trace.jsonl");
      const encoded = `${JSON.stringify(record)}\n`;
      await mkdir(resolve(filePath, ".."), { recursive: true });
      await cleanup(filePath, resolved.retentionDays ?? RETENTION_DAYS);
      const current = (await stat(filePath).catch(() => ({ size: 0 }))).size;
      if (current + Buffer.byteLength(encoded) <= (resolved.maxFileBytes ?? MAX_FILE_BYTES)) {
        await appendFile(filePath, encoded, { mode: 0o600 });
        await chmod(filePath, 0o600);
      }
      return;
    }
    if (backend === "jaeger" || backend === "phoenix") {
      await fetch(resolved.endpoint ?? defaultEndpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(otlpPayload(record)),
      });
    }
  } catch {
    // Telemetry failures never alter execution.
  }
}
