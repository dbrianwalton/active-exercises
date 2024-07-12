"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_groupsub_js_groupsub_js"],{

/***/ 26070:
/*!*********************************************!*\
  !*** ./runestone/groupsub/css/groupsub.css ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 45280:
/*!*******************************************!*\
  !*** ./runestone/groupsub/js/groupsub.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase */ 2568);
/* harmony import */ var _css_groupsub_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/groupsub.css */ 26070);
/* harmony import */ var select2_dist_js_select2_min_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! select2/dist/js/select2.min.js */ 59298);
/* harmony import */ var select2_dist_js_select2_min_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(select2_dist_js_select2_min_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var select2_dist_css_select2_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! select2/dist/css/select2.css */ 75207);
/*==========================================
=======      Master groupsub.js       ========
============================================
===     This file contains the JS for    ===
===     the Runestone reval component.   ===
============================================
===              Created by              ===
===           Isaiah Mayerchak           ===
===               06/12/15               ===
==========================================*/







var pageReveal;

// Define Reveal object
class GroupSub extends _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; // entire <div> element that will be replaced by new HTML
        this.origElem = orig;
        this.divid = orig.id;
        self.group = []
        this.limit = this.origElem.dataset.size_limit;

        // Create submit button
        let butt = document.createElement("button");
        butt.type = "button";
        butt.classList.add("btn", "btn-success")
        butt.innerHTML = "Submit Group"
        butt.onclick = this.submitAll.bind(this);
        let container = document.getElementById("groupsub_button")
        container.appendChild(butt);


    }

    async initialize() {
        // get the classlist to populate
        if (eBookConfig.useRunestoneServices) {
            // get classlist from admin/course_students
            let request = new Request("/runestone/admin/course_students", {
                method: "GET",
                headers: this.jsonHeaders,
            });
            try {
                let response = await fetch(request);
                if (!response.ok) {
                    throw new Error("Failed to save the log entry");
                }
                this.studentList = await response.json();
            } catch (e) {
                if (this.isTimed) {
                    alert(`Error: Your action was not saved! The error was ${e}`);
                }
                console.log(`Error: ${e}`);
            }

        } else {
            this.studentList = {
                s1: "User 1",
                s2: "User 2",
                s3: "User 3",
                s4: "User 4",
                s5: "User 5",
            }
        }
        let select = document.getElementById("assignment_group");
        for (let [sid, name] of Object.entries(this.studentList)) {
            let opt = document.createElement("option");
            opt.value = sid;
            opt.innerHTML = this.studentList[sid];
            select.appendChild(opt);
        }
        // Make the select element searchable with multiple selections
        $('.assignment_partner_select').select2({
            placeholder: "Select up to 4 team members",
            allowClear: true,
            maximumSelectionLength: this.limit
        });

    }

    async submitAll() {
        // find all components on the page and submit them for all group members
        let picker = document.getElementById("assignment_group")
        let group = []
        for (let student of picker.selectedOptions) {
            group.push(student.value);
        }
        // If the leader forgets to add themselves, add them here.
        let username = eBookConfig.username;
        if (username && !group.includes(username)) {
            group.push(username)
        }
        if (group.len > this.limit) {
            alert(`You may not have more than ${this.limit} students in a group`);
            return
        }
        this.logBookEvent({
            event: "group_start",
            act: group.join(","),
            div_id: window.location.pathname,
        });
        for (let student of group) {
            for (let question of window.allComponents) {
                try{
                    console.log(`${student} ${question}`)
                    await question.logCurrentAnswer(student)
                } catch(e) {
                    console.log(`failed to submit ${question} : ${e}`)
                }
            }
        }

        this.logBookEvent({
            event: "group_end",
            act: group.join(","),
            div_id: window.location.pathname,
        });
    }

}


$(document).on("runestone:login-complete", async function () {
    let gs = document.querySelectorAll("[data-component=groupsub]");
    if (gs.length > 1) {
        alert("Only one Group Submit is allowed per page")
        return;
    }
    let gsElement = gs[0];
    try {
        var pageReveal = new GroupSub({ orig: gsElement });
        await pageReveal.initialize();
    } catch (err) {
        console.log(`Error rendering GroupSub ${gsElement.id}`);
        console.log(`Details ${err}`);
    }
});



/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2dyb3Vwc3ViX2pzX2dyb3Vwc3ViX2pzLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUcwRDtBQUM3QjtBQUNXO0FBQ0Y7O0FBRXRDOztBQUVBO0FBQ0EsdUJBQXVCLGdFQUFhO0FBQ3BDO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0EsNkVBQTZFLEVBQUU7QUFDL0U7QUFDQSxzQ0FBc0MsRUFBRTtBQUN4Qzs7QUFFQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsWUFBWTtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLFNBQVMsRUFBRSxTQUFTO0FBQ3ZEO0FBQ0Esa0JBQWtCO0FBQ2xCLG9EQUFvRCxVQUFVLElBQUksRUFBRTtBQUNwRTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsaUJBQWlCO0FBQ3pEO0FBQ0EsTUFBTTtBQUNOLGdEQUFnRCxhQUFhO0FBQzdELCtCQUErQixJQUFJO0FBQ25DO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZ3JvdXBzdWIvY3NzL2dyb3Vwc3ViLmNzcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2dyb3Vwc3ViL2pzL2dyb3Vwc3ViLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09ICAgICAgTWFzdGVyIGdyb3Vwc3ViLmpzICAgICAgID09PT09PT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09ICAgICBUaGlzIGZpbGUgY29udGFpbnMgdGhlIEpTIGZvciAgICA9PT1cbj09PSAgICAgdGhlIFJ1bmVzdG9uZSByZXZhbCBjb21wb25lbnQuICAgPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09ICAgICAgICAgICAgICBDcmVhdGVkIGJ5ICAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgSXNhaWFoIE1heWVyY2hhayAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgICAgICAwNi8xMi8xNSAgICAgICAgICAgICAgID09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2VcIjtcbmltcG9ydCBcIi4uL2Nzcy9ncm91cHN1Yi5jc3NcIjtcbmltcG9ydCBcInNlbGVjdDIvZGlzdC9qcy9zZWxlY3QyLm1pbi5qc1wiO1xuaW1wb3J0IFwic2VsZWN0Mi9kaXN0L2Nzcy9zZWxlY3QyLmNzc1wiO1xuXG52YXIgcGFnZVJldmVhbDtcblxuLy8gRGVmaW5lIFJldmVhbCBvYmplY3RcbmNsYXNzIEdyb3VwU3ViIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdmFyIG9yaWcgPSBvcHRzLm9yaWc7IC8vIGVudGlyZSA8ZGl2PiBlbGVtZW50IHRoYXQgd2lsbCBiZSByZXBsYWNlZCBieSBuZXcgSFRNTFxuICAgICAgICB0aGlzLm9yaWdFbGVtID0gb3JpZztcbiAgICAgICAgdGhpcy5kaXZpZCA9IG9yaWcuaWQ7XG4gICAgICAgIHNlbGYuZ3JvdXAgPSBbXVxuICAgICAgICB0aGlzLmxpbWl0ID0gdGhpcy5vcmlnRWxlbS5kYXRhc2V0LnNpemVfbGltaXQ7XG5cbiAgICAgICAgLy8gQ3JlYXRlIHN1Ym1pdCBidXR0b25cbiAgICAgICAgbGV0IGJ1dHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICBidXR0LnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgICBidXR0LmNsYXNzTGlzdC5hZGQoXCJidG5cIiwgXCJidG4tc3VjY2Vzc1wiKVxuICAgICAgICBidXR0LmlubmVySFRNTCA9IFwiU3VibWl0IEdyb3VwXCJcbiAgICAgICAgYnV0dC5vbmNsaWNrID0gdGhpcy5zdWJtaXRBbGwuYmluZCh0aGlzKTtcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ3JvdXBzdWJfYnV0dG9uXCIpXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChidXR0KTtcblxuXG4gICAgfVxuXG4gICAgYXN5bmMgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgLy8gZ2V0IHRoZSBjbGFzc2xpc3QgdG8gcG9wdWxhdGVcbiAgICAgICAgaWYgKGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgICAgICAvLyBnZXQgY2xhc3NsaXN0IGZyb20gYWRtaW4vY291cnNlX3N0dWRlbnRzXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KFwiL3J1bmVzdG9uZS9hZG1pbi9jb3Vyc2Vfc3R1ZGVudHNcIiwge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmpzb25IZWFkZXJzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIHNhdmUgdGhlIGxvZyBlbnRyeVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zdHVkZW50TGlzdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1RpbWVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGBFcnJvcjogWW91ciBhY3Rpb24gd2FzIG5vdCBzYXZlZCEgVGhlIGVycm9yIHdhcyAke2V9YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvcjogJHtlfWApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0dWRlbnRMaXN0ID0ge1xuICAgICAgICAgICAgICAgIHMxOiBcIlVzZXIgMVwiLFxuICAgICAgICAgICAgICAgIHMyOiBcIlVzZXIgMlwiLFxuICAgICAgICAgICAgICAgIHMzOiBcIlVzZXIgM1wiLFxuICAgICAgICAgICAgICAgIHM0OiBcIlVzZXIgNFwiLFxuICAgICAgICAgICAgICAgIHM1OiBcIlVzZXIgNVwiLFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBzZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFzc2lnbm1lbnRfZ3JvdXBcIik7XG4gICAgICAgIGZvciAobGV0IFtzaWQsIG5hbWVdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuc3R1ZGVudExpc3QpKSB7XG4gICAgICAgICAgICBsZXQgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICAgICAgICAgIG9wdC52YWx1ZSA9IHNpZDtcbiAgICAgICAgICAgIG9wdC5pbm5lckhUTUwgPSB0aGlzLnN0dWRlbnRMaXN0W3NpZF07XG4gICAgICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBNYWtlIHRoZSBzZWxlY3QgZWxlbWVudCBzZWFyY2hhYmxlIHdpdGggbXVsdGlwbGUgc2VsZWN0aW9uc1xuICAgICAgICAkKCcuYXNzaWdubWVudF9wYXJ0bmVyX3NlbGVjdCcpLnNlbGVjdDIoe1xuICAgICAgICAgICAgcGxhY2Vob2xkZXI6IFwiU2VsZWN0IHVwIHRvIDQgdGVhbSBtZW1iZXJzXCIsXG4gICAgICAgICAgICBhbGxvd0NsZWFyOiB0cnVlLFxuICAgICAgICAgICAgbWF4aW11bVNlbGVjdGlvbkxlbmd0aDogdGhpcy5saW1pdFxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGFzeW5jIHN1Ym1pdEFsbCgpIHtcbiAgICAgICAgLy8gZmluZCBhbGwgY29tcG9uZW50cyBvbiB0aGUgcGFnZSBhbmQgc3VibWl0IHRoZW0gZm9yIGFsbCBncm91cCBtZW1iZXJzXG4gICAgICAgIGxldCBwaWNrZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFzc2lnbm1lbnRfZ3JvdXBcIilcbiAgICAgICAgbGV0IGdyb3VwID0gW11cbiAgICAgICAgZm9yIChsZXQgc3R1ZGVudCBvZiBwaWNrZXIuc2VsZWN0ZWRPcHRpb25zKSB7XG4gICAgICAgICAgICBncm91cC5wdXNoKHN0dWRlbnQudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIHRoZSBsZWFkZXIgZm9yZ2V0cyB0byBhZGQgdGhlbXNlbHZlcywgYWRkIHRoZW0gaGVyZS5cbiAgICAgICAgbGV0IHVzZXJuYW1lID0gZUJvb2tDb25maWcudXNlcm5hbWU7XG4gICAgICAgIGlmICh1c2VybmFtZSAmJiAhZ3JvdXAuaW5jbHVkZXModXNlcm5hbWUpKSB7XG4gICAgICAgICAgICBncm91cC5wdXNoKHVzZXJuYW1lKVxuICAgICAgICB9XG4gICAgICAgIGlmIChncm91cC5sZW4gPiB0aGlzLmxpbWl0KSB7XG4gICAgICAgICAgICBhbGVydChgWW91IG1heSBub3QgaGF2ZSBtb3JlIHRoYW4gJHt0aGlzLmxpbWl0fSBzdHVkZW50cyBpbiBhIGdyb3VwYCk7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICBldmVudDogXCJncm91cF9zdGFydFwiLFxuICAgICAgICAgICAgYWN0OiBncm91cC5qb2luKFwiLFwiKSxcbiAgICAgICAgICAgIGRpdl9pZDogd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLFxuICAgICAgICB9KTtcbiAgICAgICAgZm9yIChsZXQgc3R1ZGVudCBvZiBncm91cCkge1xuICAgICAgICAgICAgZm9yIChsZXQgcXVlc3Rpb24gb2Ygd2luZG93LmFsbENvbXBvbmVudHMpIHtcbiAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke3N0dWRlbnR9ICR7cXVlc3Rpb259YClcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgcXVlc3Rpb24ubG9nQ3VycmVudEFuc3dlcihzdHVkZW50KVxuICAgICAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgZmFpbGVkIHRvIHN1Ym1pdCAke3F1ZXN0aW9ufSA6ICR7ZX1gKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgIGV2ZW50OiBcImdyb3VwX2VuZFwiLFxuICAgICAgICAgICAgYWN0OiBncm91cC5qb2luKFwiLFwiKSxcbiAgICAgICAgICAgIGRpdl9pZDogd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLFxuICAgICAgICB9KTtcbiAgICB9XG5cbn1cblxuXG4kKGRvY3VtZW50KS5vbihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGdzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWNvbXBvbmVudD1ncm91cHN1Yl1cIik7XG4gICAgaWYgKGdzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgYWxlcnQoXCJPbmx5IG9uZSBHcm91cCBTdWJtaXQgaXMgYWxsb3dlZCBwZXIgcGFnZVwiKVxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBnc0VsZW1lbnQgPSBnc1swXTtcbiAgICB0cnkge1xuICAgICAgICB2YXIgcGFnZVJldmVhbCA9IG5ldyBHcm91cFN1Yih7IG9yaWc6IGdzRWxlbWVudCB9KTtcbiAgICAgICAgYXdhaXQgcGFnZVJldmVhbC5pbml0aWFsaXplKCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciByZW5kZXJpbmcgR3JvdXBTdWIgJHtnc0VsZW1lbnQuaWR9YCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGBEZXRhaWxzICR7ZXJyfWApO1xuICAgIH1cbn0pO1xuXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=