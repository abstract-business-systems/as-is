"""Focused tests for the wordstats command-line interface."""

import io
import json
import os
import tempfile
import unittest
from unittest.mock import patch

from wordstats.cli import main


class CountCliTests(unittest.TestCase):
    def test_stats_option_appends_summary_object(self):
        with tempfile.NamedTemporaryFile(
            "w", encoding="utf-8", delete=False
        ) as handle:
            handle.write("apple banana apple cherry cherry cherry")
            path = handle.name

        try:
            output = io.StringIO()
            with patch("sys.stdout", output):
                self.assertEqual(main(["count", path, "--stats"]), 0)
        finally:
            os.unlink(path)

        payload = json.loads(output.getvalue())
        self.assertEqual(payload["apple"], 2)
        self.assertEqual(
            payload["stats"], {"min": 1, "max": 3, "median": 2, "unique": 3}
        )


if __name__ == "__main__":
    unittest.main()
