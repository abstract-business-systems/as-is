# Observability Backlog

Open or deferred planning items owned by this component. Completed items are
removed after their concise summary is recorded in `changelog.md`. local session files remain the readable evidence source; traces remain supplementary.

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| jaeger-collector | deferred | 0 | 1 | Add a Collector only if direct export demonstrates a concrete need | Evaluate whether a bounded Collector is needed after direct Jaeger export evidence. | - | Collector is added only with documented need, bounded deployment, and validation. | Historical item aligned to the current schema. Former dependency: `jaeger-support` evidence. |
| reconcile-task-artifact-pair | selected | 0 | 1 | Reconcile the partial post-completion task-artifact pair | Establish and complete a bounded recovery task that reconciles the historical active task artifacts without changing implementation evidence or runtime behavior. | - | Completion leaves tracked `as-is.json` as `{}` and removes only the paired `tasks.md` after validation. | Recovery identity for the partial cleanup left by commit `4ff0d48`; no descendants. |
