# As-is setup plan

## Mode and boundary

- Mode: whole-project setup.
- Target: the project root at `.`.
- Effective boundary: this working directory and its relevant descendants only.
- Instruction owner: `AGENTS.md`; it does not exist yet, so setup will create it with the canonical-use instruction.
- Root record: `as-is.md`; it does not exist yet, so setup will create it.
- Existing local evidence: `records/ownership-map.md`, `records/owners/core-utility.md`, `records/owners/design-notes.md`, `docs/design-notes.md`, and the `src/wordstats/` implementation.

## Candidate dispositions

| Candidate | Proposed record path | Evidence | Confidence | Assumptions | Disposition |
| --- | --- | --- | --- | --- | --- |
| `wordstats` | `records/components/wordstats/as-is.md` | Owns the existing word-count library and `count` CLI, with a stable public output contract and independent tests. | High | Centralized `records/` is the established project record location. | Accept as the parent component. |
| `rarewords` | `records/components/rarewords/as-is.md` | Owns the independently requested rare-frequency filtering responsibility, new module, and focused validation. | High | The helper module remains the implementation artifact at `src/wordstats/rarewords.py`; its component record is centralized with existing records. | Accept as an independent child component. |
| `topwords` | `records/components/topwords/as-is.md` | Owns the independently requested top-frequency ranking responsibility, new module, and focused validation. | High | The helper module remains the implementation artifact at `src/wordstats/topwords.py`; its component record is centralized with existing records. | Accept as an independent child component. |

The exact request is the human confirmation for these dispositions; no merge, rename, rejection, or deferral is pending.

## Planned writes

- Create `AGENTS.md` with the canonical as-is architecture instruction, exactly once.
- Create `as-is.md`, the root architecture map.
- Create `records/components/wordstats/as-is.md`, the parent component record.
- Create `records/components/rarewords/as-is.md` and `records/components/topwords/as-is.md`, the approved child records.
- Create the root task pair `as-is.json` and `tasks.md` for the parent implementation flow.
- Create each child task pair under its component directory: `records/components/rarewords/as-is.json` plus `tasks.md`, and `records/components/topwords/as-is.json` plus `tasks.md`.
- Update `docs/design-notes.md` before implementing the user-visible options.
- Later implementation writes are limited to the two named helper modules, the CLI integration, focused tests, and the owning `CHANGELOG.md` summary.

## Diagram layout plans

- Root view: Mermaid flowchart with the project as one container and one linked `wordstats` child; balanced containment, one visible relationship edge at most, no invented runtime sequence. The host render surface is the repository's Markdown Mermaid renderer; no numeric dimensions are assumed.
- `wordstats` view: Mermaid flowchart with one parent container and two linked child boxes; balanced sibling placement with short `provides` labels only where the documented filter relationship is material. No chronological meaning is intended.
- Each leaf view: smallest reader-oriented flowchart showing input counts, the helper responsibility, and filtered counts; top-to-bottom progression is intentional. Labels remain short for the available Markdown Mermaid surface.

## Explicit exclusions

- Do not modify any enclosing project, sibling benchmark arm, or path under `candidate/benchmark/` outside this working directory.
- Do not modify `.pi/` runtime projection, generated `__pycache__/` files, sample data, or the existing smoke-check fixture.
- Do not create components for individual source files, tests, or routine CLI parsing.
- Do not create a new provider, agent definition, host configuration, or external integration.
