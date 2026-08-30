# Side-by-side fidelity evidence — `building-components` (stage 3, full-flow)

Full-flow realization plan (user-accepted) stage 3. Fidelity source: `drafts/composable-skills.md` lines 714-735. Realization: `candidate/skills/master/building-components/SKILL.md`. For human clause-by-clause review (plan section 9 adapted, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text | Realized SKILL.md line(s) | Fidelity note |
| --- | --- | --- | --- | --- |
| 1 | 714 | `### `building-components`` | 2 + directory | Exact name and directory (check 2). |
| 2 | 716 | **Purpose**: Build bounded component tasks with delegation, validation, history, and completion handoffs. | Purpose section | Verbatim (script check 1). |
| 3 | 718 | **Approach**: Build context, authorize the component task, delegate bounded work where useful, enforce acceptance and descendant gates, and prepare the owning completion handoff. | Approach section | Verbatim (script check 1). |
| 4 | 720 | **How it should be done**: Read the component record and authorized task; build decision context; obtain required plan review; stop at child boundaries; delegate only through configured workers; implement, test, validate, close descendants, write history, reconcile backlog, clean task artifacts, and prepare the scoped commit. | How it should be done section | Verbatim (script check 1); stop conditions carried as terminal stops per the plan's cross-cutting interpretation. |
| 5 | 722-735 | #### Design view + Mermaid block | Design view section | Byte-equal fenced block (script check 12). |
| 6 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `Build bounded component tasks with delegation, validation, history, and completion handoffs. Establishes fit for this master skill; grants no tools or authority.` — fit wording derived from the Purpose line; line-107-derived additions flagged for adjudication (pilot pattern). |
| 7 | — | — | 6/10/14/18/22 | `## ` headings for the five sections | Plan-decided artifact form; the draft uses bold labels. Composition context is the plan-required composition-context section (plan section 4, artifact form). |

Composition context: Workflow example (draft lines 168-170) and the target-design text composition (target-design lines 481-489) are carried verbatim as two named compositions of the same master (flagged for human adjudication: the two drafts give overlapping-but-distinct compositions). The workflow names preparing-scoped-commits (reusable, stage-1 PASS), implementing-tasks and managing-changelogs (masters with passing stage-3 records realized earlier in the recorded composition order).

Static check results: `candidate/evidence/full-flow-master-building-components-checks.txt` (see file for counts; size recorded against the voluntary 2,000-character target, which masters may exceed per draft line 132). Isolation: fixture contained only this master's directory (listing in the checks file). File ends with a newline as produced.

## Items flagged for human adjudication

1. Description wording — line-107-derived fit phrasing (pilot pattern); consistency across the catalog is an adjudication item.
