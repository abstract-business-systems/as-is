# Cutover structuring and prune approach (draft 1)

Status: draft for discussion — not authorized for implementation. Recorded 2026-09-03 so work can compact and continue. Parent flow: `candidate/adoption-sequence.md`; the merge remains human-authorized (step 4).

## 1. Goal

- Master lands clean at the cutover: the working tree carries only durable, owned, record-covered content (user goal: "master is always clean").
- The adopted record structure is truthful before the merge: full physical↔record coverage and semantically honest boundaries — generated with extra care, per the user.
- Sequence: structuring pass → curated prune (A3) → merge request. Sol (planning-adviser) consulted on the structuring design before implementation.

## 2. Verified findings (2026-09-03, root inspection)

1. **Coverage gap**: `skills/` physically contains four runtime-only home directories with no record coverage — `spawning-pi-subagents/` (launcher, worker-tools extension, node_modules), `managing-as-is-document/` (repository-wide dogfood validators), `managing-backlog/` (backlog query tooling), `designing-mermaid-diagrams/` (mermaid renderer) — plus the stray planning document `building-components-consolidation.md`. The skills catalog record declares only the two namespace containers. The conformance walk validates only directories that have an `as-is.md`; record-less directories are invisible. Conformance (records well-formed) was mistaken for coverage (tree fully mapped).
2. **Boundary critique (user)**: the master/reusable containers are not semantic boundaries — they encode mount provenance (same-name swaps → master; new composable pieces → reusable), and the classes themselves overlap ("master skills themselves could be reusable"). Enforcing the split would enforce a wrong boundary; the partition itself needs rethinking.
3. **Live citations into drafts**: `drafts/composable-skills.md` is cited by 10 live master `SKILL.md` files (tool-access rows with line numbers) and by both registered fidelity-check scripts. `drafts/` also carries its own valid record (`drafts/as-is.md`) defining it as the durable home for bounded proposals. Blanket draft deletion would break live skill citations and the tree's own record.

## 3. Structuring approach (pre-merge) — options and care

Common requirements regardless of option: runtime homes become declared, recorded components; every physical `skills/` child is declared in some record; a **tree↔record coverage check** is added to the content test (every physical directory must be declared; every declared path must exist) so coverage cannot silently regress; no `SKILL.md` content edits (catalog digest `01c9e750…` must remain); test-anchored phrases and as-is record authority phrasing preserved; house record style (Purpose/Design/Components table/Lineage/diagram) maintained; full gate battery re-run after.

- **O1 — Single capability catalog**: one `skills/as-is.md` declaring all components (35 skills + 4 runtime homes + document dispositions) with classification as record attributes (e.g., `composition-authority` / `composable-procedure` / `runtime-home`); the two container records retire. Pros: removes the false boundary entirely; classification is honest per-skill. Cons: the container-diagram node count (≈39) stresses the record pattern's structural-diagram rule; largest record rewrite at cutover.
- **O2 — Storage-group containers, honestly labeled + classification attributes (lean)**: keep the two container records but redefine their declared meaning as *physical storage grouping, not a semantic boundary*; the catalog record gains a classification table (authoritative classification per skill: composition-authority vs composable-procedure) and declares the runtime homes as components with small runtime-home records. Pros: smallest truthful change; diagrams stay readable; the false-boundary problem is dissolved by relabeling (the containers stop claiming to be semantic). Cons: the physical split remains until a post-merge layout decision.
- **Deferred either way**: physically relocating runtimes (see §4) and any directory flattening (merging `master/`+`reusable/` into one namespace) — separately scoped moves with their own reference sweeps; not cutover work.

Decision: user, advised by Sol.

## 4a. TS/runtime re-homing — historical reasoning for the original deferral (superseded by §4 decision)

Current state (per A4/A14 runtime-only home pattern): the governed launcher + worker-tools extension + skill-local `node_modules` live in `skills/spawning-pi-subagents/`; the dogfood validators in `skills/managing-as-is-document/`; backlog query tooling in `skills/managing-backlog/`; the mermaid renderer in `skills/designing-mermaid-diagrams/`. The narrative records were retired; the runtimes stayed.

Why they were not moved during adoption (recorded reasoning, to be discussed):

1. **Self-referential migration**: the adoption program used these exact runtimes to perform its own migration (launcher executing every child session; validators gating every family). Moving the tools mid-migration churns the instruments doing the moving and invalidates the pin/probe mechanics while they are load-bearing.
2. **Path-pinned mechanics and evidence chain**: launcher resolution assumes the skill-local layout (`node_modules/.bin/pi` under the skill directory, `findLocalPi` walk); the 62-test launcher suite, live-behavioral suites, dummy-delegation fixtures, benchmark pre-registrations, and run manifests cite these paths. A move is an atomic proven-reference update across runtime + tests + evidence records.
3. **Cutover scope discipline**: the merge is a workflow-capability swap; mechanical renames inside it widen the blast radius and weaken the single-revert story (A4/A14 explicitly recorded the moves as "separately scoped human-authorized renames").

## 4. TS/runtime re-homing — DECIDED (2026-09-03, user): pre-merge

The user ruled the re-home happens **before the merge** (reversing the A4/A14 deferral). Decisions and facts:

- **Digest neutrality verified**: no `SKILL.md` file cites any runtime-home path — the move does not touch the benchmark-pinned catalog digest (`01c9e750…`). Consumers are all non-digest files: `.pi/extensions/{worker-tools,worker-tools-observability,mermaid-tools}.ts`, `.pi/prompts/as-is.md`, seven agent live-behavioral suites, worker changelog, dummy-delegation fixtures, benchmark launch scripts, the evidence-validator focused-check file list, and the launcher's own internals.
- **Target homes (root-assigned under the user's delegation, following existing patterns)**:
  - `skills/spawning-pi-subagents/` → **`core/adapters/launcher/`** (the adapter pattern is established: bounded-process-supervisor lives in `core/adapters/process/`; the launcher is delegation execution infrastructure, not a skill).
  - `skills/managing-as-is-document/` → **`tools/as-is-validators/`** (repository-wide dogfood validators; `tools/` already hosts agent-facing programs, `tools/agent/`).
  - `skills/managing-backlog/` → **`tools/backlog-query/`**.
  - `skills/designing-mermaid-diagrams/` → **`tools/mermaid-renderer/`**.
  - `building-components-consolidation.md` → disposition recorded in the structuring pass (planning evidence; likely `drafts/` or retirement).
- **Runtime split recorded (user question)**: post-merge, **node runs pi; bun runs our tooling**. pi 0.84.4's dist is node-runtime targeted (bundled undici uses APIs bun lacks — the reason `--bun` was dropped at F8); skill-local `.bin/pi` shims are node; the package fallback runs the node shim via `bun x` without `--bun`. Bun survives only as tooling runtime (`bun test`, the launcher invocation, `bun x` as package runner). No pi session runs under bun. The F9 baseline arm's bun wrapper existed solely to reproduce round-6 parity for master's 0.84.0 pin, which dies at the merge.
- **Sequencing consequence**: the re-home runs BEFORE the structuring pass so records describe the post-move tree (no records written for paths that then move).

Historical reasoning for the original deferral (A4/A14) is retained below for provenance:

The open question is **where they should live** (post-merge, or pre-merge if the user rules): `core/adapters/` (host-adapter pattern exists: host-setup), `tools/` (existing `tools/agent/`), a new top-level `runtime/` home, or unchanged. Trade-offs: `tools/` matches "agent-facing programs, not skill definitions" semantics; `core/adapters/` matches the bounded-supervisor/adapter pattern (bounded-process-supervisor already lives in `core/adapters/process/`); staying avoids churn but leaves the catalog record explaining away non-skills under `skills/`. The re-homing decision should also settle whether runtime homes get their **own top-level component identity** (e.g., a "governed runtime" component with one record covering all four) instead of four scattered homes.

## 4b. Sol review dispositions (2026-09-03, reviews/agentic-development-system/sol-cutover-structuring-prune-review.md)

- **Q1 — O2 adopted with a BLOCKER correction**: the re-homed runtime homes are recorded under their **actual parents** (`core/adapters/as-is.md`, `tools/as-is.md`), never as `skills/as-is.md` children; `skills/as-is.md` may cross-reference them in an ownership/runtime-support table only. The catalog classification table is the authoritative capability classification; container records/diagrams keep exactly their physical children; the containers must state plainly they are storage namespaces, not capability classes.
- **Q2 — launcher renamed**: `core/adapters/pi/` (the whole home moves together: launcher scripts, worker-tools registration boundary, package + node_modules). `tools/backlog-query` and `tools/mermaid-renderer` accepted; `tools/as-is-validators` accepted with the parent `tools` record explicitly covering repository validation utilities.
- **Q3 — prune keep-list tightened**: retained cited reviews are kept individually (no wholesale `reviews/` prune); `temp/benchmarking/cost-wall-clock-comparison.md` is cited by the advancement record — disposition required before any `temp/` prune; **BLOCKER**: full reference sweep of retained records before any bulk prune; retained records must name the evidence tag/commit explicitly ("recoverable forever" qualified to tag+SHA reachability).
- **Q4 — coverage check scoped to component boundaries**: declared-vs-discovered comparison at approved component boundaries (not every nested implementation directory); `lstat` for symlinks with escape rejection; `node_modules` under `skills/` is a failure after the re-home; explicit reviewed allowlist for generated locations; unrecognized direct children of declared namespaces fail.

## 4c. Pi runtime: bun-preferred (user push-back adopted, verified 2026-09-03)

The user challenged the node-for-pi status quo ("if bun could work we should be using bun"). Empirical re-test on bun 1.3.14: pi 0.84.4 passes the version probe AND a full real session with the extension shim chain and a live model call under bun — the F8-era "bundled undici API gap" does not reproduce (bun node-compat improved since the F8 finding). Decision: **pi invocations prefer the bun runtime**; node remains only as automatic fallback when no bun binary is resolvable. Implementation: `resolvePi` wraps JS entries (skill-local/explicit cli.js) as `bun <entry>` using `process.execPath` (the bun running the launcher itself), and the package fallback restores `--bun`; non-JS explicit binaries run as-is. Version-contract probe unchanged (exact 0.84.4). This is a post-benchmark harness delta for the F9 candidate arm (which ran node) — disclosed, smoke-validated, workflow behavior unaffected (the runtime is below the workflow; model route identical).

## 5. Prune approach (A3, on the branch, pre-merge)

1. Tag the branch tip: `adoption-evidence-full` (immutable snapshot of the complete evidence tree; deleted bulk recoverable by SHA forever).
2. **Keep in-tree** (records of record): `candidate/advancement-record.md`, `candidate/adoption-sequence.md`, all `candidate/benchmark/pre-registration-*.md`, `candidate/benchmark/results/*/run-manifest.json` + `scoring.md` + `scorer-output.json` + checksum files + pristine/validate logs, `candidate/evidence/f8-hollowing-migration-matrix.md` + fidelity-check scripts, `drafts/composable-skills.md` (live contract source cited by 10 SKILL.md files + the fidelity gate), `drafts/as-is.md` + the drafts tree pending the reference sweep (it is a recorded component; bulk/quarantine reduction may follow post-merge), acceptance records, changelogs, backlog, handoffs.
3. **Prune** (bulk, recoverable via tag): `candidate/benchmark/results/*/session-stores/` and `consumer-git-bundles/`, `candidate/benchmark/run/` (consumer working trees), `temp/`, stale `reviews/` trees per the reference sweep (37+ files), drafts quarantine subtree per the sweep.
4. Reference sweep of every surviving record; citations to deleted paths amended to cite the tag + commit SHA. `drafts/` citations from live SKILL.md files are a hard constraint: `composable-skills.md` stays.
5. Full gate battery re-run (agents 122, validators, content-test 69/41 + new coverage check, digest, backlog query suite, `git diff --check`).

## 6. Sequence (updated 2026-09-03: user ruled the TS re-home pre-merge)

1. **User decisions**: TS re-home pre-merge — DECIDED; structuring option O1/O2 — O2 adopted per Sol review (§4b).
2. **Sol planning consult** — DONE (`reviews/agentic-development-system/sol-cutover-structuring-prune-review.md`); dispositions in §4b.
3. **Re-home implementation** — DONE (child `runtime-rehome-pre-merge`, commit `1f9c25e`): the four moves with atomic consumer repoints (.pi extensions/prompts, 9 agent test suites, fixtures, focused-check file list, typebox import); digest unchanged; `skills/` now holds only record/nav content + `master/` + `reusable/`. Battery: launcher 83/0, agents 39 pass + 22 opt-in skip / 0 fail, validators 15/0, backlog-query 15/0 (incl. repo-wide schema walk), backlog+mermaid 17/0, dummy-delegation 4/0, content-test 69 records/41 diagrams, digest `01c9e750…`, tree clean.
4. **Structuring implementation** (component-builder child; records covering the post-move tree per §3+§4b with the care rules; coverage validator added) — NEXT.
5. **Curated prune** (A3: tag `adoption-evidence-full`, keep/prune per §5 + §4b Q3 tightenings, reference sweep BEFORE bulk deletion) — mechanical, in-session where possible.
6. Full gates; **merge request** (human-authorized `--no-ff`); post-merge smoke.
7. Post-merge backlog (already tracked): trust hardenings (read-boundary enforcement, task-record completion guard), `audit-as-is-guidance-coverage`, adviser-agent retirement (A18 D-phase), draft-tree reduction.
