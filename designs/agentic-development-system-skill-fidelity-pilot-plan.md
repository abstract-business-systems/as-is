# Agentic Development System — Skill-Fidelity Pilot Plan

## 1. Purpose, authority, and execution

This plan defines a bounded pilot that realizes exactly two reusable skills from the composable-skills draft as agent-readable `SKILL.md` procedure documents and tests each one against the draft contract for fidelity. The pilot runs entirely in the isolated `candidate/` namespace: it does not change the live skill catalog, any agent, `core/`, or any `as-is.md` record.

- **Fidelity source**: `drafts/composable-skills.md` is the sole design and fidelity authority for what the two skills must contain. It is not implementation or task authority: the draft states at lines 2-3 that it does not authorize implementation or create task authority, the design-state model at lines 15 and 18 makes a task record the current task authority for a bounded implementation, and lines 972-974 confirm the draft is not task authority or an implementation plan.
- **Execution authority**: recorded user acceptance of this verified plan authorizes the pilot itself; the per-skill implementation passes then run under an applicable active task record as the current task authority (draft line 18). **User acceptance is pending.** No acceptance is inferred from reviews, transcripts, or agent reports.
- **Scope note (pilot/user decision)**: draft line 974 contemplates a bounded pilot adding one general master workflow and a small set of reusable skills, validating component and non-component changes separately. This pilot deliberately narrows that to two reusable skills only, with no master skill, as a fidelity test of the draft-to-realization process. That narrower scope is a pilot/user decision requiring user acceptance, not a draft-derived fact: line 90 describes master skills without excluding them, so the exclusion of master skills is recorded here as a deliberate pilot departure from line 974, not a draft-derived fact.
- **Executing role**: the implementer transient agent (`candidate/agents/implementer/agent.md`, per the transient roster in `handoffs/agentic-development-system-continuity-checklist.md` section 6) executes the pilot under that recorded acceptance, inside `candidate/`, with all evidence candidate-local.
- **Claim limitation**: completion claims from this pilot are limited to candidate fidelity (the realized documents match the draft contracts). This pilot produces no repository-skill promotion and does not satisfy draft line 88's full promotion evidence set (structure, owner, name, independent consumer, validation); owner and independent-consumer evidence remain for a later adoption decision.
- **Reversal history**: this pilot is the successor to the previously reversed candidate realization (24 TypeScript skill stubs and 77/77 tests, commit `c647a35`), which was removed as unfaithful to its source design. This pilot differs deliberately: it produces procedure documents faithful to the draft contracts, not synthetic stubs; treats the draft as fidelity source with authority held by recorded user acceptance; keeps evidence candidate-local; includes behavioral scenario walk-throughs; and defers any benchmark protocol.

## 2. Source authority map

Pilot items that trace to the draft trace to `drafts/composable-skills.md` (referred to below as "the draft"). No design source outside `drafts/` is consulted as design context. Items in section 4 marked "pilot decision" are not draft-derived.

| Pilot item | Draft source (exact location) |
| --- | --- |
| Draft-only framing; no promotion, implementation authorization, or task authority | Lines 2-3 (header note), 5-7 (Purpose), 972-974 (Status and next decision) |
| Two levels of skill; reusable skill requires separate evidence for structure, owner, name, independent consumer, and validation | Lines 86-88 |
| Composition context for `making-changes` (component-based and non-component variants; preference order, not mandatory activation) | Lines 98-104 |
| "Fit, not permission" (skill descriptions establish fit, not permission) | Line 107 |
| Tool-access rule (a skill does not grant tools; missing capability stops the workflow) | Lines 111-129, especially line 113; test cases at line 128 |
| Size planning target: a reusable skill may target at most 2,000 characters when that is enough; final enforcement requires an adoption decision | Line 132 |
| `writing-code` vs `applying-bounded-edits` separation | Line 148 |
| Master workflow examples (composition context only; master skills themselves out of scope) | Lines 162-176, especially the first fenced example at lines 164-166; line 176 is the prose note that existing authorities remain authoritative |
| `applying-bounded-edits` contract (Purpose 354, Approach 356, How 358, Design view 362-371) | Lines 352-371 |
| `choosing-change-methods` contract (Purpose 669, Approach 671, How 673, Design view 675-686 with the Mermaid fence closing at 686) | Lines 667-686 |
| Design constraints (composition does not transfer authority; smallest applicable scope; explicit validation path) | Lines 947-955 |
| Reserved for later (metadata, registries, dependency schemas, automated compatibility, wholesale replacement) | Lines 957-970 |
| Draft status: proposal, not live catalog or implementation plan | Lines 972-974 |

Items deliberately **not** sourced from the draft (pilot or user decisions, flagged per the process-gate rule that unsourced items are flagged, not presented as draft-derived): the `candidate/skills/reusable/<name>/SKILL.md` paths; single-file realization; two-field YAML front matter; the prohibition of additional sections and TypeScript stubs; the validation script/checklist and side-by-side evidence formats; the isolation mechanics; the evidence destination; and the review/acceptance gates (section 7). These come from the recorded process requirements in `handoffs/agentic-development-system-continuity-checklist.md` sections 4-7 and pilot decisions.

The draft does not define a benchmark protocol; the benchmark is out of scope per section 9 and, per the continuity checklist section 3, is re-established only after re-aligned implementation exists.

## 3. Scope

The pilot implements exactly two reusable skills, each independently usable with one primary capability (draft lines 86-88):

1. `applying-bounded-edits` — per draft lines 352-371.
2. `choosing-change-methods` — per draft lines 667-686.

Each skill is implemented and tested independently: during the fidelity test of one skill, the other skill's files are absent from the test fixture (section 6, isolation), so no skill can satisfy its contract by referencing or depending on the other. No other reusable skill, and no master skill, is implemented. The two skills are chosen because they are composition-adjacent (both appear in the `making-changes` variants, draft lines 98-104) yet have fully independent contracts stated in the draft, making them a clean fidelity test of the draft-to-realization process.

## 4. Artifact form (pilot decisions)

The following form factors are **pilot decisions**, chosen to satisfy the draft's contract-fidelity requirements within the candidate namespace; they are not draft-derived requirements:

- Path: `candidate/skills/reusable/<name>/SKILL.md` (that is, `candidate/skills/reusable/applying-bounded-edits/SKILL.md` and `candidate/skills/reusable/choosing-change-methods/SKILL.md`); one file per skill; no TypeScript stubs, runtime code, or tool registration.
- YAML front matter with exactly two fields:
  - `name`: the exact skill name (`applying-bounded-edits` / `choosing-change-methods`).
  - `description`: a one-line description derived from the draft's Purpose line. This is the only front-matter field with a draft-derived semantic constraint: per draft line 107 ("Skill descriptions would establish fit, not permission"), the description establishes fit and must not grant tools or authority; the fidelity test checks the description wording against the skill's Purpose line (draft line 354 / 669) rather than accepting free text.
- Body: the draft contract sections carried as the procedure — `Purpose`, `Approach`, `How it should be done`, and the `Design view` with the draft's Mermaid block — carried by pointer per section 5, with no additional sections.

## 5. Per-skill realization (authoritative pointers, not restatements)

The draft contracts are authoritative as written; the plan does not restate them. Each realized `SKILL.md` carries the draft's contract sections, and the fidelity test diffs the realization against the cited draft lines. Only the fidelity-sensitive interpretations below are recorded.

### 5.1 `applying-bounded-edits`

- Contract authority: draft lines 352-371 — Purpose (354), Approach (356), How it should be done (358), Design view (Mermaid block, 362-371).
- Realization: front matter per section 4; body carries the draft's Purpose, Approach, and How-it-should-be-done text and reproduces the Design view Mermaid block.

Interpretation table (fidelity-sensitive points only):

| Draft source | Interpretation carried into the realization |
| --- | --- |
| Line 358, stop clause | "stop if the target, owner, or transformation is ambiguous" is a terminal stop-for-direction step, not an advisory note or fallback; any post-stop request for direction is a separate action outside the procedure. |
| Line 358, ordering | The consumer/nearby-context inspection precedes the replacement step. |
| Line 370 | `Collateral-change review` is the label of the `Review` **node** (`Edit --> Review["Collateral-change review"]`); there is no labeled edge. |
| Line 148 | The body states that this skill makes surgical changes to existing artifacts and does not cover new or substantially generated implementation (`writing-code` is a separate capability). |

### 5.2 `choosing-change-methods`

- Contract authority: draft lines 667-686 — Purpose (669), Approach (671), How it should be done (673), Design view (Mermaid block, 677-685, closing fence at 686).
- Realization: front matter per section 4; body carries the draft's Purpose, Approach, and How-it-should-be-done text and reproduces the Design view Mermaid block (nodes `Request["Requested transformation"]`, `Classify["Change type and risk"]`, `Method["Least powerful fitting method"]`, `Gate["Tool and authority gate"]`).

Interpretation table (fidelity-sensitive points only):

| Draft source | Interpretation carried into the realization |
| --- | --- |
| Line 673, stop clause | "stop when no method is authorized" is a terminal stop, not an advisory note or fallback. |
| Line 673, least-powerful rule | "choose the least powerful fitting method" is the selection criterion, not a preference. |
| Line 673, tool/permission verification | Observes the draft tool-access rule at line 113 (a skill does not grant tools; missing capability stops the workflow) without defining any tool-access matrix, which is out of scope per section 9. The line 113 rule is a composition-admission rule; the skill-level stop at line 673 remains the skill's own terminal stop. |
| Line 113, exact rule | Line 113 governs admission to a master skill or composition: the agent must have every tool needed for its selected path, or the workflow stops with a bounded missing-capability blocker, and it must not silently substitute a weaker **tool**. This is a weaker-tool rule about the selected path's tools, not a rule about choosing a different method; the skill-level stop at line 673 governs the case where no method is authorized. |
| Lines 100-101, 165 | The skill may note that a master composition selects between `writing-code` and `applying-bounded-edits` after this skill classifies the change; it must not implement, reference, or depend on the other candidate skill's files (per section 3 isolation). |

## 6. Fidelity-test protocol (completion gate)

A skill passes fidelity only when all checks below pass. Testing is per skill and isolated (section 3). The protocol uses static document checks, human-reviewable side-by-side evidence, and bounded behavioral scenario walk-throughs; there is no automated semantic-equivalence oracle, so semantic judgment is human-reviewed through the side-by-side evidence.

1. **Clause-coverage check**: enumerate every contract clause from the draft's Purpose, Approach, and How-it-should-be-done lines for the skill (applying-bounded-edits: lines 354, 356, 358; choosing-change-methods: lines 669, 671, 673) and verify each clause is represented in the realized `SKILL.md` body with its meaning and stop/mandatory semantics intact. Verbatim wording is preferred; any paraphrase is reviewed by a human against the side-by-side evidence (check 9), not by script.
2. **Exact skill name**: the front-matter `name` equals the draft heading name exactly; the directory name matches.
3. **Description semantic check**: the front-matter `description` is derived from the draft Purpose line (354 / 669) and establishes fit, not permission (draft line 107); it grants no tools or authority.
4. **No invented steps or authority claims**: the check flags body steps, gates, or authority claims not traceable to the draft contract lines (plus the explicitly authorized composition-context notes from draft lines 148 and 100-104 and the tool-rule acknowledgment from line 113). Each realized step must map to a draft line; untraceable additions are flagged by the check and adjudicated by human review.
5. **Stop conditions preserved**: the ambiguity stop (line 358) and the no-authorized-method stop (line 673) each appear as terminal stop-for-direction steps.
6. **Least-powerful-fitting-method rule**: present in `choosing-change-methods` as the selection rule (line 673).
7. **Consumer-inspection step**: present in `applying-bounded-edits` before any edit (line 358).
8. **Size check (pilot criterion)**: the realized `SKILL.md` is recorded against the draft's planning target of at most 2,000 characters (line 132). Line 132 says a reusable skill *may target* at most 2,000 characters *when that is enough*, and that final enforcement requires an adoption decision; the 2,000-character gate is therefore a voluntary pilot criterion, not a draft mandate, and the actual character count is recorded either way.
9. **Per-skill test isolation (recorded reproducible method)**: the fidelity check for each skill runs with the other skill's directory absent from the test fixture. The isolation method is recorded and reproducible — per-skill testing occurs in an ephemeral fixture copy under `candidate/` (or the skill is tested before the other exists), not by mutating a shared working tree — and the file listing at test time is recorded as evidence.
10. **Behavioral scenario walk-throughs**: for each skill, a small set of scripted scenarios (2-3 per skill) is walked through by an agent following only the candidate skill document, in an isolated candidate fixture, and evaluated against the draft contract:
    - `applying-bounded-edits`: (a) a successful bounded edit that performs consumer inspection before mutation and a focused diff review and checks; (b) an ambiguous target, owner, or transformation scenario that stops before mutation.
    - `choosing-change-methods`: (a) an authorized selection that applies the least-powerful-fitting-method criterion; (b) a no-authorized-method scenario that stops under the line 673 terminal stop; (c) a missing-capability scenario in which the selected path lacks a required tool, so the workflow stops with a bounded missing-capability blocker and does not silently substitute a weaker tool (draft line 113) — without precluding another independently fitting and authorized method, which line 673 would then select.
    Scenario fixtures, scripts, and results remain inside `candidate/` and are recorded per section 8.
11. **Human-reviewable side-by-side diff evidence**: for each skill, produce a side-by-side document mapping each draft contract line to the corresponding realized `SKILL.md` section with exact line references on both sides (left: draft lines; right: realized procedure lines), so a human can review clause-by-clause fidelity without reading tool output.
12. **Design-view check**: the Mermaid design view is reproduced structurally (nodes, edges, labels) from the draft's `#### Design view` block for the skill.

The protocol is executed per skill by a small validation script or checklist; results (including character counts, the clause-coverage list, isolation listings, and scenario walk-through outcomes) are recorded per section 8.

## 7. Process gates

1. **Plan verification (internal)**: this plan is reviewed by the planning-adviser for scope fidelity, authority mapping accuracy, and stop-condition preservation.
2. **Independent challenge (external)**: the planning-adviser's findings are submitted to the external-adviser for independent challenge.
3. **Consolidated verification to user**: the implementer consolidates both reviews into a single verification summary and presents it to the user before any implementation artifact is created.
4. **Recorded user acceptance before implementation**: implementation of either skill begins only after the user's acceptance of the verified plan is recorded (per section 8). No acceptance is inferred from reviews, transcripts, or agent reports. Until then, user acceptance is pending and no implementation artifact is created.
5. **Independent implementation and testing per skill**: each skill is implemented and fidelity-tested in its own bounded pass with the other skill's files absent from the fixture (section 3); a failure in one skill's test does not block or contaminate the other's record.

## 8. Evidence recording (candidate-local)

All pilot artifacts, fixtures, validation scripts, comparisons, and evidence are recorded under `candidate/` (for example, `candidate/evidence/`), keeping the pilot inside the candidate boundary:

- plan verification findings (planning-adviser) and external-adviser challenge results, with the consolidated summary;
- the recorded user acceptance event (date and scope accepted) preceding implementation;
- per-skill fidelity results: clause-coverage list, stop-condition checks, name check, description check, character count against the 2,000-character pilot target, isolation evidence (file listing at test time), and behavioral scenario walk-through results;
- side-by-side diff evidence location for each skill;
- residual risk and any deviations from this plan.

The handoff checklist `handoffs/agentic-development-system-continuity-checklist.md` only records the verification event and pointers to the candidate-local evidence; it does not hold the evidence itself.

## 9. Out of scope

The following are explicitly excluded from this pilot:

- Master skills, including `making-changes` and all composition definitions (the "Proposed master skills" section from draft lines 688 onward). Excluding them is a deliberate pilot/user departure from the line 974 pilot description (one general master workflow plus reusable skills), not a derivation from line 90.
- Tool-access matrices and admission testing for compositions (draft lines 111-129); the pilot only preserves the rule that a skill does not grant tools (line 113) inside the `choosing-change-methods` body.
- Any change to agents, agent front matter, permissions, or runtime admission (draft line 128 explicitly defers these).
- Any change to the live skill catalog, `core/`, or `as-is.md` records.
- The benchmark protocol: not present in the draft and explicitly conditional — it is re-established only after re-aligned implementation exists (continuity checklist section 3); this pilot does not include or initiate it.
- Any migration or replacement of existing repository skills (draft lines 957-970 reserve wholesale replacement for later; status note at draft lines 972-974).
- Machine-readable skill metadata, registries, and dependency schemas (draft lines 957-970).
