// ── eslint.config.js — Sub-step A of AP-09 (safe rules only) ────────────────
// Flat config (ESLint 10+). Cross-file architecture is classic-script with a
// shared realm; the cross-script globals defined below are the canonical
// public namespace declaration for this codebase. Adding a new cross-script
// symbol → add it here AND to its declaring file.
//
// Sub-step A scope:
//   - safe correctness rules only
//   - no style rules, no 'use strict' insertion, no logic changes
//   - 'no-implicit-globals' deferred to Sub-step B

'use strict';

// ── Browser globals (manually curated — used in js/) ─────────────────────────
const browserGlobals = {
  // window / document / navigation
  window: 'readonly', document: 'readonly', navigator: 'readonly',
  location: 'readonly', screen: 'readonly', history: 'readonly',
  console: 'readonly', alert: 'readonly', confirm: 'readonly',
  prompt: 'readonly', localStorage: 'readonly', sessionStorage: 'readonly',
  TextEncoder: 'readonly', TextDecoder: 'readonly',
  // timers
  setTimeout: 'readonly', clearTimeout: 'readonly',
  setInterval: 'readonly', clearInterval: 'readonly',
  requestAnimationFrame: 'readonly', cancelAnimationFrame: 'readonly',
  queueMicrotask: 'readonly',
  // DOM constructors used in code
  Image: 'readonly', FileReader: 'readonly', FontFace: 'readonly',
  Blob: 'readonly', File: 'readonly', URL: 'readonly',
  URLSearchParams: 'readonly', FormData: 'readonly',
  Event: 'readonly', CustomEvent: 'readonly',
  KeyboardEvent: 'readonly', MouseEvent: 'readonly', TouchEvent: 'readonly',
  WheelEvent: 'readonly', DragEvent: 'readonly',
  HTMLElement: 'readonly', HTMLCanvasElement: 'readonly',
  HTMLInputElement: 'readonly', HTMLImageElement: 'readonly',
  Element: 'readonly', Node: 'readonly',
  DOMParser: 'readonly', XMLSerializer: 'readonly',
  Path2D: 'readonly', ImageData: 'readonly',
  // typed arrays & misc
  Float64Array: 'readonly', Float32Array: 'readonly', Int32Array: 'readonly',
  Uint8Array: 'readonly', Uint8ClampedArray: 'readonly',
  atob: 'readonly', btoa: 'readonly',
  fetch: 'readonly', AbortController: 'readonly',
  // host-injected by vendored libs / dual-script-tag pattern
  pdfjsLib: 'readonly',
  // dual-environment indicator used in sizing.js for CommonJS branch
  module: 'readonly',
};

// ── Cross-script namespace (this app) ────────────────────────────────────────
// One entry per cross-script symbol. 'writable' = at least one file assigns;
// 'readonly' = read-only consumers (no file should assign).
const sdpGlobals = {
  // Sizing namespace (declared in js/lib/sizing.js)
  SDPSizing: 'readonly',
  // Constants from js/config.js
  CONFIG: 'readonly',
  // Preset libraries (declared in data/*.data.js as `var`, so global)
  MODULE_PRESETS: 'readonly', INV_PRESETS: 'readonly',
  // Module library storage key (state.js)
  MODULE_LIB_KEY: 'readonly',
  // localStorage key alias (state.js)
  LS_KEY: 'readonly',
  // Cached subset (state.js)
  AREA_COLORS: 'readonly', EXP_LABELS: 'readonly', EXP_COLORS: 'readonly',
  TECH_LABELS: 'readonly', TECH_COLORS: 'readonly',
  TECH_LIST_COLORS: 'readonly', TECH_DEFAULT_BUFFER: 'readonly',
  engineeringColors: 'readonly',
  // Constant lower bound (state.js)
  MAX_HIST: 'readonly',
  // Singletons & rendering surface (state.js — mutated from many files)
  canvas: 'writable', ctx: 'writable', img: 'writable',
  DOM: 'writable',
  // Viewport
  scale: 'writable', z: 'writable', ox: 'writable', oy: 'writable',
  drag: 'writable', mx: 'writable', my: 'writable',
  // Modes
  mode: 'writable', middleDrag: 'writable',
  // Calibration
  calPts: 'writable',
  // Project data
  installableAreas: 'writable', exclusionAreas: 'writable',
  technicalObjects: 'writable', panels: 'writable', strings: 'writable',
  // Tech objects state
  _techMode: 'writable', _selectedTechIdx: 'writable',
  _isDraggingTechRot: 'writable', _techRotDragStartAng: 'writable',
  // Area drawing
  curPts: 'writable', curAreaType: 'writable',
  // Exposure arrow mode
  _expArrowMode: 'writable', _expArrowAreaIdx: 'writable',
  _expArrowStart: 'writable', _expArrowEnd: 'writable',
  // Mouse / interaction
  mpos: 'writable', pMode: 'writable',
  _orthoRefAngle: 'writable', _distInputOpen: 'writable',
  hoveredPanel: 'writable', paintMode: 'writable', paintStringIdx: 'writable',
  justDoubleClicked: 'writable', selectedPanels: 'writable',
  moveMode: 'writable', isDraggingPanels: 'writable',
  dragStartPoint: 'writable', panelsStartPos: 'writable',
  snapPreviewPos: 'writable',
  // String UI / paint
  editingStringIdx: 'writable', selectedColor: 'writable',
  // Layout options
  panelOrientation: 'writable', walkwaysEnabled: 'writable',
  snapEnabled: 'writable', orthoEnabled: 'writable',
  _copyExclMode: 'writable', _copyExclPts: 'writable',
  showBuffer: 'writable', stringsVisible: 'writable',
  orthoPreviewPt: 'writable', _highlightInvIdx: 'writable',
  // Vertex edit
  vertexEditMode: 'writable', _vtxDragging: 'writable',
  _vtxAreaType: 'writable', _vtxAreaIdx: 'writable', _vtxIdx: 'writable',
  _vtxHoverArea: 'writable', _vtxDragStartPt: 'writable',
  // Snap / grid
  metricSnapM: 'writable',
  // Inverter list + preset key
  _inverterList: 'writable', _modulePresetKey: 'writable',
  // Persistence / undo stacks
  _saveTimer: 'writable', _undoStack: 'writable', _redoStack: 'writable',
  // RAF flag
  _rafPending: 'writable',
  // Accordion state
  _areaAccOpen: 'writable', _exclAccOpen: 'writable',
  // PDF state
  _pdfDoc: 'writable', _pdfPage: 'writable', _pdfScale: 'writable',
  _pdfSnapPoints: 'writable', _pdfSnapEnabled: 'writable',
  // Touch state
  _touches: 'writable', _lastPinchD: 'writable', _lastTouchC: 'writable',
  _touchStartPos: 'writable', _lastTapTime: 'writable', _tapTimer: 'writable',
  // Debounce timers
  _previewDebounceTimer: 'writable', _relayoutTimer: 'writable',
  // Pre-allocated scanline buffer
  _scanBuf: 'readonly',
  // Layout cache map
  _layoutCache: 'readonly',
  // SLD debounce (cables.js, post AP-06)
  _unifilareDebounceTimer: 'writable',
  // SLD BESS / hover transient state (cables.js)
  _bessTopology: 'writable',
  // Sizing aliases (declared in cables.js via destructure from SDPSizing)
  calcSection: 'readonly', calcSectionAC: 'readonly',
  calcVoltageDrop: 'readonly', getCableCapacity: 'readonly',
  // Grounding constant (cables.js)
  EARTH_ROD_D: 'readonly',
};

// ── Function names that cross file boundaries ───────────────────────────────
// Function declarations at script-scope go on the realm global; any file
// can reference them. The list below is the cross-file callable surface.
// Lighter than the var inventory because not every function is called
// across files — only the ones that are. Iterated empirically.
const sdpFunctions = {
  // ui.js
  init: 'readonly', toggleTheme: 'readonly', showToast: 'readonly',
  _sdpConfirm: 'readonly', _sdpPrompt: 'readonly',
  _forwardToCrashLog: 'readonly',
  initDOMCache: 'readonly', enable: 'readonly',
  setOrientation: 'readonly', _relayout: 'readonly', _relayoutDebounced: 'readonly',
  toggleStagger: 'readonly', toggleWalkways: 'readonly',
  _loadModuleLib: 'readonly', _saveModuleLib: 'readonly',
  toggleModuleLib: 'readonly', renderModuleLib: 'readonly',
  applyModule: 'readonly', saveModuleToLib: 'readonly', deleteModuleFromLib: 'readonly',
  setMetricSnap: 'readonly', toggleVertexEdit: 'readonly',
  _findNearestVertex: 'readonly',
  startCal: 'readonly', startArea: 'readonly',
  handleClick: 'readonly', dblclick: 'readonly',
  closeAreaAsRectangle: 'readonly', completeCal: 'readonly', completeArea: 'readonly',
  startExpArrow: 'readonly', computeAreaExposure: 'readonly',
  setAreaOrientation: 'readonly',
  toggleAreaAccordion: 'readonly', toggleExclusionAccordion: 'readonly',
  _buildWalkwayUI: 'readonly', _buildAreaHeader: 'readonly',
  _buildLayoutOptionsCard: 'readonly', updateLayoutOptionsList: 'readonly',
  _buildExclusionHeader: 'readonly', updateAreaLists: 'readonly',
  delInstallableArea: 'readonly', delExclusionArea: 'readonly',
  copyExclusionArea: 'readonly', _cancelCopyExcl: 'readonly',
  toggleBufferVis: 'readonly',
  startTechObject: 'readonly', cancelTechMode: 'readonly', placeTechObject: 'readonly',
  delTechObject: 'readonly', selectTechObject: 'readonly', deselectTechObject: 'readonly',
  rotateSkylight: 'readonly',
  _techRotHandlePos: 'readonly', _hitTestRotHandle: 'readonly',
  openDistInput: 'readonly', closeDistInput: 'readonly', confirmDistInput: 'readonly',
  updateSelectedTechSize: 'readonly',
  updateTechList: 'readonly', updateTechCardField: 'readonly',
  commitTechCardField: 'readonly', _buildTechCard: 'readonly',
  _rotateExclusionTo: 'readonly',
  toggleMoveMode: 'readonly', _updateToolbarGroups: 'readonly',
  openPanel: 'readonly', closePanel: 'readonly', adjPanel: 'readonly', confirmPanel: 'readonly',
  toggleOrtho: 'readonly', toggleSnap: 'readonly',
  handleRightClick: 'readonly', handleMouseDown: 'readonly',
  _updatePanelTooltip: 'readonly', _hidePanelTooltip: 'readonly',
  handleMouseMove: 'readonly', handleMouseUp: 'readonly',
  _touchMidpoint: 'readonly', _touchDist: 'readonly',
  handleTouchStart: 'readonly', handleTouchMove: 'readonly', handleTouchEnd: 'readonly',
  toggleMobPanel: 'readonly', _updateMobToggle: 'readonly',
  // canvas.js
  getPoint: 'readonly', getOrtho: 'readonly', resize: 'readonly',
  zoom: 'readonly', resetView: 'readonly', wheel: 'readonly',
  _pdfSnapToWorld: 'readonly', _nearestPdfSnap: 'readonly', _applyMetricSnap: 'readonly',
  transformPolygon: 'readonly', localToGlobal: 'readonly',
  polyAABB: 'readonly', pointInPolygon: 'readonly',
  distanceToSegment: 'readonly', _segsIntersect: 'readonly',
  scanlineX: 'readonly', _convexHull: 'readonly',
  _isSelfIntersecting: 'readonly', offsetPolygon: 'readonly', _isValidPoly: 'readonly',
  drawPanel: 'readonly', drawCalPoint: 'readonly', drawTechSymbol: 'readonly',
  draw: 'readonly',
  // panels.js
  polyArea: 'readonly', polyAreaCached: 'readonly',
  invalidateLayoutCache: 'readonly', readLayoutParams: 'readonly',
  _layoutCacheKey: 'readonly', techObjectToPolygon: 'readonly',
  _isConcavePolygon: 'readonly', _splitConcavePolygon: 'readonly',
  _decomposeConcave: 'readonly', _worldRectsOverlap: 'readonly',
  _occupiedConflict: 'readonly', _polyHash: 'readonly',
  _exactCountCached: 'readonly', _computeBestAngle: 'readonly',
  _panelWorldAABB: 'readonly', canPlacePanel: 'readonly',
  layoutSingleArea: 'readonly', filterIsolatedPanels: 'readonly',
  _layoutBestOrientation: 'readonly', _findBestEdgeAngle: 'readonly',
  layoutConcaveArea: 'readonly', engineeringLayout: 'readonly',
  _snapPanelToGridImpl: 'readonly', snapPanelToGrid: 'readonly',
  snapPanelToGridLive: 'readonly', findPanelAtPoint: 'readonly',
  deleteAllPanels: 'readonly', deleteSelectedPanels: 'readonly',
  _recomputeAreaWalkways: 'readonly', _relayoutArea: 'readonly',
  _refreshAreaMaxCapacity: 'readonly', addAreaPanel: 'readonly',
  removeAreaPanel: 'readonly', setAreaStagger: 'readonly',
  setAreaStaggerOffset: 'readonly', commitAreaStaggerOffset: 'readonly',
  setAreaWalkRowEnabled: 'readonly', setAreaWalkRowInterval: 'readonly',
  commitAreaWalkRowInterval: 'readonly', setAreaWalkRowWidth: 'readonly',
  // strings.js
  toggleStrConfig: 'readonly', closeString: 'readonly',
  adjString: 'readonly', adjPair: 'readonly',
  _getVmppTempCoeff: 'readonly', _getExpectedStringTotal: 'readonly',
  updateStringPreview: 'readonly', setTotalStrings: 'readonly',
  _countPhysicalMax: 'readonly', adjustPanelCount: 'readonly',
  addNewInstallableArea: 'readonly', _assignInverterMeta: 'readonly',
  setInverterFilter: 'readonly', _updateInvFilterSel: 'readonly',
  confirmString: 'readonly', genStrings: 'readonly',
  updateStringList: 'readonly', toggleStringsDropdown: 'readonly',
  openColorPicker: 'readonly', closeColorModal: 'readonly',
  deleteString: 'readonly', confirmColorChange: 'readonly',
  updateLegend: 'readonly', togglePaintMode: 'readonly',
  _updatePaintSelector: 'readonly', setPaintString: 'readonly',
  paintPanelToString: 'readonly', updateStats: 'readonly',
  toggleStringsVisible: 'readonly',
  // pdf.js
  loadFile: 'readonly', loadImageFile: 'readonly', loadPDF: 'readonly',
  _ensurePdfJs: 'readonly', _pdfProcessOps: 'readonly',
  togglePdfSnap: 'readonly', pdfPageNav: 'readonly',
  confirmPdfPage: 'readonly', closePdfModal: 'readonly',
  // export.js (note: salvaProgetto, saveProjectJSON, exportProj are `async function` decls)
  salvaProgetto: 'readonly', saveProjectJSON: 'readonly', exportProj: 'readonly',
  loadProjectJSON: 'readonly', resetAll: 'readonly', buildPDF: 'readonly',
  // storage.js
  saveState: 'readonly', _persistState: 'readonly', _buildFullState: 'readonly',
  loadSavedState: 'readonly', _getSnapshot: 'readonly', snapshot: 'readonly',
  _applySnapshot: 'readonly', undo: 'readonly', redo: 'readonly',
  _updateUndoUI: 'readonly', requestDraw: 'readonly',
  buildSdprojDocument: 'readonly', _setProjectCreatedAt: 'readonly',
  readPersistedProject: 'readonly',
  SDPROJ_APP_VERSION: 'readonly', SDPROJ_NORMS_REVISION: 'readonly',
  getEffectiveNormsRevision: 'readonly',
  // cables.js
  _getModuleVmppTempCoeff: 'readonly', _getProjectStrPerMpptMax: 'readonly',
  _hasMixedStrPerMppt: 'readonly', calcCables: 'readonly', syncCableState: 'readonly',
  _getInverterTotals: 'readonly', addInverterToList: 'readonly',
  removeInverterFromList: 'readonly', updateInverterListUI: 'readonly',
  adjInvQty: 'readonly', _syncHiddenInvFields: 'readonly',
  onNumInvChange: 'readonly', applyInvPreset: 'readonly',
  _populateModulePresets: 'readonly', applyModulePreset: 'readonly',
  _applyInvPreset_unused: 'readonly', updateInvValidation: 'readonly',
  openUnifilare: 'readonly', closeUnifilare: 'readonly',
  _renderVerifiche: 'readonly', renderUnifilare: 'readonly',
  renderUnifilareDebounced: 'readonly',
  exportUnifilare: 'readonly', exportGSE: 'readonly',
  toggleBessMode: 'readonly',
  _sldHoverStr: 'readonly', _sldClearHover: 'readonly', _showSldPopup: 'readonly',
  addRevisione: 'readonly', toggleSldMode: 'readonly',
  _svgQR: 'readonly', _renderMTSection: 'readonly',
  // enhancements.js
  updateStatusBar: 'readonly', _checkStringValidity: 'readonly',
  toggleDashboard: 'readonly', updateDashboard: 'readonly',
  _setDash: 'readonly', _initShortcuts: 'readonly',
  openShortcutsModal: 'readonly', closeShortcutsModal: 'readonly',
  toggleMinimap: 'readonly', renderMinimap: 'readonly',
  updateCanvasRuler: 'readonly', getAreaPreviewCount: 'readonly',
  _initEnhancements: 'readonly', _drawAreaPreviewOverlay: 'readonly',
  _scheduleAreaPreview: 'readonly',
};

const safeRules = {
  'no-undef':       'error',
  'no-redeclare':   ['error', { builtinGlobals: false }],
  'no-dupe-keys':   'error',
  'no-dupe-args':   'error',
  'no-unreachable': 'error',
  'no-empty':       'error',
  'prefer-const':   'error',
  'eqeqeq':         ['error', 'always', { null: 'ignore' }],
};

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'vendor/**',
      'dist/**',
      'assets/**',
      '*.log',
      'docs/reference/**',
    ],
  },
  {
    // Browser classic scripts: js/ and data/
    files: ['js/**/*.js', 'data/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        ...browserGlobals,
        ...sdpGlobals,
        ...sdpFunctions,
        globalThis: 'readonly',
      },
    },
    rules: {
      ...safeRules,
      // Disabled for cross-script architecture: state.js declares `let X`
      // that other files mutate. ESLint cannot see cross-file reassignments,
      // so `prefer-const` would auto-rewrite them to `const` and break the
      // app. Will be reconsidered after AP-17 (state store) or AP-14
      // (bundler) when module boundaries make reassignment local.
      'prefer-const': 'off',
    },
  },
  {
    // Electron main process + preload bridge (both Node-Electron context)
    files: ['main.js', 'preload.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        // Node + Electron globals
        require: 'readonly', module: 'readonly', exports: 'readonly',
        process: 'readonly', __dirname: 'readonly', __filename: 'readonly',
        Buffer: 'readonly', console: 'readonly',
        setTimeout: 'readonly', clearTimeout: 'readonly',
        setInterval: 'readonly', clearInterval: 'readonly',
        globalThis: 'readonly',
      },
    },
    rules: safeRules,
  },
  {
    // ES modules: vitest config + tests (already strict by default)
    files: ['vitest.config.js', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Node ESM/CJS hybrid context
        process: 'readonly', console: 'readonly',
        Buffer: 'readonly', globalThis: 'readonly',
        setTimeout: 'readonly', clearTimeout: 'readonly',
      },
    },
    rules: safeRules,
  },
];
