// ── build/bundle.js — Renderer bundle generator (AP-14) ─────────────────
// Concatenates the renderer source files in the exact order previously
// loaded by individual <script> tags in solar-designer-v89.html. Writes
// dist/app.js. No transformation, no minification, no source maps — pure
// concatenation with separator comments for debug visibility.
//
// File order is locked here and must mirror the historical HTML script
// load order; any addition for later APs (cables decomposition, ui
// decomposition, store) appends to this list rather than touching HTML.

'use strict';

const fs   = require('fs');
const path = require('path');

const SOURCES = [
  'data/modules.data.js',
  'data/inverters.data.js',
  'js/config.js',
  'js/state.js',
  'js/store.js',
  'js/dom.js',
  'js/storage.js',
  'js/canvas.js',
  'js/panels.js',
  'js/strings.js',
  'js/pdf.js',
  'js/export.js',
  'js/lib/sizing.js',
  'js/cables.js',
  'js/cables/sld-render.js',
  'js/cables/sld-export.js',
  'js/cables/verifiche.js',
  'js/enhancements.js',
  'js/ui/utils.js',
  'js/ui/widgets-module.js',
  'js/ui/widgets-area.js',
  'js/ui/widgets-tech.js',
  'js/ui/dialogs.js',
  'js/ui/events-area.js',
  'js/ui/events-canvas.js',
  'js/ui/init.js',
  'js/ui.js',
];

const ROOT     = path.resolve(__dirname, '..');
const OUT_DIR  = path.join(ROOT, 'dist');
const OUT_FILE = path.join(OUT_DIR, 'app.js');

const parts = [];
for (const rel of SOURCES) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) {
    console.error('[build:bundle] missing source: ' + rel);
    process.exit(1);
  }
  parts.push('// ── ' + rel + ' ──');
  parts.push(fs.readFileSync(abs, 'utf-8'));
  parts.push('');
}

const bundle = parts.join('\n');

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, bundle, 'utf-8');

const bytes  = Buffer.byteLength(bundle, 'utf-8');
const sizeKb = (bytes / 1024).toFixed(1);
console.log('[build:bundle] wrote ' + path.relative(ROOT, OUT_FILE) +
            ' (' + sizeKb + ' KB, ' + SOURCES.length + ' files)');
