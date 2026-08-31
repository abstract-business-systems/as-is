"""Tokenization for word-count utilities."""

STRIP_CHARS = ".,;:!?-\"'()"


def tokenize(text):
    """Return lowercase tokens with punctuation stripped from token edges.

    Tokens that are only punctuation are omitted.
    """
    return [
        word
        for raw in text.lower().split()
        if (word := raw.strip(STRIP_CHARS))
    ]
