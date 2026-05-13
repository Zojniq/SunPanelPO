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
