- 2026-07-29: Removed mandatory dry-run/preflight checks from `skills/as-is/SKILL.md` and `skills/spawning-pi-subagents/SKILL.md`; retained optional `--dry-run` guidance and the separate provider-free stub/dummy budget-enforcement rehearsal. Build, reference, and formatting checks passed; focused launcher tests had documented host/worktree-sensitive failures. Read-only expert validation passed and judged the scoped change safe to commit.

# Changelog

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
