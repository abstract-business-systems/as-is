---
as-is-version: 2
task:
  status: completed
  worker: as-is
  updated: 2026-08-02T00:00:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.50
    spent: 0.00
    reserve: 0.05
    source: unavailable
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 300
      spent-seconds: 0
      reserve-seconds: 60
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Define a bounded read-only worker role for in-process agent communication.
  - Provide a blocking call_subagent tool using an in-memory Pi SDK session.
  - Keep worker calls non-mutating and non-delegating by default.
  - Add best-effort local trace events without making telemetry authoritative.
  - Add bounded local trace search, retrieval, summary, and comparison tools.
  - Add backend-neutral file/OTLP tracer support with Jaeger/Phoenix-compatible configuration.
  - Make the shared tracer and trace-query tools use the same sink and base project configuration.
  - Record subprocess launch, exit, and handoff trace events without changing durable execution semantics.
  - Instrument supervisor delegation, watchdog, worker, completion, recovery, checkpoint, and validation-handoff spans.
---

# Worker Agent

## Purpose

Provide fast, reusable, read-only in-process assistance to user-facing and
orchestrating agents without using a durable component subprocess.

## Requirement

Implement the worker role and `call_subagent` extension tool with independent
session history, read-only built-in tools, bounded timeout, structured output,
and best-effort local trace events.

## Plan

1. Add the worker role contract.
2. Register `call_subagent` in a project-local Pi extension.
3. Create an in-memory SDK session with read-only tools.
4. Add timeout, abort, result bounds, role validation, and trace events.
5. Validate with Bun build and focused existing tests.

## Progress

- Added `.agents/agents/worker/agent.md` and this task record.
- Added `.pi/extensions/worker-tools.ts`.
- Added `.as-is-infra/` as the ignored local infrastructure boundary.
- Added project tracer configuration and forwarded tracer environment for
  component-building subprocesses.
- Added best-effort component launch trace records in the subprocess launcher.
- Added bounded `search_traces`, `get_trace`, `summarize_trace`, and
  `compare_traces` tools over redacted local JSONL events.

## Validation

- `bun build --no-bundle --target bun --outfile /tmp/worker-tools.js .pi/extensions/worker-tools.ts` passed.
- `bun build --no-bundle --target bun --outfile /tmp/spawn.js skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts` passed.
- `bun test skills/as-is/scripts/orient.test.ts` passed.
- `bun test skills/spawning-pi-subagents/scripts/spawn-pi-subagent.test.ts` passed: 8 tests.
- `bun test subprocess-execution-foundation/supervisor.test.ts` passed: 10 tests.
- The extension builds successfully with Bun.
- Added `observability/tracer.ts` with file and OTLP-compatible export paths.
- Added deterministic tracer tests for file output and OTLP payload shape.
- Added subprocess launch, exit, and handoff events while preserving worktree,
  budget, cleanup, and commit handling.
- Added supervisor lifecycle, recovery, checkpoint, watchdog, worker,
  completion, and validation-handoff trace events.
- Unified trace queries with `.as-is/tracing.jsonl` and fixed newline
  parsing.
- Made the shared tracer read `tracer` from the base `as-is.md`, while
  allowing explicitly propagated environment configuration to override it.
- Residual risk: no live model call or Jaeger endpoint was exercised; endpoint
  availability and backend-specific deployment configuration remain unverified.
- Backlog item created at repository-root `backlog.md` for Jaeger setup and
  verification across all subagent flows.

## Result

The worker role and first blocking in-process delegation path are implemented.
The component-build tracer is configurable and propagated to subprocesses, with
local launch observations. Collector/shared observation remains future bounded work.

## Blockers And Escalations

None for this bounded increment. A live Pi session must reload the new
`.pi/extensions/worker-tools.ts` extension before using `call_subagent`.

## Recovery

Start from this record, the worker role, `.pi/extensions/worker-tools.ts`,
and the launcher. Local traces are disposable under `.as-is/`.

## Next Action

Implement the Jaeger backlog item, then evaluate optional Collector support
only if local Jaeger evidence justifies it.
