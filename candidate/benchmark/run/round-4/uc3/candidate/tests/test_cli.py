"""Focused unit tests for the wordstats.cli `--rare N` option."""

import io
import json
import os
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout

from wordstats.cli import main


class RareOptionTests(unittest.TestCase):
    def setUp(self):
        fd, self.path = tempfile.mkstemp(suffix=".txt")
        os.close(fd)
        with open(self.path, "w", encoding="utf-8") as handle:
            handle.write("the the the fox fox dog\n")

    def tearDown(self):
        os.remove(self.path)

    def run_main(self, argv):
        stdout, stderr = io.StringIO(), io.StringIO()
        with redirect_stdout(stdout), redirect_stderr(stderr):
            code = main(["count", self.path] + argv)
        return code, stdout.getvalue(), stderr.getvalue()

    def test_without_rare_reports_all_words(self):
        code, out, _ = self.run_main([])
        self.assertEqual(code, 0)
        self.assertEqual(json.loads(out), {"the": 3, "fox": 2, "dog": 1})

    def test_rare_keeps_only_words_within_limit(self):
        code, out, _ = self.run_main(["--rare", "1"])
        self.assertEqual(code, 0)
        self.assertEqual(json.loads(out), {"dog": 1})

    def test_rare_boundary_keeps_count_equal_to_limit(self):
        code, out, _ = self.run_main(["--rare", "2"])
        self.assertEqual(code, 0)
        self.assertEqual(json.loads(out), {"fox": 2, "dog": 1})

    def capture_rejection(self, value):
        stderr = io.StringIO()
        with self.assertRaises(SystemExit) as caught:
            with redirect_stderr(stderr):
                main(["count", self.path, "--rare", value])
        self.assertEqual(caught.exception.code, 2)
        return stderr.getvalue()

    def test_rejects_zero(self):
        self.assertIn("positive integer", self.capture_rejection("0"))

    def test_rejects_negative(self):
        self.assertIn("positive integer", self.capture_rejection("-1"))

    def test_rejects_non_integer(self):
        self.assertIn("positive integer", self.capture_rejection("abc"))


if __name__ == "__main__":
    unittest.main()