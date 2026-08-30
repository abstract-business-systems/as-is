---
name: assessing-determinism
description: Use when repeated behavior and inputs must be compared to identify evidence-supported deterministic improvements; establishes fit for the task and grants no tools or authority.
---

## Purpose

Identify evidence-supported deterministic improvements.

## Approach

Compare repeated behavior and inputs, isolate nondeterministic sources, and recommend only changes supported by observed variance.

## How it should be done

Classify steps as policy, transformation, observation, or judgment; compare bounded repetitions; quantify relevant variance and benefit; preserve intentional generative behavior; recommend retention, a bounded backlog item, or an explicitly authorized task.

## Design view

```mermaid
---
config:
  layout: elk
---
flowchart TB
    Behavior["Repeated behavior"] --> Compare["Compare bounded runs"]
    Compare --> Variance["Relevant variance"]
    Variance --> Recommendation["Evidence-based recommendation"]
```
