# Side-by-side fidelity evidence — `writing-code` (stage 1, full-flow)

Full-flow realization plan (user-accepted) stage 1. Fidelity source: `drafts/composable-skills.md` lines 331-350. Realization: `candidate/skills/reusable/writing-code/SKILL.md`. For human clause-by-clause review (plan section 9, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized SKILL.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 331 | `### \`writing-code\`` | 2 + directory | `name: writing-code`, `candidate/skills/reusable/writing-code/` | Exact name and directory (check 2). |
| 2 | 333 | **Purpose**: Create or substantially implement code from a bounded requirement. | 8 | Identical. | Verbatim. |
| 3 | 335 | **Approach**: Translate an authorized requirement into new or substantially generated implementation, then hand the result to focused testing and validation. | 12 | Identical. | Verbatim. |
| 4 | 335 | **How it should be done**: Read the requirement, interfaces, constraints, and nearby patterns; define changed artifacts and acceptance mapping; implement the smallest coherent path; preserve ownership and error behavior; return the diff for testing and validation rather than claiming completion. | 16 | Identical. | Verbatim; ordering preserved; the no-completion-claim clause ("return the diff … rather than claiming completion") carried verbatim as the outcome rule. No How-line stop clause exists, so no terminal-stop step was added. |
| 5 | 148 (authorized note) | "`writing-code` supports new or substantially generated implementation from a bounded requirement." / "`applying-bounded-edits` makes surgical changes to existing artifacts while preserving unrelated content." | 18 | This skill supports new or substantially generated implementation from a bounded requirement and does not cover surgical changes to existing artifacts, which applying-bounded-edits covers as a separate capability. | Explicitly authorized by plan section 5 (line 148 separation note, mirroring the pilot's applying-bounded-edits realization); name mention only, no path reference (script check 4 passed). |
| 6 | 339-350 | #### Design view + Mermaid block: `Requirement["Approved requirement"] --> Design["Interfaces and constraints"]`; `Design --> Code["Coherent implementation"]`; `Code --> Tests["Testing handoff"]` | 22-32 | Identical fenced mermaid block including `config: layout: elk` fence. | Byte-equal (script check 12). |
| 7 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `description: Establishes fit for creating or substantially implementing code from a bounded requirement; grants no tools, permissions, or authority.` | Derived from Purpose (333) plus line-107 fit framing; grants no tools or authority. Fit/no-grant phrases are line-107-derived additions — flagged for human adjudication (pilot pattern). |
| 8 | — | — | 6/10/14/18 | `## Purpose` / `## Approach` / `## How it should be done` / `## Design view` headings | Plan-decided artifact form; the draft uses bold labels. |

Static check results: `candidate/evidence/full-flow-writing-code-checks.txt` (12 pass, 0 fail; 1,233 characters vs 2,000-character voluntary target, draft line 132). Isolation: fixture contained only this skill's directory (listing in the checks file).

## Implementer integration adjustments (recorded)

1. Added the missing trailing newline (worker omission; content unchanged — recurring worker gap, recorded per skill).

## Items flagged for human adjudication

1. Description wording — line-107-derived additions (pilot pattern).
2. The line-148 separation note (realized line 18) is an explicitly authorized plan-section-5 addition; carried here for the human's clause-by-clause review like the pilot's `applying-bounded-edits` counterpart.
3. Heading-level variance across realizations (pilot residual risk 2).
