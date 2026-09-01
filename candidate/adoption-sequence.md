# Adoption Sequencing Decision (recorded 2026-09-01)

Decision authority: user. Supersedes nothing; the adoption-flow plan will reference this record.

## Decided approach

Adoption is prepared entirely off master, on the working branch `implementing-composable-skills`, and lands on master as a **single merge commit** that is the cutover point of record.

1. **Prepare side-by-side on the branch**: candidate agents and skills are introduced into their live workflow positions on the branch while baseline items still exist (both mounted, no path conflicts), using the sequenced per-family atomic swaps recorded below.
2. **Swap per capability family on the branch**: each commit retires one baseline skill or family and wires its candidate counterpart(s) plus all proven-reference updates (AGENTS.md, as-is records, core contract references, .pi settings, validation fixtures) atomically. Each swap is bisectable and revertable within the branch.
3. **Pre-merge validation gate**: before merging, the post-adoption shape is validated on the branch (candidate workflow carries real work; fidelity checks and launcher mechanics pass in live positions). [Amended 2026-09-01] The gate additionally requires a **final head-to-head benchmark of the adopted branch workflow against the master baseline workflow**, run per the round methodology (baseline arm = master `9a77e37` workflow; candidate arm = the post-adoption branch workflow), with results recorded before the merge request; the merge proceeds only after that benchmark evidence is recorded.
4. **Single merge into master**: `git merge --no-ff implementing-composable-skills` on master. From master's perspective the adoption is one atomic commit: master is either pre-adoption (`9a77e37` state) or post-adoption, with no intermediate state. Revert is a single merge-revert. Branch history (benchmark rounds, adjudications, evidence chain) is preserved inside the merge — a squash merge is rejected because it would destroy the provenance the program's claims rest on.

## Rejected alternative

Single-commit big-bang on the live workflow (drop all baseline items and introduce candidate items in one working-tree commit): rejected because the baseline is the executing workflow that performs the migration itself, because proven references must be updated atomically per moved piece, and because a monolith is not attributable if it breaks. The concern behind it — one clean cutover point — is met by the single merge into master instead.

## Preconditions for the merge

- master must not advance from `9a77e37` before the merge (currently true; baseline unchanged since the round-1 pin).
- Advancement record signed off (declaration-only) before adoption work repositions files.
- The adoption-flow plan (separately drafted, large-chunk work — compact before starting) enumerates the family order and the validation gate per step.