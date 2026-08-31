"""Top-N filtering for word counts (pure logic, no I/O)."""


def filter_top_words(counts, n):
    """Return a NEW mapping containing only the n most frequent words.

    Ties are broken alphabetically: when words tie at the cutoff, the
    word earlier in alphabetical order wins. ``counts`` is not modified.
    """
    if n <= 0:
        return {}
    ranked = sorted(counts.items(), key=lambda item: (-item[1], item[0]))
    return dict(ranked[:n])