# Behavioral scenario walk-through results — `running-tests` (stage 1, full-flow)

Plan section 9, check 10. Walker: one `worker` agent via the governed launcher (420 s / $0.10), following ONLY the fixture document `candidate/evidence/fixtures/running-tests/candidate/skills/reusable/running-tests/SKILL.md` in its isolated worktree; instructed not to read any design document or other candidate file. Transcript retained in `/tmp/walk-running-tests.log`.

## Scenario A — compliant smallest-check run (draft lines 396/400): PASS

The walker mapped the changed artifact to the focused `check validator` command, rejected the full suite as scope-broadening, ran the narrowest applicable command, captured all five status categories (pass/failure/skip/timeout/environment), recorded exit 0 as a process-exit observation only, reported the limitation (changed boundary behavior not exercised by this command), and recommended the next bounded check. **PASS.**

## Scenario B — exit-code-misuse and insufficient-evidence path (draft line 400 clauses 4-5): PASS

Faced with "exit 0, so the change is done", the walker characterized exit 0 strictly as a process-exit observation (not completion evidence), noting its coexistence with a skipped check and non-exercised changed behavior, and recommended the next bounded check (smallest check exercising the changed boundary behavior; network-dependent case where network exists). **PASS.**

## Walker-noted ambiguities (flagged for human adjudication — recorded, not normalized)

1. No weighting rule for skipped checks (limit-evidence vs block-completion); walker inferred limits-evidence.
2. "Evidence is insufficient" threshold undefined; walker used the fixture's own non-exercised-boundary note as trigger.
3. Report structure unspecified (content required, format chosen by walker).

## Residual risk

One evidence run over a simulated check result; no failure/timeout capture scenario was walked (statuses captured categorically; plan minimum met). No files were modified by the walker.