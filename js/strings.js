// ── strings.js — Gestione stringhe inverter, legenda, statistiche ──

'use strict';

// ── Toolbar stringhe dropdown ─────────────────────────────────────────────────

function toggleStrConfig() {
  if (panels.length === 0) { showToast('Posizionare moduli prima di configurare le stringhe', 'warn'); return; }
  const panel = DOM.strConfigPanel;
  const btn   = DOM.strConfigBtn;
  const arrow = DOM.strConfigArrow;
  const isOpen = panel.classList.contains('open');
  panel.classList.toggle('open', !isOpen);
  btn.classList.toggle('open', !isOpen);
  arrow.style.transform = isOpen ? '' : 'rotate(180deg)';
  if (!isOpen) updateStringPreview();
}

function closeString() {
  const panel = DOM.strConfigPanel;
  const btn   = DOM.strConfigBtn;
  const arrow = DOM.strConfigArrow;
  if (panel) panel.classList.remove('open');
  if (btn)   btn.classList.remove('open');
  if (arrow) arrow.style.transform = '';
}

function adjString(d) { /* non usato — stringhe calcolate automaticamente */ }
function adjPair(d)   { /* non usato — MPPT fissati dal parco inverter */ }

function _getVmppTempCoeff() {
  const pmax = parseFloat((document.getElementById('moduleTcoefPmax') || { value: '0' }).value);
  const voc  = parseFloat((document.getElementById('moduleTcoefVoc') || { value: '-0.30' }).value) || -0.30;
  return Number.isFinite(pmax) && pmax !== 0 ? pmax : voc;
}

function _getExpectedStringTotal() {
  return Math.max(1, parseInt((document.getElementById('invStrTot') || { value: '1' }).value, 10) || 1);
}


function updateStringPreview() {
  const total  = panels.length;
  const pp     = parseInt((DOM.pp || {value:'400'}).value) || 400;
  const btn    = DOM.stringConfirmBtn;

  // Dati modulo
  const voc       = parseFloat((document.getElementById('moduleVoc')       || {value:'45'}).value)  || 45;
  const vmpp      = parseFloat((document.getElementById('moduleVmpp')      || {value:'38'}).value)  || (voc * 0.82);
  const isc       = parseFloat((document.getElementById('moduleIsc')       || {value:'9'}).value)   || 9;
  const tcoefVoc  = parseFloat((document.getElementById('moduleTcoefVoc')  || {value:'-0.30'}).value) || -0.30; // %/°C
  const tcoefVmpp = _getVmppTempCoeff();

  // Correzione termica (CEI EN 62548): T_min=-10°C per Voc, T_max=70°C per Vmpp
  const T_min = -10, T_max = 70, T_stc = 25;
  const kVoc   = tcoefVoc / 100;
  const kVmpp  = tcoefVmpp / 100;
  const vocCold  = voc  * (1 + kVoc * (T_min - T_stc));  // Voc a -10°C (più alta → caso peggiore)
  const vmppHot  = vmpp * (1 + kVmpp * (T_max - T_stc));  // Vmpp a 70°C (più bassa → caso peggiore)
  const vmppCold = vmpp * (1 + kVmpp * (T_min - T_stc));  // Vmpp a -10°C (più alta → caso peggiore)

  // Limiti inverter (da campi hidden settati da updateInverterListUI)
  const vocMax = parseFloat((document.getElementById('invVocMax')   || {value:'0'}).value) || 0;
  const vMin   = parseFloat((document.getElementById('invVmpptMin') || {value:'0'}).value) || 0;
  const vMax   = parseFloat((document.getElementById('invVmpptMax') || {value:'0'}).value) || 0;
  const iMax   = parseFloat((document.getElementById('invImaxMppt') || {value:'0'}).value) || 0;
  const pacKw  = parseFloat((document.getElementById('invPac')      || {value:'0'}).value) || 0;

  // Stringhe totali fisse dal parco inverter (mppt × strPerMppt × qty, da datasheet)
  const strTot = _getExpectedStringTotal();

  const noInverter = _inverterList.length === 0;
  const mixedStrPerMppt = _hasMixedStrPerMppt();

  // ── Box calcolo ottimale CEI ──────────────────────────────────────────────────
  const optBox       = document.getElementById('optimalConfigBox');
  const panelMatchBox= document.getElementById('panelMatchBox');
  const preview      = DOM.stringPreview;
  const divEl        = DOM.stringDivisors;
  const mpsvEl       = document.getElementById('moduliPerStringaVal');
  const strCalcEl    = document.getElementById('stringCalcValues');
  const schemaEl     = document.getElementById('mpptSchema');

  if (noInverter) {
    if (optBox)       optBox.innerHTML = `<div style="color:var(--text-tertiary);font-size:var(--fs-xs);padding:6px 8px;background:var(--bg-tertiary);border-radius:var(--radius-sm);">Aggiungi inverter nel blocco 1 per avviare il calcolo.</div>`;
    if (panelMatchBox) panelMatchBox.innerHTML = '';
    if (preview)      { preview.innerHTML = ''; preview.style.background = ''; preview.style.border = ''; }
    if (divEl)        divEl.innerHTML = '';
    if (mpsvEl)       mpsvEl.textContent = '—';
    if (strCalcEl)    strCalcEl.innerHTML = '';
    if (schemaEl)     schemaEl.innerHTML = '';
    if (btn) { btn.disabled = true; btn.style.opacity = '0.4'; }
    return;
  }

  // Calcola range moduli per stringa dai limiti inverter (con correzione termica)
  const n_max_voc  = vocMax > 0 ? Math.floor(vocMax / vocCold)  : 99;  // usa Voc a -10°C (caso peggiore)
  const n_min_vmpp = vMin   > 0 ? Math.ceil(vMin   / vmppHot)   : 1;   // usa Vmpp a 70°C (caso peggiore)
  const n_max_vmpp = vMax   > 0 ? Math.floor(vMax  / vmppCold) : 99;  // usa Vmpp a -10??C
  const n_opt      = Math.min(n_max_voc, n_max_vmpp);   // max moduli rispettando Voc e Vmpp

  // Pannelli min/max installabili con questo parco inverter
  const panels_max = strTot * n_opt;
  const panels_min = strTot * n_min_vmpp;

  // State flags used both by panelMatchBox rendering and the final
  // configOk check below — function-scoped to match panels_max / ratioOk.
  const strPerMppt   = _getProjectStrPerMpptMax();
  const overInverter = total > panels_max;

  // DC/AC ratio (CEI 0-21: max 1.33)
  const ratio    = pacKw > 0 ? (total * pp / 1000) / pacKw : 0;
  const ratioOk  = ratio <= 1.33;

  // ── optimalConfigBox ──
  if (optBox) {
    optBox.innerHTML = `
      <div style="background:var(--bg-secondary);border:1px solid var(--border-default);border-radius:var(--radius-sm);padding:8px 10px;margin-bottom:8px;font-size:var(--fs-xs);">
        <div style="font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">Calcolo automatico CEI — ${strTot} stringhe</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <div><span style="color:var(--text-tertiary);">Min mod./str. (Vmpp@70°C≥${vMin}V):</span><br><b style="font-size:var(--fs-sm);">${n_min_vmpp} mod.</b></div>
          <div><span style="color:var(--text-tertiary);">Max mod./str. (Voc@-10°C≤${vocMax}V, Vmpp≤${vMax}V):</span><br><b style="color:var(--accent-text);font-size:var(--fs-sm);">${n_opt} mod.</b></div>
          <div><span style="color:var(--text-tertiary);">Pannelli min installabili:</span><br><b>${panels_min} mod. · ${(panels_min*pp/1000).toFixed(1)} kWp</b></div>
          <div><span style="color:var(--text-tertiary);">Pannelli max installabili:</span><br><b style="color:var(--accent-text);">${panels_max} mod. · ${(panels_max*pp/1000).toFixed(1)} kWp</b></div>
        </div>
        <div style="margin-top:5px;padding-top:5px;border-top:1px solid var(--border-default);color:var(--text-tertiary);font-size:10px;">
          γVoc=${tcoefVoc.toFixed(2)}%/°C · γVmpp=${tcoefVmpp.toFixed(2)}%/°C · Voc@-10°C=${vocCold.toFixed(1)}V · Vmpp@70°C=${vmppHot.toFixed(1)}V
        </div>
        ${pacKw > 0 ? `<div style="margin-top:4px;color:${ratioOk?'var(--accent-text)':'var(--warning-text)'};">
          ${ratioOk?'✓':'⚠'} DC/AC ratio: ${ratio.toFixed(2)} (max 1.33 — CEI 0-21)
        </div>` : ''}
      </div>`;
  }

  // ── Verifica bilanciamento MPPT e azioni correttive ──
  if (panelMatchBox) {
    const physMax    = _countPhysicalMax();

    // Regola corretta: total % strPerMppt === 0
    // Ogni MPPT ha strPerMppt stringhe uguali tra loro.
    // MPPT diversi possono avere conteggi diversi → non conta strTot.
    const leftover   = total % strPerMppt;
    const isBalanced = total > 0 && leftover === 0;

    // Minimo aggiustamento per bilanciare
    const toRemove = leftover;                    // togli 'leftover' pannelli → scendi al multiplo corretto
    const toAdd    = strPerMppt - leftover;       // aggiungi per salire al prossimo multiplo corretto

    // Verifica anche limiti inverter (secondaria rispetto al bilanciamento)
    const underInverter = total < panels_max;

    // Status
    let statusHtml = '';
    if (mixedStrPerMppt) {
      statusHtml = `<span style="color:var(--warning-text);font-weight:600;">⚠ Parco inverter misto con stringhe/MPPT diverse: configurazione automatica bloccata</span>`;
    } else if (total === 0) {
      statusHtml = `<span style="color:var(--text-tertiary);">Nessun pannello posizionato.</span>`;
    } else if (isBalanced && !overInverter) {
      statusHtml = `<span style="color:var(--accent-text);font-weight:600;">✓ ${total} pannelli — MPPT bilanciati${total === panels_max ? ', configurazione ottimale' : ''}</span>`;
    } else if (isBalanced && overInverter) {
      statusHtml = `<span style="color:var(--warning-text);font-weight:600;">⚠ ${total} pannelli — bilanciati ma ${total - panels_max} in eccesso rispetto al massimo inverter (${panels_max})</span>`;
    } else {
      // Sbilanciato: mostra cosa serve per bilanciare
      statusHtml = `<span style="color:var(--warning-text);font-weight:600;">⚠ ${total} pannelli — 1 MPPT sbilanciato</span>
        <span style="color:var(--text-tertiary);font-size:10px;display:block;margin-top:2px;">Per bilanciare: togli ${toRemove} oppure aggiungi ${toAdd} pannello/i</span>`;
    }

    const BS = (on, col) => on
      ? `style="flex:1;padding:6px 8px;font-size:var(--fs-xs);font-weight:600;border-radius:var(--radius-sm);border:1px solid ${col};background:var(--bg-secondary);color:${col};cursor:pointer;"`
      : `style="flex:1;padding:6px 8px;font-size:var(--fs-xs);font-weight:600;border-radius:var(--radius-sm);border:1px solid var(--border-default);background:var(--bg-tertiary);color:var(--text-tertiary);cursor:not-allowed;opacity:0.5;"`;

    // Pulsanti: attivi SOLO quando c'è uno sbilanciamento da correggere
    const canRem  = !isBalanced && total > toRemove;
    const canAdd2 = !isBalanced && physMax >= total + toAdd;
    const targetRem = total - toRemove;
    const targetAdd = total + toAdd;

    // Pulsante Togli per eccesso inverter (caso bilanciato ma sopra limits)
    const canTrimInv = isBalanced && overInverter;
    const trimCount  = total - panels_max;

    let note = '';
    if (!isBalanced && !canAdd2) {
      note = `<div style="margin-top:6px;font-size:10px;color:var(--text-tertiary);">Nessuno spazio fisico per aggiungere ${toAdd} pannello/i (max fisico: ${physMax}). Aggiungi una nuova area.</div>`;
    }
    if (mixedStrPerMppt) {
      note = `<div style="margin-top:6px;font-size:10px;color:var(--warning-text);">Usa inverter con stesso numero di stringhe per MPPT oppure gestisci il layout manualmente: la generazione automatica viene disabilitata per sicurezza.</div>`;
    }

    panelMatchBox.innerHTML = `
      <div style="background:var(--bg-secondary);border:1px solid var(--border-default);border-radius:var(--radius-sm);padding:8px 10px;margin-bottom:8px;">
        <div style="margin-bottom:8px;font-size:var(--fs-xs);">${statusHtml}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          ${!isBalanced && !mixedStrPerMppt ? `
          <button ${BS(canRem, 'var(--danger)')}
            onclick="${canRem ? `adjustPanelCount(${targetRem})` : ''}"
            ${canRem ? '' : 'disabled'}
            title="Rimuovi ${toRemove} pannello/i per bilanciare gli MPPT (${total} → ${targetRem})">
            − Togli ${toRemove} → ${targetRem}
          </button>
          <button ${BS(canAdd2, 'var(--accent)')}
            onclick="${canAdd2 ? `adjustPanelCount(${targetAdd})` : ''}"
            ${canAdd2 ? '' : 'disabled'}
            title="${canAdd2 ? `Aggiungi ${toAdd} pannello/i per bilanciare gli MPPT (${total} → ${targetAdd})` : `Spazio fisico insufficiente (max ${physMax})`}">
            + Aggiungi ${toAdd} → ${targetAdd}
          </button>` : ''}
          ${canTrimInv ? `
          <button ${BS(true, 'var(--warning)')}
            onclick="adjustPanelCount(${panels_max})"
            title="Rimuovi ${trimCount} pannelli in eccesso rispetto al massimo inverter (${panels_max})">
            − Togli ${trimCount} eccesso
          </button>` : ''}
          <button style="flex:1;padding:6px 8px;font-size:var(--fs-xs);font-weight:600;border-radius:var(--radius-sm);border:1px solid var(--border-default);background:var(--bg-secondary);color:var(--text-primary);cursor:pointer;"
            onclick="addNewInstallableArea()"
            title="Disegna una nuova area installabile">
            + Nuova area
          </button>
        </div>
        ${note}
      </div>`;
  }

  // ── Moduli per stringa (basato sui pannelli effettivamente disegnati) ──
  // Usa n_opt come moduli per stringa di riferimento; se i pannelli non dividono esatto, lo segnala
  const modsPerStr = n_opt;  // moduli per stringa ottimali da calcolo
  const panels_actual_str = strTot * modsPerStr;
  const base  = total > 0 ? Math.floor(total / strTot) : modsPerStr;
  const resto = total > 0 ? total % strTot : 0;

  if (mpsvEl) {
    if (total === 0) {
      mpsvEl.textContent = `${modsPerStr} mod. (ottimale)`;
      mpsvEl.style.color = 'var(--accent)';
    } else if (resto === 0) {
      mpsvEl.textContent = base + ' mod.';
      mpsvEl.style.color = base === modsPerStr ? 'var(--accent)' : 'var(--warning)';
    } else {
      mpsvEl.textContent = base + '–' + (base+1) + ' mod. (non intero)';
      mpsvEl.style.color = 'var(--warning)';
    }
  }

  // ── Preview stringa ──
  // Bilanciamento corretto: total % strPerMppt === 0
  // (ogni MPPT ha strPerMppt stringhe uguali; MPPT diversi possono differire)
  if (preview) {
    const spm       = _getProjectStrPerMpptMax();
    const lft       = total % spm;
    const balanced2 = total === 0 || lft === 0;

    preview.style.background = balanced2 ? 'var(--accent-light)' : 'var(--warning-light)';
    preview.style.border      = balanced2 ? '1px solid var(--accent)' : '1px solid var(--warning)';

    if (total === 0) {
      preview.innerHTML = `<b>${strTot} stringhe</b> — nessun pannello posizionato`;
    } else if (balanced2) {
      preview.innerHTML = `<b>${total} pannelli</b> — divisibili per ${spm} str/MPPT<br>
        <span style="color:var(--accent-text);">✓ Tutti gli MPPT bilanciabili</span>`;
    } else {
      preview.innerHTML = `<b>${total} pannelli</b> — resto ${lft} rispetto a ${spm} str/MPPT<br>
        <span style="color:var(--warning-text);">⚠ Togli ${lft} oppure aggiungi ${spm - lft} pannello/i per bilanciare</span>`;
    }
  }

  // ── Valori elettrici stringa (con correzione termica) ──
  const mods_ref = total > 0 ? base : modsPerStr;
  if (strCalcEl && mods_ref > 0) {
    const Voc_cold_str  = (vocCold  * mods_ref).toFixed(0);   // Voc stringa @ -10°C
    const Vmpp_hot_str  = (vmppHot  * mods_ref).toFixed(0);   // Vmpp stringa @ 70°C
    const Vmpp_cold_str = (vmppCold * mods_ref).toFixed(0);   // Vmpp stringa @ -10°C
    const Isc_str       = (isc * 1.25 * _getProjectStrPerMpptMax()).toFixed(1);
    function chk(val, lo, hi, unit) {
      if (!lo && !hi) return `<span style="color:var(--text-tertiary);">—</span>`;
      const v = parseFloat(val), ok = (!lo||v>=lo) && (!hi||v<=hi);
      const limit = lo && hi ? `[${lo}–${hi}${unit}]` : hi ? `≤${hi}${unit}` : `≥${lo}${unit}`;
      return `<span style="color:${ok?'var(--accent-text)':'var(--danger)'};font-weight:600;">${ok?'✓':'⚠'} ${val}${unit}</span> <span style="color:var(--text-tertiary);font-size:10px;">${limit}</span>`;
    }
    strCalcEl.innerHTML = `
      <div style="background:var(--bg-secondary);border:1px solid var(--border-default);border-radius:var(--radius-sm);padding:8px 10px;margin-bottom:8px;font-size:var(--fs-xs);">
        <div style="font-weight:600;color:var(--text-secondary);margin-bottom:5px;">Valori elettrici stringa (${mods_ref} mod.)</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
          <div>
            <div style="color:var(--text-tertiary);">Voc stringa @-10°C</div>
            ${chk(Voc_cold_str, 0, vocMax,' V')}
          </div>
          <div>
            <div style="color:var(--text-tertiary);">Vmpp str. @70°C / -10°C</div>
            <span style="font-size:10px;color:var(--text-tertiary);">${Vmpp_hot_str}V / </span>${chk(Vmpp_cold_str, vMin, vMax,' V')}
          </div>
          <div>
            <div style="color:var(--text-tertiary);">Isc×1.25 × str/MPPT</div>
            ${chk(Isc_str, 0, iMax,' A')}
          </div>
        </div>
      </div>`;
  } else if (strCalcEl) {
    strCalcEl.innerHTML = '';
  }

  // ── Schema visivo MPPT (max 8 inverter per leggibilità) ──
  if (schemaEl) {
    if (_inverterList.length > 0 && _inverterList.length <= 8) {
      let html = '<div style="display:flex;flex-direction:column;gap:3px;margin-bottom:8px;">';
      _inverterList.forEach(inv => {
        for (let q = 0; q < inv.qty; q++) {
          html += `<div style="font-size:10px;background:var(--bg-secondary);border:1px solid var(--border-default);border-radius:3px;padding:3px 7px;">
            <b style="color:var(--text-primary);">${inv.brand} ${inv.model}</b> — ${inv.mppt} MPPT × ${inv.strPerMppt} str =
            <b style="color:var(--accent-text);">${inv.mppt*inv.strPerMppt} stringhe</b>
            ${total>0?`, ${mods_ref} mod/str → <b>${inv.mppt*inv.strPerMppt*mods_ref} pannelli</b>`:''}
          </div>`;
        }
      });
      html += '</div>';
      schemaEl.innerHTML = html;
    } else {
      schemaEl.innerHTML = '';
    }
  }

  // Divisori non più necessari con logica automatica
  if (divEl) divEl.innerHTML = '';

  // Aggiorna pairNum hidden con strTot (usato da confirmString e calcCables)
  if (DOM.pairNum) DOM.pairNum.value = strTot;
  if (DOM.stringNum) DOM.stringNum.value = 1;

  if (btn) {
    const configOk = !mixedStrPerMppt && total > 0 && !overInverter && ratioOk && (strPerMppt <= 1 || total % strPerMppt === 0);
    btn.disabled = !configOk;
    btn.style.opacity = configOk ? '' : '0.4';
  }
}

function setTotalStrings(total) { /* non usato — stringhe fisse da datasheet */ }

/**
 * Conta quanti pannelli possono fisicamente stare nelle aree disegnate
 * (senza limite inverter), usando layoutSingleArea con maxCount=999999.
 */
function _countPhysicalMax() {
  if (!installableAreas.length) return 0;
  const mWbase = Math.max(0.1, parseFloat(DOM.pw.value) || 1);
  const mHbase = Math.max(0.1, parseFloat(DOM.pl.value) || 1.7);
  let tot = 0;
  installableAreas.forEach((area, idx) => {
    const aOrient = area.orientation || panelOrientation || 'auto';
    let cnt;
    if (aOrient === 'portrait') {
      cnt = layoutSingleArea(area, idx, mWbase, mHbase, 999999).length;
    } else if (aOrient === 'landscape') {
      cnt = layoutSingleArea(area, idx, mHbase, mWbase, 999999).length;
    } else {
      cnt = Math.max(
        layoutSingleArea(area, idx, mWbase, mHbase, 999999).length,
        layoutSingleArea(area, idx, mHbase, mWbase, 999999).length
      );
    }
    tot += cnt;
  });
  return tot;
}

/**
 * Ridisegna il layout con esattamente `target` pannelli usando engineeringLayout.
 * Se target > capacità fisica → usa il max disponibile.
 */
function adjustPanelCount(target) {
  if (!installableAreas.length) { showToast('Nessuna area installabile', 'warn'); return; }
  const physMax = _countPhysicalMax();
  const effective = Math.min(target, physMax);
  if (effective <= 0) { showToast('Nessun pannello posizionabile nelle aree disponibili', 'warn'); return; }
  snapshot();
  engineeringLayout(effective);
  const expectedStrings = _getExpectedStringTotal();
  if (strings.length > 0) genStrings(expectedStrings);
  updateStats();
  updateStringPreview();
  if (typeof calcCables === 'function') calcCables();
  showToast(`Layout aggiornato: ${panels.length} pannelli`, panels.length === target ? 'ok' : 'warn');
}

/**
 * Attiva la modalità disegno area installabile e scorre allo step 5.
 */
function addNewInstallableArea() {
  // Scorri alla sezione 5 (aree installabili)
  const s5 = document.getElementById('s5');
  if (s5) s5.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // Avvia disegno area installabile
  if (typeof startArea === 'function') startArea('installable');
  showToast('Disegna la nuova area installabile sul canvas', 'ok', 3000);
}

// ── Assegna metadata inverter/MPPT a ogni stringa ────────────────────────────

function _assignInverterMeta() {
  if (!strings.length || !_inverterList.length) return;
  let strCursor = 0;
  let invNumber = 0;
  _inverterList.forEach(inv => {
    for (let q = 0; q < inv.qty; q++) {
      invNumber++;
      const label = inv.qty > 1
        ? `Inverter ${invNumber} — ${inv.brand} ${inv.model} (${q+1}/${inv.qty})`
        : `Inverter ${invNumber} — ${inv.brand} ${inv.model}`;
      for (let m = 0; m < inv.mppt; m++) {
        for (let s = 0; s < inv.strPerMppt; s++) {
          if (strCursor < strings.length) {
            strings[strCursor].invIdx   = invNumber - 1;
            strings[strCursor].invLabel = label;
            strings[strCursor].mpptIdx  = m;
            strCursor++;
          }
        }
      }
    }
  });
}

function setInverterFilter(val) {
  _highlightInvIdx = parseInt(val);
  draw();
}

function _updateInvFilterSel() {
  const sel = document.getElementById('invFilterSel');
  if (!sel) return;
  // Mostra il filtro solo se ci sono stringhe e almeno 2 unità inverter
  let totalUnits = 0;
  _inverterList.forEach(inv => { totalUnits += inv.qty; });
  if (strings.length === 0 || totalUnits < 2) {
    sel.style.display = 'none';
    _highlightInvIdx = -1;
    return;
  }
  let html = '<option value="-1">Tutti inverter</option>';
  let invNumber = 0;
  _inverterList.forEach(inv => {
    for (let q = 0; q < inv.qty; q++) {
      invNumber++;
      const label = inv.qty > 1
        ? `Inv ${invNumber} (${inv.model} #${q+1})`
        : `Inv ${invNumber} (${inv.model})`;
      html += `<option value="${invNumber - 1}">${label}</option>`;
    }
  });
  sel.innerHTML = html;
  sel.value = _highlightInvIdx >= 0 ? String(_highlightInvIdx) : '-1';
  sel.style.display = 'inline-block';
}

function confirmString() {
  closeString();
  genStrings(_getExpectedStringTotal());
  if (typeof calcCables === 'function') calcCables();
}

// ── genStrings ────────────────────────────────────────────────────────────────

function genStrings(numStrings, offset) {
  offset = offset || 0;
  let toAssign;
  if (offset === 0) {
    snapshot();
    strings = [];
    panels.forEach(p => { p.strId = null; p.stringColor = null; });
    toAssign = [...panels];
  } else {
    toAssign = panels.filter(p => !p.strId);
  }
  if (toAssign.length === 0) return;

  // Distribuzione MPPT-bilanciata (logica corretta):
  // Ogni MPPT ha strPerMppt stringhe che devono essere uguali tra loro.
  // MPPT diversi possono avere conteggi diversi → OK.
  // Condizione: toAssign.length % strPerMppt === 0 (già garantito da pannelli bilanciati).
  // Se non divisibile, distribuiamo comunque al meglio (1 MPPT sarà sbilanciato).
  const strPerMppt = _getProjectStrPerMpptMax();
  const numMppts   = (strPerMppt > 1 && numStrings % strPerMppt === 0)
    ? numStrings / strPerMppt : 0;

  let counts = [];
  if (numMppts > 0) {
    // Quanti pannelli totali per ogni MPPT (può variare tra MPPT)
    const totalPanels = toAssign.length;
    const basePerMppt = Math.floor(totalPanels / numMppts); // pannelli base per MPPT
    const extraMppts  = totalPanels % numMppts;             // MPPT che ricevono 1 pannello extra

    for (let m = 0; m < numMppts; m++) {
      const mpptTotal  = basePerMppt + (m < extraMppts ? 1 : 0);
      // Distribuisci mpptTotal tra strPerMppt stringhe in modo uguale
      const strBase    = Math.floor(mpptTotal / strPerMppt);
      const strExtra   = mpptTotal % strPerMppt; // se > 0, questo MPPT è sbilanciato
      for (let s = 0; s < strPerMppt; s++) {
        counts.push(strBase + (s < strExtra ? 1 : 0));
      }
    }
  } else {
    const base  = Math.floor(toAssign.length / numStrings);
    const resto = toAssign.length % numStrings;
    for (let i = 0; i < numStrings; i++) counts.push(base + (i < resto ? 1 : 0));
  }

  // AP-17g: accumulate locally, then commit once through the store.
  let cursor = 0;
  const _added = [];
  for (let i = 0; i < numStrings; i++) {
    const cnt   = counts[i] || 0;
    const num   = offset + i + 1;
    const color = engineeringColors[(offset + i) % engineeringColors.length];
    const slice = toAssign.slice(cursor, cursor + cnt);
    cursor += cnt;
    if (!slice.length) continue;
    slice.forEach(p => { p.strId = 'S' + num; p.stringColor = color; });
    _added.push({ id: 'S' + num, name: 'Stringa ' + num, color, panels: slice });
  }
  if (_added.length) globalThis.setStoreSlice('strings', strings.concat(_added));
  _assignInverterMeta();
  updateStringList(); updateLegend(); draw();
}

// ── updateStringList ──────────────────────────────────────────────────────────

function updateStringList() {
  const sideList  = DOM.stringList;
  const dropList  = DOM.stringsDropList;
  const dropCount = DOM.stringsDropCount;
  const dropdown  = DOM.stringsDropdown;
  const footer    = DOM.stringsDropFooter;
  const pwr       = parseInt(DOM.pp.value) || 400;

  if (strings.length === 0) {
    if (dropdown)  dropdown.style.display  = 'none';
    if (dropList)  dropList.innerHTML = '<div class="strings-dropdown-empty">Nessuna stringa configurata</div>';
    if (dropCount) { dropCount.textContent = ''; dropCount.style.display = 'none'; }
    if (sideList)  sideList.innerHTML = '';
    stringsVisible = true;
    if (DOM.stringsVisBtn) { DOM.stringsVisBtn.classList.remove('snap-on'); DOM.stringsVisBtn.classList.remove('active'); }
    _updateInvFilterSel();
    return;
  }

  // Toolbar: mostra il gruppo stringhe e aggiorna badge
  if (dropdown) dropdown.style.display = 'inline-flex';
  if (DOM.stringsVisBtn) {
    DOM.stringsVisBtn.classList.add('snap-on');
    DOM.stringsVisBtn.title = 'Stringhe visibili — clicca per nascondere';
  }
  if (dropCount) { dropCount.textContent = strings.length; dropCount.style.display = 'inline-block'; }

  const totKwp = strings.reduce((acc, str) => acc + str.panels.length * pwr, 0) / 1000;

  // ── Toolbar dropdown panel ─────────────────────────────────────────────────
  if (dropList) {
    dropList.innerHTML = '';
    strings.forEach((s, idx) => {
      const kwp = (s.panels.length * pwr / 1000).toFixed(2);
      const div = document.createElement('div');
      div.className = 'strings-dropdown-item';
      div.innerHTML = `
        <div class="strings-dropdown-swatch" style="background:${s.color};"
          onclick="openColorPicker(${idx})" title="Cambia colore"></div>
        <div class="strings-dropdown-info">
          <div class="strings-dropdown-name">${s.name}</div>
          <div class="strings-dropdown-sub">${s.panels.length} moduli</div>
        </div>
        <div class="strings-dropdown-badge">${kwp} kWp</div>
      `;
      dropList.appendChild(div);
    });
    if (footer) footer.textContent = `Totale: ${strings.length} stringhe · ${totKwp.toFixed(2)} kWp`;
  }

  // ── Sidebar lista stringhe — riepilogo per inverter/MPPT ─────────────────
  if (sideList) {
    const wasOpen = sideList.querySelector('.str-list-body') === null
                    || sideList.querySelector('.str-list-body.open') !== null;
    sideList.innerHTML = '';

    const body = document.createElement('div');
    body.className = 'str-list-body' + (wasOpen ? ' open' : '');

    const toggle = document.createElement('button');
    toggle.className = 'str-list-toggle btn-secondary' + (wasOpen ? ' open' : '');
    toggle.innerHTML = `Stringhe generate <span style="font-weight:normal;color:var(--text-secondary);">(${strings.length})</span><span class="str-list-arrow">▾</span>`;
    toggle.onclick = function() { this.classList.toggle('open'); body.classList.toggle('open'); };
    sideList.appendChild(toggle);

    // Costruisci riepilogo per inverter
    const strPerMppt = _getProjectStrPerMpptMax();

    // Raggruppa le stringhe in MPPT (strPerMppt stringhe per MPPT)
    const numMppts = Math.ceil(strings.length / strPerMppt);
    const mpptList = []; // [{modsPerStr, kwp}]
    for (let m = 0; m < numMppts; m++) {
      const sl = strings.slice(m * strPerMppt, (m + 1) * strPerMppt);
      mpptList.push({
        modsPerStr: sl[0] ? sl[0].panels.length : 0,
        kwp: sl.reduce((s, x) => s + x.panels.length * pwr, 0) / 1000
      });
    }
    // stringhe rimanenti (non complete per MPPT)
    const remainder = strings.length % strPerMppt;
    if (remainder > 0) {
      const remDiv = document.createElement('div');
      remDiv.style.cssText = 'font-size:var(--fs-xs);color:var(--warning-text);padding:4px 0;';
      remDiv.textContent = `${remainder} stringa/he residue fuori gruppo MPPT completo`;
      body.appendChild(remDiv);
    }

    // Assegna MPPT agli inverter
    let mpptCursor = 0;
    let invNumber = 0;
    const invRows = _inverterList.length > 0 ? _inverterList : null;

    if (invRows) {
      invRows.forEach(inv => {
        for (let q = 0; q < inv.qty; q++) {
          invNumber++;
          const invMppts = mpptList.slice(mpptCursor, mpptCursor + inv.mppt);
          mpptCursor += inv.mppt;

          // Raggruppa MPPT per conteggio moduli per stringa
          const groups = new Map(); // modsPerStr → {mpptCount, kwp}
          invMppts.forEach(m => {
            if (!groups.has(m.modsPerStr)) groups.set(m.modsPerStr, { mpptCount: 0, kwp: 0 });
            const g = groups.get(m.modsPerStr);
            g.mpptCount++;
            g.kwp += m.kwp;
          });

          const label = inv.qty > 1
            ? `Inverter ${invNumber} — ${inv.brand} ${inv.model} (${q+1}/${inv.qty})`
            : `Inverter ${invNumber} — ${inv.brand} ${inv.model}`;

          const invKwp = invMppts.reduce((s, m) => s + m.kwp, 0);

          let linesHtml = '';
          groups.forEach((g, mods) => {
            const numStr = g.mpptCount * inv.strPerMppt;
            linesHtml += `<div style="display:flex;justify-content:space-between;align-items:baseline;padding:2px 0;">
              <span style="color:var(--text-secondary);">
                ${g.mpptCount} MPPT &times; ${inv.strPerMppt} str da <b style="color:var(--text-primary);">${mods} mod</b>
              </span>
              <span style="font-weight:600;color:var(--accent-text);">${g.kwp.toFixed(2)} kWp</span>
            </div>`;
          });

          const invDiv = document.createElement('div');
          invDiv.style.cssText = 'border:1px solid var(--border-default);border-radius:var(--radius-sm);padding:7px 10px;margin-bottom:6px;background:var(--bg-secondary);';
          invDiv.innerHTML = `
            <div style="font-size:var(--fs-xs);font-weight:700;color:var(--text-primary);margin-bottom:5px;display:flex;justify-content:space-between;">
              <span>${label}</span>
              <span style="color:var(--accent-text);">${invKwp.toFixed(2)} kWp</span>
            </div>
            <div style="font-size:var(--fs-xs);">${linesHtml}</div>`;
          body.appendChild(invDiv);
        }
      });
    } else {
      // Nessun inverter: mostra conteggio semplice
      const div = document.createElement('div');
      div.style.cssText = 'font-size:var(--fs-xs);color:var(--text-secondary);padding:4px 0;';
      div.textContent = `${strings.length} stringhe configurate`;
      body.appendChild(div);
    }

    const foot = document.createElement('div');
    foot.className = 'str-list-footer';
    foot.textContent = `${strings.length} stringhe · ${totKwp.toFixed(2)} kWp totali`;
    body.appendChild(foot);

    sideList.appendChild(body);
  }
  _updateInvFilterSel();
}

// ── Toggle dropdown stringhe ──────────────────────────────────────────────────

function toggleStringsDropdown(e) {
  if (e) e.stopPropagation();
  const panel = DOM.stringsDropPanel;
  const btn   = DOM.stringsDropBtn;
  if (!panel) return;
  const isOpen = panel.classList.contains('visible');
  panel.classList.toggle('visible', !isOpen);
  btn.classList.toggle('open', !isOpen);
}

// ── Color picker ──────────────────────────────────────────────────────────────

function openColorPicker(stringIdx) {
  editingStringIdx = stringIdx;
  selectedColor = strings[stringIdx].color;
  const picker = DOM.colorPicker;
  picker.innerHTML = '';
  engineeringColors.forEach(color => {
    const div = document.createElement('div');
    div.className = 'color-option' + (color === selectedColor ? ' selected' : '');
    div.style.background = color;
    div.onclick = () => {
      selectedColor = color;
      document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
      div.classList.add('selected');
    };
    picker.appendChild(div);
  });
  DOM.colorModalTitle.textContent = `Colore ${strings[stringIdx].name}`;
  DOM.colorModal.classList.add('visible');
}

function closeColorModal() {
  DOM.colorModal.classList.remove('visible');
  editingStringIdx = null; selectedColor = null;
}

function deleteString(idx) {
  _sdpConfirm(`Eliminare ${strings[idx].name}?`, () => {
    snapshot();
    strings[idx].panels.forEach(p => { p.strId = null; p.stringColor = null; });
    // AP-17g: route write through store.
    globalThis.setStoreSlice('strings', strings.filter((_, i) => i !== idx));
    strings.forEach((s, i) => { s.id = 'S' + (i + 1); s.name = 'Stringa ' + (i + 1); s.panels.forEach(p => { p.strId = s.id; }); });
    updateStringList(); updateLegend(); updateStats(); draw();
  });
}

function confirmColorChange() {
  if (editingStringIdx !== null && selectedColor !== null) {
    snapshot();
    strings[editingStringIdx].color = selectedColor;
    strings[editingStringIdx].panels.forEach(panel => { panel.stringColor = selectedColor; });
    updateStringList(); updateLegend(); draw();
  }
  closeColorModal();
}

// ── Legenda e statistiche ─────────────────────────────────────────────────────

/** Rimossa: stringhe gestite in sidebar */
function updateLegend() {}

// ── Paint mode (colorazione manuale pannelli) ─────────────────────────────────

function togglePaintMode() {
  if (strings.length === 0) { showToast('Genera le stringhe prima di usare la modalità colorazione', 'warn'); return; }
  paintMode = !paintMode;
  paintStringIdx = Math.min(paintStringIdx, strings.length - 1);
  const btn = document.getElementById('paintModeBtn');
  if (btn) btn.classList.toggle('snap-on', paintMode);
  if (paintMode && !stringsVisible) toggleStringsVisible();
  _updatePaintSelector();
  draw();
}

function _updatePaintSelector() {
  const sel = document.getElementById('paintStringSel');
  if (!sel) return;
  sel.innerHTML = strings.map((s, i) =>
    `<option value="${i}" style="color:${s.color};">${s.name} (${s.panels.length} mod.)</option>`
  ).join('');
  sel.value = paintStringIdx;
  sel.style.display = paintMode ? 'inline-block' : 'none';
}

function setPaintString(idx) {
  paintStringIdx = parseInt(idx);
}

function paintPanelToString(panelIdx) {
  const pan = panels[panelIdx];
  if (!pan) return;
  const targetStr = strings[paintStringIdx];
  if (!targetStr) return;
  if (pan.strId === targetStr.id) return;

  if (pan.strId) {
    const oldStr = strings.find(s => s.id === pan.strId);
    if (oldStr) {
      const i = oldStr.panels.indexOf(pan);
      if (i >= 0) oldStr.panels.splice(i, 1);
    }
  }

  pan.strId = targetStr.id;
  pan.stringColor = targetStr.color;
  targetStr.panels.push(pan);

  updateStringList();
  updateLegend();
  if (typeof calcCables === 'function') calcCables();
  draw();
}

function updateStats() {
  const tot = panels.length;
  const pwr = parseInt(DOM.pp.value);
  const totalKwStr = (tot * pwr / 1000).toFixed(2);
  const area = (tot * parseFloat(DOM.pw.value) * parseFloat(DOM.pl.value)).toFixed(2);
  DOM.totalP.textContent  = tot;
  DOM.totalKw.textContent = totalKwStr + ' kWp';
  DOM.totalA.textContent  = area + ' m²';
}

function toggleStringsVisible() {
  stringsVisible = !stringsVisible;
  const btn = DOM.stringsVisBtn;
  if (btn) {
    if (stringsVisible) {
      btn.classList.add('snap-on');
      btn.title = 'Stringhe visibili — clicca per nascondere';
    } else {
      btn.classList.remove('snap-on');
      btn.title = 'Stringhe nascoste — clicca per mostrare';
    }
  }
  requestDraw();
}

