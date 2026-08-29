# Process-adapter ownership boundary — decision brief

## Purpose

Present the next bounded ownership decision required by the accepted coding/application flow plan before any process-adapter task is prepared. This brief is a decision surface, not a task, implementation packet, target-contract adoption, or authorization.

## Current evidence

`core/adapters/process/as-is.md` assigns the process adapter responsibility for detached process launch, lifecycle, observation, permission, cancellation, recovery, stale classification, budget observation, and handoff evidence while retaining task-record authority in `core/modules/task-control/`. It explicitly states that the Pi launcher consumes the mechanical process boundary without transferring Git, worktree, or handoff authority into the adapter.

The accepted coding/application plan proposes a conditional mechanical child-result application boundary. It must preflight scope, protected inputs, expected parent base, dirty/conflicting state, locking, recovery, and ancestry. It must not decide semantic child acceptance, task status, or merge. The process-adapter owner must accept or reject that boundary before the affected task is prepared.

## Decision requested

Which bounded ownership disposition should govern the first coding/application candidate task?

### Option A — Accept the bounded mechanical extension

The process-adapter owner accepts a narrowly defined mechanical host boundary for child-result application. The later task must name the exact allowlist, protected inputs, expected base, locking/ancestry checks, abort/recovery behavior, and any exact durable `as-is.md` update. The adapter remains non-semantic and does not own task authority, child acceptance, or merge.

Effect: the process-adapter branch may be prepared later, but still requires separate kick-off, task preparation, exact task-control admission, candidate readiness, deterministic validation, and result review.

### Option B — Reject the extension and preserve the current boundary

The process adapter does not own child-result application. The current parent-side integration behavior remains the baseline, and no replacement owner is invented.

Effect: the process-adapter branch is blocked or excluded. The candidate may proceed only on unaffected control-plane scope if a later task can state acceptance conditions without claiming the blocked integration proof.

### Option C — Defer the decision

No process-adapter task is prepared until an owner decision is available.

Effect: the affected branch remains blocked and the candidate proof cannot claim the conditional integration behavior.

## Sol consultation disposition

A bounded Sol consultation concluded that this ownership decision is not a prerequisite for an unaffected `core/modules/task-control` first slice. It is required only before preparing the conditional process-adapter child-result application task or claiming the complete integration-dependent candidate proof. The consultation recommends deferring the broader capability-placement question, preserving the current process adapter and parent-side integration, and excluding the process-adapter branch and integration-dependent fixture proof from the first slice. The durable consultation is `reviews/agentic-development-system/sol-process-adapter-boundary-advice.md`.

This recommendation does not select a first slice or authorize kick-off; those remain separate decisions.

## Authority and limits

This brief does not choose among the options, modify `core/adapters/process/as-is.md`, create tasks, authorize kick-off, launch workers, authorize implementation, or adopt target contracts. Any accepted extension must be recorded by the accountable owner before task preparation and must remain within the accepted coding/application plan. A material boundary change requires the applicable successor-plan and Human Review process.

`startsWork: false`
