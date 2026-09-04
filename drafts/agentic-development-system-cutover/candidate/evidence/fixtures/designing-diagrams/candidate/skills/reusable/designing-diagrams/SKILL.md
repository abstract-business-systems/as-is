---
name: designing-diagrams
description: Use when a bounded reader-oriented visual explanation is needed; establishes fit for designing diagrams only and grants no tools or authority.
---

## Purpose

Design bounded reader-oriented visual explanations.

## Approach

Select a diagram type and symbols that explain the intended relationships while keeping source, navigation, and ownership accurate.

## How it should be done

Define the reader question and view boundary; choose functional nodes and canonical relationships; include only supported context; design labels and layout for scanning; provide source and expected navigation targets for validation.

## Design view

```mermaid
---
config:
  layout: elk
---
flowchart TB
    Question["Reader question"] --> View["Bounded visual view"]
    View --> Labels["Functional labels"]
    Labels --> Source["Validated diagram source"]
```
