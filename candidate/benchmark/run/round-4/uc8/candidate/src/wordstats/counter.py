"""Word-count utilities for the wordstats mock project."""

from wordstats.tokenize import tokenize


def count_words(text):
    """Return a mapping of lowercased words to occurrence counts.

    Tokenization (lowercasing and punctuation stripping) is provided by
    wordstats.tokenize; tokens that are only punctuation are ignored.
    """
    counts = {}
    for word in tokenize(text):
        counts[word] = counts.get(word, 0) + 1
    return counts
