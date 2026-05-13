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
  // AP-17h — UI flag slices (flat primitives, individual bridges below).
  mode: 'none',
  curAreaType: null,
  moveMode: false,
  vertexEditMode: false,
  snapEnabled: true,
  orthoEnabled: true,
  walkwaysEnabled: false,
  _copyExclMode: false,
  // AP-17i — viewport slices (flat primitives, individual bridges below).
  z: 1,
  ox: 0,
  oy: 0,
  scale: 1,
  panelOrientation: 'auto'
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

// ── AP-17h+i — UI flag and viewport compatibility bridges ────────────────────
// Temporary AP-17h+i bridges. Each primitive slice is exposed as a global
// property: reads resolve to `_state[key]`, assignments (e.g. `mode = 'area'`,
// `snapEnabled = !snapEnabled`) route through `setStoreSlice(key, value)` so
// every write goes through the store. Defined in a single loop to keep the
// surface compact.
[
  'mode', 'curAreaType', 'moveMode', 'vertexEditMode',
  'snapEnabled', 'orthoEnabled', 'walkwaysEnabled', '_copyExclMode',
  'z', 'ox', 'oy', 'scale', 'panelOrientation'
].forEach(function (key) {
  try {
    Object.defineProperty(globalThis, key, {
      configurable: true,
      enumerable: true,
      get() { return _state[key]; },
      set(v) { setStoreSlice(key, v); }
    });
  } catch (_e) { /* ignore */ }
});
