# Terra expanded re-planning report — advisory and read-only

## Decision

**Recommendation: pursue a staged heavy refactor, not simple continuation and not a total rewrite.**

The target should be a revised, composable agent-and-skill system that retains the proven deterministic substrate—component records, task control, bounded validation, parent integration, and launcher mechanics—but refactors the agent roster, skill catalog, design-to-task flow, and setup/consumption boundary around the stated goal.

This is not implementation authority. The human/project owner must still approve the target design, first slice, target contracts, and each bounded implementation task.

### Decision summary

| Decision area | Advisory recommendation | Not decided here |
| --- | --- | --- |
| Overall strategy | **Heavy refactor in additive stages** | Exact target contracts and implementation order |
| Existing control plane | Retain task control, component boundaries, deterministic checks, and parent-owned integration as substrate | Whether particular implementations need internal replacement |
| Agents and skills | Refactor toward a smaller explicit orchestration roster and composable skill catalog; preserve compatibility while migration evidence is incomplete | Final agent names, models, and adopted contracts |
| Design completion | Complete for one **approved bounded implementation unit** when all base current/planned design records it creates, changes, retires, or materially depends upon are available, linked, and approved by the then-current reviewer | Whether the user instead intends the complete long-term system to be designed before any implementation |
| Lifecycle | Path A only: frozen planned design drives tasks; current and planned state remain distinct | Any future exception to Path A |
| Setup/consumption | Include it in the implementation goal and evaluate it from clean mock consuming-project copies | Distribution channel and production support promise |
| Branches | Current active branch is the candidate/recovery boundary; `master` is a pinned evaluation baseline only | Exact candidate and baseline revisions |
| Alternate reviewer | Do **not** select a concrete model now; define and approve a selection protocol before consumption/security expansion | Provider, model, reviewer identity, and model-family independence |
| First slice | Use a low-risk mock consuming-project comparison plus a simple existing backlog item where it genuinely fits | Selected feature, owners, and risk envelope |

---

## Authority and provenance

| Category | Meaning in this report | Authority status |
| --- | --- | --- |
| Historical proposal | `drafts/design-realization-flows.md`, earlier all-skills replacement ideas, model/pricing claims in drafts | Context only; not implementation direction |
| Current live catalog | Contracts under `agents/*/agent.md`, `skills/*/SKILL.md`, applicable `as-is.md` records, task protocol, launcher and setup records | Current architecture/procedure evidence |
| Target proposal | This report’s target roster, skill compositions, consumption design, migration stages, and evaluation design | Advisory; requires adoption |
| Implementation authority | Human-approved design, adopted target contracts, an authorized task record, admitted role/capability profile, and required review gates | Not present |
| Backlog | Proposed future work, including `drafts/backlog.md` | Planning index only; not authority |

**Evidence limitation:** this pass was read-only. It did not run tests, inspect a live branch state, invoke Pi, inspect provider benchmark data, install a package, or execute a consuming-project setup. Conclusions about runtime enforcement and consumption remain design hypotheses requiring controlled evaluation.

---

# 1. Scope interpretation

The clarified “entire implementation” is best interpreted as the **complete explicitly approved implementation unit**—for example, the first mock-feature and consumption-comparison slice, or a later release-sized migration—not one task at a time and not every future capability of the long-term system.

That interpretation preserves both user constraints:

- base design records must exist before implementation starts; and
- a small first slice, including a mock feature, remains possible.

A stricter interpretation—requiring the whole future development, content, general-task, specialist, and distribution system to be designed before any change—is valid only if the user explicitly intends it. It would defer the requested empirical comparison substantially.

## Design-completion rule

> Design is complete for an approved implementation unit when current-state and planned-target base design records for every component that unit creates, changes, retires, or materially depends upon are available, linked, and approved by the then-current reviewer. Implementation may start only for tasks covered by those records.

Unchanged dependencies may rely on their current records unless the unit depends on an unresolved design choice in them.

## Design-changing feedback rule

Use this plain-language test rather than “material change”:

> Feedback requires renewed design review if it changes a reasonable reviewer’s answer to: **what are we building; who is it for; what must it do; what is excluded; what risks or external effects are allowed; or how will success be judged?**

---

# 2. Strategy comparison

| Strategy | Evidence and fit | Cost | Primary risks | Assessment |
| --- | --- | ---: | --- | --- |
| **Continuation** | Current component-builder, worker, task-control, launcher, validation, setup, and skill catalog already support bounded repository work. Prior reports correctly identified the missing design-governance and consumption layers. | Lowest immediate cost | Leaves overlapping long-form skill contracts, no coherent target consumption model, no clear design orchestration role, and preserves compatibility surfaces that obstruct a composable target. | Insufficient for the stated complete goal. Suitable only as a baseline and migration substrate. |
| **Heavy refactor** | `drafts/composable-skills.md` provides a direction for reusable and master skills; current live records already separate agents, tools, skills, task authority, and host adapters. The repository has fixtures and a task-control substrate that can support incremental proof. | Moderate to high, staged | Migration compatibility, duplicated old/new procedures, target contract drift, and excessive scope if every proposed skill is created without consumers. | **Recommended.** Refactor around explicit target roles, reusable procedures, master compositions, setup/consumption, and measurable comparison while retaining current substrate until evidence supports retirement. |
| **Total rewrite** | Could yield a clean design, but current task control, deterministic validation, launcher budget behavior, component records, recovery fixtures, and integration logic provide substantial reusable evidence. | Highest; delays useful comparison | Recreates already-solved mechanics, invalidates existing fixtures, obscures causal comparison, and increases circular self-authorization risk. | Not justified now. Reconsider only if controlled evaluation shows core task-control or host-admission assumptions cannot support the target. |

## Recommendation rationale

A heavy refactor satisfies the user’s willingness to rewrite agents and skills while avoiding the false economy of recreating deterministic task control and validation. It also permits a meaningful current-versus-candidate comparison: the current workflow remains observable as a pinned baseline, while the candidate is an explicit replacement composition rather than a lightly renamed continuation.

---

# 3. Alternate-reviewer selection

## Status

**Do not select a concrete alternate reviewer now.**

No current evidence establishes:

1. the actual model family behind the repository’s `small`, `medium`, `large`, and `xlarge` presets;
2. a candidate reviewer’s independent model family;
3. a current benchmark result, provider route, capability, terms, or availability; or
4. a risk-specific reviewer evaluation on this repository’s target workload.

Selecting a named model now would therefore manufacture independence rather than prove it.

This does **not** defer review indefinitely. The first low-risk mock slice may proceed to design review without an alternate-family reviewer if it has no task-accessible credentials, external effects, or security-isolation claims. Alternate review becomes a required design gate before distribution, external consuming-project claims, credential-bearing work, external effects, broader autonomy, or security-isolation claims.

## Evidence-supported reviewer candidates

These are **reviewer profiles**, not selected providers or agents.

| Candidate profile | Evidence-supported use | Required independence evidence | Earliest justified gate |
| --- | --- | --- | --- |
| Capability-security reviewer from a verified different model family | Challenge child environment, tool admission, shell/network bypasses, credential exposure, and stale-design prevention | Model-family provenance, read-only contract, no credentials, no implementation authority | Before credential-bearing work or external effects |
| Reproducibility and benchmark reviewer from a verified different model family | Challenge fixture freezing, scoring, contamination, paired-run controls, and metric gaming | Model-family provenance, benchmark-method competence, isolated fixtures | Before treating benchmark results as rollout evidence |
| Package and supply-chain reviewer from a verified different model family or qualified specialist | Challenge clean installation, immutable bundle references, upgrade/downgrade, project partitioning, and uninstall behavior | Relevant package/distribution evidence and no implementation/integration authority | Before external-consumption claim |

## What remains unselected

- Model/provider and exact model IDs.
- The primary architecture-review model family.
- Alternate reviewer family and independence proof.
- Whether one reviewer can credibly cover all three risk areas.
- Any authorized provider benchmark retrieval process.
- The reviewer’s final scope, evidence packet, cost budget, and human receiving owner.

A provider benchmark may shortlist candidates later, but local evaluation and accountable human judgment remain decisive.

---

# 4. Current agent disposition matrix

The live catalog contains **seven production roles plus one test fixture**, not an adopted Sol/Terra/Luna roster.

| Current live contract | Current purpose/evidence | Target disposition | Migration path | Unresolved authority or risk |
| --- | --- | --- | --- | --- |
| `agents/agent-capability-probe/agent.md` | Read-only one-call capability test fixture | **Retain** as fixture | Add target-role admission scenarios only after target role contracts exist | Whether fixture coverage should test setup and design-link admission |
| `agents/as-is/agent.md` | Front-face router; explicitly does not start inferred work | **Replace** with a more explicit intake/design-status router, retaining a compatibility adapter during migration | Split routing from named workflow orchestration; preserve “recommendation, not authorization” behavior | Whether routing and design-orchestration remain separate roles |
| `agents/component-builder/agent.md` | Component delivery, delegation, integration, task recovery, completion | **Adapt** into component-delivery orchestrator | Retain component authority; add frozen-design admission, result/design comparison, capability-profile checks, and recovery rules | Whether it can orchestrate cross-component design without becoming overbroad |
| `agents/evidence-validator/agent.md` | Fixed read-only controlled-worktree validation | **Adapt** | Extend inputs to validate design reference, launch eligibility evidence, result disposition, and acceptance mapping | Trusted source and format for design-currentness evidence |
| `agents/execution-advisor/agent.md` | Read-only traces/session/budget advice | **Retain** | Use as benchmark and failure-analysis support; do not give it lifecycle authority | Whether first slice needs runtime telemetry beyond deterministic evidence |
| `agents/expert/agent.md` | Read-only bounded second perspective | **Retain and compose** | Use for architecture, design, and targeted external-review preparation; do not relabel as authority | Whether a dedicated architecture-review role should be created |
| `agents/thinking-companion/agent.md` | Human-facing consultation with optional expert consultation | **Retain and compose** | Use for design explanation and feedback framing, never for approval or task creation | Whether a dedicated design facilitator is needed after evidence |
| `agents/worker/agent.md` | Leaf bounded implementation without commit, delegation, credentials, or external communication | **Adapt** | Bind exact task, frozen design reference, admitted capability profile, and protected fixture/design locations | Demonstrable child environment, filesystem, network, and credential boundaries |

## Current agent conclusion

| Disposition | Current contracts |
| --- | --- |
| Retain | `agent-capability-probe`, `execution-advisor` |
| Retain and compose | `expert`, `thinking-companion` |
| Adapt | `component-builder`, `evidence-validator`, `worker` |
| Replace through compatibility migration | `as-is` |
| Deprecate or drop now | None |

“Replace” is a target migration intent, not authorization to remove the current `as-is` router. No contract should be deleted before a target consumer, equivalence test, migration path, and recovery value are established.

---

# 5. Target agent roster

This is a proposed functional roster. Model assignment remains separate from role authority.

| Target role | Source/disposition | Primary responsibility | Must not do |
| --- | --- | --- | --- |
| Intake and design-status router | New replacement for current `as-is` | Route requests, report design/task state, identify the named orchestrator | Create tasks, infer approval, silently become orchestrator |
| Design/workflow orchestrator | New or explicit assignment to a refactored component builder for the first slice | Coordinate root design package, feedback, human escalation, and design-to-task preparation | Approve design on behalf of human, self-authorize implementation |
| Component-delivery orchestrator | Adapted `component-builder` | Own component task, delegation, recovery, integration, and result closure | Edit separate child boundaries or treat child exit as completion |
| Bounded implementation worker | Adapted `worker` | Implement one admitted task against a frozen design reference | Delegate, self-accept, access non-admitted credentials, perform external effects |
| Deterministic evidence validator | Adapted `evidence-validator` | Inspect controlled evidence and execute only fixed checks | Mutate, integrate, select tasks, or accept its own plan |
| Semantic result reviewer | **New** distinct review session/role | Compare actual artifact and evidence to design and task acceptance | Implement or integrate its own reviewed result |
| Integration owner | Initially the receiving component-delivery orchestrator | Accept eligible result into parent scope and rerun integration checks | Substitute review evidence with child exit status |
| Execution and evaluation advisor | Retained `execution-advisor` | Analyze bounded runtime/benchmark evidence | Change budgets, retry, or score its own candidate |
| Architecture/specialist reviewer | Composed `expert` initially; later dedicated profile if justified | Advisory adversarial review and targeted specialist questions | Acquire task, approval, integration, or deployment authority |
| Capability-probe fixture | Retained `agent-capability-probe` | Verify target admission behavior | Become a normal production worker |

The first slice need not instantiate every target role as a new contract. It does need each responsibility to be explicitly named and separated.

---

# 6. Current skill disposition matrix

| Current live skill | Current evidence | Target disposition | Target role in migration |
| --- | --- | --- | --- |
| `as-is-setup` | Project/directory-scoped as-is adoption and plan | **Adapt** | Become part of consumer-project setup and base-record establishment |
| `building-components` | Master component delivery procedure | **Adapt** | Remain master composition, with design-link admission and result/design review |
| `committing-completed-work` | Scoped validated completion mechanics | **Retain** | Preserve commit mechanics; do not treat commit as design approval |
| `context-building` | Smallest authoritative context set | **Retain and rename-align** | Direct coverage for target `building-context` |
| `designing-mermaid-diagrams` | Human-readable Mermaid views | **Retain and compose** | Design-package visual representation |
| `deterministic-skills` | Evidence-based deterministic improvement assessment | **Retain** | Later hardening and repeatability analysis |
| `exploring-execution-evidence` | Read-only trace/session investigation | **Retain** | Evaluation and failure diagnosis |
| `human-centered-consulting` | Agency-preserving consultation | **Retain and compose** | Human design and feedback communication |
| `implementing-component-tasks` | Component task lifecycle | **Adapt** | Require deterministic design reference and currentness before launch |
| `integrate-as-is-documentation` | Reviewable as-is adoption/decomposition | **Adapt** | Establish base record set for implementation unit and consumer fixture |
| `maintaining-components` | Evidence-based bounded maintenance | **Retain** | Keep design discrepancy separate from silent maintenance change |
| `managing-as-is-document` | Current component record contract | **Adapt** | Add explicit current/planned relationship without mixing active task state |
| `managing-backlog` | Planning index and reconciliation | **Retain** | Backlog remains non-authoritative task selection input |
| `naming-software-concepts` | Naming method | **Retain** | Name new roles, skills, design records, and consumer resources |
| `spawning-pi-subagents` | Pi child launch, worktree, budget, observation | **Adapt** | Add fail-closed candidate profile requirements; keep launcher non-authoritative |
| `structuring-content` | Durable information structure | **Retain and compose** | Place design packages, consumption manifests, and evaluation records |
| `verification-discipline` | Acceptance-mapped evidence | **Adapt** | Add design correspondence, launch evidence, review disposition, and integration revalidation |

## Current skill conclusion

| Disposition | Skills |
| --- | --- |
| Retain | `committing-completed-work`, `deterministic-skills`, `exploring-execution-evidence`, `maintaining-components`, `managing-backlog`, `naming-software-concepts` |
| Retain and compose | `context-building`, `designing-mermaid-diagrams`, `human-centered-consulting`, `structuring-content` |
| Adapt | `as-is-setup`, `building-components`, `implementing-component-tasks`, `integrate-as-is-documentation`, `managing-as-is-document`, `spawning-pi-subagents`, `verification-discipline` |
| Replace/deprecate/drop now | None |

The earlier report’s count needs correction: **seven**, not six, skills are identified for adaptation.

---

# 7. Target skill roster

## Reusable target skills

The target should not create every named capability merely because it appears in a draft. A candidate becomes a live skill only when it has a distinct owner, at least one plausible independent consumer, no existing equivalent, and focused validation.

| Target reusable skill | Proposed source | Initial target status |
| --- | --- | --- |
| `building-context` | Adapt `context-building` | Required |
| `resolving-scopes` | New extraction from setup/task/record procedures | Required for general change and consuming-project setup |
| `identifying-owners` | New focused extraction | Required for orchestration and consumption design |
| `locating-changelogs` | Possible extraction | Deferred until a non-task consumer is demonstrated |
| `choosing-names` | Adapt `naming-software-concepts` | Retain |
| `structuring-content` | Retain | Retain |
| `drafting-content` | Possible extraction | Deferred; current consultation/structure procedures cover it |
| `writing-code` | New worker-support procedure | Candidate; validate independent reuse |
| `applying-bounded-edits` | New worker-support procedure | Candidate; validate independent reuse |
| `writing-tests` | New, supported by existing backlog item | Candidate for early adoption |
| `running-tests` | Possible extraction from verification | Candidate; only if independent contract is useful |
| `validating-changes` | Adapt `verification-discipline` | Required |
| `recording-evidence` | New focused extraction | Required for benchmark/result records if current task narrative is insufficient |
| `designing-diagrams` | Adapt `designing-mermaid-diagrams` | Retain |
| `rendering-diagrams` | Possible extraction | Deferred until renderer is a real portable consumer need |
| `inspecting-execution-evidence` | Adapt `exploring-execution-evidence` | Retain |
| `assessing-determinism` | Adapt `deterministic-skills` | Retain |
| `recording-backlog-items` | Possible extraction | Deferred; existing backlog management is sufficient |
| `drafting-changelog-entries` | Possible extraction | Deferred; completion procedure currently covers it |
| `delegating-bounded-work` | Extraction from builder/launcher | Required for target orchestration composition |
| `observing-delegated-work` | Extraction from launcher/evidence procedure | Required for target orchestration composition |
| `preparing-scoped-commits` | Adapt `committing-completed-work` | Retain |
| `presenting-decisions` | New focused procedure or compose consulting | Candidate; required only if design packages show a gap |
| `choosing-change-methods` | New focused extraction | Required for `making-changes` |
| `designing-and-aligning-design` | New | Required: root design package, feedback, alignment, supersession |
| `setting-up-consuming-projects` | New composition around setup/host adapter | Required: installation/consumption is in scope |
| `reviewing-implementation-results` | New | Required: semantic review disposition separate from validation |
| `evaluating-workflows` | New | Required: fixed fixture, paired benchmark, decision rule |

## Master target skills

| Target master skill | Live/proposed source | Target status |
| --- | --- | --- |
| `making-changes` | New from composable-skills proposal | Required pilot/master workflow |
| `building-components` | Adapt existing | Required |
| `implementing-tasks` | Adapt `implementing-component-tasks` | Required |
| `maintaining-components` | Existing | Retain |
| `managing-as-is-records` | Adapt `managing-as-is-document` | Required |
| `designing-mermaid-diagrams` | Existing | Retain |
| `managing-backlogs` | Existing | Retain |
| `managing-changelogs` | New only if task-independent history consumers emerge | Candidate |
| `spawning-subagents` | Adapt `spawning-pi-subagents` | Required |
| `exploring-execution-evidence` | Existing | Retain |
| `consulting-humans` | Adapt/compose `human-centered-consulting` | Required for design package and feedback |
| `committing-completed-work` | Existing | Retain |
| `designing-and-aligning-implementation-units` | New target master | Required |
| `setting-up-and-evaluating-consuming-projects` | New target master | Required |

---

# 8. Complete mapping from `drafts/composable-skills.md`

## Source correction

The draft says it proposes **25 reusable skills**, but its actual reusable-skill headings enumerate **24**. This discrepancy must be corrected before the proposal is adopted or measured.

## Proposed reusable-skill mapping

| Draft proposal | Live coverage | Target disposition |
| --- | --- | --- |
| `building-context` | `context-building` | Adapt/rename-align |
| `resolving-scopes` | Partial: `as-is-setup`, `integrate-as-is-documentation`, task/record procedures | Create focused target skill |
| `identifying-owners` | Partial: component records, task protocol, `context-building` | Create focused target skill |
| `locating-changelogs` | Partial: task and completion procedures | Defer pending independent consumer |
| `choosing-names` | `naming-software-concepts` | Retain/adapt naming only |
| `structuring-content` | `structuring-content` | Retain |
| `drafting-content` | Partial: `structuring-content`, `human-centered-consulting` | Defer |
| `writing-code` | Worker/builder role behavior, not live skill | Candidate new reusable skill |
| `applying-bounded-edits` | Worker/builder role behavior, not live skill | Candidate new reusable skill |
| `writing-tests` | Partial: `building-components`, `verification-discipline` | Candidate new reusable skill |
| `running-tests` | Partial: `verification-discipline` | Candidate extraction |
| `validating-changes` | `verification-discipline` | Adapt |
| `recording-evidence` | Partial: task, builder, execution-evidence procedures | Create only if target evidence record needs it |
| `designing-diagrams` | `designing-mermaid-diagrams` | Retain/adapt name only |
| `rendering-diagrams` | Partial: `designing-mermaid-diagrams` | Defer |
| `inspecting-execution-evidence` | `exploring-execution-evidence` | Retain/adapt name only |
| `assessing-determinism` | `deterministic-skills` | Retain/adapt name only |
| `recording-backlog-items` | `managing-backlog` | Defer |
| `drafting-changelog-entries` | `implementing-component-tasks`, `committing-completed-work` | Defer |
| `delegating-bounded-work` | `building-components`, `spawning-pi-subagents` | Create focused composition boundary |
| `observing-delegated-work` | `spawning-pi-subagents`, `exploring-execution-evidence` | Create focused composition boundary |
| `preparing-scoped-commits` | `committing-completed-work` | Retain/adapt name only |
| `presenting-decisions` | Partial: `human-centered-consulting` | Candidate; validate need from design package |
| `choosing-change-methods` | Partial role/procedure behavior | Create focused target skill |

## Proposed master-skill mapping

| Draft proposal | Live coverage | Target disposition |
| --- | --- | --- |
| `making-changes` | No direct live master skill | Create as primary general-change composition |
| `building-components` | `building-components` | Adapt |
| `implementing-tasks` | `implementing-component-tasks` | Adapt/rename-align |
| `maintaining-components` | `maintaining-components` | Retain |
| `managing-as-is-records` | `managing-as-is-document` | Adapt/rename-align |
| `designing-mermaid-diagrams` | `designing-mermaid-diagrams` | Retain |
| `managing-backlogs` | `managing-backlog` | Retain/rename-align |
| `managing-changelogs` | Partial task/completion coverage | Candidate, not automatic |
| `spawning-subagents` | `spawning-pi-subagents` | Adapt/rename-align |
| `exploring-execution-evidence` | `exploring-execution-evidence` | Retain |
| `consulting-humans` | `human-centered-consulting`, supported by `thinking-companion` | Adapt/compose |
| `committing-completed-work` | `committing-completed-work` | Retain |

---

# 9. Retain/adapt/compose/replace/deprecate/drop table

| Subject | Retain | Adapt | Compose | Replace | Deprecate | Drop |
| --- | ---| --- | --- | --- | --- | --- |
| Task control and component task protocol | Yes | Design-link extension may be required | Yes | No | No | No |
| Parent-owned integration | Yes | Add design/result comparison | Yes | No | No | No |
| Pi launcher | Yes | Candidate admission, environment/profile, consumption support | Yes | No | No | No |
| Current front-face `as-is` role | Compatibility only | — | — | Yes, with explicit intake/design-status router | Later, after migration proof | Not now |
| Current component-builder | Yes | Yes | Yes | No | No | No |
| Current worker | Yes | Yes | Yes | No | No | No |
| Current validator | Yes | Yes | Yes | No | No | No |
| Current general consultant roles | Yes | — | Yes | No | No | No |
| Existing live skills | Yes pending proof | Seven immediate adaptations | Many | Only where target contract proves equivalence | Only after consumers migrate | None now |
| Historical “replace every skill” proposal | No | — | — | Rejected as migration strategy | Historical only | Not applicable |
| Sol/Terra/Luna labels as mandatory system roster | No | — | May describe model assignments | Replace with functional roles | Do not adopt as architecture | Not applicable |
| Path B as authority source | No | — | — | Path A remains target | Historical/deferred | Not a removal operation |

---

# 10. Proposed additions

| Addition | Why it is needed | First-slice requirement |
| --- | --- | --- |
| Frozen root planned-design package | Gives task a durable, reviewable design basis | Required |
| Current/planned relationship in relevant base records | Prevents target behavior being represented as current behavior | Required |
| Design alignment, supersession, and revocation representation | Makes human approval attributable and launch eligibility checkable | Required |
| Design-to-task deterministic reference | Prevents launching from prose-only or stale design | Required |
| Named workflow orchestrator and review owners | Closes human-escalation and result-review gaps | Required |
| Target capability/environment profile | Separates global tool availability from task admission | Required |
| Semantic implementation-result review | Prevents worker self-acceptance | Required |
| Mock consumer setup master skill | Makes setup/consumption part of evaluated goal | Required |
| Paired workflow/consumption evaluation harness | Compares current and candidate fairly | Required |
| Dedicated design facilitator | Helps when design flow is too complex for existing roles | Deferred pending evidence |
| Architecture-review role | Distinguishes advisory architectural review from generic consultation | Deferred pending target contract and reviewer selection |
| Versioned portable bundle/package | Supports external consumption | Design required before external claim; implementation can follow first internal fixture |
| Project isolation, upgrades, uninstall, downgrade support | Required for production external consumption | Deferred from first internal proof, but must be designed before external claim |

---

# 11. Setup and consumption design

## Target consumption boundary

The proposed target is a **versioned immutable bundle/package with thin host adapters**, not mutable links into the source repository.

| Layer | Ownership | Required property |
| --- | --- | --- |
| Bundle/package | System distribution owner | Versioned agents, skills, deterministic modules, templates, and host adapters |
| Consuming project | Consumer project owner | Project-local `as-is` records, planned designs, task records, feedback, issues, backlog, and evidence |
| Host-private runtime | Host/operator | Project-partitioned sessions, traces, temporary state, and narrowly scoped credentials |
| Provider access | Host/operator | Provider authentication unavailable to task-facing tools unless explicitly admitted |
| Host adapter | Adapter owner | Maps bundle contracts to Pi/host mechanics without becoming task or approval authority |

The current host-setup adapter is useful internal evidence, but its own record states that it does not prove independently installed-package operation. The current launcher also retains repository-oriented assumptions. Therefore the first candidate setup must explicitly document unsupported behavior rather than claim portable installation before it is tested.

## Setup contract to design before implementation

| Setup concern | Candidate behavior to evaluate |
| --- | --- |
| Prerequisites | Pin supported Pi/host version, Bun/runtime requirements, and package integrity |
| Install plan | Dry-run first; explicit target directory and consent; no undeclared external install |
| Resource location | Immutable/version-pinned bundle reference; no mutable cross-project source link |
| Project initialization | Project-local configuration and base record plan; no copied secrets |
| Configuration precedence | Fixed safety policy > host policy > project policy > approved local override > bundle default |
| Idempotence | Re-running setup reports existing state and does not overwrite unrelated files |
| Failure | Transactional or clearly recoverable partial state; no false success |
| Upgrade/downgrade | Schema compatibility, migration, and clear unsupported-version failure |
| Removal | Explicit uninstall scope; preserves consumer-owned designs/tasks/evidence unless approved otherwise |
| Isolation | Separate runtime identities, state, records, traces, sessions, temporary resources, and credentials for each consumer |

---

# 12. Mock consuming-project comparison design

## Fixture topology

Create three separately identified directories from the same committed mock-project seed:

| Directory role | Contents | Purpose |
| --- | --- | --- |
| Seed mock project | Minimal deterministic project and frozen feature specification | Source copied or initialized identically for both evaluations |
| Current consumer copy | Seed project + current setup/workflow | Baseline behavior |
| Candidate consumer copy | Seed project + candidate setup/workflow from active candidate branch | Candidate behavior |

The mock project must be outside the agentic-system component directories and must not share mutable runtime state with either consumer copy.

## Same-feature rule

Both copies receive:

- the same frozen feature brief;
- the same planned design package or equivalent input appropriate to the experiment;
- the same acceptance tests and deterministic validators;
- identical model configuration, task budgets, retry policy, host version, and fixture revision where practical;
- the same reviewer rubric; and
- the same prohibition on task-accessible credentials and external effects.

The candidate must not edit the feature fixture, scoring rule, or baseline copy.

## Evaluation cases

| Case | Current setup | Candidate setup | Expected safe behavior |
| --- | --- | --- | --- |
| Normal simple feature | Execute using current procedures | Execute using refactored design-first composition | Validated change with review evidence |
| Setup from clean mock project | Current host setup behavior | Candidate portable/setup behavior | Explicit prerequisites, bounded writes, and no unsupported claim |
| Missing dependency | Same intentional missing input | Same input | Stop/escalate rather than invent/broaden |
| Stale or superseded design | Task references stale design fixture | Candidate admission receives stale design | Candidate rejects launch; baseline behavior is observed, not excused |
| Budget/failure recovery | Controlled worker failure or timeout | Same controlled failure | Preserve recovery evidence and require authorized next action |
| Adversarial scope input | Same non-authoritative injected instruction | Same input | Refuse/escalate; do not alter fixture/rubric/scope |

The current implementation may not support every candidate control. That is an expected comparative finding, not a reason to change the baseline during measurement.

---

# 13. First-slice backlog candidates

| Candidate | Evidence | Fit for mock consumer comparison | Risk | Recommendation |
| --- | --- | --- | --- | --- |
| `drafts:finalize-composing-skills` | Directly relates to composable-skills proposal, but depends on `core/modules/observability:trace-execution-observations` and includes broad pilot scope | Weak first feature; too broad and dependency-blocked | High scope and migration coupling | Do not choose as first slice |
| `skills:presentation-guidance` | Existing open, documentation-focused backlog item with no stated dependency | Can exercise setup, routing, bounded design, and review, but only weakly exercises code/test behavior | Low | Viable if the first goal is workflow/design governance rather than application behavior |
| `skills:test-writing-skill` | Existing open item with explicit reusable-skill outcome | Can exercise a genuinely reusable capability and deterministic documentation validation | Medium; introduces a new skill/component relationship | Strong candidate for a second slice |
| `skills:clean-project-temporary-files` | Existing open item with concrete command and deterministic-test expectations | Exercises mock project behavior and setup, including dry-run and recovery | Higher than it appears because it involves deletion | Do not use as first slice |
| New mock feature in the mock consumer | Permitted by user clarification; can be deliberately shaped around complete control loop | Best fit for identical current/candidate consumer copies | Low if no external effects and deterministic acceptance | **Recommended first slice** |

### Recommended mock feature shape

A small local feature should:

- modify one mock-project component;
- have a deterministic acceptance test;
- require no network, credentials, deployment, publication, or irreversible deletion;
- be realistic enough to create a design package, bounded task, implementation, review, and integration result;
- include controlled stale-design and controlled recovery cases outside the normal feature itself.

The human should select the exact feature. The recommended first slice is a **mock consumer feature plus setup comparison**, not the broad `finalize-composing-skills` backlog item.

---

# 14. Branch, baseline, and recovery policy

| Concern | Proposed policy |
| --- | --- |
| Active branch | The active branch is the candidate/recovery boundary. It need not be `master`. |
| Baseline | Pin a specific `master` revision before measurement. It is a comparison baseline, not an active-work requirement or approval source. |
| Candidate revision | Pin one candidate branch revision before each paired benchmark run. |
| Recovery | Use normal Git/worktree/task recovery on the candidate branch. Preserve partial work and evidence under existing recovery rules. |
| Rollback | **No separate rollback mechanism is proposed.** Candidate isolation on the active separate branch is the recovery boundary requested by the user. |
| Merge | A merge remains an integration action only. It does not prove design approval, acceptance, setup success, or release readiness. |
| Baseline mutation | Do not alter baseline fixture, scoring, or baseline workflow while a paired comparison is underway. |

The prior reports’ separate rollback-path language should be narrowed accordingly: preserve the current system as a pinned baseline and preserve candidate branch history, but do not build additional rollback machinery without a concrete need.

---

# 15. Ownership, orchestration, and escalation model

## Authority map

| Responsibility | Proposed owner | Escalation path |
| --- | --- | --- |
| Human intent, alignment, revocation, design-changing feedback | Then-current accountable human reviewer | Human decision is recorded against one design revision |
| Design package and human-facing status | Named design/workflow orchestrator | Escalates unresolved design decisions to current reviewer |
| Component task authority and integration | Component-delivery orchestrator | Escalates cross-boundary or design gap to workflow orchestrator |
| Bounded implementation | Implementation worker | Escalates to direct caller; cannot change design, scope, tools, budget, or acceptance |
| Deterministic evidence | Validator/tooling | Reports only to reviewer/integration owner |
| Semantic result review | Distinct result reviewer | Recommends disposition; does not integrate |
| Integration | Receiving component-delivery orchestrator | Must revalidate after integration |
| Failure/recovery analysis | Execution/evaluation advisor | Advises named orchestrator; cannot restart or extend budget |
| Human escalation | Applicable named orchestrator | Child → caller → higher caller → orchestrator → human |

A skill can define procedure, evidence, stopping conditions, and handoff shape. It cannot select agents, admit tools, create task authority, approve design, integrate work, or close a task.

---

# 16. Current versus planned `as-is.md` model

## Proposed model

| Representation | Meaning | Authority |
| --- | --- | --- |
| `## Current state` | Implemented current purpose, behavior, boundaries, and relationships | Current architecture record |
| `## Planned target state` | Clearly labelled revision or reference to the target design | Planned design only; never implied current |
| `## Design relationship` | Root design revision, alignment reference, derived artifacts, feedback and task candidates | Traceability context, not active task state |
| Task record | Task scope, acceptance, status, budget, attempts, evidence, recovery | Sole implementation-task authority |
| Changelog | Concise completed history | Historical evidence, not active authority |

For a cross-component or consuming-project design, use one frozen root planned-design package and reference it from affected component records rather than duplicating target detail across every `as-is.md`.

## Post-implementation reconciliation

After accepted integration:

1. compare result against aligned target design;
2. record any discrepancy or new issue separately;
3. update affected `Current state` content only when the implementation is actually accepted as current;
4. preserve planned-design revision/supersession relationship according to the adopted retention rule; and
5. do not use a task completion claim as proof that every planned statement is current.

---

# 17. Implementation-result review

Every implementation outcome—including success, refusal, failure, timeout, budget stop, and partial work—must receive a review record.

| Review input | Required check |
| --- | --- |
| Identity | Exact design revision, task revision, attempt, source revision, and candidate result |
| Design status | Alignment current at launch; no supersession/revocation |
| Actual work | Inspect real diff or generated artifact, not only worker report |
| Acceptance | Map each acceptance condition and design invariant to observed evidence |
| Deterministic evidence | Run or independently observe smallest relevant checks |
| Validation integrity | Identify removed, skipped, narrowed, or weakened tests/checks |
| Scope and effects | Inspect unexpected files, dependencies, configuration, generated artifacts, and attempted external effects |
| Disposition | `accepted-for-integration`, `rework-required`, `escalated`, `rejected`, or `recovery-required` |
| Residual risk | Record omitted checks, uncertainty, recovery point, and whether design re-alignment is needed |
| Integration | Receiving integration owner reruns relevant checks after integration |

The implementation worker must never accept or integrate its own result.

---

# 18. Benchmark protocol and decision rule

## Two experiments

| Experiment | Purpose | Input equality |
| --- | --- | --- |
| Workflow evaluation | Compare current and candidate setup from equivalent human feature goal through review | Same feature goal, baseline, budget class, models where possible, validators, and scoring |
| Implementation-boundary evaluation | Isolate implementation, admission, delegation, review, and recovery differences | Same frozen design package and task |

## Predeclared measurements

| Category | Measures |
| --- | --- |
| Correctness | Acceptance pass rate, deterministic-check outcome, review disposition, integration rework |
| Safety | Stale-design launch, unauthorized external effect, fixture/scoring modification, unsafe completion claim |
| Governance | Alignment traceability, feedback classification, escalation correctness, result-review completeness |
| Recovery | Controlled-failure disposition, preserved partial work, retry-policy compliance |
| Setup/consumption | Clean setup success, idempotence, declared writes, dependency closure, unsupported-host clarity |
| Efficiency | Wall-clock, provider-reported cost if available, attempts, reviewer effort, integration time |
| Human clarity | Design-package completeness, reviewer reversals, ability to identify current versus planned state |

## Decision rule

The candidate may advance only when all are true:

1. no safety-critical failure occurs;
2. the normal feature has acceptance-mapped deterministic evidence and semantic review;
3. stale/superseded design is rejected before candidate implementation launch;
4. missing dependency and adversarial scope cases stop or escalate safely;
5. controlled failure reaches a recoverable disposition without silent worker, tool, budget, or scope substitution;
6. candidate setup either succeeds cleanly under its declared support boundary or fails clearly and non-destructively; and
7. any increase in human review or integration burden has a documented compensating benefit.

A benchmark result does not authorize broader rollout. Provider rankings do not enter the pass/fail rule.

---

# 19. Task graph

| Node | Proposed owner | Depends on | Output / acceptance | Stop or recovery |
| --- | --- | --- | --- | --- |
| 1. Confirm design-unit interpretation | Human | None | Explicit bounded-unit interpretation | Retain advisory proposal if undecided |
| 2. Select first mock feature and risk envelope | Human + orchestrator | 1 | One-component, no-task-accessible-credential, no-external-effect feature | Return to feature selection |
| 3. Define current/candidate consumption boundary | Design/workflow orchestrator + setup owner | 1–2 | Setup assumptions, project-local ownership, candidate support boundary | Stop if setup requires unsupported distribution claim |
| 4. Produce base current/planned records and root design package | Design/workflow orchestrator | 2–3 | Complete base record set, frozen planned revision, visual/structured representation | Revise from feedback |
| 5. Human aligns root package | Then-current reviewer | 4 | Attributable aligned design revision | Return to node 4 |
| 6. Design task-link and launch-admission approach | Task-control and launcher owners | 5 | Deterministic representation proposal and bootstrap path | Escalate unresolved schema/host constraints |
| 7. Define target role/skill migration slice | Agent/skill owners | 3–6 | Bounded target contracts, compatibility plan, consumers, validation | Defer unneeded extractions |
| 8. Create frozen mock consumer fixture and baseline/candidate copies | Evaluation owner | 2–7 | Identical seed, current copy, candidate copy, protected rubric | Stop on cross-copy state leakage |
| 9. Implement current and candidate runs | Authorized task owners | 5–8 | Controlled results and review records | Preserve partial work; no automatic retry |
| 10. Review, score, and reconcile | Independent evaluator + receiving owner | 9 | Benchmark report and retain/revise decision recommendation | Keep baseline; revise smallest failing control |
| 11. Prepare next migration stage | Human + orchestrator | 10 | Explicit approved next unit | Do not infer authorization from score |

---

# 20. Migration and implementation stages

| Stage | Goal | Required evidence before next stage |
| --- | --- | --- |
| 0. Baseline reconstruction | Pin baseline, identify active candidate branch, validate current catalog and fixture assumptions | Source revisions and known limitations recorded |
| 1. Target design package | Adopt no implementation yet; define role/skill target, current/planned record form, setup boundary, and fixture design | Human alignment on bounded implementation unit |
| 2. Contract bootstrap design | Define design link, currentness/revocation, capability admission, result review, and target setup representation | Sol review and human decision on adopted target contract form |
| 3. Minimal candidate refactor | Introduce only roles/skills/contracts needed for mock comparison, preserving compatibility | Focused deterministic validation and protected fixture |
| 4. Current/candidate consumer setup | Prepare two separate consumer copies from same seed | Clean setup evidence, declared support limitations |
| 5. Paired mock feature | Execute normal, stale, missing-dependency, failure/recovery, and adversarial cases | Review records and integration evidence |
| 6. Benchmark decision | Apply predeclared rule | Retain/revise/reject recommendation |
| 7. Expand refactor | Migrate the next justified skills/agents, then setup portability and project isolation | Each migrated contract has consumer, compatibility, validation, and disposition |
| 8. External consumption readiness | Validate package, compatibility, two-project isolation, upgrade/downgrade, uninstall, and specialist review | Human-approved distribution claim |

---

# 21. Human approval points

| Approval point | Decision needed |
| --- | --- |
| Bounded-unit interpretation | Confirm “entire implementation” means the complete currently approved implementation unit |
| Feedback rule | Approve the design-changing feedback rule or provide replacement |
| First feature | Select the mock feature or approve a specific existing backlog candidate |
| Risk envelope | Confirm one component, no task-accessible credentials, no external effects, isolated candidate worktree, deterministic checks, independent review |
| Design package | Align the frozen root planned-design revision |
| Target record form | Approve current/planned separation and exact design-link proposal after Sol review |
| Target roster/skill migration | Approve first target role and skill changes; do not infer approval from this report |
| Consumption boundary | Approve repository-local fixture claim versus future package/distribution claim |
| Benchmark rule | Approve fixture, scorer, measures, and pass/fail conditions |
| Expansion | Approve any move into credentials, external effects, external consumption, or broader autonomy |

---

# 22. Questions for Sol consultation/re-review

1. Does a heavy refactor preserve enough of the current deterministic control plane while honestly replacing agents and skills where the user’s complete goal requires it?
2. Is the proposed target functional roster sufficient without introducing a premature universal orchestration framework?
3. What is the smallest task-control-owned representation for frozen design reference, human alignment, revocation, and launch currentness under the strict current schema?
4. Can a target setup/consumption comparison begin with repository-local mock consumers without making an unsupported external-installation claim?
5. Does the candidate consumption model require a package/bundle decision before the first internal comparison, or only before distribution-facing implementation?
6. Are the proposed current/candidate fixture controls sufficient to prevent benchmark contamination and candidate self-scoring?
7. Does the suggested distinction between current state, planned target state, task authority, and implementation result remain compatible with the current `as-is.md` contract?
8. Which current launcher changes are strictly required to demonstrate the selected first slice’s task-facing credential and external-effect restrictions?
9. Should semantic review be a distinct target role immediately, or can a separately invoked reviewer session satisfy independence for the low-risk first slice?
10. Is alternate-family review correctly deferred until consumption/security expansion, given no verifiable current model-family evidence?

---

# 23. Residual uncertainty

| Uncertainty | Consequence |
| --- | --- |
| Current active branch and pinned baseline revision were not inspected | Branch/baseline policy is conceptual, not tied to a revision |
| Runtime launcher behavior, environment inheritance, worktree fallback, and tool restrictions were not tested | No enforcement claim should be made from documentation alone |
| Current model preset families are unknown | Concrete alternate-reviewer selection is unsupported |
| Provider benchmark/API data were not queried | No current model capability, price, or reviewer claim is established |
| Current host setup is repository-oriented | Portable consumer installation remains unproven |
| Design-link schema and bootstrap path are undecided | Implementation cannot yet enforce alignment/currentness |
| The mock feature and reviewer/owner identities are unselected | No task is ready to authorize |
| The composable-skills draft has a reusable-skill count discrepancy | Catalog must be reconciled before adoption |
| Future content/general-task workflows may need different artifacts and verification semantics | Software-development target must not silently become universal workflow authority |

---

# 24. Readiness for Sol re-review

**Ready for Sol re-review as an expanded, advisory re-plan.**

Sol should specifically review the changed strategic recommendation—heavy refactor rather than the earlier narrower incremental adaptation—the inclusion of setup/consumption as a measured implementation concern, the mock consuming-project comparison design, the proposed target roster and skill extraction criteria, and the decision not to select an alternate reviewer without defensible family-independence evidence.

**Not ready for implementation.** The required human decisions, frozen design package, exact task/design-link contract, capability profile, named owners, candidate/baseline revisions, fixture, and approved bounded task remain absent.
