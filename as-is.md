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
  updated: 2026-07-26T15:35:44Z
---

# as-is Project

## Current Increment 6

### Current Task

Implement Increment 6 recovery and independent validation. Define the
host-neutral recovery policy for stale active records, bounded retries and
backoff, cumulative budget preservation, and explicit unavailable-worker
replacement. Validate it with a harmless interrupted child fixture recovered
from its durable component record without a model-backed run.

### Purpose

Keep interruption recovery conservative and recoverable: durable component
records remain authoritative, retries are finite and cumulative, unavailable
workers cannot be silently substituted, and private runtime state is never a
completion prerequisite.

### Acceptance Criteria

- The host-neutral contract defines source-labelled stale detection, finite
  retry and backoff bounds, cumulative cost and wall-clock preservation,
  record-only recovery, explicit replacement approval, descendant closure, and
  private-artifact cleanup boundaries.
- Recovery never resets spent observations, silently changes the configured
  worker, infers completion from process exit, or produces duplicate durable
  completion. Wrong-role fallback remains a blocker.
- `opencode-adapter.md` contains only the necessary OpenCode mapping for the
  policy and does not claim automatic enforcement absent host evidence.
- A harmless interrupted child fixture is recovered from its component record
  after its private runtime state is unavailable, proving status transitions,
  preserved attempt and budget history, terminal descendant closure, and
  private-only cleanup.
- An independent local validation pass checks stale detection, backoff and
  attempt bounds, cumulative budgets, replacement authorization, descendant
  accounting, record-only recovery, and cleanup boundaries.
- The increment uses no more than the configured USD 0.50 unit budget. No
  model-backed or external validation run is required or authorized.

### Progress

- Increment 6 opened under current-turn user authorization at the configured
  USD 0.50 unit budget. Historical Increment 5 records remain unchanged and
  are not retried.
- This is cross-cutting root integration across the host-neutral contract,
  task-record protocol, orchestration design, root effective configuration,
  and OpenCode adapter. No child owns those shared contracts.
- A new `increment-6-recovery-fixture/as-is.md` record was created atomically
  in `ready` state for the configured `implementer`, then completed as the
  bounded child used only for deterministic interrupted-recovery validation.
- The fixture's durable trace is `active -> blocked -> active -> completed`.
  Its controlled timeout returned `124`, measured `0.141520954` monotonic
  seconds, preserved cost `0.00 USD` with source `unavailable`, and removed
  only its private temporary state.
- No model-backed invocation, external lookup, or provider billing observation
  was needed for this increment. The child handoff is committed in
  `be93087`.

### Decisions

- Existing `checkInSeconds` is the stale-observation interval and existing
  `retryBackoffSeconds` is the base retry delay. Adding
  `scheduling.maxRecoveryAttempts: 2` is necessary because the acceptance
  condition requires a finite retry bound and the existing configuration had
  no attempt limit. The maximum is two recoveries after the initial attempt.
- Stale detection uses durable `task.updated`, the effective check-in
  interval, and the observer's current UTC clock, all source-labelled. An
  unavailable clock or missing checkpoint yields `unknown`, not stale.
- Recovery records each attempt, source, reason, cumulative observations,
  remaining budget, and next backoff in existing Markdown sections. No new
  task-record front-matter field is needed.
- An unavailable configured worker is a durable blocker. A named replacement
  requires explicit direction or approval and a recorded transition; OpenCode
  wrong-role fallback is not a replacement and remains blocked.
- Root policy and record semantics remain host-neutral. The adapter only maps a
  fresh OpenCode attempt, timeout/observation sources, role attribution, and
  cleanup limitations.

### Validation

- Independent validation ran in a separate local Python process and passed all
  required assertions: source-labelled stale detection, finite backoff and
  attempt bounds, cumulative budgets, named replacement approval, wrong-role
  blocking, record-only recovery, descendant accounting, and cleanup boundary.
- `git diff --check` passed for the current uncommitted root integration scope;
  the child handoff passed `git diff --cached --check` before commit.
- Fresh local OpenCode role discovery remains historical evidence from
  Increment 5; this increment did not invoke a model-backed host run.
- Cost source for this increment: unavailable; no model/token or provider
  billing cost was observed. Fixture wall-clock source: local monotonic wrapper,
  `0.141520954` seconds for the interrupted attempt. No estimate is claimed.

### Result

- Increment 6 policy and independent validation are complete. The host-neutral
  recovery policy preserves lifecycle authority and cumulative observations,
  bounds recovery at two retries with recorded exponential backoff, blocks
  silent replacement and wrong-role fallback, and keeps completion dependent on
  durable evidence and descendant closure. The OpenCode adapter contains only
  the host mapping and its enforcement limitations.

### Blockers And Escalations

- None for Increment 6. The historical
  `increment-5-cost-observability/as-is.md` blocked record is preserved as
  prior evidence and was not retried or rewritten; it is not a descendant of
  the new Increment 6 fixture task. No worker replacement was requested.

### Recovery

- Last durable checkpoint: the fixture completed from record-only recovery,
  independent validation passed, and the child handoff was committed.
- Incomplete work: root status transition and scoped root integration commit.
- Cleanup completed: the fixture's private temporary state was removed after
  its durable trace; no repository runtime artifact was created.
- Recovery limitation: the stale observation used a source-labelled
  deterministic fixture clock advanced by 301 seconds over the 300-second
  check-in interval; this proves the policy decision path, not automatic host
  scheduling enforcement.
- Next safe action: mark the root task completed, run final scope and closure
  checks, and commit only the root policy integration files.

### Next Action

Commit the completed Increment 6 root integration only. Do not begin a later
increment.

## Historical Increment 5 Handoff

## Current Task

Fix the documented OpenCode mediation path so `as-is` is the user-facing
primary, `orchestrator` is a nested subagent, and `implementer` remains a
non-delegating subagent. Validate the fixed path with one harmless child
component through durable delegation and completion evidence.

## Purpose

Keep the repository's structure, durable specifications, and component task
records understandable as the system evolves and expands through delegation.

Permanent implementation references:

- [Orchestration Design](orchestration-design.md)
- [Component Task-Record Protocol](component-task-record-protocol.md)
- [Host-Neutral Execution Contract](execution-contract.md)

## Acceptance Criteria

- A fresh `opencode agent list` reports `as-is (primary)`,
  `orchestrator (subagent)`, and `implementer (subagent)`; `general` may remain
  available but is not used for durable delegation.
- `as-is` explicitly requests `orchestrator`, `orchestrator` explicitly
  requests `implementer`, and wrong or unavailable roles become durable
  blockers rather than silent fallback.
- `opencode-adapter.md` contains the OpenCode-specific role modes, exact
  launch/mediation chain, fallback rejection, fresh-process discovery, session
  graph and cost attribution, and monotonic timing limitations. The
  host-neutral execution contract remains host-neutral.
- A fresh harmless model-backed run visibly follows
  `as-is -> orchestrator -> implementer`, creates or updates a bounded child
  record, reaches a durable worker checkpoint and completion, closes terminal
  descendants, and cleans private runtime state only after evidence is saved.
- The new task remains within the user-approved USD 0.50 allocation. Cost is
  recorded only from OpenCode model/token-derived session data, never provider
  billing; process wall-clock is measured with a monotonic timer and its
  enforcement limitations are recorded.

## Progress

- New bounded mediation-fix task opened under current-turn user authorization.
  The effective root unit budget is USD 0.50; the prior USD 0.20 Increment 5
  configuration and its observations remain historical evidence below and in
  `increment-5-cost-observability/as-is.md`.
- This is cross-cutting root integration across `.agents/agents/`, the OpenCode
  adapter document, and root task context. No existing terminal child record is
  reused or rewritten. A new `opencode-mediation-dogfood/as-is.md` record was
  created atomically in `ready` state for the configured `implementer` before
  delegation.
- The blocked `increment-5-cost-observability` follow-up is preserved as a
  terminal historical blocker and will not be retried by this task.
- Updated role definitions and adapter guidance are scoped to the requested
  mediation fix. The implementer did not change any parent, sibling, historical,
  or host-neutral contract file.
- Fresh mediated validation completed with the child handoff committed as
  `2e9d4fd`; its parent-side measurement reconciliation is scoped in
  `c4f0181`.

## Decisions

- The current-turn user approval is the explicit authority for the fresh USD
  0.50 allocation; the smallest project configuration change is raising only
  `config.tasks.unitBudget.costUsd` from 0.20 to 0.50 for this task and setting
  the project default role to the user-facing `as-is`.
- The nearest common ancestor for role definitions, adapter guidance, and root
  task integration is the repository root. The harmless validation fixture is a
  separate child component so its worker has a component-only boundary.
- No OpenCode permission-pattern narrowing is added until the installed syntax
  proves it necessary. The role mode, explicit target instructions, and durable
  wrong-role blocker are the minimal supported mediation controls.

## Validation

- Fresh `opencode agent list` discovery reported exactly `as-is (primary)`,
  `orchestrator (subagent)`, and `implementer (subagent)`; `general` remains
  available but was not used. A JSON assertion also confirmed
  `.opencode/opencode.json` retains `default_agent: as-is`.
- `git diff --check` passed for the changed role definitions, root record, and
  adapter guidance. The installed OpenCode syntax accepted the existing broad
  `task: allow` permissions; no unsupported permission-pattern syntax was
  introduced.
- The fresh process command was `opencode run --format json --agent as-is
  --model openrouter/mini --dir <project> <bounded-request>` and returned exit
  status 0 after `50.502114668` seconds from a parent monotonic timer.
- Machine-readable events captured the top-level `as-is` session and a task
  event with `subagent_type: orchestrator`. The OpenCode session database and
  exports showed the parent-linked graph `as-is -> orchestrator ->
  implementer`, all using model `openrouter/mini`; no `general` or `explore`
  session occurred in the fresh attempt.
- OpenCode session costs were `0.00983415` (`as-is`), `0.025938`
  (`orchestrator`), and `0.01680675` (`implementer`), totaling `0.0525789`
  USD. The worker-subtree attribution boundary is the implementer session
  (`0.01680675`); orchestration overhead is the as-is plus orchestrator
  sessions (`0.03577215`). The task budget boundary uses the full invocation
  total so overhead is not omitted. These are model/token-derived OpenCode
  charges, not provider billing.
- The new child record is `completed`, has no descendants, records its active
  checkpoint and validation, and retains the scoped worker handoff. Its
  component-local README and record checks passed; the child commits are
  `2e9d4fd` and the measurement reconciliation `c4f0181`.
- Machine-readable events, session IDs/parent IDs, role names, model/token
  costs, and monotonic timing were captured before cleanup. The three private
  validation sessions and all temporary event/export/timing captures were
  deleted after this evidence was written.

## Result

- The mediation fix is implemented and the supported chain completed the
  harmless child handoff. Root acceptance conditions are satisfied; the
  scoped root integration handoff is ready to commit.

## Blockers And Escalations

- None. The historical cost-observability blocker remains closed in its own
  terminal record and was not retried by this task.

## Recovery

- Last durable checkpoint: role topology and adapter fix validated; child
  worker completed; session graph, model/token cost, and monotonic timing
  evidence written into the root and child records; private runtime state
  cleaned.
- Incomplete work: none; the child is terminal and has no descendants.
- Cleanup completed: only the three private validation sessions and their
  temporary event/export/timing captures were removed; repository artifacts and
  durable records were retained.
- Next safe action: commit only the root integration artifacts and this record.

## Next Action

Commit the completed root integration handoff with only the declared role,
adapter, configuration, and root-record changes.

## Historical Increment 5 Progress

- Increment 2 is complete and committed in `c19f45b` and `882f02d`.
- Increment 3 is complete and committed in `ed952de`.
- The root configuration now records Bun as the runtime and package-manager
  preference. This is a preference, not a constraint or an authorization to add
  dependencies without a component need.
- The root orchestrator will delegate the bounded primary-agent definition under
  `.agents` before integrating the root configuration and guidance changes.
- The configured implementer completed the `.agents` child handoff in
  `ddd9227` (`feat(agents): add as-is primary agent`).
- Increment 4 is handled at the root because its acceptance conditions span the
  orchestrator lifecycle and component task-record protocol. No child
  component owns this cross-cutting contract, so no child record or delegation
  is required.
- Added the minimal effective configuration surface: `config.scheduling.checkInSeconds`
  and `config.notifications.materialEvents`. The design records why these are
  needed and keeps enforcement for later increments.
- Increment 5 is handled at the root because adapter selection and lifecycle
  mapping are cross-cutting. The harmless validation task is delegated to the
  new `increment-5-dogfood` child because its README and task handoff have a
  distinct component boundary.
- The selected adapter is the documented bounded `opencode run` fallback. A
  host-managed child is not selected because this CLI does not expose reliable
  lifecycle cancellation and per-component usage observations.

## Historical Design Decisions

- Constraint declarations are introduced now in the task protocol. Increment 2
  adds deterministic static validation; Increment 4 defines host-neutral runtime
  enforcement; and a selected host adapter implements that enforcement in
  Increment 5.
- `task.updated` remains necessary: a wall-clock budget controls cumulative
  runtime, while a timestamp orders durable checkpoints and supports stale-work
  recovery. Neither substitutes for validation evidence.
- Component directory scope is the default writable boundary. External reads are
  named only as exceptions in the bounded requirement, avoiding duplicate file,
  input, and universal-context declarations.
- `maintaining-components` is an operational skill, not a generic script layer.
  It composes focused skills and validation within a bounded component task.
- Deterministic static validation belongs in the local
  `schemas/task-record-validator` component. It checks record structure and
  tree invariants but does not claim host runtime enforcement.
- Technology preferences guide foundation choices only. A component follows an
  applicable higher-authority requirement and established local pattern first;
  a material departure from a preference is recorded with its reason.
- Check-in timing is a durable observation schedule, not a worker execution
  budget. `task.updated` plus the configured interval derives the next due time.
- Material events are reported from durable transitions and state fields rather
  than a new private event log, preserving recovery through task records alone.
- Query responses expose only root and component task records. Unavailable host
  measurements remain unavailable and are never represented as zero or as an
  estimate.
- User direction, approval, and cancellation are orchestrator-routed controls;
  queries are read-only and controls cannot weaken higher-authority constraints.
- The lifecycle contract is normalized around the component record and keeps
  host handles, sessions, processes, transports, scheduling, retry policy, and
  measurement implementation outside the core. Launch, resume, observe,
  question, cancel, and recover return durable observations; runtime state is
  supplementary and non-authoritative.

## Historical Blockers

- Per-component actual cost is not available from the current OpenCode adapter;
  task records retain the fallback metric and do not present estimates as actual
  cost.
- Actual component cost and host-observed wall-clock use remain unavailable from
  the current OpenCode adapter.
- No Increment 5 blocker. Per-component actual cost and host-observed wall-clock
  use remain unavailable from this OpenCode adapter; records retain the
  unavailable source and do not present estimates as actual measurements.

## Historical Validation

- Child observation: a fresh `opencode agent list` process discovered `as-is`
  as a primary agent with task delegation allowed and web access denied; its
  component-local whitespace and descendant-closure checks passed.
- Integration observation: the `.agents` child record is `completed`, has no
  descendants, and its scoped handoff is committed in `ddd9227`.
- Integration observation: a fresh `opencode agent list` process recognized
  `as-is` as a primary agent after the configuration change; a JSON assertion
  confirmed `.opencode/opencode.json` retains its schema and sets
  `default_agent` to `as-is`.
- Residual risk: existing interactive OpenCode sessions retain their startup
  configuration and must be restarted before they select the new default.
- Structural review: the Increment 3 contract was checked against the existing
  task-record fields and orchestration sequence. It uses `task.updated`, status,
  budget, blockers, approval, result, and next-action state rather than adding a
  runtime artifact or host-specific rule.
- Scope review: no component records were created or changed; no descendant
  work was needed. `git diff --check` passed for the documentation changes.
- Residual risk from Increment 3: no generic runtime scheduler was introduced;
  the selected host notification observation is recorded below, while generic
  scheduling remains outside this increment.
- Increment 4 contract review: `execution-contract.md` defines all six
  lifecycle actions, component-record-only worker context, durable state and
  revision rules, source-labelled observations, question/approval handling,
  cancellation, and recovery handoff without host-specific policy.
- Static documentation check: `git diff --check` passed for the changed
  specifications and root record.
- Residual risk before this increment: no host adapter or runtime execution
  path had exercised the contract; the bounded OpenCode dogfood below closes
  that gap, while host cost attribution remains unavailable.
- Increment 5 adapter mapping review: `opencode-adapter.md` maps all six
  lifecycle operations to bounded CLI invocations and durable record reads,
  preserving component-only worker context and deferring stale-task and
  replacement policy.
- Dogfood delegation notification/check-in: created
  `increment-5-dogfood/as-is.md` atomically in `ready`, emitted delegation from
  the durable parent transition, and observed the child worker checkpoint and
  completion through its record.
- Dogfood budget handling: child allocation was USD 0.10 with USD 0.02 reserve
  and 120 seconds with 30 seconds reserve, within the configured unit budget;
  cost and elapsed wall-clock observations remained unavailable from the host
  and were not represented as actual use.
- Dogfood completion: the child added only its local README, passed focused
  content validation and `git diff --check`, reached terminal `completed`, and
  had no descendants requiring closure accounting.
- Dogfood cleanup: the two private OpenCode session records created for the
  parent/child run were deleted after durable handoff; no project runtime
  artifact was retained. The durable child record and README remain.
- Validation limitation: the repository-wide Increment 2 validator is not a
  valid check for this mixed historical tree because it interprets host agent
  definitions and version-1 records as task records. The new child record was
  checked locally instead; no validator behavior was changed.

## Historical Result

- Increment 5 is complete: the selected OpenCode fallback maps the host-neutral
  lifecycle contract and successfully exercised a harmless delegated child
  task with durable notification/check-in, budget evidence, completion, and
  cleanup. Increment 4's host-neutral lifecycle contract remains defined in
  `execution-contract.md` and linked from `orchestration-design.md`, while
  Increment 3's check-in and control semantics remain host-independent.
- Delegated task: `increment-5-dogfood`, record
  `increment-5-dogfood/as-is.md`, configured worker `implementer`, terminal
  `completed`, no descendants.

## Historical Recovery

- Last durable checkpoint: Increment 5 child completion was reread, runtime
  sessions were cleaned, and adapter mapping was integrated.
- Incomplete work: none for Increment 5. Stale-task recovery, retry/backoff, and
  worker replacement remain intentionally deferred to Increment 6.
- Cleanup required: none; private sessions were deleted and durable outcomes
  remain in the records.
- Next safe action: commit this scoped root handoff and the child handoff; do
  not begin Increment 6 in this task.

## Historical Next Action

Increment 5 is complete and ready for scoped handoff commits. No Increment 5
recovery action remains; Increment 6 is not part of this task.
