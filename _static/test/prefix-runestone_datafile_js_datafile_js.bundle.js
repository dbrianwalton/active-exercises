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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZV9kYXRhZmlsZV9qc19kYXRhZmlsZV9qcy5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2E7O0FBRTZDO0FBQzdCOztBQUU3QixpQkFBaUI7O0FBRWpCLHVCQUF1QixnRUFBYTtBQUNwQztBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyx3Q0FBd0M7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsWUFBWTtBQUN6RCxVQUFVO0FBQ1Ysb0RBQW9ELFFBQVE7QUFDNUQ7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9kYXRhZmlsZS9jc3MvZGF0YWZpbGUuY3NzPzQwZWEiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9kYXRhZmlsZS9qcy9kYXRhZmlsZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PSAgICAgTWFzdGVyIGRhdGFmaWxlLmpzICAgICAgPT09PT09PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgIFRoaXMgZmlsZSBjb250YWlucyB0aGUgSlMgZm9yICAgID09PVxuPT09ICAgdGhlIFJ1bmVzdG9uZSBEYXRhZmlsZSBjb21wb25lbnQuICA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgICAgICAgICAgIENyZWF0ZWQgYnkgICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICBJc2FpYWggTWF5ZXJjaGFrICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgICA2LzgvMTUgICAgICAgICAgICAgICAgPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZVwiO1xuaW1wb3J0IFwiLi4vY3NzL2RhdGFmaWxlLmNzc1wiO1xuXG52YXIgZGZMaXN0ID0ge307IC8vIERpY3Rpb25hcnkgdGhhdCBjb250YWlucyBhbGwgaW5zdGFuY2VzIG9mIERhdGFmaWxlIG9iamVjdHNcblxuY2xhc3MgRGF0YUZpbGUgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB2YXIgb3JpZyA9IG9wdHMub3JpZzsgLy8gZW50aXJlIDxwcmU+IGVsZW1lbnQgdGhhdCB3aWxsIGJlIHJlcGxhY2VkIGJ5IG5ldyBIVE1MXG4gICAgICAgIHRoaXMub3JpZ0VsZW0gPSBvcmlnO1xuICAgICAgICB0aGlzLmRpdmlkID0gb3JpZy5pZDtcbiAgICAgICAgdGhpcy5kYXRhRWRpdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzSW1hZ2UgPSAkKG9yaWcpLmRhdGEoXCJpc2ltYWdlXCIpO1xuICAgICAgICB0aGlzLmZpbGVOYW1lID0gJChvcmlnKS5kYXRhKFwiZmlsZW5hbWVcIik7XG4gICAgICAgIGlmICgkKHRoaXMub3JpZ0VsZW0pLmRhdGEoXCJlZGl0XCIpID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFFZGl0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpc3BsYXlDbGFzcyA9IFwiYmxvY2tcIjsgLy8gVXNlcnMgY2FuIHNwZWNpZnkgdGhlIG5vbi1lZGl0IGNvbXBvbmVudCB0byBiZSBoaWRkZW4tLWRlZmF1bHQgaXMgbm90IGhpZGRlblxuICAgICAgICBpZiAoJCh0aGlzLm9yaWdFbGVtKS5pcyhcIltkYXRhLWhpZGRlbl1cIikpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheUNsYXNzID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVXNlcnMgY2FuIHNwZWNpZnkgbnVtYmVycyBvZiByb3dzL2NvbHVtbnMgd2hlbiBlZGl0aW5nIGlzIHRydWVcbiAgICAgICAgdGhpcy5udW1iZXJPZlJvd3MgPSAkKHRoaXMub3JpZ0VsZW0pLmRhdGEoXCJyb3dzXCIpO1xuICAgICAgICB0aGlzLm51bWJlck9mQ29scyA9ICQodGhpcy5vcmlnRWxlbSkuZGF0YShcImNvbHNcIik7XG4gICAgICAgIGlmICghdGhpcy5pc0ltYWdlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhRWRpdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGV4dEFyZWEoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVQcmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmZpbGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXJEaXYuZGF0YXNldC5maWxlbmFtZSA9IHRoaXMuZmlsZU5hbWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluZGljYXRlX2NvbXBvbmVudF9yZWFkeSgpO1xuICAgIH1cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PSBDcmVhdGUgZWl0aGVyIDxwcmU+IG9yIDx0ZXh0YXJlYT4gPT1cbiAgICA9PSAgZGVwZW5kaW5nIG9uIGlmIGVkaXRpbmcgaXMgdHJ1ZSAgPT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICBjcmVhdGVQcmUoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInByZVwiKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICAkKHRoaXMuY29udGFpbmVyRGl2KS5hdHRyKHsgc3R5bGU6IFwiZGlzcGxheTogXCIgKyB0aGlzLmRpc3BsYXlDbGFzcyB9KTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuaW5uZXJIVE1MID0gdGhpcy5vcmlnRWxlbS5pbm5lckhUTUw7XG4gICAgICAgICQodGhpcy5vcmlnRWxlbSkucmVwbGFjZVdpdGgodGhpcy5jb250YWluZXJEaXYpO1xuICAgIH1cbiAgICBjcmVhdGVUZXh0QXJlYSgpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYucm93cyA9IHRoaXMubnVtYmVyT2ZSb3dzO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5jb2xzID0gdGhpcy5udW1iZXJPZkNvbHM7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlubmVySFRNTCA9IHRoaXMub3JpZ0VsZW0uaW5uZXJIVE1MO1xuICAgICAgICAkKHRoaXMuY29udGFpbmVyRGl2KS5hZGRDbGFzcyhcImRhdGFmaWxldGV4dGZpZWxkXCIpO1xuICAgICAgICAkKHRoaXMub3JpZ0VsZW0pLnJlcGxhY2VXaXRoKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICB9XG59XG5cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PSBGaW5kIHRoZSBjdXN0b20gSFRNTCB0YWdzIGFuZCA9PVxuPT0gICBleGVjdXRlIG91ciBjb2RlIG9uIHRoZW0gICAgPT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4kKGZ1bmN0aW9uICgpIHtcbiAgICAkKFwiW2RhdGEtY29tcG9uZW50PWRhdGFmaWxlXVwiKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZGZMaXN0W3RoaXMuaWRdID0gbmV3IERhdGFGaWxlKHsgb3JpZzogdGhpcyB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgcmVuZGVyaW5nIERhdGFGaWxlICR7dGhpcy5pZH1gKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG5cbmlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID0ge307XG59XG5cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeS5kYXRhZmlsZSA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRhRmlsZShvcHRzKTtcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=