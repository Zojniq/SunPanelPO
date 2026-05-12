# Solar Designer Pro — Guida per Claude Code

## Panoramica

App desktop **Electron** per il dimensionamento di impianti fotovoltaici.
Entry point: `solar-designer-v89.html` (tutto il CSS/JS è esterno).
Build: `npm run dist` → installer Windows NSIS.

## Struttura file

```
solar-designer-v89.html   ← HTML principale + struttura UI (pannello sinistro + canvas)
js/
  config.js     ← CONFIG: costanti globali (STORAGE_KEY, MAX_HISTORY, AREA_COLORS, TECH, …)
  state.js      ← Variabili globali di stato (MODULE_PRESETS → data/modules.data.js, INV_PRESETS → data/inverters.data.js)
  ui.js         ← init(), event handlers, DOM cache, area lists, tech objects, module lib
  canvas.js     ← draw(), rendering canvas (pannelli, aree, ostacoli, snap, zoom/pan)
  panels.js     ← layout pannelli dentro le aree (scanline algorithm)
  strings.js    ← updateStringPreview(), confirmString(), genStrings(), adjustPanelCount()
  cables.js     ← calcCables(), renderUnifilare(), exportUnifilare(), applyModulePreset(); consumes globalThis.SDPSizing
  lib/sizing.js ← Pure sizing helpers (calcSection, calcSectionAC, calcVoltageDrop, getCableCapacity) + tables; exported as globalThis.SDPSizing
  storage.js    ← saveState(), loadState(), undo/redo
  export.js     ← esportazione PNG, DXF, report PDF
  pdf.js        ← caricamento PDF planimetrica via pdf.js
css/
  variables.css   ← CSS custom properties (colori, spacing, font)
  layout.css      ← struttura sidebar + canvas
  components.css  ← bottoni, input, sezioni accordion, modal, toast
  canvas.css      ← stili canvas container
```

## Architettura UI

Il pannello sinistro è diviso in **step accordion**:
- **S1** — Calibrazione scala (punti cal + distanza reale)
- **S2** — Aree installabili / esclusione (disegno poligoni su canvas)
- **S3** — Modulo FV (dimensioni, dati elettrici, preset libreria, tcoef)
- **S4** — Ostacoli tecnici (camino, antenna, HVAC…)
- **S5** — Calcolo stringhe + parco inverter
- **S6** — Dimensionamento cavi + schema unifilare

## Variabili di stato principali (state.js)

```javascript
let installableAreas = [];   // [{points, type, orientation, …}]
let exclusionAreas   = [];   // [{points}]
let technicalObjects = [];   // [{type, x, y, sizePx, bufferM, ang, …}]
let panels  = [];            // pannelli posizionati [{x,y,w,h,areaIdx,…}]
let strings = [];            // [{id, name, color, panels[]}]
let _inverterList = [];      // [{key, brand, model, pac, mppt, strPerMppt, vMin, vMax, iMax, vocMax, ac, qty}]
let _modulePresetKey = null; // indice in MODULE_PRESETS o null
let scale = 1;               // px per metro reale
let z = 1; let ox = 0; let oy = 0;  // zoom e pan
```

## Libreria moduli (state.js → MODULE_PRESETS)

15 preset con: `{ brand, name, pw, pl, pp, isc, voc, impp, vmpp, tcoef_voc, tcoef_pmax }`
Brand: JA Solar, LONGi, Canadian Solar, Jinko Solar, Risen Energy, Generico.
Popolato nel dropdown `#modulePresetSel` via `_populateModulePresets()` (chiamata in `init()`).
Applicato con `applyModulePreset(idx)` in cables.js.

## Libreria inverter (cables.js → INV_PRESETS)

Chiavi: `r5_1k5 … r5_8k` (SAJ mono), `at3_3k … at3_12k` (SAJ tri), `c6_12k … c6_100k` (SAJ industrial).
Struttura: `{ brand, model, pac, mppt, strPerMppt, vMin, vMax, iMax, vocMax, ac }`.
Aggiunto con `addInverterToList()`, rimosso con `removeInverterFromList(idx)`.

## Correzione termica (CEI EN 62548)

Usata in `updateStringPreview()` (strings.js) e `updateInvValidation()` (cables.js):
```javascript
const T_min = -10, T_max = 70, T_stc = 25;
const kVoc   = tcoef_voc / 100;           // da %/°C a 1/°C
const vocCold  = voc  * (1 + kVoc * (T_min - T_stc));  // Voc@-10°C (caso peggiore)
const vmppHot  = vmpp * (1 + kVoc * (T_max - T_stc));  // Vmpp@70°C (caso peggiore)
// n_max_voc  = floor(vocMax  / vocCold)
// n_min_vmpp = ceil(vMin    / vmppHot)
```
Campi HTML: `#moduleTcoefVoc`, `#moduleTcoefPmax`.

## Schema unifilare (cables.js → renderUnifilare)

SVG generato dinamicamente. Struttura top→bottom:
```
Rete BT → NT1 (kWh) → POD split+Utenze → Quadro Generale BT (DGFV-Q2+SPD AC)
→ Q3 sezionatore → M0 misuratore → Quadro Inverter (Q4+inverter/i) → Barra DC
→ Stringhe (fusibili+cavi+PV) con box MPPT tratteggiati
→ Cartiglio (info | revisioni | TAV.02)
```

**Multi-inverter**: se `_inverterList` ha più unità/qty, i box inverter vengono affiancati nel Quadro Inverter. I box MPPT sono colorati per inverter (magenta=inv1, blu=inv2, marrone=inv3, verde=inv4).

Esportazione: `exportUnifilare('svg')` o `exportUnifilare('png')` (2× risoluzione via Canvas API).

## Funzioni chiave per modifica

| Funzione | File | Scopo |
|---|---|---|
| `calcSection(I, L, dV, mat, nCond)` | lib/sizing.js | Sezione cavo DC |
| `calcSectionAC(I, L, dV, mat, nCond, cosfi)` | lib/sizing.js | Sezione cavo AC |
| `calcCables()` | cables.js:79 | Ricalcola tutto il dimensionamento |
| `renderUnifilare()` | cables.js:575 | Genera SVG schema unifilare |
| `updateInvValidation()` | cables.js:465 | Semaforo compatibilità stringa-inverter |
| `applyModulePreset(idx)` | cables.js:412 | Applica preset modulo al form |
| `updateStringPreview()` | strings.js:29 | Calcolo moduli/stringa + correzione termica |
| `_relayout()` | ui.js:269 | Rigenera layout pannelli su tutte le aree |
| `draw()` | canvas.js | Ridisegna il canvas |
| `saveState()` / `loadState()` | storage.js | Persistenza localStorage |

## Convenzioni codice

- Coordinate canvas: **world coords** (pixel immagine); coordinate schermo = `worldToScreen(pt)`
- `DOM` object (ui.js:43) = cache degli elementi HTML più usati — aggiungere nuovi elementi lì
- Modifiche che impattano il layout pannelli devono chiamare `invalidateLayoutCache()` + `_relayoutDebounced()`
- Modifiche ai dati elettrici chiamano `syncCableState()` (= alias di `calcCables()`)
- `snapshot()` per aggiungere stato undo stack
- Toast notifiche: `showToast(msg, 'info'|'warn'|'error')`

## Campi HTML importanti (S3 — modulo)

`#pw`, `#pl`, `#pp` — dimensioni fisiche e potenza  
`#moduleIsc`, `#moduleVoc`, `#moduleImpp`, `#moduleVmpp` — dati elettrici STC  
`#moduleTcoefVoc`, `#moduleTcoefPmax` — coefficienti temperatura (%/°C)  
`#modulePresetSel` — dropdown preset (popolato da `_populateModulePresets()`)

## Campi HTML importanti (S5/S6 — inverter/cavi)

`#invVmpptMin`, `#invVmpptMax`, `#invVocMax`, `#invImaxMppt`, `#invPac` — hidden, settati da `_syncHiddenInvFields()`  
`#invStrTot` — stringhe totali dal parco inverter  
`#cableLenString`, `#cableLenMain`, `#cableLenAC`, `#cableDropDC`, `#cableMaterial`, `#cableSystemAC`

## Note importanti

- Il file HTML principale è `solar-designer-v89.html` (non rinominare — è referenziato in main.js Electron)
- Dopo ogni modifica a cables.js: verificare con `node --check js/cables.js`
- Il `numInverters` hidden non è più la fonte primaria — usare `_inverterList` (parco inverter)
- DC/AC ratio max 1.33 per CEI 0-21 (residenziale)
- `strPerMppt` = stringhe in parallelo per ingresso MPPT (dal datasheet inverter)
