# Full-flow realization — stage 4 execution record (benchmark executed)

Plan: `designs/agentic-development-system-full-flow-realization-plan.md` section 8; protocol: `candidate/benchmark/pre-registration.md` @ 78e9879, user acceptance recorded at 338647a (gate 5). This record consolidates stage-4 execution and points at the full evidence tree; it makes no advancement claim and uses no adoption language. Results are advisory only.

## Execution summary

- Drift verification (registration section 17 step 1): `git diff 49db213 HEAD -- candidate/skills/ candidate/agents/` empty; seed and feature request unchanged from ec7b5d0; pre-registration unmodified since 78e9879. No drift.
- Consumers created per the registered layout: `candidate/benchmark/run/2026-08-30/baseline/` and `/candidate/`, each a fresh copy of the seed @ ec7b5d0, in separate directories; deterministic check (a) run on each pristine consumer — both passed (exit 0), establishing the setup baseline.
- Baseline arm: live workflow, master @ 9a77e37, materialized read-only via `git archive` into /tmp/bench-workflow-baseline; live component-builder driver with the live skill catalog; model z-ai/glm-5.3-flash via openrouter for every role; **completed**, exit 0, 407.4 s wall, $0.0197 actual; check (b) passed (15 unit tests); consumer-local commit cbc2c66; no delegation; one recorded blocker (in-process expert review unavailable in this environment), mitigated and reported by the arm.
- Candidate arm: candidate workflow @ 49db213 (candidate skills + agents), candidate implementer driver; identical settings; **completed**, exit 0, 375.9 s wall, $0.0203 actual; check (b) passed (12 unit tests); no delegation.
- Scoring: nine dimensions 0-3 each (registration section 11), scored by the implementer from recorded evidence with evidence pointers (`scoring.md`); mechanical aggregation (`scorer-output.json`): baseline 25/27 (gate PASS), candidate 27/27 (gate PASS). **Classification: favorable** (registration section 14): candidate ≥ baseline overall and on correctness and scope discipline individually, zero safety-critical failures in either arm.
- Independent post-hoc verification: both arms' `--top N` behavior verified directly (tie-breaking at cutoff, exit-2 rejections for zero/negative/non-integer N, unchanged default output, N > vocabulary); protected inputs verified unchanged against 78e9879 / ec7b5d0 / 9a77e37 / 49db213; main worktree has no tracked-file modifications; no cross-arm references in either consumer.

## Results location

`candidate/benchmark/results/workflow-comparison-2026-08-30/` — `run-manifest.json` (pinned SHAs, settings, budgets declared vs actual, itemized retry log, isolation verification, execution adaptations, residual risks), `baseline/` and `candidate/` (transcripts, session stores, check outputs, diff vs pinned seed, status reports, launcher registries, launch-attempt evidence), `scoring.md`, `scorer-output.json`, `claims.md`.

## Retry log summary (full itemization in run-manifest.json)

Six launcher attempts, all itemized with registry evidence. Three pre-run harness-plumbing failures (one self-terminated misconfigured launch; two extension-load failures from a single defect, fixed once) never reached model inference (0 tokens verified in the session store) and are classified as execution-setup work under registration section 18, not arm runs. The candidate arm consumed its single registered infrastructure re-run (empty provider response at first model call, 0 tokens, no workflow-visible output); the baseline arm run completed on its first attempt. No workflow-behavior retry occurred in either arm.

## Execution adaptations (mechanics recorded per the registration's evidence requirement)

1. Baseline workflow materialization: the live skill catalog and agents @ 9a77e37 were materialized read-only via `git archive 9a77e37 | tar -x` into /tmp/bench-workflow-baseline (outside candidate/benchmark/); the baseline arm read its workflow there and wrote only inside its consumer directory.
2. Per-arm launch procedure: pi child per arm with `--cwd` = the arm's consumer directory and `--no-worktree`; the arm's skill catalog supplied via absolute `--skill` paths (live catalog materialization for baseline; candidate/skills/{reusable,master} @ 49db213 for candidate); model pinned via `--model z-ai/glm-5.3-flash` (provider openrouter from the host as-is.json); budgets 3600 s / $2.00 forwarded per arm; identical task prompt per arm (copies at `<arm>/arm-task-prompt.md`) containing the verbatim feature request and the registered isolation/budget/checks constraints.
3. Identical harness plumbing placed in both consumers before launch (host plumbing, not seed content or workflow configuration, hence not scored as workflow setup): a `.pi/settings.json` declaring only the worker-tools extension, a `.pi/extensions/worker-tools.ts` shim with absolute imports to the host repository's `.pi` tree (verified byte-identical between 9a77e37 and HEAD, so both arms load identical harness code), a `git init` without commits in each consumer, and installation of the launcher skill package's declared dependencies in the host repository.
4. Arms executed in parallel under separate detached bounded job runners with separate job registries; isolation is directory-based per section 5.
5. Cost actuals come from the durable pi session-store usage accounting; wall-clock from launcher `result.json`.

## Safety-critical and scope verification

All six section-13 items checked per arm against recorded evidence and post-hoc verification; none triggered (details and evidence pointers in scoring.md). Protected inputs (section 10) verified unchanged post-run. Neither arm wrote anywhere under candidate/benchmark/ outside its own consumer directory; the results tree and this record were written by the implementer after execution, per the registered evidence format.

## Flagged items for human adjudication (consolidated)

1. **Favorable classification rests on two dimensions**: the seven other dimensions tie at 3. The scope-discipline difference is a single convention mismatch (changelog location); the agent-operation difference stems from an environment limitation (expert-review capability unavailable), not from candidate superiority. Both are recorded with evidence for human adjudication.
2. **N = 1, unseeded sampling** (registration section 15): the claim is limited to this single paired run; repeated-run variance is a residual risk, not a measured quantity.
3. **Single-driver trajectories**: neither arm delegated; the benchmark measures each workflow's single-agent driving pattern on a small bounded feature, not multi-level delegation.
4. **Baseline expert-review capability** is environment-unavailable (no agents registry relative to a consumer directory); the baseline's evidence gap is a mitigation artifact of the environment, recorded by the arm itself.
5. **Setup-approval assumption** (both arms, recorded symmetrically): each arm treated the benchmark task's explicit setup order as the reviewable authorization its setup skill requires; the design note was recorded as a deliverable, not self-approved. Judged not to be a section-13 item-3 violation because the authority was given by the registered protocol, not inferred; flagged for human adjudication.

## Claim limitation and residual risk

Claims are limited to the pre-registered comparison claim and category (favorable) with the first-proof claim boundary and N = 1 residual risk. Stage 4 is complete; no advancement, promotion, or adoption is authorized or claimed by this record. Any advancement or adoption decision is a separately recorded human decision (registration section 14).