#!/usr/bin/env python3
"""Stage a production-ready Neocities deployment bundle.

Copies index.html, styles.css, manual.html, and src/ into dist-neocities/.
Creates .txt copies of esoteric spell files (oracle.lol.txt, beat.mal.txt, etc.)
so that free Neocities accounts (which whitelist file extensions) as well as
Supporter accounts can host Edmark's Esoteric Fun Machine without upload errors.

Usage:
    python3 tools/stage_neocities.py
"""

import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist-neocities"

ESOTERIC_FILES = [
    "oracle.lol",
    "beat.mal",
    "bass.bf",
    "harmony.bfg",
    "pad.piet",
    "chimes.frac",
    "chant.spl",
    "conductor.i",
    "rulebooks.ni",
]


def main():
    print(f"✦ Staging Neocities bundle in {DIST.relative_to(ROOT)}/...")

    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir(parents=True, exist_ok=True)

    # Copy top-level static web shell
    for name in ["index.html", "styles.css", "manual.html"]:
        src_file = ROOT / name
        if src_file.exists():
            shutil.copy2(src_file, DIST / name)

    # Copy src/ tree
    src_dist = DIST / "src"
    shutil.copytree(ROOT / "src", src_dist)

    # Create .txt dual-fallbacks for esoteric source scripts (Neocities whitelist compatibility)
    txt_fallbacks = 0
    for name in ESOTERIC_FILES:
        target = src_dist / name
        if target.exists():
            shutil.copy2(target, src_dist / f"{name}.txt")
            txt_fallbacks += 1

    file_count = sum(1 for _ in DIST.rglob("*") if _.is_file())
    total_size = sum(_.stat().st_size for _ in DIST.rglob("*") if _.is_file())

    print(f"✔ Staging complete: {file_count} files ({total_size / 1024:.1f} KB)")
    print(f"  Added {txt_fallbacks} .txt fallbacks for Neocities free-tier extension whitelisting.")
    print("\nHow to deploy to Neocities:")
    print("  Option A (Web UI): Drag the contents of dist-neocities/ into your https://neocities.org dashboard.")
    print("  Option B (CLI):    neocities push dist-neocities/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
