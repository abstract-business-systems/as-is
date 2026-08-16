# Task

## Requirement
Evaluate whether repository-local traces and bounded trace queries can replace Pi session JSONL for the named bounded execution diagnostics, without reading session content, changing runtime behavior, or crossing the observability component boundary. Preserve Pi session JSONL as the readable local evidence source unless the evidence supports a separately authorized migration.

## Plan
- Review the observability durable record, tracing design, tracer implementation/tests, backlog acceptance, and read-only external contracts for `tools/evidence` and the Pi launcher.
- Classify each requested diagnostic as trace-supported, session-supported, both, or unavailable without reading Pi session JSONL.
- Record the smallest evidence-backed conclusion in the component changelog; make no source/runtime changes.
- Run focused policy/content, task-record, JSON, whitespace, and diff checks, then obtain final read-only validation.

## Progress
- Task selected as `core/modules/observability:session-jsonl-replacement`; exact backlog identity is preserved until completion cleanup.
- Plan gate reviewed the current tracer, evidence query surface, launcher lifecycle/session-reference behavior, and authority/privacy boundaries. The evidence supports a read-only evaluation and does not justify a migration.
- No descendants are authorized; closure will be vacuously terminal.

## Validation
Pending completion of the source-based diagnostic matrix, focused checks, and final read-only validation.

## Result
Pending.

## Blockers And Escalations
None. Source-based evidence is sufficient for this bounded evaluation. No live session store, provider, Jaeger endpoint, or external service is required or authorized.

## Recovery
Checkpoint: selected backlog row and active task pair are present; no implementation files have changed. If interrupted, preserve the task pair and selected row, reread the evidence, and either continue the evaluation or record a bounded blocker. Do not infer completion from missing runtime artifacts.

## Next Action
Complete the diagnostic matrix and record the evidence-backed evaluation in `changelog.md` before running the final checks.
