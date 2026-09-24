---
name: designing-diagrams
description: Use when a bounded reader-oriented visual explanation is needed; establishes fit for designing and render-validating diagrams only and grants no tools or authority.
---

## Purpose

Design bounded reader-oriented visual explanations.

## Approach

Select a diagram type and symbols that explain the intended relationships while keeping source, navigation, and ownership accurate.

## How it should be done

Define the reader question and view boundary; choose functional nodes and canonical relationships; include only supported context; design labels and layout for scanning; provide source and expected navigation targets for validation. Verify the produced view: render it where a renderer is available and inspect the result against the intent; when no renderer is available, state that explicitly in the report instead of claiming validation.

Layout and grouping rules:

- Orient diagrams vertically (flowchart `TB`) by default; horizontal orientation is an exception justified by a reader question that scans left-to-right (e.g. a short pipeline). Component-map records use vertical alignment.
- Always group similar components into one subgraph rather than scattering peers at the top level. Grouping axes follow the component's own structure: sibling components group under their parent, reusable setup groups apart from archived history.
- Follow the house diagram styling: `config: layout: elk` frontmatter, `securityLevel: loose` init, labeled relationships, and the shared component/child class definitions from the established records.

