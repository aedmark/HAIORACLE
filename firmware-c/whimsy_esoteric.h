#ifndef WHIMSY_ESOTERIC_H
#define WHIMSY_ESOTERIC_H

#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

/* ---------------------------------------------------------------------------
 * FNV-1a 32-bit Phrase Hashing & Normalization (D-003)
 * --------------------------------------------------------------------------- */
uint32_t whimsy_hash_phrase(const char *phrase);

/* ---------------------------------------------------------------------------
 * Brainfuck 1993 256-Cell Tape VM (Plate III, D-014)
 * --------------------------------------------------------------------------- */
#define BF_TAPE_SIZE 256

typedef struct {
    uint8_t tape[BF_TAPE_SIZE];
    uint16_t pointer;
    uint32_t steps_executed;
} WhimsyBfVm;

bool whimsy_run_brainfuck(const char *source,
                          const uint8_t *input, size_t input_len,
                          uint8_t *output, size_t max_output_len, size_t *actual_output_len,
                          WhimsyBfVm *final_vm,
                          uint32_t max_steps);

/* ---------------------------------------------------------------------------
 * Malbolge 1998 59,049-Word Ternary VM (Plate II, D-013)
 * --------------------------------------------------------------------------- */
#define MAL_MEMORY_SIZE 59049

typedef struct {
    uint16_t mem[MAL_MEMORY_SIZE];
    uint16_t a;
    uint16_t c;
    uint16_t d;
    uint32_t steps_executed;
    bool halted;
} WhimsyMalVm;

uint16_t whimsy_malbolge_crazy(uint16_t a, uint16_t b);
uint16_t whimsy_malbolge_rotr(uint16_t n);

bool whimsy_run_malbolge(const char *source,
                         const uint8_t *input, size_t input_len,
                         uint8_t *output, size_t max_output_len, size_t *actual_output_len,
                         WhimsyMalVm *final_vm,
                         uint32_t max_steps);

/* ---------------------------------------------------------------------------
 * Befunge-93 80x25 2D Torus Playfield VM (Plate IV, D-014)
 * --------------------------------------------------------------------------- */
#define BEF_WIDTH 80
#define BEF_HEIGHT 25
#define BEF_STACK_SIZE 1024

typedef struct {
    char grid[BEF_HEIGHT][BEF_WIDTH];
    int32_t stack[BEF_STACK_SIZE];
    size_t stack_depth;
    int32_t x;
    int32_t y;
    int32_t dx;
    int32_t dy;
    bool string_mode;
    uint32_t steps_executed;
    bool halted;
} WhimsyBefVm;

bool whimsy_run_befunge(const char *source,
                        const int32_t *input, size_t input_len,
                        int32_t *output, size_t max_output_len, size_t *actual_output_len,
                        WhimsyBfVm *dummy_vm, /* optional */
                        uint32_t max_steps);

/* ---------------------------------------------------------------------------
 * FRACTRAN 1987 Prime-Ratio VM & Piet 2001 Codel Clock (Plate V, D-014)
 * --------------------------------------------------------------------------- */
typedef struct {
    uint32_t numerator;
    uint32_t denominator;
} WhimsyFractranFraction;

uint32_t whimsy_run_fractran_step(uint32_t state,
                                  const WhimsyFractranFraction *fractions,
                                  size_t count);

/* ---------------------------------------------------------------------------
 * Leonhard Euler 1739 Gradus Suavitatis Consonance Metric (P5-14)
 * G(n) = 1 + sum e_i * (p_i - 1)
 * --------------------------------------------------------------------------- */
uint32_t whimsy_gradus_suavitatis(uint32_t n);

#ifdef __cplusplus
}
#endif

#endif /* WHIMSY_ESOTERIC_H */
