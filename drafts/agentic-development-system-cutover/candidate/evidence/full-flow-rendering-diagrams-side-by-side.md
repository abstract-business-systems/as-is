# Side-by-side fidelity evidence — `rendering-diagrams` (stage 1, full-flow)

Full-flow realization plan (user-accepted) stage 1. Fidelity source: `drafts/composable-skills.md` lines 478-497. Realization: `candidate/skills/reusable/rendering-diagrams/SKILL.md`. For human clause-by-clause review (plan section 9, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized SKILL.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 478 | `### \`rendering-diagrams\`` | 2 + directory | `name: rendering-diagrams`, `candidate/skills/reusable/rendering-diagrams/` | Exact name and directory (check 2). |
| 2 | 480 | **Purpose**: Render and inspect diagrams when rendering is material. | 8 | Identical. | Verbatim. |
| 3 | 480 | **Approach**: Use the available renderer, inspect the output and expected links, and report unsupported renderer capability separately from source validity. | 12 | Identical. | Verbatim. |
| 4 | 484 | **How it should be done**: Validate source syntax first; render through the approved local capability; inspect geometry, labels, links, and expected hrefs; distinguish renderer-unavailable from source-invalid; retain source-level evidence when rendering cannot run. | 16 | Identical. | Verbatim; ordering preserved (syntax validation precedes rendering — a fidelity-sensitive ordering); the renderer-unavailable/source-invalid separation and the source-level-evidence retention rule carried verbatim. No How-line stop clause exists, so no terminal-stop step was added. |
| 5 | 486-497 | #### Design view + Mermaid block: `Source["Diagram source"] --> Renderer["Approved renderer"]`; `Renderer -->|available| Inspect["Inspect geometry and links"]`; `Renderer -->|unavailable| Report["Report source-only evidence"]` | 20-30 | Identical fenced mermaid block including `config: layout: elk` fence and both labeled availability branches. | Byte-equal (script check 12). |
| 6 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `description: Establishes fit for rendering and inspecting diagrams when rendering is material; grants no tools, permissions, or authority.` | Derived from Purpose (480) plus line-107 fit framing; grants no tools or authority. Fit/no-grant phrases are line-107-derived additions — flagged for human adjudication (pilot pattern). |
| 7 | — | — | 6/10/14/18 | `## Purpose` / `## Approach` / `## How it should be done` / `## Design view` headings | Plan-decided artifact form; the draft uses bold labels. |

Static check results: `candidate/evidence/full-flow-rendering-diagrams-checks.txt` (12 pass, 0 fail; 950 characters vs 2,000-character voluntary target, draft line 132). Isolation: fixture contained only this skill's directory (listing in the checks file). File ended with a newline as produced (no integration adjustment).

## Items flagged for human adjudication

1. Description wording — line-107-derived additions (pilot pattern).
2. Heading-level variance across realizations (pilot residual risk 2).
