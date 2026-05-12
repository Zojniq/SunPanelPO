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
let installableAreas = [];   // [{points, type, orientation}]
let exclusionAreas   = [];   // [{points}]
/** Ostacoli puntuali: {type, x, y, sizePx, sizem, bufferM, label, ang}
 *  type: 'chimney' | 'antenna' | 'hvac' | 'skylight' | 'exhaust' */
let technicalObjects = [];
let panels  = [];            // pannelli posizionati
let strings = [];            // stringhe inverter [{id, name, color, panels[]}]

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
let _inverterList = [];

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
const DOM = {};

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
