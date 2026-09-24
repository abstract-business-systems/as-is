---
name: designing-mermaid-diagrams
description: Use when bounded Mermaid views must be produced and verified (source checks plus render validation when a renderer is available); establishes fit, not permission (grants no tools or authority).
---

## Purpose

**Purpose**: Produce bounded Mermaid views and verify them at source and render level.

## Approach

**Approach**: Design the reader-oriented view, preserve navigational hrefs, verify at source level, render-verify whenever a renderer is available, and report renderer limitations explicitly.

## How it should be done

**How it should be done**: Define the reader question and diagram scope; choose a supported view and canonical labels; write linked Mermaid source; then verify the diagram before declaring it valid. Verification is a required step with reported evidence, never optional:

1. **Source verification (always)**: every referenced node is defined, subgraph/end counts balance, every `href` target exists, and the house source conventions below are followed.
2. **Render verification (whenever a renderer is available)**: render the exact source, inspect the rendered output (shape matches the intent, labels legible, links point to the expected targets), and keep source and renderer evidence separate in the report.
3. **Renderer unavailability (no silent skips)**: if no renderer is available, the report must say so explicitly and name the checks that were performed at source level only; the diagram is then unverified at render level, and that status travels with the work.

Mermaid source conventions (house style, from the established records):

- Frontmatter `config: layout: elk` plus `%%{init: {"securityLevel": "loose"}}%%`; vertical `flowchart TB` by default.
- Similar components are grouped in one subgraph (with `direction TB` inside); peer components are never left scattered at the top level.
- Reuse the house `classDef component`/`child` definitions instead of inventing per-diagram styling.
- Structure checks: every referenced node is defined, subgraph/end counts balance, and every `href` target exists before declaring the source valid.


## Composition context

No composition table, workflow example, or tool-access row is cited for this master by the realization plan (plan section 7 composition-context column: "—"). Carry the general tool-access acknowledgment as composition-admission documentation (drafts/composable-skills.md lines 112-113): A skill does not grant tools. Before an agent is admitted to a master skill or composition, the composition's required tool set must be compared with the agent's declared tools, permissions, and authority. The agent must have every tool needed for its selected path, or the workflow must stop with a bounded missing-capability blocker; it must not silently substitute a weaker tool, broaden permissions, or ask a read-only agent to perform mutation.