"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_timed_js_timed_js-runestone_dragndrop_css_dragndrop_less-runestone_clickableArea_cs-e2a9c9"],{

/***/ 32426:
/*!****************************************!*\
  !*** ./runestone/timed/css/timed.less ***!
  \****************************************/
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
/* harmony import */ var _css_timed_less__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../css/timed.less */ 32426);
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
        let runestoneChildren = this.origElem.querySelectorAll(".runestone");
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
        this.containerDiv.classList.add("runestone-sphinx");
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
                    state: opts.state,
                };
            }
        } else if (opts.state === "broken_exam") {
            return;
        }

        currentQuestion =
            this.renderedQuestionArray[this.currentQuestionIndex].question;
        if (opts.state === "forreview") {
            await currentQuestion.component_ready_promise;
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
            if (
                currentQuestion.containerDiv.classList.contains("runestone") ==
                false
            ) {
                currentQuestion.containerDiv.classList.add("runestone");
            }
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
                parseInt(data.time_taken),
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
        } else if (tmpArr.length == 5) {
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
                scoreString +=
                    "Percent Correct: " + percentCorrect.toFixed(2) + "%";
                $(this.scoreDiv).html(scoreString);
                this.scoreDiv.style.display = "block";
            } else {
                scoreString = `Num Correct: ${this.score}<br>Num Wrong: ${this.incorrect}<br>Num Skipped: ${this.skipped}<br>`;
                numQuestions = this.score + this.incorrect + this.skipped;
                percentCorrect = (this.score / numQuestions) * 100;
                scoreString +=
                    "Percent Correct: " + percentCorrect.toFixed(2) + "%";
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
        window.componentMap[this.id] = new Timed({
            orig: this,
            useRunestoneServices: eBookConfig.useRunestoneServices,
        });
    });
});


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZV90aW1lZF9qc190aW1lZF9qcy1ydW5lc3RvbmVfZHJhZ25kcm9wX2Nzc19kcmFnbmRyb3BfbGVzcy1ydW5lc3RvbmVfY2xpY2thYmxlQXJlYV9jcy1lMmE5YzkuYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2E7O0FBRWdEO0FBQ1Y7QUFDRDtBQUN1QjtBQUNoQjtBQUNjO0FBQ1g7QUFDQTtBQUNGO0FBQy9COztBQUUzQjtBQUNlLG9CQUFvQixtRUFBYTtBQUNoRDtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0VBQStFO0FBQy9FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkMseUNBQXlDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsOEJBQThCO0FBQ3REO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsOEJBQThCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxPQUFPO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDZCQUE2QjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFXLGlCQUFpQixlQUFlLG1CQUFtQixhQUFhO0FBQ3pIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLHlCQUF5QjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLDJCQUEyQjtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qix5QkFBeUI7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS90aW1lZC9jc3MvdGltZWQubGVzcz85MmFmIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvdGltZWQvanMvdGltZWQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09ICAgICAgTWFzdGVyIHRpbWVkLmpzICAgICA9PT09PT09PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgIFRoaXMgZmlsZSBjb250YWlucyB0aGUgSlMgZm9yICAgID09PVxuPT09ICAgICB0aGUgUnVuZXN0b25lIHRpbWVkIGNvbXBvbmVudC4gICA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgICAgICAgICAgIENyZWF0ZWQgQnkgICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgIEtpcmJ5IE9sc29uICAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgIDYvMTEvMTUgICAgICAgICAgICAgICAgPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qc1wiO1xuaW1wb3J0IFRpbWVkRklUQiBmcm9tIFwiLi4vLi4vZml0Yi9qcy90aW1lZGZpdGIuanNcIjtcbmltcG9ydCBUaW1lZE1DIGZyb20gXCIuLi8uLi9tY2hvaWNlL2pzL3RpbWVkbWMuanNcIjtcbmltcG9ydCBUaW1lZFNob3J0QW5zd2VyIGZyb20gXCIuLi8uLi9zaG9ydGFuc3dlci9qcy90aW1lZF9zaG9ydGFuc3dlci5qc1wiO1xuaW1wb3J0IEFDRmFjdG9yeSBmcm9tIFwiLi4vLi4vYWN0aXZlY29kZS9qcy9hY2ZhY3RvcnkuanNcIjtcbmltcG9ydCBUaW1lZENsaWNrYWJsZUFyZWEgZnJvbSBcIi4uLy4uL2NsaWNrYWJsZUFyZWEvanMvdGltZWRjbGlja2FibGVcIjtcbmltcG9ydCBUaW1lZERyYWdORHJvcCBmcm9tIFwiLi4vLi4vZHJhZ25kcm9wL2pzL3RpbWVkZG5kLmpzXCI7XG5pbXBvcnQgVGltZWRQYXJzb25zIGZyb20gXCIuLi8uLi9wYXJzb25zL2pzL3RpbWVkcGFyc29ucy5qc1wiO1xuaW1wb3J0IFNlbGVjdE9uZSBmcm9tIFwiLi4vLi4vc2VsZWN0cXVlc3Rpb24vanMvc2VsZWN0b25lXCI7XG5pbXBvcnQgXCIuLi9jc3MvdGltZWQubGVzc1wiO1xuXG4vLyBUaW1lZCBjb25zdHJ1Y3RvclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWQgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB2YXIgb3JpZyA9IG9wdHMub3JpZztcbiAgICAgICAgdGhpcy5vcmlnRWxlbSA9IG9yaWc7IC8vIHRoZSBlbnRpcmUgZWxlbWVudCBvZiB0aGlzIHRpbWVkIGFzc2Vzc21lbnQgYW5kIGFsbCBvZiBpdHMgY2hpbGRyZW5cbiAgICAgICAgdGhpcy5kaXZpZCA9IG9yaWcuaWQ7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSB0aGlzLm9yaWdFbGVtLmNoaWxkTm9kZXM7XG4gICAgICAgIHRoaXMudmlzaXRlZCA9IFtdO1xuICAgICAgICB0aGlzLnRpbWVMaW1pdCA9IDA7XG4gICAgICAgIHRoaXMubGltaXRlZFRpbWUgPSBmYWxzZTtcbiAgICAgICAgaWYgKCFpc05hTigkKHRoaXMub3JpZ0VsZW0pLmRhdGEoXCJ0aW1lXCIpKSkge1xuICAgICAgICAgICAgdGhpcy50aW1lTGltaXQgPSBwYXJzZUludCgkKHRoaXMub3JpZ0VsZW0pLmRhdGEoXCJ0aW1lXCIpLCAxMCkgKiA2MDsgLy8gdGltZSBpbiBzZWNvbmRzIHRvIGNvbXBsZXRlIHRoZSBleGFtXG4gICAgICAgICAgICB0aGlzLnN0YXJ0aW5nVGltZSA9IHRoaXMudGltZUxpbWl0O1xuICAgICAgICAgICAgdGhpcy5saW1pdGVkVGltZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaG93RmVlZGJhY2sgPSB0cnVlO1xuICAgICAgICBpZiAoJCh0aGlzLm9yaWdFbGVtKS5pcyhcIltkYXRhLW5vLWZlZWRiYWNrXVwiKSkge1xuICAgICAgICAgICAgdGhpcy5zaG93RmVlZGJhY2sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNob3dSZXN1bHRzID0gdHJ1ZTtcbiAgICAgICAgaWYgKCQodGhpcy5vcmlnRWxlbSkuaXMoXCJbZGF0YS1uby1yZXN1bHRdXCIpKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dSZXN1bHRzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yYW5kb20gPSBmYWxzZTtcbiAgICAgICAgaWYgKCQodGhpcy5vcmlnRWxlbSkuaXMoXCJbZGF0YS1yYW5kb21dXCIpKSB7XG4gICAgICAgICAgICB0aGlzLnJhbmRvbSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaG93VGltZXIgPSB0cnVlO1xuICAgICAgICBpZiAoJCh0aGlzLm9yaWdFbGVtKS5pcyhcIltkYXRhLW5vLXRpbWVyXVwiKSkge1xuICAgICAgICAgICAgdGhpcy5zaG93VGltZXIgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZ1bGx3aWR0aCA9IGZhbHNlO1xuICAgICAgICBpZiAoJCh0aGlzLm9yaWdFbGVtKS5pcyhcIltkYXRhLWZ1bGx3aWR0aF1cIikpIHtcbiAgICAgICAgICAgIHRoaXMuZnVsbHdpZHRoID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5vcGF1c2UgPSBmYWxzZTtcbiAgICAgICAgaWYgKCQodGhpcy5vcmlnRWxlbSkuaXMoXCJbZGF0YS1uby1wYXVzZV1cIikpIHtcbiAgICAgICAgICAgIHRoaXMubm9wYXVzZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZUJvb2tDb25maWcuZW5hYmxlU2NyYXRjaEFDID0gZmFsc2U7XG4gICAgICAgIHRoaXMucnVubmluZyA9IDA7XG4gICAgICAgIHRoaXMucGF1c2VkID0gMDtcbiAgICAgICAgdGhpcy5kb25lID0gMDtcbiAgICAgICAgdGhpcy50YWtlbiA9IDA7XG4gICAgICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgICAgICB0aGlzLmluY29ycmVjdCA9IDA7XG4gICAgICAgIHRoaXMuY29ycmVjdFN0ciA9IFwiXCI7XG4gICAgICAgIHRoaXMuaW5jb3JyZWN0U3RyID0gXCJcIjtcbiAgICAgICAgdGhpcy5za2lwcGVkU3RyID0gXCJcIjtcbiAgICAgICAgdGhpcy5za2lwcGVkID0gMDtcbiAgICAgICAgdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCA9IDA7IC8vIFdoaWNoIHF1ZXN0aW9uIGlzIGN1cnJlbnRseSBkaXNwbGF5aW5nIG9uIHRoZSBwYWdlXG4gICAgICAgIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5ID0gW107IC8vIGxpc3Qgb2YgYWxsIHByb2JsZW1zXG4gICAgICAgIHRoaXMuZ2V0TmV3Q2hpbGRyZW4oKTtcbiAgICAgICAgLy8gT25lIHNtYWxsIHN0ZXAgdG8gZWxpbWluYXRlIHN0dWRlbnRzIGZyb20gZG9pbmcgdmlldyBzb3VyY2VcbiAgICAgICAgLy8gdGhpcyB3b24ndCBzdG9wIGFueW9uZSB3aXRoIGRldGVybWluYXRpb24gYnV0IG1heSBwcmV2ZW50IGNhc3VhbCBwZWVraW5nXG4gICAgICAgIGlmICghZUJvb2tDb25maWcuZW5hYmxlRGVidWcpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkub25jb250ZXh0bWVudSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hlY2tBc3Nlc3NtZW50U3RhdHVzKCkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclRpbWVkQXNzZXNzKCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBnZXROZXdDaGlsZHJlbigpIHtcbiAgICAgICAgdGhpcy5uZXdDaGlsZHJlbiA9IFtdO1xuICAgICAgICBsZXQgcnVuZXN0b25lQ2hpbGRyZW4gPSB0aGlzLm9yaWdFbGVtLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucnVuZXN0b25lXCIpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJ1bmVzdG9uZUNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLm5ld0NoaWxkcmVuLnB1c2gocnVuZXN0b25lQ2hpbGRyZW5baV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgY2hlY2tBc3Nlc3NtZW50U3RhdHVzKCkge1xuICAgICAgICAvLyBIYXMgdGhlIHVzZXIgdGFrZW4gdGhpcyBleGFtPyAgSW5xdWlyaW5nIG1pbmRzIHdhbnQgdG8ga25vd1xuICAgICAgICAvLyBJZiBhIHVzZXIgaGFzIG5vdCB0YWtlbiB0aGlzIGV4YW0gdGhlbiB3ZSB3YW50IHRvIG1ha2Ugc3VyZVxuICAgICAgICAvLyB0aGF0IGlmIGEgcXVlc3Rpb24gaGFzIGJlZW4gc2VlbiBieSB0aGUgc3R1ZGVudCBiZWZvcmUgd2UgZG9cbiAgICAgICAgLy8gbm90IHBvcHVsYXRlIHByZXZpb3VzIGFuc3dlcnMuXG4gICAgICAgIGxldCBzZW5kSW5mbyA9IHtcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgIGNvdXJzZV9uYW1lOiBlQm9va0NvbmZpZy5jb3Vyc2UsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnNvbGUubG9nKHNlbmRJbmZvKTtcbiAgICAgICAgaWYgKGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9hc3Nlc3NtZW50L3Rvb2tUaW1lZEFzc2Vzc21lbnRgLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5qc29uSGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoc2VuZEluZm8pLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgICAgIGxldCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgZGF0YSA9IGRhdGEuZGV0YWlsO1xuICAgICAgICAgICAgdGhpcy50YWtlbiA9IGRhdGEudG9va0Fzc2Vzc21lbnQ7XG4gICAgICAgICAgICB0aGlzLmFzc2Vzc21lbnRUYWtlbiA9IHRoaXMudGFrZW47XG4gICAgICAgICAgICBpZiAoIXRoaXMudGFrZW4pIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZG9uZSB3aXRoIGNoZWNrIHN0YXR1c1wiKTtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGFrZW4gPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuYXNzZXNzbWVudFRha2VuID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT0gR2VuZXJhdGluZyBuZXcgVGltZWQgSFRNTCA9PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICBhc3luYyByZW5kZXJUaW1lZEFzc2VzcygpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJyZW5kZXJpbmcgdGltZWQgXCIpO1xuICAgICAgICAvLyBjcmVhdGUgcmVuZGVyZWRRdWVzdGlvbkFycmF5IHJldHVybnMgYSBwcm9taXNlXG4gICAgICAgIC8vXG4gICAgICAgIHRoaXMuY3JlYXRlUmVuZGVyZWRRdWVzdGlvbkFycmF5KCk7XG4gICAgICAgIGlmICh0aGlzLnJhbmRvbSkge1xuICAgICAgICAgICAgdGhpcy5yYW5kb21pemVSUUEoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbmRlckNvbnRhaW5lcigpO1xuICAgICAgICB0aGlzLnJlbmRlclRpbWVyKCk7XG4gICAgICAgIGF3YWl0IHRoaXMucmVuZGVyQ29udHJvbEJ1dHRvbnMoKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy50aW1lZERpdik7IC8vIFRoaXMgY2FuJ3QgYmUgYXBwZW5kZWQgaW4gcmVuZGVyQ29udGFpbmVyIGJlY2F1c2UgdGhlbiBpdCByZW5kZXJzIGFib3ZlIHRoZSB0aW1lciBhbmQgY29udHJvbCBidXR0b25zLlxuICAgICAgICBpZiAodGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoID4gMSkgdGhpcy5yZW5kZXJOYXZDb250cm9scygpO1xuICAgICAgICB0aGlzLnJlbmRlclN1Ym1pdEJ1dHRvbigpO1xuICAgICAgICB0aGlzLnJlbmRlckZlZWRiYWNrQ29udGFpbmVyKCk7XG4gICAgICAgIHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMgPSBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcztcbiAgICAgICAgLy8gUmVwbGFjZSBpbnRlcm1lZGlhdGUgSFRNTCB3aXRoIHJlbmRlcmVkIEhUTUxcbiAgICAgICAgJCh0aGlzLm9yaWdFbGVtKS5yZXBsYWNlV2l0aCh0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgIC8vIGNoZWNrIGlmIGFscmVhZHkgdGFrZW4gYW5kIGlmIHNvIHNob3cgcmVzdWx0c1xuICAgICAgICB0aGlzLnN0eWxlRXhhbUVsZW1lbnRzKCk7IC8vIHJlbmFtZSB0byByZW5kZXJQb3NzaWJsZVJlc3VsdHNcbiAgICAgICAgdGhpcy5jaGVja1NlcnZlcihcInRpbWVkRXhhbVwiLCB0cnVlKTtcbiAgICB9XG5cbiAgICByZW5kZXJDb250YWluZXIoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTsgLy8gY29udGFpbmVyIGZvciB0aGUgZW50aXJlIFRpbWVkIENvbXBvbmVudFxuICAgICAgICBpZiAodGhpcy5mdWxsd2lkdGgpIHtcbiAgICAgICAgICAgIC8vIGFsbG93IHRoZSBjb250YWluZXIgdG8gZmlsbCB0aGUgd2lkdGggLSBiYXJiXG4gICAgICAgICAgICAkKHRoaXMuY29udGFpbmVyRGl2KS5hdHRyKHtcbiAgICAgICAgICAgICAgICBzdHlsZTogXCJtYXgtd2lkdGg6bm9uZVwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuY2xhc3NMaXN0LmFkZChcInJ1bmVzdG9uZS1zcGhpbnhcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgdGhpcy50aW1lZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7IC8vIGRpdiB0aGF0IHdpbGwgaG9sZCB0aGUgcXVlc3Rpb25zIGZvciB0aGUgdGltZWQgYXNzZXNzbWVudFxuICAgICAgICB0aGlzLm5hdkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7IC8vIEZvciBuYXZpZ2F0aW9uIGNvbnRyb2xcbiAgICAgICAgJCh0aGlzLm5hdkRpdikuYXR0cih7XG4gICAgICAgICAgICBzdHlsZTogXCJ0ZXh0LWFsaWduOmNlbnRlclwiLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5mbGFnRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTsgLy8gZGl2IHRoYXQgd2lsbCBob2xkIHRoZSBcIkZsYWcgUXVlc3Rpb25cIiBidXR0b25cbiAgICAgICAgJCh0aGlzLmZsYWdEaXYpLmF0dHIoe1xuICAgICAgICAgICAgc3R5bGU6IFwidGV4dC1hbGlnbjogY2VudGVyXCIsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnN3aXRjaENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuc3dpdGNoQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJzd2l0Y2hjb250YWluZXJcIik7XG4gICAgICAgIHRoaXMuc3dpdGNoRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTsgLy8gaXMgcmVwbGFjZWQgYnkgdGhlIHF1ZXN0aW9uc1xuICAgICAgICB0aGlzLnRpbWVkRGl2LmFwcGVuZENoaWxkKHRoaXMubmF2RGl2KTtcbiAgICAgICAgdGhpcy50aW1lZERpdi5hcHBlbmRDaGlsZCh0aGlzLmZsYWdEaXYpOyAvLyBhZGQgZmxhZ0RpdiB0byB0aW1lZERpdiwgd2hpY2ggaG9sZHMgY29tcG9uZW50cyBmb3IgbmF2aWdhdGlvbiBhbmQgcXVlc3Rpb25zIGZvciB0aW1lZCBhc3Nlc3NtZW50XG4gICAgICAgIHRoaXMudGltZWREaXYuYXBwZW5kQ2hpbGQodGhpcy5zd2l0Y2hDb250YWluZXIpO1xuICAgICAgICB0aGlzLnN3aXRjaENvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnN3aXRjaERpdik7XG4gICAgICAgICQodGhpcy50aW1lZERpdikuYXR0cih7XG4gICAgICAgICAgICBpZDogXCJ0aW1lZF9UZXN0XCIsXG4gICAgICAgICAgICBzdHlsZTogXCJkaXNwbGF5Om5vbmVcIixcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVuZGVyVGltZXIoKSB7XG4gICAgICAgIHRoaXMud3JhcHBlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMudGltZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiUFwiKTtcbiAgICAgICAgdGhpcy53cmFwcGVyRGl2LmlkID0gdGhpcy5kaXZpZCArIFwiLXN0YXJ0V3JhcHBlclwiO1xuICAgICAgICB0aGlzLnRpbWVyQ29udGFpbmVyLmlkID0gdGhpcy5kaXZpZCArIFwiLW91dHB1dFwiO1xuICAgICAgICB0aGlzLndyYXBwZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy50aW1lckNvbnRhaW5lcik7XG4gICAgICAgIHRoaXMuc2hvd1RpbWUoKTtcbiAgICB9XG5cbiAgICByZW5kZXJDb250cm9sQnV0dG9ucygpIHtcbiAgICAgICAgdGhpcy5jb250cm9sRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgJCh0aGlzLmNvbnRyb2xEaXYpLmF0dHIoe1xuICAgICAgICAgICAgaWQ6IFwiY29udHJvbHNcIixcbiAgICAgICAgICAgIHN0eWxlOiBcInRleHQtYWxpZ246IGNlbnRlclwiLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zdGFydEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMucGF1c2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAkKHRoaXMuc3RhcnRCdG4pLmF0dHIoe1xuICAgICAgICAgICAgY2xhc3M6IFwiYnRuIGJ0bi1zdWNjZXNzXCIsXG4gICAgICAgICAgICBpZDogXCJzdGFydFwiLFxuICAgICAgICAgICAgdGFiaW5kZXg6IFwiMFwiLFxuICAgICAgICAgICAgcm9sZTogXCJidXR0b25cIixcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc3RhcnRCdG4udGV4dENvbnRlbnQgPSBcIlN0YXJ0XCI7XG4gICAgICAgIHRoaXMuc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMuZmluaXNoQnV0dG9uKS5oaWRlKCk7IC8vIGhpZGUgdGhlIGZpbmlzaCBidXR0b24gZm9yIG5vd1xuICAgICAgICAgICAgICAgICQodGhpcy5mbGFnQnV0dG9uKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgbGV0IG1lc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgICAgICBtZXNzLmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgICAgIFwiPHN0cm9uZz5XYXJuaW5nOiBZb3Ugd2lsbCBub3QgYmUgYWJsZSB0byBjb250aW51ZSB0aGUgZXhhbSBpZiB5b3UgY2xvc2UgdGhpcyB0YWIsIGNsb3NlIHRoZSB3aW5kb3csIG9yIG5hdmlnYXRlIGF3YXkgZnJvbSB0aGlzIHBhZ2UhPC9zdHJvbmc+ICBNYWtlIHN1cmUgeW91IGNsaWNrIHRoZSBGaW5pc2ggRXhhbSBidXR0b24gd2hlbiB5b3UgYXJlIGRvbmUgdG8gc3VibWl0IHlvdXIgd29yayFcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xEaXYuYXBwZW5kQ2hpbGQobWVzcyk7XG4gICAgICAgICAgICAgICAgbWVzcy5jbGFzc0xpc3QuYWRkKFwiZXhhbXdhcm5pbmdcIik7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5yZW5kZXJUaW1lZFF1ZXN0aW9uKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydEFzc2Vzc21lbnQoKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG4gICAgICAgICQodGhpcy5wYXVzZUJ0bikuYXR0cih7XG4gICAgICAgICAgICBjbGFzczogXCJidG4gYnRuLWRlZmF1bHRcIixcbiAgICAgICAgICAgIGlkOiBcInBhdXNlXCIsXG4gICAgICAgICAgICBkaXNhYmxlZDogXCJ0cnVlXCIsXG4gICAgICAgICAgICB0YWJpbmRleDogXCIwXCIsXG4gICAgICAgICAgICByb2xlOiBcImJ1dHRvblwiLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5wYXVzZUJ0bi50ZXh0Q29udGVudCA9IFwiUGF1c2VcIjtcbiAgICAgICAgdGhpcy5wYXVzZUJ0bi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGF1c2VBc3Nlc3NtZW50KCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgICAgICBpZiAoIXRoaXMudGFrZW4pIHtcbiAgICAgICAgICAgIHRoaXMuY29udHJvbERpdi5hcHBlbmRDaGlsZCh0aGlzLnN0YXJ0QnRuKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMubm9wYXVzZSkge1xuICAgICAgICAgICAgdGhpcy5jb250cm9sRGl2LmFwcGVuZENoaWxkKHRoaXMucGF1c2VCdG4pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMud3JhcHBlckRpdik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuY29udHJvbERpdik7XG4gICAgfVxuXG4gICAgcmVuZGVyTmF2Q29udHJvbHMoKSB7XG4gICAgICAgIC8vIG1ha2luZyBcIlByZXZcIiBidXR0b25cbiAgICAgICAgdGhpcy5wYWdOYXZMaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xuICAgICAgICAkKHRoaXMucGFnTmF2TGlzdCkuYWRkQ2xhc3MoXCJwYWdpbmF0aW9uXCIpO1xuICAgICAgICB0aGlzLmxlZnRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgIHRoaXMubGVmdE5hdkJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMubGVmdE5hdkJ1dHRvbi5pbm5lckhUTUwgPSBcIiYjODI0OTsgUHJldlwiO1xuICAgICAgICAkKHRoaXMubGVmdE5hdkJ1dHRvbikuYXR0cihcImFyaWEtbGFiZWxcIiwgXCJQcmV2aW91c1wiKTtcbiAgICAgICAgJCh0aGlzLmxlZnROYXZCdXR0b24pLmF0dHIoXCJ0YWJpbmRleFwiLCBcIjBcIik7XG4gICAgICAgICQodGhpcy5sZWZ0TmF2QnV0dG9uKS5hdHRyKFwicm9sZVwiLCBcImJ1dHRvblwiKTtcbiAgICAgICAgJCh0aGlzLnJpZ2h0TmF2QnV0dG9uKS5hdHRyKFwiaWRcIiwgXCJwcmV2XCIpO1xuICAgICAgICAkKHRoaXMubGVmdE5hdkJ1dHRvbikuY3NzKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKTtcbiAgICAgICAgdGhpcy5sZWZ0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMubGVmdE5hdkJ1dHRvbik7XG4gICAgICAgIHRoaXMucGFnTmF2TGlzdC5hcHBlbmRDaGlsZCh0aGlzLmxlZnRDb250YWluZXIpO1xuICAgICAgICAvLyBtYWtpbmcgXCJGbGFnIFF1ZXN0aW9uXCIgYnV0dG9uXG4gICAgICAgIHRoaXMuZmxhZ2dpbmdQbGFjZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcbiAgICAgICAgJCh0aGlzLmZsYWdnaW5nUGxhY2UpLmFkZENsYXNzKFwicGFnaW5hdGlvblwiKTtcbiAgICAgICAgdGhpcy5mbGFnQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgICAgICB0aGlzLmZsYWdCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAkKHRoaXMuZmxhZ0J1dHRvbikuYWRkQ2xhc3MoXCJmbGFnQnRuXCIpO1xuICAgICAgICB0aGlzLmZsYWdCdXR0b24uaW5uZXJIVE1MID0gXCJGbGFnIFF1ZXN0aW9uXCI7IC8vIG5hbWUgb24gYnV0dG9uXG4gICAgICAgICQodGhpcy5mbGFnQnV0dG9uKS5hdHRyKFwiYXJpYS1sYWJlbGxlZGJ5XCIsIFwiRmxhZ1wiKTtcbiAgICAgICAgJCh0aGlzLmZsYWdCdXR0b24pLmF0dHIoXCJ0YWJpbmRleFwiLCBcIjVcIik7XG4gICAgICAgICQodGhpcy5mbGFnQnV0dG9uKS5hdHRyKFwicm9sZVwiLCBcImJ1dHRvblwiKTtcbiAgICAgICAgJCh0aGlzLmZsYWdCdXR0b24pLmF0dHIoXCJpZFwiLCBcImZsYWdcIik7XG4gICAgICAgICQodGhpcy5mbGFnQnV0dG9uKS5jc3MoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpO1xuICAgICAgICB0aGlzLmZsYWdDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5mbGFnQnV0dG9uKTsgLy8gYWRkaW5nIGJ1dHRvbiB0byBjb250YWluZXJcbiAgICAgICAgdGhpcy5mbGFnZ2luZ1BsYWNlLmFwcGVuZENoaWxkKHRoaXMuZmxhZ0NvbnRhaW5lcik7IC8vIGFkZGluZyBjb250YWluZXIgdG8gZmxhZ2dpbmdQbGFjZVxuICAgICAgICAvLyBtYWtpbmcgXCJOZXh0XCIgYnV0dG9uXG4gICAgICAgIHRoaXMucmlnaHRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgIHRoaXMucmlnaHROYXZCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAkKHRoaXMucmlnaHROYXZCdXR0b24pLmF0dHIoXCJhcmlhLWxhYmVsXCIsIFwiTmV4dFwiKTtcbiAgICAgICAgJCh0aGlzLnJpZ2h0TmF2QnV0dG9uKS5hdHRyKFwidGFiaW5kZXhcIiwgXCIwXCIpO1xuICAgICAgICAkKHRoaXMucmlnaHROYXZCdXR0b24pLmF0dHIoXCJyb2xlXCIsIFwiYnV0dG9uXCIpO1xuICAgICAgICAkKHRoaXMucmlnaHROYXZCdXR0b24pLmF0dHIoXCJpZFwiLCBcIm5leHRcIik7XG4gICAgICAgIHRoaXMucmlnaHROYXZCdXR0b24uaW5uZXJIVE1MID0gXCJOZXh0ICYjODI1MDtcIjtcbiAgICAgICAgJCh0aGlzLnJpZ2h0TmF2QnV0dG9uKS5jc3MoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpO1xuICAgICAgICB0aGlzLnJpZ2h0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMucmlnaHROYXZCdXR0b24pO1xuICAgICAgICB0aGlzLnBhZ05hdkxpc3QuYXBwZW5kQ2hpbGQodGhpcy5yaWdodENvbnRhaW5lcik7XG4gICAgICAgIHRoaXMuZW5zdXJlQnV0dG9uU2FmZXR5KCk7XG4gICAgICAgIHRoaXMubmF2RGl2LmFwcGVuZENoaWxkKHRoaXMucGFnTmF2TGlzdCk7XG4gICAgICAgIHRoaXMuZmxhZ0Rpdi5hcHBlbmRDaGlsZCh0aGlzLmZsYWdnaW5nUGxhY2UpOyAvLyBhZGRzIGZsYWdnaW5nUGxhY2UgdG8gdGhlIGZsYWdEaXZcbiAgICAgICAgdGhpcy5icmVhayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJiclwiKTtcbiAgICAgICAgdGhpcy5uYXZEaXYuYXBwZW5kQ2hpbGQodGhpcy5icmVhayk7XG4gICAgICAgIC8vIHJlbmRlciB0aGUgcXVlc3Rpb24gbnVtYmVyIGp1bXAgYnV0dG9uc1xuICAgICAgICB0aGlzLnFOdW1MaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xuICAgICAgICAkKHRoaXMucU51bUxpc3QpLmF0dHIoXCJpZFwiLCBcInBhZ2VOdW1zXCIpO1xuICAgICAgICB0aGlzLnFOdW1XcmFwcGVyTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcbiAgICAgICAgJCh0aGlzLnFOdW1XcmFwcGVyTGlzdCkuYWRkQ2xhc3MoXCJwYWdpbmF0aW9uXCIpO1xuICAgICAgICB2YXIgdG1wTGksIHRtcEE7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRtcExpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgICAgICAgICAgdG1wQSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgdG1wQS5pbm5lckhUTUwgPSBpICsgMTtcbiAgICAgICAgICAgICQodG1wQSkuY3NzKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKTtcbiAgICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgJCh0bXBMaSkuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0bXBMaS5hcHBlbmRDaGlsZCh0bXBBKTtcbiAgICAgICAgICAgIHRoaXMucU51bVdyYXBwZXJMaXN0LmFwcGVuZENoaWxkKHRtcExpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnFOdW1MaXN0LmFwcGVuZENoaWxkKHRoaXMucU51bVdyYXBwZXJMaXN0KTtcbiAgICAgICAgdGhpcy5uYXZEaXYuYXBwZW5kQ2hpbGQodGhpcy5xTnVtTGlzdCk7XG4gICAgICAgIHRoaXMubmF2QnRuTGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMuZmxhZ0J0bkxpc3RlbmVyKCk7IC8vIGxpc3RlbnMgZm9yIGNsaWNrIG9uIGZsYWcgYnV0dG9uXG4gICAgICAgICQodGhpcy5mbGFnQnV0dG9uKS5oaWRlKCk7XG4gICAgfVxuXG4gICAgLy8gd2hlbiBtb3Zpbmcgb2ZmIG9mIGEgcXVlc3Rpb24gaW4gYW4gYWN0aXZlIGV4YW06XG4gICAgLy8gMS4gc2hvdyB0aGF0IHRoZSBxdWVzdGlvbiBoYXMgYmVlbiBzZWVuLCBvciBtYXJrIGl0IGJyb2tlbiBpZiBpdCBpcyBpbiBlcnJvci5cbiAgICAvLyAyLiBjaGVjayBhbmQgbG9nIHRoZSBjdXJyZW50IGFuc3dlclxuICAgIGFzeW5jIG5hdmlnYXRlQXdheSgpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF0uc3RhdGUgPT1cbiAgICAgICAgICAgIFwiYnJva2VuX2V4YW1cIlxuICAgICAgICApIHtcbiAgICAgICAgICAgICQoXG4gICAgICAgICAgICAgICAgXCJ1bCNwYWdlTnVtcyA+IHVsID4gbGk6ZXEoXCIgKyB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ICsgXCIpXCJcbiAgICAgICAgICAgICkuYWRkQ2xhc3MoXCJicm9rZW5cIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF0uc3RhdGUgPT1cbiAgICAgICAgICAgIFwiZXhhbV9lbmRlZFwiXG4gICAgICAgICkge1xuICAgICAgICAgICAgJChcbiAgICAgICAgICAgICAgICBcInVsI3BhZ2VOdW1zID4gdWwgPiBsaTplcShcIiArIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXggKyBcIilcIlxuICAgICAgICAgICAgKS5hZGRDbGFzcyhcInRvb2xhdGVcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF0ucXVlc3Rpb25cbiAgICAgICAgICAgICAgICAuaXNBbnN3ZXJlZFxuICAgICAgICApIHtcbiAgICAgICAgICAgICQoXG4gICAgICAgICAgICAgICAgXCJ1bCNwYWdlTnVtcyA+IHVsID4gbGk6ZXEoXCIgKyB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ICsgXCIpXCJcbiAgICAgICAgICAgICkuYWRkQ2xhc3MoXCJhbnN3ZXJlZFwiKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXhcbiAgICAgICAgICAgIF0ucXVlc3Rpb24uY2hlY2tDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZG9uZSkge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4XG4gICAgICAgICAgICAgICAgXS5xdWVzdGlvbi5sb2dDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgaGFuZGxlTmV4dFByZXYoZXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLnRha2VuKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLm5hdmlnYXRlQXdheSgpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCkudGV4dCgpO1xuICAgICAgICBpZiAodGFyZ2V0Lm1hdGNoKC9OZXh0LykpIHtcbiAgICAgICAgICAgIC8vIGNoZWNrcyBnaXZlbiB0ZXh0IHRvIG1hdGNoIFwiTmV4dFwiXG4gICAgICAgICAgICBpZiAoJCh0aGlzLnJpZ2h0Q29udGFpbmVyKS5oYXNDbGFzcyhcImRpc2FibGVkXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCsrO1xuICAgICAgICB9IGVsc2UgaWYgKHRhcmdldC5tYXRjaCgvUHJldi8pKSB7XG4gICAgICAgICAgICAvLyBjaGVja3MgZ2l2ZW4gdGV4dCB0byBtYXRjaCBcIlByZXZcIlxuICAgICAgICAgICAgaWYgKCQodGhpcy5sZWZ0Q29udGFpbmVyKS5oYXNDbGFzcyhcImRpc2FibGVkXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleC0tO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHRoaXMucmVuZGVyVGltZWRRdWVzdGlvbigpO1xuICAgICAgICB0aGlzLmVuc3VyZUJ1dHRvblNhZmV0eSgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucU51bUxpc3QuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChcbiAgICAgICAgICAgICAgICB2YXIgaiA9IDA7XG4gICAgICAgICAgICAgICAgaiA8IHRoaXMucU51bUxpc3QuY2hpbGROb2Rlc1tpXS5jaGlsZE5vZGVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBqKytcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICQodGhpcy5xTnVtTGlzdC5jaGlsZE5vZGVzW2ldLmNoaWxkTm9kZXNbal0pLnJlbW92ZUNsYXNzKFxuICAgICAgICAgICAgICAgICAgICBcImFjdGl2ZVwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAkKFxuICAgICAgICAgICAgXCJ1bCNwYWdlTnVtcyA+IHVsID4gbGk6ZXEoXCIgKyB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ICsgXCIpXCJcbiAgICAgICAgKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgJChcbiAgICAgICAgICAgICAgICBcInVsI3BhZ2VOdW1zID4gdWwgPiBsaTplcShcIiArIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXggKyBcIilcIlxuICAgICAgICAgICAgKS5oYXNDbGFzcyhcImZsYWdjb2xvclwiKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIGNoZWNraW5nIGZvciBjbGFzc1xuICAgICAgICAgICAgdGhpcy5mbGFnQnV0dG9uLmlubmVySFRNTCA9IFwiVW5mbGFnIFF1ZXN0aW9uXCI7IC8vIGNoYW5nZXMgdGV4dCBvbiBidXR0b25cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZmxhZ0J1dHRvbi5pbm5lckhUTUwgPSBcIkZsYWcgUXVlc3Rpb25cIjsgLy8gY2hhbmdlcyB0ZXh0IG9uIGJ1dHRvblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgaGFuZGxlRmxhZyhldmVudCkge1xuICAgICAgICAvLyBjYWxsZWQgd2hlbiBmbGFnIGJ1dHRvbiBpcyBjbGlja2VkXG4gICAgICAgIHZhciB0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCkudGV4dCgpO1xuICAgICAgICBpZiAodGFyZ2V0Lm1hdGNoKC9GbGFnIFF1ZXN0aW9uLykpIHtcbiAgICAgICAgICAgICQoXG4gICAgICAgICAgICAgICAgXCJ1bCNwYWdlTnVtcyA+IHVsID4gbGk6ZXEoXCIgKyB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ICsgXCIpXCJcbiAgICAgICAgICAgICkuYWRkQ2xhc3MoXCJmbGFnY29sb3JcIik7IC8vIGNsYXNzIHdpbGwgY2hhbmdlIGNvbG9yIG9mIHF1ZXN0aW9uIGJsb2NrXG4gICAgICAgICAgICB0aGlzLmZsYWdCdXR0b24uaW5uZXJIVE1MID0gXCJVbmZsYWcgUXVlc3Rpb25cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoXG4gICAgICAgICAgICAgICAgXCJ1bCNwYWdlTnVtcyA+IHVsID4gbGk6ZXEoXCIgKyB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ICsgXCIpXCJcbiAgICAgICAgICAgICkucmVtb3ZlQ2xhc3MoXCJmbGFnY29sb3JcIik7IC8vIHdpbGwgcmVzdG9yZSBjdXJyZW50IGNvbG9yIG9mIHF1ZXN0aW9uIGJsb2NrXG4gICAgICAgICAgICB0aGlzLmZsYWdCdXR0b24uaW5uZXJIVE1MID0gXCJGbGFnIFF1ZXN0aW9uXCI7IC8vIGFsc28gc2V0cyBuYW1lIGJhY2tcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGhhbmRsZU51bWJlcmVkTmF2KGV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy50YWtlbikge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5uYXZpZ2F0ZUF3YXkoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucU51bUxpc3QuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChcbiAgICAgICAgICAgICAgICB2YXIgaiA9IDA7XG4gICAgICAgICAgICAgICAgaiA8IHRoaXMucU51bUxpc3QuY2hpbGROb2Rlc1tpXS5jaGlsZE5vZGVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBqKytcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICQodGhpcy5xTnVtTGlzdC5jaGlsZE5vZGVzW2ldLmNoaWxkTm9kZXNbal0pLnJlbW92ZUNsYXNzKFxuICAgICAgICAgICAgICAgICAgICBcImFjdGl2ZVwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCkudGV4dCgpO1xuICAgICAgICBsZXQgb2xkSW5kZXggPSB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4O1xuICAgICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ID0gcGFyc2VJbnQodGFyZ2V0KSAtIDE7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ID4gdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3I6IGJhZCBpbmRleCBmb3IgJHt0YXJnZXR9YCk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ID0gb2xkSW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgJChcbiAgICAgICAgICAgIFwidWwjcGFnZU51bXMgPiB1bCA+IGxpOmVxKFwiICsgdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCArIFwiKVwiXG4gICAgICAgICkuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICQoXG4gICAgICAgICAgICAgICAgXCJ1bCNwYWdlTnVtcyA+IHVsID4gbGk6ZXEoXCIgKyB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ICsgXCIpXCIgLy8gY2hlY2tpbmcgZm9yIGZsYWdjb2xvciBjbGFzc1xuICAgICAgICAgICAgKS5oYXNDbGFzcyhcImZsYWdjb2xvclwiKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuZmxhZ0J1dHRvbi5pbm5lckhUTUwgPSBcIlVuZmxhZyBRdWVzdGlvblwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mbGFnQnV0dG9uLmlubmVySFRNTCA9IFwiRmxhZyBRdWVzdGlvblwiO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHRoaXMucmVuZGVyVGltZWRRdWVzdGlvbigpO1xuICAgICAgICB0aGlzLmVuc3VyZUJ1dHRvblNhZmV0eSgpO1xuICAgIH1cblxuICAgIC8vIHNldCB1cCBldmVudHMgZm9yIG5hdmlnYXRpb25cbiAgICBuYXZCdG5MaXN0ZW5lcnMoKSB7XG4gICAgICAgIC8vIE5leHQgYW5kIFByZXYgTGlzdGVuZXJcbiAgICAgICAgdGhpcy5wYWdOYXZMaXN0LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICB0aGlzLmhhbmRsZU5leHRQcmV2LmJpbmQodGhpcyksXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIE51bWJlcmVkIExpc3RlbmVyXG4gICAgICAgIHRoaXMucU51bUxpc3QuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlTnVtYmVyZWROYXYuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gc2V0IHVwIGV2ZW50IGZvciBmbGFnXG4gICAgZmxhZ0J0bkxpc3RlbmVyKCkge1xuICAgICAgICB0aGlzLmZsYWdnaW5nUGxhY2UuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRmxhZy5iaW5kKHRoaXMpLCAvLyBjYWxscyB0aGlzIHRvIHRha2UgYWN0aW9uXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHJlbmRlclN1Ym1pdEJ1dHRvbigpIHtcbiAgICAgICAgdGhpcy5idXR0b25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAkKHRoaXMuYnV0dG9uQ29udGFpbmVyKS5hdHRyKHtcbiAgICAgICAgICAgIHN0eWxlOiBcInRleHQtYWxpZ246Y2VudGVyXCIsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmZpbmlzaEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICQodGhpcy5maW5pc2hCdXR0b24pLmF0dHIoe1xuICAgICAgICAgICAgaWQ6IFwiZmluaXNoXCIsXG4gICAgICAgICAgICBjbGFzczogXCJidG4gYnRuLXByaW1hcnlcIixcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZmluaXNoQnV0dG9uLnRleHRDb250ZW50ID0gXCJGaW5pc2ggRXhhbVwiO1xuICAgICAgICB0aGlzLmZpbmlzaEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmNvbmZpcm0oXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNsaWNraW5nIE9LIG1lYW5zIHlvdSBhcmUgcmVhZHkgdG8gc3VibWl0IHlvdXIgYW5zd2VycyBhbmQgYXJlIGZpbmlzaGVkIHdpdGggdGhpcyBhc3Nlc3NtZW50LlwiXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5maW5pc2hBc3Nlc3NtZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5mbGFnQnV0dG9uKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5jb250cm9sRGl2LmFwcGVuZENoaWxkKHRoaXMuZmluaXNoQnV0dG9uKTtcbiAgICAgICAgJCh0aGlzLmZpbmlzaEJ1dHRvbikuaGlkZSgpO1xuICAgICAgICB0aGlzLnRpbWVkRGl2LmFwcGVuZENoaWxkKHRoaXMuYnV0dG9uQ29udGFpbmVyKTtcbiAgICB9XG4gICAgZW5zdXJlQnV0dG9uU2FmZXR5KCkge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5Lmxlbmd0aCAhPSAxKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLnJpZ2h0Q29udGFpbmVyKS5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCh0aGlzLmxlZnRDb250YWluZXIpLmFkZENsYXNzKFwiZGlzYWJsZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCA+PVxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoIC0gMVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheS5sZW5ndGggIT0gMSkge1xuICAgICAgICAgICAgICAgICQodGhpcy5sZWZ0Q29udGFpbmVyKS5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCh0aGlzLnJpZ2h0Q29udGFpbmVyKS5hZGRDbGFzcyhcImRpc2FibGVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXggPiAwICYmXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4IDwgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoIC0gMVxuICAgICAgICApIHtcbiAgICAgICAgICAgICQodGhpcy5yaWdodENvbnRhaW5lcikucmVtb3ZlQ2xhc3MoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICQodGhpcy5sZWZ0Q29udGFpbmVyKS5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlckZlZWRiYWNrQ29udGFpbmVyKCkge1xuICAgICAgICB0aGlzLnNjb3JlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIlBcIik7XG4gICAgICAgIHRoaXMuc2NvcmVEaXYuaWQgPSB0aGlzLmRpdmlkICsgXCJyZXN1bHRzXCI7XG4gICAgICAgIHRoaXMuc2NvcmVEaXYuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnNjb3JlRGl2KTtcbiAgICB9XG5cbiAgICBjcmVhdGVSZW5kZXJlZFF1ZXN0aW9uQXJyYXkoKSB7XG4gICAgICAgIC8vIHRoaXMgZmluZHMgYWxsIHRoZSBhc3Nlc3MgcXVlc3Rpb25zIGluIHRoaXMgdGltZWQgYXNzZXNzbWVudFxuICAgICAgICAvLyBXZSBuZWVkIHRvIG1ha2UgYSBsaXN0IG9mIGFsbCB0aGUgcXVlc3Rpb25zIHVwIGZyb250IHNvIHdlIGNhbiBzZXQgdXAgbmF2aWdhdGlvblxuICAgICAgICAvLyBidXQgd2UgZG8gbm90IHdhbnQgdG8gcmVuZGVyIHRoZSBxdWVzdGlvbnMgdW50aWwgdGhlIHN0dWRlbnQgaGFzIG5hdmlnYXRlZFxuICAgICAgICAvLyBBbHNvIGFkZHMgdGhlbSB0byB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheVxuXG4gICAgICAgIC8vIHRvZG86ICBUaGlzIG5lZWRzIHRvIGJlIHVwZGF0ZWQgdG8gYWNjb3VudCBmb3IgdGhlIHJ1bmVzdG9uZSBkaXYgd3JhcHBlci5cblxuICAgICAgICAvLyBUbyBhY2NvbW1vZGF0ZSB0aGUgc2VsZWN0cXVlc3Rpb24gdHlwZSAtLSB3aGljaCBpcyBhc3luYyEgd2UgbmVlZCB0byB3cmFwXG4gICAgICAgIC8vIGFsbCBvZiB0aGlzIGluIGEgcHJvbWlzZSwgc28gdGhhdCB3ZSBkb24ndCBjb250aW51ZSB0byByZW5kZXIgdGhlIHRpbWVkXG4gICAgICAgIC8vIGV4YW0gdW50aWwgYWxsIG9mIHRoZSBxdWVzdGlvbnMgaGF2ZSBiZWVuIHJlYWxpemVkLlxuICAgICAgICB2YXIgb3B0cztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5ld0NoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdG1wQ2hpbGQgPSB0aGlzLm5ld0NoaWxkcmVuW2ldO1xuICAgICAgICAgICAgb3B0cyA9IHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogXCJwcmVwYXJlZFwiLFxuICAgICAgICAgICAgICAgIG9yaWc6IHRtcENoaWxkLFxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uOiB7fSxcbiAgICAgICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMsXG4gICAgICAgICAgICAgICAgdGltZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgYXNzZXNzbWVudFRha2VuOiB0aGlzLnRha2VuLFxuICAgICAgICAgICAgICAgIHRpbWVkV3JhcHBlcjogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgICAgICBpbml0QXR0ZW1wdHM6IDAsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKCQodG1wQ2hpbGQpLmNoaWxkcmVuKFwiW2RhdGEtY29tcG9uZW50XVwiKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdG1wQ2hpbGQgPSAkKHRtcENoaWxkKS5jaGlsZHJlbihcIltkYXRhLWNvbXBvbmVudF1cIilbMF07XG4gICAgICAgICAgICAgICAgb3B0cy5vcmlnID0gdG1wQ2hpbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJCh0bXBDaGlsZCkuaXMoXCJbZGF0YS1jb21wb25lbnRdXCIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkucHVzaChvcHRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJhbmRvbWl6ZVJRQSgpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5Lmxlbmd0aCxcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlLFxuICAgICAgICAgICAgcmFuZG9tSW5kZXg7XG4gICAgICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXG4gICAgICAgIHdoaWxlIChjdXJyZW50SW5kZXggIT09IDApIHtcbiAgICAgICAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xuICAgICAgICAgICAgY3VycmVudEluZGV4IC09IDE7XG4gICAgICAgICAgICAvLyBBbmQgc3dhcCBpdCB3aXRoIHRoZSBjdXJyZW50IGVsZW1lbnQuXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheVtjdXJyZW50SW5kZXhdID1cbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheVtyYW5kb21JbmRleF07XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIHJlbmRlclRpbWVkUXVlc3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ID49IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5Lmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gc29tZXRpbWVzIHRoZSB1c2VyIGNsaWNrcyBpbiB0aGUgZXZlbnQgYXJlYSBmb3IgdGhlIHFOdW1MaXN0XG4gICAgICAgICAgICAvLyBCdXQgbWlzc2VzIGEgbnVtYmVyIGluIHRoYXQgY2FzZSB0aGUgdGV4dCBpcyB0aGUgY29uY2F0ZW5hdGlvblxuICAgICAgICAgICAgLy8gb2YgYWxsIHRoZSBudW1iZXJzIGluIHRoZSBsaXN0IVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNoZWNrIHRoZSByZW5kZXJlZFF1ZXN0aW9uQXJyYXkgdG8gc2VlIGlmIGl0IGhhcyBiZWVuIHJlbmRlcmVkLlxuICAgICAgICBsZXQgb3B0cyA9IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W3RoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXhdO1xuICAgICAgICBsZXQgY3VycmVudFF1ZXN0aW9uO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBvcHRzLnN0YXRlID09PSBcInByZXBhcmVkXCIgfHxcbiAgICAgICAgICAgIG9wdHMuc3RhdGUgPT09IFwiZm9ycmV2aWV3XCIgfHxcbiAgICAgICAgICAgIChvcHRzLnN0YXRlID09PSBcImJyb2tlbl9leGFtXCIgJiYgb3B0cy5pbml0QXR0ZW1wdHMgPCAzKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGxldCB0bXBDaGlsZCA9IG9wdHMub3JpZztcbiAgICAgICAgICAgIGlmICgkKHRtcENoaWxkKS5pcyhcIltkYXRhLWNvbXBvbmVudD1zZWxlY3RxdWVzdGlvbl1cIikpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kb25lICYmIG9wdHMuc3RhdGUgPT0gXCJwcmVwYXJlZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleFxuICAgICAgICAgICAgICAgICAgICBdLnN0YXRlID0gXCJleGFtX2VuZGVkXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2VsZWN0T25lIGlzIGFzeW5jIGFuZCB3aWxsIHJlcGxhY2UgaXRzZWxmIGluIHRoaXMgYXJyYXkgd2l0aFxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgYWN0dWFsIHNlbGVjdGVkIHF1ZXN0aW9uXG4gICAgICAgICAgICAgICAgICAgIG9wdHMucnFhID0gdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdxID0gbmV3IFNlbGVjdE9uZShvcHRzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbjogbmV3cSxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IG5ld3EuaW5pdGlhbGl6ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuc3RhdGUgPT0gXCJicm9rZW5fZXhhbVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBicm9rZW4gY2xhc3MgZnJvbSB0aGlzIHF1ZXN0aW9uIGlmIHdlIGdldCBoZXJlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGB1bCNwYWdlTnVtcyA+IHVsID4gbGk6ZXEoJHt0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4fSlgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKS5yZW1vdmVDbGFzcyhcImJyb2tlblwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5zdGF0ZSA9IFwiYnJva2VuX2V4YW1cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W3RoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXhdID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYEVycm9yIGluaXRpYWxpemluZyBxdWVzdGlvbjogRGV0YWlscyAke2V9YFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJCh0bXBDaGlsZCkuaXMoXCJbZGF0YS1jb21wb25lbnRdXCIpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvbXBvbmVudEtpbmQgPSAkKHRtcENoaWxkKS5kYXRhKFwiY29tcG9uZW50XCIpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W3RoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXhdID0ge1xuICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbjogd2luZG93LmNvbXBvbmVudF9mYWN0b3J5W2NvbXBvbmVudEtpbmRdKG9wdHMpLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZTogb3B0cy5zdGF0ZSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG9wdHMuc3RhdGUgPT09IFwiYnJva2VuX2V4YW1cIikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudFF1ZXN0aW9uID1cbiAgICAgICAgICAgIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W3RoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXhdLnF1ZXN0aW9uO1xuICAgICAgICBpZiAob3B0cy5zdGF0ZSA9PT0gXCJmb3JyZXZpZXdcIikge1xuICAgICAgICAgICAgYXdhaXQgY3VycmVudFF1ZXN0aW9uLmNvbXBvbmVudF9yZWFkeV9wcm9taXNlO1xuICAgICAgICAgICAgYXdhaXQgY3VycmVudFF1ZXN0aW9uLmNoZWNrQ3VycmVudEFuc3dlcigpO1xuICAgICAgICAgICAgY3VycmVudFF1ZXN0aW9uLnJlbmRlckZlZWRiYWNrKCk7XG4gICAgICAgICAgICBjdXJyZW50UXVlc3Rpb24uZGlzYWJsZUludGVyYWN0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMudmlzaXRlZC5pbmNsdWRlcyh0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4KSkge1xuICAgICAgICAgICAgdGhpcy52aXNpdGVkLnB1c2godGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCk7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdGhpcy52aXNpdGVkLmxlbmd0aCA9PT0gdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgIXRoaXMuZG9uZVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLmZpbmlzaEJ1dHRvbikuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1cnJlbnRRdWVzdGlvbi5jb250YWluZXJEaXYpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVlc3Rpb24uY29udGFpbmVyRGl2LmNsYXNzTGlzdC5jb250YWlucyhcInJ1bmVzdG9uZVwiKSA9PVxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVlc3Rpb24uY29udGFpbmVyRGl2LmNsYXNzTGlzdC5hZGQoXCJydW5lc3RvbmVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKHRoaXMuc3dpdGNoRGl2KS5yZXBsYWNlV2l0aChjdXJyZW50UXVlc3Rpb24uY29udGFpbmVyRGl2KTtcbiAgICAgICAgICAgIHRoaXMuc3dpdGNoRGl2ID0gY3VycmVudFF1ZXN0aW9uLmNvbnRhaW5lckRpdjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZSB0aW1lZCBjb21wb25lbnQgaGFzIGxpc3RlbmVycywgdGhvc2UgbWlnaHQgbmVlZCB0byBiZSByZWluaXRpYWxpemVkXG4gICAgICAgIC8vIFRoaXMgZmxhZyB3aWxsIG9ubHkgYmUgc2V0IGluIHRoZSBlbGVtZW50cyB0aGF0IG5lZWQgaXQtLWl0IHdpbGwgYmUgdW5kZWZpbmVkIGluIHRoZSBvdGhlcnMgYW5kIHRodXMgZXZhbHVhdGUgdG8gZmFsc2VcbiAgICAgICAgaWYgKGN1cnJlbnRRdWVzdGlvbi5uZWVkc1JlaW5pdGlhbGl6YXRpb24pIHtcbiAgICAgICAgICAgIGN1cnJlbnRRdWVzdGlvbi5yZWluaXRpYWxpemVMaXN0ZW5lcnModGhpcy50YWtlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBUaW1lciBhbmQgY29udHJvbCBGdW5jdGlvbnMgPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICBoYW5kbGVQcmV2QXNzZXNzbWVudCgpIHtcbiAgICAgICAgJCh0aGlzLnN0YXJ0QnRuKS5oaWRlKCk7XG4gICAgICAgICQodGhpcy5wYXVzZUJ0bikuYXR0cihcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAkKHRoaXMuZmluaXNoQnV0dG9uKS5hdHRyKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMucnVubmluZyA9IDA7XG4gICAgICAgIHRoaXMuZG9uZSA9IDE7XG4gICAgICAgIC8vIHNob3dGZWVkYmFjayBzYW5kIHNob3dSZXN1bHRzIHNob3VsZCBib3RoIGJlIHRydWUgYmVmb3JlIHdlIHNob3cgdGhlXG4gICAgICAgIC8vIHF1ZXN0aW9ucyBhbmQgdGhlaXIgc3RhdGUgb2YgY29ycmVjdG5lc3MuXG4gICAgICAgIGlmICh0aGlzLnNob3dSZXN1bHRzICYmIHRoaXMuc2hvd0ZlZWRiYWNrKSB7XG4gICAgICAgICAgICAkKHRoaXMudGltZWREaXYpLnNob3coKTtcbiAgICAgICAgICAgIHRoaXMucmVzdG9yZUFuc3dlcmVkUXVlc3Rpb25zKCk7IC8vIGRvIG5vdCBsb2cgdGhlc2UgcmVzdWx0c1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzLnBhdXNlQnRuKS5oaWRlKCk7XG4gICAgICAgICAgICAkKHRoaXMudGltZXJDb250YWluZXIpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGFydEFzc2Vzc21lbnQoKSB7XG4gICAgICAgIGlmICghdGhpcy50YWtlbikge1xuICAgICAgICAgICAgJChcIiNyZWxhdGlvbnMtbmV4dFwiKS5oaWRlKCk7IC8vIGhpZGUgdGhlIG5leHQgcGFnZSBidXR0b24gZm9yIG5vd1xuICAgICAgICAgICAgJChcIiNyZWxhdGlvbnMtcHJldlwiKS5oaWRlKCk7IC8vIGhpZGUgdGhlIHByZXZpb3VzIGJ1dHRvbiBmb3Igbm93XG4gICAgICAgICAgICAkKHRoaXMuc3RhcnRCdG4pLmhpZGUoKTtcbiAgICAgICAgICAgICQodGhpcy5wYXVzZUJ0bikuYXR0cihcImRpc2FibGVkXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnJ1bm5pbmcgPT09IDAgJiYgdGhpcy5wYXVzZWQgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJ1bm5pbmcgPSAxO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgICAgICQodGhpcy50aW1lZERpdikuc2hvdygpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5jcmVtZW50KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgICAgICAgICBldmVudDogXCJ0aW1lZEV4YW1cIixcbiAgICAgICAgICAgICAgICAgICAgYWN0OiBcInN0YXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgdGltZVN0YW1wID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICB2YXIgc3RvcmFnZU9iaiA9IHtcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VyOiBbMCwgMCwgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoLCAwXSxcbiAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiB0aW1lU3RhbXAsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoc3RvcmFnZU9iailcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCh3aW5kb3cpLm9uKFxuICAgICAgICAgICAgICAgIFwiYmVmb3JldW5sb2FkXCIsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgYWN0dWFsIHZhbHVlIGdldHMgaWdub3JlZCBieSBuZXdlciBicm93c2Vyc1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucmV0dXJuVmFsdWUgPVxuICAgICAgICAgICAgICAgICAgICAgICAgXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gbGVhdmU/ICBZb3VyIHdvcmsgd2lsbCBiZSBsb3N0ISBBbmQgeW91IHdpbGwgbmVlZCB5b3VyIGluc3RydWN0b3IgdG8gcmVzZXQgdGhlIGV4YW0hXCI7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBsZWF2ZT8gIFlvdXIgd29yayB3aWxsIGJlIGxvc3QhXCI7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgXCJwYWdlaGlkZVwiLFxuICAgICAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZG9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5maW5pc2hBc3Nlc3NtZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkV4YW0gZXhpdGVkIGJ5IGxlYXZpbmcgcGFnZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlUHJldkFzc2Vzc21lbnQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwYXVzZUFzc2Vzc21lbnQoKSB7XG4gICAgICAgIGlmICh0aGlzLmRvbmUgPT09IDApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJ1bm5pbmcgPT09IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50OiBcInRpbWVkRXhhbVwiLFxuICAgICAgICAgICAgICAgICAgICBhY3Q6IFwicGF1c2VcIixcbiAgICAgICAgICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMucnVubmluZyA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXVzZWQgPSAxO1xuICAgICAgICAgICAgICAgIHRoaXMucGF1c2VCdG4uaW5uZXJIVE1MID0gXCJSZXN1bWVcIjtcbiAgICAgICAgICAgICAgICAkKHRoaXMudGltZWREaXYpLmhpZGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgICAgICAgICBldmVudDogXCJ0aW1lZEV4YW1cIixcbiAgICAgICAgICAgICAgICAgICAgYWN0OiBcInJlc3VtZVwiLFxuICAgICAgICAgICAgICAgICAgICBkaXZfaWQ6IHRoaXMuZGl2aWQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5ydW5uaW5nID0gMTtcbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlZCA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmNyZW1lbnQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlQnRuLmlubmVySFRNTCA9IFwiUGF1c2VcIjtcbiAgICAgICAgICAgICAgICAkKHRoaXMudGltZWREaXYpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNob3dUaW1lKCkge1xuICAgICAgICBpZiAodGhpcy5zaG93VGltZXIpIHtcbiAgICAgICAgICAgIHZhciBtaW5zID0gTWF0aC5mbG9vcih0aGlzLnRpbWVMaW1pdCAvIDYwKTtcbiAgICAgICAgICAgIHZhciBzZWNzID0gTWF0aC5mbG9vcih0aGlzLnRpbWVMaW1pdCkgJSA2MDtcbiAgICAgICAgICAgIHZhciBtaW5zU3RyaW5nID0gbWlucztcbiAgICAgICAgICAgIHZhciBzZWNzU3RyaW5nID0gc2VjcztcbiAgICAgICAgICAgIGlmIChtaW5zIDwgMTApIHtcbiAgICAgICAgICAgICAgICBtaW5zU3RyaW5nID0gXCIwXCIgKyBtaW5zO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlY3MgPCAxMCkge1xuICAgICAgICAgICAgICAgIHNlY3NTdHJpbmcgPSBcIjBcIiArIHNlY3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYmVnaW5uaW5nID0gXCJUaW1lIFJlbWFpbmluZyAgICBcIjtcbiAgICAgICAgICAgIGlmICghdGhpcy5saW1pdGVkVGltZSkge1xuICAgICAgICAgICAgICAgIGJlZ2lubmluZyA9IFwiVGltZSBUYWtlbiAgICBcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0aW1lU3RyaW5nID0gYmVnaW5uaW5nICsgbWluc1N0cmluZyArIFwiOlwiICsgc2Vjc1N0cmluZztcbiAgICAgICAgICAgIGlmICh0aGlzLmRvbmUgfHwgdGhpcy50YWtlbikge1xuICAgICAgICAgICAgICAgIHZhciBtaW51dGVzID0gTWF0aC5mbG9vcih0aGlzLnRpbWVUYWtlbiAvIDYwKTtcbiAgICAgICAgICAgICAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IodGhpcy50aW1lVGFrZW4gJSA2MCk7XG4gICAgICAgICAgICAgICAgaWYgKG1pbnV0ZXMgPCAxMCkge1xuICAgICAgICAgICAgICAgICAgICBtaW51dGVzID0gXCIwXCIgKyBtaW51dGVzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2Vjb25kcyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlY29uZHMgPSBcIjBcIiArIHNlY29uZHM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRpbWVTdHJpbmcgPSBcIlRpbWUgdGFrZW46IFwiICsgbWludXRlcyArIFwiOlwiICsgc2Vjb25kcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudGltZXJDb250YWluZXIuaW5uZXJIVE1MID0gdGltZVN0cmluZztcbiAgICAgICAgICAgIHZhciB0aW1lVGlwcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0aW1lVGlwXCIpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPD0gdGltZVRpcHMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGltZVRpcHNbaV0udGl0bGUgPSB0aW1lU3RyaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzLnRpbWVyQ29udGFpbmVyKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbmNyZW1lbnQoKSB7XG4gICAgICAgIC8vIGlmIHJ1bm5pbmcgKG5vdCBwYXVzZWQpIGFuZCBub3QgdGFrZW5cbiAgICAgICAgaWYgKHRoaXMucnVubmluZyA9PT0gMSAmJiAhdGhpcy50YWtlbikge1xuICAgICAgICAgICAgc2V0VGltZW91dChcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdoZW4gYSBicm93c2VyIGxvc2VzIGZvY3VzLCBzZXRUaW1lb3V0IG1heSBub3QgYmUgY2FsbGVkIG9uIHRoZVxuICAgICAgICAgICAgICAgICAgICAvLyBzY2hlZHVsZSBleHBlY3RlZC4gIEJyb3dzZXJzIGFyZSBmcmVlIHRvIHNhdmUgcG93ZXIgYnkgbGVuZ3RoZW5pbmdcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGludGVydmFsIHRvIHNvbWUgbG9uZ2VyIHRpbWUuICBTbyB3ZSBjYW5ub3QganVzdCBzdWJ0cmFjdCAxXG4gICAgICAgICAgICAgICAgICAgIC8vIGZyb20gdGhlIHRpbWVMaW1pdCB3ZSBuZWVkIHRvIG1lYXN1cmUgdGhlIGVsYXBzZWQgdGltZSBmcm9tIHRoZSBsYXN0XG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgdG8gdGhlIGN1cnJlbnQgY2FsbCBhbmQgc3VidHJhY3QgdGhhdCBudW1iZXIgb2Ygc2Vjb25kcy5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubGltaXRlZFRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlJ3MgYSB0aW1lIGxpbWl0LCBjb3VudCBkb3duIHRvIDBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGltZUxpbWl0ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVMaW1pdCAtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcigoY3VycmVudFRpbWUgLSB0aGlzLmxhc3RUaW1lKSAvIDEwMDApO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRWxzZSBjb3VudCB1cCB0byBrZWVwIHRyYWNrIG9mIGhvdyBsb25nIGl0IHRvb2sgdG8gY29tcGxldGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGltZUxpbWl0ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVMaW1pdCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcigoY3VycmVudFRpbWUgLSB0aGlzLmxhc3RUaW1lKSAvIDEwMDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFRpbWUgPSBjdXJyZW50VGltZTtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICAgICAgICAgICAgICBlQm9va0NvbmZpZy5lbWFpbCArIFwiOlwiICsgdGhpcy5kaXZpZCArIFwiLXRpbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGltZUxpbWl0XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1RpbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudGltZUxpbWl0ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmNyZW1lbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJhbiBvdXQgb2YgdGltZVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzLnN0YXJ0QnRuKS5hdHRyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZDogXCJ0cnVlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcy5maW5pc2hCdXR0b24pLmF0dHIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiBcInRydWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ydW5uaW5nID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZG9uZSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudGFrZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRha2VuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlbWJlZCB0aGUgbWVzc2FnZSBpbiB0aGUgcGFnZSAtLSBhbiBhbGVydCBhY3R1YWxseSBwcmV2ZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBhbnN3ZXJzIGZyb20gYmVpbmcgc3VibWl0dGVkIGFuZCBpZiBhIHN0dWRlbnQgY2xvc2VzIHRoZWlyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGFwdG9wIHRoZW4gdGhlIGFuc3dlcnMgd2lsbCBub3QgYmUgc3VibWl0dGVkIGV2ZXIhICBFdmVuIHdoZW4gdGhleVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlb3BlbiB0aGUgbGFwdG9wIHRoZWlyIHNlc3Npb24gY29va2llIGlzIGxpa2VseSBpbnZhbGlkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtZXNzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3MuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJTb3JyeSBidXQgeW91IHJhbiBvdXQgb2YgdGltZS4gWW91ciBhbnN3ZXJzIGFyZSBiZWluZyBzdWJtaXR0ZWRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xEaXYuYXBwZW5kQ2hpbGQobWVzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5pc2hBc3Nlc3NtZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgMTAwMFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0eWxlRXhhbUVsZW1lbnRzKCkge1xuICAgICAgICAvLyBDaGVja3MgaWYgdGhpcyBleGFtIGhhcyBiZWVuIHRha2VuIGJlZm9yZVxuICAgICAgICAkKHRoaXMudGltZXJDb250YWluZXIpLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogXCI1MCVcIixcbiAgICAgICAgICAgIG1hcmdpbjogXCIwIGF1dG9cIixcbiAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIiNERkYwRDhcIixcbiAgICAgICAgICAgIFwidGV4dC1hbGlnblwiOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgYm9yZGVyOiBcIjJweCBzb2xpZCAjREZGMEQ4XCIsXG4gICAgICAgICAgICBcImJvcmRlci1yYWRpdXNcIjogXCIyNXB4XCIsXG4gICAgICAgIH0pO1xuICAgICAgICAkKHRoaXMuc2NvcmVEaXYpLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogXCI1MCVcIixcbiAgICAgICAgICAgIG1hcmdpbjogXCIwIGF1dG9cIixcbiAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIiNERkYwRDhcIixcbiAgICAgICAgICAgIFwidGV4dC1hbGlnblwiOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgYm9yZGVyOiBcIjJweCBzb2xpZCAjREZGMEQ4XCIsXG4gICAgICAgICAgICBcImJvcmRlci1yYWRpdXNcIjogXCIyNXB4XCIsXG4gICAgICAgIH0pO1xuICAgICAgICAkKFwiLnRvb2x0aXBUaW1lXCIpLmNzcyh7XG4gICAgICAgICAgICBtYXJnaW46IFwiMFwiLFxuICAgICAgICAgICAgcGFkZGluZzogXCIwXCIsXG4gICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogXCJibGFja1wiLFxuICAgICAgICAgICAgY29sb3I6IFwid2hpdGVcIixcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZmluaXNoQXNzZXNzbWVudCgpIHtcbiAgICAgICAgJChcIiNyZWxhdGlvbnMtbmV4dFwiKS5zaG93KCk7IC8vIHNob3cgdGhlIG5leHQgcGFnZSBidXR0b24gZm9yIG5vd1xuICAgICAgICAkKFwiI3JlbGF0aW9ucy1wcmV2XCIpLnNob3coKTsgLy8gc2hvdyB0aGUgcHJldmlvdXMgYnV0dG9uIGZvciBub3dcbiAgICAgICAgaWYgKCF0aGlzLnNob3dGZWVkYmFjaykge1xuICAgICAgICAgICAgLy8gYmplIC0gY2hhbmdlZCBmcm9tIHNob3dSZXN1bHRzXG4gICAgICAgICAgICAkKHRoaXMudGltZWREaXYpLmhpZGUoKTtcbiAgICAgICAgICAgICQodGhpcy5wYXVzZUJ0bikuaGlkZSgpO1xuICAgICAgICAgICAgJCh0aGlzLnRpbWVyQ29udGFpbmVyKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5maW5kVGltZVRha2VuKCk7XG4gICAgICAgIHRoaXMucnVubmluZyA9IDA7XG4gICAgICAgIHRoaXMuZG9uZSA9IDE7XG4gICAgICAgIHRoaXMudGFrZW4gPSAxO1xuICAgICAgICBhd2FpdCB0aGlzLmZpbmFsaXplUHJvYmxlbXMoKTtcbiAgICAgICAgdGhpcy5jaGVja1Njb3JlKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheVNjb3JlKCk7XG4gICAgICAgIHRoaXMuc3RvcmVTY29yZSgpO1xuICAgICAgICB0aGlzLmxvZ1Njb3JlKCk7XG4gICAgICAgICQodGhpcy5wYXVzZUJ0bikuYXR0cihcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICB0aGlzLmZpbmlzaEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICQod2luZG93KS5vZmYoXCJiZWZvcmV1bmxvYWRcIik7XG4gICAgICAgIC8vIHR1cm4gb2ZmIHRoZSBwYWdlaGlkZSBsaXN0ZW5lclxuICAgICAgICBsZXQgYXNzaWdubWVudF9pZCA9IHRoaXMuZGl2aWQ7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogZUJvb2tDb25maWcuYXBwICsgXCIvYXNzaWdubWVudHMvc3R1ZGVudF9hdXRvZ3JhZGVcIixcbiAgICAgICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJKU09OXCIsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50X2lkOiBhc3NpZ25tZW50X2lkLFxuICAgICAgICAgICAgICAgICAgICBpc190aW1lZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXRkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXRkYXRhLnN1Y2Nlc3MgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJldGRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkF1dG9ncmFkZXIgY29tcGxldGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCAyMDAwKTtcbiAgICB9XG5cbiAgICAvLyBmaW5hbGl6ZVByb2JsZW1zXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLVxuICAgIGFzeW5jIGZpbmFsaXplUHJvYmxlbXMoKSB7XG4gICAgICAgIC8vIEJlY2F1c2Ugd2UgaGF2ZSBzdWJtaXR0ZWQgZWFjaCBxdWVzdGlvbiBhcyB3ZSBuYXZpZ2F0ZSB3ZSBvbmx5IG5lZWQgdG9cbiAgICAgICAgLy8gc2VuZCB0aGUgZmluYWwgdmVyc2lvbiBvZiB0aGUgcXVlc3Rpb24gdGhlIHN0dWRlbnQgaXMgb24gd2hlbiB0aGV5IHByZXNzIHRoZVxuICAgICAgICAvLyBmaW5pc2ggZXhhbSBidXR0b24uXG5cbiAgICAgICAgdmFyIGN1cnJlbnRRdWVzdGlvbiA9XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheVt0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4XS5xdWVzdGlvbjtcbiAgICAgICAgYXdhaXQgY3VycmVudFF1ZXN0aW9uLmNoZWNrQ3VycmVudEFuc3dlcigpO1xuICAgICAgICBhd2FpdCBjdXJyZW50UXVlc3Rpb24ubG9nQ3VycmVudEFuc3dlcigpO1xuICAgICAgICBjdXJyZW50UXVlc3Rpb24ucmVuZGVyRmVlZGJhY2soKTtcbiAgICAgICAgY3VycmVudFF1ZXN0aW9uLmRpc2FibGVJbnRlcmFjdGlvbigpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50UXVlc3Rpb24gPSB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheVtpXTtcbiAgICAgICAgICAgIC8vIHNldCB0aGUgc3RhdGUgdG8gZm9ycmV2aWV3IHNvIHdlIGtub3cgdGhhdCBmZWVkYmFjayBtYXkgYmUgYXBwcm9wcmlhdGVcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVlc3Rpb24uc3RhdGUgIT09IFwiYnJva2VuX2V4YW1cIikge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWVzdGlvbi5zdGF0ZSA9IFwiZm9ycmV2aWV3XCI7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXN0aW9uLnF1ZXN0aW9uLmRpc2FibGVJbnRlcmFjdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnNob3dGZWVkYmFjaykge1xuICAgICAgICAgICAgdGhpcy5oaWRlVGltZWRGZWVkYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gcmVzdG9yZUFuc3dlcmVkUXVlc3Rpb25zXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcmVzdG9yZUFuc3dlcmVkUXVlc3Rpb25zKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudFF1ZXN0aW9uID0gdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbaV07XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXN0aW9uLnN0YXRlID09PSBcInByZXBhcmVkXCIpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVlc3Rpb24uc3RhdGUgPSBcImZvcnJldmlld1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gaGlkZVRpbWVkRmVlZGJhY2tcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLVxuICAgIGhpZGVUaW1lZEZlZWRiYWNrKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudFF1ZXN0aW9uID0gdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbaV0ucXVlc3Rpb247XG4gICAgICAgICAgICBjdXJyZW50UXVlc3Rpb24uaGlkZUZlZWRiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjaGVja1Njb3JlXG4gICAgLy8gLS0tLS0tLS0tLVxuICAgIC8vIFRoaXMgaXMgYSBzaW1wbGUgYWxsIG9yIG5vdGhpbmcgc2NvcmUgb2Ygb25lIHBvaW50IHBlciBxdWVzdGlvbiBmb3JcbiAgICAvLyB0aGF0IGluY2x1ZGVzIG91ciBiZXN0IGd1ZXNzIGlmIGEgcXVlc3Rpb24gd2FzIHNraXBwZWQuXG4gICAgY2hlY2tTY29yZSgpIHtcbiAgICAgICAgdGhpcy5jb3JyZWN0U3RyID0gXCJcIjtcbiAgICAgICAgdGhpcy5za2lwcGVkU3RyID0gXCJcIjtcbiAgICAgICAgdGhpcy5pbmNvcnJlY3RTdHIgPSBcIlwiO1xuICAgICAgICAvLyBHZXRzIHRoZSBzY29yZSBvZiBlYWNoIHByb2JsZW1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNvcnJlY3QgPVxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W2ldLnF1ZXN0aW9uLmNoZWNrQ29ycmVjdFRpbWVkKCk7XG4gICAgICAgICAgICBpZiAoY29ycmVjdCA9PSBcIlRcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NvcmUrKztcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3RTdHIgPSB0aGlzLmNvcnJlY3RTdHIgKyAoaSArIDEpICsgXCIsIFwiO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb3JyZWN0ID09IFwiRlwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmNvcnJlY3QrKztcbiAgICAgICAgICAgICAgICB0aGlzLmluY29ycmVjdFN0ciA9IHRoaXMuaW5jb3JyZWN0U3RyICsgKGkgKyAxKSArIFwiLCBcIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29ycmVjdCA9PT0gbnVsbCB8fCBjb3JyZWN0ID09PSBcIklcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuc2tpcHBlZCsrO1xuICAgICAgICAgICAgICAgIHRoaXMuc2tpcHBlZFN0ciA9IHRoaXMuc2tpcHBlZFN0ciArIChpICsgMSkgKyBcIiwgXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGlnbm9yZWQgcXVlc3Rpb247IGp1c3QgZG8gbm90aGluZ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHJlbW92ZSBleHRyYSBjb21tYSBhbmQgc3BhY2UgYXQgZW5kIGlmIGFueVxuICAgICAgICBpZiAodGhpcy5jb3JyZWN0U3RyLmxlbmd0aCA+IDApXG4gICAgICAgICAgICB0aGlzLmNvcnJlY3RTdHIgPSB0aGlzLmNvcnJlY3RTdHIuc3Vic3RyaW5nKFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0U3RyLmxlbmd0aCAtIDJcbiAgICAgICAgICAgICk7XG4gICAgICAgIGVsc2UgdGhpcy5jb3JyZWN0U3RyID0gXCJOb25lXCI7XG4gICAgICAgIGlmICh0aGlzLnNraXBwZWRTdHIubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHRoaXMuc2tpcHBlZFN0ciA9IHRoaXMuc2tpcHBlZFN0ci5zdWJzdHJpbmcoXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICB0aGlzLnNraXBwZWRTdHIubGVuZ3RoIC0gMlxuICAgICAgICAgICAgKTtcbiAgICAgICAgZWxzZSB0aGlzLnNraXBwZWRTdHIgPSBcIk5vbmVcIjtcbiAgICAgICAgaWYgKHRoaXMuaW5jb3JyZWN0U3RyLmxlbmd0aCA+IDApXG4gICAgICAgICAgICB0aGlzLmluY29ycmVjdFN0ciA9IHRoaXMuaW5jb3JyZWN0U3RyLnN1YnN0cmluZyhcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0U3RyLmxlbmd0aCAtIDJcbiAgICAgICAgICAgICk7XG4gICAgICAgIGVsc2UgdGhpcy5pbmNvcnJlY3RTdHIgPSBcIk5vbmVcIjtcbiAgICB9XG4gICAgZmluZFRpbWVUYWtlbigpIHtcbiAgICAgICAgaWYgKHRoaXMubGltaXRlZFRpbWUpIHtcbiAgICAgICAgICAgIHRoaXMudGltZVRha2VuID0gdGhpcy5zdGFydGluZ1RpbWUgLSB0aGlzLnRpbWVMaW1pdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGltZVRha2VuID0gdGhpcy50aW1lTGltaXQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RvcmVTY29yZSgpIHtcbiAgICAgICAgdmFyIHN0b3JhZ2VfYXJyID0gW107XG4gICAgICAgIHN0b3JhZ2VfYXJyLnB1c2goXG4gICAgICAgICAgICB0aGlzLnNjb3JlLFxuICAgICAgICAgICAgdGhpcy5jb3JyZWN0U3RyLFxuICAgICAgICAgICAgdGhpcy5pbmNvcnJlY3QsXG4gICAgICAgICAgICB0aGlzLmluY29ycmVjdFN0cixcbiAgICAgICAgICAgIHRoaXMuc2tpcHBlZCxcbiAgICAgICAgICAgIHRoaXMuc2tpcHBlZFN0cixcbiAgICAgICAgICAgIHRoaXMudGltZVRha2VuXG4gICAgICAgICk7XG4gICAgICAgIHZhciB0aW1lU3RhbXAgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB2YXIgc3RvcmFnZU9iaiA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIGFuc3dlcjogc3RvcmFnZV9hcnIsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IHRpbWVTdGFtcCxcbiAgICAgICAgfSk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCksIHN0b3JhZ2VPYmopO1xuICAgIH1cbiAgICAvLyBfYHRpbWVkIGV4YW0gZW5kcG9pbnQgcGFyYW1ldGVyc2BcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsb2dTY29yZSgpIHtcbiAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgZXZlbnQ6IFwidGltZWRFeGFtXCIsXG4gICAgICAgICAgICBhY3Q6IFwiZmluaXNoXCIsXG4gICAgICAgICAgICBkaXZfaWQ6IHRoaXMuZGl2aWQsXG4gICAgICAgICAgICBjb3JyZWN0OiB0aGlzLnNjb3JlLFxuICAgICAgICAgICAgaW5jb3JyZWN0OiB0aGlzLmluY29ycmVjdCxcbiAgICAgICAgICAgIHNraXBwZWQ6IHRoaXMuc2tpcHBlZCxcbiAgICAgICAgICAgIHRpbWVfdGFrZW46IHRoaXMudGltZVRha2VuLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgc2hvdWxkVXNlU2VydmVyKGRhdGEpIHtcbiAgICAgICAgLy8gV2Ugb3ZlcnJpZGUgdGhlIFJ1bmVzdG9uZUJhc2UgdmVyc2lvbiBiZWNhdXNlIHRoZXJlIGlzIG5vIFwiY29ycmVjdFwiIGF0dHJpYnV0ZSwgYW5kIHRoZXJlIGFyZSAyIHBvc3NpYmxlIGxvY2FsU3RvcmFnZSBzY2hlbWFzXG4gICAgICAgIC8vIC0td2UgYWxzbyB3YW50IHRvIGRlZmF1bHQgdG8gbG9jYWwgc3RvcmFnZSBiZWNhdXNlIGl0IGNvbnRhaW5zIG1vcmUgaW5mb3JtYXRpb24gc3BlY2lmaWNhbGx5IHdoaWNoIHF1ZXN0aW9ucyBhcmUgY29ycmVjdCwgaW5jb3JyZWN0LCBhbmQgc2tpcHBlZC5cbiAgICAgICAgdmFyIHN0b3JhZ2VEYXRlO1xuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRydWU7XG4gICAgICAgIHZhciBzdG9yYWdlT2JqID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG4gICAgICAgIGlmIChzdG9yYWdlT2JqID09PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBzdG9yZWREYXRhID0gSlNPTi5wYXJzZShzdG9yYWdlT2JqKS5hbnN3ZXI7XG4gICAgICAgICAgICBpZiAoc3RvcmVkRGF0YS5sZW5ndGggPT0gNCkge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5jb3JyZWN0ID09IHN0b3JlZERhdGFbMF0gJiZcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5pbmNvcnJlY3QgPT0gc3RvcmVkRGF0YVsxXSAmJlxuICAgICAgICAgICAgICAgICAgICBkYXRhLnNraXBwZWQgPT0gc3RvcmVkRGF0YVsyXSAmJlxuICAgICAgICAgICAgICAgICAgICBkYXRhLnRpbWVUYWtlbiA9PSBzdG9yZWREYXRhWzNdXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RvcmVkRGF0YS5sZW5ndGggPT0gNykge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5jb3JyZWN0ID09IHN0b3JlZERhdGFbMF0gJiZcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5pbmNvcnJlY3QgPT0gc3RvcmVkRGF0YVsyXSAmJlxuICAgICAgICAgICAgICAgICAgICBkYXRhLnNraXBwZWQgPT0gc3RvcmVkRGF0YVs0XSAmJlxuICAgICAgICAgICAgICAgICAgICBkYXRhLnRpbWVUYWtlbiA9PSBzdG9yZWREYXRhWzZdXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gSW4gdGhpcyBjYXNlLCBiZWNhdXNlIGxvY2FsIHN0b3JhZ2UgaGFzIG1vcmUgaW5mbywgd2Ugd2FudCB0byB1c2UgdGhhdCBpZiBpdCdzIGNvbnNpc3RlbnRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdG9yYWdlRGF0ZSA9IG5ldyBEYXRlKEpTT04ucGFyc2Uoc3RvcmFnZU9ialsxXSkudGltZXN0YW1wKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAvLyBlcnJvciB3aGlsZSBwYXJzaW5nOyBsaWtlbHkgZHVlIHRvIGJhZCB2YWx1ZSBzdG9yZWQgaW4gc3RvcmFnZVxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc2VydmVyRGF0ZSA9IG5ldyBEYXRlKGRhdGEudGltZXN0YW1wKTtcbiAgICAgICAgaWYgKHNlcnZlckRhdGUgPCBzdG9yYWdlRGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5sb2dTY29yZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNoZWNrTG9jYWxTdG9yYWdlKCkge1xuICAgICAgICB2YXIgbGVuID0gbG9jYWxTdG9yYWdlLmxlbmd0aDtcbiAgICAgICAgaWYgKGxlbiA+IDApIHtcbiAgICAgICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGFrZW4gPSAxO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzdG9yZUFuc3dlcnMoXCJcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGFrZW4gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50YWtlbiA9IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgcmVzdG9yZUFuc3dlcnMoZGF0YSkge1xuICAgICAgICB0aGlzLnRha2VuID0gMTtcbiAgICAgICAgdmFyIHRtcEFycjtcbiAgICAgICAgaWYgKGRhdGEgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdG1wQXJyID0gSlNPTi5wYXJzZShcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSlcbiAgICAgICAgICAgICAgICApLmFuc3dlcjtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIC8vIGVycm9yIHdoaWxlIHBhcnNpbmc7IGxpa2VseSBkdWUgdG8gYmFkIHZhbHVlIHN0b3JlZCBpbiBzdG9yYWdlXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgICAgICAgIHRoaXMudGFrZW4gPSAwO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFBhcnNlIHJlc3VsdHMgZnJvbSB0aGUgZGF0YWJhc2VcbiAgICAgICAgICAgIHRtcEFyciA9IFtcbiAgICAgICAgICAgICAgICBwYXJzZUludChkYXRhLmNvcnJlY3QpLFxuICAgICAgICAgICAgICAgIHBhcnNlSW50KGRhdGEuaW5jb3JyZWN0KSxcbiAgICAgICAgICAgICAgICBwYXJzZUludChkYXRhLnNraXBwZWQpLFxuICAgICAgICAgICAgICAgIHBhcnNlSW50KGRhdGEudGltZV90YWtlbiksXG4gICAgICAgICAgICAgICAgZGF0YS5yZXNldCxcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSh0bXBBcnIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0bXBBcnIubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIC8vIEV4YW0gd2FzIHByZXZpb3VzbHkgcmVzZXRcbiAgICAgICAgICAgIHRoaXMucmVzZXQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy50YWtlbiA9IDA7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRtcEFyci5sZW5ndGggPT0gNCkge1xuICAgICAgICAgICAgLy8gQWNjaWRlbnRhbCBSZWxvYWQgT1IgRGF0YWJhc2UgRW50cnlcbiAgICAgICAgICAgIHRoaXMuc2NvcmUgPSB0bXBBcnJbMF07XG4gICAgICAgICAgICB0aGlzLmluY29ycmVjdCA9IHRtcEFyclsxXTtcbiAgICAgICAgICAgIHRoaXMuc2tpcHBlZCA9IHRtcEFyclsyXTtcbiAgICAgICAgICAgIHRoaXMudGltZVRha2VuID0gdG1wQXJyWzNdO1xuICAgICAgICB9IGVsc2UgaWYgKHRtcEFyci5sZW5ndGggPT0gNSkge1xuICAgICAgICAgICAgdGhpcy5zY29yZSA9IHRtcEFyclswXTtcbiAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0ID0gdG1wQXJyWzFdO1xuICAgICAgICAgICAgdGhpcy5za2lwcGVkID0gdG1wQXJyWzJdO1xuICAgICAgICAgICAgdGhpcy50aW1lVGFrZW4gPSB0bXBBcnJbM107XG4gICAgICAgIH0gZWxzZSBpZiAodG1wQXJyLmxlbmd0aCA9PSA3KSB7XG4gICAgICAgICAgICAvLyBMb2FkZWQgQ29tcGxldGVkIEV4YW1cbiAgICAgICAgICAgIHRoaXMuc2NvcmUgPSB0bXBBcnJbMF07XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3RTdHIgPSB0bXBBcnJbMV07XG4gICAgICAgICAgICB0aGlzLmluY29ycmVjdCA9IHRtcEFyclsyXTtcbiAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0U3RyID0gdG1wQXJyWzNdO1xuICAgICAgICAgICAgdGhpcy5za2lwcGVkID0gdG1wQXJyWzRdO1xuICAgICAgICAgICAgdGhpcy5za2lwcGVkU3RyID0gdG1wQXJyWzVdO1xuICAgICAgICAgICAgdGhpcy50aW1lVGFrZW4gPSB0bXBBcnJbNl07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBTZXQgbG9jYWxTdG9yYWdlIGluIGNhc2Ugb2YgXCJhY2NpZGVudGFsXCIgcmVsb2FkXG4gICAgICAgICAgICB0aGlzLnNjb3JlID0gMDtcbiAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0ID0gMDtcbiAgICAgICAgICAgIHRoaXMuc2tpcHBlZCA9IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5Lmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMudGltZVRha2VuID0gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy50YWtlbikge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2tpcHBlZCA9PT0gdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93RmVlZGJhY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaGFuZGxlUHJldkFzc2Vzc21lbnQoKTtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCB0aGlzLnJlbmRlclRpbWVkUXVlc3Rpb24oKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5U2NvcmUoKTtcbiAgICAgICAgdGhpcy5zaG93VGltZSgpO1xuICAgIH1cbiAgICBzZXRMb2NhbFN0b3JhZ2UocGFyc2VkRGF0YSkge1xuICAgICAgICB2YXIgdGltZVN0YW1wID0gbmV3IERhdGUoKTtcbiAgICAgICAgdmFyIHN0b3JhZ2VPYmogPSB7XG4gICAgICAgICAgICBhbnN3ZXI6IHBhcnNlZERhdGEsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IHRpbWVTdGFtcCxcbiAgICAgICAgfTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZUtleSgpLFxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoc3RvcmFnZU9iailcbiAgICAgICAgKTtcbiAgICB9XG4gICAgZGlzcGxheVNjb3JlKCkge1xuICAgICAgICBpZiAodGhpcy5zaG93UmVzdWx0cykge1xuICAgICAgICAgICAgdmFyIHNjb3JlU3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBudW1RdWVzdGlvbnM7XG4gICAgICAgICAgICB2YXIgcGVyY2VudENvcnJlY3Q7XG4gICAgICAgICAgICAvLyBpZiB3ZSBoYXZlIHNvbWUgaW5mb3JtYXRpb25cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3RTdHIubGVuZ3RoID4gMCB8fFxuICAgICAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0U3RyLmxlbmd0aCA+IDAgfHxcbiAgICAgICAgICAgICAgICB0aGlzLnNraXBwZWRTdHIubGVuZ3RoID4gMFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgc2NvcmVTdHJpbmcgPSBgTnVtIENvcnJlY3Q6ICR7dGhpcy5zY29yZX0uIFF1ZXN0aW9uczogJHt0aGlzLmNvcnJlY3RTdHJ9PGJyPk51bSBXcm9uZzogJHt0aGlzLmluY29ycmVjdH0uIFF1ZXN0aW9uczogJHt0aGlzLmluY29ycmVjdFN0cn08YnI+TnVtIFNraXBwZWQ6ICR7dGhpcy5za2lwcGVkfS4gUXVlc3Rpb25zOiAke3RoaXMuc2tpcHBlZFN0cn08YnI+YDtcbiAgICAgICAgICAgICAgICBudW1RdWVzdGlvbnMgPSB0aGlzLnNjb3JlICsgdGhpcy5pbmNvcnJlY3QgKyB0aGlzLnNraXBwZWQ7XG4gICAgICAgICAgICAgICAgcGVyY2VudENvcnJlY3QgPSAodGhpcy5zY29yZSAvIG51bVF1ZXN0aW9ucykgKiAxMDA7XG4gICAgICAgICAgICAgICAgc2NvcmVTdHJpbmcgKz1cbiAgICAgICAgICAgICAgICAgICAgXCJQZXJjZW50IENvcnJlY3Q6IFwiICsgcGVyY2VudENvcnJlY3QudG9GaXhlZCgyKSArIFwiJVwiO1xuICAgICAgICAgICAgICAgICQodGhpcy5zY29yZURpdikuaHRtbChzY29yZVN0cmluZyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY29yZURpdi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY29yZVN0cmluZyA9IGBOdW0gQ29ycmVjdDogJHt0aGlzLnNjb3JlfTxicj5OdW0gV3Jvbmc6ICR7dGhpcy5pbmNvcnJlY3R9PGJyPk51bSBTa2lwcGVkOiAke3RoaXMuc2tpcHBlZH08YnI+YDtcbiAgICAgICAgICAgICAgICBudW1RdWVzdGlvbnMgPSB0aGlzLnNjb3JlICsgdGhpcy5pbmNvcnJlY3QgKyB0aGlzLnNraXBwZWQ7XG4gICAgICAgICAgICAgICAgcGVyY2VudENvcnJlY3QgPSAodGhpcy5zY29yZSAvIG51bVF1ZXN0aW9ucykgKiAxMDA7XG4gICAgICAgICAgICAgICAgc2NvcmVTdHJpbmcgKz1cbiAgICAgICAgICAgICAgICAgICAgXCJQZXJjZW50IENvcnJlY3Q6IFwiICsgcGVyY2VudENvcnJlY3QudG9GaXhlZCgyKSArIFwiJVwiO1xuICAgICAgICAgICAgICAgICQodGhpcy5zY29yZURpdikuaHRtbChzY29yZVN0cmluZyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY29yZURpdi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5oaWdobGlnaHROdW1iZXJlZExpc3QoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQodGhpcy5zY29yZURpdikuaHRtbChcbiAgICAgICAgICAgICAgICBcIlRoYW5rIHlvdSBmb3IgdGFraW5nIHRoZSBleGFtLiAgWW91ciBhbnN3ZXJzIGhhdmUgYmVlbiByZWNvcmRlZC5cIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuc2NvcmVEaXYuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBoaWdobGlnaHROdW1iZXJlZExpc3QoKSB7XG4gICAgICAgIHZhciBjb3JyZWN0Q291bnQgPSB0aGlzLmNvcnJlY3RTdHI7XG4gICAgICAgIHZhciBpbmNvcnJlY3RDb3VudCA9IHRoaXMuaW5jb3JyZWN0U3RyO1xuICAgICAgICB2YXIgc2tpcHBlZENvdW50ID0gdGhpcy5za2lwcGVkU3RyO1xuICAgICAgICBjb3JyZWN0Q291bnQgPSBjb3JyZWN0Q291bnQucmVwbGFjZSgvIC9nLCBcIlwiKS5zcGxpdChcIixcIik7XG4gICAgICAgIGluY29ycmVjdENvdW50ID0gaW5jb3JyZWN0Q291bnQucmVwbGFjZSgvIC9nLCBcIlwiKS5zcGxpdChcIixcIik7XG4gICAgICAgIHNraXBwZWRDb3VudCA9IHNraXBwZWRDb3VudC5yZXBsYWNlKC8gL2csIFwiXCIpLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgJChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbnVtYmVyZWRCdG5zID0gJChcInVsI3BhZ2VOdW1zID4gdWwgPiBsaVwiKTtcbiAgICAgICAgICAgIGlmIChudW1iZXJlZEJ0bnMuaGFzQ2xhc3MoXCJhbnN3ZXJlZFwiKSkge1xuICAgICAgICAgICAgICAgIG51bWJlcmVkQnRucy5yZW1vdmVDbGFzcyhcImFuc3dlcmVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3JyZWN0Q291bnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgdGVzdCA9IHBhcnNlSW50KGNvcnJlY3RDb3VudFtpXSkgLSAxO1xuICAgICAgICAgICAgICAgIG51bWJlcmVkQnRuc1xuICAgICAgICAgICAgICAgICAgICAuZXEocGFyc2VJbnQoY29ycmVjdENvdW50W2ldKSAtIDEpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhcImNvcnJlY3RDb3VudFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaW5jb3JyZWN0Q291bnQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBudW1iZXJlZEJ0bnNcbiAgICAgICAgICAgICAgICAgICAgLmVxKHBhcnNlSW50KGluY29ycmVjdENvdW50W2pdKSAtIDEpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhcImluY29ycmVjdENvdW50XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBza2lwcGVkQ291bnQubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICBudW1iZXJlZEJ0bnNcbiAgICAgICAgICAgICAgICAgICAgLmVxKHBhcnNlSW50KHNraXBwZWRDb3VudFtrXSkgLSAxKVxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoXCJza2lwcGVkQ291bnRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gRnVuY3Rpb24gdGhhdCBjYWxscyB0aGUgY29uc3RydWN0b3JzIG9uIHBhZ2UgbG9hZCA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuJChkb2N1bWVudCkub24oXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuICAgICQoXCJbZGF0YS1jb21wb25lbnQ9dGltZWRBc3Nlc3NtZW50XVwiKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW3RoaXMuaWRdID0gbmV3IFRpbWVkKHtcbiAgICAgICAgICAgIG9yaWc6IHRoaXMsXG4gICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMsXG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=