"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_selectquestion_js_selectone_js"],{

/***/ 52675:
/*!*********************************************************!*\
  !*** ./runestone/selectquestion/css/selectquestion.css ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 63931:
/*!**************************************************!*\
  !*** ./runestone/selectquestion/js/selectone.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SelectOne)
/* harmony export */ });
/* harmony import */ var _common_js_renderComponent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/renderComponent.js */ 72773);
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 2568);
/* harmony import */ var _css_selectquestion_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../css/selectquestion.css */ 52675);
/**
 * *******************************
 * |docname| - SelectOne Component
 * *******************************
 */




class SelectOne extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_1__["default"] {
    /**
     * constructor --
     * Making an instance of a selectone is a bit more complicated because it is
     * a kind of meta directive.  That is, go to the server and randomly select
     * a question to display in this spot.  Or, if a student has already seen this question
     * in the context of an exam retrieve the question they saw in the first place.
     * Making an API call and waiting for the response is handled asynchronously.
     * But lots of code is not written with that assumption.  So we do the initialization in
     * two parts.
     * 1. Create the object with the usual constructor
     * 2. call initialize, which returns a promise.  When that promise is resolved
     * the "replacement" component will replace the original selectone component in the DOM.
     *
     * @param  {} opts
     */
    constructor(opts) {
        super(opts);
        this.origOpts = opts;
        this.questions = $(opts.orig).data("questionlist");
        this.proficiency = $(opts.orig).data("proficiency");
        this.minDifficulty = $(opts.orig).data("minDifficulty");
        this.maxDifficulty = $(opts.orig).data("maxDifficulty");
        this.points = $(opts.orig).data("points");
        this.autogradable = $(opts.orig).data("autogradable");
        this.not_seen_ever = $(opts.orig).data("not_seen_ever");
        this.selector_id = $(opts.orig).first().attr("id");
        this.primaryOnly = $(opts.orig).data("primary");
        this.ABExperiment = $(opts.orig).data("ab");
        this.toggleOptions = $(opts.orig).data("toggleoptions");
        this.toggleLabels = $(opts.orig).data("togglelabels");
        this.limitBaseCourse = $(opts.orig).data("limit-basecourse");
        opts.orig.id = this.selector_id;
    }
    /**
     * initialize --
     * initialize is used so that the constructor does not have to be async.
     * Constructors should definitely not return promises that would seriously
     * mess things up.
     * @return {Promise} Will resolve after component from DB is reified
     */
    async initialize() {
        let self = this;
        let data = { selector_id: this.selector_id };
        if (this.questions) {
            data.questions = this.questions;
        } else if (this.proficiency) {
            data.proficiency = this.proficiency;
        }
        if (this.minDifficulty) {
            data.minDifficulty = this.minDifficulty;
        }
        if (this.maxDifficulty) {
            data.maxDifficulty = this.maxDifficulty;
        }
        if (this.points) {
            data.points = this.points;
        }
        if (this.autogradable) {
            data.autogradable = this.autogradable;
        }
        if (this.not_seen_ever) {
            data.not_seen_ever = this.not_seen_ever;
        }
        if (this.primaryOnly) {
            data.primary = this.primaryOnly;
        }
        if (this.ABExperiment) {
            data.AB = this.ABExperiment;
        }
        if (this.timedWrapper) {
            data.timedWrapper = this.timedWrapper;
        }
        if (this.toggleOptions) {
            data.toggleOptions = this.toggleOptions;
        }
        if (this.toggleLabels) {
            data.toggleLabels = this.toggleLabels;
        }
        if (this.limitBaseCourse) {
            data.limitBaseCourse = eBookConfig.basecourse;
        }
        let opts = this.origOpts;
        let selectorId = this.selector_id;
        console.log("getting question source");
        let request = new Request(
            `${eBookConfig.new_server_prefix}/assessment/get_question_source`,
            {
                method: "POST",
                headers: this.jsonHeaders,
                body: JSON.stringify(data),
            }
        );
        let response = await fetch(request);
        let htmlsrc = await response.json();
        htmlsrc = htmlsrc.detail;
        if (htmlsrc.indexOf("No preview") >= 0) {
            alert(
                `Error: Not able to find a question for ${selectorId} based on the criteria`
            );
            throw new Error(`Unable to find a question for ${selectorId}`);
        }
        let res;
        if (opts.timed) {
            // timed components are not rendered immediately, only when the student
            // starts the assessment and visits this particular entry.
            res = (0,_common_js_renderComponent_js__WEBPACK_IMPORTED_MODULE_0__.createTimedComponent)(htmlsrc, {
                timed: true,
                selector_id: selectorId,
                assessmentTaken: opts.assessmentTaken,
            });
            // replace the entry in the timed assessment's list of components
            // with the component created by createTimedComponent
            for (let component of opts.rqa) {
                if (component.question == self) {
                    component.question = res.question;
                    break;
                }
            }
            self.realComponent = res.question;
            self.containerDiv = res.question.containerDiv;
            self.realComponent.selectorId = selectorId;
        } else {
            if (data.toggleOptions) {
                var toggleLabels = data.toggleLabels
                    .replace("togglelabels:", "")
                    .trim();
                if (toggleLabels) {
                    toggleLabels = toggleLabels.split(",");
                    for (var t = 0; t < toggleLabels.length; t++) {
                        toggleLabels[t] = toggleLabels[t].trim();
                    }
                }
                var toggleQuestions = this.questions.split(", ");
                var toggleUI = "";
                // check so that only the first toggle select question on the assignments page has a preview panel created, then all toggle select previews use this same panel
                if (!document.getElementById("component-preview")) {
                    toggleUI +=
                        '<div id="component-preview" class="col-md-6 toggle-preview" style="z-index: 999;">' +
                        '<div id="toggle-buttons"></div>' +
                        '<div id="toggle-preview"></div>' +
                        "</div>";
                }
                // dropdown menu containing the question options
                toggleUI +=
                    '<label for="' +
                    selectorId +
                    '-toggleQuestion" style="margin-left: 10px">Toggle Question:</label><select id="' +
                    selectorId +
                    '-toggleQuestion">';
                var i;
                var toggleQuestionHTMLSrc;
                var toggleQuestionSubstring;
                var toggleQuestionType;
                var toggleQuestionTypes = [];
                for (i = 0; i < toggleQuestions.length; i++) {
                    toggleQuestionHTMLSrc = await this.getToggleSrc(
                        toggleQuestions[i]
                    );
                    toggleQuestionSubstring =
                        toggleQuestionHTMLSrc.split('data-component="')[1];
                    switch (
                        toggleQuestionSubstring.slice(
                            0,
                            toggleQuestionSubstring.indexOf('"')
                        )
                    ) {
                        case "activecode":
                            toggleQuestionType = "Active Write Code";
                            break;
                        case "clickablearea":
                            toggleQuestionType = "Clickable Area";
                            break;
                        case "dragndrop":
                            toggleQuestionType = "Drag n Drop";
                            break;
                        case "fillintheblank":
                            toggleQuestionType = "Fill in the Blank";
                            break;
                        case "multiplechoice":
                            toggleQuestionType = "Multiple Choice";
                            break;
                        case "parsons":
                            toggleQuestionType = "Parsons Mixed-Up Code";
                            break;
                        case "shortanswer":
                            toggleQuestionType = "Short Answer";
                            break;
                    }
                    toggleQuestionTypes[i] = toggleQuestionType;
                    toggleUI += '<option value="' + toggleQuestions[i] + '">';
                    if (toggleLabels) {
                        if (toggleLabels[i]) {
                            toggleUI += toggleLabels[i];
                        } else {
                            toggleUI +=
                                toggleQuestionType + " - " + toggleQuestions[i];
                        }
                    } else {
                        toggleUI +=
                            toggleQuestionType + " - " + toggleQuestions[i];
                    }
                    if (i == 0 && data.toggleOptions.includes("lock")) {
                        toggleUI += " (only this question will be graded)";
                    }
                    toggleUI += "</option>";
                }
                toggleUI +=
                    '</select><div id="' +
                    selectorId +
                    '-toggleSelectedQuestion">';
                var toggleFirstID = htmlsrc.split('id="')[1];
                toggleFirstID = toggleFirstID.split('"')[0];
                htmlsrc = toggleUI + htmlsrc + "</div>";
            }
            // just render this component on the page in its usual place
            await (0,_common_js_renderComponent_js__WEBPACK_IMPORTED_MODULE_0__.renderRunestoneComponent)(htmlsrc, selectorId, {
                selector_id: selectorId,
                is_toggle: this.toggleOptions,
                is_select: true,
                useRunestoneServices: true,
            });
            if (data.toggleOptions) {
                $("#component-preview").hide();
                var toggleQuestionSelect = document.getElementById(
                    selectorId + "-toggleQuestion"
                );
                for (i = 0; i < toggleQuestionSelect.options.length; i++) {
                    if (
                        toggleQuestionSelect.options[i].value == toggleFirstID
                    ) {
                        toggleQuestionSelect.value = toggleFirstID;
                        $("#" + selectorId).data(
                            "toggle_current",
                            toggleFirstID
                        );
                        $("#" + selectorId).data(
                            "toggle_current_type",
                            toggleQuestionTypes[0]
                        );
                        break;
                    }
                }
                toggleQuestionSelect.addEventListener(
                    "change",
                    async function () {
                        await this.togglePreview(
                            toggleQuestionSelect.parentElement.id,
                            data.toggleOptions,
                            toggleQuestionTypes
                        );
                        this.logBookEvent({
                            event: "view_toggle",
                            act: toggleQuestionSelect.value,
                            div_id: toggleQuestionSelect.parentElement.id,
                        });
                    }.bind(this)
                );
            }
        }
        return response;
    }

    // retrieve html source of a question, for use in various toggle functionalities
    async getToggleSrc(toggleQuestionID) {
        let request = new Request(
            `${eBookConfig.new_server_prefix}/assessment/htmlsrc?acid=${toggleQuestionID}`,
            {
                method: "GET",
            }
        );
        let response = await fetch(request);
        let data = await response.json();
        let htmlsrc = data.detail;
        return htmlsrc;
    }

    // on changing the value of toggle select dropdown, render selected question in preview panel, add appropriate buttons, then make preview panel visible
    async togglePreview(parentID, toggleOptions, toggleQuestionTypes) {
        $("#toggle-buttons").html("");
        var parentDiv = document.getElementById(parentID);
        var toggleQuestionSelect = parentDiv.getElementsByTagName("select")[0];
        var selectedQuestion =
            toggleQuestionSelect.options[toggleQuestionSelect.selectedIndex]
                .value;
        var htmlsrc = await this.getToggleSrc(selectedQuestion);
        (0,_common_js_renderComponent_js__WEBPACK_IMPORTED_MODULE_0__.renderRunestoneComponent)(htmlsrc, "toggle-preview", {
            selector_id: "toggle-preview",
            is_toggle: this.toggleOptions,
            is_select: true,
            useRunestoneServices: true,
        });

        // add "Close Preview" button to the preview panel
        let closeButton = document.createElement("button");
        $(closeButton).text("Close Preview");
        $(closeButton).addClass("btn btn-default");
        closeButton.addEventListener("click",
            function () {
                $("#toggle-preview").html("");
                toggleQuestionSelect.value = $("#" + parentID).data(
                    "toggle_current"
                );
                $("#component-preview").hide();
                this.logBookEvent({
                    event: "close_toggle",
                    act: toggleQuestionSelect.value,
                    div_id: toggleQuestionSelect.parentElement.id
                });
         }.bind(this)
         );
        $("#toggle-buttons").append(closeButton);

        // if "lock" is not in toggle options, then allow adding more buttons to the preview panel
        if (!toggleOptions.includes("lock")) {
            let setButton = document.createElement("button");
            $(setButton).text("Select this Problem");
            $(setButton).addClass("btn btn-primary");
            $(setButton).click(
                async function () {
                    await this.toggleSet(
                        parentID,
                        selectedQuestion,
                        htmlsrc,
                        toggleQuestionTypes
                    );
                    $("#component-preview").hide();
                    this.logBookEvent({
                        event: "select_toggle",
                        act: selectedQuestion,
                        div_id: parentID,
                    });
                }.bind(this)
            );
            $("#toggle-buttons").append(setButton);

            // if "transfer" in toggle options, and if current question type is Parsons and selected question type is active code, then add "Transfer" button to preview panel
            if (toggleOptions.includes("transfer")) {
                var currentType = $("#" + parentID).data("toggle_current_type");
                var selectedType =
                    toggleQuestionTypes[toggleQuestionSelect.selectedIndex];
                if (
                    currentType == "Parsons Mixed-Up Code" &&
                    selectedType == "Active Write Code"
                ) {
                    let transferButton = document.createElement("button");
                    $(transferButton).text("Transfer Response");
                    $(transferButton).addClass("btn btn-primary");
                    $(transferButton).click(
                        async function () {
                            await this.toggleTransfer(
                                parentID,
                                selectedQuestion,
                                htmlsrc,
                                toggleQuestionTypes
                            );
                        }.bind(this)
                    );
                    $("#toggle-buttons").append(transferButton);
                }
            }
        }

        $("#component-preview").show();
    }

    // on clicking "Select this Problem" button, close preview panel, replace current question in assignments page with selected question, and send request to update grading database
    // _ `toggleSet`
    async toggleSet(parentID, selectedQuestion, htmlsrc, toggleQuestionTypes) {
        var selectorId = parentID + "-toggleSelectedQuestion";
        var toggleQuestionSelect = document
            .getElementById(parentID)
            .getElementsByTagName("select")[0];
        document.getElementById(selectorId).innerHTML = ""; // need to check whether this is even necessary
        await (0,_common_js_renderComponent_js__WEBPACK_IMPORTED_MODULE_0__.renderRunestoneComponent)(htmlsrc, selectorId, {
            selector_id: selectorId,
            is_toggle: this.toggleOptions,
            is_select: true,
            useRunestoneServices: true,
        });
        let request = new Request(
            `${eBookConfig.new_server_prefix}/assessment/set_selected_question?metaid=${parentID}&selected=${selectedQuestion}`,
            {}
        );
        await fetch(request);
        $("#toggle-preview").html("");
        $("#" + parentID).data("toggle_current", selectedQuestion);
        $("#" + parentID).data(
            "toggle_current_type",
            toggleQuestionTypes[toggleQuestionSelect.selectedIndex]
        );
    }

    // on clicking "Transfer" button, extract the current text and indentation of the Parsons blocks in the answer space, then paste that into the selected active code question
    async toggleTransfer(
        parentID,
        selectedQuestion,
        htmlsrc,
        toggleQuestionTypes
    ) {
        // retrieve all Parsons lines within the answer space and loop through this list
        var currentParsons = document
            .getElementById(parentID + "-toggleSelectedQuestion")
            .querySelectorAll("div[class^='answer']")[0]
            .getElementsByClassName("prettyprint lang-py");
        var currentParsonsClass;
        var currentBlockIndent;
        var indentCount;
        var indent;
        var parsonsLine;
        var parsonsLines = ``;
        var count;
        for (var p = 0; p < currentParsons.length; p++) {
            indentCount = 0;
            indent = "";
            // for Parsons blocks that have built-in indentation in their lines
            currentParsonsClass = currentParsons[p].classList[2];
            if (currentParsonsClass) {
                if (currentParsonsClass.includes("indent")) {
                    indentCount =
                        parseInt(indentCount) +
                        parseInt(
                            currentParsonsClass.slice(
                                6,
                                currentParsonsClass.length
                            )
                        );
                }
            }
            // for Parsons answer spaces with vertical lines that allow student to define their own line indentation
            currentBlockIndent =
                currentParsons[p].parentElement.parentElement.style.left;
            if (currentBlockIndent) {
                indentCount =
                    parseInt(indentCount) +
                    parseInt(
                        currentBlockIndent.slice(
                            0,
                            currentBlockIndent.indexOf("px")
                        ) / 30
                    );
            }
            for (var d = 0; d < indentCount; d++) {
                indent += "    ";
            }
            // retrieve each text snippet of each Parsons line and loop through this list
            parsonsLine = currentParsons[p].getElementsByTagName("span");
            count = 0;
            for (var l = 0; l < parsonsLine.length; l++) {
                if (parsonsLine[l].childNodes[0].nodeName == "#text") {
                    // Parsons blocks have differing amounts of hierarchy levels (spans within spans)
                    if (p == 0 && count == 0) {
                        // need different check than l == 0 because the l numbering doesn't align with location within line due to inconsistent span heirarchy
                        parsonsLines += indent + parsonsLine[l].innerHTML;
                        count++;
                    } else if (count != 0) {
                        parsonsLines += parsonsLine[l].innerHTML;
                        count++;
                    } else {
                        parsonsLines =
                            parsonsLines +
                            `
                            ` +
                            indent +
                            parsonsLine[l].innerHTML;
                        parsonsLines = parsonsLines.replace(
                            "                            ",
                            ""
                        );
                        count++;
                    }
                }
            }
        }
        // replace all existing code within selected active code question with extracted Parsons text
        var htmlsrcFormer = htmlsrc.slice(
            0,
            htmlsrc.indexOf("<textarea") +
                htmlsrc.split("<textarea")[1].indexOf(">") +
                10
        );
        var htmlsrcLatter = htmlsrc.slice(
            htmlsrc.indexOf("</textarea>"),
            htmlsrc.length
        );
        htmlsrc = htmlsrcFormer + parsonsLines + htmlsrcLatter;

        await this.toggleSet(
            parentID,
            selectedQuestion,
            htmlsrc,
            toggleQuestionTypes
        );
        $("#component-preview").hide();
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.selectquestion = function (opts) {
    return new SelectOne(opts);
};

/*
 * When the page is loaded and the login checks are complete find and render
 * each selectquestion component that is not part of a timedAssessment.
 **/
$(document).on("runestone:login-complete", async function () {
    let selQuestions = document.querySelectorAll(
        "[data-component=selectquestion]"
    );
    for (let cq of selQuestions) {
        try {
            if ($(cq).closest("[data-component=timedAssessment]").length == 0) {
                // If this element exists within a timed component, don't render it here
                let tmp = new SelectOne({ orig: cq });
                await tmp.initialize();
            }
        } catch (err) {
            console.log(`Error rendering New Exercise ${cq.id}
                         Details: ${err}`);
            console.log(err.stack);
        }
    }
});


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZV9zZWxlY3RxdWVzdGlvbl9qc19zZWxlY3RvbmVfanMuYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUk0QztBQUNpQjtBQUMxQjs7QUFFcEIsd0JBQXdCLG1FQUFhO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixTQUFTO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsOEJBQThCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwREFBMEQsWUFBWTtBQUN0RTtBQUNBLDZEQUE2RCxXQUFXO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsbUZBQW9CO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyx5QkFBeUI7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlHQUF5RztBQUN6RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qiw0QkFBNEI7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQix1RkFBd0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qix5Q0FBeUM7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsOEJBQThCLDJCQUEyQixpQkFBaUI7QUFDekY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsdUZBQXdCO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCLGlCQUFpQjtBQUNqQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNERBQTREO0FBQzVELGNBQWMsdUZBQXdCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsZUFBZSw4QkFBOEIsMkNBQTJDLFNBQVMsWUFBWSxpQkFBaUI7QUFDOUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsMkJBQTJCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsaUJBQWlCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsd0JBQXdCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsVUFBVTtBQUNwRDtBQUNBO0FBQ0EsVUFBVTtBQUNWLHdEQUF3RDtBQUN4RCxvQ0FBb0MsSUFBSTtBQUN4QztBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9zZWxlY3RxdWVzdGlvbi9jc3Mvc2VsZWN0cXVlc3Rpb24uY3NzP2JlZDMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9zZWxlY3RxdWVzdGlvbi9qcy9zZWxlY3RvbmUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLyoqXG4gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiB8ZG9jbmFtZXwgLSBTZWxlY3RPbmUgQ29tcG9uZW50XG4gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKi9cbmltcG9ydCB7XG4gICAgcmVuZGVyUnVuZXN0b25lQ29tcG9uZW50LFxuICAgIGNyZWF0ZVRpbWVkQ29tcG9uZW50LFxufSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3JlbmRlckNvbXBvbmVudC5qc1wiO1xuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlLmpzXCI7XG5pbXBvcnQgXCIuLi9jc3Mvc2VsZWN0cXVlc3Rpb24uY3NzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdE9uZSBleHRlbmRzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yIC0tXG4gICAgICogTWFraW5nIGFuIGluc3RhbmNlIG9mIGEgc2VsZWN0b25lIGlzIGEgYml0IG1vcmUgY29tcGxpY2F0ZWQgYmVjYXVzZSBpdCBpc1xuICAgICAqIGEga2luZCBvZiBtZXRhIGRpcmVjdGl2ZS4gIFRoYXQgaXMsIGdvIHRvIHRoZSBzZXJ2ZXIgYW5kIHJhbmRvbWx5IHNlbGVjdFxuICAgICAqIGEgcXVlc3Rpb24gdG8gZGlzcGxheSBpbiB0aGlzIHNwb3QuICBPciwgaWYgYSBzdHVkZW50IGhhcyBhbHJlYWR5IHNlZW4gdGhpcyBxdWVzdGlvblxuICAgICAqIGluIHRoZSBjb250ZXh0IG9mIGFuIGV4YW0gcmV0cmlldmUgdGhlIHF1ZXN0aW9uIHRoZXkgc2F3IGluIHRoZSBmaXJzdCBwbGFjZS5cbiAgICAgKiBNYWtpbmcgYW4gQVBJIGNhbGwgYW5kIHdhaXRpbmcgZm9yIHRoZSByZXNwb25zZSBpcyBoYW5kbGVkIGFzeW5jaHJvbm91c2x5LlxuICAgICAqIEJ1dCBsb3RzIG9mIGNvZGUgaXMgbm90IHdyaXR0ZW4gd2l0aCB0aGF0IGFzc3VtcHRpb24uICBTbyB3ZSBkbyB0aGUgaW5pdGlhbGl6YXRpb24gaW5cbiAgICAgKiB0d28gcGFydHMuXG4gICAgICogMS4gQ3JlYXRlIHRoZSBvYmplY3Qgd2l0aCB0aGUgdXN1YWwgY29uc3RydWN0b3JcbiAgICAgKiAyLiBjYWxsIGluaXRpYWxpemUsIHdoaWNoIHJldHVybnMgYSBwcm9taXNlLiAgV2hlbiB0aGF0IHByb21pc2UgaXMgcmVzb2x2ZWRcbiAgICAgKiB0aGUgXCJyZXBsYWNlbWVudFwiIGNvbXBvbmVudCB3aWxsIHJlcGxhY2UgdGhlIG9yaWdpbmFsIHNlbGVjdG9uZSBjb21wb25lbnQgaW4gdGhlIERPTS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge30gb3B0c1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHRoaXMub3JpZ09wdHMgPSBvcHRzO1xuICAgICAgICB0aGlzLnF1ZXN0aW9ucyA9ICQob3B0cy5vcmlnKS5kYXRhKFwicXVlc3Rpb25saXN0XCIpO1xuICAgICAgICB0aGlzLnByb2ZpY2llbmN5ID0gJChvcHRzLm9yaWcpLmRhdGEoXCJwcm9maWNpZW5jeVwiKTtcbiAgICAgICAgdGhpcy5taW5EaWZmaWN1bHR5ID0gJChvcHRzLm9yaWcpLmRhdGEoXCJtaW5EaWZmaWN1bHR5XCIpO1xuICAgICAgICB0aGlzLm1heERpZmZpY3VsdHkgPSAkKG9wdHMub3JpZykuZGF0YShcIm1heERpZmZpY3VsdHlcIik7XG4gICAgICAgIHRoaXMucG9pbnRzID0gJChvcHRzLm9yaWcpLmRhdGEoXCJwb2ludHNcIik7XG4gICAgICAgIHRoaXMuYXV0b2dyYWRhYmxlID0gJChvcHRzLm9yaWcpLmRhdGEoXCJhdXRvZ3JhZGFibGVcIik7XG4gICAgICAgIHRoaXMubm90X3NlZW5fZXZlciA9ICQob3B0cy5vcmlnKS5kYXRhKFwibm90X3NlZW5fZXZlclwiKTtcbiAgICAgICAgdGhpcy5zZWxlY3Rvcl9pZCA9ICQob3B0cy5vcmlnKS5maXJzdCgpLmF0dHIoXCJpZFwiKTtcbiAgICAgICAgdGhpcy5wcmltYXJ5T25seSA9ICQob3B0cy5vcmlnKS5kYXRhKFwicHJpbWFyeVwiKTtcbiAgICAgICAgdGhpcy5BQkV4cGVyaW1lbnQgPSAkKG9wdHMub3JpZykuZGF0YShcImFiXCIpO1xuICAgICAgICB0aGlzLnRvZ2dsZU9wdGlvbnMgPSAkKG9wdHMub3JpZykuZGF0YShcInRvZ2dsZW9wdGlvbnNcIik7XG4gICAgICAgIHRoaXMudG9nZ2xlTGFiZWxzID0gJChvcHRzLm9yaWcpLmRhdGEoXCJ0b2dnbGVsYWJlbHNcIik7XG4gICAgICAgIHRoaXMubGltaXRCYXNlQ291cnNlID0gJChvcHRzLm9yaWcpLmRhdGEoXCJsaW1pdC1iYXNlY291cnNlXCIpO1xuICAgICAgICBvcHRzLm9yaWcuaWQgPSB0aGlzLnNlbGVjdG9yX2lkO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBpbml0aWFsaXplIC0tXG4gICAgICogaW5pdGlhbGl6ZSBpcyB1c2VkIHNvIHRoYXQgdGhlIGNvbnN0cnVjdG9yIGRvZXMgbm90IGhhdmUgdG8gYmUgYXN5bmMuXG4gICAgICogQ29uc3RydWN0b3JzIHNob3VsZCBkZWZpbml0ZWx5IG5vdCByZXR1cm4gcHJvbWlzZXMgdGhhdCB3b3VsZCBzZXJpb3VzbHlcbiAgICAgKiBtZXNzIHRoaW5ncyB1cC5cbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSBXaWxsIHJlc29sdmUgYWZ0ZXIgY29tcG9uZW50IGZyb20gREIgaXMgcmVpZmllZFxuICAgICAqL1xuICAgIGFzeW5jIGluaXRpYWxpemUoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IGRhdGEgPSB7IHNlbGVjdG9yX2lkOiB0aGlzLnNlbGVjdG9yX2lkIH07XG4gICAgICAgIGlmICh0aGlzLnF1ZXN0aW9ucykge1xuICAgICAgICAgICAgZGF0YS5xdWVzdGlvbnMgPSB0aGlzLnF1ZXN0aW9ucztcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByb2ZpY2llbmN5KSB7XG4gICAgICAgICAgICBkYXRhLnByb2ZpY2llbmN5ID0gdGhpcy5wcm9maWNpZW5jeTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5taW5EaWZmaWN1bHR5KSB7XG4gICAgICAgICAgICBkYXRhLm1pbkRpZmZpY3VsdHkgPSB0aGlzLm1pbkRpZmZpY3VsdHk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubWF4RGlmZmljdWx0eSkge1xuICAgICAgICAgICAgZGF0YS5tYXhEaWZmaWN1bHR5ID0gdGhpcy5tYXhEaWZmaWN1bHR5O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBvaW50cykge1xuICAgICAgICAgICAgZGF0YS5wb2ludHMgPSB0aGlzLnBvaW50cztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5hdXRvZ3JhZGFibGUpIHtcbiAgICAgICAgICAgIGRhdGEuYXV0b2dyYWRhYmxlID0gdGhpcy5hdXRvZ3JhZGFibGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubm90X3NlZW5fZXZlcikge1xuICAgICAgICAgICAgZGF0YS5ub3Rfc2Vlbl9ldmVyID0gdGhpcy5ub3Rfc2Vlbl9ldmVyO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnByaW1hcnlPbmx5KSB7XG4gICAgICAgICAgICBkYXRhLnByaW1hcnkgPSB0aGlzLnByaW1hcnlPbmx5O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLkFCRXhwZXJpbWVudCkge1xuICAgICAgICAgICAgZGF0YS5BQiA9IHRoaXMuQUJFeHBlcmltZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnRpbWVkV3JhcHBlcikge1xuICAgICAgICAgICAgZGF0YS50aW1lZFdyYXBwZXIgPSB0aGlzLnRpbWVkV3JhcHBlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy50b2dnbGVPcHRpb25zKSB7XG4gICAgICAgICAgICBkYXRhLnRvZ2dsZU9wdGlvbnMgPSB0aGlzLnRvZ2dsZU9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudG9nZ2xlTGFiZWxzKSB7XG4gICAgICAgICAgICBkYXRhLnRvZ2dsZUxhYmVscyA9IHRoaXMudG9nZ2xlTGFiZWxzO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmxpbWl0QmFzZUNvdXJzZSkge1xuICAgICAgICAgICAgZGF0YS5saW1pdEJhc2VDb3Vyc2UgPSBlQm9va0NvbmZpZy5iYXNlY291cnNlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBvcHRzID0gdGhpcy5vcmlnT3B0cztcbiAgICAgICAgbGV0IHNlbGVjdG9ySWQgPSB0aGlzLnNlbGVjdG9yX2lkO1xuICAgICAgICBjb25zb2xlLmxvZyhcImdldHRpbmcgcXVlc3Rpb24gc291cmNlXCIpO1xuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2Fzc2Vzc21lbnQvZ2V0X3F1ZXN0aW9uX3NvdXJjZWAsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmpzb25IZWFkZXJzLFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgbGV0IGh0bWxzcmMgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIGh0bWxzcmMgPSBodG1sc3JjLmRldGFpbDtcbiAgICAgICAgaWYgKGh0bWxzcmMuaW5kZXhPZihcIk5vIHByZXZpZXdcIikgPj0gMCkge1xuICAgICAgICAgICAgYWxlcnQoXG4gICAgICAgICAgICAgICAgYEVycm9yOiBOb3QgYWJsZSB0byBmaW5kIGEgcXVlc3Rpb24gZm9yICR7c2VsZWN0b3JJZH0gYmFzZWQgb24gdGhlIGNyaXRlcmlhYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGZpbmQgYSBxdWVzdGlvbiBmb3IgJHtzZWxlY3RvcklkfWApO1xuICAgICAgICB9XG4gICAgICAgIGxldCByZXM7XG4gICAgICAgIGlmIChvcHRzLnRpbWVkKSB7XG4gICAgICAgICAgICAvLyB0aW1lZCBjb21wb25lbnRzIGFyZSBub3QgcmVuZGVyZWQgaW1tZWRpYXRlbHksIG9ubHkgd2hlbiB0aGUgc3R1ZGVudFxuICAgICAgICAgICAgLy8gc3RhcnRzIHRoZSBhc3Nlc3NtZW50IGFuZCB2aXNpdHMgdGhpcyBwYXJ0aWN1bGFyIGVudHJ5LlxuICAgICAgICAgICAgcmVzID0gY3JlYXRlVGltZWRDb21wb25lbnQoaHRtbHNyYywge1xuICAgICAgICAgICAgICAgIHRpbWVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNlbGVjdG9yX2lkOiBzZWxlY3RvcklkLFxuICAgICAgICAgICAgICAgIGFzc2Vzc21lbnRUYWtlbjogb3B0cy5hc3Nlc3NtZW50VGFrZW4sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIHJlcGxhY2UgdGhlIGVudHJ5IGluIHRoZSB0aW1lZCBhc3Nlc3NtZW50J3MgbGlzdCBvZiBjb21wb25lbnRzXG4gICAgICAgICAgICAvLyB3aXRoIHRoZSBjb21wb25lbnQgY3JlYXRlZCBieSBjcmVhdGVUaW1lZENvbXBvbmVudFxuICAgICAgICAgICAgZm9yIChsZXQgY29tcG9uZW50IG9mIG9wdHMucnFhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5xdWVzdGlvbiA9PSBzZWxmKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5xdWVzdGlvbiA9IHJlcy5xdWVzdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5yZWFsQ29tcG9uZW50ID0gcmVzLnF1ZXN0aW9uO1xuICAgICAgICAgICAgc2VsZi5jb250YWluZXJEaXYgPSByZXMucXVlc3Rpb24uY29udGFpbmVyRGl2O1xuICAgICAgICAgICAgc2VsZi5yZWFsQ29tcG9uZW50LnNlbGVjdG9ySWQgPSBzZWxlY3RvcklkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGRhdGEudG9nZ2xlT3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHZhciB0b2dnbGVMYWJlbHMgPSBkYXRhLnRvZ2dsZUxhYmVsc1xuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZShcInRvZ2dsZWxhYmVsczpcIiwgXCJcIilcbiAgICAgICAgICAgICAgICAgICAgLnRyaW0oKTtcbiAgICAgICAgICAgICAgICBpZiAodG9nZ2xlTGFiZWxzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZUxhYmVscyA9IHRvZ2dsZUxhYmVscy5zcGxpdChcIixcIik7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHQgPSAwOyB0IDwgdG9nZ2xlTGFiZWxzLmxlbmd0aDsgdCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVMYWJlbHNbdF0gPSB0b2dnbGVMYWJlbHNbdF0udHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB0b2dnbGVRdWVzdGlvbnMgPSB0aGlzLnF1ZXN0aW9ucy5zcGxpdChcIiwgXCIpO1xuICAgICAgICAgICAgICAgIHZhciB0b2dnbGVVSSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgc28gdGhhdCBvbmx5IHRoZSBmaXJzdCB0b2dnbGUgc2VsZWN0IHF1ZXN0aW9uIG9uIHRoZSBhc3NpZ25tZW50cyBwYWdlIGhhcyBhIHByZXZpZXcgcGFuZWwgY3JlYXRlZCwgdGhlbiBhbGwgdG9nZ2xlIHNlbGVjdCBwcmV2aWV3cyB1c2UgdGhpcyBzYW1lIHBhbmVsXG4gICAgICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbXBvbmVudC1wcmV2aWV3XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVVJICs9XG4gICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cImNvbXBvbmVudC1wcmV2aWV3XCIgY2xhc3M9XCJjb2wtbWQtNiB0b2dnbGUtcHJldmlld1wiIHN0eWxlPVwiei1pbmRleDogOTk5O1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJ0b2dnbGUtYnV0dG9uc1wiPjwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJ0b2dnbGUtcHJldmlld1wiPjwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCI8L2Rpdj5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZHJvcGRvd24gbWVudSBjb250YWluaW5nIHRoZSBxdWVzdGlvbiBvcHRpb25zXG4gICAgICAgICAgICAgICAgdG9nZ2xlVUkgKz1cbiAgICAgICAgICAgICAgICAgICAgJzxsYWJlbCBmb3I9XCInICtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3JJZCArXG4gICAgICAgICAgICAgICAgICAgICctdG9nZ2xlUXVlc3Rpb25cIiBzdHlsZT1cIm1hcmdpbi1sZWZ0OiAxMHB4XCI+VG9nZ2xlIFF1ZXN0aW9uOjwvbGFiZWw+PHNlbGVjdCBpZD1cIicgK1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcklkICtcbiAgICAgICAgICAgICAgICAgICAgJy10b2dnbGVRdWVzdGlvblwiPic7XG4gICAgICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICAgICAgdmFyIHRvZ2dsZVF1ZXN0aW9uSFRNTFNyYztcbiAgICAgICAgICAgICAgICB2YXIgdG9nZ2xlUXVlc3Rpb25TdWJzdHJpbmc7XG4gICAgICAgICAgICAgICAgdmFyIHRvZ2dsZVF1ZXN0aW9uVHlwZTtcbiAgICAgICAgICAgICAgICB2YXIgdG9nZ2xlUXVlc3Rpb25UeXBlcyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0b2dnbGVRdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25IVE1MU3JjID0gYXdhaXQgdGhpcy5nZXRUb2dnbGVTcmMoXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvbnNbaV1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25TdWJzdHJpbmcgPVxuICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25IVE1MU3JjLnNwbGl0KCdkYXRhLWNvbXBvbmVudD1cIicpWzFdO1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25TdWJzdHJpbmcuc2xpY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblN1YnN0cmluZy5pbmRleE9mKCdcIicpXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImFjdGl2ZWNvZGVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblR5cGUgPSBcIkFjdGl2ZSBXcml0ZSBDb2RlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiY2xpY2thYmxlYXJlYVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uVHlwZSA9IFwiQ2xpY2thYmxlIEFyZWFcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJkcmFnbmRyb3BcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblR5cGUgPSBcIkRyYWcgbiBEcm9wXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZmlsbGludGhlYmxhbmtcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblR5cGUgPSBcIkZpbGwgaW4gdGhlIEJsYW5rXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibXVsdGlwbGVjaG9pY2VcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblR5cGUgPSBcIk11bHRpcGxlIENob2ljZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInBhcnNvbnNcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblR5cGUgPSBcIlBhcnNvbnMgTWl4ZWQtVXAgQ29kZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNob3J0YW5zd2VyXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25UeXBlID0gXCJTaG9ydCBBbnN3ZXJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblR5cGVzW2ldID0gdG9nZ2xlUXVlc3Rpb25UeXBlO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVVSSArPSAnPG9wdGlvbiB2YWx1ZT1cIicgKyB0b2dnbGVRdWVzdGlvbnNbaV0gKyAnXCI+JztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvZ2dsZUxhYmVscykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvZ2dsZUxhYmVsc1tpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVVJICs9IHRvZ2dsZUxhYmVsc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlVUkgKz1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25UeXBlICsgXCIgLSBcIiArIHRvZ2dsZVF1ZXN0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVVJICs9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25UeXBlICsgXCIgLSBcIiArIHRvZ2dsZVF1ZXN0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PSAwICYmIGRhdGEudG9nZ2xlT3B0aW9ucy5pbmNsdWRlcyhcImxvY2tcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVVJICs9IFwiIChvbmx5IHRoaXMgcXVlc3Rpb24gd2lsbCBiZSBncmFkZWQpXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlVUkgKz0gXCI8L29wdGlvbj5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdG9nZ2xlVUkgKz1cbiAgICAgICAgICAgICAgICAgICAgJzwvc2VsZWN0PjxkaXYgaWQ9XCInICtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3JJZCArXG4gICAgICAgICAgICAgICAgICAgICctdG9nZ2xlU2VsZWN0ZWRRdWVzdGlvblwiPic7XG4gICAgICAgICAgICAgICAgdmFyIHRvZ2dsZUZpcnN0SUQgPSBodG1sc3JjLnNwbGl0KCdpZD1cIicpWzFdO1xuICAgICAgICAgICAgICAgIHRvZ2dsZUZpcnN0SUQgPSB0b2dnbGVGaXJzdElELnNwbGl0KCdcIicpWzBdO1xuICAgICAgICAgICAgICAgIGh0bWxzcmMgPSB0b2dnbGVVSSArIGh0bWxzcmMgKyBcIjwvZGl2PlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8ganVzdCByZW5kZXIgdGhpcyBjb21wb25lbnQgb24gdGhlIHBhZ2UgaW4gaXRzIHVzdWFsIHBsYWNlXG4gICAgICAgICAgICBhd2FpdCByZW5kZXJSdW5lc3RvbmVDb21wb25lbnQoaHRtbHNyYywgc2VsZWN0b3JJZCwge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yX2lkOiBzZWxlY3RvcklkLFxuICAgICAgICAgICAgICAgIGlzX3RvZ2dsZTogdGhpcy50b2dnbGVPcHRpb25zLFxuICAgICAgICAgICAgICAgIGlzX3NlbGVjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogdHJ1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGRhdGEudG9nZ2xlT3B0aW9ucykge1xuICAgICAgICAgICAgICAgICQoXCIjY29tcG9uZW50LXByZXZpZXdcIikuaGlkZSgpO1xuICAgICAgICAgICAgICAgIHZhciB0b2dnbGVRdWVzdGlvblNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcklkICsgXCItdG9nZ2xlUXVlc3Rpb25cIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRvZ2dsZVF1ZXN0aW9uU2VsZWN0Lm9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25TZWxlY3Qub3B0aW9uc1tpXS52YWx1ZSA9PSB0b2dnbGVGaXJzdElEXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25TZWxlY3QudmFsdWUgPSB0b2dnbGVGaXJzdElEO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIiNcIiArIHNlbGVjdG9ySWQpLmRhdGEoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0b2dnbGVfY3VycmVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZUZpcnN0SURcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiI1wiICsgc2VsZWN0b3JJZCkuZGF0YShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRvZ2dsZV9jdXJyZW50X3R5cGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblR5cGVzWzBdXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25TZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAgICAgXCJjaGFuZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy50b2dnbGVQcmV2aWV3KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uU2VsZWN0LnBhcmVudEVsZW1lbnQuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS50b2dnbGVPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uVHlwZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IFwidmlld190b2dnbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Q6IHRvZ2dsZVF1ZXN0aW9uU2VsZWN0LnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpdl9pZDogdG9nZ2xlUXVlc3Rpb25TZWxlY3QucGFyZW50RWxlbWVudC5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9XG5cbiAgICAvLyByZXRyaWV2ZSBodG1sIHNvdXJjZSBvZiBhIHF1ZXN0aW9uLCBmb3IgdXNlIGluIHZhcmlvdXMgdG9nZ2xlIGZ1bmN0aW9uYWxpdGllc1xuICAgIGFzeW5jIGdldFRvZ2dsZVNyYyh0b2dnbGVRdWVzdGlvbklEKSB7XG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vYXNzZXNzbWVudC9odG1sc3JjP2FjaWQ9JHt0b2dnbGVRdWVzdGlvbklEfWAsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgbGV0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIGxldCBodG1sc3JjID0gZGF0YS5kZXRhaWw7XG4gICAgICAgIHJldHVybiBodG1sc3JjO1xuICAgIH1cblxuICAgIC8vIG9uIGNoYW5naW5nIHRoZSB2YWx1ZSBvZiB0b2dnbGUgc2VsZWN0IGRyb3Bkb3duLCByZW5kZXIgc2VsZWN0ZWQgcXVlc3Rpb24gaW4gcHJldmlldyBwYW5lbCwgYWRkIGFwcHJvcHJpYXRlIGJ1dHRvbnMsIHRoZW4gbWFrZSBwcmV2aWV3IHBhbmVsIHZpc2libGVcbiAgICBhc3luYyB0b2dnbGVQcmV2aWV3KHBhcmVudElELCB0b2dnbGVPcHRpb25zLCB0b2dnbGVRdWVzdGlvblR5cGVzKSB7XG4gICAgICAgICQoXCIjdG9nZ2xlLWJ1dHRvbnNcIikuaHRtbChcIlwiKTtcbiAgICAgICAgdmFyIHBhcmVudERpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBhcmVudElEKTtcbiAgICAgICAgdmFyIHRvZ2dsZVF1ZXN0aW9uU2VsZWN0ID0gcGFyZW50RGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2VsZWN0XCIpWzBdO1xuICAgICAgICB2YXIgc2VsZWN0ZWRRdWVzdGlvbiA9XG4gICAgICAgICAgICB0b2dnbGVRdWVzdGlvblNlbGVjdC5vcHRpb25zW3RvZ2dsZVF1ZXN0aW9uU2VsZWN0LnNlbGVjdGVkSW5kZXhdXG4gICAgICAgICAgICAgICAgLnZhbHVlO1xuICAgICAgICB2YXIgaHRtbHNyYyA9IGF3YWl0IHRoaXMuZ2V0VG9nZ2xlU3JjKHNlbGVjdGVkUXVlc3Rpb24pO1xuICAgICAgICByZW5kZXJSdW5lc3RvbmVDb21wb25lbnQoaHRtbHNyYywgXCJ0b2dnbGUtcHJldmlld1wiLCB7XG4gICAgICAgICAgICBzZWxlY3Rvcl9pZDogXCJ0b2dnbGUtcHJldmlld1wiLFxuICAgICAgICAgICAgaXNfdG9nZ2xlOiB0aGlzLnRvZ2dsZU9wdGlvbnMsXG4gICAgICAgICAgICBpc19zZWxlY3Q6IHRydWUsXG4gICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gYWRkIFwiQ2xvc2UgUHJldmlld1wiIGJ1dHRvbiB0byB0aGUgcHJldmlldyBwYW5lbFxuICAgICAgICBsZXQgY2xvc2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAkKGNsb3NlQnV0dG9uKS50ZXh0KFwiQ2xvc2UgUHJldmlld1wiKTtcbiAgICAgICAgJChjbG9zZUJ1dHRvbikuYWRkQ2xhc3MoXCJidG4gYnRuLWRlZmF1bHRcIik7XG4gICAgICAgIGNsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQoXCIjdG9nZ2xlLXByZXZpZXdcIikuaHRtbChcIlwiKTtcbiAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblNlbGVjdC52YWx1ZSA9ICQoXCIjXCIgKyBwYXJlbnRJRCkuZGF0YShcbiAgICAgICAgICAgICAgICAgICAgXCJ0b2dnbGVfY3VycmVudFwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAkKFwiI2NvbXBvbmVudC1wcmV2aWV3XCIpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50OiBcImNsb3NlX3RvZ2dsZVwiLFxuICAgICAgICAgICAgICAgICAgICBhY3Q6IHRvZ2dsZVF1ZXN0aW9uU2VsZWN0LnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBkaXZfaWQ6IHRvZ2dsZVF1ZXN0aW9uU2VsZWN0LnBhcmVudEVsZW1lbnQuaWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICAgKTtcbiAgICAgICAgJChcIiN0b2dnbGUtYnV0dG9uc1wiKS5hcHBlbmQoY2xvc2VCdXR0b24pO1xuXG4gICAgICAgIC8vIGlmIFwibG9ja1wiIGlzIG5vdCBpbiB0b2dnbGUgb3B0aW9ucywgdGhlbiBhbGxvdyBhZGRpbmcgbW9yZSBidXR0b25zIHRvIHRoZSBwcmV2aWV3IHBhbmVsXG4gICAgICAgIGlmICghdG9nZ2xlT3B0aW9ucy5pbmNsdWRlcyhcImxvY2tcIikpIHtcbiAgICAgICAgICAgIGxldCBzZXRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgJChzZXRCdXR0b24pLnRleHQoXCJTZWxlY3QgdGhpcyBQcm9ibGVtXCIpO1xuICAgICAgICAgICAgJChzZXRCdXR0b24pLmFkZENsYXNzKFwiYnRuIGJ0bi1wcmltYXJ5XCIpO1xuICAgICAgICAgICAgJChzZXRCdXR0b24pLmNsaWNrKFxuICAgICAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy50b2dnbGVTZXQoXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRJRCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkUXVlc3Rpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sc3JjLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25UeXBlc1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAkKFwiI2NvbXBvbmVudC1wcmV2aWV3XCIpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IFwic2VsZWN0X3RvZ2dsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0OiBzZWxlY3RlZFF1ZXN0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGl2X2lkOiBwYXJlbnRJRCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgJChcIiN0b2dnbGUtYnV0dG9uc1wiKS5hcHBlbmQoc2V0QnV0dG9uKTtcblxuICAgICAgICAgICAgLy8gaWYgXCJ0cmFuc2ZlclwiIGluIHRvZ2dsZSBvcHRpb25zLCBhbmQgaWYgY3VycmVudCBxdWVzdGlvbiB0eXBlIGlzIFBhcnNvbnMgYW5kIHNlbGVjdGVkIHF1ZXN0aW9uIHR5cGUgaXMgYWN0aXZlIGNvZGUsIHRoZW4gYWRkIFwiVHJhbnNmZXJcIiBidXR0b24gdG8gcHJldmlldyBwYW5lbFxuICAgICAgICAgICAgaWYgKHRvZ2dsZU9wdGlvbnMuaW5jbHVkZXMoXCJ0cmFuc2ZlclwiKSkge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50VHlwZSA9ICQoXCIjXCIgKyBwYXJlbnRJRCkuZGF0YShcInRvZ2dsZV9jdXJyZW50X3R5cGVcIik7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkVHlwZSA9XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uVHlwZXNbdG9nZ2xlUXVlc3Rpb25TZWxlY3Quc2VsZWN0ZWRJbmRleF07XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VHlwZSA9PSBcIlBhcnNvbnMgTWl4ZWQtVXAgQ29kZVwiICYmXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkVHlwZSA9PSBcIkFjdGl2ZSBXcml0ZSBDb2RlXCJcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRyYW5zZmVyQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0cmFuc2ZlckJ1dHRvbikudGV4dChcIlRyYW5zZmVyIFJlc3BvbnNlXCIpO1xuICAgICAgICAgICAgICAgICAgICAkKHRyYW5zZmVyQnV0dG9uKS5hZGRDbGFzcyhcImJ0biBidG4tcHJpbWFyeVwiKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0cmFuc2ZlckJ1dHRvbikuY2xpY2soXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy50b2dnbGVUcmFuc2ZlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50SUQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkUXVlc3Rpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWxzcmMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uVHlwZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICQoXCIjdG9nZ2xlLWJ1dHRvbnNcIikuYXBwZW5kKHRyYW5zZmVyQnV0dG9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkKFwiI2NvbXBvbmVudC1wcmV2aWV3XCIpLnNob3coKTtcbiAgICB9XG5cbiAgICAvLyBvbiBjbGlja2luZyBcIlNlbGVjdCB0aGlzIFByb2JsZW1cIiBidXR0b24sIGNsb3NlIHByZXZpZXcgcGFuZWwsIHJlcGxhY2UgY3VycmVudCBxdWVzdGlvbiBpbiBhc3NpZ25tZW50cyBwYWdlIHdpdGggc2VsZWN0ZWQgcXVlc3Rpb24sIGFuZCBzZW5kIHJlcXVlc3QgdG8gdXBkYXRlIGdyYWRpbmcgZGF0YWJhc2VcbiAgICAvLyBfIGB0b2dnbGVTZXRgXG4gICAgYXN5bmMgdG9nZ2xlU2V0KHBhcmVudElELCBzZWxlY3RlZFF1ZXN0aW9uLCBodG1sc3JjLCB0b2dnbGVRdWVzdGlvblR5cGVzKSB7XG4gICAgICAgIHZhciBzZWxlY3RvcklkID0gcGFyZW50SUQgKyBcIi10b2dnbGVTZWxlY3RlZFF1ZXN0aW9uXCI7XG4gICAgICAgIHZhciB0b2dnbGVRdWVzdGlvblNlbGVjdCA9IGRvY3VtZW50XG4gICAgICAgICAgICAuZ2V0RWxlbWVudEJ5SWQocGFyZW50SUQpXG4gICAgICAgICAgICAuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzZWxlY3RcIilbMF07XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNlbGVjdG9ySWQpLmlubmVySFRNTCA9IFwiXCI7IC8vIG5lZWQgdG8gY2hlY2sgd2hldGhlciB0aGlzIGlzIGV2ZW4gbmVjZXNzYXJ5XG4gICAgICAgIGF3YWl0IHJlbmRlclJ1bmVzdG9uZUNvbXBvbmVudChodG1sc3JjLCBzZWxlY3RvcklkLCB7XG4gICAgICAgICAgICBzZWxlY3Rvcl9pZDogc2VsZWN0b3JJZCxcbiAgICAgICAgICAgIGlzX3RvZ2dsZTogdGhpcy50b2dnbGVPcHRpb25zLFxuICAgICAgICAgICAgaXNfc2VsZWN0OiB0cnVlLFxuICAgICAgICAgICAgdXNlUnVuZXN0b25lU2VydmljZXM6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2Fzc2Vzc21lbnQvc2V0X3NlbGVjdGVkX3F1ZXN0aW9uP21ldGFpZD0ke3BhcmVudElEfSZzZWxlY3RlZD0ke3NlbGVjdGVkUXVlc3Rpb259YCxcbiAgICAgICAgICAgIHt9XG4gICAgICAgICk7XG4gICAgICAgIGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgICAkKFwiI3RvZ2dsZS1wcmV2aWV3XCIpLmh0bWwoXCJcIik7XG4gICAgICAgICQoXCIjXCIgKyBwYXJlbnRJRCkuZGF0YShcInRvZ2dsZV9jdXJyZW50XCIsIHNlbGVjdGVkUXVlc3Rpb24pO1xuICAgICAgICAkKFwiI1wiICsgcGFyZW50SUQpLmRhdGEoXG4gICAgICAgICAgICBcInRvZ2dsZV9jdXJyZW50X3R5cGVcIixcbiAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uVHlwZXNbdG9nZ2xlUXVlc3Rpb25TZWxlY3Quc2VsZWN0ZWRJbmRleF1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBvbiBjbGlja2luZyBcIlRyYW5zZmVyXCIgYnV0dG9uLCBleHRyYWN0IHRoZSBjdXJyZW50IHRleHQgYW5kIGluZGVudGF0aW9uIG9mIHRoZSBQYXJzb25zIGJsb2NrcyBpbiB0aGUgYW5zd2VyIHNwYWNlLCB0aGVuIHBhc3RlIHRoYXQgaW50byB0aGUgc2VsZWN0ZWQgYWN0aXZlIGNvZGUgcXVlc3Rpb25cbiAgICBhc3luYyB0b2dnbGVUcmFuc2ZlcihcbiAgICAgICAgcGFyZW50SUQsXG4gICAgICAgIHNlbGVjdGVkUXVlc3Rpb24sXG4gICAgICAgIGh0bWxzcmMsXG4gICAgICAgIHRvZ2dsZVF1ZXN0aW9uVHlwZXNcbiAgICApIHtcbiAgICAgICAgLy8gcmV0cmlldmUgYWxsIFBhcnNvbnMgbGluZXMgd2l0aGluIHRoZSBhbnN3ZXIgc3BhY2UgYW5kIGxvb3AgdGhyb3VnaCB0aGlzIGxpc3RcbiAgICAgICAgdmFyIGN1cnJlbnRQYXJzb25zID0gZG9jdW1lbnRcbiAgICAgICAgICAgIC5nZXRFbGVtZW50QnlJZChwYXJlbnRJRCArIFwiLXRvZ2dsZVNlbGVjdGVkUXVlc3Rpb25cIilcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiZGl2W2NsYXNzXj0nYW5zd2VyJ11cIilbMF1cbiAgICAgICAgICAgIC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicHJldHR5cHJpbnQgbGFuZy1weVwiKTtcbiAgICAgICAgdmFyIGN1cnJlbnRQYXJzb25zQ2xhc3M7XG4gICAgICAgIHZhciBjdXJyZW50QmxvY2tJbmRlbnQ7XG4gICAgICAgIHZhciBpbmRlbnRDb3VudDtcbiAgICAgICAgdmFyIGluZGVudDtcbiAgICAgICAgdmFyIHBhcnNvbnNMaW5lO1xuICAgICAgICB2YXIgcGFyc29uc0xpbmVzID0gYGA7XG4gICAgICAgIHZhciBjb3VudDtcbiAgICAgICAgZm9yICh2YXIgcCA9IDA7IHAgPCBjdXJyZW50UGFyc29ucy5sZW5ndGg7IHArKykge1xuICAgICAgICAgICAgaW5kZW50Q291bnQgPSAwO1xuICAgICAgICAgICAgaW5kZW50ID0gXCJcIjtcbiAgICAgICAgICAgIC8vIGZvciBQYXJzb25zIGJsb2NrcyB0aGF0IGhhdmUgYnVpbHQtaW4gaW5kZW50YXRpb24gaW4gdGhlaXIgbGluZXNcbiAgICAgICAgICAgIGN1cnJlbnRQYXJzb25zQ2xhc3MgPSBjdXJyZW50UGFyc29uc1twXS5jbGFzc0xpc3RbMl07XG4gICAgICAgICAgICBpZiAoY3VycmVudFBhcnNvbnNDbGFzcykge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50UGFyc29uc0NsYXNzLmluY2x1ZGVzKFwiaW5kZW50XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGVudENvdW50ID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGluZGVudENvdW50KSArXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUludChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGFyc29uc0NsYXNzLnNsaWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGFyc29uc0NsYXNzLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZm9yIFBhcnNvbnMgYW5zd2VyIHNwYWNlcyB3aXRoIHZlcnRpY2FsIGxpbmVzIHRoYXQgYWxsb3cgc3R1ZGVudCB0byBkZWZpbmUgdGhlaXIgb3duIGxpbmUgaW5kZW50YXRpb25cbiAgICAgICAgICAgIGN1cnJlbnRCbG9ja0luZGVudCA9XG4gICAgICAgICAgICAgICAgY3VycmVudFBhcnNvbnNbcF0ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnN0eWxlLmxlZnQ7XG4gICAgICAgICAgICBpZiAoY3VycmVudEJsb2NrSW5kZW50KSB7XG4gICAgICAgICAgICAgICAgaW5kZW50Q291bnQgPVxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChpbmRlbnRDb3VudCkgK1xuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRCbG9ja0luZGVudC5zbGljZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRCbG9ja0luZGVudC5pbmRleE9mKFwicHhcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICkgLyAzMFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBpbmRlbnRDb3VudDsgZCsrKSB7XG4gICAgICAgICAgICAgICAgaW5kZW50ICs9IFwiICAgIFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcmV0cmlldmUgZWFjaCB0ZXh0IHNuaXBwZXQgb2YgZWFjaCBQYXJzb25zIGxpbmUgYW5kIGxvb3AgdGhyb3VnaCB0aGlzIGxpc3RcbiAgICAgICAgICAgIHBhcnNvbnNMaW5lID0gY3VycmVudFBhcnNvbnNbcF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzcGFuXCIpO1xuICAgICAgICAgICAgY291bnQgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgbCA9IDA7IGwgPCBwYXJzb25zTGluZS5sZW5ndGg7IGwrKykge1xuICAgICAgICAgICAgICAgIGlmIChwYXJzb25zTGluZVtsXS5jaGlsZE5vZGVzWzBdLm5vZGVOYW1lID09IFwiI3RleHRcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBQYXJzb25zIGJsb2NrcyBoYXZlIGRpZmZlcmluZyBhbW91bnRzIG9mIGhpZXJhcmNoeSBsZXZlbHMgKHNwYW5zIHdpdGhpbiBzcGFucylcbiAgICAgICAgICAgICAgICAgICAgaWYgKHAgPT0gMCAmJiBjb3VudCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBuZWVkIGRpZmZlcmVudCBjaGVjayB0aGFuIGwgPT0gMCBiZWNhdXNlIHRoZSBsIG51bWJlcmluZyBkb2Vzbid0IGFsaWduIHdpdGggbG9jYXRpb24gd2l0aGluIGxpbmUgZHVlIHRvIGluY29uc2lzdGVudCBzcGFuIGhlaXJhcmNoeVxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc29uc0xpbmVzICs9IGluZGVudCArIHBhcnNvbnNMaW5lW2xdLmlubmVySFRNTDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY291bnQgIT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc29uc0xpbmVzICs9IHBhcnNvbnNMaW5lW2xdLmlubmVySFRNTDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzb25zTGluZXMgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNvbnNMaW5lcyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGVudCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc29uc0xpbmVbbF0uaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc29uc0xpbmVzID0gcGFyc29uc0xpbmVzLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVwbGFjZSBhbGwgZXhpc3RpbmcgY29kZSB3aXRoaW4gc2VsZWN0ZWQgYWN0aXZlIGNvZGUgcXVlc3Rpb24gd2l0aCBleHRyYWN0ZWQgUGFyc29ucyB0ZXh0XG4gICAgICAgIHZhciBodG1sc3JjRm9ybWVyID0gaHRtbHNyYy5zbGljZShcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICBodG1sc3JjLmluZGV4T2YoXCI8dGV4dGFyZWFcIikgK1xuICAgICAgICAgICAgICAgIGh0bWxzcmMuc3BsaXQoXCI8dGV4dGFyZWFcIilbMV0uaW5kZXhPZihcIj5cIikgK1xuICAgICAgICAgICAgICAgIDEwXG4gICAgICAgICk7XG4gICAgICAgIHZhciBodG1sc3JjTGF0dGVyID0gaHRtbHNyYy5zbGljZShcbiAgICAgICAgICAgIGh0bWxzcmMuaW5kZXhPZihcIjwvdGV4dGFyZWE+XCIpLFxuICAgICAgICAgICAgaHRtbHNyYy5sZW5ndGhcbiAgICAgICAgKTtcbiAgICAgICAgaHRtbHNyYyA9IGh0bWxzcmNGb3JtZXIgKyBwYXJzb25zTGluZXMgKyBodG1sc3JjTGF0dGVyO1xuXG4gICAgICAgIGF3YWl0IHRoaXMudG9nZ2xlU2V0KFxuICAgICAgICAgICAgcGFyZW50SUQsXG4gICAgICAgICAgICBzZWxlY3RlZFF1ZXN0aW9uLFxuICAgICAgICAgICAgaHRtbHNyYyxcbiAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uVHlwZXNcbiAgICAgICAgKTtcbiAgICAgICAgJChcIiNjb21wb25lbnQtcHJldmlld1wiKS5oaWRlKCk7XG4gICAgfVxufVxuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxuXG53aW5kb3cuY29tcG9uZW50X2ZhY3Rvcnkuc2VsZWN0cXVlc3Rpb24gPSBmdW5jdGlvbiAob3B0cykge1xuICAgIHJldHVybiBuZXcgU2VsZWN0T25lKG9wdHMpO1xufTtcblxuLypcbiAqIFdoZW4gdGhlIHBhZ2UgaXMgbG9hZGVkIGFuZCB0aGUgbG9naW4gY2hlY2tzIGFyZSBjb21wbGV0ZSBmaW5kIGFuZCByZW5kZXJcbiAqIGVhY2ggc2VsZWN0cXVlc3Rpb24gY29tcG9uZW50IHRoYXQgaXMgbm90IHBhcnQgb2YgYSB0aW1lZEFzc2Vzc21lbnQuXG4gKiovXG4kKGRvY3VtZW50KS5vbihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHNlbFF1ZXN0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgIFwiW2RhdGEtY29tcG9uZW50PXNlbGVjdHF1ZXN0aW9uXVwiXG4gICAgKTtcbiAgICBmb3IgKGxldCBjcSBvZiBzZWxRdWVzdGlvbnMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICgkKGNxKS5jbG9zZXN0KFwiW2RhdGEtY29tcG9uZW50PXRpbWVkQXNzZXNzbWVudF1cIikubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGlzIGVsZW1lbnQgZXhpc3RzIHdpdGhpbiBhIHRpbWVkIGNvbXBvbmVudCwgZG9uJ3QgcmVuZGVyIGl0IGhlcmVcbiAgICAgICAgICAgICAgICBsZXQgdG1wID0gbmV3IFNlbGVjdE9uZSh7IG9yaWc6IGNxIH0pO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRtcC5pbml0aWFsaXplKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHJlbmRlcmluZyBOZXcgRXhlcmNpc2UgJHtjcS5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICBEZXRhaWxzOiAke2Vycn1gKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVyci5zdGFjayk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==