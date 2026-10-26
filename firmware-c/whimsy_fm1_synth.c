#include "whimsy_fm1_synth.h"
#include <string.h>
#include <math.h>

/* Convert MIDI note number to phase increment for 44.1 kHz */
static uint32_t midi_to_phase_inc(uint8_t note) {
    if (note > 127) note = 127;
    /* freq = 440 * 2^((note - 69) / 12) */
    double freq = 440.0 * pow(2.0, ((double)note - 69.0) / 12.0);
    /* phase_inc = (freq / 44100) * 2^32 */
    double inc = (freq / (double)WHIMSY_SAMPLE_RATE) * 4294967296.0;
    return (uint32_t)inc;
}

void whimsy_synth_init(WhimsySynthEngine *engine) {
    if (!engine) return;
    memset(engine, 0, sizeof(WhimsySynthEngine));

    /* Default mixer levels */
    for (int i = 0; i < 8; i++) {
        engine->mixer.fader[i] = 80; /* FADER_UNITY */
    }
    engine->mixer.master_volume = 80;
    engine->mixer.master_filter.cutoff = 14000;
    engine->mixer.master_filter.resonance = 4000;

    whimsy_synth_set_bpm(engine, 108);
}

void whimsy_synth_set_bpm(WhimsySynthEngine *engine, uint16_t bpm) {
    if (!engine) return;
    if (bpm < 36) bpm = 36;
    if (bpm > 208) bpm = 208;
    engine->bpm = bpm;
    /* 12-step loop: 1 eighth note step = (60 / bpm) / 2 seconds */
    double step_sec = (60.0 / (double)bpm) / 2.0;
    engine->samples_per_step = (uint32_t)(step_sec * WHIMSY_SAMPLE_RATE);
}

void whimsy_synth_trigger_note(WhimsySynthEngine *engine, WhimsyVoiceTrack track, uint8_t note, uint8_t velocity) {
    if (!engine || velocity == 0) return;
    uint32_t inc = midi_to_phase_inc(note);

    switch (track) {
        case WHIMSY_VOICE_LEAD:
            engine->lead_osc.phase_inc = inc;
            engine->lead_osc.env_level = 32767;
            engine->lead_osc.env_decay = 8;
            engine->lead_osc.active = true;
            engine->lead_osc.note = note;
            engine->lead_osc.velocity = velocity;
            break;
        case WHIMSY_VOICE_BASS:
            engine->bass_osc.phase_inc = inc;
            engine->bass_osc.env_level = 32767;
            engine->bass_osc.env_decay = 12;
            engine->bass_osc.active = true;
            engine->bass_osc.note = note;
            engine->bass_osc.velocity = velocity;
            break;
        case WHIMSY_VOICE_CHIME:
            engine->chime_osc.phase_inc = inc;
            engine->chime_osc.env_level = 32767;
            engine->chime_osc.env_decay = 4;
            engine->chime_osc.active = true;
            engine->chime_osc.note = note;
            engine->chime_osc.velocity = velocity;
            break;
        case WHIMSY_VOICE_MANUAL:
            for (int i = 0; i < 4; i++) {
                if (!engine->manual_osc[i].active) {
                    engine->manual_osc[i].phase_inc = inc;
                    engine->manual_osc[i].env_level = 32767;
                    engine->manual_osc[i].env_decay = 2;
                    engine->manual_osc[i].active = true;
                    engine->manual_osc[i].note = note;
                    engine->manual_osc[i].velocity = velocity;
                    break;
                }
            }
            break;
        case WHIMSY_VOICE_ORGAN:
            for (int i = 0; i < 3; i++) {
                if (!engine->organ_osc[i].active) {
                    engine->organ_osc[i].phase_inc = inc;
                    engine->organ_osc[i].env_level = 32767;
                    engine->organ_osc[i].env_decay = 3;
                    engine->organ_osc[i].active = true;
                    engine->organ_osc[i].note = note;
                    engine->organ_osc[i].velocity = velocity;
                    break;
                }
            }
            break;
        default:
            break;
    }
}

void whimsy_synth_release_note(WhimsySynthEngine *engine, WhimsyVoiceTrack track, uint8_t note) {
    if (!engine) return;
    switch (track) {
        case WHIMSY_VOICE_LEAD:
            if (engine->lead_osc.note == note) engine->lead_osc.env_decay = 32;
            break;
        case WHIMSY_VOICE_BASS:
            if (engine->bass_osc.note == note) engine->bass_osc.env_decay = 48;
            break;
        case WHIMSY_VOICE_MANUAL:
            for (int i = 0; i < 4; i++) {
                if (engine->manual_osc[i].active && engine->manual_osc[i].note == note) {
                    engine->manual_osc[i].env_decay = 24;
                }
            }
            break;
        case WHIMSY_VOICE_ORGAN:
            for (int i = 0; i < 3; i++) {
                if (engine->organ_osc[i].active && engine->organ_osc[i].note == note) {
                    engine->organ_osc[i].env_decay = 30;
                }
            }
            break;
        default:
            break;
    }
}

int whimsy_synth_render_block(WhimsySynthEngine *engine, int32_t *output, unsigned frames) {
    if (!engine || !output || frames != WHIMSY_BLOCK_FRAMES) return -1;

    for (unsigned f = 0; f < frames; f++) {
        int32_t mix_l = 0;
        int32_t mix_r = 0;

        /* Step sequencer advance */
        engine->step_sample_counter++;
        if (engine->step_sample_counter >= engine->samples_per_step) {
            engine->step_sample_counter = 0;
            engine->current_step = (engine->current_step + 1) % 12;
        }

        /* 1. LOLCODE Lead Voice (Detuned saw / pulse) */
        if (engine->lead_osc.active && !engine->mixer.muted[WHIMSY_VOICE_LEAD]) {
            int32_t sample = (int32_t)((engine->lead_osc.phase >> 16) - 32768);
            sample = (sample * engine->lead_osc.env_level) >> 15;
            sample = (sample * engine->mixer.fader[WHIMSY_VOICE_LEAD]) / 100;

            mix_l += sample;
            mix_r += sample;

            engine->lead_osc.phase += engine->lead_osc.phase_inc;
            engine->lead_osc.env_level -= engine->lead_osc.env_decay;
            if (engine->lead_osc.env_level <= 0) {
                engine->lead_osc.env_level = 0;
                engine->lead_osc.active = false;
            }
        }

        /* 2. Brainfuck Bass Voice (Sub-sine + resonant drive) */
        if (engine->bass_osc.active && !engine->mixer.muted[WHIMSY_VOICE_BASS]) {
            /* Approximate triangle/sine wave from phase */
            uint32_t ph = engine->bass_osc.phase;
            int32_t sample = (ph < 0x80000000u) ? (int32_t)(ph >> 15) - 32768 : 32767 - (int32_t)((ph - 0x80000000u) >> 15);
            sample = (sample * engine->bass_osc.env_level) >> 15;
            sample = (sample * engine->mixer.fader[WHIMSY_VOICE_BASS]) / 100;

            mix_l += sample;
            mix_r += sample;

            engine->bass_osc.phase += engine->bass_osc.phase_inc;
            engine->bass_osc.env_level -= engine->bass_osc.env_decay;
            if (engine->bass_osc.env_level <= 0) {
                engine->bass_osc.env_level = 0;
                engine->bass_osc.active = false;
            }
        }

        /* 3. Befunge Chord Organ */
        for (int i = 0; i < 3; i++) {
            if (engine->organ_osc[i].active && !engine->mixer.muted[WHIMSY_VOICE_ORGAN]) {
                int32_t sample = (int32_t)((engine->organ_osc[i].phase >> 16) - 32768);
                sample = (sample * engine->organ_osc[i].env_level) >> 16;
                sample = (sample * engine->mixer.fader[WHIMSY_VOICE_ORGAN]) / 100;

                mix_l += sample;
                mix_r += sample;

                engine->organ_osc[i].phase += engine->organ_osc[i].phase_inc;
                engine->organ_osc[i].env_level -= engine->organ_osc[i].env_decay;
                if (engine->organ_osc[i].env_level <= 0) {
                    engine->organ_osc[i].env_level = 0;
                    engine->organ_osc[i].active = false;
                }
            }
        }

        /* 4. Fun Machine Pad Manual */
        for (int i = 0; i < 4; i++) {
            if (engine->manual_osc[i].active && !engine->mixer.muted[WHIMSY_VOICE_MANUAL]) {
                int32_t sample = (int32_t)((engine->manual_osc[i].phase >> 16) - 32768);
                sample = (sample * engine->manual_osc[i].env_level) >> 16;
                sample = (sample * engine->mixer.fader[WHIMSY_VOICE_MANUAL]) / 100;

                mix_l += sample;
                mix_r += sample;

                engine->manual_osc[i].phase += engine->manual_osc[i].phase_inc;
                engine->manual_osc[i].env_level -= engine->manual_osc[i].env_decay;
                if (engine->manual_osc[i].env_level <= 0) {
                    engine->manual_osc[i].env_level = 0;
                    engine->manual_osc[i].active = false;
                }
            }
        }

        /* Apply Master Volume and scale to Q23 */
        mix_l = (mix_l * engine->mixer.master_volume) / 100;
        mix_r = (mix_r * engine->mixer.master_volume) / 100;

        /* Q15 to Q23 (shift left 8) with saturation */
        int32_t out_l = mix_l << 8;
        int32_t out_r = mix_r << 8;

        if (out_l > 8388607) out_l = 8388607;
        if (out_l < -8388608) out_l = -8388608;
        if (out_r > 8388607) out_r = 8388607;
        if (out_r < -8388608) out_r = -8388608;

        output[f * 2] = out_l;
        output[f * 2 + 1] = out_r;
    }

    return 0;
}
