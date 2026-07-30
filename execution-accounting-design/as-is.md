---
as-is-version: 2
task:
  status: completed
  worker: orchestrator
  updated: 2026-07-27T10:25:59Z
constraints:
  cost:
    currency: USD
    allocated: 0.05
    spent: 0.00
    reserve: 0.01
    source: unavailable
    fallback-metric: validation elapsed-seconds (not monetary cost)
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 120
      spent-seconds: 0
      reserve-seconds: 30
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Define the change-log front-matter cumulative summary, currency/unit/source
    and unknown semantics, build/failure counting, and no-double-count update
    rule without inventing historical measurements.
  - Define component-path plus task-revision plus attempt as durable observation
    identity, remove runtime JobId authority from current task context, and
    preserve necessary historical facts without claiming byte-level recovery.
  - Define the private persisted supervisor JobId map, restart reconciliation and
    expiry, and component-path public status lookup with JobId diagnostic-only.
  - Define cost, wall-clock, build/failure, parent/child, retry/recovery, and
    full-invocation versus worker-subtree ownership and reconciliation.
  - Provide independently verifiable fixtures for two attempts, retry/recovery,
    unavailable money, measured time, parent/child delegation, build success and
    failure counts, full invocation plus worker subtree, and JobId-map restart.
  - Preserve the OpenCode adapter/generic supervisor separation, leave retired
    systemd retired, do not modify control-plane.md or implementation code, and
    validate the design before any implementation task is authorized.
---

# Execution Accounting Design

## Purpose

Own the bounded, cross-cutting design decision for accounting and runtime
identity before implementation. The repository root is the nearest common
ancestor for the integration edits; this record preserves the design task,
acceptance evidence, fixtures, and handoff without creating a second task tree.

This is an orchestrator-owned design task authorized by the current turn. No
implementer is launched, and `worker: orchestrator` is intentional rather than
a silent role substitution. The task has no descendants.

## Requirement

Update the durable specifications and current task context so that historical
change-log accounting is explicit and non-duplicating, component paths rather
than runtime JobIds are authoritative, supervisor runtime identity is private
and restart-reconcilable, public status uses a stable component-path lookup,
and parent/child/retry/full-invocation observations have one clear accounting
owner. Add the permanent subject specification
`execution-accounting-design.md`. Do not modify application or component
implementation code, `control-plane.md`, or the retired systemd lineage.

## Plan

1. Inspect current change-log conventions, all task records, the protocol,
   execution/orchestration/configuration specifications, supervisor accounting
   types and tests, validator/schema code, agent guidance, and recent Git history.
2. Record settled identity, map, status, summary, and reconciliation decisions
   in the subject specification and update only the affected durable references.
3. Add the fixture matrix below as independently checkable expected cases;
   distinguish fixture expectations from observed historical measurements.
4. Run focused reference searches, task-record/schema validation, existing
   accounting and supervisor tests, and `git diff --check`. Keep the task
   non-implementation and do not launch a worker.

## Progress

Inspection found that the current version-2 task protocol has cumulative
component-local budget fields and the supervisor has per-job `budget-observed`
checkpoints, but there is no complete cross-session summary or stable
cross-record deduplication rule. Current task records do not have a dedicated
JobId front-matter field; the root task context nevertheless required public
status by durable job ID and treated that runtime handle as part of its target
identity. The design removes that requirement and explicitly treats existing
runtime JobIds as diagnostic observations only.

The existing historical values are preserved without remeasurement: the
retired cost-observability entry records `0.0981479` USD and `81.994` seconds,
and the OpenCode mediation fixture records `0.0525789` USD and
`50.502114668` seconds. Their concise historical entries do not retain a
complete task-revision/attempt key, so the new change-log summary remains
`unknown` rather than summing possibly overlapping facts. No byte-level
recovery claim is made for removed uncommitted artifacts.

### Fixture matrix

These are deterministic design fixtures and expected reconciliation results;
they are not observations from this design-only task.

| Fixture | Input | Expected result |
| --- | --- | --- |
| Two attempts | One component/revision; attempt 1 and attempt 2 each emit a terminal measurement; repeated attempt-1 polling repeats its key | Two attempts remain visible; each is counted once; the repeated observation does not add again; the task's cumulative record carries both attempts. |
| Retry/recovery | Attempt 1 blocks or fails; bounded recovery starts attempt 2 under the same task revision with a new runtime JobId | Attempt 1 evidence is retained, attempt 2 has the next ordinal, the configured worker is unchanged, and no runtime-handle change resets or duplicates prior use. |
| Unavailable money | A worker-subtree cost source returns `unavailable`, while its source and measured wall-clock are present | Cost remains unavailable and any incomplete cumulative cost is `unknown`, never numeric zero; measured time remains independently reportable. |
| Measured time | A monotonic worker-subtree clock reports seconds and a separate full-invocation clock reports end-to-end seconds | Both values retain source and boundary; only the canonical worker-subtree value contributes to the cumulative summary. |
| Parent/child delegation | Parent reserves a child allocation; child records actual use and a failed descendant | Child owns its actual use; parent does not add it to `spent`; parent completion evidence names the failed descendant and cannot complete while it is non-terminal. |
| Build success/failure | Two unique build observations, one successful and one failed, with a repeated poll of the failed build | `build-count = 2` and `fail-count = 1`; the failed build contributes once to both counts, and its repeated poll contributes nothing. |
| Full invocation plus worker subtree | One end-to-end invocation observation overlaps one worker-subtree observation | Both views remain visible with explicit boundaries; the full-invocation value is non-additive and is not included in canonical totals. |
| JobId-map restart/reconciliation | Persisted map reloads one live handle, one dead handle, and one terminal/cleaned entry | Live handle reattaches to the same path/revision/attempt; dead state becomes unknown/unavailable without inferred completion; terminal entry expires only after cleanup/retention; path status works without JobId. |

The permanent decisions and expected fixture outputs are in
`execution-accounting-design.md`; this table is the acceptance-oriented index,
not a second specification.

## Validation

`verification-discipline` selected standard-risk documentation and contract
validation, with focused end-to-end reference coverage because the requested
model affects accounting and operational status boundaries.

Completed checks for this handoff are:

- Focused content/reference searches found the stable
  `component-path/task-revision/attempt` key, `worker-subtree` and
  `full-invocation` boundaries, `build-count`/`fail-count`, the persisted
  `runtime/job-map.json` location, component-path status, and diagnostic-only
  JobId wording. The same searches found only historical/prohibitive systemd
  and archive references; no implementation path or active fallback was added.
- `python3 -m unittest -v schemas/task-record-validator/test_task_record_validator.py`
  passed all 6 validator tests.
- `python3 schemas/task-record-validator/task_record_validator.py
  execution-accounting-design` reported `VALID`, as did the retained terminal
  `subprocess-execution-foundation` component.
- `bun test subprocess-execution-foundation/supervisor.test.ts` reported `10
  pass`, `0 fail`, and `106 expect()` calls, including unavailable cost,
  measured wall-clock, attempt/recovery, and no-double-count supervisor paths.
- `bun test control-plane/control-plane.test.ts` reported `3 pass`, `0 fail`,
  and `28 expect()` calls; `bun build control-plane/control-plane.ts --target
  bun --outfile /tmp/as-is-control-plane-check` bundled one module with no
  diagnostics. The implementation and `control-plane.md` were not changed.
- `bun --check subprocess-execution-foundation/supervisor.ts` passed. A direct
  `bun --check control-plane/control-plane.ts` is not applicable on this host:
  the module executes its CLI and returned `control-plane: a command is
  required`; the successful Bun build is the syntax/build evidence instead.
- `git diff --check` completed with no output. The pre-existing untracked
  `control-plane.md` remains untouched, and no application/component
  implementation file is in this task's changed-artifact set.
- Pre-commit revalidation repeated the six task-record validator unit tests
  successfully; focused validation reported `VALID` for this component and the
  retained `subprocess-execution-foundation` record; the supervisor suite
  reported `10 pass`, `0 fail`, and `106 expect()` calls; the control-plane suite
  reported `3 pass`, `0 fail`, and `28 expect()` calls; and the control-plane
  Bun build plus supervisor syntax check succeeded. Both unstaged and staged
  `git diff --check` completed without diagnostics. The control-plane status
  query reported the root as `blocked`, this component as `completed`, no active
  tasks, and repository-record-only source.
- Repository-wide validation remains `INVALID` only for pre-existing mixed
  agent-record shape, root-only `config`, legacy skill-record fields, and
  aggregate root budget/delegation/descendant issues. Those unrelated records
  were not repaired; this new component and the retained supervisor component
  validate independently.

These are direct tool observations. They establish the design references,
fixture matrix, focused record validity, existing accounting/lifecycle tests,
and whitespace integrity, but do not implement or exercise the proposed
restart map or public status surface. No worker attempt, application
implementation change, provider billing observation, or new task-run cost is
claimed. Monetary cost is unavailable; cumulative task wall-clock is also
unavailable and remains `spent-seconds: 0` only as the protocol-compatible
unmeasured value, not as a measured zero. Residual risk is limited to later
implementation choices for the durable task-revision field, map persistence,
adapter reattachment, and public status wiring.

## Result

The design result is complete as an orchestrator-owned design handoff. The subject
specification, affected references, and this record agree on the stable
path/revision/attempt identity, private JobId-map lifecycle, public status
lookup, and non-overlapping accounting boundaries. The fixture matrix covers
two attempts, retry/recovery, unavailable money, measured time, parent/child
delegation, build success/failure counts, full invocation plus worker subtree,
and JobId-map restart/reconciliation. Historical measurements remain separate
and the cumulative summary remains explicitly incomplete rather than invented.
The scoped design handoff is now separable from the pre-existing root-audit
changes; those root/integration changes remain outside this component commit.
This completion does not claim accounting implementation, an OpenCode adapter,
or live status/watch support.

## Blockers And Escalations

The design itself has no implementation blocker. The repository root/integration
task remains independently `blocked` by its missing host adapter, durable
component-path status surface, and unproven live control capabilities; that
parent state is not changed by this completed design handoff. The pre-existing
root-audit edits remain outside this component's scoped commit. `control-plane.md`
is a pre-existing untracked file and remains untouched. Do not revive systemd,
launch an implementer, or stage unrelated work.

## Recovery

Recover from this completed record, `execution-accounting-design.md`, the
changed durable specifications, `change-log.md`, and Git history. Preserve
existing historical measurements and the explicit incomplete-summary state. Do
not add a runtime map, infer a JobId identity, restore an archive folder, claim
byte-level recovery of uncommitted content, or launch a worker without a new
bounded implementation authorization.

## Backlog

- Expose child cost back to the parent for cumulative accounting.

## Changelog

- Accepted cumulative-accounting ownership from the launcher follow-up review.
- Kept the design record terminal; no implementation was added.

## Next Action

None within this component; cumulative-accounting follow-up ownership is retained here.
