import { describe, expect, test } from "bun:test";
import {
  createProviderCorrelation,
  createRetryCorrelation,
  isCorrelationObservation,
  projectExternalCorrelation,
  unavailableProviderRequestId,
} from "./provider-correlation.ts";

describe("provider correlation contract", () => {
  test("keeps task labels, local IDs, provider identity, jobs, and traces separate", () => {
    const correlation = createProviderCorrelation({
      sessionName: "trace-task",
      localSessionId: "local-session",
      providerModel: "openrouter/model",
      jobId: "job-1",
      traceId: "trace-1",
    });
    expect(correlation.sessionName).toEqual({ availability: "available", source: "task", value: "trace-task" });
    expect(correlation.localSessionId.value).toBe("local-session");
    expect(correlation.providerRequestId).toEqual(unavailableProviderRequestId());
    expect(correlation.providerModel.value).toBe("openrouter/model");
    expect(correlation.jobId.value).toBe("job-1");
    expect(correlation.traceId.value).toBe("trace-1");
  });

  test("retains the task label while retries receive new local and trace identities", () => {
    const first = createProviderCorrelation({ sessionName: "retry-task", localSessionId: "local-one", jobId: "job-one", traceId: "trace-one" });
    const retry = createRetryCorrelation(first, { localSessionId: "local-two", jobId: "job-two", traceId: "trace-two" });
    expect(retry.sessionName.value).toBe("retry-task");
    expect(retry.localSessionId.value).toBe("local-two");
    expect(retry.traceId.value).toBe("trace-two");
    expect(retry.providerRequestId.availability).toBe("unavailable");
    expect(retry.localSessionId.value).not.toBe(first.localSessionId.value);
    expect(retry.traceId.value).not.toBe(first.traceId.value);
  });

  test("represents absent, malformed, and unavailable provider evidence explicitly", () => {
    expect(createProviderCorrelation({ sessionName: undefined }).sessionName.availability).toBe("absent");
    expect(createProviderCorrelation({ providerRequestId: "provider/id" }).providerRequestId.availability).toBe("malformed");
    expect(createProviderCorrelation({ providerRequestId: null }).providerRequestId.availability).toBe("absent");
    expect(unavailableProviderRequestId("adapter-does-not-expose-provider-id")).toEqual({ availability: "unavailable", source: "provider-adapter", reason: "adapter-does-not-expose-provider-id" });
  });

  test("projects only the local opaque session ID externally", () => {
    const correlation = createProviderCorrelation({ sessionName: "safe-task", localSessionId: "local-session", providerRequestId: "provider-id", providerModel: "provider/model", jobId: "job", traceId: "trace" });
    expect(projectExternalCorrelation(correlation)).toEqual({ sessionId: "local-session" });
    expect(JSON.stringify(projectExternalCorrelation(correlation))).not.toContain("provider");
    expect(JSON.stringify(projectExternalCorrelation(correlation))).not.toContain("safe-task");
  });

  test("validates observation shape without accepting unsafe values", () => {
    expect(isCorrelationObservation({ availability: "available", source: "pi-session", value: "local" })).toBe(true);
    expect(isCorrelationObservation({ availability: "available", source: "pi-session", value: "/private/session" })).toBe(false);
    expect(isCorrelationObservation({ availability: "available", source: "provider-adapter", value: "provider", reason: { secret: true } })).toBe(false);
    expect(isCorrelationObservation({ availability: "unknown", source: "pi-session" })).toBe(false);
  });
});
