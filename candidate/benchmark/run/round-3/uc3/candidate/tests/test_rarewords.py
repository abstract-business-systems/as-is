"""Focused unit tests for wordstats.rarewords and the count --rare option."""

import contextlib
import io
import json
import os
import tempfile
import unittest

from wordstats.cli import main
from wordstats.rarewords import keep_rare_words


class KeepRareWordsTests(unittest.TestCase):
    def test_keeps_only_entries_within_n(self):
        self.assertEqual(keep_rare_words({"the": 3, "fox": 2, "dog": 1}, 2), {"fox": 2, "dog": 1})

    def test_preserves_key_order_and_does_not_mutate_input(self):
        counts = {"the": 3, "fox": 2, "dog": 1}
        result = keep_rare_words(counts, 3)
        self.assertEqual(list(result), ["the", "fox", "dog"])
        self.assertEqual(counts, {"the": 3, "fox": 2, "dog": 1})

    def test_boundary_n_equals_count_is_kept(self):
        self.assertEqual(keep_rare_words({"a": 1}, 1), {"a": 1})

    def test_empty_mapping(self):
        self.assertEqual(keep_rare_words({}, 5), {})


class CountRareOptionTests(unittest.TestCase):
    def setUp(self):
        fd, self.path = tempfile.mkstemp(suffix=".txt")
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            handle.write("the quick fox the lazy dog the fox\n")
        self._tempdir = None

    def tearDown(self):
        os.unlink(self.path)

    def test_without_rare_reports_all_counts(self):
        stdout = io.StringIO()
        with contextlib.redirect_stdout(stdout):
            self.assertEqual(main(["count", self.path]), 0)
        self.assertEqual(json.loads(stdout.getvalue()),
                         {"the": 3, "fox": 2, "quick": 1, "lazy": 1, "dog": 1})

    def test_rare_keeps_only_words_within_n(self):
        stdout = io.StringIO()
        with contextlib.redirect_stdout(stdout):
            self.assertEqual(main(["count", self.path, "--rare", "2"]), 0)
        self.assertEqual(json.loads(stdout.getvalue()),
                         {"fox": 2, "quick": 1, "lazy": 1, "dog": 1})

    def test_rare_one_keeps_only_singletons(self):
        stdout = io.StringIO()
        with contextlib.redirect_stdout(stdout):
            self.assertEqual(main(["count", self.path, "--rare", "1"]), 0)
        self.assertEqual(json.loads(stdout.getvalue()),
                         {"quick": 1, "lazy": 1, "dog": 1})

    def test_rejects_zero(self):
        stderr = io.StringIO()
        with contextlib.redirect_stderr(stderr), self.assertRaises(SystemExit) as ctx:
            main(["count", self.path, "--rare", "0"])
        self.assertEqual(ctx.exception.code, 2)
        self.assertIn("positive integer", stderr.getvalue())

    def test_rejects_negative(self):
        stderr = io.StringIO()
        with contextlib.redirect_stderr(stderr), self.assertRaises(SystemExit) as ctxmgr:
            main(["count", self.path, "--rare", "-3"])
        self.assertEqual(ctxmgr.exception.code, 2)
        self.assertIn("positive integer", stderr.getvalue())

    def test_rejects_non_integer(self):
        stderr = io.StringIO()
        with contextlib.redirect_stderr(stderr), self.assertRaises(SystemExit) as ctxmgr:
            main(["count", self.path, "--rare", "abc"])
        self.assertEqual(ctxmgr.exception.code, 2)
        self.assertIn("positive integer", stderr.getvalue())


if __name__ == "__main__":
    unittest.main()