# Agentic Development System — Continuity Checklist

Purpose: Itemized verification checklist for the agentic-development-system realization. Reset on user direction after the previously reported candidate realization was removed as unfaithful to its source design.

## Design-context authority rule

- Design specs come exclusively from documents inside `drafts/`. Documents outside `drafts/` (implementation plans, review reports, derived summaries) are process provenance and must not be consulted as design context.
- Per-skill guidance (procedures, contracts, checks, escalation, refactoring and change-method rules) is authoritative only as written in the per-skill sections of `drafts/composable-skills.md` — never as re-summarized in plans, task files, or checklists.
- Verification of each realized skill must diff its behavior against the source draft's per-skill contract (Input / Output / Checks / Escalate) before any completion claim is recorded. A checked box without that diff evidence is invalid.

## 1. Review-gate history (events occurred; provenance only)

- [x] High-level design envelope (Draft 11) human-accepted; packet digest `8601188128ed2fff4aa64f75f339f7962e88358806f470643aa8455f565665e2`.
- [x] Planning Adviser and External Adviser review of the implementation plan occurred; dispositions recorded in commit `69aed16`.
- [x] Candidate implementation (execution-control kernel, 24 reusable skill stubs, 12 master composition stubs, Section 13 benchmark, 77/77 tests) was created and committed as `c647a35`.

## 2. Candidate realization reversal

- [x] Diagnosed: skills were synthetic TypeScript stubs not faithful to `drafts/composable-skills.md` per-skill contracts; the handoff recorded completion claims rather than design fidelity; tests validated the plan's schema, not the draft's contracts.
- [x] `candidate/` implementation removed via `git rm -r candidate/` (staged; recoverable at commit `c647a35`).
- [x] Design-context authority rule recorded: only documents inside `drafts/` may be consulted as design context.
- [ ] **Alignment with user on the implementation path — BLOCKING. Nothing proceeds before this.**

## 3. Pending re-implementation (not started)

- [ ] Confirm with the user the target artifact set and implementation path before any realization work.
- [ ] Verify each realized skill against its source-draft contract before recording completion.
- [ ] Re-establish benchmark protocol only after re-aligned implementation exists.

## 4. Required process gates for the next plan

- [ ] Plan authored from `drafts/` context only; every plan item links its exact source section in `drafts/` (items without a source link are flagged, not implemented).
- [ ] Plan references draft sections rather than restating them; summaries are pointers, never substitutes for a contract.
- [ ] Plan explicitly specifies that each skill's completion = behavior diffed against the draft's Input/Output/Checks/Escalate contract.
- [ ] Plan verified by the plan-reviewer (read-only, against `drafts/` only) before human acceptance.
- [ ] User acceptance of the verified plan recorded before any implementation starts.

## 5. Realization discipline (user direction)

- [ ] Every agent is implemented and tested independently: one agent per bounded unit, its own contract and tests, verified against its source-draft role definition before any composition consumes it.
- [ ] Every skill is implemented and tested independently: one skill per bounded unit, tested against its own source-draft contract (Input/Output/Checks/Escalate) in isolation before any master composition references it.
- [ ] Master compositions are realized only after their referenced reusable skills and agents have independently passed verification.
- [ ] Agent roles are followed as defined in the applicable agent definitions: role authority, tool boundaries, and task ownership are respected in both planning and implementation; a role's completion claims are evidence-backed per the design-context authority rule above.
