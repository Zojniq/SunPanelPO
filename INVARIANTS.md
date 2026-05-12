# INVARIANTS

> Document version: 1.0 (initial baseline, AP-01).
> This document is the product contract. Any change here requires explicit approval
> and a paired update to `COMPLIANCE.md`, golden tests (once they exist), and
> in many cases `CRITICAL_FLOWS.md`.

Solar Designer Pro guarantees the properties below. They must not be silently
broken by refactoring, performance work, or feature development. Any planned
change that affects an invariant must be called out in the PR description and
re-approved with a corresponding update to this file.

Each invariant has an `INV-ID` used for cross-reference in `COMPLIANCE.md`,
code comments, and (later) test names.

---

## 1. Physical formula invariants

These formulas drive cable sizing, string sizing, and electrical compatibility.
They are the legally and physically meaningful core of the product. Numbers
quoted here are the current ground truth; changing any of them is a domain
decision, not a code decision.

### INV-P-01 — Conductor conductivity (Cu, Al at 20 °C)

- Copper: `σ_Cu = 56 m/(Ω·mm²)` (`js/lib/sizing.js` `SIGMA_CU`).
- Aluminium: `σ_Al = 35 m/(Ω·mm²)` (`js/lib/sizing.js` `SIGMA_AL`).

These are simplified standard values at 20 °C. Any temperature correction
factor must be applied on top via `kCorr`, not by mutating `σ`.

### INV-P-02 — Cable cross-section is the maximum of two criteria

`calcSection` always returns the smallest commercial cross-section that
simultaneously satisfies:

1. **Voltage-drop criterion:** `S_drop = (nCond × L × I) / (σ × ΔV)`.
2. **Current-carrying criterion (with derating):** the smallest commercial
   section whose tabulated capacity satisfies `capacity[i] ≥ I / max(kCorr, 0.1)`,
   where `kCorr = k1 × k2` (installation × grouping, CEI UNEL 35026).

The final result is then normalised to the nearest commercial size from
`CABLE_SECTIONS = [1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120]` mm².

### INV-P-03 — PV string cable minimum section is 4 mm²

For DC string cables (`isDC = true`), the returned section is never less than
`MIN_PV_STRING_MM2 = 4 mm²` regardless of the calculated minimum. This applies
to all PV string conductors (H1Z2Z2-K).

### INV-P-04 — AC cable formula includes power factor

`calcSectionAC` uses `S_drop = (nCond × L × I × cosφ) / (σ × ΔV)`. The default
`cosφ = 1.0` if not provided. For typical AC inverter output the value used in
the project is supplied via the AC system field; the formula must never drop
the `cosφ` term.

### INV-P-05 — Commercial cable sections list

The commercial section ladder is exactly:
`[1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120]` mm².
This list is canonical for both DC and AC sizing. No interpolation, no
arbitrary intermediate sizes. Extending it requires a paired update to
`CABLE_CAPACITY_CU_DC`, `CABLE_CAPACITY_CU_AC`, and derived Al tables.

### INV-P-06 — Cable capacity tables (Cu, PVC, T_amb 30 °C)

- DC string outdoor (Method C):
  `CABLE_CAPACITY_CU_DC = [13, 17.5, 24, 32, 41, 57, 76, 101, 125, 151, 192, 232, 269]` A.
- AC / DC main in conduit (Method B):
  `CABLE_CAPACITY_CU_AC = [11, 14.5, 20, 27, 34, 46, 61, 80, 99, 119, 151, 182, 210]` A.

Both tables are length-aligned with `CABLE_SECTIONS`. Index `i` in any
capacity table corresponds to `CABLE_SECTIONS[i]`.

### INV-P-07 — Aluminium-to-copper capacity factor

`CABLE_CAPACITY_AL_* = round(CABLE_CAPACITY_CU_* × 0.78)`.
The 0.78 factor is the CEI UNEL aluminium derating relative to copper for
identical section, insulation, and installation method.

### INV-P-08 — Voc cold-side temperature correction

Worst-case open-circuit voltage at cold module temperature:

```
Voc_cold = Voc_stc × (1 + kVoc × (T_min − T_stc))
T_min = −10 °C
T_stc = +25 °C
kVoc  = tcoef_voc / 100           (datasheet %/°C → 1/°C)
```

`Voc_cold` is the value used in `n_max_voc = floor(VocMax / Voc_cold)` to
limit the number of modules per string against the inverter's `VocMax`.
This invariant comes from CEI EN 62548 §7.

### INV-P-09 — Vmpp hot-side temperature correction

Worst-case MPP voltage at hot module temperature:

```
Vmpp_hot = Vmpp_stc × (1 + kVoc × (T_max − T_stc))
T_max = +70 °C
T_stc = +25 °C
kVoc  = tcoef_voc / 100
```

`Vmpp_hot` is used in `n_min_vmpp = ceil(Vmin / Vmpp_hot)` to ensure the MPPT
input minimum is met at the hottest expected module operating point.

### INV-P-10 — String count window

The valid number of modules per string `n` satisfies simultaneously:

```
ceil(Vmin / Vmpp_hot)   ≤   n   ≤   floor(VocMax / Voc_cold)
```

`Vmin` and `VocMax` come from the selected inverter. If `n_min_vmpp >
n_max_voc` the configuration is invalid and must be surfaced in
`updateInvValidation`.

### INV-P-11 — Per-MPPT string parallelism

`strPerMppt` is the number of strings paralleled on a single MPPT input,
taken from the inverter datasheet (not user-editable per project).
`_getProjectStrPerMpptMax` returns the maximum across all inverters in
`_inverterList`. Mixed values across inverters are surfaced by
`_hasMixedStrPerMppt` and must be reported to the user.

### INV-P-12 — DC/AC ratio bound (residential)

For CEI 0-21 residential systems the DC-to-AC ratio `Pdc / Pac` must not
exceed `1.33` by default. The application must flag values above this
threshold but must not silently clip them — the engineer decides.

### INV-P-13 — Earth rod equivalent diameter

`EARTH_ROD_D = 0.014 m` is the equivalent diameter of a 25×3 mm vertical
flat-strip earth electrode (CEI 64-8 / IEC 62305 reference). Used for
grounding resistance estimates; not for sizing of active conductors.

---

## 2. Workflow invariants

These constrain valid state transitions in the UI. They are what keeps the
engineer from arriving at an internally inconsistent project file.

### INV-W-01 — Step-gate progression

UI sections are progressively enabled:

```
S1 (planimetria)   ─ always available
S2 (calibrazione)  ─ enabled only after an image/PDF is loaded
S3 (modulo)        ─ enabled only after calibration produces scale > 1
S4 (ostacoli)      ─ enabled only after at least one installable area exists
S5 (stringhe)      ─ enabled only after panels have been generated
S6 (cavi/SLD)      ─ enabled only after at least one inverter is added
```

Bypassing this order via direct DOM manipulation is not supported and may
produce inconsistent state.

### INV-W-02 — Calibration produces a valid scale

`scale` is in pixels per real metre. After calibration, `scale > 1` must
hold. A non-calibrated session keeps `scale = 1` (the default) and S3+ stays
disabled.

### INV-W-03 — Escape never destroys persisted data

Pressing `Escape` aborts the current in-flight operation (`area` drawing,
`cal` calibration, `tech` placement, `exp` arrow, vertex edit). It must not
delete any already-saved area, panel, string, or inverter.

### INV-W-04 — Undo cannot create orphan panels

The undo/redo stack only stores snapshots produced by `snapshot()`. After
any undo or redo, every `panels[i].areaIdx` must reference a valid index in
`installableAreas`, and every `strings[*].panels[*].id` must exist in
`panels`. If a snapshot would violate this, it must not be pushed.

### INV-W-05 — `snapshot()` precedes every state-mutating UI action

Any user action that mutates `panels`, `strings`, `installableAreas`,
`exclusionAreas`, `technicalObjects`, or `_inverterList` must call
`snapshot()` before applying the change. Failing to do so breaks undo.

### INV-W-06 — Auto-save is debounced, not synchronous

`saveState()` debounces to `_persistState()` 800 ms after the last call.
Code must not assume that localStorage is up-to-date immediately after a
mutation. Source of truth is the in-memory state; localStorage is a recovery
snapshot only.

### INV-W-07 — Layout cache must be invalidated on module changes

Any change to `pw`, `pl`, `ps`, `safetyMargin`, `obstacleDistance`,
`walkway*` parameters, or area orientation must call
`invalidateLayoutCache()` before re-running `engineeringLayout` or
`_relayoutArea`. Otherwise stale layout results may persist.

### INV-W-08 — Area rectangle close requires ≥2 vertices

`R` key (close as rectangle) is only valid in `mode === 'area'` with at
least two clicked vertices. Below that, the key is a no-op.

### INV-W-09 — Polygon area close requires ≥3 vertices

`Enter` key (close polygon) is only valid in `mode === 'area'` with at
least three clicked vertices.

### INV-W-10 — World coordinates are the source of truth

All geometry (`installableAreas.points`, `panels.x/y`, `technicalObjects`)
is stored in world coordinates (image pixels). Screen coordinates are
derived per-frame via `worldToScreen` based on `z`, `ox`, `oy`. Storing
screen coords on persistent objects is forbidden.

### INV-W-11 — Inverter list is the canonical source for string capacity

`#invStrTot`, `#invVmpptMin`, `#invVmpptMax`, `#invVocMax`, `#invImaxMppt`,
`#invPac` are hidden derived values synchronised from `_inverterList` via
`_syncHiddenInvFields`. The form fields must never be set directly by user
code.

### INV-W-12 — Selecting a module preset overwrites form fields atomically

`applyModulePreset(idx)` overwrites `pw`, `pl`, `pp`, `moduleIsc`,
`moduleVoc`, `moduleImpp`, `moduleVmpp`, `moduleTcoefVoc`,
`moduleTcoefPmax` together. Partial application is forbidden.

### INV-W-13 — Adding/removing inverters never silently drops user strings

`addInverterToList` and `removeInverterFromList(idx)` may trigger a
string regeneration, but only with explicit user awareness via the
existing toast/confirm path. Silent string deletion is forbidden.

### INV-W-14 — Theme toggle persists in localStorage, not in `.sdproj`

Theme (`sdp_theme`) is a user-machine preference, not a project property.
It must not be embedded in saved project state.

### INV-W-15 — Mouse middle-button is pan, left is action, right is context

Mouse button semantics:
- Left: primary action (mode-dependent).
- Middle: pan (drag).
- Right: contextual menu (`handleRightClick`).

These bindings must not be remapped without explicit approval.

---

## 3. Output invariants

These define the minimum content of generated artefacts. A deliverable that
does not satisfy these is considered defective.

### INV-O-01 — SLD always contains a cartiglio

Every rendered single-line diagram (`renderUnifilare`) contains a cartiglio
block holding at minimum:
- Committente (client name).
- Indirizzo (site address).
- Progettista (designer name) and Albo (registration number).
- Numero disegno.
- Revisione (current revision).
- SPI modello / matricola / certificato.

Missing user-entered fields are rendered as blanks, never silently omitted.

### INV-O-02 — SLD contains a revisioni list with at least rev "00"

The SLD revisioni block always contains at least one row, defaulting to
revision "00" / "Prima emissione". Additional revisions are user-added via
`addRevisione`.

### INV-O-03 — SLD shows DGFV / SPD AC at the QGBT

The QGBT (quadro generale BT) block always renders a DGFV interruttore and
an SPD AC. They may not be silently removed for visual compactness.

### INV-O-04 — Multi-inverter MPPT box colours

MPPT boxes are colour-coded by inverter index in `_inverterList`:
- Inverter 1: magenta.
- Inverter 2: blue.
- Inverter 3: brown.
- Inverter 4: green.

If more than four inverters are present, the colour cycle is documented
behaviour, not a bug to "fix" by random assignment.

### INV-O-05 — SLD carries TAV.02 mark

The cartiglio includes the tavola identifier "TAV.02" by default. This is
the standard naming used by Italian PV project documentation packages.

### INV-O-06 — PDF report margins follow CONFIG.PDF

Generated PDF reports use `CONFIG.PDF.MARGIN_MM = 20`,
`HEADER_H_MM = 22`, `FOOTER_H_MM = 9`, `GAP_MM = 4`. Hardcoded magic
numbers in `export.js` are forbidden; values must come from `CONFIG.PDF`.

### INV-O-07 — PDF JPEG quality

Raster images embedded in PDFs use `CONFIG.PDF.JPEG_QUALITY = 0.95`.
Lower values are forbidden without explicit approval (legibility of cable
labels and MPPT colours degrades quickly below 0.9).

### INV-O-08 — PDF supported page formats

PDF reports support exactly the formats in `CONFIG.PDF.FORMATS`: A3, A2,
A1, A0 (landscape millimetre dimensions as listed). Adding new formats
requires a paired update to `CONFIG.PDF.FORMATS` and the export UI.

### INV-O-09 — GSE/GAUDÌ CSV column schema is fixed per format version

The CSV produced by `exportGSE()` follows the GSE/GAUDÌ schema. The
schema version used is recorded in the file (or filename) so that future
schema changes do not retroactively invalidate older deliverables.

### INV-O-10 — Generated deliverables include traceability headers

(Becomes enforceable after AP-11, but stated here as the invariant.)
Every generated deliverable (SLD footer, PDF cover, GSE CSV header)
includes:
- Application version (e.g. `Solar Designer Pro v1.x.y`).
- Reference norm edition (e.g. `CEI 0-21 ed. 2024`).
- Generation timestamp (ISO 8601).

---

## 4. Data invariants

These define the shape of in-memory and persisted state.

### INV-D-01 — Persisted state has a `version` field

The persisted blob in `localStorage['sdp_project_v1']` always has a
`version` field. Current code emits `'sdp-v9'`. Loaders must check
`version` before interpreting other fields and migrate or reject
unknown versions explicitly.

### INV-D-02 — Top-level state keys

A valid persisted project contains at least:
`installableAreas`, `exclusionAreas`, `technicalObjects`, `panels`,
`strings`, `calPts`, `inverterList`, `moduleParams`, `cartiglio`,
`scale`, `panelOrientation`, `walkwaysEnabled`.

Missing required keys → migration or reject; never silent defaulting
without logging.

### INV-D-03 — Area integrity

Each `installableAreas[i]` has at minimum:
- `points: [{x, y}, ...]` with `≥3` distinct vertices.
- `type: 'installable'`.
- `orientation: 'auto' | 'portrait' | 'landscape'` (default `'auto'`).

Each `exclusionAreas[i]` has at minimum `points` (`≥3` vertices).

### INV-D-04 — Panel-area referential integrity

Every `panels[i].areaIdx` is a valid index into `installableAreas`. Panels
referencing nonexistent areas must be removed during load.

### INV-D-05 — String-panel referential integrity

Every panel referenced in `strings[s].panels` is uniquely identified by
the tuple `(areaIdx, row, column)` so that loading can rebind the
reference to the live panel object (see `loadSavedState` rebinding loop).
Strings whose panels cannot be rebound must be dropped, not left dangling.

### INV-D-06 — Inverter quantity is positive

For every `_inverterList[i]`, `qty ≥ 1` integer. Removal of the last unit
must call `removeInverterFromList(idx)`, not set `qty = 0`.

### INV-D-07 — Undo stack bound

`_undoStack.length ≤ MAX_HIST = 30`. Older snapshots are dropped from the
front when the bound is reached. `_redoStack` is cleared on every fresh
`snapshot()`.

### INV-D-08 — Module preset selection is by index, not by object copy

`_modulePresetKey` is an integer index into `MODULE_PRESETS` (or `null`
for a custom module). Storing a copy of the preset object is forbidden —
the project file must remain re-interpretable if a future version of the
preset library updates a model's parameters (with explicit user notice).

### INV-D-09 — World coordinates are integers or finite floats

`points`, `panels.x/y`, `technicalObjects.x/y`, `calPts` contain finite
numbers. `NaN`, `Infinity`, or missing keys are forbidden in saved state.

### INV-D-10 — Persistence size warning threshold

Persisting a state larger than 3 MB raises a user-visible warning (see
`_persistState`). Hard rejection is not implemented; the user is in
charge of exporting backups for very large projects.

---

## Change protocol

Any change to this document must:

1. Be proposed alongside a PR (no orphan doc edits).
2. Be cross-referenced in `COMPLIANCE.md` if it touches an `INV-P-*` entry.
3. Trigger a paired test addition or update once golden tests exist.
4. Be reviewed by someone with PV domain literacy, not just code review.

A future automated check should fail CI if an `INV-*` identifier is removed
without an explicit `# Removed-Invariant: INV-X-NN — reason` annotation.
