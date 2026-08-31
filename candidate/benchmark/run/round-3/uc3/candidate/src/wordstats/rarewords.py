"""Rare-word selection for the wordstats mock project."""


def keep_rare_words(counts, n):
    """Return a new mapping with only the entries whose count is <= n.

    The input key order is preserved; the input mapping is not modified.
    """
    return {word: count for word, count in counts.items() if count <= n}