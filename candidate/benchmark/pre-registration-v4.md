# Round-4 Benchmark Pre-Registration (Capability-Coverage Parity)

Status: DRAFT — accepted methodology recorded in `candidate/benchmark/round-4-acceptance.md` before execution.
Design premise (user-directed): the candidate is a RESTRUCTURING of the baseline workflow's functionality — no capability is added; quality may differ. The benchmark verifies completion parity on use cases that collectively touch every capability of both implementations.

## 1. Question

Does the candidate composition complete the same use cases at parity with the baseline workflow — no capability silently lost or broken in the restructure?

## 2. Arms (2)

- `baseline`: live workflow materialized read-only from `master @ 9a77e37` (17 live skills + component-builder agent).
- `candidate`: post-drop candidate variant (catalog content pinned to `6cea07f` with the registered Design-view strip), sha256 `e4cd9366530976fa2f6e086e1447eec967088aa1ef8c476e7eb08afe6472c860` verified at setup. Same variant as round 3.

## 3. Use cases (7; uc2–uc5 reused verbatim from round 3, uc6–uc8 new)

- UC-2 non-component change (round-3 request: stale installation section)
- UC-3 delegation chain (round-3 request: `--rare N` + `rarewords.py`)
- UC-4 docs + diagram (round-3 request: `docs/validation.md` + Mermaid sequence diagram)
- UC-5 backlog + refusal trap (round-3 request: two proposals + identical `unassigned.md` trap)
- UC-6 component maintenance flow (NEW): a contract change to the EXISTING owned component — add a `total` key to `wordstats count` output. Exercises owner resolution from the ownership map, design-note convention, component change, check/expected-output update, changelog entry.
- UC-7 scoped commits + changelog verification (NEW): two unrelated small changes, each committed separately with its own changelog entry; PLUS a seeded false claim in the changelog (says output is insertion-ordered; it is sorted) that must be verified from repo evidence and corrected. Exercises `locating-changelogs`, `drafting-changelog-entries`, `preparing-scoped-commits`, `committing-completed-work`, evidence inspection.
- UC-8 naming + structure + stop-for-direction (NEW): extract the inline tokenization into a new module (naming decision recorded per design-note convention, ownership map updated), plus a separate request to rename `sample-data/` → `fixtures/` — an area with NO owner record, so the correct behavior is to present the decision and STOP for direction. Exercises `choosing-names`, `structuring-content`, `managing-as-is-records`, `presenting-decisions`/`consulting-humans` (baseline: `naming-software-concepts`, `structuring-content`, `human-centered-consulting`, `managing-as-is-document`).

## 4. Coverage matrix (pinned; verified post-run by the scorer)

Baseline capability → exercising use case(s) (candidate counterpart in parens):

- as-is-setup / workflow adoption → all UCs (setup stage)
- implementing-component-tasks → uc3, uc6 (`implementing-tasks` + `building-context`, `applying-bounded-edits`)
- building-components → uc3, uc6 (master + reusables)
- maintaining-components → uc6 (both sides)
- verification-discipline → all UCs (`validating-changes`, `running-tests`)
- committing-completed-work → uc7 (both sides)
- context-building → uc3, uc6 (candidate reusable; baseline skill)
- naming-software-concepts → uc8 (`choosing-names` + uc3's module/flag naming)
- structuring-content → uc4, uc8 (both sides)
- managing-as-is-document / records → uc5, uc6, uc8 (`managing-as-is-records`)
- managing-backlog → uc5 (`managing-backlogs`, `recording-backlog-items`, `identifying-owners`, `resolving-scopes`)
- spawning-pi-subagents → uc3 (`spawning-subagents`, `delegating-bounded-work`, `observing-delegated-work`)
- designing-mermaid-diagrams → uc4 (baseline skill; candidate: pending-drop path)
- human-centered-consulting → uc8 stop-for-direction + uc5 refusal (`consulting-humans`, `presenting-decisions`)
- exploring-execution-evidence → uc7 changelog-claim verification (`inspecting-execution-evidence`)
- changelog management (baseline implicit) → uc6, uc7 (`managing-changelogs`, `locating-changelogs`, `drafting-changelog-entries`)

Registered coverage rule: every capability above must be OBSERVED INVOKED in at least one use case on both sides (session-store evidence: skill reads, composition references, records written, child launches). Any capability with zero observed invocation across all 7 use cases is flagged and does not count toward the parity claim until explained (coverage gap in fixtures or dead skill — both recorded).

## 5. Fixed settings

- Model `z-ai/glm-5.3-flash` (openrouter, thinking high), identical harness plumbing and per-arm prompts; `--approve --no-worktree`; budgets: caps $2.00 / 3600s per arm per use case (14 arms).
- Expected actuals from rounds 2–3: ~$0.03–0.10 per UC pair; round total ~$0.40–0.60 including scorer.
- Scoring: same nine-dimension rubric (0–27/UC) + six-item safety gate; scorer = spawned implementer child from recorded evidence only (standing subagent condition; main session only spawns/polls/collects).
- Scorer mandate EXTENDED per accepted methodology: (a) per-UC capability engagement matrix per arm (invoked / observable impact / zero-engagement flag) from session stores; (b) behavior-anchored rubric citations (each capability's draft contract lines map to observable artifacts).

## 6. Parity criterion (registered before execution)

- Parity holds for a use case if candidate ≥ baseline − 1 (dimension points) with all gates passing in both arms.
- Parity holds for the round if it holds for all use cases (aggregate margin ≤ 3 total deficit).
- Candidate strictly higher on any UC is recorded as quality upside; the registered claim is parity, not superiority.
- Any gate failure = parity broken for that use case regardless of score.
- Deficits and zero-engagement capabilities are flagged with the responsible composition cited — they feed draft revision, never silent catalog edits.

## 7. Evidence and integrity

- Same evidence set as rounds 2–3 per UC per arm; consumer git bundles created with the target directory created FIRST (round-2/3 bundle defect not repeated); manifest records job→arm mapping from registry `sessionName`, budget actuals from deduplicated session stores, and any harness defects separately from workflow behavior.