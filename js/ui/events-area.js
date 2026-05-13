// ── js/ui/events-area.js — Area drawing / calibration / exposure flow ──
// Extracted from js/ui.js (AP-16c2). Pure cut-paste: no behavior changes.
// Loaded by build/bundle.js before js/ui.js; shares globals via script-scope.

'use strict';

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
