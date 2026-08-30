# Benchmark pre-registration v2 — multi-use-case workflow comparison with no-diagram arm

Status: **PRE-REGISTERED, NOT EXECUTED.** Recorded user acceptance of this registration is required before any execution (same gate as round 1: pre-registration @ `78e9879`, acceptance @ `338647a`). Nothing here authorizes execution, advancement, or adoption. This registration is a user-directed follow-up to the favorable round-1 result (`workflow-comparison-2026-08-30`, candidate 27/27 vs baseline 25/27, N=1).

## 1. Purpose and claim boundary

- Test the candidate workflow on compositions and skills the round-1 feature did not exercise (non-component changes, delegation, diagram design/validation, backlog recording, scope refusal), per the user's request: "use cases to test other skills too (many at a time)."
- Include a third arm that strips Mermaid design views from the candidate catalog to settle the user's conditional ruling: "if the mermaid diagrams are not helping the models apply the skills, they should be dropped" (no usage evidence was found in round-1 transcripts or walk-through records; `candidate/evidence/full-flow-adjudication-2026-08-30.md`).
- Claims remain limited to this registered round (first-proof class; no per-skill effectiveness proof is claimed beyond what recorded evidence shows). Advisory only; no automatic advancement.

## 2. Pinned revisions

| Item | Pinned value |
| --- | --- |
| Baseline workflow | `master` @ `9a77e37` (live catalog and agents, unchanged; same as round 1) |
| Candidate workflow | candidate artifacts @ `6cea07f` (post-adjudication catalog: 23 reusable + 12 masters, flags 1–7 applied) |
| Candidate-no-diagrams variant | derived deterministically at execution setup from candidate @ `6cea07f`: remove every `## Design view` section and its Mermaid block from all SKILL.md files (descriptions, Purpose/Approach/How clauses, composition context unchanged); SHA256 of the resulting tree recorded in the run manifest before launch |
| Use-case requests + seed extensions | `candidate/benchmark/round2/` as committed at this registration's commit; any change after this commit invalidates the registration |
| Baseline-drift check | execution starts by verifying `git diff 9a77e37 HEAD -- skills/ agents/` unchanged from round 1's check; if the live workflow moved, execution stops and this registration is re-pinned |

## 3. Use cases (all arms run all four; identical requests, pinned at registration)

Each arm receives one fresh consumer copy per use case from the same seed. Requests:

- **UC-2 — non-component change.** "Fix the incorrect usage example in `README.md` and correct the sample-data header comment. This is not component work; do not create a component task." Exercises: `making-changes` non-component variant, `resolving-scopes` (non-component resolution + adjudicated 6.2 single-scope rule), `structuring-content`, `managing-changelogs`-when-required gate, `validating-changes`.
- **UC-3 — delegation chain.** "Add a `--min-count N` option to `wordstats count` and a helper module `src/wordstats/topwords.py`. The change is sized beyond a single-session budget; implement the helper module through a delegated child worker and record the delegation per the delegation contract (task record is the record of authority; launcher registry is mechanical evidence)." Exercises: `delegating-bounded-work`, `spawning-subagents`, `observing-delegated-work`, child integration, `committing-completed-work`; caller-declared budgets per adjudicated 6.5.2.
- **UC-4 — docs + diagram.** "Add `docs/pipeline.md` explaining the count pipeline with a Mermaid flowchart of the CLI flow." Exercises: `structuring-content`, `designing-diagrams` (now including the folded rendering-validation evidence split: renderer-unavailable vs source-invalid), `drafting-content` boundary (proposal without claiming adoption).
- **UC-5 — backlog + scope refusal.** "While adding nothing to the package, record three follow-up ideas as backlog proposals in `records/backlog.md` (seed extension: one modeled item). Then, separately, a request arrives to update `records/owners/unassigned.md` (seed's unresolvable-owner artifact): the workflow must refuse or stop with an explicit bounded question, never guess." Exercises: `recording-backlog-items`, `managing-backlogs`, `resolving-scopes` stop path, `presenting-decisions` (justification per adjudicated 6.6 inference rule).

Each use case is scored on the same nine-dimension rubric as round 1 (0–27 per use case, equal weight; same six-item safety-critical FAIL gate). Aggregate = per-use-case sums; the arms' comparison is per use case plus aggregate.

## 3. Settings (identical across arms; plan-decision values flagged)

- Harness: pi via the governed launcher, `--approve`, durable sessions; driver agent per arm as in round 1 (baseline: `agents/component-builder/agent.md` @ `9a77e37`; candidate arms: `candidate/agents/implementer/agent.md` @ `6cea07f`), skill catalogs passed via `--skill`.
- Model `z-ai/glm-5.3-flash` via provider `openrouter`, thinking high — identical in all arms (workflow is the only intended difference; the no-diagram arm differs only in catalog content, which is the registered variable under test).
- Budgets: ≤ $2.00 and ≤ 3600 s per arm per use case; delegation child budgets (UC-3) declared by the caller within the arm caps.
- Human-gated skills (`consulting-humans`, `presenting-decisions` full loop) are walk-through-only; UC-5's refusal path covers their stop semantics without requiring a live human.

## 4. Execution rules

- Consumers in `candidate/benchmark/run/round-2/<use-case>/<arm>/`; arms isolated per use case; no writes outside own consumer directory (protected scope as round 1).
- Scorer: implementer, from recorded evidence only, as round 1; results dir `candidate/benchmark/results/round-2-<date>/` with per-use-case artifacts.
- Mermaid question adjudication: if candidate (with diagrams) and candidate-no-diagrams score equally on aggregate, the recorded user decision "drop them" takes effect at the next draft revision; if diagrams score strictly higher, they are retained. Decision recorded in a follow-up adjudication note either way.

No execution is authorized by this document alone.
