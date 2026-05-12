# .sdproj — Project file format (v1)

> Document version: 1.0 (introduced in AP-10 / PR-26).
> Authoritative shape reference: `schemas/sdproj.v1.json`.
> Builder: `js/storage.js` → `buildSdprojDocument()`.

`.sdproj` is the on-disk project file format for Solar Designer Pro. It is a
plain JSON text file in UTF-8, formatted for human readability and for
Git-diff stability.

## File extension and MIME

- Extension: `.sdproj`
- Wire format: JSON text (UTF-8)
- Internal MIME for `showSaveFilePicker`: `application/json`

`.sdproj` is structurally JSON; the distinct extension exists to:
1. Make file-association decisions unambiguous (this is a Solar Designer
   project, not a generic JSON dump).
2. Let future Open-dialog filters target `.sdproj` specifically.
3. Reserve `.json` for the legacy export path
   (`saveProjectJSON()` → "Esporta JSON" button) which produces the
   pre-AP-10 shape.

## Top-level shape

Three top-level fields, in this order:

```jsonc
{
  "version":  "sdproj/1",
  "metadata": { ... },
  "project":  { ... }
}
```

### `version` (string, required)

The canonical format marker. For this revision: exactly the string
`"sdproj/1"`. Future revisions use `"sdproj/2"`, `"sdproj/1.1"`, etc.

Readers MUST inspect this field first and refuse to load files with an
unknown value. Legacy localStorage snapshots stamped `"sdp-v9"` are NOT
considered `.sdproj` files — they migrate via a separate path
(PR-28 / T2.5.5).

### `metadata` (object, required)

Traceability and provenance information that pertains to the file itself,
not to the engineering content. Every saved `.sdproj` includes at least
these fields:

| Field | Type | Description |
|---|---|---|
| `appVersion` | string | Semver of Solar Designer Pro at the moment of save. PR-26 hardcodes `"1.0.0"`; AP-11 will read this dynamically. |
| `normsRevision` | string | Normative edition baseline used for sizing/validation. PR-26 emits a placeholder (`"CEI 0-21:2022"`); AP-11 will source this from `COMPLIANCE.md` registry. |
| `createdAt` | ISO 8601 UTC string | When the project was first saved in this session. Reused across subsequent saves within the same app session. PR-26 limitation: a new app launch resets this until PR-27 reads it back from the opened file. |
| `modifiedAt` | ISO 8601 UTC string | Set on every save. |
| `projectName` | string | Human-readable name. Derived from `project.cartiglio.committente` if present and non-empty, else `"progetto-fv"`. |

Additional metadata fields MAY appear in future revisions; readers MUST
ignore unknown metadata keys (forward compatibility).

### `project` (object, required)

The engineering payload. Same shape as the value returned by
`_buildFullState()` in `js/storage.js`, **with the legacy top-level
`version` field stripped** so that the only canonical version marker is
at the top of the document, not inside `project`.

Stable keys (current set; future revisions may extend):

| Key | Description |
|---|---|
| `scale` | Pixels per real metre, from calibration (INV-W-02). |
| `panelOrientation` | `'auto' \| 'portrait' \| 'landscape'`. |
| `walkwaysEnabled` | Boolean. |
| `installableAreas` | Polygon list with layout options per area. |
| `exclusionAreas` | Polygon list. |
| `technicalObjects` | Chimneys / antennas / HVAC / skylights / exhaust outlets with buffer (INV-W-10). |
| `panels` | Placed panel list. |
| `strings` | Inverter string assignments. |
| `calPts` | Calibration anchor points. |
| `inverterList` | `_inverterList` snapshot. |
| `moduleParams` | Form values for module S3 panel. |
| `cartiglio` | SLD title-block fields. |

Refer to `INVARIANTS.md` §4 (Data invariants) for the integrity rules
these fields must satisfy at save time.

## What is NOT in `.sdproj`

- **Planimetria image** (PNG / PDF binary). The base image is loaded
  separately by the user on each session. Embedding it would balloon
  file size and break Git-diff utility.
- **Theme preference** (light/dark). Per INV-W-14, this is a per-machine
  user preference, not a project property.
- **User module library** (`localStorage['sdp_module_library']`).
  Per-user library, not per-project.
- **UI ephemera**: viewport pan/zoom, current step, modal open state,
  paint-mode selection, hover state.

## Example — minimal saved file

```json
{
  "version": "sdproj/1",
  "metadata": {
    "appVersion": "1.0.0",
    "normsRevision": "CEI 0-21:2022",
    "createdAt": "2026-05-12T10:00:00.000Z",
    "modifiedAt": "2026-05-12T14:30:00.000Z",
    "projectName": "progetto-fv"
  },
  "project": {
    "scale": 1,
    "panelOrientation": "auto",
    "walkwaysEnabled": false,
    "installableAreas": [],
    "exclusionAreas": [],
    "technicalObjects": [],
    "panels": [],
    "strings": [],
    "calPts": [],
    "inverterList": [],
    "moduleParams": {
      "pw": "1.134", "pl": "1.722", "pp": "400",
      "ps": "2", "safetyMargin": "10", "obstacleDistance": "",
      "walkwayInterval": "3", "walkwayWidth": "80",
      "staggerOffset": "50", "enableStagger": false
    },
    "cartiglio": {
      "committente": "", "indirizzo": "", "progettista": "",
      "albo": "", "numDisegno": "", "revisione": "00",
      "spiModello": "", "spiMatricola": "", "spiCertificato": ""
    }
  }
}
```

## Example — typical 5 kWp residential project

Same shape with non-empty arrays:

```jsonc
{
  "version": "sdproj/1",
  "metadata": {
    "appVersion": "1.0.0",
    "normsRevision": "CEI 0-21:2022",
    "createdAt": "2026-05-12T10:00:00.000Z",
    "modifiedAt": "2026-05-12T14:30:00.000Z",
    "projectName": "Mario Rossi"
  },
  "project": {
    "scale": 25.3,
    "panelOrientation": "portrait",
    "walkwaysEnabled": false,
    "installableAreas": [
      { "points": [{"x": 100, "y": 80}, /* ... */], "type": "installable", "orientation": "portrait", /* ... */ }
    ],
    "exclusionAreas": [],
    "technicalObjects": [
      { "type": "chimney", "x": 250, "y": 120, "sizePx": 30, "bufferM": 0, "ang": 0 }
    ],
    "panels": [ /* 12 panels */ ],
    "strings": [ { "id": 1, "name": "Stringa 1", "color": "...", "panels": [ /* ... */ ] } ],
    "calPts": [{"x": 50, "y": 50}, {"x": 50, "y": 303}],
    "inverterList": [
      { "key": "r5_5k", "brand": "SAJ", "model": "R5-5K", /* ... */, "qty": 1 }
    ],
    "moduleParams": { /* ... */ },
    "cartiglio": { "committente": "Mario Rossi", "indirizzo": "Via Esempio 1, Padova", /* ... */ }
  }
}
```

## Versioning protocol

`version` is part of the file contract (INV-D-01). Breaking changes
require incrementing the major part (`sdproj/1` → `sdproj/2`).
Additive-only changes — new optional fields, new entries in dropdowns —
do NOT require a version bump; readers must ignore unknown keys.

PR-29 (T2.5.6) introduces the version-dispatch mechanism that lets the
reader fan out to per-version handlers and fail cleanly on unknown
versions.

## Encoding and formatting

- UTF-8 text, no BOM.
- LF line endings.
- 2-space indent (matches `JSON.stringify(doc, null, 2)`).
- Field order in output follows the order written by
  `buildSdprojDocument()`, but parsers MUST NOT rely on ordering —
  JSON parsers are free to reorder keys.

## Relationship to `localStorage`

`localStorage['sdp_project_v1']` continues to act as a continuous
recovery snapshot. It is auto-saved 800 ms after the last mutation and
restored on app launch. `.sdproj` is the **user-visible source of
truth**; localStorage is the **safety net** between explicit saves.

PR-28 (T2.5.5) will define the migration from legacy localStorage shape
(`version: "sdp-v9"`) into the `sdproj/1` runtime model.

## Pointers

- Builder: `js/storage.js` → `buildSdprojDocument()` (introduced PR-26)
- Save call: `js/export.js` → `salvaProgetto()` (modified PR-26)
- Schema (JSON Schema 2020-12 draft, non-runtime): `schemas/sdproj.v1.json`
- Invariants: `INVARIANTS.md` §1 (Physical), §4 (Data)
- Norms baseline: `COMPLIANCE.md`
