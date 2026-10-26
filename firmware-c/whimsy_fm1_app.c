#include "whimsy_fm1_app.h"
#include "whimsy_esoteric.h"
#include "whimsy_fm1_synth.h"
#include "whimsy_fm1_ui.h"
#include "fm1.h"
#include <string.h>

/* Victorian Curio Omen Catalog */
static const char *const WHIMSY_OMENS[] = {
    "HAI, ORACLE!",
    "THE WHIMSY MACHINE",
    "CELESTIAL ORGAN",
    "BRAINFUCK BASS",
    "MALBOLGE CADENCE",
    "BEFUNGE HARMONY",
    "FRACTRAN CHIMES",
    "KAPELLMEISTER"
};
#define WHIMSY_NUM_OMENS 8

typedef struct {
    uint32_t seed;
    uint8_t shape;
    uint16_t bpm;
    char name[32];
    char genre_name[32];
} WhimsyCreature;

/* Active State */
static WhimsySynthEngine whimsy_engine;
static WhimsyTftCanvas whimsy_canvas;
static WhimsyCreature whimsy_creature;
static uint8_t bass_steps[12];
static uint8_t cadence_steps[12];
static uint8_t organ_chords[12];
static uint8_t chimes_steps[12];

static unsigned current_omen_idx = 0;
static uint32_t prev_step = 999;
static uint8_t held_key = 0xff;
static uint32_t previous_keys = 0;
static uint16_t band_pixels[FM1_SCREEN_WIDTH * 16];
static unsigned render_band = 0;
static uint32_t last_ui_render_ms = 0;

static const char *const GENRES[] = {
    "Kapellmeister", "Victorian Consort", "Clockwork Hymn",
    "Nocturne", "Fantasia", "Epitaph", "Parlor Gigue", "Pavane"
};

/* Helper: Load and compile an omen phrase */
static void whimsy_load_omen(unsigned index) {
    if (index >= WHIMSY_NUM_OMENS) index = 0;
    current_omen_idx = index;
    const char *phrase = WHIMSY_OMENS[current_omen_idx];

    /* 1. Score Hash & Creature Identity */
    whimsy_creature.seed = whimsy_hash_phrase(phrase);
    whimsy_creature.shape = (uint8_t)((whimsy_creature.seed >> 4) % 10);
    whimsy_creature.bpm = (uint16_t)(60 + ((whimsy_creature.seed >> 8) % 100));

    strncpy(whimsy_creature.name, phrase, sizeof(whimsy_creature.name) - 1);
    whimsy_creature.name[sizeof(whimsy_creature.name) - 1] = '\0';

    strncpy(whimsy_creature.genre_name, GENRES[whimsy_creature.shape % 8], sizeof(whimsy_creature.genre_name) - 1);
    whimsy_creature.genre_name[sizeof(whimsy_creature.genre_name) - 1] = '\0';

    /* 2. Compute 12-step patterns derived from esoteric seeds */
    for (unsigned i = 0; i < 12; i++) {
        bass_steps[i] = (uint8_t)(36 + ((whimsy_creature.seed + i * 7) % 24));
        cadence_steps[i] = (uint8_t)((whimsy_creature.seed >> (i * 2)) & 3);
        organ_chords[i] = (uint8_t)(48 + ((whimsy_creature.seed + i * 5) % 16));
        chimes_steps[i] = (uint8_t)(72 + ((whimsy_creature.seed + i * 9) % 20));
    }

    /* 3. Tempo & Tuning */
    whimsy_synth_set_bpm(&whimsy_engine, whimsy_creature.bpm);
}

void whimsy_app_init(void) {
    whimsy_synth_init(&whimsy_engine);
    whimsy_load_omen(0);
    whimsy_tft_clear(&whimsy_canvas, COLOR_OBSIDIAN);
    render_band = 0;
    last_ui_render_ms = fm1_millis();
}

/* Invoked from audio IRQ */
void whimsy_app_audio_render(int32_t *output, unsigned frames) {
    /* Check step advance */
    uint32_t step = whimsy_engine.current_step;
    if (step != prev_step) {
        prev_step = step;

        /* Walking Bass (Brainfuck) */
        whimsy_synth_trigger_note(&whimsy_engine, WHIMSY_VOICE_BASS, bass_steps[step], 110);

        /* Befunge Chord Organ */
        whimsy_synth_trigger_note(&whimsy_engine, WHIMSY_VOICE_ORGAN, organ_chords[step], 90);

        /* FRACTRAN Chimes */
        if (chimes_steps[step] > 0) {
            whimsy_synth_trigger_note(&whimsy_engine, WHIMSY_VOICE_CHIME, chimes_steps[step], 80);
        }

        /* Front panel tracker LED */
        for (unsigned k = 0; k < 12; k++) {
            fm1_led_set(14 + k, k == step ? 1 : 0);
        }
    }

    whimsy_synth_render_block(&whimsy_engine, output, frames);
}

/* MIDI input */
void whimsy_app_midi_note(uint8_t status, uint8_t note, uint8_t velocity) {
    uint8_t type = status & 0xf0;
    if (type == 0x90 && velocity > 0) {
        held_key = (note >= 53 && note <= 79) ? (uint8_t)(note - 53) : 0;
        if (note < 60) {
            /* Left side auto-chord organ */
            whimsy_synth_trigger_note(&whimsy_engine, WHIMSY_VOICE_ORGAN, note, velocity);
        } else {
            /* Right side LOLCODE lead synth */
            whimsy_synth_trigger_note(&whimsy_engine, WHIMSY_VOICE_LEAD, note, velocity);
        }
    } else if (type == 0x80 || (type == 0x90 && velocity == 0)) {
        if (note < 60) {
            whimsy_synth_release_note(&whimsy_engine, WHIMSY_VOICE_ORGAN, note);
        } else {
            whimsy_synth_release_note(&whimsy_engine, WHIMSY_VOICE_LEAD, note);
        }
        held_key = 0xff;
    }
}

/* Control & Screen Poll */
void whimsy_app_control_poll(void) {
    struct fm1_controls controls;
    fm1_controls_read(&controls);
    uint32_t now = fm1_millis();

    /* 1. Master Volume from analog potentiometer */
    if (controls.knob <= 1023) {
        whimsy_engine.mixer.master_volume = (uint8_t)((controls.knob * 100U) / 1023U);
    }

    /* 2. Encoders */
    /* Encoder 0: Omen selection */
    if (controls.encoders[0] != 0) {
        int next_idx = (int)current_omen_idx + controls.encoders[0];
        while (next_idx < 0) next_idx += WHIMSY_NUM_OMENS;
        whimsy_load_omen((unsigned)next_idx % WHIMSY_NUM_OMENS);
    }
    /* Encoder 1: BPM */
    if (controls.encoders[1] != 0) {
        int bpm = (int)whimsy_engine.bpm + controls.encoders[1] * 2;
        whimsy_synth_set_bpm(&whimsy_engine, (uint16_t)bpm);
    }
    /* Encoder 2: Cutoff */
    if (controls.encoders[2] != 0) {
        int cutoff = whimsy_engine.mixer.master_filter.cutoff + controls.encoders[2] * 200;
        if (cutoff < 500) cutoff = 500;
        if (cutoff > 16000) cutoff = 16000;
        whimsy_engine.mixer.master_filter.cutoff = cutoff;
    }

    /* 3. Physical Keys (27 keys: F3..G5, notes 53..79) */
    uint32_t pressed = controls.keys & ~previous_keys;
    uint32_t released = previous_keys & ~controls.keys;
    previous_keys = controls.keys;

    for (unsigned k = 0; k < 27; k++) {
        if (pressed & (1U << k)) {
            uint8_t note = 53 + k;
            whimsy_app_midi_note(0x90, note, 100);
        }
        if (released & (1U << k)) {
            uint8_t note = 53 + k;
            whimsy_app_midi_note(0x80, note, 0);
        }
    }

    /* 4. Display Refresh (Banded 16-row DMA transfers) */
    if (now - last_ui_render_ms >= 33U) {
        last_ui_render_ms = now;
        uint8_t active_region = (uint8_t)(whimsy_engine.current_step % 4);
        whimsy_tft_render_frame(&whimsy_canvas,
                                whimsy_creature.seed,
                                whimsy_creature.shape,
                                (uint8_t)whimsy_engine.current_step,
                                active_region,
                                whimsy_creature.name,
                                whimsy_creature.genre_name);
    }

    /* Transfer bands via DMA */
    if (fm1_screen_pending() == 0) {
        unsigned y_start = render_band * 16;
        for (unsigned row = 0; row < 16; row++) {
            memcpy(&band_pixels[row * FM1_SCREEN_WIDTH],
                   &whimsy_canvas.buffer[y_start + row][0],
                   FM1_SCREEN_WIDTH * sizeof(uint16_t));
        }
        fm1_screen_submit(0, y_start, FM1_SCREEN_WIDTH, 16, band_pixels, FM1_SCREEN_WIDTH * 16);
        render_band = (render_band + 1) % 15;
    }
}
