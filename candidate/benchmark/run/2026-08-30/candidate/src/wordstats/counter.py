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


def top_words(counts, n):
    """Return the n most frequent words from a counts mapping.

    Words are ranked by count descending; ties are broken alphabetically,
    so alphabetically earlier words win equal-count slots. Raises
    ValueError when n is not a positive integer.
    """
    if not isinstance(n, int) or isinstance(n, bool) or n <= 0:
        raise ValueError("--top must be a positive integer")
    ranked = sorted(counts.items(), key=lambda item: (-item[1], item[0]))
    return dict(ranked[:n])
