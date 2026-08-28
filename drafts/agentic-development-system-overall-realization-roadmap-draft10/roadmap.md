# Agentic Development System — Overall Realization Roadmap — Draft 10
Purpose: Provide a concise supporting program map from the accepted target direction through two corrected construction-time realization flows, setup-inclusive evaluation, migration, adoption, and merge decisions.

## Orientation

Status: sole proposed successor to the Draft-9 packet; pending parent materialization, exact identity recording, final exact review, and Human Review. Draft 10 is not accepted.

Immediate proposed predecessor: the exact five-file Draft-9 packet under `drafts/agentic-development-system-overall-realization-roadmap-draft9/`. Draft 9 remains preserved but was not human-accepted.

Accepted controlling predecessor: the exact Draft-3 packet under `drafts/agentic-development-system-overall-realization-roadmap-draft3/`, with its freeze, final exact review, and Human Review acceptance records.

Accepted target direction: the exact Draft-11 design packet identified by `drafts/agentic-development-system-high-level-design-draft11/review-manifest.md` and accepted in `reviews/agentic-development-system/target-design-human-review-acceptance-draft11.md`.

Draft 10 corrects the Draft-9 construction assignment. It does not change the accepted target architecture, make construction assignments permanent roles, or authorize implementation.

**This roadmap authorizes no task creation, kick-off, implementation, agent launch, benchmark, migration, adoption, retirement, commit, merge, release, or external effect.**

## Program outcome

```text
human-facing design and prototyping
  → explicit human approval of the exact design-and-implementation envelope
  → implementation through admitted bounded tasks
  → setup-inclusive evaluation against the current state of a pinned master baseline
  → explicit advancement, migration, target-adoption, retirement, and merge decisions
```

The program remains broader than sibling parallelism and frozen executable plan draft 6. It includes human-facing design, lifecycle and authority, accepted agent and skill direction, current-versus-target representation, construction planning, implementation packets, orchestration, assurance, host/setup concerns, migration, evaluation, adoption, and closure.

## Human front door

`decision-brief.md` is the primary human reading surface. It presents one planning decision, the corrected two-flow assignment, consequences, blockers, authority limits, and next action. This roadmap and `model-and-review-assignment.md` provide supporting detail through linked sections.

A review verdict, model identity, digest, or completed process never grants authority.

## Construction-time role summary

These assignments apply only to this construction exercise. They are not a permanent target-system roster.

| Flow | Accountable plan author and implementation adviser | Implementation author | Exact-plan review before implementation | Human exact-plan decision | Implementation-result review | Deterministic validation |
| --- | --- | --- | --- | --- | --- | --- |
| Coding/application | Terra | Luna | No Sol or Kimi plan-review gate. Terra may optionally consult Sol when needed and must record that advisory input if used. | Required | Terra reviews Luna’s result; explicitly non-independent | Separate protected code-owned checks |
| Agents/skills | Sol | Terra | External Kimi review of the same exact frozen plan; Sol is the author, not a separate reviewer of that plan | Required after Kimi review | Sol reviews Terra’s result; explicitly non-independent | Separate protected code-owned checks |

“Both plans” means exactly the coding/application top-level flow plan and the agents/skills top-level flow plan.

Derived child packets inherit the controls of their applicable top-level plan. They do not automatically trigger Kimi review unless a material plan change, explicit instruction, or applicable risk process requires it. Coding-derived work does not acquire Kimi review merely because the separate agents/skills plan requires Kimi.

The human remains the decision holder for each exact plan, kick-off, consequential exceptions, benchmark protocol, advancement, adoption, retirement, and merge. Exact human holders, models, provider routes, budgets, capabilities, validators, reviewers, integration owners, and task records are selected and admitted at the applicable gate.

## Program sequence

| Sequence | Workstream | Required outcome before dependent transition |
| --- | --- | --- |
| 1 | Design governance and current-target representation | Accepted identities, anchors, relationships, reopening rules, and human-facing views remain traceable. |
| 2 | Lifecycle, authority, and interaction | Planning, review, Human Review, kick-off, admission, implementation, validation, integration, and closure remain distinct. |
| 3 | Coding/application flow | Terra authors the exact plan; any optional Sol advice is recorded; the human decides the exact plan; Luna implements with Terra advice and review. |
| 4 | Agents/skills flow | Sol authors and freezes the exact plan; Kimi reviews that exact plan; the human then decides it; Terra implements with Sol advice and review. |
| 5 | Packets, assurance, and first execution-control slice | Derived packets preserve their applicable flow controls; draft 6 remains a bounded first slice. |
| 6 | Host, setup, consumption, and isolation | Separate baseline and candidate consumers are proven under controlled, honestly stated conditions. |
| 7 | Migration, compatibility, and recovery | Consumers, compatibility paths, recovery, and retirement gates are explicit. |
| 8 | Setup-inclusive benchmark and advancement | Equivalent paired runs against pinned `master` produce bounded evidence and a separate advancement decision. |
| 9 | Adoption, retirement, merge, and closure | Exact scopes receive separate adoption, retirement, merge, pilot-closure, and program-closure decisions. |

Independent planning may proceed in parallel where inputs, ownership, and budgets are separate. Implementation and consequential transitions remain dependency-ordered.

## Coding/application flow

Terra is the accountable coding/application plan author and implementation adviser. Luna is the implementation author.

1. Terra prepares one bounded coding/application plan with exact scope, dependencies, protected inputs, acceptance, deterministic validation, recovery, escalation, result-review requirements, and current-versus-target treatment.
2. Terra may consult Sol only when Terra determines architectural advice is needed. If consultation occurs, record the exact consultation identity, scope, advice, limitations, Terra’s disposition, and any resulting plan revision.
3. Optional Sol consultation is advisory input. It does not make Sol an author, co-author, approver, or plan reviewer.
4. Kimi has no role in the coding/application flow, including planning, plan review, implementation advice, deterministic validation, result review, integration, or closure.
5. No separate model plan reviewer is assigned beyond Terra’s planning responsibility. Do not invent a replacement reviewer.
6. The human reviews and accepts, requests revision, defers, or rejects the exact frozen Terra plan before implementation.
7. A separately authorized kick-off and exact task-control admission are still required.
8. Luna implements only the admitted task. Terra advises within the accepted envelope and cannot silently change scope, architecture, acceptance, protected inputs, or risk.
9. Terra reviews Luna’s actual result. That review is labelled non-independent because Terra authored the plan and advised implementation.
10. Deterministic validation remains separate. Add an independent result reviewer when architecture, security, external effects, disagreement, policy, or other material risk requires one.

A design-changing question or material change after Human Review stops affected work and returns to planning or Human Review. Optional Sol consultation does not satisfy any required risk-triggered independent result review.

## Agents/skills flow

Sol is the accountable agents/skills plan author and implementation adviser. Terra is the implementation author.

1. Sol prepares and freezes one bounded agents/skills plan with exact scope, dependencies, protected inputs, acceptance, deterministic validation, migration, recovery, escalation, result-review requirements, and current-versus-target treatment.
2. Sol seeks external Kimi review of that same exact frozen plan. Kimi’s review is advisory and cannot approve the plan or authorize implementation.
3. If Kimi findings cause a material plan change, freeze the successor exact agents/skills plan and obtain Kimi review of that revision before Human Review.
4. The human reviews and accepts, requests revision, defers, or rejects the same exact plan after the Kimi review.
5. A separately authorized kick-off and exact task-control admission are still required.
6. Terra implements only the admitted agents/skills task. Sol advises Terra within the accepted envelope.
7. Sol reviews Terra’s actual result. That review is labelled non-independent because Sol authored the plan and advised implementation.
8. Deterministic validation remains separate. Add an independent result reviewer when architecture, security, external effects, disagreement, policy, or other material risk requires one.
9. Kimi is not an implementation-result reviewer by default and is not required for integration or closure.

The Kimi requirement exists solely because of the explicit construction instruction for the exact agents/skills plan. It is not a permanent target-system gate.

## Derived packets and first-slice controls

Every admitted task receives an exact bounded packet containing accepted design and plan identities, scope, non-goals, ownership, dependencies, capabilities, protected inputs, acceptance, deterministic validation, result-review requirements, recovery, escalation, and stop conditions.

A derived child packet inherits the controls of its source top-level flow:

- coding/application children retain Terra planning responsibility, mandatory Human Review of the top-level exact plan, Terra’s disclosed non-independent result review, and risk-triggered independent review; they do not inherit Kimi;
- agents/skills children retain the reviewed and human-decided top-level Sol plan, Sol’s disclosed non-independent result review, and risk-triggered independent review; they do not automatically receive another Kimi review.

A material change to the applicable top-level plan requires a newly identified plan and the review path belonging to that flow.

Frozen executable plan draft 6 is one focused execution-control slice covering admission, reservations, safe sibling concurrency, dependency invalidation, recoverable stopping, child-result integration safeguards, protected inputs, and parent closure. It is not the whole program and has not been accepted for implementation. Its final Sol review does not substitute for Human Review of either later flow plan or Kimi review of the later exact agents/skills plan.

## Broader workstream map

### Design governance and lifecycle

Preserve immutable design identity, current-versus-target labels, component anchors, literal-link planning, revision and supersession, unresolved-question classification, concise human-facing views, and explicit authority transitions.

### Agent, skill, and orchestration realization

Implement the accepted Draft-11 dispositions without treating Luna, Terra, Sol, or Kimi as permanent target roles. Preserve current contracts until bounded migration and adoption evidence exists. Skills provide procedures and never grant tools, task authority, delegation, integration, or completion authority.

### Host, setup, and isolation

Create separately owned baseline and candidate copies from one protected seed in controlled distinct locations. Preserve unrelated configuration and project-local state. Do not overstate worktree, prompt, filesystem, network, credential, process, installation, portability, upgrade, downgrade, uninstall, or multi-project isolation.

### Migration, compatibility, and recovery

Inventory consumers before replacement or removal. Map current sources to target treatment, preserve compatibility where migration is incomplete, retain recovery, and retire only after explicit evidence and decision. Inventory and compatibility planning may precede benchmarking; migration execution and retirement follow applicable candidate evidence and advancement unless explicitly excepted.

### Setup-inclusive benchmark and advancement

Freeze the seed, current state of pinned `master`, candidate revision, feature, setup, exact models and provider routes for both sides, generation settings, budgets, retries, deterministic checks, protected validators and scorer, rubric, safety policy, thresholds, permitted treatment differences, and report format.

Run equivalent baseline and candidate cases. Record setup, correctness, scope discipline, human effort, operation, integration, evidence quality, design alignment, recovery, safety failures, cost, elapsed time, and unavailable observations.

Benchmark evidence supports only the tested scope and conditions. It does not authorize migration, adoption, retirement, or merge.

### Adoption, retirement, merge, and closure

After a separate advancement decision, decide the exact migration scope, compatibility obligations, target-contract and current-record adoption, source-artifact retirement, merge-target revalidation, and exact merge authorization. A bounded compatible slice may advance before program closure only through an explicit decision and must not be described as full-target realization.

## Gates and authority

| Gate | Required evidence and decision | Does not authorize |
| --- | --- | --- |
| 0. Draft-10 planning decision | Exact five-file packet, parent-recorded identity, final exact review, and human accept/revise/defer/reject decision | Implementation, adoption, or merge |
| 1. Coding/application plan | Exact Terra-authored plan; optional Sol consultation recorded if used; no Sol or Kimi plan review | Implementation |
| 2. Coding/application Human Review | Human decision on the exact Terra plan | Kick-off or task launch |
| 3. Agents/skills plan review | Exact frozen Sol-authored plan and external Kimi review of that same revision | Human acceptance or implementation |
| 4. Agents/skills Human Review | Human decision on the exact Kimi-reviewed plan | Kick-off or task launch |
| 5. Kick-off and task admission | Exact tasks, holders, models, routes, budgets, capabilities, protections, validators, reviewers, and integration owners | Unadmitted work |
| 6. Candidate structure readiness | Required first-slice structures and focused regressions pass | Benchmark, adoption, or merge |
| 7. Repository-local candidate proof | Provider-free candidate flow, setup/control evidence, result review, and residual-risk disposition | Benchmark execution |
| 8. Benchmark protocol approval | Frozen paired-run protocol and explicit human approval | Advancement, adoption, or merge |
| 9. Benchmark and advancement | Reproducible results, safety accounting, bounded claims, and explicit advancement decision | Automatic migration, adoption, retirement, or merge |
| 10. Adoption and retirement | Consumer, compatibility, recovery, and exact human decisions | Merge |
| 11. Merge and closure | Actual merge-target validation, clean scope, recovery, explicit merge authorization, and separate pilot/program closure evidence | Unsupported full-program completion claim |

## Review independence and validation safeguards

- Terra’s coding result review is non-independent because Terra authored the plan and advised Luna.
- Sol’s agents/skills result review is non-independent because Sol authored the plan and advised Terra.
- Sol does not review the coding plan. Optional coding consultation must not be relabelled as plan review.
- Sol is the agents/skills plan author, not a separate independent reviewer of that plan; Kimi supplies the required external plan challenge.
- Kimi’s family label does not itself prove competence, independence, suitability, or authority.
- Kimi is not a default implementation-result reviewer in either flow.
- Deterministic validation is separate from planning advice, plan review, semantic result review, model confidence, and process exit.
- Add an independent result reviewer when risk, architecture, security, external effects, material disagreement, or policy requires it.
- Advice cannot silently change scope, acceptance, architecture, protected inputs, risk, or permitted external effects.
- Model identity, role identity, reviewer identity, integration ownership, and decision authority remain separate.

## Current, target, and construction distinctions

| Layer | Status |
| --- | --- |
| Current live contracts | Current `agents/*`, `skills/*`, task-control, adapter, and configuration records remain current authority. |
| Accepted target | Draft 11 remains accepted target direction but is not current implementation or adopted live contract. |
| Construction assignment | Terra/Luna and Sol/Terra flows, plus the limited agents/skills Kimi review, apply only to this realization exercise. |
| Exact task assignment | Models, routes, budgets, capabilities, holders, validators, reviewers, and integration owners are selected at the applicable gate. |

Current configuration records provider default `openrouter` and preset aliases. Current role presets and historical observations of `openai/gpt-5.6-sol`, `openai/gpt-5.6-terra`, and `moonshotai/kimi-k3` are evidence only. No Luna model ID is established. Do not invent one.

## Contradictions and unresolved dependencies

| Source tension | Recorded treatment |
| --- | --- |
| Draft 9 assigns Sol and Kimi to coding-plan review and says Sol participates directly in both planning flows. | The user’s current correction supersedes that construction arrangement for Draft 10: coding has no Sol or Kimi plan-review gate; Sol consultation is optional advisory input only; Kimi has no coding role. Draft 9 remains preserved evidence. |
| The original brief’s historical Terra-Sol revision loop and alternate-family review describe earlier design construction. | Retain as historical provenance, not the corrected coding/application flow and not a permanent target gate. |
| Draft 11 excludes alternate-family review as a generic target requirement, while this construction instruction requires Kimi for one later plan. | Preserve Draft 11. Treat Kimi as an explicit, temporary requirement only for the exact agents/skills plan. |
| Historical Draft-36 records propose a broader Kimi package-review chain. | Treat the bundle and commit `4f1dc0f6c56db145c634d1a673f5e380299ded8e` as advisory and inconsistent history only. |
| Current component-builder contracts use receiving-builder parent-side review and integration, while Draft 11 proposes child-owned verification and integration. | Current behavior remains authoritative until a separately validated migration; the process-adapter ownership boundary remains blocking for the Draft-6 path. |
| Current configured concurrency is one, while the focused first slice explores safe sibling parallelism. | Treat current configuration as current input and sibling parallelism as a candidate first-slice control, not present capability or whole-program scope. |
| The requested Draft-9 final exact-review path is absent from the current checkout inspected for Draft 10. | Record the review as unavailable rather than reconstructing it. The parent must preserve or recover it if available and must not claim it was inspected without evidence. |

Before implementation admission, blockers include exact plan identity, the applicable review path, Human Review, named human and task holders, exact task-level model/provider selection, budgets, capabilities, protected inputs, deterministic checks, result-review assignments, integration ownership, and recovery. The Draft-6 process-adapter path additionally remains blocked on its recorded ownership decision.

## Pilot and program closure

**Pilot-scope closure:** the selected candidate slice passes focused structures, provider-free fixture/setup proof, baseline regressions, deterministic validation, required result review, residual-risk disposition, and any approved paired benchmark. Claims remain limited to that slice.

**Program-scope closure:** the accepted broad target is realized or explicitly deferred through authorized decisions, including lifecycle and current-target representation, accepted agent/skill direction, both construction flows as applicable, packets and authority controls, assurance, host/setup commitments, migration and compatibility, and evaluation/adoption decisions.

## Explicit exclusions and residual risk

This roadmap does not authorize implementation, task creation, launch, benchmark execution, migration, target adoption, current-record replacement, artifact retirement, commit, merge, provider efficacy claims, package distribution, upgrades, downgrades, uninstall, portability, untrusted-project operation, or complete filesystem/network/credential/process isolation.

Residual risks include non-independent planner/result review, optional-consultation ambiguity, uncertain Kimi suitability, unavailable exact models or holders, incomplete consumer inventory, current-target confusion, unresolved integration ownership, setup leakage, weak isolation, score sensitivity, cost-data gaps, migration duplication, merge-target drift, unavailable Draft-9 review provenance, and false generalization from a pilot.

## Next safe action

The parent records this response as the sole five-file Draft-10 successor, computes exact identities in a separate freeze record, and obtains one bounded final exact review. If the exact review finds no blocker, the parent presents only `decision-brief.md` for one Human Review planning decision.

If Draft 10 is accepted, prepare exactly two top-level flow plans. Apply the coding/application review path without Sol or Kimi plan review. Apply external Kimi review only to the exact frozen agents/skills plan, followed by Human Review. Do not create tasks, launch workers, implement, benchmark, migrate, adopt, retire, commit, merge, or claim acceptance from this roadmap.

startsWork: false
===== END ARTIFACT A: roadmap.md =====
