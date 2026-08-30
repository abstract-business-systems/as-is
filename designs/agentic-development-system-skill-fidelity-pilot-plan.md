# Agentic Development System — Skill-Fidelity Pilot Plan

## 1. Purpose and authority note

This plan defines a bounded pilot that realizes exactly two reusable skills from the composable-skills draft as agent-readable `SKILL.md` procedure documents and tests each one against the draft contract for fidelity. The pilot runs entirely in the isolated `candidate/` namespace: it does not change the live skill catalog, any agent, `core/`, or any `as-is.md` record. Authority for this plan is `drafts/composable-skills.md` only; the draft states at lines 2-3 that it is planning material that does not promote a skill or create task authority, so this pilot produces candidate artifacts and evidence, not repository adoption. The user has approved the pilot scope; recorded user acceptance (section 7) is the gate before any implementation begins.

## 2. Source authority map

Every pilot item traces to `drafts/composable-skills.md` (referred to below as "the draft"). No design source outside `drafts/` is consulted.

| Pilot item | Draft source (exact location) |
| --- | --- |
| Draft-only framing; no promotion or task authority | Lines 1-7 (header note, lines 2-3; Purpose, lines 5-7) |
| Two levels of skill; reusable skill requires separate evidence for structure, owner, name, independent consumer, and validation | Lines 86-88 |
| Composition context for `making-changes` (component-based and non-component variants; preference order, not mandatory activation) | Lines 98-104 |
| Tool-access rule (a skill does not grant tools; out of scope for the pilot, see section 9) | Lines 111-129, especially line 113 and the test cases at line 128 |
| Size planning target: reusable skill may target at most 2,000 characters; final enforcement requires an adoption decision | Line 132 |
| `writing-code` vs `applying-bounded-edits` separation | Line 148 |
| Master workflow examples (composition context only; master skills themselves out of scope) | Lines 162-176, especially lines 165 and 176 |
| `applying-bounded-edits` contract (Purpose, Approach, How it should be done, Design view) | Lines 352-371, contract body at lines 354-358 |
| `choosing-change-methods` contract (Purpose, Approach, How it should be done, Design view) | Lines 667-683, contract body at lines 669-673 |
| Design constraints (composition does not transfer authority; smallest applicable scope; explicit validation path) | Design constraints section (bulleted constraints near end of draft) |
| Draft status: proposal, not live catalog or implementation plan | Final "Status and next decision" section |

## 3. Scope

The pilot implements exactly two reusable skills, each independently usable with one primary capability (draft lines 86-88):

1. `applying-bounded-edits` — per draft lines 352-371.
2. `choosing-change-methods` — per draft lines 667-683.

Each skill is implemented and tested independently: during the fidelity test of one skill, the other skill's files are absent from the working tree, so no skill can satisfy its contract by referencing or depending on the other. No other reusable skill, and no master skill, is implemented. The two skills are chosen because they are composition-adjacent (both appear in the `making-changes` variants, draft lines 98-104) yet have fully independent contracts stated verbatim in the draft, making them a clean fidelity test of the draft-to-realization process.

## 4. Artifact form

Each realized skill is a single agent-readable procedure document:

- Path: `candidate/skills/reusable/<name>/SKILL.md` (that is, `candidate/skills/reusable/applying-bounded-edits/SKILL.md` and `candidate/skills/reusable/choosing-change-methods/SKILL.md`).
- YAML front matter with exactly two fields:
  - `name`: the exact skill name (`applying-bounded-edits` / `choosing-change-methods`).
  - `description`: a one-line description derived from the draft's Purpose line, establishing fit (not permission, per draft line 113's principle that a skill grants no tools or authority).
- Body: the draft contract sections carried as the procedure — `Purpose`, `Approach`, `How it should be done`, and the design view (`Design view` with the draft's Mermaid `flowchart TB` block).
- No TypeScript skill stubs, no runtime code, no tool registration, no additional sections beyond the front matter and contract body.

## 5. Per-skill implementation steps

### 5.1 `applying-bounded-edits` (draft lines 352-371)

Steps:

1. Create `candidate/skills/reusable/applying-bounded-edits/SKILL.md`.
2. Front matter: `name: applying-bounded-edits`; `description` derived from the draft Purpose (line 354): making surgical changes to existing artifacts.
3. Body — `Purpose`: verbatim draft intent, "Make surgical changes to existing artifacts" (line 354).
4. Body — `Approach`: carry the draft's three-part approach (line 356): inspect consumers and surrounding conventions, make the smallest reversible replacement, and preserve unrelated content and authority.
5. Body — `How it should be done`: carry every draft clause (line 358) as ordered steps: (a) confirm the exact target and literal transformation; (b) inspect consumers and nearby context — this consumer-inspection step is mandatory before any edit; (c) use a precise replacement; (d) review the diff for collateral changes; (e) run focused checks; (f) **stop if the target, owner, or transformation is ambiguous** — this stop condition must appear as an explicit stop, not as an advisory note.
6. Body — `Design view`: reproduce the draft Mermaid `flowchart TB` (lines 362-371): `Target → Inspect → Edit → Review` with the labeled edge `|Collateral-change review|` semantics preserved as node `Review["Collateral-change review"]`.
7. Preserve the writing-code separation (draft line 148): the skill's body must state that it makes surgical changes to existing artifacts and does not cover new or substantially generated implementation (`writing-code` is a separate capability).

Stop conditions preserved: the ambiguity stop from draft line 358 (target, owner, or transformation ambiguous) is a terminal stop-for-direction, not a fallback.

### 5.2 `choosing-change-methods` (draft lines 667-683)

Steps:

1. Create `candidate/skills/reusable/choosing-change-methods/SKILL.md`.
2. Front matter: `name: choosing-change-methods`; `description` derived from the draft Purpose (line 669): selecting appropriate change capabilities for bounded scopes and risks.
3. Body — `Purpose`: verbatim draft intent, "Select appropriate change capabilities for bounded scopes and risks" (line 669).
4. Body — `Approach`: carry the draft's approach (line 671): choose code generation, bounded editing, content work, delegation, or another capability from the requirement, scope, and risk rather than habit.
5. Body — `How it should be done`: carry every draft clause (line 673) as ordered steps: (a) classify the requested transformation as new implementation, surgical edit, content drafting, test work, delegation, or maintenance; (b) verify required tools and permissions (this verification observes the draft tool-access rule at line 113 — a skill does not grant tools — without defining any tool-access matrix, which is out of scope per section 9); (c) **choose the least powerful fitting method** — this rule must appear as the selection criterion, not as a preference; (d) **stop when no method is authorized** — this stop condition must appear as an explicit stop.
6. Body — `Design view`: reproduce the draft Mermaid `flowchart TB` (lines 677-684): `Request → Classify → Method → Gate` with node labels `Change type and risk`, `Least powerful fitting method`, and `Tool and authority gate`.
7. Preserve the composition context (draft lines 100-101, 165): the skill may note that a master composition selects between `writing-code` and `applying-bounded-edits` after this skill classifies the change, but it must not implement, reference, or depend on the `applying-bounded-edits` skill files (per section 3 test isolation).

Stop conditions preserved: the no-authorized-method stop from draft line 673 is terminal; unresolved tool or permission verification stops rather than silently substituting a weaker method (consistent with draft line 113).

## 6. Fidelity-test protocol (completion gate)

A skill passes fidelity only when all checks below pass. Testing is per skill and isolated (section 3): the skill under test is the only candidate skill present.

1. **Clause-coverage check (automated)**: enumerate every contract clause from the draft's Purpose, Approach, and How-it-should-be-done lines for the skill (applying-bounded-edits: lines 354, 356, 358; choosing-change-methods: lines 669, 671, 673) and verify each clause is represented in the realized `SKILL.md` body. Representation means the clause's meaning and its stop/mandatory semantics are present; verbatim wording is preferred but a clause may be phrased as an imperative step if the meaning and strength are unchanged.
2. **Exact skill name**: the front-matter `name` equals the draft heading name exactly; the directory name matches.
3. **No invented steps or authority claims**: the automated check flags body steps, gates, or authority claims not traceable to the draft contract lines (plus the explicitly authorized composition-context notes from draft lines 148 and 100-104 and the tool-rule acknowledgment from line 113). Each realized step must map to a draft line.
4. **Stop conditions preserved**: automated check that the ambiguity stop (line 358) and the no-authorized-method stop (line 673) each appear as terminal stop-for-direction steps.
5. **Least-powerful-fitting-method rule**: present in `choosing-change-methods` as the selection rule (line 673).
6. **Consumer-inspection step**: present in `applying-bounded-edits` before any edit (line 358).
7. **Size check (automated)**: the realized `SKILL.md` is within the draft's planning target of at most 2,000 characters (line 132). This is a pilot planning target, not an enforced repository rule; the pilot records the actual character count.
8. **Per-skill test isolation**: the fidelity check for each skill runs with the other skill's directory absent; the automated check records the file listing at test time as evidence.
9. **Human-reviewable side-by-side diff evidence**: for each skill, produce a side-by-side document mapping each draft contract line to the corresponding realized `SKILL.md` section (left: draft lines; right: realized procedure lines), so a human can review clause-by-clause fidelity without reading tool output.
10. **Design-view check**: the Mermaid design view is reproduced structurally (nodes, edges, labels) from the draft's `#### Design view` block for the skill.

The protocol is documented in a small validation script or checklist executed per skill; results (including character counts and the clause-coverage list) are recorded per section 8.

## 7. Process gates

1. **Plan verification (internal)**: this plan is reviewed by the internal reviewer (planning-adviser) for scope fidelity, authority mapping accuracy, and stop-condition preservation.
2. **Independent challenge (external)**: the planning-adviser's findings are submitted to the external-adviser for independent challenge; the implementer consolidates both reviews into a single verification summary.
3. **Consolidated verification to user**: the consolidated verification is presented to the user before any implementation artifact is created.
4. **Recorded user acceptance before implementation**: implementation of either skill begins only after the user's acceptance of the verified plan is recorded (per section 8). No acceptance is inferred from reviews, transcripts, or agent reports.
5. **Independent implementation and testing per skill**: each skill is implemented and fidelity-tested in its own bounded pass with the other skill's files absent (section 3); a failure in one skill's test does not block or contaminate the other's record.

## 8. Evidence recording

All pilot evidence is recorded in `handoffs/agentic-development-system-continuity-checklist.md`:

- plan verification findings (planning-adviser) and external-adviser challenge results, with the consolidated summary;
- the recorded user acceptance event (date and scope accepted) preceding implementation;
- per-skill fidelity results: clause-coverage list, stop-condition checks, name check, character count against the 2,000-character planning target, and isolation evidence (file listing at test time);
- side-by-side diff evidence location for each skill;
- residual risk and any deviations from this plan.

## 9. Out of scope

The following are explicitly excluded from this pilot:

- Master skills, including `making-changes` and all composition definitions (draft line 90 and the "Proposed master skills" section from draft lines 688 onward).
- Tool-access matrices and admission testing for compositions (draft lines 111-129); the pilot only preserves the rule that a skill does not grant tools (line 113) inside the `choosing-change-methods` body.
- Any change to agents, agent front matter, permissions, or runtime admission (draft line 128 explicitly defers these).
- Any change to the live skill catalog, `core/`, or `as-is.md` records.
- The benchmark protocol and any migration or replacement of existing repository skills (later stages; draft "Reserved for later" section and status note).
- Machine-readable skill metadata, registries, and dependency schemas (draft "Reserved for later" section).
