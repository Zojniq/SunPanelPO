// ── tests/sizing/string.test.js ─────────────────────────────────────────────
// SPEC / ORACLE tests, NOT characterization.
//
// Production string-validation math is currently inline inside
// updateInvValidation / updateStringPreview, mixed with DOM reads.
// It is not vm-loadable today.
//
// This file reimplements INV-P-08 / INV-P-09 / INV-P-10 as an oracle and
// asserts the oracle against the catalogue cases. It does NOT test
// production code. Its purpose is to lock the invariant in test form
// before AP-08-main extracts the production version. When extraction
// lands, an additional characterization layer will assert that the
// extracted production function returns the same values as this oracle.

import { describe, test, expect } from 'vitest';

// ── Oracle (test-side reimplementation of INV-P-08 / INV-P-09) ────────────
// Per INVARIANTS.md and COMPLIANCE.md:
//   kVoc      = tcoef_voc / 100             (%/°C → 1/°C)
//   Voc_cold  = voc  · (1 + kVoc · (T_min  − T_stc))   T_min = −10, T_stc = +25
//   Vmpp_hot  = vmpp · (1 + kVoc · (T_max  − T_stc))   T_max = +70
//   n_max_voc = floor(VocMax / Voc_cold_module)
//   n_min_vmpp = ceil (Vmin   / Vmpp_hot_module)
//   valid     = (n_min_vmpp ≤ n_mod ≤ n_max_voc) AND
//               (n_mod · Voc_cold_module ≤ VocMax) AND
//               (n_mod · Vmpp_hot_module ≥ Vmin)

const T_MIN = -10;
const T_MAX = 70;
const T_STC = 25;

function kVocFromPercent(tcoef_voc_pct) {
  return tcoef_voc_pct / 100;
}

function vocCold(voc, tcoef_voc_pct) {
  return voc * (1 + kVocFromPercent(tcoef_voc_pct) * (T_MIN - T_STC));
}

function vmppHot(vmpp, tcoef_voc_pct) {
  return vmpp * (1 + kVocFromPercent(tcoef_voc_pct) * (T_MAX - T_STC));
}

function nMaxVoc(vocCold_module, vocMaxInverter) {
  return Math.floor(vocMaxInverter / vocCold_module);
}

function nMinVmpp(vmppHot_module, vminInverter) {
  return Math.ceil(vminInverter / vmppHot_module);
}

function isValidWindow(n_mod, n_min, n_max) {
  return n_min <= n_mod && n_mod <= n_max;
}

// ── C7 — Voc-cold validation (INV-P-08) ─────────────────────────────────
describe('C7 — Voc-cold validation, mono inverter (spec / oracle)', () => {
  const voc = 37.26;          // JA Solar JAM54S30-405/MR
  const tcoef_voc = -0.27;    // %/°C
  const n_mod = 10;
  const VocMax = 600;         // SAJ R5

  test('per-module Voc_cold = 40.78107 V', () => {
    // 37.26 · (1 + (-0.0027)·(-35)) = 37.26 · 1.0945 = 40.78107
    expect(vocCold(voc, tcoef_voc)).toBeCloseTo(40.78107, 5);
  });

  test('string Voc_cold ≈ 407.8107 V (≤ VocMax)', () => {
    const v = n_mod * vocCold(voc, tcoef_voc);
    expect(v).toBeCloseTo(407.8107, 4);
    expect(v).toBeLessThanOrEqual(VocMax);
  });

  test('n_max_voc = 14 (INV-P-10 upper bound)', () => {
    expect(nMaxVoc(vocCold(voc, tcoef_voc), VocMax)).toBe(14);
  });
});

// ── C8 — Vmpp-hot validation (INV-P-09) ─────────────────────────────────
describe('C8 — Vmpp-hot validation (spec / oracle)', () => {
  const vmpp = 40.58;         // same module as C7
  const tcoef_voc = -0.27;    // %/°C (used as kVoc per INV-P-09 default)
  const n_mod = 4;
  const Vmin = 80;            // SAJ R5

  test('per-module Vmpp_hot = 35.64953 V', () => {
    // 40.58 · (1 + (-0.0027)·45) = 40.58 · 0.8785 = 35.64953
    expect(vmppHot(vmpp, tcoef_voc)).toBeCloseTo(35.64953, 5);
  });

  test('string Vmpp_hot = 142.59812 V (≥ Vmin)', () => {
    const v = n_mod * vmppHot(vmpp, tcoef_voc);
    expect(v).toBeCloseTo(142.59812, 4);
    expect(v).toBeGreaterThanOrEqual(Vmin);
  });

  test('n_min_vmpp = 3 (INV-P-10 lower bound)', () => {
    expect(nMinVmpp(vmppHot(vmpp, tcoef_voc), Vmin)).toBe(3);
  });
});

// ── Window invariant — combined Voc-cold and Vmpp-hot (INV-P-10) ────────
describe('String window n_min ≤ n ≤ n_max', () => {
  test('C7+C8 module on SAJ R5: window is [3, 14]', () => {
    const voc = 37.26;
    const vmpp = 40.58;
    const tcoef_voc = -0.27;
    const VocMax = 600;
    const Vmin = 80;

    const n_min = nMinVmpp(vmppHot(vmpp, tcoef_voc), Vmin);
    const n_max = nMaxVoc(vocCold(voc, tcoef_voc), VocMax);

    expect(n_min).toBe(3);
    expect(n_max).toBe(14);

    expect(isValidWindow(4, n_min, n_max)).toBe(true);
    expect(isValidWindow(10, n_min, n_max)).toBe(true);
    expect(isValidWindow(2, n_min, n_max)).toBe(false);   // below floor
    expect(isValidWindow(15, n_min, n_max)).toBe(false);  // above ceiling
  });

  test('Degenerate window (n_min > n_max) is detectable', () => {
    // Pathological: tiny VocMax forces n_max = 0 while n_min > 0
    const voc = 37.26;
    const vmpp = 40.58;
    const tcoef_voc = -0.27;
    const VocMax = 30;        // unrealistically low
    const Vmin = 80;

    const n_min = nMinVmpp(vmppHot(vmpp, tcoef_voc), Vmin);
    const n_max = nMaxVoc(vocCold(voc, tcoef_voc), VocMax);

    expect(n_max).toBe(0);
    expect(n_min).toBeGreaterThan(n_max);
    expect(isValidWindow(1, n_min, n_max)).toBe(false);
  });
});
