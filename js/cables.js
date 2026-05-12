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

  // Se esiste già lo stesso modello, incrementa la quantità
  const existing = _inverterList.find(i => i.key === sel.value);
  if (existing) { existing.qty += qty; }
  else { _inverterList.push({ key: sel.value, ...p, qty }); }

  sel.value = '';
  qtyEl.value = 1;
  updateInverterListUI();
}

function removeInverterFromList(idx) {
  _inverterList.splice(idx, 1);
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
  _inverterList[idx].qty = Math.max(1, _inverterList[idx].qty + d);
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

function _applyInvPreset_unused(p) {
  // (mantenuto come riferimento interno, non chiamato dall'UI)
  const set = (id, v) => { const el = document.getElementById(id); if (el && v !== undefined) el.value = v; };
  set('invBrand',    p.brand);
  set('invModel',    p.model);
  set('invPac',      p.pac);
  set('invVmpptMin', p.vMin);
  set('invVmpptMax', p.vMax);
  set('invImaxMppt', p.iMax);
  set('invVocMax',   p.vocMax);

  const infoEl = document.getElementById('invInfo');
  if (infoEl) {
    infoEl.style.display = 'block';
    const setText = (id, v) => { const el = document.getElementById(id); if(el) el.textContent = v; };
    setText('invInfoPac',    p.pac);
    setText('invInfoMppt',   p.mppt);
    setText('invInfoAC',     p.ac === 'tri' ? '3~ 400V' : '1~ 230V');
    setText('invInfoVrange', `${p.vMin}–${p.vMax}`);
    setText('invInfoImax',   p.iMax);
    setText('invInfoVoc',    p.vocMax);
  }
}

function updateInvValidation() {
  const el = document.getElementById('invValidation');
  if (!el) return;

  const n         = Math.max(1, parseInt((DOM.stringNum || {value:'1'}).value) || 1);
  const pairs     = Math.max(1, parseInt((DOM.pairNum   || {value:'1'}).value) || 1);
  const totStr    = n * pairs;
  const totPanels = panels.length;
  const modsPerStr= totPanels > 0 ? Math.round(totPanels / totStr) : 0;

  const g = id => parseFloat((document.getElementById(id)||{}).value) || 0;
  const voc       = g('moduleVoc')   || 45;
  const isc       = g('moduleIsc')   || 9;
  const vmpp      = g('moduleVmpp')  || 38;
  const tcoefVoc  = g('moduleTcoefVoc')  || -0.30;   // %/°C
  const tcoefVmpp = _getModuleVmppTempCoeff();
  const vMin      = g('invVmpptMin') || 0;
  const vMax      = g('invVmpptMax') || 9999;
  const iMax      = g('invImaxMppt') || 9999;
  const vocMax    = g('invVocMax')   || 9999;

  if (!vMin && !vMax && !iMax && !vocMax) { el.innerHTML = ''; return; }

  // Temperatura estrema: T_min=-10°C per Voc, T_max=70°C per Vmpp (CEI EN 62548)
  const T_min = -10, T_max = 70, T_stc = 25;
  const kVoc = tcoefVoc / 100;   // da %/°C a 1/°C
  const kVmpp = tcoefVmpp / 100;
  const vocCold  = voc  * (1 + kVoc  * (T_min - T_stc));  // Voc a -10°C (aumenta)
  const vmppHot  = vmpp * (1 + kVmpp * (T_max - T_stc));  // Vmpp a 70°C (diminuisce)
  const vmppCold = vmpp * (1 + kVmpp * (T_min - T_stc));  // Vmpp a -10°C (aumenta)

  const V_voc_cold  = vocCold  * modsPerStr;
  const V_vmpp_cold = vmppCold * modsPerStr;
  const V_vmpp_hot  = vmppHot  * modsPerStr;
  const I_str       = isc * 1.25;
  const I_mppt      = I_str * _getProjectStrPerMpptMax();

  let errors = 0, warnings = 0;
  const rows = [];

  // Leggi ISCR e Vsys_max dal form modulo
  const iscr    = parseFloat((document.getElementById('moduleIscr')   ||{value:'15'}).value) || (isc * 1.35);
  const vsysMax = parseFloat((document.getElementById('moduleVsysMax')||{value:'1000'}).value) || 1000;

  // ── 1. Voc a freddo vs Voc max inverter ──
  const vocOk = V_voc_cold <= vocMax;
  if (!vocOk) errors++;
  rows.push(`
    <tr style="color:${vocOk ? '#16a34a' : '#dc2626'};">
      <td style="padding:2px 6px;">${vocOk ? '✓' : '✗'}</td>
      <td style="padding:2px 6px;">Voc stringa @ -10°C vs inv.</td>
      <td style="padding:2px 6px;font-weight:600;">${V_voc_cold.toFixed(0)} V</td>
      <td style="padding:2px 6px;color:var(--text-secondary);">≤ ${vocMax} V</td>
    </tr>`);

  // ── 1b. Voc a freddo vs limiti normativi (IEC 62548 §6.2) ──
  if (V_voc_cold > 1000) {
    const exceeds1500 = V_voc_cold > 1500;
    if (exceeds1500) errors++; else warnings++;
    rows.push(`
      <tr style="color:${exceeds1500 ? '#dc2626' : '#b45309'};">
        <td style="padding:2px 6px;">${exceeds1500 ? '✗' : '⚠'}</td>
        <td style="padding:2px 6px;">Voc stringa @ -10°C vs norma</td>
        <td style="padding:2px 6px;font-weight:600;">${V_voc_cold.toFixed(0)} V</td>
        <td style="padding:2px 6px;color:var(--text-secondary);">
          ${exceeds1500 ? '> 1500V — BLOCCO assoluto IEC 62548 §6.2' : '> 1000V — cavi classe II (H1Z2Z2-K) obbligatori IEC 62548 §6.2'}
        </td>
      </tr>`);
  }
  // ── 1c. Voc vs Vsys max modulo ──
  if (V_voc_cold > vsysMax) {
    errors++;
    rows.push(`
      <tr style="color:#dc2626;">
        <td style="padding:2px 6px;">✗</td>
        <td style="padding:2px 6px;">Voc stringa vs Vsys max modulo</td>
        <td style="padding:2px 6px;font-weight:600;">${V_voc_cold.toFixed(0)} V</td>
        <td style="padding:2px 6px;color:var(--text-secondary);">Supera Vsys max modulo (${vsysMax.toFixed(0)}V) — ridurre N moduli/stringa</td>
      </tr>`);
  }

  // ── 2. Vmpp a caldo vs range Vmpp inverter ──
  const vmppHotOk  = V_vmpp_hot  >= vMin;
  const vmppColdOk = V_vmpp_cold <= vMax;
  if (!vmppHotOk) errors++;
  else if (!vmppColdOk) errors++;
  rows.push(`
    <tr style="color:${(vmppHotOk && vmppColdOk) ? '#16a34a' : '#dc2626'};">
      <td style="padding:2px 6px;">${(vmppHotOk && vmppColdOk) ? '✓' : '✗'}</td>
      <td style="padding:2px 6px;">Vmpp stringa range</td>
      <td style="padding:2px 6px;font-weight:600;">${V_vmpp_hot.toFixed(0)}–${V_vmpp_cold.toFixed(0)} V</td>
      <td style="padding:2px 6px;color:var(--text-secondary);">[${vMin}–${vMax} V]</td>
    </tr>`);

  // ── 3. Corrente design vs Imax MPPT ──
  const iOk = I_mppt <= iMax;
  if (!iOk) errors++;
  rows.push(`
    <tr style="color:${iOk ? '#16a34a' : '#dc2626'};">
      <td style="padding:2px 6px;">${iOk ? '✓' : '✗'}</td>
      <td style="padding:2px 6px;">Isc × 1.25 design</td>
      <td style="padding:2px 6px;font-weight:600;">${I_mppt.toFixed(1)} A</td>
      <td style="padding:2px 6px;color:var(--text-secondary);">≤ ${iMax} A</td>
    </tr>`);

  const pp = parseInt((DOM.pp||{value:'400'}).value)||400;
  const pacKw = g('invPac') || 0;
  const strPerMpptVal = _getProjectStrPerMpptMax();
  const mixedStrPerMppt = _hasMixedStrPerMppt();

  const FUSE_SIZES_A = [2, 4, 6, 10, 15, 20, 25, 32, 40, 50, 63];
  const nextFuse = I => FUSE_SIZES_A.find(f => f >= I) || 63;

  // ── 4. DC/AC ratio (CEI 0-21 residenziale ≤ 1.33) ──
  if (pacKw > 0 && panels.length > 0) {
    const dcKw  = panels.length * pp / 1000;
    const ratio = dcKw / pacKw;
    const ratioOk = ratio <= 1.33;
    if (!ratioOk) errors++;
    rows.push(`
      <tr style="color:${ratioOk ? '#16a34a' : '#dc2626'};">
        <td style="padding:2px 6px;">${ratioOk ? '✓' : '✗'}</td>
        <td style="padding:2px 6px;">DC/AC ratio</td>
        <td style="padding:2px 6px;font-weight:600;">${ratio.toFixed(2)}</td>
        <td style="padding:2px 6px;color:var(--text-secondary);">≤ 1.33 (CEI 0-21)</td>
      </tr>`);
  }

  // ── 5. Fusibile stringa — formula corretta IEC 62548 §6.3 (condizionale su ISCR) ──
  // Fusibile necessario SOLO se la corrente di back-feed supera la capacità inversa del modulo:
  //   (n_par - 1) × Isc > ISCR_modulo
  if (strPerMpptVal > 1) {
    const backFeedI = (strPerMpptVal - 1) * isc;
    const needsFuseNow = backFeedI > iscr;
    if (needsFuseNow) {
      const fuseMin  = I_str * 1.5;
      const fuseMax  = iscr;           // IEC 62548 §6.3: fusibile ≤ ISCR
      const fuseRec  = nextFuse(fuseMin);
      const fuseOk   = fuseRec <= fuseMax;
      if (!fuseOk) warnings++;
      rows.push(`
        <tr style="color:${fuseOk ? '#16a34a' : '#b45309'};">
          <td style="padding:2px 6px;">${fuseOk ? '✓' : '⚠'}</td>
          <td style="padding:2px 6px;">Fusibile DC stringa (${strPerMpptVal} str/MPPT)</td>
          <td style="padding:2px 6px;font-weight:600;">${fuseRec} A gPV</td>
          <td style="padding:2px 6px;color:var(--text-secondary);">Ib=${fuseMin.toFixed(0)}A–ISCR=${iscr.toFixed(0)}A · (${strPerMpptVal}-1)×Isc=${backFeedI.toFixed(1)}A > ISCR</td>
        </tr>`);
    } else {
      // Stringhe in parallelo ma fusibili non necessari
      rows.push(`
        <tr style="color:#16a34a;">
          <td style="padding:2px 6px;">✓</td>
          <td style="padding:2px 6px;">Fusibile DC stringa (${strPerMpptVal} str/MPPT)</td>
          <td style="padding:2px 6px;font-weight:600;">Non necessario</td>
          <td style="padding:2px 6px;color:var(--text-secondary);">(${strPerMpptVal}-1)×${isc.toFixed(1)}=${backFeedI.toFixed(1)}A ≤ ISCR ${iscr.toFixed(0)}A · IEC 62548 §6.3</td>
        </tr>`);
    }
  }

  // ── 6. Sezionatore DC (IEC 62548 §6.9) ──
  const swV = Math.ceil(V_voc_cold / 100) * 100;
  const swI = nextFuse(I_str);
  rows.push(`
    <tr style="color:var(--text-secondary);">
      <td style="padding:2px 6px;">ℹ</td>
      <td style="padding:2px 6px;">Sezionatore DC min.</td>
      <td style="padding:2px 6px;font-weight:600;">${swV} V / ${swI} A DC</td>
      <td style="padding:2px 6px;color:var(--text-secondary);">IEC 62548 §6.9</td>
    </tr>`);

  // ── 7. Check potenza monofase ≤ 6 kW (CEI 0-21 §8.2.1) ── §16
  const gsQ = id => (document.getElementById(id)||{value:''}).value||'';
  const sysACQ = gsQ('cableSystemAC') || 'mono';
  if (sysACQ === 'mono' && pacKw > 0) {
    const monoOk = pacKw <= 6.0;
    const monoWarn = pacKw > 6.0 && pacKw <= 10.0;
    if (!monoOk && !monoWarn) errors++;
    else if (monoWarn) warnings++;
    rows.push(`
      <tr style="color:${monoOk ? '#16a34a' : monoWarn ? '#b45309' : '#dc2626'};">
        <td style="padding:2px 6px;">${monoOk ? '✓' : monoWarn ? '⚠' : '✗'}</td>
        <td style="padding:2px 6px;">Pac monofase (CEI 0-21 §8.2.1)</td>
        <td style="padding:2px 6px;font-weight:600;">${pacKw.toFixed(1)} kW</td>
        <td style="padding:2px 6px;color:var(--text-secondary);">${monoOk ? '≤ 6 kW ✓' : monoWarn ? '> 6 kW — richiedere autorizzazione DSO (max 10 kW)' : '> 10 kW non ammesso in monofase'}</td>
      </tr>`);
  }

  // ── 8. Regola SPI integrato/esterno (CEI 0-21 §8.2.2.2 + All. A.4.3) ── §17b
  const P_tot_kwp = panels.length * pp / 1000;
  const P_tot_pac = _inverterList.reduce((a,inv)=>a+inv.pac*inv.qty, 0) || pacKw;
  const spiSoglia = 11.08;
  const spiIntegrato = P_tot_pac <= spiSoglia;
  rows.push(`
    <tr style="color:${spiIntegrato ? '#16a34a' : '#b45309'};">
      <td style="padding:2px 6px;">${spiIntegrato ? 'ℹ' : '⚠'}</td>
      <td style="padding:2px 6px;">SPI (CEI 0-21 §8.2.2.2)</td>
      <td style="padding:2px 6px;font-weight:600;">${spiIntegrato ? 'Integrato nell\'inverter' : 'ESTERNO obbligatorio'}</td>
      <td style="padding:2px 6px;color:var(--text-secondary);">Pac tot.= ${P_tot_pac.toFixed(1)} kW ${spiIntegrato ? '≤' : '>'} ${spiSoglia} kW</td>
    </tr>`);
  if (!spiIntegrato) {
    warnings++;
    rows.push(`
      <tr style="color:#b45309;background:#fffbeb;">
        <td style="padding:2px 6px;">⚠</td>
        <td colspan="3" style="padding:2px 6px;font-size:10px;">SPI esterno: compilare marca/modello/matricola nel cartiglio schema unifilare. Allegato G obbligatorio (CEI 0-21 All. A.4.3)</td>
      </tr>`);
  }

  // ── 9. Rincalzo DDI (CEI 0-21 §8.2.2.4 — obbligatorio se Pac > 20 kW) ── §16
  if (P_tot_pac > 20) {
    warnings++;
    rows.push(`
      <tr style="color:#b45309;">
        <td style="padding:2px 6px;">⚠</td>
        <td style="padding:2px 6px;">Rincalzo DDI (§8.2.2.4)</td>
        <td style="padding:2px 6px;font-weight:600;">Obbligatorio</td>
        <td style="padding:2px 6px;color:var(--text-secondary);">Pac > 20 kW → rincalzo entro 0.5 s</td>
      </tr>`);
  }

  // ── 10. SPD DC obbligatorio se cavo DC > 10 m (CEI 0-21 §16) ──
  const cableDCLen = parseFloat((document.getElementById('cableLenString')||{value:'20'}).value) || 20;
  if (cableDCLen > 10) {
    rows.push(`
      <tr style="color:var(--text-secondary);">
        <td style="padding:2px 6px;">ℹ</td>
        <td style="padding:2px 6px;">SPD DC (cavo stringa ${cableDCLen} m)</td>
        <td style="padding:2px 6px;font-weight:600;">Obbligatorio</td>
        <td style="padding:2px 6px;color:var(--text-secondary);">Cavo DC > 10 m → SPD T2 in cassetta</td>
      </tr>`);
  }

  // ── Semaforo globale ──
  const badgeLabel  = errors > 0 ? `✗ ${errors} errore/i` : warnings > 0 ? `⚠ ${warnings} avviso/i` : '✓ OK';
  const badgeTitle  = errors > 0 ? 'Stringa NON compatibile con questo inverter'
                    : warnings > 0 ? 'Verificare avvisi di progetto'
                    : 'Stringa compatibile con questo inverter';
  const badgeColor  = errors > 0 ? '#dc2626' : warnings > 0 ? '#b45309' : '#16a34a';
  const badgeBg     = errors > 0 ? '#fef2f2' : warnings > 0 ? '#fffbeb' : '#f0fdf4';
  const badgeBorder = errors > 0 ? '#fca5a5' : warnings > 0 ? '#fcd34d' : '#bbf7d0';

  el.innerHTML = `
    <div style="border:2px solid ${badgeBorder};border-radius:8px;overflow:hidden;margin-top:6px;">
      <div style="background:${badgeBg};padding:6px 10px;display:flex;align-items:center;gap:8px;border-bottom:1px solid ${badgeBorder};">
        <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${badgeColor};flex-shrink:0;"></span>
        <span style="font-size:var(--fs-xs);font-weight:700;color:${badgeColor};">${badgeLabel}</span>
        <span style="font-size:var(--fs-xs);color:var(--text-secondary);margin-left:auto;">${badgeTitle}</span>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:var(--fs-xs);line-height:1.7;background:var(--bg-secondary);">
        <tbody>${rows.join('')}</tbody>
      </table>
      <div style="background:${badgeBg};padding:3px 10px;font-size:10px;color:var(--text-secondary);border-top:1px solid ${badgeBorder};">
        Voc calcolata a T=-10°C · Vmpp calcolata a T=+70°C · γVoc=${(tcoefVoc).toFixed(2)}%/°C
      </div>
    </div>`;
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

// ── Verifiche elettriche (sezione HTML separata, non dentro l'SVG) ──────────
function _renderVerifiche() {
  const el = document.getElementById('verificheContainer');
  const badge = document.getElementById('verificheBadge');
  if (!el) return;

  // Raccoglie gli stessi parametri di calcCables
  const g = id => { const e = document.getElementById(id); return e ? (parseFloat(e.value)||0) : 0; };
  const gs = id => { const e = document.getElementById(id); return e ? e.value : ''; };

  const voc      = g('moduleVoc'),  vmpp = g('moduleVmpp');
  const isc      = g('moduleIsc'),  pp   = g('modulePp') || g('pp');
  const tcoef    = g('moduleTcoefVoc') || -0.30;
  const vsysMaxU = g('moduleVsysMax') || 1000;
  const kVoc     = tcoef / 100;
  const vocCold  = voc * (1 + kVoc * (-10 - 25));
  const vmppHot  = vmpp * (1 + kVoc * (70 - 25));

  const modsPerStr = g('modsPerString') || g('numModulesPerString') || 1;
  const strPerMppt = g('stringsPerMppt') || g('numStringsPerMppt') || 1;
  const V_str_cold = vocCold * modsPerStr;
  const V_str_voc  = voc * modsPerStr;
  const V_str_vmpp = vmpp * modsPerStr;
  const vmppHotStr = vmppHot * modsPerStr;
  const I_str_des  = isc * 1.25;

  const invVocMax = g('invVocMax') || g('invVmpptMax') * 1.2;
  const invVmpMin = g('invVmpptMin');
  const invVmpMax = g('invVmpptMax');
  const invImax   = g('invImaxMppt');
  const invPac    = g('invPac');
  const P_kwp     = (g('numPanels') || g('totPanels') || 1) * pp / 1000;
  const P_pac_tot = invPac;

  const lenStr    = g('cableLenString') || 10;
  const lenAC     = g('cableLenAC') || 10;
  const dropDCpct = g('cableDropDC') || 1.0;
  const mat       = gs('cableMaterial') || 'cu';
  const sysAC     = gs('cableSystemAC') || 'mono';
  const V_AC      = sysAC === 'mono' ? 230 : 400;
  const I_AC      = P_pac_tot > 0 ? (sysAC === 'mono' ? P_pac_tot*1000/V_AC : P_pac_tot*1000/(V_AC*Math.sqrt(3)*0.98)) : 0;

  let S_str = 4;
  try { S_str = calcSection(I_str_des, lenStr, (dropDCpct/100)*V_str_vmpp, mat, 2, true); } catch(e){ /* keep S_str fallback (4 mm²) */ }
  let S_AC_calc = 6;
  try { S_AC_calc = calcSectionAC(I_AC, lenAC, (1.0/100)*V_AC, mat, sysAC==='mono'?2:Math.sqrt(3), 0.98); } catch(e){ /* keep S_AC_calc fallback (6 mm²) */ }

  const sigma = mat==='cu' ? 56 : 34;
  const dVdc_pct = V_str_vmpp>0 ? ((2*lenStr*I_str_des)/(sigma*S_str*V_str_vmpp))*100 : 0;
  const dVac_pct = V_AC>0 ? ((2*lenAC*I_AC)/(sigma*S_AC_calc*V_AC))*100 : 0;

  const iscrU    = g('moduleIscr') || (isc * 1.35);
  const needsFuse = (strPerMppt - 1) * isc > iscrU;
  const FUSE_STD  = [2,4,6,10,15,20,25,32,40,50,63];
  const fuseMin_A = I_str_des * 1.5;
  const fuseRec_A = FUSE_STD.find(f => f >= fuseMin_A) || 63;
  const spiIntegrato = P_pac_tot <= 11.08;

  const rows = [
    { cat: 'DC', lbl: 'Voc stringa @ -10°C',       val: `${V_str_cold.toFixed(0)} V`,  ref: `≤ ${invVocMax>0?invVocMax:'—'} V (inv.)`,   ok: invVocMax>0 ? V_str_cold<=invVocMax : null },
    { cat: 'DC', lbl: 'Voc stringa vs 1000 V sys',  val: `${V_str_cold.toFixed(0)} V`,  ref: '≤ 1000 V (cavi cl.I)',                        ok: V_str_cold<=1000 },
    { cat: 'DC', lbl: `Voc stringa vs Vsys mod. (${vsysMaxU}V)`, val: `${V_str_cold.toFixed(0)} V`, ref: `≤ ${vsysMaxU} V (modulo)`, ok: V_str_cold<=vsysMaxU },
    { cat: 'DC', lbl: 'Vmpp stringa @ +70°C',        val: `${vmppHotStr.toFixed(0)} V`, ref: `≥ ${invVmpMin>0?invVmpMin:'—'} V (inv.)`,   ok: invVmpMin>0 ? vmppHotStr>=invVmpMin : null },
    { cat: 'DC', lbl: 'Vmpp stringa vs MPPT max',    val: `${V_str_vmpp.toFixed(0)} V`, ref: `≤ ${invVmpMax>0?invVmpMax:'—'} V (inv.)`,   ok: invVmpMax>0 ? V_str_vmpp<=invVmpMax : null },
    { cat: 'DC', lbl: 'Corrente DC progetto',         val: `${I_str_des.toFixed(1)} A`,  ref: `≤ ${invImax>0?invImax:'—'} A (inv.)`,       ok: invImax>0 ? I_str_des<=invImax : null },
    { cat: 'DC', lbl: 'Caduta tensione DC',           val: `${dVdc_pct.toFixed(2)} %`,   ref: `≤ ${dropDCpct.toFixed(1)} %`,                ok: dVdc_pct<=dropDCpct },
    { cat: 'AC', lbl: 'Corrente AC nominale',         val: `${I_AC.toFixed(1)} A`,       ref: `Cavo ${S_AC_calc} mm²`,                      ok: true },
    { cat: 'AC', lbl: 'Caduta tensione AC',           val: `${dVac_pct.toFixed(2)} %`,   ref: '≤ 1.0 %',                                    ok: dVac_pct<=1.0 },
    { cat: 'SYS', lbl: 'DC/AC ratio',                val: P_pac_tot>0 ? (P_kwp/P_pac_tot).toFixed(2) : '—', ref: '≤ 1.33 (CEI 0-21)',    ok: P_pac_tot>0 ? P_kwp/P_pac_tot<=1.33 : null },
    { cat: 'SYS', lbl: 'SPI integrato in inverter',  val: spiIntegrato ? 'Sì (Plug&Play)' : 'No — esterno obbligatorio', ref: 'Pac ≤ 11.08 kW', ok: spiIntegrato },
    ...(needsFuse ? (() => {
      const It2_cable = (115*115)*(S_str*S_str);
      const It2_fuse  = fuseRec_A*fuseRec_A*0.01;
      return [{ cat:'DC', lbl:`Coord. fusibile/cavo I²t (fus. ${fuseRec_A}A gPV)`, val:`${(It2_fuse/1e6).toFixed(3)} MA²s`, ref:`< ${(It2_cable/1e6).toFixed(3)} MA²s`, ok: It2_fuse<It2_cable }];
    })() : []),
  ];

  const nFail = rows.filter(r => r.ok === false).length;
  const nOk   = rows.filter(r => r.ok === true).length;

  // Badge
  if (badge) {
    if (nFail > 0) { badge.textContent = `${nFail} KO`; badge.style.background='#fee2e2'; badge.style.color='#dc2626'; }
    else           { badge.textContent = `${nOk} OK`;   badge.style.background='#e8f5e9'; badge.style.color='#16a34a'; }
  }

  const catColors = { DC:'#cc3300', AC:'#1e4aaa', SYS:'#374151' };
  const catBg     = { DC:'#fff5f0', AC:'#f0f4ff', SYS:'#f9fafb' };

  el.innerHTML = `
<table style="width:100%;border-collapse:collapse;font-size:13px;">
  <thead>
    <tr style="background:#f0f4ff;border-bottom:2px solid #c7d8f5;">
      <th style="padding:7px 10px;text-align:left;color:#1e4aaa;font-weight:700;width:40px;">Cat.</th>
      <th style="padding:7px 10px;text-align:left;color:#1e4aaa;font-weight:700;">Parametro</th>
      <th style="padding:7px 10px;text-align:right;color:#1e4aaa;font-weight:700;width:110px;">Valore</th>
      <th style="padding:7px 10px;text-align:right;color:#1e4aaa;font-weight:700;width:180px;">Limite / Riferimento</th>
      <th style="padding:7px 10px;text-align:center;color:#1e4aaa;font-weight:700;width:40px;">✓/✗</th>
    </tr>
  </thead>
  <tbody>
    ${rows.map((r,i) => {
      const ok = r.ok;
      const sc = ok===null ? '#888' : ok ? '#16a34a' : '#dc2626';
      const ic = ok===null ? '—' : ok ? '✓' : '✗';
      const bg = i%2===0 ? catBg[r.cat]||'#fff' : '#fff';
      return `<tr style="background:${bg};border-bottom:1px solid #eee;">
        <td style="padding:6px 10px;font-size:11px;font-weight:700;color:${catColors[r.cat]||'#333'};text-align:center;">${r.cat}</td>
        <td style="padding:6px 10px;color:#222;">${r.lbl}</td>
        <td style="padding:6px 10px;text-align:right;font-weight:600;color:${sc};">${r.val}</td>
        <td style="padding:6px 10px;text-align:right;color:#666;font-size:12px;">${r.ref}</td>
        <td style="padding:6px 10px;text-align:center;font-weight:700;color:${sc};font-size:16px;">${ic}</td>
      </tr>`;
    }).join('')}
  </tbody>
  <tfoot>
    <tr style="border-top:2px solid #c7d8f5;background:#f8f9ff;">
      <td colspan="5" style="padding:6px 10px;font-size:11px;color:#888;">
        Riferimenti: CEI 0-21:2025 · IEC 62548 · T_min = −10 °C / T_max = +70 °C · IEC 60269-6
      </td>
    </tr>
  </tfoot>
</table>`;
}




