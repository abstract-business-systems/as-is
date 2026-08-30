"""Command-line interface for wordstats."""

import argparse
import json
import sys

from wordstats.counter import count_words, most_frequent


def positive_int(value):
    """Argparse type: accept only positive integers for ``--top``."""
    try:
        number = int(value)
    except ValueError:
        raise argparse.ArgumentTypeError(f"--top expects a positive integer, got {value!r}")
    if number <= 0:
        raise argparse.ArgumentTypeError(f"--top must be a positive integer, got {number}")
    return number


def main(argv=None):
    parser = argparse.ArgumentParser(prog="wordstats")
    sub = parser.add_subparsers(dest="command", required=True)
    count = sub.add_parser("count", help="count words in a text file")
    count.add_argument("path", help="path to a UTF-8 text file")
    count.add_argument(
        "--top",
        type=positive_int,
        metavar="N",
        help="print only the N most frequent words (ties broken alphabetically)",
    )
    args = parser.parse_args(argv)

    with open(args.path, encoding="utf-8") as handle:
        counts = count_words(handle.read())
    if args.top is not None:
        counts = most_frequent(counts, args.top)
    print(json.dumps(counts, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    sys.exit(main())
