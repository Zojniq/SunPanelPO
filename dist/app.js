// ── data/modules.data.js ──
// ── data/modules.data.js — Libreria moduli FV (preset built-in) ──
// Caricato come <script> prima di state.js. Definisce il globale MODULE_PRESETS.
// Per estensioni utente (Phase 4 / AP-20): userData/libraries/modules.json.

'use strict';

var MODULE_PRESETS = [
  // ── JA Solar ──────────────────────────────────────────────────────────
  // iscr = corrente inversa massima ammissibile (da datasheet — stima ≈ 1.35×Isc arrotondata)
  // vsys_max = tensione massima di sistema (V) — 1000V per moduli standard
  { brand:'JA Solar',        name:'JAM54S30-405/MR',    pw:1.134, pl:1.722, pp:405, isc:10.56, voc:37.26, impp:9.98, vmpp:40.58, tcoef_voc:-0.27, tcoef_pmax:-0.35, iscr:15.0, vsys_max:1000 },
  { brand:'JA Solar',        name:'JAM66D45-590/LB',    pw:1.303, pl:2.172, pp:590, isc:14.02, voc:52.70, impp:13.20,vmpp:44.72, tcoef_voc:-0.27, tcoef_pmax:-0.35, iscr:20.0, vsys_max:1500 },
  { brand:'JA Solar',        name:'JAM72D42-630/LB',    pw:1.303, pl:2.384, pp:630, isc:16.00, voc:49.50, impp:15.10,vmpp:41.72, tcoef_voc:-0.28, tcoef_pmax:-0.35, iscr:22.0, vsys_max:1500 },
  // ── LONGi Solar ───────────────────────────────────────────────────────
  { brand:'LONGi',           name:'Hi-MO 6 LR5-54HTH-440M', pw:1.134, pl:1.762, pp:440, isc:10.91, voc:51.40, impp:10.31,vmpp:42.68, tcoef_voc:-0.27, tcoef_pmax:-0.34, iscr:15.0, vsys_max:1000 },
  { brand:'LONGi',           name:'Hi-MO X6 LR5-66HTH-595M',pw:1.303, pl:2.172, pp:595, isc:14.05, voc:53.25, impp:13.27,vmpp:44.87, tcoef_voc:-0.27, tcoef_pmax:-0.34, iscr:20.0, vsys_max:1500 },
  { brand:'LONGi',           name:'Hi-MO X6 LR5-72HTH-665M',pw:1.303, pl:2.384, pp:665, isc:16.56, voc:50.40, impp:15.63,vmpp:42.52, tcoef_voc:-0.27, tcoef_pmax:-0.34, iscr:22.5, vsys_max:1500 },
  // ── Canadian Solar ────────────────────────────────────────────────────
  { brand:'Canadian Solar',  name:'CS6R-415T HiKu6',    pw:1.134, pl:1.762, pp:415, isc:10.50, voc:50.20, impp: 9.92,vmpp:41.83, tcoef_voc:-0.27, tcoef_pmax:-0.35, iscr:15.0, vsys_max:1000 },
  { brand:'Canadian Solar',  name:'CS7N-655MS HiKu7',   pw:1.303, pl:2.384, pp:655, isc:16.16, voc:50.15, impp:15.27,vmpp:42.90, tcoef_voc:-0.27, tcoef_pmax:-0.35, iscr:22.0, vsys_max:1500 },
  // ── Jinko Solar ───────────────────────────────────────────────────────
  { brand:'Jinko Solar',     name:'JKM420N-54HL4-V Tiger Neo', pw:1.134, pl:1.722, pp:420, isc:10.93, voc:51.30, impp:10.26,vmpp:40.95, tcoef_voc:-0.26, tcoef_pmax:-0.30, iscr:15.0, vsys_max:1000 },
  { brand:'Jinko Solar',     name:'JKM580N-72HL4-V Tiger Neo', pw:1.303, pl:2.278, pp:580, isc:13.94, voc:52.68, impp:13.16,vmpp:44.10, tcoef_voc:-0.26, tcoef_pmax:-0.30, iscr:19.0, vsys_max:1500 },
  { brand:'Jinko Solar',     name:'JKM660N-78HL4-BDV Tiger Neo Bifacial', pw:1.303, pl:2.465, pp:660, isc:16.50, voc:50.28, impp:15.61,vmpp:42.29, tcoef_voc:-0.26, tcoef_pmax:-0.30, iscr:22.5, vsys_max:1500 },
  // ── Risen Energy ──────────────────────────────────────────────────────
  { brand:'Risen Energy',    name:'RSM40-8-400M',        pw:1.134, pl:1.722, pp:400, isc:10.28, voc:49.50, impp: 9.68,vmpp:41.33, tcoef_voc:-0.28, tcoef_pmax:-0.36, iscr:14.0, vsys_max:1000 },
  { brand:'Risen Energy',    name:'RSM110-8-545BMDG Bifacial', pw:1.303, pl:2.172, pp:545, isc:13.97, voc:49.50, impp:13.17,vmpp:41.43, tcoef_voc:-0.28, tcoef_pmax:-0.36, iscr:19.0, vsys_max:1500 },
  // ── Generico / Personalizzato ─────────────────────────────────────────
  { brand:'Generico',        name:'400Wp std',           pw:1.134, pl:1.722, pp:400, isc:9.78,  voc:41.8,  impp:9.20, vmpp:43.5,  tcoef_voc:-0.30, tcoef_pmax:-0.40, iscr:14.0, vsys_max:1000 },
  { brand:'Generico',        name:'550Wp BiFi',          pw:1.303, pl:2.172, pp:550, isc:13.95, voc:44.4,  impp:13.17,vmpp:41.8,  tcoef_voc:-0.30, tcoef_pmax:-0.40, iscr:19.0, vsys_max:1500 },
];


// ── data/inverters.data.js ──
// ── data/inverters.data.js — Libreria inverter (preset built-in) ──
// Caricato come <script> prima di cables.js. Definisce il globale INV_PRESETS.
// Per estensioni utente (Phase 4 / AP-20): userData/libraries/inverters.json.

'use strict';

var INV_PRESETS = {
  // SAJ R5 — Monofase  (strPerMppt = max stringhe in parallelo per ingresso MPPT, da datasheet)
  r5_1k5: { brand:'SAJ', model:'R5-1.5K',    pac:1.5,  mppt:1, strPerMppt:1, vMin:80,  vMax:500,  iMax:11,  vocMax:600,  ac:'mono' },
  r5_2k:  { brand:'SAJ', model:'R5-2K',      pac:2,    mppt:1, strPerMppt:1, vMin:80,  vMax:500,  iMax:11,  vocMax:600,  ac:'mono' },
  r5_3k:  { brand:'SAJ', model:'R5-3K',      pac:3,    mppt:2, strPerMppt:1, vMin:80,  vMax:500,  iMax:11,  vocMax:600,  ac:'mono' },
  r5_3k68:{ brand:'SAJ', model:'R5-3.68K',   pac:3.68, mppt:2, strPerMppt:1, vMin:80,  vMax:500,  iMax:11,  vocMax:600,  ac:'mono' },
  r5_4k:  { brand:'SAJ', model:'R5-4K',      pac:4,    mppt:2, strPerMppt:1, vMin:80,  vMax:500,  iMax:11,  vocMax:600,  ac:'mono' },
  r5_5k:  { brand:'SAJ', model:'R5-5K',      pac:5,    mppt:2, strPerMppt:1, vMin:80,  vMax:500,  iMax:12.5,vocMax:600,  ac:'mono' },
  r5_6k:  { brand:'SAJ', model:'R5-6K',      pac:6,    mppt:2, strPerMppt:1, vMin:80,  vMax:500,  iMax:12.5,vocMax:600,  ac:'mono' },
  // SAJ AT3 — Trifase commerciale
  at3_10k:{ brand:'SAJ', model:'AT3-10K',    pac:10,   mppt:2, strPerMppt:1, vMin:160, vMax:1000, iMax:15,  vocMax:1100, ac:'tri'  },
  at3_12k:{ brand:'SAJ', model:'AT3-12K',    pac:12,   mppt:2, strPerMppt:1, vMin:160, vMax:1000, iMax:15,  vocMax:1100, ac:'tri'  },
  at3_15k:{ brand:'SAJ', model:'AT3-15K',    pac:15,   mppt:3, strPerMppt:1, vMin:160, vMax:1000, iMax:15,  vocMax:1100, ac:'tri'  },
  at3_17k:{ brand:'SAJ', model:'AT3-17K',    pac:17,   mppt:3, strPerMppt:1, vMin:160, vMax:1000, iMax:15,  vocMax:1100, ac:'tri'  },
  at3_20k:{ brand:'SAJ', model:'AT3-20K',    pac:20,   mppt:4, strPerMppt:1, vMin:160, vMax:1000, iMax:20,  vocMax:1100, ac:'tri'  },
  at3_25k:{ brand:'SAJ', model:'AT3-25K',    pac:25,   mppt:4, strPerMppt:1, vMin:160, vMax:1000, iMax:20,  vocMax:1100, ac:'tri'  },
  at3_30k:{ brand:'SAJ', model:'AT3-30K',    pac:30,   mppt:4, strPerMppt:1, vMin:160, vMax:1000, iMax:20,  vocMax:1100, ac:'tri'  },
  // SAJ C6 — String inverter industriale (2 stringhe per ingresso MPPT da datasheet)
  c6_30k: { brand:'SAJ', model:'C6-30K-T6',  pac:30,   mppt:4, strPerMppt:2, vMin:200, vMax:1000, iMax:20,  vocMax:1100, ac:'tri'  },
  c6_36k: { brand:'SAJ', model:'C6-36K-T6',  pac:36,   mppt:4, strPerMppt:2, vMin:200, vMax:1000, iMax:20,  vocMax:1100, ac:'tri'  },
  c6_40k: { brand:'SAJ', model:'C6-40K-T6',  pac:40,   mppt:4, strPerMppt:2, vMin:200, vMax:1000, iMax:20,  vocMax:1100, ac:'tri'  },
  c6_50k: { brand:'SAJ', model:'C6-50K-T6',  pac:50,   mppt:6, strPerMppt:2, vMin:200, vMax:1000, iMax:25,  vocMax:1100, ac:'tri'  },
  c6_60k: { brand:'SAJ', model:'C6-60K-T6',  pac:60,   mppt:6, strPerMppt:2, vMin:200, vMax:1000, iMax:25,  vocMax:1100, ac:'tri'  },
  c6_75k: { brand:'SAJ', model:'C6-75K-T6',  pac:75,   mppt:6, strPerMppt:2, vMin:200, vMax:1000, iMax:25,  vocMax:1100, ac:'tri'  },
  c6_100k:{ brand:'SAJ', model:'C6-100K-T6', pac:100,  mppt:6, strPerMppt:2, vMin:200, vMax:1000, iMax:32,  vocMax:1100, ac:'tri'  },
};


// ── js/config.js ──
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


// ── js/state.js ──
// ── state.js — Variabili globali di stato dell'applicazione ──

'use strict';

// ── Rendering canvas ─────────────────────────────────────────────────
let canvas, ctx;
let img       = null;   // immagine planimetrica caricata
let scale     = 1;      // px per metro reale (impostato dalla calibrazione)
let z         = 1;      // livello di zoom viewport
let ox        = 0;      // pan offset X (pixel schermo)
let oy        = 0;      // pan offset Y (pixel schermo)
let drag      = false;  // true durante pan con tasto medio
let mx        = 0;      // coordinata mouse precedente X (per delta pan)
let my        = 0;      // coordinata mouse precedente Y

// ── Modalità corrente ────────────────────────────────────────────────
let mode          = 'none';  // 'none'|'cal'|'area'|'tech'
let middleDrag    = false;

// ── Calibrazione ────────────────────────────────────────────────────
let calPts = [];  // [pt1, pt2] punti di calibrazione (world coords)

// ── Dati progetto ────────────────────────────────────────────────────
// installableAreas / exclusionAreas — ownership migrated to store.js (AP-17d).
// Bare identifiers remain available as globalThis getter/setter bridges
// defined in store.js. Array-level writes (push/splice/reassignment) should
// go through setStoreSlice; in-place element property mutations are still
// permitted until a later AP-17 step hardens element access.
/** Ostacoli puntuali: {type, x, y, sizePx, sizem, bufferM, label, ang}
 *  type: 'chimney' | 'antenna' | 'hvac' | 'skylight' | 'exhaust' */
// technicalObjects — ownership migrated to store.js (AP-17e). Bare identifier
// remains as a globalThis getter/setter bridge defined in store.js.
// panels — ownership migrated to store.js (AP-17f). Bare identifier remains
// as a globalThis getter/setter bridge defined in store.js. Element property
// mutations (e.g. `panels[i].strId = ...`) still work through the bridge
// getter and will be addressed in a later element-API hardening step.
// strings — ownership migrated to store.js (AP-17g). Bare identifier remains
// as a globalThis getter/setter bridge defined in store.js. Nested property
// mutations on individual string objects (s.id, s.name, s.color, s.panels)
// still work through the bridge getter and will be addressed in a later
// element-API hardening step.

// ── Stato oggetti tecnici ────────────────────────────────────────────
let _techMode           = null;   // tipo in fase di piazzamento, o null
let _selectedTechIdx    = -1;     // indice oggetto tecnico selezionato
let _isDraggingTechRot  = false;  // true mentre si trascina l'handle di rotazione
let _techRotDragStartAng= 0;      // angolo all'inizio del drag

// ── Disegno area in corso ────────────────────────────────────────────
let curPts      = [];    // vertici del poligono in costruzione
let curAreaType = null;  // 'installable' | 'exclusion'

// ── Modalità freccia esposizione ─────────────────────────────────────
let _expArrowMode    = false;
let _expArrowAreaIdx = -1;
let _expArrowStart   = null;
let _expArrowEnd     = null;

// ── Interazione mouse ────────────────────────────────────────────────
let mpos           = {x:0, y:0};  // posizione mouse corrente (world coords)
let pMode          = null;        // modalità pannello manuale aperta
let _orthoRefAngle  = null;        // angolo del primo segmento — riferimento fisso per snap orto
let _distInputOpen  = false;       // true quando l'input distanza manuale è aperto
let hoveredPanel   = -1;          // indice pannello sotto il cursore
let paintMode      = false;       // modalità assegna-stringa col click
let paintStringIdx = 0;           // indice in strings[] della stringa da usare
let justDoubleClicked = false;    // debounce doppio click
let selectedPanels = new Set();   // indici pannelli selezionati
let moveMode       = false;       // true in modalità sposta pannelli
let isDraggingPanels  = false;
let dragStartPoint    = null;
let panelsStartPos    = [];       // posizioni pannelli prima del drag
let snapPreviewPos    = null;     // posizione snap magnetico durante drag

// ── Stringhe & UI ────────────────────────────────────────────────────
let editingStringIdx  = null;
let selectedColor     = null;
let panelOrientation  = 'auto';   // 'auto' | 'portrait' | 'landscape'
let walkwaysEnabled   = false;
let snapEnabled       = true;   // snap magnetico attivo
let orthoEnabled      = true;   // snap ortogonale durante disegno aree
let _copyExclMode     = false;  // modalità incolla area non installabile
let _copyExclPts      = null;   // punti (relativi al centroide) dell'area copiata
let showBuffer        = false;  // visualizza buffer distanza attorno alle zone di esclusione
let stringsVisible    = true;   // mostra colori stringhe su pannelli
let orthoPreviewPt    = null;     // punto snap orto preview
let _highlightInvIdx  = -1;       // -1 = tutti, 0+ = indice 0-based inverter evidenziato

// ── Vertex editing ───────────────────────────────────────────────────
let vertexEditMode    = false;    // true = modalità modifica vertici attiva
let _vtxDragging      = false;    // true durante drag di un vertice
let _vtxAreaType      = null;     // 'installable' | 'exclusion'
let _vtxAreaIdx       = -1;       // indice area in modifica
let _vtxIdx           = -1;       // indice vertice in drag
let _vtxHoverArea     = null;     // {type, areaIdx, vtxIdx} - vertex sotto cursore
let _vtxDragStartPt   = null;     // posizione originale del vertice

// ── Snap griglia metrica ─────────────────────────────────────────────
let metricSnapM       = 0;        // 0 = off, altrimenti passo in metri

// ── Parco inverter ───────────────────────────────────────────────────
/** [{key, brand, model, pac, mppt, vMin, vMax, iMax, vocMax, ac, qty}] */
// _inverterList — ownership migrated to store.js (AP-17c). The identifier
// remains available as a globalThis getter/setter bridge defined there;
// reads resolve to getStoreSlice('inverterList'), assignments route to
// setStoreSlice('inverterList', …). In-place array mutations are
// discouraged — use setStoreSlice with a rebuilt array.

// ── Modulo selezionato dalla libreria ────────────────────────────────
let _modulePresetKey = null;  // indice in MODULE_PRESETS, o null se personalizzato

// ── Persistenza & undo/redo ──────────────────────────────────────────────
const LS_KEY = CONFIG.STORAGE_KEY;
let _saveTimer = null;

// ── Undo / Redo stacks ───────────────────────────────────────────────
const _undoStack = [];
const _redoStack = [];
const MAX_HIST = CONFIG.MAX_HISTORY;

// ── RAF pending flag ─────────────────────────────────────────────────
let _rafPending = false;

// ── Accordion open state ─────────────────────────────────────────────
let _areaAccOpen = false;
let _exclAccOpen = false;

// ── PDF state ────────────────────────────────────────────────────
let _pdfDoc = null;
let _pdfPage = 1;
let _pdfScale = 3.0;

// ── PDF vector snap points ───────────────────────────────────────────
let _pdfSnapPoints = []; // [{x, y}] in canvas/image world coordinates
let _pdfSnapEnabled = false;

// ── Touch state ──────────────────────────────────────────────────────
let _touches=[], _lastPinchD=null, _lastTouchC=null, _touchStartPos=null;
let _lastTapTime=0, _tapTimer=null;

// ── Area preview debounce ────────────────────────────────────────────
let _previewDebounceTimer = null;

// ── Relayout debounce ────────────────────────────────────────────────
let _relayoutTimer = null;

// ── DOM cache ────────────────────────────────────────────────────────
// Moved to js/dom.js (AP-17b). The `DOM` object and `initDOMCache()`
// populator live there; this file no longer owns the cache.

// ── Engineering colors (generated) ───────────────────────────────────
const engineeringColors = (() => {
 const cols = [];
 const hues = [0,18,36,54,72,90,108,126,144,162,180,198,216,234,252,270,288,306,324,342];
 const lights = [40, 52, 65, 35, 58];
 const sats = [85, 75, 90, 70, 80];
 for (let li = 0; li < lights.length; li++) {
   for (const h of hues) {
     cols.push(`hsl(${h},${sats[li]}%,${lights[li]}%)`);
   }
 }
 return cols;
})();

// Alias rapido — dati centrali in CONFIG.AREA_COLORS
const AREA_COLORS = CONFIG.AREA_COLORS;

// Costanti esposizione (usate in _buildAreaHeader e draw)
const EXP_LABELS = {N:'Nord',NE:'Nord-Est',E:'Est',SE:'Sud-Est',S:'Sud',SW:'Sud-Ovest',W:'Ovest',NW:'Nord-Ovest'};
const EXP_COLORS = {S:'#16a34a',SE:'#0ea5e9',SW:'#f59e0b',E:'#6366f1',W:'#ec4899',N:'#64748b',NE:'#94a3b8',NW:'#94a3b8'};

// Riferimenti rapidi alle costanti tech (dal CONFIG centrale)
const TECH_LABELS        = CONFIG.TECH.LABELS;
const TECH_COLORS        = CONFIG.TECH.COLORS;
const TECH_LIST_COLORS   = CONFIG.TECH.LIST_COLORS;
const TECH_DEFAULT_BUFFER= CONFIG.TECH.DEFAULT_BUFFER;

// ── scanlineX buffer pre-allocato per ridurre GC pressure ──
const _scanBuf = new Float64Array(32); // max 32 intersezioni per scanline

// ── Layout result cache ──────────────────────────────────────────────
const _layoutCache = new Map();

// ── Libreria moduli ──────────────────────────────────────────────────
const MODULE_LIB_KEY = 'sdp_module_library';
// MODULE_PRESETS è definito in data/modules.data.js (caricato prima di questo file).


// ── js/store.js ──
// ── js/store.js — Application store skeleton (AP-17a) ──
// Minimal observable store introduced as infrastructure for the AP-17
// gradual state migration. No callers are rewired in this PR; existing
// module-level globals in state.js remain the source of truth until
// later AP-17 sub-steps move ownership into the store.
//
// API:
//   getState()                  → returns the current state object (read-only by convention)
//   setState(patch)             → shallow-merges patch into state and notifies subscribers
//   subscribe(listener)         → registers a listener; returns an unsubscribe function
//   getStoreSlice(key)          → ergonomic single-slice read
//   setStoreSlice(key, value)   → ergonomic single-slice write
//
// Listeners are invoked synchronously with (state, patch). Errors thrown
// from listeners are caught and forwarded to console so a misbehaving
// subscriber cannot break the notification chain.

'use strict';

let _state = {
  inverterList: [],
  installableAreas: [],
  exclusionAreas: [],
  technicalObjects: [],
  panels: [],
  strings: [],
  ui: {},
  viewport: {}
};

const _listeners = [];

function getState() {
  return _state;
}

function setState(patch) {
  if (!patch || typeof patch !== 'object') return _state;
  _state = Object.assign({}, _state, patch);
  for (let i = 0; i < _listeners.length; i++) {
    try { _listeners[i](_state, patch); }
    catch (err) { try { console.error('[store] listener error:', err); } catch (_) { /* ignore */ } }
  }
  return _state;
}

function subscribe(listener) {
  if (typeof listener !== 'function') return function () {};
  _listeners.push(listener);
  return function unsubscribe() {
    const idx = _listeners.indexOf(listener);
    if (idx !== -1) _listeners.splice(idx, 1);
  };
}

function getStoreSlice(key) {
  return _state[key];
}

function setStoreSlice(key, value) {
  const patch = {};
  patch[key] = value;
  return setState(patch);
}

// ── AP-17c — `_inverterList` compatibility bridge ────────────────────────────
// `_inverterList` ownership is migrated to store.inverterList. Legacy callers
// still reference the bare identifier; the bridge below resolves reads to the
// current store slice and routes assignments through setStoreSlice. New write
// paths should call setStoreSlice('inverterList', nextList) directly.
try {
  Object.defineProperty(globalThis, '_inverterList', {
    configurable: true,
    enumerable: true,
    get() { return _state.inverterList; },
    set(v) { setStoreSlice('inverterList', v); }
  });
} catch (_e) { /* property already defined or environment forbids; ignore */ }

// ── AP-17d — `installableAreas` / `exclusionAreas` compatibility bridges ─────
// Temporary AP-17d bridges. Ownership of both polygon slices lives in the
// store; bare identifiers route reads to `_state.<slice>` and assignments
// to `setStoreSlice(<slice>, …)`. Array-level writes (push/splice) should
// be replaced with explicit setStoreSlice calls. In-place element property
// mutations (e.g. `installableAreas[i].orientation = …`) still work
// transparently through the getter and will be addressed in a later step.
try {
  Object.defineProperty(globalThis, 'installableAreas', {
    configurable: true,
    enumerable: true,
    get() { return _state.installableAreas; },
    set(v) { setStoreSlice('installableAreas', v); }
  });
} catch (_e) { /* ignore */ }

try {
  Object.defineProperty(globalThis, 'exclusionAreas', {
    configurable: true,
    enumerable: true,
    get() { return _state.exclusionAreas; },
    set(v) { setStoreSlice('exclusionAreas', v); }
  });
} catch (_e) { /* ignore */ }

// ── AP-17e — `technicalObjects` compatibility bridge ─────────────────────────
// Temporary AP-17e bridge. Ownership of tech-obstacle slice lives in the
// store; reads resolve to `_state.technicalObjects`, assignments route to
// `setStoreSlice('technicalObjects', …)`. In-place element property writes
// (e.g. `technicalObjects[i].ang = …`) still work transparently and will be
// addressed in a later element-API hardening step.
try {
  Object.defineProperty(globalThis, 'technicalObjects', {
    configurable: true,
    enumerable: true,
    get() { return _state.technicalObjects; },
    set(v) { setStoreSlice('technicalObjects', v); }
  });
} catch (_e) { /* ignore */ }

// ── AP-17f — `panels` compatibility bridge ───────────────────────────────────
// Temporary AP-17f bridge. Ownership of placed-panel slice lives in the
// store; reads resolve to `_state.panels`, assignments route to
// `setStoreSlice('panels', …)`. Element property writes (strId, stringColor,
// drag state, etc.) still flow through the getter and are deferred for a
// later element-level hardening step.
try {
  Object.defineProperty(globalThis, 'panels', {
    configurable: true,
    enumerable: true,
    get() { return _state.panels; },
    set(v) { setStoreSlice('panels', v); }
  });
} catch (_e) { /* ignore */ }

// ── AP-17g — `strings` compatibility bridge ──────────────────────────────────
// Temporary AP-17g bridge. Ownership of string-assignment slice lives in the
// store; reads resolve to `_state.strings`, assignments route to
// `setStoreSlice('strings', …)`. Nested property writes on individual string
// objects (e.g. `strings[i].name = …`, `s.panels.push(...)`) still flow
// through the getter and are deferred to a later element-level hardening.
try {
  Object.defineProperty(globalThis, 'strings', {
    configurable: true,
    enumerable: true,
    get() { return _state.strings; },
    set(v) { setStoreSlice('strings', v); }
  });
} catch (_e) { /* ignore */ }


// ── js/dom.js ──
// ── js/dom.js — Centralized DOM cache (AP-17b) ──
// DOM element reference cache extracted from state.js and js/ui/utils.js.
// Owns the shared `DOM` object and the `initDOMCache()` populator. Callers
// continue to access cached references via bundle-scope `DOM.<id>` and
// the populator is still triggered from init() at app startup.

'use strict';

const DOM = {};

function initDOMCache() {
  [
    'calStatus','moveBtn','deletePanelsBtn','snapBtn','welcome',
    'pw','pl','pp','ps','safetyMargin','obstacleDistance',
    'techSize','techBuffer','techRot','techRotVal','techRotRow','techSizeRow',
    'fileStatus','exportOverlay','exportLabel','hint',
    'enableWalkways','walkwaySettings','enableStagger','staggerOffset',
    'walkwayInterval','walkwayWidth','stringNum','pairNum','panelNum',
    'areaList','exclusionList','stringList','areaAccordionBar',
    'areaAccordionSummary','exclusionAccordionBar','exclusionAccordionSummary',
    'stringsDropdown','stringsDropPanel','stringsDropBtn','stringsDropList',
    'stringsDropCount','stringsDropFooter','undoBtn','redoBtn',
    'pmInfo','pmTitle','panelModal','colorModal','dist',
    'strConfigPanel','strConfigBtn','strConfigArrow',
    'areaAccordionArrow','exclusionAccordionArrow',
    'techPlacingInfo','pdfSnapToggle','pdfPageModal',
    'areaBtn','exclusionBtn','calBtn','compass','themeBtn',
    'totalP','totalKw','totalA','imgFile','loadProjectInput',
    'staggerSettings','pdfPageLabel','pdfDpiInfo','pdfThumb',
    'techHeight','techHeightRow',
    'stringPreview','stringDivisors','stringConfirmBtn',
    'colorPicker','colorModalTitle',
    'editVerticesBtn','snapGridWrap','snapGridInput',
    'moduleLibBody','moduleLibGrid','moduleLibArrow',
    'stringsVisBtn', 'distInput', 'distInputVal', 'orthoBtn',
    'moduleIsc', 'moduleVoc', 'moduleImpp', 'moduleVmpp',
    'cableMaterial', 'cableSystemAC',
    'cableLenString', 'cableLenMain', 'cableLenAC', 'cableDropDC', 'cableResults',
    'invPreset', 'invBrand', 'invModel', 'invPac', 'invVmpptMin', 'invVmpptMax',
    'invImaxMppt', 'invVocMax', 'invValidation',
    'invInfo', 'invInfoPac', 'invInfoMppt', 'invInfoAC', 'invInfoVrange', 'invInfoImax', 'invInfoVoc',
    'numInverters', 'multiInvInfo',
  ].forEach(id => { DOM[id] = document.getElementById(id); });
}


// ── js/storage.js ──
// ── storage.js — Persistenza localStorage, undo/redo, requestDraw ──

'use strict';

// ── .sdproj v1 document builder (AP-10 / PR-26) ─────────────────────────
// Canonical format marker. See docs/sdproj-schema.md for the full spec.
const SDPROJ_VERSION         = 'sdproj/1';
// Single source of truth for app traceability stamps (AP-11 / PR-30).
// Consumed by UI footer, SLD cartiglio, PDF cover, and .sdproj metadata.
// SDPROJ_NORMS_REVISION is the BT canonical baseline; MT projects are
// derived per-project via getEffectiveNormsRevision() below.
const SDPROJ_APP_VERSION     = '1.0.0';
const SDPROJ_NORMS_REVISION  = 'CEI 0-21:2025-10';

/** Returns the effective norms revision for the current project context.
 *  Reads cartTensione from the form (BT/MT); defaults to BT.
 *  AP-11 / PR-30 follow-up: ensures SLD + PDF + .sdproj metadata stay
 *  internally consistent for both BT (CEI 0-21) and MT (CEI 0-16) projects. */
function getEffectiveNormsRevision() {
  const el = (typeof document !== 'undefined') ? document.getElementById('cartTensione') : null;
  const tens = (el && typeof el.value === 'string') ? el.value : 'BT';
  return tens === 'MT' ? 'CEI 0-16:2022' : SDPROJ_NORMS_REVISION;
}
// Session-level memo for createdAt — reset on app launch. PR-27 reads this
// back from an opened file so it survives sessions; PR-26 keeps a fresh
// value for new projects.
let _projectCreatedAt = null;

/** Set the session-level createdAt from an opened file (PR-27 / T2.5.3).
 *  Accepts only well-formed ISO 8601 timestamps; silently ignores
 *  malformed input to keep open-flow robust against partial corruption. */
function _setProjectCreatedAt(iso) {
  if (typeof iso === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(iso)) {
    _projectCreatedAt = iso;
  }
}

// ── Persisted-project reader (AP-10 / PR-29 — T2.5.6) ────────────────────
// Single dispatch helper shared between the explicit file-open path
// (loadProjectJSON in js/export.js) and the localStorage recovery path
// (loadSavedState below). Pure: no side effects, no DOM access, no
// _setProjectCreatedAt — callers decide how to react to each result kind.
//
// Supported inputs:
//   1. sdproj/1                  — top-level {version, metadata, project}
//   2. legacy sdp-v* versioned   — top-level project snapshot with `version: "sdp-v<n>"`
//   3. legacy no-version (opt)   — bare top-level project snapshot;
//                                  recovery-only via acceptVersionless: true
//
// Result shape:
//   { kind: 'ok',          payload: <legacy-shape project>, metadata: <obj|null> }
//   { kind: 'unsupported', reason:  <string> }   — known version string we cannot read
//   { kind: 'invalid',     reason:  <string> }   — structural / type problem
function readPersistedProject(raw, opts) {
  const acceptVersionless = !!(opts && opts.acceptVersionless);
  if (typeof raw !== 'object' || raw === null) {
    return { kind: 'invalid', reason: 'payload non valido' };
  }
  if (raw.version === 'sdproj/1') {
    if (typeof raw.project !== 'object' || raw.project === null) {
      return { kind: 'invalid', reason: 'sdproj/1 senza payload "project"' };
    }
    const metadata = (typeof raw.metadata === 'object' && raw.metadata !== null) ? raw.metadata : null;
    return { kind: 'ok', payload: raw.project, metadata: metadata };
  }
  if (typeof raw.version === 'string' && /^sdp-v\d+$/.test(raw.version)) {
    return { kind: 'ok', payload: raw, metadata: null };
  }
  if (typeof raw.version === 'string' && raw.version.length > 0) {
    return { kind: 'unsupported', reason: 'version: ' + raw.version };
  }
  // No version field. Accept only in recovery mode for very old localStorage
  // data; never silently accept unknown JSON structures from explicit file open.
  if (acceptVersionless && raw.installableAreas && raw.panels) {
    return { kind: 'ok', payload: raw, metadata: null };
  }
  return { kind: 'invalid', reason: 'formato non riconosciuto' };
}

/**
 * Build a complete sdproj/1 document for the current in-memory state.
 * Stripping the legacy top-level "version" stamp from the inner project
 * payload — only the outer top-level marker is canonical.
 */
function buildSdprojDocument() {
  const full = _buildFullState();
  delete full.version; // INV-D-01: legacy stamp does not leak into payload

  const now = new Date().toISOString();
  if (!_projectCreatedAt) _projectCreatedAt = now;

  const committente = (full.cartiglio && typeof full.cartiglio.committente === 'string')
    ? full.cartiglio.committente.trim()
    : '';
  const projectName = committente || 'progetto-fv';

  return {
    version: SDPROJ_VERSION,
    metadata: {
      appVersion:    SDPROJ_APP_VERSION,
      normsRevision: getEffectiveNormsRevision(),
      createdAt:     _projectCreatedAt,
      modifiedAt:    now,
      projectName:   projectName,
    },
    project: full,
  };
}

/** Salva lo stato completo nel localStorage (auto-save continuo). */
function saveState() {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(_persistState, 800);
}

/** Persiste immediatamente tutto il progetto nel localStorage. */
function _persistState() {
  try {
    const state = _buildFullState();
    const json = JSON.stringify(state);
    if (json.length > 3 * 1024 * 1024) { // ~3 MB warning
      showToast('Progetto molto grande — considera di esportare un backup', 'warn', 4000);
    }
    localStorage.setItem(LS_KEY, json);
  } catch(e) {
    showToast('Salvataggio automatico fallito — usa Esporta per non perdere i dati', 'warn', 5000);
  }
}

/** Costruisce l'oggetto stato completo (usato da saveState e salvaProgetto). */
function _buildFullState() {
  return {
    version: 'sdp-v9',
    scale, panelOrientation, walkwaysEnabled,
    installableAreas: installableAreas.map(a => ({
      points:          a.points,
      type:            a.type,
      orientation:     a.orientation     || 'auto',
      exposure:        a.exposure,
      staggerEnabled:  a.staggerEnabled  || false,
      staggerOffset:   a.staggerOffset   !== undefined ? a.staggerOffset : 50,
      walkwaysEnabled: a.walkwaysEnabled || false,
      walkwayInterval: a.walkwayInterval !== undefined ? a.walkwayInterval : 3,
      walkwayWidth:    a.walkwayWidth    !== undefined ? a.walkwayWidth   : 80,
      walkwayDir:      a.walkwayDir      || 'row',
      walkRowEnabled:  a.walkRowEnabled  || false,
      walkRowInterval: a.walkRowInterval !== undefined ? a.walkRowInterval : 3,
      walkRowWidth:    a.walkRowWidth    !== undefined ? a.walkRowWidth    : 80,
      walkColEnabled:  a.walkColEnabled  || false,
      walkColInterval: a.walkColInterval !== undefined ? a.walkColInterval : 3,
      walkColWidth:    a.walkColWidth    !== undefined ? a.walkColWidth    : 80,
    })),
    exclusionAreas, technicalObjects,
    panels:  panels.map(p => Object.assign({}, p)),
    strings: strings.map(s => ({
      id:s.id, name:s.name, color:s.color,
      panels: s.panels.map(p => Object.assign({},p))
    })),
    calPts: [...calPts],
    inverterList: _inverterList.map(inv => Object.assign({}, inv)),
    moduleParams: {
      pw:              (DOM.pw              || {value:''}).value,
      pl:              (DOM.pl              || {value:''}).value,
      pp:              (DOM.pp              || {value:''}).value,
      ps:              (DOM.ps              || {value:''}).value,
      safetyMargin:    (DOM.safetyMargin    || {value:''}).value,
      obstacleDistance:(DOM.obstacleDistance|| {value:''}).value,
      walkwayInterval: (DOM.walkwayInterval || {value:''}).value,
      walkwayWidth:    (DOM.walkwayWidth    || {value:''}).value,
      staggerOffset:   (DOM.staggerOffset   || {value:''}).value,
      enableStagger:   !!(DOM.enableStagger && DOM.enableStagger.checked),
    },
    cartiglio: {
      committente:    (document.getElementById('cartCommittente')   || {value:''}).value,
      indirizzo:      (document.getElementById('cartIndirizzo')     || {value:''}).value,
      progettista:    (document.getElementById('cartProgettista')   || {value:''}).value,
      albo:           (document.getElementById('cartAlbo')          || {value:''}).value,
      numDisegno:     (document.getElementById('cartNumDisegno')    || {value:''}).value,
      revisione:      (document.getElementById('cartRevisione')     || {value:'00'}).value,
      spiModello:     (document.getElementById('cartSpiModello')    || {value:''}).value,
      spiMatricola:   (document.getElementById('cartSpiMatricola')  || {value:''}).value,
      spiCertificato: (document.getElementById('cartSpiCertificato')|| {value:''}).value,
    },
  };
}

function loadSavedState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    // Recovery path uses the shared reader in lenient mode so very old
    // localStorage data (no version field) still restores. Unsupported /
    // invalid → silent "no recoverable state" (the recovery contract).
    const result = readPersistedProject(parsed, { acceptVersionless: true });
    if (result.kind !== 'ok') return false;
    const s = result.payload;
    if (result.metadata && typeof result.metadata.createdAt === 'string') {
      _setProjectCreatedAt(result.metadata.createdAt);
    }
    if (!s.installableAreas || !s.panels) return false;
    scale = s.scale || 1;
    panelOrientation = s.panelOrientation || 'auto';
    walkwaysEnabled = s.walkwaysEnabled || false;
    installableAreas = s.installableAreas.map(a => ({
      ...a,
      orientation:     a.orientation     || 'auto',
      staggerEnabled:  a.staggerEnabled  || false,
      staggerOffset:   a.staggerOffset   !== undefined ? a.staggerOffset : 50,
      walkwaysEnabled: a.walkwaysEnabled || false,
      walkwayInterval: a.walkwayInterval !== undefined ? a.walkwayInterval : 3,
      walkwayWidth:    a.walkwayWidth    !== undefined ? a.walkwayWidth   : 80,
      walkwayDir:      a.walkwayDir      || 'row',
      walkRowEnabled:  a.walkRowEnabled  || false,
      walkRowInterval: a.walkRowInterval !== undefined ? a.walkRowInterval : 3,
      walkRowWidth:    a.walkRowWidth    !== undefined ? a.walkRowWidth    : 80,
      walkColEnabled:  a.walkColEnabled  || false,
      walkColInterval: a.walkColInterval !== undefined ? a.walkColInterval : 3,
      walkColWidth:    a.walkColWidth    !== undefined ? a.walkColWidth    : 80,
    }));
    exclusionAreas = s.exclusionAreas || [];
    technicalObjects = s.technicalObjects || [];
    panels = s.panels;
    strings = s.strings || [];
    _inverterList = s.inverterList || [];
    selectedPanels = new Set();
    // Bug 3 fix: restore module parameters from autosave
    if (s.moduleParams) {
      ['pw','pl','pp','ps','safetyMargin','obstacleDistance',
       'walkwayInterval','walkwayWidth','staggerOffset'].forEach(k => {
        const el = document.getElementById(k);
        if (el && s.moduleParams[k] !== undefined) el.value = s.moduleParams[k];
      });
      if (s.moduleParams.enableStagger !== undefined) {
        DOM.enableStagger.checked = s.moduleParams.enableStagger;
        DOM.staggerSettings.style.display = s.moduleParams.enableStagger ? 'block' : 'none';
      }
      if (s.walkwaysEnabled !== undefined) {
        walkwaysEnabled = s.walkwaysEnabled;
        DOM.enableWalkways.checked = walkwaysEnabled;
        DOM.walkwaySettings.style.display = walkwaysEnabled ? 'block' : 'none';
      }
    }
    // Ripristina dati cartiglio schema unifilare
    if (s.cartiglio) {
      const cm = s.cartiglio;
      const _setVal = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };
      _setVal('cartCommittente',    cm.committente);
      _setVal('cartIndirizzo',      cm.indirizzo);
      _setVal('cartProgettista',    cm.progettista);
      _setVal('cartAlbo',           cm.albo);
      _setVal('cartNumDisegno',     cm.numDisegno);
      _setVal('cartRevisione',      cm.revisione);
      _setVal('cartSpiModello',     cm.spiModello);
      _setVal('cartSpiMatricola',   cm.spiMatricola);
      _setVal('cartSpiCertificato', cm.spiCertificato);
    }
    strings.forEach(str => {
      str.panels = str.panels.map(sp => {
        const live = panels.find(p =>
          p.areaIdx === sp.areaIdx && p.row === sp.row && p.column === sp.column);
        return live || sp;
      });
    });
    panels.forEach(p => {
      const str = strings.find(s => s.id === p.strId);
      if (str) p.stringColor = str.color;
    });
    if (_inverterList.length > 0) {
      try { updateInverterListUI(); } catch(e) { /* UI non ancora pronta */ }
    }
    return true;
  } catch(e) {
    showToast('Dati salvati corrotti — progetto non recuperabile. Stato resettato.', 'error', 6000);
    try { localStorage.removeItem(LS_KEY); } catch(e2) { /* localStorage may be disabled */ }
    return false;
  }
}

// ── Undo / Redo ──────────────────────────────────────────────────────────────

function _getSnapshot() {
  return JSON.stringify({
    scale, panelOrientation,
    installableAreas,
    exclusionAreas,
    technicalObjects,
    panels: panels.map(p => Object.assign({}, p)),
    strings: strings.map(s => Object.assign({}, s, {panels: s.panels.map(p => Object.assign({},p))})),
  });
}
function snapshot() {
  _undoStack.push(_getSnapshot());
  if (_undoStack.length > MAX_HIST) _undoStack.shift();
  _redoStack.length = 0;
  _updateUndoUI();
  saveState();
}
function _applySnapshot(json) {
  const s = JSON.parse(json);
  if (s.scale !== undefined) scale = s.scale;
  if (s.panelOrientation !== undefined) panelOrientation = s.panelOrientation;
  installableAreas = s.installableAreas;
  exclusionAreas = s.exclusionAreas;
  technicalObjects = s.technicalObjects || [];
  panels = s.panels;
  strings = s.strings;
  selectedPanels = new Set();
  hoveredPanel = -1;
  invalidateLayoutCache();
  updateAreaLists(); updateStringList(); updateLegend(); updateStats();
}
function undo() {
  if (_undoStack.length < 2) return;
  _redoStack.push(_undoStack.pop());
  _applySnapshot(_undoStack[_undoStack.length - 1]);
  _updateUndoUI(); draw();
}
function redo() {
  if (!_redoStack.length) return;
  const snap = _redoStack.pop();
  _undoStack.push(snap);
  _applySnapshot(snap);
  _updateUndoUI(); draw();
}
function _updateUndoUI() {
  if (!DOM.undoBtn) return;
  const u = DOM.undoBtn;
  const r = DOM.redoBtn;
  const grp = document.getElementById('tbgHistory');
  const show = _undoStack.length > 1 || _redoStack.length > 0;
  if (grp) grp.style.display = show ? 'inline-flex' : 'none';
  if (u) u.style.opacity = _undoStack.length > 1 ? '1' : '0.35';
  if (r) r.style.opacity = _redoStack.length > 0 ? '1' : '0.35';
}

function requestDraw() {
  if (_rafPending) return;
  _rafPending = true;
  requestAnimationFrame(() => { _rafPending = false; draw(); });
}


// ── js/canvas.js ──
// â”€â”€ canvas.js â€” Rendering canvas, geometria, viewport, interazione mouse â”€â”€

'use strict';

// â”€â”€ Coordinate helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function getPoint(e) {
  const r = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - r.left - r.width/2  - ox) / z,
    y: (e.clientY - r.top  - r.height/2 - oy) / z
  };
}

function getOrtho(last, cur) {
  if (_orthoRefAngle === null) return cur;
  const v = { x: cur.x - last.x, y: cur.y - last.y };
  const perpAngle = _orthoRefAngle + Math.PI/2;
  const dot1 = Math.abs(v.x * Math.cos(_orthoRefAngle) + v.y * Math.sin(_orthoRefAngle));
  const dot2 = Math.abs(v.x * Math.cos(perpAngle) + v.y * Math.sin(perpAngle));
  if (dot1 > dot2) {
    const dist = v.x * Math.cos(_orthoRefAngle) + v.y * Math.sin(_orthoRefAngle);
    return { x: last.x + dist * Math.cos(_orthoRefAngle), y: last.y + dist * Math.sin(_orthoRefAngle) };
  } else {
    const dist = v.x * Math.cos(perpAngle) + v.y * Math.sin(perpAngle);
    return { x: last.x + dist * Math.cos(perpAngle), y: last.y + dist * Math.sin(perpAngle) };
  }
}

// â”€â”€ Viewport â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function resize() {
  const parent = canvas.parentElement;
  const cssW = parent.clientWidth;
  const cssH = parent.clientHeight;
  const dpr  = window.devicePixelRatio || 1;
  canvas.width  = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  canvas.style.width  = cssW + 'px';
  canvas.style.height = cssH + 'px';
  _updateMobToggle();
  draw();
}

function zoom(f) {
  z = Math.max(CONFIG.ZOOM_MIN, Math.min(z * f, CONFIG.ZOOM_MAX));
  draw();
}

function resetView() {
  z = 1; ox = 0; oy = 0;
  if (img) {
    const scaleX = (canvas.clientWidth  * 0.9) / img.width;
    const scaleY = (canvas.clientHeight * 0.9) / img.height;
    z = Math.min(scaleX, scaleY);
  }
  draw();
}

function wheel(e) {
  e.preventDefault();
  const factor = e.deltaY > 0 ? 0.9 : 1.1;
  const cx  = e.offsetX - canvas.clientWidth  / 2;
  const cy_ = e.offsetY - canvas.clientHeight / 2;
  const newZ = Math.max(CONFIG.ZOOM_MIN, Math.min(z * factor, CONFIG.ZOOM_MAX));
  const realFactor = newZ / z;
  ox = cx  - (cx  - ox) * realFactor;
  oy = cy_ - (cy_ - oy) * realFactor;
  z  = newZ;
  requestDraw();
}

// â”€â”€ PDF snap helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function _pdfSnapToWorld(sp) {
  if (sp.wx !== undefined) return { x: sp.wx, y: sp.wy };
  if (!img) return null;
  return { x: sp.imgX - img.width/2, y: sp.imgY - img.height/2 };
}

function _nearestPdfSnap(worldPt, screenRadius) {
  if (!_pdfSnapEnabled || _pdfSnapPoints.length === 0) return null;
  const worldR = screenRadius / z;
  let best = null, bestD2 = worldR * worldR;
  for (const sp of _pdfSnapPoints) {
    const w = _pdfSnapToWorld(sp);
    if (!w) continue;
    const d2 = (w.x - worldPt.x)**2 + (w.y - worldPt.y)**2;
    if (d2 < bestD2) { bestD2 = d2; best = w; }
  }
  return best;
}

// â”€â”€ Snap metrico â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function _applyMetricSnap(pt) {
  if (metricSnapM <= 0 || scale <= 1) return pt;
  const step = metricSnapM * scale;
  return { x: Math.round(pt.x / step) * step, y: Math.round(pt.y / step) * step };
}

// â”€â”€ Geometria â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function transformPolygon(pts, ang) {
  const cos = Math.cos(-ang), sin = Math.sin(-ang);
  return pts.map(p => ({ x: p.x*cos - p.y*sin, y: p.x*sin + p.y*cos }));
}

function localToGlobal(x, y, ang) {
  const cos = Math.cos(ang), sin = Math.sin(ang);
  return { x: x*cos - y*sin, y: x*sin + y*cos };
}

function polyAABB(polygon) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of polygon) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, maxX, minY, maxY };
}

function pointInPolygon(point, polygon, aabb) {
  if (aabb) {
    if (point.x < aabb.minX || point.x > aabb.maxX ||
        point.y < aabb.minY || point.y > aabb.maxY) return false;
  }
  let inside = false;
  for (let i = 0, j = polygon.length-1; i < polygon.length; j = i++) {
    const xi=polygon[i].x, yi=polygon[i].y, xj=polygon[j].x, yj=polygon[j].y;
    const intersect = ((yi>point.y)!==(yj>point.y)) && (point.x < (xj-xi)*(point.y-yi)/(yj-yi)+xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function distanceToSegment(p, a, b) {
  const dx=b.x-a.x, dy=b.y-a.y;
  const l2 = dx*dx+dy*dy;
  if (l2===0) return Math.sqrt((p.x-a.x)**2+(p.y-a.y)**2);
  let t = ((p.x-a.x)*dx+(p.y-a.y)*dy)/l2;
  t = Math.max(0, Math.min(1, t));
  return Math.sqrt((p.x-(a.x+t*dx))**2+(p.y-(a.y+t*dy))**2);
}

function _segsIntersect(a, b, c, d) {
  function cross(p, q, r) {
    return (q.x-p.x)*(r.y-p.y) - (q.y-p.y)*(r.x-p.x);
  }
  const d1=cross(c,d,a), d2=cross(c,d,b);
  const d3=cross(a,b,c), d4=cross(a,b,d);
  if (((d1>0&&d2<0)||(d1<0&&d2>0)) && ((d3>0&&d4<0)||(d3<0&&d4>0))) return true;
  function onSeg(p,q,r) {
    return Math.min(p.x,r.x)<=q.x && q.x<=Math.max(p.x,r.x) &&
           Math.min(p.y,r.y)<=q.y && q.y<=Math.max(p.y,r.y);
  }
  if (d1===0&&onSeg(c,a,d)) return true;
  if (d2===0&&onSeg(c,b,d)) return true;
  if (d3===0&&onSeg(a,c,b)) return true;
  if (d4===0&&onSeg(a,d,b)) return true;
  return false;
}

function scanlineX(polygon, y) {
  let n = 0;
  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    const y1 = polygon[i].y, y2 = polygon[j].y;
    if ((y1 <= y && y < y2) || (y2 <= y && y < y1)) {
      if (n >= _scanBuf.length) break; // bounds check — poligoni con >32 intersezioni per scanline
      const t = (y - y1) / (y2 - y1);
      _scanBuf[n++] = polygon[i].x + t * (polygon[j].x - polygon[i].x);
    }
  }
  const result = Array.from(_scanBuf.subarray(0, n));
  result.sort((a, b) => a - b);
  return result;
}

function _convexHull(pts) {
  if (pts.length < 3) return pts.map(p=>({...p}));
  const sorted = pts.slice().sort((a,b) => a.x!==b.x ? a.x-b.x : a.y-b.y);
  const cross = (O,A,B) => (A.x-O.x)*(B.y-O.y)-(A.y-O.y)*(B.x-O.x);
  const lower = [], upper = [];
  for (const p of sorted) {
    while (lower.length>=2 && cross(lower[lower.length-2],lower[lower.length-1],p)<=0) lower.pop();
    lower.push(p);
  }
  for (let i=sorted.length-1;i>=0;i--) {
    const p=sorted[i];
    while (upper.length>=2 && cross(upper[upper.length-2],upper[upper.length-1],p)<=0) upper.pop();
    upper.push(p);
  }
  upper.pop(); lower.pop();
  return lower.concat(upper);
}

function _isSelfIntersecting(pts) {
  const n = pts.length;
  if (n < 4) return false;
  for (let i = 0; i < n; i++) {
    const a=pts[i], b=pts[(i+1)%n];
    for (let j = i+2; j < n; j++) {
      if (i===0 && j===n-1) continue;
      const c=pts[j], d=pts[(j+1)%n];
      if (_segsIntersect(a,b,c,d)) return true;
    }
  }
  return false;
}

function offsetPolygon(pts, dist) {
  const n = pts.length;
  if (n < 3) return pts.map(p => ({...p}));
  if (dist === 0) return pts.map(p => ({...p}));
  let area = 0;
  for (let i = 0; i < n; i++) {
    const j = (i+1) % n;
    area += pts[i].x * pts[j].y - pts[j].x * pts[i].y;
  }
  const windSign = area >= 0 ? 1 : -1;
  const out = [];
  for (let i = 0; i < n; i++) {
    const prev = pts[(i-1+n)%n], curr = pts[i], next = pts[(i+1)%n];
    const ax = curr.x-prev.x, ay = curr.y-prev.y;
    const la = Math.sqrt(ax*ax+ay*ay) || 1;
    const n1x = windSign*ay/la, n1y = -windSign*ax/la;
    const bx = next.x-curr.x,  by = next.y-curr.y;
    const lb = Math.sqrt(bx*bx+by*by) || 1;
    const n2x = windSign*by/lb, n2y = -windSign*bx/lb;
    let bsx = n1x+n2x, bsy = n1y+n2y;
    const bl = Math.sqrt(bsx*bsx+bsy*bsy) || 1;
    bsx /= bl; bsy /= bl;
    const dot = n1x*bsx + n1y*bsy;
    const sc = dist / Math.max(Math.abs(dot), 0.087);
    out.push({ x: curr.x + bsx*sc, y: curr.y + bsy*sc });
  }
  if (_isSelfIntersecting(out)) {
    if (dist > 0) return null;
    return pts.map(p=>({...p}));
  }
  return out;
}

function _isValidPoly(pts) {
  if (!pts || pts.length < 3) return false;
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i+1)%pts.length;
    area += pts[i].x*pts[j].y - pts[j].x*pts[i].y;
  }
  return Math.abs(area) > 1e-6;
}

// â”€â”€ Disegno pannelli e simboli tecnici â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function drawPanel(ctx2, pan, fillStyle, strokeStyle, lineWidth, shadowColor, shadowBlur, z2) {
  const hasAxis = pan.axisUx !== undefined;
  const cellLW = Math.max(1/(z2||1), 0.6/(z2||1));
  if (hasAxis) {
    const ux=pan.axisUx, uy=pan.axisUy, vx=pan.axisVx, vy=pan.axisVy;
    const u=pan.localU, v=pan.localV, w=pan.w, h=pan.h;
    const c0={x:u*ux+v*vx, y:u*uy+v*vy};
    const c1={x:(u+w)*ux+v*vx, y:(u+w)*uy+v*vy};
    const c2={x:(u+w)*ux+(v+h)*vx, y:(u+w)*uy+(v+h)*vy};
    const c3={x:u*ux+(v+h)*vx, y:u*uy+(v+h)*vy};
    ctx2.shadowColor=shadowColor||'transparent'; ctx2.shadowBlur=shadowBlur||0;
    ctx2.fillStyle=fillStyle;
    ctx2.beginPath(); ctx2.moveTo(c0.x,c0.y); ctx2.lineTo(c1.x,c1.y); ctx2.lineTo(c2.x,c2.y); ctx2.lineTo(c3.x,c3.y); ctx2.closePath(); ctx2.fill();
    ctx2.shadowBlur=0;
    const rows=6, cols=2;
    ctx2.strokeStyle='rgba(255,255,255,0.22)'; ctx2.lineWidth=cellLW;
    for (let i=1;i<cols;i++){const t=i/cols;ctx2.beginPath();ctx2.moveTo(c0.x+t*(c1.x-c0.x),c0.y+t*(c1.y-c0.y));ctx2.lineTo(c3.x+t*(c2.x-c3.x),c3.y+t*(c2.y-c3.y));ctx2.stroke();}
    for (let i=1;i<rows;i++){const t=i/rows;ctx2.beginPath();ctx2.moveTo(c0.x+t*(c3.x-c0.x),c0.y+t*(c3.y-c0.y));ctx2.lineTo(c1.x+t*(c2.x-c1.x),c1.y+t*(c2.y-c1.y));ctx2.stroke();}
    ctx2.strokeStyle=strokeStyle; ctx2.lineWidth=lineWidth;
    ctx2.beginPath(); ctx2.moveTo(c0.x,c0.y); ctx2.lineTo(c1.x,c1.y); ctx2.lineTo(c2.x,c2.y); ctx2.lineTo(c3.x,c3.y); ctx2.closePath(); ctx2.stroke();
  } else {
    ctx2.shadowColor=shadowColor||'transparent'; ctx2.shadowBlur=shadowBlur||0;
    ctx2.fillStyle=fillStyle; ctx2.fillRect(pan.x,pan.y,pan.w,pan.h); ctx2.shadowBlur=0;
    ctx2.strokeStyle='rgba(255,255,255,0.22)'; ctx2.lineWidth=cellLW;
    const rows=6, cols=2, cw=pan.w/cols, ch=pan.h/rows;
    for(let i=1;i<cols;i++){ctx2.beginPath();ctx2.moveTo(pan.x+cw*i,pan.y);ctx2.lineTo(pan.x+cw*i,pan.y+pan.h);ctx2.stroke();}
    for(let i=1;i<rows;i++){ctx2.beginPath();ctx2.moveTo(pan.x,pan.y+ch*i);ctx2.lineTo(pan.x+pan.w,pan.y+ch*i);ctx2.stroke();}
    ctx2.strokeStyle=strokeStyle; ctx2.lineWidth=lineWidth; ctx2.strokeRect(pan.x,pan.y,pan.w,pan.h);
  }
}

function drawCalPoint(x, y, label) {
  const r = 7/z;
  ctx.strokeStyle='rgba(255,255,255,0.9)'; ctx.lineWidth=3/z;
  ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.stroke();
  ctx.strokeStyle='#f97316'; ctx.lineWidth=2/z;
  ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x-r*0.6,y); ctx.lineTo(x+r*0.6,y); ctx.moveTo(x,y-r*0.6); ctx.lineTo(x,y+r*0.6); ctx.stroke();
  if (label) {
    ctx.font=`bold ${11/z}px sans-serif`; ctx.textAlign='left'; ctx.fillStyle='rgba(249,115,22,0.95)';
    const tw = ctx.measureText(label).width + 8/z;
    ctx.fillRect(x+r+2/z,y-9/z,tw,13/z); ctx.fillStyle='#fff'; ctx.textBaseline='middle'; ctx.fillText(label,x+r+5/z,y);
  }
}

function drawTechSymbol(ctx2, type, cx, cy, r, strokeW, color, ang, rH) {
  rH = rH || r;
  const c2 = ctx2;
  c2.save();
  if (ang) { c2.translate(cx,cy); c2.rotate(ang); c2.translate(-cx,-cy); }
  const sw = strokeW;
  const doFill   = () => { c2.fillStyle='rgba(255,255,255,0.92)'; c2.fill(); };
  const doStroke = (w) => { c2.strokeStyle='#1e293b'; c2.lineWidth=w||sw; c2.stroke(); };
  switch(type) {
    case 'chimney':
      c2.beginPath(); c2.arc(cx,cy,r,0,Math.PI*2); doFill(); doStroke();
      c2.beginPath(); c2.moveTo(cx-r*0.6,cy-r*0.6); c2.lineTo(cx+r*0.6,cy+r*0.6); doStroke();
      c2.beginPath(); c2.moveTo(cx+r*0.6,cy-r*0.6); c2.lineTo(cx-r*0.6,cy+r*0.6); doStroke();
      break;
    case 'antenna':
      c2.beginPath(); c2.moveTo(cx,cy-r*0.8); c2.lineTo(cx+r*0.6,cy+r*0.5); c2.lineTo(cx-r*0.6,cy+r*0.5); c2.closePath();
      doFill(); doStroke();
      c2.beginPath(); c2.moveTo(cx,cy+r*0.5); c2.lineTo(cx,cy+r); doStroke();
      break;
    case 'hvac':
      c2.beginPath(); c2.rect(cx-r,cy-r*0.7,r*2,r*1.4); doFill(); doStroke();
      c2.beginPath(); c2.arc(cx,cy,r*0.38,0,Math.PI*2); doStroke(sw*0.8);
      [0,90,180,270].forEach(d=>{const a=d*Math.PI/180;c2.beginPath();c2.moveTo(cx,cy);c2.lineTo(cx+r*0.35*Math.cos(a),cy+r*0.35*Math.sin(a));doStroke(sw*0.7);});
      break;
    case 'skylight':
      c2.beginPath(); c2.rect(cx-r,cy-rH,r*2,rH*2); doFill(); doStroke();
      c2.beginPath(); c2.moveTo(cx-r,cy-rH); c2.lineTo(cx+r,cy+rH); doStroke(sw*0.7);
      c2.beginPath(); c2.moveTo(cx+r,cy-rH); c2.lineTo(cx-r,cy+rH); doStroke(sw*0.7);
      break;
    case 'exhaust':
      c2.beginPath(); c2.arc(cx,cy,r,0,Math.PI*2); doFill(); doStroke();
      c2.beginPath(); c2.moveTo(cx-r*0.65,cy); c2.lineTo(cx+r*0.65,cy); doStroke();
      c2.beginPath(); c2.moveTo(cx,cy-r*0.65); c2.lineTo(cx,cy+r*0.65); doStroke();
      break;
    default:
      c2.beginPath(); c2.arc(cx,cy,r,0,Math.PI*2); doFill(); doStroke();
  }
  c2.restore();
}

// â”€â”€ Render loop principale â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function draw() {
  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  ctx.fillStyle = isDark ? '#141517' : '#ebebeb';
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  ctx.save();
  ctx.translate(canvas.clientWidth/2+ox, canvas.clientHeight/2+oy);
  ctx.scale(z, z);
  if (img) ctx.drawImage(img, -img.width/2, -img.height/2);

  // Griglia metrica
  if (snapEnabled && metricSnapM > 0 && scale > 1) {
    const step = metricSnapM * scale;
    const vpW = canvas.clientWidth / z, vpH = canvas.clientHeight / z;
    const vpX = -canvas.clientWidth/(2*z) - ox/z, vpY = -canvas.clientHeight/(2*z) - oy/z;
    const x0 = Math.floor(vpX / step) * step;
    const y0 = Math.floor(vpY / step) * step;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 0.6 / z;
    ctx.setLineDash([2/z, 3/z]);
    for (let gx = x0; gx < vpX + vpW + step; gx += step) {
      ctx.beginPath(); ctx.moveTo(gx, vpY); ctx.lineTo(gx, vpY + vpH); ctx.stroke();
    }
    for (let gy = y0; gy < vpY + vpH + step; gy += step) {
      ctx.beginPath(); ctx.moveTo(vpX, gy); ctx.lineTo(vpX + vpW, gy); ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    const dotR = 1.2/z;
    for (let gx = x0; gx < vpX + vpW + step; gx += step)
      for (let gy = y0; gy < vpY + vpH + step; gy += step) {
        ctx.beginPath(); ctx.arc(gx, gy, dotR, 0, Math.PI*2); ctx.fill();
      }
    ctx.restore();
  }

  // Calibrazione
  if (mode==='cal') {
    ctx.save();
    if (calPts.length>=1) {
      drawCalPoint(calPts[0].x, calPts[0].y, 'P1');
      const endPt = calPts.length===2 ? calPts[1] : mpos;
      const dx=endPt.x-calPts[0].x, dy=endPt.y-calPts[0].y;
      const pixDist=Math.sqrt(dx*dx+dy*dy);
      ctx.strokeStyle='rgba(255,255,255,0.8)'; ctx.lineWidth=3/z; ctx.setLineDash([8/z,5/z]);
      ctx.beginPath(); ctx.moveTo(calPts[0].x,calPts[0].y); ctx.lineTo(endPt.x,endPt.y); ctx.stroke();
      ctx.strokeStyle='#f97316'; ctx.lineWidth=1.5/z;
      ctx.beginPath(); ctx.moveTo(calPts[0].x,calPts[0].y); ctx.lineTo(endPt.x,endPt.y); ctx.stroke();
      ctx.setLineDash([]);
      const rd=parseFloat(DOM.dist.value)||0;
      const midX=(calPts[0].x+endPt.x)/2, midY=(calPts[0].y+endPt.y)/2;
      const ang=Math.atan2(dy,dx);
      ctx.save(); ctx.translate(midX,midY);
      let labelAng=ang; if(labelAng>Math.PI/2||labelAng<-Math.PI/2) labelAng+=Math.PI;
      ctx.rotate(labelAng);
      let distLabel;
      if(scale>1&&pixDist>0) distLabel=`${(pixDist/scale).toFixed(2)} m`;
      else if(rd>0&&pixDist>0) distLabel=`${pixDist.toFixed(0)} px`;
      else distLabel='';
      if(distLabel&&pixDist>20/z){
        ctx.font=`bold ${10/z}px sans-serif`; ctx.textAlign='center';
        const tw=ctx.measureText(distLabel).width+8/z;
        ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.fillRect(-tw/2,-14/z,tw,12/z);
        ctx.fillStyle='#fff'; ctx.textBaseline='middle'; ctx.fillText(distLabel,0,-8/z);
      }
      ctx.restore();
      [calPts[0],endPt].forEach(pt=>{
        ctx.save(); ctx.translate(pt.x,pt.y); ctx.rotate(ang+Math.PI/2);
        ctx.strokeStyle='#f97316'; ctx.lineWidth=1.5/z;
        ctx.beginPath(); ctx.moveTo(-5/z,0); ctx.lineTo(5/z,0); ctx.stroke(); ctx.restore();
      });
    }
    if(calPts.length===2) drawCalPoint(calPts[1].x, calPts[1].y, 'P2');
    ctx.restore();
  }

  // Aree installabili
  installableAreas.forEach((a,aIdx)=>{
    const ac=AREA_COLORS[aIdx%AREA_COLORS.length];
    ctx.fillStyle=ac.fill.replace('0.15','0.22');
    ctx.strokeStyle=ac.stroke; ctx.lineWidth=3/z;
    ctx.shadowColor='rgba(255,255,255,0.5)'; ctx.shadowBlur=2/z;
    ctx.beginPath(); ctx.moveTo(a.points[0].x,a.points[0].y);
    for(let i=1;i<a.points.length;i++) ctx.lineTo(a.points[i].x,a.points[i].y);
    ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.shadowBlur=0;
  });
  installableAreas.forEach((a,aIdx)=>{
    const ac=AREA_COLORS[aIdx%AREA_COLORS.length];
    const cx=a.points.reduce((s,pt)=>s+pt.x,0)/a.points.length;
    const cy=a.points.reduce((s,pt)=>s+pt.y,0)/a.points.length;
    const LABEL_PX = 14;
    ctx.save();
    ctx.font=`bold ${LABEL_PX/z}px 'JetBrains Mono', 'SF Mono', monospace`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.shadowColor='rgba(255,255,255,0.95)'; ctx.shadowBlur=3/z; ctx.fillStyle=ac.stroke;
    ctx.fillText(`Area ${aIdx+1}`,cx,cy); ctx.shadowBlur=0;
    if (a.exposure && EXP_LABELS[a.exposure]) {
      const ARROWS = {N:'â†‘',NE:'â†—',E:'â†’',SE:'â†˜',S:'â†“',SW:'â†™',W:'â†',NW:'â†–'};
      const expTxt = ARROWS[a.exposure]+' '+EXP_LABELS[a.exposure];
      ctx.font=`${(LABEL_PX*0.72)/z}px 'JetBrains Mono','SF Mono',monospace`;
      ctx.fillStyle=EXP_COLORS[a.exposure]||ac.stroke;
      ctx.fillText(expTxt,cx,cy+(LABEL_PX*1.3)/z);
    }
    ctx.restore();
  });

  // Vertex edit handles
  if (vertexEditMode) {
    const VR = 7/z, VR_HOV = 10/z;
    const drawHandles = (pts, color, type, aIdx) => {
      pts.forEach((vp, vi) => {
        const isHov  = _vtxHoverArea  && _vtxHoverArea.type===type  && _vtxHoverArea.areaIdx===aIdx  && _vtxHoverArea.vtxIdx===vi;
        const isDrag = _vtxDragging   && _vtxAreaType===type         && _vtxAreaIdx===aIdx            && _vtxIdx===vi;
        const r = (isHov || isDrag) ? VR_HOV : VR;
        ctx.save();
        ctx.beginPath(); ctx.arc(vp.x, vp.y, r, 0, Math.PI*2);
        ctx.fillStyle   = isDrag ? color : 'rgba(255,255,255,0.92)';
        ctx.strokeStyle = color;
        ctx.lineWidth   = (isHov||isDrag) ? 2.5/z : 1.5/z;
        ctx.shadowColor = color; ctx.shadowBlur = isHov ? 8/z : 3/z;
        ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
        if (isHov || isDrag) {
          ctx.font=`bold ${9/z}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
          ctx.fillStyle = isDrag ? '#fff' : color;
          ctx.fillText('âœ¥', vp.x, vp.y);
        }
        ctx.restore();
      });
    };
    installableAreas.forEach((a,i) => drawHandles(a.points, AREA_COLORS[i%AREA_COLORS.length].stroke, 'installable', i));
    exclusionAreas.forEach((a,i)   => drawHandles(a.points, '#dc2626', 'exclusion', i));
  }

  // Buffer distanza ostacoli
  if (showBuffer && scale > 1) {
    const bufDistM = parseFloat(DOM.obstacleDistance ? DOM.obstacleDistance.value : 0) || 0;
    if (bufDistM > 0) {
      const bufPx = bufDistM * scale;
      ctx.save();
      exclusionAreas.forEach(a => {
        const expanded = offsetPolygon(a.points, bufPx);
        if (!expanded || expanded.length < 3) return;
        ctx.fillStyle = 'rgba(251,146,60,0.18)';
        ctx.strokeStyle = 'rgba(234,88,12,0.7)';
        ctx.lineWidth = 1.5/z;
        ctx.setLineDash([4/z, 3/z]);
        ctx.beginPath();
        ctx.moveTo(expanded[0].x, expanded[0].y);
        for (let i = 1; i < expanded.length; i++) ctx.lineTo(expanded[i].x, expanded[i].y);
        ctx.closePath(); ctx.fill();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.beginPath();
        ctx.moveTo(a.points[0].x, a.points[0].y);
        for (let i = 1; i < a.points.length; i++) ctx.lineTo(a.points[i].x, a.points[i].y);
        ctx.closePath(); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        ctx.beginPath();
        ctx.moveTo(expanded[0].x, expanded[0].y);
        for (let i = 1; i < expanded.length; i++) ctx.lineTo(expanded[i].x, expanded[i].y);
        ctx.closePath(); ctx.stroke();
        ctx.setLineDash([]);
        const cx_ = a.points.reduce((s,p)=>s+p.x,0)/a.points.length;
        const cy_ = a.points.reduce((s,p)=>s+p.y,0)/a.points.length;
        const LPXB = 11;
        ctx.save();
        ctx.font = `600 ${LPXB/z}px 'JetBrains Mono',monospace`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const label = `âŠ¢${bufDistM}mâŠ£`;
        const tw = ctx.measureText(label).width + 6/z;
        const th = LPXB/z * 1.4;
        const maxX = Math.max(...a.points.map(p=>p.x));
        const lx_ = maxX + bufPx*0.5;
        const ly_ = cy_;
        ctx.fillStyle = 'rgba(255,255,255,0.88)';
        ctx.beginPath(); ctx.roundRect(lx_-tw/2, ly_-th/2, tw, th, 2/z); ctx.fill();
        ctx.fillStyle = 'rgba(234,88,12,0.9)';
        ctx.fillText(label, lx_, ly_);
        ctx.restore();
      });
      ctx.restore();
    }
  }

  // Aree esclusione
  exclusionAreas.forEach(a=>{
    ctx.fillStyle='rgba(220,38,38,0.18)'; ctx.strokeStyle='#dc2626'; ctx.lineWidth=2.5/z;
    ctx.setLineDash([12/z,6/z]); ctx.shadowColor='rgba(255,255,255,0.6)'; ctx.shadowBlur=3/z;
    ctx.beginPath(); ctx.moveTo(a.points[0].x,a.points[0].y);
    for(let i=1;i<a.points.length;i++) ctx.lineTo(a.points[i].x,a.points[i].y);
    ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.shadowBlur=0; ctx.setLineDash([]);
  });

  // Oggetti tecnici puntuali
  technicalObjects.forEach((obj,i)=>{
    if (!obj || !obj.sizePx) return;
    const r = obj.sizePx/2;
    const color = TECH_COLORS[obj.type]||'#555';
    const accentColor = TECH_LIST_COLORS[obj.type]||'#aaa';
    const bufM = parseFloat(DOM.obstacleDistance ? DOM.obstacleDistance.value : 0) || 0;
    const rH = obj.sizeHPx ? obj.sizeHPx/2 : r;
    drawTechSymbol(ctx, obj.type, obj.x, obj.y, r, 2/z, color, obj.ang||0, rH);
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.setLineDash([5/z, 3/z]);
    ctx.lineWidth = 3/z; ctx.strokeStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(obj.x, obj.y, r * CONFIG.TECH_RING_RATIO, 0, Math.PI*2); ctx.stroke();
    ctx.lineWidth = 1.5/z; ctx.strokeStyle = '#dc2626';
    ctx.beginPath(); ctx.arc(obj.x, obj.y, r * 1.35, 0, Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    if (bufM > 0) {
      const rBuf = r + bufM * scale;
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.setLineDash([8/z, 4/z]);
      ctx.lineWidth = 3/z; ctx.strokeStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(obj.x, obj.y, rBuf, 0, Math.PI*2); ctx.stroke();
      ctx.lineWidth = 1.5/z; ctx.strokeStyle = '#dc2626';
      ctx.beginPath(); ctx.arc(obj.x, obj.y, rBuf, 0, Math.PI*2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = 'bold ' + (Math.max(9/z, rBuf*0.13))+'px var(--font-main)';
      ctx.fillStyle = '#dc2626';
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3/z;
      ctx.textAlign='center'; ctx.textBaseline='bottom';
      ctx.strokeText(bufM.toFixed(1)+'m', obj.x, obj.y - rBuf - 2/z);
      ctx.fillText(bufM.toFixed(1)+'m', obj.x, obj.y - rBuf - 2/z);
      ctx.restore();
    }
    if (_selectedTechIdx === i) {
      const hPos = _techRotHandlePos(obj);
      const hR = Math.max(7/z, r * 0.22);
      ctx.save();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.5/z;
      ctx.setLineDash([4/z, 3/z]);
      ctx.beginPath(); ctx.arc(obj.x, obj.y, r * 1.65, 0, Math.PI*2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = accentColor; ctx.lineWidth = 1.2/z;
      ctx.beginPath(); ctx.moveTo(obj.x, obj.y); ctx.lineTo(hPos.x, hPos.y); ctx.stroke();
      const isOverHandle = mpos && _hitTestRotHandle(mpos, obj);
      ctx.beginPath(); ctx.arc(hPos.x, hPos.y, hR, 0, Math.PI*2);
      ctx.fillStyle = isOverHandle ? accentColor : '#fff';
      ctx.strokeStyle = accentColor; ctx.lineWidth = 1.5/z;
      ctx.fill(); ctx.stroke();
      ctx.strokeStyle = isOverHandle ? '#fff' : accentColor;
      ctx.lineWidth = 1/z;
      ctx.beginPath(); ctx.arc(hPos.x, hPos.y, hR*0.5, 0, Math.PI*1.5); ctx.stroke();
      ctx.restore();
    }
  });

  // Ghost cursore in modalitÃ  tech
  if (mode==='tech' && mpos) {
    const sizem = parseFloat(DOM.techSize.value)||0.5;
    const bufM = parseFloat(DOM.techBuffer.value)||0;
    const r = sizem*scale/2;
    const color = TECH_COLORS[_techMode]||'#555';
    if (bufM > 0) {
      const rBuf = r + bufM*scale;
      ctx.save(); ctx.globalAlpha=0.25;
      ctx.strokeStyle=color; ctx.lineWidth=0.7/z;
      ctx.setLineDash([5/z,5/z]);
      ctx.beginPath(); ctx.arc(mpos.x,mpos.y,rBuf,0,Math.PI*2);
      ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
    }
    ctx.save(); ctx.globalAlpha=0.45;
    const ghostAng = _techMode === 'skylight' ? (parseFloat(DOM.techRot.value)||0) * Math.PI/180 : 0;
    drawTechSymbol(ctx, _techMode, mpos.x, mpos.y, r, 2/z, color, ghostAng);
    ctx.restore();
  }

  // Snap vertici in modalitÃ  area
  if (mode==='area') {
    if (mpos && _pdfSnapEnabled && _pdfSnapPoints.length > 0) {
      const pdfHighR = 12/z;
      const cullR = 80/z;
      ctx.save();
      _pdfSnapPoints.forEach(sp => {
        const w = _pdfSnapToWorld(sp);
        if (!w) return;
        const dx=mpos.x-w.x, dy=mpos.y-w.y, d2=dx*dx+dy*dy;
        if(d2>cullR*cullR) return;
        const isNear = d2 < pdfHighR*pdfHighR;
        ctx.beginPath();
        const r = isNear ? 6/z : 3/z;
        ctx.moveTo(w.x, w.y-r); ctx.lineTo(w.x+r, w.y);
        ctx.lineTo(w.x, w.y+r); ctx.lineTo(w.x-r, w.y);
        ctx.closePath();
        ctx.fillStyle = isNear ? 'rgba(59,130,246,0.8)' : 'rgba(59,130,246,0.3)';
        ctx.fill();
        if (isNear) {
          ctx.strokeStyle='#3b82f6'; ctx.lineWidth=1.5/z; ctx.stroke();
          ctx.save(); ctx.font=`bold ${10/z}px sans-serif`; ctx.textAlign='center';
          const ly2=w.y-14/z; const tw=ctx.measureText('PDF').width+8/z;
          ctx.fillStyle='rgba(37,99,235,0.92)'; ctx.fillRect(w.x-tw/2,ly2-8/z,tw,13/z);
          ctx.fillStyle='#fff'; ctx.textBaseline='middle'; ctx.fillText('PDF',w.x,ly2); ctx.restore();
        }
      });
      ctx.restore();
    }
    if (mpos) {
      const allVerts=[];
      installableAreas.forEach(a=>allVerts.push(...a.points));
      exclusionAreas.forEach(a=>allVerts.push(...a.points));
      const snapR=8/z, drawR=60/z;
      allVerts.forEach(vp=>{
        const dx=mpos.x-vp.x, dy=mpos.y-vp.y, d2=dx*dx+dy*dy;
        if(d2>drawR*drawR) return;
        const isNear=d2<snapR*snapR;
        ctx.beginPath(); ctx.arc(vp.x,vp.y,(isNear?9:5)/z,0,Math.PI*2);
        ctx.strokeStyle=isNear?'#f59e0b':'rgba(255,255,255,0.55)'; ctx.lineWidth=(isNear?2.5:1.5)/z; ctx.stroke();
        if(isNear){
          ctx.fillStyle='rgba(245,158,11,0.25)'; ctx.fill();
          ctx.save(); ctx.font=`bold ${10/z}px sans-serif`; ctx.textAlign='center';
          const ly2=vp.y-16/z; const tw=ctx.measureText('SNAP').width+8/z;
          ctx.fillStyle='rgba(245,158,11,0.92)'; ctx.fillRect(vp.x-tw/2,ly2-8/z,tw,13/z);
          ctx.fillStyle='#fff'; ctx.textBaseline='middle'; ctx.fillText('SNAP',vp.x,ly2); ctx.restore();
        }
      });
    }
  }

  // Area in costruzione
  if (mode==='area' && curPts.length>0 && mpos) {
    const color = curAreaType==='installable' ? AREA_COLORS[installableAreas.length%AREA_COLORS.length].stroke : '#dc2626';
    if(curPts.length>=3){
      const fillColor=curAreaType==='installable'?AREA_COLORS[installableAreas.length%AREA_COLORS.length].fill.replace('0.15','0.25'):'rgba(220,38,38,0.20)';
      ctx.fillStyle=fillColor; ctx.beginPath(); ctx.moveTo(curPts[0].x,curPts[0].y);
      for(let i=1;i<curPts.length;i++) ctx.lineTo(curPts[i].x,curPts[i].y);
      ctx.closePath(); ctx.fill();
    }
    ctx.shadowColor='rgba(255,255,255,0.7)'; ctx.shadowBlur=4/z; ctx.strokeStyle=color; ctx.lineWidth=3/z;
    ctx.beginPath(); ctx.moveTo(curPts[0].x,curPts[0].y);
    for(let i=1;i<curPts.length;i++) ctx.lineTo(curPts[i].x,curPts[i].y);
    ctx.stroke(); ctx.shadowBlur=0;
    const last=curPts[curPts.length-1];
    const targetPt=orthoPreviewPt||mpos;
    const isVertexSnap=orthoPreviewPt&&(()=>{
      const vpts=[];
      installableAreas.forEach(a=>vpts.push(...a.points));
      exclusionAreas.forEach(a=>vpts.push(...a.points));
      return vpts.some(vp=>Math.abs(vp.x-targetPt.x)<0.5&&Math.abs(vp.y-targetPt.y)<0.5);
    })();
    const isOrthoSnap=orthoPreviewPt&&!isVertexSnap&&(Math.abs(targetPt.x-mpos.x)>0.5||Math.abs(targetPt.y-mpos.y)>0.5);
    const lineColor=isOrthoSnap?'rgba(245,158,11,0.65)':color;
    ctx.strokeStyle='rgba(255,255,255,0.55)'; ctx.lineWidth=2/z; ctx.setLineDash([5/z,5/z]);
    ctx.beginPath(); ctx.moveTo(last.x,last.y); ctx.lineTo(targetPt.x,targetPt.y); ctx.stroke();
    ctx.strokeStyle=lineColor; ctx.lineWidth=1.2/z;
    ctx.beginPath(); ctx.moveTo(last.x,last.y); ctx.lineTo(targetPt.x,targetPt.y); ctx.stroke();
    ctx.setLineDash([]);
    if(isVertexSnap||isOrthoSnap){
      ctx.beginPath(); ctx.arc(targetPt.x,targetPt.y,(isOrthoSnap?4:7)/z,0,Math.PI*2);
      ctx.fillStyle=isOrthoSnap?'rgba(245,158,11,0.45)':'rgba(245,158,11,0.85)'; ctx.fill();
      if(!isOrthoSnap){ctx.strokeStyle='#fff'; ctx.lineWidth=2/z; ctx.stroke();}
    }
    if(curPts.length>=2){
      const p0=curPts[0], p1=curPts[1];
      const dx=p1.x-p0.x, dy=p1.y-p0.y, len=Math.sqrt(dx*dx+dy*dy);
      if(len>1){
        const ux=dx/len, uy=dy/len, vx=-uy, vy=ux;
        const mpV=(mpos.x-p0.x)*vx+(mpos.y-p0.y)*vy;
        const minV=Math.min(0,mpV), maxV=Math.max(0,mpV);
        const r=[
          {x:p0.x+0*ux+minV*vx, y:p0.y+0*uy+minV*vy},
          {x:p0.x+len*ux+minV*vx, y:p0.y+len*uy+minV*vy},
          {x:p0.x+len*ux+maxV*vx, y:p0.y+len*uy+maxV*vy},
          {x:p0.x+0*ux+maxV*vx, y:p0.y+0*uy+maxV*vy}
        ];
        ctx.setLineDash([3/z,5/z]); ctx.strokeStyle='rgba(100,180,100,0.4)'; ctx.lineWidth=1/z;
        ctx.beginPath(); ctx.moveTo(r[0].x,r[0].y); r.forEach(pt=>ctx.lineTo(pt.x,pt.y)); ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);
      }
    }
    if(curPts.length>=3){
      const fp=curPts[0];
      ctx.strokeStyle='rgba(255,255,255,0.8)'; ctx.lineWidth=3/z; ctx.setLineDash([5/z,4/z]);
      ctx.beginPath(); ctx.moveTo(targetPt.x,targetPt.y); ctx.lineTo(fp.x,fp.y); ctx.stroke();
      ctx.strokeStyle='rgba(100,100,100,0.7)'; ctx.lineWidth=1.5/z;
      ctx.beginPath(); ctx.moveTo(targetPt.x,targetPt.y); ctx.lineTo(fp.x,fp.y); ctx.stroke(); ctx.setLineDash([]);
      const sd=Math.sqrt((targetPt.x-fp.x)**2+(targetPt.y-fp.y)**2)*z;
      const snapActive=sd<15;
      ctx.beginPath(); ctx.arc(fp.x,fp.y,(snapActive?12:7)/z,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.fill();
      ctx.beginPath(); ctx.arc(fp.x,fp.y,(snapActive?8:4)/z,0,Math.PI*2);
      ctx.fillStyle=snapActive?color:'rgba(255,255,255,0.9)'; ctx.strokeStyle=color; ctx.lineWidth=2.5/z; ctx.fill(); ctx.stroke();
      if(snapActive){
        ctx.save(); ctx.font=`bold ${11/z}px sans-serif`; ctx.fillStyle='rgba(0,0,0,0.85)'; ctx.textAlign='center';
        const snY=fp.y-(15/z); ctx.fillRect(fp.x-22/z,snY-10/z,44/z,13/z); ctx.fillStyle='#fff'; ctx.fillText('CHIUDI',fp.x,snY); ctx.restore();
      }
    }
    curPts.forEach((pt,i)=>{
      if(i===0&&curPts.length>=3) return;
      ctx.beginPath(); ctx.arc(pt.x,pt.y,7/z,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,0.8)'; ctx.fill();
      ctx.beginPath(); ctx.arc(pt.x,pt.y,4.5/z,0,Math.PI*2); ctx.fillStyle=color; ctx.strokeStyle='#fff'; ctx.lineWidth=1.5/z; ctx.fill(); ctx.stroke();
    });
    ctx.save(); ctx.font=`${11/z}px sans-serif`;
    const hint=curPts.length>=3?'Dbl-click/Enter: chiudi Â· R: rettangolo Â· D: distanza Â· ESC: annulla':'Click: aggiungi vertice Â· R: rettangolo Â· D: distanza Â· ESC: annulla';
    const tw=ctx.measureText(hint).width+10/z;
    ctx.fillStyle='rgba(255,255,255,0.88)'; ctx.fillRect(mpos.x+8/z,mpos.y-20/z,tw,16/z);
    ctx.fillStyle='#333'; ctx.textAlign='left'; ctx.fillText(hint,mpos.x+13/z,mpos.y-8/z); ctx.restore();
  }

  // Preview incolla area non installabile
  if (_copyExclMode && _copyExclPts && mpos) {
    ctx.save();
    ctx.translate(mpos.x, mpos.y);
    ctx.fillStyle='rgba(220,38,38,0.25)';
    ctx.strokeStyle='#dc2626';
    ctx.lineWidth=2/z;
    ctx.setLineDash([8/z,4/z]);
    ctx.beginPath();
    ctx.moveTo(_copyExclPts[0].x,_copyExclPts[0].y);
    for(let i=1;i<_copyExclPts.length;i++) ctx.lineTo(_copyExclPts[i].x,_copyExclPts[i].y);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.setLineDash([]);
    const cs=7/z;
    ctx.strokeStyle='rgba(220,38,38,0.8)'; ctx.lineWidth=1.5/z;
    ctx.beginPath(); ctx.moveTo(-cs,0); ctx.lineTo(cs,0); ctx.moveTo(0,-cs); ctx.lineTo(0,cs); ctx.stroke();
    ctx.restore();
  }

  // Freccia esposizione in corso
  if (_expArrowMode && mpos) {
    const area = installableAreas[_expArrowAreaIdx];
    if (area) {
      const ac = AREA_COLORS[_expArrowAreaIdx % AREA_COLORS.length];
      ctx.save();
      ctx.fillStyle = ac.fill.replace('0.15','0.35');
      ctx.strokeStyle = ac.stroke; ctx.lineWidth = 2.5/z;
      ctx.beginPath(); ctx.moveTo(area.points[0].x, area.points[0].y);
      area.points.forEach((pt,i) => { if(i) ctx.lineTo(pt.x, pt.y); });
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    if (_expArrowStart) {
      const end = _expArrowEnd || mpos;
      const dx = end.x - _expArrowStart.x;
      const dy = end.y - _expArrowStart.y;
      const len = Math.sqrt(dx*dx + dy*dy);
      if (len > 2/z) {
        const ux = dx/len, uy = dy/len;
        const hw = 12/z;
        const tip = { x: _expArrowStart.x + ux*len, y: _expArrowStart.y + uy*len };
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 5/z;
        ctx.beginPath(); ctx.moveTo(_expArrowStart.x, _expArrowStart.y); ctx.lineTo(tip.x, tip.y); ctx.stroke();
        ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2.5/z;
        ctx.beginPath(); ctx.moveTo(_expArrowStart.x, _expArrowStart.y); ctx.lineTo(tip.x, tip.y); ctx.stroke();
        ctx.fillStyle = '#22c55e';
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 2/z;
        ctx.beginPath();
        ctx.moveTo(tip.x, tip.y);
        ctx.lineTo(tip.x - ux*hw + uy*hw*0.5, tip.y - uy*hw - ux*hw*0.5);
        ctx.lineTo(tip.x - ux*hw - uy*hw*0.5, tip.y - uy*hw + ux*hw*0.5);
        ctx.closePath(); ctx.stroke(); ctx.fill();
        ctx.beginPath(); ctx.arc(_expArrowStart.x, _expArrowStart.y, 5/z, 0, Math.PI*2);
        ctx.fillStyle = '#fff'; ctx.fill();
        ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2/z; ctx.stroke();
        if (len > 20/z) {
          const ang = Math.atan2(dy, dx);
          const geo = ((ang * 180/Math.PI + 90) % 360 + 360) % 360;
          const dirs = ['N','NE','E','SE','S','SW','W','NW'];
          const EL = {N:'Nord',NE:'Nord-Est',E:'Est',SE:'Sud-Est',S:'Sud',SW:'Sud-Ovest',W:'Ovest',NW:'Nord-Ovest'};
          const dirLabel = EL[dirs[Math.round(geo/45)%8]];
          ctx.save();
          ctx.font = `bold ${11/z}px sans-serif`;
          const tw = ctx.measureText(dirLabel).width + 10/z;
          ctx.fillStyle = 'rgba(255,255,255,0.88)';
          ctx.fillRect(mpos.x+8/z, mpos.y-20/z, tw, 16/z);
          ctx.fillStyle = '#16a34a'; ctx.textAlign='left'; ctx.textBaseline='middle';
          ctx.fillText(dirLabel, mpos.x+13/z, mpos.y-12/z);
          ctx.restore();
        }
        ctx.restore();
      }
    } else {
      ctx.save();
      ctx.font = `${11/z}px sans-serif`;
      const hint = 'Click: origine Â· trascina verso la falda Â· ESC: salta';
      const tw = ctx.measureText(hint).width + 10/z;
      ctx.fillStyle = 'rgba(255,255,255,0.88)';
      ctx.fillRect(mpos.x+8/z, mpos.y-20/z, tw, 16/z);
      ctx.fillStyle = '#333'; ctx.textAlign='left';
      ctx.fillText(hint, mpos.x+13/z, mpos.y-8/z);
      ctx.restore();
    }
  }

  // Pannelli â€” pass 1: LOD + color batching
  // Lookup per filtro inverter (costruito una volta per frame)
  const _strInvMap = new Map();
  if (_highlightInvIdx >= 0) strings.forEach(s => _strInvMap.set(s.id, s.invIdx ?? -1));
  const _isDimmed = (pan) => _highlightInvIdx >= 0 && !!pan.strId && _strInvMap.get(pan.strId) !== _highlightInvIdx;

  const vpLeft   = (-canvas.clientWidth/2  - ox) / z;
  const vpRight  = ( canvas.clientWidth/2  - ox) / z;
  const vpTop    = (-canvas.clientHeight/2 - oy) / z;
  const vpBottom = ( canvas.clientHeight/2 - oy) / z;
  const panelScreenPx = (panels.length > 0 ? panels[0].w : 0) * z;
  const useLOD = panelScreenPx < 8;
  if (useLOD) {
    const colorPaths = new Map();
    panels.forEach(pan => {
      const fc = (stringsVisible && pan.stringColor) ? pan.stringColor : '#1e3a5f';
      if (!colorPaths.has(fc)) colorPaths.set(fc, new Path2D());
      const path = colorPaths.get(fc);
      if (pan.axisUx !== undefined) {
        const {axisUx:ux,axisUy:uy,axisVx:vx,axisVy:vy,localU:u,localV:v,w,h} = pan;
        const cx_ = (u+w/2)*ux+(v+h/2)*vx, cy_ = (u+w/2)*uy+(v+h/2)*vy;
        if (cx_<vpLeft-w||cx_>vpRight+w||cy_<vpTop-h||cy_>vpBottom+h) return;
        path.moveTo(u*ux+v*vx,u*uy+v*vy); path.lineTo((u+w)*ux+v*vx,(u+w)*uy+v*vy);
        path.lineTo((u+w)*ux+(v+h)*vx,(u+w)*uy+(v+h)*vy); path.lineTo(u*ux+(v+h)*vx,u*uy+(v+h)*vy);
        path.closePath();
      } else {
        if (pan.x>vpRight||pan.x+pan.w<vpLeft||pan.y>vpBottom||pan.y+pan.h<vpTop) return;
        path.rect(pan.x, pan.y, pan.w, pan.h);
      }
    });
    colorPaths.forEach((path, color) => { ctx.fillStyle=color; ctx.fill(path); });
    const borderPath = new Path2D();
    panels.forEach(pan => {
      if (pan.axisUx !== undefined) {
        const {axisUx:ux,axisUy:uy,axisVx:vx,axisVy:vy,localU:u,localV:v,w,h} = pan;
        const cx_=(u+w/2)*ux+(v+h/2)*vx, cy_=(u+w/2)*uy+(v+h/2)*vy;
        if (cx_<vpLeft-w||cx_>vpRight+w||cy_<vpTop-h||cy_>vpBottom+h) return;
        borderPath.moveTo(u*ux+v*vx,u*uy+v*vy); borderPath.lineTo((u+w)*ux+v*vx,(u+w)*uy+v*vy);
        borderPath.lineTo((u+w)*ux+(v+h)*vx,(u+w)*uy+(v+h)*vy); borderPath.lineTo(u*ux+(v+h)*vx,u*uy+(v+h)*vy);
        borderPath.closePath();
      } else {
        if (pan.x>vpRight||pan.x+pan.w<vpLeft||pan.y>vpBottom||pan.y+pan.h<vpTop) return;
        borderPath.rect(pan.x, pan.y, pan.w, pan.h);
      }
    });
    ctx.strokeStyle='rgba(255,255,255,0.35)'; ctx.lineWidth=0.8/z; ctx.stroke(borderPath);
    // Dim overlay LOD: scurisci i pannelli non appartenenti all'inverter selezionato
    if (_highlightInvIdx >= 0) {
      const dimPath = new Path2D();
      panels.forEach(pan => {
        if (!_isDimmed(pan)) return;
        if (pan.axisUx !== undefined) {
          const {axisUx:ux,axisUy:uy,axisVx:vx,axisVy:vy,localU:u,localV:v,w,h} = pan;
          const cx_=(u+w/2)*ux+(v+h/2)*vx, cy_=(u+w/2)*uy+(v+h/2)*vy;
          if (cx_<vpLeft-w||cx_>vpRight+w||cy_<vpTop-h||cy_>vpBottom+h) return;
          dimPath.moveTo(u*ux+v*vx,u*uy+v*vy); dimPath.lineTo((u+w)*ux+v*vx,(u+w)*uy+v*vy);
          dimPath.lineTo((u+w)*ux+(v+h)*vx,(u+w)*uy+(v+h)*vy); dimPath.lineTo(u*ux+(v+h)*vx,u*uy+(v+h)*vy);
          dimPath.closePath();
        } else {
          if (pan.x>vpRight||pan.x+pan.w<vpLeft||pan.y>vpBottom||pan.y+pan.h<vpTop) return;
          dimPath.rect(pan.x, pan.y, pan.w, pan.h);
        }
      });
      ctx.fillStyle = 'rgba(0,0,0,0.72)'; ctx.fill(dimPath);
    }
  } else {
    panels.forEach((pan) => {
      if (pan.axisUx !== undefined) {
        const {axisUx:ux,axisUy:uy,axisVx:vx,axisVy:vy,localU:u,localV:v,w,h} = pan;
        const cx_=(u+w/2)*ux+(v+h/2)*vx, cy_=(u+w/2)*uy+(v+h/2)*vy;
        if (cx_<vpLeft-w||cx_>vpRight+w||cy_<vpTop-h||cy_>vpBottom+h) return;
      } else {
        if (pan.x>vpRight||pan.x+pan.w<vpLeft||pan.y>vpBottom||pan.y+pan.h<vpTop) return;
      }
      const fillStyle = (stringsVisible && pan.stringColor) ? pan.stringColor : '#1e3a5f';
      const dimmed = _isDimmed(pan);
      if (dimmed) { ctx.save(); ctx.globalAlpha = 0.18; }
      drawPanel(ctx, pan, fillStyle, '#ffffff', 3/z, null, 0, z);
      if (dimmed) ctx.restore();
    });
  }

  // Pannelli â€” pass 2: overlay hover/selection + label stringa
  panels.forEach((pan, idx) => {
    if (pan.axisUx !== undefined) {
      const {axisUx:ux,axisUy:uy,axisVx:vx,axisVy:vy,localU:u,localV:v,w,h} = pan;
      const cx_=(u+w/2)*ux+(v+h/2)*vx, cy_=(u+w/2)*uy+(v+h/2)*vy;
      if (cx_<vpLeft-w||cx_>vpRight+w||cy_<vpTop-h||cy_>vpBottom+h) return;
    } else {
      if (pan.x>vpRight||pan.x+pan.w<vpLeft||pan.y>vpBottom||pan.y+pan.h<vpTop) return;
    }
    const isSelected = selectedPanels.has(idx);
    const isHovered  = idx === hoveredPanel;
    const strokeStyle  = isSelected ? '#00e5ff' : '#f1c40f';
    const lineWidth    = isSelected ? 4/z : 3/z;
    const shadowColor  = isSelected ? 'rgba(0,229,255,0.9)' : 'rgba(241,196,15,0.9)';
    const shadowBlur   = isSelected ? 25/z : 18/z;
    if (isSelected || isHovered) {
      if (pan.axisUx !== undefined) {
        const {axisUx:ux,axisUy:uy,axisVx:vx,axisVy:vy,localU:u,localV:v,w,h} = pan;
        const c0={x:u*ux+v*vx,y:u*uy+v*vy}, c1={x:(u+w)*ux+v*vx,y:(u+w)*uy+v*vy};
        const c2={x:(u+w)*ux+(v+h)*vx,y:(u+w)*uy+(v+h)*vy}, c3={x:u*ux+(v+h)*vx,y:u*uy+(v+h)*vy};
        ctx.shadowColor=shadowColor; ctx.shadowBlur=shadowBlur; ctx.strokeStyle=strokeStyle; ctx.lineWidth=lineWidth;
        ctx.beginPath(); ctx.moveTo(c0.x,c0.y); ctx.lineTo(c1.x,c1.y); ctx.lineTo(c2.x,c2.y); ctx.lineTo(c3.x,c3.y); ctx.closePath(); ctx.stroke(); ctx.shadowBlur=0;
      } else {
        ctx.shadowColor=shadowColor; ctx.shadowBlur=shadowBlur; ctx.strokeStyle=strokeStyle; ctx.lineWidth=lineWidth;
        ctx.strokeRect(pan.x, pan.y, pan.w, pan.h); ctx.shadowBlur=0;
      }
    }
    if (stringsVisible && pan.strId && pan.w*z > 6 && !_isDimmed(pan)) {
      const cx_ = pan.axisUx !== undefined ? (pan.localU+pan.w/2)*pan.axisUx+(pan.localV+pan.h/2)*pan.axisVx : pan.x+pan.w/2;
      const cy_ = pan.axisUx !== undefined ? (pan.localU+pan.w/2)*pan.axisUy+(pan.localV+pan.h/2)*pan.axisVy : pan.y+pan.h/2;
      const fs = Math.min(pan.h*0.45, 14/z);
      ctx.save(); ctx.translate(cx_, cy_); ctx.rotate(pan.ang||0);
      ctx.font = `bold ${fs}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.shadowColor='rgba(0,0,0,0.7)'; ctx.shadowBlur=2/z; ctx.fillStyle='#ffffff';
      ctx.fillText(pan.strId, 0, 0); ctx.shadowBlur=0; ctx.restore();
    }
  });

  // Fasce camminamento (sopra pannelli, sotto i label)
  if (typeof installableAreas !== 'undefined') {
    ctx.save();
    installableAreas.forEach(area => {
      if (!area._walkways || area._walkways.length === 0) return;
      area._walkways.forEach(w => {
        const cs = w.corners;
        ctx.beginPath();
        ctx.moveTo(cs[0].x, cs[0].y);
        ctx.lineTo(cs[1].x, cs[1].y);
        ctx.lineTo(cs[2].x, cs[2].y);
        ctx.lineTo(cs[3].x, cs[3].y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(251,146,60,0.13)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(251,146,60,0.7)';
        ctx.lineWidth = 1.2 / z;
        ctx.setLineDash([4 / z, 3 / z]);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    });
    ctx.restore();
  }

  // Cerchi ombra camini (sopra pannelli)
  technicalObjects.forEach(obj => {
    if (obj.type !== 'chimney') return;
    const _h = obj.heightM || 1.5;
    const shadowR = scale > 1
      ? _h * scale / Math.tan(20 * Math.PI / 180)
      : (obj.sizePx / 2) * 3.5;
    const obstacleDist = parseFloat(DOM.obstacleDistance ? DOM.obstacleDistance.value : 0) || 0;
    const exclR = Math.max(obj.sizePx / 2 + obstacleDist * scale, shadowR);
    ctx.save();
    ctx.globalAlpha = 0.10;
    ctx.fillStyle = '#000000';
    ctx.beginPath(); ctx.arc(obj.x, obj.y, shadowR, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 0.55;
    ctx.setLineDash([6/z, 4/z]);
    ctx.lineWidth = 1.4/z; ctx.strokeStyle = '#555555';
    ctx.beginPath(); ctx.arc(obj.x, obj.y, shadowR, 0, Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 0.75;
    ctx.setLineDash([5/z, 3/z]);
    ctx.lineWidth = 2/z; ctx.strokeStyle = '#dc2626';
    ctx.beginPath(); ctx.arc(obj.x, obj.y, exclR, 0, Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);
    if (scale > 1) {
      const shadowM = (_h / Math.tan(20 * Math.PI / 180)).toFixed(1);
      const exclM   = (exclR / scale).toFixed(1);
      ctx.globalAlpha = 0.9;
      const fs = Math.max(9/z, shadowR * 0.08);
      ctx.font = 'bold ' + fs + 'px var(--font-main)';
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.lineWidth = 2.5/z; ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.fillStyle = '#444444';
      ctx.strokeText('ombra ' + shadowM + 'm', obj.x, obj.y - shadowR - 2/z);
      ctx.fillText('ombra ' + shadowM + 'm', obj.x, obj.y - shadowR - 2/z);
      if (Math.abs(exclR - shadowR) > scale * 0.1) {
        ctx.fillStyle = '#dc2626';
        ctx.strokeText('escl. ' + exclM + 'm', obj.x, obj.y - exclR - 2/z);
        ctx.fillText('escl. ' + exclM + 'm', obj.x, obj.y - exclR - 2/z);
      }
    }
    ctx.restore();
  });

  // Snap magnetico: ghost preview durante drag
  if (snapPreviewPos && isDraggingPanels) {
    const sp = snapPreviewPos;
    const ux=sp.axisUx, uy=sp.axisUy, vx=sp.axisVx, vy=sp.axisVy;
    const u=sp.localU, v=sp.localV, w=sp.w, h=sp.h;
    const c0={x:u*ux+v*vx, y:u*uy+v*vy};
    const c1={x:(u+w)*ux+v*vx, y:(u+w)*uy+v*vy};
    const c2={x:(u+w)*ux+(v+h)*vx, y:(u+w)*uy+(v+h)*vy};
    const c3={x:u*ux+(v+h)*vx, y:u*uy+(v+h)*vy};
    ctx.save();
    if (sp.snapped) {
      ctx.strokeStyle='#10b981'; ctx.lineWidth=2/z;
      ctx.fillStyle='rgba(16,185,129,0.15)';
      ctx.shadowColor='rgba(16,185,129,0.8)'; ctx.shadowBlur=12/z;
    } else {
      ctx.setLineDash([5/z,4/z]);
      ctx.strokeStyle='rgba(245,158,11,0.85)'; ctx.lineWidth=1.5/z;
      ctx.fillStyle='rgba(245,158,11,0.08)';
      ctx.shadowColor='rgba(245,158,11,0.5)'; ctx.shadowBlur=8/z;
    }
    ctx.beginPath();
    ctx.moveTo(c0.x,c0.y); ctx.lineTo(c1.x,c1.y);
    ctx.lineTo(c2.x,c2.y); ctx.lineTo(c3.x,c3.y); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.setLineDash([]); ctx.shadowBlur=0;
    const cx_=(c0.x+c2.x)/2, cy_=(c0.y+c2.y)/2;
    ctx.beginPath(); ctx.arc(cx_,cy_,4/z,0,Math.PI*2);
    ctx.fillStyle = sp.snapped ? '#10b981' : 'rgba(245,158,11,0.9)';
    ctx.shadowColor = sp.snapped ? 'rgba(16,185,129,0.9)' : 'rgba(245,158,11,0.7)';
    ctx.shadowBlur = 8/z;
    ctx.fill(); ctx.shadowBlur=0;
    ctx.restore();
  }

  // Cursore custom
  if((mode==='cal'||mode==='area')&&mpos){
    const mx_=mpos.x, my_=mpos.y, R=10/z, gap2=3/z, dot=2/z;
    ctx.save(); ctx.strokeStyle='#ffffff'; ctx.lineWidth=3/z;
    ctx.beginPath(); ctx.moveTo(mx_-R-gap2,my_); ctx.lineTo(mx_-gap2,my_); ctx.moveTo(mx_+gap2,my_); ctx.lineTo(mx_+R+gap2,my_); ctx.moveTo(mx_,my_-R-gap2); ctx.lineTo(mx_,my_-gap2); ctx.moveTo(mx_,my_+gap2); ctx.lineTo(mx_,my_+R+gap2); ctx.stroke();
    ctx.lineWidth=1.5/z; ctx.strokeStyle=mode==='cal'?'#f97316':(curAreaType==='exclusion'?'#ef4444':'#22c55e');
    ctx.beginPath(); ctx.moveTo(mx_-R-gap2,my_); ctx.lineTo(mx_-gap2,my_); ctx.moveTo(mx_+gap2,my_); ctx.lineTo(mx_+R+gap2,my_); ctx.moveTo(mx_,my_-R-gap2); ctx.lineTo(mx_,my_-gap2); ctx.moveTo(mx_,my_+gap2); ctx.lineTo(mx_,my_+R+gap2); ctx.stroke();
    ctx.fillStyle=mode==='cal'?'#f97316':(curAreaType==='exclusion'?'#ef4444':'#22c55e');
    ctx.beginPath(); ctx.arc(mx_,my_,dot,0,Math.PI*2); ctx.fill(); ctx.restore();
  }
  ctx.restore();
}


// ── js/panels.js ──
// ── panels.js — Motore layout pannelli, area preview, snap griglia ──

'use strict';
//
// Dipendenze globali dichiarate in altri file (devono essere caricate prima):
//   state.js  → _layoutCache (Map), _previewDebounceTimer, _relayoutTimer,
//               panels, strings, selectedPanels, hoveredPanel, moveMode,
//               isDraggingPanels, dragStartPoint, panelsStartPos, snapPreviewPos,
//               installableAreas, exclusionAreas, technicalObjects, scale
//   ui.js     → DOM (cache elementi HTML), updateAreaLists, updateStats,
//               updateStringList, updateLegend, _updateToolbarGroups, draw
//   strings.js → genStrings
//   canvas.js  → offsetPolygon, pointInPolygon, _isSelfIntersecting,
//               _isValidPoly, _convexHull, distanceToSegment, polyAABB,
//               techObjectToPolygon

// ── polyArea / polyAreaCached ────────────────────────────────────────────────

function polyArea(pts) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    a += pts[i].x * pts[j].y;
    a -= pts[j].x * pts[i].y;
  }
  return Math.abs(a) / 2 / (scale * scale);
}

// Cached version — stores result on the area object itself, cleared by invalidateLayoutCache
function polyAreaCached(area) {
  if (area._cachedArea === undefined || area._areaCacheScale !== scale) {
    area._cachedArea = polyArea(area.points);
    area._areaCacheScale = scale;
  }
  return area._cachedArea;
}

// ── Layout result cache ───────────────────────────────────────────────────────

function invalidateLayoutCache() {
  _layoutCache.clear();
  _exactCountCache.clear(); // invalida anche la cache exactCount
  installableAreas.forEach(a => { delete a._cachedArea; });
  exclusionAreas.forEach(a => { delete a._cachedArea; });
}

// ── readLayoutParams ─────────────────────────────────────────────────────────

/**
 * Legge i parametri di layout dalla UI e li restituisce come oggetto.
 * Usato sia dalla cache key sia da layoutSingleArea.
 */
function readLayoutParams(area) {
  const gap      = Math.max(0, parseFloat(DOM.ps.value)               || 0) / 100;
  const pwr      = Math.max(1, parseInt  (DOM.pp.value)               || 400);
  const margin   = Math.max(0, parseFloat(DOM.safetyMargin.value)     || 0) / 100;
  const obstDist = Math.max(0, parseFloat(DOM.obstacleDistance.value) || 0);
  // Per-area stagger (fallback to global DOM if no area provided)
  const stagger    = area ? (area.staggerEnabled || false) : DOM.enableStagger.checked;
  const staggerPct = area
    ? Math.min(0.99, Math.max(0, (parseFloat(area.staggerOffset) || 50) / 100))
    : Math.min(0.99, Math.max(0, (parseFloat(DOM.staggerOffset.value) || 0) / 100));
  // Per-area walkways — retrocompatibilità con vecchio formato
  function _legacyWalk(aObj) {
    if (!aObj) return { rOn: walkwaysEnabled, rInt: parseInt(DOM.walkwayInterval.value) || 3, rW: (parseFloat(DOM.walkwayWidth.value) || 80) / 100, cOn: false, cInt: 3, cW: 0.8 };
    const on  = aObj.walkwaysEnabled || false;
    const dir = aObj.walkwayDir || 'row';
    const int_ = parseInt(aObj.walkwayInterval) || 3;
    const w   = (parseFloat(aObj.walkwayWidth) || 80) / 100;
    if (aObj.walkRowEnabled !== undefined || aObj.walkColEnabled !== undefined) {
      return {
        rOn:  aObj.walkRowEnabled || false,
        rInt: Math.max(1, parseInt(aObj.walkRowInterval) || 3),
        rW:   Math.max(0, (parseFloat(aObj.walkRowWidth) || 80) / 100),
        cOn:  aObj.walkColEnabled || false,
        cInt: Math.max(1, parseInt(aObj.walkColInterval) || 3),
        cW:   Math.max(0, (parseFloat(aObj.walkColWidth) || 80) / 100),
      };
    }
    return {
      rOn:  on && dir === 'row', rInt: int_, rW: w,
      cOn:  on && dir === 'col', cInt: int_, cW: w,
    };
  }
  const wk = _legacyWalk(area || null);
  const walkRowInt   = wk.rOn ? Math.max(1, wk.rInt) : 999999;
  const walkRowWidth = wk.rOn ? wk.rW : 0;
  const walkColInt   = wk.cOn ? Math.max(1, wk.cInt) : 999999;
  const walkColWidth = wk.cOn ? wk.cW : 0;
  return { gap, pwr, margin, obstDist, stagger, staggerPct, walkRowInt, walkRowWidth, walkColInt, walkColWidth };
}

// ── _layoutCacheKey ──────────────────────────────────────────────────────────

function _layoutCacheKey(areaIdx, mW, mH) {
  const p = readLayoutParams(installableAreas[areaIdx]);
  const exclKey = exclusionAreas.map(a =>
    a.points.map(pt => `${Math.round(pt.x)},${Math.round(pt.y)}`).join(';')
  ).join('|') + '/' + technicalObjects.map(o =>
    `${Math.round(o.x)},${Math.round(o.y)},${Math.round((o.sizePx || 0) * 10)},${Math.round((o.bufferM || 0) * 100)},${o.solarAngleDeg || 30}`
  ).join('|');
  return `${areaIdx}|${mW}|${mH}|${p.gap}|${p.pwr}|${p.margin}|${p.obstDist}|${p.stagger ? 1 : 0}|${p.staggerPct}|${p.walkRowInt}|${p.walkRowWidth}|${p.walkColInt}|${p.walkColWidth}|${scale.toFixed(6)}|${exclKey}`;
}

// ── techObjectToPolygon ──────────────────────────────────────────────────────

/**
 * Converte un oggetto tecnico nella sua poligonale di esclusione (world coords).
 * Logica zona di esclusione:
 *   - il layout engine aggiunge sempre obstDistPx sul bordo
 *   - zona effettiva finale = max(shadowR, sizePx/2 + obstDist)
 */
function techObjectToPolygon(obj) {
  const obstacleDist = parseFloat(DOM.obstacleDistance ? DOM.obstacleDistance.value : 0) || 0;
  const obstDistPxLocal = obstacleDist * scale;
  const perObjBufR = (obj.bufferM || 0) * scale;
  let hw;
  if (obj.type === 'chimney' && scale > 1 && obj.heightM) {
    const shadowR = obj.heightM * scale / Math.tan((obj.solarAngleDeg || 30) * Math.PI / 180);
    hw = Math.max(shadowR - obstDistPxLocal, obj.sizePx / 2 + perObjBufR);
  } else {
    hw = obj.sizePx / 2 + perObjBufR;
  }
  const ang = obj.ang || 0;
  const pts = [];
  if (obj.type === 'skylight' || obj.type === 'hvac') {
    const hh = obj.type === 'hvac' ? hw * 0.65 : hw;
    const cos = Math.cos(ang), sin = Math.sin(ang);
    [{ x: -hw, y: -hh }, { x: hw, y: -hh }, { x: hw, y: hh }, { x: -hw, y: hh }].forEach(c => pts.push({
      x: obj.x + c.x * cos - c.y * sin,
      y: obj.y + c.x * sin + c.y * cos
    }));
    return pts;
  }
  const N = 20;
  for (let i = 0; i < N; i++) {
    const a = (2 * Math.PI * i) / N;
    pts.push({ x: obj.x + hw * Math.cos(a), y: obj.y + hw * Math.sin(a) });
  }
  return pts;
}

// ── Concave decomposition helpers ────────────────────────────────────────────

/**
 * Rileva se un poligono è concavo (ha almeno un vertice reflex).
 * Vertice reflex = angolo interno > 180° → cross product cambia segno.
 */
function _isConcavePolygon(pts) {
  const n = pts.length;
  if (n < 4) return false;
  let sign = 0;
  for (let i = 0; i < n; i++) {
    const a = pts[(i-1+n)%n], b = pts[i], c = pts[(i+1)%n];
    const cross = (b.x-a.x)*(c.y-b.y) - (b.y-a.y)*(c.x-b.x);
    if (Math.abs(cross) < 1e-8) continue;
    const s = cross > 0 ? 1 : -1;
    if (sign === 0) sign = s;
    else if (s !== sign) return true;
  }
  return false;
}

/**
 * Notch-based splitting (Gap 2 fix): prova H e V per TUTTI i vertici reflex,
 * valuta ogni candidato con score area(A)^0.9 + area(B)^0.9, sceglie il migliore.
 * Scarta split con pezzi troppo piccoli (micro-frammenti inutili).
 */
function _splitConcavePolygon(pts) {
  const n = pts.length;
  if (n < 4) return [pts];

  // Area minima per un pezzo valido (evita micro-frammenti)
  const _polyArea = p => { let s=0; for(let i=0;i<p.length;i++){const j=(i+1)%p.length; s+=p[i].x*p[j].y-p[j].x*p[i].y;} return Math.abs(s)/2; };
  const totalArea = _polyArea(pts);
  const MIN_FRAG = totalArea * 0.05; // scarta pezzi < 5% dell'area totale
  const _score = (A, B) => Math.pow(_polyArea(A), 0.9) + Math.pow(_polyArea(B), 0.9);

  // Determina verso (CW/CCW)
  let wSign = 0;
  for (let i = 0; i < n; i++) {
    const j = (i+1)%n;
    wSign += pts[i].x*pts[j].y - pts[j].x*pts[i].y;
  }
  const windSign = wSign >= 0 ? 1 : -1;

  // Raccogli tutti i vertici reflex
  const reflexIndices = [];
  for (let i = 0; i < n; i++) {
    const a = pts[(i-1+n)%n], b = pts[i], c = pts[(i+1)%n];
    const cross = windSign * ((b.x-a.x)*(c.y-b.y) - (b.y-a.y)*(c.x-b.x));
    if (cross < -1e-8) reflexIndices.push(i);
  }
  if (reflexIndices.length === 0) return [pts];

  // Funzione per costruire 2 poligoni dato un taglio (reflexIdx, cutPt, segStart)
  function _buildSplit(reflexIdx, cutPt, cutSegStart) {
    // polyA: vertici da 0..reflexIdx + cutPt
    // polyB: cutPt + vertici da (cutSegStart+1)...(reflexIdx-1) + reflexPt
    // Ricostruisce usando inserimento del punto di taglio nel poligono
    const polyA = [], polyB = [];
    const reflexPt = pts[reflexIdx];

    // Determina l'ordine: va dal reflex al cut attraverso un segmento interno
    // Strategia: percorri il bordo in entrambe le direzioni dal reflex al cut
    // Direzione 1: reflex → cutSegStart (in avanti)
    const fwd = [];
    for (let k = reflexIdx; ; k = (k+1)%n) {
      fwd.push({...pts[k]});
      if (k === cutSegStart) break;
      if (fwd.length > n+1) break; // safety
    }
    fwd.push({...cutPt});

    // Direzione 2: cutSegStart+1 → reflex (in avanti, chiude con cutPt → reflex)
    const bwd = [{...cutPt}];
    for (let k = (cutSegStart+1)%n; k !== reflexIdx; k = (k+1)%n) {
      bwd.push({...pts[k]});
      if (bwd.length > n+1) break;
    }
    bwd.push({...reflexPt});

    if (fwd.length >= 3 && bwd.length >= 3 &&
        _isValidPoly(fwd) && _isValidPoly(bwd)) return [fwd, bwd];
    return null;
  }

  // ── Intersezione raggio-segmento generica ──────────────────────────────────
  // Raggio da reflexPt in direzione (dx,dy), interseca il segmento (a,b).
  // Restituisce il punto di taglio solo se cade STRETTAMENTE dentro il segmento
  // e il raggio punta verso quel punto (s > 0).
  function _raySegIntersect(reflexPt, dx, dy, a, b) {
    // Risolve: reflexPt + s*(dx,dy) = a + t*(b-a)
    // → [ dx  -bax ][ s ] = [ arx ]
    //   [ dy  -bay ][ t ]   [ ary ]
    // denom = det = dx*(-bay) - (-bax)*dy = dy*bax - dx*bay
    const bax = b.x - a.x, bay = b.y - a.y;
    const arx = a.x - reflexPt.x, ary = a.y - reflexPt.y;
    // det = dx*(-bay) - (-bax)*dy = dy*bax - dx*bay
    const denom = dy * bax - dx * bay;
    if (Math.abs(denom) < 1e-10) return null; // parallelo
    // t = (dx*ary - dy*arx) / det  → posizione lungo segmento [0,1]
    const t = (dx * ary - dy * arx) / denom;
    if (t <= 1e-6 || t >= 1 - 1e-6) return null;
    // s = (bax*ary - bay*arx) / det  → distanza lungo raggio (> 0 = direzione giusta)
    const s = (bax * ary - bay * arx) / denom;
    if (s <= 1e-6) return null;
    return { x: a.x + t * bax, y: a.y + t * bay };
  }

  // Genera tutti i candidati di taglio: ogni reflex × {H, V, bordi adiacenti e perpendicolari}.
  // I tagli H/V funzionano per L-shape axis-aligned; i tagli edge-aligned funzionano per L ruotate.
  let bestSplit = null, bestScore = -Infinity;

  for (const reflexIdx of reflexIndices) {
    const reflexPt = pts[reflexIdx];

    // Direzioni degli spigoli adiacenti al vertice reflex
    const prev = pts[(reflexIdx - 1 + n) % n];
    const next = pts[(reflexIdx + 1) % n];
    const e1x = prev.x - reflexPt.x, e1y = prev.y - reflexPt.y; // verso prev
    const e2x = next.x - reflexPt.x, e2y = next.y - reflexPt.y; // verso next
    const len1 = Math.hypot(e1x, e1y) || 1, len2 = Math.hypot(e2x, e2y) || 1;

    // Assi da provare: H, V + direzioni parallele/perpendicolari ai bordi del vertice reflex
    // I tagli edge-aligned sono fondamentali per L-shape ruotate
    const axes = [
      { dx: 1, dy: 0 },           // orizzontale
      { dx: 0, dy: 1 },           // verticale
      { dx:  e1x/len1, dy:  e1y/len1 }, // parallelo bordo prev
      { dx: -e1x/len1, dy: -e1y/len1 }, // opposto
      { dx:  e2x/len2, dy:  e2y/len2 }, // parallelo bordo next
      { dx: -e2x/len2, dy: -e2y/len2 }, // opposto
      { dx: -e1y/len1, dy:  e1x/len1 }, // perpendicolare bordo prev
      { dx: -e2y/len2, dy:  e2x/len2 }, // perpendicolare bordo next
    ];

    for (const { dx, dy } of axes) {
      const intersections = [];
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        if (i === reflexIdx || j === reflexIdx) continue; // salta spigoli incidenti
        const cutPt = _raySegIntersect(reflexPt, dx, dy, pts[i], pts[j]);
        if (cutPt && Math.hypot(cutPt.x - reflexPt.x, cutPt.y - reflexPt.y) > 1e-4) {
          intersections.push({ pt: cutPt, segStart: i });
        }
      }

      for (const { pt: cutPt, segStart } of intersections) {
        const split = _buildSplit(reflexIdx, cutPt, segStart);
        if (!split) continue;
        const [A, B] = split;
        if (_polyArea(A) < MIN_FRAG || _polyArea(B) < MIN_FRAG) continue;
        const s = _score(A, B);
        if (s > bestScore) { bestScore = s; bestSplit = [A, B]; }
      }
    }
  }

  return bestSplit || [pts];
}

/**
 * Decompone ricorsivamente un poligono concavo in parti (max 3 livelli).
 * Nella pratica L/U/T si risolvono in 1-2 livelli.
 */
function _decomposeConcave(pts, depth) {
  if (depth === undefined) depth = 0;
  if (depth > 3 || !_isConcavePolygon(pts)) return [pts];
  const parts = _splitConcavePolygon(pts);
  if (parts.length === 1) return [pts];
  const result = [];
  for (const part of parts) {
    result.push(..._decomposeConcave(part, depth + 1));
  }
  return result;
}

// ── Collision helpers (merge multi-area) ─────────────────────────────────────

const _OVERLAP_EPS = 1e-3; // tolleranza px per micro-gap su bordi condivisi

/**
 * Overlap AABB in coordinate U-V mondiali (frame ruotato condiviso).
 *
 * Bug originale: _localRectsOverlap usava localU/localV che sono relative
 * all'origine di griglia di OGNI sotto-area → confronto tra sistemi diversi
 * → falsi positivi → pannelli del secondo braccio (L/U-shape) scartati.
 *
 * Fix: proietta l'origine mondiale (x, y) sul frame ruotato condiviso usando
 * axisU/axisV del pannello. Tutti i pannelli emessi con lo stesso ang (via
 * forcedAng) condividono gli stessi assi → confronto corretto.
 */
function _worldRectsOverlap(a, b) {
  // axisUx = cos(ang), axisUy = sin(ang)  [da layoutSingleArea → runGlobalGrid]
  // Usa gli assi di `a` per proiettare entrambi — valido perché tutti i pannelli
  // emessi da layoutConcaveArea condividono lo stesso forcedAng (stesso float IEEE 754).
  // Se per qualsiasi motivo gli angoli differissero, usa a come riferimento comunque:
  // è il caso degenere meno peggiore (confronto approssimato > confronto su sistemi diversi).
  const cos = a.axisUx, sin = a.axisUy;
  const uA = a.x * cos + a.y * sin,  vA = -a.x * sin + a.y * cos;
  const uB = b.x * cos + b.y * sin,  vB = -b.x * sin + b.y * cos;
  return !(uA + a.w <= uB + _OVERLAP_EPS ||
           uB + b.w <= uA + _OVERLAP_EPS ||
           vA + a.h <= vB + _OVERLAP_EPS ||
           vB + b.h <= vA + _OVERLAP_EPS);
}

/** True se p si sovrappone fisicamente a qualsiasi pannello in occupied. */
function _occupiedConflict(p, occupied) {
  return occupied.some(o => _worldRectsOverlap(p, o));
}

// ── exactCount cache ──────────────────────────────────────────────────────────

const _exactCountCache = new Map();
const _EXACT_COUNT_MAX = 5000;

/**
 * Hash deterministico di un poligono — veloce, niente JSON.stringify.
 * Moltiplicatore 31 standard, coordinate arrotondate a 1/1000 px.
 */
function _polyHash(pts) {
  let h = 0;
  for (let i = 0; i < pts.length; i++) {
    h = (h * 31 + (Math.round(pts[i].x * 1000) | 0)) | 0;
    h = (h * 31 + (Math.round(pts[i].y * 1000) | 0)) | 0;
  }
  return h;
}

/**
 * exactCount con caching.
 * Chiave: hash(area) | ang | mW | mH | walkRowInt | walkColInt | scale
 * NON include offset griglia (probe X/Y) — solo parametri strutturali.
 */
function _exactCountCached(pts, ang, mWPx, mHPx, stepW, stepH, walkRowInt, walkColInt) {
  // Calcola (o riusa) hash area
  const h = _polyHash(pts);
  const key = `${h}|${ang.toFixed(4)}|${mWPx.toFixed(2)}|${mHPx.toFixed(2)}|${stepW.toFixed(2)}|${stepH.toFixed(2)}|${walkRowInt}|${walkColInt}`;
  if (_exactCountCache.has(key)) return _exactCountCache.get(key);

  // Computo effettivo
  const lp = transformPolygon(pts, ang), ab = polyAABB(lp);
  const cW = ab.maxX - ab.minX, cH = ab.maxY - ab.minY;
  const cols = cW >= mWPx ? Math.floor((cW - mWPx) / stepW) + 1 : 0;
  const rows = cH >= mHPx ? Math.floor((cH - mHPx) / stepH) + 1 : 0;
  let cnt = 0;
  if (cols > 0 && rows > 0) {
    const ox_ = ab.minX + Math.max(0, (cW - ((cols-1)*stepW + mWPx)) / 2);
    const oy_ = ab.minY + Math.max(0, (cH - ((rows-1)*stepH + mHPx)) / 2);
    const E = 1e-4;
    for (let r = 0; r < rows; r++) {
      if (walkRowInt < 999999 && walkRowInt > 0 && r > 0 && r % walkRowInt === 0) continue;
      const ly = oy_ + r * stepH;
      for (let c = 0; c < cols; c++) {
        if (walkColInt < 999999 && walkColInt > 0 && c > 0 && c % walkColInt === 0) continue;
        const lx = ox_ + c * stepW;
        const corners = [{x:lx+E,y:ly+E},{x:lx+mWPx-E,y:ly+E},{x:lx+mWPx-E,y:ly+mHPx-E},{x:lx+E,y:ly+mHPx-E}];
        if (corners.every(pt => pointInPolygon(pt, lp, ab))) cnt++;
      }
    }
  }

  // Evita crescita infinita — reset semplice senza LRU
  if (_exactCountCache.size >= _EXACT_COUNT_MAX) _exactCountCache.clear();
  _exactCountCache.set(key, cnt);
  return cnt;
}

// ── _computeBestAngle ─────────────────────────────────────────────────────────

/**
 * Calcola l'angolo ottimale per il layout di un'area dato un modulo mW×mH.
 * Usa _exactCountCached → ricalcoli zero su chiamate ripetute (orientP vs orientL,
 * split concavo, preview, ecc.).
 */
function _computeBestAngle(area, mW, mH) {
  const gap = Math.max(0, parseFloat(DOM.ps ? DOM.ps.value : 0) || 0) / 100;
  const mWPx = mW * scale, mHPx = mH * scale, gapPx = gap * scale;
  const stepW = mWPx + gapPx, stepH = mHPx + gapPx;
  const { walkRowInt, walkColInt } = readLayoutParams(area);

  // Logica originale: angoli candidati derivati dai bordi del poligono + perpendicolari.
  // Per triangoli questo produce l'angolo del lato più lungo (= base), come richiesto
  // dall'approccio ingegneristico (pannelli allineati con gronda/colmo del tetto).
  const angSet = new Set([0]);
  for (let i = 0; i < area.points.length; i++) {
    const j = (i+1) % area.points.length;
    const dx = area.points[j].x - area.points[i].x, dy = area.points[j].y - area.points[i].y;
    if (Math.sqrt(dx*dx+dy*dy) < 1e-6) continue;
    let a = Math.atan2(dy, dx);
    while (a >  Math.PI/2) a -= Math.PI;
    while (a < -Math.PI/2) a += Math.PI;
    const aRad = Math.round(a*360/Math.PI)/360 * Math.PI;
    let perpRad = aRad + Math.PI/2;
    if (perpRad >  Math.PI/2) perpRad -= Math.PI;
    if (perpRad < -Math.PI/2) perpRad += Math.PI;
    angSet.add(aRad); angSet.add(perpRad);
  }

  // quickCount: O(N) — filtra candidati senza check pixel
  function quickCount(ang) {
    const cos=Math.cos(-ang), sin=Math.sin(-ang);
    let mnX=Infinity,mxX=-Infinity,mnY=Infinity,mxY=-Infinity;
    for (const p of area.points) {
      const rx=p.x*cos-p.y*sin, ry=p.x*sin+p.y*cos;
      if(rx<mnX)mnX=rx; if(rx>mxX)mxX=rx; if(ry<mnY)mnY=ry; if(ry>mxY)mxY=ry;
    }
    const cW=mxX-mnX, cH=mxY-mnY;
    return (cW>=mWPx?Math.floor((cW-mWPx)/stepW)+1:0)*(cH>=mHPx?Math.floor((cH-mHPx)/stepH)+1:0);
  }

  const sorted = [...angSet].sort((a,b) => quickCount(b) - quickCount(a));
  // Evaluta TUTTI i candidati — _exactCountCached rende questo O(1) dopo il primo calcolo.
  // Il filtro top-5 era dannoso per forme sottili/ruotate: _quickCount sovrastima l'AABB
  // e l'angolo corretto veniva escluso prima che _exactCountCached potesse valutarlo.
  const top = sorted;
  let bestAng = 0, bestCnt = -1;
  for (const a of top) {
    // usa versione cached — hit immediato se stessa area/angolo già valutati
    const cnt = _exactCountCached(area.points, a, mWPx, mHPx, stepW, stepH, 999999, 999999);
    if (cnt > bestCnt || (cnt === bestCnt && Math.abs(a) < Math.abs(bestAng))) {
      bestCnt = cnt; bestAng = a;
    }
  }
  return bestAng;
}

// ── layoutSingleArea ─────────────────────────────────────────────────────────

/**
 * Calcola il layout ottimale dei pannelli per una singola area installabile.
 * @param {Object} area - area con points[]
 * @param {number} areaIdx - indice dell'area
 * @param {number} mW - larghezza modulo (m)
 * @param {number} mH - altezza modulo (m)
 * @param {number} maxCount - max pannelli da piazzare
 * @param {number|null} forcedAng - angolo imposto (null = calcola automatico)
 * @returns {Array} pannelli posizionati
 */

// ── _panelWorldAABB ───────────────────────────────────────────────────────────
/**
 * Calcola il bounding-box in coordinate MONDO di un pannello dato il suo
 * angolo di rotazione. Usato da canPlacePanel per il check overlap tra
 * pannelli con angoli diversi (frame locali non comparabili direttamente).
 *
 * @param {number} lu  - coordinata U locale (angolo sup-sin)
 * @param {number} lv  - coordinata V locale
 * @param {number} w   - larghezza (pixel)
 * @param {number} h   - altezza (pixel)
 * @param {number} ang - angolo di rotazione (rad)
 */
function _panelWorldAABB(lu, lv, w, h, ang) {
  const cos = Math.cos(ang), sin = Math.sin(ang);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const [u, v] of [[lu, lv], [lu + w, lv], [lu + w, lv + h], [lu, lv + h]]) {
    const wx = u * cos - v * sin, wy = u * sin + v * cos;
    if (wx < minX) minX = wx;  if (wx > maxX) maxX = wx;
    if (wy < minY) minY = wy;  if (wy > maxY) maxY = wy;
  }
  return { minX, maxX, minY, maxY };
}

// ── canPlacePanel ─────────────────────────────────────────────────────────────
/**
 * Funzione UNICA di validazione piazzamento pannello.
 * Usata sia dal layout automatico (layoutSingleArea) sia dallo snap manuale
 * (_snapPanelToGridImpl). Stessa regola, zero incoerenze tra le due modalità.
 *
 * @param {number} lx   - X angolo sup-sin in coordinate locali (pixel)
 * @param {number} ly   - Y angolo sup-sin in coordinate locali (pixel)
 * @param {number} mWPx - larghezza pannello (pixel)
 * @param {number} mHPx - altezza pannello (pixel)
 * @param {object} ctx  - contesto di validazione:
 *   .localInset         {Array}   poligono area ristretto del margine (coord locali)
 *   .localInsetAABB     {object}  AABB di localInset
 *   .localPoly          {Array}   poligono area originale (coord locali)
 *   .localPolyAABB      {object}  AABB di localPoly
 *   .localExcl          {Array}   [opz] ostacoli buffered in coord locali
 *   .localExclAABB      {Array}   [opz] AABB corrispondenti
 *   .useEdgeMarginCheck {boolean} usa check distanza bordo (fallback concavo)
 *   .localAreaEdges     {Array}   [opz] lati area per edge-margin check
 *   .marginPx           {number}  margine in pixel
 *   .otherPanels        {Array}   [opz] altri pannelli [{localU,localV,w,h,ang}]
 *   .panelAng           {number}  [opz] angolo del pannello da piazzare (per P2)
 * @returns {boolean} true = posizione valida
 */
function canPlacePanel(lx, ly, mWPx, mHPx, ctx) {
  const EPS = 1e-4;
  const cx = lx + mWPx / 2, cy = ly + mHPx / 2;

  // 1. Centro dentro localInset — early exit rapido (necessario ma non sufficiente)
  if (!pointInPolygon({ x: cx, y: cy }, ctx.localInset, ctx.localInsetAABB)) return false;

  // 2. Tutti i corners dentro localInset — garantisce che l'INTERA superficie del pannello
  //    rispetti il margine di sicurezza su ogni lato. [FIX P1]
  //    Ragionamento: localInset = area.points ristretto di marginPx su ogni lato.
  //    → corner dentro localInset ⟹ corner a distanza ≥ marginPx da ogni bordo area.
  //    Caso marginPx=0 o fallback concavo: localInset = localPoly → check ridotto a containment.
  const corners = [
    { x: lx + EPS,        y: ly + EPS },
    { x: lx + mWPx - EPS, y: ly + EPS },
    { x: lx + mWPx - EPS, y: ly + mHPx - EPS },
    { x: lx + EPS,        y: ly + mHPx - EPS }
  ];
  if (!corners.every(pt => pointInPolygon(pt, ctx.localInset, ctx.localInsetAABB))) return false;
  const panelEdges = [
    [corners[0], corners[1]], [corners[1], corners[2]],
    [corners[2], corners[3]], [corners[3], corners[0]]
  ];

  for (const [pe0, pe1] of panelEdges) {
    for (let i = 0; i < ctx.localInset.length; i++) {
      const ie0 = ctx.localInset[i];
      const ie1 = ctx.localInset[(i + 1) % ctx.localInset.length];
      if (_segsIntersect(pe0, pe1, ie0, ie1)) return false;
    }
  }

  // 3. Check distanza bordo — fallback per aree concave dove offsetPolygon non ha retto
  if (ctx.useEdgeMarginCheck && ctx.localAreaEdges && ctx.marginPx > 0) {
    for (const corner of corners)
      for (const [ea, eb] of ctx.localAreaEdges)
        if (distanceToSegment(corner, ea, eb) < ctx.marginPx) return false;
  }

  // 4. No overlap con ostacoli tecnici (check geometrico completo: punti + spigoli)
  const excl     = ctx.localExcl     || [];
  const exclAABB = ctx.localExclAABB || [];
  if (excl.length > 0) {
    const panelAABB_ = { minX: lx, maxX: lx + mWPx, minY: ly, maxY: ly + mHPx };
    for (let oi = 0; oi < excl.length; oi++) {
      const obs = excl[oi];
      const obb = exclAABB[oi] || polyAABB(obs);
      if (lx + mWPx < obb.minX || lx > obb.maxX || ly + mHPx < obb.minY || ly > obb.maxY) continue;
      if (corners.some(pt => pointInPolygon(pt, obs, obb)))         return false;
      if (obs.some(pt   => pointInPolygon(pt, corners, panelAABB_))) return false;
      for (const [pe0, pe1] of panelEdges)
        for (let i = 0; i < obs.length; i++)
          if (_segsIntersect(pe0, pe1, obs[i], obs[(i + 1) % obs.length])) return false;
    }
  }

  // 5. No overlap con altri pannelli [FIX P2]
  //    Pannelli stesso angolo → AABB in frame locale (fast, esatto).
  //    Pannelli angolo diverso → world-space AABB (layoutConcaveArea può produrre
  //    pannelli della stessa area con ang diversi; i loro localU/V non sono nello
  //    stesso sistema di coordinate → confronto diretto sarebbe sbagliato).
  const others = ctx.otherPanels;
  if (others && others.length > 0) {
    const GAP_TOL  = 0.5; // tolleranza mezzo pixel per floating point
    const panelAng = ctx.panelAng;  // angolo del pannello da piazzare (undefined in auto-layout)
    let candidateWAABB = null;      // calcolato lazy solo se serve
    for (const other of others) {
      const sameFrame = (panelAng == null || other.ang == null ||
                         Math.abs(other.ang - panelAng) < 1e-6);
      if (sameFrame) {
        // Stesso frame locale: AABB check diretto
        if (lx + mWPx <= other.localU + GAP_TOL ||
            other.localU + other.w <= lx + GAP_TOL ||
            ly + mHPx <= other.localV + GAP_TOL ||
            other.localV + other.h <= ly + GAP_TOL) continue;
      } else {
        // Frame diverso: confronto in coordinate mondo (bounding-box conservativo)
        if (!candidateWAABB)
          candidateWAABB = _panelWorldAABB(lx, ly, mWPx, mHPx, panelAng);
        const ow = _panelWorldAABB(other.localU, other.localV, other.w, other.h, other.ang);
        if (candidateWAABB.maxX <= ow.minX + GAP_TOL ||
            ow.maxX <= candidateWAABB.minX + GAP_TOL ||
            candidateWAABB.maxY <= ow.minY + GAP_TOL ||
            ow.maxY <= candidateWAABB.minY + GAP_TOL) continue;
      }
      return false; // overlap trovato
    }
  }

  return true;
}

function layoutSingleArea(area, areaIdx, mW, mH, maxCount, forcedAng = null) {
  const { gap, pwr, margin, obstDist, stagger, staggerPct, walkRowInt, walkRowWidth, walkColInt, walkColWidth } = readLayoutParams(area);
  if (mW <= 0 || mH <= 0 || isNaN(mW) || isNaN(mH)) return [];
  const mWPx = mW * scale, mHPx = mH * scale, gapPx = gap * scale;
  const marginPx = margin * scale, obstDistPx = obstDist * scale;
  const stepW = mWPx + gapPx, stepH = mHPx + gapPx;
  const walkRowWidthPx = walkRowWidth * scale;
  const walkColWidthPx = walkColWidth * scale;

  // ── Fase 0: angolo — usa forcedAng se presente, altrimenti calcola ──────
  // forcedAng viene passato dalle sotto-aree in layoutConcaveArea per garantire
  // coerenza visiva (tutti i pannelli dello stesso angolo su L/U/T-shape).
  // Logica originale: angoli candidati derivati dai bordi del poligono + perpendicolari.
  const _angSet = new Set([0]);
  for (let i = 0; i < area.points.length; i++) {
    const j = (i + 1) % area.points.length;
    const dx = area.points[j].x - area.points[i].x, dy = area.points[j].y - area.points[i].y;
    if (Math.sqrt(dx*dx+dy*dy) < 1e-6) continue;
    let a = Math.atan2(dy, dx);
    while (a >  Math.PI/2) a -= Math.PI;
    while (a < -Math.PI/2) a += Math.PI;
    // Arrotonda a 0.5° per evitare near-duplicates
    const aRad = Math.round(a*360/Math.PI)/360 * Math.PI;
    let perpRad = aRad + Math.PI/2;
    if (perpRad >  Math.PI/2) perpRad -= Math.PI;
    if (perpRad < -Math.PI/2) perpRad += Math.PI;
    _angSet.add(aRad);
    _angSet.add(perpRad);
  }
  // Stima rapida O(N): prodotto cols×rows nel bounding box ruotato
  function _quickCount(ang) {
    const cos=Math.cos(-ang), sin=Math.sin(-ang);
    let mnX=Infinity,mxX=-Infinity,mnY=Infinity,mxY=-Infinity;
    for (const p of area.points) {
      const rx=p.x*cos-p.y*sin, ry=p.x*sin+p.y*cos;
      if(rx<mnX)mnX=rx; if(rx>mxX)mxX=rx; if(ry<mnY)mnY=ry; if(ry>mxY)mxY=ry;
    }
    const cW=mxX-mnX, cH=mxY-mnY;
    return (cW>=mWPx?Math.floor((cW-mWPx)/stepW)+1:0)*(cH>=mHPx?Math.floor((cH-mHPx)/stepH)+1:0);
  }
  // Se forcedAng è fornito (da layoutConcaveArea), lo usa direttamente senza calcolo
  let bestAng;
  if (forcedAng !== null) {
    bestAng = forcedAng;
  } else if (area.points.length === 3) {
    // TRIANGOLI: usa selezione MBR span-based (come originale verisone corretta.html).
    // Indipendente dalle dimensioni del modulo → stesso angolo per P e L →
    // tie-break in _layoutBestOrientation favorisce portrait correttamente.
    // Sceglie l'angolo che massimizza lo span X (= base del triangolo).
    const _spanX = (ang) => {
      const cos = Math.cos(-ang), sin = Math.sin(-ang);
      let mn = Infinity, mx = -Infinity;
      for (const p of area.points) {
        const rx = p.x * cos - p.y * sin;
        if (rx < mn) mn = rx;
        if (rx > mx) mx = rx;
      }
      return mx - mn;
    };
    bestAng = 0; let _bestSpan = -1;
    for (const a of _angSet) {
      const s = _spanX(a);
      if (s > _bestSpan) { _bestSpan = s; bestAng = a; }
    }
  } else {
    const _sortedCands=[..._angSet].sort((a,b)=>_quickCount(b)-_quickCount(a));
    // Evaluta tutti — _exactCountCached è O(1) dopo il primo hit, top-5 era il bug.
    bestAng=0; let _bestCnt=-1;
    for(const a of _sortedCands){
      // Usa versione cached — hit immediato se già calcolato da _computeBestAngle
      const cnt=_exactCountCached(area.points, a, mWPx, mHPx, stepW, stepH, 999999, 999999);
      if(cnt>_bestCnt||(cnt===_bestCnt&&Math.abs(a)<Math.abs(bestAng))){_bestCnt=cnt;bestAng=a;}
    }
  }

  // ── Swap walkway direction when U axis is more vertical than horizontal ──
  // When bestAng ≈ 90°: U points down (screen-vertical), V points left (screen-horizontal).
  // In that case walkColInt (Camm.V) would create horizontal stripes and walkRowInt (Camm.H)
  // vertical stripes — the opposite of what the user expects.
  // Fix: remap _wColInt↔_wRowInt so Camm.V ALWAYS produces visual vertical stripes.
  const _uIsHoriz = Math.abs(Math.cos(bestAng)) >= Math.abs(Math.sin(bestAng));
  const _wColInt  = _uIsHoriz ? walkColInt     : walkRowInt;
  const _wColWPx  = _uIsHoriz ? walkColWidthPx : walkRowWidthPx;
  const _wRowInt  = _uIsHoriz ? walkRowInt     : walkColInt;
  const _wRowWPx  = _uIsHoriz ? walkRowWidthPx : walkColWidthPx;

  // ── Fase 1: geometrie offset pre-calcolate ───────────────────────────────
  // 1a. Inset area installabile di marginPx → area utile reale.
  // offsetPolygon garantisce margine costante (in px) su ogni lato — corretto
  // per sicurezza reale. Se genera un poligono auto-intersecante (aree molto
  // strette o concave), fallback al check distanza bordo per pannello.
  let insetWorldPts, useEdgeMarginCheck = false;
  if (marginPx > 0) {
    const _cand = offsetPolygon(area.points, -marginPx);
    if (_isValidPoly(_cand) && !_isSelfIntersecting(_cand)) {
      insetWorldPts = _cand;
    } else {
      insetWorldPts = area.points.map(p=>({...p}));
      useEdgeMarginCheck = true;
    }
  } else {
    insetWorldPts = area.points.map(p=>({...p}));
  }
  if (!_isValidPoly(insetWorldPts)) return [];
  const localInset = transformPolygon(insetWorldPts, bestAng);
  const localInsetAABB = polyAABB(localInset);
  // Poligono originale (NON inset) in coord locali — usato per check corners
  // Serve per garantire che i bordi del pannello non sforino fuori dall'area reale.
  // Il centro viene validato contro localInset (margine ok), i corners contro localPoly (contenimento).
  const localPoly    = transformPolygon(area.points, bestAng);
  const localPolyAABB = polyAABB(localPoly);
  // Lati area (coord locali) per check distanza bordo — solo se fallback concavo
  const localAreaEdges = (useEdgeMarginCheck && marginPx > 0) ? (() => {
    return localPoly.map((_,i,arr)=>[arr[i], arr[(i+1)%arr.length]]);
  })() : null;

  // 1b. Buffer ostacoli di obstDistPx → zone vietate reali
  const obstacleDist_ = obstDist;
  const _areaAABB = polyAABB(area.points);
  const relevantExclRaw = [
    ...exclusionAreas.map(a => a.points),
    ...technicalObjects.filter(obj => {
      let effectiveR;
      if (obj.type === 'chimney' && scale > 1 && obj.heightM) {
        const shadowR_ = obj.heightM * scale / Math.tan((obj.solarAngleDeg || 30) * Math.PI / 180);
        effectiveR = Math.max(shadowR_, obj.sizePx / 2 + obstacleDist_ * scale);
      } else {
        effectiveR = obj.sizePx / 2 + obstacleDist_ * scale + (obj.bufferM || 0) * scale;
      }
      if (pointInPolygon(obj, area.points, _areaAABB)) return true;
      if (area.points.some(p => Math.hypot(p.x - obj.x, p.y - obj.y) < effectiveR)) return true;
      const poly = techObjectToPolygon(obj);
      if (poly.some(p => pointInPolygon(p, area.points, _areaAABB))) return true;
      const nA = area.points.length;
      for (let ei = 0; ei < nA; ei++) {
        if (distanceToSegment(obj, area.points[ei], area.points[(ei + 1) % nA]) < effectiveR) return true;
      }
      return false;
    }).map(obj => techObjectToPolygon(obj))
  ];
  // Espandi ogni ostacolo di obstDistPx
  const bufferedExclWorld = obstDistPx > 0
    ? relevantExclRaw.map(pts => offsetPolygon(pts, obstDistPx))
    : relevantExclRaw.map(pts => pts.map(p => ({ ...p })));
  const localBufExcl = bufferedExclWorld.map(pts => transformPolygon(pts, bestAng));
  const localBufExclAABB = localBufExcl.map(obs => polyAABB(obs));

  // ── Fase 2: Bounding box e centratura esatta ─────────────────────────────
  const _spanX = c => {
    const wk = (_wColInt < 999999 && _wColInt > 0) ? Math.floor(c / _wColInt) : 0;
    return c * stepW + wk * _wColWPx;
  };
  const _spanY = r => {
    const wk = (_wRowInt < 999999 && _wRowInt > 0) ? Math.floor(r / _wRowInt) : 0;
    return r * stepH + wk * _wRowWPx;
  };

  // Bug fix: la cacheKey originale usava solo areaIdx+mW+mH.
  // layoutConcaveArea chiama layoutSingleArea con sub-poligoni diversi ma stesso areaIdx
  // → la seconda chiamata (braccio secondario) colpisce la cache della prima (braccio dominante)
  // → ritorna i pannelli del braccio sbagliato, braccio secondario sempre vuoto.
  // Fix: aggiungere bestAng + hash del poligono reale (area.points, non installableAreas[idx]).
  const _subPolyHash = _polyHash(area.points);
  // Contesto di validazione — dichiarato al livello di layoutSingleArea così che
  // runGlobalGrid (closure di questo scope) possa accedervi senza ReferenceError.
  // Tutte le dipendenze (localInset, localPoly, localBufExcl, …) sono già calcolate sopra.
  const _placeCtx = {
    localInset, localInsetAABB,
    localPoly,  localPolyAABB,
    localExcl: localBufExcl, localExclAABB: localBufExclAABB,
    useEdgeMarginCheck, localAreaEdges, marginPx,
    otherPanels: null   // auto-layout: griglia allineata → no overlap tra pannelli
  };

  const cacheKey = _layoutCacheKey(areaIdx, mW, mH) + `|ang:${bestAng.toFixed(5)}|ph:${_subPolyHash}`;
  if (!_layoutCache.has(cacheKey)) {
    const aabbW = localInsetAABB.maxX - localInsetAABB.minX;
    const aabbH = localInsetAABB.maxY - localInsetAABB.minY;

    let cols_max = aabbW >= mWPx ? Math.floor((aabbW - mWPx) / stepW) + 1 : 0;
    while (cols_max > 1 && _spanX(cols_max - 1) + mWPx > aabbW + 1e-6) cols_max--;

    let rows_max = aabbH >= mHPx ? Math.floor((aabbH - mHPx) / stepH) + 1 : 0;
    while (rows_max > 1 && _spanY(rows_max - 1) + mHPx > aabbH + 1e-6) rows_max--;

    const originX = localInsetAABB.minX;
    const originY = localInsetAABB.minY;

    let fullResult = [];
    const _isTriangle = area.points.length === 3;

    if (_isTriangle) {
      // ── TRIANGOLI: scanline per-level (algoritmo portato dall'originale) ─
      // Usa localPoly (triangolo originale trasformato, NON inset) per evitare
      // che offsetPolygon deformi la punta dell'apice. marginPx viene applicato
      // come threshold sui segmenti X e sui limiti Y.
      // Sweep offset: parte da minX+marginPx, minY+marginPx + shifts (NO wrap
      // modulo step), identico all'originale runLayout.
      const _triPoly = transformPolygon(area.points, bestAng);
      const _triPolyAABB = polyAABB(_triPoly);
      const _minLX = _triPolyAABB.minX;
      const _minLY = _triPolyAABB.minY;

      const N_X = CONFIG.GRID_SUBDIV_X || 8;
      const N_Y = CONFIG.GRID_SUBDIV_Y || 8;
      for (let yi = 0; yi < N_Y; yi++) {
        const yShift = (stepH / N_Y) * yi;
        for (let xi = 0; xi < N_X; xi++) {
          const xShift = (stepW / N_X) * xi;
          const startY       = _minLY + marginPx + yShift;
          const gridOriginX  = _minLX + marginPx + xShift;
          const r = runScanlineTriangle(gridOriginX, startY, bestAng,
                                        _triPoly, _triPolyAABB,
                                        localBufExcl, localBufExclAABB, localAreaEdges);
          if (r.length > fullResult.length) fullResult = r;
        }
      }
    } else {
      // Passaggio sequenziale deterministico da (minX, minY):
      // sinistra→destra, alto→basso. Predittibile come posa reale.
      // Può dare 1-3 pannelli in meno su forme molto irregolari rispetto
      // alla vecchia ricerca coarse+refine, ma è il comportamento corretto.
      fullResult = runGlobalGrid(originX, originY, cols_max + 1, rows_max + 2, 0,
                                  localInsetAABB.minY, localInsetAABB.maxY);
    }
    _layoutCache.set(cacheKey, fullResult);
  }
  const cached = _layoutCache.get(cacheKey);
  if (maxCount >= cached.length) return cached;

  // Fill sequenziale: riga locale 0→N (top→bottom nel frame ruotato,
  // che parte da originY=minY), colonna 0→M (sinistra→destra).
  // Produce blocchi rettangolari puliti senza rimescolamento diagonale.
  const sorted = cached.slice().sort((a, b) =>
    a.row !== b.row ? a.row - b.row : a.column - b.column
  );
  return sorted.slice(0, maxCount);

  /**
   * Griglia globale deterministica — architettura "foglio di calcolo":
   *  1. Genera TUTTE le coordinate (row, col) che rientrano nell'AABB dell'inset
   *  2. Per ogni cella calcola la posizione reale tenendo conto dei camminamenti
   *  3. Filtra ogni cella per intersezione geometrica pura
   *  4. Emette solo le celle valide → pannelli
   */
  function runGlobalGrid(originX, originY, cols_max, rows_max, rowOffset, bandMin, bandMax) {
    if (rowOffset === undefined) rowOffset = 0;
    if (bandMin === undefined) bandMin = -Infinity;
    if (bandMax === undefined) bandMax =  Infinity;
    const result = [];
    const cos = Math.cos(bestAng), sin = Math.sin(bestAng);
    const EPS = 1e-4;
    const yMin = Math.max(bandMin === -Infinity ? localInsetAABB.minY : bandMin, localInsetAABB.minY);
    const yMax = Math.min(bandMax ===  Infinity ? localInsetAABB.maxY : bandMax, localInsetAABB.maxY);
    const maxRows = rows_max + 1;
    const maxCols = cols_max + 1;

    for (let row = 0; row < maxRows; row++) {
      const globalRow = row + rowOffset;
      const walkRowsBefore = (_wRowInt < 999999 && _wRowInt > 0)
        ? Math.floor(row / _wRowInt) : 0;
      const ly = originY + row * stepH + walkRowsBefore * _wRowWPx;

      if (ly > yMax - mHPx + EPS) break;
      if (ly + mHPx < yMin - EPS) continue;

      const rowStagger = stagger && (globalRow % 2 === 1) ? stepW * staggerPct : 0;

      // ── STEP 1: trova il primo col valido per questa riga ──────────────────
      // L'area utile (dopo offsetPolygon) può iniziare a destra di originX
      // su righe inclinate o con margine: scan forward finché non troviamo
      // un centro dentro il poligono inset E tutti i corners dentro l'area originale.
      let firstValidCol = null;
      for (let sc = 0; sc < maxCols; sc++) {
        const wkc = (_wColInt < 999999 && _wColInt > 0 && sc >= 0) ? Math.floor(sc / _wColInt) : 0;
        const slx = originX + sc * stepW + wkc * _wColWPx + rowStagger;
        if (slx > localPolyAABB.maxX + EPS) break;
        const scy = ly + mHPx / 2;
        // Centro dentro l'inset (margine ok) + tutti i corners dentro il poligono originale
        if (pointInPolygon({ x: slx + mWPx / 2, y: scy }, localInset, localInsetAABB)) {
          const sc0 = { x: slx + EPS,        y: ly + EPS };
          const sc1 = { x: slx + mWPx - EPS, y: ly + EPS };
          const sc2 = { x: slx + mWPx - EPS, y: ly + mHPx - EPS };
          const sc3 = { x: slx + EPS,        y: ly + mHPx - EPS };
          if (pointInPolygon(sc0, localPoly, localPolyAABB) &&
              pointInPolygon(sc1, localPoly, localPolyAABB) &&
              pointInPolygon(sc2, localPoly, localPolyAABB) &&
              pointInPolygon(sc3, localPoly, localPolyAABB)) {
            firstValidCol = sc;
            break;
          }
        }
      }
      if (firstValidCol === null) continue; // riga completamente fuori

      // ── STEP 2: riempi da firstValidCol — break appena esce dal poligono ──
      // break su uscita dal poligono (poligono convesso → region contigua);
      // continue se canPlacePanel fallisce (ostacolo, corner fuori, margin — ma la riga prosegue).
      for (let col = firstValidCol; col < maxCols; col++) {
        const walkColsBefore = (_wColInt < 999999 && _wColInt > 0 && col >= 0)
          ? Math.floor(col / _wColInt) : 0;
        const lx = originX + col * stepW + walkColsBefore * _wColWPx + rowStagger;

        if (lx > localPolyAABB.maxX + EPS) break;

        const cx = lx + mWPx / 2, cy = ly + mHPx / 2;

        // Early exit: centro uscito dall'inset → fine della fascia valida su questa riga.
        // (Ottimizzazione per aree convesse: la regione valida è contigua.)
        if (!pointInPolygon({ x: cx, y: cy }, localInset, localInsetAABB)) break;

        // Validazione completa tramite canPlacePanel — regola unica, identica allo snap manuale.
        if (!canPlacePanel(lx, ly, mWPx, mHPx, _placeCtx)) continue;

        const origin = localToGlobal(lx, ly, bestAng);
        result.push({
          x: origin.x, y: origin.y, w: mWPx, h: mHPx,
          wm: mW, hm: mH, pwr: pwr, ang: bestAng,
          localU: lx, localV: ly,
          axisUx: cos, axisUy: sin, axisVx: -sin, axisVy: cos,
          areaIdx: areaIdx, row: globalRow, column: col,
          strId: null, stringColor: null
        });
      }
    }
    return result;
  }

  /**
   * Scanline per-level (porta dell'algoritmo originale, solo per TRIANGOLI).
   * Accetta ang + geometrie come parametri per permettere di testare entrambi
   * gli angoli {0, π/2} senza dipendere dal bestAng pre-scelto da _computeBestAngle.
   */
  function runScanlineTriangle(gridOriginX, startY, _ang, _poly, _polyAABB, _bufExcl, _bufExclAABB, _areaEdges) {
    const result = [];
    const cos = Math.cos(_ang), sin = Math.sin(_ang);
    const EPS = 1e-4;
    let row = 0;
    let ly = startY;
    const _yLimit = _polyAABB.maxY - marginPx;

    while (ly + mHPx <= _yLimit + EPS) {
      // ── Camminamento orizzontale tra righe (se attivo) ─────────────────
      if (_wRowInt < 999999 && _wRowInt > 0 && row > 0 && row % _wRowInt === 0) {
        ly += _wRowWPx;
        if (ly + mHPx > _yLimit + EPS) break;
      }
      const rowStagger = stagger && (row % 2 === 1) ? stepW * staggerPct : 0;

      // ── Scanline per-level (9 campioni Y robusti) ──────────────────────
      const NSCAN = 9;
      const perLevel = [];
      for (let fi = 0; fi < NSCAN; fi++) {
        const t = fi / (NSCAN - 1);
        const ys = ly + mHPx * t + EPS * (fi % 2 === 0 ? 1 : -1);
        const xs = scanlineX(_poly, ys);
        xs.sort((a, b) => a - b);
        perLevel.push(xs);
      }
      const cntFreq = {};
      perLevel.forEach(xs => { const n = xs.length; cntFreq[n] = (cntFreq[n] || 0) + 1; });
      const targetN = parseInt(Object.entries(cntFreq).sort((a, b) => b[1] - a[1])[0][0]);
      if (targetN < 2) { ly += stepH; row++; continue; }
      const validLevels = perLevel.filter(xs => xs.length === targetN);
      const avgXs = [];
      for (let i = 0; i < targetN; i++) {
        avgXs.push(validLevels.reduce((s, xs) => s + xs[i], 0) / validLevels.length);
      }
      if (avgXs.length % 2 !== 0) avgXs.pop();
      if (avgXs.length < 2) { ly += stepH; row++; continue; }
      // Fondi segmenti adiacenti con gap < mWPx
      const segXs = [];
      for (let si = 0; si + 1 < avgXs.length; si += 2) {
        const left = avgXs[si], right = avgXs[si + 1];
        if (segXs.length >= 2 && left - segXs[segXs.length - 1] < mWPx) {
          segXs[segXs.length - 1] = right;
        } else {
          segXs.push(left, right);
        }
      }
      if (segXs.length < 2) { ly += stepH; row++; continue; }

      // ── Per ogni segmento, piazza pannelli snap al grid globale ────────
      // Applica marginPx come threshold sui bordi X del segmento (come originale)
      for (let si = 0; si + 1 < segXs.length; si += 2) {
        const segMinX = segXs[si] + marginPx;
        const segMaxX = segXs[si + 1] - marginPx;
        if (segMinX + mWPx > segMaxX) continue;

        const staggerShift = rowStagger;
        let lx = gridOriginX + staggerShift +
          Math.ceil((segMinX - gridOriginX - staggerShift) / stepW) * stepW;
        while (lx < segMinX - EPS) lx += stepW;
        if (lx + mWPx > segMaxX + EPS) continue;
        let col = Math.round((lx - gridOriginX - staggerShift) / stepW);

        while (lx + mWPx <= segMaxX + EPS) {
          // Camminamento verticale tra colonne
          if (_wColInt < 999999 && _wColInt > 0 && col > 0 && col % _wColInt === 0) {
            lx += _wColWPx; col++;
            if (lx + mWPx > segMaxX + EPS) break;
            continue;
          }
          const cx = lx + mWPx / 2, cy = ly + mHPx / 2;
          if (cx < _polyAABB.minX || cx > _polyAABB.maxX ||
              cy < _polyAABB.minY || cy > _polyAABB.maxY) {
            lx += stepW; col++; continue;
          }
          // Corners del pannello con piccolo inset interno (marginPx è già
          // applicato via segmenti X + yLimit — qui solo EPS per evitare
          // falsi negativi su vertici esatti del poligono).
          const cornerInset = Math.max(EPS, marginPx * 0.001);
          const corners = [
            { x: lx + cornerInset,         y: ly + cornerInset },
            { x: lx + mWPx - cornerInset,  y: ly + cornerInset },
            { x: lx + mWPx - cornerInset,  y: ly + mHPx - cornerInset },
            { x: lx + cornerInset,         y: ly + mHPx - cornerInset }
          ];
          if (!corners.every(pt => pointInPolygon(pt, _poly, _polyAABB))) {
            lx += stepW; col++; continue;
          }
          // Check distanza bordo per fallback concavo (non dovrebbe capitare su triangolo, safety)
          if (useEdgeMarginCheck && _areaEdges && marginPx > 0) {
            let tooClose = false;
            outerM: for (const corner of corners)
              for (const [ea, eb] of _areaEdges)
                if (distanceToSegment(corner, ea, eb) < marginPx) { tooClose = true; break outerM; }
            if (tooClose) { lx += stepW; col++; continue; }
          }
          // Ostacoli / exclusion buffer
          if (_bufExcl.length > 0) {
            const panelEdges = [
              [corners[0], corners[1]], [corners[1], corners[2]],
              [corners[2], corners[3]], [corners[3], corners[0]]
            ];
            const panelAABB_ = { minX: lx, maxX: lx + mWPx, minY: ly, maxY: ly + mHPx };
            let blocked = false;
            outer: for (let oi = 0; oi < _bufExcl.length; oi++) {
              const obs = _bufExcl[oi], obb = _bufExclAABB[oi];
              if (lx + mWPx < obb.minX || lx > obb.maxX ||
                  ly + mHPx < obb.minY || ly > obb.maxY) continue;
              for (const pt of corners)
                if (pointInPolygon(pt, obs, obb)) { blocked = true; break outer; }
              for (const obsPt of obs)
                if (pointInPolygon(obsPt, corners, panelAABB_)) { blocked = true; break outer; }
              for (const [pe0, pe1] of panelEdges)
                for (let i = 0; i < obs.length; i++) {
                  if (_segsIntersect(pe0, pe1, obs[i], obs[(i + 1) % obs.length])) { blocked = true; break outer; }
                }
            }
            if (blocked) { lx += stepW; col++; continue; }
          }

          const origin = localToGlobal(lx, ly, _ang);
          result.push({
            x: origin.x, y: origin.y, w: mWPx, h: mHPx,
            wm: mW, hm: mH, pwr: pwr, ang: _ang,
            localU: lx, localV: ly,
            axisUx: cos, axisUy: sin, axisVx: -sin, axisVy: cos,
            areaIdx: areaIdx, row: row, column: col,
            strId: null, stringColor: null
          });
          lx += stepW; col++;
        }
      }

      ly += stepH;
      row++;
    }
    return result;
  }
}

// ── filterIsolatedPanels ─────────────────────────────────────────────────────

/**
 * Rimuove pannelli isolati (senza vicini ortogonali nella stessa area).
 * Fix: usa solo adjacenza 4-direzionale (no diagonali) e soglia per area ≤ 5.
 */
function filterIsolatedPanels(panelList) {
  if (panelList.length <= 3) return panelList;
  const byArea = {};
  panelList.forEach((p, i) => {
    const k = p.areaIdx;
    if (!byArea[k]) byArea[k] = [];
    byArea[k].push(i);
  });
  const keep = new Set();
  // Solo 4 direzioni ortogonali — più permissivo per aree strette e triangolari
  const ORTHO = [[0,1],[0,-1],[1,0],[-1,0]];
  Object.values(byArea).forEach(indices => {
    // Aree piccole: mantieni tutti (erano già visualmente utili)
    if (indices.length <= 5) { indices.forEach(i => keep.add(i)); return; }
    const grid = new Map();
    indices.forEach(i => {
      const p = panelList[i];
      grid.set(`${p.row},${p.column}`, i);
    });
    indices.forEach(i => {
      const p = panelList[i];
      for (const [dr, dc] of ORTHO) {
        if (grid.has(`${p.row+dr},${p.column+dc}`)) { keep.add(i); return; }
      }
    });
  });
  return panelList.filter((_, i) => keep.has(i));
}

// ── layoutBestOrientation ─────────────────────────────────────────────────────

/**
 * Sceglie l'orientazione pannello migliore e ritorna il layout ottimale.
 * Usato da engineeringLayout e _relayoutArea come helper centrale.
 */
function _layoutBestOrientation(area, areaIdx, mWbase, mHbase, maxCount) {
  const aOrient = area.orientation || panelOrientation || 'auto';
  if (aOrient === 'portrait') {
    // Portrait: il lato corto (W) è orizzontale, il lato lungo (H) è verticale.
    // Forza angolo 0 per garantire pannello visivamente verticale,
    // poi prova anche gli angoli dei bordi dell'area per allineamento.
    const bestEdgeAng = _findBestEdgeAngle(area, mWbase, mHbase);
    return layoutSingleArea(area, areaIdx, mWbase, mHbase, maxCount, bestEdgeAng);
  } else if (aOrient === 'landscape') {
    // Landscape: il lato lungo (H→W) è orizzontale, il lato corto (W→H) è verticale.
    // Scambia le dimensioni E forza l'angolo coerente.
    const bestEdgeAng = _findBestEdgeAngle(area, mHbase, mWbase);
    return layoutSingleArea(area, areaIdx, mHbase, mWbase, maxCount, bestEdgeAng);
  } else {
    // Auto: usa la STESSA strategia angolo di portrait/landscape espliciti
    // (_findBestEdgeAngle, filtrata ±45°) per entrambi gli orientamenti,
    // poi sceglie quello che piazza più pannelli.
    // Prima usava layoutSingleArea senza forcedAng → angoli fuori ±45° che
    // vincevano su _exactCountCached (stima AABB) ma perdevano nel layout
    // reale con margini/ostacoli/walkways → auto < max(portrait, landscape).
    const angP = _findBestEdgeAngle(area, mWbase, mHbase);
    const angL = _findBestEdgeAngle(area, mHbase, mWbase);
    const rP = layoutSingleArea(area, areaIdx, mWbase, mHbase, maxCount, angP);
    const rL = layoutSingleArea(area, areaIdx, mHbase, mWbase, maxCount, angL);
    return rL.length > rP.length ? rL : rP;
  }
}

/**
 * Trova il miglior angolo allineato ai bordi dell'area (filtrato a ±45°).
 * Usato da tutti i modi (portrait, landscape, auto) per garantire che
 * l'angolo scelto non ruoti il pannello nella direzione opposta.
 */
function _findBestEdgeAngle(area, mW, mH) {
  const gap = Math.max(0, parseFloat(DOM.ps ? DOM.ps.value : 0) || 0) / 100;
  const mWPx = mW * scale, mHPx = mH * scale, gapPx = gap * scale;
  const stepW = mWPx + gapPx, stepH = mHPx + gapPx;

  // Raccogli angoli dai bordi dell'area (normalizzati a [-45°, +45°])
  const candidates = [0];
  for (let i = 0; i < area.points.length; i++) {
    const j = (i + 1) % area.points.length;
    const dx = area.points[j].x - area.points[i].x;
    const dy = area.points[j].y - area.points[i].y;
    if (Math.sqrt(dx * dx + dy * dy) < 1e-6) continue;
    let a = Math.atan2(dy, dx);
    // Normalizza in [-π/2, π/2]
    while (a >  Math.PI / 2) a -= Math.PI;
    while (a < -Math.PI / 2) a += Math.PI;
    // Aggiungi solo angoli vicini a 0 (±45°) — quelli vicini a ±90°
    // ruoterebbero il pannello nella direzione opposta
    if (Math.abs(a) <= Math.PI / 4 + 0.01) {
      candidates.push(a);
    }
    // Aggiungi anche la perpendicolare se è vicina a 0
    let perp = a + Math.PI / 2;
    if (perp >  Math.PI / 2) perp -= Math.PI;
    if (perp < -Math.PI / 2) perp += Math.PI;
    if (Math.abs(perp) <= Math.PI / 4 + 0.01) {
      candidates.push(perp);
    }
  }

  // Valuta ogni candidato con conteggio esatto
  let bestAng = 0, bestCnt = -1;
  for (const a of candidates) {
    const cnt = _exactCountCached(area.points, a, mWPx, mHPx, stepW, stepH, 999999, 999999);
    if (cnt > bestCnt || (cnt === bestCnt && Math.abs(a) < Math.abs(bestAng))) {
      bestCnt = cnt;
      bestAng = a;
    }
  }
  return bestAng;
}

// ── layoutConcaveArea ─────────────────────────────────────────────────────────

/**
 * Layout per aree concave (L, U, T): decompone il poligono in parti quasi-convesse,
 * applica layout indipendente su ciascuna (con angolo globale) e unisce senza overlap.
 *
 * Strategia merge:
 *   - ordina parti per area (largest first → riempie zone grandi prima)
 *   - per ogni pannello della parte successiva: scarta se sovrappone a pannello già occupato
 *   - mantiene stessa areaIdx e ang del pannello originale → cablaggio coerente
 */
function layoutConcaveArea(area, areaIdx, mWbase, mHbase, maxCount) {
  const parts = _decomposeConcave(area.points);

  // Se la decomposizione non porta benefici (1 sola parte), usa layout diretto
  if (parts.length <= 1) {
    return _layoutBestOrientation(area, areaIdx, mWbase, mHbase, maxCount);
  }

  // Ordina parti per area (largest first → riempie blocchi grandi prima)
  const _polyArea = pts => { let s=0; for(let i=0;i<pts.length;i++){const j=(i+1)%pts.length; s+=pts[i].x*pts[j].y-pts[j].x*pts[i].y;} return Math.abs(s)/2; };
  parts.sort((a, b) => _polyArea(b) - _polyArea(a));

  // Angolo ibrido: globalAng come default per coerenza visiva, ma ogni sotto-area
  // può fare fallback al proprio localAng se globalAng produce troppo pochi pannelli.
  // Soglia: se globalAng ≥ 80% di localAng → mantieni globale, altrimenti usa locale.
  // Questo risolve il caso L/U-shape con bracci ortogonali: il braccio "secondario"
  // ha spessore < altezza pannello nell'angolo globale → 0 pannelli → fallback automatico.
  const ANG_THRESHOLD = 0.8;
  const ANG_EPS = 1e-3; // angoli entro 0.001 rad = stesso angolo

  const aOrient = area.orientation || panelOrientation || 'auto';
  const { gap, walkRowInt, walkColInt } = readLayoutParams(area);
  const gapPx = gap * scale;

  // Angoli globali calcolati una volta sull'area intera (uno per orientamento)
  // Tutti i modi usano _findBestEdgeAngle (filtrata ±45°) per coerenza con
  // _layoutBestOrientation — evita angoli che vincono su AABB ma perdono nel layout reale.
  const globalAngP = _findBestEdgeAngle(area, mWbase, mHbase);
  const globalAngL = (aOrient === 'portrait') ? globalAngP : _findBestEdgeAngle(area, mHbase, mWbase);

  // Sceglie l'angolo migliore per una sotto-area in un dato orientamento.
  // Usa globalAng se ≥80% del localAng, altrimenti usa localAng.
  const _pickAng = (part, globalAng, mW, mH) => {
    const mWPx = mW * scale, mHPx = mH * scale;
    const stepW = mWPx + gapPx, stepH = mHPx + gapPx;
    const cntG = _exactCountCached(part, globalAng, mWPx, mHPx, stepW, stepH, 999999, 999999);
    // localAng usa sempre _findBestEdgeAngle (±45°) per coerenza
    const fakeA = { ...area, points: part };
    const localAng = _findBestEdgeAngle(fakeA, mW, mH);
    if (Math.abs(localAng - globalAng) < ANG_EPS) return globalAng;
    const cntL = _exactCountCached(part, localAng, mWPx, mHPx, stepW, stepH, 999999, 999999);
    return (cntG >= cntL * ANG_THRESHOLD) ? globalAng : localAng;
  };

  // Layout per sotto-area con orientamento e angolo scelti indipendentemente.
  // Per 'auto': ogni braccio sceglie il proprio orientamento migliore → risolve
  // il caso L-shape con braccio verticale (portrait) + orizzontale (landscape).
  //
  // NON usiamo _occupiedConflict tra parti diverse: i sotto-poligoni prodotti
  // da _decomposeConcave sono disgiunti per costruzione (taglio interno). Pannelli
  // in poligoni disgiunti non possono fisicamente sovrapporsi.
  // Usare _occupiedConflict cross-part con angoli diversi produce falsi positivi
  // (proiezione su frame sbagliato) → pannelli del braccio secondario scartati.
  const _all = [];
  for (const part of parts) {
    const remaining = maxCount - _all.length;
    if (remaining <= 0) break;
    const fakeArea = { ...area, points: part };

    let rawPanels;
    if (aOrient === 'portrait') {
      rawPanels = layoutSingleArea(fakeArea, areaIdx, mWbase, mHbase, remaining, _pickAng(part, globalAngP, mWbase, mHbase));
    } else if (aOrient === 'landscape') {
      rawPanels = layoutSingleArea(fakeArea, areaIdx, mHbase, mWbase, remaining, _pickAng(part, globalAngL, mHbase, mWbase));
    } else {
      // auto: prova entrambi e prende il migliore PER QUESTO BRACCIO
      const angP = _pickAng(part, globalAngP, mWbase, mHbase);
      const angL = _pickAng(part, globalAngL, mHbase, mWbase);
      const rP = layoutSingleArea(fakeArea, areaIdx, mWbase, mHbase, remaining, angP);
      const rL = layoutSingleArea(fakeArea, areaIdx, mHbase, mWbase, remaining, angL);
      rawPanels = rL.length > rP.length ? rL : rP;
    }

    _all.push(...rawPanels);
  }
  const result = _all;

  // Confronta con layout diretto (fallback per aree quasi-convesse).
  // Per aree genuinamente concave lo split copre entrambi i bracci → preferirlo
  // anche se il conteggio totale è leggermente inferiore al diretto (che massimizza
  // solo il braccio dominante lasciando l'altro vuoto).
  // Soglia: accetta split se ≥85% del diretto → il direct vince solo se ha un
  // vantaggio netto significativo (>15%), segnale che l'area è quasi-convessa.
  const direct = _layoutBestOrientation(area, areaIdx, mWbase, mHbase, maxCount);
  return result.length >= direct.length * 0.85 ? result : direct;
}

// ── engineeringLayout ────────────────────────────────────────────────────────

function engineeringLayout(target) {
  // Reset completo dello stato interazione (come deleteAllPanels)
  panels = []; strings = []; selectedPanels = new Set();
  hoveredPanel = -1; snapPreviewPos = null;
  isDraggingPanels = false; dragStartPoint = null; panelsStartPos = [];
  clearTimeout(_relayoutTimer);

  const mWbase = Math.max(0.1, parseFloat(DOM.pw.value) || 1);
  const mHbase = Math.max(0.1, parseFloat(DOM.pl.value) || 1.7);
  let totalPlaced = 0;
  // AP-17f: accumulate locally, then commit once through the store.
  const _next = [];
  installableAreas.forEach((area, areaIdx) => {
    const remaining = target - totalPlaced;
    if (remaining <= 0) return;
    // Usa layout concavo per aree con vertici reflex, diretto altrimenti
    const fn = _isConcavePolygon(area.points) ? layoutConcaveArea : _layoutBestOrientation;
    const bestResult = fn(area, areaIdx, mWbase, mHbase, remaining);
    _next.push(...bestResult);
    totalPlaced += bestResult.length;
  });
  globalThis.setStoreSlice('panels', _next);
  installableAreas.forEach((_, areaIdx) => _recomputeAreaWalkways(areaIdx));
  // UI completa — uguale a deleteAllPanels per coerenza visiva
  updateAreaLists(); updateStats(); updateStringList(); updateLegend();
  _updateToolbarGroups();
  draw();
}

// ── Snap grid ────────────────────────────────────────────────────────────────

/**
 * Implementazione unificata snap griglia.
 * mode='drop': post-drag snap con obstacle check completo + grid 5×5
 * mode='live': snap magnetico in tempo reale, no obstacle check, grid 3×3
 */
function _snapPanelToGridImpl(panel, refU, refV, mode) {
  const gap = parseFloat(DOM.ps.value) / 100;
  const mWPx = panel.w, mHPx = panel.h, gapPx = gap * scale;
  const stepW = mWPx + gapPx, stepH = mHPx + gapPx;
  const area = installableAreas[panel.areaIdx];
  if (!area) return null;

  // ── Geometrie area in coord locali (frame del pannello) ─────────────────────
  const localPoly     = transformPolygon(area.points, panel.ang);
  const localPolyAABB = polyAABB(localPoly);

  // Inset (margine di sicurezza) — stesso calcolo di layoutSingleArea
  const marginM  = Math.max(0, parseFloat(DOM.safetyMargin.value) || 0) / 100;
  const marginPx_  = marginM * scale;
  let localInset, localInsetAABB, useEdgeMarginCheck_ = false, localAreaEdges_ = null;
  if (marginPx_ > 0) {
    const _cand = offsetPolygon(area.points, -marginPx_);
    if (_isValidPoly(_cand) && !_isSelfIntersecting(_cand)) {
      localInset = transformPolygon(_cand, panel.ang);
    } else {
      localInset = localPoly.map(p => ({ ...p }));
      useEdgeMarginCheck_ = true;
      localAreaEdges_ = localPoly.map((_, i, arr) => [arr[i], arr[(i + 1) % arr.length]]);
    }
  } else {
    localInset = localPoly.map(p => ({ ...p }));
  }
  localInsetAABB = polyAABB(localInset);

  // ── Candidati snap (griglia dai vicini + griglia assoluta) ──────────────────
  const candidates = new Set();
  const addCandidate = (u, v) => candidates.add(`${u.toFixed(3)},${v.toFixed(3)}`);

  const neighborRange = 1;
  panels.forEach(other => {
    if (other === panel || other.areaIdx !== panel.areaIdx) return;
    for (let dr = -neighborRange; dr <= neighborRange; dr++)
      for (let dc = -neighborRange; dc <= neighborRange; dc++)
        addCandidate(other.localU + dc * stepW, other.localV + dr * stepH);
  });

  const gridRange = mode === 'drop' ? 2 : 1;
  for (let dr = -gridRange; dr <= gridRange; dr++)
    for (let dc = -gridRange; dc <= gridRange; dc++)
      addCandidate(Math.round((refU + dc * stepW) / stepW) * stepW,
                   Math.round((refV + dr * stepH) / stepH) * stepH);

  // ── Ostacoli in coord locali (solo mode='drop') ──────────────────────────────
  let localExcl = [], localExclAABB = [];
  if (mode === 'drop') {
    const obstDistPx = parseFloat(DOM.obstacleDistance.value) * scale;
    const _snapAreaAABB = polyAABB(area.points);
    const relevantExclRaw = [
      ...exclusionAreas.map(a => a.points),
      ...technicalObjects
        .filter(obj => {
          const poly = techObjectToPolygon(obj);
          if (pointInPolygon(obj, area.points, _snapAreaAABB)) return true;
          if (poly.some(p => pointInPolygon(p, area.points, _snapAreaAABB))) return true;
          if (area.points.some(p => pointInPolygon(p, poly, polyAABB(poly)))) return true;
          return false;
        })
        .map(obj => techObjectToPolygon(obj))
    ];
    // Espandi ostacoli di obstDistPx (stesso comportamento di layoutSingleArea)
    const buffered = obstDistPx > 0
      ? relevantExclRaw.map(pts => offsetPolygon(pts, obstDistPx))
      : relevantExclRaw.map(pts => pts.map(p => ({ ...p })));
    localExcl     = buffered.map(pts => transformPolygon(pts, panel.ang));
    localExclAABB = localExcl.map(obs => polyAABB(obs));
  }

  // ── Contesto canPlacePanel — usato per ogni candidato ───────────────────────
  // otherPanels: tutti i pannelli della stessa area tranne quello in drag.
  // AABB overlap reale invece del vecchio confronto localU/V approssimato.
  const snapCtx = {
    localInset, localInsetAABB,
    localPoly,  localPolyAABB,
    localExcl,  localExclAABB,
    useEdgeMarginCheck: useEdgeMarginCheck_,
    localAreaEdges: localAreaEdges_,
    marginPx: marginPx_,
    // 'live': solo check geometria area (veloce, per preview visivo)
    // 'drop': check completo incluso overlap con altri pannelli
    panelAng: panel.ang,
    otherPanels: mode === 'drop'
      ? panels.filter(p => p !== panel && p.areaIdx === panel.areaIdx)
      : null
  };

  // ── Selezione candidato migliore (più vicino al punto di rilascio) ───────────
  let bestDist = Infinity, bestU = null, bestV = null;
  for (const key of candidates) {
    const [lx, ly] = key.split(',').map(Number);
    if (!canPlacePanel(lx, ly, mWPx, mHPx, snapCtx)) continue;
    const dist = (lx - refU) ** 2 + (ly - refV) ** 2;
    if (dist < bestDist) { bestDist = dist; bestU = lx; bestV = ly; }
  }
  return bestU !== null ? { localU: bestU, localV: bestV } : null;
}

function snapPanelToGrid(panel) {
  return _snapPanelToGridImpl(panel, panel.localU, panel.localV, 'drop');
}

function snapPanelToGridLive(panel, rawU, rawV) {
  return _snapPanelToGridImpl(panel, rawU, rawV, 'live');
}

// ── findPanelAtPoint ─────────────────────────────────────────────────────────

function findPanelAtPoint(p) {
  for (let i = panels.length - 1; i >= 0; i--) {
    const pan = panels[i];
    if (pan.axisUx !== undefined) {
      const pox = pan.localU * pan.axisUx + pan.localV * pan.axisVx;
      const poy = pan.localU * pan.axisUy + pan.localV * pan.axisVy;
      const dpu = (p.x - pox) * pan.axisUx + (p.y - poy) * pan.axisUy;
      const dpv = (p.x - pox) * pan.axisVx + (p.y - poy) * pan.axisVy;
      if (dpu >= 0 && dpu <= pan.w && dpv >= 0 && dpv <= pan.h) return i;
    } else {
      if (p.x >= pan.x && p.x <= pan.x + pan.w && p.y >= pan.y && p.y <= pan.y + pan.h) return i;
    }
  }
  return -1;
}

// ── deleteAllPanels / deleteSelectedPanels ───────────────────────────────────

function deleteAllPanels() {
  if (!confirm('Eliminare TUTTI i moduli fotovoltaici?')) return;
  snapshot();
  panels = []; strings = []; selectedPanels = new Set(); hoveredPanel = -1;
  isDraggingPanels = false; panelsStartPos = [];
  if (moveMode) {
    moveMode = false;
    canvas.style.cursor = 'default';
    if (DOM.moveBtn) DOM.moveBtn.classList.remove('active');
  }
  updateAreaLists(); updateStats(); updateStringList(); updateLegend();
  if (DOM.deletePanelsBtn) DOM.deletePanelsBtn.style.display = 'none';
  _updateToolbarGroups();
  draw();
}

function deleteSelectedPanels() {
  if (selectedPanels.size === 0) return;
  snapshot();
  // AP-17f: rebuild and commit through store.
  globalThis.setStoreSlice('panels', panels.filter((_, idx) => !selectedPanels.has(idx)));
  // Aggiorna riferimenti stringa: rimuovi pannelli orfani
  strings.forEach(str => {
    str.panels = str.panels.filter(sp =>
      panels.some(p => p.areaIdx === sp.areaIdx && p.row === sp.row && p.column === sp.column));
  });
  clearTimeout(_relayoutTimer);
  selectedPanels = new Set(); hoveredPanel = -1;
  if (panels.length === 0) {
    strings = [];
    if (DOM.deletePanelsBtn) DOM.deletePanelsBtn.style.display = 'none';
    _updateToolbarGroups();
    if (moveMode) {
      moveMode = false;
      canvas.style.cursor = 'default';
      if (DOM.moveBtn) DOM.moveBtn.classList.remove('active');
    }
    updateStringList(); updateLegend();
  } else if (strings.length > 0) {
    genStrings(strings.length);
  }
  updateAreaLists(); updateStats(); draw();
}

// ── _recomputeAreaWalkways ────────────────────────────────────────────────────

/**
 * Calcola le fasce visive dei camminamenti per l'area idx e le salva su
 * area._walkways = [{ corners:[{x,y}×4] }, ...].
 * Funziona anche quando il camminamento cade oltre l'ultimo pannello.
 */
function _recomputeAreaWalkways(idx) {
  const area = installableAreas[idx];
  if (!area) return;
  area._walkways = [];
  const ap = panels.filter(p => p.areaIdx === idx);
  if (ap.length === 0) return;

  const { walkColInt, walkColWidth, walkRowInt, walkRowWidth, gap } = readLayoutParams(area);
  const walkColWidthPx = walkColWidth * scale;
  const walkRowWidthPx = walkRowWidth * scale;
  if ((walkColInt >= 999999 || walkColWidthPx <= 0) &&
      (walkRowInt >= 999999 || walkRowWidthPx <= 0)) return;

  const mWPx = ap[0].w, mHPx = ap[0].h;
  const gapPx = gap * scale;
  const stepW = mWPx + gapPx, stepH = mHPx + gapPx;
  const ang   = ap[0].ang || 0;
  const ux = Math.cos(ang), uy = Math.sin(ang);
  const vx = -Math.sin(ang), vy = Math.cos(ang);

  // Inverso: area points → spazio locale (rotazione -ang)
  const cos_ = Math.cos(-ang), sin_ = Math.sin(-ang);
  const localPts = area.points.map(p => ({
    u: p.x * cos_ - p.y * sin_,
    v: p.x * sin_ + p.y * cos_,
  }));
  const aMinU = Math.min(...localPts.map(p => p.u));
  const aMaxU = Math.max(...localPts.map(p => p.u));
  const aMinV = Math.min(...localPts.map(p => p.v));
  const aMaxV = Math.max(...localPts.map(p => p.v));

  // Riferimento griglia: pannello con column >= 0 e row pari (no stagger offset).
  const pRef = ap.find(p => p.column >= 0 && p.row % 2 === 0)
            || ap.find(p => p.column >= 0)
            || ap[0];
  const toWorld = (u, v) => ({ x: u * ux + v * vx, y: u * uy + v * vy });

  // Quando bestAng ≈ 90° l'asse U punta verso il basso (verticale schermo) e V
  // verso sinistra (orizzontale schermo): walkColInt genera strisce visivamente
  // orizzontali e walkRowInt genera strisce verticali — l'opposto di quanto atteso.
  // Fix: se U è più verticale che orizzontale, scambia le assegnazioni col↔row.
  const uIsHoriz = Math.abs(Math.cos(ang)) >= Math.abs(Math.sin(ang));
  const _rcColInt  = uIsHoriz ? walkColInt     : walkRowInt;
  const _rcColWPx  = uIsHoriz ? walkColWidthPx : walkRowWidthPx;
  const _rcRowInt  = uIsHoriz ? walkRowInt     : walkColInt;
  const _rcRowWPx  = uIsHoriz ? walkRowWidthPx : walkColWidthPx;

  // ── Camminamenti verticali (tra colonne) ────────────────────────────────
  // _rcColInt = Camm.V effettivo: gap ogni N colonne → striscia in direzione V
  if (_rcColInt < 999999 && _rcColWPx > 0) {
    // Il pannello di riferimento ha .column e .localU allineati al loop col di runGlobalGrid,
    // dove _wColInt è già swappato. Quindi usiamo sempre pRef.column e pRef.localU.
    const originU = pRef.localU
      - pRef.column * stepW
      - Math.floor(pRef.column / _rcColInt) * _rcColWPx;

    for (let g = 1; g <= 20; g++) {
      const lastCol   = g * _rcColInt - 1;
      const gapStartU = originU + lastCol * stepW
                        + (g - 1) * _rcColWPx + mWPx;
      const gapEndU   = gapStartU + _rcColWPx;

      if (gapStartU >= aMaxU) break;
      const clampEnd = Math.min(gapEndU, aMaxU);

      area._walkways.push({ type: 'col', corners: [
        toWorld(gapStartU, aMinV),
        toWorld(clampEnd,  aMinV),
        toWorld(clampEnd,  aMaxV),
        toWorld(gapStartU, aMaxV),
      ]});
    }
  }

  // ── Camminamenti orizzontali (tra righe) ────────────────────────────────
  // _rcRowInt = Camm.H effettivo: gap ogni N righe → striscia in direzione U
  if (_rcRowInt < 999999 && _rcRowWPx > 0) {
    // Analogamente: pRef.row e pRef.localV sono allineati al loop row di runGlobalGrid.
    const originV = pRef.localV
      - pRef.row * stepH
      - Math.floor(pRef.row / _rcRowInt) * _rcRowWPx;

    for (let g = 1; g <= 20; g++) {
      const lastRow   = g * _rcRowInt - 1;
      const gapStartV = originV + lastRow * stepH
                        + (g - 1) * _rcRowWPx + mHPx;
      const gapEndV   = gapStartV + _rcRowWPx;

      if (gapStartV >= aMaxV) break;
      const clampEnd = Math.min(gapEndV, aMaxV);

      area._walkways.push({ type: 'row', corners: [
        toWorld(aMinU, gapStartV),
        toWorld(aMaxU, gapStartV),
        toWorld(aMaxU, clampEnd),
        toWorld(aMinU, clampEnd),
      ]});
    }
  }
}

// ── _relayoutArea ────────────────────────────────────────────────────────────

/**
 * Ricalcola solo l'area idx mantenendo il massimo di pannelli.
 *
 * Gestione stato connesso:
 * - selectedPanels: salva identità stabile (areaIdx|row|col) per pannelli
 *   NON appartenenti all'area rilayoutata, poi ricostruisce gli indici dopo.
 *   I pannelli dell'area relaid vengono deselezionati (non esistono più).
 * - hoveredPanel: resettato a -1 (l'indice non è più valido dopo filter+push).
 * - dragState: reset completo se era in corso un drag (protezione extra).
 * - strings: rigenerata se presente; updateStringList+updateLegend sincronizzati.
 */
function _relayoutArea(idx) {
  if (!installableAreas[idx]) return;
  invalidateLayoutCache();

  // ── 1. Salva selezioni stabili (solo pannelli fuori dall'area da relayoutare) ──
  const stableSelected = new Set();
  for (const si of selectedPanels) {
    const p = panels[si];
    if (p && p.areaIdx !== idx)
      stableSelected.add(`${p.areaIdx}|${p.row}|${p.column}`);
  }

  // ── 2. Reset stato interazione — indici vecchi non sono più validi ──────────
  selectedPanels = new Set();
  hoveredPanel   = -1;
  snapPreviewPos = null;
  if (isDraggingPanels) {
    isDraggingPanels = false;
    dragStartPoint   = null;
    panelsStartPos   = [];
  }

  // ── 3. Relayout pannelli dell'area ──────────────────────────────────────────
  const mWbase = Math.max(0.1, parseFloat(DOM.pw.value) || 1);
  const mHbase = Math.max(0.1, parseFloat(DOM.pl.value) || 1.7);
  const area = installableAreas[idx];
  const maxC = (area.maxPanels != null) ? area.maxPanels : 999999;
  const fn = _isConcavePolygon(area.points) ? layoutConcaveArea : _layoutBestOrientation;
  const newPanels = fn(area, idx, mWbase, mHbase, maxC);
  // AP-17f: combined filter+append commit through store.
  globalThis.setStoreSlice('panels', panels.filter(p => p.areaIdx !== idx).concat(newPanels));

  // ── 4. Ripristina selezioni stabili con nuovi indici ────────────────────────
  panels.forEach((p, i) => {
    if (stableSelected.has(`${p.areaIdx}|${p.row}|${p.column}`))
      selectedPanels.add(i);
  });

  // ── 5. Aggiorna walkways + stringhe + UI completa ───────────────────────────
  _recomputeAreaWalkways(idx);
  if (strings.length > 0) genStrings(strings.length);
  updateAreaLists(); updateStats(); updateStringList(); updateLegend();
  _updateToolbarGroups();
  draw();
}

// ── Add / remove panels per area ─────────────────────────────────────────────

function _refreshAreaMaxCapacity(idx) {
  const area = installableAreas[idx];
  if (!area || !scale || scale <= 1) return;
  const mWbase = Math.max(0.1, parseFloat(DOM.pw.value) || 1);
  const mHbase = Math.max(0.1, parseFloat(DOM.pl.value) || 1.7);
  const fn = _isConcavePolygon(area.points) ? layoutConcaveArea : _layoutBestOrientation;
  area._maxCapacity = filterIsolatedPanels(fn(area, idx, mWbase, mHbase, 999999)).length;
}

function addAreaPanel(idx) {
  const area = installableAreas[idx];
  if (!area) return;
  if (area._maxCapacity == null) _refreshAreaMaxCapacity(idx);
  const current = panels.filter(p => p.areaIdx === idx).length;
  const trueMax = area._maxCapacity != null ? area._maxCapacity : 999999;
  if (current >= trueMax) return;
  snapshot();
  area.maxPanels = current + 1;
  _relayoutArea(idx);
  _refreshAreaMaxCapacity(idx);
  updateAreaLists();
}

function removeAreaPanel(idx) {
  const area = installableAreas[idx];
  if (!area) return;
  const current = panels.filter(p => p.areaIdx === idx).length;
  if (current <= 0) return;
  snapshot();
  area.maxPanels = current - 1;
  _relayoutArea(idx);
  _refreshAreaMaxCapacity(idx);
  updateAreaLists();
}

// ── Area stagger setters ─────────────────────────────────────────────────────

function setAreaStagger(idx, enabled) {
  if (!installableAreas[idx]) return;
  snapshot();
  installableAreas[idx].staggerEnabled = enabled;
  invalidateLayoutCache();
  updateAreaLists();
  if (panels.some(p => p.areaIdx === idx)) _relayoutArea(idx);
}

function setAreaStaggerOffset(idx, val) {
  if (!installableAreas[idx]) return;
  installableAreas[idx].staggerOffset = Math.min(90, Math.max(10, parseFloat(val) || 50));
  invalidateLayoutCache();
  draw();
}

function commitAreaStaggerOffset(idx, val) {
  snapshot();
  setAreaStaggerOffset(idx, val);
  if (panels.some(p => p.areaIdx === idx)) _relayoutArea(idx);
}

// ── Walkway setters H (righe) ─────────────────────────────────────────────────

function setAreaWalkRowEnabled(idx, v) {
  if (!installableAreas[idx]) return; snapshot();
  installableAreas[idx].walkRowEnabled = v;
  invalidateLayoutCache(); updateAreaLists();
  if (panels.some(p => p.areaIdx === idx)) _relayoutArea(idx); else draw();
}

function setAreaWalkRowInterval(idx, val) {
  if (!installableAreas[idx]) return;
  installableAreas[idx].walkRowInterval = Math.max(1, parseInt(val) || 3);
  invalidateLayoutCache(); draw();
}

function commitAreaWalkRowInterval(idx, val) {
  snapshot(); setAreaWalkRowInterval(idx, val);
  if (panels.some(p => p.areaIdx === idx)) _relayoutArea(idx);
}

function setAreaWalkRowWidth(idx, val) {
  if (!installableAreas[idx]) return;
  installableAreas[idx].walkRowWidth = Math.max(20, Math.min(400, parseFloat(val) || 80));
  invalidateLayoutCache(); draw();
}

function commitAreaWalkRowWidth(idx, val) {
  snapshot(); setAreaWalkRowWidth(idx, val);
  if (panels.some(p => p.areaIdx === idx)) _relayoutArea(idx);
}

// ── Walkway setters V (colonne) ───────────────────────────────────────────────

function setAreaWalkColEnabled(idx, v) {
  if (!installableAreas[idx]) return; snapshot();
  installableAreas[idx].walkColEnabled = v;
  invalidateLayoutCache(); updateAreaLists();
  if (panels.some(p => p.areaIdx === idx)) _relayoutArea(idx); else draw();
}

function setAreaWalkColInterval(idx, val) {
  if (!installableAreas[idx]) return;
  installableAreas[idx].walkColInterval = Math.max(1, parseInt(val) || 3);
  invalidateLayoutCache(); draw();
}

function commitAreaWalkColInterval(idx, val) {
  snapshot(); setAreaWalkColInterval(idx, val);
  if (panels.some(p => p.areaIdx === idx)) _relayoutArea(idx);
}

function setAreaWalkColWidth(idx, val) {
  if (!installableAreas[idx]) return;
  installableAreas[idx].walkColWidth = Math.max(20, Math.min(400, parseFloat(val) || 80));
  invalidateLayoutCache(); draw();
}

function commitAreaWalkColWidth(idx, val) {
  snapshot(); setAreaWalkColWidth(idx, val);
  if (panels.some(p => p.areaIdx === idx)) _relayoutArea(idx);
}

// ── Legacy compat — usato dal caricamento di vecchi progetti ─────────────────

function setAreaWalkways(idx, enabled)       { setAreaWalkRowEnabled(idx, enabled); }
function setAreaWalkwayInterval(idx, v)      { setAreaWalkRowInterval(idx, v); }
function commitAreaWalkwayInterval(idx, v)   { commitAreaWalkRowInterval(idx, v); }
function setAreaWalkwayWidth(idx, v)         { setAreaWalkRowWidth(idx, v); }
function commitAreaWalkwayWidth(idx, v)      { commitAreaWalkRowWidth(idx, v); }
function setAreaWalkwayDir(idx, dir) {
  // Setter ATOMICO: aggiorna entrambe le flag in una sola passata così da
  // evitare doppio snapshot(), doppia invalidazione cache e doppio _relayoutArea().
  if (!installableAreas[idx]) return;
  snapshot();
  const area = installableAreas[idx];
  if (dir === 'row') { area.walkRowEnabled = true;  area.walkColEnabled = false; }
  else               { area.walkColEnabled = true;  area.walkRowEnabled = false; }
  invalidateLayoutCache();
  updateAreaLists();
  if (panels.some(p => p.areaIdx === idx)) _relayoutArea(idx); else draw();
}

// ── Area preview (pannelli per area in realtime) ──────────────────────────────

function _scheduleAreaPreview() {
  clearTimeout(_previewDebounceTimer);
  _previewDebounceTimer = setTimeout(_computeAreaPreviews, 600);
}

function _computeAreaPreviews() {
  if (!scale || scale <= 1) return;
  const mWbase = Math.max(0.1, parseFloat(DOM.pw.value) || 1);
  const mHbase = Math.max(0.1, parseFloat(DOM.pl.value) || 1.7);
  const panelCountByArea = new Map();
  panels.forEach(p => panelCountByArea.set(p.areaIdx, (panelCountByArea.get(p.areaIdx) || 0) + 1));
  let changed = false;
  installableAreas.forEach((area, idx) => {
    const fn = _isConcavePolygon(area.points) ? layoutConcaveArea : _layoutBestOrientation;
    const best = filterIsolatedPanels(fn(area, idx, mWbase, mHbase, 999999)).length;
    area._maxCapacity = best;
    area._previewCount = panelCountByArea.has(idx) ? panelCountByArea.get(idx) : best;
    changed = true;
  });
  if (changed) updateAreaLists();
}


// ── js/strings.js ──
﻿// ── strings.js — Gestione stringhe inverter, legenda, statistiche ──

'use strict';

// ── Toolbar stringhe dropdown ─────────────────────────────────────────────────

function toggleStrConfig() {
  if (panels.length === 0) { showToast('Posizionare moduli prima di configurare le stringhe', 'warn'); return; }
  const panel = DOM.strConfigPanel;
  const btn   = DOM.strConfigBtn;
  const arrow = DOM.strConfigArrow;
  const isOpen = panel.classList.contains('open');
  panel.classList.toggle('open', !isOpen);
  btn.classList.toggle('open', !isOpen);
  arrow.style.transform = isOpen ? '' : 'rotate(180deg)';
  if (!isOpen) updateStringPreview();
}

function closeString() {
  const panel = DOM.strConfigPanel;
  const btn   = DOM.strConfigBtn;
  const arrow = DOM.strConfigArrow;
  if (panel) panel.classList.remove('open');
  if (btn)   btn.classList.remove('open');
  if (arrow) arrow.style.transform = '';
}

function adjString(d) { /* non usato — stringhe calcolate automaticamente */ }
function adjPair(d)   { /* non usato — MPPT fissati dal parco inverter */ }

function _getVmppTempCoeff() {
  const pmax = parseFloat((document.getElementById('moduleTcoefPmax') || { value: '0' }).value);
  const voc  = parseFloat((document.getElementById('moduleTcoefVoc') || { value: '-0.30' }).value) || -0.30;
  return Number.isFinite(pmax) && pmax !== 0 ? pmax : voc;
}

function _getExpectedStringTotal() {
  return Math.max(1, parseInt((document.getElementById('invStrTot') || { value: '1' }).value, 10) || 1);
}


function updateStringPreview() {
  const total  = panels.length;
  const pp     = parseInt((DOM.pp || {value:'400'}).value) || 400;
  const btn    = DOM.stringConfirmBtn;

  // Dati modulo
  const voc       = parseFloat((document.getElementById('moduleVoc')       || {value:'45'}).value)  || 45;
  const vmpp      = parseFloat((document.getElementById('moduleVmpp')      || {value:'38'}).value)  || (voc * 0.82);
  const isc       = parseFloat((document.getElementById('moduleIsc')       || {value:'9'}).value)   || 9;
  const tcoefVoc  = parseFloat((document.getElementById('moduleTcoefVoc')  || {value:'-0.30'}).value) || -0.30; // %/°C
  const tcoefVmpp = _getVmppTempCoeff();

  // Correzione termica (CEI EN 62548): T_min=-10°C per Voc, T_max=70°C per Vmpp
  const T_min = -10, T_max = 70, T_stc = 25;
  const kVoc   = tcoefVoc / 100;
  const kVmpp  = tcoefVmpp / 100;
  const vocCold  = voc  * (1 + kVoc * (T_min - T_stc));  // Voc a -10°C (più alta → caso peggiore)
  const vmppHot  = vmpp * (1 + kVmpp * (T_max - T_stc));  // Vmpp a 70°C (più bassa → caso peggiore)
  const vmppCold = vmpp * (1 + kVmpp * (T_min - T_stc));  // Vmpp a -10°C (più alta → caso peggiore)

  // Limiti inverter (da campi hidden settati da updateInverterListUI)
  const vocMax = parseFloat((document.getElementById('invVocMax')   || {value:'0'}).value) || 0;
  const vMin   = parseFloat((document.getElementById('invVmpptMin') || {value:'0'}).value) || 0;
  const vMax   = parseFloat((document.getElementById('invVmpptMax') || {value:'0'}).value) || 0;
  const iMax   = parseFloat((document.getElementById('invImaxMppt') || {value:'0'}).value) || 0;
  const pacKw  = parseFloat((document.getElementById('invPac')      || {value:'0'}).value) || 0;

  // Stringhe totali fisse dal parco inverter (mppt × strPerMppt × qty, da datasheet)
  const strTot = _getExpectedStringTotal();

  const noInverter = _inverterList.length === 0;
  const mixedStrPerMppt = _hasMixedStrPerMppt();

  // ── Box calcolo ottimale CEI ──────────────────────────────────────────────────
  const optBox       = document.getElementById('optimalConfigBox');
  const panelMatchBox= document.getElementById('panelMatchBox');
  const preview      = DOM.stringPreview;
  const divEl        = DOM.stringDivisors;
  const mpsvEl       = document.getElementById('moduliPerStringaVal');
  const strCalcEl    = document.getElementById('stringCalcValues');
  const schemaEl     = document.getElementById('mpptSchema');

  if (noInverter) {
    if (optBox)       optBox.innerHTML = `<div style="color:var(--text-tertiary);font-size:var(--fs-xs);padding:6px 8px;background:var(--bg-tertiary);border-radius:var(--radius-sm);">Aggiungi inverter nel blocco 1 per avviare il calcolo.</div>`;
    if (panelMatchBox) panelMatchBox.innerHTML = '';
    if (preview)      { preview.innerHTML = ''; preview.style.background = ''; preview.style.border = ''; }
    if (divEl)        divEl.innerHTML = '';
    if (mpsvEl)       mpsvEl.textContent = '—';
    if (strCalcEl)    strCalcEl.innerHTML = '';
    if (schemaEl)     schemaEl.innerHTML = '';
    if (btn) { btn.disabled = true; btn.style.opacity = '0.4'; }
    return;
  }

  // Calcola range moduli per stringa dai limiti inverter (con correzione termica)
  const n_max_voc  = vocMax > 0 ? Math.floor(vocMax / vocCold)  : 99;  // usa Voc a -10°C (caso peggiore)
  const n_min_vmpp = vMin   > 0 ? Math.ceil(vMin   / vmppHot)   : 1;   // usa Vmpp a 70°C (caso peggiore)
  const n_max_vmpp = vMax   > 0 ? Math.floor(vMax  / vmppCold) : 99;  // usa Vmpp a -10??C
  const n_opt      = Math.min(n_max_voc, n_max_vmpp);   // max moduli rispettando Voc e Vmpp

  // Pannelli min/max installabili con questo parco inverter
  const panels_max = strTot * n_opt;
  const panels_min = strTot * n_min_vmpp;

  // State flags used both by panelMatchBox rendering and the final
  // configOk check below — function-scoped to match panels_max / ratioOk.
  const strPerMppt   = _getProjectStrPerMpptMax();
  const overInverter = total > panels_max;

  // DC/AC ratio (CEI 0-21: max 1.33)
  const ratio    = pacKw > 0 ? (total * pp / 1000) / pacKw : 0;
  const ratioOk  = ratio <= 1.33;

  // ── optimalConfigBox ──
  if (optBox) {
    optBox.innerHTML = `
      <div style="background:var(--bg-secondary);border:1px solid var(--border-default);border-radius:var(--radius-sm);padding:8px 10px;margin-bottom:8px;font-size:var(--fs-xs);">
        <div style="font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">Calcolo automatico CEI — ${strTot} stringhe</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <div><span style="color:var(--text-tertiary);">Min mod./str. (Vmpp@70°C≥${vMin}V):</span><br><b style="font-size:var(--fs-sm);">${n_min_vmpp} mod.</b></div>
          <div><span style="color:var(--text-tertiary);">Max mod./str. (Voc@-10°C≤${vocMax}V, Vmpp≤${vMax}V):</span><br><b style="color:var(--accent-text);font-size:var(--fs-sm);">${n_opt} mod.</b></div>
          <div><span style="color:var(--text-tertiary);">Pannelli min installabili:</span><br><b>${panels_min} mod. · ${(panels_min*pp/1000).toFixed(1)} kWp</b></div>
          <div><span style="color:var(--text-tertiary);">Pannelli max installabili:</span><br><b style="color:var(--accent-text);">${panels_max} mod. · ${(panels_max*pp/1000).toFixed(1)} kWp</b></div>
        </div>
        <div style="margin-top:5px;padding-top:5px;border-top:1px solid var(--border-default);color:var(--text-tertiary);font-size:10px;">
          γVoc=${tcoefVoc.toFixed(2)}%/°C · γVmpp=${tcoefVmpp.toFixed(2)}%/°C · Voc@-10°C=${vocCold.toFixed(1)}V · Vmpp@70°C=${vmppHot.toFixed(1)}V
        </div>
        ${pacKw > 0 ? `<div style="margin-top:4px;color:${ratioOk?'var(--accent-text)':'var(--warning-text)'};">
          ${ratioOk?'✓':'⚠'} DC/AC ratio: ${ratio.toFixed(2)} (max 1.33 — CEI 0-21)
        </div>` : ''}
      </div>`;
  }

  // ── Verifica bilanciamento MPPT e azioni correttive ──
  if (panelMatchBox) {
    const physMax    = _countPhysicalMax();

    // Regola corretta: total % strPerMppt === 0
    // Ogni MPPT ha strPerMppt stringhe uguali tra loro.
    // MPPT diversi possono avere conteggi diversi → non conta strTot.
    const leftover   = total % strPerMppt;
    const isBalanced = total > 0 && leftover === 0;

    // Minimo aggiustamento per bilanciare
    const toRemove = leftover;                    // togli 'leftover' pannelli → scendi al multiplo corretto
    const toAdd    = strPerMppt - leftover;       // aggiungi per salire al prossimo multiplo corretto

    // Verifica anche limiti inverter (secondaria rispetto al bilanciamento)
    const underInverter = total < panels_max;

    // Status
    let statusHtml = '';
    if (mixedStrPerMppt) {
      statusHtml = `<span style="color:var(--warning-text);font-weight:600;">⚠ Parco inverter misto con stringhe/MPPT diverse: configurazione automatica bloccata</span>`;
    } else if (total === 0) {
      statusHtml = `<span style="color:var(--text-tertiary);">Nessun pannello posizionato.</span>`;
    } else if (isBalanced && !overInverter) {
      statusHtml = `<span style="color:var(--accent-text);font-weight:600;">✓ ${total} pannelli — MPPT bilanciati${total === panels_max ? ', configurazione ottimale' : ''}</span>`;
    } else if (isBalanced && overInverter) {
      statusHtml = `<span style="color:var(--warning-text);font-weight:600;">⚠ ${total} pannelli — bilanciati ma ${total - panels_max} in eccesso rispetto al massimo inverter (${panels_max})</span>`;
    } else {
      // Sbilanciato: mostra cosa serve per bilanciare
      statusHtml = `<span style="color:var(--warning-text);font-weight:600;">⚠ ${total} pannelli — 1 MPPT sbilanciato</span>
        <span style="color:var(--text-tertiary);font-size:10px;display:block;margin-top:2px;">Per bilanciare: togli ${toRemove} oppure aggiungi ${toAdd} pannello/i</span>`;
    }

    const BS = (on, col) => on
      ? `style="flex:1;padding:6px 8px;font-size:var(--fs-xs);font-weight:600;border-radius:var(--radius-sm);border:1px solid ${col};background:var(--bg-secondary);color:${col};cursor:pointer;"`
      : `style="flex:1;padding:6px 8px;font-size:var(--fs-xs);font-weight:600;border-radius:var(--radius-sm);border:1px solid var(--border-default);background:var(--bg-tertiary);color:var(--text-tertiary);cursor:not-allowed;opacity:0.5;"`;

    // Pulsanti: attivi SOLO quando c'è uno sbilanciamento da correggere
    const canRem  = !isBalanced && total > toRemove;
    const canAdd2 = !isBalanced && physMax >= total + toAdd;
    const targetRem = total - toRemove;
    const targetAdd = total + toAdd;

    // Pulsante Togli per eccesso inverter (caso bilanciato ma sopra limits)
    const canTrimInv = isBalanced && overInverter;
    const trimCount  = total - panels_max;

    let note = '';
    if (!isBalanced && !canAdd2) {
      note = `<div style="margin-top:6px;font-size:10px;color:var(--text-tertiary);">Nessuno spazio fisico per aggiungere ${toAdd} pannello/i (max fisico: ${physMax}). Aggiungi una nuova area.</div>`;
    }
    if (mixedStrPerMppt) {
      note = `<div style="margin-top:6px;font-size:10px;color:var(--warning-text);">Usa inverter con stesso numero di stringhe per MPPT oppure gestisci il layout manualmente: la generazione automatica viene disabilitata per sicurezza.</div>`;
    }

    panelMatchBox.innerHTML = `
      <div style="background:var(--bg-secondary);border:1px solid var(--border-default);border-radius:var(--radius-sm);padding:8px 10px;margin-bottom:8px;">
        <div style="margin-bottom:8px;font-size:var(--fs-xs);">${statusHtml}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          ${!isBalanced && !mixedStrPerMppt ? `
          <button ${BS(canRem, 'var(--danger)')}
            onclick="${canRem ? `adjustPanelCount(${targetRem})` : ''}"
            ${canRem ? '' : 'disabled'}
            title="Rimuovi ${toRemove} pannello/i per bilanciare gli MPPT (${total} → ${targetRem})">
            − Togli ${toRemove} → ${targetRem}
          </button>
          <button ${BS(canAdd2, 'var(--accent)')}
            onclick="${canAdd2 ? `adjustPanelCount(${targetAdd})` : ''}"
            ${canAdd2 ? '' : 'disabled'}
            title="${canAdd2 ? `Aggiungi ${toAdd} pannello/i per bilanciare gli MPPT (${total} → ${targetAdd})` : `Spazio fisico insufficiente (max ${physMax})`}">
            + Aggiungi ${toAdd} → ${targetAdd}
          </button>` : ''}
          ${canTrimInv ? `
          <button ${BS(true, 'var(--warning)')}
            onclick="adjustPanelCount(${panels_max})"
            title="Rimuovi ${trimCount} pannelli in eccesso rispetto al massimo inverter (${panels_max})">
            − Togli ${trimCount} eccesso
          </button>` : ''}
          <button style="flex:1;padding:6px 8px;font-size:var(--fs-xs);font-weight:600;border-radius:var(--radius-sm);border:1px solid var(--border-default);background:var(--bg-secondary);color:var(--text-primary);cursor:pointer;"
            onclick="addNewInstallableArea()"
            title="Disegna una nuova area installabile">
            + Nuova area
          </button>
        </div>
        ${note}
      </div>`;
  }

  // ── Moduli per stringa (basato sui pannelli effettivamente disegnati) ──
  // Usa n_opt come moduli per stringa di riferimento; se i pannelli non dividono esatto, lo segnala
  const modsPerStr = n_opt;  // moduli per stringa ottimali da calcolo
  const panels_actual_str = strTot * modsPerStr;
  const base  = total > 0 ? Math.floor(total / strTot) : modsPerStr;
  const resto = total > 0 ? total % strTot : 0;

  if (mpsvEl) {
    if (total === 0) {
      mpsvEl.textContent = `${modsPerStr} mod. (ottimale)`;
      mpsvEl.style.color = 'var(--accent)';
    } else if (resto === 0) {
      mpsvEl.textContent = base + ' mod.';
      mpsvEl.style.color = base === modsPerStr ? 'var(--accent)' : 'var(--warning)';
    } else {
      mpsvEl.textContent = base + '–' + (base+1) + ' mod. (non intero)';
      mpsvEl.style.color = 'var(--warning)';
    }
  }

  // ── Preview stringa ──
  // Bilanciamento corretto: total % strPerMppt === 0
  // (ogni MPPT ha strPerMppt stringhe uguali; MPPT diversi possono differire)
  if (preview) {
    const spm       = _getProjectStrPerMpptMax();
    const lft       = total % spm;
    const balanced2 = total === 0 || lft === 0;

    preview.style.background = balanced2 ? 'var(--accent-light)' : 'var(--warning-light)';
    preview.style.border      = balanced2 ? '1px solid var(--accent)' : '1px solid var(--warning)';

    if (total === 0) {
      preview.innerHTML = `<b>${strTot} stringhe</b> — nessun pannello posizionato`;
    } else if (balanced2) {
      preview.innerHTML = `<b>${total} pannelli</b> — divisibili per ${spm} str/MPPT<br>
        <span style="color:var(--accent-text);">✓ Tutti gli MPPT bilanciabili</span>`;
    } else {
      preview.innerHTML = `<b>${total} pannelli</b> — resto ${lft} rispetto a ${spm} str/MPPT<br>
        <span style="color:var(--warning-text);">⚠ Togli ${lft} oppure aggiungi ${spm - lft} pannello/i per bilanciare</span>`;
    }
  }

  // ── Valori elettrici stringa (con correzione termica) ──
  const mods_ref = total > 0 ? base : modsPerStr;
  if (strCalcEl && mods_ref > 0) {
    const Voc_cold_str  = (vocCold  * mods_ref).toFixed(0);   // Voc stringa @ -10°C
    const Vmpp_hot_str  = (vmppHot  * mods_ref).toFixed(0);   // Vmpp stringa @ 70°C
    const Vmpp_cold_str = (vmppCold * mods_ref).toFixed(0);   // Vmpp stringa @ -10°C
    const Isc_str       = (isc * 1.25 * _getProjectStrPerMpptMax()).toFixed(1);
    function chk(val, lo, hi, unit) {
      if (!lo && !hi) return `<span style="color:var(--text-tertiary);">—</span>`;
      const v = parseFloat(val), ok = (!lo||v>=lo) && (!hi||v<=hi);
      const limit = lo && hi ? `[${lo}–${hi}${unit}]` : hi ? `≤${hi}${unit}` : `≥${lo}${unit}`;
      return `<span style="color:${ok?'var(--accent-text)':'var(--danger)'};font-weight:600;">${ok?'✓':'⚠'} ${val}${unit}</span> <span style="color:var(--text-tertiary);font-size:10px;">${limit}</span>`;
    }
    strCalcEl.innerHTML = `
      <div style="background:var(--bg-secondary);border:1px solid var(--border-default);border-radius:var(--radius-sm);padding:8px 10px;margin-bottom:8px;font-size:var(--fs-xs);">
        <div style="font-weight:600;color:var(--text-secondary);margin-bottom:5px;">Valori elettrici stringa (${mods_ref} mod.)</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
          <div>
            <div style="color:var(--text-tertiary);">Voc stringa @-10°C</div>
            ${chk(Voc_cold_str, 0, vocMax,' V')}
          </div>
          <div>
            <div style="color:var(--text-tertiary);">Vmpp str. @70°C / -10°C</div>
            <span style="font-size:10px;color:var(--text-tertiary);">${Vmpp_hot_str}V / </span>${chk(Vmpp_cold_str, vMin, vMax,' V')}
          </div>
          <div>
            <div style="color:var(--text-tertiary);">Isc×1.25 × str/MPPT</div>
            ${chk(Isc_str, 0, iMax,' A')}
          </div>
        </div>
      </div>`;
  } else if (strCalcEl) {
    strCalcEl.innerHTML = '';
  }

  // ── Schema visivo MPPT (max 8 inverter per leggibilità) ──
  if (schemaEl) {
    if (_inverterList.length > 0 && _inverterList.length <= 8) {
      let html = '<div style="display:flex;flex-direction:column;gap:3px;margin-bottom:8px;">';
      _inverterList.forEach(inv => {
        for (let q = 0; q < inv.qty; q++) {
          html += `<div style="font-size:10px;background:var(--bg-secondary);border:1px solid var(--border-default);border-radius:3px;padding:3px 7px;">
            <b style="color:var(--text-primary);">${inv.brand} ${inv.model}</b> — ${inv.mppt} MPPT × ${inv.strPerMppt} str =
            <b style="color:var(--accent-text);">${inv.mppt*inv.strPerMppt} stringhe</b>
            ${total>0?`, ${mods_ref} mod/str → <b>${inv.mppt*inv.strPerMppt*mods_ref} pannelli</b>`:''}
          </div>`;
        }
      });
      html += '</div>';
      schemaEl.innerHTML = html;
    } else {
      schemaEl.innerHTML = '';
    }
  }

  // Divisori non più necessari con logica automatica
  if (divEl) divEl.innerHTML = '';

  // Aggiorna pairNum hidden con strTot (usato da confirmString e calcCables)
  if (DOM.pairNum) DOM.pairNum.value = strTot;
  if (DOM.stringNum) DOM.stringNum.value = 1;

  if (btn) {
    const configOk = !mixedStrPerMppt && total > 0 && !overInverter && ratioOk && (strPerMppt <= 1 || total % strPerMppt === 0);
    btn.disabled = !configOk;
    btn.style.opacity = configOk ? '' : '0.4';
  }
}

function setTotalStrings(total) { /* non usato — stringhe fisse da datasheet */ }

/**
 * Conta quanti pannelli possono fisicamente stare nelle aree disegnate
 * (senza limite inverter), usando layoutSingleArea con maxCount=999999.
 */
function _countPhysicalMax() {
  if (!installableAreas.length) return 0;
  const mWbase = Math.max(0.1, parseFloat(DOM.pw.value) || 1);
  const mHbase = Math.max(0.1, parseFloat(DOM.pl.value) || 1.7);
  let tot = 0;
  installableAreas.forEach((area, idx) => {
    const aOrient = area.orientation || panelOrientation || 'auto';
    let cnt;
    if (aOrient === 'portrait') {
      cnt = layoutSingleArea(area, idx, mWbase, mHbase, 999999).length;
    } else if (aOrient === 'landscape') {
      cnt = layoutSingleArea(area, idx, mHbase, mWbase, 999999).length;
    } else {
      cnt = Math.max(
        layoutSingleArea(area, idx, mWbase, mHbase, 999999).length,
        layoutSingleArea(area, idx, mHbase, mWbase, 999999).length
      );
    }
    tot += cnt;
  });
  return tot;
}

/**
 * Ridisegna il layout con esattamente `target` pannelli usando engineeringLayout.
 * Se target > capacità fisica → usa il max disponibile.
 */
function adjustPanelCount(target) {
  if (!installableAreas.length) { showToast('Nessuna area installabile', 'warn'); return; }
  const physMax = _countPhysicalMax();
  const effective = Math.min(target, physMax);
  if (effective <= 0) { showToast('Nessun pannello posizionabile nelle aree disponibili', 'warn'); return; }
  snapshot();
  engineeringLayout(effective);
  const expectedStrings = _getExpectedStringTotal();
  if (strings.length > 0) genStrings(expectedStrings);
  updateStats();
  updateStringPreview();
  if (typeof calcCables === 'function') calcCables();
  showToast(`Layout aggiornato: ${panels.length} pannelli`, panels.length === target ? 'ok' : 'warn');
}

/**
 * Attiva la modalità disegno area installabile e scorre allo step 5.
 */
function addNewInstallableArea() {
  // Scorri alla sezione 5 (aree installabili)
  const s5 = document.getElementById('s5');
  if (s5) s5.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // Avvia disegno area installabile
  if (typeof startArea === 'function') startArea('installable');
  showToast('Disegna la nuova area installabile sul canvas', 'ok', 3000);
}

// ── Assegna metadata inverter/MPPT a ogni stringa ────────────────────────────

function _assignInverterMeta() {
  if (!strings.length || !_inverterList.length) return;
  let strCursor = 0;
  let invNumber = 0;
  _inverterList.forEach(inv => {
    for (let q = 0; q < inv.qty; q++) {
      invNumber++;
      const label = inv.qty > 1
        ? `Inverter ${invNumber} — ${inv.brand} ${inv.model} (${q+1}/${inv.qty})`
        : `Inverter ${invNumber} — ${inv.brand} ${inv.model}`;
      for (let m = 0; m < inv.mppt; m++) {
        for (let s = 0; s < inv.strPerMppt; s++) {
          if (strCursor < strings.length) {
            strings[strCursor].invIdx   = invNumber - 1;
            strings[strCursor].invLabel = label;
            strings[strCursor].mpptIdx  = m;
            strCursor++;
          }
        }
      }
    }
  });
}

function setInverterFilter(val) {
  _highlightInvIdx = parseInt(val);
  draw();
}

function _updateInvFilterSel() {
  const sel = document.getElementById('invFilterSel');
  if (!sel) return;
  // Mostra il filtro solo se ci sono stringhe e almeno 2 unità inverter
  let totalUnits = 0;
  _inverterList.forEach(inv => { totalUnits += inv.qty; });
  if (strings.length === 0 || totalUnits < 2) {
    sel.style.display = 'none';
    _highlightInvIdx = -1;
    return;
  }
  let html = '<option value="-1">Tutti inverter</option>';
  let invNumber = 0;
  _inverterList.forEach(inv => {
    for (let q = 0; q < inv.qty; q++) {
      invNumber++;
      const label = inv.qty > 1
        ? `Inv ${invNumber} (${inv.model} #${q+1})`
        : `Inv ${invNumber} (${inv.model})`;
      html += `<option value="${invNumber - 1}">${label}</option>`;
    }
  });
  sel.innerHTML = html;
  sel.value = _highlightInvIdx >= 0 ? String(_highlightInvIdx) : '-1';
  sel.style.display = 'inline-block';
}

function confirmString() {
  closeString();
  genStrings(_getExpectedStringTotal());
  if (typeof calcCables === 'function') calcCables();
}

// ── genStrings ────────────────────────────────────────────────────────────────

function genStrings(numStrings, offset) {
  offset = offset || 0;
  let toAssign;
  if (offset === 0) {
    snapshot();
    strings = [];
    panels.forEach(p => { p.strId = null; p.stringColor = null; });
    toAssign = [...panels];
  } else {
    toAssign = panels.filter(p => !p.strId);
  }
  if (toAssign.length === 0) return;

  // Distribuzione MPPT-bilanciata (logica corretta):
  // Ogni MPPT ha strPerMppt stringhe che devono essere uguali tra loro.
  // MPPT diversi possono avere conteggi diversi → OK.
  // Condizione: toAssign.length % strPerMppt === 0 (già garantito da pannelli bilanciati).
  // Se non divisibile, distribuiamo comunque al meglio (1 MPPT sarà sbilanciato).
  const strPerMppt = _getProjectStrPerMpptMax();
  const numMppts   = (strPerMppt > 1 && numStrings % strPerMppt === 0)
    ? numStrings / strPerMppt : 0;

  let counts = [];
  if (numMppts > 0) {
    // Quanti pannelli totali per ogni MPPT (può variare tra MPPT)
    const totalPanels = toAssign.length;
    const basePerMppt = Math.floor(totalPanels / numMppts); // pannelli base per MPPT
    const extraMppts  = totalPanels % numMppts;             // MPPT che ricevono 1 pannello extra

    for (let m = 0; m < numMppts; m++) {
      const mpptTotal  = basePerMppt + (m < extraMppts ? 1 : 0);
      // Distribuisci mpptTotal tra strPerMppt stringhe in modo uguale
      const strBase    = Math.floor(mpptTotal / strPerMppt);
      const strExtra   = mpptTotal % strPerMppt; // se > 0, questo MPPT è sbilanciato
      for (let s = 0; s < strPerMppt; s++) {
        counts.push(strBase + (s < strExtra ? 1 : 0));
      }
    }
  } else {
    const base  = Math.floor(toAssign.length / numStrings);
    const resto = toAssign.length % numStrings;
    for (let i = 0; i < numStrings; i++) counts.push(base + (i < resto ? 1 : 0));
  }

  // AP-17g: accumulate locally, then commit once through the store.
  let cursor = 0;
  const _added = [];
  for (let i = 0; i < numStrings; i++) {
    const cnt   = counts[i] || 0;
    const num   = offset + i + 1;
    const color = engineeringColors[(offset + i) % engineeringColors.length];
    const slice = toAssign.slice(cursor, cursor + cnt);
    cursor += cnt;
    if (!slice.length) continue;
    slice.forEach(p => { p.strId = 'S' + num; p.stringColor = color; });
    _added.push({ id: 'S' + num, name: 'Stringa ' + num, color, panels: slice });
  }
  if (_added.length) globalThis.setStoreSlice('strings', strings.concat(_added));
  _assignInverterMeta();
  updateStringList(); updateLegend(); draw();
}

// ── updateStringList ──────────────────────────────────────────────────────────

function updateStringList() {
  const sideList  = DOM.stringList;
  const dropList  = DOM.stringsDropList;
  const dropCount = DOM.stringsDropCount;
  const dropdown  = DOM.stringsDropdown;
  const footer    = DOM.stringsDropFooter;
  const pwr       = parseInt(DOM.pp.value) || 400;

  if (strings.length === 0) {
    if (dropdown)  dropdown.style.display  = 'none';
    if (dropList)  dropList.innerHTML = '<div class="strings-dropdown-empty">Nessuna stringa configurata</div>';
    if (dropCount) { dropCount.textContent = ''; dropCount.style.display = 'none'; }
    if (sideList)  sideList.innerHTML = '';
    stringsVisible = true;
    if (DOM.stringsVisBtn) { DOM.stringsVisBtn.classList.remove('snap-on'); DOM.stringsVisBtn.classList.remove('active'); }
    _updateInvFilterSel();
    return;
  }

  // Toolbar: mostra il gruppo stringhe e aggiorna badge
  if (dropdown) dropdown.style.display = 'inline-flex';
  if (DOM.stringsVisBtn) {
    DOM.stringsVisBtn.classList.add('snap-on');
    DOM.stringsVisBtn.title = 'Stringhe visibili — clicca per nascondere';
  }
  if (dropCount) { dropCount.textContent = strings.length; dropCount.style.display = 'inline-block'; }

  const totKwp = strings.reduce((acc, str) => acc + str.panels.length * pwr, 0) / 1000;

  // ── Toolbar dropdown panel ─────────────────────────────────────────────────
  if (dropList) {
    dropList.innerHTML = '';
    strings.forEach((s, idx) => {
      const kwp = (s.panels.length * pwr / 1000).toFixed(2);
      const div = document.createElement('div');
      div.className = 'strings-dropdown-item';
      div.innerHTML = `
        <div class="strings-dropdown-swatch" style="background:${s.color};"
          onclick="openColorPicker(${idx})" title="Cambia colore"></div>
        <div class="strings-dropdown-info">
          <div class="strings-dropdown-name">${s.name}</div>
          <div class="strings-dropdown-sub">${s.panels.length} moduli</div>
        </div>
        <div class="strings-dropdown-badge">${kwp} kWp</div>
      `;
      dropList.appendChild(div);
    });
    if (footer) footer.textContent = `Totale: ${strings.length} stringhe · ${totKwp.toFixed(2)} kWp`;
  }

  // ── Sidebar lista stringhe — riepilogo per inverter/MPPT ─────────────────
  if (sideList) {
    const wasOpen = sideList.querySelector('.str-list-body') === null
                    || sideList.querySelector('.str-list-body.open') !== null;
    sideList.innerHTML = '';

    const body = document.createElement('div');
    body.className = 'str-list-body' + (wasOpen ? ' open' : '');

    const toggle = document.createElement('button');
    toggle.className = 'str-list-toggle btn-secondary' + (wasOpen ? ' open' : '');
    toggle.innerHTML = `Stringhe generate <span style="font-weight:normal;color:var(--text-secondary);">(${strings.length})</span><span class="str-list-arrow">▾</span>`;
    toggle.onclick = function() { this.classList.toggle('open'); body.classList.toggle('open'); };
    sideList.appendChild(toggle);

    // Costruisci riepilogo per inverter
    const strPerMppt = _getProjectStrPerMpptMax();

    // Raggruppa le stringhe in MPPT (strPerMppt stringhe per MPPT)
    const numMppts = Math.ceil(strings.length / strPerMppt);
    const mpptList = []; // [{modsPerStr, kwp}]
    for (let m = 0; m < numMppts; m++) {
      const sl = strings.slice(m * strPerMppt, (m + 1) * strPerMppt);
      mpptList.push({
        modsPerStr: sl[0] ? sl[0].panels.length : 0,
        kwp: sl.reduce((s, x) => s + x.panels.length * pwr, 0) / 1000
      });
    }
    // stringhe rimanenti (non complete per MPPT)
    const remainder = strings.length % strPerMppt;
    if (remainder > 0) {
      const remDiv = document.createElement('div');
      remDiv.style.cssText = 'font-size:var(--fs-xs);color:var(--warning-text);padding:4px 0;';
      remDiv.textContent = `${remainder} stringa/he residue fuori gruppo MPPT completo`;
      body.appendChild(remDiv);
    }

    // Assegna MPPT agli inverter
    let mpptCursor = 0;
    let invNumber = 0;
    const invRows = _inverterList.length > 0 ? _inverterList : null;

    if (invRows) {
      invRows.forEach(inv => {
        for (let q = 0; q < inv.qty; q++) {
          invNumber++;
          const invMppts = mpptList.slice(mpptCursor, mpptCursor + inv.mppt);
          mpptCursor += inv.mppt;

          // Raggruppa MPPT per conteggio moduli per stringa
          const groups = new Map(); // modsPerStr → {mpptCount, kwp}
          invMppts.forEach(m => {
            if (!groups.has(m.modsPerStr)) groups.set(m.modsPerStr, { mpptCount: 0, kwp: 0 });
            const g = groups.get(m.modsPerStr);
            g.mpptCount++;
            g.kwp += m.kwp;
          });

          const label = inv.qty > 1
            ? `Inverter ${invNumber} — ${inv.brand} ${inv.model} (${q+1}/${inv.qty})`
            : `Inverter ${invNumber} — ${inv.brand} ${inv.model}`;

          const invKwp = invMppts.reduce((s, m) => s + m.kwp, 0);

          let linesHtml = '';
          groups.forEach((g, mods) => {
            const numStr = g.mpptCount * inv.strPerMppt;
            linesHtml += `<div style="display:flex;justify-content:space-between;align-items:baseline;padding:2px 0;">
              <span style="color:var(--text-secondary);">
                ${g.mpptCount} MPPT &times; ${inv.strPerMppt} str da <b style="color:var(--text-primary);">${mods} mod</b>
              </span>
              <span style="font-weight:600;color:var(--accent-text);">${g.kwp.toFixed(2)} kWp</span>
            </div>`;
          });

          const invDiv = document.createElement('div');
          invDiv.style.cssText = 'border:1px solid var(--border-default);border-radius:var(--radius-sm);padding:7px 10px;margin-bottom:6px;background:var(--bg-secondary);';
          invDiv.innerHTML = `
            <div style="font-size:var(--fs-xs);font-weight:700;color:var(--text-primary);margin-bottom:5px;display:flex;justify-content:space-between;">
              <span>${label}</span>
              <span style="color:var(--accent-text);">${invKwp.toFixed(2)} kWp</span>
            </div>
            <div style="font-size:var(--fs-xs);">${linesHtml}</div>`;
          body.appendChild(invDiv);
        }
      });
    } else {
      // Nessun inverter: mostra conteggio semplice
      const div = document.createElement('div');
      div.style.cssText = 'font-size:var(--fs-xs);color:var(--text-secondary);padding:4px 0;';
      div.textContent = `${strings.length} stringhe configurate`;
      body.appendChild(div);
    }

    const foot = document.createElement('div');
    foot.className = 'str-list-footer';
    foot.textContent = `${strings.length} stringhe · ${totKwp.toFixed(2)} kWp totali`;
    body.appendChild(foot);

    sideList.appendChild(body);
  }
  _updateInvFilterSel();
}

// ── Toggle dropdown stringhe ──────────────────────────────────────────────────

function toggleStringsDropdown(e) {
  if (e) e.stopPropagation();
  const panel = DOM.stringsDropPanel;
  const btn   = DOM.stringsDropBtn;
  if (!panel) return;
  const isOpen = panel.classList.contains('visible');
  panel.classList.toggle('visible', !isOpen);
  btn.classList.toggle('open', !isOpen);
}

// ── Color picker ──────────────────────────────────────────────────────────────

function openColorPicker(stringIdx) {
  editingStringIdx = stringIdx;
  selectedColor = strings[stringIdx].color;
  const picker = DOM.colorPicker;
  picker.innerHTML = '';
  engineeringColors.forEach(color => {
    const div = document.createElement('div');
    div.className = 'color-option' + (color === selectedColor ? ' selected' : '');
    div.style.background = color;
    div.onclick = () => {
      selectedColor = color;
      document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
      div.classList.add('selected');
    };
    picker.appendChild(div);
  });
  DOM.colorModalTitle.textContent = `Colore ${strings[stringIdx].name}`;
  DOM.colorModal.classList.add('visible');
}

function closeColorModal() {
  DOM.colorModal.classList.remove('visible');
  editingStringIdx = null; selectedColor = null;
}

function deleteString(idx) {
  _sdpConfirm(`Eliminare ${strings[idx].name}?`, () => {
    snapshot();
    strings[idx].panels.forEach(p => { p.strId = null; p.stringColor = null; });
    // AP-17g: route write through store.
    globalThis.setStoreSlice('strings', strings.filter((_, i) => i !== idx));
    strings.forEach((s, i) => { s.id = 'S' + (i + 1); s.name = 'Stringa ' + (i + 1); s.panels.forEach(p => { p.strId = s.id; }); });
    updateStringList(); updateLegend(); updateStats(); draw();
  });
}

function confirmColorChange() {
  if (editingStringIdx !== null && selectedColor !== null) {
    snapshot();
    strings[editingStringIdx].color = selectedColor;
    strings[editingStringIdx].panels.forEach(panel => { panel.stringColor = selectedColor; });
    updateStringList(); updateLegend(); draw();
  }
  closeColorModal();
}

// ── Legenda e statistiche ─────────────────────────────────────────────────────

/** Rimossa: stringhe gestite in sidebar */
function updateLegend() {}

// ── Paint mode (colorazione manuale pannelli) ─────────────────────────────────

function togglePaintMode() {
  if (strings.length === 0) { showToast('Genera le stringhe prima di usare la modalità colorazione', 'warn'); return; }
  paintMode = !paintMode;
  paintStringIdx = Math.min(paintStringIdx, strings.length - 1);
  const btn = document.getElementById('paintModeBtn');
  if (btn) btn.classList.toggle('snap-on', paintMode);
  if (paintMode && !stringsVisible) toggleStringsVisible();
  _updatePaintSelector();
  draw();
}

function _updatePaintSelector() {
  const sel = document.getElementById('paintStringSel');
  if (!sel) return;
  sel.innerHTML = strings.map((s, i) =>
    `<option value="${i}" style="color:${s.color};">${s.name} (${s.panels.length} mod.)</option>`
  ).join('');
  sel.value = paintStringIdx;
  sel.style.display = paintMode ? 'inline-block' : 'none';
}

function setPaintString(idx) {
  paintStringIdx = parseInt(idx);
}

function paintPanelToString(panelIdx) {
  const pan = panels[panelIdx];
  if (!pan) return;
  const targetStr = strings[paintStringIdx];
  if (!targetStr) return;
  if (pan.strId === targetStr.id) return;

  if (pan.strId) {
    const oldStr = strings.find(s => s.id === pan.strId);
    if (oldStr) {
      const i = oldStr.panels.indexOf(pan);
      if (i >= 0) oldStr.panels.splice(i, 1);
    }
  }

  pan.strId = targetStr.id;
  pan.stringColor = targetStr.color;
  targetStr.panels.push(pan);

  updateStringList();
  updateLegend();
  if (typeof calcCables === 'function') calcCables();
  draw();
}

function updateStats() {
  const tot = panels.length;
  const pwr = parseInt(DOM.pp.value);
  const totalKwStr = (tot * pwr / 1000).toFixed(2);
  const area = (tot * parseFloat(DOM.pw.value) * parseFloat(DOM.pl.value)).toFixed(2);
  DOM.totalP.textContent  = tot;
  DOM.totalKw.textContent = totalKwStr + ' kWp';
  DOM.totalA.textContent  = area + ' m²';
}

function toggleStringsVisible() {
  stringsVisible = !stringsVisible;
  const btn = DOM.stringsVisBtn;
  if (btn) {
    if (stringsVisible) {
      btn.classList.add('snap-on');
      btn.title = 'Stringhe visibili — clicca per nascondere';
    } else {
      btn.classList.remove('snap-on');
      btn.title = 'Stringhe nascoste — clicca per mostrare';
    }
  }
  requestDraw();
}



// ── js/pdf.js ──
// ── pdf.js — Caricamento e gestione PDF ──

'use strict';

// CARICAMENTO FILE (immagine / PDF)
function loadFile(e) {
  const f = e.target.files[0];
  if (!f) return;
  e.target.value = ''; // reset so same file can be re-selected
  const isPDF = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
  if (isPDF) {
    loadPDF(f);
  } else {
    loadImageFile(f);
  }
}

function loadImageFile(f) {
  // Resetta snap PDF dal documento precedente
  _pdfDoc = null; _pdfSnapPoints = []; _pdfSnapEnabled = false;
  if (DOM.pdfSnapToggle) { DOM.pdfSnapToggle.classList.remove('snap-on'); DOM.pdfSnapToggle.style.display = 'none'; }
  const r = new FileReader();
  r.onload = ev => {
    const i = new Image();
    i.onload = () => {
      img = i;
      resetView();
      DOM.welcome.classList.add('hidden');
      DOM.compass.classList.add('visible');
      DOM.fileStatus.textContent = '';
      enable('s2');
      draw();
    };
    i.src = ev.target.result;
  };
  r.readAsDataURL(f);
}

function loadPDF(file) {
  const status = DOM.fileStatus;
  status.textContent = '⏳ Caricamento PDF…';
  _ensurePdfJs().then(() => {
    const reader = new FileReader();
    reader.onload = ev => {
      const typedArr = new Uint8Array(ev.target.result);
      pdfjsLib.getDocument({ data: typedArr }).promise.then(pdfDoc => {
        _pdfDoc = pdfDoc;
        _pdfPage = 1;
        status.textContent = `PDF ${pdfDoc.numPages} pag.`;
        if (pdfDoc.numPages === 1) {
          _renderPdfPageToImg(_pdfPage).then(imgEl => {
            img = imgEl;
            resetView();
            DOM.welcome.classList.add('hidden');
            DOM.compass.classList.add('visible');
            enable('s2');
            draw();
          });
        } else {
          _openPdfModal();
        }
      }).catch(err => {
        const errMsg = (err && err.message) ? err.message.toLowerCase() : String(err).toLowerCase();
        let friendlyMsg;
        if (errMsg.includes('password')) {
          friendlyMsg = 'PDF protetto da password - non supportato';
        } else if (errMsg.includes('invalid pdf') || errMsg.includes('corrupt')) {
          friendlyMsg = 'PDF danneggiato o non valido';
        } else {
          friendlyMsg = 'Errore caricamento PDF. Prova con un altro file o converti in JPG/PNG';
        }
        status.textContent = ' ' + friendlyMsg;
        showToast(friendlyMsg, 'error', 5000);
        console.error('PDF load error:', err);
      });
    };
    reader.readAsArrayBuffer(file);
  }).catch(() => {
    status.textContent = ' Impossibile caricare pdf.js (verifica connessione)';
  });
}

function _ensurePdfJs() {
  if (window.pdfjsLib) return Promise.resolve();
  const CDN = 'vendor/pdfjs/';
  const loadScript = src => new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
  return loadScript(CDN + 'pdf.min.js')
    .then(() => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = CDN + 'pdf.worker.min.js';
      return loadScript(CDN + 'pdf.worker.min.js');
    });
}

// ── PDF snap helpers — estratte a livello modulo per evitare ri-creazione ad ogni page render ──
function _pdfProcessOps(fnArray, argsArray, ctm, POPS, addPt) {
  let curCTM = ctm ? [...ctm] : null;
  for (let k = 0; k < fnArray.length; k++) {
    const fn = fnArray[k];
    const args = argsArray[k];
    if (fn === POPS.constructPath || fn === undefined) continue;
    if (fn === POPS.moveTo || fn === POPS.lineTo) {
      if (args && args.length >= 2) addPt(args[0], args[1], curCTM);
    } else if (fn === POPS.curveTo) {
      if (args && args.length >= 6) { addPt(args[4], args[5], curCTM); }
    } else if (fn === POPS.curveTo2) {
      if (args && args.length >= 4) addPt(args[2], args[3], curCTM);
    } else if (fn === POPS.curveTo3) {
      if (args && args.length >= 4) addPt(args[2], args[3], curCTM);
    } else if (fn === POPS.rectangle) {
      if (args && args.length >= 4) {
        const [rx, ry, rw, rh] = args;
        addPt(rx, ry, curCTM); addPt(rx+rw, ry, curCTM);
        addPt(rx+rw, ry+rh, curCTM); addPt(rx, ry+rh, curCTM);
      }
    } else if (fn === POPS.transform) {
      if (args && args.length >= 6) {
        const [a,b,c,d,e,f] = args;
        if (curCTM) {
          curCTM = [
            a*curCTM[0]+b*curCTM[2], a*curCTM[1]+b*curCTM[3],
            c*curCTM[0]+d*curCTM[2], c*curCTM[1]+d*curCTM[3],
            e*curCTM[0]+f*curCTM[2]+curCTM[4], e*curCTM[1]+f*curCTM[3]+curCTM[5]
          ];
        } else {
          curCTM = [a,b,c,d,e,f];
        }
      }
    }
  }
}

function _pdfProcessConstructPath(fnArray, argsArray, ctm, POPS, addPt) {
  for (let k = 0; k < fnArray.length; k++) {
    const fn = fnArray[k];
    const args = argsArray[k];
    if (fn === POPS.constructPath && args) {
      const subOps = args[0];
      const coords = args[1];
      let ci = 0;
      for (let s = 0; s < subOps.length; s++) {
        const sop = subOps[s];
        if (sop === POPS.moveTo || sop === POPS.lineTo) {
          if (ci+1 < coords.length) { addPt(coords[ci], coords[ci+1], ctm); ci+=2; }
        } else if (sop === POPS.curveTo) {
          if (ci+5 < coords.length) { addPt(coords[ci+4], coords[ci+5], ctm); ci+=6; }
        } else if (sop === POPS.rectangle) {
          if (ci+3 < coords.length) {
            addPt(coords[ci], coords[ci+1], ctm);
            addPt(coords[ci]+coords[ci+2], coords[ci+1], ctm);
            addPt(coords[ci]+coords[ci+2], coords[ci+1]+coords[ci+3], ctm);
            addPt(coords[ci], coords[ci+1]+coords[ci+3], ctm);
            ci+=4;
          }
        }
      }
    }
  }
}

function _renderPdfPageToImg(pageNum) {
  return _pdfDoc.getPage(pageNum).then(page => {
    const viewport = page.getViewport({ scale: _pdfScale });
    const offCanvas = document.createElement('canvas');
    offCanvas.width = Math.round(viewport.width);
    offCanvas.height = Math.round(viewport.height);
    const ctx2 = offCanvas.getContext('2d');
    return page.render({ canvasContext: ctx2, viewport }).promise.then(() => {
      const i = new Image();
      i.width = offCanvas.width;
      i.height = offCanvas.height;
      i.src = offCanvas.toDataURL('image/png');
      // ── Extract vector snap points from PDF path operators ──
      page.getOperatorList().then(async ops => {
        _pdfSnapPoints = [];
        const POPS = pdfjsLib.OPS;

        const addPt = (px, py, xf) => {
          let wx, wy;
          if (xf) {
            wx = xf[0]*px + xf[2]*py + xf[4];
            wy = xf[1]*px + xf[3]*py + xf[5];
          } else {
            wx = px; wy = py;
          }
          const t = viewport.transform;
          const cx = t[0]*wx + t[2]*wy + t[4];
          const cy = t[1]*wx + t[3]*wy + t[5];
          if (!Number.isFinite(cx) || !Number.isFinite(cy)) return;
          if (cx < -10 || cy < -10 || cx > offCanvas.width+10 || cy > offCanvas.height+10) return;
          // Converti subito in world coords (non dipende da img al momento dello snap)
          if (img) _pdfSnapPoints.push({wx: cx - img.width/2, wy: cy - img.height/2});
        };

        _pdfProcessOps(ops.fnArray, ops.argsArray, null, POPS, addPt);
        _pdfProcessConstructPath(ops.fnArray, ops.argsArray, null, POPS, addPt);

        // Deduplicate: remove points within 1.5px of each other — O(n) with spatial grid
        const CELL = 3; // bucket size in px (> 2× threshold of 1.5)
        const gridMap = new Map();
        const deduped = [];
        _pdfSnapPoints.forEach(p => {
          const bx = Math.floor(p.wx / CELL);
          const by = Math.floor(p.wy / CELL);
          let found = false;
          for (let dx = -1; dx <= 1 && !found; dx++) {
            for (let dy = -1; dy <= 1 && !found; dy++) {
              const key = (bx+dx) + '|' + (by+dy);
              if (gridMap.has(key)) found = true;
            }
          }
          if (!found) {
            gridMap.set(bx + '|' + by, true);
            deduped.push(p);
          }
        });
        _pdfSnapPoints = deduped;

        // Show snap toggle — always visible when PDF is loaded, show count
        const snapToggle = DOM.pdfSnapToggle;
        if (snapToggle) {
          snapToggle.style.display = 'inline-flex';
          snapToggle.title = `Snap PDF: ${_pdfSnapPoints.length} vertici rilevati`;
          snapToggle.style.display = 'inline-flex';
          const lbl1 = document.getElementById('pdfSnapLabel');
          if (lbl1) lbl1.textContent = `Snap PDF (${_pdfSnapPoints.length})`;
        }
      }).catch(err => {
        console.warn('PDF snap extraction failed:', err);
        _pdfSnapPoints = [];
        const snapToggle = DOM.pdfSnapToggle;
        if (snapToggle) {
          snapToggle.style.display = 'inline-flex';
          snapToggle.title = 'Snap PDF: errore estrazione vertici';
          const lbl2 = document.getElementById('pdfSnapLabel');
          if (lbl2) lbl2.textContent = 'Snap PDF (0)';
        }
      });
      return new Promise(res => { i.onload = () => res(i); });
    });
  });
}

function _openPdfModal() {
  _pdfPage = 1;
  _updatePdfThumb();
  DOM.pdfPageModal.classList.add('visible');
}

function closePdfModal() {
  DOM.pdfPageModal.classList.remove('visible');
  const fi = DOM.imgFile;
  if (fi) fi.value = '';
  DOM.fileStatus.textContent = '';
}

function pdfPageNav(delta) {
  if (!_pdfDoc) return;
  _pdfPage = Math.max(1, Math.min(_pdfDoc.numPages, _pdfPage + delta));
  _updatePdfThumb();
}

function _updatePdfThumb() {
  if (!_pdfDoc) return;
  const label = DOM.pdfPageLabel;
  const dpiInfo = DOM.pdfDpiInfo;
  label.textContent = `Pagina ${_pdfPage} / ${_pdfDoc.numPages}`;
  _pdfDoc.getPage(_pdfPage).then(page => {
    const vpFull = page.getViewport({ scale: 1 });
    const thumbScale = Math.min(2, 300 / Math.max(vpFull.width, vpFull.height));
    const vp = page.getViewport({ scale: thumbScale });
    const tc = DOM.pdfThumb;
    tc.width = Math.round(vp.width);
    tc.height = Math.round(vp.height);
    page.render({ canvasContext: tc.getContext('2d'), viewport: vp }).promise.then(() => {
      const fullW = Math.round(vpFull.width * _pdfScale);
      const fullH = Math.round(vpFull.height * _pdfScale);
      dpiInfo.textContent = `Risoluzione finale: ${fullW} × ${fullH} px`;
    });
  });
}

function confirmPdfPage() {
  DOM.pdfPageModal.classList.remove('visible');
  const status = DOM.fileStatus;
  status.textContent = '⏳ Rendering pagina…';
  _renderPdfPageToImg(_pdfPage).then(imgEl => {
    img = imgEl;
    resetView();
    DOM.welcome.classList.add('hidden');
    DOM.compass.classList.add('visible');
    status.textContent = `PDF pag. ${_pdfPage}/${_pdfDoc.numPages}`;
    enable('s2');
    draw();
  });
}

function togglePdfSnap() {
  _pdfSnapEnabled = !_pdfSnapEnabled;
  const btn = DOM.pdfSnapToggle;
  if (!btn) return;
  const lbl = document.getElementById('pdfSnapLabel');
  if (_pdfSnapEnabled) {
    btn.classList.add('snap-on');
    if (lbl) lbl.textContent = `Snap PDF (${_pdfSnapPoints.length})`;
    btn.title = `Snap PDF attivo — ${_pdfSnapPoints.length} vertici`;
  } else {
    btn.classList.remove('snap-on');
    if (lbl) lbl.textContent = `Snap PDF`;
    btn.title = 'Snap PDF disattivo';
  }
  draw();
}


// ── js/export.js ──
// ── export.js — Esportazione PDF, JSON, stampa ──

'use strict';

/** Salva il progetto come file .sdproj (formato sdproj/1) tramite system
 *  dialog. Auto-save in localStorage continua a funzionare come recovery
 *  snapshot. Vedi docs/sdproj-schema.md. */
async function salvaProgetto() {
  _persistState(); // recovery snapshot
  const doc  = buildSdprojDocument();
  const json = JSON.stringify(doc, null, 2);
  const dt   = new Date().toISOString().slice(0, 10);
  const safeName = (doc.metadata.projectName || 'progetto-fv').replace(/[^a-zA-Z0-9._-]+/g, '_');
  const suggestedName = safeName + '-' + dt + '.sdproj';
  if (window.showSaveFilePicker) {
    try {
      const fh = await window.showSaveFilePicker({
        suggestedName,
        types: [{ description: 'Progetto Solar Designer (.sdproj)', accept: { 'application/json': ['.sdproj'] } }]
      });
      const w = await fh.createWritable();
      await w.write(json); await w.close();
      showToast('Progetto salvato ✓', 'success', 2000);
      return;
    } catch(e) { if (e.name === 'AbortError') return; }
  }
  // Fallback: download classico
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = suggestedName;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  showToast('Progetto salvato ✓', 'success', 2000);
}

/** Esporta il progetto come file JSON (solo download, senza salvare su localStorage). */
async function saveProjectJSON() {
  const state = _buildFullState();
  const json  = JSON.stringify(state, null, 2);
  const dt    = new Date().toISOString().slice(0, 10);
  const suggestedName = 'progetto-fv-' + dt + '.json';
  if (window.showSaveFilePicker) {
    try {
      const fh = await window.showSaveFilePicker({
        suggestedName,
        types: [{ description: 'Progetto Solar Designer', accept: { 'application/json': ['.json'] } }]
      });
      const w = await fh.createWritable();
      await w.write(json); await w.close();
      showToast('File esportato ✓', 'success', 2000);
      return;
    } catch(e) { if (e.name === 'AbortError') return; }
  }
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = suggestedName;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  showToast('File esportato ✓', 'success', 2000);
}

/**
 * Carica un progetto da file JSON.
 * @param {Event} event - input file change event
 */
function loadProjectJSON(event) {
  const f=event.target.files[0];
  if (!f) return;
  const reader=new FileReader();
  reader.onload=ev=>{
    try {
      const raw=JSON.parse(ev.target.result);
      // Explicit file-open uses the shared reader in strict mode: no
      // versionless guessing. Surface unsupported / invalid as toast.
      const result = readPersistedProject(raw);
      if (result.kind === 'unsupported') {
        throw new Error('Formato non supportato (' + result.reason + '). Aggiorna l\'applicazione.');
      }
      if (result.kind === 'invalid') {
        throw new Error(result.reason);
      }
      const s = result.payload;
      if (result.metadata && typeof result.metadata.createdAt === 'string') {
        _setProjectCreatedAt(result.metadata.createdAt);
      }

      if(!Array.isArray(s.installableAreas))throw new Error('installableAreas mancante');
      if(!Array.isArray(s.panels))throw new Error('panels mancante');
      if(!Array.isArray(s.exclusionAreas))throw new Error('exclusionAreas mancante');
      scale=s.scale||1; panelOrientation=s.panelOrientation||'auto'; walkwaysEnabled=s.walkwaysEnabled||false;
      installableAreas=s.installableAreas.map(a=>({
        ...a,
        orientation:     a.orientation     || 'auto',
        staggerEnabled:  a.staggerEnabled  || false,
        staggerOffset:   a.staggerOffset   !== undefined ? a.staggerOffset : 50,
        walkwaysEnabled: a.walkwaysEnabled || false,
        walkwayInterval: a.walkwayInterval !== undefined ? a.walkwayInterval : 3,
        walkwayWidth:    a.walkwayWidth    !== undefined ? a.walkwayWidth   : 80,
        walkwayDir:      a.walkwayDir      || 'row',
        walkRowEnabled:  a.walkRowEnabled  || false,
        walkRowInterval: a.walkRowInterval !== undefined ? a.walkRowInterval : 3,
        walkRowWidth:    a.walkRowWidth    !== undefined ? a.walkRowWidth    : 80,
        walkColEnabled:  a.walkColEnabled  || false,
        walkColInterval: a.walkColInterval !== undefined ? a.walkColInterval : 3,
        walkColWidth:    a.walkColWidth    !== undefined ? a.walkColWidth    : 80,
      }));
      exclusionAreas=s.exclusionAreas||[];
      technicalObjects=s.technicalObjects||[]; strings=s.strings||[];
      panels=s.panels||[];
      _inverterList=s.inverterList||[];
      selectedPanels=new Set(); hoveredPanel=-1;
      if (s.moduleParams) {
        ['pw','pl','pp','ps','safetyMargin','obstacleDistance',
         'walkwayInterval','walkwayWidth','staggerOffset'].forEach(k=>{
          const el=document.getElementById(k);
          if (el && s.moduleParams[k] !== undefined) el.value=s.moduleParams[k];
        });
        if (s.moduleParams.enableStagger !== undefined) {
          DOM.enableStagger.checked = s.moduleParams.enableStagger;
          DOM.staggerSettings.style.display = s.moduleParams.enableStagger ? 'block' : 'none';
        }
      }
      if (s.calPts && s.calPts.length === 2) {
        calPts = s.calPts;
      }
      // Ripristina dati cartiglio schema unifilare
      if (s.cartiglio) {
        const cm = s.cartiglio;
        const _sv = (id, val) => { const el=document.getElementById(id); if(el&&val!==undefined) el.value=val; };
        _sv('cartCommittente',    cm.committente);
        _sv('cartIndirizzo',      cm.indirizzo);
        _sv('cartProgettista',    cm.progettista);
        _sv('cartAlbo',           cm.albo);
        _sv('cartNumDisegno',     cm.numDisegno);
        _sv('cartRevisione',      cm.revisione);
        _sv('cartSpiModello',     cm.spiModello);
        _sv('cartSpiMatricola',   cm.spiMatricola);
        _sv('cartSpiCertificato', cm.spiCertificato);
      }
      strings.forEach(str=>{
        str.panels=str.panels.map(sp=>{
          const live=panels.find(p=>p.areaIdx===sp.areaIdx&&p.row===sp.row&&p.column===sp.column);
          return live||sp;
        });
      });
      panels.forEach(p=>{
        const str=strings.find(s=>s.id===p.strId);
        if (str) p.stringColor=str.color;
      });
      if (installableAreas.length>0) ['s2','s3','s4','s5','s6'].forEach(id=>enable(id));
      if (installableAreas.length>0) { _updateToolbarGroups(); }
      if (panels.length>0) {
        enable('s7');enable('s8');
        if(DOM.deletePanelsBtn) DOM.deletePanelsBtn.style.display='block';
        _updateToolbarGroups();
      }
      if (scale>1){DOM.calStatus.textContent=' (da file)';DOM.calStatus.classList.add('success');}
      setOrientation(panelOrientation, true);
      DOM.enableWalkways.checked=walkwaysEnabled;
      DOM.walkwaySettings.style.display=walkwaysEnabled?'block':'none';
      _selectedTechIdx=-1;
      DOM.techRotRow.style.display='none';
      updateAreaLists();updateStringList();updateLegend();updateStats();
      if (_inverterList.length > 0) updateInverterListUI();
      // Non mostrare welcome overlay — dati caricati, canvas mostra aree e pannelli
      DOM.welcome.classList.add('hidden');
      snapshot();
      // Centra la vista sui dati caricati
      if (installableAreas.length > 0 || panels.length > 0) {
        const allPts = [];
        installableAreas.forEach(a => allPts.push(...a.points));
        if (allPts.length > 0) {
          const xs = allPts.map(p=>p.x), ys = allPts.map(p=>p.y);
          ox = -((Math.min(...xs)+Math.max(...xs))/2) * z;
          oy = -((Math.min(...ys)+Math.max(...ys))/2) * z;
        }
      }
      draw();
      _persistState();
      showToast('Progetto caricato ✓','success',2000);
    } catch(err) { showToast('Errore nel file: '+err.message,'error',5000); }
  };
  reader.readAsText(f);
  event.target.value='';
}

function resetAll() {
  _sdpConfirm('NUOVO PROGETTO: Tutti i dati saranno persi. Continuare?', () => {
    panels=[];installableAreas=[];exclusionAreas=[];technicalObjects=[];strings=[];curPts=[];calPts=[];
    selectedPanels=new Set();img=null;mode='none';curAreaType=null;_orthoRefAngle=null;
    hoveredPanel=-1;moveMode=false;panelOrientation='auto';walkwaysEnabled=false;
    scale=1;z=1;ox=0;oy=0;_selectedTechIdx=-1;_isDraggingTechRot=false;
    vertexEditMode=false;_vtxDragging=false;_vtxAreaIdx=-1;_vtxIdx=-1;_vtxHoverArea=null;
    stringsVisible=true;
    _updateToolbarGroups();
    DOM.techRotRow.style.display='none';
    const fi=DOM.imgFile;if(fi)fi.value='';
    _pdfDoc=null;_pdfPage=1;
    _pdfSnapPoints=[];_pdfSnapEnabled=false;
    metricSnapM=0;
    _distInputOpen=false;
    if(DOM.distInput)DOM.distInput.style.display='none';
    if(DOM.pdfSnapToggle){DOM.pdfSnapToggle.classList.remove('snap-on');DOM.pdfSnapToggle.style.display='none';}
    if(DOM.snapGridInput){DOM.snapGridInput.value=0;}
    DOM.fileStatus.textContent='';
    localStorage.removeItem(LS_KEY);
    _undoStack.length=0;_redoStack.length=0;_updateUndoUI();
    DOM.enableWalkways.checked=false;
    DOM.walkwaySettings.style.display='none';
    DOM.calStatus.textContent='';
    DOM.calStatus.classList.remove('success');
    setOrientation('auto');
    ['s2','s3','s4','s5','s6','s7','s8'].forEach(id=>document.getElementById(id).classList.add('disabled'));
    DOM.welcome.classList.remove('hidden');
    DOM.compass.classList.remove('visible');
    if(DOM.deletePanelsBtn) DOM.deletePanelsBtn.style.display='none';
    _updateToolbarGroups();

    snapEnabled=true;
    orthoEnabled=true;
    if(DOM.orthoBtn){DOM.orthoBtn.classList.add('snap-on');}
    DOM.areaBtn.classList.remove('active');
    DOM.exclusionBtn.classList.remove('active');
    if (moveMode) if(DOM.moveBtn) DOM.moveBtn.classList.remove('active');
    updateAreaLists();updateStringList();updateLegend();updateStats();
    draw();
  });
}

// ── Build PDF (genera blob PDF dal JPEG del canvas di esportazione) ──
function buildPDF(jpegDataUrl, pageW_mm, pageH_mm) {
  const pt=v=>v*2.8346;
  const enc=new TextEncoder();
  const b64=jpegDataUrl.split(',')[1];
  const bin=atob(b64);
  const jb=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++)jb[i]=bin.charCodeAt(i);
  let jW=1,jH=1;
  for(let i=0;i<jb.length-8;i++){
    if(jb[i]===0xFF&&(jb[i+1]===0xC0||jb[i+1]===0xC2)){jH=(jb[i+5]<<8)|jb[i+6];jW=(jb[i+7]<<8)|jb[i+8];break;}
  }
  const parts=[],off=[];let pos=0;
  const push=b=>{parts.push(b);pos+=b.length;};
  const S=t=>enc.encode(t);
  push(S('%PDF-1.4\n'));
  off.push(pos);push(S(`1 0 obj\n<< /Type /XObject /Subtype /Image /Width ${jW} /Height ${jH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jb.length} >>\nstream\n`));push(jb);push(S('\nendstream\nendobj\n'));
  off.push(pos);push(S('2 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n'));
  off.push(pos);push(S('3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n'));
  const PH=pt(pageH_mm),PW=pt(pageW_mm);
  const cs=enc.encode(`q ${PW.toFixed(2)} 0 0 ${PH.toFixed(2)} 0 0 cm /Im1 Do Q\n`);
  off.push(pos);push(S(`4 0 obj\n<< /Length ${cs.length} >>\nstream\n`));push(cs);push(S('\nendstream\nendobj\n'));
  off.push(pos);push(S('5 0 obj\n<< /Type /Pages /Kids [6 0 R] /Count 1 >>\nendobj\n'));
  off.push(pos);push(S(`6 0 obj\n<< /Type /Page /Parent 5 0 R /MediaBox [0 0 ${PW.toFixed(2)} ${PH.toFixed(2)}] /Contents 4 0 R /Resources << /Font << /F1 2 0 R /F2 3 0 R >> /XObject << /Im1 1 0 R >> >> >>\nendobj\n`));
  off.push(pos);push(S('7 0 obj\n<< /Type /Catalog /Pages 5 0 R >>\nendobj\n'));
  const xp=pos;
  let xref='xref\n0 8\n0000000000 65535 f \n';
  off.forEach(o=>xref+=String(o).padStart(10,'0')+' 00000 n \n');
  xref+=`trailer\n<< /Size 8 /Root 7 0 R >>\nstartxref\n${xp}\n%%EOF`;
  push(S(xref));
  return new Blob(parts,{type:'application/pdf'});
}

/**
 * Esporta il progetto corrente in PDF.
 * Formato e scala vengono scelti automaticamente in base alla planimetria.
 */
async function exportProj() {
  if(!img){showToast("Caricare un'immagine prima di esportare",'warn');return;}
  if(!panels.length){showToast('Posizionare almeno un modulo prima di esportare','warn');return;}
  const btn = document.getElementById('exportProjBtn') || document.querySelector('[onclick="exportProj()"]');
  const orig = btn ? btn.textContent : '';
  if (btn) { btn.textContent='⏳ PDF…'; btn.style.pointerEvents='none'; }
  const overlay=DOM.exportOverlay;
  DOM.exportLabel.textContent='Generazione PDF…';
  overlay.classList.add('visible');
  await new Promise(r=>setTimeout(r,80));
  let exportFont="'JetBrains Mono', 'SF Mono', monospace";
  try{
    const ff=new FontFace('JetBrains Mono',"url('assets/fonts/JetBrainsMono-Regular.woff2')");
    await ff.load();document.fonts.add(ff);exportFont='JetBrains Mono';
  }catch(_){ /* fall back to system 'SF Mono'/monospace */ }
  try{
    let pts=[];
    installableAreas.forEach(a=>pts.push(...a.points));
    exclusionAreas.forEach(a=>pts.push(...a.points));
    panels.forEach(p=>{
      if(p.axisUx!==undefined){const{localU:u,localV:v,w,h,axisUx:ux,axisUy:uy,axisVx:vx,axisVy:vy}=p;pts.push({x:u*ux+v*vx,y:u*uy+v*vy},{x:(u+w)*ux+v*vx,y:(u+w)*uy+v*vy},{x:(u+w)*ux+(v+h)*vx,y:(u+w)*uy+(v+h)*vy},{x:u*ux+(v+h)*vx,y:u*uy+(v+h)*vy});}
      else{pts.push({x:p.x,y:p.y},{x:p.x+p.w,y:p.y+p.h});}
    });
    const minX=Math.min(...pts.map(p=>p.x)),maxX=Math.max(...pts.map(p=>p.x));
    const minY=Math.min(...pts.map(p=>p.y)),maxY=Math.max(...pts.map(p=>p.y));
    const PAD=0.22;
    const bbW=(maxX-minX)*(1+PAD*2),bbH=(maxY-minY)*(1+PAD*2);
    const bbCx=(minX+maxX)/2,bbCy=(minY+maxY)/2;
    const MB=20,HD=22,FT=9,GP=4;
    const calibrated=(scale>1);
    const WM=calibrated?bbW/scale:null,HM=calibrated?bbH/scale:null;
    const avail=fmt=>({W:fmt.w-MB*2-Math.round(fmt.w*0.195)-GP,H:fmt.h-MB*2-HD-FT});
    const FMTS=[{n:'A3',w:420,h:297},{n:'A2',w:594,h:420},{n:'A1',w:841,h:594},{n:'A0',w:1189,h:841}];
    const SCALES=[100,200,500,1000,2000];
    let fmt,scDen,mmPerPx;
    if(calibrated){
      let found=false;
      outer: for(const d of SCALES){const mpm=1000/d,nW=WM*mpm,nH=HM*mpm;for(const f of FMTS){const av=avail(f);if(nW<=av.W&&nH<=av.H){fmt=f;scDen=d;mmPerPx=mpm/scale;found=true;break outer;}}}
      if(!found){fmt=FMTS[3];const av=avail(fmt);const mpm=Math.min(av.W/WM,av.H/HM)*0.97;scDen=Math.round(1000/mpm);mmPerPx=mpm/scale;}
    }else{fmt=FMTS[0];const av=avail(fmt);mmPerPx=Math.min(av.W/bbW,av.H/bbH)*0.97;scDen=null;}
    const PW=fmt.w,PH=fmt.h;
    const CW=Math.round(PW*0.195);
    const scStr=scDen?('1:'+scDen):'N.C.';
    const fmtStr=fmt.n;
    const avPlan=avail(fmt);
    const planX=MB,planY=MB+HD,planW=avPlan.W,planH=avPlan.H;
    const cartX=PW-MB-CW,cartY=MB-3,cartH=PH-(MB-3)*2;
    const DPI=300,MM=DPI/25.4;
    const cvW=Math.round(PW*MM),cvH=Math.round(PH*MM);
    const cv=document.createElement('canvas');cv.width=cvW;cv.height=cvH;
    const c=cv.getContext('2d');
    const px=mm=>mm*MM,FS=mm=>mm*MM;
    const fitText=(txt,maxW,fontMm,bold)=>{
      let f=fontMm;c.font=(bold?'bold ':'')+FS(f)+'px '+exportFont;
      while(f>fontMm*0.45&&c.measureText(txt).width>maxW){f-=fontMm*0.04;c.font=(bold?'bold ':'')+FS(f)+'px '+exportFont;}
      if(c.measureText(txt).width>maxW&&txt.length>1){while(txt.length>1&&c.measureText(txt+'…').width>maxW)txt=txt.slice(0,-1);return txt+'…';}
      return txt;
    };
    // Costanti bordi — devono precedere drawBorders()
    const BRD='#9ca3af', BRD_W=px(0.25);
    const drawSeg=(x1,y1,x2,y2)=>{c.strokeStyle=BRD;c.lineWidth=BRD_W;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();};

    // ── Sub-funzioni export (closure su c, px, FS, fitText, exportFont, layout vars) ──

    /** Disegna l'intestazione con titolo, kWp, scala, formato. */
    function drawHeader() {
      c.fillStyle='#ffffff';c.fillRect(px(MB-3),px(MB-3),px(cartX-MB-GP+3),px(HD+3));
      c.fillStyle='#16a34a';c.fillRect(px(MB-3),px(MB-3),px(2),px(HD+3));
      const hL=MB+4,hTE=MB+planW*0.50,hSS=MB+planW*0.78,hKC=(hTE+hSS)/2;
      c.strokeStyle='#e5e7eb';c.lineWidth=px(0.3);
      c.beginPath();c.moveTo(px(hTE),px(MB));c.lineTo(px(hTE),px(MB+HD-1));c.stroke();
      c.beginPath();c.moveTo(px(hSS),px(MB));c.lineTo(px(hSS),px(MB+HD-1));c.stroke();
      c.fillStyle='#111111';c.textBaseline='middle';c.textAlign='left';
      c.fillText(fitText('LAYOUT IMPIANTO FOTOVOLTAICO',px(hTE-hL-2),HD*0.30,true),px(hL),px(MB+HD*0.35));
      c.fillStyle='#9ca3af';c.fillText(fitText('Elaborato tecnico preliminare',px(hTE-hL-2),HD*0.14,false),px(hL),px(MB+HD*0.72));
      c.textAlign='center';c.fillStyle='#16a34a';
      c.fillText(fitText(kWp+' kWp',px((hSS-hTE)*0.88),HD*0.42,true),px(hKC),px(MB+HD*0.37));
      c.fillStyle='#6b7280';
      c.fillText(fitText(panels.length+' mod. · '+mq+' m² · '+cov+' copertura',px((hSS-hTE)*0.90),HD*0.13,false),px(hKC),px(MB+HD*0.76));
      c.textAlign='right';c.fillStyle='#6b7280';
      c.fillText(fitText('Scala '+scStr,px(cartX-GP-hSS-2),HD*0.14,false),px(cartX-GP-2),px(MB+HD*0.34));
      c.fillText(fitText('Formato '+fmtStr,px(cartX-GP-hSS-2),HD*0.14,false),px(cartX-GP-2),px(MB+HD*0.66));
      c.textAlign='left';
    }

    /** Disegna planimetria, aree, pannelli, oggetti tecnici, etichette e freccia nord. */
    function drawPlan() {
      c.fillStyle='#f6f6f6';c.fillRect(px(planX),px(planY),px(planW),px(planH));
      const pxPerLU=mmPerPx*MM,destCx=px(planX+planW/2),destCy=px(planY+planH/2);
      c.save();c.beginPath();c.rect(px(planX),px(planY),px(planW),px(planH));c.clip();
      c.translate(destCx,destCy);c.scale(pxPerLU,pxPerLU);c.translate(-bbCx,-bbCy);
      if(img){c.globalAlpha=0.45;c.drawImage(img,-img.width/2,-img.height/2);c.globalAlpha=1.0;}
      installableAreas.forEach((a,aIdx)=>{const ac=AREA_COLORS[aIdx%AREA_COLORS.length];c.fillStyle=ac.fill;c.strokeStyle=ac.stroke;c.lineWidth=1/pxPerLU;c.beginPath();c.moveTo(a.points[0].x,a.points[0].y);a.points.forEach((p,i)=>{if(i)c.lineTo(p.x,p.y);});c.closePath();c.fill();c.stroke();});
      exclusionAreas.forEach(a=>{c.fillStyle='rgba(185,28,28,0.12)';c.strokeStyle='#b91c1c';c.lineWidth=0.8/pxPerLU;c.setLineDash([8/pxPerLU,4/pxPerLU]);c.beginPath();c.moveTo(a.points[0].x,a.points[0].y);a.points.forEach((p,i)=>{if(i)c.lineTo(p.x,p.y);});c.closePath();c.fill();c.stroke();c.setLineDash([]);});
      technicalObjects.forEach(obj=>{
        const r=obj.sizePx/2,color=TECH_COLORS[obj.type]||'#555';
        const rHP = obj.sizeHPx ? obj.sizeHPx/2 : r;
        drawTechSymbol(c,obj.type,obj.x,obj.y,r,1.5/pxPerLU,color,obj.ang||0,rHP);
        c.save();c.globalAlpha=0.95;c.setLineDash([2.5/mmPerPx,1.5/mmPerPx]);
        c.lineWidth=0.7/mmPerPx;c.strokeStyle='#ffffff';
        c.beginPath();c.arc(obj.x,obj.y,r*CONFIG.TECH_RING_RATIO,0,Math.PI*2);c.stroke();
        c.lineWidth=0.35/mmPerPx;c.strokeStyle='#dc2626';
        c.beginPath();c.arc(obj.x,obj.y,r*CONFIG.TECH_RING_RATIO,0,Math.PI*2);c.stroke();
        c.setLineDash([]);c.globalAlpha=1;c.restore();
      });
      panels.forEach(p=>drawPanel(c,p,(stringsVisible && p.stringColor)||'#1e3a5f','rgba(255,255,255,0.85)',1/pxPerLU,null,0,pxPerLU));
      panels.forEach(p=>{
        if(!stringsVisible||!p.strId||p.h*pxPerLU<5) return;
        let ex,ey;
        if(p.axisUx!==undefined){const{localU:u,localV:v,w,h,axisUx:ux,axisUy:uy,axisVx:vx,axisVy:vy}=p;ex=(u+w/2)*ux+(v+h/2)*vx;ey=(u+w/2)*uy+(v+h/2)*vy;}
        else{ex=p.x+p.w/2;ey=p.y+p.h/2;}
        const fs=Math.min(p.h*0.38,2.5/mmPerPx);
        c.save();c.translate(ex,ey);c.rotate(p.ang||0);
        c.font='bold '+fs+'px '+exportFont;c.textAlign='center';c.textBaseline='middle';
        c.shadowColor='rgba(0,0,0,0.8)';c.shadowBlur=0.8/pxPerLU;
        c.fillStyle='#ffffff';c.fillText(p.strId,0,0);c.shadowBlur=0;c.restore();
      });

      // ── Cerchi ombra/buffer camini (sopra i pannelli) ───────────────────────
      technicalObjects.forEach(obj => {
        if (obj.type !== 'chimney' || !calibrated) return;
        const _h = obj.heightM || 1.5;
        const obstacleDist = parseFloat(DOM.obstacleDistance ? DOM.obstacleDistance.value : 0) || 0;
        const shadowR = _h * scale / Math.tan((obj.solarAngleDeg||30) * Math.PI / 180);
        const exclR = Math.max(shadowR, obj.sizePx / 2 + obstacleDist * scale);
        const isBufferDominant = exclR > shadowR + scale * 0.1;
        c.save();
        c.globalAlpha = 0.13; c.fillStyle = '#000000';
        c.beginPath(); c.arc(obj.x, obj.y, shadowR, 0, Math.PI*2); c.fill();
        c.globalAlpha = 0.55;
        c.setLineDash([6/mmPerPx, 4/mmPerPx]);
        c.lineWidth = 0.3/mmPerPx; c.strokeStyle = '#555555';
        c.beginPath(); c.arc(obj.x, obj.y, shadowR, 0, Math.PI*2); c.stroke();
        c.setLineDash([]);
        c.globalAlpha = 0.85;
        c.setLineDash([5/mmPerPx, 3/mmPerPx]);
        c.lineWidth = 0.4/mmPerPx; c.strokeStyle = '#dc2626';
        c.beginPath(); c.arc(obj.x, obj.y, exclR, 0, Math.PI*2); c.stroke();
        c.setLineDash([]);
        const labelM = (exclR / scale).toFixed(1);
        const label = isBufferDominant ? 'buffer ' + labelM + 'm' : 'ombra ' + labelM + 'm';
        const labelColor = isBufferDominant ? '#dc2626' : '#333333';
        const fs = Math.max(2.5/mmPerPx, Math.min(exclR * 0.04, 5/mmPerPx));
        c.font = 'bold ' + fs + 'px ' + exportFont;
        c.textAlign = 'center'; c.textBaseline = 'bottom';
        c.lineWidth = 0.5/mmPerPx; c.strokeStyle = 'rgba(255,255,255,0.9)';
        c.globalAlpha = 0.9;
        c.strokeText(label, obj.x, obj.y - exclR - 1/mmPerPx);
        c.fillStyle = labelColor; c.fillText(label, obj.x, obj.y - exclR - 1/mmPerPx);
        c.restore();
      });

      c.restore();
      drawNorthArrow();
    }

    /** Disegna la freccia nord nell'angolo in basso a destra della planimetria. */
    function drawNorthArrow() {
      const nR=9,nMargin=nR+5;
      const ncx=px(planX+planW-nMargin),ncy=px(planY+planH-nMargin);
      c.fillStyle='rgba(255,255,255,0.95)';c.strokeStyle='#333';c.lineWidth=px(0.4);
      c.beginPath();c.arc(ncx,ncy,px(nR),0,Math.PI*2);c.fill();c.stroke();
      c.fillStyle='#111';c.beginPath();
      c.moveTo(ncx,ncy-px(nR*0.78));c.lineTo(ncx-px(nR*0.38),ncy+px(nR*0.32));
      c.lineTo(ncx,ncy+px(nR*0.12));c.closePath();c.fill();
      c.fillStyle='#cccccc';c.beginPath();
      c.moveTo(ncx,ncy-px(nR*0.78));c.lineTo(ncx+px(nR*0.38),ncy+px(nR*0.32));
      c.lineTo(ncx,ncy+px(nR*0.12));c.closePath();c.fill();
      c.fillStyle='#555';c.beginPath();c.arc(ncx,ncy,px(nR*0.10),0,Math.PI*2);c.fill();
      c.strokeStyle='#555';c.lineWidth=px(0.25);c.beginPath();c.arc(ncx,ncy,px(nR),0,Math.PI*2);c.stroke();
      c.fillStyle='#111';c.font='bold '+FS(4.5)+'px '+exportFont;
      c.textAlign='center';c.textBaseline='middle';
      c.fillText('N',ncx,ncy+px(nR*0.68));c.textAlign='left';
    }

    /** Disegna il cartiglio con dati impianto, legenda stringhe e aree. */
    function drawCartiglio() {
      const TBH=CONFIG.PDF.TITLE_BLOCK_H;
      let cy=cartY;
      const drawHLine=(y)=>{c.strokeStyle='#d1d5db';c.lineWidth=BRD_W;c.beginPath();c.moveTo(px(cartX),px(y));c.lineTo(px(cartX+CW),px(y));c.stroke();};
      const drawVLine=(x,y1,y2)=>{c.strokeStyle='#d1d5db';c.lineWidth=BRD_W;c.beginPath();c.moveTo(px(x),px(y1));c.lineTo(px(x),px(y2));c.stroke();};
      const drawSectionHeader=(txt,h)=>{c.fillStyle='#1e3a5f';c.fillRect(px(cartX),px(cy),px(CW),px(h));c.fillStyle='#16a34a';c.fillRect(px(cartX),px(cy),px(1.5),px(h));c.fillStyle='#ffffff';c.font='bold '+FS(h*0.48)+'px '+exportFont;const t=fitText(txt.toUpperCase(),px(CW)*0.88,h*0.50,true);c.textAlign='center';c.textBaseline='middle';c.fillText(t,px(cartX+CW/2),px(cy+h/2));c.textAlign='left';cy+=h;};
      const drawCell=(lbl,val,x,w,h,vSF,bold,vC)=>{vSF=vSF||0.36;vC=vC||'#111111';const lh=h*0.38,vh=h-lh,cx_=x+w/2,padX=w*0.06;c.fillStyle='#9ca3af';c.font=FS(h*0.22)+'px '+exportFont;const lt=fitText(String(lbl).toUpperCase(),px(w-padX*2),h*0.22,false);c.textAlign='center';c.textBaseline='middle';c.fillText(lt,px(cx_),px(cy+lh*0.52));c.fillStyle=vC;const vt=fitText(String(val),px(w-padX*2),h*vSF,bold!==false);c.textAlign='center';c.textBaseline='middle';c.fillText(vt,px(cx_),px(cy+lh+vh*0.50));c.textAlign='left';};
      const drawRow2=(l1,v1,l2,v2,h,vf1,vf2,vc1)=>{const hw=CW/2;drawCell(l1,v1,cartX,hw,h,vf1||0.36,true,vc1);drawCell(l2,v2,cartX+hw,hw,h,vf2||0.36,true);drawVLine(cartX+hw,cy,cy+h);cy+=h;drawHLine(cy);};
      c.fillStyle='#ffffff';c.fillRect(px(cartX),px(cartY),px(CW),px(cartH));
      drawSectionHeader('Impianto',6);
      drawRow2('Potenza picco',kWp+' kWp','N° moduli',panels.length,20,0.38,0.38,'#16a34a');
      drawRow2('Sup. moduli',mq+' m²','Copertura',cov,13);
      drawRow2('Modulo L×W',mH_+'×'+mW_+' m','Potenza mod.',pwr_+' Wp',11);
      const cyAI=cy, availTotal=(cartY+cartH-TBH)-cyAI-2;
      const nStr=strings.length, nAreas=installableAreas.length+exclusionAreas.length+technicalObjects.length;
      const hasStr=nStr>0, hasAreas=nAreas>0;
      const availForRows=Math.max(0,availTotal-(hasStr?6:0)-(hasAreas?6:0));
      const totalRows=nStr+nAreas;
      let rhStr=9;
      if(totalRows>0){
        const baseRh=availForRows/totalRows;
        rhStr=Math.max(6,Math.min(13,baseRh));
        if(!hasStr) rhStr=Math.max(6,Math.min(10,availForRows/nAreas));
        if(!hasAreas) rhStr=Math.max(6,Math.min(13,availForRows/nStr));
      }
      if(hasStr){
        drawSectionHeader('Stringhe inverter',6);
        const strCols=nStr>10?2:1,strColW=CW/strCols,rowsStr=Math.ceil(nStr/strCols);
        const rhStr2=Math.max(5,Math.min(13,(hasAreas?availForRows*0.45:availForRows)/rowsStr));
        const strSH=rowsStr*rhStr2;
        strings.forEach((s,si)=>{
          const col_=si%strCols,row_=Math.floor(si/strCols),rx=cartX+col_*strColW,ry=cy+row_*rhStr2,rh=rhStr2;
          if(row_%2===1){c.fillStyle='#f9fafb';c.fillRect(px(rx),px(ry),px(strColW),px(rh));}
          const kw=(s.panels.length*pwr_/1000).toFixed(2)+' kWp',sqS=rh*0.36,sqX=rx+2,sqY=ry+(rh-sqS)/2;
          c.fillStyle=s.color;c.fillRect(px(sqX),px(sqY),px(sqS),px(sqS));
          c.strokeStyle='rgba(0,0,0,0.15)';c.lineWidth=px(0.12);c.strokeRect(px(sqX),px(sqY),px(sqS),px(sqS));
          const strFont=rh*0.38,nameX=rx+sqS+3.5,kwRes=strColW*0.30;
          const nameMaxW=px(strColW)-px(nameX-rx)-px(kwRes)-px(1);
          c.fillStyle='#111111';c.textAlign='left';c.textBaseline='middle';c.font=FS(strFont)+'px '+exportFont;
          c.fillText(fitText(s.name+' — '+s.panels.length+' mod.',nameMaxW,strFont,true),px(nameX),px(ry+rh/2));
          c.fillStyle='#16a34a';c.textAlign='right';
          c.fillText(fitText(kw,px(kwRes)-px(1),strFont,true),px(rx+strColW-1.5),px(ry+rh/2));
          c.textAlign='left';
        });
        for(let r=1;r<=rowsStr;r++){c.strokeStyle='#d1d5db';c.lineWidth=BRD_W;c.beginPath();c.moveTo(px(cartX),px(cy+r*rhStr2));c.lineTo(px(cartX+CW),px(cy+r*rhStr2));c.stroke();}
        if(strCols>1){c.strokeStyle='#d1d5db';c.lineWidth=BRD_W;c.beginPath();c.moveTo(px(cartX+strColW),px(cy));c.lineTo(px(cartX+strColW),px(cy+strSH));c.stroke();}
        cy+=strSH;
      }
      if(hasAreas){
        drawSectionHeader('Aree progetto',6);
        const allAreas2=[
          ...installableAreas.map((a,i)=>{const EL={'N':'Nord','NE':'Nord-Est','E':'Est','SE':'Sud-Est','S':'Sud','SW':'Sud-Ovest','W':'Ovest','NW':'Nord-Ovest'};const expStr=a.exposure?(' · '+(EL[a.exposure]||a.exposure)):'';return{lbl:'Area '+(i+1),col:AREA_COLORS[i%AREA_COLORS.length].stroke,val:(calibrated?polyArea(a.points).toFixed(0)+' m²':'--')+expStr,isTech:false};}),
          ...exclusionAreas.map((a,i)=>({lbl:'Ostacolo '+(i+1),col:'#b91c1c',val:calibrated?polyArea(a.points).toFixed(0)+' m²':'--',isTech:false})),
          ...technicalObjects.map(obj=>({lbl:obj.label,col:TECH_COLORS[obj.type]||'#555',val:calibrated?obj.sizem.toFixed(1)+'m / buf.'+(obj.bufferM||0).toFixed(1)+'m':'--',isTech:true,obj}))
        ];
        const nTot=allAreas2.length,areaCols=nTot>10?2:1,areaColW=CW/areaCols;
        const rowsArea=Math.ceil(nTot/areaCols);
        const rhArea2=Math.max(5,Math.min(10,(hasStr?availForRows*0.55:availForRows)/rowsArea));
        const areaSH=rowsArea*rhArea2;
        allAreas2.forEach(({lbl,col,val,isTech,obj},ai)=>{
          const acol=ai%areaCols,arow=Math.floor(ai/areaCols),rx=cartX+acol*areaColW,ry=cy+arow*rhArea2,rh=rhArea2;
          if(arow%2===1){c.fillStyle='#f9fafb';c.fillRect(px(rx),px(ry),px(areaColW),px(rh));}
          const sqS=rh*0.40,sqY=ry+(rh-sqS)/2;
          if(isTech){const symR=rh*0.22,symX=rx+2+symR;drawTechSymbol(c,obj.type,px(symX),px(ry+rh/2),px(symR),px(0.3),col,0);}
          else{c.fillStyle=col;c.fillRect(px(rx+2),px(sqY),px(sqS),px(sqS));c.strokeStyle='rgba(0,0,0,0.18)';c.lineWidth=px(0.12);c.strokeRect(px(rx+2),px(sqY),px(sqS),px(sqS));}
          const txtX=rx+2+sqS+2,txtFont=rh*0.36,valW=areaColW*0.33;
          const lblMaxW=px(areaColW)-px(txtX-rx)-px(valW)-px(1);
          c.fillStyle='#111111';c.font=FS(txtFont)+'px '+exportFont;c.textAlign='left';c.textBaseline='middle';
          c.fillText(fitText(lbl,lblMaxW,txtFont,false),px(txtX),px(ry+rh/2));
          c.fillStyle='#6b7280';c.textAlign='right';c.font='bold '+FS(txtFont*0.92)+'px '+exportFont;
          c.fillText(fitText(val,px(valW)-px(1),txtFont,true),px(rx+areaColW-1.5),px(ry+rh/2));
          c.textAlign='left';
        });
        for(let r=1;r<=rowsArea;r++){c.strokeStyle='#d1d5db';c.lineWidth=BRD_W;c.beginPath();c.moveTo(px(cartX),px(cy+r*rhArea2));c.lineTo(px(cartX+CW),px(cy+r*rhArea2));c.stroke();}
        if(areaCols>1){c.strokeStyle='#d1d5db';c.lineWidth=BRD_W;c.beginPath();c.moveTo(px(cartX+areaColW),px(cy));c.lineTo(px(cartX+areaColW),px(cy+areaSH));c.stroke();}
        cy+=areaSH;
      }
      const tbY=cartY+cartH-TBH;
      c.strokeStyle=BRD;c.lineWidth=BRD_W;c.beginPath();c.moveTo(px(cartX),px(tbY));c.lineTo(px(cartX+CW),px(tbY));c.stroke();
      const tbTH=28,tcx=px(cartX+CW/2);
      c.fillStyle='#9ca3af';c.textAlign='center';c.textBaseline='middle';c.font=FS(tbTH*0.11)+'px '+exportFont;c.fillText('PROGETTO',tcx,px(tbY+tbTH*0.14));
      c.fillStyle='#111111';c.fillText(fitText('Impianto FV',px(CW)*0.85,tbTH*0.24,true),tcx,px(tbY+tbTH*0.34));
      c.strokeStyle='#d1d5db';c.lineWidth=BRD_W;c.beginPath();c.moveTo(px(cartX+5),px(tbY+tbTH*0.56));c.lineTo(px(cartX+CW-5),px(tbY+tbTH*0.56));c.stroke();
      c.fillStyle='#6b7280';c.fillText(fitText('Layout moduli fotovoltaici',px(CW)*0.88,tbTH*0.11,false),tcx,px(tbY+tbTH*0.72));
      const colY=tbY+tbTH,colH=TBH-tbTH,lblH=colH*0.42,valH=colH-lblH,cw3=CW/3;
      c.strokeStyle=BRD;c.lineWidth=BRD_W;c.beginPath();c.moveTo(px(cartX),px(colY));c.lineTo(px(cartX+CW),px(colY));c.stroke();
      c.fillStyle='#f1f5f9';c.fillRect(px(cartX),px(colY),px(CW),px(lblH));
      ['Data','Scala','Foglio'].forEach((lbl,i)=>{
        const cx3=cartX+cw3*i;
        c.fillStyle='#9ca3af';c.textAlign='center';c.textBaseline='middle';c.font=FS(lblH*0.40)+'px '+exportFont;
        c.fillText(fitText(lbl.toUpperCase(),px(cw3)*0.85,lblH*0.38,false),px(cx3+cw3/2),px(colY+lblH*0.52));
        c.fillStyle='#111111';c.fillText(fitText([dt,scStr,fmtStr][i],px(cw3)*0.85,valH*0.44,true),px(cx3+cw3/2),px(colY+lblH+valH*0.50));
      });
      [1,2].forEach(i=>{c.strokeStyle=BRD;c.lineWidth=BRD_W;c.beginPath();c.moveTo(px(cartX+cw3*i),px(colY));c.lineTo(px(cartX+cw3*i),px(cartY+cartH));c.stroke();});
    }

    /** Disegna i bordi strutturali per ultimi, sopra tutti i fill. */
    function drawBorders() {
      const L=px(MB-3),R=px(PW-MB+3),T=px(MB-3),Bot=px(PH-MB+3);
      const PL=px(planX),PR=px(planX+planW),PT=px(planY),PB=px(planY+planH);
      const CL=px(cartX),CR=px(cartX+CW),CT=px(cartY),CB=px(cartY+cartH);
      drawSeg(L,T,L,Bot); drawSeg(R,T,R,Bot); drawSeg(L,Bot,R,Bot);
      drawSeg(L,T,CL,T);
      drawSeg(PL,PT,PL,PB); drawSeg(PR,PT,PR,PB); drawSeg(PL,PB,PR,PB);
      drawSeg(CL,T,CR,T);
      drawSeg(CL,CB,CR,CB); drawSeg(CL,T,CL,CB);
    }

    /** Disegna il disclaimer + traccia di generazione in calce al foglio.
     *  AP-11 / T2.6.3 — la stampa include timestamp, versione app, edizione
     *  normativa dalla single-source-of-truth in js/storage.js. */
    function drawFooter() {
      const footMidY=PH-MB/2;
      c.strokeStyle='#d1d5db';c.lineWidth=px(0.2);
      c.beginPath();c.moveTo(px(MB-3),px(PH-MB));c.lineTo(px(PW-MB+3),px(PH-MB));c.stroke();
      c.fillStyle='#9ca3af';c.textAlign='center';c.textBaseline='middle';
      const tsHuman = new Date().toLocaleString('it-IT', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
      const traceLine = 'Generato ' + tsHuman + ' · Solar Designer Pro v' + SDPROJ_APP_VERSION + ' · ' + getEffectiveNormsRevision();
      const disclaimer = 'Elaborato tecnico preliminare, non sostituisce la progettazione esecutiva';
      c.fillText(fitText(traceLine, px(PW*0.7),(MB-3)*0.30,false),px(PW/2),px(footMidY - 1.6));
      c.fillText(fitText(disclaimer,px(PW*0.7),(MB-3)*0.28,false),px(PW/2),px(footMidY + 1.8));
    }

    // ── Dati progetto per la stampa ───────────────────────────────────────
    const pwr_=Math.max(1,parseInt(DOM.pp.value)||400);
    const mW_=Math.max(0.1,parseFloat(DOM.pw.value)||1);
    const mH_=Math.max(0.1,parseFloat(DOM.pl.value)||1.7);
    const kWp   = (panels.length * pwr_ / 1000).toFixed(2);
    const mq    = (panels.length * mW_ * mH_).toFixed(1);
    const instMq= installableAreas.reduce((s,a) => s + polyArea(a.points), 0);
    const cov   = instMq > 0 ? ((parseFloat(mq)/instMq)*100).toFixed(0)+'%' : '--';
    const dt    = new Date().toLocaleDateString('it-IT',{day:'2-digit',month:'2-digit',year:'numeric'});
    // ── Coordinator: chiama le sub-funzioni nell'ordine corretto ─────────
    c.fillStyle='#ffffff';c.fillRect(0,0,cvW,cvH);
    drawHeader();
    drawPlan();
    drawCartiglio();
    drawBorders();
    drawFooter();
    // ── Build PDF e scarica ───────────────────────────────────────────
    const blob=buildPDF(cv.toDataURL('image/jpeg',CONFIG.PDF.JPEG_QUALITY),PW,PH);
    const url=URL.createObjectURL(blob);
    const a_dl=document.createElement('a');
    a_dl.href=url; a_dl.download='progetto-fv-'+dt+'.pdf';
    document.body.appendChild(a_dl); a_dl.click(); document.body.removeChild(a_dl);
    setTimeout(()=>URL.revokeObjectURL(url),3000);
  }catch(err){console.error(err);showToast('Errore export: '+err.message,'error',5000);}
  finally{DOM.exportOverlay.classList.remove('visible');if(btn){btn.textContent=orig;btn.style.pointerEvents='';}}
}


// ── js/lib/sizing.js ──
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


// ── js/cables.js ──
﻿// ── cables.js — Dimensionamento cavi e schema unifilare ──
//
// Pure sizing helpers (calcSection*, calcVoltageDrop, getCableCapacity)
// and their backing tables live in js/lib/sizing.js. cables.js consumes
// them via the globalThis.SDPSizing namespace — do not redeclare these
// names locally.

'use strict';

if (typeof globalThis === 'undefined' || !globalThis.SDPSizing) {
  throw new Error(
    'cables.js: globalThis.SDPSizing is not set. ' +
    'js/lib/sizing.js must be loaded before cables.js in solar-designer-v89.html.'
  );
}

const calcSection      = globalThis.SDPSizing.calcSection;
const calcSectionAC    = globalThis.SDPSizing.calcSectionAC;
const calcVoltageDrop  = globalThis.SDPSizing.calcVoltageDrop;
const getCableCapacity = globalThis.SDPSizing.getCableCapacity;

// Diametro equivalente dispersore verticale piatto 25×3mm (CEI 64-8 / IEC 62305)
// Grounding constant — NOT a sizing helper, stays in cables.js.
const EARTH_ROD_D = 0.014;  // m

// ── Calcolo e rendering risultati ────────────────────────────────────────────

function _getModuleVmppTempCoeff() {
  const pmax = parseFloat((document.getElementById('moduleTcoefPmax') || { value: '0' }).value);
  const voc  = parseFloat((document.getElementById('moduleTcoefVoc') || { value: '-0.30' }).value) || -0.30;
  return Number.isFinite(pmax) && pmax !== 0 ? pmax : voc;
}

function _getProjectStrPerMpptMax() {
  if (!_inverterList.length) return 1;
  return Math.max(..._inverterList.map(inv => Math.max(1, parseInt(inv.strPerMppt, 10) || 1)));
}

function _hasMixedStrPerMppt() {
  if (_inverterList.length <= 1) return false;
  return new Set(_inverterList.map(inv => Math.max(1, parseInt(inv.strPerMppt, 10) || 1))).size > 1;
}

function calcCables() {
  const el = document.getElementById('cableResults');
  if (!el) return;

  const isc    = parseFloat((document.getElementById('moduleIsc')     || {value: '9'}).value)   || 9;
  const voc    = parseFloat((document.getElementById('moduleVoc')     || {value: '45'}).value)   || 45;
  const pp     = parseInt((DOM.pp                                      || {value: '400'}).value)  || 400;
  // stringhe per MPPT direttamente dall'inverter (non da stringNum che vale 1)
  const strPerMppt = _getProjectStrPerMpptMax();
  const mixedStrPerMppt = _hasMixedStrPerMppt();
  const totStr  = Math.max(1, parseInt((DOM.pairNum || {value:'1'}).value) || 1); // = strTot
  const totPanels = panels.length;
  const numInv  = Math.max(1, parseInt((document.getElementById('numInverters') || {value:'1'}).value) || 1);
  const mat    = (document.getElementById('cableMaterial')            || {value: 'cu'}).value;
  const sysAC  = (document.getElementById('cableSystemAC')           || {value: 'mono'}).value;
  const lenStr = parseFloat((document.getElementById('cableLenString')|| {value: '20'}).value)  || 20;
  const lenMain= parseFloat((document.getElementById('cableLenMain')  || {value: '10'}).value)  || 10;
  const lenAC  = parseFloat((document.getElementById('cableLenAC')    || {value: '15'}).value)  || 15;
  const dropDC = parseFloat((document.getElementById('cableDropDC')   || {value: '1'}).value)   || 1;
  const tcoefVmpp = _getModuleVmppTempCoeff();

  // Fattori correzione portata (CEI UNEL 35026): k1 (posa) × k2 (raggruppamento)
  const kPosa  = parseFloat((document.getElementById('cablePosa')    ||{value:'1.00'}).value) || 1.0;
  const kGroup = parseFloat((document.getElementById('cableGrouping')||{value:'1.00'}).value) || 1.0;
  const kCorr  = kPosa * kGroup;

  // Verifica rete PCC (CEI EN 50160) e dispersore terra (CEI 64-8 art. 612.6)
  const gridRth  = parseFloat((document.getElementById('gridRth') ||{value:'0.35'}).value) || 0.35;
  const gridXth  = parseFloat((document.getElementById('gridXth') ||{value:'0.25'}).value) || 0.25;
  const earthRho = parseFloat((document.getElementById('earthRho')||{value:'100'}).value)  || 100;
  const earthLen = parseFloat((document.getElementById('earthLen')||{value:'1.5'}).value)  || 1.5;

  if (totPanels === 0 || totStr === 0) {
    el.innerHTML = '<div class="info" style="color:var(--text-tertiary);text-align:center;padding:12px;">Posiziona moduli e configura le stringhe per calcolare i cavi.</div>';
    return;
  }

  const modsPerStr  = Math.round(totPanels / totStr);
  const V_str       = voc * modsPerStr;           // Tensione stringa (V)
  const I_str       = isc * 1.25;                 // Corrente design: 1.25 × Isc (CEI/IEC)
  // Cavo principale DC: somma correnti delle stringhe in parallelo sullo stesso MPPT
  const I_main_DC   = I_str * strPerMppt;
  // Budget DC: ogni tratto (stringa e principale) deve stare singolarmente entro dropDC%.
  // Non si somma: ogni segmento ha il suo limite indipendente (pratica IEC 62548).
  const dV_max_str  = (dropDC / 100) * V_str;  // Limite cavo stringa
  const dV_max_main = (dropDC / 100) * V_str;  // Limite cavo principale (stesso %)

  // ── Cavo stringa DC (bifilar, Method C — portacavi/aperto) ──
  const S_str       = calcSection(I_str, lenStr, dV_max_str, mat, 2, true, kCorr);
  const drop_str    = calcVoltageDrop(I_str, lenStr, S_str, V_str, mat, 2);
  const Iz_str_raw  = getCableCapacity(S_str, mat, true);
  const Iz_str_corr = Math.floor(Iz_str_raw * kCorr * 10) / 10;

  // ── Cavo principale DC (bifilar, Method B — in condotto) ──
  const S_main      = calcSection(I_main_DC, lenMain, dV_max_main, mat, 2, false, kCorr);
  const drop_main     = calcVoltageDrop(I_main_DC, lenMain, S_main, V_str, mat, 2);
  const Iz_main_raw  = getCableCapacity(S_main, mat, false);
  const Iz_main_corr = Math.floor(Iz_main_raw * kCorr * 10) / 10;
  const drop_total_DC = drop_str + drop_main;  // caduta cumulata stringa+principale

  // ── Cavo AC ──
  // Formula corretta: ΔV = (nCond × L × I × cosφ) / (σ × S)
  // Monofase: nCond=2, Trifase: nCond=√3
  const cosfi  = 0.9;
  const P_kw   = (totPanels * pp / 1000) * 0.97;  // Potenza AC (efficienza inverter 97%)
  let V_AC, I_AC, nCondAC;
  if (sysAC === 'mono') {
    V_AC = 230; I_AC = (P_kw * 1000) / (V_AC * cosfi); nCondAC = 2;
  } else {
    V_AC = 400; I_AC = (P_kw * 1000) / (Math.sqrt(3) * V_AC * cosfi); nCondAC = Math.sqrt(3);
  }
  const DROP_LIMIT_AC = 1.0;                               // 1% limite ΔV AC (buona pratica FV)
  const dV_max_AC = (DROP_LIMIT_AC / 100) * V_AC;
  const S_AC      = calcSectionAC(I_AC, lenAC, dV_max_AC, mat, nCondAC, cosfi);
  const drop_AC   = calcVoltageDrop(I_AC, lenAC, S_AC, V_AC, mat, nCondAC, cosfi);
  const Iz_AC_raw  = getCableCapacity(S_AC, mat, false);
  const Iz_AC_corr = Math.floor(Iz_AC_raw * kCorr * 10) / 10;

  // ── Verifica tensione al PCC (CEI EN 50160 ±10% Vn) ──
  const Z_rete     = Math.sqrt(gridRth * gridRth + gridXth * gridXth);
  const dV_rete_V  = sysAC === 'mono' ? 2 * Z_rete * I_AC : Math.sqrt(3) * Z_rete * I_AC;
  const dV_rete_pct = V_AC > 0 ? (dV_rete_V / V_AC) * 100 : 0;
  const dV_pcc_pct  = drop_AC + dV_rete_pct;

  // ── Resistenza dispersore di terra (CEI 64-8 art. 612.6) ──
  // Formula: Rt = (ρ / 2πL) × ln(4L/d)   — dispersore verticale cilindrico
  const Rt     = earthLen > 0 ? (earthRho / (2 * Math.PI * earthLen)) * Math.log(4 * earthLen / EARTH_ROD_D) : 999;
  const Rt_ok  = Rt <= 5.0;
  const nRods  = Rt_ok ? 1 : Math.ceil(Rt / 5.0);  // dispersori in parallelo stimati (stima semplificata)

  // Helper rendering
  function row(label, value, highlight) {
    return `<div>
      <div style="color:var(--text-tertiary);font-size:10px;">${label}</div>
      <div style="font-weight:${highlight ? '700' : '600'};color:${highlight ? 'var(--accent)' : 'var(--text-primary)'};font-size:${highlight ? 'var(--fs-sm)' : 'var(--fs-xs)'};">${value}</div>
    </div>`;
  }
  function dropBadge(pct, max) {
    const ok = pct <= max;
    return `<div style="font-weight:600;color:${ok ? 'var(--accent-text)' : 'var(--danger)'};">${ok ? '✓' : '⚠'} ${pct.toFixed(2)}% <span style="font-weight:normal;color:var(--text-tertiary);">(max ${max}%)</span></div>`;
  }
  function card(title, rows) {
    return `<div style="background:var(--bg-secondary);border:1px solid var(--border-default);border-radius:var(--radius-sm);overflow:hidden;margin-bottom:8px;">
      <div style="background:var(--bg-tertiary);padding:4px 10px;font-size:var(--fs-xs);font-weight:600;color:var(--text-secondary);border-bottom:1px solid var(--border-default);">${title}</div>
      <div style="padding:8px 10px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px 6px;">${rows}</div>
    </div>`;
  }

  const kCorrBadge = kCorr < 0.999
    ? `<span style="display:inline-block;background:#fff8e1;border:1px solid #fcd34d;border-radius:3px;padding:1px 5px;font-size:9px;font-weight:700;color:#92400e;margin-left:4px;">k=${kCorr.toFixed(2)} (posa×gruppo)</span>`
    : '';

  el.innerHTML =
    `<div style="font-size:var(--fs-xs);font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">Risultati ${kCorrBadge}</div>`
    + card(
        `⚡ Cavo stringa DC — ${totStr} str. × ${modsPerStr} mod. in serie`,
        row('Tensione stringa', V_str.toFixed(0) + ' V') +
        row('Corrente design (Isc×1.25)', I_str.toFixed(1) + ' A') +
        row('Sezione', S_str + ' mm²', true) +
        row('Portata Iz' + (kCorr < 0.999 ? ` (×${kCorr.toFixed(2)})` : ''), Iz_str_corr + ' A') +
        row('Lunghezza', lenStr + ' m') +
        `<div><div style="color:var(--text-tertiary);font-size:10px;">Caduta tensione</div>${dropBadge(drop_str, dropDC)}</div>`
      )
    + card(
        `⚡ Cavo principale DC — ${strPerMppt} str. parallelo per ingresso MPPT`,
        row('Corrente totale DC', I_main_DC.toFixed(1) + ' A') +
        row('Sezione', S_main + ' mm²', true) +
        row('Portata Iz' + (kCorr < 0.999 ? ` (×${kCorr.toFixed(2)})` : ''), Iz_main_corr + ' A') +
        row('Lunghezza', lenMain + ' m') +
        `<div><div style="color:var(--text-tertiary);font-size:10px;">Caduta tensione</div>${dropBadge(drop_main, dropDC)}</div>` +
        `<div style="grid-column:1/-1;border-top:1px solid var(--border-default);padding-top:6px;margin-top:2px;">
          <div style="color:var(--text-tertiary);font-size:10px;">Caduta totale DC (str+principale)</div>
          ${dropBadge(drop_total_DC, dropDC * 2)}
         </div>`
      )
    + card(
        `🔌 Cavo AC — ${sysAC === 'mono' ? 'Monofase 230 V' : 'Trifase 400 V'} · ${P_kw.toFixed(2)} kW`,
        row('Corrente AC', I_AC.toFixed(1) + ' A') +
        row('Sezione', S_AC + ' mm²', true) +
        row('Portata Iz' + (kCorr < 0.999 ? ` (×${kCorr.toFixed(2)})` : ''), Iz_AC_corr + ' A') +
        row('Lunghezza', lenAC + ' m') +
        `<div><div style="color:var(--text-tertiary);font-size:10px;">Caduta tensione</div>${dropBadge(drop_AC, DROP_LIMIT_AC)}</div>`
      )
    + card(
        `🌍 Tensione al PCC — CEI EN 50160`,
        row('|Z| rete DSO', Z_rete.toFixed(3) + ' Ω') +
        row('ΔV rete (→PCC)', dV_rete_pct.toFixed(2) + ' %') +
        `<div style="grid-column:1/-1;"><div style="color:var(--text-tertiary);font-size:10px;">ΔV totale utente+rete al PCC</div>${dropBadge(dV_pcc_pct, 4.0)}</div>` +
        `<div style="grid-column:1/-1;font-size:10px;color:var(--text-tertiary);">Limite EN 50160: ±10% Vn · Soglia pratica: ΔV produz. ≤ 4% · Rth/Xth DSO: inserire da preventivo connessione</div>`
      )
    + card(
        `⏚ Dispersore di terra — CEI 64-8 art. 612.6`,
        row('Resistività suolo ρ', earthRho + ' Ω·m') +
        row('Lunghezza dispersore', earthLen + ' m') +
        `<div><div style="color:var(--text-tertiary);font-size:10px;">Rt calcolata</div>
          <div style="font-weight:700;color:${Rt_ok ? 'var(--accent-text)' : 'var(--danger)'};">${Rt_ok ? '✓' : '⚠'} ${Rt.toFixed(1)} Ω ${Rt_ok ? '≤ 5Ω' : `> 5Ω`}</div></div>` +
        `<div style="grid-column:1/-1;font-size:10px;color:${Rt_ok ? 'var(--text-tertiary)' : 'var(--danger)'};">
          ${Rt_ok ? 'Sistema TT conforme — 1 dispersore sufficiente' : `Aggiungere ${nRods} dispersori in parallelo (stima semplificata) oppure dispersore ad anello`}
         </div>`
      )
    + `<div style="font-size:10px;color:var(--text-tertiary);line-height:1.5;margin-top:2px;">
        IEC 60364-5-52 · DC stringa: Method C (portacavi) · DC principale/AC: Method B (condotto)
        · ${mat === 'cu' ? 'Rame (Cu) σ=56' : 'Alluminio (Al) σ=35'} m/Ω·mm² · cos φ = 0.9 · η inv. = 97%
        · k posa=${kPosa.toFixed(2)} · k gruppo=${kGroup.toFixed(2)} · kCorr=${kCorr.toFixed(2)}
       </div>`;

  updateInvValidation();
  // Aggiorna le verifiche elettriche nella sezione HTML separata
  if (typeof _renderVerifiche === 'function') _renderVerifiche();
}

function syncCableState() { calcCables(); }

// ── Parco inverter — gestione lista ──────────────────────────────────────────

/**
 * Calcola i valori totali/consolidati del parco inverter.
 * Conservativo: per un impianto misto si usa il limite più restrittivo.
 *   - MPPT totali     = somma (mppt × qty)
 *   - Pac totale      = somma (pac  × qty)
 *   - vocMax          = minimo  (limite più basso)
 *   - vMin (Vmppt lo) = massimo (la tensione minima più alta è la più restrittiva)
 *   - vMax (Vmppt hi) = minimo  (la tensione massima più bassa è la più restrittiva)
 *   - iMax            = minimo  (la corrente massima più bassa è la più restrittiva)
 *   - ac              = 'tri' se almeno uno è trifase
 */
function _getInverterTotals() {
  if (!_inverterList.length) return null;
  let mpptTot = 0, strTot = 0, pacTot = 0;
  let vocMax = Infinity, vMin = -Infinity, vMax = Infinity, iMax = Infinity;
  let hasTri = false;
  const brands = [];
  _inverterList.forEach(inv => {
    mpptTot += inv.mppt       * inv.qty;
    strTot  += inv.mppt * inv.strPerMppt * inv.qty;   // stringhe totali fisso da datasheet
    pacTot  += inv.pac        * inv.qty;
    vocMax   = Math.min(vocMax,  inv.vocMax);
    vMin     = Math.max(vMin,    inv.vMin);
    vMax     = Math.min(vMax,    inv.vMax);
    iMax     = Math.min(iMax,    inv.iMax);
    if (inv.ac === 'tri') hasTri = true;
    if (!brands.includes(inv.brand)) brands.push(inv.brand);
  });
  const totalQty = _inverterList.reduce((s, inv) => s + inv.qty, 0);
  // strPerMppt consolidato: conservativo = minimo tra tutti gli inverter
  const strPerMpptMin = Math.min(..._inverterList.map(inv => inv.strPerMppt));
  const strPerMpptMax = Math.max(..._inverterList.map(inv => inv.strPerMppt));
  const mixedStrPerMppt = new Set(_inverterList.map(inv => inv.strPerMppt)).size > 1;
  return { mpptTot, strTot, strPerMpptMin, strPerMpptMax, mixedStrPerMppt, pacTot, vocMax, vMin, vMax, iMax,
           ac: hasTri ? 'tri' : 'mono', brands: brands.join('+'), totalQty };
}

function addInverterToList() {
  const sel = document.getElementById('invPresetAdd');
  const qtyEl = document.getElementById('invAddQty');
  if (!sel || !sel.value) { showToast('Seleziona un modello inverter', 'warn'); return; }
  const p = INV_PRESETS[sel.value];
  if (!p) return;
  const qty = Math.max(1, parseInt(qtyEl.value) || 1);

  // AP-17c: route writes through store. Rebuild list so subscribers see a
  // fresh reference and avoid in-place mutation as a side channel.
  const cur = globalThis.getStoreSlice('inverterList') || [];
  const existing = cur.find(i => i.key === sel.value);
  let next;
  if (existing) {
    next = cur.map(i => i === existing ? Object.assign({}, i, { qty: i.qty + qty }) : i);
  } else {
    next = cur.concat([{ key: sel.value, ...p, qty }]);
  }
  globalThis.setStoreSlice('inverterList', next);

  sel.value = '';
  qtyEl.value = 1;
  updateInverterListUI();
}

function removeInverterFromList(idx) {
  // AP-17c: route writes through store.
  const cur = globalThis.getStoreSlice('inverterList') || [];
  const next = cur.filter((_, i) => i !== idx);
  globalThis.setStoreSlice('inverterList', next);
  updateInverterListUI();
}

function updateInverterListUI() {
  const listEl   = document.getElementById('inverterListItems');
  const summEl   = document.getElementById('inverterListSummary');
  const mpptLbl  = document.getElementById('mpptFromInvLabel');

  if (!listEl) return;

  if (!_inverterList.length) {
    listEl.innerHTML = '<div style="color:var(--text-tertiary);font-size:var(--fs-xs);padding:8px;text-align:center;border:1px dashed var(--border-default);border-radius:var(--radius-sm);">Nessun inverter aggiunto</div>';
    if (summEl) summEl.innerHTML = '';
    if (mpptLbl) mpptLbl.textContent = 'Dal parco inverter';
    _syncHiddenInvFields(null);
    updateStringPreview(); calcCables();
    return;
  }

  // Render lista
  listEl.innerHTML = _inverterList.map((inv, i) => `
    <div style="display:flex;align-items:center;gap:6px;padding:5px 8px;margin-bottom:3px;background:var(--bg-secondary);border:1px solid var(--border-default);border-radius:var(--radius-sm);font-size:var(--fs-xs);">
      <div style="flex:1;min-width:0;">
        <span style="font-weight:600;color:var(--text-primary);">${inv.brand} ${inv.model}</span><br>
        <span style="color:var(--text-tertiary);">${inv.pac}kW · ${inv.mppt} MPPT · ${inv.strPerMppt} str/MPPT · ${inv.ac==='tri'?'3~':'1~'}</span>
      </div>
      <div style="display:flex;align-items:center;gap:3px;flex-shrink:0;">
        <button class="number-btn" style="width:20px;height:22px;font-size:11px;" onclick="adjInvQty(${i},-1)">−</button>
        <span style="font-weight:700;min-width:22px;text-align:center;color:var(--accent);">×${inv.qty}</span>
        <button class="number-btn" style="width:20px;height:22px;font-size:11px;" onclick="adjInvQty(${i},1)">+</button>
      </div>
      <button onclick="removeInverterFromList(${i})" style="background:none;border:none;cursor:pointer;color:var(--danger);font-size:14px;padding:0 2px;" title="Rimuovi">×</button>
    </div>`).join('');

  // Calcola totali
  const t = _getInverterTotals();
  const acLabel = t.ac === 'tri' ? '3~ 400V' : '1~ 230V';

  // Riepilogo parco
  if (summEl) summEl.innerHTML = `
    <div style="background:var(--accent-light);border:1px solid var(--accent);border-radius:var(--radius-sm);padding:7px 10px;font-size:var(--fs-xs);">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;">
        <div><span style="color:var(--text-tertiary);">Inverter tot:</span><br><b style="color:var(--accent-text);">${t.totalQty} ud.</b></div>
        <div><span style="color:var(--text-tertiary);">Pac totale:</span><br><b style="color:var(--accent-text);">${t.pacTot.toFixed(1)} kW</b></div>
        <div><span style="color:var(--text-tertiary);">MPPT totali:</span><br><b style="color:var(--accent-text);">${t.mpptTot}</b></div>
        <div><span style="color:var(--text-tertiary);">Str. totali (da scheda):</span><br><b style="color:var(--accent-text);">${t.strTot}</b></div>
        <div><span style="color:var(--text-tertiary);">Vmppt:</span><br><b>${t.vMin}–${t.vMax}V · Voc≤${t.vocMax}V</b></div>
        <div><span style="color:var(--text-tertiary);">Imax MPPT:</span><br><b>${t.iMax}A · ${acLabel}</b></div>
      </div>
    </div>`;

  // pairNum = stringhe totali fisse (da scheda tecnica inverter, non scelto dall'utente)
  if (mpptLbl) mpptLbl.textContent = t.mixedStrPerMppt ? `→ ${t.strTot} stringhe totali (${t.mpptTot} MPPT × 1…${t.strPerMpptMax} str/MPPT)` : `→ ${t.strTot} stringhe totali (${t.mpptTot} MPPT × ${t.strPerMpptMin} str/MPPT)`;
  if (DOM.pairNum) {
    DOM.pairNum.value    = t.strTot;
    DOM.pairNum.readOnly = true;
    DOM.pairNum.style.background   = 'var(--accent-light)';
    DOM.pairNum.style.borderColor  = 'var(--accent)';
  }

  // Aggiorna sistema AC
  const acEl = document.getElementById('cableSystemAC');
  if (acEl) acEl.value = t.ac === 'tri' ? 'tri' : 'mono';

  _syncHiddenInvFields(t);
  updateStringPreview();
  calcCables();
}

function adjInvQty(idx, d) {
  // AP-17c: route writes through store.
  const cur = globalThis.getStoreSlice('inverterList') || [];
  const next = cur.map((inv, i) =>
    i === idx ? Object.assign({}, inv, { qty: Math.max(1, inv.qty + d) }) : inv
  );
  globalThis.setStoreSlice('inverterList', next);
  updateInverterListUI();
}

/** Aggiorna i campi hidden usati da calcCables/updateInvValidation/renderUnifilare */
function _syncHiddenInvFields(t) {
  const set = (id, v) => { const el = document.getElementById(id); if (el !== null && v !== undefined) el.value = v ?? ''; };
  if (!t) {
    set('invBrand',''); set('invModel',''); set('numInverters','1');
    set('invPac',''); set('invVmpptMin',''); set('invVmpptMax','');
    set('invImaxMppt',''); set('invVocMax','');
    return;
  }
  // Brand e model: usa il primo se uno solo, altrimenti "misto"
  const first = _inverterList[0];
  set('invBrand',    _inverterList.length === 1 ? first.brand : t.brands);
  set('invModel',    _inverterList.length === 1 ? `${first.model} ×${first.qty}` : `Misto ×${t.totalQty}`);
  set('numInverters', t.totalQty);
  set('invStrTot',   t.strTot);
  set('invPac',      t.pacTot);
  set('invVmpptMin', t.vMin);
  set('invVmpptMax', t.vMax);
  set('invImaxMppt', t.iMax);
  set('invVocMax',   t.vocMax);
}

function onNumInvChange() {
  updateStringPreview();
  calcCables();
}

// ── Libreria inverter ─────────────────────────────────────────────────────────

// INV_PRESETS è definito in data/inverters.data.js (caricato prima di questo file).

function applyInvPreset() { /* stub — sostituito da addInverterToList */ }

// ── Libreria moduli — preset e selezione ─────────────────────────────────────

/**
 * Popola il <select id="modulePresetSel"> con i preset da MODULE_PRESETS.
 * Raggruppa per brand usando <optgroup>.
 * Chiamata una volta al caricamento pagina.
 */
function _populateModulePresets() {
  const sel = document.getElementById('modulePresetSel');
  if (!sel) return;
  // Svuota tutto tranne la prima opzione "Personalizzato"
  while (sel.options.length > 1) sel.remove(1);

  let curBrand = null;
  let grp = null;
  MODULE_PRESETS.forEach((p, i) => {
    if (p.brand !== curBrand) {
      curBrand = p.brand;
      grp = document.createElement('optgroup');
      grp.label = p.brand;
      sel.appendChild(grp);
    }
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${p.name} · ${p.pp}Wp`;
    grp.appendChild(opt);
  });
}

/**
 * Applica un preset modulo ai campi del form S3.
 * @param {string|number} idx  indice in MODULE_PRESETS, o '' per personalizzato
 */
function applyModulePreset(idx) {
  if (idx === '' || idx === null || idx === undefined) {
    _modulePresetKey = null;
    return;
  }
  const i = parseInt(idx);
  const p = MODULE_PRESETS[i];
  if (!p) return;
  _modulePresetKey = i;

  const set = (id, v) => {
    const el = document.getElementById(id);
    if (el && v !== undefined) { el.value = v; el.dispatchEvent(new Event('input', {bubbles:true})); }
  };
  set('pw',             p.pw);
  set('pl',             p.pl);
  set('pp',             p.pp);
  set('moduleIsc',      p.isc);
  set('moduleVoc',      p.voc);
  set('moduleImpp',     p.impp);
  set('moduleVmpp',     p.vmpp);
  set('moduleTcoefVoc', p.tcoef_voc  ?? -0.30);
  set('moduleTcoefPmax',p.tcoef_pmax ?? -0.35);
  // ISCR: usa valore dal preset se disponibile, altrimenti stima conservativa ≈ 1.35×Isc
  set('moduleIscr',    p.iscr     ?? Math.round(p.isc * 1.35 * 2) / 2);
  set('moduleVsysMax', p.vsys_max ?? 1000);

  syncCableState();
  _relayoutDebounced && _relayoutDebounced();
  invalidateLayoutCache && invalidateLayoutCache();
}


// ── Schema unifilare (SVG) ────────────────────────────────────────────────────

function openUnifilare() {
  const modal = document.getElementById('unifilareModal');
  if (!modal) return;
  modal.classList.add('visible');
  renderUnifilare();
}

function closeUnifilare() {
  const modal = document.getElementById('unifilareModal');
  if (modal) modal.classList.remove('visible');
}



// ── js/cables/sld-render.js ──
// ── js/cables/sld-render.js — SLD modal rendering ──
// Extracted from cables.js in AP-15a. SVG generation per schema unifilare,
// including BESS mode state, hover/popup helpers, cartiglio render, MT
// tensione block. Calling surface unchanged — all symbols remain available
// through bundle-scope globals as before.

'use strict';

let _unifilareDebounceTimer = null;
function renderUnifilareDebounced() {
  clearTimeout(_unifilareDebounceTimer);
  _unifilareDebounceTimer = setTimeout(renderUnifilare, 250);
}

function renderUnifilare() {
  const container = document.getElementById('unifilareContainer');
  if (!container) return;

  // \u2500\u2500 1. RACCOLTA DATI \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const g = id => parseFloat((document.getElementById(id)||{value:'0'}).value)||0;
  const gs = id => (document.getElementById(id)||{value:''}).value||'';

  const totPanels  = panels.length;
  const pp         = parseInt((DOM.pp||{value:'400'}).value)||400;
  const isc        = g('moduleIsc') || 9;
  const voc        = g('moduleVoc') || 45;
  const vmpp       = g('moduleVmpp') || (voc * 0.82);
  const impp       = g('moduleImpp') || (isc * 0.93);
  const tcoefVoc   = g('moduleTcoefVoc') || -0.30;
  const tcoefVmpp  = _getModuleVmppTempCoeff();
  const mat        = gs('cableMaterial') || 'cu';
  const sysAC      = gs('cableSystemAC') || 'mono';
  const lenStr     = g('cableLenString') || 20;
  const lenMain    = g('cableLenMain') || 10;
  const lenAC      = g('cableLenAC') || 15;
  const dropDCpct  = g('cableDropDC') || 1;

  const totStr    = Math.max(1, parseInt(gs('invStrTot'))||1);
  const invBrand  = gs('invBrand') || 'Inverter';
  const invModel  = gs('invModel') || '';
  const invPac    = g('invPac') || 0;

  // Dati cartiglio
  const cartCommittente  = gs('cartCommittente')  || '—';
  const cartIndirizzo    = gs('cartIndirizzo')    || '—';
  const cartProgettista  = gs('cartProgettista')  || '—';
  const cartAlbo         = gs('cartAlbo')         || '—';
  const cartNumDisegno   = gs('cartNumDisegno')   || '—';
  const cartRevisione    = gs('cartRevisione')    || '00';
  const cartSpiModello   = gs('cartSpiModello')   || '';
  const cartSpiMatricola = gs('cartSpiMatricola') || '';
  const cartSpiCert      = gs('cartSpiCertificato') || '';
  const cartTensione    = gs('cartTensione')     || 'BT';  // 'BT' | 'MT'
  const isMT            = cartTensione === 'MT';
  const cartSwitchPreM0 = gs('cartSwitchPreM0')  || 'no';
  const hasSwitch       = cartSwitchPreM0 === 'si';
  // Revisioni dinamiche
  const _revRows = [];
  for (let ri = 0; ri < 5; ri++) {
    const rn = (document.getElementById(`rev0${ri}_num`)  ||{value:''}).value;
    const rd = (document.getElementById(`rev0${ri}_data`) ||{value:''}).value;
    const rs = (document.getElementById(`rev0${ri}_desc`) ||{value:''}).value;
    if (rn || rs) _revRows.push({ num: rn || ri.toString().padStart(2,'0'), data: rd, desc: rs });
  }
  const invVocMax = g('invVocMax') || 1000;
  const invVmpMin = g('invVmpptMin') || 0;
  const invVmpMax = g('invVmpptMax') || 0;
  const invImax   = g('invImaxMppt') || 0;

  const mpptTot    = _inverterList.reduce((a,inv)=>a+inv.mppt*inv.qty,0) || 1;
  const strPerMppt = _getProjectStrPerMpptMax();
  const mixedStrPerMppt = _hasMixedStrPerMppt();
  const modsPerStr = totPanels > 0 ? Math.round(totPanels / totStr) : 0;

  const P_kwp     = totPanels * pp / 1000;
  const P_kw      = P_kwp * 0.97;
  // Potenza AC totale da parco inverter (per regola SPI §17b)
  const P_pac_tot = _inverterList.reduce((a,inv)=>a+inv.pac*inv.qty, 0) || invPac;
  const SPI_SOGLIA = 11.08;
  const spiIntegrato = P_pac_tot <= SPI_SOGLIA;
  const bessMode       = _bessMode;
  const simplifiedMode = _simplifiedMode;
  // Aggiorna titolo modal in base a BT/MT
  const _modalTitle = document.getElementById('unifilareModalTitle');
  if (_modalTitle) _modalTitle.textContent = isMT ? 'Schema Unifilare — CEI 0-16:2022 (MT)' : 'Schema Unifilare — CEI 0-21:2025-10 (BT)';
  // Aggiorna visibilità riga SPI esterno nel modal
  const _spiRow = document.getElementById('spiEsternoRow');
  if (_spiRow) _spiRow.style.display = spiIntegrato ? 'none' : 'block';
  const V_str_voc = voc  * modsPerStr;
  const V_str_vmpp= vmpp * modsPerStr;
  const I_str_des = isc  * 1.25;
  const I_main_dc = I_str_des * strPerMppt;
  const V_AC      = sysAC === 'mono' ? 230 : 400;
  const cosfi     = 0.9;
  const I_AC      = P_kw > 0 ? (P_kw*1000)/(sysAC==='mono'? V_AC*cosfi : Math.sqrt(3)*V_AC*cosfi) : 0;
  const matLbl    = mat === 'cu' ? 'Cu' : 'Al';
  const sysLbl    = sysAC === 'mono' ? '1~ 230V' : '3~ 400V';

  const kVoc       = tcoefVoc / 100;
  const kVmppU     = tcoefVmpp / 100;
  const vocCold    = voc  * (1 + kVoc   * (-10 - 25));   // Voc @ -10°C
  const vmppHot    = vmpp * (1 + kVmppU * ( 70 - 25));   // Vmpp @ +70°C (caso peggiore caldo)
  const vmppCold   = vmpp * (1 + kVmppU * (-10 - 25));   // Vmpp @ -10°C (caso peggiore freddo)
  const V_str_cold = vocCold * modsPerStr;

  let S_str = 4, S_main = 6, S_AC_calc = 6;
  try {
    S_str      = calcSection(I_str_des, lenStr, (dropDCpct/100)*V_str_vmpp, mat, 2, true);
    S_main     = calcSection(I_main_dc, lenMain, (dropDCpct/100)*V_str_vmpp, mat, 2, false);
    S_AC_calc  = calcSectionAC(I_AC, lenAC, (1.0/100)*V_AC, mat, sysAC==='mono'?2:Math.sqrt(3), cosfi);
  } catch(e) { /* keep previously computed S_*_calc fallbacks */ }

  const FUSE_STD  = [2,4,6,10,15,20,25,32,40,50,63];
  const fuseMin_A = I_str_des * 1.5;
  const fuseRec_A = FUSE_STD.find(f => f >= fuseMin_A) || 63;
  // Formula corretta IEC 62548 §6.3: fusibile necessario solo se (n_par−1)×Isc > ISCR_modulo
  const iscrU     = g('moduleIscr') || (isc * 1.35);
  const vsysMaxU  = g('moduleVsysMax') || 1000;
  const needsFuse = (strPerMppt - 1) * isc > iscrU;

  // \u2500\u2500 2. LAYOUT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const VW = 4200, VH = 2970;
  const XC = 1700;   // centro colonna schema (spostato a sinistra — colonna destra riservata)
  const RH_X = 3280; // inizio colonna destra (tabelle calcoli, SPI)
  const RH_W = 880;  // larghezza colonna destra

  // YY: coordinate Y assolute dei nodi dello schema
  const YY = {
    moduli:             210,   // campo FV
    cavi_dc_top:        400,
    cassetta_top:       490,
    cassetta_bot:       810,   // cassetta_top+320 (aumentata per spazio SPD/Sez)
    inverter:          1040,   // Quadro Inverter (centro)
    cavi_ac_top:       1290,
    qbt_top:           1360,   // Quadro BT Produzione FV
    qbt_bot:           1740,   // 380px — MCB+RCD+meter ci stanno
    spi_y:             1870,   // SPI — relè di interfaccia (nodo funzionale)
    ddi_y:             2090,   // DDI — Dispositivo di Interfaccia (motorizzato) [+30 gap SPI]
    cavi_cnt:          2200,
    contatore_scambio: 2310,   // Contatore scambio SSP (bidirezionale)
    pdc:               2430,   // POD — Punto di consegna
    rete:              2550,   // Rete BT DSO
    cart:              2640,   // Cartiglio (VH=2970)
  };

  // Colonne MPPT: layout simmetrico attorno a XC (max 4 colonne)
  const nCols       = Math.min(mpptTot, 4);
  const COL_W       = Math.min(700, Math.max(380, Math.floor((RH_X - 300) / nCols)));
  const colXs       = Array.from({length: nCols}, (_, i) =>
    Math.round(XC - (nCols * COL_W) / 2 + (i + 0.5) * COL_W));
  const mpptXs      = colXs;
  const mpptToShow  = nCols;
  const cassettaXs  = colXs;

  // Mostra TUTTE le stringhe — nessun limite artificiale
  const STR_PER_COL = strPerMppt;
  const hiddenStrings = 0;
  // Step = distribuzione uniforme nella larghezza disponibile (COL_W - 100px margini)
  // Ogni stringa occupa 1/n dello spazio → garantisce contenimento in CASS_W qualunque n
  const _stepBase = STR_PER_COL <= 1 ? 0 : Math.floor((COL_W - 100) / STR_PER_COL);
  // Larghezza box stringa: min(max_per_categoria, step - 12px gap minimo)
  const _boxMax = STR_PER_COL <= 1 ? 220 : STR_PER_COL <= 2 ? 200
    : STR_PER_COL <= 4 ? 160 : STR_PER_COL <= 6 ? 120 : 90;
  const STR_BOX_W = STR_PER_COL <= 1 ? 220 : Math.min(_boxMax, Math.max(50, _stepBase - 12));
  const _strStep = STR_PER_COL <= 1 ? 0 : _stepBase;
  // CASS_W calcolata PRIMA di strXs — contiene tutti i box con 40px margine per lato
  const _totalBoxSpan = STR_PER_COL <= 1 ? STR_BOX_W : (STR_PER_COL - 1) * _strStep + STR_BOX_W;
  const CASS_W = Math.min(COL_W - 20, Math.max(280, _totalBoxSpan + 80));

  // Posizioni X stringhe: passo adattivo per contenere tutte nella colonna
  const strXs = [];
  for (let m = 0; m < nCols; m++) {
    const cx = colXs[m];
    const nS = STR_PER_COL;
    const step = _strStep;
    const span = (nS - 1) * step;
    for (let sv = 0; sv < nS; sv++) {
      const x = nS === 1 ? cx : Math.round(cx - span / 2 + sv * step);
      strXs.push({ x, mpptIdx: m });
    }
  }

  // \u2500\u2500 3. SIMBOLI IEC \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const F = 'Arial, Helvetica, sans-serif';

  const R = (x,y,w,h,rx,fill,stroke,sw,dash) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx||0}" fill="${fill||'none'}" stroke="${stroke||'none'}" stroke-width="${sw||1}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
  const L = (x1,y1,x2,y2,col,sw,dash) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col||'#1a1a1a'}" stroke-width="${sw||2}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
  const _ex = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  const T = (txt,x,y,sz,col,anchor,weight) =>
    `<text x="${x}" y="${y}" font-size="${sz||24}" fill="${col||'#1a1a1a'}" text-anchor="${anchor||'start'}" font-weight="${weight||'normal'}" font-family="${F}" dominant-baseline="middle">${_ex(txt)}</text>`;
  const TM = (txt,x,y,sz,col,weight) => T(txt,x,y,sz,col,'middle',weight);
  const TRot = (txt,x,y,sz,col,deg) =>
    `<text x="${x}" y="${y}" font-size="${sz||22}" fill="${col||'#1a1a1a'}" text-anchor="middle" font-family="${F}" dominant-baseline="middle" transform="rotate(${deg||(-90)},${x},${y})">${_ex(txt)}</text>`;

  const C = {
    dcPos:  '#CC3300',
    dcNeg:  '#1a1a1a',
    ac:     '#444444',
    pe:     '#2d7a00',
    box:    '#444444',
    blue:   '#1e4aaa',
    gray:   '#666666',
    lgray:  '#999999',
    white:  '#ffffff',
    bgDC:   '#fff5f0',
    bgAC:   '#f0f4ff',
    bgPE:   '#f0fff0',
  };

  // \u2500\u2500 SIMBOLI IEC 60617 v2 \u2014 schemi unifilari professionali \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // (cx,cy) = centro geometrico del simbolo sull'asse del conduttore.
  // Ogni funzione disegna SOLO il simbolo; i tratti di connessione
  // sopra/sotto vengono tracciati separatamente dal codice di layout.

  // MCB \u2014 Interruttore automatico magnetotermico (IEC 60617-07-15-01)
  // Punto di articolazione (\u25cf) + lama diagonale aperta + contatto fisso (\u2500)
  // + indicatore T-bar scatto magnetotermico in cima
  function symMCB(cx, cy, col) {
    col = col || C.ac;
    const hw = 20, hh = 24;
    return [
      // Punto di articolazione superiore (pieno = collegato in modo fisso)
      `<circle cx="${cx}" cy="${cy-hh}" r="5" fill="${col}"/>`,
      // Lama mobile in posizione aperta (~45\u00b0)
      `<line x1="${cx}" y1="${cy-hh}" x2="${cx+hw+6}" y2="${cy+hh-6}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`,
      // Contatto fisso inferiore (barra orizzontale)
      `<line x1="${cx-hw}" y1="${cy+hh}" x2="${cx+hw}" y2="${cy+hh}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`,
      // Indicatore scatto magnetotermico: T-bar verticale sopra il punto di articolazione
      `<line x1="${cx-12}" y1="${cy-hh-16}" x2="${cx+12}" y2="${cy-hh-16}" stroke="${col}" stroke-width="2.5"/>`,
      `<line x1="${cx}" y1="${cy-hh-16}" x2="${cx}" y2="${cy-hh}" stroke="${col}" stroke-width="2.5"/>`,
    ].join('');
  }

  // RCD \u2014 Interruttore differenziale (IEC 60617)
  // = MCB + anello toroidale (trasformatore di corrente differenziale) + terra
  function symRCD(cx, cy, tipo, col) {
    col = col || C.ac;
    tipo = tipo || 'A';
    const hw = 20, hh = 24;
    const toY = cy + hh + 30;  // centro toroide
    return [
      // Punto di articolazione (pieno)
      `<circle cx="${cx}" cy="${cy-hh}" r="5" fill="${col}"/>`,
      // Lama mobile aperta
      `<line x1="${cx}" y1="${cy-hh}" x2="${cx+hw+6}" y2="${cy+hh-6}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`,
      // Contatto fisso inferiore
      `<line x1="${cx-hw}" y1="${cy+hh}" x2="${cx+hw}" y2="${cy+hh}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`,
      // T-bar scatto
      `<line x1="${cx-12}" y1="${cy-hh-16}" x2="${cx+12}" y2="${cy-hh-16}" stroke="${col}" stroke-width="2.5"/>`,
      `<line x1="${cx}" y1="${cy-hh-16}" x2="${cx}" y2="${cy-hh}" stroke="${col}" stroke-width="2.5"/>`,
      // Tratto conduttore dal contatto inferiore al toroide
      `<line x1="${cx}" y1="${cy+hh}" x2="${cx}" y2="${toY-14}" stroke="${col}" stroke-width="3"/>`,
      // Anello toroidale \u2014 simbolo trafo differenziale (IEC)
      `<circle cx="${cx}" cy="${toY}" r="14" fill="none" stroke="${col}" stroke-width="2.5"/>`,
      // Derivazione a terra dall'anello
      `<line x1="${cx+14}" y1="${toY}" x2="${cx+36}" y2="${toY}" stroke="${col}" stroke-width="2"/>`,
      `<line x1="${cx+36}" y1="${toY}" x2="${cx+36}" y2="${toY+22}" stroke="${col}" stroke-width="2"/>`,
      `<line x1="${cx+24}" y1="${toY+22}" x2="${cx+48}" y2="${toY+22}" stroke="${col}" stroke-width="2.5"/>`,
      `<line x1="${cx+29}" y1="${toY+30}" x2="${cx+43}" y2="${toY+30}" stroke="${col}" stroke-width="2"/>`,
      `<line x1="${cx+33}" y1="${toY+38}" x2="${cx+39}" y2="${toY+38}" stroke="${col}" stroke-width="1.5"/>`,
      // Etichetta tipo differenziale (a sinistra per non sovrapporsi alle etichette di destra)
      `<text x="${cx-hw-8}" y="${toY}" font-size="20" fill="${col}" text-anchor="end" font-family="${F}" dominant-baseline="middle" font-weight="700">\u0394${tipo}</text>`,
    ].join('');
  }

  // SEZIONATORE \u2014 Sezionatore di manutenzione (IEC 60617-07-07-01)
  // Cerchi APERTI (vuoti) ai punti di contatto + lama diagonale + barra fissa
  // Visivamente DISTINTO dall'MCB: cerchi vuoti, nessun T-bar, angolo diverso
  function symSez(cx, cy, col) {
    col = col || C.dcPos;
    const hw = 18, hh = 20;
    return [
      // Punto di articolazione (cerchio VUOTO = contatto apribile manualmente)
      `<circle cx="${cx}" cy="${cy-hh}" r="6" fill="${C.white}" stroke="${col}" stroke-width="2.5"/>`,
      // Lama aperta (angolo meno ripido del MCB \u2192 visivamente distinguibile)
      `<line x1="${cx}" y1="${cy-hh}" x2="${cx+hw+2}" y2="${cy+hh-8}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`,
      // Punto di chiusura (cerchio VUOTO)
      `<circle cx="${cx}" cy="${cy+hh}" r="6" fill="${C.white}" stroke="${col}" stroke-width="2.5"/>`,
      // Barra fissa (pi\u00f9 corta del contatto MCB)
      `<line x1="${cx-hw+4}" y1="${cy+hh}" x2="${cx+hw-4}" y2="${cy+hh}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`,
    ].join('');
  }

  // FUSIBILE \u2014 IEC 60617-02-01-01 (rettangolo con filamento)
  // Simbolo standard IEC invariato \u2014 gi\u00e0 corretto
  function symFuse(cx, cy, col) {
    col = col || C.dcPos;
    const bw = 14, bh = 20;
    return [
      `<rect x="${cx-bw}" y="${cy-bh}" width="${bw*2}" height="${bh*2}" rx="3" fill="${C.white}" stroke="${col}" stroke-width="2.5"/>`,
      `<line x1="${cx}" y1="${cy-bh}" x2="${cx}" y2="${cy+bh}" stroke="${col}" stroke-width="1.8"/>`,
    ].join('');
  }

  // SPD \u2014 Scaricatore di sovratensione / varistore (IEC 60617)
  // Rettangolo varistore (con freccia caratteristica non-lineare) + simbolo terra
  function symSPD(cx, cy, col) {
    col = col || C.ac;
    const bw = 16, bh = 14;
    return [
      // Box varistore (rettangolo IEC)
      `<rect x="${cx-bw}" y="${cy-bh}" width="${bw*2}" height="${bh*2}" rx="2" fill="#fff8e1" stroke="${col}" stroke-width="2"/>`,
      // Freccia diagonale interna (indica caratteristica tensione-corrente non-lineare)
      `<line x1="${cx-bw+5}" y1="${cy+bh-5}" x2="${cx+bw-5}" y2="${cy-bh+5}" stroke="${col}" stroke-width="1.8"/>`,
      `<polygon points="${cx+bw-5},${cy-bh+5} ${cx+bw-11},${cy-bh+4} ${cx+bw-6},${cy-bh+10}" fill="${col}"/>`,
      // Tratto di raccordo al simbolo terra
      `<line x1="${cx}" y1="${cy+bh}" x2="${cx}" y2="${cy+bh+12}" stroke="${col}" stroke-width="2.5"/>`,
      // Simbolo terra IEC: tre barre decrescenti
      `<line x1="${cx-20}" y1="${cy+bh+12}" x2="${cx+20}" y2="${cy+bh+12}" stroke="${col}" stroke-width="3"/>`,
      `<line x1="${cx-13}" y1="${cy+bh+20}" x2="${cx+13}" y2="${cy+bh+20}" stroke="${col}" stroke-width="2"/>`,
      `<line x1="${cx-6}" y1="${cy+bh+28}" x2="${cx+6}" y2="${cy+bh+28}" stroke="${col}" stroke-width="1.5"/>`,
    ].join('');
  }

  // CONTATORE \u2014 IEC: cerchio con testo kWh + frecce bidirezionali opzionali
  function symMeter(cx, cy, lbl, bidirezionale, col) {
    col = col || C.ac;
    lbl = lbl || 'kWh';
    const r = 38;
    let frecce = '';
    if (bidirezionale) {
      frecce = [
        `<line x1="${cx-20}" y1="${cy-10}" x2="${cx+20}" y2="${cy-10}" stroke="${col}" stroke-width="2" marker-end="url(#arrowMeter)"/>`,
        `<line x1="${cx+20}" y1="${cy+10}" x2="${cx-20}" y2="${cy+10}" stroke="${col}" stroke-width="2" marker-end="url(#arrowMeterRev)"/>`,
      ].join('');
    }
    return [
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.white}" stroke="${col}" stroke-width="2.5"/>`,
      `<text x="${cx}" y="${cy-8}" font-size="26" fill="${col}" text-anchor="middle" font-family="${F}" dominant-baseline="middle" font-weight="700">${lbl}</text>`,
      frecce,
    ].join('');
  }

  function symModulo(x, y, w, h) {
    w = w||200; h = h||140;
    return [
      R(x, y, w, h, 4, '#fffde7', '#1a1a1a', 2),
      L(x, y+h, x+w, y, '#1a1a1a', 1.5),
      L(x+w/3, y, x+w/3, y+h, '#1a1a1a', 0.8),
      L(x+2*w/3, y, x+2*w/3, y+h, '#1a1a1a', 0.8),
      L(x, y+h/2, x+w, y+h/2, '#1a1a1a', 0.8),
    ].join('');
  }

  function symInverter(cx, cy, w, h, brand, model, pac) {
    w = w||400; h = h||250;
    const x = cx-w/2, y = cy-h/2;
    // Layout:
    //  METÀ SUPERIORE (y → cy)  = targa: brand / model / Pac
    //  Linea divisoria           = cy  (tratteggiata orizzontale)
    //  METÀ INFERIORE (cy → bot) = simboli circuito IEC: lato DC sx, lato AC dx, freccia centro
    const dcX    = cx - w/4;   // centro lato DC
    const acX    = cx + w/4;   // centro lato AC
    const busW   = 52;         // larghezza bus DC lunga
    // Simboli nella metà inferiore: tutto spostato SOTTO la linea divisoria (cy + offset)
    const symY   = cy + 30;    // baseline dei simboli (30px sotto divisoria)
    return [
      // Rettangolo box
      R(x, y, w, h, 8, '#fafafa', '#333333', 2.5),
      // Linea divisoria DC/AC tratteggiata
      L(x, cy, x+w, cy, '#aaaaaa', 1, '8,5'),
      // ── TARGA (metà superiore) ─────────────────────────────────────
      TM(brand||'INVERTER', cx, y+36, 28, '#1a1a1a', '700'),
      TM(model||'', cx, y+70, 22, '#444444'),
      pac > 0 ? TM(`Pac: ${pac.toFixed(1)} kW`, cx, y+100, 20, '#666666') : '',
      // ── SIMBOLO LATO DC (in basso a sinistra) ────────────────────
      T('DC', dcX, cy+14, 14, '#555555', 'middle', '700'),
      // Bus DC: linea lunga + linea corta (IEC 60417-5031)
      L(dcX - busW/2, symY,    dcX + busW/2, symY,    '#444444', 3, null),
      L(dcX - busW/3, symY+14, dcX + busW/3, symY+14, '#444444', 2, null),
      // Linea di collegamento: bus DC → freccia centrale (tratteggiata, sottile)
      L(dcX + busW/2, symY+7, cx - 26, symY+7, '#aaaaaa', 1, '4,3'),
      // ── SIMBOLO CONVERSIONE DC→AC (centro, nella metà inferiore) ──
      // Cerchio che racchiude la freccia: simbolo IEC per convertitore statico
      `<circle cx="${cx}" cy="${symY+7}" r="18" fill="#f0f4ff" stroke="#333333" stroke-width="1.5"/>`,
      L(cx-10, symY+7, cx+8, symY+7, '#333333', 2, null),
      `<polygon points="${cx+10},${symY+7} ${cx+3},${symY+2} ${cx+3},${symY+12}" fill="#333333"/>`,
      // Linea di collegamento: freccia centrale → simbolo AC (tratteggiata, sottile)
      L(cx + 26, symY+7, acX - 30, symY+7, '#aaaaaa', 1, '4,3'),
      // ── SIMBOLO LATO AC (in basso a destra) ──────────────────────
      T('AC', acX, cy+14, 14, '#555555', 'middle', '700'),
      // Onda sinusoidale AC (IEC 60617-A00001) — leggermente più grande e visibile
      `<path d="M ${acX-28} ${symY+7} Q ${acX-14} ${symY-11} ${acX} ${symY+7} Q ${acX+14} ${symY+25} ${acX+28} ${symY+7}" fill="none" stroke="#444444" stroke-width="3"/>`,
    ].join('');
  }

  function symRete(cx, cy, w, h) {
    w = w||600; h = h||160;
    const x = cx-w/2, y = cy-h/2;
    const waveY = cy+20;
    const waveW = 70;
    const waves = [-2, -1, 0].map(i => {
      const wx = cx + i*waveW - waveW;
      return `<path d="M ${wx} ${waveY} Q ${wx+17} ${waveY-22} ${wx+35} ${waveY} Q ${wx+53} ${waveY+22} ${wx+70} ${waveY}" fill="none" stroke="#1a1a1a" stroke-width="2.2"/>`;
    }).join('');
    return [
      R(x, y, w, h, 6, '#f5f5f5', '#1a1a1a', 2.5),
      TM('RETE BT PUBBLICA', cx, cy-20, 30, '#1a1a1a', '700'),
      TM('DSO', cx, cy, 24, '#666666'),
      waves,
    ].join('');
  }

  function bloccoFunz(x, y, w, h, titolo, col) {
    col = col||C.box;
    // Tab: bordo inferiore coincide esattamente con il bordo superiore del box (y)
    // → tab completamente esterno, mai dentro il box
    const titW = Math.min(titolo.length * 13 + 20, w - 30);  // clamp: non sfora mai il box
    const TAB_H = 32;
    return [
      R(x, y, w, h, 12, 'none', col, 2, '16,8'),
      R(x+16, y-TAB_H, titW, TAB_H, 4, '#ffffff', col, 1.5),  // tab esterno, bordo bot = y
      T(titolo, x+26, y-TAB_H/2, 21, col, 'start', '700'),     // testo centrato verticalmente nel tab
    ].join('');
  }

  function labelCavoV(x, yMid, testo1, testo2, col) {
    col = col||C.gray;
    return [
      `<text x="${x+25}" y="${yMid}" font-size="20" fill="${col}" text-anchor="middle" font-family="${F}" dominant-baseline="middle" transform="rotate(-90,${x+25},${yMid})">${testo1}</text>`,
      testo2 ? `<text x="${x+52}" y="${yMid}" font-size="18" fill="${C.lgray}" text-anchor="middle" font-family="${F}" dominant-baseline="middle" transform="rotate(-90,${x+52},${yMid})">${testo2}</text>` : '',
    ].join('');
  }

  function nodo(cx, cy, col, r) {
    r = r||8;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col||C.dcNeg}"/>`;
  }

  function lineaL(x1, y1, x2, y2, col, sw, dash) {
    col = col||'#1a1a1a'; sw = sw||2.5;
    if (x1 === x2 || y1 === y2) return L(x1,y1,x2,y2,col,sw,dash);
    const ym = Math.round((y1+y2)/2);
    const dash_ = dash ? `stroke-dasharray="${dash}"` : '';
    return `<path d="M ${x1} ${y1} L ${x1} ${ym} L ${x2} ${ym} L ${x2} ${y2}" fill="none" stroke="${col}" stroke-width="${sw}" ${dash_}/>`;
  }

  // \u2500\u2500 4. COSTRUZIONE SVG \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  let s = [];

  s.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VW} ${VH}" style="width:100%;background:#fff;display:block;" font-family="${F}">
<defs>
  <marker id="arrowMeter" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
    <path d="M0,0 L0,6 L8,3 z" fill="#1e4aaa"/>
  </marker>
  <marker id="arrowMeterRev" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto">
    <path d="M8,0 L8,6 L0,3 z" fill="#1e4aaa"/>
  </marker>
</defs>`);

  s.push(R(8, 8, VW-16, VH-16, 0, C.white, '#1a1a1a', 1));
  s.push(R(20, 20, VW-40, YY.cart-30, 0, 'none', '#1a1a1a', 2.5));

  // ── HEADER SCHEMA ─────────────────────────────────────────────────────
  s.push(R(20, 10, VW - 40, 70, 0, '#f0f4ff', '#1e4aaa', 2));
  s.push(TM('SCHEMA ELETTRICO UNIFILARE \u2014 IMPIANTO FOTOVOLTAICO', VW/2, 38, 32, '#1e4aaa', '700'));
  s.push(TM(`Pac tot.: ${P_pac_tot > 0 ? P_pac_tot.toFixed(1) : '\u2014'} kW \u00b7 Potenza picco: ${P_kwp.toFixed(2)} kWp \u00b7 `
    + `${totPanels} moduli \u00b7 ${totStr} stringa/e \u00b7 ${sysLbl}`, VW/2, 64, 20, '#444444', 'normal'));

  // \u2500\u2500 CAMPO FV \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // ── CAMPO FV — box testuali per stringa ──────────────────
  // Zona DC: etichetta sezione
  // Etichetta sezione DC: centrata sopra le colonne MPPT
  const campoLabelX = Math.round((colXs[0] + colXs[nCols - 1]) / 2);
  s.push(TM('CAMPO FOTOVOLTAICO \u2014 LATO CC', campoLabelX, YY.moduli - 45, 21, C.dcPos, '700'));

  const STR_BOX_H = 90;
  const STR_Y     = YY.moduli;   // tutte le stringhe alla stessa Y

  strXs.forEach((str, si) => {
    const sx = str.x;
    const mi = str.mpptIdx;

    // Label colonna MPPT sopra la prima stringa di ogni colonna
    if (si === mi * STR_PER_COL) {
      s.push(TM(`MPPT ${mi + 1}`, colXs[mi], STR_Y - 22, 18, C.lgray, '600'));
    }
    // Box stringa: rettangolo giallo + diagonale IEC
    s.push(R(sx - STR_BOX_W/2, STR_Y, STR_BOX_W, STR_BOX_H, 4, '#fffde7', C.dcPos, 1.8));
    s.push(L(sx - STR_BOX_W/2 + 4, STR_Y + STR_BOX_H - 4,
             sx + STR_BOX_W/2 - 4, STR_Y + 4, C.dcPos, 1, '8,5'));
    const strObj  = strings[si];
    const strName = strObj ? strObj.name : `S${si + 1}`;
    s.push(T(strName,
             sx - STR_BOX_W/2 + 8, STR_Y + 22, 19, '#1a1a1a', 'start', '700'));
    s.push(T(`${modsPerStr} mod. · ${(modsPerStr*pp/1000).toFixed(2)} kWp`,
             sx - STR_BOX_W/2 + 8, STR_Y + 47, 15, '#444444', 'start'));
    s.push(T(`Voc ${V_str_voc.toFixed(0)} V · Isc ${isc.toFixed(1)} A`,
             sx - STR_BOX_W/2 + 8, STR_Y + 68, 13, C.gray, 'start'));
    // Unifilare: singola linea DC dal box alla cassetta
    s.push(L(sx, STR_Y + STR_BOX_H, sx, YY.cassetta_top + 15, C.dcPos, 2.5));
    // Hash marks IEC: 2 conduttori (DC+ / DC-)
    const hashY = STR_Y + STR_BOX_H + 40;
    s.push(L(sx - 10, hashY - 10, sx + 10, hashY + 10, C.dcPos, 1.5));
    s.push(L(sx - 10, hashY - 18, sx + 10, hashY - 2, C.dcPos, 1.5));
    // P3: overlay trasparente per hover stringa — evidenzia il percorso DC
    const _hoverStr = `_sldHoverStr(${sx},${STR_Y},${STR_BOX_W},${STR_BOX_H},${YY.cassetta_top},${si},'${strName}',${V_str_voc.toFixed(0)},${isc.toFixed(1)},${S_str})`;
    s.push(`<rect x="${sx-STR_BOX_W/2}" y="${STR_Y}" width="${STR_BOX_W}" height="${STR_BOX_H+YY.cassetta_top-STR_Y}" `+
      `fill="transparent" cursor="pointer" `+
      `onmouseenter="${_hoverStr}" onmouseleave="_sldClearHover()"/>`);
  });
  // Stringhe non mostrate
  if (hiddenStrings > 0) {
    s.push(TM(`… +${hiddenStrings} str.`,
              colXs[nCols - 1] + STR_BOX_W/2 + 60, STR_Y + STR_BOX_H/2, 19, C.lgray, '600'));
  }

// \u2500\u2500 CASSETTA STRINGA \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// ── CASSETTA STRINGA ──────────────────────────────────────────────────────
  // CASS_W già calcolata sopra insieme a STR_BOX_W — garantisce contenimento box stringhe
  const CASS_H = YY.cassetta_bot - YY.cassetta_top;

  cassettaXs.forEach((cx_cass, mi) => {
    const strsInMppt = strXs.filter(st => st.mpptIdx === mi);
    if (strsInMppt.length === 0) return;
    const cass_x_left = cx_cass - CASS_W/2;

    // Box cassetta
    s.push(bloccoFunz(cass_x_left, YY.cassetta_top, CASS_W, CASS_H, `MPPT ${mi+1}`));

    // ── Ogni stringa: disconnettore stringa + eventuale fusibile ──
    // Layout verticale per stringa (Y relativi a cassetta_top):
    //   +15: ingresso
    //   +55: centro symSez (disconnettore per stringa) — sempre presente (CEI 64-8 §712.536)
    //   +100: uscita disconnettore
    //   se needsFuse: +135 fusibile, +175 uscita fusibile
    //   bus bar: +205

    const busY    = YY.cassetta_top + 205;  // bus bar (spostato per fare spazio disconnettori)
    const busLeft  = strsInMppt[0].x - 30;
    const busRight = strsInMppt[strsInMppt.length-1].x + 30;

    strsInMppt.forEach((str, si) => {
      // Linea dal tetto cassetta al sezionatore stringa
      // symSez cy=+55: top circle at cy-hh-r = +55-20-6=+29 → connettore arriva a +29
      s.push(L(str.x, YY.cassetta_top + 10, str.x, YY.cassetta_top + 29, C.dcPos, 2.5));
      // Sezionatore DC per stringa — IEC 60617 (cerchi aperti + lama)
      s.push(symSez(str.x, YY.cassetta_top + 55, C.dcPos));
      // Linea dal sezionatore al componente successivo
      // symSez bottom circle at cy+hh+r = +55+20+6=+81 → connettore parte da +81
      s.push(L(str.x, YY.cassetta_top + 81, str.x, YY.cassetta_top + 95, C.dcPos, 2.5));
      if (needsFuse) {
        // Fusibile gPV — IEC 60617 (rettangolo con filamento)
        s.push(symFuse(str.x, YY.cassetta_top + 115, C.dcPos));
        // Linea da fusibile al bus bar
        s.push(L(str.x, YY.cassetta_top + 135, str.x, busY, C.dcPos, 2.5));
      } else {
        // Linea diretta sezionatore → bus bar (no fusibile)
        s.push(L(str.x, YY.cassetta_top + 95, str.x, busY, C.dcPos, 2.5));
      }
    });

    // Etichette componenti — a lato dell'ultima stringa per non sovrapporre
    const lblX = strsInMppt[strsInMppt.length - 1].x + 38;
    s.push(T('SEZ.STR.', lblX, YY.cassetta_top + 55, 13, C.dcPos, 'start', '600'));
    s.push(T(`${Math.ceil(V_str_cold/100)*100}V DC`, lblX, YY.cassetta_top + 71, 13, C.gray, 'start'));
    if (needsFuse) {
      s.push(T(`FUS ${fuseRec_A}A gPV`, lblX, YY.cassetta_top + 135, 13, C.dcPos, 'start', '600'));
      s.push(T(`ISCR: ${iscrU.toFixed(0)}A`, lblX, YY.cassetta_top + 151, 13, C.gray, 'start'));
      s.push(T('CEI EN 60269-6', lblX, YY.cassetta_top + 166, 12, C.lgray, 'start'));
    } else {
      s.push(T('Fus. non richiesti', lblX, YY.cassetta_top + 135, 13, C.gray, 'start'));
      s.push(T('(IEC 62548 §6.3)', lblX, YY.cassetta_top + 150, 12, C.lgray, 'start'));
    }

    // Bus bar DC
    s.push(L(busLeft, busY, busRight, busY, C.dcPos, 4));
    strsInMppt.forEach(str => s.push(nodo(str.x, busY, C.dcPos, 5)));

    // SPD DC per ingresso MPPT — derivazione a destra dal bus bar
    // CEI EN 62305-3: Uc ≥ 1.25 × Voc(Tmin) — uno per ogni ingresso MPPT
    const spd_x = cass_x_left + CASS_W - 55;
    const spdUc  = Math.ceil(V_str_cold * 1.25 / 100) * 100;  // Uc minimo corretto
    s.push(L(busRight, busY, spd_x, busY, C.dcPos, 2, '5,3'));
    // SPD top at cy-bh = busY+55-14 = busY+41 — connettore arriva esattamente al box
    s.push(L(spd_x, busY, spd_x, busY + 41, C.dcPos, 2, '5,3'));
    s.push(symSPD(spd_x, busY + 55, C.dcPos));
    s.push(T('SPD T2', spd_x - 8, busY + 40, 13, C.dcPos, 'end', '600'));
    s.push(T(`Uc≥${spdUc}V`, spd_x - 8, busY + 56, 12, C.gray, 'end'));

    // Tronco principale: dal bus bar (centro) giù al sezionatore DC principale
    // symSez cy=+278: top circle at cy-hh-r = +278-20-6=+252 → connettore arriva a +252
    s.push(nodo(cx_cass, busY, C.dcPos, 5));
    s.push(L(cx_cass, busY, cx_cass, YY.cassetta_top + 252, C.dcPos, 2.5));

    // Sezionatore DC principale (sezionamento manutenzione sotto il bus)
    // bottom circle at cy+hh+r = +278+20+6=+304 → uscita parte da +304
    const sez_y = YY.cassetta_top + 278;
    s.push(symSez(cx_cass, sez_y, C.dcPos));
    s.push(T(`QDC ${Math.ceil(V_str_cold/100)*100}V`, cx_cass + 40, sez_y + 5, 13, C.gray, 'start'));
    s.push(T(`${Math.ceil(I_str_des * strPerMppt)}A DC`, cx_cass + 40, sez_y + 20, 12, C.gray, 'start'));

    // Uscita cassetta: dal sezionatore al fondo del box (linea esplicita)
    s.push(L(cx_cass, sez_y + 26, cx_cass, YY.cassetta_bot, C.dcPos, 2.5));
  });

  // \u2500\u2500 INVERTER \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const invUnits = [];
  if (_inverterList.length > 0) {
    _inverterList.forEach(inv => {
      for (let q = 0; q < inv.qty; q++) invUnits.push(inv);
    });
  } else {
    invUnits.push({ brand: invBrand, model: invModel, pac: invPac, mppt: mpptTot, strPerMppt });
  }
  const showInvU = Math.min(invUnits.length, 4);
  const INV_H    = 280;
  const INV_PAD  = 180;   // padding oltre le cassette estreme

  // INV_TOTAL_W: larghezza complessiva (usata anche per PE line e click rect)
  const invBoxLeft  = colXs[0] - INV_PAD;
  const invBoxRight = colXs[nCols - 1] + INV_PAD;
  const INV_TOTAL_W = invBoxRight - invBoxLeft;

  // Box inverter: uno per unità inverter (non un unico box gigante)
  if (showInvU === 1) {
    // Singolo inverter → unico box
    s.push(bloccoFunz(invBoxLeft, YY.inverter - INV_H/2 - 30, INV_TOTAL_W, INV_H + 60,
      'Quadro Inverter', '#666666'));
  } else {
    // Multi-inverter: box separati per ogni unità
    for (let ui = 0; ui < showInvU; ui++) {
      const mStart = Math.round(ui * nCols / showInvU);
      const mEnd   = Math.round((ui + 1) * nCols / showInvU);
      const uCols  = colXs.slice(mStart, mEnd);
      const bLeft  = uCols[0] - INV_PAD;
      const bRight = uCols[uCols.length - 1] + INV_PAD;
      const bW     = bRight - bLeft;
      s.push(bloccoFunz(bLeft, YY.inverter - INV_H/2 - 30, bW, INV_H + 60,
        `Inverter ${ui + 1}`, '#666666'));
    }
  }

  // Cavi DC: VERTICALI al 100% (stesso X della colonna MPPT)
  colXs.forEach((cx, mi) => {
    // Singola linea DC per colonna MPPT
    s.push(L(cx, YY.cassetta_bot, cx, YY.inverter - INV_H/2, C.dcPos, 2.5));
    s.push(TM(`IN${mi + 1}`, cx, YY.inverter - INV_H/2 - 14, 17, '#999999', '600'));
    // Etichetta cavo DC: su tutte le colonne (prima colonna completa, altre compatte)
    {
      const cableLblY = YY.cassetta_bot + 14;
      const dVcol = calcVoltageDrop(I_str_des, lenStr, S_str, V_str_vmpp, mat, 2);
      const dVok  = dVcol <= dropDCpct;
      if (mi === 0) {
        // Prima colonna: etichetta completa
        s.push(T(`H1Z2Z2-K ${S_str}mm\u00b2 ${matLbl}`, cx + 14, cableLblY, 14, C.dcPos, 'start'));
        s.push(T(`${lenStr}m \u2014 In: ${I_str_des.toFixed(1)} A`, cx + 14, cableLblY + 17, 13, C.gray, 'start'));
        s.push(T(`\u0394V ${dVcol.toFixed(2)}%`, cx + 14, cableLblY + 33, 13, dVok ? '#16a34a' : '#dc2626', 'start', '600'));
      } else {
        // Altre colonne: etichetta compatta con \u0394V% a colori
        s.push(T(`${S_str}mm\u00b2 \u2014 \u0394V ${dVcol.toFixed(2)}%`, cx + 14, cableLblY + 8, 13, dVok ? C.gray : '#dc2626', 'start'));
      }
    }
  });

  // Simbolo inverter + routing interno DC → inverter
  for (let ui = 0; ui < showInvU; ui++) {
    const inv = invUnits[ui];
    const mStart  = Math.round(ui * nCols / showInvU);
    const mEnd    = Math.round((ui + 1) * nCols / showInvU);
    const myCols  = colXs.slice(mStart, mEnd);
    const icx     = Math.round((myCols[0] + myCols[myCols.length - 1]) / 2);
    const iW      = Math.min(INV_TOTAL_W / showInvU - 60, 480);
    // Routing interno: linee da ciascun ingresso MPPT al top dell'inverter
    const invTopY = YY.inverter - INV_H / 2;
    myCols.forEach(colX => {
      if (colX !== icx) {
        // Linea orizzontale dall'ingresso al centro, poi verticale
        s.push(L(colX, invTopY, colX, invTopY + 30, C.dcPos, 2.5, '8,4'));
        s.push(L(colX, invTopY + 30, icx, invTopY + 30, C.dcPos, 2.5, '8,4'));
      }
    });
    s.push(L(icx, invTopY, icx, invTopY + 40, C.dcPos, 2.5, '8,4'));
    s.push(symInverter(icx, YY.inverter, iW, INV_H, inv.brand, inv.model, inv.pac));
    // Annotazioni normative CEI 0-21:2025 — posizionate nel terzo inferiore del box (sotto i simboli IEC)
    const invBotSection = YY.inverter + INV_H/2 - 48;  // ~40px dal bordo inferiore del box
    s.push(TM('Q(U) · cosφ(P) · LVRT/HVRT', icx, invBotSection, 15, '#1e4aaa', '700'));
    s.push(TM('CEI 0-21:2025 §8.7 · All.A', icx, invBotSection + 18, 12, '#4a6a9a', 'normal'));
    s.push(L(icx, YY.inverter + INV_H/2, icx, YY.cavi_ac_top, C.ac, 3));
  }

  // Bus AC se piu' inverter
  if (showInvU > 1) {
    const busACy = YY.cavi_ac_top;
    const busXArr = Array.from({length: showInvU}, (_, ui) => {
      const mStart = Math.round(ui * nCols / showInvU);
      const mEnd   = Math.round((ui + 1) * nCols / showInvU);
      const myCols  = colXs.slice(mStart, mEnd);
      return Math.round((myCols[0] + myCols[myCols.length - 1]) / 2);
    });
    s.push(L(busXArr[0], busACy, busXArr[showInvU - 1], busACy, C.ac, 5));
    busXArr.forEach(bx => s.push(nodo(bx, busACy, C.ac, 10)));
    s.push(TM('Bus AC comune', XC, busACy - 28, 20, C.ac, '600'));
  }

  // ── BESS (P4b — opzionale, AC-coupled o DC-coupled) ──────────────────────
  if (bessMode) {
    const isDCcoupled = _bessTopology === 'dc';
    const BESS_X = XC + 580;
    const BESS_Y = isDCcoupled ? YY.inverter - 120 : YY.inverter - 80;
    const BESS_W = 360, BESS_H = isDCcoupled ? 260 : 220;
    const BESS_COL = isDCcoupled ? '#7c3aed' : '#0891b2';
    s.push(R(BESS_X - BESS_W/2, BESS_Y, BESS_W, BESS_H, 8, isDCcoupled?'#faf5ff':'#f0f9ff', BESS_COL, 2));
    s.push(TM('BESS', BESS_X, BESS_Y + 28, 24, BESS_COL, '700'));
    s.push(TM(isDCcoupled ? 'DC-coupled (inv. ibrido)' : 'AC-coupled', BESS_X, BESS_Y + 56, 18, BESS_COL, '600'));
    // BMS
    s.push(R(BESS_X - 130, BESS_Y + 70, 260, 55, 5, isDCcoupled?'#ede9fe':'#e0f2fe', BESS_COL, 1.5));
    s.push(TM('BMS', BESS_X, BESS_Y + 88, 17, BESS_COL, '700'));
    s.push(TM('OVP · UVP · OCP · OTP · SCP', BESS_X, BESS_Y + 108, 14, C.gray, 'normal'));
    // Parametri
    s.push(T('• IEC 62619 · UN 38.3 (certif. obbligatoria)', BESS_X - BESS_W/2+12, BESS_Y + 140, 14, C.gray, 'start'));
    s.push(T('• SPD DC: Uc≥1.25×Vbat_max (CEI EN 61643-31)', BESS_X - BESS_W/2+12, BESS_Y + 158, 14, C.gray, 'start'));
    s.push(T('• Sez. manutenzione visibile se V>48V', BESS_X - BESS_W/2+12, BESS_Y + 176, 14, C.gray, 'start'));
    s.push(T('• CEI EN 62933-1 · CEI 0-21:2025 §12', BESS_X - BESS_W/2+12, BESS_Y + 194, 14, '#4a6a9a', 'start'));
    if (isDCcoupled) {
      // DC-coupled: batteria collegata al bus DC dell'inverter ibrido
      s.push(T('• Carica/scarica anche senza rete (island mode)', BESS_X - BESS_W/2+12, BESS_Y + 212, 14, '#7c3aed', 'start'));
      s.push(T('• Efficienza round-trip superiore ad AC-coupled', BESS_X - BESS_W/2+12, BESS_Y + 230, 14, '#7c3aed', 'start'));
      // Collegamento DC al bus inverter ibrido
      s.push(L(BESS_X - BESS_W/2, BESS_Y + BESS_H/2, XC + 220, YY.inverter, C.dcPos, 2, '8,5'));
      s.push(T('H1Z2Z2-K — DC-coupled', BESS_X - BESS_W/2 - 10, BESS_Y + BESS_H/2 - 14, 14, C.dcPos, 'end'));
      s.push(T('⚠ Inverter ibrido con doppio ingresso DC', BESS_X, BESS_Y + BESS_H + 16, 15, '#7c3aed', 'middle'));
    } else {
      // AC-coupled: collegamento al quadro BT
      s.push(L(BESS_X - BESS_W/2, BESS_Y + BESS_H/2, XC + QBT_W/2, YY.qbt_top + 100, C.ac, 2));
      s.push(T('FG7OR — AC-coupled', BESS_X - BESS_W/2 - 10, BESS_Y + BESS_H/2 - 14, 14, C.ac, 'end'));
      s.push(T('DDI dedicato lato AC batteria (CEI 0-21 §12)', BESS_X, BESS_Y + BESS_H + 16, 15, '#0891b2', 'middle'));
    }
  }

  // Cavo AC verso Quadro BT
  s.push(L(XC, YY.cavi_ac_top, XC, YY.qbt_top, C.ac, 3.5));
  const acLblY = YY.cavi_ac_top + 14;
  s.push(T(`FG7OR ${S_AC_calc}mm\u00b2 ${matLbl}`, XC + 14, acLblY, 14, C.ac, 'start'));
  s.push(T(`${lenAC}m \u2014 In: ${I_AC.toFixed(1)} A`, XC + 14, acLblY + 17, 13, C.gray, 'start'));
  s.push(T(`Vn: ${V_AC} V`, XC + 14, acLblY + 33, 13, C.gray, 'start'));
  // \u2500\u2500 QUADRO AC PRODUZIONE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // \u2500\u2500 QUADRO BT (Produzione FV) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const QBT_W = 620, QBT_H = YY.qbt_bot - YY.qbt_top;
  s.push(bloccoFunz(XC-QBT_W/2, YY.qbt_top, QBT_W, QBT_H, 'Quadro BT \u2014 Produzione FV', '#1a3a6e'));

  let yQ = YY.qbt_top + 80;
  // Conduttore AC entrata QBT \u2192 MCB
  s.push(L(XC, YY.qbt_top + 20, XC, yQ - 40, C.ac, 3.5));
  s.push(symMCB(XC, yQ, C.ac));
  s.push(T(`MCB ${sysLbl}`, XC+48, yQ-22, 22, '#1a1a1a', 'start', '700'));
  s.push(T(`In: ${Math.ceil(I_AC*1.25)}A \u2014 curva C`, XC+48, yQ+12, 19, C.gray, 'start'));
  s.push(T('CEI EN 60898-1 \u00b7 OVC III', XC+48, yQ+30, 13, C.lgray, 'start'));
  yQ += 120;

  // Conduttore MCB \u2192 RCD \u2014 parte da MCB bottom (cy_mcb+hh = yQ-120+24 = yQ-96)
  s.push(L(XC, yQ - 96, XC, yQ - 40, C.ac, 3.5));
  s.push(symRCD(XC, yQ, 'A', C.ac));
  s.push(T('RCD Tipo A', XC+48, yQ-38, 22, '#1a1a1a', 'start', '700'));
  s.push(T(`In: ${Math.ceil(I_AC*1.25)}A \u2014 I\u0394n: 30mA`, XC+48, yQ, 19, C.gray, 'start'));
  s.push(T('CEI EN 61008-1 \u00b7 Tipo A', XC+48, yQ+22, 13, C.lgray, 'start'));
  yQ += 140;

  // Conduttore RCD → contatore produzione — parte da RCD exit (toroide bottom+r = cy_rcd+68 = yQ-140+68 = yQ-72)
  s.push(L(XC, yQ - 72, XC, yQ - 38, C.ac, 3.5));
  // Contatore produzione (monodir.) dentro il Quadro BT
  s.push(symMeter(XC, yQ, 'kWh', false, '#1a7000'));
  s.push(T('Contatore produzione', XC+55, yQ-20, 20, '#1a1a1a', 'start', '700'));
  s.push(T('Classe B \u2014 monodirezionale', XC+55, yQ+8, 18, C.gray, 'start'));

  // SPD AC T2 — derivazione pulita ortogonale dal tronco principale
  const spdACx = XC - QBT_W/2 + 90;
  const spdACy = YY.qbt_top + QBT_H/2;
  // Derivazione SPD: prende dal conduttore MCB→RCD (tra MCB_bot@+104 e RCD_top@+160)
  // qbt_top+108 = 4px sotto MCB_bot → nessun overlap con i simboli
  s.push(nodo(XC, YY.qbt_top + 108, C.ac, 5));  // nodo T-junction SPD derivazione
  s.push(L(XC, YY.qbt_top + 108, spdACx, YY.qbt_top + 108, C.ac, 1.5, '6,4'));
  s.push(L(spdACx, YY.qbt_top + 108, spdACx, spdACy - 35, C.ac, 1.5, '6,4'));
  s.push(symSPD(spdACx, spdACy, C.ac));
  s.push(T('SPD AC T2', spdACx+28, spdACy-30, 18, C.ac, 'start', '600'));
  s.push(T(`Uc: 275V \u2014 ${sysLbl}`, spdACx+28, spdACy-5, 16, C.gray, 'start'));
  s.push(T('OVC II \u00b7 Rif: CEI EN 61643-11', spdACx+28, spdACy+16, 13, C.lgray, 'start'));

  // Linea Quadro BT → SPI
  s.push(L(XC, YY.qbt_bot, XC, YY.spi_y - (spiIntegrato ? 55 : 95), C.ac, 3.5));

  // \u2500\u2500 SPI \u2014 SISTEMA DI PROTEZIONE INTERFACCIA (nodo funzionale) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const SPI_W = 560, SPI_H = spiIntegrato ? 110 : 190;
  s.push(bloccoFunz(XC - SPI_W/2, YY.spi_y - SPI_H/2, SPI_W, SPI_H,
    'SPI \u2014 Sistema di Protezione Interfaccia', spiIntegrato ? '#555555' : '#b45309'));

  if (spiIntegrato) {
    s.push(T('Integrato nell’inverter (P&P)', XC+20, YY.spi_y - 18, 16, '#555555', 'start', '700'));
    s.push(T(`Pac = ${P_pac_tot.toFixed(1)} kW ≤ 11.08 kW — CEI §8.2.2.2`, XC+20, YY.spi_y + 8, 13, '#888888', 'start'));
    s.push(T('LVRT/HVRT abilitato — Allegato A', XC+20, YY.spi_y + 28, 13, '#1e4aaa', 'start', '600'));
  } else {
    s.push(T('Relè interfaccia + logica protezione', XC+20, YY.spi_y - 68, 14, '#1a1a1a', 'start'));
    s.push(T(cartSpiModello || '[Marca / Modello SPI]', XC+20, YY.spi_y - 46, 15, '#444444', 'start', '600'));
    s.push(T('SN: ' + (cartSpiMatricola || '[Matricola]'), XC+20, YY.spi_y - 24, 13, '#444444', 'start'));
    s.push(T('59.S1/S2 · 27.S1/S2 · 81>.S2 · 81<.S2', XC+20, YY.spi_y + 4, 13, '#666666', 'start'));
    s.push(T('LVRT/HVRT abilitato — Allegato A', XC+20, YY.spi_y + 24, 13, '#1e4aaa', 'start', '600'));
    s.push(T(`Pac ${P_pac_tot.toFixed(1)} kW > 11.08 kW — est. obbl.`, XC+20, YY.spi_y + 44, 12, '#b45309', 'start'));
    // Freccia di comando SPI \u2192 DDI (tratteggiata, lato destro)
    const _cmdX = XC + SPI_W/2 + 60;
    s.push(L(XC + SPI_W/2, YY.spi_y, _cmdX, YY.spi_y, '#b45309', 1.5, '5,3'));
    s.push(L(_cmdX, YY.spi_y, _cmdX, YY.ddi_y, '#b45309', 1.5, '5,3'));
    s.push(L(_cmdX, YY.ddi_y, XC + 230, YY.ddi_y, '#b45309', 1.5, '5,3'));
    s.push(T('Cmd apertura DDI', _cmdX + 8, (YY.spi_y + YY.ddi_y)/2, 15, '#b45309', 'start', '600'));
  }

  // Linea SPI \u2192 DDI (conduttore AC)
  s.push(L(XC, YY.spi_y + SPI_H/2, XC, YY.ddi_y - 100, C.ac, 3.5));

  // \u2500\u2500 DDI \u2014 DISPOSITIVO DI INTERFACCIA \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  s.push(R(XC-230, YY.ddi_y-100, 430, 200, 6, 'none', '#333333', 2, '12,6'));
  // Connettori interni: dal bordo del box al simbolo MCB
  s.push(L(XC, YY.ddi_y - 100, XC, YY.ddi_y - 40, '#1a1a1a', 3.5));
  s.push(symMCB(XC, YY.ddi_y, '#1a1a1a'));
  s.push(L(XC, YY.ddi_y + 24, XC, YY.ddi_y + 100, '#1a1a1a', 3.5));
  s.push(T('DDI', XC+65, YY.ddi_y-76, 28, '#1a1a1a', 'start', '700'));
  s.push(T('Dispositivo di Interfaccia', XC+65, YY.ddi_y-44, 20, C.gray, 'start'));
  s.push(T(`In: ${Math.ceil(I_AC*1.3)}A \u2014 4P \u2014 Motorizzato`, XC+65, YY.ddi_y-10, 19, C.gray, 'start'));
  if (!spiIntegrato) {
    s.push(T('\u26a1 Comandato da SPI (apertura entro 0.5 s)', XC+65, YY.ddi_y+26, 17, '#b45309', 'start', '600'));
    s.push(T('CEI 0-21 \u00a78.2.2.3', XC+65, YY.ddi_y+58, 16, C.lgray, 'start'));
  } else {
    s.push(T('CEI 0-21 \u00a78.2.2.3 \u2014 a valle PdC', XC+65, YY.ddi_y+26, 17, C.lgray, 'start'));
  }

  // ── SWITCH PRE-M0 (opzionale — richiesto da alcuni DSO) ──────────────────
  // sw_y: tra DDI box_bot (ddi_y+100=2160) e contatore top (contatore_scambio-38=2242)
  // spazio: 82px, switch+connettori: 72px → fit OK
  if (hasSwitch) {
    const sw_y = YY.ddi_y + 136;  // = 2196, tra DDI_bot(2160) e contatore_top(2242)
    s.push(L(XC, YY.ddi_y + 100, XC, sw_y - 26, C.ac, 3.5));  // DDI_bot → sez_top
    s.push(symSez(XC, sw_y, '#374151'));
    s.push(L(XC, sw_y + 26, XC, YY.contatore_scambio - 38, C.ac, 3.5));  // sez_bot → contatore
    s.push(T('Q1 \u2014 Sez. generale', XC + 32, sw_y + 5, 17, '#374151', 'start', '600'));
    s.push(T('(Req. DSO)', XC + 32, sw_y + 22, 14, C.gray, 'start'));
  } else {
    // (rimosso: unica linea diretta ddi→contatore sotto)
    // (unica linea corretta già sotto)
    s.push(L(XC, YY.ddi_y + 100, XC, YY.contatore_scambio - 38, C.ac, 3.5));
  }
  // \u2500\u2500 CONTATORE SCAMBIO \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Conduttore DDI/switch → contatore scambio
  // Conduttore → contatore: solo in assenza di switch (il switch ha già il suo connettore finale)
  // (rimosso: conduttore già nel blocco else sopra)
  // (conduttore ddi→contatore gestito nell'else sopra con linea diretta)
  s.push(T('Contatore di scambio SSP', XC+55, YY.contatore_scambio-22, 22, '#1a1a1a', 'start', '700'));
  s.push(T('Classe B \u2014 bidirezionale 2G teleleggibile (GSE)', XC+55, YY.contatore_scambio+6, 18, C.gray, 'start'));
  // P0: nota bidirezionale obbligatorio per TUTTI (non solo >6kW), nota trifase se >6kW
  s.push(T('\u2022 Obbl. per tutti gli impianti FV grid-connected \u2014 CEI 0-21:2025 \u00a75.1', XC+55, YY.contatore_scambio+28, 14, C.gray, 'start'));
  if (sysAC !== 'mono') {
    s.push(T('\u26a0 Trifase obbligatorio (Pac > 6 kW) \u2014 CEI 0-21 \u00a75.1', XC + 55, YY.contatore_scambio + 46, 14, '#b45309', 'start'));
  }

  s.push(L(XC, YY.contatore_scambio+42, XC, YY.pdc-20, C.ac, 3.5));

  // PdC
  s.push(nodo(XC, YY.pdc, C.ac, 10));
  const utX = XC - 500;
  s.push(L(XC, YY.pdc, utX, YY.pdc, C.ac, 3));
  s.push(L(utX, YY.pdc, utX, YY.pdc+80, C.ac, 3));
  s.push(R(utX-120, YY.pdc+80, 240, 80, 6, C.white, '#1a1a1a', 2));
  s.push(TM('Utenze', utX, YY.pdc+120, 28, '#1a1a1a', '700'));
  s.push(T('POD \u2014 Punto di consegna', XC+25, YY.pdc, 22, C.gray, 'start', 'normal'));

  s.push(L(XC, YY.pdc, XC, YY.rete-80, C.ac, 3.5));

  // \u2500\u2500 RETE BT DSO \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  s.push(symRete(XC, YY.rete));

  // ── SOGLIE SPI (colonna destra, riferimento CEI 0-21 Tab.13) ──────
  if (!spiIntegrato) {
    const spiX = RH_X + 10, spiY = YY.moduli + 610;
    const spiW = RH_W - 20;
    s.push(R(spiX, spiY, spiW, 320, 4, '#fffbeb', '#b45309', 1.5));
    s.push(T('Soglie SPI — CEI 0-21:2025-10 Tab.13', spiX + 14, spiY + 22, 18, '#b45309', 'start', '700'));
    const spiSoglie = [
      ['59.S1', "Max tensione (media 10')", '≥ 1.10 Vn', '603 s'],
      ['59.S2', 'Max tensione istantanea',   '≥ 1.15 Vn', '0.2 s'],
      ['27.S1', 'Min tensione',              '≤ 0.85 Vn', '1.5 s'],
      ['27.S2', 'Min tensione rapida',       '≤ 0.15 Vn', '0.2 s'],
      ['81>.S2','Max frequenza',             '≥ 51.5 Hz',  '1 s'],
      ['81<.S2','Min frequenza',             '≤ 47.5 Hz',  '4 s'],
    ];
    spiSoglie.forEach((r, ri) => {
      const ry = spiY + 46 + ri * 42;
      s.push(R(spiX + 6, ry - 14, spiW - 12, 38, 2, ri%2===0 ? '#fff8e1' : '#ffffff', 'none', 0));
      s.push(T(r[0], spiX + 16, ry + 5, 16, '#b45309', 'start', '700'));
      s.push(T(r[1], spiX + 95, ry + 5, 15, '#333333', 'start'));
      s.push(T(r[2], spiX + 310, ry + 5, 16, '#1a1a1a', 'start', '600'));
      s.push(T(r[3], spiX + 430, ry + 5, 16, '#444444', 'start'));
    });
  }

  // ── RIEPILOGO IMPIANTO (colonna destra) ────────────────────────────────
  {
    const RI_X = RH_X + 10, RI_W = RH_W - 20;
    const RI_Y = YY.moduli + (spiIntegrato ? 610 : 950);
    const RI_H = 420;
    s.push(R(RI_X, RI_Y, RI_W, RI_H, 6, '#f8faff', '#1e4aaa', 1.5));
    s.push(R(RI_X, RI_Y, RI_W, 40, 6, '#e8efff', '#1e4aaa', 1.5));
    s.push(TM('RIEPILOGO IMPIANTO', RI_X + RI_W/2, RI_Y + 24, 20, '#1e4aaa', '700'));
    const ri = [
      ['Potenza picco FV',     `${P_kwp.toFixed(2)} kWp`],
      ['Potenza AC nominale',  `${P_pac_tot > 0 ? P_pac_tot.toFixed(1) : (invPac||'\u2014')} kW`],
      ['N\u00b0 moduli',          `${totPanels} ud.`],
      ['N\u00b0 stringhe',        `${totStr} (${strPerMppt}/MPPT)`],
      ['Moduli / stringa',     `${modsPerStr} ud.`],
      ['Tensione Voc stringa', `${V_str_voc.toFixed(0)} V`],
      ['Sistema AC',           sysLbl],
      ['Sistema di terra',     'TT'],
      ['Cavo stringa DC',      `H1Z2Z2-K ${S_str} mm\u00b2`],
      ['Cavo AC uscita',       `FG7OR ${S_AC_calc} mm\u00b2`],
    ];
    ri.forEach((row, i) => {
      const ry = RI_Y + 55 + i * 36;
      s.push(R(RI_X + 4, ry - 13, RI_W - 8, 32, 2, i%2===0 ? '#f0f4ff' : '#f8faff', 'none', 0));
      s.push(T(row[0], RI_X + 16, ry + 7, 17, '#444444', 'start'));
      s.push(T(row[1], RI_X + RI_W - 16, ry + 7, 18, '#1a1a1a', 'end', '600'));
    });
    const rfY = RI_Y + 55 + ri.length * 36 + 6;
    s.push(L(RI_X, rfY, RI_X + RI_W, rfY, '#aaaaaa', 1));
    s.push(TM('Dati calcolati dal progetto', RI_X + RI_W/2, rfY + 18, 15, '#999999'));
  }

  // ── LINEA PE ──────────────────────────────────────────────────────────────────
  const PE_X = Math.min(XC + INV_TOTAL_W/2 + 140, RH_X - 160);  // mai dentro la colonna destra
  s.push(L(PE_X, YY.moduli, PE_X, YY.rete, C.pe, 2, '12,6'));
  s.push(TRot('Conduttore PE / Terra', PE_X, (YY.moduli+YY.rete)/2, 22, C.pe, -90));
  const teY = YY.rete + 40;
  s.push(L(PE_X, YY.rete, PE_X, teY, C.pe, 2.5));
  s.push(L(PE_X-35, teY, PE_X+35, teY, C.pe, 3.5));
  s.push(L(PE_X-22, teY+14, PE_X+22, teY+14, C.pe, 2.5));
  s.push(L(PE_X-10, teY+28, PE_X+10, teY+28, C.pe, 1.5));
  // Connessioni PE: start X specifico per ogni sezione
  const peNodes = [
    { py: YY.inverter,         boxRight: invBoxRight + 20 },
    { py: YY.qbt_top + QBT_H/2, boxRight: XC + QBT_W/2 + 20 },
    { py: YY.ddi_y,            boxRight: XC + 230 + 20 },
  ];
  peNodes.forEach(({py, boxRight}) => {
    const peStartX = Math.min(boxRight, PE_X - 30);
    s.push(L(peStartX, py, PE_X, py, C.pe, 1.5, '8,5'));
    s.push(nodo(PE_X, py, C.pe, 6));
  });

  // \u2500\u2500 CARTIGLIO \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // ── PERCORSO PE / EQUIPOTENZIALE (CEI 64-8 sez. 712.54) ───────────────────
  {
    const PE_X = RH_X - 200;   // lato destro dello schema, fuori dalla zona MPPT
    const PE_COL = '#16a34a';  // verde PE
    const PE_DASH = '8,4';
    // Linea verticale PE dalla struttura (pannelli) verso il basso
    s.push(L(PE_X, YY.moduli + 60, PE_X, YY.qbt_top + 280, PE_COL, 2, PE_DASH));
    // Nodo equipotenziale (barra PE quadro AC)
    const peNodeY = YY.qbt_top + 280;
    s.push(R(PE_X - 40, peNodeY - 12, 80, 24, 4, PE_COL, 'none', 0));
    s.push(T('PE', PE_X, peNodeY + 4, 18, C.white, 'middle', '700'));
    // Dal nodo PE verso dispersore (in basso)
    const dispY = YY.ddi_y + 60;
    s.push(L(PE_X, peNodeY + 12, PE_X, dispY, PE_COL, 2, PE_DASH));
    // Simbolo dispersore (linee orizzontali decrescenti)
    const dBases = [40, 28, 16];
    dBases.forEach((hw, di) => {
      s.push(L(PE_X - hw, dispY + di*12, PE_X + hw, dispY + di*12, PE_COL, 2));
    });
    s.push(T('Dispersore vert.', PE_X + 50, dispY + 16, 16, PE_COL, 'start'));
    // Calcolo Rt
    const earthRho2 = parseFloat((document.getElementById('earthRho')||{value:'100'}).value)||100;
    const earthLen2 = parseFloat((document.getElementById('earthLen')||{value:'1.5'}).value)||1.5;
    const EARTH_ROD_D2 = 0.014;
    const Rt2 = earthLen2 > 0 ? (earthRho2/(2*Math.PI*earthLen2))*Math.log(4*earthLen2/EARTH_ROD_D2) : 999;
    const rtOk2 = Rt2 <= 5.0;
    s.push(T(`Rt = ${Rt2.toFixed(1)} Ω ${rtOk2 ? '✔' : '⚠ > 5Ω'}`, PE_X + 50, dispY + 34, 15, rtOk2?PE_COL:'#dc2626', 'start'));
    s.push(T('ρ = '+earthRho2+' Ω·m, L = '+earthLen2+' m (CEI 64-8 art. 612.6)', PE_X + 50, dispY + 50, 13, C.gray, 'start'));
    // Label percorso PE
    s.push(T('Conduttore PE / eq. masse (1× 6mm² G/V)', PE_X + 50, YY.moduli + 80, 16, PE_COL, 'start'));
  }

  // ── P3: OVERLAY CLICCABILI SUI COMPONENTI (onclick popup tecnico) ────────
  // Rettangoli trasparenti posizionati sopra i blocchi principali
  const _clickRect = (x, y, w, h, cid) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="transparent" cursor="pointer" `+
    `onclick="_showSldPopup('${cid}',event.clientX+10,event.clientY+10)"/>`;
  // Quadro DC (cassette stringhe) — una per colonna MPPT
  cassettaXs.forEach(cx => {
    s.push(_clickRect(cx - COL_W/2 + 20, YY.cassetta_top - 20, COL_W - 40, YY.cassetta_bot - YY.cassetta_top + 40, 'cassetta'));
  });
  // Quadro Inverter
  s.push(_clickRect(XC - INV_TOTAL_W/2 - 20, YY.inverter - INV_H/2 - 20, INV_TOTAL_W + 40, INV_H + 40, 'inverter'));
  // Quadro BT
  s.push(_clickRect(XC - QBT_W/2, YY.qbt_top, QBT_W, QBT_H, 'qbt'));
  // SPI
  s.push(_clickRect(XC - SPI_W/2 - 10, YY.spi_y - SPI_H/2 - 10, SPI_W + 20, SPI_H + 20, 'spi'));
  // DDI
  s.push(_clickRect(XC - 230, YY.ddi_y - 110, 430 + 20, 220, 'ddi'));
  // Contatore scambio
  s.push(_clickRect(XC - 45, YY.contatore_scambio - 50, 500, 100, 'cnt'));
  // BESS
  if (bessMode) {
    const BESS_X2 = XC + 550;
    s.push(_clickRect(BESS_X2 - 160 - 10, YY.inverter - 80 - 10, 340, 200, 'bess'));
  }

  // ── LINEA CONFINE DSO ─────────────────────────────────────────────────────
  const dsoBoundaryY = Math.round((YY.contatore_scambio + 70 + YY.pdc - 20) / 2);
  s.push(L(40, dsoBoundaryY, VW-40, dsoBoundaryY, '#888888', 1.2, '10,6'));
  s.push(T('Confine di propriet\u00e0 / PdC', 55, dsoBoundaryY - 14, 20, '#888888', 'start'));
  s.push(T('\u25c4 Lato utente', 55, dsoBoundaryY + 24, 18, '#888888', 'start'));
  s.push(T('Lato DSO \u25ba', VW - 55, dsoBoundaryY + 24, 18, '#888888', 'end'));

  // ── LEGENDA ─────────────────────────────────────────────────────────────────
  const LEG_X = 50, LEG_Y = YY.cart - 310;
  s.push(R(LEG_X - 12, LEG_Y - 32, 810, 290, 4, 'none', '#cccccc', 1));
  s.push(T('LEGENDA', LEG_X, LEG_Y - 8, 22, '#1a1a1a', 'start', '700'));
  // — Linee circuiti —
  const legItems = [
    { col: C.dcPos,  dash: null,   lbl: 'Circuito DC (polo + e \u2212)', hash: true },
    { col: C.ac,     dash: null,   lbl: 'Circuito AC (1~/3~)', hash: false },
    { col: C.pe,     dash: '8,4',  lbl: 'Conduttore PE / terra', hash: false },
    { col: C.pe,     dash: '4,4',  lbl: 'Equipotenziale masse', hash: false },
  ];
  legItems.forEach((it, i) => {
    const yl = LEG_Y + 26 + i * 30;
    s.push(L(LEG_X, yl, LEG_X + 80, yl, it.col, 2.5, it.dash));
    s.push(T(it.lbl, LEG_X + 95, yl + 1, 19, '#1a1a1a', 'start'));
    // Hash marks IEC per circuiti a 2 conduttori
    if (it.hash) {
      s.push(L(LEG_X + 34, yl - 8, LEG_X + 50, yl + 8, it.col, 1.5));
      s.push(L(LEG_X + 40, yl - 8, LEG_X + 56, yl + 8, it.col, 1.5));
      s.push(T('= 2 conduttori', LEG_X + 390, yl + 1, 16, '#888888', 'start'));
    }
  });
  // — Sigle componenti —
  const SIGLE_X = LEG_X + 400;
  s.push(T('SIGLE COMPONENTI', SIGLE_X, LEG_Y - 8, 18, '#1a1a1a', 'start', '700'));
  const sigle = [
    { sigla: 'MCB',  desc: 'Magnetotermico',                norma: 'CEI EN 60898-1'   },
    { sigla: 'RCD',  desc: 'Differenziale',                  norma: 'CEI EN 61008'     },
    { sigla: 'SPD',  desc: 'Scaricatore sovratensione',      norma: 'CEI EN 61643-11'  },
    { sigla: 'DDI',  desc: 'Dispositivo di interfaccia',     norma: 'CEI 0-21 §6.2'  },
    { sigla: 'SPI',  desc: 'Sist. Protezione Interfaccia',   norma: 'CEI 0-21 All.A'   },
    { sigla: 'QDC',  desc: 'Quadro di campo DC',             norma: 'IEC 62548 §6'    },
    { sigla: 'SEZ',  desc: 'Sezionatore DC per stringa',     norma: 'CEI EN 60947-3'   },
    { sigla: 'FUS',  desc: '• fusibile DC se (n∥-1)×Isc>ISCR', norma: 'IEC 62548 §6.3' },
  ];
  sigle.forEach((sg, i) => {
    const ys = LEG_Y + 26 + i * 28;
    s.push(T('▪ '+sg.sigla, SIGLE_X, ys + 1, 17, '#1e40af', 'start', '700'));
    s.push(T('— '+sg.desc, SIGLE_X + 54, ys + 1, 16, '#1a1a1a', 'start'));
    s.push(T(sg.norma, SIGLE_X + 310, ys + 1, 14, '#888888', 'start'));
  });

  // ── TOPOLOGY — grafo impianto (struttura dati) ──────────────────────────────
  // Ogni nodo rappresenta un elemento fisico/funzionale dell'impianto.
  // Ogni edge rappresenta un collegamento elettrico o di comando.
  const topology = {
    nodes: [
      { id: 'campo_fv',  type: 'campo_fv',   label: `${totStr} stringhe`,    detail: `${P_kwp.toFixed(2)} kWp` },
      { id: 'mppt',      type: 'mppt',        label: `${mpptTot} MPPT`,       detail: `${strPerMppt} str./MPPT` },
      ...invUnits.map((inv, i) => ({ id: `inv_${i}`, type: 'inverter', brand: inv.brand, model: inv.model, pac: inv.pac })),
      { id: 'qbt',  type: 'quadro_bt',  label: 'Quadro BT',   detail: `MCB ${Math.ceil(I_AC*1.25)}A \u00b7 RCD \u00b7 SPD` },
      { id: 'spi',  type: 'spi',
        modo:        spiIntegrato ? 'integrato' : 'esterno',
        protezioni:  ['59.S1','59.S2','27.S1','27.S2','81>.S2','81<.S2'],
        comando:     { agisceSu: 'ddi', tipo: 'apertura' },
        modello:     cartSpiModello, matricola: cartSpiMatricola, cert: cartSpiCert },
      { id: 'ddi',  type: 'ddi',
        correnteNominale: Math.ceil(I_AC*1.3), poli: 4, motorizzato: true, controllatoDa: 'spi' },
      { id: 'cnt_sc', type: 'contatore', label: 'Contatore scambio SSP', dir: 'bidirezionale' },
      { id: 'rete',   type: 'rete',      label: 'Rete BT DSO',           voltage: sysLbl },
    ],
    edges: [
      { from: 'campo_fv', to: 'mppt',    cable: { type: 'H1Z2Z2-K', S: S_str,    I: I_str_des, L: lenStr  } },
      { from: 'mppt',     to: 'inv_0',   cable: { type: 'H1Z2Z2-K', S: S_str,    I: I_str_des, L: lenMain } },
      { from: 'inv_0',    to: 'qbt',     cable: { type: 'FG7OR',    S: S_AC_calc, I: I_AC,      L: lenAC   } },
      { from: 'qbt',      to: 'spi',     cable: null },
      { from: 'spi',      to: 'ddi',     cable: null, relation: 'comando' },
      { from: 'ddi',      to: 'cnt_sc',  cable: null },
      { from: 'cnt_sc',   to: 'rete',    cable: null },
    ],
  };
  // Rende la topologia disponibile per debug / export esterno
  try { window.sldTopology = topology; } catch(e) { /* debug hook, non-critical */ }

  // ── CARTIGLIO (CEI EN 62446-1) ────────────────────────────────────────────
  const CY0 = YY.cart;
  const CH  = VH - CY0 - 8;
  // Bordo
  s.push(R(20, CY0, VW - 40, CH, 0, C.white, '#1a1a1a', 2.5));
  // Linea orizzontale sotto il titolo
  s.push(L(20, CY0 + 85, VW - 20, CY0 + 85, '#1a1a1a', 2));
  // Linea orizzontale sopra normative
  s.push(L(20, CY0 + 250, VW - 20, CY0 + 250, '#1a1a1a', 1));
  // Divisori verticali nella sezione dati
  s.push(L(Math.round(VW / 2), CY0 + 85, Math.round(VW / 2), CY0 + 250, '#1a1a1a', 1));
  s.push(L(Math.round(VW * 3 / 4), CY0 + 85, Math.round(VW * 3 / 4), CY0 + 250, '#1a1a1a', 1));

  // Titolo principale
  s.push(TM(`Schema Unifilare Impianto Fotovoltaico \u2014 ${P_kwp.toFixed(2)} kWp`, VW / 2, CY0 + 48, 38, '#1a1a1a', '700'));
  s.push(TM('Conforme CEI 0-21:2025-10 \u00b7 CEI 64-8/7 sez.712 \u00b7 CEI EN 62446-1', VW / 2, CY0 + 74, 20, C.gray, 'normal'));

  // Colonna 1 — Committente / Impianto
  const lx1 = 45, ly0 = CY0 + 107;
  s.push(T('Committente:', lx1, ly0, 22, '#1a1a1a', 'start', '700'));
  s.push(T(cartCommittente, lx1 + 175, ly0, 22, '#1a1a1a', 'start'));
  s.push(T('Indirizzo:', lx1, ly0 + 34, 20, '#1a1a1a', 'start', '700'));
  s.push(T(cartIndirizzo, lx1 + 120, ly0 + 34, 20, C.gray, 'start'));
  s.push(T(`Connessione: ${sysLbl} \u2014 Sistema terra: TT`, lx1, ly0 + 68, 19, C.gray, 'start'));
  s.push(T(`Potenza picco: ${P_kwp.toFixed(2)} kWp \u2014 Pac nom.: ${invPac > 0 ? invPac.toFixed(1) : '\u2014'} kW`, lx1, ly0 + 98, 19, C.gray, 'start'));

  // Colonna 2 — Progettista
  const lx2 = Math.round(VW / 2) + 30;
  s.push(T('Progettista:', lx2, ly0, 22, '#1a1a1a', 'start', '700'));
  s.push(T(cartProgettista, lx2 + 155, ly0, 22, '#1a1a1a', 'start'));
  s.push(T(cartAlbo, lx2, ly0 + 34, 19, C.gray, 'start'));
  s.push(T('Firma e timbro:', lx2, ly0 + 80, 20, '#777777', 'start'));
  s.push(L(lx2 + 155, CY0 + 240, Math.round(VW * 3 / 4) - 30, CY0 + 240, '#1a1a1a', 1));

  // Colonna 3 — Riferimenti disegno (struttura: banner TAV + dati)
  const lx3 = Math.round(VW * 3 / 4) + 30;
  const lx3W = VW - 40 - lx3 + 10;
  // Banner numero tavola: striscia blu nell'angolo superiore della colonna 3
  // Posizionato tra divisore superiore (CY0+85) e ly0 (CY0+107)
  // h=40 → copre CY0+85 a CY0+125, testo a CY0+105 (dentro)
  // N° disegno e revisioni partono da CY0+130 (fuori dal banner)
  const tavNum = cartNumDisegno || 'TAV.E02';
  s.push(R(lx3 - 10, CY0 + 85, lx3W, 40, 0, '#1e4aaa', '#1e4aaa', 0));
  s.push(T('N. TAVOLA', lx3 + 4, CY0 + 105, 12, '#93c5fd', 'start', '700'));
  s.push(T(tavNum, lx3 + lx3W - 12, CY0 + 105, 26, '#ffffff', 'end', '700'));
  // Dati: iniziano a CY0+130 (dopo il banner) — indipendenti da ly0
  const ly3 = CY0 + 130;
  s.push(T('N° disegno:', lx3, ly3, 18, '#1a1a1a', 'start', '700'));
  s.push(T(cartNumDisegno || '—', lx3 + 140, ly3, 18, C.gray, 'start'));
  // Tabella revisioni: righe con righe alternate
  const revToShow = _revRows.length > 0 ? _revRows : [{ num: cartRevisione, data: new Date().toLocaleDateString('it-IT'), desc: 'Prima emissione' }];
  revToShow.slice(0, 3).forEach((rv, ri) => {
    const ry = ly3 + 24 + ri * 26;
    if (ri % 2 === 0) s.push(R(lx3 - 6, ry - 12, lx3W - 4, 24, 2, '#f0f4ff', 'none', 0));
    s.push(T(`Rev ${rv.num}`, lx3, ry + 4, 16, C.gray, 'start', '700'));
    s.push(T(rv.data, lx3 + 90, ry + 4, 16, C.gray, 'start'));
    s.push(T(rv.desc, lx3 + 210, ry + 4, 16, C.gray, 'start'));
  });
  s.push(T(`Data: ${new Date().toLocaleDateString('it-IT')}`, lx3, ly3 + 108, 18, C.gray, 'start'));
  s.push(T('Scala: Fuori scala', lx3, ly3 + 130, 18, C.gray, 'start'));
  // Riga normative (condizionale BT/MT)
  const normLine = isMT
    ? 'Normative: CEI 0-16:2022 \u00b7 CEI 64-8 sez.712 \u00b7 CEI EN 62446-1:2016 \u00b7 IEC 62548 \u00b7 CEI EN 60076-1'
    : 'Normative: CEI 0-21:2025-10 \u00b7 CEI 64-8/7 sez.712 \u00b7 CEI EN 62446-1:2016 \u00b7 IEC 62548 \u00b7 IEC 60617';
  s.push(TM(normLine, VW / 2, CY0 + 270, 18, C.gray, 'normal'));
  // AP-11 / T2.6.2 \u2014 app traceability stamp. Project-aware via
  // getEffectiveNormsRevision() so MT projects cite CEI 0-16 here too,
  // matching the normLine above.
  s.push(TM(`Solar Designer Pro v${SDPROJ_APP_VERSION} \u00b7 Riferimento normativo: ${getEffectiveNormsRevision()}`, VW / 2, CY0 + 292, 14, C.gray, 'normal'));

  // \u2500\u2500 P5: QR code in cartiglio (in basso a destra) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const qrData = `${cartCommittente || 'FV'} | ${P_kwp.toFixed(2)}kWp | ${cartNumDisegno || '\u2014'} | ${new Date().getFullYear()}`;
  s.push(_svgQR(qrData, VW - 250, CY0 + 30, 200));
  s.push(T('QR \u2014 dati progetto', VW - 150, CY0 + 245, 14, C.gray, 'middle'));

  // \u2500\u2500 P6: Sezione MT (solo se tensione connessione = MT) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  if (isMT) {
    _renderMTSection(s, YY, XC, C, P_kwp, I_AC);
  }

  // \u2500\u2500 P4: Vista semplificata \u2014 overlay testo esplicativo \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  if (simplifiedMode) {
    // In modalit\u00e0 semplificata mostra solo l'overview senza i dettagli tecnici
    s.push(`<rect x="0" y="0" width="${VW}" height="${VH - 340}" fill="rgba(255,255,255,0.88)"/>`);
    s.push(TM('\u22a1 VISTA SEMPLIFICATA', VW/2, 80, 28, '#1e4aaa', '700'));
    // Freccia campo FV \u2192 inverter \u2192 rete
    const sy = [200, 480, 760, 1040, 1320, 1600, 1880];
    const labels = [
      `Campo FV \u2014 ${totPanels} moduli / ${P_kwp.toFixed(2)} kWp`,
      `Cavi DC H1Z2Z2-K ${S_str}mm\u00b2 (2\u00d7)`,
      `Quadro DC \u2014 Fusibili${needsFuse?' gPV':' non richiesti'} \u2014 SEZ`,
      `Inverter${_inverterList.length>1?' ('+_inverterList.length+' unit\u00e0)':''} \u2014 ${P_pac_tot.toFixed(1)} kW AC`,
      `Cavi AC FG7OR ${S_AC_calc}mm\u00b2 \u2014 ${sysLbl}`,
      `Quadro BT \u2014 MCB/RCD/SPD`,
      `Rete ${isMT?'MT 20kV':sysLbl} \u2014 DSO`,
    ];
    let ay = 140;
    labels.forEach((lbl, i) => {
      const isComp = [0,2,3,5,6].includes(i);
      s.push(`<rect x="${VW/2-340}" y="${ay}" width="680" height="64" rx="10" fill="${isComp?'#eff6ff':'#fff'}" stroke="${isComp?'#1e4aaa':'#aaa'}" stroke-width="${isComp?2:1}"/>`);
      s.push(`<text x="${VW/2}" y="${ay+38}" text-anchor="middle" font-size="${isComp?22:18}" fill="${isComp?'#1e4aaa':'#555'}" font-weight="${isComp?'700':'400'}">${lbl}</text>`);
      if (i < labels.length-1) {
        s.push(`<line x1="${VW/2}" y1="${ay+64}" x2="${VW/2}" y2="${ay+96}" stroke="#888" stroke-width="2" marker-end="url(#arrow)"/>`);
        ay += 96;
      }
    });
    // Defs per la freccia
    s.push(`<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#888"/></marker></defs>`);
  }

  s.push('</svg>');

  container.innerHTML = s.join('');
  // Aggiorna la sezione verifiche elettriche separata
  _renderVerifiche();
}

let _bessMode = false;
let _bessTopology = 'ac'; // 'ac' | 'dc'
function toggleBessMode() {
  _bessMode = !_bessMode;
  const btn = document.getElementById('bessModeBtn');
  if (btn) btn.textContent = _bessMode ? '🔋 BESS ON' : '🔋 BESS OFF';
  // Mostra/nascondi selettore topologia
  const topSel = document.getElementById('bessTopologySel');
  if (topSel) topSel.style.display = _bessMode ? 'inline-block' : 'none';
  renderUnifilare();
}

// ── P3: Hover evidenziazione stringa ─────────────────────────────────────
function _sldHoverStr(sx, strY, bw, bh, cassY, si, name, voc, isc, sMm2) {
  _sldClearHover();
  const svg = document.querySelector('#unifilareContainer svg');
  if (!svg) return;
  // Overlay: evidenzia il percorso DC con una linea spessa semi-trasparente
  const ov = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  ov.setAttribute('id', 'sldHoverOv');
  ov.setAttribute('x', sx - bw/2 - 6);
  ov.setAttribute('y', strY - 6);
  ov.setAttribute('width', bw + 12);
  ov.setAttribute('height', cassY + bh + 12);
  ov.setAttribute('rx', '8');
  ov.setAttribute('fill', 'rgba(234,179,8,0.12)');
  ov.setAttribute('stroke', '#ca8a04');
  ov.setAttribute('stroke-width', '3');
  ov.setAttribute('pointer-events', 'none');
  svg.appendChild(ov);
  // Tooltip informativo
  const tip = document.getElementById('sldHoverTip') || (() => {
    const d = document.createElement('div');
    d.id = 'sldHoverTip';
    d.style.cssText = 'position:fixed;background:#1a1a1a;color:#fff;padding:8px 12px;border-radius:6px;font-size:12px;pointer-events:none;z-index:9998;line-height:1.5;';
    document.body.appendChild(d);
    return d;
  })();
  tip.innerHTML = `<b>Stringa ${name}</b><br>Voc: ${voc} V &nbsp; Isc: ${isc} A<br>Cavo: H1Z2Z2-K 2×${sMm2}mm²`;
  tip.style.display = 'block';
  const onMove = e => { tip.style.left=(e.clientX+14)+'px'; tip.style.top=(e.clientY-10)+'px'; };
  document.addEventListener('mousemove', onMove);
  tip._moveHandler = onMove;
}
function _sldClearHover() {
  const ov = document.getElementById('sldHoverOv');
  if (ov) ov.remove();
  const tip = document.getElementById('sldHoverTip');
  if (tip) { tip.style.display='none'; if (tip._moveHandler) { document.removeEventListener('mousemove', tip._moveHandler); tip._moveHandler=null; } }
}

function _showSldPopup(componentId, x, y) {
  let existing = document.getElementById('sldPopup');
  if (existing) existing.remove();

  const popupData = {
    'qbt': { title: 'Quadro BT Produzione FV', norm: 'CEI EN 61439-1/2, CEI 64-8', items: ['MCB: In ≥ Iac × 1.25', 'RCD: 300mA tipo A o B', 'SPD AC: Tipo T2, OVC II'] },
    'spi': { title: 'SPI — Protezione Interfaccia', norm: 'CEI 0-21:2025 All.A, §8.2', items: ['59.S1/S2: sovratensione', '27.S1/S2: sottotensione', '81>/81<: sovrfreq./sottofreq.', 'LVRT/HVRT: ride-through (>6kW)'] },
    'ddi': { title: 'DDI — Disp. Interfaccia', norm: 'CEI 0-21:2025 §6.2', items: ['Motorizzato (apertura su comando SPI)', 'In ≥ Iac × 1.3', '4 poli (L1,L2,L3,N)'] },
    'cnt': { title: 'Contatore Scambio SSP', norm: 'CEI 0-21:2025 §5.1, DM 06/08/2020', items: ['Bidirezionale 2G teleleggibile', 'Obbligatorio per TUTTI gli impianti FV', 'Trifase obbligatorio se Pac > 6 kW'] },
    'cassetta': { title: 'Quadro DC (Cassetta Stringhe)', norm: 'IEC 62548 §6, CEI 64-8 sez.712', items: ['Sezionatore per stringa (CEI EN 60947-3)', 'Fusibili gPV se (n-1)×Isc > ISCR', 'SPD DC: Uc ≥ 1.25×Voc(Tmin)', 'OVC III'] },
    'inverter': { title: 'Inverter FV', norm: 'CEI EN 62109-1/2, CEI 0-21:2025', items: ['Q(U): regolazione reattiva su tensione', 'cosφ(P): fattore pot. su potenza', 'LVRT/HVRT se Pac > 6 kW', 'Protezione: 59/27/81>/81<'] },
    'bess':     { title: 'BESS — Accumulo AC-coupled', norm: 'CEI EN 62933-1, IEC 62619, CEI 0-21:2025 §12', items: ['Inverter bidirezionale dedicato', 'BMS con OVP·UVP·OCP·OTP·SCP (IEC 62619)', 'SPD DC lato batteria: Uc≥1.25×Vbat_max', 'DDI dedicato lato AC batteria', 'Modalità: self-consumption / backup / peak-shaving', 'Certificazione: IEC 62619 o UN 38.3'] },
    'rete':     { title: 'Rete DSO', norm: 'CEI 0-21:2025, CEI EN 50160', items: ['Tensione nominale ±10% (EN 50160)', 'Frequenza 50 Hz ±1%', 'Il DSO può richiedere curva Q(U)', 'Disconnessione su comando SPI'] },
  };

  const data = popupData[componentId] || { title: componentId, norm: '—', items: [] };
  const div = document.createElement('div');
  div.id = 'sldPopup';
  div.style.cssText = `position:fixed;left:${Math.min(x, window.innerWidth-320)}px;top:${Math.min(y, window.innerHeight-200)}px;width:300px;background:#fff;border:1.5px solid #1e4aaa;border-radius:8px;padding:12px;z-index:9999;box-shadow:0 4px 24px rgba(0,0,0,0.18);font-size:13px;`;
  div.innerHTML = `
    <div style="font-weight:700;color:#1e4aaa;font-size:14px;margin-bottom:4px;">${data.title}</div>
    <div style="color:#888;font-size:11px;margin-bottom:8px;">${data.norm}</div>
    <ul style="margin:0;padding-left:16px;">
      ${data.items.map(i=>`<li style="margin-bottom:3px;">${i}</li>`).join('')}
    </ul>
    <button onclick="document.getElementById('sldPopup').remove()" style="margin-top:8px;font-size:11px;padding:3px 10px;background:#1e4aaa;color:#fff;border:none;border-radius:4px;cursor:pointer;">Chiudi</button>
  `;
  document.body.appendChild(div);
  setTimeout(()=>{ document.addEventListener('click', function _cl(e){if(!div.contains(e.target)){div.remove();document.removeEventListener('click',_cl);}},{ once:false }); },100);
}

function addRevisione() {
  const list = document.getElementById('revisioniList');
  if (!list) return;
  const idx = list.children.length;
  if (idx >= 5) { showToast('Massimo 5 revisioni', 'warn'); return; }
  const div = document.createElement('div');
  div.style.cssText = 'display:grid;grid-template-columns:60px 120px 1fr auto;gap:4px;margin-bottom:4px;';
  div.innerHTML = `
    <input type="text" class="field-input" id="rev0${idx}_num" placeholder="Rev" value="0${idx}" style="font-size:11px;" oninput="renderUnifilareDebounced()">
    <input type="text" class="field-input" id="rev0${idx}_data" placeholder="Data" style="font-size:11px;" oninput="renderUnifilareDebounced()">
    <input type="text" class="field-input" id="rev0${idx}_desc" placeholder="Descrizione modifica" style="font-size:11px;" oninput="renderUnifilareDebounced()">
    <button onclick="this.parentElement.remove();renderUnifilare();" style="padding:2px 6px;font-size:11px;background:#dc2626;color:#fff;border:none;border-radius:3px;cursor:pointer;">✕</button>
  `;
  list.appendChild(div);
  renderUnifilare();
}

// ── P4: Toggle vista semplificata / dettagliata ───────────────────────────
let _simplifiedMode = false;
function toggleSldMode() {
  _simplifiedMode = !_simplifiedMode;
  const btn = document.getElementById('sldModeBtn');
  if (btn) btn.textContent = _simplifiedMode ? '⊡ Vista semplice' : '⊞ Vista completa';
  renderUnifilare();
}

// ── P5: QR code nel cartiglio SVG (placeholder visivo v1) ─────────────────
function _svgQR(data, x, y, size) {
  const s = [];
  const cs = size / 21;
  const fp = (cx, cy) => {
    s.push(`<rect x="${cx}" y="${cy}" width="${7*cs}" height="${7*cs}" fill="none" stroke="#1a1a1a" stroke-width="${cs*0.8}"/>`);
    s.push(`<rect x="${cx+2*cs}" y="${cy+2*cs}" width="${3*cs}" height="${3*cs}" fill="#1a1a1a"/>`);
  };
  fp(x, y); fp(x+14*cs, y); fp(x, y+14*cs);
  for (let i=8;i<13;i+=2) {
    s.push(`<rect x="${x+i*cs}" y="${y+6*cs}" width="${cs}" height="${cs}" fill="#1a1a1a"/>`);
    s.push(`<rect x="${x+6*cs}" y="${y+i*cs}" width="${cs}" height="${cs}" fill="#1a1a1a"/>`);
  }
  let hash = 0; for (let i=0;i<data.length;i++) hash = (hash*31+data.charCodeAt(i))&0xFFFFFF;
  for (let r=0;r<21;r++) for (let c=0;c<21;c++) {
    if ((r<9&&c<9)||(r<9&&c>11)||(r>11&&c<9)) continue;
    const bit = ((hash ^ (r*21+c)*2654435761)>>>4)&1;
    if (bit) s.push(`<rect x="${x+c*cs}" y="${y+r*cs}" width="${cs*0.9}" height="${cs*0.9}" fill="#1a1a1a"/>`);
  }
  s.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="none" stroke="#1a1a1a" stroke-width="${cs*0.3}"/>`);
  return s.join('');
}

// ── P6: Schema MT (CEI 0-16) ─────────────────────────────────────────────
function _renderMTSection(s, YY, XC, C, P_kwp, I_AC) {
  // helper inline (closure su C)
  const TF_Y = YY.rete + 80;
  const TF_W = 280, TF_H = 200;
  s.push(`<rect x="${XC-TF_W/2}" y="${TF_Y}" width="${TF_W}" height="${TF_H}" rx="8" fill="#fefce8" stroke="#b45309" stroke-width="2"/>`);
  s.push(`<text x="${XC}" y="${TF_Y+32}" text-anchor="middle" font-size="22" fill="#b45309" font-weight="700">TR — Trafo MT/BT</text>`);
  const tcx = XC, tcy = TF_Y+100, tr = 30;
  s.push(`<circle cx="${tcx-tr*0.6}" cy="${tcy}" r="${tr}" fill="none" stroke="#b45309" stroke-width="2.5"/>`);
  s.push(`<circle cx="${tcx+tr*0.6}" cy="${tcy}" r="${tr}" fill="none" stroke="#b45309" stroke-width="2.5"/>`);
  const kva = Math.ceil(P_kwp*1.25/50)*50;
  s.push(`<text x="${XC}" y="${TF_Y+160}" text-anchor="middle" font-size="18" fill="#92400e">Ptr: ${kva} kVA · 20kV/0.4kV · Dyn11</text>`);
  s.push(`<text x="${XC}" y="${TF_Y+180}" text-anchor="middle" font-size="16" fill="#a16207">Classe E3-C2-F1 · CEI EN 60076-1</text>`);
  s.push(`<line x1="${XC}" y1="${YY.rete}" x2="${XC}" y2="${TF_Y}" stroke="${C.ac}" stroke-width="2.5"/>`);
  const MT_Y = TF_Y+TF_H+40, MT_W = 320, MT_H = 220;
  s.push(`<rect x="${XC-MT_W/2}" y="${MT_Y}" width="${MT_W}" height="${MT_H}" rx="8" fill="#f0f9ff" stroke="#0e7490" stroke-width="2"/>`);
  s.push(`<text x="${XC}" y="${MT_Y+30}" text-anchor="middle" font-size="22" fill="#0e7490" font-weight="700">Cabina di Consegna MT</text>`);
  s.push(`<text x="${XC}" y="${MT_Y+56}" text-anchor="middle" font-size="16" fill="#155e75">CEI 0-16:2022 · CEI EN 62271-200</text>`);
  const mtItems = [
    '─ Cella arrivo linea (sez. sotto carico)',
    '─ Cella misure (TA+TV — contatore fiscale)',
    '─ Protezione DG/MT (59/27/67N/81)',
    '─ 59Vo ESCLUSA per impianti FV (CEI 0-16 §8.5.3)',
    `─ Corrente nom.: ${(P_kwp*1000/(Math.sqrt(3)*20000)).toFixed(1)} A a 20 kV`,
  ];
  mtItems.forEach((it, i) => {
    s.push(`<text x="${XC-MT_W/2+16}" y="${MT_Y+90+i*26}" text-anchor="start" font-size="16" fill="#0c4a6e">${it}</text>`);
  });
  s.push(`<line x1="${XC}" y1="${TF_Y+TF_H}" x2="${XC}" y2="${MT_Y}" stroke="#b45309" stroke-width="3"/>`);
  s.push(`<text x="${XC+16}" y="${TF_Y+TF_H+20}" text-anchor="start" font-size="16" fill="#92400e">Cavo MT: RG7H1R 12/20kV</text>`);
  // ── P6: Protezione 67N — calcolo corrente capacitiva ───────────────────
  // Stima C0 per linea BT/MT in cavo: ~0.3 µF/km (tipico per cavo MT)
  const lenMT_km = 0.1; // stima 100m default
  const C0_uF = 0.3 * lenMT_km;  // µF
  const C0    = C0_uF * 1e-6;    // F
  const omega = 2 * Math.PI * 50;
  const V_fase_MT = 20000 / Math.sqrt(3);
  const Ic_67N    = 3 * omega * C0 * V_fase_MT;  // A
  const needs67N  = Ic_67N > 2.0;
  s.push(`<rect x="${XC-MT_W/2}" y="${MT_Y+MT_H+10}" width="${MT_W}" height="${needs67N?70:50}" rx="5" fill="${needs67N?'#fef2f2':'#f0fdf4'}" stroke="${needs67N?'#dc2626':'#16a34a'}" stroke-width="1.5"/>`);
  s.push(`<text x="${XC}" y="${MT_Y+MT_H+34}" text-anchor="middle" font-size="16" fill="${needs67N?'#dc2626':'#16a34a'}" font-weight="700">Protezione 67N: ${needs67N?'RICHIESTA':'non necessaria'}</text>`);
  s.push(`<text x="${XC}" y="${MT_Y+MT_H+54}" text-anchor="middle" font-size="14" fill="#555">Ic = ${Ic_67N.toFixed(2)} A ${needs67N?'> 2A — relè 67N su cella MT':'≤ 2A — CEI 0-16 §8.5.4'}</text>`);
  if (needs67N) {
    s.push(`<text x="${XC}" y="${MT_Y+MT_H+70}" text-anchor="middle" font-size="13" fill="#b45309">Soglia e t intervento secondo accordo DSO</text>`);
  }

  // ── P6: Dimensionamento cavo MT ─────────────────────────────────────────
  const I_MT = P_kwp * 1000 / (Math.sqrt(3) * 20000);
  const S_MT = I_MT < 0.7 ? 'RG7H1R 12/20kV 3×25mm²' : I_MT < 1.5 ? 'RG7H1R 12/20kV 3×50mm²' : 'RG7H1R 12/20kV 3×95mm²';
  s.push(`<text x="${XC+16}" y="${TF_Y+TF_H+38}" text-anchor="start" font-size="15" fill="#a16207">${S_MT} (In=${I_MT.toFixed(1)}A)</text>`);
  s.push(`<text x="${XC+16}" y="${TF_Y+TF_H+54}" text-anchor="start" font-size="13" fill="#a16207">CEI 11-17 · CEI UNEL 35026</text>`);

  if (P_kwp > 20) {
    s.push(`<text x="${XC+MT_W/2+20}" y="${MT_Y+34}" text-anchor="start" font-size="14" fill="#b45309">⚠ P > 20 kW:</text>`);
    s.push(`<text x="${XC+MT_W/2+20}" y="${MT_Y+52}" text-anchor="start" font-size="14" fill="#b45309">Rincalzo DDI obbl.</text>`);
    s.push(`<text x="${XC+MT_W/2+20}" y="${MT_Y+70}" text-anchor="start" font-size="13" fill="#b45309">CEI 0-21 §8.6.4</text>`);
  }

  // Contatore fiscale MT (obbligatorio >20kWp — D.Lgs. 504/95 UTIF)
  const cnt_y = MT_Y + (P_kwp > 20 ? 100 : 40);
  s.push(`<rect x="${XC+MT_W/2+20}" y="${cnt_y}" width="280" height="90" rx="5" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>`);
  s.push(`<text x="${XC+MT_W/2+160}" y="${cnt_y+26}" text-anchor="middle" font-size="17" fill="#15803d" font-weight="700">Contatore fiscale MT</text>`);
  s.push(`<text x="${XC+MT_W/2+160}" y="${cnt_y+48}" text-anchor="middle" font-size="14" fill="#166534">UTF/Dogane · TA cl. 0.5 · TV cl. 0.5</text>`);
  s.push(`<text x="${XC+MT_W/2+160}" y="${cnt_y+68}" text-anchor="middle" font-size="13" fill="#166534">D.Lgs. 504/95 · Teleleggibile</text>`);
  s.push(`<text x="${XC+MT_W/2+160}" y="${cnt_y+84}" text-anchor="middle" font-size="12" fill="#4ade80">Obbl. per P > 20 kWp</text>`);

  // Rete MT DSO
  const RETEMT_Y = MT_Y + MT_H + (needs67N ? 95 : 75);
  s.push(`<line x1="${XC}" y1="${MT_Y+MT_H}" x2="${XC}" y2="${RETEMT_Y}" stroke="#0e7490" stroke-width="3"/>`);
  s.push(`<rect x="${XC-220}" y="${RETEMT_Y}" width="440" height="54" rx="6" fill="#e0f2fe" stroke="#0e7490" stroke-width="1.5"/>`);
  s.push(`<text x="${XC}" y="${RETEMT_Y+30}" text-anchor="middle" font-size="20" fill="#0e7490" font-weight="700">Rete MT DSO — 20 kV</text>`);
  s.push(`<text x="${XC}" y="${RETEMT_Y+48}" text-anchor="middle" font-size="14" fill="#155e75">CEI 0-16:2022 · Norma di connessione</text>`);
}


// ── js/cables/sld-export.js ──
// ── js/cables/sld-export.js — SLD export pipelines ──
// Extracted from cables.js in AP-15b. SVG → PNG/SVG file download (
// exportUnifilare) and GSE/GAUDÌ CSV writer (exportGSE). Reads SVG that
// renderUnifilare populated into #unifilareContainer. Calling surface
// unchanged — all symbols remain available through bundle-scope globals.

'use strict';

function exportUnifilare(fmt) {
  const container = document.getElementById('unifilareContainer');
  if (!container) return;
  const svg = container.querySelector('svg');
  if (!svg) return;

  if (fmt === 'png') {
    // Export PNG at 2× resolution (A4 @ ~192dpi)
    const W = 794, H = 1123, SCALE = 2;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], {type:'image/svg+xml;charset=utf-8'});
    const url  = URL.createObjectURL(blob);
    const img  = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width  = W * SCALE;
      c.height = H * SCALE;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.scale(SCALE, SCALE);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      c.toBlob(pngBlob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(pngBlob);
        a.download = 'schema-unifilare.png';
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      }, 'image/png');
    };
    img.src = url;
  } else {
    // Export SVG
    const blob = new Blob([svg.outerHTML], {type: 'image/svg+xml'});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'schema-unifilare.svg';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }
}

function exportGSE() {
  const g = id => parseFloat((document.getElementById(id)||{value:'0'}).value)||0;
  const gs2 = id => (document.getElementById(id)||{value:''}).value||'';
  const totPanels = panels.length;
  const pp = parseInt((DOM.pp||{value:'400'}).value)||400;
  const P_kwp = totPanels * pp / 1000;
  const sysAC = gs2('cableSystemAC')||'mono';
  const V_AC = sysAC==='mono'?230:400;
  const rows = [
    ['Campo', 'Valore', 'Unità'],
    ['Potenza picco FV', P_kwp.toFixed(2), 'kWp'],
    ['Potenza inverter totale', (_inverterList.reduce((a,i)=>a+i.pac*i.qty,0)||g('invPac')).toFixed(2), 'kW'],
    ['Tensione connessione', V_AC, 'V'],
    ['Sistema', sysAC==='mono'?'Monofase':'Trifase', ''],
    ['N° moduli totali', totPanels, ''],
    ['Potenza modulo', pp, 'Wp'],
    ['Marca modulo', gs2('moduleBrand')||'—', ''],
    ['Modello modulo', gs2('moduleModel')||'—', ''],
    ['Voc modulo', g('moduleVoc'), 'V'],
    ['Isc modulo', g('moduleIsc'), 'A'],
    ['Committente', gs2('cartCommittente'), ''],
    ['Indirizzo impianto', gs2('cartIndirizzo'), ''],
    ['Progettista', gs2('cartProgettista'), ''],
    ['N° disegno', gs2('cartNumDisegno'), ''],
  ];
  // Aggiungi inverter dal parco
  _inverterList.forEach((inv, i) => {
    rows.push([`Inverter ${i+1} — Marca`, inv.brand||'—', '']);
    rows.push([`Inverter ${i+1} — Modello`, inv.model||'—', '']);
    rows.push([`Inverter ${i+1} — Pac`, inv.pac, 'kW']);
    rows.push([`Inverter ${i+1} — Quantità`, inv.qty, '']);
  });
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(';')).join('\r\n');
  const blob = new Blob(['﻿'+csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `GSE_GAUDI_${gs2('cartNumDisegno')||'impianto'}.csv`;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
  showToast('File CSV per GSE/GAUDÌ esportato', 'info');
}




// ── js/cables/verifiche.js ──
// ── js/cables/verifiche.js — inverter validation and verifiche rendering ──
// Extracted from cables.js in AP-15c. Contains inverter compatibility
// validation UI and electrical verifiche rendering used by SLD flow.
// Calling surface unchanged — symbols remain available through
// bundle-scope globals.

'use strict';

function updateInvValidation() {
  const el = document.getElementById('invValidation');
  if (!el) return;

  const n         = Math.max(1, parseInt((DOM.stringNum || {value:'1'}).value) || 1);
  const pairs     = Math.max(1, parseInt((DOM.pairNum   || {value:'1'}).value) || 1);
  const totStr    = n * pairs;
  const totPanels = panels.length;
  const modsPerStr= totPanels > 0 ? Math.round(totPanels / totStr) : 0;

  const g = id => parseFloat((document.getElementById(id)||{}).value) || 0;
  const voc       = g('moduleVoc')   || 45;
  const isc       = g('moduleIsc')   || 9;
  const vmpp      = g('moduleVmpp')  || 38;
  const tcoefVoc  = g('moduleTcoefVoc')  || -0.30;   // %/°C
  const tcoefVmpp = _getModuleVmppTempCoeff();
  const vMin      = g('invVmpptMin') || 0;
  const vMax      = g('invVmpptMax') || 9999;
  const iMax      = g('invImaxMppt') || 9999;
  const vocMax    = g('invVocMax')   || 9999;

  if (!vMin && !vMax && !iMax && !vocMax) { el.innerHTML = ''; return; }

  // Temperatura estrema: T_min=-10°C per Voc, T_max=70°C per Vmpp (CEI EN 62548)
  const T_min = -10, T_max = 70, T_stc = 25;
  const kVoc = tcoefVoc / 100;   // da %/°C a 1/°C
  const kVmpp = tcoefVmpp / 100;
  const vocCold  = voc  * (1 + kVoc  * (T_min - T_stc));  // Voc a -10°C (aumenta)
  const vmppHot  = vmpp * (1 + kVmpp * (T_max - T_stc));  // Vmpp a 70°C (diminuisce)
  const vmppCold = vmpp * (1 + kVmpp * (T_min - T_stc));  // Vmpp a -10°C (aumenta)

  const V_voc_cold  = vocCold  * modsPerStr;
  const V_vmpp_cold = vmppCold * modsPerStr;
  const V_vmpp_hot  = vmppHot  * modsPerStr;
  const I_str       = isc * 1.25;
  const I_mppt      = I_str * _getProjectStrPerMpptMax();

  let errors = 0, warnings = 0;
  const rows = [];

  // Leggi ISCR e Vsys_max dal form modulo
  const iscr    = parseFloat((document.getElementById('moduleIscr')   ||{value:'15'}).value) || (isc * 1.35);
  const vsysMax = parseFloat((document.getElementById('moduleVsysMax')||{value:'1000'}).value) || 1000;

  // ── 1. Voc a freddo vs Voc max inverter ──
  const vocOk = V_voc_cold <= vocMax;
  if (!vocOk) errors++;
  rows.push(`
    <tr style="color:${vocOk ? '#16a34a' : '#dc2626'};">
      <td style="padding:2px 6px;">${vocOk ? '✓' : '✗'}</td>
      <td style="padding:2px 6px;">Voc stringa @ -10°C vs inv.</td>
      <td style="padding:2px 6px;font-weight:600;">${V_voc_cold.toFixed(0)} V</td>
      <td style="padding:2px 6px;color:var(--text-secondary);">≤ ${vocMax} V</td>
    </tr>`);

  // ── 1b. Voc a freddo vs limiti normativi (IEC 62548 §6.2) ──
  if (V_voc_cold > 1000) {
    const exceeds1500 = V_voc_cold > 1500;
    if (exceeds1500) errors++; else warnings++;
    rows.push(`
      <tr style="color:${exceeds1500 ? '#dc2626' : '#b45309'};">
        <td style="padding:2px 6px;">${exceeds1500 ? '✗' : '⚠'}</td>
        <td style="padding:2px 6px;">Voc stringa @ -10°C vs norma</td>
        <td style="padding:2px 6px;font-weight:600;">${V_voc_cold.toFixed(0)} V</td>
        <td style="padding:2px 6px;color:var(--text-secondary);">
          ${exceeds1500 ? '> 1500V — BLOCCO assoluto IEC 62548 §6.2' : '> 1000V — cavi classe II (H1Z2Z2-K) obbligatori IEC 62548 §6.2'}
        </td>
      </tr>`);
  }
  // ── 1c. Voc vs Vsys max modulo ──
  if (V_voc_cold > vsysMax) {
    errors++;
    rows.push(`
      <tr style="color:#dc2626;">
        <td style="padding:2px 6px;">✗</td>
        <td style="padding:2px 6px;">Voc stringa vs Vsys max modulo</td>
        <td style="padding:2px 6px;font-weight:600;">${V_voc_cold.toFixed(0)} V</td>
        <td style="padding:2px 6px;color:var(--text-secondary);">Supera Vsys max modulo (${vsysMax.toFixed(0)}V) — ridurre N moduli/stringa</td>
      </tr>`);
  }

  // ── 2. Vmpp a caldo vs range Vmpp inverter ──
  const vmppHotOk  = V_vmpp_hot  >= vMin;
  const vmppColdOk = V_vmpp_cold <= vMax;
  if (!vmppHotOk) errors++;
  else if (!vmppColdOk) errors++;
  rows.push(`
    <tr style="color:${(vmppHotOk && vmppColdOk) ? '#16a34a' : '#dc2626'};">
      <td style="padding:2px 6px;">${(vmppHotOk && vmppColdOk) ? '✓' : '✗'}</td>
      <td style="padding:2px 6px;">Vmpp stringa range</td>
      <td style="padding:2px 6px;font-weight:600;">${V_vmpp_hot.toFixed(0)}–${V_vmpp_cold.toFixed(0)} V</td>
      <td style="padding:2px 6px;color:var(--text-secondary);">[${vMin}–${vMax} V]</td>
    </tr>`);

  // ── 3. Corrente design vs Imax MPPT ──
  const iOk = I_mppt <= iMax;
  if (!iOk) errors++;
  rows.push(`
    <tr style="color:${iOk ? '#16a34a' : '#dc2626'};">
      <td style="padding:2px 6px;">${iOk ? '✓' : '✗'}</td>
      <td style="padding:2px 6px;">Isc × 1.25 design</td>
      <td style="padding:2px 6px;font-weight:600;">${I_mppt.toFixed(1)} A</td>
      <td style="padding:2px 6px;color:var(--text-secondary);">≤ ${iMax} A</td>
    </tr>`);

  const pp = parseInt((DOM.pp||{value:'400'}).value)||400;
  const pacKw = g('invPac') || 0;
  const strPerMpptVal = _getProjectStrPerMpptMax();
  const mixedStrPerMppt = _hasMixedStrPerMppt();

  const FUSE_SIZES_A = [2, 4, 6, 10, 15, 20, 25, 32, 40, 50, 63];
  const nextFuse = I => FUSE_SIZES_A.find(f => f >= I) || 63;

  // ── 4. DC/AC ratio (CEI 0-21 residenziale ≤ 1.33) ──
  if (pacKw > 0 && panels.length > 0) {
    const dcKw  = panels.length * pp / 1000;
    const ratio = dcKw / pacKw;
    const ratioOk = ratio <= 1.33;
    if (!ratioOk) errors++;
    rows.push(`
      <tr style="color:${ratioOk ? '#16a34a' : '#dc2626'};">
        <td style="padding:2px 6px;">${ratioOk ? '✓' : '✗'}</td>
        <td style="padding:2px 6px;">DC/AC ratio</td>
        <td style="padding:2px 6px;font-weight:600;">${ratio.toFixed(2)}</td>
        <td style="padding:2px 6px;color:var(--text-secondary);">≤ 1.33 (CEI 0-21)</td>
      </tr>`);
  }

  // ── 5. Fusibile stringa — formula corretta IEC 62548 §6.3 (condizionale su ISCR) ──
  // Fusibile necessario SOLO se la corrente di back-feed supera la capacità inversa del modulo:
  //   (n_par - 1) × Isc > ISCR_modulo
  if (strPerMpptVal > 1) {
    const backFeedI = (strPerMpptVal - 1) * isc;
    const needsFuseNow = backFeedI > iscr;
    if (needsFuseNow) {
      const fuseMin  = I_str * 1.5;
      const fuseMax  = iscr;           // IEC 62548 §6.3: fusibile ≤ ISCR
      const fuseRec  = nextFuse(fuseMin);
      const fuseOk   = fuseRec <= fuseMax;
      if (!fuseOk) warnings++;
      rows.push(`
        <tr style="color:${fuseOk ? '#16a34a' : '#b45309'};">
          <td style="padding:2px 6px;">${fuseOk ? '✓' : '⚠'}</td>
          <td style="padding:2px 6px;">Fusibile DC stringa (${strPerMpptVal} str/MPPT)</td>
          <td style="padding:2px 6px;font-weight:600;">${fuseRec} A gPV</td>
          <td style="padding:2px 6px;color:var(--text-secondary);">Ib=${fuseMin.toFixed(0)}A–ISCR=${iscr.toFixed(0)}A · (${strPerMpptVal}-1)×Isc=${backFeedI.toFixed(1)}A > ISCR</td>
        </tr>`);
    } else {
      // Stringhe in parallelo ma fusibili non necessari
      rows.push(`
        <tr style="color:#16a34a;">
          <td style="padding:2px 6px;">✓</td>
          <td style="padding:2px 6px;">Fusibile DC stringa (${strPerMpptVal} str/MPPT)</td>
          <td style="padding:2px 6px;font-weight:600;">Non necessario</td>
          <td style="padding:2px 6px;color:var(--text-secondary);">(${strPerMpptVal}-1)×${isc.toFixed(1)}=${backFeedI.toFixed(1)}A ≤ ISCR ${iscr.toFixed(0)}A · IEC 62548 §6.3</td>
        </tr>`);
    }
  }

  // ── 6. Sezionatore DC (IEC 62548 §6.9) ──
  const swV = Math.ceil(V_voc_cold / 100) * 100;
  const swI = nextFuse(I_str);
  rows.push(`
    <tr style="color:var(--text-secondary);">
      <td style="padding:2px 6px;">ℹ</td>
      <td style="padding:2px 6px;">Sezionatore DC min.</td>
      <td style="padding:2px 6px;font-weight:600;">${swV} V / ${swI} A DC</td>
      <td style="padding:2px 6px;color:var(--text-secondary);">IEC 62548 §6.9</td>
    </tr>`);

  // ── 7. Check potenza monofase ≤ 6 kW (CEI 0-21 §8.2.1) ── §16
  const gsQ = id => (document.getElementById(id)||{value:''}).value||'';
  const sysACQ = gsQ('cableSystemAC') || 'mono';
  if (sysACQ === 'mono' && pacKw > 0) {
    const monoOk = pacKw <= 6.0;
    const monoWarn = pacKw > 6.0 && pacKw <= 10.0;
    if (!monoOk && !monoWarn) errors++;
    else if (monoWarn) warnings++;
    rows.push(`
      <tr style="color:${monoOk ? '#16a34a' : monoWarn ? '#b45309' : '#dc2626'};">
        <td style="padding:2px 6px;">${monoOk ? '✓' : monoWarn ? '⚠' : '✗'}</td>
        <td style="padding:2px 6px;">Pac monofase (CEI 0-21 §8.2.1)</td>
        <td style="padding:2px 6px;font-weight:600;">${pacKw.toFixed(1)} kW</td>
        <td style="padding:2px 6px;color:var(--text-secondary);">${monoOk ? '≤ 6 kW ✓' : monoWarn ? '> 6 kW — richiedere autorizzazione DSO (max 10 kW)' : '> 10 kW non ammesso in monofase'}</td>
      </tr>`);
  }

  // ── 8. Regola SPI integrato/esterno (CEI 0-21 §8.2.2.2 + All. A.4.3) ── §17b
  const P_tot_kwp = panels.length * pp / 1000;
  const P_tot_pac = _inverterList.reduce((a,inv)=>a+inv.pac*inv.qty, 0) || pacKw;
  const spiSoglia = 11.08;
  const spiIntegrato = P_tot_pac <= spiSoglia;
  rows.push(`
    <tr style="color:${spiIntegrato ? '#16a34a' : '#b45309'};">
      <td style="padding:2px 6px;">${spiIntegrato ? 'ℹ' : '⚠'}</td>
      <td style="padding:2px 6px;">SPI (CEI 0-21 §8.2.2.2)</td>
      <td style="padding:2px 6px;font-weight:600;">${spiIntegrato ? 'Integrato nell\'inverter' : 'ESTERNO obbligatorio'}</td>
      <td style="padding:2px 6px;color:var(--text-secondary);">Pac tot.= ${P_tot_pac.toFixed(1)} kW ${spiIntegrato ? '≤' : '>'} ${spiSoglia} kW</td>
    </tr>`);
  if (!spiIntegrato) {
    warnings++;
    rows.push(`
      <tr style="color:#b45309;background:#fffbeb;">
        <td style="padding:2px 6px;">⚠</td>
        <td colspan="3" style="padding:2px 6px;font-size:10px;">SPI esterno: compilare marca/modello/matricola nel cartiglio schema unifilare. Allegato G obbligatorio (CEI 0-21 All. A.4.3)</td>
      </tr>`);
  }

  // ── 9. Rincalzo DDI (CEI 0-21 §8.2.2.4 — obbligatorio se Pac > 20 kW) ── §16
  if (P_tot_pac > 20) {
    warnings++;
    rows.push(`
      <tr style="color:#b45309;">
        <td style="padding:2px 6px;">⚠</td>
        <td style="padding:2px 6px;">Rincalzo DDI (§8.2.2.4)</td>
        <td style="padding:2px 6px;font-weight:600;">Obbligatorio</td>
        <td style="padding:2px 6px;color:var(--text-secondary);">Pac > 20 kW → rincalzo entro 0.5 s</td>
      </tr>`);
  }

  // ── 10. SPD DC obbligatorio se cavo DC > 10 m (CEI 0-21 §16) ──
  const cableDCLen = parseFloat((document.getElementById('cableLenString')||{value:'20'}).value) || 20;
  if (cableDCLen > 10) {
    rows.push(`
      <tr style="color:var(--text-secondary);">
        <td style="padding:2px 6px;">ℹ</td>
        <td style="padding:2px 6px;">SPD DC (cavo stringa ${cableDCLen} m)</td>
        <td style="padding:2px 6px;font-weight:600;">Obbligatorio</td>
        <td style="padding:2px 6px;color:var(--text-secondary);">Cavo DC > 10 m → SPD T2 in cassetta</td>
      </tr>`);
  }

  // ── Semaforo globale ──
  const badgeLabel  = errors > 0 ? `✗ ${errors} errore/i` : warnings > 0 ? `⚠ ${warnings} avviso/i` : '✓ OK';
  const badgeTitle  = errors > 0 ? 'Stringa NON compatibile con questo inverter'
                    : warnings > 0 ? 'Verificare avvisi di progetto'
                    : 'Stringa compatibile con questo inverter';
  const badgeColor  = errors > 0 ? '#dc2626' : warnings > 0 ? '#b45309' : '#16a34a';
  const badgeBg     = errors > 0 ? '#fef2f2' : warnings > 0 ? '#fffbeb' : '#f0fdf4';
  const badgeBorder = errors > 0 ? '#fca5a5' : warnings > 0 ? '#fcd34d' : '#bbf7d0';

  el.innerHTML = `
    <div style="border:2px solid ${badgeBorder};border-radius:8px;overflow:hidden;margin-top:6px;">
      <div style="background:${badgeBg};padding:6px 10px;display:flex;align-items:center;gap:8px;border-bottom:1px solid ${badgeBorder};">
        <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${badgeColor};flex-shrink:0;"></span>
        <span style="font-size:var(--fs-xs);font-weight:700;color:${badgeColor};">${badgeLabel}</span>
        <span style="font-size:var(--fs-xs);color:var(--text-secondary);margin-left:auto;">${badgeTitle}</span>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:var(--fs-xs);line-height:1.7;background:var(--bg-secondary);">
        <tbody>${rows.join('')}</tbody>
      </table>
      <div style="background:${badgeBg};padding:3px 10px;font-size:10px;color:var(--text-secondary);border-top:1px solid ${badgeBorder};">
        Voc calcolata a T=-10°C · Vmpp calcolata a T=+70°C · γVoc=${(tcoefVoc).toFixed(2)}%/°C
      </div>
    </div>`;
}

// ── Verifiche elettriche (sezione HTML separata, non dentro l'SVG) ──────────
function _renderVerifiche() {
  const el = document.getElementById('verificheContainer');
  const badge = document.getElementById('verificheBadge');
  if (!el) return;

  // Raccoglie gli stessi parametri di calcCables
  const g = id => { const e = document.getElementById(id); return e ? (parseFloat(e.value)||0) : 0; };
  const gs = id => { const e = document.getElementById(id); return e ? e.value : ''; };

  const voc      = g('moduleVoc'),  vmpp = g('moduleVmpp');
  const isc      = g('moduleIsc'),  pp   = g('modulePp') || g('pp');
  const tcoef    = g('moduleTcoefVoc') || -0.30;
  const vsysMaxU = g('moduleVsysMax') || 1000;
  const kVoc     = tcoef / 100;
  const vocCold  = voc * (1 + kVoc * (-10 - 25));
  const vmppHot  = vmpp * (1 + kVoc * (70 - 25));

  const modsPerStr = g('modsPerString') || g('numModulesPerString') || 1;
  const strPerMppt = g('stringsPerMppt') || g('numStringsPerMppt') || 1;
  const V_str_cold = vocCold * modsPerStr;
  const V_str_voc  = voc * modsPerStr;
  const V_str_vmpp = vmpp * modsPerStr;
  const vmppHotStr = vmppHot * modsPerStr;
  const I_str_des  = isc * 1.25;

  const invVocMax = g('invVocMax') || g('invVmpptMax') * 1.2;
  const invVmpMin = g('invVmpptMin');
  const invVmpMax = g('invVmpptMax');
  const invImax   = g('invImaxMppt');
  const invPac    = g('invPac');
  const P_kwp     = (g('numPanels') || g('totPanels') || 1) * pp / 1000;
  const P_pac_tot = invPac;

  const lenStr    = g('cableLenString') || 10;
  const lenAC     = g('cableLenAC') || 10;
  const dropDCpct = g('cableDropDC') || 1.0;
  const mat       = gs('cableMaterial') || 'cu';
  const sysAC     = gs('cableSystemAC') || 'mono';
  const V_AC      = sysAC === 'mono' ? 230 : 400;
  const I_AC      = P_pac_tot > 0 ? (sysAC === 'mono' ? P_pac_tot*1000/V_AC : P_pac_tot*1000/(V_AC*Math.sqrt(3)*0.98)) : 0;

  let S_str = 4;
  try { S_str = calcSection(I_str_des, lenStr, (dropDCpct/100)*V_str_vmpp, mat, 2, true); } catch(e){ /* keep S_str fallback (4 mm²) */ }
  let S_AC_calc = 6;
  try { S_AC_calc = calcSectionAC(I_AC, lenAC, (1.0/100)*V_AC, mat, sysAC==='mono'?2:Math.sqrt(3), 0.98); } catch(e){ /* keep S_AC_calc fallback (6 mm²) */ }

  const sigma = mat==='cu' ? 56 : 34;
  const dVdc_pct = V_str_vmpp>0 ? ((2*lenStr*I_str_des)/(sigma*S_str*V_str_vmpp))*100 : 0;
  const dVac_pct = V_AC>0 ? ((2*lenAC*I_AC)/(sigma*S_AC_calc*V_AC))*100 : 0;

  const iscrU    = g('moduleIscr') || (isc * 1.35);
  const needsFuse = (strPerMppt - 1) * isc > iscrU;
  const FUSE_STD  = [2,4,6,10,15,20,25,32,40,50,63];
  const fuseMin_A = I_str_des * 1.5;
  const fuseRec_A = FUSE_STD.find(f => f >= fuseMin_A) || 63;
  const spiIntegrato = P_pac_tot <= 11.08;

  const rows = [
    { cat: 'DC', lbl: 'Voc stringa @ -10°C',       val: `${V_str_cold.toFixed(0)} V`,  ref: `≤ ${invVocMax>0?invVocMax:'—'} V (inv.)`,   ok: invVocMax>0 ? V_str_cold<=invVocMax : null },
    { cat: 'DC', lbl: 'Voc stringa vs 1000 V sys',  val: `${V_str_cold.toFixed(0)} V`,  ref: '≤ 1000 V (cavi cl.I)',                        ok: V_str_cold<=1000 },
    { cat: 'DC', lbl: `Voc stringa vs Vsys mod. (${vsysMaxU}V)`, val: `${V_str_cold.toFixed(0)} V`, ref: `≤ ${vsysMaxU} V (modulo)`, ok: V_str_cold<=vsysMaxU },
    { cat: 'DC', lbl: 'Vmpp stringa @ +70°C',        val: `${vmppHotStr.toFixed(0)} V`, ref: `≥ ${invVmpMin>0?invVmpMin:'—'} V (inv.)`,   ok: invVmpMin>0 ? vmppHotStr>=invVmpMin : null },
    { cat: 'DC', lbl: 'Vmpp stringa vs MPPT max',    val: `${V_str_vmpp.toFixed(0)} V`, ref: `≤ ${invVmpMax>0?invVmpMax:'—'} V (inv.)`,   ok: invVmpMax>0 ? V_str_vmpp<=invVmpMax : null },
    { cat: 'DC', lbl: 'Corrente DC progetto',         val: `${I_str_des.toFixed(1)} A`,  ref: `≤ ${invImax>0?invImax:'—'} A (inv.)`,       ok: invImax>0 ? I_str_des<=invImax : null },
    { cat: 'DC', lbl: 'Caduta tensione DC',           val: `${dVdc_pct.toFixed(2)} %`,   ref: `≤ ${dropDCpct.toFixed(1)} %`,                ok: dVdc_pct<=dropDCpct },
    { cat: 'AC', lbl: 'Corrente AC nominale',         val: `${I_AC.toFixed(1)} A`,       ref: `Cavo ${S_AC_calc} mm²`,                      ok: true },
    { cat: 'AC', lbl: 'Caduta tensione AC',           val: `${dVac_pct.toFixed(2)} %`,   ref: '≤ 1.0 %',                                    ok: dVac_pct<=1.0 },
    { cat: 'SYS', lbl: 'DC/AC ratio',                val: P_pac_tot>0 ? (P_kwp/P_pac_tot).toFixed(2) : '—', ref: '≤ 1.33 (CEI 0-21)',    ok: P_pac_tot>0 ? P_kwp/P_pac_tot<=1.33 : null },
    { cat: 'SYS', lbl: 'SPI integrato in inverter',  val: spiIntegrato ? 'Sì (Plug&Play)' : 'No — esterno obbligatorio', ref: 'Pac ≤ 11.08 kW', ok: spiIntegrato },
    ...(needsFuse ? (() => {
      const It2_cable = (115*115)*(S_str*S_str);
      const It2_fuse  = fuseRec_A*fuseRec_A*0.01;
      return [{ cat:'DC', lbl:`Coord. fusibile/cavo I²t (fus. ${fuseRec_A}A gPV)`, val:`${(It2_fuse/1e6).toFixed(3)} MA²s`, ref:`< ${(It2_cable/1e6).toFixed(3)} MA²s`, ok: It2_fuse<It2_cable }];
    })() : []),
  ];

  const nFail = rows.filter(r => r.ok === false).length;
  const nOk   = rows.filter(r => r.ok === true).length;

  // Badge
  if (badge) {
    if (nFail > 0) { badge.textContent = `${nFail} KO`; badge.style.background='#fee2e2'; badge.style.color='#dc2626'; }
    else           { badge.textContent = `${nOk} OK`;   badge.style.background='#e8f5e9'; badge.style.color='#16a34a'; }
  }

  const catColors = { DC:'#cc3300', AC:'#1e4aaa', SYS:'#374151' };
  const catBg     = { DC:'#fff5f0', AC:'#f0f4ff', SYS:'#f9fafb' };

  el.innerHTML = `
<table style="width:100%;border-collapse:collapse;font-size:13px;">
  <thead>
    <tr style="background:#f0f4ff;border-bottom:2px solid #c7d8f5;">
      <th style="padding:7px 10px;text-align:left;color:#1e4aaa;font-weight:700;width:40px;">Cat.</th>
      <th style="padding:7px 10px;text-align:left;color:#1e4aaa;font-weight:700;">Parametro</th>
      <th style="padding:7px 10px;text-align:right;color:#1e4aaa;font-weight:700;width:110px;">Valore</th>
      <th style="padding:7px 10px;text-align:right;color:#1e4aaa;font-weight:700;width:180px;">Limite / Riferimento</th>
      <th style="padding:7px 10px;text-align:center;color:#1e4aaa;font-weight:700;width:40px;">✓/✗</th>
    </tr>
  </thead>
  <tbody>
    ${rows.map((r,i) => {
      const ok = r.ok;
      const sc = ok===null ? '#888' : ok ? '#16a34a' : '#dc2626';
      const ic = ok===null ? '—' : ok ? '✓' : '✗';
      const bg = i%2===0 ? catBg[r.cat]||'#fff' : '#fff';
      return `<tr style="background:${bg};border-bottom:1px solid #eee;">
        <td style="padding:6px 10px;font-size:11px;font-weight:700;color:${catColors[r.cat]||'#333'};text-align:center;">${r.cat}</td>
        <td style="padding:6px 10px;color:#222;">${r.lbl}</td>
        <td style="padding:6px 10px;text-align:right;font-weight:600;color:${sc};">${r.val}</td>
        <td style="padding:6px 10px;text-align:right;color:#666;font-size:12px;">${r.ref}</td>
        <td style="padding:6px 10px;text-align:center;font-weight:700;color:${sc};font-size:16px;">${ic}</td>
      </tr>`;
    }).join('')}
  </tbody>
  <tfoot>
    <tr style="border-top:2px solid #c7d8f5;background:#f8f9ff;">
      <td colspan="5" style="padding:6px 10px;font-size:11px;color:#888;">
        Riferimenti: CEI 0-21:2025 · IEC 62548 · T_min = −10 °C / T_max = +70 °C · IEC 60269-6
      </td>
    </tr>
  </tfoot>
</table>`;
}






// ── js/enhancements.js ──
// ── enhancements.js — Feedback real-time, Dashboard, Shortcuts, Canvas extras ──

'use strict';

// ═══════════════════════════════════════════════════
// 1. STATUS BAR — Semaforo progresso in tempo reale
// ═══════════════════════════════════════════════════

function updateStatusBar() {
  const stCal     = document.getElementById('stCal');
  const stArea    = document.getElementById('stArea');
  const stPanels  = document.getElementById('stPanels');
  const stStr     = document.getElementById('stStr');
  const stInv     = document.getElementById('stInv');
  const stCalTxt  = document.getElementById('stCalTxt');
  const stAreaTxt = document.getElementById('stAreaTxt');
  const stPanelsTxt = document.getElementById('stPanelsTxt');
  const stStrTxt  = document.getElementById('stStrTxt');
  const stInvTxt  = document.getElementById('stInvTxt');
  if (!stCal) return;

  // Scala
  if (scale > 1) {
    stCal.className = 'status-dot green';
    stCalTxt.textContent = (1/scale).toFixed(2) + ' m/px';
  } else {
    stCal.className = 'status-dot gray';
    stCalTxt.textContent = 'Scala';
  }

  // Aree
  if (installableAreas.length > 0) {
    stArea.className = 'status-dot green';
    stAreaTxt.textContent = installableAreas.length + ' area' + (installableAreas.length > 1 ? 'e' : '');
  } else {
    stArea.className = 'status-dot gray';
    stAreaTxt.textContent = 'Aree';
  }

  // Pannelli
  if (panels.length > 0) {
    stPanels.className = 'status-dot green';
    const kwp = (panels.length * parseFloat(DOM.pp.value) / 1000);
    stPanelsTxt.textContent = panels.length + ' mod. · ' + kwp.toFixed(1) + 'kW';
  } else if (installableAreas.length > 0) {
    stPanels.className = 'status-dot yellow';
    stPanelsTxt.textContent = 'Da generare';
  } else {
    stPanels.className = 'status-dot gray';
    stPanelsTxt.textContent = 'Moduli';
  }

  // Stringhe
  if (strings.length > 0) {
    const valid = _checkStringValidity();
    stStr.className = 'status-dot ' + (valid ? 'green' : 'yellow');
    stStrTxt.textContent = strings.length + ' str.';
  } else if (panels.length > 0) {
    stStr.className = 'status-dot yellow';
    stStrTxt.textContent = 'Da config.';
  } else {
    stStr.className = 'status-dot gray';
    stStrTxt.textContent = 'Stringhe';
  }

  // Inverter
  if (typeof _inverterList !== 'undefined' && _inverterList.length > 0) {
    const totPac = _inverterList.reduce((s,inv) => s + (inv.pac || 0) * (inv.qty || 1), 0);
    const kwp = panels.length * parseFloat(DOM.pp.value) / 1000;
    const dcAc = totPac > 0 ? kwp / totPac : 0;
    const ok = dcAc <= 1.33 && dcAc > 0;
    stInv.className = 'status-dot ' + (ok ? 'green' : dcAc > 0 ? 'yellow' : 'gray');
    stInvTxt.textContent = totPac.toFixed(1) + 'kW';
  } else {
    stInv.className = 'status-dot gray';
    stInvTxt.textContent = 'Inverter';
  }
}

/** Verifica rapida: stringhe con pannelli validi e inverter compatibile */
function _checkStringValidity() {
  if (strings.length === 0) return false;
  // Check: ogni stringa ha almeno un pannello
  return strings.every(s => s.panels && s.panels.length > 0);
}


// ═══════════════════════════════════════════════════
// 2. DASHBOARD RIEPILOGATIVA
// ═══════════════════════════════════════════════════

let _dashboardOpen = true;

function toggleDashboard() {
  _dashboardOpen = !_dashboardOpen;
  const body = document.getElementById('dashBody');
  const arrow = document.getElementById('dashArrow');
  if (body) body.classList.toggle('collapsed', !_dashboardOpen);
  if (arrow) arrow.textContent = _dashboardOpen ? '▾' : '▸';
}

function updateDashboard() {
  const panel = document.getElementById('dashboardPanel');
  if (!panel) return;

  const tot = panels.length;
  const pp = parseFloat(DOM.pp.value) || 0;
  const pw = parseFloat(DOM.pw.value) || 0;
  const pl = parseFloat(DOM.pl.value) || 0;
  const kwp = tot * pp / 1000;
  const area = tot * pw * pl;

  // Mostra dashboard solo se ci sono dati
  if (tot > 0 || (typeof _inverterList !== 'undefined' && _inverterList.length > 0)) {
    panel.classList.add('visible');
  } else {
    panel.classList.remove('visible');
    return;
  }

  // Potenza
  _setDash('dashKwp', kwp.toFixed(2) + ' kWp');
  // Moduli
  const modDesc = tot + ' x ' + pp.toFixed(0) + 'W';
  _setDash('dashModuli', modDesc);
  // Stringhe
  _setDash('dashStringhe', strings.length > 0 ?
    strings.length + ' x ' + (strings[0].panels ? strings[0].panels.length : '?') + ' mod.' : '—');
  // Superficie
  _setDash('dashArea', area.toFixed(1) + ' m\u00B2');

  // Inverter
  if (typeof _inverterList !== 'undefined' && _inverterList.length > 0) {
    const invDescs = _inverterList.map(inv =>
      (inv.qty > 1 ? inv.qty + 'x ' : '') + (inv.model || '?'));
    _setDash('dashInverter', invDescs.join(', '), null, 11);
  } else {
    _setDash('dashInverter', '—');
  }

  // DC/AC ratio
  const totPac = (typeof _inverterList !== 'undefined') ?
    _inverterList.reduce((s,inv) => s + (inv.pac||0) * (inv.qty||1), 0) : 0;
  if (totPac > 0) {
    const dcAc = kwp / totPac;
    const cls = dcAc <= 1.1 ? 'ok' : dcAc <= 1.33 ? 'warn' : 'err';
    _setDash('dashDcAc', dcAc.toFixed(2), cls);
  } else {
    _setDash('dashDcAc', '—');
  }

  // Voc @-10°C
  const voc = parseFloat((document.getElementById('moduleVoc') || {}).value) || 0;
  const tcoef = parseFloat((document.getElementById('moduleTcoefVoc') || {}).value) || -0.30;
  if (voc > 0 && strings.length > 0 && strings[0].panels) {
    const n = strings[0].panels.length;
    const kVoc = tcoef / 100;
    const vocCold = voc * (1 + kVoc * (-10 - 25));
    const vocStr = vocCold * n;
    const vocMax = (typeof _inverterList !== 'undefined' && _inverterList.length > 0) ?
      _inverterList[0].vocMax || 1000 : 1000;
    const cls = vocStr < vocMax * 0.9 ? 'ok' : vocStr < vocMax ? 'warn' : 'err';
    _setDash('dashVoc', vocStr.toFixed(0) + ' V', cls);
  } else {
    _setDash('dashVoc', '—');
  }

  // Cavo DC
  const cableRes = document.getElementById('cableResults');
  if (cableRes && cableRes.textContent.trim()) {
    const match = cableRes.textContent.match(/(\d+(?:\.\d+)?)\s*mm/);
    _setDash('dashCavoDc', match ? match[0] : '—');
  } else {
    _setDash('dashCavoDc', '—');
  }

  // Validazione complessiva
  const invVal = document.getElementById('invValidation');
  if (invVal && invVal.style.display !== 'none' && invVal.textContent.trim()) {
    const hasError = invVal.innerHTML.includes('color:#b91c1c') || invVal.innerHTML.includes('color:red');
    const hasWarn = invVal.innerHTML.includes('color:#b45309') || invVal.innerHTML.includes('#d97706');
    if (hasError) {
      _setDash('dashValidation', 'Errori nella validazione inverter', 'err');
    } else if (hasWarn) {
      _setDash('dashValidation', 'Attenzione — verifica parametri', 'warn');
    } else {
      _setDash('dashValidation', 'Configurazione valida', 'ok');
    }
  } else if (tot > 0 && (typeof _inverterList === 'undefined' || _inverterList.length === 0)) {
    _setDash('dashValidation', 'Configura inverter nello Step 7', 'warn');
  } else {
    _setDash('dashValidation', '—');
  }
}

function _setDash(id, text, cls, fontSize) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = 'dash-card-value' + (cls ? ' ' + cls : '');
  if (fontSize) el.style.fontSize = fontSize + 'px';
  else el.style.fontSize = '';
}


// ═══════════════════════════════════════════════════
// 3. KEYBOARD SHORTCUTS — Ctrl+S, Ctrl+E, Ctrl+N, F1
// ═══════════════════════════════════════════════════

function _initShortcuts() {
  document.addEventListener('keydown', function(e) {
    // Ctrl+S — Salva
    if ((e.ctrlKey || e.metaKey) && e.key === 's' && !e.shiftKey) {
      e.preventDefault();
      salvaProgetto();
    }
    // Ctrl+O — Apri progetto (.sdproj o legacy .json) — AP-10 / PR-27
    if ((e.ctrlKey || e.metaKey) && e.key === 'o' && !e.shiftKey) {
      e.preventDefault();
      const inp = document.getElementById('loadProjectInput');
      if (inp) inp.click();
    }
    // Ctrl+E — Esporta PDF
    if ((e.ctrlKey || e.metaKey) && e.key === 'e' && !e.shiftKey) {
      e.preventDefault();
      if (panels.length > 0) exportProj();
      else showToast('Genera prima il layout dei moduli', 'warn');
    }
    // Ctrl+N — Nuovo progetto
    if ((e.ctrlKey || e.metaKey) && e.key === 'n' && !e.shiftKey) {
      e.preventDefault();
      resetAll();
    }
    // F1 o ? — Mostra shortcuts
    if (e.key === 'F1' || (e.key === '?' && document.activeElement.tagName !== 'INPUT' && !e.ctrlKey)) {
      e.preventDefault();
      openShortcutsModal();
    }
    // M — Toggle minimap (non in input)
    if ((e.key === 'm' || e.key === 'M') && document.activeElement.tagName !== 'INPUT'
        && !e.ctrlKey && !e.metaKey && mode === 'none') {
      e.preventDefault();
      toggleMinimap();
    }
  });
}

function openShortcutsModal() {
  const m = document.getElementById('shortcutsModal');
  if (m) m.classList.add('visible');
}
function closeShortcutsModal() {
  const m = document.getElementById('shortcutsModal');
  if (m) m.classList.remove('visible');
}


// ═══════════════════════════════════════════════════
// 4. CANVAS ENHANCEMENTS — Minimap, Ruler, Preview
// ═══════════════════════════════════════════════════

let _minimapVisible = false;

function toggleMinimap() {
  _minimapVisible = !_minimapVisible;
  const el = document.getElementById('canvasMinimap');
  if (el) el.classList.toggle('visible', _minimapVisible);
  if (_minimapVisible) renderMinimap();
}

function renderMinimap() {
  if (!_minimapVisible) return;
  const mmCanvas = document.getElementById('minimapCanvas');
  if (!mmCanvas) return;
  const mm = mmCanvas.getContext('2d');
  const W = 140, H = 100;
  mmCanvas.width = W * 2;
  mmCanvas.height = H * 2;
  mm.setTransform(2, 0, 0, 2, 0, 0);

  mm.fillStyle = '#1a1a1a';
  mm.fillRect(0, 0, W, H);

  // Calcola bounding box di tutti gli elementi
  const allPts = [];
  installableAreas.forEach(a => a.points.forEach(p => allPts.push(p)));
  exclusionAreas.forEach(a => a.points.forEach(p => allPts.push(p)));
  panels.forEach(p => { allPts.push({x:p.x, y:p.y}); allPts.push({x:p.x+p.w, y:p.y+p.h}); });
  if (img) {
    allPts.push({x: -img.width/2, y: -img.height/2});
    allPts.push({x: img.width/2, y: img.height/2});
  }

  if (allPts.length < 2) return;
  const xs = allPts.map(p=>p.x), ys = allPts.map(p=>p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const rangeX = maxX - minX || 1, rangeY = maxY - minY || 1;
  const pad = 8;
  const scaleM = Math.min((W-2*pad)/rangeX, (H-2*pad)/rangeY);
  const tx = (pt) => pad + (pt.x - minX) * scaleM;
  const ty = (pt) => pad + (pt.y - minY) * scaleM;

  // Disegna immagine di sfondo (semplificata come rettangolo)
  if (img) {
    mm.fillStyle = 'rgba(100,100,100,0.3)';
    const ix = tx({x:-img.width/2}), iy = ty({y:-img.height/2});
    mm.fillRect(ix, iy, img.width * scaleM, img.height * scaleM);
  }

  // Aree installabili
  installableAreas.forEach((a, i) => {
    const ac = AREA_COLORS[i % AREA_COLORS.length];
    mm.fillStyle = ac.fill;
    mm.strokeStyle = ac.stroke;
    mm.lineWidth = 1;
    mm.beginPath();
    mm.moveTo(tx(a.points[0]), ty(a.points[0]));
    for (let j = 1; j < a.points.length; j++)
      mm.lineTo(tx(a.points[j]), ty(a.points[j]));
    mm.closePath(); mm.fill(); mm.stroke();
  });

  // Pannelli (come punti o piccoli rettangoli)
  if (panels.length > 0) {
    mm.fillStyle = 'rgba(30,58,95,0.7)';
    panels.forEach(p => {
      mm.fillRect(tx(p), ty(p), Math.max(1, p.w * scaleM), Math.max(1, p.h * scaleM));
    });
  }

  // Viewport corrente (rettangolo bianco)
  const vpW = canvas.clientWidth / z;
  const vpH = canvas.clientHeight / z;
  const vpX = -canvas.clientWidth/(2*z) - ox/z;
  const vpY = -canvas.clientHeight/(2*z) - oy/z;
  mm.strokeStyle = 'rgba(255,255,255,0.8)';
  mm.lineWidth = 1.5;
  mm.strokeRect(
    pad + (vpX - minX) * scaleM,
    pad + (vpY - minY) * scaleM,
    vpW * scaleM,
    vpH * scaleM
  );
}

/** Aggiorna il righello canvas con info scala */
function updateCanvasRuler() {
  const ruler = document.getElementById('canvasRuler');
  const rulerText = document.getElementById('rulerText');
  if (!ruler || !rulerText) return;

  if (scale > 1) {
    ruler.classList.add('visible');
    // Calcola quanti pixel = 1 metro a questo zoom
    const pxPerM = scale * z;
    // Scegli un'unità leggibile
    let labelM, labelPx;
    if (pxPerM > 200) {
      labelM = 0.5; labelPx = pxPerM * 0.5;
    } else if (pxPerM > 80) {
      labelM = 1; labelPx = pxPerM;
    } else if (pxPerM > 30) {
      labelM = 2; labelPx = pxPerM * 2;
    } else if (pxPerM > 15) {
      labelM = 5; labelPx = pxPerM * 5;
    } else {
      labelM = 10; labelPx = pxPerM * 10;
    }
    rulerText.textContent = '\u2014 ' + labelM + ' m = ' + Math.round(labelPx) + 'px \u2014 Zoom: ' + (z*100).toFixed(0) + '%';
  } else {
    ruler.classList.remove('visible');
  }
}

/** Preview area: durante il disegno di un'area, stima quanti pannelli entreranno */
function getAreaPreviewCount(pts) {
  if (!pts || pts.length < 3 || scale <= 1) return null;
  // Calcola area del poligono in m²
  let areaPx2 = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    areaPx2 += pts[i].x * pts[j].y - pts[j].x * pts[i].y;
  }
  areaPx2 = Math.abs(areaPx2) / 2;
  const areaM2 = areaPx2 / (scale * scale);
  const pw = parseFloat(DOM.pw.value) || 1.134;
  const pl = parseFloat(DOM.pl.value) || 1.722;
  const ps = (parseFloat(DOM.ps.value) || 2) / 100;
  const margin = (parseFloat(DOM.safetyMargin.value) || 10) / 100;
  const panelArea = (pw + ps) * (pl + ps);
  // Stima grossolana: area utile dopo margine / area pannello singolo
  const usableArea = areaM2 * 0.85; // ~85% fill factor tipico
  const estimate = Math.floor(usableArea / panelArea);
  const estimateKwp = (estimate * parseFloat(DOM.pp.value) / 1000).toFixed(1);
  return {
    areaM2: areaM2.toFixed(1),
    panels: estimate,
    kwp: estimateKwp
  };
}


// ═══════════════════════════════════════════════════
// INIT — Collega tutto al ciclo di vita dell'app
// ═══════════════════════════════════════════════════

let _enhancementsInitialized = false;
function _initEnhancements() {
  if (_enhancementsInitialized) return;
  _enhancementsInitialized = true;

  _initShortcuts();

  // Sovrascrive updateStats per aggiornare anche status bar e dashboard
  const _origUpdateStats = updateStats;
  updateStats = function() {
    _origUpdateStats();
    updateStatusBar();
    updateDashboard();
    updateCanvasRuler();
    if (_minimapVisible) renderMinimap();
  };

  // Hook nel draw() per aggiornare minimap e ruler
  const _origDraw = draw;
  draw = function() {
    _origDraw();
    updateCanvasRuler();
    if (_minimapVisible) renderMinimap();
    // Area preview durante il disegno
    _drawAreaPreviewOverlay();
  };

  // Aggiornamento iniziale
  setTimeout(() => {
    updateStatusBar();
    updateDashboard();
    updateCanvasRuler();
  }, 200);
}

/** Mostra stima pannelli durante il disegno area */
function _drawAreaPreviewOverlay() {
  if (mode !== 'area' || curPts.length < 3) return;
  const preview = getAreaPreviewCount(curPts);
  if (!preview) return;

  // Disegna overlay info nel canvas
  const dpr = window.devicePixelRatio || 1;
  ctx.save();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const text = '~' + preview.panels + ' moduli · ' + preview.kwp + ' kWp · ' + preview.areaM2 + ' m\u00B2';
  ctx.font = '600 12px "JetBrains Mono", monospace';
  const tw = ctx.measureText(text).width + 20;
  const x = canvas.clientWidth / 2 - tw / 2;
  const y = 12;
  ctx.fillStyle = 'rgba(13,150,104,0.88)';
  ctx.beginPath();
  ctx.roundRect(x, y, tw, 28, 6);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.clientWidth / 2, y + 14);

  ctx.restore();
}


// ── js/ui/utils.js ──
// ── js/ui/utils.js — UI utilities + DOM cache + crash-log bridge ──
// Extracted from ui.js in AP-16a. Toast notifications, custom confirm/
// prompt dialogs, theme toggle, DOM cache populator, section-enable
// helper, and the renderer error bridge to the preload crash channel.
// Calling surface unchanged — all symbols remain available through
// bundle-scope globals.
'use strict';

// ── Global error handlers ──────────────────────────────────────────────────────
function _forwardToCrashLog(entry) {
  // AP-12 / PR-31 — fire-and-forget into preload bridge if present.
  // Guarded so non-Electron contexts (lint/test/headless) do not throw.
  try {
    if (typeof window !== 'undefined'
        && window.appBridge
        && typeof window.appBridge.logError === 'function') {
      window.appBridge.logError(entry);
    }
  } catch (_) { /* logging must never crash the renderer */ }
}

window.onerror = function(msg, src, line, col, err) {
  console.error('[SDP] Uncaught error:', msg, src + ':' + line + ':' + col, err);
  _forwardToCrashLog({
    source:  'renderer.error',
    message: String(msg),
    file:    src || '',
    lineno:  line,
    colno:   col,
    stack:   (err && err.stack) ? err.stack : '',
  });
  return false; // non sopprime il comportamento default del browser
};
window.onunhandledrejection = function(e) {
  console.error('[SDP] Unhandled promise rejection:', e.reason);
  const r = e && e.reason;
  _forwardToCrashLog({
    source:  'renderer.unhandledrejection',
    message: (r && r.message) ? r.message : String(r),
    stack:   (r && r.stack) ? r.stack : '',
  });
};

// ── Theme ─────────────────────────────────────────────────────────────────────

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  if (next === 'dark') html.setAttribute('data-theme', 'dark');
  else html.removeAttribute('data-theme');
  if (DOM.themeBtn) DOM.themeBtn.title = next === 'dark' ? 'Passa a tema chiaro' : 'Passa a tema scuro';
  try { localStorage.setItem('sdp_theme', next); } catch(e) { /* localStorage may be disabled */ }
  draw();
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function showToast(msg, type='info', duration=3000) {
  const c = document.getElementById('toast-container');
  if (!c) { alert(msg); return; }
  const el = document.createElement('div');
  el.className = 'toast toast-' + type; el.textContent = msg; c.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity 0.3s,transform 0.3s';
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    setTimeout(() => el.remove(), 320);
  }, duration);
}

// ── Custom dialogs (sostituisce confirm/prompt nativi) ─────────────────────────

function _sdpConfirm(msg, onOk) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:9999;display:flex;align-items:center;justify-content:center;';
  const box = document.createElement('div');
  box.style.cssText = 'background:var(--bg-primary,#1e1e1e);border:1px solid var(--border-default,#333);border-radius:10px;padding:24px 28px;min-width:280px;max-width:420px;box-shadow:0 8px 32px rgba(0,0,0,0.5);';
  const p = document.createElement('p');
  p.style.cssText = 'margin:0 0 20px;color:var(--text-primary,#e5e5e5);font-size:14px;line-height:1.5;white-space:pre-wrap;';
  p.textContent = msg; // textContent — nessun XSS possibile
  const btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;gap:10px;justify-content:flex-end;';
  const btnNo  = document.createElement('button');
  btnNo.textContent  = 'Annulla';
  btnNo.style.cssText  = 'padding:7px 18px;border-radius:6px;border:1px solid var(--border-default,#333);background:transparent;color:var(--text-primary,#e5e5e5);cursor:pointer;font-size:13px;';
  const btnYes = document.createElement('button');
  btnYes.textContent = 'Conferma';
  btnYes.style.cssText = 'padding:7px 18px;border-radius:6px;border:none;background:var(--accent,#0d9668);color:#fff;cursor:pointer;font-size:13px;font-weight:600;';
  btnRow.append(btnNo, btnYes);
  box.append(p, btnRow);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  btnYes.onclick = () => { close(); onOk(); };
  btnNo.onclick  = close;
  overlay.setAttribute('tabindex', '0');
  overlay.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
    if (e.key === 'Enter')  { close(); onOk(); }
  });
  setTimeout(() => overlay.focus(), 50);
}

function _sdpPrompt(msg, defaultVal, onOk) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:9999;display:flex;align-items:center;justify-content:center;';
  const box = document.createElement('div');
  box.style.cssText = 'background:var(--bg-primary,#1e1e1e);border:1px solid var(--border-default,#333);border-radius:10px;padding:24px 28px;min-width:280px;max-width:420px;box-shadow:0 8px 32px rgba(0,0,0,0.5);';
  const p = document.createElement('p');
  p.style.cssText = 'margin:0 0 12px;color:var(--text-primary,#e5e5e5);font-size:14px;line-height:1.5;';
  p.textContent = msg;
  const inp = document.createElement('input');
  inp.type = 'text'; inp.value = defaultVal || '';
  inp.style.cssText = 'width:100%;box-sizing:border-box;padding:8px 10px;border-radius:6px;border:1px solid var(--border-default,#444);background:var(--bg-secondary,#2a2a2a);color:var(--text-primary,#e5e5e5);font-size:14px;margin-bottom:16px;outline:none;';
  const btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;gap:10px;justify-content:flex-end;';
  const btnNo  = document.createElement('button');
  btnNo.textContent  = 'Annulla';
  btnNo.style.cssText  = 'padding:7px 18px;border-radius:6px;border:1px solid var(--border-default,#333);background:transparent;color:var(--text-primary,#e5e5e5);cursor:pointer;font-size:13px;';
  const btnYes = document.createElement('button');
  btnYes.textContent = 'OK';
  btnYes.style.cssText = 'padding:7px 18px;border-radius:6px;border:none;background:var(--accent,#0d9668);color:#fff;cursor:pointer;font-size:13px;font-weight:600;';
  btnRow.append(btnNo, btnYes);
  box.append(p, inp, btnRow);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  const submit = () => { const v = inp.value.trim(); if (v) { close(); onOk(v); } };
  btnYes.onclick = submit;
  btnNo.onclick  = close;
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') close(); });
  setTimeout(() => { inp.focus(); inp.select(); }, 50);
}

// ── DOM cache ─────────────────────────────────────────────────────────────────
// Moved to js/dom.js (AP-17b). `DOM` object and `initDOMCache()` live there.

// ── enable (rimuove classe disabled da una sezione) ──────────────────────────

function enable(id) {
  document.getElementById(id).classList.remove('disabled');
}


// ── js/ui/widgets-module.js ──
// ── js/ui/widgets-module.js — module library widget logic ──
// Extracted from ui.js in AP-16b1. Contains module library load/save,
// render, apply, and delete flows used by the S3 module section.
// Calling surface unchanged — all symbols remain available through
// bundle-scope globals.
'use strict';

// ── Libreria moduli ───────────────────────────────────────────────────────────

function _loadModuleLib() {
  try { return JSON.parse(localStorage.getItem(MODULE_LIB_KEY)) || []; }
  catch(e) { return []; }
}
function _saveModuleLib(lib) {
  try { localStorage.setItem(MODULE_LIB_KEY, JSON.stringify(lib)); } catch(e) { /* localStorage may be disabled */ }
}

function toggleModuleLib() {
  const body = DOM.moduleLibBody;
  const arrow = DOM.moduleLibArrow;
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  arrow.style.transform = isOpen ? '' : 'rotate(180deg)';
  if (!isOpen) renderModuleLib();
}

function renderModuleLib() {
  const grid = DOM.moduleLibGrid;
  if (!grid) return;
  grid.innerHTML = '';
  const userLib = _loadModuleLib();
  const all = [...MODULE_PRESETS.map(m => ({...m, preset:true})), ...userLib.map(m => ({...m, preset:false}))];
  all.forEach((m, i) => {
    const chip = document.createElement('span');
    chip.className = 'module-chip';
    chip.title = `${m.pl}×${m.pw} m · ${m.pp} Wp`;
    chip.innerHTML = `<span onclick="applyModule(${i})" style="cursor:pointer;">${m.name}</span>`;
    if (!m.preset) {
      const del = document.createElement('button');
      del.className = 'module-chip-del';
      del.textContent = '×';
      del.title = 'Elimina dalla libreria';
      del.onclick = (e) => { e.stopPropagation(); deleteModuleFromLib(i - MODULE_PRESETS.length); };
      chip.appendChild(del);
    }
    chip.querySelector('span').onclick = () => applyModule(i);
    grid.appendChild(chip);
  });
}

function applyModule(idx) {
  const all = [...MODULE_PRESETS, ..._loadModuleLib()];
  const m = all[idx]; if (!m) return;
  DOM.pw.value = m.pw; DOM.pl.value = m.pl; DOM.pp.value = m.pp;
  if (document.getElementById('moduleImpp')) document.getElementById('moduleImpp').value = m.impp || '';
  if (document.getElementById('moduleVmpp')) document.getElementById('moduleVmpp').value = m.vmpp || '';
  if (document.getElementById('moduleIsc'))  document.getElementById('moduleIsc').value  = m.isc  || '';
  if (document.getElementById('moduleVoc'))  document.getElementById('moduleVoc').value  = m.voc  || '';
  invalidateLayoutCache();
  if (panels.length > 0) { snapshot(); _relayout(); }
  showToast(`Modulo "${m.name}" applicato`, 'success', 1800);
}

function saveModuleToLib() {
  const pw = parseFloat(DOM.pw.value), pl = parseFloat(DOM.pl.value), pp = parseInt(DOM.pp.value);
  if (!pw || !pl || !pp) { showToast('Inserire prima i dati del modulo', 'warn'); return; }
  _sdpPrompt(`Nome per questo modulo (${pl}×${pw} m · ${pp} Wp):`, `${pp}Wp`, name => {
    const lib = _loadModuleLib();
    lib.push({ name: name.trim(), pw, pl, pp });
    _saveModuleLib(lib);
    renderModuleLib();
    showToast(`Modulo "${name}" salvato in libreria`, 'success', 2000);
  });
}

function deleteModuleFromLib(userIdx) {
  const lib = _loadModuleLib();
  if (userIdx < 0 || userIdx >= lib.length) return;
  _sdpConfirm(`Eliminare "${lib[userIdx].name}" dalla libreria?`, () => {
    lib.splice(userIdx, 1);
    _saveModuleLib(lib);
    renderModuleLib();
  });
}


// ── js/ui/widgets-area.js ──
// ── js/ui/widgets-area.js — area widget UI logic ──
// Extracted from ui.js in AP-16b2. Contains installable/exclusion area
// accordion toggles, UI builders, list rendering, and area list mutation
// helpers used by the S2 area workflow.
// Calling surface unchanged — all symbols remain available through
// bundle-scope globals.
'use strict';

// ── Accordion aree ─────────────────────────────────────────────────────────────

function toggleAreaAccordion() {
  _areaAccOpen = !_areaAccOpen;
  const list = DOM.areaList;
  const arrow = DOM.areaAccordionArrow;
  list.style.display = _areaAccOpen ? 'block' : 'none';
  arrow.style.transform = _areaAccOpen ? 'rotate(180deg)' : '';
}
function toggleExclusionAccordion() {
  _exclAccOpen = !_exclAccOpen;
  const list = DOM.exclusionList;
  const arrow = DOM.exclusionAccordionArrow;
  list.style.display = _exclAccOpen ? 'block' : 'none';
  arrow.style.transform = _exclAccOpen ? 'rotate(180deg)' : '';
}

// ── Costruttori HTML per liste aree ───────────────────────────────────────────

function _buildWalkwayUI(idx, areaObj, inpStyle, chkStyle, lbStyle) {
  const rOn  = areaObj ? (areaObj.walkRowEnabled !== undefined ? areaObj.walkRowEnabled : (areaObj.walkwaysEnabled && (areaObj.walkwayDir||'row')==='row' ? true : false)) : false;
  const rInt = areaObj ? (areaObj.walkRowInterval || areaObj.walkwayInterval || 3) : 3;
  const rW   = areaObj ? (areaObj.walkRowWidth    || areaObj.walkwayWidth    || 80): 80;
  const cOn  = areaObj ? (areaObj.walkColEnabled !== undefined ? areaObj.walkColEnabled : (areaObj.walkwaysEnabled && (areaObj.walkwayDir||'row')==='col' ? true : false)) : false;
  const cInt = areaObj ? (areaObj.walkColInterval || areaObj.walkwayInterval || 3) : 3;
  const cW   = areaObj ? (areaObj.walkColWidth    || areaObj.walkwayWidth    || 80): 80;
  const inp38 = inpStyle.replace('48px','38px');
  const rowH =
    `<div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-bottom:2px;">` +
      `<label style="${chkStyle}"><input type="checkbox" style="pointer-events:auto;" ${rOn?'checked':''} onchange="setAreaWalkRowEnabled(${idx},this.checked)"><span style="${lbStyle}">↔ Camm. H</span></label>` +
      (rOn ? `<span style="font-size:var(--fs-xs);color:var(--text-tertiary);">ogni</span>` +
             `<input type="number" value="${rInt}" min="1" max="30" style="${inp38}" oninput="setAreaWalkRowInterval(${idx},this.value)" onchange="commitAreaWalkRowInterval(${idx},this.value)">` +
             `<span style="font-size:var(--fs-xs);color:var(--text-tertiary);">file ·</span>` +
             `<input type="number" value="${rW}" min="20" max="400" style="${inpStyle}" oninput="setAreaWalkRowWidth(${idx},this.value)" onchange="commitAreaWalkRowWidth(${idx},this.value)">` +
             `<span style="font-size:var(--fs-xs);color:var(--text-tertiary);">cm</span>` : '') +
    `</div>`;
  const colH =
    `<div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;">` +
      `<label style="${chkStyle}"><input type="checkbox" style="pointer-events:auto;" ${cOn?'checked':''} onchange="setAreaWalkColEnabled(${idx},this.checked)"><span style="${lbStyle}">↕ Camm. V</span></label>` +
      (cOn ? `<span style="font-size:var(--fs-xs);color:var(--text-tertiary);">ogni</span>` +
             `<input type="number" value="${cInt}" min="1" max="30" style="${inp38}" oninput="setAreaWalkColInterval(${idx},this.value)" onchange="commitAreaWalkColInterval(${idx},this.value)">` +
             `<span style="font-size:var(--fs-xs);color:var(--text-tertiary);">col ·</span>` +
             `<input type="number" value="${cW}" min="20" max="400" style="${inpStyle}" oninput="setAreaWalkColWidth(${idx},this.value)" onchange="commitAreaWalkColWidth(${idx},this.value)">` +
             `<span style="font-size:var(--fs-xs);color:var(--text-tertiary);">cm</span>` : '') +
    `</div>`;
  return rowH + colH;
}

function _buildAreaHeader(idx, ac, orient, panelCount, areaMq) {
  const btnStyle = (o, activeColor) => {
    const active = orient === o;
    return `pointer-events:auto;padding:2px 7px;border-radius:3px;font-size:var(--fs-xs);` +
           `cursor:pointer;font-family:var(--font-main);` +
           `font-weight:${active?'700':'400'};` +
           `background:${active?activeColor:'transparent'};` +
           `color:${active?'#fff':'var(--text-secondary)'};` +
           `border:1px solid ${active?activeColor:'var(--border-default)'};`;
  };
  const expVal = installableAreas[idx] ? (installableAreas[idx].exposure || '') : '';
  const expLbl = EXP_LABELS[expVal] || '';
  const expBadgeStyle = expVal ? `background:${EXP_COLORS[expVal]||'#64748b'};color:#fff;padding:1px 6px;border-radius:10px;font-size:10px;font-weight:600;margin-left:4px;` : '';
  const expBadge = expLbl ? `<span style="${expBadgeStyle}">${expLbl}</span>` : '';

  const areaObj   = installableAreas[idx];
  const sOn       = areaObj ? (areaObj.staggerEnabled || false) : false;
  const sOff      = areaObj ? (areaObj.staggerOffset  || 50)   : 50;

  const inpStyle  = 'pointer-events:auto;width:48px;padding:2px 5px;font-size:var(--fs-xs);' +
                    'border:1px solid var(--border-default);border-radius:3px;' +
                    'background:var(--bg-primary);color:var(--text-primary);font-family:var(--font-main);';
  const chkStyle  = 'pointer-events:auto;display:flex;align-items:center;gap:4px;cursor:pointer;';
  const lbStyle   = 'pointer-events:auto;cursor:pointer;font-size:var(--fs-xs);color:var(--text-secondary);';

  const staggerRow =
    `<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:4px;">` +
      `<label style="${chkStyle}">` +
        `<input type="checkbox" style="pointer-events:auto;" ${sOn?'checked':''} onchange="setAreaStagger(${idx},this.checked)">` +
        `<span style="${lbStyle}">Sfalsato</span>` +
      `</label>` +
      (sOn
        ? `<input type="number" value="${sOff}" min="10" max="90" step="5" title="Sfalsamento %" style="${inpStyle}" oninput="setAreaStaggerOffset(${idx},this.value)" onchange="commitAreaStaggerOffset(${idx},this.value)">` +
          `<span style="font-size:var(--fs-xs);color:var(--text-tertiary);">%</span>`
        : '') +
    `</div>`;

  const walkwayRow = _buildWalkwayUI(idx, areaObj, inpStyle, chkStyle, lbStyle);

  return (
    `<div style="display:flex;justify-content:space-between;align-items:center;">` +
      `<div class="area-info">` +
        `<div class="area-title" style="color:${ac.stroke};">Area ${idx+1}${expBadge}</div>` +
        `<div class="area-subtitle">${panelCount} mod${areaObj && areaObj._maxCapacity !== undefined && areaObj._maxCapacity !== panelCount ? ` <span style="color:var(--text-tertiary);font-size:10px;">(max ${areaObj._maxCapacity})</span>` : ''} · ${areaMq} m²</div>` +
      `</div>` +
      (() => {
        const trueMax = areaObj && areaObj._maxCapacity != null ? areaObj._maxCapacity : null;
        const canAdd = trueMax == null || panelCount < trueMax;
        const canRem = panelCount > 0;
        const bBase = 'pointer-events:auto;width:26px;height:26px;border-radius:4px;font-size:14px;line-height:1;cursor:pointer;font-family:var(--font-main);border:1px solid var(--border-default);';
        const bOn  = bBase + 'background:var(--bg-primary);color:var(--text-primary);';
        const bOff = bBase + 'background:var(--bg-secondary);color:var(--text-tertiary);cursor:default;opacity:0.45;';
        return `<div style="display:flex;align-items:center;gap:4px;margin-right:6px;">` +
          `<button style="${canRem?bOn:bOff}" ${canRem?`onclick="removeAreaPanel(${idx})"`:''} ${canRem?'':'disabled'} title="Togli pannello">−</button>` +
          `<button style="${canAdd?bOn:bOff}" ${canAdd?`onclick="addAreaPanel(${idx})"`:''} ${canAdd?'':'disabled'} title="Aggiungi pannello">+</button>` +
        `</div>`;
      })() +
      `<button class="delete-btn" style="pointer-events:auto;" onclick="delInstallableArea(${idx})">x</button>` +
    `</div>` +
    `<div style="display:flex;gap:3px;align-items:center;margin-top:5px;">` +
      `<button onclick="setAreaOrientation(${idx},'portrait')"  style="${btnStyle('portrait','#111')}">Portrait</button>` +
      `<button onclick="setAreaOrientation(${idx},'landscape')" style="${btnStyle('landscape','#111')}">Landscape</button>` +
      `<button onclick="setAreaOrientation(${idx},'auto')"      style="${btnStyle('auto','#16a085')}">Auto</button>` +
    `</div>` +
    `<div style="display:flex;align-items:center;gap:6px;margin-top:4px;">` +
      `<span style="font-size:var(--fs-xs);color:var(--text-secondary);flex:1;">${expBadge||'Esposizione non impostata'}</span>` +
      `<button onclick="startExpArrow(${idx})" style="pointer-events:auto;padding:2px 9px;font-size:var(--fs-xs);` +
        `border-radius:4px;border:1px solid #f97316;color:#f97316;background:transparent;cursor:pointer;` +
        `font-family:var(--font-main);">&#8594; Disegna</button>` +
    `</div>`
  );
}

function _buildLayoutOptionsCard(idx) {
  const ac      = AREA_COLORS[idx % AREA_COLORS.length];
  const areaObj = installableAreas[idx];
  const sOn  = areaObj ? (areaObj.staggerEnabled  || false) : false;
  const sOff = areaObj ? (areaObj.staggerOffset   || 50)   : 50;

  const inpStyle = 'pointer-events:auto;width:48px;padding:2px 5px;font-size:var(--fs-xs);' +
                   'border:1px solid var(--border-default);border-radius:3px;' +
                   'background:var(--bg-primary);color:var(--text-primary);font-family:var(--font-main);';
  const chkStyle = 'pointer-events:auto;display:flex;align-items:center;gap:4px;cursor:pointer;';
  const lbStyle  = 'pointer-events:auto;cursor:pointer;font-size:var(--fs-xs);color:var(--text-secondary);';

  const staggerRow =
    `<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px;">` +
      `<label style="${chkStyle}">` +
        `<input type="checkbox" style="pointer-events:auto;" ${sOn?'checked':''} onchange="setAreaStagger(${idx},this.checked)">` +
        `<span style="${lbStyle}">Sfalsato</span>` +
      `</label>` +
      (sOn
        ? `<input type="number" value="${sOff}" min="10" max="90" step="5" title="Sfalsamento %" style="${inpStyle}"` +
          ` oninput="setAreaStaggerOffset(${idx},this.value)" onchange="commitAreaStaggerOffset(${idx},this.value)">` +
          `<span style="font-size:var(--fs-xs);color:var(--text-tertiary);">%</span>`
        : '') +
    `</div>`;

  const walkwayRow = _buildWalkwayUI(idx, areaObj, inpStyle, chkStyle, lbStyle);

  return (
    `<div style="padding:8px 10px;border-radius:var(--radius-sm);border:1px solid var(--border-default);` +
    `border-left:3px solid ${ac.stroke};margin-bottom:6px;">` +
      `<div style="font-size:var(--fs-xs);font-weight:700;color:${ac.stroke};margin-bottom:6px;">Area ${idx+1}</div>` +
      staggerRow + walkwayRow +
    `</div>`
  );
}

function _buildExclusionHeader(idx, areaMq) {
  return (
    `<div style="display:flex;align-items:center;gap:6px;margin-bottom:5px;">` +
      `<span style="font-size:12px;font-weight:600;color:var(--danger);flex:1;">Ostacolo ${idx+1}</span>` +
      `<span style="font-size:var(--fs-xs);color:var(--text-secondary);">${areaMq} m²</span>` +
      `<button class="delete-btn" style="pointer-events:auto;color:var(--text-tertiary);" title="Copia e incolla area" onclick="copyExclusionArea(${idx})">⎘</button>` +
      `<button class="delete-btn" style="pointer-events:auto;" onclick="delExclusionArea(${idx})">x</button>` +
    `</div>` +
    `<div style="display:flex;align-items:center;gap:6px;">` +
      `<span style="font-size:10px;font-weight:600;color:var(--text-secondary);white-space:nowrap;">Ruota <b id="exr${idx}">0</b>°</span>` +
      `<input type="range" min="-180" max="180" value="0" step="1"` +
      ` style="pointer-events:auto;flex:1;accent-color:#f59e0b;cursor:pointer;"` +
      ` oninput="document.getElementById('exr${idx}').textContent=this.value;_rotateExclusionTo(${idx},parseInt(this.value));"` +
      ` onchange="snapshot();updateAreaLists();">` +
    `</div>`
  );
}

function updateAreaLists() {
  const panelCountByArea = new Map();
  panels.forEach(p => panelCountByArea.set(p.areaIdx, (panelCountByArea.get(p.areaIdx) || 0) + 1));

  const list = DOM.areaList;
  const bar = DOM.areaAccordionBar;
  const sum = DOM.areaAccordionSummary;
  list.innerHTML = '';
  if (installableAreas.length === 0) {
    bar.classList.remove('visible');
    list.style.display = 'none';
  } else {
    const totalPanels = panels.length;
    const totalMq = installableAreas.reduce((s,a) => s + polyAreaCached(a), 0).toFixed(0);
    sum.textContent = `${installableAreas.length} aree · ${totalPanels} moduli · ${totalMq} m²`;
    bar.classList.add('visible');
    list.style.display = _areaAccOpen ? 'block' : 'none';
    DOM.areaAccordionArrow.style.transform = _areaAccOpen ? 'rotate(180deg)' : '';

    installableAreas.forEach((a, i) => {
      const panelCount = panelCountByArea.get(i) || 0;
      const orient = a.orientation || 'auto';
      const ac = AREA_COLORS[i % AREA_COLORS.length];
      const div = document.createElement('div');
      div.className = 'area-item';
      div.style.cssText = 'flex-direction:column;align-items:stretch;gap:6px;border-left:3px solid '+ac.stroke+';';
      div.innerHTML = `\n${_buildAreaHeader(i, ac, orient, panelCount, polyAreaCached(a).toFixed(1))}\n `;
      list.appendChild(div);
    });
  }

  const exList = DOM.exclusionList;
  const exBar = DOM.exclusionAccordionBar;
  const exSum = DOM.exclusionAccordionSummary;
  exList.innerHTML = '';
  const totalObstacles = exclusionAreas.length + technicalObjects.length;
  if (totalObstacles === 0) {
    exBar.classList.remove('visible');
    exList.style.display = 'none';
  } else {
    const totMqEx = exclusionAreas.reduce((s,a) => s + polyAreaCached(a), 0).toFixed(0);
    const exParts = [];
    if (exclusionAreas.length > 0) exParts.push(`${exclusionAreas.length} zone`);
    if (technicalObjects.length > 0) exParts.push(`${technicalObjects.length} puntuali`);
    if (parseFloat(totMqEx) > 0) exParts.push(`${totMqEx} m²`);
    exSum.textContent = exParts.join(' · ') || 'Ostacoli';
    exBar.classList.add('visible');
    exList.style.display = _exclAccOpen ? 'block' : 'none';
    DOM.exclusionAccordionArrow.style.transform = _exclAccOpen ? 'rotate(180deg)' : '';

    exclusionAreas.forEach((a, i) => {
      const div = document.createElement('div');
      div.className = 'area-item exclusion';
      div.innerHTML = `\n${_buildExclusionHeader(i, polyAreaCached(a).toFixed(1))}\n `;
      exList.appendChild(div);
    });

    technicalObjects.forEach((obj, i) => {
      const listColor = TECH_LIST_COLORS[obj.type] || '#aaa';
      const div = document.createElement('div');
      div.className = 'area-item exclusion';
      div.style.cssText = 'pointer-events:auto;padding:8px 10px 7px;background:var(--bg-primary);border:1px solid var(--border-light);border-radius:var(--radius);margin-bottom:5px;';
      div.style.borderLeft = `3px solid ${listColor}`;
      div.innerHTML = _buildTechCard(obj, i);
      exList.appendChild(div);
    });
  }
  updateLayoutOptionsList();
}

function delInstallableArea(i) {
  _sdpConfirm('Eliminare area e moduli?', () => {
    snapshot();
    invalidateLayoutCache();
    const hadStrings = strings.length;
    panels = panels.filter(p => p.areaIdx !== i);
    // AP-17d: route write through store.
    globalThis.setStoreSlice('installableAreas', installableAreas.filter((_, idx) => idx !== i));
    panels.forEach(p => { if (p.areaIdx > i) p.areaIdx--; });
    selectedPanels = new Set();
    strings = [];
    panels.forEach(p => { p.strId = null; p.stringColor = null; });
    if (panels.length === 0) {
      if(DOM.deletePanelsBtn) DOM.deletePanelsBtn.style.display='none';
      _updateToolbarGroups();
    } else if (hadStrings > 0) {
      genStrings(hadStrings);
    }
    updateAreaLists(); updateStringList(); updateLegend(); updateStats(); draw();
  });
}

function delExclusionArea(i) {
  _sdpConfirm('Eliminare area ostacolo?', () => {
    snapshot();
    invalidateLayoutCache();
    // AP-17d: route write through store.
    globalThis.setStoreSlice('exclusionAreas', exclusionAreas.filter((_, idx) => idx !== i));
    updateAreaLists(); draw();
  });
}

function copyExclusionArea(idx) {
  const src = exclusionAreas[idx];
  if (!src) return;
  const n = src.points.length;
  const cx = src.points.reduce((s,p)=>s+p.x,0)/n;
  const cy = src.points.reduce((s,p)=>s+p.y,0)/n;
  _copyExclPts = src.points.map(p=>({x:p.x-cx, y:p.y-cy}));
  _copyExclMode = true;
  canvas.style.cursor = 'copy';
  showToast('Clicca sul canvas per incollare l\'ostacolo · ESC per annullare', 'info', 4000);
  draw();
}

function _cancelCopyExcl() {
  _copyExclMode = false;
  _copyExclPts  = null;
  canvas.style.cursor = 'default';
  draw();
}

function toggleBufferVis() {
  showBuffer = !showBuffer;
  const btn = document.getElementById('bufferVisBtn');
  if (btn) {
    btn.classList.toggle('active', showBuffer);
    btn.title = showBuffer ? 'Nascondi buffer distanza (B)' : 'Mostra buffer distanza ostacoli (B)';
  }
  draw();
}


// ── js/ui/widgets-tech.js ──
// ── js/ui/widgets-tech.js — tech object widget logic ──
// Extracted from ui.js in AP-16b3. Contains tech-object lifecycle,
// selection, rotation helpers, size updates, and tech sidebar/card UI
// used by the S5 technical objects workflow.
// Calling surface unchanged — all symbols remain available through
// bundle-scope globals.
'use strict';

// ── Oggetti tecnici ───────────────────────────────────────────────────────────

function startTechObject(type) {
  _techMode = type;
  mode = 'tech';
  canvas.style.cursor = 'crosshair';
  deselectTechObject();
  DOM.techSizeRow.style.display = 'block';
  DOM.techPlacingInfo.style.display = 'block';
  DOM.techBuffer.value = TECH_DEFAULT_BUFFER[type] || 0;
  Object.keys(TECH_LABELS).forEach(t => {
    const b = document.getElementById('techBtn_'+t);
    if (b) b.style.background = t === type ? 'var(--accent)' : '';
    if (b) b.style.color = t === type ? '#fff' : '';
  });
}

function cancelTechMode() {
  _techMode = null;
  mode = 'none';
  canvas.style.cursor = 'default';
  DOM.techSizeRow.style.display = 'none';
  DOM.techPlacingInfo.style.display = 'none';
  Object.keys(TECH_LABELS).forEach(t => {
    const b = document.getElementById('techBtn_'+t);
    if (b) { b.style.background = ''; b.style.color = ''; }
  });
}

function placeTechObject(worldPt) {
  const sizem = parseFloat(DOM.techSize.value) || 0.5;
  const sizePx = sizem * scale;
  snapshot();
  invalidateLayoutCache();
  // AP-17e: route write through store.
  globalThis.setStoreSlice('technicalObjects', technicalObjects.concat([{
    type: _techMode,
    x: worldPt.x, y: worldPt.y,
    sizePx: sizePx, sizem: sizem,
    bufferM: parseFloat(DOM.techBuffer.value) || 0,
    label: TECH_LABELS[_techMode],
    ang: 0,
    solarAngleDeg: _techMode === 'chimney' ? 30 : undefined
  }]));
  updateTechList();
  if (panels.length > 0) _relayout(); else draw();
  selectTechObject(technicalObjects.length - 1);
}

function delTechObject(i) {
  snapshot();
  invalidateLayoutCache();
  // AP-17e: route write through store.
  globalThis.setStoreSlice('technicalObjects', technicalObjects.filter((_, idx) => idx !== i));
  if (_selectedTechIdx === i) deselectTechObject();
  else if (_selectedTechIdx > i) _selectedTechIdx--;
  updateTechList();
  if (panels.length > 0) _relayout(); else draw();
}

function selectTechObject(i) {
  const obj = technicalObjects[i];
  if (!obj) return;
  _selectedTechIdx = i;
  const deg = Math.round((obj.ang||0) * 180 / Math.PI);
  DOM.techRot.value = deg;
  DOM.techRotVal.textContent = deg;
  DOM.techRotRow.style.display = 'block';
  DOM.techSize.value = obj.sizem || 0.5;
  DOM.techBuffer.value = obj.bufferM || 0;
  DOM.techSizeRow.style.display = 'block';
  if (obj.type === 'chimney') {
    if (DOM.techHeightRow) DOM.techHeightRow.style.display = 'block';
    if (DOM.techHeight)    DOM.techHeight.value = (obj.heightM || 1.5).toFixed(1);
  } else {
    if (DOM.techHeightRow) DOM.techHeightRow.style.display = 'none';
  }
}

function deselectTechObject() {
  _selectedTechIdx = -1;
  DOM.techRotRow.style.display = 'none';
  if (!_techMode) DOM.techSizeRow.style.display = 'none';
  if (DOM.techHeightRow) DOM.techHeightRow.style.display = 'none';
}

function rotateSkylight(deg) {
  DOM.techRotVal.textContent = deg;
  if (_selectedTechIdx < 0 || _selectedTechIdx >= technicalObjects.length) return;
  const obj = technicalObjects[_selectedTechIdx];
  obj.ang = deg * Math.PI / 180;
  invalidateLayoutCache();
  draw();
}

function _techRotHandlePos(obj) {
  const r = obj.sizePx / 2 * CONFIG.TECH_HANDLE_RATIO;
  const a = (obj.ang || 0) - Math.PI / 2;
  return { x: obj.x + r * Math.cos(a), y: obj.y + r * Math.sin(a) };
}

function _hitTestRotHandle(p, obj) {
  const h = _techRotHandlePos(obj);
  const hitR = Math.max(12 / z, obj.sizePx * 0.25);
  return Math.hypot(p.x - h.x, p.y - h.y) < hitR;
}

function updateSelectedTechSize() {
  if (_selectedTechIdx < 0 || _selectedTechIdx >= technicalObjects.length) return;
  const newSize = parseFloat(DOM.techSize.value);
  const newBuf  = parseFloat(DOM.techBuffer.value);
  const sizeOk = !isNaN(newSize) && newSize > 0;
  const bufOk  = !isNaN(newBuf)  && newBuf  >= 0;
  if (!sizeOk && !bufOk) return;
  snapshot();
  const obj = technicalObjects[_selectedTechIdx];
  if (sizeOk) { obj.sizem = newSize; obj.sizePx = newSize * scale; }
  if (bufOk)  { obj.bufferM = newBuf; }
  invalidateLayoutCache();
  updateAreaLists();
  if (panels.length > 0) _relayout(); else draw();
}

function updateTechList() { updateAreaLists(); }

function updateTechCardField(idx, field, rawVal) {
  const obj = technicalObjects[idx]; if (!obj) return;
  const val = parseFloat(rawVal); if (isNaN(val)) return;
  if (field==='size'   && val<=0) return;
  if (field==='buffer' && val<0)  return;
  if (field==='height' && val<=0) return;
  if (field==='solarAngle' && (val<5||val>89)) return;
  if (field==='size')        { obj.sizem=val; obj.sizePx=val*scale; invalidateLayoutCache(); }
  if (field==='sizeH')       { obj.sizeHm=val; obj.sizeHPx=val*scale; invalidateLayoutCache(); }
  if (field==='buffer')      { obj.bufferM=val; invalidateLayoutCache(); }
  if (field==='height')      { obj.heightM=val; invalidateLayoutCache(); }
  if (field==='solarAngle')  { obj.solarAngleDeg=val; invalidateLayoutCache(); }
  if (field==='rot')         { obj.ang=val*Math.PI/180; invalidateLayoutCache(); }
  draw();
}

function commitTechCardField(idx, field, rawVal) {
  snapshot();
  updateTechCardField(idx, field, rawVal);
  if (panels.length > 0) _relayout();
}

function _buildTechCard(obj, i) {
  const lc  = TECH_LIST_COLORS[obj.type] || '#aaa';
  const deg = Math.round((obj.ang||0)*180/Math.PI);
  const IS  = 'pointer-events:auto;width:58px;font-size:var(--fs-sm);padding:3px 6px;text-align:center;' +
              'border:1px solid var(--border-default);border-radius:4px;' +
              'background:var(--bg-input);color:var(--text-primary);box-sizing:border-box;';
  const lbl = (t) => `<span style="font-size:var(--fs-xs);font-weight:600;color:var(--text-secondary);margin-right:2px;">${t}</span>`;
  const ni  = (fld,val,min,max,step,xs) => {
    xs = xs || '';
    return `<input type="number" value="${val}" min="${min}" max="${max}" step="${step}"
      style="${IS}${xs}" oninput="updateTechCardField(${i},'${fld}',this.value)"
      onchange="commitTechCardField(${i},'${fld}',this.value)">`;
  };

  let fields = '';
  if (obj.type === 'skylight') {
    fields =
      lbl('L m') + ni('size',  obj.sizem.toFixed(1), 0.1, 10, 0.1) + ' ' +
      lbl('H m') + ni('sizeH', (obj.sizeHm||obj.sizem).toFixed(1), 0.1, 10, 0.1) +
      `<div style="display:flex;align-items:center;gap:5px;flex:1;min-width:80px;margin-left:4px;">
        <input type="range" min="0" max="179" value="${deg}" step="1"
          style="pointer-events:auto;flex:1;accent-color:var(--accent);cursor:pointer;"
          oninput="document.getElementById('tcr${i}').textContent=this.value;technicalObjects[${i}].ang=this.value*Math.PI/180;invalidateLayoutCache();draw();"
          onchange="snapshot();updateAreaLists();">
        <span id="tcr${i}" style="font-size:var(--fs-xs);color:var(--text-secondary);min-width:26px;">${deg}°</span>
      </div>`;
  } else if (obj.type === 'chimney') {
    fields = lbl('⌀ m') + ni('size', obj.sizem.toFixed(1), 0.1, 10, 0.1) + ' ' +
             lbl('h m')  + ni('height', (obj.heightM||1.5).toFixed(1), 0.1, 20, 0.1) + ' ' +
             lbl('el °') + ni('solarAngle', (obj.solarAngleDeg||30).toFixed(0), 10, 45, 1, 'width:44px;');
  } else {
    fields = lbl('⌀ m') + ni('size', obj.sizem.toFixed(1), 0.1, 10, 0.1);
  }

  return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">
    <span style="width:8px;height:8px;border-radius:50%;background:${lc};flex-shrink:0;"></span>
    <span style="font-size:var(--fs-sm);font-weight:600;color:${lc};min-width:72px;">${obj.label}</span>
    <div style="display:flex;align-items:center;gap:4px;flex:1;flex-wrap:wrap;">${fields}</div>
    <button class="delete-btn" style="pointer-events:auto;flex-shrink:0;" onclick="delTechObject(${i})">x</button>
  </div>`;
}

function _rotateExclusionTo(idx, targetDeg) {
  const area = exclusionAreas[idx];
  if (!area) return;
  const currentDeg = area._sliderAngle || 0;
  const delta = targetDeg - currentDeg;
  area._sliderAngle = targetDeg;
  const rad = delta * Math.PI / 180;
  const cx = area.points.reduce((s,p)=>s+p.x,0)/area.points.length;
  const cy = area.points.reduce((s,p)=>s+p.y,0)/area.points.length;
  const cos=Math.cos(rad),sin=Math.sin(rad);
  area.points = area.points.map(p=>{
    const dx=p.x-cx,dy=p.y-cy;
    return{x:cx+dx*cos-dy*sin, y:cy+dx*sin+dy*cos};
  });
  invalidateLayoutCache();
  if (panels.length > 0) _relayout(); else draw();
}

// ── toggleMoveMode / _updateToolbarGroups ─────────────────────────────────────


// ── js/ui/dialogs.js ──
// ── js/ui/dialogs.js — modals + distance input + toolbar mode toggles ──
// Extracted from ui.js in AP-16c1. Contains the manual-distance input
// dialog, the move-mode toggle, the toolbar group updater, and the
// panel-count modal. Calling surface unchanged — all symbols remain
// available through bundle-scope globals.
'use strict';

function openDistInput() {
  if (mode !== 'area' || curPts.length === 0 || scale <= 1) return;
  _distInputOpen = true;
  const inp = DOM.distInput;
  const val = DOM.distInputVal;
  val.value = '';
  const r = canvas.getBoundingClientRect();
  const sx = (mpos.x * z + r.width/2  + ox) + r.left;
  const sy = (mpos.y * z + r.height/2 + oy) + r.top;
  inp.style.left = (sx + 16) + 'px';
  inp.style.top  = (sy - 16) + 'px';
  inp.style.display = 'flex';
  setTimeout(() => val.focus(), 30);
}

function closeDistInput() {
  _distInputOpen = false;
  if (DOM.distInput) DOM.distInput.style.display = 'none';
  canvas.focus && canvas.focus();
}

function confirmDistInput() {
  const d = parseFloat(DOM.distInputVal.value);
  closeDistInput();
  if (!d || d <= 0 || scale <= 1) return;
  const dPx = d * scale;
  const last = curPts[curPts.length - 1];
  const target = orthoPreviewPt || mpos;
  const dx = target.x - last.x, dy = target.y - last.y;
  const dist = Math.sqrt(dx*dx + dy*dy);
  let newPt;
  if (dist < 1e-6) {
    const ang = _orthoRefAngle !== null ? _orthoRefAngle : Math.PI/2;
    newPt = { x: last.x + dPx * Math.cos(ang), y: last.y + dPx * Math.sin(ang) };
  } else {
    newPt = { x: last.x + (dx/dist)*dPx, y: last.y + (dy/dist)*dPx };
  }
  const snapped = _applyMetricSnap(newPt);
  curPts.push(snapped);
  if (curPts.length === 2) {
    const adx = curPts[1].x - curPts[0].x, ady = curPts[1].y - curPts[0].y;
    _orthoRefAngle = Math.atan2(ady, adx);
  }
  orthoPreviewPt = null;
  draw();
}


function toggleMoveMode() {
  moveMode = !moveMode;
  const btn = DOM.moveBtn;
  if (moveMode) {
    btn.classList.add('active');
    canvas.style.cursor = 'pointer';
    selectedPanels = new Set();
  } else {
    btn.classList.remove('active');
    canvas.style.cursor = 'default';
    selectedPanels = new Set();
  }
  draw();
}

function _updateToolbarGroups() {
  if (!DOM.snapBtn) return;
  const hasPanels  = panels.length > 0;
  const calibrated = scale > 1;
  const grpEdit  = document.getElementById('tbgEdit');
  const grpSnap  = document.getElementById('tbgSnap');
  if (grpEdit) grpEdit.style.display = hasPanels ? 'inline-flex' : 'none';
  if (grpSnap) grpSnap.style.display = calibrated ? 'inline-flex' : 'none';
  if (snapEnabled) DOM.snapBtn.classList.add('snap-on');
  else             DOM.snapBtn.classList.remove('snap-on');
  if (DOM.editVerticesBtn) DOM.editVerticesBtn.style.display = calibrated ? 'inline-flex' : 'none';
  if (DOM.snapGridWrap) {
    DOM.snapGridWrap.style.display = calibrated ? 'flex' : 'none';
    const active = snapEnabled && metricSnapM > 0;
    DOM.snapGridWrap.style.background  = active ? 'var(--accent-light)' : '';
    DOM.snapGridWrap.style.borderColor = active ? 'var(--accent)' : '';
  }
}

// ── openPanel / closePanel / adjPanel / confirmPanel ──────────────────────────

function openPanel(m) {
  if (installableAreas.length === 0) { showToast("Definire almeno un'area installabile",'warn');return; }
  pMode = m;
  DOM.pmTitle.textContent = m === 'auto' ? 'Layout Ottimale' : 'Configurazione Manuale';
  DOM.pmInfo.textContent = '⏳ Calcolo massimo in corso…';
  DOM.panelModal.classList.add('visible');
  setTimeout(() => {
    const mWbase=Math.max(0.1,parseFloat(DOM.pw.value)||1);
    const mHbase=Math.max(0.1,parseFloat(DOM.pl.value)||1.7);
    let realMax = 0;
    installableAreas.forEach((area, areaIdx) => {
      const fn = _isConcavePolygon(area.points) ? layoutConcaveArea : _layoutBestOrientation;
      realMax += filterIsolatedPanels(fn(area, areaIdx, mWbase, mHbase, 999999)).length;
    });
    const inp = DOM.panelNum;
    const info = DOM.pmInfo;
    if (m === 'auto') {
      inp.value = realMax; inp.max = realMax;
      info.innerHTML = `Massimo possibile: <strong>${realMax}</strong> moduli<br><span style="color:var(--text-tertiary);font-size:var(--fs-xs);font-family:var(--font-main);">Riduci il numero se vuoi un layout parziale</span>`;
    } else {
      const prev = parseInt(inp.value) || realMax;
      inp.value = Math.min(prev, realMax); inp.max = realMax;
      info.innerHTML = `Massimo disponibile: <strong>${realMax}</strong> moduli<br><span style="color:var(--text-tertiary);font-size:var(--fs-xs);font-family:var(--font-main);">Inserisci da 1 a ${realMax}</span>`;
    }
  }, 30);
}

function closePanel() {
  DOM.panelModal.classList.remove('visible');
  pMode = null;
}

function adjPanel(d) {
  const inp = DOM.panelNum;
  const max = parseInt(inp.max) || 9999;
  let v = parseInt(inp.value) + d;
  inp.value = Math.max(1, Math.min(max, v));
  const info = DOM.pmInfo;
  const cur = parseInt(inp.value);
  const pct = max > 0 ? Math.round(cur/max*100) : 0;
  info.innerHTML = `Massimo disponibile: <strong>${max}</strong> moduli<br><span style="color:var(--text-tertiary);font-size:var(--fs-xs);font-family:var(--font-main);">Selezionati: ${cur} (${pct}% del massimo)</span>`;
}

function confirmPanel() {
  const cnt = parseInt(DOM.panelNum.value);
  const prevStrings = strings.length;
  closePanel();
  snapshot();
  engineeringLayout(cnt);
  if (prevStrings > 0) genStrings(prevStrings);
  enable('s7'); enable('s8'); enable('s9');
  updateStats();
  if(DOM.deletePanelsBtn) DOM.deletePanelsBtn.style.display='block';
  _updateToolbarGroups();
  calcCables();
}

// ── toggleSnap / toggleOrtho ──────────────────────────────────────────────────


// ── js/ui/events-area.js ──
// ── js/ui/events-area.js — Area drawing / calibration / exposure flow ──
// Extracted from js/ui.js (AP-16c2). Pure cut-paste: no behavior changes.
// Loaded by build/bundle.js before js/ui.js; shares globals via script-scope.

'use strict';

// ── setMetricSnap ─────────────────────────────────────────────────────────────

function setMetricSnap(val) {
  metricSnapM = Math.max(0, parseFloat(val) || 0);
  const wrap = DOM.snapGridWrap;
  if (wrap) {
    const active = snapEnabled && metricSnapM > 0;
    wrap.style.background   = active ? 'var(--accent-light)' : '';
    wrap.style.borderColor  = active ? 'var(--accent)' : '';
  }
  requestDraw();
}

// ── toggleVertexEdit / _findNearestVertex ─────────────────────────────────────

function toggleVertexEdit() {
  vertexEditMode = !vertexEditMode;
  const btn = DOM.editVerticesBtn;
  if (vertexEditMode) {
    btn.classList.add('active');
    if (mode === 'area') { mode = 'none'; DOM.areaBtn.classList.remove('active'); }
    canvas.style.cursor = 'crosshair';
  } else {
    btn.classList.remove('active');
    _vtxDragging = false; _vtxAreaIdx = -1; _vtxIdx = -1; _vtxHoverArea = null;
    canvas.style.cursor = 'default';
  }
  draw();
}

function _findNearestVertex(p) {
  const HIT_R = 14 / z;
  let best = null, bestD2 = HIT_R * HIT_R;
  const check = (pts, type, areaIdx) => {
    pts.forEach((vp, vi) => {
      const d2 = (p.x - vp.x)**2 + (p.y - vp.y)**2;
      if (d2 < bestD2) { bestD2 = d2; best = { type, areaIdx, vtxIdx: vi }; }
    });
  };
  installableAreas.forEach((a, i) => check(a.points, 'installable', i));
  exclusionAreas.forEach((a, i) => check(a.points, 'exclusion', i));
  return best;
}

// ── Calibrazione e aree ───────────────────────────────────────────────────────

function startCal() {
  mode = 'cal';
  calPts = [];
  DOM.calBtn.classList.add('active');
  DOM.calStatus.textContent = 'Click primo punto';
  canvas.style.cursor = 'none';
}

function startArea(type) {
  mode = 'area';
  curAreaType = type;
  curPts = [];
  _orthoRefAngle = null;
  orthoPreviewPt = null;
  if (type === 'installable') {
    DOM.areaBtn.classList.add('active');
  } else {
    DOM.exclusionBtn.classList.add('active');
  }
  canvas.style.cursor = 'none';
  draw();
}

// ── handleClick ───────────────────────────────────────────────────────────────

function handleClick(e) {
  if (!img) return;
  const p = getPoint(e);

  // ── Modalità incolla area non installabile ────────────────────
  if (_copyExclMode && _copyExclPts) {
    snapshot();
    // AP-17d: route write through store.
    globalThis.setStoreSlice('exclusionAreas', exclusionAreas.concat([{
      points: _copyExclPts.map(pt=>({x:p.x+pt.x, y:p.y+pt.y})),
      type: 'exclusion'
    }]));
    invalidateLayoutCache();
    _copyExclMode = false;
    _copyExclPts  = null;
    canvas.style.cursor = 'default';
    updateAreaLists();
    if (panels.length > 0) _relayout(); else draw();
    showToast('Ostacolo incollato', 'success', 1800);
    return;
  }

  // ── Modalità freccia esposizione ──────────────────────────────
  if (_expArrowMode) {
    if (!_expArrowStart) {
      _expArrowStart = p;
      requestDraw();
    } else {
      const dx = p.x - _expArrowStart.x;
      const dy = p.y - _expArrowStart.y;
      if (Math.sqrt(dx*dx + dy*dy) > 5 / z) {
        const ang = Math.atan2(dy, dx);
        let geo = ((ang * 180/Math.PI + 90) % 360 + 360) % 360;
        const dirs = ['N','NE','E','SE','S','SW','W','NW'];
        const exp = dirs[Math.round(geo / 45) % 8];
        snapshot();
        installableAreas[_expArrowAreaIdx].exposure = exp;
        updateAreaLists();
      }
      _expArrowMode = false;
      _expArrowStart = null;
      _expArrowEnd = null;
      _expArrowAreaIdx = -1;
      canvas.style.cursor = 'default';
      draw();
    }
    return;
  }

  if (mode === 'tech') {
    placeTechObject(p);
    cancelTechMode();
    return;
  }
  if (mode === 'cal') {
    calPts.push(p);
    if (calPts.length === 1) {
      DOM.calStatus.textContent = 'Click secondo punto';
    } else if (calPts.length === 2) {
      completeCal();
    }
    draw();
  } else if (mode === 'area') {
    if (justDoubleClicked) return;
    const rawClickPt = orthoPreviewPt || p;
    const clickPt = _applyMetricSnap(rawClickPt);
    if (curPts.length >= 3) {
      const fp = curPts[0];
      const screenDist = Math.sqrt((clickPt.x - fp.x)**2 + (clickPt.y - fp.y)**2) * z;
      if (screenDist < 15) { completeArea(); return; }
    }
    curPts.push({x: clickPt.x, y: clickPt.y});
    if (curPts.length === 2) {
      const dx = curPts[1].x - curPts[0].x;
      const dy = curPts[1].y - curPts[0].y;
      _orthoRefAngle = Math.atan2(dy, dx);
    }
    draw();
  } else if (mode === 'none' && moveMode) {
    // Check if clicked on a skylight tech object
    const clickRadius = 20 / z;
    const techHit = technicalObjects.findIndex(obj =>
      obj.type === 'skylight' &&
      Math.hypot(p.x - obj.x, p.y - obj.y) < Math.max(obj.sizePx/2 + clickRadius, clickRadius)
    );
    if (techHit >= 0) {
      selectTechObject(techHit);
      draw();
      return;
    }
    if (_selectedTechIdx >= 0) {
      deselectTechObject();
    }
    const panelIdx = findPanelAtPoint(p);
    if (paintMode && panelIdx >= 0) {
      snapshot();
      paintPanelToString(panelIdx);
      return;
    }
    if (panelIdx >= 0) {
      if (e.shiftKey) {
        const areaIdx = panels[panelIdx].areaIdx;
        selectedPanels = new Set();
        panels.forEach((pan, idx) => { if (pan.areaIdx === areaIdx) selectedPanels.add(idx); });
      } else if (e.ctrlKey || e.metaKey) {
        if (selectedPanels.has(panelIdx)) selectedPanels.delete(panelIdx);
        else selectedPanels.add(panelIdx);
      } else {
        selectedPanels = new Set([panelIdx]);
      }
      draw();
    } else {
      selectedPanels = new Set();
      draw();
    }
  }
}

function dblclick(e) {
  if (mode === 'area' && curPts.length >= 3) {
    e.preventDefault();
    justDoubleClicked = true;
    setTimeout(() => { justDoubleClicked = false; }, 400);
    completeArea();
  }
}

function closeAreaAsRectangle() {
  if (curPts.length < 2) return;
  const p0 = curPts[0], p1 = curPts[1];
  const dx = p1.x - p0.x, dy = p1.y - p0.y;
  const len = Math.sqrt(dx*dx + dy*dy);
  if (len < 1) return;
  const ux = dx/len, uy = dy/len, vx = -uy, vy = ux;
  const mpV = (mpos.x - p0.x)*vx + (mpos.y - p0.y)*vy;
  let minV, maxV;
  if (curPts.length === 2) {
    minV = Math.min(0, mpV); maxV = Math.max(0, mpV);
    if (Math.abs(maxV - minV) < 5) maxV = minV + 50;
  } else {
    minV = Infinity; maxV = -Infinity;
    curPts.forEach(pt => {
      const pv = (pt.x - p0.x)*vx + (pt.y - p0.y)*vy;
      if (pv < minV) minV = pv;
      if (pv > maxV) maxV = pv;
    });
    if (mpV < minV) minV = mpV;
    if (mpV > maxV) maxV = mpV;
  }
  curPts = [
    {x: p0.x + 0*ux + minV*vx, y: p0.y + 0*uy + minV*vy},
    {x: p0.x + len*ux + minV*vx, y: p0.y + len*uy + minV*vy},
    {x: p0.x + len*ux + maxV*vx, y: p0.y + len*uy + maxV*vy},
    {x: p0.x + 0*ux + maxV*vx, y: p0.y + 0*uy + maxV*vy}
  ];
  completeArea();
}

function completeCal() {
  const p1 = calPts[0], p2 = calPts[1];
  const pd = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  const rd = parseFloat(DOM.dist.value);
  if (!rd || rd <= 0) {
    showToast('Distanza non valida — inserire un valore > 0','warn');
    calPts = [];
    DOM.calStatus.textContent = 'Errore: distanza non valida. Riprova.';
    draw(); return;
  }
  if (pd < 10) {
    showToast('Punti troppo vicini — riprova su distanza maggiore','warn');
    calPts = [];
    DOM.calStatus.textContent = 'Punti troppo vicini. Riprova.';
    draw(); return;
  }
  scale = pd / rd;
  invalidateLayoutCache();
  mode = 'none';
  canvas.style.cursor = 'default';
  DOM.calBtn.classList.remove('active');
  DOM.calStatus.textContent = ` ${scale.toFixed(1)} px/m (${rd} m → ${pd.toFixed(0)} px)`;
  DOM.calStatus.classList.add('success');
  enable('s3'); enable('s4'); enable('s5'); enable('s6');
  _updateToolbarGroups();
  if (installableAreas.length > 0) _scheduleAreaPreview();
  draw();
}

function completeArea() {
  const newArea = {
    points: [...curPts], type: curAreaType, orientation: 'auto',
    staggerEnabled: false, staggerOffset: 50,
    walkwaysEnabled: false, walkwayInterval: 3, walkwayWidth: 80, walkwayDir: 'row'
  };
  snapshot();
  invalidateLayoutCache();
  if (curAreaType === 'installable') {
    newArea.exposure = computeAreaExposure(newArea.points);
    // AP-17d: route write through store.
    globalThis.setStoreSlice('installableAreas', installableAreas.concat([newArea]));
    curPts = []; _orthoRefAngle = null; orthoPreviewPt = null;
    mode = 'none'; curAreaType = null;
    DOM.areaBtn.classList.remove('active');
    if(DOM.hint) DOM.hint.style.display = 'none';
    updateAreaLists(); draw();
    const areaIdx = installableAreas.length - 1;
    _expArrowMode    = true;
    _expArrowAreaIdx = areaIdx;
    _expArrowStart   = null;
    _expArrowEnd     = null;
    canvas.style.cursor = 'crosshair';
    _scheduleAreaPreview();
    requestDraw();
  } else {
    // AP-17d: route write through store.
    globalThis.setStoreSlice('exclusionAreas', exclusionAreas.concat([newArea]));
    curPts = []; _orthoRefAngle = null; orthoPreviewPt = null;
    mode = 'none'; curAreaType = null;
    DOM.exclusionBtn.classList.remove('active');
    if(DOM.hint) DOM.hint.style.display = 'none';
    updateAreaLists();
    if (panels.length > 0) _relayout(); else draw();
  }
}

function startExpArrow(areaIdx) {
  if (!installableAreas[areaIdx]) return;
  _expArrowMode    = true;
  _expArrowAreaIdx = areaIdx;
  _expArrowStart   = null;
  _expArrowEnd     = null;
  canvas.style.cursor = 'crosshair';
  requestDraw();
}

function computeAreaExposure(points) {
  if (!points || points.length < 2) return 'S';
  let bL=0, bA=0;
  for (let i=0; i<points.length; i++) {
    const j=(i+1)%points.length, dx=points[j].x-points[i].x, dy=points[j].y-points[i].y;
    const l=Math.sqrt(dx*dx+dy*dy);
    if (l>bL) { bL=l; bA=Math.atan2(dy,dx); }
  }
  const toDeg = a => (((-a*180/Math.PI)%360)+360)%360;
  const d1=toDeg(bA+Math.PI/2), d2=toDeg(bA-Math.PI/2);
  const diff = d => Math.min(Math.abs(d-180), 360-Math.abs(d-180));
  const best = diff(d1)<=diff(d2) ? d1 : d2;
  return ['N','NE','E','SE','S','SW','W','NW'][Math.round(best/45)%8];
}

function setAreaOrientation(areaIdx, orient) {
  if (!installableAreas[areaIdx]) return;
  installableAreas[areaIdx].orientation = orient;
  installableAreas[areaIdx].maxPanels = null;
  updateAreaLists();
  _scheduleAreaPreview();
  if (panels.length > 0) {
    snapshot();
    const mWbase=Math.max(0.1,parseFloat(DOM.pw.value)||1);
    const mHbase=Math.max(0.1,parseFloat(DOM.pl.value)||1.7);
    const area = installableAreas[areaIdx];
    area.orientation = orient; // aggiorna prima di chiamare il layout
    const fn = _isConcavePolygon(area.points) ? layoutConcaveArea : _layoutBestOrientation;
    const newPanels = filterIsolatedPanels(fn(area, areaIdx, mWbase, mHbase, 999999));
    // AP-17f: combined filter+append commit through store.
    globalThis.setStoreSlice('panels', panels.filter(p => p.areaIdx !== areaIdx).concat(newPanels));
    if (strings.length > 0) {
      showToast('Orientamento cambiato. Rigenera le stringhe se necessario.', 'warn', 4000);
    }
    updateStats();
    draw();
  }
}



function toggleOrtho() {
  orthoEnabled = !orthoEnabled;
  const btn = DOM.orthoBtn;
  if (!btn) return;
  if (orthoEnabled) {
    btn.classList.add('snap-on');
    btn.title = 'Ortogonalità attiva — clicca per disattivare (O)';
  } else {
    btn.classList.remove('snap-on');
    btn.title = 'Ortogonalità disattiva — clicca per attivare (O)';
  }
  orthoPreviewPt = null;
  requestDraw();
}

function toggleSnap() {
  snapEnabled = !snapEnabled;
  const btn = DOM.snapBtn;
  if (!btn) return;
  if (snapEnabled) {
    btn.classList.add('snap-on');
    btn.title = 'Snap magnetico attivo (S)';
    if (metricSnapM <= 0 && DOM.snapGridInput) {
      DOM.snapGridInput.value = 1;
      setMetricSnap(1);
    }
  } else {
    btn.classList.remove('snap-on');
    btn.title = 'Snap magnetico disattivo (S)';
  }
  requestDraw();
}


// ── js/ui/events-canvas.js ──
// ── js/ui/events-canvas.js — canvas, pointer, tooltip, and touch handlers ──
// Extracted from ui.js in AP-16c3. Contains right-click, mouse drag/move/up,
// panel tooltip helpers, and touch gesture handlers used by the renderer
// interaction layer.
// Calling surface unchanged — all symbols remain available through
// bundle-scope globals.
'use strict';

// ── Mouse handlers ────────────────────────────────────────────────────────────

function handleRightClick(e) {
  e.preventDefault();
  if (moveMode||mode!=='none') return;
  const p=getPoint(e);
  const panelIdx=findPanelAtPoint(p);
  if (panelIdx>=0) {
    snapshot();
    // AP-17f: route write through store.
    globalThis.setStoreSlice('panels', panels.filter((_, i) => i !== panelIdx));
    hoveredPanel=-1;
    selectedPanels=new Set([...selectedPanels].filter(i=>i!==panelIdx).map(i=>i>panelIdx?i-1:i));
    updateAreaLists(); updateStats();
    if (panels.length===0) {
      strings=[]; updateStringList(); updateLegend();
      if(DOM.deletePanelsBtn) DOM.deletePanelsBtn.style.display='none';
      _updateToolbarGroups();
    } else if (strings.length>0) {
      genStrings(strings.length);
    }
    draw();
  }
}

function handleMouseDown(e) {
  if (e.button===1) {
    e.preventDefault(); middleDrag=true; mx=e.clientX; my=e.clientY;
    canvas.style.cursor='grabbing'; return;
  }
  const p=getPoint(e);

  if (vertexEditMode && mode === 'none' && e.button === 0) {
    const hit = _findNearestVertex(p);
    if (hit) {
      snapshot();
      _vtxDragging  = true;
      _vtxAreaType  = hit.type;
      _vtxAreaIdx   = hit.areaIdx;
      _vtxIdx       = hit.vtxIdx;
      const arr = hit.type === 'installable' ? installableAreas : exclusionAreas;
      _vtxDragStartPt = { ...arr[hit.areaIdx].points[hit.vtxIdx] };
      canvas.style.cursor = 'grabbing';
      return;
    }
  }
  if (moveMode && mode==='none' && _selectedTechIdx >= 0) {
    const obj = technicalObjects[_selectedTechIdx];
    if (obj && _hitTestRotHandle(p, obj)) {
      _isDraggingTechRot = true;
      _techRotDragStartAng = Math.atan2(p.y - obj.y, p.x - obj.x);
      canvas.style.cursor = 'crosshair';
      return;
    }
  }
  if (moveMode&&mode==='none'&&selectedPanels.size>0) {
    const panelIdx=findPanelAtPoint(p);
    if (panelIdx>=0&&selectedPanels.has(panelIdx)) {
      isDraggingPanels=true; dragStartPoint=p;
      panelsStartPos=[...selectedPanels].map(idx=>{
        const pan=panels[idx];
        return{localU:pan.localU!=null?pan.localU:pan.x,localV:pan.localV!=null?pan.localV:pan.y};
      });
      canvas.style.cursor='move'; return;
    }
  }
  if (mode==='none'&&!moveMode) {
    drag=true; mx=e.clientX; my=e.clientY; canvas.style.cursor='grabbing';
  }
}

function _updatePanelTooltip(e, panelIdx) {
  const tt = document.getElementById('panelTooltip');
  if (!tt) return;
  if (panelIdx >= 0) {
    const pan = panels[panelIdx];
    if (pan && pan.strId) {
      const str = strings.find(s => s.id === pan.strId);
      let html = `<b>${pan.strId}</b>`;
      if (str) {
        if (str.invLabel) html += ` &mdash; ${str.invLabel}`;
        if (str.mpptIdx !== undefined) html += `, MPPT ${str.mpptIdx + 1}`;
      }
      tt.innerHTML = html;
      tt.style.left = (e.clientX + 14) + 'px';
      tt.style.top  = (e.clientY - 36) + 'px';
      tt.style.display = 'block';
      return;
    }
  }
  tt.style.display = 'none';
}

function _hidePanelTooltip() {
  const tt = document.getElementById('panelTooltip');
  if (tt) tt.style.display = 'none';
}

function handleMouseMove(e) {
  const p=getPoint(e);
  mpos=p;

  if (_vtxDragging && _vtxAreaIdx >= 0 && _vtxIdx >= 0) {
    const snapped = _applyMetricSnap(p);
    const arr = _vtxAreaType === 'installable' ? installableAreas : exclusionAreas;
    if (arr[_vtxAreaIdx]) {
      arr[_vtxAreaIdx].points[_vtxIdx] = { ...snapped };
      invalidateLayoutCache();
      requestDraw();
    }
    return;
  }
  if (vertexEditMode && mode === 'none' && !_vtxDragging) {
    const hit = _findNearestVertex(p);
    const prev = _vtxHoverArea;
    _vtxHoverArea = hit;
    canvas.style.cursor = hit ? 'grab' : 'crosshair';
    if (hit || prev) requestDraw();
  }
  if (_copyExclMode) { requestDraw(); return; }

  if (_expArrowMode) {
    _expArrowEnd = p;
    requestDraw();
    return;
  }
  if (middleDrag) {
    ox+=e.clientX-mx; oy+=e.clientY-my; mx=e.clientX; my=e.clientY;
    requestDraw(); return;
  }
  if (_isDraggingTechRot && _selectedTechIdx >= 0) {
    const obj = technicalObjects[_selectedTechIdx];
    if (obj) {
      const currentAng = Math.atan2(p.y - obj.y, p.x - obj.x);
      let newAng = (obj.ang||0) + (currentAng - _techRotDragStartAng);
      newAng = ((newAng % Math.PI) + Math.PI) % Math.PI;
      obj.ang = newAng;
      _techRotDragStartAng = currentAng;
      const deg = Math.round(newAng * 180 / Math.PI);
      DOM.techRot.value = deg;
      DOM.techRotVal.textContent = deg;
      invalidateLayoutCache();
      requestDraw();
    }
    return;
  }
  if (moveMode && mode==='none' && _selectedTechIdx >= 0) {
    const obj = technicalObjects[_selectedTechIdx];
    if (obj && _hitTestRotHandle(p, obj)) {
      canvas.style.cursor = 'grab';
      requestDraw(); return;
    }
  }
  if (mode==='cal') { requestDraw(); return; }
  if (mode==='tech') { requestDraw(); return; }
  if (mode==='area') {
    const snapRadius=8/z;
    let snapped=null;

    if (_pdfSnapEnabled && _pdfSnapPoints.length > 0) {
      const pdfSnap = _nearestPdfSnap(p, 12);
      if (pdfSnap) snapped = pdfSnap;
    }

    if (!snapped) {
      for (const a of installableAreas) {
        for (const vp of a.points) {
          const d2=(p.x-vp.x)**2+(p.y-vp.y)**2;
          if (d2<snapRadius*snapRadius){snapped=vp;break;}
        }
        if (snapped) break;
      }
      if (!snapped) {
        for (const a of exclusionAreas) {
          for (const vp of a.points) {
            const d2=(p.x-vp.x)**2+(p.y-vp.y)**2;
            if (d2<snapRadius*snapRadius){snapped=vp;break;}
          }
          if (snapped) break;
        }
      }
    }
    let orthoSnapped=null;
    if (!snapped && orthoEnabled && curPts.length>=1) {
      const last=curPts[curPts.length-1];
      const SNAP_RAD=5*Math.PI/180;
      const MIN_DIST=20/z;
      const vx=p.x-last.x,vy=p.y-last.y;
      const dist=Math.sqrt(vx*vx+vy*vy);
      if (dist>MIN_DIST) {
        const mouseAng=Math.atan2(vy,vx);
        const baseAng=_orthoRefAngle!==null?_orthoRefAngle:0;
        const candidates=[baseAng,baseAng+Math.PI/2,baseAng+Math.PI,baseAng-Math.PI/2];
        let bestDiff=Infinity,bestCand=null;
        candidates.forEach(cand=>{
          let diff=Math.abs(mouseAng-cand);
          while(diff>Math.PI)diff=Math.abs(diff-2*Math.PI);
          if(diff<bestDiff){bestDiff=diff;bestCand=cand;}
        });
        if(bestDiff<SNAP_RAD)orthoSnapped={x:last.x+dist*Math.cos(bestCand),y:last.y+dist*Math.sin(bestCand)};
      }
    }
    orthoPreviewPt = _applyMetricSnap(snapped || (orthoEnabled ? orthoSnapped : null) || p);
    if (curPts.length===0){requestDraw();return;}
    const last=curPts[curPts.length-1];
    const h=DOM.hint;
    if (h) {
      h.style.display='block'; h.style.left=(e.clientX+15)+'px'; h.style.top=(e.clientY-30)+'px';
      const d=Math.sqrt((orthoPreviewPt.x-last.x)**2+(orthoPreviewPt.y-last.y)**2)/scale;
      const snapLabel=orthoSnapped&&!snapped?' ⊾':(snapped?' ⊕':'');
      const gridLabel = metricSnapM > 0 ? ` ⊞${metricSnapM}m` : '';
      h.textContent = `${curPts.length}pt · ${d.toFixed(2)} m${snapLabel}${gridLabel}`;
    }
    requestDraw(); return;
  } else {
    if(DOM.hint) DOM.hint.style.display='none';
  }
  if (isDraggingPanels&&dragStartPoint) {
    const dx=p.x-dragStartPoint.x, dy=p.y-dragStartPoint.y;
    const _spArr=[...selectedPanels];
    snapPreviewPos = null;

    _spArr.forEach((panelIdx,i)=>{
      const panel=panels[panelIdx];
      const area=installableAreas[panel.areaIdx];
      if (!area) return;
      const cosA=Math.cos(-panel.ang),sinA=Math.sin(-panel.ang);
      const dU=dx*cosA-dy*sinA, dV=dx*sinA+dy*cosA;
      const rawU=panelsStartPos[i].localU+dU, rawV=panelsStartPos[i].localV+dV;

      let newU=rawU, newV=rawV;
      let isSnapping = false;
      if (snapEnabled && _spArr.length===1) {
        const snapResult = snapPanelToGridLive(panel, rawU, rawV);
        if (snapResult) {
          const snapDist = Math.sqrt((snapResult.localU-rawU)**2+(snapResult.localV-rawV)**2);
          const MAGNETIC_RADIUS = Math.max(panel.w, panel.h) * 0.65;
          if (snapDist < MAGNETIC_RADIUS) {
            const t = 1 - (snapDist / MAGNETIC_RADIUS);
            const ease = t * t * (3 - 2*t);
            newU = rawU + (snapResult.localU - rawU) * ease;
            newV = rawV + (snapResult.localV - rawV) * ease;
            if (ease > 0.85) { newU=snapResult.localU; newV=snapResult.localV; isSnapping=true; }
            snapPreviewPos = {
              localU: snapResult.localU, localV: snapResult.localV,
              ang: panel.ang, w: panel.w, h: panel.h,
              axisUx: panel.axisUx, axisUy: panel.axisUy,
              axisVx: panel.axisVx, axisVy: panel.axisVy,
              snapped: isSnapping
            };
          }
        }
      }

      const ux=panel.axisUx,uy=panel.axisUy,vx=panel.axisVx,vy=panel.axisVy,w=panel.w,h=panel.h;
      const corners=[
        {x:newU*ux+newV*vx,y:newU*uy+newV*vy},
        {x:(newU+w)*ux+newV*vx,y:(newU+w)*uy+newV*vy},
        {x:(newU+w)*ux+(newV+h)*vx,y:(newU+w)*uy+(newV+h)*vy},
        {x:newU*ux+(newV+h)*vx,y:newU*uy+(newV+h)*vy},
      ];
      if (corners.every(c=>pointInPolygon(c,area.points))){
        panel.localU=newU; panel.localV=newV;
        const origin=localToGlobal(newU,newV,panel.ang);
        panel.x=origin.x; panel.y=origin.y;
      }
    });
    requestDraw(); return;
  }
  if (mode==='none'&&!drag&&panels.length>0) {
    const panelIdx=findPanelAtPoint(p);
    if (panelIdx!==hoveredPanel) {
      hoveredPanel=panelIdx;
      canvas.style.cursor=(moveMode&&panelIdx>=0)?'pointer':'default';
      requestDraw();
    }
    if (paintMode && e.buttons === 1 && panelIdx >= 0) {
      paintPanelToString(panelIdx);
    }
    _updatePanelTooltip(e, panelIdx);
  } else {
    _hidePanelTooltip();
  }
  if (drag) {
    ox+=e.clientX-mx; oy+=e.clientY-my; mx=e.clientX; my=e.clientY;
    requestDraw();
  }
}

function handleMouseUp(e) {
  snapPreviewPos = null;
  if (_vtxDragging) {
    _vtxDragging = false;
    _vtxAreaIdx = -1; _vtxIdx = -1; _vtxAreaType = null; _vtxDragStartPt = null;
    canvas.style.cursor = vertexEditMode ? 'crosshair' : 'default';
    invalidateLayoutCache();
    if (panels.length > 0) _relayout();
    else draw();
    _scheduleAreaPreview();
    return;
  }
  if (_isDraggingTechRot) {
    _isDraggingTechRot = false;
    canvas.style.cursor = 'default';
    snapshot();
    updateAreaLists();
    draw();
    return;
  }
  if (isDraggingPanels) {
    if (snapEnabled) {
      [...selectedPanels].forEach(idx=>{
        const panel=panels[idx];
        if (!panel) return;
        const snap=snapPanelToGrid(panel);
        if (snap) {
          panel.localU=snap.localU; panel.localV=snap.localV;
          const origin=localToGlobal(snap.localU,snap.localV,panel.ang);
          panel.x=origin.x; panel.y=origin.y;
        }
      });
    }
    snapshot(); draw();
  }
  if (e.button===1){middleDrag=false;canvas.style.cursor=mode==='area'?'none':(moveMode?'pointer':'default');return;}
  drag=false; isDraggingPanels=false; dragStartPoint=null; panelsStartPos=[];
  if (mode==='none') canvas.style.cursor=moveMode?'pointer':'default';
}

// ── Touch support ─────────────────────────────────────────────────────────────

function _touchMidpoint(t1,t2){
  return { x:(t1.clientX+t2.clientX)/2, y:(t1.clientY+t2.clientY)/2 };
}
function _touchDist(t1,t2){
  const dx=t1.clientX-t2.clientX, dy=t1.clientY-t2.clientY;
  return Math.sqrt(dx*dx+dy*dy);
}

function handleTouchStart(e) {
  e.preventDefault();
  _touches = Array.from(e.touches);

  if (_touches.length === 1) {
    const t = _touches[0];
    mx = t.clientX; my = t.clientY;
    _touchStartPos = { x: t.clientX, y: t.clientY };

    if (mode === 'area' && curPts.length >= 3) {
      const now = Date.now();
      if (now - _lastTapTime < 400) {
        clearTimeout(_tapTimer);
        justDoubleClicked = true;
        setTimeout(() => { justDoubleClicked = false; }, 400);
        completeArea();
        _lastTapTime = 0;
        return;
      }
      _lastTapTime = now;
    }

    if (vertexEditMode && mode === 'none') {
      const r = canvas.getBoundingClientRect();
      const tp = {
        x: (t.clientX - r.left - r.width/2  - ox) / z,
        y: (t.clientY - r.top  - r.height/2 - oy) / z
      };
      const hit = _findNearestVertex(tp);
      if (hit) {
        snapshot();
        _vtxDragging = true;
        _vtxAreaType = hit.type;
        _vtxAreaIdx  = hit.areaIdx;
        _vtxIdx      = hit.vtxIdx;
        return;
      }
    }

    if (mode === 'none') drag = true;

  } else if (_touches.length === 2) {
    drag = false;
    _lastPinchD = _touchDist(_touches[0], _touches[1]);
    _lastTouchC = _touchMidpoint(_touches[0], _touches[1]);
  }
}

function handleTouchMove(e) {
  e.preventDefault();
  const touches = Array.from(e.touches);

  if (_vtxDragging && touches.length === 1) {
    const r = canvas.getBoundingClientRect();
    const tp = {
      x: (touches[0].clientX - r.left - r.width/2  - ox) / z,
      y: (touches[0].clientY - r.top  - r.height/2 - oy) / z
    };
    const snapped = _applyMetricSnap(tp);
    const arr = _vtxAreaType === 'installable' ? installableAreas : exclusionAreas;
    if (arr[_vtxAreaIdx]) arr[_vtxAreaIdx].points[_vtxIdx] = { ...snapped };
    invalidateLayoutCache();
    requestDraw();
    return;
  }

  if (touches.length === 1) {
    const t = touches[0];

    if (drag) {
      ox += t.clientX - mx;
      oy += t.clientY - my;
      requestDraw();
    } else if (mode === 'area' || mode === 'cal' || _expArrowMode || mode === 'tech') {
      handleMouseMove({
        clientX: t.clientX,
        clientY: t.clientY,
        shiftKey: false, ctrlKey: false, metaKey: false,
        preventDefault: () => {}
      });
    }

    mx = t.clientX;
    my = t.clientY;

  } else if (touches.length === 2) {
    const d   = _touchDist(touches[0], touches[1]);
    const mid = _touchMidpoint(touches[0], touches[1]);
    const r   = canvas.getBoundingClientRect();

    if (_lastPinchD && _lastPinchD > 0) {
      const rawFactor = d / _lastPinchD;
      const cx_ = mid.x - r.left - r.width  / 2;
      const cy_ = mid.y - r.top  - r.height / 2;
      const newZ = Math.max(CONFIG.ZOOM_MIN, Math.min(z * rawFactor, CONFIG.ZOOM_MAX));
      const realFactor = newZ / z;
      ox = cx_ - (cx_ - ox) * realFactor;
      oy = cy_ - (cy_ - oy) * realFactor;
      z  = newZ;
    }
    if (_lastTouchC) {
      ox += mid.x - _lastTouchC.x;
      oy += mid.y - _lastTouchC.y;
    }
    _lastPinchD = d;
    _lastTouchC = mid;
    requestDraw();
  }
}

function handleTouchEnd(e) {
  e.preventDefault();

  if (_vtxDragging) {
    _vtxDragging = false; _vtxAreaIdx = -1; _vtxIdx = -1;
    _vtxAreaType = null; _vtxDragStartPt = null;
    canvas.style.cursor = vertexEditMode ? 'crosshair' : 'default';
    invalidateLayoutCache();
    if (panels.length > 0) _relayout(); else draw();
    _scheduleAreaPreview();
    drag = false; _lastPinchD = null; _lastTouchC = null;
    _touches = []; _touchStartPos = null;
    return;
  }

  const wasTap = _touches.length === 1 && _touchStartPos && (
    Math.hypot(
      _touches[0].clientX - _touchStartPos.x,
      _touches[0].clientY - _touchStartPos.y
    ) < 12
  );

  if (wasTap) {
    const t = _touches[0];
    const fakeEvt = {
      clientX: t.clientX, clientY: t.clientY,
      shiftKey: false, ctrlKey: false, metaKey: false, button: 0
    };

    if (mode === 'area' || mode === 'cal' || _expArrowMode) {
      handleClick(fakeEvt);
    } else if (mode === 'none' || mode === 'tech') {
      handleClick(fakeEvt);
    }
  }

  drag = false; _lastPinchD = null; _lastTouchC = null;
  _touches = []; _touchStartPos = null;
}


// ── js/ui/init.js ──
// ── js/ui/init.js — UI bootstrap and layout orchestration ──
// Extracted from ui.js in AP-16c4. Contains app initialization,
// orientation/layout relayout helpers, layout option refresh wiring,
// stagger/walkway toggles, and mobile panel orchestration.
// Calling surface unchanged — all symbols remain available through
// bundle-scope globals.
'use strict';


// ── Inizializzazione ──────────────────────────────────────────────────────────

function init() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  initDOMCache();
  resize();
  window.addEventListener('resize', resize);

  // Restore saved theme
  try {
    const savedTheme = localStorage.getItem('sdp_theme');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch(e) { /* localStorage may be disabled */ }
  canvas.addEventListener('click', handleClick);
  canvas.addEventListener('dblclick', dblclick);
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousedown', e => { if(e.button===1) e.preventDefault(); }, {passive:false});
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('wheel', wheel, {passive: false});
  canvas.addEventListener('contextmenu', handleRightClick);
  canvas.addEventListener('mouseleave', _hidePanelTooltip);
  canvas.addEventListener('touchstart', handleTouchStart, {passive: false});
  canvas.addEventListener('touchmove', handleTouchMove, {passive: false});
  canvas.addEventListener('touchend', handleTouchEnd, {passive: false});

  // ── Drag & drop file sul canvas ──
  const canvasContainer = canvas.parentElement;
  canvasContainer.addEventListener('dragover', function(e) {
    e.preventDefault(); e.stopPropagation();
    canvasContainer.classList.add('drag-over');
  });
  canvasContainer.addEventListener('dragleave', function(e) {
    e.preventDefault();
    canvasContainer.classList.remove('drag-over');
  });
  canvasContainer.addEventListener('drop', function(e) {
    e.preventDefault(); e.stopPropagation();
    canvasContainer.classList.remove('drag-over');
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (!file) return;
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (isPDF) { loadPDF(file); } else { loadImageFile(file); }
  });

  // ── Input distanza manuale: Enter = conferma, Escape = chiudi ──
  setTimeout(() => {
    const dv = DOM.distInputVal;
    if (dv) {
      dv.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); confirmDistInput(); }
        if (e.key === 'Escape') { e.preventDefault(); closeDistInput(); }
        e.stopPropagation();
      });
    }
  }, 100);

  // Chiudi dropdown stringhe se si clicca fuori
  document.addEventListener('click', function(e) {
    const dd = DOM.stringsDropdown;
    if (dd && !dd.contains(e.target)) {
      const panel = DOM.stringsDropPanel;
      const btn = DOM.stringsDropBtn;
      if (panel) panel.classList.remove('visible');
      if (btn) btn.classList.remove('open');
    }
  });

  document.addEventListener('keydown', function(e) {
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedPanels.size > 0 && mode === 'none') {
      e.preventDefault();
      deleteSelectedPanels();
    }
    // ── Backspace durante disegno area: annulla ultimo vertice ──
    if ((e.key === 'Backspace' || e.key === 'Delete') && mode === 'area' && curPts.length > 0) {
      e.preventDefault();
      curPts.pop();
      if (curPts.length < 2) _orthoRefAngle = null;
      orthoPreviewPt = null;
      draw();
      return;
    }
    // ── V: attiva/disattiva vertex edit ──
    if ((e.key === 'v' || e.key === 'V') && mode === 'none' && !moveMode &&
        document.activeElement.tagName !== 'INPUT' && installableAreas.length > 0) {
      e.preventDefault();
      toggleVertexEdit();
    }
    if (e.key === 'Escape' && mode === 'cal') {
      calPts = [];
      mode = 'none';
      canvas.style.cursor = 'default';
      DOM.calBtn.classList.remove('active');
      DOM.calStatus.textContent = 'Calibrazione annullata';
      draw();
    }
    if (e.key === 'Escape' && _expArrowMode) {
      _expArrowMode = false; _expArrowStart = null; _expArrowEnd = null; _expArrowAreaIdx = -1;
      canvas.style.cursor = 'default'; draw(); return;
    }
    if (e.key === 'Escape' && _copyExclMode) { _cancelCopyExcl(); return; }
    if (e.key === 'Escape' && _distInputOpen) { closeDistInput(); return; }
    if (e.key === 'Escape' && mode === 'area') {
      curPts = [];
      _orthoRefAngle = null;
      orthoPreviewPt = null;
      mode = 'none';
      curAreaType = null;
      canvas.style.cursor = 'default';
      DOM.areaBtn.classList.remove('active');
      DOM.exclusionBtn.classList.remove('active');
      draw();
    }
    if (e.key === 'Escape' && mode === 'tech') {
      cancelTechMode();
      draw();
    }
    if (e.key === 'Escape' && vertexEditMode) {
      vertexEditMode = false;
      _vtxDragging = false; _vtxAreaIdx = -1; _vtxIdx = -1; _vtxHoverArea = null;
      if (DOM.editVerticesBtn) DOM.editVerticesBtn.classList.remove('active');
      canvas.style.cursor = 'default';
      draw();
    }
    if ((e.key === 'r' || e.key === 'R') && mode === 'area' && curPts.length >= 2) {
      e.preventDefault();
      closeAreaAsRectangle();
    }
    if (e.key === 'Enter' && mode === 'area' && curPts.length >= 3) {
      e.preventDefault();
      completeArea();
    }
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') { e.preventDefault(); undo(); }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); redo(); }
    if ((e.key === 's' || e.key === 'S') && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); toggleSnap(); }
    if ((e.key === 'o' || e.key === 'O') && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); toggleOrtho(); }
    if ((e.key === 'b' || e.key === 'B') && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); toggleBufferVis(); }
    // D: apri input distanza manuale (solo in modalità area con almeno 1 punto)
    if ((e.key === 'd' || e.key === 'D') && mode === 'area' && curPts.length >= 1
        && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault(); openDistInput();
    }
  });

  if (loadSavedState()) {
    if (installableAreas.length > 0) {
      ['s2','s3','s4','s5','s6'].forEach(id => enable(id));
      if (DOM.editVerticesBtn) DOM.editVerticesBtn.style.display = 'block';
      if (DOM.snapGridWrap)    DOM.snapGridWrap.style.display    = 'inline-flex';
    }
    if (panels.length > 0) {
      enable('s7'); enable('s8'); enable('s9');
      if(DOM.deletePanelsBtn) DOM.deletePanelsBtn.style.display='block';
      _updateToolbarGroups();
    }
    if (scale > 1) {
      DOM.calStatus.textContent = ' (da sessione precedente)';
      DOM.calStatus.classList.add('success');
    }
    setOrientation(panelOrientation, true);
    DOM.welcome.innerHTML = '<h2>Solar Designer Pro</h2><p>Progetto precedente ripristinato.<br>Ricarica l\'immagine per continuare.</p>';
  }
  draw();
  calcCables();
  snapshot();
  // Inizializza libreria moduli
  renderModuleLib();
  // Popola dropdown preset moduli (da MODULE_PRESETS in state.js)
  if (typeof _populateModulePresets === 'function') _populateModulePresets();
  // Calcola preview pannelli per aree già caricate
  if (installableAreas.length > 0) _scheduleAreaPreview();
  // Inizializza miglioramenti UX: status bar, dashboard, shortcuts, minimap
  if (typeof _initEnhancements === 'function') _initEnhancements();
  // AP-11 / T2.6.1 — app version + norms revision in UI footer.
  const _verEl = document.getElementById('pfooterVersion');
  if (_verEl) _verEl.textContent = 'v' + SDPROJ_APP_VERSION + ' · ' + SDPROJ_NORMS_REVISION;
}

// ── setOrientation ────────────────────────────────────────────────────────────

function setOrientation(orient, preserveAreas) {
  panelOrientation = orient;
  if (!preserveAreas) {
    installableAreas.forEach(a => { a.orientation = orient; a.maxPanels = null; });
  }
  invalidateLayoutCache();
  updateAreaLists();
  _scheduleAreaPreview();
  if (panels.length > 0 && !preserveAreas) {
    snapshot();
    _relayout();
  }
}

// ── _relayout / _relayoutDebounced ────────────────────────────────────────────

function _relayout() {
  if (panels.length === 0) return;
  invalidateLayoutCache();
  const prevCount = panels.length;
  const prevStrings = strings.length;
  engineeringLayout(prevCount);
  if (prevStrings > 0) genStrings(prevStrings);
  updateStats(); draw();
}

function _relayoutDebounced(delay) {
  delay = delay || 250;
  clearTimeout(_relayoutTimer);
  _relayoutTimer = setTimeout(() => { _relayout(); }, delay);
}

// ── toggleStagger / toggleWalkways ────────────────────────────────────────────

function toggleStagger() {
  const on = DOM.enableStagger.checked;
  DOM.staggerSettings.style.display = on ? 'block' : 'none';
  if (panels.length > 0) { snapshot(); _relayout(); }
}

function toggleWalkways() {
  walkwaysEnabled = DOM.enableWalkways.checked;
  DOM.walkwaySettings.style.display = walkwaysEnabled ? 'block' : 'none';
  invalidateLayoutCache();
  if (panels.length > 0) { snapshot(); _relayout(); }
  else draw();
}


function updateLayoutOptionsList() {
  const el = document.getElementById('layoutOptionsList');
  if (!el) return;
  if (installableAreas.length === 0) {
    el.innerHTML = '<div class="info">Nessuna area definita — torna allo step 4.</div>';
    return;
  }
  el.innerHTML = installableAreas.map((_, i) => _buildLayoutOptionsCard(i)).join('');
}






// ── Mobile panel toggle ───────────────────────────────────────────────────────

function toggleMobPanel() {
  const sidebar = document.querySelector('.sidebar');
  const canvas_container = document.querySelector('.canvas-container');
  const btn = document.getElementById('mob-panel-toggle');
  const expanded = sidebar.classList.toggle('mob-expanded');
  canvas_container.classList.toggle('mob-expanded', expanded);
  btn.textContent = expanded ? '✕' : '☰';
}

function _updateMobToggle() {
  const btn = document.getElementById('mob-panel-toggle');
  if (!btn) return;
  const isPhonePortrait = window.innerWidth <= 480 && window.innerHeight > window.innerWidth;
  btn.style.display = isPhonePortrait ? 'flex' : 'none';
}


// ── js/ui.js ──
// ── ui.js — Bootstrap shell (AP-16c4) ──
// All UI logic has been decomposed into js/ui/*.js modules and is loaded
// via build/bundle.js. This file now only wires the window.onload hook to
// init(), which lives in js/ui/init.js.

'use strict';

window.onload = init;

