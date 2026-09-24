# Thin portable instruction benchmark — cost summary

## Method

The preserved Pi JSON-mode events include provider-reported per-turn `usage.cost.total` values. For each trial, the final distinct non-zero usage value for each model turn was retained and summed. These are provider/model-reported estimates, not an invoice or independent billing measurement.

Configured per-call caps were not treated as actual spend.

## Main comparisons

### Initial report-flow pilot

Nine trials per arm; configured cap USD 0.10 per call.

| Arm | Measured total | Mean per trial | Trials |
| --- | ---: | ---: | ---: |
| Current composition | USD 0.03091217 | USD 0.00343469 | 9 |
| Thin instruction | USD 0.02063558 | USD 0.00229284 | 9 |

The thin arm used approximately 33.2% less measured provider cost in this pilot.

### Increased-budget implementation completion check

Two trials per arm; configured cap USD 0.30 per call.

| Arm | Measured total | Mean per trial | Trials |
| --- | ---: | ---: | ---: |
| Current composition | USD 0.00978395 | USD 0.00489197 | 2 |
| Thin instruction | USD 0.00673477 | USD 0.00336739 | 2 |

The thin arm used approximately 31.2% less measured provider cost in this small completion check.

### All preserved benchmark runs with usage evidence

This includes the initial pilot, 90-second implementation run, contradictory-evidence run, linked-context run that was excluded from behavioral conclusions, and the increased-budget completion run.

| Arm | Measured total |
| --- | ---: |
| Current composition | USD 0.05484044 |
| Thin instruction | USD 0.03550919 |
| Combined | USD 0.09034963 |

The thin arm used approximately 35.2% less measured provider-reported cost across these preserved calls. This is not the total experiment spend because preparatory invalid runs and provider-side billing adjustments are not represented in this aggregate.

## Interpretation

The observed cost advantage is consistent with the thin arm receiving substantially less instruction/context material. It does not establish a universal cost advantage: model routing, caching, tool-call count, completion length, retries, and task complexity can reverse the result. In the increased-budget completion check, the thin arm was slightly slower on elapsed time while still using less measured provider cost.

Raw sources:

- `/tmp/thin-portable-benchmark-results-2026-09-07.json`
- `/tmp/thin-portable-implementation-results-2026-09-07.json`
- `/tmp/thin-portable-contradictory-results-2026-09-07.json`
- `/tmp/thin-portable-linked-context-results-excluded-2026-09-07.json`
- `/tmp/thin-portable-completion-budget-results-2026-09-07.json`
