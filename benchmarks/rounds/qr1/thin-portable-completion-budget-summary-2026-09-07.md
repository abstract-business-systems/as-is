# Thin portable instruction — increased-budget completion check

## Conditions

- Fresh detached worktrees from `c511642`.
- Same model, provider, tools, task, fixture, launcher, and permissions for both arms.
- Corrected hidden implementation fixture.
- Two repetitions per arm.
- Implementation wall-clock budget increased from 90 seconds to 180 seconds.
- Configured cost cap increased from USD 0.20 to USD 0.30 per call.
- No commits or master changes.

## Results

| Arm | Final launcher completion | Hidden acceptance | Scope discipline | Mean elapsed |
| --- | ---: | ---: | ---: | ---: |
| Current composition | 2/2 | 2/2 | 2/2 | 40.54 s |
| Thin instruction | 2/2 | 2/2 | 2/2 | 45.65 s |

Both arms:

- implemented the requested function correctly;
- passed the hidden deterministic acceptance test;
- returned a final report before the increased budget expired;
- preserved task records and unrelated files;
- did not commit or delegate.

The current arm reported a targeted runtime check in one repetition; the thin arm also reported targeted local validation. Both correctly stated that hidden acceptance had not been run from the agent's perspective, even though the external benchmark then ran it.

## Interpretation

The earlier 90-second failures were budget starvation for this task, not evidence of an inherent completion failure in either instruction surface. With a 180-second allowance, both approaches achieved completion and hidden acceptance parity in this small implementation scenario.

The thin arm was somewhat slower on average in this run, but the sample is only two repetitions and does not support a latency conclusion.

Raw evidence: `/tmp/thin-portable-completion-budget-results-2026-09-07.json`
Runner: `/tmp/thin-portable-completion-budget-runner-2026-09-07.ts`
