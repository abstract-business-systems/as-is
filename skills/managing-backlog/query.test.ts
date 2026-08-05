import { expect, test } from "bun:test";
import { calculateWeights, loadBacklogs, parseBacklog, renderQuery, validateQueryRepresentation } from "./scripts/query";

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

test("breaks dependency cycles deterministically", () => {
  const cycle = parseBacklog(`| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |\n| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |\n| a | open | 1 | 0 | A | A | skills/managing-backlog:b | A | - |\n| b | open | 1 | 0 | B | B | skills/managing-backlog:a | B | - |`, "skills/managing-backlog/backlog.md", "skills/managing-backlog");
  expect(() => calculateWeights(cycle)).not.toThrow();
  expect(calculateWeights(cycle).map((item) => item.weight)).toEqual([3, 2]);
});
