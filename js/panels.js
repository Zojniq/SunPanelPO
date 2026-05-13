// ── panels.js — Motore layout pannelli, area preview, snap griglia ──

'use strict';
//
// Dipendenze globali dichiarate in altri file (devono essere caricate prima):
//   state.js  → _layoutCache (Map), _previewDebounceTimer, _relayoutTimer,
//               panels, strings, selectedPanels, hoveredPanel, moveMode,
//               isDraggingPanels, dragStartPoint, panelsStartPos, snapPreviewPos,
//               installableAreas, exclusionAreas, technicalObjects, scale
//   ui.js     → DOM (cache elementi HTML), updateAreaLists, updateStats,
//               updateStringList, updateLegend, _updateToolbarGroups, draw
//   strings.js → genStrings
//   canvas.js  → offsetPolygon, pointInPolygon, _isSelfIntersecting,
//               _isValidPoly, _convexHull, distanceToSegment, polyAABB,
//               techObjectToPolygon

// ── polyArea / polyAreaCached ────────────────────────────────────────────────

function polyArea(pts) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    a += pts[i].x * pts[j].y;
    a -= pts[j].x * pts[i].y;
  }
  return Math.abs(a) / 2 / (scale * scale);
}

// Cached version — stores result on the area object itself, cleared by invalidateLayoutCache
function polyAreaCached(area) {
  if (area._cachedArea === undefined || area._areaCacheScale !== scale) {
    area._cachedArea = polyArea(area.points);
    area._areaCacheScale = scale;
  }
  return area._cachedArea;
}

// ── Layout result cache ───────────────────────────────────────────────────────

function invalidateLayoutCache() {
  _layoutCache.clear();
  _exactCountCache.clear(); // invalida anche la cache exactCount
  installableAreas.forEach(a => { delete a._cachedArea; });
  exclusionAreas.forEach(a => { delete a._cachedArea; });
}

// ── readLayoutParams ─────────────────────────────────────────────────────────

/**
 * Legge i parametri di layout dalla UI e li restituisce come oggetto.
 * Usato sia dalla cache key sia da layoutSingleArea.
 */
function readLayoutParams(area) {
  const gap      = Math.max(0, parseFloat(DOM.ps.value)               || 0) / 100;
  const pwr      = Math.max(1, parseInt  (DOM.pp.value)               || 400);
  const margin   = Math.max(0, parseFloat(DOM.safetyMargin.value)     || 0) / 100;
  const obstDist = Math.max(0, parseFloat(DOM.obstacleDistance.value) || 0);
  // Per-area stagger (fallback to global DOM if no area provided)
  const stagger    = area ? (area.staggerEnabled || false) : DOM.enableStagger.checked;
  const staggerPct = area
    ? Math.min(0.99, Math.max(0, (parseFloat(area.staggerOffset) || 50) / 100))
    : Math.min(0.99, Math.max(0, (parseFloat(DOM.staggerOffset.value) || 0) / 100));
  // Per-area walkways — retrocompatibilità con vecchio formato
  function _legacyWalk(aObj) {
    if (!aObj) return { rOn: walkwaysEnabled, rInt: parseInt(DOM.walkwayInterval.value) || 3, rW: (parseFloat(DOM.walkwayWidth.value) || 80) / 100, cOn: false, cInt: 3, cW: 0.8 };
    const on  = aObj.walkwaysEnabled || false;
    const dir = aObj.walkwayDir || 'row';
    const int_ = parseInt(aObj.walkwayInterval) || 3;
    const w   = (parseFloat(aObj.walkwayWidth) || 80) / 100;
    if (aObj.walkRowEnabled !== undefined || aObj.walkColEnabled !== undefined) {
      return {
        rOn:  aObj.walkRowEnabled || false,
        rInt: Math.max(1, parseInt(aObj.walkRowInterval) || 3),
        rW:   Math.max(0, (parseFloat(aObj.walkRowWidth) || 80) / 100),
        cOn:  aObj.walkColEnabled || false,
        cInt: Math.max(1, parseInt(aObj.walkColInterval) || 3),
        cW:   Math.max(0, (parseFloat(aObj.walkColWidth) || 80) / 100),
      };
    }
    return {
      rOn:  on && dir === 'row', rInt: int_, rW: w,
      cOn:  on && dir === 'col', cInt: int_, cW: w,
    };
  }
  const wk = _legacyWalk(area || null);
  const walkRowInt   = wk.rOn ? Math.max(1, wk.rInt) : 999999;
  const walkRowWidth = wk.rOn ? wk.rW : 0;
  const walkColInt   = wk.cOn ? Math.max(1, wk.cInt) : 999999;
  const walkColWidth = wk.cOn ? wk.cW : 0;
  return { gap, pwr, margin, obstDist, stagger, staggerPct, walkRowInt, walkRowWidth, walkColInt, walkColWidth };
}

// ── _layoutCacheKey ──────────────────────────────────────────────────────────

function _layoutCacheKey(areaIdx, mW, mH) {
  const p = readLayoutParams(installableAreas[areaIdx]);
  const exclKey = exclusionAreas.map(a =>
    a.points.map(pt => `${Math.round(pt.x)},${Math.round(pt.y)}`).join(';')
  ).join('|') + '/' + technicalObjects.map(o =>
    `${Math.round(o.x)},${Math.round(o.y)},${Math.round((o.sizePx || 0) * 10)},${Math.round((o.bufferM || 0) * 100)},${o.solarAngleDeg || 30}`
  ).join('|');
  return `${areaIdx}|${mW}|${mH}|${p.gap}|${p.pwr}|${p.margin}|${p.obstDist}|${p.stagger ? 1 : 0}|${p.staggerPct}|${p.walkRowInt}|${p.walkRowWidth}|${p.walkColInt}|${p.walkColWidth}|${scale.toFixed(6)}|${exclKey}`;
}

// ── techObjectToPolygon ──────────────────────────────────────────────────────

/**
 * Converte un oggetto tecnico nella sua poligonale di esclusione (world coords).
 * Logica zona di esclusione:
 *   - il layout engine aggiunge sempre obstDistPx sul bordo
 *   - zona effettiva finale = max(shadowR, sizePx/2 + obstDist)
 */
function techObjectToPolygon(obj) {
  const obstacleDist = parseFloat(DOM.obstacleDistance ? DOM.obstacleDistance.value : 0) || 0;
  const obstDistPxLocal = obstacleDist * scale;
  const perObjBufR = (obj.bufferM || 0) * scale;
  let hw;
  if (obj.type === 'chimney' && scale > 1 && obj.heightM) {
    const shadowR = obj.heightM * scale / Math.tan((obj.solarAngleDeg || 30) * Math.PI / 180);
    hw = Math.max(shadowR - obstDistPxLocal, obj.sizePx / 2 + perObjBufR);
  } else {
    hw = obj.sizePx / 2 + perObjBufR;
  }
  const ang = obj.ang || 0;
  const pts = [];
  if (obj.type === 'skylight' || obj.type === 'hvac') {
    const hh = obj.type === 'hvac' ? hw * 0.65 : hw;
    const cos = Math.cos(ang), sin = Math.sin(ang);
    [{ x: -hw, y: -hh }, { x: hw, y: -hh }, { x: hw, y: hh }, { x: -hw, y: hh }].forEach(c => pts.push({
      x: obj.x + c.x * cos - c.y * sin,
      y: obj.y + c.x * sin + c.y * cos
    }));
    return pts;
  }
  const N = 20;
  for (let i = 0; i < N; i++) {
    const a = (2 * Math.PI * i) / N;
    pts.push({ x: obj.x + hw * Math.cos(a), y: obj.y + hw * Math.sin(a) });
  }
  return pts;
}

// ── Concave decomposition helpers ────────────────────────────────────────────

/**
 * Rileva se un poligono è concavo (ha almeno un vertice reflex).
 * Vertice reflex = angolo interno > 180° → cross product cambia segno.
 */
function _isConcavePolygon(pts) {
  const n = pts.length;
  if (n < 4) return false;
  let sign = 0;
  for (let i = 0; i < n; i++) {
    const a = pts[(i-1+n)%n], b = pts[i], c = pts[(i+1)%n];
    const cross = (b.x-a.x)*(c.y-b.y) - (b.y-a.y)*(c.x-b.x);
    if (Math.abs(cross) < 1e-8) continue;
    const s = cross > 0 ? 1 : -1;
    if (sign === 0) sign = s;
    else if (s !== sign) return true;
  }
  return false;
}

/**
 * Notch-based splitting (Gap 2 fix): prova H e V per TUTTI i vertici reflex,
 * valuta ogni candidato con score area(A)^0.9 + area(B)^0.9, sceglie il migliore.
 * Scarta split con pezzi troppo piccoli (micro-frammenti inutili).
 */
function _splitConcavePolygon(pts) {
  const n = pts.length;
  if (n < 4) return [pts];

  // Area minima per un pezzo valido (evita micro-frammenti)
  const _polyArea = p => { let s=0; for(let i=0;i<p.length;i++){const j=(i+1)%p.length; s+=p[i].x*p[j].y-p[j].x*p[i].y;} return Math.abs(s)/2; };
  const totalArea = _polyArea(pts);
  const MIN_FRAG = totalArea * 0.05; // scarta pezzi < 5% dell'area totale
  const _score = (A, B) => Math.pow(_polyArea(A), 0.9) + Math.pow(_polyArea(B), 0.9);

  // Determina verso (CW/CCW)
  let wSign = 0;
  for (let i = 0; i < n; i++) {
    const j = (i+1)%n;
    wSign += pts[i].x*pts[j].y - pts[j].x*pts[i].y;
  }
  const windSign = wSign >= 0 ? 1 : -1;

  // Raccogli tutti i vertici reflex
  const reflexIndices = [];
  for (let i = 0; i < n; i++) {
    const a = pts[(i-1+n)%n], b = pts[i], c = pts[(i+1)%n];
    const cross = windSign * ((b.x-a.x)*(c.y-b.y) - (b.y-a.y)*(c.x-b.x));
    if (cross < -1e-8) reflexIndices.push(i);
  }
  if (reflexIndices.length === 0) return [pts];

  // Funzione per costruire 2 poligoni dato un taglio (reflexIdx, cutPt, segStart)
  function _buildSplit(reflexIdx, cutPt, cutSegStart) {
    // polyA: vertici da 0..reflexIdx + cutPt
    // polyB: cutPt + vertici da (cutSegStart+1)...(reflexIdx-1) + reflexPt
    // Ricostruisce usando inserimento del punto di taglio nel poligono
    const polyA = [], polyB = [];
    const reflexPt = pts[reflexIdx];

    // Determina l'ordine: va dal reflex al cut attraverso un segmento interno
    // Strategia: percorri il bordo in entrambe le direzioni dal reflex al cut
    // Direzione 1: reflex → cutSegStart (in avanti)
    const fwd = [];
    for (let k = reflexIdx; ; k = (k+1)%n) {
      fwd.push({...pts[k]});
      if (k === cutSegStart) break;
      if (fwd.length > n+1) break; // safety
    }
    fwd.push({...cutPt});

    // Direzione 2: cutSegStart+1 → reflex (in avanti, chiude con cutPt → reflex)
    const bwd = [{...cutPt}];
    for (let k = (cutSegStart+1)%n; k !== reflexIdx; k = (k+1)%n) {
      bwd.push({...pts[k]});
      if (bwd.length > n+1) break;
    }
    bwd.push({...reflexPt});

    if (fwd.length >= 3 && bwd.length >= 3 &&
        _isValidPoly(fwd) && _isValidPoly(bwd)) return [fwd, bwd];
    return null;
  }

  // ── Intersezione raggio-segmento generica ──────────────────────────────────
  // Raggio da reflexPt in direzione (dx,dy), interseca il segmento (a,b).
  // Restituisce il punto di taglio solo se cade STRETTAMENTE dentro il segmento
  // e il raggio punta verso quel punto (s > 0).
  function _raySegIntersect(reflexPt, dx, dy, a, b) {
    // Risolve: reflexPt + s*(dx,dy) = a + t*(b-a)
    // → [ dx  -bax ][ s ] = [ arx ]
    //   [ dy  -bay ][ t ]   [ ary ]
    // denom = det = dx*(-bay) - (-bax)*dy = dy*bax - dx*bay
    const bax = b.x - a.x, bay = b.y - a.y;
    const arx = a.x - reflexPt.x, ary = a.y - reflexPt.y;
    // det = dx*(-bay) - (-bax)*dy = dy*bax - dx*bay
    const denom = dy * bax - dx * bay;
    if (Math.abs(denom) < 1e-10) return null; // parallelo
    // t = (dx*ary - dy*arx) / det  → posizione lungo segmento [0,1]
    const t = (dx * ary - dy * arx) / denom;
    if (t <= 1e-6 || t >= 1 - 1e-6) return null;
    // s = (bax*ary - bay*arx) / det  → distanza lungo raggio (> 0 = direzione giusta)
    const s = (bax * ary - bay * arx) / denom;
    if (s <= 1e-6) return null;
    return { x: a.x + t * bax, y: a.y + t * bay };
  }

  // Genera tutti i candidati di taglio: ogni reflex × {H, V, bordi adiacenti e perpendicolari}.
  // I tagli H/V funzionano per L-shape axis-aligned; i tagli edge-aligned funzionano per L ruotate.
  let bestSplit = null, bestScore = -Infinity;

  for (const reflexIdx of reflexIndices) {
    const reflexPt = pts[reflexIdx];

    // Direzioni degli spigoli adiacenti al vertice reflex
    const prev = pts[(reflexIdx - 1 + n) % n];
    const next = pts[(reflexIdx + 1) % n];
    const e1x = prev.x - reflexPt.x, e1y = prev.y - reflexPt.y; // verso prev
    const e2x = next.x - reflexPt.x, e2y = next.y - reflexPt.y; // verso next
    const len1 = Math.hypot(e1x, e1y) || 1, len2 = Math.hypot(e2x, e2y) || 1;

    // Assi da provare: H, V + direzioni parallele/perpendicolari ai bordi del vertice reflex
    // I tagli edge-aligned sono fondamentali per L-shape ruotate
    const axes = [
      { dx: 1, dy: 0 },           // orizzontale
      { dx: 0, dy: 1 },           // verticale
      { dx:  e1x/len1, dy:  e1y/len1 }, // parallelo bordo prev
      { dx: -e1x/len1, dy: -e1y/len1 }, // opposto
      { dx:  e2x/len2, dy:  e2y/len2 }, // parallelo bordo next
      { dx: -e2x/len2, dy: -e2y/len2 }, // opposto
      { dx: -e1y/len1, dy:  e1x/len1 }, // perpendicolare bordo prev
      { dx: -e2y/len2, dy:  e2x/len2 }, // perpendicolare bordo next
    ];

    for (const { dx, dy } of axes) {
      const intersections = [];
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        if (i === reflexIdx || j === reflexIdx) continue; // salta spigoli incidenti
        const cutPt = _raySegIntersect(reflexPt, dx, dy, pts[i], pts[j]);
        if (cutPt && Math.hypot(cutPt.x - reflexPt.x, cutPt.y - reflexPt.y) > 1e-4) {
          intersections.push({ pt: cutPt, segStart: i });
        }
      }

      for (const { pt: cutPt, segStart } of intersections) {
        const split = _buildSplit(reflexIdx, cutPt, segStart);
        if (!split) continue;
        const [A, B] = split;
        if (_polyArea(A) < MIN_FRAG || _polyArea(B) < MIN_FRAG) continue;
        const s = _score(A, B);
        if (s > bestScore) { bestScore = s; bestSplit = [A, B]; }
      }
    }
  }

  return bestSplit || [pts];
}

/**
 * Decompone ricorsivamente un poligono concavo in parti (max 3 livelli).
 * Nella pratica L/U/T si risolvono in 1-2 livelli.
 */
function _decomposeConcave(pts, depth) {
  if (depth === undefined) depth = 0;
  if (depth > 3 || !_isConcavePolygon(pts)) return [pts];
  const parts = _splitConcavePolygon(pts);
  if (parts.length === 1) return [pts];
  const result = [];
  for (const part of parts) {
    result.push(..._decomposeConcave(part, depth + 1));
  }
  return result;
}

// ── Collision helpers (merge multi-area) ─────────────────────────────────────

const _OVERLAP_EPS = 1e-3; // tolleranza px per micro-gap su bordi condivisi

/**
 * Overlap AABB in coordinate U-V mondiali (frame ruotato condiviso).
 *
 * Bug originale: _localRectsOverlap usava localU/localV che sono relative
 * all'origine di griglia di OGNI sotto-area → confronto tra sistemi diversi
 * → falsi positivi → pannelli del secondo braccio (L/U-shape) scartati.
 *
 * Fix: proietta l'origine mondiale (x, y) sul frame ruotato condiviso usando
 * axisU/axisV del pannello. Tutti i pannelli emessi con lo stesso ang (via
 * forcedAng) condividono gli stessi assi → confronto corretto.
 */
function _worldRectsOverlap(a, b) {
  // axisUx = cos(ang), axisUy = sin(ang)  [da layoutSingleArea → runGlobalGrid]
  // Usa gli assi di `a` per proiettare entrambi — valido perché tutti i pannelli
  // emessi da layoutConcaveArea condividono lo stesso forcedAng (stesso float IEEE 754).
  // Se per qualsiasi motivo gli angoli differissero, usa a come riferimento comunque:
  // è il caso degenere meno peggiore (confronto approssimato > confronto su sistemi diversi).
  const cos = a.axisUx, sin = a.axisUy;
  const uA = a.x * cos + a.y * sin,  vA = -a.x * sin + a.y * cos;
  const uB = b.x * cos + b.y * sin,  vB = -b.x * sin + b.y * cos;
  return !(uA + a.w <= uB + _OVERLAP_EPS ||
           uB + b.w <= uA + _OVERLAP_EPS ||
           vA + a.h <= vB + _OVERLAP_EPS ||
           vB + b.h <= vA + _OVERLAP_EPS);
}

/** True se p si sovrappone fisicamente a qualsiasi pannello in occupied. */
function _occupiedConflict(p, occupied) {
  return occupied.some(o => _worldRectsOverlap(p, o));
}

// ── exactCount cache ──────────────────────────────────────────────────────────

const _exactCountCache = new Map();
const _EXACT_COUNT_MAX = 5000;

/**
 * Hash deterministico di un poligono — veloce, niente JSON.stringify.
 * Moltiplicatore 31 standard, coordinate arrotondate a 1/1000 px.
 */
function _polyHash(pts) {
  let h = 0;
  for (let i = 0; i < pts.length; i++) {
    h = (h * 31 + (Math.round(pts[i].x * 1000) | 0)) | 0;
    h = (h * 31 + (Math.round(pts[i].y * 1000) | 0)) | 0;
  }
  return h;
}

/**
 * exactCount con caching.
 * Chiave: hash(area) | ang | mW | mH | walkRowInt | walkColInt | scale
 * NON include offset griglia (probe X/Y) — solo parametri strutturali.
 */
function _exactCountCached(pts, ang, mWPx, mHPx, stepW, stepH, walkRowInt, walkColInt) {
  // Calcola (o riusa) hash area
  const h = _polyHash(pts);
  const key = `${h}|${ang.toFixed(4)}|${mWPx.toFixed(2)}|${mHPx.toFixed(2)}|${stepW.toFixed(2)}|${stepH.toFixed(2)}|${walkRowInt}|${walkColInt}`;
  if (_exactCountCache.has(key)) return _exactCountCache.get(key);

  // Computo effettivo
  const lp = transformPolygon(pts, ang), ab = polyAABB(lp);
  const cW = ab.maxX - ab.minX, cH = ab.maxY - ab.minY;
  const cols = cW >= mWPx ? Math.floor((cW - mWPx) / stepW) + 1 : 0;
  const rows = cH >= mHPx ? Math.floor((cH - mHPx) / stepH) + 1 : 0;
  let cnt = 0;
  if (cols > 0 && rows > 0) {
    const ox_ = ab.minX + Math.max(0, (cW - ((cols-1)*stepW + mWPx)) / 2);
    const oy_ = ab.minY + Math.max(0, (cH - ((rows-1)*stepH + mHPx)) / 2);
    const E = 1e-4;
    for (let r = 0; r < rows; r++) {
      if (walkRowInt < 999999 && walkRowInt > 0 && r > 0 && r % walkRowInt === 0) continue;
      const ly = oy_ + r * stepH;
      for (let c = 0; c < cols; c++) {
        if (walkColInt < 999999 && walkColInt > 0 && c > 0 && c % walkColInt === 0) continue;
        const lx = ox_ + c * stepW;
        const corners = [{x:lx+E,y:ly+E},{x:lx+mWPx-E,y:ly+E},{x:lx+mWPx-E,y:ly+mHPx-E},{x:lx+E,y:ly+mHPx-E}];
        if (corners.every(pt => pointInPolygon(pt, lp, ab))) cnt++;
      }
    }
  }

  // Evita crescita infinita — reset semplice senza LRU
  if (_exactCountCache.size >= _EXACT_COUNT_MAX) _exactCountCache.clear();
  _exactCountCache.set(key, cnt);
  return cnt;
}

// ── _computeBestAngle ─────────────────────────────────────────────────────────

/**
 * Calcola l'angolo ottimale per il layout di un'area dato un modulo mW×mH.
 * Usa _exactCountCached → ricalcoli zero su chiamate ripetute (orientP vs orientL,
 * split concavo, preview, ecc.).
 */
function _computeBestAngle(area, mW, mH) {
  const gap = Math.max(0, parseFloat(DOM.ps ? DOM.ps.value : 0) || 0) / 100;
  const mWPx = mW * scale, mHPx = mH * scale, gapPx = gap * scale;
  const stepW = mWPx + gapPx, stepH = mHPx + gapPx;
  const { walkRowInt, walkColInt } = readLayoutParams(area);

  // Logica originale: angoli candidati derivati dai bordi del poligono + perpendicolari.
  // Per triangoli questo produce l'angolo del lato più lungo (= base), come richiesto
  // dall'approccio ingegneristico (pannelli allineati con gronda/colmo del tetto).
  const angSet = new Set([0]);
  for (let i = 0; i < area.points.length; i++) {
    const j = (i+1) % area.points.length;
    const dx = area.points[j].x - area.points[i].x, dy = area.points[j].y - area.points[i].y;
    if (Math.sqrt(dx*dx+dy*dy) < 1e-6) continue;
    let a = Math.atan2(dy, dx);
    while (a >  Math.PI/2) a -= Math.PI;
    while (a < -Math.PI/2) a += Math.PI;
    const aRad = Math.round(a*360/Math.PI)/360 * Math.PI;
    let perpRad = aRad + Math.PI/2;
    if (perpRad >  Math.PI/2) perpRad -= Math.PI;
    if (perpRad < -Math.PI/2) perpRad += Math.PI;
    angSet.add(aRad); angSet.add(perpRad);
  }

  // quickCount: O(N) — filtra candidati senza check pixel
  function quickCount(ang) {
    const cos=Math.cos(-ang), sin=Math.sin(-ang);
    let mnX=Infinity,mxX=-Infinity,mnY=Infinity,mxY=-Infinity;
    for (const p of area.points) {
      const rx=p.x*cos-p.y*sin, ry=p.x*sin+p.y*cos;
      if(rx<mnX)mnX=rx; if(rx>mxX)mxX=rx; if(ry<mnY)mnY=ry; if(ry>mxY)mxY=ry;
    }
    const cW=mxX-mnX, cH=mxY-mnY;
    return (cW>=mWPx?Math.floor((cW-mWPx)/stepW)+1:0)*(cH>=mHPx?Math.floor((cH-mHPx)/stepH)+1:0);
  }

  const sorted = [...angSet].sort((a,b) => quickCount(b) - quickCount(a));
  // Evaluta TUTTI i candidati — _exactCountCached rende questo O(1) dopo il primo calcolo.
  // Il filtro top-5 era dannoso per forme sottili/ruotate: _quickCount sovrastima l'AABB
  // e l'angolo corretto veniva escluso prima che _exactCountCached potesse valutarlo.
  const top = sorted;
  let bestAng = 0, bestCnt = -1;
  for (const a of top) {
    // usa versione cached — hit immediato se stessa area/angolo già valutati
    const cnt = _exactCountCached(area.points, a, mWPx, mHPx, stepW, stepH, 999999, 999999);
    if (cnt > bestCnt || (cnt === bestCnt && Math.abs(a) < Math.abs(bestAng))) {
      bestCnt = cnt; bestAng = a;
    }
  }
  return bestAng;
}

// ── layoutSingleArea ─────────────────────────────────────────────────────────

/**
 * Calcola il layout ottimale dei pannelli per una singola area installabile.
 * @param {Object} area - area con points[]
 * @param {number} areaIdx - indice dell'area
 * @param {number} mW - larghezza modulo (m)
 * @param {number} mH - altezza modulo (m)
 * @param {number} maxCount - max pannelli da piazzare
 * @param {number|null} forcedAng - angolo imposto (null = calcola automatico)
 * @returns {Array} pannelli posizionati
 */

// ── _panelWorldAABB ───────────────────────────────────────────────────────────
/**
 * Calcola il bounding-box in coordinate MONDO di un pannello dato il suo
 * angolo di rotazione. Usato da canPlacePanel per il check overlap tra
 * pannelli con angoli diversi (frame locali non comparabili direttamente).
 *
 * @param {number} lu  - coordinata U locale (angolo sup-sin)
 * @param {number} lv  - coordinata V locale
 * @param {number} w   - larghezza (pixel)
 * @param {number} h   - altezza (pixel)
 * @param {number} ang - angolo di rotazione (rad)
 */
function _panelWorldAABB(lu, lv, w, h, ang) {
  const cos = Math.cos(ang), sin = Math.sin(ang);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const [u, v] of [[lu, lv], [lu + w, lv], [lu + w, lv + h], [lu, lv + h]]) {
    const wx = u * cos - v * sin, wy = u * sin + v * cos;
    if (wx < minX) minX = wx;  if (wx > maxX) maxX = wx;
    if (wy < minY) minY = wy;  if (wy > maxY) maxY = wy;
  }
  return { minX, maxX, minY, maxY };
}

// ── canPlacePanel ─────────────────────────────────────────────────────────────
/**
 * Funzione UNICA di validazione piazzamento pannello.
 * Usata sia dal layout automatico (layoutSingleArea) sia dallo snap manuale
 * (_snapPanelToGridImpl). Stessa regola, zero incoerenze tra le due modalità.
 *
 * @param {number} lx   - X angolo sup-sin in coordinate locali (pixel)
 * @param {number} ly   - Y angolo sup-sin in coordinate locali (pixel)
 * @param {number} mWPx - larghezza pannello (pixel)
 * @param {number} mHPx - altezza pannello (pixel)
 * @param {object} ctx  - contesto di validazione:
 *   .localInset         {Array}   poligono area ristretto del margine (coord locali)
 *   .localInsetAABB     {object}  AABB di localInset
 *   .localPoly          {Array}   poligono area originale (coord locali)
 *   .localPolyAABB      {object}  AABB di localPoly
 *   .localExcl          {Array}   [opz] ostacoli buffered in coord locali
 *   .localExclAABB      {Array}   [opz] AABB corrispondenti
 *   .useEdgeMarginCheck {boolean} usa check distanza bordo (fallback concavo)
 *   .localAreaEdges     {Array}   [opz] lati area per edge-margin check
 *   .marginPx           {number}  margine in pixel
 *   .otherPanels        {Array}   [opz] altri pannelli [{localU,localV,w,h,ang}]
 *   .panelAng           {number}  [opz] angolo del pannello da piazzare (per P2)
 * @returns {boolean} true = posizione valida
 */
function canPlacePanel(lx, ly, mWPx, mHPx, ctx) {
  const EPS = 1e-4;
  const cx = lx + mWPx / 2, cy = ly + mHPx / 2;

  // 1. Centro dentro localInset — early exit rapido (necessario ma non sufficiente)
  if (!pointInPolygon({ x: cx, y: cy }, ctx.localInset, ctx.localInsetAABB)) return false;

  // 2. Tutti i corners dentro localInset — garantisce che l'INTERA superficie del pannello
  //    rispetti il margine di sicurezza su ogni lato. [FIX P1]
  //    Ragionamento: localInset = area.points ristretto di marginPx su ogni lato.
  //    → corner dentro localInset ⟹ corner a distanza ≥ marginPx da ogni bordo area.
  //    Caso marginPx=0 o fallback concavo: localInset = localPoly → check ridotto a containment.
  const corners = [
    { x: lx + EPS,        y: ly + EPS },
    { x: lx + mWPx - EPS, y: ly + EPS },
    { x: lx + mWPx - EPS, y: ly + mHPx - EPS },
    { x: lx + EPS,        y: ly + mHPx - EPS }
  ];
  if (!corners.every(pt => pointInPolygon(pt, ctx.localInset, ctx.localInsetAABB))) return false;
  const panelEdges = [
    [corners[0], corners[1]], [corners[1], corners[2]],
    [corners[2], corners[3]], [corners[3], corners[0]]
  ];

  for (const [pe0, pe1] of panelEdges) {
    for (let i = 0; i < ctx.localInset.length; i++) {
      const ie0 = ctx.localInset[i];
      const ie1 = ctx.localInset[(i + 1) % ctx.localInset.length];
      if (_segsIntersect(pe0, pe1, ie0, ie1)) return false;
    }
  }

  // 3. Check distanza bordo — fallback per aree concave dove offsetPolygon non ha retto
  if (ctx.useEdgeMarginCheck && ctx.localAreaEdges && ctx.marginPx > 0) {
    for (const corner of corners)
      for (const [ea, eb] of ctx.localAreaEdges)
        if (distanceToSegment(corner, ea, eb) < ctx.marginPx) return false;
  }

  // 4. No overlap con ostacoli tecnici (check geometrico completo: punti + spigoli)
  const excl     = ctx.localExcl     || [];
  const exclAABB = ctx.localExclAABB || [];
  if (excl.length > 0) {
    const panelAABB_ = { minX: lx, maxX: lx + mWPx, minY: ly, maxY: ly + mHPx };
    for (let oi = 0; oi < excl.length; oi++) {
      const obs = excl[oi];
      const obb = exclAABB[oi] || polyAABB(obs);
      if (lx + mWPx < obb.minX || lx > obb.maxX || ly + mHPx < obb.minY || ly > obb.maxY) continue;
      if (corners.some(pt => pointInPolygon(pt, obs, obb)))         return false;
      if (obs.some(pt   => pointInPolygon(pt, corners, panelAABB_))) return false;
      for (const [pe0, pe1] of panelEdges)
        for (let i = 0; i < obs.length; i++)
          if (_segsIntersect(pe0, pe1, obs[i], obs[(i + 1) % obs.length])) return false;
    }
  }

  // 5. No overlap con altri pannelli [FIX P2]
  //    Pannelli stesso angolo → AABB in frame locale (fast, esatto).
  //    Pannelli angolo diverso → world-space AABB (layoutConcaveArea può produrre
  //    pannelli della stessa area con ang diversi; i loro localU/V non sono nello
  //    stesso sistema di coordinate → confronto diretto sarebbe sbagliato).
  const others = ctx.otherPanels;
  if (others && others.length > 0) {
    const GAP_TOL  = 0.5; // tolleranza mezzo pixel per floating point
    const panelAng = ctx.panelAng;  // angolo del pannello da piazzare (undefined in auto-layout)
    let candidateWAABB = null;      // calcolato lazy solo se serve
    for (const other of others) {
      const sameFrame = (panelAng == null || other.ang == null ||
                         Math.abs(other.ang - panelAng) < 1e-6);
      if (sameFrame) {
        // Stesso frame locale: AABB check diretto
        if (lx + mWPx <= other.localU + GAP_TOL ||
            other.localU + other.w <= lx + GAP_TOL ||
            ly + mHPx <= other.localV + GAP_TOL ||
            other.localV + other.h <= ly + GAP_TOL) continue;
      } else {
        // Frame diverso: confronto in coordinate mondo (bounding-box conservativo)
        if (!candidateWAABB)
          candidateWAABB = _panelWorldAABB(lx, ly, mWPx, mHPx, panelAng);
        const ow = _panelWorldAABB(other.localU, other.localV, other.w, other.h, other.ang);
        if (candidateWAABB.maxX <= ow.minX + GAP_TOL ||
            ow.maxX <= candidateWAABB.minX + GAP_TOL ||
            candidateWAABB.maxY <= ow.minY + GAP_TOL ||
            ow.maxY <= candidateWAABB.minY + GAP_TOL) continue;
      }
      return false; // overlap trovato
    }
  }

  return true;
}

function layoutSingleArea(area, areaIdx, mW, mH, maxCount, forcedAng = null) {
  const { gap, pwr, margin, obstDist, stagger, staggerPct, walkRowInt, walkRowWidth, walkColInt, walkColWidth } = readLayoutParams(area);
  if (mW <= 0 || mH <= 0 || isNaN(mW) || isNaN(mH)) return [];
  const mWPx = mW * scale, mHPx = mH * scale, gapPx = gap * scale;
  const marginPx = margin * scale, obstDistPx = obstDist * scale;
  const stepW = mWPx + gapPx, stepH = mHPx + gapPx;
  const walkRowWidthPx = walkRowWidth * scale;
  const walkColWidthPx = walkColWidth * scale;

  // ── Fase 0: angolo — usa forcedAng se presente, altrimenti calcola ──────
  // forcedAng viene passato dalle sotto-aree in layoutConcaveArea per garantire
  // coerenza visiva (tutti i pannelli dello stesso angolo su L/U/T-shape).
  // Logica originale: angoli candidati derivati dai bordi del poligono + perpendicolari.
  const _angSet = new Set([0]);
  for (let i = 0; i < area.points.length; i++) {
    const j = (i + 1) % area.points.length;
    const dx = area.points[j].x - area.points[i].x, dy = area.points[j].y - area.points[i].y;
    if (Math.sqrt(dx*dx+dy*dy) < 1e-6) continue;
    let a = Math.atan2(dy, dx);
    while (a >  Math.PI/2) a -= Math.PI;
    while (a < -Math.PI/2) a += Math.PI;
    // Arrotonda a 0.5° per evitare near-duplicates
    const aRad = Math.round(a*360/Math.PI)/360 * Math.PI;
    let perpRad = aRad + Math.PI/2;
    if (perpRad >  Math.PI/2) perpRad -= Math.PI;
    if (perpRad < -Math.PI/2) perpRad += Math.PI;
    _angSet.add(aRad);
    _angSet.add(perpRad);
  }
  // Stima rapida O(N): prodotto cols×rows nel bounding box ruotato
  function _quickCount(ang) {
    const cos=Math.cos(-ang), sin=Math.sin(-ang);
    let mnX=Infinity,mxX=-Infinity,mnY=Infinity,mxY=-Infinity;
    for (const p of area.points) {
      const rx=p.x*cos-p.y*sin, ry=p.x*sin+p.y*cos;
      if(rx<mnX)mnX=rx; if(rx>mxX)mxX=rx; if(ry<mnY)mnY=ry; if(ry>mxY)mxY=ry;
    }
    const cW=mxX-mnX, cH=mxY-mnY;
    return (cW>=mWPx?Math.floor((cW-mWPx)/stepW)+1:0)*(cH>=mHPx?Math.floor((cH-mHPx)/stepH)+1:0);
  }
  // Se forcedAng è fornito (da layoutConcaveArea), lo usa direttamente senza calcolo
  let bestAng;
  if (forcedAng !== null) {
    bestAng = forcedAng;
  } else if (area.points.length === 3) {
    // TRIANGOLI: usa selezione MBR span-based (come originale verisone corretta.html).
    // Indipendente dalle dimensioni del modulo → stesso angolo per P e L →
    // tie-break in _layoutBestOrientation favorisce portrait correttamente.
    // Sceglie l'angolo che massimizza lo span X (= base del triangolo).
    const _spanX = (ang) => {
      const cos = Math.cos(-ang), sin = Math.sin(-ang);
      let mn = Infinity, mx = -Infinity;
      for (const p of area.points) {
        const rx = p.x * cos - p.y * sin;
        if (rx < mn) mn = rx;
        if (rx > mx) mx = rx;
      }
      return mx - mn;
    };
    bestAng = 0; let _bestSpan = -1;
    for (const a of _angSet) {
      const s = _spanX(a);
      if (s > _bestSpan) { _bestSpan = s; bestAng = a; }
    }
  } else {
    const _sortedCands=[..._angSet].sort((a,b)=>_quickCount(b)-_quickCount(a));
    // Evaluta tutti — _exactCountCached è O(1) dopo il primo hit, top-5 era il bug.
    bestAng=0; let _bestCnt=-1;
    for(const a of _sortedCands){
      // Usa versione cached — hit immediato se già calcolato da _computeBestAngle
      const cnt=_exactCountCached(area.points, a, mWPx, mHPx, stepW, stepH, 999999, 999999);
      if(cnt>_bestCnt||(cnt===_bestCnt&&Math.abs(a)<Math.abs(bestAng))){_bestCnt=cnt;bestAng=a;}
    }
  }

  // ── Swap walkway direction when U axis is more vertical than horizontal ──
  // When bestAng ≈ 90°: U points down (screen-vertical), V points left (screen-horizontal).
  // In that case walkColInt (Camm.V) would create horizontal stripes and walkRowInt (Camm.H)
  // vertical stripes — the opposite of what the user expects.
  // Fix: remap _wColInt↔_wRowInt so Camm.V ALWAYS produces visual vertical stripes.
  const _uIsHoriz = Math.abs(Math.cos(bestAng)) >= Math.abs(Math.sin(bestAng));
  const _wColInt  = _uIsHoriz ? walkColInt     : walkRowInt;
  const _wColWPx  = _uIsHoriz ? walkColWidthPx : walkRowWidthPx;
  const _wRowInt  = _uIsHoriz ? walkRowInt     : walkColInt;
  const _wRowWPx  = _uIsHoriz ? walkRowWidthPx : walkColWidthPx;

  // ── Fase 1: geometrie offset pre-calcolate ───────────────────────────────
  // 1a. Inset area installabile di marginPx → area utile reale.
  // offsetPolygon garantisce margine costante (in px) su ogni lato — corretto
  // per sicurezza reale. Se genera un poligono auto-intersecante (aree molto
  // strette o concave), fallback al check distanza bordo per pannello.
  let insetWorldPts, useEdgeMarginCheck = false;
  if (marginPx > 0) {
    const _cand = offsetPolygon(area.points, -marginPx);
    if (_isValidPoly(_cand) && !_isSelfIntersecting(_cand)) {
      insetWorldPts = _cand;
    } else {
      insetWorldPts = area.points.map(p=>({...p}));
      useEdgeMarginCheck = true;
    }
  } else {
    insetWorldPts = area.points.map(p=>({...p}));
  }
  if (!_isValidPoly(insetWorldPts)) return [];
  const localInset = transformPolygon(insetWorldPts, bestAng);
  const localInsetAABB = polyAABB(localInset);
  // Poligono originale (NON inset) in coord locali — usato per check corners
  // Serve per garantire che i bordi del pannello non sforino fuori dall'area reale.
  // Il centro viene validato contro localInset (margine ok), i corners contro localPoly (contenimento).
  const localPoly    = transformPolygon(area.points, bestAng);
  const localPolyAABB = polyAABB(localPoly);
  // Lati area (coord locali) per check distanza bordo — solo se fallback concavo
  const localAreaEdges = (useEdgeMarginCheck && marginPx > 0) ? (() => {
    return localPoly.map((_,i,arr)=>[arr[i], arr[(i+1)%arr.length]]);
  })() : null;

  // 1b. Buffer ostacoli di obstDistPx → zone vietate reali
  const obstacleDist_ = obstDist;
  const _areaAABB = polyAABB(area.points);
  const relevantExclRaw = [
    ...exclusionAreas.map(a => a.points),
    ...technicalObjects.filter(obj => {
      let effectiveR;
      if (obj.type === 'chimney' && scale > 1 && obj.heightM) {
        const shadowR_ = obj.heightM * scale / Math.tan((obj.solarAngleDeg || 30) * Math.PI / 180);
        effectiveR = Math.max(shadowR_, obj.sizePx / 2 + obstacleDist_ * scale);
      } else {
        effectiveR = obj.sizePx / 2 + obstacleDist_ * scale + (obj.bufferM || 0) * scale;
      }
      if (pointInPolygon(obj, area.points, _areaAABB)) return true;
      if (area.points.some(p => Math.hypot(p.x - obj.x, p.y - obj.y) < effectiveR)) return true;
      const poly = techObjectToPolygon(obj);
      if (poly.some(p => pointInPolygon(p, area.points, _areaAABB))) return true;
      const nA = area.points.length;
      for (let ei = 0; ei < nA; ei++) {
        if (distanceToSegment(obj, area.points[ei], area.points[(ei + 1) % nA]) < effectiveR) return true;
      }
      return false;
    }).map(obj => techObjectToPolygon(obj))
  ];
  // Espandi ogni ostacolo di obstDistPx
  const bufferedExclWorld = obstDistPx > 0
    ? relevantExclRaw.map(pts => offsetPolygon(pts, obstDistPx))
    : relevantExclRaw.map(pts => pts.map(p => ({ ...p })));
  const localBufExcl = bufferedExclWorld.map(pts => transformPolygon(pts, bestAng));
  const localBufExclAABB = localBufExcl.map(obs => polyAABB(obs));

  // ── Fase 2: Bounding box e centratura esatta ─────────────────────────────
  const _spanX = c => {
    const wk = (_wColInt < 999999 && _wColInt > 0) ? Math.floor(c / _wColInt) : 0;
    return c * stepW + wk * _wColWPx;
  };
  const _spanY = r => {
    const wk = (_wRowInt < 999999 && _wRowInt > 0) ? Math.floor(r / _wRowInt) : 0;
    return r * stepH + wk * _wRowWPx;
  };

  // Bug fix: la cacheKey originale usava solo areaIdx+mW+mH.
  // layoutConcaveArea chiama layoutSingleArea con sub-poligoni diversi ma stesso areaIdx
  // → la seconda chiamata (braccio secondario) colpisce la cache della prima (braccio dominante)
  // → ritorna i pannelli del braccio sbagliato, braccio secondario sempre vuoto.
  // Fix: aggiungere bestAng + hash del poligono reale (area.points, non installableAreas[idx]).
  const _subPolyHash = _polyHash(area.points);
  // Contesto di validazione — dichiarato al livello di layoutSingleArea così che
  // runGlobalGrid (closure di questo scope) possa accedervi senza ReferenceError.
  // Tutte le dipendenze (localInset, localPoly, localBufExcl, …) sono già calcolate sopra.
  const _placeCtx = {
    localInset, localInsetAABB,
    localPoly,  localPolyAABB,
    localExcl: localBufExcl, localExclAABB: localBufExclAABB,
    useEdgeMarginCheck, localAreaEdges, marginPx,
    otherPanels: null   // auto-layout: griglia allineata → no overlap tra pannelli
  };

  const cacheKey = _layoutCacheKey(areaIdx, mW, mH) + `|ang:${bestAng.toFixed(5)}|ph:${_subPolyHash}`;
  if (!_layoutCache.has(cacheKey)) {
    const aabbW = localInsetAABB.maxX - localInsetAABB.minX;
    const aabbH = localInsetAABB.maxY - localInsetAABB.minY;

    let cols_max = aabbW >= mWPx ? Math.floor((aabbW - mWPx) / stepW) + 1 : 0;
    while (cols_max > 1 && _spanX(cols_max - 1) + mWPx > aabbW + 1e-6) cols_max--;

    let rows_max = aabbH >= mHPx ? Math.floor((aabbH - mHPx) / stepH) + 1 : 0;
    while (rows_max > 1 && _spanY(rows_max - 1) + mHPx > aabbH + 1e-6) rows_max--;

    const originX = localInsetAABB.minX;
    const originY = localInsetAABB.minY;

    let fullResult = [];
    const _isTriangle = area.points.length === 3;

    if (_isTriangle) {
      // ── TRIANGOLI: scanline per-level (algoritmo portato dall'originale) ─
      // Usa localPoly (triangolo originale trasformato, NON inset) per evitare
      // che offsetPolygon deformi la punta dell'apice. marginPx viene applicato
      // come threshold sui segmenti X e sui limiti Y.
      // Sweep offset: parte da minX+marginPx, minY+marginPx + shifts (NO wrap
      // modulo step), identico all'originale runLayout.
      const _triPoly = transformPolygon(area.points, bestAng);
      const _triPolyAABB = polyAABB(_triPoly);
      const _minLX = _triPolyAABB.minX;
      const _minLY = _triPolyAABB.minY;

      const N_X = CONFIG.GRID_SUBDIV_X || 8;
      const N_Y = CONFIG.GRID_SUBDIV_Y || 8;
      for (let yi = 0; yi < N_Y; yi++) {
        const yShift = (stepH / N_Y) * yi;
        for (let xi = 0; xi < N_X; xi++) {
          const xShift = (stepW / N_X) * xi;
          const startY       = _minLY + marginPx + yShift;
          const gridOriginX  = _minLX + marginPx + xShift;
          const r = runScanlineTriangle(gridOriginX, startY, bestAng,
                                        _triPoly, _triPolyAABB,
                                        localBufExcl, localBufExclAABB, localAreaEdges);
          if (r.length > fullResult.length) fullResult = r;
        }
      }
    } else {
      // Passaggio sequenziale deterministico da (minX, minY):
      // sinistra→destra, alto→basso. Predittibile come posa reale.
      // Può dare 1-3 pannelli in meno su forme molto irregolari rispetto
      // alla vecchia ricerca coarse+refine, ma è il comportamento corretto.
      fullResult = runGlobalGrid(originX, originY, cols_max + 1, rows_max + 2, 0,
                                  localInsetAABB.minY, localInsetAABB.maxY);
    }
    _layoutCache.set(cacheKey, fullResult);
  }
  const cached = _layoutCache.get(cacheKey);
  if (maxCount >= cached.length) return cached;

  // Fill sequenziale: riga locale 0→N (top→bottom nel frame ruotato,
  // che parte da originY=minY), colonna 0→M (sinistra→destra).
  // Produce blocchi rettangolari puliti senza rimescolamento diagonale.
  const sorted = cached.slice().sort((a, b) =>
    a.row !== b.row ? a.row - b.row : a.column - b.column
  );
  return sorted.slice(0, maxCount);

  /**
   * Griglia globale deterministica — architettura "foglio di calcolo":
   *  1. Genera TUTTE le coordinate (row, col) che rientrano nell'AABB dell'inset
   *  2. Per ogni cella calcola la posizione reale tenendo conto dei camminamenti
   *  3. Filtra ogni cella per intersezione geometrica pura
   *  4. Emette solo le celle valide → pannelli
   */
  function runGlobalGrid(originX, originY, cols_max, rows_max, rowOffset, bandMin, bandMax) {
    if (rowOffset === undefined) rowOffset = 0;
    if (bandMin === undefined) bandMin = -Infinity;
    if (bandMax === undefined) bandMax =  Infinity;
    const result = [];
    const cos = Math.cos(bestAng), sin = Math.sin(bestAng);
    const EPS = 1e-4;
    const yMin = Math.max(bandMin === -Infinity ? localInsetAABB.minY : bandMin, localInsetAABB.minY);
    const yMax = Math.min(bandMax ===  Infinity ? localInsetAABB.maxY : bandMax, localInsetAABB.maxY);
    const maxRows = rows_max + 1;
    const maxCols = cols_max + 1;

    for (let row = 0; row < maxRows; row++) {
      const globalRow = row + rowOffset;
      const walkRowsBefore = (_wRowInt < 999999 && _wRowInt > 0)
        ? Math.floor(row / _wRowInt) : 0;
      const ly = originY + row * stepH + walkRowsBefore * _wRowWPx;

      if (ly > yMax - mHPx + EPS) break;
      if (ly + mHPx < yMin - EPS) continue;

      const rowStagger = stagger && (globalRow % 2 === 1) ? stepW * staggerPct : 0;

      // ── STEP 1: trova il primo col valido per questa riga ──────────────────
      // L'area utile (dopo offsetPolygon) può iniziare a destra di originX
      // su righe inclinate o con margine: scan forward finché non troviamo
      // un centro dentro il poligono inset E tutti i corners dentro l'area originale.
      let firstValidCol = null;
      for (let sc = 0; sc < maxCols; sc++) {
        const wkc = (_wColInt < 999999 && _wColInt > 0 && sc >= 0) ? Math.floor(sc / _wColInt) : 0;
        const slx = originX + sc * stepW + wkc * _wColWPx + rowStagger;
        if (slx > localPolyAABB.maxX + EPS) break;
        const scy = ly + mHPx / 2;
        // Centro dentro l'inset (margine ok) + tutti i corners dentro il poligono originale
        if (pointInPolygon({ x: slx + mWPx / 2, y: scy }, localInset, localInsetAABB)) {
          const sc0 = { x: slx + EPS,        y: ly + EPS };
          const sc1 = { x: slx + mWPx - EPS, y: ly + EPS };
          const sc2 = { x: slx + mWPx - EPS, y: ly + mHPx - EPS };
          const sc3 = { x: slx + EPS,        y: ly + mHPx - EPS };
          if (pointInPolygon(sc0, localPoly, localPolyAABB) &&
              pointInPolygon(sc1, localPoly, localPolyAABB) &&
              pointInPolygon(sc2, localPoly, localPolyAABB) &&
              pointInPolygon(sc3, localPoly, localPolyAABB)) {
            firstValidCol = sc;
            break;
          }
        }
      }
      if (firstValidCol === null) continue; // riga completamente fuori

      // ── STEP 2: riempi da firstValidCol — break appena esce dal poligono ──
      // break su uscita dal poligono (poligono convesso → region contigua);
      // continue se canPlacePanel fallisce (ostacolo, corner fuori, margin — ma la riga prosegue).
      for (let col = firstValidCol; col < maxCols; col++) {
        const walkColsBefore = (_wColInt < 999999 && _wColInt > 0 && col >= 0)
          ? Math.floor(col / _wColInt) : 0;
        const lx = originX + col * stepW + walkColsBefore * _wColWPx + rowStagger;

        if (lx > localPolyAABB.maxX + EPS) break;

        const cx = lx + mWPx / 2, cy = ly + mHPx / 2;

        // Early exit: centro uscito dall'inset → fine della fascia valida su questa riga.
        // (Ottimizzazione per aree convesse: la regione valida è contigua.)
        if (!pointInPolygon({ x: cx, y: cy }, localInset, localInsetAABB)) break;

        // Validazione completa tramite canPlacePanel — regola unica, identica allo snap manuale.
        if (!canPlacePanel(lx, ly, mWPx, mHPx, _placeCtx)) continue;

        const origin = localToGlobal(lx, ly, bestAng);
        result.push({
          x: origin.x, y: origin.y, w: mWPx, h: mHPx,
          wm: mW, hm: mH, pwr: pwr, ang: bestAng,
          localU: lx, localV: ly,
          axisUx: cos, axisUy: sin, axisVx: -sin, axisVy: cos,
          areaIdx: areaIdx, row: globalRow, column: col,
          strId: null, stringColor: null
        });
      }
    }
    return result;
  }

  /**
   * Scanline per-level (porta dell'algoritmo originale, solo per TRIANGOLI).
   * Accetta ang + geometrie come parametri per permettere di testare entrambi
   * gli angoli {0, π/2} senza dipendere dal bestAng pre-scelto da _computeBestAngle.
   */
  function runScanlineTriangle(gridOriginX, startY, _ang, _poly, _polyAABB, _bufExcl, _bufExclAABB, _areaEdges) {
    const result = [];
    const cos = Math.cos(_ang), sin = Math.sin(_ang);
    const EPS = 1e-4;
    let row = 0;
    let ly = startY;
    const _yLimit = _polyAABB.maxY - marginPx;

    while (ly + mHPx <= _yLimit + EPS) {
      // ── Camminamento orizzontale tra righe (se attivo) ─────────────────
      if (_wRowInt < 999999 && _wRowInt > 0 && row > 0 && row % _wRowInt === 0) {
        ly += _wRowWPx;
        if (ly + mHPx > _yLimit + EPS) break;
      }
      const rowStagger = stagger && (row % 2 === 1) ? stepW * staggerPct : 0;

      // ── Scanline per-level (9 campioni Y robusti) ──────────────────────
      const NSCAN = 9;
      const perLevel = [];
      for (let fi = 0; fi < NSCAN; fi++) {
        const t = fi / (NSCAN - 1);
        const ys = ly + mHPx * t + EPS * (fi % 2 === 0 ? 1 : -1);
        const xs = scanlineX(_poly, ys);
        xs.sort((a, b) => a - b);
        perLevel.push(xs);
      }
      const cntFreq = {};
      perLevel.forEach(xs => { const n = xs.length; cntFreq[n] = (cntFreq[n] || 0) + 1; });
      const targetN = parseInt(Object.entries(cntFreq).sort((a, b) => b[1] - a[1])[0][0]);
      if (targetN < 2) { ly += stepH; row++; continue; }
      const validLevels = perLevel.filter(xs => xs.length === targetN);
      const avgXs = [];
      for (let i = 0; i < targetN; i++) {
        avgXs.push(validLevels.reduce((s, xs) => s + xs[i], 0) / validLevels.length);
      }
      if (avgXs.length % 2 !== 0) avgXs.pop();
      if (avgXs.length < 2) { ly += stepH; row++; continue; }
      // Fondi segmenti adiacenti con gap < mWPx
      const segXs = [];
      for (let si = 0; si + 1 < avgXs.length; si += 2) {
        const left = avgXs[si], right = avgXs[si + 1];
        if (segXs.length >= 2 && left - segXs[segXs.length - 1] < mWPx) {
          segXs[segXs.length - 1] = right;
        } else {
          segXs.push(left, right);
        }
      }
      if (segXs.length < 2) { ly += stepH; row++; continue; }

      // ── Per ogni segmento, piazza pannelli snap al grid globale ────────
      // Applica marginPx come threshold sui bordi X del segmento (come originale)
      for (let si = 0; si + 1 < segXs.length; si += 2) {
        const segMinX = segXs[si] + marginPx;
        const segMaxX = segXs[si + 1] - marginPx;
        if (segMinX + mWPx > segMaxX) continue;

        const staggerShift = rowStagger;
        let lx = gridOriginX + staggerShift +
          Math.ceil((segMinX - gridOriginX - staggerShift) / stepW) * stepW;
        while (lx < segMinX - EPS) lx += stepW;
        if (lx + mWPx > segMaxX + EPS) continue;
        let col = Math.round((lx - gridOriginX - staggerShift) / stepW);

        while (lx + mWPx <= segMaxX + EPS) {
          // Camminamento verticale tra colonne
          if (_wColInt < 999999 && _wColInt > 0 && col > 0 && col % _wColInt === 0) {
            lx += _wColWPx; col++;
            if (lx + mWPx > segMaxX + EPS) break;
            continue;
          }
          const cx = lx + mWPx / 2, cy = ly + mHPx / 2;
          if (cx < _polyAABB.minX || cx > _polyAABB.maxX ||
              cy < _polyAABB.minY || cy > _polyAABB.maxY) {
            lx += stepW; col++; continue;
          }
          // Corners del pannello con piccolo inset interno (marginPx è già
          // applicato via segmenti X + yLimit — qui solo EPS per evitare
          // falsi negativi su vertici esatti del poligono).
          const cornerInset = Math.max(EPS, marginPx * 0.001);
          const corners = [
            { x: lx + cornerInset,         y: ly + cornerInset },
            { x: lx + mWPx - cornerInset,  y: ly + cornerInset },
            { x: lx + mWPx - cornerInset,  y: ly + mHPx - cornerInset },
            { x: lx + cornerInset,         y: ly + mHPx - cornerInset }
          ];
          if (!corners.every(pt => pointInPolygon(pt, _poly, _polyAABB))) {
            lx += stepW; col++; continue;
          }
          // Check distanza bordo per fallback concavo (non dovrebbe capitare su triangolo, safety)
          if (useEdgeMarginCheck && _areaEdges && marginPx > 0) {
            let tooClose = false;
            outerM: for (const corner of corners)
              for (const [ea, eb] of _areaEdges)
                if (distanceToSegment(corner, ea, eb) < marginPx) { tooClose = true; break outerM; }
            if (tooClose) { lx += stepW; col++; continue; }
          }
          // Ostacoli / exclusion buffer
          if (_bufExcl.length > 0) {
            const panelEdges = [
              [corners[0], corners[1]], [corners[1], corners[2]],
              [corners[2], corners[3]], [corners[3], corners[0]]
            ];
            const panelAABB_ = { minX: lx, maxX: lx + mWPx, minY: ly, maxY: ly + mHPx };
            let blocked = false;
            outer: for (let oi = 0; oi < _bufExcl.length; oi++) {
              const obs = _bufExcl[oi], obb = _bufExclAABB[oi];
              if (lx + mWPx < obb.minX || lx > obb.maxX ||
                  ly + mHPx < obb.minY || ly > obb.maxY) continue;
              for (const pt of corners)
                if (pointInPolygon(pt, obs, obb)) { blocked = true; break outer; }
              for (const obsPt of obs)
                if (pointInPolygon(obsPt, corners, panelAABB_)) { blocked = true; break outer; }
              for (const [pe0, pe1] of panelEdges)
                for (let i = 0; i < obs.length; i++) {
                  if (_segsIntersect(pe0, pe1, obs[i], obs[(i + 1) % obs.length])) { blocked = true; break outer; }
                }
            }
            if (blocked) { lx += stepW; col++; continue; }
          }

          const origin = localToGlobal(lx, ly, _ang);
          result.push({
            x: origin.x, y: origin.y, w: mWPx, h: mHPx,
            wm: mW, hm: mH, pwr: pwr, ang: _ang,
            localU: lx, localV: ly,
            axisUx: cos, axisUy: sin, axisVx: -sin, axisVy: cos,
            areaIdx: areaIdx, row: row, column: col,
            strId: null, stringColor: null
          });
          lx += stepW; col++;
        }
      }

      ly += stepH;
      row++;
    }
    return result;
  }
}

// ── filterIsolatedPanels ─────────────────────────────────────────────────────

/**
 * Rimuove pannelli isolati (senza vicini ortogonali nella stessa area).
 * Fix: usa solo adjacenza 4-direzionale (no diagonali) e soglia per area ≤ 5.
 */
function filterIsolatedPanels(panelList) {
  if (panelList.length <= 3) return panelList;
  const byArea = {};
  panelList.forEach((p, i) => {
    const k = p.areaIdx;
    if (!byArea[k]) byArea[k] = [];
    byArea[k].push(i);
  });
  const keep = new Set();
  // Solo 4 direzioni ortogonali — più permissivo per aree strette e triangolari
  const ORTHO = [[0,1],[0,-1],[1,0],[-1,0]];
  Object.values(byArea).forEach(indices => {
    // Aree piccole: mantieni tutti (erano già visualmente utili)
    if (indices.length <= 5) { indices.forEach(i => keep.add(i)); return; }
    const grid = new Map();
    indices.forEach(i => {
      const p = panelList[i];
      grid.set(`${p.row},${p.column}`, i);
    });
    indices.forEach(i => {
      const p = panelList[i];
      for (const [dr, dc] of ORTHO) {
        if (grid.has(`${p.row+dr},${p.column+dc}`)) { keep.add(i); return; }
      }
    });
  });
  return panelList.filter((_, i) => keep.has(i));
}

// ── layoutBestOrientation ─────────────────────────────────────────────────────

/**
 * Sceglie l'orientazione pannello migliore e ritorna il layout ottimale.
 * Usato da engineeringLayout e _relayoutArea come helper centrale.
 */
function _layoutBestOrientation(area, areaIdx, mWbase, mHbase, maxCount) {
  const aOrient = area.orientation || panelOrientation || 'auto';
  if (aOrient === 'portrait') {
    // Portrait: il lato corto (W) è orizzontale, il lato lungo (H) è verticale.
    // Forza angolo 0 per garantire pannello visivamente verticale,
    // poi prova anche gli angoli dei bordi dell'area per allineamento.
    const bestEdgeAng = _findBestEdgeAngle(area, mWbase, mHbase);
    return layoutSingleArea(area, areaIdx, mWbase, mHbase, maxCount, bestEdgeAng);
  } else if (aOrient === 'landscape') {
    // Landscape: il lato lungo (H→W) è orizzontale, il lato corto (W→H) è verticale.
    // Scambia le dimensioni E forza l'angolo coerente.
    const bestEdgeAng = _findBestEdgeAngle(area, mHbase, mWbase);
    return layoutSingleArea(area, areaIdx, mHbase, mWbase, maxCount, bestEdgeAng);
  } else {
    // Auto: usa la STESSA strategia angolo di portrait/landscape espliciti
    // (_findBestEdgeAngle, filtrata ±45°) per entrambi gli orientamenti,
    // poi sceglie quello che piazza più pannelli.
    // Prima usava layoutSingleArea senza forcedAng → angoli fuori ±45° che
    // vincevano su _exactCountCached (stima AABB) ma perdevano nel layout
    // reale con margini/ostacoli/walkways → auto < max(portrait, landscape).
    const angP = _findBestEdgeAngle(area, mWbase, mHbase);
    const angL = _findBestEdgeAngle(area, mHbase, mWbase);
    const rP = layoutSingleArea(area, areaIdx, mWbase, mHbase, maxCount, angP);
    const rL = layoutSingleArea(area, areaIdx, mHbase, mWbase, maxCount, angL);
    return rL.length > rP.length ? rL : rP;
  }
}

/**
 * Trova il miglior angolo allineato ai bordi dell'area (filtrato a ±45°).
 * Usato da tutti i modi (portrait, landscape, auto) per garantire che
 * l'angolo scelto non ruoti il pannello nella direzione opposta.
 */
function _findBestEdgeAngle(area, mW, mH) {
  const gap = Math.max(0, parseFloat(DOM.ps ? DOM.ps.value : 0) || 0) / 100;
  const mWPx = mW * scale, mHPx = mH * scale, gapPx = gap * scale;
  const stepW = mWPx + gapPx, stepH = mHPx + gapPx;

  // Raccogli angoli dai bordi dell'area (normalizzati a [-45°, +45°])
  const candidates = [0];
  for (let i = 0; i < area.points.length; i++) {
    const j = (i + 1) % area.points.length;
    const dx = area.points[j].x - area.points[i].x;
    const dy = area.points[j].y - area.points[i].y;
    if (Math.sqrt(dx * dx + dy * dy) < 1e-6) continue;
    let a = Math.atan2(dy, dx);
    // Normalizza in [-π/2, π/2]
    while (a >  Math.PI / 2) a -= Math.PI;
    while (a < -Math.PI / 2) a += Math.PI;
    // Aggiungi solo angoli vicini a 0 (±45°) — quelli vicini a ±90°
    // ruoterebbero il pannello nella direzione opposta
    if (Math.abs(a) <= Math.PI / 4 + 0.01) {
      candidates.push(a);
    }
    // Aggiungi anche la perpendicolare se è vicina a 0
    let perp = a + Math.PI / 2;
    if (perp >  Math.PI / 2) perp -= Math.PI;
    if (perp < -Math.PI / 2) perp += Math.PI;
    if (Math.abs(perp) <= Math.PI / 4 + 0.01) {
      candidates.push(perp);
    }
  }

  // Valuta ogni candidato con conteggio esatto
  let bestAng = 0, bestCnt = -1;
  for (const a of candidates) {
    const cnt = _exactCountCached(area.points, a, mWPx, mHPx, stepW, stepH, 999999, 999999);
    if (cnt > bestCnt || (cnt === bestCnt && Math.abs(a) < Math.abs(bestAng))) {
      bestCnt = cnt;
      bestAng = a;
    }
  }
  return bestAng;
}

// ── layoutConcaveArea ─────────────────────────────────────────────────────────

/**
 * Layout per aree concave (L, U, T): decompone il poligono in parti quasi-convesse,
 * applica layout indipendente su ciascuna (con angolo globale) e unisce senza overlap.
 *
 * Strategia merge:
 *   - ordina parti per area (largest first → riempie zone grandi prima)
 *   - per ogni pannello della parte successiva: scarta se sovrappone a pannello già occupato
 *   - mantiene stessa areaIdx e ang del pannello originale → cablaggio coerente
 */
function layoutConcaveArea(area, areaIdx, mWbase, mHbase, maxCount) {
  const parts = _decomposeConcave(area.points);

  // Se la decomposizione non porta benefici (1 sola parte), usa layout diretto
  if (parts.length <= 1) {
    return _layoutBestOrientation(area, areaIdx, mWbase, mHbase, maxCount);
  }

  // Ordina parti per area (largest first → riempie blocchi grandi prima)
  const _polyArea = pts => { let s=0; for(let i=0;i<pts.length;i++){const j=(i+1)%pts.length; s+=pts[i].x*pts[j].y-pts[j].x*pts[i].y;} return Math.abs(s)/2; };
  parts.sort((a, b) => _polyArea(b) - _polyArea(a));

  // Angolo ibrido: globalAng come default per coerenza visiva, ma ogni sotto-area
  // può fare fallback al proprio localAng se globalAng produce troppo pochi pannelli.
  // Soglia: se globalAng ≥ 80% di localAng → mantieni globale, altrimenti usa locale.
  // Questo risolve il caso L/U-shape con bracci ortogonali: il braccio "secondario"
  // ha spessore < altezza pannello nell'angolo globale → 0 pannelli → fallback automatico.
  const ANG_THRESHOLD = 0.8;
  const ANG_EPS = 1e-3; // angoli entro 0.001 rad = stesso angolo

  const aOrient = area.orientation || panelOrientation || 'auto';
  const { gap, walkRowInt, walkColInt } = readLayoutParams(area);
  const gapPx = gap * scale;

  // Angoli globali calcolati una volta sull'area intera (uno per orientamento)
  // Tutti i modi usano _findBestEdgeAngle (filtrata ±45°) per coerenza con
  // _layoutBestOrientation — evita angoli che vincono su AABB ma perdono nel layout reale.
  const globalAngP = _findBestEdgeAngle(area, mWbase, mHbase);
  const globalAngL = (aOrient === 'portrait') ? globalAngP : _findBestEdgeAngle(area, mHbase, mWbase);

  // Sceglie l'angolo migliore per una sotto-area in un dato orientamento.
  // Usa globalAng se ≥80% del localAng, altrimenti usa localAng.
  const _pickAng = (part, globalAng, mW, mH) => {
    const mWPx = mW * scale, mHPx = mH * scale;
    const stepW = mWPx + gapPx, stepH = mHPx + gapPx;
    const cntG = _exactCountCached(part, globalAng, mWPx, mHPx, stepW, stepH, 999999, 999999);
    // localAng usa sempre _findBestEdgeAngle (±45°) per coerenza
    const fakeA = { ...area, points: part };
    const localAng = _findBestEdgeAngle(fakeA, mW, mH);
    if (Math.abs(localAng - globalAng) < ANG_EPS) return globalAng;
    const cntL = _exactCountCached(part, localAng, mWPx, mHPx, stepW, stepH, 999999, 999999);
    return (cntG >= cntL * ANG_THRESHOLD) ? globalAng : localAng;
  };

  // Layout per sotto-area con orientamento e angolo scelti indipendentemente.
  // Per 'auto': ogni braccio sceglie il proprio orientamento migliore → risolve
  // il caso L-shape con braccio verticale (portrait) + orizzontale (landscape).
  //
  // NON usiamo _occupiedConflict tra parti diverse: i sotto-poligoni prodotti
  // da _decomposeConcave sono disgiunti per costruzione (taglio interno). Pannelli
  // in poligoni disgiunti non possono fisicamente sovrapporsi.
  // Usare _occupiedConflict cross-part con angoli diversi produce falsi positivi
  // (proiezione su frame sbagliato) → pannelli del braccio secondario scartati.
  const _all = [];
  for (const part of parts) {
    const remaining = maxCount - _all.length;
    if (remaining <= 0) break;
    const fakeArea = { ...area, points: part };

    let rawPanels;
    if (aOrient === 'portrait') {
      rawPanels = layoutSingleArea(fakeArea, areaIdx, mWbase, mHbase, remaining, _pickAng(part, globalAngP, mWbase, mHbase));
    } else if (aOrient === 'landscape') {
      rawPanels = layoutSingleArea(fakeArea, areaIdx, mHbase, mWbase, remaining, _pickAng(part, globalAngL, mHbase, mWbase));
    } else {
      // auto: prova entrambi e prende il migliore PER QUESTO BRACCIO
      const angP = _pickAng(part, globalAngP, mWbase, mHbase);
      const angL = _pickAng(part, globalAngL, mHbase, mWbase);
      const rP = layoutSingleArea(fakeArea, areaIdx, mWbase, mHbase, remaining, angP);
      const rL = layoutSingleArea(fakeArea, areaIdx, mHbase, mWbase, remaining, angL);
      rawPanels = rL.length > rP.length ? rL : rP;
    }

    _all.push(...rawPanels);
  }
  const result = _all;

  // Confronta con layout diretto (fallback per aree quasi-convesse).
  // Per aree genuinamente concave lo split copre entrambi i bracci → preferirlo
  // anche se il conteggio totale è leggermente inferiore al diretto (che massimizza
  // solo il braccio dominante lasciando l'altro vuoto).
  // Soglia: accetta split se ≥85% del diretto → il direct vince solo se ha un
  // vantaggio netto significativo (>15%), segnale che l'area è quasi-convessa.
  const direct = _layoutBestOrientation(area, areaIdx, mWbase, mHbase, maxCount);
  return result.length >= direct.length * 0.85 ? result : direct;
}

// ── engineeringLayout ────────────────────────────────────────────────────────

function engineeringLayout(target) {
  // Reset completo dello stato interazione (come deleteAllPanels)
  panels = []; strings = []; selectedPanels = new Set();
  hoveredPanel = -1; snapPreviewPos = null;
  isDraggingPanels = false; dragStartPoint = null; panelsStartPos = [];
  clearTimeout(_relayoutTimer);

  const mWbase = Math.max(0.1, parseFloat(DOM.pw.value) || 1);
  const mHbase = Math.max(0.1, parseFloat(DOM.pl.value) || 1.7);
  let totalPlaced = 0;
  // AP-17f: accumulate locally, then commit once through the store.
  const _next = [];
  installableAreas.forEach((area, areaIdx) => {
    const remaining = target - totalPlaced;
    if (remaining <= 0) return;
    // Usa layout concavo per aree con vertici reflex, diretto altrimenti
    const fn = _isConcavePolygon(area.points) ? layoutConcaveArea : _layoutBestOrientation;
    const bestResult = fn(area, areaIdx, mWbase, mHbase, remaining);
    _next.push(...bestResult);
    totalPlaced += bestResult.length;
  });
  globalThis.setStoreSlice('panels', _next);
  installableAreas.forEach((_, areaIdx) => _recomputeAreaWalkways(areaIdx));
  // UI completa — uguale a deleteAllPanels per coerenza visiva
  updateAreaLists(); updateStats(); updateStringList(); updateLegend();
  _updateToolbarGroups();
  draw();
}

// ── Snap grid ────────────────────────────────────────────────────────────────

/**
 * Implementazione unificata snap griglia.
 * mode='drop': post-drag snap con obstacle check completo + grid 5×5
 * mode='live': snap magnetico in tempo reale, no obstacle check, grid 3×3
 */
function _snapPanelToGridImpl(panel, refU, refV, mode) {
  const gap = parseFloat(DOM.ps.value) / 100;
  const mWPx = panel.w, mHPx = panel.h, gapPx = gap * scale;
  const stepW = mWPx + gapPx, stepH = mHPx + gapPx;
  const area = installableAreas[panel.areaIdx];
  if (!area) return null;

  // ── Geometrie area in coord locali (frame del pannello) ─────────────────────
  const localPoly     = transformPolygon(area.points, panel.ang);
  const localPolyAABB = polyAABB(localPoly);

  // Inset (margine di sicurezza) — stesso calcolo di layoutSingleArea
  const marginM  = Math.max(0, parseFloat(DOM.safetyMargin.value) || 0) / 100;
  const marginPx_  = marginM * scale;
  let localInset, localInsetAABB, useEdgeMarginCheck_ = false, localAreaEdges_ = null;
  if (marginPx_ > 0) {
    const _cand = offsetPolygon(area.points, -marginPx_);
    if (_isValidPoly(_cand) && !_isSelfIntersecting(_cand)) {
      localInset = transformPolygon(_cand, panel.ang);
    } else {
      localInset = localPoly.map(p => ({ ...p }));
      useEdgeMarginCheck_ = true;
      localAreaEdges_ = localPoly.map((_, i, arr) => [arr[i], arr[(i + 1) % arr.length]]);
    }
  } else {
    localInset = localPoly.map(p => ({ ...p }));
  }
  localInsetAABB = polyAABB(localInset);

  // ── Candidati snap (griglia dai vicini + griglia assoluta) ──────────────────
  const candidates = new Set();
  const addCandidate = (u, v) => candidates.add(`${u.toFixed(3)},${v.toFixed(3)}`);

  const neighborRange = 1;
  panels.forEach(other => {
    if (other === panel || other.areaIdx !== panel.areaIdx) return;
    for (let dr = -neighborRange; dr <= neighborRange; dr++)
      for (let dc = -neighborRange; dc <= neighborRange; dc++)
        addCandidate(other.localU + dc * stepW, other.localV + dr * stepH);
  });

  const gridRange = mode === 'drop' ? 2 : 1;
  for (let dr = -gridRange; dr <= gridRange; dr++)
    for (let dc = -gridRange; dc <= gridRange; dc++)
      addCandidate(Math.round((refU + dc * stepW) / stepW) * stepW,
                   Math.round((refV + dr * stepH) / stepH) * stepH);

  // ── Ostacoli in coord locali (solo mode='drop') ──────────────────────────────
  let localExcl = [], localExclAABB = [];
  if (mode === 'drop') {
    const obstDistPx = parseFloat(DOM.obstacleDistance.value) * scale;
    const _snapAreaAABB = polyAABB(area.points);
    const relevantExclRaw = [
      ...exclusionAreas.map(a => a.points),
      ...technicalObjects
        .filter(obj => {
          const poly = techObjectToPolygon(obj);
          if (pointInPolygon(obj, area.points, _snapAreaAABB)) return true;
          if (poly.some(p => pointInPolygon(p, area.points, _snapAreaAABB))) return true;
          if (area.points.some(p => pointInPolygon(p, poly, polyAABB(poly)))) return true;
          return false;
        })
        .map(obj => techObjectToPolygon(obj))
    ];
    // Espandi ostacoli di obstDistPx (stesso comportamento di layoutSingleArea)
    const buffered = obstDistPx > 0
      ? relevantExclRaw.map(pts => offsetPolygon(pts, obstDistPx))
      : relevantExclRaw.map(pts => pts.map(p => ({ ...p })));
    localExcl     = buffered.map(pts => transformPolygon(pts, panel.ang));
    localExclAABB = localExcl.map(obs => polyAABB(obs));
  }

  // ── Contesto canPlacePanel — usato per ogni candidato ───────────────────────
  // otherPanels: tutti i pannelli della stessa area tranne quello in drag.
  // AABB overlap reale invece del vecchio confronto localU/V approssimato.
  const snapCtx = {
    localInset, localInsetAABB,
    localPoly,  localPolyAABB,
    localExcl,  localExclAABB,
    useEdgeMarginCheck: useEdgeMarginCheck_,
    localAreaEdges: localAreaEdges_,
    marginPx: marginPx_,
    // 'live': solo check geometria area (veloce, per preview visivo)
    // 'drop': check completo incluso overlap con altri pannelli
    panelAng: panel.ang,
    otherPanels: mode === 'drop'
      ? panels.filter(p => p !== panel && p.areaIdx === panel.areaIdx)
      : null
  };

  // ── Selezione candidato migliore (più vicino al punto di rilascio) ───────────
  let bestDist = Infinity, bestU = null, bestV = null;
  for (const key of candidates) {
    const [lx, ly] = key.split(',').map(Number);
    if (!canPlacePanel(lx, ly, mWPx, mHPx, snapCtx)) continue;
    const dist = (lx - refU) ** 2 + (ly - refV) ** 2;
    if (dist < bestDist) { bestDist = dist; bestU = lx; bestV = ly; }
  }
  return bestU !== null ? { localU: bestU, localV: bestV } : null;
}

function snapPanelToGrid(panel) {
  return _snapPanelToGridImpl(panel, panel.localU, panel.localV, 'drop');
}

function snapPanelToGridLive(panel, rawU, rawV) {
  return _snapPanelToGridImpl(panel, rawU, rawV, 'live');
}

// ── findPanelAtPoint ─────────────────────────────────────────────────────────

function findPanelAtPoint(p) {
  for (let i = panels.length - 1; i >= 0; i--) {
    const pan = panels[i];
    if (pan.axisUx !== undefined) {
      const pox = pan.localU * pan.axisUx + pan.localV * pan.axisVx;
      const poy = pan.localU * pan.axisUy + pan.localV * pan.axisVy;
      const dpu = (p.x - pox) * pan.axisUx + (p.y - poy) * pan.axisUy;
      const dpv = (p.x - pox) * pan.axisVx + (p.y - poy) * pan.axisVy;
      if (dpu >= 0 && dpu <= pan.w && dpv >= 0 && dpv <= pan.h) return i;
    } else {
      if (p.x >= pan.x && p.x <= pan.x + pan.w && p.y >= pan.y && p.y <= pan.y + pan.h) return i;
    }
  }
  return -1;
}

// ── deleteAllPanels / deleteSelectedPanels ───────────────────────────────────

function deleteAllPanels() {
  if (!confirm('Eliminare TUTTI i moduli fotovoltaici?')) return;
  snapshot();
  panels = []; strings = []; selectedPanels = new Set(); hoveredPanel = -1;
  isDraggingPanels = false; panelsStartPos = [];
  if (moveMode) {
    moveMode = false;
    canvas.style.cursor = 'default';
    if (DOM.moveBtn) DOM.moveBtn.classList.remove('active');
  }
  updateAreaLists(); updateStats(); updateStringList(); updateLegend();
  if (DOM.deletePanelsBtn) DOM.deletePanelsBtn.style.display = 'none';
  _updateToolbarGroups();
  draw();
}

function deleteSelectedPanels() {
  if (selectedPanels.size === 0) return;
  snapshot();
  // AP-17f: rebuild and commit through store.
  globalThis.setStoreSlice('panels', panels.filter((_, idx) => !selectedPanels.has(idx)));
  // Aggiorna riferimenti stringa: rimuovi pannelli orfani
  strings.forEach(str => {
    str.panels = str.panels.filter(sp =>
      panels.some(p => p.areaIdx === sp.areaIdx && p.row === sp.row && p.column === sp.column));
  });
  clearTimeout(_relayoutTimer);
  selectedPanels = new Set(); hoveredPanel = -1;
  if (panels.length === 0) {
    strings = [];
    if (DOM.deletePanelsBtn) DOM.deletePanelsBtn.style.display = 'none';
    _updateToolbarGroups();
    if (moveMode) {
      moveMode = false;
      canvas.style.cursor = 'default';
      if (DOM.moveBtn) DOM.moveBtn.classList.remove('active');
    }
    updateStringList(); updateLegend();
  } else if (strings.length > 0) {
    genStrings(strings.length);
  }
  updateAreaLists(); updateStats(); draw();
}

// ── _recomputeAreaWalkways ────────────────────────────────────────────────────

/**
 * Calcola le fasce visive dei camminamenti per l'area idx e le salva su
 * area._walkways = [{ corners:[{x,y}×4] }, ...].
 * Funziona anche quando il camminamento cade oltre l'ultimo pannello.
 */
function _recomputeAreaWalkways(idx) {
  const area = installableAreas[idx];
  if (!area) return;
  area._walkways = [];
  const ap = panels.filter(p => p.areaIdx === idx);
  if (ap.length === 0) return;

  const { walkColInt, walkColWidth, walkRowInt, walkRowWidth, gap } = readLayoutParams(area);
  const walkColWidthPx = walkColWidth * scale;
  const walkRowWidthPx = walkRowWidth * scale;
  if ((walkColInt >= 999999 || walkColWidthPx <= 0) &&
      (walkRowInt >= 999999 || walkRowWidthPx <= 0)) return;

  const mWPx = ap[0].w, mHPx = ap[0].h;
  const gapPx = gap * scale;
  const stepW = mWPx + gapPx, stepH = mHPx + gapPx;
  const ang   = ap[0].ang || 0;
  const ux = Math.cos(ang), uy = Math.sin(ang);
  const vx = -Math.sin(ang), vy = Math.cos(ang);

  // Inverso: area points → spazio locale (rotazione -ang)
  const cos_ = Math.cos(-ang), sin_ = Math.sin(-ang);
  const localPts = area.points.map(p => ({
    u: p.x * cos_ - p.y * sin_,
    v: p.x * sin_ + p.y * cos_,
  }));
  const aMinU = Math.min(...localPts.map(p => p.u));
  const aMaxU = Math.max(...localPts.map(p => p.u));
  const aMinV = Math.min(...localPts.map(p => p.v));
  const aMaxV = Math.max(...localPts.map(p => p.v));

  // Riferimento griglia: pannello con column >= 0 e row pari (no stagger offset).
  const pRef = ap.find(p => p.column >= 0 && p.row % 2 === 0)
            || ap.find(p => p.column >= 0)
            || ap[0];
  const toWorld = (u, v) => ({ x: u * ux + v * vx, y: u * uy + v * vy });

  // Quando bestAng ≈ 90° l'asse U punta verso il basso (verticale schermo) e V
  // verso sinistra (orizzontale schermo): walkColInt genera strisce visivamente
  // orizzontali e walkRowInt genera strisce verticali — l'opposto di quanto atteso.
  // Fix: se U è più verticale che orizzontale, scambia le assegnazioni col↔row.
  const uIsHoriz = Math.abs(Math.cos(ang)) >= Math.abs(Math.sin(ang));
  const _rcColInt  = uIsHoriz ? walkColInt     : walkRowInt;
  const _rcColWPx  = uIsHoriz ? walkColWidthPx : walkRowWidthPx;
  const _rcRowInt  = uIsHoriz ? walkRowInt     : walkColInt;
  const _rcRowWPx  = uIsHoriz ? walkRowWidthPx : walkColWidthPx;

  // ── Camminamenti verticali (tra colonne) ────────────────────────────────
  // _rcColInt = Camm.V effettivo: gap ogni N colonne → striscia in direzione V
  if (_rcColInt < 999999 && _rcColWPx > 0) {
    // Il pannello di riferimento ha .column e .localU allineati al loop col di runGlobalGrid,
    // dove _wColInt è già swappato. Quindi usiamo sempre pRef.column e pRef.localU.
    const originU = pRef.localU
      - pRef.column * stepW
      - Math.floor(pRef.column / _rcColInt) * _rcColWPx;

    for (let g = 1; g <= 20; g++) {
      const lastCol   = g * _rcColInt - 1;
      const gapStartU = originU + lastCol * stepW
                        + (g - 1) * _rcColWPx + mWPx;
      const gapEndU   = gapStartU + _rcColWPx;

      if (gapStartU >= aMaxU) break;
      const clampEnd = Math.min(gapEndU, aMaxU);

      area._walkways.push({ type: 'col', corners: [
        toWorld(gapStartU, aMinV),
        toWorld(clampEnd,  aMinV),
        toWorld(clampEnd,  aMaxV),
        toWorld(gapStartU, aMaxV),
      ]});
    }
  }

  // ── Camminamenti orizzontali (tra righe) ────────────────────────────────
  // _rcRowInt = Camm.H effettivo: gap ogni N righe → striscia in direzione U
  if (_rcRowInt < 999999 && _rcRowWPx > 0) {
    // Analogamente: pRef.row e pRef.localV sono allineati al loop row di runGlobalGrid.
    const originV = pRef.localV
      - pRef.row * stepH
      - Math.floor(pRef.row / _rcRowInt) * _rcRowWPx;

    for (let g = 1; g <= 20; g++) {
      const lastRow   = g * _rcRowInt - 1;
      const gapStartV = originV + lastRow * stepH
                        + (g - 1) * _rcRowWPx + mHPx;
      const gapEndV   = gapStartV + _rcRowWPx;

      if (gapStartV >= aMaxV) break;
      const clampEnd = Math.min(gapEndV, aMaxV);

      area._walkways.push({ type: 'row', corners: [
        toWorld(aMinU, gapStartV),
        toWorld(aMaxU, gapStartV),
        toWorld(aMaxU, clampEnd),
        toWorld(aMinU, clampEnd),
      ]});
    }
  }
}

// ── _relayoutArea ────────────────────────────────────────────────────────────

/**
 * Ricalcola solo l'area idx mantenendo il massimo di pannelli.
 *
 * Gestione stato connesso:
 * - selectedPanels: salva identità stabile (areaIdx|row|col) per pannelli
 *   NON appartenenti all'area rilayoutata, poi ricostruisce gli indici dopo.
 *   I pannelli dell'area relaid vengono deselezionati (non esistono più).
 * - hoveredPanel: resettato a -1 (l'indice non è più valido dopo filter+push).
 * - dragState: reset completo se era in corso un drag (protezione extra).
 * - strings: rigenerata se presente; updateStringList+updateLegend sincronizzati.
 */
function _relayoutArea(idx) {
  if (!installableAreas[idx]) return;
  invalidateLayoutCache();

  // ── 1. Salva selezioni stabili (solo pannelli fuori dall'area da relayoutare) ──
  const stableSelected = new Set();
  for (const si of selectedPanels) {
    const p = panels[si];
    if (p && p.areaIdx !== idx)
      stableSelected.add(`${p.areaIdx}|${p.row}|${p.column}`);
  }

  // ── 2. Reset stato interazione — indici vecchi non sono più validi ──────────
  selectedPanels = new Set();
  hoveredPanel   = -1;
  snapPreviewPos = null;
  if (isDraggingPanels) {
    isDraggingPanels = false;
    dragStartPoint   = null;
    panelsStartPos   = [];
  }

  // ── 3. Relayout pannelli dell'area ──────────────────────────────────────────
  const mWbase = Math.max(0.1, parseFloat(DOM.pw.value) || 1);
  const mHbase = Math.max(0.1, parseFloat(DOM.pl.value) || 1.7);
  const area = installableAreas[idx];
  const maxC = (area.maxPanels != null) ? area.maxPanels : 999999;
  const fn = _isConcavePolygon(area.points) ? layoutConcaveArea : _layoutBestOrientation;
  const newPanels = fn(area, idx, mWbase, mHbase, maxC);
  // AP-17f: combined filter+append commit through store.
  globalThis.setStoreSlice('panels', panels.filter(p => p.areaIdx !== idx).concat(newPanels));

  // ── 4. Ripristina selezioni stabili con nuovi indici ────────────────────────
  panels.forEach((p, i) => {
    if (stableSelected.has(`${p.areaIdx}|${p.row}|${p.column}`))
      selectedPanels.add(i);
  });

  // ── 5. Aggiorna walkways + stringhe + UI completa ───────────────────────────
  _recomputeAreaWalkways(idx);
  if (strings.length > 0) genStrings(strings.length);
  updateAreaLists(); updateStats(); updateStringList(); updateLegend();
  _updateToolbarGroups();
  draw();
}

// ── Add / remove panels per area ─────────────────────────────────────────────

function _refreshAreaMaxCapacity(idx) {
  const area = installableAreas[idx];
  if (!area || !scale || scale <= 1) return;
  const mWbase = Math.max(0.1, parseFloat(DOM.pw.value) || 1);
  const mHbase = Math.max(0.1, parseFloat(DOM.pl.value) || 1.7);
  const fn = _isConcavePolygon(area.points) ? layoutConcaveArea : _layoutBestOrientation;
  area._maxCapacity = filterIsolatedPanels(fn(area, idx, mWbase, mHbase, 999999)).length;
}

function addAreaPanel(idx) {
  const area = installableAreas[idx];
  if (!area) return;
  if (area._maxCapacity == null) _refreshAreaMaxCapacity(idx);
  const current = panels.filter(p => p.areaIdx === idx).length;
  const trueMax = area._maxCapacity != null ? area._maxCapacity : 999999;
  if (current >= trueMax) return;
  snapshot();
  area.maxPanels = current + 1;
  _relayoutArea(idx);
  _refreshAreaMaxCapacity(idx);
  updateAreaLists();
}

function removeAreaPanel(idx) {
  const area = installableAreas[idx];
  if (!area) return;
  const current = panels.filter(p => p.areaIdx === idx).length;
  if (current <= 0) return;
  snapshot();
  area.maxPanels = current - 1;
  _relayoutArea(idx);
  _refreshAreaMaxCapacity(idx);
  updateAreaLists();
}

// ── Area stagger setters ─────────────────────────────────────────────────────

function setAreaStagger(idx, enabled) {
  if (!installableAreas[idx]) return;
  snapshot();
  installableAreas[idx].staggerEnabled = enabled;
  invalidateLayoutCache();
  updateAreaLists();
  if (panels.some(p => p.areaIdx === idx)) _relayoutArea(idx);
}

function setAreaStaggerOffset(idx, val) {
  if (!installableAreas[idx]) return;
  installableAreas[idx].staggerOffset = Math.min(90, Math.max(10, parseFloat(val) || 50));
  invalidateLayoutCache();
  draw();
}

function commitAreaStaggerOffset(idx, val) {
  snapshot();
  setAreaStaggerOffset(idx, val);
  if (panels.some(p => p.areaIdx === idx)) _relayoutArea(idx);
}

// ── Walkway setters H (righe) ─────────────────────────────────────────────────

function setAreaWalkRowEnabled(idx, v) {
  if (!installableAreas[idx]) return; snapshot();
  installableAreas[idx].walkRowEnabled = v;
  invalidateLayoutCache(); updateAreaLists();
  if (panels.some(p => p.areaIdx === idx)) _relayoutArea(idx); else draw();
}

function setAreaWalkRowInterval(idx, val) {
  if (!installableAreas[idx]) return;
  installableAreas[idx].walkRowInterval = Math.max(1, parseInt(val) || 3);
  invalidateLayoutCache(); draw();
}

function commitAreaWalkRowInterval(idx, val) {
  snapshot(); setAreaWalkRowInterval(idx, val);
  if (panels.some(p => p.areaIdx === idx)) _relayoutArea(idx);
}

function setAreaWalkRowWidth(idx, val) {
  if (!installableAreas[idx]) return;
  installableAreas[idx].walkRowWidth = Math.max(20, Math.min(400, parseFloat(val) || 80));
  invalidateLayoutCache(); draw();
}

function commitAreaWalkRowWidth(idx, val) {
  snapshot(); setAreaWalkRowWidth(idx, val);
  if (panels.some(p => p.areaIdx === idx)) _relayoutArea(idx);
}

// ── Walkway setters V (colonne) ───────────────────────────────────────────────

function setAreaWalkColEnabled(idx, v) {
  if (!installableAreas[idx]) return; snapshot();
  installableAreas[idx].walkColEnabled = v;
  invalidateLayoutCache(); updateAreaLists();
  if (panels.some(p => p.areaIdx === idx)) _relayoutArea(idx); else draw();
}

function setAreaWalkColInterval(idx, val) {
  if (!installableAreas[idx]) return;
  installableAreas[idx].walkColInterval = Math.max(1, parseInt(val) || 3);
  invalidateLayoutCache(); draw();
}

function commitAreaWalkColInterval(idx, val) {
  snapshot(); setAreaWalkColInterval(idx, val);
  if (panels.some(p => p.areaIdx === idx)) _relayoutArea(idx);
}

function setAreaWalkColWidth(idx, val) {
  if (!installableAreas[idx]) return;
  installableAreas[idx].walkColWidth = Math.max(20, Math.min(400, parseFloat(val) || 80));
  invalidateLayoutCache(); draw();
}

function commitAreaWalkColWidth(idx, val) {
  snapshot(); setAreaWalkColWidth(idx, val);
  if (panels.some(p => p.areaIdx === idx)) _relayoutArea(idx);
}

// ── Legacy compat — usato dal caricamento di vecchi progetti ─────────────────

function setAreaWalkways(idx, enabled)       { setAreaWalkRowEnabled(idx, enabled); }
function setAreaWalkwayInterval(idx, v)      { setAreaWalkRowInterval(idx, v); }
function commitAreaWalkwayInterval(idx, v)   { commitAreaWalkRowInterval(idx, v); }
function setAreaWalkwayWidth(idx, v)         { setAreaWalkRowWidth(idx, v); }
function commitAreaWalkwayWidth(idx, v)      { commitAreaWalkRowWidth(idx, v); }
function setAreaWalkwayDir(idx, dir) {
  // Setter ATOMICO: aggiorna entrambe le flag in una sola passata così da
  // evitare doppio snapshot(), doppia invalidazione cache e doppio _relayoutArea().
  if (!installableAreas[idx]) return;
  snapshot();
  const area = installableAreas[idx];
  if (dir === 'row') { area.walkRowEnabled = true;  area.walkColEnabled = false; }
  else               { area.walkColEnabled = true;  area.walkRowEnabled = false; }
  invalidateLayoutCache();
  updateAreaLists();
  if (panels.some(p => p.areaIdx === idx)) _relayoutArea(idx); else draw();
}

// ── Area preview (pannelli per area in realtime) ──────────────────────────────

function _scheduleAreaPreview() {
  clearTimeout(_previewDebounceTimer);
  _previewDebounceTimer = setTimeout(_computeAreaPreviews, 600);
}

function _computeAreaPreviews() {
  if (!scale || scale <= 1) return;
  const mWbase = Math.max(0.1, parseFloat(DOM.pw.value) || 1);
  const mHbase = Math.max(0.1, parseFloat(DOM.pl.value) || 1.7);
  const panelCountByArea = new Map();
  panels.forEach(p => panelCountByArea.set(p.areaIdx, (panelCountByArea.get(p.areaIdx) || 0) + 1));
  let changed = false;
  installableAreas.forEach((area, idx) => {
    const fn = _isConcavePolygon(area.points) ? layoutConcaveArea : _layoutBestOrientation;
    const best = filterIsolatedPanels(fn(area, idx, mWbase, mHbase, 999999)).length;
    area._maxCapacity = best;
    area._previewCount = panelCountByArea.has(idx) ? panelCountByArea.get(idx) : best;
    changed = true;
  });
  if (changed) updateAreaLists();
}
