"""Focused unit tests for the wordstats count CLI filter options."""

import contextlib
import io
import json
import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from wordstats.cli import main  # noqa: E402

SAMPLE = "the quick fox the lazy dog the fox apple banana\n"


class CountCliFilterTests(unittest.TestCase):
    def setUp(self):
        self.previous_cwd = os.getcwd()
        self.tmp = tempfile.TemporaryDirectory()
        os.chdir(self.tmp.name)
        with open("sample.txt", "w", encoding="utf-8") as handle:
            handle.write(SAMPLE)

    def tearDown(self):
        os.chdir(self.previous_cwd)
        self.tmp.cleanup()

    def run_main(self, argv):
        """Run main(argv), returning (exit code, stderr, parsed stdout JSON)."""
        out, err = io.StringIO(), io.StringIO()
        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
            code = main(["count", *argv])
        parsed = json.loads(out.getvalue()) if code == 0 else None
        return code, err.getvalue(), parsed

    def test_rare_keeps_words_with_n_or_fewer_occurrences(self):
        code, err, parsed = self.run_main(["sample.txt", "--rare", "1"])
        self.assertEqual(code, 0)
        self.assertEqual(err, "")
        self.assertEqual(parsed, {"apple": 1, "banana": 1, "dog": 1, "lazy": 1, "quick": 1})

    def test_rare_boundary_keeps_exactly_n(self):
        code, _, parsed = self.run_main(["sample.txt", "--rare", "2"])
        self.assertEqual(code, 0)
        self.assertIn("fox", parsed)

    def test_top_keeps_n_most_frequent(self):
        code, err, parsed = self.run_main(["sample.txt", "--top", "2"])
        self.assertEqual(code, 0)
        self.assertEqual(err, "")
        self.assertEqual(parsed, {"fox": 2, "the": 3})

    def test_top_ties_broken_alphabetically(self):
        with open("ties.txt", "w", encoding="utf-8") as handle:
            handle.write("pear pear apple apple fig\n")
        code, _, parsed = self.run_main(["ties.txt", "--top", "1"])
        self.assertEqual(code, 0)
        self.assertEqual(parsed, {"apple": 2})

    def test_rare_then_top_compose(self):
        code, _, parsed = self.run_main(["sample.txt", "--rare", "1", "--top", "1"])
        self.assertEqual(code, 0)
        self.assertEqual(parsed, {"apple": 1})

    def test_rare_zero_exits_2_with_message(self):
        code, err, _ = self.run_main(["sample.txt", "--rare", "0"])
        self.assertEqual(code, 2)
        self.assertIn("positive integer", err)

    def test_top_negative_exits_2_with_message(self):
        code, err, _ = self.run_main(["sample.txt", "--top", "-3"])
        self.assertEqual(code, 2)
        self.assertIn("positive integer", err)

    def test_top_zero_exits_2_with_message(self):
        code, err, _ = self.run_main(["sample.txt", "--top", "0"])
        self.assertEqual(code, 2)
        self.assertIn("positive integer", err)

    def test_rare_non_integer_exits_2(self):
        with self.assertRaises(SystemExit) as ctx:
            main(["count", "sample.txt", "--rare", "lots"])
        self.assertEqual(ctx.exception.code, 2)

    def test_top_non_integer_exits_2(self):
        with self.assertRaises(SystemExit) as ctx:
            main(["count", "sample.txt", "--top", "1.5"])
        self.assertEqual(ctx.exception.code, 2)


if __name__ == "__main__":
    unittest.main()