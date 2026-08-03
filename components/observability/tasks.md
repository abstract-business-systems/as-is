---
as-is-version: 2
task:
  status: ready
  worker: component-builder
  updated: 2026-08-06T04:15:00Z
  task-revision: session-reference-trace-schema-recovery-2
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
Define the optional `SessionReference` contract at the tracer boundary with exact keys and deterministic bounds. Allowed serialized keys are: `sessionId`, `store`, `revision`, `eventStart`, `eventEnd`, `messageCount`, `toolCallCount`, `inputBytes`, `outputBytes`, and `availability`. `sessionId` and `revision` are opaque UTF-8 strings, max 128 bytes each, and must not contain `/`, `\\`, or NUL. `store` is `project-local` or `host-local`; `availability` is `available`, `missing`, `inaccessible`, `expired`, or `out-of-range`. Numeric fields are non-negative safe integers no greater than 1,000,000,000; `eventEnd` must be no less than `eventStart` when both exist. All fields except `sessionId`, `store`, and `availability` are optional; invalid objects are rejected deterministically rather than partially serialized. No absolute paths, URLs, raw content, or session-store reads are permitted. Existing lifecycle callers remain unchanged and existing sink policies are preserved.

## Validation
Not started for recovery revision 2.

## Result
Not available.

## Blockers And Escalations
Fresh recovery authorization after the prior plan-review blocker. Stop if the exact contract cannot be validated, if runtime session access is required, or if scope expands beyond `components/observability/`.

## Recovery
Revision 1 was blocked before edits and is preserved in commit `48827da`; it must not be retried. This revision explicitly authorizes the schema contract above.

## Next Action
Launch one bounded component-builder recovery attempt.
