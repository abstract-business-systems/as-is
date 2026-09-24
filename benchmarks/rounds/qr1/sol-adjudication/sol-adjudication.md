## 1. Findings ledger

**Verification basis.** I directly read the protocol, review, worklog, post-remediation report and evidence, and the staged fixture/custody/harness/pilot sources. I verified the implemented logic by source inspection, including the acceptance test, hidden checker, mutant patches/runner, manifest generator/consumer, classifiers, recorder, schedule test, and pilot predicates. I did **not** execute Bun tests, apply mutants, recompute hashes, or observe network/process accounting; therefore the reported baseline/reference passes, 12/12 runtime kill result, 65/65 execution result, unchanged source repository, and zero provider requests remain reported claims rather than independently executed facts.

| # | Grok finding | Adjudication | Remediation adjudication | Residual directive |
|---:|---|---|---|---|
| 1 | Public and hidden monetary checks violated §14.4, while the pilot falsely certified compliance. | **ACCEPT.** Sections 6.6 and 14.4 prohibit exact binary equality for monetary results and require cent alignment through the frozen `roundMoney` contract. The former public assertions and hidden `Math.round` implementation violated that contract. | **CORRECT.** `fixture/acceptance/cold-handling.public.test.ts` now applies the specified tolerance to every monetary assertion. `custody/checker/hidden-checker.test.ts` routes monetary checks through `expectMoney`, uses the exact tolerance formula, and computes cent alignment through a faithful snap-then-round replica. Remaining exact comparisons concern structure, types, ordering, or rendered strings, not floating-point monetary equality. | Repilot under Directive 7; no further fixture/checker correction is required for this finding. |
| 2 | The original 65/65 report contained hardcoded or non-probative checks. | **ACCEPT.** Section 27.2 says the pilot must *verify* each item; labels, source-string presence, copied result files, and unconditional booleans are not verification. Under §27.3, an unperformed or incomplete required check cannot be reported as PASS. | **INSUFFICIENT.** Check 6 is now genuinely invoked and several predicates improved, but important false passes remain. Checks 18 and 21–22 expressly admit that launch-time loading, mount protection, and live write routing are unbuilt. Checks 31–33 do not exercise the required semantic cases: the recorder filters ungrounded prose out instead of passing it to assessors, contrary to §15.3; the “baseline present” case has no grounded baseline; and the check-33 case has no pre-mutation plan. Checks 40, 42, 43, 48, 55 and 58 mostly test constants or isolated helpers rather than enforcement. Check 63 relies on capacity/cost proxies while the route is unresolved and output capacity is `null`. Check 65 is source inspection, not proof of zero requests from all spawned processes. | Directives 1, 3, 4 and 7. The present `pilot-report.md` is not a controlling passing pilot. |
| 3 | Mutant kills were not reproducible from the original staged tree. | **PARTIAL.** The protocol does not specifically prescribe retained patch files or a particular mutant runner. Sections 6.7, 27.2.6 and 27.3 do, however, require deliberately defective mutants, actual pilot rejection, deterministic steps, and supporting evidence. The former hand scoreboard alone did not substantiate that verification. | **CORRECT.** Twelve concrete patches now exist, each targets the reference implementation, and `numeric/apply-mutants.sh` freshly clones the reference, applies every patch, runs the sealed checker, and reports the kill total. That is an appropriate reproducible implementation of check 6. I verified the artifacts and invocation path by reading, but did not execute the claimed 12/12 rerun. | Directive 5 for evidence hygiene and machine-generated rerun custody. |
| 4 | The routing manifest was incomplete, unresolved, and nevertheless passed check 56. | **ACCEPT.** Section 26 requires both a SHA-256 hash and an immutable resolved provider/model identifier or revision. An unresolved alias is not a complete frozen manifest, and §26 expressly blocks scoring if immutable resolution cannot be frozen. | **INSUFFICIENT.** Adding `manifest_sha256` and a refusing consumer was directionally sound, but it does not satisfy §26. The manifest still declares `UNRESOLVABLE-CLIENT-SIDE`; `arm-launch-args.json` still selects the mutable alias; and no executable launcher consumes the manifest. Check 56 incorrectly treats presence of an unresolved string as completeness. Check 58 proves only that a library refuses the current manifest. In addition, the hash algorithm uses `JSON.stringify(value, Object.keys(value).sort())`; that replacer omits nested keys, so changes inside pricing, provenance, or request-parameter objects are not covered by the hash. `max_output_tokens: null` also cannot support check 62’s output-capacity PASS. | Directives 2, 3 and 7. Gate H2 cannot waive §26 while retaining draft.3 unchanged. |
| 5 | The classifier rejected legitimate current-arm mount reads and relative in-workspace paths. | **ACCEPT.** Section 23.6 explicitly allows authorized read-only mounts and ordinary in-workspace searches such as `find .`; the old classifier contradicted §§9.3 and 23.6. | **CORRECT at the classifier-unit level.** `allowedReadOnlyMounts` now authorizes the current guidance mount, and relative paths including `.`, `./src`, and ordinary workspace paths normalize inside the workspace. Tests cover both the reported failures and traversal outside the allowed roots. Authority write classification also preserves writable `as-is.md`. This does not prove runtime enforcement because no launcher currently invokes these classifiers. | Directive 3: integrate the corrected classifier with canonical host-resolved paths, actual working directories, symlink containment, and stage-stop enforcement. |

## 2. Directives list

1. **Correct the temporal evidence boundary and semantic pilot cases.**
   - In `harness/recorder/recorder.ts`, make the event type internally valid—`referencedArtifacts` is currently used but absent from `RecordedEvent`—and ensure the project type-checks.
   - Do not discard pre-mutation arm-authored prose merely because it lacks artifact references. Under §15.3, the recorder decides chronology; assessors decide grounding and semantic adequacy.
   - Capture all §15.1 textual channels, including host-exposed assistant transcript evidence, and represent actual pre-operation snapshots/hashes rather than inferring a snapshot as `seq - 1`.
   - In `harness/recorder/recorder.test.ts` and assessor fixtures, add distinct, testable cases for:
     1. grounded baseline present but plan absent;
     2. grounded plan present but C1/C4/C6 component-change evidence absent;
     3. task paraphrase present in the packet but rated 0 for missing grounding;
     4. simultaneous evidence/source mutation;
     5. complete qualifying evidence that passes.
   - Checks 31–33 must depend on the corresponding semantic rating and temporal result, not packet length alone.

2. **Produce a semantically valid, fully integrity-covered routing manifest.**
   - In `harness/manifest/routing-manifest.abs-medium.json`, replace the unresolved value with an immutable provider/model identifier or revision and declare positive input/context/output limits plus all applicable pricing. If reasoning pricing is inapplicable, encode that explicitly rather than omitting it.
   - In `generate-manifest.ts` and `load-manifest.ts`, use deterministic **recursive** canonicalization covering every nested object and array, excluding only `manifest_sha256`.
   - Extend `manifest.test.ts` to mutate nested pricing, provenance, request parameters, route ordering, limits, fallback treatment, and the immutable identifier; every mutation without re-freezing must fail integrity validation.
   - A correctly frozen manifest must return `ok: true`; unresolved, fallback-enabled, incomplete, missing-hash, and tampered manifests must return `ok: false`.
   - If an immutable identity cannot be obtained, check 56 must be FAIL and the artifact set remains blocked. Merely documenting or human-accepting the opaque alias does not satisfy draft.3 §26.

3. **Build and provider-free-test the executable launcher and enforcement path.**
   - Add an executable under `harness/launcher/` that consumes `load-manifest.ts`, launches only the immutable manifest route, loads the exact `AGENTS.md` equally for all arms, applies the frozen wrappers, creates fresh workspaces, mounts current guidance read-only only for Current, and enforces network, protected-write, budget, child, retry, timeout, recorder, hidden-probe, and stage-stop rules.
   - It must invoke the path classifiers on host-canonicalized paths using the operation’s actual working directory and reject symlink or traversal escape.
   - Use a local fake transport in provider-free integration tests. Demonstrate protected writes are blocked, `as-is.md` and justified fixture evidence are writable, allowed current-mount reads succeed, outside probes stop the stage, parent timeout cancels children, child-only exhaustion is retryable, and exactly one replacement slot exists.
   - `arm-launch-args.json` must no longer cause runtime resolution of `@preset/abs-medium`; the preset remains provenance/selection metadata while the launcher sends the immutable resolved manifest entry.
   - Check 58 may pass only when this executable path demonstrably consumes the manifest and cannot fall back or re-resolve an alias.

4. **Freeze the complete current-composition surface inside the staged artifacts.**
   - Add a custody-safe staged tree and manifest for the exact OD-2 revision: current role, every loaded skill, project/root guidance, resolver, wrapper, launcher inputs, and admission configuration.
   - Replace references such as `"frozen manifest (§9.3 list)"` and mutable `/home/vc/dev/as-is/...` reads with exact staged paths and full SHA-256 values.
   - Provider-free tests for checks 21, 22 and 26 must inspect the entire loaded surface and prove that every required record write resolves into the writable fixture, never the read-only current mount.
   - No unlisted ambient source may be loadable.

5. **Make mutant rerun evidence unambiguous.**
   - Update `custody/numeric/apply-mutants.sh` to emit `mutant-rerun.json` directly from that invocation and exit nonzero if a patch fails to apply, a mutant survives, or the expected mutant set differs.
   - Remove `mutant-results.json` from controlling evidence or relabel it explicitly as a superseded hand-reconstructed historical scoreboard.
   - The new pilot must retain the runner’s machine-generated per-mutant output and hash the patches, runner, checker, reference base, and result.

6. **Complete the numeric-boundary inventory by identity, not count.**
   - In `custody/numeric/numeric-audit.json`, add explicit coverage or explicit alias records for chilled hidden cases H4 and H15, which currently reuse other inputs but are not listed.
   - Change pilot check 10 from `caseNames.length >= 11` to an exact set comparison against every chilled public/hidden checker case. Check 12 must recompute the exclusion predicate from the listed decimal values rather than trust `_all_pass`.

7. **Replace the current pilot with a complete provider-free rerun after all material changes.**
   - In `pilot/run-pilot.ts`, make every §27.2 result depend on the relevant artifact or integration test. In particular, correct checks 17–18, 21–22, 31–33, 40, 42–43, 48, 55–56, 58, and 60–65.
   - Check 17 must perform exact-byte comparisons, not paragraph-substring matching.
   - Checks 60–63 must include deterministic current/isolated context measurement, separate parent/initial-child/retry/output envelopes, complete hierarchy cost arithmetic, declared output capacity, reference-sized scripted flow, and wall-clock plausibility. A character-count heuristic plus arbitrary token allowance is not sufficient by itself.
   - Run the pilot under network-denied conditions with a harness/provider-transport request counter. Check 65 must be supported by that counter and containment log, not only a banned-substring scan.
   - The regenerated report must contain every §27.3 item, including deterministic commands/steps, complete numeric inventory, residual risks, full token/cost/time measurements, route contents and hash, and truthful failures. No scored or provider-backed run is authorized.

8. **Complete parity and final-freeze artifacts.**
   - Add the required byte-level unified-diff artifact proving Candidate C equals Candidate B plus one newline and the exact additive block; none is present in the staged tree.
   - After a genuinely passing rerun, produce full, non-truncated SHA-256 values for every §28.1 artifact, including custody files, current surfaces, wrappers, executable launcher, recorder, classifiers, budget configuration, manifest, schedule, packet generator, additive diff, and final protocol.
   - Any correction above is material under §28.2 and therefore precedes the new pilot and final hash freeze.

## 3. Verdict

**NOT FIT** — the artifact set is not fit for final preregistration or hash freeze. Before my Gate H2 recommendation it must: satisfy the immutable-route requirement; build and integrate the executable launcher/enforcement/recorder path; freeze the complete current-composition surface; correct temporal semantic testing and manifest hashing; complete numeric and mutant custody evidence; rerun all 65 checks provider-free without proxies or admitted deferrals; and then produce the complete §28.1 hash manifest.

## 4. Notes for Gate H2

1. **The unresolved route is not a discretionary caveat under draft.3.** Gate H2 may approve an immutable resolved route, or the human may authorize a new protocol version with a different model/routing treatment. It may not simply accept `UNRESOLVABLE-CLIENT-SIDE` as satisfying §26.
2. The human must explicitly resolve OD-1, OD-2, OD-3, OD-4, OD-6 and OD-7. In particular: approve the fixture; select and freeze the current revision; decide the Bun/lockfile treatment; approve delegation limits; confirm assessor roster/conflicts; and freeze the measured budget hierarchy.
3. The TypeScript dev dependency used solely to force a Bun lockfile is a disclosed runtime/fixture deviation. Gate H2 must expressly approve it or require a dependency-free alternative followed by repilot and rehash.
4. The weaker-model floor-effect safeguard remains a human judgment after a valid bounded assessment. The present capacity-and-cost proxy is not sufficient because the model identity and output limit are not frozen.
5. The premature remediation was a process deviation, but no scored execution occurred. Record this adjudication and the superseded pilot; do not treat the deviation itself as scored evidence or conceal the earlier invalid 65/65 claim.
