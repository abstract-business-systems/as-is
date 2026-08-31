"""Command-line interface for wordstats."""

import argparse
import json
import sys

from wordstats.counter import count_words
from wordstats.rarewords import select_rare
from wordstats.topwords import select_top


def main(argv=None):
    parser = argparse.ArgumentParser(prog="wordstats")
    sub = parser.add_subparsers(dest="command", required=True)
    count = sub.add_parser("count", help="count words in a text file")
    count.add_argument("path", help="path to a UTF-8 text file")
    count.add_argument("--rare", type=int, default=None, metavar="N",
                       help="keep only words with N or fewer occurrences")
    count.add_argument("--top", type=int, default=None, metavar="N",
                       help="keep only the N most frequent words (ties broken alphabetically)")
    args = parser.parse_args(argv)

    with open(args.path, encoding="utf-8") as handle:
        counts = count_words(handle.read())
    try:
        if args.rare is not None:
            counts = select_rare(counts, args.rare)
        if args.top is not None:
            counts = select_top(counts, args.top)
    except ValueError as exc:
        print(f"wordstats: error: {exc}", file=sys.stderr)
        return 2
    print(json.dumps(counts, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    sys.exit(main())
