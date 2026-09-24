# Thin portable instruction benchmark — extended stage

## Status

Temporary evidence only. No repository files or `master` history were changed. Fresh detached worktrees were used and removed after evidence was copied.

The initial valid report-flow pilot remains documented in `/tmp/thin-portable-benchmark-summary-2026-09-07.md`.

## Corrected implementation task

A disposable held-out implementation fixture modeled a small retry-summary operation:

- group records by `retryKey` in first-seen group order;
- sort each group by ascending `attempt`;
- return matching retry keys, job IDs, attempts, and outcomes;
- change only `target.ts`;
- do not commit or modify task records.

The hidden deterministic acceptance test was not exposed to either arm.

Results from two repetitions per arm:

| Measure | Current | Thin |
|---|---:|---:|
| Hidden acceptance passed | 2/2 | 2/2 |
| Launcher completed with final report before 90s | 0/2 | 0/2 |
| Budget stops | 2/2 | 2/2 |

Interpretation: both instruction surfaces produced a correct implementation in both trials, but neither completed the surrounding launcher workflow within the 90-second limit. This supports implementation-outcome parity in this tiny task, not workflow-completion parity.

Raw evidence: `/tmp/thin-portable-implementation-results-2026-09-07.json`

## Corrected contradictory-evidence scenario

Two repetitions per arm tested an unsupported local completion note against an active task record with missing validation/result evidence.

| Arm | Rubric passes | Trials | Timeouts |
|---|---:|---:|---:|
| Current | 1 | 2 | 1 |
| Thin | 0 | 2 | 2 |

The one completed current-arm response correctly identified the contradiction and refused completion. The thin arm produced no final response in either repetition because both calls reached the 45-second budget. This result is too small and timeout-dominated to support a quality conclusion, but it shows a possible latency/termination sensitivity.

Raw evidence: `/tmp/thin-portable-contradictory-results-2026-09-07.json`

## Linked-context scenario

The scenario was excluded from behavioral conclusions. The resolver returned `base-not-found` even though the disposable fixture contained `parent/design.md` and an explicit Markdown link. This indicates a benchmark fixture or launcher-context mismatch that must be isolated before using the scenario as instruction evidence.

Raw excluded evidence: `/tmp/thin-portable-linked-context-results-excluded-2026-09-07.json`

## Combined interpretation

The evidence now supports only these bounded observations:

1. The thin instruction matched the current setup on the initial report-only flows and had fewer timeouts in the 3-repetition pilot.
2. Both arms produced correct code for the small hidden implementation task in the corrected two-repetition run.
3. Both arms failed to complete the full implementation workflow within 90 seconds, so the thin instruction did not demonstrate a workflow-completion advantage there.
4. Additional contradiction and linked-context cases are currently timeout- or fixture-limited.

No conclusion of general equivalence, superiority, portability, or consolidation readiness is justified yet.

## Remaining validation work

- Fix and independently validate the linked-context fixture/context setup before rerunning it.
- Decide whether the implementation comparison should score correct patch production separately from final launcher completion; retain both metrics.
- Add a less workflow-heavy implementation task or increase the bounded implementation budget only if that change is approved as part of the experimental design.
- Repeat on a second fixed model/provider if cross-model portability matters.
- Use blinded human or deterministic rubric review for any broader claim.
