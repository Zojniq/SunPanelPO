// ── data/inverters.data.js — Libreria inverter (preset built-in) ──
// Caricato come <script> prima di cables.js. Definisce il globale INV_PRESETS.
// Per estensioni utente (Phase 4 / AP-20): userData/libraries/inverters.json.

'use strict';

var INV_PRESETS = {
  // SAJ R5 — Monofase  (strPerMppt = max stringhe in parallelo per ingresso MPPT, da datasheet)
  r5_1k5: { brand:'SAJ', model:'R5-1.5K',    pac:1.5,  mppt:1, strPerMppt:1, vMin:80,  vMax:500,  iMax:11,  vocMax:600,  ac:'mono' },
  r5_2k:  { brand:'SAJ', model:'R5-2K',      pac:2,    mppt:1, strPerMppt:1, vMin:80,  vMax:500,  iMax:11,  vocMax:600,  ac:'mono' },
  r5_3k:  { brand:'SAJ', model:'R5-3K',      pac:3,    mppt:2, strPerMppt:1, vMin:80,  vMax:500,  iMax:11,  vocMax:600,  ac:'mono' },
  r5_3k68:{ brand:'SAJ', model:'R5-3.68K',   pac:3.68, mppt:2, strPerMppt:1, vMin:80,  vMax:500,  iMax:11,  vocMax:600,  ac:'mono' },
  r5_4k:  { brand:'SAJ', model:'R5-4K',      pac:4,    mppt:2, strPerMppt:1, vMin:80,  vMax:500,  iMax:11,  vocMax:600,  ac:'mono' },
  r5_5k:  { brand:'SAJ', model:'R5-5K',      pac:5,    mppt:2, strPerMppt:1, vMin:80,  vMax:500,  iMax:12.5,vocMax:600,  ac:'mono' },
  r5_6k:  { brand:'SAJ', model:'R5-6K',      pac:6,    mppt:2, strPerMppt:1, vMin:80,  vMax:500,  iMax:12.5,vocMax:600,  ac:'mono' },
  // SAJ AT3 — Trifase commerciale
  at3_10k:{ brand:'SAJ', model:'AT3-10K',    pac:10,   mppt:2, strPerMppt:1, vMin:160, vMax:1000, iMax:15,  vocMax:1100, ac:'tri'  },
  at3_12k:{ brand:'SAJ', model:'AT3-12K',    pac:12,   mppt:2, strPerMppt:1, vMin:160, vMax:1000, iMax:15,  vocMax:1100, ac:'tri'  },
  at3_15k:{ brand:'SAJ', model:'AT3-15K',    pac:15,   mppt:3, strPerMppt:1, vMin:160, vMax:1000, iMax:15,  vocMax:1100, ac:'tri'  },
  at3_17k:{ brand:'SAJ', model:'AT3-17K',    pac:17,   mppt:3, strPerMppt:1, vMin:160, vMax:1000, iMax:15,  vocMax:1100, ac:'tri'  },
  at3_20k:{ brand:'SAJ', model:'AT3-20K',    pac:20,   mppt:4, strPerMppt:1, vMin:160, vMax:1000, iMax:20,  vocMax:1100, ac:'tri'  },
  at3_25k:{ brand:'SAJ', model:'AT3-25K',    pac:25,   mppt:4, strPerMppt:1, vMin:160, vMax:1000, iMax:20,  vocMax:1100, ac:'tri'  },
  at3_30k:{ brand:'SAJ', model:'AT3-30K',    pac:30,   mppt:4, strPerMppt:1, vMin:160, vMax:1000, iMax:20,  vocMax:1100, ac:'tri'  },
  // SAJ C6 — String inverter industriale (2 stringhe per ingresso MPPT da datasheet)
  c6_30k: { brand:'SAJ', model:'C6-30K-T6',  pac:30,   mppt:4, strPerMppt:2, vMin:200, vMax:1000, iMax:20,  vocMax:1100, ac:'tri'  },
  c6_36k: { brand:'SAJ', model:'C6-36K-T6',  pac:36,   mppt:4, strPerMppt:2, vMin:200, vMax:1000, iMax:20,  vocMax:1100, ac:'tri'  },
  c6_40k: { brand:'SAJ', model:'C6-40K-T6',  pac:40,   mppt:4, strPerMppt:2, vMin:200, vMax:1000, iMax:20,  vocMax:1100, ac:'tri'  },
  c6_50k: { brand:'SAJ', model:'C6-50K-T6',  pac:50,   mppt:6, strPerMppt:2, vMin:200, vMax:1000, iMax:25,  vocMax:1100, ac:'tri'  },
  c6_60k: { brand:'SAJ', model:'C6-60K-T6',  pac:60,   mppt:6, strPerMppt:2, vMin:200, vMax:1000, iMax:25,  vocMax:1100, ac:'tri'  },
  c6_75k: { brand:'SAJ', model:'C6-75K-T6',  pac:75,   mppt:6, strPerMppt:2, vMin:200, vMax:1000, iMax:25,  vocMax:1100, ac:'tri'  },
  c6_100k:{ brand:'SAJ', model:'C6-100K-T6', pac:100,  mppt:6, strPerMppt:2, vMin:200, vMax:1000, iMax:32,  vocMax:1100, ac:'tri'  },
};
