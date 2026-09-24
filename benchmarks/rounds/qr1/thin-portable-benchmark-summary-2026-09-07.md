# Thin portable instruction benchmark — initial live pilot

## Status

Temporary evidence only. No repository files or `master` history were changed. The benchmark used two detached worktrees from `c511642` and removed them after the run.

Raw evidence: [`thin-portable-benchmark-results-2026-09-07.json`](./thin-portable-benchmark-results-2026-09-07.json)
Runner: [`as-is-thin-benchmark.ts`](./as-is-thin-benchmark.ts)

## Conditions

- Provider: OpenRouter through Pi `0.84.4`.
- Model: `@preset/abs-medium`.
- Thinking: `high`.
- Three scenarios: report-only orientation, explicit no-change, and durable-authority conflict.
- Three repetitions per scenario and arm.
- 18 provider-backed calls total: 9 current-composition, 9 thin-instruction.
- Same fixture semantics, task text, tool declaration, model, thinking level, launcher, budgets, approval mode, and isolated worktree conditions.
- Current arm received the current component-builder role plus an explicit manifest of the repository's configured skills.
- Thin arm received the same front matter and tools, but only the portable instruction plus a neutral skill used to disable ambient skill loading.
- Each arm used fresh no-session launches with a 45-second wall-clock and USD 0.10 configured per-call cap.

## Results

| Arm | Passed | Trials | Timeouts | Mean elapsed time |
| --- | ---: | ---: | ---: | ---: |
| Current composition | 6 | 9 | 3 | 35.47 s |
| Thin instruction | 9 | 9 | 0 | 29.02 s |

By scenario:

| Scenario | Current | Thin |
| --- | ---: | ---: |
| Orientation | 3/3 | 3/3 |
| No-change | 2/3 | 3/3 |
| Authority conflict | 1/3 | 3/3 |

The current arm's three failures were 45-second budget stops. The thin arm produced a usable report in all nine trials. Successful outputs from both arms correctly identified active/incomplete task state, avoided mutation and delegation, and rejected completion claims based on process/runtime evidence alone.

## Interpretation

This is evidence that the thin instruction is viable for these bounded report-only flows under this model and harness. In this small sample it was faster and more reliable than the current composition, primarily because the current arm timed out three times.

It does not establish general superiority, equivalence across models, implementation quality, delegation behavior, or portability to projects without the repository's applicable `AGENTS.md` context. The benchmark intentionally tested the instruction layer while retaining the same launcher and runtime.

## Next stage

Add a held-out implementation microtask based on a recent bounded repository change, plus linked-context and missing/contradictory-evidence scenarios. Use hidden deterministic acceptance checks and blind scoring. Replicate on a second fixed model before making a broader portability claim.
