# As-Is Setup - as-is

## Purpose

Initialize the `as-is` documentation convention in an existing project,
including a reviewable component proposal, root instruction integration, and
creation of approved canonical component records.

## Design

The setup skill separates project adoption from individual record maintenance:

[as-is](../../as-is.md#design) / [Skills](../as-is.md#design) / **As-Is Setup**

### Setup adoption progression

- Pre-render layout plan: repository Markdown consumers with no fixed dimensions or configured renderer; use a sparse taller-than-wide TB/ELK-style setup flow with five short-labeled nodes and five edges, direct top-to-bottom routing, and no grouping or subgraphs; renderer-specific geometry remains untested.

```mermaid
flowchart TD
    Project["Existing project"] --> Plan["Reviewable setup plan"]
    Plan --> Candidates["Semantically identified candidates"]
    Candidates --> Approval["Human component approval"]
    Approval --> Records["Approved as-is records"]
    Approval --> Instructions["Root AGENTS.md canonical-use instruction"]
```

The setup record is a process view, not a parent container view. It uses a
vertical layout because the arrows represent progression from discovery through
approval to durable setup outcomes. The reusable procedure requires a comparable pre-render layout plan for each planned target diagram so render-surface constraints, shape, density, grouping, routing, and exceptions are decided before a fence is written. Setup selects whole-project mode by default
and treats an explicit directory as an independent bounded target; the selected
mode, target, effective boundary, and excluded paths are preserved in the
reviewable plan before any write.

The setup procedure preserves existing content, uses the strict
`# <component-name> - as-is` record title, and delegates record-specific
structure and diagram meaning to `managing-as-is-document`.

## Links

- [`SKILL.md`](SKILL.md) — setup procedure and safety checks.
- [`../managing-as-is-document/as-is.md#design`](../managing-as-is-document/as-is.md#design) — individual record lifecycle.
- [`../../docs/architecture-vocabulary.md#component-boundary`](../../docs/architecture-vocabulary.md#component-boundary) — current-system meaning of component boundaries and canonical records.
- [`../../components/as-is-setup/as-is.md#design`](../../components/as-is-setup/as-is.md#design) — implementation evidence for host/client resource wiring.
