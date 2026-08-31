"""Word-count utilities for the wordstats mock project."""


def count_words(text):
    """Return a mapping of lowercased words to occurrence counts.

    Punctuation is stripped from token edges; tokens that are only
    punctuation are ignored.
    """
    counts = {}
    for raw in text.lower().split():
        word = raw.strip(".,;:!?-\"'()")
        if word:
            counts[word] = counts.get(word, 0) + 1
    return counts
