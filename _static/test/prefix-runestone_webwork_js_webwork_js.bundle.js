"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_webwork_js_webwork_js"],{

/***/ 66142:
/*!*****************************************!*\
  !*** ./runestone/webwork/js/webwork.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase */ 2568);


window.wwList = {}; // Multiple Choice dictionary

class WebWork extends _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        this.useRunestoneServices = true;
        this.multipleanswers = false;
        this.divid = opts.orig.id;
        this.correct = null;
        this.optional = false;
        this.answerList = [];
        this.correctList = [];
        this.question = null;
        this.caption = "WebWork";
        this.containerDiv = opts.orig;
        this.answers = {};
        this.percent = 0;
        //this.addCaption("runestone");
        if (this.divid !== "fakeww-ww-rs") {
            this.checkServer("webwork", true);
        }
        window.wwList[this.divid] = this;
    }

    restoreAnswers(data) {
        // Restore answers from storage retrieval done in RunestoneBase
        // sometimes data.answer can be null
        if (!data.answer) {
            data.answer = "";
        }
        // data.answers comes from postgresql as a JSON column type so no need to parse it.

        this.answers = data.answer;
        this.correct = data.correct;
        this.percent = data.percent;
        console.log(
            `about to decorate the status of WW ${this.divid} ${this.correct}`
        );
        this.decorateStatus();
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
        var ex = localStorage.getItem(this.localStorageKey());

        if (ex !== null) {
            try {
                storedData = JSON.parse(ex);
                // Save the answers so that when the question is activated we can restore.
                this.answers = storedData.answer;
                this.correct = storedData.correct;
                this.percent = storedData.percent;
                // We still decorate the webwork question even if it is not active.
                this.decorateStatus();
            } catch (err) {
                // error while parsing; likely due to bad value stored in storage
                console.log(err.message);
                localStorage.removeItem(this.localStorageKey());
                return;
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

    // This is called when the runestone_ww_check event is triggered by the webwork problem
    // Note the webwork problem is in an iframe so we rely on this event and the data
    // compiled and passed along with the event to "grade" the answer.
    processCurrentAnswers(data) {
        let correctCount = 0;
        let qCount = 0;
        let actString = "check:";
        this.answerObj = {};
        this.lastAnswerRaw = data;
        this.answerObj.answers = {};
        this.answerObj.mqAnswers = {};
        // data.inputs_
        for (let k of Object.keys(data.rh_result.answers)) {
            qCount += 1;
            if (data.rh_result.answers[k].score == 1) {
                correctCount += 1;
            }
            // mostly grab original_student_ans, but grab student_value for MC exercises
            let student_ans = ['Value (parserRadioButtons)', 'Value (PopUp)', 'Value (CheckboxList)'].includes(data.rh_result.answers[k].type)
                ? data.rh_result.answers[k].student_value
                : data.rh_result.answers[k].original_student_ans;
            this.answerObj.answers[
                k
            ] = `${student_ans}`;
            let mqKey = `MaThQuIlL_${k}`;
            this.answerObj.mqAnswers[mqKey] = data.inputs_ref[mqKey];
            actString += `actual:${student_ans}:expected:${data.rh_result.answers[k].correct_value}:`;
        }
        let pct = correctCount / qCount;
        // If this.percent is set, then runestonebase will transmit it as part of
        // the logBookEvent API.
        this.percent = pct;
        this.actString =
            actString + `correct:${correctCount}:count:${qCount}:pct:${pct}`;
        if (pct == 1.0) {
            this.correct = true;
        } else {
            this.correct = false;
        }
        let ls = {};
        ls.answer = this.answerObj;
        ls.correct = this.correct;
        ls.percent = this.percent;
        this.setLocalStorage(ls);
        this.decorateStatus();
    }

    async logCurrentAnswer(sid) {
        this.logBookEvent({
            event: "webwork",
            div_id: this.divid, //todo unmangle problemid
            act: this.actString,
            correct: this.correct,
            answer: JSON.stringify(this.answerObj),
        });
    }

    checkCurrentAnswer() {}
}

//
// These are functions that get called in response to webwork generated events.
// submitting the work, or showing an answer.
function logWebWork(e, data) {
    if (eBookConfig.useRunestoneServices) {
        let wwObj = wwList[data.inputs_ref.problemUUID.replace("-ww-rs", "")];
        if (wwObj) {
            wwObj.processCurrentAnswers(data);
            wwObj.logCurrentAnswer();
        } else {
            console.log(
                `Error: Could not find webwork object ${data.inputs_ref.problemUUID}`
            );
        }
    }
}

function logShowCorrect(e, data) {
    if (eBookConfig.useRunestoneServices) {
        let wwObj = wwList[data.inputs_ref.problemUUID.replace("-ww-rs", "")];
        if (wwObj) {
            wwObj.logBookEvent({
                event: "webwork",
                div_id: data.inputs_ref.problemUUID,
                act: "show",
            });
        } else {
            console.log(
                `Error: Could not find webwork object ${data.inputs_ref.problemUUID}`
            );
        }
    }
}

async function getScores(sid, wwId) {}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.webwork = function (opts) {
    return new WebWork(opts);
};

$(function () {
    $("body").on("runestone_ww_check", logWebWork);
    $("body").on("runestone_show_correct", logShowCorrect);
});

$(document).on("runestone:login-complete", function () {
    $("[data-component=webwork]").each(function (index) {
        // MC
        var opts = {
            orig: this,
            useRunestoneServices: eBookConfig.useRunestoneServices,
        };
        if ($(this).closest("[data-component=timedAssessment]").length == 0) {
            // If this element exists within a timed component, don't render it here
            window.wwList[this.id] = new WebWork(opts);
        }
    });
});


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZV93ZWJ3b3JrX2pzX3dlYndvcmtfanMuYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQTBEOztBQUUxRCxvQkFBb0I7O0FBRXBCLHNCQUFzQixnRUFBYTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELFlBQVksRUFBRSxhQUFhO0FBQzdFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Qsd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixZQUFZO0FBQy9CLHFDQUFxQyxFQUFFO0FBQ3ZDO0FBQ0EsbUNBQW1DLFlBQVksWUFBWSx3Q0FBd0M7QUFDbkc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLGFBQWEsU0FBUyxPQUFPLE9BQU8sSUFBSTtBQUMzRTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLHdEQUF3RCw0QkFBNEI7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixVQUFVO0FBQ1Y7QUFDQSx3REFBd0QsNEJBQTRCO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3dlYndvcmsvanMvd2Vid29yay5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2VcIjtcblxud2luZG93Lnd3TGlzdCA9IHt9OyAvLyBNdWx0aXBsZSBDaG9pY2UgZGljdGlvbmFyeVxuXG5jbGFzcyBXZWJXb3JrIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcyA9IHRydWU7XG4gICAgICAgIHRoaXMubXVsdGlwbGVhbnN3ZXJzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcHRzLm9yaWcuaWQ7XG4gICAgICAgIHRoaXMuY29ycmVjdCA9IG51bGw7XG4gICAgICAgIHRoaXMub3B0aW9uYWwgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hbnN3ZXJMaXN0ID0gW107XG4gICAgICAgIHRoaXMuY29ycmVjdExpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuY2FwdGlvbiA9IFwiV2ViV29ya1wiO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IG9wdHMub3JpZztcbiAgICAgICAgdGhpcy5hbnN3ZXJzID0ge307XG4gICAgICAgIHRoaXMucGVyY2VudCA9IDA7XG4gICAgICAgIC8vdGhpcy5hZGRDYXB0aW9uKFwicnVuZXN0b25lXCIpO1xuICAgICAgICBpZiAodGhpcy5kaXZpZCAhPT0gXCJmYWtld3ctd3ctcnNcIikge1xuICAgICAgICAgICAgdGhpcy5jaGVja1NlcnZlcihcIndlYndvcmtcIiwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93Lnd3TGlzdFt0aGlzLmRpdmlkXSA9IHRoaXM7XG4gICAgfVxuXG4gICAgcmVzdG9yZUFuc3dlcnMoZGF0YSkge1xuICAgICAgICAvLyBSZXN0b3JlIGFuc3dlcnMgZnJvbSBzdG9yYWdlIHJldHJpZXZhbCBkb25lIGluIFJ1bmVzdG9uZUJhc2VcbiAgICAgICAgLy8gc29tZXRpbWVzIGRhdGEuYW5zd2VyIGNhbiBiZSBudWxsXG4gICAgICAgIGlmICghZGF0YS5hbnN3ZXIpIHtcbiAgICAgICAgICAgIGRhdGEuYW5zd2VyID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICAvLyBkYXRhLmFuc3dlcnMgY29tZXMgZnJvbSBwb3N0Z3Jlc3FsIGFzIGEgSlNPTiBjb2x1bW4gdHlwZSBzbyBubyBuZWVkIHRvIHBhcnNlIGl0LlxuXG4gICAgICAgIHRoaXMuYW5zd2VycyA9IGRhdGEuYW5zd2VyO1xuICAgICAgICB0aGlzLmNvcnJlY3QgPSBkYXRhLmNvcnJlY3Q7XG4gICAgICAgIHRoaXMucGVyY2VudCA9IGRhdGEucGVyY2VudDtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBgYWJvdXQgdG8gZGVjb3JhdGUgdGhlIHN0YXR1cyBvZiBXVyAke3RoaXMuZGl2aWR9ICR7dGhpcy5jb3JyZWN0fWBcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5kZWNvcmF0ZVN0YXR1cygpO1xuICAgIH1cblxuICAgIGNoZWNrTG9jYWxTdG9yYWdlKCkge1xuICAgICAgICAvLyBSZXBvcHVsYXRlcyBNQ01BIHF1ZXN0aW9ucyB3aXRoIGEgdXNlcidzIHByZXZpb3VzIGFuc3dlcnMsXG4gICAgICAgIC8vIHdoaWNoIHdlcmUgc3RvcmVkIGludG8gbG9jYWwgc3RvcmFnZS5cbiAgICAgICAgdmFyIHN0b3JlZERhdGE7XG4gICAgICAgIHZhciBhbnN3ZXJzO1xuICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGVuID0gbG9jYWxTdG9yYWdlLmxlbmd0aDtcbiAgICAgICAgdmFyIGV4ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG5cbiAgICAgICAgaWYgKGV4ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHN0b3JlZERhdGEgPSBKU09OLnBhcnNlKGV4KTtcbiAgICAgICAgICAgICAgICAvLyBTYXZlIHRoZSBhbnN3ZXJzIHNvIHRoYXQgd2hlbiB0aGUgcXVlc3Rpb24gaXMgYWN0aXZhdGVkIHdlIGNhbiByZXN0b3JlLlxuICAgICAgICAgICAgICAgIHRoaXMuYW5zd2VycyA9IHN0b3JlZERhdGEuYW5zd2VyO1xuICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IHN0b3JlZERhdGEuY29ycmVjdDtcbiAgICAgICAgICAgICAgICB0aGlzLnBlcmNlbnQgPSBzdG9yZWREYXRhLnBlcmNlbnQ7XG4gICAgICAgICAgICAgICAgLy8gV2Ugc3RpbGwgZGVjb3JhdGUgdGhlIHdlYndvcmsgcXVlc3Rpb24gZXZlbiBpZiBpdCBpcyBub3QgYWN0aXZlLlxuICAgICAgICAgICAgICAgIHRoaXMuZGVjb3JhdGVTdGF0dXMoKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIC8vIGVycm9yIHdoaWxlIHBhcnNpbmc7IGxpa2VseSBkdWUgdG8gYmFkIHZhbHVlIHN0b3JlZCBpbiBzdG9yYWdlXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldExvY2FsU3RvcmFnZShkYXRhKSB7XG4gICAgICAgIHZhciB0aW1lU3RhbXAgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB2YXIgc3RvcmFnZU9iaiA9IHtcbiAgICAgICAgICAgIGFuc3dlcjogZGF0YS5hbnN3ZXIsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IHRpbWVTdGFtcCxcbiAgICAgICAgICAgIGNvcnJlY3Q6IGRhdGEuY29ycmVjdCxcbiAgICAgICAgfTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZUtleSgpLFxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoc3RvcmFnZU9iailcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGlzIGNhbGxlZCB3aGVuIHRoZSBydW5lc3RvbmVfd3dfY2hlY2sgZXZlbnQgaXMgdHJpZ2dlcmVkIGJ5IHRoZSB3ZWJ3b3JrIHByb2JsZW1cbiAgICAvLyBOb3RlIHRoZSB3ZWJ3b3JrIHByb2JsZW0gaXMgaW4gYW4gaWZyYW1lIHNvIHdlIHJlbHkgb24gdGhpcyBldmVudCBhbmQgdGhlIGRhdGFcbiAgICAvLyBjb21waWxlZCBhbmQgcGFzc2VkIGFsb25nIHdpdGggdGhlIGV2ZW50IHRvIFwiZ3JhZGVcIiB0aGUgYW5zd2VyLlxuICAgIHByb2Nlc3NDdXJyZW50QW5zd2VycyhkYXRhKSB7XG4gICAgICAgIGxldCBjb3JyZWN0Q291bnQgPSAwO1xuICAgICAgICBsZXQgcUNvdW50ID0gMDtcbiAgICAgICAgbGV0IGFjdFN0cmluZyA9IFwiY2hlY2s6XCI7XG4gICAgICAgIHRoaXMuYW5zd2VyT2JqID0ge307XG4gICAgICAgIHRoaXMubGFzdEFuc3dlclJhdyA9IGRhdGE7XG4gICAgICAgIHRoaXMuYW5zd2VyT2JqLmFuc3dlcnMgPSB7fTtcbiAgICAgICAgdGhpcy5hbnN3ZXJPYmoubXFBbnN3ZXJzID0ge307XG4gICAgICAgIC8vIGRhdGEuaW5wdXRzX1xuICAgICAgICBmb3IgKGxldCBrIG9mIE9iamVjdC5rZXlzKGRhdGEucmhfcmVzdWx0LmFuc3dlcnMpKSB7XG4gICAgICAgICAgICBxQ291bnQgKz0gMTtcbiAgICAgICAgICAgIGlmIChkYXRhLnJoX3Jlc3VsdC5hbnN3ZXJzW2tdLnNjb3JlID09IDEpIHtcbiAgICAgICAgICAgICAgICBjb3JyZWN0Q291bnQgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIG1vc3RseSBncmFiIG9yaWdpbmFsX3N0dWRlbnRfYW5zLCBidXQgZ3JhYiBzdHVkZW50X3ZhbHVlIGZvciBNQyBleGVyY2lzZXNcbiAgICAgICAgICAgIGxldCBzdHVkZW50X2FucyA9IFsnVmFsdWUgKHBhcnNlclJhZGlvQnV0dG9ucyknLCAnVmFsdWUgKFBvcFVwKScsICdWYWx1ZSAoQ2hlY2tib3hMaXN0KSddLmluY2x1ZGVzKGRhdGEucmhfcmVzdWx0LmFuc3dlcnNba10udHlwZSlcbiAgICAgICAgICAgICAgICA/IGRhdGEucmhfcmVzdWx0LmFuc3dlcnNba10uc3R1ZGVudF92YWx1ZVxuICAgICAgICAgICAgICAgIDogZGF0YS5yaF9yZXN1bHQuYW5zd2Vyc1trXS5vcmlnaW5hbF9zdHVkZW50X2FucztcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyT2JqLmFuc3dlcnNbXG4gICAgICAgICAgICAgICAga1xuICAgICAgICAgICAgXSA9IGAke3N0dWRlbnRfYW5zfWA7XG4gICAgICAgICAgICBsZXQgbXFLZXkgPSBgTWFUaFF1SWxMXyR7a31gO1xuICAgICAgICAgICAgdGhpcy5hbnN3ZXJPYmoubXFBbnN3ZXJzW21xS2V5XSA9IGRhdGEuaW5wdXRzX3JlZlttcUtleV07XG4gICAgICAgICAgICBhY3RTdHJpbmcgKz0gYGFjdHVhbDoke3N0dWRlbnRfYW5zfTpleHBlY3RlZDoke2RhdGEucmhfcmVzdWx0LmFuc3dlcnNba10uY29ycmVjdF92YWx1ZX06YDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcGN0ID0gY29ycmVjdENvdW50IC8gcUNvdW50O1xuICAgICAgICAvLyBJZiB0aGlzLnBlcmNlbnQgaXMgc2V0LCB0aGVuIHJ1bmVzdG9uZWJhc2Ugd2lsbCB0cmFuc21pdCBpdCBhcyBwYXJ0IG9mXG4gICAgICAgIC8vIHRoZSBsb2dCb29rRXZlbnQgQVBJLlxuICAgICAgICB0aGlzLnBlcmNlbnQgPSBwY3Q7XG4gICAgICAgIHRoaXMuYWN0U3RyaW5nID1cbiAgICAgICAgICAgIGFjdFN0cmluZyArIGBjb3JyZWN0OiR7Y29ycmVjdENvdW50fTpjb3VudDoke3FDb3VudH06cGN0OiR7cGN0fWA7XG4gICAgICAgIGlmIChwY3QgPT0gMS4wKSB7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGxzID0ge307XG4gICAgICAgIGxzLmFuc3dlciA9IHRoaXMuYW5zd2VyT2JqO1xuICAgICAgICBscy5jb3JyZWN0ID0gdGhpcy5jb3JyZWN0O1xuICAgICAgICBscy5wZXJjZW50ID0gdGhpcy5wZXJjZW50O1xuICAgICAgICB0aGlzLnNldExvY2FsU3RvcmFnZShscyk7XG4gICAgICAgIHRoaXMuZGVjb3JhdGVTdGF0dXMoKTtcbiAgICB9XG5cbiAgICBhc3luYyBsb2dDdXJyZW50QW5zd2VyKHNpZCkge1xuICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICBldmVudDogXCJ3ZWJ3b3JrXCIsXG4gICAgICAgICAgICBkaXZfaWQ6IHRoaXMuZGl2aWQsIC8vdG9kbyB1bm1hbmdsZSBwcm9ibGVtaWRcbiAgICAgICAgICAgIGFjdDogdGhpcy5hY3RTdHJpbmcsXG4gICAgICAgICAgICBjb3JyZWN0OiB0aGlzLmNvcnJlY3QsXG4gICAgICAgICAgICBhbnN3ZXI6IEpTT04uc3RyaW5naWZ5KHRoaXMuYW5zd2VyT2JqKSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY2hlY2tDdXJyZW50QW5zd2VyKCkge31cbn1cblxuLy9cbi8vIFRoZXNlIGFyZSBmdW5jdGlvbnMgdGhhdCBnZXQgY2FsbGVkIGluIHJlc3BvbnNlIHRvIHdlYndvcmsgZ2VuZXJhdGVkIGV2ZW50cy5cbi8vIHN1Ym1pdHRpbmcgdGhlIHdvcmssIG9yIHNob3dpbmcgYW4gYW5zd2VyLlxuZnVuY3Rpb24gbG9nV2ViV29yayhlLCBkYXRhKSB7XG4gICAgaWYgKGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgIGxldCB3d09iaiA9IHd3TGlzdFtkYXRhLmlucHV0c19yZWYucHJvYmxlbVVVSUQucmVwbGFjZShcIi13dy1yc1wiLCBcIlwiKV07XG4gICAgICAgIGlmICh3d09iaikge1xuICAgICAgICAgICAgd3dPYmoucHJvY2Vzc0N1cnJlbnRBbnN3ZXJzKGRhdGEpO1xuICAgICAgICAgICAgd3dPYmoubG9nQ3VycmVudEFuc3dlcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgYEVycm9yOiBDb3VsZCBub3QgZmluZCB3ZWJ3b3JrIG9iamVjdCAke2RhdGEuaW5wdXRzX3JlZi5wcm9ibGVtVVVJRH1gXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBsb2dTaG93Q29ycmVjdChlLCBkYXRhKSB7XG4gICAgaWYgKGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgIGxldCB3d09iaiA9IHd3TGlzdFtkYXRhLmlucHV0c19yZWYucHJvYmxlbVVVSUQucmVwbGFjZShcIi13dy1yc1wiLCBcIlwiKV07XG4gICAgICAgIGlmICh3d09iaikge1xuICAgICAgICAgICAgd3dPYmoubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgICAgICBldmVudDogXCJ3ZWJ3b3JrXCIsXG4gICAgICAgICAgICAgICAgZGl2X2lkOiBkYXRhLmlucHV0c19yZWYucHJvYmxlbVVVSUQsXG4gICAgICAgICAgICAgICAgYWN0OiBcInNob3dcIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgYEVycm9yOiBDb3VsZCBub3QgZmluZCB3ZWJ3b3JrIG9iamVjdCAke2RhdGEuaW5wdXRzX3JlZi5wcm9ibGVtVVVJRH1gXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRTY29yZXMoc2lkLCB3d0lkKSB7fVxuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxuXG53aW5kb3cuY29tcG9uZW50X2ZhY3Rvcnkud2Vid29yayA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgcmV0dXJuIG5ldyBXZWJXb3JrKG9wdHMpO1xufTtcblxuJChmdW5jdGlvbiAoKSB7XG4gICAgJChcImJvZHlcIikub24oXCJydW5lc3RvbmVfd3dfY2hlY2tcIiwgbG9nV2ViV29yayk7XG4gICAgJChcImJvZHlcIikub24oXCJydW5lc3RvbmVfc2hvd19jb3JyZWN0XCIsIGxvZ1Nob3dDb3JyZWN0KTtcbn0pO1xuXG4kKGRvY3VtZW50KS5vbihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgJChcIltkYXRhLWNvbXBvbmVudD13ZWJ3b3JrXVwiKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAvLyBNQ1xuICAgICAgICB2YXIgb3B0cyA9IHtcbiAgICAgICAgICAgIG9yaWc6IHRoaXMsXG4gICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMsXG4gICAgICAgIH07XG4gICAgICAgIGlmICgkKHRoaXMpLmNsb3Nlc3QoXCJbZGF0YS1jb21wb25lbnQ9dGltZWRBc3Nlc3NtZW50XVwiKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBlbGVtZW50IGV4aXN0cyB3aXRoaW4gYSB0aW1lZCBjb21wb25lbnQsIGRvbid0IHJlbmRlciBpdCBoZXJlXG4gICAgICAgICAgICB3aW5kb3cud3dMaXN0W3RoaXMuaWRdID0gbmV3IFdlYldvcmsob3B0cyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9