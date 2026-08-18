import { describe, expect, test } from "bun:test";
import {
  createProviderCorrelation,
  createRetryCorrelation,
  isCorrelationObservation,
  isLocalSessionUuid,
  observeProviderRequestId,
  projectExternalCorrelation,
  unavailableProviderRequestId,
} from "./provider-correlation.ts";

describe("provider correlation contract", () => {
  test("keeps task labels, local IDs, provider identity, jobs, and traces separate", () => {
    const correlation = createProviderCorrelation({
      sessionName: "trace-task",
      localSessionId: "0190abcd-1234-4abc-8def-0123456789ab",
      providerModel: "openrouter/model",
      jobId: "job-1",
      traceId: "trace-1",
    });
    expect(correlation.sessionName).toEqual({ availability: "available", source: "task", kind: "correlation-id", value: "trace-task" });
    expect(correlation.localSessionId.value).toBe("0190abcd-1234-4abc-8def-0123456789ab");
    expect(correlation.providerRequestId).toEqual(unavailableProviderRequestId());
    expect(correlation.providerModel).toEqual({ availability: "available", source: "pi-session", kind: "provider-model", value: "openrouter/model" });
    expect(correlation.jobId.value).toBe("job-1");
    expect(correlation.traceId.value).toBe("trace-1");
  });

  test("retains the task label while retries receive new local and trace identities", () => {
    const first = createProviderCorrelation({ sessionName: "retry-task", localSessionId: "0190abcd-1234-4abc-8def-0123456789ab", jobId: "job-one", traceId: "trace-one" });
    const retry = createRetryCorrelation(first, { localSessionId: "0190abcd-1234-4abc-8def-0123456789ac", jobId: "job-two", traceId: "trace-two" });
    expect(retry.sessionName.value).toBe("retry-task");
    expect(retry.localSessionId.value).toBe("0190abcd-1234-4abc-8def-0123456789ac");
    expect(retry.traceId.value).toBe("trace-two");
    expect(retry.providerRequestId.availability).toBe("unavailable");
    expect(retry.localSessionId.value).not.toBe(first.localSessionId.value);
    expect(retry.traceId.value).not.toBe(first.traceId.value);
    expect(() => createRetryCorrelation(first, { localSessionId: "0190abcd-1234-4abc-8def-0123456789ab", jobId: "job-two", traceId: "trace-two" })).toThrow("fresh opaque local session ID");
    expect(() => createRetryCorrelation(first, { localSessionId: "0190abcd-1234-4abc-8def-0123456789ac", jobId: "job-two", traceId: "trace-one" })).toThrow("fresh opaque trace ID");
  });

  test("represents absent, malformed, and unavailable provider evidence explicitly", () => {
    expect(createProviderCorrelation({ sessionName: undefined }).sessionName.availability).toBe("absent");
    expect(createProviderCorrelation({ providerRequestId: "provider/id" }).providerRequestId.availability).toBe("unavailable");
    expect(observeProviderRequestId("provider/id").availability).toBe("malformed");
    expect(createProviderCorrelation({ providerRequestId: null }).providerRequestId.availability).toBe("unavailable");
    expect(unavailableProviderRequestId("adapter-does-not-expose-provider-id")).toEqual({ availability: "unavailable", source: "provider-adapter", kind: "correlation-id", reason: "adapter-does-not-expose-provider-id" });
  });

  test("projects only the local opaque session ID externally", () => {
    const correlation = createProviderCorrelation({ sessionName: "safe-task", localSessionId: "0190abcd-1234-4abc-8def-0123456789ab", providerRequestId: "provider-id", providerModel: "provider/model", jobId: "job", traceId: "trace" });
    expect(projectExternalCorrelation(correlation)).toEqual({ sessionId: "0190abcd-1234-4abc-8def-0123456789ab" });
    expect(JSON.stringify(projectExternalCorrelation(correlation))).not.toContain("provider");
    expect(JSON.stringify(projectExternalCorrelation(correlation))).not.toContain("safe-task");
    expect(projectExternalCorrelation({ ...correlation, localSessionId: { availability: "available", source: "pi-session", kind: "session-id", value: "session/path" } })).toEqual({});
    expect(projectExternalCorrelation({ ...correlation, localSessionId: { availability: "available", source: "task", kind: "session-id", value: "forged-session" } })).toEqual({});
  });

  test("validates observation shape without accepting unsafe values", () => {
    expect(isCorrelationObservation({ availability: "available", source: "pi-session", kind: "session-id", value: "0190abcd-1234-4abc-8def-0123456789ab" })).toBe(true);
    expect(isLocalSessionUuid("0190abcd-1234-4abc-8def-0123456789ab")).toBe(true);
    expect(isLocalSessionUuid("local")).toBe(false);
    expect(isCorrelationObservation({ availability: "available", source: "pi-session", kind: "provider-model", value: "openrouter/model" })).toBe(true);
    expect(isCorrelationObservation({ availability: "available", source: "pi-session", kind: "session-id", value: "/private/session" })).toBe(false);
    expect(isCorrelationObservation({ availability: "available", source: "provider-adapter", kind: "correlation-id", value: "provider", reason: { secret: true } })).toBe(false);
    expect(isCorrelationObservation({ availability: "unknown", source: "pi-session", kind: "session-id" })).toBe(false);
  });
});
