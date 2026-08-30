# Behavioral scenario walk-through results — `choosing-names` (stage 1, full-flow)

Plan section 9, check 10. Walker: one `worker` agent via the governed launcher (420 s / $0.10), following ONLY the fixture document `candidate/evidence/fixtures/choosing-names/candidate/skills/reusable/choosing-names/SKILL.md` in its isolated worktree; instructed not to read any design document or other candidate file. Transcript retained in `/tmp/walk-choosing-names.log`.

## Scenario A — compliant name selection (draft lines 272/274): PASS

The walker followed the document order exactly: identified responsibility and lifecycle (deployment verification report); inspected sibling vocabulary (`build-report.md`, `test-report.md`, `review-report.md`); consulted the fixture naming guidance (kebab-case, narrowest accurate name); compared three alternatives for precision and discoverability; chose `deployment-verification-report.md` as the narrowest accurate sibling-consistent name; recorded zero material departures. **PASS.**

## Scenario B — rename with atomic proven-reference updates (draft line 274 final clause): PASS

The walker stated the document's single rename directive (update **proven** references **atomically** when renaming) and applied it literally: enumerate proven references, one scoped change containing both the preservation-aware rename and all reference updates, then validate no stale references remain. No files were modified (described-only was sufficient for the directive walk). **PASS.**

## Walker-noted ambiguities (flagged for human adjudication — recorded, not normalized)

1. "Proven references" is undefined (verification method for a reference unspecified).
2. No precedence rule when naming guidance conflicts with sibling vocabulary.
3. "Record material departures" (Approach) lacks a recording destination.
4. Alternatives comparison has no bounded stopping criterion (walker used sibling-pattern fit).
5. Atomicity asserted but not operationalized (walker supplied the standard single-scoped-change reading).

## Residual risk

One evidence run over a two-input fixture; no guidance-conflict or departure-recording scenario was walked (latent ambiguities 2-3 unexercised; plan minimum met). No files were modified by the walker.