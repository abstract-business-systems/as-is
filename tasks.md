# Task

## Requirement
Implement the selected root item `root:general-developmental-guardrails`. Add concise repository-wide developmental guardrails to the canonical root `AGENTS.md` owner for naming consultation, preservation-aware tracked renames with `git mv`, atomic reference updates, and the distinction between tracked renames, new-file creation, and untracked/generated artifacts. Preserve existing component-specific instructions and authority; do not perform a particular rename or broad cleanup in this task.

## Plan
1. Review the selected root backlog item, root `AGENTS.md`, naming and structuring skills, design principles, task protocol, and relevant historical rename evidence.
2. Identify the smallest missing general guidance and add it to root `AGENTS.md` without duplicating or weakening existing guardrails.
3. Validate root task-record, content/navigation, backlog, JSON, focused guardrail assertions, and whitespace; obtain final read-only review.
4. Record completion evidence, prepare exact backlog cleanup, and commit the changelog, exact root backlog removal, task-artifact cleanup, and instruction change together as one finalization commit.
5. Pause after verifying the single finalization commit and clean worktree.

## Scope
In scope: root `AGENTS.md`, root `as-is.json`, root `tasks.md`, root `backlog.md`, root `changelog.md`, and read-only guidance context from naming/structuring skills and design principles. Out of scope: actual tracked renames, source/runtime changes, child component instructions, broad Markdown rewriting, host setup, task schema changes, and descendants.

## Acceptance
- Root `AGENTS.md` identifies naming consultation before naming/renaming, preservation-aware `git mv` for tracked paths, and atomic reference updates.
- Guidance distinguishes tracked renames from new-file creation and untracked/generated artifacts, and preserves existing component-specific instructions.
- No actual rename, generated artifact, runtime, source, host, or schema behavior changes occur.
- Root task-record, content/navigation, backlog, JSON, focused guardrail, and whitespace validation pass; final expert review approves the handoff; no descendants are authorized.
- Exact `root:general-developmental-guardrails` completion evidence is recorded and its backlog row is removed in the same finalization commit as changelog and task-artifact cleanup.

## Progress
Started from clean committed baseline `162cb25`. The selected root row is open. Added concise root guardrails for naming consultation, parent/sibling convention inspection, preservation-aware `git mv`, atomic proven-reference updates, and separate treatment of tracked renames versus new, untracked, ignored, generated, and temporary artifacts. No specific rename or generated artifact was changed.

## Validation
Passed: `python3 components/task-record-validator/task_record_validator.py .` reported `VALID`; `bun skills/managing-as-is-document/content-test.ts` reported 46 records and 47 diagrams; `bun skills/managing-backlog/content-test.ts` passed; `python3 -m json.tool as-is.json` passed; `git diff --check` passed; and a focused guardrail audit confirmed all required distinctions and no specific rename scope. Final read-only expert review completed: safe to proceed; no blocker.

## Result
The root general developmental guardrails satisfy the selected acceptance. The task is terminal `completed`; descendant closure is vacuous because no descendants were authorized.

## Blockers And Escalations
No blocker currently. Do not convert this planning task into a particular rename, repository-wide Markdown rewrite, or child-component instruction migration.

## Recovery
If the canonical owner or wording is ambiguous, leave the task active and record the proposed alternatives. If validation or finalization fails, preserve the root task and backlog row; do not commit task cleanup or backlog clearance separately.

## Next Action
Record the concise completion summary, prepare exact root backlog cleanup, and commit changelog, backlog removal, task cleanup, and root instruction changes together as one finalization commit.
