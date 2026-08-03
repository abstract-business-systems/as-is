---
as-is-version: 2
task:
  status: blocked
  worker: component-builder
  updated: 2026-08-06T04:15:00Z
  task-revision: session-reference-trace-schema-recovery-2
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
Implementation checks passed in the preserved worktree: `bun test components/observability/tracer.test.ts` — 8 passed, 55 expectations; Bun tracer build passed; `git diff --check` passed; scoped status showed only `tasks.md`, `tracer.ts`, and `tracer.test.ts`. Final expert validation failed twice: the first direct-file review found a U+0000 defect, which the builder fixed and rechecked; the next review was not attributable to the correct component context and inspected an unrelated root task, so it could not assess the actual files or state commit safety.

## Result
Blocked attempt 1. Typed `SessionReference` implementation remains uncommitted in `/tmp/as-is-child-3tukAc/worktree`; no parent integration occurred.

## Blockers And Escalations
Required final expert validation did not return an attributable pass. Do not remove this task record, commit, cherry-pick, or claim completion. Do not retry this revision or bypass the expert gate. A new recovery authorization must establish a reliable direct-file expert context before another attempt.

## Recovery
Preserve `/tmp/as-is-child-3tukAc/worktree` and the child registry/session evidence. Child-reported elapsed time is approximately 192.6 seconds; monetary spent remains `0.00` because host cost is unavailable. No setup, launcher, extension, role, session-store, product, or external files changed.

## Next Action
Authorize a new recovery revision only after resolving attributable direct-file expert validation in the controlled worktree.
