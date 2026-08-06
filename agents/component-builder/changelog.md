# Changelog

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
