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


function updateLayoutOptionsList() {
  const el = document.getElementById('layoutOptionsList');
  if (!el) return;
  if (installableAreas.length === 0) {
    el.innerHTML = '<div class="info">Nessuna area definita — torna allo step 4.</div>';
    return;
  }
  el.innerHTML = installableAreas.map((_, i) => _buildLayoutOptionsCard(i)).join('');
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
