/** Bounded correlation facts shared by traces, launcher observations, and readable sessions. */

export type CorrelationAvailability = "available" | "absent" | "unsupported" | "malformed" | "unavailable";
export type CorrelationSource = "task" | "pi-session" | "provider-adapter" | "launcher" | "tracer";

export type CorrelationObservation = {
  availability: CorrelationAvailability;
  source: CorrelationSource;
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
const providerModelValue = /^[A-Za-z0-9][A-Za-z0-9._+~:/-]{0,127}$/u;
const sources = new Set<CorrelationSource>(["task", "pi-session", "provider-adapter", "launcher", "tracer"]);

export function isOpaqueCorrelationValue(value: unknown): value is string {
  return typeof value === "string" && value.length <= MAX_VALUE_LENGTH && opaqueValue.test(value);
}

function observation(source: CorrelationSource, value: unknown, reason = "not-observed", validator: (candidate: string) => boolean = isOpaqueCorrelationValue): CorrelationObservation {
  if (value === undefined || value === null) return { availability: "absent", source, reason: "not-supplied" };
  if (typeof value !== "string" || !validator(value)) return { availability: "malformed", source, reason: "invalid-bounded-value" };
  return { availability: "available", source, value };
}

function isProviderModel(value: string): boolean {
  return providerModelValue.test(value);
}

export function unavailableProviderRequestId(reason = "provider-identity-not-observed"): CorrelationObservation {
  return { availability: "unavailable", source: "provider-adapter", reason };
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
    sessionName: observation("task", input.sessionName),
    localSessionId: observation("pi-session", input.localSessionId),
    providerRequestId: input.providerRequestId === undefined
      ? unavailableProviderRequestId()
      : observation("provider-adapter", input.providerRequestId),
    providerModel: observation("pi-session", input.providerModel, "not-observed", isProviderModel),
    jobId: observation("launcher", input.jobId),
    traceId: observation("tracer", input.traceId),
  };
}

/** A retry keeps the task label but receives fresh local and trace identities. */
export function createRetryCorrelation(previous: ProviderCorrelation, input: { localSessionId: unknown; jobId?: unknown; traceId?: unknown }): ProviderCorrelation {
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
  return correlation.localSessionId.availability === "available" && correlation.localSessionId.value
    ? { sessionId: correlation.localSessionId.value }
    : {};
}

export function isCorrelationObservation(value: unknown): value is CorrelationObservation {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  if (!sources.has(candidate.source as CorrelationSource)) return false;
  if (!["available", "absent", "unsupported", "malformed", "unavailable"].includes(String(candidate.availability))) return false;
  return (candidate.value === undefined || isOpaqueCorrelationValue(candidate.value)) && (candidate.reason === undefined || (typeof candidate.reason === "string" && candidate.reason.length <= MAX_VALUE_LENGTH && /^[A-Za-z0-9][A-Za-z0-9._ -]{0,127}$/u.test(candidate.reason)));
}
