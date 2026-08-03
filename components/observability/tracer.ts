import { randomUUID } from "node:crypto";
import { appendFile, chmod, mkdir, readdir, stat, unlink } from "node:fs/promises";
import { join, resolve } from "node:path";

export type TraceValue = string | number | boolean | undefined;
export type PayloadClass = "prompt" | "response" | "tool-argument" | "tool-result" | "stdout" | "stderr" | "exception" | "secret" | "personal";
export type RawPayload = { class: PayloadClass; content: string };
export type SessionStore = "project-local" | "host-local";
export type SessionAvailability = "available" | "missing" | "inaccessible" | "expired" | "out-of-range";
export type SessionReference = {
  sessionId: string;
  store: SessionStore;
  revision?: string;
  eventStart?: number;
  eventEnd?: number;
  messageCount?: number;
  toolCallCount?: number;
  inputBytes?: number;
  outputBytes?: number;
  availability: SessionAvailability;
};
export type TraceEvent = { name: string; timestamp?: string; traceId: string; spanId: string; parentSpanId?: string; durationMs?: number; attributes: Record<string, TraceValue>; sessionReference?: SessionReference; rawPayloads?: RawPayload[] };
export type SpanOutcome = "success" | "failure";
export type SpanLifecycleOptions = { traceId?: string; spanId?: string; parentSpanId?: string; cwd: string; config?: TracerConfig; now?: () => number; id?: () => string; emit?: typeof emitTrace };
export type SpanLifecycle = { traceId: string; spanId: string; parentSpanId?: string; startedAt: string; finish(outcome: SpanOutcome, attributes?: Record<string, TraceValue>, rawPayloads?: RawPayload[]): Promise<void> };
export type TracerConfig = { backend?: "disabled" | "file" | "jaeger" | "phoenix" | string; enabled?: boolean; endpoint?: string; directory?: string; captureMode?: "local-full" | "export-bounded" | "metadata"; exportRawPayloads?: boolean; maxPayloadBytes?: number; maxFileBytes?: number; retentionDays?: number };
const defaultDirectory = ".as-is/tracing.jsonl";
const defaultEndpoint = "http://127.0.0.1:4318/v1/traces";
const safeClasses: PayloadClass[] = ["prompt", "response", "tool-argument", "tool-result", "stdout", "stderr", "exception"];
const MAX_PAYLOAD_BYTES = 64 * 1024;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const RETENTION_DAYS = 7;
const SESSION_REFERENCE_KEYS = new Set(["sessionId", "store", "revision", "eventStart", "eventEnd", "messageCount", "toolCallCount", "inputBytes", "outputBytes", "availability"]);
const MAX_SESSION_REFERENCE_NUMBER = 1_000_000_000;
const sessionReferenceString = (value: unknown): value is string => typeof value === "string" && new TextEncoder().encode(value).byteLength <= 128 && !(/[\\/\u0000]/u).test(value) && !/^[A-Za-z][A-Za-z0-9+.-]*:/u.test(value);
const sessionReferenceNumber = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= MAX_SESSION_REFERENCE_NUMBER;
export function serializeSessionReference(value: unknown): SessionReference | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const input = value as Record<string, unknown>;
  if (Object.keys(input).some(key => !SESSION_REFERENCE_KEYS.has(key))) return undefined;
  if (!sessionReferenceString(input.sessionId) || !["project-local", "host-local"].includes(input.store as string) || !["available", "missing", "inaccessible", "expired", "out-of-range"].includes(input.availability as string)) return undefined;
  for (const key of ["revision"] as const) if (input[key] !== undefined && !sessionReferenceString(input[key])) return undefined;
  for (const key of ["eventStart", "eventEnd", "messageCount", "toolCallCount", "inputBytes", "outputBytes"] as const) if (input[key] !== undefined && !sessionReferenceNumber(input[key])) return undefined;
  if (input.eventStart !== undefined && input.eventEnd !== undefined && (input.eventEnd as number) < (input.eventStart as number)) return undefined;
  const result: Record<string, unknown> = {};
  for (const key of SESSION_REFERENCE_KEYS) if (input[key] !== undefined) result[key] = input[key];
  return result as SessionReference;
}
const attributeValue = (value: TraceValue) => typeof value === "boolean" ? { boolValue: value } : typeof value === "number" ? { intValue: value } : { stringValue: value ?? "" };
function redact(content: string): string { return content.replace(/(?:bearer\s+|token[=:]\s*)[^\s,;]+/gi, "[REDACTED]").replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "[REDACTED]"); }
function bytes(content: string, limit: number): string { if (limit <= 0) return ""; let result = ""; let used = 0; for (const character of content) { const size = new TextEncoder().encode(character).byteLength; if (used + size > limit) break; result += character; used += size; } return result; }
function exportPayloads(payloads: RawPayload[] | undefined, limit: number): RawPayload[] { return (payloads ?? []).filter(p => safeClasses.includes(p.class)).map(p => ({ class: p.class, content: bytes(redact(p.content), limit) })); }

export function otlpPayload(event: TraceEvent, config: TracerConfig = {}) {
  const start = event.timestamp ?? new Date().toISOString(); const startTimeUnixNano = Date.parse(start) * 1_000_000;
  const attrs = Object.entries(event.attributes).filter(([, v]) => v !== undefined).map(([key, value]) => ({ key, value: attributeValue(value) }));
  const sessionReference = serializeSessionReference(event.sessionReference);
  if (sessionReference) attrs.push({ key: "session.reference", value: { stringValue: JSON.stringify(sessionReference) } });
  if (config.captureMode === "export-bounded" && config.exportRawPayloads === true) for (const p of exportPayloads(event.rawPayloads, config.maxPayloadBytes ?? MAX_PAYLOAD_BYTES)) attrs.push({ key: `payload.${p.class}`, value: { stringValue: p.content } });
  return { resourceSpans: [{ resource: { attributes: [{ key: "service.name", value: { stringValue: "as-is" } }] }, scopeSpans: [{ scope: { name: "as-is.tracing" }, spans: [{ traceId: event.traceId.slice(0, 32).padStart(32, "0"), spanId: event.spanId.slice(0, 16).padStart(16, "0"), parentSpanId: event.parentSpanId?.slice(0, 16).padStart(16, "0"), name: event.name, kind: 1, startTimeUnixNano: String(startTimeUnixNano), endTimeUnixNano: String(startTimeUnixNano + Math.max(0, event.durationMs ?? 0) * 1_000_000), attributes: attrs, status: { code: 1 } }] }] }] };
}
async function projectConfig(cwd: string): Promise<TracerConfig> { try { const text = await Bun.file(resolve(cwd, "as-is.md")).text(); const block = text.match(/tracing:\r?\n((?:      [^\r\n]+\r?\n?)+)/m)?.[1] ?? ""; const value = (n: string) => block.match(new RegExp(`^      ${n}:\\s*[\\"']?([^\\"'\\s#]+)[\\"']?\\s*$`, "m"))?.[1]; return { backend: value("backend"), enabled: value("enabled") === "true" ? true : value("enabled") === "false" ? false : undefined, endpoint: value("endpoint"), directory: value("local-directory"), captureMode: value("capture-mode") as TracerConfig["captureMode"], exportRawPayloads: value("export-raw-payloads") === "true" }; } catch { return {}; } }
async function envConfig(cwd: string): Promise<TracerConfig> { const project = await projectConfig(cwd); return { ...project, backend: process.env.AS_IS_COMPONENT_BUILD_TRACER ?? project.backend ?? "file", endpoint: process.env.AS_IS_COMPONENT_BUILD_TRACER_ENDPOINT || project.endpoint, directory: process.env.AS_IS_COMPONENT_BUILD_TRACER_DIRECTORY || project.directory }; }
export function startSpan(name: string, options: SpanLifecycleOptions): SpanLifecycle { const now = options.now ?? Date.now; const makeId = options.id ?? (() => randomUUID().replaceAll("-", "")); const startedMs = now(); const traceId = options.traceId ?? makeId(); const spanId = options.spanId ?? makeId(); const startedAt = new Date(startedMs).toISOString(); let finished = false; return { traceId, spanId, parentSpanId: options.parentSpanId, startedAt, async finish(outcome, attributes = {}, rawPayloads = []) { if (finished) return; finished = true; try { await (options.emit ?? emitTrace)({ name, timestamp: startedAt, traceId, spanId, parentSpanId: options.parentSpanId, durationMs: Math.max(0, now() - startedMs), attributes: { ...attributes, outcome }, rawPayloads }, options.cwd, options.config); } catch { /* best effort */ } } }; }
async function cleanup(filePath: string, days: number) { try { const cutoff = Date.now() - days * 86400000; const files = filePath.endsWith(".jsonl") ? [filePath] : (await readdir(filePath)).map(f => join(filePath, f)); for (const file of files) if ((await stat(file)).mtimeMs < cutoff) await unlink(file); } catch { /* best effort */ } }
export async function emitTrace(event: TraceEvent, cwd: string, config?: TracerConfig): Promise<void> { const resolved = config ?? await envConfig(cwd); if (resolved.enabled === false || resolved.backend === "disabled") return; try { const backend = resolved.backend ?? "file"; if (backend === "file") { const output = resolve(cwd, resolved.directory ?? defaultDirectory); const filePath = output.endsWith(".jsonl") ? output : join(output, "trace.jsonl"); const record = { ...event, sessionReference: serializeSessionReference(event.sessionReference), rawPayloads: resolved.captureMode === "local-full" && event.rawPayloads?.length ? event.rawPayloads : undefined, timestamp: event.timestamp ?? new Date().toISOString() }; const encoded = `${JSON.stringify(record)}\n`; await mkdir(resolve(filePath, ".."), { recursive: true }); await cleanup(filePath, resolved.retentionDays ?? RETENTION_DAYS); const current = (await stat(filePath).catch(() => ({ size: 0 }))).size; if (current + Buffer.byteLength(encoded) <= (resolved.maxFileBytes ?? MAX_FILE_BYTES)) { await appendFile(filePath, encoded, { mode: 0o600 }); await chmod(filePath, 0o600); } return; } if (backend === "jaeger" || backend === "phoenix") await fetch(resolved.endpoint ?? defaultEndpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(otlpPayload(event, { ...resolved, captureMode: resolved.captureMode ?? "export-bounded" })) }); } catch { /* telemetry never blocks execution */ } }
