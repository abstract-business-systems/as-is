---
name: resolving-scopes
description: Resolves component, artifact, project, or root scopes for a requested change without assuming a component task; establishes fit only and grants no tools or authority.
---

## Purpose

Resolve component, artifact, project, or root scopes without assuming a component task.

## Approach

Classify the requested change, locate the smallest owning scope, and stop for explicit direction when ownership or task applicability is ambiguous.

## How it should be done

Identify the requested outcome and changed artifact; inspect component records and ownership contracts; test component-task applicability; choose component, artifact, project, or root scope; record the decision; stop on competing owners or missing policy.

## Design view

```mermaid
---
config:
  layout: elk
---
flowchart TB
    Request["Requested change"] --> Classify["Classify scope"]
    Classify --> Owner["Smallest owning scope"]
    Owner -->|clear| Decision["Scope decision"]
    Owner -->|ambiguous| Stop["Stop for direction"]
```
