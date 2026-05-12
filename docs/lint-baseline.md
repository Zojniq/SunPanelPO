# Lint baseline

> Document version: 1.0 (initial baseline, AP-09 T2.4.3).
> Authoritative pointer: `eslint.config.js` is the source of truth for rule
> enforcement; this document describes the policy around it.

This document records the current ESLint baseline for Solar Designer Pro and
the rules under which new violations are accepted or rejected.

---

## 1. Scope

### Rules enabled (AP-09 Sub-step A + B-partial)

| Rule | Setting | Source AP |
|---|---|---|
| `no-undef` | `'error'` | A |
| `no-redeclare` | `['error', { builtinGlobals: false }]` | A |
| `no-dupe-keys` | `'error'` | A |
| `no-dupe-args` | `'error'` | A |
| `no-unreachable` | `'error'` | A |
| `no-empty` | `'error'` | A |
| `prefer-const` | `'error'` (off in `js/**`, `data/**` overrides) | A |
| `eqeqeq` | `['error', 'always', { null: 'ignore' }]` | B-partial |

### Per-environment overrides

`eslint.config.js` defines three flat-config blocks:

1. **Browser classic scripts** (`js/**/*.js`, `data/**/*.js`): cross-script
   globals namespace (~85 state symbols + ~150 cross-file function names +
   ~40 browser built-ins). `prefer-const` disabled here — `let`
   declarations in `state.js` are mutated from other files; ESLint cannot
   see cross-file reassignments and would auto-rewrite them to `const`,
   breaking the app.
2. **Electron main process** (`main.js`): Node + Electron globals
   (`require`, `module`, `process`, `__dirname`, `__filename`).
3. **ES modules** (`tests/**/*.js`, `vitest.config.js`): module-strict by
   default, Node + vitest test globals via explicit imports.

### Strict mode (AP-09 Sub-step C)

`'use strict';` directive present in all production files:

- `js/lib/sizing.js`
- `js/config.js`, `js/state.js`, `js/storage.js`, `js/pdf.js`,
  `js/enhancements.js`, `js/export.js`, `js/strings.js`, `js/canvas.js`,
  `js/panels.js`, `js/cables.js`, `js/ui.js`
- `data/modules.data.js`, `data/inverters.data.js`
- `main.js`

ES module files (`tests/**`, `vitest.config.js`) are implicitly strict.

### Ignored paths

`node_modules/`, `vendor/`, `dist/`, `assets/`, `docs/reference/`, `*.log`
(see `eslint.config.js` `ignores`).

### What "baseline" means

The baseline is the number of lint violations tolerated in `main` branch
at a given moment. Any PR that increases this count is rejected. PRs that
decrease it (toward zero) are encouraged.

---

## 2. Current baseline

- **Errors: 0**
- **Warnings: 0**
- **Last verified:** 2026-05-12, command: `npm run lint`.
- **Files in scope:** 16 production (`js/**`, `data/**`, `main.js`) +
  6 test/config (`tests/**`, `vitest.config.js`).
- **Strict-mode parse verification:** `node --check` and
  `new Function(content)` strict-context parse pass on every strict file.
- **Runtime smoke:** AP-09 final manual smoke (M1–M10 + R1–R6) marked as
  PASSED — no console errors, no CSP violations, no worker spawn failures
  under strict mode for the standard S1–S9 happy path and recommended side
  flows.

---

## 3. Policy

1. **CI gate (once AP-13 is in place):** `npm run lint` must return exit 0
   on every PR before merge. Until CI exists, this is a human-discipline
   gate; reviewers reject PRs that worsen lint state.
2. **No silent suppressions.** `/* eslint-disable */` comments must be
   line-scoped or block-scoped (not file-scoped), and must include a
   one-line justification. File-scoped disables are forbidden without
   explicit approval recorded in this document under §3a.
3. **Globals inventory is part of the contract.** Any new cross-script
   global → must be added to `eslint.config.js` `globals` AND to its
   declaring file in the same PR. The two artefacts form a coupled pair
   (see `DO_NOT_TOUCH_PAIRS.md` for the pattern, though this specific pair
   is not yet listed there).
4. **Strict mode is permanent.** Removing `'use strict';` from a file
   requires a written justification and a paired migration plan — never
   as a quick-fix to bypass a runtime error.
5. **Found bugs are not absorbed.** When lint exposes a real bug (as
   happened with `salvaProgetto`/`exportProj` globals and the
   `overInverter`/`strPerMppt` scope leak in `js/strings.js`), the fix is
   a separate, triaged task — not a config workaround.

### §3a Active waivers

None at baseline. All future entries must include rule, scope, reason,
and review date.

---

## 4. Future tightening plan

Ranked from lowest risk to highest:

1. **`no-implicit-globals: 'error'`** (AP-09 Sub-step B remainder).
   Deferred because the cross-script architecture intentionally creates
   shared globals; this rule would require either per-file `/* global */`
   directives (~12 files × ~30 globals) or staying disabled. Will
   reconsider after AP-14 (bundler) when module boundaries make the rule
   meaningful.

2. **`no-unused-vars: 'warn'`** with `varsIgnorePattern: '^_'`.
   Deferred because ~80% of functions in `js/` are called only from HTML
   inline `onclick=` / `oninput=` handlers, which ESLint cannot parse.
   Will revisit after AP-19 (innerHTML / inline-handler sanitization).

3. **`prefer-const: 'error'`** re-enabled for `js/**` and `data/**`.
   Currently disabled because `let X` declarations in `state.js` are
   mutated cross-file. Re-enable after AP-17 (state store) confines
   mutation to a single owning module.

4. **Style rules** (`indent`, `quotes`, `semi`, `space-*`). Out of Phase 2
   scope; pairs naturally with adding `prettier` in a later Phase 3 PR.

5. **Plugin packs** (`eslint-plugin-import`, `eslint-plugin-promise`,
   `eslint-plugin-security`). Add only when a concrete violation pattern
   is observed in review or production — not speculatively.

---

## 5. Re-baselining protocol

When a planned tightening step lands (e.g. promoting a rule from warn to
error, or enabling `no-implicit-globals`):

1. The PR that flips the rule includes an updated §2 of this document.
2. The new "Current baseline" is recorded with the new error/warning
   count (which must be zero — the PR is not merged otherwise).
3. The §4 list moves the completed item to a history footnote.

---

## 6. Pointer to source-of-truth files

- `eslint.config.js` — rule definitions, globals inventory, per-env
  overrides, ignores.
- `package.json` — scripts: `lint`, `lint:fix`.
- `INVARIANTS.md` — invariants under which strict-mode regressions must
  be triaged as bugs, not as test-expectation relaxations.
- `CRITICAL_FLOWS.md` — manual smoke checklist used to verify runtime
  strict-mode safety.
