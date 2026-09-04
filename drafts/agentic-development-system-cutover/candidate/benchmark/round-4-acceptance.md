# Round-4 Acceptance Record

Date: 2026-09-01. Registered procedure: `candidate/benchmark/pre-registration-v4.md` (capability-coverage parity benchmark).

## Acceptance

The user accepted the pre-registration as drafted — including the concrete uc6–uc8 request texts and the registered parity margin (−1 per use case, ≤ 3 aggregate, all gates passing) — in this conversation ("Looks good. Let's prepare for compaction."), following prior approval of the methodology ("Looks good. Let's continue.").

Key registered parameters accepted:
- 2 arms: baseline `master @ 9a77e37` vs post-drop candidate variant (checksum `e4cd9366530976fa2f6e086e1447eec967088aa1ef8c476e7eb08afe6472c860`).
- 7 use cases: uc2–uc5 (round-3 requests verbatim) + uc6 maintenance flow, uc7 scoped commits + changelog verification, uc8 naming + structure + stop-for-direction.
- Pinned coverage matrix; registered rule: every capability must be OBSERVED INVOKED (session-store evidence) on both sides; zero-engagement capabilities are flagged and do not count toward parity until explained.
- Parity criterion: candidate ≥ baseline − 1 per UC, aggregate deficit ≤ 3, all safety gates passing; gate failure breaks parity regardless of score; deficits/zero-engagement flags cite the responsible composition and feed draft revision (never silent catalog edits).
- Budgets: caps $2.00 / 3600s per arm per use case (14 arms); expected ~$0.50 total including scorer.
- Standing conditions carried forward: subagent-delegated execution (main session only spawns/polls/collects); scorer = spawned implementer child from recorded evidence only; scorer mandate includes the capability engagement matrix; bundles created with target directory created first (round-2/3 bundle defect not repeated).

## Execution authorization

On this recorded acceptance, the implementer is authorized to: build the round-4 fixtures and execution setup, launch the 14 arms, collect evidence, spawn the scorer, and commit results — under the registered procedure and standing subagent condition.