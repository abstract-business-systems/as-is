# Owner record: core utility

Owns the word-count logic, statistics summary, and CLI surface (`src/wordstats/`). The public contract is: lowercase tokens, punctuation stripped from token edges, punctuation-only tokens ignored, counts returned as a mapping. The optional summary reports minimum, maximum, median, and unique-word count from that mapping. CLI output is JSON with sorted keys.