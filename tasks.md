---
as-is-version: 2
task:
  status: ready
  worker: component-builder
  updated: 2026-08-06T04:45:00Z
  task-revision: session-reference-runtime-producer-1
  attempt: 0
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
      source: fresh bounded user authorization
  external-effects: require-current-turn-user-approval
acceptance:
  - Runtime producer emits only the current Pi session reference into worker-tools trace events.
  - Session reference uses the observability contract and contains no raw prompt, response, tool content, absolute path, or URL.
  - Parent session ID is correlated on call_subagent and worker.result events; child session correlation is added only when the supported API exposes it safely.
  - Existing trace query behavior, worker behavior, role authorization, and telemetry failure isolation remain unchanged.
  - Changes are limited to `.pi/extensions/worker-tools.ts` and root handoff records; do not modify observability schema, launcher, setup, roles, session storage, or product components.
  - Native host validation is attempted where dependencies are available; unavailable standalone extension dependencies are recorded as residual risk.
  - Expert plan and final direct-file validation pass before a scoped commit.
---
# Session-reference runtime producer

## Requirement
Wire the already-approved session-reference schema into the `.pi` worker-tools runtime producer. Add the current Pi session ID as a typed, scoped `SessionReference` on the existing `call_subagent` and `worker.result` trace events. Do not inspect or resolve sessions, read session JSONL, capture raw conversational/tool content, or change worker execution semantics.

## Scope
Root-owned runtime integration limited to `.pi/extensions/worker-tools.ts` and this root task/handoff. The observability schema in `components/observability/` is already integrated and must not be modified. No external services.

## Plan
Inspect the existing `ctx.sessionManager.getSessionId()` producer and tracer contract. Import or use the typed session-reference contract without duplicating its validation authority. Construct only a `project-local` reference with `availability: available` and the opaque session ID; omit the reference when no valid ID is exposed. Attach it to start and result/failure events without changing attributes or raw payload behavior. Validate syntax/type/build in the native host environment if possible and perform direct-file expert review.

## Validation
Not started.

## Result
Not available.

## Blockers And Escalations
Stop if the extension API cannot safely expose the session ID, if integration requires session-store access or raw content, or if host-only dependencies prevent all meaningful validation. Record residual risk rather than changing unrelated components.

## Recovery
Recover from this task, `.pi/extensions/worker-tools.ts`, and the integrated observability schema in `components/observability/tracer.ts`. No session store or runtime artifact is authoritative.

## Next Action
Launch one bounded root component-builder attempt.
