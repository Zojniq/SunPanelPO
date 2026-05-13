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
  technicalObjects: null,
  panels: null,
  strings: null,
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
