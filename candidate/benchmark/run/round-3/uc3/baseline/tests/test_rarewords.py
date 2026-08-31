"""Focused unit tests for the --rare option and rare-word filtering."""

import contextlib
import io
import json
import os
import tempfile
import unittest

from wordstats.cli import main
from wordstats.rarewords import filter_rare


class FilterRareTests(unittest.TestCase):
    def test_keeps_words_at_or_below_threshold(self):
        self.assertEqual(filter_rare({"a": 3, "b": 1, "c": 2}, 2), {"b": 1, "c": 2})

    def test_threshold_is_inclusive(self):
        self.assertEqual(filter_rare({"a": 1}, 1), {"a": 1})
        self.assertEqual(filter_rare({"a": 2}, 1), {})

    def test_returns_new_mapping_without_mutation(self):
        counts = {"a": 1, "b": 5}
        snapshot = dict(counts)
        result = filter_rare(counts, 10)
        self.assertEqual(counts, snapshot)
        self.assertIsNot(result, counts)


class RareOptionTests(unittest.TestCase):
    def write_text(self, text):
        handle = tempfile.NamedTemporaryFile(
            "w", suffix=".txt", delete=False, encoding="utf-8"
        )
        self.addCleanup(os.unlink, handle.name)
        handle.write(text)
        handle.close()
        return handle.name

    def run_main(self, argv):
        stdout = io.StringIO()
        with contextlib.redirect_stdout(stdout):
            main(argv)
        return stdout.getvalue()

    def test_rare_option_filters_cli_output(self):
        path = self.write_text("apple banana apple banana cherry\n")
        output = self.run_main(["count", "--rare", "1", path])
        self.assertEqual(json.loads(output), {"cherry": 1})

    def test_rare_option_preserves_sorted_json_format(self):
        path = self.write_text("pear pear ant\n")
        output = self.run_main(["count", "--rare", "2", path])
        self.assertEqual(output, '{\n  "ant": 1,\n  "pear": 2\n}\n')

    def test_rejects_zero_negative_and_non_integer(self):
        path = self.write_text("apple apple\n")
        for bad in ("0", "-1", "two"):
            with self.subTest(bad=bad):
                stderr = io.StringIO()
                with contextlib.redirect_stderr(stderr):
                    with self.assertRaises(SystemExit) as raised:
                        main(["count", "--rare", bad, path])
                self.assertEqual(raised.exception.code, 2)
                self.assertIn("positive integer", stderr.getvalue())


if __name__ == "__main__":
    unittest.main()