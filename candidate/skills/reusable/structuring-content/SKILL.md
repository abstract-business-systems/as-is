---
name: structuring-content
description: Use when repository content must be shaped into durable, discoverable artifacts by choosing location, hierarchy, and representation for readers.
---

## Purpose

Choose a durable location, hierarchy, and representation.

## Approach

Shape content around reader goals, ownership, discoverability, and lifecycle while preserving existing structural conventions.

## How it should be done

Identify the reader and retrieval question; inspect the containing structure; choose the smallest meaningful location and representation; keep authority with the owning record; preserve navigation and lifecycle; assess moves before changing existing content.

## Design view

```mermaid
---
config:
  layout: elk
---
flowchart TB
    Need["Reader need"] --> Boundary["Owner and lifecycle"]
    Boundary --> Shape["Smallest coherent shape"]
    Shape --> Navigation["Discoverable artifact"]
```
