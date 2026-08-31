"""Focused unit tests for the wordstats count CLI --min-count option."""

import json
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from io import StringIO

from wordstats.cli import main


def run_cli(argv):
    """Run cli.main and return (exit-code-or-None, stdout, stderr)."""
    out, err = StringIO(), StringIO()
    try:
        with redirect_stdout(out), redirect_stderr(err):
            code = main(argv)
    except SystemExit as exit_error:
        return exit_error.code, out.getvalue(), err.getvalue()
    return code, out.getvalue(), err.getvalue()


class MinCountOptionTests(unittest.TestCase):
    def write_words(self, text):
        handle = tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False)
        handle.write(text)
        handle.close()
        self.addCleanup(handle.close)
        return handle.name

    def test_min_count_filters_output(self):
        path = self.write_words("a a a b b c\n")
        code, out, _ = run_cli(["count", path, "--min-count", "2"])
        self.assertEqual(code, 0)
        self.assertEqual(json.loads(out), {"a": 3, "b": 2})

    def test_min_count_keeps_words_at_threshold(self):
        path = self.write_words("a a b\n")
        code, out, _ = run_cli(["count", path, "--min-count", "2"])
        self.assertEqual(code, 0)
        self.assertEqual(json.loads(out), {"a": 2})

    def test_default_output_unchanged_without_option(self):
        path = self.write_words("a a b\n")
        code, out, _ = run_cli(["count", path])
        self.assertEqual(code, 0)
        self.assertEqual(json.loads(out), {"a": 2, "b": 1})

    def test_rejects_zero(self):
        path = self.write_words("a\n")
        code, _, err = run_cli(["count", path, "--min-count", "0"])
        self.assertEqual(code, 2)
        self.assertIn("--min-count", err)
        self.assertIn("positive integer", err)

    def test_rejects_negative(self):
        path = self.write_words("a\n")
        code, _, err = run_cli(["count", path, "--min-count", "-3"])
        self.assertEqual(code, 2)
        self.assertIn("positive integer", err)

    def test_rejects_non_integer(self):
        path = self.write_words("a\n")
        code, _, err = run_cli(["count", path, "--min-count", "abc"])
        self.assertEqual(code, 2)
        self.assertIn("positive integer", err)


if __name__ == "__main__":
    unittest.main()