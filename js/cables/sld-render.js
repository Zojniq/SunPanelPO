// ── js/cables/sld-render.js — SLD modal rendering ──
// Extracted from cables.js in AP-15a. SVG generation per schema unifilare,
// including BESS mode state, hover/popup helpers, cartiglio render, MT
// tensione block. Calling surface unchanged — all symbols remain available
// through bundle-scope globals as before.

'use strict';

let _unifilareDebounceTimer = null;
function renderUnifilareDebounced() {
  clearTimeout(_unifilareDebounceTimer);
  _unifilareDebounceTimer = setTimeout(renderUnifilare, 250);
}

function renderUnifilare() {
  const container = document.getElementById('unifilareContainer');
  if (!container) return;

  // \u2500\u2500 1. RACCOLTA DATI \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const g = id => parseFloat((document.getElementById(id)||{value:'0'}).value)||0;
  const gs = id => (document.getElementById(id)||{value:''}).value||'';

  const totPanels  = panels.length;
  const pp         = parseInt((DOM.pp||{value:'400'}).value)||400;
  const isc        = g('moduleIsc') || 9;
  const voc        = g('moduleVoc') || 45;
  const vmpp       = g('moduleVmpp') || (voc * 0.82);
  const impp       = g('moduleImpp') || (isc * 0.93);
  const tcoefVoc   = g('moduleTcoefVoc') || -0.30;
  const tcoefVmpp  = _getModuleVmppTempCoeff();
  const mat        = gs('cableMaterial') || 'cu';
  const sysAC      = gs('cableSystemAC') || 'mono';
  const lenStr     = g('cableLenString') || 20;
  const lenMain    = g('cableLenMain') || 10;
  const lenAC      = g('cableLenAC') || 15;
  const dropDCpct  = g('cableDropDC') || 1;

  const totStr    = Math.max(1, parseInt(gs('invStrTot'))||1);
  const invBrand  = gs('invBrand') || 'Inverter';
  const invModel  = gs('invModel') || '';
  const invPac    = g('invPac') || 0;

  // Dati cartiglio
  const cartCommittente  = gs('cartCommittente')  || '—';
  const cartIndirizzo    = gs('cartIndirizzo')    || '—';
  const cartProgettista  = gs('cartProgettista')  || '—';
  const cartAlbo         = gs('cartAlbo')         || '—';
  const cartNumDisegno   = gs('cartNumDisegno')   || '—';
  const cartRevisione    = gs('cartRevisione')    || '00';
  const cartSpiModello   = gs('cartSpiModello')   || '';
  const cartSpiMatricola = gs('cartSpiMatricola') || '';
  const cartSpiCert      = gs('cartSpiCertificato') || '';
  const cartTensione    = gs('cartTensione')     || 'BT';  // 'BT' | 'MT'
  const isMT            = cartTensione === 'MT';
  const cartSwitchPreM0 = gs('cartSwitchPreM0')  || 'no';
  const hasSwitch       = cartSwitchPreM0 === 'si';
  // Revisioni dinamiche
  const _revRows = [];
  for (let ri = 0; ri < 5; ri++) {
    const rn = (document.getElementById(`rev0${ri}_num`)  ||{value:''}).value;
    const rd = (document.getElementById(`rev0${ri}_data`) ||{value:''}).value;
    const rs = (document.getElementById(`rev0${ri}_desc`) ||{value:''}).value;
    if (rn || rs) _revRows.push({ num: rn || ri.toString().padStart(2,'0'), data: rd, desc: rs });
  }
  const invVocMax = g('invVocMax') || 1000;
  const invVmpMin = g('invVmpptMin') || 0;
  const invVmpMax = g('invVmpptMax') || 0;
  const invImax   = g('invImaxMppt') || 0;

  const mpptTot    = _inverterList.reduce((a,inv)=>a+inv.mppt*inv.qty,0) || 1;
  const strPerMppt = _getProjectStrPerMpptMax();
  const mixedStrPerMppt = _hasMixedStrPerMppt();
  const modsPerStr = totPanels > 0 ? Math.round(totPanels / totStr) : 0;

  const P_kwp     = totPanels * pp / 1000;
  const P_kw      = P_kwp * 0.97;
  // Potenza AC totale da parco inverter (per regola SPI §17b)
  const P_pac_tot = _inverterList.reduce((a,inv)=>a+inv.pac*inv.qty, 0) || invPac;
  const SPI_SOGLIA = 11.08;
  const spiIntegrato = P_pac_tot <= SPI_SOGLIA;
  const bessMode       = _bessMode;
  const simplifiedMode = _simplifiedMode;
  // Aggiorna titolo modal in base a BT/MT
  const _modalTitle = document.getElementById('unifilareModalTitle');
  if (_modalTitle) _modalTitle.textContent = isMT ? 'Schema Unifilare — CEI 0-16:2022 (MT)' : 'Schema Unifilare — CEI 0-21:2025-10 (BT)';
  // Aggiorna visibilità riga SPI esterno nel modal
  const _spiRow = document.getElementById('spiEsternoRow');
  if (_spiRow) _spiRow.style.display = spiIntegrato ? 'none' : 'block';
  const V_str_voc = voc  * modsPerStr;
  const V_str_vmpp= vmpp * modsPerStr;
  const I_str_des = isc  * 1.25;
  const I_main_dc = I_str_des * strPerMppt;
  const V_AC      = sysAC === 'mono' ? 230 : 400;
  const cosfi     = 0.9;
  const I_AC      = P_kw > 0 ? (P_kw*1000)/(sysAC==='mono'? V_AC*cosfi : Math.sqrt(3)*V_AC*cosfi) : 0;
  const matLbl    = mat === 'cu' ? 'Cu' : 'Al';
  const sysLbl    = sysAC === 'mono' ? '1~ 230V' : '3~ 400V';

  const kVoc       = tcoefVoc / 100;
  const kVmppU     = tcoefVmpp / 100;
  const vocCold    = voc  * (1 + kVoc   * (-10 - 25));   // Voc @ -10°C
  const vmppHot    = vmpp * (1 + kVmppU * ( 70 - 25));   // Vmpp @ +70°C (caso peggiore caldo)
  const vmppCold   = vmpp * (1 + kVmppU * (-10 - 25));   // Vmpp @ -10°C (caso peggiore freddo)
  const V_str_cold = vocCold * modsPerStr;

  let S_str = 4, S_main = 6, S_AC_calc = 6;
  try {
    S_str      = calcSection(I_str_des, lenStr, (dropDCpct/100)*V_str_vmpp, mat, 2, true);
    S_main     = calcSection(I_main_dc, lenMain, (dropDCpct/100)*V_str_vmpp, mat, 2, false);
    S_AC_calc  = calcSectionAC(I_AC, lenAC, (1.0/100)*V_AC, mat, sysAC==='mono'?2:Math.sqrt(3), cosfi);
  } catch(e) { /* keep previously computed S_*_calc fallbacks */ }

  const FUSE_STD  = [2,4,6,10,15,20,25,32,40,50,63];
  const fuseMin_A = I_str_des * 1.5;
  const fuseRec_A = FUSE_STD.find(f => f >= fuseMin_A) || 63;
  // Formula corretta IEC 62548 §6.3: fusibile necessario solo se (n_par−1)×Isc > ISCR_modulo
  const iscrU     = g('moduleIscr') || (isc * 1.35);
  const vsysMaxU  = g('moduleVsysMax') || 1000;
  const needsFuse = (strPerMppt - 1) * isc > iscrU;

  // \u2500\u2500 2. LAYOUT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const VW = 4200, VH = 2970;
  const XC = 1700;   // centro colonna schema (spostato a sinistra — colonna destra riservata)
  const RH_X = 3280; // inizio colonna destra (tabelle calcoli, SPI)
  const RH_W = 880;  // larghezza colonna destra

  // YY: coordinate Y assolute dei nodi dello schema
  const YY = {
    moduli:             210,   // campo FV
    cavi_dc_top:        400,
    cassetta_top:       490,
    cassetta_bot:       810,   // cassetta_top+320 (aumentata per spazio SPD/Sez)
    inverter:          1040,   // Quadro Inverter (centro)
    cavi_ac_top:       1290,
    qbt_top:           1360,   // Quadro BT Produzione FV
    qbt_bot:           1740,   // 380px — MCB+RCD+meter ci stanno
    spi_y:             1870,   // SPI — relè di interfaccia (nodo funzionale)
    ddi_y:             2090,   // DDI — Dispositivo di Interfaccia (motorizzato) [+30 gap SPI]
    cavi_cnt:          2200,
    contatore_scambio: 2310,   // Contatore scambio SSP (bidirezionale)
    pdc:               2430,   // POD — Punto di consegna
    rete:              2550,   // Rete BT DSO
    cart:              2640,   // Cartiglio (VH=2970)
  };

  // Colonne MPPT: layout simmetrico attorno a XC (max 4 colonne)
  const nCols       = Math.min(mpptTot, 4);
  const COL_W       = Math.min(700, Math.max(380, Math.floor((RH_X - 300) / nCols)));
  const colXs       = Array.from({length: nCols}, (_, i) =>
    Math.round(XC - (nCols * COL_W) / 2 + (i + 0.5) * COL_W));
  const mpptXs      = colXs;
  const mpptToShow  = nCols;
  const cassettaXs  = colXs;

  // Mostra TUTTE le stringhe — nessun limite artificiale
  const STR_PER_COL = strPerMppt;
  const hiddenStrings = 0;
  // Step = distribuzione uniforme nella larghezza disponibile (COL_W - 100px margini)
  // Ogni stringa occupa 1/n dello spazio → garantisce contenimento in CASS_W qualunque n
  const _stepBase = STR_PER_COL <= 1 ? 0 : Math.floor((COL_W - 100) / STR_PER_COL);
  // Larghezza box stringa: min(max_per_categoria, step - 12px gap minimo)
  const _boxMax = STR_PER_COL <= 1 ? 220 : STR_PER_COL <= 2 ? 200
    : STR_PER_COL <= 4 ? 160 : STR_PER_COL <= 6 ? 120 : 90;
  const STR_BOX_W = STR_PER_COL <= 1 ? 220 : Math.min(_boxMax, Math.max(50, _stepBase - 12));
  const _strStep = STR_PER_COL <= 1 ? 0 : _stepBase;
  // CASS_W calcolata PRIMA di strXs — contiene tutti i box con 40px margine per lato
  const _totalBoxSpan = STR_PER_COL <= 1 ? STR_BOX_W : (STR_PER_COL - 1) * _strStep + STR_BOX_W;
  const CASS_W = Math.min(COL_W - 20, Math.max(280, _totalBoxSpan + 80));

  // Posizioni X stringhe: passo adattivo per contenere tutte nella colonna
  const strXs = [];
  for (let m = 0; m < nCols; m++) {
    const cx = colXs[m];
    const nS = STR_PER_COL;
    const step = _strStep;
    const span = (nS - 1) * step;
    for (let sv = 0; sv < nS; sv++) {
      const x = nS === 1 ? cx : Math.round(cx - span / 2 + sv * step);
      strXs.push({ x, mpptIdx: m });
    }
  }

  // \u2500\u2500 3. SIMBOLI IEC \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const F = 'Arial, Helvetica, sans-serif';

  const R = (x,y,w,h,rx,fill,stroke,sw,dash) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx||0}" fill="${fill||'none'}" stroke="${stroke||'none'}" stroke-width="${sw||1}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
  const L = (x1,y1,x2,y2,col,sw,dash) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col||'#1a1a1a'}" stroke-width="${sw||2}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
  const _ex = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  const T = (txt,x,y,sz,col,anchor,weight) =>
    `<text x="${x}" y="${y}" font-size="${sz||24}" fill="${col||'#1a1a1a'}" text-anchor="${anchor||'start'}" font-weight="${weight||'normal'}" font-family="${F}" dominant-baseline="middle">${_ex(txt)}</text>`;
  const TM = (txt,x,y,sz,col,weight) => T(txt,x,y,sz,col,'middle',weight);
  const TRot = (txt,x,y,sz,col,deg) =>
    `<text x="${x}" y="${y}" font-size="${sz||22}" fill="${col||'#1a1a1a'}" text-anchor="middle" font-family="${F}" dominant-baseline="middle" transform="rotate(${deg||(-90)},${x},${y})">${_ex(txt)}</text>`;

  const C = {
    dcPos:  '#CC3300',
    dcNeg:  '#1a1a1a',
    ac:     '#444444',
    pe:     '#2d7a00',
    box:    '#444444',
    blue:   '#1e4aaa',
    gray:   '#666666',
    lgray:  '#999999',
    white:  '#ffffff',
    bgDC:   '#fff5f0',
    bgAC:   '#f0f4ff',
    bgPE:   '#f0fff0',
  };

  // \u2500\u2500 SIMBOLI IEC 60617 v2 \u2014 schemi unifilari professionali \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // (cx,cy) = centro geometrico del simbolo sull'asse del conduttore.
  // Ogni funzione disegna SOLO il simbolo; i tratti di connessione
  // sopra/sotto vengono tracciati separatamente dal codice di layout.

  // MCB \u2014 Interruttore automatico magnetotermico (IEC 60617-07-15-01)
  // Punto di articolazione (\u25cf) + lama diagonale aperta + contatto fisso (\u2500)
  // + indicatore T-bar scatto magnetotermico in cima
  function symMCB(cx, cy, col) {
    col = col || C.ac;
    const hw = 20, hh = 24;
    return [
      // Punto di articolazione superiore (pieno = collegato in modo fisso)
      `<circle cx="${cx}" cy="${cy-hh}" r="5" fill="${col}"/>`,
      // Lama mobile in posizione aperta (~45\u00b0)
      `<line x1="${cx}" y1="${cy-hh}" x2="${cx+hw+6}" y2="${cy+hh-6}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`,
      // Contatto fisso inferiore (barra orizzontale)
      `<line x1="${cx-hw}" y1="${cy+hh}" x2="${cx+hw}" y2="${cy+hh}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`,
      // Indicatore scatto magnetotermico: T-bar verticale sopra il punto di articolazione
      `<line x1="${cx-12}" y1="${cy-hh-16}" x2="${cx+12}" y2="${cy-hh-16}" stroke="${col}" stroke-width="2.5"/>`,
      `<line x1="${cx}" y1="${cy-hh-16}" x2="${cx}" y2="${cy-hh}" stroke="${col}" stroke-width="2.5"/>`,
    ].join('');
  }

  // RCD \u2014 Interruttore differenziale (IEC 60617)
  // = MCB + anello toroidale (trasformatore di corrente differenziale) + terra
  function symRCD(cx, cy, tipo, col) {
    col = col || C.ac;
    tipo = tipo || 'A';
    const hw = 20, hh = 24;
    const toY = cy + hh + 30;  // centro toroide
    return [
      // Punto di articolazione (pieno)
      `<circle cx="${cx}" cy="${cy-hh}" r="5" fill="${col}"/>`,
      // Lama mobile aperta
      `<line x1="${cx}" y1="${cy-hh}" x2="${cx+hw+6}" y2="${cy+hh-6}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`,
      // Contatto fisso inferiore
      `<line x1="${cx-hw}" y1="${cy+hh}" x2="${cx+hw}" y2="${cy+hh}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`,
      // T-bar scatto
      `<line x1="${cx-12}" y1="${cy-hh-16}" x2="${cx+12}" y2="${cy-hh-16}" stroke="${col}" stroke-width="2.5"/>`,
      `<line x1="${cx}" y1="${cy-hh-16}" x2="${cx}" y2="${cy-hh}" stroke="${col}" stroke-width="2.5"/>`,
      // Tratto conduttore dal contatto inferiore al toroide
      `<line x1="${cx}" y1="${cy+hh}" x2="${cx}" y2="${toY-14}" stroke="${col}" stroke-width="3"/>`,
      // Anello toroidale \u2014 simbolo trafo differenziale (IEC)
      `<circle cx="${cx}" cy="${toY}" r="14" fill="none" stroke="${col}" stroke-width="2.5"/>`,
      // Derivazione a terra dall'anello
      `<line x1="${cx+14}" y1="${toY}" x2="${cx+36}" y2="${toY}" stroke="${col}" stroke-width="2"/>`,
      `<line x1="${cx+36}" y1="${toY}" x2="${cx+36}" y2="${toY+22}" stroke="${col}" stroke-width="2"/>`,
      `<line x1="${cx+24}" y1="${toY+22}" x2="${cx+48}" y2="${toY+22}" stroke="${col}" stroke-width="2.5"/>`,
      `<line x1="${cx+29}" y1="${toY+30}" x2="${cx+43}" y2="${toY+30}" stroke="${col}" stroke-width="2"/>`,
      `<line x1="${cx+33}" y1="${toY+38}" x2="${cx+39}" y2="${toY+38}" stroke="${col}" stroke-width="1.5"/>`,
      // Etichetta tipo differenziale (a sinistra per non sovrapporsi alle etichette di destra)
      `<text x="${cx-hw-8}" y="${toY}" font-size="20" fill="${col}" text-anchor="end" font-family="${F}" dominant-baseline="middle" font-weight="700">\u0394${tipo}</text>`,
    ].join('');
  }

  // SEZIONATORE \u2014 Sezionatore di manutenzione (IEC 60617-07-07-01)
  // Cerchi APERTI (vuoti) ai punti di contatto + lama diagonale + barra fissa
  // Visivamente DISTINTO dall'MCB: cerchi vuoti, nessun T-bar, angolo diverso
  function symSez(cx, cy, col) {
    col = col || C.dcPos;
    const hw = 18, hh = 20;
    return [
      // Punto di articolazione (cerchio VUOTO = contatto apribile manualmente)
      `<circle cx="${cx}" cy="${cy-hh}" r="6" fill="${C.white}" stroke="${col}" stroke-width="2.5"/>`,
      // Lama aperta (angolo meno ripido del MCB \u2192 visivamente distinguibile)
      `<line x1="${cx}" y1="${cy-hh}" x2="${cx+hw+2}" y2="${cy+hh-8}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`,
      // Punto di chiusura (cerchio VUOTO)
      `<circle cx="${cx}" cy="${cy+hh}" r="6" fill="${C.white}" stroke="${col}" stroke-width="2.5"/>`,
      // Barra fissa (pi\u00f9 corta del contatto MCB)
      `<line x1="${cx-hw+4}" y1="${cy+hh}" x2="${cx+hw-4}" y2="${cy+hh}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`,
    ].join('');
  }

  // FUSIBILE \u2014 IEC 60617-02-01-01 (rettangolo con filamento)
  // Simbolo standard IEC invariato \u2014 gi\u00e0 corretto
  function symFuse(cx, cy, col) {
    col = col || C.dcPos;
    const bw = 14, bh = 20;
    return [
      `<rect x="${cx-bw}" y="${cy-bh}" width="${bw*2}" height="${bh*2}" rx="3" fill="${C.white}" stroke="${col}" stroke-width="2.5"/>`,
      `<line x1="${cx}" y1="${cy-bh}" x2="${cx}" y2="${cy+bh}" stroke="${col}" stroke-width="1.8"/>`,
    ].join('');
  }

  // SPD \u2014 Scaricatore di sovratensione / varistore (IEC 60617)
  // Rettangolo varistore (con freccia caratteristica non-lineare) + simbolo terra
  function symSPD(cx, cy, col) {
    col = col || C.ac;
    const bw = 16, bh = 14;
    return [
      // Box varistore (rettangolo IEC)
      `<rect x="${cx-bw}" y="${cy-bh}" width="${bw*2}" height="${bh*2}" rx="2" fill="#fff8e1" stroke="${col}" stroke-width="2"/>`,
      // Freccia diagonale interna (indica caratteristica tensione-corrente non-lineare)
      `<line x1="${cx-bw+5}" y1="${cy+bh-5}" x2="${cx+bw-5}" y2="${cy-bh+5}" stroke="${col}" stroke-width="1.8"/>`,
      `<polygon points="${cx+bw-5},${cy-bh+5} ${cx+bw-11},${cy-bh+4} ${cx+bw-6},${cy-bh+10}" fill="${col}"/>`,
      // Tratto di raccordo al simbolo terra
      `<line x1="${cx}" y1="${cy+bh}" x2="${cx}" y2="${cy+bh+12}" stroke="${col}" stroke-width="2.5"/>`,
      // Simbolo terra IEC: tre barre decrescenti
      `<line x1="${cx-20}" y1="${cy+bh+12}" x2="${cx+20}" y2="${cy+bh+12}" stroke="${col}" stroke-width="3"/>`,
      `<line x1="${cx-13}" y1="${cy+bh+20}" x2="${cx+13}" y2="${cy+bh+20}" stroke="${col}" stroke-width="2"/>`,
      `<line x1="${cx-6}" y1="${cy+bh+28}" x2="${cx+6}" y2="${cy+bh+28}" stroke="${col}" stroke-width="1.5"/>`,
    ].join('');
  }

  // CONTATORE \u2014 IEC: cerchio con testo kWh + frecce bidirezionali opzionali
  function symMeter(cx, cy, lbl, bidirezionale, col) {
    col = col || C.ac;
    lbl = lbl || 'kWh';
    const r = 38;
    let frecce = '';
    if (bidirezionale) {
      frecce = [
        `<line x1="${cx-20}" y1="${cy-10}" x2="${cx+20}" y2="${cy-10}" stroke="${col}" stroke-width="2" marker-end="url(#arrowMeter)"/>`,
        `<line x1="${cx+20}" y1="${cy+10}" x2="${cx-20}" y2="${cy+10}" stroke="${col}" stroke-width="2" marker-end="url(#arrowMeterRev)"/>`,
      ].join('');
    }
    return [
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.white}" stroke="${col}" stroke-width="2.5"/>`,
      `<text x="${cx}" y="${cy-8}" font-size="26" fill="${col}" text-anchor="middle" font-family="${F}" dominant-baseline="middle" font-weight="700">${lbl}</text>`,
      frecce,
    ].join('');
  }

  function symModulo(x, y, w, h) {
    w = w||200; h = h||140;
    return [
      R(x, y, w, h, 4, '#fffde7', '#1a1a1a', 2),
      L(x, y+h, x+w, y, '#1a1a1a', 1.5),
      L(x+w/3, y, x+w/3, y+h, '#1a1a1a', 0.8),
      L(x+2*w/3, y, x+2*w/3, y+h, '#1a1a1a', 0.8),
      L(x, y+h/2, x+w, y+h/2, '#1a1a1a', 0.8),
    ].join('');
  }

  function symInverter(cx, cy, w, h, brand, model, pac) {
    w = w||400; h = h||250;
    const x = cx-w/2, y = cy-h/2;
    // Layout:
    //  METÀ SUPERIORE (y → cy)  = targa: brand / model / Pac
    //  Linea divisoria           = cy  (tratteggiata orizzontale)
    //  METÀ INFERIORE (cy → bot) = simboli circuito IEC: lato DC sx, lato AC dx, freccia centro
    const dcX    = cx - w/4;   // centro lato DC
    const acX    = cx + w/4;   // centro lato AC
    const busW   = 52;         // larghezza bus DC lunga
    // Simboli nella metà inferiore: tutto spostato SOTTO la linea divisoria (cy + offset)
    const symY   = cy + 30;    // baseline dei simboli (30px sotto divisoria)
    return [
      // Rettangolo box
      R(x, y, w, h, 8, '#fafafa', '#333333', 2.5),
      // Linea divisoria DC/AC tratteggiata
      L(x, cy, x+w, cy, '#aaaaaa', 1, '8,5'),
      // ── TARGA (metà superiore) ─────────────────────────────────────
      TM(brand||'INVERTER', cx, y+36, 28, '#1a1a1a', '700'),
      TM(model||'', cx, y+70, 22, '#444444'),
      pac > 0 ? TM(`Pac: ${pac.toFixed(1)} kW`, cx, y+100, 20, '#666666') : '',
      // ── SIMBOLO LATO DC (in basso a sinistra) ────────────────────
      T('DC', dcX, cy+14, 14, '#555555', 'middle', '700'),
      // Bus DC: linea lunga + linea corta (IEC 60417-5031)
      L(dcX - busW/2, symY,    dcX + busW/2, symY,    '#444444', 3, null),
      L(dcX - busW/3, symY+14, dcX + busW/3, symY+14, '#444444', 2, null),
      // Linea di collegamento: bus DC → freccia centrale (tratteggiata, sottile)
      L(dcX + busW/2, symY+7, cx - 26, symY+7, '#aaaaaa', 1, '4,3'),
      // ── SIMBOLO CONVERSIONE DC→AC (centro, nella metà inferiore) ──
      // Cerchio che racchiude la freccia: simbolo IEC per convertitore statico
      `<circle cx="${cx}" cy="${symY+7}" r="18" fill="#f0f4ff" stroke="#333333" stroke-width="1.5"/>`,
      L(cx-10, symY+7, cx+8, symY+7, '#333333', 2, null),
      `<polygon points="${cx+10},${symY+7} ${cx+3},${symY+2} ${cx+3},${symY+12}" fill="#333333"/>`,
      // Linea di collegamento: freccia centrale → simbolo AC (tratteggiata, sottile)
      L(cx + 26, symY+7, acX - 30, symY+7, '#aaaaaa', 1, '4,3'),
      // ── SIMBOLO LATO AC (in basso a destra) ──────────────────────
      T('AC', acX, cy+14, 14, '#555555', 'middle', '700'),
      // Onda sinusoidale AC (IEC 60617-A00001) — leggermente più grande e visibile
      `<path d="M ${acX-28} ${symY+7} Q ${acX-14} ${symY-11} ${acX} ${symY+7} Q ${acX+14} ${symY+25} ${acX+28} ${symY+7}" fill="none" stroke="#444444" stroke-width="3"/>`,
    ].join('');
  }

  function symRete(cx, cy, w, h) {
    w = w||600; h = h||160;
    const x = cx-w/2, y = cy-h/2;
    const waveY = cy+20;
    const waveW = 70;
    const waves = [-2, -1, 0].map(i => {
      const wx = cx + i*waveW - waveW;
      return `<path d="M ${wx} ${waveY} Q ${wx+17} ${waveY-22} ${wx+35} ${waveY} Q ${wx+53} ${waveY+22} ${wx+70} ${waveY}" fill="none" stroke="#1a1a1a" stroke-width="2.2"/>`;
    }).join('');
    return [
      R(x, y, w, h, 6, '#f5f5f5', '#1a1a1a', 2.5),
      TM('RETE BT PUBBLICA', cx, cy-20, 30, '#1a1a1a', '700'),
      TM('DSO', cx, cy, 24, '#666666'),
      waves,
    ].join('');
  }

  function bloccoFunz(x, y, w, h, titolo, col) {
    col = col||C.box;
    // Tab: bordo inferiore coincide esattamente con il bordo superiore del box (y)
    // → tab completamente esterno, mai dentro il box
    const titW = Math.min(titolo.length * 13 + 20, w - 30);  // clamp: non sfora mai il box
    const TAB_H = 32;
    return [
      R(x, y, w, h, 12, 'none', col, 2, '16,8'),
      R(x+16, y-TAB_H, titW, TAB_H, 4, '#ffffff', col, 1.5),  // tab esterno, bordo bot = y
      T(titolo, x+26, y-TAB_H/2, 21, col, 'start', '700'),     // testo centrato verticalmente nel tab
    ].join('');
  }

  function labelCavoV(x, yMid, testo1, testo2, col) {
    col = col||C.gray;
    return [
      `<text x="${x+25}" y="${yMid}" font-size="20" fill="${col}" text-anchor="middle" font-family="${F}" dominant-baseline="middle" transform="rotate(-90,${x+25},${yMid})">${testo1}</text>`,
      testo2 ? `<text x="${x+52}" y="${yMid}" font-size="18" fill="${C.lgray}" text-anchor="middle" font-family="${F}" dominant-baseline="middle" transform="rotate(-90,${x+52},${yMid})">${testo2}</text>` : '',
    ].join('');
  }

  function nodo(cx, cy, col, r) {
    r = r||8;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col||C.dcNeg}"/>`;
  }

  function lineaL(x1, y1, x2, y2, col, sw, dash) {
    col = col||'#1a1a1a'; sw = sw||2.5;
    if (x1 === x2 || y1 === y2) return L(x1,y1,x2,y2,col,sw,dash);
    const ym = Math.round((y1+y2)/2);
    const dash_ = dash ? `stroke-dasharray="${dash}"` : '';
    return `<path d="M ${x1} ${y1} L ${x1} ${ym} L ${x2} ${ym} L ${x2} ${y2}" fill="none" stroke="${col}" stroke-width="${sw}" ${dash_}/>`;
  }

  // \u2500\u2500 4. COSTRUZIONE SVG \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  let s = [];

  s.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VW} ${VH}" style="width:100%;background:#fff;display:block;" font-family="${F}">
<defs>
  <marker id="arrowMeter" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
    <path d="M0,0 L0,6 L8,3 z" fill="#1e4aaa"/>
  </marker>
  <marker id="arrowMeterRev" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto">
    <path d="M8,0 L8,6 L0,3 z" fill="#1e4aaa"/>
  </marker>
</defs>`);

  s.push(R(8, 8, VW-16, VH-16, 0, C.white, '#1a1a1a', 1));
  s.push(R(20, 20, VW-40, YY.cart-30, 0, 'none', '#1a1a1a', 2.5));

  // ── HEADER SCHEMA ─────────────────────────────────────────────────────
  s.push(R(20, 10, VW - 40, 70, 0, '#f0f4ff', '#1e4aaa', 2));
  s.push(TM('SCHEMA ELETTRICO UNIFILARE \u2014 IMPIANTO FOTOVOLTAICO', VW/2, 38, 32, '#1e4aaa', '700'));
  s.push(TM(`Pac tot.: ${P_pac_tot > 0 ? P_pac_tot.toFixed(1) : '\u2014'} kW \u00b7 Potenza picco: ${P_kwp.toFixed(2)} kWp \u00b7 `
    + `${totPanels} moduli \u00b7 ${totStr} stringa/e \u00b7 ${sysLbl}`, VW/2, 64, 20, '#444444', 'normal'));

  // \u2500\u2500 CAMPO FV \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // ── CAMPO FV — box testuali per stringa ──────────────────
  // Zona DC: etichetta sezione
  // Etichetta sezione DC: centrata sopra le colonne MPPT
  const campoLabelX = Math.round((colXs[0] + colXs[nCols - 1]) / 2);
  s.push(TM('CAMPO FOTOVOLTAICO \u2014 LATO CC', campoLabelX, YY.moduli - 45, 21, C.dcPos, '700'));

  const STR_BOX_H = 90;
  const STR_Y     = YY.moduli;   // tutte le stringhe alla stessa Y

  strXs.forEach((str, si) => {
    const sx = str.x;
    const mi = str.mpptIdx;

    // Label colonna MPPT sopra la prima stringa di ogni colonna
    if (si === mi * STR_PER_COL) {
      s.push(TM(`MPPT ${mi + 1}`, colXs[mi], STR_Y - 22, 18, C.lgray, '600'));
    }
    // Box stringa: rettangolo giallo + diagonale IEC
    s.push(R(sx - STR_BOX_W/2, STR_Y, STR_BOX_W, STR_BOX_H, 4, '#fffde7', C.dcPos, 1.8));
    s.push(L(sx - STR_BOX_W/2 + 4, STR_Y + STR_BOX_H - 4,
             sx + STR_BOX_W/2 - 4, STR_Y + 4, C.dcPos, 1, '8,5'));
    const strObj  = strings[si];
    const strName = strObj ? strObj.name : `S${si + 1}`;
    s.push(T(strName,
             sx - STR_BOX_W/2 + 8, STR_Y + 22, 19, '#1a1a1a', 'start', '700'));
    s.push(T(`${modsPerStr} mod. · ${(modsPerStr*pp/1000).toFixed(2)} kWp`,
             sx - STR_BOX_W/2 + 8, STR_Y + 47, 15, '#444444', 'start'));
    s.push(T(`Voc ${V_str_voc.toFixed(0)} V · Isc ${isc.toFixed(1)} A`,
             sx - STR_BOX_W/2 + 8, STR_Y + 68, 13, C.gray, 'start'));
    // Unifilare: singola linea DC dal box alla cassetta
    s.push(L(sx, STR_Y + STR_BOX_H, sx, YY.cassetta_top + 15, C.dcPos, 2.5));
    // Hash marks IEC: 2 conduttori (DC+ / DC-)
    const hashY = STR_Y + STR_BOX_H + 40;
    s.push(L(sx - 10, hashY - 10, sx + 10, hashY + 10, C.dcPos, 1.5));
    s.push(L(sx - 10, hashY - 18, sx + 10, hashY - 2, C.dcPos, 1.5));
    // P3: overlay trasparente per hover stringa — evidenzia il percorso DC
    const _hoverStr = `_sldHoverStr(${sx},${STR_Y},${STR_BOX_W},${STR_BOX_H},${YY.cassetta_top},${si},'${strName}',${V_str_voc.toFixed(0)},${isc.toFixed(1)},${S_str})`;
    s.push(`<rect x="${sx-STR_BOX_W/2}" y="${STR_Y}" width="${STR_BOX_W}" height="${STR_BOX_H+YY.cassetta_top-STR_Y}" `+
      `fill="transparent" cursor="pointer" `+
      `onmouseenter="${_hoverStr}" onmouseleave="_sldClearHover()"/>`);
  });
  // Stringhe non mostrate
  if (hiddenStrings > 0) {
    s.push(TM(`… +${hiddenStrings} str.`,
              colXs[nCols - 1] + STR_BOX_W/2 + 60, STR_Y + STR_BOX_H/2, 19, C.lgray, '600'));
  }

// \u2500\u2500 CASSETTA STRINGA \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// ── CASSETTA STRINGA ──────────────────────────────────────────────────────
  // CASS_W già calcolata sopra insieme a STR_BOX_W — garantisce contenimento box stringhe
  const CASS_H = YY.cassetta_bot - YY.cassetta_top;

  cassettaXs.forEach((cx_cass, mi) => {
    const strsInMppt = strXs.filter(st => st.mpptIdx === mi);
    if (strsInMppt.length === 0) return;
    const cass_x_left = cx_cass - CASS_W/2;

    // Box cassetta
    s.push(bloccoFunz(cass_x_left, YY.cassetta_top, CASS_W, CASS_H, `MPPT ${mi+1}`));

    // ── Ogni stringa: disconnettore stringa + eventuale fusibile ──
    // Layout verticale per stringa (Y relativi a cassetta_top):
    //   +15: ingresso
    //   +55: centro symSez (disconnettore per stringa) — sempre presente (CEI 64-8 §712.536)
    //   +100: uscita disconnettore
    //   se needsFuse: +135 fusibile, +175 uscita fusibile
    //   bus bar: +205

    const busY    = YY.cassetta_top + 205;  // bus bar (spostato per fare spazio disconnettori)
    const busLeft  = strsInMppt[0].x - 30;
    const busRight = strsInMppt[strsInMppt.length-1].x + 30;

    strsInMppt.forEach((str, si) => {
      // Linea dal tetto cassetta al sezionatore stringa
      // symSez cy=+55: top circle at cy-hh-r = +55-20-6=+29 → connettore arriva a +29
      s.push(L(str.x, YY.cassetta_top + 10, str.x, YY.cassetta_top + 29, C.dcPos, 2.5));
      // Sezionatore DC per stringa — IEC 60617 (cerchi aperti + lama)
      s.push(symSez(str.x, YY.cassetta_top + 55, C.dcPos));
      // Linea dal sezionatore al componente successivo
      // symSez bottom circle at cy+hh+r = +55+20+6=+81 → connettore parte da +81
      s.push(L(str.x, YY.cassetta_top + 81, str.x, YY.cassetta_top + 95, C.dcPos, 2.5));
      if (needsFuse) {
        // Fusibile gPV — IEC 60617 (rettangolo con filamento)
        s.push(symFuse(str.x, YY.cassetta_top + 115, C.dcPos));
        // Linea da fusibile al bus bar
        s.push(L(str.x, YY.cassetta_top + 135, str.x, busY, C.dcPos, 2.5));
      } else {
        // Linea diretta sezionatore → bus bar (no fusibile)
        s.push(L(str.x, YY.cassetta_top + 95, str.x, busY, C.dcPos, 2.5));
      }
    });

    // Etichette componenti — a lato dell'ultima stringa per non sovrapporre
    const lblX = strsInMppt[strsInMppt.length - 1].x + 38;
    s.push(T('SEZ.STR.', lblX, YY.cassetta_top + 55, 13, C.dcPos, 'start', '600'));
    s.push(T(`${Math.ceil(V_str_cold/100)*100}V DC`, lblX, YY.cassetta_top + 71, 13, C.gray, 'start'));
    if (needsFuse) {
      s.push(T(`FUS ${fuseRec_A}A gPV`, lblX, YY.cassetta_top + 135, 13, C.dcPos, 'start', '600'));
      s.push(T(`ISCR: ${iscrU.toFixed(0)}A`, lblX, YY.cassetta_top + 151, 13, C.gray, 'start'));
      s.push(T('CEI EN 60269-6', lblX, YY.cassetta_top + 166, 12, C.lgray, 'start'));
    } else {
      s.push(T('Fus. non richiesti', lblX, YY.cassetta_top + 135, 13, C.gray, 'start'));
      s.push(T('(IEC 62548 §6.3)', lblX, YY.cassetta_top + 150, 12, C.lgray, 'start'));
    }

    // Bus bar DC
    s.push(L(busLeft, busY, busRight, busY, C.dcPos, 4));
    strsInMppt.forEach(str => s.push(nodo(str.x, busY, C.dcPos, 5)));

    // SPD DC per ingresso MPPT — derivazione a destra dal bus bar
    // CEI EN 62305-3: Uc ≥ 1.25 × Voc(Tmin) — uno per ogni ingresso MPPT
    const spd_x = cass_x_left + CASS_W - 55;
    const spdUc  = Math.ceil(V_str_cold * 1.25 / 100) * 100;  // Uc minimo corretto
    s.push(L(busRight, busY, spd_x, busY, C.dcPos, 2, '5,3'));
    // SPD top at cy-bh = busY+55-14 = busY+41 — connettore arriva esattamente al box
    s.push(L(spd_x, busY, spd_x, busY + 41, C.dcPos, 2, '5,3'));
    s.push(symSPD(spd_x, busY + 55, C.dcPos));
    s.push(T('SPD T2', spd_x - 8, busY + 40, 13, C.dcPos, 'end', '600'));
    s.push(T(`Uc≥${spdUc}V`, spd_x - 8, busY + 56, 12, C.gray, 'end'));

    // Tronco principale: dal bus bar (centro) giù al sezionatore DC principale
    // symSez cy=+278: top circle at cy-hh-r = +278-20-6=+252 → connettore arriva a +252
    s.push(nodo(cx_cass, busY, C.dcPos, 5));
    s.push(L(cx_cass, busY, cx_cass, YY.cassetta_top + 252, C.dcPos, 2.5));

    // Sezionatore DC principale (sezionamento manutenzione sotto il bus)
    // bottom circle at cy+hh+r = +278+20+6=+304 → uscita parte da +304
    const sez_y = YY.cassetta_top + 278;
    s.push(symSez(cx_cass, sez_y, C.dcPos));
    s.push(T(`QDC ${Math.ceil(V_str_cold/100)*100}V`, cx_cass + 40, sez_y + 5, 13, C.gray, 'start'));
    s.push(T(`${Math.ceil(I_str_des * strPerMppt)}A DC`, cx_cass + 40, sez_y + 20, 12, C.gray, 'start'));

    // Uscita cassetta: dal sezionatore al fondo del box (linea esplicita)
    s.push(L(cx_cass, sez_y + 26, cx_cass, YY.cassetta_bot, C.dcPos, 2.5));
  });

  // \u2500\u2500 INVERTER \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const invUnits = [];
  if (_inverterList.length > 0) {
    _inverterList.forEach(inv => {
      for (let q = 0; q < inv.qty; q++) invUnits.push(inv);
    });
  } else {
    invUnits.push({ brand: invBrand, model: invModel, pac: invPac, mppt: mpptTot, strPerMppt });
  }
  const showInvU = Math.min(invUnits.length, 4);
  const INV_H    = 280;
  const INV_PAD  = 180;   // padding oltre le cassette estreme

  // INV_TOTAL_W: larghezza complessiva (usata anche per PE line e click rect)
  const invBoxLeft  = colXs[0] - INV_PAD;
  const invBoxRight = colXs[nCols - 1] + INV_PAD;
  const INV_TOTAL_W = invBoxRight - invBoxLeft;

  // Box inverter: uno per unità inverter (non un unico box gigante)
  if (showInvU === 1) {
    // Singolo inverter → unico box
    s.push(bloccoFunz(invBoxLeft, YY.inverter - INV_H/2 - 30, INV_TOTAL_W, INV_H + 60,
      'Quadro Inverter', '#666666'));
  } else {
    // Multi-inverter: box separati per ogni unità
    for (let ui = 0; ui < showInvU; ui++) {
      const mStart = Math.round(ui * nCols / showInvU);
      const mEnd   = Math.round((ui + 1) * nCols / showInvU);
      const uCols  = colXs.slice(mStart, mEnd);
      const bLeft  = uCols[0] - INV_PAD;
      const bRight = uCols[uCols.length - 1] + INV_PAD;
      const bW     = bRight - bLeft;
      s.push(bloccoFunz(bLeft, YY.inverter - INV_H/2 - 30, bW, INV_H + 60,
        `Inverter ${ui + 1}`, '#666666'));
    }
  }

  // Cavi DC: VERTICALI al 100% (stesso X della colonna MPPT)
  colXs.forEach((cx, mi) => {
    // Singola linea DC per colonna MPPT
    s.push(L(cx, YY.cassetta_bot, cx, YY.inverter - INV_H/2, C.dcPos, 2.5));
    s.push(TM(`IN${mi + 1}`, cx, YY.inverter - INV_H/2 - 14, 17, '#999999', '600'));
    // Etichetta cavo DC: su tutte le colonne (prima colonna completa, altre compatte)
    {
      const cableLblY = YY.cassetta_bot + 14;
      const dVcol = calcVoltageDrop(I_str_des, lenStr, S_str, V_str_vmpp, mat, 2);
      const dVok  = dVcol <= dropDCpct;
      if (mi === 0) {
        // Prima colonna: etichetta completa
        s.push(T(`H1Z2Z2-K ${S_str}mm\u00b2 ${matLbl}`, cx + 14, cableLblY, 14, C.dcPos, 'start'));
        s.push(T(`${lenStr}m \u2014 In: ${I_str_des.toFixed(1)} A`, cx + 14, cableLblY + 17, 13, C.gray, 'start'));
        s.push(T(`\u0394V ${dVcol.toFixed(2)}%`, cx + 14, cableLblY + 33, 13, dVok ? '#16a34a' : '#dc2626', 'start', '600'));
      } else {
        // Altre colonne: etichetta compatta con \u0394V% a colori
        s.push(T(`${S_str}mm\u00b2 \u2014 \u0394V ${dVcol.toFixed(2)}%`, cx + 14, cableLblY + 8, 13, dVok ? C.gray : '#dc2626', 'start'));
      }
    }
  });

  // Simbolo inverter + routing interno DC → inverter
  for (let ui = 0; ui < showInvU; ui++) {
    const inv = invUnits[ui];
    const mStart  = Math.round(ui * nCols / showInvU);
    const mEnd    = Math.round((ui + 1) * nCols / showInvU);
    const myCols  = colXs.slice(mStart, mEnd);
    const icx     = Math.round((myCols[0] + myCols[myCols.length - 1]) / 2);
    const iW      = Math.min(INV_TOTAL_W / showInvU - 60, 480);
    // Routing interno: linee da ciascun ingresso MPPT al top dell'inverter
    const invTopY = YY.inverter - INV_H / 2;
    myCols.forEach(colX => {
      if (colX !== icx) {
        // Linea orizzontale dall'ingresso al centro, poi verticale
        s.push(L(colX, invTopY, colX, invTopY + 30, C.dcPos, 2.5, '8,4'));
        s.push(L(colX, invTopY + 30, icx, invTopY + 30, C.dcPos, 2.5, '8,4'));
      }
    });
    s.push(L(icx, invTopY, icx, invTopY + 40, C.dcPos, 2.5, '8,4'));
    s.push(symInverter(icx, YY.inverter, iW, INV_H, inv.brand, inv.model, inv.pac));
    // Annotazioni normative CEI 0-21:2025 — posizionate nel terzo inferiore del box (sotto i simboli IEC)
    const invBotSection = YY.inverter + INV_H/2 - 48;  // ~40px dal bordo inferiore del box
    s.push(TM('Q(U) · cosφ(P) · LVRT/HVRT', icx, invBotSection, 15, '#1e4aaa', '700'));
    s.push(TM('CEI 0-21:2025 §8.7 · All.A', icx, invBotSection + 18, 12, '#4a6a9a', 'normal'));
    s.push(L(icx, YY.inverter + INV_H/2, icx, YY.cavi_ac_top, C.ac, 3));
  }

  // Bus AC se piu' inverter
  if (showInvU > 1) {
    const busACy = YY.cavi_ac_top;
    const busXArr = Array.from({length: showInvU}, (_, ui) => {
      const mStart = Math.round(ui * nCols / showInvU);
      const mEnd   = Math.round((ui + 1) * nCols / showInvU);
      const myCols  = colXs.slice(mStart, mEnd);
      return Math.round((myCols[0] + myCols[myCols.length - 1]) / 2);
    });
    s.push(L(busXArr[0], busACy, busXArr[showInvU - 1], busACy, C.ac, 5));
    busXArr.forEach(bx => s.push(nodo(bx, busACy, C.ac, 10)));
    s.push(TM('Bus AC comune', XC, busACy - 28, 20, C.ac, '600'));
  }

  // ── BESS (P4b — opzionale, AC-coupled o DC-coupled) ──────────────────────
  if (bessMode) {
    const isDCcoupled = _bessTopology === 'dc';
    const BESS_X = XC + 580;
    const BESS_Y = isDCcoupled ? YY.inverter - 120 : YY.inverter - 80;
    const BESS_W = 360, BESS_H = isDCcoupled ? 260 : 220;
    const BESS_COL = isDCcoupled ? '#7c3aed' : '#0891b2';
    s.push(R(BESS_X - BESS_W/2, BESS_Y, BESS_W, BESS_H, 8, isDCcoupled?'#faf5ff':'#f0f9ff', BESS_COL, 2));
    s.push(TM('BESS', BESS_X, BESS_Y + 28, 24, BESS_COL, '700'));
    s.push(TM(isDCcoupled ? 'DC-coupled (inv. ibrido)' : 'AC-coupled', BESS_X, BESS_Y + 56, 18, BESS_COL, '600'));
    // BMS
    s.push(R(BESS_X - 130, BESS_Y + 70, 260, 55, 5, isDCcoupled?'#ede9fe':'#e0f2fe', BESS_COL, 1.5));
    s.push(TM('BMS', BESS_X, BESS_Y + 88, 17, BESS_COL, '700'));
    s.push(TM('OVP · UVP · OCP · OTP · SCP', BESS_X, BESS_Y + 108, 14, C.gray, 'normal'));
    // Parametri
    s.push(T('• IEC 62619 · UN 38.3 (certif. obbligatoria)', BESS_X - BESS_W/2+12, BESS_Y + 140, 14, C.gray, 'start'));
    s.push(T('• SPD DC: Uc≥1.25×Vbat_max (CEI EN 61643-31)', BESS_X - BESS_W/2+12, BESS_Y + 158, 14, C.gray, 'start'));
    s.push(T('• Sez. manutenzione visibile se V>48V', BESS_X - BESS_W/2+12, BESS_Y + 176, 14, C.gray, 'start'));
    s.push(T('• CEI EN 62933-1 · CEI 0-21:2025 §12', BESS_X - BESS_W/2+12, BESS_Y + 194, 14, '#4a6a9a', 'start'));
    if (isDCcoupled) {
      // DC-coupled: batteria collegata al bus DC dell'inverter ibrido
      s.push(T('• Carica/scarica anche senza rete (island mode)', BESS_X - BESS_W/2+12, BESS_Y + 212, 14, '#7c3aed', 'start'));
      s.push(T('• Efficienza round-trip superiore ad AC-coupled', BESS_X - BESS_W/2+12, BESS_Y + 230, 14, '#7c3aed', 'start'));
      // Collegamento DC al bus inverter ibrido
      s.push(L(BESS_X - BESS_W/2, BESS_Y + BESS_H/2, XC + 220, YY.inverter, C.dcPos, 2, '8,5'));
      s.push(T('H1Z2Z2-K — DC-coupled', BESS_X - BESS_W/2 - 10, BESS_Y + BESS_H/2 - 14, 14, C.dcPos, 'end'));
      s.push(T('⚠ Inverter ibrido con doppio ingresso DC', BESS_X, BESS_Y + BESS_H + 16, 15, '#7c3aed', 'middle'));
    } else {
      // AC-coupled: collegamento al quadro BT
      s.push(L(BESS_X - BESS_W/2, BESS_Y + BESS_H/2, XC + QBT_W/2, YY.qbt_top + 100, C.ac, 2));
      s.push(T('FG7OR — AC-coupled', BESS_X - BESS_W/2 - 10, BESS_Y + BESS_H/2 - 14, 14, C.ac, 'end'));
      s.push(T('DDI dedicato lato AC batteria (CEI 0-21 §12)', BESS_X, BESS_Y + BESS_H + 16, 15, '#0891b2', 'middle'));
    }
  }

  // Cavo AC verso Quadro BT
  s.push(L(XC, YY.cavi_ac_top, XC, YY.qbt_top, C.ac, 3.5));
  const acLblY = YY.cavi_ac_top + 14;
  s.push(T(`FG7OR ${S_AC_calc}mm\u00b2 ${matLbl}`, XC + 14, acLblY, 14, C.ac, 'start'));
  s.push(T(`${lenAC}m \u2014 In: ${I_AC.toFixed(1)} A`, XC + 14, acLblY + 17, 13, C.gray, 'start'));
  s.push(T(`Vn: ${V_AC} V`, XC + 14, acLblY + 33, 13, C.gray, 'start'));
  // \u2500\u2500 QUADRO AC PRODUZIONE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // \u2500\u2500 QUADRO BT (Produzione FV) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const QBT_W = 620, QBT_H = YY.qbt_bot - YY.qbt_top;
  s.push(bloccoFunz(XC-QBT_W/2, YY.qbt_top, QBT_W, QBT_H, 'Quadro BT \u2014 Produzione FV', '#1a3a6e'));

  let yQ = YY.qbt_top + 80;
  // Conduttore AC entrata QBT \u2192 MCB
  s.push(L(XC, YY.qbt_top + 20, XC, yQ - 40, C.ac, 3.5));
  s.push(symMCB(XC, yQ, C.ac));
  s.push(T(`MCB ${sysLbl}`, XC+48, yQ-22, 22, '#1a1a1a', 'start', '700'));
  s.push(T(`In: ${Math.ceil(I_AC*1.25)}A \u2014 curva C`, XC+48, yQ+12, 19, C.gray, 'start'));
  s.push(T('CEI EN 60898-1 \u00b7 OVC III', XC+48, yQ+30, 13, C.lgray, 'start'));
  yQ += 120;

  // Conduttore MCB \u2192 RCD \u2014 parte da MCB bottom (cy_mcb+hh = yQ-120+24 = yQ-96)
  s.push(L(XC, yQ - 96, XC, yQ - 40, C.ac, 3.5));
  s.push(symRCD(XC, yQ, 'A', C.ac));
  s.push(T('RCD Tipo A', XC+48, yQ-38, 22, '#1a1a1a', 'start', '700'));
  s.push(T(`In: ${Math.ceil(I_AC*1.25)}A \u2014 I\u0394n: 30mA`, XC+48, yQ, 19, C.gray, 'start'));
  s.push(T('CEI EN 61008-1 \u00b7 Tipo A', XC+48, yQ+22, 13, C.lgray, 'start'));
  yQ += 140;

  // Conduttore RCD → contatore produzione — parte da RCD exit (toroide bottom+r = cy_rcd+68 = yQ-140+68 = yQ-72)
  s.push(L(XC, yQ - 72, XC, yQ - 38, C.ac, 3.5));
  // Contatore produzione (monodir.) dentro il Quadro BT
  s.push(symMeter(XC, yQ, 'kWh', false, '#1a7000'));
  s.push(T('Contatore produzione', XC+55, yQ-20, 20, '#1a1a1a', 'start', '700'));
  s.push(T('Classe B \u2014 monodirezionale', XC+55, yQ+8, 18, C.gray, 'start'));

  // SPD AC T2 — derivazione pulita ortogonale dal tronco principale
  const spdACx = XC - QBT_W/2 + 90;
  const spdACy = YY.qbt_top + QBT_H/2;
  // Derivazione SPD: prende dal conduttore MCB→RCD (tra MCB_bot@+104 e RCD_top@+160)
  // qbt_top+108 = 4px sotto MCB_bot → nessun overlap con i simboli
  s.push(nodo(XC, YY.qbt_top + 108, C.ac, 5));  // nodo T-junction SPD derivazione
  s.push(L(XC, YY.qbt_top + 108, spdACx, YY.qbt_top + 108, C.ac, 1.5, '6,4'));
  s.push(L(spdACx, YY.qbt_top + 108, spdACx, spdACy - 35, C.ac, 1.5, '6,4'));
  s.push(symSPD(spdACx, spdACy, C.ac));
  s.push(T('SPD AC T2', spdACx+28, spdACy-30, 18, C.ac, 'start', '600'));
  s.push(T(`Uc: 275V \u2014 ${sysLbl}`, spdACx+28, spdACy-5, 16, C.gray, 'start'));
  s.push(T('OVC II \u00b7 Rif: CEI EN 61643-11', spdACx+28, spdACy+16, 13, C.lgray, 'start'));

  // Linea Quadro BT → SPI
  s.push(L(XC, YY.qbt_bot, XC, YY.spi_y - (spiIntegrato ? 55 : 95), C.ac, 3.5));

  // \u2500\u2500 SPI \u2014 SISTEMA DI PROTEZIONE INTERFACCIA (nodo funzionale) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const SPI_W = 560, SPI_H = spiIntegrato ? 110 : 190;
  s.push(bloccoFunz(XC - SPI_W/2, YY.spi_y - SPI_H/2, SPI_W, SPI_H,
    'SPI \u2014 Sistema di Protezione Interfaccia', spiIntegrato ? '#555555' : '#b45309'));

  if (spiIntegrato) {
    s.push(T('Integrato nell’inverter (P&P)', XC+20, YY.spi_y - 18, 16, '#555555', 'start', '700'));
    s.push(T(`Pac = ${P_pac_tot.toFixed(1)} kW ≤ 11.08 kW — CEI §8.2.2.2`, XC+20, YY.spi_y + 8, 13, '#888888', 'start'));
    s.push(T('LVRT/HVRT abilitato — Allegato A', XC+20, YY.spi_y + 28, 13, '#1e4aaa', 'start', '600'));
  } else {
    s.push(T('Relè interfaccia + logica protezione', XC+20, YY.spi_y - 68, 14, '#1a1a1a', 'start'));
    s.push(T(cartSpiModello || '[Marca / Modello SPI]', XC+20, YY.spi_y - 46, 15, '#444444', 'start', '600'));
    s.push(T('SN: ' + (cartSpiMatricola || '[Matricola]'), XC+20, YY.spi_y - 24, 13, '#444444', 'start'));
    s.push(T('59.S1/S2 · 27.S1/S2 · 81>.S2 · 81<.S2', XC+20, YY.spi_y + 4, 13, '#666666', 'start'));
    s.push(T('LVRT/HVRT abilitato — Allegato A', XC+20, YY.spi_y + 24, 13, '#1e4aaa', 'start', '600'));
    s.push(T(`Pac ${P_pac_tot.toFixed(1)} kW > 11.08 kW — est. obbl.`, XC+20, YY.spi_y + 44, 12, '#b45309', 'start'));
    // Freccia di comando SPI \u2192 DDI (tratteggiata, lato destro)
    const _cmdX = XC + SPI_W/2 + 60;
    s.push(L(XC + SPI_W/2, YY.spi_y, _cmdX, YY.spi_y, '#b45309', 1.5, '5,3'));
    s.push(L(_cmdX, YY.spi_y, _cmdX, YY.ddi_y, '#b45309', 1.5, '5,3'));
    s.push(L(_cmdX, YY.ddi_y, XC + 230, YY.ddi_y, '#b45309', 1.5, '5,3'));
    s.push(T('Cmd apertura DDI', _cmdX + 8, (YY.spi_y + YY.ddi_y)/2, 15, '#b45309', 'start', '600'));
  }

  // Linea SPI \u2192 DDI (conduttore AC)
  s.push(L(XC, YY.spi_y + SPI_H/2, XC, YY.ddi_y - 100, C.ac, 3.5));

  // \u2500\u2500 DDI \u2014 DISPOSITIVO DI INTERFACCIA \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  s.push(R(XC-230, YY.ddi_y-100, 430, 200, 6, 'none', '#333333', 2, '12,6'));
  // Connettori interni: dal bordo del box al simbolo MCB
  s.push(L(XC, YY.ddi_y - 100, XC, YY.ddi_y - 40, '#1a1a1a', 3.5));
  s.push(symMCB(XC, YY.ddi_y, '#1a1a1a'));
  s.push(L(XC, YY.ddi_y + 24, XC, YY.ddi_y + 100, '#1a1a1a', 3.5));
  s.push(T('DDI', XC+65, YY.ddi_y-76, 28, '#1a1a1a', 'start', '700'));
  s.push(T('Dispositivo di Interfaccia', XC+65, YY.ddi_y-44, 20, C.gray, 'start'));
  s.push(T(`In: ${Math.ceil(I_AC*1.3)}A \u2014 4P \u2014 Motorizzato`, XC+65, YY.ddi_y-10, 19, C.gray, 'start'));
  if (!spiIntegrato) {
    s.push(T('\u26a1 Comandato da SPI (apertura entro 0.5 s)', XC+65, YY.ddi_y+26, 17, '#b45309', 'start', '600'));
    s.push(T('CEI 0-21 \u00a78.2.2.3', XC+65, YY.ddi_y+58, 16, C.lgray, 'start'));
  } else {
    s.push(T('CEI 0-21 \u00a78.2.2.3 \u2014 a valle PdC', XC+65, YY.ddi_y+26, 17, C.lgray, 'start'));
  }

  // ── SWITCH PRE-M0 (opzionale — richiesto da alcuni DSO) ──────────────────
  // sw_y: tra DDI box_bot (ddi_y+100=2160) e contatore top (contatore_scambio-38=2242)
  // spazio: 82px, switch+connettori: 72px → fit OK
  if (hasSwitch) {
    const sw_y = YY.ddi_y + 136;  // = 2196, tra DDI_bot(2160) e contatore_top(2242)
    s.push(L(XC, YY.ddi_y + 100, XC, sw_y - 26, C.ac, 3.5));  // DDI_bot → sez_top
    s.push(symSez(XC, sw_y, '#374151'));
    s.push(L(XC, sw_y + 26, XC, YY.contatore_scambio - 38, C.ac, 3.5));  // sez_bot → contatore
    s.push(T('Q1 \u2014 Sez. generale', XC + 32, sw_y + 5, 17, '#374151', 'start', '600'));
    s.push(T('(Req. DSO)', XC + 32, sw_y + 22, 14, C.gray, 'start'));
  } else {
    // (rimosso: unica linea diretta ddi→contatore sotto)
    // (unica linea corretta già sotto)
    s.push(L(XC, YY.ddi_y + 100, XC, YY.contatore_scambio - 38, C.ac, 3.5));
  }
  // \u2500\u2500 CONTATORE SCAMBIO \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Conduttore DDI/switch → contatore scambio
  // Conduttore → contatore: solo in assenza di switch (il switch ha già il suo connettore finale)
  // (rimosso: conduttore già nel blocco else sopra)
  // (conduttore ddi→contatore gestito nell'else sopra con linea diretta)
  s.push(T('Contatore di scambio SSP', XC+55, YY.contatore_scambio-22, 22, '#1a1a1a', 'start', '700'));
  s.push(T('Classe B \u2014 bidirezionale 2G teleleggibile (GSE)', XC+55, YY.contatore_scambio+6, 18, C.gray, 'start'));
  // P0: nota bidirezionale obbligatorio per TUTTI (non solo >6kW), nota trifase se >6kW
  s.push(T('\u2022 Obbl. per tutti gli impianti FV grid-connected \u2014 CEI 0-21:2025 \u00a75.1', XC+55, YY.contatore_scambio+28, 14, C.gray, 'start'));
  if (sysAC !== 'mono') {
    s.push(T('\u26a0 Trifase obbligatorio (Pac > 6 kW) \u2014 CEI 0-21 \u00a75.1', XC + 55, YY.contatore_scambio + 46, 14, '#b45309', 'start'));
  }

  s.push(L(XC, YY.contatore_scambio+42, XC, YY.pdc-20, C.ac, 3.5));

  // PdC
  s.push(nodo(XC, YY.pdc, C.ac, 10));
  const utX = XC - 500;
  s.push(L(XC, YY.pdc, utX, YY.pdc, C.ac, 3));
  s.push(L(utX, YY.pdc, utX, YY.pdc+80, C.ac, 3));
  s.push(R(utX-120, YY.pdc+80, 240, 80, 6, C.white, '#1a1a1a', 2));
  s.push(TM('Utenze', utX, YY.pdc+120, 28, '#1a1a1a', '700'));
  s.push(T('POD \u2014 Punto di consegna', XC+25, YY.pdc, 22, C.gray, 'start', 'normal'));

  s.push(L(XC, YY.pdc, XC, YY.rete-80, C.ac, 3.5));

  // \u2500\u2500 RETE BT DSO \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  s.push(symRete(XC, YY.rete));

  // ── SOGLIE SPI (colonna destra, riferimento CEI 0-21 Tab.13) ──────
  if (!spiIntegrato) {
    const spiX = RH_X + 10, spiY = YY.moduli + 610;
    const spiW = RH_W - 20;
    s.push(R(spiX, spiY, spiW, 320, 4, '#fffbeb', '#b45309', 1.5));
    s.push(T('Soglie SPI — CEI 0-21:2025-10 Tab.13', spiX + 14, spiY + 22, 18, '#b45309', 'start', '700'));
    const spiSoglie = [
      ['59.S1', "Max tensione (media 10')", '≥ 1.10 Vn', '603 s'],
      ['59.S2', 'Max tensione istantanea',   '≥ 1.15 Vn', '0.2 s'],
      ['27.S1', 'Min tensione',              '≤ 0.85 Vn', '1.5 s'],
      ['27.S2', 'Min tensione rapida',       '≤ 0.15 Vn', '0.2 s'],
      ['81>.S2','Max frequenza',             '≥ 51.5 Hz',  '1 s'],
      ['81<.S2','Min frequenza',             '≤ 47.5 Hz',  '4 s'],
    ];
    spiSoglie.forEach((r, ri) => {
      const ry = spiY + 46 + ri * 42;
      s.push(R(spiX + 6, ry - 14, spiW - 12, 38, 2, ri%2===0 ? '#fff8e1' : '#ffffff', 'none', 0));
      s.push(T(r[0], spiX + 16, ry + 5, 16, '#b45309', 'start', '700'));
      s.push(T(r[1], spiX + 95, ry + 5, 15, '#333333', 'start'));
      s.push(T(r[2], spiX + 310, ry + 5, 16, '#1a1a1a', 'start', '600'));
      s.push(T(r[3], spiX + 430, ry + 5, 16, '#444444', 'start'));
    });
  }

  // ── RIEPILOGO IMPIANTO (colonna destra) ────────────────────────────────
  {
    const RI_X = RH_X + 10, RI_W = RH_W - 20;
    const RI_Y = YY.moduli + (spiIntegrato ? 610 : 950);
    const RI_H = 420;
    s.push(R(RI_X, RI_Y, RI_W, RI_H, 6, '#f8faff', '#1e4aaa', 1.5));
    s.push(R(RI_X, RI_Y, RI_W, 40, 6, '#e8efff', '#1e4aaa', 1.5));
    s.push(TM('RIEPILOGO IMPIANTO', RI_X + RI_W/2, RI_Y + 24, 20, '#1e4aaa', '700'));
    const ri = [
      ['Potenza picco FV',     `${P_kwp.toFixed(2)} kWp`],
      ['Potenza AC nominale',  `${P_pac_tot > 0 ? P_pac_tot.toFixed(1) : (invPac||'\u2014')} kW`],
      ['N\u00b0 moduli',          `${totPanels} ud.`],
      ['N\u00b0 stringhe',        `${totStr} (${strPerMppt}/MPPT)`],
      ['Moduli / stringa',     `${modsPerStr} ud.`],
      ['Tensione Voc stringa', `${V_str_voc.toFixed(0)} V`],
      ['Sistema AC',           sysLbl],
      ['Sistema di terra',     'TT'],
      ['Cavo stringa DC',      `H1Z2Z2-K ${S_str} mm\u00b2`],
      ['Cavo AC uscita',       `FG7OR ${S_AC_calc} mm\u00b2`],
    ];
    ri.forEach((row, i) => {
      const ry = RI_Y + 55 + i * 36;
      s.push(R(RI_X + 4, ry - 13, RI_W - 8, 32, 2, i%2===0 ? '#f0f4ff' : '#f8faff', 'none', 0));
      s.push(T(row[0], RI_X + 16, ry + 7, 17, '#444444', 'start'));
      s.push(T(row[1], RI_X + RI_W - 16, ry + 7, 18, '#1a1a1a', 'end', '600'));
    });
    const rfY = RI_Y + 55 + ri.length * 36 + 6;
    s.push(L(RI_X, rfY, RI_X + RI_W, rfY, '#aaaaaa', 1));
    s.push(TM('Dati calcolati dal progetto', RI_X + RI_W/2, rfY + 18, 15, '#999999'));
  }

  // ── LINEA PE ──────────────────────────────────────────────────────────────────
  const PE_X = Math.min(XC + INV_TOTAL_W/2 + 140, RH_X - 160);  // mai dentro la colonna destra
  s.push(L(PE_X, YY.moduli, PE_X, YY.rete, C.pe, 2, '12,6'));
  s.push(TRot('Conduttore PE / Terra', PE_X, (YY.moduli+YY.rete)/2, 22, C.pe, -90));
  const teY = YY.rete + 40;
  s.push(L(PE_X, YY.rete, PE_X, teY, C.pe, 2.5));
  s.push(L(PE_X-35, teY, PE_X+35, teY, C.pe, 3.5));
  s.push(L(PE_X-22, teY+14, PE_X+22, teY+14, C.pe, 2.5));
  s.push(L(PE_X-10, teY+28, PE_X+10, teY+28, C.pe, 1.5));
  // Connessioni PE: start X specifico per ogni sezione
  const peNodes = [
    { py: YY.inverter,         boxRight: invBoxRight + 20 },
    { py: YY.qbt_top + QBT_H/2, boxRight: XC + QBT_W/2 + 20 },
    { py: YY.ddi_y,            boxRight: XC + 230 + 20 },
  ];
  peNodes.forEach(({py, boxRight}) => {
    const peStartX = Math.min(boxRight, PE_X - 30);
    s.push(L(peStartX, py, PE_X, py, C.pe, 1.5, '8,5'));
    s.push(nodo(PE_X, py, C.pe, 6));
  });

  // \u2500\u2500 CARTIGLIO \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // ── PERCORSO PE / EQUIPOTENZIALE (CEI 64-8 sez. 712.54) ───────────────────
  {
    const PE_X = RH_X - 200;   // lato destro dello schema, fuori dalla zona MPPT
    const PE_COL = '#16a34a';  // verde PE
    const PE_DASH = '8,4';
    // Linea verticale PE dalla struttura (pannelli) verso il basso
    s.push(L(PE_X, YY.moduli + 60, PE_X, YY.qbt_top + 280, PE_COL, 2, PE_DASH));
    // Nodo equipotenziale (barra PE quadro AC)
    const peNodeY = YY.qbt_top + 280;
    s.push(R(PE_X - 40, peNodeY - 12, 80, 24, 4, PE_COL, 'none', 0));
    s.push(T('PE', PE_X, peNodeY + 4, 18, C.white, 'middle', '700'));
    // Dal nodo PE verso dispersore (in basso)
    const dispY = YY.ddi_y + 60;
    s.push(L(PE_X, peNodeY + 12, PE_X, dispY, PE_COL, 2, PE_DASH));
    // Simbolo dispersore (linee orizzontali decrescenti)
    const dBases = [40, 28, 16];
    dBases.forEach((hw, di) => {
      s.push(L(PE_X - hw, dispY + di*12, PE_X + hw, dispY + di*12, PE_COL, 2));
    });
    s.push(T('Dispersore vert.', PE_X + 50, dispY + 16, 16, PE_COL, 'start'));
    // Calcolo Rt
    const earthRho2 = parseFloat((document.getElementById('earthRho')||{value:'100'}).value)||100;
    const earthLen2 = parseFloat((document.getElementById('earthLen')||{value:'1.5'}).value)||1.5;
    const EARTH_ROD_D2 = 0.014;
    const Rt2 = earthLen2 > 0 ? (earthRho2/(2*Math.PI*earthLen2))*Math.log(4*earthLen2/EARTH_ROD_D2) : 999;
    const rtOk2 = Rt2 <= 5.0;
    s.push(T(`Rt = ${Rt2.toFixed(1)} Ω ${rtOk2 ? '✔' : '⚠ > 5Ω'}`, PE_X + 50, dispY + 34, 15, rtOk2?PE_COL:'#dc2626', 'start'));
    s.push(T('ρ = '+earthRho2+' Ω·m, L = '+earthLen2+' m (CEI 64-8 art. 612.6)', PE_X + 50, dispY + 50, 13, C.gray, 'start'));
    // Label percorso PE
    s.push(T('Conduttore PE / eq. masse (1× 6mm² G/V)', PE_X + 50, YY.moduli + 80, 16, PE_COL, 'start'));
  }

  // ── P3: OVERLAY CLICCABILI SUI COMPONENTI (onclick popup tecnico) ────────
  // Rettangoli trasparenti posizionati sopra i blocchi principali
  const _clickRect = (x, y, w, h, cid) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="transparent" cursor="pointer" `+
    `onclick="_showSldPopup('${cid}',event.clientX+10,event.clientY+10)"/>`;
  // Quadro DC (cassette stringhe) — una per colonna MPPT
  cassettaXs.forEach(cx => {
    s.push(_clickRect(cx - COL_W/2 + 20, YY.cassetta_top - 20, COL_W - 40, YY.cassetta_bot - YY.cassetta_top + 40, 'cassetta'));
  });
  // Quadro Inverter
  s.push(_clickRect(XC - INV_TOTAL_W/2 - 20, YY.inverter - INV_H/2 - 20, INV_TOTAL_W + 40, INV_H + 40, 'inverter'));
  // Quadro BT
  s.push(_clickRect(XC - QBT_W/2, YY.qbt_top, QBT_W, QBT_H, 'qbt'));
  // SPI
  s.push(_clickRect(XC - SPI_W/2 - 10, YY.spi_y - SPI_H/2 - 10, SPI_W + 20, SPI_H + 20, 'spi'));
  // DDI
  s.push(_clickRect(XC - 230, YY.ddi_y - 110, 430 + 20, 220, 'ddi'));
  // Contatore scambio
  s.push(_clickRect(XC - 45, YY.contatore_scambio - 50, 500, 100, 'cnt'));
  // BESS
  if (bessMode) {
    const BESS_X2 = XC + 550;
    s.push(_clickRect(BESS_X2 - 160 - 10, YY.inverter - 80 - 10, 340, 200, 'bess'));
  }

  // ── LINEA CONFINE DSO ─────────────────────────────────────────────────────
  const dsoBoundaryY = Math.round((YY.contatore_scambio + 70 + YY.pdc - 20) / 2);
  s.push(L(40, dsoBoundaryY, VW-40, dsoBoundaryY, '#888888', 1.2, '10,6'));
  s.push(T('Confine di propriet\u00e0 / PdC', 55, dsoBoundaryY - 14, 20, '#888888', 'start'));
  s.push(T('\u25c4 Lato utente', 55, dsoBoundaryY + 24, 18, '#888888', 'start'));
  s.push(T('Lato DSO \u25ba', VW - 55, dsoBoundaryY + 24, 18, '#888888', 'end'));

  // ── LEGENDA ─────────────────────────────────────────────────────────────────
  const LEG_X = 50, LEG_Y = YY.cart - 310;
  s.push(R(LEG_X - 12, LEG_Y - 32, 810, 290, 4, 'none', '#cccccc', 1));
  s.push(T('LEGENDA', LEG_X, LEG_Y - 8, 22, '#1a1a1a', 'start', '700'));
  // — Linee circuiti —
  const legItems = [
    { col: C.dcPos,  dash: null,   lbl: 'Circuito DC (polo + e \u2212)', hash: true },
    { col: C.ac,     dash: null,   lbl: 'Circuito AC (1~/3~)', hash: false },
    { col: C.pe,     dash: '8,4',  lbl: 'Conduttore PE / terra', hash: false },
    { col: C.pe,     dash: '4,4',  lbl: 'Equipotenziale masse', hash: false },
  ];
  legItems.forEach((it, i) => {
    const yl = LEG_Y + 26 + i * 30;
    s.push(L(LEG_X, yl, LEG_X + 80, yl, it.col, 2.5, it.dash));
    s.push(T(it.lbl, LEG_X + 95, yl + 1, 19, '#1a1a1a', 'start'));
    // Hash marks IEC per circuiti a 2 conduttori
    if (it.hash) {
      s.push(L(LEG_X + 34, yl - 8, LEG_X + 50, yl + 8, it.col, 1.5));
      s.push(L(LEG_X + 40, yl - 8, LEG_X + 56, yl + 8, it.col, 1.5));
      s.push(T('= 2 conduttori', LEG_X + 390, yl + 1, 16, '#888888', 'start'));
    }
  });
  // — Sigle componenti —
  const SIGLE_X = LEG_X + 400;
  s.push(T('SIGLE COMPONENTI', SIGLE_X, LEG_Y - 8, 18, '#1a1a1a', 'start', '700'));
  const sigle = [
    { sigla: 'MCB',  desc: 'Magnetotermico',                norma: 'CEI EN 60898-1'   },
    { sigla: 'RCD',  desc: 'Differenziale',                  norma: 'CEI EN 61008'     },
    { sigla: 'SPD',  desc: 'Scaricatore sovratensione',      norma: 'CEI EN 61643-11'  },
    { sigla: 'DDI',  desc: 'Dispositivo di interfaccia',     norma: 'CEI 0-21 §6.2'  },
    { sigla: 'SPI',  desc: 'Sist. Protezione Interfaccia',   norma: 'CEI 0-21 All.A'   },
    { sigla: 'QDC',  desc: 'Quadro di campo DC',             norma: 'IEC 62548 §6'    },
    { sigla: 'SEZ',  desc: 'Sezionatore DC per stringa',     norma: 'CEI EN 60947-3'   },
    { sigla: 'FUS',  desc: '• fusibile DC se (n∥-1)×Isc>ISCR', norma: 'IEC 62548 §6.3' },
  ];
  sigle.forEach((sg, i) => {
    const ys = LEG_Y + 26 + i * 28;
    s.push(T('▪ '+sg.sigla, SIGLE_X, ys + 1, 17, '#1e40af', 'start', '700'));
    s.push(T('— '+sg.desc, SIGLE_X + 54, ys + 1, 16, '#1a1a1a', 'start'));
    s.push(T(sg.norma, SIGLE_X + 310, ys + 1, 14, '#888888', 'start'));
  });

  // ── TOPOLOGY — grafo impianto (struttura dati) ──────────────────────────────
  // Ogni nodo rappresenta un elemento fisico/funzionale dell'impianto.
  // Ogni edge rappresenta un collegamento elettrico o di comando.
  const topology = {
    nodes: [
      { id: 'campo_fv',  type: 'campo_fv',   label: `${totStr} stringhe`,    detail: `${P_kwp.toFixed(2)} kWp` },
      { id: 'mppt',      type: 'mppt',        label: `${mpptTot} MPPT`,       detail: `${strPerMppt} str./MPPT` },
      ...invUnits.map((inv, i) => ({ id: `inv_${i}`, type: 'inverter', brand: inv.brand, model: inv.model, pac: inv.pac })),
      { id: 'qbt',  type: 'quadro_bt',  label: 'Quadro BT',   detail: `MCB ${Math.ceil(I_AC*1.25)}A \u00b7 RCD \u00b7 SPD` },
      { id: 'spi',  type: 'spi',
        modo:        spiIntegrato ? 'integrato' : 'esterno',
        protezioni:  ['59.S1','59.S2','27.S1','27.S2','81>.S2','81<.S2'],
        comando:     { agisceSu: 'ddi', tipo: 'apertura' },
        modello:     cartSpiModello, matricola: cartSpiMatricola, cert: cartSpiCert },
      { id: 'ddi',  type: 'ddi',
        correnteNominale: Math.ceil(I_AC*1.3), poli: 4, motorizzato: true, controllatoDa: 'spi' },
      { id: 'cnt_sc', type: 'contatore', label: 'Contatore scambio SSP', dir: 'bidirezionale' },
      { id: 'rete',   type: 'rete',      label: 'Rete BT DSO',           voltage: sysLbl },
    ],
    edges: [
      { from: 'campo_fv', to: 'mppt',    cable: { type: 'H1Z2Z2-K', S: S_str,    I: I_str_des, L: lenStr  } },
      { from: 'mppt',     to: 'inv_0',   cable: { type: 'H1Z2Z2-K', S: S_str,    I: I_str_des, L: lenMain } },
      { from: 'inv_0',    to: 'qbt',     cable: { type: 'FG7OR',    S: S_AC_calc, I: I_AC,      L: lenAC   } },
      { from: 'qbt',      to: 'spi',     cable: null },
      { from: 'spi',      to: 'ddi',     cable: null, relation: 'comando' },
      { from: 'ddi',      to: 'cnt_sc',  cable: null },
      { from: 'cnt_sc',   to: 'rete',    cable: null },
    ],
  };
  // Rende la topologia disponibile per debug / export esterno
  try { window.sldTopology = topology; } catch(e) { /* debug hook, non-critical */ }

  // ── CARTIGLIO (CEI EN 62446-1) ────────────────────────────────────────────
  const CY0 = YY.cart;
  const CH  = VH - CY0 - 8;
  // Bordo
  s.push(R(20, CY0, VW - 40, CH, 0, C.white, '#1a1a1a', 2.5));
  // Linea orizzontale sotto il titolo
  s.push(L(20, CY0 + 85, VW - 20, CY0 + 85, '#1a1a1a', 2));
  // Linea orizzontale sopra normative
  s.push(L(20, CY0 + 250, VW - 20, CY0 + 250, '#1a1a1a', 1));
  // Divisori verticali nella sezione dati
  s.push(L(Math.round(VW / 2), CY0 + 85, Math.round(VW / 2), CY0 + 250, '#1a1a1a', 1));
  s.push(L(Math.round(VW * 3 / 4), CY0 + 85, Math.round(VW * 3 / 4), CY0 + 250, '#1a1a1a', 1));

  // Titolo principale
  s.push(TM(`Schema Unifilare Impianto Fotovoltaico \u2014 ${P_kwp.toFixed(2)} kWp`, VW / 2, CY0 + 48, 38, '#1a1a1a', '700'));
  s.push(TM('Conforme CEI 0-21:2025-10 \u00b7 CEI 64-8/7 sez.712 \u00b7 CEI EN 62446-1', VW / 2, CY0 + 74, 20, C.gray, 'normal'));

  // Colonna 1 — Committente / Impianto
  const lx1 = 45, ly0 = CY0 + 107;
  s.push(T('Committente:', lx1, ly0, 22, '#1a1a1a', 'start', '700'));
  s.push(T(cartCommittente, lx1 + 175, ly0, 22, '#1a1a1a', 'start'));
  s.push(T('Indirizzo:', lx1, ly0 + 34, 20, '#1a1a1a', 'start', '700'));
  s.push(T(cartIndirizzo, lx1 + 120, ly0 + 34, 20, C.gray, 'start'));
  s.push(T(`Connessione: ${sysLbl} \u2014 Sistema terra: TT`, lx1, ly0 + 68, 19, C.gray, 'start'));
  s.push(T(`Potenza picco: ${P_kwp.toFixed(2)} kWp \u2014 Pac nom.: ${invPac > 0 ? invPac.toFixed(1) : '\u2014'} kW`, lx1, ly0 + 98, 19, C.gray, 'start'));

  // Colonna 2 — Progettista
  const lx2 = Math.round(VW / 2) + 30;
  s.push(T('Progettista:', lx2, ly0, 22, '#1a1a1a', 'start', '700'));
  s.push(T(cartProgettista, lx2 + 155, ly0, 22, '#1a1a1a', 'start'));
  s.push(T(cartAlbo, lx2, ly0 + 34, 19, C.gray, 'start'));
  s.push(T('Firma e timbro:', lx2, ly0 + 80, 20, '#777777', 'start'));
  s.push(L(lx2 + 155, CY0 + 240, Math.round(VW * 3 / 4) - 30, CY0 + 240, '#1a1a1a', 1));

  // Colonna 3 — Riferimenti disegno (struttura: banner TAV + dati)
  const lx3 = Math.round(VW * 3 / 4) + 30;
  const lx3W = VW - 40 - lx3 + 10;
  // Banner numero tavola: striscia blu nell'angolo superiore della colonna 3
  // Posizionato tra divisore superiore (CY0+85) e ly0 (CY0+107)
  // h=40 → copre CY0+85 a CY0+125, testo a CY0+105 (dentro)
  // N° disegno e revisioni partono da CY0+130 (fuori dal banner)
  const tavNum = cartNumDisegno || 'TAV.E02';
  s.push(R(lx3 - 10, CY0 + 85, lx3W, 40, 0, '#1e4aaa', '#1e4aaa', 0));
  s.push(T('N. TAVOLA', lx3 + 4, CY0 + 105, 12, '#93c5fd', 'start', '700'));
  s.push(T(tavNum, lx3 + lx3W - 12, CY0 + 105, 26, '#ffffff', 'end', '700'));
  // Dati: iniziano a CY0+130 (dopo il banner) — indipendenti da ly0
  const ly3 = CY0 + 130;
  s.push(T('N° disegno:', lx3, ly3, 18, '#1a1a1a', 'start', '700'));
  s.push(T(cartNumDisegno || '—', lx3 + 140, ly3, 18, C.gray, 'start'));
  // Tabella revisioni: righe con righe alternate
  const revToShow = _revRows.length > 0 ? _revRows : [{ num: cartRevisione, data: new Date().toLocaleDateString('it-IT'), desc: 'Prima emissione' }];
  revToShow.slice(0, 3).forEach((rv, ri) => {
    const ry = ly3 + 24 + ri * 26;
    if (ri % 2 === 0) s.push(R(lx3 - 6, ry - 12, lx3W - 4, 24, 2, '#f0f4ff', 'none', 0));
    s.push(T(`Rev ${rv.num}`, lx3, ry + 4, 16, C.gray, 'start', '700'));
    s.push(T(rv.data, lx3 + 90, ry + 4, 16, C.gray, 'start'));
    s.push(T(rv.desc, lx3 + 210, ry + 4, 16, C.gray, 'start'));
  });
  s.push(T(`Data: ${new Date().toLocaleDateString('it-IT')}`, lx3, ly3 + 108, 18, C.gray, 'start'));
  s.push(T('Scala: Fuori scala', lx3, ly3 + 130, 18, C.gray, 'start'));
  // Riga normative (condizionale BT/MT)
  const normLine = isMT
    ? 'Normative: CEI 0-16:2022 \u00b7 CEI 64-8 sez.712 \u00b7 CEI EN 62446-1:2016 \u00b7 IEC 62548 \u00b7 CEI EN 60076-1'
    : 'Normative: CEI 0-21:2025-10 \u00b7 CEI 64-8/7 sez.712 \u00b7 CEI EN 62446-1:2016 \u00b7 IEC 62548 \u00b7 IEC 60617';
  s.push(TM(normLine, VW / 2, CY0 + 270, 18, C.gray, 'normal'));
  // AP-11 / T2.6.2 \u2014 app traceability stamp. Project-aware via
  // getEffectiveNormsRevision() so MT projects cite CEI 0-16 here too,
  // matching the normLine above.
  s.push(TM(`Solar Designer Pro v${SDPROJ_APP_VERSION} \u00b7 Riferimento normativo: ${getEffectiveNormsRevision()}`, VW / 2, CY0 + 292, 14, C.gray, 'normal'));

  // \u2500\u2500 P5: QR code in cartiglio (in basso a destra) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const qrData = `${cartCommittente || 'FV'} | ${P_kwp.toFixed(2)}kWp | ${cartNumDisegno || '\u2014'} | ${new Date().getFullYear()}`;
  s.push(_svgQR(qrData, VW - 250, CY0 + 30, 200));
  s.push(T('QR \u2014 dati progetto', VW - 150, CY0 + 245, 14, C.gray, 'middle'));

  // \u2500\u2500 P6: Sezione MT (solo se tensione connessione = MT) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  if (isMT) {
    _renderMTSection(s, YY, XC, C, P_kwp, I_AC);
  }

  // \u2500\u2500 P4: Vista semplificata \u2014 overlay testo esplicativo \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  if (simplifiedMode) {
    // In modalit\u00e0 semplificata mostra solo l'overview senza i dettagli tecnici
    s.push(`<rect x="0" y="0" width="${VW}" height="${VH - 340}" fill="rgba(255,255,255,0.88)"/>`);
    s.push(TM('\u22a1 VISTA SEMPLIFICATA', VW/2, 80, 28, '#1e4aaa', '700'));
    // Freccia campo FV \u2192 inverter \u2192 rete
    const sy = [200, 480, 760, 1040, 1320, 1600, 1880];
    const labels = [
      `Campo FV \u2014 ${totPanels} moduli / ${P_kwp.toFixed(2)} kWp`,
      `Cavi DC H1Z2Z2-K ${S_str}mm\u00b2 (2\u00d7)`,
      `Quadro DC \u2014 Fusibili${needsFuse?' gPV':' non richiesti'} \u2014 SEZ`,
      `Inverter${_inverterList.length>1?' ('+_inverterList.length+' unit\u00e0)':''} \u2014 ${P_pac_tot.toFixed(1)} kW AC`,
      `Cavi AC FG7OR ${S_AC_calc}mm\u00b2 \u2014 ${sysLbl}`,
      `Quadro BT \u2014 MCB/RCD/SPD`,
      `Rete ${isMT?'MT 20kV':sysLbl} \u2014 DSO`,
    ];
    let ay = 140;
    labels.forEach((lbl, i) => {
      const isComp = [0,2,3,5,6].includes(i);
      s.push(`<rect x="${VW/2-340}" y="${ay}" width="680" height="64" rx="10" fill="${isComp?'#eff6ff':'#fff'}" stroke="${isComp?'#1e4aaa':'#aaa'}" stroke-width="${isComp?2:1}"/>`);
      s.push(`<text x="${VW/2}" y="${ay+38}" text-anchor="middle" font-size="${isComp?22:18}" fill="${isComp?'#1e4aaa':'#555'}" font-weight="${isComp?'700':'400'}">${lbl}</text>`);
      if (i < labels.length-1) {
        s.push(`<line x1="${VW/2}" y1="${ay+64}" x2="${VW/2}" y2="${ay+96}" stroke="#888" stroke-width="2" marker-end="url(#arrow)"/>`);
        ay += 96;
      }
    });
    // Defs per la freccia
    s.push(`<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#888"/></marker></defs>`);
  }

  s.push('</svg>');

  container.innerHTML = s.join('');
  // Aggiorna la sezione verifiche elettriche separata
  _renderVerifiche();
}

let _bessMode = false;
let _bessTopology = 'ac'; // 'ac' | 'dc'
function toggleBessMode() {
  _bessMode = !_bessMode;
  const btn = document.getElementById('bessModeBtn');
  if (btn) btn.textContent = _bessMode ? '🔋 BESS ON' : '🔋 BESS OFF';
  // Mostra/nascondi selettore topologia
  const topSel = document.getElementById('bessTopologySel');
  if (topSel) topSel.style.display = _bessMode ? 'inline-block' : 'none';
  renderUnifilare();
}

// ── P3: Hover evidenziazione stringa ─────────────────────────────────────
function _sldHoverStr(sx, strY, bw, bh, cassY, si, name, voc, isc, sMm2) {
  _sldClearHover();
  const svg = document.querySelector('#unifilareContainer svg');
  if (!svg) return;
  // Overlay: evidenzia il percorso DC con una linea spessa semi-trasparente
  const ov = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  ov.setAttribute('id', 'sldHoverOv');
  ov.setAttribute('x', sx - bw/2 - 6);
  ov.setAttribute('y', strY - 6);
  ov.setAttribute('width', bw + 12);
  ov.setAttribute('height', cassY + bh + 12);
  ov.setAttribute('rx', '8');
  ov.setAttribute('fill', 'rgba(234,179,8,0.12)');
  ov.setAttribute('stroke', '#ca8a04');
  ov.setAttribute('stroke-width', '3');
  ov.setAttribute('pointer-events', 'none');
  svg.appendChild(ov);
  // Tooltip informativo
  const tip = document.getElementById('sldHoverTip') || (() => {
    const d = document.createElement('div');
    d.id = 'sldHoverTip';
    d.style.cssText = 'position:fixed;background:#1a1a1a;color:#fff;padding:8px 12px;border-radius:6px;font-size:12px;pointer-events:none;z-index:9998;line-height:1.5;';
    document.body.appendChild(d);
    return d;
  })();
  tip.innerHTML = `<b>Stringa ${name}</b><br>Voc: ${voc} V &nbsp; Isc: ${isc} A<br>Cavo: H1Z2Z2-K 2×${sMm2}mm²`;
  tip.style.display = 'block';
  const onMove = e => { tip.style.left=(e.clientX+14)+'px'; tip.style.top=(e.clientY-10)+'px'; };
  document.addEventListener('mousemove', onMove);
  tip._moveHandler = onMove;
}
function _sldClearHover() {
  const ov = document.getElementById('sldHoverOv');
  if (ov) ov.remove();
  const tip = document.getElementById('sldHoverTip');
  if (tip) { tip.style.display='none'; if (tip._moveHandler) { document.removeEventListener('mousemove', tip._moveHandler); tip._moveHandler=null; } }
}

function _showSldPopup(componentId, x, y) {
  let existing = document.getElementById('sldPopup');
  if (existing) existing.remove();

  const popupData = {
    'qbt': { title: 'Quadro BT Produzione FV', norm: 'CEI EN 61439-1/2, CEI 64-8', items: ['MCB: In ≥ Iac × 1.25', 'RCD: 300mA tipo A o B', 'SPD AC: Tipo T2, OVC II'] },
    'spi': { title: 'SPI — Protezione Interfaccia', norm: 'CEI 0-21:2025 All.A, §8.2', items: ['59.S1/S2: sovratensione', '27.S1/S2: sottotensione', '81>/81<: sovrfreq./sottofreq.', 'LVRT/HVRT: ride-through (>6kW)'] },
    'ddi': { title: 'DDI — Disp. Interfaccia', norm: 'CEI 0-21:2025 §6.2', items: ['Motorizzato (apertura su comando SPI)', 'In ≥ Iac × 1.3', '4 poli (L1,L2,L3,N)'] },
    'cnt': { title: 'Contatore Scambio SSP', norm: 'CEI 0-21:2025 §5.1, DM 06/08/2020', items: ['Bidirezionale 2G teleleggibile', 'Obbligatorio per TUTTI gli impianti FV', 'Trifase obbligatorio se Pac > 6 kW'] },
    'cassetta': { title: 'Quadro DC (Cassetta Stringhe)', norm: 'IEC 62548 §6, CEI 64-8 sez.712', items: ['Sezionatore per stringa (CEI EN 60947-3)', 'Fusibili gPV se (n-1)×Isc > ISCR', 'SPD DC: Uc ≥ 1.25×Voc(Tmin)', 'OVC III'] },
    'inverter': { title: 'Inverter FV', norm: 'CEI EN 62109-1/2, CEI 0-21:2025', items: ['Q(U): regolazione reattiva su tensione', 'cosφ(P): fattore pot. su potenza', 'LVRT/HVRT se Pac > 6 kW', 'Protezione: 59/27/81>/81<'] },
    'bess':     { title: 'BESS — Accumulo AC-coupled', norm: 'CEI EN 62933-1, IEC 62619, CEI 0-21:2025 §12', items: ['Inverter bidirezionale dedicato', 'BMS con OVP·UVP·OCP·OTP·SCP (IEC 62619)', 'SPD DC lato batteria: Uc≥1.25×Vbat_max', 'DDI dedicato lato AC batteria', 'Modalità: self-consumption / backup / peak-shaving', 'Certificazione: IEC 62619 o UN 38.3'] },
    'rete':     { title: 'Rete DSO', norm: 'CEI 0-21:2025, CEI EN 50160', items: ['Tensione nominale ±10% (EN 50160)', 'Frequenza 50 Hz ±1%', 'Il DSO può richiedere curva Q(U)', 'Disconnessione su comando SPI'] },
  };

  const data = popupData[componentId] || { title: componentId, norm: '—', items: [] };
  const div = document.createElement('div');
  div.id = 'sldPopup';
  div.style.cssText = `position:fixed;left:${Math.min(x, window.innerWidth-320)}px;top:${Math.min(y, window.innerHeight-200)}px;width:300px;background:#fff;border:1.5px solid #1e4aaa;border-radius:8px;padding:12px;z-index:9999;box-shadow:0 4px 24px rgba(0,0,0,0.18);font-size:13px;`;
  div.innerHTML = `
    <div style="font-weight:700;color:#1e4aaa;font-size:14px;margin-bottom:4px;">${data.title}</div>
    <div style="color:#888;font-size:11px;margin-bottom:8px;">${data.norm}</div>
    <ul style="margin:0;padding-left:16px;">
      ${data.items.map(i=>`<li style="margin-bottom:3px;">${i}</li>`).join('')}
    </ul>
    <button onclick="document.getElementById('sldPopup').remove()" style="margin-top:8px;font-size:11px;padding:3px 10px;background:#1e4aaa;color:#fff;border:none;border-radius:4px;cursor:pointer;">Chiudi</button>
  `;
  document.body.appendChild(div);
  setTimeout(()=>{ document.addEventListener('click', function _cl(e){if(!div.contains(e.target)){div.remove();document.removeEventListener('click',_cl);}},{ once:false }); },100);
}

function addRevisione() {
  const list = document.getElementById('revisioniList');
  if (!list) return;
  const idx = list.children.length;
  if (idx >= 5) { showToast('Massimo 5 revisioni', 'warn'); return; }
  const div = document.createElement('div');
  div.style.cssText = 'display:grid;grid-template-columns:60px 120px 1fr auto;gap:4px;margin-bottom:4px;';
  div.innerHTML = `
    <input type="text" class="field-input" id="rev0${idx}_num" placeholder="Rev" value="0${idx}" style="font-size:11px;" oninput="renderUnifilareDebounced()">
    <input type="text" class="field-input" id="rev0${idx}_data" placeholder="Data" style="font-size:11px;" oninput="renderUnifilareDebounced()">
    <input type="text" class="field-input" id="rev0${idx}_desc" placeholder="Descrizione modifica" style="font-size:11px;" oninput="renderUnifilareDebounced()">
    <button onclick="this.parentElement.remove();renderUnifilare();" style="padding:2px 6px;font-size:11px;background:#dc2626;color:#fff;border:none;border-radius:3px;cursor:pointer;">✕</button>
  `;
  list.appendChild(div);
  renderUnifilare();
}

// ── P4: Toggle vista semplificata / dettagliata ───────────────────────────
let _simplifiedMode = false;
function toggleSldMode() {
  _simplifiedMode = !_simplifiedMode;
  const btn = document.getElementById('sldModeBtn');
  if (btn) btn.textContent = _simplifiedMode ? '⊡ Vista semplice' : '⊞ Vista completa';
  renderUnifilare();
}

// ── P5: QR code nel cartiglio SVG (placeholder visivo v1) ─────────────────
function _svgQR(data, x, y, size) {
  const s = [];
  const cs = size / 21;
  const fp = (cx, cy) => {
    s.push(`<rect x="${cx}" y="${cy}" width="${7*cs}" height="${7*cs}" fill="none" stroke="#1a1a1a" stroke-width="${cs*0.8}"/>`);
    s.push(`<rect x="${cx+2*cs}" y="${cy+2*cs}" width="${3*cs}" height="${3*cs}" fill="#1a1a1a"/>`);
  };
  fp(x, y); fp(x+14*cs, y); fp(x, y+14*cs);
  for (let i=8;i<13;i+=2) {
    s.push(`<rect x="${x+i*cs}" y="${y+6*cs}" width="${cs}" height="${cs}" fill="#1a1a1a"/>`);
    s.push(`<rect x="${x+6*cs}" y="${y+i*cs}" width="${cs}" height="${cs}" fill="#1a1a1a"/>`);
  }
  let hash = 0; for (let i=0;i<data.length;i++) hash = (hash*31+data.charCodeAt(i))&0xFFFFFF;
  for (let r=0;r<21;r++) for (let c=0;c<21;c++) {
    if ((r<9&&c<9)||(r<9&&c>11)||(r>11&&c<9)) continue;
    const bit = ((hash ^ (r*21+c)*2654435761)>>>4)&1;
    if (bit) s.push(`<rect x="${x+c*cs}" y="${y+r*cs}" width="${cs*0.9}" height="${cs*0.9}" fill="#1a1a1a"/>`);
  }
  s.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="none" stroke="#1a1a1a" stroke-width="${cs*0.3}"/>`);
  return s.join('');
}

// ── P6: Schema MT (CEI 0-16) ─────────────────────────────────────────────
function _renderMTSection(s, YY, XC, C, P_kwp, I_AC) {
  // helper inline (closure su C)
  const TF_Y = YY.rete + 80;
  const TF_W = 280, TF_H = 200;
  s.push(`<rect x="${XC-TF_W/2}" y="${TF_Y}" width="${TF_W}" height="${TF_H}" rx="8" fill="#fefce8" stroke="#b45309" stroke-width="2"/>`);
  s.push(`<text x="${XC}" y="${TF_Y+32}" text-anchor="middle" font-size="22" fill="#b45309" font-weight="700">TR — Trafo MT/BT</text>`);
  const tcx = XC, tcy = TF_Y+100, tr = 30;
  s.push(`<circle cx="${tcx-tr*0.6}" cy="${tcy}" r="${tr}" fill="none" stroke="#b45309" stroke-width="2.5"/>`);
  s.push(`<circle cx="${tcx+tr*0.6}" cy="${tcy}" r="${tr}" fill="none" stroke="#b45309" stroke-width="2.5"/>`);
  const kva = Math.ceil(P_kwp*1.25/50)*50;
  s.push(`<text x="${XC}" y="${TF_Y+160}" text-anchor="middle" font-size="18" fill="#92400e">Ptr: ${kva} kVA · 20kV/0.4kV · Dyn11</text>`);
  s.push(`<text x="${XC}" y="${TF_Y+180}" text-anchor="middle" font-size="16" fill="#a16207">Classe E3-C2-F1 · CEI EN 60076-1</text>`);
  s.push(`<line x1="${XC}" y1="${YY.rete}" x2="${XC}" y2="${TF_Y}" stroke="${C.ac}" stroke-width="2.5"/>`);
  const MT_Y = TF_Y+TF_H+40, MT_W = 320, MT_H = 220;
  s.push(`<rect x="${XC-MT_W/2}" y="${MT_Y}" width="${MT_W}" height="${MT_H}" rx="8" fill="#f0f9ff" stroke="#0e7490" stroke-width="2"/>`);
  s.push(`<text x="${XC}" y="${MT_Y+30}" text-anchor="middle" font-size="22" fill="#0e7490" font-weight="700">Cabina di Consegna MT</text>`);
  s.push(`<text x="${XC}" y="${MT_Y+56}" text-anchor="middle" font-size="16" fill="#155e75">CEI 0-16:2022 · CEI EN 62271-200</text>`);
  const mtItems = [
    '─ Cella arrivo linea (sez. sotto carico)',
    '─ Cella misure (TA+TV — contatore fiscale)',
    '─ Protezione DG/MT (59/27/67N/81)',
    '─ 59Vo ESCLUSA per impianti FV (CEI 0-16 §8.5.3)',
    `─ Corrente nom.: ${(P_kwp*1000/(Math.sqrt(3)*20000)).toFixed(1)} A a 20 kV`,
  ];
  mtItems.forEach((it, i) => {
    s.push(`<text x="${XC-MT_W/2+16}" y="${MT_Y+90+i*26}" text-anchor="start" font-size="16" fill="#0c4a6e">${it}</text>`);
  });
  s.push(`<line x1="${XC}" y1="${TF_Y+TF_H}" x2="${XC}" y2="${MT_Y}" stroke="#b45309" stroke-width="3"/>`);
  s.push(`<text x="${XC+16}" y="${TF_Y+TF_H+20}" text-anchor="start" font-size="16" fill="#92400e">Cavo MT: RG7H1R 12/20kV</text>`);
  // ── P6: Protezione 67N — calcolo corrente capacitiva ───────────────────
  // Stima C0 per linea BT/MT in cavo: ~0.3 µF/km (tipico per cavo MT)
  const lenMT_km = 0.1; // stima 100m default
  const C0_uF = 0.3 * lenMT_km;  // µF
  const C0    = C0_uF * 1e-6;    // F
  const omega = 2 * Math.PI * 50;
  const V_fase_MT = 20000 / Math.sqrt(3);
  const Ic_67N    = 3 * omega * C0 * V_fase_MT;  // A
  const needs67N  = Ic_67N > 2.0;
  s.push(`<rect x="${XC-MT_W/2}" y="${MT_Y+MT_H+10}" width="${MT_W}" height="${needs67N?70:50}" rx="5" fill="${needs67N?'#fef2f2':'#f0fdf4'}" stroke="${needs67N?'#dc2626':'#16a34a'}" stroke-width="1.5"/>`);
  s.push(`<text x="${XC}" y="${MT_Y+MT_H+34}" text-anchor="middle" font-size="16" fill="${needs67N?'#dc2626':'#16a34a'}" font-weight="700">Protezione 67N: ${needs67N?'RICHIESTA':'non necessaria'}</text>`);
  s.push(`<text x="${XC}" y="${MT_Y+MT_H+54}" text-anchor="middle" font-size="14" fill="#555">Ic = ${Ic_67N.toFixed(2)} A ${needs67N?'> 2A — relè 67N su cella MT':'≤ 2A — CEI 0-16 §8.5.4'}</text>`);
  if (needs67N) {
    s.push(`<text x="${XC}" y="${MT_Y+MT_H+70}" text-anchor="middle" font-size="13" fill="#b45309">Soglia e t intervento secondo accordo DSO</text>`);
  }

  // ── P6: Dimensionamento cavo MT ─────────────────────────────────────────
  const I_MT = P_kwp * 1000 / (Math.sqrt(3) * 20000);
  const S_MT = I_MT < 0.7 ? 'RG7H1R 12/20kV 3×25mm²' : I_MT < 1.5 ? 'RG7H1R 12/20kV 3×50mm²' : 'RG7H1R 12/20kV 3×95mm²';
  s.push(`<text x="${XC+16}" y="${TF_Y+TF_H+38}" text-anchor="start" font-size="15" fill="#a16207">${S_MT} (In=${I_MT.toFixed(1)}A)</text>`);
  s.push(`<text x="${XC+16}" y="${TF_Y+TF_H+54}" text-anchor="start" font-size="13" fill="#a16207">CEI 11-17 · CEI UNEL 35026</text>`);

  if (P_kwp > 20) {
    s.push(`<text x="${XC+MT_W/2+20}" y="${MT_Y+34}" text-anchor="start" font-size="14" fill="#b45309">⚠ P > 20 kW:</text>`);
    s.push(`<text x="${XC+MT_W/2+20}" y="${MT_Y+52}" text-anchor="start" font-size="14" fill="#b45309">Rincalzo DDI obbl.</text>`);
    s.push(`<text x="${XC+MT_W/2+20}" y="${MT_Y+70}" text-anchor="start" font-size="13" fill="#b45309">CEI 0-21 §8.6.4</text>`);
  }

  // Contatore fiscale MT (obbligatorio >20kWp — D.Lgs. 504/95 UTIF)
  const cnt_y = MT_Y + (P_kwp > 20 ? 100 : 40);
  s.push(`<rect x="${XC+MT_W/2+20}" y="${cnt_y}" width="280" height="90" rx="5" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>`);
  s.push(`<text x="${XC+MT_W/2+160}" y="${cnt_y+26}" text-anchor="middle" font-size="17" fill="#15803d" font-weight="700">Contatore fiscale MT</text>`);
  s.push(`<text x="${XC+MT_W/2+160}" y="${cnt_y+48}" text-anchor="middle" font-size="14" fill="#166534">UTF/Dogane · TA cl. 0.5 · TV cl. 0.5</text>`);
  s.push(`<text x="${XC+MT_W/2+160}" y="${cnt_y+68}" text-anchor="middle" font-size="13" fill="#166534">D.Lgs. 504/95 · Teleleggibile</text>`);
  s.push(`<text x="${XC+MT_W/2+160}" y="${cnt_y+84}" text-anchor="middle" font-size="12" fill="#4ade80">Obbl. per P > 20 kWp</text>`);

  // Rete MT DSO
  const RETEMT_Y = MT_Y + MT_H + (needs67N ? 95 : 75);
  s.push(`<line x1="${XC}" y1="${MT_Y+MT_H}" x2="${XC}" y2="${RETEMT_Y}" stroke="#0e7490" stroke-width="3"/>`);
  s.push(`<rect x="${XC-220}" y="${RETEMT_Y}" width="440" height="54" rx="6" fill="#e0f2fe" stroke="#0e7490" stroke-width="1.5"/>`);
  s.push(`<text x="${XC}" y="${RETEMT_Y+30}" text-anchor="middle" font-size="20" fill="#0e7490" font-weight="700">Rete MT DSO — 20 kV</text>`);
  s.push(`<text x="${XC}" y="${RETEMT_Y+48}" text-anchor="middle" font-size="14" fill="#155e75">CEI 0-16:2022 · Norma di connessione</text>`);
}
