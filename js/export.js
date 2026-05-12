// ── export.js — Esportazione PDF, JSON, stampa ──

'use strict';

/** Salva il progetto come file .sdproj (formato sdproj/1) tramite system
 *  dialog. Auto-save in localStorage continua a funzionare come recovery
 *  snapshot. Vedi docs/sdproj-schema.md. */
async function salvaProgetto() {
  _persistState(); // recovery snapshot
  const doc  = buildSdprojDocument();
  const json = JSON.stringify(doc, null, 2);
  const dt   = new Date().toISOString().slice(0, 10);
  const safeName = (doc.metadata.projectName || 'progetto-fv').replace(/[^a-zA-Z0-9._-]+/g, '_');
  const suggestedName = safeName + '-' + dt + '.sdproj';
  if (window.showSaveFilePicker) {
    try {
      const fh = await window.showSaveFilePicker({
        suggestedName,
        types: [{ description: 'Progetto Solar Designer (.sdproj)', accept: { 'application/json': ['.sdproj'] } }]
      });
      const w = await fh.createWritable();
      await w.write(json); await w.close();
      showToast('Progetto salvato ✓', 'success', 2000);
      return;
    } catch(e) { if (e.name === 'AbortError') return; }
  }
  // Fallback: download classico
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = suggestedName;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  showToast('Progetto salvato ✓', 'success', 2000);
}

/** Esporta il progetto come file JSON (solo download, senza salvare su localStorage). */
async function saveProjectJSON() {
  const state = _buildFullState();
  const json  = JSON.stringify(state, null, 2);
  const dt    = new Date().toISOString().slice(0, 10);
  const suggestedName = 'progetto-fv-' + dt + '.json';
  if (window.showSaveFilePicker) {
    try {
      const fh = await window.showSaveFilePicker({
        suggestedName,
        types: [{ description: 'Progetto Solar Designer', accept: { 'application/json': ['.json'] } }]
      });
      const w = await fh.createWritable();
      await w.write(json); await w.close();
      showToast('File esportato ✓', 'success', 2000);
      return;
    } catch(e) { if (e.name === 'AbortError') return; }
  }
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = suggestedName;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  showToast('File esportato ✓', 'success', 2000);
}

/**
 * Carica un progetto da file JSON.
 * @param {Event} event - input file change event
 */
function loadProjectJSON(event) {
  const f=event.target.files[0];
  if (!f) return;
  const reader=new FileReader();
  reader.onload=ev=>{
    try {
      const raw=JSON.parse(ev.target.result);
      // Explicit file-open uses the shared reader in strict mode: no
      // versionless guessing. Surface unsupported / invalid as toast.
      const result = readPersistedProject(raw);
      if (result.kind === 'unsupported') {
        throw new Error('Formato non supportato (' + result.reason + '). Aggiorna l\'applicazione.');
      }
      if (result.kind === 'invalid') {
        throw new Error(result.reason);
      }
      const s = result.payload;
      if (result.metadata && typeof result.metadata.createdAt === 'string') {
        _setProjectCreatedAt(result.metadata.createdAt);
      }

      if(!Array.isArray(s.installableAreas))throw new Error('installableAreas mancante');
      if(!Array.isArray(s.panels))throw new Error('panels mancante');
      if(!Array.isArray(s.exclusionAreas))throw new Error('exclusionAreas mancante');
      scale=s.scale||1; panelOrientation=s.panelOrientation||'auto'; walkwaysEnabled=s.walkwaysEnabled||false;
      installableAreas=s.installableAreas.map(a=>({
        ...a,
        orientation:     a.orientation     || 'auto',
        staggerEnabled:  a.staggerEnabled  || false,
        staggerOffset:   a.staggerOffset   !== undefined ? a.staggerOffset : 50,
        walkwaysEnabled: a.walkwaysEnabled || false,
        walkwayInterval: a.walkwayInterval !== undefined ? a.walkwayInterval : 3,
        walkwayWidth:    a.walkwayWidth    !== undefined ? a.walkwayWidth   : 80,
        walkwayDir:      a.walkwayDir      || 'row',
        walkRowEnabled:  a.walkRowEnabled  || false,
        walkRowInterval: a.walkRowInterval !== undefined ? a.walkRowInterval : 3,
        walkRowWidth:    a.walkRowWidth    !== undefined ? a.walkRowWidth    : 80,
        walkColEnabled:  a.walkColEnabled  || false,
        walkColInterval: a.walkColInterval !== undefined ? a.walkColInterval : 3,
        walkColWidth:    a.walkColWidth    !== undefined ? a.walkColWidth    : 80,
      }));
      exclusionAreas=s.exclusionAreas||[];
      technicalObjects=s.technicalObjects||[]; strings=s.strings||[];
      panels=s.panels||[];
      _inverterList=s.inverterList||[];
      selectedPanels=new Set(); hoveredPanel=-1;
      if (s.moduleParams) {
        ['pw','pl','pp','ps','safetyMargin','obstacleDistance',
         'walkwayInterval','walkwayWidth','staggerOffset'].forEach(k=>{
          const el=document.getElementById(k);
          if (el && s.moduleParams[k] !== undefined) el.value=s.moduleParams[k];
        });
        if (s.moduleParams.enableStagger !== undefined) {
          DOM.enableStagger.checked = s.moduleParams.enableStagger;
          DOM.staggerSettings.style.display = s.moduleParams.enableStagger ? 'block' : 'none';
        }
      }
      if (s.calPts && s.calPts.length === 2) {
        calPts = s.calPts;
      }
      // Ripristina dati cartiglio schema unifilare
      if (s.cartiglio) {
        const cm = s.cartiglio;
        const _sv = (id, val) => { const el=document.getElementById(id); if(el&&val!==undefined) el.value=val; };
        _sv('cartCommittente',    cm.committente);
        _sv('cartIndirizzo',      cm.indirizzo);
        _sv('cartProgettista',    cm.progettista);
        _sv('cartAlbo',           cm.albo);
        _sv('cartNumDisegno',     cm.numDisegno);
        _sv('cartRevisione',      cm.revisione);
        _sv('cartSpiModello',     cm.spiModello);
        _sv('cartSpiMatricola',   cm.spiMatricola);
        _sv('cartSpiCertificato', cm.spiCertificato);
      }
      strings.forEach(str=>{
        str.panels=str.panels.map(sp=>{
          const live=panels.find(p=>p.areaIdx===sp.areaIdx&&p.row===sp.row&&p.column===sp.column);
          return live||sp;
        });
      });
      panels.forEach(p=>{
        const str=strings.find(s=>s.id===p.strId);
        if (str) p.stringColor=str.color;
      });
      if (installableAreas.length>0) ['s2','s3','s4','s5','s6'].forEach(id=>enable(id));
      if (installableAreas.length>0) { _updateToolbarGroups(); }
      if (panels.length>0) {
        enable('s7');enable('s8');
        if(DOM.deletePanelsBtn) DOM.deletePanelsBtn.style.display='block';
        _updateToolbarGroups();
      }
      if (scale>1){DOM.calStatus.textContent=' (da file)';DOM.calStatus.classList.add('success');}
      setOrientation(panelOrientation, true);
      DOM.enableWalkways.checked=walkwaysEnabled;
      DOM.walkwaySettings.style.display=walkwaysEnabled?'block':'none';
      _selectedTechIdx=-1;
      DOM.techRotRow.style.display='none';
      updateAreaLists();updateStringList();updateLegend();updateStats();
      if (_inverterList.length > 0) updateInverterListUI();
      // Non mostrare welcome overlay — dati caricati, canvas mostra aree e pannelli
      DOM.welcome.classList.add('hidden');
      snapshot();
      // Centra la vista sui dati caricati
      if (installableAreas.length > 0 || panels.length > 0) {
        const allPts = [];
        installableAreas.forEach(a => allPts.push(...a.points));
        if (allPts.length > 0) {
          const xs = allPts.map(p=>p.x), ys = allPts.map(p=>p.y);
          ox = -((Math.min(...xs)+Math.max(...xs))/2) * z;
          oy = -((Math.min(...ys)+Math.max(...ys))/2) * z;
        }
      }
      draw();
      _persistState();
      showToast('Progetto caricato ✓','success',2000);
    } catch(err) { showToast('Errore nel file: '+err.message,'error',5000); }
  };
  reader.readAsText(f);
  event.target.value='';
}

function resetAll() {
  _sdpConfirm('NUOVO PROGETTO: Tutti i dati saranno persi. Continuare?', () => {
    panels=[];installableAreas=[];exclusionAreas=[];technicalObjects=[];strings=[];curPts=[];calPts=[];
    selectedPanels=new Set();img=null;mode='none';curAreaType=null;_orthoRefAngle=null;
    hoveredPanel=-1;moveMode=false;panelOrientation='auto';walkwaysEnabled=false;
    scale=1;z=1;ox=0;oy=0;_selectedTechIdx=-1;_isDraggingTechRot=false;
    vertexEditMode=false;_vtxDragging=false;_vtxAreaIdx=-1;_vtxIdx=-1;_vtxHoverArea=null;
    stringsVisible=true;
    _updateToolbarGroups();
    DOM.techRotRow.style.display='none';
    const fi=DOM.imgFile;if(fi)fi.value='';
    _pdfDoc=null;_pdfPage=1;
    _pdfSnapPoints=[];_pdfSnapEnabled=false;
    metricSnapM=0;
    _distInputOpen=false;
    if(DOM.distInput)DOM.distInput.style.display='none';
    if(DOM.pdfSnapToggle){DOM.pdfSnapToggle.classList.remove('snap-on');DOM.pdfSnapToggle.style.display='none';}
    if(DOM.snapGridInput){DOM.snapGridInput.value=0;}
    DOM.fileStatus.textContent='';
    localStorage.removeItem(LS_KEY);
    _undoStack.length=0;_redoStack.length=0;_updateUndoUI();
    DOM.enableWalkways.checked=false;
    DOM.walkwaySettings.style.display='none';
    DOM.calStatus.textContent='';
    DOM.calStatus.classList.remove('success');
    setOrientation('auto');
    ['s2','s3','s4','s5','s6','s7','s8'].forEach(id=>document.getElementById(id).classList.add('disabled'));
    DOM.welcome.classList.remove('hidden');
    DOM.compass.classList.remove('visible');
    if(DOM.deletePanelsBtn) DOM.deletePanelsBtn.style.display='none';
    _updateToolbarGroups();

    snapEnabled=true;
    orthoEnabled=true;
    if(DOM.orthoBtn){DOM.orthoBtn.classList.add('snap-on');}
    DOM.areaBtn.classList.remove('active');
    DOM.exclusionBtn.classList.remove('active');
    if (moveMode) if(DOM.moveBtn) DOM.moveBtn.classList.remove('active');
    updateAreaLists();updateStringList();updateLegend();updateStats();
    draw();
  });
}

// ── Build PDF (genera blob PDF dal JPEG del canvas di esportazione) ──
function buildPDF(jpegDataUrl, pageW_mm, pageH_mm) {
  const pt=v=>v*2.8346;
  const enc=new TextEncoder();
  const b64=jpegDataUrl.split(',')[1];
  const bin=atob(b64);
  const jb=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++)jb[i]=bin.charCodeAt(i);
  let jW=1,jH=1;
  for(let i=0;i<jb.length-8;i++){
    if(jb[i]===0xFF&&(jb[i+1]===0xC0||jb[i+1]===0xC2)){jH=(jb[i+5]<<8)|jb[i+6];jW=(jb[i+7]<<8)|jb[i+8];break;}
  }
  const parts=[],off=[];let pos=0;
  const push=b=>{parts.push(b);pos+=b.length;};
  const S=t=>enc.encode(t);
  push(S('%PDF-1.4\n'));
  off.push(pos);push(S(`1 0 obj\n<< /Type /XObject /Subtype /Image /Width ${jW} /Height ${jH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jb.length} >>\nstream\n`));push(jb);push(S('\nendstream\nendobj\n'));
  off.push(pos);push(S('2 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n'));
  off.push(pos);push(S('3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n'));
  const PH=pt(pageH_mm),PW=pt(pageW_mm);
  const cs=enc.encode(`q ${PW.toFixed(2)} 0 0 ${PH.toFixed(2)} 0 0 cm /Im1 Do Q\n`);
  off.push(pos);push(S(`4 0 obj\n<< /Length ${cs.length} >>\nstream\n`));push(cs);push(S('\nendstream\nendobj\n'));
  off.push(pos);push(S('5 0 obj\n<< /Type /Pages /Kids [6 0 R] /Count 1 >>\nendobj\n'));
  off.push(pos);push(S(`6 0 obj\n<< /Type /Page /Parent 5 0 R /MediaBox [0 0 ${PW.toFixed(2)} ${PH.toFixed(2)}] /Contents 4 0 R /Resources << /Font << /F1 2 0 R /F2 3 0 R >> /XObject << /Im1 1 0 R >> >> >>\nendobj\n`));
  off.push(pos);push(S('7 0 obj\n<< /Type /Catalog /Pages 5 0 R >>\nendobj\n'));
  const xp=pos;
  let xref='xref\n0 8\n0000000000 65535 f \n';
  off.forEach(o=>xref+=String(o).padStart(10,'0')+' 00000 n \n');
  xref+=`trailer\n<< /Size 8 /Root 7 0 R >>\nstartxref\n${xp}\n%%EOF`;
  push(S(xref));
  return new Blob(parts,{type:'application/pdf'});
}

/**
 * Esporta il progetto corrente in PDF.
 * Formato e scala vengono scelti automaticamente in base alla planimetria.
 */
async function exportProj() {
  if(!img){showToast("Caricare un'immagine prima di esportare",'warn');return;}
  if(!panels.length){showToast('Posizionare almeno un modulo prima di esportare','warn');return;}
  const btn = document.getElementById('exportProjBtn') || document.querySelector('[onclick="exportProj()"]');
  const orig = btn ? btn.textContent : '';
  if (btn) { btn.textContent='⏳ PDF…'; btn.style.pointerEvents='none'; }
  const overlay=DOM.exportOverlay;
  DOM.exportLabel.textContent='Generazione PDF…';
  overlay.classList.add('visible');
  await new Promise(r=>setTimeout(r,80));
  let exportFont="'JetBrains Mono', 'SF Mono', monospace";
  try{
    const ff=new FontFace('JetBrains Mono',"url('assets/fonts/JetBrainsMono-Regular.woff2')");
    await ff.load();document.fonts.add(ff);exportFont='JetBrains Mono';
  }catch(_){ /* fall back to system 'SF Mono'/monospace */ }
  try{
    let pts=[];
    installableAreas.forEach(a=>pts.push(...a.points));
    exclusionAreas.forEach(a=>pts.push(...a.points));
    panels.forEach(p=>{
      if(p.axisUx!==undefined){const{localU:u,localV:v,w,h,axisUx:ux,axisUy:uy,axisVx:vx,axisVy:vy}=p;pts.push({x:u*ux+v*vx,y:u*uy+v*vy},{x:(u+w)*ux+v*vx,y:(u+w)*uy+v*vy},{x:(u+w)*ux+(v+h)*vx,y:(u+w)*uy+(v+h)*vy},{x:u*ux+(v+h)*vx,y:u*uy+(v+h)*vy});}
      else{pts.push({x:p.x,y:p.y},{x:p.x+p.w,y:p.y+p.h});}
    });
    const minX=Math.min(...pts.map(p=>p.x)),maxX=Math.max(...pts.map(p=>p.x));
    const minY=Math.min(...pts.map(p=>p.y)),maxY=Math.max(...pts.map(p=>p.y));
    const PAD=0.22;
    const bbW=(maxX-minX)*(1+PAD*2),bbH=(maxY-minY)*(1+PAD*2);
    const bbCx=(minX+maxX)/2,bbCy=(minY+maxY)/2;
    const MB=20,HD=22,FT=9,GP=4;
    const calibrated=(scale>1);
    const WM=calibrated?bbW/scale:null,HM=calibrated?bbH/scale:null;
    const avail=fmt=>({W:fmt.w-MB*2-Math.round(fmt.w*0.195)-GP,H:fmt.h-MB*2-HD-FT});
    const FMTS=[{n:'A3',w:420,h:297},{n:'A2',w:594,h:420},{n:'A1',w:841,h:594},{n:'A0',w:1189,h:841}];
    const SCALES=[100,200,500,1000,2000];
    let fmt,scDen,mmPerPx;
    if(calibrated){
      let found=false;
      outer: for(const d of SCALES){const mpm=1000/d,nW=WM*mpm,nH=HM*mpm;for(const f of FMTS){const av=avail(f);if(nW<=av.W&&nH<=av.H){fmt=f;scDen=d;mmPerPx=mpm/scale;found=true;break outer;}}}
      if(!found){fmt=FMTS[3];const av=avail(fmt);const mpm=Math.min(av.W/WM,av.H/HM)*0.97;scDen=Math.round(1000/mpm);mmPerPx=mpm/scale;}
    }else{fmt=FMTS[0];const av=avail(fmt);mmPerPx=Math.min(av.W/bbW,av.H/bbH)*0.97;scDen=null;}
    const PW=fmt.w,PH=fmt.h;
    const CW=Math.round(PW*0.195);
    const scStr=scDen?('1:'+scDen):'N.C.';
    const fmtStr=fmt.n;
    const avPlan=avail(fmt);
    const planX=MB,planY=MB+HD,planW=avPlan.W,planH=avPlan.H;
    const cartX=PW-MB-CW,cartY=MB-3,cartH=PH-(MB-3)*2;
    const DPI=300,MM=DPI/25.4;
    const cvW=Math.round(PW*MM),cvH=Math.round(PH*MM);
    const cv=document.createElement('canvas');cv.width=cvW;cv.height=cvH;
    const c=cv.getContext('2d');
    const px=mm=>mm*MM,FS=mm=>mm*MM;
    const fitText=(txt,maxW,fontMm,bold)=>{
      let f=fontMm;c.font=(bold?'bold ':'')+FS(f)+'px '+exportFont;
      while(f>fontMm*0.45&&c.measureText(txt).width>maxW){f-=fontMm*0.04;c.font=(bold?'bold ':'')+FS(f)+'px '+exportFont;}
      if(c.measureText(txt).width>maxW&&txt.length>1){while(txt.length>1&&c.measureText(txt+'…').width>maxW)txt=txt.slice(0,-1);return txt+'…';}
      return txt;
    };
    // Costanti bordi — devono precedere drawBorders()
    const BRD='#9ca3af', BRD_W=px(0.25);
    const drawSeg=(x1,y1,x2,y2)=>{c.strokeStyle=BRD;c.lineWidth=BRD_W;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();};

    // ── Sub-funzioni export (closure su c, px, FS, fitText, exportFont, layout vars) ──

    /** Disegna l'intestazione con titolo, kWp, scala, formato. */
    function drawHeader() {
      c.fillStyle='#ffffff';c.fillRect(px(MB-3),px(MB-3),px(cartX-MB-GP+3),px(HD+3));
      c.fillStyle='#16a34a';c.fillRect(px(MB-3),px(MB-3),px(2),px(HD+3));
      const hL=MB+4,hTE=MB+planW*0.50,hSS=MB+planW*0.78,hKC=(hTE+hSS)/2;
      c.strokeStyle='#e5e7eb';c.lineWidth=px(0.3);
      c.beginPath();c.moveTo(px(hTE),px(MB));c.lineTo(px(hTE),px(MB+HD-1));c.stroke();
      c.beginPath();c.moveTo(px(hSS),px(MB));c.lineTo(px(hSS),px(MB+HD-1));c.stroke();
      c.fillStyle='#111111';c.textBaseline='middle';c.textAlign='left';
      c.fillText(fitText('LAYOUT IMPIANTO FOTOVOLTAICO',px(hTE-hL-2),HD*0.30,true),px(hL),px(MB+HD*0.35));
      c.fillStyle='#9ca3af';c.fillText(fitText('Elaborato tecnico preliminare',px(hTE-hL-2),HD*0.14,false),px(hL),px(MB+HD*0.72));
      c.textAlign='center';c.fillStyle='#16a34a';
      c.fillText(fitText(kWp+' kWp',px((hSS-hTE)*0.88),HD*0.42,true),px(hKC),px(MB+HD*0.37));
      c.fillStyle='#6b7280';
      c.fillText(fitText(panels.length+' mod. · '+mq+' m² · '+cov+' copertura',px((hSS-hTE)*0.90),HD*0.13,false),px(hKC),px(MB+HD*0.76));
      c.textAlign='right';c.fillStyle='#6b7280';
      c.fillText(fitText('Scala '+scStr,px(cartX-GP-hSS-2),HD*0.14,false),px(cartX-GP-2),px(MB+HD*0.34));
      c.fillText(fitText('Formato '+fmtStr,px(cartX-GP-hSS-2),HD*0.14,false),px(cartX-GP-2),px(MB+HD*0.66));
      c.textAlign='left';
    }

    /** Disegna planimetria, aree, pannelli, oggetti tecnici, etichette e freccia nord. */
    function drawPlan() {
      c.fillStyle='#f6f6f6';c.fillRect(px(planX),px(planY),px(planW),px(planH));
      const pxPerLU=mmPerPx*MM,destCx=px(planX+planW/2),destCy=px(planY+planH/2);
      c.save();c.beginPath();c.rect(px(planX),px(planY),px(planW),px(planH));c.clip();
      c.translate(destCx,destCy);c.scale(pxPerLU,pxPerLU);c.translate(-bbCx,-bbCy);
      if(img){c.globalAlpha=0.45;c.drawImage(img,-img.width/2,-img.height/2);c.globalAlpha=1.0;}
      installableAreas.forEach((a,aIdx)=>{const ac=AREA_COLORS[aIdx%AREA_COLORS.length];c.fillStyle=ac.fill;c.strokeStyle=ac.stroke;c.lineWidth=1/pxPerLU;c.beginPath();c.moveTo(a.points[0].x,a.points[0].y);a.points.forEach((p,i)=>{if(i)c.lineTo(p.x,p.y);});c.closePath();c.fill();c.stroke();});
      exclusionAreas.forEach(a=>{c.fillStyle='rgba(185,28,28,0.12)';c.strokeStyle='#b91c1c';c.lineWidth=0.8/pxPerLU;c.setLineDash([8/pxPerLU,4/pxPerLU]);c.beginPath();c.moveTo(a.points[0].x,a.points[0].y);a.points.forEach((p,i)=>{if(i)c.lineTo(p.x,p.y);});c.closePath();c.fill();c.stroke();c.setLineDash([]);});
      technicalObjects.forEach(obj=>{
        const r=obj.sizePx/2,color=TECH_COLORS[obj.type]||'#555';
        const rHP = obj.sizeHPx ? obj.sizeHPx/2 : r;
        drawTechSymbol(c,obj.type,obj.x,obj.y,r,1.5/pxPerLU,color,obj.ang||0,rHP);
        c.save();c.globalAlpha=0.95;c.setLineDash([2.5/mmPerPx,1.5/mmPerPx]);
        c.lineWidth=0.7/mmPerPx;c.strokeStyle='#ffffff';
        c.beginPath();c.arc(obj.x,obj.y,r*CONFIG.TECH_RING_RATIO,0,Math.PI*2);c.stroke();
        c.lineWidth=0.35/mmPerPx;c.strokeStyle='#dc2626';
        c.beginPath();c.arc(obj.x,obj.y,r*CONFIG.TECH_RING_RATIO,0,Math.PI*2);c.stroke();
        c.setLineDash([]);c.globalAlpha=1;c.restore();
      });
      panels.forEach(p=>drawPanel(c,p,(stringsVisible && p.stringColor)||'#1e3a5f','rgba(255,255,255,0.85)',1/pxPerLU,null,0,pxPerLU));
      panels.forEach(p=>{
        if(!stringsVisible||!p.strId||p.h*pxPerLU<5) return;
        let ex,ey;
        if(p.axisUx!==undefined){const{localU:u,localV:v,w,h,axisUx:ux,axisUy:uy,axisVx:vx,axisVy:vy}=p;ex=(u+w/2)*ux+(v+h/2)*vx;ey=(u+w/2)*uy+(v+h/2)*vy;}
        else{ex=p.x+p.w/2;ey=p.y+p.h/2;}
        const fs=Math.min(p.h*0.38,2.5/mmPerPx);
        c.save();c.translate(ex,ey);c.rotate(p.ang||0);
        c.font='bold '+fs+'px '+exportFont;c.textAlign='center';c.textBaseline='middle';
        c.shadowColor='rgba(0,0,0,0.8)';c.shadowBlur=0.8/pxPerLU;
        c.fillStyle='#ffffff';c.fillText(p.strId,0,0);c.shadowBlur=0;c.restore();
      });

      // ── Cerchi ombra/buffer camini (sopra i pannelli) ───────────────────────
      technicalObjects.forEach(obj => {
        if (obj.type !== 'chimney' || !calibrated) return;
        const _h = obj.heightM || 1.5;
        const obstacleDist = parseFloat(DOM.obstacleDistance ? DOM.obstacleDistance.value : 0) || 0;
        const shadowR = _h * scale / Math.tan((obj.solarAngleDeg||30) * Math.PI / 180);
        const exclR = Math.max(shadowR, obj.sizePx / 2 + obstacleDist * scale);
        const isBufferDominant = exclR > shadowR + scale * 0.1;
        c.save();
        c.globalAlpha = 0.13; c.fillStyle = '#000000';
        c.beginPath(); c.arc(obj.x, obj.y, shadowR, 0, Math.PI*2); c.fill();
        c.globalAlpha = 0.55;
        c.setLineDash([6/mmPerPx, 4/mmPerPx]);
        c.lineWidth = 0.3/mmPerPx; c.strokeStyle = '#555555';
        c.beginPath(); c.arc(obj.x, obj.y, shadowR, 0, Math.PI*2); c.stroke();
        c.setLineDash([]);
        c.globalAlpha = 0.85;
        c.setLineDash([5/mmPerPx, 3/mmPerPx]);
        c.lineWidth = 0.4/mmPerPx; c.strokeStyle = '#dc2626';
        c.beginPath(); c.arc(obj.x, obj.y, exclR, 0, Math.PI*2); c.stroke();
        c.setLineDash([]);
        const labelM = (exclR / scale).toFixed(1);
        const label = isBufferDominant ? 'buffer ' + labelM + 'm' : 'ombra ' + labelM + 'm';
        const labelColor = isBufferDominant ? '#dc2626' : '#333333';
        const fs = Math.max(2.5/mmPerPx, Math.min(exclR * 0.04, 5/mmPerPx));
        c.font = 'bold ' + fs + 'px ' + exportFont;
        c.textAlign = 'center'; c.textBaseline = 'bottom';
        c.lineWidth = 0.5/mmPerPx; c.strokeStyle = 'rgba(255,255,255,0.9)';
        c.globalAlpha = 0.9;
        c.strokeText(label, obj.x, obj.y - exclR - 1/mmPerPx);
        c.fillStyle = labelColor; c.fillText(label, obj.x, obj.y - exclR - 1/mmPerPx);
        c.restore();
      });

      c.restore();
      drawNorthArrow();
    }

    /** Disegna la freccia nord nell'angolo in basso a destra della planimetria. */
    function drawNorthArrow() {
      const nR=9,nMargin=nR+5;
      const ncx=px(planX+planW-nMargin),ncy=px(planY+planH-nMargin);
      c.fillStyle='rgba(255,255,255,0.95)';c.strokeStyle='#333';c.lineWidth=px(0.4);
      c.beginPath();c.arc(ncx,ncy,px(nR),0,Math.PI*2);c.fill();c.stroke();
      c.fillStyle='#111';c.beginPath();
      c.moveTo(ncx,ncy-px(nR*0.78));c.lineTo(ncx-px(nR*0.38),ncy+px(nR*0.32));
      c.lineTo(ncx,ncy+px(nR*0.12));c.closePath();c.fill();
      c.fillStyle='#cccccc';c.beginPath();
      c.moveTo(ncx,ncy-px(nR*0.78));c.lineTo(ncx+px(nR*0.38),ncy+px(nR*0.32));
      c.lineTo(ncx,ncy+px(nR*0.12));c.closePath();c.fill();
      c.fillStyle='#555';c.beginPath();c.arc(ncx,ncy,px(nR*0.10),0,Math.PI*2);c.fill();
      c.strokeStyle='#555';c.lineWidth=px(0.25);c.beginPath();c.arc(ncx,ncy,px(nR),0,Math.PI*2);c.stroke();
      c.fillStyle='#111';c.font='bold '+FS(4.5)+'px '+exportFont;
      c.textAlign='center';c.textBaseline='middle';
      c.fillText('N',ncx,ncy+px(nR*0.68));c.textAlign='left';
    }

    /** Disegna il cartiglio con dati impianto, legenda stringhe e aree. */
    function drawCartiglio() {
      const TBH=CONFIG.PDF.TITLE_BLOCK_H;
      let cy=cartY;
      const drawHLine=(y)=>{c.strokeStyle='#d1d5db';c.lineWidth=BRD_W;c.beginPath();c.moveTo(px(cartX),px(y));c.lineTo(px(cartX+CW),px(y));c.stroke();};
      const drawVLine=(x,y1,y2)=>{c.strokeStyle='#d1d5db';c.lineWidth=BRD_W;c.beginPath();c.moveTo(px(x),px(y1));c.lineTo(px(x),px(y2));c.stroke();};
      const drawSectionHeader=(txt,h)=>{c.fillStyle='#1e3a5f';c.fillRect(px(cartX),px(cy),px(CW),px(h));c.fillStyle='#16a34a';c.fillRect(px(cartX),px(cy),px(1.5),px(h));c.fillStyle='#ffffff';c.font='bold '+FS(h*0.48)+'px '+exportFont;const t=fitText(txt.toUpperCase(),px(CW)*0.88,h*0.50,true);c.textAlign='center';c.textBaseline='middle';c.fillText(t,px(cartX+CW/2),px(cy+h/2));c.textAlign='left';cy+=h;};
      const drawCell=(lbl,val,x,w,h,vSF,bold,vC)=>{vSF=vSF||0.36;vC=vC||'#111111';const lh=h*0.38,vh=h-lh,cx_=x+w/2,padX=w*0.06;c.fillStyle='#9ca3af';c.font=FS(h*0.22)+'px '+exportFont;const lt=fitText(String(lbl).toUpperCase(),px(w-padX*2),h*0.22,false);c.textAlign='center';c.textBaseline='middle';c.fillText(lt,px(cx_),px(cy+lh*0.52));c.fillStyle=vC;const vt=fitText(String(val),px(w-padX*2),h*vSF,bold!==false);c.textAlign='center';c.textBaseline='middle';c.fillText(vt,px(cx_),px(cy+lh+vh*0.50));c.textAlign='left';};
      const drawRow2=(l1,v1,l2,v2,h,vf1,vf2,vc1)=>{const hw=CW/2;drawCell(l1,v1,cartX,hw,h,vf1||0.36,true,vc1);drawCell(l2,v2,cartX+hw,hw,h,vf2||0.36,true);drawVLine(cartX+hw,cy,cy+h);cy+=h;drawHLine(cy);};
      c.fillStyle='#ffffff';c.fillRect(px(cartX),px(cartY),px(CW),px(cartH));
      drawSectionHeader('Impianto',6);
      drawRow2('Potenza picco',kWp+' kWp','N° moduli',panels.length,20,0.38,0.38,'#16a34a');
      drawRow2('Sup. moduli',mq+' m²','Copertura',cov,13);
      drawRow2('Modulo L×W',mH_+'×'+mW_+' m','Potenza mod.',pwr_+' Wp',11);
      const cyAI=cy, availTotal=(cartY+cartH-TBH)-cyAI-2;
      const nStr=strings.length, nAreas=installableAreas.length+exclusionAreas.length+technicalObjects.length;
      const hasStr=nStr>0, hasAreas=nAreas>0;
      const availForRows=Math.max(0,availTotal-(hasStr?6:0)-(hasAreas?6:0));
      const totalRows=nStr+nAreas;
      let rhStr=9;
      if(totalRows>0){
        const baseRh=availForRows/totalRows;
        rhStr=Math.max(6,Math.min(13,baseRh));
        if(!hasStr) rhStr=Math.max(6,Math.min(10,availForRows/nAreas));
        if(!hasAreas) rhStr=Math.max(6,Math.min(13,availForRows/nStr));
      }
      if(hasStr){
        drawSectionHeader('Stringhe inverter',6);
        const strCols=nStr>10?2:1,strColW=CW/strCols,rowsStr=Math.ceil(nStr/strCols);
        const rhStr2=Math.max(5,Math.min(13,(hasAreas?availForRows*0.45:availForRows)/rowsStr));
        const strSH=rowsStr*rhStr2;
        strings.forEach((s,si)=>{
          const col_=si%strCols,row_=Math.floor(si/strCols),rx=cartX+col_*strColW,ry=cy+row_*rhStr2,rh=rhStr2;
          if(row_%2===1){c.fillStyle='#f9fafb';c.fillRect(px(rx),px(ry),px(strColW),px(rh));}
          const kw=(s.panels.length*pwr_/1000).toFixed(2)+' kWp',sqS=rh*0.36,sqX=rx+2,sqY=ry+(rh-sqS)/2;
          c.fillStyle=s.color;c.fillRect(px(sqX),px(sqY),px(sqS),px(sqS));
          c.strokeStyle='rgba(0,0,0,0.15)';c.lineWidth=px(0.12);c.strokeRect(px(sqX),px(sqY),px(sqS),px(sqS));
          const strFont=rh*0.38,nameX=rx+sqS+3.5,kwRes=strColW*0.30;
          const nameMaxW=px(strColW)-px(nameX-rx)-px(kwRes)-px(1);
          c.fillStyle='#111111';c.textAlign='left';c.textBaseline='middle';c.font=FS(strFont)+'px '+exportFont;
          c.fillText(fitText(s.name+' — '+s.panels.length+' mod.',nameMaxW,strFont,true),px(nameX),px(ry+rh/2));
          c.fillStyle='#16a34a';c.textAlign='right';
          c.fillText(fitText(kw,px(kwRes)-px(1),strFont,true),px(rx+strColW-1.5),px(ry+rh/2));
          c.textAlign='left';
        });
        for(let r=1;r<=rowsStr;r++){c.strokeStyle='#d1d5db';c.lineWidth=BRD_W;c.beginPath();c.moveTo(px(cartX),px(cy+r*rhStr2));c.lineTo(px(cartX+CW),px(cy+r*rhStr2));c.stroke();}
        if(strCols>1){c.strokeStyle='#d1d5db';c.lineWidth=BRD_W;c.beginPath();c.moveTo(px(cartX+strColW),px(cy));c.lineTo(px(cartX+strColW),px(cy+strSH));c.stroke();}
        cy+=strSH;
      }
      if(hasAreas){
        drawSectionHeader('Aree progetto',6);
        const allAreas2=[
          ...installableAreas.map((a,i)=>{const EL={'N':'Nord','NE':'Nord-Est','E':'Est','SE':'Sud-Est','S':'Sud','SW':'Sud-Ovest','W':'Ovest','NW':'Nord-Ovest'};const expStr=a.exposure?(' · '+(EL[a.exposure]||a.exposure)):'';return{lbl:'Area '+(i+1),col:AREA_COLORS[i%AREA_COLORS.length].stroke,val:(calibrated?polyArea(a.points).toFixed(0)+' m²':'--')+expStr,isTech:false};}),
          ...exclusionAreas.map((a,i)=>({lbl:'Ostacolo '+(i+1),col:'#b91c1c',val:calibrated?polyArea(a.points).toFixed(0)+' m²':'--',isTech:false})),
          ...technicalObjects.map(obj=>({lbl:obj.label,col:TECH_COLORS[obj.type]||'#555',val:calibrated?obj.sizem.toFixed(1)+'m / buf.'+(obj.bufferM||0).toFixed(1)+'m':'--',isTech:true,obj}))
        ];
        const nTot=allAreas2.length,areaCols=nTot>10?2:1,areaColW=CW/areaCols;
        const rowsArea=Math.ceil(nTot/areaCols);
        const rhArea2=Math.max(5,Math.min(10,(hasStr?availForRows*0.55:availForRows)/rowsArea));
        const areaSH=rowsArea*rhArea2;
        allAreas2.forEach(({lbl,col,val,isTech,obj},ai)=>{
          const acol=ai%areaCols,arow=Math.floor(ai/areaCols),rx=cartX+acol*areaColW,ry=cy+arow*rhArea2,rh=rhArea2;
          if(arow%2===1){c.fillStyle='#f9fafb';c.fillRect(px(rx),px(ry),px(areaColW),px(rh));}
          const sqS=rh*0.40,sqY=ry+(rh-sqS)/2;
          if(isTech){const symR=rh*0.22,symX=rx+2+symR;drawTechSymbol(c,obj.type,px(symX),px(ry+rh/2),px(symR),px(0.3),col,0);}
          else{c.fillStyle=col;c.fillRect(px(rx+2),px(sqY),px(sqS),px(sqS));c.strokeStyle='rgba(0,0,0,0.18)';c.lineWidth=px(0.12);c.strokeRect(px(rx+2),px(sqY),px(sqS),px(sqS));}
          const txtX=rx+2+sqS+2,txtFont=rh*0.36,valW=areaColW*0.33;
          const lblMaxW=px(areaColW)-px(txtX-rx)-px(valW)-px(1);
          c.fillStyle='#111111';c.font=FS(txtFont)+'px '+exportFont;c.textAlign='left';c.textBaseline='middle';
          c.fillText(fitText(lbl,lblMaxW,txtFont,false),px(txtX),px(ry+rh/2));
          c.fillStyle='#6b7280';c.textAlign='right';c.font='bold '+FS(txtFont*0.92)+'px '+exportFont;
          c.fillText(fitText(val,px(valW)-px(1),txtFont,true),px(rx+areaColW-1.5),px(ry+rh/2));
          c.textAlign='left';
        });
        for(let r=1;r<=rowsArea;r++){c.strokeStyle='#d1d5db';c.lineWidth=BRD_W;c.beginPath();c.moveTo(px(cartX),px(cy+r*rhArea2));c.lineTo(px(cartX+CW),px(cy+r*rhArea2));c.stroke();}
        if(areaCols>1){c.strokeStyle='#d1d5db';c.lineWidth=BRD_W;c.beginPath();c.moveTo(px(cartX+areaColW),px(cy));c.lineTo(px(cartX+areaColW),px(cy+areaSH));c.stroke();}
        cy+=areaSH;
      }
      const tbY=cartY+cartH-TBH;
      c.strokeStyle=BRD;c.lineWidth=BRD_W;c.beginPath();c.moveTo(px(cartX),px(tbY));c.lineTo(px(cartX+CW),px(tbY));c.stroke();
      const tbTH=28,tcx=px(cartX+CW/2);
      c.fillStyle='#9ca3af';c.textAlign='center';c.textBaseline='middle';c.font=FS(tbTH*0.11)+'px '+exportFont;c.fillText('PROGETTO',tcx,px(tbY+tbTH*0.14));
      c.fillStyle='#111111';c.fillText(fitText('Impianto FV',px(CW)*0.85,tbTH*0.24,true),tcx,px(tbY+tbTH*0.34));
      c.strokeStyle='#d1d5db';c.lineWidth=BRD_W;c.beginPath();c.moveTo(px(cartX+5),px(tbY+tbTH*0.56));c.lineTo(px(cartX+CW-5),px(tbY+tbTH*0.56));c.stroke();
      c.fillStyle='#6b7280';c.fillText(fitText('Layout moduli fotovoltaici',px(CW)*0.88,tbTH*0.11,false),tcx,px(tbY+tbTH*0.72));
      const colY=tbY+tbTH,colH=TBH-tbTH,lblH=colH*0.42,valH=colH-lblH,cw3=CW/3;
      c.strokeStyle=BRD;c.lineWidth=BRD_W;c.beginPath();c.moveTo(px(cartX),px(colY));c.lineTo(px(cartX+CW),px(colY));c.stroke();
      c.fillStyle='#f1f5f9';c.fillRect(px(cartX),px(colY),px(CW),px(lblH));
      ['Data','Scala','Foglio'].forEach((lbl,i)=>{
        const cx3=cartX+cw3*i;
        c.fillStyle='#9ca3af';c.textAlign='center';c.textBaseline='middle';c.font=FS(lblH*0.40)+'px '+exportFont;
        c.fillText(fitText(lbl.toUpperCase(),px(cw3)*0.85,lblH*0.38,false),px(cx3+cw3/2),px(colY+lblH*0.52));
        c.fillStyle='#111111';c.fillText(fitText([dt,scStr,fmtStr][i],px(cw3)*0.85,valH*0.44,true),px(cx3+cw3/2),px(colY+lblH+valH*0.50));
      });
      [1,2].forEach(i=>{c.strokeStyle=BRD;c.lineWidth=BRD_W;c.beginPath();c.moveTo(px(cartX+cw3*i),px(colY));c.lineTo(px(cartX+cw3*i),px(cartY+cartH));c.stroke();});
    }

    /** Disegna i bordi strutturali per ultimi, sopra tutti i fill. */
    function drawBorders() {
      const L=px(MB-3),R=px(PW-MB+3),T=px(MB-3),Bot=px(PH-MB+3);
      const PL=px(planX),PR=px(planX+planW),PT=px(planY),PB=px(planY+planH);
      const CL=px(cartX),CR=px(cartX+CW),CT=px(cartY),CB=px(cartY+cartH);
      drawSeg(L,T,L,Bot); drawSeg(R,T,R,Bot); drawSeg(L,Bot,R,Bot);
      drawSeg(L,T,CL,T);
      drawSeg(PL,PT,PL,PB); drawSeg(PR,PT,PR,PB); drawSeg(PL,PB,PR,PB);
      drawSeg(CL,T,CR,T);
      drawSeg(CL,CB,CR,CB); drawSeg(CL,T,CL,CB);
    }

    /** Disegna il disclaimer + traccia di generazione in calce al foglio.
     *  AP-11 / T2.6.3 — la stampa include timestamp, versione app, edizione
     *  normativa dalla single-source-of-truth in js/storage.js. */
    function drawFooter() {
      const footMidY=PH-MB/2;
      c.strokeStyle='#d1d5db';c.lineWidth=px(0.2);
      c.beginPath();c.moveTo(px(MB-3),px(PH-MB));c.lineTo(px(PW-MB+3),px(PH-MB));c.stroke();
      c.fillStyle='#9ca3af';c.textAlign='center';c.textBaseline='middle';
      const tsHuman = new Date().toLocaleString('it-IT', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
      const traceLine = 'Generato ' + tsHuman + ' · Solar Designer Pro v' + SDPROJ_APP_VERSION + ' · ' + getEffectiveNormsRevision();
      const disclaimer = 'Elaborato tecnico preliminare, non sostituisce la progettazione esecutiva';
      c.fillText(fitText(traceLine, px(PW*0.7),(MB-3)*0.30,false),px(PW/2),px(footMidY - 1.6));
      c.fillText(fitText(disclaimer,px(PW*0.7),(MB-3)*0.28,false),px(PW/2),px(footMidY + 1.8));
    }

    // ── Dati progetto per la stampa ───────────────────────────────────────
    const pwr_=Math.max(1,parseInt(DOM.pp.value)||400);
    const mW_=Math.max(0.1,parseFloat(DOM.pw.value)||1);
    const mH_=Math.max(0.1,parseFloat(DOM.pl.value)||1.7);
    const kWp   = (panels.length * pwr_ / 1000).toFixed(2);
    const mq    = (panels.length * mW_ * mH_).toFixed(1);
    const instMq= installableAreas.reduce((s,a) => s + polyArea(a.points), 0);
    const cov   = instMq > 0 ? ((parseFloat(mq)/instMq)*100).toFixed(0)+'%' : '--';
    const dt    = new Date().toLocaleDateString('it-IT',{day:'2-digit',month:'2-digit',year:'numeric'});
    // ── Coordinator: chiama le sub-funzioni nell'ordine corretto ─────────
    c.fillStyle='#ffffff';c.fillRect(0,0,cvW,cvH);
    drawHeader();
    drawPlan();
    drawCartiglio();
    drawBorders();
    drawFooter();
    // ── Build PDF e scarica ───────────────────────────────────────────
    const blob=buildPDF(cv.toDataURL('image/jpeg',CONFIG.PDF.JPEG_QUALITY),PW,PH);
    const url=URL.createObjectURL(blob);
    const a_dl=document.createElement('a');
    a_dl.href=url; a_dl.download='progetto-fv-'+dt+'.pdf';
    document.body.appendChild(a_dl); a_dl.click(); document.body.removeChild(a_dl);
    setTimeout(()=>URL.revokeObjectURL(url),3000);
  }catch(err){console.error(err);showToast('Errore export: '+err.message,'error',5000);}
  finally{DOM.exportOverlay.classList.remove('visible');if(btn){btn.textContent=orig;btn.style.pointerEvents='';}}
}
