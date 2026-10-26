#ifndef WHIMSY_FM1_APP_H
#define WHIMSY_FM1_APP_H

#include <stdint.h>
#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

void whimsy_app_init(void);
void whimsy_app_audio_render(int32_t *output, unsigned frames);
void whimsy_app_midi_note(uint8_t status, uint8_t note, uint8_t velocity);
void whimsy_app_control_poll(void);

#ifdef __cplusplus
}
#endif

#endif /* WHIMSY_FM1_APP_H */
