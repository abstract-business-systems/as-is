# Worker Backlog

Planning index for the `agents/worker` role. Active work belongs to its
configured caller task record; completed items are removed after their summary
is recorded in the owning role changelog or handoff.

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| live-behavioral-baseline | open | 3 | 3 | Establish an independent live behavioral baseline for worker | Add opt-in real-Pi behavioral tests for a bounded implementation request in a disposable component fixture. Verify scoped implementation reporting, no commit, no delegation, no subprocess launch, no secret or prompt leakage, and explicit residual-risk reporting. | - | A short-budget live suite runs independently of caller and expert output; each case owns its fixture and cleanup; assertions cover the structured report, scoped mutation rules, no commit/delegation, and residual risk; skipped-provider and residual-risk behavior are explicit. | User-requested prerequisite for refactoring this role. Live execution is opt-in and may consume provider quota. |
| independent-behavior-contract | open | 3 | 3 | Make worker behavior and tests independent of other agent identities | Refactor the worker contract and behavioral tests so bounded implementation behavior depends only on the assigned component scope and caller-provided task, not a fixed upstream role or downstream validation result. Preserve no-commit, no-delegation, no-subprocess, scoped-edit, and structured-report boundaries. | agents/worker:live-behavioral-baseline | The live baseline passes before and after the refactor; each behavioral case can run alone with local fixtures; no test requires as-is, component-builder, expert, or execution-advisor output; focused deterministic checks and diff-check pass. | Refactor follows the live characterization baseline one bounded role at a time. |
