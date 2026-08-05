# Skills–Agents Separation Migration Plan

## Purpose and decision boundary

This is the approved planning artifact for `skills-agents-separation-plan`.
It defines a staged migration from the current mixed control-plane surfaces to
an authority-safe separation of reusable skills, agent composition, and
generalized subagent execution. It authorizes no migration implementation.
Each later phase requires a new bounded task record and its own validation;
`skills-agents-separation-migration` remains deferred until this plan is
explicitly activated.

The fixed authority order is:

1. repository instructions and design principles;
2. root/component `as-is.md` and the configured task-record protocol;
3. agent role contracts (authority, tools, model, permissions);
4. reusable skills (procedures and checks, never role selection or delegation);
5. runtime adapters and private execution state (observations only).

A task record remains the status, approval, budget, recovery, and completion
authority. Runtime handles, sessions, logs, and telemetry cannot authorize a
transition or infer completion.

## Current inventory and contracts

| Surface | Current responsibility | Separation constraint | Primary evidence |
| --- | --- | --- | --- |
| `skills/` | Reusable procedures for task management, validation, delegation, and completion | Skills may describe inputs/outputs and handoffs but must not call, launch, or select agents | `skills/*/SKILL.md`, `AGENTS.md` |
| `agents/as-is/agent.md` | User-facing routing and control-plane policy | Routes through the configured `component-builder`; does not implement component work | `agents/as-is/agent.md` |
| `agents/component-builder/agent.md` | Component-scoped implementation, records, delegation, validation, and handoff | Owns builder authority only within its component; delegates only at child boundaries | `agents/component-builder/agent.md` |
| `agents/expert/agent.md` | Read-only plan and diff validation | Inspection-only; cannot edit, delegate, or commit | `agents/expert/agent.md` |
| `agents/worker/` | Generalized worker capability and durable worker communication | Worker is a role target, not a hidden orchestrator or alternate task authority | `agents/worker/`, `worker/as-is.md` |
| `skills/spawning-pi-subagents/` | Host launcher and bounded process/worktree mechanics | Remains an adapter skill/procedure; role admission and authority stay with agents/orchestrator | `skills/spawning-pi-subagents/SKILL.md` |
| `docs/execution-contract.md` | Host-neutral lifecycle contract | Defines launch/resume/observe/question/cancel/recover without host policy | `docs/execution-contract.md` |
| `docs/component-task-record-protocol.md` | Durable record schema, boundaries, budgets, closure | Sole record contract; no parallel task tree or runtime authority | `docs/component-task-record-protocol.md` |
| `designs/orchestration-design.md` | Settled architecture and sequencing | Source of design invariants; this plan refines migration order only | `designs/orchestration-design.md` |
| `.pi/` and host projections | Adapter-local integration and bundled extensions | Host projection cannot become canonical role source or project authority | `.pi/`, `.agents/` |

### Explicit seams to preserve

- **Reusable procedure vs. authority:** a skill can require that a caller obtain
  review, but only the agent/orchestrator can choose and launch the reviewer.
- **Role composition vs. execution:** an agent defines the permitted bundle and
  role boundary; the launcher maps that role to a host process.
- **Durable state vs. runtime state:** records and Git history survive process
  loss; private runtime state is disposable and source-labelled.
- **Vertical delegation vs. horizontal coordination:** child components are
  delegated downward; cross-component work is performed at the nearest common
  ancestor.
- **Plan vs. implementation:** this artifact is a migration map, not a
  permission to alter behavior.

## Phased migration

### Phase 0 — Baseline, inventory, and contract freeze

**Goal:** establish a machine-checkable baseline before moving ownership.

- Enumerate every tracked agent role, skill, launcher entry point, host
  projection, and reference to role names or delegation.
- Classify each operation as reusable procedure, role policy, orchestration,
  host adapter, or runtime observation; record ambiguous ownership as a
  decision rather than guessing.
- Freeze invariants: task-record authority, component boundary, configured
  worker identity, expert gate, no secrets, no runtime state in the repository,
  and no synchronous process presented as asynchronous.
- Add a phase-specific inventory/checklist to the task record, not a duplicate
  task tree.

**Gate:** inventory has an owner and source path for every discovered surface;
all ambiguities have decisions or blockers; baseline checks pass.

### Phase 1 — Extract root orchestration policy

**Goal:** make the root/as-is orchestrator the sole authority-bearing
composition layer without changing user-visible lifecycle behavior.

- Move routing, task admission, budget subtraction, child admission, recovery,
  user control, and parent integration decisions out of reusable skill prose
  where they are currently mixed with procedure.
- Keep skills such as task implementation, verification, and committing as
  callable procedures with explicit inputs, outputs, stopping conditions, and
  evidence requirements.
- Make the agent contract name the only configured role target; unavailable or
  wrong-role returns remain durable blockers, never substitutions.
- Preserve the current one-task/one-active-attempt constraints and existing
  `as-is.md`/`tasks.md` lifecycle.

**Gate:** focused control-plane tests show the same admissions, blockers,
status transitions, and completion behavior; static scans show no skill
launch/delegation authority; rollback is a revert of the phase commit.

### Phase 2 — Extract component-builder composition

**Goal:** isolate component-scoped building and vertical delegation from
root-level routing and from generic procedure skills.

- Define the builder input as its component `as-is.md`, current task record,
  central read-only context, named dependencies, and effective budget.
- Keep child-boundary detection, atomic child-record creation, child worker
  admission, post-return orientation, nearest-common-ancestor integration, and
  expert-before-commit gates in the builder role.
- Retain reusable techniques (context building, naming, verification,
  maintenance, and committing) as skills with no agent-selection logic.
- Require every delegated child to use the configured `component-builder`
  target unless a durable task explicitly names another authorized role.

**Gate:** a harmless child fixture proves component-only context, vertical
  delegation, descendant closure, and scoped commit integration; failed,
  cancelled, unavailable, and budget-stopped children remain recoverable.

### Phase 3 — Generalize runtime and subagent flows

**Goal:** provide one host-neutral execution path for worker and expert
  interactions while keeping runtime mechanics subordinate to records.

- Align launcher, worker communication, and host adapters to the execution
  contract's normalized lifecycle operations.
- Separate worker request/result transport from role policy; worker results are
  observations and cannot complete tasks by process exit.
- Preserve task revision/attempt identity, cumulative accounting, detached-job
  ownership, cancellation, stale detection, bounded recovery, and private
  runtime cleanup.
- Treat expert calls as serial read-only validation, not implementation-child
  fan-out; reject unavailable expert capability rather than substituting a
  worker.
- Keep host-specific projections and extensions at the adapter boundary.

**Gate:** provider-free fixtures cover launch-before-completion, polling,
  cancellation/recovery, budget stop, role attribution, cleanup, and missing
  runtime state; no runtime artifact is required to resume from the record.

### Phase 4 — Composition and authority validation

**Goal:** prove the separation under invalid as well as valid compositions.

- Validate that skills cannot launch, delegate, mutate authority, or create a
  second task tree, while agents can compose only permitted skills and tools.
- Test lower-authority constraint weakening, cross-component edits, wrong-role
  returns, duplicate active attempts, stale checkpoints, invalid approvals,
  and unaccounted descendants.
- Verify expert plan review precedes edits and fresh expert final validation
  precedes commit for builder tasks.
- Verify all public status and recovery answers derive from durable records and
  distinguish unavailable observations from zero.

**Gate:** deterministic negative tests fail closed with durable blocker text;
positive fixtures pass with provenance and residual-risk evidence.

### Phase 5 — Documentation, projection, and adoption

**Goal:** reconcile all explanatory and host-facing documentation after
behavior and validations are stable.

- Update `agent-skills.md`, `AGENTS.md`, execution/design docs, role contracts,
  launcher guidance, and host projection notes to use one vocabulary and
  canonical paths.
- Link this plan and its resulting implementation records without copying
  task authority into designs or changelogs.
- Mark superseded guidance explicitly and remove only after auditing tracked,
  untracked, ignored, and host-projection consumers.
- Publish a migration checklist for future component tasks and leave the
  deferred migration item open until adoption evidence exists.

**Gate:** reference/path scan is clean, docs agree on authority order and role
names, `git diff --check` passes, and an independent expert confirms no
implementation behavior was changed by documentation-only edits.

## Dependencies and sequencing

Phase 0 is required first. Phase 1 precedes Phase 2 because root admission and
integration authority must be stable before builder composition moves. Phase 2
precedes Phase 3 because the runtime needs an unambiguous role boundary. Phase
4 depends on the behavior of Phases 1–3 and must pass before Phase 5 reconciles
normative documentation. No phase may silently bundle unrelated cleanup.

Each phase is a separate root or component task with declared changed artifacts,
acceptance evidence, cost/wall-clock reserve, and rollback checkpoint. Work
crossing a child component's `as-is.md` boundary must be delegated to a new
component-builder task; shared changes stay at the nearest common ancestor.
Independent documentation checks may run concurrently only after their scopes
and allocations are proven independent.

## Recovery, rollback, and residual risk

Every phase stops at its gate. On interruption, resume from the durable task
record and Git checkpoint; do not infer completion from a process, session, or
missing runtime file. Roll back by reverting the phase's scoped commit, then
re-run the preceding phase's checks. Preserve child commits as recoverable
source evidence and integrate only from the caller worktree. A failed or
cancelled descendant is accounted for before any ancestor completes.

Residual risk after this planning task is implementation drift: the inventory
is source-based and does not prove that future host projections or untracked
consumer scripts are exhaustive. Phase 0 must refresh the inventory before
behavior changes. This plan also does not establish provider availability,
performance thresholds, or authorization to implement migration behavior.

## Acceptance checklist for activating migration

- [ ] This plan is linked from the selected root backlog item and remains
  planning-only until explicit activation.
- [ ] Phase 0 inventory and authority decisions are recorded in a current task
  record.
- [ ] Every phase has a scoped task, dependencies, gate, rollback, and recovery
  checkpoint.
- [ ] Required positive and negative validation evidence is named before each
  phase begins.
- [ ] Expert plan and final validation are serial and read-only; a failed or
  unavailable expert blocks completion.
- [ ] No phase changes the task-record authority, weakens higher-level policy,
  or treats runtime state as durable authority.
