"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_poll_js_poll_js"],{

/***/ 55475:
/*!*************************************!*\
  !*** ./runestone/poll/css/poll.css ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 37350:
/*!***********************************!*\
  !*** ./runestone/poll/js/poll.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Poll),
/* harmony export */   "pollList": () => (/* binding */ pollList)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase */ 2568);
/* harmony import */ var _css_poll_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/poll.css */ 55475);
/*
__author__ = Kirby Olson
__date__ = 6/12/2015  */





var pollList = {};

class Poll extends _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; //entire <p> element
        this.origElem = orig;
        this.divid = orig.id;
        this.children = this.origElem.childNodes;
        this.optionList = [];
        this.optsArray = [];
        this.comment = false;
        if ($(this.origElem).is("[data-comment]")) {
            this.comment = true;
        }
        this.resultsViewer = $(orig).data("results");
        this.getQuestionText();
        this.getOptionText(); //populates optionList
        this.renderPoll(); //generates HTML
        // Checks localStorage to see if this poll has already been completed by this user.
        this.checkPollStorage();
        this.caption = "Poll";
        this.addCaption("runestone");
    }
    getQuestionText() {
        //finds the text inside the parent tag, but before the first <li> tag and sets it as the question
        var _this = this;
        var firstAnswer;
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].tagName == "LI") {
                firstAnswer = _this.children[i];
                break;
            }
        }
        var delimiter = firstAnswer.outerHTML;
        var fulltext = $(this.origElem).html();
        var temp = fulltext.split(delimiter);
        this.question = temp[0];
    }
    getOptionText() {
        //Gets the text from each <li> tag and places it in this.optionList
        var _this = this;
        for (var i = 0; i < this.children.length; i++) {
            if (_this.children[i].tagName == "LI") {
                _this.optionList.push($(_this.children[i]).text());
            }
        }
    }
    renderPoll() {
        //generates the HTML that the user interacts with
        var _this = this;
        this.containerDiv = document.createElement("div");
        this.pollForm = document.createElement("form");
        this.resultsDiv = document.createElement("div");
        this.containerDiv.id = this.divid;
        $(this.containerDiv).addClass(this.origElem.getAttribute("class"));
        $(this.pollForm).html(
            `<span style='font-size: Large'>${this.question}</span>`
        );
        $(this.pollForm).attr({
            id: this.divid + "_form",
            method: "get",
            action: "",
            onsubmit: "return false;",
        });
        this.pollForm.appendChild(document.createElement("br"));
        for (var i = 0; i < this.optionList.length; i++) {
            var radio = document.createElement("input");
            var tmpid = _this.divid + "_opt_" + i;
            $(radio).attr({
                id: tmpid,
                name: this.divid + "_group1",
                type: "radio",
                value: i,
            });
            $(radio).click(this.submitPoll.bind(this));
            var label = document.createElement("label");
            $(label).attr("for", tmpid);
            $(label).text(this.optionList[i]);
            this.pollForm.appendChild(radio);
            this.optsArray.push(radio);
            this.pollForm.appendChild(label);
            this.pollForm.appendChild(document.createElement("br"));
        }
        if (this.comment) {
            this.renderTextField();
        }
        this.resultsDiv.id = this.divid + "_results";
        this.containerDiv.appendChild(this.pollForm);
        this.containerDiv.appendChild(this.resultsDiv);
        $(this.origElem).replaceWith(this.containerDiv);
    }
    renderTextField() {
        this.textfield = document.createElement("input");
        this.textfield.type = "text";
        $(this.textfield).addClass("form-control");
        this.textfield.style.width = "300px";
        this.textfield.name = this.divid + "_comment";
        this.textfield.placeholder = "Any comments?";
        this.pollForm.appendChild(this.textfield);
        this.pollForm.appendChild(document.createElement("br"));
    }
    submitPoll() {
        //checks the poll, sets localstorage and submits to the server
        var poll_val = null;
        for (var i = 0; i < this.optsArray.length; i++) {
            if (this.optsArray[i].checked) {
                poll_val = this.optsArray[i].value;
                break;
            }
        }
        if (poll_val === null) return;
        var comment_val = "";
        if (this.comment) {
            comment_val = this.textfield.value;
        }
        var act = "";
        if (comment_val !== "") {
            act = poll_val + ":" + comment_val;
        } else {
            act = poll_val;
        }
        var eventInfo = { event: "poll", act: act, div_id: this.divid };
        // log the response to the database
        this.logBookEvent(eventInfo); // in bookfuncs.js
        // log the fact that the user has answered the poll to local storage
        localStorage.setItem(this.divid, "true");
        if (!document.getElementById(`${this.divid}_sent`)) {
            $(this.pollForm).append(
                `<span id=${this.divid}_sent><strong>Thanks, your response has been recorded</strong></span>`
            );
        } else {
            $(`#${this.divid}_sent`).html(
                "<strong>Only Your last reponse is recorded</strong>"
            );
        }
        // show the results of the poll
        if (this.resultsViewer === "all") {
            var data = {};
            data.div_id = this.divid;
            data.course = eBookConfig.course;
            jQuery.get(
                `${eBookConfig.new_server_prefix}/assessment/getpollresults`,
                data,
                this.showPollResults
            );
        }
    }
    showPollResults(results) {
        //displays the results returned by the server
        results = results.detail;
        var total = results["total"];
        var optCounts = results["opt_counts"];
        var div_id = results["div_id"];
        var my_vote = results["my_vote"];
        // restore current users vote
        if (my_vote > -1) {
            this.optsArray[my_vote].checked = "checked";
        }
        // show results summary if appropriate
        if (
            (this.resultsViewer === "all" &&
                localStorage.getItem(this.divid === "true")) ||
            eBookConfig.isInstructor
        ) {
            $(this.resultsDiv).html(
                `<b>Results:</b> ${total} responses <br><br>`
            );
            var list = $(document.createElement("div"));
            $(list).addClass("results-container");
            for (var i = 0; i < this.optionList.length; i++) {
                var count;
                var percent;
                if (optCounts[i] > 0) {
                    count = optCounts[i];
                    percent = (count / total) * 100;
                } else {
                    count = 0;
                    percent = 0;
                }
                var text = count + " (" + Math.round(10 * percent) / 10 + "%)"; // round percent to 10ths
                var html;
                if (percent > 10) {
                    html =
                        `<div class="progresscounter">${i + 1}. </div>` +
                        "<div class='progress'>" +
                        "<div class='progress-bar progress-bar-success'" +
                        `style="width: ${percent}%; min-width: 2em;">` +
                        "<span class='poll-text'>" +
                        text +
                        "</span></div></div>";
                } else {
                    html =
                        `<div class="progresscounter">${i + 1}. </div>` +
                        "<div class='progress'>" +
                        "<div class='progress-bar progress-bar-success'" +
                        `style="width: ${percent}%; min-width: 2em;"></div>` +
                        "<span class='poll-text' style='margin: 0 0 0 10px;'>" +
                        text +
                        "</span></div>";
                }
                var el = $(html);
                list.append(el);
            }
            $(this.resultsDiv).append(list);
        }
        this.indicate_component_ready();
    }
    disableOptions() {}
    checkPollStorage() {
        //checks the localstorage to see if the poll has been completed already
        var _this = this;
        var len = localStorage.length;
        if (len > 0) {
            //If the poll has already been completed, show the results
            var data = {};
            data.div_id = this.divid;
            data.course = eBookConfig.course;
            jQuery
                .get(
                    `${eBookConfig.new_server_prefix}/assessment/getpollresults`,
                    data,
                    this.showPollResults.bind(this)
                )
                .fail(this.indicate_component_ready.bind(this));
        } else {
            this.indicate_component_ready();
        }
    }
}

// Do not render poll data until login-complete event so we know instructor status
$(document).on("runestone:login-complete", function () {
    $("[data-component=poll]").each(function (index) {
        try {
            pollList[this.id] = new Poll({ orig: this });
        } catch (err) {
            console.log(`Error rendering Poll Problem ${this.id}
                         Details: ${err}`);
            console.log(err.stack);
        }
    });
});

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory.poll = function (opts) {
    return new Poll(opts);
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3BvbGxfanNfcG9sbF9qcy5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDYTs7QUFFNkM7QUFDakM7O0FBRWxCOztBQUVRLG1CQUFtQixnRUFBYTtBQUMvQztBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUIsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QiwwQkFBMEI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsMEJBQTBCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDLFNBQVM7QUFDVDtBQUNBLHdCQUF3Qiw0QkFBNEI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDJCQUEyQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQSx3Q0FBd0MsV0FBVztBQUNuRDtBQUNBLDRCQUE0QixXQUFXO0FBQ3ZDO0FBQ0EsVUFBVTtBQUNWLGtCQUFrQixXQUFXO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiw4QkFBOEI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxPQUFPO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qiw0QkFBNEI7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQSxnRkFBZ0Y7QUFDaEY7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELE1BQU07QUFDOUQ7QUFDQTtBQUNBLHlDQUF5QyxRQUFRLEdBQUcsZUFBZTtBQUNuRTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQSx3REFBd0QsTUFBTTtBQUM5RDtBQUNBO0FBQ0EseUNBQXlDLFFBQVEsR0FBRyxlQUFlO0FBQ25FLDJFQUEyRTtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qiw4QkFBOEI7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsWUFBWTtBQUN2RCxVQUFVO0FBQ1Ysd0RBQXdEO0FBQ3hELG9DQUFvQyxJQUFJO0FBQ3hDO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BvbGwvY3NzL3BvbGwuY3NzPzhjYTgiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wb2xsL2pzL3BvbGwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLypcbl9fYXV0aG9yX18gPSBLaXJieSBPbHNvblxuX19kYXRlX18gPSA2LzEyLzIwMTUgICovXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlXCI7XG5pbXBvcnQgXCIuLi9jc3MvcG9sbC5jc3NcIjtcblxuZXhwb3J0IHZhciBwb2xsTGlzdCA9IHt9O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb2xsIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdmFyIG9yaWcgPSBvcHRzLm9yaWc7IC8vZW50aXJlIDxwPiBlbGVtZW50XG4gICAgICAgIHRoaXMub3JpZ0VsZW0gPSBvcmlnO1xuICAgICAgICB0aGlzLmRpdmlkID0gb3JpZy5pZDtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IHRoaXMub3JpZ0VsZW0uY2hpbGROb2RlcztcbiAgICAgICAgdGhpcy5vcHRpb25MaXN0ID0gW107XG4gICAgICAgIHRoaXMub3B0c0FycmF5ID0gW107XG4gICAgICAgIHRoaXMuY29tbWVudCA9IGZhbHNlO1xuICAgICAgICBpZiAoJCh0aGlzLm9yaWdFbGVtKS5pcyhcIltkYXRhLWNvbW1lbnRdXCIpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1lbnQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzdWx0c1ZpZXdlciA9ICQob3JpZykuZGF0YShcInJlc3VsdHNcIik7XG4gICAgICAgIHRoaXMuZ2V0UXVlc3Rpb25UZXh0KCk7XG4gICAgICAgIHRoaXMuZ2V0T3B0aW9uVGV4dCgpOyAvL3BvcHVsYXRlcyBvcHRpb25MaXN0XG4gICAgICAgIHRoaXMucmVuZGVyUG9sbCgpOyAvL2dlbmVyYXRlcyBIVE1MXG4gICAgICAgIC8vIENoZWNrcyBsb2NhbFN0b3JhZ2UgdG8gc2VlIGlmIHRoaXMgcG9sbCBoYXMgYWxyZWFkeSBiZWVuIGNvbXBsZXRlZCBieSB0aGlzIHVzZXIuXG4gICAgICAgIHRoaXMuY2hlY2tQb2xsU3RvcmFnZSgpO1xuICAgICAgICB0aGlzLmNhcHRpb24gPSBcIlBvbGxcIjtcbiAgICAgICAgdGhpcy5hZGRDYXB0aW9uKFwicnVuZXN0b25lXCIpO1xuICAgIH1cbiAgICBnZXRRdWVzdGlvblRleHQoKSB7XG4gICAgICAgIC8vZmluZHMgdGhlIHRleHQgaW5zaWRlIHRoZSBwYXJlbnQgdGFnLCBidXQgYmVmb3JlIHRoZSBmaXJzdCA8bGk+IHRhZyBhbmQgc2V0cyBpdCBhcyB0aGUgcXVlc3Rpb25cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIGZpcnN0QW5zd2VyO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoaWxkcmVuW2ldLnRhZ05hbWUgPT0gXCJMSVwiKSB7XG4gICAgICAgICAgICAgICAgZmlyc3RBbnN3ZXIgPSBfdGhpcy5jaGlsZHJlbltpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgZGVsaW1pdGVyID0gZmlyc3RBbnN3ZXIub3V0ZXJIVE1MO1xuICAgICAgICB2YXIgZnVsbHRleHQgPSAkKHRoaXMub3JpZ0VsZW0pLmh0bWwoKTtcbiAgICAgICAgdmFyIHRlbXAgPSBmdWxsdGV4dC5zcGxpdChkZWxpbWl0ZXIpO1xuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gdGVtcFswXTtcbiAgICB9XG4gICAgZ2V0T3B0aW9uVGV4dCgpIHtcbiAgICAgICAgLy9HZXRzIHRoZSB0ZXh0IGZyb20gZWFjaCA8bGk+IHRhZyBhbmQgcGxhY2VzIGl0IGluIHRoaXMub3B0aW9uTGlzdFxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5jaGlsZHJlbltpXS50YWdOYW1lID09IFwiTElcIikge1xuICAgICAgICAgICAgICAgIF90aGlzLm9wdGlvbkxpc3QucHVzaCgkKF90aGlzLmNoaWxkcmVuW2ldKS50ZXh0KCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlclBvbGwoKSB7XG4gICAgICAgIC8vZ2VuZXJhdGVzIHRoZSBIVE1MIHRoYXQgdGhlIHVzZXIgaW50ZXJhY3RzIHdpdGhcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLnBvbGxGb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIik7XG4gICAgICAgIHRoaXMucmVzdWx0c0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgJCh0aGlzLmNvbnRhaW5lckRpdikuYWRkQ2xhc3ModGhpcy5vcmlnRWxlbS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSk7XG4gICAgICAgICQodGhpcy5wb2xsRm9ybSkuaHRtbChcbiAgICAgICAgICAgIGA8c3BhbiBzdHlsZT0nZm9udC1zaXplOiBMYXJnZSc+JHt0aGlzLnF1ZXN0aW9ufTwvc3Bhbj5gXG4gICAgICAgICk7XG4gICAgICAgICQodGhpcy5wb2xsRm9ybSkuYXR0cih7XG4gICAgICAgICAgICBpZDogdGhpcy5kaXZpZCArIFwiX2Zvcm1cIixcbiAgICAgICAgICAgIG1ldGhvZDogXCJnZXRcIixcbiAgICAgICAgICAgIGFjdGlvbjogXCJcIixcbiAgICAgICAgICAgIG9uc3VibWl0OiBcInJldHVybiBmYWxzZTtcIixcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucG9sbEZvcm0uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbkxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciByYWRpbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgICAgIHZhciB0bXBpZCA9IF90aGlzLmRpdmlkICsgXCJfb3B0X1wiICsgaTtcbiAgICAgICAgICAgICQocmFkaW8pLmF0dHIoe1xuICAgICAgICAgICAgICAgIGlkOiB0bXBpZCxcbiAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmRpdmlkICsgXCJfZ3JvdXAxXCIsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJyYWRpb1wiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKHJhZGlvKS5jbGljayh0aGlzLnN1Ym1pdFBvbGwuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB2YXIgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgICAgICAgICAkKGxhYmVsKS5hdHRyKFwiZm9yXCIsIHRtcGlkKTtcbiAgICAgICAgICAgICQobGFiZWwpLnRleHQodGhpcy5vcHRpb25MaXN0W2ldKTtcbiAgICAgICAgICAgIHRoaXMucG9sbEZvcm0uYXBwZW5kQ2hpbGQocmFkaW8pO1xuICAgICAgICAgICAgdGhpcy5vcHRzQXJyYXkucHVzaChyYWRpbyk7XG4gICAgICAgICAgICB0aGlzLnBvbGxGb3JtLmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICAgICAgICAgIHRoaXMucG9sbEZvcm0uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jb21tZW50KSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlclRleHRGaWVsZCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzdWx0c0Rpdi5pZCA9IHRoaXMuZGl2aWQgKyBcIl9yZXN1bHRzXCI7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMucG9sbEZvcm0pO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnJlc3VsdHNEaXYpO1xuICAgICAgICAkKHRoaXMub3JpZ0VsZW0pLnJlcGxhY2VXaXRoKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICB9XG4gICAgcmVuZGVyVGV4dEZpZWxkKCkge1xuICAgICAgICB0aGlzLnRleHRmaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgdGhpcy50ZXh0ZmllbGQudHlwZSA9IFwidGV4dFwiO1xuICAgICAgICAkKHRoaXMudGV4dGZpZWxkKS5hZGRDbGFzcyhcImZvcm0tY29udHJvbFwiKTtcbiAgICAgICAgdGhpcy50ZXh0ZmllbGQuc3R5bGUud2lkdGggPSBcIjMwMHB4XCI7XG4gICAgICAgIHRoaXMudGV4dGZpZWxkLm5hbWUgPSB0aGlzLmRpdmlkICsgXCJfY29tbWVudFwiO1xuICAgICAgICB0aGlzLnRleHRmaWVsZC5wbGFjZWhvbGRlciA9IFwiQW55IGNvbW1lbnRzP1wiO1xuICAgICAgICB0aGlzLnBvbGxGb3JtLmFwcGVuZENoaWxkKHRoaXMudGV4dGZpZWxkKTtcbiAgICAgICAgdGhpcy5wb2xsRm9ybS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuICAgIH1cbiAgICBzdWJtaXRQb2xsKCkge1xuICAgICAgICAvL2NoZWNrcyB0aGUgcG9sbCwgc2V0cyBsb2NhbHN0b3JhZ2UgYW5kIHN1Ym1pdHMgdG8gdGhlIHNlcnZlclxuICAgICAgICB2YXIgcG9sbF92YWwgPSBudWxsO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMub3B0c0FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRzQXJyYXlbaV0uY2hlY2tlZCkge1xuICAgICAgICAgICAgICAgIHBvbGxfdmFsID0gdGhpcy5vcHRzQXJyYXlbaV0udmFsdWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvbGxfdmFsID09PSBudWxsKSByZXR1cm47XG4gICAgICAgIHZhciBjb21tZW50X3ZhbCA9IFwiXCI7XG4gICAgICAgIGlmICh0aGlzLmNvbW1lbnQpIHtcbiAgICAgICAgICAgIGNvbW1lbnRfdmFsID0gdGhpcy50ZXh0ZmllbGQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGFjdCA9IFwiXCI7XG4gICAgICAgIGlmIChjb21tZW50X3ZhbCAhPT0gXCJcIikge1xuICAgICAgICAgICAgYWN0ID0gcG9sbF92YWwgKyBcIjpcIiArIGNvbW1lbnRfdmFsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWN0ID0gcG9sbF92YWw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGV2ZW50SW5mbyA9IHsgZXZlbnQ6IFwicG9sbFwiLCBhY3Q6IGFjdCwgZGl2X2lkOiB0aGlzLmRpdmlkIH07XG4gICAgICAgIC8vIGxvZyB0aGUgcmVzcG9uc2UgdG8gdGhlIGRhdGFiYXNlXG4gICAgICAgIHRoaXMubG9nQm9va0V2ZW50KGV2ZW50SW5mbyk7IC8vIGluIGJvb2tmdW5jcy5qc1xuICAgICAgICAvLyBsb2cgdGhlIGZhY3QgdGhhdCB0aGUgdXNlciBoYXMgYW5zd2VyZWQgdGhlIHBvbGwgdG8gbG9jYWwgc3RvcmFnZVxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmRpdmlkLCBcInRydWVcIik7XG4gICAgICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7dGhpcy5kaXZpZH1fc2VudGApKSB7XG4gICAgICAgICAgICAkKHRoaXMucG9sbEZvcm0pLmFwcGVuZChcbiAgICAgICAgICAgICAgICBgPHNwYW4gaWQ9JHt0aGlzLmRpdmlkfV9zZW50PjxzdHJvbmc+VGhhbmtzLCB5b3VyIHJlc3BvbnNlIGhhcyBiZWVuIHJlY29yZGVkPC9zdHJvbmc+PC9zcGFuPmBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKGAjJHt0aGlzLmRpdmlkfV9zZW50YCkuaHRtbChcbiAgICAgICAgICAgICAgICBcIjxzdHJvbmc+T25seSBZb3VyIGxhc3QgcmVwb25zZSBpcyByZWNvcmRlZDwvc3Ryb25nPlwiXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIC8vIHNob3cgdGhlIHJlc3VsdHMgb2YgdGhlIHBvbGxcbiAgICAgICAgaWYgKHRoaXMucmVzdWx0c1ZpZXdlciA9PT0gXCJhbGxcIikge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgICAgICAgIGRhdGEuZGl2X2lkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgICAgIGRhdGEuY291cnNlID0gZUJvb2tDb25maWcuY291cnNlO1xuICAgICAgICAgICAgalF1ZXJ5LmdldChcbiAgICAgICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vYXNzZXNzbWVudC9nZXRwb2xscmVzdWx0c2AsXG4gICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dQb2xsUmVzdWx0c1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzaG93UG9sbFJlc3VsdHMocmVzdWx0cykge1xuICAgICAgICAvL2Rpc3BsYXlzIHRoZSByZXN1bHRzIHJldHVybmVkIGJ5IHRoZSBzZXJ2ZXJcbiAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuZGV0YWlsO1xuICAgICAgICB2YXIgdG90YWwgPSByZXN1bHRzW1widG90YWxcIl07XG4gICAgICAgIHZhciBvcHRDb3VudHMgPSByZXN1bHRzW1wib3B0X2NvdW50c1wiXTtcbiAgICAgICAgdmFyIGRpdl9pZCA9IHJlc3VsdHNbXCJkaXZfaWRcIl07XG4gICAgICAgIHZhciBteV92b3RlID0gcmVzdWx0c1tcIm15X3ZvdGVcIl07XG4gICAgICAgIC8vIHJlc3RvcmUgY3VycmVudCB1c2VycyB2b3RlXG4gICAgICAgIGlmIChteV92b3RlID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMub3B0c0FycmF5W215X3ZvdGVdLmNoZWNrZWQgPSBcImNoZWNrZWRcIjtcbiAgICAgICAgfVxuICAgICAgICAvLyBzaG93IHJlc3VsdHMgc3VtbWFyeSBpZiBhcHByb3ByaWF0ZVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICAodGhpcy5yZXN1bHRzVmlld2VyID09PSBcImFsbFwiICYmXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5kaXZpZCA9PT0gXCJ0cnVlXCIpKSB8fFxuICAgICAgICAgICAgZUJvb2tDb25maWcuaXNJbnN0cnVjdG9yXG4gICAgICAgICkge1xuICAgICAgICAgICAgJCh0aGlzLnJlc3VsdHNEaXYpLmh0bWwoXG4gICAgICAgICAgICAgICAgYDxiPlJlc3VsdHM6PC9iPiAke3RvdGFsfSByZXNwb25zZXMgPGJyPjxicj5gXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdmFyIGxpc3QgPSAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICAgICAgICAgICAgJChsaXN0KS5hZGRDbGFzcyhcInJlc3VsdHMtY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbkxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY291bnQ7XG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnQ7XG4gICAgICAgICAgICAgICAgaWYgKG9wdENvdW50c1tpXSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY291bnQgPSBvcHRDb3VudHNbaV07XG4gICAgICAgICAgICAgICAgICAgIHBlcmNlbnQgPSAoY291bnQgLyB0b3RhbCkgKiAxMDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBwZXJjZW50ID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSBjb3VudCArIFwiIChcIiArIE1hdGgucm91bmQoMTAgKiBwZXJjZW50KSAvIDEwICsgXCIlKVwiOyAvLyByb3VuZCBwZXJjZW50IHRvIDEwdGhzXG4gICAgICAgICAgICAgICAgdmFyIGh0bWw7XG4gICAgICAgICAgICAgICAgaWYgKHBlcmNlbnQgPiAxMCkge1xuICAgICAgICAgICAgICAgICAgICBodG1sID1cbiAgICAgICAgICAgICAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3Njb3VudGVyXCI+JHtpICsgMX0uIDwvZGl2PmAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCI8ZGl2IGNsYXNzPSdwcm9ncmVzcyc+XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCI8ZGl2IGNsYXNzPSdwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN1Y2Nlc3MnXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYHN0eWxlPVwid2lkdGg6ICR7cGVyY2VudH0lOyBtaW4td2lkdGg6IDJlbTtcIj5gICtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPHNwYW4gY2xhc3M9J3BvbGwtdGV4dCc+XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCArXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjwvc3Bhbj48L2Rpdj48L2Rpdj5cIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBodG1sID1cbiAgICAgICAgICAgICAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3Njb3VudGVyXCI+JHtpICsgMX0uIDwvZGl2PmAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCI8ZGl2IGNsYXNzPSdwcm9ncmVzcyc+XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCI8ZGl2IGNsYXNzPSdwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN1Y2Nlc3MnXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYHN0eWxlPVwid2lkdGg6ICR7cGVyY2VudH0lOyBtaW4td2lkdGg6IDJlbTtcIj48L2Rpdj5gICtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPHNwYW4gY2xhc3M9J3BvbGwtdGV4dCcgc3R5bGU9J21hcmdpbjogMCAwIDAgMTBweDsnPlwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCI8L3NwYW4+PC9kaXY+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBlbCA9ICQoaHRtbCk7XG4gICAgICAgICAgICAgICAgbGlzdC5hcHBlbmQoZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCh0aGlzLnJlc3VsdHNEaXYpLmFwcGVuZChsaXN0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluZGljYXRlX2NvbXBvbmVudF9yZWFkeSgpO1xuICAgIH1cbiAgICBkaXNhYmxlT3B0aW9ucygpIHt9XG4gICAgY2hlY2tQb2xsU3RvcmFnZSgpIHtcbiAgICAgICAgLy9jaGVja3MgdGhlIGxvY2Fsc3RvcmFnZSB0byBzZWUgaWYgdGhlIHBvbGwgaGFzIGJlZW4gY29tcGxldGVkIGFscmVhZHlcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIGxlbiA9IGxvY2FsU3RvcmFnZS5sZW5ndGg7XG4gICAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgICAgICAvL0lmIHRoZSBwb2xsIGhhcyBhbHJlYWR5IGJlZW4gY29tcGxldGVkLCBzaG93IHRoZSByZXN1bHRzXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgICAgICAgZGF0YS5kaXZfaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICAgICAgZGF0YS5jb3Vyc2UgPSBlQm9va0NvbmZpZy5jb3Vyc2U7XG4gICAgICAgICAgICBqUXVlcnlcbiAgICAgICAgICAgICAgICAuZ2V0KFxuICAgICAgICAgICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vYXNzZXNzbWVudC9nZXRwb2xscmVzdWx0c2AsXG4gICAgICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1BvbGxSZXN1bHRzLmJpbmQodGhpcylcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgLmZhaWwodGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkuYmluZCh0aGlzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmluZGljYXRlX2NvbXBvbmVudF9yZWFkeSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBEbyBub3QgcmVuZGVyIHBvbGwgZGF0YSB1bnRpbCBsb2dpbi1jb21wbGV0ZSBldmVudCBzbyB3ZSBrbm93IGluc3RydWN0b3Igc3RhdHVzXG4kKGRvY3VtZW50KS5vbihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgJChcIltkYXRhLWNvbXBvbmVudD1wb2xsXVwiKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcG9sbExpc3RbdGhpcy5pZF0gPSBuZXcgUG9sbCh7IG9yaWc6IHRoaXMgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHJlbmRlcmluZyBQb2xsIFByb2JsZW0gJHt0aGlzLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgIERldGFpbHM6ICR7ZXJyfWApO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyLnN0YWNrKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG5cbmlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID0ge307XG59XG53aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkucG9sbCA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgcmV0dXJuIG5ldyBQb2xsKG9wdHMpO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==