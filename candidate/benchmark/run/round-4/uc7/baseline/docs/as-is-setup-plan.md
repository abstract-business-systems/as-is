# As-is setup plan (reviewable, pre-write record)

Reviewable setup plan for adopting the as-is documentation convention in this project. This working plan is not copied into the resulting records.

## Mode and target

- Mode: whole-project mode (no directory argument).
- Target: `/home/vc/dev/as-is/candidate/benchmark/run/round-4/uc7/baseline` (project root).
- Effective boundary: the target root and its relevant descendants only. No enclosing project root, sibling benchmark arm, or path outside the working directory is read for modification or changed.

## Instruction file

- No `AGENTS.md` exists at the target. Disposition: create `<target>/AGENTS.md` containing the single canonical as-is instruction from the `as-is-setup` skill, exactly once, without replacing any existing guidance (none exists).

## Root record

- `<target>/as-is.md`, title `# as-is - as-is`, with a structural-container Mermaid view (ELK, TB) and the required `Components` table as Markdown fallback for the linked child. Layout plan: rendering is not material for this supplementary-scale container; shape is one parent container with one child node, density well under budget, top-to-bottom grouping; no renderer exception or residual rendering risk is declared. Source-level validation only.

## Candidate components (semantic evidence)

| Candidate | Path | Evidence | Confidence | Disposition |
| --- | --- | --- | --- | --- |
| `word-count-utility` | `src/wordstats/as-is.md` | Distinct responsibility (tokenization/counting plus CLI surface) with a stated public contract in `records/owners/core-utility.md`; independent unit-test and smoke-check coverage; stable collaboration between `counter.py` and `cli.py`. | High | Approve, single component |

Candidates considered and rejected: `tests/`, `checks/`, `sample-data/`, `docs/`, `records/`, `.pi/`, `.as-is/` — supporting artifacts or host configuration without an independent responsibility, authority boundary, or lifecycle; declaring them components would violate the "not every directory is a component" rule. Name `word-count-utility` aligns with the existing owner-record vocabulary (`core utility`) and the public function `count_words`.

## Approval basis (recorded assumption)

- No human is available in this benchmark arm. The arm request explicitly directs: "First perform the setup your workflow prescribes for adopting it in an existing project." That request is treated as the approving review for the smallest reasonable decomposition above. A human reviewer may re-open the decomposition; no record depends on boundaries beyond the single approved component.
- The expert plan review returned REVISE, resolved as follows: the `records/ownership-map.md` stop-for-direction rule applies to ambiguous areas; every area this arm touches (`README.md` — owned by `records/owners/design-notes.md`; `tests/`, `CHANGELOG.md`, and root setup records — unowned) is explicitly and verbatim named by the arm request, which is recorded as the resolving authorization rather than a guess. Adding `AGENTS.md` may change future agent behavior; deterministic record validation is performed here, and live agent behavioral validation is recorded as out of arm scope (residual risk).

## Planned writes

- `docs/as-is-setup-plan.md` (this plan)
- `as-is.md` (root record)
- `src/wordstats/as-is.md` (component record)
- `AGENTS.md` (canonical instruction)
- `as-is.json`, `tasks.md` (task records for the arm, per `building-components`)
- `agents/expert/` and `agents/AGENTS.md` (copy of the workflow's read-only expert role record so in-process expert gates resolve; host plumbing, not a component)

## Excluded out-of-scope paths

Everything outside the target root, including all other `candidate/benchmark/` paths. No parent or sibling file is required, read for modification, or changed.