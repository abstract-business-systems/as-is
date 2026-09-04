# F8 Lean-Hollowing Gate — Planning-Adviser Review (verbatim)

- Date: 2026-09-03
- Job: `j-mtku0t90-rdumti` (task: f8-lean-hollowing-adviser), local session `a7eefbda-ba2f-4cd3-a57b-1f4c5ae18e93`
- Agent: `candidate/agents/planning-adviser/agent.md` (openai/gpt-5.6-sol), thinking high, budget $1.50 / 900s (used ~152s wall)
- Supersedes premise of `f8-lean-agent-philosophy-adviser-review.md` (HOLD, treatment (b)): human decisions A18 (brutal hollowing; candidate implementation route; design-prototyper deferred; lean-arm-only three-way benchmark) govern.
- Verdict: **PROCEED** — implement authorized brutal hollowing through the candidate route; F8 family commit blocked until migration, role-validation, integration, admission, and benchmark gates pass.

---

The 2026-09-02 human decisions supersede the behavior-preserving premise of the prior F8 HOLD. Brutal hollowing is authorized, subject to preserving authority and moving every still-required behavior to an effective home before deletion.

## Q1 — Minimum role-contract shells

**Verdict: APPROVE brutal hollowing with the following irreducible shell.**

“Enforceable” has two levels: frontmatter and launcher/control-plane checks provide deterministic enforcement; prose restrictions remain model-facing contract constraints. Moving prose from an agent to a skill does not make it deterministic.

Every carried contract must retain:

- Complete identity and frontmatter needed by the host: `name`, `description`, `mode`, `model`, `thinking`, `tools`, `permission`, and applicable skill references.
- Concise role purpose and scope.
- Authority allocations and prohibitions that are not enforced by frontmatter.
- Stop conditions for missing authority, scope, evidence, admission, or capability.
- Exact test-anchored phrases and interface requirements.
- A concise reference to each adopted skill that now owns the removed procedure.

Role-specific minimums:

| Role | Content that must remain |
| --- | --- |
| `as-is` | User-facing router purpose; recommendation is not authorization; `startsWork: false`; no work from inferred intent; no self-delegation, silent target substitution, or invented task authority; substantive work requires an admitted authority. |
| `component-builder` | Ownership of only the assigned component; child/parent/sibling boundary; task record and durable records outrank caller or telemetry; skills grant no authority; configured-worker/no-substitution restriction; builder retains semantic completion and integration authority; stop on missing review, budget admission, failed handoff, or unresolved integration. |
| `evidence-validator` | Read-only, caller-independent controlled-worktree scope; no mutation, shell, delegation, session, or authority; exact `focused_check` capability language required by tests; exact headings `- Finding:`, `- Evidence:`, `- Recommendation:`, `- Residual risk:`; safe-to-commit/implementation-may-begin conclusion requirement; telemetry and process exit grant no authority. |
| `execution-advisor` | Advisory-only evidence-analysis purpose; exact bounded selector required; may recommend but never approve or apply budget changes, supervise, retry, mutate, or claim completion; any extension remains `approvalRequired`; stop on missing scope, selector, attribution, or budget context. |
| `expert` | Exact phrases **“advisory and read-only”** and **“consulting-humans”**; no mutation, delegation, execution, commitment, or self-conferred authority. |
| `thinking-companion` | Exact phrases **“progressive disclosure”**, **“Preserve the person's agency”**, and **“consulting-humans”**; may not decide, execute, mutate, or create substantive artifacts without authority; any expert consultation remains bounded and read-only. |
| `agent-capability-probe` | Fixture-only/read-only purpose; only the caller-supplied literal target may be called, at most once; no substitution, second call, implementation, mutation, delegation of work, or commit. |

**Component-builder:** all detailed `Required flow` content may leave. Role-authority bullets that merely repeat launch, integration, ancestry, or closure mechanics may also leave. The declarative allocation of authority must remain: the builder—not a skill, launcher, child, or telemetry—owns semantic integration and completion.

Before hollowing, the following currently unique behavior needs an effective home:

1. `admitLaunch()`, reserve/accounting checks, normalized wall-clock forwarding, and the rule that the generic launcher does not parse task records.
2. Same-component `call_subagent` versus separately owned child-launch distinction.
3. Parent-side cherry-pick, conflict boundary, parent validation, source/result SHA recording, ancestry verification, pending-integration treatment, descendant closure, and `no-separate-integration`.
4. Attributable plan/final review and safe-to-commit gating if still required behavior.
5. `as-is` no-start/admission routing semantics—retain these as shell restrictions unless an appropriate skill owns them.
6. Execution-advisor budget-recommendation constraints—move them into the evidence/context skills while retaining the non-authority shell.
7. Thinking-companion’s bounded expert-call constraint and the probe’s exact-target/one-call constraint—retain them as capability restrictions unless deterministic launcher enforcement is added.
8. Evidence-validator’s output interface and anchored phrases must remain in the role contract because current tests and consumers inspect that contract directly.

## Q2 — Migration homes and record form

**Verdict: APPROVE the proposed homes, with a precise split.**

- `reusable/delegating-bounded-work`: child boundary, available-budget/reserve calculation, active-attempt check, handoff budget, admission request, and blocker/approval recording.
- `master/spawning-subagents`: approved adapter invocation, `admitLaunch()` result consumption, exact `--budget-wall-clock-seconds` forwarding, launch/observation/recovery behavior, and prohibition on generic launcher task-record parsing.
- Runtime/control-plane code remains the deterministic implementation of `admitLaunch()` and limit enforcement; skill prose must not be represented as runtime enforcement.
- `master/building-components`: parent integration, cherry-pick, conflict scope, parent-side validation, source/result SHAs, ancestry proof, pending-integration state, descendant closure, consolidation, and `no-separate-integration`.

Add durable provenance evidence mapping each removed pre-F8 contract clause to its new skill/runtime home and validation. Preserve the pre-F8 text and mapping in F8 evidence or owning records/changelog; a provenance comment need not burden every operational brief.

A17 already authorizes changing skill content and re-pinning the digest. No additional waiver is needed if each `SKILL.md` remains the four-part operational brief and its `as-is.md` stays aligned. If faithful mechanics cannot fit the established brief form without exceeding an independently enforced 17–42-line constraint, adding a fifth section, or hiding normative behavior in a non-operational sidecar, obtain an explicit form waiver rather than omitting mechanics. Replace stale composition-context prose where possible instead of merely appending content.

## Q3 — Roster and design-prototyper

**Verdict: CONFIRM.**

F8 live roster:

1. `as-is`
2. `component-builder`
3. `evidence-validator`
4. `execution-advisor`
5. `expert`
6. `thinking-companion`
7. `agent-capability-probe`

Do not install `design-prototyper` at F8. Record one agents-backlog revisit item covering its purpose, least-privilege profile, authority boundary, admission matrix, and required deterministic/live validation before later introduction.

## Q4 — F8 implementation route

**Verdict: CONFIRM with a non-circular validation boundary.**

The route is:

- `implementer` as entry agent.
- `worker` child sessions for bounded work.
- `planning-adviser` for plan review.
- `external-adviser` for independent external review.
- Transient agents retire only after implementation, review, evidence collection, and benchmark completion.

Do not use an adopted-roster agent as an implementation-route participant or substitute reviewer. Invoking a changed adopted role as the subject of its required deterministic/live behavioral test is permitted: that is validation of the product, not implementation by the role. Supplemental adopted-role advice should occur only after the candidate route completes and must not replace planning-adviser or external-adviser findings.

## Q5 — Lean-only three-way benchmark

**Verdict: METHODologically sound for regression comparison, but not proof of migrated integration mechanics.**

Conditions:

- Use only a non-voided, directly comparable round-6 case. Round-6 `uc9` is voided and cannot be an acceptance comparator without rerunning all arms; the valid `uc10` result is the appropriate recorded comparator.
- The fresh lean arm must be the proposed final F8 configuration: hollowed roles, migrated live Markdown skills, final permissions/tools, and no TypeScript composition execution.
- Match the archived round-6 prompt, fixture, tool/admission profile, launcher flags, budgets, stopping conditions, scoring rubric, and evidence requirements.
- Pin the exact resolved round-6 provider/model—not merely a mutable alias—plus thinking level and relevant host/runtime versions. Record any unavoidable environment drift.
- Use a disjoint clean consumer root and preserve immutable references to the reused baseline and candidate artifacts.
- Predeclare scoring before seeing the lean output. Because valid round-6 comparators scored 25/25, acceptance should require the lean arm to pass every mandatory gate and achieve 25/25, with no authority, scope, delegation, budget, or completion regression.
- Apply the same scorer/rubric, preferably label-blinded, and obtain the specified external review. Cost and wall-clock comparisons are diagnostic unless the existing round methodology makes them acceptance-bearing.
- Do not claim this benchmark validates parent-side isolated-commit integration: no historical arm exercised it. That requires a separate fresh F8 validation.

## Q6 — Additional gates and residual risks

**Verdict: BLOCK THE F8 COMMIT until these gates pass.**

1. Review the exact shell diffs and a clause-to-home migration matrix; no required behavior may simply disappear.
2. Add or request bounded live behavioral tests for `expert` and `agent-capability-probe`; run deterministic and explicitly opted-in live tests for every changed role, with no skipped test counted as passing.
3. Preserve all named anchored phrases exactly.
4. Run a fresh lean-config integration exercise covering an isolated child commit, parent cherry-pick, parent-side validation, ancestry proof, source/result SHAs, descendant closure, and a separate `no-separate-integration` case.
5. Deterministically test `admitLaunch()` and exact normalized wall-clock forwarding, including denial/exhaustion behavior and the generic-launcher non-parsing boundary.
6. Complete the F8 admission matrix, positive and denied/missing-capability cases per role, exact-roster fresh-discovery smoke, permission enforcement, model-alias resolution, and zero duplicate/dangling identities.
7. Reconcile agent and skill `as-is.md` records, backlog items, fixtures, references, and catalog digest; ensure fidelity-test expectation changes correspond only to the authorized migration.
8. Retire transient agents only after their route, reviews, benchmark, and audit evidence are complete; preserve benchmark evidence and apply the tracked/untracked/ignored removal guard.

Residual risks remain: prompt-level skill compliance is nondeterministic; reused benchmark arms cannot control later provider/runtime drift; and historical benchmarks provide no evidence for isolated-worktree integration. The fresh integration exercise and deterministic launcher/control-plane checks therefore remain mandatory rather than residual-risk notes.

**VERDICT: PROCEED — implement the authorized brutal hollowing through the candidate route, but do not create the F8 family commit until the migration, role-validation, integration, admission, and benchmark gates above pass.**
