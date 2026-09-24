# Draft plan: parallel-child thin-instruction benchmark

## Status

Temporary planning artifact. This is not an adopted design, implementation task, provider authorization, or repository change. Human alignment is required before fixture creation or scored execution.

## Research question

For a bounded, realistic multi-file task under one primary harness, can a thin portable parent instruction produce comparable functional results, parallel delegation, integration quality, completion, and cost to the current role-and-skill composition?

The comparison accepts model-dependent behavior and fewer formal contracts in the thin arm. Harness-enforced safety and isolation remain common infrastructure rather than treatment differences.

## Proposed task

Create a disposable local `incident-report` command over bounded registry and trace JSONL inputs. It must produce a stable, redacted JSON report that:

- normalizes valid records;
- preserves malformed and unavailable states;
- correlates parent/child lineage and retries through opaque identifiers;
- identifies contradictions, cycles, and missing parents without inventing relationships;
- aggregates bounded duration/cost observations; and
- omits raw paths, prompts, responses, fixture markers, and secrets from public output.

This task is inspired by recent evidence/observability work but is a fresh disposable fixture, not a replay or claim about the historical implementation.

## Child partition

Three children must launch in parallel before the parent waits for terminal results:

1. **Parsing child:** owns `src/parse/**` and `test/parse/**`; implements bounded JSONL ingestion, normalization, malformed-line accounting, and safe input representation.
2. **Correlation child:** owns `src/correlate/**` and `test/correlate/**`; implements lineage, retry grouping, missing-parent/cycle handling, and consistency findings.
3. **Presentation child:** owns `src/present/**` and `test/present/**`; implements stable ordering, unavailable/error representations, and output redaction.

The parent alone owns `src/cli.ts`, `src/index.ts`, package registration, end-to-end tests, final integration, and the completion report. Children may not edit parent paths or sibling paths.

One fresh retry is permitted for one failed child. A retry receives a new worktree and attempt identity and cannot overwrite the first attempt's evidence.

## Arms

### Current composition

Current `component-builder` role and applicable component-building, bounded delegation, subagent spawning, delegated-work observation, validation, and completion procedures.

### Thin instruction

One compact portable parent instruction that:

- owns the parent fixture;
- uses up to three restricted children for the named paths;
- launches them in parallel;
- reviews and integrates bounded results;
- runs the stated checks;
- reports blockers and evidence honestly; and
- does not modify outside the detached fixture worktrees.

Each child receives only its path ownership, frozen interface, public acceptance, and return format. Children cannot delegate further.

Both arms must use identical model, tools, launcher, project snapshot, task text, worktree mechanics, child slots, retry allowance, budgets, hidden checker, and approval settings. Do not score current-protocol-specific record names as functional requirements.

## Deterministic harness controls

The harness must enforce:

- detached parent and child worktrees from one pinned baseline;
- path write containment;
- no master/ref changes;
- network denial;
- fixed model, tool, and dependency versions;
- three child slots, one retry, and no deeper delegation;
- child and parent wall-clock/cost limits;
- process-group cancellation;
- immutable public baseline and hidden-test isolation;
- status, diff, SHA, timing, usage, and cleanup capture.

Model judgment remains responsible for decomposition, child prompts, retry selection, implementation design, child review, conflict handling, and final explanation.

## Public and hidden acceptance

Public materials provide the frozen interfaces, ownership map, output schema, public tests, child limit, retry shape, and basic examples.

Hidden cases include:

- shuffled input order;
- failed attempt followed by retry;
- absent parent;
- conflicting parent IDs;
- attempted cycles;
- malformed JSONL;
- unsupported or invalid values;
- duplicate opaque IDs;
- unavailable input source;
- redaction markers and path/prompt-like strings; and
- at least one cross-module case requiring parent integration.

Score separately:

- child functional quality;
- deterministic output and redaction;
- scope compliance;
- child handoff completeness;
- parallel overlap;
- parent integration quality;
- terminal completion or accurately accounted failure;
- retry recovery; and
- cost, latency, and human intervention.

## Proposed budget and repetitions

After a non-scored harness pilot, run five valid paired repetitions with randomized arm order.

Proposed per-run ceiling:

- parent planning/integration: USD 0.26;
- three children: USD 0.13 each;
- one retry pool: USD 0.10;
- reserve: USD 0.05;
- parent wall-clock: 10 minutes;
- child wall-clock: 5 minutes;
- retry wall-clock: 3 minutes.

Proposed scored-stage ceiling: USD 8.00, plus a separately reserved USD 2.00 contingency for preregistered infrastructure-invalid reruns only. These are proposed limits, not execution authorization.

## Invalid and failure handling

Infrastructure-invalid runs include baseline mismatch, hidden-checker malfunction, dependency drift, unavailable provider/model, worktree provisioning failure, or arm-asymmetric harness failure. Preserve evidence and rerun only under an arm-neutral rule.

Arm outcomes include child timeout, cost exhaustion, out-of-scope write, bad handoff, failed tests, refusal, parent integration error, or truthful blocked completion. Do not convert failure into success because a process exited.

Stop the stage for master mutation, hidden-test access, network/external action, secret exposure, writes outside allocation, two material containment failures, three infrastructure-invalid pairs, human implementation intervention, or budget beyond USD 10.00.

## Human-alignment gate

Before execution, the human must decide:

- whether this task family is representative enough;
- whether three parallel children and one retry are the intended treatment;
- which safety failures are disqualifying;
- whether delegation is required or only scored;
- whether the proposed USD 10.00 ceiling is acceptable;
- hidden-test access and retention rules; and
- confirmation that no master changes are permitted.

After the non-scored harness pilot, the human should review the frozen plan and authorize the five-pair scored stage separately.

## Evidence and later artifact path

Keep fixture worktrees, prompts, hidden cases, raw outputs, and telemetry outside tracked product paths. Preserve a bounded redacted result summary only after authorized execution.

If the human approves a durable planning artifact, the proposed repository destination is `drafts/parallel-child-benchmark-stage-plan.md`. It must remain labelled draft until the decision and execution scopes are explicitly adopted.
