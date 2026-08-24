# Terra review of target-design package draft

This advisory, read-only review assessed `drafts/agentic-development-system-target-design/` against the canonical handoff, current records, the latest Terra/Sol design-flow reports, and the repository instructions. It does not adopt target contracts, create tasks, authorize implementation, or approve presentation.

## Verdict

**Revise before Sol review.** The package has a strong direction and preserves current/planned separation, but its migration ledger is internally inconsistent and several review-critical contracts are not exact enough.

## Strengths

- Current architecture, proposed target, and implementation authority are explicitly separated.
- The package correctly uses Path A, bounded implementation-unit readiness, and design-changing feedback.
- Authority boundaries among human, router, orchestrator, worker, validator, semantic reviewer, integration owner, and evaluator are substantially clear.
- The first-slice risk posture correctly excludes credentials, external effects, distribution claims, and security-isolation claims.
- The Grok review is sequenced after Terra/Sol and before Terra reconciliation and fresh Sol review.
- The package does not silently drop current agents or skills and correctly treats `drafts/composable-skills.md` as proposal direction.

## Required revisions

1. Repair the migration ledger so each target identifier occurs once and proposal headings are represented as inputs to the same canonical row rather than duplicate rows.
2. Represent exactly the 24 actual reusable headings in `drafts/composable-skills.md`, four explicitly labelled new reusable additions, the 12 actual master headings, and two explicitly labelled new master additions. Do not use false draft anchors for additions.
3. Normalize the target roster: design orchestration is a workflow assignment unless a separate target agent contract is intentionally added; Grok is an external review gate, not a migrated production agent.
4. Default the `as-is` router disposition to retain/adapt; replacement requires demonstrated need, consumer inventory, compatibility tests, and a deprecation trigger.
5. Add a review manifest distinguishing draft-for-review, frozen review revision, human-aligned revision, superseded, and revoked states. Include file set, integrity method, and affected current-record linkage plan.
6. Make both benchmark contracts operationally exact: finite per-run difference manifests, manifest owner/storage, proposed rubric and decision logic, repetition classification, and host-mediated provider access versus task-facing network access.
7. Add mock-consumer ownership, logical placement, allowed/prohibited writers, creation/removal authority, declared writes, cleanup, and recovery rules.
8. Add a Grok gate defining provenance verification, sanitized trial packet, measures, bounded budget, pass/replace decision, and preservation of dissent.
9. Normalize all component-design documents against the planned template and link each to the ledger without duplicating ledger authority.
10. Replace wildcard/category “exact source” entries with exact current paths, exact proposal identifiers, or explicitly named new-target additions.

## Residual uncertainty

Keep human holder identities, exact feature/seed/revisions, final design-link contract, host enforcement, Grok provenance/trial results, consumer inventories, and external distribution behavior unresolved. No implementation should begin from this package or this review.
