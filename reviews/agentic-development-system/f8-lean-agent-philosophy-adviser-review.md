# F8 Lean-Agent Philosophy Gate — Planning-Adviser Review (verbatim)

- Date: 2026-09-02
- Job: `j-mtknrjyp-3ryvzi` (task: f8-lean-agent-philosophy-adviser-r2; first attempt `j-mtknnyfc-yakqg2` died to upstream openrouter rate limits), local session `fb99f19b-a9f5-458e-82ae-6a92707cced9`
- Agent: `candidate/agents/planning-adviser/agent.md` (openai/gpt-5.6-sol), thinking high, budget $1.50 / 900s (used ~111s wall)
- Human-stated context: "The idea of having lean agents in the candidate is to use them only for role restrictions (tools primarily) and have the flow controlled by the skills."
- Task: adjudicate whether that lean-agent philosophy changes the proposed F8 Option A (live realized contracts authoritative) vs Option B (literal stub install), and set gates
- Verdict: **HOLD** — adopt treatment (b) behavior-preserving slimming; no F8 commit until the exact slimmed contract diffs are approved and per-changed-role live validation (opt-in) is completed
- Note: `temp/f8-agent-roster-explainer.md` was unavailable in the adviser's isolated worktree (gitignored temp file); the adjudication relied on the task's verified established facts, which the review below presupposes.

---

### Q1 — Existing live contracts

**Verdict:** F8 Option A, unchanged, conflicts with the stated lean-agent philosophy where it duplicates workflow already owned by skills.

Use **treatment (b): behavior-preserving slimming**:

- Retain exact role purpose, authority boundaries, prohibited actions, stop conditions, and reporting obligations that cannot be enforced by frontmatter.
- Retain launcher-effective `mode`, `tools`, and `permission` declarations; use the admission matrix to justify each capability and narrow unnecessary capabilities only as an explicitly validated behavioral change.
- Replace detailed procedural flow with concise references to the adopted skills.
- Preserve current component-builder ownership and integration semantics. Do **not** adopt the target stub’s proposed parent-planner behavior without separate acceptance and validation.
- Preserve runnable model aliases unless replacement configuration is independently verified.

Treatment (a) is acceptable only as an explicitly temporary, behavior-preserving exception with lean conversion deferred. It does not fully realize the human’s philosophy. Treatment (c) is unsuitable: literal stubs would introduce under-specified permissions/modes, omit capabilities needed by current skill paths, and—in component-builder’s case—adopt a change its own stub says must remain unaccepted.

### Q2 — Design-prototyper

**Verdict:** Use a lean contract, not live-convention procedural richness.

Minimum viable contract:

- `mode: subagent`
- Exact least-privilege tools—initially the stub’s read-only set
- `permission.task: deny`, `webfetch: deny`, and `websearch: deny`
- Concise role purpose and the non-frontmatter restrictions: proposal-only, cannot accept its own design, cannot authorize implementation, and must stop on missing authority
- A concise reference to the applicable design/drafting/decision skills rather than an embedded workflow
- A bounded reporting contract

If repository artifact mutation is actually required, that is a separate capability decision; the admission matrix must expose the gap rather than silently adding `edit` or `write`.

### Q3 — Validation scope

**Verdict:** Correct as a **roster/admission baseline**, but insufficient if treatment (b) changes agent prompts.

Keep:

- Deterministic tool-admission matrix
- Positive and denied/missing-capability cases per role
- Fresh-discovery launcher smoke
- One bounded live D2-role probe

However, `agents/AGENTS.md` makes applicable live behavioral tests blocking for every behaviorally changed role. They cannot merely be recorded as residual risk. For each slimmed role, run its smallest deterministic test and its opted-in live behavioral test. For design-prototyper—and any changed role lacking such a test—add or request a bounded test before claiming live validation. Explicit human opt-in is required before provider-backed execution.

The single probe remains useful for roster integration but does not substitute for changed-role behavioral validation.

### Q4 — Ancillary items

**Verdict:** Confirmed, with reference-sweep conditions.

- Retire the transient worker atomically with its live references, after checking consumers and preserving benchmark/audit evidence.
- Keep `agents/as-is/` as the current orchestrator home, provided records explicitly map it to the provisional D2 orchestrator role, no duplicate `as-is-orchestrator` installation is created, and naming review is recorded in the agents backlog.
- Create distinct backlog revisit items for `thinking-companion` and `agent-capability-probe`.
- Reconcile `agents/as-is.md`, diagrams, tests, and launcher/discovery fixtures with the realized roster.

### Q5 — Additional gates and residual risk

Before the F8 commit:

1. Approve the exact slimmed contract diffs; the lean philosophy alone does not approve accidental authority changes.
2. Prove component-builder’s current authority and integration behavior remain intact.
3. Complete applicable deterministic and explicitly opted-in live behavioral validation.
4. Verify fresh discovery, exact tool forwarding, permission enforcement, denied cases, evidence-validator’s launcher-fixed profile, and declarative `call_subagent` registration.
5. Prove zero dangling live references or duplicate roster identities after retirement.
6. Verify installed model aliases resolve in the live configuration.
7. Record any untested provider nondeterminism as residual risk only after all required opted-in tests have actually run.

The requested `temp/f8-agent-roster-explainer.md` was unavailable in this worktree; this adjudication relies on the supplied established facts and the other named contracts.

**HOLD — adopt treatment (b), but do not commit F8 until the exact behavior-preserving lean contracts and required per-changed-role live validation are approved and completed.**
