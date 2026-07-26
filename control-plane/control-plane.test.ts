import { expect, test } from "bun:test";
import { readFileSync, rmSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ControlPlane, ControlPlaneError } from "./control-plane.ts";

const record = (status = "active", maximumDepth = 2, maximumChildren = 2, updated = "2026-07-26T17:00:00Z") => `---
as-is-version: 2
config:
  scheduling:
    checkInSeconds: 300
    maxConcurrentTasks: 1
task:
  status: ${status}
  worker: implementer
  updated: ${updated}
constraints:
  cost:
    currency: USD
    allocated: 10
    spent: 1
    reserve: 1
    source: unavailable
    fallback-metric: unavailable
  delegation:
    maximum-depth: ${maximumDepth}
    maximum-children: ${maximumChildren}
  execution:
    wall-clock:
      allocated-seconds: 100
      spent-seconds: 10
      reserve-seconds: 10
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - A durable control-plane result.
---
# Root

## Purpose

Test root.

## Requirement

Test requirement.

## Plan

Test plan.

## Progress

Test progress.

## Validation

Test validation.

## Result

Not yet available.

## Blockers And Escalations

None.

## Recovery

Recover from the record.

## Next Action

Continue.
`;

function fixture(): { root: string; cleanup: () => void } {
  const root = mkdtempSync(join(tmpdir(), "control-plane-"));
  writeFileSync(join(root, "as-is.md"), record(), "utf8");
  return { root, cleanup: () => rmSync(root, { recursive: true, force: true }) };
}

test("status and general questions are record-only and source labelled", () => {
  const fixtureRoot = fixture();
  try {
    const control = new ControlPlane(fixtureRoot.root, { clock: () => new Date("2026-07-26T17:05:00Z") });
    const before = readFileSync(join(fixtureRoot.root, "as-is.md"));
    const status = control.status() as any;
    expect(readFileSync(join(fixtureRoot.root, "as-is.md"))).toEqual(before);
    expect(status["configured-max-concurrent-tasks"]).toBe(1);
    expect(status["next-check-in"]).toBe("2026-07-26T17:05:00Z");
    expect(status["active-tasks"][0].cost.observed).toBeNull();
    expect(status["active-tasks"][0].cost.source).toBe("unavailable");
    expect(status["active-tasks"][0]["wall-clock"].observed).toBeNull();

    const questionBefore = readFileSync(join(fixtureRoot.root, "as-is.md"));
    const answer = control.generalQuestion("What is the current status?") as any;
    expect(answer["read-only"]).toBe(true);
    expect(answer.changed).toBe(false);
    expect(answer.answer).toContain("next-check-in");
    expect(readFileSync(join(fixtureRoot.root, "as-is.md"))).toEqual(questionBefore);
  } finally {
    fixtureRoot.cleanup();
  }
});

test("questions, answers, approvals, and constraint rejection are durable", () => {
  const fixtureRoot = fixture();
  try {
    const control = new ControlPlane(fixtureRoot.root, { clock: () => new Date("2026-07-26T17:05:00Z") });
    const questionId = control.recordQuestion(".", "Choose a safe direction");
    const blockedStatus = (control.status() as any).tasks[0];
    expect(blockedStatus.status).toBe("blocked");
    expect(blockedStatus.blockers).toContain("answer required: Choose a safe direction");
    expect(() => control.answerQuestion(".", questionId, "unsafe", { proposedConstraints: { maxConcurrentTasks: 2 } })).toThrow(ControlPlaneError);
    expect((control.status() as any).tasks[0].status).toBe("blocked");

    control.answerQuestion(".", questionId, "continue safely", { direction: true });
    const approvalId = control.requestApproval(".", "Perform the recorded approved effect");
    expect((control.status() as any).tasks[0].status).toBe("awaiting-approval");
    control.approve(".", approvalId, "Approved for this recorded effect", { proposedConstraints: { "external-effects": "prohibited" } });
    control.cancel(".", "User cancelled after the approval checkpoint");

    const content = readFileSync(join(fixtureRoot.root, "as-is.md"), "utf8");
    const durableEvents = content.split("\n").filter((line) => line.startsWith("- control-plane: ")).map((line) => JSON.parse(line.slice("- control-plane: ".length)));
    expect(durableEvents.map((event) => event.event)).toEqual(["question", "direction", "question", "approval", "cancellation"]);
    expect(content).toContain("User cancelled after the approval checkpoint");
    expect(content).toContain("status: cancelled");
  } finally {
    fixtureRoot.cleanup();
  }
});

test("parent delegation is durable queued work and closes descendants", () => {
  const fixtureRoot = fixture();
  try {
    const control = new ControlPlane(fixtureRoot.root, { clock: () => new Date("2026-07-26T17:05:00Z") });
    const first = control.delegate(".", "child-a", {
      requirement: "Do the first independent bounded child task.",
      acceptance: ["The first child has a durable handoff."],
      allocatedCost: 3,
      costReserve: 1,
      allocatedWall: 30,
      wallReserve: 10,
    });
    const second = control.delegate(".", "child-b", {
      requirement: "Do the second independent bounded child task.",
      acceptance: ["The second child has a durable handoff."],
      allocatedCost: 3,
      costReserve: 1,
      allocatedWall: 30,
      wallReserve: 10,
    });
    expect(readFileSync(join(first, "as-is.md"))).toBeTruthy();
    expect(readFileSync(join(second, "as-is.md"))).toBeTruthy();
    const status = control.status() as any;
    expect(status["configured-max-concurrent-tasks"]).toBe(1);
    expect(new Set(status["delegated-tasks"].map((task: any) => task.path))).toEqual(new Set(["child-a", "child-b"]));
    expect(new Set(status["delegated-tasks"].map((task: any) => task.status))).toEqual(new Set(["ready"]));

    control.activate("child-a");
    expect(() => control.activate("child-b")).toThrow(/maxConcurrentTasks=1/);
    control.cancel("child-b", "Second child deferred by the one-leaf limit");
    control.complete("child-a", "First child completed its independent scope.");
    expect((control.canComplete(".") as any).eligible).toBe(false);
    control.complete(".", "child-b was cancelled and is accounted for.");

    expect((control as any).recordFor(".").status).toBe("completed");
    expect((control as any).rootMaxConcurrent()).toBe(1);
    expect(readFileSync(join(fixtureRoot.root, "as-is.md"), "utf8")).toContain("child-b was cancelled and is accounted for.");
  } finally {
    fixtureRoot.cleanup();
  }
});
