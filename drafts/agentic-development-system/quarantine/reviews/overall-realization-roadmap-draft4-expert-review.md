# Expert Review — Overall Realization Roadmap Draft 4
Purpose: Record the bounded read-only review of the Draft-4 human-facing planning packet for cognitive-load and model/role-assignment defects.

## Verdict

`Revise`. Draft 4 substantially preserves the accepted program direction and adds a concise front door plus meaningful role separation without granting implementation authority. The packet does not yet fully satisfy its own progressive-disclosure and model-configuration requirements, and no separate Draft-4 freeze identity was available during this review.

This is advisory evidence only. It does not approve the packet, adopt target contracts, create tasks, authorize kick-off, authorize implementation, benchmark, adoption, retirement, commit, or merge.

## Scope and identity

Reviewed exactly:

- `drafts/agentic-development-system-overall-realization-roadmap-draft4/roadmap.md`
- `drafts/agentic-development-system-overall-realization-roadmap-draft4/decision-brief.md`
- `drafts/agentic-development-system-overall-realization-roadmap-draft4/review-manifest.md`
- `drafts/agentic-development-system-overall-realization-roadmap-draft4/review-instructions.md`
- `drafts/agentic-development-system-overall-realization-roadmap-draft4/model-and-review-assignment.md` as an excluded supporting companion only

The manifest declares the four-file decision packet and excludes the companion from packet identity. No Draft-4 freeze record or digest was available at review time. No cryptographic digest was recomputed.

## Evidence

- The roadmap preserves the broad sequence from human-facing design and explicit approval through bounded implementation, setup-inclusive comparison against pinned `master`, and separate advancement, migration, adoption, retirement, and merge decisions.
- The roadmap retains the broad workstreams and correctly positions Draft 6 as a narrow first execution-control slice and sibling parallelism as a limited clarification.
- The brief is substantially shorter and contains the decision, recommendation, consequences, risks, authority limits, and next step.
- The packet distinguishes target direction from current contracts and separates planning, implementation, deterministic validation, semantic review, architecture/high-risk review, integration, evaluation/scoring, and optional alternate-family review.
- Current configured role/preset claims are supported: `worker` and `component-builder` use `medium` mapped to `@preset/abs-medium`; `expert` and `evidence-validator` use `large` mapped to `@preset/abs-large`; `as-is.json` names `openrouter` as the configured provider.
- Historical Terra, Sol, Kimi, and Sol/Terra/Luna framing are presented as historical or transitional observations, not a permanent target roster.
- Authority limits and `startsWork: false` are explicit.

## Blocking findings

1. The brief does not provide exact roadmap links or section references for progressive disclosure. A human must locate supporting detail in the long roadmap without guidance.
2. The brief does not surface the specific unresolved process-adapter ownership decision, which the roadmap identifies as a blocker before Draft-6 implementation. Material blockers must not be hidden solely in supporting detail.
3. The packet does not state the configured project provider default `openrouter`, despite its review instructions requiring that distinction. Exact task-level provider routes remain kick-off facts.
4. No separate caller-owned Draft-4 freeze record or exact packet identity was available, so the packet was not reviewable as a cryptographically frozen revision.

## Non-blocking findings

- The brief is otherwise appropriately concise; the repairs can be short additions.
- The companion exclusion is explicit and coherent when manifest membership is followed.
- The roadmap's embedded authoring assessment of the response artifacts is stale or unnecessary for the clean human-facing packet and should be removed or relocated in a successor.
- No permanent Sol/Terra/Luna roster or authority grant was observed.

## Recommendation

Create one bounded successor that adds exact brief-to-roadmap links, surfaces the process-adapter blocker, states the configured `openrouter` default while preserving kick-off route selection, and removes or relocates the stale authoring assessment. Then freeze the exact packet and perform one final exact review. A second Kimi review is not required unless the successor changes substantive architecture, safety, evaluation, or authority content.

## Residual risk

The current parent-side integration model still differs from the proposed child-owned target transition. Task-level model/provider availability, capabilities, budgets, human holders, consumer inventory, and benchmark identity remain unresolved until later gates. The roadmap remains a planning artifact and does not authorize execution.
