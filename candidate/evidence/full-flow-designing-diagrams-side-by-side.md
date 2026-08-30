# Side-by-side fidelity evidence — `designing-diagrams` (stage 1, full-flow)

Full-flow realization plan (user-accepted) stage 1. Fidelity source: `drafts/composable-skills.md` lines 457-476. Realization: `candidate/skills/reusable/designing-diagrams/SKILL.md`. For human clause-by-clause review (plan section 9, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized SKILL.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 457 | `### \`designing-diagrams\`` | 2 + directory | `name: designing-diagrams`, `candidate/skills/reusable/designing-diagrams/` | Exact name and directory (check 2). |
| 2 | 459 | **Purpose**: Design bounded reader-oriented visual explanations. | 8 | Identical. | Verbatim. |
| 3 | 461 | **Approach**: Select a diagram type and symbols that explain the intended relationships while keeping source, navigation, and ownership accurate. | 12 | Identical. | Verbatim. |
| 4 | 463 | **How it should be done**: Define the reader question and view boundary; choose functional nodes and canonical relationships; include only supported context; design labels and layout for scanning; provide source and expected navigation targets for validation. | 16 | Identical. | Verbatim; ordering preserved (reader question/boundary → nodes/relationships → supported context only → labels/layout → source/navigation targets for validation). No How-line stop clause exists, so no terminal-stop step was added. |
| 5 | 465-476 | #### Design view + Mermaid block: `Question["Reader question"] --> View["Bounded visual view"]`; `View --> Labels["Functional labels"]`; `Labels --> Source["Validated diagram source"]` | 20-28 | Identical fenced mermaid block including `config: layout: elk` fence. | Byte-equal (script check 12). |
| 6 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `description: Establishes fit for designing bounded reader-oriented visual explanations; grants no tools, permissions, or authority.` | Derived from Purpose (459) plus line-107 fit framing; grants no tools or authority. Fit/no-grant phrases are line-107-derived additions — flagged for human adjudication (pilot pattern). |
| 7 | — | — | 6/10/14/18 | `## Purpose` / `## Approach` / `## How it should be done` / `## Design view` headings | Plan-decided artifact form; the draft uses bold labels. |

Static check results: `candidate/evidence/full-flow-designing-diagrams-checks.txt` (12 pass, 0 fail; 890 characters vs 2,000-character voluntary target, draft line 132). Isolation: fixture contained only this skill's directory (listing in the checks file).

## Implementer integration adjustments (recorded)

1. Added the missing trailing newline (worker omission; content unchanged — recurring worker gap, recorded per skill).

## Items flagged for human adjudication

1. Description wording — line-107-derived additions (pilot pattern).
2. Heading-level variance across realizations (pilot residual risk 2).
