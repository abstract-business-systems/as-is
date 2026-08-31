"""Focused unit tests for the wordstats CLI `--rare` option."""

import io
import json
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout

from wordstats.cli import main


class RareOptionTests(unittest.TestCase):
    def write_sample(self):
        handle = tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False, encoding="utf-8")
        handle.write("apple banana apple banana banana pear")
        handle.close()
        self.addCleanup(lambda: __import__("os").unlink(handle.name))
        return handle.name

    def run_cli(self, argv):
        out, err = io.StringIO(), io.StringIO()
        with redirect_stdout(out), redirect_stderr(err):
            code = None
            try:
                code = __import__("wordstats.cli", fromlist=["main"]).main(argv)
            except SystemExit as exit_error:
                code = exit_error.code
        return code, out.getvalue(), err.getvalue()

    def test_rare_filters_output(self):
        code, out, _ = self.run_cli(["count", "--rare", "2", self.write_sample()])
        self.assertEqual(code, 0)
        self.assertEqual(json.loads(out), {"apple": 2, "pear": 1})

    def test_rare_preserves_sorted_two_space_indent_format(self):
        _, out, _ = self.run_cli(["count", "--rare", "3", self.write_sample()])
        self.assertEqual(out, json.dumps({"apple": 2, "banana": 3, "pear": 1}, indent=2, sort_keys=True) + "\n")

    def test_rare_one_keeps_only_singletons(self):
        code, out, _ = self.run_cli(["count", "--rare", "1", self.write_sample()])
        self.assertEqual(code, 0)
        self.assertEqual(json.loads(out), {"pear": 1})

    def test_rare_non_integer_rejected_with_exit_2(self):
        code, out, err = self.run_cli(["count", "--rare", "abc", self.write_sample()])
        self.assertEqual(code, 2)
        self.assertEqual(out, "")
        self.assertIn("invalid int value", err)

    def test_rare_zero_rejected_with_clear_message_and_exit_2(self):
        code, out, err = self.run_cli(["count", "--rare", "0", self.write_sample()])
        self.assertEqual(code, 2)
        self.assertEqual(out, "")
        self.assertIn("--rare must be a positive integer", err)

    def test_rare_negative_rejected_with_clear_message_and_exit_2(self):
        code, out, err = self.run_cli(["count", "--rare", "-3", self.write_sample()])
        self.assertEqual(code, 2)
        self.assertEqual(out, "")
        self.assertIn("--rare must be a positive integer", err)


if __name__ == "__main__":
    unittest.main()