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

# Changelog

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
