# Observability

## Purpose
Provide supplementary, bounded execution telemetry and trace query support
without becoming task, job, validation, recovery, or completion authority.

## Design
The component uses the repository tracer configuration and local JSONL sink,
with optional backend-compatible export. Trace content remains bounded and must
respect privacy, security, redaction, retention, access, and failure controls.

## Boundaries
This component owns tracing implementation, trace queries, and observability
backlog items. It does not own task-record semantics or durable task authority.

## Links
- [`tracer.ts`](tracer.ts) — tracer implementation.
- [`tracer.test.ts`](tracer.test.ts) — focused tracer checks.
- [`backlog.md`](backlog.md) — open and deferred observability planning.
