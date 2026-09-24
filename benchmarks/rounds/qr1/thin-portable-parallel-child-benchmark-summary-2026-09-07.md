# Parallel-child benchmark stage summary

## Status

Two valid paired repetitions completed for the disposable parallel incident-report task. No repository or `master` changes were made. The fixture and all run worktrees were temporary detached worktrees.

The initial medium-preset pilot was infrastructure-invalid: both arms timed out under an upstream provider rate limit before producing parent completion. It is excluded from efficacy conclusions.

The scored large-preset runs used `@preset/abs-large` with the same model, tools, launcher, task, child budgets, and hidden checker in both arms. This is a separate model/preset result from the earlier `@preset/abs-medium` benchmark.

## Task

The parent implemented a bounded `incident-report` command over JSONL records. Three children owned parsing, correlation, and presentation in separate worktrees. The parent reviewed scoped commits, integrated them, implemented CLI/end-to-end integration, and validated the result.

## Valid result set

Valid repetitions:

- `/tmp/thin-portable-parallel-child-results-1788801691787.json` — first large-preset pair. The runner's early summary did not yet capture the child registry, but the parent event stream contains the helper's structured evidence: three initial child launches before any child finished, three successful scoped commits in each arm, and no retries.
- `/tmp/thin-portable-parallel-child-results-1788803504352.json` — fresh pair after the acceptance checker was corrected to use tolerance-based cost comparison. Structured child registry capture confirms three initial launches before any initial child finished, three successful scoped commits, and no retries in each arm.

The intervening pair `/tmp/thin-portable-parallel-child-results-1788802889000.json` is excluded from hidden-acceptance conclusions because its hidden checker required exact floating-point equality for 0.35 even though the public contract only required aggregation. Both parents otherwise completed; the checker was corrected before the fresh valid pair.

| Arm | Valid completions | Hidden acceptance | Parallel child admission | Total measured cost | Mean cost | Total tokens | Mean elapsed |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Current composition | 2/2 | 2/2 | 2/2 | USD 1.38048350 | USD 0.69024175 | 3,093,403 | 264.663 s |
| Thin instruction | 2/2 | 2/2 | 2/2 | USD 0.72190010 | USD 0.36095005 | 1,312,110 | 195.429 s |

Across these two valid pairs, the thin arm used approximately 47.7% less measured provider-reported cost, 57.6% fewer measured tokens, and 26.2% less mean elapsed time. The sample is too small for a general claim.

## Child/integration observations

- Both arms launched all three initial children before waiting for any initial child to finish in both valid repetitions.
- All valid child attempts returned successful scoped commits; no retry was required in the valid repetitions.
- Both arms integrated the child results and passed the hidden acceptance check in both valid repetitions.
- The excluded pair demonstrated that the current composition sometimes elected to retry a child; that retry completed successfully, but the pair is not used for the primary two-pair comparison because the checker was underspecified.

## Interpretation and residual risk

The thin instruction matched the current composition on this task family in the two valid pairs while using less context/tokens and lower measured cost. The task was purpose-built and modestly sized; this does not establish parity for unrelated domains, larger migrations, recovery-heavy tasks, or governance/audit evidence.

The model/preset was changed from `@preset/abs-medium` to `@preset/abs-large` because the medium preset was temporarily rate-limited upstream during the larger-task pilot. Do not combine this result numerically with the earlier medium-preset results.

Cost values are reconstructed from distinct non-zero provider-reported usage totals per model turn in the preserved Pi event stream. They are not independent invoices.
