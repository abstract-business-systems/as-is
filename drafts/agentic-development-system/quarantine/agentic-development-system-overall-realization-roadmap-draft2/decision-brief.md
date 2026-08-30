# Agentic Development System — Overall Realization Roadmap — Decision Brief
Purpose: Give the human the smallest sufficient context to decide whether Draft 2 is the controlling program roadmap.

## Current situation

The accepted draft-11 target is broad. It covers the human-facing design lifecycle, explicit Human Review, current-versus-target representation, component anchors, parent/child realization, bounded implementation packets, authority and escalation, agent and skill direction, assurance, host and setup concerns, migration, evaluation, and eventual adoption.

The later parallel-child work was a narrow clarification. Frozen executable plan draft 6 is the first execution-control slice derived from that clarification. It is not the full program implementation plan.

## What is already accepted

The user accepted the exact draft-11 design-and-implementation envelope on 2026-08-27. That acceptance includes the three-phase lifecycle, current-versus-target distinction, anchor-scoped planning, parent/child realization, bounded packets, safeguards, unresolved-question handling, non-goals, residual risks, and the agent and skill dispositions in Sections 8–9.

This means the target roster and skill direction are accepted target direction. It does not mean the live `agents/*`, `skills/*`, task-control, or adapter contracts have been migrated or adopted as current. Implementation, compatibility validation, target adoption, artifact retirement, and merge remain separate decisions.

The selected repository-local pilot is `validation-fixtures/dummy-delegation`. The focused parallel-child clarification is closed as a planning clarification, and draft 6 is frozen as a first-slice plan ready for Human Review. Neither authorizes implementation.

## What Draft 2 corrects

Draft 2 restores the original program outcome: design, human approval, implementation, setup-inclusive benchmark against a pinned `master` baseline, and explicit advancement, adoption, and merge decisions.

It carries the accepted agent and skill dispositions instead of reopening roster design. It distinguishes accepted target direction from current live contracts and from implementation/migration work.

It identifies the historical draft-29–36 package as advisory provenance from a preserved checkpoint. Because the current continuation records do not establish a separate human acceptance for that package, Draft 2 does not silently treat it as controlling authority. Contradictions are retained for explicit reconciliation.

It corrects sequencing by allowing pre-benchmark inventory and compatibility planning before evaluation while keeping migration execution and artifact retirement after candidate evidence and advancement.

It separates pilot-scope closure from program-scope closure and keeps target adoption and merge distinct from benchmark success.

## What this decision does not decide

This decision does not:

- create a task or worker;
- authorize kick-off or implementation;
- approve draft 6 for implementation;
- adopt target contracts into current architecture;
- authorize benchmark execution;
- authorize artifact retirement;
- authorize target adoption or merge; or
- require alternate-family review as a permanent target-system gate.

Exact fields, storage, APIs, workers, budgets, benchmark feature, seed, scorer, thresholds, and migration mechanics remain bounded follow-on decisions.

## Decision requested now

Choose one outcome for Draft 2 as a planning map:

1. **Accept** it as the controlling program continuation map;
2. **Request one bounded revision**;
3. **Defer**; or
4. **Reject**.

### Recommendation

**Accept Draft 2 as the controlling program map for planning, subject to the exact artifact identities and any bounded Kimi review requested by the author.** Then update the canonical handoff to identify one next gate: Human Review of the exact frozen draft-6 first-slice plan, unless the user explicitly selects a different first implementation slice.

## Consequences

If accepted:

- draft 6 remains a first-slice plan, not the entire rearchitecture;
- the next implementation path is still separately gated by draft-6 Human Review, kick-off, process-adapter boundary resolution, task preparation, and task-control admission;
- the broader target areas receive bounded realization plans without silently blocking unrelated first-slice preparation; and
- benchmark preparation can proceed as planning, but benchmark execution waits for candidate behavior, pinned revisions, equivalent conditions, protected scoring, and explicit approval.

If revision is requested, only the identified bounded defect should be repaired and Draft 1/Draft 2 identities should remain preserved.

## Next action and authority limit

After the decision, record the exact outcome and update the canonical handoff so it names one continuation point. Do not create tasks, launch workers, implement, benchmark, adopt, retire, or merge from this brief.

startsWork: false
