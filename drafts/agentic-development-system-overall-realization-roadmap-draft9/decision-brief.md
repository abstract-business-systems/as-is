# Agentic Development System — Overall Realization Roadmap — Draft 9 — Decision Brief
Purpose: Present one planning decision without requiring the human to read the supporting roadmap.

## What is already accepted

- The exact draft-11 design-and-implementation envelope is accepted target direction.
- The exact Draft-3 overall realization roadmap is accepted for planning navigation.
- Draft 6 is frozen and reviewed as a narrow first execution-control plan, but has not been accepted for implementation.
- Current live contracts and implementation remain authoritative until separately migrated and adopted.

## Why this successor exists

Draft 9 records the clarified construction arrangement and preserves the broad original goal. It is the successor to Draft 8 after correcting the remaining progressive-disclosure links; it does not change the accepted target architecture.

The two construction flows are:

| Flow | Plan author/adviser | Implementation author | Plan reviewers before implementation | Implementation-result review |
| --- | --- | --- | --- | --- |
| Coding/application | Terra | Luna | Sol + external Kimi | Terra reviews Luna; not independent |
| Agents/skills | Sol | Terra | Sol + external Kimi | Sol reviews Terra; not independent |

Sol participates in planning discussions for both flows. The planner reviewing the implementation is useful for continuity but is not independent because that planner authored/advised the plan. Deterministic validation remains separate. Add an independent result reviewer when risk, architecture, security, external effects, disagreement, or policy requires it.

External Kimi review is required for exactly these two frozen top-level flow plans in this construction exercise. It is not a permanent target-system gate, and derived child packets do not automatically trigger it.

## Single decision requested

Should the exact Draft-9 five-file packet replace Draft 3 as the controlling planning map for this construction exercise?

- **Accept** — use this brief as the human front door and the roadmap/assignment as supporting detail.
- **Request one bounded revision** — identify the smallest necessary correction.
- **Defer** — keep Draft 3 controlling.
- **Reject** — preserve Draft 3 without adopting Draft 9.

## Recommendation

Accept Draft 9 as the planning map, subject to exact packet identity and final bounded review. Then prepare the two exact top-level flow plans and obtain Sol plus external Kimi review of each before implementation preparation.

## Key consequences and blockers

- The accepted program scope and target direction do not change.
- The current `agents/*`, `skills/*`, task-control, and adapter contracts remain current until separately migrated/adopted.
- Draft 6 remains a first-slice control plan, not the whole rearchitecture.
- The current parent-side integration versus target child-owned integration boundary remains a blocker before the Draft-6 process-adapter task is prepared: [Draft-6 first slice](roadmap.md#e-packets-parentchild-realization-assurance-and-draft-6-first-slice).
- Exact Luna, Terra, Sol, Kimi, validator, integration, and human-holder identities, routes, budgets, and capabilities are selected and admitted at the applicable gate; current project provider default is `openrouter`.

## Authority limits and next action

This packet authorizes no task, kick-off, worker launch, implementation, benchmark, target adoption, artifact retirement, commit, or merge. Model or reviewer identity grants no authority.

Next: perform the exact packet review and then present only this brief for Human Review. If accepted, prepare the two flow plans and obtain their required Sol + external Kimi reviews. See the [construction-time role and review summary](roadmap.md#construction-time-role-and-review-summary), [Draft-6 first slice](roadmap.md#e-packets-parentchild-realization-assurance-and-draft-6-first-slice), [gates and authority](roadmap.md#gates-and-authority), and [independence safeguards](roadmap.md#independence-and-conflict-safeguards). `startsWork: false`.
