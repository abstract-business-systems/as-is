# Round-6 Benchmark Pre-Registration (Model-Tier Generalization + Cost)

Status: DRAFT — execution authorized only after acceptance is recorded in `candidate/benchmark/round-6-acceptance.md`.
Standing methodology: `pre-registration-v4.md` (arms, caps, rubric, parity margins, scorer mandate, engagement rules) and `candidate/benchmark/coverage-matrix.md` (gap register). This pre-registration pins only what is new.

## 1. Question

Does the round-4/5 composition-level parity finding generalize to a mid-tier model (`@preset/abs-medium`, OpenRouter, $0.20/M input, $1.20/M output, 1.05M context; single model behind the preset per user confirmation 2026-09-01), and what does each composition cost per arm at that tier? Secondary: with a model ~10–50× the price of glm-5.3-flash, budget pressure becomes reachable for the first time — can the still-open budget-stop recovery row be closed in the same round?

## 2. Arms and model (changed)

- `baseline`: live workflow from `master @ 9a77e37` (unchanged).
- `candidate`: the live post-drop catalog is now the variant itself (design views dropped, commit 1935f05); digest `9f8dbdcb1096edb03b8aea3c1811a0de3b0038467616c273516b70af1f5ec267` verified at setup by the registered recipe (`cat candidate/skills/{reusable,master}/*/SKILL.md | sha256sum`). No strip transform runs in round 6; the round-4 registered strip regex is retired (it carried a broken lookahead that is only safe on last-section files).
- Model for EVERY role in every arm, including the scorer: `@preset/abs-medium` via `--model` on every launcher call (launcher-level override proven rounds 4–5). `thinking: high` pinned for every role. Because the user confirmed the preset resolves to a single model, no drift control is needed; `responseModel` is still recorded per session in the manifest as cheap verification, and the scorer re-verifies single-model per session (standing check).

## 3. Use cases (2)

- **UC-9 — parallel two-component delegation**: request verbatim identical to round-5 uc9 (two independent features, each through its own delegated child, children required to run concurrently; concurrency verified from registry `launchedAt`/`finishedAt` overlap). This is the generalization anchor.
- **UC-10 — budget-stop recovery, re-sized for the model tier**: request identical to round-5 uc10 except the pinned child budget is at most **$0.05 / 180 s** (was $0.02 on glm, where children actuals were ~$0.003; at abs-medium pricing equivalent work costs ~$0.03–0.10, so a mid-task stop is plausible while completion stays possible — safe either way, same scoring rule: a stop recorded as a result with parent completion of the remainder is the exercised path; the `budgetStopped` registry flag decides which path was exercised).

## 4. New metric: cost per arm

Per-arm cost (parent + all children, from session-store `usage.cost.total`, deduped by session id) is reported next to the parity gates in `scoring.md`/`run-manifest.json`. The existing round-5 run-2 candidate stores serve as the free glm anchor for a cross-model comparison of the candidate arm (no extra runs).

## 5. Caps (registered change)

Arm caps raised to **$4.00 / 3600 s per arm** (uniform both arms) so a mechanical cap-stop cannot contaminate the parity measurement at the higher price tier; expected arm spend $0.4–1.0 each. Child budgets come only from uc10's request-pinned cap. Total expected ≈ $2.00–4.50 including scorer.

## 6. Coverage rows

- Standing rows re-verified under a second model tier (no new capability rows).
- OPEN gap row "budget-stop recovery path" targeted for closure by uc10 (both arms).

## 7. Standing settings (referenced, not restated)

Identical launch prompts per arm; staggered arm launches ≥15 s (run-1 launch-probe race lesson); child-agent policy pinned in the arm prompt (no `--agent` without a non-empty `tools:` declaration); fail-fast evidence collection with `git bundle verify` before any `.git` strip; spawned scorer from recorded evidence only, read-only consumer verification, writes only `scoring.md` + `scorer-output.json`; parity criterion unchanged (candidate ≥ baseline − 1 per UC, aggregate ≤ 3, all gates passing); nine-dimension rubric + six-item gate; engagement matrix mandate.

## 8. Budget

4 arms ≈ $1.6–4.0 + scorer ≈ $0.5 (abs-medium pricing). Arm caps $4.00/3600 s.