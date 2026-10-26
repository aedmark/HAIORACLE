#include "whimsy_fm1_synth.h"
#include <string.h>

/* Precomputed MIDI note to phase increment table for 44.1 kHz */
static const uint32_t MIDI_PHASE_INC[128] = {
    796254U, 843601U, 893765U, 946911U, 1003217U, 1062871U, 1126073U, 1193033U,
    1263974U, 1339134U, 1418763U, 1503127U, 1592507U, 1687203U, 1787529U, 1893821U,
    2006434U, 2125742U, 2252146U, 2386065U, 2527948U, 2678268U, 2837526U, 3006254U,
    3185015U, 3374406U, 3575058U, 3787642U, 4012867U, 4251485U, 4504291U, 4772130U,
    5055896U, 5356535U, 5675051U, 6012507U, 6370030U, 6748811U, 7150117U, 7575285U,
    8025735U, 8502970U, 9008582U, 9544261U, 10111792U, 10713070U, 11350103U, 12025015U,
    12740059U, 13497623U, 14300233U, 15150569U, 16051469U, 17005939U, 18017165U, 19088521U,
    20223584U, 21426141U, 22700205U, 24050030U, 25480119U, 26995246U, 28600467U, 30301139U,
    32102938U, 34011878U, 36034330U, 38177043U, 40447168U, 42852281U, 45400411U, 48100060U,
    50960238U, 53990491U, 57200933U, 60602278U, 64205876U, 68023757U, 72068660U, 76354085U,
    80894335U, 85704563U, 90800821U, 96200119U, 101920476U, 107980983U, 114401866U, 121204555U,
    128411753U, 136047513U, 144137319U, 152708170U, 161788671U, 171409126U, 181601643U, 192400238U,
    203840952U, 215961966U, 228803732U, 242409110U, 256823506U, 272095026U, 288274639U, 305416341U,
    323577341U, 342818251U, 363203285U, 384800477U, 407681904U, 431923931U, 457607465U, 484818220U,
    513647012U, 544190053U, 576549277U, 610832681U, 647154683U, 685636503U, 726406571U, 769600953U,
    815363807U, 863847862U, 915214929U, 969636441U, 1027294024U, 1088380105U, 1153098554U, 1221665363U
};

/* Convert MIDI note number to phase increment for 44.1 kHz */
static inline uint32_t midi_to_phase_inc(uint8_t note) {
    if (note > 127) note = 127;
    return MIDI_PHASE_INC[note];
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
