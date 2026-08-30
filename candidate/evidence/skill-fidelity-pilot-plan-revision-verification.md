# Skill-Fidelity Pilot Plan — Revision Verification Record (stage: apply review corrections)

Implementer-run verification chain after applying the consolidated correction set
(commits 72df810, 4c29e03, 3c7fc80). The internal reviewer (planning-adviser,
openai/gpt-5.6-sol) and external-adviser (moonshotai/kimi-k3) were each invoked by
the implementer through the governed launcher; the human relayed nothing.

## Stage flow

1. Internal review (planning-adviser): **FAIL** on the corrected-on-disk plan text
   with 4 required corrections (weaker-tool vs weaker-method attribution at line 113;
   skills-only scope must be classified as a pilot/user departure from line 974;
   reconcile execution authority with draft lines 15 and 18; workflow-example
   citation lines 164-166/176).
2. Implementer applied all 4 corrections (commit 3c7fc80) and passed the internal
   verdict text inline to the external-adviser for independent challenge.
3. External challenge (external-adviser): **PASS** on the corrected plan text,
   overturning the internal FAIL while confirming it was correct for the
   pre-correction text. All 12 fidelity gates and all 3 plan-verification
   criteria PASS with independent draft-line evidence.

## Internal verdict (planning-adviser, pre-correction text)

## Verification result: **FAIL**

I read both `designs/agentic-development-system-skill-fidelity-pilot-plan.md` and `drafts/composable-skills.md` directly.

I evaluated the twelve fidelity checks in plan §6 as the requested gates. These judgments assess whether the **planned protocol** is faithful; they do not claim that future skill artifacts have passed.

| Gate | Result | Exact draft evidence and finding |
|---|---|---|
| 1. Clause coverage | **PASS** | The plan targets the complete contract lines: `applying-bounded-edits` Purpose/Approach/How at draft lines **354, 356, 358**, and `choosing-change-methods` at **669, 671, 673**. |
| 2. Exact skill name | **PASS** | The headings are exactly `applying-bounded-edits` at line **352** and `choosing-change-methods` at line **667**. |
| 3. Description semantics | **PASS** | Lines **354** and **669** provide the respective purposes. Line **107** says: “Skill descriptions would establish fit, not permission.” The planned check preserves that boundary. |
| 4. No invented steps or authority | **FAIL** | The plan turns line **113** into a prohibition on “weaker-method substitution.” Line **113** instead says admission to a **master skill or composition** requires the selected path’s tools and prohibits silently substituting “a weaker **tool**.” The standalone contract at line **673** says to verify tools and permissions, choose the least-powerful fitting method, and stop when no method is authorized. “Weaker tool” and “different/weaker method” are not equivalent. |
| 5. Stop conditions | **PASS** | Line **358** says to “stop if the target, owner, or transformation is ambiguous.” Line **673** says to “stop when no method is authorized.” The plan preserves both as terminal stops. |
| 6. Least-powerful method | **PASS** | Line **673** explicitly requires: “choose the least powerful fitting method.” |
| 7. Consumer inspection | **PASS** | Line **358** orders “inspect consumers and nearby context” before “use a precise replacement.” The design view confirms this at lines **368-370**: target → inspect → edit → review. |
| 8. Size criterion | **PASS** | Line **132** says a reusable skill “may target at most 2,000 characters when that is enough” and that final enforcement requires an adoption decision. The plan correctly labels 2,000 characters as a voluntary pilot criterion rather than a draft mandate. |
| 9. Per-skill isolation | **PASS** | This is correctly identified as a pilot validation decision. It strengthens the independent-usability requirement at line **88**, which defines reusable skills as “independently usable procedures with one primary capability.” |
| 10. Behavioral scenarios | **FAIL** | The ordinary success and stop scenarios map to lines **358** and **673**. The missing-capability scenario does not: it requires no “weaker-method substitution,” while line **113** prohibits weaker-**tool** substitution in master/composition admission. The scenario should stop when the selected path lacks capability or when no fitting method is authorized, without ruling out another independently fitting and authorized method. |
| 11. Side-by-side evidence | **PASS** | Clause-level comparison is a suitable way to produce the “validation” evidence required separately for each candidate by line **88**. |
| 12. Design-view fidelity | **PASS** | The exact blocks are lines **362-371** for `applying-bounded-edits` and **677-686** for `choosing-change-methods`. The planned structural comparison covers nodes, edges, and labels. |

## Plan-verification criteria from §7.1

| Criterion | Result | Finding |
|---|---|---|
| Scope fidelity | **FAIL** | Draft line **974** identifies the next decision as a pilot adding “one general master workflow and a small set of reusable skills” and validating component and non-component changes separately. The plan excludes every master skill. A narrower skills-only experiment is possible, but it must be explicitly classified as a pilot/user departure from line 974. Draft line **90** merely describes master skills and says the candidate list is not an adoption decision; it does **not** support declaring masters out of scope. |
| Authority mapping accuracy | **FAIL** | Draft line **15** says a draft is not approved design, task authority, or implementation authority; line **18** says the task record is the “Current task authority for the bounded implementation.” The plan instead says recorded user acceptance alone supplies execution authority, without reconciling task-record applicability or the draft-to-approved-design transition. There is also a citation error: the first `making-changes` fenced example is lines **164-166**; line **176** is prose stating that existing authorities remain authoritative, not a code fence. |
| Stop-condition preservation | **PASS** | The ambiguity stop at line **358** and no-authorized-method stop at line **673** are preserved. The failure is the added method-substitution interpretation, not loss of the original stops. |

## Required corrections before this plan passes

1. Replace every “weaker-method substitution” attribution to line 113 with the exact weaker-**tool** and selected-path rule; revise scenario 10(c) accordingly.
2. Either:
   - add the general master workflow and component/non-component validation contemplated by line 974, or
   - explicitly classify the skills-only scope as a pilot/user departure from line 974 rather than deriving master exclusion from line 90.
3. Reconcile execution authority with draft lines 15 and 18: distinguish user approval of the pilot from the applicable active task authority.
4. Correct the workflow-example citation to lines 164-176, particularly lines 164-166 for the first fenced example.

No repository files were modified.

## External verdict (external-adviser, on corrected text)

## Independent challenge — verdict on the corrected plan

I read both files directly (draft lines independently counted from raw reads; plan read in full) and also read `handoffs/agentic-development-system-continuity-checklist.md`, which the plan cites but the planning-adviser never checked. My verdict below is on the corrected plan text (the state the implementer's note attributes to commit 3c7fc80). I cannot inspect the commit itself (read-only), but I verified the corrected text on disk contains all four corrections.

### Per-gate verdicts (my own line evidence)

| Gate | Result | My evidence |
|---|---|---|
| 1. Clause coverage | PASS | `applying-bounded-edits`: Purpose = line 354, Approach = 356, How = 358. `choosing-change-methods`: Purpose = 669, Approach = 671, How = 673. My count confirms all six citations exactly. |
| 2. Exact skill name | PASS | Headings at 352 and 667 match the planned directory/front-matter names exactly. |
| 3. Description semantics | PASS | "Skill descriptions would establish fit, not permission" is the final sentence of line 107; plan check 3 enforces it and grants no tools. |
| 4. No invented steps/authority | PASS (corrected) | Line 113 verbatim: "it must not silently substitute a weaker tool, broaden permissions, or ask a read-only agent to perform mutation" — a selected-path **tool** rule for master/composition admission. The corrected plan (§5.2, "Line 113, exact rule" row) now states exactly this and no longer attributes a "weaker-method" rule to 113. The pre-correction FAIL was accurate; it is resolved. |
| 5. Stop conditions | PASS | Line 358 ends "stop if the target, owner, or transformation is ambiguous"; line 673 ends "stop when no method is authorized". Plan check 5 carries both as terminal stops. |
| 6. Least-powerful method | PASS | Line 673: "choose the least powerful fitting method" — plan carries it as rule, not preference (§5.2). |
| 7. Consumer inspection | PASS | Line 358 orders "inspect consumers and nearby context" before "use a precise replacement"; design view lines 368–370 (`Target → Inspect → Edit → Review`) confirm. Plan's line-370 reading ("no labeled edge") is correct — `Edit --> Review["Collateral-change review"]` is a node label only. |
| 8. Size criterion | PASS | Line 132: "may target at most 2,000 characters when that is enough" and "The final unit, limit, enforcement point, and exceptions require an adoption decision and must not be implemented from this draft alone." Plan's "voluntary pilot criterion" framing is exact. |
| 9. Per-skill isolation | PASS | Line 88 requires "separate evidence for its structure, owner, name, independent consumer, and validation". Isolation supports the validation element; the plan's claim limitation correctly concedes owner/consumer evidence is *not* produced. |
| 10. Behavioral scenarios | PASS (corrected) | Scenario 10(c) now stops with a bounded missing-capability blocker, forbids weaker-**tool** substitution, and explicitly does not preclude another independently fitting and authorized method — consistent with 113 (tool rule) and 673 (selection/stop rule). |
| 11. Side-by-side evidence | PASS | Per-skill clause mapping satisfies line 88's "separate evidence … validation" requirement as far as a candidate pilot can. |
| 12. Design-view fidelity | PASS | `applying-bounded-edits` block = lines 362–371; `choosing-change-methods` block = lines 677–686 (fence closes at 686). Plan §5.2's node list matches lines 683–685 verbatim. |

### Plan-verification criteria (§7.1)

| Criterion | Result | Finding |
|---|---|---|
| Scope fidelity | PASS (corrected) | Line 974 verbatim: "a bounded pilot that adds one general master workflow and a small set of reusable skills … validating component and non-component changes separately." The corrected plan now classifies master exclusion as "a deliberate pilot/user departure from line 974, not a derivation from line 90" (§1 scope note, §9). That is the required honest classification. |
| Authority mapping | PASS (corrected) | Line 15 (Draft row): "not approved design, task authority, or implementation authority"; line 18 (Task record row): "Current task authority for the bounded implementation". Corrected §1 now distinguishes user acceptance (authorizes the pilot) from the applicable task record (per-pass authority, line 18). Citation fix verified: first fenced example = lines 164–166 (164 opens the fence, 165 is `making-changes = …`, 166 closes); line 176 is the prose "Existing task, backlog, changelog, delegation, and commit authorities remain authoritative". My count matches. |
| Stop-condition preservation | PASS | As gate 5. |

### Overall: **PASS** — I overturn the FAIL for the corrected plan, while confirming the FAIL was correct for the pre-correction text.

### Independent observations the planning-adviser missed

1. **Scenario 10(c) is over-attributed to line 113.** The strongest draft ground for a missing-capability stop in a *standalone* skill is line 673 itself ("verify required tools and permissions"); line 113 governs master/composition admission only. The corrected plan half-acknowledges this ("a composition-admission rule") but still hangs the scenario on 113. Not a fail — check 4 forces per-step draft-line mapping and human adjudication — but grounding 10(c) primarily in 673 with 113 as analog would be tighter.
2. **Master exclusion has an additional, uncited justification.** Checklist §5 mandates "Master compositions are realized only after their referenced reusable skills … have independently passed verification." The skills-only pilot is therefore not merely a user departure from line 974; it is also the process-required predecessor step. Citing this would strengthen the scope note; the omission is conservative, not a fidelity error.
3. **Handoffs cross-references check out.** Checklist §6 does name the `implementer` transient agent (z-ai/glm-5.3-flash, full tool set) under `candidate/agents/`; §3 does condition benchmark re-establishment on re-aligned implementation. The plan's citations to §§3–7 are accurate. Note §7 records an *earlier* FAIL round with its own correction set, and the checklist item "Apply the consolidated correction set" was still unchecked — the orchestrator should confirm that prior correction set is fully subsumed by the current plan before closing that item.
4. **Nit:** the header note cited as "lines 2–3" is text on line 3 alone (line 2 is blank); consistent with the plan's span convention elsewhere ("5–7" for Purpose), immaterial.
5. **Residual risk:** all semantic fidelity checks (1, 3, 4, 10, 11) ultimately rest on human review of side-by-side evidence; there is no automated oracle. That is disclosed in §6 and appropriate, but the acceptance gate's strength depends entirely on that review actually happening clause-by-clause against the cited draft lines, not on the checklist being checked.

## Consolidated disposition

Both reviewers' verdicts, taken against the plan text each reviewed, are consistent:
the corrections were required and, once applied, both pass. Remaining findings are
explicitly minor/advisory (external observations 1-5: re-ground scenario 10(c)
primarily in line 673 with line 113 as analog; cite checklist section 5 as additional
master-exclusion justification; confirm the prior correction set is subsumed; line
2-3 span nit; human-review-dependent semantic checks). None block user acceptance.
