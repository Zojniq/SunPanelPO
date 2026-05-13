// ── js/ui/init.js — UI bootstrap and layout orchestration ──
// Extracted from ui.js in AP-16c4. Contains app initialization,
// orientation/layout relayout helpers, layout option refresh wiring,
// stagger/walkway toggles, and mobile panel orchestration.
// Calling surface unchanged — all symbols remain available through
// bundle-scope globals.
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
