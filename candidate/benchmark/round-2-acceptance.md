# Benchmark round-2 pre-registration — recorded user acceptance

Date: 2026-08-30. Registration: `candidate/benchmark/pre-registration-v2.md` @ `068b7e1`.

The user reviewed the round-2 proposal (three arms: baseline @ `9a77e37`, candidate @ `6cea07f`, candidate-no-diagrams; four use cases) and accepted it for execution: "the proposal looks good we can run the Benchmarks."

Standing condition attached by the user: **subagents must be used so the context is not bloated** — every arm run and the scoring pass are delegated to child pi sessions via the governed launcher; the main session orchestrates only (spawns, polls, and records pointers), never inlines model-run work. This extends round 1's worker-first cost discipline to all round-2 execution.
