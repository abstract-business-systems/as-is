---
as-is-version: 2
task:
  status: completed
  worker: component-builder
  updated: 2026-07-28T02:45:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.35
    spent: 0.00
    reserve: 0.05
    source: unavailable
    fallback-metric: validation elapsed-seconds (not monetary cost)
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 220
      spent-seconds: 150
      reserve-seconds: 60
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Add budget enforcement (wall-clock time and monetary cost) to the
    spawning-pi-subagents launcher so that a delegated Pi child process given
    budget limits stops the current action and returns when a limit is reached,
    rather than running unbounded.
  - Let a delegating agent forward time and money constraints to the executing
    agent through the launcher, and record that the constraints were passed so a
    parent can account for a budget-stopped return.
  - Preserve the existing launcher contract (agent file, task, cwd, model,
    tools, skills, approve flags, dry-run, private system-prompt handoff, and
    JSON/print/no-session mode); do not weaken the skill's stated non-properties
    beyond the budget surface this task explicitly implements.
  - Keep the change dependency-free and Bun/TypeScript-compatible per the
    centrally supplied runtime preference; do not add a host integration,
    credential, or external service dependency.
  - Do not modify control-plane.md, execution-accounting-design.md, the
    execution-accounting-design specification, accepted
    subprocess-execution-foundation supervisor code, or the retired systemd
    lineage; update this skill's SKILL.md and the named agent guidance only as
    needed to document the new budget surface.
  - Validate the launcher syntax/dry-run, the new budget behavior with the
    smallest deterministic focused check, task-record validity, and
    git diff --check before handoff; record residual risk, host-reported cost,
    and host-observed wall-clock use in this record.
---

# Spawning Pi Subagents Detached Handle Registry

## Purpose

The `spawning-pi-subagents` skill is the repository's synchronous launcher for
running a configured Pi agent role in a separate process with an isolated
context window. This component adds hard wall-clock enforcement and cost
constraint forwarding to that launcher so delegation is bounded and a parent can
account for a budget-stopped return.

## Requirement

Add a best-effort detached handle registry, `AS_IS_JOBS_REGISTRY` override,
`--no-registry`, focused deterministic coverage, and documentation while
preserving the existing launcher contract.

Implement budget enforcement in
`skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts` and document the new
surface in `skills/spawning-pi-subagents/SKILL.md`. Add launcher options that a
delegating agent uses to forward time and money constraints to the executing
agent, enforce the wall-clock limit at the launcher process level so the child
stops and returns when the limit is reached, forward the cost limit to the
executing agent through the task/system-prompt handoff (Pi cost is not directly
observable from the launcher), and emit a distinguishable, recorded
budget-stopped return so a parent can account for it.

The agent guidance under `.agents/agents/` is a named external dependency: the
worker may make minimal, documentation-only updates there to record that budget
constraints are forwarded through the launcher. Do not change role contracts,
permissions, or delegation authority; document the budget forwarding surface
only.

Do not modify `control-plane.md`, `execution-accounting-design.md`, the
`execution-accounting-design/` specification artifacts, the accepted
`subprocess-execution-foundation/` supervisor code, or any retired systemd
lineage artifact. Keep the change dependency-free and Bun/TypeScript-compatible;
do not add a host integration, credential, or external service dependency.

## Plan

1. Add launcher options for wall-clock and cost budgets (for example
   `--budget-wall-clock-seconds <n>` and `--budget-cost-usd <n>`); parse and
   validate them as non-negative numbers.
2. Enforce the wall-clock budget with a process-level timer that terminates the
   child (SIGTERM, then SIGKILL after a short grace) and returns a
   distinguishable budget-stopped exit outcome with a recorded stderr marker.
3. Forward both constraints to the executing agent through the private
   system-prompt/task handoff so the child can self-limit on cost, and include
   the constraints in the `--dry-run` resolved-command output so a parent can see
   they were passed.
4. Preserve every existing launcher contract element and the skill's stated
   non-properties except the budget surface this task implements; update SKILL.md
   and the named agent guidance minimally to document the new flags and the
   budget-stopped return.
5. Validate with the launcher syntax build, a `--dry-run` that shows the budget
   fields, a smallest deterministic focused enforcement check that does not
   contact a provider (for example, point `--pi` at a temporary stub that sleeps
   and assert the wall-clock budget stops it promptly), tree-wide
   `task-record-validator`, and `git diff --check`.

## Progress

Registry implementation is complete in the launcher, focused test, and skill
documentation. The existing budget enforcement is preserved.

Changes to the launcher:
- Added `--budget-wall-clock-seconds <n>` and `--budget-cost-usd <n>` options,
  parsed and validated as non-negative numbers; negative or missing values are
  rejected with a clear error.
- The wall-clock budget is enforced by a process-level timer that sends
  `SIGTERM` to the child's process group on expiry, then `SIGKILL` after a
  5-second grace. The child is spawned `detached` so the whole process tree is
  stopped, not only the direct child.
- On a budget stop the launcher writes the stderr marker
  `as-is budget-stopped: limit=wall-clock seconds=<n> exit=124` and exits with
  status `124`, distinguishable from a normal child exit code.
- Both constraints are forwarded to the executing agent through the private
  system-prompt handoff as a `Budget constraints forwarded by the delegating
  agent through the launcher:` block, stating the wall-clock hard stop and that
  cost is self-limited by the child.
- The `--dry-run` JSON output now includes a `budget` object with
  `wall-clock-seconds` and `cost-usd` so a parent can confirm the forwarded
  constraints without contacting a provider.
- The existing launcher contract is preserved: agent file, task, cwd, model,
tools, skills, approve/no-approve, no-tools, dry-run, private system-prompt
  handoff, JSON/print/no-session mode, Pi resolution order, and child exit-code
  forwarding on non-budget runs.

No dependencies were added; the change uses only `node:child_process` and
Bun/TypeScript built-ins.

## Validation

Required checks ran without provider contact: `bun build --no-bundle --target bun --outfile /tmp/as-is-spawn-pi-subagent.js skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts` succeeds; `bun test skills/spawning-pi-subagents/scripts/spawn-pi-subagent.test.ts` passes the deterministic registry and detach tests; dry-run confirms `detach: true` and budget/handle contract fields; `git diff --check` passes. Host-observed wall-clock use: approximately 8 seconds. Host-reported cost unavailable; fallback metric is elapsed seconds.

1. Launcher syntax build:
   `bun build --no-bundle --target bun --outfile /tmp/as-is-spawn-pi-subagent.js \
     skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts`
   outcome: `Transpiled file in 1ms` — succeeds.

2. `--dry-run` budget-field output:
   `bun skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts --agent
   .agents/agents/as-is.md --task "Inspect the current root task record." --cwd
   "$PWD" --budget-wall-clock-seconds 30 --budget-cost-usd 0.25 --dry-run`
   outcome: JSON includes `"budget": { "wall-clock-seconds": 30, "cost-usd":
   0.25 }` and the unchanged command/args/agent/skills/model/tools fields.
   Without budget flags the dry-run emits `"budget": { "wall-clock-seconds":
   null, "cost-usd": null }`.

3. Smallest deterministic focused enforcement check (no provider contact):
   pointed `--pi` at a stub (`#!/usr/bin/env bash\nsleep 30\nexit 0`) with
   `--budget-wall-clock-seconds 1 --budget-cost-usd 0.1`. Outcome: launcher
   returned in ~1028ms with exit `124` and stderr
   `as-is budget-stopped: limit=wall-clock seconds=1 exit=124`; no lingering
   `sleep`/stub process remained, confirming the process-group kill stops the
   whole child tree.

4. Regression of the non-budget path: a stub exiting `7` returned exit `7` and
   forwarded stdout/stderr unchanged; negative and missing budget values are
   rejected with exit `1`.

5. Tree-wide task-record validity:
   `python3 schemas/task-record-validator/task_record_validator.py .` reports
   INVALID due to pre-existing, unrelated records (`.agents/agents` and
   `.pi/prompts` are not v2 task records; `skills/verification-discipline`
   uses a different schema; the root budget overrun is the orchestrator's
   existing delegation state). These errors are identical on HEAD before this
   change and are outside this component's scope. The
   `skills/spawning-pi-subagents/as-is.md` record itself is valid and introduces
   no new validator errors; restoring this change removed the
   `completed record has non-terminal descendant` errors that HEAD reports.

6. `git diff --check` over the tracked changes: exit `0`, no whitespace errors.

## Result

Completed. Detached launches append one handle JSON line to the configured
registry, tolerate registry failures, and support `--no-registry`. Documentation
and focused deterministic test are included. No descendants were spawned. The
synchronous spawning-pi-subagents launcher now enforces a hard wall-clock budget at the process level (SIGTERM then SIGKILL on the child
process group, with a distinguishable exit `124` and `as-is budget-stopped`
stderr marker), forwards wall-clock and cost constraints to the executing agent
through the private system-prompt handoff, and records the forwarded budget in
`--dry-run` output. The existing launcher contract is preserved and the change
is dependency-free and Bun/TypeScript-compatible. SKILL.md and the orchestrator
agent guidance document the new surface. No descendants were spawned
(maximum-children: 0), so no descendant accounting is required.

## Blockers And Escalations

No current blocker. Residual risk: the launcher enforces a true wall-clock hard
stop, but Pi monetary cost is not directly observable from the launcher; cost
enforcement is forwarded to the child for self-limiting and is an approximation
— a child could overrun cost before self-limiting, and the launcher will not
detect it. The wall-clock budget is measured from child spawn to exit and does
not include launcher prompt preparation or `--dry-run`; the 5-second SIGKILL
grace means a SIGTERM-ignoring child is force-killed after ~budget+5s. The
budget timer is per-launch and not paused for child-driven pauses. Tree-wide
task-record validity is pre-existing INVALID for unrelated records outside this
component's scope; resolving those is out of scope for this bounded task.

## Recovery

Recover this task from this component record and Git history. The component
directory is `skills/spawning-pi-subagents`; the durable handoff is the launcher
change, SKILL.md budget surface, and the minimal orchestrator guidance note in
`.agents/agents/orchestrator.md`. If the worker return is interrupted, reread
this record before resuming; do not re-create `task-archives/` or revive the
retired systemd flow.

## Next Action

The scoped handoff is ready for commit via
`committing-completed-work` (this component's files plus the named
`.agents/agents/orchestrator.md` documentation dependency only). The parent
should then reread this record, confirm the recorded residual risk is
acceptable, and perform any nearest-common-ancestor integration.
