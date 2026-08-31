"""Rare-word filtering for wordstats."""


def filter_rare_words(counts, n):
    """Return a new mapping containing only words with count <= n.

    The input mapping is not modified.
    """
    return {word: count for word, count in counts.items() if count <= n}