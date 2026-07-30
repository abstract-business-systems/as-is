# Independent Delegation

## Purpose

This permanent specification defines the host-neutral delegation model for
`as-is`: work is delegated by launching an independent agent process that does
not return a result to its parent, and status is observed by polling durable
records and session logs. It supersedes the synchronous launch/observe/return
framing in [execution-contract.md](../execution-contract.md); the authority,
context, and recovery rules of that contract remain in force unless this spec
states otherwise. It also establishes the recursive `component-builder` role
that merges the prior `orchestrator` and `implementer` roles.

## Model

- A delegation launches an independent agent process and returns immediately
  with a handle. The parent does not block on the child's completion.
- There is no talk-back channel: a child does not return a result to its parent
  through the launch call. The child's durable `as-is.md` record is the result
  and handoff.
- Any agent observes a child by polling its durable record (structured status)
  and session log (detail). The parent, `as-is`, a sibling, or a supervisor may
  all poll the same surfaces; observation is not a capability reserved to the
  launching parent.
- A builder may delegate sub-work to specialized agents or to new instances of
  itself for child components. Nesting does not stack wall-clock, because no
  parent blocks on a child. Siblings run truly concurrently.
- Budget and completion are enforced by a per-child supervisor and inferred
  from record status plus process liveness, not from a return value.

This model directly removes the structural causes of long opaque nested runs:
blocking nesting (wall-clock stacked additively across tiers) and blind
delegation (a parent could not observe a child it was blocking on). Both are
eliminated by making delegation non-blocking and observation shared.

## Roles

- **`as-is` (primary).** User-facing entry point. Clarifies intent, routes
  bounded work to `component-builder`, and observes active children to present
  status to the user. Does not build component results itself.
- **`component-builder` (recursive).** Builds its assigned component's result,
  manages its own component `as-is.md` (creates it on delegation, advances
  status, records evidence, host-reported cost, and host-observed wall-clock),
  and delegates sub-work to specialized agents or to new instances of itself
  for child components. Replaces the asymmetric `orchestrator` + `implementer`
  pair: the prior `orchestrator` could only delegate and the prior
  `implementer` could only build and could not delegate.

The forced two-level fan-out `as-is -> orchestrator -> implementer` is replaced
by `as-is -> component-builder -> component-builder -> …`, nesting only when
there are actual children. A leaf component with no children runs a single
builder instance; the extra mediation tier is not spawned.

## Launch Contract

- Fire-and-forget: the launcher spawns the child as an independent process and
  returns a handle in seconds, not the child's stdout.
- A handle identifies the observable surfaces of one child:
  - a process identifier (PID), for liveness;
  - the session log path, for detailed observability;
  - the component record path, for authoritative structured status; and
  - a job id, as an operational alias.
- No stdout pipe returns to the parent. The child writes its result to its
  component record, per the existing record-as-handoff rule.
- The child receives its component record plus centrally supplied read-only
  context (repository instructions, design principles, permitted skills), as in
  [execution-contract.md](../execution-contract.md). The authority and
  context-normalization rules are unchanged.
- A host adapter maps this contract to its process/spawn API; the contract
  itself is host-neutral. The Pi adapter realizes it through the
  [spawning-pi-subagents](../skills/spawning-pi-subagents/SKILL.md) launcher with a
  detached child and process-group kill.

## Observation Surfaces

Three surfaces, in descending authority:

1. **Component `as-is.md` record** — authoritative structured status
   (`task.status`, progress, validation, result, cost, wall-clock, next
   action). This is the status surface an agent reads to answer "what state is
   this work in?"
2. **Session log** — detailed observability (event stream, tool calls,
   reasoning). This is the detail surface for live monitoring and debugging.
   It may be large; poll with offset or tail, never whole-read.
3. **Handle registry** — the set of active child handles (PID, log path,
   record path, job id), so an agent can discover children it did not launch.

`as-is` composes these into a user-facing status view: it reads the handle
registry to find active children, reads each record for status, and may tail a
session log for live detail. A parent builder does the same for the children it
launched; a supervisor does the same for the children it supervises.

## Completion And Failure Inference

- **Completion** is inferred from the record: `task.status` is terminal
  (`completed`, `failed`, or `cancelled`). Never infer completion from process
  exit alone — a killed child can leave no terminal status, and a process may
  linger after a terminal record is written. The record is authoritative.
- **Failure** is inferred from the combination: the process is not alive *and*
  the record status is non-terminal. This means the child stopped without
  handing off; it is a recovery candidate. This inverse rule is required by the
  independent model: with no return value, a dead process plus a non-terminal
  record is the only signal that work was lost.
- A supervisor reconciles a dead-PID-plus-non-terminal record through the
  recovery mechanics in
  [component-task-record-protocol.md](../component-task-record-protocol.md): it
  records the attempt, reason, and observation, and schedules recovery per the
  configured backoff.
- A terminal record with a live process is not contradictory; the record wins.
  A non-terminal record with a live process means the child is still working.

## Budget

- A per-child detached supervisor holds the wall-clock timer and kills the
  child (process group) on expiry. The parent is not the budget holder: it may
  have moved on to other work, and holding the budget in the parent would
  reintroduce a blocking dependency.
- On a budget stop, the supervisor kills the child and recovery reconciles the
  non-terminal record. This generalizes the committed budget-stopped marker
  pattern (a `124` exit with the `as-is budget-stopped` stderr marker) from a
  parent's bash-timeout backstop to a detached per-child supervisor.
- Cost is forwarded to the child for self-limiting, as in the committed
  `--budget-cost-usd` forwarding. A hard cost stop remains a residual risk: Pi
  cost is not directly observable from the launcher, so cost is enforced by the
  child's self-limiting, not by the supervisor. See the canonical `Changelog` section for the
  recorded residual risk.

## Relationship To Existing Specifications

- **Supersedes** the synchronous launch/observe/return framing in
  [execution-contract.md](../execution-contract.md). The launch returns a handle,
  not a result; observe is polling, not blocking. The authority, context,
  permission, and recovery rules of that contract remain in force.
- **Merges roles**: `orchestrator` + `implementer` become `component-builder`.
  `.agents/agents/orchestrator.md` and `.agents/agents/implementer.md` are
  removed; `.agents/agents/component-builder/agent.md` is added. References in
  `.agents/agents/as-is/agent.md`, [docs/configuration.md](../docs/configuration.md),
  `control-plane/control-plane.ts`, and the
  [spawning-pi-subagents](../skills/spawning-pi-subagents/SKILL.md) skill are
  updated accordingly.
- **Control-plane identifiers**: `parent-orchestrator` becomes
  `parent-builder` and the default worker `implementer` becomes
  `component-builder` in `control-plane/control-plane.ts`. The hard
  `delegatedBy !== "parent-orchestrator"` check and the default must change
  together or the delegation path throws.
- **Chain references** in [orchestration-design.md](orchestration-design.md)
  and [execution-accounting-design.md](execution-accounting-design.md) of the
  form `as-is -> orchestrator -> implementer` become
  `as-is -> component-builder -> …`.
- This spec is the design authority. Implementation is staged: launcher and
  `component-builder` first, then terminological updates to the affected specs.

## Resolved Or Effectively Answered

The model above is decided. The following questions are no longer open in the
current repository state; they are retained here as status, not as live
implementation directives.

1. **Handle registry location.** Effectively answered by the committed
   `spawning-pi-subagents` detached-handle registry, which records handles in a
   file-backed registry via `AS_IS_JOBS_REGISTRY` (default
   `/tmp/as-is-jobs.jsonl`). The earlier question was where active handles would
   live at all; the current implementation answers that operationally. If the
   repository later adopts the control-plane job table as the authoritative
   registry, that would be a new design decision.
3. **Status stream.** Effectively answered for the current launcher by
   `record + session log` observation only. The launcher and skill document
   those two surfaces; no slim status stream is currently implemented. The
   recommendation to defer a slim stream remains valid as a future optimization,
   not as an open requirement.
4. **Implementation sequencing.** Historically answered by the work that first
   captured this spec and then implemented the launcher and `component-builder`
   together before later spec updates. It is no longer a live decision for the
   current repository state.

## Resolved Budget-Holder Decision

The per-child detached supervisor is authoritative for wall-clock budget
ownership. The launcher/supervisor starts the timer, owns process-group
termination at expiry, records the budget-stop observation, and leaves the
parent free to observe and reconcile the child's durable record. Neither
`as-is` nor a scheduler polling from the parent owns enforcement, because the
parent may have moved on or exited. Cost limits remain forwarded to the child
for self-limiting because provider cost is not directly observable by the
launcher; an unavailable cost observation remains explicitly unavailable.

This decision closes the prior budget-holder open question. Any future change
requires a new bounded design decision and must preserve non-blocking
independent delegation.
