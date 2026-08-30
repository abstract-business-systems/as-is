---
name: identifying-owners
description: Use when authorities and owners for resolved scopes must be identified; establishes fit only and grants no tools or authority.
---

## Purpose

Identify the authorities and owners for the resolved scopes.

## Approach

Trace each concern to its canonical owner and separate authority, consultation, and implementation responsibilities.

## How it should be done

Build a concern-to-owner table for implementation, task state, durable records, history, validation, delegation, and commits; verify each owner from a record or contract; distinguish who may advise, edit, authorize, and integrate.

## Design view

```mermaid
---
config:
  layout: elk
---
flowchart TB
    Scope["Resolved scope"] --> Concerns["List concerns"]
    Concerns --> Authorities["Map authorities"]
    Authorities --> Handoff["Owner handoff"]
```
