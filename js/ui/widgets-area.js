// ── js/ui/widgets-area.js — area widget UI logic ──
// Extracted from ui.js in AP-16b2. Contains installable/exclusion area
// accordion toggles, UI builders, list rendering, and area list mutation
// helpers used by the S2 area workflow.
// Calling surface unchanged — all symbols remain available through
// bundle-scope globals.
'use strict';

// ── Accordion aree ─────────────────────────────────────────────────────────────

function toggleAreaAccordion() {
  _areaAccOpen = !_areaAccOpen;
  const list = DOM.areaList;
  const arrow = DOM.areaAccordionArrow;
  list.style.display = _areaAccOpen ? 'block' : 'none';
  arrow.style.transform = _areaAccOpen ? 'rotate(180deg)' : '';
}
function toggleExclusionAccordion() {
  _exclAccOpen = !_exclAccOpen;
  const list = DOM.exclusionList;
  const arrow = DOM.exclusionAccordionArrow;
  list.style.display = _exclAccOpen ? 'block' : 'none';
  arrow.style.transform = _exclAccOpen ? 'rotate(180deg)' : '';
}

// ── Costruttori HTML per liste aree ───────────────────────────────────────────

function _buildWalkwayUI(idx, areaObj, inpStyle, chkStyle, lbStyle) {
  const rOn  = areaObj ? (areaObj.walkRowEnabled !== undefined ? areaObj.walkRowEnabled : (areaObj.walkwaysEnabled && (areaObj.walkwayDir||'row')==='row' ? true : false)) : false;
  const rInt = areaObj ? (areaObj.walkRowInterval || areaObj.walkwayInterval || 3) : 3;
  const rW   = areaObj ? (areaObj.walkRowWidth    || areaObj.walkwayWidth    || 80): 80;
  const cOn  = areaObj ? (areaObj.walkColEnabled !== undefined ? areaObj.walkColEnabled : (areaObj.walkwaysEnabled && (areaObj.walkwayDir||'row')==='col' ? true : false)) : false;
  const cInt = areaObj ? (areaObj.walkColInterval || areaObj.walkwayInterval || 3) : 3;
  const cW   = areaObj ? (areaObj.walkColWidth    || areaObj.walkwayWidth    || 80): 80;
  const inp38 = inpStyle.replace('48px','38px');
  const rowH =
    `<div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-bottom:2px;">` +
      `<label style="${chkStyle}"><input type="checkbox" style="pointer-events:auto;" ${rOn?'checked':''} onchange="setAreaWalkRowEnabled(${idx},this.checked)"><span style="${lbStyle}">↔ Camm. H</span></label>` +
      (rOn ? `<span style="font-size:var(--fs-xs);color:var(--text-tertiary);">ogni</span>` +
             `<input type="number" value="${rInt}" min="1" max="30" style="${inp38}" oninput="setAreaWalkRowInterval(${idx},this.value)" onchange="commitAreaWalkRowInterval(${idx},this.value)">` +
             `<span style="font-size:var(--fs-xs);color:var(--text-tertiary);">file ·</span>` +
             `<input type="number" value="${rW}" min="20" max="400" style="${inpStyle}" oninput="setAreaWalkRowWidth(${idx},this.value)" onchange="commitAreaWalkRowWidth(${idx},this.value)">` +
             `<span style="font-size:var(--fs-xs);color:var(--text-tertiary);">cm</span>` : '') +
    `</div>`;
  const colH =
    `<div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;">` +
      `<label style="${chkStyle}"><input type="checkbox" style="pointer-events:auto;" ${cOn?'checked':''} onchange="setAreaWalkColEnabled(${idx},this.checked)"><span style="${lbStyle}">↕ Camm. V</span></label>` +
      (cOn ? `<span style="font-size:var(--fs-xs);color:var(--text-tertiary);">ogni</span>` +
             `<input type="number" value="${cInt}" min="1" max="30" style="${inp38}" oninput="setAreaWalkColInterval(${idx},this.value)" onchange="commitAreaWalkColInterval(${idx},this.value)">` +
             `<span style="font-size:var(--fs-xs);color:var(--text-tertiary);">col ·</span>` +
             `<input type="number" value="${cW}" min="20" max="400" style="${inpStyle}" oninput="setAreaWalkColWidth(${idx},this.value)" onchange="commitAreaWalkColWidth(${idx},this.value)">` +
             `<span style="font-size:var(--fs-xs);color:var(--text-tertiary);">cm</span>` : '') +
    `</div>`;
  return rowH + colH;
}

function _buildAreaHeader(idx, ac, orient, panelCount, areaMq) {
  const btnStyle = (o, activeColor) => {
    const active = orient === o;
    return `pointer-events:auto;padding:2px 7px;border-radius:3px;font-size:var(--fs-xs);` +
           `cursor:pointer;font-family:var(--font-main);` +
           `font-weight:${active?'700':'400'};` +
           `background:${active?activeColor:'transparent'};` +
           `color:${active?'#fff':'var(--text-secondary)'};` +
           `border:1px solid ${active?activeColor:'var(--border-default)'};`;
  };
  const expVal = installableAreas[idx] ? (installableAreas[idx].exposure || '') : '';
  const expLbl = EXP_LABELS[expVal] || '';
  const expBadgeStyle = expVal ? `background:${EXP_COLORS[expVal]||'#64748b'};color:#fff;padding:1px 6px;border-radius:10px;font-size:10px;font-weight:600;margin-left:4px;` : '';
  const expBadge = expLbl ? `<span style="${expBadgeStyle}">${expLbl}</span>` : '';

  const areaObj   = installableAreas[idx];
  const sOn       = areaObj ? (areaObj.staggerEnabled || false) : false;
  const sOff      = areaObj ? (areaObj.staggerOffset  || 50)   : 50;

  const inpStyle  = 'pointer-events:auto;width:48px;padding:2px 5px;font-size:var(--fs-xs);' +
                    'border:1px solid var(--border-default);border-radius:3px;' +
                    'background:var(--bg-primary);color:var(--text-primary);font-family:var(--font-main);';
  const chkStyle  = 'pointer-events:auto;display:flex;align-items:center;gap:4px;cursor:pointer;';
  const lbStyle   = 'pointer-events:auto;cursor:pointer;font-size:var(--fs-xs);color:var(--text-secondary);';

  const staggerRow =
    `<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:4px;">` +
      `<label style="${chkStyle}">` +
        `<input type="checkbox" style="pointer-events:auto;" ${sOn?'checked':''} onchange="setAreaStagger(${idx},this.checked)">` +
        `<span style="${lbStyle}">Sfalsato</span>` +
      `</label>` +
      (sOn
        ? `<input type="number" value="${sOff}" min="10" max="90" step="5" title="Sfalsamento %" style="${inpStyle}" oninput="setAreaStaggerOffset(${idx},this.value)" onchange="commitAreaStaggerOffset(${idx},this.value)">` +
          `<span style="font-size:var(--fs-xs);color:var(--text-tertiary);">%</span>`
        : '') +
    `</div>`;

  const walkwayRow = _buildWalkwayUI(idx, areaObj, inpStyle, chkStyle, lbStyle);

  return (
    `<div style="display:flex;justify-content:space-between;align-items:center;">` +
      `<div class="area-info">` +
        `<div class="area-title" style="color:${ac.stroke};">Area ${idx+1}${expBadge}</div>` +
        `<div class="area-subtitle">${panelCount} mod${areaObj && areaObj._maxCapacity !== undefined && areaObj._maxCapacity !== panelCount ? ` <span style="color:var(--text-tertiary);font-size:10px;">(max ${areaObj._maxCapacity})</span>` : ''} · ${areaMq} m²</div>` +
      `</div>` +
      (() => {
        const trueMax = areaObj && areaObj._maxCapacity != null ? areaObj._maxCapacity : null;
        const canAdd = trueMax == null || panelCount < trueMax;
        const canRem = panelCount > 0;
        const bBase = 'pointer-events:auto;width:26px;height:26px;border-radius:4px;font-size:14px;line-height:1;cursor:pointer;font-family:var(--font-main);border:1px solid var(--border-default);';
        const bOn  = bBase + 'background:var(--bg-primary);color:var(--text-primary);';
        const bOff = bBase + 'background:var(--bg-secondary);color:var(--text-tertiary);cursor:default;opacity:0.45;';
        return `<div style="display:flex;align-items:center;gap:4px;margin-right:6px;">` +
          `<button style="${canRem?bOn:bOff}" ${canRem?`onclick="removeAreaPanel(${idx})"`:''} ${canRem?'':'disabled'} title="Togli pannello">−</button>` +
          `<button style="${canAdd?bOn:bOff}" ${canAdd?`onclick="addAreaPanel(${idx})"`:''} ${canAdd?'':'disabled'} title="Aggiungi pannello">+</button>` +
        `</div>`;
      })() +
      `<button class="delete-btn" style="pointer-events:auto;" onclick="delInstallableArea(${idx})">x</button>` +
    `</div>` +
    `<div style="display:flex;gap:3px;align-items:center;margin-top:5px;">` +
      `<button onclick="setAreaOrientation(${idx},'portrait')"  style="${btnStyle('portrait','#111')}">Portrait</button>` +
      `<button onclick="setAreaOrientation(${idx},'landscape')" style="${btnStyle('landscape','#111')}">Landscape</button>` +
      `<button onclick="setAreaOrientation(${idx},'auto')"      style="${btnStyle('auto','#16a085')}">Auto</button>` +
    `</div>` +
    `<div style="display:flex;align-items:center;gap:6px;margin-top:4px;">` +
      `<span style="font-size:var(--fs-xs);color:var(--text-secondary);flex:1;">${expBadge||'Esposizione non impostata'}</span>` +
      `<button onclick="startExpArrow(${idx})" style="pointer-events:auto;padding:2px 9px;font-size:var(--fs-xs);` +
        `border-radius:4px;border:1px solid #f97316;color:#f97316;background:transparent;cursor:pointer;` +
        `font-family:var(--font-main);">&#8594; Disegna</button>` +
    `</div>`
  );
}

function _buildLayoutOptionsCard(idx) {
  const ac      = AREA_COLORS[idx % AREA_COLORS.length];
  const areaObj = installableAreas[idx];
  const sOn  = areaObj ? (areaObj.staggerEnabled  || false) : false;
  const sOff = areaObj ? (areaObj.staggerOffset   || 50)   : 50;

  const inpStyle = 'pointer-events:auto;width:48px;padding:2px 5px;font-size:var(--fs-xs);' +
                   'border:1px solid var(--border-default);border-radius:3px;' +
                   'background:var(--bg-primary);color:var(--text-primary);font-family:var(--font-main);';
  const chkStyle = 'pointer-events:auto;display:flex;align-items:center;gap:4px;cursor:pointer;';
  const lbStyle  = 'pointer-events:auto;cursor:pointer;font-size:var(--fs-xs);color:var(--text-secondary);';

  const staggerRow =
    `<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px;">` +
      `<label style="${chkStyle}">` +
        `<input type="checkbox" style="pointer-events:auto;" ${sOn?'checked':''} onchange="setAreaStagger(${idx},this.checked)">` +
        `<span style="${lbStyle}">Sfalsato</span>` +
      `</label>` +
      (sOn
        ? `<input type="number" value="${sOff}" min="10" max="90" step="5" title="Sfalsamento %" style="${inpStyle}"` +
          ` oninput="setAreaStaggerOffset(${idx},this.value)" onchange="commitAreaStaggerOffset(${idx},this.value)">` +
          `<span style="font-size:var(--fs-xs);color:var(--text-tertiary);">%</span>`
        : '') +
    `</div>`;

  const walkwayRow = _buildWalkwayUI(idx, areaObj, inpStyle, chkStyle, lbStyle);

  return (
    `<div style="padding:8px 10px;border-radius:var(--radius-sm);border:1px solid var(--border-default);` +
    `border-left:3px solid ${ac.stroke};margin-bottom:6px;">` +
      `<div style="font-size:var(--fs-xs);font-weight:700;color:${ac.stroke};margin-bottom:6px;">Area ${idx+1}</div>` +
      staggerRow + walkwayRow +
    `</div>`
  );
}

function _buildExclusionHeader(idx, areaMq) {
  return (
    `<div style="display:flex;align-items:center;gap:6px;margin-bottom:5px;">` +
      `<span style="font-size:12px;font-weight:600;color:var(--danger);flex:1;">Ostacolo ${idx+1}</span>` +
      `<span style="font-size:var(--fs-xs);color:var(--text-secondary);">${areaMq} m²</span>` +
      `<button class="delete-btn" style="pointer-events:auto;color:var(--text-tertiary);" title="Copia e incolla area" onclick="copyExclusionArea(${idx})">⎘</button>` +
      `<button class="delete-btn" style="pointer-events:auto;" onclick="delExclusionArea(${idx})">x</button>` +
    `</div>` +
    `<div style="display:flex;align-items:center;gap:6px;">` +
      `<span style="font-size:10px;font-weight:600;color:var(--text-secondary);white-space:nowrap;">Ruota <b id="exr${idx}">0</b>°</span>` +
      `<input type="range" min="-180" max="180" value="0" step="1"` +
      ` style="pointer-events:auto;flex:1;accent-color:#f59e0b;cursor:pointer;"` +
      ` oninput="document.getElementById('exr${idx}').textContent=this.value;_rotateExclusionTo(${idx},parseInt(this.value));"` +
      ` onchange="snapshot();updateAreaLists();">` +
    `</div>`
  );
}

function updateAreaLists() {
  const panelCountByArea = new Map();
  panels.forEach(p => panelCountByArea.set(p.areaIdx, (panelCountByArea.get(p.areaIdx) || 0) + 1));

  const list = DOM.areaList;
  const bar = DOM.areaAccordionBar;
  const sum = DOM.areaAccordionSummary;
  list.innerHTML = '';
  if (installableAreas.length === 0) {
    bar.classList.remove('visible');
    list.style.display = 'none';
  } else {
    const totalPanels = panels.length;
    const totalMq = installableAreas.reduce((s,a) => s + polyAreaCached(a), 0).toFixed(0);
    sum.textContent = `${installableAreas.length} aree · ${totalPanels} moduli · ${totalMq} m²`;
    bar.classList.add('visible');
    list.style.display = _areaAccOpen ? 'block' : 'none';
    DOM.areaAccordionArrow.style.transform = _areaAccOpen ? 'rotate(180deg)' : '';

    installableAreas.forEach((a, i) => {
      const panelCount = panelCountByArea.get(i) || 0;
      const orient = a.orientation || 'auto';
      const ac = AREA_COLORS[i % AREA_COLORS.length];
      const div = document.createElement('div');
      div.className = 'area-item';
      div.style.cssText = 'flex-direction:column;align-items:stretch;gap:6px;border-left:3px solid '+ac.stroke+';';
      div.innerHTML = `\n${_buildAreaHeader(i, ac, orient, panelCount, polyAreaCached(a).toFixed(1))}\n `;
      list.appendChild(div);
    });
  }

  const exList = DOM.exclusionList;
  const exBar = DOM.exclusionAccordionBar;
  const exSum = DOM.exclusionAccordionSummary;
  exList.innerHTML = '';
  const totalObstacles = exclusionAreas.length + technicalObjects.length;
  if (totalObstacles === 0) {
    exBar.classList.remove('visible');
    exList.style.display = 'none';
  } else {
    const totMqEx = exclusionAreas.reduce((s,a) => s + polyAreaCached(a), 0).toFixed(0);
    const exParts = [];
    if (exclusionAreas.length > 0) exParts.push(`${exclusionAreas.length} zone`);
    if (technicalObjects.length > 0) exParts.push(`${technicalObjects.length} puntuali`);
    if (parseFloat(totMqEx) > 0) exParts.push(`${totMqEx} m²`);
    exSum.textContent = exParts.join(' · ') || 'Ostacoli';
    exBar.classList.add('visible');
    exList.style.display = _exclAccOpen ? 'block' : 'none';
    DOM.exclusionAccordionArrow.style.transform = _exclAccOpen ? 'rotate(180deg)' : '';

    exclusionAreas.forEach((a, i) => {
      const div = document.createElement('div');
      div.className = 'area-item exclusion';
      div.innerHTML = `\n${_buildExclusionHeader(i, polyAreaCached(a).toFixed(1))}\n `;
      exList.appendChild(div);
    });

    technicalObjects.forEach((obj, i) => {
      const listColor = TECH_LIST_COLORS[obj.type] || '#aaa';
      const div = document.createElement('div');
      div.className = 'area-item exclusion';
      div.style.cssText = 'pointer-events:auto;padding:8px 10px 7px;background:var(--bg-primary);border:1px solid var(--border-light);border-radius:var(--radius);margin-bottom:5px;';
      div.style.borderLeft = `3px solid ${listColor}`;
      div.innerHTML = _buildTechCard(obj, i);
      exList.appendChild(div);
    });
  }
  updateLayoutOptionsList();
}

function delInstallableArea(i) {
  _sdpConfirm('Eliminare area e moduli?', () => {
    snapshot();
    invalidateLayoutCache();
    const hadStrings = strings.length;
    panels = panels.filter(p => p.areaIdx !== i);
    installableAreas.splice(i, 1);
    panels.forEach(p => { if (p.areaIdx > i) p.areaIdx--; });
    selectedPanels = new Set();
    strings = [];
    panels.forEach(p => { p.strId = null; p.stringColor = null; });
    if (panels.length === 0) {
      if(DOM.deletePanelsBtn) DOM.deletePanelsBtn.style.display='none';
      _updateToolbarGroups();
    } else if (hadStrings > 0) {
      genStrings(hadStrings);
    }
    updateAreaLists(); updateStringList(); updateLegend(); updateStats(); draw();
  });
}

function delExclusionArea(i) {
  _sdpConfirm('Eliminare area ostacolo?', () => {
    snapshot();
    invalidateLayoutCache();
    exclusionAreas.splice(i, 1);
    updateAreaLists(); draw();
  });
}

function copyExclusionArea(idx) {
  const src = exclusionAreas[idx];
  if (!src) return;
  const n = src.points.length;
  const cx = src.points.reduce((s,p)=>s+p.x,0)/n;
  const cy = src.points.reduce((s,p)=>s+p.y,0)/n;
  _copyExclPts = src.points.map(p=>({x:p.x-cx, y:p.y-cy}));
  _copyExclMode = true;
  canvas.style.cursor = 'copy';
  showToast('Clicca sul canvas per incollare l\'ostacolo · ESC per annullare', 'info', 4000);
  draw();
}

function _cancelCopyExcl() {
  _copyExclMode = false;
  _copyExclPts  = null;
  canvas.style.cursor = 'default';
  draw();
}

function toggleBufferVis() {
  showBuffer = !showBuffer;
  const btn = document.getElementById('bufferVisBtn');
  if (btn) {
    btn.classList.toggle('active', showBuffer);
    btn.title = showBuffer ? 'Nascondi buffer distanza (B)' : 'Mostra buffer distanza ostacoli (B)';
  }
  draw();
}
