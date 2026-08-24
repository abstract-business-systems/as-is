# Anthropic alternate-family trial gate — target-design-v1-draft-28

This is the durable gate record for the human-selected replacement alternate-family reviewer. It is advisory and read-only. It is not a completed package review, approval, target-contract adoption, task authority, user alignment, or implementation authorization.

## Human selection

The human selected `anthropic/claude-opus-5` as the replacement alternate-family reviewer after the Grok retry-first path ended inconclusively. This selection authorizes only the bounded identity/provenance check and suitability trial described here. It does not authorize the full package review, package presentation, adoption, task creation, or implementation.

## Identity and provenance preflight

- **Provider:** OpenRouter.
- **Requested model ID:** `anthropic/claude-opus-5`.
- **Authoritative provider record:** the repository-retained OpenRouter models response at `/tmp/openrouter-models.json`, queried during the current session; this path is execution evidence and is not a tracked package artifact.
- **Provider model record:** `id: anthropic/claude-opus-5`; `canonical_slug: anthropic/claude-opus-5-20260723`; `name: Claude Opus 5`; `description` identifies Anthropic; tokenizer is `Claude`.
- **Family evidence:** provider metadata identifies the Anthropic/Claude family. This is stronger than a bare label but remains provider-supplied provenance, not cryptographic proof of model internals or independence from every other reviewer.
- **Screening evidence:** `reviews/agentic-development-system/openrouter-benchmark-screening.md`; screening is advisory and does not itself prove suitability.
- **Package revision:** `target-design-v1-draft-28`.
- **Packet digest:** `sha256(path\0bytes concatenation) = 24602d9e1c72f4b24760ad3af36bc600a05399ecb02552bfa47010ba047e2506`; the manifest directly covers the eight non-manifest file digests and excludes itself from its digest table.

## Trial contract

- **Scope:** authority boundaries, current/planned separation, migration-ledger integrity, setup/evaluation confounding, protected fixture controls, and self-application risks.
- **Input:** the exact frozen, sanitized draft-28 package identified by the manifest; no credentials, secrets, private runtime state, or unbounded provider payloads.
- **Role:** `agents/expert/agent.md`.
- **Mode:** read-only advisory.
- **Permitted tools:** `read,grep,find,ls,resolve_component_context` only.
- **Prohibited actions:** edits, task mutation or creation, delegation, web tools, commits, external effects other than the explicitly authorized provider request, and implementation.
- **Bound for current attempt:** 900 wall-clock seconds; USD 1.00 forwarded maximum, as explicitly authorized by the human. Earlier attempt bounds remain historical.
- **Required output:** supported novel risks with exact file evidence, unsupported claims, uncertainty, authority adherence, and recommendation.

## Result schema and decision rule

A completed attempt must record the exact trial ID, package revision, provider/model, provenance evidence, packet identity, timestamps, wall-clock and cost observations, valid novel findings, unsupported claims, authority violations, uncertainty observations, output reference, human outcome, and status (`passed`, `failed`, or `inconclusive`). A passed trial requires completed bounded scope without authority violation, at least one independently supported risk or an explicit no-additional-risk result, no unresolved material unsupported claim, non-empty provenance, packet identity, output reference, and human outcome `confirmed`.

If the attempt is budget-stopped, fails to produce a final structured response, or leaves family provenance materially unresolved, record `inconclusive` and do not run the full Anthropic package review.

## Attempt ledger

| Attempt | Package | Provider/model | Provenance | Packet identity | Bound | Outcome | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `anthropic-draft28-attempt-1` | `target-design-v1-draft-28` | Trace: `provider=openrouter`, `model=anthropic/claude-opus-5` | Provider-supplied Anthropic/Claude metadata recorded above; independent cryptographic family proof unavailable | Caller packet digest recorded; manifest-defined set | 300 seconds; USD 0.35 maximum | Budget-stopped before final structured response; `inconclusive`; no approval | `reviews/agentic-development-system/anthropic-target-design-review-trial-draft28-attempt1.md` and `/tmp/anthropic-target-design-review-trial-draft28-attempt1.log` |
| `anthropic-draft28-attempt-2` | `target-design-v1-draft-28` | Trace: `provider=openrouter`, `model=anthropic/claude-opus-5` | Provider-supplied Anthropic/Claude metadata recorded above; independent cryptographic family proof unavailable | Caller packet digest recorded; manifest-defined set | 900 seconds; USD 1.00 maximum | Budget-stopped before final structured response; `inconclusive`; no approval | `reviews/agentic-development-system/anthropic-target-design-review-trial-draft28-attempt2.md` and `/tmp/anthropic-target-design-review-trial-draft28-attempt2.log` |
| `anthropic-draft28-attempt-2` | `target-design-v1-draft-28` | Pending execution evidence; requested `openrouter/anthropic/claude-opus-5` | Provider-supplied Anthropic/Claude metadata recorded above; independent cryptographic family proof unavailable | Caller packet digest recorded; manifest-defined set | 900 seconds; USD 1.00 maximum | Not started | `reviews/agentic-development-system/anthropic-target-design-review-trial-draft28-attempt2.md` |

## Human outcome

**Pending explicit human decision.** Attempts 1 and 2 are `inconclusive` because both were budget-stopped before a final structured response. Attempt 2 used the human-authorized 900-second/USD 1.00 bound. The partial concern about `.pi/prompts/as-is.md` tracking was checked and rejected locally; other partial observations remain advisory and unresolved. The human-selected replacement is not confirmed as a suitable reviewer. A further retry or another replacement requires explicit human direction.

## Follow-up

A passed and human-confirmed trial would permit one full read-only Anthropic package review against the same manifest-defined package. Its findings must then return to Terra for reconciliation and fresh Sol review. Attempts 1 and 2 are inconclusive and block that review. No result grants implementation authority.
