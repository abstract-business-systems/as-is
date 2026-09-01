# Adoption Flow Plan — Draft 1 (composable-skills composition)

Status: DRAFT — planning context only. It is not approved design, task authority, or implementation authority. Approval is a human decision.

## 1. Purpose

Plan the adoption of the advanced candidate composition (ACCEPTED-TARGET, `candidate/advancement-record.md`) into the consuming project as the live workflow of record, replacing the baseline workflow, per the user's sequencing decision in `candidate/adoption-sequence.md`: preparation entirely on branch `implementing-composable-skills`, per-family atomic swaps, pre-merge validation, and a single `--no-ff` merge into master as the cutover of record.

## 2. Inputs and authority

- `candidate/advancement-record.md` — advanced scope: 23 reusable + 12 master skills (digest `9f8dbdcb…`), launch/benchmark methodology; disposition table for all 17 baseline skills.
- `candidate/adoption-sequence.md` — decided mechanics: side-by-side preparation, family swaps, single merge cutover, squash rejected.
- `drafts/composable-skills.md` — design authority for the composition (post-drop revision note applied).
- Baseline of record: master `9a77e37` (must not advance before the cutover merge).
- Out of scope: `core/` contracts (remain the unmodified bootstrap baseline; their migration is a separate future flow), the quarantined superseded draft sets, and benchmark registration history (already closed).

## 3. Scope boundary

Adoption covers the consuming project's workflow surface only: `skills/`, `agents/`, `.pi/settings.json` skill mounting, `AGENTS.md` and root `as-is.md`/`backlog.md` references, and validation fixtures that reference them. It does not move `candidate/benchmark/` evidence, does not modify `core/`, and does not touch `temp/`.

## 4. Open design decisions (require human or adviser adjudication before freeze)

- **D1 — record form for adopted skills.** Baseline skills carry a per-skill `as-is.md` record plus a parent catalog (`skills/as-is.md`). Candidate skills carry only the four-part `SKILL.md` brief (Purpose / Approach / How it should be done / Composition context), which the post-drop design intends as the durable record. Options: (a) treat `SKILL.md` as the adopted record and update `skills/as-is.md` catalog to point at SKILL.md files (smallest, matches design intent); (b) generate per-skill `as-is.md` stubs (convention-consistent, duplicates content). Plan leans (a).
- **D2 — live agent roster.** Three sets exist: baseline `agents/` (8, live), transient benchmark set `candidate/agents/` (implementer, worker, planning-adviser, external-adviser — note in candidate/agents/target/config.json marks these as construction artifacts, not the live roster), and the designed target roster `candidate/agents/target/` (as-is-orchestrator, component-builder, evidence-validator, execution-advisor, expert, design-prototyper). The adoption plan must pick the live roster. Plan leans: target roster becomes live; transient benchmark agents retire with the benchmark phase; baseline-only agents (`thinking-companion`, `agent-capability-probe`) retire by recorded disposition. Model aliases are replaceable implementation choices per target design.
- **D3 — TS composition layer.** `candidate/skills/compositions/*.ts`, `registry.ts`, `runner.ts`, and `candidate/tests/skills/` are benchmark-construction artifacts. Decide whether they migrate to live positions (as catalog build tooling), stay under `candidate/`, or retire after adoption. Plan leans: migrate as build tooling only if a consumer exists at cutover; otherwise retire with results preserved.

## 5. Family sequence (each step = one atomic commit on the branch)

Order rationale: infrastructure first; knowledge and review families before the launcher-critical delegation family; delegation family validated with a live probe; cutover last. The candidate counterpart is introduced in its live position and the baseline counterpart retired in the same commit, with all proven-reference updates (`AGENTS.md`, `skills/as-is.md`, `.pi/settings.json`, core-contract references where they name skills, validation fixtures) atomically included.

1. **F0 — foundations**: live positions for the adopted catalog (`skills/reusable/`, `skills/master/` per D1), `.pi/settings.json` re-mounted to candidate session skills, catalog digest pinned. No baseline retirement yet (side-by-side).
2. **F1 — setup/adoption family**: `as-is-setup` + function-absorbed `integrate-as-is-documentation` → candidate setup flow + `managing-as-is-records` (disposition: absorbed; recorded rationale, no skill ported).
3. **F2 — knowledge family**: `context-building`→`building-context`; `structuring-content` direct; `naming-software-concepts` direct; content/evidence drafting (`drafting-content`, `recording-evidence`, changelog trio `locating-changelogs`/`drafting-changelog-entries`/`managing-changelogs`).
4. **F3 — review/consulting family**: `human-centered-consulting`→`consulting-humans` + `presenting-decisions` + `identifying-owners`.
5. **F4 — change-execution family**: `implementing-component-tasks`→`implementing-tasks` + `applying-bounded-edits` + `building-context`; `making-changes` + `writing-code`/`writing-tests`/`validating-changes`/`running-tests`/`choosing-change-methods`/`resolving-scopes`; `verification-discipline`→trio; `committing-completed-work`→`preparing-scoped-commits` + changelog trio; `building-components`→master + reusables.
6. **F5 — records/backlog family**: `managing-as-is-document`→`managing-as-is-records`; `managing-backlog`→`managing-backlogs` + `recording-backlog-items` + `identifying-owners` + `resolving-scopes`; `deterministic-skills`→`assessing-determinism`; `maintaining-components` direct; `designing-mermaid-diagrams` direct.
7. **F6 — delegation family (highest risk)**: `spawning-pi-subagents`→`spawning-subagents` + `delegating-bounded-work` + `observing-delegated-work`. Gate: live launcher smoke test through the adopted agent roster (the round-1 launch-probe race lesson applies; verify `tools:` declarations non-empty per standing policy).
8. **F7 — evidence family**: `exploring-execution-evidence`→`inspecting-execution-evidence` + `recording-evidence` (master counterpart also lands).
9. **F8 — agents**: live roster installed per D2; baseline agent directories retired in the same commit; agent `as-is.md`/`backlog.md` records reconciled.
10. **F9 — cutover**: retire remaining baseline scaffolding, final `skills/as-is.md` catalog rewrite to the adopted set, root `AGENTS.md`/backlog reference sweep, fidelity checks green at live paths; this is the pre-merge validated state.

## 6. Validation gates

- Per family: reference sweep grep proves zero dangling references to retired names; any existing tests/fixture consumers pass; catalog digest re-verified after any content touch.
- F6-specific: one live bounded subagent spawn through the adopted roster before the family commit.
- Pre-merge: fidelity checks (442+32 shape) green at live positions; one real task executed end-to-end through the adopted workflow on the branch; `git status` clean; master still at `9a77e37`.
- Cutover: single `--no-ff` merge into master; post-merge smoke check; single-merge revert is the rollback path.

## 7. Human gates

1. Plan approval (this draft, after review/freeze) — authorizes design promotion (update `skills/as-is.md` and affected records as approved design) and derives the per-family backlog items.
2. D1/D2/D3 adjudication — may ride the plan approval.
3. Family execution — batched selection acceptable once F0–F2 land clean; F6 and F9 individually confirmed.
4. Merge to master — human-authorized per `adoption-sequence.md`.

## 8. Non-goals

No `core/` contract migration; no quarantined-draft cleanup; no benchmark rerun; no advancement re-litigation; no master advancement before the validated cutover.