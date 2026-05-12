# tests/

Automated tests run via `vitest`. Two commands:

```sh
npm test          # single run, exits with non-zero on failure (CI)
npm run test:watch
```

## Conventions

- Files: `tests/**/*.test.js`. Mirror the production module path where
  possible (e.g. tests of `js/lib/sizing.js` live under `tests/sizing/`).
- Environment: `node` (no DOM). When DOM-dependent tests become needed,
  switch the relevant file to `happy-dom` via vitest's per-file env
  directive.
- Imports: explicit `import { describe, test, expect } from 'vitest'`
  (no globals).
- Production code is **not yet importable**. Phase-2 work to extract
  pure functions (AP-08) is the prerequisite for the first real tests
  (golden tests for cable sizing, string sizing, voltage drop).

## What lives here today

`smoke.test.js` — a single trivial assertion that proves the harness is
wired. It does not exercise any production logic; its only job is to
catch a broken `npm test` setup.

## Coming next

After AP-08 (pure function extraction), this directory will contain:

```
tests/
├─ smoke.test.js                    (this file)
├─ sizing/
│  ├─ cable.test.js                 golden tests for calcSection / calcSectionAC
│  ├─ string.test.js                golden tests for string validation
│  └─ vdrop.test.js                 golden tests for calcVoltageDrop
└─ fixtures/
   └─ cases.md                      catalogue of test cases (5 kWp mono, 20 kWp tri, edge cases)
```

See `INVARIANTS.md` (formula invariants) and `COMPLIANCE.md` (norm
references) for what these tests must protect.
