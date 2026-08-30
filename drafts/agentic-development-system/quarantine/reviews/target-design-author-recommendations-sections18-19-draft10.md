# Target-design author recommendations for Sections 18 and 19

Purpose: Recommend cognitively manageable treatments for Sections 18 and 19 and make human cognitive limitations an explicit target-design principle without adopting the draft or authorizing implementation.

## Direct recommendation

Adopt a design-wide human-cognitive-load principle: every human-facing artifact, interaction, decision, and status surface should present the smallest sufficient amount of information needed for the next safe decision or action while preserving traceability to the complete record.

This is a substantive recommendation for a successor to draft 10, not a change to the frozen draft-10 packet. Draft 10 already separates human decisions from operational questions, uses decision briefs, defines detailed implementation packets, and distinguishes current from target state. It does not yet make cognitive-load accommodation a named, design-wide requirement or apply it systematically to documents, planning, status, errors, and tool interactions.

## Section 18 recommendation

Retain Section 18 as a compact author/open-design and admission-blocker register, but add a recommendation-led resolution format. The current question, owner, dependent transition, and blocking scope should remain traceability fields. Add:

- recommended disposition or provisional default;
- reasoning;
- considered alternatives;
- impact of accepting, deferring, or selecting an alternative;
- evidence required to close the item;
- next safe action;
- whether the item changes the accepted envelope.

Each entry should be visibly classified as one of:

1. **Envelope decision** — changes the accepted goal, boundary, authority, protected input, acceptance, risk, or permitted external effect and therefore returns to Human Review.
2. **Admission blocker** — blocks only the dependent transition or affected work until its operational precondition is established.
3. **Deferred implementation detail** — may be resolved later under an explicit safe default, owner, expiry or admission point, and evidence requirement.

Recommended dispositions for the current Section 18 topics:

| Topic | Recommendation | Reasoning and impact |
| --- | --- | --- |
| Accepted-envelope representation | Use a revisioned design package with a manifest, concise decision brief, and linked appendices. | Preserves exact provenance while keeping the human from reconstructing the review unit from scattered files. Blocks envelope acceptance only if the representation cannot identify what is being accepted. |
| Child plan-injection representation | Use a structured, durable child-planned section or equivalent artifact linked to the parent plan and accepted-envelope revision. Include outcome, scope, dependencies, protected inputs, validation, recovery, escalation, and integration instructions. | Makes child admission machine-checkable and human-readable without changing the child’s current-state authority. Blocks only affected child launch until represented. |
| Impacted-child identification | Require parent planning output listing all and only impacted immediate children, with rationale and source references. | Prevents omitted work and accidental sibling expansion. If completeness is not established, affected child launch blocks; unrelated independent work may continue. |
| Child-to-parent integration | Use a scope-preserving, recoverable, conflict-detecting mechanism owned by the child, with serialization or rejection of conflicting integrations. | Preserves the corrected ownership model and avoids treating parent accounting as semantic approval. Blocks affected integration until the mechanism is admitted. |
| Legacy-consumer discovery | Require a consumer inventory and migration ledger before deprecation, replacement, rename, or drop. | Prevents silent breakage. Blocks only affected migration work, not necessarily the whole target envelope. |
| Isolation requirements | Use risk-tiered controls and label each protection as prompt-guided, audited, or enforced. | Prevents unsupported isolation claims. High-risk work blocks without enforced or explicitly accepted controls; low-risk work need not inherit unnecessary friction. |
| Distribution and lifecycle promises | Defer broad distribution, upgrade, downgrade, and uninstall commitments until setup-inclusive evidence exists. | Avoids overclaiming. The first slice should claim only repository-local consumption and proven behavior. |

The Section 18 main view should show recommendation, impact, owner, blocker scope, and next safe action first. Detailed rationale and evidence may follow or be placed in an appendix.

## Section 19 recommendation

Replace the current exhaustive question catalogue with a phased provisional-contract map. Retain the underlying questions as traceability or implementation worksheets, but make the main section answer:

- what must be true before a transition;
- who establishes it;
- what minimum contract is provisionally recommended;
- what evidence closes it;
- what remains deliberately provisional;
- what happens if it cannot be established.

Use no more than three dependency-ordered bundles:

### 1. Design identity and change control

Recommended provisional baseline:

- immutable design/envelope revision identity plus a manifest of exact files;
- explicit states for current, draft target, human-reviewed, accepted, superseded, and realized behavior;
- attributable human decision linked to the exact accepted revision;
- links from component hierarchy and implementation packets to the accepted envelope;
- Human Review reopens only for changes to goal, boundary, authority, protected input, acceptance, risk, or permitted external effect; editorial or envelope-preserving changes remain traceable revisions without silently changing acceptance.

Impact: provides a stable basis for later admission without forcing field-level storage decisions during Human Review. The detailed schema remains provisional.

### 2. Child realization control

Recommended provisional baseline:

- parent planner reads its own record and injects child-specific plans;
- a separate parent-level verification/admission control checks completeness and envelope traceability;
- a fresh child-scoped `component-builder` is admitted from the child’s own record;
- the child owns implementation, child-level verification, and scope-preserving integration;
- child reports identify result, validation, integration, deviations, unresolved questions, and recovery state;
- parent closure accounting uses structured child status without semantic revalidation or integration approval.

Impact: gives the corrected parent/child model actionable predicates while preserving the distinction between parent planning and verification. Detailed field names and adapter mechanics remain implementation discovery.

### 3. Operational safeguards and lifecycle evidence

Recommended provisional baseline:

- feedback is classified as clarification, defect, design change, or new request;
- tool admission combines role, task, host, and project restrictions and fails closed;
- acceptance maps to deterministic, semantic, specialist, or human evidence;
- escalation packets identify issue, affected scope, evidence, options, recommendation, impact, decision owner, stop/continue state, and next safe action;
- evaluation identifies seed, baseline, candidate, settings, rubric, scorer, and protected fixtures;
- isolation claims state whether controls are prompt-guided, audited, or enforced;
- failures distinguish missing dependency, validation failure, safety-critical failure, and infrastructure failure.

Impact: provides a usable minimum for near-autonomous operation while avoiding premature commitment to every record field, UI detail, or host adapter.

Questions requiring later evidence should be subordinate to these baselines, grouped by transition, owner, and admission predicate. They should not appear as equally urgent questions for the human.

## Human cognitive-limit principle

The design philosophy should explicitly recognize limited working memory, attention, time, interruption recovery, and ability to inspect technical detail. It should also account for predictable interpretation errors: confusing current and proposed state, treating process exit or telemetry as completion, missing hidden blockers, and confusing recommendation with authorization.

Every Markdown document should begin with:

```markdown
# Descriptive title

Purpose: One succinct sentence explaining why this document exists and what decision or action it supports.
```

This convention applies to target designs, manifests, implementation packets, component records, handoffs, reports, and other human-facing Markdown where the repository’s ownership and format permit it. It is a presentation and discoverability rule, not authority by itself.

Apply the principle throughout the target design:

- **Documents:** Put status, scope, authority, and next action immediately after the Purpose line where applicable. Use stable headings and status vocabulary. Put recommendation and material consequence before detail; use appendices or linked immutable evidence for depth.
- **Decisions:** Present recommendation, reasoning, options, impacts, residual risk, and the exact decision needed. Group decisions by consequence. Do not require a human to extract a recommendation from a long questionnaire.
- **Planning packets:** Begin with outcome, non-goals, scope, protected inputs, stop conditions, validation, escalation recipient, and next safe action in a predictable order. State what the implementer must not do.
- **Status and errors:** State what happened, affected scope, active/blocked/stopped/failed/complete state, supporting evidence, safe next action, prohibited action, and next decision owner. Do not use bare “pending,” “failed,” or “done” labels as the complete explanation.
- **Tool interactions:** Record or show intended effect, target scope, authority basis, reversibility, and limits before consequential use. Use stronger confirmation or enforcement for destructive, credential-bearing, high-risk, or externally effective operations. Keep routine bounded operations low-friction. Summarize results and exceptions by default while preserving expandable evidence.
- **Failures and interruption:** Surface concise cause, affected scope, preserved state, and next safe action. Do not require a human to diagnose from raw logs or model output.
- **Evaluation:** Treat decision clarity, human effort, interruption recovery, and error comprehension as workflow-quality measures, without allowing subjective convenience to become completion authority.

## Options considered

| Option | Reasoning | Impact | Recommendation |
| --- | --- | --- | --- |
| Title plus Purpose only | Low migration cost and immediate consistency. | Does not address decision overload, status ambiguity, or tool behavior. | Insufficient alone. |
| Document-and-packet convention | Adds progressive disclosure, decision briefs, structured packets, and status/error templates. | Moderate authoring and migration effort; substantially improves planning and review. | Minimum target baseline. |
| System-wide cognitive-load contract | Applies the principle to documents, workflow, status, errors, tools, admission, recovery, and evaluation. | Highest design and validation effort, but best fit for near-autonomous use; requires behavioral checks. | Preferred direction, introduced incrementally through bounded pilots. |
| Configurable presentation profiles | Offers concise, standard, and detailed views for different users. | Adds configuration complexity and can create inconsistent interpretations. | Defer until the standard presentation is proven; vary detail, never authority or status semantics. |

## Consistency fixes for a successor

- Add the cognitive-load principle to the design philosophy or quality-attributes section.
- Add the title/Purpose convention to the document-package and artifact sections.
- Recast Sections 18 and 19 as recommendation-led resolution registers.
- Define shared status vocabulary and distinguish current authority, target proposal, accepted target, and realized behavior.
- Keep “parent-level verification control” separate from parent-planner responsibilities in all sections, including the final summary.
- Add concise recommendation/impact/next-action fields to implementation packets, child handoffs, escalation packets, and status surfaces.
- Keep options and recommendations separate from authorization language.

## Trade-offs and residual risks

Progressive disclosure can hide important detail if summaries omit a material scope, authority, or risk change. Require immutable links and make blockers, deviations, residual risks, and external effects visible rather than silently collapsible.

Provisional defaults can become de facto contracts. Label them provisional, identify their owner and expiry or admission gate, and require explicit evidence before dependent work.

A concise Section 19 requires a separately maintained detailed contract worksheet or schema once implementation begins. That is preferable to overloading the human-review artifact only if the detailed record retains exact revision linkage.

Human-centered presentation does not establish authorization, isolation, or correctness. Deterministic admission, protected controls, validation, recovery, and escalation remain necessary.

Human needs vary. The standard presentation should be predictable and low-load before configurable views are considered; configuration must never alter authority or status semantics.

**Recommendation, not authorization:** Use this memo as the author’s recommendation for a successor target-design revision. Preserve draft 10 unchanged unless the design owner creates a new revision, manifest, digest, and bounded review record. `startsWork: false`.
