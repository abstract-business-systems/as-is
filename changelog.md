# Changelog

- 2026-08-15: Completed `root:context-resolution-migration-readiness` as a record-only Phase 9A handoff. Added an evidence-backed context-resolution migration contract to `designs/core-modules-tools-and-skills.md`, mapping the current configuration, instruction, and linked-context owners, direct consumers, focused tests, distinct security/authority boundaries, proposed host-neutral family, future compatibility actions, validation sequence, and reversible recovery. No `core/` directory, source move, import change, setup/projection update, host/target effect, browser/environment capability, or runtime behavior changed. Validation passed: task-record validator (`VALID`), as-is content/navigation (44 records, 45 diagrams), backlog content, focused resolver suites (14 tests, 58 expectations), and `git diff --check`. Dynamic, generated, projected, and external consumers remain to be re-inventoried by a separate physical migration task.

- Completion evidence: `root:establish-host-integration-component` completed as a record-only Phase 8C handoff; the durable host-integration context and root map are now established without implementation or target effects.

- 2026-08-23: Completed `root:establish-host-integration-component` as a record-only Phase 8C handoff. Created the durable `host-integration/` context and added it to the root component map without implementing setup, projection, target-machine writes, host adapters, browser/environment capabilities, tool/module relocation, or runtime behavior. The record defines future manifest, host matrix, adapter, target-write, capability, collision/recovery, and validation boundaries; existing setup tests and content/navigation checks provide limited deterministic evidence, while live host projection and compatibility remain unvalidated. Root backlog reconciliation removed only the exact completed identity; dependent deferred capability items retain their substantive work and notes without a stale structured dependency.

- 2026-08-23: Completed `root:subagent-first-core-foundation` Phase 8B host-integration boundary assessment. Canonical root `skills/` and `agents/` remain host-neutral sources; `components/as-is-setup` owns deterministic client discovery, canonical inventory, adapter planning, linking, collision preservation, idempotence, and setup tests; a future root `host-integration/` component should own the approved host resource manifest, supported-host matrix, adapter boundaries, target write allowlist, capability prerequisites, registration compatibility, collision/recovery contract, and cross-host validation. Pi, OpenCode, and generic-agent adapters may translate only an approved manifest; deterministic modules and agent-facing tool semantics retain current owners; target projects own persisted host state and write consent. The deferred host-integration item is ready for separate selection subject to explicit root, manifest, and target-write approvals, but no component creation, installation, relocation, browser capability, environment inventory, tools/modules regrouping, or setup replacement is authorized. Existing setup tests remain the relevant deterministic evidence; live target-host discovery/projection, stale-link recovery, Pi compatibility, and browser behavior remain unvalidated.

- 2026-08-23: Completed `root:subagent-first-core-foundation` Phase 8A core-layout readiness assessment as an evidence-backed deferment. A bounded inventory enumerated 97 proposed-path reference matches, current implementation candidates under `components`, `.pi/extensions`, and `skills/spawning-pi-subagents/scripts`, nine component records, host/package entry points, and direct consumers. Naming review found `context-resolution`, `task-control`, `agent-resolution`, `observability`, and `execution-contract` semantically suitable future responsibility names, while `adapters`, `tools`, and broad child names remain categories requiring ownership evidence. No physical `core/` or `tools/` move was authorized: context and task-control semantic owners are clear but need per-artifact consumer, compatibility, behavioral-regression, and recovery plans; agent-resolution lacks an independent component owner; execution-contract ownership remains split; Pi adapters, setup projection, and agent-facing tools are blocked by deferred host-integration and capability-inventory work. The smallest safe next work is host-integration ownership/design, then the deferred capability inventory, followed by one-family relocation only after approval. No runtime, setup, component, task-protocol, or host behavior changed.

- 2026-08-23: Completed `root:subagent-first-core-foundation` Phase 7A ad hoc-task validation. A disposable private task outside VCS declared bounded scope, constraints, acceptance, recovery, and next action; the existing launcher and read-only expert produced a structured Finding/Evidence/Recommendation/Residual Risk handoff without mutation, delegation, commit, or completion authority. Input and task-record hashes were unchanged, the launcher recorded `handoffEligible: false`, and the fixture/result were removed after preserving evidence in the task record. Existing foundations suffice; no generic task-profile framework or dedicated ad hoc skill is justified by this use case. Provider-enabled component-builder, execution-advisor, and worker live suites passed 12 tests with 1 profile skip and 224 expectations using `--timeout 20000`; the worker suite also passed 5 tests with 1 explicit provider skip and 153 expectations. Residual risk: provider wording/latency remain model-dependent, and the initial default-timeout worker run exposed two timeouts and one dangling-process error that were superseded by the successful rerun. No component files, runtime code, setup behavior, front matter, or task protocol changed.

- 2026-08-23: Completed Phase 3 of `root:subagent-first-core-foundation` by extracting bounded session-analysis and trace-query functionality into `.pi/extensions/worker-tools-observability.ts` while keeping Pi registration, role admission, `call_subagent`, component-context authority, model/thinking resolution, and trace emission in `.pi/extensions/worker-tools.ts`. Explicit target roles are now required and unrelated session stores are not searched by exact ID. Validation passed: 32 affected behavioral tests and 150 expectations; as-is content validation (43 records, 44 diagrams); task-record, JSON, Bun syntax, and whitespace checks. No physical tools relocation, task authority change, setup replacement, or descendant task was included.

- 2026-08-23: Completed Phase 2 of `root:subagent-first-core-foundation` by extracting the launcher’s mechanical detached-process boundary into `skills/spawning-pi-subagents/scripts/bounded-process-supervisor.ts`. Process-group signalling, wall-clock stopping, stdio setup, and exit observation are centralized; Pi profile construction, worktree/Git handling, tracing, registry projection, task authority, and handoff eligibility remain in the launcher. Updated the launcher and subprocess-foundation durable `as-is.md` records. Validation passed: direct process-boundary and subprocess-foundation suites (14 tests, 129 expectations), with the launcher/worker/agent-resolution suites reporting 53 passed and two documented pre-existing failures; as-is content validation (43 records, 44 diagrams), task-record validation, JSON/Bun syntax checks, and `git diff --check`. Final read-only review judged the scoped diff safe to commit. No setup replacement, broad relocation, provider test, or descendant task was included.

- 2026-08-23: Amended the phase-0 core-module and subagent migration handoff to make affected agent and skill behavioral tests the primary regression anchor throughout restructuring. Each phase must run relevant behavioral tests before and after behavior-affecting work, add or update focused coverage when needed, and treat static checks as supplementary. Component-building and restructuring work must update relevant durable `as-is.md` records in the same scoped handoff whenever purpose, design, relationships, boundaries, ownership, or links change. No runtime behavior or file relocation was introduced; the amendment is intended to be folded into the prior planning commit.

- 2026-08-23: Completed `root:subagent-first-core-foundation` phase 0 planning handoff in `designs/core-modules-tools-and-skills.md`. Aligned functionality, module, capability, tool, skill, role, adapter, component, scope, task, and ad hoc-task terminology; retained component-building in skills; defined core module and adapter groupings; ordered subagent resolution, execution, tool, task-control, context, component-building, ad hoc, layout, and setup-command phases; and required a separate scoped task, validation gate, commit, and compaction after every phase. No runtime behavior, file relocation, setup replacement, concurrency change, or host integration component was introduced. Validation passed: JSON syntax, focused phase assertions, `bun skills/managing-as-is-document/content-test.ts` (43 records, 44 diagrams), `python3 components/task-record-validator/task_record_validator.py .` (`VALID`), and `git diff --check`. Residual risk: proposed ownership, API boundaries, host behavior, and migration cost remain unvalidated until later phases.

- 2026-08-23: Completed `root:audit-and-improve-mermaid-diagrams` in the current scoped worktree. Audited all 53 discoverable Mermaid fences with the available local `grok-mermaid` terminal renderer: 52 rendered, while the `journey` example is unsupported by that renderer. Browser-backed SVG rendering remained unsupported because `MERMAID_BUNDLE` is not configured. Wrapped long node and edge labels at natural `<br/>` boundaries across the affected diagrams; the source-level validator now rejects labels over 28 visible unwrapped characters, and the rendered-navigation contract retains SVG dimensions for future host-surface checks. Focused record, integration, readability, renderer, syntax, and whitespace checks passed. Residual risk: browser-specific overflow, clipping, and host geometry remain unverified until a local Mermaid bundle is supplied.

- 2026-08-14: Completed `root:add-diagrams-to-existing-components` in commit `011a1b2`. Reviewed the 43 canonical `as-is.md` records, added or aligned reader-oriented Mermaid views and named pre-render layout plans, retained balanced linked container maps for parent records, and documented why `designs/` and `docs/` remain non-container document collections. Content validation passed with 43 records and 44 diagrams; focused diagram/navigation validation passed with 10 tests and 16 assertions; `git diff --check` passed. Mermaid rendering and SVG-link preservation remain untested because no local renderer is configured.

- 2026-08-14: Completed `root:document-shared-component-boundary-information` by adding [`docs/architecture-vocabulary.md#scope-and-authority`](docs/architecture-vocabulary.md#scope-and-authority), a current-system reference for shared architecture terms, component boundaries, canonical records, authority, evidence, and relationship labels. Relevant records link to [`#component-boundary`](docs/architecture-vocabulary.md#component-boundary), [`#structural-containment`](docs/architecture-vocabulary.md#structural-containment), [`#owner-and-authority`](docs/architecture-vocabulary.md#owner-and-authority), and [`#relationship-labels`](docs/architecture-vocabulary.md#relationship-labels). The document defines shared meaning without becoming a component registry, task authority, or runtime source; actual component facts remain in canonical `as-is.md` records, and a separate component group is outside this result. Focused content, backlog, link, and whitespace checks passed.

- 2026-08-13: After the root closure review passed, retired the task-generated ignored SDD ledger/scratch and project-local subagent runtime tracking for this bounded work only after retaining their material recovery facts in durable records and preserving the reviewed Task 1 commits in Git history. Arbitrary `temp/` planning files, external `/tmp` worktrees, unrelated backlog rows, the durable plan/spec, and source/runtime behavior were not changed by that cleanup. No commit is claimed.

- 2026-08-13: Completed the root-owned serial coordination outcome for the `validation-fixtures/` and `agents/` post-order pilots. Extended the existing `managing-as-is-document` skill with an optional target-neutral hierarchical record-reconciliation application mode rather than creating a new reconciliation skill. Removed the selected backlog row `reconciling-as-is-records` through `bun skills/managing-backlog/scripts/query.ts --cleanup=skills:reconciling-as-is-records .`; unrelated rows `skills:integrate-as-is-documentation` and `root:audit-as-is-guidance-coverage` remained unchanged. Focused content, backlog/query, orientation, integration, task-record, and diff checks passed. Residual risks remain for Mermaid rendering, deep/cyclic/shared-child/concurrent/interrupted/cross-project cases, provider-gated behavior, external target installation, and unrelated root backlog work. No root or child behavior changed and no commit is claimed.

- 2026-08-13: Repaired the omitted Components structural-container diagram after the reusable pre-render layout-planning update. [`components/as-is.md`](components/as-is.md) now contains a named ELK/TB relationship map and a compact layout plan; it preserves the same nine linked immediate children and seven supported relationships while avoiding the prior wide LR arrangement. The focused dogfood validator now rejects regression to the wide layout. No repository-wide diagram rewrite, renderer installation, target-project setup, or agent, prompt, provider, runtime, or component behavior changed; renderer-specific geometry remains untested.

- 2026-08-13: Added reusable pre-render diagram-layout planning across generic Mermaid design and as-is record-management, adoption, and setup procedures. Each planned view now records the available render surface, intended shape, visible-node/edge/label density, grouping and routing direction, and a supported exception or residual risk before Mermaid is written; the generic rule does not invent numeric dimensions when the target host supplies none. Updated the repository dogfood validator, reusable examples, and current skill records. Focused content, integration, orientation, task-record, whitespace, and editor checks passed. No repository-wide existing-diagram rewrite, renderer installation, target-project setup, or agent, prompt, provider, runtime, or host behavior changed; renderer-specific geometry remains untested.

- 2026-08-13: Promoted the validated root-to-current breadcrumb convention to every canonical record, made each parent Components table the sole immediate-child Markdown catalog while retaining required linked Mermaid child boxes, and removed ordinary direct-child contract catalogs from parent Links. Removed the false root `.pi/as-is.md` component mapping; `.pi/prompts/as-is.md` remains a projected bundle prompt rather than a component. Added the deferred root `establish-host-integration-component` proposal for a future installable host-integration boundary without creating it or installing to a target machine. Validation passed: `bun skills/managing-as-is-document/content-test.ts`, `bun test skills/managing-backlog/query.test.ts` (11 pass, 31 expectations), `python3 components/task-record-validator/task_record_validator.py .`, deterministic navigation assertions across 43 canonical records, `git diff --check`, and clean editor diagnostics. Mermaid rendering and target-machine installation remain untested.

- 2026-08-13: Reconciled canonical record placement after a bounded brownfield audit found nine embedded `## Changelog` sections and one embedded historical task block. Canonical `as-is.md` records now retain current architecture context only; dated completion and task history reside in configured sibling `changelog.md` files, with three missing history files created only to preserve retained material. The audit also recorded a deferred Skills proposal, `reconciling-component-structure`, for evidence-based discovery and adoption of brownfield component conventions; it does not create the skill or authorize a broad rewrite. The inventory found 21 existing flowcharts without named headings or local ELK/TB configuration, 6 records without diagrams, and one out-of-order Purpose section; those findings remain deferred under existing diagram/structure work. Reusable skills defer history placement and retention to target-project policy; this repository's protocol and dogfood validator own this repository-local convention. No runtime, agent, prompt, provider, setup, renderer, or target-machine behavior changed.

- 2026-08-23: Completed `dissolve-root-hierarchical-design-document`. Retired the two tracked root migration indexes after reviewing repository consumers and recovery value; their requirements remain distributed among the setup, as-is record-management, Mermaid, and naming owners and their backlogs. Removed the stale root backlog reference, created the planning-only follow-up `audit-as-is-guidance-coverage`, and passed reference, whitespace, and Markdown checks. No implementation behavior changed; rendered Mermaid links remain untested because no renderer is configured.

- 2026-08-16: Refined durable `as-is.md` record guidance and the root record.
  The root now describes the repository component rather than the document,
  serves both human and agent readers, maps only immediate repository areas,
  avoids duplicate navigation links, and keeps boundary facts concise. The
  router record no longer carries root-level or builder-specific relationship
  context. The as-is record skill now treats `Components`, `Design`,
  `Relationships`, and boundary facts as purposeful sections rather than a
  universal template. `git diff --check` passed.

- 2026-08-07: Completed the Phase 4 composition-boundary clarification for the
  skills/agents separation migration. Clarified across repository instructions,
  root context, the migration plan, component-building guidance, the spawning
  adapter description, and the component-builder contract that skills do not,
  by design, select, authorize, start, or delegate agents. Authority-bearing
  agents and orchestrators may invoke mechanical adapter procedures exposed by
  skills without transferring authority into the skill. No runtime, launcher
  implementation, tests, role front matter, or host projection behavior
  changed. Provider-free validation passed: routing/role checks 20 passed with
  13 provider-gated skips and 76 assertions; launcher/control-plane/supervisor
  checks 45 passed with 354 assertions; supporting checks 32 passed with 118
  assertions; task-record validator 6 passed; delegation fixtures 3 passed
  with 17 assertions. The post-clarification focused rerun passed 50 tests with
  304 assertions. `git diff --check` passed and final read-only validation
  judged the scoped documentation handoff safe to commit. No descendants were
  authorized; closure was vacuously terminal. The worker-tools extension test
  was separately restored through the skill-owned dependency fix recorded in
  `skills/spawning-pi-subagents/changelog.md`; its Pi host-version alignment
  remains unresolved.

- 2026-07-29: Removed mandatory dry-run/preflight checks from `skills/managing-as-is-document/SKILL.md` and `skills/spawning-pi-subagents/SKILL.md`; retained optional `--dry-run` guidance and the separate provider-free stub/dummy budget-enforcement rehearsal. Build, reference, and formatting checks passed; focused launcher tests had documented host/worktree-sensitive failures. Read-only expert validation passed and judged the scoped change safe to commit.

- 2026-08-15: Completed the repository-wide JSON companion-record migration.
  All durable `as-is.md` records and configured task narratives are
  front-matter-free; `as-is.json.configuration` and local `as-is.json.task` are
  the sole machine configuration/task authorities. The control plane,
  subprocess supervisor, launcher status join, worker-tools budget gate, task
  validator, and repository-owned fixtures now use JSON companions. Legacy YAML
  task records are rejected rather than parsed. Completed transient sections
  were removed from durable component records after concise results and
  validation evidence were retained in colocated changelogs. Partial
  companion/narrative writes use a documented fail-closed recovery rule and are
  not represented as crash-atomic. Final first-party validation passed: 141 Bun
  tests passed, 21 provider-backed tests were explicitly skipped, 0 failed, and
  734 assertions ran; all 6 Python validator tests passed; repository task-tree
  validation returned `VALID`; control-plane and supervisor builds passed; and
  inventory and whitespace scans passed. No implementation descendants were
  authorized; closure was vacuously terminal. Residual risk: provider-backed
  behavioral tests were not rerun during final deterministic validation.

- 2026-08-15: Completed the root JSON companion-record foundation. Root
  `as-is.json.configuration` now owns project machine configuration and local
  `as-is.json.task` owns transient machine task metadata; root `as-is.md` and
  `tasks.md` are front-matter-free human Markdown. The control plane, launcher,
  tracer, orientation snapshot, and worker budget lookup consume the JSON path;
  configured task filenames are honored for discovery, child creation,
  orientation, and launcher handoff. New delegated children use JSON metadata
  plus a configured Markdown narrative, while legacy YAML task records remain
  read-compatible pending the owner-scoped inventory in
  `designs/as-is-json-migration.md`. Focused deterministic validation passed
  (67 pass, 0 fail, 368 assertions), three no-bundle builds passed, diff-check
  passed, and the component-builder live suite passed (4 pass). Residual risk:
  companion and narrative writes are not a crash-atomic multi-file transition;
  a later task must define recovery or transactional cleanup before retiring
  compatibility.

- 2026-08-12: Completed the bounded trace-safety and budget-extension task.
  The control plane admits bounded parent-authorized extensions, the supervisor
  and launcher enforce normalized wall-clock limits, in-process worker calls are
  timeout-capped, and child ownership is explicit: children record budget
  blockers in their own records and never edit parent files, budgets, or status.
  No parent-worker channel or lock-replacement task is required under the
  durable-record reconciliation model. Repository-wide validation passed: 120
  tests passed, 18 provider-gated tests skipped, 0 failed, and 657 expectations;
  control-plane, worker-tools, supervisor, and launcher no-bundle builds passed;
  `git diff --check` passed; and the untracked historical trace file's
  before/after SHA-256 remained
  `49b015180af643be3ae141c3433f6a5459419b9b3c6f7d26e1fde2db20f06554`.
  Production launch-caller review found no remaining bypass of
  `ControlPlane.admitLaunch()`. Cumulative `call_subagent` accounting remains
  intentionally caller-owned and requires a new bounded task if durable
  recording is later needed. No descendants were authorized; closure was
  terminal.

- 2026-08-14: Completed Phase 0 skills/agents separation inventory and
  pre-extraction baseline. Enumerated five canonical agent roles, 11 reusable
  skills, launcher/host projections, and role/delegation references; classified
  every component-builder prompt span and recorded reusable-flow candidates,
  retained authority, observations, and unresolved launcher/host skill
  ownership. Baseline captured component-builder at 89 lines / 7,263 bytes;
  focused deterministic checks passed (67 tests, 450 assertions, 2 live-gated
  skips), the static skill-authority scan and `git diff --check` passed, and the
  unavailable local `@earendil-works/pi-coding-agent` dependency remains
  residual risk. No runtime, agent front-matter, launcher, or skill behavior
  changed. Final read-only expert review passed and judged the scoped handoff
  safe to commit. Next action is a new bounded component-builder extraction
  task; no extraction is authorized by this record.

- 2026-08-14: Recorded the clarified skills/agents separation direction.
  Skills are globally available reusable procedures rather than agent-front-
  matter-selected capabilities; current launcher/front-matter forwarding is
  explicitly a compatibility surface to be retired by a later bounded task.
  As-is user-intent detection and routing remain role-owned. Downsizing proceeds
  one agent at a time, beginning with the component-builder contract and its
  existing `building-components` procedure; execution-advisor extraction is
  provisionally named `evidence-based-consultation`, pending naming review.
  No migration behavior changed. Focused launcher validation passed (29 tests,
  212 assertions), `git diff --check` passed, and final read-only validation
  approved the scoped documentation handoff subject to task cleanup.

- 2026-08-06: Clarified handoff ownership: the receiving component-builder owns semantic child review and nearest-common-ancestor integration; the spawning launcher only records evidence and observes caller ancestry. Documented explicit no-separate-integration cases for in-process assistance, parent-owned worktree changes, and no-change tasks. Added the open agents-level `agent-owned-tool-capabilities` backlog item so role contracts may declare ordinary tools while package/host surfaces own implementations.

- 2026-08-11: Renamed and expanded the read-only role to `execution-advisor` with bounded local trace-query and durably authorized, metadata-only Pi session analysis. It diagnoses execution issues and prepares approval-required time or money extension requests without mutating budgets, task state, sessions, processes, or completion authority. The launcher now takes the role's tool set from front matter; 21 launcher tests and 3 session-analysis tests passed, both builds passed, content/reference checks passed, and `git diff --check` passed. Final expert validation found the scoped change safe to commit. No live advisor run or raw session-content inspection was exercised.

- 2026-08-12: Updated `skills/managing-backlog` to use `description` and optional `notes` backlog fields, distinguish user-provided priority from system-decided dependency-aware project sequence, and document influence through priority changes or explicit reprioritization requests. The component handoff `c8251eb` was integrated as `15c989c`; focused content validation and diff checks passed.

- 2026-08-08: Restored the approved `skills-agents-separation-plan` planning artifact from historical source `adac5cb` and linked it from the root backlog. The handoff preserves the authority order, six-phase sequence, dependencies, gates, rollback/recovery, residual risk, and explicit deferral of migration; no Phase 2a, migration implementation, new skill, prompt extraction, or runtime changes were made. Focused reference checks and `git diff --check` passed; attributable in-process expert plan/final gates were recorded.

- 2026-08-06: Added the documentation-only `Resume and fork admission contract` to adaptive session budgeting: resume is the normative recovery default, forks require explicit authorization and source lineage, and admission preserves identity, references, immutable ceilings, cumulative accounting, idempotency, and fail-closed non-resumable behavior. Dynamic expert validation remains open; exact diff checks and read-only expert plan/final validation passed, with final validation declaring the change safe to commit.

- 2026-08-06: Wired validated project-local session references into `.pi/extensions/worker-tools.ts` for `call_subagent` and `worker.result` start/success/failure events. Invalid or missing IDs are omitted; no child/session-store or raw content access was added. `bun --check` and diff checks passed; standalone `bunx tsc` was unavailable, leaving host dependency validation as residual risk. Expert plan and final direct-file reviews recorded safe-to-commit evidence.

- 2026-08-06: Closed `canonical-agent-source-layout`: top-level `agents/` is the sole tracked role-source tree; `.agents/agents/` is client projection-only. Setup projection, launcher, extension role paths, dummy rehearsal, and supported host checks were validated. OpenCode discovery is available; native Pi extension bundling remains host-environment dependent because standalone dependencies are unavailable.

- 2026-08-03: Completed canonical role-source phase 2: moved `as-is`, `component-builder`, `expert`, and `worker` role trees to top-level `agents/` as the sole tracked source; documented `.agents/agents/` as host projection only and updated canonical links. Focused path/reference checks and `git diff --check` passed; expert plan and final validation passed. Rollback is reverting the scoped migration commit.

- 2026-08-06: Recovered the parent-integration handoff by consolidating source commits `91facda`, `7690a25`, and `3284ab0` atop preserved `e5beb75`; clarified that source SHAs belong in handoff evidence and the resulting integration SHA is recorded only after commit creation, avoiding self-reference. Focused launcher tests passed (15); ancestry and clean-worktree evidence recorded in the `as-is` Git note for the resulting handoff commit.

- 2026-08-06: Closed `parent-integration-handoff` after validating the delegated handoff flow end to end: child task records and validation evidence are required; child commit and base SHA ancestry are checked; integration status distinguishes integrated, pending-parent-integration, and not-committed; related work is consolidated into a scoped parent commit; unrelated changes remain unstaged; and failed or incomplete work remains recoverable. Trace output remains supplementary and does not replace task records, logs, or durable Git evidence.

- 2026-08-02: Added supervisor-owned `delegation.lifecycle` tracing for detached execution while preserving `session.lifecycle`; recorded bounded relationship, attempt/depth, handoff, and outcome metadata. Added deterministic success, failure, budget-stop, relationship, handoff, privacy, and session-tracing coverage. Focused validation passed (18 tests); read-only expert validation passed.

- 2026-08-04: Aligned root planning with component ownership: configured record
  filenames under `config.records.filenames`, moved skills, validator, and
  observability items to owning backlogs, corrected deterministic-skills
  semantics, and documented an approach for the remaining root item. No
  backlog item was implemented; open/deferred items and completed-item removal
  policy were preserved.

- 2026-08-03: Recovered the prior backlog-policy handoff as scoped commit `a3ec945`; added explicit parent integration/handoff, as-is-routed delegation, and all-in tracing design backlog items. Tracing remains supplementary and best-effort; privacy, security, redaction, retention, and access controls remain explicit future work. Focused tests (6 passed) and `git diff --check` passed; read-only expert validation completed.

- 2026-08-03: Fixed control-plane orientation to use durable `as-is.md` context with transient `task.md` task authority; added writable non-committing worker and large read-only expert roles, project-controlled worker|expert subagent allowlist, and expert-before-commit builder gate. Focused tests and extension build passed.

- 2026-08-02: clarified `as-is.md` as durable component purpose, design, boundary, and links; introduced transient component-level `task.md` records with completion summaries written here before task-file removal; established skill-driven system functionality.

- 2026-08-06: Hardened parent-agent orchestration: `pending-parent-integration` is a hard completion blocker; integration is required from the caller repository and completion requires caller-branch ancestry verification. Added focused launcher regression coverage showing pending status before caller-worktree integration and integrated status only after cherry-pick. Focused Bun tests: 15 passed. Child handoff remains pending parent integration.
