# GLM alternate-family trial gate — target-design-v1-draft-28

This is the durable gate record for the human-selected replacement alternate-family reviewer. It is advisory and read-only. It is not a completed package review, approval, target-contract adoption, task authority, user alignment, or implementation authorization.

## Human selection

The human selected `z-ai/glm-5.3` as the replacement alternate-family reviewer after the Grok and Anthropic suitability paths ended inconclusively. This selection authorizes only the bounded identity/provenance check and suitability trial described here. It does not authorize the full package review, package presentation, adoption, task creation, or implementation.

## Identity and provenance preflight

- **Provider:** OpenRouter.
- **Requested model ID:** `z-ai/glm-5.3`.
- **Authoritative provider record:** the current-session OpenRouter models response at `/tmp/openrouter-models.json`; this is execution evidence and is not a tracked package artifact.
- **Provider model record:** `id: z-ai/glm-5.3`; `canonical_slug: z-ai/glm-5.3-20260816`; `name: Z.ai: GLM 5.3`; description identifies Z.ai; tokenizer is `Other`.
- **Family evidence:** provider metadata identifies the Z.ai/GLM family. This is provider-supplied provenance, not cryptographic proof of model internals or independence from every other reviewer.
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

If the attempt is budget-stopped, fails to produce a final structured response, or leaves family provenance materially unresolved, record `inconclusive` and do not run the full GLM package review.

## Attempt ledger

| Attempt | Package | Provider/model | Provenance | Packet identity | Bound | Outcome | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `glm-draft28-attempt-1` | `target-design-v1-draft-28` | Trace: `provider=openrouter`, `model=z-ai/glm-5.3` | Provider-supplied Z.ai/GLM metadata recorded above; independent cryptographic family proof unavailable | Caller packet digest recorded; manifest-defined set | 900 seconds; USD 1.00 maximum | Provider request failed immediately with HTTP 404 due to guardrail/data-policy endpoint restrictions; `inconclusive`; no approval | `reviews/agentic-development-system/glm-target-design-review-trial-draft28-attempt1.md` and `/tmp/glm-target-design-review-trial-draft28-attempt1.log` |

## Human outcome

**Pending explicit human decision.** GLM attempt 1 is `inconclusive` because the provider request failed immediately with HTTP 404: no endpoint matched the configured guardrail restrictions and data policy. No reviewer analysis was produced, so the human-selected replacement is not confirmed. A retry would require explicit human direction and must not weaken privacy or guardrail settings implicitly.

## Follow-up

A passed and human-confirmed trial would permit one full read-only GLM package review against the same manifest-defined package. Its findings must then return to Terra for reconciliation and fresh Sol review. Attempt 1 is inconclusive because provider admission failed before analysis, so the full GLM review is blocked. A retry or another reviewer requires explicit human direction. No result grants implementation authority.
