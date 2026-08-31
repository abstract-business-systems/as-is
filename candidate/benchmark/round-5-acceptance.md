# Round-5 Acceptance Record

Date: 2026-09-01. Registered procedure: `candidate/benchmark/pre-registration-v5.md` (coverage addendum: delegation depth).

## Acceptance

The user accepted the round-5 draft — the coverage-matrix structure (sequential rounds with a durable gap register), the two use cases (uc9 parallel two-component delegation with the registered concurrency requirement, uc10 budget-stop recovery), and the standing decision rule — in this conversation ("Looks good. Let's continue."), and additionally authorized budget adjustment ("Feel free to change the budgets").

Registered parameters:
- 2 arms (baseline 9a77e37; candidate post-drop variant, checksum e4cd9366…).
- uc9: --rare N → rarewords.py AND --top N → topwords.py, two concurrent delegated children; concurrency verified from registry launch/finish overlap.
- uc10: --stats → stats.py delegated with a request-pinned child budget of $0.02 / 180 s (adjusted from the drafted $0.03 / 240 s under the user's authorization, sized below round-4 child actuals of $0.003–0.01 so a budget stop is likely); scored behavior is the recovery path (stop recorded as a result, no re-roll, parent completes remainder).
- Parity criterion unchanged: candidate ≥ baseline − 1 per UC, aggregate ≤ 3, all gates passing.
- Budgets: caps $2.00 / 3600 s per arm; expected ~$0.25 total including scorer.

## Execution authorization

On this recorded acceptance, the implementer is authorized to: run the round-5 execution setup, launch the 4 arms, collect evidence, spawn the scorer, and commit results — under the registered procedure and the standing subagent condition.
