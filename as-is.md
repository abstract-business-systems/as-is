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
  updated: 2026-07-26T16:09:27Z
---

# as-is Project

## Current Task

Refactor the repository's current task records and configuration context so
repository root and component `as-is.md` files remain the sole authoritative
task state. This is documentation and durable-context work only: no workers,
external services, runtime changes, concurrency increase, or prior-commit
amendment is authorized.

## Purpose

Keep current recovery context concise and discoverable while retaining the
durable decisions, important exceptions, terminal child closure, and audit
references needed to recover the project. Permanent protocols and rationale
remain in their subject-named specifications.

## Acceptance Criteria

- Root and component `as-is.md` records remain the sole current task authority;
  optional XDG `tasks/` metadata is clearly private, future, and non-authoritative.
- Terminal records retain identity, status, worker, result, validation, blockers,
  recovery/next action, and useful commit references; the blocked cost record
  remains a concise no-retry exception.
- The root has current status, pending work, and a compact change log without
  duplicated prior dossiers or transient execution detail.
- The current `maxConcurrentTasks` remains `1`; future control-plane and
  concurrency-3 work stays pending rather than being implemented here.
- The changed records retain the wrong-role/general fallback blocker, the
  successful `as-is -> orchestrator -> implementer` validation summary, the
  Increment 6 recovery policy summary, and unavailable cost/wall-clock limits.

## Progress

- Reviewed repository instructions, current context, permanent specifications,
  all component records, recovery/audit value, and recent commit history.
- Condensed current context and terminal records in place. No task record was
  removed; detailed prior recovery remains available through Git history
  and the permanent specifications.
- Root budgets, `maxConcurrentTasks: 1`, `.agents/agents/*`, OpenCode
  configuration, runtime behavior, and existing commits remain unchanged.
- No model-backed worker, external service, private runtime artifact, or child
  task was launched for this refactor.

## Decisions

- Repository root and component `as-is.md` records are the sole authoritative
  current task state. An optional XDG `tasks/` area may hold private,
  discardable runtime indexes or references only; it is not an active backlog,
  mirrored authority, approval store, history, or completion evidence.
- Private per-run state remains disposable and non-authoritative guidance in the
  execution contract. Recovery starts from the durable record and immutable run
  input, not from transient host state.
- Terminal component records keep concise handoff evidence; Git history carries
  detailed prior reconstruction. Permanent contracts remain unchanged.
- The current concurrency setting remains `1`. Future control-plane status and
  parallel delegation must be validated before a separate concurrency-3 task.

## Blockers And Escalations

- The prior `increment-5-cost-observability` task remains blocked: direct
  top-level `implementer` fallback selected `as-is`, and the approved mediated
  attempt routed `general`, timed out, and produced no configured-worker
  checkpoint. This is a delegation blocker and a no-retry boundary, not a
  replacement or completion.
- No blocker remains for this documentation refactor. Actual cost and
  host-observed wall-clock are unavailable because this is repository-only work.

## Validation

- Structural check passed for the root and seven component task records using
  their established v1/v2 front-matter and body conventions; the unchanged
  `.agents/agents/as-is.md` host definition was correctly excluded. No task
  record was removed or left unaccounted for.
- Content assertions passed for current task, pending work, change log,
  authority boundaries, retained exceptions, and commit references. The root
  contains no removed historical section heading or transient trace pattern.
- `configuration.md` assertions passed for the optional/private XDG metadata
  distinction, non-authoritative `tasks/` area, and disposable temporary path.
- Root configuration still reports `maxConcurrentTasks: 1` and unchanged
  budgets. `git diff --check` passed; no runtime or host behavior was exercised.
- Actual cost and host-observed wall-clock are unavailable because this is
  repository-only documentation work; no estimate is claimed.

## Result

The root context and terminal component records now provide concise current
handoffs instead of duplicated prior execution dossiers. Authority remains
with repository records; optional runtime metadata is explicitly subordinate;
the blocked exception, successful mediation evidence, Increment 6 policy, and
current concurrency boundary remain discoverable.

## Recovery

- Last durable checkpoint: current records were condensed after recovery/audit
  review; no record was deleted and no private runtime state was created.
- Detailed prior evidence is recoverable from Git history, including the
  prior root integration `5ad7af8`, recovery policy `7c28607`, fixture handoff
  `be93087`, mediation handoff `c4f0181`, and blocked fixture commit `e9b740b`.
- Incomplete work: future control-plane interaction and concurrency-3 runtime
  support remain intentionally unimplemented.
- Next safe action: use the pending-work list for a separately authorized task;
  no recovery from transient host state is required.

## Next Action

No further change is authorized in this scope. Commit this validated root
handoff with only the intended documentation and durable-context files.

## Pending Work

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

## Change Log

- `2026-07-26 | completed` - Current record-authority and control-boundary
  decisions integrated; prior root handoff `5ad7af8`.
- `2026-07-26 | completed` - Increment 6 recovery policy and record-only
  interrupted-child fixture validated; policy `7c28607`, fixture `be93087`.
- `2026-07-26 | completed` - OpenCode mediation validated through
  `as-is -> orchestrator -> implementer`; child `2e9d4fd`, reconciliation
  `c4f0181`, role repair `71213a9`. Full invocation observation was
  `0.0525789` model/token-derived USD and `50.502114668` monotonic seconds;
  these are not provider billing or automatic budget enforcement.
- `2026-07-26 | blocked` - Increment 5 cost-observability fixture retained as
  the wrong-role/general fallback exception; README handoff `e9b740b` and no
  retry without new approval.
- Earlier closed work remains referenced by its scoped commits: Increment 2
  `c19f45b`, `882f02d`; Increment 3 `ed952de`; primary-agent component
  `ddd9227`; OpenCode dogfood `0dc44ad`. Git history retains detailed traces.
