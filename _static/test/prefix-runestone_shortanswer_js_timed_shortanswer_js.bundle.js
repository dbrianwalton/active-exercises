"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_shortanswer_js_timed_shortanswer_js"],{

/***/ 76199:
/*!***************************************************!*\
  !*** ./runestone/shortanswer/css/shortanswer.css ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 67230:
/*!*************************************************!*\
  !*** ./runestone/shortanswer/js/shortanswer.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ShortAnswer)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 2568);
/* harmony import */ var _css_shortanswer_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../css/shortanswer.css */ 76199);
/*==========================================
=======    Master shortanswer.js    ========
============================================
===     This file contains the JS for    ===
=== the Runestone shortanswer component. ===
============================================
===              Created by              ===
===           Isaiah Mayerchak           ===
===                7/2/15                ===
===              Brad Miller             ===
===                2019                  ===
==========================================*/




class ShortAnswer extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        if (opts) {
            var orig = opts.orig; // entire <p> element that will be replaced by new HTML
            this.useRunestoneServices =
                opts.useRunestoneServices || eBookConfig.useRunestoneServices;
            this.origElem = orig;
            this.divid = orig.id;
            this.question = this.origElem.innerHTML;
            this.optional = false;
            this.attachURL = opts.attachURL;
            if ($(this.origElem).is("[data-optional]")) {
                this.optional = true;
            }
            if ($(this.origElem).is("[data-mathjax]")) {
                this.mathjax = true;
            }
            if ($(this.origElem).is("[data-attachment]")) {
                this.attachment = true;
            }
            this.placeholder =
                $(this.origElem).data("placeholder") ||
                "Write your answer here";
            this.renderHTML();
            this.caption = "shortanswer";
            this.addCaption("runestone");
            this.checkServer("shortanswer", true);
            if (typeof Prism !== "undefined") {
                Prism.highlightAllUnder(this.containerDiv);
            }
        }
    }

    renderHTML() {
        this.containerDiv = document.createElement("div");
        this.containerDiv.id = this.divid;
        $(this.containerDiv).addClass(this.origElem.getAttribute("class"));
        this.newForm = document.createElement("form");
        this.newForm.id = this.divid + "_journal";
        this.newForm.name = this.newForm.id;
        this.newForm.action = "";
        this.containerDiv.appendChild(this.newForm);
        this.fieldSet = document.createElement("fieldset");
        this.newForm.appendChild(this.fieldSet);
        this.firstLegendDiv = document.createElement("div");
        this.firstLegendDiv.innerHTML = this.question;
        $(this.firstLegendDiv).addClass("journal-question");
        this.fieldSet.appendChild(this.firstLegendDiv);
        this.jInputDiv = document.createElement("div");
        this.jInputDiv.id = this.divid + "_journal_input";
        this.fieldSet.appendChild(this.jInputDiv);
        this.jOptionsDiv = document.createElement("div");
        $(this.jOptionsDiv).addClass("journal-options");
        this.jInputDiv.appendChild(this.jOptionsDiv);
        this.jLabel = document.createElement("label");
        $(this.jLabel).addClass("radio-inline");
        this.jOptionsDiv.appendChild(this.jLabel);
        this.jTextArea = document.createElement("textarea");
        let self = this;
        this.jTextArea.onchange = function() {
            self.isAnswered = true;
        };
        this.jTextArea.id = this.divid + "_solution";
        $(this.jTextArea).attr("aria-label", "textarea");
        this.jTextArea.placeholder = this.placeholder;
        $(this.jTextArea).css("display:inline, width:530px");
        $(this.jTextArea).addClass("form-control");
        this.jTextArea.rows = 4;
        this.jTextArea.cols = 50;
        this.jLabel.appendChild(this.jTextArea);
        this.jTextArea.onchange = function() {
            this.feedbackDiv.innerHTML = "Your answer has not been saved yet!";
            $(this.feedbackDiv).removeClass("alert-success");
            $(this.feedbackDiv).addClass("alert alert-danger");
        }.bind(this);
        this.fieldSet.appendChild(document.createElement("br"));
        if (this.mathjax) {
            this.renderedAnswer = document.createElement("div");
            $(this.renderedAnswer).addClass("latexoutput");
            this.fieldSet.appendChild(this.renderedAnswer);
        }
        this.buttonDiv = document.createElement("div");
        this.fieldSet.appendChild(this.buttonDiv);
        this.submitButton = document.createElement("button");
        $(this.submitButton).addClass("btn btn-success");
        this.submitButton.type = "button";
        this.submitButton.textContent = "Save";
        this.submitButton.onclick = function() {
            this.checkCurrentAnswer();
            this.logCurrentAnswer();
            this.renderFeedback();
        }.bind(this);
        this.buttonDiv.appendChild(this.submitButton);
        this.randomSpan = document.createElement("span");
        this.randomSpan.innerHTML = "Instructor's Feedback";
        this.fieldSet.appendChild(this.randomSpan);
        this.otherOptionsDiv = document.createElement("div");
        $(this.otherOptionsDiv).css("padding-left:20px");
        $(this.otherOptionsDiv).addClass("journal-options");
        this.fieldSet.appendChild(this.otherOptionsDiv);
        // add a feedback div to give user feedback
        this.feedbackDiv = document.createElement("div");
        //$(this.feedbackDiv).addClass("bg-info form-control");
        //$(this.feedbackDiv).css("width:530px, background-color:#eee, font-style:italic");
        $(this.feedbackDiv).css("width:530px, font-style:italic");
        this.feedbackDiv.id = this.divid + "_feedback";
        this.feedbackDiv.innerHTML = "You have not answered this question yet.";
        $(this.feedbackDiv).addClass("alert alert-danger");
        //this.otherOptionsDiv.appendChild(this.feedbackDiv);
        this.fieldSet.appendChild(this.feedbackDiv);
        if (this.attachment) {
            let attachDiv = document.createElement("div")
            if (this.graderactive ) {
                // If in grading mode make a button to create a popup with the image
                let viewButton = document.createElement("button")
                viewButton.type = "button"
                viewButton.innerHTML = "View Attachment"
                viewButton.onclick = this.viewFile.bind(this);
                attachDiv.appendChild(viewButton);
            } else {
                // Otherwise make a button for the student to select a file to upload.
                this.fileUpload = document.createElement("input")
                this.fileUpload.type = "file";
                this.fileUpload.id = `${this.divid}_fileme`;
                attachDiv.appendChild(this.fileUpload);
            }
            this.containerDiv.appendChild(attachDiv);
        }
        //this.fieldSet.appendChild(document.createElement("br"));
        $(this.origElem).replaceWith(this.containerDiv);
        // This is a stopgap measure for when MathJax is not loaded at all.  There is another
        // more difficult case that when MathJax is loaded asynchronously we will get here
        // before MathJax is loaded.  In that case we will need to implement something
        // like `the solution described here <https://stackoverflow.com/questions/3014018/how-to-detect-when-mathjax-is-fully-loaded>`_
        if (typeof MathJax !== "undefined") {
            this.queueMathJax(this.containerDiv);
        }
    }

    renderMath(value) {
        if (this.mathjax) {
            value = value.replace(/\$\$(.*?)\$\$/g, "\\[ $1 \\]");
            value = value.replace(/\$(.*?)\$/g, "\\( $1 \\)");
            $(this.renderedAnswer).text(value);
            this.queueMathJax(this.renderedAnswer);
        }
    }

    checkCurrentAnswer() {}

    async logCurrentAnswer(sid) {
        let value = $(document.getElementById(this.divid + "_solution")).val();
        this.renderMath(value);
        this.setLocalStorage({
            answer: value,
            timestamp: new Date(),
        });
        let data = {
            event: "shortanswer",
            act: value,
            answer: value,
            div_id: this.divid,
        };
        if (typeof sid !== "undefined") {
            data.sid = sid;
        }
        await this.logBookEvent(data);
        if (this.attachment) {
            await this.uploadFile();
        }
    }

    renderFeedback() {
        this.feedbackDiv.innerHTML = "Your answer has been saved.";
        $(this.feedbackDiv).removeClass("alert-danger");
        $(this.feedbackDiv).addClass("alert alert-success");
    }
    setLocalStorage(data) {
        if (!this.graderactive) {
            let key = this.localStorageKey();
            localStorage.setItem(key, JSON.stringify(data));
        }
    }
    checkLocalStorage() {
        // Repopulates the short answer text
        // which was stored into local storage.
        var answer = "";
        if (this.graderactive) {
            return;
        }
        var len = localStorage.length;
        if (len > 0) {
            var ex = localStorage.getItem(this.localStorageKey());
            if (ex !== null) {
                try {
                    var storedData = JSON.parse(ex);
                    answer = storedData.answer;
                } catch (err) {
                    // error while parsing; likely due to bad value stored in storage
                    console.log(err.message);
                    localStorage.removeItem(this.localStorageKey());
                    return;
                }
                let solution = $("#" + this.divid + "_solution");
                solution.text(answer);
                this.renderMath(answer);
                this.feedbackDiv.innerHTML =
                    "Your current saved answer is shown above.";
                $(this.feedbackDiv).removeClass("alert-danger");
                $(this.feedbackDiv).addClass("alert alert-success");
            }
        }
    }
    restoreAnswers(data) {
        // Restore answers from storage retrieval done in RunestoneBase
        // sometimes data.answer can be null
        if (!data.answer) {
            data.answer = "";
        }
        this.answer = data.answer;
        this.jTextArea.value = this.answer;
        this.renderMath(this.answer);

        let p = document.createElement("p");
        this.jInputDiv.appendChild(p);
        var tsString = "";
        if (data.timestamp) {
            tsString = new Date(data.timestamp).toLocaleString();
        } else {
            tsString = "";
        }
        $(p).text(tsString);
        if (data.last_answer) {
            this.current_answer = "ontime";
            let toggle_answer_button = document.createElement("button");
            toggle_answer_button.type = "button";
            $(toggle_answer_button).text("Show Late Answer");
            $(toggle_answer_button).addClass("btn btn-warning");
            $(toggle_answer_button).css("margin-left", "5px");

            $(toggle_answer_button).click(
                function() {
                    var display_timestamp, button_text;
                    if (this.current_answer === "ontime") {
                        this.jTextArea.value = data.last_answer;
                        this.answer = data.last_answer;
                        display_timestamp = new Date(
                            data.last_timestamp
                        ).toLocaleString();
                        button_text = "Show on-Time Answer";
                        this.current_answer = "late";
                    } else {
                        this.jTextArea.value = data.answer;
                        this.answer = data.answer;
                        display_timestamp = tsString;
                        button_text = "Show Late Answer";
                        this.current_answer = "ontime";
                    }
                    this.renderMath(this.answer);
                    $(p).text(`Submitted: ${display_timestamp}`);
                    $(toggle_answer_button).text(button_text);
                }.bind(this)
            );

            this.buttonDiv.appendChild(toggle_answer_button);
        }
        let feedbackStr = "Your current saved answer is shown above.";
        if (typeof data.score !== "undefined") {
            feedbackStr = `Score: ${data.score}`;
        }
        if (data.comment) {
            feedbackStr += ` -- ${data.comment}`;
        }
        this.feedbackDiv.innerHTML = feedbackStr;

        $(this.feedbackDiv).removeClass("alert-danger");
        $(this.feedbackDiv).addClass("alert alert-success");
    }

    disableInteraction() {
        this.jTextArea.disabled = true;
    }

    async uploadFile() {
        const files = this.fileUpload.files
        const data = new FormData()
        if (this.fileUpload.files.length > 0) {
            data.append('file', files[0])
            fetch(`/ns/logger/upload/${this.divid}`, {
                    method: 'POST',
                    body: data
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                })
                .catch(error => {
                    console.error(error)
                })
            }
    }

    viewFile() {
        // Get the URL from the S3 API -- saved when we display in grader mode
        if (this.attachURL) {
            //window.open(this.attachURL, "_blank");
            const image_window = window.open("", "_blank")
            image_window.document.write(`
                  <html>
                    <head>
                    </head>
                    <body>
                      <img src="${this.attachURL}" alt="Attachment" >
                    </body>
                  </html>
            `);
        } else {
            alert("No attachment for this student.")
        }
    }
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/
$(document).on("runestone:login-complete", function() {
    $("[data-component=shortanswer]").each(function() {
        if ($(this).closest("[data-component=timedAssessment]").length == 0) {
            // If this element exists within a timed component, don't render it here
            try {
                window.componentMap[this.id] = new ShortAnswer({
                    orig: this,
                    useRunestoneServices: eBookConfig.useRunestoneServices,
                });
            } catch (err) {
                console.log(`Error rendering ShortAnswer Problem ${this.id}
                Details: ${err}`);
            }
        }
    });
});


/***/ }),

/***/ 87483:
/*!*******************************************************!*\
  !*** ./runestone/shortanswer/js/timed_shortanswer.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimedShortAnswer)
/* harmony export */ });
/* harmony import */ var _shortanswer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shortanswer.js */ 67230);


class TimedShortAnswer extends _shortanswer_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        this.renderTimedIcon(this.containerDiv);
        this.hideButtons();
    }
    hideButtons() {
        $(this.submitButton).hide();
    }
    renderTimedIcon(component) {
        // renders the clock icon on timed components.    The component parameter
        // is the element that the icon should be appended to.
        var timeIconDiv = document.createElement("div");
        var timeIcon = document.createElement("img");
        $(timeIcon).attr({
            src: "../_static/clock.png",
            style: "width:15px;height:15px",
        });
        timeIconDiv.className = "timeTip";
        timeIconDiv.title = "";
        timeIconDiv.appendChild(timeIcon);
        $(component).prepend(timeIconDiv);
    }
    checkCorrectTimed() {
        return "I"; // we ignore this in the grading
    }
    hideFeedback() {
        $(this.feedbackDiv).hide();
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.shortanswer = function (opts) {
    if (opts.timed) {
        return new TimedShortAnswer(opts);
    }
    return new _shortanswer_js__WEBPACK_IMPORTED_MODULE_0__["default"](opts);
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZV9zaG9ydGFuc3dlcl9qc190aW1lZF9zaG9ydGFuc3dlcl9qcy5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFNkQ7QUFDM0I7O0FBRW5CLDBCQUEwQixtRUFBYTtBQUN0RDtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLFdBQVc7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCLDRDQUE0QztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxrQkFBa0I7QUFDOUQ7QUFDQSxpQkFBaUI7QUFDakI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsV0FBVztBQUMvQztBQUNBO0FBQ0Esa0NBQWtDLGFBQWE7QUFDL0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsV0FBVztBQUNsRDtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsZUFBZTtBQUNqRDtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGNBQWM7QUFDZCxtRUFBbUU7QUFDbkUsMkJBQTJCLElBQUk7QUFDL0I7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDdFcwQzs7QUFFNUIsK0JBQStCLHVEQUFXO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSx1REFBVztBQUMxQiIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvc2hvcnRhbnN3ZXIvY3NzL3Nob3J0YW5zd2VyLmNzcz9kZmI0Iiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvc2hvcnRhbnN3ZXIvanMvc2hvcnRhbnN3ZXIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9zaG9ydGFuc3dlci9qcy90aW1lZF9zaG9ydGFuc3dlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PSAgICBNYXN0ZXIgc2hvcnRhbnN3ZXIuanMgICAgPT09PT09PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgIFRoaXMgZmlsZSBjb250YWlucyB0aGUgSlMgZm9yICAgID09PVxuPT09IHRoZSBSdW5lc3RvbmUgc2hvcnRhbnN3ZXIgY29tcG9uZW50LiA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgICAgICAgICAgIENyZWF0ZWQgYnkgICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICBJc2FpYWggTWF5ZXJjaGFrICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgICA3LzIvMTUgICAgICAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgICAgIEJyYWQgTWlsbGVyICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgICAgIDIwMTkgICAgICAgICAgICAgICAgICA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qc1wiO1xuaW1wb3J0IFwiLi8uLi9jc3Mvc2hvcnRhbnN3ZXIuY3NzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNob3J0QW5zd2VyIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgaWYgKG9wdHMpIHtcbiAgICAgICAgICAgIHZhciBvcmlnID0gb3B0cy5vcmlnOyAvLyBlbnRpcmUgPHA+IGVsZW1lbnQgdGhhdCB3aWxsIGJlIHJlcGxhY2VkIGJ5IG5ldyBIVE1MXG4gICAgICAgICAgICB0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzID1cbiAgICAgICAgICAgICAgICBvcHRzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzIHx8IGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzO1xuICAgICAgICAgICAgdGhpcy5vcmlnRWxlbSA9IG9yaWc7XG4gICAgICAgICAgICB0aGlzLmRpdmlkID0gb3JpZy5pZDtcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb24gPSB0aGlzLm9yaWdFbGVtLmlubmVySFRNTDtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uYWwgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuYXR0YWNoVVJMID0gb3B0cy5hdHRhY2hVUkw7XG4gICAgICAgICAgICBpZiAoJCh0aGlzLm9yaWdFbGVtKS5pcyhcIltkYXRhLW9wdGlvbmFsXVwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9uYWwgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCQodGhpcy5vcmlnRWxlbSkuaXMoXCJbZGF0YS1tYXRoamF4XVwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubWF0aGpheCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJCh0aGlzLm9yaWdFbGVtKS5pcyhcIltkYXRhLWF0dGFjaG1lbnRdXCIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRhY2htZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucGxhY2Vob2xkZXIgPVxuICAgICAgICAgICAgICAgICQodGhpcy5vcmlnRWxlbSkuZGF0YShcInBsYWNlaG9sZGVyXCIpIHx8XG4gICAgICAgICAgICAgICAgXCJXcml0ZSB5b3VyIGFuc3dlciBoZXJlXCI7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckhUTUwoKTtcbiAgICAgICAgICAgIHRoaXMuY2FwdGlvbiA9IFwic2hvcnRhbnN3ZXJcIjtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2FwdGlvbihcInJ1bmVzdG9uZVwiKTtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tTZXJ2ZXIoXCJzaG9ydGFuc3dlclwiLCB0cnVlKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgUHJpc20gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICBQcmlzbS5oaWdobGlnaHRBbGxVbmRlcih0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXJIVE1MKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgJCh0aGlzLmNvbnRhaW5lckRpdikuYWRkQ2xhc3ModGhpcy5vcmlnRWxlbS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSk7XG4gICAgICAgIHRoaXMubmV3Rm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpO1xuICAgICAgICB0aGlzLm5ld0Zvcm0uaWQgPSB0aGlzLmRpdmlkICsgXCJfam91cm5hbFwiO1xuICAgICAgICB0aGlzLm5ld0Zvcm0ubmFtZSA9IHRoaXMubmV3Rm9ybS5pZDtcbiAgICAgICAgdGhpcy5uZXdGb3JtLmFjdGlvbiA9IFwiXCI7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMubmV3Rm9ybSk7XG4gICAgICAgIHRoaXMuZmllbGRTZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZmllbGRzZXRcIik7XG4gICAgICAgIHRoaXMubmV3Rm9ybS5hcHBlbmRDaGlsZCh0aGlzLmZpZWxkU2V0KTtcbiAgICAgICAgdGhpcy5maXJzdExlZ2VuZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuZmlyc3RMZWdlbmREaXYuaW5uZXJIVE1MID0gdGhpcy5xdWVzdGlvbjtcbiAgICAgICAgJCh0aGlzLmZpcnN0TGVnZW5kRGl2KS5hZGRDbGFzcyhcImpvdXJuYWwtcXVlc3Rpb25cIik7XG4gICAgICAgIHRoaXMuZmllbGRTZXQuYXBwZW5kQ2hpbGQodGhpcy5maXJzdExlZ2VuZERpdik7XG4gICAgICAgIHRoaXMuaklucHV0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5qSW5wdXREaXYuaWQgPSB0aGlzLmRpdmlkICsgXCJfam91cm5hbF9pbnB1dFwiO1xuICAgICAgICB0aGlzLmZpZWxkU2V0LmFwcGVuZENoaWxkKHRoaXMuaklucHV0RGl2KTtcbiAgICAgICAgdGhpcy5qT3B0aW9uc0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICQodGhpcy5qT3B0aW9uc0RpdikuYWRkQ2xhc3MoXCJqb3VybmFsLW9wdGlvbnNcIik7XG4gICAgICAgIHRoaXMuaklucHV0RGl2LmFwcGVuZENoaWxkKHRoaXMuak9wdGlvbnNEaXYpO1xuICAgICAgICB0aGlzLmpMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICAgICAgJCh0aGlzLmpMYWJlbCkuYWRkQ2xhc3MoXCJyYWRpby1pbmxpbmVcIik7XG4gICAgICAgIHRoaXMuak9wdGlvbnNEaXYuYXBwZW5kQ2hpbGQodGhpcy5qTGFiZWwpO1xuICAgICAgICB0aGlzLmpUZXh0QXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKTtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmpUZXh0QXJlYS5vbmNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5pc0Fuc3dlcmVkID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5qVGV4dEFyZWEuaWQgPSB0aGlzLmRpdmlkICsgXCJfc29sdXRpb25cIjtcbiAgICAgICAgJCh0aGlzLmpUZXh0QXJlYSkuYXR0cihcImFyaWEtbGFiZWxcIiwgXCJ0ZXh0YXJlYVwiKTtcbiAgICAgICAgdGhpcy5qVGV4dEFyZWEucGxhY2Vob2xkZXIgPSB0aGlzLnBsYWNlaG9sZGVyO1xuICAgICAgICAkKHRoaXMualRleHRBcmVhKS5jc3MoXCJkaXNwbGF5OmlubGluZSwgd2lkdGg6NTMwcHhcIik7XG4gICAgICAgICQodGhpcy5qVGV4dEFyZWEpLmFkZENsYXNzKFwiZm9ybS1jb250cm9sXCIpO1xuICAgICAgICB0aGlzLmpUZXh0QXJlYS5yb3dzID0gNDtcbiAgICAgICAgdGhpcy5qVGV4dEFyZWEuY29scyA9IDUwO1xuICAgICAgICB0aGlzLmpMYWJlbC5hcHBlbmRDaGlsZCh0aGlzLmpUZXh0QXJlYSk7XG4gICAgICAgIHRoaXMualRleHRBcmVhLm9uY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmZlZWRiYWNrRGl2LmlubmVySFRNTCA9IFwiWW91ciBhbnN3ZXIgaGFzIG5vdCBiZWVuIHNhdmVkIHlldCFcIjtcbiAgICAgICAgICAgICQodGhpcy5mZWVkYmFja0RpdikucmVtb3ZlQ2xhc3MoXCJhbGVydC1zdWNjZXNzXCIpO1xuICAgICAgICAgICAgJCh0aGlzLmZlZWRiYWNrRGl2KS5hZGRDbGFzcyhcImFsZXJ0IGFsZXJ0LWRhbmdlclwiKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmZpZWxkU2V0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJiclwiKSk7XG4gICAgICAgIGlmICh0aGlzLm1hdGhqYXgpIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZWRBbnN3ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgJCh0aGlzLnJlbmRlcmVkQW5zd2VyKS5hZGRDbGFzcyhcImxhdGV4b3V0cHV0XCIpO1xuICAgICAgICAgICAgdGhpcy5maWVsZFNldC5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlcmVkQW5zd2VyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJ1dHRvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuZmllbGRTZXQuYXBwZW5kQ2hpbGQodGhpcy5idXR0b25EaXYpO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICQodGhpcy5zdWJtaXRCdXR0b24pLmFkZENsYXNzKFwiYnRuIGJ0bi1zdWNjZXNzXCIpO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24udGV4dENvbnRlbnQgPSBcIlNhdmVcIjtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5jaGVja0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgICAgIHRoaXMubG9nQ3VycmVudEFuc3dlcigpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJGZWVkYmFjaygpO1xuICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuYnV0dG9uRGl2LmFwcGVuZENoaWxkKHRoaXMuc3VibWl0QnV0dG9uKTtcbiAgICAgICAgdGhpcy5yYW5kb21TcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgIHRoaXMucmFuZG9tU3Bhbi5pbm5lckhUTUwgPSBcIkluc3RydWN0b3IncyBGZWVkYmFja1wiO1xuICAgICAgICB0aGlzLmZpZWxkU2V0LmFwcGVuZENoaWxkKHRoaXMucmFuZG9tU3Bhbik7XG4gICAgICAgIHRoaXMub3RoZXJPcHRpb25zRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgJCh0aGlzLm90aGVyT3B0aW9uc0RpdikuY3NzKFwicGFkZGluZy1sZWZ0OjIwcHhcIik7XG4gICAgICAgICQodGhpcy5vdGhlck9wdGlvbnNEaXYpLmFkZENsYXNzKFwiam91cm5hbC1vcHRpb25zXCIpO1xuICAgICAgICB0aGlzLmZpZWxkU2V0LmFwcGVuZENoaWxkKHRoaXMub3RoZXJPcHRpb25zRGl2KTtcbiAgICAgICAgLy8gYWRkIGEgZmVlZGJhY2sgZGl2IHRvIGdpdmUgdXNlciBmZWVkYmFja1xuICAgICAgICB0aGlzLmZlZWRiYWNrRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgLy8kKHRoaXMuZmVlZGJhY2tEaXYpLmFkZENsYXNzKFwiYmctaW5mbyBmb3JtLWNvbnRyb2xcIik7XG4gICAgICAgIC8vJCh0aGlzLmZlZWRiYWNrRGl2KS5jc3MoXCJ3aWR0aDo1MzBweCwgYmFja2dyb3VuZC1jb2xvcjojZWVlLCBmb250LXN0eWxlOml0YWxpY1wiKTtcbiAgICAgICAgJCh0aGlzLmZlZWRiYWNrRGl2KS5jc3MoXCJ3aWR0aDo1MzBweCwgZm9udC1zdHlsZTppdGFsaWNcIik7XG4gICAgICAgIHRoaXMuZmVlZGJhY2tEaXYuaWQgPSB0aGlzLmRpdmlkICsgXCJfZmVlZGJhY2tcIjtcbiAgICAgICAgdGhpcy5mZWVkYmFja0Rpdi5pbm5lckhUTUwgPSBcIllvdSBoYXZlIG5vdCBhbnN3ZXJlZCB0aGlzIHF1ZXN0aW9uIHlldC5cIjtcbiAgICAgICAgJCh0aGlzLmZlZWRiYWNrRGl2KS5hZGRDbGFzcyhcImFsZXJ0IGFsZXJ0LWRhbmdlclwiKTtcbiAgICAgICAgLy90aGlzLm90aGVyT3B0aW9uc0Rpdi5hcHBlbmRDaGlsZCh0aGlzLmZlZWRiYWNrRGl2KTtcbiAgICAgICAgdGhpcy5maWVsZFNldC5hcHBlbmRDaGlsZCh0aGlzLmZlZWRiYWNrRGl2KTtcbiAgICAgICAgaWYgKHRoaXMuYXR0YWNobWVudCkge1xuICAgICAgICAgICAgbGV0IGF0dGFjaERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICAgICAgICAgIGlmICh0aGlzLmdyYWRlcmFjdGl2ZSApIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBpbiBncmFkaW5nIG1vZGUgbWFrZSBhIGJ1dHRvbiB0byBjcmVhdGUgYSBwb3B1cCB3aXRoIHRoZSBpbWFnZVxuICAgICAgICAgICAgICAgIGxldCB2aWV3QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKVxuICAgICAgICAgICAgICAgIHZpZXdCdXR0b24udHlwZSA9IFwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICB2aWV3QnV0dG9uLmlubmVySFRNTCA9IFwiVmlldyBBdHRhY2htZW50XCJcbiAgICAgICAgICAgICAgICB2aWV3QnV0dG9uLm9uY2xpY2sgPSB0aGlzLnZpZXdGaWxlLmJpbmQodGhpcyk7XG4gICAgICAgICAgICAgICAgYXR0YWNoRGl2LmFwcGVuZENoaWxkKHZpZXdCdXR0b24pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UgbWFrZSBhIGJ1dHRvbiBmb3IgdGhlIHN0dWRlbnQgdG8gc2VsZWN0IGEgZmlsZSB0byB1cGxvYWQuXG4gICAgICAgICAgICAgICAgdGhpcy5maWxlVXBsb2FkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpXG4gICAgICAgICAgICAgICAgdGhpcy5maWxlVXBsb2FkLnR5cGUgPSBcImZpbGVcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGVVcGxvYWQuaWQgPSBgJHt0aGlzLmRpdmlkfV9maWxlbWVgO1xuICAgICAgICAgICAgICAgIGF0dGFjaERpdi5hcHBlbmRDaGlsZCh0aGlzLmZpbGVVcGxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoYXR0YWNoRGl2KTtcbiAgICAgICAgfVxuICAgICAgICAvL3RoaXMuZmllbGRTZXQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcbiAgICAgICAgJCh0aGlzLm9yaWdFbGVtKS5yZXBsYWNlV2l0aCh0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgIC8vIFRoaXMgaXMgYSBzdG9wZ2FwIG1lYXN1cmUgZm9yIHdoZW4gTWF0aEpheCBpcyBub3QgbG9hZGVkIGF0IGFsbC4gIFRoZXJlIGlzIGFub3RoZXJcbiAgICAgICAgLy8gbW9yZSBkaWZmaWN1bHQgY2FzZSB0aGF0IHdoZW4gTWF0aEpheCBpcyBsb2FkZWQgYXN5bmNocm9ub3VzbHkgd2Ugd2lsbCBnZXQgaGVyZVxuICAgICAgICAvLyBiZWZvcmUgTWF0aEpheCBpcyBsb2FkZWQuICBJbiB0aGF0IGNhc2Ugd2Ugd2lsbCBuZWVkIHRvIGltcGxlbWVudCBzb21ldGhpbmdcbiAgICAgICAgLy8gbGlrZSBgdGhlIHNvbHV0aW9uIGRlc2NyaWJlZCBoZXJlIDxodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zMDE0MDE4L2hvdy10by1kZXRlY3Qtd2hlbi1tYXRoamF4LWlzLWZ1bGx5LWxvYWRlZD5gX1xuICAgICAgICBpZiAodHlwZW9mIE1hdGhKYXggIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlck1hdGgodmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMubWF0aGpheCkge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXCRcXCQoLio/KVxcJFxcJC9nLCBcIlxcXFxbICQxIFxcXFxdXCIpO1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXCQoLio/KVxcJC9nLCBcIlxcXFwoICQxIFxcXFwpXCIpO1xuICAgICAgICAgICAgJCh0aGlzLnJlbmRlcmVkQW5zd2VyKS50ZXh0KHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMucmVuZGVyZWRBbnN3ZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hlY2tDdXJyZW50QW5zd2VyKCkge31cblxuICAgIGFzeW5jIGxvZ0N1cnJlbnRBbnN3ZXIoc2lkKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9ICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5kaXZpZCArIFwiX3NvbHV0aW9uXCIpKS52YWwoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJNYXRoKHZhbHVlKTtcbiAgICAgICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2Uoe1xuICAgICAgICAgICAgYW5zd2VyOiB2YWx1ZSxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKSxcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICAgICAgZXZlbnQ6IFwic2hvcnRhbnN3ZXJcIixcbiAgICAgICAgICAgIGFjdDogdmFsdWUsXG4gICAgICAgICAgICBhbnN3ZXI6IHZhbHVlLFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICB9O1xuICAgICAgICBpZiAodHlwZW9mIHNpZCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZGF0YS5zaWQgPSBzaWQ7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgdGhpcy5sb2dCb29rRXZlbnQoZGF0YSk7XG4gICAgICAgIGlmICh0aGlzLmF0dGFjaG1lbnQpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMudXBsb2FkRmlsZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyRmVlZGJhY2soKSB7XG4gICAgICAgIHRoaXMuZmVlZGJhY2tEaXYuaW5uZXJIVE1MID0gXCJZb3VyIGFuc3dlciBoYXMgYmVlbiBzYXZlZC5cIjtcbiAgICAgICAgJCh0aGlzLmZlZWRiYWNrRGl2KS5yZW1vdmVDbGFzcyhcImFsZXJ0LWRhbmdlclwiKTtcbiAgICAgICAgJCh0aGlzLmZlZWRiYWNrRGl2KS5hZGRDbGFzcyhcImFsZXJ0IGFsZXJ0LXN1Y2Nlc3NcIik7XG4gICAgfVxuICAgIHNldExvY2FsU3RvcmFnZShkYXRhKSB7XG4gICAgICAgIGlmICghdGhpcy5ncmFkZXJhY3RpdmUpIHtcbiAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLmxvY2FsU3RvcmFnZUtleSgpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2hlY2tMb2NhbFN0b3JhZ2UoKSB7XG4gICAgICAgIC8vIFJlcG9wdWxhdGVzIHRoZSBzaG9ydCBhbnN3ZXIgdGV4dFxuICAgICAgICAvLyB3aGljaCB3YXMgc3RvcmVkIGludG8gbG9jYWwgc3RvcmFnZS5cbiAgICAgICAgdmFyIGFuc3dlciA9IFwiXCI7XG4gICAgICAgIGlmICh0aGlzLmdyYWRlcmFjdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsZW4gPSBsb2NhbFN0b3JhZ2UubGVuZ3RoO1xuICAgICAgICBpZiAobGVuID4gMCkge1xuICAgICAgICAgICAgdmFyIGV4ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG4gICAgICAgICAgICBpZiAoZXggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RvcmVkRGF0YSA9IEpTT04ucGFyc2UoZXgpO1xuICAgICAgICAgICAgICAgICAgICBhbnN3ZXIgPSBzdG9yZWREYXRhLmFuc3dlcjtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZXJyb3Igd2hpbGUgcGFyc2luZzsgbGlrZWx5IGR1ZSB0byBiYWQgdmFsdWUgc3RvcmVkIGluIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgc29sdXRpb24gPSAkKFwiI1wiICsgdGhpcy5kaXZpZCArIFwiX3NvbHV0aW9uXCIpO1xuICAgICAgICAgICAgICAgIHNvbHV0aW9uLnRleHQoYW5zd2VyKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlck1hdGgoYW5zd2VyKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWRiYWNrRGl2LmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgICAgIFwiWW91ciBjdXJyZW50IHNhdmVkIGFuc3dlciBpcyBzaG93biBhYm92ZS5cIjtcbiAgICAgICAgICAgICAgICAkKHRoaXMuZmVlZGJhY2tEaXYpLnJlbW92ZUNsYXNzKFwiYWxlcnQtZGFuZ2VyXCIpO1xuICAgICAgICAgICAgICAgICQodGhpcy5mZWVkYmFja0RpdikuYWRkQ2xhc3MoXCJhbGVydCBhbGVydC1zdWNjZXNzXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJlc3RvcmVBbnN3ZXJzKGRhdGEpIHtcbiAgICAgICAgLy8gUmVzdG9yZSBhbnN3ZXJzIGZyb20gc3RvcmFnZSByZXRyaWV2YWwgZG9uZSBpbiBSdW5lc3RvbmVCYXNlXG4gICAgICAgIC8vIHNvbWV0aW1lcyBkYXRhLmFuc3dlciBjYW4gYmUgbnVsbFxuICAgICAgICBpZiAoIWRhdGEuYW5zd2VyKSB7XG4gICAgICAgICAgICBkYXRhLmFuc3dlciA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbnN3ZXIgPSBkYXRhLmFuc3dlcjtcbiAgICAgICAgdGhpcy5qVGV4dEFyZWEudmFsdWUgPSB0aGlzLmFuc3dlcjtcbiAgICAgICAgdGhpcy5yZW5kZXJNYXRoKHRoaXMuYW5zd2VyKTtcblxuICAgICAgICBsZXQgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICB0aGlzLmpJbnB1dERpdi5hcHBlbmRDaGlsZChwKTtcbiAgICAgICAgdmFyIHRzU3RyaW5nID0gXCJcIjtcbiAgICAgICAgaWYgKGRhdGEudGltZXN0YW1wKSB7XG4gICAgICAgICAgICB0c1N0cmluZyA9IG5ldyBEYXRlKGRhdGEudGltZXN0YW1wKS50b0xvY2FsZVN0cmluZygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHNTdHJpbmcgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgICQocCkudGV4dCh0c1N0cmluZyk7XG4gICAgICAgIGlmIChkYXRhLmxhc3RfYW5zd2VyKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfYW5zd2VyID0gXCJvbnRpbWVcIjtcbiAgICAgICAgICAgIGxldCB0b2dnbGVfYW5zd2VyX2J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICAgICB0b2dnbGVfYW5zd2VyX2J1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgICAgICQodG9nZ2xlX2Fuc3dlcl9idXR0b24pLnRleHQoXCJTaG93IExhdGUgQW5zd2VyXCIpO1xuICAgICAgICAgICAgJCh0b2dnbGVfYW5zd2VyX2J1dHRvbikuYWRkQ2xhc3MoXCJidG4gYnRuLXdhcm5pbmdcIik7XG4gICAgICAgICAgICAkKHRvZ2dsZV9hbnN3ZXJfYnV0dG9uKS5jc3MoXCJtYXJnaW4tbGVmdFwiLCBcIjVweFwiKTtcblxuICAgICAgICAgICAgJCh0b2dnbGVfYW5zd2VyX2J1dHRvbikuY2xpY2soXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXNwbGF5X3RpbWVzdGFtcCwgYnV0dG9uX3RleHQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRfYW5zd2VyID09PSBcIm9udGltZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmpUZXh0QXJlYS52YWx1ZSA9IGRhdGEubGFzdF9hbnN3ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuc3dlciA9IGRhdGEubGFzdF9hbnN3ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5X3RpbWVzdGFtcCA9IG5ldyBEYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEubGFzdF90aW1lc3RhbXBcbiAgICAgICAgICAgICAgICAgICAgICAgICkudG9Mb2NhbGVTdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbl90ZXh0ID0gXCJTaG93IG9uLVRpbWUgQW5zd2VyXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRfYW5zd2VyID0gXCJsYXRlXCI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmpUZXh0QXJlYS52YWx1ZSA9IGRhdGEuYW5zd2VyO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbnN3ZXIgPSBkYXRhLmFuc3dlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlfdGltZXN0YW1wID0gdHNTdHJpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25fdGV4dCA9IFwiU2hvdyBMYXRlIEFuc3dlclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50X2Fuc3dlciA9IFwib250aW1lXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJNYXRoKHRoaXMuYW5zd2VyKTtcbiAgICAgICAgICAgICAgICAgICAgJChwKS50ZXh0KGBTdWJtaXR0ZWQ6ICR7ZGlzcGxheV90aW1lc3RhbXB9YCk7XG4gICAgICAgICAgICAgICAgICAgICQodG9nZ2xlX2Fuc3dlcl9idXR0b24pLnRleHQoYnV0dG9uX3RleHQpO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdGhpcy5idXR0b25EaXYuYXBwZW5kQ2hpbGQodG9nZ2xlX2Fuc3dlcl9idXR0b24pO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmZWVkYmFja1N0ciA9IFwiWW91ciBjdXJyZW50IHNhdmVkIGFuc3dlciBpcyBzaG93biBhYm92ZS5cIjtcbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhLnNjb3JlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBmZWVkYmFja1N0ciA9IGBTY29yZTogJHtkYXRhLnNjb3JlfWA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEuY29tbWVudCkge1xuICAgICAgICAgICAgZmVlZGJhY2tTdHIgKz0gYCAtLSAke2RhdGEuY29tbWVudH1gO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmVlZGJhY2tEaXYuaW5uZXJIVE1MID0gZmVlZGJhY2tTdHI7XG5cbiAgICAgICAgJCh0aGlzLmZlZWRiYWNrRGl2KS5yZW1vdmVDbGFzcyhcImFsZXJ0LWRhbmdlclwiKTtcbiAgICAgICAgJCh0aGlzLmZlZWRiYWNrRGl2KS5hZGRDbGFzcyhcImFsZXJ0IGFsZXJ0LXN1Y2Nlc3NcIik7XG4gICAgfVxuXG4gICAgZGlzYWJsZUludGVyYWN0aW9uKCkge1xuICAgICAgICB0aGlzLmpUZXh0QXJlYS5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgYXN5bmMgdXBsb2FkRmlsZSgpIHtcbiAgICAgICAgY29uc3QgZmlsZXMgPSB0aGlzLmZpbGVVcGxvYWQuZmlsZXNcbiAgICAgICAgY29uc3QgZGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgICAgIGlmICh0aGlzLmZpbGVVcGxvYWQuZmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlc1swXSlcbiAgICAgICAgICAgIGZldGNoKGAvbnMvbG9nZ2VyL3VwbG9hZC8ke3RoaXMuZGl2aWR9YCwge1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgYm9keTogZGF0YVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgIH1cblxuICAgIHZpZXdGaWxlKCkge1xuICAgICAgICAvLyBHZXQgdGhlIFVSTCBmcm9tIHRoZSBTMyBBUEkgLS0gc2F2ZWQgd2hlbiB3ZSBkaXNwbGF5IGluIGdyYWRlciBtb2RlXG4gICAgICAgIGlmICh0aGlzLmF0dGFjaFVSTCkge1xuICAgICAgICAgICAgLy93aW5kb3cub3Blbih0aGlzLmF0dGFjaFVSTCwgXCJfYmxhbmtcIik7XG4gICAgICAgICAgICBjb25zdCBpbWFnZV93aW5kb3cgPSB3aW5kb3cub3BlbihcIlwiLCBcIl9ibGFua1wiKVxuICAgICAgICAgICAgaW1hZ2Vfd2luZG93LmRvY3VtZW50LndyaXRlKGBcbiAgICAgICAgICAgICAgICAgIDxodG1sPlxuICAgICAgICAgICAgICAgICAgICA8aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPC9oZWFkPlxuICAgICAgICAgICAgICAgICAgICA8Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7dGhpcy5hdHRhY2hVUkx9XCIgYWx0PVwiQXR0YWNobWVudFwiID5cbiAgICAgICAgICAgICAgICAgICAgPC9ib2R5PlxuICAgICAgICAgICAgICAgICAgPC9odG1sPlxuICAgICAgICAgICAgYCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydChcIk5vIGF0dGFjaG1lbnQgZm9yIHRoaXMgc3R1ZGVudC5cIilcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09IEZpbmQgdGhlIGN1c3RvbSBIVE1MIHRhZ3MgYW5kID09XG49PSAgIGV4ZWN1dGUgb3VyIGNvZGUgb24gdGhlbSAgICA9PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiQoZG9jdW1lbnQpLm9uKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGZ1bmN0aW9uKCkge1xuICAgICQoXCJbZGF0YS1jb21wb25lbnQ9c2hvcnRhbnN3ZXJdXCIpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgkKHRoaXMpLmNsb3Nlc3QoXCJbZGF0YS1jb21wb25lbnQ9dGltZWRBc3Nlc3NtZW50XVwiKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBlbGVtZW50IGV4aXN0cyB3aXRoaW4gYSB0aW1lZCBjb21wb25lbnQsIGRvbid0IHJlbmRlciBpdCBoZXJlXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5jb21wb25lbnRNYXBbdGhpcy5pZF0gPSBuZXcgU2hvcnRBbnN3ZXIoe1xuICAgICAgICAgICAgICAgICAgICBvcmlnOiB0aGlzLFxuICAgICAgICAgICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgcmVuZGVyaW5nIFNob3J0QW5zd2VyIFByb2JsZW0gJHt0aGlzLmlkfVxuICAgICAgICAgICAgICAgIERldGFpbHM6ICR7ZXJyfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59KTtcbiIsImltcG9ydCBTaG9ydEFuc3dlciBmcm9tIFwiLi9zaG9ydGFuc3dlci5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lZFNob3J0QW5zd2VyIGV4dGVuZHMgU2hvcnRBbnN3ZXIge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHRoaXMucmVuZGVyVGltZWRJY29uKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICAgICAgdGhpcy5oaWRlQnV0dG9ucygpO1xuICAgIH1cbiAgICBoaWRlQnV0dG9ucygpIHtcbiAgICAgICAgJCh0aGlzLnN1Ym1pdEJ1dHRvbikuaGlkZSgpO1xuICAgIH1cbiAgICByZW5kZXJUaW1lZEljb24oY29tcG9uZW50KSB7XG4gICAgICAgIC8vIHJlbmRlcnMgdGhlIGNsb2NrIGljb24gb24gdGltZWQgY29tcG9uZW50cy4gICAgVGhlIGNvbXBvbmVudCBwYXJhbWV0ZXJcbiAgICAgICAgLy8gaXMgdGhlIGVsZW1lbnQgdGhhdCB0aGUgaWNvbiBzaG91bGQgYmUgYXBwZW5kZWQgdG8uXG4gICAgICAgIHZhciB0aW1lSWNvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHZhciB0aW1lSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICAgICQodGltZUljb24pLmF0dHIoe1xuICAgICAgICAgICAgc3JjOiBcIi4uL19zdGF0aWMvY2xvY2sucG5nXCIsXG4gICAgICAgICAgICBzdHlsZTogXCJ3aWR0aDoxNXB4O2hlaWdodDoxNXB4XCIsXG4gICAgICAgIH0pO1xuICAgICAgICB0aW1lSWNvbkRpdi5jbGFzc05hbWUgPSBcInRpbWVUaXBcIjtcbiAgICAgICAgdGltZUljb25EaXYudGl0bGUgPSBcIlwiO1xuICAgICAgICB0aW1lSWNvbkRpdi5hcHBlbmRDaGlsZCh0aW1lSWNvbik7XG4gICAgICAgICQoY29tcG9uZW50KS5wcmVwZW5kKHRpbWVJY29uRGl2KTtcbiAgICB9XG4gICAgY2hlY2tDb3JyZWN0VGltZWQoKSB7XG4gICAgICAgIHJldHVybiBcIklcIjsgLy8gd2UgaWdub3JlIHRoaXMgaW4gdGhlIGdyYWRpbmdcbiAgICB9XG4gICAgaGlkZUZlZWRiYWNrKCkge1xuICAgICAgICAkKHRoaXMuZmVlZGJhY2tEaXYpLmhpZGUoKTtcbiAgICB9XG59XG5cbmlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID0ge307XG59XG5cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeS5zaG9ydGFuc3dlciA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgaWYgKG9wdHMudGltZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW1lZFNob3J0QW5zd2VyKG9wdHMpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFNob3J0QW5zd2VyKG9wdHMpO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==