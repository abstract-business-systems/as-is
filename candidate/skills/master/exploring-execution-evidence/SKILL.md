---
name: exploring-execution-evidence
description: Use when bounded execution evidence must be investigated to produce a cautious finding; establishes fit only and grants no tools or authority.
---

## Purpose

**Purpose**: Investigate bounded execution evidence and produce a cautious finding.

## Approach

**Approach**: Build the smallest evidence context, inspect readable traces or sessions, correlate observations, and report findings without granting execution or task authority.

## How it should be done

**How it should be done**: Require a focused question and exact selector; read only permitted trace/session evidence; correlate bounded events; label observations, inferences, and unknowns; return a finding and recommendation; never edit, launch, authorize, or treat telemetry as task state.


## Composition context

Workflow example (drafts/composable-skills.md lines 172-174):

```text
exploring-execution-evidence = building-context → inspecting-execution-evidence → recording-evidence
```

Tool-access composition admission (drafts/composable-skills.md lines 112-113): A skill does not grant tools. Before an agent is admitted to a master skill or composition, the composition's required tool set must be compared with the agent's declared tools, permissions, and authority. The agent must have every tool needed for its selected path, or the workflow must stop with a bounded missing-capability blocker; it must not silently substitute a weaker tool, broaden permissions, or ask a read-only agent to perform mutation.