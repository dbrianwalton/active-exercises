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
        let answerFunc = function() {
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
                function() {
                    this.processMCMASubmission(true);
                }.bind(this),
                false
            );
        } else {
            this.submitButton.addEventListener(
                "click",
                function(ev) {
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
                function() {
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
            if (eBookConfig.peer &&
                eBookConfig.peerMode === "async" &&
                typeof studentVoteCount !== "undefined" &&
                studentVoteCount > 1) {
                this.renderMCMAFeedBack();
            } else {
                $(this.feedBackDiv).html("<p>Your Answer has been recorded</p>");
                $(this.feedBackDiv).attr("class", "alert alert-info");
            }
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
            if (eBookConfig.peer &&
                eBookConfig.peerMode === "async" &&
                typeof studentVoteCount !== "undefined" &&
                studentVoteCount > 1) {
                this.renderMCMAFeedBack();
            } else {
                $(this.feedBackDiv).html("<p>Your Answer has been recorded</p>");
                $(this.feedBackDiv).attr("class", "alert alert-info");
            }
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
$(document).on("runestone:login-complete", function() {
    $("[data-component=multiplechoice]").each(function(index) {
        // MC
        var opts = {
            orig: this,
            useRunestoneServices: eBookConfig.useRunestoneServices,
        };
        if ($(this).closest("[data-component=timedAssessment]").length == 0) {
            // If this element exists within a timed component, don't render it here
            window.componentMap[this.id] = new MultipleChoice(opts);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZV9tY2hvaWNlX2pzX3RpbWVkbWNfanMuYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRTZEO0FBQzdEO0FBQzRCOztBQUU1QjtBQUNlLDZCQUE2QixtRUFBYTtBQUN6RDtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHFDQUFxQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsMEJBQTBCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDRCQUE0QjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3QkFBd0IsMEJBQTBCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDRCQUE0QjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFD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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsNEJBQTRCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDRCQUE0QjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsbUNBQW1DO0FBQzNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLG1CQUFtQixtREFBYztBQUNqQztBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9tY2hvaWNlL2Nzcy9tY2hvaWNlLmNzcz8zZmYxIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvbWNob2ljZS9qcy9tY2hvaWNlLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvbWNob2ljZS9qcy90aW1lZG1jLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09PSAgICAgIE1hc3RlciBtY2hvaWNlLmpzICAgICA9PT09PT09PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gIFRoaXMgZmlsZSBjb250YWlucyB0aGUgSlMgZm9yIHRoZSAgID09PVxuPT09IFJ1bmVzdG9uZSBtdWx0aXBsZSBjaG9pY2UgY29tcG9uZW50LiA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgICAgICAgICAgIENyZWF0ZWQgQnkgICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICBJc2FpYWggTWF5ZXJjaGFrICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgICAgYW5kICAgICAgICAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgICAgS2lyYnkgT2xzb24gICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgICAgIDYvNC8xNSAgICAgICAgICAgICAgICA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qc1wiO1xuLy9pbXBvcnQgXCIuLy4uL3N0eWxlcy9ydW5lc3RvbmUtY3VzdG9tLXNwaGlueC1ib290c3RyYXAuY3NzXCI7XG5pbXBvcnQgXCIuLi9jc3MvbWNob2ljZS5jc3NcIjtcblxuLy8gTUMgY29uc3RydWN0b3JcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11bHRpcGxlQ2hvaWNlIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgb3B0cyA9IG9wdHMgfHwge307XG4gICAgICAgIHZhciBvcmlnID0gb3B0cy5vcmlnOyAvLyBlbnRpcmUgPHVsPiBlbGVtZW50XG4gICAgICAgIHRoaXMub3JpZ0VsZW0gPSBvcmlnO1xuICAgICAgICB0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzID0gb3B0cy51c2VSdW5lc3RvbmVTZXJ2aWNlcztcbiAgICAgICAgdGhpcy5tdWx0aXBsZWFuc3dlcnMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kaXZpZCA9IG9yaWcuaWQ7XG4gICAgICAgIGlmICgkKHRoaXMub3JpZ0VsZW0pLmRhdGEoXCJtdWx0aXBsZWFuc3dlcnNcIikgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGlwbGVhbnN3ZXJzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gdGhpcy5vcmlnRWxlbS5jaGlsZE5vZGVzO1xuICAgICAgICB0aGlzLnJhbmRvbSA9IGZhbHNlO1xuICAgICAgICBpZiAoJCh0aGlzLm9yaWdFbGVtKS5pcyhcIltkYXRhLXJhbmRvbV1cIikpIHtcbiAgICAgICAgICAgIHRoaXMucmFuZG9tID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvcnJlY3QgPSBudWxsO1xuICAgICAgICB0aGlzLmFuc3dlckxpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5jb3JyZWN0TGlzdCA9IFtdO1xuICAgICAgICB0aGlzLmNvcnJlY3RJbmRleExpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5mZWVkYmFja0xpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuY2FwdGlvbiA9IFwiTXVsdGlwbGUgQ2hvaWNlXCI7XG4gICAgICAgIHRoaXMuZmluZEFuc3dlcnMoKTtcbiAgICAgICAgdGhpcy5maW5kUXVlc3Rpb24oKTtcbiAgICAgICAgdGhpcy5maW5kRmVlZGJhY2tzKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlQ29ycmVjdExpc3QoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVNQ0Zvcm0oKTtcbiAgICAgICAgdGhpcy5hZGRDYXB0aW9uKFwicnVuZXN0b25lXCIpO1xuICAgICAgICB0aGlzLmNoZWNrU2VydmVyKFwibUNob2ljZVwiLCB0cnVlKTtcbiAgICAgICAgLy8gaHR0cHM6Ly9kb2NzLm1hdGhqYXgub3JnL2VuL2xhdGVzdC9vcHRpb25zL3N0YXJ0dXAvc3RhcnR1cC5odG1sXG4gICAgICAgIC8vIGh0dHBzOi8vZG9jcy5tYXRoamF4Lm9yZy9lbi9sYXRlc3Qvd2ViL2NvbmZpZ3VyYXRpb24uaHRtbCNzdGFydHVwLWFjdGlvblxuICAgICAgICAvLyBydW5lc3RvbmVNYXRoUmVhZHkgaXMgZGVmaW5lZCBpbiB0aGUgcHJlYW1ibGUgZm9yIGFsbCBQVFggYXV0aG9yZWQgYm9va3NcbiAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5jb250YWluZXJEaXYpO1xuICAgICAgICBpZiAodHlwZW9mIFByaXNtICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBQcmlzbS5oaWdobGlnaHRBbGxVbmRlcih0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gRnVuY3Rpb25zIHBhcnNpbmcgdmFyaWFibGVzICA9PT09XG4gICAgPT09PSAgb3V0IG9mIGludGVybWVkaWF0ZSBIVE1MICAgID09PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIGZpbmRRdWVzdGlvbigpIHtcbiAgICAgICAgdmFyIGRlbGltaXRlcjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9yaWdFbGVtLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9yaWdFbGVtLmNoaWxkTm9kZXNbaV0ubm9kZU5hbWUgPT09IFwiTElcIikge1xuICAgICAgICAgICAgICAgIGRlbGltaXRlciA9IHRoaXMub3JpZ0VsZW0uY2hpbGROb2Rlc1tpXS5vdXRlckhUTUw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZ1bGx0ZXh0ID0gJCh0aGlzLm9yaWdFbGVtKS5odG1sKCk7XG4gICAgICAgIHZhciB0ZW1wID0gZnVsbHRleHQuc3BsaXQoZGVsaW1pdGVyKTtcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IHRlbXBbMF07XG4gICAgfVxuXG4gICAgZmluZEFuc3dlcnMoKSB7XG4gICAgICAgIC8vIENyZWF0ZXMgYW5zd2VyIG9iamVjdHMgYW5kIHB1c2hlcyB0aGVtIHRvIGFuc3dlckxpc3RcbiAgICAgICAgLy8gZm9ybWF0OiBJRCwgQ29ycmVjdCBib29sLCBDb250ZW50ICh0ZXh0KVxuICAgICAgICB2YXIgQ2hpbGRBbnN3ZXJMaXN0ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKCQodGhpcy5jaGlsZHJlbltpXSkuaXMoXCJbZGF0YS1jb21wb25lbnQ9YW5zd2VyXVwiKSkge1xuICAgICAgICAgICAgICAgIENoaWxkQW5zd2VyTGlzdC5wdXNoKHRoaXMuY2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgQ2hpbGRBbnN3ZXJMaXN0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB2YXIgYW5zd2VyX2lkID0gJChDaGlsZEFuc3dlckxpc3Rbal0pLmF0dHIoXCJpZFwiKTtcbiAgICAgICAgICAgIHZhciBpc19jb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoJChDaGlsZEFuc3dlckxpc3Rbal0pLmlzKFwiW2RhdGEtY29ycmVjdF1cIikpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBkYXRhLWNvcnJlY3QgYXR0cmlidXRlIGV4aXN0cywgYW5zd2VyIGlzIGNvcnJlY3RcbiAgICAgICAgICAgICAgICBpc19jb3JyZWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBhbnN3ZXJfdGV4dCA9ICQoQ2hpbGRBbnN3ZXJMaXN0W2pdKS5odG1sKCk7XG4gICAgICAgICAgICB2YXIgYW5zd2VyX29iamVjdCA9IHtcbiAgICAgICAgICAgICAgICBpZDogYW5zd2VyX2lkLFxuICAgICAgICAgICAgICAgIGNvcnJlY3Q6IGlzX2NvcnJlY3QsXG4gICAgICAgICAgICAgICAgY29udGVudDogYW5zd2VyX3RleHQsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5hbnN3ZXJMaXN0LnB1c2goYW5zd2VyX29iamVjdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kRmVlZGJhY2tzKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgkKHRoaXMuY2hpbGRyZW5baV0pLmlzKFwiW2RhdGEtY29tcG9uZW50PWZlZWRiYWNrXVwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tMaXN0LnB1c2godGhpcy5jaGlsZHJlbltpXS5pbm5lckhUTUwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlQ29ycmVjdExpc3QoKSB7XG4gICAgICAgIC8vIENyZWF0ZXMgYXJyYXkgdGhhdCBob2xkcyB0aGUgSURcInMgb2YgY29ycmVjdCBhbnN3ZXJzXG4gICAgICAgIC8vIEFsc28gcG9wdWxhdGVzIGFuIGFycmF5IHRoYXQgaG9sZHMgdGhlIGluZGVjZXMgb2YgY29ycmVjdCBhbnN3ZXJzXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hbnN3ZXJMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hbnN3ZXJMaXN0W2ldLmNvcnJlY3QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3RMaXN0LnB1c2godGhpcy5hbnN3ZXJMaXN0W2ldLmlkKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3RJbmRleExpc3QucHVzaChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gICBGdW5jdGlvbnMgZ2VuZXJhdGluZyBmaW5hbCBIVE1MICAgPT09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIGNyZWF0ZU1DRm9ybSgpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJNQ0NvbnRhaW5lcigpO1xuICAgICAgICB0aGlzLnJlbmRlck1DRm9ybSgpOyAvLyByZW5kZXJzIHRoZSBmb3JtIHdpdGggb3B0aW9ucyBhbmQgYnV0dG9uc1xuICAgICAgICB0aGlzLnJlbmRlck1DZmVlZGJhY2tEaXYoKTtcbiAgICAgICAgLy8gcmVwbGFjZXMgaW50ZXJtZWRpYXRlIEhUTUwgd2l0aCByZW5kZXJlZCBIVE1MXG4gICAgICAgICQodGhpcy5vcmlnRWxlbSkucmVwbGFjZVdpdGgodGhpcy5jb250YWluZXJEaXYpO1xuICAgIH1cblxuICAgIHJlbmRlck1DQ29udGFpbmVyKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICQodGhpcy5jb250YWluZXJEaXYpLmh0bWwodGhpcy5xdWVzdGlvbik7XG4gICAgICAgICQodGhpcy5jb250YWluZXJEaXYpLmFkZENsYXNzKHRoaXMub3JpZ0VsZW0uZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5pZCA9IHRoaXMuZGl2aWQ7XG4gICAgfVxuXG4gICAgcmVuZGVyTUNGb3JtKCkge1xuICAgICAgICB0aGlzLm9wdHNGb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIik7XG4gICAgICAgIHRoaXMub3B0c0Zvcm0uaWQgPSB0aGlzLmRpdmlkICsgXCJfZm9ybVwiO1xuICAgICAgICAkKHRoaXMub3B0c0Zvcm0pLmF0dHIoe1xuICAgICAgICAgICAgbWV0aG9kOiBcImdldFwiLFxuICAgICAgICAgICAgYWN0aW9uOiBcIlwiLFxuICAgICAgICAgICAgb25zdWJtaXQ6IFwicmV0dXJuIGZhbHNlO1wiLFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gZ2VuZXJhdGUgZm9ybSBvcHRpb25zXG4gICAgICAgIHRoaXMucmVuZGVyTUNGb3JtT3B0cygpO1xuICAgICAgICB0aGlzLnJlbmRlck1DRm9ybUJ1dHRvbnMoKTtcbiAgICAgICAgLy8gQXBwZW5kIHRoZSBmb3JtIHRvIHRoZSBjb250YWluZXJcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5vcHRzRm9ybSk7XG4gICAgfVxuXG4gICAgcmVuZGVyTUNGb3JtT3B0cygpIHtcbiAgICAgICAgLy8gY3JlYXRlcyBpbnB1dCBET00gZWxlbWVudHNcbiAgICAgICAgdGhpcy5vcHRpb25BcnJheSA9IFtdOyAvLyBhcnJheSB3aXRoIGFuIG9iamVjdCBmb3IgZWFjaCBvcHRpb24gY29udGFpbmluZyB0aGUgaW5wdXQgYW5kIGxhYmVsIGZvciB0aGF0IG9wdGlvblxuICAgICAgICB2YXIgaW5wdXRfdHlwZSA9IFwicmFkaW9cIjtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICBpbnB1dF90eXBlID0gXCJjaGVja2JveFwiO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRoaXMuaW5kZXhBcnJheSBpcyB1c2VkIHRvIGluZGV4IHRocm91Z2ggdGhlIGFuc3dlcnNcbiAgICAgICAgLy8gaXQgaXMganVzdCAwLW4gbm9ybWFsbHksIGJ1dCB0aGUgb3JkZXIgaXMgc2h1ZmZsZWQgaWYgdGhlIHJhbmRvbSBvcHRpb24gaXMgcHJlc2VudFxuICAgICAgICB0aGlzLmluZGV4QXJyYXkgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmFuc3dlckxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuaW5kZXhBcnJheS5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJhbmRvbSkge1xuICAgICAgICAgICAgdGhpcy5yYW5kb21pemVBbnN3ZXJzKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBsZXQgYW5zd2VyRnVuYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5pc0Fuc3dlcmVkID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLmFuc3dlckxpc3QubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHZhciBrID0gdGhpcy5pbmRleEFycmF5W2pdO1xuICAgICAgICAgICAgdmFyIG9wdGlkID0gdGhpcy5kaXZpZCArIFwiX29wdF9cIiArIGs7XG4gICAgICAgICAgICAvLyBDcmVhdGUgdGhlIGxhYmVsIGZvciB0aGUgaW5wdXRcbiAgICAgICAgICAgIHZhciBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICAgICAgICAgIC8vIElmIHRoZSBjb250ZW50IGJlZ2lucyB3aXRoIGEgYGA8cD5gYCwgcHV0IHRoZSBsYWJlbCBpbnNpZGUgb2YgaXQuIChTcGhpbnggMi4wIHB1dHMgYWxsIGNvbnRlbnQgaW4gYSBgYDxwPmBgLCB3aGlsZSBTcGhpbnggMS44IGRvZXNuJ3QpLlxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSB0aGlzLmFuc3dlckxpc3Rba10uY29udGVudDtcbiAgICAgICAgICAgIHZhciBwcmVmaXggPSBcIlwiO1xuICAgICAgICAgICAgaWYgKGNvbnRlbnQuc3RhcnRzV2l0aChcIjxwPlwiKSkge1xuICAgICAgICAgICAgICAgIHByZWZpeCA9IFwiPHA+XCI7XG4gICAgICAgICAgICAgICAgY29udGVudCA9IGNvbnRlbnQuc2xpY2UoMyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKGxhYmVsKS5odG1sKFxuICAgICAgICAgICAgICAgIGAke3ByZWZpeH08aW5wdXQgdHlwZT1cIiR7aW5wdXRfdHlwZX1cIiBuYW1lPVwiZ3JvdXAxXCIgdmFsdWU9JHtrfSBpZD0ke29wdGlkfT4ke1N0cmluZy5mcm9tQ2hhckNvZGUoXG4gICAgICAgICAgICAgICAgICAgIFwiQVwiLmNoYXJDb2RlQXQoMCkgKyBqXG4gICAgICAgICAgICAgICAgKX0uICR7Y29udGVudH1gXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgLy8gY3JlYXRlIHRoZSBvYmplY3QgdG8gc3RvcmUgaW4gb3B0aW9uQXJyYXlcbiAgICAgICAgICAgIHZhciBvcHRPYmogPSB7XG4gICAgICAgICAgICAgICAgaW5wdXQ6ICQobGFiZWwpLmZpbmQoXCJpbnB1dFwiKVswXSxcbiAgICAgICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgb3B0T2JqLmlucHV0Lm9uY2xpY2sgPSBhbnN3ZXJGdW5jO1xuXG4gICAgICAgICAgICB0aGlzLm9wdGlvbkFycmF5LnB1c2gob3B0T2JqKTtcbiAgICAgICAgICAgIC8vIGFkZCB0aGUgb3B0aW9uIHRvIHRoZSBmb3JtXG4gICAgICAgICAgICB0aGlzLm9wdHNGb3JtLmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICAgICAgICAgIHRoaXMub3B0c0Zvcm0uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlck1DRm9ybUJ1dHRvbnMoKSB7XG4gICAgICAgIC8vIHN1Ym1pdCBhbmQgY29tcGFyZSBtZSBidXR0b25zXG4gICAgICAgIC8vIENyZWF0ZSBzdWJtaXQgYnV0dG9uXG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24udGV4dENvbnRlbnQgPSBcIkNoZWNrIE1lXCI7XG4gICAgICAgICQodGhpcy5zdWJtaXRCdXR0b24pLmF0dHIoe1xuICAgICAgICAgICAgY2xhc3M6IFwiYnRuIGJ0bi1zdWNjZXNzXCIsXG4gICAgICAgICAgICBuYW1lOiBcImRvIGFuc3dlclwiLFxuICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIixcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh0aGlzLm11bHRpcGxlYW5zd2Vycykge1xuICAgICAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc01DTUFTdWJtaXNzaW9uKHRydWUpO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc01DTUZTdWJtaXNzaW9uKHRydWUpO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSAvLyBlbmQgZWxzZVxuICAgICAgICB0aGlzLm9wdHNGb3JtLmFwcGVuZENoaWxkKHRoaXMuc3VibWl0QnV0dG9uKTtcbiAgICAgICAgLy8gQ3JlYXRlIGNvbXBhcmUgYnV0dG9uXG4gICAgICAgIGlmICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzICYmICFlQm9va0NvbmZpZy5wZWVyKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgJCh0aGlzLmNvbXBhcmVCdXR0b24pLmF0dHIoe1xuICAgICAgICAgICAgICAgIGNsYXNzOiBcImJ0biBidG4tZGVmYXVsdFwiLFxuICAgICAgICAgICAgICAgIGlkOiB0aGlzLmRpdmlkICsgXCJfYmNvbXBcIixcbiAgICAgICAgICAgICAgICBkaXNhYmxlZDogXCJcIixcbiAgICAgICAgICAgICAgICBuYW1lOiBcImNvbXBhcmVcIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLnRleHRDb250ZW50ID0gXCJDb21wYXJlIG1lXCI7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGFyZUFuc3dlcnModGhpcy5kaXZpZCk7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5vcHRzRm9ybS5hcHBlbmRDaGlsZCh0aGlzLmNvbXBhcmVCdXR0b24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyTUNmZWVkYmFja0RpdigpIHtcbiAgICAgICAgdGhpcy5mZWVkQmFja0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuaWQgPSB0aGlzLmRpdmlkICsgXCJfZmVlZGJhY2tcIjtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5mZWVkQmFja0Rpdik7XG4gICAgfVxuXG4gICAgcmFuZG9taXplQW5zd2VycygpIHtcbiAgICAgICAgLy8gTWFrZXMgdGhlIG9yZGVyaW5nIG9mIHRoZSBhbnN3ZXIgY2hvaWNlcyByYW5kb21cbiAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IHRoaXMuaW5kZXhBcnJheS5sZW5ndGgsXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSxcbiAgICAgICAgICAgIHJhbmRvbUluZGV4O1xuICAgICAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZS4uLlxuICAgICAgICB3aGlsZSAoY3VycmVudEluZGV4ICE9PSAwKSB7XG4gICAgICAgICAgICAvLyBQaWNrIGEgcmVtYWluaW5nIGVsZW1lbnQuLi5cbiAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xuICAgICAgICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSB0aGlzLmluZGV4QXJyYXlbY3VycmVudEluZGV4XTtcbiAgICAgICAgICAgIHRoaXMuaW5kZXhBcnJheVtjdXJyZW50SW5kZXhdID0gdGhpcy5pbmRleEFycmF5W3JhbmRvbUluZGV4XTtcbiAgICAgICAgICAgIHRoaXMuaW5kZXhBcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcbiAgICAgICAgICAgIHZhciB0ZW1wb3JhcnlGZWVkYmFjayA9IHRoaXMuZmVlZGJhY2tMaXN0W2N1cnJlbnRJbmRleF07XG4gICAgICAgICAgICB0aGlzLmZlZWRiYWNrTGlzdFtjdXJyZW50SW5kZXhdID0gdGhpcy5mZWVkYmFja0xpc3RbcmFuZG9tSW5kZXhdO1xuICAgICAgICAgICAgdGhpcy5mZWVkYmFja0xpc3RbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5RmVlZGJhY2s7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09IENoZWNraW5nL2xvYWRpbmcgZnJvbSBzdG9yYWdlID09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICByZXN0b3JlQW5zd2VycyhkYXRhKSB7XG4gICAgICAgIC8vIFJlc3RvcmUgYW5zd2VycyBmcm9tIHN0b3JhZ2UgcmV0cmlldmFsIGRvbmUgaW4gUnVuZXN0b25lQmFzZVxuICAgICAgICAvLyBzb21ldGltZXMgZGF0YS5hbnN3ZXIgY2FuIGJlIG51bGxcbiAgICAgICAgaWYgKCFkYXRhLmFuc3dlcikge1xuICAgICAgICAgICAgZGF0YS5hbnN3ZXIgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhbnN3ZXJzID0gZGF0YS5hbnN3ZXIuc3BsaXQoXCIsXCIpO1xuICAgICAgICBmb3IgKHZhciBhID0gMDsgYSA8IGFuc3dlcnMubGVuZ3RoOyBhKyspIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGFuc3dlcnNbYV07XG4gICAgICAgICAgICBmb3IgKHZhciBiID0gMDsgYiA8IHRoaXMub3B0aW9uQXJyYXkubGVuZ3RoOyBiKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25BcnJheVtiXS5pbnB1dC52YWx1ZSA9PSBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMub3B0aW9uQXJyYXlbYl0uaW5wdXQpLmF0dHIoXCJjaGVja2VkXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NNQ01BU3VibWlzc2lvbihmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NNQ01GU3VibWlzc2lvbihmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja0xvY2FsU3RvcmFnZSgpIHtcbiAgICAgICAgLy8gUmVwb3B1bGF0ZXMgTUNNQSBxdWVzdGlvbnMgd2l0aCBhIHVzZXIncyBwcmV2aW91cyBhbnN3ZXJzLFxuICAgICAgICAvLyB3aGljaCB3ZXJlIHN0b3JlZCBpbnRvIGxvY2FsIHN0b3JhZ2UuXG4gICAgICAgIHZhciBzdG9yZWREYXRhO1xuICAgICAgICB2YXIgYW5zd2VycztcbiAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxlbiA9IGxvY2FsU3RvcmFnZS5sZW5ndGg7XG4gICAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgICAgICB2YXIgZXggPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgIGlmIChleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHN0b3JlZERhdGEgPSBKU09OLnBhcnNlKGV4KTtcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VycyA9IHN0b3JlZERhdGEuYW5zd2VyLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZXJyb3Igd2hpbGUgcGFyc2luZzsgbGlrZWx5IGR1ZSB0byBiYWQgdmFsdWUgc3RvcmVkIGluIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBhID0gMDsgYSA8IGFuc3dlcnMubGVuZ3RoOyBhKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gYW5zd2Vyc1thXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgYiA9IDA7IGIgPCB0aGlzLm9wdGlvbkFycmF5Lmxlbmd0aDsgYisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25BcnJheVtiXS5pbnB1dC52YWx1ZSA9PSBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcy5vcHRpb25BcnJheVtiXS5pbnB1dCkuYXR0cihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjaGVja2VkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZU1DQ29tcGFyaXNvbigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFN1Ym1pdHRlZE9wdHMoKTsgLy8gdG8gcG9wdWxhdGUgZ2l2ZW5sb2cgZm9yIGxvZ2dpbmdcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ01DTUFzdWJtaXNzaW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ01DTUZzdWJtaXNzaW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRMb2NhbFN0b3JhZ2UoZGF0YSkge1xuICAgICAgICB2YXIgdGltZVN0YW1wID0gbmV3IERhdGUoKTtcbiAgICAgICAgdmFyIHN0b3JhZ2VPYmogPSB7XG4gICAgICAgICAgICBhbnN3ZXI6IGRhdGEuYW5zd2VyLFxuICAgICAgICAgICAgdGltZXN0YW1wOiB0aW1lU3RhbXAsXG4gICAgICAgICAgICBjb3JyZWN0OiBkYXRhLmNvcnJlY3QsXG4gICAgICAgIH07XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSxcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHN0b3JhZ2VPYmopXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09IFByb2Nlc3NpbmcgTUMgU3VibWlzc2lvbnMgPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgcHJvY2Vzc01DTUFTdWJtaXNzaW9uKGxvZ0ZsYWcpIHtcbiAgICAgICAgLy8gQ2FsbGVkIHdoZW4gdGhlIHN1Ym1pdCBidXR0b24gaXMgY2xpY2tlZFxuICAgICAgICB0aGlzLmdldFN1Ym1pdHRlZE9wdHMoKTsgLy8gbWFrZSBzdXJlIHRoaXMuZ2l2ZW5BcnJheSBpcyBwb3B1bGF0ZWRcbiAgICAgICAgdGhpcy5zY29yZU1DTUFTdWJtaXNzaW9uKCk7XG4gICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKHtcbiAgICAgICAgICAgIGNvcnJlY3Q6IHRoaXMuY29ycmVjdCA/IFwiVFwiIDogXCJGXCIsXG4gICAgICAgICAgICBhbnN3ZXI6IHRoaXMuZ2l2ZW5BcnJheS5qb2luKFwiLFwiKSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChsb2dGbGFnKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ01DTUFzdWJtaXNzaW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlQm9va0NvbmZpZy5wZWVyIHx8IGVCb29rQ29uZmlnLmlzSW5zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJNQ01BRmVlZEJhY2soKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmFibGVNQ0NvbXBhcmlzb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGFja25vd2xlZGdlIHN1Ym1pc3Npb25cbiAgICAgICAgICAgIGlmIChlQm9va0NvbmZpZy5wZWVyICYmXG4gICAgICAgICAgICAgICAgZUJvb2tDb25maWcucGVlck1vZGUgPT09IFwiYXN5bmNcIiAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBzdHVkZW50Vm90ZUNvdW50ICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgICAgICAgICAgc3R1ZGVudFZvdGVDb3VudCA+IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlck1DTUFGZWVkQmFjaygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmh0bWwoXCI8cD5Zb3VyIEFuc3dlciBoYXMgYmVlbiByZWNvcmRlZDwvcD5cIik7XG4gICAgICAgICAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5hdHRyKFwiY2xhc3NcIiwgXCJhbGVydCBhbGVydC1pbmZvXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0U3VibWl0dGVkT3B0cygpIHtcbiAgICAgICAgdmFyIGdpdmVuO1xuICAgICAgICB0aGlzLnNpbmdsZWZlZWRiYWNrID0gXCJcIjsgLy8gVXNlZCBmb3IgTUNNRiBxdWVzdGlvbnNcbiAgICAgICAgdGhpcy5mZWVkYmFja1N0cmluZyA9IFwiXCI7IC8vIFVzZWQgZm9yIE1DTUEgcXVlc3Rpb25zXG4gICAgICAgIHRoaXMuZ2l2ZW5BcnJheSA9IFtdO1xuICAgICAgICB0aGlzLmdpdmVubG9nID0gXCJcIjtcbiAgICAgICAgdmFyIGJ1dHRvbk9ianMgPSB0aGlzLm9wdHNGb3JtLmVsZW1lbnRzLmdyb3VwMTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBidXR0b25PYmpzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYnV0dG9uT2Jqc1tpXS5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgZ2l2ZW4gPSBidXR0b25PYmpzW2ldLnZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2l2ZW5BcnJheS5wdXNoKGdpdmVuKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWRiYWNrU3RyaW5nICs9IGA8bGkgdmFsdWU9XCIke2kgKyAxfVwiPiR7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tMaXN0W2ldXG4gICAgICAgICAgICAgICAgfTwvbGk+YDtcbiAgICAgICAgICAgICAgICB0aGlzLmdpdmVubG9nICs9IGdpdmVuICsgXCIsXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5zaW5nbGVmZWVkYmFjayA9IHRoaXMuZmVlZGJhY2tMaXN0W2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2l2ZW5BcnJheS5zb3J0KCk7XG4gICAgfVxuXG4gICAgY2hlY2tDdXJyZW50QW5zd2VyKCkge1xuICAgICAgICB0aGlzLmdldFN1Ym1pdHRlZE9wdHMoKTtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3JlTUNNQVN1Ym1pc3Npb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcmVNQ01GU3VibWlzc2lvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgbG9nQ3VycmVudEFuc3dlcihzaWQpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmxvZ01DTUFzdWJtaXNzaW9uKHNpZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmxvZ01DTUZzdWJtaXNzaW9uKHNpZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXJGZWVkYmFjaygpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlck1DTUFGZWVkQmFjaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJNQ01GRmVlZGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzY29yZU1DTUFTdWJtaXNzaW9uKCkge1xuICAgICAgICB0aGlzLmNvcnJlY3RDb3VudCA9IDA7XG4gICAgICAgIHZhciBjb3JyZWN0SW5kZXggPSAwO1xuICAgICAgICB2YXIgZ2l2ZW5JbmRleCA9IDA7XG4gICAgICAgIHdoaWxlIChcbiAgICAgICAgICAgIGNvcnJlY3RJbmRleCA8IHRoaXMuY29ycmVjdEluZGV4TGlzdC5sZW5ndGggJiZcbiAgICAgICAgICAgIGdpdmVuSW5kZXggPCB0aGlzLmdpdmVuQXJyYXkubGVuZ3RoXG4gICAgICAgICkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHRoaXMuZ2l2ZW5BcnJheVtnaXZlbkluZGV4XSA8XG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0SW5kZXhMaXN0W2NvcnJlY3RJbmRleF1cbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGdpdmVuSW5kZXgrKztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgdGhpcy5naXZlbkFycmF5W2dpdmVuSW5kZXhdID09XG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0SW5kZXhMaXN0W2NvcnJlY3RJbmRleF1cbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdENvdW50Kys7XG4gICAgICAgICAgICAgICAgZ2l2ZW5JbmRleCsrO1xuICAgICAgICAgICAgICAgIGNvcnJlY3RJbmRleCsrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb3JyZWN0SW5kZXgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgbnVtR2l2ZW4gPSB0aGlzLmdpdmVuQXJyYXkubGVuZ3RoO1xuICAgICAgICB2YXIgbnVtQ29ycmVjdCA9IHRoaXMuY29ycmVjdENvdW50O1xuICAgICAgICB2YXIgbnVtTmVlZGVkID0gdGhpcy5jb3JyZWN0TGlzdC5sZW5ndGg7XG4gICAgICAgIHRoaXMuYW5zd2VyID0gdGhpcy5naXZlbkFycmF5LmpvaW4oXCIsXCIpO1xuICAgICAgICB0aGlzLmNvcnJlY3QgPSBudW1Db3JyZWN0ID09PSBudW1OZWVkZWQgJiYgbnVtTmVlZGVkID09PSBudW1HaXZlbjtcbiAgICAgICAgaWYgKG51bUdpdmVuID09PSBudW1OZWVkZWQpIHtcbiAgICAgICAgICAgIHRoaXMucGVyY2VudCA9IG51bUNvcnJlY3QgLyBudW1OZWVkZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBlcmNlbnQgPSBudW1Db3JyZWN0IC8gTWF0aC5tYXgobnVtR2l2ZW4sIG51bU5lZWRlZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBsb2dNQ01Bc3VibWlzc2lvbihzaWQpIHtcbiAgICAgICAgdmFyIGFuc3dlciA9IHRoaXMuYW5zd2VyIHx8IFwiXCI7XG4gICAgICAgIHZhciBjb3JyZWN0ID0gdGhpcy5jb3JyZWN0IHx8IFwiRlwiO1xuICAgICAgICB2YXIgbG9nQW5zd2VyID1cbiAgICAgICAgICAgIFwiYW5zd2VyOlwiICsgYW5zd2VyICsgXCI6XCIgKyAoY29ycmVjdCA9PSBcIlRcIiA/IFwiY29ycmVjdFwiIDogXCJub1wiKTtcbiAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICBldmVudDogXCJtQ2hvaWNlXCIsXG4gICAgICAgICAgICBhY3Q6IGxvZ0Fuc3dlcixcbiAgICAgICAgICAgIGFuc3dlcjogYW5zd2VyLFxuICAgICAgICAgICAgY29ycmVjdDogY29ycmVjdCxcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGVCb29rQ29uZmlnLnBlZXIgJiYgdHlwZW9mIHN0dWRlbnRWb3RlQ291bnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGRhdGEuYWN0ID0gZGF0YS5hY3QgKyBgOnZvdGUke3N0dWRlbnRWb3RlQ291bnR9YDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHNpZCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZGF0YS5zaWQgPSBzaWQ7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgdGhpcy5sb2dCb29rRXZlbnQoZGF0YSk7XG4gICAgfVxuXG4gICAgcmVuZGVyTUNNQUZlZWRCYWNrKCkge1xuICAgICAgICB2YXIgYW5zd2VyU3RyID0gXCJhbnN3ZXJzXCI7XG4gICAgICAgIHZhciBudW1HaXZlbiA9IHRoaXMuZ2l2ZW5BcnJheS5sZW5ndGg7XG4gICAgICAgIGlmIChudW1HaXZlbiA9PT0gMSkge1xuICAgICAgICAgICAgYW5zd2VyU3RyID0gXCJhbnN3ZXJcIjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbnVtQ29ycmVjdCA9IHRoaXMuY29ycmVjdENvdW50O1xuICAgICAgICB2YXIgbnVtTmVlZGVkID0gdGhpcy5jb3JyZWN0TGlzdC5sZW5ndGg7XG4gICAgICAgIHZhciBmZWVkYmFja1RleHQgPSB0aGlzLmZlZWRiYWNrU3RyaW5nO1xuICAgICAgICBpZiAodGhpcy5jb3JyZWN0KSB7XG4gICAgICAgICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmh0bWwoYOKclO+4jyA8b2wgdHlwZT1cIkFcIj4ke2ZlZWRiYWNrVGV4dH08L3VsPmApO1xuICAgICAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5hdHRyKFwiY2xhc3NcIiwgXCJhbGVydCBhbGVydC1pbmZvXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5odG1sKFxuICAgICAgICAgICAgICAgIGDinJbvuI8gWW91IGdhdmUgJHtudW1HaXZlbn0gJHthbnN3ZXJTdHJ9IGFuZCBnb3QgJHtudW1Db3JyZWN0fSBjb3JyZWN0IG9mICR7bnVtTmVlZGVkfSBuZWVkZWQuPG9sIHR5cGU9XCJBXCI+JHtmZWVkYmFja1RleHR9PC91bD5gXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5hdHRyKFwiY2xhc3NcIiwgXCJhbGVydCBhbGVydC1kYW5nZXJcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm9jZXNzTUNNRlN1Ym1pc3Npb24obG9nRmxhZykge1xuICAgICAgICAvLyBDYWxsZWQgd2hlbiB0aGUgc3VibWl0IGJ1dHRvbiBpcyBjbGlja2VkXG4gICAgICAgIHRoaXMuZ2V0U3VibWl0dGVkT3B0cygpOyAvLyBtYWtlIHN1cmUgdGhpcy5naXZlbkFycmF5IGlzIHBvcHVsYXRlZFxuICAgICAgICB0aGlzLnNjb3JlTUNNRlN1Ym1pc3Npb24oKTtcbiAgICAgICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2Uoe1xuICAgICAgICAgICAgY29ycmVjdDogdGhpcy5jb3JyZWN0ID8gXCJUXCIgOiBcIkZcIixcbiAgICAgICAgICAgIGFuc3dlcjogdGhpcy5naXZlbkFycmF5LmpvaW4oXCIsXCIpLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGxvZ0ZsYWcpIHtcbiAgICAgICAgICAgIHRoaXMubG9nTUNNRnN1Ym1pc3Npb24oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVCb29rQ29uZmlnLnBlZXIgfHwgZUJvb2tDb25maWcuaXNJbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlck1DTUZGZWVkYmFjaygpO1xuICAgICAgICAgICAgaWYgKHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZU1DQ29tcGFyaXNvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGVCb29rQ29uZmlnLnBlZXIgJiZcbiAgICAgICAgICAgICAgICBlQm9va0NvbmZpZy5wZWVyTW9kZSA9PT0gXCJhc3luY1wiICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIHN0dWRlbnRWb3RlQ291bnQgIT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICAgICAgICAgICAgICBzdHVkZW50Vm90ZUNvdW50ID4gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyTUNNQUZlZWRCYWNrKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQodGhpcy5mZWVkQmFja0RpdikuaHRtbChcIjxwPllvdXIgQW5zd2VyIGhhcyBiZWVuIHJlY29yZGVkPC9wPlwiKTtcbiAgICAgICAgICAgICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWluZm9cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzY29yZU1DTUZTdWJtaXNzaW9uKCkge1xuICAgICAgICB0aGlzLmFuc3dlciA9IHRoaXMuZ2l2ZW5BcnJheVswXTtcbiAgICAgICAgaWYgKHRoaXMuZ2l2ZW5BcnJheVswXSA9PSB0aGlzLmNvcnJlY3RJbmRleExpc3RbMF0pIHtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnBlcmNlbnQgPSAxLjA7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5naXZlbkFycmF5WzBdICE9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIGlmIGdpdmVuIGlzIG51bGwgdGhlbiB0aGUgcXVlc3Rpb24gd2FzblwidCBhbnN3ZXJlZCBhbmQgc2hvdWxkIGJlIGNvdW50ZWQgYXMgc2tpcHBlZFxuICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnBlcmNlbnQgPSAwLjA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBsb2dNQ01Gc3VibWlzc2lvbihzaWQpIHtcbiAgICAgICAgLy8gSWYgdGhlcmUncyBubyBhbnN3ZXIgcHJvdmlkZWQgKHRoZSBhcnJheSBpcyBlbXB0eSksIHVzZSBhIGJsYW5rIGZvciB0aGUgYW5zd2VyLlxuICAgICAgICB2YXIgYW5zd2VyID0gdGhpcy5naXZlbkFycmF5WzBdIHx8IFwiXCI7XG4gICAgICAgIHZhciBjb3JyZWN0ID1cbiAgICAgICAgICAgIHRoaXMuZ2l2ZW5BcnJheVswXSA9PSB0aGlzLmNvcnJlY3RJbmRleExpc3RbMF0gPyBcIlRcIiA6IFwiRlwiO1xuICAgICAgICB2YXIgbG9nQW5zd2VyID1cbiAgICAgICAgICAgIFwiYW5zd2VyOlwiICsgYW5zd2VyICsgXCI6XCIgKyAoY29ycmVjdCA9PSBcIlRcIiA/IFwiY29ycmVjdFwiIDogXCJub1wiKTsgLy8gYmFja3dhcmQgY29tcGF0aWJsZVxuICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgIGV2ZW50OiBcIm1DaG9pY2VcIixcbiAgICAgICAgICAgIGFjdDogbG9nQW5zd2VyLFxuICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXIsXG4gICAgICAgICAgICBjb3JyZWN0OiBjb3JyZWN0LFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoZUJvb2tDb25maWcucGVlciAmJiB0eXBlb2Ygc3R1ZGVudFZvdGVDb3VudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZGF0YS5hY3QgPSBkYXRhLmFjdCArIGA6dm90ZSR7c3R1ZGVudFZvdGVDb3VudH1gO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygc2lkICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBkYXRhLnNpZCA9IHNpZDtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCB0aGlzLmxvZ0Jvb2tFdmVudChkYXRhKTtcbiAgICB9XG5cbiAgICByZW5kZXJNQ01GRmVlZGJhY2soKSB7XG4gICAgICAgIGxldCBjb3JyZWN0ID0gdGhpcy5naXZlbkFycmF5WzBdID09IHRoaXMuY29ycmVjdEluZGV4TGlzdFswXTtcbiAgICAgICAgbGV0IGZlZWRiYWNrVGV4dCA9IHRoaXMuc2luZ2xlZmVlZGJhY2s7XG5cbiAgICAgICAgaWYgKGNvcnJlY3QpIHtcbiAgICAgICAgICAgICQodGhpcy5mZWVkQmFja0RpdikuaHRtbChcIuKclO+4jyBcIiArIGZlZWRiYWNrVGV4dCk7XG4gICAgICAgICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWluZm9cIik7IC8vIHVzZSBibHVlIGZvciBiZXR0ZXIgcmVkL2dyZWVuIGJsdWUgY29sb3IgYmxpbmRuZXNzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZmVlZGJhY2tUZXh0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmZWVkYmFja1RleHQgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5odG1sKFwi4pyW77iPIFwiICsgZmVlZGJhY2tUZXh0KTtcbiAgICAgICAgICAgICQodGhpcy5mZWVkQmFja0RpdikuYXR0cihcImNsYXNzXCIsIFwiYWxlcnQgYWxlcnQtZGFuZ2VyXCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVuYWJsZU1DQ29tcGFyaXNvbigpIHtcbiAgICAgICAgaWYgKGVCb29rQ29uZmlnLmVuYWJsZUNvbXBhcmVNZSkge1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaW5zdHJ1Y3Rvck1jaG9pY2VNb2RhbChkYXRhKSB7XG4gICAgICAgIC8vIGRhdGEucmVzbGlzdCAtLSBzdHVkZW50IGFuZCB0aGVpciBhbnN3ZXJzXG4gICAgICAgIC8vIGRhdGEuYW5zd2VyRGljdCAgICAtLSBhbnN3ZXJzIGFuZCBjb3VudFxuICAgICAgICAvLyBkYXRhLmNvcnJlY3QgLSBjb3JyZWN0IGFuc3dlclxuICAgICAgICB2YXIgcmVzID0gXCI8dGFibGU+PHRyPjx0aD5TdHVkZW50PC90aD48dGg+QW5zd2VyKHMpPC90aD48L3RyPlwiO1xuICAgICAgICBmb3IgKHZhciBpIGluIGRhdGEpIHtcbiAgICAgICAgICAgIHJlcyArPVxuICAgICAgICAgICAgICAgIFwiPHRyPjx0ZD5cIiArXG4gICAgICAgICAgICAgICAgZGF0YVtpXVswXSArXG4gICAgICAgICAgICAgICAgXCI8L3RkPjx0ZD5cIiArXG4gICAgICAgICAgICAgICAgZGF0YVtpXVsxXSArXG4gICAgICAgICAgICAgICAgXCI8L3RkPjwvdHI+XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmVzICs9IFwiPC90YWJsZT5cIjtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gICAgY29tcGFyZU1vZGFsKGRhdGEsIHN0YXR1cywgd2hhdGV2ZXIpIHtcbiAgICAgICAgdmFyIGRhdGFkaWN0ID0gZGF0YS5kZXRhaWw7XG4gICAgICAgIHZhciBhbnN3ZXJzID0gZGF0YWRpY3QuYW5zd2VyRGljdDtcbiAgICAgICAgdmFyIG1pc2MgPSBkYXRhZGljdC5taXNjO1xuICAgICAgICB2YXIga2wgPSBPYmplY3Qua2V5cyhhbnN3ZXJzKS5zb3J0KCk7XG4gICAgICAgIHZhciBib2R5ID0gXCI8dGFibGU+XCI7XG4gICAgICAgIGJvZHkgKz0gXCI8dHI+PHRoPkFuc3dlcjwvdGg+PHRoPlBlcmNlbnQ8L3RoPjwvdHI+XCI7XG4gICAgICAgIHZhciB0aGVDbGFzcyA9IFwiXCI7XG4gICAgICAgIGZvciAodmFyIGsgaW4ga2wpIHtcbiAgICAgICAgICAgIGlmIChrbFtrXSA9PT0gbWlzYy5jb3JyZWN0KSB7XG4gICAgICAgICAgICAgICAgdGhlQ2xhc3MgPSBcInN1Y2Nlc3NcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhlQ2xhc3MgPSBcImluZm9cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJvZHkgKz1cbiAgICAgICAgICAgICAgICBcIjx0cj48dGQ+XCIgKyBrbFtrXSArIFwiPC90ZD48dGQgY2xhc3M9J2NvbXBhcmUtbWUtcHJvZ3Jlc3MnPlwiO1xuICAgICAgICAgICAgdmFyIHBjdCA9IGFuc3dlcnNba2xba11dICsgXCIlXCI7XG4gICAgICAgICAgICBib2R5ICs9IFwiPGRpdiBjbGFzcz0ncHJvZ3Jlc3MnPlwiO1xuICAgICAgICAgICAgYm9keSArPVxuICAgICAgICAgICAgICAgIFwiICAgIDxkaXYgY2xhc3M9J3Byb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItXCIgK1xuICAgICAgICAgICAgICAgIHRoZUNsYXNzICtcbiAgICAgICAgICAgICAgICBcIicgc3R5bGU9J3dpZHRoOlwiICtcbiAgICAgICAgICAgICAgICBwY3QgK1xuICAgICAgICAgICAgICAgIFwiOyc+XCIgK1xuICAgICAgICAgICAgICAgIHBjdDtcbiAgICAgICAgICAgIGJvZHkgKz0gXCIgICAgPC9kaXY+XCI7XG4gICAgICAgICAgICBib2R5ICs9IFwiPC9kaXY+PC90ZD48L3RyPlwiO1xuICAgICAgICB9XG4gICAgICAgIGJvZHkgKz0gXCI8L3RhYmxlPlwiO1xuICAgICAgICBpZiAobWlzYy55b3VycGN0ICE9PSBcInVuYXZhaWxhYmxlXCIpIHtcbiAgICAgICAgICAgIGJvZHkgKz1cbiAgICAgICAgICAgICAgICBcIjxiciAvPjxwPllvdSBoYXZlIFwiICtcbiAgICAgICAgICAgICAgICBtaXNjLnlvdXJwY3QgK1xuICAgICAgICAgICAgICAgIFwiJSBjb3JyZWN0IGZvciBhbGwgcXVlc3Rpb25zPC9wPlwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhZGljdC5yZXNsaXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGJvZHkgKz0gdGhpcy5pbnN0cnVjdG9yTWNob2ljZU1vZGFsKGRhdGFkaWN0LnJlc2xpc3QpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBodG1sID1cbiAgICAgICAgICAgIFwiPGRpdiBjbGFzcz0nbW9kYWwgZmFkZSc+XCIgK1xuICAgICAgICAgICAgXCIgICAgPGRpdiBjbGFzcz0nbW9kYWwtZGlhbG9nIGNvbXBhcmUtbW9kYWwnPlwiICtcbiAgICAgICAgICAgIFwiICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1jb250ZW50Jz5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9J21vZGFsLWhlYWRlcic+XCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzPSdjbG9zZScgZGF0YS1kaXNtaXNzPSdtb2RhbCcgYXJpYS1oaWRkZW49J3RydWUnPiZ0aW1lczs8L2J1dHRvbj5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICA8aDQgY2xhc3M9J21vZGFsLXRpdGxlJz5EaXN0cmlidXRpb24gb2YgQW5zd2VyczwvaDQ+XCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICA8L2Rpdj5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9J21vZGFsLWJvZHknPlwiICtcbiAgICAgICAgICAgIGJvZHkgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICA8L2Rpdj5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgPC9kaXY+XCIgK1xuICAgICAgICAgICAgXCIgICAgPC9kaXY+XCIgK1xuICAgICAgICAgICAgXCI8L2Rpdj5cIjtcbiAgICAgICAgdmFyIGVsID0gJChodG1sKTtcbiAgICAgICAgZWwubW9kYWwoKTtcbiAgICB9XG4gICAgLy8gX2Bjb21wYXJlQW5zd2Vyc2BcbiAgICBjb21wYXJlQW5zd2VycygpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgICAgZGF0YS5kaXZfaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICBkYXRhLmNvdXJzZV9uYW1lID0gZUJvb2tDb25maWcuY291cnNlO1xuICAgICAgICBqUXVlcnkuZ2V0KFxuICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2Fzc2Vzc21lbnQvZ2V0YWdncmVnYXRlcmVzdWx0c2AsXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgdGhpcy5jb21wYXJlTW9kYWwuYmluZCh0aGlzKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGRpc2FibGVJbnRlcmFjdGlvbigpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbkFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbkFycmF5W2ldLmlucHV0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVuYWJsZUludGVyYWN0aW9uKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMub3B0aW9uQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uQXJyYXlbaV0uaW5wdXQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09IEZpbmQgdGhlIGN1c3RvbSBIVE1MIHRhZ3MgYW5kID09XG49PSAgIGV4ZWN1dGUgb3VyIGNvZGUgb24gdGhlbSAgICA9PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiQoZG9jdW1lbnQpLm9uKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGZ1bmN0aW9uKCkge1xuICAgICQoXCJbZGF0YS1jb21wb25lbnQ9bXVsdGlwbGVjaG9pY2VdXCIpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgLy8gTUNcbiAgICAgICAgdmFyIG9wdHMgPSB7XG4gICAgICAgICAgICBvcmlnOiB0aGlzLFxuICAgICAgICAgICAgdXNlUnVuZXN0b25lU2VydmljZXM6IGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoJCh0aGlzKS5jbG9zZXN0KFwiW2RhdGEtY29tcG9uZW50PXRpbWVkQXNzZXNzbWVudF1cIikubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIC8vIElmIHRoaXMgZWxlbWVudCBleGlzdHMgd2l0aGluIGEgdGltZWQgY29tcG9uZW50LCBkb24ndCByZW5kZXIgaXQgaGVyZVxuICAgICAgICAgICAgd2luZG93LmNvbXBvbmVudE1hcFt0aGlzLmlkXSA9IG5ldyBNdWx0aXBsZUNob2ljZShvcHRzKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iLCJpbXBvcnQgTXVsdGlwbGVDaG9pY2UgZnJvbSBcIi4vbWNob2ljZS5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lZE1DIGV4dGVuZHMgTXVsdGlwbGVDaG9pY2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgICQodGhpcy5jb250YWluZXJEaXYpLmFkZENsYXNzKFwicnVuZXN0b25lXCIpO1xuICAgICAgICB0aGlzLm5lZWRzUmVpbml0aWFsaXphdGlvbiA9IHRydWU7XG4gICAgICAgIHRoaXMucmVuZGVyVGltZWRJY29uKHRoaXMuTUNDb250YWluZXIpO1xuICAgICAgICB0aGlzLmhpZGVCdXR0b25zKCk7IC8vIERvbid0IHNob3cgcGVyLXF1ZXN0aW9uIGJ1dHRvbnMgaW4gYSB0aW1lZCBhc3Nlc3NtZW50XG4gICAgfVxuXG4gICAgcmVuZGVyVGltZWRJY29uKGNvbXBvbmVudCkge1xuICAgICAgICAvLyByZW5kZXJzIHRoZSBjbG9jayBpY29uIG9uIHRpbWVkIGNvbXBvbmVudHMuICAgIFRoZSBjb21wb25lbnQgcGFyYW1ldGVyXG4gICAgICAgIC8vIGlzIHRoZSBlbGVtZW50IHRoYXQgdGhlIGljb24gc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuICAgICAgICB2YXIgdGltZUljb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2YXIgdGltZUljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICAkKHRpbWVJY29uKS5hdHRyKHtcbiAgICAgICAgICAgIHNyYzogXCIuLi9fc3RhdGljL2Nsb2NrLnBuZ1wiLFxuICAgICAgICAgICAgc3R5bGU6IFwid2lkdGg6MTVweDtoZWlnaHQ6MTVweFwiLFxuICAgICAgICB9KTtcbiAgICAgICAgdGltZUljb25EaXYuY2xhc3NOYW1lID0gXCJ0aW1lVGlwXCI7XG4gICAgICAgIHRpbWVJY29uRGl2LnRpdGxlID0gXCJcIjtcbiAgICAgICAgdGltZUljb25EaXYuYXBwZW5kQ2hpbGQodGltZUljb24pO1xuICAgICAgICAkKGNvbXBvbmVudCkucHJlcGVuZCh0aW1lSWNvbkRpdik7XG4gICAgfVxuICAgIGhpZGVCdXR0b25zKCkge1xuICAgICAgICAvL0p1c3QgaGlkaW5nIHRoZSBidXR0b25zIGRvZXNuJ3QgcHJldmVudCBzdWJtaXR0aW5nIHRoZSBmb3JtIHdoZW4gZW50ZXJpbmcgaXMgY2xpY2tlZFxuICAgICAgICAvL1dlIG5lZWQgdG8gY29tcGxldGVseSBkaXNhYmxlIHRoZSBidXR0b25zXG4gICAgICAgICQodGhpcy5zdWJtaXRCdXR0b24pLmF0dHIoXCJkaXNhYmxlZFwiLCBcInRydWVcIik7XG4gICAgICAgICQodGhpcy5zdWJtaXRCdXR0b24pLmhpZGUoKTtcbiAgICAgICAgJCh0aGlzLmNvbXBhcmVCdXR0b24pLmhpZGUoKTtcbiAgICB9XG5cbiAgICAvLyBUaGVzZSBtZXRob2RzIG92ZXJyaWRlIHRoZSBtZXRob2RzIGluIHRoZSBiYXNlIGNsYXNzLiBDYWxsZWQgZnJvbSByZW5kZXJGZWVkYmFjaygpXG4gICAgLy9cbiAgICByZW5kZXJNQ01BRmVlZEJhY2soKSB7XG4gICAgICAgIHRoaXMuZmVlZGJhY2tUaW1lZE1DKCk7XG4gICAgfVxuICAgIHJlbmRlck1DTUZGZWVkYmFjayh3aGF0ZXZlciwgd2hhdGV2ZXJyKSB7XG4gICAgICAgIHRoaXMuZmVlZGJhY2tUaW1lZE1DKCk7XG4gICAgfVxuICAgIGZlZWRiYWNrVGltZWRNQygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmluZGV4QXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB0bXBpbmRleCA9IHRoaXMuaW5kZXhBcnJheVtpXTtcbiAgICAgICAgICAgICQodGhpcy5mZWVkQmFja0VhY2hBcnJheVtpXSkuaHRtbChcbiAgICAgICAgICAgICAgICBTdHJpbmcuZnJvbUNoYXJDb2RlKDY1ICsgaSkgKyBcIi4gXCIgKyB0aGlzLmZlZWRiYWNrTGlzdFtpXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHZhciB0bXBpZCA9IHRoaXMuYW5zd2VyTGlzdFt0bXBpbmRleF0uaWQ7XG4gICAgICAgICAgICBpZiAodGhpcy5jb3JyZWN0TGlzdC5pbmRleE9mKHRtcGlkKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkQmFja0VhY2hBcnJheVtpXS5jbGFzc0xpc3QuYWRkKFxuICAgICAgICAgICAgICAgICAgICBcImFsZXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYWxlcnQtc3VjY2Vzc1wiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkQmFja0VhY2hBcnJheVtpXS5jbGFzc0xpc3QuYWRkKFxuICAgICAgICAgICAgICAgICAgICBcImFsZXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYWxlcnQtZGFuZ2VyXCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlck1DRm9ybU9wdHMoKSB7XG4gICAgICAgIHN1cGVyLnJlbmRlck1DRm9ybU9wdHMoKTtcbiAgICAgICAgdGhpcy5mZWVkQmFja0VhY2hBcnJheSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuYW5zd2VyTGlzdC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdmFyIGsgPSB0aGlzLmluZGV4QXJyYXlbal07XG4gICAgICAgICAgICB2YXIgZmVlZEJhY2tFYWNoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIGZlZWRCYWNrRWFjaC5pZCA9IHRoaXMuZGl2aWQgKyBcIl9lYWNoRmVlZGJhY2tfXCIgKyBrO1xuICAgICAgICAgICAgZmVlZEJhY2tFYWNoLmNsYXNzTGlzdC5hZGQoXCJlYWNoRmVlZGJhY2tcIik7XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRWFjaEFycmF5LnB1c2goZmVlZEJhY2tFYWNoKTtcbiAgICAgICAgICAgIHRoaXMub3B0c0Zvcm0uYXBwZW5kQ2hpbGQoZmVlZEJhY2tFYWNoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjaGVja0NvcnJlY3RUaW1lZE1DTUEoKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdENvdW50ID09PSB0aGlzLmNvcnJlY3RMaXN0Lmxlbmd0aCAmJlxuICAgICAgICAgICAgdGhpcy5jb3JyZWN0TGlzdC5sZW5ndGggPT09IHRoaXMuZ2l2ZW5BcnJheS5sZW5ndGhcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZ2l2ZW5BcnJheS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gcXVlc3Rpb24gd2FzIHNraXBwZWRcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0aGlzLmNvcnJlY3QpIHtcbiAgICAgICAgICAgIGNhc2UgdHJ1ZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJUXCI7XG4gICAgICAgICAgICBjYXNlIGZhbHNlOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIkZcIjtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2hlY2tDb3JyZWN0VGltZWRNQ01GKCkge1xuICAgICAgICAvLyBSZXR1cm5zIGlmIHRoZSBxdWVzdGlvbiB3YXMgY29ycmVjdCwgaW5jb3JyZWN0LCBvciBza2lwcGVkIChyZXR1cm4gbnVsbCBpbiB0aGUgbGFzdCBjYXNlKVxuICAgICAgICBzd2l0Y2ggKHRoaXMuY29ycmVjdCkge1xuICAgICAgICAgICAgY2FzZSB0cnVlOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIlRcIjtcbiAgICAgICAgICAgIGNhc2UgZmFsc2U6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiRlwiO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjaGVja0NvcnJlY3RUaW1lZCgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVja0NvcnJlY3RUaW1lZE1DTUEoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrQ29ycmVjdFRpbWVkTUNNRigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGhpZGVGZWVkYmFjaygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmZlZWRCYWNrRWFjaEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAkKHRoaXMuZmVlZEJhY2tFYWNoQXJyYXlbaV0pLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlaW5pdGlhbGl6ZUxpc3RlbmVycygpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBsZXQgYW5zd2VyRnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYuaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIGZvciAobGV0IG9wdCBvZiB0aGlzLm9wdGlvbkFycmF5KSB7XG4gICAgICAgICAgICBvcHQuaW5wdXQub25jbGljayA9IGFuc3dlckZ1bmM7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID0ge307XG59XG5cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeS5tdWx0aXBsZWNob2ljZSA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgaWYgKG9wdHMudGltZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW1lZE1DKG9wdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgTXVsdGlwbGVDaG9pY2Uob3B0cyk7XG4gICAgfVxufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==