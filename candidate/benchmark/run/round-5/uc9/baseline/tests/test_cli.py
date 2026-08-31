"""Focused CLI tests for the --rare and --top count options."""

import contextlib
import io
import json
import os
import tempfile
import unittest

from wordstats.cli import main


def run_cli(argv):
    """Run the CLI in-process, returning (exit-code-or-None, stdout text)."""
    stdout = io.StringIO()
    try:
        with contextlib.redirect_stdout(stdout):
            code = main(argv)
        return code, stdout.getvalue()
    except SystemExit as exit_error:
        return exit_error.code, stdout.getvalue()


def write_words(test, text):
    handle = tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False, encoding="utf-8")
    handle.write(text)
    handle.close()
    test.addCleanup(os.unlink, handle.name)
    return handle.name


class RareOptionTests(unittest.TestCase):
    def setUp(self):
        self.path = write_words(self, "apple apple banana banana banana cherry\n")

    def test_rare_keeps_words_at_or_under_n(self):
        code, out = run_cli(["count", self.path, "--rare", "2"])
        self.assertEqual(code, 0)
        self.assertEqual(json.loads(out), {"apple": 2, "cherry": 1})

    def test_rare_one_keeps_only_singletons(self):
        code, out = run_cli(["count", self.path, "--rare", "1"])
        self.assertEqual(code, 0)
        self.assertEqual(json.loads(out), {"cherry": 1})


class TopOptionTests(unittest.TestCase):
    def setUp(self):
        self.path = write_words(self, "apple apple banana banana banana cherry\n")

    def test_top_keeps_n_most_frequent(self):
        code, out = run_cli(["count", self.path, "--top", "1"])
        self.assertEqual(code, 0)
        self.assertEqual(json.loads(out), {"banana": 3})

    def test_top_ties_broken_alphabetically(self):
        path = write_words(self, "zeta zeta alpha alpha beta\n")
        code, out = run_cli(["count", path, "--top", "2"])
        self.assertEqual(code, 0)
        self.assertEqual(json.loads(out), {"alpha": 2, "zeta": 2})


class RejectionTests(unittest.TestCase):
    """Both options must exit 2 with a clear message for invalid N."""

    def setUp(self):
        self.path = write_words(self, "apple\n")
        self.stderr = io.StringIO()

    def assert_exits_2_with_message(self, argv):
        with contextlib.redirect_stderr(self.stderr):
            code, _ = run_cli(argv)
        self.assertEqual(code, 2)
        self.assertIn("positive integer", self.stderr.getvalue())

    def test_rare_rejects_zero(self):
        self.assert_exits_2_with_message(["count", self.path, "--rare", "0"])

    def test_rare_rejects_negative(self):
        self.assert_exits_2_with_message(["count", self.path, "--rare", "-3"])

    def test_rare_rejects_non_integer(self):
        self.assert_exits_2_with_message(["count", self.path, "--rare", "abc"])

    def test_top_rejects_zero(self):
        self.assert_exits_2_with_message(["count", self.path, "--top", "0"])

    def test_top_rejects_negative(self):
        self.assert_exits_2_with_message(["count", self.path, "--top", "-1"])

    def test_top_rejects_non_integer(self):
        self.assert_exits_2_with_message(["count", self.path, "--top", "1.5"])


if __name__ == "__main__":
    unittest.main()