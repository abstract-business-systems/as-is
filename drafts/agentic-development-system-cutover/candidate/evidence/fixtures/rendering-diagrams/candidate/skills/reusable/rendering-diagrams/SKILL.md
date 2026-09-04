---
name: rendering-diagrams
description: Fits work where diagrams must be rendered and inspected when rendering is material; does not grant rendering tools, commands, or authority.
---

## Purpose

Render and inspect diagrams when rendering is material.

## Approach

Use the available renderer, inspect the output and expected links, and report unsupported renderer capability separately from source validity.

## How it should be done

Validate source syntax first; render through the approved local capability; inspect geometry, labels, links, and expected hrefs; distinguish renderer-unavailable from source-invalid; retain source-level evidence when rendering cannot run.

## Design view

```mermaid
---
config:
  layout: elk
---
flowchart TB
    Source["Diagram source"] --> Renderer["Approved renderer"]
    Renderer -->|available| Inspect["Inspect geometry and links"]
    Renderer -->|unavailable| Report["Report source-only evidence"]
```
