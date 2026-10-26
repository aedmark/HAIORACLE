#include "whimsy_esoteric.h"
#include "whimsy_fm1_synth.h"
#include "whimsy_fm1_ui.h"
#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <string.h>

static void test_fnv1a_hash(void) {
    /* Test vectors matching tests/score.test.mjs & tests/audit.test.mjs */
    assert(whimsy_hash_phrase("") == 0x811c9dc5u);
    assert(whimsy_hash_phrase("hello") == 0x4f9f2cab);
    assert(whimsy_hash_phrase("  HELLO  ") == 0x4f9f2cab); /* Normalization case-insensitivity & trimming */
    assert(whimsy_hash_phrase("parlor glass") == 0x379482c9u);
    printf("✔ C FNV-1a phrase hashing matches JS contract\n");
}

static void test_gradus_suavitatis(void) {
    /* G(n) = 1 + sum e_i * (p_i - 1) */
    assert(whimsy_gradus_suavitatis(1) == 1);
    assert(whimsy_gradus_suavitatis(2) == 2);   /* 1 + (2-1) = 2 */
    assert(whimsy_gradus_suavitatis(3) == 3);   /* 1 + (3-1) = 3 */
    assert(whimsy_gradus_suavitatis(4) == 3);   /* 2^2 -> 1 + 2*(2-1) = 3 */
    assert(whimsy_gradus_suavitatis(5) == 5);   /* 1 + (5-1) = 5 */
    assert(whimsy_gradus_suavitatis(6) == 4);   /* 2*3 -> 1 + 1 + 2 = 4 */
    assert(whimsy_gradus_suavitatis(12) == 5);  /* 2^2 * 3 -> 1 + 2 + 2 = 5 */
    assert(whimsy_gradus_suavitatis(60) == 9);  /* 2^2 * 3 * 5 -> 1 + 2 + 2 + 4 = 9 */
    printf("✔ C Euler Gradus Suavitatis matches Euler 1739 formula\n");
}

static void test_brainfuck_vm_golden(void) {
    FILE *f = fopen("src/bass.bf", "rb");
    assert(f != NULL);
    fseek(f, 0, SEEK_END);
    long sz = ftell(f);
    fseek(f, 0, SEEK_SET);
    char *buf = (char *)malloc(sz + 1);
    assert(buf != NULL);
    size_t rd = fread(buf, 1, sz, f);
    fclose(f);
    buf[rd] = '\0';

    uint8_t out[32] = {0};
    size_t out_len = 0;
    WhimsyBfVm vm;

    bool ok = whimsy_run_brainfuck(buf, NULL, 0, out, sizeof(out), &out_len, &vm, 8192);
    free(buf);
    assert(ok);
    assert(out_len == 12);

    /* Golden output from JavaScript runBrainfuck(src/bass.bf) */
    const uint8_t golden[12] = {9, 244, 10, 250, 12, 250, 12, 248, 6, 248, 6, 247};
    assert(memcmp(out, golden, 12) == 0);
    printf("✔ C Brainfuck VM matches canonical src/bass.bf 12-byte golden output\n");
}

static void test_malbolge_vm_golden(void) {
    FILE *f = fopen("src/beat.mal", "rb");
    assert(f != NULL);
    fseek(f, 0, SEEK_END);
    long sz = ftell(f);
    fseek(f, 0, SEEK_SET);
    char *buf = (char *)malloc(sz + 1);
    assert(buf != NULL);
    size_t rd = fread(buf, 1, sz, f);
    fclose(f);
    buf[rd] = '\0';

    uint8_t out[32] = {0};
    size_t out_len = 0;
    WhimsyMalVm vm;

    bool ok = whimsy_run_malbolge(buf, NULL, 0, out, sizeof(out), &out_len, &vm, 4096);
    free(buf);
    assert(ok);
    assert(out_len >= 12);

    /* Golden output from JavaScript runMalbolge(src/beat.mal) */
    const uint8_t golden[12] = {32, 33, 190, 190, 190, 190, 190, 190, 190, 190, 190, 190};
    assert(memcmp(out, golden, 12) == 0);
    printf("✔ C Malbolge VM matches canonical src/beat.mal 12-step golden output\n");
}

static void test_befunge_vm_golden(void) {
    FILE *f = fopen("src/harmony.bfg", "rb");
    assert(f != NULL);
    fseek(f, 0, SEEK_END);
    long sz = ftell(f);
    fseek(f, 0, SEEK_SET);
    char *buf = (char *)malloc(sz + 1);
    assert(buf != NULL);
    size_t rd = fread(buf, 1, sz, f);
    fclose(f);
    buf[rd] = '\0';

    int32_t out[32] = {0};
    size_t out_len = 0;

    bool ok = whimsy_run_befunge(buf, NULL, 0, out, sizeof(out), &out_len, NULL, 4096);
    free(buf);
    assert(ok);
    assert(out_len >= 12);

    /* Golden output from JavaScript runBefunge(src/harmony.bfg) */
    const int32_t golden[12] = {3, 5, 7, 9, 2, 4, 6, 8, 1, 0, 5, 7};
    assert(memcmp(out, golden, 12 * sizeof(int32_t)) == 0);
    printf("✔ C Befunge-93 VM matches canonical src/harmony.bfg 12-cell golden output\n");
}

static void test_fractran_vm(void) {
    /* FRACTRAN prime-ratio rule: state 6 with fraction 35/6 -> 35 */
    WhimsyFractranFraction fracs[2] = {
        {35, 6},
        {77, 10}
    };
    uint32_t next = whimsy_run_fractran_step(6, fracs, 2);
    assert(next == 35);
    printf("✔ C FRACTRAN prime-ratio VM executes state transition accurately\n");
}

static void test_synth_engine_render(void) {
    WhimsySynthEngine engine;
    whimsy_synth_init(&engine);
    assert(engine.bpm == 108);

    /* Trigger LOLCODE lead and Brainfuck bass */
    whimsy_synth_trigger_note(&engine, WHIMSY_VOICE_LEAD, 60, 100);
    whimsy_synth_trigger_note(&engine, WHIMSY_VOICE_BASS, 36, 120);

    int32_t block[WHIMSY_BLOCK_FRAMES * 2] = {0};
    int res = whimsy_synth_render_block(&engine, block, WHIMSY_BLOCK_FRAMES);
    assert(res == 0);

    /* Verify audio has non-zero signed Q23 audio output */
    bool non_zero = false;
    for (int i = 0; i < WHIMSY_BLOCK_FRAMES * 2; i++) {
        if (block[i] != 0) {
            non_zero = true;
            break;
        }
    }
    assert(non_zero);
    printf("✔ C FM-1 native audio synthesis engine renders valid 128-frame Q23 stereo blocks (P7-03)\n");
}

static void test_tft_ui_render(void) {
    WhimsyTftCanvas canvas;
    whimsy_tft_render_frame(&canvas, 0x379482c9u, 2, 4, 1, "CERULEAN POTATO", "VICTORIAN TONNETZ");

    /* Verify top tracker has active step rendered */
    assert(canvas.buffer[6][6] != 0);

    /* Verify center vitrine bell jar has rendered brass and parchment pixels */
    assert(canvas.buffer[95][120] == COLOR_PARCHMENT_LT || canvas.buffer[95][120] == COLOR_VERDIGRIS);

    /* Verify Tonnetz compass box is rendered at bottom */
    assert(canvas.buffer[195][12] != 0);

    printf("✔ C FM-1 240x240 RGB565 color TFT screen renderer draws tracker, vitrine, and Tonnetz (P7-04)\n");
}

int main(void) {
    printf("✦ Running Whimsy Machine C Reference Suite (P7-02 / P7-03 / P7-04)...\n");
    test_fnv1a_hash();
    test_gradus_suavitatis();
    test_brainfuck_vm_golden();
    test_malbolge_vm_golden();
    test_befunge_vm_golden();
    test_fractran_vm();
    test_synth_engine_render();
    test_tft_ui_render();
    printf("All Whimsy Machine C tests passed successfully!\n");
    return 0;
}
