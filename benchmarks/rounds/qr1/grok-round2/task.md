# Verification round 2: directive implementation audit (c-dfdc-1.0.0-draft.3)

## Role
You are the advisory verifier in a Sol⇄Grok ping-pong cycle. Sol (final protocol authority) adjudicated your round-1 artifact review as NOT FIT with 8 directives. The implementing agent reports all 8 directives are implemented. Your job: independently VERIFY — not trust. Sol explicitly weighs verified-by-running above verified-by-reading; use bash (read-only discipline) wherever a predicate can be executed. Do NOT modify, create, or delete any file inside /tmp/ccq-stage; use /tmp/grok-round2-scratch for any scratch output.

## Context
- Protocol: /tmp/sol-draft3/draft3-clean.md (c-dfdc-1.0.0-draft.3)
- Your round-1 review: /tmp/grok-artifact-review/review-result.md
- Sol's adjudication with the 8 directives: /tmp/sol-adjudication/sol-adjudication.md
- Artifacts under audit: /tmp/ccq-stage/{fixture,custody,harness,pilot,surface}/ and /tmp/ccq-stage/WORKLOG.md
- Pilot report + evidence: /tmp/ccq-stage/pilot/pilot-report.md, pilot-evidence.json, artifact-hashes.sha256

## Known accepted state (do not flag as violations)
- The human has accepted the opaque frozen @preset/abs-medium route and the floor-effect residual risk; the §26 checks 56/62/63 in the pilot are intentional TRUTHFUL FAILs pending a Sol-authored amendment. Judge whether the FAIL reporting is truthful and well-grounded, not whether the route resolves.
- OD-2: the current-composition surface is frozen at repo revision c511642 (surface/current-c511642).
- Assessor roster proposal: primaries anthropic/claude-fable-5.1 + moonshotai/kimi-k3, zero-trigger third x-ai/grok-4.6 (your dual role disclosed to Sol).

## Your verification checklist (one verdict each: VERIFIED-RUN / VERIFIED-READ / NOT-VERIFIED, with evidence)
1. Recorder: RecordedEvent declares referencedArtifacts; §15.3 chronology/grounding boundary; real beforeHash snapshots; semantic temporal-adequacy with named verdicts (recorder.ts + bun test recorder.test.ts).
2. Manifest: recursive canonicalization covers nested keys; stale-hash-on-nested-tamper test; output_limit explicitly encoded; load-manifest refuses unresolved route AND undeclared output limit (manifest.test.ts + load-manifest.ts).
3. Launcher: launch-arm.ts consumes the manifest, canonicalizes paths via realpath, rejects symlink/traversal escapes, blocks protected-authority writes, authorizes mount reads, enforces replacementSlots==1, parent-timeout hard-failure, child-exhaustion retriable, transport request counting (launcher.test.ts).
4. Mutants: custody/numeric/apply-mutants.sh emits machine-generated mutant-rerun.json with per-patch sha256 + checker/runner/reference hashes; run it (it restores state itself) and confirm "killed 12 / 12", exit 0; confirm hand scoreboard superseded.
5. Numeric audit: 13 fee-case identities incl. explicit H4/H15 aliases; check that pilot checks 10 and 12 compare identity sets and recompute the pass predicate from listed decimals rather than trusting _all_pass.
6. Pilot §17: byte-identical comparison of the four §7 authority surfaces against the protocol (run run-pilot.ts check 17 semantics yourself by comparing file bytes to the §7 blocks).
7. Deterministic envelopes: 3.0 chars/token frozen constant, exact byte counts, measured wall-clock flow, output-cost assumption disclosed.
8. §28.1 hashes: artifact-hashes.sha256 covers the listed artifacts; spot-verify ≥5 hashes by recomputing sha256sum; confirm PENDING-FREEZE labeling and the reason.

## Output format (markdown)
- Per checklist item: verdict + exact evidence (commands run, outputs, hashes).
- Findings section: any BLOCKING finding (protocol violation or false claim) with severity and exact file/line evidence; then ADVISORY findings.
- Final verdict: FIT FOR SOL RE-ADJUDICATION or NOT FIT (with the minimal blocking set).
