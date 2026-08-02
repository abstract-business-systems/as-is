---
as-is-version: 2
task:
  status: ready
  worker: component-builder
  updated: 2026-08-02T00:00:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.90
    spent: 0.00
    reserve: 0.15
    source: unavailable
    fallback-metric: validation elapsed-seconds
  delegation:
    maximum-depth: 2
    maximum-children: 2
  execution:
    wall-clock:
      allocated-seconds: 600
      spent-seconds: 0
      reserve-seconds: 120
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - The multi-step worker/expert architecture is implemented through separately
    validated, scoped changes rather than one broad unverified change.
  - Each completed step has focused validation, durable task evidence, and a
    scoped Git commit before the next step begins.
  - The orientation/control-plane mismatch is resolved without changing the
    durable as-is.md versus transient task.md authority model.
  - Worker implementation, expert consultation, and final expert validation
    contracts are implemented and tested.
  - Component-builder commit behavior is gated on successful final expert
    validation.
  - The later global as-is routing proposal remains out of scope.
---

# Stepwise Worker/Expert Architecture

## Requirement

Implement the approved worker/expert architecture incrementally. Do not combine
all changes into one delegation or commit. Complete and validate each step,
create its scoped durable commit, then start the next step from the new HEAD.

## Approach

### Step 1: Restore orientation correctness

Fix `skills/as-is/scripts/orient.ts` and its control-plane integration so the
repository's current record model is honored:

- `as-is.md` remains durable component context and project configuration.
- `task.md` remains transient active-task authority.
- Root orientation must not require `as-is.md` to be a task record.
- Add or update focused tests for root and component orientation.

Acceptance: `bun skills/as-is/scripts/orient.ts` succeeds from the repository
root and focused orientation/control-plane tests pass.

### Step 2: Define expert consultation

Add a read-only `expert` role using the root-configured `large` model preset.
Extend `call_subagent` with a project-controlled `worker | expert` allowlist.
Keep expert tools read-only and prevent recursive expert delegation. Add focused
permission, role, and model-selection tests.

Acceptance: expert discovery and model selection are explicit; unsupported roles
are rejected; expert sessions cannot mutate or delegate; focused extension tests
pass.

### Step 3: Make worker implementation-capable

Update the worker role and its in-process session so it can implement bounded
component tasks using write tools. Preserve the component boundary, task-record
authority, no-commit rule, and expert consultation capability. Record concise
expert guidance and interim validation evidence in the active task record.

Acceptance: worker can edit only its assigned component, cannot commit or launch
unapproved subprocesses, can call the allowlisted expert, and focused behavior
checks pass.

### Step 4: Gate builder completion on expert validation

Update the component-builder contract and completion procedure so that, after
the worker claims completion, the builder reviews the actual uncommitted result
and requests final expert validation in the same controlled worktree/context.
The builder may integrate and commit only after a passing verdict, with failed or
blocked validation leaving a recoverable task record.

Acceptance: final validation evidence is durable, a failed/blocked verdict
prevents completion, a passing verdict precedes the scoped commit, and commit
checks pass.

## Execution Rules

- Work on one step at a time.
- Keep each step's changes and commit scoped; do not stage unrelated work.
- Reread the durable records after every delegated process returns.
- Treat process exit or an agent claim as insufficient without commit and
  validation evidence.
- Preserve incomplete work and record the exact blocker rather than claiming
  completion.
- Do not implement global `/as-is` routing or active-task reporting in this
  task; record those as a later bounded task after these prerequisites.

## Validation Plan

For each step, use the smallest relevant existing checks, plus:

- task-record validation for changed durable records;
- focused Bun tests for changed scripts/extensions;
- `bun build --no-bundle --target bun` for changed TypeScript entry points;
- `git diff --check` before commit;
- post-commit `git status --short` and commit-scope inspection.

## Current Status

This document records the agreed approach. No step has started yet. Step 1 is
the next action.

The root component record intentionally does not duplicate links to
repository-owned documentation, skills, or child components. Those records own
their own links and context. The root `changelog.md` is maintained only by the
component-builder after completed work; this task record is not a changelog.

## Recovery

Resume from this file, the current root `as-is.md`, and the latest committed
step. Do not infer completed steps from private runtime state or prior child
reports; use their durable commits and validation evidence.
