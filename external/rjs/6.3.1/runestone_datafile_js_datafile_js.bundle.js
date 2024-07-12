"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_datafile_js_datafile_js"],{

/***/ 83513:
/*!*********************************************!*\
  !*** ./runestone/datafile/css/datafile.css ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 55789:
/*!*******************************************!*\
  !*** ./runestone/datafile/js/datafile.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase */ 2568);
/* harmony import */ var _css_datafile_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/datafile.css */ 83513);
/*==========================================
=======     Master datafile.js      ========
============================================
===     This file contains the JS for    ===
===   the Runestone Datafile component.  ===
============================================
===              Created by              ===
===           Isaiah Mayerchak           ===
===                6/8/15                ===
==========================================*/





var dfList = {}; // Dictionary that contains all instances of Datafile objects

class DataFile extends _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; // entire <pre> element that will be replaced by new HTML
        this.origElem = orig;
        this.divid = orig.id;
        this.dataEdit = false;
        this.isImage = $(orig).data("isimage");
        this.fileName = $(orig).data("filename");
        if ($(this.origElem).data("edit") === true) {
            this.dataEdit = true;
        }
        this.displayClass = "block"; // Users can specify the non-edit component to be hidden--default is not hidden
        if ($(this.origElem).is("[data-hidden]")) {
            this.displayClass = "none";
        }
        // Users can specify numbers of rows/columns when editing is true
        this.numberOfRows = $(this.origElem).data("rows");
        this.numberOfCols = $(this.origElem).data("cols");
        if (!this.isImage) {
            if (this.dataEdit) {
                this.createTextArea();
            } else {
                this.createPre();
            }
            if (this.fileName) {
                this.containerDiv.dataset.filename = this.fileName
            }
        }
        this.indicate_component_ready();
    }
    /*=====================================
    == Create either <pre> or <textarea> ==
    ==  depending on if editing is true  ==
    ==================================*/
    createPre() {
        this.containerDiv = document.createElement("pre");
        this.containerDiv.id = this.divid;
        $(this.containerDiv).attr({ style: "display: " + this.displayClass });
        this.containerDiv.innerHTML = this.origElem.innerHTML;
        $(this.origElem).replaceWith(this.containerDiv);
    }
    createTextArea() {
        this.containerDiv = document.createElement("textarea");
        this.containerDiv.id = this.divid;
        this.containerDiv.rows = this.numberOfRows;
        this.containerDiv.cols = this.numberOfCols;
        this.containerDiv.innerHTML = this.origElem.innerHTML;
        $(this.containerDiv).addClass("datafiletextfield");
        $(this.origElem).replaceWith(this.containerDiv);
    }
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/
$(function () {
    $("[data-component=datafile]").each(function (index) {
        try {
            dfList[this.id] = new DataFile({ orig: this });
        } catch (err) {
            console.log(`Error rendering DataFile ${this.id}`);
        }
    });
});

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.datafile = function (opts) {
    return new DataFile(opts);
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2RhdGFmaWxlX2pzX2RhdGFmaWxlX2pzLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDYTs7QUFFNkM7QUFDN0I7O0FBRTdCLGlCQUFpQjs7QUFFakIsdUJBQXVCLGdFQUFhO0FBQ3BDO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLHdDQUF3QztBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QyxZQUFZO0FBQ3pELFVBQVU7QUFDVixvREFBb0QsUUFBUTtBQUM1RDtBQUNBLEtBQUs7QUFDTCxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2RhdGFmaWxlL2Nzcy9kYXRhZmlsZS5jc3M/NDBlYSIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2RhdGFmaWxlL2pzL2RhdGFmaWxlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09ICAgICBNYXN0ZXIgZGF0YWZpbGUuanMgICAgICA9PT09PT09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PSAgICAgVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBKUyBmb3IgICAgPT09XG49PT0gICB0aGUgUnVuZXN0b25lIERhdGFmaWxlIGNvbXBvbmVudC4gID09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PSAgICAgICAgICAgICAgQ3JlYXRlZCBieSAgICAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgIElzYWlhaCBNYXllcmNoYWsgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgICAgIDYvOC8xNSAgICAgICAgICAgICAgICA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlXCI7XG5pbXBvcnQgXCIuLi9jc3MvZGF0YWZpbGUuY3NzXCI7XG5cbnZhciBkZkxpc3QgPSB7fTsgLy8gRGljdGlvbmFyeSB0aGF0IGNvbnRhaW5zIGFsbCBpbnN0YW5jZXMgb2YgRGF0YWZpbGUgb2JqZWN0c1xuXG5jbGFzcyBEYXRhRmlsZSBleHRlbmRzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHZhciBvcmlnID0gb3B0cy5vcmlnOyAvLyBlbnRpcmUgPHByZT4gZWxlbWVudCB0aGF0IHdpbGwgYmUgcmVwbGFjZWQgYnkgbmV3IEhUTUxcbiAgICAgICAgdGhpcy5vcmlnRWxlbSA9IG9yaWc7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcmlnLmlkO1xuICAgICAgICB0aGlzLmRhdGFFZGl0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNJbWFnZSA9ICQob3JpZykuZGF0YShcImlzaW1hZ2VcIik7XG4gICAgICAgIHRoaXMuZmlsZU5hbWUgPSAkKG9yaWcpLmRhdGEoXCJmaWxlbmFtZVwiKTtcbiAgICAgICAgaWYgKCQodGhpcy5vcmlnRWxlbSkuZGF0YShcImVkaXRcIikgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YUVkaXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGlzcGxheUNsYXNzID0gXCJibG9ja1wiOyAvLyBVc2VycyBjYW4gc3BlY2lmeSB0aGUgbm9uLWVkaXQgY29tcG9uZW50IHRvIGJlIGhpZGRlbi0tZGVmYXVsdCBpcyBub3QgaGlkZGVuXG4gICAgICAgIGlmICgkKHRoaXMub3JpZ0VsZW0pLmlzKFwiW2RhdGEtaGlkZGVuXVwiKSkge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5Q2xhc3MgPSBcIm5vbmVcIjtcbiAgICAgICAgfVxuICAgICAgICAvLyBVc2VycyBjYW4gc3BlY2lmeSBudW1iZXJzIG9mIHJvd3MvY29sdW1ucyB3aGVuIGVkaXRpbmcgaXMgdHJ1ZVxuICAgICAgICB0aGlzLm51bWJlck9mUm93cyA9ICQodGhpcy5vcmlnRWxlbSkuZGF0YShcInJvd3NcIik7XG4gICAgICAgIHRoaXMubnVtYmVyT2ZDb2xzID0gJCh0aGlzLm9yaWdFbGVtKS5kYXRhKFwiY29sc1wiKTtcbiAgICAgICAgaWYgKCF0aGlzLmlzSW1hZ2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGFFZGl0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUZXh0QXJlYSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVByZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZmlsZU5hbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5kYXRhc2V0LmZpbGVuYW1lID0gdGhpcy5maWxlTmFtZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5kaWNhdGVfY29tcG9uZW50X3JlYWR5KCk7XG4gICAgfVxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09IENyZWF0ZSBlaXRoZXIgPHByZT4gb3IgPHRleHRhcmVhPiA9PVxuICAgID09ICBkZXBlbmRpbmcgb24gaWYgZWRpdGluZyBpcyB0cnVlICA9PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIGNyZWF0ZVByZSgpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicHJlXCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5pZCA9IHRoaXMuZGl2aWQ7XG4gICAgICAgICQodGhpcy5jb250YWluZXJEaXYpLmF0dHIoeyBzdHlsZTogXCJkaXNwbGF5OiBcIiArIHRoaXMuZGlzcGxheUNsYXNzIH0pO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5pbm5lckhUTUwgPSB0aGlzLm9yaWdFbGVtLmlubmVySFRNTDtcbiAgICAgICAgJCh0aGlzLm9yaWdFbGVtKS5yZXBsYWNlV2l0aCh0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgfVxuICAgIGNyZWF0ZVRleHRBcmVhKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5yb3dzID0gdGhpcy5udW1iZXJPZlJvd3M7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmNvbHMgPSB0aGlzLm51bWJlck9mQ29scztcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuaW5uZXJIVE1MID0gdGhpcy5vcmlnRWxlbS5pbm5lckhUTUw7XG4gICAgICAgICQodGhpcy5jb250YWluZXJEaXYpLmFkZENsYXNzKFwiZGF0YWZpbGV0ZXh0ZmllbGRcIik7XG4gICAgICAgICQodGhpcy5vcmlnRWxlbSkucmVwbGFjZVdpdGgodGhpcy5jb250YWluZXJEaXYpO1xuICAgIH1cbn1cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09IEZpbmQgdGhlIGN1c3RvbSBIVE1MIHRhZ3MgYW5kID09XG49PSAgIGV4ZWN1dGUgb3VyIGNvZGUgb24gdGhlbSAgICA9PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiQoZnVuY3Rpb24gKCkge1xuICAgICQoXCJbZGF0YS1jb21wb25lbnQ9ZGF0YWZpbGVdXCIpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBkZkxpc3RbdGhpcy5pZF0gPSBuZXcgRGF0YUZpbGUoeyBvcmlnOiB0aGlzIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciByZW5kZXJpbmcgRGF0YUZpbGUgJHt0aGlzLmlkfWApO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcblxuaWYgKHR5cGVvZiB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPSB7fTtcbn1cblxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5LmRhdGFmaWxlID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICByZXR1cm4gbmV3IERhdGFGaWxlKG9wdHMpO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==