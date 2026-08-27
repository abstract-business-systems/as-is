# Agentic Development System - Consolidated Continuation Handoff

Purpose: Preserve the current design-review checkpoint, exact packet identity, authority boundaries, and safe next action for the agentic-development-system rearchitecture.

## Purpose and authority

This document is the consolidated continuation checkpoint for the agentic-development-system rearchitecture. It is a draft and durable handoff, not current-architecture authority, target-contract authority, task authority, implementation authorization, or runtime configuration. It consolidates the active decisions, user inputs, review outcomes, unresolved questions, disposition tables, and next-session instructions. The longer reports listed under provenance remain source evidence and audit history in `reviews/agentic-development-system/`; this document is the canonical navigation point for a new orchestration session.

**Core principle:** Humans focus on design and features; agents take care of implementation. Human-facing agents accommodate limited attention, working memory, and time by explaining necessary technical terms, presenting the smallest sufficient information for the next safe decision, and preserving links to complete evidence. Implementation is the verified, evidence-bearing realization of human-facing design, analogous to compiled output for human review. This is a metaphor, not a claim that implementation is literally compilation or trustworthy without deterministic verification and review.

## Current checkpoint

| Field | State |
| --- | --- |
| Repository | `/home/vc/dev/as-is` |
| Branch | `implementing-composable-skills` |
| Branch role | Candidate and recovery/reversal boundary for this exercise; it need not be `master` |
| Baseline | A pinned `master` revision is an evaluation baseline only; it is not a universal working branch or approval source |
| Working tree | Scoped documentation checkpoint is staged and ready for commit: accepted planning, focused parallel-child clarification and actual Sol/Kimi reviews, quarantined exploratory drafts, continuity records, and handoff updates; no implementation changes |
| Planning stage | Draft 11 is the frozen and human-accepted successor to draft 10. It incorporates the aligned recommendations for component anchors, anchor-scoped/literal-link discovery, nearest-common-ancestor backlog handling, one parent bounded task, understandable language, and recommendation-led Sections 18–19. Detail planning may now begin within this envelope; implementation remains separately unauthorized |
| Latest authoring/review status | Draft-10 author recommendations were incorporated into draft 11. The exact draft-11 packet received a bounded read-only review with no supported repair. Detail-plan draft 13 was reviewed with no supported repair; the owner-and-pilot decision is recorded. The focused parallel-child clarification draft 1 received actual Sol and Kimi reviews; Sol disposition requires two focused repairs in one successor. Broader blocker-resolution drafts are retained as quarantined provenance, not the active planned flow |
| Review status | Human accepted the exact draft-11 envelope. Acceptance, reviewed detail planning, and owner/pilot planning are recorded. The focused parallel-child clarification received actual Sol review (`revise`) and actual Kimi review (`pass` with findings); Sol accepted two findings for one focused successor and deferred or rejected the others. No task, kick-off, target-contract adoption, or implementation is authorized |
| Implementation | Not authorized and must not begin |
| Current owner | Project orchestrator, for bounded pilot planning within the accepted draft-11 envelope; role/component planning owners are recorded, while individual workers are not yet appointed |
| Next review gate | After the authorized documentation checkpoint commit and compaction, create one focused successor of the parallel-child clarification with Sol's two accepted repairs, obtain actual Sol/Kimi review of that exact successor, then derive the executable realization plan; implementation still requires separate human kick-off and task-control admission |
| Later review gate | After pilot-plan review and a separate user kick-off/task authorization, the parent component builder plans from its own anchor, prepares child plans as part of its one bounded task, and fresh child-scoped component-builders implement, verify, and integrate; no implementation begins before those gates |
| Bounded review | `reviews/agentic-development-system/expert-high-level-design-review-draft11.md` reports no supported repair within scope; the review is evidence only. Human acceptance is recorded separately and does not authorize implementation |

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
- **Current user direction:** The user accepted the exact frozen draft-11 design-and-implementation envelope. The acceptance covers understandable technical language, `as-is.md` component anchors, anchor-scoped/literal-link planning discovery, nearest-common-ancestor backlog creation during planning, one parent bounded task spanning parent and child subtasks, recommendation-led Sections 18–19, and no alternate review. Acceptance authorizes bounded detail planning within the envelope only; it is not task creation, kick-off, target-contract adoption, or implementation authorization.

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
| `reviews/agentic-development-system/sol-final-design-creation-flow-review.md` | **Approve readiness for human-facing target-design package** | Historical advisory review; superseded by draft 11 and its recorded Human Review acceptance |
| `drafts/agentic-development-system-high-level-design-draft4/` | Frozen human-facing high-level design; packet digest `4f174a90734ecbbab61b98adbd2cdbc9ba75595ba123697edd5248333afa48f9` | Preserved reviewed predecessor |
| `drafts/agentic-development-system-high-level-design-draft11/` | Frozen successor incorporating the accepted anchor, planning-scan, parent-task, human-language, and safeguard recommendations; packet digest `8601188128ed2fff4aa64f75f339f7962e88358806f470643aa8455f565665e2` | Human-accepted design envelope; bounded detail planning may proceed, while target adoption and implementation remain unauthorized |
| `reviews/agentic-development-system/kimi-high-level-design-review-draft1.md` through `kimi-high-level-design-review-draft4.md` | Historical Kimi alternate-family review records | Advisory provenance only; alternate review is not a target-system requirement |
| `reviews/agentic-development-system/sol-disposition-kimi-review-draft1-round2.md`, `sol-disposition-kimi-review-draft2-round4.md`, `sol-disposition-kimi-review-draft3-round6.md` | Sol dispositions of Kimi findings | Advisory repair specifications; all applied to successors |
| `reviews/agentic-development-system/sol-closure-high-level-design-draft4-round8.md` | Sol closure disposition | Advisory readiness for user high-level design alignment; no successor required |
| `reviews/agentic-development-system/openrouter-benchmark-screening.md` | Screened alternate-family reviewer candidates | External screening evidence; not selection or family proof |
| `drafts/composable-skills.md` | Composable reusable/master skill proposal | Retained as non-authoritative input; selectively incorporated, not adopted as a catalog or replacement mandate |
| `drafts/backlog.md` | Planning index and historical proposal context | Not task authority |

The historical Terra, Sol, and Kimi records are advisory provenance only. Drafts 1–10 preserve earlier planning and review evidence; draft 11 is the exact current presentation packet reviewed by a bounded read-only expert. No report approves implementation or adopts target contracts.

## Simplified design-and-planning flow now proposed

The user accepted the flow of one high-level design envelope followed by bounded detail chunks. The word “package” means a frozen, human-reviewable document bundle—not an installable software package, an implementation task, or an approval. A package has an exact revision, file set, manifest, and identity so reviewers can say precisely what they saw. A later detail package is one bounded design or implementation-plan chunk with its own context, scope, inputs, outputs, and acceptance conditions; it may cover a component, capability, or cross-component slice.

### A. High-level design and Human Review

1. **Interactive Design / Prototyping.** The design owner and human clarify goals, inspect relevant current `as-is.md` anchors and literal links, build prototypes or structured views, define component ownership, and derive the bounded implementation envelope. The proposal may introduce, modify, compose, retain, deprecate, replace, or drop target skills, agents, workflows, and boundaries, subject to explicit migration evidence.
2. **Freeze the exact envelope.** Record the exact packet revision, file set, manifest, packet identity, current-state baseline, accepted-target proposal, unresolved-question dispositions, review scope, and limitations. A package edit creates a successor revision; it does not rewrite the reviewed predecessor.
3. **Bounded review evidence.** A read-only design-document review may identify supported repairs within its declared scope. It cannot edit, approve, create tasks, or authorize implementation. Alternate-model or alternate-family review is not a target-system requirement.
4. **Human Review.** Present the human-facing design, concise decision brief, unresolved consequential choices, residual risks, and exact packet identity. The user may accept, request revision, defer, or reject. A requested design change returns to Interactive Design / Prototyping; acceptance is required before detail planning and does not itself authorize implementation.

### B. Bounded detail-plan chunks after Human Review acceptance

6. **Derive one detail chunk at a time.** After acceptance, the planning owner adds implementation-ready detail without silently changing the accepted direction. Each chunk has a named bounded context, purpose, affected component(s), design references, dependencies, owners, capabilities, protected inputs, acceptance, deterministic validation, semantic review, integration, recovery, explicit non-goals, and unresolved questions. Chunks may be reviewed independently and may not assume authority over unrelated components.
7. **Review and advise each chunk.** A bounded read-only review checks traceability to the accepted high-level design, scope, authority separation, dependency completeness, validation, recovery, and honest exclusions. The planner responds to findings. Each chunk gets at most one bounded repair cycle; genuinely new design concerns or disagreement about an acceptance condition escalate to the user instead of opening another automatic loop.
8. **Close the detail-plan set.** Record which chunks are complete, blocked, deferred, or dependent on another chunk. Confirm that the set is coherent enough for the next human decision, without turning that confirmation into task authority.
9. **Ask the user for a kick-off decision.** Present the accepted high-level design, reviewed detail chunks, dependencies, open risks, and the proposed first bounded implementation slice. The user may authorize kick-off, request changes, defer, or decline. “Kick-off” must mean permission to prepare or start the named first bounded task only; it must not be interpreted as blanket authorization for the whole rearchitecture.

### C. Downstream execution after kick-off

10. Confirm applicable base records, holders, capabilities, protected controls, exact task scope, and task-specific authorization.
11. Create and authorize one bounded implementation task.
12. Run the admitted worker, deterministic validation, independent semantic result review, receiving-owner integration, and post-integration revalidation.
13. Record failure, recovery, escalation, evidence, and residual risk. Compare current and candidate workflows only under the separately approved setup/evaluation protocol.

### Simplification limits

- The accepted high-level design has one authoring stream, one bounded design-document review, and one Human Review decision. Historical multi-model review rounds are provenance only and are not a target-system requirement.
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

- **After Human Review acceptance:** Select the first mock feature or qualifying simple backlog item, appoint accountable holders, confirm the repository-local first-slice boundary, approve benchmark inputs and advancement rules, and decide the separately bounded kick-off scope. These are planning and later kick-off decisions, not implementation authorization.
- **Current planning artifacts:** The reviewed detail-plan chunk is `drafts/agentic-development-system-detail-plan-component-builder-realization-transition-draft13.md`, with its bounded review in `reviews/agentic-development-system/expert-component-builder-realization-transition-detail-plan-draft13.md`. The owner and pilot decision is `drafts/agentic-development-system-owner-and-pilot-selection-draft1.md`. The focused requested artifact is `drafts/agentic-development-system-parallel-child-build-processing-draft1.md`; actual reviews are `reviews/agentic-development-system/sol-parallel-child-build-processing-draft1.md` and `reviews/agentic-development-system/kimi-parallel-child-build-processing-draft1.md`. The continuity records are `handoffs/agentic-development-system-continuity-checklist.md` and `drafts/agentic-development-system-review-thread-recovery-draft1.md`. Broader blocker-resolution drafts and their reviews are moved under `drafts/agentic-development-system/quarantine/`, with reviews in its `reviews/` subdirectory; they are preserved provenance, not the active flow. The scoped documentation checkpoint is authorized for commit in the current turn and is staged after `git diff --cached --check` passed.
- **Retained design recommendation:** Staged heavy refactoring with a broad evidence-based total-rewrite escape remains the proposal; it need not be decided separately unless its unresolved alternative changes the accepted envelope.
- **Material envelope changes:** Any change to the accepted goal, boundary, authority, protected input, acceptance condition, risk posture, or permitted external effect requires a successor packet with a new manifest, digest, and Human Review decision.

## Residual uncertainty

- Runtime enforcement of worktree, filesystem, network, credential, directory, and fixture protections remains untested.
- No mock feature, seed revision, baseline revision, candidate revision, or accountable individual worker or human decision-holder identity is selected; the selected pilot is the existing provider-free `validation-fixtures/dummy-delegation` fixture. The blocker-resolution plan does not clear runtime evidence blockers.
- The exact design-link/currentness representation remains unadopted and is part of future bounded detail planning.
- Role/component planning accountability and the concrete `validation-fixtures/dummy-delegation` pilot are recorded in `drafts/agentic-development-system-owner-and-pilot-selection-draft1.md`; the blocker-resolution plan records candidate responses but does not appoint individual runtime workers or human decision holders.
- No consumer inventory or migration trial exists for future renames/adaptations.
- Historical alternate-family review records are retained as provenance only. They are not a requirement, gate, or authority in the target system. The applicable bounded review for draft 11 is recorded in `reviews/agentic-development-system/expert-high-level-design-review-draft11.md`.
- External installation, distribution, package provenance, upgrades, downgrade, uninstall, and multi-project isolation remain unproven.

## Explicit authority statement

This handoff records the human acceptance of the exact draft-11 design-and-implementation envelope and the next bounded-planning checkpoint. It does not adopt target contracts into current architecture, create task authority, authorize kick-off, or authorize implementation. Authoring, bounded review, hashes, and process exits are evidence only. The user retains authority over material envelope changes and kick-off; a separate bounded task authorization remains required.

The active path is target-design author recommendations → draft-11 successor → bounded design-document review → user Human Review acceptance of the exact envelope → draft-13 bounded detail planning and review → owner/pilot planning decision selecting `validation-fixtures/dummy-delegation` → focused parallel-child clarification draft 1 → actual Kimi review → actual Sol disposition → focused successor → actual Sol/Kimi review → executable realization plan → human review and separate kick-off/task authorization → build the new structures → exercise the candidate flow → approve and run the benchmark. Broader blocker-resolution exploration is quarantined provenance, not the active path. Draft 11 has no supported repair within the bounded review scope, and its acceptance is recorded separately. Draft 13 and the owner/pilot decision remain non-executable planning artifacts; drafts 11 and 12 are preserved predecessors. Target skills, agents, workflows, and their dispositions remain proposed target changes and do not become current architecture without later authorized migration.

### Why the active design has multiple drafts

Drafts 1–4 are not four competing designs or an unbounded loop. Each successor preserves its predecessor and records one bounded repair response to specific review findings:

| Revision | Reason for successor | Review result |
| --- | --- | --- |
| `draft1` | Initial Sol-authored high-level design. | Kimi identified seven bounded repairs. |
| `draft2` | Applied the seven accepted or narrowed repairs from Sol round 2. | Kimi identified three bounded repairs: section numbering, G3/detail ordering, and terminology/duplication. |
| `draft3` | Applied those three bounded repairs. | Kimi identified one minor duplicate paragraph. |
| `draft4` | Removed that duplicate and aligned one non-blocking term. | Kimi found no supported manifest-scoped repair; Sol closed the review early. |

This revisioning was necessary to keep each review tied to exact bytes and to prevent edits from silently changing what an earlier reviewer saw. It was not intended as a normal requirement for many drafts. Under the active rule, the design loop is capped at 10 counted Kimi/Sol rounds, exits early when the fixed manifest checklist has no supported repair remaining, and escalates unresolved material disagreement at the bound. No further successor is planned unless the user requests a design change or a new material issue requires a bounded successor.

## New-session next action

Read this handoff first. The current continuation point is Human Review acceptance of the exact draft-11 packet `drafts/agentic-development-system-high-level-design-draft11/`, recorded in `reviews/agentic-development-system/target-design-human-review-acceptance-draft11.md`. The reviewed first detail-plan chunk is draft 13 at `drafts/agentic-development-system-detail-plan-component-builder-realization-transition-draft13.md`, reviewed in `reviews/agentic-development-system/expert-component-builder-realization-transition-detail-plan-draft13.md`. The owner-and-pilot planning decision is `drafts/agentic-development-system-owner-and-pilot-selection-draft1.md`: role/component accountability is appointed and `validation-fixtures/dummy-delegation` is selected as the first repository-local pilot. The focused parallel-child clarification is `drafts/agentic-development-system-parallel-child-build-processing-draft1.md`. Its actual Kimi review is `reviews/agentic-development-system/kimi-parallel-child-build-processing-draft1.md`; its actual Sol review and disposition is `reviews/agentic-development-system/sol-parallel-child-build-processing-draft1.md`, which requires one successor with two bounded repairs. Do not derive the executable realization plan until that successor has received actual Sol/Kimi review. Broader blocker-resolution drafts and reviews are preserved under the explicitly named `drafts/agentic-development-system/quarantine/` directory and its `reviews/` subdirectory; they are not the active flow. Do not create implementation tasks, request kick-off, adopt target contracts, or implement yet. Preserve the selected pilot, protected inputs, and `startsWork: false`. Commit and verify this scoped documentation checkpoint, then compact. After compaction, create the focused successor, complete actual Sol/Kimi review, derive and review the executable realization plan, and only after separate human kick-off and task-control admission build the new structures before exercising the candidate flow.
