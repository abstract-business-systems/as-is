"""Pure helpers for selecting the most frequent words."""


def filter_top_words(counts, n):
    """Return a new mapping containing the ``n`` highest-frequency words.

    Entries are ranked by descending count and then alphabetically. The input
    mapping is not modified; a non-positive limit produces an empty mapping.
    """
    if n <= 0:
        return {}

    ranked = sorted(counts.items(), key=lambda item: (-item[1], item[0]))
    return dict(ranked[:n])
