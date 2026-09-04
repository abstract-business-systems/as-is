# Internal Plan Verification Report

**Overall result: FAIL — revision required before user acceptance or implementation.**

The external challenge was attempted with `call_subagent(role: "external-adviser")`, but the role was unavailable:

> `canonical agent role not found: external-adviser`

Accordingly, this report is **unchallenged internal advice**, not an internal/external consolidated result.

## Gate results

| Gate | Result | Evidence and findings |
| --- | --- | --- |
| 1. Source traceability | **FAIL** | Several citations are accurate, but some ranges are wrong or incomplete, and many pilot mechanics have no draft source. |
| 2. Pointer discipline | **FAIL** | The plan reproduces nearly the full per-skill contracts instead of primarily pointing to them; one design-view restatement is factually wrong. |
| 3. Terminal stop conditions | **PASS** | Both required stops retain explicit terminal semantics. Minor source-strength qualifications remain. |
| 4. Fidelity-test protocol | **FAIL** | Static clause/document checks do not verify agent behavior against the contracts. Isolation, size, and side-by-side evidence are otherwise present. |
| 5. Process gates | **FAIL** | Section 7 has the intended sequence, but section 1 prematurely asserts user approval; external challenge was also not completed. |
| 6. Authority boundary | **FAIL** | Section 8 writes evidence to `handoffs/`, outside `candidate/`, contradicting the candidate-only boundary. The draft is also not implementation authority. |

## 1. Source traceability — FAIL

### Citations verified as accurate

- Draft-only status: `drafts/composable-skills.md:3`, with purpose at line 7.
- Reusable-skill independence and evidence requirements: line 88.
- `making-changes` variants and preference semantics: lines 98–103.
- Tool-access rule: line 113; future access testing and no current runtime change: line 128.
- Planning-only size target: line 132.
- `writing-code` / `applying-bounded-edits` separation: line 148.
- Workflow examples and unchanged authority: lines 162–176.
- `applying-bounded-edits`: lines 352–371, especially contract lines 354, 356, and 358.
- `choosing-change-methods` textual contract: lines 667–673.
- Design constraints: lines 947–955.
- Reserved items: lines 957–970.
- Proposal status: lines 972–974.

### Incorrect or incomplete citations

1. **`choosing-change-methods` range is incomplete.**
   - The plan repeatedly cites lines 667–683 as the complete contract.
   - The design view continues through line 685, with the closing fence at line 686.
   - Specifically:
     - line 683: `Request → Classify`
     - line 684: `Classify → Method`
     - line 685: `Method → Gate`
   - The stated design-view range 677–684 therefore omits the final edge and closing fence. The complete design-view range is lines 675–686, or lines 677–686 for the Mermaid block.

2. **The `applying-bounded-edits` design is misdescribed.**
   - The plan calls `Collateral-change review` a “labeled edge.”
   - At line 370 it is the label of the `Review` node:
     `Edit --> Review["Collateral-change review"]`
   - There is no labeled edge.

3. **“Fit, not permission” cites the wrong line.**
   - The exact statement is at line 107: “Skill descriptions would establish fit, not permission.”
   - Line 113 establishes that a skill does not grant tools and that missing capability blocks a composition.

4. **The source map is not consistently exact.**
   - “Design constraints section near end” should cite lines 947–955.
   - “Final Status and next decision section” should cite lines 972–974.

5. **“Benchmark protocol” has no draft source.**
   - No benchmark protocol appears in the draft.
   - Lines 957–970 support deferral of metadata, registries, dependency schemas, automated compatibility, and wholesale replacement, but not a benchmark protocol.

### Plan items without draft source links

The blanket claim that “Every pilot item traces to the draft” is false. The draft does not specify:

- the `candidate/skills/reusable/<name>/SKILL.md` paths;
- a single-file realization;
- YAML front matter with exactly two fields;
- prohibition of additional sections or TypeScript stubs;
- use of an automated validation script or checklist;
- semantic-equivalence automation;
- side-by-side evidence format;
- making the other candidate directory absent during tests;
- the `handoffs/agentic-development-system-continuity-checklist.md` evidence destination;
- internal/external review roles and acceptance recording mechanics.

Some of these are reasonable pilot procedures supplied by the requested verification criteria, but the plan must identify them as **pilot decisions or user requirements**, not as facts derived from the draft.

Line 88 also requires separate evidence for structure, owner, name, independent consumer, and validation before a candidate becomes a repository skill. The plan covers structure, name, and validation, but identifies neither an owner nor an actual independent consumer. File absence demonstrates isolation, not an independent consumer. This is acceptable only if completion claims remain candidate-pilot claims rather than promotion to repository skill status.

## 2. Pointer discipline — FAIL

Sections 5.1 and 5.2 restate nearly every Purpose, Approach, procedure clause, and design-view element. That creates a second representation of the contracts rather than relying primarily on authoritative pointers to:

- `applying-bounded-edits`: lines 352–371;
- `choosing-change-methods`: lines 667–686.

Most paraphrases preserve meaning, including:

- the complete `applying-bounded-edits` procedure from line 358;
- the complete `choosing-change-methods` procedure from line 673;
- the least-powerful-fitting-method criterion;
- the distinction at line 148.

Flagged semantic or strength issues:

- “Mandatory before any edit” is consistent with line 358’s ordering but is stronger wording than the source uses.
- “Stop-for-direction” preserves terminal stopping, but “for direction” is not stated in line 358 itself.
- Stopping on unresolved tool or permission verification is supported by the composition-level rule at line 113, not solely by the skill contract at line 673.
- The “labeled edge” description is factually inaccurate, as noted above.

The plan should use direct section pointers and include only the fidelity-sensitive interpretations that require emphasis, especially the two terminal stops.

## 3. Stop conditions — PASS

The required terminal semantics are preserved:

- `applying-bounded-edits`: line 358 says to “stop if the target, owner, or transformation is ambiguous.”
- `choosing-change-methods`: line 673 says to “stop when no method is authorized.”

The plan explicitly prohibits treating either as an advisory note or fallback. It also does not permit weaker-method substitution when capability is missing, consistent with line 113.

Recommended precision:

- Retain the exact source wording.
- Treat any subsequent request for direction as a separate post-stop action, not as continuation of the procedure.
- Distinguish the skill-level line 673 stop from the broader composition admission rule at line 113.

## 4. Fidelity-test protocol — FAIL

### Satisfied portions

- **Per-skill isolation:** explicitly required, with the other candidate directory absent.
- **Size evidence:** character count against line 132 is recorded.
- **Human-reviewable comparison:** the proposed left/right clause mapping is suitable if it includes exact draft and realized line references.
- **Stop checks:** both terminal stops are explicitly checked.
- **Design-view comparison:** structural Mermaid comparison is included.
- **No-authority intent:** the plan attempts to reject invented authority claims.

### Blocking defects

1. **No behavioral verification.**
   - The protocol verifies document contents and clause presence, not whether an agent following only the candidate skill behaves according to the contract.
   - “Automated semantic clause coverage” cannot by itself establish procedural behavior.

   At minimum, isolated behavioral scenarios should exercise:

   - `applying-bounded-edits`: successful bounded edit with consumer inspection before mutation, focused diff review and checks, plus ambiguous target/owner/transformation scenarios that stop before mutation.
   - `choosing-change-methods`: authorized selection of the least-powerful fitting method, plus no-authorized-method and missing-capability scenarios that stop without substitution.

2. **Semantic automation is underspecified.**
   - A script cannot reliably determine unchanged meaning, mandatory strength, or invented authority from arbitrary paraphrases without a specified deterministic oracle.
   - Either use exact/normalized source clauses or make semantic review explicitly human-reviewed, supported by the side-by-side evidence.

3. **The size rule is overstated unless identified as pilot policy.**
   - Line 132 says a reusable skill **may target** at most 2,000 characters “when that is enough.”
   - It expressly says final enforcement requires an adoption decision and must not be implemented from the draft alone.
   - A user-approved pilot may voluntarily use 2,000 characters as a gate, but the plan must label it as a pilot criterion rather than a draft mandate.

4. **Isolation mechanics are incomplete.**
   - The plan should specify isolated worktrees or ephemeral candidate fixtures rather than removing one completed candidate from a shared working tree.
   - Tests, fixtures, scripts, and evidence must remain inside the candidate boundary.

## 5. Process gates — FAIL

Section 7 states the intended sequence:

1. internal review;
2. external independent challenge;
3. consolidated report to the user;
4. explicit recorded user acceptance;
5. separate implementation and testing for each skill.

However:

- Section 1 already says, “The user has approved the pilot scope.” No such post-verification acceptance is present in the supplied record, and section 7 says acceptance cannot be inferred.
- The plan assigns consolidation to the implementer, while this verification request assigns the consolidated verification report to the planning adviser after external challenge.
- “Independent implementation and testing” ensures isolation between the two skills, but does not state whether testing is independently reviewed from implementation. If role independence is required, this needs clarification.
- The required external challenge could not be performed because the canonical `external-adviser` role was unavailable.

The plan should say that user acceptance is **pending**, remove the preapproval assertion, assign consolidation consistently, and rerun the external challenge before implementation.

## 6. Authority boundary — FAIL

The candidate-only framing is otherwise clear, but section 8 directly violates it:

- Section 1 says the pilot runs entirely under `candidate/`.
- Section 8 writes all evidence into `handoffs/agentic-development-system-continuity-checklist.md`, outside `candidate/`.

All candidate artifacts, fixtures, validation scripts/checklists, comparisons, and evidence should have candidate-local paths unless a separately authorized owner permits an external record update.

There is also an authority error in section 1:

- Line 3 says the draft does **not** authorize implementation or create task authority.
- Line 974 says it is not task authority or an implementation plan.
- Therefore, `drafts/composable-skills.md` can be the **fidelity/design source**, but not the pilot’s implementation authority.
- Explicit user acceptance or another valid task authority must authorize execution.

The pilot-only limitations on live catalog, agents, `core/`, and `as-is.md` changes are otherwise preserved, consistent with lines 3, 180, 951, 955, and 974.

## Required corrections before acceptance

1. Correct the `choosing-change-methods` ranges to include lines 684–686.
2. Correct the Mermaid description: `Collateral-change review` is a node label, not an edge label.
3. Replace vague section references with exact lines 947–955, 957–970, and 972–974.
4. Cite line 107 for “fit, not permission.”
5. Remove the unsupported benchmark-protocol claim.
6. Label candidate paths, front matter, evidence formats, isolation mechanics, and review gates as pilot/user decisions rather than draft-derived requirements.
7. Replace contract restatements with authoritative pointers and a minimal interpretation table.
8. Add isolated behavioral tests, not only static document checks.
9. Move all evidence and validation artifacts under `candidate/`.
10. Replace “the user has approved” with “user acceptance pending.”
11. State that the draft is the fidelity source, while recorded user acceptance supplies pilot execution authority.
12. Either record owner and independent-consumer evidence or limit completion claims explicitly to candidate fidelity without repository-skill promotion.
13. Rerun the unavailable external-adviser challenge before proceeding.
