# Task

## Requirement
Implement the selected `skills/managing-backlog:component-ownership-and-reconciliation` task. Extend the existing deterministic backlog query owner with a narrow, explicit reconciliation surface that loads component ownership context from `as-is.md`, searches only ancestor/descendant candidates, and applies caller-authorized move, remove, combine, or split operations while preserving schema fields, Markdown-bearing cells, dependencies, provenance, links, and recovery. Do not infer semantic equivalence or ownership from keywords, create a registry/framework, change task authority, evaluate completion, or broaden cleanup behavior.

## Plan
1. Inspect the existing backlog parser/query/cleanup implementation, component records, naming guidance, and task protocol.
2. Add deterministic component-context loading, hierarchy candidate detection, and explicitly authorized reconciliation operations with in-memory validation before writes.
3. Add focused fixture coverage for ownership, hierarchy, equivalence candidates, removal, move, combine, split, dependency rewrites, provenance, atomic refusal, and unchanged cleanup behavior.
4. Update the reusable skill and durable component record only for the bounded reconciliation contract.
5. Run focused tests and repository schema/content/task/JSON/whitespace checks, then obtain final review and complete exact cleanup.

## Progress
Selected from the highest available bounded backlog item after the root readiness and organization tasks completed. Existing `query.ts` provides schema parsing, dependency-aware query weighting, representation validation, and evidence-gated completion cleanup, but no ownership-context or proposal-reconciliation operations. The implementation will remain planning-only and caller-authorized: candidate detection is evidence, not semantic authority.

## Validation
Pending implementation and focused fixture coverage.

## Result
Pending.

## Blockers And Escalations
No blocker currently known. Semantic equivalence, automatic owner selection, sibling consolidation, preference/status merging, and split dependency allocation must remain explicit caller decisions. Reject ambiguous, out-of-scope, malformed, unknown, or unresolved operations without writing any backlog file.

## Recovery
The task-start handoff records the selected backlog row and local task metadata. Stage reconciliation plans in memory and validate every affected backlog before writing. If validation fails or work is interrupted, preserve current backlog files, task records, changelogs, and cleanup behavior; resume from the latest durable code/test checkpoint or revert only the scoped implementation and documentation changes.

## Next Action
Implement the narrow reconciliation surface and focused tests within `skills/managing-backlog/`, then record acceptance evidence before exact backlog cleanup.
