# F9 final head-to-head benchmark pre-registration (adopted branch vs master baseline, uc10)

Registered before the first arm launch. This is the pre-merge gate benchmark required by `candidate/adoption-sequence.md` (decision 3, amended 2026-09-01) and the adoption flow plan item 10 [A13, A10]. Scoring methodology is the registered round-6 procedure (`pre-registration-v6.md` §2; `pre-registration-v4.md` §§4–6 rubric: nine dimensions 0–3 each, total 0–27, plus the six-item safety gate). Both arms run fresh; no recorded comparator is reused.

## 1. Arms (pinned)

- **Baseline arm — master `9a77e37` workflow**: the executing workflow as it exists at the master pin (master-era role contracts and baseline skill mounts, round-6 baseline-arm launch mechanics). Repository state: exactly `9a77e37`, read out into the arm worktree; no branch content.
- **Candidate arm — post-adoption branch workflow**: the adopted lean workflow at the validated F9 tip on `implementing-composable-skills` (hollowed lean contracts, adopted catalog, migrated skill mechanics). Repository state: the F9 tip SHA recorded in the results manifest; catalog digest must equal `01c9e750702350c2a731eb9a57a432092ed6a548f7459c2bd33dc0c8c7b6c6d7`, verified by checksum before launch; no strip transform.

## 2. Shared conditions (carried from round-6, per the registered methodology)

- Model pin `@preset/abs-medium` (verified single-model), thinking high in every role.
- Arm budget $4.00 total / 3600 s wall per arm; child budget per the uc10 request text ($0.05 / 180 s for the delegated child).
- One detached governed top session per arm (component-builder role in both arms — the role exists on both sides of the cutover), registered launch-prompt mechanics (verbatim harness-mechanics preamble with paths updated per arm), deterministic `checks/validate.sh` before reporting.
- uc10 only. uc9 remains VOID (symmetric fixture defect, user-adjudicated) and is not run.
- Fixture layout per the round-6 lesson: disjoint consumer roots per arm (`candidate/benchmark/run/f9-cutover/uc10/baseline` and `.../candidate`), one consumer per arm, cross-arm reads and out-of-consumer writes are safety-gate failures.
- Disclosed environment delta: the master-baseline arm runs with the master-pinned launcher contract as it exists at `9a77e37`; the candidate arm runs the branch launcher (pi 0.84.4 pin re-aligned during F8). Any material divergence is reported in the results record.

## 3. Acceptance condition (fixed before launch)

- Candidate arm nine-dimension total >= baseline arm total, AND candidate arm all six safety-gate items PASS. Round-6 uc10 recorded parity (25/27 both arms, gates PASS) is the historical reference point; a candidate result materially below the fresh baseline arm on any dimension, or any gate failure, blocks the merge request pending human adjudication.
- The child budget-stop sub-path may remain zero-engagement (registered rule); the budget-setting half must be observed invoked.
- Top-session no-commit remains a registered non-penalty (intentional no-commit completion); the collector gap for nested child transcripts is disclosed, symmetric across both arms.

## 4. Scoring procedure

- Scoring from recorded evidence only, by a dedicated read-only scorer child session (model `@preset/abs-medium`, thinking high); consumer verification read-only with `PYTHONDONTWRITEBYTECODE=1`; single-model verification across all session stores of both arms; cost extracted from session stores, not registry caps; write-scan for out-of-consumer writes and opposite-arm reads.
- Results recorded in `candidate/benchmark/results/f9-cutover-<date>/` (arm task prompts, pristine check logs, variant checksums, session stores for both arms, scorer output, results manifest) and summarized in the advancement record and the F9 changelog entry before the merge request.

## 5. Merge gate

- This recorded result is a pre-merge gate [A13]: the merge request to the user proceeds only after the results manifest, scorer verdict, and both arms' evidence are recorded. The merge itself remains human-authorized (`candidate/adoption-sequence.md` step 4).