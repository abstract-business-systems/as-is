# Target-design author recommendations for human language and planning discovery

Purpose: Record the author's bounded, read-only response on understandable technical language, anchor-scoped scanning, and nearest-common-ancestor planning.

## Status and authority

This memo is advisory design work. It does not approve draft 10, adopt target contracts, create backlog items or tasks, authorize kick-off, or authorize implementation. Current `as-is.md` records remain current-architecture authority. The described scan, backlog, and implementation flow is proposed target behavior only.

`startsWork: false`

## Direct recommendation

I agree with the human's clarifications and recommend that a successor revision:

1. permit technical names and jargon when they improve precision or traceability, but require an understandable explanation wherever the reader needs the term;
2. limit planning-stage discovery for an existing-item change to the relevant `as-is.md` anchors and relevant files literally linked from those anchors, rather than making a project-wide scan the default;
3. create a backlog item in the nearest common ancestor when planning discovers an affected component outside the declared hierarchy, then continue from that ancestor's planning flow;
4. preserve the other recommendations: `as-is.md` anchors, one parent bounded task including child work, child-owned implementation and integration, scoped migration safeguards, risk-tiered safety, deferred distribution promises, and Section 19's provisional-contract map.

## Understandable technical language

Technical names and jargon may be used. They must not be the only explanation when the human needs to understand a decision, risk, limitation, or next action.

Recommended rule:

> Human-facing explanations may use established names, technical terms, and jargon when those terms improve precision or traceability. A term must not be left unexplained when a reader needs it to understand the decision, risk, limitation, or next action. On first use, explain the term in ordinary language or provide a concise plain-language gloss. Lead with the practical meaning, consequence, and next safe action; place exact identifiers and deeper technical detail afterward for traceability.

For example, `as-is.md`, `component-builder`, “plan injection,” “isolation,” and “nearest common ancestor” may remain useful terms, provided the human-facing agent explains what each means and why it matters. The goal is not to remove technical vocabulary; it is to prevent technical vocabulary from replacing understanding.

## Planning-stage scan for changes to existing items

When planning a rename, replacement, deprecation, removal, or behavior change:

1. Identify the affected component, agent, skill, workflow, record, or behavior.
2. Read the relevant component's current `as-is.md`.
3. Follow and inspect the relevant files literally linked from that anchor.
4. Follow additional literal links only when they are relevant to the bounded change and within the declared planning scope.
5. Record affected users or dependents, migration obligations, owner, evidence needed, recovery path, and removal gate.
6. Stop when the relevant anchors and relevant literal links have been inspected, each discovered dependency has a disposition, and no newly inspected relevant file introduces another in-scope literal link that has not been followed.

A project-wide scan is not the default. The result must be described as a bounded inventory under the anchor-and-link scope, not as proof that no other user exists.

The scan should expand or stop with a recorded blocker only when a specific reason makes the limited scope inadequate, such as:

- the relevant `as-is.md` is missing, stale, contradictory, or not authoritative;
- a relevant literal link is broken or ambiguous;
- a known user exists outside the anchor graph;
- the change affects a shared invariant, public interface, setup path, or safety boundary;
- generated, dynamic, or configuration-driven users cannot be identified through literal links;
- the change has no reversible migration or recovery path; or
- planning discovers an affected component whose ownership is not represented in the hierarchy.

Any expansion must record its reason, added scope, stopping condition, and result. Silent escalation to a project-wide scan is not preferred.

## `as-is.md` anchor semantics

Each component's `as-is.md` is the canonical design-package anchor for that component. It establishes the component's current-state identity, purpose, boundary, authority, and applicable current links.

Prototypes, target designs, references, plans, implementation packets, validation evidence, handoffs, migration records, and related artifacts link to the applicable `as-is.md` anchor and identify their relationship to it. They may propose, plan, realize, validate, or explain change, but do not replace or silently amend the anchor. A change to current-state authority follows the component's applicable record-change process.

A linked artifact should identify the component, anchor path, relevant heading or section where practical, revision or digest when frozen, and relationship type such as current-state, target, plan, realization, evidence, or migration. A parent artifact links to the parent anchor and to every affected child anchor. Cross-component work identifies all affected anchors and the nearest common ancestor that owns planning.

## Out-of-hierarchy discovery and nearest-common-ancestor planning

This discovery occurs during the planning stage.

An affected component is out of hierarchy when the accepted outcome requires work from it but the declared component hierarchy does not give it the appropriate parent, does not list it, or represents the relevant boundary inconsistently.

When planning discovers one:

1. Record the component identity, its `as-is.md` anchor, why it is affected, the hierarchy gap, and the evidence for the finding.
2. Identify the smallest declared ancestor that contains the affected known components or boundaries: the nearest common ancestor.
3. Create a backlog item owned by that ancestor's planning flow. The backlog item records the discovered component, anchor, reason it is affected, hierarchy gap, dependencies, and required design decision.
4. Do not launch the component directly from the discovering child or silently assign it to an unrelated parent.
5. The nearest common ancestor plans the backlog item and resolves or escalates the hierarchy and ownership question.
6. If the issue changes an accepted boundary, authority allocation, acceptance condition, protected concern, or other material envelope element, return to Interactive Design / Prototyping and, when material, Human Review.
7. Once scope and ownership are authorized within the applicable process, the ancestor continues the normal parent flow and records child-specific plans in affected child records.
8. Fresh child-scoped component-builders implement, verify, and integrate their assigned results. The ancestor accounts for all dispositions without taking over child verification or integration.

Creating the backlog item is part of planning. It is not implementation authorization. The parent bounded task may include parent-owned work and impacted child work, potentially performed by different agents, but all of that work remains part of one parent outcome and completion accounting.

## Options and impact

### Scan scope

- **Anchor-scoped and literal-link scanning with a recorded expansion rule — recommended.** Reduces noise and planning cost while preserving the component's declared design relationships. Risk: undocumented or external users may be missed; the result must remain explicitly bounded.
- **Project-wide scan for every change.** May find more undocumented references, but adds cost, noise, delay, and false confidence. Not recommended as the default.
- **No scan unless implementation fails.** Finds breakage late and can invalidate completed planning. Not recommended.

### Out-of-hierarchy handling

- **Nearest-common-ancestor backlog during planning — recommended.** Preserves ownership and allows the parent to coordinate the required change. Impact: adds a planning checkpoint but prevents a child from silently expanding its authority.
- **Let the discovering child implement directly.** Faster in the short term, but obscures ownership and can create boundary conflicts. Not recommended.
- **Create a root-level backlog item for every finding.** Easy to locate but loses the nearest responsible context and can overload the root. Not recommended unless no common ancestor can be identified.
- **Stop all project work until hierarchy is repaired.** Strong containment but unnecessarily blocks independent work. Use only when the ambiguity affects shared authority, safety, or the accepted outcome broadly.

## Confirmation of other recommendations

- Keep the three Section 18 topics as plain-language, scoped safeguards: affected-user checks before retirement or replacement; risk-based safeguards against touching the wrong things; and no broad installation or lifecycle promises without evidence.
- Keep Section 19 as a provisional-contract map, not an adopted contract or a list of questions the human must answer individually.
- Keep child plan injection inside one parent bounded task, even when multiple agents perform subtasks.
- Keep child implementation, child-level verification, and child-owned integration within the child boundary.
- Keep the separate parent-level plan-injection admission/verification control distinct from parent planning and from semantic review of child results.
- Keep progressive disclosure, explicit current-versus-target labels, recommendation-first presentation, and title-plus-succinct-`Purpose:` formatting for human-facing Markdown.

## Remaining risks

Anchor-scoped scanning can miss an undocumented, external, generated, dynamic, or stale relationship. The expansion triggers and bounded-result wording must remain visible. A nearest-common-ancestor backlog can still be wrong if the hierarchy itself is incomplete; the planner must escalate when no defensible ancestor exists or when the issue changes the accepted envelope. Technical terms explained too late can still burden the human; human-facing agents should lead with practical meaning and consequence. None of these presentation or planning rules proves correctness, isolation, authorization, or completeness.

**Recommendation, not authorization:** Preserve draft 10 unchanged unless the design owner creates a successor revision with a new manifest, digest, and bounded review. No backlog item, task, kick-off, or implementation should be created from this memo alone.
