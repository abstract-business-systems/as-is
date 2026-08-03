---
as-is-version: 2
task:
  status: ready
  worker: component-builder
  updated: 2026-08-06T03:35:00Z
  task-revision: session-reference-trace-schema-1
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
  - Add a typed, allowlisted session-reference metadata shape to the observability tracer without adding session-store access or raw content capture.
  - Preserve existing generic trace attributes, local-full/export-bounded sink behavior, redaction, size limits, and telemetry authority boundaries.
  - Ensure session references are opaque metadata: session ID, scoped store, revision/event range, bounded counts/bytes, and missing-session status; no absolute paths or session content.
  - Add deterministic tracer tests for serialization and absence of raw prompt/response/tool content in the session-reference fields.
  - Modify only components/observability/; do not modify launcher, extensions, session storage, setup, roles, or product components.
  - Obtain expert plan and final validation, record evidence, remove tasks.md, and create a scoped commit.
---
# Session-reference trace schema

## Requirement
Implement the smallest runtime-neutral observability contract for session-reference-first tracing. The tracer may carry an explicit typed session-reference metadata object on events, but it must not resolve sessions, read Pi session JSONL, capture raw conversational/tool content, or export arbitrary paths. Runtime producers in launcher/extension components are a separately authorized successor.

## Scope
Only components/observability/. Expected files are tracer.ts, tracer.test.ts, and component records. No cross-component edits.

## Plan
Define the typed metadata shape and deterministic validation/serialization at the tracer boundary. Keep it optional so existing lifecycle callers remain unchanged. Ensure exports include only allowlisted bounded reference fields and preserve existing local-full/export-bounded semantics for any legacy raw payload policy.

## Validation
Not started.

## Result
Not available.

## Blockers And Escalations
Stop if implementation requires inspecting session files, changing runtime producers, or broadening raw payload capture. Preserve a durable blocker rather than expanding scope.

## Recovery
Recover from this task record, components/observability/tracer.ts, tracer.test.ts, and the session-reference design. No external runtime state is authoritative.

## Next Action
Launch one bounded component-builder attempt.
