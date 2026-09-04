import { expect, test } from "bun:test";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { renderMermaidBatch, rendererConfiguration } from "../../mermaid-renderer/rendered-navigation";
import { validateAsIsDiagramsAndNavigation } from "./validate-as-is-diagrams-and-navigation";

const recordPaths = (root: string): string[] => {
  const paths: string[] = [];
  const visit = (directory: string): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        // A13 transitional namespace scoping is resolved at F9; the frozen benchmark evidence-tree exclusion is permanent evidence scoping.
        if (entry.name === "benchmark" && directory.endsWith("candidate")) continue;
        if (![".git", "node_modules", ".pi", ".opencode"].includes(entry.name)) visit(join(directory, entry.name));
      } else if (entry.isFile() && entry.name === "as-is.md") {
        paths.push(join(directory, entry.name).slice(root.length + 1));
      }
    }
  };
  visit(root);
  return paths.sort();
};

test("optionally consumes browser-rendered href evidence for linked as-is diagrams", async () => {
  const validation = validateAsIsDiagramsAndNavigation(process.cwd(), {
    rootRecordPath: "as-is.md",
    recordPaths: recordPaths(process.cwd()),
    requireDiagrams: true,
    requireNamedDiagramHeadings: false,
    maxUnwrappedLabelCharacters: 28,
  });
  expect(validation.issues).toEqual([]);
  const diagrams = validation.diagrams;
  // The renderer accepts bounded batches (max 64 diagrams per browser run); chunk the
  // repository-wide walk so the record count can grow without weakening that bound.
  const batchSize = 64;
  const requests = diagrams.map(({ id, source, expectedHrefs }) => ({ id, source, expectedHrefs }));
  const results = [];
  for (let i = 0; i < requests.length; i += batchSize) {
    results.push(await renderMermaidBatch(requests.slice(i, i + batchSize), rendererConfiguration()));
  }
  const unsupported = results.find((result) => result.status === "unsupported");
  if (unsupported) {
    console.warn(`As-is rendered navigation integration unsupported: ${unsupported.error}`);
    return;
  }
  const result = { status: results.every((result) => result.status === "passed") ? "passed" : "failed", diagrams: results.flatMap((result) => result.diagrams) };
  expect(result.status).toBe("passed");
  expect(result.diagrams).toHaveLength(diagrams.length);
  expect(result.diagrams.every((diagram) => diagram.status === "passed" || diagram.status === "rendered")).toBe(true);
  expect(result.diagrams.every((diagram) => diagram.svgWidth || diagram.viewBox)).toBe(true);
});
