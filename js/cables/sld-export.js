// ── js/cables/sld-export.js — SLD export pipelines ──
// Extracted from cables.js in AP-15b. SVG → PNG/SVG file download (
// exportUnifilare) and GSE/GAUDÌ CSV writer (exportGSE). Reads SVG that
// renderUnifilare populated into #unifilareContainer. Calling surface
// unchanged — all symbols remain available through bundle-scope globals.

'use strict';

function exportUnifilare(fmt) {
  const container = document.getElementById('unifilareContainer');
  if (!container) return;
  const svg = container.querySelector('svg');
  if (!svg) return;

  if (fmt === 'png') {
    // Export PNG at 2× resolution (A4 @ ~192dpi)
    const W = 794, H = 1123, SCALE = 2;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], {type:'image/svg+xml;charset=utf-8'});
    const url  = URL.createObjectURL(blob);
    const img  = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width  = W * SCALE;
      c.height = H * SCALE;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.scale(SCALE, SCALE);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      c.toBlob(pngBlob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(pngBlob);
        a.download = 'schema-unifilare.png';
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      }, 'image/png');
    };
    img.src = url;
  } else {
    // Export SVG
    const blob = new Blob([svg.outerHTML], {type: 'image/svg+xml'});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'schema-unifilare.svg';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }
}

function exportGSE() {
  const g = id => parseFloat((document.getElementById(id)||{value:'0'}).value)||0;
  const gs2 = id => (document.getElementById(id)||{value:''}).value||'';
  const totPanels = panels.length;
  const pp = parseInt((DOM.pp||{value:'400'}).value)||400;
  const P_kwp = totPanels * pp / 1000;
  const sysAC = gs2('cableSystemAC')||'mono';
  const V_AC = sysAC==='mono'?230:400;
  const rows = [
    ['Campo', 'Valore', 'Unità'],
    ['Potenza picco FV', P_kwp.toFixed(2), 'kWp'],
    ['Potenza inverter totale', (_inverterList.reduce((a,i)=>a+i.pac*i.qty,0)||g('invPac')).toFixed(2), 'kW'],
    ['Tensione connessione', V_AC, 'V'],
    ['Sistema', sysAC==='mono'?'Monofase':'Trifase', ''],
    ['N° moduli totali', totPanels, ''],
    ['Potenza modulo', pp, 'Wp'],
    ['Marca modulo', gs2('moduleBrand')||'—', ''],
    ['Modello modulo', gs2('moduleModel')||'—', ''],
    ['Voc modulo', g('moduleVoc'), 'V'],
    ['Isc modulo', g('moduleIsc'), 'A'],
    ['Committente', gs2('cartCommittente'), ''],
    ['Indirizzo impianto', gs2('cartIndirizzo'), ''],
    ['Progettista', gs2('cartProgettista'), ''],
    ['N° disegno', gs2('cartNumDisegno'), ''],
  ];
  // Aggiungi inverter dal parco
  _inverterList.forEach((inv, i) => {
    rows.push([`Inverter ${i+1} — Marca`, inv.brand||'—', '']);
    rows.push([`Inverter ${i+1} — Modello`, inv.model||'—', '']);
    rows.push([`Inverter ${i+1} — Pac`, inv.pac, 'kW']);
    rows.push([`Inverter ${i+1} — Quantità`, inv.qty, '']);
  });
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(';')).join('\r\n');
  const blob = new Blob(['﻿'+csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `GSE_GAUDI_${gs2('cartNumDisegno')||'impianto'}.csv`;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
  showToast('File CSV per GSE/GAUDÌ esportato', 'info');
}


