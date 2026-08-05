import { expect, test } from "bun:test";
import fixture from "./whats-next-routing.fixture.json";

type Task = { status: string; id: string; priority: string };
type BacklogItem = (typeof fixture.fallback.openBacklog)[number] & { safe?: boolean };

const precedence = ["active", "blocked", "awaiting-approval"];

function route(tasks: Task[], openBacklog: BacklogItem[]) {
  const actionable = precedence
    .map((status) => tasks.find((task) => task.status === status))
    .find(Boolean);
  if (actionable) {
    return { kind: "actionable", task: actionable, startsWork: false };
  }

  const priorityRank = { High: 3, Medium: 2, Low: 1 } as Record<string, number>;
  const item = [...openBacklog]
    .filter((candidate) => candidate.safe !== false)
    .sort((left, right) => priorityRank[right.priority] - priorityRank[left.priority])[0];
  return {
    kind: "recommendation",
    item,
    rationale: "High priority and directly addresses the broken routing fallback.",
    authorization: "recommendation only",
    startsWork: false,
  };
}

test.each(fixture.actionablePrecedence)(
  "preserves %s task precedence before backlog fallback",
  (task) => {
    const result = route([task], fixture.fallback.openBacklog);
    expect(result.kind).toBe("actionable");
    expect(result.task?.id).toBe(task.id);
    expect(result.startsWork).toBe(false);
  },
);

test("precedence chooses active before blocked and awaiting approval", () => {
  const result = route(
    [
      { status: "awaiting-approval", id: "approval-task", priority: "High" },
      { status: "blocked", id: "blocked-task", priority: "High" },
      { status: "active", id: "active-task", priority: "High" },
    ],
    fixture.fallback.openBacklog,
  );
  expect(result.kind).toBe("actionable");
  expect(result.task?.id).toBe("active-task");
  expect(result.startsWork).toBe(false);
});

test("blocked takes precedence over awaiting approval when active is absent", () => {
  const result = route(
    [
      { status: "awaiting-approval", id: "approval-task", priority: "High" },
      { status: "blocked", id: "blocked-task", priority: "High" },
    ],
    fixture.fallback.openBacklog,
  );
  expect(result.kind).toBe("actionable");
  expect(result.task?.id).toBe("blocked-task");
  expect(result.startsWork).toBe(false);
});

test("fallback names the highest-priority safe backlog item with rationale and does not authorize work", () => {
  const result = route([], fixture.fallback.openBacklog);
  expect(result.kind).toBe("recommendation");
  expect(result.item?.id).toBe(fixture.fallback.expected.itemId);
  expect(result.rationale).toBe(fixture.fallback.expected.rationale);
  expect(result.authorization).toBe(fixture.fallback.expected.authorization);
  expect(result.startsWork).toBe(fixture.fallback.expected.startsWork);
  expect(result.item?.id).not.toBe(fixture.fallback.genericResponse);
});
