// ── js/cables/verifiche.js — inverter validation and verifiche rendering ──
// Extracted from cables.js in AP-15c. Contains inverter compatibility
// validation UI and electrical verifiche rendering used by SLD flow.
// Calling surface unchanged — symbols remain available through
// bundle-scope globals.

'use strict';

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




