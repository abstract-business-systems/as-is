---
as-is-version: 2
task:
  status: completed
  worker: component-builder
  updated: 2026-08-03T00:10:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.90
    spent: 0.00
    reserve: 0.10
    source: unavailable
    fallback-metric: unavailable
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 600
      spent-seconds: 0
      reserve-seconds: 60
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Orient reads durable as-is.md plus transient task.md without mismatch.
  - Worker role can implement bounded changes without committing; expert role is read-only and uses large preset.
  - call_subagent permits only project-controlled worker or expert roles.
  - Component-builder requires expert validation before commit.
---
# Task

## Requirement
Implement the approved orient/control-plane prerequisite and worker/expert architecture. Do not implement global as-is routing.

## Plan
Fix record discovery and orientation, add focused tests, update role contracts and call_subagent allowlist, then validate and commit.

## Progress
Control-plane now treats task.md as active task authority while retaining durable as-is.md for root configuration and context.

## Validation
- `bun test components/control-plane/control-plane.test.ts skills/as-is/scripts/orient.test.ts`: 4 passed, 0 failed.
- `bun build --no-bundle --target bun --outfile /tmp/worker-tools.js .pi/extensions/worker-tools.ts`: passed.
- `git diff --check`: passed.
- Final expert validation (read-only inspection of this same controlled worktree/context): PASS; scoped changes are safe to commit. Confirmed durable `as-is.md` plus transient `task.md` discovery, worker writable/no-commit contract, large read-only expert contract, role allowlist, and builder validation gate.

## Result
Implemented the bounded orient/control-plane prerequisite and approved worker/expert architecture. Global as-is routing was not changed.

## Blockers And Escalations
None.

## Recovery
Resume from this record; inspect uncommitted changes and rerun focused tests before further edits.

## Next Action
Durable handoff is complete; no further action for this bounded task.
