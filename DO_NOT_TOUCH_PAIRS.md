# DO NOT TOUCH PAIRS

> Document version: 1.0 (initial baseline, AP-01).
> Pairs of files / regions of code that must be changed together. Touching one
> without touching its partner is a known regression vector and is treated as
> a defect even if the PR appears to pass review.

This is a defensive list. Most pairs exist because the codebase has structural
duplication that AP-08 / AP-15 will eventually eliminate. Until then, ignoring
a pair listed here is the most common way to break the application in a way
that is not immediately obvious from a diff.

Each entry has:
- **Pair name** and **stable ID** (`PAIR-NN`).
- **Files / regions** involved.
- **Why coupled** — the structural reason they must change together.
- **What breaks if you ignore the pair** — concrete failure mode.
- **When the coupling can be retired** — which approval package finally
  separates them.

---

## PAIR-01 — Save schema ↔ Load schema

- **Region A:** `_buildFullState()` in [js/storage.js:24-78](js/storage.js#L24).
- **Region B:** `loadSavedState()` shape-handling in
  [js/storage.js:80-162](js/storage.js#L80).
- **Why coupled:** the two functions duplicate the per-area, per-inverter,
  per-cartiglio field defaults by hand. Adding a field to A without B silently
  drops it on the next load; adding to B without A means the field is never
  saved.
- **What breaks:** newly introduced project fields are silently lost across
  a save → reload cycle. Users notice only later, when a generated SLD is
  missing data that was visible in the previous session.
- **When retired:** AP-10 (`.sdproj` file format with a single canonical
  schema definition consumed by both reader and writer).

## PAIR-02 — SLD render ↔ SLD export

- **Region A:** `renderUnifilare()` in [js/cables.js:970](js/cables.js#L970).
- **Region B:** `exportUnifilare(fmt)` in [js/cables.js:2154](js/cables.js#L2154).
- **Why coupled:** the export function rasterises / serialises the SVG built
  by render. Any change to the render's SVG attributes, viewBox, fonts, or
  CSS dependencies must be matched by the exporter, or the exported PNG / SVG
  differs from what the user sees in the preview modal.
- **What breaks:** preview looks fine; the exported PNG / SVG has clipped
  edges, missing fonts, wrong colours, or different viewBox proportions.
- **When retired:** AP-15 (cables.js decomposition splits these into
  `cables/sld-render.js` and `cables/sld-export.js` with a shared SVG
  contract).

## PAIR-03 — Module preset shape ↔ Preset applier

- **Region A:** `MODULE_PRESETS` entries in
  [js/state.js:168-192](js/state.js#L168).
- **Region B:** `applyModulePreset(idx)` in
  [js/cables.js:518](js/cables.js#L518) and `_populateModulePresets()` in
  [js/cables.js:492](js/cables.js#L492).
- **Why coupled:** the applier reads specific keys from the preset object
  (`brand`, `name`, `pw`, `pl`, `pp`, `isc`, `voc`, `impp`, `vmpp`,
  `tcoef_voc`, `tcoef_pmax`, `iscr`, `vsys_max`). Adding a new key to A
  without a corresponding read in B leaves data in the preset unused; renaming
  a key in A without updating B silently fills the form with `undefined`.
- **What breaks:** the form may silently apply `undefined` to numeric fields,
  triggering NaN-propagation deep into sizing (INV-W-12 violation).
- **When retired:** AP-05 (presets move to `data/modules.json` with a defined
  schema and a single loader/validator).

## PAIR-04 — Inverter preset shape ↔ Inverter list consumers

- **Region A:** `INV_PRESETS` in `js/cables.js` (around the `applyInvPreset`
  region — [js/cables.js:483](js/cables.js#L483) area).
- **Region B:** `addInverterToList()`
  ([js/cables.js:333](js/cables.js#L333)),
  `updateInverterListUI()` ([js/cables.js:356](js/cables.js#L356)),
  `_syncHiddenInvFields()` ([js/cables.js:428](js/cables.js#L428)),
  `_assignInverterMeta()` ([js/strings.js:391](js/strings.js#L391)),
  `_getInverterTotals()` ([js/cables.js:307](js/cables.js#L307)),
  `updateInvValidation()` ([js/cables.js:465](js/cables.js#L465)).
- **Why coupled:** the `_inverterList` entry shape `{key, brand, model, pac,
  mppt, strPerMppt, vMin, vMax, iMax, vocMax, ac, qty}` is consumed in many
  unrelated regions. Adding a field requires updating every consumer or the
  field silently disappears on first save → reload (PAIR-01) and worse:
  validation logic silently passes against the missing value.
- **What breaks:** string validation (INV-P-10) silently succeeds against an
  inverter with missing `vocMax`, producing strings that exceed the inverter
  rating in reality.
- **When retired:** AP-05 (inverter presets → JSON) plus AP-17 (state store
  centralises the canonical inverter type).

## PAIR-05 — Snapshot serialiser ↔ Snapshot applier

- **Region A:** `_getSnapshot()` in
  [js/storage.js:166-174](js/storage.js#L166).
- **Region B:** `_applySnapshot(json)` in
  [js/storage.js:183-195](js/storage.js#L183).
- **Why coupled:** undo/redo round-trip. Any state slice serialised in A but
  not restored in B is reset on every undo. Any slice restored from B but not
  serialised in A is reset from a stale value.
- **What breaks:** undo silently rolls back state the user did not intend to
  roll back (e.g. an inverter the user did not undo), or reverts only half of
  a logical change. Hard to reproduce, easy to ship.
- **When retired:** AP-17 (state store). Once a single canonical store
  exists, snapshot is its serialise / deserialise — the pair collapses.

## PAIR-06 — Inline HTML handlers ↔ Global function names

- **Region A:** ~100 inline attribute handlers in `solar-designer-v89.html`
  (`onclick="…"`, `oninput="…"`, `onchange="…"`).
- **Region B:** corresponding global functions in `js/*.js` (e.g.
  `loadFile`, `startCal`, `toggleTheme`, `renderUnifilare`,
  `confirmString`, `addRevisione`, `exportUnifilare`, …).
- **Why coupled:** the HTML attribute references the JS function by name. If
  the function is renamed, namespaced (e.g. moved under a module), or wrapped
  in IIFE, the HTML attribute breaks **silently** — buttons stop working but
  no console error appears on page load.
- **What breaks:** specific UI buttons become no-ops with no visible warning;
  often surfaces during the smoke checklist as "I clicked but nothing
  happened".
- **When retired:** AP-14 (bundler with a `window` shim that re-exposes
  module-scope functions globally) **and** AP-16 (ui.js decomposition, which
  necessarily renames or relocates handlers). Until both ship, every PR that
  renames a globally-callable function must grep the HTML for inline usages.

## PAIR-07 — `CONFIG.AREA_COLORS` ↔ All area-colour consumers

- **Region A:** `CONFIG.AREA_COLORS` in
  [js/config.js:35-44](js/config.js#L35).
- **Region B:** uses in `js/canvas.js` (`draw` polygon fills), `js/ui.js`
  (`updateAreaLists`, `_buildAreaHeader`), and any future PDF / SLD code that
  reads area colours.
- **Why coupled:** the array length defines the cycle. Changing the array
  length without updating consumers that hardcode an index (rare but
  possible) causes a colour mismatch between canvas, area list, and PDF
  legend.
- **What breaks:** area #5 appears one colour on canvas, a different colour
  in the legend — confusing in shareable deliverables.
- **When retired:** never, by design. This pair is intentional: changes to
  the palette should always be reviewed against all visual consumers.

## PAIR-08 — Layout cache ↔ Module / area parameters

- **Region A:** layout-affecting fields in the UI (`pw`, `pl`, `ps`,
  `safetyMargin`, `obstacleDistance`, `walkway*`, `staggerOffset`, area
  `orientation`) — `oninput` handlers in `solar-designer-v89.html`.
- **Region B:** `invalidateLayoutCache()` in
  [js/panels.js:38](js/panels.js#L38).
- **Why coupled:** the layout cache is keyed on a hash that does **not**
  include every relevant input. Adding a new layout-affecting field without
  adding it to the cache-key computation (or calling
  `invalidateLayoutCache()` from its `oninput`) causes stale layouts to
  persist after the user changes the field (INV-W-07 violation).
- **What breaks:** changing e.g. a walkway interval visibly does nothing
  until something else triggers a relayout. Users blame the UI, not the
  cache.
- **When retired:** AP-17 (state store) + AP-03 work (layout subsystem
  refactor under tests). Until then, every new layout-relevant input must
  add `invalidateLayoutCache()` + `_relayoutDebounced()` to its `oninput`.

## PAIR-09 — Snap to PDF vertices ↔ PDF document lifecycle

- **Region A:** `_pdfSnapPoints`, `_pdfSnapEnabled` (state in
  `js/state.js`), `togglePdfSnap`, `_nearestPdfSnap`
  ([js/canvas.js:79](js/canvas.js#L79)).
- **Region B:** PDF document loader in `js/pdf.js` (sets `_pdfDoc`,
  populates `_pdfSnapPoints`) and the image loader path which resets snap
  state (`loadImageFile` in [js/pdf.js:16-38](js/pdf.js#L16)).
- **Why coupled:** loading a new image must clear the snap points from the
  previous PDF. Loading a new PDF must populate fresh snap points. Forgetting
  either side leaves stale snap targets that pull cursors to invisible
  locations on the new image.
- **What breaks:** cursor "magnetises" to coordinates with no visible
  feature — the most confusing class of bug, since the user sees no
  on-canvas reason for the snap.
- **When retired:** AP-17 (state store, with explicit PDF lifecycle).

## PAIR-10 — Cable formula constants ↔ Capacity tables — **RETIRED (AP-08-main)**

- **Status:** retired by AP-08-main. Both regions live together in
  [js/lib/sizing.js](js/lib/sizing.js) inside a single IIFE. The
  length-aligned section + capacity tables can no longer be edited in
  separate files. The coupling is now structural — any change to
  `CABLE_SECTIONS` requires editing the four `CABLE_CAPACITY_*` rows
  immediately above/below it in the same file.
- **Original concern (preserved for history):** `CABLE_SECTIONS` and the
  four `CABLE_CAPACITY_*` arrays must stay length-aligned by index.
  Drift produces `getCableCapacity(S) === '?'` for a result section, or
  sizing silently accepting `undefined ≥ I`.
- **Test gate:** golden tests in
  [tests/sizing/capacity.test.js](tests/sizing/capacity.test.js) and
  [tests/sizing/cable.test.js](tests/sizing/cable.test.js) lock the
  current table values; any divergence between sections and capacities
  fails the suite.

## PAIR-11 — Cartiglio fields ↔ SLD render ↔ Saved state

- **Region A:** cartiglio `<input>` elements in
  `solar-designer-v89.html` (`cartCommittente`, `cartIndirizzo`,
  `cartProgettista`, `cartAlbo`, `cartNumDisegno`, `cartRevisione`,
  `cartSpiModello`, `cartSpiMatricola`, `cartSpiCertificato`).
- **Region B:** `renderUnifilare` reads from these IDs to populate the SLD
  cartiglio.
- **Region C:** `_buildFullState().cartiglio` ([js/storage.js:67-76](js/storage.js#L67))
  and the load-back block ([js/storage.js:129-141](js/storage.js#L129)).
- **Why coupled:** adding a cartiglio field requires the HTML input, the
  SLD render lookup, **and** both halves of PAIR-01. Forgetting any one
  silently drops user-entered values somewhere along the chain.
- **What breaks:** a field the user filled in is missing from the SLD, or
  is lost on reload. Damaging for deliverables sent to clients.
- **When retired:** AP-24 (cartiglio templates centralise the field list;
  consumers iterate the schema rather than hardcoded IDs).

## PAIR-12 — Multi-inverter MPPT colour map ↔ SLD legend

- **Region A:** the MPPT-box colour cycle inside `renderUnifilare`
  ([js/cables.js:970+](js/cables.js#L970)) — magenta / blue / brown / green.
- **Region B:** any legend, PDF caption, or printed key that explains those
  colours (currently embedded in `renderUnifilare` itself; future:
  PDF report engine AP-22).
- **Why coupled:** changing the colour cycle in one place without the other
  produces a SLD whose legend lies about which inverter is which.
- **What breaks:** a deliverable that visually contradicts itself — the
  worst class of output bug for an engineering document.
- **When retired:** AP-22 (PDF report engine takes ownership of the
  shared colour-to-inverter map).

---

## How to use this list

1. **Before opening a PR**: scan the list. If your change touches any region
   listed above, the partner region must also be in your PR diff (or
   explicitly justified in the description as "not needed because…").

2. **During review**: a reviewer rejecting a PR because the listed partner
   was not touched is acting correctly. The author should add the partner
   change, not negotiate it away.

3. **Adding to the list**: when a future bug is caused by an unlisted
   coupling, add a `PAIR-NN` entry **in the same PR that fixes the bug**.
   That is the cheapest moment — the structural reason is fresh.

4. **Removing from the list**: only when the corresponding approval package
   structurally eliminates the duplication (column "When retired"). Until
   then, the entry stays even if the team "thinks they remember".
