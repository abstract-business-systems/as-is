Note: recovered verbatim from the planning-adviser child session stream (read-only role could not write); integrated by the implementer.
I could not write `candidate/evidence/full-flow-plan-internal-review.md` because this planning-adviser role is read-only. No repository files were changed. The following is the review content for the owning implementer to record.

# Full-flow realization plan — internal review

**Plan reviewed:** `designs/agentic-development-system-full-flow-realization-plan.md`  
**Design context:** `drafts/composable-skills.md`; `drafts/agentic-development-system-high-level-design-draft11/target-design.md`  
**Overall verdict:** **FAIL — revision required before external challenge or user acceptance.**

## Per-gate verdicts

| Gate | Verdict | Evidence |
| --- | --- | --- |
| 1. Pointer discipline | **FAIL** | The plan uses aliases and broad ranges rather than attaching an exact draft file-and-line pointer to every design-derived statement (`designs/agentic-development-system-full-flow-realization-plan.md:17-49`). It also restates contracts in the agent, master-composition, and benchmark sections (`:121-128`, `:161-165`, `:173-178`). The reusable-contract authority range is wrong: `:33` ends at skills-draft line 664, omitting `choosing-change-methods` at lines 667-686. The “36 headings” claim at `:51` likewise omits that range. Unflagged realization decisions include creating two additional thin masters at `:165` and replacing the required pinned-`master` baseline with a generic pinned current workflow at `:174`. This conflicts with the pointer-only requirement recorded at `handoffs/agentic-development-system-continuity-checklist.md:32-37`. |
| 2. Scope fidelity | **FAIL** | The 22 rows at plan lines `81-102` correctly match their draft headings and ranges, and the two pilot skills at `:62` correctly point to skills-draft lines 352-371 and 667-686. However, there is no 24-row roster table, and the authority map incorrectly describes the complete reusable range as 182-664 (`:33`). The 12-row master table at `:143-154` matches the twelve draft contracts at skills-draft lines 692-945, but `:165` then realizes `developing-target-designs` and `planning-realization` as two additional masters, making the planned total 14 rather than 12. The section-8 agent dispositions are all represented at `:121-128`, but authority pointers are inaccurate: the parent component-builder is target-design line 314 and the child builder line 316, not lines 313-314 (`:122`); the design/prototyping agent is line 313, not line 314 (`:126`). The treatment of `thinking-companion` at `:127` also substitutes the design prototyper for the consulting skill named by target-design line 373. Benchmark coverage is otherwise substantial (`:171-178`), but `:174` weakens target-design line 663’s explicit pinned-`master` baseline to an unspecified pinned current revision. |
| 3. Terminal stop conditions | **FAIL** | Reusable and master protocols preserve terminal semantics through checks 5 and 10 (`:188`, `:193`, `:197`), which is sound. The plan does not, however, carry equivalent coverage into target-agent verification: `:199` checks only target-design sections 7.1 and 8 with one generic boundary walk-through. It therefore does not require verification of child stops on contradiction, missing dependency, prohibited access, failed validation, or out-of-packet conditions at `target-design.md:541,557`; conflict/out-of-scope stops at `:567`; blocking-question stops and closure prevention at `:599-605`; or no inferred completion, automatic retry, or scope widening at `:611-613`. Sections 10.5 and 10.6 are absent from the source map (`plan:37-47`). |
| 4. Validated pilot process pattern | **FAIL** | The plan correctly requires recorded user acceptance (`:210`), independent bounded passes (`:211`), behavioral evidence (`:193`, `:197`, `:199`, `:212`), candidate-local evidence (`:217-225`), and candidate-fidelity-only claims (`:201`, `:212`). These match the pilot pattern at `designs/agentic-development-system-skill-fidelity-pilot-plan.md:92-108,114-118` and its observed results at `candidate/evidence/skill-fidelity-pilot-execution-record.md:7,16-17,24-25,29`. The gap is agent evidence: `plan:199` specifies a static mapping and one walk-through but no human-reviewable side-by-side document with exact source/artifact lines and no recorded isolation listing. The generic reference at `:212` does not repair the artifact-specific omission in `:199` and `:222`. |
| 5. Staged ordering | **PASS** | The plan explicitly stages verified families before consumers (`:55-60`), requires referenced reusable skills to pass before master realization (`:64`, `:167`), and requires stages 1-3 plus accepted pre-registration before benchmark execution (`:177`, `:213`). This satisfies masters-after-skills and benchmark-after-implementation ordering. The unresolved 12-versus-14 master cardinality is a Gate 2 defect, not an ordering defect. |

## Reusable-skill roster audit

The plan’s 22-row table at `designs/agentic-development-system-full-flow-realization-plan.md:81-102` matches these draft contract spans:

`building-context` 182-202; `resolving-scopes` 204-224; `identifying-owners` 226-245; `locating-changelogs` 247-266; `choosing-names` 268-287; `structuring-content` 289-308; `drafting-content` 310-329; `writing-code` 331-350; `writing-tests` 373-392; `running-tests` 394-413; `validating-changes` 415-434; `recording-evidence` 436-455; `designing-diagrams` 457-476; `rendering-diagrams` 478-497; `inspecting-execution-evidence` 499-518; `assessing-determinism` 520-539; `recording-backlog-items` 541-560; `drafting-changelog-entries` 562-581; `delegating-bounded-work` 583-602; `observing-delegated-work` 604-623; `preparing-scoped-commits` 625-644; `presenting-decisions` 646-664.

The two skills outside that table are correctly identified at plan line 62:

- `applying-bounded-edits`: `drafts/composable-skills.md:352-371`
- `choosing-change-methods`: `drafts/composable-skills.md:667-686`

Thus the aggregate names cover 24 contracts, but the requested 24-row roster table and complete 182-686 authority pointer are absent.

## Required corrections

1. Replace aliases and broad prose summaries with exact `draft-file:line-range` pointers attached to each design-derived plan item; remove contract restatements where a pointer suffices.
2. Provide one 24-row reusable-skill roster, marking the two pilot artifacts as already realized rather than excluding them from the table.
3. Correct the reusable authority span from 182-664 to the actual contract coverage through line 686.
4. Resolve the master cardinality: either keep exactly the twelve composable-skills masters or explicitly seek a user decision for a 14-master scope containing the two target-design-only introductions.
5. Correct target-agent authority pointers and the `thinking-companion` disposition mapping.
6. Restore target-design line 663’s pinned-`master` benchmark baseline.
7. Extend agent verification to target-design sections 10.3-10.6, with explicit terminal-stop scenarios.
8. Require per-agent side-by-side source/artifact evidence and candidate-local isolation evidence, matching the validated pilot pattern.