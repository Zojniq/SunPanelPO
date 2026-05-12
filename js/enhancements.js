// ── enhancements.js — Feedback real-time, Dashboard, Shortcuts, Canvas extras ──

'use strict';

// ═══════════════════════════════════════════════════
// 1. STATUS BAR — Semaforo progresso in tempo reale
// ═══════════════════════════════════════════════════

function updateStatusBar() {
  const stCal     = document.getElementById('stCal');
  const stArea    = document.getElementById('stArea');
  const stPanels  = document.getElementById('stPanels');
  const stStr     = document.getElementById('stStr');
  const stInv     = document.getElementById('stInv');
  const stCalTxt  = document.getElementById('stCalTxt');
  const stAreaTxt = document.getElementById('stAreaTxt');
  const stPanelsTxt = document.getElementById('stPanelsTxt');
  const stStrTxt  = document.getElementById('stStrTxt');
  const stInvTxt  = document.getElementById('stInvTxt');
  if (!stCal) return;

  // Scala
  if (scale > 1) {
    stCal.className = 'status-dot green';
    stCalTxt.textContent = (1/scale).toFixed(2) + ' m/px';
  } else {
    stCal.className = 'status-dot gray';
    stCalTxt.textContent = 'Scala';
  }

  // Aree
  if (installableAreas.length > 0) {
    stArea.className = 'status-dot green';
    stAreaTxt.textContent = installableAreas.length + ' area' + (installableAreas.length > 1 ? 'e' : '');
  } else {
    stArea.className = 'status-dot gray';
    stAreaTxt.textContent = 'Aree';
  }

  // Pannelli
  if (panels.length > 0) {
    stPanels.className = 'status-dot green';
    const kwp = (panels.length * parseFloat(DOM.pp.value) / 1000);
    stPanelsTxt.textContent = panels.length + ' mod. · ' + kwp.toFixed(1) + 'kW';
  } else if (installableAreas.length > 0) {
    stPanels.className = 'status-dot yellow';
    stPanelsTxt.textContent = 'Da generare';
  } else {
    stPanels.className = 'status-dot gray';
    stPanelsTxt.textContent = 'Moduli';
  }

  // Stringhe
  if (strings.length > 0) {
    const valid = _checkStringValidity();
    stStr.className = 'status-dot ' + (valid ? 'green' : 'yellow');
    stStrTxt.textContent = strings.length + ' str.';
  } else if (panels.length > 0) {
    stStr.className = 'status-dot yellow';
    stStrTxt.textContent = 'Da config.';
  } else {
    stStr.className = 'status-dot gray';
    stStrTxt.textContent = 'Stringhe';
  }

  // Inverter
  if (typeof _inverterList !== 'undefined' && _inverterList.length > 0) {
    const totPac = _inverterList.reduce((s,inv) => s + (inv.pac || 0) * (inv.qty || 1), 0);
    const kwp = panels.length * parseFloat(DOM.pp.value) / 1000;
    const dcAc = totPac > 0 ? kwp / totPac : 0;
    const ok = dcAc <= 1.33 && dcAc > 0;
    stInv.className = 'status-dot ' + (ok ? 'green' : dcAc > 0 ? 'yellow' : 'gray');
    stInvTxt.textContent = totPac.toFixed(1) + 'kW';
  } else {
    stInv.className = 'status-dot gray';
    stInvTxt.textContent = 'Inverter';
  }
}

/** Verifica rapida: stringhe con pannelli validi e inverter compatibile */
function _checkStringValidity() {
  if (strings.length === 0) return false;
  // Check: ogni stringa ha almeno un pannello
  return strings.every(s => s.panels && s.panels.length > 0);
}


// ═══════════════════════════════════════════════════
// 2. DASHBOARD RIEPILOGATIVA
// ═══════════════════════════════════════════════════

let _dashboardOpen = true;

function toggleDashboard() {
  _dashboardOpen = !_dashboardOpen;
  const body = document.getElementById('dashBody');
  const arrow = document.getElementById('dashArrow');
  if (body) body.classList.toggle('collapsed', !_dashboardOpen);
  if (arrow) arrow.textContent = _dashboardOpen ? '▾' : '▸';
}

function updateDashboard() {
  const panel = document.getElementById('dashboardPanel');
  if (!panel) return;

  const tot = panels.length;
  const pp = parseFloat(DOM.pp.value) || 0;
  const pw = parseFloat(DOM.pw.value) || 0;
  const pl = parseFloat(DOM.pl.value) || 0;
  const kwp = tot * pp / 1000;
  const area = tot * pw * pl;

  // Mostra dashboard solo se ci sono dati
  if (tot > 0 || (typeof _inverterList !== 'undefined' && _inverterList.length > 0)) {
    panel.classList.add('visible');
  } else {
    panel.classList.remove('visible');
    return;
  }

  // Potenza
  _setDash('dashKwp', kwp.toFixed(2) + ' kWp');
  // Moduli
  const modDesc = tot + ' x ' + pp.toFixed(0) + 'W';
  _setDash('dashModuli', modDesc);
  // Stringhe
  _setDash('dashStringhe', strings.length > 0 ?
    strings.length + ' x ' + (strings[0].panels ? strings[0].panels.length : '?') + ' mod.' : '—');
  // Superficie
  _setDash('dashArea', area.toFixed(1) + ' m\u00B2');

  // Inverter
  if (typeof _inverterList !== 'undefined' && _inverterList.length > 0) {
    const invDescs = _inverterList.map(inv =>
      (inv.qty > 1 ? inv.qty + 'x ' : '') + (inv.model || '?'));
    _setDash('dashInverter', invDescs.join(', '), null, 11);
  } else {
    _setDash('dashInverter', '—');
  }

  // DC/AC ratio
  const totPac = (typeof _inverterList !== 'undefined') ?
    _inverterList.reduce((s,inv) => s + (inv.pac||0) * (inv.qty||1), 0) : 0;
  if (totPac > 0) {
    const dcAc = kwp / totPac;
    const cls = dcAc <= 1.1 ? 'ok' : dcAc <= 1.33 ? 'warn' : 'err';
    _setDash('dashDcAc', dcAc.toFixed(2), cls);
  } else {
    _setDash('dashDcAc', '—');
  }

  // Voc @-10°C
  const voc = parseFloat((document.getElementById('moduleVoc') || {}).value) || 0;
  const tcoef = parseFloat((document.getElementById('moduleTcoefVoc') || {}).value) || -0.30;
  if (voc > 0 && strings.length > 0 && strings[0].panels) {
    const n = strings[0].panels.length;
    const kVoc = tcoef / 100;
    const vocCold = voc * (1 + kVoc * (-10 - 25));
    const vocStr = vocCold * n;
    const vocMax = (typeof _inverterList !== 'undefined' && _inverterList.length > 0) ?
      _inverterList[0].vocMax || 1000 : 1000;
    const cls = vocStr < vocMax * 0.9 ? 'ok' : vocStr < vocMax ? 'warn' : 'err';
    _setDash('dashVoc', vocStr.toFixed(0) + ' V', cls);
  } else {
    _setDash('dashVoc', '—');
  }

  // Cavo DC
  const cableRes = document.getElementById('cableResults');
  if (cableRes && cableRes.textContent.trim()) {
    const match = cableRes.textContent.match(/(\d+(?:\.\d+)?)\s*mm/);
    _setDash('dashCavoDc', match ? match[0] : '—');
  } else {
    _setDash('dashCavoDc', '—');
  }

  // Validazione complessiva
  const invVal = document.getElementById('invValidation');
  if (invVal && invVal.style.display !== 'none' && invVal.textContent.trim()) {
    const hasError = invVal.innerHTML.includes('color:#b91c1c') || invVal.innerHTML.includes('color:red');
    const hasWarn = invVal.innerHTML.includes('color:#b45309') || invVal.innerHTML.includes('#d97706');
    if (hasError) {
      _setDash('dashValidation', 'Errori nella validazione inverter', 'err');
    } else if (hasWarn) {
      _setDash('dashValidation', 'Attenzione — verifica parametri', 'warn');
    } else {
      _setDash('dashValidation', 'Configurazione valida', 'ok');
    }
  } else if (tot > 0 && (typeof _inverterList === 'undefined' || _inverterList.length === 0)) {
    _setDash('dashValidation', 'Configura inverter nello Step 7', 'warn');
  } else {
    _setDash('dashValidation', '—');
  }
}

function _setDash(id, text, cls, fontSize) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = 'dash-card-value' + (cls ? ' ' + cls : '');
  if (fontSize) el.style.fontSize = fontSize + 'px';
  else el.style.fontSize = '';
}


// ═══════════════════════════════════════════════════
// 3. KEYBOARD SHORTCUTS — Ctrl+S, Ctrl+E, Ctrl+N, F1
// ═══════════════════════════════════════════════════

function _initShortcuts() {
  document.addEventListener('keydown', function(e) {
    // Ctrl+S — Salva
    if ((e.ctrlKey || e.metaKey) && e.key === 's' && !e.shiftKey) {
      e.preventDefault();
      salvaProgetto();
    }
    // Ctrl+O — Apri progetto (.sdproj o legacy .json) — AP-10 / PR-27
    if ((e.ctrlKey || e.metaKey) && e.key === 'o' && !e.shiftKey) {
      e.preventDefault();
      const inp = document.getElementById('loadProjectInput');
      if (inp) inp.click();
    }
    // Ctrl+E — Esporta PDF
    if ((e.ctrlKey || e.metaKey) && e.key === 'e' && !e.shiftKey) {
      e.preventDefault();
      if (panels.length > 0) exportProj();
      else showToast('Genera prima il layout dei moduli', 'warn');
    }
    // Ctrl+N — Nuovo progetto
    if ((e.ctrlKey || e.metaKey) && e.key === 'n' && !e.shiftKey) {
      e.preventDefault();
      resetAll();
    }
    // F1 o ? — Mostra shortcuts
    if (e.key === 'F1' || (e.key === '?' && document.activeElement.tagName !== 'INPUT' && !e.ctrlKey)) {
      e.preventDefault();
      openShortcutsModal();
    }
    // M — Toggle minimap (non in input)
    if ((e.key === 'm' || e.key === 'M') && document.activeElement.tagName !== 'INPUT'
        && !e.ctrlKey && !e.metaKey && mode === 'none') {
      e.preventDefault();
      toggleMinimap();
    }
  });
}

function openShortcutsModal() {
  const m = document.getElementById('shortcutsModal');
  if (m) m.classList.add('visible');
}
function closeShortcutsModal() {
  const m = document.getElementById('shortcutsModal');
  if (m) m.classList.remove('visible');
}


// ═══════════════════════════════════════════════════
// 4. CANVAS ENHANCEMENTS — Minimap, Ruler, Preview
// ═══════════════════════════════════════════════════

let _minimapVisible = false;

function toggleMinimap() {
  _minimapVisible = !_minimapVisible;
  const el = document.getElementById('canvasMinimap');
  if (el) el.classList.toggle('visible', _minimapVisible);
  if (_minimapVisible) renderMinimap();
}

function renderMinimap() {
  if (!_minimapVisible) return;
  const mmCanvas = document.getElementById('minimapCanvas');
  if (!mmCanvas) return;
  const mm = mmCanvas.getContext('2d');
  const W = 140, H = 100;
  mmCanvas.width = W * 2;
  mmCanvas.height = H * 2;
  mm.setTransform(2, 0, 0, 2, 0, 0);

  mm.fillStyle = '#1a1a1a';
  mm.fillRect(0, 0, W, H);

  // Calcola bounding box di tutti gli elementi
  const allPts = [];
  installableAreas.forEach(a => a.points.forEach(p => allPts.push(p)));
  exclusionAreas.forEach(a => a.points.forEach(p => allPts.push(p)));
  panels.forEach(p => { allPts.push({x:p.x, y:p.y}); allPts.push({x:p.x+p.w, y:p.y+p.h}); });
  if (img) {
    allPts.push({x: -img.width/2, y: -img.height/2});
    allPts.push({x: img.width/2, y: img.height/2});
  }

  if (allPts.length < 2) return;
  const xs = allPts.map(p=>p.x), ys = allPts.map(p=>p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const rangeX = maxX - minX || 1, rangeY = maxY - minY || 1;
  const pad = 8;
  const scaleM = Math.min((W-2*pad)/rangeX, (H-2*pad)/rangeY);
  const tx = (pt) => pad + (pt.x - minX) * scaleM;
  const ty = (pt) => pad + (pt.y - minY) * scaleM;

  // Disegna immagine di sfondo (semplificata come rettangolo)
  if (img) {
    mm.fillStyle = 'rgba(100,100,100,0.3)';
    const ix = tx({x:-img.width/2}), iy = ty({y:-img.height/2});
    mm.fillRect(ix, iy, img.width * scaleM, img.height * scaleM);
  }

  // Aree installabili
  installableAreas.forEach((a, i) => {
    const ac = AREA_COLORS[i % AREA_COLORS.length];
    mm.fillStyle = ac.fill;
    mm.strokeStyle = ac.stroke;
    mm.lineWidth = 1;
    mm.beginPath();
    mm.moveTo(tx(a.points[0]), ty(a.points[0]));
    for (let j = 1; j < a.points.length; j++)
      mm.lineTo(tx(a.points[j]), ty(a.points[j]));
    mm.closePath(); mm.fill(); mm.stroke();
  });

  // Pannelli (come punti o piccoli rettangoli)
  if (panels.length > 0) {
    mm.fillStyle = 'rgba(30,58,95,0.7)';
    panels.forEach(p => {
      mm.fillRect(tx(p), ty(p), Math.max(1, p.w * scaleM), Math.max(1, p.h * scaleM));
    });
  }

  // Viewport corrente (rettangolo bianco)
  const vpW = canvas.clientWidth / z;
  const vpH = canvas.clientHeight / z;
  const vpX = -canvas.clientWidth/(2*z) - ox/z;
  const vpY = -canvas.clientHeight/(2*z) - oy/z;
  mm.strokeStyle = 'rgba(255,255,255,0.8)';
  mm.lineWidth = 1.5;
  mm.strokeRect(
    pad + (vpX - minX) * scaleM,
    pad + (vpY - minY) * scaleM,
    vpW * scaleM,
    vpH * scaleM
  );
}

/** Aggiorna il righello canvas con info scala */
function updateCanvasRuler() {
  const ruler = document.getElementById('canvasRuler');
  const rulerText = document.getElementById('rulerText');
  if (!ruler || !rulerText) return;

  if (scale > 1) {
    ruler.classList.add('visible');
    // Calcola quanti pixel = 1 metro a questo zoom
    const pxPerM = scale * z;
    // Scegli un'unità leggibile
    let labelM, labelPx;
    if (pxPerM > 200) {
      labelM = 0.5; labelPx = pxPerM * 0.5;
    } else if (pxPerM > 80) {
      labelM = 1; labelPx = pxPerM;
    } else if (pxPerM > 30) {
      labelM = 2; labelPx = pxPerM * 2;
    } else if (pxPerM > 15) {
      labelM = 5; labelPx = pxPerM * 5;
    } else {
      labelM = 10; labelPx = pxPerM * 10;
    }
    rulerText.textContent = '\u2014 ' + labelM + ' m = ' + Math.round(labelPx) + 'px \u2014 Zoom: ' + (z*100).toFixed(0) + '%';
  } else {
    ruler.classList.remove('visible');
  }
}

/** Preview area: durante il disegno di un'area, stima quanti pannelli entreranno */
function getAreaPreviewCount(pts) {
  if (!pts || pts.length < 3 || scale <= 1) return null;
  // Calcola area del poligono in m²
  let areaPx2 = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    areaPx2 += pts[i].x * pts[j].y - pts[j].x * pts[i].y;
  }
  areaPx2 = Math.abs(areaPx2) / 2;
  const areaM2 = areaPx2 / (scale * scale);
  const pw = parseFloat(DOM.pw.value) || 1.134;
  const pl = parseFloat(DOM.pl.value) || 1.722;
  const ps = (parseFloat(DOM.ps.value) || 2) / 100;
  const margin = (parseFloat(DOM.safetyMargin.value) || 10) / 100;
  const panelArea = (pw + ps) * (pl + ps);
  // Stima grossolana: area utile dopo margine / area pannello singolo
  const usableArea = areaM2 * 0.85; // ~85% fill factor tipico
  const estimate = Math.floor(usableArea / panelArea);
  const estimateKwp = (estimate * parseFloat(DOM.pp.value) / 1000).toFixed(1);
  return {
    areaM2: areaM2.toFixed(1),
    panels: estimate,
    kwp: estimateKwp
  };
}


// ═══════════════════════════════════════════════════
// INIT — Collega tutto al ciclo di vita dell'app
// ═══════════════════════════════════════════════════

let _enhancementsInitialized = false;
function _initEnhancements() {
  if (_enhancementsInitialized) return;
  _enhancementsInitialized = true;

  _initShortcuts();

  // Sovrascrive updateStats per aggiornare anche status bar e dashboard
  const _origUpdateStats = updateStats;
  updateStats = function() {
    _origUpdateStats();
    updateStatusBar();
    updateDashboard();
    updateCanvasRuler();
    if (_minimapVisible) renderMinimap();
  };

  // Hook nel draw() per aggiornare minimap e ruler
  const _origDraw = draw;
  draw = function() {
    _origDraw();
    updateCanvasRuler();
    if (_minimapVisible) renderMinimap();
    // Area preview durante il disegno
    _drawAreaPreviewOverlay();
  };

  // Aggiornamento iniziale
  setTimeout(() => {
    updateStatusBar();
    updateDashboard();
    updateCanvasRuler();
  }, 200);
}

/** Mostra stima pannelli durante il disegno area */
function _drawAreaPreviewOverlay() {
  if (mode !== 'area' || curPts.length < 3) return;
  const preview = getAreaPreviewCount(curPts);
  if (!preview) return;

  // Disegna overlay info nel canvas
  const dpr = window.devicePixelRatio || 1;
  ctx.save();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const text = '~' + preview.panels + ' moduli · ' + preview.kwp + ' kWp · ' + preview.areaM2 + ' m\u00B2';
  ctx.font = '600 12px "JetBrains Mono", monospace';
  const tw = ctx.measureText(text).width + 20;
  const x = canvas.clientWidth / 2 - tw / 2;
  const y = 12;
  ctx.fillStyle = 'rgba(13,150,104,0.88)';
  ctx.beginPath();
  ctx.roundRect(x, y, tw, 28, 6);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.clientWidth / 2, y + 14);

  ctx.restore();
}
