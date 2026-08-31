"""Focused unit tests for the wordstats CLI `count --min-count` option."""

import contextlib
import io
import json
import os
import tempfile
import unittest

from wordstats.cli import main


class CountMinCountTests(unittest.TestCase):
    def setUp(self):
        self.tmpdir = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmpdir.cleanup)
        self.path = os.path.join(self.tmpdir.name, "words.txt")
        with open(self.path, "w", encoding="utf-8") as handle:
            handle.write("apple apple banana banana banana cherry\n")

    def run_main(self, *argv):
        stdout = io.StringIO()
        with contextlib.redirect_stdout(stdout):
            code = main(list(argv))
        return code, json.loads(stdout.getvalue())

    def test_without_option_output_is_unchanged(self):
        code, counts = self.run_main("count", self.path)
        self.assertEqual(code, 0)
        self.assertEqual(counts, {"apple": 2, "banana": 3, "cherry": 1})

    def test_min_count_omits_less_frequent_words(self):
        code, counts = self.run_main("count", self.path, "--min-count", "2")
        self.assertEqual(code, 0)
        self.assertEqual(counts, {"apple": 2, "banana": 3})

    def test_min_count_keeps_exact_threshold(self):
        code, counts = self.run_main("count", self.path, "--min-count", "3")
        self.assertEqual(code, 0)
        self.assertEqual(counts, {"banana": 3})

    def assert_exit_2(self, *argv, message_fragment="positive integer"):
        stderr = io.StringIO()
        with contextlib.redirect_stderr(stderr), self.assertRaises(SystemExit) as ctx:
            self.run_main(*argv)
        self.assertEqual(ctx.exception.code, 2)
        self.assertIn(message_fragment, stderr.getvalue())
        return stderr.getvalue()

    def test_rejects_zero(self):
        self.assert_exit_2("count", self.path, "--min-count", "0")

    def test_rejects_negative(self):
        self.assert_exit_2("count", self.path, "--min-count", "-1")

    def test_rejects_non_integer(self):
        # argparse rejects the non-integer value itself with exit 2 and a
        # clear message; the positive-integer wording applies to valid ints.
        self.assert_exit_2(
            "count", self.path, "--min-count", "abc",
            message_fragment="invalid int value",
        )


if __name__ == "__main__":
    unittest.main()