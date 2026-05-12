'use strict';

const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// ── Crash log to disk (AP-12 / PR-31, T2.7.1 + T2.7.2 + PR-32 T2.7.3) ──
const LOG_MAX_BYTES  = 1024 * 1024;   // 1 MB rotation threshold
const LOG_KEEP_FILES = 5;             // app.log + app.log.1..4

/** Rotate <dir>/app.log → .1 → .2 → .3 → .4 (oldest dropped) when size
 *  exceeds maxBytes. Synchronous, fail-closed, never throws. */
function _rotateCrashLogsIfNeeded(logFilePath, maxBytes) {
  try {
    if (!fs.existsSync(logFilePath)) return;
    const st = fs.statSync(logFilePath);
    if (st.size < maxBytes) return;
    // Drop the oldest, then shift .N → .(N+1) down to .1, then base → .1.
    const oldest = logFilePath + '.' + (LOG_KEEP_FILES - 1);   // app.log.4
    if (fs.existsSync(oldest)) fs.unlinkSync(oldest);
    for (let i = LOG_KEEP_FILES - 2; i >= 1; i--) {            // 3..1
      const from = logFilePath + '.' + i;
      const to   = logFilePath + '.' + (i + 1);
      if (fs.existsSync(from)) fs.renameSync(from, to);
    }
    fs.renameSync(logFilePath, logFilePath + '.1');
  } catch (e) {
    console.error('[SDP main] log rotate failed:', e && e.message);
  }
}

function _formatLogEntry(payload) {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  const ts = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
             ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  const src = payload.source || 'renderer.error';
  const lines = ['[' + ts + '] [' + src + ']'];
  if (payload.message) lines.push('message: ' + payload.message);
  if (payload.file)    lines.push('file:    ' + payload.file);
  if (payload.lineno != null) lines.push('lineno:  ' + payload.lineno);
  if (payload.colno  != null) lines.push('colno:   ' + payload.colno);
  if (payload.stack)   lines.push('stack:   ' + payload.stack);
  lines.push('');
  return lines.join('\n');
}

function _appendCrashLog(payload) {
  try {
    const dir = path.join(app.getPath('userData'), 'logs');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, 'app.log');
    _rotateCrashLogsIfNeeded(file, LOG_MAX_BYTES);
    fs.appendFileSync(file, _formatLogEntry(payload), 'utf-8');
  } catch (e) {
    // Logging path must never crash the main process.
    console.error('[SDP main] log write failed:', e && e.message);
  }
}

ipcMain.on('log:write', (_event, payload) => {
  if (payload && typeof payload === 'object') _appendCrashLog(payload);
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: 'Solar Designer Pro',
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false
  });

  win.loadFile('solar-designer-v89.html');

  // Mostra la finestra solo quando è pronta (evita flash bianco)
  win.once('ready-to-show', () => {
    win.show();
    if (!app.isPackaged) win.webContents.openDevTools();
  });

  // Menu semplificato
  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        { label: 'Esci', accelerator: 'Alt+F4', click: () => app.quit() }
      ]
    },
    {
      label: 'Visualizza',
      submenu: [
        { label: 'Ricarica', accelerator: 'F5', click: () => win.reload() },
        { label: 'Zoom +', accelerator: 'CmdOrCtrl+=', click: () => win.webContents.setZoomLevel(win.webContents.getZoomLevel() + 0.5) },
        { label: 'Zoom -', accelerator: 'CmdOrCtrl+-', click: () => win.webContents.setZoomLevel(win.webContents.getZoomLevel() - 0.5) },
        { label: 'Zoom originale', accelerator: 'CmdOrCtrl+0', click: () => win.webContents.setZoomLevel(0) },
        { type: 'separator' },
        { label: 'Schermo intero', accelerator: 'F11', click: () => win.setFullScreen(!win.isFullScreen()) }
      ]
    },
    {
      label: 'Aiuto',
      submenu: [
        { label: 'Solar Designer Pro v1.0', enabled: false }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
