# Task

## Requirement

Implement the new `src/wordstats/stats.py` module for the parent `--stats` feature. Produce a deterministic summary from the word-count mapping containing minimum count, maximum count, median count, and number of unique words. Work only in the assigned `src/wordstats/` component, do not delegate or commit, and stop/report if the child budget is exhausted.

## Plan

Implement a small pure summary function with explicit empty-input behavior and focused self-checks where practical.

## Progress

Child attempt 1 was admitted with allocated budget USD 0.05 and 180 seconds, including 30 seconds reserve. The governed launcher reached the worker, but the worker's Pi session failed upstream with a rate-limit error before any filesystem tool call or implementation. No retry was made; no child-owned implementation or commit exists.

## Validation

Not run by the child because the worker failed before implementation.

## Result

Failed: no implementation was produced. Parent must not treat this failed child as an integrated implementation.

## Blockers And Escalations

Worker execution failed with `openai/gpt-5.6-luna is temporarily rate-limited upstream`; this is not a budget stop. Recovery requires explicit direction or a newly authorized task; the parent must not re-roll this attempt under the current request.

## Recovery

If budget-stopped, preserve partial edits and report the checkpoint; parent will decide bounded recovery without a retry.

## Next Action

Implement and report the bounded module result.
