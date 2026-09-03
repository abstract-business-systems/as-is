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
    requireDiagrams: false,
    requireNamedDiagramHeadings: false,
    maxUnwrappedLabelCharacters: 28,
  });
  expect(validation.issues).toEqual([]);
  const diagrams = validation.diagrams;
  const result = await renderMermaidBatch(diagrams.map(({ id, source, expectedHrefs }) => ({ id, source, expectedHrefs })), rendererConfiguration());
  if (result.status === "unsupported") {
    console.warn(`As-is rendered navigation integration unsupported: ${result.error}`);
    return;
  }
  expect(result.status).toBe("passed");
  expect(result.diagrams).toHaveLength(diagrams.length);
  expect(result.diagrams.every((diagram) => diagram.status === "passed" || diagram.status === "rendered")).toBe(true);
  expect(result.diagrams.every((diagram) => diagram.svgWidth || diagram.viewBox)).toBe(true);
});
