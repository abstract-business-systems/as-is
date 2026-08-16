# Task

## Requirement
Persist the user's revised restructuring priority in the planning backlogs without creating a duplicate master implementation item: prioritize evidence-tool emitted-path enforcement, process-supervisor emitted-path enforcement, execution-contract implementation, Pi-adapter implementation, and organization of existing tools/modules; deprioritize future browser/environment capabilities, setup/host integration, task-facing-tool extraction absent its consumer gate, standalone package hosting, and other unrelated future work. Preserve component ownership, dependency semantics, and the distinction between existing implementations and unimplemented capabilities.

## Plan
1. Read the root and affected component records, backlog-management rules, and aspirational architecture handoff.
2. Add owner-specific backlog rows for the evidence and process privacy tasks.
3. Add root planning rows for execution-contract and Pi-adapter implementation, open the existing-tools organization item, remove its mistaken browser/environment dependencies, and record the selected sequence and exclusions in notes.
4. Mark setup-adapter and standalone-package-host items deferred where the user's reprioritization applies; retain unrelated backlog priorities.
5. Validate backlog schema, content/navigation, JSON, diff, and final expert review, then record the durable root changelog handoff and clean the task artifacts in one completion commit.

## Progress
This is a root-owned ad hoc planning task because no existing backlog item accurately represents a one-time priority reconciliation and the existing `root:subagent-first-core-foundation` row remains a planning umbrella rather than a task to complete. The working tree was clean at `f66762c` before task initialization. Scope is limited to root backlog/changelog, `tools/evidence/backlog.md`, `core/adapters/process/backlog.md`, root task artifacts, and no runtime implementation.

## Validation
Pending. Required evidence: backlog content validation; as-is/content navigation; task-record validation; JSON parsing; `git diff --check`; changed-file diagnostics; review of dependency semantics and component ownership; and final configured-large expert review.

## Result
Pending.

## Blockers And Escalations
None.

## Recovery
If interrupted, preserve the root backlog and newly created owner backlog files as one planning change, restore the active root task pair before retrying, and do not alter implementation, deferred capability records, or component authority outside the declared scope.

## Next Action
Obtain the bounded read-only expert review, implement the backlog reconciliation, validate, record root changelog evidence, and create the scoped completion commit.
