# Kimi alternate-family trial gate — target-design-v1-draft-28

This is the durable gate record for the human-selected replacement alternate-family reviewer. It is advisory and read-only. It is not a completed package review, approval, target-contract adoption, task authority, user alignment, or implementation authorization.

## Human selection

The human selected `moonshotai/kimi-k3` as the replacement alternate-family reviewer after the Grok, Anthropic, and GLM suitability paths ended inconclusively. This selection authorizes only the bounded identity/provenance check and suitability trial described here. It does not authorize the full package review, package presentation, adoption, task creation, or implementation.

## Identity and provenance preflight

- **Provider:** OpenRouter.
- **Requested model ID:** `moonshotai/kimi-k3`.
- **Authoritative provider record:** the current-session OpenRouter models response at `/tmp/openrouter-models.json`; this is execution evidence and is not a tracked package artifact.
- **Provider model record:** `id: moonshotai/kimi-k3`; `canonical_slug: moonshotai/kimi-k3-20260715`; `name: MoonshotAI: Kimi K3`; description identifies Moonshot AI; tokenizer is `Other`.
- **Family evidence:** provider metadata identifies the MoonshotAI/Kimi family. This is provider-supplied provenance, not cryptographic proof of model internals or independence from every other reviewer.
- **Screening evidence:** `reviews/agentic-development-system/openrouter-benchmark-screening.md` and `reviews/agentic-development-system/replacement-reviewer-selection.md`; screening is advisory and does not itself prove suitability.
- **Package revision:** `target-design-v1-draft-28`.
- **Packet digest:** `sha256(path\0bytes concatenation) = 24602d9e1c72f4b24760ad3af36bc600a05399ecb02552bfa47010ba047e2506`; the manifest covers the eight non-manifest file digests and excludes itself from its digest table.

## Trial contract

- **Scope:** authority boundaries, current/planned separation, migration-ledger integrity, setup/evaluation confounding, protected fixture controls, and self-application risks.
- **Input:** the exact frozen, sanitized draft-28 package identified by the manifest; no credentials, secrets, private runtime state, or unbounded provider payloads.
- **Role:** `agents/expert/agent.md`.
- **Mode:** read-only advisory.
- **Permitted tools:** `read,grep,find,ls,resolve_component_context` only.
- **Prohibited actions:** edits, task mutation or creation, delegation, web tools, commits, external effects other than the explicitly authorized provider request, and implementation.
- **Bound:** 900 wall-clock seconds; USD 1.00 forwarded maximum, using the previously authorized expanded trial bound.
- **Required output:** supported novel risks with exact file evidence, unsupported claims, uncertainty, authority adherence, and recommendation.

## Result schema and decision rule

A completed attempt must record the exact trial ID, package revision, provider/model, provenance evidence, packet identity, timestamps, wall-clock and cost observations, valid novel findings, unsupported claims, authority violations, uncertainty observations, output reference, human outcome, and status (`passed`, `failed`, or `inconclusive`). A passed trial requires completed bounded scope without authority violation, at least one independently supported risk or an explicit no-additional-risk result, no unresolved material unsupported claim, non-empty provenance, packet identity, output reference, and human outcome `confirmed`.

If the attempt is budget-stopped, fails to produce a final structured response, or leaves family provenance materially unresolved, record `inconclusive` and do not run the full Kimi package review.

## Attempt ledger

| Attempt | Package | Provider/model | Provenance | Packet identity | Bound | Outcome | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `kimi-draft28-attempt-1` | `target-design-v1-draft-28` | Trace: `provider=openrouter`, `model=moonshotai/kimi-k3` | Provider-supplied MoonshotAI/Kimi metadata recorded above; independent cryptographic family proof unavailable | Caller packet digest recorded; reviewer did not recompute | 900 seconds; USD 1.00 maximum | Structured response returned; recommendation `revise`; gate status `inconclusive` pending human outcome | `reviews/agentic-development-system/kimi-target-design-review-trial-draft28-attempt1.md` and `/tmp/kimi-target-design-review-trial-draft28-attempt1.log` |

## Human outcome

**Human direction recorded:** route Kimi's findings to Sol for validation and provide the verified packet digest to Terra. This does not confirm Kimi as suitable for a full package review and does not authorize that review. Sol validation is recorded at `reviews/agentic-development-system/sol-validation-of-kimi-trial.md`; Terra reconciliation input is recorded at `reviews/agentic-development-system/terra-kimi-findings-reconciliation-input.md`. The gate remains `inconclusive` for full Kimi review pending Terra reconciliation and fresh Sol review.

## Follow-up

A passed and human-confirmed trial would permit one full read-only Kimi package review against the same manifest-defined package. Here, the human directed Sol validation and Terra receipt of the verified digest instead of immediately admitting Kimi to a full review. Kimi's findings are validated for Terra reconciliation, but the gate remains `inconclusive` for full Kimi review until Terra reconciles and fresh Sol reviews. No result grants implementation authority.
