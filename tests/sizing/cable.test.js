// ── tests/sizing/cable.test.js ──────────────────────────────────────────────
// Characterization / golden tests for calcSection and calcSectionAC.
// Expected values come from manual derivation against INVARIANTS.md
// (see tests/fixtures/cases.md for the full derivation).
// Policy: if production disagrees with the derived value, the test fails.
// Do not relax the expectation — the mismatch is a found bug.

import { describe, test, expect, beforeAll } from 'vitest';
import { loadCables } from '../setup/load-cables.js';

let calcSection, calcSectionAC;

beforeAll(() => {
  const mod = loadCables();
  calcSection = mod.calcSection;
  calcSectionAC = mod.calcSectionAC;
});

describe('calcSection (DC, characterization)', () => {
  test('C1 — 5 kWp residential string: I=10A L=20m dV=15V cu → 4 mm² (DC floor)', () => {
    expect(calcSection(10, 20, 15, 'cu', 2, true, 1.0)).toBe(4);
  });

  test('C2 — 20 kWp DC main: I=30A L=50m dV=20V cu → 4 mm²', () => {
    expect(calcSection(30, 50, 20, 'cu', 2, true, 1.0)).toBe(4);
  });

  test('C4 — aluminium swap of C2: I=30A L=50m dV=20V al → 6 mm² (INV-P-07)', () => {
    expect(calcSection(30, 50, 20, 'al', 2, true, 1.0)).toBe(6);
  });

  test('C5 — kCorr=0.7 derating: I=30A L=20m dV=10V cu → 10 mm²', () => {
    expect(calcSection(30, 20, 10, 'cu', 2, true, 0.7)).toBe(10);
  });

  test('C6 — PV-string minimum floor: I=4A L=5m dV=10V cu → 4 mm² (INV-P-03)', () => {
    expect(calcSection(4, 5, 10, 'cu', 2, true, 1.0)).toBe(4);
  });

  test('C9 — boundary: math demands >120 mm², production caps at 120', () => {
    expect(calcSection(80, 500, 10, 'cu', 2, true, 1.0)).toBe(120);
  });
});

describe('calcSectionAC (AC, characterization)', () => {
  test('C3 — 75 kWp AC trifase: I=120A L=30m dV=8V cu cosφ=0.95 → 70 mm²', () => {
    expect(calcSectionAC(120, 30, 8, 'cu', Math.sqrt(3), 0.95)).toBe(70);
  });
});
