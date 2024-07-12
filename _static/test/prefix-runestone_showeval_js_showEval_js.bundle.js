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
/* harmony export */   ShowEval: () => (/* binding */ ShowEval)
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
            window.componentMap[this.id] = new ShowEval(opts);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZV9zaG93ZXZhbF9qc19zaG93RXZhbF9qcy5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ2E7O0FBRTZDO0FBQzdCOztBQUV0Qix1QkFBdUIsZ0VBQWE7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRDtBQUMzRCxzQkFBc0IsZ0VBQWE7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsV0FBVztBQUMxQyxnQ0FBZ0MsV0FBVzs7QUFFM0M7QUFDQSx3QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDNUMseUNBQXlDLHVCQUF1QjtBQUNoRTtBQUNBLG1DQUFtQztBQUNuQyxpQ0FBaUMsa0JBQWtCO0FBQ25EO0FBQ0E7QUFDQSxpQ0FBaUMsa0JBQWtCO0FBQ25EO0FBQ0E7QUFDQSxlQUFlOztBQUVmLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QztBQUM1Qzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLGdDQUFnQztBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQyw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2IsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9zaG93ZXZhbC9jc3Mvc2hvd0V2YWwuY3NzPzBhNzMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9zaG93ZXZhbC9qcy9zaG93RXZhbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvKlxuVGhpcyBjb21wb25lbnQgaXMgYmFzZWQgb24gLi4uXG5TaG93RXZhbCwgYSBKUyBtb2R1bGUgZm9yIGNyZWF0aW5nIHZpc3VhbGl6YXRpb25zIG9mIGV4cHJlc3Npb24gZXZhbHVhdGlvbi4gTWFpbmx5IGZvciBwcm9ncmFtbWluZyB0dXRvcmlhbHMuXG4wLjkuMVxuXG5BbCBTd2VpZ2FydFxuYWxAaW52ZW50d2l0aHB5dGhvbi5jb21cbmh0dHBzOi8vZ2l0aHViLmNvbS9hc3dlaWdhcnQvXG4qL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZVwiO1xuaW1wb3J0IFwiLi4vY3NzL3Nob3dFdmFsLmNzc1wiO1xuXG5leHBvcnQgY2xhc3MgU2hvd0V2YWwgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB0aGlzLmRpdmlkID0gb3B0cy5vcmlnLmlkO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IG9wdHMub3JpZztcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuY2xhc3NMaXN0LmFkZChcInNob3dFdmFsXCIpO1xuICAgICAgICBsZXQgc3RlcHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgcyBvZiBvcHRzLnJhdykge1xuICAgICAgICAgICAgc3RlcHMucHVzaChzLnJlcGxhY2UoL1xcXFwvZywgXCJcIikpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RlcHMgPSBzdGVwcy5zbGljZSgpO1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGVwID0gMDtcbiAgICAgICAgdGhpcy5jcmVhdGVUcmFjZSA9ICQob3B0cy5vcmlnKS5kYXRhKFwidHJhY2Vtb2RlXCIpOyAvLyBUT0RPIC0gcmVzZXQgZG9lc24ndCB3b3JrIGZvciB0cmFjZXNcbiAgICAgICAgdGhpcy5yYiA9IG5ldyBSdW5lc3RvbmVCYXNlKG9wdHMpO1xuICAgICAgICAvLyBjcmVhdGUgZWxlbWVudHNcbiAgICAgICAgdGhpcy5jdXJyZW50U3RlcERpdiA9ICQoXCI8ZGl2PlwiKS5hZGRDbGFzcyhcImN1cnJlbnRTdGVwRGl2XCIpO1xuICAgICAgICAkKHRoaXMuY29udGFpbmVyRGl2KS5hcHBlbmQodGhpcy5jdXJyZW50U3RlcERpdik7XG4gICAgICAgIHRoaXMuY3VycmVudFN0ZXBEaXYuYXBwZW5kKCQoXCI8c3Bhbj5cIikuYWRkQ2xhc3MoXCJwcmVcIikpO1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGVwRGl2LmFwcGVuZCgkKFwiPHNwYW4+XCIpLmFkZENsYXNzKFwiZXZhbFwiKSk7XG4gICAgICAgIHRoaXMuY3VycmVudFN0ZXBEaXYuYXBwZW5kKCQoXCI8c3Bhbj5cIikuYWRkQ2xhc3MoXCJwb3N0XCIpKTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3RlcERpdi5hcHBlbmQoJChcIjxkaXY+XCIpLmFkZENsYXNzKFwiYW5ub1wiKSk7XG4gICAgICAgIHRoaXMuc2V0TmV4dEJ1dHRvbihgIyR7dGhpcy5kaXZpZH1fbmV4dFN0ZXBgKTtcbiAgICAgICAgdGhpcy5zZXRSZXNldEJ1dHRvbihgIyR7dGhpcy5kaXZpZH1fcmVzZXRgKTtcblxuICAgICAgICAvLyBwYXJzZSBzdGVwcyBhbmQgdHVybiBpbnRvIGEgNC1zdHJpbmcgYXJyYXk6IFsncHJlJywgJ2JlZm9yZSBldmFsJywgJ2FmdGVyIGV2YWwnLCAncG9zdCddXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdGVwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHMgPSB0aGlzLnN0ZXBzW2ldO1xuICAgICAgICAgICAgbGV0IGVuZHBvaW50LCBwSXRlbSwgY29tbWVudDtcblxuICAgICAgICAgICAgaWYgKHMuaW5jbHVkZXMoXCIjI1wiKSkge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlIGlzIGFuIGFubm90YXRpb25cbiAgICAgICAgICAgICAgICBlbmRwb2ludCA9IHMuaW5kZXhPZihcIiMjXCIpO1xuICAgICAgICAgICAgICAgIGNvbW1lbnQgPSBzLnN1YnN0cmluZyhlbmRwb2ludCArIDIsIHMubGVuZ3RoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZW5kcG9pbnQgPSBzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBjb21tZW50ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN0ZXBzW2ldID0gW1xuICAgICAgICAgICAgICAgIHMuc3Vic3RyaW5nKDAsIHMuaW5kZXhPZihcInt7XCIpKSwgLy8gJ3ByZSdcbiAgICAgICAgICAgICAgICBzLnN1YnN0cmluZyhzLmluZGV4T2YoXCJ7e1wiKSArIDIsIHMuaW5kZXhPZihcIn19e3tcIikpLCAvLyAnYmVmb3JlIGV2YWwnXG4gICAgICAgICAgICAgICAgcy5zdWJzdHJpbmcoXG4gICAgICAgICAgICAgICAgICAgIHMuaW5kZXhPZihcIn19e3tcIikgKyA0LFxuICAgICAgICAgICAgICAgICAgICBzLmluZGV4T2YoXCJ9fVwiLCBzLmluZGV4T2YoXCJ9fXt7XCIpICsgNClcbiAgICAgICAgICAgICAgICApLCAvLyAnYWZ0ZXIgZXZhbCdcbiAgICAgICAgICAgICAgICBzLnN1YnN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgcy5pbmRleE9mKFwifX1cIiwgcy5pbmRleE9mKFwifX17e1wiKSArIDQpICsgMixcbiAgICAgICAgICAgICAgICAgICAgZW5kcG9pbnRcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgXTsgLy8gJ3Bvc3QnXG5cbiAgICAgICAgICAgIHRoaXMuc3RlcHNbaV0ucHVzaChjb21tZW50KTsgLy8gJ2Fubm8nXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB0aGlzLmNhcHRpb24gPSBcIlNob3dFdmFsXCI7XG4gICAgICAgIHRoaXMuYWRkQ2FwdGlvbihcInJ1bmVzdG9uZVwiKTtcbiAgICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbiAgICB9XG5cbiAgICBzZXROZXh0QnV0dG9uKG5leHRCdXR0b25TZWxlY3Rvcikge1xuICAgICAgICB2YXIgdGhpc09iaiA9IHRoaXM7IC8vIHVoZywgamF2YXNjcmlwdFxuICAgICAgICAkKG5leHRCdXR0b25TZWxlY3RvcikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpc09iai5ldmFsdWF0ZVN0ZXAobmV4dEJ1dHRvblNlbGVjdG9yKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2V0UmVzZXRCdXR0b24ocmVzZXRCdXR0b25TZWxlY3Rvcikge1xuICAgICAgICB2YXIgdGhpc09iaiA9IHRoaXM7IC8vIHVoZywgamF2YXNjcmlwdFxuICAgICAgICAkKHJlc2V0QnV0dG9uU2VsZWN0b3IpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXNPYmoucmVzZXQoMCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICAkKHRoaXMuY29udGFpbmVyRGl2KS5maW5kKFwiLnByZXZpb3VzU3RlcFwiKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5zZXRTdGVwKDApO1xuICAgICAgICB0aGlzLnJiLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICBldmVudDogXCJzaG93ZXZhbFwiLFxuICAgICAgICAgICAgYWN0OiBcInJlc2V0XCIsXG4gICAgICAgICAgICBkaXZfaWQ6IHRoaXMuY29udGFpbmVyRGl2LmlkLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzZXRTdGVwKHN0ZXApIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3RlcCA9IHN0ZXA7XG4gICAgICAgIGxldCBuZXdXaWR0aCA9IHRoaXMuZ2V0V2lkdGgodGhpcy5zdGVwc1t0aGlzLmN1cnJlbnRTdGVwXVsxXSk7XG4gICAgICAgIGlmICh0aGlzLnN0ZXBzW3N0ZXBdWzRdKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGVwRGl2LmNoaWxkcmVuKFwiLmFubm9cIikuaHRtbCh0aGlzLnN0ZXBzW3N0ZXBdWzRdKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFN0ZXBEaXYuY2hpbGRyZW4oXCIuYW5ub1wiKS5zaG93KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGVwRGl2LmNoaWxkcmVuKFwiLmFubm9cIikuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3VycmVudFN0ZXBEaXYuY2hpbGRyZW4oXCIuZXZhbFwiKS53aWR0aChuZXdXaWR0aCk7XG4gICAgICAgIHRoaXMuY3VycmVudFN0ZXBEaXYuY2hpbGRyZW4oXCIucHJlXCIpLmh0bWwodGhpcy5zdGVwc1tzdGVwXVswXSk7XG4gICAgICAgIHRoaXMuY3VycmVudFN0ZXBEaXYuY2hpbGRyZW4oXCIuZXZhbFwiKS5odG1sKHRoaXMuc3RlcHNbc3RlcF1bMV0pO1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGVwRGl2LmNoaWxkcmVuKFwiLnBvc3RcIikuaHRtbCh0aGlzLnN0ZXBzW3N0ZXBdWzNdKTtcbiAgICB9XG5cbiAgICBnZXRXaWR0aCh0ZXh0KSB7XG4gICAgICAgIC8vIFRPRE8gLSBjbGFzcyBzdHlsZSBtdXN0IG1hdGNoIG9yIGVsc2Ugd2lkdGggd2lsbCBiZSBvZmYuXG4gICAgICAgIHZhciBuZXdFbGVtID0gJChcIjxkaXY+XCIpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoXCJzaG93RXZhbCBldmFsQ29udFwiKVxuICAgICAgICAgICAgLmhpZGUoKVxuICAgICAgICAgICAgLmh0bWwodGV4dCk7XG4gICAgICAgICQoXCJib2R5XCIpLmFwcGVuZChuZXdFbGVtKTtcbiAgICAgICAgdmFyIG5ld1dpZHRoID0gbmV3RWxlbS53aWR0aCgpICsgMTsgLy8gKzEgaXMgYSBoYWNrXG4gICAgICAgIG5ld0VsZW0ucmVtb3ZlKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1dpZHRoO1xuICAgIH1cblxuICAgIGNyZWF0ZVByZXZpb3VzU3RlcERpdihzdGVwKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFN0ZXBEaXYuYmVmb3JlKFxuICAgICAgICAgICAgJChcIjxkaXY+XCIpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKFwicHJldmlvdXNTdGVwXCIpXG4gICAgICAgICAgICAgICAgLmh0bWwoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RlcHNbc3RlcF1bMF0gK1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGVwc1tzdGVwXVsxXSArXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0ZXBzW3N0ZXBdWzNdXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGV2YWx1YXRlU3RlcChidXR0b25JZCwgc3RlcCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGVwRGl2LmNoaWxkcmVuKFwiLmFubm9cIikuaGlkZSgpO1xuICAgICAgICAkKGJ1dHRvbklkKS5hdHRyKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG4gICAgICAgIGlmIChzdGVwID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHN0ZXAgPSB0aGlzLmN1cnJlbnRTdGVwO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTdGVwID49IHRoaXMuc3RlcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAvL3RoaXMuY3VycmVudFN0ZXAgPSAwO1xuICAgICAgICAgICAgLy9zdGVwID0gMDtcbiAgICAgICAgICAgICQoYnV0dG9uSWQpLmF0dHIoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm47IC8vIGRvIG5vdGhpbmcgaWYgb24gbGFzdCBzdGVwXG4gICAgICAgIH1cbiAgICAgICAgLy90aGlzLnNldFN0ZXAoc3RlcCk7XG5cbiAgICAgICAgdmFyIGZhZGVJblNwZWVkID0gMDtcbiAgICAgICAgaWYgKHRoaXMuY3JlYXRlVHJhY2UpIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJldmlvdXNTdGVwRGl2KHN0ZXApO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3RlcERpdi5oaWRlKCk7XG4gICAgICAgICAgICBmYWRlSW5TcGVlZCA9IDIwMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBuZXdXaWR0aCA9IHRoaXMuZ2V0V2lkdGgodGhpcy5zdGVwc1tzdGVwXVsyXSk7XG4gICAgICAgIHZhciBldmFsRWxlbSA9IHRoaXMuY3VycmVudFN0ZXBEaXYuY2hpbGRyZW4oXCIuZXZhbFwiKTtcblxuICAgICAgICB2YXIgdGhpc1Nob3dFdmFsID0gdGhpcztcblxuICAgICAgICBldmFsRWxlbS5jc3MoXCJjb2xvclwiLCBcInJlZFwiKTtcblxuICAgICAgICB0aGlzLmN1cnJlbnRTdGVwRGl2LmZhZGVUbyhmYWRlSW5TcGVlZCwgMSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGV2YWxFbGVtLmZhZGVUbyg0MDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9ldmFsRWxlbS5jc3MoJ292ZXJmbG93JywgJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICBldmFsRWxlbS5hbmltYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgeyB3aWR0aDogbmV3V2lkdGgsIGR1cmF0aW9uOiA0MDAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmFsRWxlbS5odG1sKHRoaXNTaG93RXZhbC5zdGVwc1tzdGVwXVsyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZhbEVsZW0uZmFkZVRvKDQwMCwgMSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2V2YWxFbGVtLmNzcygnb3ZlcmZsb3cnLCAndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZhbEVsZW0uY3NzKFwiY29sb3JcIiwgXCIjMzMzXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Nob3dFdmFsLmN1cnJlbnRTdGVwICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Nob3dFdmFsLmN1cnJlbnRTdGVwIDxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzU2hvd0V2YWwuc3RlcHMubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzU2hvd0V2YWwuc2V0U3RlcChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Nob3dFdmFsLmN1cnJlbnRTdGVwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoYnV0dG9uSWQpLmF0dHIoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDYwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCA2MDApO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnJiLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICBldmVudDogXCJzaG93ZXZhbFwiLFxuICAgICAgICAgICAgYWN0OiBcIm5leHRcIixcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5jb250YWluZXJEaXYuaWQsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09IEZpbmQgdGhlIGN1c3RvbSBIVE1MIHRhZ3MgYW5kID09XG49PSAgIGV4ZWN1dGUgb3VyIGNvZGUgb24gdGhlbSAgICA9PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiQoZG9jdW1lbnQpLm9uKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAkKFwiW2RhdGEtY29tcG9uZW50PXNob3dldmFsXVwiKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAvLyBNQ1xuICAgICAgICB2YXIgb3B0cyA9IHtcbiAgICAgICAgICAgIG9yaWc6IHRoaXMsXG4gICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMsXG4gICAgICAgIH07XG4gICAgICAgIG9wdHMucmF3ID0gd2luZG93LnJhd19zdGVwc1t0aGlzLmlkXTtcbiAgICAgICAgaWYgKCQodGhpcykuY2xvc2VzdChcIltkYXRhLWNvbXBvbmVudD10aW1lZEFzc2Vzc21lbnRdXCIpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGlzIGVsZW1lbnQgZXhpc3RzIHdpdGhpbiBhIHRpbWVkIGNvbXBvbmVudCwgZG9uJ3QgcmVuZGVyIGl0IGhlcmVcbiAgICAgICAgICAgIHdpbmRvdy5jb21wb25lbnRNYXBbdGhpcy5pZF0gPSBuZXcgU2hvd0V2YWwob3B0cyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5W1wic2hvd2V2YWxcIl0gPSBmdW5jdGlvbiAob3B0cykge1xuICAgIHJldHVybiBuZXcgU2hvd0V2YWwob3B0cyk7XG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9