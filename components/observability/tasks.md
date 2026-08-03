---
as-is-version: 2
task:
  status: failed
  worker: component-builder
  updated: 2026-08-06T03:10:00Z
  task-revision: session-reference-observability-1
  attempt: 1
constraints:
  cost:
    currency: USD
    allocated: 0.45
    spent: 0.00
    reserve: 0.08
    source: unavailable
    fallback-metric: host-observed elapsed-seconds only; not monetary cost
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 360
      spent-seconds: 0.00
      reserve-seconds: 60
      source: fresh user-authorized bounded phase
  external-effects: require-current-turn-user-approval
acceptance:
  - Define session-reference-first observability as the default for conversational and tool detail.
  - Specify the trace fields needed to correlate a bounded execution to its Pi session without recording raw prompts, responses, tool arguments, or tool results by default.
  - Define session scope, revision/event-range, retention, access, missing-session, and export behavior.
  - Update the observability backlog and tracing design/component context only within components/observability/.
  - Add deterministic content-level validation for the policy; do not add live provider calls or broad runtime capture.
  - Preserve telemetry's supplementary status and existing local-full/export-bounded policy boundaries.
  - Obtain expert plan and final validation, record evidence, and create a scoped commit.
---
# Session-reference observability policy

## Requirement
Adopt a session-reference-first observability design: traces record stable correlation metadata such as a Pi session identifier, role, job/delegation identity, session revision or event range, and bounded counts/timing; authorized investigators may resolve the session separately for full conversational/tool detail. Raw prompts, responses, tool arguments, and tool results remain excluded from normal traces and are not newly wired into runtime capture by this task.

## Scope
Only `components/observability/`. Update `tracing-design.md`, `backlog.md`, `as-is.md`, `changelog.md`, and add focused deterministic policy validation if needed. Do not modify launcher, Pi extensions, session storage, setup, role sources, product components, or external services.

## Plan
Review the current all-in tracing model and tracer capture policy. Add a normative session-reference section and refine successor backlog items so correlation metadata is distinguished from raw session content. Validate required fields, privacy boundaries, and prohibition of default raw capture with a repeatable local check. No implementation source change is required unless needed to represent the policy without adding runtime capture.

## Validation
The component-builder launch did not produce a usable result or implementation worktree. No observability files were changed. The required expert plan review, implementation validation, and final expert validation did not occur.

## Result
Failed attempt 1 before implementation. No scoped commit was produced and no policy claims are complete.

## Blockers And Escalations
The delegated process terminated during launcher recovery/inspection without returning an attributable component-builder result. Do not retry this revision or infer completion from the launcher exit. A new authorized task revision is required before another attempt.

## Recovery
No child worktree or uncommitted component changes were found after the failed launch. The authorization commit `f6e4e13` and this record preserve the intended bounded policy scope.

## Next Action
Create a fresh explicitly authorized recovery revision before launching component-builder again.
