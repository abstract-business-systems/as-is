"""Command-line interface for wordstats."""

import argparse
import json
import sys

from wordstats.counter import count_words
from wordstats.topwords import filter_min_counts


def main(argv=None):
    parser = argparse.ArgumentParser(prog="wordstats")
    sub = parser.add_subparsers(dest="command", required=True)
    count = sub.add_parser("count", help="count words in a text file")
    count.add_argument("path", help="path to a UTF-8 text file")
    count.add_argument(
        "--min-count",
        type=int,
        default=None,
        help="omit words with fewer than N occurrences",
    )
    args = parser.parse_args(argv)

    with open(args.path, encoding="utf-8") as handle:
        counts = count_words(handle.read())
    if args.min_count is not None:
        try:
            counts = filter_min_counts(counts, args.min_count)
        except ValueError as error:
            parser.error(str(error))
    print(json.dumps(counts, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    sys.exit(main())
