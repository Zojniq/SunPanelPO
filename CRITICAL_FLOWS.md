# CRITICAL FLOWS — Smoke checklist

> Document version: 1.0 (initial baseline, AP-01).
> This is the manual regression gate. It must be runnable in **≤ 5 minutes**
> by anyone with access to a build of the application. If it takes longer,
> the checklist is too long, not the engineer too slow.

A green run of this checklist is the **minimum required signal** before
merging any PR that touches code (not docs). Automated tests (added in
AP-07+) supplement, but do not replace, this checklist until a full e2e
harness exists (deferred to Phase 5 if ever).

---

## 0. Pre-flight

Before starting the checklist:

- [ ] Working from a clean profile: rename or delete `~/Library/Application
  Support/Solar Designer Pro/` (macOS), `%APPDATA%\Solar Designer Pro\`
  (Windows), or equivalent `userData` directory.
- [ ] Working from clean browser localStorage (when running via
  `electron .`, the userData folder above contains the relevant store).
- [ ] **Wi-Fi off** (this is a non-negotiable check — the product is
  offline-first; see INV-W-06 and Phase 1 AP-03 goals).
- [ ] Have a sample planimetry PNG **and** a sample PDF planimetry on disk
  (path-known, ready to drop).
- [ ] Have a stopwatch — the run must complete in ≤ 5 minutes.

---

## 1. Smoke checklist (the 12 steps)

Each step has a **trigger**, an **expected outcome**, and a **fail signal**.
Run them in order. Stop at the first failure and report.

### Step 1 — Application launch

- **Trigger:** `npm start` or run the installed `.exe` (release build).
- **Expected:**
  - Window opens at 1400 × 900 (or saved size).
  - Title bar reads "Solar Designer Pro".
  - No DevTools window opens in a **release build** (INV / Phase 1 AP-02).
  - Stats strip at the top shows `0` / `0 kWp` / `0 m²`.
- **Fail signals:**
  - White flash before the window appears.
  - Console errors visible to the user.
  - DevTools open in release.

### Step 2 — Welcome state

- **Trigger:** observe the canvas after launch with no prior project.
- **Expected:**
  - Welcome message visible: "Carica un'immagine o un PDF…".
  - S1 (planimetria) section enabled.
  - S2–S9 visibly disabled (`.section.disabled`).
- **Fail signals:** later sections accidentally enabled, welcome message
  missing.

### Step 3 — Load PNG planimetry

- **Trigger:** drag a PNG file onto the canvas (or click "Carica
  immagine o PDF").
- **Expected:**
  - Image renders centred on canvas.
  - Compass widget appears (top-right of canvas).
  - S2 (calibrazione) becomes enabled.
  - Status text under S1 shows the file name.
- **Fail signals:** image distorted, S2 still disabled, no compass.

### Step 4 — Calibrate scale

- **Trigger:**
  1. Enter `10` in the "Distanza reale (m)" field.
  2. Click "Calibra".
  3. Click two distinct points on the image.
- **Expected:**
  - A live measurement label shows pixel distance while moving the
    second cursor.
  - After the second click, calibration completes and `scale > 1`.
  - "calStatus" reads success.
  - S3 (modulo) becomes enabled.
- **Fail signals:** scale not committed, S3 stays disabled, label flicker.

### Step 5 — Configure module from preset

- **Trigger:** in S3, open the "Modello (preset)" dropdown and select any
  preset (e.g. JA Solar JAM54S30-405/MR).
- **Expected:**
  - `pw`, `pl`, `pp`, `moduleIsc`, `moduleVoc`, `moduleImpp`,
    `moduleVmpp`, `moduleTcoefVoc`, `moduleTcoefPmax` all populate at
    once (INV-W-12).
  - No values left blank.
- **Fail signals:** partial application (some fields filled, others not),
  preset dropdown empty, default falls back to custom.

### Step 6 — Draw an installable area

- **Trigger:**
  1. Click "Disegna area installabile" in S2.
  2. Click 4 points on the image forming a quadrilateral.
  3. Press `Enter`.
- **Expected:**
  - First three clicks produce visible vertex markers and segments.
  - On `Enter`, the polygon closes, fills with the area-1 colour
    (`CONFIG.AREA_COLORS[0]`).
  - Area appears in S2 area list with an area in m² and a panel
    preview count.
  - S4 (ostacoli) becomes enabled.
- **Fail signals:** polygon not closing, area not appearing in list,
  area count or m² obviously wrong.

### Step 7 — Generate panels

- **Trigger:** in the area list, set the panel count (or use "+/−") and
  confirm.
- **Expected:**
  - Panels render inside the polygon, respecting orientation,
    margins, and walkways.
  - Stats strip updates: `N moduli` / `N×Wp / 1000 kWp` / area m².
  - S5–S6 become enabled.
- **Fail signals:** panels outside polygon, overlapping panels, count
  mismatch with the requested value.

### Step 8 — Add an inverter

- **Trigger:** in S5, select an inverter from the dropdown (e.g. SAJ
  AT3-6K) and click "Aggiungi".
- **Expected:**
  - Inverter appears in the parco inverter list.
  - Hidden fields (`#invVmpptMin`, `#invVocMax`, `#invImaxMppt`) sync
    automatically (INV-W-11).
  - Strings are auto-generated; `strings.length > 0`.
  - `updateInvValidation` shows green (or amber/red with explanation
    if the configuration is invalid).
- **Fail signals:** strings not generated, validation traffic light
  silent, hidden fields stale.

### Step 9 — Verify cable sizing

- **Trigger:** scroll to S6 (cavi/SLD), enter sensible cable lengths
  (e.g. `cableLenString=15`, `cableLenMain=30`, `cableLenAC=20`).
- **Expected:**
  - "Risultati" section populates with: DC string section, DC main
    section, AC section, percentage voltage drop on each.
  - Sections are values from `CABLE_SECTIONS` (INV-P-05) — never an
    arbitrary number.
- **Fail signals:** results blank, sections outside the canonical
  ladder, voltage drop > 4 % silently accepted without warning.

### Step 10 — Open SLD preview

- **Trigger:** click "Schema unifilare" in S6.
- **Expected:**
  - Modal opens with the SVG SLD.
  - Top-down sequence visible: Rete BT → NT1 → POD → QGBT (DGFV+SPD)
    → Q3 → M0 → Quadro Inverter → Barra DC → Stringhe → Cartiglio.
  - Cartiglio block visible (INV-O-01) with at least empty fields for
    Committente, Indirizzo, Progettista, Albo.
  - Revisioni list contains at least row "00 — Prima emissione"
    (INV-O-02).
  - MPPT box colour matches inverter index (INV-O-04).
- **Fail signals:** missing cartiglio, missing DGFV/SPD (INV-O-03),
  wrong MPPT colour, SLD empty.

### Step 11 — Export SLD as PNG

- **Trigger:** in the SLD modal, click "Esporta PNG".
- **Expected:** PNG file is offered for download / saved; opening it in
  an external viewer shows the same diagram at higher resolution (2×).
- **Fail signals:** download fails, image truncated, fonts substituted.

### Step 12 — Undo / Redo / Save-reload cycle

- **Trigger:**
  1. Delete a single panel (e.g. select a panel and press `Delete`).
  2. Press `Ctrl+Z` (undo).
  3. Press `Ctrl+Y` (redo).
  4. Close the window.
  5. Reopen the application (`npm start` or installer).
- **Expected:**
  - Step 2 restores the panel exactly where it was.
  - Step 3 removes it again.
  - On step 5, the application opens with the project restored
    (panels, areas, inverter, strings all present).
  - The reload uses the on-disk auto-save (INV-W-06).
- **Fail signals:** undo produces orphan state (INV-W-04), redo
  silently no-ops, reload shows an empty workspace.

---

## 2. PDF planimetry sub-flow

If the PR touches `js/pdf.js` or any PDF.js asset (vendored or otherwise),
**also run this** before merging:

- [ ] Drag a PDF planimetry onto the canvas.
- [ ] PDF page picker modal opens.
- [ ] Navigate pages (`pdfPageNav`) — preview updates.
- [ ] Select a page and confirm. The page renders on canvas at the chosen
      DPI.
- [ ] Toggle "Snap PDF" (vector-snap). Snap points appear when hovering
      near PDF vector vertices.
- [ ] Resume Steps 4–12 from the main checklist using this PDF as base.

---

## 3. PDF report export sub-flow

If the PR touches `js/export.js`, `CONFIG.PDF`, font assets, or anything
referenced from the cartiglio:

- [ ] After Step 12, trigger PDF report export.
- [ ] Confirm the format (A3 default) and scale.
- [ ] Verify PDF margins follow `CONFIG.PDF.MARGIN_MM` (INV-O-06).
- [ ] Verify embedded image quality is acceptable (INV-O-07).
- [ ] Verify the cover lists project name + designer + timestamp
      (post-AP-11: also app version + norms revision, INV-O-10).
- [ ] Open the PDF in a separate viewer with the application closed —
      it must display correctly without any link back to the app.

---

## 4. GSE/GAUDÌ CSV sub-flow

If the PR touches `exportGSE` or any inverter/string data shape:

- [ ] In the SLD modal click "Esporta GSE/GAUDÌ".
- [ ] CSV file saves.
- [ ] Open the CSV in a spreadsheet: column headers and order match the
      expected GAUDÌ schema (INV-O-09).
- [ ] Values for inverter Pac, string Voc, string Isc agree with what is
      shown in S5/S6 (no silent re-rounding).

---

## 5. When to run which

| Change scope | Required runs |
|---|---|
| Docs only | none |
| `main.js`, `solar-designer-v89.html` shell | Steps 1–3 |
| `js/config.js`, `js/state.js` (data only, no code) | Steps 1–12 |
| `js/ui.js`, `js/canvas.js`, `js/storage.js` | Steps 1–12 |
| `js/panels.js` | Steps 1–12 |
| `js/strings.js` | Steps 1–12 |
| `js/cables.js` (sizing) | Steps 1–12 + recompute the same project on a known reference and compare |
| `js/cables.js` (SLD render) | Steps 1–12 + §2 (if PDF base) + §3 (PDF export) + §4 (GSE CSV) |
| `js/pdf.js`, `vendor/pdfjs/*` | Steps 1–12 + §2 |
| `js/export.js`, `assets/fonts/*` | Steps 1–12 + §3 |
| Anything touching `_inverterList`, `MODULE_PRESETS`, `INV_PRESETS` | Steps 1–12 + §4 |
| Build configuration, packaging, installer | Steps 1–3 from a **fresh installer** (not `npm start`) |

---

## 6. Reference fixtures (recommended, not enforced)

To make the checklist reproducible across machines and contributors, keep
a fixed set of inputs at hand:

- `fixtures/planimetry-sample.png` — a representative flat-roof sketch
  with a known scale.
- `fixtures/planimetry-sample.pdf` — a representative AutoCAD-exported
  PDF with embedded vector geometry.
- `fixtures/reference-5kW-mono.sdproj` — a known-good 5 kWp single-phase
  project (after AP-10, when `.sdproj` exists). Opening it must produce
  identical SLD and cable sections every time.
- `fixtures/reference-20kW-tri.sdproj` — a 20 kWp three-phase project,
  same role.

These do not exist yet in the repository. They are listed here so that
when AP-10 lands, this checklist can be tightened to "open
`reference-5kW-mono.sdproj` and verify byte-identical SLD output".

---

## 7. Reporting failures

If a step fails, capture:

1. Which step (e.g. "Step 7 — Generate panels").
2. The exact `INV-*` identifier(s) that appear to be violated, if any.
3. A screenshot of the canvas and the corresponding console log line.
4. The console output (`F12` in dev build) showing any errors.

Do not "fix forward" without first reproducing the failure and creating
a ticket / issue. Silent fixes erode the safety net.
