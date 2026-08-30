# Agentic Development System — Continuity Checklist

Purpose: Itemized verification checklist for the agentic-development-system realization. Reset on user direction after the previously reported candidate realization was removed as unfaithful to its source design.

## Design-context authority rule

- Design specs come exclusively from documents inside `drafts/`. Documents outside `drafts/` (implementation plans, review reports, derived summaries) are process provenance and must not be consulted as design context.
- Per-skill guidance (procedures, contracts, checks, escalation, refactoring and change-method rules) is authoritative only as written in the per-skill sections of `drafts/composable-skills.md` — never as re-summarized in plans, task files, or checklists.
- Verification of each realized skill must diff its behavior against the source draft's per-skill contract (the draft's own contract sections: Purpose / Approach / How it should be done / Design view — not a substitute schema from summaries) before any completion claim is recorded. A checked box without that diff evidence is invalid.

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
- [ ] Plan created by the implementer transient agent (not authored by the orchestrating session), then verified: internal reviewer (planning-adviser) submits findings to the external-adviser for independent challenge; consolidated verification presented to the user for acceptance before implementation starts.
- [ ] Plan references draft sections rather than restating them; summaries are pointers, never substitutes for a contract.
- [ ] Plan explicitly specifies that each skill's completion = behavior diffed against the draft's contract (Purpose / Approach / How it should be done / Design view).
- [ ] Plan verified by the plan-reviewer (read-only, against `drafts/` only) before human acceptance.
- [ ] User acceptance of the verified plan recorded before any implementation starts.

## 5. Realization discipline (user direction)

- [ ] Every agent is implemented and tested independently: one agent per bounded unit, its own contract and tests, verified against its source-draft role definition before any composition consumes it.
- [ ] Every skill is implemented and tested independently: one skill per bounded unit, tested against its own source-draft contract (Purpose / Approach / How it should be done / Design view) in isolation before any master composition references it.
- [ ] Master compositions are realized only after their referenced reusable skills and agents have independently passed verification.
- [ ] Agent roles are followed as defined in the applicable agent definitions: role authority, tool boundaries, and task ownership are respected in both planning and implementation; a role's completion claims are evidence-backed per the design-context authority rule above.

## 6. Transient implementation-flow agent set (user direction)

- [ ] Create fresh candidate agent definitions (o dt pattern: small `agent.md` files + model-alias config) under `candidate/agents/`: `implementer` (z-ai/glm-5.3-flash, full tool set), `worker` (z-ai/glm-5.3-flash, no bash — authors artifacts only), `planning-adviser` (openai/gpt-5.6-sol, advisory only), `external-adviser` (moonshotai/kimi-k3, advisory only). GLM 5.3 flash is used for the implementer too (user decision, cost saving).
- [ ] These transient agents exist to complete the implementation through benchmarking at minimal cost; they are construction roles, not the draft-11 target roster. Implementer→worker delegation exists for context isolation and cache-bloat management; all agents declare subagent conversation capability.
- [ ] Existing repository agents, skills, and reviews are not invoked or consulted; the transient set is created fresh in the isolated candidate namespace.
- [ ] Flow until benchmarking: implementer creates the plan → verification chain (planning-adviser internal review submitting to external-adviser independent challenge) → user acceptance summary → compaction checkpoint → commit → continue implementation.

## 7. Pilot plan verification record (stage 1 complete)

- [x] Plan created by the implementer transient agent (z-ai/glm-5.3-flash): `designs/agentic-development-system-skill-fidelity-pilot-plan.md` (119 lines; cost ~$0.0004). Evidence: `candidate/evidence/skill-fidelity-pilot-plan-authoring-session.log`.
- [x] Internal review (planning-adviser, openai/gpt-5.6-sol, cost ~$0.056): **FAIL — revision required.** Gate 3 (terminal stop conditions) PASS; gates 1, 2, 4, 5, 6 FAIL. Report: `candidate/evidence/skill-fidelity-pilot-plan-internal-review.md`.
- [x] External challenge (external-adviser, moonshotai/kimi-k3, cost ~$0.048): **AGREE with FAIL**, corrections 1–11 and 13 endorsed, correction 12 narrowed (completion claims limited to candidate fidelity, no consumer-finding obligation), plus additional required corrections: reversal-history linkage + benchmark condition, executing-role and authority statement, description-field semantic check. Gate 4 remedy relaxed to bounded scenario walk-throughs (not an execution harness) and isolation remedy to a recorded reproducible method. Report: `candidate/evidence/skill-fidelity-pilot-plan-external-challenge.md`.
- [ ] Apply the consolidated correction set to the plan (next stage, after commit).
- [ ] Present corrected plan to the user; record user acceptance BEFORE implementation (gate §4).
- [ ] Process note (resolved this stage): the child could not resolve the `external-adviser` subagent role from its isolated worktree (`canonical agent role not found`) because the candidate roster is uncommitted; the orchestrator relayed the internal findings to the external-adviser. Once the roster is committed, children resolve candidate roles directly. The orchestrator relay constitutes the completed independent challenge per the external report's own statement.
