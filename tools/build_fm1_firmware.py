#!/usr/bin/env python3
"""
tools/build_fm1_firmware.py
Builds the standalone M-VAVE FM-1 firmware container (.fwsc) for The Whimsy Machine.

Compiles the C reference engine (esoteric VMs, 44.1kHz stereo synth, 240x240 RGB565 TFT vitrine)
for the JieLi AC791N PI32v2 RISC core, links against the FM-1 engine runtime, and packages
into a valid UFW/JLFS ciphered firmware container (.fwsc) runnable in fm1-emu and real hardware.
"""

import argparse
import hashlib
import os
import re
import shutil
import struct
import subprocess
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
FIRMWARE_C_DIR = os.path.join(PROJECT_ROOT, "firmware-c")

DEFAULT_SDK = os.environ.get("FM1_SDK_DIR", "/tmp/fm1_open")
DEFAULT_TOOLCHAIN = os.environ.get("FM1_PI32_TOOLCHAIN", "/tmp/jieli/jieli-linux-toolchains-20260730.1/pi32v2")
DEFAULT_OUTPUT = os.path.join(FIRMWARE_C_DIR, "whimsy-machine.fwsc")

CRC_TABLE = []
for i in range(256):
    val = i << 8
    for _ in range(8):
        val = ((val << 1) ^ 0x1021) if (val & 0x8000) else (val << 1)
        val &= 0xffff
    CRC_TABLE.append(val)

def crc16(data, begin=0, length=None):
    if length is None:
        length = len(data) - begin
    val = 0
    for b in data[begin:begin+length]:
        val = ((val << 8) ^ CRC_TABLE[((val >> 8) ^ b) & 0xff]) & 0xffff
    return val

def cipher(data, begin=0, length=None, state=65535):
    if length is None:
        length = len(data) - begin
    for i in range(begin, begin + length):
        data[i] ^= (state & 0xff)
        state = ((state << 1) ^ (0x1021 if (state & 0x8000) else 0)) & 0xffff
    return state

def round_up(size, alignment):
    return (size + alignment - 1) & ~(alignment - 1)

class Image:
    def __init__(self, size, fill=0):
        self.bytes = bytearray([fill] * size)
    def number(self, offset, value, width):
        for n in range(width):
            self.bytes[offset + n] = (value >> (8 * n)) & 0xff
    def copy(self, offset, data):
        self.bytes[offset:offset+len(data)] = data
    def text(self, offset, s):
        data = s.encode('ascii')
        self.copy(offset, data)
    def checksum(self, field, offset, size):
        self.number(field, crc16(self.bytes, offset, size), 2)
    def record(self, offset, name, crc, address, size, attributes, last, extra=None):
        self.bytes[offset:offset+32] = b'\x00' * 32
        self.number(offset + 2, crc, 2)
        self.number(offset + 4, address, 4)
        self.number(offset + 8, size, 4)
        self.number(offset + 12, attributes, 2)
        self.number(offset + 14, last, 2)
        self.bytes[offset + 16:offset + 32] = b'\xff' * 16
        nb = name.encode('ascii')
        self.bytes[offset + 16:offset + 16 + len(nb)] = nb
        self.bytes[offset + 16 + len(nb)] = 0
        if extra is not None:
            self.number(offset + 28, extra, 4)
        self.checksum(offset, offset + 2, 30)

Area = 0x4000
EntryPoint = 0x02000120
AppData = 0x120
FlashLimit = 0xff000
UserSize = 536576
BtSize = 4096
MinimumVm = 32768
PublicCode = 0x980f

def read_res(directory, name, size):
    path = os.path.join(directory, name)
    data = open(path, "rb").read()
    if len(data) != size:
        raise ValueError(f"Unexpected resource size {name}: {len(data)} != {size}")
    return data

def encode_boot(plain):
    result = bytearray(plain)
    banks = struct.unpack_from('<H', plain, 0)[0]
    if banks < 1 or banks > len(plain) // 16:
        raise ValueError("Invalid boot directory")
    prev_end = banks * 16
    for i in range(banks):
        header = i * 16
        length, = struct.unpack_from('<H', plain, header + 2)
        start, = struct.unpack_from('<i', plain, header + 8)
        if (length == 0 or start < prev_end or start > len(plain) - length or
            crc16(plain, header, 14) != struct.unpack_from('<H', plain, header + 14)[0] or
            crc16(plain, start, length) != struct.unpack_from('<H', plain, header + 12)[0]):
            raise ValueError("Invalid boot bank")
        cipher(result, header, 16, 65535)
        cipher(result, start, length, 65535)
        prev_end = start + length
    return result

def build_flash(application, directory, end, vmEnd):
    boot = read_res(directory, "uboot.boot", 14488)
    config = read_res(directory, "boot-config.bin", 721)
    tool = read_res(directory, "cfg_tool.bin", 383)
    image = Image(end, 255)
    settings = Image(34 + len(config), 0)
    for bit in range(16):
        settings.bytes[bit] = 16
        settings.bytes[16 + bit] = 16 ^ (255 if (((PublicCode >> bit) & 1) == 0) else 0)
    settings.checksum(32, 0, 32)
    settings.copy(34, config)

    image.copy(0, bytes([0,0,0x20,2,0x2f,0x10,0x4c,0xc9,0,0xf0,0x0f,0,0x10,0x10,0xa4,0xff,
                         0x4e,0x5d,0x0b,0x41,0xe0,0xcd,0x78,0x1d,0xc8,0x56,0x41,0x7f,0xb3,0x67,0xcf,0x9f]))
    image.checksum(0, 2, 30)
    configAt = 160 + len(boot)
    image.record(32, "uboot.boot", crc16(boot), 160, len(boot), 0, 0, None)
    image.record(64, "isd_config.ini", crc16(settings.bytes), configAt, len(settings.bytes), 0x8002, 0, None)
    image.record(96, "app_dir_head", 65535, Area, 0xffffffff, 0xff81, 0, None)
    image.record(128, "key_mac", 65535, FlashLimit, 4096, 0x0112, 65535, None)
    for p in range(0, 160, 32):
        cipher(image.bytes, p, 32, 65535)
    image.copy(160, encode_boot(boot))
    image.copy(configAt, settings.bytes)

    payloadSize = AppData + len(application) + len(tool)
    app = Area + AppData
    image.copy(app, application)
    image.copy(app + len(application), tool)
    image.record(Area + 32, "app.bin", crc16(application), AppData, len(application), 0xff82, 0, None)
    image.record(Area + 64, "cfg_tool.bin", crc16(tool), AppData + len(application), len(tool), 0xff82, 0, None)
    image.record(Area + 96, "VM", 65535, end, vmEnd - end, 0x8112, 0, MinimumVm)
    image.record(Area + 128, "PRCT", 65535, 0, end, 0x8292, 0, 0x45444f43)
    image.record(Area + 160, "BTIF", 65535, vmEnd, BtSize, 0x8192, 1, 0x4f545541)
    image.record(Area, "app_area_head", crc16(image.bytes, Area + 32, payloadSize - 32), EntryPoint, payloadSize, 0xff83, 0, None)

    reserved = Area + payloadSize
    image.record(reserved + 32, "USER", 65535, FlashLimit - UserSize, UserSize, 0x8192, 1, 0x4f545541)
    image.record(reserved, "EXT_RESERVED", crc16(image.bytes, reserved + 32, 32), 32, 64, 0xff93, 1, None)

    for p in range(0, payloadSize + 64, 32):
        cipher(image.bytes, Area + p, min(32, payloadSize + 64 - p), PublicCode ^ (p >> 2))
    return image

def wrap(flash, loader, product):
    loaderAt = 1024 + round_up(len(flash.bytes), 32)
    total = loaderAt + round_up(len(loader), 32)
    ufw = Image(total, 255)
    ufw.bytes[0:224] = b'\x00' * 224
    files = [flash.bytes, loader]
    names = ["flash.bin", "ota.bin"]
    for i in range(len(files)):
        rec = 64 + i * 80
        ufw.number(rec, 0 if i == 0 else 100, 2)
        ufw.number(rec + 2, i, 2)
        ufw.number(rec + 4, crc16(files[i]), 2)
        ufw.number(rec + 8, 1024 if i == 0 else loaderAt, 4)
        ufw.number(rec + 12, len(files[i]), 4)
        ufw.number(rec + 16, round_up(len(files[i]), 32), 4)
        ufw.text(rec + 64, names[i])
        cipher(ufw.bytes, rec, 80, 65535)

    ufw.number(4, total, 4)
    ufw.number(8, 2, 2)
    ufw.number(10, 4, 2)
    ufw.number(12, 512, 4)
    ufw.text(16, "AC791N")
    ufw.checksum(2, 64, 160)
    ufw.checksum(0, 2, 62)
    cipher(ufw.bytes, 0, 64, 65535)
    ufw.copy(1024, flash.bytes)
    ufw.copy(loaderAt, loader)

    out = bytearray(total + 20)
    prod_bytes = product.encode('ascii')
    src = 0
    dst = 0
    while src < total:
        out[dst] = ufw.bytes[src]
        if src < 940 and (src + 1) % 47 == 0:
            idx = src // 47
            dst += 1
            out[dst] = (prod_bytes[idx] + idx + 1) if (idx < len(prod_bytes)) else 125
        src += 1
        dst += 1
    return bytes(out)

def build_firmware(sdk_path, toolchain_path, output_path):
    print("✦ Building Whimsy Machine FM-1 Firmware...")
    print(f"  SDK: {sdk_path}")
    print(f"  Toolchain: {toolchain_path}")
    print(f"  Output: {output_path}")

    cc = os.path.join(toolchain_path, "bin", "clang")
    ld = os.path.join(toolchain_path, "bin", "ld")
    objcopy = os.path.join(toolchain_path, "bin", "objcopy")
    plugin = os.path.join(toolchain_path, "bin", "LLVMgold.so")

    if not os.path.isfile(cc) or not os.path.isfile(ld) or not os.path.isfile(plugin):
        raise FileNotFoundError(f"Missing JieLi toolchain components at {toolchain_path}/bin")

    # Sync firmware-c files into sdk/app
    app_dir = os.path.join(sdk_path, "app")
    for f in [
        "whimsy_esoteric.h", "whimsy_esoteric.c",
        "whimsy_fm1_synth.h", "whimsy_fm1_synth.c",
        "whimsy_fm1_ui.h", "whimsy_fm1_ui.c",
        "whimsy_fm1_app.h", "whimsy_fm1_app.c"
    ]:
        src = os.path.join(FIRMWARE_C_DIR, f)
        dst = os.path.join(app_dir, f)
        if os.path.isfile(src):
            shutil.copyfile(src, dst)

    # Ensure audio.c, screen.c, and midi_router.c have Whimsy hooks
    audio_c = os.path.join(app_dir, "board", "audio.c")
    with open(audio_c, "r") as f:
        audio_src = f.read()
    if 'whimsy_fm1_app.h' not in audio_src:
        audio_src = '#include "whimsy_fm1_app.h"\n' + audio_src
        audio_src = audio_src.replace(
            "fm1_output_mix(rendered);",
            "whimsy_app_audio_render(rendered, FM1_BLOCK_FRAMES);\n    fm1_output_mix(rendered);"
        )
        with open(audio_c, "w") as f:
            f.write(audio_src)

    screen_c = os.path.join(app_dir, "screen.c")
    with open(screen_c, "r") as f:
        screen_src = f.read()
    if 'whimsy_fm1_app.h' not in screen_src:
        screen_src = '#include "whimsy_fm1_app.h"\n' + screen_src
        screen_src = screen_src.replace(
            "void groove_screen_init(void)\n{",
            "void groove_screen_init(void)\n{\n    whimsy_app_init();"
        )
        screen_src = screen_src.replace(
            "void groove_screen_control(void)\n{",
            "void groove_screen_control(void)\n{\n    whimsy_app_control_poll();"
        )
        with open(screen_c, "w") as f:
            f.write(screen_src)

    midi_c = os.path.join(app_dir, "midi_router.c")
    with open(midi_c, "r") as f:
        midi_src = f.read()
    if 'whimsy_fm1_app.h' not in midi_src:
        midi_src = '#include "whimsy_fm1_app.h"\n' + midi_src
        midi_src = midi_src.replace(
            "(void)fm1_midi_post(m, n);",
            "(void)fm1_midi_post(m, n);\n    whimsy_app_midi_note(m[0], n > 1 ? m[1] : 0, n > 2 ? m[2] : 0);"
        )
        with open(midi_c, "w") as f:
            f.write(midi_src)

    build_dir = os.path.join(sdk_path, "build", "linux")
    obj_dir = os.path.join(build_dir, "obj")
    gen_dir = os.path.join(build_dir, "generated")
    os.makedirs(obj_dir, exist_ok=True)
    os.makedirs(gen_dir, exist_ok=True)

    includes = ["sdk/include", "sdk/include/libc", "app/synth", "sdk/config", "app", "app/board"]
    inc_flags = [f"-I{os.path.join(sdk_path, d)}" for d in includes]
    inc_flags += [f"-isystem{os.path.join(toolchain_path, 'include')}"]

    base_flags = [
        "-target", "pi32v2", "-integrated-as", "-mcpu=r3", "-mfprev1",
        "-Wuninitialized", "-Wno-invalid-noreturn", "-fno-common", "-flto",
        "-fallow-pointer-null", "-fprefer-gnu-section", "-femulated-tls",
        "-Wno-shift-negative-value", "-Wframe-larger-than=2560", "-fms-extensions",
        "-fno-unwind-tables", "-ffunction-sections", "-fdata-sections",
        "-fmessage-length=0", "-cl-single-precision-constant",
        "-mllvm", "-pi32v2-large-program=true", "-D__GCC_PI32V2__", "-O2"
    ] + inc_flags

    sources = []
    for r, ds, fs in os.walk(app_dir):
        if "/app/synth" in r:
            continue
        for f in fs:
            if f.endswith(".c") or f.endswith(".S"):
                rel = os.path.relpath(os.path.join(r, f), sdk_path)
                sources.append(rel)
    sources.sort()

    objects = []
    for i, src in enumerate(sources):
        out = os.path.join(obj_dir, f"{i}_{src.replace('/', '_')}.obj")
        opts = list(base_flags)
        if src in ["app/screen.c", "app/transfer.c", "app/midi_router.c"]:
            opts.append("-fno-lto")
        if src == "app/board/panel.c":
            opts.extend(["-fno-lto", "-fno-pic"])
        opts.extend(["-fwrapv", "-fno-fast-math", "-ffp-contract=off"])
        if src in [
            "app/project.c", "app/transfer.c", "app/samples.c", "app/screen.c",
            "app/presets.c", "app/midi_router.c", "app/fm_factory.c", "app/fm_library.c"
        ]:
            opts.append("-Oz")
        if src == "app/screen.c":
            opts.append("-fno-inline-functions")

        cmd = [cc] + opts + ["-c", os.path.join(sdk_path, src), "-o", out]
        subprocess.check_call(cmd)
        objects.append(out)

    # Build identity
    id_bytes = [f"0x{b:02x}" for b in hashlib.sha256(b"whimsy_machine_fm1").digest()]
    identity_src = f"""#include "layout.h"
const struct fm1_firmware_layout fm1_layout = {{536576U, 7U}};
const unsigned char fm1_build_id[32] = {{{', '.join(id_bytes)}}};
const unsigned char fm1_update_identity[27] = "FM-1_8000014";
"""
    ident_c = os.path.join(gen_dir, "build_identity.c")
    ident_obj = os.path.join(obj_dir, "build_identity.obj")
    with open(ident_c, "w") as f:
        f.write(identity_src)
    subprocess.check_call([cc] + base_flags + ["-c", ident_c, "-o", ident_obj])
    objects.append(ident_obj)

    # Linker script
    with open(os.path.join(sdk_path, "sdk", "config", "linker.ld.in")) as f:
        ld_txt = f.read()
    ld_txt = ld_txt.replace("@SBC_DECODER@", "sbc_decoder\n").replace("@ACL_TX_EXTRA@", " + 1024").replace("@ACL_RX_EXTRA@", " + 4096")
    linker_ld = os.path.join(gen_dir, "linker.ld")
    with open(linker_ld, "w") as f:
        f.write(ld_txt)

    # Link ELF
    elf = os.path.join(build_dir, "sdk.elf")
    sdk_lib = os.path.join(sdk_path, "sdk", "lib")
    link_cmd = [
        ld, "--plugin", plugin, "-o", elf
    ] + objects + [
        "-flto", "--plugin-opt=-pi32v2-always-use-itblock=false", "--plugin-opt=-enable-ipra=true",
        "--plugin-opt=-pi32v2-merge-max-offset=4096", "--plugin-opt=-pi32v2-enable-simd=true",
        "--plugin-opt=mcpu=r3", "--plugin-opt=-global-merge-on-const", "--plugin-opt=-inline-threshold=5",
        "--plugin-opt=-inline-max-allocated-size=32", "--plugin-opt=-inline-normal-into-special-section=true",
        "--plugin-opt=-dont-used-symbol-list=malloc,free,sprintf,printf,puts,putchar",
        "--plugin-opt=-pi32v2-enable-rep-memop", "--plugin-opt=-emulated-tls", "--sort-common",
        "--plugin-opt=-pi32v2-large-program=true", "--plugin-opt=-pi32v2-csync-before-rti=true",
        "--start-group", "--whole-archive", os.path.join(sdk_lib, "libfm1_engine.a"), "--no-whole-archive",
        os.path.join(sdk_lib, "libc.a"), os.path.join(sdk_lib, "libcompiler_rt.a"), "--end-group",
        "--gc-sections", f"-T{linker_ld}", f"-M={os.path.join(build_dir, 'sdk.map')}",
        "--undefined=connectivity_wl82_bluetooth_start", "--undefined=audio_app_bluetooth_open",
        "--undefined=bt_get_local_name", "--undefined=bt_get_mac_addr"
    ]
    subprocess.check_call(link_cmd)

    # Extract application binary sections
    app_parts = []
    for sec in ['text', 'data', 'ram0_data', 'cache_ram_data']:
        bin_f = os.path.join(build_dir, f"{sec}.bin")
        subprocess.check_call([objcopy, "-O", "binary", "-j", f".{sec}", elf, bin_f])
        if os.path.exists(bin_f):
            app_parts.append(open(bin_f, "rb").read())
    app_bin = b"".join(app_parts)

    # Wrap in UFW/JLFS package (.fwsc)
    pack_res = os.path.join(sdk_path, "sdk", "tools", "pack")
    image_size = round_up(Area + AppData + len(app_bin) + 383 + 64, 4096)
    user_at = FlashLimit - UserSize
    vm_end = user_at - BtSize
    flash = build_flash(app_bin, pack_res, image_size, vm_end)
    loader = open(os.path.join(pack_res, "ota.bin"), "rb").read()
    fwsc_bytes = wrap(flash, loader, "FM-1_8000014")

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(fwsc_bytes)

    print(f"✔ Successfully generated {output_path} ({len(fwsc_bytes)} bytes)")
    return len(fwsc_bytes)

def main():
    parser = argparse.ArgumentParser(description="Build Whimsy Machine FM-1 Firmware (.fwsc)")
    parser.add_argument("--sdk", default=DEFAULT_SDK, help="Path to fm1_open SDK")
    parser.add_argument("--toolchain", default=DEFAULT_TOOLCHAIN, help="Path to JieLi pi32v2 toolchain")
    parser.add_argument("--output", default=DEFAULT_OUTPUT, help="Path to output .fwsc file")
    args = parser.parse_args()

    build_firmware(args.sdk, args.toolchain, args.output)

if __name__ == "__main__":
    main()
