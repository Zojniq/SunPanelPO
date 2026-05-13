// ── ui.js — Interfaccia utente, eventi, inizializzazione ──

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
    exclusionAreas.push({
      points: _copyExclPts.map(pt=>({x:p.x+pt.x, y:p.y+pt.y})),
      type: 'exclusion'
    });
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
    installableAreas.push(newArea);
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
    exclusionAreas.push(newArea);
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
    panels = panels.filter(p => p.areaIdx !== areaIdx);
    const area = installableAreas[areaIdx];
    area.orientation = orient; // aggiorna prima di chiamare il layout
    const fn = _isConcavePolygon(area.points) ? layoutConcaveArea : _layoutBestOrientation;
    const newPanels = filterIsolatedPanels(fn(area, areaIdx, mWbase, mHbase, 999999));
    panels.push(...newPanels);
    if (strings.length > 0) {
      showToast('Orientamento cambiato. Rigenera le stringhe se necessario.', 'warn', 4000);
    }
    updateStats();
    draw();
  }
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

// ── Mouse handlers ────────────────────────────────────────────────────────────

function handleRightClick(e) {
  e.preventDefault();
  if (moveMode||mode!=='none') return;
  const p=getPoint(e);
  const panelIdx=findPanelAtPoint(p);
  if (panelIdx>=0) {
    snapshot();
    panels.splice(panelIdx,1);
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

// ── Avvio applicazione ────────────────────────────────────────────────────────

window.onload = init;
