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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2RhdGFmaWxlX2pzX2RhdGFmaWxlX2pzLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDYTs7QUFFNkM7QUFDN0I7O0FBRTdCLGlCQUFpQjs7QUFFakIsdUJBQXVCLGdFQUFhO0FBQ3BDO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyx3Q0FBd0M7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsWUFBWTtBQUN6RCxVQUFVO0FBQ1Ysb0RBQW9ELFFBQVE7QUFDNUQ7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9kYXRhZmlsZS9jc3MvZGF0YWZpbGUuY3NzPzQwZWEiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9kYXRhZmlsZS9qcy9kYXRhZmlsZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PSAgICAgTWFzdGVyIGRhdGFmaWxlLmpzICAgICAgPT09PT09PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgIFRoaXMgZmlsZSBjb250YWlucyB0aGUgSlMgZm9yICAgID09PVxuPT09ICAgdGhlIFJ1bmVzdG9uZSBEYXRhZmlsZSBjb21wb25lbnQuICA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgICAgICAgICAgIENyZWF0ZWQgYnkgICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICBJc2FpYWggTWF5ZXJjaGFrICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgICA2LzgvMTUgICAgICAgICAgICAgICAgPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZVwiO1xuaW1wb3J0IFwiLi4vY3NzL2RhdGFmaWxlLmNzc1wiO1xuXG52YXIgZGZMaXN0ID0ge307IC8vIERpY3Rpb25hcnkgdGhhdCBjb250YWlucyBhbGwgaW5zdGFuY2VzIG9mIERhdGFmaWxlIG9iamVjdHNcblxuY2xhc3MgRGF0YUZpbGUgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB2YXIgb3JpZyA9IG9wdHMub3JpZzsgLy8gZW50aXJlIDxwcmU+IGVsZW1lbnQgdGhhdCB3aWxsIGJlIHJlcGxhY2VkIGJ5IG5ldyBIVE1MXG4gICAgICAgIHRoaXMub3JpZ0VsZW0gPSBvcmlnO1xuICAgICAgICB0aGlzLmRpdmlkID0gb3JpZy5pZDtcbiAgICAgICAgdGhpcy5kYXRhRWRpdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzSW1hZ2UgPSAkKG9yaWcpLmRhdGEoXCJpc2ltYWdlXCIpO1xuICAgICAgICBpZiAoJCh0aGlzLm9yaWdFbGVtKS5kYXRhKFwiZWRpdFwiKSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5kYXRhRWRpdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaXNwbGF5Q2xhc3MgPSBcImJsb2NrXCI7IC8vIFVzZXJzIGNhbiBzcGVjaWZ5IHRoZSBub24tZWRpdCBjb21wb25lbnQgdG8gYmUgaGlkZGVuLS1kZWZhdWx0IGlzIG5vdCBoaWRkZW5cbiAgICAgICAgaWYgKCQodGhpcy5vcmlnRWxlbSkuaXMoXCJbZGF0YS1oaWRkZW5dXCIpKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlDbGFzcyA9IFwibm9uZVwiO1xuICAgICAgICB9XG4gICAgICAgIC8vIFVzZXJzIGNhbiBzcGVjaWZ5IG51bWJlcnMgb2Ygcm93cy9jb2x1bW5zIHdoZW4gZWRpdGluZyBpcyB0cnVlXG4gICAgICAgIHRoaXMubnVtYmVyT2ZSb3dzID0gJCh0aGlzLm9yaWdFbGVtKS5kYXRhKFwicm93c1wiKTtcbiAgICAgICAgdGhpcy5udW1iZXJPZkNvbHMgPSAkKHRoaXMub3JpZ0VsZW0pLmRhdGEoXCJjb2xzXCIpO1xuICAgICAgICBpZiAoIXRoaXMuaXNJbWFnZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YUVkaXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRleHRBcmVhKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbiAgICB9XG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT0gQ3JlYXRlIGVpdGhlciA8cHJlPiBvciA8dGV4dGFyZWE+ID09XG4gICAgPT0gIGRlcGVuZGluZyBvbiBpZiBlZGl0aW5nIGlzIHRydWUgID09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgY3JlYXRlUHJlKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwcmVcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgJCh0aGlzLmNvbnRhaW5lckRpdikuYXR0cih7IHN0eWxlOiBcImRpc3BsYXk6IFwiICsgdGhpcy5kaXNwbGF5Q2xhc3MgfSk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlubmVySFRNTCA9IHRoaXMub3JpZ0VsZW0uaW5uZXJIVE1MO1xuICAgICAgICAkKHRoaXMub3JpZ0VsZW0pLnJlcGxhY2VXaXRoKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICB9XG4gICAgY3JlYXRlVGV4dEFyZWEoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5pZCA9IHRoaXMuZGl2aWQ7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LnJvd3MgPSB0aGlzLm51bWJlck9mUm93cztcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuY29scyA9IHRoaXMubnVtYmVyT2ZDb2xzO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5pbm5lckhUTUwgPSB0aGlzLm9yaWdFbGVtLmlubmVySFRNTDtcbiAgICAgICAgJCh0aGlzLmNvbnRhaW5lckRpdikuYWRkQ2xhc3MoXCJkYXRhZmlsZXRleHRmaWVsZFwiKTtcbiAgICAgICAgJCh0aGlzLm9yaWdFbGVtKS5yZXBsYWNlV2l0aCh0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgfVxufVxuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT0gRmluZCB0aGUgY3VzdG9tIEhUTUwgdGFncyBhbmQgPT1cbj09ICAgZXhlY3V0ZSBvdXIgY29kZSBvbiB0aGVtICAgID09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuJChmdW5jdGlvbiAoKSB7XG4gICAgJChcIltkYXRhLWNvbXBvbmVudD1kYXRhZmlsZV1cIikuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRmTGlzdFt0aGlzLmlkXSA9IG5ldyBEYXRhRmlsZSh7IG9yaWc6IHRoaXMgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHJlbmRlcmluZyBEYXRhRmlsZSAke3RoaXMuaWR9YCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxuXG53aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkuZGF0YWZpbGUgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIHJldHVybiBuZXcgRGF0YUZpbGUob3B0cyk7XG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9