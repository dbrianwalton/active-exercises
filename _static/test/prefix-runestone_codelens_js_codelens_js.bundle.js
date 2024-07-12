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

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.codelens = function (opts) {
    // opts is an object that will contain a key referencing the orignal dom element
    // often it will also have a key for  useRunestoneServices
    let el = opts.orig;
    let vel = el.querySelector(".pytutorVisualizer");
    let divid = vel.id;
    let lang = JSON.parse(vel.dataset.params).lang;
    // addVisualizerToPage comes from pytutor-embed
    // allTraceData is created by a series of script tags that when loaded create this
    // as a global object containing trace information.
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
};

// After all of the libraries are loaded...
$(document).on("runestone:login-complete", function () {
    if (typeof allTraceData !== "undefined") {
        for (let divid in allTraceData) {
            let cl = document.getElementById(divid);
            let lang = $(cl).data("params").lang;
            try {
                if (divid in window.allTraceData) {
                    var vis = addVisualizerToPage(allTraceData[divid], divid, {
                        startingInstruction: 0,
                        editCodeBaseURL: null,
                        hideCode: false,
                        lang: lang,
                    });
                } else {
                    alert(
                        `${divid} is missing trace data.  This is probably a build error. Please report it on github.`
                    );
                }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZV9jb2RlbGVuc19qc19jb2RlbGVuc19qcy5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRTZEO0FBQzFCO0FBQ0w7O0FBRTlCO0FBQ0EsaUJBQWlCLG1FQUFhO0FBQzlCO0FBQ0EsMEJBQTBCLGdEQUFnRDtBQUMxRSxLQUFLO0FBQ0w7QUFDQSwwQkFBMEIsK0NBQStDO0FBQ3pFLEtBQUs7QUFDTDtBQUNBLDBCQUEwQiwrQ0FBK0M7QUFDekUsS0FBSztBQUNMO0FBQ0EsMEJBQTBCLDhDQUE4QztBQUN4RSxLQUFLO0FBQ0w7QUFDQSwwQkFBMEIsZ0RBQWdEO0FBQzFFLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTix3REFBd0QsTUFBTTtBQUM5RDtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLG1FQUFhO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixrQkFBa0I7QUFDN0M7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsa0JBQWtCO0FBQ2xCO0FBQ0EsMkJBQTJCLE9BQU87QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxnRUFBZ0UsTUFBTTtBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixtRUFBYTtBQUN0QztBQUNBO0FBQ0E7QUFDQSwrQkFBK0Isa0JBQWtCO0FBQ2pEO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUztBQUNUO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29kZWxlbnMvY3NzL3B5dHV0b3IuY3NzPzk3NzciLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb2RlbGVucy9qcy9jb2RlbGVucy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgYm1pbGxlciBvbiA1LzEwLzE1LlxuICovXG5cbi8qXG4gU2luY2UgSSBkb24ndCB3YW50IHRvIG1vZGlmeSB0aGUgY29kZWxlbnMgY29kZSBJJ2xsIGF0dGFjaCB0aGUgbG9nZ2luZyBmdW5jdGlvbmFsaXR5IHRoaXMgd2F5LlxuIFRoaXMgYWN0dWFsbHkgc2VlbXMgbGlrZSBhIGJldHRlciB3YXkgdG8gZG8gaXQgbWF5YmUgYWNyb3NzIHRoZSBib2FyZCB0byBzZXBhcmF0ZSBsb2dnaW5nXG4gZnJvbSB0aGUgcmVhbCBmdW5jaW9uYWxpdHkuICBJdCB3b3VsZCBhbHNvIGFsbG93IGEgYmV0dGVyIHdheSBvZiB0dXJuaW5nIG9mZi9vbiBsb2dnaW5nLi5cbiBBcyBsb25nIGFzIFBoaWxpcCBkb2Vzbid0IGdvIGFuZCBjaGFuZ2UgdGhlIGlkIHZhbHVlcyBmb3IgdGhlIGJ1dHRvbnMgYW5kIHNsaWRlciB0aGlzIHdpbGxcbiBjb250aW51ZSB0byB3b3JrLi4uLiBJbiB0aGUgYmVzdCBvZiBhbGwgd29ybGRzIHdlIG1pZ2h0IGFkZCBhIGZ1bmN0aW9uIHRvIHRoZSB2aXN1YWxpemVyIHRvXG4gcmV0dXJuIHRoZSBidXR0b25zLCBidXQgSSdtIGhhdmluZyBhIGhhcmQgdGltZSB0aGlua2luZyBvZiBhbnkgb3RoZXIgdXNlIGZvciB0aGF0IGJlc2lkZXMgbWluZS5cbiAqL1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanNcIjtcbmltcG9ydCBcIi4vcHl0dXRvci1lbWJlZC5idW5kbGUuanNcIjtcbmltcG9ydCBcIi4vLi4vY3NzL3B5dHV0b3IuY3NzXCI7XG5cbmZ1bmN0aW9uIGF0dGFjaExvZ2dlcnMoY29kZWxlbnMsIGRpdmlkKSB7XG4gICAgbGV0IHJiID0gbmV3IFJ1bmVzdG9uZUJhc2UoKTtcbiAgICBjb2RlbGVucy5kb21Sb290LmZpbmQoXCIjam1wRmlyc3RJbnN0clwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7IGV2ZW50OiBcImNvZGVsZW5zXCIsIGFjdDogXCJmaXJzdFwiLCBkaXZfaWQ6IGRpdmlkIH0pO1xuICAgIH0pO1xuICAgIGNvZGVsZW5zLmRvbVJvb3QuZmluZChcIiNqbXBMYXN0SW5zdHJcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICByYi5sb2dCb29rRXZlbnQoeyBldmVudDogXCJjb2RlbGVuc1wiLCBhY3Q6IFwibGFzdFwiLCBkaXZfaWQ6IGRpdmlkIH0pO1xuICAgIH0pO1xuICAgIGNvZGVsZW5zLmRvbVJvb3QuZmluZChcIiNqbXBTdGVwQmFja1wiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7IGV2ZW50OiBcImNvZGVsZW5zXCIsIGFjdDogXCJiYWNrXCIsIGRpdl9pZDogZGl2aWQgfSk7XG4gICAgfSk7XG4gICAgY29kZWxlbnMuZG9tUm9vdC5maW5kKFwiI2ptcFN0ZXBGd2RcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICByYi5sb2dCb29rRXZlbnQoeyBldmVudDogXCJjb2RlbGVuc1wiLCBhY3Q6IFwiZndkXCIsIGRpdl9pZDogZGl2aWQgfSk7XG4gICAgfSk7XG4gICAgY29kZWxlbnMuZG9tUm9vdC5maW5kKFwiI2V4ZWN1dGlvblNsaWRlclwiKS5iaW5kKFwic2xpZGVcIiwgZnVuY3Rpb24gKGV2dCwgdWkpIHtcbiAgICAgICAgcmIubG9nQm9va0V2ZW50KHsgZXZlbnQ6IFwiY29kZWxlbnNcIiwgYWN0OiBcInNsaWRlXCIsIGRpdl9pZDogZGl2aWQgfSk7XG4gICAgfSk7XG4gICAgLy8gVE9ETzogVGhlIGNvbXBvbmVudCBpc24ndCBxdWl0ZSBmdWxseSBpbml0aWFsaXplZCwgYnV0IGl0IGFsc28gZG9lc24ndCBpbmhlcml0IGZyb20gUnVuZXN0b25lQmFzZS4gVGhpcyBpcyBhIGNvbnZlbmllbnQgcGxhY2UgdG8gbWFyayBpdCByZWFkeSBmb3Igbm93LCBidXQgaXQgc2hvdWxkIGJlIG1vdmVkIGZvcndhcmQgaW4gdGltZSBkdXJpbmcgYSByZXdyaXRlLlxuICAgIHJiLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRpdmlkKTtcbiAgICByYi5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbn1cblxuZnVuY3Rpb24gc3R5bGVCdXR0b25zKGRpdmlkKSB7XG4gICAgdmFyIG15VmlzID0gJChcIiNcIiArIGRpdmlkKTtcbiAgICAkKG15VmlzKS5maW5kKFwiI2ptcEZpcnN0SW5zdHJcIikuYWRkQ2xhc3MoXCJidG4gYnRuLWRlZmF1bHRcIik7XG4gICAgJChteVZpcykuZmluZChcIiNqbXBTdGVwQmFja1wiKS5hZGRDbGFzcyhcImJ0biBidG4tZGFuZ2VyXCIpO1xuICAgICQobXlWaXMpLmZpbmQoXCIjam1wU3RlcEZ3ZFwiKS5hZGRDbGFzcyhcImJ0biBidG4tc3VjY2Vzc1wiKTtcbiAgICAkKG15VmlzKS5maW5kKFwiI2ptcExhc3RJbnN0clwiKS5hZGRDbGFzcyhcImJ0biBidG4tZGVmYXVsdFwiKTtcbn1cblxuaWYgKHR5cGVvZiBhbGxWc3VhbGl6ZXJzID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmFsbFZpc3VhbGl6ZXJzID0gW107XG59XG5cbmlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID0ge307XG59XG5cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeS5jb2RlbGVucyA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgLy8gb3B0cyBpcyBhbiBvYmplY3QgdGhhdCB3aWxsIGNvbnRhaW4gYSBrZXkgcmVmZXJlbmNpbmcgdGhlIG9yaWduYWwgZG9tIGVsZW1lbnRcbiAgICAvLyBvZnRlbiBpdCB3aWxsIGFsc28gaGF2ZSBhIGtleSBmb3IgIHVzZVJ1bmVzdG9uZVNlcnZpY2VzXG4gICAgbGV0IGVsID0gb3B0cy5vcmlnO1xuICAgIGxldCB2ZWwgPSBlbC5xdWVyeVNlbGVjdG9yKFwiLnB5dHV0b3JWaXN1YWxpemVyXCIpO1xuICAgIGxldCBkaXZpZCA9IHZlbC5pZDtcbiAgICBsZXQgbGFuZyA9IEpTT04ucGFyc2UodmVsLmRhdGFzZXQucGFyYW1zKS5sYW5nO1xuICAgIC8vIGFkZFZpc3VhbGl6ZXJUb1BhZ2UgY29tZXMgZnJvbSBweXR1dG9yLWVtYmVkXG4gICAgLy8gYWxsVHJhY2VEYXRhIGlzIGNyZWF0ZWQgYnkgYSBzZXJpZXMgb2Ygc2NyaXB0IHRhZ3MgdGhhdCB3aGVuIGxvYWRlZCBjcmVhdGUgdGhpc1xuICAgIC8vIGFzIGEgZ2xvYmFsIG9iamVjdCBjb250YWluaW5nIHRyYWNlIGluZm9ybWF0aW9uLlxuICAgIHRyeSB7XG4gICAgICAgIGxldCB2aXMgPSBhZGRWaXN1YWxpemVyVG9QYWdlKGFsbFRyYWNlRGF0YVtkaXZpZF0sIGRpdmlkLCB7XG4gICAgICAgICAgICBzdGFydGluZ0luc3RydWN0aW9uOiAwLFxuICAgICAgICAgICAgZWRpdENvZGVCYXNlVVJMOiBudWxsLFxuICAgICAgICAgICAgaGlkZUNvZGU6IGZhbHNlLFxuICAgICAgICAgICAgbGFuZzogbGFuZyxcbiAgICAgICAgfSk7XG4gICAgICAgIGF0dGFjaExvZ2dlcnModmlzLCBkaXZpZCk7XG4gICAgICAgIHN0eWxlQnV0dG9ucyhkaXZpZCk7XG4gICAgICAgIHdpbmRvdy5hbGxWaXN1YWxpemVycy5wdXNoKHZpcyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciByZW5kZXJpbmcgQ29kZUxlbnMgUHJvYmxlbSAke2RpdmlkfWApO1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY29kZWxlbnM6YW5zd2VyXCIsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgbGV0IHJiID0gbmV3IFJ1bmVzdG9uZUJhc2UoKTtcbiAgICAgICAgcmIubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgIGV2ZW50OiBcImNvZGVsZW5zXCIsXG4gICAgICAgICAgICBkaXZfaWQ6IGV2dC5kZXRhaWwuZGl2aWQsXG4gICAgICAgICAgICBhY3Q6IGBhbnN3ZXI6JHtldnQuZGV0YWlsLmFuc3dlcn1gLFxuICAgICAgICAgICAgY29ycmVjdDogZXZ0LmRldGFpbC5jb3JyZWN0LFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2coZXZ0KTtcbiAgICB9KTtcbn07XG5cbi8vIEFmdGVyIGFsbCBvZiB0aGUgbGlicmFyaWVzIGFyZSBsb2FkZWQuLi5cbiQoZG9jdW1lbnQpLm9uKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodHlwZW9mIGFsbFRyYWNlRGF0YSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBmb3IgKGxldCBkaXZpZCBpbiBhbGxUcmFjZURhdGEpIHtcbiAgICAgICAgICAgIGxldCBjbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRpdmlkKTtcbiAgICAgICAgICAgIGxldCBsYW5nID0gJChjbCkuZGF0YShcInBhcmFtc1wiKS5sYW5nO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAoZGl2aWQgaW4gd2luZG93LmFsbFRyYWNlRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmlzID0gYWRkVmlzdWFsaXplclRvUGFnZShhbGxUcmFjZURhdGFbZGl2aWRdLCBkaXZpZCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdJbnN0cnVjdGlvbjogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRDb2RlQmFzZVVSTDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpZGVDb2RlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmc6IGxhbmcsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFxuICAgICAgICAgICAgICAgICAgICAgICAgYCR7ZGl2aWR9IGlzIG1pc3NpbmcgdHJhY2UgZGF0YS4gIFRoaXMgaXMgcHJvYmFibHkgYSBidWlsZCBlcnJvci4gUGxlYXNlIHJlcG9ydCBpdCBvbiBnaXRodWIuYFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhdHRhY2hMb2dnZXJzKHZpcywgZGl2aWQpO1xuICAgICAgICAgICAgICAgIHN0eWxlQnV0dG9ucyhkaXZpZCk7XG4gICAgICAgICAgICAgICAgd2luZG93LmFsbFZpc3VhbGl6ZXJzLnB1c2godmlzKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciByZW5kZXJpbmcgQ29kZUxlbnMgUHJvYmxlbSAke2RpdmlkfWApO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJjb2RlbGVuczphbnN3ZXJcIiwgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgbGV0IHJiID0gbmV3IFJ1bmVzdG9uZUJhc2UoKTtcbiAgICAgICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICAgICAgZXZlbnQ6IFwiY29kZWxlbnNcIixcbiAgICAgICAgICAgICAgICBkaXZfaWQ6IGV2dC5kZXRhaWwuZGl2aWQsXG4gICAgICAgICAgICAgICAgYWN0OiBgYW5zd2VyOiR7ZXZ0LmRldGFpbC5hbnN3ZXJ9YCxcbiAgICAgICAgICAgICAgICBjb3JyZWN0OiBldnQuZGV0YWlsLmNvcnJlY3QsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2dCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9