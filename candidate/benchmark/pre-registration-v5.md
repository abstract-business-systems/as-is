# Round-5 Benchmark Pre-Registration (Coverage Addendum: Delegation Depth)

Status: DRAFT — execution authorized only after acceptance is recorded in `candidate/benchmark/round-5-acceptance.md`.
Standing methodology: `pre-registration-v4.md` (arms, model, caps, rubric, parity margins, scorer mandate, engagement rules) and `candidate/benchmark/coverage-matrix.md` (gap register). This pre-registration pins only what is new.

## 1. Question

Does the candidate composition handle multiple concurrent delegated children and budget-stop recovery at parity with the baseline workflow — the two delegation-capability gaps registered in the coverage matrix after round-4 review?

## 2. Arms (unchanged, standing)

- `baseline`: live workflow from `master @ 9a77e37`.
- `candidate`: post-drop variant, checksum `e4cd9366530976fa2f6e086e1447eec967088aa1ef8c476e7eb08afe6472c860` verified at setup.

## 3. Use cases (2)

- **UC-9 — parallel two-component delegation**: two independent features (`--rare N` → `rarewords.py`; `--top N` → `topwords.py`), EACH implemented through its own delegated child task, with the request requiring the two children to run concurrently (both launched and live at the same time). Exercises multi-child composition, concurrent observation, and dual integration. Concurrency is verified mechanically from launcher-registry `launchedAt`/`finishedAt` overlap, not asserted.
- **UC-10 — budget-stop recovery**: one feature (`--stats` summary → `stats.py` with min/max/median/unique) implemented through a delegated child whose task record the request pins to a deliberately tight budget (at most $0.03 / 240 s) on work sized so the cap plausibly fires mid-task. The scored behavior is the recovery path: the parent records a budget stop as a result (not a re-roll), completes remaining work within the arm's own budget, and reports honestly. If the child completes within the cap, the UC still scores normally — the probe is safe either way, and the `budgetStopped` registry flag decides which path was exercised.

## 4. New coverage rows closed

- coverage-matrix: "MULTIPLE children run CONCURRENTLY" → uc9 (both arms).
- coverage-matrix: "BUDGET enforcement and STOP RECOVERY" → uc10 (both arms).
- New engagement-matrix rows for both; scorer verifies concurrency from registry overlap and the stop/recovery path from registry flags + parent-store evidence.

## 5. Standing settings (referenced, not restated)

Same as round 4: identical launch prompts per arm, `z-ai/glm-5.3-flash`, caps $2.00/3600s per arm, subagent-delegated execution, spawned scorer from recorded evidence only, nine-dimension rubric + six-item gate, engagement matrix mandate, parity criterion (candidate ≥ baseline − 1 per UC, aggregate ≤ 3, all gates passing), deficits flagged with responsible composition cited, bundles created in a fail-fast dedicated step before any `.git` strip (round-4 manifest fix applied).

## 6. Budget

4 arms ≈ $0.10–0.20 + scorer ≈ $0.07. Caps unchanged.