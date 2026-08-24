# Decision log — proposed target design

## Status and authority

This log records proposals, evidence, unresolved human choices, and review state for `target-design-v1-draft-28`. It does not convert recommendations into approvals. A settled decision must record its authority, date/revision, scope, and any superseded decision.

| ID | Decision or question | State | Evidence | Decision authority | Consequence if unresolved |
| --- | --- | --- | --- | --- | --- |
| D-01 | Use Path A with a frozen planned package while current/planned designs remain distinguishable | Proposed | Canonical handoff and Terra/Sol reviews | Human design reviewer | No stable planned-state representation |
| D-02 | Use staged heavy refactoring with a broad evidence-based total-rewrite escape | Proposed | Terra final revision | Human design reviewer | Migration strategy remains open |
| D-03 | Keep current `as-is.md` records current-state authority and defer explicit current/planned sections to a later contract task | Proposed interim | Current record contract and reviewed package flow | Human design reviewer; later Sol contract review | Design-link admission remains unadopted |
| D-04 | Treat complete target design as program-wide and implementation readiness as bounded-unit-specific | Proposed | Terra/Sol reviewed flow | Human design reviewer | Scope of design completion remains ambiguous |
| D-05 | Select first feature | Unresolved | First-slice recommendation | Human | No benchmark or build plan can be frozen |
| D-06 | Appoint design, task admission, setup, evaluation, fixture, semantic-review, integration, and migration holders | Unresolved | Target authority map | Human/project owner | Required workflows lack accountable holders |
| D-07 | Adopt first-slice risk envelope | Proposed for alignment | Repository-local, no credential, no external-effect recommendation | Human | Unsupported safety/consumption claims may enter scope |
| D-08 | Approve exact benchmark rubric and advancement rule | Unresolved | Setup and benchmark proposal | Human | Results cannot support a controlled decision |
| D-09 | Use `x-ai/grok-4.6` as alternate-family reviewer | Provisional human selection | OpenRouter screening and handoff | Human, pending identity/provenance and bounded trial | Package review chain remains incomplete |
| D-10 | Claim external package installation or multi-project isolation in first slice | Explicitly deferred | Current host/setup evidence | Human | False consumption claim if not deferred |
| D-11 | Create dedicated design/prototyping agent group | Deferred | Existing thinking-companion and orchestration roles | Human after evidence | May add premature role complexity |
| D-12 | Create every proposal in `drafts/composable-skills.md` | Rejected as default | Draft is direction only; consumer evidence absent | Human design reviewer | Speculative skill surface and migration cost |
| D-13 | Drop or deprecate any live agent or skill | Not proposed | No complete consumer inventory | Owning authority after migration evidence | Loss of recovery/audit value and hidden breakage |
| D-14 | Verify and trial the human-selected Grok reviewer | Required gate; not complete | OpenRouter screening and reviewer procedure | Human confirms after provenance/trial | No alternate-family review can be treated as complete |
| D-15 | Freeze review revision and permitted benchmark differences | Required gate; draft-28 manifest digests verified | Terra and Sol review findings plus exact benchmark proposal | Evaluator and reviewers validate manifest | Findings cannot be causally interpreted |

## Review state

The package is currently a draft. Terra reviewed the initial package as `target-design-v1-draft-1`; fresh Sol reviewed the repaired package as `target-design-v1-draft-2`; the draft-22 through draft-27 Sol review attempts returned or preserved `revise`/budget-stopped outcomes. The current repaired revision is `target-design-v1-draft-28`, pending a fresh Sol readiness review. The package requires that review before the Grok gate. Prior partial Grok attempts on draft-4 and draft-6 were budget-stopped and are preserved as incomplete evidence. Required review order after the next repair is:

1. Fresh Sol reviews the Terra-revised frozen package; the prior draft-23 review returned `revise` and is preserved outside the frozen package.
2. Verify `x-ai/grok-4.6` identity and family provenance, then run a bounded local trial against the same sanitized package and rubric.
3. Grok performs a read-only review of the same frozen package.
4. Terra reconciles Grok findings.
5. Fresh Sol reviews the materially revised package.
6. Only then is the package presented to the human for explicit alignment.

After alignment, design-changing feedback repeats the applicable review chain. A reviewed package still does not authorize implementation; a separate design-derived build plan and explicit task authorization remain required.

## Grok gate

The human-selected `x-ai/grok-4.6` is a provisional intended reviewer, not a migrated production role. Before invocation, record the trial in `reviews/agentic-development-system/grok-target-design-review-trial.md` with authoritative model identity and family-provenance evidence, the sanitized package manifest, the risk question, exact model/provider/configuration, read-only contract, and bounded cost/wall-clock budget. The trial must measure valid novel findings, factual support, false claims, authority adherence, uncertainty calibration, latency, and provider-reported or explicitly unavailable cost. The human records one outcome—`confirmed`, `replaced`, or `inconclusive`—against the package manifest revision; `inconclusive` blocks the Grok gate and requires either a new trial or human-selected replacement. Grok reviews the same frozen manifest-defined package revision only after the trial passes. Its findings return to Terra, then fresh Sol reviews the reconciled revision. Preserve disagreement and do not infer family independence from a label or benchmark score.

## Review provenance

The package is based on the canonical handoff, current `as-is.md` records and contracts, `drafts/composable-skills.md` as non-authoritative proposal direction, the latest Terra and Sol design-flow reports, and the OpenRouter screening record. These sources are evidence with their stated authority; none is silently promoted by this log.

Terra's first package review is durably recorded at `reviews/agentic-development-system/terra-target-design-package-review.md`. Its verdict is revise; its findings are not target authority and no implementation work was authorized.
