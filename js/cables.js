// ── cables.js — Dimensionamento cavi e schema unifilare ──
//
// Pure sizing helpers (calcSection*, calcVoltageDrop, getCableCapacity)
// and their backing tables live in js/lib/sizing.js. cables.js consumes
// them via the globalThis.SDPSizing namespace — do not redeclare these
// names locally.

'use strict';

if (typeof globalThis === 'undefined' || !globalThis.SDPSizing) {
  throw new Error(
    'cables.js: globalThis.SDPSizing is not set. ' +
    'js/lib/sizing.js must be loaded before cables.js in solar-designer-v89.html.'
  );
}

const calcSection      = globalThis.SDPSizing.calcSection;
const calcSectionAC    = globalThis.SDPSizing.calcSectionAC;
const calcVoltageDrop  = globalThis.SDPSizing.calcVoltageDrop;
const getCableCapacity = globalThis.SDPSizing.getCableCapacity;

// Diametro equivalente dispersore verticale piatto 25×3mm (CEI 64-8 / IEC 62305)
// Grounding constant — NOT a sizing helper, stays in cables.js.
const EARTH_ROD_D = 0.014;  // m

// ── Calcolo e rendering risultati ────────────────────────────────────────────

function _getModuleVmppTempCoeff() {
  const pmax = parseFloat((document.getElementById('moduleTcoefPmax') || { value: '0' }).value);
  const voc  = parseFloat((document.getElementById('moduleTcoefVoc') || { value: '-0.30' }).value) || -0.30;
  return Number.isFinite(pmax) && pmax !== 0 ? pmax : voc;
}

function _getProjectStrPerMpptMax() {
  if (!_inverterList.length) return 1;
  return Math.max(..._inverterList.map(inv => Math.max(1, parseInt(inv.strPerMppt, 10) || 1)));
}

function _hasMixedStrPerMppt() {
  if (_inverterList.length <= 1) return false;
  return new Set(_inverterList.map(inv => Math.max(1, parseInt(inv.strPerMppt, 10) || 1))).size > 1;
}

function calcCables() {
  const el = document.getElementById('cableResults');
  if (!el) return;

  const isc    = parseFloat((document.getElementById('moduleIsc')     || {value: '9'}).value)   || 9;
  const voc    = parseFloat((document.getElementById('moduleVoc')     || {value: '45'}).value)   || 45;
  const pp     = parseInt((DOM.pp                                      || {value: '400'}).value)  || 400;
  // stringhe per MPPT direttamente dall'inverter (non da stringNum che vale 1)
  const strPerMppt = _getProjectStrPerMpptMax();
  const mixedStrPerMppt = _hasMixedStrPerMppt();
  const totStr  = Math.max(1, parseInt((DOM.pairNum || {value:'1'}).value) || 1); // = strTot
  const totPanels = panels.length;
  const numInv  = Math.max(1, parseInt((document.getElementById('numInverters') || {value:'1'}).value) || 1);
  const mat    = (document.getElementById('cableMaterial')            || {value: 'cu'}).value;
  const sysAC  = (document.getElementById('cableSystemAC')           || {value: 'mono'}).value;
  const lenStr = parseFloat((document.getElementById('cableLenString')|| {value: '20'}).value)  || 20;
  const lenMain= parseFloat((document.getElementById('cableLenMain')  || {value: '10'}).value)  || 10;
  const lenAC  = parseFloat((document.getElementById('cableLenAC')    || {value: '15'}).value)  || 15;
  const dropDC = parseFloat((document.getElementById('cableDropDC')   || {value: '1'}).value)   || 1;
  const tcoefVmpp = _getModuleVmppTempCoeff();

  // Fattori correzione portata (CEI UNEL 35026): k1 (posa) × k2 (raggruppamento)
  const kPosa  = parseFloat((document.getElementById('cablePosa')    ||{value:'1.00'}).value) || 1.0;
  const kGroup = parseFloat((document.getElementById('cableGrouping')||{value:'1.00'}).value) || 1.0;
  const kCorr  = kPosa * kGroup;

  // Verifica rete PCC (CEI EN 50160) e dispersore terra (CEI 64-8 art. 612.6)
  const gridRth  = parseFloat((document.getElementById('gridRth') ||{value:'0.35'}).value) || 0.35;
  const gridXth  = parseFloat((document.getElementById('gridXth') ||{value:'0.25'}).value) || 0.25;
  const earthRho = parseFloat((document.getElementById('earthRho')||{value:'100'}).value)  || 100;
  const earthLen = parseFloat((document.getElementById('earthLen')||{value:'1.5'}).value)  || 1.5;

  if (totPanels === 0 || totStr === 0) {
    el.innerHTML = '<div class="info" style="color:var(--text-tertiary);text-align:center;padding:12px;">Posiziona moduli e configura le stringhe per calcolare i cavi.</div>';
    return;
  }

  const modsPerStr  = Math.round(totPanels / totStr);
  const V_str       = voc * modsPerStr;           // Tensione stringa (V)
  const I_str       = isc * 1.25;                 // Corrente design: 1.25 × Isc (CEI/IEC)
  // Cavo principale DC: somma correnti delle stringhe in parallelo sullo stesso MPPT
  const I_main_DC   = I_str * strPerMppt;
  // Budget DC: ogni tratto (stringa e principale) deve stare singolarmente entro dropDC%.
  // Non si somma: ogni segmento ha il suo limite indipendente (pratica IEC 62548).
  const dV_max_str  = (dropDC / 100) * V_str;  // Limite cavo stringa
  const dV_max_main = (dropDC / 100) * V_str;  // Limite cavo principale (stesso %)

  // ── Cavo stringa DC (bifilar, Method C — portacavi/aperto) ──
  const S_str       = calcSection(I_str, lenStr, dV_max_str, mat, 2, true, kCorr);
  const drop_str    = calcVoltageDrop(I_str, lenStr, S_str, V_str, mat, 2);
  const Iz_str_raw  = getCableCapacity(S_str, mat, true);
  const Iz_str_corr = Math.floor(Iz_str_raw * kCorr * 10) / 10;

  // ── Cavo principale DC (bifilar, Method B — in condotto) ──
  const S_main      = calcSection(I_main_DC, lenMain, dV_max_main, mat, 2, false, kCorr);
  const drop_main     = calcVoltageDrop(I_main_DC, lenMain, S_main, V_str, mat, 2);
  const Iz_main_raw  = getCableCapacity(S_main, mat, false);
  const Iz_main_corr = Math.floor(Iz_main_raw * kCorr * 10) / 10;
  const drop_total_DC = drop_str + drop_main;  // caduta cumulata stringa+principale

  // ── Cavo AC ──
  // Formula corretta: ΔV = (nCond × L × I × cosφ) / (σ × S)
  // Monofase: nCond=2, Trifase: nCond=√3
  const cosfi  = 0.9;
  const P_kw   = (totPanels * pp / 1000) * 0.97;  // Potenza AC (efficienza inverter 97%)
  let V_AC, I_AC, nCondAC;
  if (sysAC === 'mono') {
    V_AC = 230; I_AC = (P_kw * 1000) / (V_AC * cosfi); nCondAC = 2;
  } else {
    V_AC = 400; I_AC = (P_kw * 1000) / (Math.sqrt(3) * V_AC * cosfi); nCondAC = Math.sqrt(3);
  }
  const DROP_LIMIT_AC = 1.0;                               // 1% limite ΔV AC (buona pratica FV)
  const dV_max_AC = (DROP_LIMIT_AC / 100) * V_AC;
  const S_AC      = calcSectionAC(I_AC, lenAC, dV_max_AC, mat, nCondAC, cosfi);
  const drop_AC   = calcVoltageDrop(I_AC, lenAC, S_AC, V_AC, mat, nCondAC, cosfi);
  const Iz_AC_raw  = getCableCapacity(S_AC, mat, false);
  const Iz_AC_corr = Math.floor(Iz_AC_raw * kCorr * 10) / 10;

  // ── Verifica tensione al PCC (CEI EN 50160 ±10% Vn) ──
  const Z_rete     = Math.sqrt(gridRth * gridRth + gridXth * gridXth);
  const dV_rete_V  = sysAC === 'mono' ? 2 * Z_rete * I_AC : Math.sqrt(3) * Z_rete * I_AC;
  const dV_rete_pct = V_AC > 0 ? (dV_rete_V / V_AC) * 100 : 0;
  const dV_pcc_pct  = drop_AC + dV_rete_pct;

  // ── Resistenza dispersore di terra (CEI 64-8 art. 612.6) ──
  // Formula: Rt = (ρ / 2πL) × ln(4L/d)   — dispersore verticale cilindrico
  const Rt     = earthLen > 0 ? (earthRho / (2 * Math.PI * earthLen)) * Math.log(4 * earthLen / EARTH_ROD_D) : 999;
  const Rt_ok  = Rt <= 5.0;
  const nRods  = Rt_ok ? 1 : Math.ceil(Rt / 5.0);  // dispersori in parallelo stimati (stima semplificata)

  // Helper rendering
  function row(label, value, highlight) {
    return `<div>
      <div style="color:var(--text-tertiary);font-size:10px;">${label}</div>
      <div style="font-weight:${highlight ? '700' : '600'};color:${highlight ? 'var(--accent)' : 'var(--text-primary)'};font-size:${highlight ? 'var(--fs-sm)' : 'var(--fs-xs)'};">${value}</div>
    </div>`;
  }
  function dropBadge(pct, max) {
    const ok = pct <= max;
    return `<div style="font-weight:600;color:${ok ? 'var(--accent-text)' : 'var(--danger)'};">${ok ? '✓' : '⚠'} ${pct.toFixed(2)}% <span style="font-weight:normal;color:var(--text-tertiary);">(max ${max}%)</span></div>`;
  }
  function card(title, rows) {
    return `<div style="background:var(--bg-secondary);border:1px solid var(--border-default);border-radius:var(--radius-sm);overflow:hidden;margin-bottom:8px;">
      <div style="background:var(--bg-tertiary);padding:4px 10px;font-size:var(--fs-xs);font-weight:600;color:var(--text-secondary);border-bottom:1px solid var(--border-default);">${title}</div>
      <div style="padding:8px 10px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px 6px;">${rows}</div>
    </div>`;
  }

  const kCorrBadge = kCorr < 0.999
    ? `<span style="display:inline-block;background:#fff8e1;border:1px solid #fcd34d;border-radius:3px;padding:1px 5px;font-size:9px;font-weight:700;color:#92400e;margin-left:4px;">k=${kCorr.toFixed(2)} (posa×gruppo)</span>`
    : '';

  el.innerHTML =
    `<div style="font-size:var(--fs-xs);font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">Risultati ${kCorrBadge}</div>`
    + card(
        `⚡ Cavo stringa DC — ${totStr} str. × ${modsPerStr} mod. in serie`,
        row('Tensione stringa', V_str.toFixed(0) + ' V') +
        row('Corrente design (Isc×1.25)', I_str.toFixed(1) + ' A') +
        row('Sezione', S_str + ' mm²', true) +
        row('Portata Iz' + (kCorr < 0.999 ? ` (×${kCorr.toFixed(2)})` : ''), Iz_str_corr + ' A') +
        row('Lunghezza', lenStr + ' m') +
        `<div><div style="color:var(--text-tertiary);font-size:10px;">Caduta tensione</div>${dropBadge(drop_str, dropDC)}</div>`
      )
    + card(
        `⚡ Cavo principale DC — ${strPerMppt} str. parallelo per ingresso MPPT`,
        row('Corrente totale DC', I_main_DC.toFixed(1) + ' A') +
        row('Sezione', S_main + ' mm²', true) +
        row('Portata Iz' + (kCorr < 0.999 ? ` (×${kCorr.toFixed(2)})` : ''), Iz_main_corr + ' A') +
        row('Lunghezza', lenMain + ' m') +
        `<div><div style="color:var(--text-tertiary);font-size:10px;">Caduta tensione</div>${dropBadge(drop_main, dropDC)}</div>` +
        `<div style="grid-column:1/-1;border-top:1px solid var(--border-default);padding-top:6px;margin-top:2px;">
          <div style="color:var(--text-tertiary);font-size:10px;">Caduta totale DC (str+principale)</div>
          ${dropBadge(drop_total_DC, dropDC * 2)}
         </div>`
      )
    + card(
        `🔌 Cavo AC — ${sysAC === 'mono' ? 'Monofase 230 V' : 'Trifase 400 V'} · ${P_kw.toFixed(2)} kW`,
        row('Corrente AC', I_AC.toFixed(1) + ' A') +
        row('Sezione', S_AC + ' mm²', true) +
        row('Portata Iz' + (kCorr < 0.999 ? ` (×${kCorr.toFixed(2)})` : ''), Iz_AC_corr + ' A') +
        row('Lunghezza', lenAC + ' m') +
        `<div><div style="color:var(--text-tertiary);font-size:10px;">Caduta tensione</div>${dropBadge(drop_AC, DROP_LIMIT_AC)}</div>`
      )
    + card(
        `🌍 Tensione al PCC — CEI EN 50160`,
        row('|Z| rete DSO', Z_rete.toFixed(3) + ' Ω') +
        row('ΔV rete (→PCC)', dV_rete_pct.toFixed(2) + ' %') +
        `<div style="grid-column:1/-1;"><div style="color:var(--text-tertiary);font-size:10px;">ΔV totale utente+rete al PCC</div>${dropBadge(dV_pcc_pct, 4.0)}</div>` +
        `<div style="grid-column:1/-1;font-size:10px;color:var(--text-tertiary);">Limite EN 50160: ±10% Vn · Soglia pratica: ΔV produz. ≤ 4% · Rth/Xth DSO: inserire da preventivo connessione</div>`
      )
    + card(
        `⏚ Dispersore di terra — CEI 64-8 art. 612.6`,
        row('Resistività suolo ρ', earthRho + ' Ω·m') +
        row('Lunghezza dispersore', earthLen + ' m') +
        `<div><div style="color:var(--text-tertiary);font-size:10px;">Rt calcolata</div>
          <div style="font-weight:700;color:${Rt_ok ? 'var(--accent-text)' : 'var(--danger)'};">${Rt_ok ? '✓' : '⚠'} ${Rt.toFixed(1)} Ω ${Rt_ok ? '≤ 5Ω' : `> 5Ω`}</div></div>` +
        `<div style="grid-column:1/-1;font-size:10px;color:${Rt_ok ? 'var(--text-tertiary)' : 'var(--danger)'};">
          ${Rt_ok ? 'Sistema TT conforme — 1 dispersore sufficiente' : `Aggiungere ${nRods} dispersori in parallelo (stima semplificata) oppure dispersore ad anello`}
         </div>`
      )
    + `<div style="font-size:10px;color:var(--text-tertiary);line-height:1.5;margin-top:2px;">
        IEC 60364-5-52 · DC stringa: Method C (portacavi) · DC principale/AC: Method B (condotto)
        · ${mat === 'cu' ? 'Rame (Cu) σ=56' : 'Alluminio (Al) σ=35'} m/Ω·mm² · cos φ = 0.9 · η inv. = 97%
        · k posa=${kPosa.toFixed(2)} · k gruppo=${kGroup.toFixed(2)} · kCorr=${kCorr.toFixed(2)}
       </div>`;

  updateInvValidation();
  // Aggiorna le verifiche elettriche nella sezione HTML separata
  if (typeof _renderVerifiche === 'function') _renderVerifiche();
}

function syncCableState() { calcCables(); }

// ── Parco inverter — gestione lista ──────────────────────────────────────────

/**
 * Calcola i valori totali/consolidati del parco inverter.
 * Conservativo: per un impianto misto si usa il limite più restrittivo.
 *   - MPPT totali     = somma (mppt × qty)
 *   - Pac totale      = somma (pac  × qty)
 *   - vocMax          = minimo  (limite più basso)
 *   - vMin (Vmppt lo) = massimo (la tensione minima più alta è la più restrittiva)
 *   - vMax (Vmppt hi) = minimo  (la tensione massima più bassa è la più restrittiva)
 *   - iMax            = minimo  (la corrente massima più bassa è la più restrittiva)
 *   - ac              = 'tri' se almeno uno è trifase
 */
function _getInverterTotals() {
  if (!_inverterList.length) return null;
  let mpptTot = 0, strTot = 0, pacTot = 0;
  let vocMax = Infinity, vMin = -Infinity, vMax = Infinity, iMax = Infinity;
  let hasTri = false;
  const brands = [];
  _inverterList.forEach(inv => {
    mpptTot += inv.mppt       * inv.qty;
    strTot  += inv.mppt * inv.strPerMppt * inv.qty;   // stringhe totali fisso da datasheet
    pacTot  += inv.pac        * inv.qty;
    vocMax   = Math.min(vocMax,  inv.vocMax);
    vMin     = Math.max(vMin,    inv.vMin);
    vMax     = Math.min(vMax,    inv.vMax);
    iMax     = Math.min(iMax,    inv.iMax);
    if (inv.ac === 'tri') hasTri = true;
    if (!brands.includes(inv.brand)) brands.push(inv.brand);
  });
  const totalQty = _inverterList.reduce((s, inv) => s + inv.qty, 0);
  // strPerMppt consolidato: conservativo = minimo tra tutti gli inverter
  const strPerMpptMin = Math.min(..._inverterList.map(inv => inv.strPerMppt));
  const strPerMpptMax = Math.max(..._inverterList.map(inv => inv.strPerMppt));
  const mixedStrPerMppt = new Set(_inverterList.map(inv => inv.strPerMppt)).size > 1;
  return { mpptTot, strTot, strPerMpptMin, strPerMpptMax, mixedStrPerMppt, pacTot, vocMax, vMin, vMax, iMax,
           ac: hasTri ? 'tri' : 'mono', brands: brands.join('+'), totalQty };
}

function addInverterToList() {
  const sel = document.getElementById('invPresetAdd');
  const qtyEl = document.getElementById('invAddQty');
  if (!sel || !sel.value) { showToast('Seleziona un modello inverter', 'warn'); return; }
  const p = INV_PRESETS[sel.value];
  if (!p) return;
  const qty = Math.max(1, parseInt(qtyEl.value) || 1);

  // AP-17c: route writes through store. Rebuild list so subscribers see a
  // fresh reference and avoid in-place mutation as a side channel.
  const cur = globalThis.getStoreSlice('inverterList') || [];
  const existing = cur.find(i => i.key === sel.value);
  let next;
  if (existing) {
    next = cur.map(i => i === existing ? Object.assign({}, i, { qty: i.qty + qty }) : i);
  } else {
    next = cur.concat([{ key: sel.value, ...p, qty }]);
  }
  globalThis.setStoreSlice('inverterList', next);

  sel.value = '';
  qtyEl.value = 1;
  updateInverterListUI();
}

function removeInverterFromList(idx) {
  // AP-17c: route writes through store.
  const cur = globalThis.getStoreSlice('inverterList') || [];
  const next = cur.filter((_, i) => i !== idx);
  globalThis.setStoreSlice('inverterList', next);
  updateInverterListUI();
}

function updateInverterListUI() {
  const listEl   = document.getElementById('inverterListItems');
  const summEl   = document.getElementById('inverterListSummary');
  const mpptLbl  = document.getElementById('mpptFromInvLabel');

  if (!listEl) return;

  if (!_inverterList.length) {
    listEl.innerHTML = '<div style="color:var(--text-tertiary);font-size:var(--fs-xs);padding:8px;text-align:center;border:1px dashed var(--border-default);border-radius:var(--radius-sm);">Nessun inverter aggiunto</div>';
    if (summEl) summEl.innerHTML = '';
    if (mpptLbl) mpptLbl.textContent = 'Dal parco inverter';
    _syncHiddenInvFields(null);
    updateStringPreview(); calcCables();
    return;
  }

  // Render lista
  listEl.innerHTML = _inverterList.map((inv, i) => `
    <div style="display:flex;align-items:center;gap:6px;padding:5px 8px;margin-bottom:3px;background:var(--bg-secondary);border:1px solid var(--border-default);border-radius:var(--radius-sm);font-size:var(--fs-xs);">
      <div style="flex:1;min-width:0;">
        <span style="font-weight:600;color:var(--text-primary);">${inv.brand} ${inv.model}</span><br>
        <span style="color:var(--text-tertiary);">${inv.pac}kW · ${inv.mppt} MPPT · ${inv.strPerMppt} str/MPPT · ${inv.ac==='tri'?'3~':'1~'}</span>
      </div>
      <div style="display:flex;align-items:center;gap:3px;flex-shrink:0;">
        <button class="number-btn" style="width:20px;height:22px;font-size:11px;" onclick="adjInvQty(${i},-1)">−</button>
        <span style="font-weight:700;min-width:22px;text-align:center;color:var(--accent);">×${inv.qty}</span>
        <button class="number-btn" style="width:20px;height:22px;font-size:11px;" onclick="adjInvQty(${i},1)">+</button>
      </div>
      <button onclick="removeInverterFromList(${i})" style="background:none;border:none;cursor:pointer;color:var(--danger);font-size:14px;padding:0 2px;" title="Rimuovi">×</button>
    </div>`).join('');

  // Calcola totali
  const t = _getInverterTotals();
  const acLabel = t.ac === 'tri' ? '3~ 400V' : '1~ 230V';

  // Riepilogo parco
  if (summEl) summEl.innerHTML = `
    <div style="background:var(--accent-light);border:1px solid var(--accent);border-radius:var(--radius-sm);padding:7px 10px;font-size:var(--fs-xs);">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;">
        <div><span style="color:var(--text-tertiary);">Inverter tot:</span><br><b style="color:var(--accent-text);">${t.totalQty} ud.</b></div>
        <div><span style="color:var(--text-tertiary);">Pac totale:</span><br><b style="color:var(--accent-text);">${t.pacTot.toFixed(1)} kW</b></div>
        <div><span style="color:var(--text-tertiary);">MPPT totali:</span><br><b style="color:var(--accent-text);">${t.mpptTot}</b></div>
        <div><span style="color:var(--text-tertiary);">Str. totali (da scheda):</span><br><b style="color:var(--accent-text);">${t.strTot}</b></div>
        <div><span style="color:var(--text-tertiary);">Vmppt:</span><br><b>${t.vMin}–${t.vMax}V · Voc≤${t.vocMax}V</b></div>
        <div><span style="color:var(--text-tertiary);">Imax MPPT:</span><br><b>${t.iMax}A · ${acLabel}</b></div>
      </div>
    </div>`;

  // pairNum = stringhe totali fisse (da scheda tecnica inverter, non scelto dall'utente)
  if (mpptLbl) mpptLbl.textContent = t.mixedStrPerMppt ? `→ ${t.strTot} stringhe totali (${t.mpptTot} MPPT × 1…${t.strPerMpptMax} str/MPPT)` : `→ ${t.strTot} stringhe totali (${t.mpptTot} MPPT × ${t.strPerMpptMin} str/MPPT)`;
  if (DOM.pairNum) {
    DOM.pairNum.value    = t.strTot;
    DOM.pairNum.readOnly = true;
    DOM.pairNum.style.background   = 'var(--accent-light)';
    DOM.pairNum.style.borderColor  = 'var(--accent)';
  }

  // Aggiorna sistema AC
  const acEl = document.getElementById('cableSystemAC');
  if (acEl) acEl.value = t.ac === 'tri' ? 'tri' : 'mono';

  _syncHiddenInvFields(t);
  updateStringPreview();
  calcCables();
}

function adjInvQty(idx, d) {
  // AP-17c: route writes through store.
  const cur = globalThis.getStoreSlice('inverterList') || [];
  const next = cur.map((inv, i) =>
    i === idx ? Object.assign({}, inv, { qty: Math.max(1, inv.qty + d) }) : inv
  );
  globalThis.setStoreSlice('inverterList', next);
  updateInverterListUI();
}

/** Aggiorna i campi hidden usati da calcCables/updateInvValidation/renderUnifilare */
function _syncHiddenInvFields(t) {
  const set = (id, v) => { const el = document.getElementById(id); if (el !== null && v !== undefined) el.value = v ?? ''; };
  if (!t) {
    set('invBrand',''); set('invModel',''); set('numInverters','1');
    set('invPac',''); set('invVmpptMin',''); set('invVmpptMax','');
    set('invImaxMppt',''); set('invVocMax','');
    return;
  }
  // Brand e model: usa il primo se uno solo, altrimenti "misto"
  const first = _inverterList[0];
  set('invBrand',    _inverterList.length === 1 ? first.brand : t.brands);
  set('invModel',    _inverterList.length === 1 ? `${first.model} ×${first.qty}` : `Misto ×${t.totalQty}`);
  set('numInverters', t.totalQty);
  set('invStrTot',   t.strTot);
  set('invPac',      t.pacTot);
  set('invVmpptMin', t.vMin);
  set('invVmpptMax', t.vMax);
  set('invImaxMppt', t.iMax);
  set('invVocMax',   t.vocMax);
}

function onNumInvChange() {
  updateStringPreview();
  calcCables();
}

// ── Libreria inverter ─────────────────────────────────────────────────────────

// INV_PRESETS è definito in data/inverters.data.js (caricato prima di questo file).

function applyInvPreset() { /* stub — sostituito da addInverterToList */ }

// ── Libreria moduli — preset e selezione ─────────────────────────────────────

/**
 * Popola il <select id="modulePresetSel"> con i preset da MODULE_PRESETS.
 * Raggruppa per brand usando <optgroup>.
 * Chiamata una volta al caricamento pagina.
 */
function _populateModulePresets() {
  const sel = document.getElementById('modulePresetSel');
  if (!sel) return;
  // Svuota tutto tranne la prima opzione "Personalizzato"
  while (sel.options.length > 1) sel.remove(1);

  let curBrand = null;
  let grp = null;
  MODULE_PRESETS.forEach((p, i) => {
    if (p.brand !== curBrand) {
      curBrand = p.brand;
      grp = document.createElement('optgroup');
      grp.label = p.brand;
      sel.appendChild(grp);
    }
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${p.name} · ${p.pp}Wp`;
    grp.appendChild(opt);
  });
}

/**
 * Applica un preset modulo ai campi del form S3.
 * @param {string|number} idx  indice in MODULE_PRESETS, o '' per personalizzato
 */
function applyModulePreset(idx) {
  if (idx === '' || idx === null || idx === undefined) {
    _modulePresetKey = null;
    return;
  }
  const i = parseInt(idx);
  const p = MODULE_PRESETS[i];
  if (!p) return;
  _modulePresetKey = i;

  const set = (id, v) => {
    const el = document.getElementById(id);
    if (el && v !== undefined) { el.value = v; el.dispatchEvent(new Event('input', {bubbles:true})); }
  };
  set('pw',             p.pw);
  set('pl',             p.pl);
  set('pp',             p.pp);
  set('moduleIsc',      p.isc);
  set('moduleVoc',      p.voc);
  set('moduleImpp',     p.impp);
  set('moduleVmpp',     p.vmpp);
  set('moduleTcoefVoc', p.tcoef_voc  ?? -0.30);
  set('moduleTcoefPmax',p.tcoef_pmax ?? -0.35);
  // ISCR: usa valore dal preset se disponibile, altrimenti stima conservativa ≈ 1.35×Isc
  set('moduleIscr',    p.iscr     ?? Math.round(p.isc * 1.35 * 2) / 2);
  set('moduleVsysMax', p.vsys_max ?? 1000);

  syncCableState();
  _relayoutDebounced && _relayoutDebounced();
  invalidateLayoutCache && invalidateLayoutCache();
}


// ── Schema unifilare (SVG) ────────────────────────────────────────────────────

function openUnifilare() {
  const modal = document.getElementById('unifilareModal');
  if (!modal) return;
  modal.classList.add('visible');
  renderUnifilare();
}

function closeUnifilare() {
  const modal = document.getElementById('unifilareModal');
  if (modal) modal.classList.remove('visible');
}

