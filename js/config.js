// ── config.js — Costanti e configurazione globale ──

'use strict';

// CONFIG — tutte le costanti parametriche dell'applicazione
const CONFIG = {

  // ── Persistenza ──────────────────────────────────────────────────
  STORAGE_KEY:    'sdp_project_v1',
  MAX_HISTORY:    30,

  // ── Viewport ──────────────────────────────────────────────────────
  ZOOM_MIN:       0.1,
  ZOOM_MAX:       10,

  // ── Algoritmo layout ─────────────────────────────────────────────
  GRID_SUBDIV_X:  6,    // sottodivisioni griglia asse X (precision vs speed)
  GRID_SUBDIV_Y:  10,   // sottodivisioni griglia asse Y
  FILTER_CLUSTER: 1.6,  // moltiplicatore max-step per cluster pannelli isolati

  // ── Simboli tecnici su canvas ────────────────────────────────────
  TECH_RING_RATIO:   1.35,  // raggio cerchio VVF = sizePx/2 × TECH_RING_RATIO
  TECH_HANDLE_RATIO: 1.85,  // distanza handle rotazione = r × TECH_HANDLE_RATIO
  TECH_EXCLUSION_DASH_ON:  5,   // px dash-on cerchio VVF (canvas)
  TECH_EXCLUSION_DASH_OFF: 3,   // px dash-off cerchio VVF (canvas)

  // ── Oggetti tecnici ───────────────────────────────────────────────
  TECH: {
    LABELS:  {chimney:'Camino', antenna:'Antenna', hvac:'UTA/HVAC', skylight:'Lucernario', exhaust:'Esalatore'},
    COLORS:  {chimney:'#7c3aed', antenna:'#0ea5e9', hvac:'#d97706', skylight:'#059669', exhaust:'#16a34a'},
    LIST_COLORS: {chimney:'#a78bfa', antenna:'#38bdf8', hvac:'#fbbf24', skylight:'#34d399', exhaust:'#86efac'},
    /** Buffer VVF default per tipo (m) — normativa DCPREV-14030 §3.3.5.1 */
    DEFAULT_BUFFER: {chimney:0, antenna:0, hvac:0, skylight:0, exhaust:0},
  },

  // ── Colori aree installabili (ciclati per indice area) ─────────────
  AREA_COLORS: [
    { fill: 'rgba(34,197,94,0.15)',  stroke: '#16a34a' },
    { fill: 'rgba(59,130,246,0.15)', stroke: '#2563eb' },
    { fill: 'rgba(234,179,8,0.15)',  stroke: '#ca8a04' },
    { fill: 'rgba(168,85,247,0.15)', stroke: '#9333ea' },
    { fill: 'rgba(20,184,166,0.15)', stroke: '#0d9488' },
    { fill: 'rgba(249,115,22,0.15)', stroke: '#ea580c' },
    { fill: 'rgba(236,72,153,0.15)', stroke: '#db2777' },
    { fill: 'rgba(99,102,241,0.15)', stroke: '#4f46e5' },
  ],

  // ── Ombra solare (camini) ─────────────────────────────────────────
  SHADOW: {
    LAT_DEG:   44,      // latitudine media Italia (gradi)
    MONTH_DEC: 12,      // mese peggiore (dicembre)
    ELEVATION_DEG: 20,
    SHADOW_AZIMUTH_DEG: 350,
    OPACITY: 0.22,
  },

  // ── PDF export ───────────────────────────────────────────────────
  PDF: {
    DPI:             300,
    MARGIN_MM:       20,
    HEADER_H_MM:     22,
    FOOTER_H_MM:     9,
    GAP_MM:          4,
    CARTIGLIO_RATIO: 0.195,  // larghezza cartiglio = pageWidth × CARTIGLIO_RATIO
    TITLE_BLOCK_H:   44,     // altezza blocco titolo in fondo cartiglio (mm)
    PLAN_PAD:        0.22,   // padding bbox planimetria (22% sui 4 lati)
    BORDER_COLOR:    '#9ca3af',
    BORDER_W_MM:     0.25,
    JPEG_QUALITY:    0.95,
    FORMATS: [
      { name: 'A3', w: 420, h: 297 },
      { name: 'A2', w: 594, h: 420 },
      { name: 'A1', w: 841, h: 594 },
      { name: 'A0', w: 1189, h: 841 },
    ],
    SCALES: [100, 200, 500, 1000, 2000],
  },
};
