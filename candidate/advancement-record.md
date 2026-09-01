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