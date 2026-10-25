#include "whimsy_esoteric.h"
#include <string.h>
#include <ctype.h>
#include <stdlib.h>

/* ---------------------------------------------------------------------------
 * FNV-1a 32-bit Phrase Hashing & Normalization (D-003)
 * --------------------------------------------------------------------------- */
uint32_t whimsy_hash_phrase(const char *phrase) {
    if (!phrase) return 0x811c9dc5u;

    /* Trim leading whitespace */
    while (*phrase && isspace((unsigned char)*phrase)) {
        phrase++;
    }

    size_t len = strlen(phrase);
    /* Trim trailing whitespace */
    while (len > 0 && isspace((unsigned char)phrase[len - 1])) {
        len--;
    }

    if (len > 72) len = 72;

    uint32_t hash = 0x811c9dc5u;
    for (size_t i = 0; i < len; i++) {
        unsigned char c = (unsigned char)tolower((unsigned char)phrase[i]);
        hash ^= c;
        hash = (uint32_t)(hash * 0x01000193u);
    }
    return hash;
}

/* ---------------------------------------------------------------------------
 * Brainfuck 1993 256-Cell Tape VM (Plate III, D-014)
 * --------------------------------------------------------------------------- */
bool whimsy_run_brainfuck(const char *source,
                          const uint8_t *input, size_t input_len,
                          uint8_t *output, size_t max_output_len, size_t *actual_output_len,
                          WhimsyBfVm *final_vm,
                          uint32_t max_steps) {
    if (!source) return false;
    size_t src_len = strlen(source);
    if (src_len == 0) return false;

    /* Pre-compute jump table */
    int32_t *jump_table = (int32_t *)malloc(src_len * sizeof(int32_t));
    if (!jump_table) return false;
    for (size_t i = 0; i < src_len; i++) jump_table[i] = -1;

    size_t *stack = (size_t *)malloc(src_len * sizeof(size_t));
    if (!stack) {
        free(jump_table);
        return false;
    }
    size_t stack_ptr = 0;

    for (size_t i = 0; i < src_len; i++) {
        if (source[i] == '[') {
            stack[stack_ptr++] = i;
        } else if (source[i] == ']') {
            if (stack_ptr == 0) {
                free(jump_table);
                free(stack);
                return false; /* Unmatched ']' */
            }
            size_t open_pos = stack[--stack_ptr];
            jump_table[open_pos] = (int32_t)i;
            jump_table[i] = (int32_t)open_pos;
        }
    }
    if (stack_ptr > 0) {
        free(jump_table);
        free(stack);
        return false; /* Unmatched '[' */
    }
    free(stack);

    WhimsyBfVm vm;
    memset(&vm, 0, sizeof(vm));

    size_t out_count = 0;
    size_t in_ptr = 0;
    size_t pc = 0;

    while (pc < src_len) {
        if (vm.steps_executed >= max_steps) {
            free(jump_table);
            return false;
        }

        char op = source[pc];
        if (strchr("><+-.,[]", op)) {
            vm.steps_executed++;
        }

        switch (op) {
            case '>':
                vm.pointer = (vm.pointer + 1) & 0xff;
                break;
            case '<':
                vm.pointer = (vm.pointer - 1) & 0xff;
                break;
            case '+':
                vm.tape[vm.pointer] = (uint8_t)(vm.tape[vm.pointer] + 1);
                break;
            case '-':
                vm.tape[vm.pointer] = (uint8_t)(vm.tape[vm.pointer] - 1);
                break;
            case '.':
                if (output && out_count < max_output_len) {
                    output[out_count++] = vm.tape[vm.pointer];
                }
                break;
            case ',':
                vm.tape[vm.pointer] = (in_ptr < input_len) ? input[in_ptr++] : 0;
                break;
            case '[':
                if (vm.tape[vm.pointer] == 0) {
                    pc = (size_t)jump_table[pc];
                }
                break;
            case ']':
                if (vm.tape[vm.pointer] != 0) {
                    pc = (size_t)jump_table[pc];
                }
                break;
            default:
                break;
        }
        pc++;
    }

    free(jump_table);
    if (actual_output_len) *actual_output_len = out_count;
    if (final_vm) *final_vm = vm;
    return true;
}

/* ---------------------------------------------------------------------------
 * Malbolge 1998 59,049-Word Ternary VM (Plate II, D-013)
 * --------------------------------------------------------------------------- */
static const char *MAL_XLAT2 =
  "5z]&gqtyfr$(we4{WP)H-Zn,[%\\3dL+Q;>U!pJS72FhOA1CB6v^=I_0/8|jsb9m<.TVac`uY*MK'X~xDl}REokN:#?G\"i@";

static const uint8_t CRAZY_TABLE[3][3] = {
    {1, 0, 0},
    {1, 0, 2},
    {2, 2, 1}
};

uint16_t whimsy_malbolge_crazy(uint16_t a, uint16_t d) {
    uint16_t result = 0;
    uint32_t p3 = 1;
    for (int i = 0; i < 10; i++) {
        uint8_t tritA = (uint8_t)(a % 3);
        uint8_t tritD = (uint8_t)(d % 3);
        result = (uint16_t)(result + CRAZY_TABLE[tritD][tritA] * p3);
        a /= 3;
        d /= 3;
        p3 *= 3;
    }
    return result;
}

uint16_t whimsy_malbolge_rotr(uint16_t n) {
    uint16_t last_trit = (uint16_t)(n % 3);
    return (uint16_t)((n / 3) + last_trit * 19683u);
}

bool whimsy_run_malbolge(const char *source,
                         const uint8_t *input, size_t input_len,
                         uint8_t *output, size_t max_output_len, size_t *actual_output_len,
                         WhimsyMalVm *final_vm,
                         uint32_t max_steps) {
    if (!source) return false;
    WhimsyMalVm *vm = (WhimsyMalVm *)calloc(1, sizeof(WhimsyMalVm));
    if (!vm) return false;

    size_t src_len = strlen(source);
    size_t mem_idx = 0;

    for (size_t i = 0; i < src_len; i++) {
        char c = source[i];
        if (c == ' ' || c == '\t' || c == '\r' || c == '\n') continue;
        if (c < 33 || c > 126) {
            free(vm);
            return false;
        }
        uint8_t op = (uint8_t)((c + mem_idx) % 94);
        if (op != 4 && op != 5 && op != 23 && op != 39 && op != 40 && op != 62 && op != 68 && op != 81) {
            free(vm);
            return false;
        }
        if (mem_idx >= MAL_MEMORY_SIZE) {
            free(vm);
            return false;
        }
        vm->mem[mem_idx++] = (uint16_t)c;
    }

    if (mem_idx == 0) {
        free(vm);
        return false;
    }

    /* Initialize remainder of memory with crazy operation */
    for (size_t i = mem_idx; i < MAL_MEMORY_SIZE; i++) {
        vm->mem[i] = whimsy_malbolge_crazy(vm->mem[i - 1], vm->mem[i - 2]);
    }

    size_t out_count = 0;
    size_t in_ptr = 0;

    while (!vm->halted && vm->steps_executed < max_steps) {
        uint16_t word = vm->mem[vm->c];
        if (word < 33 || word > 126) {
            vm->halted = true;
            break;
        }
        uint8_t op = (uint8_t)((word + vm->c) % 94);
        vm->steps_executed++;

        switch (op) {
            case 4: /* jmp [d] */
                vm->c = vm->mem[vm->d];
                break;
            case 5: /* out a */
                if (output && out_count < max_output_len) {
                    output[out_count++] = (uint8_t)(vm->a & 0xff);
                }
                break;
            case 23: /* in a */
                vm->a = (in_ptr < input_len) ? input[in_ptr++] : 59048u;
                break;
            case 39: /* rotr */
                vm->a = vm->mem[vm->d] = whimsy_malbolge_rotr(vm->mem[vm->d]);
                break;
            case 40: /* mov d, [d] */
                vm->d = vm->mem[vm->d];
                break;
            case 62: /* crz */
                vm->a = vm->mem[vm->d] = whimsy_malbolge_crazy(vm->a, vm->mem[vm->d]);
                break;
            case 68: /* nop */
                break;
            case 81: /* halt */
                vm->halted = true;
                break;
            default:
                break;
        }

        /* Encrypt current instruction */
        vm->mem[vm->c] = (uint16_t)MAL_XLAT2[vm->mem[vm->c] - 33];
        vm->c = (uint16_t)((vm->c + 1) % MAL_MEMORY_SIZE);
        vm->d = (uint16_t)((vm->d + 1) % MAL_MEMORY_SIZE);
    }

    if (actual_output_len) *actual_output_len = out_count;
    if (final_vm) *final_vm = *vm;
    free(vm);
    return true;
}

/* ---------------------------------------------------------------------------
 * Befunge-93 80x25 2D Torus Playfield VM (Plate IV, D-014)
 * --------------------------------------------------------------------------- */
bool whimsy_run_befunge(const char *source,
                        const int32_t *input, size_t input_len,
                        int32_t *output, size_t max_output_len, size_t *actual_output_len,
                        WhimsyBfVm *dummy_vm,
                        uint32_t max_steps) {
    (void)dummy_vm;
    if (!source) return false;
    WhimsyBefVm vm;
    memset(&vm, 0, sizeof(vm));
    vm.dx = 1;
    vm.dy = 0;

    /* Initialize grid with spaces */
    for (int y = 0; y < BEF_HEIGHT; y++) {
        for (int x = 0; x < BEF_WIDTH; x++) {
            vm.grid[y][x] = ' ';
        }
    }

    /* Load program into 2D grid */
    int cur_y = 0;
    int cur_x = 0;
    size_t src_len = strlen(source);

    for (size_t i = 0; i < src_len && cur_y < BEF_HEIGHT; i++) {
        char c = source[i];
        if (c == '\n') {
            cur_y++;
            cur_x = 0;
        } else if (c == '\r') {
            continue;
        } else {
            if (cur_x < BEF_WIDTH) {
                vm.grid[cur_y][cur_x++] = c;
            }
        }
    }

    size_t out_count = 0;
    size_t in_ptr = 0;

    #define STACK_PUSH(v) do { \
        int32_t _val = (int32_t)(v); \
        if (vm.stack_depth < BEF_STACK_SIZE) { \
            vm.stack[vm.stack_depth] = _val; \
            vm.stack_depth++; \
        } \
    } while (0)

    #define STACK_POP() (vm.stack_depth > 0 ? vm.stack[--vm.stack_depth] : 0)

    while (!vm.halted && vm.steps_executed < max_steps) {
        char op = vm.grid[vm.y][vm.x];
        vm.steps_executed++;

        if (vm.string_mode) {
            if (op == '"') {
                vm.string_mode = false;
            } else {
                STACK_PUSH((int32_t)op);
            }
        } else {
            if (isdigit((unsigned char)op)) {
                STACK_PUSH(op - '0');
            } else {
                switch (op) {
                    case '+': {
                        int32_t a = STACK_POP();
                        int32_t b = STACK_POP();
                        STACK_PUSH(b + a);
                        break;
                    }
                    case '-': {
                        int32_t a = STACK_POP();
                        int32_t b = STACK_POP();
                        STACK_PUSH(b - a);
                        break;
                    }
                    case '*': {
                        int32_t a = STACK_POP();
                        int32_t b = STACK_POP();
                        STACK_PUSH(b * a);
                        break;
                    }
                    case '/': {
                        int32_t next_dx = -vm.dy;
                        int32_t next_dy = -vm.dx;
                        vm.dx = next_dx;
                        vm.dy = next_dy;
                        break;
                    }
                    case '\\': {
                        int32_t next_dx = vm.dy;
                        int32_t next_dy = vm.dx;
                        vm.dx = next_dx;
                        vm.dy = next_dy;
                        break;
                    }
                    case '%': {
                        int32_t a = STACK_POP();
                        int32_t b = STACK_POP();
                        STACK_PUSH(a != 0 ? b % a : 0);
                        break;
                    }
                    case '!':
                        STACK_PUSH(STACK_POP() == 0 ? 1 : 0);
                        break;
                    case '`': {
                        int32_t a = STACK_POP();
                        int32_t b = STACK_POP();
                        STACK_PUSH(b > a ? 1 : 0);
                        break;
                    }
                    case '>':
                        vm.dx = 1; vm.dy = 0;
                        break;
                    case '<':
                        vm.dx = -1; vm.dy = 0;
                        break;
                    case '^':
                        vm.dx = 0; vm.dy = -1;
                        break;
                    case 'v':
                        vm.dx = 0; vm.dy = 1;
                        break;
                    case '?': {
                        int r = rand() % 4;
                        if (r == 0) { vm.dx = 1; vm.dy = 0; }
                        else if (r == 1) { vm.dx = -1; vm.dy = 0; }
                        else if (r == 2) { vm.dx = 0; vm.dy = -1; }
                        else { vm.dx = 0; vm.dy = 1; }
                        break;
                    }
                    case '_':
                        vm.dx = STACK_POP() == 0 ? 1 : -1;
                        vm.dy = 0;
                        break;
                    case '|':
                        vm.dx = 0;
                        vm.dy = STACK_POP() == 0 ? 1 : -1;
                        break;
                    case '"':
                        vm.string_mode = true;
                        break;
                    case ':': {
                        int32_t top = vm.stack_depth > 0 ? vm.stack[vm.stack_depth - 1] : 0;
                        STACK_PUSH(top);
                        break;
                    }
                    case '$':
                        (void)STACK_POP();
                        break;
                    case '.':
                        if (output && out_count < max_output_len) {
                            output[out_count++] = STACK_POP();
                        }
                        break;
                    case ',':
                        if (output && out_count < max_output_len) {
                            output[out_count++] = (int32_t)(char)STACK_POP();
                        }
                        break;
                    case '#':
                        vm.x = (vm.x + vm.dx + BEF_WIDTH) % BEF_WIDTH;
                        vm.y = (vm.y + vm.dy + BEF_HEIGHT) % BEF_HEIGHT;
                        break;
                    case 'p': {
                        int32_t py = STACK_POP();
                        int32_t px = STACK_POP();
                        int32_t val = STACK_POP();
                        if (px >= 0 && px < BEF_WIDTH && py >= 0 && py < BEF_HEIGHT) {
                            vm.grid[py][px] = (char)val;
                        }
                        break;
                    }
                    case 'g': {
                        int32_t py = STACK_POP();
                        int32_t px = STACK_POP();
                        if (px >= 0 && px < BEF_WIDTH && py >= 0 && py < BEF_HEIGHT) {
                            STACK_PUSH((int32_t)vm.grid[py][px]);
                        } else {
                            STACK_PUSH(0);
                        }
                        break;
                    }
                    case '&':
                        STACK_PUSH((in_ptr < input_len) ? input[in_ptr++] : 0);
                        break;
                    case '~':
                        STACK_PUSH((in_ptr < input_len) ? input[in_ptr++] : 0);
                        break;
                    case '@':
                        vm.halted = true;
                        break;
                    default:
                        break;
                }
            }
        }

        vm.x = (vm.x + vm.dx + BEF_WIDTH) % BEF_WIDTH;
        vm.y = (vm.y + vm.dy + BEF_HEIGHT) % BEF_HEIGHT;
    }

    #undef STACK_PUSH
    #undef STACK_POP

    if (actual_output_len) *actual_output_len = out_count;
    return true;
}

/* ---------------------------------------------------------------------------
 * FRACTRAN 1987 Prime-Ratio VM & Piet 2001 Codel Clock (Plate V, D-014)
 * --------------------------------------------------------------------------- */
uint32_t whimsy_run_fractran_step(uint32_t state,
                                  const WhimsyFractranFraction *fractions,
                                  size_t count) {
    if (!fractions || count == 0 || state == 0) return state;

    for (size_t i = 0; i < count; i++) {
        uint32_t num = fractions[i].numerator;
        uint32_t den = fractions[i].denominator;
        if (den == 0) continue;
        if ((state % den) == 0) {
            return (uint32_t)((state / den) * num);
        }
    }
    return state;
}

/* ---------------------------------------------------------------------------
 * Leonhard Euler 1739 Gradus Suavitatis Consonance Metric (P5-14)
 * G(n) = 1 + sum e_i * (p_i - 1)
 * --------------------------------------------------------------------------- */
uint32_t whimsy_gradus_suavitatis(uint32_t n) {
    if (n <= 1) return 1;

    uint32_t gradus = 1;
    uint32_t d = 2;

    while (d * d <= n) {
        while ((n % d) == 0) {
            gradus += (d - 1);
            n /= d;
        }
        d += (d == 2) ? 1 : 2;
    }
    if (n > 1) {
        gradus += (n - 1);
    }
    return gradus;
}
