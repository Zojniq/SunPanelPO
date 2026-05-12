// ── tests/setup/load-cables.js ──────────────────────────────────────────────
// Loader for the pure sizing helpers. AP-08-main re-pointed this from a
// vm-based read of js/cables.js to a direct CommonJS require of the
// extracted js/lib/sizing.js module.
//
// CONTRACT:
//
//  1. Source: js/lib/sizing.js — read via createRequire, exactly as the
//     browser does via <script src="js/lib/sizing.js">. The file's IIFE
//     evaluates once; its `module.exports = api` (the same object it
//     also assigns to globalThis.SDPSizing in the browser) is the
//     return value.
//
//  2. Return shape: { calcSection, calcSectionAC, calcVoltageDrop,
//     getCableCapacity, plus exported constants }. Tests only call the
//     four functions today; constants are exposed for future tests.
//
//  3. Cache: lazy + singleton per Node process (require's own cache).
//
//  4. Failure mode: if js/lib/sizing.js stops exporting one of the four
//     required functions, the loader throws with a clear message. This
//     is the signal that the namespace contract was broken.

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const SIZING_PATH = resolve(__dirname, '..', '..', 'js', 'lib', 'sizing.js');

let _cached = null;

export function loadCables() {
  if (_cached) return _cached;
  let api;
  try {
    api = require(SIZING_PATH);
  } catch (e) {
    throw new Error(`load-cables: cannot require ${SIZING_PATH}: ${e.message}`);
  }
  const required = ['calcSection', 'calcSectionAC', 'calcVoltageDrop', 'getCableCapacity'];
  for (const name of required) {
    if (typeof api[name] !== 'function') {
      throw new Error(
        `load-cables: expected function ${name} on SDPSizing namespace, got ${typeof api[name]}. ` +
        `Check that js/lib/sizing.js still exports it.`
      );
    }
  }
  _cached = api;
  return _cached;
}
