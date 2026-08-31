# As-is setup plan

## Mode and boundary

- Mode: whole-project setup.
- Target: `/home/vc/dev/as-is/candidate/benchmark/run/round-6/uc10/baseline`.
- Effective boundary: this project directory and its descendants only.
- Excluded: every parent, sibling benchmark arm, other use case, and external service.

## Existing evidence

- `records/ownership-map.md` identifies `src/wordstats/` as one component owned by the core-utility record.
- `records/owners/core-utility.md` describes the library and CLI as one stable responsibility boundary.
- `docs/design-notes.md` and `records/owners/design-notes.md` establish the design-note convention for user-visible behavior.
- No target-local `AGENTS.md`, `as-is.md`, `as-is.json`, or task narrative exists.

## Candidate disposition

- Accept one root component record at `as-is.md` and one meaningful child component record at `src/wordstats/as-is.md`.
- The child is supported by the ownership map and stable library/CLI responsibility; no additional records are proposed for individual modules, tests, or docs.
- The task request authorizes adopting the workflow and implementing the bounded feature, so this is the recorded confirmation for this narrow decomposition; no rename or alternate decomposition is needed.

## Planned writes

- Create `AGENTS.md` with the canonical as-is architecture-use instruction exactly once.
- Create `as-is.md` and `src/wordstats/as-is.md` with required headings, lineage, resolving links, and reader-oriented diagrams.
- Create root `as-is.json` configuration and the root/component task records required before implementation.
- Retain this setup plan as reviewable setup evidence.

## Diagram layout plan

- Root critical view: a balanced, box-oriented `flowchart TB` structural container with the root and one child node; short labels, one containment edge implied by nesting, and no runtime sequence claim.
- Wordstats view: a narrow `flowchart TB` responsibility flow from input through counting to JSON output; short labels and only the consequential CLI boundary.
- Residual risk: Mermaid source will receive source-level validation; no local browser renderer is required by the seed checks.

## Validation and scope guard

- Validate headings, links, diagrams, and `git diff --check` after writes.
- Snapshot changed paths before and after setup and confirm every setup path is inside the target boundary.
