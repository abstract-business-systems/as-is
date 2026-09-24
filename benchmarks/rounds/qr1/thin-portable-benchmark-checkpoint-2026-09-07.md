# Compaction checkpoint: thin portable instruction benchmark

## Checkpoint status

Prepared for compaction. This is temporary execution context, not a repository record, task authority, implementation approval, or consolidation decision.

Timestamp: 2026-09-07
Repository baseline: `c511642` (`master`, clean)

## User goal

Compare the current agents/skills setup with a very thin portable instruction for projects using the same primary harness. The intended alternative accepts model-dependent behavior, fewer formal contracts, weaker determinism, and less cross-system portability in exchange for simplicity and portability across projects using the harness.

Do not consolidate current agents/skills yet. Human alignment must precede any consolidation design or implementation work.

## Existing planning artifact

Temporary flow/proposal draft:

- `/tmp/thin-portable-harness-instruction-proposal.md`

It covers routing, direct handling, consultation, component and non-component work, ambiguity, restricted delegation, validation, recovery, completion, human alignment, risks, alternatives, and a later comparison plan.

Recommended artifact type: temporary draft/proposal. It is not an `as-is.md`, backlog item, task record, or adopted design decision.

## Benchmark work completed

A temporary benchmark runner was created:

- `/tmp/as-is-thin-benchmark.ts`

Two detached worktrees were created from `c511642`, used for the valid final pilot, and removed afterward. No branch was created, no commit was made, and `master` remained clean.

The valid final pilot used:

- Pi `0.84.4`.
- Provider `openrouter`.
- Model `@preset/abs-medium`.
- Reasoning `high`.
- Current arm: current `component-builder` prompt plus explicit configured skill manifest.
- Thin arm: same front matter, tools, model, thinking, launcher, fixture, task, and budgets; compact portable instruction plus a neutral skill solely to disable ambient skill loading.
- Both arms received the repository root `AGENTS.md`; therefore this does not yet prove portability in a stripped or unrelated project.
- Fresh no-session launches.
- 45-second wall-clock and USD 0.10 configured cap per call.
- Three scenarios: report-only orientation, explicit no-change, durable-authority conflict.
- Three repetitions per scenario and arm: 18 valid provider-backed calls.

Raw evidence:

- `/tmp/thin-portable-benchmark-results-2026-09-07.json`

Summary evidence:

- `/tmp/thin-portable-benchmark-summary-2026-09-07.md`

Provider-free fixture validation before the live run:

```text
bun test validation-fixtures/dummy-delegation/dummy-delegation.test.ts \
  validation-fixtures/dummy-delegation/launcher-startup.test.ts \
  validation-fixtures/dummy-delegation/parent-integration.test.ts

4 pass, 0 fail, 46 expectations
```

## Valid pilot result

| Arm | Passed | Trials | Timeouts | Mean elapsed |
|---|---:|---:|---:|---:|
| Current composition | 6 | 9 | 3 | 35.47 s |
| Thin instruction | 9 | 9 | 0 | 29.02 s |

By scenario:

| Scenario | Current | Thin |
|---|---:|---:|
| Orientation | 3/3 | 3/3 |
| No-change | 2/3 | 3/3 |
| Authority conflict | 1/3 | 3/3 |

Successful outputs from both arms correctly identified active/incomplete task state, preserved report-only scope, avoided delegation and mutation, and rejected completion claims based only on runtime/process evidence.

The current arm had three 45-second budget stops. The thin arm had no timeouts.

## Invalid/preparatory runs

An initial six-call attempt failed before provider execution because the fixture lacked a `.pi` symlink expected by the launcher. A corrected six-call pilot exposed a scorer defect: benchmark-created untracked files and dependency symlinks were counted as task mutations. These runs are excluded from the result above. The runner was corrected before the valid 18-call pilot.

Configured caps across the valid pilot were at most USD 1.80. Earlier preparatory calls also used the USD 0.10 cap, but actual provider spend is not available from the local evidence.

## Current interpretation

Evidence supports this bounded claim only:

> Under this model and harness, in the current repository context, a compact thin instruction was viable for three report-oriented flows and showed fewer timeouts than the current composition in this small sample.

Do not claim:

- general equivalence;
- superiority;
- implementation parity;
- delegation/recovery parity;
- cross-model portability;
- portability without repository `AGENTS.md` context;
- replacement or consolidation approval.

## Known limitations

- Only one model/provider configuration was tested.
- Only report-oriented scenarios were tested.
- No held-out implementation task was tested.
- No real delegation scenario was tested.
- Scoring used a temporary heuristic rather than blind independent review.
- Both arms shared the repository root `AGENTS.md` and the same launcher/runtime controls.
- Timeout frequency may be sensitive to provider variance and prompt context.
- The current arm and thin arm had identical declared tools but different substantive instructions; runtime guarantees were intentionally held constant.

## Next bounded stage

After compaction, continue with a separate temporary benchmark phase:

1. Create two new detached worktrees from `c511642`; do not use or modify `master`.
2. Add linked-context and contradictory/missing-evidence scenarios.
3. Add one held-out implementation microtask based on a recent completed task, preferably a sanitized small slice of the evidence/observability work around commits `2e09b7c`, `7a84e55`, `b6b0d50`, or `30b8e1d`. Avoid replaying obsolete paths without adapting the task to the current baseline.
4. Provide hidden deterministic acceptance checks unavailable to the agents during execution.
5. Keep model, tool set, task text, project snapshot, launcher, and budgets identical between arms.
6. Run at least three matched repetitions for the new scenarios; preserve full raw output and a concise blinded scoring summary in `/tmp`.
7. Treat unauthorized mutation, false completion, unsupported delegation, or loss of recoverable evidence as disqualifying failures where applicable.
8. Optionally run a stripped-context variant afterward to assess actual cross-project portability.
9. Remove temporary worktrees after copying raw evidence; verify `git status --short --branch` remains clean on `master`.

## Human decision still needed before broader conclusion

The human should decide whether the observed report-flow result justifies spending additional provider budget on the implementation/delegation stage. The next stage is still an experiment, not authorization to consolidate or retire current agents, skills, runtime controls, or records.

## Extended-stage evidence

The next stage used fresh detached worktrees and was cleaned up without touching `master`.

- Extended runner: `/tmp/thin-portable-extended-benchmark-runner-2026-09-07.ts`
- Extended summary: `/tmp/thin-portable-benchmark-extended-summary-2026-09-07.md`
- Corrected implementation raw evidence: `/tmp/thin-portable-implementation-results-2026-09-07.json`
- Corrected contradictory-evidence raw evidence: `/tmp/thin-portable-contradictory-results-2026-09-07.json`
- Excluded linked-context evidence: `/tmp/thin-portable-linked-context-results-excluded-2026-09-07.json`

The corrected hidden implementation test passed in 2/2 current-arm trials and 2/2 thin-arm trials. All four launcher workflows hit the 90-second budget before producing a final report. Therefore implementation outcome parity was observed, but workflow-completion parity was not demonstrated.

The linked-context scenario was excluded because the resolver returned `base-not-found` despite the fixture's explicit local link; this is a fixture/launcher-context issue requiring separate repair.

The corrected contradictory-evidence scenario was timeout-dominated: current 1/2 passed and thin 0/2 passed. It is inconclusive.

The valid conclusion remains bounded: the thin instruction is promising for report-oriented flows and matched the hidden implementation patch outcome in this small task, but general equivalence, portability, and consolidation readiness remain unproven.

## Increased-budget completion check

A fresh two-repetition implementation run increased the implementation budget from 90 to 180 seconds and the configured cost cap from USD 0.20 to USD 0.30 per call.

- Summary: `/tmp/thin-portable-completion-budget-summary-2026-09-07.md`
- Raw evidence: `/tmp/thin-portable-completion-budget-results-2026-09-07.json`
- Runner: `/tmp/thin-portable-completion-budget-runner-2026-09-07.ts`

Both arms completed 2/2, passed hidden acceptance 2/2, preserved scope 2/2, and returned final reports. Current mean elapsed time was 40.54s; thin mean elapsed time was 45.65s. This supports the interpretation that the earlier 90-second failures were budget starvation for this task, not inherent completion failure in either instruction surface. The sample is too small for a latency conclusion.

## Cost evidence

Provider-reported usage events were aggregated into:

- `/tmp/thin-portable-benchmark-cost-summary-2026-09-07.md`

For the initial 9-trial report pilot, measured cost was USD 0.03091217 current versus USD 0.02063558 thin. For the increased-budget 2-trial implementation completion check, measured cost was USD 0.00978395 current versus USD 0.00673477 thin. Across all preserved benchmark calls with usage evidence, including excluded scenarios, measured totals were USD 0.05484044 current versus USD 0.03550919 thin. These are provider-reported estimates, not invoice totals; preparatory invalid runs are excluded.

## Proposed next large benchmark stage

An advisory expert-role review recommended a new disposable **parallel evidence-incident-report composite task**, rather than extending the existing dummy-delegation rehearsal or replaying a solved product task.

Proposed shape:

- Parent task implements a bounded local incident-report command over registry/trace JSONL.
- Three genuinely parallel children own non-overlapping areas: parsing/normalization, lineage/retry correlation, and deterministic presentation/redaction.
- Parent owns CLI, shared integration, end-to-end tests, review, and final handoff.
- One declared fresh retry slot is available for one failed child only.
- Current arm uses the current component-builder composition; thin arm uses one compact parent instruction and the same harness/tool/budget conditions.
- Hidden tests cover shuffled input, retries, missing parents, cycles, malformed records, invalid values, duplicate IDs, unavailable sources, redaction, and cross-module integration.
- Harness enforces worktree containment, child slots, process/budget limits, hidden-test isolation, baseline hashes, and cleanup. Model judgment handles decomposition, child review, retry choice, implementation, and explanation.
- Proposed scored stage: five valid paired repetitions after a non-scored harness pilot; proposed maximum stage ceiling USD 10.00 including a USD 2.00 preregistered invalid-run contingency.

Recommended artifact: a temporary preregistration draft, proposed name `drafts/parallel-child-benchmark-stage-plan.md` if later admitted to the repository. It must freeze arm texts/hashes, task ownership, fixture/version, hidden-checker custody, budgets, randomization, validity rules, metrics, stop rules, and reporting format. No fixture, primary run, or repository artifact is authorized yet.

Human alignment is required before execution, including approval of the task family, three-child/one-retry shape, disqualifying safety failures, delegation scoring, USD 10.00 ceiling, hidden-test retention, and no-master-change boundary.

## Larger parallel-child benchmark evidence

The temporary parallel-child incident-report benchmark was executed with generous budgets after a harness pilot. Summary and raw results:

- Summary: `/tmp/thin-portable-parallel-child-benchmark-summary-2026-09-07.md`
- Runner: `/tmp/parallel-child-benchmark-runner-2026-09-07.ts`
- Valid pair 1: `/tmp/thin-portable-parallel-child-results-1788801691787.json`
- Acceptance-invalid pair: `/tmp/thin-portable-parallel-child-results-1788802889000.json`
- Valid pair 2: `/tmp/thin-portable-parallel-child-results-1788803504352.json`

The valid large-preset result used `@preset/abs-large`, two paired repetitions, a USD 2.00 parent cap, USD 0.50 per child cap, 900-second parent limit, and 420-second child limit. Both arms completed and passed hidden acceptance in both valid pairs. Harness-observed child evidence showed three initial children admitted before any initial child finished, three successful scoped commits, and no retries in each valid pair.

Measured totals across the two valid pairs were USD 1.38048350 current versus USD 0.72190010 thin; mean elapsed was 264.663 seconds current versus 195.429 seconds thin. The thin arm used approximately 47.7% less measured provider cost. The medium-preset pilot was infrastructure-invalid due upstream rate limiting and is excluded. One intervening pair was excluded because the hidden checker required unspecified exact floating-point equality; it was corrected to a tolerance-based assertion before the second valid pair.

This is bounded evidence for one synthetic task family and one alternate preset, not general equivalence. No durable repository artifact or master change was made.

## Isolated AGENTS-only thin follow-up

After alignment, the new thin arm was tested as a thin-only follow-up against the existing current-arm baseline. Summary: `/tmp/thin-agents-isolated-followup-summary-2026-09-07.md`; runner: `/tmp/thin-agents-isolated-runner-2026-09-07.ts`.

The provider-free pilot verified a standalone Git root, root `AGENTS.md`, no project `skills/` or `agents/` paths, no `resolve_component_context`, and the exact parent tool list `read,ls,find,bash,edit,write,call_subagent`. The approved `call_subagent` exception was not invoked in either valid run. Editable delegation still used the external parallel launcher through `bash`.

Two isolated thin-only runs completed and passed hidden acceptance. Both admitted the three initial children in parallel; one used no retry and the other used the single permitted retry. Combined measured cost was USD 1.05501610, mean cost USD 0.52750805, and mean elapsed 223.718 seconds. Against the fixed prior current baseline mean cost USD 0.69024175 and mean elapsed 264.663 seconds, isolated thin was approximately 23.6% cheaper and 15.5% faster. This is a follow-up comparison, not a fresh paired control, because current was not rerun.

## Next proposed design-first benchmark

The next candidate must be evaluated on a fresh task that genuinely requires its added capabilities. Plan: `/tmp/thin-portable-design-first-benchmark-plan-2026-09-07.md`.

The proposed Candidate C is an isolated portable thin arm with design-first guidance: capture current design, capture a separate planned design, identify the minimum meaningful components dynamically from responsibility and boundaries, implement only the minimum scope, and validate design-to-code alignment without prescribing document structure. The task must not predeclare component ownership or child slices.

The proposed benchmark has three fresh arms on the same task: current composition, isolated Candidate B, and Candidate C. Prior current and Candidate B results are historical context only and are not a valid baseline for this new capability set. The benchmark retains the large-preset budgets provisionally and requires a provider-free pilot plus preregistration before scored execution.

No fixture, scored run, or provider execution has started for this proposed stage.

## Recovery obligations

- Preserve the raw JSON evidence and summary files.
- Recreate worktrees from `c511642` rather than relying on deleted temporary paths.
- Do not interpret process exit, telemetry, or benchmark runner output as semantic completion without the recorded rubric result.
- Keep any new benchmark files outside the repository or in disposable worktrees.
- Do not commit, amend, push, create a branch, or alter remotes.

## Active workstream update (post-checkpoint)

The Candidate C protocol workstream has its own compaction handoff: `/tmp/thin-portable-candidate-c-handoff-2026-09-07.md`. Read that file first. Current state: protocol `c-dfdc-1.0.0-draft.3` (Sol-authored) verified fit for human Gate H1 decision by Grok 4.6; pending decision = Gate H1 approval for fixture preparation + provider-free pilot.
