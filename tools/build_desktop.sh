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

VERSION=$(grep -m1 '^version =' ../src-tauri/Cargo.toml | cut -d '"' -f2)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Building The Whimsy Machine v${VERSION} standalone desktop release..."
node tools/stage_tauri_dist.mjs
cargo build --release --manifest-path src-tauri/Cargo.toml

BINARY="src-tauri/target/release/whimsy-machine"
if [ ! -f "$BINARY" ]; then
  echo "Error: expected binary not found at $BINARY" >&2
  exit 1
fi

SIZE=$(du -h "$BINARY" | cut -f1)
echo "✦ Standalone desktop binary built successfully: $BINARY ($SIZE)"

# Stage portable Linux standalone bundle in dist-desktop/
DIST_DIR="dist-desktop"
PKG_NAME="whimsy-machine-v${VERSION}-linux-x86_64"
STAGE_DIR="${DIST_DIR}/${PKG_NAME}"

echo "Packaging portable Linux release into ${DIST_DIR}/${PKG_NAME}.tar.gz..."
rm -rf "$STAGE_DIR" "${STAGE_DIR}.tar.gz"
mkdir -p "$STAGE_DIR"

cp "$BINARY" "${STAGE_DIR}/whimsy-machine"
chmod +x "${STAGE_DIR}/whimsy-machine"
cp "src-tauri/icons/icon.png" "${STAGE_DIR}/whimsy-machine.png"

cat << 'EOF' > "${STAGE_DIR}/whimsy-machine.desktop"
[Desktop Entry]
Name=The Whimsy Machine
GenericName=The Whimsy Machine
Comment=Deterministic audiovisual omen synthesizer & esoteric play-along organ
Exec=whimsy-machine
Icon=whimsy-machine
Terminal=false
Type=Application
Categories=AudioVideo;Audio;Midi;Music;
Keywords=synthesizer;organ;omen;esoteric;tauri;whimsy;
StartupWMClass=whimsy-machine
EOF

cat << 'EOF' > "${STAGE_DIR}/install.sh"
#!/usr/bin/env bash
set -euo pipefail

DEST_BIN="${HOME}/.local/bin"
DEST_APPS="${HOME}/.local/share/applications"
DEST_ICONS="${HOME}/.local/share/icons/hicolor/512x512/apps"

mkdir -p "$DEST_BIN" "$DEST_APPS" "$DEST_ICONS"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
install -m 755 "${SCRIPT_DIR}/whimsy-machine" "${DEST_BIN}/whimsy-machine"
install -m 644 "${SCRIPT_DIR}/whimsy-machine.png" "${DEST_ICONS}/whimsy-machine.png"
install -m 644 "${SCRIPT_DIR}/whimsy-machine.desktop" "${DEST_APPS}/whimsy-machine.desktop"

# Clean up legacy desktop entry if present
rm -f "${DEST_APPS}/esoteric-fun-machine.desktop" "${DEST_BIN}/esoteric-fun-machine"

echo "✦ Installed The Whimsy Machine to ${DEST_BIN}/whimsy-machine"
echo "  Desktop entry and icon registered. You can now launch it from your application menu!"
EOF
chmod +x "${STAGE_DIR}/install.sh"

cat << EOF > "${STAGE_DIR}/README.txt"
The Whimsy Machine v${VERSION}
Standalone Studio Companion (Linux x86_64)

RUN DIRECTLY:
  ./whimsy-machine

INSTALL TO USER MENU (~/.local):
  ./install.sh

REQUIREMENTS:
  - Linux x86_64
  - WebKitGTK 4.1 (libwebkit2gtk-4.1)
  - ALSA / PipeWire for audio and MIDI
EOF

(cd "$DIST_DIR" && tar -czf "${PKG_NAME}.tar.gz" "$PKG_NAME")
rm -rf "$STAGE_DIR"
TAR_SIZE=$(du -h "${DIST_DIR}/${PKG_NAME}.tar.gz" | cut -f1)
echo "✦ Portable Linux bundle created: ${DIST_DIR}/${PKG_NAME}.tar.gz ($TAR_SIZE)"

# If --bundle flag is provided, run tauri bundler for .deb, .rpm, .AppImage
if [[ "${1:-}" == "--bundle" ]]; then
  echo "Generating platform installer packages (.deb, .rpm, .AppImage)..."
  npx -y @tauri-apps/cli build
  echo "✦ Bundles created in src-tauri/target/release/bundle/"
fi

echo "Done! Launch with: ./$BINARY"
