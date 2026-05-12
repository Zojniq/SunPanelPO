# Test cases catalogue — sizing & string validation

Document version: 1.0 (AP-08-preliminary).

This catalogue defines the representative cases used by:

- `tests/sizing/cable.test.js`     — **characterization / golden**
- `tests/sizing/vdrop.test.js`     — **characterization / golden**
- `tests/sizing/capacity.test.js`  — **characterization / golden**
- `tests/sizing/string.test.js`    — **spec / oracle** (not characterization)

## Test type distinction (important)

**Characterization / golden tests** call the production code through the
vm sandbox (see `tests/setup/load-cables.js`) and assert that the output
equals the value derived from `INVARIANTS.md` / `COMPLIANCE.md`. The
expected values in this document come from **manual derivation against
the invariant**, not from "capture whatever production currently
returns".

If production and invariant disagree, the test fails. **The correct
response is to stop and report a found bug**, not to relax the test
expectation. This is the policy agreed at the start of AP-08-preliminary.

**Spec / oracle tests** reimplement the invariant formula in the test
file and assert that the oracle, applied to the catalogue input, gives
the expected value. They do not call production code (the corresponding
production code is currently inline in `updateInvValidation` /
`updateStringPreview`, mixed with DOM access — not vm-loadable). They
protect the *invariant*, not the *current implementation*. Production
will join this layer in AP-08-main when the formulas are extracted.

## Conventions for derivations

- Numbers shown are computed to ~3 significant figures unless an exact
  commercial size is at stake.
- For `calcSection`, the result is always one of `CABLE_SECTIONS = [1,
  1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120]` mm² (INV-P-05). The
  ceiling-to-commercial step is part of the assertion.
- `S_drop = (nCond × L × I) / (σ × ΔV)`; for AC also × cosφ.
- `I_eff = I / max(kCorr, 0.1)`; capacity criterion uses I_eff.
- `S_min = max(S_drop, S_current)`. For DC string (`isDC=true`), the
  result is further `max(S_min, MIN_PV_STRING_MM2=4)`.
- Conductivity: `σ_Cu = 56`, `σ_Al = 35` m/(Ω·mm²) at 20 °C (INV-P-01).
- Aluminium capacity = round(Cu capacity × 0.78) (INV-P-07).
- Voc_cold = `voc · (1 + kVoc · (T_min − T_stc))` with T_min=−10, T_stc=25
  (INV-P-08).
- Vmpp_hot = `vmpp · (1 + kVoc · (T_max − T_stc))` with T_max=70, T_stc=25
  (INV-P-09).
- `kVoc = tcoef_voc / 100` (INV-P-08, %/°C → 1/°C).

---

## C1 — 5 kWp residential, single DC string

**Type:** characterization.
**Function:** `calcSection`.
**Scenario:** Small rooftop, one inverter R5-5K, one string, short run.

| Input | Value |
|---|---|
| I_A | 10 |
| L_m | 20 |
| dV_V | 15 |
| material | `'cu'` |
| nCond | 2 |
| isDC | true |
| kCorr | 1.0 |

**Derivation:**
- `S_drop = (2·20·10)/(56·15) = 400/840 = 0.476 mm²`
- `I_eff = 10/1 = 10`. CABLE_CAPACITY_CU_DC[0] = 13 ≥ 10 → `S_current = 1`.
- `S_min = max(0.476, 1) = 1`. `S_final = max(1, 4) = 4` (DC floor).
- Smallest commercial ≥ 4 → **4 mm²**.

**Expected:** `calcSection(...) === 4`.

**Related invariants:** INV-P-02, INV-P-03, INV-P-05.

---

## C2 — 20 kWp commercial tri, DC main

**Type:** characterization.
**Function:** `calcSection`.
**Scenario:** Mid-system DC main feeder from string combiner to inverter.

| Input | Value |
|---|---|
| I_A | 30 |
| L_m | 50 |
| dV_V | 20 |
| material | `'cu'` |
| nCond | 2 |
| isDC | true |
| kCorr | 1.0 |

**Derivation:**
- `S_drop = (2·50·30)/(56·20) = 3000/1120 = 2.679 mm²`
- `I_eff = 30`. CABLE_CAPACITY_CU_DC: first ≥ 30 is 32 at index 3 → `S_current = 4`.
- `S_min = max(2.679, 4) = 4`. `S_final = max(4, 4) = 4`.
- Result: **4 mm²**.

**Expected:** `calcSection(...) === 4`.

**Related invariants:** INV-P-02, INV-P-05.

---

## C3 — 75 kWp industrial, AC three-phase output

**Type:** characterization.
**Function:** `calcSectionAC`.
**Scenario:** AC cable from inverter to QGBT, three-phase 400 V.

| Input | Value |
|---|---|
| I_A | 120 |
| L_m | 30 |
| dV_V | 8 |
| material | `'cu'` |
| nCond | √3 ≈ 1.732 |
| cosfi | 0.95 |

**Derivation:**
- `S_drop = (1.732·30·120·0.95)/(56·8) = 5921.6/448 = 13.218 mm²`
- Capacity criterion uses Method B (AC table): CABLE_CAPACITY_CU_AC = [11, 14.5, 20, 27, 34, 46, 61, 80, 99, 119, 151, 182, 210].
- I=120: first ≥ 120 is 151 at index 10 → `S_current = 70` mm².
- `S_min = max(13.218, 70) = 70`. AC has no MIN_PV_STRING floor.
- Result: **70 mm²**.

**Expected:** `calcSectionAC(...) === 70`.

**Related invariants:** INV-P-02, INV-P-04, INV-P-06.

---

## C4 — Aluminium swap of C2 (forces larger section)

**Type:** characterization.
**Function:** `calcSection`.
**Scenario:** Same as C2 but `material = 'al'`. Proves INV-P-07 (Al needs
larger section for same load).

| Input | Value |
|---|---|
| I_A | 30 |
| L_m | 50 |
| dV_V | 20 |
| material | `'al'` |
| nCond | 2 |
| isDC | true |
| kCorr | 1.0 |

**Derivation:**
- `σ_Al = 35`. `S_drop = (2·50·30)/(35·20) = 3000/700 = 4.286 mm²`
- Al DC capacity table = round(Cu DC × 0.78) = [10, 14, 19, 25, 32, 44, 59, 79, 98, 118, 150, 181, 210].
- I=30: first ≥ 30 is 32 at index 4 → `S_current = 6` mm².
- `S_min = max(4.286, 6) = 6`. `S_final = max(6, 4) = 6`.
- Result: **6 mm²** (vs 4 mm² for Cu in C2).

**Expected:** `calcSection(...) === 6`.

**Related invariants:** INV-P-01, INV-P-07.

---

## C5 — kCorr derating shifts current criterion

**Type:** characterization.
**Function:** `calcSection`.
**Scenario:** Multiple cables in a tray, grouping factor `kCorr = 0.7`.
Inputs sized so that the derated capacity criterion dominates the DC
floor.

| Input | Value |
|---|---|
| I_A | 30 |
| L_m | 20 |
| dV_V | 10 |
| material | `'cu'` |
| nCond | 2 |
| isDC | true |
| kCorr | 0.7 |

**Derivation:**
- `S_drop = (2·20·30)/(56·10) = 1200/560 = 2.143 mm²`
- `I_eff = 30/0.7 = 42.857`. Cu DC: first ≥ 42.857 is 57 at index 5 → `S_current = 10` mm².
- (Compare without kCorr: I_eff=30 → S_current=4 mm². The grouping factor adds two commercial steps.)
- `S_min = max(2.143, 10) = 10`. `S_final = max(10, 4) = 10`.
- Result: **10 mm²**.

**Expected:** `calcSection(...) === 10`.

**Related invariants:** INV-P-02 (kCorr term per CEI UNEL 35026).

---

## C6 — PV-string minimum-section floor (4 mm² enforcement)

**Type:** characterization.
**Function:** `calcSection`.
**Scenario:** Short, low-current run that the math alone would size at
< 1 mm². The PV-string floor (INV-P-03 / CEI EN 62548 §6.4) must clamp
the result.

| Input | Value |
|---|---|
| I_A | 4 |
| L_m | 5 |
| dV_V | 10 |
| material | `'cu'` |
| nCond | 2 |
| isDC | true |
| kCorr | 1.0 |

**Derivation:**
- `S_drop = (2·5·4)/(56·10) = 40/560 = 0.071 mm²`
- `I_eff = 4`. Cu DC: first ≥ 4 is 13 at index 0 → `S_current = 1` mm².
- `S_min = max(0.071, 1) = 1`. `S_final = max(1, 4) = 4` (floor enforced).
- Result: **4 mm²** — floor wins over both drop and capacity.

**Expected:** `calcSection(...) === 4`.

**Related invariants:** INV-P-03 (CEI EN 62548 §6.4 minimum).

---

## C7 — Voc-cold validation, mono inverter (spec / oracle)

**Type:** spec / oracle.
**Functions tested:** (none in production) — `string.test.js` reimplements
INV-P-08 inline. Production code is inline in `updateInvValidation` and
not yet vm-loadable. Spec lock-in only.

| Input | Value |
|---|---|
| voc (V) | 37.26 (JA Solar JAM54S30-405/MR) |
| tcoef_voc (%/°C) | -0.27 |
| n_mod | 10 |
| VocMax (inverter, V) | 600 (SAJ R5) |

**Derivation:**
- `kVoc = -0.27 / 100 = -0.0027` 1/°C.
- `Voc_cold_module = 37.26 · (1 + (-0.0027) · (−10 − 25)) = 37.26 · (1 + 0.0945) = 37.26 · 1.0945 = 40.78107 V`.
- `Voc_cold_string = 10 · 40.78107 = 407.8107 V`.
- `n_max_voc = floor(VocMax / Voc_cold_module) = floor(600 / 40.78107) = floor(14.7126) = 14`.
- 407.8107 ≤ 600 → string of 10 is **VALID** against VocMax.

**Expected (oracle):** `Voc_cold_module = 40.78107 V (± 1e-5)`, `n_max_voc === 14`, `valid === true`.

**Related invariants:** INV-P-08, INV-P-10.

---

## C8 — Vmpp-hot validation (spec / oracle)

**Type:** spec / oracle.
**Functions tested:** (none in production) — see C7 note.

| Input | Value |
|---|---|
| vmpp (V) | 40.58 (same module as C7) |
| tcoef_voc (%/°C) | -0.27 (used as kVoc per INV-P-09 default) |
| n_mod | 4 |
| Vmin (inverter, V) | 80 (SAJ R5) |

**Derivation:**
- `kVoc = -0.0027` 1/°C.
- `Vmpp_hot_module = 40.58 · (1 + (-0.0027) · (70 − 25)) = 40.58 · (1 − 0.1215) = 40.58 · 0.8785 = 35.64953 V`.
- `Vmpp_hot_string = 4 · 35.64953 = 142.59812 V`.
- `n_min_vmpp = ceil(Vmin / Vmpp_hot_module) = ceil(80 / 35.64953) = ceil(2.2441) = 3`.
- 142.59812 ≥ 80 → string of 4 is **VALID** against Vmin.

**Expected (oracle):** `Vmpp_hot_module = 35.64953 V (± 1e-5)`, `n_min_vmpp === 3`, `valid === true`.

**Related invariants:** INV-P-09, INV-P-10.

---

## C9 — Boundary: math demands section beyond commercial table

**Type:** characterization (boundary).
**Function:** `calcSection`.
**Scenario:** Extreme length forces calculated section above the largest
commercial size (120 mm²). Tests what production does at the table edge.

| Input | Value |
|---|---|
| I_A | 80 |
| L_m | 500 |
| dV_V | 10 |
| material | `'cu'` |
| nCond | 2 |
| isDC | true |
| kCorr | 1.0 |

**Derivation:**
- `S_drop = (2·500·80)/(56·10) = 80000/560 ≈ 142.857 mm²`
- `I_eff = 80`. Cu DC: first ≥ 80 is 101 at index 7 → `S_current = 25` mm².
- `S_min = max(142.857, 25) = 142.857`. `S_final = max(142.857, 4) = 142.857`.
- Loop: no commercial size ≥ 142.857. Function falls through and returns
  `CABLE_SECTIONS[CABLE_SECTIONS.length - 1] = 120`.
- Result: **120 mm²** (silent saturation at table maximum).

**Expected:** `calcSection(...) === 120`.

**Engineering observation (not a defect under current invariants, but
worth recording):** INV-P-05 fixes the commercial section list at the 13
values shown; production caps at the largest member silently. The
engineer is not warned that the calculation overflowed the table. A
correct physical installation in this regime would use parallel
conductors or higher-voltage architecture. **Track for AP-08-main /
future engineering improvement** — not a test failure today, because no
invariant currently mandates the warning.

**Related invariants:** INV-P-02, INV-P-05 (table boundary).
