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
