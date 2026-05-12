// ── tests/sizing/vdrop.test.js ──────────────────────────────────────────────
// Characterization / golden tests for calcVoltageDrop.
// Expected values derived from INV-P-01 / INV-P-02 formula.
// Production code is locked to invariant; mismatches are bugs, not test
// expectations to relax.

import { describe, test, expect, beforeAll } from 'vitest';
import { loadCables } from '../setup/load-cables.js';

let calcVoltageDrop;

beforeAll(() => {
  calcVoltageDrop = loadCables().calcVoltageDrop;
});

describe('calcVoltageDrop (characterization)', () => {
  // dV = (nCond × L × I × pf) / (σ × S); pf defaults to 1 when null/undefined
  // returned value is (dV / V_nom) × 100 — percent

  test('C1 leg — 10A, 20m, 4mm² cu, V_nom 487V, pf=1 → ~0.367%', () => {
    // dV = (2·20·10·1)/(56·4) = 400/224 = 1.7857 V → 1.7857/487 × 100
    const pct = calcVoltageDrop(10, 20, 4, 487, 'cu', 2, 1);
    expect(pct).toBeCloseTo(0.3667, 3);
  });

  test('C2 leg — 30A, 50m, 4mm² cu, V_nom 600V, pf=1 → ~2.232%', () => {
    // dV = (2·50·30·1)/(56·4) = 3000/224 = 13.393 V → 13.393/600 × 100
    const pct = calcVoltageDrop(30, 50, 4, 600, 'cu', 2, 1);
    expect(pct).toBeCloseTo(2.2321, 3);
  });

  test('C3 leg — 120A, 30m, 70mm² cu, V_nom 400V, pf=0.95 → ~0.378%', () => {
    // dV = (√3·30·120·0.95)/(56·70) = 5921.62/3920 = 1.5106 V → 1.5106/400 × 100
    const pct = calcVoltageDrop(120, 30, 70, 400, 'cu', Math.sqrt(3), 0.95);
    expect(pct).toBeCloseTo(0.3777, 3);
  });

  test('Al run — same as C2 but 6mm² al, pf=1 → ~2.381%', () => {
    // dV = (2·50·30·1)/(35·6) = 3000/210 = 14.286 V → 14.286/600 × 100
    const pct = calcVoltageDrop(30, 50, 6, 600, 'al', 2, 1);
    expect(pct).toBeCloseTo(2.3810, 3);
  });

  test('Default pf — passing null/undefined defaults to 1 (DC behavior)', () => {
    const a = calcVoltageDrop(10, 20, 4, 487, 'cu', 2, 1);
    const b = calcVoltageDrop(10, 20, 4, 487, 'cu', 2, null);
    expect(b).toBeCloseTo(a, 6);
  });
});
