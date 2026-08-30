"""Focused unit tests for wordstats.counter and the count CLI."""

import contextlib
import io
import json
import os
import sys
import tempfile
import unittest

from wordstats.counter import count_words, top_words
import wordstats.cli as cli


class CountWordsTests(unittest.TestCase):
    def test_counts_basic_words(self):
        self.assertEqual(count_words("apple banana apple"), {"apple": 2, "banana": 1})

    def test_strips_punctuation_and_lowercases(self):
        self.assertEqual(count_words("Apple! apple, BANANA."), {"apple": 2, "banana": 1})

    def test_ignores_punctuation_only_tokens(self):
        self.assertEqual(count_words("-- ..."), {})

    def test_empty_input(self):
        self.assertEqual(count_words(""), {})


class TopWordsTests(unittest.TestCase):
    def test_returns_most_frequent(self):
        counts = {"apple": 2, "banana": 1, "cherry": 5}
        self.assertEqual(top_words(counts, 2), {"cherry": 5, "apple": 2})

    def test_ties_break_alphabetically(self):
        counts = {"zebra": 2, "apple": 2, "mango": 1}
        self.assertEqual(top_words(counts, 2), {"apple": 2, "zebra": 2})

    def test_n_larger_than_distinct_words(self):
        counts = {"apple": 2, "banana": 1}
        self.assertEqual(top_words(counts, 10), {"apple": 2, "banana": 1})

    def test_rejects_zero_and_negative(self):
        for bad in (0, -1):
            with self.assertRaisesRegex(ValueError, "positive integer"):
                top_words({"apple": 1}, bad)


class CountCliTests(unittest.TestCase):
    def write_temp(self, text):
        handle = tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False)
        self.addCleanup(os.unlink, handle.name)
        handle.write(text)
        handle.close()
        return handle.name

    def run_cli(self, text, argv):
        path = self.write_temp(text)
        stdout, stderr = io.StringIO(), io.StringIO()
        with contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
            code = cli.main(["count", path] + argv)
        return code, stdout.getvalue(), stderr.getvalue()

    def test_top_prints_sorted_top_n_json(self):
        code, out, _ = self.run_cli("b b b a a c\n", ["--top", "2"])
        self.assertEqual(code, 0)
        self.assertEqual(json.loads(out), {"b": 3, "a": 2})
        self.assertEqual(list(json.loads(out)), ["a", "b"])  # keys sorted alphabetically

    def test_default_output_unchanged(self):
        code, out, _ = self.run_cli("b b a\n", [])
        self.assertEqual(code, 0)
        self.assertEqual(json.loads(out), {"a": 1, "b": 2})

    def test_rejects_nonpositive_top(self):
        path = self.write_temp("a\n")
        for bad in ("0", "-1"):
            stderr = io.StringIO()
            with contextlib.redirect_stderr(stderr):
                with self.assertRaises(SystemExit) as caught:
                    cli.main(["count", path, "--top", bad])
            self.assertEqual(caught.exception.code, 2)
            self.assertIn("--top must be a positive integer", stderr.getvalue())

    def test_rejects_non_integer_top(self):
        path = self.write_temp("a\n")
        with self.assertRaises(SystemExit) as caught:
            self.run_cli("a\n", ["--top", "abc"])
        self.assertEqual(caught.exception.code, 2)


if __name__ == "__main__":
    unittest.main()
