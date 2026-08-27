# Agentic Development System - Consolidated Continuation Handoff

## Purpose and authority

This document is the consolidated continuation checkpoint for the agentic-development-system rearchitecture. It is a draft and durable handoff, not current-architecture authority, target-contract authority, task authority, implementation authorization, or runtime configuration. It consolidates the active decisions, user inputs, review outcomes, unresolved questions, disposition tables, and next-session instructions. The longer reports listed under provenance remain source evidence and audit history in `reviews/agentic-development-system/`; this document is the canonical navigation point for a new orchestration session.

**Core principle:** Humans focus on design and features; agents take care of implementation. Implementation is the verified, evidence-bearing realization of human-facing design, analogous to compiled output for human review. This is a metaphor, not a claim that implementation is literally compilation or trustworthy without deterministic verification and review.

## Current checkpoint

| Field | State |
| --- | --- |
| Repository | `/home/vc/dev/as-is` |
| Branch | `implementing-composable-skills` |
| Branch role | Candidate and recovery/reversal boundary for this exercise; it need not be `master` |
| Baseline | A pinned `master` revision is an evaluation baseline only; it is not a universal working branch or approval source |
| Working tree | Draft 5 has uncommitted user-directed human-review, combined-document, workflow-benchmark, Mermaid, and role/skill-naming refinements plus Terra/Sol advisory records; no implementation changes |
| Planning stage | Sol created draft 1; Kimi/Sol completed the bounded high-level review through counted round 8 with no supported checklist-scoped repair remaining; draft 5 now has user-directed human-gate, combined-document, workflow-benchmark, Mermaid, and role/skill-naming refinements pending further decision/review |
| Latest Terra verdict | Advisory revised design-creation flow remains historical input; Terra detail planning has not started because user alignment is pending |
| Latest Sol verdict | Sol advised that the requested human detail-plan gate, combined-document approach, workflow-benchmark visibility, agent-to-skill diagram, and role/skill normalization are directionally consistent; the draft-5 refinements have not received a fresh bounded alternate-family review and are not design approval |
| Implementation | Not authorized and must not begin |
| Current owner | User, for review and explicit high-level design alignment |
| Next review gate | User reviews and aligns, requests changes, or defers the current draft-5 presentation packet; any decision to treat its refinements as a reviewed frozen packet requires successor identity and appropriate review evidence |
| Later review gate | After user alignment, Terra creates bounded detail-plan chunks and Sol reviews/advises each chunk; the user then decides whether to kick off the first bounded slice |
| Alternate reviewer | Kimi reviewed drafts 1–4 under the bounded alternate-family reviewer procedure; caller-side identity, packet, and read-only evidence remain recorded as evidence, not authority |

## User direction consolidated

- Human escalation belongs to the applicable orchestrator. Agents may escalate to their caller; callers resolve within authority or bubble the issue upward until it reaches the responsible orchestrator and, when necessary, the then-current user.
- Agents own workflow orchestration and authority-bearing decisions within their scope. Skills provide reusable procedures; tools provide operations. Skills do not grant tools or authority.
- The initial roster may use a component-builder and bounded task implementer, with additional roles created when ownership gaps are demonstrated. A dedicated design/prototyping agent group is optional.
- Human feedback occurs after design and after implementation. Feedback that changes the design returns to design; it must not be silently appended to an active or completed implementation task.
- Path A is the intended lifecycle: planned target design drives derived artifacts and implementation. Path B should not be used while models can reliably distinguish current and planned designs. If that distinction fails, repair or escalate rather than silently switching lifecycles.
- Design completion is tied to the base `as-is.md` design records required for the implementation. The complete program has a human-facing target design, while implementation proceeds through separately approved bounded units. Before a unit starts, all base records needed for that unit are available, linked, current, and approved by the then-current user/reviewer.
- The current and planned states must remain explicitly distinguishable. Initially use a frozen, revisioned target-design package linked from current records; a later bounded record-contract unit may add explicit current, approved-target, and design-relationship sections.
- The then-current user is the design reviewer for the applicable root design revision. The reviewer identity and decision must be recorded with the revision.
- The first comparison should include setup, a separately owned mock consuming project, and current and candidate copies in different directories tested against the same feature.
- Heavy refactoring and a total rewrite are both acceptable. Staged heavy refactoring is the current recommendation; a total rewrite remains available when controlled evidence shows lower total risk/cost or better target fit, including compatibility complexity, migration cost/risk, maintenance burden, safety, isolation, recoverability, persistent correctness failures, or evaluation results, even if the current substrate is technically capable.
- The active branch is the candidate/recovery boundary. `master` is only a pinned comparison baseline. No separate rollback subsystem is required absent evidence.
- `drafts/composable-skills.md` is proposal direction, not implementation authority. Its historical proposal to replace every existing skill is not an adopted retirement decision.
- No live agent or skill may be silently removed. Replacement, merge, rename, deprecation, or drop requires an explicit source-to-target migration and evidence.
- **Current user direction:** Sol owns the high-level design, including proposed introduction, modification, composition, retention, deprecation, replacement, or dropping of skills, agents, workflows, and boundaries. Kimi and Sol may exchange at most 10 bounded review rounds. The user then reviews and aligns the design. Only after alignment does Terra add detail in bounded chunks, with Sol reviewing/advising each chunk. The user may then request a kick-off for a named bounded implementation slice. This direction is not implementation authorization.

## Review outcomes and provenance

| Source | Outcome | Status |
| --- | --- | --- |
| `reviews/agentic-development-system/terra-refinement-report.md` | Existing component/task control plane is a strong substrate; add design governance | Advisory source report |
| `reviews/agentic-development-system/sol-validation-report.md` | Initial approach required revision | Advisory source report |
| `reviews/agentic-development-system/terra-reconciliation-report.md` | Incorporated first user feedback; proposed Path A and right-sized controls | Intermediate advisory source report |
| `reviews/agentic-development-system/sol-re-review-report.md` | Approved direction for limited design review, not implementation | Advisory source report |
| `reviews/agentic-development-system/terra-follow-up-report.md` | Added current/planned distinction, mock slice, live disposition tables | Advisory source report |
| `reviews/agentic-development-system/sol-final-re-review-report.md` | Approved readiness for the next design package, not implementation | Advisory source report |
| `reviews/agentic-development-system/terra-expanded-replan-report.md` | Recommended staged heavy refactor; added setup-inclusive comparison and target tables | Advisory source report; superseded by later revisions |
| `reviews/agentic-development-system/sol-expanded-re-review-report.md` | `revise`; identified normalization and scope issues | Advisory source report; superseded by later revisions |
| `reviews/agentic-development-system/terra-final-design-creation-flow-revision.md` | Final design-creation-flow revision; ready for fresh Sol review | Latest Terra revision; advisory |
| `reviews/agentic-development-system/sol-final-design-creation-flow-review.md` | **Approve readiness for human-facing target-design package** | Historical Sol review; superseded as the active flow by the user-refined bounded Sol/Kimi design loop |
| `drafts/agentic-development-system-high-level-design-draft4/` | Frozen human-facing high-level design; packet digest `4f174a90734ecbbab61b98adbd2cdbc9ba75595ba123697edd5248333afa48f9` | Active design packet; user alignment pending |
| `reviews/agentic-development-system/kimi-high-level-design-review-draft1.md` through `kimi-high-level-design-review-draft4.md` | Kimi alternate-family review records; rounds 1, 3, 5, and 7 | Advisory evidence; draft 4 reported no supported manifest-scoped repair |
| `reviews/agentic-development-system/sol-disposition-kimi-review-draft1-round2.md`, `sol-disposition-kimi-review-draft2-round4.md`, `sol-disposition-kimi-review-draft3-round6.md` | Sol dispositions of Kimi findings | Advisory repair specifications; all applied to successors |
| `reviews/agentic-development-system/sol-closure-high-level-design-draft4-round8.md` | Sol closure disposition | Advisory readiness for user high-level design alignment; no successor required |
| `reviews/agentic-development-system/openrouter-benchmark-screening.md` | Screened alternate-family reviewer candidates | External screening evidence; not selection or family proof |
| `drafts/composable-skills.md` | Composable reusable/master skill proposal | Retained as non-authoritative input; selectively incorporated, not adopted as a catalog or replacement mandate |
| `drafts/backlog.md` | Planning index and historical proposal context | Not task authority |

The final Terra-Sol pair is historical advisory input. The active design run is the frozen Sol-authored draft-4 packet and its bounded Kimi/Sol review records. No report approves implementation or adopts target contracts.

## Simplified design-and-planning flow now proposed

The user refined the flow into one high-level design loop followed by bounded detail chunks. The word “package” means a frozen, human-reviewable document bundle—not an installable software package, an implementation task, or an approval. A package has an exact revision, file set, manifest, and identity so reviewers can say precisely what they saw. A later detail package is one bounded design or implementation-plan chunk with its own context, scope, inputs, outputs, and acceptance conditions; it may cover a component, capability, or cross-component slice.

### A. High-level design loop: Sol creates, Kimi challenges

1. **Sol creates the high-level human-facing design.** Sol owns authorship of the proposed system design, using current `as-is.md` records and the refined brief as evidence and historical material only as context. Sol may propose introducing, modifying, composing, retaining, deprecating, or dropping target skills, agents, workflows, and related boundaries. The root design must explain purpose, proposed behavior, human and agent authority, current-versus-planned state, first proof, lifecycle, major trade-offs, unresolved decisions, and what is not being claimed. Technical contracts and exhaustive inventories support the narrative but must not be required reading for human understanding.
2. **Freeze each review revision.** Before Kimi reviews, record the exact package revision, file set, manifest, packet identity, review scope, and fixed acceptance criteria. A package edit creates a successor revision; it does not rewrite the reviewed predecessor.
3. **Kimi reviews and advises.** Kimi is a read-only alternate-family reviewer. It challenges the high-level architecture and proposed skill/agent changes for supported risks, omissions, contradictions, migration consequences, authority problems, and unsupported claims. It may recommend repairs but cannot edit, approve, create tasks, or authorize implementation.
4. **Sol and Kimi may exchange at most 10 review rounds.** One round is one Kimi review of one frozen Sol revision followed by one Sol disposition and, when accepted, a successor revision. Sol may stop earlier when the fixed acceptance criteria pass. The tenth round is a hard bound, not a promise that the design is “right”: if material disagreement or an unmet criterion remains, escalate it to the user rather than continuing automatically. New stylistic preferences do not consume a round or reopen a passed criterion.
5. **The user reviews and aligns the high-level design here.** Present the human-facing design, concise decision brief, Kimi/Sol dispositions, unresolved decisions, and residual risks. The user may align, request design changes, or defer. Design-changing feedback returns to this bounded high-level loop; editorial clarification changes presentation only. User alignment approves design direction, not implementation.

Before Kimi reviews an exact draft, verify model identity/family provenance, packet identity, read-only admission, and the bounded suitability gate. If any is unavailable, record a blocker and stop rather than silently substituting another reviewer.

### B. Bounded detail-plan chunks after high-level design alignment

6. **Terra derives one detail chunk at a time.** After the user aligns the high-level design, Terra adds implementation-ready detail without silently changing the approved direction. Each chunk has a named bounded context, purpose, affected component(s), design references, dependencies, owners, capabilities, protected inputs, acceptance, deterministic validation, semantic review, integration, recovery, explicit non-goals, and unresolved questions. Chunks may be reviewed independently and may not assume authority over unrelated components.
7. **Sol reviews and advises each chunk.** Sol checks the chunk for traceability to the aligned high-level design, bounded scope, authority separation, dependency completeness, validation, recovery, and honest exclusions. Terra responds to each finding. Each chunk gets at most one bounded repair cycle; genuinely new design concerns or disagreement about an acceptance condition escalate to the user instead of opening another automatic loop.
8. **Close the detail-plan set.** Terra records which chunks are complete, blocked, deferred, or dependent on another chunk. Sol confirms that the set is coherent enough for the next human decision, without turning that confirmation into task authority.
9. **Ask the user for a kick-off decision.** Present the aligned high-level design, the reviewed detail chunks, dependencies, open risks, and the proposed first bounded implementation slice. The user may authorize kick-off, request changes, defer, or decline. “Kick-off” must mean permission to prepare or start the named first bounded task only; it must not be interpreted as blanket authorization for the whole rearchitecture.

### C. Downstream execution after kick-off

10. Confirm applicable base records, holders, capabilities, protected controls, exact task scope, and task-specific authorization.
11. Create and authorize one bounded implementation task.
12. Run the admitted worker, deterministic validation, independent semantic result review, receiving-owner integration, and post-integration revalidation.
13. Record failure, recovery, escalation, evidence, and residual risk. Compare current and candidate workflows only under the separately approved setup/evaluation protocol.

### Simplification limits

- The high-level loop has one Sol authoring stream, at most 10 Kimi/Sol review rounds, and one user design-alignment gate.
- Each detail chunk has one Terra authoring stream, one Sol review/advisory cycle, and at most one repair successor.
- Reviewers may suggest improvements, but may not silently add acceptance criteria, alter user decisions, or grant authority.
- A genuinely new material concern or unresolved reviewer disagreement is escalated to the user; it does not trigger automatic draft proliferation.
- Every revised package or detail chunk preserves its predecessor and receives fresh identity and verification evidence.
- High-level design alignment, detail-plan closure, user kick-off, task authorization, and implementation remain separate transitions.

## Proposed target-design package structure

This is a planning proposal, not a directory-creation instruction:

```text
target-design-package/
  target-design.md
  component-designs/
  migration-ledger.md
  setup-and-benchmark.md
  decision-log.md
```

The root document covers program scope, lifecycle, authority, target categories, strategy, setup, evaluation, migration, feedback, validation, recovery, and unresolved decisions. Component documents use a consistent planned-target template: purpose/users; current reference; planned responsibility/boundary; relationships and authority limits; inputs/outputs and consequential flows; migration mapping; acceptance/validation; open decisions/dependencies. The migration ledger is the sole source of migration and disposition truth. The package may remain one folder/document set for human review; it must not become an unreviewed implementation instruction.

## Worktree and collision policy

Candidate implementation and evaluation use separate directories/worktrees:

- candidate worktree from the active candidate branch;
- baseline/current worktree from the pinned `master` revision;
- separately owned mock-project seed;
- separate current and candidate consumer copies from that seed.

The launcher defaults delegated child work to isolated worktrees and preserves uncommitted recovery candidates. Git worktrees prevent ordinary repository working-tree collisions but do not prove filesystem, process, network, credential, or external-effect isolation. Those remain explicit first-slice acceptance conditions. The candidate must not silently fall back to the caller directory, and protected designs, tasks, baselines, seeds, validators, scorers, rubrics, and fixture controls must remain outside worker write scope.

## Decisions still requiring the user

- Confirm the simplified role order: Sol creates the high-level design, Kimi reviews/advises it for at most 10 rounds, the user aligns the design, Terra creates bounded detail-plan chunks, Sol reviews/advises each chunk, and the user decides whether to kick off the first bounded implementation slice.
- Confirm that Sol may propose introducing, modifying, composing, retaining, deprecating, or dropping target skills, agents, workflows, and boundaries, subject to migration evidence and human alignment.
- Confirm that Kimi's identity/provenance and suitability gate must be completed before each exact-package review, with no silent reviewer substitution.
- Review and align on the high-level human-facing design after the bounded Sol/Kimi loop.
- Confirm the maximum 10-round high-level review bound and escalation behavior at the bound.
- Confirm staged heavy refactoring with the broad evidence-based total-rewrite escape.
- Select the first mock feature or qualifying simple backlog item.
- Appoint accountable holders for setup, semantic review, evaluation/scoring, migration, fixture ownership, detail-plan creation, and task authorization.
- Confirm the repository-local first-slice boundary: no credentials, external effects, package/distribution claim, or security-isolation claim.
- Approve the benchmark rubric, safety-critical failures, and exact advancement rule.
- Decide whether the user kick-off authorizes preparation only or preparation plus execution of the named first bounded task; no blanket rearchitecture authorization is implied.

## Residual uncertainty

- Runtime enforcement of worktree, filesystem, network, credential, directory, and fixture protections remains untested.
- No mock feature, seed revision, baseline revision, candidate revision, or accountable holder identity is selected.
- The exact design-link/currentness representation remains unadopted.
- No consumer inventory or migration trial exists for future renames/adaptations.
- Kimi is the user-selected alternate-family reviewer for the active high-level design run. Drafts 1–4 were reviewed through the bounded process; the caller-side model/provider, packet, and read-only evidence are recorded, while hidden backend identity remains unavailable. The active draft-4 packet digest is `4f174a90734ecbbab61b98adbd2cdbc9ba75595ba123697edd5248333afa48f9`; its target-design file digest is `464a2dcd541a1533ef54845412ee1356a1802b6d75d884d1f3c48966a3a27679`. Evidence is recorded in the Kimi/Sol reports listed below.
- External installation, distribution, package provenance, upgrades, downgrade, uninstall, and multi-project isolation remain unproven.

## Explicit authority statement

This handoff records the user's simplified design-and-planning direction. It does not approve the high-level design, approve detail chunks, adopt target contracts, create task authority, authorize kick-off, or authorize implementation. Sol's design, Kimi's review, Terra's detail chunks, Sol's chunk reviews, hashes, suitability results, and process exits are evidence only. The user retains high-level design-alignment and kick-off authority; a separate bounded task authorization remains required.

The active path is Sol high-level design → Kimi review/advice (maximum 10 rounds) → Sol dispositions/repairs → user design review and alignment → Terra detail chunks → Sol chunk review/advice → user kick-off decision → separate task authorization → execution. The active draft-4 packet has no supported manifest-scoped repair remaining; the next authority-bearing transition is the user's high-level design alignment. Target skills, agents, workflows, and their dispositions are part of Sol's design scope, but no proposed introduction, modification, deprecation, or drop becomes current architecture without later authorized migration.

### Why the active design has multiple drafts

Drafts 1–4 are not four competing designs or an unbounded loop. Each successor preserves its predecessor and records one bounded repair response to specific review findings:

| Revision | Reason for successor | Review result |
| --- | --- | --- |
| `draft1` | Initial Sol-authored high-level design. | Kimi identified seven bounded repairs. |
| `draft2` | Applied the seven accepted or narrowed repairs from Sol round 2. | Kimi identified three bounded repairs: section numbering, G3/detail ordering, and terminology/duplication. |
| `draft3` | Applied those three bounded repairs. | Kimi identified one minor duplicate paragraph. |
| `draft4` | Removed that duplicate and aligned one non-blocking term. | Kimi found no supported manifest-scoped repair; Sol closed the review early. |

This revisioning was necessary to keep each review tied to exact bytes and to prevent edits from silently changing what an earlier reviewer saw. It was not intended as a normal requirement for many drafts. Under the active rule, the design loop is capped at 10 counted Kimi/Sol rounds, exits early when the fixed manifest checklist has no supported repair remaining, and escalates unresolved material disagreement at the bound. No draft 5 is planned unless the user requests a design change or a new material issue requires a bounded successor.

## New-session next action

Read this handoff first. The current continuation point is the user decision on the current draft-5 presentation packet `drafts/agentic-development-system-high-level-design-draft5/`; its manifest must be recomputed after the uncommitted refinements. Draft 5 preserves Sol's draft-4 design and now contains a ToC, refined Mermaid views, explicit human review of design-agent-reviewed component-builder detail plans, combined-document guidance, visible workflow-benchmark context, and role/skill normalization. Terra and Sol provided advisory input; these refinements have not received a fresh bounded alternate-family review. Read its `target-design.md`, `review-manifest.md`, `sol-mermaid-diagram-proposal-draft5.md`, `sol-review-terra-human-gated-plan-amendments.md`, and the creator-model repair records. Present the resulting content to the user for explicit high-level design alignment. If the user requests a substantive design change, create a further successor and perform the required bounded review; if the user aligns, record that decision before proceeding. Do not derive implementation detail, create tasks, or request kick-off before user design alignment. After alignment, ask Terra to create bounded detail-plan chunks and have Sol review each chunk before presenting the proposed first implementation slice for the user's kick-off decision.
