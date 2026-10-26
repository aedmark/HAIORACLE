#ifndef WHIMSY_FM1_SYNTH_H
#define WHIMSY_FM1_SYNTH_H

#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

#define WHIMSY_SAMPLE_RATE 44100
#define WHIMSY_BLOCK_FRAMES 128
#define WHIMSY_CHANNELS 2

/* ---------------------------------------------------------------------------
 * Whimsy Machine 8-Channel Voice Definitions (D-073)
 * --------------------------------------------------------------------------- */
typedef enum {
    WHIMSY_VOICE_LEAD = 0,    /* Track 1: LOLCODE lead synth (bandpass / lowpass pulse/saw) */
    WHIMSY_VOICE_MANUAL = 1,  /* Track 2: Fun Machine one-finger manual (dual saw/tri pad) */
    WHIMSY_VOICE_PULSE = 2,   /* Track 3: Malbolge 1998 percussion (kick, snare, clockwork chime) */
    WHIMSY_VOICE_BASS = 3,    /* Track 4: Brainfuck 1993 walking bass (resonant 303-style sub-bass) */
    WHIMSY_VOICE_ORGAN = 4,   /* Track 5: Befunge-93 chord organ (2-op polyphonic FM reed organ) */
    WHIMSY_VOICE_CHIME = 5,   /* Track 6: Piet / FRACTRAN Just Intonation bell/chimes (FM bell) */
    WHIMSY_VOICE_CHOIR = 6,   /* Track 7: Shakespeare vowel formant choir (/a/, /e/, /i/, /o/, /u/) */
    WHIMSY_VOICE_MYCELIUM = 7 /* Track 8: Bio-acoustic guttation pops & hyphal noise bursts */
} WhimsyVoiceTrack;

/* ---------------------------------------------------------------------------
 * Sound Engine Structures & DSP State
 * --------------------------------------------------------------------------- */
typedef struct {
    uint32_t phase;
    uint32_t phase_inc;
    int32_t env_level;     /* Q15: 0..32768 */
    int32_t env_decay;     /* decay rate per sample */
    bool active;
    uint8_t note;
    uint8_t velocity;
} WhimsyOscillator;

typedef struct {
    /* Resonant State-Variable Filter (SVF) */
    int32_t low;           /* Q15 */
    int32_t band;          /* Q15 */
    int32_t high;          /* Q15 */
    int32_t cutoff;        /* Q15 (0..16384) */
    int32_t resonance;     /* Q15 (0..32768) */
} WhimsyFilter;

typedef struct {
    /* 8 Mixer channel faders (0..100), mutes, solos */
    uint8_t fader[8];
    bool muted[8];
    bool soloed[8];
    int8_t pan[8];         /* -100..+100 */
    uint8_t master_volume; /* 0..100 */
    WhimsyFilter master_filter;
} WhimsyMixer;

typedef struct {
    WhimsyOscillator lead_osc;
    WhimsyOscillator manual_osc[4]; /* 4-voice polyphonic pad */
    WhimsyOscillator bass_osc;
    WhimsyOscillator organ_osc[3];  /* 3-voice chord organ */
    WhimsyOscillator chime_osc;
    WhimsyOscillator choir_osc[3];  /* 3 formant bandpass filters */
    WhimsyMixer mixer;
    uint32_t current_step;
    uint16_t bpm;
    uint32_t samples_per_step;
    uint32_t step_sample_counter;
} WhimsySynthEngine;

/* ---------------------------------------------------------------------------
 * Engine Lifecycle & Rendering
 * --------------------------------------------------------------------------- */
void whimsy_synth_init(WhimsySynthEngine *engine);
void whimsy_synth_set_bpm(WhimsySynthEngine *engine, uint16_t bpm);
void whimsy_synth_trigger_note(WhimsySynthEngine *engine, WhimsyVoiceTrack track, uint8_t note, uint8_t velocity);
void whimsy_synth_release_note(WhimsySynthEngine *engine, WhimsyVoiceTrack track, uint8_t note);

/* Render one block (128 frames, stereo signed 32-bit Q23) for FM-1 DAC DMA */
int whimsy_synth_render_block(WhimsySynthEngine *engine, int32_t *output, unsigned frames);

#ifdef __cplusplus
}
#endif

#endif /* WHIMSY_FM1_SYNTH_H */
