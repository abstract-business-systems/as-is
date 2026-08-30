BENCHMARK ARM — bounded workflow task. The mechanics below are the fixed registered launch procedure (identical for both benchmark arms), not workflow guidance; your workflow's own skills and compositions govern how you work.

Fixed harness mechanics (identical for both benchmark arms):
1. Your working directory is __CONSUMER__. Perform all project work there. Do not read or write the other benchmark arm's directory, and do not write anywhere under candidate/benchmark/ outside this working directory.
2. The working directory is a plain copy of the pinned seed project; it is not a git repository. If you delegate through the governed launcher, pass --cwd __CONSUMER__ and --no-worktree, and use absolute paths for the launcher script (/tmp/as-is-child-OpmyGK/worktree/skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts) and for any --agent or --skill path you pass.
3. Arm budget: total agent spend <= $2.00 (including every agent you delegate to) and wall clock <= 3600 s from now to your status report. Forward budgets to any launcher calls you make so the arm totals stay within these caps. Do not retry failed workflow steps; a failed step is a recorded result, not a re-roll.
4. Model for every role in this arm: z-ai/glm-5.3-flash via openrouter (pass --model z-ai/glm-5.3-flash on launcher calls).
5. Deterministic validation: run `bash checks/validate.sh` in the working directory; it must pass with the feature's new tests included.

Task: First perform the setup your workflow prescribes for adopting it in an existing project (the seed ships no agent-workflow configuration by design), then implement exactly the following feature request, then report status.

--- FEATURE REQUEST (verbatim) ---
Add a `--top N` option to the `wordstats count` command that prints only the `N` most frequent words as a JSON object (keys sorted alphabetically), while keeping the default full-frequency output unchanged. `N` must be a positive integer; a zero or negative `N` is rejected with a nonzero exit and a clear message.

1. Before implementing, record a short human-facing design note under `docs/design-notes.md` describing the output format and tie-breaking behavior, following the existing note format.
2. The change stays bounded to the `wordstats` package (scope: component; see `records/ownership-map.md`).
3. Add focused tests for the new option, including tie-breaking and the rejection case.
4. All checks in `checks/validate.sh` must pass, including the new tests.
5. Report status when done, including the check results and any unresolved questions.
--- END FEATURE REQUEST ---

Your final status report must include: what setup was performed and where its records live, the design note location, files changed, check results (verbatim output and exit codes), how the bounded scope was resolved (including any stop-for-direction), and any unresolved questions. Do not claim completion you cannot evidence.