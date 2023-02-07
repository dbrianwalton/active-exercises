(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_fitb_js_timedfitb_js"],{

/***/ 68007:
/*!*************************************!*\
  !*** ./runestone/fitb/css/fitb.css ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 86151:
/*!*******************************************!*\
  !*** ./runestone/fitb/js/fitb-i18n.en.js ***!
  \*******************************************/
/***/ (() => {

$.i18n().load({
    en: {
        msg_no_answer: "No answer provided.",
        msg_fitb_check_me: "Check me",
        msg_fitb_compare_me: "Compare me",
        msg_fitb_randomize: "Randomize"
    },
});


/***/ }),

/***/ 61353:
/*!**********************************************!*\
  !*** ./runestone/fitb/js/fitb-i18n.pt-br.js ***!
  \**********************************************/
/***/ (() => {

$.i18n().load({
    "pt-br": {
        msg_no_answer: "Nenhuma resposta dada.",
        msg_fitb_check_me: "Verificar",
        msg_fitb_compare_me: "Comparar"
    },
});


/***/ }),

/***/ 91004:
/*!*****************************************!*\
  !*** ./runestone/fitb/js/fitb-utils.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "checkAnswersCore": () => (/* binding */ checkAnswersCore),
/* harmony export */   "renderDynamicContent": () => (/* binding */ renderDynamicContent),
/* harmony export */   "renderDynamicFeedback": () => (/* binding */ renderDynamicFeedback)
/* harmony export */ });
// ********************************************************
// |docname| - grading-related utilities for FITB questions
// ********************************************************
// This code runs both on the server (for server-side grading) and on the client. It's placed here as a set of functions specifically for this purpose.



// Includes
// ========
// None.
//
//
// Globals
// =======
function render_html(html_in, dyn_vars_eval) {
    // Change the replacement tokens in the HTML into tags, so we can replace them using XML. The horrible regex is:
    //
    // Look for the characters ``[%=`` (the opening delimiter)
    /// \[%=
    // Followed by any amount of whitespace.
    /// \s*
    // Start a group that will capture the contents (excluding whitespace) of the tokens. For example, given ``[%= foo() %]``, the contents is ``foo()``.
    /// (
    // Don't capture the contents of this group, since it's only a single character. Match any character...
    /// (
    /// ?:.
    /// ...that doesn't end with ``%]`` (the closing delimiter).
    /// (?!%])
    /// )
    // Match this (anything but the closing delimiter) as much as we can.
    /// *)
    // Next, look for any whitespace.
    /// \s*
    // Finally, look for the closing delimiter ``%]``.
    /// %\]
    const html_replaced = html_in.replaceAll(
        /\[%=\s*((?:.(?!%]))*)\s*%\]/g,
        // Replace it with a `<script-eval>` tag. Quote the string, which will automatically escape any double quotes, using JSON.
        (match, group1) =>
            `<script-eval expr=${JSON.stringify(group1)}></script-eval>`
    );
    // Given HTML, turn it into a DOM. Walk the ``<script-eval>`` tags, performing the requested evaluation on them.
    //
    // See `DOMParser <https://developer.mozilla.org/en-US/docs/Web/API/DOMParser>`_.
    const parser = new DOMParser();
    // See `DOMParser.parseFromString() <https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString>`_.
    const doc = parser.parseFromString(html_replaced, "text/html");
    const script_eval_tags = doc.getElementsByTagName("script-eval");
    while (script_eval_tags.length) {
        // Get the first tag. It will be removed from the collection after it's replaced with its value.
        const script_eval_tag = script_eval_tags[0];
        // See if this ``<script-eval>`` tag has as ``@expr`` attribute.
        const expr = script_eval_tag.getAttribute("expr");
        // If so, evaluate it.
        if (expr) {
            const eval_result = window.Function(
                "v",
                ...Object.keys(dyn_vars_eval),
                `"use strict;"\nreturn ${expr};`
            )(dyn_vars_eval, ...Object.values(dyn_vars_eval));
            // Replace the tag with the resulting value.
            script_eval_tag.replaceWith(eval_result);
        }
    }

    // Return the body contents. Note that the ``DOMParser`` constructs an entire document, not just the document fragment we passed it. Therefore, extract the desired fragment and return that. Note that we need to use `childNodes <https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes>`_, which includes non-element children like text and comments; using ``children`` omits these non-element children.
    return doc.body.childNodes;
}

// Functions
// =========
// Update the problem's description based on dynamically-generated content.
function renderDynamicContent(
    seed,
    dyn_vars,
    html_in,
    divid,
    prepareCheckAnswers
) {
    // Initialize RNG with ``seed``. Taken from `SO <https://stackoverflow.com/a/47593316/16038919>`_.
    const rand = (function mulberry32(a) {
        return function () {
            let t = (a += 0x6d2b79f5);
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    })(seed);

    // See `RAND_FUNC <RAND_FUNC>`_, which refers to ``rand`` above.
    const dyn_vars_eval = window.Function(
        "v",
        "rand",
        "seed",
        `"use strict";\n${dyn_vars};\nreturn v;`
    )({ divid: divid, prepareCheckAnswers: prepareCheckAnswers }, rand, seed);

    let html_out;
    if (typeof dyn_vars_eval.beforeContentRender === "function") {
        try {
            dyn_vars_eval.beforeContentRender(dyn_vars_eval);
        } catch (err) {
            console.log(
                `Error in problem ${divid} invoking beforeContentRender`
            );
            throw err;
        }
    }
    try {
        html_out = render_html(html_in, dyn_vars_eval);
    } catch (err) {
        console.log(`Error rendering problem ${divid} text using EJS`);
        throw err;
    }

    // the afterContentRender event will be called by the caller of this function (after it updated the HTML based on the contents of html_out).
    return [html_out, dyn_vars_eval];
}

// Given student answers, grade them and provide feedback.
//
// Outputs:
//
// -    ``displayFeed`` is an array of HTML feedback.
// -    ``isCorrectArray`` is an array of true, false, or null (the question wasn't answered).
// -    ``correct`` is true, false, or null (the question wasn't answered).
// -    ``percent`` is the percentage of correct answers (from 0 to 1, not 0 to 100).
function checkAnswersCore(
    // _`blankNamesDict`: An dict of {blank_name, blank_index} specifying the name for each named blank.
    blankNamesDict,
    // _`given_arr`: An array of strings containing student-provided answers for each blank.
    given_arr,
    // A 2-D array of strings giving feedback for each blank.
    feedbackArray,
    // _`dyn_vars_eval`: A dict produced by evaluating the JavaScript for a dynamic exercise.
    dyn_vars_eval
) {
    if (
        dyn_vars_eval &&
        typeof dyn_vars_eval.beforeCheckAnswers === "function"
    ) {
        const [namedBlankValues, given_arr_converted] = parseAnswers(
            blankNamesDict,
            given_arr,
            dyn_vars_eval
        );
        const dve_blanks = Object.assign({}, dyn_vars_eval, namedBlankValues);
        try {
            dyn_vars_eval.beforeCheckAnswers(dve_blanks, given_arr_converted);
        } catch (err) {
            console.log("Error calling beforeCheckAnswers");
            throw err;
        }
    }

    // Keep track if all answers are correct or not.
    let correct = true;
    const isCorrectArray = [];
    const displayFeed = [];
    for (let i = 0; i < given_arr.length; i++) {
        const given = given_arr[i];
        // If this blank is empty, provide no feedback for it.
        if (given === "") {
            isCorrectArray.push(null);
            // TODO: was $.i18n("msg_no_answer").
            displayFeed.push("No answer provided.");
            correct = false;
        } else {
            // Look through all feedback for this blank. The last element in the array always matches. If no feedback for this blank exists, use an empty list.
            const fbl = feedbackArray[i] || [];
            let j;
            for (j = 0; j < fbl.length; j++) {
                // The last item of feedback always matches.
                if (j === fbl.length - 1) {
                    displayFeed.push(fbl[j]["feedback"]);
                    break;
                }
                // If this is a dynamic solution...
                if (dyn_vars_eval) {
                    const [namedBlankValues, given_arr_converted] =
                        parseAnswers(blankNamesDict, given_arr, dyn_vars_eval);
                    // If there was a parse error, then it student's answer is incorrect.
                    if (given_arr_converted[i] instanceof TypeError) {
                        displayFeed.push(given_arr_converted[i].message);
                        // Count this as wrong by making j != 0 -- see the code that runs immediately after the executing the break.
                        j = 1;
                        break;
                    }
                    // Create a function to wrap the expression to evaluate. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function.
                    // Pass the answer, array of all answers, then all entries in ``this.dyn_vars_eval`` dict as function parameters.
                    const is_equal = window.Function(
                        "ans",
                        "ans_array",
                        ...Object.keys(dyn_vars_eval),
                        ...Object.keys(namedBlankValues),
                        `"use strict;"\nreturn ${fbl[j]["solution_code"]};`
                    )(
                        given_arr_converted[i],
                        given_arr_converted,
                        ...Object.values(dyn_vars_eval),
                        ...Object.values(namedBlankValues)
                    );
                    // If student's answer is equal to this item, then append this item's feedback.
                    if (is_equal) {
                        displayFeed.push(
                            typeof is_equal === "string"
                                ? is_equal
                                : fbl[j]["feedback"]
                        );
                        break;
                    }
                } else {
                    // If this is a regexp...
                    if ("regex" in fbl[j]) {
                        const patt = RegExp(
                            fbl[j]["regex"],
                            fbl[j]["regexFlags"]
                        );
                        if (patt.test(given)) {
                            displayFeed.push(fbl[j]["feedback"]);
                            break;
                        }
                    } else {
                        // This is a number.
                        console.assert("number" in fbl[j]);
                        const [min, max] = fbl[j]["number"];
                        // Convert the given string to a number. While there are `lots of ways <https://coderwall.com/p/5tlhmw/converting-strings-to-number-in-javascript-pitfalls>`_ to do this; this version supports other bases (hex/binary/octal) as well as floats.
                        const actual = +given;
                        if (actual >= min && actual <= max) {
                            displayFeed.push(fbl[j]["feedback"]);
                            break;
                        }
                    }
                }
            }

            // The answer is correct if it matched the first element in the array. A special case: if only one answer is provided, count it wrong; this is a misformed problem.
            const is_correct = j === 0 && fbl.length > 1;
            isCorrectArray.push(is_correct);
            if (!is_correct) {
                correct = false;
            }
        }
    }

    if (
        dyn_vars_eval &&
        typeof dyn_vars_eval.afterCheckAnswers === "function"
    ) {
        const [namedBlankValues, given_arr_converted] = parseAnswers(
            blankNamesDict,
            given_arr,
            dyn_vars_eval
        );
        const dve_blanks = Object.assign({}, dyn_vars_eval, namedBlankValues);
        try {
            dyn_vars_eval.afterCheckAnswers(dve_blanks, given_arr_converted);
        } catch (err) {
            console.log("Error calling afterCheckAnswers");
            throw err;
        }
    }

    const percent =
        isCorrectArray.filter(Boolean).length / isCorrectArray.length;
    return [displayFeed, correct, isCorrectArray, percent];
}

// Use the provided parsers to convert a student's answers (as strings) to the type produced by the parser for each blank.
function parseAnswers(
    // See blankNamesDict_.
    blankNamesDict,
    // See given_arr_.
    given_arr,
    // See `dyn_vars_eval`.
    dyn_vars_eval
) {
    // Provide a dict of {blank_name, converter_answer_value}.
    const namedBlankValues = getNamedBlankValues(
        given_arr,
        blankNamesDict,
        dyn_vars_eval
    );
    // Invert blankNamedDict: compute an array of [blank_0_name, ...]. Note that the array may be sparse: it only contains values for named blanks.
    const given_arr_names = [];
    for (const [k, v] of Object.entries(blankNamesDict)) {
        given_arr_names[v] = k;
    }
    // Compute an array of [converted_blank_0_val, ...]. Note that this re-converts all the values, rather than (possibly deep) copying the values from already-converted named blanks.
    const given_arr_converted = given_arr.map((value, index) =>
        type_convert(given_arr_names[index], value, index, dyn_vars_eval)
    );

    return [namedBlankValues, given_arr_converted];
}

// Render the feedback for a dynamic problem.
function renderDynamicFeedback(
    // See blankNamesDict_.
    blankNamesDict,
    // See given_arr_.
    given_arr,
    // The index of this blank in given_arr_.
    index,
    // The feedback for this blank, containing a template to be rendered.
    displayFeed_i,
    // See dyn_vars_eval_.
    dyn_vars_eval
) {
    // Use the answer, an array of all answers, the value of all named blanks, and all solution variables for the template.
    const namedBlankValues = getNamedBlankValues(
        given_arr,
        blankNamesDict,
        dyn_vars_eval
    );
    const sol_vars_plus = Object.assign(
        {
            ans: given_arr[index],
            ans_array: given_arr,
        },
        dyn_vars_eval,
        namedBlankValues
    );
    try {
        displayFeed_i = render_html(displayFeed_i, sol_vars_plus);
    } catch (err) {
        console.log(`Error evaluating feedback index ${index}.`);
        throw err;
    }

    return displayFeed_i;
}

// Utilities
// ---------
// For each named blank, get the value for the blank: the value of each ``blankName`` gives the index of the blank for that name.
function getNamedBlankValues(given_arr, blankNamesDict, dyn_vars_eval) {
    const namedBlankValues = {};
    for (const [blank_name, blank_index] of Object.entries(blankNamesDict)) {
        namedBlankValues[blank_name] = type_convert(
            blank_name,
            given_arr[blank_index],
            blank_index,
            dyn_vars_eval
        );
    }
    return namedBlankValues;
}

// Convert a value given its type.
function type_convert(name, value, index, dyn_vars_eval) {
    // The converter can be defined by index, name, or by a single value (which applies to all blanks). If not provided, just pass the data through.
    const types = dyn_vars_eval.types || pass_through;
    const converter = types[name] || types[index] || types;
    // ES5 hack: it doesn't support binary values, and js2py doesn't allow me to override the ``Number`` class. So, define the workaround class ``Number_`` and use it if available.
    if (converter === Number && typeof Number_ !== "undefined") {
        converter = Number_;
    }

    // Return the converted type. If the converter raises a TypeError, return that; it will be displayed to the user, since we assume type errors are a way for the parser to explain to the user why the parse failed. For all other errors, re-throw it since something went wrong.
    try {
        return converter(value);
    } catch (err) {
        if (err instanceof TypeError) {
            return err;
        } else {
            throw err;
        }
    }
}

// A pass-through "converter".
function pass_through(val) {
    return val;
}


/***/ }),

/***/ 99184:
/*!***********************************!*\
  !*** ./runestone/fitb/js/fitb.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FITBList": () => (/* binding */ FITBList),
/* harmony export */   "default": () => (/* binding */ FITB)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 2568);
/* harmony import */ var _fitb_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fitb-utils.js */ 91004);
/* harmony import */ var _fitb_i18n_en_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fitb-i18n.en.js */ 86151);
/* harmony import */ var _fitb_i18n_en_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_fitb_i18n_en_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _fitb_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fitb-i18n.pt-br.js */ 61353);
/* harmony import */ var _fitb_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_fitb_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _css_fitb_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../css/fitb.css */ 68007);
// ***********************************************
// |docname| -- fill-in-the-blank client-side code
// ***********************************************
// This file contains the JS for the Runestone fillintheblank component. It was created By Isaiah Mayerchak and Kirby Olson, 6/4/15 then revised by Brad Miller, 2/7/20.
//
// Data storage notes
// ==================
//
// Initial problem restore
// -----------------------
// In the constructor, this code (the client) restores the problem by calling ``checkServer``. To do so, either the server sends or local storage has:
//
// -    seed (used only for dynamic problems)
// -    answer
// -    displayFeed (server-side grading only; otherwise, this is generated locally by client code)
// -    correct (SSG)
// -    isCorrectArray (SSG)
// -    problemHtml (SSG with dynamic problems only)
//
// If any of the answers are correct, then the client shows feedback. This is implemented in restoreAnswers_.
//
// Grading
// -------
// When the user presses the "Check me" button, the logCurrentAnswer_ function:
//
// -    Saves the following to local storage:
//
//      -   seed
//      -   answer
//      -   timestamp
//      -   problemHtml
//
//      Note that there's no point in saving displayFeed, correct, or isCorrectArray, since these values applied to the previous answer, not the new answer just submitted.
//
// -    Sends the following to the server; stop after this for client-side grading:
//
//      -   seed (ignored for server-side grading)
//      -   answer
//      -   correct (ignored for SSG)
//      -   percent (ignored for SSG)
//
// -    Receives the following from the server:
//
//      -   timestamp
//      -   displayFeed
//      -   correct
//      -   isCorrectArray
//
// -    Saves the following to local storage:
//
//      -   seed
//      -   answer
//      -   timestamp
//      -   displayFeed (SSG only)
//      -   correct (SSG only)
//      -   isCorrectArray (SSG only)
//      -   problemHtml
//
// Randomize
// ---------
// When the user presses the "Randomize" button (which is only available for dynamic problems), the randomize_ function:
//
// -    For the client-side case, sets the seed to a new, random value. For the server-side case, requests a new seed and problemHtml from the server.
// -    Sets the answer to an array of empty strings.
// -    Saves the usual local data.









// Object containing all instances of FITB that aren't a child of a timed assessment.
var FITBList = {};

// FITB constructor
class FITB extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(opts) {
    super(opts);
    var orig = opts.orig; // entire <p> element
    this.useRunestoneServices = opts.useRunestoneServices;
    this.origElem = orig;
    this.divid = orig.id;
    this.correct = null;
    // See comments in fitb.py for the format of ``feedbackArray`` (which is identical in both files).
    //
    // Find the script tag containing JSON and parse it. See `SO <https://stackoverflow.com/questions/9320427/best-practice-for-embedding-arbitrary-json-in-the-dom>`__. If this tag doesn't exist, then no feedback is available; server-side grading will be performed.
    //
    // A destructuring assignment would be perfect, but they don't work with ``this.blah`` and ``with`` statements aren't supported in strict mode.
    const json_element = this.scriptSelector(this.origElem);
    const dict_ = JSON.parse(json_element.html());
    json_element.remove();
    this.problemHtml = dict_.problemHtml;
    this.dyn_vars = dict_.dyn_vars;
    this.blankNames = dict_.blankNames;
    this.feedbackArray = dict_.feedbackArray;
    if (dict_.static_seed !== undefined) {
        this.seed = dict_.static_seed;
        window.localStorage.clear();
    }

    this.createFITBElement();
    this.setupBlanks();
    this.caption = "Fill in the Blank";
    this.addCaption("runestone");
    this.checkServer("fillb", false).then(() => {
      // If there's no seed for a client-side dynamic problem after this check, create one and render it.
      if (typeof this.dyn_vars === "string" && this.seed === undefined) {
        this.randomize();
      } else {
        this.renderDynamicContent();
      }
      this.indicate_component_ready();
    });
    if (typeof Prism !== "undefined") {
	    Prism.highlightAllUnder(this.containerDiv);
	}
  }
  // Find the script tag containing JSON in a given root DOM node.
  scriptSelector(root_node) {
    return $(root_node).find(`script[type="application/json"]`);
  }
  /*===========================================
    ====   Functions generating final HTML   ====
    ===========================================*/
  createFITBElement() {
    this.renderFITBInput();
    this.renderFITBButtons();
    this.renderFITBFeedbackDiv();
    // replaces the intermediate HTML for this component with the rendered HTML of this component
    $(this.origElem).replaceWith(this.containerDiv);
  }
  renderFITBInput() {
    // The text [input] elements are created by the template.
    this.containerDiv = document.createElement("div");
    this.containerDiv.id = this.divid;
    // Create another container which stores the problem description.
    this.descriptionDiv = document.createElement("div");
    this.containerDiv.appendChild(this.descriptionDiv);
    // Copy the original elements to the container holding what the user will see (client-side grading only).
    if (this.problemHtml) {
      this.descriptionDiv.innerHTML = this.problemHtml;
      // Save original HTML (with templates) used in dynamic problems.
      this.descriptionDiv.origInnerHTML = this.problemHtml;
    }
  }

  renderFITBButtons() {
    this.containerDiv.appendChild(document.createElement("br"));
    this.containerDiv.appendChild(document.createElement("br"));

    // "submit" button
    this.submitButton = document.createElement("button");
    this.submitButton.textContent = $.i18n("msg_fitb_check_me");
    $(this.submitButton).attr({
      class: "btn btn-success",
      name: "do answer",
      type: "button",
    });
    this.submitButton.addEventListener(
      "click",
      async function () {
        this.checkCurrentAnswer();
        await this.logCurrentAnswer();
      }.bind(this),
      false
    );
    this.containerDiv.appendChild(this.submitButton);

    // "compare me" button
    if (this.useRunestoneServices) {
      this.compareButton = document.createElement("button");
      $(this.compareButton).attr({
        class: "btn btn-default",
        id: this.origElem.id + "_bcomp",
        disabled: "",
        name: "compare",
      });
      this.compareButton.textContent = $.i18n("msg_fitb_compare_me");
      this.compareButton.addEventListener(
        "click",
        function () {
          this.compareFITBAnswers();
        }.bind(this),
        false
      );
      this.containerDiv.appendChild(this.compareButton);
    }

    // Randomize button for dynamic problems.
    if (this.dyn_vars) {
      this.randomizeButton = document.createElement("button");
      $(this.randomizeButton).attr({
        class: "btn btn-default",
        id: this.origElem.id + "_bcomp",
        name: "randomize",
      });
      this.randomizeButton.textContent = $.i18n("msg_fitb_randomize");
      this.randomizeButton.addEventListener(
        "click",
        function () {
          this.randomize();
        }.bind(this),
        false
      );
      this.containerDiv.appendChild(this.randomizeButton);
    }

    this.containerDiv.appendChild(document.createElement("div"));
  }
  renderFITBFeedbackDiv() {
    this.feedBackDiv = document.createElement("div");
    this.feedBackDiv.id = this.divid + "_feedback";
    this.containerDiv.appendChild(document.createElement("br"));
    this.containerDiv.appendChild(this.feedBackDiv);
  }

  clearFeedbackDiv() {
    // Setting the ``outerHTML`` removes this from the DOM. Use an alternative process -- remove the class (which makes it red/green based on grading) and content.
    this.feedBackDiv.innerHTML = "";
    this.feedBackDiv.className = "";
  }

  // Update the problem's description based on dynamically-generated content.
  renderDynamicContent() {
    // ``this.dyn_vars`` can be true; if so, don't render it, since the server does all the rendering.
    if (typeof this.dyn_vars === "string") {
      let html_nodes;
      [html_nodes, this.dyn_vars_eval] =
        (0,_fitb_utils_js__WEBPACK_IMPORTED_MODULE_1__.renderDynamicContent)(
          this.seed,
          this.dyn_vars,
          this.descriptionDiv.origInnerHTML,
          this.divid,
          this.prepareCheckAnswers.bind(this),
        );
      this.descriptionDiv.replaceChildren(...html_nodes);

      if (typeof (this.dyn_vars_eval.afterContentRender) === "function") {
        try {
          this.dyn_vars_eval.afterContentRender(this.dyn_vars_eval);
        } catch (err) {
          console.log(`Error in problem ${this.divid} invoking afterContentRender`);
          throw err;
        }
      }

      this.queueMathJax(this.descriptionDiv);
      this.setupBlanks();
    }
  }

  setupBlanks() {
    // Find and format the blanks. If a dynamic problem just changed the HTML, this will find the newly-created blanks.
    const ba = $(this.descriptionDiv).find(":input");
    ba.attr("class", "form form-control selectwidthauto");
    ba.attr("aria-label", "input area");
    this.blankArray = ba.toArray();
    for (let blank of this.blankArray) {
      $(blank).change(this.recordAnswered.bind(this));
    }
  }

  // This tells timed questions that the fitb blanks received some interaction.
  recordAnswered() {
    this.isAnswered = true;
  }

  /*===================================
    === Checking/loading from storage ===
    ===================================*/
  // _`restoreAnswers`: update the problem with data from the server or from local storage.
  restoreAnswers(data) {
    // Restore the seed first, since the dynamic render clears all the blanks.
    this.seed = data.seed;
    this.renderDynamicContent();

    var arr;
    // Restore answers from storage retrieval done in RunestoneBase.
    try {
      // The newer format encodes data as a JSON object.
      arr = JSON.parse(data.answer);
      // The result should be an array. If not, try comma parsing instead.
      if (!Array.isArray(arr)) {
        throw new Error();
      }
    } catch (err) {
      // The old format didn't.
      arr = (data.answer || "").split(",");
    }
    let hasAnswer = false;
    for (var i = 0; i < this.blankArray.length; i++) {
      $(this.blankArray[i]).attr("value", arr[i]);
      if (arr[i]) {
        hasAnswer = true;
      }
    }
    // Is this client-side grading, or server-side grading?
    if (this.feedbackArray) {
      // For client-side grading, re-generate feedback if there's an answer.
      if (hasAnswer) {
        this.checkCurrentAnswer();
      }
    } else {
      // For server-side grading, use the provided feedback from the server or local storage.
      this.displayFeed = data.displayFeed;
      this.correct = data.correct;
      this.isCorrectArray = data.isCorrectArray;
      // Only render if all the data is present; local storage might have old data missing some of these items.
      if (
        typeof this.displayFeed !== "undefined" &&
        typeof this.correct !== "undefined" &&
        typeof this.isCorrectArray !== "undefined"
      ) {
        this.renderFeedback();
      }
      // For server-side dynamic problems, show the rendered problem text.
      this.problemHtml = data.problemHtml;
      if (this.problemHtml) {
        this.descriptionDiv.innerHTML = this.problemHtml;
        this.queueMathJax(this.descriptionDiv);
        this.setupBlanks();
      }
    }
  }

  checkLocalStorage() {
    // Loads previous answers from local storage if they exist
    var storedData;
    if (this.graderactive) {
      return;
    }
    var len = localStorage.length;
    if (len > 0) {
      var ex = localStorage.getItem(this.localStorageKey());
      if (ex !== null) {
        try {
          storedData = JSON.parse(ex);
          var arr = storedData.answer;
        } catch (err) {
          // error while parsing; likely due to bad value stored in storage
          console.log(err.message);
          localStorage.removeItem(this.localStorageKey());
          return;
        }
        this.restoreAnswers(storedData);
      }
    }
  }

  setLocalStorage(data) {
    let key = this.localStorageKey();
    localStorage.setItem(key, JSON.stringify(data));
  }

  checkCurrentAnswer() {
    // Start of the evaluation chain
    this.isCorrectArray = [];
    this.displayFeed = [];
    const pca = this.prepareCheckAnswers();

    if (this.useRunestoneServices) {
      if (eBookConfig.enableCompareMe) {
        this.enableCompareButton();
      }
    }

    // Grade locally if we can't ask the server to grade.
    if (this.feedbackArray) {
      [
        // An array of HTML feedback.
        this.displayFeed,
        // true, false, or null (the question wasn't answered).
        this.correct,
        // An array of true, false, or null (the question wasn't answered).
        this.isCorrectArray,
        this.percent
      ] = (0,_fitb_utils_js__WEBPACK_IMPORTED_MODULE_1__.checkAnswersCore)(...pca);
      if (!this.isTimed) {
        this.renderFeedback();
      }
    }
  }

  // Inputs:
  //
  // - Strings entered by the student in ``this.blankArray[i].value``.
  // - Feedback in ``this.feedbackArray``.
  prepareCheckAnswers() {
    this.given_arr = [];
    for (var i = 0; i < this.blankArray.length; i++)
      this.given_arr.push(this.blankArray[i].value);
    return [this.blankNames, this.given_arr, this.feedbackArray, this.dyn_vars_eval];
  }

  // _`randomize`: This handles a click to the "Randomize" button.
  async randomize() {
    // Use the client-side case or the server-side case?
    if (this.feedbackArray) {
      // This is the client-side case.
      //
      this.seed = Math.floor(Math.random() * 2 ** 32);
      this.renderDynamicContent();
    } else {
      // This is the server-side case. Send a request to the `results <getAssessResults>` endpoint with ``new_seed`` set to True.
      const request = new Request("/assessment/results", {
        method: "POST",
        body: JSON.stringify({
          div_id: this.divid,
          course: eBookConfig.course,
          event: "fillb",
          sid: this.sid,
          new_seed: true,
        }),
        headers: this.jsonHeaders,
      });
      const response = await fetch(request);
      if (!response.ok) {
        alert(`HTTP error getting results: ${response.statusText}`);
        return;
      }
      const data = await response.json();
      const res = data.detail;
      this.seed = res.seed;
      this.descriptionDiv.innerHTML = res.problemHtml;
      this.queueMathJax(this.descriptionDiv);
      this.setupBlanks();
    }
    // When getting a new seed, clear all the old answers and feedback.
    this.given_arr = Array(this.blankArray.len).fill("");
    $(this.blankArray).attr("value", "");
    this.clearFeedbackDiv();
    this.saveAnswersLocallyOnly();
  }

  // Save the answers and associated data locally; don't save feedback provided by the server for this answer. It assumes that ``this.given_arr`` contains the current answers.
  saveAnswersLocallyOnly() {
    this.setLocalStorage({
      // The seed is used for client-side operation, but doesn't matter for server-side.
      seed: this.seed,
      answer: JSON.stringify(this.given_arr),
      timestamp: new Date(),
      // This is only needed for server-side grading with dynamic problems.
      problemHtml: this.descriptionDiv.innerHTML,
    });
  }

  // _`logCurrentAnswer`: Save the current state of the problem to local storage and the server; display server feedback.
  async logCurrentAnswer(sid) {
    let answer = JSON.stringify(this.given_arr);
    let feedback = true;
    // Save the answer locally.
    this.saveAnswersLocallyOnly();
    // Save the answer to the server.
    const data = {
      event: "fillb",
      div_id: this.divid,
      act: answer || "",
      seed: this.seed,
      answer: answer || "",
      correct: this.correct ? "T" : "F",
      percent: this.percent,
    };
    if (typeof sid !== "undefined") {
      data.sid = sid;
      feedback = false;
    }
    const server_data = await this.logBookEvent(data);
    if (!feedback) return;
    // Non-server side graded problems are done at this point; likewise, stop here if the server didn't respond.
    if (this.feedbackArray || !server_data) {
      return data;
    }
    // This is the server-side case. On success, update the feedback from the server's grade.
    const res = server_data.detail;
    this.timestamp = res.timestamp;
    this.displayFeed = res.displayFeed;
    this.correct = res.correct;
    this.isCorrectArray = res.isCorrectArray;
    this.setLocalStorage({
      seed: this.seed,
      answer: answer,
      timestamp: this.timestamp,
      problemHtml: this.descriptionDiv.innerHTML,
      displayFeed: this.displayFeed,
      correct: this.correct,
      isCorrectArray: this.isCorrectArray,
    });
    this.renderFeedback();
    return server_data;
  }

  /*==============================
    === Evaluation of answer and ===
    ===     display feedback     ===
    ==============================*/
  renderFeedback() {
    if (this.correct) {
      $(this.feedBackDiv).attr("class", "alert alert-info");
      for (let j = 0; j < this.blankArray.length; j++) {
        $(this.blankArray[j]).removeClass("input-validation-error");
      }
    } else {
      if (this.displayFeed === null) {
        this.displayFeed = "";
      }
      for (let j = 0; j < this.blankArray.length; j++) {
        if (this.isCorrectArray[j] !== true) {
          $(this.blankArray[j]).addClass("input-validation-error");
        } else {
          $(this.blankArray[j]).removeClass("input-validation-error");
        }
      }
      $(this.feedBackDiv).attr("class", "alert alert-danger");
    }
    var feedback_html = "<ul>";
    for (var i = 0; i < this.displayFeed.length; i++) {
      let df = this.displayFeed[i];
      // Render any dynamic feedback in the provided feedback, for client-side grading of dynamic problems.
      if (typeof this.dyn_vars === "string") {
        df = (0,_fitb_utils_js__WEBPACK_IMPORTED_MODULE_1__.renderDynamicFeedback)(
          this.blankNames,
          this.given_arr,
          i,
          df,
          this.dyn_vars_eval
        );
        // Convert the returned NodeList into a string of HTML.
        df = df ? df[0].parentElement.innerHTML : "No feedback provided";
      }
      feedback_html += `<li>${df}</li>`;
    }
    feedback_html += "</ul>";
    // Remove the list if it's just one element.
    if (this.displayFeed.length == 1) {
      feedback_html = feedback_html.slice(
        "<ul><li>".length,
        -"</li></ul>".length
      );
    }
    this.feedBackDiv.innerHTML = feedback_html;
    this.queueMathJax(this.feedBackDiv);
  }

  /*==================================
    === Functions for compare button ===
    ==================================*/
  enableCompareButton() {
    this.compareButton.disabled = false;
  }
  // _`compareFITBAnswers`
  compareFITBAnswers() {
    var data = {};
    data.div_id = this.divid;
    data.course = eBookConfig.course;
    jQuery.get(
      `${eBookConfig.new_server_prefix}/assessment/gettop10Answers`,
      data,
      this.compareFITB
    );
  }
  compareFITB(data, status, whatever) {
    var answers = data.detail.res;
    var misc = data.detail.miscdata;
    var body = "<table>";
    body += "<tr><th>Answer</th><th>Count</th></tr>";
    for (var row in answers) {
      body +=
        "<tr><td>" +
        answers[row].answer +
        "</td><td>" +
        answers[row].count +
        " times</td></tr>";
    }
    body += "</table>";
    var html =
      "<div class='modal fade'>" +
      "    <div class='modal-dialog compare-modal'>" +
      "        <div class='modal-content'>" +
      "            <div class='modal-header'>" +
      "                <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>" +
      "                <h4 class='modal-title'>Top Answers</h4>" +
      "            </div>" +
      "            <div class='modal-body'>" +
      body +
      "            </div>" +
      "        </div>" +
      "    </div>" +
      "</div>";
    var el = $(html);
    el.modal();
  }

  disableInteraction() {
    for (var i = 0; i < this.blankArray.length; i++) {
      this.blankArray[i].disabled = true;
    }
  }
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/
$(document).on("runestone:login-complete", function () {
  $("[data-component=fillintheblank]").each(function (index) {
    var opts = {
      orig: this,
      useRunestoneServices: eBookConfig.useRunestoneServices,
    };
    if ($(this).closest("[data-component=timedAssessment]").length == 0) {
      // If this element exists within a timed component, don't render it here
      try {
        FITBList[this.id] = new FITB(opts);
      } catch (err) {
        console.log(
          `Error rendering Fill in the Blank Problem ${this.id}
                     Details: ${err}`
        );
      }
    }
  });
});


/***/ }),

/***/ 74309:
/*!****************************************!*\
  !*** ./runestone/fitb/js/timedfitb.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimedFITB)
/* harmony export */ });
/* harmony import */ var _fitb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fitb.js */ 99184);

class TimedFITB extends _fitb_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        this.renderTimedIcon(this.inputDiv);
        this.hideButtons();
        this.needsReinitialization = true;
    }
    hideButtons() {
        $(this.submitButton).hide();
        $(this.compareButton).hide();
    }
    renderTimedIcon(component) {
        // renders the clock icon on timed components.    The component parameter
        // is the element that the icon should be appended to.
        var timeIconDiv = document.createElement("div");
        var timeIcon = document.createElement("img");
        $(timeIcon).attr({
            src: "../_static/clock.png",
            style: "width:15px;height:15px",
        });
        timeIconDiv.className = "timeTip";
        timeIconDiv.title = "";
        timeIconDiv.appendChild(timeIcon);
        $(component).prepend(timeIconDiv);
    }
    checkCorrectTimed() {
        // Returns if the question was correct, incorrect, or skipped (return null in the last case)
        switch (this.correct) {
            case true:
                return "T";
            case false:
                return "F";
            default:
                return null;
        }
    }
    hideFeedback() {
        for (var i = 0; i < this.blankArray.length; i++) {
            $(this.blankArray[i]).removeClass("input-validation-error");
        }
        this.feedBackDiv.style.display = "none";
    }

    reinitializeListeners() {
        this.setupBlanks();
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory.fillintheblank = function (opts) {
    if (opts.timed) {
        return new TimedFITB(opts);
    }
    return new _fitb_js__WEBPACK_IMPORTED_MODULE_0__["default"](opts);
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2ZpdGJfanNfdGltZWRmaXRiX2pzLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7Ozs7O0FDUEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNORDtBQUNBO0FBQ0E7QUFDQTs7QUFFYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLHVCQUF1QjtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsWUFBWSxNQUFNO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEseVdBQXlXO0FBQ3pXO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLElBQUksVUFBVSxXQUFXO0FBQy9DLFFBQVEsd0RBQXdELEVBQUUsSUFBUzs7QUFFM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxvQ0FBb0MsT0FBTztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sK0NBQStDLE9BQU87QUFDdEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1Asc0NBQXNDLHlCQUF5QjtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0Isc0JBQXNCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnQkFBZ0I7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxZQUFZLHlCQUF5QjtBQUMxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0Esa01BQWtNO0FBQ2xNO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUpBQW1KO0FBQ25KO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQztBQUMzQztBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixtQ0FBbUM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTix1REFBdUQsTUFBTTtBQUM3RDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvRkFBb0Y7QUFDcEY7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0WEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRWdEO0FBS3BDO0FBQ0U7QUFDRztBQUNMOztBQUV6QjtBQUNPOztBQUVQO0FBQ2UsbUJBQW1CLG1FQUFhO0FBQy9DO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbU9BQW1PO0FBQ25PO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLFFBQVEsb0VBQW9CO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDViwwQ0FBMEMsWUFBWTtBQUN0RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsNEJBQTRCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Ysa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxnRUFBZ0I7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsNEJBQTRCO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsNkNBQTZDLG9CQUFvQjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbURBQW1EO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEsaUdBQWlHO0FBQ2pHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtEQUErRDtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQiw0QkFBNEI7QUFDbEQ7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsNEJBQTRCO0FBQ2xEO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLDZCQUE2QjtBQUNqRDtBQUNBO0FBQ0E7QUFDQSxhQUFhLHFFQUFxQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsR0FBRztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyw4QkFBOEI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBHQUEwRztBQUMxRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLDRCQUE0QjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsdURBQXVEO0FBQ3ZELGdDQUFnQyxJQUFJO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3BuQjRCO0FBQ2Qsd0JBQXdCLGdEQUFJO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsNEJBQTRCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxnREFBSTtBQUNuQiIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9jc3MvZml0Yi5jc3MiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2pzL2ZpdGItaTE4bi5lbi5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvZml0Yi1pMThuLnB0LWJyLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLXV0aWxzLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy90aW1lZGZpdGIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiJC5pMThuKCkubG9hZCh7XG4gICAgZW46IHtcbiAgICAgICAgbXNnX25vX2Fuc3dlcjogXCJObyBhbnN3ZXIgcHJvdmlkZWQuXCIsXG4gICAgICAgIG1zZ19maXRiX2NoZWNrX21lOiBcIkNoZWNrIG1lXCIsXG4gICAgICAgIG1zZ19maXRiX2NvbXBhcmVfbWU6IFwiQ29tcGFyZSBtZVwiLFxuICAgICAgICBtc2dfZml0Yl9yYW5kb21pemU6IFwiUmFuZG9taXplXCJcbiAgICB9LFxufSk7XG4iLCIkLmkxOG4oKS5sb2FkKHtcbiAgICBcInB0LWJyXCI6IHtcbiAgICAgICAgbXNnX25vX2Fuc3dlcjogXCJOZW5odW1hIHJlc3Bvc3RhIGRhZGEuXCIsXG4gICAgICAgIG1zZ19maXRiX2NoZWNrX21lOiBcIlZlcmlmaWNhclwiLFxuICAgICAgICBtc2dfZml0Yl9jb21wYXJlX21lOiBcIkNvbXBhcmFyXCJcbiAgICB9LFxufSk7XG4iLCIvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gfGRvY25hbWV8IC0gZ3JhZGluZy1yZWxhdGVkIHV0aWxpdGllcyBmb3IgRklUQiBxdWVzdGlvbnNcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBUaGlzIGNvZGUgcnVucyBib3RoIG9uIHRoZSBzZXJ2ZXIgKGZvciBzZXJ2ZXItc2lkZSBncmFkaW5nKSBhbmQgb24gdGhlIGNsaWVudC4gSXQncyBwbGFjZWQgaGVyZSBhcyBhIHNldCBvZiBmdW5jdGlvbnMgc3BlY2lmaWNhbGx5IGZvciB0aGlzIHB1cnBvc2UuXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBJbmNsdWRlc1xuLy8gPT09PT09PT1cbi8vIE5vbmUuXG4vL1xuLy9cbi8vIEdsb2JhbHNcbi8vID09PT09PT1cbmZ1bmN0aW9uIHJlbmRlcl9odG1sKGh0bWxfaW4sIGR5bl92YXJzX2V2YWwpIHtcbiAgICAvLyBDaGFuZ2UgdGhlIHJlcGxhY2VtZW50IHRva2VucyBpbiB0aGUgSFRNTCBpbnRvIHRhZ3MsIHNvIHdlIGNhbiByZXBsYWNlIHRoZW0gdXNpbmcgWE1MLiBUaGUgaG9ycmlibGUgcmVnZXggaXM6XG4gICAgLy9cbiAgICAvLyBMb29rIGZvciB0aGUgY2hhcmFjdGVycyBgYFslPWBgICh0aGUgb3BlbmluZyBkZWxpbWl0ZXIpXG4gICAgLy8vIFxcWyU9XG4gICAgLy8gRm9sbG93ZWQgYnkgYW55IGFtb3VudCBvZiB3aGl0ZXNwYWNlLlxuICAgIC8vLyBcXHMqXG4gICAgLy8gU3RhcnQgYSBncm91cCB0aGF0IHdpbGwgY2FwdHVyZSB0aGUgY29udGVudHMgKGV4Y2x1ZGluZyB3aGl0ZXNwYWNlKSBvZiB0aGUgdG9rZW5zLiBGb3IgZXhhbXBsZSwgZ2l2ZW4gYGBbJT0gZm9vKCkgJV1gYCwgdGhlIGNvbnRlbnRzIGlzIGBgZm9vKClgYC5cbiAgICAvLy8gKFxuICAgIC8vIERvbid0IGNhcHR1cmUgdGhlIGNvbnRlbnRzIG9mIHRoaXMgZ3JvdXAsIHNpbmNlIGl0J3Mgb25seSBhIHNpbmdsZSBjaGFyYWN0ZXIuIE1hdGNoIGFueSBjaGFyYWN0ZXIuLi5cbiAgICAvLy8gKFxuICAgIC8vLyA/Oi5cbiAgICAvLy8gLi4udGhhdCBkb2Vzbid0IGVuZCB3aXRoIGBgJV1gYCAodGhlIGNsb3NpbmcgZGVsaW1pdGVyKS5cbiAgICAvLy8gKD8hJV0pXG4gICAgLy8vIClcbiAgICAvLyBNYXRjaCB0aGlzIChhbnl0aGluZyBidXQgdGhlIGNsb3NpbmcgZGVsaW1pdGVyKSBhcyBtdWNoIGFzIHdlIGNhbi5cbiAgICAvLy8gKilcbiAgICAvLyBOZXh0LCBsb29rIGZvciBhbnkgd2hpdGVzcGFjZS5cbiAgICAvLy8gXFxzKlxuICAgIC8vIEZpbmFsbHksIGxvb2sgZm9yIHRoZSBjbG9zaW5nIGRlbGltaXRlciBgYCVdYGAuXG4gICAgLy8vICVcXF1cbiAgICBjb25zdCBodG1sX3JlcGxhY2VkID0gaHRtbF9pbi5yZXBsYWNlQWxsKFxuICAgICAgICAvXFxbJT1cXHMqKCg/Oi4oPyElXSkpKilcXHMqJVxcXS9nLFxuICAgICAgICAvLyBSZXBsYWNlIGl0IHdpdGggYSBgPHNjcmlwdC1ldmFsPmAgdGFnLiBRdW90ZSB0aGUgc3RyaW5nLCB3aGljaCB3aWxsIGF1dG9tYXRpY2FsbHkgZXNjYXBlIGFueSBkb3VibGUgcXVvdGVzLCB1c2luZyBKU09OLlxuICAgICAgICAobWF0Y2gsIGdyb3VwMSkgPT5cbiAgICAgICAgICAgIGA8c2NyaXB0LWV2YWwgZXhwcj0ke0pTT04uc3RyaW5naWZ5KGdyb3VwMSl9Pjwvc2NyaXB0LWV2YWw+YFxuICAgICk7XG4gICAgLy8gR2l2ZW4gSFRNTCwgdHVybiBpdCBpbnRvIGEgRE9NLiBXYWxrIHRoZSBgYDxzY3JpcHQtZXZhbD5gYCB0YWdzLCBwZXJmb3JtaW5nIHRoZSByZXF1ZXN0ZWQgZXZhbHVhdGlvbiBvbiB0aGVtLlxuICAgIC8vXG4gICAgLy8gU2VlIGBET01QYXJzZXIgPGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9ET01QYXJzZXI+YF8uXG4gICAgY29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuICAgIC8vIFNlZSBgRE9NUGFyc2VyLnBhcnNlRnJvbVN0cmluZygpIDxodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRE9NUGFyc2VyL3BhcnNlRnJvbVN0cmluZz5gXy5cbiAgICBjb25zdCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGh0bWxfcmVwbGFjZWQsIFwidGV4dC9odG1sXCIpO1xuICAgIGNvbnN0IHNjcmlwdF9ldmFsX3RhZ3MgPSBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHQtZXZhbFwiKTtcbiAgICB3aGlsZSAoc2NyaXB0X2V2YWxfdGFncy5sZW5ndGgpIHtcbiAgICAgICAgLy8gR2V0IHRoZSBmaXJzdCB0YWcuIEl0IHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBjb2xsZWN0aW9uIGFmdGVyIGl0J3MgcmVwbGFjZWQgd2l0aCBpdHMgdmFsdWUuXG4gICAgICAgIGNvbnN0IHNjcmlwdF9ldmFsX3RhZyA9IHNjcmlwdF9ldmFsX3RhZ3NbMF07XG4gICAgICAgIC8vIFNlZSBpZiB0aGlzIGBgPHNjcmlwdC1ldmFsPmBgIHRhZyBoYXMgYXMgYGBAZXhwcmBgIGF0dHJpYnV0ZS5cbiAgICAgICAgY29uc3QgZXhwciA9IHNjcmlwdF9ldmFsX3RhZy5nZXRBdHRyaWJ1dGUoXCJleHByXCIpO1xuICAgICAgICAvLyBJZiBzbywgZXZhbHVhdGUgaXQuXG4gICAgICAgIGlmIChleHByKSB7XG4gICAgICAgICAgICBjb25zdCBldmFsX3Jlc3VsdCA9IHdpbmRvdy5GdW5jdGlvbihcbiAgICAgICAgICAgICAgICBcInZcIixcbiAgICAgICAgICAgICAgICAuLi5PYmplY3Qua2V5cyhkeW5fdmFyc19ldmFsKSxcbiAgICAgICAgICAgICAgICBgXCJ1c2Ugc3RyaWN0O1wiXFxucmV0dXJuICR7ZXhwcn07YFxuICAgICAgICAgICAgKShkeW5fdmFyc19ldmFsLCAuLi5PYmplY3QudmFsdWVzKGR5bl92YXJzX2V2YWwpKTtcbiAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIHRhZyB3aXRoIHRoZSByZXN1bHRpbmcgdmFsdWUuXG4gICAgICAgICAgICBzY3JpcHRfZXZhbF90YWcucmVwbGFjZVdpdGgoZXZhbF9yZXN1bHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHRoZSBib2R5IGNvbnRlbnRzLiBOb3RlIHRoYXQgdGhlIGBgRE9NUGFyc2VyYGAgY29uc3RydWN0cyBhbiBlbnRpcmUgZG9jdW1lbnQsIG5vdCBqdXN0IHRoZSBkb2N1bWVudCBmcmFnbWVudCB3ZSBwYXNzZWQgaXQuIFRoZXJlZm9yZSwgZXh0cmFjdCB0aGUgZGVzaXJlZCBmcmFnbWVudCBhbmQgcmV0dXJuIHRoYXQuIE5vdGUgdGhhdCB3ZSBuZWVkIHRvIHVzZSBgY2hpbGROb2RlcyA8aHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvY2hpbGROb2Rlcz5gXywgd2hpY2ggaW5jbHVkZXMgbm9uLWVsZW1lbnQgY2hpbGRyZW4gbGlrZSB0ZXh0IGFuZCBjb21tZW50czsgdXNpbmcgYGBjaGlsZHJlbmBgIG9taXRzIHRoZXNlIG5vbi1lbGVtZW50IGNoaWxkcmVuLlxuICAgIHJldHVybiBkb2MuYm9keS5jaGlsZE5vZGVzO1xufVxuXG4vLyBGdW5jdGlvbnNcbi8vID09PT09PT09PVxuLy8gVXBkYXRlIHRoZSBwcm9ibGVtJ3MgZGVzY3JpcHRpb24gYmFzZWQgb24gZHluYW1pY2FsbHktZ2VuZXJhdGVkIGNvbnRlbnQuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyRHluYW1pY0NvbnRlbnQoXG4gICAgc2VlZCxcbiAgICBkeW5fdmFycyxcbiAgICBodG1sX2luLFxuICAgIGRpdmlkLFxuICAgIHByZXBhcmVDaGVja0Fuc3dlcnNcbikge1xuICAgIC8vIEluaXRpYWxpemUgUk5HIHdpdGggYGBzZWVkYGAuIFRha2VuIGZyb20gYFNPIDxodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNDc1OTMzMTYvMTYwMzg5MTk+YF8uXG4gICAgY29uc3QgcmFuZCA9IChmdW5jdGlvbiBtdWxiZXJyeTMyKGEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCB0ID0gKGEgKz0gMHg2ZDJiNzlmNSk7XG4gICAgICAgICAgICB0ID0gTWF0aC5pbXVsKHQgXiAodCA+Pj4gMTUpLCB0IHwgMSk7XG4gICAgICAgICAgICB0IF49IHQgKyBNYXRoLmltdWwodCBeICh0ID4+PiA3KSwgdCB8IDYxKTtcbiAgICAgICAgICAgIHJldHVybiAoKHQgXiAodCA+Pj4gMTQpKSA+Pj4gMCkgLyA0Mjk0OTY3Mjk2O1xuICAgICAgICB9O1xuICAgIH0pKHNlZWQpO1xuXG4gICAgLy8gU2VlIGBSQU5EX0ZVTkMgPFJBTkRfRlVOQz5gXywgd2hpY2ggcmVmZXJzIHRvIGBgcmFuZGBgIGFib3ZlLlxuICAgIGNvbnN0IGR5bl92YXJzX2V2YWwgPSB3aW5kb3cuRnVuY3Rpb24oXG4gICAgICAgIFwidlwiLFxuICAgICAgICBcInJhbmRcIixcbiAgICAgICAgXCJzZWVkXCIsXG4gICAgICAgIGBcInVzZSBzdHJpY3RcIjtcXG4ke2R5bl92YXJzfTtcXG5yZXR1cm4gdjtgXG4gICAgKSh7IGRpdmlkOiBkaXZpZCwgcHJlcGFyZUNoZWNrQW5zd2VyczogcHJlcGFyZUNoZWNrQW5zd2VycyB9LCBSQU5EX0ZVTkMsIHNlZWQpO1xuXG4gICAgbGV0IGh0bWxfb3V0O1xuICAgIGlmICh0eXBlb2YgZHluX3ZhcnNfZXZhbC5iZWZvcmVDb250ZW50UmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWwuYmVmb3JlQ29udGVudFJlbmRlcihkeW5fdmFyc19ldmFsKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICBgRXJyb3IgaW4gcHJvYmxlbSAke2RpdmlkfSBpbnZva2luZyBiZWZvcmVDb250ZW50UmVuZGVyYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBodG1sX291dCA9IHJlbmRlcl9odG1sKGh0bWxfaW4sIGR5bl92YXJzX2V2YWwpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgcmVuZGVyaW5nIHByb2JsZW0gJHtkaXZpZH0gdGV4dCB1c2luZyBFSlNgKTtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgIH1cblxuICAgIC8vIHRoZSBhZnRlckNvbnRlbnRSZW5kZXIgZXZlbnQgd2lsbCBiZSBjYWxsZWQgYnkgdGhlIGNhbGxlciBvZiB0aGlzIGZ1bmN0aW9uIChhZnRlciBpdCB1cGRhdGVkIHRoZSBIVE1MIGJhc2VkIG9uIHRoZSBjb250ZW50cyBvZiBodG1sX291dCkuXG4gICAgcmV0dXJuIFtodG1sX291dCwgZHluX3ZhcnNfZXZhbF07XG59XG5cbi8vIEdpdmVuIHN0dWRlbnQgYW5zd2VycywgZ3JhZGUgdGhlbSBhbmQgcHJvdmlkZSBmZWVkYmFjay5cbi8vXG4vLyBPdXRwdXRzOlxuLy9cbi8vIC0gICAgYGBkaXNwbGF5RmVlZGBgIGlzIGFuIGFycmF5IG9mIEhUTUwgZmVlZGJhY2suXG4vLyAtICAgIGBgaXNDb3JyZWN0QXJyYXlgYCBpcyBhbiBhcnJheSBvZiB0cnVlLCBmYWxzZSwgb3IgbnVsbCAodGhlIHF1ZXN0aW9uIHdhc24ndCBhbnN3ZXJlZCkuXG4vLyAtICAgIGBgY29ycmVjdGBgIGlzIHRydWUsIGZhbHNlLCBvciBudWxsICh0aGUgcXVlc3Rpb24gd2Fzbid0IGFuc3dlcmVkKS5cbi8vIC0gICAgYGBwZXJjZW50YGAgaXMgdGhlIHBlcmNlbnRhZ2Ugb2YgY29ycmVjdCBhbnN3ZXJzIChmcm9tIDAgdG8gMSwgbm90IDAgdG8gMTAwKS5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja0Fuc3dlcnNDb3JlKFxuICAgIC8vIF9gYmxhbmtOYW1lc0RpY3RgOiBBbiBkaWN0IG9mIHtibGFua19uYW1lLCBibGFua19pbmRleH0gc3BlY2lmeWluZyB0aGUgbmFtZSBmb3IgZWFjaCBuYW1lZCBibGFuay5cbiAgICBibGFua05hbWVzRGljdCxcbiAgICAvLyBfYGdpdmVuX2FycmA6IEFuIGFycmF5IG9mIHN0cmluZ3MgY29udGFpbmluZyBzdHVkZW50LXByb3ZpZGVkIGFuc3dlcnMgZm9yIGVhY2ggYmxhbmsuXG4gICAgZ2l2ZW5fYXJyLFxuICAgIC8vIEEgMi1EIGFycmF5IG9mIHN0cmluZ3MgZ2l2aW5nIGZlZWRiYWNrIGZvciBlYWNoIGJsYW5rLlxuICAgIGZlZWRiYWNrQXJyYXksXG4gICAgLy8gX2BkeW5fdmFyc19ldmFsYDogQSBkaWN0IHByb2R1Y2VkIGJ5IGV2YWx1YXRpbmcgdGhlIEphdmFTY3JpcHQgZm9yIGEgZHluYW1pYyBleGVyY2lzZS5cbiAgICBkeW5fdmFyc19ldmFsXG4pIHtcbiAgICBpZiAoXG4gICAgICAgIGR5bl92YXJzX2V2YWwgJiZcbiAgICAgICAgdHlwZW9mIGR5bl92YXJzX2V2YWwuYmVmb3JlQ2hlY2tBbnN3ZXJzID09PSBcImZ1bmN0aW9uXCJcbiAgICApIHtcbiAgICAgICAgY29uc3QgW25hbWVkQmxhbmtWYWx1ZXMsIGdpdmVuX2Fycl9jb252ZXJ0ZWRdID0gcGFyc2VBbnN3ZXJzKFxuICAgICAgICAgICAgYmxhbmtOYW1lc0RpY3QsXG4gICAgICAgICAgICBnaXZlbl9hcnIsXG4gICAgICAgICAgICBkeW5fdmFyc19ldmFsXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGR2ZV9ibGFua3MgPSBPYmplY3QuYXNzaWduKHt9LCBkeW5fdmFyc19ldmFsLCBuYW1lZEJsYW5rVmFsdWVzKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWwuYmVmb3JlQ2hlY2tBbnN3ZXJzKGR2ZV9ibGFua3MsIGdpdmVuX2Fycl9jb252ZXJ0ZWQpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgY2FsbGluZyBiZWZvcmVDaGVja0Fuc3dlcnNcIik7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBLZWVwIHRyYWNrIGlmIGFsbCBhbnN3ZXJzIGFyZSBjb3JyZWN0IG9yIG5vdC5cbiAgICBsZXQgY29ycmVjdCA9IHRydWU7XG4gICAgY29uc3QgaXNDb3JyZWN0QXJyYXkgPSBbXTtcbiAgICBjb25zdCBkaXNwbGF5RmVlZCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ2l2ZW5fYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGdpdmVuID0gZ2l2ZW5fYXJyW2ldO1xuICAgICAgICAvLyBJZiB0aGlzIGJsYW5rIGlzIGVtcHR5LCBwcm92aWRlIG5vIGZlZWRiYWNrIGZvciBpdC5cbiAgICAgICAgaWYgKGdpdmVuID09PSBcIlwiKSB7XG4gICAgICAgICAgICBpc0NvcnJlY3RBcnJheS5wdXNoKG51bGwpO1xuICAgICAgICAgICAgLy8gVE9ETzogd2FzICQuaTE4bihcIm1zZ19ub19hbnN3ZXJcIikuXG4gICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKFwiTm8gYW5zd2VyIHByb3ZpZGVkLlwiKTtcbiAgICAgICAgICAgIGNvcnJlY3QgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIExvb2sgdGhyb3VnaCBhbGwgZmVlZGJhY2sgZm9yIHRoaXMgYmxhbmsuIFRoZSBsYXN0IGVsZW1lbnQgaW4gdGhlIGFycmF5IGFsd2F5cyBtYXRjaGVzLiBJZiBubyBmZWVkYmFjayBmb3IgdGhpcyBibGFuayBleGlzdHMsIHVzZSBhbiBlbXB0eSBsaXN0LlxuICAgICAgICAgICAgY29uc3QgZmJsID0gZmVlZGJhY2tBcnJheVtpXSB8fCBbXTtcbiAgICAgICAgICAgIGxldCBqO1xuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGZibC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIC8vIFRoZSBsYXN0IGl0ZW0gb2YgZmVlZGJhY2sgYWx3YXlzIG1hdGNoZXMuXG4gICAgICAgICAgICAgICAgaWYgKGogPT09IGZibC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goZmJsW2pdW1wiZmVlZGJhY2tcIl0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBhIGR5bmFtaWMgc29sdXRpb24uLi5cbiAgICAgICAgICAgICAgICBpZiAoZHluX3ZhcnNfZXZhbCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbbmFtZWRCbGFua1ZhbHVlcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZF0gPVxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VBbnN3ZXJzKGJsYW5rTmFtZXNEaWN0LCBnaXZlbl9hcnIsIGR5bl92YXJzX2V2YWwpO1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSB3YXMgYSBwYXJzZSBlcnJvciwgdGhlbiBpdCBzdHVkZW50J3MgYW5zd2VyIGlzIGluY29ycmVjdC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGdpdmVuX2Fycl9jb252ZXJ0ZWRbaV0gaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goZ2l2ZW5fYXJyX2NvbnZlcnRlZFtpXS5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvdW50IHRoaXMgYXMgd3JvbmcgYnkgbWFraW5nIGogIT0gMCAtLSBzZWUgdGhlIGNvZGUgdGhhdCBydW5zIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBleGVjdXRpbmcgdGhlIGJyZWFrLlxuICAgICAgICAgICAgICAgICAgICAgICAgaiA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYSBmdW5jdGlvbiB0byB3cmFwIHRoZSBleHByZXNzaW9uIHRvIGV2YWx1YXRlLiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRnVuY3Rpb24vRnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgIC8vIFBhc3MgdGhlIGFuc3dlciwgYXJyYXkgb2YgYWxsIGFuc3dlcnMsIHRoZW4gYWxsIGVudHJpZXMgaW4gYGB0aGlzLmR5bl92YXJzX2V2YWxgYCBkaWN0IGFzIGZ1bmN0aW9uIHBhcmFtZXRlcnMuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzX2VxdWFsID0gd2luZG93LkZ1bmN0aW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYW5zX2FycmF5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5PYmplY3Qua2V5cyhkeW5fdmFyc19ldmFsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLk9iamVjdC5rZXlzKG5hbWVkQmxhbmtWYWx1ZXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgYFwidXNlIHN0cmljdDtcIlxcbnJldHVybiAke2ZibFtqXVtcInNvbHV0aW9uX2NvZGVcIl19O2BcbiAgICAgICAgICAgICAgICAgICAgKShcbiAgICAgICAgICAgICAgICAgICAgICAgIGdpdmVuX2Fycl9jb252ZXJ0ZWRbaV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBnaXZlbl9hcnJfY29udmVydGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uT2JqZWN0LnZhbHVlcyhkeW5fdmFyc19ldmFsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLk9iamVjdC52YWx1ZXMobmFtZWRCbGFua1ZhbHVlcylcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgc3R1ZGVudCdzIGFuc3dlciBpcyBlcXVhbCB0byB0aGlzIGl0ZW0sIHRoZW4gYXBwZW5kIHRoaXMgaXRlbSdzIGZlZWRiYWNrLlxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNfZXF1YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGlzX2VxdWFsID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gaXNfZXF1YWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBmYmxbal1bXCJmZWVkYmFja1wiXVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBhIHJlZ2V4cC4uLlxuICAgICAgICAgICAgICAgICAgICBpZiAoXCJyZWdleFwiIGluIGZibFtqXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0dCA9IFJlZ0V4cChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYmxbal1bXCJyZWdleFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYmxbal1bXCJyZWdleEZsYWdzXCJdXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhdHQudGVzdChnaXZlbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKGZibFtqXVtcImZlZWRiYWNrXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBudW1iZXIuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChcIm51bWJlclwiIGluIGZibFtqXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBbbWluLCBtYXhdID0gZmJsW2pdW1wibnVtYmVyXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29udmVydCB0aGUgZ2l2ZW4gc3RyaW5nIHRvIGEgbnVtYmVyLiBXaGlsZSB0aGVyZSBhcmUgYGxvdHMgb2Ygd2F5cyA8aHR0cHM6Ly9jb2RlcndhbGwuY29tL3AvNXRsaG13L2NvbnZlcnRpbmctc3RyaW5ncy10by1udW1iZXItaW4tamF2YXNjcmlwdC1waXRmYWxscz5gXyB0byBkbyB0aGlzOyB0aGlzIHZlcnNpb24gc3VwcG9ydHMgb3RoZXIgYmFzZXMgKGhleC9iaW5hcnkvb2N0YWwpIGFzIHdlbGwgYXMgZmxvYXRzLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0dWFsID0gK2dpdmVuO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdHVhbCA+PSBtaW4gJiYgYWN0dWFsIDw9IG1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goZmJsW2pdW1wiZmVlZGJhY2tcIl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUaGUgYW5zd2VyIGlzIGNvcnJlY3QgaWYgaXQgbWF0Y2hlZCB0aGUgZmlyc3QgZWxlbWVudCBpbiB0aGUgYXJyYXkuIEEgc3BlY2lhbCBjYXNlOiBpZiBvbmx5IG9uZSBhbnN3ZXIgaXMgcHJvdmlkZWQsIGNvdW50IGl0IHdyb25nOyB0aGlzIGlzIGEgbWlzZm9ybWVkIHByb2JsZW0uXG4gICAgICAgICAgICBjb25zdCBpc19jb3JyZWN0ID0gaiA9PT0gMCAmJiBmYmwubGVuZ3RoID4gMTtcbiAgICAgICAgICAgIGlzQ29ycmVjdEFycmF5LnB1c2goaXNfY29ycmVjdCk7XG4gICAgICAgICAgICBpZiAoIWlzX2NvcnJlY3QpIHtcbiAgICAgICAgICAgICAgICBjb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAgIGR5bl92YXJzX2V2YWwgJiZcbiAgICAgICAgdHlwZW9mIGR5bl92YXJzX2V2YWwuYWZ0ZXJDaGVja0Fuc3dlcnMgPT09IFwiZnVuY3Rpb25cIlxuICAgICkge1xuICAgICAgICBjb25zdCBbbmFtZWRCbGFua1ZhbHVlcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZF0gPSBwYXJzZUFuc3dlcnMoXG4gICAgICAgICAgICBibGFua05hbWVzRGljdCxcbiAgICAgICAgICAgIGdpdmVuX2FycixcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgZHZlX2JsYW5rcyA9IE9iamVjdC5hc3NpZ24oe30sIGR5bl92YXJzX2V2YWwsIG5hbWVkQmxhbmtWYWx1ZXMpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZHluX3ZhcnNfZXZhbC5hZnRlckNoZWNrQW5zd2VycyhkdmVfYmxhbmtzLCBnaXZlbl9hcnJfY29udmVydGVkKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGNhbGxpbmcgYWZ0ZXJDaGVja0Fuc3dlcnNcIik7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBwZXJjZW50ID1cbiAgICAgICAgaXNDb3JyZWN0QXJyYXkuZmlsdGVyKEJvb2xlYW4pLmxlbmd0aCAvIGlzQ29ycmVjdEFycmF5Lmxlbmd0aDtcbiAgICByZXR1cm4gW2Rpc3BsYXlGZWVkLCBjb3JyZWN0LCBpc0NvcnJlY3RBcnJheSwgcGVyY2VudF07XG59XG5cbi8vIFVzZSB0aGUgcHJvdmlkZWQgcGFyc2VycyB0byBjb252ZXJ0IGEgc3R1ZGVudCdzIGFuc3dlcnMgKGFzIHN0cmluZ3MpIHRvIHRoZSB0eXBlIHByb2R1Y2VkIGJ5IHRoZSBwYXJzZXIgZm9yIGVhY2ggYmxhbmsuXG5mdW5jdGlvbiBwYXJzZUFuc3dlcnMoXG4gICAgLy8gU2VlIGJsYW5rTmFtZXNEaWN0Xy5cbiAgICBibGFua05hbWVzRGljdCxcbiAgICAvLyBTZWUgZ2l2ZW5fYXJyXy5cbiAgICBnaXZlbl9hcnIsXG4gICAgLy8gU2VlIGBkeW5fdmFyc19ldmFsYC5cbiAgICBkeW5fdmFyc19ldmFsXG4pIHtcbiAgICAvLyBQcm92aWRlIGEgZGljdCBvZiB7YmxhbmtfbmFtZSwgY29udmVydGVyX2Fuc3dlcl92YWx1ZX0uXG4gICAgY29uc3QgbmFtZWRCbGFua1ZhbHVlcyA9IGdldE5hbWVkQmxhbmtWYWx1ZXMoXG4gICAgICAgIGdpdmVuX2FycixcbiAgICAgICAgYmxhbmtOYW1lc0RpY3QsXG4gICAgICAgIGR5bl92YXJzX2V2YWxcbiAgICApO1xuICAgIC8vIEludmVydCBibGFua05hbWVkRGljdDogY29tcHV0ZSBhbiBhcnJheSBvZiBbYmxhbmtfMF9uYW1lLCAuLi5dLiBOb3RlIHRoYXQgdGhlIGFycmF5IG1heSBiZSBzcGFyc2U6IGl0IG9ubHkgY29udGFpbnMgdmFsdWVzIGZvciBuYW1lZCBibGFua3MuXG4gICAgY29uc3QgZ2l2ZW5fYXJyX25hbWVzID0gW107XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoYmxhbmtOYW1lc0RpY3QpKSB7XG4gICAgICAgIGdpdmVuX2Fycl9uYW1lc1t2XSA9IGs7XG4gICAgfVxuICAgIC8vIENvbXB1dGUgYW4gYXJyYXkgb2YgW2NvbnZlcnRlZF9ibGFua18wX3ZhbCwgLi4uXS4gTm90ZSB0aGF0IHRoaXMgcmUtY29udmVydHMgYWxsIHRoZSB2YWx1ZXMsIHJhdGhlciB0aGFuIChwb3NzaWJseSBkZWVwKSBjb3B5aW5nIHRoZSB2YWx1ZXMgZnJvbSBhbHJlYWR5LWNvbnZlcnRlZCBuYW1lZCBibGFua3MuXG4gICAgY29uc3QgZ2l2ZW5fYXJyX2NvbnZlcnRlZCA9IGdpdmVuX2Fyci5tYXAoKHZhbHVlLCBpbmRleCkgPT5cbiAgICAgICAgdHlwZV9jb252ZXJ0KGdpdmVuX2Fycl9uYW1lc1tpbmRleF0sIHZhbHVlLCBpbmRleCwgZHluX3ZhcnNfZXZhbClcbiAgICApO1xuXG4gICAgcmV0dXJuIFtuYW1lZEJsYW5rVmFsdWVzLCBnaXZlbl9hcnJfY29udmVydGVkXTtcbn1cblxuLy8gUmVuZGVyIHRoZSBmZWVkYmFjayBmb3IgYSBkeW5hbWljIHByb2JsZW0uXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyRHluYW1pY0ZlZWRiYWNrKFxuICAgIC8vIFNlZSBibGFua05hbWVzRGljdF8uXG4gICAgYmxhbmtOYW1lc0RpY3QsXG4gICAgLy8gU2VlIGdpdmVuX2Fycl8uXG4gICAgZ2l2ZW5fYXJyLFxuICAgIC8vIFRoZSBpbmRleCBvZiB0aGlzIGJsYW5rIGluIGdpdmVuX2Fycl8uXG4gICAgaW5kZXgsXG4gICAgLy8gVGhlIGZlZWRiYWNrIGZvciB0aGlzIGJsYW5rLCBjb250YWluaW5nIGEgdGVtcGxhdGUgdG8gYmUgcmVuZGVyZWQuXG4gICAgZGlzcGxheUZlZWRfaSxcbiAgICAvLyBTZWUgZHluX3ZhcnNfZXZhbF8uXG4gICAgZHluX3ZhcnNfZXZhbFxuKSB7XG4gICAgLy8gVXNlIHRoZSBhbnN3ZXIsIGFuIGFycmF5IG9mIGFsbCBhbnN3ZXJzLCB0aGUgdmFsdWUgb2YgYWxsIG5hbWVkIGJsYW5rcywgYW5kIGFsbCBzb2x1dGlvbiB2YXJpYWJsZXMgZm9yIHRoZSB0ZW1wbGF0ZS5cbiAgICBjb25zdCBuYW1lZEJsYW5rVmFsdWVzID0gZ2V0TmFtZWRCbGFua1ZhbHVlcyhcbiAgICAgICAgZ2l2ZW5fYXJyLFxuICAgICAgICBibGFua05hbWVzRGljdCxcbiAgICAgICAgZHluX3ZhcnNfZXZhbFxuICAgICk7XG4gICAgY29uc3Qgc29sX3ZhcnNfcGx1cyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFuczogZ2l2ZW5fYXJyW2luZGV4XSxcbiAgICAgICAgICAgIGFuc19hcnJheTogZ2l2ZW5fYXJyLFxuICAgICAgICB9LFxuICAgICAgICBkeW5fdmFyc19ldmFsLFxuICAgICAgICBuYW1lZEJsYW5rVmFsdWVzXG4gICAgKTtcbiAgICB0cnkge1xuICAgICAgICBkaXNwbGF5RmVlZF9pID0gcmVuZGVyX2h0bWwoZGlzcGxheUZlZWRfaSwgc29sX3ZhcnNfcGx1cyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciBldmFsdWF0aW5nIGZlZWRiYWNrIGluZGV4ICR7aW5kZXh9LmApO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpc3BsYXlGZWVkX2k7XG59XG5cbi8vIFV0aWxpdGllc1xuLy8gLS0tLS0tLS0tXG4vLyBGb3IgZWFjaCBuYW1lZCBibGFuaywgZ2V0IHRoZSB2YWx1ZSBmb3IgdGhlIGJsYW5rOiB0aGUgdmFsdWUgb2YgZWFjaCBgYGJsYW5rTmFtZWBgIGdpdmVzIHRoZSBpbmRleCBvZiB0aGUgYmxhbmsgZm9yIHRoYXQgbmFtZS5cbmZ1bmN0aW9uIGdldE5hbWVkQmxhbmtWYWx1ZXMoZ2l2ZW5fYXJyLCBibGFua05hbWVzRGljdCwgZHluX3ZhcnNfZXZhbCkge1xuICAgIGNvbnN0IG5hbWVkQmxhbmtWYWx1ZXMgPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtibGFua19uYW1lLCBibGFua19pbmRleF0gb2YgT2JqZWN0LmVudHJpZXMoYmxhbmtOYW1lc0RpY3QpKSB7XG4gICAgICAgIG5hbWVkQmxhbmtWYWx1ZXNbYmxhbmtfbmFtZV0gPSB0eXBlX2NvbnZlcnQoXG4gICAgICAgICAgICBibGFua19uYW1lLFxuICAgICAgICAgICAgZ2l2ZW5fYXJyW2JsYW5rX2luZGV4XSxcbiAgICAgICAgICAgIGJsYW5rX2luZGV4LFxuICAgICAgICAgICAgZHluX3ZhcnNfZXZhbFxuICAgICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZWRCbGFua1ZhbHVlcztcbn1cblxuLy8gQ29udmVydCBhIHZhbHVlIGdpdmVuIGl0cyB0eXBlLlxuZnVuY3Rpb24gdHlwZV9jb252ZXJ0KG5hbWUsIHZhbHVlLCBpbmRleCwgZHluX3ZhcnNfZXZhbCkge1xuICAgIC8vIFRoZSBjb252ZXJ0ZXIgY2FuIGJlIGRlZmluZWQgYnkgaW5kZXgsIG5hbWUsIG9yIGJ5IGEgc2luZ2xlIHZhbHVlICh3aGljaCBhcHBsaWVzIHRvIGFsbCBibGFua3MpLiBJZiBub3QgcHJvdmlkZWQsIGp1c3QgcGFzcyB0aGUgZGF0YSB0aHJvdWdoLlxuICAgIGNvbnN0IHR5cGVzID0gZHluX3ZhcnNfZXZhbC50eXBlcyB8fCBwYXNzX3Rocm91Z2g7XG4gICAgY29uc3QgY29udmVydGVyID0gdHlwZXNbbmFtZV0gfHwgdHlwZXNbaW5kZXhdIHx8IHR5cGVzO1xuICAgIC8vIEVTNSBoYWNrOiBpdCBkb2Vzbid0IHN1cHBvcnQgYmluYXJ5IHZhbHVlcywgYW5kIGpzMnB5IGRvZXNuJ3QgYWxsb3cgbWUgdG8gb3ZlcnJpZGUgdGhlIGBgTnVtYmVyYGAgY2xhc3MuIFNvLCBkZWZpbmUgdGhlIHdvcmthcm91bmQgY2xhc3MgYGBOdW1iZXJfYGAgYW5kIHVzZSBpdCBpZiBhdmFpbGFibGUuXG4gICAgaWYgKGNvbnZlcnRlciA9PT0gTnVtYmVyICYmIHR5cGVvZiBOdW1iZXJfICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGNvbnZlcnRlciA9IE51bWJlcl87XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHRoZSBjb252ZXJ0ZWQgdHlwZS4gSWYgdGhlIGNvbnZlcnRlciByYWlzZXMgYSBUeXBlRXJyb3IsIHJldHVybiB0aGF0OyBpdCB3aWxsIGJlIGRpc3BsYXllZCB0byB0aGUgdXNlciwgc2luY2Ugd2UgYXNzdW1lIHR5cGUgZXJyb3JzIGFyZSBhIHdheSBmb3IgdGhlIHBhcnNlciB0byBleHBsYWluIHRvIHRoZSB1c2VyIHdoeSB0aGUgcGFyc2UgZmFpbGVkLiBGb3IgYWxsIG90aGVyIGVycm9ycywgcmUtdGhyb3cgaXQgc2luY2Ugc29tZXRoaW5nIHdlbnQgd3JvbmcuXG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGNvbnZlcnRlcih2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIEEgcGFzcy10aHJvdWdoIFwiY29udmVydGVyXCIuXG5mdW5jdGlvbiBwYXNzX3Rocm91Z2godmFsKSB7XG4gICAgcmV0dXJuIHZhbDtcbn1cbiIsIi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyB8ZG9jbmFtZXwgLS0gZmlsbC1pbi10aGUtYmxhbmsgY2xpZW50LXNpZGUgY29kZVxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIFRoaXMgZmlsZSBjb250YWlucyB0aGUgSlMgZm9yIHRoZSBSdW5lc3RvbmUgZmlsbGludGhlYmxhbmsgY29tcG9uZW50LiBJdCB3YXMgY3JlYXRlZCBCeSBJc2FpYWggTWF5ZXJjaGFrIGFuZCBLaXJieSBPbHNvbiwgNi80LzE1IHRoZW4gcmV2aXNlZCBieSBCcmFkIE1pbGxlciwgMi83LzIwLlxuLy9cbi8vIERhdGEgc3RvcmFnZSBub3Rlc1xuLy8gPT09PT09PT09PT09PT09PT09XG4vL1xuLy8gSW5pdGlhbCBwcm9ibGVtIHJlc3RvcmVcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbiB0aGUgY29uc3RydWN0b3IsIHRoaXMgY29kZSAodGhlIGNsaWVudCkgcmVzdG9yZXMgdGhlIHByb2JsZW0gYnkgY2FsbGluZyBgYGNoZWNrU2VydmVyYGAuIFRvIGRvIHNvLCBlaXRoZXIgdGhlIHNlcnZlciBzZW5kcyBvciBsb2NhbCBzdG9yYWdlIGhhczpcbi8vXG4vLyAtICAgIHNlZWQgKHVzZWQgb25seSBmb3IgZHluYW1pYyBwcm9ibGVtcylcbi8vIC0gICAgYW5zd2VyXG4vLyAtICAgIGRpc3BsYXlGZWVkIChzZXJ2ZXItc2lkZSBncmFkaW5nIG9ubHk7IG90aGVyd2lzZSwgdGhpcyBpcyBnZW5lcmF0ZWQgbG9jYWxseSBieSBjbGllbnQgY29kZSlcbi8vIC0gICAgY29ycmVjdCAoU1NHKVxuLy8gLSAgICBpc0NvcnJlY3RBcnJheSAoU1NHKVxuLy8gLSAgICBwcm9ibGVtSHRtbCAoU1NHIHdpdGggZHluYW1pYyBwcm9ibGVtcyBvbmx5KVxuLy9cbi8vIElmIGFueSBvZiB0aGUgYW5zd2VycyBhcmUgY29ycmVjdCwgdGhlbiB0aGUgY2xpZW50IHNob3dzIGZlZWRiYWNrLiBUaGlzIGlzIGltcGxlbWVudGVkIGluIHJlc3RvcmVBbnN3ZXJzXy5cbi8vXG4vLyBHcmFkaW5nXG4vLyAtLS0tLS0tXG4vLyBXaGVuIHRoZSB1c2VyIHByZXNzZXMgdGhlIFwiQ2hlY2sgbWVcIiBidXR0b24sIHRoZSBsb2dDdXJyZW50QW5zd2VyXyBmdW5jdGlvbjpcbi8vXG4vLyAtICAgIFNhdmVzIHRoZSBmb2xsb3dpbmcgdG8gbG9jYWwgc3RvcmFnZTpcbi8vXG4vLyAgICAgIC0gICBzZWVkXG4vLyAgICAgIC0gICBhbnN3ZXJcbi8vICAgICAgLSAgIHRpbWVzdGFtcFxuLy8gICAgICAtICAgcHJvYmxlbUh0bWxcbi8vXG4vLyAgICAgIE5vdGUgdGhhdCB0aGVyZSdzIG5vIHBvaW50IGluIHNhdmluZyBkaXNwbGF5RmVlZCwgY29ycmVjdCwgb3IgaXNDb3JyZWN0QXJyYXksIHNpbmNlIHRoZXNlIHZhbHVlcyBhcHBsaWVkIHRvIHRoZSBwcmV2aW91cyBhbnN3ZXIsIG5vdCB0aGUgbmV3IGFuc3dlciBqdXN0IHN1Ym1pdHRlZC5cbi8vXG4vLyAtICAgIFNlbmRzIHRoZSBmb2xsb3dpbmcgdG8gdGhlIHNlcnZlcjsgc3RvcCBhZnRlciB0aGlzIGZvciBjbGllbnQtc2lkZSBncmFkaW5nOlxuLy9cbi8vICAgICAgLSAgIHNlZWQgKGlnbm9yZWQgZm9yIHNlcnZlci1zaWRlIGdyYWRpbmcpXG4vLyAgICAgIC0gICBhbnN3ZXJcbi8vICAgICAgLSAgIGNvcnJlY3QgKGlnbm9yZWQgZm9yIFNTRylcbi8vICAgICAgLSAgIHBlcmNlbnQgKGlnbm9yZWQgZm9yIFNTRylcbi8vXG4vLyAtICAgIFJlY2VpdmVzIHRoZSBmb2xsb3dpbmcgZnJvbSB0aGUgc2VydmVyOlxuLy9cbi8vICAgICAgLSAgIHRpbWVzdGFtcFxuLy8gICAgICAtICAgZGlzcGxheUZlZWRcbi8vICAgICAgLSAgIGNvcnJlY3Rcbi8vICAgICAgLSAgIGlzQ29ycmVjdEFycmF5XG4vL1xuLy8gLSAgICBTYXZlcyB0aGUgZm9sbG93aW5nIHRvIGxvY2FsIHN0b3JhZ2U6XG4vL1xuLy8gICAgICAtICAgc2VlZFxuLy8gICAgICAtICAgYW5zd2VyXG4vLyAgICAgIC0gICB0aW1lc3RhbXBcbi8vICAgICAgLSAgIGRpc3BsYXlGZWVkIChTU0cgb25seSlcbi8vICAgICAgLSAgIGNvcnJlY3QgKFNTRyBvbmx5KVxuLy8gICAgICAtICAgaXNDb3JyZWN0QXJyYXkgKFNTRyBvbmx5KVxuLy8gICAgICAtICAgcHJvYmxlbUh0bWxcbi8vXG4vLyBSYW5kb21pemVcbi8vIC0tLS0tLS0tLVxuLy8gV2hlbiB0aGUgdXNlciBwcmVzc2VzIHRoZSBcIlJhbmRvbWl6ZVwiIGJ1dHRvbiAod2hpY2ggaXMgb25seSBhdmFpbGFibGUgZm9yIGR5bmFtaWMgcHJvYmxlbXMpLCB0aGUgcmFuZG9taXplXyBmdW5jdGlvbjpcbi8vXG4vLyAtICAgIEZvciB0aGUgY2xpZW50LXNpZGUgY2FzZSwgc2V0cyB0aGUgc2VlZCB0byBhIG5ldywgcmFuZG9tIHZhbHVlLiBGb3IgdGhlIHNlcnZlci1zaWRlIGNhc2UsIHJlcXVlc3RzIGEgbmV3IHNlZWQgYW5kIHByb2JsZW1IdG1sIGZyb20gdGhlIHNlcnZlci5cbi8vIC0gICAgU2V0cyB0aGUgYW5zd2VyIHRvIGFuIGFycmF5IG9mIGVtcHR5IHN0cmluZ3MuXG4vLyAtICAgIFNhdmVzIHRoZSB1c3VhbCBsb2NhbCBkYXRhLlxuXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlLmpzXCI7XG5pbXBvcnQge1xuICByZW5kZXJEeW5hbWljQ29udGVudCxcbiAgY2hlY2tBbnN3ZXJzQ29yZSxcbiAgcmVuZGVyRHluYW1pY0ZlZWRiYWNrLFxufSBmcm9tIFwiLi9maXRiLXV0aWxzLmpzXCI7XG5pbXBvcnQgXCIuL2ZpdGItaTE4bi5lbi5qc1wiO1xuaW1wb3J0IFwiLi9maXRiLWkxOG4ucHQtYnIuanNcIjtcbmltcG9ydCBcIi4uL2Nzcy9maXRiLmNzc1wiO1xuXG4vLyBPYmplY3QgY29udGFpbmluZyBhbGwgaW5zdGFuY2VzIG9mIEZJVEIgdGhhdCBhcmVuJ3QgYSBjaGlsZCBvZiBhIHRpbWVkIGFzc2Vzc21lbnQuXG5leHBvcnQgdmFyIEZJVEJMaXN0ID0ge307XG5cbi8vIEZJVEIgY29uc3RydWN0b3JcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZJVEIgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgY29uc3RydWN0b3Iob3B0cykge1xuICAgIHN1cGVyKG9wdHMpO1xuICAgIHZhciBvcmlnID0gb3B0cy5vcmlnOyAvLyBlbnRpcmUgPHA+IGVsZW1lbnRcbiAgICB0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzID0gb3B0cy51c2VSdW5lc3RvbmVTZXJ2aWNlcztcbiAgICB0aGlzLm9yaWdFbGVtID0gb3JpZztcbiAgICB0aGlzLmRpdmlkID0gb3JpZy5pZDtcbiAgICB0aGlzLmNvcnJlY3QgPSBudWxsO1xuICAgIC8vIFNlZSBjb21tZW50cyBpbiBmaXRiLnB5IGZvciB0aGUgZm9ybWF0IG9mIGBgZmVlZGJhY2tBcnJheWBgICh3aGljaCBpcyBpZGVudGljYWwgaW4gYm90aCBmaWxlcykuXG4gICAgLy9cbiAgICAvLyBGaW5kIHRoZSBzY3JpcHQgdGFnIGNvbnRhaW5pbmcgSlNPTiBhbmQgcGFyc2UgaXQuIFNlZSBgU08gPGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkzMjA0MjcvYmVzdC1wcmFjdGljZS1mb3ItZW1iZWRkaW5nLWFyYml0cmFyeS1qc29uLWluLXRoZS1kb20+YF9fLiBJZiB0aGlzIHRhZyBkb2Vzbid0IGV4aXN0LCB0aGVuIG5vIGZlZWRiYWNrIGlzIGF2YWlsYWJsZTsgc2VydmVyLXNpZGUgZ3JhZGluZyB3aWxsIGJlIHBlcmZvcm1lZC5cbiAgICAvL1xuICAgIC8vIEEgZGVzdHJ1Y3R1cmluZyBhc3NpZ25tZW50IHdvdWxkIGJlIHBlcmZlY3QsIGJ1dCB0aGV5IGRvbid0IHdvcmsgd2l0aCBgYHRoaXMuYmxhaGBgIGFuZCBgYHdpdGhgYCBzdGF0ZW1lbnRzIGFyZW4ndCBzdXBwb3J0ZWQgaW4gc3RyaWN0IG1vZGUuXG4gICAgY29uc3QganNvbl9lbGVtZW50ID0gdGhpcy5zY3JpcHRTZWxlY3Rvcih0aGlzLm9yaWdFbGVtKTtcbiAgICBjb25zdCBkaWN0XyA9IEpTT04ucGFyc2UoanNvbl9lbGVtZW50Lmh0bWwoKSk7XG4gICAganNvbl9lbGVtZW50LnJlbW92ZSgpO1xuICAgIHRoaXMucHJvYmxlbUh0bWwgPSBkaWN0Xy5wcm9ibGVtSHRtbDtcbiAgICB0aGlzLmR5bl92YXJzID0gZGljdF8uZHluX3ZhcnM7XG4gICAgdGhpcy5ibGFua05hbWVzID0gZGljdF8uYmxhbmtOYW1lcztcbiAgICB0aGlzLmZlZWRiYWNrQXJyYXkgPSBkaWN0Xy5mZWVkYmFja0FycmF5O1xuICAgIGlmIChkaWN0Xy5zdGF0aWNfc2VlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuc2VlZCA9IGRpY3RfLnN0YXRpY19zZWVkO1xuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgfVxuXG4gICAgdGhpcy5jcmVhdGVGSVRCRWxlbWVudCgpO1xuICAgIHRoaXMuc2V0dXBCbGFua3MoKTtcbiAgICB0aGlzLmNhcHRpb24gPSBcIkZpbGwgaW4gdGhlIEJsYW5rXCI7XG4gICAgdGhpcy5hZGRDYXB0aW9uKFwicnVuZXN0b25lXCIpO1xuICAgIHRoaXMuY2hlY2tTZXJ2ZXIoXCJmaWxsYlwiLCBmYWxzZSkudGhlbigoKSA9PiB7XG4gICAgICAvLyBJZiB0aGVyZSdzIG5vIHNlZWQgZm9yIGEgY2xpZW50LXNpZGUgZHluYW1pYyBwcm9ibGVtIGFmdGVyIHRoaXMgY2hlY2ssIGNyZWF0ZSBvbmUgYW5kIHJlbmRlciBpdC5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5keW5fdmFycyA9PT0gXCJzdHJpbmdcIiAmJiB0aGlzLnNlZWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnJhbmRvbWl6ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZW5kZXJEeW5hbWljQ29udGVudCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbiAgICB9KTtcbiAgICBpZiAodHlwZW9mIFByaXNtICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdCAgICBQcmlzbS5oaWdobGlnaHRBbGxVbmRlcih0aGlzLmNvbnRhaW5lckRpdik7XG5cdH1cbiAgfVxuICAvLyBGaW5kIHRoZSBzY3JpcHQgdGFnIGNvbnRhaW5pbmcgSlNPTiBpbiBhIGdpdmVuIHJvb3QgRE9NIG5vZGUuXG4gIHNjcmlwdFNlbGVjdG9yKHJvb3Rfbm9kZSkge1xuICAgIHJldHVybiAkKHJvb3Rfbm9kZSkuZmluZChgc2NyaXB0W3R5cGU9XCJhcHBsaWNhdGlvbi9qc29uXCJdYCk7XG4gIH1cbiAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSAgIEZ1bmN0aW9ucyBnZW5lcmF0aW5nIGZpbmFsIEhUTUwgICA9PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gIGNyZWF0ZUZJVEJFbGVtZW50KCkge1xuICAgIHRoaXMucmVuZGVyRklUQklucHV0KCk7XG4gICAgdGhpcy5yZW5kZXJGSVRCQnV0dG9ucygpO1xuICAgIHRoaXMucmVuZGVyRklUQkZlZWRiYWNrRGl2KCk7XG4gICAgLy8gcmVwbGFjZXMgdGhlIGludGVybWVkaWF0ZSBIVE1MIGZvciB0aGlzIGNvbXBvbmVudCB3aXRoIHRoZSByZW5kZXJlZCBIVE1MIG9mIHRoaXMgY29tcG9uZW50XG4gICAgJCh0aGlzLm9yaWdFbGVtKS5yZXBsYWNlV2l0aCh0aGlzLmNvbnRhaW5lckRpdik7XG4gIH1cbiAgcmVuZGVyRklUQklucHV0KCkge1xuICAgIC8vIFRoZSB0ZXh0IFtpbnB1dF0gZWxlbWVudHMgYXJlIGNyZWF0ZWQgYnkgdGhlIHRlbXBsYXRlLlxuICAgIHRoaXMuY29udGFpbmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0aGlzLmNvbnRhaW5lckRpdi5pZCA9IHRoaXMuZGl2aWQ7XG4gICAgLy8gQ3JlYXRlIGFub3RoZXIgY29udGFpbmVyIHdoaWNoIHN0b3JlcyB0aGUgcHJvYmxlbSBkZXNjcmlwdGlvbi5cbiAgICB0aGlzLmRlc2NyaXB0aW9uRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmRlc2NyaXB0aW9uRGl2KTtcbiAgICAvLyBDb3B5IHRoZSBvcmlnaW5hbCBlbGVtZW50cyB0byB0aGUgY29udGFpbmVyIGhvbGRpbmcgd2hhdCB0aGUgdXNlciB3aWxsIHNlZSAoY2xpZW50LXNpZGUgZ3JhZGluZyBvbmx5KS5cbiAgICBpZiAodGhpcy5wcm9ibGVtSHRtbCkge1xuICAgICAgdGhpcy5kZXNjcmlwdGlvbkRpdi5pbm5lckhUTUwgPSB0aGlzLnByb2JsZW1IdG1sO1xuICAgICAgLy8gU2F2ZSBvcmlnaW5hbCBIVE1MICh3aXRoIHRlbXBsYXRlcykgdXNlZCBpbiBkeW5hbWljIHByb2JsZW1zLlxuICAgICAgdGhpcy5kZXNjcmlwdGlvbkRpdi5vcmlnSW5uZXJIVE1MID0gdGhpcy5wcm9ibGVtSHRtbDtcbiAgICB9XG4gIH1cblxuICByZW5kZXJGSVRCQnV0dG9ucygpIHtcbiAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJiclwiKSk7XG5cbiAgICAvLyBcInN1Ym1pdFwiIGJ1dHRvblxuICAgIHRoaXMuc3VibWl0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICB0aGlzLnN1Ym1pdEJ1dHRvbi50ZXh0Q29udGVudCA9ICQuaTE4bihcIm1zZ19maXRiX2NoZWNrX21lXCIpO1xuICAgICQodGhpcy5zdWJtaXRCdXR0b24pLmF0dHIoe1xuICAgICAgY2xhc3M6IFwiYnRuIGJ0bi1zdWNjZXNzXCIsXG4gICAgICBuYW1lOiBcImRvIGFuc3dlclwiLFxuICAgICAgdHlwZTogXCJidXR0b25cIixcbiAgICB9KTtcbiAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJjbGlja1wiLFxuICAgICAgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNoZWNrQ3VycmVudEFuc3dlcigpO1xuICAgICAgICBhd2FpdCB0aGlzLmxvZ0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnN1Ym1pdEJ1dHRvbik7XG5cbiAgICAvLyBcImNvbXBhcmUgbWVcIiBidXR0b25cbiAgICBpZiAodGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgdGhpcy5jb21wYXJlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICQodGhpcy5jb21wYXJlQnV0dG9uKS5hdHRyKHtcbiAgICAgICAgY2xhc3M6IFwiYnRuIGJ0bi1kZWZhdWx0XCIsXG4gICAgICAgIGlkOiB0aGlzLm9yaWdFbGVtLmlkICsgXCJfYmNvbXBcIixcbiAgICAgICAgZGlzYWJsZWQ6IFwiXCIsXG4gICAgICAgIG5hbWU6IFwiY29tcGFyZVwiLFxuICAgICAgfSk7XG4gICAgICB0aGlzLmNvbXBhcmVCdXR0b24udGV4dENvbnRlbnQgPSAkLmkxOG4oXCJtc2dfZml0Yl9jb21wYXJlX21lXCIpO1xuICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMuY29tcGFyZUZJVEJBbnN3ZXJzKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgZmFsc2VcbiAgICAgICk7XG4gICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmNvbXBhcmVCdXR0b24pO1xuICAgIH1cblxuICAgIC8vIFJhbmRvbWl6ZSBidXR0b24gZm9yIGR5bmFtaWMgcHJvYmxlbXMuXG4gICAgaWYgKHRoaXMuZHluX3ZhcnMpIHtcbiAgICAgIHRoaXMucmFuZG9taXplQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICQodGhpcy5yYW5kb21pemVCdXR0b24pLmF0dHIoe1xuICAgICAgICBjbGFzczogXCJidG4gYnRuLWRlZmF1bHRcIixcbiAgICAgICAgaWQ6IHRoaXMub3JpZ0VsZW0uaWQgKyBcIl9iY29tcFwiLFxuICAgICAgICBuYW1lOiBcInJhbmRvbWl6ZVwiLFxuICAgICAgfSk7XG4gICAgICB0aGlzLnJhbmRvbWl6ZUJ1dHRvbi50ZXh0Q29udGVudCA9ICQuaTE4bihcIm1zZ19maXRiX3JhbmRvbWl6ZVwiKTtcbiAgICAgIHRoaXMucmFuZG9taXplQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMucmFuZG9taXplKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgZmFsc2VcbiAgICAgICk7XG4gICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnJhbmRvbWl6ZUJ1dHRvbik7XG4gICAgfVxuXG4gICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSk7XG4gIH1cbiAgcmVuZGVyRklUQkZlZWRiYWNrRGl2KCkge1xuICAgIHRoaXMuZmVlZEJhY2tEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRoaXMuZmVlZEJhY2tEaXYuaWQgPSB0aGlzLmRpdmlkICsgXCJfZmVlZGJhY2tcIjtcbiAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuZmVlZEJhY2tEaXYpO1xuICB9XG5cbiAgY2xlYXJGZWVkYmFja0RpdigpIHtcbiAgICAvLyBTZXR0aW5nIHRoZSBgYG91dGVySFRNTGBgIHJlbW92ZXMgdGhpcyBmcm9tIHRoZSBET00uIFVzZSBhbiBhbHRlcm5hdGl2ZSBwcm9jZXNzIC0tIHJlbW92ZSB0aGUgY2xhc3MgKHdoaWNoIG1ha2VzIGl0IHJlZC9ncmVlbiBiYXNlZCBvbiBncmFkaW5nKSBhbmQgY29udGVudC5cbiAgICB0aGlzLmZlZWRCYWNrRGl2LmlubmVySFRNTCA9IFwiXCI7XG4gICAgdGhpcy5mZWVkQmFja0Rpdi5jbGFzc05hbWUgPSBcIlwiO1xuICB9XG5cbiAgLy8gVXBkYXRlIHRoZSBwcm9ibGVtJ3MgZGVzY3JpcHRpb24gYmFzZWQgb24gZHluYW1pY2FsbHktZ2VuZXJhdGVkIGNvbnRlbnQuXG4gIHJlbmRlckR5bmFtaWNDb250ZW50KCkge1xuICAgIC8vIGBgdGhpcy5keW5fdmFyc2BgIGNhbiBiZSB0cnVlOyBpZiBzbywgZG9uJ3QgcmVuZGVyIGl0LCBzaW5jZSB0aGUgc2VydmVyIGRvZXMgYWxsIHRoZSByZW5kZXJpbmcuXG4gICAgaWYgKHR5cGVvZiB0aGlzLmR5bl92YXJzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBsZXQgaHRtbF9ub2RlcztcbiAgICAgIFtodG1sX25vZGVzLCB0aGlzLmR5bl92YXJzX2V2YWxdID1cbiAgICAgICAgcmVuZGVyRHluYW1pY0NvbnRlbnQoXG4gICAgICAgICAgdGhpcy5zZWVkLFxuICAgICAgICAgIHRoaXMuZHluX3ZhcnMsXG4gICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbkRpdi5vcmlnSW5uZXJIVE1MLFxuICAgICAgICAgIHRoaXMuZGl2aWQsXG4gICAgICAgICAgdGhpcy5wcmVwYXJlQ2hlY2tBbnN3ZXJzLmJpbmQodGhpcyksXG4gICAgICAgICk7XG4gICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2LnJlcGxhY2VDaGlsZHJlbiguLi5odG1sX25vZGVzKTtcblxuICAgICAgaWYgKHR5cGVvZiAodGhpcy5keW5fdmFyc19ldmFsLmFmdGVyQ29udGVudFJlbmRlcikgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMuZHluX3ZhcnNfZXZhbC5hZnRlckNvbnRlbnRSZW5kZXIodGhpcy5keW5fdmFyc19ldmFsKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIGluIHByb2JsZW0gJHt0aGlzLmRpdmlkfSBpbnZva2luZyBhZnRlckNvbnRlbnRSZW5kZXJgKTtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5kZXNjcmlwdGlvbkRpdik7XG4gICAgICB0aGlzLnNldHVwQmxhbmtzKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0dXBCbGFua3MoKSB7XG4gICAgLy8gRmluZCBhbmQgZm9ybWF0IHRoZSBibGFua3MuIElmIGEgZHluYW1pYyBwcm9ibGVtIGp1c3QgY2hhbmdlZCB0aGUgSFRNTCwgdGhpcyB3aWxsIGZpbmQgdGhlIG5ld2x5LWNyZWF0ZWQgYmxhbmtzLlxuICAgIGNvbnN0IGJhID0gJCh0aGlzLmRlc2NyaXB0aW9uRGl2KS5maW5kKFwiOmlucHV0XCIpO1xuICAgIGJhLmF0dHIoXCJjbGFzc1wiLCBcImZvcm0gZm9ybS1jb250cm9sIHNlbGVjdHdpZHRoYXV0b1wiKTtcbiAgICBiYS5hdHRyKFwiYXJpYS1sYWJlbFwiLCBcImlucHV0IGFyZWFcIik7XG4gICAgdGhpcy5ibGFua0FycmF5ID0gYmEudG9BcnJheSgpO1xuICAgIGZvciAobGV0IGJsYW5rIG9mIHRoaXMuYmxhbmtBcnJheSkge1xuICAgICAgJChibGFuaykuY2hhbmdlKHRoaXMucmVjb3JkQW5zd2VyZWQuYmluZCh0aGlzKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gVGhpcyB0ZWxscyB0aW1lZCBxdWVzdGlvbnMgdGhhdCB0aGUgZml0YiBibGFua3MgcmVjZWl2ZWQgc29tZSBpbnRlcmFjdGlvbi5cbiAgcmVjb3JkQW5zd2VyZWQoKSB7XG4gICAgdGhpcy5pc0Fuc3dlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT0gQ2hlY2tpbmcvbG9hZGluZyBmcm9tIHN0b3JhZ2UgPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAvLyBfYHJlc3RvcmVBbnN3ZXJzYDogdXBkYXRlIHRoZSBwcm9ibGVtIHdpdGggZGF0YSBmcm9tIHRoZSBzZXJ2ZXIgb3IgZnJvbSBsb2NhbCBzdG9yYWdlLlxuICByZXN0b3JlQW5zd2VycyhkYXRhKSB7XG4gICAgLy8gUmVzdG9yZSB0aGUgc2VlZCBmaXJzdCwgc2luY2UgdGhlIGR5bmFtaWMgcmVuZGVyIGNsZWFycyBhbGwgdGhlIGJsYW5rcy5cbiAgICB0aGlzLnNlZWQgPSBkYXRhLnNlZWQ7XG4gICAgdGhpcy5yZW5kZXJEeW5hbWljQ29udGVudCgpO1xuXG4gICAgdmFyIGFycjtcbiAgICAvLyBSZXN0b3JlIGFuc3dlcnMgZnJvbSBzdG9yYWdlIHJldHJpZXZhbCBkb25lIGluIFJ1bmVzdG9uZUJhc2UuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFRoZSBuZXdlciBmb3JtYXQgZW5jb2RlcyBkYXRhIGFzIGEgSlNPTiBvYmplY3QuXG4gICAgICBhcnIgPSBKU09OLnBhcnNlKGRhdGEuYW5zd2VyKTtcbiAgICAgIC8vIFRoZSByZXN1bHQgc2hvdWxkIGJlIGFuIGFycmF5LiBJZiBub3QsIHRyeSBjb21tYSBwYXJzaW5nIGluc3RlYWQuXG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8vIFRoZSBvbGQgZm9ybWF0IGRpZG4ndC5cbiAgICAgIGFyciA9IChkYXRhLmFuc3dlciB8fCBcIlwiKS5zcGxpdChcIixcIik7XG4gICAgfVxuICAgIGxldCBoYXNBbnN3ZXIgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgJCh0aGlzLmJsYW5rQXJyYXlbaV0pLmF0dHIoXCJ2YWx1ZVwiLCBhcnJbaV0pO1xuICAgICAgaWYgKGFycltpXSkge1xuICAgICAgICBoYXNBbnN3ZXIgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBJcyB0aGlzIGNsaWVudC1zaWRlIGdyYWRpbmcsIG9yIHNlcnZlci1zaWRlIGdyYWRpbmc/XG4gICAgaWYgKHRoaXMuZmVlZGJhY2tBcnJheSkge1xuICAgICAgLy8gRm9yIGNsaWVudC1zaWRlIGdyYWRpbmcsIHJlLWdlbmVyYXRlIGZlZWRiYWNrIGlmIHRoZXJlJ3MgYW4gYW5zd2VyLlxuICAgICAgaWYgKGhhc0Fuc3dlcikge1xuICAgICAgICB0aGlzLmNoZWNrQ3VycmVudEFuc3dlcigpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBGb3Igc2VydmVyLXNpZGUgZ3JhZGluZywgdXNlIHRoZSBwcm92aWRlZCBmZWVkYmFjayBmcm9tIHRoZSBzZXJ2ZXIgb3IgbG9jYWwgc3RvcmFnZS5cbiAgICAgIHRoaXMuZGlzcGxheUZlZWQgPSBkYXRhLmRpc3BsYXlGZWVkO1xuICAgICAgdGhpcy5jb3JyZWN0ID0gZGF0YS5jb3JyZWN0O1xuICAgICAgdGhpcy5pc0NvcnJlY3RBcnJheSA9IGRhdGEuaXNDb3JyZWN0QXJyYXk7XG4gICAgICAvLyBPbmx5IHJlbmRlciBpZiBhbGwgdGhlIGRhdGEgaXMgcHJlc2VudDsgbG9jYWwgc3RvcmFnZSBtaWdodCBoYXZlIG9sZCBkYXRhIG1pc3Npbmcgc29tZSBvZiB0aGVzZSBpdGVtcy5cbiAgICAgIGlmIChcbiAgICAgICAgdHlwZW9mIHRoaXMuZGlzcGxheUZlZWQgIT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICAgICAgdHlwZW9mIHRoaXMuY29ycmVjdCAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgICB0eXBlb2YgdGhpcy5pc0NvcnJlY3RBcnJheSAhPT0gXCJ1bmRlZmluZWRcIlxuICAgICAgKSB7XG4gICAgICAgIHRoaXMucmVuZGVyRmVlZGJhY2soKTtcbiAgICAgIH1cbiAgICAgIC8vIEZvciBzZXJ2ZXItc2lkZSBkeW5hbWljIHByb2JsZW1zLCBzaG93IHRoZSByZW5kZXJlZCBwcm9ibGVtIHRleHQuXG4gICAgICB0aGlzLnByb2JsZW1IdG1sID0gZGF0YS5wcm9ibGVtSHRtbDtcbiAgICAgIGlmICh0aGlzLnByb2JsZW1IdG1sKSB7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MID0gdGhpcy5wcm9ibGVtSHRtbDtcbiAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5kZXNjcmlwdGlvbkRpdik7XG4gICAgICAgIHRoaXMuc2V0dXBCbGFua3MoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjaGVja0xvY2FsU3RvcmFnZSgpIHtcbiAgICAvLyBMb2FkcyBwcmV2aW91cyBhbnN3ZXJzIGZyb20gbG9jYWwgc3RvcmFnZSBpZiB0aGV5IGV4aXN0XG4gICAgdmFyIHN0b3JlZERhdGE7XG4gICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBsZW4gPSBsb2NhbFN0b3JhZ2UubGVuZ3RoO1xuICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICB2YXIgZXggPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgIGlmIChleCAhPT0gbnVsbCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHN0b3JlZERhdGEgPSBKU09OLnBhcnNlKGV4KTtcbiAgICAgICAgICB2YXIgYXJyID0gc3RvcmVkRGF0YS5hbnN3ZXI7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIC8vIGVycm9yIHdoaWxlIHBhcnNpbmc7IGxpa2VseSBkdWUgdG8gYmFkIHZhbHVlIHN0b3JlZCBpbiBzdG9yYWdlXG4gICAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlc3RvcmVBbnN3ZXJzKHN0b3JlZERhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldExvY2FsU3RvcmFnZShkYXRhKSB7XG4gICAgbGV0IGtleSA9IHRoaXMubG9jYWxTdG9yYWdlS2V5KCk7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIH1cblxuICBjaGVja0N1cnJlbnRBbnN3ZXIoKSB7XG4gICAgLy8gU3RhcnQgb2YgdGhlIGV2YWx1YXRpb24gY2hhaW5cbiAgICB0aGlzLmlzQ29ycmVjdEFycmF5ID0gW107XG4gICAgdGhpcy5kaXNwbGF5RmVlZCA9IFtdO1xuICAgIGNvbnN0IHBjYSA9IHRoaXMucHJlcGFyZUNoZWNrQW5zd2VycygpO1xuXG4gICAgaWYgKHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgIGlmIChlQm9va0NvbmZpZy5lbmFibGVDb21wYXJlTWUpIHtcbiAgICAgICAgdGhpcy5lbmFibGVDb21wYXJlQnV0dG9uKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gR3JhZGUgbG9jYWxseSBpZiB3ZSBjYW4ndCBhc2sgdGhlIHNlcnZlciB0byBncmFkZS5cbiAgICBpZiAodGhpcy5mZWVkYmFja0FycmF5KSB7XG4gICAgICBbXG4gICAgICAgIC8vIEFuIGFycmF5IG9mIEhUTUwgZmVlZGJhY2suXG4gICAgICAgIHRoaXMuZGlzcGxheUZlZWQsXG4gICAgICAgIC8vIHRydWUsIGZhbHNlLCBvciBudWxsICh0aGUgcXVlc3Rpb24gd2Fzbid0IGFuc3dlcmVkKS5cbiAgICAgICAgdGhpcy5jb3JyZWN0LFxuICAgICAgICAvLyBBbiBhcnJheSBvZiB0cnVlLCBmYWxzZSwgb3IgbnVsbCAodGhlIHF1ZXN0aW9uIHdhc24ndCBhbnN3ZXJlZCkuXG4gICAgICAgIHRoaXMuaXNDb3JyZWN0QXJyYXksXG4gICAgICAgIHRoaXMucGVyY2VudFxuICAgICAgXSA9IGNoZWNrQW5zd2Vyc0NvcmUoLi4ucGNhKTtcbiAgICAgIGlmICghdGhpcy5pc1RpbWVkKSB7XG4gICAgICAgIHRoaXMucmVuZGVyRmVlZGJhY2soKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBJbnB1dHM6XG4gIC8vXG4gIC8vIC0gU3RyaW5ncyBlbnRlcmVkIGJ5IHRoZSBzdHVkZW50IGluIGBgdGhpcy5ibGFua0FycmF5W2ldLnZhbHVlYGAuXG4gIC8vIC0gRmVlZGJhY2sgaW4gYGB0aGlzLmZlZWRiYWNrQXJyYXlgYC5cbiAgcHJlcGFyZUNoZWNrQW5zd2VycygpIHtcbiAgICB0aGlzLmdpdmVuX2FyciA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaSsrKVxuICAgICAgdGhpcy5naXZlbl9hcnIucHVzaCh0aGlzLmJsYW5rQXJyYXlbaV0udmFsdWUpO1xuICAgIHJldHVybiBbdGhpcy5ibGFua05hbWVzLCB0aGlzLmdpdmVuX2FyciwgdGhpcy5mZWVkYmFja0FycmF5LCB0aGlzLmR5bl92YXJzX2V2YWxdO1xuICB9XG5cbiAgLy8gX2ByYW5kb21pemVgOiBUaGlzIGhhbmRsZXMgYSBjbGljayB0byB0aGUgXCJSYW5kb21pemVcIiBidXR0b24uXG4gIGFzeW5jIHJhbmRvbWl6ZSgpIHtcbiAgICAvLyBVc2UgdGhlIGNsaWVudC1zaWRlIGNhc2Ugb3IgdGhlIHNlcnZlci1zaWRlIGNhc2U/XG4gICAgaWYgKHRoaXMuZmVlZGJhY2tBcnJheSkge1xuICAgICAgLy8gVGhpcyBpcyB0aGUgY2xpZW50LXNpZGUgY2FzZS5cbiAgICAgIC8vXG4gICAgICB0aGlzLnNlZWQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyICoqIDMyKTtcbiAgICAgIHRoaXMucmVuZGVyRHluYW1pY0NvbnRlbnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhpcyBpcyB0aGUgc2VydmVyLXNpZGUgY2FzZS4gU2VuZCBhIHJlcXVlc3QgdG8gdGhlIGByZXN1bHRzIDxnZXRBc3Nlc3NSZXN1bHRzPmAgZW5kcG9pbnQgd2l0aCBgYG5ld19zZWVkYGAgc2V0IHRvIFRydWUuXG4gICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXCIvYXNzZXNzbWVudC9yZXN1bHRzXCIsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICBjb3Vyc2U6IGVCb29rQ29uZmlnLmNvdXJzZSxcbiAgICAgICAgICBldmVudDogXCJmaWxsYlwiLFxuICAgICAgICAgIHNpZDogdGhpcy5zaWQsXG4gICAgICAgICAgbmV3X3NlZWQ6IHRydWUsXG4gICAgICAgIH0pLFxuICAgICAgICBoZWFkZXJzOiB0aGlzLmpzb25IZWFkZXJzLFxuICAgICAgfSk7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBhbGVydChgSFRUUCBlcnJvciBnZXR0aW5nIHJlc3VsdHM6ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIGNvbnN0IHJlcyA9IGRhdGEuZGV0YWlsO1xuICAgICAgdGhpcy5zZWVkID0gcmVzLnNlZWQ7XG4gICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2LmlubmVySFRNTCA9IHJlcy5wcm9ibGVtSHRtbDtcbiAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuZGVzY3JpcHRpb25EaXYpO1xuICAgICAgdGhpcy5zZXR1cEJsYW5rcygpO1xuICAgIH1cbiAgICAvLyBXaGVuIGdldHRpbmcgYSBuZXcgc2VlZCwgY2xlYXIgYWxsIHRoZSBvbGQgYW5zd2VycyBhbmQgZmVlZGJhY2suXG4gICAgdGhpcy5naXZlbl9hcnIgPSBBcnJheSh0aGlzLmJsYW5rQXJyYXkubGVuKS5maWxsKFwiXCIpO1xuICAgICQodGhpcy5ibGFua0FycmF5KS5hdHRyKFwidmFsdWVcIiwgXCJcIik7XG4gICAgdGhpcy5jbGVhckZlZWRiYWNrRGl2KCk7XG4gICAgdGhpcy5zYXZlQW5zd2Vyc0xvY2FsbHlPbmx5KCk7XG4gIH1cblxuICAvLyBTYXZlIHRoZSBhbnN3ZXJzIGFuZCBhc3NvY2lhdGVkIGRhdGEgbG9jYWxseTsgZG9uJ3Qgc2F2ZSBmZWVkYmFjayBwcm92aWRlZCBieSB0aGUgc2VydmVyIGZvciB0aGlzIGFuc3dlci4gSXQgYXNzdW1lcyB0aGF0IGBgdGhpcy5naXZlbl9hcnJgYCBjb250YWlucyB0aGUgY3VycmVudCBhbnN3ZXJzLlxuICBzYXZlQW5zd2Vyc0xvY2FsbHlPbmx5KCkge1xuICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKHtcbiAgICAgIC8vIFRoZSBzZWVkIGlzIHVzZWQgZm9yIGNsaWVudC1zaWRlIG9wZXJhdGlvbiwgYnV0IGRvZXNuJ3QgbWF0dGVyIGZvciBzZXJ2ZXItc2lkZS5cbiAgICAgIHNlZWQ6IHRoaXMuc2VlZCxcbiAgICAgIGFuc3dlcjogSlNPTi5zdHJpbmdpZnkodGhpcy5naXZlbl9hcnIpLFxuICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLFxuICAgICAgLy8gVGhpcyBpcyBvbmx5IG5lZWRlZCBmb3Igc2VydmVyLXNpZGUgZ3JhZGluZyB3aXRoIGR5bmFtaWMgcHJvYmxlbXMuXG4gICAgICBwcm9ibGVtSHRtbDogdGhpcy5kZXNjcmlwdGlvbkRpdi5pbm5lckhUTUwsXG4gICAgfSk7XG4gIH1cblxuICAvLyBfYGxvZ0N1cnJlbnRBbnN3ZXJgOiBTYXZlIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBwcm9ibGVtIHRvIGxvY2FsIHN0b3JhZ2UgYW5kIHRoZSBzZXJ2ZXI7IGRpc3BsYXkgc2VydmVyIGZlZWRiYWNrLlxuICBhc3luYyBsb2dDdXJyZW50QW5zd2VyKHNpZCkge1xuICAgIGxldCBhbnN3ZXIgPSBKU09OLnN0cmluZ2lmeSh0aGlzLmdpdmVuX2Fycik7XG4gICAgbGV0IGZlZWRiYWNrID0gdHJ1ZTtcbiAgICAvLyBTYXZlIHRoZSBhbnN3ZXIgbG9jYWxseS5cbiAgICB0aGlzLnNhdmVBbnN3ZXJzTG9jYWxseU9ubHkoKTtcbiAgICAvLyBTYXZlIHRoZSBhbnN3ZXIgdG8gdGhlIHNlcnZlci5cbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgZXZlbnQ6IFwiZmlsbGJcIixcbiAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgIGFjdDogYW5zd2VyIHx8IFwiXCIsXG4gICAgICBzZWVkOiB0aGlzLnNlZWQsXG4gICAgICBhbnN3ZXI6IGFuc3dlciB8fCBcIlwiLFxuICAgICAgY29ycmVjdDogdGhpcy5jb3JyZWN0ID8gXCJUXCIgOiBcIkZcIixcbiAgICAgIHBlcmNlbnQ6IHRoaXMucGVyY2VudCxcbiAgICB9O1xuICAgIGlmICh0eXBlb2Ygc2lkICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBkYXRhLnNpZCA9IHNpZDtcbiAgICAgIGZlZWRiYWNrID0gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHNlcnZlcl9kYXRhID0gYXdhaXQgdGhpcy5sb2dCb29rRXZlbnQoZGF0YSk7XG4gICAgaWYgKCFmZWVkYmFjaykgcmV0dXJuO1xuICAgIC8vIE5vbi1zZXJ2ZXIgc2lkZSBncmFkZWQgcHJvYmxlbXMgYXJlIGRvbmUgYXQgdGhpcyBwb2ludDsgbGlrZXdpc2UsIHN0b3AgaGVyZSBpZiB0aGUgc2VydmVyIGRpZG4ndCByZXNwb25kLlxuICAgIGlmICh0aGlzLmZlZWRiYWNrQXJyYXkgfHwgIXNlcnZlcl9kYXRhKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgLy8gVGhpcyBpcyB0aGUgc2VydmVyLXNpZGUgY2FzZS4gT24gc3VjY2VzcywgdXBkYXRlIHRoZSBmZWVkYmFjayBmcm9tIHRoZSBzZXJ2ZXIncyBncmFkZS5cbiAgICBjb25zdCByZXMgPSBzZXJ2ZXJfZGF0YS5kZXRhaWw7XG4gICAgdGhpcy50aW1lc3RhbXAgPSByZXMudGltZXN0YW1wO1xuICAgIHRoaXMuZGlzcGxheUZlZWQgPSByZXMuZGlzcGxheUZlZWQ7XG4gICAgdGhpcy5jb3JyZWN0ID0gcmVzLmNvcnJlY3Q7XG4gICAgdGhpcy5pc0NvcnJlY3RBcnJheSA9IHJlcy5pc0NvcnJlY3RBcnJheTtcbiAgICB0aGlzLnNldExvY2FsU3RvcmFnZSh7XG4gICAgICBzZWVkOiB0aGlzLnNlZWQsXG4gICAgICBhbnN3ZXI6IGFuc3dlcixcbiAgICAgIHRpbWVzdGFtcDogdGhpcy50aW1lc3RhbXAsXG4gICAgICBwcm9ibGVtSHRtbDogdGhpcy5kZXNjcmlwdGlvbkRpdi5pbm5lckhUTUwsXG4gICAgICBkaXNwbGF5RmVlZDogdGhpcy5kaXNwbGF5RmVlZCxcbiAgICAgIGNvcnJlY3Q6IHRoaXMuY29ycmVjdCxcbiAgICAgIGlzQ29ycmVjdEFycmF5OiB0aGlzLmlzQ29ycmVjdEFycmF5LFxuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyRmVlZGJhY2soKTtcbiAgICByZXR1cm4gc2VydmVyX2RhdGE7XG4gIH1cblxuICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBFdmFsdWF0aW9uIG9mIGFuc3dlciBhbmQgPT09XG4gICAgPT09ICAgICBkaXNwbGF5IGZlZWRiYWNrICAgICA9PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICByZW5kZXJGZWVkYmFjaygpIHtcbiAgICBpZiAodGhpcy5jb3JyZWN0KSB7XG4gICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWluZm9cIik7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGorKykge1xuICAgICAgICAkKHRoaXMuYmxhbmtBcnJheVtqXSkucmVtb3ZlQ2xhc3MoXCJpbnB1dC12YWxpZGF0aW9uLWVycm9yXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5kaXNwbGF5RmVlZCA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLmRpc3BsYXlGZWVkID0gXCJcIjtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQ29ycmVjdEFycmF5W2pdICE9PSB0cnVlKSB7XG4gICAgICAgICAgJCh0aGlzLmJsYW5rQXJyYXlbal0pLmFkZENsYXNzKFwiaW5wdXQtdmFsaWRhdGlvbi1lcnJvclwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkKHRoaXMuYmxhbmtBcnJheVtqXSkucmVtb3ZlQ2xhc3MoXCJpbnB1dC12YWxpZGF0aW9uLWVycm9yXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWRhbmdlclwiKTtcbiAgICB9XG4gICAgdmFyIGZlZWRiYWNrX2h0bWwgPSBcIjx1bD5cIjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZGlzcGxheUZlZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBkZiA9IHRoaXMuZGlzcGxheUZlZWRbaV07XG4gICAgICAvLyBSZW5kZXIgYW55IGR5bmFtaWMgZmVlZGJhY2sgaW4gdGhlIHByb3ZpZGVkIGZlZWRiYWNrLCBmb3IgY2xpZW50LXNpZGUgZ3JhZGluZyBvZiBkeW5hbWljIHByb2JsZW1zLlxuICAgICAgaWYgKHR5cGVvZiB0aGlzLmR5bl92YXJzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGRmID0gcmVuZGVyRHluYW1pY0ZlZWRiYWNrKFxuICAgICAgICAgIHRoaXMuYmxhbmtOYW1lcyxcbiAgICAgICAgICB0aGlzLmdpdmVuX2FycixcbiAgICAgICAgICBpLFxuICAgICAgICAgIGRmLFxuICAgICAgICAgIHRoaXMuZHluX3ZhcnNfZXZhbFxuICAgICAgICApO1xuICAgICAgICAvLyBDb252ZXJ0IHRoZSByZXR1cm5lZCBOb2RlTGlzdCBpbnRvIGEgc3RyaW5nIG9mIEhUTUwuXG4gICAgICAgIGRmID0gZGYgPyBkZlswXS5wYXJlbnRFbGVtZW50LmlubmVySFRNTCA6IFwiTm8gZmVlZGJhY2sgcHJvdmlkZWRcIjtcbiAgICAgIH1cbiAgICAgIGZlZWRiYWNrX2h0bWwgKz0gYDxsaT4ke2RmfTwvbGk+YDtcbiAgICB9XG4gICAgZmVlZGJhY2tfaHRtbCArPSBcIjwvdWw+XCI7XG4gICAgLy8gUmVtb3ZlIHRoZSBsaXN0IGlmIGl0J3MganVzdCBvbmUgZWxlbWVudC5cbiAgICBpZiAodGhpcy5kaXNwbGF5RmVlZC5sZW5ndGggPT0gMSkge1xuICAgICAgZmVlZGJhY2tfaHRtbCA9IGZlZWRiYWNrX2h0bWwuc2xpY2UoXG4gICAgICAgIFwiPHVsPjxsaT5cIi5sZW5ndGgsXG4gICAgICAgIC1cIjwvbGk+PC91bD5cIi5sZW5ndGhcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMuZmVlZEJhY2tEaXYuaW5uZXJIVE1MID0gZmVlZGJhY2tfaHRtbDtcbiAgICB0aGlzLnF1ZXVlTWF0aEpheCh0aGlzLmZlZWRCYWNrRGl2KTtcbiAgfVxuXG4gIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBGdW5jdGlvbnMgZm9yIGNvbXBhcmUgYnV0dG9uID09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICBlbmFibGVDb21wYXJlQnV0dG9uKCkge1xuICAgIHRoaXMuY29tcGFyZUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICB9XG4gIC8vIF9gY29tcGFyZUZJVEJBbnN3ZXJzYFxuICBjb21wYXJlRklUQkFuc3dlcnMoKSB7XG4gICAgdmFyIGRhdGEgPSB7fTtcbiAgICBkYXRhLmRpdl9pZCA9IHRoaXMuZGl2aWQ7XG4gICAgZGF0YS5jb3Vyc2UgPSBlQm9va0NvbmZpZy5jb3Vyc2U7XG4gICAgalF1ZXJ5LmdldChcbiAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9hc3Nlc3NtZW50L2dldHRvcDEwQW5zd2Vyc2AsXG4gICAgICBkYXRhLFxuICAgICAgdGhpcy5jb21wYXJlRklUQlxuICAgICk7XG4gIH1cbiAgY29tcGFyZUZJVEIoZGF0YSwgc3RhdHVzLCB3aGF0ZXZlcikge1xuICAgIHZhciBhbnN3ZXJzID0gZGF0YS5kZXRhaWwucmVzO1xuICAgIHZhciBtaXNjID0gZGF0YS5kZXRhaWwubWlzY2RhdGE7XG4gICAgdmFyIGJvZHkgPSBcIjx0YWJsZT5cIjtcbiAgICBib2R5ICs9IFwiPHRyPjx0aD5BbnN3ZXI8L3RoPjx0aD5Db3VudDwvdGg+PC90cj5cIjtcbiAgICBmb3IgKHZhciByb3cgaW4gYW5zd2Vycykge1xuICAgICAgYm9keSArPVxuICAgICAgICBcIjx0cj48dGQ+XCIgK1xuICAgICAgICBhbnN3ZXJzW3Jvd10uYW5zd2VyICtcbiAgICAgICAgXCI8L3RkPjx0ZD5cIiArXG4gICAgICAgIGFuc3dlcnNbcm93XS5jb3VudCArXG4gICAgICAgIFwiIHRpbWVzPC90ZD48L3RyPlwiO1xuICAgIH1cbiAgICBib2R5ICs9IFwiPC90YWJsZT5cIjtcbiAgICB2YXIgaHRtbCA9XG4gICAgICBcIjxkaXYgY2xhc3M9J21vZGFsIGZhZGUnPlwiICtcbiAgICAgIFwiICAgIDxkaXYgY2xhc3M9J21vZGFsLWRpYWxvZyBjb21wYXJlLW1vZGFsJz5cIiArXG4gICAgICBcIiAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtY29udGVudCc+XCIgK1xuICAgICAgXCIgICAgICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1oZWFkZXInPlwiICtcbiAgICAgIFwiICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzcz0nY2xvc2UnIGRhdGEtZGlzbWlzcz0nbW9kYWwnIGFyaWEtaGlkZGVuPSd0cnVlJz4mdGltZXM7PC9idXR0b24+XCIgK1xuICAgICAgXCIgICAgICAgICAgICAgICAgPGg0IGNsYXNzPSdtb2RhbC10aXRsZSc+VG9wIEFuc3dlcnM8L2g0PlwiICtcbiAgICAgIFwiICAgICAgICAgICAgPC9kaXY+XCIgK1xuICAgICAgXCIgICAgICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1ib2R5Jz5cIiArXG4gICAgICBib2R5ICtcbiAgICAgIFwiICAgICAgICAgICAgPC9kaXY+XCIgK1xuICAgICAgXCIgICAgICAgIDwvZGl2PlwiICtcbiAgICAgIFwiICAgIDwvZGl2PlwiICtcbiAgICAgIFwiPC9kaXY+XCI7XG4gICAgdmFyIGVsID0gJChodG1sKTtcbiAgICBlbC5tb2RhbCgpO1xuICB9XG5cbiAgZGlzYWJsZUludGVyYWN0aW9uKCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmJsYW5rQXJyYXlbaV0uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxufVxuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT0gRmluZCB0aGUgY3VzdG9tIEhUTUwgdGFncyBhbmQgPT1cbj09ICAgZXhlY3V0ZSBvdXIgY29kZSBvbiB0aGVtICAgID09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuJChkb2N1bWVudCkub24oXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuICAkKFwiW2RhdGEtY29tcG9uZW50PWZpbGxpbnRoZWJsYW5rXVwiKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgIHZhciBvcHRzID0ge1xuICAgICAgb3JpZzogdGhpcyxcbiAgICAgIHVzZVJ1bmVzdG9uZVNlcnZpY2VzOiBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyxcbiAgICB9O1xuICAgIGlmICgkKHRoaXMpLmNsb3Nlc3QoXCJbZGF0YS1jb21wb25lbnQ9dGltZWRBc3Nlc3NtZW50XVwiKS5sZW5ndGggPT0gMCkge1xuICAgICAgLy8gSWYgdGhpcyBlbGVtZW50IGV4aXN0cyB3aXRoaW4gYSB0aW1lZCBjb21wb25lbnQsIGRvbid0IHJlbmRlciBpdCBoZXJlXG4gICAgICB0cnkge1xuICAgICAgICBGSVRCTGlzdFt0aGlzLmlkXSA9IG5ldyBGSVRCKG9wdHMpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgIGBFcnJvciByZW5kZXJpbmcgRmlsbCBpbiB0aGUgQmxhbmsgUHJvYmxlbSAke3RoaXMuaWR9XG4gICAgICAgICAgICAgICAgICAgICBEZXRhaWxzOiAke2Vycn1gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiaW1wb3J0IEZJVEIgZnJvbSBcIi4vZml0Yi5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWRGSVRCIGV4dGVuZHMgRklUQiB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdGhpcy5yZW5kZXJUaW1lZEljb24odGhpcy5pbnB1dERpdik7XG4gICAgICAgIHRoaXMuaGlkZUJ1dHRvbnMoKTtcbiAgICAgICAgdGhpcy5uZWVkc1JlaW5pdGlhbGl6YXRpb24gPSB0cnVlO1xuICAgIH1cbiAgICBoaWRlQnV0dG9ucygpIHtcbiAgICAgICAgJCh0aGlzLnN1Ym1pdEJ1dHRvbikuaGlkZSgpO1xuICAgICAgICAkKHRoaXMuY29tcGFyZUJ1dHRvbikuaGlkZSgpO1xuICAgIH1cbiAgICByZW5kZXJUaW1lZEljb24oY29tcG9uZW50KSB7XG4gICAgICAgIC8vIHJlbmRlcnMgdGhlIGNsb2NrIGljb24gb24gdGltZWQgY29tcG9uZW50cy4gICAgVGhlIGNvbXBvbmVudCBwYXJhbWV0ZXJcbiAgICAgICAgLy8gaXMgdGhlIGVsZW1lbnQgdGhhdCB0aGUgaWNvbiBzaG91bGQgYmUgYXBwZW5kZWQgdG8uXG4gICAgICAgIHZhciB0aW1lSWNvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHZhciB0aW1lSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICAgICQodGltZUljb24pLmF0dHIoe1xuICAgICAgICAgICAgc3JjOiBcIi4uL19zdGF0aWMvY2xvY2sucG5nXCIsXG4gICAgICAgICAgICBzdHlsZTogXCJ3aWR0aDoxNXB4O2hlaWdodDoxNXB4XCIsXG4gICAgICAgIH0pO1xuICAgICAgICB0aW1lSWNvbkRpdi5jbGFzc05hbWUgPSBcInRpbWVUaXBcIjtcbiAgICAgICAgdGltZUljb25EaXYudGl0bGUgPSBcIlwiO1xuICAgICAgICB0aW1lSWNvbkRpdi5hcHBlbmRDaGlsZCh0aW1lSWNvbik7XG4gICAgICAgICQoY29tcG9uZW50KS5wcmVwZW5kKHRpbWVJY29uRGl2KTtcbiAgICB9XG4gICAgY2hlY2tDb3JyZWN0VGltZWQoKSB7XG4gICAgICAgIC8vIFJldHVybnMgaWYgdGhlIHF1ZXN0aW9uIHdhcyBjb3JyZWN0LCBpbmNvcnJlY3QsIG9yIHNraXBwZWQgKHJldHVybiBudWxsIGluIHRoZSBsYXN0IGNhc2UpXG4gICAgICAgIHN3aXRjaCAodGhpcy5jb3JyZWN0KSB7XG4gICAgICAgICAgICBjYXNlIHRydWU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiVFwiO1xuICAgICAgICAgICAgY2FzZSBmYWxzZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJGXCI7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGhpZGVGZWVkYmFjaygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsYW5rQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICQodGhpcy5ibGFua0FycmF5W2ldKS5yZW1vdmVDbGFzcyhcImlucHV0LXZhbGlkYXRpb24tZXJyb3JcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxuXG4gICAgcmVpbml0aWFsaXplTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLnNldHVwQmxhbmtzKCk7XG4gICAgfVxufVxuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5LmZpbGxpbnRoZWJsYW5rID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICBpZiAob3B0cy50aW1lZCkge1xuICAgICAgICByZXR1cm4gbmV3IFRpbWVkRklUQihvcHRzKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBGSVRCKG9wdHMpO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==