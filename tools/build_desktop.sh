#!/usr/bin/env bash
set -euo pipefail

# Ensure ~/.cargo/bin is in PATH if present
if [ -d "$HOME/.cargo/bin" ]; then
  export PATH="$HOME/.cargo/bin:$PATH"
fi

if ! command -v cargo &>/dev/null; then
  echo "Error: cargo not found in PATH. Install Rust via rustup (https://rustup.rs) or pacman -S rust" >&2
  exit 1
fi

echo "Building Edmark's Esoteric Fun Machine standalone desktop release..."
cargo build --release --manifest-path src-tauri/Cargo.toml

BINARY="src-tauri/target/release/esoteric-fun-machine"
if [ -f "$BINARY" ]; then
  SIZE=$(du -h "$BINARY" | cut -f1)
  echo "✦ Standalone desktop binary built successfully: $BINARY ($SIZE)"
  echo "  Launch with: ./$BINARY"
fi
