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
Root task explicitly activated by current-turn user authorization. Planning evidence is present in `29ce77b` and has been read from Git history. The first bounded descendant completed Phase 1 in child commit `21fcb08109615f78a8c73d6dd123f0e7e2b2a9c6`, adding `skills/building-components/SKILL.md` and one `skills/changelog.md` entry. Caller ancestry was verified: child parent is `bc88972`, and fast-forward integration advanced this caller to `21fcb08`. The child returned budget-stopped (`124`) after its final report; its committed handoff is valid, and its transient `skills/tasks.md` was cleaned from the caller worktree.

## Validation
Phase 1 child reported passing expert plan review and fresh expert final-diff validation after correcting a relative-link issue; it also reported `git diff --check` and staged diff checks passing. Caller independently verified the child commit exists, has parent `bc88972`, contains only the scoped skills changes, and fast-forward integration made it the caller HEAD. Root `git diff --check` and orientation validation remain pending. Residual risk: the child process was wall-clock budget-stopped after its completion report, so no further descendant may be inferred complete without rereading a durable terminal record.

## Result
Pending.

## Blockers And Escalations
Budget boundary reached for the first descendant: the component-builder launcher returned exit 124 with the recorded `as-is budget-stopped` marker at 180 seconds. The child commit and final report were available before the stop, but the child record was not durably terminal in the caller because its transient record was not included in the commit. Further phases require a fresh authorized allocation and a durable child task record; do not retry this attempt or infer completion of remaining phases. No genuine implementation failure was observed.

## Recovery
If interrupted, inspect this active record and the delegation registry; do not launch a duplicate attempt for the same revision. Read the child record from its committed handoff, integrate only from the caller branch, and account for preserved uncommitted worktrees or budget-stopped descendants.

## Next Action
Record the verified Phase 1 integration and budget-stopped accounting in this root task, run root-focused validation, and stop for the current budget boundary. Resume only with explicit recovery/allocation authority for Phase 2.
