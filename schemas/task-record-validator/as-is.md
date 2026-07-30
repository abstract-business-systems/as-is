---
as-is-version: 2
task:
  status: completed
  worker: implementer
  updated: 2026-07-26T13:59:13Z
constraints:
  cost:
    currency: USD
    allocated: 0.20
    spent: 0.00
    reserve: 0.04
    source: unavailable
    fallback-metric: unavailable
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 300
      spent-seconds: 0
      reserve-seconds: 60
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Provide a deterministic local validator for version 2 component task records
    and their directory-derived task tree.
  - Reject weakened higher-authority constraints, exhausted child budgets, and
    incomplete descendant closure.
  - Include focused tests and local run documentation.
---

# Task-Record Validator

## Purpose

Make the Increment 2 task-record invariants mechanically checkable without
host-specific runtime enforcement.

## Requirement

Maintain the dependency-free validator, focused fixtures, and local run
documentation within this component. Named protocol and design references are
read-only dependencies.

## Plan

Implement the smallest local validator and tests, run the documented checks, and
record the terminal handoff.

## Progress

Completed with no descendants. The validator, six focused tests, and README were
added; the changed-artifact set remains local to this component.

## Validation

- `python3 -m unittest -v test_task_record_validator.py` passed all six tests,
  including valid trees, weakened constraints, budget exhaustion, and
  descendant-closure failures.
- Direct validation, Python compilation, and `git diff --check` passed.
- Residual risk: the intentionally small YAML subset does not cover arbitrary
  legal YAML or adversarial filesystem trees.

## Result

The deterministic local validator and focused checks are complete; descendant
closure is satisfied. Scoped implementation commit: `c19f45b`.

## Blockers And Escalations

No implementation blocker. Actual cost and host-observed wall-clock remain
unavailable and are not estimated.

## Recovery

Implementation and validation are retained in the component. No cleanup or
private runtime artifact is required; the completed handoff is recoverable from
this record and its local artifacts.

## Backlog

- Capture any future validator-agent follow-up here if a validation-specific
  backlog item is approved.

## Changelog

- Validation ownership remains with this component; no new implementation was
  added.

## Next Action

None within this component; parent may consume the completed handoff.
