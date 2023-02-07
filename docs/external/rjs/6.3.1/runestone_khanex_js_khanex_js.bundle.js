"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_khanex_js_khanex_js"],{

/***/ 13435:
/*!***************************************!*\
  !*** ./runestone/khanex/js/khanex.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Khanex),
/* harmony export */   "khanexList": () => (/* binding */ khanexList)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 2568);
/*
__author__ = Ralph Morelli
__date__ = 5/4/2021  
*/

/* **********
  This script renders the khanex HTML code and sets up functions
  to process the exercise when the user clicks on the khanex 'Check Answer'
  button.  

  It gets the data it needs from the Khanex node created by khanex.py
  during the runestone build step.

  NOTE: An entry for khanex.js script must be added to the webpack.config.js.
  ************** */





var DEBUG = false;

var khanexList = {};

class Khanex extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; // Looks something like: {"orig":{"jQuery351095558298548049562":{"question_label":"1.1.2"}}}
        if (DEBUG)
            console.log(
                "DEBUG: Khanex constructor, opts=" + JSON.stringify(opts)
            );
        this.origElem = orig;
        this.divid = orig.id;
        this.resultsViewer = $(orig).data("results");
        this.getIFrameAndQuizname();
        this.renderKhanex(); //generates HTML
        // Checks localStorage to see if this khanex has already been completed by this user.
        //        this.checkKhanexStorage();
        this.caption = "Khanex";
        this.addCaption("runestone");
    }

    // The main content of the khanex node is the iframe.
    getIFrameAndQuizname() {
        var html = $(this.origElem).html();
        var p1 = html.search("<iframe");
        var p2 = html.search("</iframe>");
        this.iframe = html.slice(p1, p2 + 8);
        if (DEBUG) console.log("DEBUG: getQuestionText() html = " + html);
        if (DEBUG)
            console.log("DEBUG: getQuestionText() iframe = " + this.iframe);
        p1 = html.search("khanex/qs/");
        p2 = html.search(".html");
        this.quizname = html.slice(p1 + 10, p2); // Grab the quizname from iframe
        if (DEBUG) console.log("DEBUG quizname= ", this.quizname);
    }

    //generates the HTML that the user interacts with
    renderKhanex() {
        var _this = this;
        if (DEBUG) console.log("--------------------DEBUG: renderKhanex()");
        this.containerDiv = document.createElement("div");
        this.containerDiv.id = this.divid;
        $(this.containerDiv).html(this.iframe);
        $(this.origElem).replaceWith(this.containerDiv);
        if (DEBUG)
            console.log(
                "DEBUG: renderKhanex(), this = " + JSON.stringify(this)
            );
    }

    // This is what a khanex logging event looks like for a correct answer
    //  logging event {"event":"khanex","act":"answer:correct","answer":{"complete":1,"count_hints":0,"time_taken":87,"attempt_number":1,"attempt_content":"\"100011\"","sha1":"decimal-to-binary","seed":194953274,"problem_type":"0","review_mode":0},"correct":"T","div_id":"ex2","course":"mobilecsp","clientLoginStatus":false,"timezoneoffset":4}

    // Called when user clicks submit button
    // Checks for the result, sets localstorage and submits to the server
    submitKhanex(result) {
        if (DEBUG)
            console.log(
                "DEBUG: submitKhanex result = " + JSON.stringify(result)
            );
        var answer = result["complete"];
        if (DEBUG) console.log("DEBUG: submitKhanex answer = " + answer);
        var correct = result["complete"] == 1 ? "T" : "F";
        var loganswer = "answer:" + (correct == "T" ? "correct" : "no"); // backward compatible
        var eventInfo = {
            event: "khanex",
            act: loganswer,
            answer: result["attempt_content"],
            correct: correct,
            div_id: this.divid,
        };
        // log the response to the database
        this.logBookEvent(eventInfo); // in bookfuncs.js
        if (DEBUG)
            console.log(
                "DEBUG: submitkhanex logbookevent = " +
                    JSON.stringify(eventInfo)
            );
        // log the fact that the user has attempted this khanex exercise to local storage
        localStorage.setItem(this.divid, "true");
    }
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/
$(document).on("runestone:login-complete", function () {
    if (DEBUG) console.log("DEBUG: Khanex bind");
    $("[data-component=khanex").each(function (index) {
        if (DEBUG) console.log("DEBUG: Khanex rendering");
        try {
            var khanex = new Khanex({ orig: this });
            khanexList[this.id] = khanex;
            setupCallback(khanex, khanex.quizname);
        } catch (err) {
            console.log(`Error rendering Khanex Exercise ${this.id}
                          Details: ${err}`);
            console.log(err.stack);
        }
    });
});

// Sets up a call back function on the window containing the khanex component
// We need to pass a reference to this khanex object so that it can be use during callback.
function setupCallback(khanex, quizname) {
    if (typeof window.component_factory === "undefined") {
        window.component_factory = {};
    }
    var fn_name = "khanex_" + quizname; // Unique function name
    window.component_factory[fn_name] = function (result) {
        khanex.submitKhanex(result);
    };
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2toYW5leF9qc19raGFuZXhfanMuYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFYTs7QUFFZ0Q7O0FBRTdEOztBQUVPOztBQUVRLHFCQUFxQixtRUFBYTtBQUNqRDtBQUNBO0FBQ0EsOEJBQThCLDBCQUEwQixRQUFRLCtCQUErQjtBQUMvRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRDtBQUNqRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLGtEQUFrRCw4S0FBOEs7O0FBRXZQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUVBQXlFO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyxZQUFZO0FBQ2xEO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsMkRBQTJEO0FBQzNELHFDQUFxQyxJQUFJO0FBQ3pDO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2toYW5leC9qcy9raGFuZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbl9fYXV0aG9yX18gPSBSYWxwaCBNb3JlbGxpXG5fX2RhdGVfXyA9IDUvNC8yMDIxICBcbiovXG5cbi8qICoqKioqKioqKipcbiAgVGhpcyBzY3JpcHQgcmVuZGVycyB0aGUga2hhbmV4IEhUTUwgY29kZSBhbmQgc2V0cyB1cCBmdW5jdGlvbnNcbiAgdG8gcHJvY2VzcyB0aGUgZXhlcmNpc2Ugd2hlbiB0aGUgdXNlciBjbGlja3Mgb24gdGhlIGtoYW5leCAnQ2hlY2sgQW5zd2VyJ1xuICBidXR0b24uICBcblxuICBJdCBnZXRzIHRoZSBkYXRhIGl0IG5lZWRzIGZyb20gdGhlIEtoYW5leCBub2RlIGNyZWF0ZWQgYnkga2hhbmV4LnB5XG4gIGR1cmluZyB0aGUgcnVuZXN0b25lIGJ1aWxkIHN0ZXAuXG5cbiAgTk9URTogQW4gZW50cnkgZm9yIGtoYW5leC5qcyBzY3JpcHQgbXVzdCBiZSBhZGRlZCB0byB0aGUgd2VicGFjay5jb25maWcuanMuXG4gICoqKioqKioqKioqKioqICovXG5cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanNcIjtcblxudmFyIERFQlVHID0gZmFsc2U7XG5cbmV4cG9ydCB2YXIga2hhbmV4TGlzdCA9IHt9O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBLaGFuZXggZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB2YXIgb3JpZyA9IG9wdHMub3JpZzsgLy8gTG9va3Mgc29tZXRoaW5nIGxpa2U6IHtcIm9yaWdcIjp7XCJqUXVlcnkzNTEwOTU1NTgyOTg1NDgwNDk1NjJcIjp7XCJxdWVzdGlvbl9sYWJlbFwiOlwiMS4xLjJcIn19fVxuICAgICAgICBpZiAoREVCVUcpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICBcIkRFQlVHOiBLaGFuZXggY29uc3RydWN0b3IsIG9wdHM9XCIgKyBKU09OLnN0cmluZ2lmeShvcHRzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgdGhpcy5vcmlnRWxlbSA9IG9yaWc7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcmlnLmlkO1xuICAgICAgICB0aGlzLnJlc3VsdHNWaWV3ZXIgPSAkKG9yaWcpLmRhdGEoXCJyZXN1bHRzXCIpO1xuICAgICAgICB0aGlzLmdldElGcmFtZUFuZFF1aXpuYW1lKCk7XG4gICAgICAgIHRoaXMucmVuZGVyS2hhbmV4KCk7IC8vZ2VuZXJhdGVzIEhUTUxcbiAgICAgICAgLy8gQ2hlY2tzIGxvY2FsU3RvcmFnZSB0byBzZWUgaWYgdGhpcyBraGFuZXggaGFzIGFscmVhZHkgYmVlbiBjb21wbGV0ZWQgYnkgdGhpcyB1c2VyLlxuICAgICAgICAvLyAgICAgICAgdGhpcy5jaGVja0toYW5leFN0b3JhZ2UoKTtcbiAgICAgICAgdGhpcy5jYXB0aW9uID0gXCJLaGFuZXhcIjtcbiAgICAgICAgdGhpcy5hZGRDYXB0aW9uKFwicnVuZXN0b25lXCIpO1xuICAgIH1cblxuICAgIC8vIFRoZSBtYWluIGNvbnRlbnQgb2YgdGhlIGtoYW5leCBub2RlIGlzIHRoZSBpZnJhbWUuXG4gICAgZ2V0SUZyYW1lQW5kUXVpem5hbWUoKSB7XG4gICAgICAgIHZhciBodG1sID0gJCh0aGlzLm9yaWdFbGVtKS5odG1sKCk7XG4gICAgICAgIHZhciBwMSA9IGh0bWwuc2VhcmNoKFwiPGlmcmFtZVwiKTtcbiAgICAgICAgdmFyIHAyID0gaHRtbC5zZWFyY2goXCI8L2lmcmFtZT5cIik7XG4gICAgICAgIHRoaXMuaWZyYW1lID0gaHRtbC5zbGljZShwMSwgcDIgKyA4KTtcbiAgICAgICAgaWYgKERFQlVHKSBjb25zb2xlLmxvZyhcIkRFQlVHOiBnZXRRdWVzdGlvblRleHQoKSBodG1sID0gXCIgKyBodG1sKTtcbiAgICAgICAgaWYgKERFQlVHKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJERUJVRzogZ2V0UXVlc3Rpb25UZXh0KCkgaWZyYW1lID0gXCIgKyB0aGlzLmlmcmFtZSk7XG4gICAgICAgIHAxID0gaHRtbC5zZWFyY2goXCJraGFuZXgvcXMvXCIpO1xuICAgICAgICBwMiA9IGh0bWwuc2VhcmNoKFwiLmh0bWxcIik7XG4gICAgICAgIHRoaXMucXVpem5hbWUgPSBodG1sLnNsaWNlKHAxICsgMTAsIHAyKTsgLy8gR3JhYiB0aGUgcXVpem5hbWUgZnJvbSBpZnJhbWVcbiAgICAgICAgaWYgKERFQlVHKSBjb25zb2xlLmxvZyhcIkRFQlVHIHF1aXpuYW1lPSBcIiwgdGhpcy5xdWl6bmFtZSk7XG4gICAgfVxuXG4gICAgLy9nZW5lcmF0ZXMgdGhlIEhUTUwgdGhhdCB0aGUgdXNlciBpbnRlcmFjdHMgd2l0aFxuICAgIHJlbmRlcktoYW5leCgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKERFQlVHKSBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tREVCVUc6IHJlbmRlcktoYW5leCgpXCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgJCh0aGlzLmNvbnRhaW5lckRpdikuaHRtbCh0aGlzLmlmcmFtZSk7XG4gICAgICAgICQodGhpcy5vcmlnRWxlbSkucmVwbGFjZVdpdGgodGhpcy5jb250YWluZXJEaXYpO1xuICAgICAgICBpZiAoREVCVUcpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICBcIkRFQlVHOiByZW5kZXJLaGFuZXgoKSwgdGhpcyA9IFwiICsgSlNPTi5zdHJpbmdpZnkodGhpcylcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBpcyB3aGF0IGEga2hhbmV4IGxvZ2dpbmcgZXZlbnQgbG9va3MgbGlrZSBmb3IgYSBjb3JyZWN0IGFuc3dlclxuICAgIC8vICBsb2dnaW5nIGV2ZW50IHtcImV2ZW50XCI6XCJraGFuZXhcIixcImFjdFwiOlwiYW5zd2VyOmNvcnJlY3RcIixcImFuc3dlclwiOntcImNvbXBsZXRlXCI6MSxcImNvdW50X2hpbnRzXCI6MCxcInRpbWVfdGFrZW5cIjo4NyxcImF0dGVtcHRfbnVtYmVyXCI6MSxcImF0dGVtcHRfY29udGVudFwiOlwiXFxcIjEwMDAxMVxcXCJcIixcInNoYTFcIjpcImRlY2ltYWwtdG8tYmluYXJ5XCIsXCJzZWVkXCI6MTk0OTUzMjc0LFwicHJvYmxlbV90eXBlXCI6XCIwXCIsXCJyZXZpZXdfbW9kZVwiOjB9LFwiY29ycmVjdFwiOlwiVFwiLFwiZGl2X2lkXCI6XCJleDJcIixcImNvdXJzZVwiOlwibW9iaWxlY3NwXCIsXCJjbGllbnRMb2dpblN0YXR1c1wiOmZhbHNlLFwidGltZXpvbmVvZmZzZXRcIjo0fVxuXG4gICAgLy8gQ2FsbGVkIHdoZW4gdXNlciBjbGlja3Mgc3VibWl0IGJ1dHRvblxuICAgIC8vIENoZWNrcyBmb3IgdGhlIHJlc3VsdCwgc2V0cyBsb2NhbHN0b3JhZ2UgYW5kIHN1Ym1pdHMgdG8gdGhlIHNlcnZlclxuICAgIHN1Ym1pdEtoYW5leChyZXN1bHQpIHtcbiAgICAgICAgaWYgKERFQlVHKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgXCJERUJVRzogc3VibWl0S2hhbmV4IHJlc3VsdCA9IFwiICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgdmFyIGFuc3dlciA9IHJlc3VsdFtcImNvbXBsZXRlXCJdO1xuICAgICAgICBpZiAoREVCVUcpIGNvbnNvbGUubG9nKFwiREVCVUc6IHN1Ym1pdEtoYW5leCBhbnN3ZXIgPSBcIiArIGFuc3dlcik7XG4gICAgICAgIHZhciBjb3JyZWN0ID0gcmVzdWx0W1wiY29tcGxldGVcIl0gPT0gMSA/IFwiVFwiIDogXCJGXCI7XG4gICAgICAgIHZhciBsb2dhbnN3ZXIgPSBcImFuc3dlcjpcIiArIChjb3JyZWN0ID09IFwiVFwiID8gXCJjb3JyZWN0XCIgOiBcIm5vXCIpOyAvLyBiYWNrd2FyZCBjb21wYXRpYmxlXG4gICAgICAgIHZhciBldmVudEluZm8gPSB7XG4gICAgICAgICAgICBldmVudDogXCJraGFuZXhcIixcbiAgICAgICAgICAgIGFjdDogbG9nYW5zd2VyLFxuICAgICAgICAgICAgYW5zd2VyOiByZXN1bHRbXCJhdHRlbXB0X2NvbnRlbnRcIl0sXG4gICAgICAgICAgICBjb3JyZWN0OiBjb3JyZWN0LFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICB9O1xuICAgICAgICAvLyBsb2cgdGhlIHJlc3BvbnNlIHRvIHRoZSBkYXRhYmFzZVxuICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudChldmVudEluZm8pOyAvLyBpbiBib29rZnVuY3MuanNcbiAgICAgICAgaWYgKERFQlVHKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgXCJERUJVRzogc3VibWl0a2hhbmV4IGxvZ2Jvb2tldmVudCA9IFwiICtcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZXZlbnRJbmZvKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgLy8gbG9nIHRoZSBmYWN0IHRoYXQgdGhlIHVzZXIgaGFzIGF0dGVtcHRlZCB0aGlzIGtoYW5leCBleGVyY2lzZSB0byBsb2NhbCBzdG9yYWdlXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuZGl2aWQsIFwidHJ1ZVwiKTtcbiAgICB9XG59XG5cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PSBGaW5kIHRoZSBjdXN0b20gSFRNTCB0YWdzIGFuZCA9PVxuPT0gICBleGVjdXRlIG91ciBjb2RlIG9uIHRoZW0gICAgPT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4kKGRvY3VtZW50KS5vbihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKERFQlVHKSBjb25zb2xlLmxvZyhcIkRFQlVHOiBLaGFuZXggYmluZFwiKTtcbiAgICAkKFwiW2RhdGEtY29tcG9uZW50PWtoYW5leFwiKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICBpZiAoREVCVUcpIGNvbnNvbGUubG9nKFwiREVCVUc6IEtoYW5leCByZW5kZXJpbmdcIik7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIga2hhbmV4ID0gbmV3IEtoYW5leCh7IG9yaWc6IHRoaXMgfSk7XG4gICAgICAgICAgICBraGFuZXhMaXN0W3RoaXMuaWRdID0ga2hhbmV4O1xuICAgICAgICAgICAgc2V0dXBDYWxsYmFjayhraGFuZXgsIGtoYW5leC5xdWl6bmFtZSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHJlbmRlcmluZyBLaGFuZXggRXhlcmNpc2UgJHt0aGlzLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBEZXRhaWxzOiAke2Vycn1gKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVyci5zdGFjayk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuXG4vLyBTZXRzIHVwIGEgY2FsbCBiYWNrIGZ1bmN0aW9uIG9uIHRoZSB3aW5kb3cgY29udGFpbmluZyB0aGUga2hhbmV4IGNvbXBvbmVudFxuLy8gV2UgbmVlZCB0byBwYXNzIGEgcmVmZXJlbmNlIHRvIHRoaXMga2hhbmV4IG9iamVjdCBzbyB0aGF0IGl0IGNhbiBiZSB1c2UgZHVyaW5nIGNhbGxiYWNrLlxuZnVuY3Rpb24gc2V0dXBDYWxsYmFjayhraGFuZXgsIHF1aXpuYW1lKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID0ge307XG4gICAgfVxuICAgIHZhciBmbl9uYW1lID0gXCJraGFuZXhfXCIgKyBxdWl6bmFtZTsgLy8gVW5pcXVlIGZ1bmN0aW9uIG5hbWVcbiAgICB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnlbZm5fbmFtZV0gPSBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGtoYW5leC5zdWJtaXRLaGFuZXgocmVzdWx0KTtcbiAgICB9O1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9