import { expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { calculateWeights, cleanupCompletedBacklogs, findAncestorAndDescendantCandidates, findCompletedItems, loadBacklogs, loadComponentContexts, parseBacklog, reconcileBacklogs, renderQuery, validateQueryRepresentation } from "./scripts/query";

const schema = `# Backlog\n\n| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |\n| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |\n| prerequisite | open | 3 | 1 | Unblock work | Do prerequisite | - | It works | user value |\n| dependent | selected | 2 | 0 | Deliver value | Use prerequisite | skills/managing-backlog:prerequisite | It integrates | selected intentionally |\n`;

test("parses the durable recording schema and component identity", () => {
  const items = parseBacklog(schema, "skills/managing-backlog/backlog.md", "skills/managing-backlog");
  expect(items).toHaveLength(2);
  expect(items[0]).toMatchObject({
    id: "prerequisite",
    status: "open",
    userPreference: 3,
    systemPreference: 1,
    dependencies: [],
    component: "skills/managing-backlog",
  });
  expect(items[1].dependencies).toEqual(["skills/managing-backlog:prerequisite"]);
});

test("rejects statuses, preferences, and dependencies outside the schema", () => {
  expect(() => parseBacklog(schema.replace("selected", "active"))).toThrow("status");
  expect(() => parseBacklog(schema.replace("| 3 |", "| High |"))).toThrow("integer");
  expect(() => parseBacklog(schema.replace("skills/managing-backlog:prerequisite", "prerequisite"))).toThrow("component:id");
});

test("queries rather than stores weight and lets selected dependents elevate prerequisites", () => {
  const items = parseBacklog(schema, "skills/managing-backlog/backlog.md", "skills/managing-backlog");
  const weighted = calculateWeights(items);
  expect(weighted.find((item) => item.id === "dependent")?.weight).toBe(6);
  expect(weighted.find((item) => item.id === "prerequisite")?.weight).toBe(10);
  expect(weighted.every((item) => !Object.prototype.hasOwnProperty.call(item, "weight") || typeof item.weight === "number")).toBe(true);
  expect(schema).not.toContain("weight");
});

test("validates the requested representation columns and rejects the observed five-column response", () => {
  const valid = renderQuery(calculateWeights(parseBacklog(schema, "skills/managing-backlog/backlog.md", "skills/managing-backlog")));
  expect(() => validateQueryRepresentation(valid)).not.toThrow();
  const observed = `| Weight | Component | ID | Status | Purpose |\n|---:|---|---|---|---|\n| 18 | skills | \`backlog-table-schema\` | open | Record backlog proposals |`;
  expect(() => validateQueryRepresentation(observed)).toThrow("weight, component, id, status, purpose, description, dependencies, notes");
});

test("renders the top 10 by default and supports explicit view overrides", () => {
  const items = Array.from({ length: 12 }, (_, index) => parseBacklog(
    `| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |\n| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |\n| item-${index} | open | ${12 - index} | 0 | Purpose ${index} | Description ${index} | - | Works | - |`,
    "skills/managing-backlog/backlog.md",
    "skills/managing-backlog",
  )[0]);
  const weighted = calculateWeights(items);
  expect(renderQuery(weighted).split("\n")).toHaveLength(12);
  expect(renderQuery(weighted, null).split("\n")).toHaveLength(14);
  expect(renderQuery(weighted, 3).split("\n")).toHaveLength(5);
  expect(renderQuery(weighted)).not.toContain("| 1 | skills/managing-backlog | item-11 |");
});

test("renders the representation sorted by descending derived weight", () => {
  const items = parseBacklog(schema, "skills/managing-backlog/backlog.md", "skills/managing-backlog");
  const output = renderQuery(calculateWeights(items));
  expect(output.indexOf("| 10 | skills/managing-backlog | prerequisite |"))
    .toBeLessThan(output.indexOf("| 6 | skills/managing-backlog | dependent |"));
  expect(output).toContain("| weight | component | id | status | purpose | description | dependencies | notes |");
  expect(output).not.toContain("user preference");
});

test("loads every repository backlog using the same schema", () => {
  const items = loadBacklogs(process.cwd());
  expect(items.length).toBeGreaterThan(20);
  expect(items.every((item) => item.id && ["open", "selected", "deferred"].includes(item.status))).toBe(true);
  expect(items.every((item) => Number.isInteger(item.userPreference) && Number.isInteger(item.systemPreference))).toBe(true);
  expect(items.every((item) => item.acceptance !== undefined)).toBe(true);
});

test("finds completion only when the owning changelog names the item with completion evidence", () => {
  const items = parseBacklog(schema, "skills/managing-backlog/backlog.md", "skills/managing-backlog");
  const completed = findCompletedItems(items, new Map([
    ["skills/managing-backlog", "# Changelog\n- Completed `prerequisite`; validation passed.\n"],
  ]));
  expect(completed.map((item) => item.id)).toEqual(["prerequisite"]);
  expect(completed[0].evidence).toContain("prerequisite");
});

test("does not remove a stale item from a different component or an unverified changelog", () => {
  const items = parseBacklog(schema, "skills/managing-backlog/backlog.md", "skills/managing-backlog");
  expect(findCompletedItems(items, new Map([
    ["other-component", "- Completed `prerequisite`."],
    ["skills/managing-backlog", "- Work mentioned prerequisite but remains open."],
  ]))).toEqual([]);
});

test("cleans only the selected evidenced identity and rejects missing or malformed selections", () => {
  const root = mkdtempSync(join(tmpdir(), "backlog-cleanup-"));
  const component = join(root, "component");
  mkdirSync(component);
  Bun.write(join(component, "as-is.md"), "# Component\n");
  writeFileSync(join(component, "backlog.md"), `${schema.replace("skills/managing-backlog/backlog.md", "component/backlog-table-schema")}\n| uncompleted | open | 0 | 0 | Uncompleted | No completion evidence | - | It remains | - |\n`);
  writeFileSync(join(component, "changelog.md"), "# Changelog\n- Completed `prerequisite`; tests passed.\n- Completed `dependent`; tests passed.\n");

  const completed = cleanupCompletedBacklogs(root, "component:prerequisite");
  expect(completed.map((item) => `${item.component}:${item.id}`)).toEqual(["component:prerequisite"]);
  const remaining = readFileSync(join(component, "backlog.md"), "utf8");
  expect(remaining).not.toContain("| prerequisite | open |");
  expect(remaining).toContain("| dependent | selected |");

  for (const selection of [undefined, "", "prerequisite", "component:", ":prerequisite", "component:prerequisite:extra"]) {
    expect(() => cleanupCompletedBacklogs(root, selection)).toThrow(/exact.*component:id|malformed|selection/i);
  }
  expect(() => cleanupCompletedBacklogs(root, "component:missing")).toThrow(/changelog-evidenced completion|completion.*evidence|not found|selected/i);
});

test("loads component context and limits candidates to ancestor and descendant backlogs", () => {
  const root = mkdtempSync(join(tmpdir(), "backlog-context-"));
  const writeComponent = (component: string, purpose: string, row: string) => {
    const directory = join(root, component);
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, "as-is.md"), `# ${component || "root"}\n\n## Purpose\n${purpose}\n`);
    writeFileSync(join(directory, "backlog.md"), `${schema.replace("skills/managing-backlog/backlog.md", `${component || "root"}/backlog.md`).replace("prerequisite", row)}\n`);
  };
  writeComponent("", "Root owner", "same");
  writeComponent("parent", "Parent owner", "same");
  writeComponent("parent/child", "Child owner", "child-only");
  writeComponent("sibling", "Sibling owner", "same");
  expect(loadComponentContexts(root).map((context) => context.component)).toEqual(["parent", "parent/child", "root", "sibling"]);
  const items = loadBacklogs(root);
  const candidates = findAncestorAndDescendantCandidates(items, "parent", { id: "same", purpose: "Unblock work", description: "Do prerequisite" });
  expect(candidates.map((candidate) => candidate.identity)).toEqual(["parent/child:child-only", "root:same"]);
  expect(candidates.find((candidate) => candidate.identity === "root:same")?.relation).toBe("ancestor");
  expect(candidates.find((candidate) => candidate.identity === "parent/child:child-only")?.relation).toBe("descendant");
});

test("removes an explicit ancestor equivalent and rewrites dependencies with provenance", () => {
  const root = mkdtempSync(join(tmpdir(), "backlog-remove-"));
  const row = (id: string, purpose: string, description: string, dependencies = "-", notes = "-") => `| ${id} | open | 1 | 1 | ${purpose} | ${description} | ${dependencies} | Pass | ${notes} |`;
  const writeComponent = (component: string, rows: string[]) => {
    const directory = join(root, component);
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, "as-is.md"), `# ${component || "root"}\n\n## Purpose\nOwner\n`);
    writeFileSync(join(directory, "backlog.md"), `# Backlog\n\n| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |\n| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |\n${rows.join("\n")}\n`);
  };
  writeComponent("", [row("same", "Shared", "Proposal"), row("dependent", "Uses", "Old", "root:same")]);
  writeComponent("parent", [row("same", "Shared", "Proposal")]);
  reconcileBacklogs(root, { owner: "parent", authorizedComponents: ["root", "parent"], rationale: "child owns bounded proposal" }, { kind: "remove", source: "root:same", equivalent: "parent:same", rationale: "retain child proposal" });
  const rootText = readFileSync(join(root, "backlog.md"), "utf8");
  const parentText = readFileSync(join(root, "parent/backlog.md"), "utf8");
  expect(rootText).not.toContain("| same | open |");
  expect(rootText).toContain("parent:same");
  expect(parentText).toContain("root:same");
  expect(parentText).toContain("retain child proposal");
});

test("moves, combines, and splits with explicit provenance and dependency rewrites", () => {
  const root = mkdtempSync(join(tmpdir(), "backlog-ops-"));
  const row = (id: string, purpose: string, description: string, dependencies = "-", notes = "-") => `| ${id} | open | 1 | 1 | ${purpose} | ${description} | ${dependencies} | Pass | ${notes} |`;
  const writeComponent = (component: string, rows: string[]) => {
    const directory = join(root, component);
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, "as-is.md"), `# ${component || "root"}\n\n## Purpose\nOwner\n`);
    writeFileSync(join(directory, "backlog.md"), `# Backlog\n\n| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |\n| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |\n${rows.join("\n")}\n`);
  };
  writeComponent("", [row("move-me", "Move", "with \\[link\\](x)"), row("a", "A", "A"), row("b", "B", "B", "root:a"), row("dependent", "D", "D", "root:a")]);
  writeComponent("parent", [row("survivor", "S", "S"), row("split-dependent", "SD", "SD", "root:split-me"), row("split-me", "Split", "Source", "root:a")]);
  reconcileBacklogs(root, { owner: "parent", authorizedComponents: ["root", "parent"], rationale: "bounded organization" }, { kind: "move", from: "root:move-me", toComponent: "parent", rationale: "parent owns it" });
  reconcileBacklogs(root, { owner: "parent", authorizedComponents: ["root", "parent"], rationale: "bounded organization" }, { kind: "combine", sources: ["root:a", "root:b"], survivor: "root:a", rationale: "same proposal family" });
  reconcileBacklogs(root, { owner: "parent", authorizedComponents: ["root", "parent"], rationale: "bounded organization" }, { kind: "split", source: "parent:split-me", replacements: [
    { component: "parent", item: { id: "split-one", status: "open", userPreference: 1, systemPreference: 1, purpose: "One", description: "One", dependencies: [], acceptance: "Pass", notes: "-" } },
    { component: "parent", item: { id: "split-two", status: "open", userPreference: 1, systemPreference: 1, purpose: "Two", description: "Two", dependencies: [], acceptance: "Pass", notes: "-" } },
  ], dependentReplacements: { "parent:split-dependent": "parent:split-one" }, outgoingDependencies: { "root:a": "parent:split-two" }, rationale: "separate bounded work" });
  expect(readFileSync(join(root, "parent/backlog.md"), "utf8")).toContain("split-one");
  expect(readFileSync(join(root, "parent/backlog.md"), "utf8")).toContain("split-two");
  expect(readFileSync(join(root, "parent/backlog.md"), "utf8")).toContain("move-me");
  expect(readFileSync(join(root, "backlog.md"), "utf8")).toContain("root:a");
});

test("refuses malformed or out-of-scope reconciliation without writing", () => {
  const root = mkdtempSync(join(tmpdir(), "backlog-refuse-"));
  mkdirSync(join(root, "component"));
  writeFileSync(join(root, "as-is.md"), "# root\n\n## Purpose\nRoot\n");
  writeFileSync(join(root, "component", "as-is.md"), "# component\n\n## Purpose\nComponent\n");
  const markdown = `${schema.replaceAll("skills/managing-backlog", "component")}\n`;
  writeFileSync(join(root, "backlog.md"), markdown);
  writeFileSync(join(root, "component", "backlog.md"), markdown);
  const before = readFileSync(join(root, "backlog.md"), "utf8");
  expect(() => reconcileBacklogs(root, { owner: "component", authorizedComponents: ["component"], rationale: "" }, { kind: "move", from: "root:prerequisite", toComponent: "component", rationale: "move" })).toThrow();
  expect(() => reconcileBacklogs(root, { owner: "component", authorizedComponents: ["component"], rationale: "bounded" }, { kind: "split", source: "root:prerequisite", replacements: [], dependentReplacements: {}, rationale: "split" })).toThrow();
  expect(readFileSync(join(root, "backlog.md"), "utf8")).toBe(before);
});

test("breaks dependency cycles deterministically", () => {
  const cycle = parseBacklog(`| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |\n| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |\n| a | open | 1 | 0 | A | A | skills/managing-backlog:b | A | - |\n| b | open | 1 | 0 | B | B | skills/managing-backlog:a | B | - |`, "skills/managing-backlog/backlog.md", "skills/managing-backlog");
  expect(() => calculateWeights(cycle)).not.toThrow();
  expect(calculateWeights(cycle).map((item) => item.weight)).toEqual([3, 2]);
});
