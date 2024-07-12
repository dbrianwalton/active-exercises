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
        this.containerDiv = opts.orig
        //this.addCaption("runestone");
        if (this.divid !== "fakeww-ww-rs") {
            this.checkServer("webwork", true);
        }
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
                answers = storedData.answer.split(":");
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

    processCurrentAnswers(data) {
        let correctCount = 0;
        let qCount = 0;
        let actString = "check:";
        this.answerObj = {}
        this.lastAnswerRaw = data;

        for (let k of Object.keys(data.rh_result.answers)) {
            qCount += 1;
            if (data.rh_result.answers[k].score == 1) {
                correctCount += 1;
            }
            this.answerObj[k] = `${data.rh_result.answers[k].original_student_ans}`
            actString += `actual:${data.rh_result.answers[k].original_student_ans}:expected:${data.rh_result.answers[k].correct_value}:`;
        }
        let pct = correctCount / qCount;
        // If this.percent is set, then runestonebase will transmit it as part of
        // the logBookEvent API.
        this.percent = pct;
        this.actString = actString + `correct:${correctCount}:count:${qCount}:pct:${pct}`;
        if (pct == 1.0) {
            this.correct = true;
        } else {
            this.correct = false;
        }

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

    checkCurrentAnswer() {

    }

}


//
// These are functions that get called in response to webwork generated events.
// submitting the work, or showing an answer.
function logWebWork(e, data) {
    if (eBookConfig.useRunestoneServices) {
        let wwObj = wwList[data.inputs_ref.problemUUID.replace("-ww-rs","")]
        if (wwObj) {
            wwObj.processCurrentAnswers(data);
            wwObj.logCurrentAnswer();
        } else {
            console.log(`Error: Could not find webwork object ${data.inputs_ref.problemUUID}`)
        }
    }
}

function logShowCorrect(e, data) {
    if (eBookConfig.useRunestoneServices) {
        let wwObj = wwList[data.inputs_ref.problemUUID.replace("-ww-rs","")]
        if (wwObj) {
            wwObj.logBookEvent({
                event: "webwork",
                div_id: data.inputs_ref.problemUUID,
                act: "show",
            });
        } else {
            console.log(`Error: Could not find webwork object ${data.inputs_ref.problemUUID}`)
        }
    }
}

async function getScores(sid, wwId) {

}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.webwork = function(opts) {
    return new WebWork();
};

$(function() {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3dlYndvcmtfanNfd2Vid29ya19qcy5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBMEQ7O0FBRTFELG9CQUFvQjs7O0FBR3BCLHNCQUFzQixnRUFBYTs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Qsd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsK0NBQStDO0FBQ2xGLG1DQUFtQywrQ0FBK0MsWUFBWSx3Q0FBd0M7QUFDdEk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxhQUFhLFNBQVMsT0FBTyxPQUFPLElBQUk7QUFDeEY7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTs7QUFFQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLGdFQUFnRSw0QkFBNEI7QUFDNUY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsVUFBVTtBQUNWLGdFQUFnRSw0QkFBNEI7QUFDNUY7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7O0FBR0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS93ZWJ3b3JrL2pzL3dlYndvcmsuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlXCI7XG5cbndpbmRvdy53d0xpc3QgPSB7fTsgLy8gTXVsdGlwbGUgQ2hvaWNlIGRpY3Rpb25hcnlcblxuXG5jbGFzcyBXZWJXb3JrIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tdWx0aXBsZWFuc3dlcnMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kaXZpZCA9IG9wdHMub3JpZy5pZDtcbiAgICAgICAgdGhpcy5jb3JyZWN0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5vcHRpb25hbCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFuc3dlckxpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5jb3JyZWN0TGlzdCA9IFtdO1xuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gbnVsbDtcbiAgICAgICAgdGhpcy5jYXB0aW9uID0gXCJXZWJXb3JrXCI7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2ID0gb3B0cy5vcmlnXG4gICAgICAgIC8vdGhpcy5hZGRDYXB0aW9uKFwicnVuZXN0b25lXCIpO1xuICAgICAgICBpZiAodGhpcy5kaXZpZCAhPT0gXCJmYWtld3ctd3ctcnNcIikge1xuICAgICAgICAgICAgdGhpcy5jaGVja1NlcnZlcihcIndlYndvcmtcIiwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXN0b3JlQW5zd2VycyhkYXRhKSB7XG4gICAgICAgIC8vIFJlc3RvcmUgYW5zd2VycyBmcm9tIHN0b3JhZ2UgcmV0cmlldmFsIGRvbmUgaW4gUnVuZXN0b25lQmFzZVxuICAgICAgICAvLyBzb21ldGltZXMgZGF0YS5hbnN3ZXIgY2FuIGJlIG51bGxcbiAgICAgICAgaWYgKCFkYXRhLmFuc3dlcikge1xuICAgICAgICAgICAgZGF0YS5hbnN3ZXIgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIC8vIGRhdGEuYW5zd2VycyBjb21lcyBmcm9tIHBvc3RncmVzcWwgYXMgYSBKU09OIGNvbHVtbiB0eXBlIHNvIG5vIG5lZWQgdG8gcGFyc2UgaXQuXG4gICAgICAgIHRoaXMuYW5zd2VycyA9IGRhdGEuYW5zd2VyO1xuICAgICAgICB0aGlzLmNvcnJlY3QgPSBkYXRhLmNvcnJlY3Q7XG4gICAgICAgIHRoaXMucGVyY2VudCA9IGRhdGEucGVyY2VudDtcbiAgICAgICAgdGhpcy5kZWNvcmF0ZVN0YXR1cygpO1xuICAgIH1cblxuICAgIGNoZWNrTG9jYWxTdG9yYWdlKCkge1xuICAgICAgICAvLyBSZXBvcHVsYXRlcyBNQ01BIHF1ZXN0aW9ucyB3aXRoIGEgdXNlcidzIHByZXZpb3VzIGFuc3dlcnMsXG4gICAgICAgIC8vIHdoaWNoIHdlcmUgc3RvcmVkIGludG8gbG9jYWwgc3RvcmFnZS5cbiAgICAgICAgdmFyIHN0b3JlZERhdGE7XG4gICAgICAgIHZhciBhbnN3ZXJzO1xuICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGVuID0gbG9jYWxTdG9yYWdlLmxlbmd0aDtcbiAgICAgICAgdmFyIGV4ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG5cbiAgICAgICAgaWYgKGV4ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHN0b3JlZERhdGEgPSBKU09OLnBhcnNlKGV4KTtcbiAgICAgICAgICAgICAgICBhbnN3ZXJzID0gc3RvcmVkRGF0YS5hbnN3ZXIuc3BsaXQoXCI6XCIpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgLy8gZXJyb3Igd2hpbGUgcGFyc2luZzsgbGlrZWx5IGR1ZSB0byBiYWQgdmFsdWUgc3RvcmVkIGluIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0TG9jYWxTdG9yYWdlKGRhdGEpIHtcbiAgICAgICAgdmFyIHRpbWVTdGFtcCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHZhciBzdG9yYWdlT2JqID0ge1xuICAgICAgICAgICAgYW5zd2VyOiBkYXRhLmFuc3dlcixcbiAgICAgICAgICAgIHRpbWVzdGFtcDogdGltZVN0YW1wLFxuICAgICAgICAgICAgY29ycmVjdDogZGF0YS5jb3JyZWN0LFxuICAgICAgICB9O1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlS2V5KCksXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeShzdG9yYWdlT2JqKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByb2Nlc3NDdXJyZW50QW5zd2VycyhkYXRhKSB7XG4gICAgICAgIGxldCBjb3JyZWN0Q291bnQgPSAwO1xuICAgICAgICBsZXQgcUNvdW50ID0gMDtcbiAgICAgICAgbGV0IGFjdFN0cmluZyA9IFwiY2hlY2s6XCI7XG4gICAgICAgIHRoaXMuYW5zd2VyT2JqID0ge31cbiAgICAgICAgdGhpcy5sYXN0QW5zd2VyUmF3ID0gZGF0YTtcblxuICAgICAgICBmb3IgKGxldCBrIG9mIE9iamVjdC5rZXlzKGRhdGEucmhfcmVzdWx0LmFuc3dlcnMpKSB7XG4gICAgICAgICAgICBxQ291bnQgKz0gMTtcbiAgICAgICAgICAgIGlmIChkYXRhLnJoX3Jlc3VsdC5hbnN3ZXJzW2tdLnNjb3JlID09IDEpIHtcbiAgICAgICAgICAgICAgICBjb3JyZWN0Q291bnQgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYW5zd2VyT2JqW2tdID0gYCR7ZGF0YS5yaF9yZXN1bHQuYW5zd2Vyc1trXS5vcmlnaW5hbF9zdHVkZW50X2Fuc31gXG4gICAgICAgICAgICBhY3RTdHJpbmcgKz0gYGFjdHVhbDoke2RhdGEucmhfcmVzdWx0LmFuc3dlcnNba10ub3JpZ2luYWxfc3R1ZGVudF9hbnN9OmV4cGVjdGVkOiR7ZGF0YS5yaF9yZXN1bHQuYW5zd2Vyc1trXS5jb3JyZWN0X3ZhbHVlfTpgO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwY3QgPSBjb3JyZWN0Q291bnQgLyBxQ291bnQ7XG4gICAgICAgIC8vIElmIHRoaXMucGVyY2VudCBpcyBzZXQsIHRoZW4gcnVuZXN0b25lYmFzZSB3aWxsIHRyYW5zbWl0IGl0IGFzIHBhcnQgb2ZcbiAgICAgICAgLy8gdGhlIGxvZ0Jvb2tFdmVudCBBUEkuXG4gICAgICAgIHRoaXMucGVyY2VudCA9IHBjdDtcbiAgICAgICAgdGhpcy5hY3RTdHJpbmcgPSBhY3RTdHJpbmcgKyBgY29ycmVjdDoke2NvcnJlY3RDb3VudH06Y291bnQ6JHtxQ291bnR9OnBjdDoke3BjdH1gO1xuICAgICAgICBpZiAocGN0ID09IDEuMCkge1xuICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBhc3luYyBsb2dDdXJyZW50QW5zd2VyKHNpZCkge1xuICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICBldmVudDogXCJ3ZWJ3b3JrXCIsXG4gICAgICAgICAgICBkaXZfaWQ6IHRoaXMuZGl2aWQsIC8vdG9kbyB1bm1hbmdsZSBwcm9ibGVtaWRcbiAgICAgICAgICAgIGFjdDogdGhpcy5hY3RTdHJpbmcsXG4gICAgICAgICAgICBjb3JyZWN0OiB0aGlzLmNvcnJlY3QsXG4gICAgICAgICAgICBhbnN3ZXI6IEpTT04uc3RyaW5naWZ5KHRoaXMuYW5zd2VyT2JqKSxcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBjaGVja0N1cnJlbnRBbnN3ZXIoKSB7XG5cbiAgICB9XG5cbn1cblxuXG4vL1xuLy8gVGhlc2UgYXJlIGZ1bmN0aW9ucyB0aGF0IGdldCBjYWxsZWQgaW4gcmVzcG9uc2UgdG8gd2Vid29yayBnZW5lcmF0ZWQgZXZlbnRzLlxuLy8gc3VibWl0dGluZyB0aGUgd29yaywgb3Igc2hvd2luZyBhbiBhbnN3ZXIuXG5mdW5jdGlvbiBsb2dXZWJXb3JrKGUsIGRhdGEpIHtcbiAgICBpZiAoZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgbGV0IHd3T2JqID0gd3dMaXN0W2RhdGEuaW5wdXRzX3JlZi5wcm9ibGVtVVVJRC5yZXBsYWNlKFwiLXd3LXJzXCIsXCJcIildXG4gICAgICAgIGlmICh3d09iaikge1xuICAgICAgICAgICAgd3dPYmoucHJvY2Vzc0N1cnJlbnRBbnN3ZXJzKGRhdGEpO1xuICAgICAgICAgICAgd3dPYmoubG9nQ3VycmVudEFuc3dlcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yOiBDb3VsZCBub3QgZmluZCB3ZWJ3b3JrIG9iamVjdCAke2RhdGEuaW5wdXRzX3JlZi5wcm9ibGVtVVVJRH1gKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBsb2dTaG93Q29ycmVjdChlLCBkYXRhKSB7XG4gICAgaWYgKGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgIGxldCB3d09iaiA9IHd3TGlzdFtkYXRhLmlucHV0c19yZWYucHJvYmxlbVVVSUQucmVwbGFjZShcIi13dy1yc1wiLFwiXCIpXVxuICAgICAgICBpZiAod3dPYmopIHtcbiAgICAgICAgICAgIHd3T2JqLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICAgICAgZXZlbnQ6IFwid2Vid29ya1wiLFxuICAgICAgICAgICAgICAgIGRpdl9pZDogZGF0YS5pbnB1dHNfcmVmLnByb2JsZW1VVUlELFxuICAgICAgICAgICAgICAgIGFjdDogXCJzaG93XCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvcjogQ291bGQgbm90IGZpbmQgd2Vid29yayBvYmplY3QgJHtkYXRhLmlucHV0c19yZWYucHJvYmxlbVVVSUR9YClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0U2NvcmVzKHNpZCwgd3dJZCkge1xuXG59XG5cbmlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID0ge307XG59XG5cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeS53ZWJ3b3JrID0gZnVuY3Rpb24ob3B0cykge1xuICAgIHJldHVybiBuZXcgV2ViV29yaygpO1xufTtcblxuJChmdW5jdGlvbigpIHtcbiAgICAkKFwiYm9keVwiKS5vbihcInJ1bmVzdG9uZV93d19jaGVja1wiLCBsb2dXZWJXb3JrKTtcbiAgICAkKFwiYm9keVwiKS5vbihcInJ1bmVzdG9uZV9zaG93X2NvcnJlY3RcIiwgbG9nU2hvd0NvcnJlY3QpO1xufSk7XG5cblxuJChkb2N1bWVudCkub24oXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuICAgICQoXCJbZGF0YS1jb21wb25lbnQ9d2Vid29ya11cIikuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgLy8gTUNcbiAgICAgICAgdmFyIG9wdHMgPSB7XG4gICAgICAgICAgICBvcmlnOiB0aGlzLFxuICAgICAgICAgICAgdXNlUnVuZXN0b25lU2VydmljZXM6IGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoJCh0aGlzKS5jbG9zZXN0KFwiW2RhdGEtY29tcG9uZW50PXRpbWVkQXNzZXNzbWVudF1cIikubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIC8vIElmIHRoaXMgZWxlbWVudCBleGlzdHMgd2l0aGluIGEgdGltZWQgY29tcG9uZW50LCBkb24ndCByZW5kZXIgaXQgaGVyZVxuICAgICAgICAgICAgd2luZG93Lnd3TGlzdFt0aGlzLmlkXSA9IG5ldyBXZWJXb3JrKG9wdHMpO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==