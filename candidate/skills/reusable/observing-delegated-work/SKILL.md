---
name: observing-delegated-work
description: Use when delegated progress, results, budgets, or terminal status must be observed; this skill establishes fit only and grants no tools or authority.
---

## Purpose

Observe delegated progress, results, budgets, and terminal status.

## Approach

Read approved progress and evidence surfaces incrementally, report blockers and outcomes, and avoid directing work outside granted authority.

## How it should be done

Use the approved handle, task record, logs, traces, or session selectors; read incrementally; compare progress with acceptance and budget; classify running, blocked, failed, or terminal; preserve the worker's scope and do not infer completion.

## Design view

```mermaid
---
config:
  layout: elk
---
flowchart TB
    Handoff["Approved delegation"] --> Observe["Read progress and evidence"]
    Observe --> Classify["Running, blocked, or terminal"]
    Classify --> Report["Observation report"]
```
