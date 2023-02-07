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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX21jaG9pY2VfanNfdGltZWRtY19qcy5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFNkQ7QUFDN0Q7QUFDNEI7O0FBRTVCLG9CQUFvQjs7QUFFcEI7QUFDZSw2QkFBNkIsbUVBQWE7QUFDekQ7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixxQ0FBcUM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDBCQUEwQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw0QkFBNEI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0JBQXdCLDBCQUEwQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw0QkFBNEI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQyxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsNEJBQTRCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw0QkFBNEI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLE9BQU8sZUFBZSxXQUFXLHdCQUF3QixHQUFHLEtBQUssTUFBTSxHQUFHO0FBQzdGO0FBQ0Esa0JBQWtCLElBQUksUUFBUTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isb0JBQW9CO0FBQzVDO0FBQ0EsNEJBQTRCLDZCQUE2QjtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCLDRDQUE0QztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxvQkFBb0I7QUFDcEQ7QUFDQSxvQ0FBb0MsNkJBQTZCO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxNQUFNO0FBQzNEO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxpQkFBaUI7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELGFBQWE7QUFDckU7QUFDQSxVQUFVO0FBQ1Y7QUFDQSwrQkFBK0IsVUFBVSxFQUFFLFdBQVcsVUFBVSxZQUFZLGFBQWEsV0FBVyxzQkFBc0IsYUFBYTtBQUN2STtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEVBQTRFO0FBQzVFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsaUJBQWlCO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1FQUFtRTtBQUNuRSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnSEFBZ0g7QUFDaEg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsOEJBQThCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0JBQXdCLDZCQUE2QjtBQUNyRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3QkFBd0IsNkJBQTZCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDaHNCeUM7O0FBRTNCLHNCQUFzQixtREFBYztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDRCQUE0QjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw0QkFBNEI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLG1DQUFtQztBQUMzRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTixtQkFBbUIsbURBQWM7QUFDakM7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvbWNob2ljZS9jc3MvbWNob2ljZS5jc3MiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9tY2hvaWNlL2pzL21jaG9pY2UuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9tY2hvaWNlL2pzL3RpbWVkbWMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09ICAgICAgTWFzdGVyIG1jaG9pY2UuanMgICAgID09PT09PT09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PSAgVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBKUyBmb3IgdGhlICAgPT09XG49PT0gUnVuZXN0b25lIG11bHRpcGxlIGNob2ljZSBjb21wb25lbnQuID09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PSAgICAgICAgICAgICAgQ3JlYXRlZCBCeSAgICAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgIElzYWlhaCBNYXllcmNoYWsgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgICAgICBhbmQgICAgICAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICBLaXJieSBPbHNvbiAgICAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgICAgICAgNi80LzE1ICAgICAgICAgICAgICAgID09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlLmpzXCI7XG4vL2ltcG9ydCBcIi4vLi4vc3R5bGVzL3J1bmVzdG9uZS1jdXN0b20tc3BoaW54LWJvb3RzdHJhcC5jc3NcIjtcbmltcG9ydCBcIi4uL2Nzcy9tY2hvaWNlLmNzc1wiO1xuXG53aW5kb3cubWNMaXN0ID0ge307IC8vIE11bHRpcGxlIENob2ljZSBkaWN0aW9uYXJ5XG5cbi8vIE1DIGNvbnN0cnVjdG9yXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNdWx0aXBsZUNob2ljZSBleHRlbmRzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuICAgICAgICB2YXIgb3JpZyA9IG9wdHMub3JpZzsgLy8gZW50aXJlIDx1bD4gZWxlbWVudFxuICAgICAgICB0aGlzLm9yaWdFbGVtID0gb3JpZztcbiAgICAgICAgdGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcyA9IG9wdHMudXNlUnVuZXN0b25lU2VydmljZXM7XG4gICAgICAgIHRoaXMubXVsdGlwbGVhbnN3ZXJzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcmlnLmlkO1xuICAgICAgICBpZiAoJCh0aGlzLm9yaWdFbGVtKS5kYXRhKFwibXVsdGlwbGVhbnN3ZXJzXCIpID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpcGxlYW5zd2VycyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IHRoaXMub3JpZ0VsZW0uY2hpbGROb2RlcztcbiAgICAgICAgdGhpcy5yYW5kb20gPSBmYWxzZTtcbiAgICAgICAgaWYgKCQodGhpcy5vcmlnRWxlbSkuaXMoXCJbZGF0YS1yYW5kb21dXCIpKSB7XG4gICAgICAgICAgICB0aGlzLnJhbmRvbSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb3JyZWN0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5hbnN3ZXJMaXN0ID0gW107XG4gICAgICAgIHRoaXMuY29ycmVjdExpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5jb3JyZWN0SW5kZXhMaXN0ID0gW107XG4gICAgICAgIHRoaXMuZmVlZGJhY2tMaXN0ID0gW107XG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBudWxsO1xuICAgICAgICB0aGlzLmNhcHRpb24gPSBcIk11bHRpcGxlIENob2ljZVwiO1xuICAgICAgICB0aGlzLmZpbmRBbnN3ZXJzKCk7XG4gICAgICAgIHRoaXMuZmluZFF1ZXN0aW9uKCk7XG4gICAgICAgIHRoaXMuZmluZEZlZWRiYWNrcygpO1xuICAgICAgICB0aGlzLmNyZWF0ZUNvcnJlY3RMaXN0KCk7XG4gICAgICAgIHRoaXMuY3JlYXRlTUNGb3JtKCk7XG4gICAgICAgIHRoaXMuYWRkQ2FwdGlvbihcInJ1bmVzdG9uZVwiKTtcbiAgICAgICAgdGhpcy5jaGVja1NlcnZlcihcIm1DaG9pY2VcIiwgdHJ1ZSk7XG4gICAgICAgIC8vIGh0dHBzOi8vZG9jcy5tYXRoamF4Lm9yZy9lbi9sYXRlc3Qvb3B0aW9ucy9zdGFydHVwL3N0YXJ0dXAuaHRtbFxuICAgICAgICAvLyBodHRwczovL2RvY3MubWF0aGpheC5vcmcvZW4vbGF0ZXN0L3dlYi9jb25maWd1cmF0aW9uLmh0bWwjc3RhcnR1cC1hY3Rpb25cbiAgICAgICAgLy8gcnVuZXN0b25lTWF0aFJlYWR5IGlzIGRlZmluZWQgaW4gdGhlIHByZWFtYmxlIGZvciBhbGwgUFRYIGF1dGhvcmVkIGJvb2tzXG4gICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICAgICAgaWYgKHR5cGVvZiBQcmlzbSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgUHJpc20uaGlnaGxpZ2h0QWxsVW5kZXIodGhpcy5jb250YWluZXJEaXYpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09IEZ1bmN0aW9ucyBwYXJzaW5nIHZhcmlhYmxlcyAgPT09PVxuICAgID09PT0gIG91dCBvZiBpbnRlcm1lZGlhdGUgSFRNTCAgICA9PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICBmaW5kUXVlc3Rpb24oKSB7XG4gICAgICAgIHZhciBkZWxpbWl0ZXI7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5vcmlnRWxlbS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcmlnRWxlbS5jaGlsZE5vZGVzW2ldLm5vZGVOYW1lID09PSBcIkxJXCIpIHtcbiAgICAgICAgICAgICAgICBkZWxpbWl0ZXIgPSB0aGlzLm9yaWdFbGVtLmNoaWxkTm9kZXNbaV0ub3V0ZXJIVE1MO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBmdWxsdGV4dCA9ICQodGhpcy5vcmlnRWxlbSkuaHRtbCgpO1xuICAgICAgICB2YXIgdGVtcCA9IGZ1bGx0ZXh0LnNwbGl0KGRlbGltaXRlcik7XG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSB0ZW1wWzBdO1xuICAgIH1cblxuICAgIGZpbmRBbnN3ZXJzKCkge1xuICAgICAgICAvLyBDcmVhdGVzIGFuc3dlciBvYmplY3RzIGFuZCBwdXNoZXMgdGhlbSB0byBhbnN3ZXJMaXN0XG4gICAgICAgIC8vIGZvcm1hdDogSUQsIENvcnJlY3QgYm9vbCwgQ29udGVudCAodGV4dClcbiAgICAgICAgdmFyIENoaWxkQW5zd2VyTGlzdCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgkKHRoaXMuY2hpbGRyZW5baV0pLmlzKFwiW2RhdGEtY29tcG9uZW50PWFuc3dlcl1cIikpIHtcbiAgICAgICAgICAgICAgICBDaGlsZEFuc3dlckxpc3QucHVzaCh0aGlzLmNoaWxkcmVuW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IENoaWxkQW5zd2VyTGlzdC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdmFyIGFuc3dlcl9pZCA9ICQoQ2hpbGRBbnN3ZXJMaXN0W2pdKS5hdHRyKFwiaWRcIik7XG4gICAgICAgICAgICB2YXIgaXNfY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKCQoQ2hpbGRBbnN3ZXJMaXN0W2pdKS5pcyhcIltkYXRhLWNvcnJlY3RdXCIpKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgZGF0YS1jb3JyZWN0IGF0dHJpYnV0ZSBleGlzdHMsIGFuc3dlciBpcyBjb3JyZWN0XG4gICAgICAgICAgICAgICAgaXNfY29ycmVjdCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYW5zd2VyX3RleHQgPSAkKENoaWxkQW5zd2VyTGlzdFtqXSkuaHRtbCgpO1xuICAgICAgICAgICAgdmFyIGFuc3dlcl9vYmplY3QgPSB7XG4gICAgICAgICAgICAgICAgaWQ6IGFuc3dlcl9pZCxcbiAgICAgICAgICAgICAgICBjb3JyZWN0OiBpc19jb3JyZWN0LFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGFuc3dlcl90ZXh0LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyTGlzdC5wdXNoKGFuc3dlcl9vYmplY3QpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmluZEZlZWRiYWNrcygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoJCh0aGlzLmNoaWxkcmVuW2ldKS5pcyhcIltkYXRhLWNvbXBvbmVudD1mZWVkYmFja11cIikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWRiYWNrTGlzdC5wdXNoKHRoaXMuY2hpbGRyZW5baV0uaW5uZXJIVE1MKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUNvcnJlY3RMaXN0KCkge1xuICAgICAgICAvLyBDcmVhdGVzIGFycmF5IHRoYXQgaG9sZHMgdGhlIElEXCJzIG9mIGNvcnJlY3QgYW5zd2Vyc1xuICAgICAgICAvLyBBbHNvIHBvcHVsYXRlcyBhbiBhcnJheSB0aGF0IGhvbGRzIHRoZSBpbmRlY2VzIG9mIGNvcnJlY3QgYW5zd2Vyc1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYW5zd2VyTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuYW5zd2VyTGlzdFtpXS5jb3JyZWN0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0TGlzdC5wdXNoKHRoaXMuYW5zd2VyTGlzdFtpXS5pZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0SW5kZXhMaXN0LnB1c2goaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09ICAgRnVuY3Rpb25zIGdlbmVyYXRpbmcgZmluYWwgSFRNTCAgID09PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICBjcmVhdGVNQ0Zvcm0oKSB7XG4gICAgICAgIHRoaXMucmVuZGVyTUNDb250YWluZXIoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJNQ0Zvcm0oKTsgLy8gcmVuZGVycyB0aGUgZm9ybSB3aXRoIG9wdGlvbnMgYW5kIGJ1dHRvbnNcbiAgICAgICAgdGhpcy5yZW5kZXJNQ2ZlZWRiYWNrRGl2KCk7XG4gICAgICAgIC8vIHJlcGxhY2VzIGludGVybWVkaWF0ZSBIVE1MIHdpdGggcmVuZGVyZWQgSFRNTFxuICAgICAgICAkKHRoaXMub3JpZ0VsZW0pLnJlcGxhY2VXaXRoKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICB9XG5cbiAgICByZW5kZXJNQ0NvbnRhaW5lcigpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAkKHRoaXMuY29udGFpbmVyRGl2KS5odG1sKHRoaXMucXVlc3Rpb24pO1xuICAgICAgICAkKHRoaXMuY29udGFpbmVyRGl2KS5hZGRDbGFzcyh0aGlzLm9yaWdFbGVtLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuaWQgPSB0aGlzLmRpdmlkO1xuICAgIH1cblxuICAgIHJlbmRlck1DRm9ybSgpIHtcbiAgICAgICAgdGhpcy5vcHRzRm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpO1xuICAgICAgICB0aGlzLm9wdHNGb3JtLmlkID0gdGhpcy5kaXZpZCArIFwiX2Zvcm1cIjtcbiAgICAgICAgJCh0aGlzLm9wdHNGb3JtKS5hdHRyKHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJnZXRcIixcbiAgICAgICAgICAgIGFjdGlvbjogXCJcIixcbiAgICAgICAgICAgIG9uc3VibWl0OiBcInJldHVybiBmYWxzZTtcIixcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGdlbmVyYXRlIGZvcm0gb3B0aW9uc1xuICAgICAgICB0aGlzLnJlbmRlck1DRm9ybU9wdHMoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJNQ0Zvcm1CdXR0b25zKCk7XG4gICAgICAgIC8vIEFwcGVuZCB0aGUgZm9ybSB0byB0aGUgY29udGFpbmVyXG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMub3B0c0Zvcm0pO1xuICAgIH1cblxuICAgIHJlbmRlck1DRm9ybU9wdHMoKSB7XG4gICAgICAgIC8vIGNyZWF0ZXMgaW5wdXQgRE9NIGVsZW1lbnRzXG4gICAgICAgIHRoaXMub3B0aW9uQXJyYXkgPSBbXTsgLy8gYXJyYXkgd2l0aCBhbiBvYmplY3QgZm9yIGVhY2ggb3B0aW9uIGNvbnRhaW5pbmcgdGhlIGlucHV0IGFuZCBsYWJlbCBmb3IgdGhhdCBvcHRpb25cbiAgICAgICAgdmFyIGlucHV0X3R5cGUgPSBcInJhZGlvXCI7XG4gICAgICAgIGlmICh0aGlzLm11bHRpcGxlYW5zd2Vycykge1xuICAgICAgICAgICAgaW5wdXRfdHlwZSA9IFwiY2hlY2tib3hcIjtcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGlzLmluZGV4QXJyYXkgaXMgdXNlZCB0byBpbmRleCB0aHJvdWdoIHRoZSBhbnN3ZXJzXG4gICAgICAgIC8vIGl0IGlzIGp1c3QgMC1uIG5vcm1hbGx5LCBidXQgdGhlIG9yZGVyIGlzIHNodWZmbGVkIGlmIHRoZSByYW5kb20gb3B0aW9uIGlzIHByZXNlbnRcbiAgICAgICAgdGhpcy5pbmRleEFycmF5ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hbnN3ZXJMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmluZGV4QXJyYXkucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5yYW5kb20pIHtcbiAgICAgICAgICAgIHRoaXMucmFuZG9taXplQW5zd2VycygpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IGFuc3dlckZ1bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLmlzQW5zd2VyZWQgPSB0cnVlO1xuICAgICAgICB9O1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuYW5zd2VyTGlzdC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdmFyIGsgPSB0aGlzLmluZGV4QXJyYXlbal07XG4gICAgICAgICAgICB2YXIgb3B0aWQgPSB0aGlzLmRpdmlkICsgXCJfb3B0X1wiICsgaztcbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgbGFiZWwgZm9yIHRoZSBpbnB1dFxuICAgICAgICAgICAgdmFyIGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgICAgICAgICAgLy8gSWYgdGhlIGNvbnRlbnQgYmVnaW5zIHdpdGggYSBgYDxwPmBgLCBwdXQgdGhlIGxhYmVsIGluc2lkZSBvZiBpdC4gKFNwaGlueCAyLjAgcHV0cyBhbGwgY29udGVudCBpbiBhIGBgPHA+YGAsIHdoaWxlIFNwaGlueCAxLjggZG9lc24ndCkuXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IHRoaXMuYW5zd2VyTGlzdFtrXS5jb250ZW50O1xuICAgICAgICAgICAgdmFyIHByZWZpeCA9IFwiXCI7XG4gICAgICAgICAgICBpZiAoY29udGVudC5zdGFydHNXaXRoKFwiPHA+XCIpKSB7XG4gICAgICAgICAgICAgICAgcHJlZml4ID0gXCI8cD5cIjtcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5zbGljZSgzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQobGFiZWwpLmh0bWwoXG4gICAgICAgICAgICAgICAgYCR7cHJlZml4fTxpbnB1dCB0eXBlPVwiJHtpbnB1dF90eXBlfVwiIG5hbWU9XCJncm91cDFcIiB2YWx1ZT0ke2t9IGlkPSR7b3B0aWR9PiR7U3RyaW5nLmZyb21DaGFyQ29kZShcbiAgICAgICAgICAgICAgICAgICAgXCJBXCIuY2hhckNvZGVBdCgwKSArIGpcbiAgICAgICAgICAgICAgICApfS4gJHtjb250ZW50fWBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAvLyBjcmVhdGUgdGhlIG9iamVjdCB0byBzdG9yZSBpbiBvcHRpb25BcnJheVxuICAgICAgICAgICAgdmFyIG9wdE9iaiA9IHtcbiAgICAgICAgICAgICAgICBpbnB1dDogJChsYWJlbCkuZmluZChcImlucHV0XCIpWzBdLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBvcHRPYmouaW5wdXQub25jbGljayA9IGFuc3dlckZ1bmM7XG5cbiAgICAgICAgICAgIHRoaXMub3B0aW9uQXJyYXkucHVzaChvcHRPYmopO1xuICAgICAgICAgICAgLy8gYWRkIHRoZSBvcHRpb24gdG8gdGhlIGZvcm1cbiAgICAgICAgICAgIHRoaXMub3B0c0Zvcm0uYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgICAgICAgICAgdGhpcy5vcHRzRm9ybS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyTUNGb3JtQnV0dG9ucygpIHtcbiAgICAgICAgLy8gc3VibWl0IGFuZCBjb21wYXJlIG1lIGJ1dHRvbnNcbiAgICAgICAgLy8gQ3JlYXRlIHN1Ym1pdCBidXR0b25cbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi50ZXh0Q29udGVudCA9IFwiQ2hlY2sgTWVcIjtcbiAgICAgICAgJCh0aGlzLnN1Ym1pdEJ1dHRvbikuYXR0cih7XG4gICAgICAgICAgICBjbGFzczogXCJidG4gYnRuLXN1Y2Nlc3NcIixcbiAgICAgICAgICAgIG5hbWU6IFwiZG8gYW5zd2VyXCIsXG4gICAgICAgICAgICB0eXBlOiBcImJ1dHRvblwiLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc01DTUFTdWJtaXNzaW9uKHRydWUpO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NNQ01GU3VibWlzc2lvbih0cnVlKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gLy8gZW5kIGVsc2VcbiAgICAgICAgdGhpcy5vcHRzRm9ybS5hcHBlbmRDaGlsZCh0aGlzLnN1Ym1pdEJ1dHRvbik7XG4gICAgICAgIC8vIENyZWF0ZSBjb21wYXJlIGJ1dHRvblxuICAgICAgICBpZiAodGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcyAmJiAhZUJvb2tDb25maWcucGVlcikge1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgICAgICQodGhpcy5jb21wYXJlQnV0dG9uKS5hdHRyKHtcbiAgICAgICAgICAgICAgICBjbGFzczogXCJidG4gYnRuLWRlZmF1bHRcIixcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5kaXZpZCArIFwiX2Jjb21wXCIsXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ6IFwiXCIsXG4gICAgICAgICAgICAgICAgbmFtZTogXCJjb21wYXJlXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbi50ZXh0Q29udGVudCA9IFwiQ29tcGFyZSBtZVwiO1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wYXJlQW5zd2Vycyh0aGlzLmRpdmlkKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLm9wdHNGb3JtLmFwcGVuZENoaWxkKHRoaXMuY29tcGFyZUJ1dHRvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXJNQ2ZlZWRiYWNrRGl2KCkge1xuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5pZCA9IHRoaXMuZGl2aWQgKyBcIl9mZWVkYmFja1wiO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmZlZWRCYWNrRGl2KTtcbiAgICB9XG5cbiAgICByYW5kb21pemVBbnN3ZXJzKCkge1xuICAgICAgICAvLyBNYWtlcyB0aGUgb3JkZXJpbmcgb2YgdGhlIGFuc3dlciBjaG9pY2VzIHJhbmRvbVxuICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gdGhpcy5pbmRleEFycmF5Lmxlbmd0aCxcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlLFxuICAgICAgICAgICAgcmFuZG9tSW5kZXg7XG4gICAgICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXG4gICAgICAgIHdoaWxlIChjdXJyZW50SW5kZXggIT09IDApIHtcbiAgICAgICAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xuICAgICAgICAgICAgY3VycmVudEluZGV4IC09IDE7XG4gICAgICAgICAgICAvLyBBbmQgc3dhcCBpdCB3aXRoIHRoZSBjdXJyZW50IGVsZW1lbnQuXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IHRoaXMuaW5kZXhBcnJheVtjdXJyZW50SW5kZXhdO1xuICAgICAgICAgICAgdGhpcy5pbmRleEFycmF5W2N1cnJlbnRJbmRleF0gPSB0aGlzLmluZGV4QXJyYXlbcmFuZG9tSW5kZXhdO1xuICAgICAgICAgICAgdGhpcy5pbmRleEFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xuICAgICAgICAgICAgdmFyIHRlbXBvcmFyeUZlZWRiYWNrID0gdGhpcy5mZWVkYmFja0xpc3RbY3VycmVudEluZGV4XTtcbiAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tMaXN0W2N1cnJlbnRJbmRleF0gPSB0aGlzLmZlZWRiYWNrTGlzdFtyYW5kb21JbmRleF07XG4gICAgICAgICAgICB0aGlzLmZlZWRiYWNrTGlzdFtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlGZWVkYmFjaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT0gQ2hlY2tpbmcvbG9hZGluZyBmcm9tIHN0b3JhZ2UgPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIHJlc3RvcmVBbnN3ZXJzKGRhdGEpIHtcbiAgICAgICAgLy8gUmVzdG9yZSBhbnN3ZXJzIGZyb20gc3RvcmFnZSByZXRyaWV2YWwgZG9uZSBpbiBSdW5lc3RvbmVCYXNlXG4gICAgICAgIC8vIHNvbWV0aW1lcyBkYXRhLmFuc3dlciBjYW4gYmUgbnVsbFxuICAgICAgICBpZiAoIWRhdGEuYW5zd2VyKSB7XG4gICAgICAgICAgICBkYXRhLmFuc3dlciA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGFuc3dlcnMgPSBkYXRhLmFuc3dlci5zcGxpdChcIixcIik7XG4gICAgICAgIGZvciAodmFyIGEgPSAwOyBhIDwgYW5zd2Vycy5sZW5ndGg7IGErKykge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gYW5zd2Vyc1thXTtcbiAgICAgICAgICAgIGZvciAodmFyIGIgPSAwOyBiIDwgdGhpcy5vcHRpb25BcnJheS5sZW5ndGg7IGIrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbkFycmF5W2JdLmlucHV0LnZhbHVlID09IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5vcHRpb25BcnJheVtiXS5pbnB1dCkuYXR0cihcImNoZWNrZWRcIiwgXCJ0cnVlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZWFuc3dlcnMpIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc01DTUFTdWJtaXNzaW9uKGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc01DTUZTdWJtaXNzaW9uKGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoZWNrTG9jYWxTdG9yYWdlKCkge1xuICAgICAgICAvLyBSZXBvcHVsYXRlcyBNQ01BIHF1ZXN0aW9ucyB3aXRoIGEgdXNlcidzIHByZXZpb3VzIGFuc3dlcnMsXG4gICAgICAgIC8vIHdoaWNoIHdlcmUgc3RvcmVkIGludG8gbG9jYWwgc3RvcmFnZS5cbiAgICAgICAgdmFyIHN0b3JlZERhdGE7XG4gICAgICAgIHZhciBhbnN3ZXJzO1xuICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGVuID0gbG9jYWxTdG9yYWdlLmxlbmd0aDtcbiAgICAgICAgaWYgKGxlbiA+IDApIHtcbiAgICAgICAgICAgIHZhciBleCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgICAgaWYgKGV4ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmVkRGF0YSA9IEpTT04ucGFyc2UoZXgpO1xuICAgICAgICAgICAgICAgICAgICBhbnN3ZXJzID0gc3RvcmVkRGF0YS5hbnN3ZXIuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAvLyBlcnJvciB3aGlsZSBwYXJzaW5nOyBsaWtlbHkgZHVlIHRvIGJhZCB2YWx1ZSBzdG9yZWQgaW4gc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGEgPSAwOyBhIDwgYW5zd2Vycy5sZW5ndGg7IGErKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBhbnN3ZXJzW2FdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBiID0gMDsgYiA8IHRoaXMub3B0aW9uQXJyYXkubGVuZ3RoOyBiKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbkFycmF5W2JdLmlucHV0LnZhbHVlID09IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzLm9wdGlvbkFycmF5W2JdLmlucHV0KS5hdHRyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNoZWNrZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlTUNDb21wYXJpc29uKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0U3VibWl0dGVkT3B0cygpOyAvLyB0byBwb3B1bGF0ZSBnaXZlbmxvZyBmb3IgbG9nZ2luZ1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tdWx0aXBsZWFuc3dlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nTUNNQXN1Ym1pc3Npb24oKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nTUNNRnN1Ym1pc3Npb24oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldExvY2FsU3RvcmFnZShkYXRhKSB7XG4gICAgICAgIHZhciB0aW1lU3RhbXAgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB2YXIgc3RvcmFnZU9iaiA9IHtcbiAgICAgICAgICAgIGFuc3dlcjogZGF0YS5hbnN3ZXIsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IHRpbWVTdGFtcCxcbiAgICAgICAgICAgIGNvcnJlY3Q6IGRhdGEuY29ycmVjdCxcbiAgICAgICAgfTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZUtleSgpLFxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoc3RvcmFnZU9iailcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT0gUHJvY2Vzc2luZyBNQyBTdWJtaXNzaW9ucyA9PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICBwcm9jZXNzTUNNQVN1Ym1pc3Npb24obG9nRmxhZykge1xuICAgICAgICAvLyBDYWxsZWQgd2hlbiB0aGUgc3VibWl0IGJ1dHRvbiBpcyBjbGlja2VkXG4gICAgICAgIHRoaXMuZ2V0U3VibWl0dGVkT3B0cygpOyAvLyBtYWtlIHN1cmUgdGhpcy5naXZlbkFycmF5IGlzIHBvcHVsYXRlZFxuICAgICAgICB0aGlzLnNjb3JlTUNNQVN1Ym1pc3Npb24oKTtcbiAgICAgICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2Uoe1xuICAgICAgICAgICAgY29ycmVjdDogdGhpcy5jb3JyZWN0ID8gXCJUXCIgOiBcIkZcIixcbiAgICAgICAgICAgIGFuc3dlcjogdGhpcy5naXZlbkFycmF5LmpvaW4oXCIsXCIpLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGxvZ0ZsYWcpIHtcbiAgICAgICAgICAgIHRoaXMubG9nTUNNQXN1Ym1pc3Npb24oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVCb29rQ29uZmlnLnBlZXIgfHwgZUJvb2tDb25maWcuaXNJbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlck1DTUFGZWVkQmFjaygpO1xuICAgICAgICAgICAgaWYgKHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZU1DQ29tcGFyaXNvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gYWNrbm93bGVkZ2Ugc3VibWlzc2lvblxuICAgICAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5odG1sKFwiPHA+WW91ciBBbnN3ZXIgaGFzIGJlZW4gcmVjb3JkZWQ8L3A+XCIpO1xuICAgICAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5hdHRyKFwiY2xhc3NcIiwgXCJhbGVydCBhbGVydC1pbmZvXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0U3VibWl0dGVkT3B0cygpIHtcbiAgICAgICAgdmFyIGdpdmVuO1xuICAgICAgICB0aGlzLnNpbmdsZWZlZWRiYWNrID0gXCJcIjsgLy8gVXNlZCBmb3IgTUNNRiBxdWVzdGlvbnNcbiAgICAgICAgdGhpcy5mZWVkYmFja1N0cmluZyA9IFwiXCI7IC8vIFVzZWQgZm9yIE1DTUEgcXVlc3Rpb25zXG4gICAgICAgIHRoaXMuZ2l2ZW5BcnJheSA9IFtdO1xuICAgICAgICB0aGlzLmdpdmVubG9nID0gXCJcIjtcbiAgICAgICAgdmFyIGJ1dHRvbk9ianMgPSB0aGlzLm9wdHNGb3JtLmVsZW1lbnRzLmdyb3VwMTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBidXR0b25PYmpzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYnV0dG9uT2Jqc1tpXS5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgZ2l2ZW4gPSBidXR0b25PYmpzW2ldLnZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2l2ZW5BcnJheS5wdXNoKGdpdmVuKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWRiYWNrU3RyaW5nICs9IGA8bGkgdmFsdWU9XCIke2kgKyAxfVwiPiR7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tMaXN0W2ldXG4gICAgICAgICAgICAgICAgfTwvbGk+YDtcbiAgICAgICAgICAgICAgICB0aGlzLmdpdmVubG9nICs9IGdpdmVuICsgXCIsXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5zaW5nbGVmZWVkYmFjayA9IHRoaXMuZmVlZGJhY2tMaXN0W2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2l2ZW5BcnJheS5zb3J0KCk7XG4gICAgfVxuXG4gICAgY2hlY2tDdXJyZW50QW5zd2VyKCkge1xuICAgICAgICB0aGlzLmdldFN1Ym1pdHRlZE9wdHMoKTtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3JlTUNNQVN1Ym1pc3Npb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcmVNQ01GU3VibWlzc2lvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgbG9nQ3VycmVudEFuc3dlcihzaWQpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmxvZ01DTUFzdWJtaXNzaW9uKHNpZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmxvZ01DTUZzdWJtaXNzaW9uKHNpZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXJGZWVkYmFjaygpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlck1DTUFGZWVkQmFjaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJNQ01GRmVlZGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzY29yZU1DTUFTdWJtaXNzaW9uKCkge1xuICAgICAgICB0aGlzLmNvcnJlY3RDb3VudCA9IDA7XG4gICAgICAgIHZhciBjb3JyZWN0SW5kZXggPSAwO1xuICAgICAgICB2YXIgZ2l2ZW5JbmRleCA9IDA7XG4gICAgICAgIHdoaWxlIChcbiAgICAgICAgICAgIGNvcnJlY3RJbmRleCA8IHRoaXMuY29ycmVjdEluZGV4TGlzdC5sZW5ndGggJiZcbiAgICAgICAgICAgIGdpdmVuSW5kZXggPCB0aGlzLmdpdmVuQXJyYXkubGVuZ3RoXG4gICAgICAgICkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHRoaXMuZ2l2ZW5BcnJheVtnaXZlbkluZGV4XSA8XG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0SW5kZXhMaXN0W2NvcnJlY3RJbmRleF1cbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGdpdmVuSW5kZXgrKztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgdGhpcy5naXZlbkFycmF5W2dpdmVuSW5kZXhdID09XG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0SW5kZXhMaXN0W2NvcnJlY3RJbmRleF1cbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdENvdW50Kys7XG4gICAgICAgICAgICAgICAgZ2l2ZW5JbmRleCsrO1xuICAgICAgICAgICAgICAgIGNvcnJlY3RJbmRleCsrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb3JyZWN0SW5kZXgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgbnVtR2l2ZW4gPSB0aGlzLmdpdmVuQXJyYXkubGVuZ3RoO1xuICAgICAgICB2YXIgbnVtQ29ycmVjdCA9IHRoaXMuY29ycmVjdENvdW50O1xuICAgICAgICB2YXIgbnVtTmVlZGVkID0gdGhpcy5jb3JyZWN0TGlzdC5sZW5ndGg7XG4gICAgICAgIHRoaXMuYW5zd2VyID0gdGhpcy5naXZlbkFycmF5LmpvaW4oXCIsXCIpO1xuICAgICAgICB0aGlzLmNvcnJlY3QgPSBudW1Db3JyZWN0ID09PSBudW1OZWVkZWQgJiYgbnVtTmVlZGVkID09PSBudW1HaXZlbjtcbiAgICAgICAgaWYgKG51bUdpdmVuID09PSBudW1OZWVkZWQpIHtcbiAgICAgICAgICAgIHRoaXMucGVyY2VudCA9IG51bUNvcnJlY3QgLyBudW1OZWVkZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBlcmNlbnQgPSBudW1Db3JyZWN0IC8gTWF0aC5tYXgobnVtR2l2ZW4sIG51bU5lZWRlZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBsb2dNQ01Bc3VibWlzc2lvbihzaWQpIHtcbiAgICAgICAgdmFyIGFuc3dlciA9IHRoaXMuYW5zd2VyIHx8IFwiXCI7XG4gICAgICAgIHZhciBjb3JyZWN0ID0gdGhpcy5jb3JyZWN0IHx8IFwiRlwiO1xuICAgICAgICB2YXIgbG9nQW5zd2VyID1cbiAgICAgICAgICAgIFwiYW5zd2VyOlwiICsgYW5zd2VyICsgXCI6XCIgKyAoY29ycmVjdCA9PSBcIlRcIiA/IFwiY29ycmVjdFwiIDogXCJub1wiKTtcbiAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICBldmVudDogXCJtQ2hvaWNlXCIsXG4gICAgICAgICAgICBhY3Q6IGxvZ0Fuc3dlcixcbiAgICAgICAgICAgIGFuc3dlcjogYW5zd2VyLFxuICAgICAgICAgICAgY29ycmVjdDogY29ycmVjdCxcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGVCb29rQ29uZmlnLnBlZXIgJiYgdHlwZW9mIHN0dWRlbnRWb3RlQ291bnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGRhdGEuYWN0ID0gZGF0YS5hY3QgKyBgOnZvdGUke3N0dWRlbnRWb3RlQ291bnR9YDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHNpZCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZGF0YS5zaWQgPSBzaWQ7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgdGhpcy5sb2dCb29rRXZlbnQoZGF0YSk7XG4gICAgfVxuXG4gICAgcmVuZGVyTUNNQUZlZWRCYWNrKCkge1xuICAgICAgICB2YXIgYW5zd2VyU3RyID0gXCJhbnN3ZXJzXCI7XG4gICAgICAgIHZhciBudW1HaXZlbiA9IHRoaXMuZ2l2ZW5BcnJheS5sZW5ndGg7XG4gICAgICAgIGlmIChudW1HaXZlbiA9PT0gMSkge1xuICAgICAgICAgICAgYW5zd2VyU3RyID0gXCJhbnN3ZXJcIjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbnVtQ29ycmVjdCA9IHRoaXMuY29ycmVjdENvdW50O1xuICAgICAgICB2YXIgbnVtTmVlZGVkID0gdGhpcy5jb3JyZWN0TGlzdC5sZW5ndGg7XG4gICAgICAgIHZhciBmZWVkYmFja1RleHQgPSB0aGlzLmZlZWRiYWNrU3RyaW5nO1xuICAgICAgICBpZiAodGhpcy5jb3JyZWN0KSB7XG4gICAgICAgICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmh0bWwoYOKclO+4jyA8b2wgdHlwZT1cIkFcIj4ke2ZlZWRiYWNrVGV4dH08L3VsPmApO1xuICAgICAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5hdHRyKFwiY2xhc3NcIiwgXCJhbGVydCBhbGVydC1pbmZvXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5odG1sKFxuICAgICAgICAgICAgICAgIGDinJbvuI8gWW91IGdhdmUgJHtudW1HaXZlbn0gJHthbnN3ZXJTdHJ9IGFuZCBnb3QgJHtudW1Db3JyZWN0fSBjb3JyZWN0IG9mICR7bnVtTmVlZGVkfSBuZWVkZWQuPG9sIHR5cGU9XCJBXCI+JHtmZWVkYmFja1RleHR9PC91bD5gXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5hdHRyKFwiY2xhc3NcIiwgXCJhbGVydCBhbGVydC1kYW5nZXJcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm9jZXNzTUNNRlN1Ym1pc3Npb24obG9nRmxhZykge1xuICAgICAgICAvLyBDYWxsZWQgd2hlbiB0aGUgc3VibWl0IGJ1dHRvbiBpcyBjbGlja2VkXG4gICAgICAgIHRoaXMuZ2V0U3VibWl0dGVkT3B0cygpOyAvLyBtYWtlIHN1cmUgdGhpcy5naXZlbkFycmF5IGlzIHBvcHVsYXRlZFxuICAgICAgICB0aGlzLnNjb3JlTUNNRlN1Ym1pc3Npb24oKTtcbiAgICAgICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2Uoe1xuICAgICAgICAgICAgY29ycmVjdDogdGhpcy5jb3JyZWN0ID8gXCJUXCIgOiBcIkZcIixcbiAgICAgICAgICAgIGFuc3dlcjogdGhpcy5naXZlbkFycmF5LmpvaW4oXCIsXCIpLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGxvZ0ZsYWcpIHtcbiAgICAgICAgICAgIHRoaXMubG9nTUNNRnN1Ym1pc3Npb24oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVCb29rQ29uZmlnLnBlZXIgfHwgZUJvb2tDb25maWcuaXNJbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlck1DTUZGZWVkYmFjaygpO1xuICAgICAgICAgICAgaWYgKHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZU1DQ29tcGFyaXNvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gYWNrbm93bGVkZ2Ugc3VibWlzc2lvblxuICAgICAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5odG1sKFwiPHA+WW91ciBBbnN3ZXIgaGFzIGJlZW4gcmVjb3JkZWQ8L3A+XCIpO1xuICAgICAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5hdHRyKFwiY2xhc3NcIiwgXCJhbGVydCBhbGVydC1pbmZvXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2NvcmVNQ01GU3VibWlzc2lvbigpIHtcbiAgICAgICAgdGhpcy5hbnN3ZXIgPSB0aGlzLmdpdmVuQXJyYXlbMF07XG4gICAgICAgIGlmICh0aGlzLmdpdmVuQXJyYXlbMF0gPT0gdGhpcy5jb3JyZWN0SW5kZXhMaXN0WzBdKSB7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5wZXJjZW50ID0gMS4wO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZ2l2ZW5BcnJheVswXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAvLyBpZiBnaXZlbiBpcyBudWxsIHRoZW4gdGhlIHF1ZXN0aW9uIHdhc25cInQgYW5zd2VyZWQgYW5kIHNob3VsZCBiZSBjb3VudGVkIGFzIHNraXBwZWRcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5wZXJjZW50ID0gMC4wO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgbG9nTUNNRnN1Ym1pc3Npb24oc2lkKSB7XG4gICAgICAgIC8vIElmIHRoZXJlJ3Mgbm8gYW5zd2VyIHByb3ZpZGVkICh0aGUgYXJyYXkgaXMgZW1wdHkpLCB1c2UgYSBibGFuayBmb3IgdGhlIGFuc3dlci5cbiAgICAgICAgdmFyIGFuc3dlciA9IHRoaXMuZ2l2ZW5BcnJheVswXSB8fCBcIlwiO1xuICAgICAgICB2YXIgY29ycmVjdCA9XG4gICAgICAgICAgICB0aGlzLmdpdmVuQXJyYXlbMF0gPT0gdGhpcy5jb3JyZWN0SW5kZXhMaXN0WzBdID8gXCJUXCIgOiBcIkZcIjtcbiAgICAgICAgdmFyIGxvZ0Fuc3dlciA9XG4gICAgICAgICAgICBcImFuc3dlcjpcIiArIGFuc3dlciArIFwiOlwiICsgKGNvcnJlY3QgPT0gXCJUXCIgPyBcImNvcnJlY3RcIiA6IFwibm9cIik7IC8vIGJhY2t3YXJkIGNvbXBhdGlibGVcbiAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICBldmVudDogXCJtQ2hvaWNlXCIsXG4gICAgICAgICAgICBhY3Q6IGxvZ0Fuc3dlcixcbiAgICAgICAgICAgIGFuc3dlcjogYW5zd2VyLFxuICAgICAgICAgICAgY29ycmVjdDogY29ycmVjdCxcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGVCb29rQ29uZmlnLnBlZXIgJiYgdHlwZW9mIHN0dWRlbnRWb3RlQ291bnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGRhdGEuYWN0ID0gZGF0YS5hY3QgKyBgOnZvdGUke3N0dWRlbnRWb3RlQ291bnR9YDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHNpZCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZGF0YS5zaWQgPSBzaWQ7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgdGhpcy5sb2dCb29rRXZlbnQoZGF0YSk7XG4gICAgfVxuXG4gICAgcmVuZGVyTUNNRkZlZWRiYWNrKCkge1xuICAgICAgICBsZXQgY29ycmVjdCA9IHRoaXMuZ2l2ZW5BcnJheVswXSA9PSB0aGlzLmNvcnJlY3RJbmRleExpc3RbMF07XG4gICAgICAgIGxldCBmZWVkYmFja1RleHQgPSB0aGlzLnNpbmdsZWZlZWRiYWNrO1xuXG4gICAgICAgIGlmIChjb3JyZWN0KSB7XG4gICAgICAgICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmh0bWwoXCLinJTvuI8gXCIgKyBmZWVkYmFja1RleHQpO1xuICAgICAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5hdHRyKFwiY2xhc3NcIiwgXCJhbGVydCBhbGVydC1pbmZvXCIpOyAvLyB1c2UgYmx1ZSBmb3IgYmV0dGVyIHJlZC9ncmVlbiBibHVlIGNvbG9yIGJsaW5kbmVzc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZlZWRiYWNrVGV4dCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmVlZGJhY2tUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQodGhpcy5mZWVkQmFja0RpdikuaHRtbChcIuKclu+4jyBcIiArIGZlZWRiYWNrVGV4dCk7XG4gICAgICAgICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWRhbmdlclwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbmFibGVNQ0NvbXBhcmlzb24oKSB7XG4gICAgICAgIGlmIChlQm9va0NvbmZpZy5lbmFibGVDb21wYXJlTWUpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGluc3RydWN0b3JNY2hvaWNlTW9kYWwoZGF0YSkge1xuICAgICAgICAvLyBkYXRhLnJlc2xpc3QgLS0gc3R1ZGVudCBhbmQgdGhlaXIgYW5zd2Vyc1xuICAgICAgICAvLyBkYXRhLmFuc3dlckRpY3QgICAgLS0gYW5zd2VycyBhbmQgY291bnRcbiAgICAgICAgLy8gZGF0YS5jb3JyZWN0IC0gY29ycmVjdCBhbnN3ZXJcbiAgICAgICAgdmFyIHJlcyA9IFwiPHRhYmxlPjx0cj48dGg+U3R1ZGVudDwvdGg+PHRoPkFuc3dlcihzKTwvdGg+PC90cj5cIjtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBkYXRhKSB7XG4gICAgICAgICAgICByZXMgKz1cbiAgICAgICAgICAgICAgICBcIjx0cj48dGQ+XCIgK1xuICAgICAgICAgICAgICAgIGRhdGFbaV1bMF0gK1xuICAgICAgICAgICAgICAgIFwiPC90ZD48dGQ+XCIgK1xuICAgICAgICAgICAgICAgIGRhdGFbaV1bMV0gK1xuICAgICAgICAgICAgICAgIFwiPC90ZD48L3RyPlwiO1xuICAgICAgICB9XG4gICAgICAgIHJlcyArPSBcIjwvdGFibGU+XCI7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICAgIGNvbXBhcmVNb2RhbChkYXRhLCBzdGF0dXMsIHdoYXRldmVyKSB7XG4gICAgICAgIHZhciBkYXRhZGljdCA9IGRhdGEuZGV0YWlsO1xuICAgICAgICB2YXIgYW5zd2VycyA9IGRhdGFkaWN0LmFuc3dlckRpY3Q7XG4gICAgICAgIHZhciBtaXNjID0gZGF0YWRpY3QubWlzYztcbiAgICAgICAgdmFyIGtsID0gT2JqZWN0LmtleXMoYW5zd2Vycykuc29ydCgpO1xuICAgICAgICB2YXIgYm9keSA9IFwiPHRhYmxlPlwiO1xuICAgICAgICBib2R5ICs9IFwiPHRyPjx0aD5BbnN3ZXI8L3RoPjx0aD5QZXJjZW50PC90aD48L3RyPlwiO1xuICAgICAgICB2YXIgdGhlQ2xhc3MgPSBcIlwiO1xuICAgICAgICBmb3IgKHZhciBrIGluIGtsKSB7XG4gICAgICAgICAgICBpZiAoa2xba10gPT09IG1pc2MuY29ycmVjdCkge1xuICAgICAgICAgICAgICAgIHRoZUNsYXNzID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoZUNsYXNzID0gXCJpbmZvXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBib2R5ICs9XG4gICAgICAgICAgICAgICAgXCI8dHI+PHRkPlwiICsga2xba10gKyBcIjwvdGQ+PHRkIGNsYXNzPSdjb21wYXJlLW1lLXByb2dyZXNzJz5cIjtcbiAgICAgICAgICAgIHZhciBwY3QgPSBhbnN3ZXJzW2tsW2tdXSArIFwiJVwiO1xuICAgICAgICAgICAgYm9keSArPSBcIjxkaXYgY2xhc3M9J3Byb2dyZXNzJz5cIjtcbiAgICAgICAgICAgIGJvZHkgKz1cbiAgICAgICAgICAgICAgICBcIiAgICA8ZGl2IGNsYXNzPSdwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLVwiICtcbiAgICAgICAgICAgICAgICB0aGVDbGFzcyArXG4gICAgICAgICAgICAgICAgXCInIHN0eWxlPSd3aWR0aDpcIiArXG4gICAgICAgICAgICAgICAgcGN0ICtcbiAgICAgICAgICAgICAgICBcIjsnPlwiICtcbiAgICAgICAgICAgICAgICBwY3Q7XG4gICAgICAgICAgICBib2R5ICs9IFwiICAgIDwvZGl2PlwiO1xuICAgICAgICAgICAgYm9keSArPSBcIjwvZGl2PjwvdGQ+PC90cj5cIjtcbiAgICAgICAgfVxuICAgICAgICBib2R5ICs9IFwiPC90YWJsZT5cIjtcbiAgICAgICAgaWYgKG1pc2MueW91cnBjdCAhPT0gXCJ1bmF2YWlsYWJsZVwiKSB7XG4gICAgICAgICAgICBib2R5ICs9XG4gICAgICAgICAgICAgICAgXCI8YnIgLz48cD5Zb3UgaGF2ZSBcIiArXG4gICAgICAgICAgICAgICAgbWlzYy55b3VycGN0ICtcbiAgICAgICAgICAgICAgICBcIiUgY29ycmVjdCBmb3IgYWxsIHF1ZXN0aW9uczwvcD5cIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YWRpY3QucmVzbGlzdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBib2R5ICs9IHRoaXMuaW5zdHJ1Y3Rvck1jaG9pY2VNb2RhbChkYXRhZGljdC5yZXNsaXN0KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaHRtbCA9XG4gICAgICAgICAgICBcIjxkaXYgY2xhc3M9J21vZGFsIGZhZGUnPlwiICtcbiAgICAgICAgICAgIFwiICAgIDxkaXYgY2xhc3M9J21vZGFsLWRpYWxvZyBjb21wYXJlLW1vZGFsJz5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtY29udGVudCc+XCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1oZWFkZXInPlwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzcz0nY2xvc2UnIGRhdGEtZGlzbWlzcz0nbW9kYWwnIGFyaWEtaGlkZGVuPSd0cnVlJz4mdGltZXM7PC9idXR0b24+XCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgPGg0IGNsYXNzPSdtb2RhbC10aXRsZSc+RGlzdHJpYnV0aW9uIG9mIEFuc3dlcnM8L2g0PlwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgPC9kaXY+XCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1ib2R5Jz5cIiArXG4gICAgICAgICAgICBib2R5ICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgPC9kaXY+XCIgK1xuICAgICAgICAgICAgXCIgICAgICAgIDwvZGl2PlwiICtcbiAgICAgICAgICAgIFwiICAgIDwvZGl2PlwiICtcbiAgICAgICAgICAgIFwiPC9kaXY+XCI7XG4gICAgICAgIHZhciBlbCA9ICQoaHRtbCk7XG4gICAgICAgIGVsLm1vZGFsKCk7XG4gICAgfVxuICAgIC8vIF9gY29tcGFyZUFuc3dlcnNgXG4gICAgY29tcGFyZUFuc3dlcnMoKSB7XG4gICAgICAgIHZhciBkYXRhID0ge307XG4gICAgICAgIGRhdGEuZGl2X2lkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgZGF0YS5jb3Vyc2VfbmFtZSA9IGVCb29rQ29uZmlnLmNvdXJzZTtcbiAgICAgICAgalF1ZXJ5LmdldChcbiAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9hc3Nlc3NtZW50L2dldGFnZ3JlZ2F0ZXJlc3VsdHNgLFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZU1vZGFsLmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBkaXNhYmxlSW50ZXJhY3Rpb24oKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5vcHRpb25BcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25BcnJheVtpXS5pbnB1dC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlbmFibGVJbnRlcmFjdGlvbigpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbkFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbkFycmF5W2ldLmlucHV0LmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PSBGaW5kIHRoZSBjdXN0b20gSFRNTCB0YWdzIGFuZCA9PVxuPT0gICBleGVjdXRlIG91ciBjb2RlIG9uIHRoZW0gICAgPT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4kKGRvY3VtZW50KS5vbihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgJChcIltkYXRhLWNvbXBvbmVudD1tdWx0aXBsZWNob2ljZV1cIikuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgLy8gTUNcbiAgICAgICAgdmFyIG9wdHMgPSB7XG4gICAgICAgICAgICBvcmlnOiB0aGlzLFxuICAgICAgICAgICAgdXNlUnVuZXN0b25lU2VydmljZXM6IGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoJCh0aGlzKS5jbG9zZXN0KFwiW2RhdGEtY29tcG9uZW50PXRpbWVkQXNzZXNzbWVudF1cIikubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIC8vIElmIHRoaXMgZWxlbWVudCBleGlzdHMgd2l0aGluIGEgdGltZWQgY29tcG9uZW50LCBkb24ndCByZW5kZXIgaXQgaGVyZVxuICAgICAgICAgICAgd2luZG93Lm1jTGlzdFt0aGlzLmlkXSA9IG5ldyBNdWx0aXBsZUNob2ljZShvcHRzKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iLCJpbXBvcnQgTXVsdGlwbGVDaG9pY2UgZnJvbSBcIi4vbWNob2ljZS5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lZE1DIGV4dGVuZHMgTXVsdGlwbGVDaG9pY2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgICQodGhpcy5jb250YWluZXJEaXYpLmFkZENsYXNzKFwicnVuZXN0b25lXCIpO1xuICAgICAgICB0aGlzLm5lZWRzUmVpbml0aWFsaXphdGlvbiA9IHRydWU7XG4gICAgICAgIHRoaXMucmVuZGVyVGltZWRJY29uKHRoaXMuTUNDb250YWluZXIpO1xuICAgICAgICB0aGlzLmhpZGVCdXR0b25zKCk7IC8vIERvbid0IHNob3cgcGVyLXF1ZXN0aW9uIGJ1dHRvbnMgaW4gYSB0aW1lZCBhc3Nlc3NtZW50XG4gICAgfVxuXG4gICAgcmVuZGVyVGltZWRJY29uKGNvbXBvbmVudCkge1xuICAgICAgICAvLyByZW5kZXJzIHRoZSBjbG9jayBpY29uIG9uIHRpbWVkIGNvbXBvbmVudHMuICAgIFRoZSBjb21wb25lbnQgcGFyYW1ldGVyXG4gICAgICAgIC8vIGlzIHRoZSBlbGVtZW50IHRoYXQgdGhlIGljb24gc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuICAgICAgICB2YXIgdGltZUljb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2YXIgdGltZUljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICAkKHRpbWVJY29uKS5hdHRyKHtcbiAgICAgICAgICAgIHNyYzogXCIuLi9fc3RhdGljL2Nsb2NrLnBuZ1wiLFxuICAgICAgICAgICAgc3R5bGU6IFwid2lkdGg6MTVweDtoZWlnaHQ6MTVweFwiLFxuICAgICAgICB9KTtcbiAgICAgICAgdGltZUljb25EaXYuY2xhc3NOYW1lID0gXCJ0aW1lVGlwXCI7XG4gICAgICAgIHRpbWVJY29uRGl2LnRpdGxlID0gXCJcIjtcbiAgICAgICAgdGltZUljb25EaXYuYXBwZW5kQ2hpbGQodGltZUljb24pO1xuICAgICAgICAkKGNvbXBvbmVudCkucHJlcGVuZCh0aW1lSWNvbkRpdik7XG4gICAgfVxuICAgIGhpZGVCdXR0b25zKCkge1xuICAgICAgICAvL0p1c3QgaGlkaW5nIHRoZSBidXR0b25zIGRvZXNuJ3QgcHJldmVudCBzdWJtaXR0aW5nIHRoZSBmb3JtIHdoZW4gZW50ZXJpbmcgaXMgY2xpY2tlZFxuICAgICAgICAvL1dlIG5lZWQgdG8gY29tcGxldGVseSBkaXNhYmxlIHRoZSBidXR0b25zXG4gICAgICAgICQodGhpcy5zdWJtaXRCdXR0b24pLmF0dHIoXCJkaXNhYmxlZFwiLCBcInRydWVcIik7XG4gICAgICAgICQodGhpcy5zdWJtaXRCdXR0b24pLmhpZGUoKTtcbiAgICAgICAgJCh0aGlzLmNvbXBhcmVCdXR0b24pLmhpZGUoKTtcbiAgICB9XG5cbiAgICAvLyBUaGVzZSBtZXRob2RzIG92ZXJyaWRlIHRoZSBtZXRob2RzIGluIHRoZSBiYXNlIGNsYXNzLiBDYWxsZWQgZnJvbSByZW5kZXJGZWVkYmFjaygpXG4gICAgLy9cbiAgICByZW5kZXJNQ01BRmVlZEJhY2soKSB7XG4gICAgICAgIHRoaXMuZmVlZGJhY2tUaW1lZE1DKCk7XG4gICAgfVxuICAgIHJlbmRlck1DTUZGZWVkYmFjayh3aGF0ZXZlciwgd2hhdGV2ZXJyKSB7XG4gICAgICAgIHRoaXMuZmVlZGJhY2tUaW1lZE1DKCk7XG4gICAgfVxuICAgIGZlZWRiYWNrVGltZWRNQygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmluZGV4QXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB0bXBpbmRleCA9IHRoaXMuaW5kZXhBcnJheVtpXTtcbiAgICAgICAgICAgICQodGhpcy5mZWVkQmFja0VhY2hBcnJheVtpXSkuaHRtbChcbiAgICAgICAgICAgICAgICBTdHJpbmcuZnJvbUNoYXJDb2RlKDY1ICsgaSkgKyBcIi4gXCIgKyB0aGlzLmZlZWRiYWNrTGlzdFtpXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHZhciB0bXBpZCA9IHRoaXMuYW5zd2VyTGlzdFt0bXBpbmRleF0uaWQ7XG4gICAgICAgICAgICBpZiAodGhpcy5jb3JyZWN0TGlzdC5pbmRleE9mKHRtcGlkKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkQmFja0VhY2hBcnJheVtpXS5jbGFzc0xpc3QuYWRkKFxuICAgICAgICAgICAgICAgICAgICBcImFsZXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYWxlcnQtc3VjY2Vzc1wiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkQmFja0VhY2hBcnJheVtpXS5jbGFzc0xpc3QuYWRkKFxuICAgICAgICAgICAgICAgICAgICBcImFsZXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYWxlcnQtZGFuZ2VyXCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlck1DRm9ybU9wdHMoKSB7XG4gICAgICAgIHN1cGVyLnJlbmRlck1DRm9ybU9wdHMoKTtcbiAgICAgICAgdGhpcy5mZWVkQmFja0VhY2hBcnJheSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuYW5zd2VyTGlzdC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdmFyIGsgPSB0aGlzLmluZGV4QXJyYXlbal07XG4gICAgICAgICAgICB2YXIgZmVlZEJhY2tFYWNoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIGZlZWRCYWNrRWFjaC5pZCA9IHRoaXMuZGl2aWQgKyBcIl9lYWNoRmVlZGJhY2tfXCIgKyBrO1xuICAgICAgICAgICAgZmVlZEJhY2tFYWNoLmNsYXNzTGlzdC5hZGQoXCJlYWNoRmVlZGJhY2tcIik7XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRWFjaEFycmF5LnB1c2goZmVlZEJhY2tFYWNoKTtcbiAgICAgICAgICAgIHRoaXMub3B0c0Zvcm0uYXBwZW5kQ2hpbGQoZmVlZEJhY2tFYWNoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjaGVja0NvcnJlY3RUaW1lZE1DTUEoKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdENvdW50ID09PSB0aGlzLmNvcnJlY3RMaXN0Lmxlbmd0aCAmJlxuICAgICAgICAgICAgdGhpcy5jb3JyZWN0TGlzdC5sZW5ndGggPT09IHRoaXMuZ2l2ZW5BcnJheS5sZW5ndGhcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZ2l2ZW5BcnJheS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gcXVlc3Rpb24gd2FzIHNraXBwZWRcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0aGlzLmNvcnJlY3QpIHtcbiAgICAgICAgICAgIGNhc2UgdHJ1ZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJUXCI7XG4gICAgICAgICAgICBjYXNlIGZhbHNlOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIkZcIjtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2hlY2tDb3JyZWN0VGltZWRNQ01GKCkge1xuICAgICAgICAvLyBSZXR1cm5zIGlmIHRoZSBxdWVzdGlvbiB3YXMgY29ycmVjdCwgaW5jb3JyZWN0LCBvciBza2lwcGVkIChyZXR1cm4gbnVsbCBpbiB0aGUgbGFzdCBjYXNlKVxuICAgICAgICBzd2l0Y2ggKHRoaXMuY29ycmVjdCkge1xuICAgICAgICAgICAgY2FzZSB0cnVlOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIlRcIjtcbiAgICAgICAgICAgIGNhc2UgZmFsc2U6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiRlwiO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjaGVja0NvcnJlY3RUaW1lZCgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVja0NvcnJlY3RUaW1lZE1DTUEoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrQ29ycmVjdFRpbWVkTUNNRigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGhpZGVGZWVkYmFjaygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmZlZWRCYWNrRWFjaEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAkKHRoaXMuZmVlZEJhY2tFYWNoQXJyYXlbaV0pLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlaW5pdGlhbGl6ZUxpc3RlbmVycygpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBsZXQgYW5zd2VyRnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYuaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIGZvciAobGV0IG9wdCBvZiB0aGlzLm9wdGlvbkFycmF5KSB7XG4gICAgICAgICAgICBvcHQuaW5wdXQub25jbGljayA9IGFuc3dlckZ1bmM7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID0ge307XG59XG5cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeS5tdWx0aXBsZWNob2ljZSA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgaWYgKG9wdHMudGltZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW1lZE1DKG9wdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgTXVsdGlwbGVDaG9pY2Uob3B0cyk7XG4gICAgfVxufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==