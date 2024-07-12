"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_wavedrom_js_wavedrom_js"],{

/***/ 32405:
/*!*******************************************!*\
  !*** ./runestone/wavedrom/js/wavedrom.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var wavedrom_wavedrom_min_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! wavedrom/wavedrom.min.js */ 47779);
/* harmony import */ var wavedrom_wavedrom_min_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(wavedrom_wavedrom_min_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var wavedrom_skins_default_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! wavedrom/skins/default.js */ 72000);
/* harmony import */ var wavedrom_skins_default_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(wavedrom_skins_default_js__WEBPACK_IMPORTED_MODULE_1__);
// ***********************************************
// |docname| - JavaScript for the WaveDrom library
// ***********************************************


// This took a fair amount of experimenting to figure out how to make this work with NPM and Webpack. Sigh. Here's the working result.
//
// This has already been packaged for the web with browserify, so we can just import it for the side effects (it defines ``window.WaveDrom``. Importing from the ``lib/`` folder produces a lot of unsatisfied imports when using webpack.


// WaveSkin isn't defined globally, so import the default export to get access to it. It defines a single variable, assuming that the variable will be assigned to the ``window``. Here, it's not. So...

// ...make the required WaveSkin (needed by WaveDrom) available globally.
window.WaveSkin = (wavedrom_skins_default_js__WEBPACK_IMPORTED_MODULE_1___default());

// Run the render after the dynamic load is done.
$(document).on("runestone:login-complete", window.WaveDrom.ProcessAll);


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZV93YXZlZHJvbV9qc193YXZlZHJvbV9qcy5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDYTs7QUFFYjtBQUNBO0FBQ0E7QUFDa0M7O0FBRWxDO0FBQ2lEO0FBQ2pEO0FBQ0Esa0JBQWtCLGtFQUFROztBQUUxQjtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS93YXZlZHJvbS9qcy93YXZlZHJvbS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gfGRvY25hbWV8IC0gSmF2YVNjcmlwdCBmb3IgdGhlIFdhdmVEcm9tIGxpYnJhcnlcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cInVzZSBzdHJpY3RcIjtcblxuLy8gVGhpcyB0b29rIGEgZmFpciBhbW91bnQgb2YgZXhwZXJpbWVudGluZyB0byBmaWd1cmUgb3V0IGhvdyB0byBtYWtlIHRoaXMgd29yayB3aXRoIE5QTSBhbmQgV2VicGFjay4gU2lnaC4gSGVyZSdzIHRoZSB3b3JraW5nIHJlc3VsdC5cbi8vXG4vLyBUaGlzIGhhcyBhbHJlYWR5IGJlZW4gcGFja2FnZWQgZm9yIHRoZSB3ZWIgd2l0aCBicm93c2VyaWZ5LCBzbyB3ZSBjYW4ganVzdCBpbXBvcnQgaXQgZm9yIHRoZSBzaWRlIGVmZmVjdHMgKGl0IGRlZmluZXMgYGB3aW5kb3cuV2F2ZURyb21gYC4gSW1wb3J0aW5nIGZyb20gdGhlIGBgbGliL2BgIGZvbGRlciBwcm9kdWNlcyBhIGxvdCBvZiB1bnNhdGlzZmllZCBpbXBvcnRzIHdoZW4gdXNpbmcgd2VicGFjay5cbmltcG9ydCBcIndhdmVkcm9tL3dhdmVkcm9tLm1pbi5qc1wiO1xuXG4vLyBXYXZlU2tpbiBpc24ndCBkZWZpbmVkIGdsb2JhbGx5LCBzbyBpbXBvcnQgdGhlIGRlZmF1bHQgZXhwb3J0IHRvIGdldCBhY2Nlc3MgdG8gaXQuIEl0IGRlZmluZXMgYSBzaW5nbGUgdmFyaWFibGUsIGFzc3VtaW5nIHRoYXQgdGhlIHZhcmlhYmxlIHdpbGwgYmUgYXNzaWduZWQgdG8gdGhlIGBgd2luZG93YGAuIEhlcmUsIGl0J3Mgbm90LiBTby4uLlxuaW1wb3J0IFdhdmVTa2luIGZyb20gXCJ3YXZlZHJvbS9za2lucy9kZWZhdWx0LmpzXCI7XG4vLyAuLi5tYWtlIHRoZSByZXF1aXJlZCBXYXZlU2tpbiAobmVlZGVkIGJ5IFdhdmVEcm9tKSBhdmFpbGFibGUgZ2xvYmFsbHkuXG53aW5kb3cuV2F2ZVNraW4gPSBXYXZlU2tpbjtcblxuLy8gUnVuIHRoZSByZW5kZXIgYWZ0ZXIgdGhlIGR5bmFtaWMgbG9hZCBpcyBkb25lLlxuJChkb2N1bWVudCkub24oXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgd2luZG93LldhdmVEcm9tLlByb2Nlc3NBbGwpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9