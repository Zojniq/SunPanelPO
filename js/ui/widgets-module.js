// ── js/ui/widgets-module.js — module library widget logic ──
// Extracted from ui.js in AP-16b1. Contains module library load/save,
// render, apply, and delete flows used by the S3 module section.
// Calling surface unchanged — all symbols remain available through
// bundle-scope globals.
'use strict';

// ── Libreria moduli ───────────────────────────────────────────────────────────

function _loadModuleLib() {
  try { return JSON.parse(localStorage.getItem(MODULE_LIB_KEY)) || []; }
  catch(e) { return []; }
}
function _saveModuleLib(lib) {
  try { localStorage.setItem(MODULE_LIB_KEY, JSON.stringify(lib)); } catch(e) { /* localStorage may be disabled */ }
}

function toggleModuleLib() {
  const body = DOM.moduleLibBody;
  const arrow = DOM.moduleLibArrow;
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  arrow.style.transform = isOpen ? '' : 'rotate(180deg)';
  if (!isOpen) renderModuleLib();
}

function renderModuleLib() {
  const grid = DOM.moduleLibGrid;
  if (!grid) return;
  grid.innerHTML = '';
  const userLib = _loadModuleLib();
  const all = [...MODULE_PRESETS.map(m => ({...m, preset:true})), ...userLib.map(m => ({...m, preset:false}))];
  all.forEach((m, i) => {
    const chip = document.createElement('span');
    chip.className = 'module-chip';
    chip.title = `${m.pl}×${m.pw} m · ${m.pp} Wp`;
    chip.innerHTML = `<span onclick="applyModule(${i})" style="cursor:pointer;">${m.name}</span>`;
    if (!m.preset) {
      const del = document.createElement('button');
      del.className = 'module-chip-del';
      del.textContent = '×';
      del.title = 'Elimina dalla libreria';
      del.onclick = (e) => { e.stopPropagation(); deleteModuleFromLib(i - MODULE_PRESETS.length); };
      chip.appendChild(del);
    }
    chip.querySelector('span').onclick = () => applyModule(i);
    grid.appendChild(chip);
  });
}

function applyModule(idx) {
  const all = [...MODULE_PRESETS, ..._loadModuleLib()];
  const m = all[idx]; if (!m) return;
  DOM.pw.value = m.pw; DOM.pl.value = m.pl; DOM.pp.value = m.pp;
  if (document.getElementById('moduleImpp')) document.getElementById('moduleImpp').value = m.impp || '';
  if (document.getElementById('moduleVmpp')) document.getElementById('moduleVmpp').value = m.vmpp || '';
  if (document.getElementById('moduleIsc'))  document.getElementById('moduleIsc').value  = m.isc  || '';
  if (document.getElementById('moduleVoc'))  document.getElementById('moduleVoc').value  = m.voc  || '';
  invalidateLayoutCache();
  if (panels.length > 0) { snapshot(); _relayout(); }
  showToast(`Modulo "${m.name}" applicato`, 'success', 1800);
}

function saveModuleToLib() {
  const pw = parseFloat(DOM.pw.value), pl = parseFloat(DOM.pl.value), pp = parseInt(DOM.pp.value);
  if (!pw || !pl || !pp) { showToast('Inserire prima i dati del modulo', 'warn'); return; }
  _sdpPrompt(`Nome per questo modulo (${pl}×${pw} m · ${pp} Wp):`, `${pp}Wp`, name => {
    const lib = _loadModuleLib();
    lib.push({ name: name.trim(), pw, pl, pp });
    _saveModuleLib(lib);
    renderModuleLib();
    showToast(`Modulo "${name}" salvato in libreria`, 'success', 2000);
  });
}

function deleteModuleFromLib(userIdx) {
  const lib = _loadModuleLib();
  if (userIdx < 0 || userIdx >= lib.length) return;
  _sdpConfirm(`Eliminare "${lib[userIdx].name}" dalla libreria?`, () => {
    lib.splice(userIdx, 1);
    _saveModuleLib(lib);
    renderModuleLib();
  });
}
