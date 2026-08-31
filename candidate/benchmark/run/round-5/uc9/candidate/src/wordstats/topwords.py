"""Top-word selection for the wordstats mock project."""


def select_top(counts, n):
    """Return a new mapping keeping only the n most frequent words.

    Words are ordered by descending count, then ascending word, and the
    first n are kept. The input mapping is not modified.
    """
    if isinstance(n, bool) or not isinstance(n, int) or n < 1:
        raise ValueError("N must be a positive integer")
    ordered = sorted(counts.items(), key=lambda item: (-item[1], item[0]))
    return dict(ordered[:n])