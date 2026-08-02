import { describe, expect, test } from "bun:test";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { emitTrace, otlpPayload } from "./tracer";

describe("universal local tracer", () => {
  test("writes to the base as-is configured file for any runtime event", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-trace-"));
    await writeFile(join(cwd, "as-is.md"), `config:\n  observability:\n    tracing:\n      backend: file\n      enabled: true\n      local-directory: .as-is/tracing.jsonl\n`);
    await emitTrace({
      name: "control-plane.delegate",
      traceId: "trace-1",
      spanId: "span-1",
      attributes: { outcome: "success", secret: undefined },
    }, cwd);
    const lines = await readFile(join(cwd, ".as-is", "tracing.jsonl"), "utf8");
    expect(lines).toContain('"name":"control-plane.delegate"');
    expect(lines).not.toContain("secret");
  });

  test("creates an OTLP-compatible span payload", () => {
    const payload = otlpPayload({
      name: "worker.result",
      traceId: "trace-1",
      spanId: "span-1",
      attributes: { outcome: "success", duration_ms: 4 },
    });
    const span = payload.resourceSpans[0].scopeSpans[0].spans[0];
    expect(span.name).toBe("worker.result");
    expect(span.attributes).toHaveLength(2);
    expect(span.kind).toBe(1);
  });
});
