# As-is documentation adoption plan (working setup artifact)

Reviewable dry-run plan produced before any setup write, per `integrate-as-is-documentation` (composing `as-is-setup` and `managing-as-is-document`). This is working setup context, not durable component record content; it must not be copied into any `as-is.md`.

## Mode and target

- Mode: whole-project (no directory argument; project root discovered from the request).
- Target path: `/home/vc/dev/as-is/candidate/benchmark/run/round-4/uc6/baseline` (the bounded benchmark working directory; effectively the project root).
- Effective read/write boundary: the target root and its relevant descendants (`as-is.md`, `src/wordstats/as-is.md`, `AGENTS.md`, this plan artifact). No parent project root or sibling path is required, read, or changed.
- Authorization basis: the benchmark arm request explicitly directs performing this workflow's prescribed adoption setup in this directory; it is treated as the reviewable human-approved request. No stop-for-direction condition from `as-is-setup` ("Stop and escalate") is triggered: the root is unambiguous, candidate evidence supports a single decomposition, no name obscures responsibility, and no existing record contradicts the proposed map.

## Applicable instruction file

- Path: `AGENTS.md` (target-local; none exists in the seed).
- Disposition: create it containing the single canonical architecture instruction exactly once. There is no enclosing instruction file to consult or modify within this boundary.

## Root record

- Path: `as-is.md` (does not exist; will be created).
- Title form: `# as-is - as-is` (whole-project mode; root component name is the project's actual as-is component name, `as-is`). Lineage line: `**Lineage**: **as-is**` with no self-link.

## Candidates

| Candidate | Path | Evidence | Confidence | Assumptions | Disposition |
| --- | --- | --- | --- | --- | --- |
| `wordstats` | `src/wordstats/` | Distinct responsibility (word-count library plus `count` CLI) that readers must understand independently; stable public contract already recorded in `records/owners/core-utility.md`; own focused unit tests; named as the project's primary content in `README.md`. | High | The benchmark seed's structure represents the real architecture; no hidden runtime consumers. | Accept — create `src/wordstats/as-is.md`. |
| validation checks | `checks/` | Single deterministic script; no independent lifecycle, deployment, or change complexity; discoverable via `README.md`. | High | — | Reject as a component (below progressive-disclosure threshold); remains root-level context. |
| ownership and design-note records | `records/`, `docs/` | Documentation/fixture artifacts supporting scope resolution and design history, not responsibilities with independent readership needing their own boundary. | High | — | Reject as components; remain linked working context where distinct. |

Sibling/naming alignment: the project's only established component vocabulary is `wordstats` (used in `README.md`, package name, and owner records), so the accepted record reuses that exact name; paths use lowercase kebab-case.

## Planned writes (all inside the effective boundary)

1. `docs/as-is-setup-plan.md` — this working plan artifact.
2. `as-is.md` — root record: Purpose, Components table (sole immediate child `wordstats` linking `src/wordstats/as-is.md#design`), Design with `**Lineage**: **as-is**` and one structural-container view (parent container `as-is`, nested linked child box `wordstats`, ELK/TB, balanced placement, no synthetic parent node or `contains` edge), plus a `## Links` entry only for `records/ownership-map.md` as distinct change-scope authority context.
3. `src/wordstats/as-is.md` — leaf record: Purpose, Design with lineage `**Lineage**: [as-is](../../as-is.md#design) / **wordstats**`, contract facts, one supplementary non-container view (flow of `wordstats count`: read file → normalize/count tokens → emit sorted JSON), Relationships, and a `## Links` entry only for `docs/design-notes.md` as the normative design-decision record for the CLI contract.
4. `AGENTS.md` — new target-local instruction file containing the canonical `as-is.md` architecture statement exactly once.

Diagram plan: both diagrams are supplementary views (small graph, short labels, ELK/TB preferred), not critical or host-constrained views, so no pre-render layout plan is required by default; each is validated with the smallest available source-level check. No numeric render dimensions are asserted.

## Excluded paths

- `.git/` (version control internals), `.pi/` and `.as-is/` (host/benchmark runtime state, left untracked and untouched), `__pycache__/` (generated artifacts), `README.md`, `CHANGELOG.md`, `checks/`, `sample-data/`, `tests/` (existing artifacts preserved unchanged by setup; `checks/` and `CHANGELOG.md` are later touched only by the separate bounded feature request, not by setup).

## Validation after writes

- Titles use `# <component-name> - as-is`; every record has one resolving `**Lineage**: ` line and a named diagram subsection; Components table lists immediate children only and links resolving `as-is.md#design` anchors; no empty or placeholder diagram sections; `AGENTS.md` contains the canonical instruction exactly once; Markdown and Mermaid links resolve; `git diff --check` passes; a before/after `git status --porcelain` comparison proves all writes stayed inside the effective boundary.