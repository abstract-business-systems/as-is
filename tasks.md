---
as-is-version: 2
task:
  status: completed
  worker: component-builder
  updated: 2026-08-06T04:45:00Z
  task-revision: session-reference-runtime-producer-1
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
Revised after expert plan review: import the observability `SessionReference` type and `serializeSessionReference` validator. Derive one optional parent reference only from a safely callable `ctx.sessionManager.getSessionId()`, accepting only the validator-approved opaque string and constructing `store: project-local`, `availability: available`; omit it when absent/invalid. Attach that same optional `sessionReference` to call start and worker.result success/failure events, remove the raw session-id attribute, and leave all other attributes and behavior unchanged. Do not inspect stores or content, and do not add child correlation unless a supported API exposes it safely (none is assumed). Validate direct-file syntax/type/native host if available, then obtain final expert review of the exact diff.

## Validation
Plan review by expert failed initially and was revised with explicit validator use, raw-attribute removal, and success/failure checks. `bun --check .pi/extensions/worker-tools.ts` passed with no output. Native TypeScript build was attempted with `bunx tsc ...` but standalone `bunx` is unavailable (`command not found`); this is residual host dependency risk, with no scope expansion. Final expert direct-file review identified the implementation as aligned and requested only this record evidence; exact changed files are `.pi/extensions/worker-tools.ts` and root handoff records.

## Result
Implemented parent session-reference production for `call_subagent` start and `worker.result` success/failure using only `ctx.sessionManager.getSessionId()` and `serializeSessionReference`; invalid or missing IDs are omitted. No child reference is emitted because no safely supported child API was exposed. Worker, query, authorization, and telemetry isolation behavior remain unchanged. Safe to commit after recording this evidence.

## Blockers And Escalations
Stop if the extension API cannot safely expose the session ID, if integration requires session-store access or raw content, or if host-only dependencies prevent all meaningful validation. Record residual risk rather than changing unrelated components.

## Recovery
Recover from this task, `.pi/extensions/worker-tools.ts`, and the integrated observability schema in `components/observability/tracer.ts`. No session store or runtime artifact is authoritative.

## Next Action
Completed; durable handoff is recorded in changelog.md and ready for scoped commit.
