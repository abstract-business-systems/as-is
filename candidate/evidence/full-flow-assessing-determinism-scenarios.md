# Behavioral scenario walk-through results — `assessing-determinism` (stage 1, full-flow)

Plan section 9, check 10. Walker: one `worker` agent via the governed launcher (420 s / $0.10), following ONLY the fixture document `candidate/evidence/fixtures/assessing-determinism/candidate/skills/reusable/assessing-determinism/SKILL.md` in its isolated worktree; instructed not to read any design document or other candidate file. Transcript retained in `/tmp/walk-assessing-determinism.log`.

## Scenario A — evidence-supported variance assessment (draft lines 522/524): PASS

The walker classified the steps (policy/observation/judgment), compared the three bounded repetitions, isolated the nondeterministic source (unstable concurrent config read, not pipeline logic), quantified the variance and benefit, and recommended a **bounded backlog item** — one of the contract's three outcome options — without implementing anything. **PASS.**

## Scenario B — intentional-generative preservation path (draft line 524 "preserve intentional generative behavior"): PASS

The demand to replace an intentionally generative step (marked intentional by the fixture's design contract) with a fixed template was refused: the document's "preserve intentional generative behavior" clause controls, the recommendation set was bounded to the contract's three outcomes, and the evidence-based recommendation was **retention** (with the explicitly-authorized-task path noted as the only change route, not recommended on current evidence). **PASS.**

## Walker-noted ambiguities (flagged for human adjudication — recorded, not normalized)

1. Step-classification categories (policy/transformation/observation/judgment) are undefined; plain-language readings may vary across walkers.
2. "Quantify relevant variance and benefit" prescribes no metric; walker's quantification is one defensible choice.
3. Fixture naming mismatch (runs.md/"generate message" vs behavior.md/"generate suggestion text") — fixture-owner error, no effect on outcomes (content matched).

## Residual risk

One evidence run over a single-record fixture; no "explicitly authorized task" outcome scenario was walked (the third outcome option exercised only as a mention; plan minimum met). No files were modified by the walker.