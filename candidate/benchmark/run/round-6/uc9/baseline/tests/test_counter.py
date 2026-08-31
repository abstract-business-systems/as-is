"""Focused unit tests for wordstats.counter."""

import contextlib
import io
import tempfile
import unittest
from pathlib import Path

from wordstats.cli import main
from wordstats.counter import count_words
from wordstats.rarewords import filter_rare
from wordstats.topwords import filter_top_words


class CountWordsTests(unittest.TestCase):
    def test_counts_basic_words(self):
        self.assertEqual(count_words("apple banana apple"), {"apple": 2, "banana": 1})

    def test_strips_punctuation_and_lowercases(self):
        self.assertEqual(count_words("Apple! apple, BANANA."), {"apple": 2, "banana": 1})

    def test_ignores_punctuation_only_tokens(self):
        self.assertEqual(count_words("-- ..."), {})

    def test_empty_input(self):
        self.assertEqual(count_words(""), {})


class FilterTests(unittest.TestCase):
    def test_rare_filter_is_inclusive(self):
        counts = {"often": 3, "sometimes": 2, "rarely": 1}
        self.assertEqual(filter_rare(counts, 2), {"sometimes": 2, "rarely": 1})

    def test_top_filter_sorts_by_count_then_alphabetically(self):
        counts = {"zebra": 2, "apple": 3, "banana": 3, "pear": 1}
        self.assertEqual(filter_top_words(counts, 2), {"apple": 3, "banana": 3})

    def test_filters_return_new_mappings(self):
        counts = {"apple": 2}
        self.assertIsNot(filter_rare(counts, 2), counts)
        self.assertIsNot(filter_top_words(counts, 1), counts)


class CliFilterTests(unittest.TestCase):
    def run_cli(self, *arguments):
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            with tempfile.TemporaryDirectory() as directory:
                path = Path(directory) / "words.txt"
                path.write_text("apple apple banana cherry cherry cherry", encoding="utf-8")
                result = main(["count", *arguments, str(path)])
        return result, output.getvalue()

    def test_rare_option(self):
        result, output = self.run_cli("--rare", "2")
        self.assertEqual(result, 0)
        self.assertEqual(output, '{\n  "apple": 2,\n  "banana": 1\n}\n')

    def test_top_option_with_alphabetical_tie_break(self):
        result, output = self.run_cli("--top", "2")
        self.assertEqual(result, 0)
        self.assertEqual(output, '{\n  "apple": 2,\n  "cherry": 3\n}\n')

    def test_both_options_apply_rare_then_top(self):
        result, output = self.run_cli("--rare", "2", "--top", "1")
        self.assertEqual(result, 0)
        self.assertEqual(output, '{\n  "apple": 2\n}\n')

    def test_invalid_filter_values_exit_two_with_clear_message(self):
        for option, value in (("--rare", "0"), ("--rare", "nope"), ("--top", "-1"), ("--top", "2.5")):
            with self.subTest(option=option, value=value):
                stderr = io.StringIO()
                with contextlib.redirect_stderr(stderr):
                    with self.assertRaises(SystemExit) as raised:
                        self.run_cli(option, value)
                self.assertEqual(raised.exception.code, 2)
                self.assertIn("must be a positive integer", stderr.getvalue())


if __name__ == "__main__":
    unittest.main()
