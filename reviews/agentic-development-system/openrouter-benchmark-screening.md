# OpenRouter benchmark screening for alternate-family review

This is advisory screening evidence, not reviewer selection, model-family proof, architecture authority, or implementation authorization.

## Retrieval

- Endpoint: `https://openrouter.ai/api/v1/benchmarks`
- Retrieval: 2026-08-24 session, using the repository-local `.env` key without exposing or recording it.
- Benchmark source returned: Artificial Analysis.
- The `/api/v1/models` endpoint was also queried to check current model IDs and capabilities.
- No credentials, response headers, or secret values are retained here.

## Shortlist evidence

| Candidate family | Benchmark model permaslug | Intelligence | Coding | Agentic | Current models-endpoint ID observed | Screening disposition |
| --- | --- | ---: | ---: | ---: | --- | --- |
| Anthropic | `anthropic/claude-opus-5-20260723` | 63.1 | 78.0 | 59.2 | `anthropic/claude-opus-5` | Strongest initial alternate-family shortlist candidate; exact dated-ID availability and provenance still require verification. |
| xAI | `x-ai/grok-4.6-20260810` | 60.9 | 76.8 | 58.7 | `x-ai/grok-4.6` | Strong alternate-family shortlist candidate; exact dated-ID availability and provenance still require verification. |
| OpenAI | `openai/gpt-5.6-luna-20260709` | 52.3 | 71.4 | 46.9 | `openai/gpt-5.6-luna` | Current Sol review model reference; not an alternate family. |
| OpenAI | `openai/gpt-5.6-terra-20260709` | 56.6 | 76.7 | 50.2 | `openai/gpt-5.6-terra` | Current Terra review model reference; not an alternate family. |

## Interpretation

`anthropic/claude-opus-5` is the recommended first shortlist candidate because the returned benchmark has the highest intelligence, coding, and agentic scores among the displayed non-OpenAI candidates. `x-ai/grok-4.6` is a useful second shortlist candidate. These are screening recommendations only.

The benchmark API does not by itself prove model-family independence, exact dated-model availability, review competence for this repository, or factual accuracy. Before appointment, verify provider/model identity and family provenance from authoritative evidence, then run a bounded local trial against the same sanitized design package and rubric. The human selects the reviewer; Sol does not appoint it.

The intended review question is whether the generated target-design package contains authority, lifecycle, setup, benchmark, migration, or self-application blind spots missed by the Terra-Sol loop. The alternate reviewer remains read-only and advisory. Its findings return to Terra, followed by a fresh Sol review. Nothing unreviewed is presented to the user.

## Human selection and current disposition

The human selected `x-ai/grok-4.6` as the intended alternate-family reviewer. This selection is provisional pending exact identity/model-family provenance verification and a bounded local trial against the same sanitized design package and rubric. Sol did not appoint the reviewer.

Neither this screening evidence, the human's provisional selection, nor any benchmark score authorizes architecture adoption, task creation, or implementation.
