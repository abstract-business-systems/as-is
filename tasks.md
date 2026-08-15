# Protocol Correction — Embedded Task Metadata

## Requirement
Complete the user-authorized correction of repository task-record guidance: the local `task` object embedded in each component's `as-is.json` is machine task authority, while the configured Markdown task file is human transient task context and evidence. Preserve current validator/control-plane semantics and make no runtime implementation changes.

## Plan
1. Recreate the active embedded root task and exact selected backlog identity after the prior uncommitted cleanup was found incomplete under the protocol's durable-handoff rules.
2. Correct normative protocol, configuration, migration, execution, adapter, orchestration, validator, backlog, and directly dependent task-management guidance.
3. Validate content/navigation, backlog, active task metadata, JSON, reference consistency, and whitespace; perform final scope review.
4. Record durable completion evidence, reconcile the exact backlog identity, remove the paired transient task artifacts, and create one scoped documentation commit.

## Scope
In scope: protocol and directly dependent guidance documents, task-record validator README, backlog/changelog, directly dependent agent/skill guidance and one control-plane evidence-label correction, root embedded task metadata, and configured Markdown narrative. Out of scope: validator/control-plane/launcher/supervisor/runtime behavior, task-schema changes, source relocation, host/projection/setup changes, target writes, browser/environment capability work, and descendants.

## Acceptance
- Current guidance identifies the local `task` object in `as-is.json` as machine task authority and the configured Markdown narrative as human transient context/evidence; durable `as-is.md` remains architecture context.
- No current guidance claims an `as-is.json.task` sidecar or `as-is.md` task authority; configuration paths use `configuration.*` where applicable.
- Active task validation reports `VALID`; content/navigation, backlog, JSON, reference, and whitespace checks pass.
- Only documentation, backlog/changelog, task-management guidance, and one non-behavioral control-plane evidence label change; no runtime behavior implementation changes occur.
- Exact backlog identity `root:correct-embedded-task-record-protocol` is reconciled after durable evidence and one scoped commit is created.

## Progress
Recovery is active from clean commit `7e9055e`; the prior uncommitted protocol-correction work is preserved in the current diff. The earlier task pair was removed before a durable commit, so this recovery task re-establishes explicit task authority and backlog identity before final handoff.

## Validation
Fresh current-worktree validation passed: `bun ./skills/managing-as-is-document/content-test.ts` reported 44 records and 45 diagrams; `bun ./skills/managing-backlog/content-test.ts` passed; `python3 components/task-record-validator/task_record_validator.py .` reported `VALID`; `python3 -m json.tool as-is.json` passed; the final reference audit passed for current guidance, with the selected backlog description intentionally retaining the historical sidecar identity as completion context; `git diff --check` passed. The exact staged changed-artifact set is: `agents/component-builder/agent.md`, `agents/component-builder/as-is.md`, `as-is.json`, `backlog.md`, `changelog.md`, `components/control-plane/control-plane.ts` (evidence-label text only), `components/task-record-validator/README.md`, `designs/as-is-json-migration.md`, `designs/component-scoped-context-resolution.md`, `designs/orchestration-design.md`, `docs/component-task-record-protocol.md`, `docs/configuration.md`, `docs/execution-contract.md`, `docs/opencode-adapter.md`, `skills/building-components/SKILL.md`, `skills/committing-completed-work/SKILL.md`, `skills/managing-as-is-document/SKILL.md`, `skills/spawning-pi-subagents/SKILL.md`, `skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts` (comment only), and `tasks.md`. No validator, launcher, supervisor, or runtime behavior implementation changed.

## Result
The user-authorized protocol correction is complete and ready for durable handoff. Embedded local `as-is.json` `task` objects are machine task authority; configured Markdown narratives are human transient context/evidence; durable `as-is.md` records remain architecture context. Directly dependent guidance now uses the same model. The exact selected identity `root:correct-embedded-task-record-protocol` is ready for reconciliation after the scoped commit.

## Blockers And Escalations
The user resolved the authority question: the current executable embedded `as-is.json` `task` object convention is authoritative. Do not change runtime implementation or broaden into task-schema redesign.

## Recovery
The prior uncommitted facts remain in the working diff. The obsolete `as-is.json.task` sidecar is not restored. If validation fails, retain this task pair and restore only affected documentation text; do not discard the current diff or infer completion from the earlier cleanup.

## Next Action
Add the exact selected backlog identity, validate the recovered scope, obtain final review, write the final changelog handoff, commit the scoped documentation correction, then reconcile and clean up the task pair.
