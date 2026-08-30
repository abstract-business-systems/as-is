---
name: choosing-names
description: Use when a semantically accurate name must be selected for a software concept using local conventions.
---

## Purpose

Select semantically accurate names using local conventions.

## Approach

Inspect the concept's parent, siblings, and naming guidance, then choose the narrowest accurate name and record material departures.

## How it should be done

Identify the concept's responsibility and lifecycle; inspect parent and sibling names; consult naming guidance; compare alternatives for semantic precision and discoverability; choose one name; update proven references atomically when renaming.

## Design view

```mermaid
---
config:
  layout: elk
---
flowchart TB
    Concept["Responsibility"] --> Vocabulary["Parent and sibling vocabulary"]
    Vocabulary --> Alternatives["Candidate names"]
    Alternatives --> Name["Narrow accurate name"]
```
