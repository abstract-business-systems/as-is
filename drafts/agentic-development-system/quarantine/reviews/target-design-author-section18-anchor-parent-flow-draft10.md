# Target-design author recommendations for Section 18 — anchors and parent bounded tasks

Purpose: Record the author's bounded, read-only recommendations for component design-package anchors, parent bounded-task semantics, and the three disputed Section 18 topics.

## Status and authority

This memo is advisory design work. It does not approve draft 10, adopt target contracts, create tasks, authorize kick-off, or authorize implementation. Current `as-is.md` records remain current-architecture authority. The corrected flow below is a proposed target difference from current component-builder records and requires separate acceptance, implementation, and behavioral validation.

## Direct recommendation

Revise Section 18 in a successor packet to make each component's `as-is.md` the canonical anchor for its design package. Treat plan injection as an internal planning step within one parent bounded task, not as a separate flow, lifecycle phase, product task, or human approval. Retain the final three topics as scoped blockers rather than dropping them, with the dispositions below.

Section 19's recommendation-led provisional-contract direction remains sound and should be retained.

## Component design-package anchor

Recommended wording:

> **Component design-package anchor:** Each component's `as-is.md` is the canonical design-package anchor for that component. It establishes the component's current-state identity, boundary, purpose, authority, and applicable current links. Prototypes, target designs, references, plans, implementation packets, validation evidence, handoffs, migration records, and related artifacts must link to the applicable `as-is.md` anchor and identify their relationship to it. Related artifacts may propose, plan, realize, validate, or explain change, but do not replace or silently amend the anchor. A change to the anchor's current-state authority requires the component's applicable record-change process and must not be inferred from a linked proposal or implementation result.

Additional semantics:

- Each component has one authoritative, component-local `as-is.md` anchor.
- Linked artifacts should identify the component, anchor path, relevant heading or section where practical, revision or digest when frozen, and relationship type such as current-state, target, plan, realization, evidence, or migration.
- A parent artifact links to the parent anchor and, for every affected child, to that child's own anchor.
- Cross-component work links every affected component anchor and identifies the nearest common parent as planning owner.
- A child-scoped implementation packet is authoritative only for its admitted bounded task; it derives from the accepted envelope and child anchor and does not redefine either one.

Reasoning and impact: anchoring related artifacts in `as-is.md` prevents prototypes, plans, and implementation results from becoming accidental competing sources of component identity or current-state authority. It improves discoverability and provenance but creates link-maintenance and revision-management obligations.

## Parent bounded-task flow

The parent should own one bounded task whose completion includes both parent-owned implementation and the work of its impacted children, even when different admitted agents perform different subtasks:

1. The parent component builder receives one bounded parent task and reads the parent component's `as-is.md`, accepted envelope, and applicable dependencies.
2. It identifies impacted immediate children, parent-owned implementation work, and required cross-child relationships.
3. It records each child-specific plan in that child's planned section or equivalent child-scoped planning artifact, linked to the parent task, accepted-envelope revision, parent anchor, and child anchor.
4. Plan injection is part of the parent task's single bounded completion. It is not a separate flow, lifecycle phase, product task, or human approval.
5. A separate deterministic parent-level admission/verification control checks plan completeness, traceability, scope, dependencies, protected inputs, and child launch readiness. This control does not verify implementation.
6. Different admitted agents may perform different bounded subtasks: the parent builder may plan parent work; fresh child-scoped `component-builder` instances may implement, verify, and integrate child work; separately admitted roles may perform explicitly assigned evidence or advisory work. Agent multiplicity does not split the parent task-completion boundary.
7. Each fresh child builder reads its own `as-is.md` and injected plan, implements only its assigned child work, performs child-level validation, and integrates its own bounded result through the admitted scope-preserving mechanism.
8. The parent records parent implementation, child reports, integration outcomes, blockers, and terminal dispositions as one bounded task accounting. It does not semantically verify, revalidate, cherry-pick, or approve the child result.
9. Parent completion requires accounting for all parent-owned work and every admitted child disposition—integrated, rejected, cancelled, or escalated—with no hidden blocking dependency. A child failure or blocker prevents parent completion where it affects the accepted outcome.
10. A contradiction, scope change, protected-input conflict, or change to an accepted boundary returns through escalation and, when material, to Interactive Design / Prototyping and Human Review.

This semantics preserves coherent parent completion while keeping child implementation, child verification, and child integration within the child boundary. It also prevents a separate agent boundary from being mistaken for a separate product or lifecycle boundary.

## Section 18 disposition of the final three topics

### Legacy-consumer discovery

**Recommendation:** Retain as an admission blocker for migration and retirement work, not as a universal blocker for the entire envelope.

**Reasoning:** The design proposes deprecations, replacements, renames, and drops. A consumer inventory is necessary to avoid silently breaking current consumers.

**Minimum evidence:** Consumer inventory and migration ledger covering source artifact, current consumers, target replacement, compatibility path, owner, recovery path, evidence, and removal gate.

**Options and impact:**

- **Retain as a scoped blocker — recommended:** Blocks affected migration, deprecation, rename, or drop actions while unrelated design and repository-local proof work continues. Best balance of safety and progress.
- **Make it a whole-envelope blocker:** Stronger compatibility protection, but unnecessarily delays non-retirement design and proof work.
- **Move entirely to migration detail:** Gives it a natural technical home but removes admission visibility.
- **Drop it:** Not recommended; creates silent-breakage risk.

Recommended wording: “Before any deprecation, replacement, rename, or drop is admitted, the migration owner must provide a consumer inventory and migration ledger. Absence blocks only the affected migration or retirement action.”

### Isolation requirements

**Recommendation:** Retain as a risk-tiered task-admission blocker, while placing detailed control design in the relevant safety, host, and task-control sections.

**Reasoning:** Isolation is a safety boundary. The design must not claim production-grade filesystem, network, credential, or untrusted-project isolation when only prompts or worktrees have been tested.

**Minimum evidence:** Task risk classification and an explicit label for each protection as prompt-guided, audited, or enforced.

**Options and impact:**

- **Retain as a risk-tiered blocker — recommended:** High-risk work blocks without enforced controls or an explicit human decision; low-risk repository-local work may proceed with disclosed limitations. Preserves proportionality.
- **Move entirely to technical-control sections:** Improves detail placement but weakens admission visibility.
- **Require enforced isolation for all work:** Strong safety posture, but likely overclaims capability and prevents the first proof.
- **Defer without classification:** Not recommended; leaves safe-to-proceed scope ambiguous.

Recommended wording: “Each admitted task must identify its isolation risk tier and whether controls are prompt-guided, audited, or enforced. High-risk work requires enforced controls or an explicit human decision; prompt guidance alone must not be represented as isolation.”

### Distribution and lifecycle promises

**Recommendation:** Retain as a scoped blocker on distribution commitments and cross-reference setup, migration, and evaluation sections. Defer broad promises until setup-inclusive evidence exists.

**Reasoning:** The current evidence supports a repository-local first proof, not independent package installation, upgrades, downgrades, uninstall, multi-project isolation, or provider portability. Unsupported promises can become implied contracts.

**Minimum evidence:** Setup-inclusive evaluation covering installation or consumption, project-local state separation, compatibility, upgrade/downgrade behavior, uninstall or removal, and recovery.

**Options and impact:**

- **Defer broad promises and state the narrow proven claim — recommended:** Claim only repository-local consumption and tested setup behavior. Enables the first proof without overclaiming.
- **Move entirely to setup/distribution detail:** Correct technical home, but Section 18 should still expose that release commitments remain blocked.
- **Choose a distribution model now:** May simplify planning but risks premature coupling and unsupported lifecycle obligations.
- **Drop it:** Not recommended; consumers may infer unsupported support guarantees.

Recommended wording: “No broad distribution, upgrade, downgrade, uninstall, multi-project isolation, or provider-portability promise is made until setup-inclusive evidence establishes it. The first slice may claim only the repository-local consumption behavior actually demonstrated.”

## Section 19 confirmation

Section 19's direction is sound. Retain it as a phased provisional-contract map rather than an exhaustive human questionnaire. The three bundles remain:

1. design identity and change control;
2. child realization control, including parent planning, plan injection, fresh child admission, child-owned verification, and child-owned integration;
3. operational safeguards and lifecycle evidence, including feedback classification, fail-closed admission, evidence mapping, escalation packets, evaluation identity, and isolation claims.

These remain provisional operational questions, not adopted contracts or individual human decisions. An answer that changes goal, boundary, authority, protected inputs, acceptance, risk, or permitted external effects returns to Human Review.

## Cognitive-load and document consistency

Retain the prior recommendation for a design-wide human-cognitive-load principle: present the smallest sufficient information for the next safe decision or action while preserving traceability. Apply progressive disclosure, explicit current/target/status labels, recommendation and impact before detail, and concise next-safe-action reporting.

Continue recommending that every human-facing Markdown artifact begin, where repository ownership and format permit, with:

```markdown
# Descriptive title

Purpose: One succinct sentence explaining why this document exists and what decision or action it supports.
```

Apply the convention to target designs, manifests, packets, component records, handoffs, reports, and similar artifacts. It is a presentation and discoverability convention, not an authority mechanism.

## Consistency fixes for a successor

- Add the `as-is.md` anchor rule to component hierarchy, design-package, implementation-packet, child-handoff, migration, and authority sections.
- Replace language implying that “the parent verifies” with “a separate parent-level plan-injection verification/admission control verifies.”
- State consistently that plan injection is part of one parent bounded task, even when multiple agents perform subtasks.
- Add anchor links and relationship labels to manifests and derived artifacts.
- Preserve child ownership of implementation, child-level verification, and child-owned integration.
- Ensure conditional follow-on text does not imply that acceptance occurred or implementation may begin.

## Trade-offs and residual risks

The anchor rule improves provenance and prevents competing sources of component identity, but increases maintenance work. Parent-level task completion preserves coherent product semantics, but requires precise child disposition accounting so subtasks do not disappear behind agent boundaries. A separate deterministic parent-level control preserves the planning/verification distinction, but must not be confused with semantic review or human approval.

Scoped blockers reduce unnecessary global delay but depend on accurate impact analysis. Risk-tiered isolation is more realistic than universal enforcement, but weaker prompt-guided and audited controls can be misunderstood. Deferring distribution promises postpones convenience and support guarantees. Progressive disclosure can hide material detail if summaries are incomplete; blockers, deviations, residual risks, and external effects must remain visible with links to full evidence.

**Recommendation, not authorization:** Preserve draft 10 unchanged unless the design owner creates a successor revision with a new manifest, digest, and bounded review. `startsWork: false`.
