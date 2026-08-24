# Migration ledger — proposed target design

## Status and authority

This ledger is the sole proposed source of migration and disposition truth for `target-design-v1-draft-30`. It is not an implementation task, adoption decision, or removal instruction. Current records and contracts remain authoritative until a separately authorized migration proves a target replacement or adaptation.

## Ledger rules

- Exact source uses one current path, one exact proposal heading, or one explicitly labelled new-target addition. Directory wildcards and category placeholders are not source identifiers.
- Exact target uses frozen target namespaces, not filesystem paths. The `target-skill/reusable` and `target-skill/master` namespaces count only the 28 and 14 proposed target entries; `target-compat` identifies retained live compatibility contracts outside that proposal count.
- Each target identifier appears exactly once in the canonical tables below. A live source and a matching proposal input are recorded in the same source cell; they are not separate target rows.
- New extraction or composition targets are identified as `new target addition:` or `new target assignment:`; they are not falsely attributed to a heading absent from `drafts/composable-skills.md`.
- `Retain`, `adapt`, `compose`, `replace`, `candidate`, `deferred`, and `required boundary` describe proposals only. No source is deprecated or dropped without consumer inventory, compatibility evidence, validation, explicit approval, and recovery assessment.
- `drafts/composable-skills.md` contains 24 actual reusable headings despite claiming 25. The 24 reusable headings, four new reusable additions, 12 actual master headings, and two new master additions are each represented exactly once below: 28 reusable and 14 master entries in total.

## Production agents

| Exact source | Exact target | Compatibility period | Identified consumers and migration condition | Validation | Deprecation trigger | Final disposition |
| --- | --- | --- | --- | --- | --- | --- |
| `agents/as-is/agent.md` | `target-agent/intake-status-router-v1` | Retain through compatibility phase | Inventory routing consumers; preserve recommendation-only and no-self-delegation behavior | Routing, recommendation-only, and self-target rejection tests | Verified consumers migrated and recovery path retained | Retain and adapt; replacement is not currently justified |
| `agents/component-builder/agent.md` | `target-agent/component-delivery-orchestrator-v1` | Retain through first-slice comparison | Preserve component boundary, integration, recovery, and child closure | Builder and fixture behavior tests plus design-link checks | None currently | Retain and adapt |
| `agents/worker/agent.md` | `target-agent/bounded-implementation-worker-v1` | Retain through first-slice comparison | Preserve leaf limits and handoff behavior | Scope, capability, design-reference, and result-review checks | None currently | Retain and adapt |
| `agents/evidence-validator/agent.md` | `target-agent/deterministic-evidence-validator-v1` | Retain through validator migration | Preserve read-only controlled-evidence boundary | Fixed-check and protected-control tests | None currently | Retain and adapt |
| `agents/execution-advisor/agent.md` | `target-agent/execution-evidence-advisor-v1` | Retain | Existing evidence consumers remain valid | Bounded evidence/privacy tests | None currently | Retain |
| `agents/expert/agent.md` | `target-agent/independent-expert-reviewer-v1` | Retain | Review consumers and model assignment verified per use | Read-only/advisory tests and review evidence | None currently | Retain and compose |

## Test fixture role

| Exact source | Exact target | Compatibility period | Identified consumers and migration condition | Validation | Deprecation trigger | Final disposition |
| --- | --- | --- | --- | --- | --- | --- |
| `agents/agent-capability-probe/agent.md` | `target-fixture/agent-capability-probe-v1` | Retain as fixture | Exclude from production role selection | Capability-admission fixture coverage | None currently | Retain, fixture-only |

## Live skills and the 24 reusable proposal headings

The live source rows below also carry a matching proposal input only when the planned target is the same. Proposal headings that represent a distinct reusable target remain separate rows. This keeps every target identifier unique while preserving the full proposal inventory.

| Exact source | Exact target | Compatibility period | Identified consumers and migration condition | Validation | Deprecation trigger | Final disposition |
| --- | --- | --- | --- | --- | --- | --- |
| `skills/as-is-setup/SKILL.md` | `target-compat/master/as-is-setup-v1` | Retain through setup comparison | Preserve documentation-adoption semantics; consuming setup may compose it only for record adoption | Setup/documentation checks | None currently | Retain and adapt |
| `skills/building-components/SKILL.md`; proposal input `drafts/composable-skills.md#building-components` | `target-skill/master/building-components-v1` | Retain through builder migration | Preserve component and child-boundary semantics | Builder fixture and scoped handoff checks | None currently | Retain and adapt |
| `skills/committing-completed-work/SKILL.md`; proposal input `drafts/composable-skills.md#committing-completed-work` | `target-skill/master/committing-completed-work-v1` | Retain | Completion consumers remain valid | Scoped staging/diff checks | None currently | Retain |
| `skills/context-building/SKILL.md`; proposal input `drafts/composable-skills.md#building-context` | `target-skill/reusable/building-context-v1` | Retain through composition migration | Existing context consumers pass focused checks | Context provenance and ambiguity checks | Verified consumers migrated if renamed | Retain and compose |
| `skills/designing-mermaid-diagrams/SKILL.md`; proposal input `drafts/composable-skills.md#designing-mermaid-diagrams` | `target-skill/master/designing-mermaid-diagrams-v1` | Retain | Existing diagram consumers remain valid | Diagram source/render/navigation checks | None currently | Retain and compose |
| `skills/deterministic-skills/SKILL.md`; proposal input `drafts/composable-skills.md#assessing-determinism` | `target-skill/reusable/assessing-determinism-v1` | Retain | Existing maintenance consumers remain valid | Determinism assessment checks | None currently | Retain |
| `skills/exploring-execution-evidence/SKILL.md`; proposal input `drafts/composable-skills.md#exploring-execution-evidence` | `target-skill/master/exploring-execution-evidence-v1` | Retain | Existing evidence consumers remain valid | Privacy and bounded-query checks | None currently | Retain |
| `skills/human-centered-consulting/SKILL.md`; proposal input `drafts/composable-skills.md#consulting-humans` | `target-skill/master/consulting-humans-v1` | Retain | Existing consultation consumers remain valid | No-authority and progressive-disclosure checks | None currently | Retain and compose |
| `skills/implementing-component-tasks/SKILL.md`; proposal input `drafts/composable-skills.md#implementing-tasks` | `target-skill/master/implementing-tasks-v1` | Retain through task migration | Preserve task protocol and descendant closure | Task-record and recovery tests | None currently | Retain and adapt |
| `skills/integrate-as-is-documentation/SKILL.md` | `target-compat/master/integrating-as-is-documentation-v1` | Retain | Preserve record-adoption semantics | Record content/navigation checks | None currently | Retain and adapt |
| `skills/maintaining-components/SKILL.md`; proposal input `drafts/composable-skills.md#maintaining-components` | `target-skill/master/maintaining-components-v1` | Retain | Existing maintenance consumers remain valid | Maintenance evidence checks | None currently | Retain |
| `skills/managing-as-is-document/SKILL.md`; proposal input `drafts/composable-skills.md#managing-as-is-records` | `target-skill/master/managing-as-is-records-v1` | Retain through record-contract decision | Preserve current-record authority until target contract is adopted | Record structure and link checks | None currently | Retain and adapt |
| `skills/managing-backlog/SKILL.md`; proposal input `drafts/composable-skills.md#managing-backlogs` | `target-skill/master/managing-backlogs-v1` | Retain | Existing backlog consumers remain valid | Backlog query/content checks | None currently | Retain |
| `skills/naming-software-concepts/SKILL.md`; proposal input `drafts/composable-skills.md#choosing-names` | `target-skill/reusable/choosing-names-v1` | Retain | Preserve naming guidance and references | Naming and path-reference checks | None currently | Retain |
| `skills/spawning-pi-subagents/SKILL.md`; proposal input `drafts/composable-skills.md#spawning-subagents` | `target-skill/master/spawning-subagents-v1` | Retain through adapter migration | Preserve role admission, budgets, worktree, observation, and recovery | Launcher/provider-free fixture checks | None currently | Retain and adapt |
| `skills/structuring-content/SKILL.md`; proposal input `drafts/composable-skills.md#structuring-content` | `target-skill/reusable/structuring-content-v1` | Retain | Existing structure consumers remain valid | Structure/content checks | None currently | Retain and compose |
| `skills/verification-discipline/SKILL.md`; proposal input `drafts/composable-skills.md#validating-changes` | `target-skill/reusable/validating-changes-v1` | Retain through validation migration | Preserve acceptance-to-evidence semantics | Validation and residual-risk checks | None currently | Retain and adapt |
| `drafts/composable-skills.md#resolving-scopes` | `target-skill/reusable/resolving-scopes-v1` | Not applicable; proposal only | Independent scope consumer and owner required | Scope-resolution fixtures | Not applicable | Candidate |
| `drafts/composable-skills.md#identifying-owners` | `target-skill/reusable/identifying-owners-v1` | Not applicable; proposal only | Independent owner-mapping consumer required | Owner-map fixture | Not applicable | Candidate |
| `drafts/composable-skills.md#locating-changelogs` | `target-skill/reusable/locating-changelogs-v1` | Not applicable; proposal only | Independent history consumer and owner required | Owner-resolution fixture | Not applicable | Deferred |
| `drafts/composable-skills.md#drafting-content` | `target-skill/reusable/drafting-content-v1` | Not applicable; proposal only | Content consumer and owner required | Bounded proposal checks | Not applicable | Deferred |
| `drafts/composable-skills.md#writing-code` | `target-skill/reusable/writing-code-v1` | Not applicable; proposal only | Bounded worker consumer and capability profile required | Code-task fixture | Not applicable | Candidate |
| `drafts/composable-skills.md#applying-bounded-edits` | `target-skill/reusable/applying-bounded-edits-v1` | Not applicable; proposal only | Surgical-edit consumer required | Collateral-change checks | Not applicable | Candidate |
| `drafts/composable-skills.md#writing-tests` | `target-skill/reusable/writing-tests-v1` | Not applicable; proposal only | Test-authoring consumer required | Focused test fixtures | Not applicable | Candidate |
| `drafts/composable-skills.md#running-tests` | `target-skill/reusable/running-tests-v1` | Not applicable; proposal only | Bounded check-running consumer required | Bounded command fixtures | Not applicable | Candidate |
| `drafts/composable-skills.md#recording-evidence` | `target-skill/reusable/recording-evidence-v1` | Not applicable; proposal only | Evidence-record consumer required | Privacy/provenance fixtures | Not applicable | Candidate |
| `drafts/composable-skills.md#designing-diagrams` | `target-skill/reusable/designing-diagrams-v1` | Not applicable; proposal only | Distinct diagram consumer required; current Mermaid skill remains | Diagram source checks | Not applicable | Candidate/covered |
| `drafts/composable-skills.md#rendering-diagrams` | `target-skill/reusable/rendering-diagrams-v1` | Not applicable; proposal only | Portable renderer consumer required | Render/navigation checks | Not applicable | Deferred |
| `drafts/composable-skills.md#inspecting-execution-evidence` | `target-skill/reusable/inspecting-execution-evidence-v1` | Not applicable; proposal only | Distinct focused inspection consumer required | Bounded evidence checks | Not applicable | Candidate/covered |
| `drafts/composable-skills.md#recording-backlog-items` | `target-skill/reusable/recording-backlog-items-v1` | Not applicable; proposal only | Independent backlog-record consumer required | Backlog checks | Not applicable | Deferred |
| `drafts/composable-skills.md#drafting-changelog-entries` | `target-skill/reusable/drafting-changelog-entries-v1` | Not applicable; proposal only | Independent history consumer required | Changelog checks | Not applicable | Deferred |
| `drafts/composable-skills.md#delegating-bounded-work` | `target-skill/reusable/delegating-bounded-work-v1` | Not applicable; proposal only | Independent delegation consumer and authority test required | Role-admission and child-boundary fixtures | Not applicable | Candidate |
| `drafts/composable-skills.md#observing-delegated-work` | `target-skill/reusable/observing-delegated-work-v1` | Not applicable; proposal only | Independent observation consumer required | Observation/privacy fixtures | Not applicable | Candidate |
| `drafts/composable-skills.md#preparing-scoped-commits` | `target-skill/reusable/preparing-scoped-commits-v1` | Not applicable; proposal only | Completion consumer required | Scoped commit checks | Not applicable | Candidate/covered |
| `drafts/composable-skills.md#presenting-decisions` | `target-skill/reusable/presenting-decisions-v1` | Not applicable; proposal only | Human-facing decision consumer required | Agency/presentation checks | Not applicable | Candidate |
| `drafts/composable-skills.md#choosing-change-methods` | `target-skill/reusable/choosing-change-methods-v1` | Not applicable; proposal only | Change-selection consumer required | Method-choice fixture | Not applicable | Candidate |

## Four new reusable additions

These are proposed additions, not headings in `drafts/composable-skills.md`.

| Exact source | Exact target | Compatibility period | Identified consumers and migration condition | Validation | Deprecation trigger | Final disposition |
| --- | --- | --- | --- | --- | --- | --- |
| `new target addition: design alignment and revision capability` | `target-skill/reusable/designing-and-aligning-design-v1` | None until approved | Human design reviewer, package owner, revision and revocation consumer required | Revision/currentness fixtures | Not applicable | Required candidate |
| `new target addition: consuming-project setup capability` | `target-skill/reusable/setting-up-consuming-projects-v1` | None until approved | Mock-consumer setup owner and seed required; distinct from `as-is-setup` | Clean/idempotent setup fixtures | Not applicable | Required candidate |
| `new target addition: implementation-result review capability` | `target-skill/reusable/reviewing-implementation-results-v1` | None until approved | Distinct reviewer and actual-diff consumer required | Result-disposition fixtures | Not applicable | Required candidate |
| `new target addition: workflow evaluation capability` | `target-skill/reusable/evaluating-workflows-v1` | None until approved | Independent evaluator, scorer, and frozen rubric required | Paired-run and confounder checks | Not applicable | Required candidate |

## Twelve draft master headings and two new master additions

The 12 actual master headings are represented exactly once by the proposal inputs in the canonical rows above: `making-changes` has a dedicated proposal-only row below; `building-components`, `implementing-tasks`, `maintaining-components`, `managing-as-is-records`, `designing-mermaid-diagrams`, `managing-backlogs`, `spawning-subagents`, `exploring-execution-evidence`, `consulting-humans`, and `committing-completed-work` are merged with the corresponding live-source rows; and `managing-changelogs` has its own proposal-only row below. The two new master additions follow.

| Exact source | Exact target | Compatibility period | Identified consumers and migration condition | Validation | Deprecation trigger | Final disposition |
| --- | --- | --- | --- | --- | --- | --- |
| `drafts/composable-skills.md#making-changes` | `target-skill/master/making-changes-v1` | Not applicable; proposal only | General-change pilot requires scope, owner, method, validation, and history consumers | Composition and authority-boundary fixtures | Not applicable | Candidate |
| `drafts/composable-skills.md#managing-changelogs` | `target-skill/master/managing-changelogs-v1` | Not applicable; proposal only | Independent history workflow consumer required | History-owner and completion fixtures | Not applicable | Candidate/deferred |

## Two new master additions

The 12 actual master headings in the draft are represented by the proposal inputs attached to the corresponding live/master rows above. These two are new additions and are not headings in `drafts/composable-skills.md`.

| Exact source | Exact target | Compatibility period | Identified consumers and migration condition | Validation | Deprecation trigger | Final disposition |
| --- | --- | --- | --- | --- | --- | --- |
| `new target addition: design-derived implementation-unit alignment composition` | `target-skill/master/designing-and-aligning-implementation-units-v1` | None until approved | Design package and task-admission consumers required | Design-link/currentness and build-plan fixtures | Not applicable | Required candidate |
| `new target addition: consuming-project setup and evaluation composition` | `target-skill/master/setting-up-and-evaluating-consuming-projects-v1` | None until approved | Mock setup, evaluator, and fixture owners required | Setup and paired-run fixtures | Not applicable | Required candidate |

## Workflow assignments and human roles

| Exact source | Exact target | Compatibility period | Identified consumers and migration condition | Validation | Deprecation trigger | Final disposition |
| --- | --- | --- | --- | --- | --- | --- |
| `new target assignment: design orchestration` | `target-workflow/design-orchestration-v1` | Not applicable | Human appointment and reviewed package required | Terra/Sol/Grok review-chain evidence | Not applicable | Required boundary; holder unappointed |
| `new target assignment: task admission` | `target-workflow/task-admission-v1` | Not applicable | Adopted design-link/currentness contract and task-control owner required | Stale/revoked-design fixture | Not applicable | Required boundary; holder unappointed |
| `new target assignment: semantic result review` | `target-workflow/semantic-result-review-v1` | Not applicable | Distinct reviewer required | Actual diff/design-correspondence review | Not applicable | Required boundary; holder unappointed |
| `new target assignment: integration` | `target-workflow/integration-v1` | Not applicable | Receiving owner required | Post-integration revalidation | Not applicable | Required boundary; holder unappointed |
| `new target assignment: consuming-project setup` | `target-workflow/consuming-project-setup-v1` | Not applicable | Seed/copy owner and no-distribution boundary required | Setup isolation checks | Not applicable | Required boundary; holder unappointed |
| `new target assignment: evaluation and scoring` | `target-workflow/evaluation-and-scoring-v1` | Not applicable | Independent evaluator and human-approved rubric required | Reproducible scoring | Not applicable | Required boundary; holder unappointed |
| `new target assignment: migration governance` | `target-workflow/migration-governance-v1` | Not applicable | Consumer inventory and ledger owner required | Ledger completeness checks | Not applicable | Required boundary; holder unappointed |
| `agents/thinking-companion/agent.md` | `target-workflow/design-facilitation-v1` | Retain as composed holder | Human-facing consultation remains within the role contract; no separate production-agent target is proposed | Agency/no-authority checks | None currently | Workflow assignment; composed holder |
| `new target assignment: fixture control` | `target-workflow/fixture-control-v1` | Not applicable | Evaluator-independent fixture owner required | Protected-control mutation tests | Not applicable | Required boundary; holder unappointed |
| `human role: design reviewer` | `target-human-role/design-reviewer-v1` | Not applicable | Then-current human records package decision | Attributable revision decision | Not applicable | Required boundary; holder is the then-current human |
| `human role: task authorizer` | `target-human-role/task-authorizer-v1` | Not applicable | Explicit task authorization required | Task-admission audit | Not applicable | Required boundary; holder unappointed |

## Validators and fixtures

| Exact source | Exact target | Compatibility period | Identified consumers and migration condition | Validation | Deprecation trigger | Final disposition |
| --- | --- | --- | --- | --- | --- | --- |
| `new target addition: first-slice deterministic validator control set` | `target-validator/first-slice-checks-v1` | Retain through comparison | Evaluator controls remain outside candidate scope | Provider-free positive/negative suite | None currently | Retain and adapt candidate |
| `validation-fixtures/dummy-delegation/as-is.md` | `target-fixture/dummy-delegation-v1` | Retain | Existing fixture consumers remain valid | Delegation fixture checks | None currently | Retain |
| `validation-fixtures/increment-5-dogfood/as-is.md` | `target-fixture/increment-5-dogfood-v1` | Retain | Existing fixture consumers remain valid | Adapter fixture checks | None currently | Retain |
| `validation-fixtures/increment-6-recovery-fixture/as-is.md` | `target-fixture/increment-6-recovery-v1` | Retain | Existing fixture consumers remain valid | Recovery fixture checks | None currently | Retain |
| `validation-fixtures/opencode-mediation-dogfood/as-is.md` | `target-fixture/opencode-mediation-dogfood-v1` | Retain | Existing fixture consumers remain valid | Mediation fixture checks | None currently | Retain |
| `new target addition: committed mock-consumer seed and case matrix` | `target-fixture/mock-consumer-v1` | New fixture after alignment | Setup/evaluator owner and committed seed required | Copy separation and protected-control checks | Not applicable | Required candidate |

## Separate source-artifact and contract inventory

The target ledger covers seven current agent source contracts: `agents/as-is/agent.md`, `agents/component-builder/agent.md`, `agents/worker/agent.md`, `agents/evidence-validator/agent.md`, `agents/execution-advisor/agent.md`, `agents/expert/agent.md`, and `agents/thinking-companion/agent.md`. It maps six to `target-agent/*`; `thinking-companion` is intentionally mapped only to the workflow assignment named in the row above. The eighth agent source, `agents/agent-capability-probe/agent.md`, is a fixture source and is mapped to the fixture row above, not a second target occurrence. The 17 live `skills/*/SKILL.md` sources are covered by the live-skill rows above. `validation-fixtures/agent-capability-probe/agent.md` is a duplicate fixture source used by the capability-probe fixture and has inventory-only treatment: retain unchanged, no separate target ID, and no production disposition. `core/contracts/component-task-record-protocol.md` and `core/contracts/execution-contract.md` are contract inputs with inventory-only treatment: retain unchanged, no separate target ID, and no migration disposition in this package.

## Conditional alternate-family review gate

The human selected `moonshotai/kimi-k3` as the current alternate-family reviewer. It is not a migrated agent, skill, or target production role. The draft-28 Kimi suitability findings were validated by Sol and reconciled by Terra as repairs; draft-30 requires a fresh identity/provenance check and bounded read-only suitability trial. Before use, verify exact model identity and family provenance from authoritative evidence; do not infer independence from a model label or benchmark score. Run the trial against the same sanitized successor package and rubric, measuring valid novel findings, factual support, false claims, authority adherence, uncertainty calibration, cost, and latency. A passed trial and explicit human confirmation are required before a full package review. Findings return to Terra and then to a fresh Sol review on the same identified package revision. Preserve dissent and do not let the reviewer authorize implementation.

## Explicit exclusions

The historical idea of replacing every live skill is not adopted. No live agent or skill is dropped or deprecated by this ledger. External package installation, distribution, credentials, external effects, security-isolation claims, and multi-project operation remain outside the first slice.
