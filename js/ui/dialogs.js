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
