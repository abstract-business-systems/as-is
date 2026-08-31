# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## Tokenization extraction

- Request: extract the inline tokenization logic (lowercasing and punctuation stripping) from `count_words` into its own module under `src/wordstats/`.
- Decision: new module `src/wordstats/tokenize.py` exposing `tokenize(text)`, which lowercases, splits on whitespace, strips punctuation from token edges, and omits punctuation-only tokens; `count_words` counts the returned tokens. The name follows the sibling lowercase module convention (`counter.py`, `cli.py`) with the narrowest responsibility-bearing term for the extraction step of counting.
- Options considered: `tokenizer.py` (rejected: noun form suggests a stateful object, while the module exposes a single function); `tokens.py` (rejected: suggests a data container rather than the transformation); keeping the logic inline (rejected: the request asks for a module and the step is a separable responsibility).
- Bounded change authorized: the extraction and the refactor of `count_words` to use the module only; behavior is unchanged and the deterministic checks must still pass.