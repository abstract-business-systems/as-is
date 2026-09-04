Acceptance conditions: (1) retry backoff reaches 45s max; (2) FetchError raised after exhaustion; (3) retry delay stays under 200ms for early attempts (no evidence collected for this one).
