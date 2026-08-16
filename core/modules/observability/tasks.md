# Task

## Requirement
Harden the existing direct Jaeger/OTLP HTTP export within the observability component. Enforce a finite internal timeout, isolate unsuccessful HTTP responses, and prove the existing wire shape and privacy behavior with a local in-process HTTP stub. Keep local trace queries owned by `tools/evidence`; do not introduce remote querying, collector deployment, retries, buffering, or external effects.

## Plan
- Add a fixed internal export timeout to the existing direct HTTP path and treat non-2xx responses as unavailable telemetry.
- Add focused in-process HTTP stub tests for method/path/content type, OTLP envelope, opaque session-ID-only projection, timeout, refusal, and non-2xx isolation.
- Preserve file tracing, retention, privacy, lifecycle, session-reference, and evidence-tool behavior; keep the root file backend default and current configuration fields unchanged.
- Run focused and adjacent regression checks, task-record/content/JSON/build/whitespace checks, and fresh final expert validation.

## Progress
- Historical `jaeger-support` wording was narrowed in the selected backlog row because local bounded queries belong to `tools/evidence` and no remote query client exists.
- Plan gate approved the narrowed direct-export hardening scope. No descendants are authorized; closure will be vacuously terminal.
- Implementation has not started; selected backlog row and active task pair are present.

## Validation
Pending implementation and local-stub export checks.

## Result
Pending.

## Blockers And Escalations
None. No external endpoint, collector, provider, credential, or target-machine action is required or authorized.

## Recovery
Checkpoint: selected backlog row and active task pair are present; no implementation changes have been made. If interrupted, preserve the pair and restore or continue only the scoped tracer/test changes. Keep the default file backend and no-retry behavior intact.

## Next Action
Implement the fixed timeout and unsuccessful-response isolation, then add the local HTTP stub coverage.
