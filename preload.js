// ── preload.js — Electron renderer ↔ main bridge ────────────────────────
// AP-12 / PR-31. Exposes a narrow, safe API to the renderer for crash
// logging. Runs in the preload context with contextIsolation: true, so
// the renderer never gets direct ipcRenderer access.
//
// Public surface:
//   window.appBridge.logError(payload)
//     payload: { source, message, file?, lineno?, colno?, stack? }
//     - source defaults to 'renderer.error' on the main side if missing
//     - all fields are coerced/clipped before write (main-side)
//
// PR-32 (log rotation) will not change this preload contract.

'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('appBridge', {
  logError(payload) {
    try {
      // Plain object only — preserves structured-clone semantics across IPC.
      const safe = {
        source:  payload && typeof payload.source  === 'string' ? payload.source  : 'renderer.error',
        message: payload && payload.message != null ? String(payload.message) : '',
        file:    payload && typeof payload.file    === 'string' ? payload.file    : '',
        lineno:  payload && Number.isFinite(payload.lineno) ? payload.lineno : null,
        colno:   payload && Number.isFinite(payload.colno)  ? payload.colno  : null,
        stack:   payload && typeof payload.stack   === 'string' ? payload.stack   : '',
      };
      ipcRenderer.send('log:write', safe);
    } catch (_) {
      // Logging path must never crash the renderer.
    }
  },
});
