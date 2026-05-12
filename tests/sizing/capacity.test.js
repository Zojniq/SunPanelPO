// ── tests/sizing/capacity.test.js ──────────────────────────────────────────
// Characterization / golden tests for getCableCapacity.
// Locks INV-P-05 (commercial section list), INV-P-06 (capacity tables),
// INV-P-07 (Cu/Al 0.78 derivation).

import { describe, test, expect, beforeAll } from 'vitest';
import { loadCables } from '../setup/load-cables.js';

let getCableCapacity;

beforeAll(() => {
  getCableCapacity = loadCables().getCableCapacity;
});

// Spot-checks against the canonical tables in cables.js:
//   CABLE_SECTIONS         = [1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120]
//   CABLE_CAPACITY_CU_DC   = [13, 17.5, 24, 32, 41, 57, 76, 101, 125, 151, 192, 232, 269]  (Method C)
//   CABLE_CAPACITY_CU_AC   = [11, 14.5, 20, 27, 34, 46, 61, 80, 99, 119, 151, 182, 210]    (Method B)
//   Al tables = round(Cu × 0.78)

describe('getCableCapacity — Cu, DC (Method C)', () => {
  test('1.5 mm² Cu DC = 17.5 A', () => {
    expect(getCableCapacity(1.5, 'cu', true)).toBe(17.5);
  });

  test('4 mm² Cu DC = 32 A', () => {
    expect(getCableCapacity(4, 'cu', true)).toBe(32);
  });

  test('25 mm² Cu DC = 101 A', () => {
    expect(getCableCapacity(25, 'cu', true)).toBe(101);
  });

  test('120 mm² Cu DC = 269 A (table maximum)', () => {
    expect(getCableCapacity(120, 'cu', true)).toBe(269);
  });
});

describe('getCableCapacity — Cu, AC (Method B)', () => {
  test('1.5 mm² Cu AC = 14.5 A', () => {
    expect(getCableCapacity(1.5, 'cu', false)).toBe(14.5);
  });

  test('70 mm² Cu AC = 151 A', () => {
    expect(getCableCapacity(70, 'cu', false)).toBe(151);
  });

  test('120 mm² Cu AC = 210 A', () => {
    expect(getCableCapacity(120, 'cu', false)).toBe(210);
  });
});

describe('getCableCapacity — Al derivation (Cu × 0.78, rounded)', () => {
  // Al DC: round(13·0.78)=10, round(17.5·0.78)=14, round(24·0.78)=19,
  //        round(32·0.78)=25, round(41·0.78)=32, round(57·0.78)=44, ...
  test('1.0 mm² Al DC = 10 A (round(13·0.78))', () => {
    expect(getCableCapacity(1, 'al', true)).toBe(10);
  });

  test('4 mm² Al DC = 25 A (round(32·0.78))', () => {
    expect(getCableCapacity(4, 'al', true)).toBe(25);
  });

  test('25 mm² Al DC = 79 A (round(101·0.78) = 78.78 → 79)', () => {
    expect(getCableCapacity(25, 'al', true)).toBe(79);
  });

  test('120 mm² Al DC = 210 A (round(269·0.78) = 209.82 → 210)', () => {
    expect(getCableCapacity(120, 'al', true)).toBe(210);
  });
});

describe('getCableCapacity — unknown section', () => {
  test("non-commercial size returns the '?' sentinel", () => {
    expect(getCableCapacity(7.5, 'cu', true)).toBe('?');
  });
});
