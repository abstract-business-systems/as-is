---
as-is-version: 2
task:
  status: completed
  worker: implementer
  updated: 2026-07-30T16:30:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.10
    spent: 0.00
    reserve: 0.02
    source: unavailable
    fallback-metric: unavailable
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 120
      spent-seconds: 0
      reserve-seconds: 30
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Group the repository's independent design documents under `designs/` when justified.
  - Preserve discoverable entry points and update references.
  - State that relevant designs move into built components and link from their records.
---

# Designs

## Purpose
Provide a discoverable component for enduring architecture, protocol, and
execution design documents.

## Requirement
Group the existing subject-named design documents under `designs/` because
there is a meaningful sibling set with shared design-document purpose. The
folder is not a generic bucket: each design retains its subject and authority.
Relevant designs should move into built components when they become an
implemented component, with a link from that component's `as-is.md`.

## Plan
Move the independent design documents, update links, and validate the
replacement paths and task records.

## Progress
Moved `execution-accounting-design.md`, `orchestration-design.md`, and
`independent-delegation.md` into this directory; links from the moved documents
use same-directory relative paths. Existing component designs
already under component directories were not moved across ownership boundaries.

## Validation
Root integration must check all references, task-record paths, naming, and
`git diff --check`. No runtime files were changed.

## Result
Completed the justified design grouping while preserving subject-named files
and the designs component entry point.

## Blockers And Escalations
None. Residual risk is limited to historical prose that may require canonical
terminology updates.

## Recovery
Use this record and the moved design documents. A design that becomes part of a
built component should be relocated only through a bounded maintenance record.

## Links
- `execution-accounting-design.md` — execution accounting design.
- `orchestration-design.md` — orchestration design.
- `independent-delegation.md` — independent delegation design.

## Next Action
Root integration should update all references and link relevant component
records.
