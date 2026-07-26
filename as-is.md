---
asIsVersion: 1

config:
  tasks:
    unitBudget:
      wallClockSeconds: 300
      costUsd: 0.50
  scheduling:
    wakeSeconds: 60
    checkInSeconds: 300
    maxConcurrentTasks: 1
    retryBackoffSeconds: 300
    maxRecoveryAttempts: 2
  notifications:
    materialEvents: true
  agents:
    defaultRole: as-is
  technology-preferences:
    runtime: bun
    package-manager: bun
  hitl:
    onBlocked: true
    onBudgetExceeded: true
    onExternalEffect: true
  logging:
    level: info
    retainDays: 30

task:
  status: completed
  worker: implementer
  updated: 2026-07-26T17:02:00Z
---

# as-is Project

## Purpose

Maintain the repository's current durable task context and active host-neutral
documentation without creating a second backlog, runtime state, or unrelated
cleanup. This bounded task is assigned to `implementer` through the supported
`as-is -> orchestrator -> implementer` mediation chain.

## Requirement

Apply the authorized documentation corrections, add the root agent/skill
initiative to `Pending Work`, assess directory grouping with
`structuring-content`, and preserve current task authority, `maxConcurrentTasks:
1`, the blocked no-retry exception, and audit value. Changes must remain scoped
to this repository; no external service, branch, remote, push, amend, or
concurrency change is authorized.

## Acceptance Criteria

- The active execution contract contains no obsolete XDG implementation
  reference and no active contract prescribes XDG; any retained historical
  wording is clearly labeled and has concrete audit value.
- The root `Pending Work` section is the authoritative finite inventory of
  project initiatives, explicitly distinguishes completion of the current
  record from exhaustion of project work, and states that an empty inventory is
  the exhaustion condition.
- The root inventory maps current and future agent/skill work to canonical agent
  definitions, canonical skills, host-exposure symlinks, and one bounded future
  selection process. The catalog is non-exhaustive and does not imply one task
  per catalog entry.
- Historical and out-of-scope fixture records are classified without being
  silently deleted or treated as current pending work; the blocked Increment 5
  cost-observability record remains blocked and explicitly no-retry, not
  completed.
- Directory structure is assessed with `structuring-content` and the design
  principles. Any grouping is justified, lowercase kebab case, reversible,
  reference-safe, and updates task-record lineage; otherwise the record explains
  why existing grouping is the smallest safe structure. `.agents` and
  `.opencode` remain separate, and agent role files do not move into an
  implementation directory.
- Existing agent and skill discovery, task-record validation, and historical
  fixture references remain correct; canonical `skills/` and `schemas/` remain
  grouped where justified; no second backlog or new runtime abstraction is
  introduced.

## Plan

Have the configured worker inspect the current records and references, make the
smallest scoped documentation or reversible path changes, use the applicable
maintenance and structuring skills, and validate before handoff. The parent
will independently inspect the worker result and run the required checks.

## Progress

New bounded task established from the prior terminal root record. Existing
historical records remain in place, including the blocked Increment 5 fixture;
no descendant has been created for this task yet.

Maintenance signal and scope recorded before implementation: the active
execution contract still named an obsolete XDG `tasks/` implementation detail;
the root inventory needed an explicit agent/skill selection boundary and
fixture classification; and the existing hierarchy needed an evidence-based
structure assessment. Affected artifacts are `execution-contract.md` and this
root record. Acceptance conditions are the criteria above, with particular
attention to record authority, no-retry blocking, canonical discovery paths,
and preservation of audit references. Residual risk before validation is that a
documentation-only correction could miss a stale active-contract reference or
misstate host discovery.

Implemented the surgical contract wording correction and durable inventory and
structure clarifications. No agent, skill, schema, fixture, or symlink path was
changed; no descendant records were created.

## Validation

Observed `python3 -m unittest -v test_task_record_validator.py` pass: 6 tests
passed, including valid-tree and descendant-closure/resource rejection cases.
Observed focused content assertions pass: active execution and design contracts
contain no `XDG`; inventory authority/exhaustion, canonical mappings, fixture
classification, no-retry wording, and structure rationale are present.
Observed host-exposure path assertions pass for 6 canonical `skills/*/SKILL.md`
directories and their `.agents/skills/` relative symlinks. Observed
`git diff --check` pass. Agent/skill paths were unchanged, so fresh host agent
discovery was not applicable; existing symlink inspection was sufficient for
the changed behavior. Actual host-reported cost: unavailable. Host-observed
wall-clock use: unavailable; no estimate is claimed.
Residual risk: these checks validate repository content and links, not a fresh
OpenCode process or runtime behavior; that runtime surface was intentionally
unchanged and remains covered by the existing adapter evidence.

## Structure Assessment

Using `structuring-content` and the design principles, the existing grouping is
the smallest safe structure: `.agents/agents/` owns canonical role files,
`skills/` owns reusable canonical skills, `schemas/` owns the validator and
schemas, and `.opencode/` remains a separate host adapter boundary. `.agents`
and `.opencode` remain separate, and agent role files stay under
`.agents/agents/`, not an implementation directory. The
`.agents/skills/` relative symlinks provide host exposure without copying
canonical skills. No new directory or path move is justified: the groups have
clear ownership already, a new level would add navigation and reference risk,
and role files must not move into an implementation directory. This is
reversible by retaining the existing paths and preserves task-record lineage.

## Result

Completed the bounded maintenance requirement. The active execution contract
and permanent design wording no longer present XDG as an implementation
reference; superseded configuration wording remains explicitly historical and
non-authoritative. `Pending Work` is the sole finite initiative inventory with
an explicit exhaustion condition and one bounded agent/skill selection process.
Historical fixtures and the blocked Increment 5 no-retry record remain
classified and untouched. Existing grouping and discovery paths were preserved.
There were no descendants; descendant closure is therefore terminal by absence.

## Blockers And Escalations

The historical `increment-5-cost-observability` record remains a blocked,
no-retry delegation exception: prior direct top-level fallback selected `as-is`,
the approved mediated attempt selected `general`, timed out, and produced no
configured-worker checkpoint. This task must not silently replace or complete
that record. Any broader structural or implementation issue must be recorded as
a blocker rather than expanded into this task.

## Recovery

The durable checkpoint is this completed root record plus the three changed
documentation artifacts. No private host state or cleanup is required. To
recover, reread this record and inspect `git show` for the scoped handoff; do
not alter the blocked Increment 5 fixture or create a second inventory.

## Next Action

Commit only this scoped completed handoff using `committing-completed-work`.

## Pending Work

This section is the sole authoritative finite inventory of project initiatives.
It is separate from the current record's completion state: this task may reach
`completed` when its acceptance conditions and descendants are terminal, while
the project is exhausted only when this inventory is explicitly empty; an empty inventory is the exhaustion condition. A
non-empty inventory means project work remains; it does not make this current
record incomplete.

- Implement and validate durable control-plane status queries, read-only general
  questions, durable questions/approvals/cancellation, and parent-orchestrator
  parallel delegation. The OpenCode live-control boundary remains documented but
  unimplemented.
- After that evidence is accepted, separately implement and validate future
  `maxConcurrentTasks: 3` leaf-worker behavior with leases/locks, global slots,
  independent budgets, sibling isolation, parent observation, and descendant
  closure. Do not raise the current value here.
- Resolve the host adapter's wrong-role/general fallback only through a new
  bounded design and explicit authorization; do not retry the blocked record.
- Map and maintain the agent/skill system through one bounded initiative: keep
  canonical agent definitions under `.agents/agents/`, canonical skills under
  `skills/`, preserve host-exposure symlinks and their discovery checks, and use
  this bounded selection process for future additions or changes: identify a
  missing or changed capability, map it to an existing canonical role/skill or
  propose one, verify ownership and host exposure, then add one initiative here
  only after explicit authorization and acceptance conditions are recorded. The
  current catalog is non-exhaustive and is an inventory of capabilities, not a
  task list; do not create one task per catalog entry.

No other project work is pending unless it is added to this section by a new
authorized task. Historical or out-of-scope fixtures are retained for lineage
and audit and are not implied initiatives: `opencode-mediation-dogfood` and
`increment-5-dogfood` are completed historical validation fixtures,
`increment-6-recovery-fixture` is a completed recovery fixture, and
`increment-5-cost-observability` is blocked historical evidence with an
explicit no-retry boundary. Their recorded statuses remain authoritative; the
blocked Increment 5 record is not completed.

## Change Log

- `2026-07-26 | ready` - Established this bounded maintenance task from the
  prior completed root handoff; preserved existing configuration, fixture
  records, and the blocked no-retry exception.
- `2026-07-26 | completed` - Corrected active contract wording, recorded the
  bounded inventory and fixture classifications, assessed existing grouping,
  and passed focused validator, content/path, and whitespace checks.
- Earlier closed work remains referenced by its scoped commits in Git history,
  including mediation, recovery, validator, and fixture handoffs.
