# Solar Designer Pro

Desktop application for photovoltaic plant design, targeted at the Italian
market (CEI / CEI EN / CEI UNEL compliance, GSE / GAUDÌ export). Built as a
single Electron-shell over a vanilla-JS / Canvas / SVG renderer.

This README is for developers. Engineer-facing documentation lives in
[`USER_MANUAL.md`](USER_MANUAL.md).

## Stack

- **Electron 31** (BrowserWindow shell, `contextIsolation: true`).
- **Vanilla JavaScript** (no bundler yet — Phase 3 of the
  professionalization plan).
- **HTML5 Canvas** for the planimetry editor; **SVG** for the single-line
  diagram (SLD).
- **electron-builder** for Windows NSIS installer (`npm run dist`).
- Vendored offline assets: `vendor/pdfjs/` (PDF.js 3.11.174), `assets/fonts/`
  (JetBrains Mono).

## Quick start

```sh
npm install
npm start
```

`npm start` runs the application via Electron in dev mode (DevTools opens
automatically; see `main.js`).

## Build installer

```sh
npm run dist
```

Produces an NSIS Windows installer under `dist/`. The Electron build config
is in `package.json` under `build.*`.

## Project structure

The authoritative project map lives in [`CLAUDE.md`](CLAUDE.md). High-level
layout:

```
main.js                       Electron entry (window, menu)
solar-designer-v89.html       Single HTML — UI shell + all DOM
data/                         Preset libraries (modules, inverters)
js/                           Domain logic, UI, rendering
  config.js, state.js         Constants and global state
  storage.js                  localStorage persistence + undo/redo
  canvas.js                   Geometry, drawing, transforms
  panels.js                   Panel layout algorithm (scanline)
  strings.js                  String / inverter assignment + thermal checks
  pdf.js                      PDF planimetry import (PDF.js)
  cables.js                   Cable sizing + SLD generation + GSE export
  export.js                   PNG / DXF / PDF report
  enhancements.js             Status bar, minimap, shortcuts
  ui.js                       init(), event handlers, accordion widgets
css/                          variables.css, layout.css, components.css, canvas.css
vendor/pdfjs/                 PDF.js core + worker (vendored)
assets/fonts/                 JetBrains Mono webfonts (vendored)
docs/reference/               Reference materials (ref-schema.pdf, etc.)
schema unifilare/             Italian-language design specifications for SLD
```

## Engineering guardrails

Read **before** any code change:

- [`INVARIANTS.md`](INVARIANTS.md) — physical / workflow / output / data
  invariants. The product contract.
- [`COMPLIANCE.md`](COMPLIANCE.md) — pinned editions of CEI / EN / UNEL norms
  and the formula → article map.
- [`CRITICAL_FLOWS.md`](CRITICAL_FLOWS.md) — manual smoke checklist to run
  before merging any PR that touches code.
- [`DO_NOT_TOUCH_PAIRS.md`](DO_NOT_TOUCH_PAIRS.md) — files that must change
  together.

## Roadmap

The project is mid-evolution under a multi-phase professionalization plan
(Guardrails → Immediate fixes → Engineering foundation → Architecture
restructuring → Product-grade capabilities). Current phase: **Phase 1 —
Immediate professional fixes**.

## License

Proprietary. Vendored third-party assets retain their original licenses:

- `vendor/pdfjs/LICENSE` — Apache 2.0 (Mozilla pdf.js).
- `assets/fonts/OFL.txt` — SIL Open Font License 1.1 (JetBrains Mono).
