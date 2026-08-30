# Agentic Development System — Overall Realization Roadmap — Draft 4
Purpose: Provide a progressive-disclosure, program-wide continuation map from the accepted target direction through bounded implementation, setup-inclusive evaluation, migration, adoption, and merge decisions.

## Orientation

### Status and authority

Status: proposed successor planning artifact, ready for parent materialization and exact review; not human-accepted.

Accepted predecessor: the exact Draft-3 packet under `drafts/agentic-development-system-overall-realization-roadmap-draft3/`, accepted for planning navigation on 2026-08-28 and identified by `reviews/agentic-development-system/overall-realization-roadmap-draft3-freeze.md`.

Accepted target direction: the exact draft-11 design packet identified by `drafts/agentic-development-system-high-level-design-draft11/review-manifest.md` and accepted in `reviews/agentic-development-system/target-design-human-review-acceptance-draft11.md`.

Draft 4 preserves Draft 3 as predecessor evidence. It changes presentation and operational model/role clarity; it does not claim that the user has accepted Draft 4 or that any target contract has been implemented, migrated, adopted, or made current.

Current `as-is.md` records, live agent and skill contracts, task-control contracts, implementation, and configured model presets remain current-state authority until separately authorized migration and adoption.

**This roadmap authorizes no task creation, kick-off, implementation, agent launch, benchmark, migration, adoption, retirement, commit, merge, release, or external effect.**

### Program outcome

```text
human-facing design and prototyping
  → explicit human approval of the exact design-and-implementation envelope
  → implementation of the approved design through admitted bounded tasks
  → setup-inclusive evaluation against the current state of a pinned master baseline
  → explicit advancement, migration, target-adoption, retirement, and merge decisions
```

The accepted draft-11 agent and skill dispositions remain target direction, not current realization. Draft 6 remains a narrow first execution-control slice. Sibling parallelism remains a minor execution clarification, not the whole program.

### Human-facing review protocol

The primary human reading burden is `decision-brief.md`, not this roadmap.

For each human planning decision:

1. Present one concise brief containing only the current decision, recommendation, material consequences, key risks, authority limits, and next safe action.
2. Request one decision over one exact frozen packet: accept, request revision, defer, or reject.
3. Do not require the human to read the complete roadmap to decide.
4. Link questions and concerns to exact roadmap sections for progressive disclosure. The brief should point directly to [`Model and role orientation`](#model-and-role-orientation), [`First execution-control slice: Draft 6`](#e-first-execution-control-slice-draft-6), and [`Gates`](#gates).
5. Keep scope, blockers, deviations, residual risks, external effects, and current-versus-target status visible in the brief; progressive disclosure must not hide them.
6. Preserve exact packet membership and caller-computed identities in a separate freeze record so deeper review remains reproducible.
7. Do not infer approval from silence, review completion, model output, a digest, or a process result.

This protocol defines information presentation, not a user interface.

### Coverage and sequence

| Sequence | Workstream | Required outcome before dependent transition |
| --- | --- | --- |
| 1 | A. Design governance and current-target representation | Exact accepted envelope, component anchors, relationships, and reopening rules remain traceable. |
| 2 | B. Lifecycle, authority, and human interaction | Review, kick-off, admission, implementation, feedback, escalation, and closure remain distinct. |
| 3 | C. Agent and skill realization | Accepted draft-11 dispositions receive consumer-backed implementation and migration plans. |
| 4 | D. Packets, planning, and assurance | Bounded packets, protected inputs, validation, recovery, and independent evidence paths are defined. |
| 5 | E. Draft-6 first execution-control slice | Provider-free candidate controls are implemented and validated through separately authorized tasks. |
| 6 | F. Host, setup, consumption, and isolation | Repository-local setup and separate baseline/candidate consumers are proven without overstated isolation. |
| 7 | G. Migration, compatibility, and recovery | Consumers, compatibility paths, recovery, and retirement gates are explicit. |
| 8 | H. Setup-inclusive benchmark and advancement | Equivalent paired runs against pinned `master` produce bounded evidence and a separate advancement decision. |
| 9 | I. Adoption, retirement, and merge | Exact adoption, retirement, and merge scopes receive separate decisions and merge-target validation. |

Independent planning may proceed in parallel where inputs, ownership, and budgets are separate. Implementation and consequential transitions remain dependency-ordered.

### Model and role orientation

Model identity is replaceable and never grants authority.

| Function | First-pilot recommendation | Current configuration or evidence | Selection status |
| --- | --- | --- | --- |
| Design/planning advice | Authorized planning owner authors; a separate read-only expert may advise. | `expert` uses `large` → `@preset/abs-large`; historical Terra used `openai/gpt-5.6-terra` through the expert contract. | Exact model and holder not selected until kick-off; Terra history is advisory evidence, not authority. |
| Implementation | Use the lower-cost admitted `worker`, or a child-scoped `component-builder` when the component hierarchy requires a separately owned child builder. | Both use `medium` → `@preset/abs-medium`. | Exact role, model ID, provider route, and worker remain unselected until task preparation and admission. |
| Deterministic evidence validation | Use `evidence-validator` against protected, code-owned checks. | `evidence-validator` uses `large` → `@preset/abs-large`. | Validator holder and exact model ID remain unselected until kick-off. |
| Semantic/result review | Assign an independent `expert` or separately admitted evidence-review role, distinct from the implementation worker. | `expert` and `evidence-validator` use `large` → `@preset/abs-large`. | Exact reviewer remains unselected. |
| Architecture/high-risk review | Use `expert`; use the Sol model only when explicitly assigned for that bounded review. | Historical Sol used `openai/gpt-5.6-sol` through a read-only reviewer contract. | Sol is not a permanent roster member and is not selected by this roadmap. |
| Integration and receiving ownership | Follow the current component/task authority until an accepted target transition is implemented and adopted. | Current `component-builder` owns parent-side review/integration; draft 11 proposes child-owned validation/integration and parent accounting. | The contradiction remains an explicit transition dependency. |
| Evaluation/scoring | Name an independent accountable owner; keep seed, rubric, validators, and scorer outside candidate write scope. | No permanent model assignment is established. | Holder, exact model, route, and protocol remain unselected. |
| Alternate-family review | None by default. | `moonshotai/kimi-k3` was used for transitional historical reviews. | Not selected; use only if explicitly requested or newly justified. |

Operational detail is provided in the companion `model-and-review-assignment.md`. The exact four-file Draft-4 decision packet remains independently reviewable without that companion.

## Detailed program map

### A. Design governance and current-target representation

Realize immutable design identity, current-versus-target labels, accepted-envelope linkage, component anchors, literal-link discovery, revision and supersession rules, unresolved-question classification, and migration relationships.

**Entry:** Accepted draft-11 identity and affected current anchors are available.

**Exit:** Each bounded realization plan names current authority, accepted target, relationship, realization status, owners, consumers, protected inputs, compatibility, validation, recovery, and Human Review reopening conditions.

**Stop:** Missing or contradictory anchors, silent current-record rewriting, unbounded consumers, or a change to goal, boundary, authority, protected input, acceptance, risk, or permitted external effect.

### B. Lifecycle, authority, and human interaction

Realize the three-phase lifecycle while distinguishing Human Review, detail planning, kick-off, task preparation, task-start handoff, task-control admission, implementation, validation, feedback, candidate proof, benchmark approval, advancement, adoption, and merge.

Use the progressive-disclosure protocol above for human decisions and status. Feedback that changes the accepted envelope returns to design and, when consequential, renewed Human Review.

**Exit:** Every transition records the exact revision, decision holder, authority basis, result, blockers, and next action and fails closed when authority or required evidence is absent.

### C. Accepted agent and skill direction

Implement the accepted draft-11 dispositions without treating them as live contracts:

- modify `as-is` toward a non-implementing human/orchestration front face;
- retain and adapt `component-builder` and `evidence-validator`;
- retain `execution-advisor`;
- retain and compose `expert`;
- deprecate and replace `thinking-companion` only after consumer-backed migration;
- defer the distinct `worker` replacement decision;
- introduce the accepted design/prototyping role through a bounded, named implementation and migration plan;
- preserve the accepted skill disposition tables and proposed compositions; and
- keep skills procedural, with no authority or tool-granting power.

Each changed role or skill requires source-to-target mapping, consumers, owner, capability profile, compatibility, focused validation, recovery, and an explicit adoption or retirement gate.

### D. Implementation packets, planning, and assurance

Realize detailed child packets containing the exact envelope and task revision, bounded outcome, non-goals, component scope, allowed and prohibited paths, dependencies, capabilities, protected inputs, acceptance, validation, evidence, budget, recovery, escalation, and stop conditions.

The worker or child builder implements within the admitted packet and does not rediscover architecture or invent requirements. Deterministic checks and separately assigned review provide evidence independent of model confidence.

**Stop:** Contradictory packet, missing dependency, unavailable capability, scope expansion, protected-input conflict, substituted validation, or unresolved authority.

### E. First execution-control slice: Draft 6

Draft 6 is the frozen, reviewed first execution-control plan, not program closure. Its exact Human Review remains the next proposed gate.

Its bounded candidate scope covers:

- deterministic plan admission;
- parent allocation and atomic per-component reservation;
- safe concurrency only for independent children;
- dependency invalidation and recoverable stopping;
- queue freshness;
- mechanically bounded child-result application after the process-adapter ownership decision;
- protected-input and unrelated-file controls;
- fail-closed parent closure; and
- provider-free `dummy-delegation` evidence after prerequisite structures pass.

Draft 6 does not include setup-inclusive benchmarking, broad roster migration, target adoption, or program completion. Exact workers, task-level models, provider routes, budgets, and human holders remain kick-off and admission facts.

### F. Host, setup, consumption, and isolation

Create separately owned baseline and candidate copies from one protected mock-consumer seed in controlled distinct locations. Preserve unrelated configuration and project-local state.

Make only evidence-supported claims. Worktrees and prompts do not prove filesystem, network, credential, process, untrusted-project, installation, portability, upgrade, downgrade, uninstall, or production multi-project isolation.

**Exit:** Repository-local setup is repeatable, protected controls are unchanged, state does not leak between copies, limitations are explicit, and unexpected credentials or external effects cause failure.

### G. Migration, compatibility, and recovery

Inventory consumers before replacement or removal. Map each current source to its accepted target treatment, preserve legacy behavior where migration is incomplete, migrate one bounded consumer or component at a time, and retain recovery.

Inventory and compatibility planning may precede benchmarking. Migration execution and artifact retirement follow relevant candidate evidence and advancement unless an explicit bounded exception is approved.

**Stop:** Incomplete consumer inventory, missing recovery, unreviewed behavior divergence, or evaluated revision drift.

### H. Setup-inclusive benchmark and advancement

Before execution, freeze:

- protected seed and feature;
- current state of the pinned `master` baseline revision;
- candidate revision;
- setup and host/runtime conditions;
- exact model identifiers, provider routes, generation settings, budgets, retries, and failure policy;
- deterministic checks and acceptance tests;
- protected validators, rubric, scorer, thresholds, and advancement rule; and
- permitted treatment differences and report format.

Run equivalent baseline and candidate cases. Record setup, correctness, scope discipline, human effort, operation, integration, evidence quality, design alignment, recovery, safety failures, cost, elapsed time, and unavailable observations.

A result supports only claims about the tested slice and conditions. Benchmark success does not authorize migration, adoption, retirement, or merge.

### I. Adoption, retirement, and merge

After a separate advancement decision:

1. decide the exact migration scope;
2. close compatibility and recovery obligations;
3. decide whether to adopt exact target contracts or update current records;
4. decide separately whether any source artifact may be retired;
5. revalidate the candidate against the actual merge-target `master` revision; and
6. obtain explicit merge authorization for the exact clean scope.

A bounded compatible slice may merge before program closure only through an explicit decision and must not be described as full-target realization.

## Gates

| Gate | Required evidence and decision | Does not authorize |
| --- | --- | --- |
| 0. Draft-4 planning decision | Exact four-file packet, caller freeze, final exact review, and human accept/revise/defer/reject decision | Any implementation or adoption |
| 1. Bounded detail-plan closure | Owners, dependencies, protected inputs, acceptance, validation, recovery, and role/model needs | Task creation or launch |
| 2. Draft-6 Human Review | Human decision over the exact frozen first-slice plan | Kick-off or implementation |
| 3. Kick-off and task admission | Exact tasks, human holders, workers, models, provider routes, budgets, capabilities, protections, and deterministic admission | Unadmitted or broader work |
| 4. Candidate structure readiness | Focused candidate controls and regressions pass | Benchmark readiness or target adoption |
| 5. Repository-local candidate proof | Provider-free flow, setup/control evidence, review, and residual-risk disposition | Benchmark execution |
| 6. Benchmark protocol approval | Frozen paired-run protocol and explicit human approval | Adoption or merge |
| 7. Benchmark and advancement | Reproducible results and explicit bounded advancement decision | Migration, retirement, adoption, or merge |
| 8. Adoption and retirement | Consumer, compatibility, recovery, and exact human decisions | Merge |
| 9. Merge | Actual merge-target validation, clean scope, recovery, and explicit authorization | Full-program completion without closure evidence |

## Contradictions and unresolved dependencies

| Record tension | Current treatment |
| --- | --- |
| Historical Sol/Terra/Luna handoffs assign architecture, planning, implementation, and review responsibilities, while draft 11 rejects fixed model identities as architecture roles. | Preserve Sol/Terra/Luna as historical proposed roles and transitional assignments only. Select purpose-based roles and exact models per task. |
| Historical draft 36 retained the worker and used design orchestration as a workflow assignment; accepted draft 11 introduces a design/prototyping agent and defers the worker replacement decision. | Draft 11 controls target direction. Draft 36 remains advisory implementation detail where non-conflicting. |
| Historical draft 36 made Kimi review a pending gate; accepted draft 11 removes alternate-family review as a target requirement. | No permanent Kimi gate. Prior Kimi evidence remains preserved provenance. |
| Current `component-builder` owns parent-side semantic review and integration; draft 11 proposes child-owned validation/integration and parent accounting. | Current behavior remains authoritative. Draft 6 may build candidate mechanics only after the process-adapter owner decision and separately authorized tasks. |
| Historical draft 36 proposed a setup-inclusive mock feature as the first proof; owner selection and draft 6 choose provider-free `dummy-delegation` and exclude setup from that slice. | Treat `dummy-delegation` as the narrow control pilot and setup-inclusive comparison as a later required program gate. |
| Draft 3 is accepted but places excessive human reading burden on a large roadmap. | Preserve Draft 3 and replace the front door through this proposed progressive-disclosure successor; no acceptance is inferred. |
| Draft 3 does not assign implementation, planning/advice, validation, semantic review, architecture review, integration, or evaluation roles/models. | Draft 4 supplies explicit recommendations while leaving exact task-level identities, routes, budgets, and holders for kick-off. |

Blocking before Draft-6 implementation remain the process-adapter ownership decision, exact task preparation, named workers and human holders, task-level model and provider-route selection, budgets, capabilities, protected inputs, and deterministic admission.

## Recovery, exclusions, and residual risk

Preserve all predecessor packets, freeze records, reviews, task evidence, candidate revisions, and recovery checkpoints. A changed Draft-4 packet requires a successor and new identities; it does not rewrite Draft 3.

This roadmap excludes implementation, benchmark execution, model benchmarking, provider selection, target adoption, artifact retirement, commit, merge, release, external communication, and UI design.

Residual risks include historical inconsistency, incomplete consumer inventory, current/target confusion, unresolved integration ownership, weak isolation, hidden setup state, model-route drift, unavailable cost observations, scoring sensitivity, migration duplication, merge-target drift, pilot overgeneralization, and progressive disclosure hiding material detail if the brief is incomplete.

## Next safe action

Parent materializes the proposed artifacts, computes exact identities in a separate Draft-4 freeze record, and obtains the bounded final exact review. If that review passes, present the concise decision brief for one Human Review decision. Only after Draft-4 acceptance, if granted, continue to Human Review of the already frozen Draft-6 first-slice plan.

startsWork: false

===== END A: roadmap.md =====
