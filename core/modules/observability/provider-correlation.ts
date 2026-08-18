/** Bounded correlation facts shared by traces, launcher observations, and readable sessions. */

export type CorrelationAvailability = "available" | "absent" | "unsupported" | "malformed" | "unavailable";
export type CorrelationSource = "task" | "pi-session" | "provider-adapter" | "launcher" | "tracer";

export type CorrelationObservation = {
  availability: CorrelationAvailability;
  source: CorrelationSource;
  kind: "session-id" | "provider-model" | "correlation-id";
  value?: string;
  reason?: string;
};

export type ProviderCorrelation = {
  sessionName: CorrelationObservation;
  localSessionId: CorrelationObservation;
  providerRequestId: CorrelationObservation;
  providerModel: CorrelationObservation;
  jobId: CorrelationObservation;
  traceId: CorrelationObservation;
};

export type ExternalCorrelation = {
  sessionId?: string;
};

const MAX_VALUE_LENGTH = 128;
const opaqueValue = /^[A-Za-z0-9][A-Za-z0-9._+~-]{0,127}$/u;
const localSessionUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
const providerModelValue = /^[A-Za-z0-9][A-Za-z0-9._+~:/-]{0,127}$/u;
const sources = new Set<CorrelationSource>(["task", "pi-session", "provider-adapter", "launcher", "tracer"]);

export function isOpaqueCorrelationValue(value: unknown): value is string {
  return typeof value === "string" && value.length <= MAX_VALUE_LENGTH && opaqueValue.test(value);
}

export function isLocalSessionUuid(value: unknown): value is string {
  return typeof value === "string" && localSessionUuid.test(value);
}

function observation(source: CorrelationSource, kind: CorrelationObservation["kind"], value: unknown, reason = "not-observed", validator: (candidate: string) => boolean = isOpaqueCorrelationValue): CorrelationObservation {
  if (value === undefined || value === null) return { availability: "absent", source, kind, reason: "not-supplied" };
  if (typeof value !== "string" || !validator(value)) return { availability: "malformed", source, kind, reason: "invalid-bounded-value" };
  return { availability: "available", source, kind, value };
}

function isProviderModel(value: string): boolean {
  return providerModelValue.test(value);
}

export function unavailableProviderRequestId(reason = "provider-identity-not-observed"): CorrelationObservation {
  return { availability: "unavailable", source: "provider-adapter", kind: "correlation-id", reason };
}

/** Adapter-owned escape hatch for a future explicitly observed provider request ID. */
export function observeProviderRequestId(value: unknown): CorrelationObservation {
  return observation("provider-adapter", "correlation-id", value, "invalid-provider-request-id");
}

export function createProviderCorrelation(input: {
  sessionName?: unknown;
  localSessionId?: unknown;
  providerRequestId?: unknown;
  providerModel?: unknown;
  jobId?: unknown;
  traceId?: unknown;
}): ProviderCorrelation {
  return {
    sessionName: observation("task", "correlation-id", input.sessionName),
    localSessionId: observation("pi-session", "session-id", input.localSessionId, "invalid-local-session-uuid", isLocalSessionUuid),
    providerRequestId: unavailableProviderRequestId(),
    providerModel: observation("pi-session", "provider-model", input.providerModel, "not-observed", isProviderModel),
    jobId: observation("launcher", "correlation-id", input.jobId),
    traceId: observation("tracer", "correlation-id", input.traceId),
  };
}

/** A retry keeps the task label but receives fresh local and trace identities. */
export function createRetryCorrelation(previous: ProviderCorrelation, input: { localSessionId: unknown; jobId?: unknown; traceId: unknown }): ProviderCorrelation {
  if (!isLocalSessionUuid(input.localSessionId) || input.localSessionId === previous.localSessionId.value) {
    throw new Error("retry requires a fresh opaque local session ID");
  }
  if (!isOpaqueCorrelationValue(input.traceId) || input.traceId === previous.traceId.value) {
    throw new Error("retry requires a fresh opaque trace ID");
  }
  return createProviderCorrelation({
    sessionName: previous.sessionName.value,
    localSessionId: input.localSessionId,
    providerRequestId: undefined,
    providerModel: undefined,
    jobId: input.jobId,
    traceId: input.traceId,
  });
}

/** External sinks receive only the opaque local session ID, never session content or store metadata. */
export function projectExternalCorrelation(correlation: ProviderCorrelation): ExternalCorrelation {
  return correlation.localSessionId.availability === "available" && correlation.localSessionId.source === "pi-session" && correlation.localSessionId.kind === "session-id" && isLocalSessionUuid(correlation.localSessionId.value)
    ? { sessionId: correlation.localSessionId.value }
    : {};
}

export function isCorrelationObservation(value: unknown): value is CorrelationObservation {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  if (!sources.has(candidate.source as CorrelationSource)) return false;
  if (!["session-id", "provider-model", "correlation-id"].includes(String(candidate.kind))) return false;
  if (!["available", "absent", "unsupported", "malformed", "unavailable"].includes(String(candidate.availability))) return false;
  const validValue = candidate.kind === "provider-model"
    ? (typeof candidate.value === "string" && isProviderModel(candidate.value))
    : candidate.value === undefined || isOpaqueCorrelationValue(candidate.value);
  return validValue && (candidate.reason === undefined || (typeof candidate.reason === "string" && candidate.reason.length <= MAX_VALUE_LENGTH && /^[A-Za-z0-9][A-Za-z0-9._ -]{0,127}$/u.test(candidate.reason)));
}
