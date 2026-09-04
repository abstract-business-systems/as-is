# Side-by-side fidelity evidence — `spawning-subagents` (stage 3, full-flow)

Full-flow realization plan (user-accepted) stage 3. Fidelity source: `drafts/composable-skills.md` lines 863-883. Realization: `candidate/skills/master/spawning-subagents/SKILL.md`. For human clause-by-clause review (plan section 9 adapted, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text | Realized SKILL.md line(s) | Fidelity note |
| --- | --- | --- | --- | --- |
| 1 | 863 | `### `spawning-subagents`` | 2 + directory | Exact name and directory (check 2). |
| 2 | 865 | **Purpose**: Launch, observe, recover, and hand off bounded delegated work under existing authority. | Purpose section | Verbatim (script check 1). |
| 3 | 867 | **Approach**: Build a bounded handoff, launch through the approved host path, observe progress and evidence, enforce budgets and recovery, and retain parent authority. | Approach section | Verbatim (script check 1). |
| 4 | 869 | **How it should be done**: Verify role admission, worker configuration, component boundary, budget, and task state; construct explicit context and return conditions; launch through the approved adapter; observe bounded handles and evidence; recover or stop without inferring completion. | How it should be done section | Verbatim (script check 1); stop conditions carried as terminal stops per the plan's cross-cutting interpretation. |
| 5 | 871-883 | #### Design view + Mermaid block | Design view section | Byte-equal fenced block (script check 12). |
| 6 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `Realizes the spawning-subagents contract for launching, observing, recovering, and handing off bounded delegated work under existing authority; establishes fit, not permission.` — fit wording derived from the Purpose line; line-107-derived additions flagged for adjudication (pilot pattern). |
| 7 | — | — | 6/10/14/18/22 | `## ` headings for the five sections | Plan-decided artifact form; the draft uses bold labels. Composition context is the plan-required composition-context section (plan section 4, artifact form). |

Composition context: Tool-access row (draft line 123) carried verbatim as composition-admission documentation; no runtime admission change (plan section 12).

Static check results: `candidate/evidence/full-flow-master-spawning-subagents-checks.txt` (see file for counts; size recorded against the voluntary 2,000-character target, which masters may exceed per draft line 132). Isolation: fixture contained only this master's directory (listing in the checks file). File ends with a newline as produced.

## Items flagged for human adjudication

1. Description wording — line-107-derived fit phrasing (pilot pattern); consistency across the catalog is an adjudication item.
