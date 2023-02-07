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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3dhdmVkcm9tX2pzX3dhdmVkcm9tX2pzLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNhOztBQUViO0FBQ0E7QUFDQTtBQUNrQzs7QUFFbEM7QUFDaUQ7QUFDakQ7QUFDQSxrQkFBa0Isa0VBQVE7O0FBRTFCO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3dhdmVkcm9tL2pzL3dhdmVkcm9tLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyB8ZG9jbmFtZXwgLSBKYXZhU2NyaXB0IGZvciB0aGUgV2F2ZURyb20gbGlicmFyeVxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblwidXNlIHN0cmljdFwiO1xuXG4vLyBUaGlzIHRvb2sgYSBmYWlyIGFtb3VudCBvZiBleHBlcmltZW50aW5nIHRvIGZpZ3VyZSBvdXQgaG93IHRvIG1ha2UgdGhpcyB3b3JrIHdpdGggTlBNIGFuZCBXZWJwYWNrLiBTaWdoLiBIZXJlJ3MgdGhlIHdvcmtpbmcgcmVzdWx0LlxuLy9cbi8vIFRoaXMgaGFzIGFscmVhZHkgYmVlbiBwYWNrYWdlZCBmb3IgdGhlIHdlYiB3aXRoIGJyb3dzZXJpZnksIHNvIHdlIGNhbiBqdXN0IGltcG9ydCBpdCBmb3IgdGhlIHNpZGUgZWZmZWN0cyAoaXQgZGVmaW5lcyBgYHdpbmRvdy5XYXZlRHJvbWBgLiBJbXBvcnRpbmcgZnJvbSB0aGUgYGBsaWIvYGAgZm9sZGVyIHByb2R1Y2VzIGEgbG90IG9mIHVuc2F0aXNmaWVkIGltcG9ydHMgd2hlbiB1c2luZyB3ZWJwYWNrLlxuaW1wb3J0IFwid2F2ZWRyb20vd2F2ZWRyb20ubWluLmpzXCI7XG5cbi8vIFdhdmVTa2luIGlzbid0IGRlZmluZWQgZ2xvYmFsbHksIHNvIGltcG9ydCB0aGUgZGVmYXVsdCBleHBvcnQgdG8gZ2V0IGFjY2VzcyB0byBpdC4gSXQgZGVmaW5lcyBhIHNpbmdsZSB2YXJpYWJsZSwgYXNzdW1pbmcgdGhhdCB0aGUgdmFyaWFibGUgd2lsbCBiZSBhc3NpZ25lZCB0byB0aGUgYGB3aW5kb3dgYC4gSGVyZSwgaXQncyBub3QuIFNvLi4uXG5pbXBvcnQgV2F2ZVNraW4gZnJvbSBcIndhdmVkcm9tL3NraW5zL2RlZmF1bHQuanNcIjtcbi8vIC4uLm1ha2UgdGhlIHJlcXVpcmVkIFdhdmVTa2luIChuZWVkZWQgYnkgV2F2ZURyb20pIGF2YWlsYWJsZSBnbG9iYWxseS5cbndpbmRvdy5XYXZlU2tpbiA9IFdhdmVTa2luO1xuXG4vLyBSdW4gdGhlIHJlbmRlciBhZnRlciB0aGUgZHluYW1pYyBsb2FkIGlzIGRvbmUuXG4kKGRvY3VtZW50KS5vbihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCB3aW5kb3cuV2F2ZURyb20uUHJvY2Vzc0FsbCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=