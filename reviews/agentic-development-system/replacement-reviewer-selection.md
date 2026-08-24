# Replacement alternate-family reviewer selection — pending human choice

This advisory record preserves the reviewer-selection state after the Grok and Anthropic suitability paths ended inconclusively. It is not reviewer appointment, package approval, target-contract adoption, task authority, or implementation authorization.

## Prior reviewer outcomes

- `x-ai/grok-4.6`: two draft-28 suitability attempts; attempt 1 returned `inconclusive`, retry attempt 2 was budget-stopped at 300 seconds.
- `anthropic/claude-opus-5`: two draft-28 suitability attempts; attempt 1 was budget-stopped at 300 seconds, retry attempt 2 was budget-stopped at 900 seconds.
- No alternate-family reviewer has been confirmed for the full package review.

## Additional screened candidates

The retained OpenRouter models response and benchmark screening identify these candidates not previously tried:

| Candidate | Family | Intelligence | Coding | Agentic | Simple mean | Notes |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| `z-ai/glm-5.3` | Z.ai | 59.5 | 74.8 | 59.1 | 64.47 | Highest simple mean among additional candidates; 1M context; mandatory reasoning; provider-supplied family identity requires verification. |
| `moonshotai/kimi-k3` | MoonshotAI | 59.7 | 76.2 | 54.3 | 63.40 | Strong coding score; 1M context; provider-supplied family identity requires verification. |
| `qwen/qwen3.8-max` | Qwen | 58.1 | 71.8 | 58.4 | 62.77 | Strong agentic score; 1M context; mandatory reasoning; provider-supplied family identity requires verification. |
| `google/gemini-3.7-flash` | Google | 56.0 | 76.1 | 45.1 | 59.07 | Strong coding but lower agentic score; 1M context; provider-supplied family identity requires verification. |
| `deepseek/deepseek-v4-pro-0813` | DeepSeek | 53.2 | 68.8 | 49.6 | 57.20 | Lower-cost-looking candidate; provider-supplied family identity requires verification. |

Source and limitations: `reviews/agentic-development-system/openrouter-benchmark-screening.md` and the current-session OpenRouter models response at `/tmp/openrouter-models.json`. Benchmark scores are screening evidence only. They do not establish reviewer suitability, factual accuracy, or independent-family provenance.

## Selection protocol

The human must select one candidate explicitly. After selection:

1. Verify the exact provider/model ID and provider-supplied family evidence.
2. Record the selected reviewer and exact request configuration.
3. Compute and record the exact draft-28 packet identity.
4. Create a separately named bounded suitability-trial record.
5. Run one read-only suitability trial against the exact frozen package under the explicitly authorized budget.
6. Preserve the result. A passed trial and explicit human `confirmed` outcome are required before any full package review.

## Current state

**Human selection recorded:** `moonshotai/kimi-k3`. The GLM provider-admission trial ended inconclusively; the Kimi suitability trial is authorized only under the existing expanded bound of 900 wall-clock seconds and USD 1.00 forwarded maximum. The trial gate is recorded at `reviews/agentic-development-system/kimi-target-design-review-trial.md`. The target package remains unpresented and implementation remains unauthorized.
