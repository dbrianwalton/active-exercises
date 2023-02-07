"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_quizly_js_quizly_js"],{

/***/ 16207:
/*!***************************************!*\
  !*** ./runestone/quizly/js/quizly.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Quizly),
/* harmony export */   "quizlyList": () => (/* binding */ quizlyList)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 2568);
/*
__author__ = Ralph Morelli
__date__ = 4/9/2021  */

/* **********
  This script renders the quizly HTML code and sets up functions
  to process the quiz when the user clicks on the quizly 'Check me'
  button.  

  It gets the data it needs from the Quizly node created by quizly.py
  during the runestone build step.

  NOTE: An entry for quizly.js script must be added to the webpack.config.js.
  ************** */




//import "../css/poll.css";

var DEBUG = false;

var quizlyList = {};

class Quizly extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; // Looks something like: {"orig":{"jQuery351095558298548049562":{"question_label":"1.1.2"}}}
        if (DEBUG)
            console.log(
                "DEBUG: Quizly constructor, opts=" + JSON.stringify(opts)
            );
        this.origElem = orig;
        this.divid = orig.id;
        if (DEBUG)
            console.log("DEBUG: Quizly constructor, divid= " + this.divid);
        this.resultsViewer = $(orig).data("results");
        this.getIFrameAndQuizname();
        this.renderQuizly(); //generates HTML
        // Checks localStorage to see if this quizly has already been completed by this user.
        //        this.checkQuizlyStorage();
        this.caption = "Quizly";
        this.addCaption("runestone");
    }

    // The main content of the quizly node is the iframe.
    getIFrameAndQuizname() {
        var html = $(this.origElem).html();
        var p1 = html.search("<iframe");
        var p2 = html.search("</iframe>");
        this.iframe = html.slice(p1, p2 + 8);
        if (DEBUG) console.log("DEBUG: getIFrame() html = " + html);
        if (DEBUG) console.log("DEBUG: getIFrame() iframe = " + this.iframe);
        p1 = html.search("quizname=");
        p2 = html.search("hints");
        this.quizname = html.slice(p1 + 9, p2 - 5); // Grab the quizname from iframe
        if (DEBUG) console.log("DEBUG quizname= ", this.quizname);
    }

    // Generates the HTML that the user interacts with
    renderQuizly() {
        var _this = this;
        if (DEBUG) console.log("DEBUG: renderQuizly()");
        this.containerDiv = document.createElement("div");
        //        this.quizlyFrame = document.createElement("iframe");
        this.containerDiv.id = this.divid;
        $(this.containerDiv).addClass(this.origElem.getAttribute("class"));
        $(this.containerDiv).html(this.iframe);
        $(this.origElem).replaceWith(this.containerDiv);
        if (DEBUG)
            console.log(
                "DEBUG: renderQuizly(), this = " + JSON.stringify(this)
            );
    }

    // Called from the exercise when user clicks submit button
    // Checks for the result, sets localstorage and submits to the server
    submitQuizly(result) {
        if (DEBUG)
            console.log(
                "DEBUG: submitQuizly result = " + JSON.stringify(result)
            );
        var answer = result["xml"];
        var correct = result["result"] == true ? "T" : "F";
        var loganswer = "answer:" + (correct == "T" ? "correct" : "no"); // backward compatible
        var eventInfo = {
            event: "quizly",
            act: loganswer,
            answer: answer,
            correct: correct,
            div_id: this.divid,
        };
        // Log the response to the database
        this.logBookEvent(eventInfo); // in bookfuncs.js
        if (DEBUG)
            console.log(
                "DEBUG: submitquizly logbookevent = " +
                    JSON.stringify(eventInfo)
            );
        // Log the fact that the user has attempted this quizly exercise to local storage
        localStorage.setItem(this.divid, "true");
    }
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/
$(document).on("runestone:login-complete", function () {
    $("[data-component=quizly").each(function (index) {
        try {
            var quizly = new Quizly({ orig: this });
            quizlyList[this.id] = quizly;
            if (DEBUG)
                console.log("DEBUG: Quizly rendering, this.id = " + this.id);
            setupCallback(quizly, quizly.quizname);
        } catch (err) {
            console.log(`Error rendering Quizly Exercise ${this.id}
                          Details: ${err}`);
            console.log(err.stack);
        }
    });
});

// Sets up a unique callback function on the window containing the quizly component
// The quizly param is a reference to this quizly object so that it can be use during callback.
// The quizname param is used to construct a unique callback function name
function setupCallback(quizly, quizname) {
    if (typeof window.component_factory === "undefined") {
        window.component_factory = {};
    }
    var fn_name = "quizly_" + quizname; // Unique function name
    window.component_factory[fn_name] = function (result) {
        quizly.submitQuizly(result);
    };
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3F1aXpseV9qc19xdWl6bHlfanMuYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRWE7O0FBRWdEO0FBQzdEOztBQUVBOztBQUVPOztBQUVRLHFCQUFxQixtRUFBYTtBQUNqRDtBQUNBO0FBQ0EsOEJBQThCLDBCQUEwQixRQUFRLCtCQUErQjtBQUMvRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9EO0FBQ3BEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlFQUF5RTtBQUN6RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyxZQUFZO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLDJEQUEyRDtBQUMzRCxxQ0FBcUMsSUFBSTtBQUN6QztBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3F1aXpseS9qcy9xdWl6bHkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbl9fYXV0aG9yX18gPSBSYWxwaCBNb3JlbGxpXG5fX2RhdGVfXyA9IDQvOS8yMDIxICAqL1xuXG4vKiAqKioqKioqKioqXG4gIFRoaXMgc2NyaXB0IHJlbmRlcnMgdGhlIHF1aXpseSBIVE1MIGNvZGUgYW5kIHNldHMgdXAgZnVuY3Rpb25zXG4gIHRvIHByb2Nlc3MgdGhlIHF1aXogd2hlbiB0aGUgdXNlciBjbGlja3Mgb24gdGhlIHF1aXpseSAnQ2hlY2sgbWUnXG4gIGJ1dHRvbi4gIFxuXG4gIEl0IGdldHMgdGhlIGRhdGEgaXQgbmVlZHMgZnJvbSB0aGUgUXVpemx5IG5vZGUgY3JlYXRlZCBieSBxdWl6bHkucHlcbiAgZHVyaW5nIHRoZSBydW5lc3RvbmUgYnVpbGQgc3RlcC5cblxuICBOT1RFOiBBbiBlbnRyeSBmb3IgcXVpemx5LmpzIHNjcmlwdCBtdXN0IGJlIGFkZGVkIHRvIHRoZSB3ZWJwYWNrLmNvbmZpZy5qcy5cbiAgKioqKioqKioqKioqKiogKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qc1wiO1xuLy9pbXBvcnQgXCIuLi9jc3MvcG9sbC5jc3NcIjtcblxudmFyIERFQlVHID0gZmFsc2U7XG5cbmV4cG9ydCB2YXIgcXVpemx5TGlzdCA9IHt9O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWl6bHkgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB2YXIgb3JpZyA9IG9wdHMub3JpZzsgLy8gTG9va3Mgc29tZXRoaW5nIGxpa2U6IHtcIm9yaWdcIjp7XCJqUXVlcnkzNTEwOTU1NTgyOTg1NDgwNDk1NjJcIjp7XCJxdWVzdGlvbl9sYWJlbFwiOlwiMS4xLjJcIn19fVxuICAgICAgICBpZiAoREVCVUcpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICBcIkRFQlVHOiBRdWl6bHkgY29uc3RydWN0b3IsIG9wdHM9XCIgKyBKU09OLnN0cmluZ2lmeShvcHRzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgdGhpcy5vcmlnRWxlbSA9IG9yaWc7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcmlnLmlkO1xuICAgICAgICBpZiAoREVCVUcpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRFQlVHOiBRdWl6bHkgY29uc3RydWN0b3IsIGRpdmlkPSBcIiArIHRoaXMuZGl2aWQpO1xuICAgICAgICB0aGlzLnJlc3VsdHNWaWV3ZXIgPSAkKG9yaWcpLmRhdGEoXCJyZXN1bHRzXCIpO1xuICAgICAgICB0aGlzLmdldElGcmFtZUFuZFF1aXpuYW1lKCk7XG4gICAgICAgIHRoaXMucmVuZGVyUXVpemx5KCk7IC8vZ2VuZXJhdGVzIEhUTUxcbiAgICAgICAgLy8gQ2hlY2tzIGxvY2FsU3RvcmFnZSB0byBzZWUgaWYgdGhpcyBxdWl6bHkgaGFzIGFscmVhZHkgYmVlbiBjb21wbGV0ZWQgYnkgdGhpcyB1c2VyLlxuICAgICAgICAvLyAgICAgICAgdGhpcy5jaGVja1F1aXpseVN0b3JhZ2UoKTtcbiAgICAgICAgdGhpcy5jYXB0aW9uID0gXCJRdWl6bHlcIjtcbiAgICAgICAgdGhpcy5hZGRDYXB0aW9uKFwicnVuZXN0b25lXCIpO1xuICAgIH1cblxuICAgIC8vIFRoZSBtYWluIGNvbnRlbnQgb2YgdGhlIHF1aXpseSBub2RlIGlzIHRoZSBpZnJhbWUuXG4gICAgZ2V0SUZyYW1lQW5kUXVpem5hbWUoKSB7XG4gICAgICAgIHZhciBodG1sID0gJCh0aGlzLm9yaWdFbGVtKS5odG1sKCk7XG4gICAgICAgIHZhciBwMSA9IGh0bWwuc2VhcmNoKFwiPGlmcmFtZVwiKTtcbiAgICAgICAgdmFyIHAyID0gaHRtbC5zZWFyY2goXCI8L2lmcmFtZT5cIik7XG4gICAgICAgIHRoaXMuaWZyYW1lID0gaHRtbC5zbGljZShwMSwgcDIgKyA4KTtcbiAgICAgICAgaWYgKERFQlVHKSBjb25zb2xlLmxvZyhcIkRFQlVHOiBnZXRJRnJhbWUoKSBodG1sID0gXCIgKyBodG1sKTtcbiAgICAgICAgaWYgKERFQlVHKSBjb25zb2xlLmxvZyhcIkRFQlVHOiBnZXRJRnJhbWUoKSBpZnJhbWUgPSBcIiArIHRoaXMuaWZyYW1lKTtcbiAgICAgICAgcDEgPSBodG1sLnNlYXJjaChcInF1aXpuYW1lPVwiKTtcbiAgICAgICAgcDIgPSBodG1sLnNlYXJjaChcImhpbnRzXCIpO1xuICAgICAgICB0aGlzLnF1aXpuYW1lID0gaHRtbC5zbGljZShwMSArIDksIHAyIC0gNSk7IC8vIEdyYWIgdGhlIHF1aXpuYW1lIGZyb20gaWZyYW1lXG4gICAgICAgIGlmIChERUJVRykgY29uc29sZS5sb2coXCJERUJVRyBxdWl6bmFtZT0gXCIsIHRoaXMucXVpem5hbWUpO1xuICAgIH1cblxuICAgIC8vIEdlbmVyYXRlcyB0aGUgSFRNTCB0aGF0IHRoZSB1c2VyIGludGVyYWN0cyB3aXRoXG4gICAgcmVuZGVyUXVpemx5KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoREVCVUcpIGNvbnNvbGUubG9nKFwiREVCVUc6IHJlbmRlclF1aXpseSgpXCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIC8vICAgICAgICB0aGlzLnF1aXpseUZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICAkKHRoaXMuY29udGFpbmVyRGl2KS5hZGRDbGFzcyh0aGlzLm9yaWdFbGVtLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpKTtcbiAgICAgICAgJCh0aGlzLmNvbnRhaW5lckRpdikuaHRtbCh0aGlzLmlmcmFtZSk7XG4gICAgICAgICQodGhpcy5vcmlnRWxlbSkucmVwbGFjZVdpdGgodGhpcy5jb250YWluZXJEaXYpO1xuICAgICAgICBpZiAoREVCVUcpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICBcIkRFQlVHOiByZW5kZXJRdWl6bHkoKSwgdGhpcyA9IFwiICsgSlNPTi5zdHJpbmdpZnkodGhpcylcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gQ2FsbGVkIGZyb20gdGhlIGV4ZXJjaXNlIHdoZW4gdXNlciBjbGlja3Mgc3VibWl0IGJ1dHRvblxuICAgIC8vIENoZWNrcyBmb3IgdGhlIHJlc3VsdCwgc2V0cyBsb2NhbHN0b3JhZ2UgYW5kIHN1Ym1pdHMgdG8gdGhlIHNlcnZlclxuICAgIHN1Ym1pdFF1aXpseShyZXN1bHQpIHtcbiAgICAgICAgaWYgKERFQlVHKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgXCJERUJVRzogc3VibWl0UXVpemx5IHJlc3VsdCA9IFwiICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgdmFyIGFuc3dlciA9IHJlc3VsdFtcInhtbFwiXTtcbiAgICAgICAgdmFyIGNvcnJlY3QgPSByZXN1bHRbXCJyZXN1bHRcIl0gPT0gdHJ1ZSA/IFwiVFwiIDogXCJGXCI7XG4gICAgICAgIHZhciBsb2dhbnN3ZXIgPSBcImFuc3dlcjpcIiArIChjb3JyZWN0ID09IFwiVFwiID8gXCJjb3JyZWN0XCIgOiBcIm5vXCIpOyAvLyBiYWNrd2FyZCBjb21wYXRpYmxlXG4gICAgICAgIHZhciBldmVudEluZm8gPSB7XG4gICAgICAgICAgICBldmVudDogXCJxdWl6bHlcIixcbiAgICAgICAgICAgIGFjdDogbG9nYW5zd2VyLFxuICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXIsXG4gICAgICAgICAgICBjb3JyZWN0OiBjb3JyZWN0LFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICB9O1xuICAgICAgICAvLyBMb2cgdGhlIHJlc3BvbnNlIHRvIHRoZSBkYXRhYmFzZVxuICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudChldmVudEluZm8pOyAvLyBpbiBib29rZnVuY3MuanNcbiAgICAgICAgaWYgKERFQlVHKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgXCJERUJVRzogc3VibWl0cXVpemx5IGxvZ2Jvb2tldmVudCA9IFwiICtcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZXZlbnRJbmZvKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgLy8gTG9nIHRoZSBmYWN0IHRoYXQgdGhlIHVzZXIgaGFzIGF0dGVtcHRlZCB0aGlzIHF1aXpseSBleGVyY2lzZSB0byBsb2NhbCBzdG9yYWdlXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuZGl2aWQsIFwidHJ1ZVwiKTtcbiAgICB9XG59XG5cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PSBGaW5kIHRoZSBjdXN0b20gSFRNTCB0YWdzIGFuZCA9PVxuPT0gICBleGVjdXRlIG91ciBjb2RlIG9uIHRoZW0gICAgPT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4kKGRvY3VtZW50KS5vbihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgJChcIltkYXRhLWNvbXBvbmVudD1xdWl6bHlcIikuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBxdWl6bHkgPSBuZXcgUXVpemx5KHsgb3JpZzogdGhpcyB9KTtcbiAgICAgICAgICAgIHF1aXpseUxpc3RbdGhpcy5pZF0gPSBxdWl6bHk7XG4gICAgICAgICAgICBpZiAoREVCVUcpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJERUJVRzogUXVpemx5IHJlbmRlcmluZywgdGhpcy5pZCA9IFwiICsgdGhpcy5pZCk7XG4gICAgICAgICAgICBzZXR1cENhbGxiYWNrKHF1aXpseSwgcXVpemx5LnF1aXpuYW1lKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgcmVuZGVyaW5nIFF1aXpseSBFeGVyY2lzZSAke3RoaXMuaWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIERldGFpbHM6ICR7ZXJyfWApO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyLnN0YWNrKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG5cbi8vIFNldHMgdXAgYSB1bmlxdWUgY2FsbGJhY2sgZnVuY3Rpb24gb24gdGhlIHdpbmRvdyBjb250YWluaW5nIHRoZSBxdWl6bHkgY29tcG9uZW50XG4vLyBUaGUgcXVpemx5IHBhcmFtIGlzIGEgcmVmZXJlbmNlIHRvIHRoaXMgcXVpemx5IG9iamVjdCBzbyB0aGF0IGl0IGNhbiBiZSB1c2UgZHVyaW5nIGNhbGxiYWNrLlxuLy8gVGhlIHF1aXpuYW1lIHBhcmFtIGlzIHVzZWQgdG8gY29uc3RydWN0IGEgdW5pcXVlIGNhbGxiYWNrIGZ1bmN0aW9uIG5hbWVcbmZ1bmN0aW9uIHNldHVwQ2FsbGJhY2socXVpemx5LCBxdWl6bmFtZSkge1xuICAgIGlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xuICAgIH1cbiAgICB2YXIgZm5fbmFtZSA9IFwicXVpemx5X1wiICsgcXVpem5hbWU7IC8vIFVuaXF1ZSBmdW5jdGlvbiBuYW1lXG4gICAgd2luZG93LmNvbXBvbmVudF9mYWN0b3J5W2ZuX25hbWVdID0gZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBxdWl6bHkuc3VibWl0UXVpemx5KHJlc3VsdCk7XG4gICAgfTtcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==