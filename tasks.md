---
as-is-version: 2
task:
  status: active
  worker: as-is
  updated: 2026-08-06T00:00:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.50
    spent: 0.00
    reserve: 0.10
    source: host-reported
  delegation:
    maximum-depth: 1
    maximum-children: 1
  execution:
    wall-clock:
      allocated-seconds: 300
      spent-seconds: 0
      reserve-seconds: 60
      source: host-reported
  external-effects: require-current-turn-user-approval
acceptance:
  - Activate the approved skills-agents-separation-migration root task without changing runtime behavior outside its bounded migration scope.
  - Execute the approved phased separation through bounded component-owned descendants using component-builder only.
  - Preserve agent authority, skill non-calling boundaries, generalized subagent flows, explicit dependencies, and durable task-record evidence.
  - Validate every descendant with required expert plan and final-diff gates, integrate only verified commits with caller ancestry evidence, and account for residual risk or blockers.
  - Continue through remaining authorized root phases until completion, genuine blocker, budget limit, or approval requirement.
---
# Task

## Requirement
Implement the approved `skills-agents-separation-migration` in bounded descendant tasks. The approved planning handoff is commit `29ce77b` (`docs: plan skills and agents separation`), whose six phases and acceptance signals are authoritative. Root `tasks.md` is the current task authority; backlog entries remain planning indexes.

## Plan
Execute the approved phases in dependency order through component-owned `component-builder` descendants. The first bounded descendant will implement the skills-component extraction contract (`building-components`) using the existing `skills/implementing-component-tasks`, `skills/committing-completed-work`, and `agents/component-builder/agent.md` contracts. Subsequent phases require fresh child records and available budget; no cross-boundary edits are permitted.

| Phase | Descendant boundary | Dependencies | Acceptance signal |
| --- | --- | --- | --- |
| 1 | Skills component: reusable building-components procedure | Approved plan `29ce77b`; `skills/implementing-component-tasks`; `skills/committing-completed-work`; component-builder role | Bounded reusable procedure exists with inputs, outputs, delegation, validation, and scoped commit rules; role authority remains explicit. |
| 2 | Root orchestration contract | Phase 1; root `as-is.md`; `skills/as-is`; `skills/spawning-pi-subagents` | Root orchestration boundary is extracted without skill launch authority inversion. |
| 3 | Runtime/generalized flows and validation | Phases 1–2; launcher and execution contracts | Implementation/research/review/planning/recovery flows have durable evidence, budgets, observation, and recovery checks. |
| 4 | Documentation reconciliation | Phases 1–3; affected AGENTS/design/component records | Terminology and links reconcile with no unauthorized runtime or prompt changes. |

## Progress
Root task explicitly activated by current-turn user authorization. Planning evidence is present in `29ce77b` and has been read from Git history. One implementation descendant is authorized at a time under the root allocation; child work must be committed in isolation, expert-gated, and integrated here only after caller ancestry verification.

## Validation
Pending descendant implementation and required expert gates. Root validation will include focused checks for task-record structure, changed-scope diff, relevant tests, `git diff --check`, and ancestry verification for every integrated child commit.

## Result
Pending.

## Blockers And Escalations
None currently. A missing named dependency, unavailable configured worker or expert, budget excess, failed descendant, or approval-gated scope must remain a durable blocker and must not trigger an unrecorded retry.

## Recovery
If interrupted, inspect this active record and the delegation registry; do not launch a duplicate attempt for the same revision. Read the child record from its committed handoff, integrate only from the caller branch, and account for preserved uncommitted worktrees or budget-stopped descendants.

## Next Action
Commit this activation checkpoint, then launch the first bounded `component-builder` descendant for the skills-component building-components extraction contract.
