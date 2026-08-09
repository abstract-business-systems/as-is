import { expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { calculateWeights, cleanupCompletedBacklogs, findCompletedItems, loadBacklogs, parseBacklog, renderQuery, validateQueryRepresentation } from "./scripts/query";

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

test("cleans evidenced completed rows and leaves other rows intact", () => {
  const root = mkdtempSync(join(tmpdir(), "backlog-cleanup-"));
  const component = join(root, "component");
  mkdirSync(component);
  Bun.write(join(component, "as-is.md"), "# Component\n");
  writeFileSync(join(component, "backlog.md"), schema.replace("skills/managing-backlog/backlog.md", "component/backlog-table-schema"));
  writeFileSync(join(component, "changelog.md"), "# Changelog\n- Completed `prerequisite`; tests passed.\n");
  const completed = cleanupCompletedBacklogs(root);
  expect(completed.map((item) => item.id)).toEqual(["prerequisite"]);
  const remaining = readFileSync(join(component, "backlog.md"), "utf8");
  expect(remaining).not.toContain("| prerequisite | open |");
  expect(remaining).toContain("| dependent | selected |");
});

test("breaks dependency cycles deterministically", () => {
  const cycle = parseBacklog(`| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |\n| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |\n| a | open | 1 | 0 | A | A | skills/managing-backlog:b | A | - |\n| b | open | 1 | 0 | B | B | skills/managing-backlog:a | B | - |`, "skills/managing-backlog/backlog.md", "skills/managing-backlog");
  expect(() => calculateWeights(cycle)).not.toThrow();
  expect(calculateWeights(cycle).map((item) => item.weight)).toEqual([3, 2]);
});
