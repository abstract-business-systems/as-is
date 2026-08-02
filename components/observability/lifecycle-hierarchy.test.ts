import { describe, expect, test } from "bun:test";
import { startSpan, type TraceEvent } from "./tracer";

describe("lifecycle hierarchy seam", () => {
  test("keeps session as the deterministic parent of delegation without raw content", async () => {
    const events: TraceEvent[] = [];
    let clock = 1_000;
    const emit = async (event: TraceEvent) => { events.push(event); };
    const session = startSpan("session.lifecycle", {
      cwd: ".",
      traceId: "trace-session",
      spanId: "session-span",
      now: () => clock,
      emit,
    });
    clock = 1_007;
    const delegation = startSpan("delegation.lifecycle", {
      cwd: ".",
      traceId: session.traceId,
      spanId: "delegation-span",
      parentSpanId: session.spanId,
      now: () => clock,
      emit,
    });
    clock = 1_012;
    const worker = startSpan("worker.lifecycle", {
      cwd: ".",
      traceId: delegation.traceId,
      spanId: "worker-span",
      parentSpanId: delegation.spanId,
      now: () => clock,
      emit,
    });
    clock = 1_019;
    await worker.finish("success", { roleClass: "configured", captureClass: "bounded" });
    clock = 1_027;
    await delegation.finish("success", { outcomeClass: "success", handoffClass: "not-committed" });
    clock = 1_035;
    await session.finish("success", { launcherMode: "print" });

    expect(events).toHaveLength(3);
    expect(events.map(({ name, traceId, spanId, parentSpanId }) => ({ name, traceId, spanId, parentSpanId }))).toEqual([
      { name: "worker.lifecycle", traceId: "trace-session", spanId: "worker-span", parentSpanId: "delegation-span" },
      { name: "delegation.lifecycle", traceId: "trace-session", spanId: "delegation-span", parentSpanId: "session-span" },
      { name: "session.lifecycle", traceId: "trace-session", spanId: "session-span", parentSpanId: undefined },
    ]);
    expect(events[0].durationMs).toBe(7);
    expect(events[0].attributes).toEqual({ roleClass: "configured", captureClass: "bounded", outcome: "success" });
    expect(events[1].durationMs).toBe(20);
    expect(events[2].durationMs).toBe(35);
    expect(JSON.stringify(events)).not.toContain("prompt");
    expect(JSON.stringify(events)).not.toContain("response");
    expect(JSON.stringify(events)).not.toContain("tool");
  });
});
