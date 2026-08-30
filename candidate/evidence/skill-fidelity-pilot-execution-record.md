# Skill-fidelity pilot — execution record (stage 2)

Pilot: `designs/agentic-development-system-skill-fidelity-pilot-plan.md` (authoritative for this execution). This record consolidates the pilot implementation results; claims are limited to candidate fidelity — no promotion and no live-catalog claims (plan sections 8-9).

## Acceptance event (plan sections 1 and 8)

- Recorded user acceptance preceding implementation: 2026-08-30, the user reviewed the verified plan and accepted it for the first slice ("The plan looks good for the first slice"), authorizing implementation of the two pilot skills. Recorded in `handoffs/agentic-development-system-continuity-checklist.md` section 7. The plan's section 1 status wording was updated from "User acceptance is pending" to the recorded-acceptance statement in commit `d233510`; acceptance is a direct user statement, not inferred from reviews, transcripts, or agent reports.

## Per-skill outcomes (plan section 6 protocol)

### `applying-bounded-edits` (draft lines 352-371) — PASS, all checks

- Realized by one bounded worker attempt (launcher, `candidate/agents/worker/agent.md`, 900 s / $0.25 budget; ~$0.0005 actual); integrated and validated by the implementer. Commit `d560cd1`.
- Checks 1-8, 12 (static script `candidate/evidence/fidelity-check.sh`): **16 pass, 0 fail** — clause coverage verbatim (lines 354/356/358), exact name and directory, two-field front matter, description fit-not-permission, no reference to the other skill, Mermaid block byte-equal to draft lines 362-371, size 1,114 characters (≤ 2,000 voluntary target, draft line 132). Results: `skill-fidelity-pilot-applying-bounded-edits-checks.txt`.
- Check 9 (isolation): ephemeral fixture `candidate/evidence/fixtures/applying-bounded-edits/` contained only this skill's directory at test time; listing recorded in the checks file.
- Check 10 (behavioral walk-throughs): **both scenarios PASS** — see `skill-fidelity-pilot-applying-bounded-edits-scenarios.md`. (Scenario A's first attempt was blocked by missing fixture inputs — fixture-owner error, corrected and re-run; the stop-before-mutation discipline held in both attempts.)
- Check 11 (side-by-side): `skill-fidelity-pilot-applying-bounded-edits-side-by-side.md` — clause-by-clause draft/realization mapping for human review; two items flagged for adjudication (appended terminal-stop sentence realizing plan 5.1 interpretation 1; description's "establishes fit, not permission" phrase derived from draft line 107).

### `choosing-change-methods` (draft lines 667-686) — PASS, all checks

- Realized by one bounded worker attempt (launcher, ~$0.0005 actual); integrated and validated by the implementer. Commit `9822c09`.
- Checks 1-8, 12: **14 pass, 0 fail** — clause coverage verbatim (lines 669/671/673), exact name and directory, two-field front matter, description fit-not-permission, no path reference to the other skill (name mentions in the composition note are explicitly authorized by plan 5.2 per draft lines 100-101/165), Mermaid block byte-equal to draft lines 677-686, size 1,726 characters (≤ 2,000 voluntary target). Results: `skill-fidelity-pilot-choosing-change-methods-checks.txt`.
- Check 9 (isolation): ephemeral fixture `candidate/evidence/fixtures/choosing-change-methods/` contained only this skill's directory at test time; listing recorded in the checks file.
- Check 10 (behavioral walk-throughs): **all three scenarios PASS** — least-powerful-fitting-method selection; terminal stop on no authorized method without substitution; line-113 missing-capability blocker without weaker-tool substitution and without precluding line-673 re-selection of another authorized method. See `skill-fidelity-pilot-choosing-change-methods-scenarios.md`.
- Check 11 (side-by-side): `skill-fidelity-pilot-choosing-change-methods-side-by-side.md` — four items flagged for human adjudication (interpretive bullets realizing plan 5.2; line-113 acknowledgment; line-100-101/165 composition note; description wording).

## Claim limitation

Completion claims are limited to candidate fidelity (realized documents match the draft contracts under the plan's protocol). No repository-skill promotion, no live-catalog change, no owner or independent-consumer evidence (draft line 88's remaining promotion evidence), no benchmark (plan section 9).

## Residual risks and deviations from the plan

1. Semantic-equivalence judgment is human-reviewed through the side-by-side documents (plan check 11); the script checks verify verbatim wording and structure, not meaning. Interpretive additions (terminal-stop clarifier sentence; interpretive bullets; line-113 acknowledgment; line-148 note; description fit phrases) are traceable to the plan's interpretation tables and flagged in the side-by-side documents for human adjudication.
2. Heading levels differ between the two realizations (`###` vs `##` for contract sections); the plan prescribes only `#### Design view`. Cosmetic; flagged for review.
3. A trailing newline was added to the applying-bounded-edits file after integration (worker omitted it); content unchanged.
4. The fidelity-check script's first run produced two false FAILs (script regex matched `config:`/`layout:` inside the Mermaid block; missing trailing newline shifted the fence extraction); both were script artifacts, fixed in the script, and the recorded results are from the corrected script.
5. Walk-through scenario fixtures: applying-bounded-edits Scenario A required fixture inputs committed after the first worker attempt (commit `17b5e06`); the first attempt is recorded as blocked-by-fixture, not failed.
6. No master skill, tool-access matrix, agent change, live-catalog change, or benchmark was produced — per plan sections 3 and 9.

## What remains for human review

- Clause-by-clause review of the two side-by-side documents (checks flagged there for adjudication).
- Any subsequent adoption decision (owner, independent consumer, validation evidence per draft line 88) is out of this pilot's scope.