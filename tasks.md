# Task

## Requirement

Coordinate a manual, serial vertical-slice pilot that realigns canonical `as-is.md` records with their owned implementation and tests whether a parent can reconcile from final immediate-child records without rereading child implementation. The root owns campaign coordination because the pilot crosses the `skills/` and `validation-fixtures/` component boundaries; it does not own or edit any child component record. This is a direct user-authorized root coordination task supporting `skills:reconciling-as-is-records`, not a duplicate root backlog item.

The pilot target is the `validation-fixtures/` component and these documented direct children:

| Component | Pilot role |
| --- | --- |
| `validation-fixtures/dummy-delegation/` | Leaf alignment; its completed historical task remains evidence and is not overwritten. |
| `validation-fixtures/increment-5-dogfood/` | Leaf alignment. |
| `validation-fixtures/increment-6-recovery-fixture/` | Leaf alignment. |
| `validation-fixtures/opencode-mediation-dogfood/` | Leaf alignment. |
| `validation-fixtures/` | Parent reconciliation after all four final child records are available. |

`validation-fixtures/agent-capability-probe/` is excluded because it has no canonical `as-is.md`. Root-record reconciliation is excluded from this pilot. The target revision is `6ec44ad770885dca0614b77a1ff76164d0bafc78` plus the committed root pilot-admission handoff that creates this record; work does not begin until that handoff is established and the root task is activated.

The root may delegate exactly one immediate child coordination task: `validation-fixtures/`. That child coordinator may admit the four leaf-owned record alignments serially under its own bounded local task record. This preserves the root's `maximum-children: 1` limit and keeps the fixture parent—not root—responsible for its direct children.

This is a deliberately manual coordination plan. Do not use `implementing-component-tasks`, `building-components`, `spawning-pi-subagents`, or a proposed `reconciling-as-is-records` skill as the pilot execution procedure. `managing-as-is-document` remains the applicable record-meaning guidance for every owned record update; task records retain only control, recovery, budget, and closure information.

## Plan

| Step | Owner and permitted semantic inputs | Expected result |
| --- | --- | --- |
| 1. Admit fixture-parent coordinator | Root coordinator reads the target revision, root context, and `validation-fixtures/as-is.md`, then delegates only the fixture-parent coordination task. | Confirm the filesystem-derived pilot graph, the serial limit, local instructions, and exclusions. Existing child `Parent:` links to root are pilot findings, not authority for root edits. |
| 2. Admit and align leaves in post-order | The fixture-parent coordinator admits each leaf serially. Each leaf owner reads only its own `as-is.md`, owned implementation, applicable local instructions, and focused tests. | Each leaf either updates only its own record with supported durable facts or records a bounded ambiguity/blocker. The leaf produces its final `as-is.md`; it does not edit the fixture parent or root. |
| 3. Reconcile fixture parent | The `validation-fixtures` owner reads its own record and implementation plus the exact final paths of the four immediate-child `as-is.md` records. | The parent updates only `validation-fixtures/` artifacts, including any supported Components, relationship, diagram, navigation, or parent-link disposition. It does not reread child implementation, tests, task narratives, transcripts, or grandchildren as semantic inputs. |
| 4. Hand off coordination evidence | Root coordinator reads the fixture-parent coordinator's declared input sets, outcomes, blockers, and focused validation. | Preserve a bounded evidence handoff for the skills-owned `reconciling-as-is-records` decision; the root does not create, reject, or define a skills component. |
| 5. Close root coordination | Root coordinator verifies the pilot's bounded closure and durable evidence. | Preserve recovery facts without claiming repository-wide alignment or creating a new skill before the skills owner evaluates the pilot. |

The root scheduler remains `maxConcurrentTasks: 1`. Run the pilot serially. Model choice, prompt caching, batching policy, launch policy, and provider behavior are not pilot requirements or durable record semantics.

## Progress

- Root coordination task created; no pilot component task has been admitted or activated. The root may admit only the `validation-fixtures/` parent coordinator; that component must own its local leaf admission and reconciliation.
- Candidate graph identified from filesystem containment and `validation-fixtures/as-is.md`: the fixture parent plus its four documented children. `agent-capability-probe/` is excluded because it has no `as-is.md`.
- Known alignment evidence: each of the four candidate child records currently navigates with `Parent: [as-is](../../as-is.md#design)` despite filesystem containment beneath `validation-fixtures/`. Each leaf retains ownership of any correction; the root must not repair those links.
- Known historical evidence: `validation-fixtures/dummy-delegation/as-is.json` is terminal `completed` and its colocated `tasks.md` preserves prior fixture evidence. New pilot work there must use a distinct local task lifecycle and must not overwrite that historical completion evidence.
- `skills:reconciling-as-is-records` remains selected in `skills/backlog.md`, but the skills task is not the cross-component pilot coordinator. The root will hand it bounded evidence; the skills owner alone decides whether a new skill is justified.
- No `as-is.md` record has been changed by this root task.

## Validation

| Check | Result | Residual risk |
| --- | --- | --- |
| Root configuration | `as-is.json` configures `tasks.md` and `maxConcurrentTasks: 1`. | The limit makes the pilot serial; it does not prove semantic alignment. |
| Pilot topology | `validation-fixtures/as-is.md` documents four component children, while `agent-capability-probe/` has no `as-is.md`. | Filesystem containment is the hierarchy authority; stale navigation links remain work for their owning children. |
| Ownership separation | Root `AGENTS.md`, `docs/component-task-record-protocol.md`, and `skills/managing-as-is-document/SKILL.md` were read. | The pilot relies on owners respecting declared inputs; current tooling does not mechanically prove every read boundary. |
| Existing skills boundary | `managing-as-is-document` defines individual record meaning and alignment; the manual pilot intentionally does not invoke `implementing-component-tasks` or `building-components` as its execution procedure. | The pilot may reveal a reusable coordination gap, but it does not pre-authorize a new skill. |
| Task-record convention | Executable consumers use local `as-is.json` plus configured `tasks.md`; broader protocol prose referring to `as-is.json.task` remains separately scoped. | This pilot uses the executable convention and does not resolve that migration discrepancy. |

## Result

Root coordination is ready to admit the bounded vertical-slice pilot. No leaf or parent alignment has started. The root will hand off pilot evidence to the skills owner and makes no conclusion about a new reconciliation skill.

## Blockers And Escalations

- Do not delegate a leaf from root. Admit `validation-fixtures/` first; its own bounded local task record must then admit every leaf serially.
- Do not activate a leaf until a distinct local task record and bounded ownership/acceptance are available for that leaf.
- Do not activate `validation-fixtures/` parent reconciliation until all four direct child records have terminal pilot outcomes and final `as-is.md` paths.
- If a leaf's record cannot express a fact needed by the parent, record the insufficiency or ambiguity in the leaf's own task context; do not let the parent inspect child implementation to fill the gap.
- If the pilot requires root reconciliation, a cross-sibling edit, a concurrency increase, external effects, or a broader `as-is.json.task` migration, stop and request separately scoped direction.

## Recovery

- Last durable checkpoint: root task admission is represented by this root `as-is.json` companion and `tasks.md`; `skills/as-is.json`, `skills/tasks.md`, and `skills/backlog.md` retain the separate skills-owned pre-pilot/decision context.
- Incomplete work: all pilot alignment and parent reconciliation steps.
- Preserve existing historical fixture task artifacts, especially `validation-fixtures/dummy-delegation/tasks.md`; do not delete, replace, or treat them as the new pilot task.
- On interruption, reread this root record, verify Git HEAD and the serial scheduler limit, inspect only the active component's local record, and resume from the earliest incomplete owner-boundary step.

## Next Action

Commit this root pilot-admission record as a bounded coordination handoff, activate the root task, and admit only the distinct `validation-fixtures/` parent-coordination task. Do not edit a leaf, fixture parent, or skills record from the root task.
