## verdict

**revise**

The expanded re-plan is directionally strong but is not yet ready to serve as the basis for the next human-facing target-design package.

The principal defects are:

1. It conflates the **entire target implementation**—achievement of the stated goal through a revised agent-and-skill system—with the **bounded implementation unit** used for staged design approval and execution.
2. Its target agent roster mixes configured agents, workflow assignments, deterministic validators, and a test fixture, while omitting explicit target placement for `thinking-companion`, setup ownership, and independent evaluation ownership.
3. Its target skill roster is a candidate catalog rather than a settled roster and does not consistently map every retained/adapted live skill to a target contract or compatibility outcome.
4. Its alternate-reviewer discussion supplies profiles but not a sufficiently concrete evidence-based selection procedure.
5. Its rewrite escape criterion is too narrow, and its self-application bootstrap controls are incomplete.

This verdict does not reject staged heavy refactoring. It requires the plan to be normalized before presentation as the target design.

## expanded-scope-disposition

| Expanded direction | Disposition |
| --- | --- |
| Entire implementation achieves the stated goal through revised/refactored agents and skills | **Partially misinterpreted.** The report incorrectly says the clarified “entire implementation” is the currently approved bounded unit. The entire implementation is the complete target system needed to achieve the stated goal; bounded units are the staged design and authorization granularity. |
| Continuation versus heavy refactor versus rewrite | **Substantially addressed.** Staged heavy refactor is best supported by current evidence. |
| Total rewrite remains permissible | **Insufficiently preserved.** It must remain permissible if later evidence shows replacement has lower total risk or cost, not only when the present substrate is technically incapable of supporting the target. |
| `drafts/composable-skills.md` used as direction | **Yes.** It was treated as proposal direction rather than authority or a wholesale replacement instruction. |
| Complete live-agent and live-skill dispositions | **Mostly complete and correctly counted.** Seven production roles, one test fixture, and 17 live skills are accounted for. |
| Complete target rosters | **Not yet.** The target lists contain category mixing, missing mappings, and conditional candidates presented alongside required target contracts. |
| Setup and consumption included in the goal | **Yes.** Internal setup comparison and later external-consumption readiness are distinguished. |
| Separate mock consuming project and paired setup comparison | **Yes in principle.** Directory ownership, generated-run placement, and experiment input equality still need exact treatment. |
| Existing backlog item versus new mock feature | **Correctly left open, with a reasonable recommendation for a new low-risk mock feature.** |
| Active branch as candidate/recovery boundary | **Correct.** |
| `master` only as pinned evaluation baseline | **Correct.** |
| No separate rollback machinery | **Correct.** Normal branch, worktree, task, and setup-failure recovery remain necessary but are not a separate rollback subsystem. |
| Ownership gaps solved through named or new agents | **Incomplete.** Several task-graph owners are placeholders absent from the target roster. |

The revised plan must explicitly state:

- **Program scope:** the complete target agent-and-skill system that realizes the stated development goal, including setup/consumption.
- **Design gate:** implementation proceeds in bounded units only after that unit’s required base design records are available, linked, current, and approved.
- **Migration scope:** the whole target may be implemented through several approved units without reducing “entire implementation” to the first slice.

## alternate-reviewer-selection

**Do not select a concrete alternate-reviewer model or family now.**

Evidence:

- `as-is.json` resolves Pi roles through opaque `@preset/abs-*` aliases and does not establish the underlying model families.
- The exact model visible in `.opencode/opencode.json` is not evidence for Pi reviewer identity; the live launcher contract explicitly says OpenCode configuration is not its model-policy source.
- No authorized live provider evidence, family provenance, repository-local reviewer trial, availability check, or risk-specific evaluation was obtained in this read-only review.
- A model name or benchmark rank alone cannot establish family independence.

The target package should define this selection procedure:

1. **Name the risk and review question first**, such as capability security, benchmark reproducibility, or package isolation.
2. **Identify the exact primary reviewer configuration**, including provider, model ID/version, routing mode, retrieval date, and any authoritative family provenance.
3. **Shortlist available candidates** using authorized provider data only for relevant capability, context, availability, cost, and latency screening.
4. **Verify family provenance from an authoritative source.** If provenance is unavailable, classify family independence as unknown; do not infer it from branding or benchmark proximity.
5. **Run a bounded local reviewer trial** against the same sanitized architecture evidence packet and rubric. Measure:
   - valid risk findings not already present;
   - evidence citation and factual accuracy;
   - false or invented claims;
   - adherence to read-only and authority constraints;
   - calibrated uncertainty;
   - cost and latency.
6. **Select through accountable human judgment**, recording the exact configuration, evidence, unresolved dependence, and review scope.
7. If family independence cannot be established, use an appropriately independent specialist or differently scoped reviewer and describe the actual independence obtained rather than calling it alternate-family review.

Selection should occur before credential-bearing work, external effects, external-consumption claims, multi-project isolation claims, or security-isolation claims. Provider rankings remain screening evidence, never appointment or approval authority.

## strategy-review

| Strategy | Review |
| --- | --- |
| Simple continuation | Insufficient. It would preserve overlapping procedures, repository-oriented setup assumptions, missing design governance, and unclear target role composition. |
| Staged heavy refactor | **Recommended.** It preserves proven task control, bounded execution, deterministic validation, worktree recovery, and parent integration while permitting substantial replacement of agents and skills. |
| Immediate total rewrite | Not presently justified because substantial deterministic behavior and fixtures would have to be recreated before a fair comparison. |

A total rewrite must nevertheless remain an allowed later strategy when controlled evidence shows one or more of the following:

- retained compatibility makes authority or lifecycle behavior unacceptably complex;
- migration adapters cost more or carry more risk than replacement;
- core task-control, launcher, setup, or record assumptions prevent the approved target;
- required safety or project-isolation properties cannot be added coherently;
- paired evaluation shows the retained substrate produces persistent correctness, recovery, or maintainability failures;
- a rewrite candidate demonstrates equivalent or better deterministic controls, migration safety, recoverability, and benchmark results.

The rewrite decision must be evidence-based and separately approved. “Technically possible to retain” is not sufficient reason to prohibit rewriting.

## composable-skills-review

`drafts/composable-skills.md` was correctly used as proposal direction in these respects:

- master skills own outcome-sized procedural composition;
- reusable skills remain independently useful;
- skills do not grant tools or authority;
- agents select tools only within fixed role, host, task, and safety admission;
- a general `making-changes` workflow may distinguish component and non-component work;
- wholesale replacement and a generic composition engine remain deferred.

Factual correction:

- The draft claims **25 reusable skills**, but it contains **24 reusable-skill headings**.
- Terra’s target adds four more reusable candidates—design alignment, consuming-project setup, implementation-result review, and workflow evaluation—for **28 proposed reusable target entries**.
- Terra lists **14 master entries**: the draft’s 12 plus two additional masters.

The re-plan overcommits to extraction in several places. `resolving-scopes`, `identifying-owners`, `delegating-bounded-work`, and `observing-delegated-work` are marked required without yet demonstrating an independent consumer or why existing master procedures cannot initially contain them. The next package should classify each proposed skill as one of:

- adopted target contract;
- retained compatibility contract;
- first-slice candidate;
- later extraction requiring consumer evidence;
- deferred proposal;
- rejected proposal.

A reusable skill should not be created merely because its procedure can be named. It needs a distinct responsibility, owner, consumer, validation boundary, and non-duplicative contract.

## current-agent-disposition-review

The current catalog consists of **seven production role components plus one test fixture**.

| Current contract | Terra disposition | Review disposition |
| --- | --- | --- |
| `agent-capability-probe` | Retain as fixture | Correct; keep outside the production roster. |
| `as-is` | Replace through compatibility migration | **Needs justification.** Current evidence supports retain/adapt or an explicit rename-compatible replacement; routing and design-status additions alone do not prove a new identity is necessary. |
| `component-builder` | Adapt | Correct. |
| `evidence-validator` | Adapt | Correct. |
| `execution-advisor` | Retain | Correct. |
| `expert` | Retain and compose | Correct. |
| `thinking-companion` | Retain and compose | Correct, but its target-roster placement is missing. |
| `worker` | Adapt | Correct. |

No current production role or fixture is presently justified for immediate deletion. Any eventual replacement of `as-is` requires a proven target consumer, compatibility behavior, routing tests, reference migration, and an explicit deprecation point.

Sol, Terra, and Luna remain advisory/model labels rather than current agent contracts or mandatory target roles.

## target-agent-roster-review

Terra proposes ten target entries, but they are not all agents:

| Proposed entry | Category | Review |
| --- | --- | --- |
| Intake and design-status router | Configured agent candidate | Sound; source disposition must resolve retain/adapt versus replacement of `as-is`. |
| Design/workflow orchestrator | Configured agent or explicit orchestration assignment | Needed. Must own design package coordination and human escalation without approving design. |
| Component-delivery orchestrator | Configured agent | Sound adaptation of `component-builder`. |
| Bounded implementation worker | Configured agent | Sound adaptation of `worker`. |
| Deterministic evidence validator | Configured validator agent | Sound adaptation of `evidence-validator`. |
| Semantic result reviewer | Configured agent or separately invoked review role | Needed; may be a separate constrained session for the low-risk slice. |
| Integration owner | Workflow assignment | Not necessarily a separate agent; normally assigned to the receiving component-delivery orchestrator. |
| Execution and evaluation advisor | Configured advisory agent | Sound, but it must not score or approve its own advice. |
| Architecture/specialist reviewer | Configured or selected advisory role | Sound as `expert` composition initially; specialist selection remains risk-specific. |
| Capability-probe fixture | Test fixture | Must not appear as a production target agent. |

Required roster corrections:

1. Add an explicit target disposition for the retained `thinking-companion`, such as **human design and feedback facilitator**, or explain why it remains compatibility-only.
2. Name the owner for **consuming-project setup orchestration**. It may be assigned to the design/workflow orchestrator or represented by a new setup orchestrator, but “setup owner” cannot remain an unbound task-graph label.
3. Name the **evaluation orchestrator and scoring owner**. The execution advisor may provide evidence analysis but must not be the sole scorer of a candidate it advised.
4. Name the owner for **agent-and-skill migration coordination**, or assign it explicitly to the component-delivery orchestrator.
5. Separate:
   - configured production agents;
   - per-workflow authority assignments;
   - human roles;
   - deterministic tools/validators;
   - test fixtures.
6. State whether the optional design/prototyping group is:
   - omitted for the first slice;
   - represented by existing design orchestrator plus `thinking-companion`; or
   - created only after evidence of overload or authority confusion.

## current-skill-disposition-review

All **17 live skills** are accounted for. The corrected adaptation count is **seven**.

| Live skill | Reviewed disposition |
| --- | --- |
| `as-is-setup` | Adapt |
| `building-components` | Adapt |
| `committing-completed-work` | Retain |
| `context-building` | Retain and compose |
| `designing-mermaid-diagrams` | Retain and compose |
| `deterministic-skills` | Retain |
| `exploring-execution-evidence` | Retain |
| `human-centered-consulting` | Retain and compose |
| `implementing-component-tasks` | Adapt |
| `integrate-as-is-documentation` | Adapt |
| `maintaining-components` | Retain |
| `managing-as-is-document` | Adapt |
| `managing-backlog` | Retain |
| `naming-software-concepts` | Retain |
| `spawning-pi-subagents` | Adapt |
| `structuring-content` | Retain and compose |
| `verification-discipline` | Adapt |

No live skill is currently justified for immediate drop. The historical all-skills replacement idea remains rejected as a migration strategy.

## target-skill-roster-review

Terra’s roster contains **28 reusable entries and 14 master entries**, but it is not yet a settled target roster.

### Reusable entries

| Classification | Entries |
| --- | --- |
| Strong retained/adapted target basis | `building-context`, `choosing-names`, `structuring-content`, `validating-changes`, `designing-diagrams`, `inspecting-execution-evidence`, `assessing-determinism`, `preparing-scoped-commits` |
| Required target capability, exact skill boundary unresolved | `designing-and-aligning-design`, `setting-up-consuming-projects`, `reviewing-implementation-results`, `evaluating-workflows` |
| Proposed extraction requiring consumer evidence | `resolving-scopes`, `identifying-owners`, `recording-evidence`, `delegating-bounded-work`, `observing-delegated-work`, `choosing-change-methods` |
| First-slice or early candidate | `writing-code`, `applying-bounded-edits`, `writing-tests`, `running-tests`, `presenting-decisions` |
| Deferred | `locating-changelogs`, `drafting-content`, `rendering-diagrams`, `recording-backlog-items`, `drafting-changelog-entries` |

### Master entries

| Classification | Entries |
| --- | --- |
| Required or retained target masters | `making-changes`, `building-components`, `implementing-tasks`, `maintaining-components`, `managing-as-is-records`, `designing-mermaid-diagrams`, `managing-backlogs`, `spawning-subagents`, `exploring-execution-evidence`, `consulting-humans`, `committing-completed-work`, `designing-and-aligning-implementation-units`, `setting-up-and-evaluating-consuming-projects` |
| Conditional candidate | `managing-changelogs` |

Required corrections:

- Preserve `as-is-setup` and `integrate-as-is-documentation` as documentation-adoption procedures unless a deliberate merge or replacement is approved. They are not equivalent to package/host consumption setup.
- Map every adapted live skill to one exact target contract, compatibility alias, merge, or later deprecation.
- Do not present deferred candidates as members of the adopted target roster.
- Resolve naming pairs such as `context-building`/`building-context`, `verification-discipline`/`validating-changes`, and `implementing-component-tasks`/`implementing-tasks` as explicit retain, rename, alias, or replacement decisions.
- Keep setup documentation, host-resource setup, and package consumption as distinct responsibilities even if one master workflow composes them.

## replacement-deprecation-drop-review

| Subject | Review disposition |
| --- | --- |
| Current task-control substrate | Retain; adapt only through approved design-link and admission extensions. |
| Parent-owned integration | Retain and extend with design/result comparison. |
| Pi launcher | Retain and adapt; do not replace without evidence. |
| `as-is` router | Proposed replacement is underjustified; treat as retain/adapt or explicitly justify a compatible replacement. |
| Other current production agents | Retain or adapt as listed; no immediate deprecations or drops. |
| Current live skills | No immediate drops. Renames, merges, or replacements require explicit source-to-target migration. |
| Historical wholesale skill replacement | Reject. |
| Sol/Terra/Luna as mandatory target roster | Do not adopt. |
| Path B | Not selected while current and planned design can be reliably distinguished. |
| Total rewrite | Permissible later under explicit evidence and approval; not selected now. |

The next package must contain one migration table with exact source, target, compatibility period, consumer migration, validation, deprecation trigger, and final disposition for every renamed, merged, or replaced contract.

## setup-and-mock-project-review

The setup-inclusive comparison is architecturally appropriate if it distinguishes four things:

1. **Pinned system baseline:** the exact `master` revision supplying current setup and workflow behavior.
2. **Pinned candidate system:** the exact active-branch revision supplying candidate setup and workflow behavior.
3. **Committed mock-project seed:** one immutable simple project and frozen feature goal.
4. **Generated consumer copies:** separate current and candidate directories initialized from that same seed.

Required controls:

- The mock project must be separately owned from the agentic-system components and must not be treated as part of either system implementation.
- Current and candidate copies must not share mutable task state, sessions, traces, temporary files, credentials, configuration, or generated artifacts.
- The seed, rubric, validators, feature goal, and scoring rules must be outside candidate-worker write scope.
- Setup writes, prerequisites, idempotence, unsupported-host behavior, and partial-failure recovery must be measured.
- The first internal comparison may test repository-local setup without claiming independent package installation.
- A later external-consumption stage must test immutable package/bundle provenance, clean installation, compatibility, upgrade/downgrade, uninstall, and two-project isolation.
- The exact directory placement must be selected under repository and host ownership rules; “separate directory” must not become an implicit authorization to write outside the repository.

## first-slice-review

A new low-risk mock application feature remains the strongest first-slice candidate because it can exercise:

- setup;
- current/planned design;
- bounded task derivation;
- code and test changes;
- deterministic validation;
- semantic review;
- integration;
- stale-design rejection;
- controlled failure and recovery.

The reviewed existing backlog options do not provide an equally clean comparison:

- `drafts:finalize-composing-skills` is broad and dependency-coupled.
- `skills:presentation-guidance` is simple but weakly exercises implementation behavior.
- `skills:test-writing-skill` is plausible for a later skills-system slice but modifies the system rather than a neutral consuming application.
- `skills:clean-project-temporary-files` involves destructive behavior and is unsuitable as the initial feature.

An existing backlog item remains permissible if the human selects one and it satisfies the same low-risk, same-seed, same-feature, deterministic, no-external-effect comparison. It must not be forced into the mock project merely to claim reuse.

## branch-and-recovery-review

The branch policy is approved in direction:

- The active branch is the candidate and recovery boundary.
- It need not be `master`.
- `master` supplies only a pinned comparison baseline.
- Each paired run must pin both baseline and candidate revisions.
- Candidate history, worktrees, task checkpoints, and preserved partial work provide recovery.
- No separate rollback subsystem should be designed without a demonstrated need.
- Merge is an integration action, not proof of design approval, validation, setup success, or release readiness.

Operational recovery within setup and task execution remains required. That is not contradictory to declining a separate rollback mechanism.

## ownership-and-escalation-review

The escalation model is sound:

```text
worker or reviewer
→ direct caller
→ higher caller when outside current authority
→ named applicable orchestrator
→ accountable human when human judgment is required
```

Required rules are correctly preserved:

- escalation never grants tools, budget, retry, scope, design change, or external-effect authority;
- skills describe procedures but do not select or authorize agents;
- agents choose tools only from the fixed host, policy, role, and task admission intersection;
- the human escalation owner is the named applicable orchestrator;
- the then-current human reviews the applicable design revision.

Remaining ownership gaps:

| Concern | Required owner treatment |
| --- | --- |
| Consuming-project setup | Assign to the design/workflow orchestrator or create a setup orchestrator. |
| Benchmark orchestration and scoring | Name an evaluator independent of candidate implementation and fixture control. |
| Skill/agent migration | Assign to a component-delivery or dedicated migration orchestrator. |
| Semantic review | Name a distinct reviewer session or role; worker self-review is prohibited. |
| Design facilitation | Explicitly assign to existing orchestrator plus `thinking-companion`, or defer a dedicated group. |
| Specialist review | Select per risk using the evidence-based reviewer procedure. |

## design-completion-review

Path A is the correct target lifecycle while current and planned state remain reliably distinguishable.

The revised plan must distinguish two scopes:

- **Complete target design:** the human-facing package describes the whole revised agent-and-skill system needed to achieve the stated goal, including target roles, target skill architecture, setup/consumption, authority, feedback, verification, benchmark, migration, and future extension boundaries.
- **Bounded implementation-unit design:** implementation begins only when the base design records for every component the unit creates, changes, retires, or relies upon through an unresolved design decision are available, linked, and approved by the then-current reviewer.

Unchanged dependencies may use their approved current records. They do not need artificial target revisions unless the unit changes them or depends on an unresolved target choice.

There is a real contract conflict to resolve:

- the live `managing-as-is-document` contract describes current durable architecture;
- `drafts/composable-skills.md` proposes approved desired design in `as-is.md`;
- the user proposes clearly separated current and target content.

The next package must propose an exact contract evolution. A viable direction is:

- `Current state`: implemented and accepted current architecture;
- `Approved target state`: revisioned planned design, explicitly not current;
- `Design relationship`: root design revision, alignment, supersession/revocation, and derived-artifact provenance;
- task record: the sole active implementation authority.

Until that evolution is adopted, a separate frozen target-design package linked from current records is safer than silently treating planned behavior as current.

## design-changing-feedback-review

Terra’s plain-language rule is suitable:

> Renew design review when feedback changes what is being built, who it serves, required behavior, exclusions, allowed risk or external effects, or how success is judged.

The package should add deterministic lifecycle consequences:

| Feedback timing/type | Required consequence |
| --- | --- |
| Clarification with no changed answer to the checklist | Preserve revision or issue a non-semantic clarification according to the adopted record contract. |
| Design-changing feedback before launch | Supersede or revoke the prior target revision; block launch until renewed alignment. |
| Design-changing feedback during implementation | Checkpoint affected work, preserve evidence, and bubble to the applicable orchestrator. |
| Result diverges from approved design | Record discrepancy; do not silently update design or accept result. |
| New request after accepted implementation | Create a new design proposal or issue rather than appending it to the completed task. |
| Post-implementation defect against unchanged design | Route as bounded corrective work with normal design/task admission. |

Derived leaf artifacts do not require direct human review unless they change one of the design questions, architecture boundaries, risk, external effects, or acceptance meaning.

## implementation-review-requirements

Every result—success, refusal, failure, timeout, budget stop, and partial work—must receive a review record that:

1. Identifies design revision, task revision, attempt, source revision, candidate result, and reviewer.
2. Confirms design alignment was current at launch.
3. Inspects actual artifacts or diff rather than only the worker report.
4. Maps each acceptance condition and design invariant to observed evidence.
5. Runs or independently observes the smallest relevant deterministic checks.
6. Detects removed, skipped, narrowed, or weakened tests and validators.
7. Reviews unexpected files, dependencies, configuration, generated artifacts, capability use, and attempted external effects.
8. Records one explicit disposition: `accepted-for-integration`, `rework-required`, `escalated`, `rejected`, or `recovery-required`.
9. Records residual risk, omitted checks, recovery point, and any need for renewed design alignment.
10. Requires integration-owner revalidation after integration.

Self-application additionally requires:

- bootstrap changes to be authorized by the current control plane, not the candidate mechanism they create;
- candidate workers to be unable to alter their design, fixture, scorer, baseline, or admission rules;
- independent review before candidate control-path changes become active;
- no benchmark result to authorize its own adoption;
- the same setup, design, task, review, and human gates used for a consuming project.

## benchmark-review

The two-experiment distinction is correct and must be made exact:

| Experiment | Equal input |
| --- | --- |
| Workflow comparison | Same frozen human feature goal, seed project, risk envelope, budgets, model configuration where feasible, validators, and scoring; each workflow may perform its own documented design process. |
| Implementation-boundary comparison | Same frozen approved design revision, bounded task, seed project, validators, budgets, retry policy, and rubric. |

“Same planned design or equivalent input” is too vague and must be replaced by these two explicit protocols.

Additional requirements:

- Pin exact baseline and candidate revisions before each run.
- Freeze current and candidate setup procedures for a comparison round.
- Use separate consumer and runtime directories.
- Include normal, missing-dependency, stale-design, controlled-failure, and adversarial-scope cases.
- Predeclare safety-critical failures and advancement rules.
- Repeat paired runs enough to expose gross variance; do not claim statistical significance without a justified design.
- Record model/provider differences and other confounders rather than concealing them.
- Keep provider-reported cost separate from estimates or unavailable cost.
- Prevent candidate workers and implementers from changing fixtures or scores.
- Use an independent evaluator and preserve dissent.
- Treat setup success, human review effort, recovery behavior, and unsupported-host clarity as first-class measures.
- Do not treat success on one mock feature as proof of the complete long-term goal.

Provider benchmark data may inform later model shortlisting but does not enter the candidate workflow pass/fail rule.

## remaining-blockers

These block approval of the re-plan for the next target-design package:

1. Program-wide “entire implementation” scope is conflated with bounded-unit design approval.
2. The target agent roster mixes agents, assignments, validators, and fixtures and leaves setup/evaluation ownership unresolved.
3. The retained `thinking-companion` has no explicit target-roster placement.
4. The target skill catalog does not distinguish adopted roster, compatibility contracts, candidates, and deferred proposals.
5. Several live-to-target skill renames or merges lack explicit replacement and migration treatment.
6. The alternate-reviewer selection procedure is not concrete enough.
7. Total-rewrite reconsideration criteria are too restrictive.
8. Self-application bootstrap and non-self-authorization controls are incomplete.
9. Benchmark input equality remains ambiguous between workflow and implementation-boundary experiments.

Separate implementation blockers also remain: no aligned target package, design-link contract, named first-slice owners, selected feature, capability profile, pinned revisions, frozen fixture, or authorized task exists.

## required-user-decisions

After the above revisions are prepared, the user should decide:

1. Whether to approve **staged heavy refactoring with an evidence-based rewrite escape**, as recommended.
2. Whether full target architecture is approved once at the program level while implementation proceeds through separately approved bounded units, as recommended.
3. Whether to evolve `as-is.md` to hold explicitly separated current and approved target state, or retain current-only records with a separate frozen target package.
4. Which first feature to use: a new low-risk mock application feature, as recommended, or a qualifying existing backlog item.
5. Whether to adopt a versioned immutable bundle/package with thin host adapters as the external-consumption target, while permitting repository-local setup for the first comparison.
6. Whether existing design-orchestration plus `thinking-companion` is sufficient initially or a dedicated design/prototyping agent group should be created.
7. The final target agent roster, target skill pilot, and source-to-target migration table.
8. The benchmark rubric and advancement rule.

A concrete alternate reviewer should not be selected until the required provenance and local evaluation evidence can be obtained through an authorized process.

## required-revisions

1. Rewrite the scope interpretation to separate the complete target system from bounded implementation units.
2. Broaden the evidence conditions under which a total rewrite may later be proposed.
3. Recast the target agent roster into production agents, workflow assignments, human roles, validators, and fixtures.
4. Add explicit target ownership for setup, evaluation/scoring, migration coordination, and human-facing design facilitation.
5. Give `thinking-companion` an explicit target disposition.
6. Replace the target skill candidate catalog with a classified adopted/candidate/deferred roster.
7. Add an exact source-to-target mapping and compatibility/deprecation path for every renamed, merged, or replaced live contract.
8. Keep documentation adoption, host setup, and package consumption distinct.
9. Add the evidence-based alternate-reviewer selection procedure.
10. Specify the current/target `as-is.md` contract proposal and its bootstrap adoption path.
11. Separate workflow-comparison inputs from implementation-boundary-comparison inputs.
12. Add explicit self-application bootstrap and anti-self-authorization controls.
13. Preserve the active branch as the candidate/recovery boundary, `master` solely as pinned baseline, and no separate rollback machinery.
14. Correct the composable-skills count to 24 proposed reusable headings and label Terra’s expanded catalog as 28 reusable and 14 master entries before further comparison.

## residual-uncertainty

- Runtime conformance of launcher environment filtering, capability admission, worktree behavior, and external-effect restrictions was not tested.
- Exact Pi model identities and family provenance remain unknown.
- No provider API or benchmark source was contacted.
- External package installation and project isolation remain unproven.
- The exact planned-design serialization and task-control bootstrap remain undecided.
- The mock project, feature, directory placement, owners, baseline revision, candidate revision, and scoring fixture remain unselected.
- Future content-generation and general-task workflows may require different artifacts, experts, and verification semantics.
- Heavy refactoring remains the best current recommendation, not a proven final implementation strategy.

## explicit statement whether implementation may proceed

**Implementation may not proceed.**

The expanded re-plan must first be revised as specified. After that, it may return for approval solely as readiness to prepare the next human-facing target-design package. Human alignment on that package, adoption of the bounded design and launch controls, and separate authorization of an implementation task are still required before implementation.
