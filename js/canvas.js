// â”€â”€ canvas.js â€” Rendering canvas, geometria, viewport, interazione mouse â”€â”€

'use strict';

// â”€â”€ Coordinate helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function getPoint(e) {
  const r = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - r.left - r.width/2  - ox) / z,
    y: (e.clientY - r.top  - r.height/2 - oy) / z
  };
}

function getOrtho(last, cur) {
  if (_orthoRefAngle === null) return cur;
  const v = { x: cur.x - last.x, y: cur.y - last.y };
  const perpAngle = _orthoRefAngle + Math.PI/2;
  const dot1 = Math.abs(v.x * Math.cos(_orthoRefAngle) + v.y * Math.sin(_orthoRefAngle));
  const dot2 = Math.abs(v.x * Math.cos(perpAngle) + v.y * Math.sin(perpAngle));
  if (dot1 > dot2) {
    const dist = v.x * Math.cos(_orthoRefAngle) + v.y * Math.sin(_orthoRefAngle);
    return { x: last.x + dist * Math.cos(_orthoRefAngle), y: last.y + dist * Math.sin(_orthoRefAngle) };
  } else {
    const dist = v.x * Math.cos(perpAngle) + v.y * Math.sin(perpAngle);
    return { x: last.x + dist * Math.cos(perpAngle), y: last.y + dist * Math.sin(perpAngle) };
  }
}

// â”€â”€ Viewport â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function resize() {
  const parent = canvas.parentElement;
  const cssW = parent.clientWidth;
  const cssH = parent.clientHeight;
  const dpr  = window.devicePixelRatio || 1;
  canvas.width  = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  canvas.style.width  = cssW + 'px';
  canvas.style.height = cssH + 'px';
  _updateMobToggle();
  draw();
}

function zoom(f) {
  z = Math.max(CONFIG.ZOOM_MIN, Math.min(z * f, CONFIG.ZOOM_MAX));
  draw();
}

function resetView() {
  z = 1; ox = 0; oy = 0;
  if (img) {
    const scaleX = (canvas.clientWidth  * 0.9) / img.width;
    const scaleY = (canvas.clientHeight * 0.9) / img.height;
    z = Math.min(scaleX, scaleY);
  }
  draw();
}

function wheel(e) {
  e.preventDefault();
  const factor = e.deltaY > 0 ? 0.9 : 1.1;
  const cx  = e.offsetX - canvas.clientWidth  / 2;
  const cy_ = e.offsetY - canvas.clientHeight / 2;
  const newZ = Math.max(CONFIG.ZOOM_MIN, Math.min(z * factor, CONFIG.ZOOM_MAX));
  const realFactor = newZ / z;
  ox = cx  - (cx  - ox) * realFactor;
  oy = cy_ - (cy_ - oy) * realFactor;
  z  = newZ;
  requestDraw();
}

// â”€â”€ PDF snap helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function _pdfSnapToWorld(sp) {
  if (sp.wx !== undefined) return { x: sp.wx, y: sp.wy };
  if (!img) return null;
  return { x: sp.imgX - img.width/2, y: sp.imgY - img.height/2 };
}

function _nearestPdfSnap(worldPt, screenRadius) {
  if (!_pdfSnapEnabled || _pdfSnapPoints.length === 0) return null;
  const worldR = screenRadius / z;
  let best = null, bestD2 = worldR * worldR;
  for (const sp of _pdfSnapPoints) {
    const w = _pdfSnapToWorld(sp);
    if (!w) continue;
    const d2 = (w.x - worldPt.x)**2 + (w.y - worldPt.y)**2;
    if (d2 < bestD2) { bestD2 = d2; best = w; }
  }
  return best;
}

// â”€â”€ Snap metrico â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function _applyMetricSnap(pt) {
  if (metricSnapM <= 0 || scale <= 1) return pt;
  const step = metricSnapM * scale;
  return { x: Math.round(pt.x / step) * step, y: Math.round(pt.y / step) * step };
}

// â”€â”€ Geometria â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function transformPolygon(pts, ang) {
  const cos = Math.cos(-ang), sin = Math.sin(-ang);
  return pts.map(p => ({ x: p.x*cos - p.y*sin, y: p.x*sin + p.y*cos }));
}

function localToGlobal(x, y, ang) {
  const cos = Math.cos(ang), sin = Math.sin(ang);
  return { x: x*cos - y*sin, y: x*sin + y*cos };
}

function polyAABB(polygon) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of polygon) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, maxX, minY, maxY };
}

function pointInPolygon(point, polygon, aabb) {
  if (aabb) {
    if (point.x < aabb.minX || point.x > aabb.maxX ||
        point.y < aabb.minY || point.y > aabb.maxY) return false;
  }
  let inside = false;
  for (let i = 0, j = polygon.length-1; i < polygon.length; j = i++) {
    const xi=polygon[i].x, yi=polygon[i].y, xj=polygon[j].x, yj=polygon[j].y;
    const intersect = ((yi>point.y)!==(yj>point.y)) && (point.x < (xj-xi)*(point.y-yi)/(yj-yi)+xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function distanceToSegment(p, a, b) {
  const dx=b.x-a.x, dy=b.y-a.y;
  const l2 = dx*dx+dy*dy;
  if (l2===0) return Math.sqrt((p.x-a.x)**2+(p.y-a.y)**2);
  let t = ((p.x-a.x)*dx+(p.y-a.y)*dy)/l2;
  t = Math.max(0, Math.min(1, t));
  return Math.sqrt((p.x-(a.x+t*dx))**2+(p.y-(a.y+t*dy))**2);
}

function _segsIntersect(a, b, c, d) {
  function cross(p, q, r) {
    return (q.x-p.x)*(r.y-p.y) - (q.y-p.y)*(r.x-p.x);
  }
  const d1=cross(c,d,a), d2=cross(c,d,b);
  const d3=cross(a,b,c), d4=cross(a,b,d);
  if (((d1>0&&d2<0)||(d1<0&&d2>0)) && ((d3>0&&d4<0)||(d3<0&&d4>0))) return true;
  function onSeg(p,q,r) {
    return Math.min(p.x,r.x)<=q.x && q.x<=Math.max(p.x,r.x) &&
           Math.min(p.y,r.y)<=q.y && q.y<=Math.max(p.y,r.y);
  }
  if (d1===0&&onSeg(c,a,d)) return true;
  if (d2===0&&onSeg(c,b,d)) return true;
  if (d3===0&&onSeg(a,c,b)) return true;
  if (d4===0&&onSeg(a,d,b)) return true;
  return false;
}

function scanlineX(polygon, y) {
  let n = 0;
  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    const y1 = polygon[i].y, y2 = polygon[j].y;
    if ((y1 <= y && y < y2) || (y2 <= y && y < y1)) {
      if (n >= _scanBuf.length) break; // bounds check — poligoni con >32 intersezioni per scanline
      const t = (y - y1) / (y2 - y1);
      _scanBuf[n++] = polygon[i].x + t * (polygon[j].x - polygon[i].x);
    }
  }
  const result = Array.from(_scanBuf.subarray(0, n));
  result.sort((a, b) => a - b);
  return result;
}

function _convexHull(pts) {
  if (pts.length < 3) return pts.map(p=>({...p}));
  const sorted = pts.slice().sort((a,b) => a.x!==b.x ? a.x-b.x : a.y-b.y);
  const cross = (O,A,B) => (A.x-O.x)*(B.y-O.y)-(A.y-O.y)*(B.x-O.x);
  const lower = [], upper = [];
  for (const p of sorted) {
    while (lower.length>=2 && cross(lower[lower.length-2],lower[lower.length-1],p)<=0) lower.pop();
    lower.push(p);
  }
  for (let i=sorted.length-1;i>=0;i--) {
    const p=sorted[i];
    while (upper.length>=2 && cross(upper[upper.length-2],upper[upper.length-1],p)<=0) upper.pop();
    upper.push(p);
  }
  upper.pop(); lower.pop();
  return lower.concat(upper);
}

function _isSelfIntersecting(pts) {
  const n = pts.length;
  if (n < 4) return false;
  for (let i = 0; i < n; i++) {
    const a=pts[i], b=pts[(i+1)%n];
    for (let j = i+2; j < n; j++) {
      if (i===0 && j===n-1) continue;
      const c=pts[j], d=pts[(j+1)%n];
      if (_segsIntersect(a,b,c,d)) return true;
    }
  }
  return false;
}

function offsetPolygon(pts, dist) {
  const n = pts.length;
  if (n < 3) return pts.map(p => ({...p}));
  if (dist === 0) return pts.map(p => ({...p}));
  let area = 0;
  for (let i = 0; i < n; i++) {
    const j = (i+1) % n;
    area += pts[i].x * pts[j].y - pts[j].x * pts[i].y;
  }
  const windSign = area >= 0 ? 1 : -1;
  const out = [];
  for (let i = 0; i < n; i++) {
    const prev = pts[(i-1+n)%n], curr = pts[i], next = pts[(i+1)%n];
    const ax = curr.x-prev.x, ay = curr.y-prev.y;
    const la = Math.sqrt(ax*ax+ay*ay) || 1;
    const n1x = windSign*ay/la, n1y = -windSign*ax/la;
    const bx = next.x-curr.x,  by = next.y-curr.y;
    const lb = Math.sqrt(bx*bx+by*by) || 1;
    const n2x = windSign*by/lb, n2y = -windSign*bx/lb;
    let bsx = n1x+n2x, bsy = n1y+n2y;
    const bl = Math.sqrt(bsx*bsx+bsy*bsy) || 1;
    bsx /= bl; bsy /= bl;
    const dot = n1x*bsx + n1y*bsy;
    const sc = dist / Math.max(Math.abs(dot), 0.087);
    out.push({ x: curr.x + bsx*sc, y: curr.y + bsy*sc });
  }
  if (_isSelfIntersecting(out)) {
    if (dist > 0) return null;
    return pts.map(p=>({...p}));
  }
  return out;
}

function _isValidPoly(pts) {
  if (!pts || pts.length < 3) return false;
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i+1)%pts.length;
    area += pts[i].x*pts[j].y - pts[j].x*pts[i].y;
  }
  return Math.abs(area) > 1e-6;
}

// â”€â”€ Disegno pannelli e simboli tecnici â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function drawPanel(ctx2, pan, fillStyle, strokeStyle, lineWidth, shadowColor, shadowBlur, z2) {
  const hasAxis = pan.axisUx !== undefined;
  const cellLW = Math.max(1/(z2||1), 0.6/(z2||1));
  if (hasAxis) {
    const ux=pan.axisUx, uy=pan.axisUy, vx=pan.axisVx, vy=pan.axisVy;
    const u=pan.localU, v=pan.localV, w=pan.w, h=pan.h;
    const c0={x:u*ux+v*vx, y:u*uy+v*vy};
    const c1={x:(u+w)*ux+v*vx, y:(u+w)*uy+v*vy};
    const c2={x:(u+w)*ux+(v+h)*vx, y:(u+w)*uy+(v+h)*vy};
    const c3={x:u*ux+(v+h)*vx, y:u*uy+(v+h)*vy};
    ctx2.shadowColor=shadowColor||'transparent'; ctx2.shadowBlur=shadowBlur||0;
    ctx2.fillStyle=fillStyle;
    ctx2.beginPath(); ctx2.moveTo(c0.x,c0.y); ctx2.lineTo(c1.x,c1.y); ctx2.lineTo(c2.x,c2.y); ctx2.lineTo(c3.x,c3.y); ctx2.closePath(); ctx2.fill();
    ctx2.shadowBlur=0;
    const rows=6, cols=2;
    ctx2.strokeStyle='rgba(255,255,255,0.22)'; ctx2.lineWidth=cellLW;
    for (let i=1;i<cols;i++){const t=i/cols;ctx2.beginPath();ctx2.moveTo(c0.x+t*(c1.x-c0.x),c0.y+t*(c1.y-c0.y));ctx2.lineTo(c3.x+t*(c2.x-c3.x),c3.y+t*(c2.y-c3.y));ctx2.stroke();}
    for (let i=1;i<rows;i++){const t=i/rows;ctx2.beginPath();ctx2.moveTo(c0.x+t*(c3.x-c0.x),c0.y+t*(c3.y-c0.y));ctx2.lineTo(c1.x+t*(c2.x-c1.x),c1.y+t*(c2.y-c1.y));ctx2.stroke();}
    ctx2.strokeStyle=strokeStyle; ctx2.lineWidth=lineWidth;
    ctx2.beginPath(); ctx2.moveTo(c0.x,c0.y); ctx2.lineTo(c1.x,c1.y); ctx2.lineTo(c2.x,c2.y); ctx2.lineTo(c3.x,c3.y); ctx2.closePath(); ctx2.stroke();
  } else {
    ctx2.shadowColor=shadowColor||'transparent'; ctx2.shadowBlur=shadowBlur||0;
    ctx2.fillStyle=fillStyle; ctx2.fillRect(pan.x,pan.y,pan.w,pan.h); ctx2.shadowBlur=0;
    ctx2.strokeStyle='rgba(255,255,255,0.22)'; ctx2.lineWidth=cellLW;
    const rows=6, cols=2, cw=pan.w/cols, ch=pan.h/rows;
    for(let i=1;i<cols;i++){ctx2.beginPath();ctx2.moveTo(pan.x+cw*i,pan.y);ctx2.lineTo(pan.x+cw*i,pan.y+pan.h);ctx2.stroke();}
    for(let i=1;i<rows;i++){ctx2.beginPath();ctx2.moveTo(pan.x,pan.y+ch*i);ctx2.lineTo(pan.x+pan.w,pan.y+ch*i);ctx2.stroke();}
    ctx2.strokeStyle=strokeStyle; ctx2.lineWidth=lineWidth; ctx2.strokeRect(pan.x,pan.y,pan.w,pan.h);
  }
}

function drawCalPoint(x, y, label) {
  const r = 7/z;
  ctx.strokeStyle='rgba(255,255,255,0.9)'; ctx.lineWidth=3/z;
  ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.stroke();
  ctx.strokeStyle='#f97316'; ctx.lineWidth=2/z;
  ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x-r*0.6,y); ctx.lineTo(x+r*0.6,y); ctx.moveTo(x,y-r*0.6); ctx.lineTo(x,y+r*0.6); ctx.stroke();
  if (label) {
    ctx.font=`bold ${11/z}px sans-serif`; ctx.textAlign='left'; ctx.fillStyle='rgba(249,115,22,0.95)';
    const tw = ctx.measureText(label).width + 8/z;
    ctx.fillRect(x+r+2/z,y-9/z,tw,13/z); ctx.fillStyle='#fff'; ctx.textBaseline='middle'; ctx.fillText(label,x+r+5/z,y);
  }
}

function drawTechSymbol(ctx2, type, cx, cy, r, strokeW, color, ang, rH) {
  rH = rH || r;
  const c2 = ctx2;
  c2.save();
  if (ang) { c2.translate(cx,cy); c2.rotate(ang); c2.translate(-cx,-cy); }
  const sw = strokeW;
  const doFill   = () => { c2.fillStyle='rgba(255,255,255,0.92)'; c2.fill(); };
  const doStroke = (w) => { c2.strokeStyle='#1e293b'; c2.lineWidth=w||sw; c2.stroke(); };
  switch(type) {
    case 'chimney':
      c2.beginPath(); c2.arc(cx,cy,r,0,Math.PI*2); doFill(); doStroke();
      c2.beginPath(); c2.moveTo(cx-r*0.6,cy-r*0.6); c2.lineTo(cx+r*0.6,cy+r*0.6); doStroke();
      c2.beginPath(); c2.moveTo(cx+r*0.6,cy-r*0.6); c2.lineTo(cx-r*0.6,cy+r*0.6); doStroke();
      break;
    case 'antenna':
      c2.beginPath(); c2.moveTo(cx,cy-r*0.8); c2.lineTo(cx+r*0.6,cy+r*0.5); c2.lineTo(cx-r*0.6,cy+r*0.5); c2.closePath();
      doFill(); doStroke();
      c2.beginPath(); c2.moveTo(cx,cy+r*0.5); c2.lineTo(cx,cy+r); doStroke();
      break;
    case 'hvac':
      c2.beginPath(); c2.rect(cx-r,cy-r*0.7,r*2,r*1.4); doFill(); doStroke();
      c2.beginPath(); c2.arc(cx,cy,r*0.38,0,Math.PI*2); doStroke(sw*0.8);
      [0,90,180,270].forEach(d=>{const a=d*Math.PI/180;c2.beginPath();c2.moveTo(cx,cy);c2.lineTo(cx+r*0.35*Math.cos(a),cy+r*0.35*Math.sin(a));doStroke(sw*0.7);});
      break;
    case 'skylight':
      c2.beginPath(); c2.rect(cx-r,cy-rH,r*2,rH*2); doFill(); doStroke();
      c2.beginPath(); c2.moveTo(cx-r,cy-rH); c2.lineTo(cx+r,cy+rH); doStroke(sw*0.7);
      c2.beginPath(); c2.moveTo(cx+r,cy-rH); c2.lineTo(cx-r,cy+rH); doStroke(sw*0.7);
      break;
    case 'exhaust':
      c2.beginPath(); c2.arc(cx,cy,r,0,Math.PI*2); doFill(); doStroke();
      c2.beginPath(); c2.moveTo(cx-r*0.65,cy); c2.lineTo(cx+r*0.65,cy); doStroke();
      c2.beginPath(); c2.moveTo(cx,cy-r*0.65); c2.lineTo(cx,cy+r*0.65); doStroke();
      break;
    default:
      c2.beginPath(); c2.arc(cx,cy,r,0,Math.PI*2); doFill(); doStroke();
  }
  c2.restore();
}

// â”€â”€ Render loop principale â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function draw() {
  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  ctx.fillStyle = isDark ? '#141517' : '#ebebeb';
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  ctx.save();
  ctx.translate(canvas.clientWidth/2+ox, canvas.clientHeight/2+oy);
  ctx.scale(z, z);
  if (img) ctx.drawImage(img, -img.width/2, -img.height/2);

  // Griglia metrica
  if (snapEnabled && metricSnapM > 0 && scale > 1) {
    const step = metricSnapM * scale;
    const vpW = canvas.clientWidth / z, vpH = canvas.clientHeight / z;
    const vpX = -canvas.clientWidth/(2*z) - ox/z, vpY = -canvas.clientHeight/(2*z) - oy/z;
    const x0 = Math.floor(vpX / step) * step;
    const y0 = Math.floor(vpY / step) * step;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 0.6 / z;
    ctx.setLineDash([2/z, 3/z]);
    for (let gx = x0; gx < vpX + vpW + step; gx += step) {
      ctx.beginPath(); ctx.moveTo(gx, vpY); ctx.lineTo(gx, vpY + vpH); ctx.stroke();
    }
    for (let gy = y0; gy < vpY + vpH + step; gy += step) {
      ctx.beginPath(); ctx.moveTo(vpX, gy); ctx.lineTo(vpX + vpW, gy); ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    const dotR = 1.2/z;
    for (let gx = x0; gx < vpX + vpW + step; gx += step)
      for (let gy = y0; gy < vpY + vpH + step; gy += step) {
        ctx.beginPath(); ctx.arc(gx, gy, dotR, 0, Math.PI*2); ctx.fill();
      }
    ctx.restore();
  }

  // Calibrazione
  if (mode==='cal') {
    ctx.save();
    if (calPts.length>=1) {
      drawCalPoint(calPts[0].x, calPts[0].y, 'P1');
      const endPt = calPts.length===2 ? calPts[1] : mpos;
      const dx=endPt.x-calPts[0].x, dy=endPt.y-calPts[0].y;
      const pixDist=Math.sqrt(dx*dx+dy*dy);
      ctx.strokeStyle='rgba(255,255,255,0.8)'; ctx.lineWidth=3/z; ctx.setLineDash([8/z,5/z]);
      ctx.beginPath(); ctx.moveTo(calPts[0].x,calPts[0].y); ctx.lineTo(endPt.x,endPt.y); ctx.stroke();
      ctx.strokeStyle='#f97316'; ctx.lineWidth=1.5/z;
      ctx.beginPath(); ctx.moveTo(calPts[0].x,calPts[0].y); ctx.lineTo(endPt.x,endPt.y); ctx.stroke();
      ctx.setLineDash([]);
      const rd=parseFloat(DOM.dist.value)||0;
      const midX=(calPts[0].x+endPt.x)/2, midY=(calPts[0].y+endPt.y)/2;
      const ang=Math.atan2(dy,dx);
      ctx.save(); ctx.translate(midX,midY);
      let labelAng=ang; if(labelAng>Math.PI/2||labelAng<-Math.PI/2) labelAng+=Math.PI;
      ctx.rotate(labelAng);
      let distLabel;
      if(scale>1&&pixDist>0) distLabel=`${(pixDist/scale).toFixed(2)} m`;
      else if(rd>0&&pixDist>0) distLabel=`${pixDist.toFixed(0)} px`;
      else distLabel='';
      if(distLabel&&pixDist>20/z){
        ctx.font=`bold ${10/z}px sans-serif`; ctx.textAlign='center';
        const tw=ctx.measureText(distLabel).width+8/z;
        ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.fillRect(-tw/2,-14/z,tw,12/z);
        ctx.fillStyle='#fff'; ctx.textBaseline='middle'; ctx.fillText(distLabel,0,-8/z);
      }
      ctx.restore();
      [calPts[0],endPt].forEach(pt=>{
        ctx.save(); ctx.translate(pt.x,pt.y); ctx.rotate(ang+Math.PI/2);
        ctx.strokeStyle='#f97316'; ctx.lineWidth=1.5/z;
        ctx.beginPath(); ctx.moveTo(-5/z,0); ctx.lineTo(5/z,0); ctx.stroke(); ctx.restore();
      });
    }
    if(calPts.length===2) drawCalPoint(calPts[1].x, calPts[1].y, 'P2');
    ctx.restore();
  }

  // Aree installabili
  installableAreas.forEach((a,aIdx)=>{
    const ac=AREA_COLORS[aIdx%AREA_COLORS.length];
    ctx.fillStyle=ac.fill.replace('0.15','0.22');
    ctx.strokeStyle=ac.stroke; ctx.lineWidth=3/z;
    ctx.shadowColor='rgba(255,255,255,0.5)'; ctx.shadowBlur=2/z;
    ctx.beginPath(); ctx.moveTo(a.points[0].x,a.points[0].y);
    for(let i=1;i<a.points.length;i++) ctx.lineTo(a.points[i].x,a.points[i].y);
    ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.shadowBlur=0;
  });
  installableAreas.forEach((a,aIdx)=>{
    const ac=AREA_COLORS[aIdx%AREA_COLORS.length];
    const cx=a.points.reduce((s,pt)=>s+pt.x,0)/a.points.length;
    const cy=a.points.reduce((s,pt)=>s+pt.y,0)/a.points.length;
    const LABEL_PX = 14;
    ctx.save();
    ctx.font=`bold ${LABEL_PX/z}px 'JetBrains Mono', 'SF Mono', monospace`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.shadowColor='rgba(255,255,255,0.95)'; ctx.shadowBlur=3/z; ctx.fillStyle=ac.stroke;
    ctx.fillText(`Area ${aIdx+1}`,cx,cy); ctx.shadowBlur=0;
    if (a.exposure && EXP_LABELS[a.exposure]) {
      const ARROWS = {N:'â†‘',NE:'â†—',E:'â†’',SE:'â†˜',S:'â†“',SW:'â†™',W:'â†',NW:'â†–'};
      const expTxt = ARROWS[a.exposure]+' '+EXP_LABELS[a.exposure];
      ctx.font=`${(LABEL_PX*0.72)/z}px 'JetBrains Mono','SF Mono',monospace`;
      ctx.fillStyle=EXP_COLORS[a.exposure]||ac.stroke;
      ctx.fillText(expTxt,cx,cy+(LABEL_PX*1.3)/z);
    }
    ctx.restore();
  });

  // Vertex edit handles
  if (vertexEditMode) {
    const VR = 7/z, VR_HOV = 10/z;
    const drawHandles = (pts, color, type, aIdx) => {
      pts.forEach((vp, vi) => {
        const isHov  = _vtxHoverArea  && _vtxHoverArea.type===type  && _vtxHoverArea.areaIdx===aIdx  && _vtxHoverArea.vtxIdx===vi;
        const isDrag = _vtxDragging   && _vtxAreaType===type         && _vtxAreaIdx===aIdx            && _vtxIdx===vi;
        const r = (isHov || isDrag) ? VR_HOV : VR;
        ctx.save();
        ctx.beginPath(); ctx.arc(vp.x, vp.y, r, 0, Math.PI*2);
        ctx.fillStyle   = isDrag ? color : 'rgba(255,255,255,0.92)';
        ctx.strokeStyle = color;
        ctx.lineWidth   = (isHov||isDrag) ? 2.5/z : 1.5/z;
        ctx.shadowColor = color; ctx.shadowBlur = isHov ? 8/z : 3/z;
        ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
        if (isHov || isDrag) {
          ctx.font=`bold ${9/z}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
          ctx.fillStyle = isDrag ? '#fff' : color;
          ctx.fillText('âœ¥', vp.x, vp.y);
        }
        ctx.restore();
      });
    };
    installableAreas.forEach((a,i) => drawHandles(a.points, AREA_COLORS[i%AREA_COLORS.length].stroke, 'installable', i));
    exclusionAreas.forEach((a,i)   => drawHandles(a.points, '#dc2626', 'exclusion', i));
  }

  // Buffer distanza ostacoli
  if (showBuffer && scale > 1) {
    const bufDistM = parseFloat(DOM.obstacleDistance ? DOM.obstacleDistance.value : 0) || 0;
    if (bufDistM > 0) {
      const bufPx = bufDistM * scale;
      ctx.save();
      exclusionAreas.forEach(a => {
        const expanded = offsetPolygon(a.points, bufPx);
        if (!expanded || expanded.length < 3) return;
        ctx.fillStyle = 'rgba(251,146,60,0.18)';
        ctx.strokeStyle = 'rgba(234,88,12,0.7)';
        ctx.lineWidth = 1.5/z;
        ctx.setLineDash([4/z, 3/z]);
        ctx.beginPath();
        ctx.moveTo(expanded[0].x, expanded[0].y);
        for (let i = 1; i < expanded.length; i++) ctx.lineTo(expanded[i].x, expanded[i].y);
        ctx.closePath(); ctx.fill();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.beginPath();
        ctx.moveTo(a.points[0].x, a.points[0].y);
        for (let i = 1; i < a.points.length; i++) ctx.lineTo(a.points[i].x, a.points[i].y);
        ctx.closePath(); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        ctx.beginPath();
        ctx.moveTo(expanded[0].x, expanded[0].y);
        for (let i = 1; i < expanded.length; i++) ctx.lineTo(expanded[i].x, expanded[i].y);
        ctx.closePath(); ctx.stroke();
        ctx.setLineDash([]);
        const cx_ = a.points.reduce((s,p)=>s+p.x,0)/a.points.length;
        const cy_ = a.points.reduce((s,p)=>s+p.y,0)/a.points.length;
        const LPXB = 11;
        ctx.save();
        ctx.font = `600 ${LPXB/z}px 'JetBrains Mono',monospace`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const label = `âŠ¢${bufDistM}mâŠ£`;
        const tw = ctx.measureText(label).width + 6/z;
        const th = LPXB/z * 1.4;
        const maxX = Math.max(...a.points.map(p=>p.x));
        const lx_ = maxX + bufPx*0.5;
        const ly_ = cy_;
        ctx.fillStyle = 'rgba(255,255,255,0.88)';
        ctx.beginPath(); ctx.roundRect(lx_-tw/2, ly_-th/2, tw, th, 2/z); ctx.fill();
        ctx.fillStyle = 'rgba(234,88,12,0.9)';
        ctx.fillText(label, lx_, ly_);
        ctx.restore();
      });
      ctx.restore();
    }
  }

  // Aree esclusione
  exclusionAreas.forEach(a=>{
    ctx.fillStyle='rgba(220,38,38,0.18)'; ctx.strokeStyle='#dc2626'; ctx.lineWidth=2.5/z;
    ctx.setLineDash([12/z,6/z]); ctx.shadowColor='rgba(255,255,255,0.6)'; ctx.shadowBlur=3/z;
    ctx.beginPath(); ctx.moveTo(a.points[0].x,a.points[0].y);
    for(let i=1;i<a.points.length;i++) ctx.lineTo(a.points[i].x,a.points[i].y);
    ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.shadowBlur=0; ctx.setLineDash([]);
  });

  // Oggetti tecnici puntuali
  technicalObjects.forEach((obj,i)=>{
    if (!obj || !obj.sizePx) return;
    const r = obj.sizePx/2;
    const color = TECH_COLORS[obj.type]||'#555';
    const accentColor = TECH_LIST_COLORS[obj.type]||'#aaa';
    const bufM = parseFloat(DOM.obstacleDistance ? DOM.obstacleDistance.value : 0) || 0;
    const rH = obj.sizeHPx ? obj.sizeHPx/2 : r;
    drawTechSymbol(ctx, obj.type, obj.x, obj.y, r, 2/z, color, obj.ang||0, rH);
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.setLineDash([5/z, 3/z]);
    ctx.lineWidth = 3/z; ctx.strokeStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(obj.x, obj.y, r * CONFIG.TECH_RING_RATIO, 0, Math.PI*2); ctx.stroke();
    ctx.lineWidth = 1.5/z; ctx.strokeStyle = '#dc2626';
    ctx.beginPath(); ctx.arc(obj.x, obj.y, r * 1.35, 0, Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    if (bufM > 0) {
      const rBuf = r + bufM * scale;
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.setLineDash([8/z, 4/z]);
      ctx.lineWidth = 3/z; ctx.strokeStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(obj.x, obj.y, rBuf, 0, Math.PI*2); ctx.stroke();
      ctx.lineWidth = 1.5/z; ctx.strokeStyle = '#dc2626';
      ctx.beginPath(); ctx.arc(obj.x, obj.y, rBuf, 0, Math.PI*2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = 'bold ' + (Math.max(9/z, rBuf*0.13))+'px var(--font-main)';
      ctx.fillStyle = '#dc2626';
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3/z;
      ctx.textAlign='center'; ctx.textBaseline='bottom';
      ctx.strokeText(bufM.toFixed(1)+'m', obj.x, obj.y - rBuf - 2/z);
      ctx.fillText(bufM.toFixed(1)+'m', obj.x, obj.y - rBuf - 2/z);
      ctx.restore();
    }
    if (_selectedTechIdx === i) {
      const hPos = _techRotHandlePos(obj);
      const hR = Math.max(7/z, r * 0.22);
      ctx.save();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.5/z;
      ctx.setLineDash([4/z, 3/z]);
      ctx.beginPath(); ctx.arc(obj.x, obj.y, r * 1.65, 0, Math.PI*2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = accentColor; ctx.lineWidth = 1.2/z;
      ctx.beginPath(); ctx.moveTo(obj.x, obj.y); ctx.lineTo(hPos.x, hPos.y); ctx.stroke();
      const isOverHandle = mpos && _hitTestRotHandle(mpos, obj);
      ctx.beginPath(); ctx.arc(hPos.x, hPos.y, hR, 0, Math.PI*2);
      ctx.fillStyle = isOverHandle ? accentColor : '#fff';
      ctx.strokeStyle = accentColor; ctx.lineWidth = 1.5/z;
      ctx.fill(); ctx.stroke();
      ctx.strokeStyle = isOverHandle ? '#fff' : accentColor;
      ctx.lineWidth = 1/z;
      ctx.beginPath(); ctx.arc(hPos.x, hPos.y, hR*0.5, 0, Math.PI*1.5); ctx.stroke();
      ctx.restore();
    }
  });

  // Ghost cursore in modalitÃ  tech
  if (mode==='tech' && mpos) {
    const sizem = parseFloat(DOM.techSize.value)||0.5;
    const bufM = parseFloat(DOM.techBuffer.value)||0;
    const r = sizem*scale/2;
    const color = TECH_COLORS[_techMode]||'#555';
    if (bufM > 0) {
      const rBuf = r + bufM*scale;
      ctx.save(); ctx.globalAlpha=0.25;
      ctx.strokeStyle=color; ctx.lineWidth=0.7/z;
      ctx.setLineDash([5/z,5/z]);
      ctx.beginPath(); ctx.arc(mpos.x,mpos.y,rBuf,0,Math.PI*2);
      ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
    }
    ctx.save(); ctx.globalAlpha=0.45;
    const ghostAng = _techMode === 'skylight' ? (parseFloat(DOM.techRot.value)||0) * Math.PI/180 : 0;
    drawTechSymbol(ctx, _techMode, mpos.x, mpos.y, r, 2/z, color, ghostAng);
    ctx.restore();
  }

  // Snap vertici in modalitÃ  area
  if (mode==='area') {
    if (mpos && _pdfSnapEnabled && _pdfSnapPoints.length > 0) {
      const pdfHighR = 12/z;
      const cullR = 80/z;
      ctx.save();
      _pdfSnapPoints.forEach(sp => {
        const w = _pdfSnapToWorld(sp);
        if (!w) return;
        const dx=mpos.x-w.x, dy=mpos.y-w.y, d2=dx*dx+dy*dy;
        if(d2>cullR*cullR) return;
        const isNear = d2 < pdfHighR*pdfHighR;
        ctx.beginPath();
        const r = isNear ? 6/z : 3/z;
        ctx.moveTo(w.x, w.y-r); ctx.lineTo(w.x+r, w.y);
        ctx.lineTo(w.x, w.y+r); ctx.lineTo(w.x-r, w.y);
        ctx.closePath();
        ctx.fillStyle = isNear ? 'rgba(59,130,246,0.8)' : 'rgba(59,130,246,0.3)';
        ctx.fill();
        if (isNear) {
          ctx.strokeStyle='#3b82f6'; ctx.lineWidth=1.5/z; ctx.stroke();
          ctx.save(); ctx.font=`bold ${10/z}px sans-serif`; ctx.textAlign='center';
          const ly2=w.y-14/z; const tw=ctx.measureText('PDF').width+8/z;
          ctx.fillStyle='rgba(37,99,235,0.92)'; ctx.fillRect(w.x-tw/2,ly2-8/z,tw,13/z);
          ctx.fillStyle='#fff'; ctx.textBaseline='middle'; ctx.fillText('PDF',w.x,ly2); ctx.restore();
        }
      });
      ctx.restore();
    }
    if (mpos) {
      const allVerts=[];
      installableAreas.forEach(a=>allVerts.push(...a.points));
      exclusionAreas.forEach(a=>allVerts.push(...a.points));
      const snapR=8/z, drawR=60/z;
      allVerts.forEach(vp=>{
        const dx=mpos.x-vp.x, dy=mpos.y-vp.y, d2=dx*dx+dy*dy;
        if(d2>drawR*drawR) return;
        const isNear=d2<snapR*snapR;
        ctx.beginPath(); ctx.arc(vp.x,vp.y,(isNear?9:5)/z,0,Math.PI*2);
        ctx.strokeStyle=isNear?'#f59e0b':'rgba(255,255,255,0.55)'; ctx.lineWidth=(isNear?2.5:1.5)/z; ctx.stroke();
        if(isNear){
          ctx.fillStyle='rgba(245,158,11,0.25)'; ctx.fill();
          ctx.save(); ctx.font=`bold ${10/z}px sans-serif`; ctx.textAlign='center';
          const ly2=vp.y-16/z; const tw=ctx.measureText('SNAP').width+8/z;
          ctx.fillStyle='rgba(245,158,11,0.92)'; ctx.fillRect(vp.x-tw/2,ly2-8/z,tw,13/z);
          ctx.fillStyle='#fff'; ctx.textBaseline='middle'; ctx.fillText('SNAP',vp.x,ly2); ctx.restore();
        }
      });
    }
  }

  // Area in costruzione
  if (mode==='area' && curPts.length>0 && mpos) {
    const color = curAreaType==='installable' ? AREA_COLORS[installableAreas.length%AREA_COLORS.length].stroke : '#dc2626';
    if(curPts.length>=3){
      const fillColor=curAreaType==='installable'?AREA_COLORS[installableAreas.length%AREA_COLORS.length].fill.replace('0.15','0.25'):'rgba(220,38,38,0.20)';
      ctx.fillStyle=fillColor; ctx.beginPath(); ctx.moveTo(curPts[0].x,curPts[0].y);
      for(let i=1;i<curPts.length;i++) ctx.lineTo(curPts[i].x,curPts[i].y);
      ctx.closePath(); ctx.fill();
    }
    ctx.shadowColor='rgba(255,255,255,0.7)'; ctx.shadowBlur=4/z; ctx.strokeStyle=color; ctx.lineWidth=3/z;
    ctx.beginPath(); ctx.moveTo(curPts[0].x,curPts[0].y);
    for(let i=1;i<curPts.length;i++) ctx.lineTo(curPts[i].x,curPts[i].y);
    ctx.stroke(); ctx.shadowBlur=0;
    const last=curPts[curPts.length-1];
    const targetPt=orthoPreviewPt||mpos;
    const isVertexSnap=orthoPreviewPt&&(()=>{
      const vpts=[];
      installableAreas.forEach(a=>vpts.push(...a.points));
      exclusionAreas.forEach(a=>vpts.push(...a.points));
      return vpts.some(vp=>Math.abs(vp.x-targetPt.x)<0.5&&Math.abs(vp.y-targetPt.y)<0.5);
    })();
    const isOrthoSnap=orthoPreviewPt&&!isVertexSnap&&(Math.abs(targetPt.x-mpos.x)>0.5||Math.abs(targetPt.y-mpos.y)>0.5);
    const lineColor=isOrthoSnap?'rgba(245,158,11,0.65)':color;
    ctx.strokeStyle='rgba(255,255,255,0.55)'; ctx.lineWidth=2/z; ctx.setLineDash([5/z,5/z]);
    ctx.beginPath(); ctx.moveTo(last.x,last.y); ctx.lineTo(targetPt.x,targetPt.y); ctx.stroke();
    ctx.strokeStyle=lineColor; ctx.lineWidth=1.2/z;
    ctx.beginPath(); ctx.moveTo(last.x,last.y); ctx.lineTo(targetPt.x,targetPt.y); ctx.stroke();
    ctx.setLineDash([]);
    if(isVertexSnap||isOrthoSnap){
      ctx.beginPath(); ctx.arc(targetPt.x,targetPt.y,(isOrthoSnap?4:7)/z,0,Math.PI*2);
      ctx.fillStyle=isOrthoSnap?'rgba(245,158,11,0.45)':'rgba(245,158,11,0.85)'; ctx.fill();
      if(!isOrthoSnap){ctx.strokeStyle='#fff'; ctx.lineWidth=2/z; ctx.stroke();}
    }
    if(curPts.length>=2){
      const p0=curPts[0], p1=curPts[1];
      const dx=p1.x-p0.x, dy=p1.y-p0.y, len=Math.sqrt(dx*dx+dy*dy);
      if(len>1){
        const ux=dx/len, uy=dy/len, vx=-uy, vy=ux;
        const mpV=(mpos.x-p0.x)*vx+(mpos.y-p0.y)*vy;
        const minV=Math.min(0,mpV), maxV=Math.max(0,mpV);
        const r=[
          {x:p0.x+0*ux+minV*vx, y:p0.y+0*uy+minV*vy},
          {x:p0.x+len*ux+minV*vx, y:p0.y+len*uy+minV*vy},
          {x:p0.x+len*ux+maxV*vx, y:p0.y+len*uy+maxV*vy},
          {x:p0.x+0*ux+maxV*vx, y:p0.y+0*uy+maxV*vy}
        ];
        ctx.setLineDash([3/z,5/z]); ctx.strokeStyle='rgba(100,180,100,0.4)'; ctx.lineWidth=1/z;
        ctx.beginPath(); ctx.moveTo(r[0].x,r[0].y); r.forEach(pt=>ctx.lineTo(pt.x,pt.y)); ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);
      }
    }
    if(curPts.length>=3){
      const fp=curPts[0];
      ctx.strokeStyle='rgba(255,255,255,0.8)'; ctx.lineWidth=3/z; ctx.setLineDash([5/z,4/z]);
      ctx.beginPath(); ctx.moveTo(targetPt.x,targetPt.y); ctx.lineTo(fp.x,fp.y); ctx.stroke();
      ctx.strokeStyle='rgba(100,100,100,0.7)'; ctx.lineWidth=1.5/z;
      ctx.beginPath(); ctx.moveTo(targetPt.x,targetPt.y); ctx.lineTo(fp.x,fp.y); ctx.stroke(); ctx.setLineDash([]);
      const sd=Math.sqrt((targetPt.x-fp.x)**2+(targetPt.y-fp.y)**2)*z;
      const snapActive=sd<15;
      ctx.beginPath(); ctx.arc(fp.x,fp.y,(snapActive?12:7)/z,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.fill();
      ctx.beginPath(); ctx.arc(fp.x,fp.y,(snapActive?8:4)/z,0,Math.PI*2);
      ctx.fillStyle=snapActive?color:'rgba(255,255,255,0.9)'; ctx.strokeStyle=color; ctx.lineWidth=2.5/z; ctx.fill(); ctx.stroke();
      if(snapActive){
        ctx.save(); ctx.font=`bold ${11/z}px sans-serif`; ctx.fillStyle='rgba(0,0,0,0.85)'; ctx.textAlign='center';
        const snY=fp.y-(15/z); ctx.fillRect(fp.x-22/z,snY-10/z,44/z,13/z); ctx.fillStyle='#fff'; ctx.fillText('CHIUDI',fp.x,snY); ctx.restore();
      }
    }
    curPts.forEach((pt,i)=>{
      if(i===0&&curPts.length>=3) return;
      ctx.beginPath(); ctx.arc(pt.x,pt.y,7/z,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,0.8)'; ctx.fill();
      ctx.beginPath(); ctx.arc(pt.x,pt.y,4.5/z,0,Math.PI*2); ctx.fillStyle=color; ctx.strokeStyle='#fff'; ctx.lineWidth=1.5/z; ctx.fill(); ctx.stroke();
    });
    ctx.save(); ctx.font=`${11/z}px sans-serif`;
    const hint=curPts.length>=3?'Dbl-click/Enter: chiudi Â· R: rettangolo Â· D: distanza Â· ESC: annulla':'Click: aggiungi vertice Â· R: rettangolo Â· D: distanza Â· ESC: annulla';
    const tw=ctx.measureText(hint).width+10/z;
    ctx.fillStyle='rgba(255,255,255,0.88)'; ctx.fillRect(mpos.x+8/z,mpos.y-20/z,tw,16/z);
    ctx.fillStyle='#333'; ctx.textAlign='left'; ctx.fillText(hint,mpos.x+13/z,mpos.y-8/z); ctx.restore();
  }

  // Preview incolla area non installabile
  if (_copyExclMode && _copyExclPts && mpos) {
    ctx.save();
    ctx.translate(mpos.x, mpos.y);
    ctx.fillStyle='rgba(220,38,38,0.25)';
    ctx.strokeStyle='#dc2626';
    ctx.lineWidth=2/z;
    ctx.setLineDash([8/z,4/z]);
    ctx.beginPath();
    ctx.moveTo(_copyExclPts[0].x,_copyExclPts[0].y);
    for(let i=1;i<_copyExclPts.length;i++) ctx.lineTo(_copyExclPts[i].x,_copyExclPts[i].y);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.setLineDash([]);
    const cs=7/z;
    ctx.strokeStyle='rgba(220,38,38,0.8)'; ctx.lineWidth=1.5/z;
    ctx.beginPath(); ctx.moveTo(-cs,0); ctx.lineTo(cs,0); ctx.moveTo(0,-cs); ctx.lineTo(0,cs); ctx.stroke();
    ctx.restore();
  }

  // Freccia esposizione in corso
  if (_expArrowMode && mpos) {
    const area = installableAreas[_expArrowAreaIdx];
    if (area) {
      const ac = AREA_COLORS[_expArrowAreaIdx % AREA_COLORS.length];
      ctx.save();
      ctx.fillStyle = ac.fill.replace('0.15','0.35');
      ctx.strokeStyle = ac.stroke; ctx.lineWidth = 2.5/z;
      ctx.beginPath(); ctx.moveTo(area.points[0].x, area.points[0].y);
      area.points.forEach((pt,i) => { if(i) ctx.lineTo(pt.x, pt.y); });
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    if (_expArrowStart) {
      const end = _expArrowEnd || mpos;
      const dx = end.x - _expArrowStart.x;
      const dy = end.y - _expArrowStart.y;
      const len = Math.sqrt(dx*dx + dy*dy);
      if (len > 2/z) {
        const ux = dx/len, uy = dy/len;
        const hw = 12/z;
        const tip = { x: _expArrowStart.x + ux*len, y: _expArrowStart.y + uy*len };
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 5/z;
        ctx.beginPath(); ctx.moveTo(_expArrowStart.x, _expArrowStart.y); ctx.lineTo(tip.x, tip.y); ctx.stroke();
        ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2.5/z;
        ctx.beginPath(); ctx.moveTo(_expArrowStart.x, _expArrowStart.y); ctx.lineTo(tip.x, tip.y); ctx.stroke();
        ctx.fillStyle = '#22c55e';
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 2/z;
        ctx.beginPath();
        ctx.moveTo(tip.x, tip.y);
        ctx.lineTo(tip.x - ux*hw + uy*hw*0.5, tip.y - uy*hw - ux*hw*0.5);
        ctx.lineTo(tip.x - ux*hw - uy*hw*0.5, tip.y - uy*hw + ux*hw*0.5);
        ctx.closePath(); ctx.stroke(); ctx.fill();
        ctx.beginPath(); ctx.arc(_expArrowStart.x, _expArrowStart.y, 5/z, 0, Math.PI*2);
        ctx.fillStyle = '#fff'; ctx.fill();
        ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2/z; ctx.stroke();
        if (len > 20/z) {
          const ang = Math.atan2(dy, dx);
          const geo = ((ang * 180/Math.PI + 90) % 360 + 360) % 360;
          const dirs = ['N','NE','E','SE','S','SW','W','NW'];
          const EL = {N:'Nord',NE:'Nord-Est',E:'Est',SE:'Sud-Est',S:'Sud',SW:'Sud-Ovest',W:'Ovest',NW:'Nord-Ovest'};
          const dirLabel = EL[dirs[Math.round(geo/45)%8]];
          ctx.save();
          ctx.font = `bold ${11/z}px sans-serif`;
          const tw = ctx.measureText(dirLabel).width + 10/z;
          ctx.fillStyle = 'rgba(255,255,255,0.88)';
          ctx.fillRect(mpos.x+8/z, mpos.y-20/z, tw, 16/z);
          ctx.fillStyle = '#16a34a'; ctx.textAlign='left'; ctx.textBaseline='middle';
          ctx.fillText(dirLabel, mpos.x+13/z, mpos.y-12/z);
          ctx.restore();
        }
        ctx.restore();
      }
    } else {
      ctx.save();
      ctx.font = `${11/z}px sans-serif`;
      const hint = 'Click: origine Â· trascina verso la falda Â· ESC: salta';
      const tw = ctx.measureText(hint).width + 10/z;
      ctx.fillStyle = 'rgba(255,255,255,0.88)';
      ctx.fillRect(mpos.x+8/z, mpos.y-20/z, tw, 16/z);
      ctx.fillStyle = '#333'; ctx.textAlign='left';
      ctx.fillText(hint, mpos.x+13/z, mpos.y-8/z);
      ctx.restore();
    }
  }

  // Pannelli â€” pass 1: LOD + color batching
  // Lookup per filtro inverter (costruito una volta per frame)
  const _strInvMap = new Map();
  if (_highlightInvIdx >= 0) strings.forEach(s => _strInvMap.set(s.id, s.invIdx ?? -1));
  const _isDimmed = (pan) => _highlightInvIdx >= 0 && !!pan.strId && _strInvMap.get(pan.strId) !== _highlightInvIdx;

  const vpLeft   = (-canvas.clientWidth/2  - ox) / z;
  const vpRight  = ( canvas.clientWidth/2  - ox) / z;
  const vpTop    = (-canvas.clientHeight/2 - oy) / z;
  const vpBottom = ( canvas.clientHeight/2 - oy) / z;
  const panelScreenPx = (panels.length > 0 ? panels[0].w : 0) * z;
  const useLOD = panelScreenPx < 8;
  if (useLOD) {
    const colorPaths = new Map();
    panels.forEach(pan => {
      const fc = (stringsVisible && pan.stringColor) ? pan.stringColor : '#1e3a5f';
      if (!colorPaths.has(fc)) colorPaths.set(fc, new Path2D());
      const path = colorPaths.get(fc);
      if (pan.axisUx !== undefined) {
        const {axisUx:ux,axisUy:uy,axisVx:vx,axisVy:vy,localU:u,localV:v,w,h} = pan;
        const cx_ = (u+w/2)*ux+(v+h/2)*vx, cy_ = (u+w/2)*uy+(v+h/2)*vy;
        if (cx_<vpLeft-w||cx_>vpRight+w||cy_<vpTop-h||cy_>vpBottom+h) return;
        path.moveTo(u*ux+v*vx,u*uy+v*vy); path.lineTo((u+w)*ux+v*vx,(u+w)*uy+v*vy);
        path.lineTo((u+w)*ux+(v+h)*vx,(u+w)*uy+(v+h)*vy); path.lineTo(u*ux+(v+h)*vx,u*uy+(v+h)*vy);
        path.closePath();
      } else {
        if (pan.x>vpRight||pan.x+pan.w<vpLeft||pan.y>vpBottom||pan.y+pan.h<vpTop) return;
        path.rect(pan.x, pan.y, pan.w, pan.h);
      }
    });
    colorPaths.forEach((path, color) => { ctx.fillStyle=color; ctx.fill(path); });
    const borderPath = new Path2D();
    panels.forEach(pan => {
      if (pan.axisUx !== undefined) {
        const {axisUx:ux,axisUy:uy,axisVx:vx,axisVy:vy,localU:u,localV:v,w,h} = pan;
        const cx_=(u+w/2)*ux+(v+h/2)*vx, cy_=(u+w/2)*uy+(v+h/2)*vy;
        if (cx_<vpLeft-w||cx_>vpRight+w||cy_<vpTop-h||cy_>vpBottom+h) return;
        borderPath.moveTo(u*ux+v*vx,u*uy+v*vy); borderPath.lineTo((u+w)*ux+v*vx,(u+w)*uy+v*vy);
        borderPath.lineTo((u+w)*ux+(v+h)*vx,(u+w)*uy+(v+h)*vy); borderPath.lineTo(u*ux+(v+h)*vx,u*uy+(v+h)*vy);
        borderPath.closePath();
      } else {
        if (pan.x>vpRight||pan.x+pan.w<vpLeft||pan.y>vpBottom||pan.y+pan.h<vpTop) return;
        borderPath.rect(pan.x, pan.y, pan.w, pan.h);
      }
    });
    ctx.strokeStyle='rgba(255,255,255,0.35)'; ctx.lineWidth=0.8/z; ctx.stroke(borderPath);
    // Dim overlay LOD: scurisci i pannelli non appartenenti all'inverter selezionato
    if (_highlightInvIdx >= 0) {
      const dimPath = new Path2D();
      panels.forEach(pan => {
        if (!_isDimmed(pan)) return;
        if (pan.axisUx !== undefined) {
          const {axisUx:ux,axisUy:uy,axisVx:vx,axisVy:vy,localU:u,localV:v,w,h} = pan;
          const cx_=(u+w/2)*ux+(v+h/2)*vx, cy_=(u+w/2)*uy+(v+h/2)*vy;
          if (cx_<vpLeft-w||cx_>vpRight+w||cy_<vpTop-h||cy_>vpBottom+h) return;
          dimPath.moveTo(u*ux+v*vx,u*uy+v*vy); dimPath.lineTo((u+w)*ux+v*vx,(u+w)*uy+v*vy);
          dimPath.lineTo((u+w)*ux+(v+h)*vx,(u+w)*uy+(v+h)*vy); dimPath.lineTo(u*ux+(v+h)*vx,u*uy+(v+h)*vy);
          dimPath.closePath();
        } else {
          if (pan.x>vpRight||pan.x+pan.w<vpLeft||pan.y>vpBottom||pan.y+pan.h<vpTop) return;
          dimPath.rect(pan.x, pan.y, pan.w, pan.h);
        }
      });
      ctx.fillStyle = 'rgba(0,0,0,0.72)'; ctx.fill(dimPath);
    }
  } else {
    panels.forEach((pan) => {
      if (pan.axisUx !== undefined) {
        const {axisUx:ux,axisUy:uy,axisVx:vx,axisVy:vy,localU:u,localV:v,w,h} = pan;
        const cx_=(u+w/2)*ux+(v+h/2)*vx, cy_=(u+w/2)*uy+(v+h/2)*vy;
        if (cx_<vpLeft-w||cx_>vpRight+w||cy_<vpTop-h||cy_>vpBottom+h) return;
      } else {
        if (pan.x>vpRight||pan.x+pan.w<vpLeft||pan.y>vpBottom||pan.y+pan.h<vpTop) return;
      }
      const fillStyle = (stringsVisible && pan.stringColor) ? pan.stringColor : '#1e3a5f';
      const dimmed = _isDimmed(pan);
      if (dimmed) { ctx.save(); ctx.globalAlpha = 0.18; }
      drawPanel(ctx, pan, fillStyle, '#ffffff', 3/z, null, 0, z);
      if (dimmed) ctx.restore();
    });
  }

  // Pannelli â€” pass 2: overlay hover/selection + label stringa
  panels.forEach((pan, idx) => {
    if (pan.axisUx !== undefined) {
      const {axisUx:ux,axisUy:uy,axisVx:vx,axisVy:vy,localU:u,localV:v,w,h} = pan;
      const cx_=(u+w/2)*ux+(v+h/2)*vx, cy_=(u+w/2)*uy+(v+h/2)*vy;
      if (cx_<vpLeft-w||cx_>vpRight+w||cy_<vpTop-h||cy_>vpBottom+h) return;
    } else {
      if (pan.x>vpRight||pan.x+pan.w<vpLeft||pan.y>vpBottom||pan.y+pan.h<vpTop) return;
    }
    const isSelected = selectedPanels.has(idx);
    const isHovered  = idx === hoveredPanel;
    const strokeStyle  = isSelected ? '#00e5ff' : '#f1c40f';
    const lineWidth    = isSelected ? 4/z : 3/z;
    const shadowColor  = isSelected ? 'rgba(0,229,255,0.9)' : 'rgba(241,196,15,0.9)';
    const shadowBlur   = isSelected ? 25/z : 18/z;
    if (isSelected || isHovered) {
      if (pan.axisUx !== undefined) {
        const {axisUx:ux,axisUy:uy,axisVx:vx,axisVy:vy,localU:u,localV:v,w,h} = pan;
        const c0={x:u*ux+v*vx,y:u*uy+v*vy}, c1={x:(u+w)*ux+v*vx,y:(u+w)*uy+v*vy};
        const c2={x:(u+w)*ux+(v+h)*vx,y:(u+w)*uy+(v+h)*vy}, c3={x:u*ux+(v+h)*vx,y:u*uy+(v+h)*vy};
        ctx.shadowColor=shadowColor; ctx.shadowBlur=shadowBlur; ctx.strokeStyle=strokeStyle; ctx.lineWidth=lineWidth;
        ctx.beginPath(); ctx.moveTo(c0.x,c0.y); ctx.lineTo(c1.x,c1.y); ctx.lineTo(c2.x,c2.y); ctx.lineTo(c3.x,c3.y); ctx.closePath(); ctx.stroke(); ctx.shadowBlur=0;
      } else {
        ctx.shadowColor=shadowColor; ctx.shadowBlur=shadowBlur; ctx.strokeStyle=strokeStyle; ctx.lineWidth=lineWidth;
        ctx.strokeRect(pan.x, pan.y, pan.w, pan.h); ctx.shadowBlur=0;
      }
    }
    if (stringsVisible && pan.strId && pan.w*z > 6 && !_isDimmed(pan)) {
      const cx_ = pan.axisUx !== undefined ? (pan.localU+pan.w/2)*pan.axisUx+(pan.localV+pan.h/2)*pan.axisVx : pan.x+pan.w/2;
      const cy_ = pan.axisUx !== undefined ? (pan.localU+pan.w/2)*pan.axisUy+(pan.localV+pan.h/2)*pan.axisVy : pan.y+pan.h/2;
      const fs = Math.min(pan.h*0.45, 14/z);
      ctx.save(); ctx.translate(cx_, cy_); ctx.rotate(pan.ang||0);
      ctx.font = `bold ${fs}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.shadowColor='rgba(0,0,0,0.7)'; ctx.shadowBlur=2/z; ctx.fillStyle='#ffffff';
      ctx.fillText(pan.strId, 0, 0); ctx.shadowBlur=0; ctx.restore();
    }
  });

  // Fasce camminamento (sopra pannelli, sotto i label)
  if (typeof installableAreas !== 'undefined') {
    ctx.save();
    installableAreas.forEach(area => {
      if (!area._walkways || area._walkways.length === 0) return;
      area._walkways.forEach(w => {
        const cs = w.corners;
        ctx.beginPath();
        ctx.moveTo(cs[0].x, cs[0].y);
        ctx.lineTo(cs[1].x, cs[1].y);
        ctx.lineTo(cs[2].x, cs[2].y);
        ctx.lineTo(cs[3].x, cs[3].y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(251,146,60,0.13)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(251,146,60,0.7)';
        ctx.lineWidth = 1.2 / z;
        ctx.setLineDash([4 / z, 3 / z]);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    });
    ctx.restore();
  }

  // Cerchi ombra camini (sopra pannelli)
  technicalObjects.forEach(obj => {
    if (obj.type !== 'chimney') return;
    const _h = obj.heightM || 1.5;
    const shadowR = scale > 1
      ? _h * scale / Math.tan(20 * Math.PI / 180)
      : (obj.sizePx / 2) * 3.5;
    const obstacleDist = parseFloat(DOM.obstacleDistance ? DOM.obstacleDistance.value : 0) || 0;
    const exclR = Math.max(obj.sizePx / 2 + obstacleDist * scale, shadowR);
    ctx.save();
    ctx.globalAlpha = 0.10;
    ctx.fillStyle = '#000000';
    ctx.beginPath(); ctx.arc(obj.x, obj.y, shadowR, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 0.55;
    ctx.setLineDash([6/z, 4/z]);
    ctx.lineWidth = 1.4/z; ctx.strokeStyle = '#555555';
    ctx.beginPath(); ctx.arc(obj.x, obj.y, shadowR, 0, Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 0.75;
    ctx.setLineDash([5/z, 3/z]);
    ctx.lineWidth = 2/z; ctx.strokeStyle = '#dc2626';
    ctx.beginPath(); ctx.arc(obj.x, obj.y, exclR, 0, Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);
    if (scale > 1) {
      const shadowM = (_h / Math.tan(20 * Math.PI / 180)).toFixed(1);
      const exclM   = (exclR / scale).toFixed(1);
      ctx.globalAlpha = 0.9;
      const fs = Math.max(9/z, shadowR * 0.08);
      ctx.font = 'bold ' + fs + 'px var(--font-main)';
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.lineWidth = 2.5/z; ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.fillStyle = '#444444';
      ctx.strokeText('ombra ' + shadowM + 'm', obj.x, obj.y - shadowR - 2/z);
      ctx.fillText('ombra ' + shadowM + 'm', obj.x, obj.y - shadowR - 2/z);
      if (Math.abs(exclR - shadowR) > scale * 0.1) {
        ctx.fillStyle = '#dc2626';
        ctx.strokeText('escl. ' + exclM + 'm', obj.x, obj.y - exclR - 2/z);
        ctx.fillText('escl. ' + exclM + 'm', obj.x, obj.y - exclR - 2/z);
      }
    }
    ctx.restore();
  });

  // Snap magnetico: ghost preview durante drag
  if (snapPreviewPos && isDraggingPanels) {
    const sp = snapPreviewPos;
    const ux=sp.axisUx, uy=sp.axisUy, vx=sp.axisVx, vy=sp.axisVy;
    const u=sp.localU, v=sp.localV, w=sp.w, h=sp.h;
    const c0={x:u*ux+v*vx, y:u*uy+v*vy};
    const c1={x:(u+w)*ux+v*vx, y:(u+w)*uy+v*vy};
    const c2={x:(u+w)*ux+(v+h)*vx, y:(u+w)*uy+(v+h)*vy};
    const c3={x:u*ux+(v+h)*vx, y:u*uy+(v+h)*vy};
    ctx.save();
    if (sp.snapped) {
      ctx.strokeStyle='#10b981'; ctx.lineWidth=2/z;
      ctx.fillStyle='rgba(16,185,129,0.15)';
      ctx.shadowColor='rgba(16,185,129,0.8)'; ctx.shadowBlur=12/z;
    } else {
      ctx.setLineDash([5/z,4/z]);
      ctx.strokeStyle='rgba(245,158,11,0.85)'; ctx.lineWidth=1.5/z;
      ctx.fillStyle='rgba(245,158,11,0.08)';
      ctx.shadowColor='rgba(245,158,11,0.5)'; ctx.shadowBlur=8/z;
    }
    ctx.beginPath();
    ctx.moveTo(c0.x,c0.y); ctx.lineTo(c1.x,c1.y);
    ctx.lineTo(c2.x,c2.y); ctx.lineTo(c3.x,c3.y); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.setLineDash([]); ctx.shadowBlur=0;
    const cx_=(c0.x+c2.x)/2, cy_=(c0.y+c2.y)/2;
    ctx.beginPath(); ctx.arc(cx_,cy_,4/z,0,Math.PI*2);
    ctx.fillStyle = sp.snapped ? '#10b981' : 'rgba(245,158,11,0.9)';
    ctx.shadowColor = sp.snapped ? 'rgba(16,185,129,0.9)' : 'rgba(245,158,11,0.7)';
    ctx.shadowBlur = 8/z;
    ctx.fill(); ctx.shadowBlur=0;
    ctx.restore();
  }

  // Cursore custom
  if((mode==='cal'||mode==='area')&&mpos){
    const mx_=mpos.x, my_=mpos.y, R=10/z, gap2=3/z, dot=2/z;
    ctx.save(); ctx.strokeStyle='#ffffff'; ctx.lineWidth=3/z;
    ctx.beginPath(); ctx.moveTo(mx_-R-gap2,my_); ctx.lineTo(mx_-gap2,my_); ctx.moveTo(mx_+gap2,my_); ctx.lineTo(mx_+R+gap2,my_); ctx.moveTo(mx_,my_-R-gap2); ctx.lineTo(mx_,my_-gap2); ctx.moveTo(mx_,my_+gap2); ctx.lineTo(mx_,my_+R+gap2); ctx.stroke();
    ctx.lineWidth=1.5/z; ctx.strokeStyle=mode==='cal'?'#f97316':(curAreaType==='exclusion'?'#ef4444':'#22c55e');
    ctx.beginPath(); ctx.moveTo(mx_-R-gap2,my_); ctx.lineTo(mx_-gap2,my_); ctx.moveTo(mx_+gap2,my_); ctx.lineTo(mx_+R+gap2,my_); ctx.moveTo(mx_,my_-R-gap2); ctx.lineTo(mx_,my_-gap2); ctx.moveTo(mx_,my_+gap2); ctx.lineTo(mx_,my_+R+gap2); ctx.stroke();
    ctx.fillStyle=mode==='cal'?'#f97316':(curAreaType==='exclusion'?'#ef4444':'#22c55e');
    ctx.beginPath(); ctx.arc(mx_,my_,dot,0,Math.PI*2); ctx.fill(); ctx.restore();
  }
  ctx.restore();
}
