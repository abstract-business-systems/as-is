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
  worker: component-builder
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

test("root activation resolves the existing transient root task record", () => {
  const fixtureRoot = fixture();
  try {
    writeFileSync(join(fixtureRoot.root, "tasks.md"), record("ready").replace("maxConcurrentTasks: 1", "maxConcurrentTasks: 2"), "utf8");
    const control = new ControlPlane(fixtureRoot.root);
    control.activate(".");
    expect((control as any).recordFor(".").status).toBe("active");
  } finally {
    fixtureRoot.cleanup();
  }
});

test("root orientation accepts an absent transient root task record", () => {
  const fixtureRoot = fixture();
  try {
    const taskPath = join(fixtureRoot.root, "tasks.md");
    rmSync(taskPath, { force: true });
    const control = new ControlPlane(fixtureRoot.root);
    expect((control.status() as any).tasks[0].path).toBe(".");
    expect((control.status() as any).tasks[0].status).toBe("active");
  } finally {
    fixtureRoot.cleanup();
  }
});

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

test("admits one component budget extension within the parent reserve", () => {
  const fixtureRoot = fixture();
  try {
    const control = new ControlPlane(fixtureRoot.root, { clock: () => new Date("2026-07-26T17:05:00Z") });
    const child = control.delegate(".", "child-a", {
      requirement: "Continue the bounded child task.",
      acceptance: ["The child has a durable result."],
      allocatedCost: 3,
      costReserve: 1,
      allocatedWall: 30,
      wallReserve: 10,
    });
    control.activate("child-a");
    const questionId = control.recordQuestion("child-a", "Request more bounded budget");
    expect(questionId).toMatch(/^q-/);
    const result = control.extend("child-a", { cost: 2, wall: 20, recommendation: "approve", reason: "Remaining acceptance work is bounded." });
    expect(result.decision).toBe("approve");
    const text = readFileSync(join(child, "as-is.md"), "utf8");
    expect(text).toContain("allocated: 5");
    expect(text).toContain("allocated-seconds: 50");
    expect(text).toContain('"decision":"approve"');
    expect((control as any).recordFor("child-a").status).toBe("active");
    expect(readFileSync(join(fixtureRoot.root, "as-is.md"), "utf8")).toContain('"event":"budget-extension-decision"');
  } finally {
    fixtureRoot.cleanup();
  }
});

test("rejects an extension that would consume the parent reserve", () => {
  const fixtureRoot = fixture();
  try {
    const control = new ControlPlane(fixtureRoot.root, { clock: () => new Date("2026-07-26T17:05:00Z") });
    control.delegate(".", "child-a", {
      requirement: "Continue the bounded child task.",
      acceptance: ["The child has a durable result."],
      allocatedCost: 3,
      costReserve: 1,
      allocatedWall: 30,
      wallReserve: 10,
    });
    control.activate("child-a");
    control.recordQuestion("child-a", "Request more bounded budget");
    expect(() => control.extend("child-a", { cost: 6, wall: 1, recommendation: "approve", reason: "Too much." })).toThrow(/cost exceeds parent/);
    expect((control as any).recordFor("child-a").status).toBe("blocked");
  } finally {
    fixtureRoot.cleanup();
  }
});

async function runControlPlane(root: string, command: string, ...args: string[]): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  const process = Bun.spawn(["bun", join(import.meta.dir, "control-plane.ts"), command, root, ...args], { stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr] = await Promise.all([new Response(process.stdout).text(), new Response(process.stderr).text()]);
  return { exitCode: await process.exited, stdout, stderr };
}

test("runs the CLI extension flow against live component records", async () => {
  const fixtureRoot = fixture();
  try {
    const delegated = await runControlPlane(fixtureRoot.root, "delegate", ".", "child-a", "--requirement", "Continue the child.", "--acceptance", "The child completes.", "--cost", "3", "--cost-reserve", "1", "--wall-clock", "30", "--wall-clock-reserve", "10");
    expect(delegated.exitCode).toBe(0);
    expect(JSON.parse(delegated.stdout).status).toBe("ready");

    const activated = await runControlPlane(fixtureRoot.root, "activate", "child-a");
    expect(activated.exitCode).toBe(0);
    expect(JSON.parse(activated.stdout).status).toBe("active");

    const question = await runControlPlane(fixtureRoot.root, "question", "child-a", "Request bounded continuation budget");
    expect(question.exitCode).toBe(0);
    expect(JSON.parse(question.stdout).status).toBe("blocked");

    const extended = await runControlPlane(fixtureRoot.root, "extend", "child-a", "--cost", "2", "--wall-clock", "20", "--recommendation", "approve", "--reason", "The remaining acceptance work is bounded.");
    expect(extended.exitCode).toBe(0);
    const result = JSON.parse(extended.stdout);
    expect(result.decision).toBe("approve");
    expect(readFileSync(join(fixtureRoot.root, "child-a", "as-is.md"), "utf8")).toContain("allocated: 5");
    expect((new ControlPlane(fixtureRoot.root) as any).recordFor("child-a").status).toBe("active");
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
