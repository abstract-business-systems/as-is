# Side-by-side fidelity evidence — `choosing-names` (stage 1, full-flow)

Full-flow realization plan (user-accepted) stage 1. Fidelity source: `drafts/composable-skills.md` lines 268-287. Realization: `candidate/skills/reusable/choosing-names/SKILL.md`. For human clause-by-clause review (plan section 9, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized SKILL.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 268 | `### \`choosing-names\`` | 2 + directory | `name: choosing-names`, `candidate/skills/reusable/choosing-names/` | Exact name and directory (check 2). |
| 2 | 270 | **Purpose**: Select semantically accurate names using local conventions. | 8 | Identical. | Verbatim. |
| 3 | 272 | **Approach**: Inspect the concept's parent, siblings, and naming guidance, then choose the narrowest accurate name and record material departures. | 12 | Identical. | Verbatim. |
| 4 | 274 | **How it should be done**: Identify the concept's responsibility and lifecycle; inspect parent and sibling names; consult naming guidance; compare alternatives for semantic precision and discoverability; choose one name; update proven references atomically when renaming. | 16 | Identical. | Verbatim; ordering preserved (responsibility/lifecycle → parent/sibling inspection → guidance → alternatives → choose → atomic rename updates). No How-line stop clause exists, so no terminal-stop step was added. |
| 5 | 276-287 | #### Design view + Mermaid block: `Concept["Responsibility"] --> Vocabulary["Parent and sibling vocabulary"]`; `Vocabulary --> Alternatives["Candidate names"]`; `Alternatives --> Name["Narrow accurate name"]` | 20-28 | Identical fenced mermaid block including `config: layout: elk` fence. | Byte-equal (script check 12). |
| 6 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `description: Establishes fit for selecting semantically accurate names using local conventions; grants no tools, permissions, or authority.` | Derived from Purpose (270) plus line-107 fit framing; grants no tools or authority. Fit/no-grant phrases are line-107-derived additions — flagged for human adjudication (pilot pattern). |
| 7 | — | — | 6/10/14/18 | `## Purpose` / `## Approach` / `## How it should be done` / `## Design view` headings | Plan-decided artifact form; the draft uses bold labels. |

Static check results: `candidate/evidence/full-flow-choosing-names-checks.txt` (12 pass, 0 fail; 895 characters vs 2,000-character voluntary target, draft line 132). Isolation: fixture contained only this skill's directory (listing in the checks file). File ended with a newline as produced (no integration adjustment).

## Items flagged for human adjudication

1. Description wording — line-107-derived additions (pilot pattern).
2. Heading-level variance across realizations (pilot residual risk 2).
