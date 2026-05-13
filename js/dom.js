// ── js/dom.js — Centralized DOM cache (AP-17b) ──
// DOM element reference cache extracted from state.js and js/ui/utils.js.
// Owns the shared `DOM` object and the `initDOMCache()` populator. Callers
// continue to access cached references via bundle-scope `DOM.<id>` and
// the populator is still triggered from init() at app startup.

'use strict';

const DOM = {};

function initDOMCache() {
  [
    'calStatus','moveBtn','deletePanelsBtn','snapBtn','welcome',
    'pw','pl','pp','ps','safetyMargin','obstacleDistance',
    'techSize','techBuffer','techRot','techRotVal','techRotRow','techSizeRow',
    'fileStatus','exportOverlay','exportLabel','hint',
    'enableWalkways','walkwaySettings','enableStagger','staggerOffset',
    'walkwayInterval','walkwayWidth','stringNum','pairNum','panelNum',
    'areaList','exclusionList','stringList','areaAccordionBar',
    'areaAccordionSummary','exclusionAccordionBar','exclusionAccordionSummary',
    'stringsDropdown','stringsDropPanel','stringsDropBtn','stringsDropList',
    'stringsDropCount','stringsDropFooter','undoBtn','redoBtn',
    'pmInfo','pmTitle','panelModal','colorModal','dist',
    'strConfigPanel','strConfigBtn','strConfigArrow',
    'areaAccordionArrow','exclusionAccordionArrow',
    'techPlacingInfo','pdfSnapToggle','pdfPageModal',
    'areaBtn','exclusionBtn','calBtn','compass','themeBtn',
    'totalP','totalKw','totalA','imgFile','loadProjectInput',
    'staggerSettings','pdfPageLabel','pdfDpiInfo','pdfThumb',
    'techHeight','techHeightRow',
    'stringPreview','stringDivisors','stringConfirmBtn',
    'colorPicker','colorModalTitle',
    'editVerticesBtn','snapGridWrap','snapGridInput',
    'moduleLibBody','moduleLibGrid','moduleLibArrow',
    'stringsVisBtn', 'distInput', 'distInputVal', 'orthoBtn',
    'moduleIsc', 'moduleVoc', 'moduleImpp', 'moduleVmpp',
    'cableMaterial', 'cableSystemAC',
    'cableLenString', 'cableLenMain', 'cableLenAC', 'cableDropDC', 'cableResults',
    'invPreset', 'invBrand', 'invModel', 'invPac', 'invVmpptMin', 'invVmpptMax',
    'invImaxMppt', 'invVocMax', 'invValidation',
    'invInfo', 'invInfoPac', 'invInfoMppt', 'invInfoAC', 'invInfoVrange', 'invInfoImax', 'invInfoVoc',
    'numInverters', 'multiInvInfo',
  ].forEach(id => { DOM[id] = document.getElementById(id); });
}
