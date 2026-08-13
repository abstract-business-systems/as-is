import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { renderMermaidBatch, rendererConfiguration } from "./rendered-navigation";

// This is a repository dogfood check, not a portable skill-conformance suite.
// The caller extracts a bounded diagram source from the fixture document; the
// renderer accepts diagram inputs and does not discover or read documents.
const repositoryRoot = resolve(import.meta.dir, "../..");
const fixturePath = join(repositoryRoot, "validation-fixtures", "as-is.md");
const expectedTargets = [
  "./dummy-delegation/as-is.md#design",
  "./increment-5-dogfood/as-is.md#design",
  "./increment-6-recovery-fixture/as-is.md#design",
  "./opencode-mediation-dogfood/as-is.md#design",
];

const extractDiagram = (text: string): string => {
  const match = text.match(/```mermaid\s*\n([\s\S]*?)\n```/);
  if (!match) throw new Error("validation-fixtures record has no Mermaid diagram");
  return match[1];
};

test("renders a batch of diagram inputs and preserves all child anchors", async () => {
  const configuration = rendererConfiguration();
  const fixture = readFileSync(fixturePath, "utf8");
  const source = extractDiagram(fixture);
  const result = await renderMermaidBatch([
    { id: "validation-fixtures", source, expectedHrefs: expectedTargets },
    { id: "small-outcome-flow", source: "flowchart TB\n    A[Start] --> B[Done]" },
  ], configuration);

  if (result.status === "unsupported") {
    const message = [
      `Rendered Mermaid navigation check unsupported: ${result.error}.`,
      "Set MERMAID_BUNDLE, MERMAID_BROWSER, and MERMAID_RENDERER_VERSION to run it.",
    ].join(" ");
    if (process.env.REQUIRE_MERMAID_RENDERER === "1") throw new Error(message);
    console.warn(message);
    return;
  }

  expect(result.status).toBe("passed");
  expect(result.diagrams).toHaveLength(2);
  expect(result.diagrams[0]).toMatchObject({ id: "validation-fixtures", status: "passed", expectedHrefs: [...expectedTargets].sort() });
  expect(result.diagrams[1]).toMatchObject({ id: "small-outcome-flow", status: "rendered", hrefs: [] });
  expect(result.renderer?.browserVersion).toContain("Chrome");

  for (const target of expectedTargets) {
    const resolved = new URL(target, pathToFileURL(fixturePath).href);
    const recordPath = resolved.pathname;
    expect(existsSync(recordPath)).toBe(true);
    expect(readFileSync(recordPath, "utf8")).toContain("\n## Design\n");
  }

  console.log([
    `Rendered ${result.diagrams.length} Mermaid diagrams in one browser batch with ${result.renderer?.version}.`,
    `Browser: ${result.renderer?.browserVersion ?? "version unavailable"}.`,
    "Security: local file input, loose Mermaid security level for local anchors, browser background networking disabled, no external service requested.",
    "Markdown Components-table fallback was not tested by this renderer check.",
  ].join(" "));
});

test("accepts diagram sources without requiring a document input", async () => {
  const result = await renderMermaidBatch([
    { id: "source-only", source: "flowchart TB\n    A[Start] --> B[Done]" },
  ], { status: "unsupported", reason: "test configuration" });
  expect(result).toMatchObject({ status: "unsupported", diagrams: [], error: "test configuration" });
});
