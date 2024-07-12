"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_reveal_js_reveal_js"],{

/***/ 42573:
/*!*****************************************!*\
  !*** ./runestone/reveal/css/reveal.css ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 12632:
/*!***************************************!*\
  !*** ./runestone/reveal/js/reveal.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase */ 2568);
/* harmony import */ var _css_reveal_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/reveal.css */ 42573);
/*==========================================
=======      Master reveal.js       ========
============================================
===     This file contains the JS for    ===
===     the Runestone reval component.   ===
============================================
===              Created by              ===
===           Isaiah Mayerchak           ===
===               06/12/15               ===
==========================================*/


var RevealList = {}; // Dictionary that contains all instances of Reveal objects




// Define Reveal object
class Reveal extends _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; // entire <div> element that will be replaced by new HTML
        this.origElem = orig;
        this.divid = orig.id;
        this.dataModal = false; // is a model dialog vs. inline
        if ($(this.origElem).is("[data-modal]")) {
            this.dataModal = true;
        }
        if ($(this.origElem).is("[data-instructoronly]")) {
            this.instructorOnly = true;
        } else {
            this.instructorOnly = false;
        }
        this.modalTitle = null;
        this.showtitle = null; // Title of button that shows the concealed data
        this.hidetitle = null;
        this.origContent = $(this.origElem).html();
        this.children = [];
        this.adoptChildren();
        this.checkForTitle();
        this.getButtonTitles();
        // Delay creating instructoronly buttons until login
        if (!this.instructorOnly) {
            this.createShowButton();
            if (!this.dataModal) {
                this.createHideButton(); // Hide button is already implemented in modal dialog
            }
        }
        this.indicate_component_ready();
    }
    /*====================================
    == Get text for buttons/modal title ==
    ====================================*/
    adoptChildren() {
        for (var i = 0; i < this.origElem.childNodes.length; i++) {
            this.children.push(this.origElem.childNodes[i]);
        }
    }
    getButtonTitles() {
        this.showtitle = $(this.origElem).data("showtitle");
        if (this.showtitle === undefined) {
            this.showtitle = "Show"; // default
        }
        if (this.instructorOnly) {
            this.showtitle += " IG";
        }
        this.hidetitle = $(this.origElem).data("hidetitle");
        if (this.hidetitle === undefined) {
            this.hidetitle = "Hide"; // default
        }
    }
    checkForTitle() {
        this.modalTitle = $(this.origElem).data("title");
        if (this.modalTitle === undefined) {
            this.modalTitle = "Message from the author"; // default
        }
    }
    /*============================
    == Create show/hide buttons ==
    ============================*/
    createShowButton() {
        var _this = this;
        this.containerDiv = document.createElement("div"); // wrapper div
        this.containerDiv.id = this.divid;
        if (!this.dataModal) {
            this.revealDiv = document.createElement("div"); // Div that is hidden that contains content
            // Get original content, put it inside revealDiv and replace original div with revealDiv
            //$(this.revealDiv).html(this.origContent);
            for (var i = 0; i < this.children.length; i++) {
                this.revealDiv.appendChild(this.children[i]);
            }
            $(this.revealDiv).hide();
            this.containerDiv.appendChild(this.revealDiv);
        }
        if (this.instructorOnly) {
            $(this.revealDiv).addClass("iguide");
        }
        this.sbutt = document.createElement("button");
        $(this.sbutt).addClass("btn reveal_button");
        if (this.instructorOnly) {
            $(this.sbutt).addClass("btn-info");
        } else {
            $(this.sbutt).addClass("btn-default");
        }
        $(this.sbutt).css("margin-bottom", "10px");
        this.sbutt.textContent = this.showtitle;
        this.sbutt.id = this.divid + "_show";
        if (!this.dataModal) {
            this.sbutt.onclick = function () {
                _this.showInline();
                $(this).hide();
            };
        } else {
            this.createModal();
            $(this.sbutt).attr({
                "data-toggle": "modal",
                "data-target": "#" + this.divid + "_modal",
            });
        }
        this.containerDiv.appendChild(this.sbutt);
        $(this.origElem).replaceWith(this.containerDiv);
    }
    createHideButton() {
        var _this = this;
        this.hbutt = document.createElement("button");
        $(this.hbutt).hide();
        this.hbutt.textContent = this.hidetitle;
        this.hbutt.className = "btn btn-default reveal_button";
        $(this.hbutt).css("margin-bottom", "10px");
        this.hbutt.id = this.divid + "_hide";
        this.hbutt.onclick = function () {
            _this.hideInline();
            $(this).hide();
        };
        this.containerDiv.appendChild(this.hbutt);
    }
    createInstructorButtons() {
        this.createShowButton();
        if (!this.dataModal) {
            this.createHideButton();
        }
    }
    /*=================
    === Modal logic ===
    =================*/
    createModal() {
        this.modalContainerDiv = document.createElement("div");
        $(this.modalContainerDiv).addClass("modal fade");
        this.modalContainerDiv.id = this.divid + "_modal";
        $(this.modalContainerDiv).attr("role", "dialog");
        document.body.appendChild(this.modalContainerDiv);
        this.modalDialogDiv = document.createElement("div");
        $(this.modalDialogDiv).addClass("modal-dialog");
        this.modalContainerDiv.appendChild(this.modalDialogDiv);
        this.modalContentDiv = document.createElement("div");
        $(this.modalContentDiv).addClass("modal-content");
        this.modalDialogDiv.appendChild(this.modalContentDiv);
        this.modalHeaderDiv = document.createElement("div");
        $(this.modalHeaderDiv).addClass("modal-header");
        this.modalContentDiv.appendChild(this.modalHeaderDiv);
        this.modalButton = document.createElement("button");
        this.modalButton.type = "button";
        $(this.modalButton).addClass("close");
        $(this.modalButton).attr({
            "aria-hidden": "true",
            "data-dismiss": "modal",
        });
        this.modalButton.innerHTML = "&times";
        this.modalHeaderDiv.appendChild(this.modalButton);
        this.modalTitleE = document.createElement("h4");
        $(this.modalTitleE).addClass("modal-title");
        this.modalTitleE.innerHTML = this.modalTitle;
        this.modalHeaderDiv.appendChild(this.modalTitleE);
        this.modalBody = document.createElement("div");
        $(this.modalBody).addClass("modal-body");
        for (var i = 0; i < this.children.length; i++) {
            this.modalBody.appendChild(this.children[i]);
        }
        this.modalContentDiv.appendChild(this.modalBody);
        /*var html = "<div class='modal fade'>" +
                    "    <div class='modal-dialog compare-modal'>" +
                    "        <div class='modal-content'>" +
                    "            <div class='modal-header'>" +
                    "                <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>" +
                    "                <h4 class='modal-title'>" + this.modalTitle + "</h4>" +
                    "            </div>" +
                    "            <div class='modal-body'>" +
                    this.origContent +
                    "            </div>" +
                    "        </div>" +
                    "    </div>" +
                    "</div>";*/
        //var el = $(this.modalContainerDiv);
        //el.modal();
    }
    /*==================
    === Inline logic ===
    ==================*/
    showInline() {
        $(this.revealDiv).show();
        $(this.hbutt).show();
        $(this.revealDiv)
            .find(".CodeMirror")
            .each(function (i, el) {
                el.CodeMirror.refresh();
            });
    }
    hideInline() {
        $(this.revealDiv).hide();
        $(this.sbutt).show();
    }
}

/*=================================
== Find the custom HTML tags and ==
==     execute our code on them        ==
=================================*/

$(document).on("runestone:login-complete", function () {
    $("[data-component=reveal]").each(function (index) {
        try {
            RevealList[this.id] = new Reveal({ orig: this });
        } catch (err) {
            console.log(`Error rendering Reveal ${this.id}`);
        }
    });

    if (eBookConfig.isInstructor) {
        for (const divid of Object.keys(RevealList)) {
            if (RevealList[divid].instructorOnly) {
                RevealList[divid].createInstructorButtons();
            }
        }
    }
});


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZV9yZXZlYWxfanNfcmV2ZWFsX2pzLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDYTs7QUFFYixxQkFBcUI7O0FBRXFDO0FBQy9COztBQUUzQjtBQUNBLHFCQUFxQixnRUFBYTtBQUNsQztBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixxQ0FBcUM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlEO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkRBQTJEO0FBQzNEO0FBQ0E7QUFDQSw0REFBNEQ7QUFDNUQ7QUFDQTtBQUNBLDRCQUE0QiwwQkFBMEI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDBCQUEwQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdIQUF3SDtBQUN4SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLFlBQVk7QUFDM0QsVUFBVTtBQUNWLGtEQUFrRCxRQUFRO0FBQzFEO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3JldmVhbC9jc3MvcmV2ZWFsLmNzcz81MmQ1Iiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcmV2ZWFsL2pzL3JldmVhbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PSAgICAgIE1hc3RlciByZXZlYWwuanMgICAgICAgPT09PT09PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgIFRoaXMgZmlsZSBjb250YWlucyB0aGUgSlMgZm9yICAgID09PVxuPT09ICAgICB0aGUgUnVuZXN0b25lIHJldmFsIGNvbXBvbmVudC4gICA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgICAgICAgICAgIENyZWF0ZWQgYnkgICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICBJc2FpYWggTWF5ZXJjaGFrICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgIDA2LzEyLzE1ICAgICAgICAgICAgICAgPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBSZXZlYWxMaXN0ID0ge307IC8vIERpY3Rpb25hcnkgdGhhdCBjb250YWlucyBhbGwgaW5zdGFuY2VzIG9mIFJldmVhbCBvYmplY3RzXG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZVwiO1xuaW1wb3J0IFwiLi4vY3NzL3JldmVhbC5jc3NcIjtcblxuLy8gRGVmaW5lIFJldmVhbCBvYmplY3RcbmNsYXNzIFJldmVhbCBleHRlbmRzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHZhciBvcmlnID0gb3B0cy5vcmlnOyAvLyBlbnRpcmUgPGRpdj4gZWxlbWVudCB0aGF0IHdpbGwgYmUgcmVwbGFjZWQgYnkgbmV3IEhUTUxcbiAgICAgICAgdGhpcy5vcmlnRWxlbSA9IG9yaWc7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcmlnLmlkO1xuICAgICAgICB0aGlzLmRhdGFNb2RhbCA9IGZhbHNlOyAvLyBpcyBhIG1vZGVsIGRpYWxvZyB2cy4gaW5saW5lXG4gICAgICAgIGlmICgkKHRoaXMub3JpZ0VsZW0pLmlzKFwiW2RhdGEtbW9kYWxdXCIpKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFNb2RhbCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCQodGhpcy5vcmlnRWxlbSkuaXMoXCJbZGF0YS1pbnN0cnVjdG9yb25seV1cIikpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zdHJ1Y3Rvck9ubHkgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbnN0cnVjdG9yT25seSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubW9kYWxUaXRsZSA9IG51bGw7XG4gICAgICAgIHRoaXMuc2hvd3RpdGxlID0gbnVsbDsgLy8gVGl0bGUgb2YgYnV0dG9uIHRoYXQgc2hvd3MgdGhlIGNvbmNlYWxlZCBkYXRhXG4gICAgICAgIHRoaXMuaGlkZXRpdGxlID0gbnVsbDtcbiAgICAgICAgdGhpcy5vcmlnQ29udGVudCA9ICQodGhpcy5vcmlnRWxlbSkuaHRtbCgpO1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgICAgIHRoaXMuYWRvcHRDaGlsZHJlbigpO1xuICAgICAgICB0aGlzLmNoZWNrRm9yVGl0bGUoKTtcbiAgICAgICAgdGhpcy5nZXRCdXR0b25UaXRsZXMoKTtcbiAgICAgICAgLy8gRGVsYXkgY3JlYXRpbmcgaW5zdHJ1Y3Rvcm9ubHkgYnV0dG9ucyB1bnRpbCBsb2dpblxuICAgICAgICBpZiAoIXRoaXMuaW5zdHJ1Y3Rvck9ubHkpIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2hvd0J1dHRvbigpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmRhdGFNb2RhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlSGlkZUJ1dHRvbigpOyAvLyBIaWRlIGJ1dHRvbiBpcyBhbHJlYWR5IGltcGxlbWVudGVkIGluIG1vZGFsIGRpYWxvZ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5kaWNhdGVfY29tcG9uZW50X3JlYWR5KCk7XG4gICAgfVxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT0gR2V0IHRleHQgZm9yIGJ1dHRvbnMvbW9kYWwgdGl0bGUgPT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIGFkb3B0Q2hpbGRyZW4oKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5vcmlnRWxlbS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2godGhpcy5vcmlnRWxlbS5jaGlsZE5vZGVzW2ldKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXRCdXR0b25UaXRsZXMoKSB7XG4gICAgICAgIHRoaXMuc2hvd3RpdGxlID0gJCh0aGlzLm9yaWdFbGVtKS5kYXRhKFwic2hvd3RpdGxlXCIpO1xuICAgICAgICBpZiAodGhpcy5zaG93dGl0bGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5zaG93dGl0bGUgPSBcIlNob3dcIjsgLy8gZGVmYXVsdFxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmluc3RydWN0b3JPbmx5KSB7XG4gICAgICAgICAgICB0aGlzLnNob3d0aXRsZSArPSBcIiBJR1wiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaGlkZXRpdGxlID0gJCh0aGlzLm9yaWdFbGVtKS5kYXRhKFwiaGlkZXRpdGxlXCIpO1xuICAgICAgICBpZiAodGhpcy5oaWRldGl0bGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5oaWRldGl0bGUgPSBcIkhpZGVcIjsgLy8gZGVmYXVsdFxuICAgICAgICB9XG4gICAgfVxuICAgIGNoZWNrRm9yVGl0bGUoKSB7XG4gICAgICAgIHRoaXMubW9kYWxUaXRsZSA9ICQodGhpcy5vcmlnRWxlbSkuZGF0YShcInRpdGxlXCIpO1xuICAgICAgICBpZiAodGhpcy5tb2RhbFRpdGxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMubW9kYWxUaXRsZSA9IFwiTWVzc2FnZSBmcm9tIHRoZSBhdXRob3JcIjsgLy8gZGVmYXVsdFxuICAgICAgICB9XG4gICAgfVxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09IENyZWF0ZSBzaG93L2hpZGUgYnV0dG9ucyA9PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIGNyZWF0ZVNob3dCdXR0b24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTsgLy8gd3JhcHBlciBkaXZcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICBpZiAoIXRoaXMuZGF0YU1vZGFsKSB7XG4gICAgICAgICAgICB0aGlzLnJldmVhbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7IC8vIERpdiB0aGF0IGlzIGhpZGRlbiB0aGF0IGNvbnRhaW5zIGNvbnRlbnRcbiAgICAgICAgICAgIC8vIEdldCBvcmlnaW5hbCBjb250ZW50LCBwdXQgaXQgaW5zaWRlIHJldmVhbERpdiBhbmQgcmVwbGFjZSBvcmlnaW5hbCBkaXYgd2l0aCByZXZlYWxEaXZcbiAgICAgICAgICAgIC8vJCh0aGlzLnJldmVhbERpdikuaHRtbCh0aGlzLm9yaWdDb250ZW50KTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMucmV2ZWFsRGl2LmFwcGVuZENoaWxkKHRoaXMuY2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCh0aGlzLnJldmVhbERpdikuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5yZXZlYWxEaXYpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmluc3RydWN0b3JPbmx5KSB7XG4gICAgICAgICAgICAkKHRoaXMucmV2ZWFsRGl2KS5hZGRDbGFzcyhcImlndWlkZVwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNidXR0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgJCh0aGlzLnNidXR0KS5hZGRDbGFzcyhcImJ0biByZXZlYWxfYnV0dG9uXCIpO1xuICAgICAgICBpZiAodGhpcy5pbnN0cnVjdG9yT25seSkge1xuICAgICAgICAgICAgJCh0aGlzLnNidXR0KS5hZGRDbGFzcyhcImJ0bi1pbmZvXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzLnNidXR0KS5hZGRDbGFzcyhcImJ0bi1kZWZhdWx0XCIpO1xuICAgICAgICB9XG4gICAgICAgICQodGhpcy5zYnV0dCkuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIjEwcHhcIik7XG4gICAgICAgIHRoaXMuc2J1dHQudGV4dENvbnRlbnQgPSB0aGlzLnNob3d0aXRsZTtcbiAgICAgICAgdGhpcy5zYnV0dC5pZCA9IHRoaXMuZGl2aWQgKyBcIl9zaG93XCI7XG4gICAgICAgIGlmICghdGhpcy5kYXRhTW9kYWwpIHtcbiAgICAgICAgICAgIHRoaXMuc2J1dHQub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5zaG93SW5saW5lKCk7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5oaWRlKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVNb2RhbCgpO1xuICAgICAgICAgICAgJCh0aGlzLnNidXR0KS5hdHRyKHtcbiAgICAgICAgICAgICAgICBcImRhdGEtdG9nZ2xlXCI6IFwibW9kYWxcIixcbiAgICAgICAgICAgICAgICBcImRhdGEtdGFyZ2V0XCI6IFwiI1wiICsgdGhpcy5kaXZpZCArIFwiX21vZGFsXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnNidXR0KTtcbiAgICAgICAgJCh0aGlzLm9yaWdFbGVtKS5yZXBsYWNlV2l0aCh0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgfVxuICAgIGNyZWF0ZUhpZGVCdXR0b24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuaGJ1dHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAkKHRoaXMuaGJ1dHQpLmhpZGUoKTtcbiAgICAgICAgdGhpcy5oYnV0dC50ZXh0Q29udGVudCA9IHRoaXMuaGlkZXRpdGxlO1xuICAgICAgICB0aGlzLmhidXR0LmNsYXNzTmFtZSA9IFwiYnRuIGJ0bi1kZWZhdWx0IHJldmVhbF9idXR0b25cIjtcbiAgICAgICAgJCh0aGlzLmhidXR0KS5jc3MoXCJtYXJnaW4tYm90dG9tXCIsIFwiMTBweFwiKTtcbiAgICAgICAgdGhpcy5oYnV0dC5pZCA9IHRoaXMuZGl2aWQgKyBcIl9oaWRlXCI7XG4gICAgICAgIHRoaXMuaGJ1dHQub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLmhpZGVJbmxpbmUoKTtcbiAgICAgICAgICAgICQodGhpcykuaGlkZSgpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmhidXR0KTtcbiAgICB9XG4gICAgY3JlYXRlSW5zdHJ1Y3RvckJ1dHRvbnMoKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlU2hvd0J1dHRvbigpO1xuICAgICAgICBpZiAoIXRoaXMuZGF0YU1vZGFsKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUhpZGVCdXR0b24oKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKj09PT09PT09PT09PT09PT09XG4gICAgPT09IE1vZGFsIGxvZ2ljID09PVxuICAgID09PT09PT09PT09PT09PT09Ki9cbiAgICBjcmVhdGVNb2RhbCgpIHtcbiAgICAgICAgdGhpcy5tb2RhbENvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICQodGhpcy5tb2RhbENvbnRhaW5lckRpdikuYWRkQ2xhc3MoXCJtb2RhbCBmYWRlXCIpO1xuICAgICAgICB0aGlzLm1vZGFsQ29udGFpbmVyRGl2LmlkID0gdGhpcy5kaXZpZCArIFwiX21vZGFsXCI7XG4gICAgICAgICQodGhpcy5tb2RhbENvbnRhaW5lckRpdikuYXR0cihcInJvbGVcIiwgXCJkaWFsb2dcIik7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5tb2RhbENvbnRhaW5lckRpdik7XG4gICAgICAgIHRoaXMubW9kYWxEaWFsb2dEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAkKHRoaXMubW9kYWxEaWFsb2dEaXYpLmFkZENsYXNzKFwibW9kYWwtZGlhbG9nXCIpO1xuICAgICAgICB0aGlzLm1vZGFsQ29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMubW9kYWxEaWFsb2dEaXYpO1xuICAgICAgICB0aGlzLm1vZGFsQ29udGVudERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICQodGhpcy5tb2RhbENvbnRlbnREaXYpLmFkZENsYXNzKFwibW9kYWwtY29udGVudFwiKTtcbiAgICAgICAgdGhpcy5tb2RhbERpYWxvZ0Rpdi5hcHBlbmRDaGlsZCh0aGlzLm1vZGFsQ29udGVudERpdik7XG4gICAgICAgIHRoaXMubW9kYWxIZWFkZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAkKHRoaXMubW9kYWxIZWFkZXJEaXYpLmFkZENsYXNzKFwibW9kYWwtaGVhZGVyXCIpO1xuICAgICAgICB0aGlzLm1vZGFsQ29udGVudERpdi5hcHBlbmRDaGlsZCh0aGlzLm1vZGFsSGVhZGVyRGl2KTtcbiAgICAgICAgdGhpcy5tb2RhbEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMubW9kYWxCdXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgICQodGhpcy5tb2RhbEJ1dHRvbikuYWRkQ2xhc3MoXCJjbG9zZVwiKTtcbiAgICAgICAgJCh0aGlzLm1vZGFsQnV0dG9uKS5hdHRyKHtcbiAgICAgICAgICAgIFwiYXJpYS1oaWRkZW5cIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICBcImRhdGEtZGlzbWlzc1wiOiBcIm1vZGFsXCIsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm1vZGFsQnV0dG9uLmlubmVySFRNTCA9IFwiJnRpbWVzXCI7XG4gICAgICAgIHRoaXMubW9kYWxIZWFkZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5tb2RhbEJ1dHRvbik7XG4gICAgICAgIHRoaXMubW9kYWxUaXRsZUUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDRcIik7XG4gICAgICAgICQodGhpcy5tb2RhbFRpdGxlRSkuYWRkQ2xhc3MoXCJtb2RhbC10aXRsZVwiKTtcbiAgICAgICAgdGhpcy5tb2RhbFRpdGxlRS5pbm5lckhUTUwgPSB0aGlzLm1vZGFsVGl0bGU7XG4gICAgICAgIHRoaXMubW9kYWxIZWFkZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5tb2RhbFRpdGxlRSk7XG4gICAgICAgIHRoaXMubW9kYWxCb2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgJCh0aGlzLm1vZGFsQm9keSkuYWRkQ2xhc3MoXCJtb2RhbC1ib2R5XCIpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMubW9kYWxCb2R5LmFwcGVuZENoaWxkKHRoaXMuY2hpbGRyZW5baV0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubW9kYWxDb250ZW50RGl2LmFwcGVuZENoaWxkKHRoaXMubW9kYWxCb2R5KTtcbiAgICAgICAgLyp2YXIgaHRtbCA9IFwiPGRpdiBjbGFzcz0nbW9kYWwgZmFkZSc+XCIgK1xuICAgICAgICAgICAgICAgICAgICBcIiAgICA8ZGl2IGNsYXNzPSdtb2RhbC1kaWFsb2cgY29tcGFyZS1tb2RhbCc+XCIgK1xuICAgICAgICAgICAgICAgICAgICBcIiAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtY29udGVudCc+XCIgK1xuICAgICAgICAgICAgICAgICAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9J21vZGFsLWhlYWRlcic+XCIgK1xuICAgICAgICAgICAgICAgICAgICBcIiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3M9J2Nsb3NlJyBkYXRhLWRpc21pc3M9J21vZGFsJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+JnRpbWVzOzwvYnV0dG9uPlwiICtcbiAgICAgICAgICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgPGg0IGNsYXNzPSdtb2RhbC10aXRsZSc+XCIgKyB0aGlzLm1vZGFsVGl0bGUgKyBcIjwvaDQ+XCIgK1xuICAgICAgICAgICAgICAgICAgICBcIiAgICAgICAgICAgIDwvZGl2PlwiICtcbiAgICAgICAgICAgICAgICAgICAgXCIgICAgICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1ib2R5Jz5cIiArXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3JpZ0NvbnRlbnQgK1xuICAgICAgICAgICAgICAgICAgICBcIiAgICAgICAgICAgIDwvZGl2PlwiICtcbiAgICAgICAgICAgICAgICAgICAgXCIgICAgICAgIDwvZGl2PlwiICtcbiAgICAgICAgICAgICAgICAgICAgXCIgICAgPC9kaXY+XCIgK1xuICAgICAgICAgICAgICAgICAgICBcIjwvZGl2PlwiOyovXG4gICAgICAgIC8vdmFyIGVsID0gJCh0aGlzLm1vZGFsQ29udGFpbmVyRGl2KTtcbiAgICAgICAgLy9lbC5tb2RhbCgpO1xuICAgIH1cbiAgICAvKj09PT09PT09PT09PT09PT09PVxuICAgID09PSBJbmxpbmUgbG9naWMgPT09XG4gICAgPT09PT09PT09PT09PT09PT09Ki9cbiAgICBzaG93SW5saW5lKCkge1xuICAgICAgICAkKHRoaXMucmV2ZWFsRGl2KS5zaG93KCk7XG4gICAgICAgICQodGhpcy5oYnV0dCkuc2hvdygpO1xuICAgICAgICAkKHRoaXMucmV2ZWFsRGl2KVxuICAgICAgICAgICAgLmZpbmQoXCIuQ29kZU1pcnJvclwiKVxuICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgICAgICAgICAgICAgZWwuQ29kZU1pcnJvci5yZWZyZXNoKCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG4gICAgaGlkZUlubGluZSgpIHtcbiAgICAgICAgJCh0aGlzLnJldmVhbERpdikuaGlkZSgpO1xuICAgICAgICAkKHRoaXMuc2J1dHQpLnNob3coKTtcbiAgICB9XG59XG5cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PSBGaW5kIHRoZSBjdXN0b20gSFRNTCB0YWdzIGFuZCA9PVxuPT0gICAgIGV4ZWN1dGUgb3VyIGNvZGUgb24gdGhlbSAgICAgICAgPT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbiQoZG9jdW1lbnQpLm9uKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAkKFwiW2RhdGEtY29tcG9uZW50PXJldmVhbF1cIikuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFJldmVhbExpc3RbdGhpcy5pZF0gPSBuZXcgUmV2ZWFsKHsgb3JpZzogdGhpcyB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgcmVuZGVyaW5nIFJldmVhbCAke3RoaXMuaWR9YCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChlQm9va0NvbmZpZy5pc0luc3RydWN0b3IpIHtcbiAgICAgICAgZm9yIChjb25zdCBkaXZpZCBvZiBPYmplY3Qua2V5cyhSZXZlYWxMaXN0KSkge1xuICAgICAgICAgICAgaWYgKFJldmVhbExpc3RbZGl2aWRdLmluc3RydWN0b3JPbmx5KSB7XG4gICAgICAgICAgICAgICAgUmV2ZWFsTGlzdFtkaXZpZF0uY3JlYXRlSW5zdHJ1Y3RvckJ1dHRvbnMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9