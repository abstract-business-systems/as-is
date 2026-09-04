# Side-by-side fidelity evidence — `preparing-scoped-commits` (stage 1, full-flow)

Full-flow realization plan (user-accepted) stage 1. Fidelity source: `drafts/composable-skills.md` lines 625-644. Realization: `candidate/skills/reusable/preparing-scoped-commits/SKILL.md`. For human clause-by-clause review (plan section 9, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized SKILL.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 625 | `### \`preparing-scoped-commits\`` | 2 + directory | `name: preparing-scoped-commits`, `candidate/skills/reusable/preparing-scoped-commits/` | Exact name and directory (check 2). |
| 2 | 627 | **Purpose**: Prepare authorized validated changes without staging unrelated work. | 8 | Identical. | Verbatim. |
| 3 | 631 | **Approach**: Separate the declared handoff, inspect the staged patch, run required checks, and stop when scope or completion authority is missing. | 12 | Identical. | Verbatim. |
| 4 | 631 (clarifier) | — | 14 | `Treat the final clause as a terminal stop-for-direction step: when scope or completion authority is missing, stop and request direction instead of proceeding.` | Appended sentence realizing plan section 5 interpretation 1 (terminal stop-for-direction, not advisory) — the same pattern the pilot validated and flagged for `applying-bounded-edits`. Flagged for human adjudication as an interpretive addition traceable to plan section 5. |
| 5 | 633 | **How it should be done**: Confirm acceptance and descendant closure; identify declared artifacts; stage only the changelog, exact backlog cleanup, task cleanup, and handoff; inspect staged diff and `git diff --cached --check`; commit once with repository message style. | 18 | Identical. | Verbatim; ordering preserved (acceptance+descendant closure → declared artifacts → narrow staging list → staged-diff inspection + `git diff --cached --check` → single commit with repository message style). The staging list is the fidelity-sensitive scope rule and is carried verbatim. |
| 6 | 635-644 | #### Design view + Mermaid block: `Completion["Validated completion"] --> Scope["Declared handoff scope"]`; `Scope --> Stage["Stage only declared files"]`; `Stage --> Commit["Scoped durable commit"]` | 24-32 | Identical fenced mermaid block including `config: layout: elk` fence. | Byte-equal (script check 12). |
| 7 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `description: Establishes fit for preparing authorized validated changes without staging unrelated work; grants no tools, permissions, or authority.` | Derived from Purpose (627) plus line-107 fit framing; grants no tools or authority. Fit/no-grant phrases are line-107-derived additions — flagged for human adjudication (pilot pattern). |
| 8 | — | — | 6/10/16/22 | `## Purpose` / `## Approach` / `## How it should be done` / `## Design view` headings | Plan-decided artifact form; the draft uses bold labels. |

Static check results: `candidate/evidence/full-flow-preparing-scoped-commits-checks.txt` (12 pass, 0 fail; 1,097 characters vs 2,000-character voluntary target, draft line 132). Isolation: fixture contained only this skill's directory (listing in the checks file).

## Implementer integration adjustments (recorded)

1. Added the missing trailing newline (worker omission; content unchanged — recurring worker gap, recorded per skill).

## Items flagged for human adjudication

1. Description wording — line-107-derived additions (pilot pattern).
2. The appended terminal-stop clarifier sentence (realized line 14; Approach line 629's stop clause) is a plan-section-5 interpretation addition, flagged here for human adjudication exactly like the pilot's `applying-bounded-edits` counterpart — note this realization carries the clarifier while several sibling realizations do not; catalog consistency is a human adjudication item.
3. Heading-level variance across realizations (pilot residual risk 2).
