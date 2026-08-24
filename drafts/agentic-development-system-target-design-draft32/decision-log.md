# Decision log — proposed target design

## Status and authority

This log records proposals, evidence, unresolved human choices, and review state for `target-design-v1-draft-32`. It does not convert recommendations into approvals. A settled decision must record its authority, date/revision, scope, and any superseded decision.

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
| D-09 | Use `moonshotai/kimi-k3` as alternate-family reviewer | Provisional human selection; draft-28 suitability findings validated and reconciled; draft-32 gate pending | OpenRouter screening, Kimi trial, Sol validation, Terra reconciliation | Human, pending draft-32 identity/provenance and bounded trial | Package review chain remains incomplete |
| D-10 | Claim external package installation or multi-project isolation in first slice | Explicitly deferred | Current host/setup evidence | Human | False consumption claim if not deferred |
| D-11 | Create dedicated design/prototyping agent group | Deferred | Existing thinking-companion and orchestration roles | Human after evidence | May add premature role complexity |
| D-12 | Create every proposal in `drafts/composable-skills.md` | Rejected as default | Draft is direction only; consumer evidence absent | Human design reviewer | Speculative skill surface and migration cost |
| D-13 | Drop or deprecate any live agent or skill | Not proposed | No complete consumer inventory | Owning authority after migration evidence | Loss of recovery/audit value and hidden breakage |
| D-14 | Verify and trial the human-selected alternate-family reviewer | Required gate; draft-32 Kimi trial pending | OpenRouter screening and reviewer procedure | Human confirms after provenance/trial | No alternate-family review can be treated as complete |
| D-15 | Freeze review revision and permitted benchmark differences | Required gate; successor draft-32 has caller-side attributed verification | Terra reconciliation of Kimi findings and exact benchmark proposal | Named verifier and reviewers validate manifest | Findings cannot be causally interpreted |

## Review state

The package is currently `frozen-for-review`. Terra reviewed the initial package as `target-design-v1-draft-1`; fresh Sol reviewed the repaired package as `target-design-v1-draft-2`; the draft-22 through draft-28 Sol review attempts returned or preserved `revise`/budget-stopped outcomes. Terra reconciled the Sol-validated Kimi findings as six repairs, and successor draft-32 incorporates those proposed repairs. Draft-30 received fresh Sol `revise`; draft-32 has a caller-side attributed manifest verification record and is pending fresh Sol readiness review. Prior alternate-family attempts are preserved as incomplete or advisory evidence. Required review order after this repair is:

1. Fresh Sol reviews the Terra-revised frozen draft-32 package and the attributed manifest-verification record.
2. If Sol approves readiness, run the selected alternate-family suitability gate against the exact draft-32 package; a passed trial and human confirmation are required before full package review.
3. If the suitability gate passes, obtain explicit human confirmation before the full package review.
4. The alternate reviewer performs a read-only review of the same frozen package.
5. Terra reconciles its findings.
6. Fresh Sol reviews the materially revised package.
7. Only then is the package presented to the human for explicit alignment.

After alignment, design-changing feedback repeats the applicable review chain. A reviewed package still does not authorize implementation; a separate design-derived build plan and explicit task authorization remain required.

## Alternate-family gate

The human-selected alternate-family reviewer is currently `moonshotai/kimi-k3`, subject to the draft-32 gate after fresh Sol readiness. The prior Kimi suitability response is advisory evidence only; Sol validated its findings and Terra dispositioned all six as repairs. A selected reviewer must be verified against the exact successor manifest, complete a bounded read-only suitability trial, and receive explicit human confirmation before a full package review. The reviewer is not a migrated production role and cannot authorize implementation. Its full findings return to Terra, then fresh Sol reviews the reconciled revision. Preserve disagreement and do not infer family independence from a label or benchmark score.

## Review provenance

The package is based on the canonical handoff, current `as-is.md` records and contracts, `drafts/composable-skills.md` as non-authoritative proposal direction, the latest Terra and Sol design-flow reports, and the OpenRouter screening record. These sources are evidence with their stated authority; none is silently promoted by this log.

Terra's first package review is durably recorded at `reviews/agentic-development-system/terra-target-design-package-review.md`. Its verdict is revise; its findings are not target authority and no implementation work was authorized.
