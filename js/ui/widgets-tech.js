// ── js/ui/widgets-tech.js — tech object widget logic ──
// Extracted from ui.js in AP-16b3. Contains tech-object lifecycle,
// selection, rotation helpers, size updates, and tech sidebar/card UI
// used by the S5 technical objects workflow.
// Calling surface unchanged — all symbols remain available through
// bundle-scope globals.
'use strict';

// ── Oggetti tecnici ───────────────────────────────────────────────────────────

function startTechObject(type) {
  _techMode = type;
  mode = 'tech';
  canvas.style.cursor = 'crosshair';
  deselectTechObject();
  DOM.techSizeRow.style.display = 'block';
  DOM.techPlacingInfo.style.display = 'block';
  DOM.techBuffer.value = TECH_DEFAULT_BUFFER[type] || 0;
  Object.keys(TECH_LABELS).forEach(t => {
    const b = document.getElementById('techBtn_'+t);
    if (b) b.style.background = t === type ? 'var(--accent)' : '';
    if (b) b.style.color = t === type ? '#fff' : '';
  });
}

function cancelTechMode() {
  _techMode = null;
  mode = 'none';
  canvas.style.cursor = 'default';
  DOM.techSizeRow.style.display = 'none';
  DOM.techPlacingInfo.style.display = 'none';
  Object.keys(TECH_LABELS).forEach(t => {
    const b = document.getElementById('techBtn_'+t);
    if (b) { b.style.background = ''; b.style.color = ''; }
  });
}

function placeTechObject(worldPt) {
  const sizem = parseFloat(DOM.techSize.value) || 0.5;
  const sizePx = sizem * scale;
  snapshot();
  invalidateLayoutCache();
  // AP-17e: route write through store.
  globalThis.setStoreSlice('technicalObjects', technicalObjects.concat([{
    type: _techMode,
    x: worldPt.x, y: worldPt.y,
    sizePx: sizePx, sizem: sizem,
    bufferM: parseFloat(DOM.techBuffer.value) || 0,
    label: TECH_LABELS[_techMode],
    ang: 0,
    solarAngleDeg: _techMode === 'chimney' ? 30 : undefined
  }]));
  updateTechList();
  if (panels.length > 0) _relayout(); else draw();
  selectTechObject(technicalObjects.length - 1);
}

function delTechObject(i) {
  snapshot();
  invalidateLayoutCache();
  // AP-17e: route write through store.
  globalThis.setStoreSlice('technicalObjects', technicalObjects.filter((_, idx) => idx !== i));
  if (_selectedTechIdx === i) deselectTechObject();
  else if (_selectedTechIdx > i) _selectedTechIdx--;
  updateTechList();
  if (panels.length > 0) _relayout(); else draw();
}

function selectTechObject(i) {
  const obj = technicalObjects[i];
  if (!obj) return;
  _selectedTechIdx = i;
  const deg = Math.round((obj.ang||0) * 180 / Math.PI);
  DOM.techRot.value = deg;
  DOM.techRotVal.textContent = deg;
  DOM.techRotRow.style.display = 'block';
  DOM.techSize.value = obj.sizem || 0.5;
  DOM.techBuffer.value = obj.bufferM || 0;
  DOM.techSizeRow.style.display = 'block';
  if (obj.type === 'chimney') {
    if (DOM.techHeightRow) DOM.techHeightRow.style.display = 'block';
    if (DOM.techHeight)    DOM.techHeight.value = (obj.heightM || 1.5).toFixed(1);
  } else {
    if (DOM.techHeightRow) DOM.techHeightRow.style.display = 'none';
  }
}

function deselectTechObject() {
  _selectedTechIdx = -1;
  DOM.techRotRow.style.display = 'none';
  if (!_techMode) DOM.techSizeRow.style.display = 'none';
  if (DOM.techHeightRow) DOM.techHeightRow.style.display = 'none';
}

function rotateSkylight(deg) {
  DOM.techRotVal.textContent = deg;
  if (_selectedTechIdx < 0 || _selectedTechIdx >= technicalObjects.length) return;
  const obj = technicalObjects[_selectedTechIdx];
  obj.ang = deg * Math.PI / 180;
  invalidateLayoutCache();
  draw();
}

function _techRotHandlePos(obj) {
  const r = obj.sizePx / 2 * CONFIG.TECH_HANDLE_RATIO;
  const a = (obj.ang || 0) - Math.PI / 2;
  return { x: obj.x + r * Math.cos(a), y: obj.y + r * Math.sin(a) };
}

function _hitTestRotHandle(p, obj) {
  const h = _techRotHandlePos(obj);
  const hitR = Math.max(12 / z, obj.sizePx * 0.25);
  return Math.hypot(p.x - h.x, p.y - h.y) < hitR;
}

function updateSelectedTechSize() {
  if (_selectedTechIdx < 0 || _selectedTechIdx >= technicalObjects.length) return;
  const newSize = parseFloat(DOM.techSize.value);
  const newBuf  = parseFloat(DOM.techBuffer.value);
  const sizeOk = !isNaN(newSize) && newSize > 0;
  const bufOk  = !isNaN(newBuf)  && newBuf  >= 0;
  if (!sizeOk && !bufOk) return;
  snapshot();
  const obj = technicalObjects[_selectedTechIdx];
  if (sizeOk) { obj.sizem = newSize; obj.sizePx = newSize * scale; }
  if (bufOk)  { obj.bufferM = newBuf; }
  invalidateLayoutCache();
  updateAreaLists();
  if (panels.length > 0) _relayout(); else draw();
}

function updateTechList() { updateAreaLists(); }

function updateTechCardField(idx, field, rawVal) {
  const obj = technicalObjects[idx]; if (!obj) return;
  const val = parseFloat(rawVal); if (isNaN(val)) return;
  if (field==='size'   && val<=0) return;
  if (field==='buffer' && val<0)  return;
  if (field==='height' && val<=0) return;
  if (field==='solarAngle' && (val<5||val>89)) return;
  if (field==='size')        { obj.sizem=val; obj.sizePx=val*scale; invalidateLayoutCache(); }
  if (field==='sizeH')       { obj.sizeHm=val; obj.sizeHPx=val*scale; invalidateLayoutCache(); }
  if (field==='buffer')      { obj.bufferM=val; invalidateLayoutCache(); }
  if (field==='height')      { obj.heightM=val; invalidateLayoutCache(); }
  if (field==='solarAngle')  { obj.solarAngleDeg=val; invalidateLayoutCache(); }
  if (field==='rot')         { obj.ang=val*Math.PI/180; invalidateLayoutCache(); }
  draw();
}

function commitTechCardField(idx, field, rawVal) {
  snapshot();
  updateTechCardField(idx, field, rawVal);
  if (panels.length > 0) _relayout();
}

function _buildTechCard(obj, i) {
  const lc  = TECH_LIST_COLORS[obj.type] || '#aaa';
  const deg = Math.round((obj.ang||0)*180/Math.PI);
  const IS  = 'pointer-events:auto;width:58px;font-size:var(--fs-sm);padding:3px 6px;text-align:center;' +
              'border:1px solid var(--border-default);border-radius:4px;' +
              'background:var(--bg-input);color:var(--text-primary);box-sizing:border-box;';
  const lbl = (t) => `<span style="font-size:var(--fs-xs);font-weight:600;color:var(--text-secondary);margin-right:2px;">${t}</span>`;
  const ni  = (fld,val,min,max,step,xs) => {
    xs = xs || '';
    return `<input type="number" value="${val}" min="${min}" max="${max}" step="${step}"
      style="${IS}${xs}" oninput="updateTechCardField(${i},'${fld}',this.value)"
      onchange="commitTechCardField(${i},'${fld}',this.value)">`;
  };

  let fields = '';
  if (obj.type === 'skylight') {
    fields =
      lbl('L m') + ni('size',  obj.sizem.toFixed(1), 0.1, 10, 0.1) + ' ' +
      lbl('H m') + ni('sizeH', (obj.sizeHm||obj.sizem).toFixed(1), 0.1, 10, 0.1) +
      `<div style="display:flex;align-items:center;gap:5px;flex:1;min-width:80px;margin-left:4px;">
        <input type="range" min="0" max="179" value="${deg}" step="1"
          style="pointer-events:auto;flex:1;accent-color:var(--accent);cursor:pointer;"
          oninput="document.getElementById('tcr${i}').textContent=this.value;technicalObjects[${i}].ang=this.value*Math.PI/180;invalidateLayoutCache();draw();"
          onchange="snapshot();updateAreaLists();">
        <span id="tcr${i}" style="font-size:var(--fs-xs);color:var(--text-secondary);min-width:26px;">${deg}°</span>
      </div>`;
  } else if (obj.type === 'chimney') {
    fields = lbl('⌀ m') + ni('size', obj.sizem.toFixed(1), 0.1, 10, 0.1) + ' ' +
             lbl('h m')  + ni('height', (obj.heightM||1.5).toFixed(1), 0.1, 20, 0.1) + ' ' +
             lbl('el °') + ni('solarAngle', (obj.solarAngleDeg||30).toFixed(0), 10, 45, 1, 'width:44px;');
  } else {
    fields = lbl('⌀ m') + ni('size', obj.sizem.toFixed(1), 0.1, 10, 0.1);
  }

  return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">
    <span style="width:8px;height:8px;border-radius:50%;background:${lc};flex-shrink:0;"></span>
    <span style="font-size:var(--fs-sm);font-weight:600;color:${lc};min-width:72px;">${obj.label}</span>
    <div style="display:flex;align-items:center;gap:4px;flex:1;flex-wrap:wrap;">${fields}</div>
    <button class="delete-btn" style="pointer-events:auto;flex-shrink:0;" onclick="delTechObject(${i})">x</button>
  </div>`;
}

function _rotateExclusionTo(idx, targetDeg) {
  const area = exclusionAreas[idx];
  if (!area) return;
  const currentDeg = area._sliderAngle || 0;
  const delta = targetDeg - currentDeg;
  area._sliderAngle = targetDeg;
  const rad = delta * Math.PI / 180;
  const cx = area.points.reduce((s,p)=>s+p.x,0)/area.points.length;
  const cy = area.points.reduce((s,p)=>s+p.y,0)/area.points.length;
  const cos=Math.cos(rad),sin=Math.sin(rad);
  area.points = area.points.map(p=>{
    const dx=p.x-cx,dy=p.y-cy;
    return{x:cx+dx*cos-dy*sin, y:cy+dx*sin+dy*cos};
  });
  invalidateLayoutCache();
  if (panels.length > 0) _relayout(); else draw();
}

// ── toggleMoveMode / _updateToolbarGroups ─────────────────────────────────────
