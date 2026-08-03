---
as-is-version: 2
task:
  status: ready
  worker: component-builder
  updated: 2026-08-06T04:30:00Z
  task-revision: session-reference-trace-schema-recovery-3
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
      spent-seconds: 192.60
      reserve-seconds: 60
      source: child-reported elapsed time
  external-effects: require-current-turn-user-approval
acceptance:
  - Add a typed, allowlisted session-reference metadata shape to the observability tracer without adding session-store access or raw content capture.
  - Preserve existing generic trace attributes, local-full/export-bounded sink behavior, redaction, size limits, and telemetry authority boundaries.
  - Ensure session references are opaque metadata: session ID, scoped store, revision/event range, bounded counts/bytes, and missing-session status; no absolute paths or session content.
  - Add deterministic tracer tests for serialization and absence of raw prompt/response/tool content in the session-reference fields.
  - Modify only components/observability/; do not modify launcher, extensions, session storage, setup, roles, or product components.
  - Obtain expert plan and final validation, record evidence, remove tasks.md, and create a scoped commit.
---
# Session-reference trace schema recovery

## Requirement
Implement the exact authorized `SessionReference` contract defined in the recovery revision: allowlisted keys `sessionId`, `store`, `revision`, `eventStart`, `eventEnd`, `messageCount`, `toolCallCount`, `inputBytes`, `outputBytes`, and `availability`; bounded opaque IDs; bounded non-negative counters; and atomic invalid-object rejection. No session access or raw content capture is authorized.

## Scope
Only components/observability/. The preserved child changes are limited to `tracer.ts`, `tracer.test.ts`, and this task record.

## Progress
The builder implemented the typed serializer and tests in the preserved worktree `/tmp/as-is-child-3tukAc/worktree`. Plan review required and received one revision to reject URL-like scheme prefixes in opaque `sessionId`/`revision` values in addition to slash, backslash, and NUL. Implementation remained inside the component.

## Validation
Not started for recovery revision 3.

## Result
Not available.

## Blockers And Escalations
Fresh recovery authorization after attempt 1 failed its attributable expert gate. The builder must preserve or reproduce the implementation, then perform exactly one final expert validation with the exact absolute changed-file list and direct reads only. The expert response must explicitly name those files and state whether the implementation is safe to commit. Stop if attribution or scope is ambiguous.

## Recovery
Recover implementation from `/tmp/as-is-child-3tukAc/worktree`; do not retry revision 2. Preserve prior evidence in Git history. No changes outside `components/observability/` are authorized.

## Next Action
Launch one bounded component-builder recovery attempt with strict exact-file expert validation.
