// ── js/lib/sizing.js — Pure cable sizing helpers ────────────────────────────
// Extracted from cables.js in AP-08-main. Verbatim formulas, constants,
// rounding, thresholds — no changes from the original implementation.
//
// Constants and helpers are wrapped in an IIFE so that no internal binding
// leaks into the surrounding script scope. The single public endpoint is
// `globalThis.SDPSizing` (browser & Node 20+) and, for CommonJS test
// consumers (vitest via createRequire), `module.exports`.
//
// Both endpoints point at the same `api` object: read-only contract.
//
// References:
//   • INVARIANTS.md — INV-P-01..07 (formulas, tables, derating)
//   • COMPLIANCE.md — F-CABLE-DC-SECTION, F-CABLE-AC-SECTION, F-VDROP,
//                     F-CAPACITY-LOOKUP, F-DERATING, F-AL-FACTOR,
//                     F-PV-MIN-SECTION
//   • tests/sizing/* — golden tests pinning current behaviour

'use strict';

(function () {
  // Sezioni commerciali disponibili (mm²)
  const CABLE_SECTIONS = [1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120];

  // IEC 62548 §6.4 — sezione minima assoluta per cavi stringa PV (H1Z2Z2-K)
  const MIN_PV_STRING_MM2 = 4;

  // Conduttività (m/Ω·mm²) a 20°C — formula semplificata standard (CEI 64-8 / IEC 60364)
  const SIGMA_CU = 56; // rame a 20°C
  const SIGMA_AL = 35; // alluminio a 20°C

  // Portate (A) — Cu, isolamento PVC, T_amb 30°C (IEC 60364-5-52 / UNEL 35024)
  // Method C: cavo singolo posato su parete o portacavi — cavi DC stringa FV (all'aperto)
  const CABLE_CAPACITY_CU_DC = [13, 17.5, 24, 32, 41, 57, 76, 101, 125, 151, 192, 232, 269];
  // Method B: cavo in tubo/condotto annegato o a parete — cavo principale DC e cavo AC
  const CABLE_CAPACITY_CU_AC = [11, 14.5, 20, 27, 34, 46, 61, 80, 99, 119, 151, 182, 210];

  // Fattore Al vs Cu ≈ 0.78 (CEI UNEL)
  const CABLE_CAPACITY_AL_DC = CABLE_CAPACITY_CU_DC.map(v => Math.round(v * 0.78));
  const CABLE_CAPACITY_AL_AC = CABLE_CAPACITY_CU_AC.map(v => Math.round(v * 0.78));

  /**
   * Calcola la sezione commerciale minima che soddisfa sia
   * il criterio di caduta di tensione che il criterio di portata.
   * @param {number}  I_A      Corrente (A)
   * @param {number}  L_m      Lunghezza cavo (m)
   * @param {number}  dV_V     Caduta tensione massima ammessa (V)
   * @param {string}  material 'cu' | 'al'
   * @param {number}  nCond    Conduttori percorsi da corrente (2=bifilar DC, √3=trifase)
   * @param {boolean} isDC     true → portate Method C (DC), false → Method B (AC)
   * @returns {number} Sezione commerciale (mm²)
   *
   * kCorr = k1 (posa) × k2 (raggruppamento) — fattore riduzione portata CEI UNEL 35026.
   * La portata corretta è Iz_corretta = Iz_tabella × kCorr.
   * Per la verifica: serve Iz_corretta ≥ I_A → equivalente a Iz_tabella ≥ I_A/kCorr.
   */
  function calcSection(I_A, L_m, dV_V, material, nCond, isDC = true, kCorr = 1.0) {
    const sigma    = material === 'cu' ? SIGMA_CU : SIGMA_AL;
    const capacity = material === 'cu'
      ? (isDC ? CABLE_CAPACITY_CU_DC : CABLE_CAPACITY_CU_AC)
      : (isDC ? CABLE_CAPACITY_AL_DC : CABLE_CAPACITY_AL_AC);

    // Criterio 1 — caduta di tensione: S = (nCond × L × I) / (σ × ΔV)
    const S_drop = (nCond * L_m * I_A) / (sigma * dV_V);

    // Criterio 2 — portata con fattori correzione posa/raggruppamento (CEI UNEL 35026)
    // Iz_corretta = Iz_tab × kCorr ≥ I_A  →  Iz_tab ≥ I_A / kCorr
    const I_effective = Math.max(kCorr, 0.1) > 0 ? I_A / Math.max(kCorr, 0.1) : I_A;
    let S_current = CABLE_SECTIONS[CABLE_SECTIONS.length - 1];
    for (let i = 0; i < CABLE_SECTIONS.length; i++) {
      if (capacity[i] >= I_effective) { S_current = CABLE_SECTIONS[i]; break; }
    }

    // Vince il criterio più restrittivo → normalizza alla sezione commerciale superiore
    const S_min = Math.max(S_drop, S_current);
    // IEC 62548 §6.4: sezione minima 4 mm² per cavi stringa PV (H1Z2Z2-K, isDC=true)
    const S_final = isDC ? Math.max(S_min, MIN_PV_STRING_MM2) : S_min;
    for (const s of CABLE_SECTIONS) { if (s >= S_final) return s; }
    return CABLE_SECTIONS[CABLE_SECTIONS.length - 1];
  }

  /** Caduta di tensione effettiva (%) sul cavo scelto.
   *  cosfi opzionale (default 1 per DC, 0.9 per AC). */
  function calcVoltageDrop(I_A, L_m, S_mm2, V_nom, material, nCond, cosfi) {
    const sigma = material === 'cu' ? SIGMA_CU : SIGMA_AL;
    const pf    = cosfi != null ? cosfi : 1;
    const dV    = (nCond * L_m * I_A * pf) / (sigma * S_mm2);
    return (dV / V_nom) * 100;
  }

  /** Calcola sezione per cavi AC con cosφ — Method B (in condotto).
   *  S = (nCond × L × I × cosφ) / (σ × ΔV) */
  function calcSectionAC(I_A, L_m, dV_V, material, nCond, cosfi) {
    const sigma    = material === 'cu' ? SIGMA_CU : SIGMA_AL;
    const capacity = material === 'cu' ? CABLE_CAPACITY_CU_AC : CABLE_CAPACITY_AL_AC;
    const pf       = cosfi != null ? cosfi : 1;

    const S_drop = (nCond * L_m * I_A * pf) / (sigma * dV_V);
    let S_current = CABLE_SECTIONS[CABLE_SECTIONS.length - 1];
    for (let i = 0; i < CABLE_SECTIONS.length; i++) {
      if (capacity[i] >= I_A) { S_current = CABLE_SECTIONS[i]; break; }
    }
    const S_min = Math.max(S_drop, S_current);
    for (const s of CABLE_SECTIONS) { if (s >= S_min) return s; }
    return CABLE_SECTIONS[CABLE_SECTIONS.length - 1];
  }

  /** Portata del cavo per la sezione data.
   *  isDC=true → portate Method C (DC), false → Method B (AC) */
  function getCableCapacity(S_mm2, material, isDC = true) {
    const capacity = material === 'cu'
      ? (isDC ? CABLE_CAPACITY_CU_DC : CABLE_CAPACITY_CU_AC)
      : (isDC ? CABLE_CAPACITY_AL_DC : CABLE_CAPACITY_AL_AC);
    const idx = CABLE_SECTIONS.indexOf(S_mm2);
    return idx >= 0 ? capacity[idx] : '?';
  }

  const api = {
    calcSection,
    calcSectionAC,
    calcVoltageDrop,
    getCableCapacity,
    CABLE_SECTIONS,
    MIN_PV_STRING_MM2,
    SIGMA_CU,
    SIGMA_AL,
    CABLE_CAPACITY_CU_DC,
    CABLE_CAPACITY_CU_AC,
    CABLE_CAPACITY_AL_DC,
    CABLE_CAPACITY_AL_AC,
  };

  if (typeof globalThis !== 'undefined') {
    globalThis.SDPSizing = api;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})();
