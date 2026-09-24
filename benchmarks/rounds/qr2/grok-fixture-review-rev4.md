(1) PASS — Seed is spec + empty tree + admin artifact classes; no impls/records/paths before F0.
(2) PASS — Identical seed/progression; each arm emits and is checked against its own frozen path manifest.
(3) FAIL — Own-tree pre-hashes/packets/regression stated, but “accepted N-1 tree” contradicts scored cascade on degraded output.
(4) FAIL — That contradiction is a scoring ambiguity; later-phase gates on unrepaired trees are underspecified vs original “starts from accepted prior.”
(5) PASS — No concrete paths; roles/manifest only.

Blockers: In fixture 1, replace “accepted phase N-1 tree” with “that arm’s immutable post-tree from N-1 (pass or fail).” State that F0+ pre-trees, consultation hashes, interruption packets, and regression checks always bind to that arm’s own prior post-tree; harness never shares or repairs trees. Align leftover “Each phase starts from the accepted prior phase.”

Verdict: APPROVE-WITH-CHANGES