---
name: spawning-subagents
description: Use when bounded delegated work must be launched, observed, recovered, and handed off under existing authority; establishes fit, not permission, and grants no tools or authority.
---

## Purpose

**Purpose**: Launch, observe, recover, and hand off bounded delegated work under existing authority without making the launcher a task-record or completion authority.

## Approach

**Approach**: Consume the control plane's `admitLaunch()` result, including its normalized wall-clock limit, and invoke only the approved host adapter with the admitted role, task, record, caller linkage, and handoff budget.

The runtime/control-plane implementation enforces these limits deterministically, while this skill prose is not runtime enforcement.

## How it should be done

**How it should be done**: Verify role admission, configured worker, component boundary, task state, capability, and budget; forward the approved value exactly as `--budget-wall-clock-seconds <admitLaunch().wallClockSeconds>` to `spawn-pi-subagent.ts`; observe the bounded handle, task record, and source-labelled evidence, then recover with preserved cumulative budgets and a new attempt or stop on failure, unavailability, staleness, or cancellation; do not infer completion from exit, telemetry, or handles, and do not let the generic launcher parse task records.