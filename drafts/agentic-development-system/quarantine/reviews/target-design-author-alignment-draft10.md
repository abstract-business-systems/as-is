# Target-design author alignment — human questions and parent/child realization

This is the target-design author's bounded, read-only alignment response to the user's latest correction. It does not approve the design, adopt contracts, create tasks, authorize kick-off, or authorize implementation.

## Human decision surface

The author agrees that sections 17, 18, and 19 must not be presented as a questionnaire that the human answers item by item. The smallest ordinary human decision is acceptance, revision, deferral, or rejection of one exact frozen design-and-implementation envelope.

Section 17 therefore identifies only consequential envelope choices: goal and outcome, component ownership or boundaries, authority and protected controls, acceptance and risk, and blocking product or policy choices. Section 18 contains author/open design questions and admission blockers owned by the relevant design or operational owner. Section 19 contains provisional operational-contract questions that must be resolved before the dependent transition but are not individual human questions. An operational question returns to Human Review only if resolving it changes the accepted envelope and cannot safely be deferred.

## Parent/child realization alignment

The author agrees with the intended realization flow:

1. A parent backlog item is planned from the parent component's `as-is.md`.
2. The parent identifies impacted children and required child changes.
3. The parent writes each child-specific plan into that child's planned section or equivalent child-scoped planning artifact.
4. Plan injection is checked at parent scope before child launch.
5. A fresh `component-builder` instance is created from each particular child's own record.
6. The child implements its injected plan, performs child-level verification, and integrates its own result with the parent worktree.
7. The child reports implementation, child verification, integration, blocker, unresolved-question, and recovery status.
8. The parent records plan accounting and child dispositions; it does not semantically verify, revalidate, cherry-pick, or integrate the child implementation.

The author differs only in terminology that must be made explicit: the target draft currently describes “parent verifies plan injection.” If the user's statement that the parent does not verify anything means that the parent component-builder itself performs no verification, the final target should name a separate **parent-level verification** step or control after plan injection, without assigning it to the parent planner. The parent planner remains responsible for planning and injection; the child remains responsible for implementation verification and integration.

## Target-design implications

- The parent/child section must distinguish parent planning/injection from parent-level verification and from child-level verification.
- The target must not assign parent semantic verification, child-result revalidation, cherry-picking, or integration approval to the parent planner.
- A fresh child-scoped component-builder, not a generic task-implementer, is the target realization unit for a separately owned child.
- Any parent-worktree integration operation must remain scope-preserving, recoverable, and serialized or conflict-rejecting.
- The current parent-side integration and validation assignment remains current-state authority and must be labelled as a proposed target difference.
