# F1 core/ Gate Adviser Review

Date: 2026-09-01. Verbatim adviser output. Context: F1 (setup/adoption family) of the adoption flow hit the pre-planned [A5] core/ stop condition: live core/ references to the retiring names `as-is-setup` and `integrate-as-is-documentation` (`core/adapters/host-setup/backlog.md` rule 5; `core/contracts/architecture-vocabulary.md` rows 72-73; non-dependencies classified: `setup.test.ts` tmpdir prefix, historical changelog entries). Orchestrator options 1-3 were submitted; the verdict below is the planning-adviser's (job `j-mti7g49r-j673j2`, session `1d675d97-9224-41a1-84bf-94b6da356a8e`, gpt-5.6-sol). The question of which core/ reconciliation pattern governs, and the plan amendment, remain human-authorized decisions per the adviser's own Q3 separation.

---

VERDICT: PROCEED-WITH-OPTION-1

1. **Q1.** Yes. Item 3 is a live operating rule directing future work to a retiring path. Item 4 is a live contract-consumer reference whose links would become dangling; under [A5], “dependency” is not limited to imports or runtime dependencies. The assessments of items 1 and 2 are correct: the temporary-directory prefix is incidental text, and the changelog entries are historical evidence. Preserve both and classify them during the sweep rather than forcing a literal zero-match grep.

2. **Q2.** Use a modified Option 1: just-in-time, family-scoped core reconciliation in a separate commit immediately before each affected family. For F1:
   - Rewrite host-setup backlog rule 5 to reflect the approved absorbed disposition while preserving the adapter as executable host-setup owner.
   - Replace the two obsolete vocabulary consumer rows with one `master/managing-as-is-records` row where its actual term usage supports that mapping; remove unsupported vocabulary claims rather than duplicating or overstating them.
   
   Apply the same bounded pattern to later affected families. A single standing authorization may cover F1–F5 if it enumerates the eligible core files, retiring-to-adopted mappings, and separate-commit rule. Option 2 is unnecessarily broad and can describe adopted records as current consumers before their family swap. Option 3 violates [A5] and the per-family zero-dangling-reference gate while leaving broken links for multiple commits.

3. **Q3.** Explicit human authorization is required for:
   - Amending the approved plan’s otherwise-unmodified `core/` boundary.
   - Authorizing the core-owned edits and extra reconciliation commits, either family-by-family or through a sufficiently specific standing authorization.
   - Any broader core migration, additional files, unsupported semantic remapping, or changed core architecture discovered during execution.
   
   The adviser verdict is not that authorization. Once authorization defines the boundary and mappings, the orchestrator may select exact wording, perform the term-use check, leave incidental and historical matches untouched, create each separate scoped core commit, run link/reference validation, and resume the already-approved family when its gate is clean. A delegated family worker still must not edit `core/`; the authorized core reconciler/orchestrator owns that commit.

4. **Q4.** Yes. The current “core remains unmodified” language and one-commit-per-family framing otherwise conflict with this execution pattern. The minimal amendment is to replace the applicable `core/` clauses in sections 2–3 and [A5] with:

   > Broad `core/` migration remains out of scope, and family commits never edit `core/`. When a family sweep finds a live `core/` reference to a name that family will retire, the family remains blocked until a separately human-authorized, separately committed reconciliation updates only that live reference to an already-present adopted target or removes it when no valid consumer remains. Historical records and incidental non-reference strings remain unchanged. A standing authorization may enumerate multiple affected families, but each reconciliation remains family-scoped and precedes its family commit. The family gate then requires zero dangling live references.

5. **Q5.** Put the one-line row 47 premise correction in the integrated F1 commit. It is a direct semantic consequence of retiring the standalone setup skill, while root backlog references are within the plan’s overall adoption scope; a separate commit would reduce atomicity without adding useful isolation. The root orchestrator should make the root-owned change, not a delegated family child. Preserve the “Original dependency context” citations in rows 47 and 50 as provenance. No additional plan amendment is needed for that one-line correction.

**Residual risk:** `master/managing-as-is-records` is narrower than the two retired setup/adoption procedures, so core wording and row 47 must not imply that it independently provides component discovery, human disposition, or executable host setup. Each later vocabulary remapping requires its own semantic term-use check; a clean path substitution alone is insufficient. Validation should report classified surviving grep matches so historical and incidental strings are not misrepresented as dangling references.
