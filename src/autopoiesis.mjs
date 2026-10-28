/**
 * The Whimsy Machine — Autopoietic Creative Determinant & Fractal Morphogenesis Engine
 *
 * Implements the discrete graph and continuous 1D boundary formulation of the
 * Creative Determinant (CD) autopoietic field theory developed by Nelson Spence / Project Navi:
 *   -ΔΦ = a|∇Φ| + bΦ - c(Φ_+)^p
 *
 * On a finite weighted graph G = (V, E, W):
 *   (L Φ)_x = a(x) ||∇Φ||_x + b(x) Φ(x) - c(x) (Φ(x)^+)^p
 *
 * The three governing forces:
 *   1. Coherence (L Φ): Discrete graph Laplacian diffusion maintaining structural identity.
 *   2. Contradiction (a ||∇Φ||): Gradient transport / difference driving exploration.
 *   3. Care (-c (Φ^+)^p): Nonlinear saturation ceiling enforcing safe containment.
 *
 * References:
 *   - Spence, N. (2026). "The Creative Determinant: Autopoietic Closure as a Nonlinear
 *     Elliptic Boundary Value Problem with a Lean 4 Formalization", Project Navi.
 *   - GitHub: https://github.com/Project-Navi/navi-creative-determinant
 */

/**
 * Standard power for nonlinear autopoietic saturation (p > 1).
 */
export const DEFAULT_SATURATION_POWER = 2;

/**
 * Validate finite weighted graph structure.
 * Graph shape: { nodesCount: N, edges: [{ from, to, weight }], neighbors: Array(N) of [{ to, weight }] }
 *
 * @param {object} graph
 * @returns {boolean}
 */
export function isValidGraph(graph) {
  if (!graph || typeof graph !== "object") return false;
  const n = graph.nodesCount;
  if (!Number.isInteger(n) || n < 2) return false;
  if (!Array.isArray(graph.neighbors) || graph.neighbors.length !== n) return false;
  for (let i = 0; i < n; i += 1) {
    const adj = graph.neighbors[i];
    if (!Array.isArray(adj)) return false;
    for (const e of adj) {
      if (!Number.isInteger(e.to) || e.to < 0 || e.to >= n) return false;
      if (typeof e.weight !== "number" || !Number.isFinite(e.weight) || e.weight <= 0) return false;
    }
  }
  return true;
}

/**
 * Constructs an adjacency neighbor-list graph from an edge list.
 *
 * @param {number} nodesCount
 * @param {Array<{from: number, to: number, weight?: number}>} edges
 * @returns {object}
 */
export function buildGraph(nodesCount, edges) {
  if (!Number.isInteger(nodesCount) || nodesCount < 2) {
    throw new TypeError(`buildGraph requires integer nodesCount >= 2, got ${nodesCount}`);
  }
  const neighbors = Array.from({ length: nodesCount }, () => []);
  for (const edge of edges) {
    const { from, to, weight = 1.0 } = edge;
    if (from < 0 || from >= nodesCount || to < 0 || to >= nodesCount) {
      throw new RangeError(`Edge indices [${from}, ${to}] out of bounds for N=${nodesCount}`);
    }
    if (from === to) continue; // no self-loops
    neighbors[from].push({ to, weight });
    neighbors[to].push({ to: from, weight });
  }
  return Object.freeze({
    nodesCount,
    neighbors: Object.freeze(neighbors.map((list) => Object.freeze(list.map((e) => Object.freeze({ ...e }))))),
  });
}

/**
 * Creates a 1D circular ring graph (S^1 discretization) of N vertices.
 * Models the creature's closed perimeter in the vitrine.
 *
 * @param {number} nodesCount
 * @param {number} weight
 * @returns {object}
 */
export function createRingGraph(nodesCount = 64, weight = 1.0) {
  const edges = [];
  for (let i = 0; i < nodesCount; i += 1) {
    const next = (i + 1) % nodesCount;
    edges.push({ from: i, to: next, weight });
  }
  return buildGraph(nodesCount, edges);
}

/**
 * Creates a Neo-Riemannian Tonnetz torus graph connecting the 12 pitch classes
 * across Parallel (P), Leading-Tone (L), and Relative (R) harmonic transformations.
 *
 * @returns {object}
 */
export function createTonnetzGraph() {
  const edges = [];
  // Standard semitone pitch classes: 0 = C, 1 = C#, ..., 11 = B
  // Major and minor triads connected by P, L, R operations on pitch classes:
  // P: minor 3rd swap (e.g. C major {0, 4, 7} <-> C minor {0, 3, 7}) => semitone shift between 3 and 4
  // L: root leading tone swap (e.g. C major {0, 4, 7} <-> E minor {4, 7, 11}) => semitone shift between 0 and 11
  // R: relative major/minor (e.g. C major {0, 4, 7} <-> A minor {9, 0, 4}) => whole step shift between 7 and 9
  for (let i = 0; i < 12; i += 1) {
    // Fifths circle connection (coherence spine)
    edges.push({ from: i, to: (i + 7) % 12, weight: 1.0 });
    // Major thirds connection (L axis)
    edges.push({ from: i, to: (i + 4) % 12, weight: 0.8 });
    // Minor thirds connection (P axis)
    edges.push({ from: i, to: (i + 3) % 12, weight: 0.6 });
  }
  return buildGraph(12, edges);
}

/**
 * Computes the discrete graph Laplacian (L Φ)_x = Σ_{y ~ x} w(x,y) (Φ(x) - Φ(y)).
 *
 * @param {Float64Array|Array<number>} phi
 * @param {object} graph
 * @returns {Float64Array}
 */
export function computeGraphLaplacian(phi, graph) {
  const n = graph.nodesCount;
  const out = new Float64Array(n);
  for (let x = 0; x < n; x += 1) {
    const phiX = phi[x];
    let sum = 0;
    const adj = graph.neighbors[x];
    for (let j = 0; j < adj.length; j += 1) {
      const { to: y, weight } = adj[j];
      sum += weight * (phiX - phi[y]);
    }
    out[x] = sum;
  }
  return out;
}

/**
 * Computes the discrete gradient norm ||∇Φ||_x = sqrt(Σ_{y ~ x} w(x,y) (Φ(x) - Φ(y))^2).
 * Represents local tension and contradiction.
 *
 * @param {Float64Array|Array<number>} phi
 * @param {object} graph
 * @returns {Float64Array}
 */
export function computeGradientNorm(phi, graph) {
  const n = graph.nodesCount;
  const out = new Float64Array(n);
  for (let x = 0; x < n; x += 1) {
    const phiX = phi[x];
    let sumSq = 0;
    const adj = graph.neighbors[x];
    for (let j = 0; j < adj.length; j += 1) {
      const { to: y, weight } = adj[j];
      const diff = phiX - phi[y];
      sumSq += weight * diff * diff;
    }
    out[x] = Math.sqrt(sumSq);
  }
  return out;
}

/**
 * Evaluates the Creative Determinant residual vector:
 *   R(Φ)_x = (L Φ)_x - a(x)||∇Φ||_x - b(x)Φ(x) + c(x)(Φ(x)^+)^p
 *
 * @param {Float64Array|Array<number>} phi
 * @param {object} params - { a, b, c, p?: number } where a, b, c can be scalars or arrays
 * @param {object} graph
 * @returns {Float64Array}
 */
export function computeResidual(phi, params, graph) {
  const { a = 0.5, b = 1.0, c = 1.0, p = DEFAULT_SATURATION_POWER } = params;
  const n = graph.nodesCount;
  const lap = computeGraphLaplacian(phi, graph);
  const grad = computeGradientNorm(phi, graph);
  const res = new Float64Array(n);

  const getCoeff = (v, idx) => (typeof v === "number" ? v : v[idx] ?? 0);

  for (let x = 0; x < n; x += 1) {
    const aVal = getCoeff(a, x);
    const bVal = getCoeff(b, x);
    const cVal = getCoeff(c, x);
    const phiX = phi[x];
    const posPart = Math.max(0, phiX);
    const sat = cVal * Math.pow(posPart, p);

    res[x] = lap[x] - (aVal * grad[x]) - (bVal * phiX) + sat;
  }
  return res;
}

/**
 * Performs one discrete dynamical time-step of the autopoietic relaxation flow:
 *   dΦ/dt = -R(Φ) = -(L Φ) + a||∇Φ|| + bΦ - c(Φ^+)^p
 *
 * @param {Float64Array|Array<number>} phi
 * @param {object} params - { a, b, c, p?: number }
 * @param {object} graph
 * @param {number} dt - Time step size (e.g. 0.01 - 0.05 for numerical stability)
 * @returns {Float64Array}
 */
export function stepAutopoiesis(phi, params, graph, dt = 0.02) {
  const { a = 0.5, b = 1.0, c = 1.0, p = DEFAULT_SATURATION_POWER } = params;
  const n = graph.nodesCount;
  const lap = computeGraphLaplacian(phi, graph);
  const grad = computeGradientNorm(phi, graph);
  const next = new Float64Array(n);

  const getCoeff = (v, idx) => (typeof v === "number" ? v : v[idx] ?? 0);

  for (let x = 0; x < n; x += 1) {
    const aVal = getCoeff(a, x);
    const bVal = getCoeff(b, x);
    const cVal = getCoeff(c, x);
    const phiX = phi[x];
    const posPart = Math.max(0, phiX);
    const sat = cVal * Math.pow(posPart, p);

    // Flow toward autopoietic equilibrium: dPhi/dt = -R(Phi)
    const dPhi = -lap[x] + (aVal * grad[x]) + (bVal * phiX) - sat;
    next[x] = phiX + dt * dPhi;
  }
  return next;
}

/**
 * Relaxes a field toward steady-state autopoietic equilibrium via damped Picard iteration.
 *
 * @param {Float64Array|Array<number>} initialPhi
 * @param {object} params - { a, b, c, p?: number }
 * @param {object} graph
 * @param {object} [options] - { maxIterations?: number, tolerance?: number, dt?: number }
 * @returns {{ phi: Float64Array, converged: boolean, residualNorm: number, iterations: number }}
 */
export function solveAutopoieticSteadyState(initialPhi, params, graph, options = {}) {
  const { maxIterations = 600, tolerance = 1e-4, dt = 0.04 } = options;
  const n = graph.nodesCount;
  let current = new Float64Array(initialPhi);

  for (let iter = 0; iter < maxIterations; iter += 1) {
    const res = computeResidual(current, params, graph);
    let maxRes = 0;
    for (let i = 0; i < n; i += 1) {
      const absR = Math.abs(res[i]);
      if (absR > maxRes) maxRes = absR;
    }
    if (maxRes < tolerance) {
      return { phi: current, converged: true, residualNorm: maxRes, iterations: iter };
    }
    current = stepAutopoiesis(current, params, graph, dt);
  }

  const finalRes = computeResidual(current, params, graph);
  let finalMax = 0;
  for (let i = 0; i < n; i += 1) {
    const absR = Math.abs(finalRes[i]);
    if (absR > finalMax) finalMax = absR;
  }
  return { phi: current, converged: finalMax < tolerance, residualNorm: finalMax, iterations: maxIterations };
}

/**
 * Checks spectral viability for positive autopoietic existence on a graph.
 * In the CD framework (Spence 2026), a positive solution exists if the principal
 * eigenvalue of L - diag(b) satisfies λ_1(L - diag(b)) < 0.
 *
 * Uses power iteration on the shifted operator to estimate λ_1.
 *
 * @param {object} graph
 * @param {number|Array<number>} b - Vitality coefficient
 * @returns {{ isViable: boolean, principalEigenvalue: number }}
 */
export function checkSpectralViability(graph, b = 1.0) {
  const n = graph.nodesCount;
  const getB = (idx) => (typeof b === "number" ? b : b[idx] ?? 0);

  // Maximum degree to bound the spectrum of L
  let maxDeg = 0;
  for (let i = 0; i < n; i += 1) {
    let deg = 0;
    for (const e of graph.neighbors[i]) deg += e.weight;
    if (deg > maxDeg) maxDeg = deg;
  }
  let maxB = 0;
  for (let i = 0; i < n; i += 1) {
    const bi = getB(i);
    if (bi > maxB) maxB = bi;
  }

  // Shift M to make M - (L - diag(b)) positive definite
  const shift = 2 * maxDeg + Math.abs(maxB) + 1.0;

  // Power iteration for dominant eigenvector of shifted operator S = shift * I - (L - diag(b))
  let vec = new Float64Array(n);
  for (let i = 0; i < n; i += 1) vec[i] = 1.0 / Math.sqrt(n);

  for (let iter = 0; iter < 100; iter += 1) {
    const next = new Float64Array(n);
    const lap = computeGraphLaplacian(vec, graph);
    for (let i = 0; i < n; i += 1) {
      const bi = getB(i);
      // S(vec) = shift * vec - (L(vec) - b * vec)
      next[i] = shift * vec[i] - (lap[i] - bi * vec[i]);
    }
    let norm = 0;
    for (let i = 0; i < n; i += 1) norm += next[i] * next[i];
    norm = Math.sqrt(norm);
    if (norm === 0) break;
    for (let i = 0; i < n; i += 1) vec[i] = next[i] / norm;
  }

  // Rayleigh quotient to find λ_1(L - diag(b))
  const lapVec = computeGraphLaplacian(vec, graph);
  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < n; i += 1) {
    const bi = getB(i);
    const opVecI = lapVec[i] - bi * vec[i];
    numerator += vec[i] * opVecI;
    denominator += vec[i] * vec[i];
  }
  const principalEigenvalue = numerator / denominator;
  return {
    isViable: principalEigenvalue < 0,
    principalEigenvalue,
  };
}

/**
 * Clifford Strange Attractor map:
 *   x_{n+1} = sin(a * y_n) + c * cos(a * x_n)
 *   y_{n+1} = sin(b * x_n) + d * cos(b * y_n)
 *
 * @param {number} x
 * @param {number} y
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @returns {[number, number]}
 */
export function cliffordAttractor(x, y, a, b, c, d) {
  return [
    Math.sin(a * y) + c * Math.cos(a * x),
    Math.sin(b * x) + d * Math.cos(b * y),
  ];
}

/**
 * De Jong Strange Attractor map:
 *   x_{n+1} = sin(a * y_n) - cos(b * x_n)
 *   y_{n+1} = sin(c * x_n) - cos(d * y_n)
 *
 * @param {number} x
 * @param {number} y
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @returns {[number, number]}
 */
export function deJongAttractor(x, y, a, b, c, d) {
  return [
    Math.sin(a * y) - Math.cos(b * x),
    Math.sin(c * x) - Math.cos(d * y),
  ];
}

/**
 * Generates an array of normalized 2D coordinates for strange attractor rendering.
 *
 * @param {Function} attractorFn - (x, y, a, b, c, d) => [x, y]
 * @param {{ a: number, b: number, c: number, d: number }} params
 * @param {number} iterations
 * @param {number} warmup
 * @returns {Float32Array} [x0, y0, x1, y1, ...]
 */
export function generateAttractorPoints(attractorFn, params, iterations = 2000, warmup = 100) {
  const { a, b, c, d } = params;
  let x = 0.1;
  let y = 0.1;

  for (let i = 0; i < warmup; i += 1) {
    [x, y] = attractorFn(x, y, a, b, c, d);
  }

  const pts = new Float32Array(iterations * 2);
  for (let i = 0; i < iterations; i += 1) {
    [x, y] = attractorFn(x, y, a, b, c, d);
    pts[i * 2] = x;
    pts[i * 2 + 1] = y;
  }
  return pts;
}

/**
 * Derives deterministic Clifford attractor coefficients from a score object.
 *
 * @param {object} score - Validated LOLCODE score object
 * @returns {{ a: number, b: number, c: number, d: number }}
 */
export function attractorParamsFromScore(score) {
  const seed = (score && score.seed != null) ? (score.seed >>> 0) : 1337;
  // Map seed bits to bounded chaotic regimes (typically within [-3.0, 3.0])
  const a = -2.5 + (((seed ^ 0x5a5a5a5a) & 0xffff) / 65535) * 5.0;
  const b = -2.5 + ((((seed >>> 8) ^ 0xa5a5a5a5) & 0xffff) / 65535) * 5.0;
  const c = -2.5 + ((((seed >>> 16) ^ 0x3c3c3c3c) & 0xffff) / 65535) * 5.0;
  const d = -2.5 + ((((seed >>> 24) ^ 0xc3c3c3c3) & 0xffff) / 65535) * 5.0;
  return { a, b, c, d };
}

/**
 * Golden Ratio constant phi.
 */
export const FIBONACCI_RATIO = 1.618033988749895;

/**
 * Computes fractal delay echo tap times spaced by powers of the golden ratio (phi).
 *
 * @param {number} unit - Base step duration in seconds
 * @param {number} tapCount - Number of recursive reflections (default 4)
 * @returns {Float64Array}
 */
export function fibonacciDelayTaps(unit, tapCount = 4) {
  const taps = new Float64Array(tapCount);
  let current = unit;
  for (let i = 0; i < tapCount; i += 1) {
    taps[i] = current;
    current = current / FIBONACCI_RATIO;
  }
  return taps;
}

/**
 * Computes the autopoietic harmonic vitality across a chord progression on the Tonnetz torus graph.
 * For each chord in the sequence:
 *   1. Pitch classes are mapped to nodes on the 12-node Tonnetz graph.
 *   2. The discrete Laplacian L and gradient norm ||∇Φ|| are computed.
 *   3. Contradiction energy and coherence are evaluated to determine harmonic vitality.
 *
 * @param {Array<{ pitchClasses: Array<number> }>} spine - Chords in progression
 * @param {object} [options]
 * @returns {{ vitalityProfile: Float32Array, meanVitality: number, maxContradiction: number }}
 */
export function computeTonnetzHarmonicField(spine, options = {}) {
  const graph = createTonnetzGraph();
  const n = spine.length;
  const vitalityProfile = new Float32Array(n);
  let totalVitality = 0;
  let maxContradiction = 0;

  for (let s = 0; s < n; s += 1) {
    const chord = spine[s];
    const pcs = chord?.pitchClasses || [];
    // Indicator vector on 12 chromatic nodes: 1.0 for chord tones, 0.0 otherwise
    const phi = new Float64Array(12);
    for (const pc of pcs) {
      const idx = ((pc % 12) + 12) % 12;
      phi[idx] = 1.0;
    }

    const grad = computeGradientNorm(phi, graph);
    const lap = computeGraphLaplacian(phi, graph);

    let stepGrad = 0;
    let stepLap = 0;
    for (let i = 0; i < 12; i += 1) {
      stepGrad += grad[i];
      stepLap += Math.abs(lap[i]);
    }

    if (stepGrad > maxContradiction) maxContradiction = stepGrad;

    const vitality = Math.min(1.0, (stepGrad * 0.12) + (pcs.length * 0.15));
    vitalityProfile[s] = vitality;
    totalVitality += vitality;
  }

  const meanVitality = n > 0 ? totalVitality / n : 0.5;
  return {
    vitalityProfile,
    meanVitality,
    maxContradiction,
  };
}

/**
 * Generates a self-similar fractal recursive arpeggio sequence from a base chord.
 * Recursively subdivides each note into a micro-triadic cascade.
 *
 * @param {Array<number>} baseNotes - Semitone intervals
 * @param {number} depth - Recursion depth (1..3)
 * @returns {Array<number>}
 */
export function fractalArpeggioSequence(baseNotes, depth = 2) {
  if (!Array.isArray(baseNotes) || baseNotes.length === 0) return [0];
  if (depth <= 1) return [...baseNotes];

  const result = [];
  for (const root of baseNotes) {
    for (const note of baseNotes) {
      result.push(root + (note - baseNotes[0]) * 0.5);
    }
  }
  return result;
}
