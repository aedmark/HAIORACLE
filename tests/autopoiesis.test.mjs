import test from "node:test";
import assert from "node:assert/strict";
import {
  isValidGraph,
  buildGraph,
  createRingGraph,
  createTonnetzGraph,
  computeGraphLaplacian,
  computeGradientNorm,
  computeResidual,
  stepAutopoiesis,
  solveAutopoieticSteadyState,
  checkSpectralViability,
  cliffordAttractor,
  deJongAttractor,
  generateAttractorPoints,
  attractorParamsFromScore,
  FIBONACCI_RATIO,
  fibonacciDelayTaps,
  computeTonnetzHarmonicField,
  fractalArpeggioSequence,
} from "../src/autopoiesis.mjs";

test("P9-01 graph construction and validation", () => {
  assert.equal(isValidGraph(null), false);
  assert.equal(isValidGraph({}), false);
  assert.equal(isValidGraph({ nodesCount: 1 }), false);

  const ring = createRingGraph(8, 1.5);
  assert.equal(isValidGraph(ring), true);
  assert.equal(ring.nodesCount, 8);
  for (let i = 0; i < 8; i += 1) {
    const adj = ring.neighbors[i];
    assert.equal(adj.length, 2, "ring nodes have exactly degree 2");
    assert.equal(adj[0].weight, 1.5);
    assert.equal(adj[1].weight, 1.5);
  }

  const tonnetz = createTonnetzGraph();
  assert.equal(isValidGraph(tonnetz), true);
  assert.equal(tonnetz.nodesCount, 12, "Tonnetz represents 12 chromatic pitch classes");
});

test("P9-01 discrete graph Laplacian invariants: L 1 = 0 and symmetry", () => {
  const ring = createRingGraph(16);
  const ones = new Float64Array(16).fill(3.14);
  const lapOnes = computeGraphLaplacian(ones, ring);

  for (let i = 0; i < 16; i += 1) {
    assert.ok(Math.abs(lapOnes[i]) < 1e-12, "Laplacian of constant field is zero");
  }

  // Symmetry: x^T L y == y^T L x
  const x = new Float64Array(16);
  const y = new Float64Array(16);
  for (let i = 0; i < 16; i += 1) {
    x[i] = Math.sin(i * 0.5);
    y[i] = Math.cos(i * 0.7);
  }
  const lx = computeGraphLaplacian(x, ring);
  const ly = computeGraphLaplacian(y, ring);

  let xTLy = 0;
  let yTLx = 0;
  for (let i = 0; i < 16; i += 1) {
    xTLy += x[i] * ly[i];
    yTLx += y[i] * lx[i];
  }
  assert.ok(Math.abs(xTLy - yTLx) < 1e-12, "Graph Laplacian is self-adjoint / symmetric");
});

test("P9-01 discrete gradient norm evaluates tension and boundary differences", () => {
  const ring = createRingGraph(8);
  const constant = new Float64Array(8).fill(5.0);
  const gradZero = computeGradientNorm(constant, ring);
  for (let i = 0; i < 8; i += 1) {
    assert.equal(gradZero[i], 0, "Gradient norm of flat field is 0");
  }

  // Step impulse at node 0
  const impulse = new Float64Array(8);
  impulse[0] = 1.0;
  const gradImpulse = computeGradientNorm(impulse, ring);
  assert.ok(gradImpulse[0] > 0, "Node 0 has positive gradient norm against neighbors");
  assert.ok(gradImpulse[1] > 0, "Node 1 has positive gradient norm against node 0");
  assert.equal(gradImpulse[4], 0, "Distant node 4 has zero gradient norm");
});

test("P9-01 Creative Determinant residual and autopoietic relaxation flow", () => {
  const ring = createRingGraph(12);
  const phi0 = new Float64Array(12).fill(0.5);
  const params = { a: 0.2, b: 1.0, c: 1.0, p: 2 };

  const initialRes = computeResidual(phi0, params, ring);
  assert.equal(initialRes.length, 12);

  // Relax toward steady state using Picard iteration
  const result = solveAutopoieticSteadyState(phi0, params, ring, { maxIterations: 600, tolerance: 1e-4, dt: 0.04 });
  assert.equal(result.converged, true, "Picard iteration converges to autopoietic steady state");
  assert.ok(result.residualNorm < 1e-4, "Residual norm drops below tolerance");

  // On a flat field where L phi = 0 and grad phi = 0:
  // (L phi) - a|grad| - b*phi + c*phi^2 = 0 => -b*phi + c*phi^2 = 0 => phi*(c*phi - b) = 0 => phi = b/c = 1.0
  for (let i = 0; i < 12; i += 1) {
    assert.ok(Math.abs(result.phi[i] - 1.0) < 1e-3, "Flat steady state matches theoretical equilibrium b/c");
  }
});

test("P9-01 Spectral viability threshold condition λ_1(L - diag(b)) < 0", () => {
  const ring = createRingGraph(8);
  // Case 1: Vitality b = 2.0 (high internal growth) => λ_1(L - diag(b)) = 0 - 2 = -2 < 0 (viable!)
  const viableCheck = checkSpectralViability(ring, 2.0);
  assert.equal(viableCheck.isViable, true);
  assert.ok(viableCheck.principalEigenvalue < 0);

  // Case 2: Vitality b = -1.0 (decay exceeds diffusion) => λ_1(L - diag(b)) = 0 - (-1) = +1 > 0 (subcritical/non-viable)
  const nonViableCheck = checkSpectralViability(ring, -1.0);
  assert.equal(nonViableCheck.isViable, false);
  assert.ok(nonViableCheck.principalEigenvalue > 0);
});

test("P9-01 Clifford and De Jong strange attractor fractal point generators", () => {
  const [cx, cy] = cliffordAttractor(0.1, 0.1, -1.4, 1.6, 1.0, 0.7);
  assert.ok(Number.isFinite(cx));
  assert.ok(Number.isFinite(cy));

  const [dx, dy] = deJongAttractor(0.1, 0.1, 1.4, -2.3, 2.4, -2.1);
  assert.ok(Number.isFinite(dx));
  assert.ok(Number.isFinite(dy));

  const pts = generateAttractorPoints(cliffordAttractor, { a: -1.4, b: 1.6, c: 1.0, d: 0.7 }, 500, 50);
  assert.equal(pts.length, 1000, "500 2D points = 1000 float coordinates");
  for (let i = 0; i < pts.length; i += 1) {
    assert.ok(!Number.isNaN(pts[i]), "Attractor coordinates are non-NaN");
  }

  // Deterministic params from score
  const score = { seed: 0x12345678 };
  const params1 = attractorParamsFromScore(score);
  const params2 = attractorParamsFromScore(score);
  assert.deepEqual(params1, params2, "Attractor params from score are deterministic");
  assert.ok(params1.a >= -2.5 && params1.a <= 2.5);
  assert.ok(params1.b >= -2.5 && params1.b <= 2.5);
  assert.ok(params1.c >= -2.5 && params1.c <= 2.5);
  assert.ok(params1.d >= -2.5 && params1.d <= 2.5);
});

test("P9-03 Fibonacci fractal delay taps, Tonnetz harmonic field, and fractal arpeggios", () => {
  // 1. Fibonacci delay taps
  const unit = 0.25; // 250ms
  const taps = fibonacciDelayTaps(unit, 4);
  assert.equal(taps.length, 4);
  assert.equal(taps[0], 0.25);
  assert.ok(Math.abs(taps[1] - 0.25 / FIBONACCI_RATIO) < 1e-12);
  assert.ok(taps[1] < taps[0] && taps[2] < taps[1] && taps[3] < taps[2]);

  // 2. Tonnetz harmonic field across chord progression
  const spine = [
    { pitchClasses: [0, 4, 7] }, // C major
    { pitchClasses: [9, 0, 4] }, // A minor (parsimonious R neighbor)
    { pitchClasses: [5, 9, 0] }, // F major
    { pitchClasses: [7, 11, 2] }, // G major
  ];
  const field = computeTonnetzHarmonicField(spine);
  assert.equal(field.vitalityProfile.length, 4);
  assert.ok(field.meanVitality > 0 && field.meanVitality <= 1.0);
  assert.ok(field.maxContradiction > 0);

  // 3. Fractal recursive arpeggiation
  const triad = [0, 4, 7];
  const seq1 = fractalArpeggioSequence(triad, 1);
  assert.deepEqual(seq1, triad);
  const seq2 = fractalArpeggioSequence(triad, 2);
  assert.equal(seq2.length, 9, "Depth 2 on 3-note chord yields 3*3 = 9 fractal notes");
  assert.equal(seq2[0], 0);
});

