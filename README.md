[ **English** | [Українська](README.uk.md) | [Italiano](README.it.md) ]

# Solar Designer Pro

Desktop application for designing photovoltaic (PV) installations against
Italian electrical norms (CEI 0-21, CEI 64-8, CEI EN 62548, DCPREV-14030,
CEI UNEL 35024). Single Electron shell over a vanilla-JS / Canvas / SVG
renderer, intended for designers and qualified installers who need to
produce project documentation, single-line diagrams, and GSE/GAUDÌ
filings from one tool, offline.

The user interface is Italian by design — terminology, norm references,
and units follow the conventions used by Italian PV designers.

## Core capabilities

- **Planimetry import** — PNG or PDF base image, calibrated to a known
  distance for real-world scale.
- **Area drawing** — installable and exclusion polygons on the canvas;
  technical obstacles (chimneys, antennas, HVAC, skylights, exhausts)
  with fire-safety buffers per DCPREV-14030.
- **Automatic panel layout** — scanline placement with orientation
  search, walkway and grouping options, concave-area decomposition.
- **Module library** — 15 datasheet-backed presets (JA Solar, LONGi,
  Canadian Solar, Jinko, Risen, Generico) plus user-editable presets.
- **Inverter library** — SAJ R5 monophase, AT3 three-phase, C6
  industrial; per-MPPT string parallelism from datasheets.
- **String validation with thermal correction** — Voc @ −10 °C and
  Vmpp @ +70 °C against inverter limits (CEI EN 62548 §7).
- **Cable sizing** — DC string, DC main, AC by voltage drop and current
  capacity (CEI UNEL 35024 Method B/C), with grouping/installation
  derating factors.
- **Single-line diagram (SLD)** — SVG generation with BT/MT switching,
  cartiglio, revisioni list, optional BESS topology.
- **Exports** — SVG and high-resolution PNG for the SLD; PDF report
  with cartiglio; CSV for GSE/GAUDÌ filings.
- **Project file format `.sdproj`** — versioned JSON with `version`,
  `metadata`, `project` blocks; Open/Save dialogs and localStorage
  auto-save as recovery snapshot.
- **Crash logging** — uncaught renderer errors are written to
  `<userData>/logs/app.log` with bounded rotation (1 MB × 5 files).

## Workflow overview

1. **S1** — load planimetry (PNG or PDF).
2. **S2** — calibrate scale from two points.
3. **S3** — select or define the PV module.
4. **S4** — draw installable and exclusion areas.
5. **S5** — place technical obstacles with safety buffers.
6. **S6** — run panel layout; review per-area results.
7. **S7** — configure inverters and strings.
8. **S8** — size DC and AC cables.
9. **S9** — generate single-line diagram; export deliverables
   (SVG / PNG / PDF / GSE CSV).

## Tech stack

- **Electron 31** with `contextIsolation: true` and a small preload
  bridge for crash-logging IPC.
- **Vanilla JavaScript** in strict mode, bundled by a small Node
  concat script into `dist/app.js` (no ES modules or TypeScript yet —
  those steps are on the Phase 3 roadmap).
- **HTML5 Canvas** for planimetry editing; **SVG** for the SLD.
- **PDF.js 3.11.174** (vendored, offline-first) for PDF planimetry
  import.
- **electron-builder** for the Windows NSIS installer.
- **ESLint 10** flat config; strict-mode enforced across all files.
- **Vitest 4** for golden tests on cable-sizing formulas.
- **GitHub Actions** CI: lint, test, electron-builder `--dir` dry-run,
  artifact upload.

## Repository structure

```
main.js                       Electron main process
preload.js                    contextBridge IPC for crash logging
solar-designer-v89.html       Single renderer entry — DOM + UI shell
build/bundle.js               Renderer bundler (concat → dist/app.js)
dist/app.js                   Generated renderer bundle
data/                         Built-in module / inverter preset libraries
js/                           Renderer source
  config.js, state.js         Constants and global state
  storage.js                  .sdproj save/open, recovery, readers
  canvas.js, panels.js        Geometry, drawing, panel layout
  strings.js                  Inverter / string assignment & validation
  pdf.js                      PDF planimetry import
  export.js                   PDF / JSON / SVG / PNG export
  enhancements.js             Status bar, minimap, shortcuts
  ui.js                       init(), event handlers, widgets
  lib/sizing.js               Pure cable-sizing helpers (golden-tested)
  cables.js                   Orchestrator (calcCables, inverter list,
                              module presets, modal toggles)
  cables/sld-render.js        SLD SVG generation
  cables/sld-export.js        SLD → SVG/PNG, GSE CSV
  cables/verifiche.js         Inverter validation, verifiche panel
css/                          Component stylesheets
vendor/pdfjs/                 Vendored PDF.js (offline)
assets/fonts/                 Vendored JetBrains Mono webfonts
docs/                         Reference docs, schemas, lint baseline
schema unifilare/             Italian-language SLD design specs
schemas/sdproj.v1.json        .sdproj schema (informational)
tests/                        Vitest golden tests + fixtures
.github/workflows/ci.yml      Lint / test / build dry-run pipeline
```

Engineering contract docs (read before any code change):

- [`INVARIANTS.md`](INVARIANTS.md) — physical / workflow / output / data
  invariants.
- [`COMPLIANCE.md`](COMPLIANCE.md) — pinned editions of CEI / EN / UNEL
  norms and the formula → article map.
- [`CRITICAL_FLOWS.md`](CRITICAL_FLOWS.md) — manual smoke checklist.
- [`DO_NOT_TOUCH_PAIRS.md`](DO_NOT_TOUCH_PAIRS.md) — files that must
  change together.

## Getting started

Requirements:

- Node.js LTS (≥ 20)
- npm 10+

```sh
git clone https://github.com/Zojniq/SunPanelPO.git
cd SunPanelPO
npm install
```

## Build / run commands

| Command | Purpose |
|---|---|
| `npm start` | Build renderer bundle and launch the app (dev mode) |
| `npm run build:bundle` | Regenerate `dist/app.js` only |
| `npm test` | Run vitest golden tests for cable sizing |
| `npm run lint` | Run ESLint (must report 0 errors) |
| `npm run dist` | Build the Windows NSIS installer |

`npm start` and `npm run dist` chain the bundle build automatically.

## Current project status

The project is mid-evolution under a multi-phase professionalization
plan. **Phase 3 — Architecture restructuring is in progress.**

| Phase | Status |
|---|---|
| 0 — Guardrails | done |
| 1 — Immediate professional fixes | done |
| 2 — Engineering foundation | done (Gate D ready with tracked risks) |
| 3 — Architecture restructuring | in progress |
| 4 — Product-grade capabilities | pending |
| 5 — Long-term evolution | gated |

### Phase 3 progress

- **AP-14 — Bundler integration** ✅ Node concat builder writes
  `dist/app.js`; HTML loads a single renderer script.
- **AP-15 — `cables.js` decomposition** ✅ Split into orchestrator
  (`cables.js`), `cables/sld-render.js`, `cables/sld-export.js`, and
  `cables/verifiche.js`. `cables.js` reduced from ~2350 to ~460 lines.
- **AP-16 — `ui.js` decomposition** ⏭ next.
- **AP-17 — State store** — pending.
- **AP-18 — Type adoption (JSDoc → TypeScript for new code)** — pending.
- **AP-19 — innerHTML sanitization** — pending.

## Notes / limitations

- **User interface is Italian.** This is intentional — the product is
  designed for Italian PV installations under Italian electrical norms.
- **Domain assumptions for Italy** — coldest-module temperature
  −10 °C, hottest +70 °C, latitude ~44 °N for shadow estimates. Use
  outside Italy invalidates string-window verdicts until assumptions
  are revised.
- **Engineer judgement is required.** The application supports a
  qualified designer; it does not replace one. Cable sections, string
  windows, and verifiche output must be reviewed against the relevant
  CEI editions in force at project time.
- **Single project per session.** One active project at a time;
  auto-save keeps a recovery snapshot in localStorage. `.sdproj` is
  the canonical user-managed format for sharing and archival.
- **Italian market.** Norm references (CEI 0-21, CEI 64-8, CEI EN 62548,
  DCPREV-14030, CEI UNEL 35024) target Italy; GSE/GAUDÌ export is the
  Italian TSO-side filing format.

## License

Proprietary. Vendored third-party assets retain their original licenses:

- `vendor/pdfjs/LICENSE` — Apache 2.0 (Mozilla pdf.js).
- `assets/fonts/OFL.txt` — SIL Open Font License 1.1 (JetBrains Mono).
