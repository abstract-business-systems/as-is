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
| Branch role | `implementing-composable-skills` is the candidate and recovery/reversal boundary for this exercise; it need not be `master` |
| Baseline | A pinned `master` revision is checked out separately only for the later benchmark of older current behavior; it is not a universal working branch or approval source |
| Working tree | The concise frozen construction-agent profile-binding Draft 3 document, its freeze record, and refreshed status pointers are committed; no implementation changes. The construction-agent model-selection checkpoint is `0391ac4`, the independent-candidate-boundary checkpoint is `ec084be`, and the prepared task-start checkpoint `0283acd`, admission preflight `4a027a8`, and correction checkpoint `925241d` are preserved as historical evidence. |
| Planning stage | Draft 11 is the frozen and human-accepted target envelope. Overall realization roadmap Draft 12 is now human-accepted as the controlling construction-planning map; it restores the broad design→approval→implementation→benchmark→adoption/merge sequence and records the corrected Terra/Luna coding and Sol/Terra agents-and-skills flows. Implementation remains separately unauthorized |
| Latest authoring/review status | Draft-10 author recommendations were incorporated into draft 11. The exact draft-11 packet received a bounded read-only review with no supported repair. Detail-plan draft 13 was reviewed with no supported repair; the owner-and-pilot decision is recorded. Focused parallel-child clarification draft 2 received actual Sol and Kimi reviews and Sol marked it ready; draft 1 remains preserved as predecessor evidence. Overall roadmap Draft 12 was authored by Sol after historical-context reconciliation and successive bounded repairs, received exact read-only review, and is human-accepted as the controlling construction map. The Draft-12 packet identity and freeze record are preserved. Broader blocker-resolution drafts remain quarantined provenance, not the active planned flow |
| Review status | Human accepted the target design envelope, realization roadmap, and flow plans. The user locked the direct implementation plan (`designs/agentic-development-system-implementation-plan.md`) with the updated OpenRouter model roster (`implementer`, `worker`, `planning-adviser`, `external-adviser` with `thinking: high`). Ready for direct implementation across 3 milestones |
| Implementation | Authorized for candidate realization starting with Milestone 1 post-compaction |
| Current owner | Project orchestrator / Implementer for candidate construction on `implementing-composable-skills` |
| Next review gate | None blocking code start. Post-compaction action is direct implementation of Milestone 1 in `candidate/execution-control/` and `candidate/tests/execution-control/` |
| Later review gate | After pilot-plan review and a separate user kick-off/task authorization, the parent component builder plans from its own anchor, prepares child plans as part of its one bounded task, and fresh child-scoped component-builders implement, verify, and integrate; no implementation begins before those gates |
| Bounded review | `reviews/agentic-development-system/expert-high-level-design-review-draft11.md` reports no supported repair within scope; the review is evidence only. Human acceptance is recorded separately and does not authorize implementation |

## Canonical program status

This section is the single durable program-status summary. Component `tasks.md` files remain transient, component-scoped task narratives paired with local JSON task authority; they are not a program dashboard. The continuity checklist is navigation and verification support, not a second status authority.

- **Final goal:** Realize and evidence a human-centered agentic development system on `implementing-composable-skills` with deterministic admission, atomic reservations, parent-closure evaluation, composable skills, and benchmark evidence.
- **Current phase:** Direct 3-milestone implementation under `candidate/`.
- **Milestone 1:** **COMPLETED**. Candidate Execution-Control Kernel (`candidate/execution-control/types.ts`, `reservation.ts`, `admission.ts`, `closure.ts`, `index.ts`) and full deterministic test suite (`candidate/tests/execution-control/`, 24/24 passing tests) implemented and evidenced at `candidate/evidence/milestone-1-execution-control.md`.
- **Milestone 2:** **READY TO START**. Composable Skills Engine and Agent Roster (`candidate/skills/` + `candidate/agents/` + `candidate/tests/skills/`).
- **Milestone 3:** End-to-End Testbed & Baseline Benchmark (`candidate/tests/` + pinned `master` benchmark).
- **Authority state:** Candidate implementation progressing cleanly in `candidate/` namespaces; existing repository `core/` contracts and `as-is.md` records preserved.
- **Verified against:** Frozen executable-plan SHA-256 `ef2c7c5bd760e8e1bacd795fec18ad1b4dbf7264d1d6260c9dc383e612348716`; accepted-plan record `reviews/agentic-development-system/executable-realization-plan-draft6-human-review-acceptance.md`; task-start checkpoint `0283acd`; admission preflight `reviews/agentic-development-system/first-task-control-slice-admission-preflight.md`; construction-flow correction checkpoint `925241d`; model-binding selection brief `reviews/agentic-development-system/construction-agent-model-binding-selection-decision-brief.md`; frozen Draft-1 packet digest `dac951b29f2577cd3468d76934d1b416f22f47481ed2756d47a3ab704f5e2b5f`; freeze record `reviews/agentic-development-system/construction-agent-model-binding-draft1-freeze.md`; Kimi review `reviews/agentic-development-system/kimi-construction-agent-model-binding-draft1.md`; caller identity verification `reviews/agentic-development-system/construction-agent-model-binding-draft1-caller-identity-verification.md`; Human Review acceptance `reviews/agentic-development-system/construction-agent-model-binding-draft1-human-review-acceptance.md`; model-selection revision `reviews/agentic-development-system/construction-agent-model-selection-revision-decision-brief.md`; frozen concise profile-binding Draft 3 `drafts/agentic-development-system-construction-agent-profile-binding-draft3.md` at SHA-256 `e57110763d5fc6183f000302e7aee262168bf216c4112bf00335f4e7e52e64ac`, with freeze record `reviews/agentic-development-system/construction-agent-profile-binding-draft3-freeze.md`; custom-agent candidate-boundary correction and current-branch decision `reviews/agentic-development-system/custom-agent-candidate-boundary-correction-decision-brief.md`; independent-candidate-boundary checkpoint `ec084be`; current cancelled task records contain no implementation files.

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

- **After Human Review acceptance:** Review the proposed first-task kick-off brief at `reviews/agentic-development-system/first-task-control-slice-kick-off-decision-brief.md`. The proposed scope is the unaffected `core/modules/task-control` branch only; the user must authorize preparation, request changes, defer, or decline before task records are created. Later decisions still select individual holders, exact worker/model facts, and benchmark inputs. These are planning and kick-off decisions, not implementation authorization.
- **Current executable-plan review:** The exact frozen draft 6 plan was accepted in Human Review on 2026-08-29; acceptance is recorded in `reviews/agentic-development-system/executable-realization-plan-draft6-human-review-acceptance.md`. Freeze provenance is in `reviews/agentic-development-system/executable-realization-plan-draft6-freeze.md`, with SHA-256 `ef2c7c5bd760e8e1bacd795fec18ad1b4dbf7264d1d6260c9dc383e612348716`. Acceptance is a planning gate only and does not authorize task creation, kick-off, or implementation.
- **Current overall roadmap:** The exact human-accepted Draft-12 packet is `drafts/agentic-development-system-overall-realization-roadmap-draft12/`; its caller freeze record is `reviews/agentic-development-system/overall-realization-roadmap-draft12-freeze.md`, and its exact review is `reviews/agentic-development-system/overall-realization-roadmap-draft12-exact-review.md`. Draft-12 packet digest is `797ed521be694c36d08398a50e1fa17ea6c37c19b507d3fb557834413ac98124`. This is a construction-planning map only; it contains no task or implementation authority.
- **Current planning artifacts:** The frozen executable realization plan is `drafts/agentic-development-system-executable-realization-plan-draft6.md`; drafts 1–5 and their reviews remain preserved predecessors.

The active path is target-design author recommendations → draft-11 successor → bounded design-document review → user Human Review acceptance of the exact envelope → draft-13 bounded detail planning and review → owner/pilot planning decision selecting `validation-fixtures/dummy-delegation` → focused parallel-child clarification draft 1 → actual Kimi review → actual Sol disposition → focused draft-2 successor → actual Sol/Kimi review → executable realization plan draft 6 (frozen SHA-256 `ef2c7c5bd760e8e1bacd795fec18ad1b4dbf7264d1d6260c9dc383e612348716`) → final Sol readiness review → Human Review of the exact plan → separate kick-off/task authorization for an explicitly bounded unaffected slice → task-control admission → build the new structures and focused checks → exercise the candidate flow → approve and run the benchmark. The broader process-adapter capability question and integration-dependent proof are deferred, as recorded in `reviews/agentic-development-system/sol-process-adapter-boundary-advice.md`.
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

The detailed historical path and preserved predecessor rationale are represented by the linked records above. The current path is summarized in **Canonical program status**: accepted planning → kick-off decision → exact task preparation and admission → bounded implementation → candidate proof → separately approved benchmark → migration/adoption/retirement/merge decisions → program closure. Broader blocker-resolution exploration remains quarantined provenance, and target skills, agents, workflows, and dispositions remain proposed until later authorized migration.

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

Read this handoff first, then reference the locked implementation plan:

1. `designs/agentic-development-system-implementation-plan.md`
2. `candidate/evidence/milestone-1-execution-control.md`

**Current state:** Milestone 1 completed and verified (24/24 tests pass). Candidate kernel established in `candidate/execution-control/`.

**Next action:** Execute **Milestone 2**: Composable Skills Engine and Agent Roster (`candidate/skills/`, `candidate/agents/`, and automated tests in `candidate/tests/skills/`).

The canonical program-status section above holds current state and links; do not recreate historical planning detail in a new-session prompt or handoff.
