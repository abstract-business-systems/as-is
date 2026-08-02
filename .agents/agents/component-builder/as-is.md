---
as-is-version: 2
task:
  status: completed
  worker: component-builder
  updated: 2026-07-29T19:52:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.50
    spent: 0.00
    reserve: 0.05
    source: unavailable
    fallback-metric: validation elapsed-seconds (not monetary cost)
  delegation:
    maximum-depth: 2
    maximum-children: 8
  execution:
    wall-clock:
      allocated-seconds: 300
      spent-seconds: 0
      reserve-seconds: 60
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Add an orientation script that returns a compact one-call snapshot of
    repository task state, so an executing agent orients in one command instead
    of five-to-seven sequential read turns.
  - The snapshot includes: root as-is.md task status and next-action; each
    component as-is.md record's status (path and status); the open surface
    (non-completed records, the latest `Changelog` entry and its residual-risk
    bullets, and spec open-decisions grepped from design docs); and the working
    tree state (uncommitted file list or clean).
  - Build the snapshot on the control-plane's TaskSnapshot interface (smallest
    reuse) rather than re-implementing record parsing; fall back to direct
    parsing only where control-plane does not provide the field.
  - Place the script under skills/as-is/scripts/ following the
    spawning-pi-subagents/scripts/ pattern; name it for its responsibility, not
    a generic filler like utils.
  - Add a contract line to .agents/agents/component-builder/agent.md directing
    the agent to orient via this script as the recommended first action when
    starting a task ("if needed" stays the agent's judgment), and to handle
    report-only delegated tasks by orienting and returning without building.
  - Keep the script dependency-free and Bun/TypeScript-compatible per the
    centrally supplied runtime preference; do not add a host integration,
    credential, or external service dependency.
  - Do not weaken the component-builder's existing boundaries: it still selects
    the configured worker named by each child record, never substitutes general
    or explore, and does not treat Pi process exit as task completion.
---

# component-builder Orientation

## Purpose

The component-builder builds one bounded component and manages its as-is.md
record. To start fast, it needs current repository task state in one call
rather than burning five-to-seven orientation turns reading records, the change
log, and specs. An orientation script provides that snapshot; the agent keeps
judgment over when to call it ("if needed").

## Requirement

Implement a compact orientation script that returns a one-call repository task
snapshot, and add a contract line directing component-builder to use it as the
recommended first action when starting a task and after a delegation returns.
The script replaces the multi-read orientation that made delegated tasks slow.

## Plan

1. Inspect `components/control-plane/control-plane.ts` for the `TaskSnapshot` interface
   and any reusable record-scanning logic; reuse it for record status and
   next-action fields.
2. Create `skills/as-is/scripts/<responsibility-name>.ts`. The script:
   - reads root `as-is.md` status + next-action;
   - scans every `as-is.md` under the repo (excluding `.git`, `node_modules`,
     `.pi`, `.opencode/node_modules`) and prints path + status;
   - lists non-completed records as the open surface;
   - prints the latest canonical `Changelog` section entry and any residual-risk bullets;
   - greps design docs for "open decision" / "open question" lines;
   - prints working-tree state (`git status --porcelain` or `clean`).
3. Keep output compact (one screenful) so it fits cheaply in a child context.
4. Run the naming skill over the script name before committing it.
5. Add to `.agents/agents/component-builder/agent.md` a line: orient via the
   script as the recommended first action when starting a task (judgment
   retained per "if needed"); re-call after a delegation returns; for a
   report-only delegated task, orient and return without building.

## Progress

The component-builder agent contract line was applied directly: the
orientation-script usage direction and the report-only handling note were
added, and the commit-on-complete / preserve-on-incomplete line was added.
The duplicated front-matter fragment from the directory-layout migration was
fixed. Implemented `skills/as-is/scripts/orient.ts` and its focused test. The script
uses `ControlPlane.status()` for task snapshots, then adds next-action,
change-log, open-decision grep, and working-tree observations.

## Validation

- The component-builder contract file contains the orientation line and the
  report-only handling note.
- `opencode agent list` discovers `component-builder (subagent)`.
- The agent file front-matter is valid with no duplicated fragment.
- `bun test skills/as-is/scripts/orient.test.ts` passed (1 test).
- `bun build --no-bundle --target bun --outfile /tmp/orient.js skills/as-is/scripts/orient.ts` passed.
- `git diff --check` passed.

## Result

Completed the bounded orientation snapshot and contract update. No child
records or descendants were created; all acceptance work is terminal.

## Blockers And Escalations

None. Residual risk: the script reports a worktree's working-tree state, which
is `clean` for a detached-HEAD worktree (correct for an executing agent
starting from a known HEAD; the caller's in-flight work is intentionally not
visible). The caller's intent reaches the child via the task text, not leaked
state. If a caller needs the child to see uncommitted state, it must commit
first or pass the intent in the task.

## Recovery

Recover from this record, the component-builder agent file at
`.agents/agents/component-builder/agent.md`, and the control-plane interface
at `components/control-plane/control-plane.ts`. The script is self-contained and
re-runnable; no private runtime state is required.

## Next Action

No further action for this bounded task. Residual risk: the compact parser
intentionally uses the repository's narrow Markdown conventions.
