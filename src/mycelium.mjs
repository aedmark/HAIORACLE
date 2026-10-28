// The mycelium's bio-acoustic voice (P5-16, D-042). Each of the eight
// sporophore forms has its own sound: what its spikes, droplets, and spore
// puffs are made of, and when they fall in the 12-step loop. The other three
// fungal score fields shape it within that form: hyphae set how many spikes a
// train fires and rotate the patterns, spores set how loud and how often the
// puffs are, and bloom tilts every pitch up or down by up to half an octave.
// Pure: returns events for src/app.mjs to sound.
//
// Every event is either a tone (an oscillator, optionally swept and
// bandpassed) or a noise burst (bandpassed noise). Times are fractions of the
// step, so the pattern breathes with the tempo.

const voice = (pattern, sound) => Object.freeze({ pattern, ...sound });

// Patterns are 12 characters, one per step: "x" fires, "." rests.
export const FUNGAL_SOUNDS = Object.freeze([
  // AGARIC CAP: the classic gill: bright action-potential clicks, a falling
  // guttation drop, and soft spore pops.
  Object.freeze({
    spikes: voice("x..x..x..x..", { wave: "sine", freq: 2800, step: 620, band: [3600, 5.5], decay: 0.018, spacing: 0.032, count: [2, 4], peak: 0.03 }),
    drops: voice("....x.....x.", { wave: "sine", freq: 1540, to: 0.42, decay: 0.085, peak: 0.04 }),
    puffs: voice(".x...x...x..", { band: [2100, 3.2], decay: 0.045, peak: 0.03 }),
  }),
  // BRACKET CONK: a woody shelf: low hollow knocks, a slow heavy drip, and
  // dry, dusty puffs.
  Object.freeze({
    spikes: voice("x...x.x...x.", { wave: "triangle", freq: 520, to: 0.72, step: 140, band: [900, 3], decay: 0.06, spacing: 0.09, count: [1, 2], peak: 0.07 }),
    drops: voice("......x.....", { wave: "sine", freq: 700, to: 0.7, decay: 0.15, peak: 0.05 }),
    puffs: voice("..x.......x.", { band: [900, 2], decay: 0.035, peak: 0.04 }),
  }),
  // CORAL CLAVARIA: branching glass: rising trains of high glints, a short
  // bright drop, and airy hiss.
  Object.freeze({
    spikes: voice("x..x....x...", { wave: "sine", freq: 4800, step: 700, band: [6000, 8], decay: 0.03, spacing: 0.022, count: [3, 6], peak: 0.026 }),
    drops: voice("...x....x...", { wave: "sine", freq: 2600, to: 0.6, decay: 0.06, peak: 0.035 }),
    puffs: voice("x.....x.....", { band: [6500, 4], decay: 0.05, peak: 0.022 }),
  }),
  // BIOLUMINESCENT BONNET: a glow: slow shimmering pings stacked like a
  // chord, a drop that rises instead of falling, and a faint sparkle.
  Object.freeze({
    spikes: voice("x.....x.....", { wave: "sine", freq: 3300, to: 1.05, ratios: [1, 1.5, 2], band: null, decay: 0.32, spacing: 0.07, count: [2, 3], peak: 0.022 }),
    drops: voice("...x.....x..", { wave: "sine", freq: 1800, to: 1.4, decay: 0.2, peak: 0.03 }),
    puffs: voice("........x...", { band: [4500, 6], decay: 0.08, peak: 0.016 }),
  }),
  // CUP PEZIZA: a hollow cup: upward bloops like a bottle filling, a ringing
  // drop, and hollow, resonant puffs.
  Object.freeze({
    spikes: voice("x.....x..x..", { wave: "sine", freq: 300, to: 1.6, band: [650, 3.5], decay: 0.12, spacing: 0.1, count: [1, 2], peak: 0.05 }),
    drops: voice("...x........", { wave: "triangle", freq: 1200, to: 0.5, decay: 0.12, peak: 0.04 }),
    puffs: voice(".x...x...x..", { band: [450, 6], decay: 0.07, peak: 0.06 }),
  }),
  // MOREL HONEYCOMB: cellular ticking: fast bursts of tiny square ticks, a
  // rare drop, and a single sharp puff.
  Object.freeze({
    spikes: voice("xxx.xx.xxx.x", { wave: "square", freq: 1800, step: 90, band: [2500, 4], decay: 0.008, spacing: 0.018, count: [3, 5], peak: 0.018 }),
    drops: voice("..........x.", { wave: "sine", freq: 2200, to: 0.5, decay: 0.07, peak: 0.03 }),
    puffs: voice("....x.......", { band: [3000, 5], decay: 0.03, peak: 0.03 }),
  }),
  // GLOBULAR PUFFBALL: big soft clouds of spores on the beat, a few muffled
  // taps, and a low drop.
  Object.freeze({
    spikes: voice(".....x.....x", { wave: "sine", freq: 1200, step: 0, band: [1400, 2], decay: 0.04, spacing: 0.05, count: [1, 2], peak: 0.035 }),
    drops: voice(".........x..", { wave: "sine", freq: 900, to: 0.6, decay: 0.12, peak: 0.04 }),
    puffs: voice("x..x..x..x..", { band: [700, 1.2], decay: 0.18, peak: 0.07 }),
  }),
  // HYPHAL HYDRA: many heads calling: upward chirps in climbing trains, a
  // falling drop, and scattered puffs.
  Object.freeze({
    spikes: voice("x..x.x..x.x.", { wave: "sine", freq: 1500, to: 1.4, step: 260, band: [2200, 3.5], decay: 0.05, spacing: 0.045, count: [2, 5], peak: 0.03 }),
    drops: voice(".x.....x....", { wave: "sine", freq: 2000, to: 0.4, decay: 0.09, peak: 0.035 }),
    puffs: voice("....x....x..", { band: [1800, 3], decay: 0.05, peak: 0.03 }),
  }),
]);

const fires = (pattern, step, rotation, stepsCount = 12) => {
  const normStep = stepsCount === 16 ? Math.floor((step * pattern.length) / 16) : step;
  return pattern[(normStep + rotation) % pattern.length] === "x";
};

/**
 * The mycelium's events for one loop step. `hold` is the vitrine press (0..1),
 * which brightens and lifts everything a little, as before.
 */
export function myceliumEvents(score, stepIndex, hold = 0, stepsCount = 12) {
  const sound = FUNGAL_SOUNDS[score.fungalForm] ?? FUNGAL_SOUNDS[0];
  const steps = stepsCount || 12;
  const step = ((stepIndex % steps) + steps) % steps;
  const rotation = score.fungalHyphae % 12;
  const tilt = 2 ** ((score.fungalBloom - 55) / 90);
  const lift = 1 + hold * 0.2;
  const events = [];

  const { spikes, drops, puffs } = sound;
  if (fires(spikes.pattern, step, rotation, steps)) {
    const [fewest, most] = spikes.count;
    const count = fewest + Math.round(((score.fungalHyphae - 10) / 90) * (most - fewest));
    for (let p = 0; p < count; p += 1) {
      const freq = (spikes.freq + (spikes.step ?? 0) * p) * tilt * (spikes.ratios ? spikes.ratios[p % spikes.ratios.length] : 1);
      events.push({
        kind: "tone",
        at: p * spikes.spacing,
        wave: spikes.wave,
        freq,
        to: freq * (spikes.to ?? 1),
        band: spikes.band ? [spikes.band[0] * tilt, spikes.band[1]] : null,
        decay: spikes.decay,
        peak: spikes.peak * (0.75 + score.fungalHyphae / 400) * lift,
        pan: ((p % 3) - 1) * 0.35,
      });
    }
  }
  if (fires(drops.pattern, step, rotation, steps)) {
    const freq = drops.freq * tilt;
    events.push({ kind: "tone", at: 0.28, wave: drops.wave, freq, to: freq * drops.to, band: null, decay: drops.decay, peak: drops.peak * (0.75 + score.fungalBloom / 400) * lift, pan: 0.2 });
  }
  // Sparse spores puff only on their pattern; dense spores (over 60) also
  // puff a step later, so a spore-heavy creature hisses more often.
  const puffNow = fires(puffs.pattern, step, rotation, steps) || (score.fungalSpores > 60 && fires(puffs.pattern, step + (steps - 1), rotation, steps));
  if (puffNow && score.fungalSpores > 20) {
    events.push({ kind: "noise", at: 0.52, band: [puffs.band[0] * tilt, puffs.band[1]], decay: puffs.decay, peak: puffs.peak * (0.6 + score.fungalSpores / 150) * lift, pan: -0.2 });
  }
  return events;
}
