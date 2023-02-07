"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_webwork_js_webwork_js"],{

/***/ 66142:
/*!*****************************************!*\
  !*** ./runestone/webwork/js/webwork.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase */ 2568);


class WebWork extends _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
    }
}

let rb = new WebWork();

function logWebWork(e, data) {
    var correct = false;
    let correctCount = 0;
    let qCount = 0;
    let actString = "check:";
    for (let k of Object.keys(data.rh_result.answers)) {
        qCount += 1;
        if (data.rh_result.answers[k].score == 1) {
            correctCount += 1;
        }
        actString += `actual:${data.rh_result.answers[k].original_student_ans}:expected:${data.rh_result.answers[k].correct_value}:`;
    }
    let pct = correctCount / qCount;
    actString += `correct:${correctCount}:count:${qCount}:pct:${pct}`;
    if (pct == 1.0) {
        correct = true;
    }
    rb.logBookEvent({
        event: "webwork",
        div_id: data.inputs_ref.problemUUID,
        act: actString,
        correct: correct,
    });
}

function logShowCorrect(e, data) {
    rb.logBookEvent({
        event: "webwork",
        div_id: data.inputs_ref.problemUUID,
        act: "show",
    });
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.webwork = function (opts) {
    return new WebWork();
};

$(function () {
    $("body").on("runestone_ww_check", logWebWork);
    $("body").on("runestone_show_correct", logShowCorrect);
});


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3dlYndvcmtfanNfd2Vid29ya19qcy5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBMEQ7O0FBRTFELHNCQUFzQixnRUFBYTtBQUNuQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQiwrQ0FBK0MsWUFBWSx3Q0FBd0M7QUFDbEk7QUFDQTtBQUNBLDRCQUE0QixhQUFhLFNBQVMsT0FBTyxPQUFPLElBQUk7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvd2Vid29yay9qcy93ZWJ3b3JrLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZVwiO1xuXG5jbGFzcyBXZWJXb3JrIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICB9XG59XG5cbmxldCByYiA9IG5ldyBXZWJXb3JrKCk7XG5cbmZ1bmN0aW9uIGxvZ1dlYldvcmsoZSwgZGF0YSkge1xuICAgIHZhciBjb3JyZWN0ID0gZmFsc2U7XG4gICAgbGV0IGNvcnJlY3RDb3VudCA9IDA7XG4gICAgbGV0IHFDb3VudCA9IDA7XG4gICAgbGV0IGFjdFN0cmluZyA9IFwiY2hlY2s6XCI7XG4gICAgZm9yIChsZXQgayBvZiBPYmplY3Qua2V5cyhkYXRhLnJoX3Jlc3VsdC5hbnN3ZXJzKSkge1xuICAgICAgICBxQ291bnQgKz0gMTtcbiAgICAgICAgaWYgKGRhdGEucmhfcmVzdWx0LmFuc3dlcnNba10uc2NvcmUgPT0gMSkge1xuICAgICAgICAgICAgY29ycmVjdENvdW50ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgYWN0U3RyaW5nICs9IGBhY3R1YWw6JHtkYXRhLnJoX3Jlc3VsdC5hbnN3ZXJzW2tdLm9yaWdpbmFsX3N0dWRlbnRfYW5zfTpleHBlY3RlZDoke2RhdGEucmhfcmVzdWx0LmFuc3dlcnNba10uY29ycmVjdF92YWx1ZX06YDtcbiAgICB9XG4gICAgbGV0IHBjdCA9IGNvcnJlY3RDb3VudCAvIHFDb3VudDtcbiAgICBhY3RTdHJpbmcgKz0gYGNvcnJlY3Q6JHtjb3JyZWN0Q291bnR9OmNvdW50OiR7cUNvdW50fTpwY3Q6JHtwY3R9YDtcbiAgICBpZiAocGN0ID09IDEuMCkge1xuICAgICAgICBjb3JyZWN0ID0gdHJ1ZTtcbiAgICB9XG4gICAgcmIubG9nQm9va0V2ZW50KHtcbiAgICAgICAgZXZlbnQ6IFwid2Vid29ya1wiLFxuICAgICAgICBkaXZfaWQ6IGRhdGEuaW5wdXRzX3JlZi5wcm9ibGVtVVVJRCxcbiAgICAgICAgYWN0OiBhY3RTdHJpbmcsXG4gICAgICAgIGNvcnJlY3Q6IGNvcnJlY3QsXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGxvZ1Nob3dDb3JyZWN0KGUsIGRhdGEpIHtcbiAgICByYi5sb2dCb29rRXZlbnQoe1xuICAgICAgICBldmVudDogXCJ3ZWJ3b3JrXCIsXG4gICAgICAgIGRpdl9pZDogZGF0YS5pbnB1dHNfcmVmLnByb2JsZW1VVUlELFxuICAgICAgICBhY3Q6IFwic2hvd1wiLFxuICAgIH0pO1xufVxuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxuXG53aW5kb3cuY29tcG9uZW50X2ZhY3Rvcnkud2Vid29yayA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgcmV0dXJuIG5ldyBXZWJXb3JrKCk7XG59O1xuXG4kKGZ1bmN0aW9uICgpIHtcbiAgICAkKFwiYm9keVwiKS5vbihcInJ1bmVzdG9uZV93d19jaGVja1wiLCBsb2dXZWJXb3JrKTtcbiAgICAkKFwiYm9keVwiKS5vbihcInJ1bmVzdG9uZV9zaG93X2NvcnJlY3RcIiwgbG9nU2hvd0NvcnJlY3QpO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=