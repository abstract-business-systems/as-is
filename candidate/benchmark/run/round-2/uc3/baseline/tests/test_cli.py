"""Focused unit tests for the wordstats.cli count command."""

import io
import os
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout

from wordstats.cli import main


def run_main(argv):
    out, err = io.StringIO(), io.StringIO()
    with redirect_stdout(out), redirect_stderr(err):
        code = main(argv)
    return out.getvalue(), err.getvalue()


class CountCommandTests(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.mkdtemp()
        self.path = os.path.join(self.dir, "words.txt")
        with open(self.path, "w", encoding="utf-8") as handle:
            handle.write("apple banana apple\nbanana cherry\n")

    def test_default_output_unchanged(self):
        out, err = run_main(["count", self.path])
        self.assertEqual(
            out,
            '{\n  "apple": 2,\n  "banana": 2,\n  "cherry": 1\n}\n',
        )

    def test_min_count_filters_output(self):
        out, err = run_main(["count", self.path, "--min-count", "2"])
        self.assertEqual(out, '{\n  "apple": 2,\n  "banana": 2\n}\n')

    def test_min_count_one_keeps_all(self):
        out, err = run_main(["count", self.path, "--min-count", "1"])
        self.assertEqual(
            out,
            '{\n  "apple": 2,\n  "banana": 2,\n  "cherry": 1\n}\n',
        )

    def test_min_count_above_max_omits_all(self):
        out, err = run_main(["count", self.path, "--min-count", "5"])
        self.assertEqual(out, "{}\n")

    def assert_rejected(self, value):
        with self.assertRaises(SystemExit) as ctx:
            run_main(["count", self.path, "--min-count", value])
        self.assertEqual(ctx.exception.code, 2)

    def test_rejects_zero(self):
        self.assert_rejected("0")

    def test_rejects_negative(self):
        self.assert_rejected("-1")

    def test_rejects_non_integer(self):
        self.assert_rejected("1.5")
        self.assert_rejected("abc")

    def test_rejection_message_is_clear(self):
        out, err = io.StringIO(), io.StringIO()
        with redirect_stdout(out), redirect_stderr(err):
            with self.assertRaises(SystemExit):
                main(["count", self.path, "--min-count", "0"])
        self.assertIn("--min-count must be a positive integer", err.getvalue())


if __name__ == "__main__":
    unittest.main()
