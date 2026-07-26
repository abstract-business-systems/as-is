---
as-is-version: 2

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
  updated: 2026-07-26T17:32:52Z
constraints:
  cost:
    currency: USD
    allocated: 0.50
    spent: 0.00
    reserve: 0.05
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
  - Group the four historical fixture directories under validation-fixtures/ and preserve every child file and task record.
  - Add a navigation-only validation-fixtures/README.md and update all tracked path references without changing fixture task content except required path references.
  - Update the root Pending Work agent/skill initiative with a direct agent-skills.md link, current canonical roles/skills and host exposure, and an explicit bounded remaining-work boundary without inventing catalog tasks.
  - Update the root structure assessment and fixture classification with the maintenance-time restructuring rationale, authority/lifecycle checks, discoverability benefit, migration path, and lineage safeguards.
  - Preserve all historical statuses, workers, results, validation, blockers, recovery, and commit references; `validation-fixtures/increment-5-cost-observability` remains blocked and no-retry.
  - Do not move .agents, .opencode, skills, or schemas; do not change agent/skill definitions or runtime behavior.
  - Validate the root and moved child records with the applicable task-record checks, focused path/reference assertions, Git move/content preservation, and whitespace checks.
---

# as-is Project

## Purpose

Maintain the repository's current durable task context while performing one
explicitly authorized maintenance-time fixture migration and related reference
documentation. This bounded task is assigned to `implementer` through the
supported `as-is -> orchestrator -> implementer` mediation chain.

## Requirement

Use the updated maintenance-time `structuring-content` rule to group the four
historical validation fixtures under `validation-fixtures/`, add its navigation
README, update every tracked reference, and reconcile the root agent/skill
initiative and structure assessment. Preserve child task-record authority,
statuses, historical references, `maxConcurrentTasks: 1`, and the blocked
no-retry exception. Do not create a parent task record for the grouping, move
agent/skill/schema directories, change definitions or runtime behavior, or
perform any unlisted external effect.

## Acceptance Criteria

- All four named fixture directories are under `validation-fixtures/`, no old
  top-level fixture directory remains, and every file and child task record is
  preserved.
- `validation-fixtures/README.md` is a concise navigation entry point that
  identifies retained historical validation, dogfood, and recovery evidence,
  child-record authority, and the blocked Increment 5 no-retry state; it is not
  a task backlog or second authority.
- All tracked references use the new paths, with any retained historical path
  prose clearly labeled, while fixture task content and statuses remain
  unchanged except for correctness-required path references.
- Root `Pending Work` directly links to [agent-skills.md](agent-skills.md),
  identifies canonical roles, canonical skills, host exposure, and one bounded
  remaining selection/implementation/exposure/validation process; no particular
  additional agent or skill is selected without explicit authorization.
- Root structure assessment and fixture classification explain the shared
  lifecycle and purpose, discoverability and cognitive-load benefit, explicit
  restructuring authorization, migration path, authority/lifecycle checks,
  reversibility, and task-lineage preservation. `.agents`, `.opencode`,
  `skills`, and `schemas` remain unchanged and separate.
- Root and all moved child task records are checked with the applicable
  validator and focused path/reference, content-preservation, Git-move, and
  `git diff --check` checks; pre-existing validator violations are recorded
  without changing the blocked cost-observability record, which remains blocked
  and explicitly no-retry.

## Plan

Have the configured worker inspect the current records and references, perform
the smallest authorized reversible move and documentation updates, use
`maintaining-components`, `structuring-content`, and `verification-discipline`,
and validate before handoff. The parent will inspect the handoff independently,
rerun the required checks, and invoke `committing-completed-work` only after
descendant closure and scoped validation.

## Progress

New bounded maintenance task established from the completed root record. The
explicit current-turn restructuring request is the maintenance signal: four
retained historical fixtures have a shared validation/dogfood/recovery purpose,
but are scattered at the repository root, increasing scanning and classification
cost.

The target parent concept is `validation-fixtures/`, a semantic container for
retained historical evidence rather than a task backlog. Ownership remains with
the root documentation and each existing child component; child `as-is.md`
records remain authoritative for their scopes. The fixtures share a historical,
non-runtime lifecycle and no active implementation dependency, so the move does
not cross ownership, authority, lifecycle, or component-task boundaries. No
parent `as-is.md` is authorized for the container.

Affected consumers and references identified before implementation are the root
record's fixture classification and pending-work text, `opencode-adapter.md`,
fixture-local result/path prose, and any other tracked documentation references
found by repository-wide search. The authoritative entry point will be
`validation-fixtures/README.md`; the migration path is a reversible Git move of
the four directories followed by reference updates and content comparison.
Acceptance requires the front-matter statuses, workers, results, validation,
blockers, recovery, next actions, and historical commit references to survive;
the blocked cost-observability record remains blocked/no-retry. Audit and
lineage value is preserved by retaining every child record and documenting the
old-to-new paths in this root task record, not by creating a second authority.

Implementation was performed under the configured implementer role. No
descendant was created or delegated; the four existing fixture records remain
independent historical records and the grouping has no parent task record. The
working-tree migration and parent documentation are complete. The retained
blocked fixture is explicitly accounted for as historical evidence, not silently
completed or retried.

## Validation

Observed `python3 -m unittest -v test_task_record_validator.py`: 6 tests passed.
Observed focused validators: `validation-fixtures/opencode-mediation-dogfood`,
`validation-fixtures/increment-5-dogfood`, and
`validation-fixtures/increment-6-recovery-fixture` reported `VALID`.
`validation-fixtures/increment-5-cost-observability` reported the pre-existing
spent-plus-reserve and child-budget violations; its blocked record was not
changed. The whole-root validator is not applicable without broadening scope:
the mixed root contains legacy non-task records under `.agents` and `skills`,
and the preserved blocked fixture has the same historical budget violation.
Observed focused path assertions passed; all four old top-level directories are
absent, four target directories exist, the parent has no `as-is.md`, and the
direct agent-skills link and bounded selection boundary are present. Git
recognized all seven fixture paths as renames at normal similarity; retained-file
comparison passed for all unchanged fixture files, with only the required
dogfood result-path correction.
`git diff --check` passed. Protected `.agents`, `.opencode`, `skills`, and
`schemas` paths have no diff. Child statuses remain completed, completed,
completed, and blocked; the blocked record explicitly says no retry. The
supported mediation evidence identified `as-is`, `orchestrator`, and the
parent-linked `implementer`, with no substitution or retry. Actual host-reported
cost: unavailable. Host-observed wall-clock use: unavailable; no estimate or
zero is claimed. Residual risk is limited to the validator's known
legacy-record scope mismatch and the preserved historical budget violation;
neither is changed by this authorized navigation migration.

## Structure Assessment

Using the maintenance-time rule in `structuring-content` and the design
principles, the explicit restructuring request justifies the smallest safe
retroactive grouping: `validation-fixtures/` names the shared historical
validation/dogfood/recovery role, improves discoverability and lowers cognitive
load, and provides one clear README entry point. The grouping is not a generic
bucket or a second task authority because the four children share purpose and
lifecycle while retaining independent ownership and authoritative records. The
Git move is reversible, path references are enumerable, and child task lineage
is preserved by recording each old-to-new path and leaving child record content
and status intact. No parent `as-is.md` is needed because the container is not an
actual delegated component.

Canonical role files remain under `.agents/agents/`, canonical skills under
`skills/`, validator material under `schemas/`, and `.opencode/` remains a
separate host adapter boundary. `.agents` and `.opencode` remain separate;
`.agents/skills/` continues to expose canonical skills through relative
symlinks. None of those ownership or authority boundaries is crossed.

## Result

The four-directory migration, navigation README, reference updates, and root
documentation updates are present and preservation checks passed. This root
task is complete: no descendant was created for it, while the pre-existing
fixture records remain authoritative historical evidence under a navigation-only
container. The blocked cost-observability record is explicitly retained as
blocked/no-retry and is not treated as a completion failure or retried.

## Blockers And Escalations

No blocker remains for this root migration. The historical
`validation-fixtures/increment-5-cost-observability` record remains a blocked,
no-retry delegation exception: prior direct top-level fallback selected `as-is`,
the approved mediated attempt selected `general`, timed out, and produced no
configured-worker checkpoint. This task did not replace or complete that record.
Its focused validator reports the preserved historical budget-overrun fields,
and the mixed root validator reports legacy non-task records; both are recorded
residual risks rather than reasons to alter the fixture or broaden scope.

## Recovery

The durable checkpoint is this completed root record with the four directories
under `validation-fixtures/`, reversible Git moves, and recorded preservation
evidence. No private runtime state exists. If the commit handoff is interrupted,
reinspect the scoped diff and stage only the authorized root/reference
documentation, parent README, and moved fixture contents; do not alter the
blocked Increment 5 fixture or create a parent task record for the container.

## Next Action

Invoke `committing-completed-work` for this scoped root handoff. The retained
historical blocker and validator residual risks are recorded and require no
retry or content change.

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
- Map and maintain the agent/skill system through one bounded initiative; see
  the direct [agent-skills.md](agent-skills.md) catalog link. Current canonical
  roles are `as-is (primary)`, `orchestrator (subagent)`, and
  `implementer (subagent)` under `.agents/agents/`; current canonical skills
  are `maintaining-components`, `naming-software-concepts`,
  `structuring-content`, `verification-discipline`, `setting-up-as-is`, and
  `committing-completed-work` under `skills/`, exposed to the host through
  `.agents/skills/` relative symlinks and discovered by the configured host.
  For one explicitly authorized addition or change, select only after
  identifying a missing or changed capability, map it to an existing canonical
  role/skill or propose one, verify ownership and host exposure, implement the
  bounded change, and validate fresh discovery and the affected behavior. No
  additional agent or skill is selected without explicit authorization. The
  current catalog is non-exhaustive and is an inventory of capabilities, not a
  task list; do not create one task per catalog entry.

No other project work is pending unless it is added to this section by a new
authorized task. Historical or out-of-scope fixtures are retained under
`validation-fixtures/` for lineage and audit and are not implied initiatives:
`validation-fixtures/opencode-mediation-dogfood` and
`validation-fixtures/increment-5-dogfood` are completed historical validation
fixtures, `validation-fixtures/increment-6-recovery-fixture` is a completed
recovery fixture, and `validation-fixtures/increment-5-cost-observability` is
blocked historical evidence with an explicit no-retry boundary. Their recorded
statuses remain authoritative; the blocked Increment 5 record is not completed.

## Change Log

- `2026-07-26 | completed` - Independently accepted the configured implementer
  handoff, preserved the historical blocked/no-retry record, and completed the
  scoped root handoff despite the documented mixed-tree validator limitations.
 - `2026-07-26 | blocked` - Moved the four retained fixtures under
  `validation-fixtures/`, added navigation and updated references. Preservation
  and focused checks passed, but completion remains blocked by the preserved
  historical cost-observability record and validator scope limitations.
- `2026-07-26 | ready` - Established this bounded maintenance task from the
  prior completed root handoff; preserved existing configuration, fixture
  records, and the blocked no-retry exception.
- `2026-07-26 | completed` - Corrected active contract wording, recorded the
  bounded inventory and fixture classifications, assessed existing grouping,
  and passed focused validator, content/path, and whitespace checks.
- Earlier closed work remains referenced by its scoped commits in Git history,
  including mediation, recovery, validator, and fixture handoffs.
