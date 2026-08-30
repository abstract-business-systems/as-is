# Side-by-side fidelity evidence — `drafting-changelog-entries` (stage 1, full-flow)

Full-flow realization plan (user-accepted) stage 1. Fidelity source: `drafts/composable-skills.md` lines 562-581. Realization: `candidate/skills/reusable/drafting-changelog-entries/SKILL.md`. For human clause-by-clause review (plan section 9, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized SKILL.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 562 | `### \`drafting-changelog-entries\`` | 2 + directory | `name: drafting-changelog-entries`, `candidate/skills/reusable/drafting-changelog-entries/` | Exact name and directory (check 2). |
| 2 | 564 | **Purpose**: Prepare concise history entries for the owning changelog procedure. | 8 | Identical. | Verbatim. |
| 3 | 564 | **Approach**: Summarize the durable result, evidence, scope, and residual risk without replacing the owning changelog or completion protocol. | 12 | Identical. | Verbatim. |
| 4 | 568 | **How it should be done**: Wait for validated completion evidence; name the task or change identity; summarize result and checks; state residual risk and source commits where applicable; let the owning procedure decide placement and cleanup. | 16 | Identical. | Verbatim; the validated-evidence precondition ("Wait for validated completion evidence" — a fidelity-sensitive ordering gate), the entry content fields, and the owning-procedure placement/cleanup delegation carried verbatim. No How-line "stop ..." clause exists, so no terminal-stop step was added. |
| 5 | 570-581 | #### Design view + Mermaid block: `Result["Validated result"] --> Summary["Concise evidence summary"]`; `Summary --> Owner["Owning changelog"]`; `Owner --> History["Durable history"]` | 20-28 | Identical fenced mermaid block including `config: layout: elk` fence. | Byte-equal (script check 12). |
| 6 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `description: Establishes fit for preparing concise history entries for the owning changelog procedure; grants no tools, permissions, or authority.` | Derived from Purpose (564) plus line-107 fit framing; grants no tools or authority. Fit/no-grant phrases are line-107-derived additions — flagged for human adjudication (pilot pattern). |
| 7 | — | — | 6/10/14/18 | `## Purpose` / `## Approach` / `## How it should be done` / `## Design view` headings | Plan-decided artifact form; the draft uses bold labels. |

Static check results: `candidate/evidence/full-flow-drafting-changelog-entries-checks.txt` (12 pass, 0 fail; 971 characters vs 2,000-character voluntary target, draft line 132). Isolation: fixture contained only this skill's directory (listing in the checks file). File ended with a newline as produced (no integration adjustment).

## Items flagged for human adjudication

1. Description wording — line-107-derived additions (pilot pattern).
2. Heading-level variance across realizations (pilot residual risk 2).
