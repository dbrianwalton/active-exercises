"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_spreadsheet_js_spreadsheet_js"],{

/***/ 47504:
/*!***************************************************!*\
  !*** ./runestone/spreadsheet/css/spreadsheet.css ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 60611:
/*!*************************************************!*\
  !*** ./runestone/spreadsheet/js/spreadsheet.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase */ 2568);
/* harmony import */ var jexcel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jexcel */ 27010);
/* harmony import */ var jexcel__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jexcel__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _css_spreadsheet_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../css/spreadsheet.css */ 47504);
/* harmony import */ var jexcel_dist_jexcel_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! jexcel/dist/jexcel.css */ 72860);








window.ssList = {};

class SpreadSheet extends _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        let orig = opts.orig;
        this.div_id = orig.id;
        this.sheet_id = `${this.div_id}_sheet`;
        this.data = eval(`${this.div_id}_data`);
        this.autograde = $(orig).data("autograde");
        this.suffix = window[`${this.div_id}_asserts`];
        this.mindimensions = $(orig).data("mindimensions");
        this.colwidths = $(orig).data("colwidths");
        this.coltitles = eval($(orig).data("coltitles"));
        this.maxHeight = 50;
        // Render the components
        this.renderSheet();

        if (this.autograde) {
            this.addAutoGradeButton();
            this.addOutput();
        }

        this.caption = "Spreadsheet";
        this.divid = this.div_id;
        this.containerDiv = document.getElementById(this.div_id);
        this.addCaption("runestone");
        this.indicate_component_ready();
    }

    renderSheet() {
        let div = document.getElementById(this.sheet_id);
        let opts = { data: this.data, tableHeight: this.maxHeight };
        if (this.mindimensions) {
            opts.minDimensions = this.mindimensions;
        }
        opts.columns = [];
        if (this.colwidths) {
            for (let w of this.colwidths) {
                opts.columns.push({ width: w });
            }
        }
        if (this.coltitles) {
            for (let i in this.coltitles) {
                if (opts.columns[i]) {
                    opts.columns[i].title = unescape(this.coltitles[i]);
                } else {
                    opts.columns.push({ title: this.coltitles[i] });
                }
            }
        }

        this.table = jexcel__WEBPACK_IMPORTED_MODULE_1___default()(div, opts);

        // Set background of cells that are autograded
        if (this.suffix) {
            for (let test of this.suffix) {
                let assert, loc, oper, expected;
                [assert, loc, oper, expected] = test.split(/\s+/);
                $(`#${this.div_id}_sheet`)
                    .find(this.getCellSelector(loc))
                    .css("background-color", "#d4e3ff");
            }
        }
    }

    addAutoGradeButton() {
        let div = document.getElementById(this.div_id);
        var butt = document.createElement("button");
        $(butt).text("Check");
        $(butt).addClass("btn btn-success run-button");
        div.appendChild(butt);
        this.gradeButton = butt;
        $(butt).click(this.doAutoGrade.bind(this));
        $(butt).attr("type", "button");
        $(butt).css("display", "block");
    }

    addOutput() {
        this.output = document.createElement("pre");
        this.output.id = `${this.div_id}_stdout`;
        $(this.output).css("visibility", "hidden");
        let div = document.getElementById(this.div_id);
        div.appendChild(this.output);
    }

    doAutoGrade() {
        let tests = this.suffix;
        this.passed = 0;
        this.failed = 0;
        // Tests should be of the form
        // assert cell oper value for example
        // assert A4 == 3
        let result = "";
        tests = tests.filter(function (s) {
            return s.indexOf("assert") > -1;
        });
        for (let test of tests) {
            let assert, loc, oper, expected;
            [assert, loc, oper, expected] = test.split(/\s+/);
            result += this.testOneAssert(loc, oper, expected);
            result += "\n";
        }
        let pct = (100 * this.passed) / (this.passed + this.failed);
        pct = pct.toLocaleString(undefined, { maximumFractionDigits: 2 });
        result += `You passed ${this.passed} out of ${
            this.passed + this.failed
        } tests for ${pct}%`;
        this.logBookEvent({
            event: "unittest",
            div_id: this.div_id,
            course: eBookConfig.course,
            act: `percent:${pct}:passed:${this.passed}:failed:${this.failed}`,
        });
        $(this.output).css("visibility", "visible");
        $(this.output).text(result);
    }

    testOneAssert(cell, oper, expected) {
        let actual = this.getCellDisplayValue(cell);
        const operators = {
            "==": function (operand1, operand2) {
                return operand1 == operand2;
            },
            "!=": function (operand1, operand2) {
                return operand1 != operand2;
            },
            ">": function (operand1, operand2) {
                return operand1 > operand2;
            },
            "<": function (operand1, operand2) {
                return operand1 > operand2;
            },
        };

        let res = operators[oper](actual, expected);
        let output = "";
        if (res) {
            output = `Pass: ${actual} ${oper} ${expected} in ${cell}`;
            $(`#${this.div_id}_sheet`)
                .find(this.getCellSelector(cell))
                .css("background-color", "#ccffcc");
            this.passed++;
        } else {
            output = `Failed ${actual} ${oper} ${expected} in cell ${cell}`;
            $(`#${this.div_id}_sheet`)
                .find(this.getCellSelector(cell))
                .css("background-color", "#ff9980");
            this.failed++;
        }
        return output;
    }

    // If the cell contains a formula, this call will return the formula not the computed value
    getCellSource(cell) {
        return this.table.getValue(cell);
    }

    // If the cell contains a formula this call will return the computed value
    getCellDisplayValue(cell) {
        let res = this.table.el.querySelector(this.getCellSelector(cell));
        return res.innerText;
    }

    getCellSelector(cell) {
        let parts = cell.match(/\$?([A-Z]+)\$?([0-9]+)/);
        let x = this.columnToIndex(parts[1]);
        let y = parts[2] - 1;
        return `[data-x="${x}"][data-y="${y}"]`;
    }
    columnToIndex(colName) {
        // Convert the column name to a number A = 0 AA = 26 BA = 52, etc
        let base = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let result = 0;

        for (
            let i = 0, j = colName.length - 1;
            i < colName.length;
            i += 1, j -= 1
        ) {
            result += Math.pow(base.length, j) * (base.indexOf(colName[i]) + 1);
        }

        return result - 1;
    }
}

$(document).on("runestone:login-complete", function () {
    $("[data-component=spreadsheet]").each(function (index) {
        // MC
        var opts = {
            orig: this,
            useRunestoneServices: eBookConfig.useRunestoneServices,
        };
        try {
            window.ssList[this.id] = new SpreadSheet(opts);
        } catch (err) {
            console.log(`Error rendering SpreadSheet Problem ${this.id}
                         Details: ${err}`);
            console.log(err.stack);
        }
    });
});

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory.spreadsheet = function (opts) {
    return new SpreadSheet(opts);
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3NwcmVhZHNoZWV0X2pzX3NwcmVhZHNoZWV0X2pzLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQWE7O0FBRTZDO0FBQzlCO0FBQ0k7QUFDQTtBQUNBOztBQUVoQzs7QUFFQSwwQkFBMEIsZ0VBQWE7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsWUFBWTtBQUN2Qyw0QkFBNEIsWUFBWTtBQUN4QztBQUNBLGdDQUFnQyxZQUFZO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsVUFBVTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEIsd0NBQXdDLDBCQUEwQjtBQUNsRTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCLDZDQUFNOztBQUUzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLFlBQVk7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0QkFBNEIsWUFBWTtBQUN4QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QywwQkFBMEI7QUFDeEUsZ0NBQWdDLGFBQWE7QUFDN0M7QUFDQSxVQUFVLFlBQVksSUFBSTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixJQUFJLFVBQVUsWUFBWSxVQUFVLFlBQVk7QUFDNUUsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixRQUFRLEVBQUUsTUFBTSxFQUFFLFVBQVUsS0FBSyxLQUFLO0FBQ3BFLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDViwrQkFBK0IsUUFBUSxFQUFFLE1BQU0sRUFBRSxVQUFVLFVBQVUsS0FBSztBQUMxRSxrQkFBa0IsWUFBWTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixFQUFFLGFBQWEsRUFBRTtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsK0RBQStEO0FBQy9ELG9DQUFvQyxJQUFJO0FBQ3hDO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3NwcmVhZHNoZWV0L2Nzcy9zcHJlYWRzaGVldC5jc3M/ZWVhNCIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3NwcmVhZHNoZWV0L2pzL3NwcmVhZHNoZWV0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2VcIjtcbmltcG9ydCBqZXhjZWwgZnJvbSBcImpleGNlbFwiO1xuaW1wb3J0IFwiLi4vY3NzL3NwcmVhZHNoZWV0LmNzc1wiO1xuaW1wb3J0IFwiLi4vY3NzL3NwcmVhZHNoZWV0LmNzc1wiO1xuaW1wb3J0IFwiamV4Y2VsL2Rpc3QvamV4Y2VsLmNzc1wiO1xuXG53aW5kb3cuc3NMaXN0ID0ge307XG5cbmNsYXNzIFNwcmVhZFNoZWV0IGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgbGV0IG9yaWcgPSBvcHRzLm9yaWc7XG4gICAgICAgIHRoaXMuZGl2X2lkID0gb3JpZy5pZDtcbiAgICAgICAgdGhpcy5zaGVldF9pZCA9IGAke3RoaXMuZGl2X2lkfV9zaGVldGA7XG4gICAgICAgIHRoaXMuZGF0YSA9IGV2YWwoYCR7dGhpcy5kaXZfaWR9X2RhdGFgKTtcbiAgICAgICAgdGhpcy5hdXRvZ3JhZGUgPSAkKG9yaWcpLmRhdGEoXCJhdXRvZ3JhZGVcIik7XG4gICAgICAgIHRoaXMuc3VmZml4ID0gd2luZG93W2Ake3RoaXMuZGl2X2lkfV9hc3NlcnRzYF07XG4gICAgICAgIHRoaXMubWluZGltZW5zaW9ucyA9ICQob3JpZykuZGF0YShcIm1pbmRpbWVuc2lvbnNcIik7XG4gICAgICAgIHRoaXMuY29sd2lkdGhzID0gJChvcmlnKS5kYXRhKFwiY29sd2lkdGhzXCIpO1xuICAgICAgICB0aGlzLmNvbHRpdGxlcyA9IGV2YWwoJChvcmlnKS5kYXRhKFwiY29sdGl0bGVzXCIpKTtcbiAgICAgICAgdGhpcy5tYXhIZWlnaHQgPSA1MDtcbiAgICAgICAgLy8gUmVuZGVyIHRoZSBjb21wb25lbnRzXG4gICAgICAgIHRoaXMucmVuZGVyU2hlZXQoKTtcblxuICAgICAgICBpZiAodGhpcy5hdXRvZ3JhZGUpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkQXV0b0dyYWRlQnV0dG9uKCk7XG4gICAgICAgICAgICB0aGlzLmFkZE91dHB1dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYXB0aW9uID0gXCJTcHJlYWRzaGVldFwiO1xuICAgICAgICB0aGlzLmRpdmlkID0gdGhpcy5kaXZfaWQ7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5kaXZfaWQpO1xuICAgICAgICB0aGlzLmFkZENhcHRpb24oXCJydW5lc3RvbmVcIik7XG4gICAgICAgIHRoaXMuaW5kaWNhdGVfY29tcG9uZW50X3JlYWR5KCk7XG4gICAgfVxuXG4gICAgcmVuZGVyU2hlZXQoKSB7XG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnNoZWV0X2lkKTtcbiAgICAgICAgbGV0IG9wdHMgPSB7IGRhdGE6IHRoaXMuZGF0YSwgdGFibGVIZWlnaHQ6IHRoaXMubWF4SGVpZ2h0IH07XG4gICAgICAgIGlmICh0aGlzLm1pbmRpbWVuc2lvbnMpIHtcbiAgICAgICAgICAgIG9wdHMubWluRGltZW5zaW9ucyA9IHRoaXMubWluZGltZW5zaW9ucztcbiAgICAgICAgfVxuICAgICAgICBvcHRzLmNvbHVtbnMgPSBbXTtcbiAgICAgICAgaWYgKHRoaXMuY29sd2lkdGhzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB3IG9mIHRoaXMuY29sd2lkdGhzKSB7XG4gICAgICAgICAgICAgICAgb3B0cy5jb2x1bW5zLnB1c2goeyB3aWR0aDogdyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jb2x0aXRsZXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gdGhpcy5jb2x0aXRsZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAob3B0cy5jb2x1bW5zW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdHMuY29sdW1uc1tpXS50aXRsZSA9IHVuZXNjYXBlKHRoaXMuY29sdGl0bGVzW2ldKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvcHRzLmNvbHVtbnMucHVzaCh7IHRpdGxlOiB0aGlzLmNvbHRpdGxlc1tpXSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRhYmxlID0gamV4Y2VsKGRpdiwgb3B0cyk7XG5cbiAgICAgICAgLy8gU2V0IGJhY2tncm91bmQgb2YgY2VsbHMgdGhhdCBhcmUgYXV0b2dyYWRlZFxuICAgICAgICBpZiAodGhpcy5zdWZmaXgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHRlc3Qgb2YgdGhpcy5zdWZmaXgpIHtcbiAgICAgICAgICAgICAgICBsZXQgYXNzZXJ0LCBsb2MsIG9wZXIsIGV4cGVjdGVkO1xuICAgICAgICAgICAgICAgIFthc3NlcnQsIGxvYywgb3BlciwgZXhwZWN0ZWRdID0gdGVzdC5zcGxpdCgvXFxzKy8pO1xuICAgICAgICAgICAgICAgICQoYCMke3RoaXMuZGl2X2lkfV9zaGVldGApXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKHRoaXMuZ2V0Q2VsbFNlbGVjdG9yKGxvYykpXG4gICAgICAgICAgICAgICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIFwiI2Q0ZTNmZlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZEF1dG9HcmFkZUJ1dHRvbigpIHtcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZGl2X2lkKTtcbiAgICAgICAgdmFyIGJ1dHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAkKGJ1dHQpLnRleHQoXCJDaGVja1wiKTtcbiAgICAgICAgJChidXR0KS5hZGRDbGFzcyhcImJ0biBidG4tc3VjY2VzcyBydW4tYnV0dG9uXCIpO1xuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoYnV0dCk7XG4gICAgICAgIHRoaXMuZ3JhZGVCdXR0b24gPSBidXR0O1xuICAgICAgICAkKGJ1dHQpLmNsaWNrKHRoaXMuZG9BdXRvR3JhZGUuYmluZCh0aGlzKSk7XG4gICAgICAgICQoYnV0dCkuYXR0cihcInR5cGVcIiwgXCJidXR0b25cIik7XG4gICAgICAgICQoYnV0dCkuY3NzKFwiZGlzcGxheVwiLCBcImJsb2NrXCIpO1xuICAgIH1cblxuICAgIGFkZE91dHB1dCgpIHtcbiAgICAgICAgdGhpcy5vdXRwdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicHJlXCIpO1xuICAgICAgICB0aGlzLm91dHB1dC5pZCA9IGAke3RoaXMuZGl2X2lkfV9zdGRvdXRgO1xuICAgICAgICAkKHRoaXMub3V0cHV0KS5jc3MoXCJ2aXNpYmlsaXR5XCIsIFwiaGlkZGVuXCIpO1xuICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5kaXZfaWQpO1xuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQodGhpcy5vdXRwdXQpO1xuICAgIH1cblxuICAgIGRvQXV0b0dyYWRlKCkge1xuICAgICAgICBsZXQgdGVzdHMgPSB0aGlzLnN1ZmZpeDtcbiAgICAgICAgdGhpcy5wYXNzZWQgPSAwO1xuICAgICAgICB0aGlzLmZhaWxlZCA9IDA7XG4gICAgICAgIC8vIFRlc3RzIHNob3VsZCBiZSBvZiB0aGUgZm9ybVxuICAgICAgICAvLyBhc3NlcnQgY2VsbCBvcGVyIHZhbHVlIGZvciBleGFtcGxlXG4gICAgICAgIC8vIGFzc2VydCBBNCA9PSAzXG4gICAgICAgIGxldCByZXN1bHQgPSBcIlwiO1xuICAgICAgICB0ZXN0cyA9IHRlc3RzLmZpbHRlcihmdW5jdGlvbiAocykge1xuICAgICAgICAgICAgcmV0dXJuIHMuaW5kZXhPZihcImFzc2VydFwiKSA+IC0xO1xuICAgICAgICB9KTtcbiAgICAgICAgZm9yIChsZXQgdGVzdCBvZiB0ZXN0cykge1xuICAgICAgICAgICAgbGV0IGFzc2VydCwgbG9jLCBvcGVyLCBleHBlY3RlZDtcbiAgICAgICAgICAgIFthc3NlcnQsIGxvYywgb3BlciwgZXhwZWN0ZWRdID0gdGVzdC5zcGxpdCgvXFxzKy8pO1xuICAgICAgICAgICAgcmVzdWx0ICs9IHRoaXMudGVzdE9uZUFzc2VydChsb2MsIG9wZXIsIGV4cGVjdGVkKTtcbiAgICAgICAgICAgIHJlc3VsdCArPSBcIlxcblwiO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwY3QgPSAoMTAwICogdGhpcy5wYXNzZWQpIC8gKHRoaXMucGFzc2VkICsgdGhpcy5mYWlsZWQpO1xuICAgICAgICBwY3QgPSBwY3QudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7IG1heGltdW1GcmFjdGlvbkRpZ2l0czogMiB9KTtcbiAgICAgICAgcmVzdWx0ICs9IGBZb3UgcGFzc2VkICR7dGhpcy5wYXNzZWR9IG91dCBvZiAke1xuICAgICAgICAgICAgdGhpcy5wYXNzZWQgKyB0aGlzLmZhaWxlZFxuICAgICAgICB9IHRlc3RzIGZvciAke3BjdH0lYDtcbiAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgZXZlbnQ6IFwidW5pdHRlc3RcIixcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZfaWQsXG4gICAgICAgICAgICBjb3Vyc2U6IGVCb29rQ29uZmlnLmNvdXJzZSxcbiAgICAgICAgICAgIGFjdDogYHBlcmNlbnQ6JHtwY3R9OnBhc3NlZDoke3RoaXMucGFzc2VkfTpmYWlsZWQ6JHt0aGlzLmZhaWxlZH1gLFxuICAgICAgICB9KTtcbiAgICAgICAgJCh0aGlzLm91dHB1dCkuY3NzKFwidmlzaWJpbGl0eVwiLCBcInZpc2libGVcIik7XG4gICAgICAgICQodGhpcy5vdXRwdXQpLnRleHQocmVzdWx0KTtcbiAgICB9XG5cbiAgICB0ZXN0T25lQXNzZXJ0KGNlbGwsIG9wZXIsIGV4cGVjdGVkKSB7XG4gICAgICAgIGxldCBhY3R1YWwgPSB0aGlzLmdldENlbGxEaXNwbGF5VmFsdWUoY2VsbCk7XG4gICAgICAgIGNvbnN0IG9wZXJhdG9ycyA9IHtcbiAgICAgICAgICAgIFwiPT1cIjogZnVuY3Rpb24gKG9wZXJhbmQxLCBvcGVyYW5kMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcGVyYW5kMSA9PSBvcGVyYW5kMjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIiE9XCI6IGZ1bmN0aW9uIChvcGVyYW5kMSwgb3BlcmFuZDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3BlcmFuZDEgIT0gb3BlcmFuZDI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCI+XCI6IGZ1bmN0aW9uIChvcGVyYW5kMSwgb3BlcmFuZDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3BlcmFuZDEgPiBvcGVyYW5kMjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIjxcIjogZnVuY3Rpb24gKG9wZXJhbmQxLCBvcGVyYW5kMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcGVyYW5kMSA+IG9wZXJhbmQyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgcmVzID0gb3BlcmF0b3JzW29wZXJdKGFjdHVhbCwgZXhwZWN0ZWQpO1xuICAgICAgICBsZXQgb3V0cHV0ID0gXCJcIjtcbiAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgICAgb3V0cHV0ID0gYFBhc3M6ICR7YWN0dWFsfSAke29wZXJ9ICR7ZXhwZWN0ZWR9IGluICR7Y2VsbH1gO1xuICAgICAgICAgICAgJChgIyR7dGhpcy5kaXZfaWR9X3NoZWV0YClcbiAgICAgICAgICAgICAgICAuZmluZCh0aGlzLmdldENlbGxTZWxlY3RvcihjZWxsKSlcbiAgICAgICAgICAgICAgICAuY3NzKFwiYmFja2dyb3VuZC1jb2xvclwiLCBcIiNjY2ZmY2NcIik7XG4gICAgICAgICAgICB0aGlzLnBhc3NlZCsrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0cHV0ID0gYEZhaWxlZCAke2FjdHVhbH0gJHtvcGVyfSAke2V4cGVjdGVkfSBpbiBjZWxsICR7Y2VsbH1gO1xuICAgICAgICAgICAgJChgIyR7dGhpcy5kaXZfaWR9X3NoZWV0YClcbiAgICAgICAgICAgICAgICAuZmluZCh0aGlzLmdldENlbGxTZWxlY3RvcihjZWxsKSlcbiAgICAgICAgICAgICAgICAuY3NzKFwiYmFja2dyb3VuZC1jb2xvclwiLCBcIiNmZjk5ODBcIik7XG4gICAgICAgICAgICB0aGlzLmZhaWxlZCsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIGNlbGwgY29udGFpbnMgYSBmb3JtdWxhLCB0aGlzIGNhbGwgd2lsbCByZXR1cm4gdGhlIGZvcm11bGEgbm90IHRoZSBjb21wdXRlZCB2YWx1ZVxuICAgIGdldENlbGxTb3VyY2UoY2VsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy50YWJsZS5nZXRWYWx1ZShjZWxsKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgY2VsbCBjb250YWlucyBhIGZvcm11bGEgdGhpcyBjYWxsIHdpbGwgcmV0dXJuIHRoZSBjb21wdXRlZCB2YWx1ZVxuICAgIGdldENlbGxEaXNwbGF5VmFsdWUoY2VsbCkge1xuICAgICAgICBsZXQgcmVzID0gdGhpcy50YWJsZS5lbC5xdWVyeVNlbGVjdG9yKHRoaXMuZ2V0Q2VsbFNlbGVjdG9yKGNlbGwpKTtcbiAgICAgICAgcmV0dXJuIHJlcy5pbm5lclRleHQ7XG4gICAgfVxuXG4gICAgZ2V0Q2VsbFNlbGVjdG9yKGNlbGwpIHtcbiAgICAgICAgbGV0IHBhcnRzID0gY2VsbC5tYXRjaCgvXFwkPyhbQS1aXSspXFwkPyhbMC05XSspLyk7XG4gICAgICAgIGxldCB4ID0gdGhpcy5jb2x1bW5Ub0luZGV4KHBhcnRzWzFdKTtcbiAgICAgICAgbGV0IHkgPSBwYXJ0c1syXSAtIDE7XG4gICAgICAgIHJldHVybiBgW2RhdGEteD1cIiR7eH1cIl1bZGF0YS15PVwiJHt5fVwiXWA7XG4gICAgfVxuICAgIGNvbHVtblRvSW5kZXgoY29sTmFtZSkge1xuICAgICAgICAvLyBDb252ZXJ0IHRoZSBjb2x1bW4gbmFtZSB0byBhIG51bWJlciBBID0gMCBBQSA9IDI2IEJBID0gNTIsIGV0Y1xuICAgICAgICBsZXQgYmFzZSA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpcIjtcbiAgICAgICAgbGV0IHJlc3VsdCA9IDA7XG5cbiAgICAgICAgZm9yIChcbiAgICAgICAgICAgIGxldCBpID0gMCwgaiA9IGNvbE5hbWUubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIGkgPCBjb2xOYW1lLmxlbmd0aDtcbiAgICAgICAgICAgIGkgKz0gMSwgaiAtPSAxXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmVzdWx0ICs9IE1hdGgucG93KGJhc2UubGVuZ3RoLCBqKSAqIChiYXNlLmluZGV4T2YoY29sTmFtZVtpXSkgKyAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQgLSAxO1xuICAgIH1cbn1cblxuJChkb2N1bWVudCkub24oXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuICAgICQoXCJbZGF0YS1jb21wb25lbnQ9c3ByZWFkc2hlZXRdXCIpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIC8vIE1DXG4gICAgICAgIHZhciBvcHRzID0ge1xuICAgICAgICAgICAgb3JpZzogdGhpcyxcbiAgICAgICAgICAgIHVzZVJ1bmVzdG9uZVNlcnZpY2VzOiBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyxcbiAgICAgICAgfTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHdpbmRvdy5zc0xpc3RbdGhpcy5pZF0gPSBuZXcgU3ByZWFkU2hlZXQob3B0cyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHJlbmRlcmluZyBTcHJlYWRTaGVldCBQcm9ibGVtICR7dGhpcy5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICBEZXRhaWxzOiAke2Vycn1gKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVyci5zdGFjayk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5LnNwcmVhZHNoZWV0ID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICByZXR1cm4gbmV3IFNwcmVhZFNoZWV0KG9wdHMpO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==