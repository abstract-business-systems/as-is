# Round 9 freeze adjudication

## 1. Verification

### Staged-tree checksum

Executed read-only against the authoritative staged tree:

```sh
cd /tmp/ccq-stage
sha256sum -c pilot/artifact-hashes.sha256
```

Result:

- **Exit status: 0**
- **467/467 entries: OK**
- **0 failures**
- `WORKLOG.md` actual and recorded SHA-256 both equal:

```text
8ba1fcd3933f4e766614c82fcfbf8f47567221d7b4a4f3c59c789f4446d4628d
```

The freeze-manifest artifact itself has SHA-256:

```text
1fb34cb7d0aee8541a444208c86ad84231775405282603659a048734af0ac461
```

### Round-8 items 1–3

Per `/tmp/sol-round8/sol-round8-clean.md`, these remain **VERIFIED-RUN**:

1. Each process receives only its own socket directory; other allocation socket paths are absent.
2. The USD 0.75 parent cap is separate from the USD 1.20 arm cap.
3. Adapter allocation mapping is distinct: `child-1`, `child-2`, then `retry`, followed by refusal.

Nothing in this bounded round reopens or contradicts those determinations.

### Freeze ordering

The freeze-candidate sequence satisfies the required ordering:

```text
2026-09-08 10:48:55.886... WORKLOG.md
2026-09-08 10:49:01.870... pilot/runtime-manifest.json
2026-09-08 10:49:01.874... pilot/pilot-evidence.json
2026-09-08 10:49:01.874... pilot/pilot-report.md
2026-09-08 10:49:01.886... pilot/artifact-hashes.sha256
```

Additionally:

- No staged file was newer than `pilot/artifact-hashes.sha256`.
- `run-pilot.ts` writes the runtime manifest, report, and evidence before writing the hash manifest.
- The finalized WORKLOG is included correctly in that manifest.
- I did not rerun the mutating pilot against `/tmp/ccq-stage`.

## 2. FINAL VERDICT: **FIT FOR HASH FREEZE**

The current `/tmp/ccq-stage` tree is **authorized and declared frozen** under:

```text
pilot/artifact-hashes.sha256
SHA-256 1fb34cb7d0aee8541a444208c86ad84231775405282603659a048734af0ac461
```

No additional WORKLOG entry is required or permitted in the frozen tree. This verdict and its Gate H2 package are the authoritative post-manifest record. **Any subsequent change to any frozen staged artifact voids this freeze and invokes §28.3.**

This verdict authorizes the hash freeze only. It does **not** itself authorize provider use, spending, or scored execution.

## Exact Gate H2 package

The human package shall contain:

1. **Controlling protocol**
   - `/tmp/sol-draft3/draft3-clean.md`  
     SHA-256 `2f8a0a111abd0637a41bb9a74bc79316135e24ea9b0d1ff38b0cc483fdbe6e3e`
   - `/tmp/sol-draft3/draft3.1-amendment.md`  
     SHA-256 `7edaf6809a19749a1667979ff246ce912788e0c140e304e6de554eac24d49743`

2. **Final authority records**
   - This Round-9 FIT adjudication.
   - `/tmp/sol-round8/sol-round8-clean.md`.
   - The explicit notice that post-freeze staged changes void the freeze.

3. **Frozen artifact custody**
   - A byte-preserving, read-only delivery of `/tmp/ccq-stage`.
   - `pilot/artifact-hashes.sha256`, with its external SHA-256 above.
   - The successful 467/467 checksum-verification transcript.
   - `WORKLOG.md`.

4. **Pilot evidence**
   - `pilot/pilot-report.md`.
   - `pilot/pilot-evidence.json`.
   - `pilot/runtime-manifest.json`.
   - Confirmation: 65/65 pilot checks, 12/12 mutants killed, zero real provider requests, USD 0.00 provider cost, and no scored execution.

5. **Fixture and custody material**
   - The complete `fixture/` tree and public-test hashes.
   - `custody/checker/hidden-checker.test.ts`.
   - `custody/reference-analysis.md`.
   - `custody/ref-scratch/reference.patch`.
   - `custody/numeric/numeric-audit.json`.
   - `custody/numeric/mutant-rerun.json`.
   - Their authoritative hashes are the corresponding full entries in `pilot/artifact-hashes.sha256`.

6. **Arm-difference and Current-surface material**
   - `harness/instructions/candidate-b.md`.
   - `harness/instructions/candidate-c.md`.
   - `harness/instructions/candidate-c-additive.diff`.
   - `surface/current-c511642/surface-manifest.json` and the complete staged `surface/current-c511642/` tree.
   - Confirmation that the pilot independently recomputed all 367 Current-surface hashes.

7. **Scored-path harness**
   - Parent and child wrappers.
   - `harness/launcher/launch-arm.ts` and `arm-launch-args.json`.
   - `harness/adapters/pi-subagent-adapter.ts` and `scored-invocation.md`.
   - Recorder, classifiers, budget implementation, assessor rubric/combination logic, packet generator, schedule implementation, and routing-manifest loader/generator.
   - All corresponding tests and hashes from the frozen manifest.

8. **Resolved decisions and disclosures**
   - OD-1 through OD-8 as recorded in the amendment and WORKLOG.
   - Exact route: OpenRouter `@preset/abs-medium`, reasoning `high`, Pi `0.84.4`.
   - Routing-manifest internal pin:  
     `7bc50b6bbf69d79c1413ea41e315ab6206e89ac7327b0a2ef7a9d74e42682ec2`
   - Explicit opaque-upstream, undeclared-output-limit, server-side routing, and floor-effect residual-risk disclosures.
   - Approved Bun `1.3.14` and never-imported `typescript@5.9.3` lockfile deviation.
   - Delegation limits: two initial, two concurrent, depth one, one retry.
   - Two planned matched triplets plus one complete-triplet replacement slot.
   - Budget ceilings: USD 0.75 parent, USD 0.15 per initial child, USD 0.15 retry, USD 1.20 per arm, and USD 10.80 maximum stage.
   - Assessor roster:
     - `anthropic/claude-fable-5.1`
     - `moonshotai/kimi-k3`
     - zero-trigger reserve: `x-ai/grok-4.6`
   - Explicit disclosure of Grok’s prior reviewer role and resulting dual-role limitation.

9. **Randomization commitment**
   - Before scored execution, generate the protocol-required 256-bit OS-random seed.
   - Put only its domain-separated SHA-256 commitment in the Gate H2 package.
   - Keep the seed under custody until it is revealed with the result package.
   - Do not alter the frozen stage to record it.

10. **Human authorization sheet**
    The human must explicitly:
    - approve the final protocol and amendment;
    - approve the frozen artifact set identified by manifest SHA-256 `1fb34c…`;
    - confirm the listed decisions, assessor conflict, and residual-risk disclosures;
    - authorize provider use and spending up to the USD 10.80 stage ceiling; and
    - separately authorize scored execution.

Until that explicit Gate H2 authorization is given, scored provider execution remains prohibited.
