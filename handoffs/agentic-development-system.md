# Agentic Development System - Consolidated Continuation Handoff

## Purpose and authority

This document is the consolidated continuation checkpoint for the agentic-development-system rearchitecture. It is a draft and durable handoff, not current-architecture authority, target-contract authority, task authority, implementation authorization, or runtime configuration. It consolidates the active decisions, user inputs, review outcomes, unresolved questions, disposition tables, and next-session instructions. The longer reports listed under provenance remain source evidence and audit history in `reviews/agentic-development-system/`; this document is the canonical navigation point for a new orchestration session.

**Core principle:** Humans focus on design and features; agents take care of implementation. Implementation is the verified, evidence-bearing realization of human-facing design, analogous to compiled output for human review. This is a metaphor, not a claim that implementation is literally compilation or trustworthy without deterministic verification and review.

## Current checkpoint

| Field | State |
| --- | --- |
| Repository | `/home/vc/dev/as-is` |
| Branch | `implementing-composable-skills` |
| Branch role | Candidate and recovery/reversal boundary for this exercise; it need not be `master` |
| Baseline | A pinned `master` revision is an evaluation baseline only; it is not a universal working branch or approval source |
| Working tree at checkpoint | Clean after the checkpoint commit |
| Planning stage | Expanded Terra re-plan completed; expanded Sol review returned `revise` |
| Implementation | Not authorized and must not begin |
| Next owner | Terra, for explicit disposition and revision of Sol's remaining blockers |
| Review sequence | Terra revision -> fresh Sol re-review -> full human-facing target design package -> user alignment -> bounded implementation planning -> separately authorized implementation |
| Alternate reviewer | No concrete model or model family selected; selection procedure exists but evidence gathering is still required |

## User direction consolidated

The user has supplied the following requirements and corrections:

- Human escalation belongs to the applicable orchestrator. Agents may escalate to their caller; callers resolve within authority or bubble the issue upward until it reaches the responsible orchestrator and, when necessary, the then-current user.
- Agents own workflow orchestration and authority-bearing decisions within their scope. Skills provide reusable procedures; tools provide operations. Skills do not grant tools or authority.
- The initial roster may use a component-builder and bounded task implementer, with additional roles created when ownership gaps are demonstrated. A dedicated design/prototyping agent group is optional.
- Human feedback occurs after design and after implementation. Feedback that changes the design returns to design; it must not be silently appended to an active or completed implementation task.
- Path A is the intended lifecycle: planned target design drives derived artifacts and implementation. Path B should not be used while models can reliably distinguish current and planned designs. If that distinction fails, repair or escalate rather than silently switching lifecycles.
- Design completion is tied to the base `as-is.md` design records required for the implementation. The target interpretation is that the entire program has a complete human-facing target design, while implementation proceeds through separately approved bounded units. Before a unit starts, all base records needed for that unit are available, linked, and approved by the then-current user/reviewer.
- The current and planned states must remain explicitly distinguishable. A proposed `as-is.md` evolution may use separate current-state, approved-planned-target, and design-relationship sections, or a separate frozen target package linked from current records if the live record contract is not yet adopted.
- The then-current user is the design reviewer for the applicable root design revision. The reviewer identity and decision must be recorded with the revision.
- A first slice may be a mock feature or an existing simple backlog item if it genuinely fits the comparison. The preferred evaluation includes setup, a mock consuming project, and current/candidate copies in different directories tested against the same feature.
- Heavy refactoring and a total rewrite are both acceptable. The target is not required to be a continuation of the current implementation. A staged heavy refactor is the current recommendation; a rewrite remains available when evidence shows it has lower total risk/cost or better satisfies the target.
- The active branch during skill use does not have to be `master`. Candidate work may use the current feature branch and its worktrees. `master` is only a pinned comparison baseline.
- No separate rollback subsystem is required for this exercise because candidate implementation is isolated on the current branch. Normal Git, worktree, task, setup-failure, and partial-work recovery remain necessary.
- `drafts/composable-skills.md` is required proposal direction, not implementation authority. Its historical proposal to replace every existing skill is not an adopted retirement decision.
- The user asked for complete disposition tables. No live agent or skill may be silently removed; each replacement, merge, rename, deprecation, or drop needs an explicit source-to-target migration and evidence.

## Review outcomes and provenance

| Source | Outcome | Status |
| --- | --- | --- |
| `reviews/agentic-development-system/terra-refinement-report.md` | Existing component/task control plane is a strong substrate; add design governance | Advisory source report |
| `reviews/agentic-development-system/sol-validation-report.md` | Initial approach required revision | Advisory source report |
| `reviews/agentic-development-system/terra-reconciliation-report.md` | Incorporated first user feedback; proposed Path A and right-sized controls | Intermediate advisory source report |
| `reviews/agentic-development-system/sol-re-review-report.md` | Approved direction for limited design review, not implementation | Advisory source report |
| `reviews/agentic-development-system/terra-follow-up-report.md` | Added current/planned distinction, mock slice, live disposition tables | Advisory source report |
| `reviews/agentic-development-system/sol-final-re-review-report.md` | Approved readiness for the next design package, not implementation | Advisory source report |
| `reviews/agentic-development-system/terra-expanded-replan-report.md` | Recommended staged heavy refactor; added setup-inclusive comparison and target tables | Advisory source report; superseded by the remaining Sol objections |
| `reviews/agentic-development-system/sol-expanded-re-review-report.md` | `revise`; identified normalization and scope issues | Latest completed review; current blocker source |
| `drafts/composable-skills.md` | Composable reusable/master skill proposal | Proposal direction only |
| `drafts/design-realization-flows.md` | Historical manual rearchitecture attempt | Historical context only |

The expanded Sol review corrected or challenged the expanded Terra plan in these areas: program-wide target scope versus bounded implementation-unit scope; category mixing in target rosters; missing target placement for `thinking-companion`, setup ownership, evaluation ownership, and migration ownership; incomplete live-to-target skill mapping; insufficient alternate-reviewer selection procedure; overly narrow rewrite escape criteria; incomplete self-application bootstrap controls; and ambiguous workflow-versus-implementation benchmark inputs.

## Target strategy

| Strategy | Disposition |
| --- | --- |
| Simple continuation | Not sufficient for the stated goal; useful only as baseline evidence and migration substrate |
| Staged heavy refactor | Current recommendation; permits substantial agent/skill/orchestration/setup restructuring while retaining proven deterministic substrate where useful |
| Total rewrite | Permitted if later evidence shows compatibility, safety, maintainability, or target-fit costs make replacement preferable; requires explicit evidence and approval |

The retained substrate candidates are component records, task control, deterministic validation, parent-owned integration, launcher mechanics, worktree/task recovery, and useful existing fixtures. Retaining a substrate does not require retaining its current agent or skill contract unchanged.

## Target lifecycle and design completion

```text
Complete program target design
  -> approved base design records for the bounded implementation unit
  -> design-derived artifacts and task definition
  -> user alignment on the applicable root design
  -> bounded implementation
  -> deterministic verification and semantic result review
  -> integration and post-implementation feedback
  -> new design revision when feedback changes the design
```

**Plain-language design completion rule:** Design is complete for a bounded implementation unit when the base design records for every component the unit will create, change, retire, or rely on through an unresolved design choice are available, linked, and approved by the then-current user/reviewer. The whole program target design should describe the revised agent/skill system and setup/consumption goal, but it need not pretend that every future unit has already been implemented.

**Design-changing feedback rule:** Renew design review when feedback changes what is being built, who it serves, required behavior, exclusions, allowed risks or external effects, or how success will be judged. Typographical or already-implied clarifications need not create a new design revision unless they change one of those answers.

**Path A rule:** Keep planned target design and current implemented state distinct. Derived leaf documents do not need direct human review unless they change user intent, behavior, scope, risk, architecture, external effects, acceptance meaning, or a human-visible trade-off. Path B is not selected while the distinction is reliable.

## Responsibility and escalation model

| Responsibility | Initial target treatment | Boundary |
| --- | --- | --- |
| Intake and design-status routing | Retain/adapt current `as-is` router or replace only with justified compatibility migration | Routes and reports; does not infer approval or create implementation authority |
| Design/workflow orchestration | Named workflow assignment or new target agent if current roles cannot compose it cleanly | Coordinates design, feedback, task preparation, and human escalation; cannot approve on behalf of the user |
| Component delivery orchestration | Adapt `component-builder` | Owns component task, delegation, integration, recovery, and completion within its boundary |
| Bounded implementation | Adapt `worker` or another admitted task implementer | One authorized task; no self-approval, self-integration, credentials, or unapproved external effects |
| Deterministic evidence | Adapt `evidence-validator` and existing checks | Evidence only; no task selection, integration, or completion authority |
| Semantic result review | Distinct reviewer session/role or receiving builder for low-risk work | Inspects actual artifacts/diff and design correspondence; worker cannot self-accept |
| Integration | Receiving component-builder | Parent-owned integration and revalidation |
| Execution/evaluation advice | Retain `execution-advisor` | Diagnostics and recommendations only; cannot retry, reallocate, or score its own candidate as sole authority |
| Human design review | Then-current user/reviewer | Owns alignment, revocation, conflicting feedback, and material design decisions |
| Specialist/architecture review | Compose `expert` initially; create a dedicated role only when justified | Advisory or policy-granted authority; no implicit implementation authority |
| Human-facing design facilitation | Compose `thinking-companion` initially; dedicated group optional | Explains and presents choices; cannot align on behalf of the user |
| Setup/consumption ownership | Assign explicitly to design/workflow orchestrator or a new setup owner | Owns setup plan and evidence, not task authority unless separately assigned |
| Evaluation/scoring ownership | Name an evaluator independent of candidate implementation and fixture control | Owns rubric and comparison evidence; cannot alter candidate fixtures or grant adoption authority |
| Agent/skill migration ownership | Assign to a migration orchestrator or explicit component-delivery owner | Coordinates source-to-target migration; does not silently delete live contracts |

Escalation flows from worker or reviewer to its direct caller, then upward when outside the caller's authority, to the named applicable orchestrator, and finally to the then-current user when human judgment is required. Escalation itself grants no tools, budget, retries, scope changes, design changes, external effects, or implementation authorization.

## Current live agent disposition

The current catalog contains seven production role components plus one test fixture. Sol/Terra/Luna are model-role labels, not current contracts.

| Live agent contract | Target disposition | Notes |
| --- | --- | --- |
| `agent-capability-probe` | Retain as test fixture | Not a normal production role |
| `as-is` | Retain/adapt or compatible replacement only after justification | Current replacement proposal was underjustified; preserve routing compatibility until a target consumer and migration evidence exist |
| `component-builder` | Adapt | Add design linkage/currentness, result comparison, and setup/orchestration assignments as appropriate |
| `evidence-validator` | Adapt | Validate controlled design/task/result evidence when the target representation exists |
| `execution-advisor` | Retain | Read-only diagnostics and bounded recommendations |
| `expert` | Retain and compose | Advisory architecture, review, and focused consultation |
| `thinking-companion` | Retain and compose | Human-facing explanation and feedback facilitation |
| `worker` | Adapt | Bind frozen design, task scope, admitted capabilities, and no self-acceptance |

No live agent is currently approved for immediate replacement, deprecation, or drop. A target replacement requires a named consumer, compatibility period, routing tests, migration evidence, and explicit deprecation/drop criteria.

## Target agent categories

These categories must not be confused with configured agent contracts, human roles, workflow assignments, validators, or fixtures.

| Category | Candidate target |
| --- | --- |
| Production agents | Intake/design router; design/workflow orchestrator; component-delivery orchestrator; bounded implementation worker; deterministic evidence validator; semantic result reviewer; execution/evaluation advisor; architecture/specialist reviewer; human-facing design facilitator |
| Workflow assignments | Integration owner; setup owner; benchmark/scoring owner; agent/skill migration owner; human design reviewer |
| Deterministic capabilities | Existing checks, fixed evidence validation, benchmark harness, setup checks |
| Test fixtures | `agent-capability-probe`; mock consuming-project seed and comparison fixtures |

The first slice may assign several workflow responsibilities to existing agents. New agents should be created only where composition would otherwise collapse authority boundaries or leave ownership untestable.

## Current live skill disposition

All 17 live skills are accounted for. No live skill is currently approved for immediate replacement, deprecation, or drop.

| Disposition | Live skills |
| --- | --- |
| Retain and adapt | `as-is-setup`, `building-components`, `implementing-component-tasks`, `integrate-as-is-documentation`, `managing-as-is-document`, `spawning-pi-subagents`, `verification-discipline` |
| Retain and compose | `context-building`, `designing-mermaid-diagrams`, `human-centered-consulting`, `structuring-content` |
| Retain without demonstrated early adaptation need | `committing-completed-work`, `deterministic-skills`, `exploring-execution-evidence`, `maintaining-components`, `managing-backlog`, `naming-software-concepts` |

The historical proposal to drop every skill is rejected as a migration strategy. A live contract may later be renamed, merged, replaced, deprecated, or dropped only through an explicit source-to-target table with consumers, compatibility, validation, and retirement criteria.

## Target skill classification

The target is a classified catalog, not an instruction to create every proposed skill.

| Classification | Target candidates |
| --- | --- |
| Required or retained basis | `building-context`, `choosing-names`, `structuring-content`, `validating-changes`, `designing-diagrams`, `inspecting-execution-evidence`, `assessing-determinism`, `preparing-scoped-commits` |
| Required new capability boundaries | `designing-and-aligning-design`, `setting-up-consuming-projects`, `reviewing-implementation-results`, `evaluating-workflows` |
| Candidate extractions requiring independent consumers | `resolving-scopes`, `identifying-owners`, `recording-evidence`, `delegating-bounded-work`, `observing-delegated-work`, `choosing-change-methods` |
| First-slice or early candidates | `writing-code`, `applying-bounded-edits`, `writing-tests`, `running-tests`, `presenting-decisions` |
| Deferred proposals | `locating-changelogs`, `drafting-content`, `rendering-diagrams`, `recording-backlog-items`, `drafting-changelog-entries` |

The target must preserve distinct responsibilities for documentation adoption, host setup, package consumption, task implementation, design alignment, verification, and semantic result review even where a master skill composes them.

## `composable-skills.md` mapping

`drafts/composable-skills.md` was consulted in full as proposal direction. Its text enumerates 24 reusable-skill headings despite claiming 25; this discrepancy must be corrected before adoption. The target proposal adds four required capability candidates, giving 28 proposed reusable entries and 14 proposed master entries. These are not all adopted contracts.

| Proposed reusable capability | Live coverage or target disposition |
| --- | --- |
| `building-context` | Adapt/rename-align `context-building` |
| `resolving-scopes` | Extract only with independent consumer evidence |
| `identifying-owners` | Extract only with independent consumer evidence |
| `locating-changelogs` | Deferred; current task/completion procedures cover demonstrated use |
| `choosing-names` | Retain/adapt `naming-software-concepts` |
| `structuring-content` | Retain |
| `drafting-content` | Deferred; compose existing structure/consultation first |
| `writing-code` | Early candidate; currently role behavior |
| `applying-bounded-edits` | Early candidate; currently role behavior |
| `writing-tests` | Early candidate; currently builder/verification behavior |
| `running-tests` | Candidate extraction from verification |
| `validating-changes` | Adapt `verification-discipline` |
| `recording-evidence` | Create only if target evidence needs an independent boundary |
| `designing-diagrams` | Adapt/rename-align `designing-mermaid-diagrams` |
| `rendering-diagrams` | Deferred until portable renderer consumption is demonstrated |
| `inspecting-execution-evidence` | Adapt/rename-align `exploring-execution-evidence` |
| `assessing-determinism` | Retain/adapt `deterministic-skills` |
| `recording-backlog-items` | Deferred; compose `managing-backlog` |
| `drafting-changelog-entries` | Deferred; current completion procedures cover it |
| `delegating-bounded-work` | Candidate extraction from builder/launcher |
| `observing-delegated-work` | Candidate extraction from launcher/evidence |
| `preparing-scoped-commits` | Adapt/rename-align `committing-completed-work` |
| `presenting-decisions` | Early candidate; compose consultation first |
| `choosing-change-methods` | Candidate extraction; required by a future `making-changes` master |

| Proposed master capability | Live coverage or target disposition |
| --- | --- |
| `making-changes` | Required target master/pilot |
| `building-components` | Adapt existing |
| `implementing-tasks` | Adapt `implementing-component-tasks` |
| `maintaining-components` | Retain existing |
| `managing-as-is-records` | Adapt `managing-as-is-document` |
| `designing-mermaid-diagrams` | Retain existing |
| `managing-backlogs` | Retain existing |
| `managing-changelogs` | Conditional; defer until task-independent consumer exists |
| `spawning-subagents` | Adapt `spawning-pi-subagents` |
| `exploring-execution-evidence` | Retain existing |
| `consulting-humans` | Adapt/compose `human-centered-consulting` |
| `committing-completed-work` | Retain existing |
| `designing-and-aligning-implementation-units` | Required target master |
| `setting-up-and-evaluating-consuming-projects` | Required target master |

## Setup-inclusive comparison

Setup is part of the target implementation evaluation, while public portable distribution remains an explicit later claim.

```text
Pinned system baseline (master revision)
  + committed mock-project seed
    ├── current consumer copy: baseline setup/workflow
    └── candidate consumer copy: candidate setup/workflow from active branch
```

The current and candidate copies must receive the same frozen feature goal, design input appropriate to the experiment, acceptance tests, deterministic validators, comparable model/configuration/budget/retry settings, reviewer rubric, and no task-accessible credentials or external effects. They must not share mutable configuration, records, sessions, traces, temporary state, generated artifacts, or credentials. The seed, rubric, validators, and scoring rules must be outside candidate-worker write scope.

The first comparison may use repository-local setup without claiming independently installed package support. Before external-consumption claims, later work must prove clean installation, dependency closure, immutable/versioned resources, compatibility, upgrades, downgrade/rollback, uninstall, unsupported-host handling, and concurrent-project isolation.

## First-slice candidates

| Candidate | Assessment |
| --- | --- |
| Existing `drafts:finalize-composing-skills` | Too broad and dependency-coupled for the first comparison |
| Existing `skills:presentation-guidance` | Low risk but weakly exercises application implementation |
| Existing `skills:test-writing-skill` | Plausible later skills-focused slice; modifies the system rather than a neutral consumer |
| Existing `skills:clean-project-temporary-files` | Avoid initially because deletion increases risk |
| New small mock application feature | Best fit for complete setup/design/task/implementation/review comparison |

An existing simple backlog item is acceptable if it can be frozen and applied identically to both consumer copies without coupling the fixture to the candidate system’s source tree. The next design package must select the item or justify a new mock feature.

## Evaluation protocol

Run two distinct paired experiments against a pinned `master` revision and a pinned candidate revision:

1. **Workflow comparison:** equivalent human feature goals pass through current and candidate setup/design/workflow paths.
2. **Implementation-boundary comparison:** both paths receive the same frozen approved design and bounded task, isolating implementation/delegation/review differences.

Include normal work, missing dependency, stale/revoked design, controlled failure or budget stop, and adversarial scope/instruction cases. Predeclare fixtures, validators, budgets, retries, scoring rubric, safety-critical failures, and advancement rules. Measure acceptance correctness, deterministic outcomes, review disposition, integration rework, setup success/idempotence/unsupported-host behavior, recovery, human review burden, latency, and cost where available. Safe refusal or escalation is preferable to unauthorized apparent success.

OpenRouter’s documented `/api/v1/benchmarks` and Data API are valid external evidence sources for model screening, but exact retrieval, provenance, terms, model IDs, and fields must be verified when used. They do not select architecture, appoint roles, approve work, or replace local evaluation. Credentials remain environment-only and are never placed in prompts, records, telemetry, or output.

## Alternate-reviewer selection

No concrete alternate model or family has been selected. The selection procedure is:

1. Name the specific risk and review question.
2. Identify the primary reviewer’s exact provider/model configuration.
3. Shortlist candidates using authorized current model/benchmark evidence.
4. Verify family provenance from an authoritative source; unknown provenance remains unknown.
5. Run a bounded local trial on the same sanitized evidence packet and rubric.
6. Compare novel valid findings, factual accuracy, false claims, authority adherence, uncertainty calibration, cost, and latency.
7. Record accountable human selection, scope, evidence, and residual dependence.

An alternate-family or specialist review becomes required before credential-bearing work, external effects, broader autonomy, distribution, multi-project isolation claims, or security-isolation claims. It may be deferred for the low-risk internal mock slice if the narrowed controls are met.

## Minimum controls before any implementation task

- A complete program-level target design package exists for the revised agent/skill system and setup/consumption goal.
- The selected bounded implementation unit has all required base design records, with current and planned state distinct.
- The then-current user has aligned on the applicable root design and scope.
- A named orchestrator, task owner, implementation worker, semantic reviewer, integration owner, setup owner, and evaluator exist or their workflow assignments are explicit.
- A deterministic design-to-task reference/currentness mechanism is adopted under task-control authority.
- The implementation worktree is isolated; autonomous implementation must not silently fall back to the caller working directory.
- The task-facing environment and capabilities demonstrably exclude unrelated credentials and external effects for the first slice.
- The aligned design, seed, fixtures, validators, rubric, and baseline are outside worker-writable scope.
- Deterministic checks, actual artifact/diff inspection, semantic review, integration revalidation, and recovery evidence are required.
- The current branch and worktrees provide the exercise’s recovery/reversal boundary; no separate rollback subsystem is required unless evidence demonstrates a need.

## Remaining blockers and decisions

Sol’s latest `revise` verdict means the following must be addressed by Terra and then re-reviewed by Sol before the next target-design package is treated as ready:

1. Separate the complete program target from bounded implementation-unit design and authorization.
2. Normalize target roster tables into production agents, workflow assignments, human roles, deterministic validators, and test fixtures.
3. Place `thinking-companion`, setup ownership, evaluation/scoring ownership, migration ownership, and design facilitation explicitly.
4. Classify the target skill catalog into retained/adapted contracts, required target boundaries, candidates, and deferred proposals.
5. Map every renamed, merged, or replaced live skill/agent to an exact target contract, compatibility period, validation, deprecation trigger, and final disposition.
6. Complete the evidence-based alternate-reviewer selection procedure without inventing family independence.
7. Preserve total rewrite as an evidence-based option with broader criteria than technical impossibility alone.
8. Complete self-application bootstrap and anti-self-authorization controls.
9. Make workflow and implementation-boundary benchmark inputs exact and non-confounded.

The user decisions needed after those revisions are intentionally limited:

- Confirm that the complete target system is designed at program level while implementation proceeds through approved bounded units.
- Select or approve the first simple backlog item or authorize the new mock feature recommendation.
- Confirm the target current/planned `as-is.md` representation or approve a separate frozen target package linked from current records.
- Confirm named workflow-owner assignments for the first slice; the then-current user remains the design reviewer.

## Next review handoff

**Next owner:** Terra, read-only planning and revision.

**Request:** Read this consolidated document first, then the latest Sol report and Terra expanded re-plan. Re-plan the remaining blockers, preserve all user decisions, and return a normalized target proposal with no implementation. Use the in-process `call_subagent` mechanism for focused Sol feedback when the admitted Terra role supports it, then send every material revision to a fresh independent Sol review. Do not select an alternate reviewer without the evidence procedure above. Do not create implementation tasks yet.

**Required Terra output:** A concise revised target proposal with program scope versus bounded-unit scope, strategy choice and rewrite escape, normalized agent roster and ownership assignments, normalized skill roster and complete source-to-target migration table, setup/mock-project comparison, first-slice recommendation, branch/baseline/recovery policy, design-completion/current-planned record proposal, feedback/escalation flow, implementation-result review, benchmark protocol, alternate-reviewer decision, required human decisions, residual uncertainty, and readiness for fresh Sol review.

**Required Sol output after Terra:** Independently assess the revised proposal, mark every prior objection resolved/narrowed/still blocking, correct factual/counting errors, state whether it is ready for the human-facing target-design package, and state clearly that implementation remains unauthorized until user alignment and a separately authorized task.

## New-session startup prompt

The following prompt is operational recovery guidance for the next orchestration session. It is not target-system runtime behavior, target architecture, task authority, or implementation authorization. Copy it into a new orchestration session:

```text
You are continuing the agentic-development-system rearchitecture. Work read-only during this planning/review phase; do not edit files, create implementation tasks, commit, launch implementation agents, contact external services, or treat any report as authority. Read handoffs/agentic-development-system.md first; it is the canonical consolidated checkpoint. Then read the latest source reports it names, especially reviews/agentic-development-system/sol-expanded-re-review-report.md and reviews/agentic-development-system/terra-expanded-replan-report.md, plus /home/vc/dev/as-is/AGENTS.md, the relevant current-state as-is.md records, drafts/composable-skills.md, and drafts/backlog.md as proposal/history context only. Use the canonical Pi delegation procedure at skills/spawning-pi-subagents/SKILL.md for any child.

Next, delegate a bounded read-only Terra revision pass through the canonical Pi launcher using the admitted read-only review contract and the configured Terra model mapping if available. Terra must address every remaining Sol objection, distinguish the complete program target from bounded implementation-unit authorization, normalize production agents versus workflow assignments versus human roles versus validators versus fixtures, explicitly assign thinking-companion/design facilitation, setup ownership, evaluation ownership, and migration ownership, classify all live skills and all proposed composable skills, provide an exact source-to-target migration table for every rename/merge/replacement, preserve heavy refactor and evidence-based total rewrite options, complete self-application controls, and make the workflow versus implementation-boundary benchmark inputs exact. Include setup as part of the goal, a separate mock consuming project, current and candidate copies in different directories, and the same-feature comparison. Treat the active branch as the candidate/recovery boundary and master only as a pinned evaluation baseline; do not design a separate rollback subsystem without evidence. Use Path A while current and planned design remain distinguishable. Design completes for a bounded unit when its required base design records are available, linked, and approved by the then-current user/reviewer. Use “design-changing feedback” for the plain-language re-alignment rule. Do not select a concrete alternate reviewer without verifying model-family provenance and running the bounded selection procedure. Do not implement.

After Terra returns, preserve its report durably, then send the material revision to a fresh independent Sol review through the canonical launcher. Continue the Terra-Sol ping-pong until Sol approves readiness for the human-facing target-design package or identifies a specific disagreement requiring the user. Sol may suggest alternatives as well as objections. Neither model approval authorizes implementation. After Sol approval, present the normalized target design package and remaining decisions to the user for explicit alignment. Only after that alignment and a separately authorized bounded task may implementation begin.

At every compaction checkpoint, read this handoff first, preserve the current owner/stage, report paths, verdicts, unresolved questions, budget observations, and next action, and stop launching new work before the session’s remaining context falls below 20%. Do not infer approval from process exit, model output, backlog entries, or commits.
```

## Recovery and compaction

The active candidate branch is the recovery/reversal boundary for this exercise. Preserve source reports and candidate history; do not claim that branch isolation provides filesystem, network, credential, or read isolation. A budget-stopped child is an incomplete review and requires parent disposition, not automatic retry. Before compaction, update this checkpoint with the latest report path, verdict, next owner, unresolved questions, and next action. After compaction, read this document first and resume from `Current checkpoint`, `Remaining blockers and decisions`, and `Next review handoff`.
