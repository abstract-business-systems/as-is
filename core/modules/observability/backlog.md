# Observability Backlog

Open or deferred planning items owned by this component. Completed items are
removed after their concise summary is recorded in `changelog.md`. local session files remain the readable evidence source; traces remain supplementary.

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| jaeger-collector | deferred | 0 | 1 | Add a Collector only if direct export demonstrates a concrete need | Evaluate whether a bounded Collector is needed after direct Jaeger export evidence. | - | Collector is added only with documented need, bounded deployment, and validation. | Historical item aligned to the current schema. Former dependency: `jaeger-support` evidence. |
