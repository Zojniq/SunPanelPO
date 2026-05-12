# Specifiche Tecniche — Generatore Automatico Schema Unifilare FV
**Versione:** 2.0 — Conforme CEI 0-21:2025-10 (consolidata)
**Data:** 2026-04-10
**Normative di riferimento:** CEI 0-21:2025-10 · CEI 64-8/7 sez.712 · CEI EN 62446-1 · IEC 60617

---

## 1. OBIETTIVO DEL SISTEMA

L'utente fornisce i dati tecnici dell'impianto (moduli, inverter, cavi già dimensionati). Il sistema genera automaticamente uno **schema unifilare fotovoltaico professionale** in formato SVG e PDF, A3 orizzontale, pronto per la firma del progettista.

**NON è richiesta interattività.** L'output è un disegno tecnico statico, conforme alle norme, con cartiglio compilato.

---

## 2. ARCHITETTURA DEL SISTEMA

```
INPUT (JSON)
    │
    ▼
┌─────────────────────────┐
│  MOTORE DI VALIDAZIONE  │  → verifica coerenza dati, segnala errori
└──────────┬──────────────┘
           │
    ▼
┌─────────────────────────┐
│  MOTORE DI CALCOLO      │  → verifica stringhe, cadute tensione,
│                         │    dimensionamento protezioni
└──────────┬──────────────┘
           │
    ▼
┌─────────────────────────┐
│  MOTORE DI LAYOUT       │  → posiziona componenti, calcola coordinate
│                         │    SVG, gestisce multi-stringa / multi-inverter
└──────────┬──────────────┘
           │
    ▼
┌─────────────────────────┐
│  RENDERER SVG           │  → disegna simboli IEC, linee, etichette,
│                         │    cartiglio, legenda
└──────────┬──────────────┘
           │
    ▼
OUTPUT: schema.svg + schema.pdf
```

**Stack consigliato (Python):**
- `svgwrite` — generazione SVG
- `reportlab` o `weasyprint` — SVG→PDF
- `pydantic` — validazione JSON input
- `jsonschema` — schema enforcement

---

## 3. INPUT — STRUTTURA JSON COMPLETA

```json
{
  "meta": {
    "versione_norma": "CEI 0-21:2025-10",
    "data_progetto": "2026-04-10",
    "revisione": "00"
  },

  "cartiglio": {
    "titolo": "Schema Unifilare Impianto Fotovoltaico",
    "committente": "Mario Rossi",
    "indirizzo_impianto": "Via Esempio 1, 35100 Padova (PD)",
    "progettista": {
      "nome": "Ing. Andrea Bianchi",
      "albo": "Ordine Ingegneri Padova",
      "numero_iscrizione": "A-12345"
    },
    "direttore_lavori": "Ing. Andrea Bianchi",
    "numero_disegno": "FV-2026-001",
    "scala": "Fuori scala",
    "note_generali": ""
  },

  "impianto": {
    "potenza_picco_kwp": 10.8,
    "tipo_connessione": "BT",
    "fasi_ac": 3,
    "tensione_rete_v": 400,
    "frequenza_hz": 50,
    "sistema_terra": "TT",
    "temperatura_min_installazione_c": -10,
    "temperatura_max_moduli_c": 70
  },

  "campo_fv": {
    "modulo": {
      "marca": "JA Solar",
      "modello": "JAM72S30-540MR",
      "pmax_wp": 540,
      "voc_v": 49.5,
      "isc_a": 13.8,
      "vmpp_v": 41.2,
      "impp_a": 13.1,
      "beta_voc_perc_k": -0.28,
      "alpha_isc_perc_k": 0.048,
      "gamma_pmax_perc_k": -0.35,
      "celle_in_serie": 144,
      "dimensioni_mm": [2278, 1134, 35],
      "peso_kg": 28.5,
      "classe_applicazione": "A"
    },
    "stringhe": [
      {
        "id": "STR1",
        "n_moduli": 10,
        "mppt_id": 1,
        "orientamento_gradi": 180,
        "inclinazione_gradi": 30,
        "cavo_dc": {
          "tipo": "H1Z2Z2-K",
          "sezione_mm2": 6,
          "lunghezza_singola_m": 25,
          "colore_positivo": "rosso",
          "colore_negativo": "nero"
        }
      },
      {
        "id": "STR2",
        "n_moduli": 10,
        "mppt_id": 2,
        "orientamento_gradi": 180,
        "inclinazione_gradi": 30,
        "cavo_dc": {
          "tipo": "H1Z2Z2-K",
          "sezione_mm2": 6,
          "lunghezza_singola_m": 30,
          "colore_positivo": "rosso",
          "colore_negativo": "nero"
        }
      }
    ],
    "cassetta_stringa": {
      "presente": true,
      "marca_modello": "Fibox CAB 200x200",
      "ip": "IP65",
      "fusibili_dc": {
        "presenti": true,
        "in_a": 20,
        "vn_dc_v": 1000,
        "categoria": "gPV",
        "dimensione": "10x38mm"
      },
      "spd_dc": {
        "presente": true,
        "classe": "T2",
        "uc_v": 1000,
        "imax_ka": 40,
        "up_kv": 2.5
      },
      "sezionatore_dc": {
        "presente": true,
        "vmax_dc_v": 1000,
        "in_a": 32,
        "n_poli": 2
      }
    }
  },

  "inverter": {
    "marca": "SMA",
    "modello": "STP10.0-3AV-40",
    "tipo": "stringa",
    "pdc_max_kw": 13.5,
    "vdc_max_v": 1000,
    "mppt_range_v": [150, 800],
    "n_mppt": 2,
    "idc_max_per_mppt_a": 15,
    "n_ingressi_per_mppt": 1,
    "pac_nom_kw": 10.0,
    "pac_max_kw": 10.0,
    "vac_nom_v": 400,
    "iac_max_a": 14.5,
    "cos_phi": 1.0,
    "frequenza_hz": 50,
    "rendimento_max_perc": 98.0,
    "rendimento_euro_perc": 97.6,
    "ip": "IP65",
    "ddi_integrato": true,
    "spi_integrato": true,
    "plug_and_play": true,
    "idc_max_perc": 0.5,
    "dimensioni_mm": [661, 682, 264],
    "peso_kg": 61.5
  },

  "accumulo": null,

  "protezioni_ac": {
    "mcb_post_inverter": {
      "marca_modello": "ABB S204M-C16",
      "in_a": 16,
      "vn_v": 400,
      "n_poli": 4,
      "curva": "C",
      "icc_ka": 10,
      "categoria": "B"
    },
    "rcd": {
      "presente": true,
      "marca_modello": "ABB F204A-25/0.03",
      "in_a": 25,
      "idelta_ma": 30,
      "tipo": "A",
      "n_poli": 4,
      "tempo_intervento_ms": 40,
      "nota": "Tipo A per inverter senza trasformatore. Se inverter con trasformatore usare tipo AC."
    },
    "spd_ac": {
      "presente": true,
      "classe": "T2",
      "uc_v": 275,
      "imax_ka": 40,
      "up_kv": 1.5,
      "n_poli": 3
    }
  },

  "cavo_ac": {
    "tipo": "FG7OR",
    "n_conduttori_fasi": 3,
    "sezione_fase_mm2": 6,
    "sezione_neutro_mm2": 6,
    "sezione_pe_mm2": 6,
    "lunghezza_m": 15,
    "designazione_completa": "FG7OR 5G6"
  },

  "misura": {
    "contatore_produzione": {
      "presente": true,
      "tipo": "monodirezionale",
      "classe": "B",
      "trifase": true
    },
    "contatore_scambio": {
      "presente": true,
      "tipo": "bidirezionale",
      "classe": "B",
      "trifase": true,
      "gestore": "Enel Distribuzione",
      "modalita_scambio": "SSP"
    }
  },

  "dispositivi_interfaccia": {
    "DG": {
      "descrizione": "Dispositivo Generale",
      "tipo": "interruttore_automatico",
      "in_a": 25,
      "vn_v": 400,
      "n_poli": 4,
      "curva": "C",
      "icc_ka": 10,
      "nota": "Immediatamente a valle del PdC"
    },
    "DDI": {
      "descrizione": "Dispositivo di Interfaccia",
      "integrato_inverter": true,
      "tipo_dispositivi": ["contattore_AC1", "inverter"],
      "nota": "P&P ≤11,08 kW: DDI integrato nell'inverter. Due dispositivi interni.",
      "rincalzo_richiesto": false,
      "nota_rincalzo": "Rincalzo obbligatorio solo per P > 20 kW"
    },
    "SPI": {
      "descrizione": "Sistema di Protezione di Interfaccia",
      "integrato_inverter": true,
      "soglie_tensione": {
        "59_S1_vn": 1.10,
        "59_S1_tempo_s": 603,
        "59_S1_nota": "Valore medio su 10 minuti",
        "59_S2_vn": 1.15,
        "59_S2_tempo_s": 0.2,
        "27_S1_vn": 0.85,
        "27_S1_tempo_s": 1.5,
        "27_S2_vn": 0.15,
        "27_S2_tempo_s": 0.2
      },
      "soglie_frequenza": {
        "81_S1_max_hz": 50.2,
        "81_S1_max_tempo_s": 0.1,
        "81_S1_min_hz": 49.8,
        "81_S1_min_tempo_s": 0.1,
        "81_S1_nota": "Abilitata solo con segnale esterno",
        "81_S2_max_hz": 51.5,
        "81_S2_max_tempo_s": 1.0,
        "81_S2_min_hz": 47.5,
        "81_S2_min_tempo_s": 4.0
      }
    }
  },

  "messa_a_terra": {
    "sistema": "TT",
    "dispersore_tipo": "picchetto_acciaio_rame",
    "resistenza_terra_ohm": null,
    "sezione_conduttore_pe_mm2": 6,
    "sezione_conduttore_eq_principale_mm2": 6,
    "nodo_equipotenziale_principale": true
  },

  "strutture_fv": {
    "tipo": "fissa_tetto_piano",
    "materiale": "alluminio",
    "collegamento_equipotenziale": true,
    "sezione_pe_strutture_mm2": 4
  }
}
```

---

## 4. CALCOLI DA ESEGUIRE — FORMULE PRECISE

Il motore di calcolo deve verificare automaticamente ogni stringa e generare avvisi se fuori range.

### 4.1 Verifica stringa lato DC

```python
# Costanti fisiche
rho_Cu = 0.0175  # Ω·mm²/m a 20°C

def calcola_stringa(stringa, modulo, inverter, T_min, T_max):
    N = stringa['n_moduli']

    # Voc a temperatura minima (più critica per il max DC)
    Voc_str_Tmin = N * modulo['voc_v'] * (1 + modulo['beta_voc_perc_k'] / 100 * (T_min - 25))
    assert Voc_str_Tmin < inverter['vdc_max_v'], \
        f"ERRORE: Voc stringa {Voc_str_Tmin:.1f}V > Vdc_max inverter {inverter['vdc_max_v']}V"

    # Vmpp a temperatura massima (più critica per il min MPPT)
    Vmpp_str_Tmax = N * modulo['vmpp_v'] * (1 + modulo['beta_voc_perc_k'] / 100 * (T_max - 25))
    assert Vmpp_str_Tmax > inverter['mppt_range_v'][0], \
        f"ERRORE: Vmpp {Vmpp_str_Tmax:.1f}V < soglia MPPT min {inverter['mppt_range_v'][0]}V"

    # Vmpp a temperatura standard (verifica soglia max MPPT)
    Vmpp_str_STC = N * modulo['vmpp_v']
    assert Vmpp_str_STC < inverter['mppt_range_v'][1], \
        f"ATTENZIONE: Vmpp STC {Vmpp_str_STC:.1f}V > soglia MPPT max {inverter['mppt_range_v'][1]}V"

    # Corrente di stringa
    Isc_str = modulo['isc_a']  # corrente = quella del singolo modulo
    assert Isc_str * 1.25 <= inverter['idc_max_per_mppt_a'], \
        f"ERRORE: Isc × 1.25 = {Isc_str*1.25:.1f}A > Idc_max_MPPT {inverter['idc_max_per_mppt_a']}A"

    # Verifica fusibili DC (se presenti)
    # In_fusibile >= 1.5 × Isc e In_fusibile <= 2.4 × Isc (norma gPV)
    # Da implementare se cassetta_stringa.fusibili_dc.presente == True

    # Calcolo caduta di tensione sul cavo DC (A/R = lunghezza × 2)
    cavo = stringa['cavo_dc']
    L = cavo['lunghezza_singola_m']
    S = cavo['sezione_mm2']
    dV = (rho_Cu * L * 2 * Isc_str) / S
    dV_perc = dV / Vmpp_str_STC * 100
    assert dV_perc <= 1.0, \
        f"ATTENZIONE: caduta tensione DC = {dV_perc:.2f}% > 1% limite raccomandato"

    return {
        'Voc_str_Tmin': round(Voc_str_Tmin, 1),
        'Vmpp_str_STC': round(Vmpp_str_STC, 1),
        'Vmpp_str_Tmax': round(Vmpp_str_Tmax, 1),
        'Isc_str': Isc_str,
        'dV_perc_DC': round(dV_perc, 2)
    }
```

### 4.2 Verifica lato AC

```python
import math

def calcola_ac(inverter, cavo_ac, protezioni):
    V = inverter['vac_nom_v']
    P = inverter['pac_nom_kw'] * 1000
    cos_phi = inverter['cos_phi']
    fasi = 3  # oppure 1 se monofase

    # Corrente nominale AC
    if fasi == 3:
        Iac = P / (V * cos_phi * math.sqrt(3))
    else:
        Iac = P / (V * cos_phi)

    # Verifica MCB
    In_mcb = protezioni['mcb_post_inverter']['in_a']
    assert In_mcb >= Iac * 1.25, \
        f"ATTENZIONE: In_MCB {In_mcb}A < Iac × 1.25 = {Iac*1.25:.1f}A"

    # Caduta di tensione AC
    L = cavo_ac['lunghezza_m']
    S = cavo_ac['sezione_fase_mm2']
    rho_Cu = 0.0175
    if fasi == 3:
        dV = (rho_Cu * L * P) / (S * V * V / math.sqrt(3))
    else:
        dV = (2 * rho_Cu * L * Iac) / S
    dV_perc = dV / V * 100
    assert dV_perc <= 1.0, \
        f"ATTENZIONE: caduta tensione AC = {dV_perc:.2f}% > 1% limite raccomandato"

    return {
        'Iac_nom': round(Iac, 1),
        'dV_perc_AC': round(dV_perc, 2)
    }
```

### 4.3 Dimensionamento conduttore PE

```python
def sezione_pe(sezione_fase_mm2):
    # CEI 64-8 Tab. 54F
    if sezione_fase_mm2 <= 16:
        return sezione_fase_mm2
    elif sezione_fase_mm2 <= 35:
        return 16
    else:
        return sezione_fase_mm2 / 2
```

---

## 5. SIMBOLI IEC — LIBRERIA SVG

Ogni simbolo è una funzione Python che riceve `(cx, cy, scala=1)` e restituisce stringhe SVG da iniettare nel documento. Tutti i simboli usano stroke="#1a1a1a", fill="white", stroke-width="1.5".

Le dimensioni base sono calibrate per un foglio A3 landscape (420×297mm) con viewBox "0 0 4200 2970" (1 unit = 0.1mm).

```python
# ──────────────────────────────────────────────
# SIMBOLO: Modulo fotovoltaico (IEC 60617)
# Rettangolo con diagonale + freccia (generatore DC)
# ──────────────────────────────────────────────
def sym_modulo(cx, cy, w=120, h=80):
    x, y = cx - w//2, cy - h//2
    return f"""
<rect x="{x}" y="{y}" width="{w}" height="{h}"
      fill="white" stroke="#1a1a1a" stroke-width="1.5"/>
<line x1="{x}" y1="{y+h}" x2="{x+w}" y2="{y}"
      stroke="#1a1a1a" stroke-width="1"/>
<line x1="{cx}" y1="{cy-10}" x2="{cx+15}" y2="{cy-10}"
      stroke="#1a1a1a" stroke-width="1.2"
      marker-end="url(#arrow_small)"/>
"""

# ──────────────────────────────────────────────
# SIMBOLO: Fusibile (IEC 60617 S00252)
# Rettangolo allungato con linea interna
# ──────────────────────────────────────────────
def sym_fusibile(cx, cy, verticale=True):
    if verticale:
        return f"""
<line x1="{cx}" y1="{cy-30}" x2="{cx}" y2="{cy-14}"
      stroke="#1a1a1a" stroke-width="1.5"/>
<rect x="{cx-10}" y="{cy-14}" width="20" height="28"
      fill="white" stroke="#1a1a1a" stroke-width="1.5"/>
<line x1="{cx}" y1="{cy-14}" x2="{cx}" y2="{cy+14}"
      stroke="#1a1a1a" stroke-width="1"/>
<line x1="{cx}" y1="{cy+14}" x2="{cx}" y2="{cy+30}"
      stroke="#1a1a1a" stroke-width="1.5"/>
"""
    else:
        return f"""
<line x1="{cx-30}" y1="{cy}" x2="{cx-14}" y2="{cy}"
      stroke="#1a1a1a" stroke-width="1.5"/>
<rect x="{cx-14}" y="{cy-10}" width="28" height="20"
      fill="white" stroke="#1a1a1a" stroke-width="1.5"/>
<line x1="{cx-14}" y1="{cy}" x2="{cx+14}" y2="{cy}"
      stroke="#1a1a1a" stroke-width="1"/>
<line x1="{cx+14}" y1="{cy}" x2="{cx+30}" y2="{cy}"
      stroke="#1a1a1a" stroke-width="1.5"/>
"""

# ──────────────────────────────────────────────
# SIMBOLO: Interruttore automatico (IEC 60617)
# Linea con apertura e simbolo T+M
# ──────────────────────────────────────────────
def sym_interruttore(cx, cy, verticale=True):
    if verticale:
        return f"""
<line x1="{cx}" y1="{cy-35}" x2="{cx}" y2="{cy-18}"
      stroke="#1a1a1a" stroke-width="1.5"/>
<circle cx="{cx}" cy="{cy-18}" r="3"
        fill="#1a1a1a"/>
<line x1="{cx}" y1="{cy-18}" x2="{cx+14}" y2="{cy+10}"
      stroke="#1a1a1a" stroke-width="1.5"/>
<line x1="{cx}" y1="{cy+18}" x2="{cx}" y2="{cy+35}"
      stroke="#1a1a1a" stroke-width="1.5"/>
<text x="{cx+18}" y="{cy+5}" font-family="Arial" font-size="14"
      fill="#1a1a1a">M</text>
"""
    else:
        return f"""
<line x1="{cx-35}" y1="{cy}" x2="{cx-18}" y2="{cy}"
      stroke="#1a1a1a" stroke-width="1.5"/>
<circle cx="{cx-18}" cy="{cy}" r="3"
        fill="#1a1a1a"/>
<line x1="{cx-18}" y1="{cy}" x2="{cx+10}" y2="{cy-14}"
      stroke="#1a1a1a" stroke-width="1.5"/>
<line x1="{cx+18}" y1="{cy}" x2="{cx+35}" y2="{cy}"
      stroke="#1a1a1a" stroke-width="1.5"/>
"""

# ──────────────────────────────────────────────
# SIMBOLO: Sezionatore (IEC 60617)
# Come interruttore ma con trattini di sezionamento
# ──────────────────────────────────────────────
def sym_sezionatore(cx, cy, verticale=True):
    base = sym_interruttore(cx, cy, verticale)
    if verticale:
        extra = f"""
<line x1="{cx-8}" y1="{cy+12}" x2="{cx+8}" y2="{cy+12}"
      stroke="#1a1a1a" stroke-width="1"/>
"""
    else:
        extra = f"""
<line x1="{cx+12}" y1="{cy-8}" x2="{cx+12}" y2="{cy+8}"
      stroke="#1a1a1a" stroke-width="1"/>
"""
    return base + extra

# ──────────────────────────────────────────────
# SIMBOLO: Differenziale (RCD) (IEC 60617)
# Interruttore con simbolo di dispersione
# ──────────────────────────────────────────────
def sym_rcd(cx, cy):
    base = sym_interruttore(cx, cy, verticale=True)
    extra = f"""
<path d="M {cx-15} {cy+5} Q {cx} {cy+25} {cx+15} {cy+5}"
      fill="none" stroke="#1a1a1a" stroke-width="1"/>
<line x1="{cx}" y1="{cy+20}" x2="{cx}" y2="{cy+35}"
      stroke="#1a1a1a" stroke-width="1" stroke-dasharray="3,2"/>
<line x1="{cx-6}" y1="{cy+35}" x2="{cx+6}" y2="{cy+35}"
      stroke="#1a1a1a" stroke-width="1.5"/>
<line x1="{cx-4}" y1="{cy+40}" x2="{cx+4}" y2="{cy+40}"
      stroke="#1a1a1a" stroke-width="1"/>
"""
    return base + extra

# ──────────────────────────────────────────────
# SIMBOLO: SPD (Scaricatore di sovratensione)
# Triangolo con freccia verso terra
# ──────────────────────────────────────────────
def sym_spd(cx, cy):
    return f"""
<line x1="{cx}" y1="{cy-25}" x2="{cx}" y2="{cy-10}"
      stroke="#1a1a1a" stroke-width="1.5"/>
<polygon points="{cx-12},{cy-10} {cx+12},{cy-10} {cx},{cy+10}"
         fill="white" stroke="#1a1a1a" stroke-width="1.5"/>
<line x1="{cx}" y1="{cy+10}" x2="{cx}" y2="{cy+20}"
      stroke="#1a1a1a" stroke-width="1.5"/>
<line x1="{cx-3}" y1="{cy+5}" x2="{cx+3}" y2="{cy+5}"
      stroke="#1a1a1a" stroke-width="1"/>
<line x1="{cx-8}" y1="{cy+20}" x2="{cx+8}" y2="{cy+20}"
      stroke="#1a1a1a" stroke-width="1.5"/>
<line x1="{cx-5}" y1="{cy+25}" x2="{cx+5}" y2="{cy+25}"
      stroke="#1a1a1a" stroke-width="1"/>
<line x1="{cx-2}" y1="{cy+30}" x2="{cx+2}" y2="{cy+30}"
      stroke="#1a1a1a" stroke-width="1"/>
"""

# ──────────────────────────────────────────────
# SIMBOLO: Inverter DC/AC (blocco funzionale)
# Rettangolo con simboli = e ~
# ──────────────────────────────────────────────
def sym_inverter(cx, cy, w=220, h=150, label_model=""):
    x, y = cx - w//2, cy - h//2
    return f"""
<rect x="{x}" y="{y}" width="{w}" height="{h}"
      fill="white" stroke="#1a1a1a" stroke-width="2"/>
<line x1="{x}" y1="{cy}" x2="{x+w}" y2="{cy}"
      stroke="#1a1a1a" stroke-width="0.8" stroke-dasharray="4,3"/>
<text x="{cx-30}" y="{cy-20}"
      font-family="Arial" font-size="22" font-weight="bold"
      fill="#1a1a1a" text-anchor="middle">&#61;&#61;</text>
<text x="{cx+30}" y="{cy-20}"
      font-family="Arial" font-size="22" font-weight="bold"
      fill="#1a1a1a" text-anchor="middle">&#126;</text>
<line x1="{cx-10}" y1="{cy-20}" x2="{cx+10}" y2="{cy-20}"
      stroke="#1a1a1a" stroke-width="1.5"
      marker-end="url(#arrow_small)"/>
<text x="{cx}" y="{y+30}"
      font-family="Arial" font-size="16" font-weight="bold"
      fill="#1a1a1a" text-anchor="middle">INVERTER</text>
<text x="{cx}" y="{y+50}"
      font-family="Arial" font-size="13"
      fill="#1a1a1a" text-anchor="middle">{label_model}</text>
<text x="{x+10}" y="{cy+25}"
      font-family="Arial" font-size="11"
      fill="#555555">DDI+SPI int.</text>
"""

# ──────────────────────────────────────────────
# SIMBOLO: Contatore (misuratore di energia)
# Cerchio con kWh
# ──────────────────────────────────────────────
def sym_contatore(cx, cy, r=28, label="kWh", bidirezionale=False):
    frecce = ""
    if bidirezionale:
        frecce = f"""
<line x1="{cx-12}" y1="{cy-8}" x2="{cx+12}" y2="{cy-8}"
      stroke="#1a1a1a" stroke-width="1"
      marker-end="url(#arrow_small)"/>
<line x1="{cx+12}" y1="{cy+8}" x2="{cx-12}" y2="{cy+8}"
      stroke="#1a1a1a" stroke-width="1"
      marker-end="url(#arrow_small_rev)"/>
"""
    return f"""
<circle cx="{cx}" cy="{cy}" r="{r}"
        fill="white" stroke="#1a1a1a" stroke-width="1.5"/>
<text x="{cx}" y="{cy+5}"
      font-family="Arial" font-size="14" font-weight="bold"
      fill="#1a1a1a" text-anchor="middle">{label}</text>
{frecce}
"""

# ──────────────────────────────────────────────
# SIMBOLO: Terra (IEC 60617 S00266)
# Tre linee orizzontali digradanti
# ──────────────────────────────────────────────
def sym_terra(cx, cy):
    return f"""
<line x1="{cx}" y1="{cy-20}" x2="{cx}" y2="{cy}"
      stroke="#1a1a1a" stroke-width="1.5"/>
<line x1="{cx-20}" y1="{cy}" x2="{cx+20}" y2="{cy}"
      stroke="#1a1a1a" stroke-width="2"/>
<line x1="{cx-14}" y1="{cy+7}" x2="{cx+14}" y2="{cy+7}"
      stroke="#1a1a1a" stroke-width="1.5"/>
<line x1="{cx-8}" y1="{cy+14}" x2="{cx+8}" y2="{cy+14}"
      stroke="#1a1a1a" stroke-width="1"/>
"""

# ──────────────────────────────────────────────
# SIMBOLO: Rete pubblica BT
# Tre linee ondulate (trifase)
# ──────────────────────────────────────────────
def sym_rete(cx, cy, w=160, h=60):
    x, y = cx - w//2, cy - h//2
    return f"""
<rect x="{x}" y="{y}" width="{w}" height="{h}"
      fill="#f5f5f5" stroke="#1a1a1a" stroke-width="1.5" rx="4"/>
<text x="{cx}" y="{cy-10}"
      font-family="Arial" font-size="14" font-weight="bold"
      fill="#1a1a1a" text-anchor="middle">RETE BT DSO</text>
<path d="M {cx-45} {cy+10} Q {cx-35} {cy} {cx-25} {cy+10}
         Q {cx-15} {cy+20} {cx-5} {cy+10}"
      fill="none" stroke="#1a1a1a" stroke-width="1.5"/>
<path d="M {cx-5} {cy+10} Q {cx+5} {cy} {cx+15} {cy+10}
         Q {cx+25} {cy+20} {cx+35} {cy+10}"
      fill="none" stroke="#1a1a1a" stroke-width="1.5"/>
<path d="M {cx+35} {cy+10} Q {cx+45} {cy} {cx+55} {cy+10}
         Q {cx+65} {cy+20} {cx+75} {cy+10}"
      fill="none" stroke="#1a1a1a" stroke-width="1.5"/>
"""

# ──────────────────────────────────────────────
# SIMBOLO: Punto di nodo (giunzione)
# Pallino pieno sulla linea
# ──────────────────────────────────────────────
def sym_nodo(cx, cy, r=5):
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#1a1a1a"/>'
```

---

## 6. LAYOUT ENGINE — ALGORITMO DI POSIZIONAMENTO

### 6.1 Sistema di coordinate

- Foglio: **A3 landscape** → 420mm × 297mm
- ViewBox SVG: `"0 0 4200 2970"` (1 unit = 0.1mm)
- Margini disegno: top=150, right=150, bottom=400 (cartiglio), left=150
- Area disegno utile: 3900 × 2420 units
- Cartiglio: y = 2570 fino a y = 2970 (h=400)

### 6.2 Flusso verticale — layer Y fissi

Il flusso di energia scende **dall'alto verso il basso**. I layer Y sono fissi e indipendenti dal numero di componenti:

```python
LAYER_Y = {
    'moduli':            300,   # Top — campo FV
    'cavi_dc_top':       550,   # Cavi uscenti dai moduli
    'cassetta_stringa':  700,   # Combiner box / protezioni DC
    'cavi_dc_bot':       900,   # Cavi verso inverter
    'inverter':         1100,   # Inverter (centro del simbolo)
    'cavi_ac_top':      1350,   # Uscita AC inverter
    'qac_produzione':   1550,   # Quadro AC produzione (MCB, RCD, SPD, contatore prod.)
    'cavi_qac_bot':     1800,   # Cavi verso DG
    'DG':               1950,   # Dispositivo Generale (immediatamente a valle PdC)
    'contatore_scambio':2100,   # Contatore bidirezionale / misura scambio
    'PdC':              2200,   # Punto di connessione (label)
    'rete':             2380,   # Rete pubblica DSO
}
```

### 6.3 Distribuzione orizzontale X

```python
# Larghezza disegno utile
X_LEFT  = 200
X_RIGHT = 4000
X_CENTER = (X_LEFT + X_RIGHT) // 2  # = 2100

# Per N stringhe: distribuire uniformemente sull'asse X
def distribuzione_x_stringhe(n_stringhe, x_left=400, x_right=3800):
    if n_stringhe == 1:
        return [X_CENTER]
    step = (x_right - x_left) / (n_stringhe - 1)
    return [int(x_left + i * step) for i in range(n_stringhe)]

# I blocchi centrali (inverter, quadri, rete) sono sempre centrati in X
# I componenti affiancati (MPPTs multipli) si distribuiscono attorno al centro
```

### 6.4 Casistica multi-stringa / multi-inverter

```python
# Regola: ogni MPPT dell'inverter ha la propria colonna X
# Se 2 MPPT: colonne a X_CENTER ± 600
# Se 4 MPPT: colonne a X_CENTER ± 200 e ± 800
# Le stringhe di un MPPT si distribuiscono intorno alla colonna del MPPT

def calcola_layout(dati):
    n_mppt = dati['inverter']['n_mppt']
    stringhe = dati['campo_fv']['stringhe']

    # Raggruppa stringhe per MPPT
    mppt_groups = {}
    for s in stringhe:
        mppt_id = s['mppt_id']
        if mppt_id not in mppt_groups:
            mppt_groups[mppt_id] = []
        mppt_groups[mppt_id].append(s)

    # Calcola X per ogni gruppo MPPT
    mppt_x = distribuzione_x_stringhe(len(mppt_groups))
    layout = {}
    for i, (mppt_id, group) in enumerate(mppt_groups.items()):
        cx_mppt = mppt_x[i]
        n_str = len(group)
        str_xs = distribuzione_x_stringhe(n_str,
                    cx_mppt - 300 * max(n_str-1, 1),
                    cx_mppt + 300 * max(n_str-1, 1))
        for j, stringa in enumerate(group):
            layout[stringa['id']] = {
                'x': str_xs[j],
                'mppt_x': cx_mppt
            }
    return layout, mppt_x
```

### 6.5 Routing delle linee

**Regola fondamentale:** le linee non si incrociano mai con i rettangoli dei componenti.

```python
# Schema di routing:
# 1. Linee DC positive (rosse): dalla stringa scendono a Y_cavi_dc_top,
#    convergono orizzontalmente al X del MPPT corrispondente,
#    poi scendono a Y_cassetta, entrano nel simbolo cassetta
# 2. Linee DC negative (nere): simmetriche
# 3. Dal cassetta o direttamente, la linea DC entra all'inverter
# 4. Linea AC esce dall'inverter, scende verticalmente (centrata),
#    attraversa tutti i layer fino alla rete

# Tutti i cambi di direzione usano path L (angoli retti, no curve)
# NON usare linee diagonali — solo orizzontali e verticali

def genera_linea(x1, y1, x2, y2, colore, spessore=2.5, tratteggio=None):
    """Genera un path L-shape se x1 != x2 e y1 != y2"""
    dash = f'stroke-dasharray="{tratteggio}"' if tratteggio else ""
    if x1 == x2 or y1 == y2:
        return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" \
stroke="{colore}" stroke-width="{spessore}" {dash}/>'
    else:
        # Gomito a metà altezza
        ymid = (y1 + y2) // 2
        return f'<path d="M {x1} {y1} L {x1} {ymid} L {x2} {ymid} L {x2} {y2}" \
fill="none" stroke="{colore}" stroke-width="{spessore}" {dash}/>'
```

---

## 7. ETICHETTE — REGOLE DI POSIZIONAMENTO

Ogni linea deve avere un'etichetta con: tipo cavo · sezione · lunghezza.  
Ogni componente ha: nome · marca/modello · parametri principali.

```python
# Font: Arial, size 13 (etichette cavi), size 15 (titoli componenti)
# Posizione etichette cavi: SEMPRE offset di 15 units a destra della linea
# (mai centrate sulla linea — rischiano di sovrapporsi al tracciato)

def label_cavo(x_linea, y_mid, testo, lato='destra'):
    offset = 18 if lato == 'destra' else -18
    anchor = 'start' if lato == 'destra' else 'end'
    return f"""
<text x="{x_linea + offset}" y="{y_mid}"
      font-family="Arial" font-size="13"
      fill="#333333" text-anchor="{anchor}"
      transform="rotate(-90, {x_linea + offset}, {y_mid})">{testo}</text>
"""
# Nota: etichette sui cavi verticali si ruotano di -90°
# Etichette sui cavi orizzontali non si ruotano, offset verso l'alto di 12 units

def label_componente(cx, cy_sopra, righe: list):
    """Righe: [(testo, grassetto, size), ...]"""
    svg = ""
    dy = 0
    for testo, bold, size in righe:
        weight = "bold" if bold else "normal"
        svg += f"""
<text x="{cx}" y="{cy_sopra + dy}"
      font-family="Arial" font-size="{size}" font-weight="{weight}"
      fill="#1a1a1a" text-anchor="middle">{testo}</text>
"""
        dy += size + 4
    return svg
```

---

## 8. BLOCCHI FUNZIONALI (rettangoli tratteggiati)

I quadri elettrici (cassetta stringa, quadro AC, quadro DG) si disegnano come rettangoli con bordo tratteggiato e label in alto a sinistra.

```python
def blocco_funzionale(x, y, w, h, titolo, colore_bordo="#555555"):
    return f"""
<rect x="{x}" y="{y}" width="{w}" height="{h}"
      fill="none" stroke="{colore_bordo}" stroke-width="1.5"
      stroke-dasharray="12,6" rx="8"/>
<rect x="{x+10}" y="{y-14}" width="{len(titolo)*8+16}" height="22"
      fill="white" stroke="none"/>
<text x="{x+18}" y="{y+2}"
      font-family="Arial" font-size="14" font-weight="bold"
      fill="{colore_bordo}">{titolo}</text>
"""
```

**Blocchi previsti:**
| Blocco | Contiene |
|---|---|
| "Cassetta di stringa (IP65)" | fusibili DC, SPD DC, sezionatore DC per ogni MPPT |
| "Quadro AC Produzione" | MCB, RCD, SPD AC, contatore produzione |
| "Quadro Generale / PdC" | DG, contatore scambio bidirezionale |

---

## 9. STILE LINEE — CONVENZIONE COLORI

```python
LINEE = {
    'dc_positivo':  {'colore': '#CC3300', 'spessore': 2.5, 'tratteggio': None},
    'dc_negativo':  {'colore': '#1a1a1a', 'spessore': 2.5, 'tratteggio': None},
    'ac_trifase':   {'colore': '#444444', 'spessore': 3.0, 'tratteggio': None},
    'ac_monofase':  {'colore': '#444444', 'spessore': 2.5, 'tratteggio': None},
    'pe_terra':     {'colore': '#2d7a00', 'spessore': 1.8, 'tratteggio': '8,4'},
    'eq_masse':     {'colore': '#2d7a00', 'spessore': 1.5, 'tratteggio': '4,4'},
    'comunicazione':{'colore': '#0055AA', 'spessore': 1.2, 'tratteggio': '4,4'},
    'confine_dso':  {'colore': '#888888', 'spessore': 1.0, 'tratteggio': '6,6'},
}

# I NODI di connessione (giunzioni) si indicano con un pallino pieno
# di diametro 10 units nei colori della linea corrispondente
```

---

## 10. CARTIGLIO — STRUTTURA COMPLETA

Il cartiglio occupa l'area `y = 2570..2970` su tutta la larghezza (x = 0..4200).

```
┌────────────────────────────────────────────────────────────────────────┐
│ [logo progettista opzionale]   TITOLO SCHEMA (grande, centrato)       │
├────────────────────────────┬───────────────────────────────────────────┤
│ Committente:               │ Progettista:             │ N° disegno:    │
│ Indirizzo impianto:        │ Albo / N° iscrizione:    │ Revisione:     │
│ Potenza impianto [kWp]:    │ Firma: ____________      │ Data:          │
├────────────────────────────┴───────────────────────────────────────────┤
│ Normative: CEI 0-21:2025-10 · CEI 64-8/7 sez.712 · CEI EN 62446-1   │
│ Sistema di misura: SSP · Connessione: BT 3~ · Sistema terra: TT       │
└────────────────────────────────────────────────────────────────────────┘
```

```python
def genera_cartiglio(dati):
    c = dati['cartiglio']
    imp = dati['impianto']
    y0 = 2570
    H  = 400
    W  = 4200

    return f"""
<!-- Bordo cartiglio -->
<rect x="0" y="{y0}" width="{W}" height="{H}"
      fill="white" stroke="#1a1a1a" stroke-width="2"/>
<line x1="0" y1="{y0+80}" x2="{W}" y2="{y0+80}"
      stroke="#1a1a1a" stroke-width="1.5"/>
<line x1="0" y1="{y0+220}" x2="{W}" y2="{y0+220}"
      stroke="#1a1a1a" stroke-width="1"/>
<line x1="{W//2}" y1="{y0+80}" x2="{W//2}" y2="{y0+220}"
      stroke="#1a1a1a" stroke-width="1"/>
<line x1="{W*3//4}" y1="{y0+80}" x2="{W*3//4}" y2="{y0+220}"
      stroke="#1a1a1a" stroke-width="1"/>

<!-- Titolo -->
<text x="{W//2}" y="{y0+55}" font-family="Arial" font-size="28"
      font-weight="bold" fill="#1a1a1a" text-anchor="middle">
  {c['titolo']} — {imp['potenza_picco_kwp']} kWp</text>

<!-- Colonna 1: dati impianto -->
<text x="20" y="{y0+110}" font-family="Arial" font-size="14" fill="#1a1a1a">
  <tspan font-weight="bold">Committente: </tspan>{c['committente']}</text>
<text x="20" y="{y0+135}" font-family="Arial" font-size="13" fill="#1a1a1a">
  Indirizzo: {c['indirizzo_impianto']}</text>
<text x="20" y="{y0+160}" font-family="Arial" font-size="13" fill="#1a1a1a">
  Connessione: BT {imp['fasi_ac']}~ {imp['tensione_rete_v']}V · Sistema terra: {imp['sistema_terra']}</text>
<text x="20" y="{y0+185}" font-family="Arial" font-size="13" fill="#1a1a1a">
  Potenza picco: {imp['potenza_picco_kwp']} kWp</text>

<!-- Colonna 2: progettista + firma -->
<text x="{W//2+20}" y="{y0+110}" font-family="Arial" font-size="14" fill="#1a1a1a">
  <tspan font-weight="bold">Progettista: </tspan>{c['progettista']['nome']}</text>
<text x="{W//2+20}" y="{y0+135}" font-family="Arial" font-size="13" fill="#1a1a1a">
  {c['progettista']['albo']} — N° {c['progettista']['numero_iscrizione']}</text>
<text x="{W//2+20}" y="{y0+165}" font-family="Arial" font-size="13" fill="#777777">
  Firma e timbro:</text>
<line x1="{W//2+130}" y1="{y0+210}" x2="{W*3//4-20}" y2="{y0+210}"
      stroke="#1a1a1a" stroke-width="1"/>

<!-- Colonna 3: codici -->
<text x="{W*3//4+20}" y="{y0+110}" font-family="Arial" font-size="13" fill="#1a1a1a">
  <tspan font-weight="bold">N° disegno: </tspan>{c['numero_disegno']}</text>
<text x="{W*3//4+20}" y="{y0+135}" font-family="Arial" font-size="13" fill="#1a1a1a">
  Revisione: {c['revisione']}</text>
<text x="{W*3//4+20}" y="{y0+160}" font-family="Arial" font-size="13" fill="#1a1a1a">
  Data: {c['data_progetto']}</text>
<text x="{W*3//4+20}" y="{y0+185}" font-family="Arial" font-size="13" fill="#1a1a1a">
  Scala: {c['scala']}</text>

<!-- Riga normative -->
<text x="{W//2}" y="{y0+255}" font-family="Arial" font-size="12"
      fill="#333333" text-anchor="middle">
  Normative applicate: CEI 0-21:2025-10 · CEI 64-8/7 sez.712 · CEI EN 62446-1:2016 · IEC 60617</text>
"""
```

---

## 11. LEGENDA — STRUTTURA

La legenda si posiziona in basso a sinistra, sopra il cartiglio (y ≈ 2300..2560).

```
LEGENDA LINEE:                          LEGENDA SIMBOLI:
──────── DC polo +   [rosso, 2.5px]     □ Modulo FV
──────── DC polo −   [nero, 2.5px]      ⬜ Fusibile gPV
──────── AC 3~       [grigio, 3px]      ◇ Interruttore automatico
- - - -  PE / terra  [verde, tratt.]    △ SPD (scaricatore)
- - - -  Potenzializ.(verde, tratt.)    ⊙ Contatore energia
- ─ - ─  Comunic.    [blu, tratt.]      ═ / ~ Inverter DC/AC
```

```python
def genera_legenda(x_start=200, y_start=2310):
    items_linee = [
        ('DC polo positivo (+)', '#CC3300', None),
        ('DC polo negativo (−)', '#1a1a1a', None),
        ('AC trifase 3~ / monofase', '#444444', None),
        ('Conduttore PE / terra', '#2d7a00', '8,4'),
        ('Collegamento equipotenziale', '#2d7a00', '4,4'),
    ]
    svg = f"""
<rect x="{x_start-10}" y="{y_start-25}" width="900" height="230"
      fill="none" stroke="#cccccc" stroke-width="1" rx="4"/>
<text x="{x_start}" y="{y_start}"
      font-family="Arial" font-size="14" font-weight="bold"
      fill="#1a1a1a">LEGENDA</text>
"""
    for i, (desc, colore, tratt) in enumerate(items_linee):
        yl = y_start + 30 + i * 35
        dash = f'stroke-dasharray="{tratt}"' if tratt else ""
        svg += f"""
<line x1="{x_start}" y1="{yl}" x2="{x_start+80}" y2="{yl}"
      stroke="{colore}" stroke-width="2.5" {dash}/>
<text x="{x_start+95}" y="{yl+5}"
      font-family="Arial" font-size="13" fill="#1a1a1a">{desc}</text>
"""
    return svg
```

---

## 12. TABELLA CALCOLI — FOGLIO DATI (opzionale nel layout)

Posizionabile a destra del disegno o come pagina separata. Contiene i risultati del motore di calcolo.

```
┌────────────────────────────────────────────────────────┐
│ VERIFICA ELETTRICA AUTOMATICA                          │
├─────────────────────────┬──────────────────────────────┤
│ Parametro               │ Valore calcolato             │
├─────────────────────────┼──────────────────────────────┤
│ Voc STR1 a -10°C        │ 537.9 V   (max: 1000 V) ✓   │
│ Vmpp STR1 a +70°C       │ 329.6 V   (min MPPT: 150V) ✓ │
│ Isc STR1                │ 13.8 A    (max MPPT: 15A) ✓  │
│ Caduta tensione DC STR1 │ 0.73 %    (max: 1%) ✓        │
│ Corrente AC nominale    │ 14.4 A    (MCB: 16A) ✓       │
│ Caduta tensione AC      │ 0.51 %    (max: 1%) ✓        │
│ Sezione PE              │ 6 mm²     (min: 6mm²) ✓      │
└─────────────────────────┴──────────────────────────────┘
```

---

## 13. STRUTTURA FILE SVG FINALE

```python
def genera_svg(dati):
    risultati = calcola_tutto(dati)
    layout, mppt_x = calcola_layout(dati)

    svg = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="420mm" height="297mm"
     viewBox="0 0 4200 2970">

  <!-- METADATI -->
  <title>Schema Unifilare FV — {dati['cartiglio']['committente']}</title>
  <desc>Generato automaticamente. Norma: CEI 0-21:2025-10</desc>

  <!-- DEFINIZIONI (markers frecce) -->
  <defs>
    <marker id="arrow_small" viewBox="0 0 10 10"
            refX="8" refY="5" markerWidth="5" markerHeight="5"
            orient="auto-start-reverse">
      <path d="M1 1 L8 5 L1 9" fill="none"
            stroke="context-stroke" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
    <marker id="arrow_small_rev" viewBox="0 0 10 10"
            refX="2" refY="5" markerWidth="5" markerHeight="5"
            orient="auto">
      <path d="M9 1 L2 5 L9 9" fill="none"
            stroke="context-stroke" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <!-- SFONDO BIANCO -->
  <rect x="0" y="0" width="4200" height="2970" fill="white"/>

  <!-- BORDO FOGLIO -->
  <rect x="10" y="10" width="4180" height="2950"
        fill="none" stroke="#1a1a1a" stroke-width="3"/>

  <!-- TITOLO AREA SCHEMA (sopra al disegno) -->
  <text x="2100" y="80"
        font-family="Arial" font-size="20" font-weight="bold"
        fill="#555555" text-anchor="middle">
    Schema unifilare — Impianto FV {dati['impianto']['potenza_picco_kwp']} kWp
    — Conforme CEI 0-21:2025-10
  </text>

  <!-- LAYER 1: CAMPO FV -->
  {genera_campo_fv(dati, layout)}

  <!-- LAYER 2: CASSETTE STRINGA -->
  {genera_cassette(dati, layout)}

  <!-- LAYER 3: CAVI DC -->
  {genera_cavi_dc(dati, layout, risultati)}

  <!-- LAYER 4: INVERTER -->
  {genera_inverter(dati, mppt_x)}

  <!-- LAYER 5: CAVI AC + PROTEZIONI -->
  {genera_ac(dati, risultati)}

  <!-- LAYER 6: DG + PdC + RETE -->
  {genera_pdc_rete(dati)}

  <!-- LAYER 7: MESSA A TERRA -->
  {genera_terra(dati)}

  <!-- LEGENDA -->
  {genera_legenda()}

  <!-- CARTIGLIO -->
  {genera_cartiglio(dati)}

</svg>"""
    return svg
```

---

## 14. EXPORT PDF

```python
import subprocess
import os

def svg_to_pdf(svg_path, pdf_path):
    """
    Opzione 1 (consigliata): Inkscape CLI
    Opzione 2: weasyprint
    Opzione 3: cairosvg
    """
    # Opzione 1 — Inkscape (massima fedeltà grafica)
    result = subprocess.run([
        'inkscape',
        '--export-type=pdf',
        f'--export-filename={pdf_path}',
        svg_path
    ], capture_output=True)
    if result.returncode != 0:
        # Fallback Opzione 2 — cairosvg
        import cairosvg
        cairosvg.svg2pdf(url=svg_path, write_to=pdf_path)
    return pdf_path
```

**Font embedding:** Usare esclusivamente `Arial` o `Liberation Sans` (libera, metriche identiche ad Arial) per garantire che il PDF sia identico all'SVG su qualunque sistema.

---

## 15. INTERFACCIA A RIGA DI COMANDO

```bash
# Utilizzo base
python genera_sld.py --input dati_impianto.json --output schema_fv

# Opzioni disponibili
python genera_sld.py \
  --input dati_impianto.json \
  --output schema_fv \
  --format svg,pdf \       # output: schema_fv.svg e schema_fv.pdf
  --verifica-calcoli \     # stampa report calcoli in console
  --no-tabella-calcoli \   # esclude tabella calcoli dal disegno
  --lingua it              # it | en (etichette)

# Output atteso:
# ✓ schema_fv.svg  — disegno vettoriale
# ✓ schema_fv.pdf  — A3 landscape, pronto per stampa e firma
# ✓ schema_fv_calcoli.txt — report verifica elettrica
```

---

## 16. CHECKLIST DI CONFORMITÀ — AUTOMATIZZARE NEL CODICE

Il programma deve verificare ogni punto e bloccare la generazione se fallisce un test critico (⛔), oppure stampare un avviso per i test informativi (⚠️).

```
⛔ Voc stringa (Tmin) < Vdc_max inverter
⛔ Vmpp stringa (Tmax) > soglia MPPT minima inverter
⛔ Vmpp stringa (STC) < soglia MPPT massima inverter
⛔ Isc stringa × 1.25 ≤ Idc_max_MPPT inverter
⛔ Pac_inverter ≤ Pac_max connessione monofase (6 kW se 1~, 10 kW solo su autorizzazione DSO)
⛔ DG sempre presente (CEI 0-21 §8.2.1)
⛔ DDI sempre presente — integrato se P ≤ 11,08 kW P&P (CEI 0-21 §8.2.2)
⛔ SPI sempre presente con soglie conformi Tabella 13 CEI 0-21:2025-10
⚠️ Caduta tensione DC ≤ 1% (raccomandato)
⚠️ Caduta tensione AC ≤ 1% (raccomandato)
⚠️ Tipo RCD: usare Tipo A per inverter senza trasformatore
⚠️ Per P > 20 kW: rincalzo DDI obbligatorio entro 0,5 s (CEI 0-21 §8.2.2.4)
⚠️ SPD DC presente se cavo DC > 10 m (CEI 64-8)
⚠️ Contatore produzione presente (GSE)
⚠️ Contatore scambio bidirezionale presente (DSO)
⚠️ Cartiglio: tutti i campi obbligatori compilati
⚠️ N° revisione e data aggiornati
```

---

## 17. NOMENCLATURA DISPOSITIVI — SIGLE UFFICIALI CEI 0-21:2025-10

Usare SEMPRE queste sigle nel disegno, nelle etichette e nel codice.

| Sigla | Nome completo | Nello schema |
|---|---|---|
| **DG** | Dispositivo Generale | Immediatamente a valle del PdC |
| **DGL** | Dispositivo Generale di Linea | In alternativa al DG (max 3) |
| **DDI** | Dispositivo di Interfaccia | Separa produzione da rete. Comandato da SPI. |
| **DDG** | Dispositivo di Generatore | Separa il generatore dall'impianto |
| **SPI** | Sistema di Protezione di Interfaccia | Comanda l'apertura del DDI |
| **PdC** | Punto di Connessione | Morsetti a valle del contatore DSO |
| **DSO** | Distribution System Operator | Gestore della rete di distribuzione |
| **P&P** | Plug & Play | Impianto con DDI integrato ≤ 11,08 kW |

> ⚠️ Non usare "NA", "interruttore di interfaccia" o "SPI esterno" come sigle principali.
> Non usare "gestore rete" — usare **DSO**.

---

## 18. SOGLIE SPI — TABELLA DA CODIFICARE (Fonte: CEI 0-21:2025-10 Tabella 13)

Queste soglie devono essere hardcoded nel codice e stampate nel disegno nella sezione SPI.

**Per impianti ≥ 800 W (la quasi totalità dei FV):**

| Codice ANSI | Protezione | Soglia | Tempo di intervento |
|---|---|---|---|
| 59.S1 | Massima tensione (media 10 min) | 1,10 Vn | Max 603 s |
| 59.S2 | Massima tensione istantanea | 1,15 Vn | 0,2 s |
| 27.S1 | Minima tensione | 0,85 Vn | 1,5 s |
| 27.S2 | Minima tensione rapida | 0,15 Vn | 0,2 s |
| 81>.S1 | Massima frequenza (interna) | 50,2 Hz | 0,1 s *(solo con segnale esterno)* |
| 81<.S1 | Minima frequenza (interna) | 49,8 Hz | 0,1 s *(solo con segnale esterno)* |
| 81>.S2 | Massima frequenza | 51,5 Hz | 0,1 s oppure 1 s |
| 81<.S2 | Minima frequenza | 47,5 Hz | 0,1 s oppure 4 s |

**Per impianti < 800 W:**
59.S2 = 1,15 Vn / 27.S1 = 0,80 Vn / 81>.S1 = 51,5 Hz / 81<.S1 = 47,5 Hz

---

*Fine documento — Versione 2.0*
*Fonte normativa primaria: CEI 0-21:2025-10 (consolidata con V1, V2, V2/EC, V2/EC2, V3)*
