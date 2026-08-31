# As-is setup plan (working artifact)

Reviewable dry-run plan produced by the `as-is-setup` procedure before any setup write. This plan is working context and is deliberately not copied into the resulting records.

## Mode and boundary

- Mode: whole-project (no directory argument; the request covers adopting the workflow in this project).
- Target path: `/home/vc/dev/as-is/candidate/benchmark/run/round-4/uc2/baseline` (the benchmark working directory; project root).
- Effective boundary: the target and its descendants. No ancestor, sibling, or enclosing-project path is inspected for change or modified.
- Applicable instruction file: none exists; the plan creates `<target>/AGENTS.md` inside the boundary (skill step 6 disposition: create target-local instruction file).

## Candidate components and evidence

| Candidate | Record path | Evidence | Confidence | Disposition |
| --- | --- | --- | --- | --- |
| `core-utility` | `src/wordstats/as-is.md` | `records/ownership-map.md` maps `src/wordstats/counter.py` and `src/wordstats/cli.py` to `records/owners/core-utility.md` with change scope `component`; distinct responsibility (word-count logic plus CLI surface) with a stated public contract and stable counter→cli collaboration. | High | Propose create |

- Naming: `core-utility` reuses the established local vocabulary of the project's own owner record (`records/owners/core-utility.md`, "Owner record: core utility"); lowercase kebab-case per repository grammar. No generic filler.
- Rejected alternatives: splitting `counter` and `cli` into two components (no separate ownership or change evidence; single owner record covers both); treating `docs/`, `records/`, `checks/`, `sample-data/` as components (the ownership map assigns `artifact` scope to `docs/design-notes.md` and `README.md` and no records to the others; none carries component scope).
- Candidate approval record: no human approver is reachable in this bounded benchmark run. The approval authority available to this arm is the operator's verbatim task directive ("First perform the setup your workflow prescribes for adopting it in an existing project"), which explicitly authorizes setup inside this working directory. Approval is recorded as: candidate `core-utility` ACCEPTED for record creation at `src/wordstats/as-is.md`, on the grounds that it is the only decomposition supported by the project's own durable ownership records and that the skill's stop-and-escalate trigger (multiple materially different decompositions) is not met. Stop condition: if evidence of an additional or contested component boundary surfaces during execution, stop before further writes and record a blocker instead of writing.

## Root record disposition

- Root `as-is.md` at the target root, title `# as-is - as-is` (whole-project root component name `as-is`).
- Root Design carries a structural container view of `as-is` containing only the immediate child `core-utility`, with the `Components` table as the required Markdown fallback.
- Root lineage line: `**Lineage**: **as-is**` (root record, no self-link).
- Root `## Links`: `records/ownership-map.md` (owner/scope resolution) and `docs/design-notes.md` (design-note convention governing user-visible changes); both are distinct direct working context, not duplicated navigation.

## Planned writes (all inside the effective boundary)

1. `AGENTS.md` — create with the single canonical as-is instruction, idempotent, no existing guidance replaced.
2. `as-is.md` — root record per `managing-as-is-document` structure (Purpose; Components table; Design with orientation, lineage line, structural-container diagram; Relationships; Links).
3. `src/wordstats/as-is.md` — `core-utility` initial record (Purpose; Design with orientation, lineage line linking root, one bounded flow view of the `count` behavior; Links to the project owner record).
4. `docs/as-is-setup-plan.md` — this plan (working artifact).

## Request-scoped writes (after setup, not part of setup; note first, then README, per the owner record)

5. `docs/design-notes.md` — append one design note (newest last) before the README change, per `records/owners/design-notes.md`. Note content: request summary (stale PyPI install instruction), decision (no published package; run from a checkout with `PYTHONPATH=src python3 -m wordstats.cli count <path>`), options considered (PyPI publishing rejected as out of scope; bare `python -m` rejected because it does not resolve from a checkout root), and the bounded change authorized (README `## Installation` wording only).
6. `README.md` — replace the entire `## Installation` section content: remove both the stale `pip install wordstats-tools` PyPI instruction and the unsupported "Then run it from anywhere" claim; state that no package is published and document the checkout-root invocation `PYTHONPATH=src python3 -m wordstats.cli count <path>` (matching `checks/validate.sh`); then validate that documented command by execution.
7. `CHANGELOG.md` — add an `## Unreleased` entry summarizing the installation-instruction fix and the as-is documentation adoption (workflow durable-handoff summary; the project's existing changelog is the only handoff-record surface in this seed).

## Authority note for paths without an owner record (added after expert review)

`records/ownership-map.md` assigns owner/scope records only to the two `src/wordstats` files (component scope) and `docs/design-notes.md` plus `README.md` (artifact scope); it declares unknown areas ownerless. The remaining written paths — `AGENTS.md`, root `as-is.md`, `src/wordstats/as-is.md`, `docs/as-is-setup-plan.md`, and `CHANGELOG.md` — have no owner record. Their authority is the operator's verbatim task directive: it explicitly orders performing the workflow's prescribed setup in this directory and fixing the README installation section, and this plan records the durable handoff (plan artifact, records, changelog entry) that setup and the workflow require. A stop-for-direction is therefore not triggered: the ownership gap is resolved by explicit delegator authority, recorded here, not by guessing an owner. This plan section was added after final expert validation flagged the gap; the revision is itself recorded here to keep the plan consistent with the executed scope.

## Record detail commitments (per expert review)

- `AGENTS.md` reproduces the canonical instruction verbatim, present exactly once, with no existing guidance replaced (none exists).
- Root record: title `# as-is - as-is`; `**Lineage**: **as-is**` immediately before the first named diagram heading; `## Relationships` only with material durable content (ownership resolution and the validation gate); no filler sections.
- Child record: title `# core-utility - as-is`; lineage `**Lineage**: [as-is](../../as-is.md#design) / **core-utility**` immediately before its named diagram heading; no `## Components`, no structural container (leaf record); flow view written as a reader-oriented explanation of the stable count outcome, not exhaustive control flow; labels ≤ 28 visible characters.
- Both Mermaid fences carry descriptive `### <name>` headings; the root container mirrors the source repository's root record syntax (`subgraph Root["as-is"]` with loose security for the HTML link).

## Diagram layout plan (working context; not copied into records)

- Render-surface constraint: no local renderer is configured in the benchmark environment; validation is source-level plus host fallback rendering. Both diagrams are small and low-density.
- Root structural container: `flowchart TB`, one subgraph (`Root`, labeled `as-is`) containing one linked child node (`core-utility` → `src/wordstats/as-is.md#design`); no sibling edges (single child); density well below budget (1 node). ELK layout declared in frontmatter config; `securityLevel: loose` init for the HTML link, mirroring the source repository's root record.
- `core-utility` flow view: progression layout, `flowchart TB`, four stages (read text file → normalize tokens → count occurrences → emit sorted JSON); each label ≤ 28 visible characters; density budget ≤ 6 nodes.
- Residual risk: if the host suppresses Mermaid link navigation, the `Components` table remains the resolving Markdown fallback.

## Explicitly excluded out-of-scope paths

- Everything outside `/home/vc/dev/as-is/candidate/benchmark/run/round-4/uc2/baseline`, including any sibling benchmark arm or use-case directory and any path under `candidate/benchmark/` outside this working directory.
- `.git/`, `.as-is/tracing.jsonl`, `.pi/` (benchmark harness material, not project documentation).
- No component task record (`as-is.json` / task narrative) is created: the request explicitly states this is not component work.

## Validation plan

- Execute the documented README command once (`PYTHONPATH=src python3 -m wordstats.cli count sample-data/words.txt`) to prove the new instruction works.
- Run `bash checks/validate.sh` (must pass, exit 0).
- Run the record validator from `managing-as-is-document` over the created records (source-level link/navigation check).
- `git diff --check` for whitespace errors; snapshot `git status --porcelain` before and after writes and confirm every changed path is inside the effective boundary; enclosing root and siblings untouched by construction (writes use absolute paths under the target only).