# Solar Designer Pro — Manuale Utente

Versione manuale: 1.0 (baseline) · Applicazione: v1.0.x

Solar Designer Pro è uno strumento desktop per la progettazione di impianti
fotovoltaici a norma italiana (CEI 0-21, CEI 64-8, CEI EN 62548, DCPREV-14030).
Permette di passare dalla planimetria all'esecuzione di schema unifilare e
relazione tecnica in una sola sessione, anche offline.

Questo manuale descrive il flusso operativo standard. Per i dettagli normativi
e le formule utilizzate vedere `COMPLIANCE.md`.

---

## Avvio rapido

Dopo l'installazione, all'apertura:

1. Se è stato salvato automaticamente un progetto nella sessione precedente,
   l'applicazione lo ripristina. Il canvas mostra "Progetto precedente
   ripristinato. Ricarica l'immagine per continuare."
2. Caricare la planimetria del tetto / del sito tramite drag-and-drop sul
   canvas, o usando il bottone **Carica immagine o PDF** in S1.
3. Procedere step-by-step attraverso le sezioni S1 → S9 nel pannello
   laterale.

Gli step successivi al primo restano bloccati finché non è completato lo step
precedente: per esempio S3 (modulo FV) si sblocca solo dopo la calibrazione
in S2.

---

## Flusso di lavoro S1 → S9

### S1 — Planimetria

Carica un'immagine raster (PNG / JPG) o un PDF della planimetria. Per i PDF è
disponibile la selezione della pagina e l'aggancio ai vertici vettoriali
("Snap PDF") per una calibrazione precisa.

### S2 — Calibrazione

Inserire la distanza reale (in metri) di un segmento noto della planimetria
(es. una larghezza di un muro), poi cliccare **Calibra** e indicare due punti
sul canvas. L'applicazione calcola la scala in pixel-per-metro e abilita le
sezioni successive.

Tasto **Esc** annulla l'operazione di calibrazione senza salvare nulla.

### S3 — Modulo fotovoltaico

Selezionare un modello dalla libreria preset (15 modelli built-in di JA Solar,
LONGi, Canadian Solar, Jinko, Risen Energy, oltre a 2 generici) oppure
inserire i parametri manualmente.

I parametri popolati automaticamente dal preset sono:

- Dimensioni (W, L) e potenza (Wp).
- Caratteristiche elettriche STC: Isc, Voc, Impp, Vmpp.
- Coefficienti termici (Voc e Pmax, in %/°C).
- Massima corrente inversa ammissibile (per il fusibile di stringa).
- Tensione massima di sistema.

I parametri *Gap* (distanza tra moduli) e *Margine* (dalla bordatura
dell'area) restano impostati dall'utente — sono caratteristiche di progetto,
non del modulo.

### S4 — Aree installabili / di esclusione

Disegnare poligoni sulla planimetria:

- **Area installabile** (verde, blu, giallo, ecc. — colore ciclico): zone
  dove possono andare i moduli.
- **Area di esclusione**: zone dove non si deve installare (gronde, lucernari,
  pertinenze condominiali).

Strumenti:
- Click sul canvas per aggiungere un vertice.
- **R** chiude il poligono come rettangolo (richiede almeno 2 vertici).
- **Enter** chiude il poligono libero (richiede almeno 3 vertici).
- **D** apre l'input distanza manuale durante il disegno (per inserire un
  segmento di lunghezza esatta).
- **Backspace** annulla l'ultimo vertice.
- **Esc** annulla l'operazione.
- **V** attiva la modifica dei vertici delle aree già create.

Lo snap ortogonale (tasto **O**) e lo snap magnetico (tasto **S**) facilitano
il disegno con angoli a 90°.

### S5 — Ostacoli tecnici

Aggiungere camini, antenne, UTA/HVAC, lucernari, esalatori. Ogni ostacolo
ha un buffer di sicurezza configurabile, conforme alla guida VV.F.
DCPREV-14030 §3.3.5.1. I moduli che cadono nel buffer vengono rimossi
automaticamente durante il calcolo del layout.

Selezionando un ostacolo si può ruotarlo (lucernari rettangolari) con
l'apposita maniglia, e modificare dimensioni / buffer da scheda.

### S6 — Layout pannelli

Da ogni area installabile è possibile generare automaticamente la
disposizione dei moduli. L'algoritmo:

1. Sceglie il miglior angolo di orientamento per massimizzare il riempimento.
2. Decompone aree concave dove necessario.
3. Posiziona i moduli rispettando gap, margine, ostacoli e camminamenti
   (walkway) se abilitati.
4. Permette di modificare il numero target di moduli per area, con
   riadattamento incrementale.

### S7 — Stringhe e parco inverter

Aggiungere uno o più inverter dalla libreria SAJ (R5 monofase, AT3 trifase,
C6 industriale). Le stringhe vengono generate automaticamente in base a:

- Numero di moduli totali.
- Limiti di tensione dell'inverter (Vmin, Vmax MPPT, Voc max).
- Correzione termica: Voc a −10 °C ≤ VocMax inverter; Vmpp a +70 °C ≥ Vmin.
- Stringhe in parallelo per MPPT (`strPerMppt` da datasheet).

Il semaforo di validazione mostra lo stato:
- **Verde**: la configurazione rispetta tutti i limiti.
- **Giallo / rosso**: c'è una violazione (es. troppe moduli per stringa).

### S8 — Dimensionamento cavi

Inserire le lunghezze:
- **Lunghezza stringa**: dal modulo più distante al sezionatore DC.
- **Lunghezza linea principale DC**: dal sezionatore all'inverter.
- **Lunghezza linea AC**: dall'inverter al quadro generale BT.

L'applicazione calcola la sezione minima del cavo applicando il criterio più
restrittivo tra:
1. Caduta di tensione (CEI 64-8 §525).
2. Portata in regime permanente (CEI UNEL 35024 Method B / C).

I fattori di posa / raggruppamento (k1, k2 — CEI UNEL 35026) sono
configurabili tramite il campo *kCorr*.

La sezione minima per i cavi stringa PV (H1Z2Z2-K) è 4 mm² (CEI EN 62548).

### S9 — Schema unifilare (SLD)

Aprire il modale **Schema unifilare** per visualizzare il diagramma generato.
Lo schema include:

- Rete BT → NT1 (kWh) → POD → Quadro generale BT (DGFV + SPD AC).
- Quadro inverter con uno o più inverter affiancati.
- Box MPPT colorati per inverter (magenta = inv1, blu = inv2, marrone = inv3,
  verde = inv4).
- Stringhe con fusibili, cavi e simboli PV.
- Cartiglio con dati committente, progettista, SPI, revisioni.

Compilare il cartiglio nella sezione collassabile **Dati cartiglio**:
committente, indirizzo, progettista, albo, n. disegno, revisioni, dati SPI.

Esportazioni disponibili:
- **Esporta SVG**: vettoriale, editabile in Inkscape / Illustrator.
- **Esporta PNG (alta risoluzione)**: bitmap a 2× per stampa.
- **Esporta GSE/GAUDÌ**: CSV per pratica GSE.

---

## Bibliotecа moduli e inverter

I preset built-in sono caricati da `data/modules.data.js` e
`data/inverters.data.js`. Sono editabili manualmente da un tecnico esperto
(richiede riavvio dell'applicazione). Una libreria utente editabile da UI
sarà introdotta in una versione successiva (AP-20).

---

## Scorciatoie da tastiera

### Progetto
| Tasto | Azione |
|---|---|
| `Ctrl+S` | Salva progetto |
| `Ctrl+E` | Esporta PDF |
| `Ctrl+N` | Nuovo progetto |
| `Ctrl+Z` | Annulla |
| `Ctrl+Y` | Ripeti |

### Disegno aree
| Tasto | Azione |
|---|---|
| `R` | Chiudi area come rettangolo |
| `Enter` | Chiudi area come poligono |
| `D` | Inserisci distanza manuale |
| `Backspace` | Annulla ultimo vertice |
| `Esc` | Annulla operazione corrente |

### Canvas
| Tasto | Azione |
|---|---|
| `V` | Modifica vertici aree |
| `S` | Toggle snap magnetico |
| `O` | Toggle ortogonalità |
| `B` | Toggle buffer ostacoli |
| `M` | Toggle mini-mappa |
| `Del` | Elimina pannelli selezionati |
| Rotella | Zoom in/out |
| Click dx | Menu contestuale |

### Navigazione
| Tasto | Azione |
|---|---|
| `F1` o `?` | Mostra guida scorciatoie |

---

## Backup automatico e recupero

L'applicazione salva continuamente lo stato del progetto in localStorage
(debounce 800 ms dopo l'ultima modifica). Alla riapertura, l'ultimo progetto
viene ripristinato automaticamente.

⚠️ Il localStorage è legato alla singola macchina. Per trasferire un progetto
o conservare un backup affidabile, esportare lo schema (SVG / PNG / PDF) o
attendere la versione con file `.sdproj` dedicato (in arrivo in AP-10).

Se il progetto supera ~3 MB compare un avviso: in tal caso esportare un
backup esterno.

---

## Risoluzione problemi

**Il PDF della planimetria non si carica.**
Verificare che il file non sia protetto da password. PDF cifrati non sono
supportati. Provare a esportare il PDF "Stampa in PDF" da AutoCAD / Revit.

**Le stringhe sono in rosso.**
Aprire il dettaglio di validazione: probabilmente la combinazione modulo /
inverter / numero di pannelli per stringa supera Voc a −10 °C o non
raggiunge Vmpp a +70 °C. Cambiare modello inverter o ridurre il numero di
moduli per stringa.

**La caduta di tensione supera il limite.**
Verificare la lunghezza dei cavi. Per stringhe lunghe oltre 30 m considerare
una sezione maggiore o passare a rame anziché alluminio.

**Lo SLD non si aggiorna.**
Dopo aver modificato il cartiglio, il rendering è ritardato di ~250 ms per
non rallentare la digitazione. Attendere un istante o cliccare fuori dal
campo.

**L'applicazione non parte dopo l'installazione.**
Verificare che l'antivirus non blocchi `Solar Designer Pro.exe`. La versione
ufficiale è firmata digitalmente (a partire da v1.x).

---

## Riferimenti normativi

L'elenco completo delle norme applicate e dei riferimenti formula → articolo
è in `COMPLIANCE.md`. I principali:

- CEI 0-21 — Connessione utenti BT.
- CEI 64-8 — Impianti elettrici utilizzatori.
- CEI EN 62548 — Progettazione di stringhe PV.
- CEI UNEL 35024 — Portate dei cavi.
- CEI UNEL 35026 — Fattori di riduzione.
- DCPREV-14030 — Sicurezza antincendio impianti PV.

---

## Supporto

Per segnalazioni e richieste di funzionalità, contattare il fornitore della
licenza.
