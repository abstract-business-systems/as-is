---
as-is-version: 2
task:
  status: blocked
  worker: component-builder
  updated: 2026-08-06T04:00:00Z
  task-revision: session-reference-trace-schema-1
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
Blocked during required read-only expert plan review before implementation edits. The expert review could not approve the plan because it did not define exact metadata field names and serialized keys, store and missing-status allowlists, opaque-ID and numeric bounds, or deterministic invalid-value omission/rejection behavior. No implementation or tests were run.

## Result
No implementation edits were made and no scoped commit was produced.

## Blockers And Escalations
Durable blocker: required expert plan review failed before edits. Recovery requires revising this task plan with exact allowlists, field/key contract, numeric bounds, opaque-ID rule, and invalid-value behavior, then obtaining a fresh attributable expert plan review. Do not implement, remove tasks.md, or commit until that review passes. No scope expansion, runtime access, or raw-content capture was performed.

## Recovery
The component-builder attempt produced no usable worktree or caller-visible changes. This record and commit `f1b8f69` preserve the authorized revision; do not retry it. A new recovery revision must explicitly authorize the revised schema contract.

## Next Action
Obtain authorization for a new recovery revision with an exact schema contract, then launch component-builder again.
