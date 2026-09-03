"""Focused unit tests for wordstats.stats."""

import unittest

from wordstats.stats import summarize_counts


class SummarizeCountsTests(unittest.TestCase):
    def test_summary_values(self):
        counts = {"apple": 1, "banana": 4, "cherry": 2, "date": 8}

        self.assertEqual(
            summarize_counts(counts),
            {
                "minimum": 1,
                "maximum": 8,
                "median": 3,
                "unique_words": 4,
            },
        )

    def test_empty_input(self):
        self.assertEqual(
            summarize_counts({}),
            {
                "minimum": 0,
                "maximum": 0,
                "median": 0,
                "unique_words": 0,
            },
        )

    def test_input_is_preserved(self):
        counts = {"apple": 2, "banana": 1}
        original = counts.copy()

        summarize_counts(counts)

        self.assertEqual(counts, original)


if __name__ == "__main__":
    unittest.main()
