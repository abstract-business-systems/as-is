# Agentic Development System — Overall Realization Roadmap — Draft 5
Purpose: Provide a concise supporting program map from the accepted target direction through two construction-time realization flows, setup-inclusive evaluation, migration, adoption, and merge decisions.

## Orientation

Status: proposed successor planning artifact, ready for parent materialization and exact review; not human-accepted.

Accepted predecessor: the exact Draft-4 packet under `drafts/agentic-development-system-overall-realization-roadmap-draft4/`, which remains preserved evidence.

Accepted target direction: the exact draft-11 design packet identified by `drafts/agentic-development-system-high-level-design-draft11/review-manifest.md` and accepted in `reviews/agentic-development-system/target-design-human-review-acceptance-draft11.md`.

Draft 5 changes only the construction-time operating assignment and review clarification requested by the user. It does not change the accepted target architecture, make model names permanent roles, or authorize implementation.

**This roadmap authorizes no task creation, kick-off, implementation, agent launch, benchmark, migration, adoption, retirement, commit, merge, release, or external effect.**

## Program outcome

```text
human-facing design and prototyping
  → explicit human approval of the exact design-and-implementation envelope
  → implementation of the approved design through admitted bounded tasks
  → setup-inclusive evaluation against the current state of a pinned master baseline
  → explicit advancement, migration, target-adoption, retirement, and merge decisions
```

The program remains broader than sibling parallelism. It includes human-facing design and lifecycle governance, accepted agent and skill direction, current-versus-target representation, implementation packets, orchestration and authority, parent/child realization, assurance, host/setup, migration, evaluation, and eventual adoption.

## Human-facing review protocol

The primary human reading burden is `decision-brief.md`, not this supporting roadmap. The brief presents one decision, recommendation, consequences, key risks/blockers, the construction assignment, authority limits, and next action. It links to exact roadmap sections for progressive disclosure. The human need not read the full roadmap to make the planning decision, but material blockers and risks must remain visible in the brief.

The exact packet includes the model/review assignment because that assignment is substantive planning context. A review verdict, model identity, digest, or process result never grants authority.

## Construction-time role and review summary

These assignments apply to the construction exercise only. They are not a permanent target roster.

| Flow | Plan author and adviser | Implementation author | Plan reviewers before implementation | Result review | Deterministic validation |
| --- | --- | --- | --- | --- | --- |
| Coding/application-related flows | Terra | Luna | Sol plus external Kimi-family reviewer, both reviewing the same exact frozen plan | Terra reviews Luna's result; this is not independent because Terra authored/advised the flow | Separate protected, code-owned checks |
| Agents/skills-related flows | Sol | Terra | Sol plus external Kimi-family reviewer, both reviewing the same exact frozen plan | Sol reviews Terra's result; this is not independent because Sol authored/advised the flow | Separate protected, code-owned checks |

Sol participates in planning discussion for both flows. Sol's review of the agents/skills plan and result must disclose prior authorship/advice. Kimi's review is required for these two exact construction-time plans, but remains optional in the permanent target lifecycle. “Both plans” means only the top-level coding/application plan and agents/skills plan; derived child packets inherit their controls and do not automatically trigger another Kimi review unless the plan changes materially, an explicit instruction requires it, or risk handling requires it.

The human remains the decision holder for plan acceptance, kick-off, consequential exceptions, target adoption, retirement, benchmark advancement, and merge. Exact holders, model IDs, provider routes, budgets, capabilities, and task records are selected and admitted at the applicable gate.

## Coverage and sequence

| Sequence | Workstream | Required outcome before dependent transition |
| --- | --- | --- |
| 1 | Design governance and current-target representation | Accepted envelope, anchors, relationships, reopening rules, and human-facing views remain traceable. |
| 2 | Lifecycle, authority, and human interaction | Design, review, kick-off, admission, implementation, feedback, escalation, and closure remain distinct. |
| 3 | Coding/application flow | Terra-authored plan is reviewed by Sol/Kimi, accepted by the human, then realized by Luna with Terra advice and review. |
| 4 | Agents/skills flow | Sol-authored plan is reviewed by Sol/Kimi, accepted by the human, then realized by Terra with Sol advice and review. |
| 5 | Packets, planning, assurance, and first execution-control slice | Draft-6 controls are implemented only through an admitted bounded slice and used as applicable. |
| 6 | Host, setup, consumption, and isolation | Repository-local setup and separate baseline/candidate consumers are proven without overstated isolation. |
| 7 | Migration, compatibility, and recovery | Consumers, compatibility paths, recovery, and retirement gates are explicit. |
| 8 | Setup-inclusive benchmark and advancement | Equivalent paired runs against pinned `master` produce bounded evidence and a separate advancement decision. |
| 9 | Adoption, retirement, and merge | Exact scopes receive separate decisions and merge-target validation. |

Independent planning may proceed in parallel where inputs, ownership, and budgets are separate. Implementation and consequential transitions remain dependency-ordered.

## Program workstreams

### A. Design governance and current-target representation

Realize immutable design identity, current-versus-target labels, accepted-envelope linkage, component anchors, literal-link discovery, revision/supersession, unresolved-question classification, human-facing views, and migration relationships. Preserve current records until a reviewed compatibility path exists.

**Entry:** Accepted draft-11 identity and affected current anchors are available.

**Exit:** Each bounded plan names current authority, accepted target, relationship, realization status, owners, consumers, protected inputs, compatibility, validation, recovery, and Human Review reopening conditions.

**Stop:** Missing or contradictory anchors, silent current-record rewriting, unbounded consumers, or a material change to goal, boundary, authority, protected input, acceptance, risk, or external effect.

### B. Lifecycle, authority, and human interaction

Realize the three-phase lifecycle while distinguishing planning discussion, exact plan review, Human Review, kick-off, task preparation, task-control admission, implementation, validation, result review, candidate proof, benchmark approval, advancement, adoption, and merge. Use the concise brief and progressive disclosure rather than requiring full-roadmap reading.

**Stop:** Review is confused with approval, feedback silently changes active work, a decision holder is absent, or a blocking question lacks an owner and safe checkpoint.

### C. Coding/application realization flow

Terra is the accountable planning author and adviser. Terra prepares one bounded coding/application plan; Sol and external Kimi review the exact frozen plan; the human accepts or rejects that plan; Luna implements the admitted task; Terra advises during implementation and reviews Luna's result; deterministic validation remains separate; and an additional independent result reviewer is added if risk requires one.

Terra's result review is not independent because Terra authored/advised the plan and implementation. A design-changing implementation question stops the task and returns to planning or Human Review as applicable.

### D. Agents/skills realization flow

Sol is the accountable planning author and adviser. Sol prepares one bounded agents/skills plan; Sol and external Kimi review the exact frozen plan with Sol's prior involvement disclosed; the human accepts or rejects that plan; Terra implements the admitted task; Sol advises Terra and reviews Terra's result; deterministic validation remains separate; and an additional independent result reviewer is added if risk requires one.

Sol's plan and result reviews are not independent because Sol authored/advised the plan. Kimi provides the requested external-family plan challenge but does not approve the plan or authorize implementation.

### E. Packets, parent/child realization, assurance, and Draft-6 first slice

Every admitted task receives an exact bounded packet with accepted design and plan identities, scope, non-goals, dependencies, capabilities, protected inputs, acceptance, deterministic validation, result-review requirements, recovery, escalation, and stop conditions. Parent planning and child-plan preparation remain one parent task. Fresh child-scoped builders operate only within their own packets and component boundaries.

Frozen executable plan draft 6 is one first execution-control slice. It covers admission, reservations, safe concurrency, dependency invalidation, recoverable stopping, child-result integration safeguards, protected inputs, and parent closure. It is not the whole program. If draft 6 is used by either flow, its task packet must preserve the applicable Sol/Kimi plan-review requirement; the existing draft-6 Sol review does not by itself substitute for Kimi review of the later exact flow plans.

### F. Host, setup, consumption, and isolation

Create separately owned baseline and candidate copies from one protected mock-consumer seed in controlled distinct locations. Preserve unrelated configuration and project-local state. Make only evidence-supported claims; worktrees and prompts do not prove strong filesystem, network, credential, process, untrusted-project, installation, portability, upgrade, downgrade, uninstall, or production multi-project isolation.

### G. Migration, compatibility, and recovery

Inventory consumers before replacement or removal. Map current sources to accepted target treatment, preserve legacy behavior where migration is incomplete, migrate bounded consumers/components, and retain recovery. Inventory and compatibility planning may precede benchmarking; migration execution and retirement follow relevant candidate evidence and advancement unless explicitly excepted.

### H. Setup-inclusive benchmark and advancement

Freeze the common seed, current state of pinned `master`, candidate revision, feature, setup, host/runtime, exact model IDs and provider routes for both sides, generation settings, budgets, retries, deterministic checks, protected validators/scorer, rubric, safety policy, thresholds, permitted treatment differences, and report format. Run equivalent baseline and candidate cases. Record setup, correctness, scope discipline, human effort, operation, integration, evidence quality, design alignment, recovery, safety failures, cost, elapsed time, and unavailable observations.

The benchmark may support only claims about the tested scope and conditions. It does not authorize migration, adoption, retirement, or merge.

### I. Adoption, retirement, and merge

After a separate advancement decision, decide the exact migration scope, close compatibility and recovery obligations, decide target-contract/current-record adoption, decide source-artifact retirement separately, revalidate against the actual merge-target `master`, and obtain explicit merge authorization. A bounded compatible slice may merge before program closure only through an explicit decision and must not be described as full-target realization.

## Gates and authority

| Gate | Required evidence and decision | Does not authorize |
| --- | --- | --- |
| 0. Draft-5 planning decision | Exact five-file packet, caller freeze, final exact review, and human accept/revise/defer/reject decision | Any implementation or adoption |
| 1. Two exact flow plans | Terra coding plan and Sol agents/skills plan, each frozen and reviewed by Sol plus external Kimi | Implementation or task launch |
| 2. Flow-plan Human Review | Human decision on each exact plan/envelope | Kick-off or implementation |
| 3. Kick-off and task admission | Exact tasks, holders, Luna/Terra roles, models, provider routes, budgets, capabilities, protections, and deterministic admission | Unadmitted work or broader implementation |
| 4. Candidate structure readiness | Required Draft-6 structures and regressions pass | Benchmark, adoption, or merge |
| 5. Repository-local candidate proof | Provider-free candidate flow, setup/control evidence, result review, and residual-risk disposition | Benchmark execution |
| 6. Benchmark protocol approval | Frozen paired-run protocol and explicit human approval | Adoption or merge |
| 7. Benchmark and advancement | Reproducible results, safety accounting, bounded claims, and explicit advancement | Automatic migration, adoption, retirement, or merge |
| 8. Adoption and retirement | Consumer, compatibility, recovery, and exact human decisions | Merge |
| 9. Merge | Actual merge-target validation, clean scope, recovery, and explicit authorization | Full-program completion without closure evidence |

## Independence and conflict safeguards

A plan author may advise the implementation author and review the result as the user requested, but that review is not independent. Record the prior relationship explicitly. For agents/skills work, Sol's plan and result review must be labelled non-independent. For coding work, Terra's plan and result review must be labelled non-independent.

Sol's plan review of the agents/skills plan follows Sol's planning participation; use a fresh read-only invocation, disclose prior involvement, preserve Kimi's separate review, and escalate unresolved disagreement to the human. Kimi's external-family identity does not itself prove competence or independence; record exact identity, scope, provider route, budget, and limitations.

Add an independent result reviewer when risk, architecture, security, external effects, material disagreement, or project policy requires it. Deterministic validation is always separate and cannot be replaced by model confidence or plan review.

## Contradictions and unresolved dependencies

| Tension | Treatment |
| --- | --- |
| Historical Sol/Terra/Luna labels versus purpose-based target roles | Use the three names for this construction assignment only; target architecture keeps model identity replaceable and separate from authority. |
| Current configured presets versus requested construction models | Current presets describe the live system; exact construction model IDs/routes are selected and admitted at kick-off. Do not infer Luna's model ID. |
| Current parent-side integration versus target child-owned integration | Current behavior remains authoritative until separately validated migration; process-adapter ownership remains blocking for Draft 6. |
| Permanent alternate-family review versus requested Kimi reviews | No permanent target gate; Kimi review is required here for the two exact top-level flow plans because the user explicitly requested it. |
| Planner reviewing implementation | Retain the requested review, label it non-independent, and add independent result review when risk requires it. |
| Broad program versus first-slice controls | Draft 6 and sibling parallelism are one first-slice workstream; benchmark and program closure remain broader. |

Blocking before either implementation plan is admitted are complete exact plan identity, human decision, named human/task holders, exact task-level model/provider selection, budgets, capabilities, protected inputs, deterministic checks, and applicable result-review assignments. The agents/skills flow additionally requires Sol/Kimi plan review; the coding flow additionally requires Sol/Kimi plan review; each flow must preserve its exact plan-review record.

## Pilot versus program closure

**Pilot-scope closure:** the selected candidate slice passes its focused structures, provider-free fixture/setup proof, baseline regression, deterministic validation, required result review, residual-risk disposition, and approved paired benchmark if run. Claims remain limited to that slice.

**Program-scope closure:** the accepted broad target has been realized or explicitly deferred by authorized decisions, including lifecycle and current-target representation, accepted agent/skill direction, both construction flows as applicable, packets and authority controls, assurance, host/setup commitments, migration/compatibility, and evaluation/adoption decisions. Deferred future workloads and unsupported isolation/distribution claims remain visible and are not called complete.

## Practical benchmark and merge criteria

The branch is benchmarkable for a pilot workflow comparison only after candidate behavior exists, focused checks and baseline regressions pass, both required setup/proof inputs are controlled, the seed/feature/baseline/candidate revisions are frozen, equivalent conditions are defined, protected scoring is in place, and the user approves the exact benchmark protocol and advancement rule.

A merge with `master` is justified only after bounded candidate evidence supports the tested claims, required compatibility and consumer dispositions are complete, target adoption is explicitly decided, the candidate is revalidated against the actual merge target, focused/regression/setup/candidate checks pass there, recovery remains available, and the exact merge is explicitly authorized. A merge before full program closure must be described as a bounded compatible advancement.

## Explicit exclusions and residual risk

This roadmap does not authorize implementation, task creation, worker launch, benchmark execution, target adoption, artifact retirement, commit, merge, provider efficacy, independent package distribution, upgrades, downgrades, uninstall, portability, untrusted-project operation, or complete filesystem/network/credential/process isolation. It does not make Kimi a permanent target-system gate or claim that model identity grants authority.

Residual risks include planner-review conflicts, uncertain Kimi-family independence, unavailable exact models/holders, incomplete consumer inventory, current-target confusion, unresolved integration ownership, setup leakage, weak isolation, score sensitivity, cost-data gaps, migration duplication, merge-target drift, and false generalization from a pilot.

## Next safe action

Parent materializes this proposed five-file Draft-5 packet, computes exact identities in a separate freeze record, and obtains one bounded final exact review. If that review passes, present only `decision-brief.md` for one Human Review decision. If accepted, prepare exactly two top-level flow plans—coding/application and agents/skills—and obtain Sol plus external Kimi review of each exact frozen plan before implementation preparation. Do not create tasks, launch workers, implement, benchmark, adopt, retire, merge, or claim full-program realization.

startsWork: false
