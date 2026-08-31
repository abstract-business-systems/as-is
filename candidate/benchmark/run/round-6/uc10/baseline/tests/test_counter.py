"""Focused unit tests for wordstats."""

import io
import json
import tempfile
import unittest
from contextlib import redirect_stdout

from wordstats.cli import main
from wordstats.counter import count_words
from wordstats.stats import summarize_counts


class CountWordsTests(unittest.TestCase):
    def test_counts_basic_words(self):
        self.assertEqual(count_words("apple banana apple"), {"apple": 2, "banana": 1})

    def test_strips_punctuation_and_lowercases(self):
        self.assertEqual(count_words("Apple! apple, BANANA."), {"apple": 2, "banana": 1})

    def test_ignores_punctuation_only_tokens(self):
        self.assertEqual(count_words("-- ..."), {})

    def test_empty_input(self):
        self.assertEqual(count_words(""), {})


class SummaryStatsTests(unittest.TestCase):
    def test_summary_values(self):
        self.assertEqual(
            summarize_counts({"apple": 4, "banana": 1, "cherry": 2}),
            {
                "minimum": 1,
                "maximum": 4,
                "median": 2,
                "unique_words": 3,
            },
        )

    def test_summary_uses_average_for_even_count(self):
        self.assertEqual(
            summarize_counts({"apple": 4, "banana": 1}),
            {
                "minimum": 1,
                "maximum": 4,
                "median": 2.5,
                "unique_words": 2,
            },
        )


class StatsOptionTests(unittest.TestCase):
    def test_stats_option_appends_summary_object(self):
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8") as handle:
            handle.write("apple banana apple cherry cherry cherry")
            handle.flush()
            output = io.StringIO()
            with redirect_stdout(output):
                self.assertEqual(main(["count", handle.name, "--stats"]), 0)

        self.assertEqual(
            json.loads(output.getvalue()),
            {
                "counts": {"apple": 2, "banana": 1, "cherry": 3},
                "stats": {
                    "minimum": 1,
                    "maximum": 3,
                    "median": 2,
                    "unique_words": 3,
                },
            },
        )


if __name__ == "__main__":
    unittest.main()
