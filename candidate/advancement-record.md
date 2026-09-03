# Candidate Advancement Record (composable-skills composition)

Status: ACCEPTED — advanced on human sign-off (standing rule: advancement is human-only).
Scope: declaration-only. No file relocation, no migration, no live-workflow change happens at advancement. Migration mechanics belong to the separately planned adoption flow.

## 1. What is advanced

The candidate composition under `candidate/` on branch `implementing-composable-skills`:

- 23 reusable skills + 12 master skills (`candidate/skills/`), post-drop variant (per-skill Mermaid design views removed; draft revision authorized by the user 2026-09-01, commit ca26110).
- Transient agent set under `candidate/agents/`: implementer, worker, planning-adviser, external-adviser (advisers read-only; never used in benchmark arms).
- Registered catalog digest: `9f8dbdcb1096edb03b8aea3c1811a0de3b0038467616c273516b70af1f5ec267` (reusable+master SKILL.md contents).

## 2. Evidence base (six registered benchmark rounds, all favorable)

| Round | Question / coverage | Result | Parity |
| --- | --- | --- | --- |
| 1 (pilot) | skill-fidelity pilot | 17+15 PASS 0 FAIL | — |
| 2 | full-flow parity, uc2-uc5 + no-diagram A/B | 106/107 vs 103 | met |
| 3 | repair + roster 24→23, uc2-uc5 | 107/108 vs 105/108 | met |
| 4 | seven-UC capability coverage, uc2-uc8 | 189/189 vs 165/189 (uc8/baseline voided by user adjudication) | met on six UCs, 189 v 158 |
| 5 | delegation depth, uc9-uc10 (run-1 voided, infrastructure) | aggregate 53 v 53 | met |
| 6 | model-tier generalization (abs-medium/gpt-5.6-luna) + cost | uc10 25 v 25 all gates PASS; uc9 scored 25 v 25 with registry-verified concurrency, then voided (symmetric fixture defect, user adjudication) | uc10 met |

Fidelity: 442 + 32 checks PASS, 0 FAIL, post-drop shape asserted (no Design-view section, no Mermaid in skill bodies). Concurrency and budget pinning mechanically verified from launcher-registry evidence in rounds 5-6. Cost/wall-clock: candidate ~40-60% of baseline wall clock, ~60-100% of baseline cost per UC across both model tiers (recorded in `temp/benchmarking/cost-wall-clock-comparison.md`). Program spend ~$3.75.

## 3. Baseline-skill disposition table (17 baseline skills at master @ 9a77e37)

- Ported 1:1 (name retained): as-is-setup, structuring-content, naming-software-concepts, maintaining-components, designing-mermaid-diagrams (retained as master; drop affected briefs only).
- Renamed 1:1: human-centered-consulting→consulting-humans, implementing-component-tasks→implementing-tasks, managing-as-is-document→managing-as-is-records, managing-backlog→managing-backlogs, spawning-pi-subagents→spawning-subagents, context-building→building-context, exploring-execution-evidence→exploring-execution-evidence (master) + inspecting-execution-evidence (reusable).
- Decomposed into compositions: building-components→master + reusables; committing-completed-work→preparing-scoped-commits + managing-changelogs; verification-discipline→validating-changes + running-tests + choosing-change-methods; backlog work→managing-backlogs + recording-backlog-items + identifying-owners + resolving-scopes; deterministic-skills→assessing-determinism; changelog work→locating-changelogs + drafting-changelog-entries + managing-changelogs; change work→making-changes + applying-bounded-edits + writing-code + writing-tests + validating-changes; evidence work→recording-evidence; human review→presenting-decisions; delegation→delegating-bounded-work + observing-delegated-work; content→drafting-content.
- Function-absorbed (no 1:1 skill ported; disposition at adoption): integrate-as-is-documentation (absorbed into setup flow + managing-as-is-records; setup dimension scored 3/3 candidate-side every round).
- None dropped without a recorded disposition.

## 4. Known residuals (recorded, non-blocking)

- Budget-stop recovery coverage row remains OPEN (six rounds, zero stops; children at ~6x headroom even at mid-tier pricing — the probe needs non-budget pressure). Documented in the coverage matrix; does not block advancement.
- Round-6 uc9 voided for a symmetric fixture defect (cross-arm reads by delegated children); lesson registered: future multi-arm rounds use disjoint consumer roots.
- Candidate arms historically did not commit in-session (symmetric observation, not penalized); consumer histories preserved via verified git bundles.
- Standing capability rows with zero engagement in some rounds (maintaining-components round-4, explained) — fixture gaps, not parity-bearing.

## 5. Proposed advancement action (for human sign-off)

Advance the candidate composition to ACCEPTED-TARGET status: the candidate composition (agents + 35-skill catalog + launch/benchmark methodology) is accepted as the target realization of the composable-skills design, superseding the baseline workflow as the destination of the adoption flow. Benchmarks, launch scripts, results, and the coverage matrix remain registered evidence under `candidate/benchmark/`. Adoption into the consuming project is a separate, separately authorized flow; until adoption completes, the live baseline (master `skills/` + `agents/`, and the unmodified `core/` contracts) remains the operating workflow of record.

## 6. Sign-off

- [x] Human sign-off recorded (name/date/comment): Viswanath Chidambaram, 2026-09-01, session confirmation "Advancement signed off". Advancement effective as a declaration only: no files relocated, master remains at 9a77e37, adoption is a separate authorized flow (sequencing recorded in candidate/adoption-sequence.md).
## 7. Adoption execution (F1–F8)

- F1–F7 complete (core + family commits through `e2f2f30`); all baseline skills retired; adopted definitions + transitional catalog section remain until F9; mounts 34; digest re-pinned through family phases.
- **F8 (agents roster) in execution under amendments A16–A18**: lean-agent philosophy human-ruled; planning-adviser reviews recorded (`f8-lean-agent-philosophy-adviser-review.md` HOLD→superseded, `f8-lean-hollowing-adviser-review.md` PROCEED with gates); implementation executed through the candidate route (implementer `j-mtkuwydp-uygp5v` -> 3 worker children + planning-adviser HOLD-on-live-prohibition resolved by human + external-adviser findings incorporated); brutal hollowing applied (7 carried contracts, component-builder 94->20 lines); mechanics migrated into `delegating-bounded-work` + `spawning-subagents` + `building-components`; migration matrix `candidate/evidence/f8-hollowing-migration-matrix.md`; design-prototyper deferred to backlog; live roster = 7 carried roles; worker retirement deferred until after route+benchmark.
- Live battery green for all changed roles (expert/probe suites added); deterministic gates green after environment alignment: pi contract re-pinned 0.84.4, launcher package-fallback `--bun` removed, stale expectations matched, rendered-validator aligned to A13 scoping. Digest `01c9e750702350c2a731eb9a57a432092ed6a548f7459c2bd33dc0c8c7b6c6d7`.
- Remaining F8 pre-commit gates: fresh isolated-integration exercise (cherry-pick/ancestry/closure/no-separate-integration) + three-way benchmark (lean arm on uc10 vs round-6 recorded baseline/candidate, 25/25 target), roster smoke, worker retirement, family commit + index update. Then F9.

- **F8 complete (`6dd495c`)**: hollowed lean contracts live; live battery green for all changed roles; fresh isolated-integration exercise green (child `e4f25a7f` → parent integration `f74081f5`, ancestry proven; no-change case recorded); three-way benchmark MET — lean 25/27, all six gates PASS, equal to round-6 uc10 comparators (`pre-registration-f8.md`, `results/f8-lean-2026-09-03/`); environment alignment recorded (pi 0.84.4 pin, launcher fallback fix, stale-expectation fixes); transient implementer/worker retired; four agents revisit backlog items filed. Catalog digest `01c9e750…`.

## 8. F9 cutover (conformance, validation, final pre-merge benchmark)

- **Conformance debt resolved (`b0c5ec3`)**: `adopted-catalog-record-conformance` closed via the live component-builder route (child source `eed2bff` integrated by cherry-pick, ancestry proven). Container records `skills/master/as-is.md` (12 children) and `skills/reusable/as-is.md` (23 children) created per the root-record pattern; `skills/as-is.md` reduced to the two-container adopted catalog; all 35 adopted records' Lineage lines updated; 6 diagram labels fixed; all transitional validator tolerances and namespace exclusions removed. Content test 69 records/41 diagrams (up from 32/29); catalog digest unchanged (`01c9e750…`). Benchmark-tree exclusions retained as permanent evidence scoping.
- **Registered fidelity gate realigned (`787632f`)**: the three F8-adjudicated skills' fidelity is evidenced by the F8 benchmark + live battery instead of frozen draft-clause checks; amended gate aggregate 423 PASS / 0 FAIL / 5 recorded supersedes across 35 skills (plan's 442 figure superseded — flagged for human review at the merge request).
- **D3 verified satisfied**: TS composition layer already retired (`a8dc1b5`); no live consumers; reference sweeps clean (retired names only in legitimate backlog history).
- **Named real end-to-end task**: the conformance delegation itself (task "F9 adopted catalog record conformance", admitted role component-builder, acceptance evidence: content-test 69/41 + digest + full battery; residual risk: rendered rendering unsupported in the child environment, disclosed).
- **Final pre-merge head-to-head benchmark PASS (`5d3199b`, `c5e57e4`)**: registered per `candidate/benchmark/pre-registration-f9.md`; baseline arm = master `9a77e37` workflow (fresh checkout, master-era launcher contract, master-pinned pi 0.84.0 under bun runtime — round-6 parity), candidate arm = F9-tip branch workflow (system pi 0.84.4); disjoint consumer roots; model `@preset/abs-medium`, thinking high, arm caps $4.00/3600 s. Result: **candidate 23/27 ≥ baseline 22/27, all six safety gates PASS on both arms** (scorer read-only, evidence-only). Environment asymmetries recorded: baseline implementation child failed on an upstream provider rate limit (recorded, no retry); the candidate child exercised the registered 180 s budget-stop recovery path for the first time in benchmark history (engaged, no re-roll, honest blocked-on-handoff status); `single_model_verified` false only because provider-error messages omit `responseModel`. Both consumers pass deterministic validation at scoring time. Results: `candidate/benchmark/results/f9-cutover-2026-09-03/`.
- **Merge gate met**: `candidate/adoption-sequence.md` step 3 (pre-merge validation gate, amended) satisfied. The merge itself remains human-authorized (step 4): `git merge --no-ff implementing-composable-skills` on master, then post-merge smoke.
