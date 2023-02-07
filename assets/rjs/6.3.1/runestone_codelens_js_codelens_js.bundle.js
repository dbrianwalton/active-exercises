"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_codelens_js_codelens_js"],{

/***/ 51949:
/*!********************************************!*\
  !*** ./runestone/codelens/css/pytutor.css ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 12882:
/*!*******************************************!*\
  !*** ./runestone/codelens/js/codelens.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 2568);
/* harmony import */ var _pytutor_embed_bundle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pytutor-embed.bundle.js */ 71951);
/* harmony import */ var _pytutor_embed_bundle_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_pytutor_embed_bundle_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _css_pytutor_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../css/pytutor.css */ 51949);
/**
 * Created by bmiller on 5/10/15.
 */

/*
 Since I don't want to modify the codelens code I'll attach the logging functionality this way.
 This actually seems like a better way to do it maybe across the board to separate logging
 from the real funcionality.  It would also allow a better way of turning off/on logging..
 As long as Philip doesn't go and change the id values for the buttons and slider this will
 continue to work.... In the best of all worlds we might add a function to the visualizer to
 return the buttons, but I'm having a hard time thinking of any other use for that besides mine.
 */





function attachLoggers(codelens, divid) {
    let rb = new _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
    codelens.domRoot.find("#jmpFirstInstr").click(function () {
        rb.logBookEvent({ event: "codelens", act: "first", div_id: divid });
    });
    codelens.domRoot.find("#jmpLastInstr").click(function () {
        rb.logBookEvent({ event: "codelens", act: "last", div_id: divid });
    });
    codelens.domRoot.find("#jmpStepBack").click(function () {
        rb.logBookEvent({ event: "codelens", act: "back", div_id: divid });
    });
    codelens.domRoot.find("#jmpStepFwd").click(function () {
        rb.logBookEvent({ event: "codelens", act: "fwd", div_id: divid });
    });
    codelens.domRoot.find("#executionSlider").bind("slide", function (evt, ui) {
        rb.logBookEvent({ event: "codelens", act: "slide", div_id: divid });
    });
    // TODO: The component isn't quite fully initialized, but it also doesn't inherit from RunestoneBase. This is a convenient place to mark it ready for now, but it should be moved forward in time during a rewrite.
    rb.containerDiv = document.getElementById(divid);
    rb.indicate_component_ready();
}

function styleButtons(divid) {
    var myVis = $("#" + divid);
    $(myVis).find("#jmpFirstInstr").addClass("btn btn-default");
    $(myVis).find("#jmpStepBack").addClass("btn btn-danger");
    $(myVis).find("#jmpStepFwd").addClass("btn btn-success");
    $(myVis).find("#jmpLastInstr").addClass("btn btn-default");
}

if (typeof allVsualizers === "undefined") {
    window.allVisualizers = [];
}

$(function () {
    if (typeof allTraceData !== "undefined") {
        for (let divid in allTraceData) {
            let cl = document.getElementById(divid);
            let lang = $(cl).data("params").lang;
            try {
                let vis = addVisualizerToPage(allTraceData[divid], divid, {
                    startingInstruction: 0,
                    editCodeBaseURL: null,
                    hideCode: false,
                    lang: lang,
                });
                attachLoggers(vis, divid);
                styleButtons(divid);
                window.allVisualizers.push(vis);
            } catch (err) {
                console.log(`Error rendering CodeLens Problem ${divid}`);
                console.log(err);
            }
        }
        window.addEventListener("codelens:answer", function (evt) {
            let rb = new _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
            rb.logBookEvent({
                event: "codelens",
                div_id: evt.detail.divid,
                act: `answer:${evt.detail.answer}`,
                correct: evt.detail.correct,
            });
            console.log(evt);
        });
    }
});


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2NvZGVsZW5zX2pzX2NvZGVsZW5zX2pzLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFNkQ7QUFDMUI7QUFDTDs7QUFFOUI7QUFDQSxpQkFBaUIsbUVBQWE7QUFDOUI7QUFDQSwwQkFBMEIsZ0RBQWdEO0FBQzFFLEtBQUs7QUFDTDtBQUNBLDBCQUEwQiwrQ0FBK0M7QUFDekUsS0FBSztBQUNMO0FBQ0EsMEJBQTBCLCtDQUErQztBQUN6RSxLQUFLO0FBQ0w7QUFDQSwwQkFBMEIsOENBQThDO0FBQ3hFLEtBQUs7QUFDTDtBQUNBLDBCQUEwQixnREFBZ0Q7QUFDMUUsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxnRUFBZ0UsTUFBTTtBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixtRUFBYTtBQUN0QztBQUNBO0FBQ0E7QUFDQSwrQkFBK0Isa0JBQWtCO0FBQ2pEO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUztBQUNUO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29kZWxlbnMvY3NzL3B5dHV0b3IuY3NzPzk3NzciLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb2RlbGVucy9qcy9jb2RlbGVucy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgYm1pbGxlciBvbiA1LzEwLzE1LlxuICovXG5cbi8qXG4gU2luY2UgSSBkb24ndCB3YW50IHRvIG1vZGlmeSB0aGUgY29kZWxlbnMgY29kZSBJJ2xsIGF0dGFjaCB0aGUgbG9nZ2luZyBmdW5jdGlvbmFsaXR5IHRoaXMgd2F5LlxuIFRoaXMgYWN0dWFsbHkgc2VlbXMgbGlrZSBhIGJldHRlciB3YXkgdG8gZG8gaXQgbWF5YmUgYWNyb3NzIHRoZSBib2FyZCB0byBzZXBhcmF0ZSBsb2dnaW5nXG4gZnJvbSB0aGUgcmVhbCBmdW5jaW9uYWxpdHkuICBJdCB3b3VsZCBhbHNvIGFsbG93IGEgYmV0dGVyIHdheSBvZiB0dXJuaW5nIG9mZi9vbiBsb2dnaW5nLi5cbiBBcyBsb25nIGFzIFBoaWxpcCBkb2Vzbid0IGdvIGFuZCBjaGFuZ2UgdGhlIGlkIHZhbHVlcyBmb3IgdGhlIGJ1dHRvbnMgYW5kIHNsaWRlciB0aGlzIHdpbGxcbiBjb250aW51ZSB0byB3b3JrLi4uLiBJbiB0aGUgYmVzdCBvZiBhbGwgd29ybGRzIHdlIG1pZ2h0IGFkZCBhIGZ1bmN0aW9uIHRvIHRoZSB2aXN1YWxpemVyIHRvXG4gcmV0dXJuIHRoZSBidXR0b25zLCBidXQgSSdtIGhhdmluZyBhIGhhcmQgdGltZSB0aGlua2luZyBvZiBhbnkgb3RoZXIgdXNlIGZvciB0aGF0IGJlc2lkZXMgbWluZS5cbiAqL1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanNcIjtcbmltcG9ydCBcIi4vcHl0dXRvci1lbWJlZC5idW5kbGUuanNcIjtcbmltcG9ydCBcIi4vLi4vY3NzL3B5dHV0b3IuY3NzXCI7XG5cbmZ1bmN0aW9uIGF0dGFjaExvZ2dlcnMoY29kZWxlbnMsIGRpdmlkKSB7XG4gICAgbGV0IHJiID0gbmV3IFJ1bmVzdG9uZUJhc2UoKTtcbiAgICBjb2RlbGVucy5kb21Sb290LmZpbmQoXCIjam1wRmlyc3RJbnN0clwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7IGV2ZW50OiBcImNvZGVsZW5zXCIsIGFjdDogXCJmaXJzdFwiLCBkaXZfaWQ6IGRpdmlkIH0pO1xuICAgIH0pO1xuICAgIGNvZGVsZW5zLmRvbVJvb3QuZmluZChcIiNqbXBMYXN0SW5zdHJcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICByYi5sb2dCb29rRXZlbnQoeyBldmVudDogXCJjb2RlbGVuc1wiLCBhY3Q6IFwibGFzdFwiLCBkaXZfaWQ6IGRpdmlkIH0pO1xuICAgIH0pO1xuICAgIGNvZGVsZW5zLmRvbVJvb3QuZmluZChcIiNqbXBTdGVwQmFja1wiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7IGV2ZW50OiBcImNvZGVsZW5zXCIsIGFjdDogXCJiYWNrXCIsIGRpdl9pZDogZGl2aWQgfSk7XG4gICAgfSk7XG4gICAgY29kZWxlbnMuZG9tUm9vdC5maW5kKFwiI2ptcFN0ZXBGd2RcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICByYi5sb2dCb29rRXZlbnQoeyBldmVudDogXCJjb2RlbGVuc1wiLCBhY3Q6IFwiZndkXCIsIGRpdl9pZDogZGl2aWQgfSk7XG4gICAgfSk7XG4gICAgY29kZWxlbnMuZG9tUm9vdC5maW5kKFwiI2V4ZWN1dGlvblNsaWRlclwiKS5iaW5kKFwic2xpZGVcIiwgZnVuY3Rpb24gKGV2dCwgdWkpIHtcbiAgICAgICAgcmIubG9nQm9va0V2ZW50KHsgZXZlbnQ6IFwiY29kZWxlbnNcIiwgYWN0OiBcInNsaWRlXCIsIGRpdl9pZDogZGl2aWQgfSk7XG4gICAgfSk7XG4gICAgLy8gVE9ETzogVGhlIGNvbXBvbmVudCBpc24ndCBxdWl0ZSBmdWxseSBpbml0aWFsaXplZCwgYnV0IGl0IGFsc28gZG9lc24ndCBpbmhlcml0IGZyb20gUnVuZXN0b25lQmFzZS4gVGhpcyBpcyBhIGNvbnZlbmllbnQgcGxhY2UgdG8gbWFyayBpdCByZWFkeSBmb3Igbm93LCBidXQgaXQgc2hvdWxkIGJlIG1vdmVkIGZvcndhcmQgaW4gdGltZSBkdXJpbmcgYSByZXdyaXRlLlxuICAgIHJiLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRpdmlkKTtcbiAgICByYi5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbn1cblxuZnVuY3Rpb24gc3R5bGVCdXR0b25zKGRpdmlkKSB7XG4gICAgdmFyIG15VmlzID0gJChcIiNcIiArIGRpdmlkKTtcbiAgICAkKG15VmlzKS5maW5kKFwiI2ptcEZpcnN0SW5zdHJcIikuYWRkQ2xhc3MoXCJidG4gYnRuLWRlZmF1bHRcIik7XG4gICAgJChteVZpcykuZmluZChcIiNqbXBTdGVwQmFja1wiKS5hZGRDbGFzcyhcImJ0biBidG4tZGFuZ2VyXCIpO1xuICAgICQobXlWaXMpLmZpbmQoXCIjam1wU3RlcEZ3ZFwiKS5hZGRDbGFzcyhcImJ0biBidG4tc3VjY2Vzc1wiKTtcbiAgICAkKG15VmlzKS5maW5kKFwiI2ptcExhc3RJbnN0clwiKS5hZGRDbGFzcyhcImJ0biBidG4tZGVmYXVsdFwiKTtcbn1cblxuaWYgKHR5cGVvZiBhbGxWc3VhbGl6ZXJzID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmFsbFZpc3VhbGl6ZXJzID0gW107XG59XG5cbiQoZnVuY3Rpb24gKCkge1xuICAgIGlmICh0eXBlb2YgYWxsVHJhY2VEYXRhICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGZvciAobGV0IGRpdmlkIGluIGFsbFRyYWNlRGF0YSkge1xuICAgICAgICAgICAgbGV0IGNsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGl2aWQpO1xuICAgICAgICAgICAgbGV0IGxhbmcgPSAkKGNsKS5kYXRhKFwicGFyYW1zXCIpLmxhbmc7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxldCB2aXMgPSBhZGRWaXN1YWxpemVyVG9QYWdlKGFsbFRyYWNlRGF0YVtkaXZpZF0sIGRpdmlkLCB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nSW5zdHJ1Y3Rpb246IDAsXG4gICAgICAgICAgICAgICAgICAgIGVkaXRDb2RlQmFzZVVSTDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgaGlkZUNvZGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBsYW5nOiBsYW5nLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGF0dGFjaExvZ2dlcnModmlzLCBkaXZpZCk7XG4gICAgICAgICAgICAgICAgc3R5bGVCdXR0b25zKGRpdmlkKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWxsVmlzdWFsaXplcnMucHVzaCh2aXMpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHJlbmRlcmluZyBDb2RlTGVucyBQcm9ibGVtICR7ZGl2aWR9YCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNvZGVsZW5zOmFuc3dlclwiLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICBsZXQgcmIgPSBuZXcgUnVuZXN0b25lQmFzZSgpO1xuICAgICAgICAgICAgcmIubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgICAgICBldmVudDogXCJjb2RlbGVuc1wiLFxuICAgICAgICAgICAgICAgIGRpdl9pZDogZXZ0LmRldGFpbC5kaXZpZCxcbiAgICAgICAgICAgICAgICBhY3Q6IGBhbnN3ZXI6JHtldnQuZGV0YWlsLmFuc3dlcn1gLFxuICAgICAgICAgICAgICAgIGNvcnJlY3Q6IGV2dC5kZXRhaWwuY29ycmVjdCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXZ0KTtcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=