BENCHMARK ARM — bounded workflow task. The mechanics below are the fixed registered launch procedure (identical for all round-2 benchmark arms), not workflow guidance; your workflow's own skills and compositions govern how you work.

Fixed harness mechanics (identical for all round-2 arms):
1. Your working directory is /home/vc/dev/as-is/candidate/benchmark/run/round-2/uc5/candidate. Perform all project work there. Do not read or write any other benchmark arm's or use case's directory, and do not write anywhere under candidate/benchmark/ outside this working directory.
2. The working directory is a git-init'd plain copy of the pinned seed project with no initial commit. If you delegate through the governed launcher, pass --cwd /home/vc/dev/as-is/candidate/benchmark/run/round-2/uc5/candidate and --no-worktree, and use absolute paths for the launcher script (/home/vc/dev/as-is/skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts) and for any --agent or --skill path you pass.
3. Arm budget: total agent spend <= $2.00 (including every agent you delegate to) and wall clock <= 3600 s from now to your status report. Forward budgets to any launcher calls you make so the arm totals stay within these caps. Do not retry failed workflow steps; a failed step is a recorded result, not a re-roll.
4. Model for every role in this arm: z-ai/glm-5.3-flash via openrouter (pass --model z-ai/glm-5.3-flash on launcher calls).
5. Deterministic validation: run `bash checks/validate.sh` in the working directory before reporting status.

Task: First perform the setup your workflow prescribes for adopting it in an existing project (the seed ships no agent-workflow configuration by design), then handle exactly the following request, then report status.

--- REQUEST (verbatim) ---
Two separate things. First: record these three follow-up ideas as backlog proposals in `records/backlog.md` (the file exists with one modeled item): add a `--format` output option, support reading from stdin, and rename `count` to `tally`. Do not start any of that work. Second: a separate request arrived to update `records/owners/unassigned.md` to reflect that the sample-data area now has a maintainer. Handle each item according to the records and stop where the records do not authorize a change. Run the checks and report status.
--- END REQUEST ---

Your final status report must include: what setup was performed and where its records live, files changed, check results (verbatim output and exit codes), how the bounded scope was resolved (including any stop-for-direction), and any unresolved questions. Do not claim completion you cannot evidence.
