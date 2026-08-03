---
as-is-version: 2
constraints:
  cost:
    currency: USD
    allocated: 0.45
    spent: 0.00
    reserve: 0.08
    source: host-reported
    fallback-metric: validation elapsed-seconds (not monetary cost)
  delegation:
    maximum-depth: 1
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 360
      spent-seconds: 0
      reserve-seconds: 60
      source: host-reported
  external-effects: require-current-turn-user-approval
acceptance:
  - Provide supplementary bounded execution telemetry and trace query support without becoming task, job, validation, recovery, or completion authority.
  - Keep trace content subject to configured privacy, security, redaction, retention, access, and failure controls.
---

# Observability

## Purpose
Provide supplementary, bounded execution telemetry and trace query support
without becoming task, job, validation, recovery, or completion authority.

## Design
The component uses the repository tracer configuration and local JSONL sink,
with optional backend-compatible export. Trace content remains bounded and must
respect privacy, security, redaction, retention, access, and failure controls.
Conversational and tool detail is session-reference-first: traces carry opaque,
scoped session correlation and bounded metadata, while full content requires
separate authorization for session inspection.

## Boundaries
This component owns tracing implementation, trace queries, and observability
backlog items. It does not own task-record semantics or durable task authority.

## Links
- [`tracer.ts`](tracer.ts) — tracer implementation.
- [`tracer.test.ts`](tracer.test.ts) — focused tracer checks.
- [`backlog.md`](backlog.md) — open and deferred observability planning.

## Capture Policy
Session references are correlation metadata, not resolved content. The tracer
implements local-full raw payload retention and an export-bounded
policy. Local JSONL retains declared payload classes subject to configured file
retention and size controls; OTLP export is suppressed by default and, when
explicitly enabled, filters classes, redacts sensitive values, and bounds bytes.
This remains supplementary telemetry and never task, job, validation, recovery,
or completion authority.

## Validation
Focused tracer tests and the Bun tracer build passed; `git diff --check`
passed. A fresh read-only content-level expert review passed and explicitly
stated that the implementation is safe to commit based on content review, while
Git/test execution was not independently performed. Residual risk: no live
Jaeger endpoint test.

## Requirement
Implement local-full raw payload retention and export-bounded Jaeger/OTLP
capture policy without changing telemetry authority.

## Plan
Keep raw payloads separate from lifecycle attributes; retain them exactly in
local JSONL and filter, redact, and byte-bound only explicit export.

## Progress
The implementation and focused tests were recovered from the validated worktree
without semantic tracer changes.

## Result
Local-full/export-bounded capture policy is implemented and documented.

## Blockers And Escalations
No implementation blocker remains. Residual risk is no live Jaeger endpoint
test; raw payload sources from launcher/session internals remain successor work.

## Recovery
Recover from Git history, `tracer.ts`, `tracer.test.ts`, `tracing-design.md`, and
this component's changelog. Local raw capture and export-bounded filtering are
distinct policies and must not be conflated.

## Next Action
Add launcher/session/tool/usage payload sources and Jaeger/query integration as
separately authorized successor tasks.

## Changelog
See [`changelog.md`](changelog.md) for concise historical handoff evidence.
