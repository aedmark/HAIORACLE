#ifndef WHIMSY_FM1_UI_H
#define WHIMSY_FM1_UI_H

#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

#define FM1_TFT_WIDTH  240
#define FM1_TFT_HEIGHT 240

/* ---------------------------------------------------------------------------
 * RGB565 Victorian Parlor Color Palette (D-074)
 * --------------------------------------------------------------------------- */
enum {
    COLOR_OBSIDIAN    = 0x0841, /* #0d0a09 - Deep parlor soot */
    COLOR_PARCHMENT   = 0xef5a, /* #e4d7be - Warm vintage paper */
    COLOR_PARCHMENT_LT= 0xf75d, /* #f2e8d5 - Highlight cream */
    COLOR_BRASS       = 0xbd29, /* #b89249 - Tarnished Victorian brass */
    COLOR_BRASS_BRT   = 0xdd8d, /* #d9b86c - Glowing bright brass */
    COLOR_OXBLOOD     = 0x6905, /* #6b1f28 - Deep velvet red */
    COLOR_VERDIGRIS   = 0x3acb, /* #395c52 - Antique patina green */
    COLOR_CYAN_AMULET = 0x07ff  /* Cyan step cursor */
};

/* ---------------------------------------------------------------------------
 * FM-1 TFT Display Framebuffer Renderer
 * --------------------------------------------------------------------------- */
typedef struct {
    uint16_t buffer[FM1_TFT_HEIGHT][FM1_TFT_WIDTH];
} WhimsyTftCanvas;

void whimsy_tft_clear(WhimsyTftCanvas *canvas, uint16_t color);
void whimsy_tft_draw_pixel(WhimsyTftCanvas *canvas, int x, int y, uint16_t color);
void whimsy_tft_fill_rect(WhimsyTftCanvas *canvas, int x, int y, int w, int h, uint16_t color);
void whimsy_tft_draw_rect(WhimsyTftCanvas *canvas, int x, int y, int w, int h, uint16_t color);

/* Draw the 12-Step tracker ribbon across the top (y: 6..22) */
void whimsy_tft_render_tracker(WhimsyTftCanvas *canvas, uint8_t current_step, uint8_t held_key);

/* Draw the Victorian apparition vitrine bell jar and specimen silhouette (center: 120, 110) */
void whimsy_tft_render_vitrine(WhimsyTftCanvas *canvas, uint32_t seed, uint8_t shape, uint8_t flux_phase);

/* Draw the Neo-Riemannian Tonnetz harmonic compass lattice (bottom: y: 180..232) */
void whimsy_tft_render_tonnetz(WhimsyTftCanvas *canvas, uint8_t active_region, const char *chord_name);

/* Draw complete Whimsy Machine FM-1 UI Frame */
void whimsy_tft_render_frame(WhimsyTftCanvas *canvas,
                             uint32_t seed,
                             uint8_t shape,
                             uint8_t current_step,
                             uint8_t active_region,
                             const char *specimen_name,
                             const char *genre_name);

#ifdef __cplusplus
}
#endif

#endif /* WHIMSY_FM1_UI_H */
