---
name: drafting-changelog-entries
description: Prepares concise history entries for the owning changelog procedure; applies when a validated component task result needs to be summarized into durable history without replacing the owning changelog or completion protocol.
---

## Purpose

Prepare concise history entries for the owning changelog procedure.

## Approach

Summarize the durable result, evidence, scope, and residual risk without replacing the owning changelog or completion protocol.

## How it should be done

Wait for validated completion evidence; name the task or change identity; summarize result and checks; state residual risk and source commits where applicable; let the owning procedure decide placement and cleanup.

## Design view

```mermaid
---
config:
  layout: elk
---
flowchart TB
    Result["Validated result"] --> Summary["Concise evidence summary"]
    Summary --> Owner["Owning changelog"]
    Owner --> History["Durable history"]
```
