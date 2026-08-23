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
| Working tree | Handoff and two review reports added by this session; no implementation changes or commits |
| Planning stage | Architecture/review loop complete for the design-creation flow; target-design package generation is next |
| Latest Terra verdict | Advisory revised design-creation flow ready for fresh Sol review |
| Latest Sol verdict | **Approve readiness for the human-facing target-design package** |
| Implementation | Not authorized and must not begin |
| Current owner | Present orchestration session, then the user for explicit target-design alignment |
| Next review gate | Terra-Sol ping-pong review of the generated target-design package; nothing un-reviewed is presented to the user |
| Later review gate | Fresh Sol review of the design-derived build plan after user alignment |
| Alternate reviewer | Human selected Grok 4.6 as the intended additional-family reviewer; bounded verification/trial remains required before use |

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
| `reviews/agentic-development-system/sol-final-design-creation-flow-review.md` | **Approve readiness for human-facing target-design package** | Latest Sol review; advisory readiness only |
| `reviews/agentic-development-system/openrouter-benchmark-screening.md` | Screened alternate-family reviewer candidates | External screening evidence; not selection or family proof |
| `drafts/composable-skills.md` | Composable reusable/master skill proposal | Proposal direction only |
| `drafts/backlog.md` | Planning index and historical proposal context | Not task authority |

The final Terra-Sol pair resolved the prior objections and corrected the design-creation flow. Neither report approves implementation or adopts target contracts.

## Design-creation flow now in force for planning

1. Generate a human-facing target-design package, ideally a folder with a root overview, component target designs, one canonical migration ledger, setup/benchmark design, and decision log.
2. Keep current implementation records and planned target designs explicitly separate. Initially use a frozen, revisioned target package linked from current records rather than silently changing current `as-is.md` meaning.
3. Review the generated package internally through Terra-Sol ping-pong. Terra revises from concrete objections; a fresh Sol review assesses each material revision. The user has selected `x-ai/grok-4.6` as the intended additional-family reviewer based on the OpenRouter screening, and Sol does not appoint it. Before use, verify its exact model identity/family provenance and run the bounded local trial. The selected alternate reviewer reviews the same frozen package and returns findings to Terra, followed by fresh Sol review. Only a fully reviewed package is presented to the user.
4. Present the reviewed package to the user for explicit alignment and decisions.
5. Classify user responses as editorial clarification or **design-changing feedback**. Any design-changing feedback returns the package to Terra-Sol review before presentation.
6. After user alignment, derive a bounded build plan from the aligned designs. It must identify affected components, required base records, dependencies, owners, acceptance, validation, recovery, candidate/baseline worktrees, and protected fixtures.
7. Send the build plan to a fresh Sol review. If Sol objects, return it to Terra for revision and repeat until Sol approves readiness for human-facing build-plan review.
8. Present only the Sol-reviewed build plan to the user for explicit confirmation. This still does not authorize implementation.
9. Begin implementation only after the applicable base design records are available, linked, current, and approved; required holders and capability boundaries are confirmed; and a separate bounded implementation task is explicitly authorized.

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

- Confirm the target-design package structure and current/planned representation.
- Confirm staged heavy refactoring with the broad evidence-based total-rewrite escape.
- Select the first mock feature or qualifying simple backlog item.
- Appoint accountable holders for design orchestration, design facilitation, setup, semantic review, evaluation/scoring, migration, fixture ownership, and task authorization.
- Confirm the repository-local first-slice boundary: no credentials, external effects, package/distribution claim, or security-isolation claim.
- Confirm or revise the human-selected Grok 4.6 alternate-family reviewer after its identity/provenance check and bounded local trial.
- Approve the benchmark rubric, safety-critical failures, and exact advancement rule.
- Align explicitly on the generated target-design package.
- After design alignment, align on the Sol-reviewed build plan before any separate task authorization.

## Residual uncertainty

- Runtime enforcement of worktree, filesystem, network, credential, directory, and fixture protections remains untested.
- No mock feature, seed revision, baseline revision, candidate revision, or accountable holder identity is selected.
- The exact design-link/currentness representation remains unadopted.
- No consumer inventory or migration trial exists for future renames/adaptations.
- The selected alternate reviewer is `x-ai/grok-4.6` (benchmark entry `x-ai/grok-4.6-20260810`); exact identity/family provenance and bounded local review performance remain unverified. The human selected it; Sol does not appoint it. Screening evidence is recorded in `reviews/agentic-development-system/openrouter-benchmark-screening.md`.
- External installation, distribution, package provenance, upgrades, downgrade, uninstall, and multi-project isolation remain unproven.

## Explicit authority statement

The latest Sol verdict approves readiness to prepare and present the human-facing target-design package. It does not approve the package itself, approve a build plan, adopt target contracts, create task authority, or authorize implementation.

Nothing unreviewed is to be presented to the user. Terra-Sol ping-pong is required during design generation and after any design-changing feedback. For the generated design package, the human-selected `x-ai/grok-4.6` review must use the same frozen package, remain read-only, and return findings to Terra followed by fresh Sol review before presentation. After user alignment, a fresh Terra-Sol cycle is required for the design-derived build plan. Only explicit user alignment plus a separately authorized bounded implementation task may begin implementation.

## New-session next action

Read this handoff first. Then generate the target-design package in the proposed structure, keeping it as planned design and preserving current-state links. Do not present drafts to the user before Terra review, fresh Sol review, and the human-selected Grok 4.6 review after identity/provenance verification and bounded trial. Preserve every review report durably. After all required reviews approve readiness, present the package for user alignment. After alignment, derive the build plan and send it through a fresh Terra-Sol review before any implementation authorization is considered.
