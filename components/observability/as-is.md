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
  - Keep trace events subject to configured retention and failure controls; correlate sessions by opaque ID only while making local session inspection useful for debugging.
---

# Observability

## Purpose
Provide supplementary execution telemetry and trace query support without
becoming task, job, validation, recovery, or completion authority.

## Design
The component uses the repository tracer configuration and local JSONL sink,
with optional backend-compatible export. Trace content remains subject to configured retention and failure controls.
Local session inspection follows effective user/file ownership: readable local
Pi sessions may be inspected through a read-only, exact-ID surface with detail,
paging, and role/tool selectors, without a tracer-owned per-session approval
system. External sinks receive only the opaque session ID
and never local session data or session-store references.

## Boundaries
This component owns tracing implementation, trace queries, and observability
backlog items. It does not own task-record semantics or durable task authority.

## Links
- [`tracer.ts`](tracer.ts) — tracer implementation.
- [`tracer.test.ts`](tracer.test.ts) — focused tracer checks.
- [`backlog.md`](backlog.md) — open and deferred observability planning.

## Trace Safety Policy

Trace records are supplementary observations, never task, budget, recovery,
validation, or completion authority. New local records are append-only: the
writer may append within configured limits, or perform explicitly configured
retention cleanup, but it must not rewrite or correct an existing event. Trace
failures, malformed events, unavailable sinks, and size-limit decisions must
not change execution or durable task decisions. Historical `.as-is/tracing.jsonl`
files are preserved as audit evidence and are not migrated or rewritten by new
trace behavior.

Budget extensions are evaluated from durable task records and bounded
read-only execution evidence. A trace may correlate an already-authorized
request or decision, but a trace event cannot allocate, approve, extend, stop,
resume, or complete a task.

## Capture Policy
The tracer captures key execution events and metadata, including
subprocess delegation lifecycle, worker outcomes, supervisor phases, handoffs,
and session correlation. Session payloads remain in the Pi session store and
are not tracer inputs. External export carries only the opaque session ID and
never dereferences local session files. Local JSONL remains subject to
configured file retention and size controls. This remains supplementary
telemetry and never task, job, validation, recovery, or completion authority.

## Validation
Focused tracer tests and the Bun tracer build passed; `git diff --check`
passed. A fresh read-only content-level expert review passed and explicitly
stated that the implementation is safe to commit based on content review, while
Git/test execution was not independently performed. Residual risk: no live
Jaeger endpoint test.

## Requirement
Capture key non-session execution events, including subprocess delegation, and
correlate them with session IDs without changing telemetry authority.

## Plan
Keep session payloads in the Pi session store. Emit bounded lifecycle,
relationship, outcome, timing, handoff, and session-ID metadata to local and
configured external sinks.

## Progress
The implementation and focused tests were recovered from the validated worktree
without semantic tracer changes.

## Result
Key execution-event capture and session-ID-only external correlation are implemented and documented.

## Blockers And Escalations
No implementation blocker remains. Residual risk is no live Jaeger endpoint test and incomplete coverage of future execution-event producers.

## Recovery
Recover from Git history, `tracer.ts`, `tracer.test.ts`, `tracing-design.md`, and
this component's changelog. Session payloads belong to the Pi session store;
tracer events contain execution metadata and opaque session IDs only.

## Next Action
Add any missing key-event producers and Jaeger/query integration as separately
bounded successor tasks.

## Changelog
See [`changelog.md`](changelog.md) for concise historical handoff evidence.
