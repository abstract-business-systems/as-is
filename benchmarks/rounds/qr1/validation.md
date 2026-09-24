[openrouter-session] Ready, base session ID: ephemeral-1788816118985-ddk00fa2aet
[openrouter-session] Using session_id: external-protocol-validation-ephemera
## Bounded validation verdict: **NOT READY**

The draft is a strong candidate for **Gate H1 review to authorize fixture/harness preparation and a provider-free pilot**, but it is **not ready for final human preregistration review / Gate H2**. It correctly states that it is not yet final, but several required frozen artifacts are absent and two material protocol definitions remain ambiguous or internally incomplete.

The deciding items are:

1. **The provider-free pilot has not occurred, and final artifact hashes, fixture, test implementations, sealed oracle, and reference analysis remain pending.**
2. **The replacement-triplet randomization schedule cannot support its stated two-triplet reserve.**
3. **“Scored hard failure” and the pre-mutation adequacy threshold are not operationally defined enough for the primary and secondary decision rules.**
4. **The current-arm component-record/admission input is asserted but not specified or frozen, creating a residual fairness/authority risk.**
5. **All OPEN DECISION items—including provider immutability, repetition count, budget approval, and assessor roster—remain unresolved, which the draft itself makes a Gate H2 blocker.**

These findings do not authorize changes or execution.

---

## 1. Required-amendment coverage

**Interpretation of statuses:** “Satisfies” means the draft contains an enforceable protocol provision covering the amendment. “Partially satisfies” means it has a substantive design but the required frozen artifact, operational detail, or consistency condition is still absent. It does not mean scored execution is authorized.

| # | Required amendment from expert review | Coverage | Draft reference | Validation finding |
|---:|---|---|---|---|
| 1 | Freeze exact fixture, task, public tests, hidden cases, and reference design/scope analysis. | **Partially satisfies** | §§6–7, §§12–14, §27, §28 | The fixture semantics, task text, public-case specification, hidden-case categories, and required reference-analysis contents are strong. But no actual fixture commit, public-test source, sealed hidden checker, reference analysis, reference patch, or final hashes are supplied; all remain pilot-gated. |
| 2 | Define baseline, planned, and resulting-current design as separate semantic states. | **Satisfies** | §11; §7.2; §17.2 | The draft clearly distinguishes the three states, permits a canonical resulting-current record to change, and requires recoverability of the baseline and plan. This directly resolves the prior ambiguity. |
| 3 | Define a benchmark-neutral component and distinguish identified, changed, and newly created components. | **Satisfies** | §10; §17.2(C); §17.3 | The component definition requires cohesive responsibility plus a supported signal and separates the three sets for assessment and reporting. |
| 4 | Add a layout-neutral semantic rubric with required propositions and rating anchors. | **Satisfies** | §17 | The rubric is semantically structured rather than document-layout-dependent, has four anchors, named propositions, scoring, and an assessor-evidence requirement for low scores. |
| 5 | Add harness-observable design-before-implementation evidence. | **Satisfies, with an operational gap** | §15; §27.2 items 15–19 | Accepted evidence channels, the first-behavior-changing-mutation definition, chronology capture, snapshots, and the simultaneous-write rule are well specified. However, “adequate” baseline, plan, and component evidence for the 10-point temporal score lacks an explicit pre-mutation threshold. |
| 6 | Define plan-amendment and implementation-deviation treatment. | **Satisfies** | §16; §17.2(D); §15.3 | Initial-plan preservation, valid amendment conditions, late amendments, deviations, and retrospective justification are defined coherently. |
| 7 | Give all arms equivalent top-level task authority without leaking child/component boundaries. | **Partially satisfies** | §§5.1, 6.2, 7, 9, §27.2 items 13–14 | The shared authority text is appropriate: it grants fixture-wide top-level scope, permits justified dynamic creation, and provides no child map or target-file answer. But §5.1 says the current arm receives a “component record,” while neither its exact contents nor its fixture/mount location are specified. That record must be frozen and demonstrated not to disclose child boundaries or baseline-design answers. |
| 8 | Freeze the exact B/C additive diff and identical isolated wrappers. | **Partially satisfies** | §8; §9.2; §27.2 items 9–12; §28 | The intended delta is unusually precise: C is B plus the exact block, and the pilot must verify wrapper, launcher, tool, mount, and environment parity. The actual instruction source files, byte-level diff, and hashes are still pending. |
| 9 | Inventory and freeze every current-versus-isolated surface difference. | **Partially satisfies** | §9; §27.2 item 12; §28 | The inventory is comprehensive and correctly labels current-versus-isolated comparisons as package comparisons. Yet the current revision is an open decision, and loaded current artifacts, manifests, and hashes are not finalized. |
| 10 | Make delegation optional; freeze child/depth/retry limits and score appropriateness. | **Satisfies** | §18; §20.3; §25 | Delegation is explicitly optional, may not increase the primary score merely by occurring, and is evaluated for appropriateness. Limits and retry accounting are substantially specified. |
| 11 | Separate infrastructure invalidity, scored arm failure, and safety/stage stop. | **Satisfies** | §§23–24; §27.2 items 24–26 | The taxonomy and the hidden-access distinction are clear. Infrastructure invalidity is external, arm-caused failures remain in the denominator, and safety events stop the stage. Whole-triplet replacement is also specified. |
| 12 | Freeze matched triplets, randomization, blinding, repetition count, primary comparisons, aggregation, invalid replacement, and stopping rules. | **Partially satisfies** | §§19–24; §31 OD-5 and OD-6 | Most elements are present and sound: matched fresh triplets, sequential within-triplet execution, blinding, paired aggregation, replacement, and stopping rules. But the two-replacement reserve conflicts with the stated six-order schedule; only one unused distinct arm order remains after the five planned triplets. Repetition count and assessor roster also remain unresolved decisions. |
| 13 | Define “approaches current” numerically or state descriptive-only reporting. | **Satisfies, with one definition gap** | §19 | This is a proper descriptive threshold rather than an equivalence claim, with score, behavior, component, cost, latency, failure, and safety conditions. “Scored hard failure” and “anchor averages” need explicit computational definitions. |
| 14 | Freeze total cost and wall-clock accounting at arm, triplet, and stage levels. | **Satisfies as a proposed hierarchy** | §25; §18.2; §24.2 | The arithmetic is internally consistent: USD 2.55 per arm, USD 7.65 per triplet, USD 38.25 for five planned triplets, USD 15.30 reserve, and USD 53.55 maximum scored stage. Parent/child/retry inclusion and time nesting are stated. Budget approval remains OD-7 and therefore is not final. |
| 15 | Complete a provider-free pilot before final hashes; require a new version after material changes. | **Satisfies as a gate; not yet completed** | §§27–28; §3.2 | The pilot requirements are extensive and correctly prohibit provider use, scored execution, and final hashes before completion. Material changes require a new version, pilot, hashes, approval, and fresh stage. The pilot has not yet been performed, so Gate H2 cannot occur. |

---

## 2. Internal-consistency findings

### Blocking findings

1. **Replacement randomization cannot supply two replacement triplets.**  
   - **References:** §21.3; §24.1–24.2.  
   - The protocol constructs the six distinct permutations of three arms, uses the first five for planned triplets, then requires the “next unused randomized arm order” for each replacement triplet. Only one unused order remains, but the reserve permits two replacement triplets.  
   - **Required resolution before Gate H2:** preregister a deterministic seven-triplet schedule, including how the seventh order is selected or repeated. It should preserve order balance as far as possible and be generated from the committed seed before execution.

2. **“Scored hard failure” is used in decisive comparisons without a single definition.**  
   - **References:** §§4.4, 19.5, 20.2, 23, and 17.4.  
   - The phrase occurs in the functional guardrail, primary rule, and “approaches current” definition. The draft defines “scored arm failure,” labels temporal failure a “scored hard failure,” and separately defines semantic acceptance conditions, but it does not say whether each is counted as a hard failure or whether the measure is binary per run, a count of failure events, or another calculation.  
   - This can alter H2, the primary decision rule, and the secondary threshold.  
   - **Required resolution:** define a run-level hard-failure indicator, enumerate which classifications set it, state whether multiple events in one run count once, and use that exact indicator in §§4, 19, and 20.

3. **The temporal “adequacy” rule is under-specified.**  
   - **References:** §15.4; §17.2(A)–(C); §17.4.  
   - A run earns ten temporal points when “adequate” baseline, planned-design, and component evidence exists before mutation, but no threshold says whether adequacy requires every relevant pre-mutation proposition, a minimum anchor rating, or another rule. The later rubric rates content, but it does not explicitly supply the temporal threshold.  
   - **Required resolution:** tie temporal adequacy to stated pre-mutation propositions and anchor thresholds, while retaining layout neutrality. For example, require a specified set of baseline, plan, and component propositions to each be at least “incomplete” or otherwise define the minimum semantic threshold.

4. **Current-arm admission evidence is not yet concretely bounded.**  
   - **References:** §§5.1, 7.1–7.2, 9.3, 27.2 item 13, and 28.1.  
   - The draft rightly avoids a child map, but it states that the current arm receives a component record without supplying, locating, or hashing it. Because the current composition may use that record to admit work, its content could unintentionally reveal design or component answers unavailable to isolated arms.  
   - **Required resolution:** specify the exact top-level record or make `benchmark-authority.md` the sole equivalent top-level admission artifact; freeze it and have the pilot prove that it neither prevents current-arm admission nor leaks a child/component answer.

5. **Final preregistration prerequisites are deliberately incomplete.**  
   - **References:** §§3.2, 6.1, 9.3, 14.4, 18.4, 21.1, 22.2, 25.1, 26, 27–28, and §31.  
   - OD-1 through OD-8, the fixture implementation, tests, reference materials, final hashes, immutable provider route or routing manifest, and pilot report are absent. The draft itself correctly makes each relevant item a final-approval dependency.  
   - This is not a defect in the stated gate design, but it is a conclusive blocker to a final preregistration decision today.

### Findings that are internally consistent

- **Budget arithmetic and inclusion rules are consistent.**  
  USD 1.50 parent + USD 0.70 for two initial children + USD 0.35 for one retry equals the USD 2.55 arm ceiling. Three sequential arms produce USD 7.65 and 3,060 seconds per triplet; five planned and two reserve triplets produce USD 53.55 and 21,420 seconds. Child time is explicitly within the 900-second parent model-session envelope, while setup/check/cleanup add the 120-second non-provider allowance.

- **Retry accounting is substantially coherent.**  
  A retry is limited to one failed/rejected/incomplete prior child assignment, cannot become a new task, receives one fresh child allocation, does not extend the parent session, and remains charged even if it fails or is canceled. The wording would be clearer if it explicitly said that the retry is permitted in addition to—not within—the maximum two *initial* child attempts.

- **Matched-triplet mechanics are fundamentally sound.**  
  Each triplet contains all arms on fresh clones and sessions, runs sequentially to avoid contention, prohibits result carryover, and excludes an entire triplet when one member is infrastructure-invalid. This protects paired primary analysis better than member-level replacement would.

- **Validity taxonomy and rerun rules are coherent.**  
  External infrastructure defects may invalidate and replace the whole triplet; arm-caused timeouts, budget exhaustion, early implementation, failed tests, or unnecessary scope remain scored; safety events stop the stage. The special case of harness-enabled hidden access appropriately records both the harness invalidity and the model safety event and prevents efficacy use.

- **Primary and secondary comparison framing is appropriate.**  
  Candidate B versus C is the paired causal comparison, current versus C is explicitly whole-package and secondary, and current versus B is contextual. Historical results are excluded from aggregation. The remaining issue is the undefined hard-failure and component-average computation, not the comparison structure.

---

## 3. Task-part quality

### Overall assessment: strong design, pending concrete-fixture validation

The proposed `cold-cart-quote` task is a credible design-first benchmark **in specification**. It does not merely ask an arm to put a formula in a named file.

| Capability to exercise | Assessment | Supporting draft provisions |
|---|---|---|
| Current-design capture | **Genuinely exercised** | The arm must inspect an existing application with catalog facts, normalization, pricing/discounting, receipt rendering, and public coordination. The baseline oracle requires relationships and grounding, not a task restatement (§§6.4, 7.2, 13, 17). |
| Separate planned-design capture | **Genuinely exercised** | The task requires a separate pre-mutation plan; the protocol distinguishes it from baseline/current truth, preserves it, and treats retrospective amendments as deviations (§§7.2, 11, 15–16). |
| Dynamic minimum-component identification | **Genuinely exercised** | No child map, files, component count, or delegation slices are supplied. The component model separates relevant existing responsibilities from changed and new responsibilities (§§6.2, 7.1–7.2, 10). |
| Minimum-scope implementation | **Genuinely exercised** | The task has a natural small placement—fee policy in existing quote pricing—while permitting a focused fee calculator as a larger but potentially justified alternative. Generic registries, runtime configuration, and broad refactors are explicitly unnecessary (§§6.5, §12). |
| Design-to-code alignment | **Genuinely exercised** | The plan must identify placement, flow, changed surfaces, alternatives, and scope rationale; the implementation, tests, behavior, amendments, and deviations are subsequently compared against it (§§16–17). |

### Fixture quality strengths

- The feature crosses meaningful boundaries: normalized cart lines, catalog storage facts, pricing/discount policy, quote contract, and receipt ordering.
- The requested fee formula deliberately detects several superficially plausible errors: line-count versus normalized-unit counting, separate rounding, discounting the fee, cap ordering, ambient-only charging, and omission from total.
- The fixture permits a correct no-new-component solution without forcing delegation, but has a credible tempting abstraction path. That directly tests minimum-scope discipline.
- The feature does not name target files or impose a document schema, component count, or ownership decomposition.

### Hidden-checker and semantic-checkability assessment

**The proposed evaluation design is semantically checkable and layout-neutral in principle.**

- The baseline oracle names semantic propositions, not required artifacts, headings, filenames, or component names (§13).
- The rubric allows evidence in transcript or arbitrary textual artifacts and assesses meaning through supported/incomplete/contradicted/false anchors (§§15.1, 17).
- Numeric checking correctly prohibits raw floating-point equality and gives a concrete tolerance that permits representation noise but not cent-level mistakes (§14.4).
- The planned hidden cases are strong and include mutant-killing conditions (§14.2).

**Residual condition:** the actual sealed checker and reference analysis must still demonstrate that “absence of generic runtime configuration requirements,” placement of fee calculation, and minimum-scope judgments are assessed through the declared semantic rubric/diff evidence rather than by an unstated layout proxy. That is a final-fixture and pilot validation obligation, not yet evidence available in this draft.

---

## 4. Authority-discipline assessment

**The draft has good authority discipline.**

- It repeatedly states that it is advisory and grants no execution authority (§status text, §33).
- Gate H1 permits only fixture preparation and a provider-free pilot, and only after explicit human approval (§3.1).
- Gate H2 separately requires final human approval before provider use, spending, or scored runs (§3.2).
- OPEN DECISION items are explicit and correctly state that silence does not adopt defaults (§31).
- The provider-free pilot explicitly requires zero provider cost and zero provider requests (§§25.3, 27).
- No section authorizes production adoption, consolidation, fixture mutation outside an approved process, or scored execution before the gates.

The sole authority-related residual risk is the unspecified current-arm “component record.” Its scope must be frozen and shown not to confer a hidden component-boundary advantage.

---

## 5. Advisory findings

1. **Rename or define the hypothesis/decision relationship.**  
   H1 says “positive paired” difference (§4.4), but the primary decision requires at least +10 points and four of five wins (§20.2). This is defensible as a conservative evidentiary threshold, but should be explicitly characterized that way to prevent readers treating any positive median as hypothesis confirmation.

2. **Define component anchor averages algebraically.**  
   Section 19.7 should state whether each per-run average is the raw component subscore divided by its number of propositions, followed by the median across the five runs. The intended meaning is inferable but should not be inferred in a preregistration.

3. **Clarify retry terminology.**  
   State explicitly that the maximum is two initial child attempts plus one permitted retry attempt, for at most three child attempts per arm. This removes any ambiguity created by “every actual … child process counts against these limits.”

4. **Make assessor-blinding exceptions auditable.**  
   “Where feasible” path aliasing is reasonable, but the pilot report should record each unmasked arm-correlated convention and why masking would have altered semantic evidence.

5. **Record the conclusion boundary prominently in the final report.**  
   The draft already prohibits general equivalence and portability claims. Given one synthetic application and one feature family, the report should lead with the fixture-bounded interpretation, not merely list it under limitations.

---

## Final bounded conclusion

**NOT READY for final human preregistration review / Gate H2.**

The document is substantially improved over the original plan and provides a credible basis for a **human Gate H1 decision** on whether to prepare the fixture and run the provider-free pilot. It is not yet a preregisterable scored protocol because final artifacts and approvals are intentionally absent, and because the replacement-order schedule, hard-failure definition, temporal-adequacy threshold, and current-arm admission record require resolution before the pilot can establish a final frozen protocol.
