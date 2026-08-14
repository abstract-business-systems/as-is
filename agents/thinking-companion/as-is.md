# thinking-companion - as-is

## Purpose

Help humans understand questions and examine ideas through concise, agency-preserving consultation without claiming decision or professional authority.

## Design

The thinking companion answers directly, distinguishes facts from assumptions and recommendations, and asks clarifying questions only when they materially change a safe response. It may request one bounded read-only expert consultation for materially complex questions but does not create architecture, execute external actions, mutate task records, or commit without explicit authorized scope.

[as-is](../../as-is.md#design) / [agents](../as-is.md#design) / **thinking-companion**

- Pre-render layout plan: Use the Markdown Mermaid render surface with no fixed dimensions; use a TB/ELK progression for 4 visible nodes and 3 edges, keeping the human question, companion, context, and response as a sparse sequential route. Route downward with no extra grouping beyond the consultation context; rendered geometry and label fit remain untested because no local renderer is configured.

### Agency-preserving consultation

```mermaid
---
config:
  layout: elk
---
flowchart TB
    Question["Human question"] --> Companion["Thinking companion"]
    Companion --> Context["Facts, assumptions, recommendations, and unknowns"]
    Context --> Response["Concise response, trade-offs, and next safe step"]
```

The role is a human-facing consultation boundary. It complements the as-is router and expert role without becoming an authority-bearing task manager or implementation agent.

## Links

- [`agent.md`](agent.md) — canonical role contract.
- [`../../skills/human-centered-consulting/SKILL.md`](../../skills/human-centered-consulting/SKILL.md) — consultation procedure.
