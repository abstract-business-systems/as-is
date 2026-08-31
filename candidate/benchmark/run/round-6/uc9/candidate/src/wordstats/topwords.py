"""Top-N filtering for word counts (pure logic, no I/O)."""


def filter_top_words(counts, n):
    """Return a new mapping containing at most the n most frequent words.

    Entries are ranked by descending count and then ascending word, so an
    alphabetically earlier word wins when counts tie at the cutoff. The input
    mapping is not modified.
    """
    if n <= 0:
        return {}
    ranked = sorted(counts.items(), key=lambda item: (-item[1], item[0]))
    return dict(ranked[:n])
