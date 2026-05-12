# COMPLIANCE

> Document version: 1.0 (initial baseline, AP-01).
> Pairs with `INVARIANTS.md`. Each physical formula invariant (`INV-P-*`)
> in that document has a row here pointing to the source normative article.

This document pins the **specific editions** of regulations and standards the
application currently follows, and maps each electrical formula in the codebase
to its normative reference. It is the artefact reviewers consult when asking
"on what basis is this number correct?".

---

## 1. Norms in use

⚠️ **Edition verification required.** The edition column reflects the editions
that the current codebase appears to implement, based on formulas and values
found in the source. Before this document is considered authoritative, each
edition must be confirmed by a qualified electrical designer / installatore
qualified under DM 37/08, who has access to the current official CEI catalogue.
Rows marked **(verify)** are the highest priority to confirm.

| Code | Title (short) | Edition in use | Date | Scope in this app |
|---|---|---|---|---|
| **CEI 0-21** | Regola tecnica di riferimento per la connessione di Utenti attivi e passivi alle reti BT delle imprese distributrici di energia elettrica | **2022** (verify) | 2022-12 | Residential / small commercial PV grid connection, DC/AC ratio bound, anti-islanding (SPI), POD interface. |
| **CEI 0-16** | Regola tecnica di riferimento per la connessione di Utenti attivi e passivi alle reti AT ed MT delle imprese distributrici di energia elettrica | not yet in scope | — | (Reserved — applicable when MV connection support is added.) |
| **CEI 64-8** | Impianti elettrici utilizzatori a tensione nominale non superiore a 1000 V in c.a. e 1500 V in c.c. | **2022 (8th ed.)** (verify) | 2022 | Voltage-drop limits, conductor sizing on the AC side, earthing. |
| **CEI EN 62548** | Photovoltaic (PV) arrays — Design requirements | **2017 + A1:2020** (verify) | 2020 | DC string design rules: V_oc cold, V_mpp hot, minimum string cable section, protection. |
| **CEI EN 61730-1/2** | PV module safety qualification | not directly used | — | Implicit via module datasheet values. |
| **CEI UNEL 35024** | Cavi elettrici isolati con materiale elastomerico o termoplastico per tensioni nominali non superiori a 1000 V in c.a. e 1500 V in c.c. — Portate di corrente in regime permanente | **2021** (verify) | 2021 | Tabulated cable current-carrying capacity for Method B and Method C. |
| **CEI UNEL 35026** | Fattori di riduzione di portata per posa in canalizzazioni e in fascio | **2000** (verify) | 2000 | Grouping / installation derating factors k1, k2 (applied via `kCorr`). |
| **IEC 60364-5-52** | Selection and erection of electrical equipment — Wiring systems | **2009 + A1:2011** (verify) | 2011 | Installation method classification (Method A–G), reference for both Italian UNEL tables. |
| **IEC 62305-3** | Protection against lightning — Physical damage to structures and life hazard | **2010 (Ed. 2)** (verify) | 2010 | Earthing electrode geometry (`EARTH_ROD_D = 0.014 m`). |
| **DCPREV-14030** (VV.F.) | Guida per l'installazione degli impianti fotovoltaici (Vigili del Fuoco) | **2018 prot. 6334** | 2018-04-04 | Fire-safety distances around chimneys / antennas / HVAC / skylights / exhaust outlets (`CONFIG.TECH.DEFAULT_BUFFER`). |
| **GSE / GAUDÌ schema** | GAUDÌ data exchange format for PV plants registered with the Italian TSO operator (Terna) | **current at time of CSV export** | — | `exportGSE()` CSV column schema. |
| **DM 37/2008** | Riordino delle disposizioni in materia di attività di installazione degli impianti | reference only | 2008 | Establishes qualification of the engineer; not a formula source. |

### Reserved (not currently implemented)

| Code | Why reserved |
|---|---|
| CEI 82-25 | Detailed PV plant design guide — referenced for documentation patterns. |
| CEI 11-27 | Lavori su impianti elettrici — operational safety; out of scope. |
| CEI 0-2 | Documentazione di progetto — relevant when project document templates are formalised in Phase 4. |
| TÜV / IEC 61215, 61730 | Module testing standards — implicit in supplier datasheet, not enforced here. |

---

## 2. Formula → norm map

Each row pins a code-level identifier to one or more normative articles.
Line numbers are valid as of the AP-01 baseline; they will drift with future
refactors. After AP-08 (sizing extraction), the "file" column should be
updated to `js/lib/sizing.js` and a formula-ID test will pin behaviour.

| Formula ID | Function | File:line (current) | Invariant | Normative reference |
|---|---|---|---|---|
| `F-CABLE-DC-SECTION` | `calcSection` (isDC=true) | [js/lib/sizing.js](js/lib/sizing.js) | INV-P-02, INV-P-03 | CEI 64-8 §523; CEI UNEL 35024 (Method C); CEI EN 62548 §6.4 (4 mm² minimum) |
| `F-CABLE-AC-SECTION` | `calcSectionAC` | [js/lib/sizing.js](js/lib/sizing.js) | INV-P-02, INV-P-04 | CEI 64-8 §525; CEI UNEL 35024 (Method B); CEI 0-21 (4% voltage drop guideline) |
| `F-VDROP` | `calcVoltageDrop` | [js/lib/sizing.js](js/lib/sizing.js) | INV-P-02 | CEI 64-8 §525; IEC 60364-5-52 §G |
| `F-CAPACITY-LOOKUP` | `getCableCapacity` | [js/lib/sizing.js](js/lib/sizing.js) | INV-P-06 | CEI UNEL 35024 (Method B/C) |
| `F-DERATING` | `kCorr` parameter in `calcSection` | [js/lib/sizing.js](js/lib/sizing.js) | INV-P-02 | CEI UNEL 35026 (grouping/installation correction factors) |
| `F-AL-FACTOR` | `CABLE_CAPACITY_AL_*` derivation | [js/lib/sizing.js](js/lib/sizing.js) | INV-P-07 | CEI UNEL 35024 (Cu/Al equivalence ≈ 0.78) |
| `F-PV-MIN-SECTION` | `MIN_PV_STRING_MM2 = 4` | [js/lib/sizing.js](js/lib/sizing.js) | INV-P-03 | CEI EN 62548 §6.4 (H1Z2Z2-K cable minimum) |
| `F-VOC-COLD` | `vocCold = voc × (1 + kVoc × (T_min − T_stc))` | [js/strings.js](js/strings.js); [js/cables.js:465](js/cables.js#L465) (`updateInvValidation`) | INV-P-08 | CEI EN 62548 §7; IEC 62548 §7 (V_oc cold-side correction) |
| `F-VMPP-HOT` | `vmppHot = vmpp × (1 + kVoc × (T_max − T_stc))` | [js/strings.js](js/strings.js); [js/cables.js:465](js/cables.js#L465) | INV-P-09 | CEI EN 62548 §7 (V_mpp hot-side correction) |
| `F-T-LIMITS` | `T_min = −10 °C`, `T_max = +70 °C`, `T_stc = +25 °C` | [js/strings.js](js/strings.js); CLAUDE.md | INV-P-08, INV-P-09 | CEI EN 62548 §7 (Italian climatic assumption — site latitude assumed) |
| `F-K-VOC-UNIT` | `kVoc = tcoef_voc / 100` | [js/strings.js](js/strings.js) | INV-P-08, INV-P-09 | Datasheet convention: temperature coefficients quoted in %/°C |
| `F-STRING-WINDOW` | `n_min_vmpp ≤ n ≤ n_max_voc` | `updateInvValidation`, `updateStringPreview` | INV-P-10 | CEI EN 62548 §7.3 (string sizing window) |
| `F-MPPT-PARALLEL` | `_getProjectStrPerMpptMax`, `_hasMixedStrPerMppt` | [js/cables.js:111-119](js/cables.js#L111) | INV-P-11 | Manufacturer datasheet of each inverter model (no general norm) |
| `F-DC-AC-RATIO` | DC/AC ratio check ≤ 1.33 | (to be surfaced explicitly in UI) | INV-P-12 | CEI 0-21 (residential connection guideline); GSE technical rules |
| `F-EARTH-ROD-D` | `EARTH_ROD_D = 0.014 m` | [js/cables.js:24](js/cables.js#L24) | INV-P-13 | IEC 62305-3 (equivalent geometry for 25×3 mm vertical flat-strip electrode) |
| `F-SHADOW-GEOMETRY` | `CONFIG.SHADOW` (lat 44°, dicembre, elev 20°, azimuth 350°) | [js/config.js:47-53](js/config.js#L47) | (output-only, no INV) | Empirical conservative worst-case for Italian latitudes; not a normative article |
| `F-VVF-BUFFER-DEFAULT` | `CONFIG.TECH.DEFAULT_BUFFER` | [js/config.js:31](js/config.js#L31) | INV-O-01 (visual) | VV.F. DCPREV-14030 prot. 6334 §3.3.5.1 |

---

## 3. Values that come from datasheets, not norms

These are sourced from manufacturer datasheets and do not have a normative
reference per se. They must be kept current as suppliers update their lines.

| Source | Where in code | Notes |
|---|---|---|
| Module electrical parameters (Voc, Isc, Vmpp, Impp, Pmax, tcoef) | `MODULE_PRESETS` in [js/state.js:168-192](js/state.js#L168) | 15 presets across JA Solar, LONGi, Canadian Solar, Jinko, Risen, Generico |
| Module mechanical dimensions (pw, pl) | same | Width × length in metres |
| Inverter electrical parameters (Pac, Vmppt range, Voc max, Imax MPPT, strPerMppt) | `INV_PRESETS` (cables.js) | SAJ R5 (mono 1.5–8 kW), AT3 (tri 3–12 kW), C6 (industrial 12–100 kW) |
| Maximum reverse current `iscr` | `MODULE_PRESETS[*].iscr` | Estimated ≈ 1.35 × Isc, rounded per datasheet convention |
| Maximum system voltage `vsys_max` | `MODULE_PRESETS[*].vsys_max` | 1000 V for residential modules, 1500 V for large-format modules |

After AP-05 these tables move to `data/modules.json` and `data/inverters.json`.
That migration does not change the values — only their storage location.

---

## 4. Climatic and geographic assumptions

The application assumes installation **within Italy**. The following
assumptions are embedded in the calculations:

- Latitude: 44 ° N (median Italian latitude, used for shadow geometry).
- Coldest expected module temperature: **−10 °C** (consistent with CEI EN
  62548 §7 for the Italian climate).
- Hottest expected module temperature: **+70 °C** (consistent with the
  same article — cell-temperature worst case under high irradiance).
- Reference soil for shadow modelling: opaque flat ground, December solar
  elevation 20 °, azimuth 350 °.

Operating outside these assumptions (e.g. mountain sites with colder
expected temperatures, or installations outside Italy) **invalidates the
string-window verdict** until the assumptions are revisited.

---

## 5. Documents NOT used for sizing decisions

To prevent drift, the following commonly-cited documents are explicitly
**not** authoritative for any current formula in the codebase:

- **Manufacturer application notes** other than the datasheet values listed
  above. They may be referenced for documentation but never override a CEI
  / CEI EN article.
- **Online calculators** (PVGIS, PV-Syst, etc.). Used by engineers for
  validation, not as a source for in-code formulas.
- **Regional or municipal regulations** (e.g. urbanistic constraints). The
  app surfaces fire-safety distances per DCPREV-14030 but does not model
  city-specific building regulations.

---

## 6. Change protocol

To change any pinned edition or formula reference:

1. Open a PR that simultaneously updates:
   - this `COMPLIANCE.md` row;
   - the corresponding `INV-P-*` line in `INVARIANTS.md` (if the formula
     changes shape, not only the citation);
   - (after AP-08) the golden test fixture for the affected formula;
   - the SLD footer / PDF cover string template (so deliverables track
     the new edition).

2. Document the **before / after**: which edition was assumed, which is
   assumed now, and which numbers (if any) changed.

3. Trigger a paired "norms migration" entry once AP-21 (norms registry)
   exists — old projects must be re-openable under their original
   edition with explicit "Cosa è cambiato" surfaced to the user.

---

## 7. Open questions for domain expert sign-off

The following items in this document need confirmation by a qualified
designer before AP-01 can be considered authoritative rather than draft:

1. Exact edition of **CEI 0-21** in force at production date.
2. Exact edition of **CEI 64-8** (8th edition variants 2021/2022).
3. Active edition of **CEI EN 62548** (2017 + A1:2020 vs newer).
4. Whether **CEI UNEL 35024 (2021)** is the latest tabulated capacity
   issue, or whether a newer revision exists.
5. Whether the application of the AC voltage-drop limit defaults to **4 %**
   (overall) or **3 % + 1 %** split between DC and AC sides — both are
   common engineering choices.
6. Whether the DC/AC ratio bound of **1.33** is the correct CEI 0-21
   reference, or whether it should be expressed as a softer "engineering
   guideline" rather than a hard cap.
7. Whether GSE/GAUDÌ CSV column schema has changed since the version
   currently emitted by `exportGSE`.

These should be resolved before AP-08 freezes the formulas under golden
tests, so that we are not freezing an outdated reference.
