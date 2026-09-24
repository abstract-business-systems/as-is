[openrouter-session] Ready, base session ID: ephemeral-1788815392198-2ck3sbm2va8
[openrouter-session] Using session_id: expert-sol-plan-validation-ephemera
# Decision

**The plan is not ready to preregister as a scored protocol.** It is a sound benchmark-design brief, but the TASK, semantic evidence contract, arm isolation, budget hierarchy, invalid-run taxonomy, repetition count, and decision rule remain materially unresolved.

I recommend completing the amendments below, running the provider-free harness pilot, freezing the corrected protocol, and only then preregistering scored execution.

## Observations

### What is already strong

- The plan correctly requires all three arms to run freshly on the same task and rejects numerical pooling with historical results.
- Candidate B versus Candidate C is potentially the cleanest comparison because C is intended to use B’s isolated surface plus only the new design-first guidance.
- The task deliberately avoids fixed component ownership and permits a correct one-component/no-delegation result. That is preferable to forcing a decomposition that contradicts minimum-scope reasoning.
- The acceptance conditions target semantics rather than filenames, headings, schemas, or component counts.
- The provider-free pilot and hidden-test custody requirements respond to actual prior failures, including launcher/context defects and a hidden checker that imposed unspecified floating-point equality.
- Keeping cost, tokens, latency, retries, and human intervention separate from semantic quality is appropriate.

### TASK and acceptance checkability

| Capability | Current plan | Assessment | Required amendment |
|---|---|---|---|
| Current-design capture | Requires a description of observed pre-change behavior. | **Partially checkable.** No baseline fact set defines adequate coverage, and a task restatement could technically qualify. | Freeze a hidden baseline-design oracle covering relevant responsibilities, observable behavior/data flow, interfaces or boundaries, relationships, and constraints. Require claims to be grounded in inspected code, tests, or observed behavior. |
| Separate planned-design capture | Requires a distinct plan and disqualifies implementation before design evidence. | **Partially checkable.** “Distinct” and “before” lack an evidence surface and temporal mechanism. | Define accepted evidence channels and have the harness capture the transcript/workspace state before the first behavior-changing source, test, or configuration mutation. |
| Dynamic component identification | Requires boundary evidence and rejects directory-only claims. | **Weakly checkable as written.** “Responsibility, boundary, lifecycle, or relationship” lets one weak signal suffice. It is also unclear whether components are being identified, changed, or newly created. | Define a benchmark-neutral component as a cohesive responsibility plus at least one supported boundary, lifecycle, or relationship signal. Separately score identified components, changed components, and newly introduced components. |
| Minimum-component/scope implementation | Requires minimum necessary scope and no unnecessary components or unrelated changes. | **Not yet reliably checkable.** There is no reference scope, acceptable solution family, or rule for legitimate alternatives. | Pre-author acceptable design families, necessary behavioral surfaces, permitted supporting changes, and clearly unrelated/prohibited surfaces. Allow novel solutions through blinded adjudication under the same minimum-scope principles. |
| Design-to-code alignment | Requires implementation to match planned design. | **Partially checkable.** The evaluator has no defined claims-to-diff method or rule for plan revisions. | Require semantic correspondence among planned responsibility changes, changed artifacts, tests, and observed behavior. Preserve initial plans; permit later amendments only if recorded before the changes they justify. Record unresolved deviations. |
| Behavioral correctness | Public and hidden checks must pass. | **Potentially checkable.** The fixture and checks do not yet exist. | Freeze deterministic public and hidden tests, including edge cases that discriminate among superficially correct implementations. |
| Truthful handoff | Validation, assumptions, and residual risk must be truthful. | **Judgment-based but feasible.** “Truthfully” lacks rating anchors. | Freeze rating anchors for supported, incomplete, contradicted, and false claims; blind assessors to arm identity. |

### A critical design-state ambiguity

The plan currently collapses three different states:

1. **Baseline design:** the recoverable observation of the pre-change system.
2. **Planned design:** the intended change recorded before implementation.
3. **Resulting current design:** what exists after implementation.

“Current design is not overwritten by the plan” is valid, but it must not mean that a canonical current-design record can never be updated after implementation. The current composition’s record procedure expects durable architecture records to describe current truth. It could therefore correctly update a canonical record and nevertheless appear to violate the benchmark.

The acceptance rule should instead be:

> The pre-change design remains recoverable as a baseline snapshot; the planned design is independently identifiable and does not masquerade as observed fact; any resulting-current record may be updated after implementation without destroying the baseline or plan evidence.

This remains independent of document layout.

### Fixture requirements needed to exercise Candidate C genuinely

The task description at lines 41–47 is still a task-family sketch rather than a benchmark task. A qualifying fixture should have all of the following:

- A small existing application with several discoverable responsibilities and at least one meaningful interaction between them.
- Directory structure that does not itself provide a complete component answer.
- A feature whose implementation requires deciding where a responsibility belongs, rather than merely locating a named function.
- At least two plausible designs, with one demonstrably smaller or better aligned with existing boundaries.
- At least one tempting but unnecessary abstraction, module, configuration surface, or adjacent cleanup.
- Hidden cases that require the planned interaction, not merely the visible happy path.
- No task-text disclosure of target files, expected component count, or child ownership.
- A pristine fixture clone and fresh session for every repetition.
- An independently authored reference analysis identifying baseline facts, plausible designs, scope boundaries, and known irrelevant changes.

A task solvable by a trivial one-file edit can validly produce one component, but would provide little discriminatory evidence for dynamic component identification or design-to-code alignment. Conversely, forcing multiple components or delegation would defeat the minimum-scope construct.

### Current-arm admission and fairness risk

The current `building-components` procedure expects an authorized component task and relevant component record. The proposed fixture explicitly lacks a predeclared component map. Unless this is resolved, the current arm might correctly stop for missing task/component authority while the isolated arms proceed under a simpler task grant.

The protocol must decide whether it is measuring:

- design discovery in an unadopted application; or
- implementation within an already admitted top-level component whose child boundaries remain undiscovered.

For the intended comparison, I recommend the second: provide equivalent top-level task authority and write scope to all arms, but no child map or predetermined decomposition. Explicitly authorize dynamic record/component creation where justified. Do not provide the current arm with a child answer through its setup records.

### Three-arm comparison risks

1. **Candidate B versus C can isolate the new guidance only if the treatment delta is exact.** Freeze B and C sources and a diff proving that C is B plus the design-first block. Use identical wrappers, tools, filesystem mounts, launcher, root instructions, approval settings, and context except for that block.
2. **The wrapper decision cannot remain open.** Candidate B and C should use the same disposable wrappers and launcher. Otherwise wrapper behavior is confounded with the guidance.
3. **Current versus B/C is a package comparison, not a causal prompt comparison.** The current arm necessarily has different skills, context, and possibly tools. Report every surface difference and restrict conclusions accordingly.
4. **Use matched triplets, not merely global arm randomization.** Each repetition block should contain one run of every arm against the same fixture revision, with preregistered randomized order within each triplet.
5. **Blind semantic evaluation.** Remove arm-identifying instruction names, record conventions, and telemetry from assessor packets where possible.
6. **Freeze fresh-session and contamination controls.** No shared sessions, mutable worktrees, task-result carryover, or hidden-test mounts.
7. **One task measures stochastic reliability, not generality.** Repeating one fixture cannot establish broad production equivalence. Either bound the conclusion to that fixture family or preregister multiple held-out feature variants.
8. **Task wording itself can dilute the treatment.** If the shared task gives Candidate B Candidate C’s complete procedure, the comparison becomes mostly repetition/salience. The task should state required outcomes; C should supply the design-first method without fixture-specific answers.

### Delegation and retry

Delegation should be **optional and descriptive**, not required acceptance, for this benchmark. Otherwise the benchmark tests delegation pressure rather than dynamic minimum-component selection.

Consequences:

- Remove delegation/retry behavior from primary capability acceptance.
- Score whether delegation was appropriate, properly bounded, and successfully integrated when used.
- Treat unnecessary delegation as possible minimum-scope evidence.
- Define maximum children and delegation depth even though the correct count remains dynamic.
- Clarify whether “one retry slot” means one child-attempt retry. Infrastructure-invalid run replacement must be a separate concept.

### Budgets

The inherited large-preset budgets are provisional rather than justified for this fixture.

Material ambiguities include:

- whether the USD 2.00 parent cap includes or excludes child spend;
- the maximum number of children receiving USD 0.50 each;
- whether child time runs inside the 900-second parent wall clock;
- whether the retry receives another full child allocation;
- the total per-arm, per-triplet, and stage-wide ceiling;
- treatment of budget exhaustion; and
- the still-open number of repetitions.

These matter because the current task protocol records parent and child costs separately. A “USD 2.00 parent cap” is not itself a total-run cap.

Before preregistration, freeze:

- maximum child count and depth;
- inclusive/exclusive cost accounting;
- retry allocation;
- cumulative wall-clock semantics;
- total arm, triplet, and stage ceilings;
- reserve and stop rules; and
- budget-exhaustion classification as a scored arm outcome, not infrastructure invalidity.

### Validity and disqualification

The sentence at line 84 improperly combines invalid repetitions with arm failures. That creates a serious risk that poor arm behavior could be excluded and rerun.

Use this separation:

| Classification | Examples | Treatment |
|---|---|---|
| Infrastructure invalid | Fixture/hash mismatch, hidden-checker malfunction, provider failure before a model turn, worktree provisioning failure, dependency drift, arm-asymmetric harness defect | Preserve evidence; replace only under the frozen neutral rule. |
| Scored arm failure | Timeout caused by arm behavior, cost exhaustion, implementation before design, unauthorized write, unsupported component invention, unnecessary scope, failed tests, false completion | Retain in the scored denominator; do not rerun as invalid. |
| Safety/stage-stop event | External action, master/ref mutation, secret exposure, successful hidden-test access, material containment breach | Score the arm failure and apply the preregistered stage-stop rule. |

Further distinctions are required:

- Hidden tests exposed by the harness are infrastructure invalid; an arm attempting to access them is an arm safety failure.
- “Directory-only component claim” should fail the component-evidence criterion, not erase the run.
- “Overwriting current design,” “unsupported invention,” and “false completion” need objective rating anchors.
- If the evaluator or hidden checker changes after scored execution starts, all results under the old evaluator must remain reported and should not be pooled silently with the revision. Prefer resetting the scored stage after fixing a material checker defect.
- Freeze whether an invalid member causes replacement of the whole matched triplet or only the affected run.

## Inferences

- Running the plan as written would make semantic outcomes depend too heavily on post hoc evaluator judgment, especially for “minimum,” “component,” and “matches the planned design.”
- The baseline/planned/resulting-design ambiguity could systematically disadvantage the current arm for correctly updating a canonical current-design record.
- Candidate B versus C can support a meaningful causal claim about the additive guidance, but only with an exact frozen treatment delta and identical isolated surfaces.
- Current versus C can support only a whole-package capability/efficiency comparison because instruction, context, procedures, and likely tool affordances differ.
- The prior hidden-checker defect and isolated follow-up’s non-fresh baseline make strict pre-run freezing particularly important here.
- A non-significant difference across a small number of runs would not establish equivalence. “Approaches current behavior” needs a preregistered descriptive threshold or non-inferiority margin.

## Uncertainties

The following cannot be assessed from the supplied materials:

- whether the eventual concrete task will actually force a design decision;
- whether Candidate C differs from B only in the stated guidance, because the exact sources are not included;
- whether the current arm can validly start in the proposed no-map fixture;
- semantic evaluator reliability and inter-rater agreement;
- whether the inherited budget is sufficient or excessively generous for the new task;
- the intended strength of conclusions from one fixture family; and
- the repetition count, primary endpoint, aggregation method, or decision threshold.

## Required amendments before scored execution

1. Freeze the exact fixture, task text, public tests, hidden cases, and reference design/scope analysis.
2. Define baseline, planned, and resulting-current design as separate semantic states.
3. Define a benchmark-neutral component and distinguish identified, changed, and newly created components.
4. Add a layout-neutral semantic rubric with required propositions and rating anchors.
5. Add harness-observable temporal evidence for design-before-implementation.
6. Define how plan amendments and implementation deviations are treated.
7. Give all arms equivalent top-level task authority without leaking child/component boundaries.
8. Freeze Candidate B/C’s exact additive diff and identical isolated wrappers.
9. Inventory and freeze every current-versus-isolated surface difference.
10. Make delegation optional; freeze child/depth/retry limits and score appropriateness.
11. Separate infrastructure invalidity, scored arm failure, and stage-stop events.
12. Freeze matched-triplet randomization, assessor blinding, repetition count, primary comparisons, metric aggregation, invalid replacement, and stopping rules.
13. Define “approaches current” numerically or state that results will be descriptive only.
14. Freeze total cost and wall-clock accounting at arm, triplet, and stage levels.
15. Complete the provider-free pilot before final hashes; any subsequent material change requires a new protocol version. If provider-backed calibration is needed, use a separate fixture and exclude it from scored evidence.

## Bounded recommendation

**Do not preregister scored execution yet.** Approve the document only as the basis for protocol completion and a provider-free harness pilot.

After the amendments, I recommend preregistering with **Candidate B versus Candidate C as the primary comparison**, current versus Candidate C as a secondary whole-package comparison, and current versus B as contextual replication. Five matched triplets would be a reasonable exploratory minimum, but the human owner should choose the count and cost ceiling after the fixture and complete budget hierarchy are available.

The authorized choice is whether to return this plan for those amendments or to proceed only as an explicitly unscored exploratory pilot; the present plan does not support a defensible scored preregistration.
