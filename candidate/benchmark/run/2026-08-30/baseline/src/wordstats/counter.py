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


def most_frequent(counts, limit):
    """Return at most ``limit`` highest-count words from ``counts``.

    Words are ranked by descending count; equal counts are ranked
    alphabetically, so ties near the cutoff are filled alphabetically first.
    """
    ordered = sorted(counts.items(), key=lambda item: (-item[1], item[0]))
    return dict(ordered[:limit])
