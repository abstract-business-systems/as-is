# Changelog

- 2026-08-06: Completed `independent-behavior-contract`. Refactored the
  component-builder contract and live harness to express local durable task
  authority, configured worker authority, and explicit no-delegation evidence
  without requiring a fixed upstream caller or downstream role output. The
  pre-refactor live baseline passed (3 tests, 27 assertions, 46.54 seconds),
  and the post-refactor baseline passed (3 tests, 27 assertions, 35.98 seconds).
  Deterministic live-test skip validation passed (3 skipped), and the launcher
  regression suite passed (28 tests, 197 assertions). Final read-only expert
  validation passed and judged the implementation safe to commit. No child
  implementation descendants were authorized; closure was vacuously terminal.
  Residual risk: live provider wording and latency remain model-dependent, and
  final expert validation accepted recorded command evidence without rerunning
  it.

- 2026-08-06: Completed `live-behavioral-baseline`. Added three independently
  fixture-backed opt-in real-Pi tests that validate the existing component-builder
  design for report-only orientation, explicit no-change handling, and task-record
  authority. All three live cases passed (3 tests, 27 assertions, 34.49 seconds).
  The repository and temporary fixtures remained unchanged; no child delegation
  or commit was observed. The test baseline records provider wording and latency
  as residual risks without changing the durable design record.

- Documented that the receiving component-builder owns semantic parent integration and that the launcher only observes handoff evidence and caller ancestry. Explicit no-separate-integration cases include same-component in-process assistance, parent-owned worktree changes, and no-change tasks. Agent-level planning now includes an open `agent-owned-tool-capabilities` item for declarative role tool capabilities with package/host implementation ownership.

- Completed `tool-contract-and-completion-gates`: declared the component-builder
  ordinary capability set required by its role contract, including
  `call_subagent`. The launcher remains front-matter-authoritative with no
  identity-based injection. Focused launcher tests, builds, reference checks,
  and read-only expert validation passed. No descendants were launched.

- Completion evidence for `in-process-authority-alignment` is recorded below;
  the implemented item is eligible for cleanup.

## 2026-08-08 — Align component-builder authority model

Updated `agent.md` so component-builder owns semantic completion, uses in-process
`call_subagent` for same-component implementation assistance and expert
plan/advice/final validation, and reserves `spawning-pi-subagents` for separately
owned component boundaries. No Phase 2a, migration, launcher, parent, sibling, or
root files were changed.

Validation: `bun skills/as-is/scripts/orient.ts` completed before work;
`git diff --check` passed; attributable in-process `EXPERT PLAN REVIEW` passed
before edits; attributable in-process `EXPERT FINAL-DIFF VALIDATION` passed after
edits and declared the change safe to commit. Host-reported cost and
host-observed wall-clock use were unavailable; each required gate was requested
with a 900-second timeout, satisfying the recorded 600-second minimum allocation.

Residual risk: runtime availability and host budget enforcement for
`call_subagent` are supplied by the corrected launcher and were not independently
exercised by this documentation-only change. Parent terminal-record closure and
integration remain the parent responsibility.

Result: completed; no descendants. Recovery checkpoint is the scoped diff in
`agents/component-builder/agent.md` and this changelog entry. Next action is
scoped commit handoff.
