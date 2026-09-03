"""Focused unit tests for wordstats.counter."""

import contextlib
import io
import json
import tempfile
import unittest


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


class SummaryTests(unittest.TestCase):
    def test_summary_values(self):
        self.assertEqual(
            summarize_counts({"a": 4, "b": 1, "c": 2, "d": 2}),
            {"min_count": 1, "max_count": 4, "median_count": 2.0, "unique_words": 4},
        )

    def test_empty_summary(self):
        self.assertEqual(
            summarize_counts({}),
            {"min_count": None, "max_count": None, "median_count": None, "unique_words": 0},
        )


class CliStatsTests(unittest.TestCase):
    def test_stats_option_appends_summary(self):
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8") as handle:
            handle.write("apple banana apple cherry")
            handle.flush()
            captured = io.StringIO()
            with contextlib.redirect_stdout(captured):
                self.assertEqual(main(["count", "--stats", handle.name]), 0)
        output = json.loads(captured.getvalue())
        self.assertEqual(output["apple"], 2)
        self.assertEqual(output["stats"], {"min_count": 1, "max_count": 2, "median_count": 1, "unique_words": 3})

    def test_without_stats_preserves_count_mapping(self):
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8") as handle:
            handle.write("apple apple")
            handle.flush()
            captured = io.StringIO()
            with contextlib.redirect_stdout(captured):
                self.assertEqual(main(["count", handle.name]), 0)
        self.assertEqual(json.loads(captured.getvalue()), {"apple": 2})


if __name__ == "__main__":
    unittest.main()
