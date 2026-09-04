# Side-by-side fidelity evidence — `assessing-determinism` (stage 1, full-flow)

Full-flow realization plan (user-accepted) stage 1. Fidelity source: `drafts/composable-skills.md` lines 520-539. Realization: `candidate/skills/reusable/assessing-determinism/SKILL.md`. For human clause-by-clause review (plan section 9, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized SKILL.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 520 | `### \`assessing-determinism\`` | 2 + directory | `name: assessing-determinism`, `candidate/skills/reusable/assessing-determinism/` | Exact name and directory (check 2). |
| 2 | 522 | **Purpose**: Identify evidence-supported deterministic improvements. | 8 | Identical. | Verbatim. |
| 3 | 524 | **Approach**: Compare repeated behavior and inputs, isolate nondeterministic sources, and recommend only changes supported by observed variance. | 12 | Identical. | Verbatim. |
| 4 | 526 | **How it should be done**: Classify steps as policy, transformation, observation, or judgment; compare bounded repetitions; quantify relevant variance and benefit; preserve intentional generative behavior; recommend retention, a bounded backlog item, or an explicitly authorized task. | 16 | Identical. | Verbatim; the four-way step classification, bounded-repetition comparison, variance/benefit quantification, the intentional-generative-behavior preservation rule, and the three-way outcome semantics (retention / bounded backlog item / explicitly authorized task — recommendations only, not self-authorizing actions) carried verbatim. No How-line "stop ..." clause exists, so no terminal-stop step was added. |
| 5 | 528-539 | #### Design view + Mermaid block: `Behavior["Repeated behavior"] --> Compare["Compare bounded runs"]`; `Compare --> Variance["Relevant variance"]`; `Variance --> Recommendation["Evidence-based recommendation"]` | 20-28 | Identical fenced mermaid block including `config: layout: elk` fence. | Byte-equal (script check 12). |
| 6 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `description: Establishes fit for identifying evidence-supported deterministic improvements; grants no tools, permissions, or authority.` | Derived from Purpose (522) plus line-107 fit framing; grants no tools or authority. Fit/no-grant phrases are line-107-derived additions — flagged for human adjudication (pilot pattern). |
| 7 | — | — | 6/10/14/18 | `## Purpose` / `## Approach` / `## How it should be done` / `## Design view` headings | Plan-decided artifact form; the draft uses bold labels. |

Static check results: `candidate/evidence/full-flow-assessing-determinism-checks.txt` (12 pass, 0 fail; 981 characters vs 2,000-character voluntary target, draft line 132). Isolation: fixture contained only this skill's directory (listing in the checks file). File ended with a newline as produced (no integration adjustment).

## Items flagged for human adjudication

1. Description wording — line-107-derived additions (pilot pattern).
2. Heading-level variance across realizations (pilot residual risk 2).
