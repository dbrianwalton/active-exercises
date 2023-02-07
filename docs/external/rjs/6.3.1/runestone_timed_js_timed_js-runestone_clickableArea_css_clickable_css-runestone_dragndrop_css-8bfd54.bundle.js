"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_timed_js_timed_js-runestone_clickableArea_css_clickable_css-runestone_dragndrop_css-8bfd54"],{

/***/ 23369:
/*!***************************************!*\
  !*** ./runestone/timed/css/timed.css ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 58707:
/*!*************************************!*\
  !*** ./runestone/timed/js/timed.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TimedList": () => (/* binding */ TimedList),
/* harmony export */   "default": () => (/* binding */ Timed)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 2568);
/* harmony import */ var _fitb_js_timedfitb_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../fitb/js/timedfitb.js */ 74309);
/* harmony import */ var _mchoice_js_timedmc_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../mchoice/js/timedmc.js */ 95983);
/* harmony import */ var _shortanswer_js_timed_shortanswer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shortanswer/js/timed_shortanswer.js */ 87483);
/* harmony import */ var _activecode_js_acfactory_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../activecode/js/acfactory.js */ 86902);
/* harmony import */ var _clickableArea_js_timedclickable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../clickableArea/js/timedclickable */ 61581);
/* harmony import */ var _dragndrop_js_timeddnd_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../dragndrop/js/timeddnd.js */ 47496);
/* harmony import */ var _parsons_js_timedparsons_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../parsons/js/timedparsons.js */ 79661);
/* harmony import */ var _selectquestion_js_selectone__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../selectquestion/js/selectone */ 63931);
/* harmony import */ var _css_timed_css__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../css/timed.css */ 23369);
/*==========================================
========      Master timed.js     =========
============================================
===     This file contains the JS for    ===
===     the Runestone timed component.   ===
============================================
===              Created By              ===
===             Kirby Olson              ===
===               6/11/15                ===
==========================================*/













var TimedList = {}; // Timed dictionary

// Timed constructor
class Timed extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig;
        this.origElem = orig; // the entire element of this timed assessment and all of its children
        this.divid = orig.id;
        this.children = this.origElem.childNodes;
        this.visited = [];
        this.timeLimit = 0;
        this.limitedTime = false;
        if (!isNaN($(this.origElem).data("time"))) {
            this.timeLimit = parseInt($(this.origElem).data("time"), 10) * 60; // time in seconds to complete the exam
            this.startingTime = this.timeLimit;
            this.limitedTime = true;
        }
        this.showFeedback = true;
        if ($(this.origElem).is("[data-no-feedback]")) {
            this.showFeedback = false;
        }
        this.showResults = true;
        if ($(this.origElem).is("[data-no-result]")) {
            this.showResults = false;
        }
        this.random = false;
        if ($(this.origElem).is("[data-random]")) {
            this.random = true;
        }
        this.showTimer = true;
        if ($(this.origElem).is("[data-no-timer]")) {
            this.showTimer = false;
        }
        this.fullwidth = false;
        if ($(this.origElem).is("[data-fullwidth]")) {
            this.fullwidth = true;
        }
        this.nopause = false;
        if ($(this.origElem).is("[data-no-pause]")) {
            this.nopause = true;
        }
        eBookConfig.enableScratchAC = false;
        this.running = 0;
        this.paused = 0;
        this.done = 0;
        this.taken = 0;
        this.score = 0;
        this.incorrect = 0;
        this.correctStr = "";
        this.incorrectStr = "";
        this.skippedStr = "";
        this.skipped = 0;
        this.currentQuestionIndex = 0; // Which question is currently displaying on the page
        this.renderedQuestionArray = []; // list of all problems
        this.getNewChildren();
        // One small step to eliminate students from doing view source
        // this won't stop anyone with determination but may prevent casual peeking
        if (!eBookConfig.enableDebug) {
            document.body.oncontextmenu = function () {
                return false;
            };
        }
        this.checkAssessmentStatus().then(
            function () {
                this.renderTimedAssess();
            }.bind(this)
        );
    }

    getNewChildren() {
        this.newChildren = [];
        let runestoneChildren = this.origElem.querySelectorAll(".runestone")
        for (var i = 0; i < runestoneChildren.length; i++) {
            this.newChildren.push(runestoneChildren[i]);
        }
    }

    async checkAssessmentStatus() {
        // Has the user taken this exam?  Inquiring minds want to know
        // If a user has not taken this exam then we want to make sure
        // that if a question has been seen by the student before we do
        // not populate previous answers.
        let sendInfo = {
            div_id: this.divid,
            course_name: eBookConfig.course,
        };
        console.log(sendInfo);
        if (eBookConfig.useRunestoneServices) {
            let request = new Request(
                `${eBookConfig.new_server_prefix}/assessment/tookTimedAssessment`,
                {
                    method: "POST",
                    headers: this.jsonHeaders,
                    body: JSON.stringify(sendInfo),
                }
            );
            let response = await fetch(request);
            let data = await response.json();
            data = data.detail;
            this.taken = data.tookAssessment;
            this.assessmentTaken = this.taken;
            if (!this.taken) {
                localStorage.clear();
            }
            console.log("done with check status");
            return response;
        } else {
            this.taken = false;
            this.assessmentTaken = false;
            return Promise.resolve();
        }
    }

    /*===============================
    === Generating new Timed HTML ===
    ===============================*/
    async renderTimedAssess() {
        console.log("rendering timed ");
        // create renderedQuestionArray returns a promise
        //
        this.createRenderedQuestionArray();
        if (this.random) {
            this.randomizeRQA();
        }
        this.renderContainer();
        this.renderTimer();
        await this.renderControlButtons();
        this.containerDiv.appendChild(this.timedDiv); // This can't be appended in renderContainer because then it renders above the timer and control buttons.
        if (this.renderedQuestionArray.length > 1) this.renderNavControls();
        this.renderSubmitButton();
        this.renderFeedbackContainer();
        this.useRunestoneServices = eBookConfig.useRunestoneServices;
        // Replace intermediate HTML with rendered HTML
        $(this.origElem).replaceWith(this.containerDiv);
        // check if already taken and if so show results
        this.styleExamElements(); // rename to renderPossibleResults
        this.checkServer("timedExam", true);
    }

    renderContainer() {
        this.containerDiv = document.createElement("div"); // container for the entire Timed Component
        if (this.fullwidth) {
            // allow the container to fill the width - barb
            $(this.containerDiv).attr({
                style: "max-width:none",
            });
        }
        this.containerDiv.id = this.divid;
        this.timedDiv = document.createElement("div"); // div that will hold the questions for the timed assessment
        this.navDiv = document.createElement("div"); // For navigation control
        $(this.navDiv).attr({
            style: "text-align:center",
        });
        this.flagDiv = document.createElement("div"); // div that will hold the "Flag Question" button
        $(this.flagDiv).attr({
            style: "text-align: center",
        });
        this.switchContainer = document.createElement("div");
        this.switchContainer.classList.add("switchcontainer");
        this.switchDiv = document.createElement("div"); // is replaced by the questions
        this.timedDiv.appendChild(this.navDiv);
        this.timedDiv.appendChild(this.flagDiv); // add flagDiv to timedDiv, which holds components for navigation and questions for timed assessment
        this.timedDiv.appendChild(this.switchContainer);
        this.switchContainer.appendChild(this.switchDiv);
        $(this.timedDiv).attr({
            id: "timed_Test",
            style: "display:none",
        });
    }

    renderTimer() {
        this.wrapperDiv = document.createElement("div");
        this.timerContainer = document.createElement("P");
        this.wrapperDiv.id = this.divid + "-startWrapper";
        this.timerContainer.id = this.divid + "-output";
        this.wrapperDiv.appendChild(this.timerContainer);
        this.showTime();
    }

    renderControlButtons() {
        this.controlDiv = document.createElement("div");
        $(this.controlDiv).attr({
            id: "controls",
            style: "text-align: center",
        });
        this.startBtn = document.createElement("button");
        this.pauseBtn = document.createElement("button");
        $(this.startBtn).attr({
            class: "btn btn-success",
            id: "start",
            tabindex: "0",
            role: "button",
        });
        this.startBtn.textContent = "Start";
        this.startBtn.addEventListener(
            "click",
            async function () {
                $(this.finishButton).hide(); // hide the finish button for now
                $(this.flagButton).show();
                let mess = document.createElement("p");
                mess.innerHTML =
                    "<strong>Warning: You will not be able to continue the exam if you close this tab, close the window, or navigate away from this page!</strong>  Make sure you click the Finish Exam button when you are done to submit your work!";
                this.controlDiv.appendChild(mess);
                mess.classList.add("examwarning");
                await this.renderTimedQuestion();
                this.startAssessment();
            }.bind(this),
            false
        );
        $(this.pauseBtn).attr({
            class: "btn btn-default",
            id: "pause",
            disabled: "true",
            tabindex: "0",
            role: "button",
        });
        this.pauseBtn.textContent = "Pause";
        this.pauseBtn.addEventListener(
            "click",
            function () {
                this.pauseAssessment();
            }.bind(this),
            false
        );
        if (!this.taken) {
            this.controlDiv.appendChild(this.startBtn);
        }
        if (!this.nopause) {
            this.controlDiv.appendChild(this.pauseBtn);
        }
        this.containerDiv.appendChild(this.wrapperDiv);
        this.containerDiv.appendChild(this.controlDiv);
    }

    renderNavControls() {
        // making "Prev" button
        this.pagNavList = document.createElement("ul");
        $(this.pagNavList).addClass("pagination");
        this.leftContainer = document.createElement("li");
        this.leftNavButton = document.createElement("button");
        this.leftNavButton.innerHTML = "&#8249; Prev";
        $(this.leftNavButton).attr("aria-label", "Previous");
        $(this.leftNavButton).attr("tabindex", "0");
        $(this.leftNavButton).attr("role", "button");
        $(this.rightNavButton).attr("id", "prev");
        $(this.leftNavButton).css("cursor", "pointer");
        this.leftContainer.appendChild(this.leftNavButton);
        this.pagNavList.appendChild(this.leftContainer);
        // making "Flag Question" button
        this.flaggingPlace = document.createElement("ul");
        $(this.flaggingPlace).addClass("pagination");
        this.flagContainer = document.createElement("li");
        this.flagButton = document.createElement("button");
        $(this.flagButton).addClass("flagBtn");
        this.flagButton.innerHTML = "Flag Question"; // name on button
        $(this.flagButton).attr("aria-labelledby", "Flag");
        $(this.flagButton).attr("tabindex", "5");
        $(this.flagButton).attr("role", "button");
        $(this.flagButton).attr("id", "flag");
        $(this.flagButton).css("cursor", "pointer");
        this.flagContainer.appendChild(this.flagButton); // adding button to container
        this.flaggingPlace.appendChild(this.flagContainer); // adding container to flaggingPlace
        // making "Next" button
        this.rightContainer = document.createElement("li");
        this.rightNavButton = document.createElement("button");
        $(this.rightNavButton).attr("aria-label", "Next");
        $(this.rightNavButton).attr("tabindex", "0");
        $(this.rightNavButton).attr("role", "button");
        $(this.rightNavButton).attr("id", "next");
        this.rightNavButton.innerHTML = "Next &#8250;";
        $(this.rightNavButton).css("cursor", "pointer");
        this.rightContainer.appendChild(this.rightNavButton);
        this.pagNavList.appendChild(this.rightContainer);
        this.ensureButtonSafety();
        this.navDiv.appendChild(this.pagNavList);
        this.flagDiv.appendChild(this.flaggingPlace); // adds flaggingPlace to the flagDiv
        this.break = document.createElement("br");
        this.navDiv.appendChild(this.break);
        // render the question number jump buttons
        this.qNumList = document.createElement("ul");
        $(this.qNumList).attr("id", "pageNums");
        this.qNumWrapperList = document.createElement("ul");
        $(this.qNumWrapperList).addClass("pagination");
        var tmpLi, tmpA;
        for (var i = 0; i < this.renderedQuestionArray.length; i++) {
            tmpLi = document.createElement("li");
            tmpA = document.createElement("a");
            tmpA.innerHTML = i + 1;
            $(tmpA).css("cursor", "pointer");
            if (i === 0) {
                $(tmpLi).addClass("active");
            }
            tmpLi.appendChild(tmpA);
            this.qNumWrapperList.appendChild(tmpLi);
        }
        this.qNumList.appendChild(this.qNumWrapperList);
        this.navDiv.appendChild(this.qNumList);
        this.navBtnListeners();
        this.flagBtnListener(); // listens for click on flag button
        $(this.flagButton).hide();
    }

    // when moving off of a question in an active exam:
    // 1. show that the question has been seen, or mark it broken if it is in error.
    // 2. check and log the current answer
    async navigateAway() {
        if (
            this.renderedQuestionArray[this.currentQuestionIndex].state ==
            "broken_exam"
        ) {
            $(
                "ul#pageNums > ul > li:eq(" + this.currentQuestionIndex + ")"
            ).addClass("broken");
        }
        if (
            this.renderedQuestionArray[this.currentQuestionIndex].state ==
            "exam_ended"
        ) {
            $(
                "ul#pageNums > ul > li:eq(" + this.currentQuestionIndex + ")"
            ).addClass("toolate");
        }
        if (
            this.renderedQuestionArray[this.currentQuestionIndex].question
                .isAnswered
        ) {
            $(
                "ul#pageNums > ul > li:eq(" + this.currentQuestionIndex + ")"
            ).addClass("answered");
            await this.renderedQuestionArray[
                this.currentQuestionIndex
            ].question.checkCurrentAnswer();
            if (!this.done) {
                await this.renderedQuestionArray[
                    this.currentQuestionIndex
                ].question.logCurrentAnswer();
            }
        }
    }
    async handleNextPrev(event) {
        if (!this.taken) {
            await this.navigateAway();
        }
        var target = $(event.target).text();
        if (target.match(/Next/)) {
            // checks given text to match "Next"
            if ($(this.rightContainer).hasClass("disabled")) {
                return;
            }
            this.currentQuestionIndex++;
        } else if (target.match(/Prev/)) {
            // checks given text to match "Prev"
            if ($(this.leftContainer).hasClass("disabled")) {
                return;
            }
            this.currentQuestionIndex--;
        }
        await this.renderTimedQuestion();
        this.ensureButtonSafety();
        for (var i = 0; i < this.qNumList.childNodes.length; i++) {
            for (
                var j = 0;
                j < this.qNumList.childNodes[i].childNodes.length;
                j++
            ) {
                $(this.qNumList.childNodes[i].childNodes[j]).removeClass(
                    "active"
                );
            }
        }
        $(
            "ul#pageNums > ul > li:eq(" + this.currentQuestionIndex + ")"
        ).addClass("active");
        if (
            $(
                "ul#pageNums > ul > li:eq(" + this.currentQuestionIndex + ")"
            ).hasClass("flagcolor")
        ) {
            // checking for class
            this.flagButton.innerHTML = "Unflag Question"; // changes text on button
        } else {
            this.flagButton.innerHTML = "Flag Question"; // changes text on button
        }
    }

    async handleFlag(event) {
        // called when flag button is clicked
        var target = $(event.target).text();
        if (target.match(/Flag Question/)) {
            $(
                "ul#pageNums > ul > li:eq(" + this.currentQuestionIndex + ")"
            ).addClass("flagcolor"); // class will change color of question block
            this.flagButton.innerHTML = "Unflag Question";
        } else {
            $(
                "ul#pageNums > ul > li:eq(" + this.currentQuestionIndex + ")"
            ).removeClass("flagcolor"); // will restore current color of question block
            this.flagButton.innerHTML = "Flag Question"; // also sets name back
        }
    }

    async handleNumberedNav(event) {
        if (!this.taken) {
            await this.navigateAway();
        }
        for (var i = 0; i < this.qNumList.childNodes.length; i++) {
            for (
                var j = 0;
                j < this.qNumList.childNodes[i].childNodes.length;
                j++
            ) {
                $(this.qNumList.childNodes[i].childNodes[j]).removeClass(
                    "active"
                );
            }
        }

        var target = $(event.target).text();
        let oldIndex = this.currentQuestionIndex;
        this.currentQuestionIndex = parseInt(target) - 1;
        if (this.currentQuestionIndex > this.renderedQuestionArray.length) {
            console.log(`Error: bad index for ${target}`);
            this.currentQuestionIndex = oldIndex;
        }
        $(
            "ul#pageNums > ul > li:eq(" + this.currentQuestionIndex + ")"
        ).addClass("active");
        if (
            $(
                "ul#pageNums > ul > li:eq(" + this.currentQuestionIndex + ")" // checking for flagcolor class
            ).hasClass("flagcolor")
        ) {
            this.flagButton.innerHTML = "Unflag Question";
        } else {
            this.flagButton.innerHTML = "Flag Question";
        }
        await this.renderTimedQuestion();
        this.ensureButtonSafety();
    }

    // set up events for navigation
    navBtnListeners() {
        // Next and Prev Listener
        this.pagNavList.addEventListener(
            "click",
            this.handleNextPrev.bind(this),
            false
        );

        // Numbered Listener
        this.qNumList.addEventListener(
            "click",
            this.handleNumberedNav.bind(this),
            false
        );
    }

    // set up event for flag
    flagBtnListener() {
        this.flaggingPlace.addEventListener(
            "click",
            this.handleFlag.bind(this), // calls this to take action
            false
        );
    }

    renderSubmitButton() {
        this.buttonContainer = document.createElement("div");
        $(this.buttonContainer).attr({
            style: "text-align:center",
        });
        this.finishButton = document.createElement("button");
        $(this.finishButton).attr({
            id: "finish",
            class: "btn btn-primary",
        });
        this.finishButton.textContent = "Finish Exam";
        this.finishButton.addEventListener(
            "click",
            async function () {
                if (
                    window.confirm(
                        "Clicking OK means you are ready to submit your answers and are finished with this assessment."
                    )
                ) {
                    await this.finishAssessment();
                    $(this.flagButton).hide();
                }
            }.bind(this),
            false
        );
        this.controlDiv.appendChild(this.finishButton);
        $(this.finishButton).hide();
        this.timedDiv.appendChild(this.buttonContainer);
    }
    ensureButtonSafety() {
        if (this.currentQuestionIndex === 0) {
            if (this.renderedQuestionArray.length != 1) {
                $(this.rightContainer).removeClass("disabled");
            }
            $(this.leftContainer).addClass("disabled");
        }
        if (
            this.currentQuestionIndex >=
            this.renderedQuestionArray.length - 1
        ) {
            if (this.renderedQuestionArray.length != 1) {
                $(this.leftContainer).removeClass("disabled");
            }
            $(this.rightContainer).addClass("disabled");
        }
        if (
            this.currentQuestionIndex > 0 &&
            this.currentQuestionIndex < this.renderedQuestionArray.length - 1
        ) {
            $(this.rightContainer).removeClass("disabled");
            $(this.leftContainer).removeClass("disabled");
        }
    }
    renderFeedbackContainer() {
        this.scoreDiv = document.createElement("P");
        this.scoreDiv.id = this.divid + "results";
        this.scoreDiv.style.display = "none";
        this.containerDiv.appendChild(this.scoreDiv);
    }

    createRenderedQuestionArray() {
        // this finds all the assess questions in this timed assessment
        // We need to make a list of all the questions up front so we can set up navigation
        // but we do not want to render the questions until the student has navigated
        // Also adds them to this.renderedQuestionArray

        // todo:  This needs to be updated to account for the runestone div wrapper.

        // To accommodate the selectquestion type -- which is async! we need to wrap
        // all of this in a promise, so that we don't continue to render the timed
        // exam until all of the questions have been realized.
        var opts;
        for (var i = 0; i < this.newChildren.length; i++) {
            var tmpChild = this.newChildren[i];
            opts = {
                state: "prepared",
                orig: tmpChild,
                question: {},
                useRunestoneServices: eBookConfig.useRunestoneServices,
                timed: true,
                assessmentTaken: this.taken,
                timedWrapper: this.divid,
                initAttempts: 0,
            };
            if ($(tmpChild).children("[data-component]").length > 0) {
                tmpChild = $(tmpChild).children("[data-component]")[0];
                opts.orig = tmpChild;
            }
            if ($(tmpChild).is("[data-component]")) {
                this.renderedQuestionArray.push(opts);
            }
        }
    }

    randomizeRQA() {
        var currentIndex = this.renderedQuestionArray.length,
            temporaryValue,
            randomIndex;
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = this.renderedQuestionArray[currentIndex];
            this.renderedQuestionArray[currentIndex] =
                this.renderedQuestionArray[randomIndex];
            this.renderedQuestionArray[randomIndex] = temporaryValue;
        }
    }

    async renderTimedQuestion() {
        if (this.currentQuestionIndex >= this.renderedQuestionArray.length) {
            // sometimes the user clicks in the event area for the qNumList
            // But misses a number in that case the text is the concatenation
            // of all the numbers in the list!
            return;
        }
        // check the renderedQuestionArray to see if it has been rendered.
        let opts = this.renderedQuestionArray[this.currentQuestionIndex];
        let currentQuestion;
        if (
            opts.state === "prepared" ||
            opts.state === "forreview" ||
            (opts.state === "broken_exam" && opts.initAttempts < 3)
        ) {
            let tmpChild = opts.orig;
            if ($(tmpChild).is("[data-component=selectquestion]")) {
                if (this.done && opts.state == "prepared") {
                    this.renderedQuestionArray[
                        this.currentQuestionIndex
                    ].state = "exam_ended";
                } else {
                    // SelectOne is async and will replace itself in this array with
                    // the actual selected question
                    opts.rqa = this.renderedQuestionArray;
                    let newq = new _selectquestion_js_selectone__WEBPACK_IMPORTED_MODULE_8__["default"](opts);
                    this.renderedQuestionArray[this.currentQuestionIndex] = {
                        question: newq,
                    };
                    try {
                        await newq.initialize();
                        if (opts.state == "broken_exam") {
                            // remove the broken class from this question if we get here.
                            $(
                                `ul#pageNums > ul > li:eq(${this.currentQuestionIndex})`
                            ).removeClass("broken");
                        }
                    } catch (e) {
                        opts.state = "broken_exam";
                        this.renderedQuestionArray[this.currentQuestionIndex] =
                            opts;
                        console.log(
                            `Error initializing question: Details ${e}`
                        );
                    }
                }
            } else if ($(tmpChild).is("[data-component]")) {
                let componentKind = $(tmpChild).data("component");
                this.renderedQuestionArray[this.currentQuestionIndex] = {
                    question: window.component_factory[componentKind](opts),
                };
            }
        } else if (opts.state === "broken_exam") {
            return;
        }

        currentQuestion =
            this.renderedQuestionArray[this.currentQuestionIndex].question;
        if (opts.state === "forreview") {
            await currentQuestion.checkCurrentAnswer();
            currentQuestion.renderFeedback();
            currentQuestion.disableInteraction();
        }

        if (!this.visited.includes(this.currentQuestionIndex)) {
            this.visited.push(this.currentQuestionIndex);
            if (
                this.visited.length === this.renderedQuestionArray.length &&
                !this.done
            ) {
                $(this.finishButton).show();
            }
        }

        if (currentQuestion.containerDiv) {
            $(this.switchDiv).replaceWith(currentQuestion.containerDiv);
            this.switchDiv = currentQuestion.containerDiv;
        }

        // If the timed component has listeners, those might need to be reinitialized
        // This flag will only be set in the elements that need it--it will be undefined in the others and thus evaluate to false
        if (currentQuestion.needsReinitialization) {
            currentQuestion.reinitializeListeners(this.taken);
        }
    }

    /*=================================
    === Timer and control Functions ===
    =================================*/
    handlePrevAssessment() {
        $(this.startBtn).hide();
        $(this.pauseBtn).attr("disabled", true);
        $(this.finishButton).attr("disabled", true);
        this.running = 0;
        this.done = 1;
        // showFeedback sand showResults should both be true before we show the
        // questions and their state of correctness.
        if (this.showResults && this.showFeedback) {
            $(this.timedDiv).show();
            this.restoreAnsweredQuestions(); // do not log these results
        } else {
            $(this.pauseBtn).hide();
            $(this.timerContainer).hide();
        }
    }
    startAssessment() {
        if (!this.taken) {
            $("#relations-next").hide(); // hide the next page button for now
            $("#relations-prev").hide(); // hide the previous button for now
            $(this.startBtn).hide();
            $(this.pauseBtn).attr("disabled", false);
            if (this.running === 0 && this.paused === 0) {
                this.running = 1;
                this.lastTime = Date.now();
                $(this.timedDiv).show();
                this.increment();
                this.logBookEvent({
                    event: "timedExam",
                    act: "start",
                    div_id: this.divid,
                });
                var timeStamp = new Date();
                var storageObj = {
                    answer: [0, 0, this.renderedQuestionArray.length, 0],
                    timestamp: timeStamp,
                };
                localStorage.setItem(
                    this.localStorageKey(),
                    JSON.stringify(storageObj)
                );
            }
            $(window).on(
                "beforeunload",
                function (event) {
                    // this actual value gets ignored by newer browsers
                    if (this.done) {
                        return;
                    }
                    event.preventDefault();
                    event.returnValue =
                        "Are you sure you want to leave?  Your work will be lost! And you will need your instructor to reset the exam!";
                    return "Are you sure you want to leave?  Your work will be lost!";
                }.bind(this)
            );
            window.addEventListener(
                "pagehide",
                async function (event) {
                    if (!this.done) {
                        await this.finishAssessment();
                        console.log("Exam exited by leaving page");
                    }
                }.bind(this)
            );
        } else {
            this.handlePrevAssessment();
        }
    }
    pauseAssessment() {
        if (this.done === 0) {
            if (this.running === 1) {
                this.logBookEvent({
                    event: "timedExam",
                    act: "pause",
                    div_id: this.divid,
                });
                this.running = 0;
                this.paused = 1;
                this.pauseBtn.innerHTML = "Resume";
                $(this.timedDiv).hide();
            } else {
                this.logBookEvent({
                    event: "timedExam",
                    act: "resume",
                    div_id: this.divid,
                });
                this.running = 1;
                this.paused = 0;
                this.increment();
                this.pauseBtn.innerHTML = "Pause";
                $(this.timedDiv).show();
            }
        }
    }

    showTime() {
        if (this.showTimer) {
            var mins = Math.floor(this.timeLimit / 60);
            var secs = Math.floor(this.timeLimit) % 60;
            var minsString = mins;
            var secsString = secs;
            if (mins < 10) {
                minsString = "0" + mins;
            }
            if (secs < 10) {
                secsString = "0" + secs;
            }
            var beginning = "Time Remaining    ";
            if (!this.limitedTime) {
                beginning = "Time Taken    ";
            }
            var timeString = beginning + minsString + ":" + secsString;
            if (this.done || this.taken) {
                var minutes = Math.floor(this.timeTaken / 60);
                var seconds = Math.floor(this.timeTaken % 60);
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                timeString = "Time taken: " + minutes + ":" + seconds;
            }
            this.timerContainer.innerHTML = timeString;
            var timeTips = document.getElementsByClassName("timeTip");
            for (var i = 0; i <= timeTips.length - 1; i++) {
                timeTips[i].title = timeString;
            }
        } else {
            $(this.timerContainer).hide();
        }
    }

    increment() {
        // if running (not paused) and not taken
        if (this.running === 1 && !this.taken) {
            setTimeout(
                function () {
                    // When a browser loses focus, setTimeout may not be called on the
                    // schedule expected.  Browsers are free to save power by lengthening
                    // the interval to some longer time.  So we cannot just subtract 1
                    // from the timeLimit we need to measure the elapsed time from the last
                    // call to the current call and subtract that number of seconds.
                    let currentTime = Date.now();
                    if (this.limitedTime) {
                        // If there's a time limit, count down to 0
                        this.timeLimit =
                            this.timeLimit -
                            Math.floor((currentTime - this.lastTime) / 1000);
                    } else {
                        // Else count up to keep track of how long it took to complete
                        this.timeLimit =
                            this.timeLimit +
                            Math.floor((currentTime - this.lastTime) / 1000);
                    }
                    this.lastTime = currentTime;
                    localStorage.setItem(
                        eBookConfig.email + ":" + this.divid + "-time",
                        this.timeLimit
                    );
                    this.showTime();
                    if (this.timeLimit > 0) {
                        this.increment();
                        // ran out of time
                    } else {
                        $(this.startBtn).attr({
                            disabled: "true",
                        });
                        $(this.finishButton).attr({
                            disabled: "true",
                        });
                        this.running = 0;
                        this.done = 1;
                        if (!this.taken) {
                            this.taken = true;
                            // embed the message in the page -- an alert actually prevents
                            // the answers from being submitted and if a student closes their
                            // laptop then the answers will not be submitted ever!  Even when they
                            // reopen the laptop their session cookie is likely invalid.
                            let mess = document.createElement("h1");
                            mess.innerHTML =
                                "Sorry but you ran out of time. Your answers are being submitted";
                            this.controlDiv.appendChild(mess);
                            this.finishAssessment();
                        }
                    }
                }.bind(this),
                1000
            );
        }
    }

    styleExamElements() {
        // Checks if this exam has been taken before
        $(this.timerContainer).css({
            width: "50%",
            margin: "0 auto",
            "background-color": "#DFF0D8",
            "text-align": "center",
            border: "2px solid #DFF0D8",
            "border-radius": "25px",
        });
        $(this.scoreDiv).css({
            width: "50%",
            margin: "0 auto",
            "background-color": "#DFF0D8",
            "text-align": "center",
            border: "2px solid #DFF0D8",
            "border-radius": "25px",
        });
        $(".tooltipTime").css({
            margin: "0",
            padding: "0",
            "background-color": "black",
            color: "white",
        });
    }

    async finishAssessment() {
        $("#relations-next").show(); // show the next page button for now
        $("#relations-prev").show(); // show the previous button for now
        if (!this.showFeedback) {
            // bje - changed from showResults
            $(this.timedDiv).hide();
            $(this.pauseBtn).hide();
            $(this.timerContainer).hide();
        }
        this.findTimeTaken();
        this.running = 0;
        this.done = 1;
        this.taken = 1;
        await this.finalizeProblems();
        this.checkScore();
        this.displayScore();
        this.storeScore();
        this.logScore();
        $(this.pauseBtn).attr("disabled", true);
        this.finishButton.disabled = true;
        $(window).off("beforeunload");
        // turn off the pagehide listener
        let assignment_id = this.divid;
        setTimeout(function () {
            jQuery.ajax({
                url: eBookConfig.app + "/assignments/student_autograde",
                type: "POST",
                dataType: "JSON",
                data: {
                    assignment_id: assignment_id,
                    is_timed: true,
                },
                success: function (retdata) {
                    if (retdata.success == false) {
                        console.log(retdata.message);
                    } else {
                        console.log("Autograder completed");
                    }
                },
            });
        }, 2000);
    }

    // finalizeProblems
    // ----------------
    async finalizeProblems() {
        // Because we have submitted each question as we navigate we only need to
        // send the final version of the question the student is on when they press the
        // finish exam button.

        var currentQuestion =
            this.renderedQuestionArray[this.currentQuestionIndex].question;
        await currentQuestion.checkCurrentAnswer();
        await currentQuestion.logCurrentAnswer();
        currentQuestion.renderFeedback();
        currentQuestion.disableInteraction();

        for (var i = 0; i < this.renderedQuestionArray.length; i++) {
            let currentQuestion = this.renderedQuestionArray[i];
            // set the state to forreview so we know that feedback may be appropriate
            if (currentQuestion.state !== "broken_exam") {
                currentQuestion.state = "forreview";
                currentQuestion.question.disableInteraction();
            }
        }

        if (!this.showFeedback) {
            this.hideTimedFeedback();
        }
    }

    // restoreAnsweredQuestions
    // ------------------------
    restoreAnsweredQuestions() {
        for (var i = 0; i < this.renderedQuestionArray.length; i++) {
            var currentQuestion = this.renderedQuestionArray[i];
            if (currentQuestion.state === "prepared") {
                currentQuestion.state = "forreview";
            }
        }
    }

    // hideTimedFeedback
    // -----------------
    hideTimedFeedback() {
        for (var i = 0; i < this.renderedQuestionArray.length; i++) {
            var currentQuestion = this.renderedQuestionArray[i].question;
            currentQuestion.hideFeedback();
        }
    }

    // checkScore
    // ----------
    // This is a simple all or nothing score of one point per question for
    // that includes our best guess if a question was skipped.
    checkScore() {
        this.correctStr = "";
        this.skippedStr = "";
        this.incorrectStr = "";
        // Gets the score of each problem
        for (var i = 0; i < this.renderedQuestionArray.length; i++) {
            var correct =
                this.renderedQuestionArray[i].question.checkCorrectTimed();
            if (correct == "T") {
                this.score++;
                this.correctStr = this.correctStr + (i + 1) + ", ";
            } else if (correct == "F") {
                this.incorrect++;
                this.incorrectStr = this.incorrectStr + (i + 1) + ", ";
            } else if (correct === null || correct === "I") {
                this.skipped++;
                this.skippedStr = this.skippedStr + (i + 1) + ", ";
            } else {
                // ignored question; just do nothing
            }
        }
        // remove extra comma and space at end if any
        if (this.correctStr.length > 0)
            this.correctStr = this.correctStr.substring(
                0,
                this.correctStr.length - 2
            );
        else this.correctStr = "None";
        if (this.skippedStr.length > 0)
            this.skippedStr = this.skippedStr.substring(
                0,
                this.skippedStr.length - 2
            );
        else this.skippedStr = "None";
        if (this.incorrectStr.length > 0)
            this.incorrectStr = this.incorrectStr.substring(
                0,
                this.incorrectStr.length - 2
            );
        else this.incorrectStr = "None";
    }
    findTimeTaken() {
        if (this.limitedTime) {
            this.timeTaken = this.startingTime - this.timeLimit;
        } else {
            this.timeTaken = this.timeLimit;
        }
    }
    storeScore() {
        var storage_arr = [];
        storage_arr.push(
            this.score,
            this.correctStr,
            this.incorrect,
            this.incorrectStr,
            this.skipped,
            this.skippedStr,
            this.timeTaken
        );
        var timeStamp = new Date();
        var storageObj = JSON.stringify({
            answer: storage_arr,
            timestamp: timeStamp,
        });
        localStorage.setItem(this.localStorageKey(), storageObj);
    }
    // _`timed exam endpoint parameters`
    //----------------------------------
    logScore() {
        this.logBookEvent({
            event: "timedExam",
            act: "finish",
            div_id: this.divid,
            correct: this.score,
            incorrect: this.incorrect,
            skipped: this.skipped,
            time_taken: this.timeTaken,
        });
    }
    shouldUseServer(data) {
        // We override the RunestoneBase version because there is no "correct" attribute, and there are 2 possible localStorage schemas
        // --we also want to default to local storage because it contains more information specifically which questions are correct, incorrect, and skipped.
        var storageDate;
        if (localStorage.length === 0) return true;
        var storageObj = localStorage.getItem(this.localStorageKey());
        if (storageObj === null) return true;
        try {
            var storedData = JSON.parse(storageObj).answer;
            if (storedData.length == 4) {
                if (
                    data.correct == storedData[0] &&
                    data.incorrect == storedData[1] &&
                    data.skipped == storedData[2] &&
                    data.timeTaken == storedData[3]
                )
                    return true;
            } else if (storedData.length == 7) {
                if (
                    data.correct == storedData[0] &&
                    data.incorrect == storedData[2] &&
                    data.skipped == storedData[4] &&
                    data.timeTaken == storedData[6]
                ) {
                    return false; // In this case, because local storage has more info, we want to use that if it's consistent
                }
            }
            storageDate = new Date(JSON.parse(storageObj[1]).timestamp);
        } catch (err) {
            // error while parsing; likely due to bad value stored in storage
            console.log(err.message);
            localStorage.removeItem(this.localStorageKey());
            return true;
        }
        var serverDate = new Date(data.timestamp);
        if (serverDate < storageDate) {
            this.logScore();
            return false;
        }
        return true;
    }

    checkLocalStorage() {
        var len = localStorage.length;
        if (len > 0) {
            if (localStorage.getItem(this.localStorageKey()) !== null) {
                this.taken = 1;
                this.restoreAnswers("");
            } else {
                this.taken = 0;
            }
        } else {
            this.taken = 0;
        }
    }
    async restoreAnswers(data) {
        this.taken = 1;
        var tmpArr;
        if (data === "") {
            try {
                tmpArr = JSON.parse(
                    localStorage.getItem(this.localStorageKey())
                ).answer;
            } catch (err) {
                // error while parsing; likely due to bad value stored in storage
                console.log(err.message);
                localStorage.removeItem(this.localStorageKey());
                this.taken = 0;
                return;
            }
        } else {
            // Parse results from the database
            tmpArr = [
                parseInt(data.correct),
                parseInt(data.incorrect),
                parseInt(data.skipped),
                parseInt(data.timeTaken),
                data.reset,
            ];
            this.setLocalStorage(tmpArr);
        }
        if (tmpArr.length == 1) {
            // Exam was previously reset
            this.reset = true;
            this.taken = 0;
            return;
        }
        if (tmpArr.length == 4) {
            // Accidental Reload OR Database Entry
            this.score = tmpArr[0];
            this.incorrect = tmpArr[1];
            this.skipped = tmpArr[2];
            this.timeTaken = tmpArr[3];
        } else if (tmpArr.length == 7) {
            // Loaded Completed Exam
            this.score = tmpArr[0];
            this.correctStr = tmpArr[1];
            this.incorrect = tmpArr[2];
            this.incorrectStr = tmpArr[3];
            this.skipped = tmpArr[4];
            this.skippedStr = tmpArr[5];
            this.timeTaken = tmpArr[6];
        } else {
            // Set localStorage in case of "accidental" reload
            this.score = 0;
            this.incorrect = 0;
            this.skipped = this.renderedQuestionArray.length;
            this.timeTaken = 0;
        }
        if (this.taken) {
            if (this.skipped === this.renderedQuestionArray.length) {
                this.showFeedback = false;
            }
            this.handlePrevAssessment();
        }
        await this.renderTimedQuestion();
        this.displayScore();
        this.showTime();
    }
    setLocalStorage(parsedData) {
        var timeStamp = new Date();
        var storageObj = {
            answer: parsedData,
            timestamp: timeStamp,
        };
        localStorage.setItem(
            this.localStorageKey(),
            JSON.stringify(storageObj)
        );
    }
    displayScore() {
        if (this.showResults) {
            var scoreString = "";
            var numQuestions;
            var percentCorrect;
            // if we have some information
            if (
                this.correctStr.length > 0 ||
                this.incorrectStr.length > 0 ||
                this.skippedStr.length > 0
            ) {
                scoreString = `Num Correct: ${this.score}. Questions: ${this.correctStr}<br>Num Wrong: ${this.incorrect}. Questions: ${this.incorrectStr}<br>Num Skipped: ${this.skipped}. Questions: ${this.skippedStr}<br>`;
                numQuestions = this.score + this.incorrect + this.skipped;
                percentCorrect = (this.score / numQuestions) * 100;
                scoreString += "Percent Correct: " + percentCorrect + "%";
                $(this.scoreDiv).html(scoreString);
                this.scoreDiv.style.display = "block";
            } else {
                scoreString = `Num Correct: ${this.score}<br>Num Wrong: ${this.incorrect}<br>Num Skipped: ${this.skipped}<br>`;
                numQuestions = this.score + this.incorrect + this.skipped;
                percentCorrect = (this.score / numQuestions) * 100;
                scoreString += "Percent Correct: " + percentCorrect + "%";
                $(this.scoreDiv).html(scoreString);
                this.scoreDiv.style.display = "block";
            }
            this.highlightNumberedList();
        } else {
            $(this.scoreDiv).html(
                "Thank you for taking the exam.  Your answers have been recorded."
            );
            this.scoreDiv.style.display = "block";
        }
    }
    highlightNumberedList() {
        var correctCount = this.correctStr;
        var incorrectCount = this.incorrectStr;
        var skippedCount = this.skippedStr;
        correctCount = correctCount.replace(/ /g, "").split(",");
        incorrectCount = incorrectCount.replace(/ /g, "").split(",");
        skippedCount = skippedCount.replace(/ /g, "").split(",");
        $(function () {
            var numberedBtns = $("ul#pageNums > ul > li");
            if (numberedBtns.hasClass("answered")) {
                numberedBtns.removeClass("answered");
            }
            for (var i = 0; i < correctCount.length; i++) {
                var test = parseInt(correctCount[i]) - 1;
                numberedBtns
                    .eq(parseInt(correctCount[i]) - 1)
                    .addClass("correctCount");
            }
            for (var j = 0; j < incorrectCount.length; j++) {
                numberedBtns
                    .eq(parseInt(incorrectCount[j]) - 1)
                    .addClass("incorrectCount");
            }
            for (var k = 0; k < skippedCount.length; k++) {
                numberedBtns
                    .eq(parseInt(skippedCount[k]) - 1)
                    .addClass("skippedCount");
            }
        });
    }
}

/*=======================================================
=== Function that calls the constructors on page load ===
=======================================================*/
$(document).on("runestone:login-complete", function () {
    $("[data-component=timedAssessment]").each(function (index) {
        TimedList[this.id] = new Timed({
            orig: this,
            useRunestoneServices: eBookConfig.useRunestoneServices,
        });
    });
});


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3RpbWVkX2pzX3RpbWVkX2pzLXJ1bmVzdG9uZV9jbGlja2FibGVBcmVhX2Nzc19jbGlja2FibGVfY3NzLXJ1bmVzdG9uZV9kcmFnbmRyb3BfY3NzLThiZmQ1NC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2E7O0FBRWdEO0FBQ1Y7QUFDRDtBQUN1QjtBQUNoQjtBQUNjO0FBQ1g7QUFDQTtBQUNGO0FBQ2hDOztBQUVuQixvQkFBb0I7O0FBRTNCO0FBQ2Usb0JBQW9CLG1FQUFhO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrRUFBK0U7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2Qyx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw4QkFBOEI7QUFDdEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiw4QkFBOEI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNEO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7O0FBRUE7QUFDQSwyREFBMkQ7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RCxxREFBcUQ7QUFDckQ7QUFDQTtBQUNBLFNBQVM7QUFDVCxzREFBc0Q7QUFDdEQ7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0Esd0RBQXdEO0FBQ3hEO0FBQ0EsaURBQWlEO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFEO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQ7QUFDekQsNERBQTREO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFEO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Q7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix1Q0FBdUM7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixxQ0FBcUM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyREFBMkQ7QUFDM0QsVUFBVTtBQUNWLHlEQUF5RDtBQUN6RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDLHlEQUF5RDtBQUN6RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHFDQUFxQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxPQUFPO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDZCQUE2QjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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VTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qix5QkFBeUI7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QiwyQkFBMkI7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIseUJBQXlCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0wsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvdGltZWQvY3NzL3RpbWVkLmNzcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3RpbWVkL2pzL3RpbWVkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09PSAgICAgIE1hc3RlciB0aW1lZC5qcyAgICAgPT09PT09PT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09ICAgICBUaGlzIGZpbGUgY29udGFpbnMgdGhlIEpTIGZvciAgICA9PT1cbj09PSAgICAgdGhlIFJ1bmVzdG9uZSB0aW1lZCBjb21wb25lbnQuICAgPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09ICAgICAgICAgICAgICBDcmVhdGVkIEJ5ICAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICBLaXJieSBPbHNvbiAgICAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgICAgICA2LzExLzE1ICAgICAgICAgICAgICAgID09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanNcIjtcbmltcG9ydCBUaW1lZEZJVEIgZnJvbSBcIi4uLy4uL2ZpdGIvanMvdGltZWRmaXRiLmpzXCI7XG5pbXBvcnQgVGltZWRNQyBmcm9tIFwiLi4vLi4vbWNob2ljZS9qcy90aW1lZG1jLmpzXCI7XG5pbXBvcnQgVGltZWRTaG9ydEFuc3dlciBmcm9tIFwiLi4vLi4vc2hvcnRhbnN3ZXIvanMvdGltZWRfc2hvcnRhbnN3ZXIuanNcIjtcbmltcG9ydCBBQ0ZhY3RvcnkgZnJvbSBcIi4uLy4uL2FjdGl2ZWNvZGUvanMvYWNmYWN0b3J5LmpzXCI7XG5pbXBvcnQgVGltZWRDbGlja2FibGVBcmVhIGZyb20gXCIuLi8uLi9jbGlja2FibGVBcmVhL2pzL3RpbWVkY2xpY2thYmxlXCI7XG5pbXBvcnQgVGltZWREcmFnTkRyb3AgZnJvbSBcIi4uLy4uL2RyYWduZHJvcC9qcy90aW1lZGRuZC5qc1wiO1xuaW1wb3J0IFRpbWVkUGFyc29ucyBmcm9tIFwiLi4vLi4vcGFyc29ucy9qcy90aW1lZHBhcnNvbnMuanNcIjtcbmltcG9ydCBTZWxlY3RPbmUgZnJvbSBcIi4uLy4uL3NlbGVjdHF1ZXN0aW9uL2pzL3NlbGVjdG9uZVwiO1xuaW1wb3J0IFwiLi4vY3NzL3RpbWVkLmNzc1wiO1xuXG5leHBvcnQgdmFyIFRpbWVkTGlzdCA9IHt9OyAvLyBUaW1lZCBkaWN0aW9uYXJ5XG5cbi8vIFRpbWVkIGNvbnN0cnVjdG9yXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lZCBleHRlbmRzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHZhciBvcmlnID0gb3B0cy5vcmlnO1xuICAgICAgICB0aGlzLm9yaWdFbGVtID0gb3JpZzsgLy8gdGhlIGVudGlyZSBlbGVtZW50IG9mIHRoaXMgdGltZWQgYXNzZXNzbWVudCBhbmQgYWxsIG9mIGl0cyBjaGlsZHJlblxuICAgICAgICB0aGlzLmRpdmlkID0gb3JpZy5pZDtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IHRoaXMub3JpZ0VsZW0uY2hpbGROb2RlcztcbiAgICAgICAgdGhpcy52aXNpdGVkID0gW107XG4gICAgICAgIHRoaXMudGltZUxpbWl0ID0gMDtcbiAgICAgICAgdGhpcy5saW1pdGVkVGltZSA9IGZhbHNlO1xuICAgICAgICBpZiAoIWlzTmFOKCQodGhpcy5vcmlnRWxlbSkuZGF0YShcInRpbWVcIikpKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVMaW1pdCA9IHBhcnNlSW50KCQodGhpcy5vcmlnRWxlbSkuZGF0YShcInRpbWVcIiksIDEwKSAqIDYwOyAvLyB0aW1lIGluIHNlY29uZHMgdG8gY29tcGxldGUgdGhlIGV4YW1cbiAgICAgICAgICAgIHRoaXMuc3RhcnRpbmdUaW1lID0gdGhpcy50aW1lTGltaXQ7XG4gICAgICAgICAgICB0aGlzLmxpbWl0ZWRUaW1lID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNob3dGZWVkYmFjayA9IHRydWU7XG4gICAgICAgIGlmICgkKHRoaXMub3JpZ0VsZW0pLmlzKFwiW2RhdGEtbm8tZmVlZGJhY2tdXCIpKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dGZWVkYmFjayA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2hvd1Jlc3VsdHMgPSB0cnVlO1xuICAgICAgICBpZiAoJCh0aGlzLm9yaWdFbGVtKS5pcyhcIltkYXRhLW5vLXJlc3VsdF1cIikpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd1Jlc3VsdHMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJhbmRvbSA9IGZhbHNlO1xuICAgICAgICBpZiAoJCh0aGlzLm9yaWdFbGVtKS5pcyhcIltkYXRhLXJhbmRvbV1cIikpIHtcbiAgICAgICAgICAgIHRoaXMucmFuZG9tID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNob3dUaW1lciA9IHRydWU7XG4gICAgICAgIGlmICgkKHRoaXMub3JpZ0VsZW0pLmlzKFwiW2RhdGEtbm8tdGltZXJdXCIpKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dUaW1lciA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZnVsbHdpZHRoID0gZmFsc2U7XG4gICAgICAgIGlmICgkKHRoaXMub3JpZ0VsZW0pLmlzKFwiW2RhdGEtZnVsbHdpZHRoXVwiKSkge1xuICAgICAgICAgICAgdGhpcy5mdWxsd2lkdGggPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubm9wYXVzZSA9IGZhbHNlO1xuICAgICAgICBpZiAoJCh0aGlzLm9yaWdFbGVtKS5pcyhcIltkYXRhLW5vLXBhdXNlXVwiKSkge1xuICAgICAgICAgICAgdGhpcy5ub3BhdXNlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlQm9va0NvbmZpZy5lbmFibGVTY3JhdGNoQUMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gMDtcbiAgICAgICAgdGhpcy5wYXVzZWQgPSAwO1xuICAgICAgICB0aGlzLmRvbmUgPSAwO1xuICAgICAgICB0aGlzLnRha2VuID0gMDtcbiAgICAgICAgdGhpcy5zY29yZSA9IDA7XG4gICAgICAgIHRoaXMuaW5jb3JyZWN0ID0gMDtcbiAgICAgICAgdGhpcy5jb3JyZWN0U3RyID0gXCJcIjtcbiAgICAgICAgdGhpcy5pbmNvcnJlY3RTdHIgPSBcIlwiO1xuICAgICAgICB0aGlzLnNraXBwZWRTdHIgPSBcIlwiO1xuICAgICAgICB0aGlzLnNraXBwZWQgPSAwO1xuICAgICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ID0gMDsgLy8gV2hpY2ggcXVlc3Rpb24gaXMgY3VycmVudGx5IGRpc3BsYXlpbmcgb24gdGhlIHBhZ2VcbiAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkgPSBbXTsgLy8gbGlzdCBvZiBhbGwgcHJvYmxlbXNcbiAgICAgICAgdGhpcy5nZXROZXdDaGlsZHJlbigpO1xuICAgICAgICAvLyBPbmUgc21hbGwgc3RlcCB0byBlbGltaW5hdGUgc3R1ZGVudHMgZnJvbSBkb2luZyB2aWV3IHNvdXJjZVxuICAgICAgICAvLyB0aGlzIHdvbid0IHN0b3AgYW55b25lIHdpdGggZGV0ZXJtaW5hdGlvbiBidXQgbWF5IHByZXZlbnQgY2FzdWFsIHBlZWtpbmdcbiAgICAgICAgaWYgKCFlQm9va0NvbmZpZy5lbmFibGVEZWJ1Zykge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5vbmNvbnRleHRtZW51ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGVja0Fzc2Vzc21lbnRTdGF0dXMoKS50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyVGltZWRBc3Nlc3MoKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGdldE5ld0NoaWxkcmVuKCkge1xuICAgICAgICB0aGlzLm5ld0NoaWxkcmVuID0gW107XG4gICAgICAgIGxldCBydW5lc3RvbmVDaGlsZHJlbiA9IHRoaXMub3JpZ0VsZW0ucXVlcnlTZWxlY3RvckFsbChcIi5ydW5lc3RvbmVcIilcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBydW5lc3RvbmVDaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5uZXdDaGlsZHJlbi5wdXNoKHJ1bmVzdG9uZUNoaWxkcmVuW2ldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGNoZWNrQXNzZXNzbWVudFN0YXR1cygpIHtcbiAgICAgICAgLy8gSGFzIHRoZSB1c2VyIHRha2VuIHRoaXMgZXhhbT8gIElucXVpcmluZyBtaW5kcyB3YW50IHRvIGtub3dcbiAgICAgICAgLy8gSWYgYSB1c2VyIGhhcyBub3QgdGFrZW4gdGhpcyBleGFtIHRoZW4gd2Ugd2FudCB0byBtYWtlIHN1cmVcbiAgICAgICAgLy8gdGhhdCBpZiBhIHF1ZXN0aW9uIGhhcyBiZWVuIHNlZW4gYnkgdGhlIHN0dWRlbnQgYmVmb3JlIHdlIGRvXG4gICAgICAgIC8vIG5vdCBwb3B1bGF0ZSBwcmV2aW91cyBhbnN3ZXJzLlxuICAgICAgICBsZXQgc2VuZEluZm8gPSB7XG4gICAgICAgICAgICBkaXZfaWQ6IHRoaXMuZGl2aWQsXG4gICAgICAgICAgICBjb3Vyc2VfbmFtZTogZUJvb2tDb25maWcuY291cnNlLFxuICAgICAgICB9O1xuICAgICAgICBjb25zb2xlLmxvZyhzZW5kSW5mbyk7XG4gICAgICAgIGlmIChlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdChcbiAgICAgICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vYXNzZXNzbWVudC90b29rVGltZWRBc3Nlc3NtZW50YCxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuanNvbkhlYWRlcnMsXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHNlbmRJbmZvKSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLmRldGFpbDtcbiAgICAgICAgICAgIHRoaXMudGFrZW4gPSBkYXRhLnRvb2tBc3Nlc3NtZW50O1xuICAgICAgICAgICAgdGhpcy5hc3Nlc3NtZW50VGFrZW4gPSB0aGlzLnRha2VuO1xuICAgICAgICAgICAgaWYgKCF0aGlzLnRha2VuKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImRvbmUgd2l0aCBjaGVjayBzdGF0dXNcIik7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRha2VuID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmFzc2Vzc21lbnRUYWtlbiA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09IEdlbmVyYXRpbmcgbmV3IFRpbWVkIEhUTUwgPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgYXN5bmMgcmVuZGVyVGltZWRBc3Nlc3MoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVuZGVyaW5nIHRpbWVkIFwiKTtcbiAgICAgICAgLy8gY3JlYXRlIHJlbmRlcmVkUXVlc3Rpb25BcnJheSByZXR1cm5zIGEgcHJvbWlzZVxuICAgICAgICAvL1xuICAgICAgICB0aGlzLmNyZWF0ZVJlbmRlcmVkUXVlc3Rpb25BcnJheSgpO1xuICAgICAgICBpZiAodGhpcy5yYW5kb20pIHtcbiAgICAgICAgICAgIHRoaXMucmFuZG9taXplUlFBKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW5kZXJDb250YWluZXIoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJUaW1lcigpO1xuICAgICAgICBhd2FpdCB0aGlzLnJlbmRlckNvbnRyb2xCdXR0b25zKCk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMudGltZWREaXYpOyAvLyBUaGlzIGNhbid0IGJlIGFwcGVuZGVkIGluIHJlbmRlckNvbnRhaW5lciBiZWNhdXNlIHRoZW4gaXQgcmVuZGVycyBhYm92ZSB0aGUgdGltZXIgYW5kIGNvbnRyb2wgYnV0dG9ucy5cbiAgICAgICAgaWYgKHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5Lmxlbmd0aCA+IDEpIHRoaXMucmVuZGVyTmF2Q29udHJvbHMoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJTdWJtaXRCdXR0b24oKTtcbiAgICAgICAgdGhpcy5yZW5kZXJGZWVkYmFja0NvbnRhaW5lcigpO1xuICAgICAgICB0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzID0gZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXM7XG4gICAgICAgIC8vIFJlcGxhY2UgaW50ZXJtZWRpYXRlIEhUTUwgd2l0aCByZW5kZXJlZCBIVE1MXG4gICAgICAgICQodGhpcy5vcmlnRWxlbSkucmVwbGFjZVdpdGgodGhpcy5jb250YWluZXJEaXYpO1xuICAgICAgICAvLyBjaGVjayBpZiBhbHJlYWR5IHRha2VuIGFuZCBpZiBzbyBzaG93IHJlc3VsdHNcbiAgICAgICAgdGhpcy5zdHlsZUV4YW1FbGVtZW50cygpOyAvLyByZW5hbWUgdG8gcmVuZGVyUG9zc2libGVSZXN1bHRzXG4gICAgICAgIHRoaXMuY2hlY2tTZXJ2ZXIoXCJ0aW1lZEV4YW1cIiwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgcmVuZGVyQ29udGFpbmVyKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7IC8vIGNvbnRhaW5lciBmb3IgdGhlIGVudGlyZSBUaW1lZCBDb21wb25lbnRcbiAgICAgICAgaWYgKHRoaXMuZnVsbHdpZHRoKSB7XG4gICAgICAgICAgICAvLyBhbGxvdyB0aGUgY29udGFpbmVyIHRvIGZpbGwgdGhlIHdpZHRoIC0gYmFyYlxuICAgICAgICAgICAgJCh0aGlzLmNvbnRhaW5lckRpdikuYXR0cih7XG4gICAgICAgICAgICAgICAgc3R5bGU6IFwibWF4LXdpZHRoOm5vbmVcIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgdGhpcy50aW1lZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7IC8vIGRpdiB0aGF0IHdpbGwgaG9sZCB0aGUgcXVlc3Rpb25zIGZvciB0aGUgdGltZWQgYXNzZXNzbWVudFxuICAgICAgICB0aGlzLm5hdkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7IC8vIEZvciBuYXZpZ2F0aW9uIGNvbnRyb2xcbiAgICAgICAgJCh0aGlzLm5hdkRpdikuYXR0cih7XG4gICAgICAgICAgICBzdHlsZTogXCJ0ZXh0LWFsaWduOmNlbnRlclwiLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5mbGFnRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTsgLy8gZGl2IHRoYXQgd2lsbCBob2xkIHRoZSBcIkZsYWcgUXVlc3Rpb25cIiBidXR0b25cbiAgICAgICAgJCh0aGlzLmZsYWdEaXYpLmF0dHIoe1xuICAgICAgICAgICAgc3R5bGU6IFwidGV4dC1hbGlnbjogY2VudGVyXCIsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnN3aXRjaENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuc3dpdGNoQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJzd2l0Y2hjb250YWluZXJcIik7XG4gICAgICAgIHRoaXMuc3dpdGNoRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTsgLy8gaXMgcmVwbGFjZWQgYnkgdGhlIHF1ZXN0aW9uc1xuICAgICAgICB0aGlzLnRpbWVkRGl2LmFwcGVuZENoaWxkKHRoaXMubmF2RGl2KTtcbiAgICAgICAgdGhpcy50aW1lZERpdi5hcHBlbmRDaGlsZCh0aGlzLmZsYWdEaXYpOyAvLyBhZGQgZmxhZ0RpdiB0byB0aW1lZERpdiwgd2hpY2ggaG9sZHMgY29tcG9uZW50cyBmb3IgbmF2aWdhdGlvbiBhbmQgcXVlc3Rpb25zIGZvciB0aW1lZCBhc3Nlc3NtZW50XG4gICAgICAgIHRoaXMudGltZWREaXYuYXBwZW5kQ2hpbGQodGhpcy5zd2l0Y2hDb250YWluZXIpO1xuICAgICAgICB0aGlzLnN3aXRjaENvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnN3aXRjaERpdik7XG4gICAgICAgICQodGhpcy50aW1lZERpdikuYXR0cih7XG4gICAgICAgICAgICBpZDogXCJ0aW1lZF9UZXN0XCIsXG4gICAgICAgICAgICBzdHlsZTogXCJkaXNwbGF5Om5vbmVcIixcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVuZGVyVGltZXIoKSB7XG4gICAgICAgIHRoaXMud3JhcHBlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMudGltZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiUFwiKTtcbiAgICAgICAgdGhpcy53cmFwcGVyRGl2LmlkID0gdGhpcy5kaXZpZCArIFwiLXN0YXJ0V3JhcHBlclwiO1xuICAgICAgICB0aGlzLnRpbWVyQ29udGFpbmVyLmlkID0gdGhpcy5kaXZpZCArIFwiLW91dHB1dFwiO1xuICAgICAgICB0aGlzLndyYXBwZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy50aW1lckNvbnRhaW5lcik7XG4gICAgICAgIHRoaXMuc2hvd1RpbWUoKTtcbiAgICB9XG5cbiAgICByZW5kZXJDb250cm9sQnV0dG9ucygpIHtcbiAgICAgICAgdGhpcy5jb250cm9sRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgJCh0aGlzLmNvbnRyb2xEaXYpLmF0dHIoe1xuICAgICAgICAgICAgaWQ6IFwiY29udHJvbHNcIixcbiAgICAgICAgICAgIHN0eWxlOiBcInRleHQtYWxpZ246IGNlbnRlclwiLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zdGFydEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMucGF1c2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAkKHRoaXMuc3RhcnRCdG4pLmF0dHIoe1xuICAgICAgICAgICAgY2xhc3M6IFwiYnRuIGJ0bi1zdWNjZXNzXCIsXG4gICAgICAgICAgICBpZDogXCJzdGFydFwiLFxuICAgICAgICAgICAgdGFiaW5kZXg6IFwiMFwiLFxuICAgICAgICAgICAgcm9sZTogXCJidXR0b25cIixcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc3RhcnRCdG4udGV4dENvbnRlbnQgPSBcIlN0YXJ0XCI7XG4gICAgICAgIHRoaXMuc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMuZmluaXNoQnV0dG9uKS5oaWRlKCk7IC8vIGhpZGUgdGhlIGZpbmlzaCBidXR0b24gZm9yIG5vd1xuICAgICAgICAgICAgICAgICQodGhpcy5mbGFnQnV0dG9uKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgbGV0IG1lc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgICAgICBtZXNzLmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgICAgIFwiPHN0cm9uZz5XYXJuaW5nOiBZb3Ugd2lsbCBub3QgYmUgYWJsZSB0byBjb250aW51ZSB0aGUgZXhhbSBpZiB5b3UgY2xvc2UgdGhpcyB0YWIsIGNsb3NlIHRoZSB3aW5kb3csIG9yIG5hdmlnYXRlIGF3YXkgZnJvbSB0aGlzIHBhZ2UhPC9zdHJvbmc+ICBNYWtlIHN1cmUgeW91IGNsaWNrIHRoZSBGaW5pc2ggRXhhbSBidXR0b24gd2hlbiB5b3UgYXJlIGRvbmUgdG8gc3VibWl0IHlvdXIgd29yayFcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xEaXYuYXBwZW5kQ2hpbGQobWVzcyk7XG4gICAgICAgICAgICAgICAgbWVzcy5jbGFzc0xpc3QuYWRkKFwiZXhhbXdhcm5pbmdcIik7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5yZW5kZXJUaW1lZFF1ZXN0aW9uKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydEFzc2Vzc21lbnQoKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG4gICAgICAgICQodGhpcy5wYXVzZUJ0bikuYXR0cih7XG4gICAgICAgICAgICBjbGFzczogXCJidG4gYnRuLWRlZmF1bHRcIixcbiAgICAgICAgICAgIGlkOiBcInBhdXNlXCIsXG4gICAgICAgICAgICBkaXNhYmxlZDogXCJ0cnVlXCIsXG4gICAgICAgICAgICB0YWJpbmRleDogXCIwXCIsXG4gICAgICAgICAgICByb2xlOiBcImJ1dHRvblwiLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5wYXVzZUJ0bi50ZXh0Q29udGVudCA9IFwiUGF1c2VcIjtcbiAgICAgICAgdGhpcy5wYXVzZUJ0bi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGF1c2VBc3Nlc3NtZW50KCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgICAgICBpZiAoIXRoaXMudGFrZW4pIHtcbiAgICAgICAgICAgIHRoaXMuY29udHJvbERpdi5hcHBlbmRDaGlsZCh0aGlzLnN0YXJ0QnRuKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMubm9wYXVzZSkge1xuICAgICAgICAgICAgdGhpcy5jb250cm9sRGl2LmFwcGVuZENoaWxkKHRoaXMucGF1c2VCdG4pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMud3JhcHBlckRpdik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuY29udHJvbERpdik7XG4gICAgfVxuXG4gICAgcmVuZGVyTmF2Q29udHJvbHMoKSB7XG4gICAgICAgIC8vIG1ha2luZyBcIlByZXZcIiBidXR0b25cbiAgICAgICAgdGhpcy5wYWdOYXZMaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xuICAgICAgICAkKHRoaXMucGFnTmF2TGlzdCkuYWRkQ2xhc3MoXCJwYWdpbmF0aW9uXCIpO1xuICAgICAgICB0aGlzLmxlZnRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgIHRoaXMubGVmdE5hdkJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMubGVmdE5hdkJ1dHRvbi5pbm5lckhUTUwgPSBcIiYjODI0OTsgUHJldlwiO1xuICAgICAgICAkKHRoaXMubGVmdE5hdkJ1dHRvbikuYXR0cihcImFyaWEtbGFiZWxcIiwgXCJQcmV2aW91c1wiKTtcbiAgICAgICAgJCh0aGlzLmxlZnROYXZCdXR0b24pLmF0dHIoXCJ0YWJpbmRleFwiLCBcIjBcIik7XG4gICAgICAgICQodGhpcy5sZWZ0TmF2QnV0dG9uKS5hdHRyKFwicm9sZVwiLCBcImJ1dHRvblwiKTtcbiAgICAgICAgJCh0aGlzLnJpZ2h0TmF2QnV0dG9uKS5hdHRyKFwiaWRcIiwgXCJwcmV2XCIpO1xuICAgICAgICAkKHRoaXMubGVmdE5hdkJ1dHRvbikuY3NzKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKTtcbiAgICAgICAgdGhpcy5sZWZ0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMubGVmdE5hdkJ1dHRvbik7XG4gICAgICAgIHRoaXMucGFnTmF2TGlzdC5hcHBlbmRDaGlsZCh0aGlzLmxlZnRDb250YWluZXIpO1xuICAgICAgICAvLyBtYWtpbmcgXCJGbGFnIFF1ZXN0aW9uXCIgYnV0dG9uXG4gICAgICAgIHRoaXMuZmxhZ2dpbmdQbGFjZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcbiAgICAgICAgJCh0aGlzLmZsYWdnaW5nUGxhY2UpLmFkZENsYXNzKFwicGFnaW5hdGlvblwiKTtcbiAgICAgICAgdGhpcy5mbGFnQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgICAgICB0aGlzLmZsYWdCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAkKHRoaXMuZmxhZ0J1dHRvbikuYWRkQ2xhc3MoXCJmbGFnQnRuXCIpO1xuICAgICAgICB0aGlzLmZsYWdCdXR0b24uaW5uZXJIVE1MID0gXCJGbGFnIFF1ZXN0aW9uXCI7IC8vIG5hbWUgb24gYnV0dG9uXG4gICAgICAgICQodGhpcy5mbGFnQnV0dG9uKS5hdHRyKFwiYXJpYS1sYWJlbGxlZGJ5XCIsIFwiRmxhZ1wiKTtcbiAgICAgICAgJCh0aGlzLmZsYWdCdXR0b24pLmF0dHIoXCJ0YWJpbmRleFwiLCBcIjVcIik7XG4gICAgICAgICQodGhpcy5mbGFnQnV0dG9uKS5hdHRyKFwicm9sZVwiLCBcImJ1dHRvblwiKTtcbiAgICAgICAgJCh0aGlzLmZsYWdCdXR0b24pLmF0dHIoXCJpZFwiLCBcImZsYWdcIik7XG4gICAgICAgICQodGhpcy5mbGFnQnV0dG9uKS5jc3MoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpO1xuICAgICAgICB0aGlzLmZsYWdDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5mbGFnQnV0dG9uKTsgLy8gYWRkaW5nIGJ1dHRvbiB0byBjb250YWluZXJcbiAgICAgICAgdGhpcy5mbGFnZ2luZ1BsYWNlLmFwcGVuZENoaWxkKHRoaXMuZmxhZ0NvbnRhaW5lcik7IC8vIGFkZGluZyBjb250YWluZXIgdG8gZmxhZ2dpbmdQbGFjZVxuICAgICAgICAvLyBtYWtpbmcgXCJOZXh0XCIgYnV0dG9uXG4gICAgICAgIHRoaXMucmlnaHRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgIHRoaXMucmlnaHROYXZCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAkKHRoaXMucmlnaHROYXZCdXR0b24pLmF0dHIoXCJhcmlhLWxhYmVsXCIsIFwiTmV4dFwiKTtcbiAgICAgICAgJCh0aGlzLnJpZ2h0TmF2QnV0dG9uKS5hdHRyKFwidGFiaW5kZXhcIiwgXCIwXCIpO1xuICAgICAgICAkKHRoaXMucmlnaHROYXZCdXR0b24pLmF0dHIoXCJyb2xlXCIsIFwiYnV0dG9uXCIpO1xuICAgICAgICAkKHRoaXMucmlnaHROYXZCdXR0b24pLmF0dHIoXCJpZFwiLCBcIm5leHRcIik7XG4gICAgICAgIHRoaXMucmlnaHROYXZCdXR0b24uaW5uZXJIVE1MID0gXCJOZXh0ICYjODI1MDtcIjtcbiAgICAgICAgJCh0aGlzLnJpZ2h0TmF2QnV0dG9uKS5jc3MoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpO1xuICAgICAgICB0aGlzLnJpZ2h0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMucmlnaHROYXZCdXR0b24pO1xuICAgICAgICB0aGlzLnBhZ05hdkxpc3QuYXBwZW5kQ2hpbGQodGhpcy5yaWdodENvbnRhaW5lcik7XG4gICAgICAgIHRoaXMuZW5zdXJlQnV0dG9uU2FmZXR5KCk7XG4gICAgICAgIHRoaXMubmF2RGl2LmFwcGVuZENoaWxkKHRoaXMucGFnTmF2TGlzdCk7XG4gICAgICAgIHRoaXMuZmxhZ0Rpdi5hcHBlbmRDaGlsZCh0aGlzLmZsYWdnaW5nUGxhY2UpOyAvLyBhZGRzIGZsYWdnaW5nUGxhY2UgdG8gdGhlIGZsYWdEaXZcbiAgICAgICAgdGhpcy5icmVhayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJiclwiKTtcbiAgICAgICAgdGhpcy5uYXZEaXYuYXBwZW5kQ2hpbGQodGhpcy5icmVhayk7XG4gICAgICAgIC8vIHJlbmRlciB0aGUgcXVlc3Rpb24gbnVtYmVyIGp1bXAgYnV0dG9uc1xuICAgICAgICB0aGlzLnFOdW1MaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xuICAgICAgICAkKHRoaXMucU51bUxpc3QpLmF0dHIoXCJpZFwiLCBcInBhZ2VOdW1zXCIpO1xuICAgICAgICB0aGlzLnFOdW1XcmFwcGVyTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcbiAgICAgICAgJCh0aGlzLnFOdW1XcmFwcGVyTGlzdCkuYWRkQ2xhc3MoXCJwYWdpbmF0aW9uXCIpO1xuICAgICAgICB2YXIgdG1wTGksIHRtcEE7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRtcExpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgICAgICAgICAgdG1wQSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgdG1wQS5pbm5lckhUTUwgPSBpICsgMTtcbiAgICAgICAgICAgICQodG1wQSkuY3NzKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKTtcbiAgICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgJCh0bXBMaSkuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0bXBMaS5hcHBlbmRDaGlsZCh0bXBBKTtcbiAgICAgICAgICAgIHRoaXMucU51bVdyYXBwZXJMaXN0LmFwcGVuZENoaWxkKHRtcExpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnFOdW1MaXN0LmFwcGVuZENoaWxkKHRoaXMucU51bVdyYXBwZXJMaXN0KTtcbiAgICAgICAgdGhpcy5uYXZEaXYuYXBwZW5kQ2hpbGQodGhpcy5xTnVtTGlzdCk7XG4gICAgICAgIHRoaXMubmF2QnRuTGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMuZmxhZ0J0bkxpc3RlbmVyKCk7IC8vIGxpc3RlbnMgZm9yIGNsaWNrIG9uIGZsYWcgYnV0dG9uXG4gICAgICAgICQodGhpcy5mbGFnQnV0dG9uKS5oaWRlKCk7XG4gICAgfVxuXG4gICAgLy8gd2hlbiBtb3Zpbmcgb2ZmIG9mIGEgcXVlc3Rpb24gaW4gYW4gYWN0aXZlIGV4YW06XG4gICAgLy8gMS4gc2hvdyB0aGF0IHRoZSBxdWVzdGlvbiBoYXMgYmVlbiBzZWVuLCBvciBtYXJrIGl0IGJyb2tlbiBpZiBpdCBpcyBpbiBlcnJvci5cbiAgICAvLyAyLiBjaGVjayBhbmQgbG9nIHRoZSBjdXJyZW50IGFuc3dlclxuICAgIGFzeW5jIG5hdmlnYXRlQXdheSgpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF0uc3RhdGUgPT1cbiAgICAgICAgICAgIFwiYnJva2VuX2V4YW1cIlxuICAgICAgICApIHtcbiAgICAgICAgICAgICQoXG4gICAgICAgICAgICAgICAgXCJ1bCNwYWdlTnVtcyA+IHVsID4gbGk6ZXEoXCIgKyB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ICsgXCIpXCJcbiAgICAgICAgICAgICkuYWRkQ2xhc3MoXCJicm9rZW5cIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF0uc3RhdGUgPT1cbiAgICAgICAgICAgIFwiZXhhbV9lbmRlZFwiXG4gICAgICAgICkge1xuICAgICAgICAgICAgJChcbiAgICAgICAgICAgICAgICBcInVsI3BhZ2VOdW1zID4gdWwgPiBsaTplcShcIiArIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXggKyBcIilcIlxuICAgICAgICAgICAgKS5hZGRDbGFzcyhcInRvb2xhdGVcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF0ucXVlc3Rpb25cbiAgICAgICAgICAgICAgICAuaXNBbnN3ZXJlZFxuICAgICAgICApIHtcbiAgICAgICAgICAgICQoXG4gICAgICAgICAgICAgICAgXCJ1bCNwYWdlTnVtcyA+IHVsID4gbGk6ZXEoXCIgKyB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ICsgXCIpXCJcbiAgICAgICAgICAgICkuYWRkQ2xhc3MoXCJhbnN3ZXJlZFwiKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXhcbiAgICAgICAgICAgIF0ucXVlc3Rpb24uY2hlY2tDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZG9uZSkge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4XG4gICAgICAgICAgICAgICAgXS5xdWVzdGlvbi5sb2dDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgaGFuZGxlTmV4dFByZXYoZXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLnRha2VuKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLm5hdmlnYXRlQXdheSgpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCkudGV4dCgpO1xuICAgICAgICBpZiAodGFyZ2V0Lm1hdGNoKC9OZXh0LykpIHtcbiAgICAgICAgICAgIC8vIGNoZWNrcyBnaXZlbiB0ZXh0IHRvIG1hdGNoIFwiTmV4dFwiXG4gICAgICAgICAgICBpZiAoJCh0aGlzLnJpZ2h0Q29udGFpbmVyKS5oYXNDbGFzcyhcImRpc2FibGVkXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCsrO1xuICAgICAgICB9IGVsc2UgaWYgKHRhcmdldC5tYXRjaCgvUHJldi8pKSB7XG4gICAgICAgICAgICAvLyBjaGVja3MgZ2l2ZW4gdGV4dCB0byBtYXRjaCBcIlByZXZcIlxuICAgICAgICAgICAgaWYgKCQodGhpcy5sZWZ0Q29udGFpbmVyKS5oYXNDbGFzcyhcImRpc2FibGVkXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleC0tO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHRoaXMucmVuZGVyVGltZWRRdWVzdGlvbigpO1xuICAgICAgICB0aGlzLmVuc3VyZUJ1dHRvblNhZmV0eSgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucU51bUxpc3QuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChcbiAgICAgICAgICAgICAgICB2YXIgaiA9IDA7XG4gICAgICAgICAgICAgICAgaiA8IHRoaXMucU51bUxpc3QuY2hpbGROb2Rlc1tpXS5jaGlsZE5vZGVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBqKytcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICQodGhpcy5xTnVtTGlzdC5jaGlsZE5vZGVzW2ldLmNoaWxkTm9kZXNbal0pLnJlbW92ZUNsYXNzKFxuICAgICAgICAgICAgICAgICAgICBcImFjdGl2ZVwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAkKFxuICAgICAgICAgICAgXCJ1bCNwYWdlTnVtcyA+IHVsID4gbGk6ZXEoXCIgKyB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ICsgXCIpXCJcbiAgICAgICAgKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgJChcbiAgICAgICAgICAgICAgICBcInVsI3BhZ2VOdW1zID4gdWwgPiBsaTplcShcIiArIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXggKyBcIilcIlxuICAgICAgICAgICAgKS5oYXNDbGFzcyhcImZsYWdjb2xvclwiKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIGNoZWNraW5nIGZvciBjbGFzc1xuICAgICAgICAgICAgdGhpcy5mbGFnQnV0dG9uLmlubmVySFRNTCA9IFwiVW5mbGFnIFF1ZXN0aW9uXCI7IC8vIGNoYW5nZXMgdGV4dCBvbiBidXR0b25cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZmxhZ0J1dHRvbi5pbm5lckhUTUwgPSBcIkZsYWcgUXVlc3Rpb25cIjsgLy8gY2hhbmdlcyB0ZXh0IG9uIGJ1dHRvblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgaGFuZGxlRmxhZyhldmVudCkge1xuICAgICAgICAvLyBjYWxsZWQgd2hlbiBmbGFnIGJ1dHRvbiBpcyBjbGlja2VkXG4gICAgICAgIHZhciB0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCkudGV4dCgpO1xuICAgICAgICBpZiAodGFyZ2V0Lm1hdGNoKC9GbGFnIFF1ZXN0aW9uLykpIHtcbiAgICAgICAgICAgICQoXG4gICAgICAgICAgICAgICAgXCJ1bCNwYWdlTnVtcyA+IHVsID4gbGk6ZXEoXCIgKyB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ICsgXCIpXCJcbiAgICAgICAgICAgICkuYWRkQ2xhc3MoXCJmbGFnY29sb3JcIik7IC8vIGNsYXNzIHdpbGwgY2hhbmdlIGNvbG9yIG9mIHF1ZXN0aW9uIGJsb2NrXG4gICAgICAgICAgICB0aGlzLmZsYWdCdXR0b24uaW5uZXJIVE1MID0gXCJVbmZsYWcgUXVlc3Rpb25cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoXG4gICAgICAgICAgICAgICAgXCJ1bCNwYWdlTnVtcyA+IHVsID4gbGk6ZXEoXCIgKyB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ICsgXCIpXCJcbiAgICAgICAgICAgICkucmVtb3ZlQ2xhc3MoXCJmbGFnY29sb3JcIik7IC8vIHdpbGwgcmVzdG9yZSBjdXJyZW50IGNvbG9yIG9mIHF1ZXN0aW9uIGJsb2NrXG4gICAgICAgICAgICB0aGlzLmZsYWdCdXR0b24uaW5uZXJIVE1MID0gXCJGbGFnIFF1ZXN0aW9uXCI7IC8vIGFsc28gc2V0cyBuYW1lIGJhY2tcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGhhbmRsZU51bWJlcmVkTmF2KGV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy50YWtlbikge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5uYXZpZ2F0ZUF3YXkoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucU51bUxpc3QuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChcbiAgICAgICAgICAgICAgICB2YXIgaiA9IDA7XG4gICAgICAgICAgICAgICAgaiA8IHRoaXMucU51bUxpc3QuY2hpbGROb2Rlc1tpXS5jaGlsZE5vZGVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBqKytcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICQodGhpcy5xTnVtTGlzdC5jaGlsZE5vZGVzW2ldLmNoaWxkTm9kZXNbal0pLnJlbW92ZUNsYXNzKFxuICAgICAgICAgICAgICAgICAgICBcImFjdGl2ZVwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCkudGV4dCgpO1xuICAgICAgICBsZXQgb2xkSW5kZXggPSB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4O1xuICAgICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ID0gcGFyc2VJbnQodGFyZ2V0KSAtIDE7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ID4gdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3I6IGJhZCBpbmRleCBmb3IgJHt0YXJnZXR9YCk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ID0gb2xkSW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgJChcbiAgICAgICAgICAgIFwidWwjcGFnZU51bXMgPiB1bCA+IGxpOmVxKFwiICsgdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCArIFwiKVwiXG4gICAgICAgICkuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICQoXG4gICAgICAgICAgICAgICAgXCJ1bCNwYWdlTnVtcyA+IHVsID4gbGk6ZXEoXCIgKyB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ICsgXCIpXCIgLy8gY2hlY2tpbmcgZm9yIGZsYWdjb2xvciBjbGFzc1xuICAgICAgICAgICAgKS5oYXNDbGFzcyhcImZsYWdjb2xvclwiKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuZmxhZ0J1dHRvbi5pbm5lckhUTUwgPSBcIlVuZmxhZyBRdWVzdGlvblwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mbGFnQnV0dG9uLmlubmVySFRNTCA9IFwiRmxhZyBRdWVzdGlvblwiO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHRoaXMucmVuZGVyVGltZWRRdWVzdGlvbigpO1xuICAgICAgICB0aGlzLmVuc3VyZUJ1dHRvblNhZmV0eSgpO1xuICAgIH1cblxuICAgIC8vIHNldCB1cCBldmVudHMgZm9yIG5hdmlnYXRpb25cbiAgICBuYXZCdG5MaXN0ZW5lcnMoKSB7XG4gICAgICAgIC8vIE5leHQgYW5kIFByZXYgTGlzdGVuZXJcbiAgICAgICAgdGhpcy5wYWdOYXZMaXN0LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICB0aGlzLmhhbmRsZU5leHRQcmV2LmJpbmQodGhpcyksXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIE51bWJlcmVkIExpc3RlbmVyXG4gICAgICAgIHRoaXMucU51bUxpc3QuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlTnVtYmVyZWROYXYuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gc2V0IHVwIGV2ZW50IGZvciBmbGFnXG4gICAgZmxhZ0J0bkxpc3RlbmVyKCkge1xuICAgICAgICB0aGlzLmZsYWdnaW5nUGxhY2UuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRmxhZy5iaW5kKHRoaXMpLCAvLyBjYWxscyB0aGlzIHRvIHRha2UgYWN0aW9uXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHJlbmRlclN1Ym1pdEJ1dHRvbigpIHtcbiAgICAgICAgdGhpcy5idXR0b25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAkKHRoaXMuYnV0dG9uQ29udGFpbmVyKS5hdHRyKHtcbiAgICAgICAgICAgIHN0eWxlOiBcInRleHQtYWxpZ246Y2VudGVyXCIsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmZpbmlzaEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICQodGhpcy5maW5pc2hCdXR0b24pLmF0dHIoe1xuICAgICAgICAgICAgaWQ6IFwiZmluaXNoXCIsXG4gICAgICAgICAgICBjbGFzczogXCJidG4gYnRuLXByaW1hcnlcIixcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZmluaXNoQnV0dG9uLnRleHRDb250ZW50ID0gXCJGaW5pc2ggRXhhbVwiO1xuICAgICAgICB0aGlzLmZpbmlzaEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmNvbmZpcm0oXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNsaWNraW5nIE9LIG1lYW5zIHlvdSBhcmUgcmVhZHkgdG8gc3VibWl0IHlvdXIgYW5zd2VycyBhbmQgYXJlIGZpbmlzaGVkIHdpdGggdGhpcyBhc3Nlc3NtZW50LlwiXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5maW5pc2hBc3Nlc3NtZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5mbGFnQnV0dG9uKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5jb250cm9sRGl2LmFwcGVuZENoaWxkKHRoaXMuZmluaXNoQnV0dG9uKTtcbiAgICAgICAgJCh0aGlzLmZpbmlzaEJ1dHRvbikuaGlkZSgpO1xuICAgICAgICB0aGlzLnRpbWVkRGl2LmFwcGVuZENoaWxkKHRoaXMuYnV0dG9uQ29udGFpbmVyKTtcbiAgICB9XG4gICAgZW5zdXJlQnV0dG9uU2FmZXR5KCkge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5Lmxlbmd0aCAhPSAxKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLnJpZ2h0Q29udGFpbmVyKS5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCh0aGlzLmxlZnRDb250YWluZXIpLmFkZENsYXNzKFwiZGlzYWJsZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCA+PVxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoIC0gMVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheS5sZW5ndGggIT0gMSkge1xuICAgICAgICAgICAgICAgICQodGhpcy5sZWZ0Q29udGFpbmVyKS5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCh0aGlzLnJpZ2h0Q29udGFpbmVyKS5hZGRDbGFzcyhcImRpc2FibGVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXggPiAwICYmXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4IDwgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoIC0gMVxuICAgICAgICApIHtcbiAgICAgICAgICAgICQodGhpcy5yaWdodENvbnRhaW5lcikucmVtb3ZlQ2xhc3MoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICQodGhpcy5sZWZ0Q29udGFpbmVyKS5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlckZlZWRiYWNrQ29udGFpbmVyKCkge1xuICAgICAgICB0aGlzLnNjb3JlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIlBcIik7XG4gICAgICAgIHRoaXMuc2NvcmVEaXYuaWQgPSB0aGlzLmRpdmlkICsgXCJyZXN1bHRzXCI7XG4gICAgICAgIHRoaXMuc2NvcmVEaXYuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnNjb3JlRGl2KTtcbiAgICB9XG5cbiAgICBjcmVhdGVSZW5kZXJlZFF1ZXN0aW9uQXJyYXkoKSB7XG4gICAgICAgIC8vIHRoaXMgZmluZHMgYWxsIHRoZSBhc3Nlc3MgcXVlc3Rpb25zIGluIHRoaXMgdGltZWQgYXNzZXNzbWVudFxuICAgICAgICAvLyBXZSBuZWVkIHRvIG1ha2UgYSBsaXN0IG9mIGFsbCB0aGUgcXVlc3Rpb25zIHVwIGZyb250IHNvIHdlIGNhbiBzZXQgdXAgbmF2aWdhdGlvblxuICAgICAgICAvLyBidXQgd2UgZG8gbm90IHdhbnQgdG8gcmVuZGVyIHRoZSBxdWVzdGlvbnMgdW50aWwgdGhlIHN0dWRlbnQgaGFzIG5hdmlnYXRlZFxuICAgICAgICAvLyBBbHNvIGFkZHMgdGhlbSB0byB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheVxuXG4gICAgICAgIC8vIHRvZG86ICBUaGlzIG5lZWRzIHRvIGJlIHVwZGF0ZWQgdG8gYWNjb3VudCBmb3IgdGhlIHJ1bmVzdG9uZSBkaXYgd3JhcHBlci5cblxuICAgICAgICAvLyBUbyBhY2NvbW1vZGF0ZSB0aGUgc2VsZWN0cXVlc3Rpb24gdHlwZSAtLSB3aGljaCBpcyBhc3luYyEgd2UgbmVlZCB0byB3cmFwXG4gICAgICAgIC8vIGFsbCBvZiB0aGlzIGluIGEgcHJvbWlzZSwgc28gdGhhdCB3ZSBkb24ndCBjb250aW51ZSB0byByZW5kZXIgdGhlIHRpbWVkXG4gICAgICAgIC8vIGV4YW0gdW50aWwgYWxsIG9mIHRoZSBxdWVzdGlvbnMgaGF2ZSBiZWVuIHJlYWxpemVkLlxuICAgICAgICB2YXIgb3B0cztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5ld0NoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdG1wQ2hpbGQgPSB0aGlzLm5ld0NoaWxkcmVuW2ldO1xuICAgICAgICAgICAgb3B0cyA9IHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogXCJwcmVwYXJlZFwiLFxuICAgICAgICAgICAgICAgIG9yaWc6IHRtcENoaWxkLFxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uOiB7fSxcbiAgICAgICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMsXG4gICAgICAgICAgICAgICAgdGltZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgYXNzZXNzbWVudFRha2VuOiB0aGlzLnRha2VuLFxuICAgICAgICAgICAgICAgIHRpbWVkV3JhcHBlcjogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgICAgICBpbml0QXR0ZW1wdHM6IDAsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKCQodG1wQ2hpbGQpLmNoaWxkcmVuKFwiW2RhdGEtY29tcG9uZW50XVwiKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdG1wQ2hpbGQgPSAkKHRtcENoaWxkKS5jaGlsZHJlbihcIltkYXRhLWNvbXBvbmVudF1cIilbMF07XG4gICAgICAgICAgICAgICAgb3B0cy5vcmlnID0gdG1wQ2hpbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJCh0bXBDaGlsZCkuaXMoXCJbZGF0YS1jb21wb25lbnRdXCIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkucHVzaChvcHRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJhbmRvbWl6ZVJRQSgpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5Lmxlbmd0aCxcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlLFxuICAgICAgICAgICAgcmFuZG9tSW5kZXg7XG4gICAgICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXG4gICAgICAgIHdoaWxlIChjdXJyZW50SW5kZXggIT09IDApIHtcbiAgICAgICAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xuICAgICAgICAgICAgY3VycmVudEluZGV4IC09IDE7XG4gICAgICAgICAgICAvLyBBbmQgc3dhcCBpdCB3aXRoIHRoZSBjdXJyZW50IGVsZW1lbnQuXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheVtjdXJyZW50SW5kZXhdID1cbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheVtyYW5kb21JbmRleF07XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIHJlbmRlclRpbWVkUXVlc3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ID49IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5Lmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gc29tZXRpbWVzIHRoZSB1c2VyIGNsaWNrcyBpbiB0aGUgZXZlbnQgYXJlYSBmb3IgdGhlIHFOdW1MaXN0XG4gICAgICAgICAgICAvLyBCdXQgbWlzc2VzIGEgbnVtYmVyIGluIHRoYXQgY2FzZSB0aGUgdGV4dCBpcyB0aGUgY29uY2F0ZW5hdGlvblxuICAgICAgICAgICAgLy8gb2YgYWxsIHRoZSBudW1iZXJzIGluIHRoZSBsaXN0IVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNoZWNrIHRoZSByZW5kZXJlZFF1ZXN0aW9uQXJyYXkgdG8gc2VlIGlmIGl0IGhhcyBiZWVuIHJlbmRlcmVkLlxuICAgICAgICBsZXQgb3B0cyA9IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W3RoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXhdO1xuICAgICAgICBsZXQgY3VycmVudFF1ZXN0aW9uO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBvcHRzLnN0YXRlID09PSBcInByZXBhcmVkXCIgfHxcbiAgICAgICAgICAgIG9wdHMuc3RhdGUgPT09IFwiZm9ycmV2aWV3XCIgfHxcbiAgICAgICAgICAgIChvcHRzLnN0YXRlID09PSBcImJyb2tlbl9leGFtXCIgJiYgb3B0cy5pbml0QXR0ZW1wdHMgPCAzKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGxldCB0bXBDaGlsZCA9IG9wdHMub3JpZztcbiAgICAgICAgICAgIGlmICgkKHRtcENoaWxkKS5pcyhcIltkYXRhLWNvbXBvbmVudD1zZWxlY3RxdWVzdGlvbl1cIikpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kb25lICYmIG9wdHMuc3RhdGUgPT0gXCJwcmVwYXJlZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleFxuICAgICAgICAgICAgICAgICAgICBdLnN0YXRlID0gXCJleGFtX2VuZGVkXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2VsZWN0T25lIGlzIGFzeW5jIGFuZCB3aWxsIHJlcGxhY2UgaXRzZWxmIGluIHRoaXMgYXJyYXkgd2l0aFxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgYWN0dWFsIHNlbGVjdGVkIHF1ZXN0aW9uXG4gICAgICAgICAgICAgICAgICAgIG9wdHMucnFhID0gdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdxID0gbmV3IFNlbGVjdE9uZShvcHRzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbjogbmV3cSxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IG5ld3EuaW5pdGlhbGl6ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuc3RhdGUgPT0gXCJicm9rZW5fZXhhbVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBicm9rZW4gY2xhc3MgZnJvbSB0aGlzIHF1ZXN0aW9uIGlmIHdlIGdldCBoZXJlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGB1bCNwYWdlTnVtcyA+IHVsID4gbGk6ZXEoJHt0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4fSlgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKS5yZW1vdmVDbGFzcyhcImJyb2tlblwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5zdGF0ZSA9IFwiYnJva2VuX2V4YW1cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W3RoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXhdID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYEVycm9yIGluaXRpYWxpemluZyBxdWVzdGlvbjogRGV0YWlscyAke2V9YFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJCh0bXBDaGlsZCkuaXMoXCJbZGF0YS1jb21wb25lbnRdXCIpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvbXBvbmVudEtpbmQgPSAkKHRtcENoaWxkKS5kYXRhKFwiY29tcG9uZW50XCIpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W3RoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXhdID0ge1xuICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbjogd2luZG93LmNvbXBvbmVudF9mYWN0b3J5W2NvbXBvbmVudEtpbmRdKG9wdHMpLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAob3B0cy5zdGF0ZSA9PT0gXCJicm9rZW5fZXhhbVwiKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50UXVlc3Rpb24gPVxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF0ucXVlc3Rpb247XG4gICAgICAgIGlmIChvcHRzLnN0YXRlID09PSBcImZvcnJldmlld1wiKSB7XG4gICAgICAgICAgICBhd2FpdCBjdXJyZW50UXVlc3Rpb24uY2hlY2tDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICBjdXJyZW50UXVlc3Rpb24ucmVuZGVyRmVlZGJhY2soKTtcbiAgICAgICAgICAgIGN1cnJlbnRRdWVzdGlvbi5kaXNhYmxlSW50ZXJhY3Rpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy52aXNpdGVkLmluY2x1ZGVzKHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXgpKSB7XG4gICAgICAgICAgICB0aGlzLnZpc2l0ZWQucHVzaCh0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4KTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLnZpc2l0ZWQubGVuZ3RoID09PSB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheS5sZW5ndGggJiZcbiAgICAgICAgICAgICAgICAhdGhpcy5kb25lXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMuZmluaXNoQnV0dG9uKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VycmVudFF1ZXN0aW9uLmNvbnRhaW5lckRpdikge1xuICAgICAgICAgICAgJCh0aGlzLnN3aXRjaERpdikucmVwbGFjZVdpdGgoY3VycmVudFF1ZXN0aW9uLmNvbnRhaW5lckRpdik7XG4gICAgICAgICAgICB0aGlzLnN3aXRjaERpdiA9IGN1cnJlbnRRdWVzdGlvbi5jb250YWluZXJEaXY7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGUgdGltZWQgY29tcG9uZW50IGhhcyBsaXN0ZW5lcnMsIHRob3NlIG1pZ2h0IG5lZWQgdG8gYmUgcmVpbml0aWFsaXplZFxuICAgICAgICAvLyBUaGlzIGZsYWcgd2lsbCBvbmx5IGJlIHNldCBpbiB0aGUgZWxlbWVudHMgdGhhdCBuZWVkIGl0LS1pdCB3aWxsIGJlIHVuZGVmaW5lZCBpbiB0aGUgb3RoZXJzIGFuZCB0aHVzIGV2YWx1YXRlIHRvIGZhbHNlXG4gICAgICAgIGlmIChjdXJyZW50UXVlc3Rpb24ubmVlZHNSZWluaXRpYWxpemF0aW9uKSB7XG4gICAgICAgICAgICBjdXJyZW50UXVlc3Rpb24ucmVpbml0aWFsaXplTGlzdGVuZXJzKHRoaXMudGFrZW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT0gVGltZXIgYW5kIGNvbnRyb2wgRnVuY3Rpb25zID09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgaGFuZGxlUHJldkFzc2Vzc21lbnQoKSB7XG4gICAgICAgICQodGhpcy5zdGFydEJ0bikuaGlkZSgpO1xuICAgICAgICAkKHRoaXMucGF1c2VCdG4pLmF0dHIoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgJCh0aGlzLmZpbmlzaEJ1dHRvbikuYXR0cihcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSAwO1xuICAgICAgICB0aGlzLmRvbmUgPSAxO1xuICAgICAgICAvLyBzaG93RmVlZGJhY2sgc2FuZCBzaG93UmVzdWx0cyBzaG91bGQgYm90aCBiZSB0cnVlIGJlZm9yZSB3ZSBzaG93IHRoZVxuICAgICAgICAvLyBxdWVzdGlvbnMgYW5kIHRoZWlyIHN0YXRlIG9mIGNvcnJlY3RuZXNzLlxuICAgICAgICBpZiAodGhpcy5zaG93UmVzdWx0cyAmJiB0aGlzLnNob3dGZWVkYmFjaykge1xuICAgICAgICAgICAgJCh0aGlzLnRpbWVkRGl2KS5zaG93KCk7XG4gICAgICAgICAgICB0aGlzLnJlc3RvcmVBbnN3ZXJlZFF1ZXN0aW9ucygpOyAvLyBkbyBub3QgbG9nIHRoZXNlIHJlc3VsdHNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQodGhpcy5wYXVzZUJ0bikuaGlkZSgpO1xuICAgICAgICAgICAgJCh0aGlzLnRpbWVyQ29udGFpbmVyKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhcnRBc3Nlc3NtZW50KCkge1xuICAgICAgICBpZiAoIXRoaXMudGFrZW4pIHtcbiAgICAgICAgICAgICQoXCIjcmVsYXRpb25zLW5leHRcIikuaGlkZSgpOyAvLyBoaWRlIHRoZSBuZXh0IHBhZ2UgYnV0dG9uIGZvciBub3dcbiAgICAgICAgICAgICQoXCIjcmVsYXRpb25zLXByZXZcIikuaGlkZSgpOyAvLyBoaWRlIHRoZSBwcmV2aW91cyBidXR0b24gZm9yIG5vd1xuICAgICAgICAgICAgJCh0aGlzLnN0YXJ0QnRuKS5oaWRlKCk7XG4gICAgICAgICAgICAkKHRoaXMucGF1c2VCdG4pLmF0dHIoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5ydW5uaW5nID09PSAwICYmIHRoaXMucGF1c2VkID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ydW5uaW5nID0gMTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgICAgICAkKHRoaXMudGltZWREaXYpLnNob3coKTtcbiAgICAgICAgICAgICAgICB0aGlzLmluY3JlbWVudCgpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IFwidGltZWRFeGFtXCIsXG4gICAgICAgICAgICAgICAgICAgIGFjdDogXCJzdGFydFwiLFxuICAgICAgICAgICAgICAgICAgICBkaXZfaWQ6IHRoaXMuZGl2aWQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHRpbWVTdGFtcCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgdmFyIHN0b3JhZ2VPYmogPSB7XG4gICAgICAgICAgICAgICAgICAgIGFuc3dlcjogWzAsIDAsIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5Lmxlbmd0aCwgMF0sXG4gICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogdGltZVN0YW1wLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlS2V5KCksXG4gICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHN0b3JhZ2VPYmopXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQod2luZG93KS5vbihcbiAgICAgICAgICAgICAgICBcImJlZm9yZXVubG9hZFwiLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIGFjdHVhbCB2YWx1ZSBnZXRzIGlnbm9yZWQgYnkgbmV3ZXIgYnJvd3NlcnNcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnJldHVyblZhbHVlID1cbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGxlYXZlPyAgWW91ciB3b3JrIHdpbGwgYmUgbG9zdCEgQW5kIHlvdSB3aWxsIG5lZWQgeW91ciBpbnN0cnVjdG9yIHRvIHJlc2V0IHRoZSBleGFtIVwiO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gbGVhdmU/ICBZb3VyIHdvcmsgd2lsbCBiZSBsb3N0IVwiO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgIFwicGFnZWhpZGVcIixcbiAgICAgICAgICAgICAgICBhc3luYyBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZmluaXNoQXNzZXNzbWVudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFeGFtIGV4aXRlZCBieSBsZWF2aW5nIHBhZ2VcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVByZXZBc3Nlc3NtZW50KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcGF1c2VBc3Nlc3NtZW50KCkge1xuICAgICAgICBpZiAodGhpcy5kb25lID09PSAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ydW5uaW5nID09PSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgICAgICAgICBldmVudDogXCJ0aW1lZEV4YW1cIixcbiAgICAgICAgICAgICAgICAgICAgYWN0OiBcInBhdXNlXCIsXG4gICAgICAgICAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLnJ1bm5pbmcgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMucGF1c2VkID0gMTtcbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlQnRuLmlubmVySFRNTCA9IFwiUmVzdW1lXCI7XG4gICAgICAgICAgICAgICAgJCh0aGlzLnRpbWVkRGl2KS5oaWRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IFwidGltZWRFeGFtXCIsXG4gICAgICAgICAgICAgICAgICAgIGFjdDogXCJyZXN1bWVcIixcbiAgICAgICAgICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMucnVubmluZyA9IDE7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXVzZWQgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5jcmVtZW50KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXVzZUJ0bi5pbm5lckhUTUwgPSBcIlBhdXNlXCI7XG4gICAgICAgICAgICAgICAgJCh0aGlzLnRpbWVkRGl2KS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93VGltZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hvd1RpbWVyKSB7XG4gICAgICAgICAgICB2YXIgbWlucyA9IE1hdGguZmxvb3IodGhpcy50aW1lTGltaXQgLyA2MCk7XG4gICAgICAgICAgICB2YXIgc2VjcyA9IE1hdGguZmxvb3IodGhpcy50aW1lTGltaXQpICUgNjA7XG4gICAgICAgICAgICB2YXIgbWluc1N0cmluZyA9IG1pbnM7XG4gICAgICAgICAgICB2YXIgc2Vjc1N0cmluZyA9IHNlY3M7XG4gICAgICAgICAgICBpZiAobWlucyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgbWluc1N0cmluZyA9IFwiMFwiICsgbWlucztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWNzIDwgMTApIHtcbiAgICAgICAgICAgICAgICBzZWNzU3RyaW5nID0gXCIwXCIgKyBzZWNzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGJlZ2lubmluZyA9IFwiVGltZSBSZW1haW5pbmcgICAgXCI7XG4gICAgICAgICAgICBpZiAoIXRoaXMubGltaXRlZFRpbWUpIHtcbiAgICAgICAgICAgICAgICBiZWdpbm5pbmcgPSBcIlRpbWUgVGFrZW4gICAgXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdGltZVN0cmluZyA9IGJlZ2lubmluZyArIG1pbnNTdHJpbmcgKyBcIjpcIiArIHNlY3NTdHJpbmc7XG4gICAgICAgICAgICBpZiAodGhpcy5kb25lIHx8IHRoaXMudGFrZW4pIHtcbiAgICAgICAgICAgICAgICB2YXIgbWludXRlcyA9IE1hdGguZmxvb3IodGhpcy50aW1lVGFrZW4gLyA2MCk7XG4gICAgICAgICAgICAgICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKHRoaXMudGltZVRha2VuICUgNjApO1xuICAgICAgICAgICAgICAgIGlmIChtaW51dGVzIDwgMTApIHtcbiAgICAgICAgICAgICAgICAgICAgbWludXRlcyA9IFwiMFwiICsgbWludXRlcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNlY29uZHMgPCAxMCkge1xuICAgICAgICAgICAgICAgICAgICBzZWNvbmRzID0gXCIwXCIgKyBzZWNvbmRzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aW1lU3RyaW5nID0gXCJUaW1lIHRha2VuOiBcIiArIG1pbnV0ZXMgKyBcIjpcIiArIHNlY29uZHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnRpbWVyQ29udGFpbmVyLmlubmVySFRNTCA9IHRpbWVTdHJpbmc7XG4gICAgICAgICAgICB2YXIgdGltZVRpcHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidGltZVRpcFwiKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IHRpbWVUaXBzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIHRpbWVUaXBzW2ldLnRpdGxlID0gdGltZVN0cmluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQodGhpcy50aW1lckNvbnRhaW5lcikuaGlkZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5jcmVtZW50KCkge1xuICAgICAgICAvLyBpZiBydW5uaW5nIChub3QgcGF1c2VkKSBhbmQgbm90IHRha2VuXG4gICAgICAgIGlmICh0aGlzLnJ1bm5pbmcgPT09IDEgJiYgIXRoaXMudGFrZW4pIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXaGVuIGEgYnJvd3NlciBsb3NlcyBmb2N1cywgc2V0VGltZW91dCBtYXkgbm90IGJlIGNhbGxlZCBvbiB0aGVcbiAgICAgICAgICAgICAgICAgICAgLy8gc2NoZWR1bGUgZXhwZWN0ZWQuICBCcm93c2VycyBhcmUgZnJlZSB0byBzYXZlIHBvd2VyIGJ5IGxlbmd0aGVuaW5nXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBpbnRlcnZhbCB0byBzb21lIGxvbmdlciB0aW1lLiAgU28gd2UgY2Fubm90IGp1c3Qgc3VidHJhY3QgMVxuICAgICAgICAgICAgICAgICAgICAvLyBmcm9tIHRoZSB0aW1lTGltaXQgd2UgbmVlZCB0byBtZWFzdXJlIHRoZSBlbGFwc2VkIHRpbWUgZnJvbSB0aGUgbGFzdFxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxsIHRvIHRoZSBjdXJyZW50IGNhbGwgYW5kIHN1YnRyYWN0IHRoYXQgbnVtYmVyIG9mIHNlY29uZHMuXG4gICAgICAgICAgICAgICAgICAgIGxldCBjdXJyZW50VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmxpbWl0ZWRUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSdzIGEgdGltZSBsaW1pdCwgY291bnQgZG93biB0byAwXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVMaW1pdCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lTGltaXQgLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoKGN1cnJlbnRUaW1lIC0gdGhpcy5sYXN0VGltZSkgLyAxMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVsc2UgY291bnQgdXAgdG8ga2VlcCB0cmFjayBvZiBob3cgbG9uZyBpdCB0b29rIHRvIGNvbXBsZXRlXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVMaW1pdCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lTGltaXQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoKGN1cnJlbnRUaW1lIC0gdGhpcy5sYXN0VGltZSkgLyAxMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RUaW1lID0gY3VycmVudFRpbWU7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgICAgICAgICAgICAgICAgICAgZUJvb2tDb25maWcuZW1haWwgKyBcIjpcIiArIHRoaXMuZGl2aWQgKyBcIi10aW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVMaW1pdFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dUaW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRpbWVMaW1pdCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5jcmVtZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByYW4gb3V0IG9mIHRpbWVcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcy5zdGFydEJ0bikuYXR0cih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMuZmluaXNoQnV0dG9uKS5hdHRyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZDogXCJ0cnVlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucnVubmluZyA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRvbmUgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRha2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YWtlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZW1iZWQgdGhlIG1lc3NhZ2UgaW4gdGhlIHBhZ2UgLS0gYW4gYWxlcnQgYWN0dWFsbHkgcHJldmVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgYW5zd2VycyBmcm9tIGJlaW5nIHN1Ym1pdHRlZCBhbmQgaWYgYSBzdHVkZW50IGNsb3NlcyB0aGVpclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxhcHRvcCB0aGVuIHRoZSBhbnN3ZXJzIHdpbGwgbm90IGJlIHN1Ym1pdHRlZCBldmVyISAgRXZlbiB3aGVuIHRoZXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZW9wZW4gdGhlIGxhcHRvcCB0aGVpciBzZXNzaW9uIGNvb2tpZSBpcyBsaWtlbHkgaW52YWxpZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbWVzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzLmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiU29ycnkgYnV0IHlvdSByYW4gb3V0IG9mIHRpbWUuIFlvdXIgYW5zd2VycyBhcmUgYmVpbmcgc3VibWl0dGVkXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250cm9sRGl2LmFwcGVuZENoaWxkKG1lc3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmluaXNoQXNzZXNzbWVudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgIDEwMDBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdHlsZUV4YW1FbGVtZW50cygpIHtcbiAgICAgICAgLy8gQ2hlY2tzIGlmIHRoaXMgZXhhbSBoYXMgYmVlbiB0YWtlbiBiZWZvcmVcbiAgICAgICAgJCh0aGlzLnRpbWVyQ29udGFpbmVyKS5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6IFwiNTAlXCIsXG4gICAgICAgICAgICBtYXJnaW46IFwiMCBhdXRvXCIsXG4gICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogXCIjREZGMEQ4XCIsXG4gICAgICAgICAgICBcInRleHQtYWxpZ25cIjogXCJjZW50ZXJcIixcbiAgICAgICAgICAgIGJvcmRlcjogXCIycHggc29saWQgI0RGRjBEOFwiLFxuICAgICAgICAgICAgXCJib3JkZXItcmFkaXVzXCI6IFwiMjVweFwiLFxuICAgICAgICB9KTtcbiAgICAgICAgJCh0aGlzLnNjb3JlRGl2KS5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6IFwiNTAlXCIsXG4gICAgICAgICAgICBtYXJnaW46IFwiMCBhdXRvXCIsXG4gICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogXCIjREZGMEQ4XCIsXG4gICAgICAgICAgICBcInRleHQtYWxpZ25cIjogXCJjZW50ZXJcIixcbiAgICAgICAgICAgIGJvcmRlcjogXCIycHggc29saWQgI0RGRjBEOFwiLFxuICAgICAgICAgICAgXCJib3JkZXItcmFkaXVzXCI6IFwiMjVweFwiLFxuICAgICAgICB9KTtcbiAgICAgICAgJChcIi50b29sdGlwVGltZVwiKS5jc3Moe1xuICAgICAgICAgICAgbWFyZ2luOiBcIjBcIixcbiAgICAgICAgICAgIHBhZGRpbmc6IFwiMFwiLFxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiYmxhY2tcIixcbiAgICAgICAgICAgIGNvbG9yOiBcIndoaXRlXCIsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGZpbmlzaEFzc2Vzc21lbnQoKSB7XG4gICAgICAgICQoXCIjcmVsYXRpb25zLW5leHRcIikuc2hvdygpOyAvLyBzaG93IHRoZSBuZXh0IHBhZ2UgYnV0dG9uIGZvciBub3dcbiAgICAgICAgJChcIiNyZWxhdGlvbnMtcHJldlwiKS5zaG93KCk7IC8vIHNob3cgdGhlIHByZXZpb3VzIGJ1dHRvbiBmb3Igbm93XG4gICAgICAgIGlmICghdGhpcy5zaG93RmVlZGJhY2spIHtcbiAgICAgICAgICAgIC8vIGJqZSAtIGNoYW5nZWQgZnJvbSBzaG93UmVzdWx0c1xuICAgICAgICAgICAgJCh0aGlzLnRpbWVkRGl2KS5oaWRlKCk7XG4gICAgICAgICAgICAkKHRoaXMucGF1c2VCdG4pLmhpZGUoKTtcbiAgICAgICAgICAgICQodGhpcy50aW1lckNvbnRhaW5lcikuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmluZFRpbWVUYWtlbigpO1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSAwO1xuICAgICAgICB0aGlzLmRvbmUgPSAxO1xuICAgICAgICB0aGlzLnRha2VuID0gMTtcbiAgICAgICAgYXdhaXQgdGhpcy5maW5hbGl6ZVByb2JsZW1zKCk7XG4gICAgICAgIHRoaXMuY2hlY2tTY29yZSgpO1xuICAgICAgICB0aGlzLmRpc3BsYXlTY29yZSgpO1xuICAgICAgICB0aGlzLnN0b3JlU2NvcmUoKTtcbiAgICAgICAgdGhpcy5sb2dTY29yZSgpO1xuICAgICAgICAkKHRoaXMucGF1c2VCdG4pLmF0dHIoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgdGhpcy5maW5pc2hCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAkKHdpbmRvdykub2ZmKFwiYmVmb3JldW5sb2FkXCIpO1xuICAgICAgICAvLyB0dXJuIG9mZiB0aGUgcGFnZWhpZGUgbGlzdGVuZXJcbiAgICAgICAgbGV0IGFzc2lnbm1lbnRfaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IGVCb29rQ29uZmlnLmFwcCArIFwiL2Fzc2lnbm1lbnRzL3N0dWRlbnRfYXV0b2dyYWRlXCIsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwiSlNPTlwiLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudF9pZDogYXNzaWdubWVudF9pZCxcbiAgICAgICAgICAgICAgICAgICAgaXNfdGltZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmV0ZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmV0ZGF0YS5zdWNjZXNzID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXRkYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBdXRvZ3JhZGVyIGNvbXBsZXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgMjAwMCk7XG4gICAgfVxuXG4gICAgLy8gZmluYWxpemVQcm9ibGVtc1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS1cbiAgICBhc3luYyBmaW5hbGl6ZVByb2JsZW1zKCkge1xuICAgICAgICAvLyBCZWNhdXNlIHdlIGhhdmUgc3VibWl0dGVkIGVhY2ggcXVlc3Rpb24gYXMgd2UgbmF2aWdhdGUgd2Ugb25seSBuZWVkIHRvXG4gICAgICAgIC8vIHNlbmQgdGhlIGZpbmFsIHZlcnNpb24gb2YgdGhlIHF1ZXN0aW9uIHRoZSBzdHVkZW50IGlzIG9uIHdoZW4gdGhleSBwcmVzcyB0aGVcbiAgICAgICAgLy8gZmluaXNoIGV4YW0gYnV0dG9uLlxuXG4gICAgICAgIHZhciBjdXJyZW50UXVlc3Rpb24gPVxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF0ucXVlc3Rpb247XG4gICAgICAgIGF3YWl0IGN1cnJlbnRRdWVzdGlvbi5jaGVja0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgYXdhaXQgY3VycmVudFF1ZXN0aW9uLmxvZ0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgY3VycmVudFF1ZXN0aW9uLnJlbmRlckZlZWRiYWNrKCk7XG4gICAgICAgIGN1cnJlbnRRdWVzdGlvbi5kaXNhYmxlSW50ZXJhY3Rpb24oKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudFF1ZXN0aW9uID0gdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbaV07XG4gICAgICAgICAgICAvLyBzZXQgdGhlIHN0YXRlIHRvIGZvcnJldmlldyBzbyB3ZSBrbm93IHRoYXQgZmVlZGJhY2sgbWF5IGJlIGFwcHJvcHJpYXRlXG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXN0aW9uLnN0YXRlICE9PSBcImJyb2tlbl9leGFtXCIpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVlc3Rpb24uc3RhdGUgPSBcImZvcnJldmlld1wiO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWVzdGlvbi5xdWVzdGlvbi5kaXNhYmxlSW50ZXJhY3Rpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5zaG93RmVlZGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZVRpbWVkRmVlZGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlc3RvcmVBbnN3ZXJlZFF1ZXN0aW9uc1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHJlc3RvcmVBbnN3ZXJlZFF1ZXN0aW9ucygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRRdWVzdGlvbiA9IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W2ldO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWVzdGlvbi5zdGF0ZSA9PT0gXCJwcmVwYXJlZFwiKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXN0aW9uLnN0YXRlID0gXCJmb3JyZXZpZXdcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGhpZGVUaW1lZEZlZWRiYWNrXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBoaWRlVGltZWRGZWVkYmFjaygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRRdWVzdGlvbiA9IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W2ldLnF1ZXN0aW9uO1xuICAgICAgICAgICAgY3VycmVudFF1ZXN0aW9uLmhpZGVGZWVkYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gY2hlY2tTY29yZVxuICAgIC8vIC0tLS0tLS0tLS1cbiAgICAvLyBUaGlzIGlzIGEgc2ltcGxlIGFsbCBvciBub3RoaW5nIHNjb3JlIG9mIG9uZSBwb2ludCBwZXIgcXVlc3Rpb24gZm9yXG4gICAgLy8gdGhhdCBpbmNsdWRlcyBvdXIgYmVzdCBndWVzcyBpZiBhIHF1ZXN0aW9uIHdhcyBza2lwcGVkLlxuICAgIGNoZWNrU2NvcmUoKSB7XG4gICAgICAgIHRoaXMuY29ycmVjdFN0ciA9IFwiXCI7XG4gICAgICAgIHRoaXMuc2tpcHBlZFN0ciA9IFwiXCI7XG4gICAgICAgIHRoaXMuaW5jb3JyZWN0U3RyID0gXCJcIjtcbiAgICAgICAgLy8gR2V0cyB0aGUgc2NvcmUgb2YgZWFjaCBwcm9ibGVtXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjb3JyZWN0ID1cbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheVtpXS5xdWVzdGlvbi5jaGVja0NvcnJlY3RUaW1lZCgpO1xuICAgICAgICAgICAgaWYgKGNvcnJlY3QgPT0gXCJUXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3JlKys7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0U3RyID0gdGhpcy5jb3JyZWN0U3RyICsgKGkgKyAxKSArIFwiLCBcIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29ycmVjdCA9PSBcIkZcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0Kys7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmNvcnJlY3RTdHIgPSB0aGlzLmluY29ycmVjdFN0ciArIChpICsgMSkgKyBcIiwgXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvcnJlY3QgPT09IG51bGwgfHwgY29ycmVjdCA9PT0gXCJJXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNraXBwZWQrKztcbiAgICAgICAgICAgICAgICB0aGlzLnNraXBwZWRTdHIgPSB0aGlzLnNraXBwZWRTdHIgKyAoaSArIDEpICsgXCIsIFwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBpZ25vcmVkIHF1ZXN0aW9uOyBqdXN0IGRvIG5vdGhpbmdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyByZW1vdmUgZXh0cmEgY29tbWEgYW5kIHNwYWNlIGF0IGVuZCBpZiBhbnlcbiAgICAgICAgaWYgKHRoaXMuY29ycmVjdFN0ci5sZW5ndGggPiAwKVxuICAgICAgICAgICAgdGhpcy5jb3JyZWN0U3RyID0gdGhpcy5jb3JyZWN0U3RyLnN1YnN0cmluZyhcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdFN0ci5sZW5ndGggLSAyXG4gICAgICAgICAgICApO1xuICAgICAgICBlbHNlIHRoaXMuY29ycmVjdFN0ciA9IFwiTm9uZVwiO1xuICAgICAgICBpZiAodGhpcy5za2lwcGVkU3RyLmxlbmd0aCA+IDApXG4gICAgICAgICAgICB0aGlzLnNraXBwZWRTdHIgPSB0aGlzLnNraXBwZWRTdHIuc3Vic3RyaW5nKFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgdGhpcy5za2lwcGVkU3RyLmxlbmd0aCAtIDJcbiAgICAgICAgICAgICk7XG4gICAgICAgIGVsc2UgdGhpcy5za2lwcGVkU3RyID0gXCJOb25lXCI7XG4gICAgICAgIGlmICh0aGlzLmluY29ycmVjdFN0ci5sZW5ndGggPiAwKVxuICAgICAgICAgICAgdGhpcy5pbmNvcnJlY3RTdHIgPSB0aGlzLmluY29ycmVjdFN0ci5zdWJzdHJpbmcoXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICB0aGlzLmluY29ycmVjdFN0ci5sZW5ndGggLSAyXG4gICAgICAgICAgICApO1xuICAgICAgICBlbHNlIHRoaXMuaW5jb3JyZWN0U3RyID0gXCJOb25lXCI7XG4gICAgfVxuICAgIGZpbmRUaW1lVGFrZW4oKSB7XG4gICAgICAgIGlmICh0aGlzLmxpbWl0ZWRUaW1lKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVUYWtlbiA9IHRoaXMuc3RhcnRpbmdUaW1lIC0gdGhpcy50aW1lTGltaXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVUYWtlbiA9IHRoaXMudGltZUxpbWl0O1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0b3JlU2NvcmUoKSB7XG4gICAgICAgIHZhciBzdG9yYWdlX2FyciA9IFtdO1xuICAgICAgICBzdG9yYWdlX2Fyci5wdXNoKFxuICAgICAgICAgICAgdGhpcy5zY29yZSxcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdFN0cixcbiAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0LFxuICAgICAgICAgICAgdGhpcy5pbmNvcnJlY3RTdHIsXG4gICAgICAgICAgICB0aGlzLnNraXBwZWQsXG4gICAgICAgICAgICB0aGlzLnNraXBwZWRTdHIsXG4gICAgICAgICAgICB0aGlzLnRpbWVUYWtlblxuICAgICAgICApO1xuICAgICAgICB2YXIgdGltZVN0YW1wID0gbmV3IERhdGUoKTtcbiAgICAgICAgdmFyIHN0b3JhZ2VPYmogPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBhbnN3ZXI6IHN0b3JhZ2VfYXJyLFxuICAgICAgICAgICAgdGltZXN0YW1wOiB0aW1lU3RhbXAsXG4gICAgICAgIH0pO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpLCBzdG9yYWdlT2JqKTtcbiAgICB9XG4gICAgLy8gX2B0aW1lZCBleGFtIGVuZHBvaW50IHBhcmFtZXRlcnNgXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgbG9nU2NvcmUoKSB7XG4gICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgIGV2ZW50OiBcInRpbWVkRXhhbVwiLFxuICAgICAgICAgICAgYWN0OiBcImZpbmlzaFwiLFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgY29ycmVjdDogdGhpcy5zY29yZSxcbiAgICAgICAgICAgIGluY29ycmVjdDogdGhpcy5pbmNvcnJlY3QsXG4gICAgICAgICAgICBza2lwcGVkOiB0aGlzLnNraXBwZWQsXG4gICAgICAgICAgICB0aW1lX3Rha2VuOiB0aGlzLnRpbWVUYWtlbixcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNob3VsZFVzZVNlcnZlcihkYXRhKSB7XG4gICAgICAgIC8vIFdlIG92ZXJyaWRlIHRoZSBSdW5lc3RvbmVCYXNlIHZlcnNpb24gYmVjYXVzZSB0aGVyZSBpcyBubyBcImNvcnJlY3RcIiBhdHRyaWJ1dGUsIGFuZCB0aGVyZSBhcmUgMiBwb3NzaWJsZSBsb2NhbFN0b3JhZ2Ugc2NoZW1hc1xuICAgICAgICAvLyAtLXdlIGFsc28gd2FudCB0byBkZWZhdWx0IHRvIGxvY2FsIHN0b3JhZ2UgYmVjYXVzZSBpdCBjb250YWlucyBtb3JlIGluZm9ybWF0aW9uIHNwZWNpZmljYWxseSB3aGljaCBxdWVzdGlvbnMgYXJlIGNvcnJlY3QsIGluY29ycmVjdCwgYW5kIHNraXBwZWQuXG4gICAgICAgIHZhciBzdG9yYWdlRGF0ZTtcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5sZW5ndGggPT09IDApIHJldHVybiB0cnVlO1xuICAgICAgICB2YXIgc3RvcmFnZU9iaiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICBpZiAoc3RvcmFnZU9iaiA9PT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgc3RvcmVkRGF0YSA9IEpTT04ucGFyc2Uoc3RvcmFnZU9iaikuYW5zd2VyO1xuICAgICAgICAgICAgaWYgKHN0b3JlZERhdGEubGVuZ3RoID09IDQpIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuY29ycmVjdCA9PSBzdG9yZWREYXRhWzBdICYmXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuaW5jb3JyZWN0ID09IHN0b3JlZERhdGFbMV0gJiZcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5za2lwcGVkID09IHN0b3JlZERhdGFbMl0gJiZcbiAgICAgICAgICAgICAgICAgICAgZGF0YS50aW1lVGFrZW4gPT0gc3RvcmVkRGF0YVszXVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0b3JlZERhdGEubGVuZ3RoID09IDcpIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuY29ycmVjdCA9PSBzdG9yZWREYXRhWzBdICYmXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuaW5jb3JyZWN0ID09IHN0b3JlZERhdGFbMl0gJiZcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5za2lwcGVkID09IHN0b3JlZERhdGFbNF0gJiZcbiAgICAgICAgICAgICAgICAgICAgZGF0YS50aW1lVGFrZW4gPT0gc3RvcmVkRGF0YVs2XVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vIEluIHRoaXMgY2FzZSwgYmVjYXVzZSBsb2NhbCBzdG9yYWdlIGhhcyBtb3JlIGluZm8sIHdlIHdhbnQgdG8gdXNlIHRoYXQgaWYgaXQncyBjb25zaXN0ZW50XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RvcmFnZURhdGUgPSBuZXcgRGF0ZShKU09OLnBhcnNlKHN0b3JhZ2VPYmpbMV0pLnRpbWVzdGFtcCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgLy8gZXJyb3Igd2hpbGUgcGFyc2luZzsgbGlrZWx5IGR1ZSB0byBiYWQgdmFsdWUgc3RvcmVkIGluIHN0b3JhZ2VcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNlcnZlckRhdGUgPSBuZXcgRGF0ZShkYXRhLnRpbWVzdGFtcCk7XG4gICAgICAgIGlmIChzZXJ2ZXJEYXRlIDwgc3RvcmFnZURhdGUpIHtcbiAgICAgICAgICAgIHRoaXMubG9nU2NvcmUoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjaGVja0xvY2FsU3RvcmFnZSgpIHtcbiAgICAgICAgdmFyIGxlbiA9IGxvY2FsU3RvcmFnZS5sZW5ndGg7XG4gICAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRha2VuID0gMTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RvcmVBbnN3ZXJzKFwiXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRha2VuID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGFrZW4gPSAwO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIHJlc3RvcmVBbnN3ZXJzKGRhdGEpIHtcbiAgICAgICAgdGhpcy50YWtlbiA9IDE7XG4gICAgICAgIHZhciB0bXBBcnI7XG4gICAgICAgIGlmIChkYXRhID09PSBcIlwiKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRtcEFyciA9IEpTT04ucGFyc2UoXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpXG4gICAgICAgICAgICAgICAgKS5hbnN3ZXI7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAvLyBlcnJvciB3aGlsZSBwYXJzaW5nOyBsaWtlbHkgZHVlIHRvIGJhZCB2YWx1ZSBzdG9yZWQgaW4gc3RvcmFnZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRha2VuID0gMDtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBQYXJzZSByZXN1bHRzIGZyb20gdGhlIGRhdGFiYXNlXG4gICAgICAgICAgICB0bXBBcnIgPSBbXG4gICAgICAgICAgICAgICAgcGFyc2VJbnQoZGF0YS5jb3JyZWN0KSxcbiAgICAgICAgICAgICAgICBwYXJzZUludChkYXRhLmluY29ycmVjdCksXG4gICAgICAgICAgICAgICAgcGFyc2VJbnQoZGF0YS5za2lwcGVkKSxcbiAgICAgICAgICAgICAgICBwYXJzZUludChkYXRhLnRpbWVUYWtlbiksXG4gICAgICAgICAgICAgICAgZGF0YS5yZXNldCxcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSh0bXBBcnIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0bXBBcnIubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIC8vIEV4YW0gd2FzIHByZXZpb3VzbHkgcmVzZXRcbiAgICAgICAgICAgIHRoaXMucmVzZXQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy50YWtlbiA9IDA7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRtcEFyci5sZW5ndGggPT0gNCkge1xuICAgICAgICAgICAgLy8gQWNjaWRlbnRhbCBSZWxvYWQgT1IgRGF0YWJhc2UgRW50cnlcbiAgICAgICAgICAgIHRoaXMuc2NvcmUgPSB0bXBBcnJbMF07XG4gICAgICAgICAgICB0aGlzLmluY29ycmVjdCA9IHRtcEFyclsxXTtcbiAgICAgICAgICAgIHRoaXMuc2tpcHBlZCA9IHRtcEFyclsyXTtcbiAgICAgICAgICAgIHRoaXMudGltZVRha2VuID0gdG1wQXJyWzNdO1xuICAgICAgICB9IGVsc2UgaWYgKHRtcEFyci5sZW5ndGggPT0gNykge1xuICAgICAgICAgICAgLy8gTG9hZGVkIENvbXBsZXRlZCBFeGFtXG4gICAgICAgICAgICB0aGlzLnNjb3JlID0gdG1wQXJyWzBdO1xuICAgICAgICAgICAgdGhpcy5jb3JyZWN0U3RyID0gdG1wQXJyWzFdO1xuICAgICAgICAgICAgdGhpcy5pbmNvcnJlY3QgPSB0bXBBcnJbMl07XG4gICAgICAgICAgICB0aGlzLmluY29ycmVjdFN0ciA9IHRtcEFyclszXTtcbiAgICAgICAgICAgIHRoaXMuc2tpcHBlZCA9IHRtcEFycls0XTtcbiAgICAgICAgICAgIHRoaXMuc2tpcHBlZFN0ciA9IHRtcEFycls1XTtcbiAgICAgICAgICAgIHRoaXMudGltZVRha2VuID0gdG1wQXJyWzZdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gU2V0IGxvY2FsU3RvcmFnZSBpbiBjYXNlIG9mIFwiYWNjaWRlbnRhbFwiIHJlbG9hZFxuICAgICAgICAgICAgdGhpcy5zY29yZSA9IDA7XG4gICAgICAgICAgICB0aGlzLmluY29ycmVjdCA9IDA7XG4gICAgICAgICAgICB0aGlzLnNraXBwZWQgPSB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheS5sZW5ndGg7XG4gICAgICAgICAgICB0aGlzLnRpbWVUYWtlbiA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudGFrZW4pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNraXBwZWQgPT09IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0ZlZWRiYWNrID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVByZXZBc3Nlc3NtZW50KCk7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgdGhpcy5yZW5kZXJUaW1lZFF1ZXN0aW9uKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheVNjb3JlKCk7XG4gICAgICAgIHRoaXMuc2hvd1RpbWUoKTtcbiAgICB9XG4gICAgc2V0TG9jYWxTdG9yYWdlKHBhcnNlZERhdGEpIHtcbiAgICAgICAgdmFyIHRpbWVTdGFtcCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHZhciBzdG9yYWdlT2JqID0ge1xuICAgICAgICAgICAgYW5zd2VyOiBwYXJzZWREYXRhLFxuICAgICAgICAgICAgdGltZXN0YW1wOiB0aW1lU3RhbXAsXG4gICAgICAgIH07XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSxcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHN0b3JhZ2VPYmopXG4gICAgICAgICk7XG4gICAgfVxuICAgIGRpc3BsYXlTY29yZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hvd1Jlc3VsdHMpIHtcbiAgICAgICAgICAgIHZhciBzY29yZVN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgbnVtUXVlc3Rpb25zO1xuICAgICAgICAgICAgdmFyIHBlcmNlbnRDb3JyZWN0O1xuICAgICAgICAgICAgLy8gaWYgd2UgaGF2ZSBzb21lIGluZm9ybWF0aW9uXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0U3RyLmxlbmd0aCA+IDAgfHxcbiAgICAgICAgICAgICAgICB0aGlzLmluY29ycmVjdFN0ci5sZW5ndGggPiAwIHx8XG4gICAgICAgICAgICAgICAgdGhpcy5za2lwcGVkU3RyLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHNjb3JlU3RyaW5nID0gYE51bSBDb3JyZWN0OiAke3RoaXMuc2NvcmV9LiBRdWVzdGlvbnM6ICR7dGhpcy5jb3JyZWN0U3RyfTxicj5OdW0gV3Jvbmc6ICR7dGhpcy5pbmNvcnJlY3R9LiBRdWVzdGlvbnM6ICR7dGhpcy5pbmNvcnJlY3RTdHJ9PGJyPk51bSBTa2lwcGVkOiAke3RoaXMuc2tpcHBlZH0uIFF1ZXN0aW9uczogJHt0aGlzLnNraXBwZWRTdHJ9PGJyPmA7XG4gICAgICAgICAgICAgICAgbnVtUXVlc3Rpb25zID0gdGhpcy5zY29yZSArIHRoaXMuaW5jb3JyZWN0ICsgdGhpcy5za2lwcGVkO1xuICAgICAgICAgICAgICAgIHBlcmNlbnRDb3JyZWN0ID0gKHRoaXMuc2NvcmUgLyBudW1RdWVzdGlvbnMpICogMTAwO1xuICAgICAgICAgICAgICAgIHNjb3JlU3RyaW5nICs9IFwiUGVyY2VudCBDb3JyZWN0OiBcIiArIHBlcmNlbnRDb3JyZWN0ICsgXCIlXCI7XG4gICAgICAgICAgICAgICAgJCh0aGlzLnNjb3JlRGl2KS5odG1sKHNjb3JlU3RyaW5nKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3JlRGl2LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNjb3JlU3RyaW5nID0gYE51bSBDb3JyZWN0OiAke3RoaXMuc2NvcmV9PGJyPk51bSBXcm9uZzogJHt0aGlzLmluY29ycmVjdH08YnI+TnVtIFNraXBwZWQ6ICR7dGhpcy5za2lwcGVkfTxicj5gO1xuICAgICAgICAgICAgICAgIG51bVF1ZXN0aW9ucyA9IHRoaXMuc2NvcmUgKyB0aGlzLmluY29ycmVjdCArIHRoaXMuc2tpcHBlZDtcbiAgICAgICAgICAgICAgICBwZXJjZW50Q29ycmVjdCA9ICh0aGlzLnNjb3JlIC8gbnVtUXVlc3Rpb25zKSAqIDEwMDtcbiAgICAgICAgICAgICAgICBzY29yZVN0cmluZyArPSBcIlBlcmNlbnQgQ29ycmVjdDogXCIgKyBwZXJjZW50Q29ycmVjdCArIFwiJVwiO1xuICAgICAgICAgICAgICAgICQodGhpcy5zY29yZURpdikuaHRtbChzY29yZVN0cmluZyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY29yZURpdi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5oaWdobGlnaHROdW1iZXJlZExpc3QoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQodGhpcy5zY29yZURpdikuaHRtbChcbiAgICAgICAgICAgICAgICBcIlRoYW5rIHlvdSBmb3IgdGFraW5nIHRoZSBleGFtLiAgWW91ciBhbnN3ZXJzIGhhdmUgYmVlbiByZWNvcmRlZC5cIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuc2NvcmVEaXYuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBoaWdobGlnaHROdW1iZXJlZExpc3QoKSB7XG4gICAgICAgIHZhciBjb3JyZWN0Q291bnQgPSB0aGlzLmNvcnJlY3RTdHI7XG4gICAgICAgIHZhciBpbmNvcnJlY3RDb3VudCA9IHRoaXMuaW5jb3JyZWN0U3RyO1xuICAgICAgICB2YXIgc2tpcHBlZENvdW50ID0gdGhpcy5za2lwcGVkU3RyO1xuICAgICAgICBjb3JyZWN0Q291bnQgPSBjb3JyZWN0Q291bnQucmVwbGFjZSgvIC9nLCBcIlwiKS5zcGxpdChcIixcIik7XG4gICAgICAgIGluY29ycmVjdENvdW50ID0gaW5jb3JyZWN0Q291bnQucmVwbGFjZSgvIC9nLCBcIlwiKS5zcGxpdChcIixcIik7XG4gICAgICAgIHNraXBwZWRDb3VudCA9IHNraXBwZWRDb3VudC5yZXBsYWNlKC8gL2csIFwiXCIpLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgJChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbnVtYmVyZWRCdG5zID0gJChcInVsI3BhZ2VOdW1zID4gdWwgPiBsaVwiKTtcbiAgICAgICAgICAgIGlmIChudW1iZXJlZEJ0bnMuaGFzQ2xhc3MoXCJhbnN3ZXJlZFwiKSkge1xuICAgICAgICAgICAgICAgIG51bWJlcmVkQnRucy5yZW1vdmVDbGFzcyhcImFuc3dlcmVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3JyZWN0Q291bnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgdGVzdCA9IHBhcnNlSW50KGNvcnJlY3RDb3VudFtpXSkgLSAxO1xuICAgICAgICAgICAgICAgIG51bWJlcmVkQnRuc1xuICAgICAgICAgICAgICAgICAgICAuZXEocGFyc2VJbnQoY29ycmVjdENvdW50W2ldKSAtIDEpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhcImNvcnJlY3RDb3VudFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaW5jb3JyZWN0Q291bnQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBudW1iZXJlZEJ0bnNcbiAgICAgICAgICAgICAgICAgICAgLmVxKHBhcnNlSW50KGluY29ycmVjdENvdW50W2pdKSAtIDEpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhcImluY29ycmVjdENvdW50XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBza2lwcGVkQ291bnQubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICBudW1iZXJlZEJ0bnNcbiAgICAgICAgICAgICAgICAgICAgLmVxKHBhcnNlSW50KHNraXBwZWRDb3VudFtrXSkgLSAxKVxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoXCJza2lwcGVkQ291bnRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gRnVuY3Rpb24gdGhhdCBjYWxscyB0aGUgY29uc3RydWN0b3JzIG9uIHBhZ2UgbG9hZCA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuJChkb2N1bWVudCkub24oXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuICAgICQoXCJbZGF0YS1jb21wb25lbnQ9dGltZWRBc3Nlc3NtZW50XVwiKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICBUaW1lZExpc3RbdGhpcy5pZF0gPSBuZXcgVGltZWQoe1xuICAgICAgICAgICAgb3JpZzogdGhpcyxcbiAgICAgICAgICAgIHVzZVJ1bmVzdG9uZVNlcnZpY2VzOiBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyxcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==