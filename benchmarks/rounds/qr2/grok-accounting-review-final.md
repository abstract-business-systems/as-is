## Gate 3 final audit

**Demand 1 (four addendum rows):** MET. Instruction now carries: launching-client **project cwd** as config origin (distinct from child component-root cwd); **actor/caller, session, parent-session/job, task-record** wiring; **mode, permissions, tools** honored; **named-alias lookup with literal-ID passthrough**.

**Demand 2 (generalized keys + precedence):** MET. No `agents.*` lock-in. Model: authorized override → role model → aliases with passthrough → project default likewise; provider carried. Thinking: override → role → project default. No caller inheritance when child choices exist; report only true unavailability.

**Demand 3 (role contracts):** MET. Contract nouns only: bounded **no-commit** implementation, read-only analysis, read-only validation of supplied controlled-worktree evidence. Skills additive-minimal; contract never broadened.

**Demand 4 (≤3000B):** FAIL. Measured **3686B** (title + eight paragraphs + blank lines; body ~3637B). ~23% over. Blank lines are negligible; ~700B of prose must go.

**Residual skip risk:** Low–moderate, mapping not semantics. Portable nouns (`project default`, `named aliases`, `project-local trust`, `persistence`) can miss runtime surfaces if the adapter is sloppy. Precedence + “when child choices exist” leaves a thin caller-inheritance gap if both role and project default are unset. Evidence-validator is selected by contract, not by a situational trigger. Launcher discovery, session-directory paths, and record filenames correctly remain out of scope.

**Size ruling:** Cap **not waived**. 3686B is the same miss, not a rounding error.

**Verdict: APPROVE-WITH-CHANGES** — compress to ≤3000B without dropping carried capabilities; do not reopen out-of-scope path/filename/`--pi` policy.