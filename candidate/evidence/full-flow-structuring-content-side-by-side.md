# Side-by-side fidelity evidence — `structuring-content` (stage 1, full-flow)

Full-flow realization plan (user-accepted) stage 1. Fidelity source: `drafts/composable-skills.md` lines 289-308. Realization: `candidate/skills/reusable/structuring-content/SKILL.md`. For human clause-by-clause review (plan section 9, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized SKILL.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 289 | `### \`structuring-content\`` | 2 + directory | `name: structuring-content`, `candidate/skills/reusable/structuring-content/` | Exact name and directory (check 2). |
| 2 | 291 | **Purpose**: Choose a durable location, hierarchy, and representation. | 8 | Identical. | Verbatim. |
| 3 | 293 | **Approach**: Shape content around reader goals, ownership, discoverability, and lifecycle while preserving existing structural conventions. | 12 | Identical. | Verbatim. |
| 4 | 295 | **How it should be done**: Identify the reader and retrieval question; inspect the containing structure; choose the smallest meaningful location and representation; keep authority with the owning record; preserve navigation and lifecycle; assess moves before changing existing content. | 16 | Identical. | Verbatim; ordering preserved (reader/retrieval → inspect → smallest shape → authority → navigation/lifecycle → assess moves before changing). No How-line stop clause exists, so no terminal-stop step was added. |
| 5 | 297-308 | #### Design view + Mermaid block: `Need["Reader need"] --> Boundary["Owner and lifecycle"]`; `Boundary --> Shape["Smallest coherent shape"]`; `Shape --> Navigation["Discoverable artifact"]` | 20-28 | Identical fenced mermaid block including `config: layout: elk` fence. | Byte-equal (script check 12). |
| 6 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `description: Establishes fit for choosing a durable location, hierarchy, and representation for content; grants no tools, permissions, or authority.` | Derived from Purpose (291) plus line-107 fit framing; grants no tools or authority. Fit/no-grant phrases are line-107-derived additions — flagged for human adjudication (pilot pattern). |
| 7 | — | — | 6/10/14/18 | `## Purpose` / `## Approach` / `## How it should be done` / `## Design view` headings | Plan-decided artifact form; the draft uses bold labels. |

Static check results: `candidate/evidence/full-flow-structuring-content-checks.txt` (12 pass, 0 fail; 908 characters vs 2,000-character voluntary target, draft line 132). Isolation: fixture contained only this skill's directory (listing in the checks file). File ended with a newline as produced (no integration adjustment).

## Items flagged for human adjudication

1. Description wording — line-107-derived additions (pilot pattern).
2. Heading-level variance across realizations (pilot residual risk 2).
