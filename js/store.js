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
  inverterList: null,
  installableAreas: null,
  exclusionAreas: null,
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
