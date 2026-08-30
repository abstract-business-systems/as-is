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

- [x] Plan created by the implementer transient agent (z-ai/glm-5.3-flash): `designs/agentic-development-system-skill-fidelity-pilot-plan.md` (119 lines; cost ~$0.0004). (Raw authoring-session log intentionally not retained; plan + review reports carry the durable facts.)
- [x] Internal review (planning-adviser, openai/gpt-5.6-sol, cost ~$0.056): **FAIL — revision required.** Gate 3 (terminal stop conditions) PASS; gates 1, 2, 4, 5, 6 FAIL. Report: `candidate/evidence/skill-fidelity-pilot-plan-internal-review.md`.
- [x] External challenge (external-adviser, moonshotai/kimi-k3, cost ~$0.048): **AGREE with FAIL**, corrections 1–11 and 13 endorsed, correction 12 narrowed (completion claims limited to candidate fidelity, no consumer-finding obligation), plus additional required corrections: reversal-history linkage + benchmark condition, executing-role and authority statement, description-field semantic check. Gate 4 remedy relaxed to bounded scenario walk-throughs (not an execution harness) and isolation remedy to a recorded reproducible method. Report: `candidate/evidence/skill-fidelity-pilot-plan-external-challenge.md`.
- [x] Apply the consolidated correction set to the plan (next stage, after commit). — DONE: implementer revised the plan itself (commit `72df810`), applied 4 further corrections from a fresh internal review (`3c7fc80`), and recorded verdicts at `candidate/evidence/skill-fidelity-pilot-plan-revision-verification.md`.
- [x] Implementer self-orchestrated the verification chain (no human relay): internal review (planning-adviser) initial FAIL on 4 gates — implementer verified and applied all 4 corrections itself; external challenge (external-adviser) independently PASSED the corrected plan. Verdicts at `candidate/evidence/skill-fidelity-pilot-plan-revision-verification.md`; integrated into this branch by fast-forward to `890c2d7`.
- [x] Present corrected plan to the user; record user acceptance BEFORE implementation (gate §4). — DONE: user reviewed the plan and accepted it for the first slice ("The plan looks good for the first slice"). Implementation of the two pilot skills is authorized to begin after compaction, under the plan's gates (independent per-skill implementation and testing, candidate-local evidence, completion claims limited to candidate fidelity).
- [ ] NEW (user direction): author a full-flow realization plan covering the ENTIRE flow through benchmarking (all skills, agents, compositions, benchmark) — same discipline: implementer-authored, verified via internal reviewer + external challenge, user-accepted before any of that implementation starts. The first-slice pilot proceeds in parallel as the fidelity-test bed for the process. — PLAN AUTHORED AND VERIFIED: `designs/agentic-development-system-full-flow-realization-plan.md` (implementer-authored; internal review FAIL→8 corrections applied; external challenge PASS WITH REQUIRED CORRECTIONS, all applied). Evidence: `candidate/evidence/full-flow-plan-{internal-review,external-challenge,verification-summary}.md`. User acceptance of the verified plan is pending and must be recorded before implementation.
- [ ] Process note: launcher hard-rejects empty `tools:` declarations (unlike the o dt prototype's parser), so reviewer advisers carry read-only tool access (commit `4c29e03`) — consistent with the user's standing direction that agents need tools to converse/consult; the implementer remains the sole invoking agent (o dt pattern). Untracked-file cleanup: raw authoring-session log dropped; plan + review reports retained.
- [ ] Process note (resolved this stage): the child could not resolve the `external-adviser` subagent role from its isolated worktree (`canonical agent role not found`) because the candidate roster is uncommitted; the orchestrator relayed the internal findings to the external-adviser. Once the roster is committed, children resolve candidate roles directly. The orchestrator relay constitutes the completed independent challenge per the external report's own statement.

## 8. Pilot implementation record (stage 2 complete)

- [x] User acceptance recorded before implementation (section 7, gate §4); plan status wording updated in commit `d233510`.
- [x] `applying-bounded-edits` realized (worker attempt, commit `d560cd1`), fidelity protocol PASS (16/16 static checks; both behavioral scenarios PASS; 1,114 chars); evidence: `candidate/evidence/skill-fidelity-pilot-applying-bounded-edits-{checks,scenarios,side-by-side}.md`.
- [x] `choosing-change-methods` realized (worker attempt, commit `9822c09`), fidelity protocol PASS (14/14 static checks; all three behavioral scenarios PASS; 1,726 chars); evidence: `candidate/evidence/skill-fidelity-pilot-choosing-change-methods-{checks,scenarios,side-by-side}.md`.
- [x] Consolidated execution record with residual risks and deviations: `candidate/evidence/skill-fidelity-pilot-execution-record.md`. Claims limited to candidate fidelity; side-by-side documents await the user's clause-by-clause review.
- [x] Orchestrator spot-check of the implementer's claims (independent, not self-attested): Mermaid blocks of both skills diff-verified byte-equal against draft lines 362–371 / 677–686; character counts confirmed (1,114 / 1,726); clauses verbatim against the cited draft lines. Integrated by fast-forward to `19fce08`.

## 9. Full-flow plan record (stage 3 — awaiting user acceptance)

- [x] Full-flow plan authored by the implementer and verified through its own chain: internal review FAIL → 8 corrections applied; external challenge PASS WITH REQUIRED CORRECTIONS → 8 further findings, all applied. Final plan: `designs/agentic-development-system-full-flow-realization-plan.md` (269 lines, HEAD `500a6e2`). Evidence: `candidate/evidence/full-flow-plan-{internal-review,external-challenge,verification-summary}.md`.
- [x] **User acceptance recorded** ("Looks good", session after compaction checkpoint `f290dfa`): the verified full-flow plan is accepted with the presented defaults — (2) 24-skill catalog; (3) 12 skills-draft masters; (4) working names `as-is-orchestrator` / `design-prototyper` (naming review waived); (5) benchmark pre-registration still requires its own recorded acceptance before execution; (6) adoption decisions excluded from this flow. **Stages 1–3 are authorized.**
- [ ] Side-by-side human review of the two pilot skills (stage 2 evidence) remains open for the user's clause-by-clause adjudication of flagged interpretive additions.
- [x] **Stages 1–3 complete** (HEAD `78e9879`, tree clean): 22/22 reusable skills (stage 1, `030a432..6777536`, zero failed worker attempts, orchestrator spot-checked writing-code/presenting-decisions — clauses verbatim, Mermaid byte-equal); 6/6 target agents (stage 2, `16522a2..af5bed5`, per-agent walk-throughs incl. target-design 10.3–10.6 stops; thinking-companion/worker excluded and admission control a checklist step per plan dispositions); 12/12 masters (stage 3, incl. composition-fidelity checks and 14 end-to-end walk-throughs, `..49db213`). Execution records: `candidate/evidence/full-flow-stage{1,2,3}-execution-record.md`.
- [x] **Stage 4 pre-registration complete** (`candidate/benchmark/pre-registration.md` @ `78e9879`): pins baseline `master@9a77e37` vs candidate `49db213`, seed + feature request @ `ec7b5d0`, identical settings/budgets (≤$2.00/3600s per arm), nine-dimension rubric 0–27 with safety-critical FAIL gate, no automatic advancement. **No execution performed** — all field values flagged as plan/user decisions; every design element pointered to target-design §13.
- [ ] **Gate 5 (user decision): record user acceptance of the benchmark pre-registration before execution.** Execution will: verify pinned state (no candidate drift from `49db213`) → two isolated consumer dirs from seed → run both arms identically → score per rubric → classify → record results → present. Advancement stays a separate human decision.
- [ ] Open flags for human adjudication (accumulated, recorded in side-by-side evidence, never normalized): terminal-stop clarifier inconsistency (pilot pilot-style additions vs verbatim stops); description fit-phrase style variance; heading-level variance; masters named in composition "Preferred reusable skills" tables (draft anomaly); building-components' two overlapping-but-distinct compositions; thin-master residual-risk class; working names `as-is-orchestrator`/`design-prototyper`.
