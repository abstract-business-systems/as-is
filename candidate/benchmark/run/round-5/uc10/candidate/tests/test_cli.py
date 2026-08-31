"""Focused unit tests for the wordstats count CLI --stats option."""

import json
import tempfile
import unittest
from contextlib import redirect_stdout
from io import StringIO

from wordstats.cli import main


def run_cli(argv):
    """Run cli.main and return (exit-code-or-None, stdout)."""
    out = StringIO()
    try:
        with redirect_stdout(out):
            code = main(argv)
    except SystemExit as exit_error:
        return exit_error.code, out.getvalue()
    return code, out.getvalue()


class StatsOptionTests(unittest.TestCase):
    def write_words(self, text):
        handle = tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False)
        handle.write(text)
        handle.close()
        self.addCleanup(handle.close)
        return handle.name

    def test_stats_appends_summary_object(self):
        path = self.write_words("a a a b b c\n")
        code, out = run_cli(["count", path, "--stats"])
        self.assertEqual(code, 0)
        counts_doc, _, summary_doc = out.strip().partition("\n{")
        self.assertEqual(json.loads(counts_doc), {"a": 3, "b": 2, "c": 1})
        summary = json.loads("{" + summary_doc)
        self.assertEqual(summary, {"max": 3, "median": 2, "min": 1, "unique": 3})

    def test_default_output_unchanged_without_option(self):
        path = self.write_words("a a b\n")
        code, out = run_cli(["count", path])
        self.assertEqual(code, 0)
        self.assertEqual(json.loads(out), {"a": 2, "b": 1})
        self.assertNotIn("unique", out)

    def test_stats_on_empty_input(self):
        path = self.write_words("\n")
        code, out = run_cli(["count", path, "--stats"])
        self.assertEqual(code, 0)
        counts_doc, _, summary_doc = out.strip().partition("\n{")
        self.assertEqual(json.loads(counts_doc), {})
        summary = json.loads("{" + summary_doc)
        self.assertEqual(summary, {"max": None, "median": None, "min": None, "unique": 0})


if __name__ == "__main__":
    unittest.main()