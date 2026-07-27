# Durable Control Plane

[`control-plane/control-plane.ts`](control-plane/control-plane.ts) is the
supported Bun/TypeScript ownership boundary for the current control-plane
foundation. It reads and updates only repository-backed root and component
`as-is.md` task records; it does not inspect host sessions, private runtime
state, process handles, caches, logs, or external services.

The module is dependency-free and can be used as a Bun CLI from the repository
root:

```sh
bun control-plane/control-plane.ts status .
bun control-plane/control-plane.ts general-question . "What is the current status?"
bun control-plane/control-plane.ts can-complete . .
```

The focused deterministic test and build checks are:

```sh
bun test control-plane/control-plane.test.ts
bun build control-plane/control-plane.ts --target bun --outfile /dev/null
```

The exported `ControlPlane` class is the programmatic boundary; the CLI command
names map to its operations without adding host lifecycle or runtime state.

## Operations

- `ControlPlane.status()` projects active and delegated records, status,
  configured worker, allocated budget, source-labelled observed cost and
  wall-clock use, blockers, recorded decisions, and the next check-in. An
  unavailable observation is returned as `observed: null` with its source and
  fallback metric, never as zero or an estimate.
- `ControlPlane.generalQuestion()` is a read-only record query. It does not
  steer a worker, persist a private prompt, or change a task. A question that
  cannot be answered from durable records receives an explicit no-record-backed-
  answer response.
- `recordQuestion()` writes a question before moving a task to `blocked` or
  `awaiting-approval`. `answerQuestion()` writes an answer or direction before
  returning a task to `active`. `requestApproval()` and `approve()` use the
  same durable ordering for approval requirements and approvals.
- `cancel()` writes the user-authorized reason and checkpoint before the
  `cancelled` transition. It does not send a host stop signal or delete partial
  work; a host may act only after observing the durable cancellation.
- `delegate()` accepts only a `parent-orchestrator` request, validates an
  independent child scope and child allocation against the parent's remaining
  budget, creates a durable child record atomically, and records the parent
  observation. The child remains `ready`/queued. `activate()` enforces the
  configured leaf slot limit, and `canComplete()`/`complete()` enforce terminal
  descendant closure and failed/cancelled accounting.

Answers and approvals accept only a small structured constraint proposal. An
answer that relaxes the effective external-effect policy or raises the root
`config.scheduling.maxConcurrentTasks` is rejected. Unknown proposal fields are
also rejected rather than interpreted as an override.

## Concurrency and host boundary

The current root configuration remains `config.scheduling.maxConcurrentTasks: 1`.
Parent delegation can represent multiple independent queued child records, but
this foundation does not run three leaf workers or raise the configured limit.
Only `activate()` can make a leaf `active`, and it rejects an additional active
leaf when the slot is occupied.

The OpenCode live-control boundary remains documented in
[`opencode-adapter.md`](opencode-adapter.md) and is intentionally unimplemented
here. The bounded OpenCode CLI is not claimed to provide live status, question,
cancellation, or parallel-control support. A future host adapter may map the
contract to host primitives without replacing durable record authority.

## Durable event format

Operations append machine-readable `control-plane` JSON lines under an optional
`## Control Plane` section. These lines are durable task context, not a second
event log or runtime state. The task record's front matter remains authoritative
for status and checkpoint ordering; body events preserve questions, answers,
approvals, cancellation reasons, delegation observations, and completion
evidence needed for recovery.

The command-line entry point exposes the read-only `status`,
`general-question`, and `can-complete` queries plus durable `question`,
`answer`, `approve`, `cancel`, `activate`, `complete`, and `delegate` actions.
Host lifecycle wiring, process/session selection, scheduling wakeups, usage
attribution, and live OpenCode control remain outside this initiative.
