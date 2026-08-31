# Owner record: core utility

Owns the word-count logic and CLI surface (`src/wordstats/`). The public contract is: lowercase tokens, punctuation stripped from token edges, punctuation-only tokens ignored, counts returned as a mapping. CLI output is JSON with sorted keys.