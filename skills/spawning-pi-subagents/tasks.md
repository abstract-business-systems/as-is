# Task

## Requirement
Implement `skills/spawning-pi-subagents:launcher-recovery-emitted-path-privacy` at the launcher/recovery projection boundary only. Preserve private filesystem operands needed for detached supervision, worktrees, sessions, logs, prompts, results, records, registries, and tracer sinks, but prevent direct or indirect filesystem paths from crossing detached handles, stdout, registry launch/finished/recovery lines, `--jobs` diagnostics, recovery observations, dry-run output, stderr diagnostics, or launcher lifecycle trace inputs. Use opaque job/lifecycle facts or bounded availability/resource classes. Do not change task authority, process authority, recovery authorization, handoff eligibility, or process-supervisor/evidence-tool surfaces.

## Plan
1. Read the launcher/recovery component record, selected backlog row, execution-contract privacy policy, observability projection contract, current launcher/recovery implementation and tests, and process-supervisor boundary.
2. Obtain a read-only expert plan review before editing; keep `core/adapters/process/` and `tools/evidence/` separate.
3. Define launcher-local output shapes that omit all path-bearing handle, registry, recovery, diagnostic, dry-run, and trace-input fields while preserving bounded job, lineage, budget, outcome, handoff, and availability facts. Replace arbitrary preservation text with a bounded class and preserve private operands internally.
4. Add provider-free fixtures asserting complete raw serialized-output absence for unique absolute, repository-relative, component-derived, configured-directory, worktree, session, task-record, log, prompt/config/result, registry, and tracer-directory tokens; cover nested legacy registry values, idempotent recovery, terminal/alive cases, append failure, dry-run, lifecycle traces, and preserved safe facts.
5. Run focused launcher tests, relevant process/observability regression tests without modifying their owners, no-bundle builds, task/content/backlog validation, JSON parsing, `git diff --check`, diagnostics, and final configured-large expert validation.
6. Record residual risk explicitly: `core/adapters/process/supervisor.ts` public handles/observations and `tools/evidence/worker-tools-observability.ts` results remain separate enforcement tasks.

## Progress
Selected exact backlog identity `skills/spawning-pi-subagents:launcher-recovery-emitted-path-privacy`. The execution contract assigns launcher/recovery ownership of handles, registry records, lifecycle diagnostics, and recovery observations. Current launcher output directly exposes `logPath`, `recordPath`, `worktreePath`, `sessionPath`, `callerCwd`, task-record paths, arbitrary preservation text, registry failure paths, `--jobs` worktree details, and lifecycle trace path inputs. The observability tracer now filters its own serialization, but that does not authorize passing private paths across the launcher boundary. The active task is limited to `scripts/spawn-pi-subagent.ts`, `scripts/recovery-reconciliation.ts`, and existing launcher tests. No descendants are authorized.

## Validation
Pending. Acceptance requires focused launcher/recovery tests with raw serialized-output assertions, relevant regression tests, no-bundle builds, task-record/content/backlog validation, JSON parsing, `git diff --check`, changed-file diagnostics, and final configured-large expert review. Residual risk must retain separate process-supervisor and evidence-tool enforcement tasks.

## Result
Pending.

## Blockers And Escalations
No blocker currently. Do not broaden this task into `core/adapters/process/`, `tools/evidence/`, observability policy changes, generic sanitization, task-control changes, process supervision changes, or authority changes. If private path use cannot remain internal while every named launcher output is projected safely, record a blocker and stop.

## Recovery
No descendants are authorized. Preserve private launcher operands and current registry/worktree recovery mechanics if interrupted. A failed projection must not emit path-bearing values as a diagnostic fallback. Restore the active task/backlog pair from Git if completion cleanup is interrupted; do not remove the backlog row or task artifacts before validation and final review.

## Next Action
Advance the machine task to `active`, commit the task-start handoff, then implement the launcher-local projections and focused fixtures.
