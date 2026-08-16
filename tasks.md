# Task

## Requirement
Reconcile the root emitted-path policy to authorize navigable masked transient-runtime references while preserving raw host-path privacy, project-context template semantics, task authority, and owner-specific implementation boundaries.

## Plan
1. Add the exact root backlog item and update only root sequencing/dependency references so the policy precedes process-adapter enforcement and later execution-contract work.
2. Define the named `masked-runtime-references` configuration mode and the separate `<tmp>/as-is/<project-key>/<run-id>/<component-key>/<job-id>[/runtime-relative-path]` example form in `docs/execution-contract.md`.
3. Preserve the existing `<project-root>/relative/path` project-context form as a separate example with its existing provenance, grammar, containment, and fail-closed rules.
4. Validate policy wording, JSON/task/backlog/content/navigation/diagnostics/whitespace checks and obtain final read-only review.
5. Record completion evidence and clean the exact root backlog row and root task artifacts in one scoped completion commit.

## Progress
The root policy task was created after user clarification that navigation is required, only the host-private temporary prefix should be masked, and project/component/run/job structure should remain visible for debugging. The completed `root:reconcile-emitted-project-reference-policy` item remains historical evidence; this is a new prospective policy revision. Scope is documentation/configuration/backlog/task records only. No process adapter, launcher, recovery, tracer, task-control, schema implementation, host, target, or external behavior changes are authorized.

## Validation
Passed: root task-record validation returned `VALID`; root backlog query and schema validation passed; JSON parsing passed for root and child records; as-is/content navigation passed with 49 records and 47 diagrams; changed-document diagnostics reported no issues for `docs/configuration.md` and `docs/execution-contract.md`; and `git diff --check` passed. A final configured-large review initially found an ambiguity in the masked runtime layout; the policy was corrected to place `<job-id>` explicitly in the reference and carry the attempt ordinal as associated metadata. The final review found one source-layout mismatch and the policy was corrected to include `<job-id>` in the documented private runtime root. A final review is still required after this correction.

## Result
Pending. No runtime implementation or process-adapter conformance claim is made by this root policy task.

## Blockers And Escalations
The policy must define exact masked-reference eligibility, visible segment grammar, trusted runtime/project/run/job provenance, approved temporary-root containment, recipient resolution, non-authorizing navigation, and fail-closed handling for malformed, traversal-bearing, encoded, mismatched, out-of-root, and unproven values. The policy must not become a generic sanitizer or retroactively reinterpret completed owner implementations.

## Recovery
If interrupted, restore the root backlog, root `as-is.json`, `tasks.md`, and `docs/execution-contract.md` from the last consistent Git state before retrying. Do not edit child process records or implementation surfaces.

## Next Action
Complete the root policy wording and dependency updates, then validate and obtain final review before writing changelog evidence or preparing exact backlog/task cleanup.
