"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_showeval_js_showEval_js"],{

/***/ 83320:
/*!*********************************************!*\
  !*** ./runestone/showeval/css/showEval.css ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 6224:
/*!*******************************************!*\
  !*** ./runestone/showeval/js/showEval.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ShowEval": () => (/* binding */ ShowEval)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase */ 2568);
/* harmony import */ var _css_showEval_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/showEval.css */ 83320);
/*
This component is based on ...
ShowEval, a JS module for creating visualizations of expression evaluation. Mainly for programming tutorials.
0.9.1

Al Sweigart
al@inventwithpython.com
https://github.com/asweigart/
*/





var seList = [];

class ShowEval extends _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        this.divid = opts.orig.id;
        this.containerDiv = opts.orig;
        this.containerDiv.classList.add("showEval");
        let steps = [];
        for (let s of opts.raw) {
            steps.push(s.replace(/\\/g, ""));
        }
        this.steps = steps.slice();
        this.currentStep = 0;
        this.createTrace = $(opts.orig).data("tracemode"); // TODO - reset doesn't work for traces
        this.rb = new _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"](opts);
        // create elements
        this.currentStepDiv = $("<div>").addClass("currentStepDiv");
        $(this.containerDiv).append(this.currentStepDiv);
        this.currentStepDiv.append($("<span>").addClass("pre"));
        this.currentStepDiv.append($("<span>").addClass("eval"));
        this.currentStepDiv.append($("<span>").addClass("post"));
        this.currentStepDiv.append($("<div>").addClass("anno"));
        this.setNextButton(`#${this.divid}_nextStep`);
        this.setResetButton(`#${this.divid}_reset`);

        // parse steps and turn into a 4-string array: ['pre', 'before eval', 'after eval', 'post']
        for (var i = 0; i < this.steps.length; i++) {
            var s = this.steps[i];
            let endpoint, pItem, comment;

            if (s.includes("##")) {
                // If there is an annotation
                endpoint = s.indexOf("##");
                comment = s.substring(endpoint + 2, s.length);
            } else {
                endpoint = s.length;
                comment = false;
            }
            this.steps[i] = [
                s.substring(0, s.indexOf("{{")), // 'pre'
                s.substring(s.indexOf("{{") + 2, s.indexOf("}}{{")), // 'before eval'
                s.substring(
                    s.indexOf("}}{{") + 4,
                    s.indexOf("}}", s.indexOf("}}{{") + 4)
                ), // 'after eval'
                s.substring(
                    s.indexOf("}}", s.indexOf("}}{{") + 4) + 2,
                    endpoint
                ),
            ]; // 'post'

            this.steps[i].push(comment); // 'anno'
        }
        this.reset();
        this.caption = "ShowEval";
        this.addCaption("runestone");
        this.indicate_component_ready();
    }

    setNextButton(nextButtonSelector) {
        var thisObj = this; // uhg, javascript
        $(nextButtonSelector).click(function () {
            thisObj.evaluateStep(nextButtonSelector);
        });
    }

    setResetButton(resetButtonSelector) {
        var thisObj = this; // uhg, javascript
        $(resetButtonSelector).click(function () {
            thisObj.reset(0);
        });
    }

    reset() {
        $(this.containerDiv).find(".previousStep").remove();
        this.setStep(0);
        this.rb.logBookEvent({
            event: "showeval",
            act: "reset",
            div_id: this.containerDiv.id,
        });
    }

    setStep(step) {
        this.currentStep = step;
        let newWidth = this.getWidth(this.steps[this.currentStep][1]);
        if (this.steps[step][4]) {
            this.currentStepDiv.children(".anno").html(this.steps[step][4]);
            this.currentStepDiv.children(".anno").show();
        } else {
            this.currentStepDiv.children(".anno").hide();
        }
        this.currentStepDiv.children(".eval").width(newWidth);
        this.currentStepDiv.children(".pre").html(this.steps[step][0]);
        this.currentStepDiv.children(".eval").html(this.steps[step][1]);
        this.currentStepDiv.children(".post").html(this.steps[step][3]);
    }

    getWidth(text) {
        // TODO - class style must match or else width will be off.
        var newElem = $("<div>")
            .addClass("showEval evalCont")
            .hide()
            .html(text);
        $("body").append(newElem);
        var newWidth = newElem.width() + 1; // +1 is a hack
        newElem.remove();

        return newWidth;
    }

    createPreviousStepDiv(step) {
        this.currentStepDiv.before(
            $("<div>")
                .addClass("previousStep")
                .html(
                    this.steps[step][0] +
                        this.steps[step][1] +
                        this.steps[step][3]
                )
        );
    }

    evaluateStep(buttonId, step) {
        this.currentStepDiv.children(".anno").hide();
        $(buttonId).attr("disabled", true);
        if (step === undefined) {
            step = this.currentStep;
        }
        if (this.currentStep >= this.steps.length) {
            //this.currentStep = 0;
            //step = 0;
            $(buttonId).attr("disabled", false);
            return; // do nothing if on last step
        }
        //this.setStep(step);

        var fadeInSpeed = 0;
        if (this.createTrace) {
            this.createPreviousStepDiv(step);
            this.currentStepDiv.hide();
            fadeInSpeed = 200;
        }

        let newWidth = this.getWidth(this.steps[step][2]);
        var evalElem = this.currentStepDiv.children(".eval");

        var thisShowEval = this;

        evalElem.css("color", "red");

        this.currentStepDiv.fadeTo(fadeInSpeed, 1, function () {
            window.setTimeout(function () {
                evalElem.fadeTo(400, 0, function () {
                    //evalElem.css('overflow', 'hidden');
                    evalElem.animate(
                        { width: newWidth, duration: 400 },
                        function () {
                            evalElem.html(thisShowEval.steps[step][2]);
                            evalElem.fadeTo(400, 1, function () {
                                window.setTimeout(function () {
                                    //evalElem.css('overflow', 'visible');
                                    evalElem.css("color", "#333");
                                    thisShowEval.currentStep += 1;
                                    if (
                                        thisShowEval.currentStep <
                                        thisShowEval.steps.length
                                    ) {
                                        thisShowEval.setStep(
                                            thisShowEval.currentStep
                                        );
                                    }
                                    $(buttonId).attr("disabled", false);
                                }, 600);
                            });
                        }
                    );
                });
            }, 600);
        });

        this.rb.logBookEvent({
            event: "showeval",
            act: "next",
            div_id: this.containerDiv.id,
        });
    }
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/
$(document).on("runestone:login-complete", function () {
    $("[data-component=showeval]").each(function (index) {
        // MC
        var opts = {
            orig: this,
            useRunestoneServices: eBookConfig.useRunestoneServices,
        };
        opts.raw = window.raw_steps[this.id];
        if ($(this).closest("[data-component=timedAssessment]").length == 0) {
            // If this element exists within a timed component, don't render it here
            seList[this.id] = new ShowEval(opts);
        }
    });
});

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory["showeval"] = function (opts) {
    return new ShowEval(opts);
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3Nob3dldmFsX2pzX3Nob3dFdmFsX2pzLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDYTs7QUFFNkM7QUFDN0I7O0FBRTdCOztBQUVPLHVCQUF1QixnRUFBYTtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkRBQTJEO0FBQzNELHNCQUFzQixnRUFBYTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixXQUFXO0FBQzFDLGdDQUFnQyxXQUFXOztBQUUzQztBQUNBLHdCQUF3Qix1QkFBdUI7QUFDL0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QztBQUM1Qyx5Q0FBeUMsdUJBQXVCO0FBQ2hFO0FBQ0EsbUNBQW1DO0FBQ25DLGlDQUFpQyxrQkFBa0I7QUFDbkQ7QUFDQTtBQUNBLGlDQUFpQyxrQkFBa0I7QUFDbkQ7QUFDQTtBQUNBLGVBQWU7O0FBRWYseUNBQXlDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsZ0NBQWdDO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3Nob3dldmFsL2Nzcy9zaG93RXZhbC5jc3M/MGE3MyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3Nob3dldmFsL2pzL3Nob3dFdmFsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8qXG5UaGlzIGNvbXBvbmVudCBpcyBiYXNlZCBvbiAuLi5cblNob3dFdmFsLCBhIEpTIG1vZHVsZSBmb3IgY3JlYXRpbmcgdmlzdWFsaXphdGlvbnMgb2YgZXhwcmVzc2lvbiBldmFsdWF0aW9uLiBNYWlubHkgZm9yIHByb2dyYW1taW5nIHR1dG9yaWFscy5cbjAuOS4xXG5cbkFsIFN3ZWlnYXJ0XG5hbEBpbnZlbnR3aXRocHl0aG9uLmNvbVxuaHR0cHM6Ly9naXRodWIuY29tL2Fzd2VpZ2FydC9cbiovXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlXCI7XG5pbXBvcnQgXCIuLi9jc3Mvc2hvd0V2YWwuY3NzXCI7XG5cbnZhciBzZUxpc3QgPSBbXTtcblxuZXhwb3J0IGNsYXNzIFNob3dFdmFsIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdGhpcy5kaXZpZCA9IG9wdHMub3JpZy5pZDtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYgPSBvcHRzLm9yaWc7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmNsYXNzTGlzdC5hZGQoXCJzaG93RXZhbFwiKTtcbiAgICAgICAgbGV0IHN0ZXBzID0gW107XG4gICAgICAgIGZvciAobGV0IHMgb2Ygb3B0cy5yYXcpIHtcbiAgICAgICAgICAgIHN0ZXBzLnB1c2gocy5yZXBsYWNlKC9cXFxcL2csIFwiXCIpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0ZXBzID0gc3RlcHMuc2xpY2UoKTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3RlcCA9IDA7XG4gICAgICAgIHRoaXMuY3JlYXRlVHJhY2UgPSAkKG9wdHMub3JpZykuZGF0YShcInRyYWNlbW9kZVwiKTsgLy8gVE9ETyAtIHJlc2V0IGRvZXNuJ3Qgd29yayBmb3IgdHJhY2VzXG4gICAgICAgIHRoaXMucmIgPSBuZXcgUnVuZXN0b25lQmFzZShvcHRzKTtcbiAgICAgICAgLy8gY3JlYXRlIGVsZW1lbnRzXG4gICAgICAgIHRoaXMuY3VycmVudFN0ZXBEaXYgPSAkKFwiPGRpdj5cIikuYWRkQ2xhc3MoXCJjdXJyZW50U3RlcERpdlwiKTtcbiAgICAgICAgJCh0aGlzLmNvbnRhaW5lckRpdikuYXBwZW5kKHRoaXMuY3VycmVudFN0ZXBEaXYpO1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGVwRGl2LmFwcGVuZCgkKFwiPHNwYW4+XCIpLmFkZENsYXNzKFwicHJlXCIpKTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3RlcERpdi5hcHBlbmQoJChcIjxzcGFuPlwiKS5hZGRDbGFzcyhcImV2YWxcIikpO1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGVwRGl2LmFwcGVuZCgkKFwiPHNwYW4+XCIpLmFkZENsYXNzKFwicG9zdFwiKSk7XG4gICAgICAgIHRoaXMuY3VycmVudFN0ZXBEaXYuYXBwZW5kKCQoXCI8ZGl2PlwiKS5hZGRDbGFzcyhcImFubm9cIikpO1xuICAgICAgICB0aGlzLnNldE5leHRCdXR0b24oYCMke3RoaXMuZGl2aWR9X25leHRTdGVwYCk7XG4gICAgICAgIHRoaXMuc2V0UmVzZXRCdXR0b24oYCMke3RoaXMuZGl2aWR9X3Jlc2V0YCk7XG5cbiAgICAgICAgLy8gcGFyc2Ugc3RlcHMgYW5kIHR1cm4gaW50byBhIDQtc3RyaW5nIGFycmF5OiBbJ3ByZScsICdiZWZvcmUgZXZhbCcsICdhZnRlciBldmFsJywgJ3Bvc3QnXVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3RlcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzID0gdGhpcy5zdGVwc1tpXTtcbiAgICAgICAgICAgIGxldCBlbmRwb2ludCwgcEl0ZW0sIGNvbW1lbnQ7XG5cbiAgICAgICAgICAgIGlmIChzLmluY2x1ZGVzKFwiIyNcIikpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBhbiBhbm5vdGF0aW9uXG4gICAgICAgICAgICAgICAgZW5kcG9pbnQgPSBzLmluZGV4T2YoXCIjI1wiKTtcbiAgICAgICAgICAgICAgICBjb21tZW50ID0gcy5zdWJzdHJpbmcoZW5kcG9pbnQgKyAyLCBzLmxlbmd0aCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVuZHBvaW50ID0gcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgY29tbWVudCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdGVwc1tpXSA9IFtcbiAgICAgICAgICAgICAgICBzLnN1YnN0cmluZygwLCBzLmluZGV4T2YoXCJ7e1wiKSksIC8vICdwcmUnXG4gICAgICAgICAgICAgICAgcy5zdWJzdHJpbmcocy5pbmRleE9mKFwie3tcIikgKyAyLCBzLmluZGV4T2YoXCJ9fXt7XCIpKSwgLy8gJ2JlZm9yZSBldmFsJ1xuICAgICAgICAgICAgICAgIHMuc3Vic3RyaW5nKFxuICAgICAgICAgICAgICAgICAgICBzLmluZGV4T2YoXCJ9fXt7XCIpICsgNCxcbiAgICAgICAgICAgICAgICAgICAgcy5pbmRleE9mKFwifX1cIiwgcy5pbmRleE9mKFwifX17e1wiKSArIDQpXG4gICAgICAgICAgICAgICAgKSwgLy8gJ2FmdGVyIGV2YWwnXG4gICAgICAgICAgICAgICAgcy5zdWJzdHJpbmcoXG4gICAgICAgICAgICAgICAgICAgIHMuaW5kZXhPZihcIn19XCIsIHMuaW5kZXhPZihcIn19e3tcIikgKyA0KSArIDIsXG4gICAgICAgICAgICAgICAgICAgIGVuZHBvaW50XG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIF07IC8vICdwb3N0J1xuXG4gICAgICAgICAgICB0aGlzLnN0ZXBzW2ldLnB1c2goY29tbWVudCk7IC8vICdhbm5vJ1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgdGhpcy5jYXB0aW9uID0gXCJTaG93RXZhbFwiO1xuICAgICAgICB0aGlzLmFkZENhcHRpb24oXCJydW5lc3RvbmVcIik7XG4gICAgICAgIHRoaXMuaW5kaWNhdGVfY29tcG9uZW50X3JlYWR5KCk7XG4gICAgfVxuXG4gICAgc2V0TmV4dEJ1dHRvbihuZXh0QnV0dG9uU2VsZWN0b3IpIHtcbiAgICAgICAgdmFyIHRoaXNPYmogPSB0aGlzOyAvLyB1aGcsIGphdmFzY3JpcHRcbiAgICAgICAgJChuZXh0QnV0dG9uU2VsZWN0b3IpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXNPYmouZXZhbHVhdGVTdGVwKG5leHRCdXR0b25TZWxlY3Rvcik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNldFJlc2V0QnV0dG9uKHJlc2V0QnV0dG9uU2VsZWN0b3IpIHtcbiAgICAgICAgdmFyIHRoaXNPYmogPSB0aGlzOyAvLyB1aGcsIGphdmFzY3JpcHRcbiAgICAgICAgJChyZXNldEJ1dHRvblNlbGVjdG9yKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzT2JqLnJlc2V0KDApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgJCh0aGlzLmNvbnRhaW5lckRpdikuZmluZChcIi5wcmV2aW91c1N0ZXBcIikucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuc2V0U3RlcCgwKTtcbiAgICAgICAgdGhpcy5yYi5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgZXZlbnQ6IFwic2hvd2V2YWxcIixcbiAgICAgICAgICAgIGFjdDogXCJyZXNldFwiLFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmNvbnRhaW5lckRpdi5pZCxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2V0U3RlcChzdGVwKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFN0ZXAgPSBzdGVwO1xuICAgICAgICBsZXQgbmV3V2lkdGggPSB0aGlzLmdldFdpZHRoKHRoaXMuc3RlcHNbdGhpcy5jdXJyZW50U3RlcF1bMV0pO1xuICAgICAgICBpZiAodGhpcy5zdGVwc1tzdGVwXVs0XSkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3RlcERpdi5jaGlsZHJlbihcIi5hbm5vXCIpLmh0bWwodGhpcy5zdGVwc1tzdGVwXVs0XSk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGVwRGl2LmNoaWxkcmVuKFwiLmFubm9cIikuc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3RlcERpdi5jaGlsZHJlbihcIi5hbm5vXCIpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1cnJlbnRTdGVwRGl2LmNoaWxkcmVuKFwiLmV2YWxcIikud2lkdGgobmV3V2lkdGgpO1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGVwRGl2LmNoaWxkcmVuKFwiLnByZVwiKS5odG1sKHRoaXMuc3RlcHNbc3RlcF1bMF0pO1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGVwRGl2LmNoaWxkcmVuKFwiLmV2YWxcIikuaHRtbCh0aGlzLnN0ZXBzW3N0ZXBdWzFdKTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3RlcERpdi5jaGlsZHJlbihcIi5wb3N0XCIpLmh0bWwodGhpcy5zdGVwc1tzdGVwXVszXSk7XG4gICAgfVxuXG4gICAgZ2V0V2lkdGgodGV4dCkge1xuICAgICAgICAvLyBUT0RPIC0gY2xhc3Mgc3R5bGUgbXVzdCBtYXRjaCBvciBlbHNlIHdpZHRoIHdpbGwgYmUgb2ZmLlxuICAgICAgICB2YXIgbmV3RWxlbSA9ICQoXCI8ZGl2PlwiKVxuICAgICAgICAgICAgLmFkZENsYXNzKFwic2hvd0V2YWwgZXZhbENvbnRcIilcbiAgICAgICAgICAgIC5oaWRlKClcbiAgICAgICAgICAgIC5odG1sKHRleHQpO1xuICAgICAgICAkKFwiYm9keVwiKS5hcHBlbmQobmV3RWxlbSk7XG4gICAgICAgIHZhciBuZXdXaWR0aCA9IG5ld0VsZW0ud2lkdGgoKSArIDE7IC8vICsxIGlzIGEgaGFja1xuICAgICAgICBuZXdFbGVtLnJlbW92ZSgpO1xuXG4gICAgICAgIHJldHVybiBuZXdXaWR0aDtcbiAgICB9XG5cbiAgICBjcmVhdGVQcmV2aW91c1N0ZXBEaXYoc3RlcCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGVwRGl2LmJlZm9yZShcbiAgICAgICAgICAgICQoXCI8ZGl2PlwiKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhcInByZXZpb3VzU3RlcFwiKVxuICAgICAgICAgICAgICAgIC5odG1sKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0ZXBzW3N0ZXBdWzBdICtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RlcHNbc3RlcF1bMV0gK1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGVwc1tzdGVwXVszXVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBldmFsdWF0ZVN0ZXAoYnV0dG9uSWQsIHN0ZXApIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3RlcERpdi5jaGlsZHJlbihcIi5hbm5vXCIpLmhpZGUoKTtcbiAgICAgICAgJChidXR0b25JZCkuYXR0cihcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICBpZiAoc3RlcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzdGVwID0gdGhpcy5jdXJyZW50U3RlcDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RlcCA+PSB0aGlzLnN0ZXBzLmxlbmd0aCkge1xuICAgICAgICAgICAgLy90aGlzLmN1cnJlbnRTdGVwID0gMDtcbiAgICAgICAgICAgIC8vc3RlcCA9IDA7XG4gICAgICAgICAgICAkKGJ1dHRvbklkKS5hdHRyKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuOyAvLyBkbyBub3RoaW5nIGlmIG9uIGxhc3Qgc3RlcFxuICAgICAgICB9XG4gICAgICAgIC8vdGhpcy5zZXRTdGVwKHN0ZXApO1xuXG4gICAgICAgIHZhciBmYWRlSW5TcGVlZCA9IDA7XG4gICAgICAgIGlmICh0aGlzLmNyZWF0ZVRyYWNlKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVByZXZpb3VzU3RlcERpdihzdGVwKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFN0ZXBEaXYuaGlkZSgpO1xuICAgICAgICAgICAgZmFkZUluU3BlZWQgPSAyMDA7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbmV3V2lkdGggPSB0aGlzLmdldFdpZHRoKHRoaXMuc3RlcHNbc3RlcF1bMl0pO1xuICAgICAgICB2YXIgZXZhbEVsZW0gPSB0aGlzLmN1cnJlbnRTdGVwRGl2LmNoaWxkcmVuKFwiLmV2YWxcIik7XG5cbiAgICAgICAgdmFyIHRoaXNTaG93RXZhbCA9IHRoaXM7XG5cbiAgICAgICAgZXZhbEVsZW0uY3NzKFwiY29sb3JcIiwgXCJyZWRcIik7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50U3RlcERpdi5mYWRlVG8oZmFkZUluU3BlZWQsIDEsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBldmFsRWxlbS5mYWRlVG8oNDAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vZXZhbEVsZW0uY3NzKCdvdmVyZmxvdycsICdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgZXZhbEVsZW0uYW5pbWF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgd2lkdGg6IG5ld1dpZHRoLCBkdXJhdGlvbjogNDAwIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZhbEVsZW0uaHRtbCh0aGlzU2hvd0V2YWwuc3RlcHNbc3RlcF1bMl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2YWxFbGVtLmZhZGVUbyg0MDAsIDEsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9ldmFsRWxlbS5jc3MoJ292ZXJmbG93JywgJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2YWxFbGVtLmNzcyhcImNvbG9yXCIsIFwiIzMzM1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNTaG93RXZhbC5jdXJyZW50U3RlcCArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNTaG93RXZhbC5jdXJyZW50U3RlcCA8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Nob3dFdmFsLnN0ZXBzLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Nob3dFdmFsLnNldFN0ZXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNTaG93RXZhbC5jdXJyZW50U3RlcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGJ1dHRvbklkKS5hdHRyKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA2MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgNjAwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5yYi5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgZXZlbnQ6IFwic2hvd2V2YWxcIixcbiAgICAgICAgICAgIGFjdDogXCJuZXh0XCIsXG4gICAgICAgICAgICBkaXZfaWQ6IHRoaXMuY29udGFpbmVyRGl2LmlkLFxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PSBGaW5kIHRoZSBjdXN0b20gSFRNTCB0YWdzIGFuZCA9PVxuPT0gICBleGVjdXRlIG91ciBjb2RlIG9uIHRoZW0gICAgPT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4kKGRvY3VtZW50KS5vbihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgJChcIltkYXRhLWNvbXBvbmVudD1zaG93ZXZhbF1cIikuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgLy8gTUNcbiAgICAgICAgdmFyIG9wdHMgPSB7XG4gICAgICAgICAgICBvcmlnOiB0aGlzLFxuICAgICAgICAgICAgdXNlUnVuZXN0b25lU2VydmljZXM6IGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzLFxuICAgICAgICB9O1xuICAgICAgICBvcHRzLnJhdyA9IHdpbmRvdy5yYXdfc3RlcHNbdGhpcy5pZF07XG4gICAgICAgIGlmICgkKHRoaXMpLmNsb3Nlc3QoXCJbZGF0YS1jb21wb25lbnQ9dGltZWRBc3Nlc3NtZW50XVwiKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBlbGVtZW50IGV4aXN0cyB3aXRoaW4gYSB0aW1lZCBjb21wb25lbnQsIGRvbid0IHJlbmRlciBpdCBoZXJlXG4gICAgICAgICAgICBzZUxpc3RbdGhpcy5pZF0gPSBuZXcgU2hvd0V2YWwob3B0cyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5W1wic2hvd2V2YWxcIl0gPSBmdW5jdGlvbiAob3B0cykge1xuICAgIHJldHVybiBuZXcgU2hvd0V2YWwob3B0cyk7XG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9