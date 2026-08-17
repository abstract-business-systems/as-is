# Task

## Requirement
Reconcile and formally close the already implemented root backlog item `root:dissolve-documents-into-as-is-records` without repeating its implementation. Use the unpushed documentation commits and the preserved Pi session history as evidence; record the final document dispositions, recovery assessment, link/content validation, residual risk, and exact backlog cleanup while preserving all substantive work.

## Plan
- Preserve the existing completed usage-accounting task facts as historical context and use a new bounded retrospective reconciliation task for the documentation item.
- Review the unpushed commit range, the implementation session history, current tracked document set, current references, and the moved benchmark dependency location.
- Record the reviewed scope and dispositions in the root task evidence, with retained subject-named documents and host-required records distinguished from relocated or retired artifacts.
- Add exact-ID completion evidence to the root changelog, remove only `root:dissolve-documents-into-as-is-records`, remove this task pair, and commit the completion handoff atomically without touching unrelated ignored artifacts or remote state.

## Progress
- The substantive reconciliation is already present in unpushed commits `43ca499` and `0793b12`, with preceding runtime/configuration commits `ac4d089` and `e5e9eb7` retained separately.
- Session `01a010a1-c5f7-70c2-b19d-5ccc80e8726d` records the user decisions, concrete `git mv`/`git rm`/`mv` operations, reference searches, content validation, task-record validation, and commit/history split.
- The relevant tracked document review covers 31 subject-named or README Markdown documents outside host-required records, 140 host-required records (`as-is.md`, `backlog.md`, `changelog.md`, `tasks.md`, `AGENTS.md`, `SKILL.md`, and agent role files), and 171 tracked Markdown files total. The preserved ignored/generated benchmark corpus is excluded from canonical document discovery; its generated dependency tree was moved from the nested runtime location to `temp/benchmarking/node_modules` at approximately 131 MB, while other benchmark artifacts were intentionally left unchanged.

### Reviewed disposition matrix

| Scope | Owner / authority | Consumers | Disposition / retained entry point | Recovery and audit assessment |
| --- | --- | --- | --- | --- |
| `docs/architecture-vocabulary.md` | Normative architecture vocabulary; current collection `core/contracts` | `as-is.md` records, skills, designs, validators | Moved to `core/contracts/architecture-vocabulary.md`; retained subject-named entry | Tracked `git mv` preserves history; references updated and content validation passed. |
| `docs/component-task-record-protocol.md` | Normative task-control protocol; `core/contracts` | Task-control, task-management skills, records, agents | Moved to `core/contracts/component-task-record-protocol.md`; retained subject-named entry | Tracked `git mv` preserves history; task-record validation and references passed. |
| `docs/configuration.md` | Normative generic configuration boundary; context-resolution and consumers | Resolver, tracer, launcher, records, designs | Moved to `core/contracts/configuration.md`; retained subject-named entry; consumer defaults remain in implementations | Tracked `git mv` preserves history; configuration tests and references passed. |
| `docs/execution-contract.md` | Normative host-neutral execution contract; existing process/Pi/task owners implement mappings | Process adapter, launcher, task-control, observability, designs | Moved to `core/contracts/execution-contract.md`; retained subject-named entry; no executable contract API created | Tracked `git mv` preserves history; focused lifecycle/content validation passed. |
| `docs/design-principles.md` | Root-wide repository principles | `AGENTS.md`, skills, records, agents | Moved to root `design-principles.md`; retained root entry | Tracked `git mv` preserves history; root references and diff checks passed. |
| `docs/opencode-adapter.md` | Draft host-specific readiness design; Designs collection | OpenCode readiness, host-integration planning, future adapter work | Moved to `designs/opencode-adapter-readiness.md`; explicitly retained as draft/readiness; no `core/adapters/opencode/` created | Tracked `git mv` preserves history; readiness blockers and references retained. |
| `docs/as-is.md`, `docs/changelog.md` | Former Documentation collection records | Historical navigation only | Retired after their subject documents were rehomed; `core/contracts/as-is.md`/`index.md` and `core/contracts/changelog.md` now own contract collection context | Tracked removals are recoverable through Git; retained current collection context and migration evidence. |
| `host-integration/as-is.md`, `backlog.md`, `changelog.md` | Former planning-only host-integration component | Root architecture and setup planning | Retired; unique planning facts consolidated into `designs/aspirational-architecture-handoff.md`; executable setup remains `core/adapters/host-setup/` | Tracked removals are recoverable through Git; planning facts and future gates retained; no target writes or host implementation introduced. |
| Root `agent-skills.md` | Former capability catalog | Readers and legacy navigation | Retired; `skills/as-is.md` is the canonical capability catalog | Tracked removal is recoverable through Git; current catalog and references retained. |
| Existing `as-is.md`, `AGENTS.md`, `SKILL.md`, `agent.md`, `backlog.md`, `changelog.md`, and README records | Their owning components / host-required conventions | Local readers, task management, roles, tools, fixtures | Retained in place; aligned references and ownership statements only | No removal; current consumers and recovery value preserved. |
| Other subject-named designs and focused operational documents | Their named design or component owner | Direct linked consumers | Retained in `designs/`, `core/modules/`, `skills/`, or fixture locations when each remains the smallest coherent authoritative home | No blanket movement; retained because each has distinct subject, lifecycle, or host-required role. |
| Ignored/generated `temp/benchmarking` corpus | Temporary experiment state, outside canonical discovery | Benchmark experiments only | Not folded into `core/contracts`; only generated dependency tree moved to `temp/benchmarking/node_modules`; other ignored artifacts left untouched per user direction | No destructive cleanup; ignored corpus remains recoverable in place. |

## Validation
- `git diff origin/master..HEAD --check` passed across the complete unpushed range.
- `bun skills/managing-as-is-document/content-test.ts` passed with 48 records and 46 diagrams for the reconciled committed state; subsequent current-state checks passed with 49 records and 47 diagrams as implementation records were retained.
- `bun core/modules/task-control/task-record-validator.ts .` returned `VALID` at the documented completion checkpoint.
- Focused task-control, context-resolution, observability, process, launcher, accounting, backlog, orientation, JSON, no-bundle, and diagnostics checks are recorded in `designs/documentation-ownership-reconciliation-handoff.md`, `designs/changelog.md`, and the component changelogs; the relevant focused suites passed.
- Reference searches after the moves found no stale active references to the retired `docs/`, `host-integration/`, or root `agent-skills.md` paths, while retained historical evidence and current links resolve through the new owners.
- Current branch remains local-only and no remote operation is authorized or performed.

## Result
The substantive documentation-ownership reconciliation satisfies the selected root item. Contract documents now have the normative `core/contracts/` collection and grouped `index.md` entry point; root principles, OpenCode readiness, host-integration planning, and the former skills catalog have their appropriate owners; implementation remains in modules, adapters, skills, and roles; and no benchmark or runtime authority was mixed into contracts. This task supplies the previously missing exact-ID lifecycle handoff rather than repeating implementation.

## Blockers And Escalations
No completion blocker remains for this retrospective reconciliation. Future executable contract APIs, OpenCode adapter implementation, host-integration projection, and ignored benchmark cleanup remain separately gated work and are not implied by this completion.

## Recovery
The implementation commits remain recoverable as `ac4d089`, `e5e9eb7`, `43ca499`, and `0793b12`; the former single commit remains recoverable through the local reflog as `71e6226`. The implementation session remains available at local session `01a010a1-c5f7-70c2-b19d-5ccc80e8726d`. If finalization is interrupted, preserve this task pair and the exact backlog row, restore them from Git/history as needed, and do not remove ignored benchmark artifacts or rewrite remote history.

## Next Action
Write the exact-ID root changelog completion summary, remove only `root:dissolve-documents-into-as-is-records`, validate the staged completion patch, and commit the changelog, backlog cleanup, and paired task cleanup together.
