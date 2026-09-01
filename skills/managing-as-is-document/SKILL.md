---
name: managing-as-is-document
description: Defines and maintains durable as-is.md component records with clear purpose, hierarchy, boundaries, contextual links, and reader-oriented diagrams.
---

# Managing As-Is Documents

This skill defines the durable record contract for an individual `as-is.md` component record. It applies when a record for an approved component boundary is created, maintained, aligned with implementation evidence, or structurally reconciled; project adoption and component identification remain outside this skill's authority (the standalone setup skills are retired with their capability absorbed; adopted record creation is `master/managing-as-is-records`). It does not create task, backlog, configuration, runtime, or agent authority.

## Scope And Authority

- The owning directory and its `as-is.md` define the default component boundary. Context outside that boundary is limited to applicable instructions, explicitly declared links, named dependencies, and sibling naming evidence needed for a changed label.
- The record's durable inputs are authoritative purpose, immediate documented children, design, relationships, direct navigation context, applicable instructions, bounded requirement, audience, assumptions, and acceptance conditions.
- `as-is.md` owns durable purpose, design, relationships, diagrams, and navigational links. The configured task record consists of the local `task` object in `as-is.json` for machine status, budget, and acceptance metadata plus the configured Markdown task narrative for human progress, validation evidence, and recovery; configured backlog records own unstarted proposals.
- A record describes parent and child relationships without granting permission to edit another component's records, budgets, or tasks. Parent context is explicit rather than ambient.
- This skill owns record-specific structure, diagram meaning, and navigation. [Designing Mermaid diagrams](../designing-mermaid-diagrams/SKILL.md) owns reusable Mermaid mechanics, view selection, functional framing, labels, readability, and technical-detail limits.
- Existing scripts may provide deterministic orientation or validation, but they do not own record meaning, task authority, or agent selection. A source-level validator may check declared record structure, navigation, immediate-child scope, and independently supplied rendered-link evidence. The caller supplies the validation root, canonical record set, and root-record identity; the validator must fail closed on unresolved links or contradictory declared scope and must not infer architecture from filesystem shape, node syntax, or task topology.

## Record Model

An `as-is.md` holds stable component context for readers. It contains no active task state, runtime observation, budget, or temporary recovery details. Its title is `# <component-name> - as-is`, using the component's actual name rather than a generic placeholder. Apply the target project's record-placement and history conventions rather than imposing a file or section placement rule. Prefer a table for stable repeated facts and a list for short homogeneous rules; rewrite long prose when either form improves scanning without losing authority.

| Section | Applicability | Durable content |
| --- | --- | --- |
| `## Purpose` | Required | Why the component exists and the responsibility it owns. |
| `## Components` | Only for immediate documented children | Direct child `as-is.md#design` links and concise child purposes; no grandchildren. |
| `## Design` | Required | A concise orientation, one resolving lineage line, stable composition and responsibility facts, and one or more applicable diagrams. |
| `### <diagram name>` | One per Mermaid diagram | A descriptive heading naming the view, followed by the Mermaid fence it introduces. |
| `## Relationships` | When direction or dependency matters | Parent, peer, dependency, authority, or collaboration facts not already clear in Design. |
| `## Links` | When distinct direct working context is needed beyond nearby navigation; otherwise omit | Resolving repository-relative links needed to understand or operate within the component; omit duplicate navigation, changelogs, and other historical-summary artifacts. |

A parent component has one or more immediate child components with their own `as-is.md` records. Its Design starts with a structural container view of the actual parent and only those children. Every record has at least one reader-oriented diagram: a parent uses its structural container view, while a non-parent uses the smallest supported view of its own responsibility, interaction, boundary, lifecycle, or outcome. A one-node placeholder and a heatmap are not acceptable substitutes. Put ownership and authority limits in Design or Relationships rather than creating another top-level section.

Links are direct, resolving repository-relative context needed to understand or operate within the component or its immediate children that is not already supplied by the `**Lineage**: ` line or required Markdown fallback. A `Components` table is the required Markdown fallback for each immediate child target rendered as a linked structural-container node and the sole Markdown catalog of those immediate children; the intentional diagram-link and Markdown-fallback pair is not a duplicated `## Links` catalog. Do not repeat a child target or ordinary direct-child contracts in `## Links` merely as a catalog. A child-owned artifact may remain linked only when it adds distinct parent-level operational or normative context, and its reason states that distinction. A Mermaid-only target still needs the host-required Markdown fallback. Link normative protocols and reader-facing operational documentation when they materially support that work. Source and test files are omitted by default; link one only when it is a stable reader-facing operational interface or its exact behavior is indispensable to understand or operate the component and no existing prose or documentation provides equivalent context. Do not link changelogs, task narratives, backlogs, runtime artifacts, or host projections merely as historical summaries; a link never duplicates the authority of its target. Omit `## Links` when no qualifying direct context exists; never retain an empty Links section or add a placeholder statement.

## Diagram And Navigation Model

- Structural and temporal views answer different reader questions. A structural container view represents stable ownership and immediate children; a flow, sequence, state, decision, recovery, data, context, or journey view represents a separately scoped consequential behavior.
- Every Design contains one or more diagrams. Introduce each Mermaid fence with a descriptive `### <diagram name>` heading that names the view for navigation, such as `### Local delegation rehearsal`; do not use a literal `### Relevant diagrams` heading or a separate caption line. A record with several views uses one named subsection per view.
- Every Design has one resolving trimmed root-to-current lineage line prefixed exactly
with `**Lineage**: `. It links each documented ancestor from the repository root
through the immediate parent in order, omits filesystem levels without a
canonical record, and ends with the current component title in bold. A root
record uses only `**Lineage**: **as-is**` and never a self-link. Place the lineage
line immediately before the first named diagram subsection; when no diagram
follows, place it before the remaining Design content. It is Markdown
navigation, never a synthetic diagram node or edge.
- A view includes only the purpose, actors or users, immediate responsibilities, relationships, interactions, boundaries, authority changes, consequential paths, and outcomes needed for its stated reader question. Routine standard behavior remains abstract unless an exception changes interpretation.
- Use tables for stable repeated ownership, relationship, status, or comparison facts and lists for short responsibilities, constraints, assumptions, or rules. Prefer these forms over long Design prose when they reduce interpretation cost; retain prose for rationale and relationships that a table or list would obscure.
- A structural container is a box-oriented Mermaid `flowchart` whose subgraph title is the actual parent component. Child components are nested labeled boxes whose names target their `as-is.md#design` sections using the host-supported link syntax; the corresponding `Components` table is the sole Markdown catalog and required renderer fallback for those immediate children. Containment is nesting, not a synthetic parent node or a `contains` edge. The first structural-container view may contain only the actual parent container and its declared immediate-child nodes; every linked child target must resolve to a canonical record and appear once in both the diagram and the Components table.
- Parent child boxes are balanced relationship-map elements rather than an implied top-to-bottom runtime sequence. Explicit sibling arrows have supported labels, connect only declared immediate-child nodes, and remain readable; lightweight styling is used only when it improves scanability.
- The relationship vocabulary is `provides`, `uses`, `calls`, `delegates-to`, `publishes`, `subscribes-to`, `reads`, `writes`, `validates`, `observes`, `authorizes`, and `connects-to`. Labels describe the stated relationship but do not by themselves prove chronology, ownership, authority, deployment, or implementation detail. Abstract capability labels are preferred by default. Concrete provider identity must be disclosed when it materially changes trust, security, ownership, deployment, cost, compliance, availability, performance, or recovery interpretation.

Use a table for stable repeated relationships and a list for short responsibilities, constraints, or assumptions. Rewrite long prose into those forms when they improve scanning; retain prose only for rationale or relationships that would lose meaning in a table or list.
- Before a Mermaid fence is written, decide whether rendering materially affects
  the reader question or an acceptance condition. For a critical or
  host-constrained view, record the pre-render layout plan in the owning task,
  setup plan, review artifact, or other working context. Do not put renderer
  status, layout plans, or residual rendering risk in `as-is.md`: the canonical
  record contains only the agreed record structure and durable component
  meaning. A supplementary view uses the smallest supported diagram and
  source-level check without a plan unless its host explicitly requires one.
- Diagram layout follows the generic Mermaid skill: prefer a taller, narrower ELK/TB flowchart when it improves readability, while preserving a supported exception where host rendering or stated diagram meaning requires it. Keep labels short or insert explicit `<br/>` breaks at natural phrase boundaries when labels would otherwise overflow; validate every discovered diagram with the smallest available source-level check and render batch when a local renderer is configured.
- Authoritative prose and links define durable purpose, boundaries, relationships, and decisions. A diagram communicates the selected architecture view and neither contradicts the prose nor invents an unapproved relationship. Component tables provide required Markdown fallback for linked structural-container children when a renderer suppresses diagram navigation; this intentional pair is not duplicated in `## Links`, which also does not catalog ordinary direct-child contracts. Markdown links remain the fallback for any separately linked diagram target; do not repeat a fallback target in `## Links` unless it adds distinct working context. Source-level validation and browser-rendered SVG validation are separate evidence: the former checks declared records and links, while the latter may check only the caller-supplied diagram source and expected hrefs when a local renderer is configured.

The [diagram examples](diagram-examples.md) start with the structural-container example for parent containment, sibling relationships, `**Lineage**: ` navigation, and renderer fallback, then illustrate separately scoped non-container views. These references occur with the rules they support; a trailing Links catalog in this procedure would duplicate that context and is intentionally omitted.

## Flow View Rules

Use these as-is-specific rules to choose and interpret a view without treating diagram syntax as architecture authority.

- **Structural views** answer stable ownership, containment, immediate composition, and sibling responsibility questions. A parent structural container shows the actual parent and documented immediate children; its balanced relationship-map arrows express supported sibling relationships, not runtime order.
- **Temporal views** answer one bounded consequential behavior, such as a request, handoff, transformation, lifecycle, decision, recovery, or actor experience. They show only the actors, responsibilities, boundaries, transitions, and outcomes needed for that question.
- **Durable flow threshold:** retain a key or complex flow when it crosses a component or authority boundary, changes a consequential outcome, exposes a material alternate or rejected path, or requires failure, recovery, retry, escalation, compensation, or cancellation to understand the design. Keep routine standard behavior abstract in prose or omit the flow view when it adds no interpretation value; do not turn ordinary implementation steps into durable architecture.
- **Balanced versus progression layout:** use a balanced relationship map for structural containers and context maps whose purpose is comparison or neighborhood, with no implied chronology. Use a progression layout for scenario or sequence, data, state, decision, recovery, and actor-journey views when order, transition, guarded outcome, repair, or experience stage is part of the stated meaning. Apply the pre-render layout plan before choosing the direction.
- **Direction semantics:** diagram direction communicates only the selected view's declared meaning. Structural placement and sibling-arrow orientation do not prove sequence; temporal arrows, state transitions, data paths, guarded branches, recovery handoffs, and journey stages may express order or progression when the view states that they do.
- **Failure and recovery disclosure:** show a non-routine failure or recovery path when it changes ownership, authority, state, outcome, or reader action. Keep routine transport or implementation failures abstract, and record omitted detail or residual risk in prose rather than adding exhaustive error paths.
- **Authority and divergence:** authoritative prose, record links, and approved component boundaries define the architecture. A diagram is a bounded reader-oriented view; it must not invent a relationship, expose a hidden provider, or override prose. If a diagram and authoritative context diverge, treat the record as stale or blocked and resolve the evidence rather than inferring a new architecture from the drawing.

## Example Structure

The optional Components, Relationships, and Links sections appear below to show their placement. Leaf records omit Components, and any section without durable content is omitted rather than replaced by filler.

`````markdown
# <component-name> - as-is

## Purpose

<Stable responsibility and reader outcome.>

## Components

| Component | Purpose |
| --- | --- |
| [`<immediate child>`](<child-path>/as-is.md#design) | <Child responsibility.> |

## Design

<One-sentence orientation.>

**Lineage**: [as-is](<root-relative-path>/as-is.md#design) / [<parent component>](<parent-relative-path>/as-is.md#design) / **<component-name>**

### Structural container

```mermaid
---
config:
  layout: elk
---
flowchart TB
    subgraph <component-name>["<component-name>"]
        direction TB
        CHILD["<a href='<child-path>/as-is.md#design'><immediate child></a>"]
    end
```

<Stable composition, responsibility, and consequential design facts.>

## Relationships

<Only material parent, peer, dependency, or authority relationships.>

## Links

- `<distinct direct working context>` → `<repository-relative-path>` — <Why this context matters beyond nearby navigation.>
`````

## Creation, Alignment, And Replacement Model

| Situation | Record treatment |
| --- | --- |
| Approved component boundary without an `as-is.md` | An initial record contains supported durable purpose, design, relationships, and direct context. Component identification and approval remain owned by the approved adoption/setup flow, not by this skill. A child record contains only its own context and `**Lineage**: ` line; applicable parent maps and container views remain parent-owned. |
| Implementation evidence changes reader-relevant context | Alignment is semantic rather than file-by-file. It covers purpose, boundary, immediate composition, material relationship or authority, and consequential lifecycle, failure, or recovery behavior; private helpers, generated artifacts, routine control flow, and non-material refactoring detail remain outside the record. |
| Record and implementation conflict | Implementation is evidence rather than automatic record authority. An intended or approved behavior change makes the record stale; unexpected implementation divergence remains an implementation or escalation concern; unresolved ambiguity leaves the record unchanged. |
| Material reorganization with unchanged component identity and boundary | In-place revision is the default. A controlled replacement is justified only when incremental revision cannot retain coherent purpose, structure, or navigation and preservation needs have been assessed. |
| Changed component identity or boundary | The change is a migration or retirement decision rather than ordinary alignment; its owner, consumers, direct-link disposition, recovery or audit value, and replacement path require explicit resolution before relocation or removal. |

## Hierarchical Record Reconciliation

Use this optional application mode when an approved bounded set of canonical records must be aligned from leaves toward parents. It coordinates record meaning; it is not a task executor, component-discovery procedure, or agent workflow.

### Inputs And Preconditions

A caller establishes a host-approved reconciliation boundary and explicit exclusions, a declared canonical record graph and direct-child relationships, a stable evidence baseline appropriate to the target project, applicable target-project instructions and owner boundaries, and a final immediate-child record for each child. Stop when the graph, baseline, ownership, direct-child relationship, finality, or allowed evidence is ambiguous.

### Ordered Reconciliation

1. Build bounded context for the graph, baseline, exclusions, and applicable authority.
2. Each component owner aligns only its own record through this individual-record procedure.
3. Admit a parent only when all immediate-child records are final for the same baseline and no unresolved child issue materially changes parent meaning.
4. Reconcile the parent from only its own applicable evidence and the final immediate-child records.
5. Do not use child source, tests, task narratives, transcripts, runtime artifacts, or grandchildren as parent semantic inputs.
6. Apply the target project's selected validation and retain a target-project-defined reconciliation handoff with the baseline, final-record references, outcome, blockers, validation, residual risk, and recovery point.
7. If a child record, direct-child relationship, or baseline changes, re-evaluate the lowest affected parent and then its affected ancestors.

### Outputs And Limits

The output is a bounded set of owner-revised records or explicit blockers. It does not require a task record, task-tree topology, task lifecycle, scheduling, budgets, commits, changelogs, a particular filename, section placement, retention rule, agent selection, or an external effect. Context-building and verification procedures may be composed where needed; task and component-building procedures remain optional target-project composition rather than prerequisites.

## Applying The Model

1. Before a durable revision is treated as complete, its bounded reader problem, owning record, applicable instructions, direct links, sibling vocabulary, implementation evidence when alignment is in scope, acceptance conditions, assumptions, contradictions, and recovery path are explicit.
2. Supported durable facts reside in their named section: composition in Design, material parent, peer, or dependency direction in Relationships, and deferred limitations in a linked follow-up. Linked material remains reference context rather than inherited instructions or authority.
3. The applicable creation, alignment, or replacement treatment is limited to affected sections and views. Component labels align with the target parent's established sibling vocabulary unless semantic evidence supports a documented departure; child records do not expose hidden providers or distant descendants, and a parent mediates external and sibling connections.
4. Completion requires heading and authority separation, the agreed record shape,
  the target project's record-placement and history conventions, resolving
  changed links, one `**Lineage**: ` line, omission of `## Links` when no
  qualifying distinct context exists, no duplicated child navigation or
  ordinary direct-child contract catalog, no source or test link without the
  stated exception, at least one named diagram subsection where a diagram is
  used, diagram syntax and configured layout support where applicable,
  supported nodes and edges, readable labels without avoidable overflow,
  consistency between diagrams and prose, and the stated acceptance conditions.
  The repository validator's default source-level readability threshold is 28
  visible unwrapped characters per node or edge label; a host may supply a
  stricter threshold when its render surface is narrower. Layout plans belong in working or review
  artifacts only when rendering is material. Assumptions, unknowns, omitted detail, residual risk, and the smallest relevant deterministic checks, including `git diff --check`, are recorded. Unclear ownership, contradictory sources, an unresolved link target, or an unauthorized boundary crossing is a blocker rather than a reason to infer architecture or broaden scope.

## Outputs

- A durable `as-is.md` whose applicable sections provide purpose, design, relationships, and navigable context through an initial record, semantic alignment, or controlled replacement.
- A bounded diagram only where the view materially reduces interpretation
  cost, with prose and links remaining authoritative. A layout plan is a
  working or review artifact only when rendering is material.