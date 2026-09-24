# Round-2 verification (c-dfdc-1.0.0-draft.3)

Read-only on `/tmp/ccq-stage`. Executable predicates were run from `/tmp/grok-round2-scratch` copies (or against stage files with `sha256sum` / `cmp`-equivalent reads). Stage canaries unchanged after the audit:

- manifest `59806262e406beddc5dc5ab9ca4c06d739a9b7d00855ca531dada6cb484721e7`
- `mutant-rerun.json` `9789c14c60862d7f8499a6cd6ceab0d6561b0eff26f409f306c1bd9455f7a122`

Known-accepted state checked, not flagged: checks **56/62/63** are `pass: false` with §26/output-limit/floor-effect notes; OD-2 surface is `revision: c511642` (367 files).

---

## 1. Recorder — **VERIFIED-RUN**

**Commands**

```
cp -a /tmp/ccq-stage/harness /tmp/grok-round2-scratch/harness
cd /tmp/grok-round2-scratch/harness && bun test recorder/recorder.test.ts
```

**Observed**

```
11 pass
0 fail
22 expect() calls
Ran 11 tests across 1 file. [14.00ms]
RECORDER_EXIT=0
```

Named cases that actually ran (all `(pass)`):

- check 31 `grounded baseline present but plan absent FAILS as no-plan`
- check 32 paraphrase stays in packet (`preMutationEvidence` length 4) and fails as `paraphrase-grounding-zero` at rating 0
- check 33 `no-component-change-evidence`
- simultaneous plan/source → `evaluateTemporalCase` false
- complete qualifying evidence `{ ok: true }`
- mutation without `beforeHash` → `snapshotVerified: false`
- transcript-channel prose included as §15.1 evidence

**Source (not a substitute for the run):** `RecordedEvent` declares `referencedArtifacts`, `beforeHash`, `channel`, `semanticKind` (`harness/recorder/recorder.ts` 10–31). `preMutationEvidence` does not drop ungrounded prose (58–65). Chronology uses the mutation event’s own `beforeHash`, not `seq - 1` (43–46). `evaluateTemporalCase` returns named verdicts (66–87). Matches §15.3: recorder chronology only; assessors rate grounding.

---

## 2. Manifest — **VERIFIED-RUN**

**Commands**

```
cd /tmp/grok-round2-scratch/harness && bun test manifest/manifest.test.ts
# plus independent bun -e loadManifest variants in scratch
```

**Observed — unit tests**

```
5 pass
0 fail
25 expect() calls
MANIFEST_EXIT=0
```

Includes recursive canonicalization, every nested mutation without re-freeze → `hash mismatch`, missing hash rejected, frozen file refuses scored launch, resolved+declared loads `ok: true`.

**Independent load-manifest cases (scratch):**

| Variant | Result |
|---|---|
| staged frozen file | `ok: false` — `output limit not positively declared` |
| resolved id, output undeclared | `ok: false` — output limit |
| unresolved, output declared | `ok: false` — `upstream model identity is not client-frozen` |
| fully frozen | `OK` |
| nested `pricing.input` re-frozen | `OK` |
| stale nested `cache_read` tamper | `manifest hash mismatch` |
| `canonicalize` nested key order / nested `secret` | `true` / covered |

Frozen hash recomputed via `canonicalize`: claimed = actual  
`870fe5883a636fc8f643b99a0d341d27ec422826905d16aa5f3a966ecccf58ab`.

Output limit is explicit: `output_limit_tokens: null`, `output_limit_declared: false`. Reasoning pricing is encoded, not omitted.

---

## 3. Launcher — **VERIFIED-RUN**

**Command**

```
cd /tmp/grok-round2-scratch/harness && bun test launcher/launcher.test.ts
```

**Observed**

```
8 pass
0 fail
23 expect() calls
Ran 8 tests across 1 file. [82.00ms]
LAUNCHER_EXIT=0
```

Executed demonstrations:

- unresolved manifest refuses launch (`§26 blocking condition`)
- `replacementSlots !== 1` refused
- `as-is.md` + evidence writable; `AGENTS.md` write denied + `protected-authority-mutation` stage-stop
- authorized mount read allowed; outside probe stage-stops
- symlink escape rejected (`realpath` canonicalization)
- parent timeout → `timedOut` + `hardFailure` + `parent-timeout`
- child failure is not run-level hard failure; later write allowed
- FakeTransport counts requests; request carries `manifestModel: fake/test-frozen-model@rev-1`

`launch-arm.ts` consumes `loadManifest`, canonicalizes with `realpathSync`, and only sends `manifest.resolved_model_identifier` (never re-resolves `@preset/abs-medium` at launch time).

---

## 4. Mutants — **VERIFIED-RUN**

Ran a byte-identical copy so the stage file was not rewritten:

```
cp -a /tmp/ccq-stage/custody /tmp/grok-round2-scratch/custody
bash /tmp/grok-round2-scratch/custody/numeric/apply-mutants.sh /tmp/grok-round2-scratch/mutant-work
```

**Observed (exit 0)**

```
M10-ambient-only-charged                   applied=true failing_cases=15 rejected=true
M11-fee-omitted-from-total                 applied=true failing_cases=11 rejected=true
M1-duplicate-lines-as-distinct-skus        applied=true failing_cases=1 rejected=true
M2-line-records-as-units                   applied=true failing_cases=9 rejected=true
M3-ambient-charged                         applied=true failing_cases=6 rejected=true
M4-discount-applied-to-fee                 applied=true failing_cases=6 rejected=true
M5-post-discount-basis                     applied=true failing_cases=5 rejected=true
M6-total-merch-subtotal-rate               applied=true failing_cases=3 rejected=true
M7-truncate-not-round                      applied=true failing_cases=1 rejected=true
M8b-cap-misapplied                         applied=true failing_cases=1 rejected=true
M8-cap-omitted                             applied=true failing_cases=1 rejected=true
M9-fee-only-in-presentation                applied=true failing_cases=12 rejected=true
killed 12 / 12
MUTANT_EXIT=0
```

Copy vs staged `mutant-rerun.json`: same 12/12, same failing_counts, same per-patch sha256, same `runner_sha256` / `checker_sha256` / `reference_head=a23e239c0ef5c7a0be51ec8662a507de975341f6`.

Runner/checker hashes recomputed and matched. All 12 `patch_sha256` values matched the files under `custody/numeric/mutants/`.

Hand scoreboard: `mutant-results.json` **absent**. Controlling path is `mutant-rerun.json`. Relabeled file `_superseded`: *“Not controlling evidence.”*

---

## 5. Numeric audit — **VERIFIED-RUN**

**Identity set (13, including H4/H15 aliases):** exact match vs  
`public-acceptance, H2, H3, H4, H5, H6, H7, H8, H9, H10, H13, H15, H19`.

- H4 `alias_of` public-acceptance (berries×4 + rice×1) — matches `cold-handling.public.test.ts` and hidden H4.
- H15 `alias_of` H7 (yogurt×10 + berries×1) — matches hidden H15/H7.

Pilot predicates (`run-pilot.ts` 89–95):

- check 10: sorted set equality, not `length >= 11`
- check 12: `dist_to_nearest_half_cent_usd > 0.0005` over cases; does **not** read `_all_pass`

Independent recompute from `raw_fee_usd` (distance of `raw*100` to `*.5` cents): every listed distance matched; min = **0.001** (H10); all > 0.0005.

---

## 6. Pilot §17 byte identity — **VERIFIED-RUN**

Pilot regex and an independent “first ` ```markdown ` fence after each `### 7.N` heading” extract both compared to fixture files.

| File | Result | SHA-256 prefix |
|---|---|---|
| `AGENTS.md` | byte-identical | `39cfdd1171b2c1d2` |
| `benchmark-authority.md` | byte-identical | `fbd8f029e40f6b19` |
| `as-is.md` | byte-identical | `0a6fc8e1dfab8259` |
| `task.md` | byte-identical | `978b6783f4497c09` |

`OK17 True`. Also: `candidate-c.md == candidate-b.md + "\n" + candidate-c-block.md`. `patch` of `candidate-c-additive.diff` onto B produced C (`patched B == C True`, 1612 bytes).

---

## 7. Deterministic envelopes — **VERIFIED-RUN**

Independent recount of the same loaded-doc set the pilot uses:

- frozen constant `CHARS_PER_TOKEN = 3.0` (`run-pilot.ts:265`)
- isolated **3596 bytes → 1199 tok** (report 3596/1199)
- current **362908 bytes / 114 docs → 120970 tok** (report 362908/120970)
- output-cost assumption disclosed: `OUTPUT_CAP_ASSUMED = 64000` → `$0.0768` at `$1.2/MTok`
- isoCost ≈ `$0.077`, curCost ≈ `$0.101` (report `$0.077` / `$0.101`)
- wall-clock remeasure in scratch: **0.210 s** vs reported 0.1 s vs 1020 s cap (plausible)

---

## 8. §28.1 hashes — **VERIFIED-RUN**

Header: `# §28.1 artifact hashes — PENDING-FREEZE pending §26 route resolution (Gate H2)`  
**25 listed / 25 MATCH / 0 missing / 0 mismatch.**

`sha256sum` spot-check (8 files, all match the manifest):

```
fb661a8620a3c62bae1c143d989c9c225e447cf35b5c939d34da4756809c28b3  custody/checker/hidden-checker.test.ts
3fc07c99897b064cbaab295b1d1fe54f2a692b1664737fb47546752fcbd2850a  custody/numeric/apply-mutants.sh
9789c14c60862d7f8499a6cd6ceab0d6561b0eff26f409f306c1bd9455f7a122  custody/numeric/mutant-rerun.json
59806262e406beddc5dc5ab9ca4c06d739a9b7d00855ca531dada6cb484721e7  harness/manifest/routing-manifest.abs-medium.json
acc8459d667c1ae2f055e5de4ca9b57113275afd616eab20e4cdb5a2edef6991  harness/launcher/launch-arm.ts
b2fbed68161fcd2c5eaa3c1c467f148220977e86bc4bb8b7a9ce13f783116533  harness/recorder/recorder.ts
a7c640917caa8542737a9e49c307f7ad472862bfad8b504a1fb4a56f1c5f7439  pilot/run-pilot.ts
0c562a65bd1df66137a8e795ebd1db5612f0cbcce1fc3c9687732cfa365298db  surface/current-c511642/surface-manifest.json
```

PENDING-FREEZE reason is the unresolved §26 route (checks 56/62/63), which is the accepted residual.

---

## Findings

### BLOCKING

None. No protocol violation or false PASS was reproduced for the eight directives at the checklist bar. Checks 56/62/63 are truthful FAILs (`pilot-evidence.json` `pass: false`).

### ADVISORY

1. **`arm-launch-args.json` leftovers** (lines 4, 13): `"model": "@preset/abs-medium"` and `"skills_current": "frozen manifest (§9.3 list)"`. Launcher does not consume this file, so it does not cause runtime alias resolution, but Directive 4’s exact string was not replaced with staged paths/hashes.

2. **Dead 3.5 / ambient reads still execute** in `run-pilot.ts` 246–258 (`enc` at 3.5 chars/token; `readdirSync("/home/vc/dev/as-is/skills")`; `statSync` on `/home/vc/dev/as-is/agents/...`). Pass/fail for 60–61 uses the 3.0 staged-surface path. Hygiene risk if the ambient tree is absent.

3. **Check 65** (`run-pilot.ts` 293–295) is still a banned-substring scan of the pilot source **plus** `testsPassed(launcherRun)`. The FakeTransport counter is demonstrated (and the last launcher test counts **1** fake request). The note “counter across launcher integration suite = 0 real provider requests” is wording, not a session-level counter of 0. No network-namespace deny was observed.

4. **Launcher does not import the recorder** (Sol directive 3’s longer “recorder” bullet). Checklist item 3’s listed predicates all ran.

5. **Child-exhaustion test** throws once (`childrenUsed=1`, `initial=2`) so the retry-after-cap branch is unexercised. Failure-is-not-hard-failure is shown.

6. **Check 12** still ANDs `audit[k].pass` with listed distance; it does not derive distance from `raw_fee_usd`. Independent derivation matched the listed decimals.

7. **Stale custody path** in the report template (`run-pilot.ts:333`): `mutant-results.json` no longer exists.

8. **Hash-list gaps vs Directive 8’s “including” list:** protocol draft not hashed; current surface covered via `surface-manifest.json` (367 file hashes inside) rather than 367 extra lines. Acceptable under PENDING-FREEZE.

9. **Pre-existing junk in stage** `harness/manifest/*.resolved-test`, `*.tampered`, `*.variant-*` from earlier test runs. Not produced by this audit.

10. **H16** (yogurt×10, typeof-discount) is a chilled input not listed as an alias of H6. Directive 6 named H4/H15 only.

---

## Final verdict

**FIT FOR SOL RE-ADJUDICATION**

All eight checklist items were executed, not merely read. Residual items are advisory incomplete-cleanup / test-gap issues, not false certification. The accepted §26/floor-effect FAILs (56/62/63) remain truthful and well-grounded.
