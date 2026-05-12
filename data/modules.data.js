// ── data/modules.data.js — Libreria moduli FV (preset built-in) ──
// Caricato come <script> prima di state.js. Definisce il globale MODULE_PRESETS.
// Per estensioni utente (Phase 4 / AP-20): userData/libraries/modules.json.

'use strict';

var MODULE_PRESETS = [
  // ── JA Solar ──────────────────────────────────────────────────────────
  // iscr = corrente inversa massima ammissibile (da datasheet — stima ≈ 1.35×Isc arrotondata)
  // vsys_max = tensione massima di sistema (V) — 1000V per moduli standard
  { brand:'JA Solar',        name:'JAM54S30-405/MR',    pw:1.134, pl:1.722, pp:405, isc:10.56, voc:37.26, impp:9.98, vmpp:40.58, tcoef_voc:-0.27, tcoef_pmax:-0.35, iscr:15.0, vsys_max:1000 },
  { brand:'JA Solar',        name:'JAM66D45-590/LB',    pw:1.303, pl:2.172, pp:590, isc:14.02, voc:52.70, impp:13.20,vmpp:44.72, tcoef_voc:-0.27, tcoef_pmax:-0.35, iscr:20.0, vsys_max:1500 },
  { brand:'JA Solar',        name:'JAM72D42-630/LB',    pw:1.303, pl:2.384, pp:630, isc:16.00, voc:49.50, impp:15.10,vmpp:41.72, tcoef_voc:-0.28, tcoef_pmax:-0.35, iscr:22.0, vsys_max:1500 },
  // ── LONGi Solar ───────────────────────────────────────────────────────
  { brand:'LONGi',           name:'Hi-MO 6 LR5-54HTH-440M', pw:1.134, pl:1.762, pp:440, isc:10.91, voc:51.40, impp:10.31,vmpp:42.68, tcoef_voc:-0.27, tcoef_pmax:-0.34, iscr:15.0, vsys_max:1000 },
  { brand:'LONGi',           name:'Hi-MO X6 LR5-66HTH-595M',pw:1.303, pl:2.172, pp:595, isc:14.05, voc:53.25, impp:13.27,vmpp:44.87, tcoef_voc:-0.27, tcoef_pmax:-0.34, iscr:20.0, vsys_max:1500 },
  { brand:'LONGi',           name:'Hi-MO X6 LR5-72HTH-665M',pw:1.303, pl:2.384, pp:665, isc:16.56, voc:50.40, impp:15.63,vmpp:42.52, tcoef_voc:-0.27, tcoef_pmax:-0.34, iscr:22.5, vsys_max:1500 },
  // ── Canadian Solar ────────────────────────────────────────────────────
  { brand:'Canadian Solar',  name:'CS6R-415T HiKu6',    pw:1.134, pl:1.762, pp:415, isc:10.50, voc:50.20, impp: 9.92,vmpp:41.83, tcoef_voc:-0.27, tcoef_pmax:-0.35, iscr:15.0, vsys_max:1000 },
  { brand:'Canadian Solar',  name:'CS7N-655MS HiKu7',   pw:1.303, pl:2.384, pp:655, isc:16.16, voc:50.15, impp:15.27,vmpp:42.90, tcoef_voc:-0.27, tcoef_pmax:-0.35, iscr:22.0, vsys_max:1500 },
  // ── Jinko Solar ───────────────────────────────────────────────────────
  { brand:'Jinko Solar',     name:'JKM420N-54HL4-V Tiger Neo', pw:1.134, pl:1.722, pp:420, isc:10.93, voc:51.30, impp:10.26,vmpp:40.95, tcoef_voc:-0.26, tcoef_pmax:-0.30, iscr:15.0, vsys_max:1000 },
  { brand:'Jinko Solar',     name:'JKM580N-72HL4-V Tiger Neo', pw:1.303, pl:2.278, pp:580, isc:13.94, voc:52.68, impp:13.16,vmpp:44.10, tcoef_voc:-0.26, tcoef_pmax:-0.30, iscr:19.0, vsys_max:1500 },
  { brand:'Jinko Solar',     name:'JKM660N-78HL4-BDV Tiger Neo Bifacial', pw:1.303, pl:2.465, pp:660, isc:16.50, voc:50.28, impp:15.61,vmpp:42.29, tcoef_voc:-0.26, tcoef_pmax:-0.30, iscr:22.5, vsys_max:1500 },
  // ── Risen Energy ──────────────────────────────────────────────────────
  { brand:'Risen Energy',    name:'RSM40-8-400M',        pw:1.134, pl:1.722, pp:400, isc:10.28, voc:49.50, impp: 9.68,vmpp:41.33, tcoef_voc:-0.28, tcoef_pmax:-0.36, iscr:14.0, vsys_max:1000 },
  { brand:'Risen Energy',    name:'RSM110-8-545BMDG Bifacial', pw:1.303, pl:2.172, pp:545, isc:13.97, voc:49.50, impp:13.17,vmpp:41.43, tcoef_voc:-0.28, tcoef_pmax:-0.36, iscr:19.0, vsys_max:1500 },
  // ── Generico / Personalizzato ─────────────────────────────────────────
  { brand:'Generico',        name:'400Wp std',           pw:1.134, pl:1.722, pp:400, isc:9.78,  voc:41.8,  impp:9.20, vmpp:43.5,  tcoef_voc:-0.30, tcoef_pmax:-0.40, iscr:14.0, vsys_max:1000 },
  { brand:'Generico',        name:'550Wp BiFi',          pw:1.303, pl:2.172, pp:550, isc:13.95, voc:44.4,  impp:13.17,vmpp:41.8,  tcoef_voc:-0.30, tcoef_pmax:-0.40, iscr:19.0, vsys_max:1500 },
];
