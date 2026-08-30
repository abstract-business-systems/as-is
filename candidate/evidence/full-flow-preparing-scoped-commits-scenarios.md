# Behavioral scenario walk-through results — `preparing-scoped-commits` (stage 1, full-flow)

Plan section 9, check 10. Walker: one `worker` agent via the governed launcher (420 s / $0.10), following ONLY the fixture document `candidate/evidence/fixtures/preparing-scoped-commits/candidate/skills/reusable/preparing-scoped-commits/SKILL.md` in its isolated worktree; instructed not to read any design document or other candidate file; git steps simulated (the walker has no shell) with exact commands described. Transcript retained in `/tmp/walk-preparing-scoped-commits.log`.

## Scenario A — compliant scoped-commit path (draft lines 629/633): PASS

The walker confirmed acceptance and descendant closure, identified the declared artifact set, staged exactly the three declared files (rejecting `git add -A`/`git add .`/`commit -a` as scope-sweeping), excluded the unrelated `scratch.txt` on the declared-scope rule, planned the staged-diff inspection and `git diff --cached --check`, and committed once with repository message style (style determined from repository history). **PASS.**

## Scenario B — terminal stop path (draft line 629 "stop when scope or completion authority is missing"; realized terminal clarifier, line 14): PASS

With descendant closure unrecorded, the walker stopped at the first procedure step before any staging or commit, refused the "diff looks good" override (collaborator request supplies no completion authority), and requested direction rather than proceeding — the terminal stop-for-direction clause fired as designed. **PASS.**

## Walker-noted ambiguities (flagged for human adjudication — recorded, not normalized)

1. "Exact backlog cleanup" has no operational definition (what qualifies as backlog-cleanup artifacts vs unrelated deletions).
2. "Repository message style" requires inspecting history; the skill names no method (walker described `git log` inspection).

## Residual risk

One evidence run; `git diff --cached --check` and staging were simulated (walker has no shell — consistent with the skill granting no tools); no whitespace-error capture path was exercised for real. No files were modified by the walker.