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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZV9ncm91cHN1Yl9qc19ncm91cHN1Yl9qcy5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHMEQ7QUFDN0I7QUFDVztBQUNGOztBQUV0Qzs7QUFFQTtBQUNBLHVCQUF1QixnRUFBYTtBQUNwQztBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBLDZFQUE2RSxFQUFFO0FBQy9FO0FBQ0Esc0NBQXNDLEVBQUU7QUFDeEM7O0FBRUEsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELFlBQVk7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxTQUFTLEVBQUUsU0FBUztBQUN2RDtBQUNBLGtCQUFrQjtBQUNsQixvREFBb0QsVUFBVSxJQUFJLEVBQUU7QUFDcEU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLGlCQUFpQjtBQUN6RDtBQUNBLE1BQU07QUFDTixnREFBZ0QsYUFBYTtBQUM3RCwrQkFBK0IsSUFBSTtBQUNuQztBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2dyb3Vwc3ViL2Nzcy9ncm91cHN1Yi5jc3MiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9ncm91cHN1Yi9qcy9ncm91cHN1Yi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PSAgICAgIE1hc3RlciBncm91cHN1Yi5qcyAgICAgICA9PT09PT09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PSAgICAgVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBKUyBmb3IgICAgPT09XG49PT0gICAgIHRoZSBSdW5lc3RvbmUgcmV2YWwgY29tcG9uZW50LiAgID09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PSAgICAgICAgICAgICAgQ3JlYXRlZCBieSAgICAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgIElzYWlhaCBNYXllcmNoYWsgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgICAgMDYvMTIvMTUgICAgICAgICAgICAgICA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlXCI7XG5pbXBvcnQgXCIuLi9jc3MvZ3JvdXBzdWIuY3NzXCI7XG5pbXBvcnQgXCJzZWxlY3QyL2Rpc3QvanMvc2VsZWN0Mi5taW4uanNcIjtcbmltcG9ydCBcInNlbGVjdDIvZGlzdC9jc3Mvc2VsZWN0Mi5jc3NcIjtcblxudmFyIHBhZ2VSZXZlYWw7XG5cbi8vIERlZmluZSBSZXZlYWwgb2JqZWN0XG5jbGFzcyBHcm91cFN1YiBleHRlbmRzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHZhciBvcmlnID0gb3B0cy5vcmlnOyAvLyBlbnRpcmUgPGRpdj4gZWxlbWVudCB0aGF0IHdpbGwgYmUgcmVwbGFjZWQgYnkgbmV3IEhUTUxcbiAgICAgICAgdGhpcy5vcmlnRWxlbSA9IG9yaWc7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcmlnLmlkO1xuICAgICAgICBzZWxmLmdyb3VwID0gW11cbiAgICAgICAgdGhpcy5saW1pdCA9IHRoaXMub3JpZ0VsZW0uZGF0YXNldC5zaXplX2xpbWl0O1xuXG4gICAgICAgIC8vIENyZWF0ZSBzdWJtaXQgYnV0dG9uXG4gICAgICAgIGxldCBidXR0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgYnV0dC50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgYnV0dC5jbGFzc0xpc3QuYWRkKFwiYnRuXCIsIFwiYnRuLXN1Y2Nlc3NcIilcbiAgICAgICAgYnV0dC5pbm5lckhUTUwgPSBcIlN1Ym1pdCBHcm91cFwiXG4gICAgICAgIGJ1dHQub25jbGljayA9IHRoaXMuc3VibWl0QWxsLmJpbmQodGhpcyk7XG4gICAgICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdyb3Vwc3ViX2J1dHRvblwiKVxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYnV0dCk7XG5cblxuICAgIH1cblxuICAgIGFzeW5jIGluaXRpYWxpemUoKSB7XG4gICAgICAgIC8vIGdldCB0aGUgY2xhc3NsaXN0IHRvIHBvcHVsYXRlXG4gICAgICAgIGlmIChlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICAgICAgLy8gZ2V0IGNsYXNzbGlzdCBmcm9tIGFkbWluL2NvdXJzZV9zdHVkZW50c1xuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdChcIi9ydW5lc3RvbmUvYWRtaW4vY291cnNlX3N0dWRlbnRzXCIsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5qc29uSGVhZGVycyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBzYXZlIHRoZSBsb2cgZW50cnlcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc3R1ZGVudExpc3QgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNUaW1lZCkge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChgRXJyb3I6IFlvdXIgYWN0aW9uIHdhcyBub3Qgc2F2ZWQhIFRoZSBlcnJvciB3YXMgJHtlfWApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3I6ICR7ZX1gKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdHVkZW50TGlzdCA9IHtcbiAgICAgICAgICAgICAgICBzMTogXCJVc2VyIDFcIixcbiAgICAgICAgICAgICAgICBzMjogXCJVc2VyIDJcIixcbiAgICAgICAgICAgICAgICBzMzogXCJVc2VyIDNcIixcbiAgICAgICAgICAgICAgICBzNDogXCJVc2VyIDRcIixcbiAgICAgICAgICAgICAgICBzNTogXCJVc2VyIDVcIixcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc3NpZ25tZW50X2dyb3VwXCIpO1xuICAgICAgICBmb3IgKGxldCBbc2lkLCBuYW1lXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLnN0dWRlbnRMaXN0KSkge1xuICAgICAgICAgICAgbGV0IG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgICAgICAgICBvcHQudmFsdWUgPSBzaWQ7XG4gICAgICAgICAgICBvcHQuaW5uZXJIVE1MID0gdGhpcy5zdHVkZW50TGlzdFtzaWRdO1xuICAgICAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTWFrZSB0aGUgc2VsZWN0IGVsZW1lbnQgc2VhcmNoYWJsZSB3aXRoIG11bHRpcGxlIHNlbGVjdGlvbnNcbiAgICAgICAgJCgnLmFzc2lnbm1lbnRfcGFydG5lcl9zZWxlY3QnKS5zZWxlY3QyKHtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBcIlNlbGVjdCB1cCB0byA0IHRlYW0gbWVtYmVyc1wiLFxuICAgICAgICAgICAgYWxsb3dDbGVhcjogdHJ1ZSxcbiAgICAgICAgICAgIG1heGltdW1TZWxlY3Rpb25MZW5ndGg6IHRoaXMubGltaXRcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBhc3luYyBzdWJtaXRBbGwoKSB7XG4gICAgICAgIC8vIGZpbmQgYWxsIGNvbXBvbmVudHMgb24gdGhlIHBhZ2UgYW5kIHN1Ym1pdCB0aGVtIGZvciBhbGwgZ3JvdXAgbWVtYmVyc1xuICAgICAgICBsZXQgcGlja2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc3NpZ25tZW50X2dyb3VwXCIpXG4gICAgICAgIGxldCBncm91cCA9IFtdXG4gICAgICAgIGZvciAobGV0IHN0dWRlbnQgb2YgcGlja2VyLnNlbGVjdGVkT3B0aW9ucykge1xuICAgICAgICAgICAgZ3JvdXAucHVzaChzdHVkZW50LnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB0aGUgbGVhZGVyIGZvcmdldHMgdG8gYWRkIHRoZW1zZWx2ZXMsIGFkZCB0aGVtIGhlcmUuXG4gICAgICAgIGxldCB1c2VybmFtZSA9IGVCb29rQ29uZmlnLnVzZXJuYW1lO1xuICAgICAgICBpZiAodXNlcm5hbWUgJiYgIWdyb3VwLmluY2x1ZGVzKHVzZXJuYW1lKSkge1xuICAgICAgICAgICAgZ3JvdXAucHVzaCh1c2VybmFtZSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ3JvdXAubGVuID4gdGhpcy5saW1pdCkge1xuICAgICAgICAgICAgYWxlcnQoYFlvdSBtYXkgbm90IGhhdmUgbW9yZSB0aGFuICR7dGhpcy5saW1pdH0gc3R1ZGVudHMgaW4gYSBncm91cGApO1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgZXZlbnQ6IFwiZ3JvdXBfc3RhcnRcIixcbiAgICAgICAgICAgIGFjdDogZ3JvdXAuam9pbihcIixcIiksXG4gICAgICAgICAgICBkaXZfaWQ6IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGZvciAobGV0IHN0dWRlbnQgb2YgZ3JvdXApIHtcbiAgICAgICAgICAgIGZvciAobGV0IHF1ZXN0aW9uIG9mIHdpbmRvdy5hbGxDb21wb25lbnRzKSB7XG4gICAgICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtzdHVkZW50fSAke3F1ZXN0aW9ufWApXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHF1ZXN0aW9uLmxvZ0N1cnJlbnRBbnN3ZXIoc3R1ZGVudClcbiAgICAgICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYGZhaWxlZCB0byBzdWJtaXQgJHtxdWVzdGlvbn0gOiAke2V9YClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICBldmVudDogXCJncm91cF9lbmRcIixcbiAgICAgICAgICAgIGFjdDogZ3JvdXAuam9pbihcIixcIiksXG4gICAgICAgICAgICBkaXZfaWQ6IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cblxuJChkb2N1bWVudCkub24oXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIGxldCBncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1jb21wb25lbnQ9Z3JvdXBzdWJdXCIpO1xuICAgIGlmIChncy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGFsZXJ0KFwiT25seSBvbmUgR3JvdXAgU3VibWl0IGlzIGFsbG93ZWQgcGVyIHBhZ2VcIilcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgZ3NFbGVtZW50ID0gZ3NbMF07XG4gICAgdHJ5IHtcbiAgICAgICAgdmFyIHBhZ2VSZXZlYWwgPSBuZXcgR3JvdXBTdWIoeyBvcmlnOiBnc0VsZW1lbnQgfSk7XG4gICAgICAgIGF3YWl0IHBhZ2VSZXZlYWwuaW5pdGlhbGl6ZSgpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgcmVuZGVyaW5nIEdyb3VwU3ViICR7Z3NFbGVtZW50LmlkfWApO1xuICAgICAgICBjb25zb2xlLmxvZyhgRGV0YWlscyAke2Vycn1gKTtcbiAgICB9XG59KTtcblxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9