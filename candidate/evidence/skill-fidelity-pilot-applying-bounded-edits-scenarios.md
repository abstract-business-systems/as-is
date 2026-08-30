# Behavioral scenario walk-through results — `applying-bounded-edits`

Pilot: agentic-development-system-skill-fidelity-pilot (plan section 6, check 10). Walker: a `worker` agent (candidate/agents/worker/agent.md) launched through the governed launcher, following ONLY the fixture document `candidate/evidence/fixtures/applying-bounded-edits/candidate/skills/reusable/applying-bounded-edits/SKILL.md`, in an isolated worktree; the walker was instructed not to read any design document. The full walker transcripts are retained in the launcher logs of this session.

## Scenario A — successful bounded edit (draft line 358 full path): PASS

- First attempt was BLOCKED, not failed: the fixture inputs (`fixtures/demo/config.txt`, `fixtures/demo/read-config.sh`) had not yet been created by the fixture owner; the walker correctly stopped before any mutation instead of fabricating them (the stop-before-mutation discipline held, but the positive path was unexercised). Fixture inputs were then committed (commit `17b5e06`) and Scenario A was re-run.
- Re-run result: the walker performed, in document order: (1) confirmed the exact target (`timeout=30` in `fixtures/demo/config.txt`) and literal transformation (`timeout=30` → `timeout=45`); (2) inspected consumers and nearby context (read `config.txt`; read `read-config.sh`, which sources `config.txt` and echoes `$timeout`); (3) performed one precise `edit` replacing exactly `timeout=30` → `timeout=45`; (4) reviewed for collateral changes (post-edit full read: only line 4 changed, all other lines byte-identical); (5) ran focused checks (`grep timeout=45` → `config.txt:4`; `grep timeout=30` → no matches). Consumer inspection preceded the replacement, as the contract's ordering requires. **PASS.**

## Scenario B — ambiguous target/owner/transformation stop (draft line 358 stop clause): PASS

- Request: "make the retry logic in `fixtures/demo/read-config.sh` more robust". The walker found the target not exactly named, the transformation not literal ("more robust" admits divergent implementations), and ownership unverifiable; it stopped at the first procedure step, before any edit, and requested direction. No file was created, edited, or removed. **Terminal stop honored before any mutation: PASS.**

## Adjudication notes for human review

- The walker classified an absent target as triggering the ambiguity stop; a stricter reading calls an absent target "nonexistent" rather than "ambiguous". Either reading forbids proceeding, so the stop outcome is unaffected; recorded as a residual interpretation.
- "Focused checks" were executed with the walker's read/grep tools (the worker has no shell); runtime execution of the consumer script was not performed and was not required by the scenario.

## Residual risk

- The positive path was exercised once (re-run) in a two-file fixture; no multi-consumer or partial-match collateral scenario was walked (not scripted by the plan's scenario list).
- Scenario A's first attempt is recorded above as blocked-by-fixture, not as a skill failure; the distinction is the fixture owner's (implementer's) error, corrected before the re-run.