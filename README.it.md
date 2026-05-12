[ [English](README.md) | [Українська](README.uk.md) | **Italiano** ]

# Solar Designer Pro

Applicazione desktop per la progettazione di impianti fotovoltaici (FV)
conforme alle norme elettriche italiane (CEI 0-21, CEI 64-8,
CEI EN 62548, DCPREV-14030, CEI UNEL 35024). Single-Electron-shell
sopra un renderer vanilla-JS / Canvas / SVG, pensato per progettisti e
installatori qualificati che devono produrre documentazione di progetto,
schemi unifilari e pratiche GSE/GAUDÌ da un unico strumento, anche
offline.

L'interfaccia è in italiano per scelta progettuale: terminologia,
riferimenti normativi e unità di misura seguono le convenzioni dei
progettisti fotovoltaici italiani.

## Funzionalità principali

- **Importa planimetria** — immagine PNG o PDF come base, calibrata su
  una distanza nota per riportarla alla scala reale.
- **Disegno aree** — poligoni installabili / di esclusione sul canvas;
  ostacoli tecnici (camini, antenne, UTA/HVAC, lucernari, esalatori)
  con buffer di sicurezza antincendio per DCPREV-14030.
- **Layout automatico moduli** — algoritmo scanline con ricerca
  dell'orientamento, opzioni walkway e raggruppamento, decomposizione
  di aree concave.
- **Libreria moduli** — 15 preset basati su datasheet (JA Solar,
  LONGi, Canadian Solar, Jinko, Risen, Generico) più moduli definibili
  dall'utente.
- **Libreria inverter** — SAJ R5 monofase, AT3 trifase, C6 industriale;
  stringhe per MPPT in parallelo dai datasheet.
- **Validazione stringhe con correzione termica** — Voc a −10 °C e
  Vmpp a +70 °C rispetto ai limiti inverter (CEI EN 62548 §7).
- **Dimensionamento cavi** — DC stringa, DC principale, AC per caduta
  di tensione e portata in regime permanente (CEI UNEL 35024 Method
  B/C), con fattori di riduzione per posa e raggruppamento.
- **Schema unifilare (SLD)** — generazione SVG con commutazione BT/MT,
  cartiglio, lista revisioni, topologia BESS opzionale.
- **Esportazione** — SVG e PNG ad alta risoluzione per l'SLD; report
  PDF con cartiglio; CSV per pratiche GSE/GAUDÌ.
- **Formato file progetto `.sdproj`** — JSON versionato con blocchi
  `version`, `metadata`, `project`; finestre di dialogo Open/Save e
  auto-salvataggio in localStorage come recovery snapshot.
- **Log dei crash** — gli errori non gestiti del renderer vengono
  scritti su `<userData>/logs/app.log` con rotazione limitata
  (1 MB × 5 file).

## Flusso di lavoro

1. **S1** — caricamento planimetria (PNG o PDF).
2. **S2** — calibrazione scala da due punti.
3. **S3** — selezione o definizione del modulo FV.
4. **S4** — disegno aree installabili e di esclusione.
5. **S5** — posizionamento ostacoli tecnici con buffer di sicurezza.
6. **S6** — generazione layout pannelli; revisione risultati per area.
7. **S7** — configurazione inverter e stringhe.
8. **S8** — dimensionamento cavi DC e AC.
9. **S9** — generazione schema unifilare; esportazione deliverable
   (SVG / PNG / PDF / CSV GSE).

## Stack tecnologico

- **Electron 31** con `contextIsolation: true` e un piccolo
  preload-bridge per l'IPC di logging dei crash.
- **Vanilla JavaScript** in strict mode, concatenato da un piccolo
  script Node in `dist/app.js` (ES modules / TypeScript non ancora —
  pianificati nella roadmap di Fase 3).
- **HTML5 Canvas** per la modifica della planimetria; **SVG** per
  l'SLD.
- **PDF.js 3.11.174** (vendored, offline-first) per l'importazione di
  PDF.
- **electron-builder** per l'installer Windows NSIS.
- **ESLint 10** flat config; strict mode applicato a tutti i file.
- **Vitest 4** per i golden test sulle formule di dimensionamento cavi.
- **GitHub Actions** CI: lint, test, electron-builder `--dir` dry-run,
  upload degli artefatti.

## Struttura del repository

```
main.js                       Processo main di Electron
preload.js                    contextBridge IPC per il logging dei crash
solar-designer-v89.html       Renderer entry unico — DOM + UI shell
build/bundle.js               Bundler del renderer (concat → dist/app.js)
dist/app.js                   Bundle renderer generato
data/                         Librerie preset moduli / inverter built-in
js/                           Sorgenti renderer
  config.js, state.js         Costanti e stato globale
  storage.js                  .sdproj save/open, recovery, reader
  canvas.js, panels.js        Geometria, rendering, layout pannelli
  strings.js                  Configurazione stringhe e validazione
  pdf.js                      Importazione PDF planimetria
  export.js                   Esportazione PDF / JSON / SVG / PNG
  enhancements.js             Status bar, mini-mappa, scorciatoie
  ui.js                       init(), event handlers, widget
  lib/sizing.js               Helper di sizing puri (golden-tested)
  cables.js                   Orchestratore (calcCables, lista inverter,
                              preset moduli, toggle modali)
  cables/sld-render.js        Generazione SVG schema unifilare
  cables/sld-export.js        SLD → SVG/PNG, CSV GSE
  cables/verifiche.js         Validazione inverter, pannello verifiche
css/                          Fogli di stile dei componenti
vendor/pdfjs/                 PDF.js vendored (offline)
assets/fonts/                 Font JetBrains Mono vendored
docs/                         Doc di riferimento, schemi, lint baseline
schema unifilare/             Specifiche SLD in italiano
schemas/sdproj.v1.json        Schema .sdproj (informativo)
tests/                        Golden test Vitest + fixture
.github/workflows/ci.yml      Pipeline lint / test / build dry-run
```

Contratto di engineering (da leggere prima di qualsiasi modifica al
codice):

- [`INVARIANTS.md`](INVARIANTS.md) — invarianti fisici / workflow /
  output / dati.
- [`COMPLIANCE.md`](COMPLIANCE.md) — pinning delle edizioni CEI / EN /
  UNEL e mappa "formula → articolo".
- [`CRITICAL_FLOWS.md`](CRITICAL_FLOWS.md) — checklist smoke manuale.
- [`DO_NOT_TOUCH_PAIRS.md`](DO_NOT_TOUCH_PAIRS.md) — file che devono
  cambiare insieme.

## Per iniziare

Requisiti:

- Node.js LTS (≥ 20)
- npm 10+

```sh
git clone https://github.com/Zojniq/SunPanelPO.git
cd SunPanelPO
npm install
```

## Comandi build / run

| Comando | Scopo |
|---|---|
| `npm start` | Costruisce il renderer bundle e avvia l'app (dev) |
| `npm run build:bundle` | Rigenera solo `dist/app.js` |
| `npm test` | Esegue i golden test Vitest per il sizing cavi |
| `npm run lint` | Esegue ESLint (deve riportare 0 errori) |
| `npm run dist` | Costruisce l'installer Windows NSIS |

`npm start` e `npm run dist` rigenerano automaticamente il bundle.

## Stato attuale del progetto

Il progetto è in evoluzione attraverso un piano di professionalizzazione
multi-fase. **Fase 3 — Ristrutturazione architettonica è in corso.**

| Fase | Stato |
|---|---|
| 0 — Guardrails | completata |
| 1 — Immediate professional fixes | completata |
| 2 — Engineering foundation | completata (Gate D pronto, rischi tracciati) |
| 3 — Architecture restructuring | in corso |
| 4 — Product-grade capabilities | in attesa |
| 5 — Long-term evolution | gated |

### Avanzamento Fase 3

- **AP-14 — Integrazione bundler** ✅ Il concat-builder Node scrive
  `dist/app.js`; l'HTML carica un singolo script renderer.
- **AP-15 — Decomposizione `cables.js`** ✅ Suddiviso in orchestratore
  (`cables.js`), `cables/sld-render.js`, `cables/sld-export.js` e
  `cables/verifiche.js`. `cables.js` ridotto da ~2350 a ~460 righe.
- **AP-16 — Decomposizione `ui.js`** ⏭ prossimo.
- **AP-17 — Store di stato** — in attesa.
- **AP-18 — Adozione tipizzazione (JSDoc → TypeScript per nuovo codice)** —
  in attesa.
- **AP-19 — Sanitizzazione innerHTML** — in attesa.

## Note / limitazioni

- **Interfaccia in italiano.** Scelta progettuale: il prodotto è
  pensato per impianti FV italiani secondo le norme elettriche italiane.
- **Assunzioni di dominio per l'Italia** — temperatura minima modulo
  −10 °C, massima +70 °C, latitudine ~44° N per la stima delle
  ombre. L'uso fuori dall'Italia invalida i verdetti sulla finestra
  di stringa fino a revisione delle assunzioni.
- **È necessario il giudizio del progettista.** L'applicazione
  affianca il progettista qualificato, non lo sostituisce. Sezioni
  cavi, finestre stringhe e output verifiche devono essere riviste
  rispetto alle edizioni CEI in vigore al momento del progetto.
- **Un progetto per sessione.** Un solo progetto attivo alla volta;
  l'autosalvataggio mantiene uno snapshot di recovery in localStorage.
  `.sdproj` è il formato canonico user-managed per condivisione e
  archiviazione.
- **Mercato italiano.** I riferimenti normativi (CEI 0-21, CEI 64-8,
  CEI EN 62548, DCPREV-14030, CEI UNEL 35024) sono orientati all'Italia;
  l'esportazione GSE/GAUDÌ è il formato di pratica lato TSO italiano.

## Licenza

Proprietary. Gli asset vendored di terze parti mantengono le loro
licenze originali:

- `vendor/pdfjs/LICENSE` — Apache 2.0 (Mozilla pdf.js).
- `assets/fonts/OFL.txt` — SIL Open Font License 1.1 (JetBrains Mono).
