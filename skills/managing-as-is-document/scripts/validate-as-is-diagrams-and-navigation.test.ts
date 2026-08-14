import { expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { validateAsIsDiagramsAndNavigation } from "./validate-as-is-diagrams-and-navigation";

const childRecord = (name: string, parentName = "Root", container = ""): string => `# ${name} - as-is

## Purpose

Own the ${name.toLowerCase()} responsibility.

## Design

[${parentName}](../as-is.md#design) / **${name}**

### Local view

\`\`\`mermaid
flowchart TB
    Start["${name} responsibility"] --> Outcome["Bounded outcome"]
${container}\`\`\`
`;

const parentRecord = (children: string[], diagramBody: string): string => `# Root - as-is

## Purpose

Own the root responsibility.

## Components

| Component | Purpose |
| --- | --- |
${children.map((name) => `| [${name}](./${name.toLowerCase()}/as-is.md#design) | Owns the ${name.toLowerCase()} responsibility. |`).join("\n")}

## Design

**Root**

### Structural container

\`\`\`mermaid
flowchart TB
    subgraph Root["Root"]
${diagramBody}
    end
\`\`\`
`;

const withRepository = (parent: string, children: Record<string, string>): string => {
  const root = mkdtempSync(join("/tmp", "as-is-diagram-validator-"));
  writeFileSync(join(root, "as-is.md"), parent, "utf8");
  for (const [name, text] of Object.entries(children)) {
    const directory = join(root, ...name.toLowerCase().split("/"));
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, "as-is.md"), text, "utf8");
  }
  return root;
};

const cleanup = (root: string): void => rmSync(root, { recursive: true, force: true });
const validate = (root: string, extra: Partial<Parameters<typeof validateAsIsDiagramsAndNavigation>[1]> = {}) => validateAsIsDiagramsAndNavigation(root, {
  rootRecordPath: "as-is.md",
  recordPaths: ["as-is.md", "child/as-is.md", "first/as-is.md", "second/as-is.md", "Child/as-is.md", "Child/Grandchild/as-is.md", "leaf/as-is.md", "bad/as-is.md", "link/as-is.md"].filter((path) => existsSync(join(root, path))),
  ...extra,
});

test("accepts a parent container, immediate-child fallback, and breadcrumb pair", () => {
  const root = withRepository(
    parentRecord(["Child"], `        Child["<a href='./child/as-is.md#design'>Child</a>"]`),
    { Child: childRecord("Child") },
  );
  try {
    const result = validate(root, { rootRecordPath: "as-is.md" });
    expect(result.issues).toEqual([]);
    expect(result.records).toBe(2);
    expect(result.diagrams).toHaveLength(2);
    expect(result.diagrams[0]?.expectedHrefs).toEqual(["./child/as-is.md#design"]);
  } finally {
    cleanup(root);
  }
});

test("rejects out-of-scope structural nodes and unlabeled sibling arrows", () => {
  const root = withRepository(
    parentRecord(
      ["First", "Second"],
      [
        `        First["<a href='./first/as-is.md#design'>First</a>"]`,
        `        Second["<a href='./second/as-is.md#design'>Second</a>"]`,
        `        Unexpected["not an immediate child"]`,
        "        First --> Second",
      ].join("\n"),
    ),
    { First: childRecord("First"), Second: childRecord("Second") },
  );
  try {
    const result = validate(root, { rootRecordPath: "as-is.md" });
    expect(result.issues.some((issue) => issue.code === "immediate-child")).toBe(true);
    expect(result.issues.some((issue) => issue.code === "sibling-arrow")).toBe(true);
  } finally {
    cleanup(root);
  }
});

test("rejects a grandchild declared as an immediate child", () => {
  const root = withRepository(
    parentRecord(["Grandchild"], `        Grandchild["<a href='./child/grandchild/as-is.md#design'>Grandchild</a>"]`),
    {
      Child: `${childRecord("Child")}\n## Components\n\n| Component | Purpose |\n| --- | --- |\n| [Grandchild](./grandchild/as-is.md#design) | Owns a nested responsibility. |\n`,
      "Child/Grandchild": childRecord("Grandchild", "Child"),
    },
  );
  try {
    const result = validate(root, { rootRecordPath: "as-is.md" });
    expect(result.issues.some((issue) => issue.code === "immediate-child")).toBe(true);
  } finally {
    cleanup(root);
  }
});

test("rejects a root-involved component cycle", () => {
  const root = withRepository(
    [
      "# Root - as-is",
      "",
      "## Purpose",
      "",
      "Own the root responsibility.",
      "",
      "## Components",
      "",
      "| Component | Purpose |",
      "| --- | --- |",
      "| [Root](./as-is.md#design) | Invalid self-child. |",
      "",
      "## Design",
      "",
      "**Root**",
      "",
      "### Structural container",
      "",
      "```mermaid",
      "flowchart TB",
      "    subgraph Root[\"Root\"]",
      "        RootNode[\"<a href='./as-is.md#design'>Root</a>\"]",
      "    end",
      "```",
      "",
    ].join("\n"),
    {},
  );
  try {
    const result = validate(root, { rootRecordPath: "as-is.md" });
    expect(result.issues.some((issue) => issue.code === "parent-graph")).toBe(true);
  } finally {
    cleanup(root);
  }
});

test("rejects a missing nearby parent breadcrumb", () => {
  const root = withRepository(
    parentRecord(["Child"], `        Child["<a href='./child/as-is.md#design'>Child</a>"]`),
    { Child: childRecord("Child").replace("[Root](../as-is.md#design) / ", "") },
  );
  try {
    const result = validate(root, { rootRecordPath: "as-is.md" });
    expect(result.issues.some((issue) => issue.code === "breadcrumb-parent")).toBe(true);
  } finally {
    cleanup(root);
  }
});

test("rejects a title that is not the first content line", () => {
  const root = withRepository(
    "Introductory prose\n\n# Root - as-is\n\n## Purpose\n\nRoot.\n\n## Design\n\n**Root**\n",
    {},
  );
  try {
    const result = validate(root, { rootRecordPath: "as-is.md" });
    expect(result.issues.some((issue) => issue.code === "strict-title")).toBe(true);
  } finally {
    cleanup(root);
  }
});

test("rejects missing diagrams and unnamed diagrams when requested", () => {
  const root = withRepository(
    "# Root - as-is\n\n## Purpose\n\nRoot.\n\n## Design\n\n**Root**\n",
    {},
  );
  try {
    const result = validate(root, { rootRecordPath: "as-is.md", requireDiagrams: true, requireNamedDiagramHeadings: true });
    expect(result.issues.some((issue) => issue.code === "diagram")).toBe(true);
  } finally {
    cleanup(root);
  }
});

test("rejects an unnamed Mermaid diagram when headings are required", () => {
  const root = withRepository(
    "# Root - as-is\n\n## Purpose\n\nRoot.\n\n## Design\n\n**Root**\n\n```mermaid\nflowchart TB\n    A[\"Start\"] --> B[\"Done\"]\n```\n",
    {},
  );
  try {
    const result = validate(root, { rootRecordPath: "as-is.md", requireDiagrams: true, requireNamedDiagramHeadings: true });
    expect(result.issues.some((issue) => issue.code === "diagram-heading")).toBe(true);
  } finally {
    cleanup(root);
  }
});

test("rejects an invalid Components fallback table", () => {
  const root = withRepository(
    parentRecord(["Child"], `        Child["<a href='./child/as-is.md#design'>Child</a>"]`).replace("| Component | Purpose |\n| --- | --- |", "Child is documented here."),
    { Child: childRecord("Child") },
  );
  try {
    const result = validate(root, { rootRecordPath: "as-is.md" });
    expect(result.issues.some((issue) => issue.code === "components-fallback")).toBe(true);
  } finally {
    cleanup(root);
  }
});

test("rejects malformed titles, unresolved links, and a leaf container", () => {
  const root = withRepository(
    parentRecord(["Missing"], `        Missing["<a href='./missing/as-is.md#design'>Missing</a>"]`),
    {
      Leaf: childRecord("Leaf", "Root", `    subgraph Leaf["Leaf"]\n        Hidden["hidden"]\n    end\n`),
      Bad: "# Bad\n\n## Purpose\n\nMalformed record.\n\n## Design\n\n[Root](../as-is.md#design) / **Bad**\n",
      Link: [
        "# Link - as-is",
        "",
        "## Purpose",
        "",
        "Broken link record.",
        "",
        "## Design",
        "",
        "[Root](../as-is.md#design) / **Link**",
        "",
        "### Local view",
        "",
        "```mermaid",
        "flowchart TB",
        `    Link["<a href='./missing/as-is.md#design'>Missing</a>"]`,
        "```",
      ].join("\n"),
    },
  );
  try {
    const result = validate(root, { rootRecordPath: "as-is.md" });
    expect(result.issues.some((issue) => issue.code === "strict-title")).toBe(true);
    expect(result.issues.some((issue) => issue.code === "unresolved-design-link")).toBe(true);
    expect(result.issues.some((issue) => issue.code === "parent-only-container")).toBe(true);
  } finally {
    cleanup(root);
  }
});
