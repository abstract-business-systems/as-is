"""Focused unit tests for wordstats.counter."""

import unittest

from wordstats.counter import count_words


class CountWordsTests(unittest.TestCase):
    def test_counts_basic_words(self):
        self.assertEqual(count_words("apple banana apple"), {"apple": 2, "banana": 1})

    def test_strips_punctuation_and_lowercases(self):
        self.assertEqual(count_words("Apple! apple, BANANA."), {"apple": 2, "banana": 1})

    def test_ignores_punctuation_only_tokens(self):
        self.assertEqual(count_words("-- ..."), {})

    def test_preserves_internal_hyphens(self):
        self.assertEqual(
            count_words("a well-known well-known idea"),
            {"a": 1, "well-known": 2, "idea": 1},
        )

    def test_empty_input(self):
        self.assertEqual(count_words(""), {})


if __name__ == "__main__":
    unittest.main()
