# Agentic development system construction history

This document is the constructed history of how this repository's live workflow (the adopted composable-skills composition) was realized, validated, and cut over onto master. It was assembled in September 2026 from the branch, commit, tag, and benchmark evidence in the repository; it is retrospective narrative, not authority. Dropped bulk evidence remains recoverable through the evidence tags cited below.

## Sources

- Branch `implementing-composable-skills` (258 commits, 2026-08-23 through 2026-09-04, tip `8760056`) — the realization branch; its full per-family, per-gate history remains intact.
- Master history through the frozen baseline `9a77e37` (2026-08-19) and the single cutover commit `c9c73e0` (2026-09-04).
- Allied branches: `opencode-dead-end`, `retry-with-pi`, `planning-review-convergence`, `review/origin-master`, `review/rebase-simulation`, `pre-identity-squash-20260804T161521Z`, `pre-identity-fix-20260805T182404Z`, `backup/pre-strip-20260901`, `backup/pre-key-strip-20260901`.
- Benchmark evidence under the (dropped, tag-recoverable) candidate tree: `candidate/benchmark/` pre-registrations, results, and scoring for rounds 2-6, the F8 lean run, the F9 cutover run, and the F9-C1 confirmation run; tags `adoption-evidence-full` @ `c5c208c` and `adoption-evidence-f9-confirm` @ `8760056`.

## Phase 1 — seed and adapter exploration (2026-07-25 to 2026-07-31)

- The repository was seeded from the abs-seed project at `b32c7e8` (2026-07-25).
- The first host-adapter direction was OpenCode integration, explored on the `opencode-dead-end` branch (13 commits, diverged from `370dd05`, tip `835cfb5` 2026-07-28). The integration dead-ended on host capability gaps and was never merged; the branch was kept as a named dead-end snapshot, and its readiness mapping survived as [`designs/opencode-adapter-readiness.md`](../../designs/opencode-adapter-readiness.md).
- The pi host won. The `retry-with-pi` branch (tip `65ac54f`, 2026-07-31, "resolve independent delegation budget ownership") was absorbed into the mainline; it is a strict ancestor of master.

## Phase 2 — self-hosting mainline (2026-07-31 to 2026-08-19)

- On the master mainline the repository began to host itself: initial skills and principles were established (`8cc2631 feat(self-hosting)`), the MIT license and agent guidance were adopted (`4a624dd`), and skills, records, task control, observability, and the delegation launcher were built out under the component-task-record protocol.
- The mainline froze at `9a77e37` (2026-08-19, observability admission session correlation). This commit is the adoption baseline against which every later benchmark arm was measured, and the parent of the single cutover commit on master.

## Phase 3 — identity rewrites and review companions (2026-08-04 to 2026-08-24)

- `pre-identity-squash-20260804T161521Z` (tip `91b09e5`) and `pre-identity-fix-20260805T182404Z` (tip `0e396cc`, both diverged from `7dd0184`) are pre-rewrite snapshots of the mainline taken before commit-identity normalization work (completed-backlog cleanup and later history hygiene). They were never meant to merge.
- `review/origin-master` (tip `852d4a1`, 2026-08-08) is a stale mirror of origin master used as a review comparison point; it is a strict ancestor of master and now trails by hundreds of commits.
- `review/rebase-simulation` (tip `cfcc75e`, 2026-08-09, 60 diverged commits) was a rebase-simulation exercise branch; unmerged and preserved.
- `planning-review-convergence` (tip `4f1dc0f`, 2026-08-24, 9 commits on the frozen baseline) checkpoints the convergence of the planning and review threads that preceded the adoption program; unmerged and preserved as a checkpoint.

## Phase 4 — drafts, target design convergence, and the fidelity pilot (2026-08-23 to 2026-08-30)

- The realization branch `implementing-composable-skills` began at `13825a6` (2026-08-23, "capture composable skills designs") and accumulated the draft program: the agentic system brief and handoffs, target design drafts 1-36, and the multi-model review thread (sol, kimi, terra, grok, anthropic reviewers) that converged on the human-accepted target design draft 11 (pinned SHA `abc4d367…` in [`designs/agentic-development-system-implementation-plan.md`](../../designs/agentic-development-system-implementation-plan.md)).
- The skill-fidelity pilot then realized the candidate skills against their baseline counterparts in stages, each with fidelity evidence and walker fixtures: stage 1 reusable skills (`5f1c24c` choosing-names onward), stage 2 target-roster agents (`92f42cb` execution-advisor, `2f7855e` expert), stage 3 master skills (`c2d1084` designing-mermaid-diagrams onward), with stage 1-3 completion recorded on 2026-08-30 (`9eba43c`).
- Stage 4 pre-registered and executed the first workflow benchmark on a pinned seed project (`ec7b5d0`, `3e2d72c`), favoring the candidate 27 vs 25 (`5c3e955`, 2026-08-30).

## Phase 5 — pre-registered benchmark rounds (2026-08-31 to 2026-09-01)

Each round was pre-registered before execution and recorded acceptance, run evidence, scoring, and budget actuals; contaminated runs were voided and re-run rather than reinterpreted.

| Round | Date | Result |
| --- | --- | --- |
| 2 | 2026-08-31 | 12 arms, all checks pass; candidate favorable 107 vs 106 (`f219b5e`, `c105d7a`) |
| 3 | 2026-08-31 | 8 arms, post-checks pass; candidate 107 vs 105, decisive favorable (`a0ed61f`) |
| 4 | 2026-09-01 | 14 arms exit 0; parity met 189 vs 165 (`173dccc`); consumer bundles lost and replaced by the bundle-preservation rule |
| 5 | 2026-09-01 | run-1 contaminated and voided with the defect recorded; run-2 parity met 53 vs 53 (`73f7086`); coverage rows closed (`76a8cc4`) |
| 6 | 2026-09-01 | model-tier generalization with cost metric; uc10 parity met; uc9 symmetric cross-arm read-gate failure accepted (`290f769`, `f186411`) |

## Phase 6 — adoption families F0-F9 (2026-09-01 to 2026-09-03)

- Under the approved adoption flow plan and sequencing decision (recoverable via `adoption-evidence-f9-confirm`), the candidate composition was adopted into the live tree one atomic family commit per gate, under recorded decisions A12-A18.
- F0 authored the 35 per-skill as-is records and remounted `.pi/settings.json`; F1-F7 retired every baseline skill through family swaps (setup/adoption, knowledge, review/consulting, change execution, records/backlog, delegation, evidence), mounting the adopted reusable, master, and composition skills and keeping runtime-only homes for the launcher, validators, backlog query, and Mermaid renderer.
- F8 hollowed the live agent roster to lean contracts (A16-A18), implemented via the candidate route (implementer → 3 workers), with a lean benchmark 25/27 gates PASS and an isolated-integration exercise proving child-commit-to-parent-cherry-pick ancestry.
- F9 resolved the adopted-catalog conformance debt via the live component-builder route, realigned the fidelity gate with the adjudicated contracts (423 PASS / 0 FAIL / 5 recorded supersedes), and ran the head-to-head cutover benchmark against frozen master `9a77e37`: candidate 23/27 vs baseline 22/27, all six safety gates PASS both arms (`5d3199b`, `c5e57e4`, 2026-09-03). Merge gate met.

## Phase 7 — hardening before the cutover (2026-09-04)

- Bun-preferred pi runtime (`778d64b`): pi invocations prefer the official bun entry with a node shim fallback, verified through a live child session.
- Structuring pass and A3 curated prune (`02623c5`): skills classification catalog, runtime-home records under actual parents, and bulk evidence pruning behind tag `adoption-evidence-full` @ `c5c208c` with citations amended to tag+SHA.
- Cutover folder (`51d3fa7`) and namespace flatten (`dc67d2b`): all adoption-program material grouped into `drafts/agentic-development-system-cutover/` to drop at merge, and the 35 skill components flattened to one roster with SKILL.md byte-identity proven (35/35) and the flattened-glob digest `52f23199…` recorded.
- Record diagram gate (`f7e50c5`, `503847c`): under the human ruling that component-record diagrams are crucial, `requireDiagrams` was set true and every record gained truthful capability-boundary diagrams — 71 records / 71 diagrams, full parity — with the rendered test chunked to keep the renderer's 64-diagrams-per-browser-run bound.
- F9-C1 confirmation run (`0ace6ca` variant registration, `20bf802` results): the flattened, post-re-home, bun-runtime tip re-measured candidate-only — 25/27 against the reused baseline target 22/27, all six gates PASS, arm cost 0.1215 USD, single model verified. The pre-merge tip was finalized at `8760056` with surviving citations amended to the fresh evidence tag `adoption-evidence-f9-confirm`.

## Phase 8 — single-commit cutover (2026-09-04)

- Per the human direction that the entire changeset land as one commit with the source branch kept intact, master was advanced by a single commit `c9c73e0` directly on top of the frozen baseline `9a77e37`, carrying the full adopted system, the dropped cutover folder, and the amended citations. The intermediate merge-based master history was discarded before any push; nothing was rewritten on any remote.
- The `drafts/agentic-development-system-cutover/` folder dropped at cutover as ruled; everything in it remains reachable via the two evidence tags. The drafts tree retained only the live-cited and future-work survivors.

## Branch disposition table

| Branch | Tip | Diverged from | Disposition |
| --- | --- | --- | --- |
| `implementing-composable-skills` | `8760056` (2026-09-04) | `9a77e37` | Source branch of record; fully intact; entire changeset cut over to master as `c9c73e0` |
| `opencode-dead-end` | `835cfb5` (2026-07-28) | `370dd05` | Abandoned dead end, preserved; OpenCode adapter direction superseded by pi |
| `retry-with-pi` | `65ac54f` (2026-07-31) | (mainline) | Absorbed; strict ancestor of master |
| `planning-review-convergence` | `4f1dc0f` (2026-08-24) | `9a77e37` | Unmerged planning checkpoint, preserved |
| `review/origin-master` | `852d4a1` (2026-08-08) | (mainline) | Stale origin mirror used for review; strict ancestor, now far behind |
| `review/rebase-simulation` | `cfcc75e` (2026-08-09) | (mainline) | Unmerged rebase-simulation exercise, preserved |
| `pre-identity-squash-20260804T161521Z` | `91b09e5` (2026-08-04) | `7dd0184` | Pre-rewrite snapshot, never meant to merge |
| `pre-identity-fix-20260805T182404Z` | `0e396cc` (2026-08-05) | `7dd0184` | Pre-rewrite snapshot, never meant to merge |
| `backup/pre-strip-20260901` | `bbdc9f7` (2026-09-01) | `9a77e37` | Snapshot before credential-related history treatment |
| `backup/pre-key-strip-20260901` | `647b06e` (2026-09-01) | `9a77e37` | Post-rewrite reference update for the same treatment |

## Post-cutover state and successors

- The live workflow of record on master is the adopted composable skills composition; the repository-wide digest of the flattened skill roster is `52f23199c255fc3c016ec59b513d06da814e6d7c01cf06738c3e70c87cc59aae`.
- Recorded post-cutover work lives in the root `backlog.md`: transient-agent roster integration, tracer fail-closed path resolution, trust hardenings, adviser retirement (A18 D-phase), and `audit-as-is-guidance-coverage`.
- The `designs/` tree remains tracked with its citations into the dropped cutover folder amended to the evidence tags; its final disposition was left as an explicit future decision.