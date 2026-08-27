# Agentic Development System — Review Thread Recovery

Purpose: Record the recovered planning-thread issue, the authoritative sequence, and the disposition of confusing interim artifacts before commit and compaction.

## Status and authority

Status: planning recovery record; implementation is not authorized. The requested documentation checkpoint was committed as `4cbc50b`; compaction is now safe after clean-worktree verification.

This record does not alter the accepted draft-11 envelope. It explains a continuity failure and separates the requested parallel-child review from broader blocker-resolution exploration. It is navigation and provenance, not a second target authority.

## Recovered original flow

Historical records and the prior session establish this transitional authoring sequence:

```text
Sol authors frozen design or bounded plan
  → actual alternate reviewer reviews the exact frozen artifact
  → Sol dispositions findings and creates at most one successor when needed
  → human reviews/alines the exact resulting design or plan as applicable
  → kick-off authorizes preparation/admission only
  → task-control admits the exact task
  → implementation builds the target structures
  → candidate flow is exercised
  → evidence is reviewed
  → benchmark protocol is approved
  → benchmark runs
```

The accepted draft-11 target lifecycle remains the simplified three-phase target flow. The historical Sol/Kimi sequence is being used here as transitional planning discipline, not promoted into a permanent target-system gate.

## Requested work versus accidental expansion

| Track | Intended content | Status |
| --- | --- | --- |
| Requested parallel-child processing review | Parent/child mean component-building flows; independent child builds may run in parallel; one active build per component; successful parent completion waits for all owned child builds; related scope and claim boundaries. | Actual Sol and Kimi reviews completed for `drafts/agentic-development-system-parallel-child-build-processing-draft1.md`; findings require disposition. |
| Broader blocker-resolution exploration | Pilot exclusions, `core/contracts`, child integration, plan readiness, receiving authority, atomic reservation, and recovery details. | Drafts 1–6 contain exploratory and review evidence. They are not the current requested review artifact and must not silently become the next planned flow. |
| Candidate implementation | Build new plan/admission/concurrency/integration structures, then exercise them with `dummy-delegation`. | Not started and not authorized. |

## What went wrong

Compaction preserved the broad design acceptance but weakened the distinction between the requested parallel-child clarification and a separate exploratory blocker-resolution document. The orchestrator then treated the broader document as the immediate review target, repeatedly created successors, and incorrectly described expert-shell simulations as Sol-style reviews. This obscured when the new structures would actually be built.

The recovered correction is:

- use the focused parallel-child document for the requested Sol/Kimi review and disposition;
- retain broader blocker-resolution drafts as exploratory evidence only;
- do not treat current fixture tests as candidate target-flow evidence;
- build the new structures only after the applicable plan is human-accepted, kick-off is separately authorized, and task-control admits the exact implementation task; and
- keep benchmark work after candidate structures and candidate-flow evidence, not before.

## Interim artifact quarantine disposition

The following are retained for audit/recovery but must not be used as the current planned-flow pointer:

- `drafts/agentic-development-system/quarantine/agentic-development-system-blocker-resolution-plan-draft1.md` through `drafts/agentic-development-system/quarantine/agentic-development-system-blocker-resolution-plan-draft6.md`;
- `drafts/agentic-development-system/quarantine/reviews/expert-blocker-resolution-plan-draft1.md`;
- `drafts/agentic-development-system/quarantine/reviews/sol-style-blocker-resolution-plan-draft3.md` and `sol-style-blocker-resolution-plan-draft5.md`;
- `drafts/agentic-development-system/quarantine/reviews/transitional-alternate-blocker-resolution-plan-draft3.md` and `transitional-alternate-blocker-resolution-plan-draft5.md`;
- `drafts/agentic-development-system/quarantine/reviews/sol-blocker-resolution-plan-draft6.md` and `kimi-blocker-resolution-plan-draft6.md`;
- `drafts/agentic-development-system/quarantine/reviews/sol-style-blocker-resolution-plan-draft6.md` and `transitional-alternate-blocker-resolution-plan-draft6.md`.

They are moved into explicitly named quarantine directories so they remain recoverable audit provenance without competing with the active planned-flow documents. This is a reversible, preservation-aware relocation of untracked planning artifacts, not a claim that they are deleted or permanently retired.

The actual final Sol/Kimi reviews for the focused requested artifact are:

- `reviews/agentic-development-system/sol-parallel-child-build-processing-draft1.md`;
- `reviews/agentic-development-system/kimi-parallel-child-build-processing-draft1.md`.

## Current required disposition

The focused artifact received:

- actual Sol review using `openai/gpt-5.6-sol`: **revise**;
- actual Kimi review using `moonshotai/kimi-k3`: **pass with findings routed to Sol disposition**.

Sol's supported findings are:

1. distinguish successful parent outcome from current task-control `completed` status, or explicitly route a status change through a successor target design and Human Review;
2. keep parent assignment/accounting distinct from task-control admission and child task ownership;
3. require complete terminal/failure/cancellation/recovery accounting without orphaning active children or reservations; and
4. pin accepted-envelope and exact-artifact identity for review provenance.

Kimi's findings are to be dispositioned by Sol, not automatically incorporated:

1. integration reservation/slot semantics;
2. ancestor/descendant overlap;
3. mid-build discovery of sibling dependency;
4. sibling cancellation policy; and
5. transitive recursion/descendant closure.

## Next safe action

Create one focused successor of `parallel-child-build-processing-draft1.md` only after Sol dispositions these findings. Then review that exact successor through the actual transitional Sol/Kimi process, record the result, and obtain explicit commit authorization. Do not derive or execute the pilot implementation from the broader blocker-resolution drafts. `startsWork: false`.
