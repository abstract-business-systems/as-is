# As-is setup plan (working artifact)

Reviewable dry-run plan produced by the `as-is-setup` skill (whole-project mode) before any setup writes. Governing record structure: `managing-as-is-document`. This plan is not copied into any resulting `as-is.md` record.

## Mode and boundary

- Mode: whole-project.
- Target: the benchmark arm working directory (project root), git-initialized seed with no initial commit.
- Effective boundary: the target project root and its relevant descendants. No ancestor, sibling, or enclosing-project path is required or changed.
- Instruction file: no `AGENTS.md` exists in the target. Plan proposes creating `<target>/AGENTS.md` inside the boundary with the single canonical instruction; no enclosing instruction file is read or changed.

## Candidate components (semantic evidence)

| Candidate | Path | Evidence | Confidence | Disposition |
| --- | --- | --- | --- | --- |
| wordstats | `src/wordstats/` | Distinct responsibility (word-count library plus `count` CLI); focused unit tests; own owner record `records/owners/core-utility.md` declaring a public contract. | High | Accept |

Rejected candidates: `checks/`, `docs/`, `records/`, `sample-data/` are operational or record-keeping artifacts without an independent responsibility boundary worth progressive disclosure; they remain ordinary root-level content named in the root record. Evidence: each is a single-file concern already documented by the seed README and ownership map.

- Assumption: the benchmark arm request ("perform the setup your workflow prescribes for adopting it in an existing project") is the human-approved request to introduce as-is documentation and authorizes the minimal single-component decomposition above. The decomposition and dispositions are presented for human review in the arm status report; any objection would be a follow-up bounded change.

## Planned writes (all inside the effective boundary)

- Create `as-is.md` — root record, title `# as-is - as-is`, structural container view with the `wordstats` child, `Components` table as renderer fallback.
- Create `src/wordstats/as-is.md` — component record, title `# wordstats - as-is`, smallest supported flow view of the count pipeline.
- Create `AGENTS.md` — target instruction file with the canonical as-is architecture instruction exactly once.
- Create `records/as-is-setup-plan.md` — this working plan.

## Excluded out-of-scope paths

- Every path outside the target project root, including the as-is repository, benchmark harness directories, and sibling benchmark arms or use cases.
- No existing project file is modified or replaced by the setup itself; README, CHANGELOG, docs, records owners, src, tests, checks, and sample-data remain untouched by setup writes.

## Critical-view layout plan

Both planned diagrams are small supplementary views (one node plus one labeled container; a four-node linear flow). No host render surface is configured for this seed, so rendering cannot be exercised; the layout risk is low and is recorded here as residual risk rather than in the records. Mermaid source is checked at source level (balanced fences, resolvable link targets) and `git diff --check` is run.

## Validation

- Record titles use `# <component-name> - as-is`.
- Root record contains the canonical instruction target and every diagram link resolves (`src/wordstats/as-is.md#design`).
- Before/after path snapshot: all changed paths are inside the target; `git status --porcelain` is reviewed before and after setup writes.
- `git diff --check` clean; `bash checks/validate.sh` passes (unchanged project behavior).