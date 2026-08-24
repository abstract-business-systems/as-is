# Agentic development system target design

## Status and authority

- **Package:** proposed human-facing target design
- **Revision:** `target-design-v1-draft-35`
- **State:** revised after Terra reconciliation of Sol-validated Kimi findings; caller-side manifest verification is complete; pending fresh Sol readiness review, alternate-family gate, Terra reconciliation, and final Sol review
- **Prior Terra report:** `reviews/agentic-development-system/terra-target-design-package-review.md`
- **Prior Sol report:** `reviews/agentic-development-system/sol-target-design-package-review.md`
- **Alternate-family status:** Kimi draft-28 suitability findings were validated by Sol and reconciled by Terra; the successor package still requires a fresh suitability gate and package review
- **Frozen review set:** this root file, the four files under `component-designs/`, `migration-ledger.md`, `setup-and-benchmark.md`, `decision-log.md`, and `review-manifest.md`; the manifest records the exact review revision and content digests
- **Current-state authority:** existing `as-is.md` records, current contracts, live agent and skill files, implementation, and fixtures
- **Planned-state authority:** this frozen package only after the required review cycle and explicit human alignment
- **Implementation authority:** a separate, human-authorized bounded task whose required base records, design reference, scope, capabilities, acceptance, and recovery obligations are current and approved

This package is a proposal. Terra and fresh Sol returned `revise` on prior snapshots; those findings are preserved as review evidence. This draft-35 revision incorporates Terra's reconciliation of the Sol-validated Kimi findings and is not yet approved. Draft-34 is the immediately prior reviewed snapshot and received fresh Sol `revise`; this successor has caller-side attributed verification and requires fresh review. The package does not adopt target contracts, alter current records, create tasks, authorize implementation, or approve a migration. The implementation worker, validators, scorer, baseline, seed, and fixture controls must not modify this package during an evaluation or implementation attempt.

## Executive summary

This proposal describes a reusable agentic-development system. A human chooses the feature and aligns the design. An orchestrator turns that aligned design into one small authorized task. A bounded worker changes only the permitted scope. Independent checks and review examine the result. The owning orchestrator integrates accepted work, records evidence, and escalates unresolved issues. The system is intended to reduce routine implementation effort without transferring design judgment or final authority away from the human.

The first proof is deliberately small: one low-risk feature in a repository-owned mock consuming project, compared with the current workflow. It excludes credentials, network access by task-facing workers, publication, deployment, package installation, and claims of security or multi-project isolation.

## Purpose and outcome

Build a reusable agentic-development system in which humans own feature intent, design judgment, alignment, and design-changing feedback while admitted agents perform bounded implementation and evidence-bearing integration. Agents must operate within explicit component, task, capability, budget, and authority boundaries. Deterministic validation, independent semantic review, durable records, recovery, and human escalation make implementation reviewable without requiring humans to perform routine implementation.

“Implementation as compiled output” is a communication metaphor. It is not a claim that generated implementation is trustworthy without independent validation, review, and evidence.

## Scope

Software development is the first workload. The target also describes the extension boundaries needed later for content generation, general task completion, and specialist collaboration, but those workloads are not first-slice implementation scope. Human-facing prototypes, diagrams, tables, structured design documents, feedback, issue reporting, status inspection, approval, and escalation information needs are in scope; user-interface design is not.

The first proof is repository-local. It includes setup of a separately owned mock consuming project and a current-versus-candidate comparison, but makes no claim of package publication, independent installation, multi-project isolation, security isolation, credential-bearing work, network access, deployment, or external effects. The exact affected-record list below is exhaustive for this package boundary; explicitly excluded current records are unchanged dependencies.

## Current architecture versus planned target

Current architecture is evidence, not automatic target authority. The strongest current substrate candidates are component-scoped durable records, task-control and budget validation, bounded context and role resolution, deterministic checks, parent-owned integration, Pi subprocess/worktree mechanics, recovery fixtures, and read-only evidence roles. Current agents and skills remain live until a separately authorized migration proves a replacement, adaptation, compatibility period, consumer disposition, and recovery path.

The target is a heavy refactor around explicit functional roles, composable reusable procedures, design governance, consuming-project setup, independent result review, and controlled evaluation. A total rewrite remains possible only if controlled evidence shows lower total risk or cost or better target fit, including compatibility complexity, migration cost, maintenance burden, safety, isolation, recoverability, persistent correctness failures, or evaluation results.

## Lifecycle: Path A

Use Path A while current and planned designs remain distinguishable. If that distinction cannot be established reliably, repair or escalate; never silently switch to another lifecycle:


```text
current records + frozen planned package
  -> human alignment on package revision
  -> design-derived bounded build plan
  -> fresh Sol review of build plan
  -> separate bounded task authorization
  -> admitted implementation attempt
  -> deterministic validation and semantic result review
  -> receiving-owner integration and revalidation
  -> current-record reconciliation
```

A design is complete for a bounded implementation unit when the base records needed for every component the unit creates, changes, retires, or depends on through an unresolved design choice are available, linked, current, and approved by the then-current reviewer. The complete target package describes the whole revised system; it does not make every future component implementation-ready.

Renew design review when feedback changes what is being built, who it serves, required behavior, exclusions, allowed risk or external effects, or how success will be judged. Before launch, such feedback supersedes or revokes the prior target revision and blocks launch. During implementation, affected work is checkpointed and the issue bubbles to the applicable orchestrator. After accepted work, a new request becomes a new design proposal or bounded corrective task; it is not silently appended to completed work.

## Proposed authority model

| Responsibility | Proposed authority | Limit |
| --- | --- | --- |
| Human intent and design alignment | Then-current human reviewer | Alignment is not release, credential, spending, security, or external-effect approval. |
| Intake and status routing | Intake/design-status router | Routes and reports; it does not create tasks, infer approval, or implement. |
| Design workflow | Named design/workflow orchestrator | Prepares and revises proposals and bubbles unresolved decisions; it does not self-approve. |
| Component task and integration | Receiving component-delivery orchestrator | Owns scoped task admission, descendant closure, integration, and recovery within its boundary. |
| Implementation | Bounded implementation worker | Changes only the authorized scope; cannot self-accept, integrate, delegate, alter design, or access unrelated credentials. |
| Deterministic evidence | Read-only validators and fixed checks | Observes and reports; validation does not grant completion authority. |
| Semantic result review | Distinct reviewer | Compares actual result with design and acceptance; does not implement or integrate its own review. |
| Evaluation and scoring | Independent evaluator/scorer owner | Controls fixtures and rubric; candidate work cannot change scoring controls. |
| Migration | Migration-governance owner | Maintains the sole migration ledger and consumer evidence. |
| Human escalation | Applicable orchestrator | Child may bubble to caller and ultimately to the named orchestrator; escalation grants no new capability or authority. |

Skills are reusable procedures. They do not grant tools, select roles, create tasks, authorize transitions, integrate results, or approve designs. Globally available tools remain distinct from the capability profile admitted to each attempt.

## Planned target categories

The package separates production agents, workflow assignments, human roles, deterministic validators, fixtures, reusable skills, and master skills. Model/provider assignment is an operational choice separate from role authority. The complete proposed roster and migration truth are in `migration-ledger.md`; reader-oriented boundaries are in `component-designs/`.

## First slice

The recommended first slice is one new low-risk mock application feature, or an existing simple backlog item only if it satisfies the same envelope:

- one mock-project component;
- deterministic acceptance tests;
- a committed seed and separate current/candidate consumer copies;
- no task-facing credentials, network, deployment, publication, deletion, or external effect;
- a frozen target-design revision and required base records;
- a named orchestrator, worker, deterministic validator, semantic reviewer, integration owner, setup owner, fixture owner, and evaluator;
- stale-design rejection, missing-dependency stop, controlled failure/recovery, adversarial-scope stop, and post-integration revalidation;
- no claim of package distribution, security isolation, or general autonomy.

The exact feature, seed revision, baseline revision, candidate revision, accountable holders, and rubric remain human decisions. These unresolved choices block a comparative claim but do not alter the proposed control boundaries.

## Affected current records and planned linkage

The affected-record universe for this revision is exactly every tracked `as-is.md` record under the repository. A record is affected only when its current purpose, ownership, boundary, or planned relationship changes; every other member of the universe is explicitly excluded below. Live role, skill, fixture-source, and contract artifacts are classified separately because they are not `as-is.md` records. These files remain unchanged during package authoring. A later, separately approved record-contract task may add a planned-design reference to affected records while preserving their current-state meaning.

| Current record | Planned relationship | Treatment now |
| --- | --- | --- |
| `as-is.md` | Root target package and design relationship | Link only through this package; do not rewrite current meaning. |
| `agents/as-is/as-is.md` | Intake/status router target | Current record remains authoritative; future linkage requires record-contract approval. |
| `agents/component-builder/as-is.md` | Component-delivery orchestrator target | Current record remains authoritative; future linkage requires record-contract approval. |
| `agents/worker/as-is.md` | Bounded implementation worker target | Current record remains authoritative; future linkage requires record-contract approval. |
| `agents/evidence-validator/as-is.md` | Deterministic evidence reviewer target | Current record remains authoritative; future linkage requires record-contract approval. |
| `agents/expert/as-is.md` | Independent expert-review target | Current record remains authoritative; Grok is not a source record. |
| `agents/thinking-companion/as-is.md` | Design-facilitation workflow holder | Current record remains authoritative; initially composed as the holder for `target-workflow/design-facilitation-v1`, not a separate target-agent category. |
| `agents/execution-advisor/as-is.md` | Execution-evidence advisor target | Current record remains authoritative. |
| `core/adapters/host-setup/as-is.md` | Host-setup adapter context | Current record remains authoritative; package consumption is not inferred. |
| `agents/as-is.md` | Unaffected agent parent context | Explicitly excluded; no parent-record purpose or ownership change. |
| `core/as-is.md` | Unaffected core parent context | Explicitly excluded; no parent-record purpose or ownership change. |
| `core/adapters/as-is.md` | Unaffected adapter parent context | Explicitly excluded; no parent-record purpose or ownership change. |
| `core/adapters/process/as-is.md` | Unaffected process-adapter context | Explicitly excluded; no target boundary change. |
| `core/modules/as-is.md` | Unaffected module parent context | Explicitly excluded; no target boundary change. |
| `core/modules/agent-resolution/as-is.md` | Unaffected agent-resolution context | Explicitly excluded; current contract remains evidence. |
| `core/modules/context-resolution/as-is.md` | Unaffected context-resolution context | Explicitly excluded; current contract remains evidence. |
| `core/modules/observability/as-is.md` | Unaffected observability context | Explicitly excluded; current contract remains evidence. |
| `core/modules/task-control/as-is.md` | Unaffected task-control context | Explicitly excluded; current contract remains evidence. |
| `designs/as-is.md` | Unaffected design parent context | Explicitly excluded; package is a planned draft, not a current-record rewrite. |
| `.pi/prompts/as-is.md` | Unaffected prompt context record | Explicitly excluded; no prompt boundary or authority change. |
| `drafts/as-is.md` | Unaffected draft parent context | Explicitly excluded; no draft-catalog boundary change. |
| `tools/as-is.md` | Unaffected tool parent context | Explicitly excluded; skills do not grant tools. |
| `tools/agent/as-is.md` | Unaffected agent-tool context | Explicitly excluded; no tool boundary change. |
| `tools/context/as-is.md` | Unaffected context-tool context | Explicitly excluded; no tool boundary change. |
| `tools/evidence/as-is.md` | Unaffected evidence-tool context | Explicitly excluded; no tool boundary change. |
| `skills/as-is.md` | Live skill catalog and planned reusable/master dispositions | The migration ledger is the sole planned disposition source. |
| `core/contracts/as-is.md` | Contract collection context | No contract changes are authorized by this package. |
| `validation-fixtures/as-is.md` | Existing fixture parent context | Existing fixtures remain current evidence; the mock fixture is only a candidate addition. |
| `validation-fixtures/dummy-delegation/as-is.md` | Existing delegation fixture | Current record remains authoritative; proposed fixture mapping is in the ledger. |
| `validation-fixtures/increment-5-dogfood/as-is.md` | Existing adapter fixture | Current record remains authoritative; proposed fixture mapping is in the ledger. |
| `validation-fixtures/increment-6-recovery-fixture/as-is.md` | Existing recovery fixture | Current record remains authoritative; proposed fixture mapping is in the ledger. |
| `validation-fixtures/opencode-mediation-dogfood/as-is.md` | Existing mediation fixture | Current record remains authoritative; proposed fixture mapping is in the ledger. |

### Separately classified live source artifacts and contract files

These are not `as-is.md` records and are therefore excluded from the record-only inventory: `agents/as-is/agent.md`, `agents/component-builder/agent.md`, `agents/worker/agent.md`, `agents/evidence-validator/agent.md`, `agents/execution-advisor/agent.md`, `agents/expert/agent.md`, `agents/thinking-companion/agent.md`, `agents/agent-capability-probe/agent.md`, all 17 live `skills/*/SKILL.md` files named in the ledger, and `validation-fixtures/agent-capability-probe/agent.md`. Contract files `core/contracts/component-task-record-protocol.md` and `core/contracts/execution-contract.md` are also separately classified contract inputs, not records. The ledger supplies their exact proposed mappings or compatibility treatment.

### Explicitly excluded individual skill records

The following exact child records are members of the affected-record universe and are unchanged dependencies, not omitted inventory: `skills/as-is-setup/as-is.md`, `skills/building-components/as-is.md`, `skills/committing-completed-work/as-is.md`, `skills/context-building/as-is.md`, `skills/designing-mermaid-diagrams/as-is.md`, `skills/deterministic-skills/as-is.md`, `skills/exploring-execution-evidence/as-is.md`, `skills/human-centered-consulting/as-is.md`, `skills/implementing-component-tasks/as-is.md`, `skills/integrate-as-is-documentation/as-is.md`, `skills/maintaining-components/as-is.md`, `skills/managing-as-is-document/as-is.md`, `skills/managing-backlog/as-is.md`, `skills/naming-software-concepts/as-is.md`, `skills/spawning-pi-subagents/as-is.md`, `skills/structuring-content/as-is.md`, and `skills/verification-discipline/as-is.md`. Each is explicitly excluded because the package proposes disposition only; it does not change the current skill record's purpose, ownership, or authority.

### Separate live source-artifact coverage

The ledger's exact live source artifacts are `agents/as-is/agent.md`, `agents/component-builder/agent.md`, `agents/worker/agent.md`, `agents/evidence-validator/agent.md`, `agents/execution-advisor/agent.md`, `agents/expert/agent.md`, `agents/thinking-companion/agent.md`, `agents/agent-capability-probe/agent.md`, `skills/as-is-setup/SKILL.md`, `skills/building-components/SKILL.md`, `skills/committing-completed-work/SKILL.md`, `skills/context-building/SKILL.md`, `skills/designing-mermaid-diagrams/SKILL.md`, `skills/deterministic-skills/SKILL.md`, `skills/exploring-execution-evidence/SKILL.md`, `skills/human-centered-consulting/SKILL.md`, `skills/implementing-component-tasks/SKILL.md`, `skills/integrate-as-is-documentation/SKILL.md`, `skills/maintaining-components/SKILL.md`, `skills/managing-as-is-document/SKILL.md`, `skills/managing-backlog/SKILL.md`, `skills/naming-software-concepts/SKILL.md`, `skills/spawning-pi-subagents/SKILL.md`, `skills/structuring-content/SKILL.md`, and `skills/verification-discipline/SKILL.md`. Their proposed mappings and retain/adapt treatment are exact ledger rows; no source artifact is silently removed.

## Setup and evaluation

`setup-and-benchmark.md` defines one exact workflow-comparison contract and a separate implementation-boundary contract. Its closed protected-input registry, nested manifest rules, explicit 36-entry case/dimension predicate registry, and scoring equations are authoritative for this package. Each paired run freezes provider, model identifier/version, full generation configuration, budget, retries, rubric, validators, host/runtime, feature goal, seed, risk envelope, case matrix, acceptance tests, fixture controls, and scoring. Only the finite system-specific differences listed by the applicable experiment may vary. The permitted differences form a treatment bundle; a completed result supports only bundle-level comparison, or non-isolated descriptive reporting when a confounder exists. Individual-factor attribution requires a separately approved ablation or factorial design.

Candidate advancement requires no safety-critical failure, acceptance-mapped deterministic evidence, semantic result review, stale-design rejection, safe missing-dependency and adversarial-scope stops, recoverable controlled failure, clean or explicitly bounded setup behavior, and no unjustified increase in human review burden. A benchmark result never authorizes its own adoption.

## Self-application and recovery

Candidate changes are bootstrapped by the current task-control and launcher substrate, not by the candidate mechanism being created. Protected design, task, seed, baseline, validator, scorer, rubric, and fixture controls remain outside worker write scope. The active branch is the candidate/recovery boundary; a pinned `master` revision is only a baseline. No separate rollback subsystem is proposed absent evidence. Partial work, failed attempts, budget stops, and unavailable runtime state remain recoverable through task records and Git evidence.

## Future boundaries

Content generation, general tasks, specialist expert/domain-human collaboration, external package consumption, versioned bundles, upgrades, downgrade, uninstall, and multi-project isolation remain planned extension areas. They require their own artifacts, acceptance, capability profiles, review, provenance, and human decisions. The first software slice must not claim to solve them.

## Human-facing package guide

Read this document first. It explains the proposal, intended first proof, boundaries, lifecycle, and unresolved human choices. The companion documents contain progressively more detail:

| If you want to understand… | Read… |
| --- | --- |
| the proposal in plain language | this document, especially Executive summary, Scope, First slice, and Open decisions |
| who may decide, act, review, or integrate | `component-designs/architecture-and-authority.md` and `component-designs/agent-roster.md` |
| how current skills relate to the proposal | `component-designs/skill-roster.md` and `migration-ledger.md` |
| how the first proof is set up and judged | `component-designs/consuming-project-and-evaluation.md` and `setup-and-benchmark.md` |
| what remains for human decision | `decision-log.md` |
| exact review identity and file integrity | `review-manifest.md` and the linked verification record |

The benchmark schemas and predicate registry are implementation-facing detail, not required reading for understanding the proposal. They are retained for later review and can be read after the human-facing sections.

## Package navigation

- `component-designs/architecture-and-authority.md` — proposed control-plane and responsibility boundaries.
- `component-designs/agent-roster.md` — proposed functional role boundaries and limits.
- `component-designs/skill-roster.md` — proposed reusable/master composition boundaries.
- `component-designs/consuming-project-and-evaluation.md` — proposed mock-consumer and evidence boundary.
- `migration-ledger.md` — sole source of migration/disposition truth.
- `setup-and-benchmark.md` — setup, fixture, paired-run, scoring, and advancement proposal.
- `decision-log.md` — unresolved human decisions, review state, reconciliation, and alignment record.
- `review-manifest.md` — exact frozen file set, content digests, and review-state contract.
- `reviews/agentic-development-system/terra-target-design-package-review.md` — advisory Terra review; prior verdict was revise.
- `reviews/agentic-development-system/sol-target-design-package-review.md` — advisory Sol review of an earlier package revision; prior verdict was revise.
- `reviews/agentic-development-system/sol-target-design-package-review-draft22.md` — advisory Sol review of draft-22; verdict was revise.
- `reviews/agentic-development-system/sol-target-design-package-review-draft24.md` — advisory Sol review of draft-24; verdict was revise.
- `reviews/agentic-development-system/sol-target-design-package-review-draft25.md` — advisory Sol review of draft-25; verdict was revise.
- `reviews/agentic-development-system/sol-target-design-package-review-draft27.md` — advisory Sol review of draft-27; incomplete/budget-stopped evidence.
- `reviews/agentic-development-system/sol-target-design-package-review-draft27-final.md` — advisory Sol review of draft-27; incomplete/budget-stopped evidence.
- `reviews/agentic-development-system/sol-target-design-package-review-draft30.md` — advisory Sol review of draft-30; verdict was revise.
- `reviews/agentic-development-system/sol-target-design-package-review-draft31.md` — advisory Sol review of draft-31; verdict was revise.
- `reviews/agentic-development-system/terra-kimi-findings-reconciliation-draft31-sol.md` — advisory Terra reconciliation of draft-31 Sol findings; repairs required.
- `reviews/agentic-development-system/sol-target-design-package-review-draft33.md` — advisory Sol review of draft-33; verdict was revise.
- `reviews/agentic-development-system/terra-kimi-findings-reconciliation-draft32-sol.md` — advisory Terra reconciliation of draft-33 findings; repairs required.
- `reviews/agentic-development-system/sol-target-design-package-review-draft34.md` — advisory Sol review of draft-34; verdict was revise.
- `reviews/agentic-development-system/terra-kimi-findings-reconciliation-draft33-sol.md` — advisory Terra reconciliation of draft-34 findings; repairs required.
- `reviews/agentic-development-system/terra-kimi-findings-reconciliation-draft32-sol.md` — advisory Terra reconciliation of draft-33 Sol findings; repairs required.
- `reviews/agentic-development-system/sol-validation-of-kimi-trial.md` — advisory validation of Kimi findings; routed to Terra.
- `reviews/agentic-development-system/terra-kimi-findings-reconciliation.md` — advisory Terra reconciliation; all six findings dispositioned as repair.
- `reviews/agentic-development-system/kimi-target-design-review-trial.md` — prior Kimi suitability gate and draft-28 evidence; not a draft-35 package review.
- `reviews/agentic-development-system/target-design-draft34-manifest-verification.md` — caller-side verification for this draft-35 revision.

## Review revision and state transitions

A review revision is the manifest-defined file set plus content digests. The package state transitions are `draft` → `frozen-for-review` → `internally-reviewed` → `human-aligned` or `superseded`/`revoked`. A Terra/Sol/alternate-family review never changes the package to `human-aligned`; only the then-current human reviewer can do that. A later revision supersedes an earlier one only through an explicit decision-log entry and a new manifest.

## Explicit non-authorization

This package, its review reports, the OpenRouter screening, a model recommendation, a benchmark result, a backlog entry, a branch, a commit, or a process exit does not authorize implementation. Implementation may begin only after the required review cycle, explicit human alignment on the target design, a reviewed design-derived build plan, current required base records, confirmed holders and capabilities, and a separately authorized bounded task.