// ── pdf.js — Caricamento e gestione PDF ──

'use strict';

// CARICAMENTO FILE (immagine / PDF)
function loadFile(e) {
  const f = e.target.files[0];
  if (!f) return;
  e.target.value = ''; // reset so same file can be re-selected
  const isPDF = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
  if (isPDF) {
    loadPDF(f);
  } else {
    loadImageFile(f);
  }
}

function loadImageFile(f) {
  // Resetta snap PDF dal documento precedente
  _pdfDoc = null; _pdfSnapPoints = []; _pdfSnapEnabled = false;
  if (DOM.pdfSnapToggle) { DOM.pdfSnapToggle.classList.remove('snap-on'); DOM.pdfSnapToggle.style.display = 'none'; }
  const r = new FileReader();
  r.onload = ev => {
    const i = new Image();
    i.onload = () => {
      img = i;
      resetView();
      DOM.welcome.classList.add('hidden');
      DOM.compass.classList.add('visible');
      DOM.fileStatus.textContent = '';
      enable('s2');
      draw();
    };
    i.src = ev.target.result;
  };
  r.readAsDataURL(f);
}

function loadPDF(file) {
  const status = DOM.fileStatus;
  status.textContent = '⏳ Caricamento PDF…';
  _ensurePdfJs().then(() => {
    const reader = new FileReader();
    reader.onload = ev => {
      const typedArr = new Uint8Array(ev.target.result);
      pdfjsLib.getDocument({ data: typedArr }).promise.then(pdfDoc => {
        _pdfDoc = pdfDoc;
        _pdfPage = 1;
        status.textContent = `PDF ${pdfDoc.numPages} pag.`;
        if (pdfDoc.numPages === 1) {
          _renderPdfPageToImg(_pdfPage).then(imgEl => {
            img = imgEl;
            resetView();
            DOM.welcome.classList.add('hidden');
            DOM.compass.classList.add('visible');
            enable('s2');
            draw();
          });
        } else {
          _openPdfModal();
        }
      }).catch(err => {
        const errMsg = (err && err.message) ? err.message.toLowerCase() : String(err).toLowerCase();
        let friendlyMsg;
        if (errMsg.includes('password')) {
          friendlyMsg = 'PDF protetto da password - non supportato';
        } else if (errMsg.includes('invalid pdf') || errMsg.includes('corrupt')) {
          friendlyMsg = 'PDF danneggiato o non valido';
        } else {
          friendlyMsg = 'Errore caricamento PDF. Prova con un altro file o converti in JPG/PNG';
        }
        status.textContent = ' ' + friendlyMsg;
        showToast(friendlyMsg, 'error', 5000);
        console.error('PDF load error:', err);
      });
    };
    reader.readAsArrayBuffer(file);
  }).catch(() => {
    status.textContent = ' Impossibile caricare pdf.js (verifica connessione)';
  });
}

function _ensurePdfJs() {
  if (window.pdfjsLib) return Promise.resolve();
  const CDN = 'vendor/pdfjs/';
  const loadScript = src => new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
  return loadScript(CDN + 'pdf.min.js')
    .then(() => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = CDN + 'pdf.worker.min.js';
      return loadScript(CDN + 'pdf.worker.min.js');
    });
}

// ── PDF snap helpers — estratte a livello modulo per evitare ri-creazione ad ogni page render ──
function _pdfProcessOps(fnArray, argsArray, ctm, POPS, addPt) {
  let curCTM = ctm ? [...ctm] : null;
  for (let k = 0; k < fnArray.length; k++) {
    const fn = fnArray[k];
    const args = argsArray[k];
    if (fn === POPS.constructPath || fn === undefined) continue;
    if (fn === POPS.moveTo || fn === POPS.lineTo) {
      if (args && args.length >= 2) addPt(args[0], args[1], curCTM);
    } else if (fn === POPS.curveTo) {
      if (args && args.length >= 6) { addPt(args[4], args[5], curCTM); }
    } else if (fn === POPS.curveTo2) {
      if (args && args.length >= 4) addPt(args[2], args[3], curCTM);
    } else if (fn === POPS.curveTo3) {
      if (args && args.length >= 4) addPt(args[2], args[3], curCTM);
    } else if (fn === POPS.rectangle) {
      if (args && args.length >= 4) {
        const [rx, ry, rw, rh] = args;
        addPt(rx, ry, curCTM); addPt(rx+rw, ry, curCTM);
        addPt(rx+rw, ry+rh, curCTM); addPt(rx, ry+rh, curCTM);
      }
    } else if (fn === POPS.transform) {
      if (args && args.length >= 6) {
        const [a,b,c,d,e,f] = args;
        if (curCTM) {
          curCTM = [
            a*curCTM[0]+b*curCTM[2], a*curCTM[1]+b*curCTM[3],
            c*curCTM[0]+d*curCTM[2], c*curCTM[1]+d*curCTM[3],
            e*curCTM[0]+f*curCTM[2]+curCTM[4], e*curCTM[1]+f*curCTM[3]+curCTM[5]
          ];
        } else {
          curCTM = [a,b,c,d,e,f];
        }
      }
    }
  }
}

function _pdfProcessConstructPath(fnArray, argsArray, ctm, POPS, addPt) {
  for (let k = 0; k < fnArray.length; k++) {
    const fn = fnArray[k];
    const args = argsArray[k];
    if (fn === POPS.constructPath && args) {
      const subOps = args[0];
      const coords = args[1];
      let ci = 0;
      for (let s = 0; s < subOps.length; s++) {
        const sop = subOps[s];
        if (sop === POPS.moveTo || sop === POPS.lineTo) {
          if (ci+1 < coords.length) { addPt(coords[ci], coords[ci+1], ctm); ci+=2; }
        } else if (sop === POPS.curveTo) {
          if (ci+5 < coords.length) { addPt(coords[ci+4], coords[ci+5], ctm); ci+=6; }
        } else if (sop === POPS.rectangle) {
          if (ci+3 < coords.length) {
            addPt(coords[ci], coords[ci+1], ctm);
            addPt(coords[ci]+coords[ci+2], coords[ci+1], ctm);
            addPt(coords[ci]+coords[ci+2], coords[ci+1]+coords[ci+3], ctm);
            addPt(coords[ci], coords[ci+1]+coords[ci+3], ctm);
            ci+=4;
          }
        }
      }
    }
  }
}

function _renderPdfPageToImg(pageNum) {
  return _pdfDoc.getPage(pageNum).then(page => {
    const viewport = page.getViewport({ scale: _pdfScale });
    const offCanvas = document.createElement('canvas');
    offCanvas.width = Math.round(viewport.width);
    offCanvas.height = Math.round(viewport.height);
    const ctx2 = offCanvas.getContext('2d');
    return page.render({ canvasContext: ctx2, viewport }).promise.then(() => {
      const i = new Image();
      i.width = offCanvas.width;
      i.height = offCanvas.height;
      i.src = offCanvas.toDataURL('image/png');
      // ── Extract vector snap points from PDF path operators ──
      page.getOperatorList().then(async ops => {
        _pdfSnapPoints = [];
        const POPS = pdfjsLib.OPS;

        const addPt = (px, py, xf) => {
          let wx, wy;
          if (xf) {
            wx = xf[0]*px + xf[2]*py + xf[4];
            wy = xf[1]*px + xf[3]*py + xf[5];
          } else {
            wx = px; wy = py;
          }
          const t = viewport.transform;
          const cx = t[0]*wx + t[2]*wy + t[4];
          const cy = t[1]*wx + t[3]*wy + t[5];
          if (!Number.isFinite(cx) || !Number.isFinite(cy)) return;
          if (cx < -10 || cy < -10 || cx > offCanvas.width+10 || cy > offCanvas.height+10) return;
          // Converti subito in world coords (non dipende da img al momento dello snap)
          if (img) _pdfSnapPoints.push({wx: cx - img.width/2, wy: cy - img.height/2});
        };

        _pdfProcessOps(ops.fnArray, ops.argsArray, null, POPS, addPt);
        _pdfProcessConstructPath(ops.fnArray, ops.argsArray, null, POPS, addPt);

        // Deduplicate: remove points within 1.5px of each other — O(n) with spatial grid
        const CELL = 3; // bucket size in px (> 2× threshold of 1.5)
        const gridMap = new Map();
        const deduped = [];
        _pdfSnapPoints.forEach(p => {
          const bx = Math.floor(p.wx / CELL);
          const by = Math.floor(p.wy / CELL);
          let found = false;
          for (let dx = -1; dx <= 1 && !found; dx++) {
            for (let dy = -1; dy <= 1 && !found; dy++) {
              const key = (bx+dx) + '|' + (by+dy);
              if (gridMap.has(key)) found = true;
            }
          }
          if (!found) {
            gridMap.set(bx + '|' + by, true);
            deduped.push(p);
          }
        });
        _pdfSnapPoints = deduped;

        // Show snap toggle — always visible when PDF is loaded, show count
        const snapToggle = DOM.pdfSnapToggle;
        if (snapToggle) {
          snapToggle.style.display = 'inline-flex';
          snapToggle.title = `Snap PDF: ${_pdfSnapPoints.length} vertici rilevati`;
          snapToggle.style.display = 'inline-flex';
          const lbl1 = document.getElementById('pdfSnapLabel');
          if (lbl1) lbl1.textContent = `Snap PDF (${_pdfSnapPoints.length})`;
        }
      }).catch(err => {
        console.warn('PDF snap extraction failed:', err);
        _pdfSnapPoints = [];
        const snapToggle = DOM.pdfSnapToggle;
        if (snapToggle) {
          snapToggle.style.display = 'inline-flex';
          snapToggle.title = 'Snap PDF: errore estrazione vertici';
          const lbl2 = document.getElementById('pdfSnapLabel');
          if (lbl2) lbl2.textContent = 'Snap PDF (0)';
        }
      });
      return new Promise(res => { i.onload = () => res(i); });
    });
  });
}

function _openPdfModal() {
  _pdfPage = 1;
  _updatePdfThumb();
  DOM.pdfPageModal.classList.add('visible');
}

function closePdfModal() {
  DOM.pdfPageModal.classList.remove('visible');
  const fi = DOM.imgFile;
  if (fi) fi.value = '';
  DOM.fileStatus.textContent = '';
}

function pdfPageNav(delta) {
  if (!_pdfDoc) return;
  _pdfPage = Math.max(1, Math.min(_pdfDoc.numPages, _pdfPage + delta));
  _updatePdfThumb();
}

function _updatePdfThumb() {
  if (!_pdfDoc) return;
  const label = DOM.pdfPageLabel;
  const dpiInfo = DOM.pdfDpiInfo;
  label.textContent = `Pagina ${_pdfPage} / ${_pdfDoc.numPages}`;
  _pdfDoc.getPage(_pdfPage).then(page => {
    const vpFull = page.getViewport({ scale: 1 });
    const thumbScale = Math.min(2, 300 / Math.max(vpFull.width, vpFull.height));
    const vp = page.getViewport({ scale: thumbScale });
    const tc = DOM.pdfThumb;
    tc.width = Math.round(vp.width);
    tc.height = Math.round(vp.height);
    page.render({ canvasContext: tc.getContext('2d'), viewport: vp }).promise.then(() => {
      const fullW = Math.round(vpFull.width * _pdfScale);
      const fullH = Math.round(vpFull.height * _pdfScale);
      dpiInfo.textContent = `Risoluzione finale: ${fullW} × ${fullH} px`;
    });
  });
}

function confirmPdfPage() {
  DOM.pdfPageModal.classList.remove('visible');
  const status = DOM.fileStatus;
  status.textContent = '⏳ Rendering pagina…';
  _renderPdfPageToImg(_pdfPage).then(imgEl => {
    img = imgEl;
    resetView();
    DOM.welcome.classList.add('hidden');
    DOM.compass.classList.add('visible');
    status.textContent = `PDF pag. ${_pdfPage}/${_pdfDoc.numPages}`;
    enable('s2');
    draw();
  });
}

function togglePdfSnap() {
  _pdfSnapEnabled = !_pdfSnapEnabled;
  const btn = DOM.pdfSnapToggle;
  if (!btn) return;
  const lbl = document.getElementById('pdfSnapLabel');
  if (_pdfSnapEnabled) {
    btn.classList.add('snap-on');
    if (lbl) lbl.textContent = `Snap PDF (${_pdfSnapPoints.length})`;
    btn.title = `Snap PDF attivo — ${_pdfSnapPoints.length} vertici`;
  } else {
    btn.classList.remove('snap-on');
    if (lbl) lbl.textContent = `Snap PDF`;
    btn.title = 'Snap PDF disattivo';
  }
  draw();
}
