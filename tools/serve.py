#!/usr/bin/env python3
"""Serve the repository for local development with revalidated caching (D-035).

`python3 -m http.server` sends Last-Modified without Cache-Control, so browsers
may heuristically reuse an old module next to a fresh one. This server adds
`Cache-Control: no-cache`: the browser may keep copies but must revalidate each
one, so every load sees the files on disk. Standard library only.

    python3 tools/serve.py            # http://127.0.0.1:8000
    python3 tools/serve.py 8080 --bind 0.0.0.0
"""

import argparse
import functools
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class RevalidatingHandler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, ".mjs": "text/javascript"}

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("port", nargs="?", type=int, default=8000)
    parser.add_argument("--bind", default="127.0.0.1", help="address to listen on (default: 127.0.0.1)")
    args = parser.parse_args()
    handler = functools.partial(RevalidatingHandler, directory=str(ROOT))
    with ThreadingHTTPServer((args.bind, args.port), handler) as server:
        print(f"Serving {ROOT} at http://{args.bind}:{args.port}/ with Cache-Control: no-cache")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
