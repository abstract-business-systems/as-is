# Task

## Requirement
Implement `tools/evidence:enforce-evidence-tool-emitted-path-policy` at the evidence-tool result boundary only. Preserve private filesystem reads, exact-ID session scope, bounded trace queries, summary/detail semantics, paging, role/tool filters, malformed-line tolerance, and read-only non-authority behavior while preventing absolute or indirectly identifying filesystem paths from emitted tool results or nested metadata. Unsafe values must be omitted or represented by bounded unavailable states. Do not change tracer filtering, launcher/recovery projections, process-adapter outputs, task authority, validation authority, or completion authority.

## Plan
1. Read the evidence component record, selected backlog row, execution-contract privacy policy, current evidence implementation/tests, tracer boundary, and agent-tool registration consumer.
2. Define the smallest evidence-local result projection that preserves permitted session content and bounded evidence while omitting unsafe path-bearing metadata.
3. Add provider-free fixtures for direct, nested, absolute, repository-relative, component-derived, configured-directory, worktree, session, task-record, log, malformed, unavailable, scope, paging, and filter cases across session and trace outputs.
4. Run focused evidence and affected registration tests, no-bundle build, task/content/backlog validation, JSON parsing, `git diff --check`, diagnostics, and final configured-large expert validation.
5. Record completion evidence and residual risk, then clean exactly the selected backlog row and task artifacts in the scoped completion commit.

## Progress
Selected exact backlog identity `tools/evidence:enforce-evidence-tool-emitted-path-policy`. The current implementation emits `sessionFile`, `sessionDir`, and `cwd` directly from `SessionManager`, returns raw selected session entries in non-summary modes, and passes parsed trace events through `boundedJson`; both surfaces may contain direct or nested path-bearing values. The evidence component has no prior task record, so the selected `as-is.json` and `tasks.md` were created together with the selected backlog state. Scope is limited to `tools/evidence/worker-tools-observability.ts`, its focused tests, the evidence task record, and the owning backlog/changelog; no descendants are authorized.

## Validation
Pending. Acceptance requires focused evidence and affected registration tests, no-bundle build, task-record/content/backlog validation, JSON parsing, `git diff --check`, changed-file diagnostics, and final configured-large expert review. Residual risk must retain separately owned tracer, launcher/recovery, process-adapter, registry/diagnostic, and host-adapter surfaces.

## Result
Pending.

## Blockers And Escalations
None.

## Recovery
Preserve private session and trace filesystem operands for internal reads, but never use them as diagnostic fallbacks. If interrupted, restore the selected backlog/task pair from Git before retrying. Do not edit tracer, launcher/recovery, process-adapter, task-control, or completion authority surfaces.

## Next Action
Implement the evidence-local projection, add provider-free privacy fixtures, run the required validation and final expert review, then complete the selected task through the two-commit lifecycle.
