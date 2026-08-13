# Architecture Vocabulary

## Purpose

This document defines the shared architecture vocabulary used by the current repository's `as-is` records, reusable skills, agent roles, and normative documentation. It describes this system's own terms and distinctions; it is not a target-project contract, a component registry, a task authority, or a runtime configuration source.

## Scope And Authority

The definitions in this document provide shared meaning for terms that cross document or skill boundaries. Canonical `as-is.md` records remain authoritative for the actual component identities, parent and child graph, boundaries, purposes, designs, and material relationships. Skill `SKILL.md` files remain authoritative for reusable procedures and stay target-neutral. The [component task-record protocol](component-task-record-protocol.md) remains authoritative for component and task-record boundaries; backlog and task records remain authoritative for planning and active task state.

A component record may use a term from this vocabulary only when its local evidence supports that meaning. A local record may explain an exception without redefining the shared term. When a definition and a local architectural fact appear to conflict, preserve the definition here and resolve the local record or evidence rather than inferring a new architecture from terminology alone.

## Component And Record Terms

### Component

A component is a bounded responsibility-bearing unit with a canonical `as-is.md` record. The record provides durable context for readers and does not grant permission to edit another component's files, records, task state, or backlog.

### Component boundary

A component boundary is the directory containing the component's `as-is.md`, together with descendants that do not contain their own `as-is.md`. A child directory with its own record is a separate component boundary. An explicitly bounded setup target may define a temporary discovery boundary, but it does not silently change the repository's canonical component graph.

### Canonical record

A canonical record is the `as-is.md` owned by a component. It is the authoritative human context for that component's durable purpose, design, relationships, boundary, and navigational context. It does not replace task records, backlog entries, configuration, or runtime state.

### Parent, immediate child, descendant, and sibling

A parent is a component whose record documents one or more immediate child components. An immediate child is a directly documented child of that parent and is the only child level represented in the parent's Components table and structural container view. A descendant is any component below the parent at a deeper level. Siblings are immediate children of the same parent; sibling status does not imply execution order or equal responsibility.

### Structural containment

Structural containment is the parent and immediate-child relationship represented by the record hierarchy, Components table, and nested structural diagram boxes. It is not a synthetic `contains` relationship arrow. Ordinary directory nesting without a canonical child record is not by itself a component relationship.

### Owner and authority

An owner is the role or component responsible for maintaining an artifact within its boundary. Authority is the source that determines a fact, rule, decision, or state for its subject. Ownership does not make every artifact an authority for related components, and a diagram, implementation detail, task narrative, or runtime observation does not override the authoritative source for architecture.

### Evidence

Evidence is an observable implementation, test, configuration, runtime, or documented fact used to understand or revise a record. Evidence informs architectural context but does not automatically rewrite the canonical record or authorize a boundary change. Contradictory or insufficient evidence is a blocker to inference, not permission to broaden scope.

## Relationship Labels

Use the narrowest label that expresses a material relationship. Labels describe the stated relationship; they do not by themselves prove chronology, ownership, authority, deployment, or implementation detail.

| Label | Use when | Do not infer |
| --- | --- | --- |
| `provides` | One component makes a capability, contract, data, or service available to another. | That the provider owns every consumer or controls its execution order. |
| `uses` | One component relies on a capability or contract supplied by another without a more specific interaction being needed. | A direct call, runtime sequence, or reciprocal dependency. |
| `calls` | One component directly invokes or requests an operation from another. | That the caller owns, authorizes, or contains the target. |
| `delegates-to` | One component transfers a bounded responsibility, attempt, or decision to another component under an explicit handoff. | That the receiving component loses its own boundary or that delegation is merely a function call. |
| `publishes` | One component makes events, messages, or information available for independent consumers. | That a consumer receives every publication or that delivery is synchronous. |
| `subscribes-to` | One component registers to receive publications from another. | That publication establishes authority or a required execution order. |
| `reads` | One component obtains information from data or a state owned or exposed by another. | That it may modify the source or that the source is its parent. |
| `writes` | One component creates or changes data or state exposed by another. | That the writer owns the data model or is authorized beyond the stated contract. |
| `validates` | One component checks another component's input, output, record, or state against a stated rule. | That validation grants approval, owns the target, or proves complete correctness. |
| `observes` | One component collects or consumes supplementary evidence about another. | That observations are authoritative task state, architecture, or user intent. |
| `authorizes` | One component grants a bounded permission, admission, or state transition to another. | That authorization is equivalent to implementation, invocation, or ownership. |
| `connects-to` | Two components have a material integration whose more specific relationship is not supported by available evidence. | A particular protocol, direction, lifecycle, or dependency that has not been established. |

Containment remains structural rather than an arrow label. Use relationship arrows for supported sibling, peer, dependency, authority, or collaboration facts; omit an arrow when the relationship is not material to the reader's question.

## Linking And Consumers

When a repository document needs shared terminology, link the relevant term anchors instead of copying definitions or linking to the entire document without a reason. Current consumers and their primary vocabulary are listed here for discovery; the linked records remain authoritative for their own subject and local facts.

| Consumer | Relevant vocabulary |
| --- | --- |
| [As-Is Setup](../skills/as-is-setup/as-is.md#design) | [component boundary](#component-boundary), [parent and child terms](#parent-immediate-child-descendant-and-sibling), and [evidence](#evidence) |
| [Integrating As-Is Documentation](../skills/integrate-as-is-documentation/as-is.md#design) | [component boundary](#component-boundary), [structural containment](#structural-containment), and [canonical record](#canonical-record) |
| [Managing As-Is Documents](../skills/managing-as-is-document/as-is.md#design) | [canonical record](#canonical-record), [structural containment](#structural-containment), [authority and evidence](#owner-and-authority), and [relationship labels](#relationship-labels) |
| [Building Components](../skills/building-components/as-is.md#design) | [component boundary](#component-boundary), [owner and authority](#owner-and-authority), and [evidence](#evidence) |
| [Designing Mermaid Diagrams](../skills/designing-mermaid-diagrams/as-is.md#design) | [structural containment](#structural-containment) and [relationship labels](#relationship-labels); generic Mermaid mechanics remain target-neutral |
| [Documentation](as-is.md#design) | [scope and authority](#scope-and-authority) and this document's role as a shared reference |

These links improve discovery without turning the vocabulary into a second component map. Add a new consumer only when it genuinely relies on a shared term and can name the relevant anchor.

## Maintenance Boundary

This document is the smallest current-system home for shared architecture terms. Keep actual component facts in their canonical records, reusable procedures in skills, broad values in [design principles](design-principles.md), and active or planned work in task and backlog records. Reassess the document's boundary before adding machine-readable topology, automated validation, ownership workflows, or a new component group; those concerns require evidence of independent lifecycle and authority rather than a larger glossary by default.
