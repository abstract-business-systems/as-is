[openrouter-session] Ready, base session ID: ephemeral-1788834373329-q3crdeni9hi
[openrouter-session] Using session_id: sol-amendment-ephemera
# 1. AMENDMENT `c-dfdc-1.0.0-draft.3.1`

## §1.1 Amendment identity, scope, and precedence — added

This amendment is identified as **`c-dfdc-1.0.0-draft.3.1`** and amends only protocol `c-dfdc-1.0.0-draft.3`.

Its scope is limited to the preregistered `cold-cart-quote` benchmark. It:

1. records the human’s resolutions of OD-1 through OD-7;
2. establishes the bounded opaque-preset exception in §26;
3. records the assessor roster and disclosed dual role;
4. freezes the budget hierarchy;
5. specifies amended pilot semantics for checks 56, 62, and 63; and
6. defines the final hash-freeze trigger.

All other text and requirements of `c-dfdc-1.0.0-draft.3` remain unchanged. Where this amendment conflicts with draft.3, this amendment controls.

This amendment records preregistration decisions but does **not** itself authorize scored execution. Scored provider use remains prohibited until:

- an amendment-aligned provider-free pilot passes;
- the final hashes are frozen;
- Gate H2 presents the items required by §3.2 and this amendment; and
- the human gives a separate final scored-execution and spending authorization.

---

## §6.1 Fixture identity — replacement of the OD-1 open-decision block

**RESOLVED DECISION OD-1:** the human approves the `cold-cart-quote` fixture as built, including its formula, catalog, snap-then-round contract, fee-case exclusion band, public example, hidden cases, placement fork, and acceptable design families.

The staged fixture remains subject to the final §28 hash freeze. Any later semantic change to the approved fixture is material under §28.2.

---

## §9.3 Current versus isolated surfaces — replacement of the OD-2 open-decision block

**RESOLVED DECISION OD-2:** the Current arm uses revision **`c511642`**, staged at:

```text
surface/current-c511642
```

The staged surface and its complete internal file manifest constitute the only approved Current-arm source. No ambient `/home/vc/dev/as-is` content may be loaded during scored execution.

The Current arm must complete all required record writes inside the writable fixture. The staged Current surface, admission configuration, resolver inputs, wrappers, launcher inputs, and surface manifest are included in the final hash freeze.

---

## §14.5 Runtime freeze — added; replaces the OD-3 open-decision block following §14.4

**RESOLVED DECISION OD-3:** the runtime is Bun **`1.3.14`** with the frozen `bun.lock`.

The fixture’s sole development dependency is:

```json
{
  "typescript": "5.9.3"
}
```

That dependency exists only to retain a Bun lockfile and must never be imported by fixture runtime or scored implementation code. The human expressly approves this disclosed fixture/runtime deviation.

Bun, `package.json`, and `bun.lock` are part of the final hash freeze.

---

## §18.2 Frozen limits — replacement

| Limit | Frozen value |
| --- | ---: |
| Initial children | Maximum 2 per arm |
| Concurrent children | Maximum 2 per arm |
| Delegation depth | 1 |
| Child delegation | Prohibited |
| Retry slots | Maximum 1 child-attempt retry per arm |
| Retry target | One failed, rejected, incomplete, timed-out, or exhausted prior assignment |
| New task through retry | Prohibited |

Every task-relevant subagent or external child counts. `call_subagent` and any external child launcher are one accounted delegation mechanism.

Child-level budget or time exhaustion terminates that child attempt and may consume the one retry slot. It does not by itself set run-level `hard_failure`. Parent/session timeout or total arm-cap exhaustion does set `hard_failure`.

**RESOLVED DECISION OD-4:** the human approves these limits.

---

## §21.1 Repetition count — replacement

**RESOLVED DECISION OD-5:** the stage contains:

- two planned complete matched triplets; and
- one preregistered complete-triplet replacement slot.

The replacement is not a third planned observation. It may be used only under the existing replacement rules and may not be expanded.

All existing descriptive-only and no-across-triplet-aggregation rules remain unchanged.

---

## §22.3 Assessor roster and disclosure — added; replaces the OD-6 open-decision block

**RESOLVED DECISION OD-6:** the frozen assessor roster is:

| Role | Model |
| --- | --- |
| Primary assessor 1 | `anthropic/claude-fable-5.1` |
| Primary assessor 2 | `moonshotai/kimi-k3` |
| Reserve/zero-trigger third assessor | `x-ai/grok-4.6` |

The two primaries are from different model families and neither performed the artifact review.

`x-ai/grok-4.6` previously performed read-only artifact review and round-2 verification for this benchmark. Its later use as the reserve third assessor is therefore a **dual role** and a potential blinding/conflict limitation. The human was informed of and accepted this dual role.

The third assessor:

- does not author arm outputs;
- receives the same arm-neutral packet format;
- scores independently before discussion; and
- is invoked only under the existing §22.2 adjudication triggers, including every applicable zero trigger.

The final report must disclose every invocation of the third assessor and repeat the dual-role limitation. No additional weight is assigned to its score because of its reviewer role.

---

## §25.1 Frozen cost and wall-clock limits — replacement

**RESOLVED DECISION OD-7:** the following limits are frozen:

| Scope | Cost cap | Wall-clock cap |
| --- | ---: | ---: |
| Parent model spend | USD 0.75 | Within 900-second parent session |
| Each initial child | USD 0.15 | 300 seconds |
| Maximum two initial children | USD 0.30 total | Inside parent session |
| One child retry | USD 0.15 | 300 seconds |
| Total provider spend per arm | USD 1.20 | 900-second model-session envelope |
| Harness allowance per arm | No provider spend | 120 seconds |
| Total arm envelope | USD 1.20 | 1,020 seconds |
| One triplet | USD 3.60 | 3,060 seconds |
| Two planned triplets | USD 7.20 | 6,120 seconds |
| One replacement triplet | USD 3.60 | 3,060 seconds |
| Maximum three-slot stage | **USD 10.80** | **9,180 seconds** |

The parent, each child, and retry allocations are non-transferable. The arm cap includes parent, children, retry, provider-side charged retries, and pre-failure usage.

These are hard ceilings, not spending targets and not evidence of model capability.

### §25.6 Pre-scored authoring and review spend — added

The human pre-authorized protocol-authoring, adjudication, and artifact-review spend incurred before scored execution. That spend is recorded separately and is not part of an arm, triplet, or scored-stage outcome.

This pre-authorization does not authorize any scored provider request.

---

## §26 Provider and model freeze — complete replacement

### §26.1 Frozen route

For this preregistered benchmark only, every arm and child uses:

| Field | Frozen treatment |
| --- | --- |
| Client-visible route identity | `@preset/abs-medium` |
| Client-visible provider | OpenRouter |
| Upstream provider/model/revision | Server-side opaque and unavailable to the client |
| Reasoning | `high` |
| Agent runtime | Pi `0.84.4` |
| Context window | 1,050,000 tokens as recorded in the manifest |
| Output limit | Not client-declared; recorded as `null`/undeclared |
| Input price | USD 0.20 per million tokens |
| Output price | USD 1.20 per million tokens |
| Cache-read price | USD 0.02 per million tokens |
| Cache-write price | USD 0.25 per million tokens |
| Separate reasoning price | None declared; recorded as included in token pricing |
| Client fallback | Disabled |
| Server-side preset resolution | Opaque residual risk accepted by the human |

### §26.2 Bounded opaque-preset exception

Draft.3’s requirement for a client-visible immutable upstream model identifier and positive output limit is relaxed **only** for the exact `@preset/abs-medium` route used by this benchmark.

The routing manifest is complete under this amendment when it:

1. records `@preset/abs-medium` as the exact client-visible identity;
2. records OpenRouter as the client-visible provider;
3. explicitly records that the upstream model identity and revision are server-side opaque;
4. explicitly records the undeclared output limit as `null` and not declared;
5. records the pricing in §26.1;
6. records reasoning `high`, Pi `0.84.4`, context capacity, route treatment, request parameters, and provenance;
7. records the human’s acceptance of the opaque-route, output-capacity, and floor-effect residual risks by reference to this amendment;
8. disables every client-controlled fallback;
9. is recursively canonicalized and protected by its SHA-256 integrity hash; and
10. is included in the final §28 hash freeze.

No other alias, model, route, provider, price, reasoning level, runtime, or output-limit assumption may be substituted without a material protocol amendment.

### §26.3 Launcher enforcement

The launcher must consume the frozen manifest and submit the exact frozen client-visible identity `@preset/abs-medium`.

The launcher must refuse launch if:

- the manifest hash is absent, malformed, or mismatched;
- the selected alias differs from `@preset/abs-medium`;
- provider, pricing, reasoning, Pi version, context, request parameters, risk-acceptance record, or fallback treatment differs from the frozen manifest;
- any client-side fallback is enabled;
- launcher configuration requests a route not present in the manifest; or
- the manifest or another launcher input changed after the final hash freeze.

The launcher must **not** refuse the accepted route solely because the upstream identity is opaque or the output limit is undeclared. It must not submit an `UNRESOLVABLE-CLIENT-SIDE` marker as the provider model identity.

“Cannot re-resolve the preset” in check 58 means that the launcher cannot replace the frozen alias with another client-side alias or model. It does not claim visibility into or control over OpenRouter’s server-side preset resolution.

### §26.4 Accepted residual risk

The human expressly accepts that:

- the upstream provider/model/revision cannot be cryptographically frozen by the client;
- the provider’s output limit is not positively declared;
- server-side routing behavior may therefore vary outside client visibility; and
- the bounded floor-effect assessment cannot establish the capability of a named immutable upstream model.

Manifest integrity, exact-alias submission, client-side fallback refusal, hard spend caps, wall-clock caps, equal treatment across arms, and post-run route/cost recording remain the enforceable safeguards.

This acceptance is not a general relaxation of §26 for another benchmark.

---

## §27.2 Required checks — replacement of checks 56, 62, and 63 only

All other §27.2 checks remain unchanged.

**56. Amended routing-manifest completeness.** PASS only if the manifest satisfies every field and risk-record requirement in amended §26, its recursive integrity hash validates, and the executable launcher accepts that exact manifest while refusing tampered or nonconforming variants. A client-visible immutable upstream model identifier is not required for this benchmark.

**62. Opaque output-capacity treatment.** PASS only if the manifest positively declares the context window, explicitly records the output limit as unavailable/undeclared, identifies every output-envelope value as a planning assumption rather than a provider limit, records the human’s acceptance, and demonstrates enforcement of the frozen spend and wall-clock ceilings. PASS does not assert that the provider exposes or guarantees a 64,000-token output limit.

**63. Floor-effect escalation resolution.** PASS only if the pilot records the bounded context/cost/time assessment, states that opaque model identity and undeclared output capacity prevent model-specific capability validation, and records the human’s express acceptance of the residual floor-effect risk. PASS means that the required escalation was completed and resolved; it does not mean that model capability was empirically verified.

The historical 62/65 pilot remains truthful under draft.3’s former semantics but is not the controlling pilot for draft.3.1. A new amendment-aligned provider-free pilot is required.

---

## §28.3 Hash-freeze trigger — added

The final hash freeze may occur only after all of the following are true:

1. this amendment has been incorporated into the controlling protocol;
2. every REMEDIATE-NOW item in the final Sol adjudication has been completed;
3. the executable launcher and pilot are aligned with amended §26;
4. a fresh provider-free pilot reports PASS for all 65 checks under draft.3.1 semantics;
5. that pilot records zero real provider requests, USD 0.00 provider cost, and no scored execution;
6. the stage is cleaned of unlisted generated test artifacts;
7. the final §28.1 manifest contains full SHA-256 values for every required artifact, including the controlling protocol and this amendment; and
8. no material artifact changes occur after the pilot and before hash generation.

The complete 367-file Current surface may be transitively frozen through `surface/current-c511642/surface-manifest.json` only if the final pilot independently recomputes every contained file hash and then freezes the surface-manifest hash.

Any material change after the controlling pilot invalidates that pilot and requires another provider-free pilot before refreezing.

---

## §31 Decision register — complete replacement

| ID | Decision | Status | Frozen treatment |
| --- | --- | --- | --- |
| OD-1 | Fixture, formula, rounding, and placement fork | **Resolved** | Approve `cold-cart-quote` exactly as built and finally hashed |
| OD-2 | Current source and admission compatibility | **Resolved** | Revision `c511642`, staged at `surface/current-c511642`, with no ambient source loading |
| OD-3 | Runtime | **Resolved** | Bun `1.3.14`; frozen lockfile; sole never-imported `typescript@5.9.3` dev dependency approved |
| OD-4 | Delegation limits | **Resolved** | 2 initial, 2 concurrent, depth 1, 1 retry |
| OD-5 | Repetition and schedule | **Resolved** | 2 planned complete triplets plus 1 complete-triplet replacement |
| OD-6 | Assessors | **Resolved** | Primaries `anthropic/claude-fable-5.1` and `moonshotai/kimi-k3`; reserve/zero-trigger third `x-ai/grok-4.6`; reviewer dual role disclosed and accepted |
| OD-7 | Budget | **Resolved** | USD 0.75 parent, USD 0.15 per initial child, USD 0.15 retry, USD 1.20 per arm, USD 10.80 maximum stage |
| OD-8 | Provider/model | **Resolved as amended** | Exact client-visible alias `@preset/abs-medium`, OpenRouter, high reasoning, Pi `0.84.4`, opaque upstream/output-limit exception under §26 |

There are no unresolved protocol ODs. The only remaining human gate is the separate Gate H2 authorization for scored provider use and spending after a passing repilot and final hash freeze.

---

# 2. Advisory adjudication

**Verification basis:** I verified the following dispositions by reading the staged sources, reports, amendment provenance, and Grok’s recorded run output. I did **not** rerun Bun tests, the mutant runner, the pilot, or network containment. Grok’s reported executions are therefore distinguished as externally **verified-run** evidence rather than executions independently observed by Sol.

| # | Advisory | Disposition | Reason |
| ---: | --- | --- | --- |
| 1 | Stale `arm-launch-args.json` strings | **REMEDIATE-NOW** | This is a hash-listed launcher input and must identify the exact alias and staged Current surface rather than retain a placeholder, regardless of whether the present test launcher reads it. |
| 2 | Dead 3.5-char/token path and ambient `/home/vc` reads | **REMEDIATE-NOW** | Remove the obsolete calculation so the controlling pilot depends only on staged artifacts and the frozen 3.0-char/token envelope. |
| 3 | Check 65 counter wording | **REMEDIATE-NOW** | Record separately `real_provider_requests = 0` and fake-transport requests, and run the pilot under an observable network-denied boundary; one fake request must not be described as a zero-request integration suite. |
| 4 | Launcher does not import/invoke the recorder | **REMEDIATE-NOW** | The scored launcher must produce the chronology used for temporal scoring; a detached recorder unit suite does not demonstrate scored-path capture. |
| 5 | Post-cap child retry branch unexercised | **REMEDIATE-NOW** | Add a test that consumes two initial attempts, the one retry, and one post-retry-cap failure and verifies the exact non-hard-failure continuation semantics. |
| 6 | Check 12 trusts stored distance/pass fields | **REMEDIATE-NOW** | Derive nearest-half-cent distance directly from each `raw_fee_usd` value and compare the derived value with any stored audit field. |
| 7 | Stale `mutant-results.json` report path | **REMEDIATE-NOW** | The controlling report must point to `custody/numeric/mutant-rerun.json` and identify the hand scoreboard as superseded. |
| 8 | Hash-list gaps | **REMEDIATE-NOW** | Final freeze must hash the controlling protocol/amendment and every §28.1 artifact; transitive Current-surface custody is allowed only with full internal revalidation. |
| 9 | Generated manifest test junk in stage | **REMEDIATE-NOW** | Delete all `.resolved-test`, `.tampered`, and `.variant-*` files and make tests use automatically cleaned temporary locations before freezing. |
| 10 | H16 not listed as an H6 numeric alias | **DEFER** | H16 checks only that `Quote.discount` remains numeric and makes no monetary-fee assertion, so it is outside the §14.4 raw-fee boundary inventory; record as `D-10` in `pilot/pilot-report.md` under **Residual risks and deferred advisories**. |

---

# 3. Additional conflicts or defects Grok missed

## 3.1 Accepted opaque route is not launchable by the current code

**Verified by reading.**

`load-manifest.ts` rejects both an opaque upstream identity and an undeclared output limit. `launch-arm.ts` therefore returns before starting with the accepted manifest.

If that rejection were removed without further correction, `launch-arm.ts` would submit:

```text
UNRESOLVABLE-CLIENT-SIDE — @preset/abs-medium is an opaque routed alias
```

as `manifestModel`, rather than submitting `@preset/abs-medium`.

This conflicts directly with amended §26. The loader, launcher, manifest, and their tests must be changed together.

## 3.2 The staged launcher is not yet the complete executable scored path required by Directive 3

**Verified by reading.**

`launch-arm.ts` is an injected scripted-operation simulator. It does not presently demonstrate:

- loading the exact arm instructions and common `AGENTS.md`;
- creating and launching a real fresh agent process;
- mounting the Current surface read-only at the process boundary;
- invoking the recorder;
- enforcing child concurrency or depth;
- enforcing parent, child, retry, and arm spend;
- enforcing child wall-clock limits;
- applying the child wrapper;
- preventing direct network access outside the injected transport; or
- swapping to a real transport while preserving the tested enforcement path.

Consequently, check 40’s claim that count, depth, retry, time, and spend are all enforced is not supported by the present launcher test, and check 55 does not prove process-level network restriction.

## 3.3 Checks 18, 22, 26, 40, and 55 overstate runtime enforcement

**Verified by reading.**

- Check 18 passes while its own report note says the launch-time read-only bind remains unbuilt.
- Check 22 combines a text scan with synthetic path tests; it does not launch the complete Current surface and prove all real record writes route into the fixture.
- Check 26 accepts a surface count greater than 300 and retains the stale skills placeholder instead of comparing the exact §9.3 loaded inventory.
- Check 40 has no spend, concurrency, depth, or child-time enforcement predicate.
- Check 55 checks a configuration string and unit tests, not a network-denied scored-process boundary.

These checks must become execution-dependent before the new pilot can be controlling.

## 3.4 The proposed hash list omits more than the two gaps named by Grok

**Verified by reading.**

In addition to the protocol, the present 25-line list does not individually or transitively freeze all required fixture files, public tests, Bun runtime identity, Pi runtime/configuration, assessor implementation/roster, manifest generator, or the complete launcher enforcement configuration.

The blank “Full SHA-256 values” section in `pilot-report.md` also does not embed or explicitly reference the separate hash file. The final report and hash artifact must form an unambiguous custody record.

---

# 4. FINAL VERDICT

## **NOT FIT**

The human decisions are now protocol-resolved by the bounded amendment, and Grok’s executed evidence substantially validates the unit-level remediation. The staged artifacts are nevertheless **not fit for immediate hash freeze or scored execution** because:

1. the accepted opaque route is still refused by the launcher;
2. the launcher would submit the wrong manifest field if that refusal were bypassed;
3. the amendment is material and has not been followed by an amendment-aligned pilot;
4. required scored-path recorder, budget, delegation, process-containment, and network enforcement remain unintegrated or unproven; and
5. the final §28.1 hash set is incomplete.

No scored provider request is authorized.

### Bounded sequence required to reach FIT

1. Incorporate this amendment into the controlling protocol.
2. Complete advisory items 1–9 and the additional launcher defects above.
3. Update the manifest, loader, launcher, and tests so the exact frozen alias is accepted and submitted while all nonconforming manifests are refused.
4. Clean the staged tree.
5. Run one fresh provider-free pilot under a network-denied boundary.
6. Require **65/65 PASS** under draft.3.1 semantics:
   - check 56 passes on amended opaque-route completeness;
   - check 62 passes on truthful undeclared-output treatment and accepted safeguards;
   - check 63 passes on completed human escalation and accepted residual risk;
   - zero real provider requests, USD 0.00 provider cost, and no scored execution.
7. Re-adjudicate only the resulting bounded remediation evidence.
8. After a FIT determination, generate the complete final §28.1 hash manifest with no material intervening change.
9. Present Gate H2 to the human with:
   - controlling protocol and amendment hashes;
   - the 65/65 pilot and zero-provider-request proof;
   - complete fixture, custody, Current-surface, harness, runtime, assessor, and route hashes;
   - exact `@preset/abs-medium` opaque-route disclosure;
   - undeclared-output and floor-effect residual-risk acceptance;
   - assessor roster and `x-ai/grok-4.6` dual-role disclosure;
   - frozen delegation limits;
   - USD 1.20 per-arm and USD 10.80 stage ceilings;
   - two planned triplets plus one replacement;
   - the committed schedule-seed hash; and
   - an explicit statement that no scored execution has yet occurred.
10. Only the human’s subsequent explicit Gate H2 “go” may authorize scored provider use and spending.
