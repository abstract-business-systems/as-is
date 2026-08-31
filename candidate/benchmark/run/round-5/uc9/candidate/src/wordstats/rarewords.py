"""Rare-word selection for the wordstats mock project."""


def select_rare(counts, n):
    """Return a new mapping keeping only words whose count is <= n.

    The input mapping is not modified. Raises ValueError when n is
    not a positive integer.
    """
    if isinstance(n, bool) or not isinstance(n, int) or n < 1:
        raise ValueError("N must be a positive integer")
    return {word: count for word, count in counts.items() if count <= n}
