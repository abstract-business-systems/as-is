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
const MAX_CORRELATION_LENGTH = 128;
const MAX_DURATION_MS = 86_400_000;
const UNKNOWN = "unknown";

const allowedEventNames = new Set([
  "parent", "child", "failed", "reference", "worker.result", "subprocess.launch",
  "worker.lifecycle", "subprocess.exit", "subprocess.handoff", "first", "second",
  "json-authority", "control-plane.delegate", "session.lifecycle", "delegation.lifecycle",
  "child-wait", "component-build",
]);

const approvedAttributeKeys = new Set([
  "outcome", "bounded", "workerRole", "outcomeClass", "handoffClass", "launcherMode", "reason",
  "duration_ms", "as_is.outcome", "as_is.run_id", "as_is.component_path", "as_is.task_revision",
  "as_is.role", "parentJobId",
]);

const stringDomains: Record<string, Set<string>> = {
  outcome: new Set(["success", "failure"]),
  workerRole: new Set(["as-is", "component-builder", "expert", "execution-advisor", "worker"]),
  outcomeClass: new Set(["success", "failure", "budget-stopped"]),
  handoffClass: new Set(["committed", "pending-parent-integration", "not-committed", "no-separate-integration"]),
  launcherMode: new Set(["detach", "blocking"]),
  reason: new Set(["error", "cancelled", "unavailable", "rejected", "budget-stopped"]),
  "as_is.outcome": new Set(["success", "failure", "unspecified"]),
};

/** Opaque correlation text is printable ASCII without path, control, whitespace, or scheme syntax. */
const opaqueCorrelation = (value: unknown): value is string =>
  typeof value === "string" &&
  value.length > 0 &&
  value.length <= MAX_CORRELATION_LENGTH &&
  /^[\x21-\x7e]+$/u.test(value) &&
  !(/[\\/]/u).test(value) &&
  !/^[A-Za-z][A-Za-z0-9+.-]*:/u.test(value);

/** Serialize only the opaque session ID; never accept a store, path, range, or payload. */
export function serializeSessionReference(value: unknown): SessionReference | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const input = value as Record<string, unknown>;
  if (Object.keys(input).length !== 1 || !opaqueCorrelation(input.sessionId)) return undefined;
  return { sessionId: input.sessionId };
}

function projectedAttribute(key: string, value: unknown): TraceValue | undefined {
  if (!approvedAttributeKeys.has(key)) return undefined;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return undefined;
    if (key === "duration_ms" && (value < 0 || value > MAX_DURATION_MS)) return undefined;
    return value;
  }
  if (typeof value !== "string") return undefined;
  if (key === "bounded") return value === "true" || value === "false" ? value : undefined;
  return stringDomains[key]?.has(value) ? value : undefined;
}

const strictTimestamp = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|[+-]\d{2}:\d{2})$/u;

function validTimestamp(value: string): boolean {
  const match = strictTimestamp.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  const zone = match[8];
  const zoneHour = zone === "Z" ? 0 : Number(zone.slice(1, 3));
  const zoneMinute = zone === "Z" ? 0 : Number(zone.slice(4, 6));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth && hour <= 23 && minute <= 59 && second <= 59 && zoneHour <= 23 && zoneMinute <= 59 && Number.isFinite(Date.parse(value));
}

function projectedTimestamp(value: unknown): string {
  if (typeof value === "string" && validTimestamp(value)) return value;
  return new Date().toISOString();
}

function projectedEventName(value: unknown): string {
  return typeof value === "string" && allowedEventNames.has(value) ? value : UNKNOWN;
}

function projectedCorrelation(value: unknown): string {
  return opaqueCorrelation(value) ? value : UNKNOWN;
}

/** Apply one fail-closed projection before either local or external serialization. */
function projectTraceEvent(event: TraceEvent): TraceEvent {
  const source = event as unknown as Record<string, unknown>;
  const attributes: Record<string, TraceValue> = {};
  try {
    if (source.attributes && typeof source.attributes === "object" && !Array.isArray(source.attributes)) {
      for (const [key, value] of Object.entries(source.attributes as Record<string, unknown>)) {
        const projected = projectedAttribute(key, value);
        if (projected !== undefined) attributes[key] = projected;
      }
    }
  } catch {
    // Malformed runtime attributes fail closed while the event remains observable.
  }
  const durationMs = typeof source.durationMs === "number" && Number.isFinite(source.durationMs) && source.durationMs >= 0 && source.durationMs <= MAX_DURATION_MS
    ? source.durationMs
    : undefined;
  return {
    name: projectedEventName(source.name),
    timestamp: projectedTimestamp(source.timestamp),
    traceId: projectedCorrelation(source.traceId),
    spanId: projectedCorrelation(source.spanId),
    parentSpanId: source.parentSpanId === undefined ? undefined : projectedCorrelation(source.parentSpanId),
    durationMs,
    attributes,
    sessionReference: serializeSessionReference(source.sessionReference),
  };
}

const attributeValue = (value: TraceValue) =>
  typeof value === "boolean"
    ? { boolValue: value }
    : typeof value === "number"
      ? { intValue: value }
      : { stringValue: value ?? "" };

export function otlpPayload(event: TraceEvent) {
  const projected = projectTraceEvent(event);
  const start = projected.timestamp ?? new Date().toISOString();
  const startTimeUnixNano = Date.parse(start) * 1_000_000;
  const attrs = Object.entries(projected.attributes)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => ({ key, value: attributeValue(value) }));
  const reference = serializeSessionReference(projected.sessionReference);
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
          traceId: projected.traceId.slice(0, 32).padStart(32, "0"),
          spanId: projected.spanId.slice(0, 16).padStart(16, "0"),
          parentSpanId: projected.parentSpanId?.slice(0, 16).padStart(16, "0"),
          name: projected.name,
          kind: 1,
          startTimeUnixNano: String(startTimeUnixNano),
          endTimeUnixNano: String(startTimeUnixNano + (projected.durationMs ?? 0) * 1_000_000),
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
    const record = projectTraceEvent(event);
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
