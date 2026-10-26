#include "whimsy_fm1_ui.h"
#include <string.h>

/* Precomputed Bell Jar glass arch coordinates (cx=120, cy=95, r=48) */
static const int16_t BELL_JAR_ARCH[46][2] = {
    {72, 95}, {72, 92}, {72, 90}, {73, 88},
    {74, 85}, {75, 83}, {76, 80}, {78, 78},
    {79, 76}, {81, 74}, {83, 72}, {85, 70},
    {88, 68}, {90, 67}, {93, 65}, {96, 64},
    {99, 63}, {102, 62}, {105, 61}, {108, 60},
    {112, 60}, {115, 59}, {118, 59}, {122, 59},
    {125, 59}, {128, 60}, {132, 60}, {135, 61},
    {138, 62}, {141, 63}, {144, 64}, {147, 65},
    {150, 67}, {152, 68}, {155, 70}, {157, 72},
    {159, 74}, {161, 76}, {162, 78}, {164, 80},
    {165, 83}, {166, 85}, {167, 88}, {168, 90},
    {168, 92}, {168, 95}
};

void whimsy_tft_clear(WhimsyTftCanvas *canvas, uint16_t color) {
    if (!canvas) return;
    for (int y = 0; y < FM1_TFT_HEIGHT; y++) {
        for (int x = 0; x < FM1_TFT_WIDTH; x++) {
            canvas->buffer[y][x] = color;
        }
    }
}

void whimsy_tft_draw_pixel(WhimsyTftCanvas *canvas, int x, int y, uint16_t color) {
    if (!canvas || x < 0 || x >= FM1_TFT_WIDTH || y < 0 || y >= FM1_TFT_HEIGHT) return;
    canvas->buffer[y][x] = color;
}

void whimsy_tft_fill_rect(WhimsyTftCanvas *canvas, int x, int y, int w, int h, uint16_t color) {
    if (!canvas || w <= 0 || h <= 0) return;
    int x0 = x < 0 ? 0 : x;
    int y0 = y < 0 ? 0 : y;
    int x1 = (x + w) > FM1_TFT_WIDTH ? FM1_TFT_WIDTH : (x + w);
    int y1 = (y + h) > FM1_TFT_HEIGHT ? FM1_TFT_HEIGHT : (y + h);

    for (int j = y0; j < y1; j++) {
        for (int i = x0; i < x1; i++) {
            canvas->buffer[j][i] = color;
        }
    }
}

void whimsy_tft_draw_rect(WhimsyTftCanvas *canvas, int x, int y, int w, int h, uint16_t color) {
    if (!canvas || w <= 0 || h <= 0) return;
    for (int i = x; i < x + w; i++) {
        whimsy_tft_draw_pixel(canvas, i, y, color);
        whimsy_tft_draw_pixel(canvas, i, y + h - 1, color);
    }
    for (int j = y; j < y + h; j++) {
        whimsy_tft_draw_pixel(canvas, x, j, color);
        whimsy_tft_draw_pixel(canvas, x + w - 1, j, color);
    }
}

void whimsy_tft_render_tracker(WhimsyTftCanvas *canvas, uint8_t current_step, uint8_t held_key) {
    (void)held_key;
    if (!canvas) return;
    /* 12-Step tracker ribbon: 240px wide -> 12 cells of 18px with 2px gaps */
    const int start_x = 6;
    const int cell_w = 17;
    const int cell_h = 14;
    const int start_y = 6;

    for (int i = 0; i < 12; i++) {
        int x = start_x + i * (cell_w + 2);
        bool is_cur = (current_step % 12) == i;
        uint16_t bg = is_cur ? COLOR_CYAN_AMULET : COLOR_OXBLOOD;
        uint16_t border = is_cur ? COLOR_BRASS_BRT : COLOR_BRASS;

        whimsy_tft_fill_rect(canvas, x, start_y, cell_w, cell_h, bg);
        whimsy_tft_draw_rect(canvas, x, start_y, cell_w, cell_h, border);
    }
}

void whimsy_tft_render_vitrine(WhimsyTftCanvas *canvas, uint32_t seed, uint8_t shape, uint8_t flux_phase) {
    (void)seed;
    (void)shape;
    (void)flux_phase;
    if (!canvas) return;

    /* Centered Bell Jar outline (x: 50..190, y: 30..165) */
    const int cx = 120;
    const int cy = 95;

    /* Glass bell jar arch */
    for (int i = 0; i < 46; i++) {
        int px = BELL_JAR_ARCH[i][0];
        int py = BELL_JAR_ARCH[i][1];
        whimsy_tft_draw_pixel(canvas, px, py, COLOR_BRASS);
        whimsy_tft_draw_pixel(canvas, px, py + 1, COLOR_BRASS);
    }

    /* Vitrine mahogany pedestal base (y: 155..165) */
    whimsy_tft_fill_rect(canvas, cx - 58, 155, 116, 8, COLOR_BRASS);
    whimsy_tft_fill_rect(canvas, cx - 64, 163, 128, 4, COLOR_OXBLOOD);

    /* Specimen procedural core silhouette (glowing ellipse inside) */
    for (int y = -24; y <= 24; y++) {
        for (int x = -24; x <= 24; x++) {
            if ((x * x + y * y) <= 24 * 24) {
                uint16_t tint = ((x * x + y * y) < 14 * 14) ? COLOR_PARCHMENT_LT : COLOR_VERDIGRIS;
                whimsy_tft_draw_pixel(canvas, cx + x, cy + y + 10, tint);
            }
        }
    }
}

void whimsy_tft_render_tonnetz(WhimsyTftCanvas *canvas, uint8_t active_region, const char *chord_name) {
    (void)chord_name;
    if (!canvas) return;
    /* 4-Region Tonnetz lattice compass (y: 180..232) */
    const int box_w = 52;
    const int box_h = 24;
    const int start_x = 12;
    const int start_y = 195;

    for (int r = 0; r < 4; r++) {
        int x = start_x + r * (box_w + 4);
        bool is_active = (active_region % 4) == r;
        uint16_t bg = is_active ? COLOR_BRASS : COLOR_OBSIDIAN;
        uint16_t border = is_active ? COLOR_BRASS_BRT : COLOR_VERDIGRIS;

        whimsy_tft_fill_rect(canvas, x, start_y, box_w, box_h, bg);
        whimsy_tft_draw_rect(canvas, x, start_y, box_w, box_h, border);
    }
}

void whimsy_tft_render_frame(WhimsyTftCanvas *canvas,
                             uint32_t seed,
                             uint8_t shape,
                             uint8_t current_step,
                             uint8_t active_region,
                             const char *specimen_name,
                             const char *genre_name) {
    if (!canvas) return;
    (void)specimen_name;
    (void)genre_name;

    whimsy_tft_clear(canvas, COLOR_OBSIDIAN);
    whimsy_tft_render_tracker(canvas, current_step, 0);
    whimsy_tft_render_vitrine(canvas, seed, shape, current_step);
    whimsy_tft_render_tonnetz(canvas, active_region, "TONIC");
}
