"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_mchoice_js_timedmc_js"],{

/***/ 25264:
/*!*******************************************!*\
  !*** ./runestone/mchoice/css/mchoice.css ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 77147:
/*!*****************************************!*\
  !*** ./runestone/mchoice/js/mchoice.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MultipleChoice)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 2568);
/* harmony import */ var _css_mchoice_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/mchoice.css */ 25264);
/*==========================================
========      Master mchoice.js     =========
============================================
===  This file contains the JS for the   ===
=== Runestone multiple choice component. ===
============================================
===              Created By              ===
===           Isaiah Mayerchak           ===
===                 and                  ===
===             Kirby Olson              ===
===                6/4/15                ===
==========================================*/


//import "./../styles/runestone-custom-sphinx-bootstrap.css";


window.mcList = {}; // Multiple Choice dictionary

// MC constructor
class MultipleChoice extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        opts = opts || {};
        var orig = opts.orig; // entire <ul> element
        this.origElem = orig;
        this.useRunestoneServices = opts.useRunestoneServices;
        this.multipleanswers = false;
        this.divid = orig.id;
        if ($(this.origElem).data("multipleanswers") === true) {
            this.multipleanswers = true;
        }
        this.children = this.origElem.childNodes;
        this.random = false;
        if ($(this.origElem).is("[data-random]")) {
            this.random = true;
        }
        this.correct = null;
        this.answerList = [];
        this.correctList = [];
        this.correctIndexList = [];
        this.feedbackList = [];
        this.question = null;
        this.caption = "Multiple Choice";
        this.findAnswers();
        this.findQuestion();
        this.findFeedbacks();
        this.createCorrectList();
        this.createMCForm();
        this.addCaption("runestone");
        this.checkServer("mChoice", true);
        // https://docs.mathjax.org/en/latest/options/startup/startup.html
        // https://docs.mathjax.org/en/latest/web/configuration.html#startup-action
        // runestoneMathReady is defined in the preamble for all PTX authored books
        this.queueMathJax(this.containerDiv);
        if (typeof Prism !== "undefined") {
            Prism.highlightAllUnder(this.containerDiv);
        }
    }

    /*====================================
    ==== Functions parsing variables  ====
    ====  out of intermediate HTML    ====
    ====================================*/
    findQuestion() {
        var delimiter;
        for (var i = 0; i < this.origElem.childNodes.length; i++) {
            if (this.origElem.childNodes[i].nodeName === "LI") {
                delimiter = this.origElem.childNodes[i].outerHTML;
                break;
            }
        }
        var fulltext = $(this.origElem).html();
        var temp = fulltext.split(delimiter);
        this.question = temp[0];
    }

    findAnswers() {
        // Creates answer objects and pushes them to answerList
        // format: ID, Correct bool, Content (text)
        var ChildAnswerList = [];
        for (var i = 0; i < this.children.length; i++) {
            if ($(this.children[i]).is("[data-component=answer]")) {
                ChildAnswerList.push(this.children[i]);
            }
        }
        for (var j = 0; j < ChildAnswerList.length; j++) {
            var answer_id = $(ChildAnswerList[j]).attr("id");
            var is_correct = false;
            if ($(ChildAnswerList[j]).is("[data-correct]")) {
                // If data-correct attribute exists, answer is correct
                is_correct = true;
            }
            var answer_text = $(ChildAnswerList[j]).html();
            var answer_object = {
                id: answer_id,
                correct: is_correct,
                content: answer_text,
            };
            this.answerList.push(answer_object);
        }
    }

    findFeedbacks() {
        for (var i = 0; i < this.children.length; i++) {
            if ($(this.children[i]).is("[data-component=feedback]")) {
                this.feedbackList.push(this.children[i].innerHTML);
            }
        }
    }

    createCorrectList() {
        // Creates array that holds the ID"s of correct answers
        // Also populates an array that holds the indeces of correct answers
        for (var i = 0; i < this.answerList.length; i++) {
            if (this.answerList[i].correct) {
                this.correctList.push(this.answerList[i].id);
                this.correctIndexList.push(i);
            }
        }
    }

    /*===========================================
    ====   Functions generating final HTML   ====
    ===========================================*/
    createMCForm() {
        this.renderMCContainer();
        this.renderMCForm(); // renders the form with options and buttons
        this.renderMCfeedbackDiv();
        // replaces intermediate HTML with rendered HTML
        $(this.origElem).replaceWith(this.containerDiv);
    }

    renderMCContainer() {
        this.containerDiv = document.createElement("div");
        $(this.containerDiv).html(this.question);
        $(this.containerDiv).addClass(this.origElem.getAttribute("class"));
        this.containerDiv.id = this.divid;
    }

    renderMCForm() {
        this.optsForm = document.createElement("form");
        this.optsForm.id = this.divid + "_form";
        $(this.optsForm).attr({
            method: "get",
            action: "",
            onsubmit: "return false;",
        });
        // generate form options
        this.renderMCFormOpts();
        this.renderMCFormButtons();
        // Append the form to the container
        this.containerDiv.appendChild(this.optsForm);
    }

    renderMCFormOpts() {
        // creates input DOM elements
        this.optionArray = []; // array with an object for each option containing the input and label for that option
        var input_type = "radio";
        if (this.multipleanswers) {
            input_type = "checkbox";
        }
        // this.indexArray is used to index through the answers
        // it is just 0-n normally, but the order is shuffled if the random option is present
        this.indexArray = [];
        for (var i = 0; i < this.answerList.length; i++) {
            this.indexArray.push(i);
        }
        if (this.random) {
            this.randomizeAnswers();
        }
        let self = this;
        let answerFunc = function () {
            self.isAnswered = true;
        };
        for (var j = 0; j < this.answerList.length; j++) {
            var k = this.indexArray[j];
            var optid = this.divid + "_opt_" + k;
            // Create the label for the input
            var label = document.createElement("label");
            // If the content begins with a ``<p>``, put the label inside of it. (Sphinx 2.0 puts all content in a ``<p>``, while Sphinx 1.8 doesn't).
            var content = this.answerList[k].content;
            var prefix = "";
            if (content.startsWith("<p>")) {
                prefix = "<p>";
                content = content.slice(3);
            }
            $(label).html(
                `${prefix}<input type="${input_type}" name="group1" value=${k} id=${optid}>${String.fromCharCode(
                    "A".charCodeAt(0) + j
                )}. ${content}`
            );
            // create the object to store in optionArray
            var optObj = {
                input: $(label).find("input")[0],
                label: label,
            };
            optObj.input.onclick = answerFunc;

            this.optionArray.push(optObj);
            // add the option to the form
            this.optsForm.appendChild(label);
            this.optsForm.appendChild(document.createElement("br"));
        }
    }

    renderMCFormButtons() {
        // submit and compare me buttons
        // Create submit button
        this.submitButton = document.createElement("button");
        this.submitButton.textContent = "Check Me";
        $(this.submitButton).attr({
            class: "btn btn-success",
            name: "do answer",
            type: "button",
        });
        if (this.multipleanswers) {
            this.submitButton.addEventListener(
                "click",
                function () {
                    this.processMCMASubmission(true);
                }.bind(this),
                false
            );
        } else {
            this.submitButton.addEventListener(
                "click",
                function (ev) {
                    ev.preventDefault();
                    this.processMCMFSubmission(true);
                }.bind(this),
                false
            );
        } // end else
        this.optsForm.appendChild(this.submitButton);
        // Create compare button
        if (this.useRunestoneServices && !eBookConfig.peer) {
            this.compareButton = document.createElement("button");
            $(this.compareButton).attr({
                class: "btn btn-default",
                id: this.divid + "_bcomp",
                disabled: "",
                name: "compare",
            });
            this.compareButton.textContent = "Compare me";
            this.compareButton.addEventListener(
                "click",
                function () {
                    this.compareAnswers(this.divid);
                }.bind(this),
                false
            );
            this.optsForm.appendChild(this.compareButton);
        }
    }

    renderMCfeedbackDiv() {
        this.feedBackDiv = document.createElement("div");
        this.feedBackDiv.id = this.divid + "_feedback";
        this.containerDiv.appendChild(document.createElement("br"));
        this.containerDiv.appendChild(this.feedBackDiv);
    }

    randomizeAnswers() {
        // Makes the ordering of the answer choices random
        var currentIndex = this.indexArray.length,
            temporaryValue,
            randomIndex;
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = this.indexArray[currentIndex];
            this.indexArray[currentIndex] = this.indexArray[randomIndex];
            this.indexArray[randomIndex] = temporaryValue;
            var temporaryFeedback = this.feedbackList[currentIndex];
            this.feedbackList[currentIndex] = this.feedbackList[randomIndex];
            this.feedbackList[randomIndex] = temporaryFeedback;
        }
    }

    /*===================================
    === Checking/loading from storage ===
    ===================================*/
    restoreAnswers(data) {
        // Restore answers from storage retrieval done in RunestoneBase
        // sometimes data.answer can be null
        if (!data.answer) {
            data.answer = "";
        }
        var answers = data.answer.split(",");
        for (var a = 0; a < answers.length; a++) {
            var index = answers[a];
            for (var b = 0; b < this.optionArray.length; b++) {
                if (this.optionArray[b].input.value == index) {
                    $(this.optionArray[b].input).attr("checked", "true");
                }
            }
        }
        if (this.multipleanswers) {
            this.processMCMASubmission(false);
        } else {
            this.processMCMFSubmission(false);
        }
    }

    checkLocalStorage() {
        // Repopulates MCMA questions with a user's previous answers,
        // which were stored into local storage.
        var storedData;
        var answers;
        if (this.graderactive) {
            return;
        }
        var len = localStorage.length;
        if (len > 0) {
            var ex = localStorage.getItem(this.localStorageKey());
            if (ex !== null) {
                try {
                    storedData = JSON.parse(ex);
                    answers = storedData.answer.split(",");
                } catch (err) {
                    // error while parsing; likely due to bad value stored in storage
                    console.log(err.message);
                    localStorage.removeItem(this.localStorageKey());
                    return;
                }
                for (var a = 0; a < answers.length; a++) {
                    var index = answers[a];
                    for (var b = 0; b < this.optionArray.length; b++) {
                        if (this.optionArray[b].input.value == index) {
                            $(this.optionArray[b].input).attr(
                                "checked",
                                "true"
                            );
                        }
                    }
                }
                if (this.useRunestoneServices) {
                    this.enableMCComparison();
                    this.getSubmittedOpts(); // to populate givenlog for logging
                    if (this.multipleanswers) {
                        this.logMCMAsubmission();
                    } else {
                        this.logMCMFsubmission();
                    }
                }
            }
        }
    }

    setLocalStorage(data) {
        var timeStamp = new Date();
        var storageObj = {
            answer: data.answer,
            timestamp: timeStamp,
            correct: data.correct,
        };
        localStorage.setItem(
            this.localStorageKey(),
            JSON.stringify(storageObj)
        );
    }

    /*===============================
    === Processing MC Submissions ===
    ===============================*/
    processMCMASubmission(logFlag) {
        // Called when the submit button is clicked
        this.getSubmittedOpts(); // make sure this.givenArray is populated
        this.scoreMCMASubmission();
        this.setLocalStorage({
            correct: this.correct ? "T" : "F",
            answer: this.givenArray.join(","),
        });
        if (logFlag) {
            this.logMCMAsubmission();
        }
        if (!eBookConfig.peer || eBookConfig.isInstructor) {
            this.renderMCMAFeedBack();
            if (this.useRunestoneServices) {
                this.enableMCComparison();
            }
        } else {
            // acknowledge submission
            $(this.feedBackDiv).html("<p>Your Answer has been recorded</p>");
            $(this.feedBackDiv).attr("class", "alert alert-info");
        }
    }

    getSubmittedOpts() {
        var given;
        this.singlefeedback = ""; // Used for MCMF questions
        this.feedbackString = ""; // Used for MCMA questions
        this.givenArray = [];
        this.givenlog = "";
        var buttonObjs = this.optsForm.elements.group1;
        for (var i = 0; i < buttonObjs.length; i++) {
            if (buttonObjs[i].checked) {
                given = buttonObjs[i].value;
                this.givenArray.push(given);
                this.feedbackString += `<li value="${i + 1}">${
                    this.feedbackList[i]
                }</li>`;
                this.givenlog += given + ",";
                this.singlefeedback = this.feedbackList[i];
            }
        }
        this.givenArray.sort();
    }

    checkCurrentAnswer() {
        this.getSubmittedOpts();
        if (this.multipleanswers) {
            this.scoreMCMASubmission();
        } else {
            this.scoreMCMFSubmission();
        }
    }

    async logCurrentAnswer(sid) {
        if (this.multipleanswers) {
            await this.logMCMAsubmission(sid);
        } else {
            await this.logMCMFsubmission(sid);
        }
    }

    renderFeedback() {
        if (this.multipleanswers) {
            this.renderMCMAFeedBack();
        } else {
            this.renderMCMFFeedback();
        }
    }
    scoreMCMASubmission() {
        this.correctCount = 0;
        var correctIndex = 0;
        var givenIndex = 0;
        while (
            correctIndex < this.correctIndexList.length &&
            givenIndex < this.givenArray.length
        ) {
            if (
                this.givenArray[givenIndex] <
                this.correctIndexList[correctIndex]
            ) {
                givenIndex++;
            } else if (
                this.givenArray[givenIndex] ==
                this.correctIndexList[correctIndex]
            ) {
                this.correctCount++;
                givenIndex++;
                correctIndex++;
            } else {
                correctIndex++;
            }
        }
        var numGiven = this.givenArray.length;
        var numCorrect = this.correctCount;
        var numNeeded = this.correctList.length;
        this.answer = this.givenArray.join(",");
        this.correct = numCorrect === numNeeded && numNeeded === numGiven;
        if (numGiven === numNeeded) {
            this.percent = numCorrect / numNeeded;
        } else {
            this.percent = numCorrect / Math.max(numGiven, numNeeded);
        }
    }

    async logMCMAsubmission(sid) {
        var answer = this.answer || "";
        var correct = this.correct || "F";
        var logAnswer =
            "answer:" + answer + ":" + (correct == "T" ? "correct" : "no");
        let data = {
            event: "mChoice",
            act: logAnswer,
            answer: answer,
            correct: correct,
            div_id: this.divid,
        };
        if (eBookConfig.peer && typeof studentVoteCount !== "undefined") {
            data.act = data.act + `:vote${studentVoteCount}`;
        }
        if (typeof sid !== "undefined") {
            data.sid = sid;
        }
        await this.logBookEvent(data);
    }

    renderMCMAFeedBack() {
        var answerStr = "answers";
        var numGiven = this.givenArray.length;
        if (numGiven === 1) {
            answerStr = "answer";
        }
        var numCorrect = this.correctCount;
        var numNeeded = this.correctList.length;
        var feedbackText = this.feedbackString;
        if (this.correct) {
            $(this.feedBackDiv).html(`✔️ <ol type="A">${feedbackText}</ul>`);
            $(this.feedBackDiv).attr("class", "alert alert-info");
        } else {
            $(this.feedBackDiv).html(
                `✖️ You gave ${numGiven} ${answerStr} and got ${numCorrect} correct of ${numNeeded} needed.<ol type="A">${feedbackText}</ul>`
            );
            $(this.feedBackDiv).attr("class", "alert alert-danger");
        }
    }

    processMCMFSubmission(logFlag) {
        // Called when the submit button is clicked
        this.getSubmittedOpts(); // make sure this.givenArray is populated
        this.scoreMCMFSubmission();
        this.setLocalStorage({
            correct: this.correct ? "T" : "F",
            answer: this.givenArray.join(","),
        });
        if (logFlag) {
            this.logMCMFsubmission();
        }
        if (!eBookConfig.peer || eBookConfig.isInstructor) {
            this.renderMCMFFeedback();
            if (this.useRunestoneServices) {
                this.enableMCComparison();
            }
        } else {
            // acknowledge submission
            $(this.feedBackDiv).html("<p>Your Answer has been recorded</p>");
            $(this.feedBackDiv).attr("class", "alert alert-info");
        }
    }

    scoreMCMFSubmission() {
        this.answer = this.givenArray[0];
        if (this.givenArray[0] == this.correctIndexList[0]) {
            this.correct = true;
            this.percent = 1.0;
        } else if (this.givenArray[0] != null) {
            // if given is null then the question wasn"t answered and should be counted as skipped
            this.correct = false;
            this.percent = 0.0;
        }
    }

    async logMCMFsubmission(sid) {
        // If there's no answer provided (the array is empty), use a blank for the answer.
        var answer = this.givenArray[0] || "";
        var correct =
            this.givenArray[0] == this.correctIndexList[0] ? "T" : "F";
        var logAnswer =
            "answer:" + answer + ":" + (correct == "T" ? "correct" : "no"); // backward compatible
        let data = {
            event: "mChoice",
            act: logAnswer,
            answer: answer,
            correct: correct,
            div_id: this.divid,
        };
        if (eBookConfig.peer && typeof studentVoteCount !== "undefined") {
            data.act = data.act + `:vote${studentVoteCount}`;
        }
        if (typeof sid !== "undefined") {
            data.sid = sid;
        }
        await this.logBookEvent(data);
    }

    renderMCMFFeedback() {
        let correct = this.givenArray[0] == this.correctIndexList[0];
        let feedbackText = this.singlefeedback;

        if (correct) {
            $(this.feedBackDiv).html("✔️ " + feedbackText);
            $(this.feedBackDiv).attr("class", "alert alert-info"); // use blue for better red/green blue color blindness
        } else {
            if (feedbackText == null) {
                feedbackText = "";
            }
            $(this.feedBackDiv).html("✖️ " + feedbackText);
            $(this.feedBackDiv).attr("class", "alert alert-danger");
        }
    }
    enableMCComparison() {
        if (eBookConfig.enableCompareMe) {
            this.compareButton.disabled = false;
        }
    }
    instructorMchoiceModal(data) {
        // data.reslist -- student and their answers
        // data.answerDict    -- answers and count
        // data.correct - correct answer
        var res = "<table><tr><th>Student</th><th>Answer(s)</th></tr>";
        for (var i in data) {
            res +=
                "<tr><td>" +
                data[i][0] +
                "</td><td>" +
                data[i][1] +
                "</td></tr>";
        }
        res += "</table>";
        return res;
    }
    compareModal(data, status, whatever) {
        var datadict = data.detail;
        var answers = datadict.answerDict;
        var misc = datadict.misc;
        var kl = Object.keys(answers).sort();
        var body = "<table>";
        body += "<tr><th>Answer</th><th>Percent</th></tr>";
        var theClass = "";
        for (var k in kl) {
            if (kl[k] === misc.correct) {
                theClass = "success";
            } else {
                theClass = "info";
            }
            body +=
                "<tr><td>" + kl[k] + "</td><td class='compare-me-progress'>";
            var pct = answers[kl[k]] + "%";
            body += "<div class='progress'>";
            body +=
                "    <div class='progress-bar progress-bar-" +
                theClass +
                "' style='width:" +
                pct +
                ";'>" +
                pct;
            body += "    </div>";
            body += "</div></td></tr>";
        }
        body += "</table>";
        if (misc.yourpct !== "unavailable") {
            body +=
                "<br /><p>You have " +
                misc.yourpct +
                "% correct for all questions</p>";
        }
        if (datadict.reslist !== undefined) {
            body += this.instructorMchoiceModal(datadict.reslist);
        }
        var html =
            "<div class='modal fade'>" +
            "    <div class='modal-dialog compare-modal'>" +
            "        <div class='modal-content'>" +
            "            <div class='modal-header'>" +
            "                <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>" +
            "                <h4 class='modal-title'>Distribution of Answers</h4>" +
            "            </div>" +
            "            <div class='modal-body'>" +
            body +
            "            </div>" +
            "        </div>" +
            "    </div>" +
            "</div>";
        var el = $(html);
        el.modal();
    }
    // _`compareAnswers`
    compareAnswers() {
        var data = {};
        data.div_id = this.divid;
        data.course_name = eBookConfig.course;
        jQuery.get(
            `${eBookConfig.new_server_prefix}/assessment/getaggregateresults`,
            data,
            this.compareModal.bind(this)
        );
    }

    disableInteraction() {
        for (var i = 0; i < this.optionArray.length; i++) {
            this.optionArray[i].input.disabled = true;
        }
    }

    enableInteraction() {
        for (var i = 0; i < this.optionArray.length; i++) {
            this.optionArray[i].input.disabled = false;
        }
    }
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/
$(document).on("runestone:login-complete", function () {
    $("[data-component=multiplechoice]").each(function (index) {
        // MC
        var opts = {
            orig: this,
            useRunestoneServices: eBookConfig.useRunestoneServices,
        };
        if ($(this).closest("[data-component=timedAssessment]").length == 0) {
            // If this element exists within a timed component, don't render it here
            window.mcList[this.id] = new MultipleChoice(opts);
        }
    });
});


/***/ }),

/***/ 95983:
/*!*****************************************!*\
  !*** ./runestone/mchoice/js/timedmc.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimedMC)
/* harmony export */ });
/* harmony import */ var _mchoice_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mchoice.js */ 77147);


class TimedMC extends _mchoice_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        $(this.containerDiv).addClass("runestone");
        this.needsReinitialization = true;
        this.renderTimedIcon(this.MCContainer);
        this.hideButtons(); // Don't show per-question buttons in a timed assessment
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
    hideButtons() {
        //Just hiding the buttons doesn't prevent submitting the form when entering is clicked
        //We need to completely disable the buttons
        $(this.submitButton).attr("disabled", "true");
        $(this.submitButton).hide();
        $(this.compareButton).hide();
    }

    // These methods override the methods in the base class. Called from renderFeedback()
    //
    renderMCMAFeedBack() {
        this.feedbackTimedMC();
    }
    renderMCMFFeedback(whatever, whateverr) {
        this.feedbackTimedMC();
    }
    feedbackTimedMC() {
        for (var i = 0; i < this.indexArray.length; i++) {
            var tmpindex = this.indexArray[i];
            $(this.feedBackEachArray[i]).html(
                String.fromCharCode(65 + i) + ". " + this.feedbackList[i]
            );
            var tmpid = this.answerList[tmpindex].id;
            if (this.correctList.indexOf(tmpid) >= 0) {
                this.feedBackEachArray[i].classList.add(
                    "alert",
                    "alert-success"
                );
            } else {
                this.feedBackEachArray[i].classList.add(
                    "alert",
                    "alert-danger"
                );
            }
        }
    }
    renderMCFormOpts() {
        super.renderMCFormOpts();
        this.feedBackEachArray = [];
        for (var j = 0; j < this.answerList.length; j++) {
            var k = this.indexArray[j];
            var feedBackEach = document.createElement("div");
            feedBackEach.id = this.divid + "_eachFeedback_" + k;
            feedBackEach.classList.add("eachFeedback");
            this.feedBackEachArray.push(feedBackEach);
            this.optsForm.appendChild(feedBackEach);
        }
    }
    checkCorrectTimedMCMA() {
        if (
            this.correctCount === this.correctList.length &&
            this.correctList.length === this.givenArray.length
        ) {
            this.correct = true;
        } else if (this.givenArray.length !== 0) {
            this.correct = false;
        } else {
            // question was skipped
            this.correct = null;
        }
        switch (this.correct) {
            case true:
                return "T";
            case false:
                return "F";
            default:
                return null;
        }
    }
    checkCorrectTimedMCMF() {
        // Returns if the question was correct, incorrect, or skipped (return null in the last case)
        switch (this.correct) {
            case true:
                return "T";
            case false:
                return "F";
            default:
                return null;
        }
    }
    checkCorrectTimed() {
        if (this.multipleanswers) {
            return this.checkCorrectTimedMCMA();
        } else {
            return this.checkCorrectTimedMCMF();
        }
    }
    hideFeedback() {
        for (var i = 0; i < this.feedBackEachArray.length; i++) {
            $(this.feedBackEachArray[i]).hide();
        }
    }

    reinitializeListeners() {
        let self = this;
        let answerFunc = function () {
            self.isAnswered = true;
        };
        for (let opt of this.optionArray) {
            opt.input.onclick = answerFunc;
        }
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.multiplechoice = function (opts) {
    if (opts.timed) {
        return new TimedMC(opts);
    } else {
        return new _mchoice_js__WEBPACK_IMPORTED_MODULE_0__["default"](opts);
    }
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX21jaG9pY2VfanNfdGltZWRtY19qcy5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFNkQ7QUFDN0Q7QUFDNEI7O0FBRTVCLG9CQUFvQjs7QUFFcEI7QUFDZSw2QkFBNkIsbUVBQWE7QUFDekQ7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixxQ0FBcUM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDBCQUEwQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw0QkFBNEI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0JBQXdCLDBCQUEwQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw0QkFBNEI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw0QkFBNEI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLG1DQUFtQztBQUMzRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTixtQkFBbUIsbURBQWM7QUFDakM7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvbWNob2ljZS9jc3MvbWNob2ljZS5jc3M/M2ZmMSIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL21jaG9pY2UvanMvbWNob2ljZS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL21jaG9pY2UvanMvdGltZWRtYy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gICAgICBNYXN0ZXIgbWNob2ljZS5qcyAgICAgPT09PT09PT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09ICBUaGlzIGZpbGUgY29udGFpbnMgdGhlIEpTIGZvciB0aGUgICA9PT1cbj09PSBSdW5lc3RvbmUgbXVsdGlwbGUgY2hvaWNlIGNvbXBvbmVudC4gPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09ICAgICAgICAgICAgICBDcmVhdGVkIEJ5ICAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgSXNhaWFoIE1heWVyY2hhayAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgICAgICAgIGFuZCAgICAgICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgIEtpcmJ5IE9sc29uICAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgICA2LzQvMTUgICAgICAgICAgICAgICAgPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanNcIjtcbi8vaW1wb3J0IFwiLi8uLi9zdHlsZXMvcnVuZXN0b25lLWN1c3RvbS1zcGhpbngtYm9vdHN0cmFwLmNzc1wiO1xuaW1wb3J0IFwiLi4vY3NzL21jaG9pY2UuY3NzXCI7XG5cbndpbmRvdy5tY0xpc3QgPSB7fTsgLy8gTXVsdGlwbGUgQ2hvaWNlIGRpY3Rpb25hcnlcblxuLy8gTUMgY29uc3RydWN0b3JcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11bHRpcGxlQ2hvaWNlIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgb3B0cyA9IG9wdHMgfHwge307XG4gICAgICAgIHZhciBvcmlnID0gb3B0cy5vcmlnOyAvLyBlbnRpcmUgPHVsPiBlbGVtZW50XG4gICAgICAgIHRoaXMub3JpZ0VsZW0gPSBvcmlnO1xuICAgICAgICB0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzID0gb3B0cy51c2VSdW5lc3RvbmVTZXJ2aWNlcztcbiAgICAgICAgdGhpcy5tdWx0aXBsZWFuc3dlcnMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kaXZpZCA9IG9yaWcuaWQ7XG4gICAgICAgIGlmICgkKHRoaXMub3JpZ0VsZW0pLmRhdGEoXCJtdWx0aXBsZWFuc3dlcnNcIikgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGlwbGVhbnN3ZXJzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gdGhpcy5vcmlnRWxlbS5jaGlsZE5vZGVzO1xuICAgICAgICB0aGlzLnJhbmRvbSA9IGZhbHNlO1xuICAgICAgICBpZiAoJCh0aGlzLm9yaWdFbGVtKS5pcyhcIltkYXRhLXJhbmRvbV1cIikpIHtcbiAgICAgICAgICAgIHRoaXMucmFuZG9tID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvcnJlY3QgPSBudWxsO1xuICAgICAgICB0aGlzLmFuc3dlckxpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5jb3JyZWN0TGlzdCA9IFtdO1xuICAgICAgICB0aGlzLmNvcnJlY3RJbmRleExpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5mZWVkYmFja0xpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuY2FwdGlvbiA9IFwiTXVsdGlwbGUgQ2hvaWNlXCI7XG4gICAgICAgIHRoaXMuZmluZEFuc3dlcnMoKTtcbiAgICAgICAgdGhpcy5maW5kUXVlc3Rpb24oKTtcbiAgICAgICAgdGhpcy5maW5kRmVlZGJhY2tzKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlQ29ycmVjdExpc3QoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVNQ0Zvcm0oKTtcbiAgICAgICAgdGhpcy5hZGRDYXB0aW9uKFwicnVuZXN0b25lXCIpO1xuICAgICAgICB0aGlzLmNoZWNrU2VydmVyKFwibUNob2ljZVwiLCB0cnVlKTtcbiAgICAgICAgLy8gaHR0cHM6Ly9kb2NzLm1hdGhqYXgub3JnL2VuL2xhdGVzdC9vcHRpb25zL3N0YXJ0dXAvc3RhcnR1cC5odG1sXG4gICAgICAgIC8vIGh0dHBzOi8vZG9jcy5tYXRoamF4Lm9yZy9lbi9sYXRlc3Qvd2ViL2NvbmZpZ3VyYXRpb24uaHRtbCNzdGFydHVwLWFjdGlvblxuICAgICAgICAvLyBydW5lc3RvbmVNYXRoUmVhZHkgaXMgZGVmaW5lZCBpbiB0aGUgcHJlYW1ibGUgZm9yIGFsbCBQVFggYXV0aG9yZWQgYm9va3NcbiAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5jb250YWluZXJEaXYpO1xuICAgICAgICBpZiAodHlwZW9mIFByaXNtICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBQcmlzbS5oaWdobGlnaHRBbGxVbmRlcih0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gRnVuY3Rpb25zIHBhcnNpbmcgdmFyaWFibGVzICA9PT09XG4gICAgPT09PSAgb3V0IG9mIGludGVybWVkaWF0ZSBIVE1MICAgID09PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIGZpbmRRdWVzdGlvbigpIHtcbiAgICAgICAgdmFyIGRlbGltaXRlcjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9yaWdFbGVtLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9yaWdFbGVtLmNoaWxkTm9kZXNbaV0ubm9kZU5hbWUgPT09IFwiTElcIikge1xuICAgICAgICAgICAgICAgIGRlbGltaXRlciA9IHRoaXMub3JpZ0VsZW0uY2hpbGROb2Rlc1tpXS5vdXRlckhUTUw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZ1bGx0ZXh0ID0gJCh0aGlzLm9yaWdFbGVtKS5odG1sKCk7XG4gICAgICAgIHZhciB0ZW1wID0gZnVsbHRleHQuc3BsaXQoZGVsaW1pdGVyKTtcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IHRlbXBbMF07XG4gICAgfVxuXG4gICAgZmluZEFuc3dlcnMoKSB7XG4gICAgICAgIC8vIENyZWF0ZXMgYW5zd2VyIG9iamVjdHMgYW5kIHB1c2hlcyB0aGVtIHRvIGFuc3dlckxpc3RcbiAgICAgICAgLy8gZm9ybWF0OiBJRCwgQ29ycmVjdCBib29sLCBDb250ZW50ICh0ZXh0KVxuICAgICAgICB2YXIgQ2hpbGRBbnN3ZXJMaXN0ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKCQodGhpcy5jaGlsZHJlbltpXSkuaXMoXCJbZGF0YS1jb21wb25lbnQ9YW5zd2VyXVwiKSkge1xuICAgICAgICAgICAgICAgIENoaWxkQW5zd2VyTGlzdC5wdXNoKHRoaXMuY2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgQ2hpbGRBbnN3ZXJMaXN0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB2YXIgYW5zd2VyX2lkID0gJChDaGlsZEFuc3dlckxpc3Rbal0pLmF0dHIoXCJpZFwiKTtcbiAgICAgICAgICAgIHZhciBpc19jb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoJChDaGlsZEFuc3dlckxpc3Rbal0pLmlzKFwiW2RhdGEtY29ycmVjdF1cIikpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBkYXRhLWNvcnJlY3QgYXR0cmlidXRlIGV4aXN0cywgYW5zd2VyIGlzIGNvcnJlY3RcbiAgICAgICAgICAgICAgICBpc19jb3JyZWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBhbnN3ZXJfdGV4dCA9ICQoQ2hpbGRBbnN3ZXJMaXN0W2pdKS5odG1sKCk7XG4gICAgICAgICAgICB2YXIgYW5zd2VyX29iamVjdCA9IHtcbiAgICAgICAgICAgICAgICBpZDogYW5zd2VyX2lkLFxuICAgICAgICAgICAgICAgIGNvcnJlY3Q6IGlzX2NvcnJlY3QsXG4gICAgICAgICAgICAgICAgY29udGVudDogYW5zd2VyX3RleHQsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5hbnN3ZXJMaXN0LnB1c2goYW5zd2VyX29iamVjdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kRmVlZGJhY2tzKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgkKHRoaXMuY2hpbGRyZW5baV0pLmlzKFwiW2RhdGEtY29tcG9uZW50PWZlZWRiYWNrXVwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tMaXN0LnB1c2godGhpcy5jaGlsZHJlbltpXS5pbm5lckhUTUwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlQ29ycmVjdExpc3QoKSB7XG4gICAgICAgIC8vIENyZWF0ZXMgYXJyYXkgdGhhdCBob2xkcyB0aGUgSURcInMgb2YgY29ycmVjdCBhbnN3ZXJzXG4gICAgICAgIC8vIEFsc28gcG9wdWxhdGVzIGFuIGFycmF5IHRoYXQgaG9sZHMgdGhlIGluZGVjZXMgb2YgY29ycmVjdCBhbnN3ZXJzXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hbnN3ZXJMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hbnN3ZXJMaXN0W2ldLmNvcnJlY3QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3RMaXN0LnB1c2godGhpcy5hbnN3ZXJMaXN0W2ldLmlkKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3RJbmRleExpc3QucHVzaChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gICBGdW5jdGlvbnMgZ2VuZXJhdGluZyBmaW5hbCBIVE1MICAgPT09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIGNyZWF0ZU1DRm9ybSgpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJNQ0NvbnRhaW5lcigpO1xuICAgICAgICB0aGlzLnJlbmRlck1DRm9ybSgpOyAvLyByZW5kZXJzIHRoZSBmb3JtIHdpdGggb3B0aW9ucyBhbmQgYnV0dG9uc1xuICAgICAgICB0aGlzLnJlbmRlck1DZmVlZGJhY2tEaXYoKTtcbiAgICAgICAgLy8gcmVwbGFjZXMgaW50ZXJtZWRpYXRlIEhUTUwgd2l0aCByZW5kZXJlZCBIVE1MXG4gICAgICAgICQodGhpcy5vcmlnRWxlbSkucmVwbGFjZVdpdGgodGhpcy5jb250YWluZXJEaXYpO1xuICAgIH1cblxuICAgIHJlbmRlck1DQ29udGFpbmVyKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICQodGhpcy5jb250YWluZXJEaXYpLmh0bWwodGhpcy5xdWVzdGlvbik7XG4gICAgICAgICQodGhpcy5jb250YWluZXJEaXYpLmFkZENsYXNzKHRoaXMub3JpZ0VsZW0uZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5pZCA9IHRoaXMuZGl2aWQ7XG4gICAgfVxuXG4gICAgcmVuZGVyTUNGb3JtKCkge1xuICAgICAgICB0aGlzLm9wdHNGb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIik7XG4gICAgICAgIHRoaXMub3B0c0Zvcm0uaWQgPSB0aGlzLmRpdmlkICsgXCJfZm9ybVwiO1xuICAgICAgICAkKHRoaXMub3B0c0Zvcm0pLmF0dHIoe1xuICAgICAgICAgICAgbWV0aG9kOiBcImdldFwiLFxuICAgICAgICAgICAgYWN0aW9uOiBcIlwiLFxuICAgICAgICAgICAgb25zdWJtaXQ6IFwicmV0dXJuIGZhbHNlO1wiLFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gZ2VuZXJhdGUgZm9ybSBvcHRpb25zXG4gICAgICAgIHRoaXMucmVuZGVyTUNGb3JtT3B0cygpO1xuICAgICAgICB0aGlzLnJlbmRlck1DRm9ybUJ1dHRvbnMoKTtcbiAgICAgICAgLy8gQXBwZW5kIHRoZSBmb3JtIHRvIHRoZSBjb250YWluZXJcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5vcHRzRm9ybSk7XG4gICAgfVxuXG4gICAgcmVuZGVyTUNGb3JtT3B0cygpIHtcbiAgICAgICAgLy8gY3JlYXRlcyBpbnB1dCBET00gZWxlbWVudHNcbiAgICAgICAgdGhpcy5vcHRpb25BcnJheSA9IFtdOyAvLyBhcnJheSB3aXRoIGFuIG9iamVjdCBmb3IgZWFjaCBvcHRpb24gY29udGFpbmluZyB0aGUgaW5wdXQgYW5kIGxhYmVsIGZvciB0aGF0IG9wdGlvblxuICAgICAgICB2YXIgaW5wdXRfdHlwZSA9IFwicmFkaW9cIjtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICBpbnB1dF90eXBlID0gXCJjaGVja2JveFwiO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRoaXMuaW5kZXhBcnJheSBpcyB1c2VkIHRvIGluZGV4IHRocm91Z2ggdGhlIGFuc3dlcnNcbiAgICAgICAgLy8gaXQgaXMganVzdCAwLW4gbm9ybWFsbHksIGJ1dCB0aGUgb3JkZXIgaXMgc2h1ZmZsZWQgaWYgdGhlIHJhbmRvbSBvcHRpb24gaXMgcHJlc2VudFxuICAgICAgICB0aGlzLmluZGV4QXJyYXkgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmFuc3dlckxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuaW5kZXhBcnJheS5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJhbmRvbSkge1xuICAgICAgICAgICAgdGhpcy5yYW5kb21pemVBbnN3ZXJzKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBsZXQgYW5zd2VyRnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYuaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5hbnN3ZXJMaXN0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB2YXIgayA9IHRoaXMuaW5kZXhBcnJheVtqXTtcbiAgICAgICAgICAgIHZhciBvcHRpZCA9IHRoaXMuZGl2aWQgKyBcIl9vcHRfXCIgKyBrO1xuICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBsYWJlbCBmb3IgdGhlIGlucHV0XG4gICAgICAgICAgICB2YXIgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgICAgICAgICAvLyBJZiB0aGUgY29udGVudCBiZWdpbnMgd2l0aCBhIGBgPHA+YGAsIHB1dCB0aGUgbGFiZWwgaW5zaWRlIG9mIGl0LiAoU3BoaW54IDIuMCBwdXRzIGFsbCBjb250ZW50IGluIGEgYGA8cD5gYCwgd2hpbGUgU3BoaW54IDEuOCBkb2Vzbid0KS5cbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gdGhpcy5hbnN3ZXJMaXN0W2tdLmNvbnRlbnQ7XG4gICAgICAgICAgICB2YXIgcHJlZml4ID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChjb250ZW50LnN0YXJ0c1dpdGgoXCI8cD5cIikpIHtcbiAgICAgICAgICAgICAgICBwcmVmaXggPSBcIjxwPlwiO1xuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnNsaWNlKDMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChsYWJlbCkuaHRtbChcbiAgICAgICAgICAgICAgICBgJHtwcmVmaXh9PGlucHV0IHR5cGU9XCIke2lucHV0X3R5cGV9XCIgbmFtZT1cImdyb3VwMVwiIHZhbHVlPSR7a30gaWQ9JHtvcHRpZH0+JHtTdHJpbmcuZnJvbUNoYXJDb2RlKFxuICAgICAgICAgICAgICAgICAgICBcIkFcIi5jaGFyQ29kZUF0KDApICsgalxuICAgICAgICAgICAgICAgICl9LiAke2NvbnRlbnR9YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgb2JqZWN0IHRvIHN0b3JlIGluIG9wdGlvbkFycmF5XG4gICAgICAgICAgICB2YXIgb3B0T2JqID0ge1xuICAgICAgICAgICAgICAgIGlucHV0OiAkKGxhYmVsKS5maW5kKFwiaW5wdXRcIilbMF0sXG4gICAgICAgICAgICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG9wdE9iai5pbnB1dC5vbmNsaWNrID0gYW5zd2VyRnVuYztcblxuICAgICAgICAgICAgdGhpcy5vcHRpb25BcnJheS5wdXNoKG9wdE9iaik7XG4gICAgICAgICAgICAvLyBhZGQgdGhlIG9wdGlvbiB0byB0aGUgZm9ybVxuICAgICAgICAgICAgdGhpcy5vcHRzRm9ybS5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgICAgICAgICB0aGlzLm9wdHNGb3JtLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJiclwiKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXJNQ0Zvcm1CdXR0b25zKCkge1xuICAgICAgICAvLyBzdWJtaXQgYW5kIGNvbXBhcmUgbWUgYnV0dG9uc1xuICAgICAgICAvLyBDcmVhdGUgc3VibWl0IGJ1dHRvblxuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLnRleHRDb250ZW50ID0gXCJDaGVjayBNZVwiO1xuICAgICAgICAkKHRoaXMuc3VibWl0QnV0dG9uKS5hdHRyKHtcbiAgICAgICAgICAgIGNsYXNzOiBcImJ0biBidG4tc3VjY2Vzc1wiLFxuICAgICAgICAgICAgbmFtZTogXCJkbyBhbnN3ZXJcIixcbiAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZWFuc3dlcnMpIHtcbiAgICAgICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzTUNNQVN1Ym1pc3Npb24odHJ1ZSk7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc01DTUZTdWJtaXNzaW9uKHRydWUpO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSAvLyBlbmQgZWxzZVxuICAgICAgICB0aGlzLm9wdHNGb3JtLmFwcGVuZENoaWxkKHRoaXMuc3VibWl0QnV0dG9uKTtcbiAgICAgICAgLy8gQ3JlYXRlIGNvbXBhcmUgYnV0dG9uXG4gICAgICAgIGlmICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzICYmICFlQm9va0NvbmZpZy5wZWVyKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgJCh0aGlzLmNvbXBhcmVCdXR0b24pLmF0dHIoe1xuICAgICAgICAgICAgICAgIGNsYXNzOiBcImJ0biBidG4tZGVmYXVsdFwiLFxuICAgICAgICAgICAgICAgIGlkOiB0aGlzLmRpdmlkICsgXCJfYmNvbXBcIixcbiAgICAgICAgICAgICAgICBkaXNhYmxlZDogXCJcIixcbiAgICAgICAgICAgICAgICBuYW1lOiBcImNvbXBhcmVcIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLnRleHRDb250ZW50ID0gXCJDb21wYXJlIG1lXCI7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBhcmVBbnN3ZXJzKHRoaXMuZGl2aWQpO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMub3B0c0Zvcm0uYXBwZW5kQ2hpbGQodGhpcy5jb21wYXJlQnV0dG9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlck1DZmVlZGJhY2tEaXYoKSB7XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmlkID0gdGhpcy5kaXZpZCArIFwiX2ZlZWRiYWNrXCI7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJiclwiKSk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuZmVlZEJhY2tEaXYpO1xuICAgIH1cblxuICAgIHJhbmRvbWl6ZUFuc3dlcnMoKSB7XG4gICAgICAgIC8vIE1ha2VzIHRoZSBvcmRlcmluZyBvZiB0aGUgYW5zd2VyIGNob2ljZXMgcmFuZG9tXG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSB0aGlzLmluZGV4QXJyYXkubGVuZ3RoLFxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUsXG4gICAgICAgICAgICByYW5kb21JbmRleDtcbiAgICAgICAgLy8gV2hpbGUgdGhlcmUgcmVtYWluIGVsZW1lbnRzIHRvIHNodWZmbGUuLi5cbiAgICAgICAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xuICAgICAgICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW50Li4uXG4gICAgICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcbiAgICAgICAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gdGhpcy5pbmRleEFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgICAgICAgICB0aGlzLmluZGV4QXJyYXlbY3VycmVudEluZGV4XSA9IHRoaXMuaW5kZXhBcnJheVtyYW5kb21JbmRleF07XG4gICAgICAgICAgICB0aGlzLmluZGV4QXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XG4gICAgICAgICAgICB2YXIgdGVtcG9yYXJ5RmVlZGJhY2sgPSB0aGlzLmZlZWRiYWNrTGlzdFtjdXJyZW50SW5kZXhdO1xuICAgICAgICAgICAgdGhpcy5mZWVkYmFja0xpc3RbY3VycmVudEluZGV4XSA9IHRoaXMuZmVlZGJhY2tMaXN0W3JhbmRvbUluZGV4XTtcbiAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tMaXN0W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeUZlZWRiYWNrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBDaGVja2luZy9sb2FkaW5nIGZyb20gc3RvcmFnZSA9PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgcmVzdG9yZUFuc3dlcnMoZGF0YSkge1xuICAgICAgICAvLyBSZXN0b3JlIGFuc3dlcnMgZnJvbSBzdG9yYWdlIHJldHJpZXZhbCBkb25lIGluIFJ1bmVzdG9uZUJhc2VcbiAgICAgICAgLy8gc29tZXRpbWVzIGRhdGEuYW5zd2VyIGNhbiBiZSBudWxsXG4gICAgICAgIGlmICghZGF0YS5hbnN3ZXIpIHtcbiAgICAgICAgICAgIGRhdGEuYW5zd2VyID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYW5zd2VycyA9IGRhdGEuYW5zd2VyLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgZm9yICh2YXIgYSA9IDA7IGEgPCBhbnN3ZXJzLmxlbmd0aDsgYSsrKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBhbnN3ZXJzW2FdO1xuICAgICAgICAgICAgZm9yICh2YXIgYiA9IDA7IGIgPCB0aGlzLm9wdGlvbkFycmF5Lmxlbmd0aDsgYisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9uQXJyYXlbYl0uaW5wdXQudmFsdWUgPT0gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLm9wdGlvbkFycmF5W2JdLmlucHV0KS5hdHRyKFwiY2hlY2tlZFwiLCBcInRydWVcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm11bHRpcGxlYW5zd2Vycykge1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTUNNQVN1Ym1pc3Npb24oZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTUNNRlN1Ym1pc3Npb24oZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hlY2tMb2NhbFN0b3JhZ2UoKSB7XG4gICAgICAgIC8vIFJlcG9wdWxhdGVzIE1DTUEgcXVlc3Rpb25zIHdpdGggYSB1c2VyJ3MgcHJldmlvdXMgYW5zd2VycyxcbiAgICAgICAgLy8gd2hpY2ggd2VyZSBzdG9yZWQgaW50byBsb2NhbCBzdG9yYWdlLlxuICAgICAgICB2YXIgc3RvcmVkRGF0YTtcbiAgICAgICAgdmFyIGFuc3dlcnM7XG4gICAgICAgIGlmICh0aGlzLmdyYWRlcmFjdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsZW4gPSBsb2NhbFN0b3JhZ2UubGVuZ3RoO1xuICAgICAgICBpZiAobGVuID4gMCkge1xuICAgICAgICAgICAgdmFyIGV4ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG4gICAgICAgICAgICBpZiAoZXggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBzdG9yZWREYXRhID0gSlNPTi5wYXJzZShleCk7XG4gICAgICAgICAgICAgICAgICAgIGFuc3dlcnMgPSBzdG9yZWREYXRhLmFuc3dlci5zcGxpdChcIixcIik7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVycm9yIHdoaWxlIHBhcnNpbmc7IGxpa2VseSBkdWUgdG8gYmFkIHZhbHVlIHN0b3JlZCBpbiBzdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYSA9IDA7IGEgPCBhbnN3ZXJzLmxlbmd0aDsgYSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGFuc3dlcnNbYV07XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGIgPSAwOyBiIDwgdGhpcy5vcHRpb25BcnJheS5sZW5ndGg7IGIrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9uQXJyYXlbYl0uaW5wdXQudmFsdWUgPT0gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMub3B0aW9uQXJyYXlbYl0uaW5wdXQpLmF0dHIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2hlY2tlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRydWVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbmFibGVNQ0NvbXBhcmlzb24oKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRTdWJtaXR0ZWRPcHRzKCk7IC8vIHRvIHBvcHVsYXRlIGdpdmVubG9nIGZvciBsb2dnaW5nXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm11bHRpcGxlYW5zd2Vycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dNQ01Bc3VibWlzc2lvbigpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dNQ01Gc3VibWlzc2lvbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0TG9jYWxTdG9yYWdlKGRhdGEpIHtcbiAgICAgICAgdmFyIHRpbWVTdGFtcCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHZhciBzdG9yYWdlT2JqID0ge1xuICAgICAgICAgICAgYW5zd2VyOiBkYXRhLmFuc3dlcixcbiAgICAgICAgICAgIHRpbWVzdGFtcDogdGltZVN0YW1wLFxuICAgICAgICAgICAgY29ycmVjdDogZGF0YS5jb3JyZWN0LFxuICAgICAgICB9O1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlS2V5KCksXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeShzdG9yYWdlT2JqKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBQcm9jZXNzaW5nIE1DIFN1Ym1pc3Npb25zID09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIHByb2Nlc3NNQ01BU3VibWlzc2lvbihsb2dGbGFnKSB7XG4gICAgICAgIC8vIENhbGxlZCB3aGVuIHRoZSBzdWJtaXQgYnV0dG9uIGlzIGNsaWNrZWRcbiAgICAgICAgdGhpcy5nZXRTdWJtaXR0ZWRPcHRzKCk7IC8vIG1ha2Ugc3VyZSB0aGlzLmdpdmVuQXJyYXkgaXMgcG9wdWxhdGVkXG4gICAgICAgIHRoaXMuc2NvcmVNQ01BU3VibWlzc2lvbigpO1xuICAgICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSh7XG4gICAgICAgICAgICBjb3JyZWN0OiB0aGlzLmNvcnJlY3QgPyBcIlRcIiA6IFwiRlwiLFxuICAgICAgICAgICAgYW5zd2VyOiB0aGlzLmdpdmVuQXJyYXkuam9pbihcIixcIiksXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAobG9nRmxhZykge1xuICAgICAgICAgICAgdGhpcy5sb2dNQ01Bc3VibWlzc2lvbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZUJvb2tDb25maWcucGVlciB8fCBlQm9va0NvbmZpZy5pc0luc3RydWN0b3IpIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyTUNNQUZlZWRCYWNrKCk7XG4gICAgICAgICAgICBpZiAodGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlTUNDb21wYXJpc29uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBhY2tub3dsZWRnZSBzdWJtaXNzaW9uXG4gICAgICAgICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmh0bWwoXCI8cD5Zb3VyIEFuc3dlciBoYXMgYmVlbiByZWNvcmRlZDwvcD5cIik7XG4gICAgICAgICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWluZm9cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRTdWJtaXR0ZWRPcHRzKCkge1xuICAgICAgICB2YXIgZ2l2ZW47XG4gICAgICAgIHRoaXMuc2luZ2xlZmVlZGJhY2sgPSBcIlwiOyAvLyBVc2VkIGZvciBNQ01GIHF1ZXN0aW9uc1xuICAgICAgICB0aGlzLmZlZWRiYWNrU3RyaW5nID0gXCJcIjsgLy8gVXNlZCBmb3IgTUNNQSBxdWVzdGlvbnNcbiAgICAgICAgdGhpcy5naXZlbkFycmF5ID0gW107XG4gICAgICAgIHRoaXMuZ2l2ZW5sb2cgPSBcIlwiO1xuICAgICAgICB2YXIgYnV0dG9uT2JqcyA9IHRoaXMub3B0c0Zvcm0uZWxlbWVudHMuZ3JvdXAxO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1dHRvbk9ianMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChidXR0b25PYmpzW2ldLmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICBnaXZlbiA9IGJ1dHRvbk9ianNbaV0udmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5naXZlbkFycmF5LnB1c2goZ2l2ZW4pO1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tTdHJpbmcgKz0gYDxsaSB2YWx1ZT1cIiR7aSArIDF9XCI+JHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mZWVkYmFja0xpc3RbaV1cbiAgICAgICAgICAgICAgICB9PC9saT5gO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2l2ZW5sb2cgKz0gZ2l2ZW4gKyBcIixcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnNpbmdsZWZlZWRiYWNrID0gdGhpcy5mZWVkYmFja0xpc3RbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5naXZlbkFycmF5LnNvcnQoKTtcbiAgICB9XG5cbiAgICBjaGVja0N1cnJlbnRBbnN3ZXIoKSB7XG4gICAgICAgIHRoaXMuZ2V0U3VibWl0dGVkT3B0cygpO1xuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZWFuc3dlcnMpIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcmVNQ01BU3VibWlzc2lvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zY29yZU1DTUZTdWJtaXNzaW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBsb2dDdXJyZW50QW5zd2VyKHNpZCkge1xuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZWFuc3dlcnMpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMubG9nTUNNQXN1Ym1pc3Npb24oc2lkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMubG9nTUNNRnN1Ym1pc3Npb24oc2lkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlckZlZWRiYWNrKCkge1xuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZWFuc3dlcnMpIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyTUNNQUZlZWRCYWNrKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlck1DTUZGZWVkYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNjb3JlTUNNQVN1Ym1pc3Npb24oKSB7XG4gICAgICAgIHRoaXMuY29ycmVjdENvdW50ID0gMDtcbiAgICAgICAgdmFyIGNvcnJlY3RJbmRleCA9IDA7XG4gICAgICAgIHZhciBnaXZlbkluZGV4ID0gMDtcbiAgICAgICAgd2hpbGUgKFxuICAgICAgICAgICAgY29ycmVjdEluZGV4IDwgdGhpcy5jb3JyZWN0SW5kZXhMaXN0Lmxlbmd0aCAmJlxuICAgICAgICAgICAgZ2l2ZW5JbmRleCA8IHRoaXMuZ2l2ZW5BcnJheS5sZW5ndGhcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdGhpcy5naXZlbkFycmF5W2dpdmVuSW5kZXhdIDxcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3RJbmRleExpc3RbY29ycmVjdEluZGV4XVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgZ2l2ZW5JbmRleCsrO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLmdpdmVuQXJyYXlbZ2l2ZW5JbmRleF0gPT1cbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3RJbmRleExpc3RbY29ycmVjdEluZGV4XVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0Q291bnQrKztcbiAgICAgICAgICAgICAgICBnaXZlbkluZGV4Kys7XG4gICAgICAgICAgICAgICAgY29ycmVjdEluZGV4Kys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvcnJlY3RJbmRleCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBudW1HaXZlbiA9IHRoaXMuZ2l2ZW5BcnJheS5sZW5ndGg7XG4gICAgICAgIHZhciBudW1Db3JyZWN0ID0gdGhpcy5jb3JyZWN0Q291bnQ7XG4gICAgICAgIHZhciBudW1OZWVkZWQgPSB0aGlzLmNvcnJlY3RMaXN0Lmxlbmd0aDtcbiAgICAgICAgdGhpcy5hbnN3ZXIgPSB0aGlzLmdpdmVuQXJyYXkuam9pbihcIixcIik7XG4gICAgICAgIHRoaXMuY29ycmVjdCA9IG51bUNvcnJlY3QgPT09IG51bU5lZWRlZCAmJiBudW1OZWVkZWQgPT09IG51bUdpdmVuO1xuICAgICAgICBpZiAobnVtR2l2ZW4gPT09IG51bU5lZWRlZCkge1xuICAgICAgICAgICAgdGhpcy5wZXJjZW50ID0gbnVtQ29ycmVjdCAvIG51bU5lZWRlZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGVyY2VudCA9IG51bUNvcnJlY3QgLyBNYXRoLm1heChudW1HaXZlbiwgbnVtTmVlZGVkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGxvZ01DTUFzdWJtaXNzaW9uKHNpZCkge1xuICAgICAgICB2YXIgYW5zd2VyID0gdGhpcy5hbnN3ZXIgfHwgXCJcIjtcbiAgICAgICAgdmFyIGNvcnJlY3QgPSB0aGlzLmNvcnJlY3QgfHwgXCJGXCI7XG4gICAgICAgIHZhciBsb2dBbnN3ZXIgPVxuICAgICAgICAgICAgXCJhbnN3ZXI6XCIgKyBhbnN3ZXIgKyBcIjpcIiArIChjb3JyZWN0ID09IFwiVFwiID8gXCJjb3JyZWN0XCIgOiBcIm5vXCIpO1xuICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgIGV2ZW50OiBcIm1DaG9pY2VcIixcbiAgICAgICAgICAgIGFjdDogbG9nQW5zd2VyLFxuICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXIsXG4gICAgICAgICAgICBjb3JyZWN0OiBjb3JyZWN0LFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoZUJvb2tDb25maWcucGVlciAmJiB0eXBlb2Ygc3R1ZGVudFZvdGVDb3VudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZGF0YS5hY3QgPSBkYXRhLmFjdCArIGA6dm90ZSR7c3R1ZGVudFZvdGVDb3VudH1gO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygc2lkICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBkYXRhLnNpZCA9IHNpZDtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCB0aGlzLmxvZ0Jvb2tFdmVudChkYXRhKTtcbiAgICB9XG5cbiAgICByZW5kZXJNQ01BRmVlZEJhY2soKSB7XG4gICAgICAgIHZhciBhbnN3ZXJTdHIgPSBcImFuc3dlcnNcIjtcbiAgICAgICAgdmFyIG51bUdpdmVuID0gdGhpcy5naXZlbkFycmF5Lmxlbmd0aDtcbiAgICAgICAgaWYgKG51bUdpdmVuID09PSAxKSB7XG4gICAgICAgICAgICBhbnN3ZXJTdHIgPSBcImFuc3dlclwiO1xuICAgICAgICB9XG4gICAgICAgIHZhciBudW1Db3JyZWN0ID0gdGhpcy5jb3JyZWN0Q291bnQ7XG4gICAgICAgIHZhciBudW1OZWVkZWQgPSB0aGlzLmNvcnJlY3RMaXN0Lmxlbmd0aDtcbiAgICAgICAgdmFyIGZlZWRiYWNrVGV4dCA9IHRoaXMuZmVlZGJhY2tTdHJpbmc7XG4gICAgICAgIGlmICh0aGlzLmNvcnJlY3QpIHtcbiAgICAgICAgICAgICQodGhpcy5mZWVkQmFja0RpdikuaHRtbChg4pyU77iPIDxvbCB0eXBlPVwiQVwiPiR7ZmVlZGJhY2tUZXh0fTwvdWw+YCk7XG4gICAgICAgICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWluZm9cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmh0bWwoXG4gICAgICAgICAgICAgICAgYOKclu+4jyBZb3UgZ2F2ZSAke251bUdpdmVufSAke2Fuc3dlclN0cn0gYW5kIGdvdCAke251bUNvcnJlY3R9IGNvcnJlY3Qgb2YgJHtudW1OZWVkZWR9IG5lZWRlZC48b2wgdHlwZT1cIkFcIj4ke2ZlZWRiYWNrVGV4dH08L3VsPmBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWRhbmdlclwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb2Nlc3NNQ01GU3VibWlzc2lvbihsb2dGbGFnKSB7XG4gICAgICAgIC8vIENhbGxlZCB3aGVuIHRoZSBzdWJtaXQgYnV0dG9uIGlzIGNsaWNrZWRcbiAgICAgICAgdGhpcy5nZXRTdWJtaXR0ZWRPcHRzKCk7IC8vIG1ha2Ugc3VyZSB0aGlzLmdpdmVuQXJyYXkgaXMgcG9wdWxhdGVkXG4gICAgICAgIHRoaXMuc2NvcmVNQ01GU3VibWlzc2lvbigpO1xuICAgICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSh7XG4gICAgICAgICAgICBjb3JyZWN0OiB0aGlzLmNvcnJlY3QgPyBcIlRcIiA6IFwiRlwiLFxuICAgICAgICAgICAgYW5zd2VyOiB0aGlzLmdpdmVuQXJyYXkuam9pbihcIixcIiksXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAobG9nRmxhZykge1xuICAgICAgICAgICAgdGhpcy5sb2dNQ01Gc3VibWlzc2lvbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZUJvb2tDb25maWcucGVlciB8fCBlQm9va0NvbmZpZy5pc0luc3RydWN0b3IpIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyTUNNRkZlZWRiYWNrKCk7XG4gICAgICAgICAgICBpZiAodGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlTUNDb21wYXJpc29uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBhY2tub3dsZWRnZSBzdWJtaXNzaW9uXG4gICAgICAgICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmh0bWwoXCI8cD5Zb3VyIEFuc3dlciBoYXMgYmVlbiByZWNvcmRlZDwvcD5cIik7XG4gICAgICAgICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWluZm9cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzY29yZU1DTUZTdWJtaXNzaW9uKCkge1xuICAgICAgICB0aGlzLmFuc3dlciA9IHRoaXMuZ2l2ZW5BcnJheVswXTtcbiAgICAgICAgaWYgKHRoaXMuZ2l2ZW5BcnJheVswXSA9PSB0aGlzLmNvcnJlY3RJbmRleExpc3RbMF0pIHtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnBlcmNlbnQgPSAxLjA7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5naXZlbkFycmF5WzBdICE9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIGlmIGdpdmVuIGlzIG51bGwgdGhlbiB0aGUgcXVlc3Rpb24gd2FzblwidCBhbnN3ZXJlZCBhbmQgc2hvdWxkIGJlIGNvdW50ZWQgYXMgc2tpcHBlZFxuICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnBlcmNlbnQgPSAwLjA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBsb2dNQ01Gc3VibWlzc2lvbihzaWQpIHtcbiAgICAgICAgLy8gSWYgdGhlcmUncyBubyBhbnN3ZXIgcHJvdmlkZWQgKHRoZSBhcnJheSBpcyBlbXB0eSksIHVzZSBhIGJsYW5rIGZvciB0aGUgYW5zd2VyLlxuICAgICAgICB2YXIgYW5zd2VyID0gdGhpcy5naXZlbkFycmF5WzBdIHx8IFwiXCI7XG4gICAgICAgIHZhciBjb3JyZWN0ID1cbiAgICAgICAgICAgIHRoaXMuZ2l2ZW5BcnJheVswXSA9PSB0aGlzLmNvcnJlY3RJbmRleExpc3RbMF0gPyBcIlRcIiA6IFwiRlwiO1xuICAgICAgICB2YXIgbG9nQW5zd2VyID1cbiAgICAgICAgICAgIFwiYW5zd2VyOlwiICsgYW5zd2VyICsgXCI6XCIgKyAoY29ycmVjdCA9PSBcIlRcIiA/IFwiY29ycmVjdFwiIDogXCJub1wiKTsgLy8gYmFja3dhcmQgY29tcGF0aWJsZVxuICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgIGV2ZW50OiBcIm1DaG9pY2VcIixcbiAgICAgICAgICAgIGFjdDogbG9nQW5zd2VyLFxuICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXIsXG4gICAgICAgICAgICBjb3JyZWN0OiBjb3JyZWN0LFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoZUJvb2tDb25maWcucGVlciAmJiB0eXBlb2Ygc3R1ZGVudFZvdGVDb3VudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZGF0YS5hY3QgPSBkYXRhLmFjdCArIGA6dm90ZSR7c3R1ZGVudFZvdGVDb3VudH1gO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygc2lkICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBkYXRhLnNpZCA9IHNpZDtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCB0aGlzLmxvZ0Jvb2tFdmVudChkYXRhKTtcbiAgICB9XG5cbiAgICByZW5kZXJNQ01GRmVlZGJhY2soKSB7XG4gICAgICAgIGxldCBjb3JyZWN0ID0gdGhpcy5naXZlbkFycmF5WzBdID09IHRoaXMuY29ycmVjdEluZGV4TGlzdFswXTtcbiAgICAgICAgbGV0IGZlZWRiYWNrVGV4dCA9IHRoaXMuc2luZ2xlZmVlZGJhY2s7XG5cbiAgICAgICAgaWYgKGNvcnJlY3QpIHtcbiAgICAgICAgICAgICQodGhpcy5mZWVkQmFja0RpdikuaHRtbChcIuKclO+4jyBcIiArIGZlZWRiYWNrVGV4dCk7XG4gICAgICAgICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWluZm9cIik7IC8vIHVzZSBibHVlIGZvciBiZXR0ZXIgcmVkL2dyZWVuIGJsdWUgY29sb3IgYmxpbmRuZXNzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZmVlZGJhY2tUZXh0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmZWVkYmFja1RleHQgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5odG1sKFwi4pyW77iPIFwiICsgZmVlZGJhY2tUZXh0KTtcbiAgICAgICAgICAgICQodGhpcy5mZWVkQmFja0RpdikuYXR0cihcImNsYXNzXCIsIFwiYWxlcnQgYWxlcnQtZGFuZ2VyXCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVuYWJsZU1DQ29tcGFyaXNvbigpIHtcbiAgICAgICAgaWYgKGVCb29rQ29uZmlnLmVuYWJsZUNvbXBhcmVNZSkge1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaW5zdHJ1Y3Rvck1jaG9pY2VNb2RhbChkYXRhKSB7XG4gICAgICAgIC8vIGRhdGEucmVzbGlzdCAtLSBzdHVkZW50IGFuZCB0aGVpciBhbnN3ZXJzXG4gICAgICAgIC8vIGRhdGEuYW5zd2VyRGljdCAgICAtLSBhbnN3ZXJzIGFuZCBjb3VudFxuICAgICAgICAvLyBkYXRhLmNvcnJlY3QgLSBjb3JyZWN0IGFuc3dlclxuICAgICAgICB2YXIgcmVzID0gXCI8dGFibGU+PHRyPjx0aD5TdHVkZW50PC90aD48dGg+QW5zd2VyKHMpPC90aD48L3RyPlwiO1xuICAgICAgICBmb3IgKHZhciBpIGluIGRhdGEpIHtcbiAgICAgICAgICAgIHJlcyArPVxuICAgICAgICAgICAgICAgIFwiPHRyPjx0ZD5cIiArXG4gICAgICAgICAgICAgICAgZGF0YVtpXVswXSArXG4gICAgICAgICAgICAgICAgXCI8L3RkPjx0ZD5cIiArXG4gICAgICAgICAgICAgICAgZGF0YVtpXVsxXSArXG4gICAgICAgICAgICAgICAgXCI8L3RkPjwvdHI+XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmVzICs9IFwiPC90YWJsZT5cIjtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gICAgY29tcGFyZU1vZGFsKGRhdGEsIHN0YXR1cywgd2hhdGV2ZXIpIHtcbiAgICAgICAgdmFyIGRhdGFkaWN0ID0gZGF0YS5kZXRhaWw7XG4gICAgICAgIHZhciBhbnN3ZXJzID0gZGF0YWRpY3QuYW5zd2VyRGljdDtcbiAgICAgICAgdmFyIG1pc2MgPSBkYXRhZGljdC5taXNjO1xuICAgICAgICB2YXIga2wgPSBPYmplY3Qua2V5cyhhbnN3ZXJzKS5zb3J0KCk7XG4gICAgICAgIHZhciBib2R5ID0gXCI8dGFibGU+XCI7XG4gICAgICAgIGJvZHkgKz0gXCI8dHI+PHRoPkFuc3dlcjwvdGg+PHRoPlBlcmNlbnQ8L3RoPjwvdHI+XCI7XG4gICAgICAgIHZhciB0aGVDbGFzcyA9IFwiXCI7XG4gICAgICAgIGZvciAodmFyIGsgaW4ga2wpIHtcbiAgICAgICAgICAgIGlmIChrbFtrXSA9PT0gbWlzYy5jb3JyZWN0KSB7XG4gICAgICAgICAgICAgICAgdGhlQ2xhc3MgPSBcInN1Y2Nlc3NcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhlQ2xhc3MgPSBcImluZm9cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJvZHkgKz1cbiAgICAgICAgICAgICAgICBcIjx0cj48dGQ+XCIgKyBrbFtrXSArIFwiPC90ZD48dGQgY2xhc3M9J2NvbXBhcmUtbWUtcHJvZ3Jlc3MnPlwiO1xuICAgICAgICAgICAgdmFyIHBjdCA9IGFuc3dlcnNba2xba11dICsgXCIlXCI7XG4gICAgICAgICAgICBib2R5ICs9IFwiPGRpdiBjbGFzcz0ncHJvZ3Jlc3MnPlwiO1xuICAgICAgICAgICAgYm9keSArPVxuICAgICAgICAgICAgICAgIFwiICAgIDxkaXYgY2xhc3M9J3Byb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItXCIgK1xuICAgICAgICAgICAgICAgIHRoZUNsYXNzICtcbiAgICAgICAgICAgICAgICBcIicgc3R5bGU9J3dpZHRoOlwiICtcbiAgICAgICAgICAgICAgICBwY3QgK1xuICAgICAgICAgICAgICAgIFwiOyc+XCIgK1xuICAgICAgICAgICAgICAgIHBjdDtcbiAgICAgICAgICAgIGJvZHkgKz0gXCIgICAgPC9kaXY+XCI7XG4gICAgICAgICAgICBib2R5ICs9IFwiPC9kaXY+PC90ZD48L3RyPlwiO1xuICAgICAgICB9XG4gICAgICAgIGJvZHkgKz0gXCI8L3RhYmxlPlwiO1xuICAgICAgICBpZiAobWlzYy55b3VycGN0ICE9PSBcInVuYXZhaWxhYmxlXCIpIHtcbiAgICAgICAgICAgIGJvZHkgKz1cbiAgICAgICAgICAgICAgICBcIjxiciAvPjxwPllvdSBoYXZlIFwiICtcbiAgICAgICAgICAgICAgICBtaXNjLnlvdXJwY3QgK1xuICAgICAgICAgICAgICAgIFwiJSBjb3JyZWN0IGZvciBhbGwgcXVlc3Rpb25zPC9wPlwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhZGljdC5yZXNsaXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGJvZHkgKz0gdGhpcy5pbnN0cnVjdG9yTWNob2ljZU1vZGFsKGRhdGFkaWN0LnJlc2xpc3QpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBodG1sID1cbiAgICAgICAgICAgIFwiPGRpdiBjbGFzcz0nbW9kYWwgZmFkZSc+XCIgK1xuICAgICAgICAgICAgXCIgICAgPGRpdiBjbGFzcz0nbW9kYWwtZGlhbG9nIGNvbXBhcmUtbW9kYWwnPlwiICtcbiAgICAgICAgICAgIFwiICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1jb250ZW50Jz5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9J21vZGFsLWhlYWRlcic+XCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzPSdjbG9zZScgZGF0YS1kaXNtaXNzPSdtb2RhbCcgYXJpYS1oaWRkZW49J3RydWUnPiZ0aW1lczs8L2J1dHRvbj5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICA8aDQgY2xhc3M9J21vZGFsLXRpdGxlJz5EaXN0cmlidXRpb24gb2YgQW5zd2VyczwvaDQ+XCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICA8L2Rpdj5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9J21vZGFsLWJvZHknPlwiICtcbiAgICAgICAgICAgIGJvZHkgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICA8L2Rpdj5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgPC9kaXY+XCIgK1xuICAgICAgICAgICAgXCIgICAgPC9kaXY+XCIgK1xuICAgICAgICAgICAgXCI8L2Rpdj5cIjtcbiAgICAgICAgdmFyIGVsID0gJChodG1sKTtcbiAgICAgICAgZWwubW9kYWwoKTtcbiAgICB9XG4gICAgLy8gX2Bjb21wYXJlQW5zd2Vyc2BcbiAgICBjb21wYXJlQW5zd2VycygpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgICAgZGF0YS5kaXZfaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICBkYXRhLmNvdXJzZV9uYW1lID0gZUJvb2tDb25maWcuY291cnNlO1xuICAgICAgICBqUXVlcnkuZ2V0KFxuICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2Fzc2Vzc21lbnQvZ2V0YWdncmVnYXRlcmVzdWx0c2AsXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgdGhpcy5jb21wYXJlTW9kYWwuYmluZCh0aGlzKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGRpc2FibGVJbnRlcmFjdGlvbigpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbkFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbkFycmF5W2ldLmlucHV0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVuYWJsZUludGVyYWN0aW9uKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMub3B0aW9uQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uQXJyYXlbaV0uaW5wdXQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09IEZpbmQgdGhlIGN1c3RvbSBIVE1MIHRhZ3MgYW5kID09XG49PSAgIGV4ZWN1dGUgb3VyIGNvZGUgb24gdGhlbSAgICA9PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiQoZG9jdW1lbnQpLm9uKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAkKFwiW2RhdGEtY29tcG9uZW50PW11bHRpcGxlY2hvaWNlXVwiKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAvLyBNQ1xuICAgICAgICB2YXIgb3B0cyA9IHtcbiAgICAgICAgICAgIG9yaWc6IHRoaXMsXG4gICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMsXG4gICAgICAgIH07XG4gICAgICAgIGlmICgkKHRoaXMpLmNsb3Nlc3QoXCJbZGF0YS1jb21wb25lbnQ9dGltZWRBc3Nlc3NtZW50XVwiKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBlbGVtZW50IGV4aXN0cyB3aXRoaW4gYSB0aW1lZCBjb21wb25lbnQsIGRvbid0IHJlbmRlciBpdCBoZXJlXG4gICAgICAgICAgICB3aW5kb3cubWNMaXN0W3RoaXMuaWRdID0gbmV3IE11bHRpcGxlQ2hvaWNlKG9wdHMpO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcbiIsImltcG9ydCBNdWx0aXBsZUNob2ljZSBmcm9tIFwiLi9tY2hvaWNlLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVkTUMgZXh0ZW5kcyBNdWx0aXBsZUNob2ljZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgJCh0aGlzLmNvbnRhaW5lckRpdikuYWRkQ2xhc3MoXCJydW5lc3RvbmVcIik7XG4gICAgICAgIHRoaXMubmVlZHNSZWluaXRpYWxpemF0aW9uID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5yZW5kZXJUaW1lZEljb24odGhpcy5NQ0NvbnRhaW5lcik7XG4gICAgICAgIHRoaXMuaGlkZUJ1dHRvbnMoKTsgLy8gRG9uJ3Qgc2hvdyBwZXItcXVlc3Rpb24gYnV0dG9ucyBpbiBhIHRpbWVkIGFzc2Vzc21lbnRcbiAgICB9XG5cbiAgICByZW5kZXJUaW1lZEljb24oY29tcG9uZW50KSB7XG4gICAgICAgIC8vIHJlbmRlcnMgdGhlIGNsb2NrIGljb24gb24gdGltZWQgY29tcG9uZW50cy4gICAgVGhlIGNvbXBvbmVudCBwYXJhbWV0ZXJcbiAgICAgICAgLy8gaXMgdGhlIGVsZW1lbnQgdGhhdCB0aGUgaWNvbiBzaG91bGQgYmUgYXBwZW5kZWQgdG8uXG4gICAgICAgIHZhciB0aW1lSWNvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHZhciB0aW1lSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICAgICQodGltZUljb24pLmF0dHIoe1xuICAgICAgICAgICAgc3JjOiBcIi4uL19zdGF0aWMvY2xvY2sucG5nXCIsXG4gICAgICAgICAgICBzdHlsZTogXCJ3aWR0aDoxNXB4O2hlaWdodDoxNXB4XCIsXG4gICAgICAgIH0pO1xuICAgICAgICB0aW1lSWNvbkRpdi5jbGFzc05hbWUgPSBcInRpbWVUaXBcIjtcbiAgICAgICAgdGltZUljb25EaXYudGl0bGUgPSBcIlwiO1xuICAgICAgICB0aW1lSWNvbkRpdi5hcHBlbmRDaGlsZCh0aW1lSWNvbik7XG4gICAgICAgICQoY29tcG9uZW50KS5wcmVwZW5kKHRpbWVJY29uRGl2KTtcbiAgICB9XG4gICAgaGlkZUJ1dHRvbnMoKSB7XG4gICAgICAgIC8vSnVzdCBoaWRpbmcgdGhlIGJ1dHRvbnMgZG9lc24ndCBwcmV2ZW50IHN1Ym1pdHRpbmcgdGhlIGZvcm0gd2hlbiBlbnRlcmluZyBpcyBjbGlja2VkXG4gICAgICAgIC8vV2UgbmVlZCB0byBjb21wbGV0ZWx5IGRpc2FibGUgdGhlIGJ1dHRvbnNcbiAgICAgICAgJCh0aGlzLnN1Ym1pdEJ1dHRvbikuYXR0cihcImRpc2FibGVkXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgJCh0aGlzLnN1Ym1pdEJ1dHRvbikuaGlkZSgpO1xuICAgICAgICAkKHRoaXMuY29tcGFyZUJ1dHRvbikuaGlkZSgpO1xuICAgIH1cblxuICAgIC8vIFRoZXNlIG1ldGhvZHMgb3ZlcnJpZGUgdGhlIG1ldGhvZHMgaW4gdGhlIGJhc2UgY2xhc3MuIENhbGxlZCBmcm9tIHJlbmRlckZlZWRiYWNrKClcbiAgICAvL1xuICAgIHJlbmRlck1DTUFGZWVkQmFjaygpIHtcbiAgICAgICAgdGhpcy5mZWVkYmFja1RpbWVkTUMoKTtcbiAgICB9XG4gICAgcmVuZGVyTUNNRkZlZWRiYWNrKHdoYXRldmVyLCB3aGF0ZXZlcnIpIHtcbiAgICAgICAgdGhpcy5mZWVkYmFja1RpbWVkTUMoKTtcbiAgICB9XG4gICAgZmVlZGJhY2tUaW1lZE1DKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaW5kZXhBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHRtcGluZGV4ID0gdGhpcy5pbmRleEFycmF5W2ldO1xuICAgICAgICAgICAgJCh0aGlzLmZlZWRCYWNrRWFjaEFycmF5W2ldKS5odG1sKFxuICAgICAgICAgICAgICAgIFN0cmluZy5mcm9tQ2hhckNvZGUoNjUgKyBpKSArIFwiLiBcIiArIHRoaXMuZmVlZGJhY2tMaXN0W2ldXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdmFyIHRtcGlkID0gdGhpcy5hbnN3ZXJMaXN0W3RtcGluZGV4XS5pZDtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvcnJlY3RMaXN0LmluZGV4T2YodG1waWQpID49IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWRCYWNrRWFjaEFycmF5W2ldLmNsYXNzTGlzdC5hZGQoXG4gICAgICAgICAgICAgICAgICAgIFwiYWxlcnRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhbGVydC1zdWNjZXNzXCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWRCYWNrRWFjaEFycmF5W2ldLmNsYXNzTGlzdC5hZGQoXG4gICAgICAgICAgICAgICAgICAgIFwiYWxlcnRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhbGVydC1kYW5nZXJcIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVuZGVyTUNGb3JtT3B0cygpIHtcbiAgICAgICAgc3VwZXIucmVuZGVyTUNGb3JtT3B0cygpO1xuICAgICAgICB0aGlzLmZlZWRCYWNrRWFjaEFycmF5ID0gW107XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5hbnN3ZXJMaXN0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB2YXIgayA9IHRoaXMuaW5kZXhBcnJheVtqXTtcbiAgICAgICAgICAgIHZhciBmZWVkQmFja0VhY2ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgZmVlZEJhY2tFYWNoLmlkID0gdGhpcy5kaXZpZCArIFwiX2VhY2hGZWVkYmFja19cIiArIGs7XG4gICAgICAgICAgICBmZWVkQmFja0VhY2guY2xhc3NMaXN0LmFkZChcImVhY2hGZWVkYmFja1wiKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tFYWNoQXJyYXkucHVzaChmZWVkQmFja0VhY2gpO1xuICAgICAgICAgICAgdGhpcy5vcHRzRm9ybS5hcHBlbmRDaGlsZChmZWVkQmFja0VhY2gpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNoZWNrQ29ycmVjdFRpbWVkTUNNQSgpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5jb3JyZWN0Q291bnQgPT09IHRoaXMuY29ycmVjdExpc3QubGVuZ3RoICYmXG4gICAgICAgICAgICB0aGlzLmNvcnJlY3RMaXN0Lmxlbmd0aCA9PT0gdGhpcy5naXZlbkFycmF5Lmxlbmd0aFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5naXZlbkFycmF5Lmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBxdWVzdGlvbiB3YXMgc2tpcHBlZFxuICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHRoaXMuY29ycmVjdCkge1xuICAgICAgICAgICAgY2FzZSB0cnVlOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIlRcIjtcbiAgICAgICAgICAgIGNhc2UgZmFsc2U6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiRlwiO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjaGVja0NvcnJlY3RUaW1lZE1DTUYoKSB7XG4gICAgICAgIC8vIFJldHVybnMgaWYgdGhlIHF1ZXN0aW9uIHdhcyBjb3JyZWN0LCBpbmNvcnJlY3QsIG9yIHNraXBwZWQgKHJldHVybiBudWxsIGluIHRoZSBsYXN0IGNhc2UpXG4gICAgICAgIHN3aXRjaCAodGhpcy5jb3JyZWN0KSB7XG4gICAgICAgICAgICBjYXNlIHRydWU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiVFwiO1xuICAgICAgICAgICAgY2FzZSBmYWxzZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJGXCI7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNoZWNrQ29ycmVjdFRpbWVkKCkge1xuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZWFuc3dlcnMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrQ29ycmVjdFRpbWVkTUNNQSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tDb3JyZWN0VGltZWRNQ01GKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaGlkZUZlZWRiYWNrKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZmVlZEJhY2tFYWNoQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICQodGhpcy5mZWVkQmFja0VhY2hBcnJheVtpXSkuaGlkZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVpbml0aWFsaXplTGlzdGVuZXJzKCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGxldCBhbnN3ZXJGdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5pc0Fuc3dlcmVkID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgZm9yIChsZXQgb3B0IG9mIHRoaXMub3B0aW9uQXJyYXkpIHtcbiAgICAgICAgICAgIG9wdC5pbnB1dC5vbmNsaWNrID0gYW5zd2VyRnVuYztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuaWYgKHR5cGVvZiB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPSB7fTtcbn1cblxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5Lm11bHRpcGxlY2hvaWNlID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICBpZiAob3B0cy50aW1lZCkge1xuICAgICAgICByZXR1cm4gbmV3IFRpbWVkTUMob3B0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNdWx0aXBsZUNob2ljZShvcHRzKTtcbiAgICB9XG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9