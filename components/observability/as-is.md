# Observability

## Purpose

Provide supplementary execution telemetry and trace query support without becoming task, job, validation, recovery, or completion authority.

## Design

The component uses the repository tracer configuration and local JSONL sink,
with optional backend-compatible export. Trace content remains subject to
configured retention and failure controls. Local session inspection follows
effective user/file ownership: readable local Pi sessions may be inspected
through a read-only, exact-ID surface with detail, paging, and role/tool
selectors, without a tracer-owned per-session approval system. External sinks
receive only the opaque session ID and never local session data or
session-store references.

## Boundaries

This component owns tracing implementation, trace queries, and observability
backlog items. It does not own task-record semantics or durable task authority.
Trace records are supplementary observations, never task, budget, recovery,
validation, or completion authority. New local records are append-only: the
writer may append within configured limits, or perform explicitly configured
retention cleanup, but it must not rewrite or correct an existing event. Trace
failures, malformed events, unavailable sinks, and size-limit decisions must
not change execution or durable task decisions. Historical
`.as-is/tracing.jsonl` files are preserved as audit evidence and are not
migrated or rewritten by new trace behavior.

Budget extensions are evaluated from durable task records and bounded
read-only execution evidence. A trace may correlate an already-authorized
request or decision, but a trace event cannot allocate, approve, extend, stop,
resume, or complete a task.

## Capture Policy

The tracer captures key execution events and metadata, including subprocess
delegation lifecycle, worker outcomes, supervisor phases, handoffs, and session
correlation. Session payloads remain in the Pi session store and are not tracer
inputs. External export carries only the opaque session ID and never
dereferences local session files. Local JSONL remains subject to configured
file retention and size controls. This remains supplementary telemetry and
never task, job, validation, recovery, or completion authority.

## Links

- [`tracer.ts`](tracer.ts) — tracer implementation.
- [`tracer.test.ts`](tracer.test.ts) — focused tracer checks.
- [`tracing-design.md`](tracing-design.md) — broader tracing design and staged
  rollout boundaries.
- [`backlog.md`](backlog.md) — open and deferred observability planning.
- [`changelog.md`](changelog.md) — concise completed-task history.
