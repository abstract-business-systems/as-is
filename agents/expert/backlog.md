# Expert Backlog

Planning index for the `agents/expert` role. Active work belongs to its
configured caller task record; completed items are removed after their summary
is recorded in the owning role changelog or handoff.

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| live-behavioral-baseline | open | 3 | 3 | Establish an independent live behavioral baseline for expert | Add opt-in real-Pi behavioral tests for bounded read-only validation of a disposable controlled-worktree diff. Verify evidence-based pass/fail reporting, explicit safe-to-commit wording, no mutation, no commit, no delegation, and residual-risk reporting. | - | A short-budget live suite runs independently of builder and worker output; each case owns its fixture and cleanup; assertions cover bounded validation fields and byte-for-byte non-mutation; skipped-provider and residual-risk behavior are explicit. | User-requested prerequisite for refactoring this role. Live execution is opt-in and may consume provider quota. |
| independent-behavior-contract | open | 3 | 3 | Make expert behavior and tests independent of other agent identities | Refactor the expert contract and behavioral tests so validation depends only on the supplied controlled-worktree evidence and acceptance conditions, not a fixed caller, worker result, or component-builder narrative. Preserve the launcher safety cap and read-only authority. | agents/expert:live-behavioral-baseline | The live baseline passes before and after the refactor; each behavioral case can run alone with local fixtures; no test requires as-is, component-builder, worker, or execution-advisor output; focused deterministic checks and diff-check pass. | Refactor follows the live characterization baseline one bounded role at a time. |
