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
/* harmony import */ var _libs_aleaPRNG_1_1_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./libs/aleaPRNG-1.1.js */ 91324);
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
    dyn_imports,
    html_in,
    divid,
    prepareCheckAnswers
) {
    // Initialize RNG with ``seed``.
    const rand = (0,_libs_aleaPRNG_1_1_js__WEBPACK_IMPORTED_MODULE_0__.aleaPRNG)(seed);

    // See `RAND_FUNC <RAND_FUNC>`_, which refers to ``rand`` above.
    const dyn_vars_eval = window.Function(
        "v",
        "rand",
        ...Object.keys(dyn_imports),
        `"use strict";\n${dyn_vars};\nreturn v;`
    )({ divid, prepareCheckAnswers, dyn_imports }, rand, ...Object.values(dyn_imports));

    let html_out;
    if (typeof dyn_vars_eval.beforeContentRender === "function") {
        try {
            dyn_vars_eval.beforeContentRender(dyn_vars_eval);
        } catch (err) {
            console.assert(false,
                `Error in problem ${divid} invoking beforeContentRender`
            );
            throw err;
        }
    }
    try {
        html_out = render_html(html_in, dyn_vars_eval);
    } catch (err) {
        console.assert(false, `Error rendering problem ${divid} text using EJS`);
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
            console.assert(false, "Error calling beforeCheckAnswers");
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
            console.assert(false, "Error calling afterCheckAnswers");
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
        console.assert(false, `Error evaluating feedback index ${index}.`);
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

    this.createFITBElement();
    this.setupBlanks();
    this.caption = "Fill in the Blank";
    this.addCaption("runestone");

    // Define a promise which imports any libraries needed by dynamic problems.
    this.dyn_imports = {};
    let imports_promise = Promise.resolve();
    if (dict_.dyn_imports !== undefined) {
      // Collect all import promises.
      let import_promises = [];
      for (const import_ of dict_.dyn_imports) {
        switch (import_) {
            case "BTM": import_promises.push(__webpack_require__.e(/*! import() */ "runestone_fitb_js_libs_BTM_src_BTM_root_js").then(__webpack_require__.bind(__webpack_require__, /*! ./libs/BTM/src/BTM_root.js */ 63368))); break;
            default: throw(`Unknown dynamic import ${import_}`);
        }
      }

      // Combine the resulting module namespace objects when these promises resolve.
      imports_promise = Promise.all(import_promises).then((module_namespace_arr) =>
        this.dyn_imports = Object.assign({}, ...module_namespace_arr)
      );
    }

    // Resolve these promises.
    imports_promise.then(() => {
      this.checkServer("fillb", false).then(() => {
        // One option for a dynamic problem is to produce a static problem by providing a fixed seed value. This is typically used when the goal is to render the problem as an image for inclusion in static content (a PDF, etc.). To support this, consider the following cases:
        //
        /// Case  Has static seed?  Is a client-side, dynamic problem?  Has local seed?  Result
        /// 0     No                No                                  X                No action needed.
        /// 1     No                Yes                                 No               this.randomize().
        /// 2     No                Yes                                 Yes              No action needed -- problem already restored from local storage.
        /// 3     Yes               No                                  X                Warning: seed ignored.
        /// 4     Yes               Yes                                 No               Assign seed; this.renderDynamicContent().
        /// 5     Yes               Yes                                 Yes              If seeds differ, issue warning. No additional action needed -- problem already restored from local storage.

        const has_static_seed = dict_.static_seed !== undefined;
        const is_client_dynamic = typeof this.dyn_vars === "string";
        const has_local_seed = this.seed !== undefined;

        // Case 1
        if (!has_static_seed && is_client_dynamic && !has_local_seed) {
          this.randomize();
        } else
        // Case 3
        if (has_static_seed && !is_client_dynamic) {
          console.assert(false, "Warning: the provided static seed was ignored, because it only affects client-side, dynamic problems.");
        } else
        // Case 4
        if (has_static_seed && is_client_dynamic && !has_local_seed) {
          this.seed = dict_.static_seed;
          this.renderDynamicContent();
        } else
        // Case 5
        if (has_static_seed && is_client_dynamic && has_local_seed && this.seed !== dict_.static_seed) {
          console.assert(false, "Warning: the provided static seed was overridden by the seed found in local storage.");
        }
        // Cases 0 and 2
        else {
          // No action needed.
        }

        if (typeof Prism !== "undefined") {
            Prism.highlightAllUnder(this.containerDiv);
          }

        this.indicate_component_ready();
      });
    });
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
          this.dyn_imports,
          this.descriptionDiv.origInnerHTML,
          this.divid,
          this.prepareCheckAnswers.bind(this),
        );
      this.descriptionDiv.replaceChildren(...html_nodes);

      if (typeof (this.dyn_vars_eval.afterContentRender) === "function") {
        try {
          this.dyn_vars_eval.afterContentRender(this.dyn_vars_eval);
        } catch (err) {
          console.assert(false, `Error in problem ${this.divid} invoking afterContentRender`);
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
          console.assert(false, err.message);
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
        console.assert(false,
          `Error rendering Fill in the Blank Problem ${this.id}
                     Details: ${err}`
        );
      }
    }
  });
});


/***/ }),

/***/ 91324:
/*!************************************************!*\
  !*** ./runestone/fitb/js/libs/aleaPRNG-1.1.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "aleaPRNG": () => (/* binding */ aleaPRNG)
/* harmony export */ });
/*////////////////////////////////////////////////////////////////
aleaPRNG 1.1
//////////////////////////////////////////////////////////////////
https://github.com/macmcmeans/aleaPRNG/blob/master/aleaPRNG-1.1.js
//////////////////////////////////////////////////////////////////
Original work copyright © 2010 Johannes Baagøe, under MIT license
This is a derivative work copyright (c) 2017-2020, W. Mac" McMeans, under BSD license.
Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
////////////////////////////////////////////////////////////////*/
function aleaPRNG() {
    return( function( args ) {
        "use strict";

        const version = 'aleaPRNG 1.1.0';

        var s0
            , s1
            , s2
            , c
            , uinta = new Uint32Array( 3 )
            , initialArgs
            , mashver = ''
        ;

        /* private: initializes generator with specified seed */
        function _initState( _internalSeed ) {
            var mash = Mash();

            // internal state of generator
            s0 = mash( ' ' );
            s1 = mash( ' ' );
            s2 = mash( ' ' );

            c = 1;

            for( var i = 0; i < _internalSeed.length; i++ ) {
                s0 -= mash( _internalSeed[ i ] );
                if( s0 < 0 ) { s0 += 1; }

                s1 -= mash( _internalSeed[ i ] );
                if( s1 < 0 ) { s1 += 1; }

                s2 -= mash( _internalSeed[ i ] );
                if( s2 < 0 ) { s2 += 1; }
            }

            mashver = mash.version;

            mash = null;
        };

        /* private: dependent string hash function */
        function Mash() {
            var n = 4022871197; // 0xefc8249d

            var mash = function( data ) {
                data = data.toString();

                // cache the length
                for( var i = 0, l = data.length; i < l; i++ ) {
                    n += data.charCodeAt( i );

                    var h = 0.02519603282416938 * n;

                    n  = h >>> 0;
                    h -= n;
                    h *= n;
                    n  = h >>> 0;
                    h -= n;
                    n += h * 4294967296; // 0x100000000      2^32
                }
                return ( n >>> 0 ) * 2.3283064365386963e-10; // 2^-32
            };

            mash.version = 'Mash 0.9';
            return mash;
        };


        /* private: check if number is integer */
        function _isInteger( _int ) {
            return parseInt( _int, 10 ) === _int;
        };

        /* public: return a 32-bit fraction in the range [0, 1]
        This is the main function returned when aleaPRNG is instantiated
        */
        var random = function() {
            var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32

            s0 = s1;
            s1 = s2;

            return s2 = t - ( c = t | 0 );
        };

        /* public: return a 53-bit fraction in the range [0, 1] */
        random.fract53 = function() {
            return random() + ( random() * 0x200000  | 0 ) * 1.1102230246251565e-16; // 2^-53
        };

        /* public: return an unsigned integer in the range [0, 2^32] */
        random.int32 = function() {
            return random() * 0x100000000; // 2^32
        };

        /* public: advance the generator the specified amount of cycles */
        random.cycle = function( _run ) {
            _run = typeof _run === 'undefined' ? 1 : +_run;
            if( _run < 1 ) { _run = 1; }
            for( var i = 0; i < _run; i++ ) { random(); }
        };

        /* public: return inclusive range */
        random.range = function() {
            var loBound
                , hiBound
            ;

            if( arguments.length === 1 ) {
                loBound = 0;
                hiBound = arguments[ 0 ];

            } else {
                loBound = arguments[ 0 ];
                hiBound = arguments[ 1 ];
            }

            if( arguments[ 0 ] > arguments[ 1 ] ) {
                loBound = arguments[ 1 ];
                hiBound = arguments[ 0 ];
            }

            // return integer
            if( _isInteger( loBound ) && _isInteger( hiBound ) ) {
                return Math.floor( random() * ( hiBound - loBound + 1 ) ) + loBound;

            // return float
            } else {
                return random() * ( hiBound - loBound ) + loBound;
            }
        };

        /* public: initialize generator with the seed values used upon instantiation */
        random.restart = function() {
            _initState( initialArgs );
        };

        /* public: seeding function */
        random.seed = function() {
            _initState( Array.prototype.slice.call( arguments ) );
        };

        /* public: show the version of the RNG */
        random.version = function() {
            return version;
        };

        /* public: show the version of the RNG and the Mash string hasher */
        random.versions = function() {
            return version + ', ' + mashver;
        };

        // when no seed is specified, create a random one from Windows Crypto (Monte Carlo application)
        if( args.length === 0 ) {
             window.crypto.getRandomValues( uinta );
             args = [ uinta[ 0 ], uinta[ 1 ], uinta[ 2 ] ];
        };

        // store the seed used when the RNG was instantiated, if any
        initialArgs = args;

        // initialize the RNG
        _initState( args );

        return random;

    })( Array.prototype.slice.call( arguments ) );
};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2ZpdGJfanNfdGltZWRmaXRiX2pzLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7Ozs7O0FDUEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkQ7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRXFDOztBQUVsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLHVCQUF1QjtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsWUFBWSxNQUFNO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEseVdBQXlXO0FBQ3pXO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLCtEQUFROztBQUV6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLElBQUksVUFBVSxXQUFXO0FBQy9DLFFBQVEseUNBQXlDOztBQUVqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLG9DQUFvQyxPQUFPO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTix5REFBeUQsT0FBTztBQUNoRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUCxzQ0FBc0MseUJBQXlCO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixzQkFBc0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdCQUFnQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLFlBQVkseUJBQXlCO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQSxrTUFBa007QUFDbE07QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtSkFBbUo7QUFDbko7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLG1DQUFtQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLGlFQUFpRSxNQUFNO0FBQ3ZFO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9GQUFvRjtBQUNwRjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFYTs7QUFFZ0Q7QUFLcEM7QUFDRTtBQUNH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QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDRCQUE0QjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsZ0RBQUk7QUFDbkIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvY3NzL2ZpdGIuY3NzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLWkxOG4uZW4uanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2pzL2ZpdGItaTE4bi5wdC1ici5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvZml0Yi11dGlscy5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvZml0Yi5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvbGlicy9hbGVhUFJORy0xLjEuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2pzL3RpbWVkZml0Yi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIkLmkxOG4oKS5sb2FkKHtcbiAgICBlbjoge1xuICAgICAgICBtc2dfbm9fYW5zd2VyOiBcIk5vIGFuc3dlciBwcm92aWRlZC5cIixcbiAgICAgICAgbXNnX2ZpdGJfY2hlY2tfbWU6IFwiQ2hlY2sgbWVcIixcbiAgICAgICAgbXNnX2ZpdGJfY29tcGFyZV9tZTogXCJDb21wYXJlIG1lXCIsXG4gICAgICAgIG1zZ19maXRiX3JhbmRvbWl6ZTogXCJSYW5kb21pemVcIlxuICAgIH0sXG59KTtcbiIsIiQuaTE4bigpLmxvYWQoe1xuICAgIFwicHQtYnJcIjoge1xuICAgICAgICBtc2dfbm9fYW5zd2VyOiBcIk5lbmh1bWEgcmVzcG9zdGEgZGFkYS5cIixcbiAgICAgICAgbXNnX2ZpdGJfY2hlY2tfbWU6IFwiVmVyaWZpY2FyXCIsXG4gICAgICAgIG1zZ19maXRiX2NvbXBhcmVfbWU6IFwiQ29tcGFyYXJcIlxuICAgIH0sXG59KTtcbiIsIi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyB8ZG9jbmFtZXwgLSBncmFkaW5nLXJlbGF0ZWQgdXRpbGl0aWVzIGZvciBGSVRCIHF1ZXN0aW9uc1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIFRoaXMgY29kZSBydW5zIGJvdGggb24gdGhlIHNlcnZlciAoZm9yIHNlcnZlci1zaWRlIGdyYWRpbmcpIGFuZCBvbiB0aGUgY2xpZW50LiBJdCdzIHBsYWNlZCBoZXJlIGFzIGEgc2V0IG9mIGZ1bmN0aW9ucyBzcGVjaWZpY2FsbHkgZm9yIHRoaXMgcHVycG9zZS5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCB7IGFsZWFQUk5HIH0gZnJvbSBcIi4vbGlicy9hbGVhUFJORy0xLjEuanNcIjtcblxuLy8gSW5jbHVkZXNcbi8vID09PT09PT09XG4vLyBOb25lLlxuLy9cbi8vXG4vLyBHbG9iYWxzXG4vLyA9PT09PT09XG5mdW5jdGlvbiByZW5kZXJfaHRtbChodG1sX2luLCBkeW5fdmFyc19ldmFsKSB7XG4gICAgLy8gQ2hhbmdlIHRoZSByZXBsYWNlbWVudCB0b2tlbnMgaW4gdGhlIEhUTUwgaW50byB0YWdzLCBzbyB3ZSBjYW4gcmVwbGFjZSB0aGVtIHVzaW5nIFhNTC4gVGhlIGhvcnJpYmxlIHJlZ2V4IGlzOlxuICAgIC8vXG4gICAgLy8gTG9vayBmb3IgdGhlIGNoYXJhY3RlcnMgYGBbJT1gYCAodGhlIG9wZW5pbmcgZGVsaW1pdGVyKVxuICAgIC8vLyBcXFslPVxuICAgIC8vIEZvbGxvd2VkIGJ5IGFueSBhbW91bnQgb2Ygd2hpdGVzcGFjZS5cbiAgICAvLy8gXFxzKlxuICAgIC8vIFN0YXJ0IGEgZ3JvdXAgdGhhdCB3aWxsIGNhcHR1cmUgdGhlIGNvbnRlbnRzIChleGNsdWRpbmcgd2hpdGVzcGFjZSkgb2YgdGhlIHRva2Vucy4gRm9yIGV4YW1wbGUsIGdpdmVuIGBgWyU9IGZvbygpICVdYGAsIHRoZSBjb250ZW50cyBpcyBgYGZvbygpYGAuXG4gICAgLy8vIChcbiAgICAvLyBEb24ndCBjYXB0dXJlIHRoZSBjb250ZW50cyBvZiB0aGlzIGdyb3VwLCBzaW5jZSBpdCdzIG9ubHkgYSBzaW5nbGUgY2hhcmFjdGVyLiBNYXRjaCBhbnkgY2hhcmFjdGVyLi4uXG4gICAgLy8vIChcbiAgICAvLy8gPzouXG4gICAgLy8vIC4uLnRoYXQgZG9lc24ndCBlbmQgd2l0aCBgYCVdYGAgKHRoZSBjbG9zaW5nIGRlbGltaXRlcikuXG4gICAgLy8vICg/ISVdKVxuICAgIC8vLyApXG4gICAgLy8gTWF0Y2ggdGhpcyAoYW55dGhpbmcgYnV0IHRoZSBjbG9zaW5nIGRlbGltaXRlcikgYXMgbXVjaCBhcyB3ZSBjYW4uXG4gICAgLy8vICopXG4gICAgLy8gTmV4dCwgbG9vayBmb3IgYW55IHdoaXRlc3BhY2UuXG4gICAgLy8vIFxccypcbiAgICAvLyBGaW5hbGx5LCBsb29rIGZvciB0aGUgY2xvc2luZyBkZWxpbWl0ZXIgYGAlXWBgLlxuICAgIC8vLyAlXFxdXG4gICAgY29uc3QgaHRtbF9yZXBsYWNlZCA9IGh0bWxfaW4ucmVwbGFjZUFsbChcbiAgICAgICAgL1xcWyU9XFxzKigoPzouKD8hJV0pKSopXFxzKiVcXF0vZyxcbiAgICAgICAgLy8gUmVwbGFjZSBpdCB3aXRoIGEgYDxzY3JpcHQtZXZhbD5gIHRhZy4gUXVvdGUgdGhlIHN0cmluZywgd2hpY2ggd2lsbCBhdXRvbWF0aWNhbGx5IGVzY2FwZSBhbnkgZG91YmxlIHF1b3RlcywgdXNpbmcgSlNPTi5cbiAgICAgICAgKG1hdGNoLCBncm91cDEpID0+XG4gICAgICAgICAgICBgPHNjcmlwdC1ldmFsIGV4cHI9JHtKU09OLnN0cmluZ2lmeShncm91cDEpfT48L3NjcmlwdC1ldmFsPmBcbiAgICApO1xuICAgIC8vIEdpdmVuIEhUTUwsIHR1cm4gaXQgaW50byBhIERPTS4gV2FsayB0aGUgYGA8c2NyaXB0LWV2YWw+YGAgdGFncywgcGVyZm9ybWluZyB0aGUgcmVxdWVzdGVkIGV2YWx1YXRpb24gb24gdGhlbS5cbiAgICAvL1xuICAgIC8vIFNlZSBgRE9NUGFyc2VyIDxodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRE9NUGFyc2VyPmBfLlxuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbiAgICAvLyBTZWUgYERPTVBhcnNlci5wYXJzZUZyb21TdHJpbmcoKSA8aHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0RPTVBhcnNlci9wYXJzZUZyb21TdHJpbmc+YF8uXG4gICAgY29uc3QgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhodG1sX3JlcGxhY2VkLCBcInRleHQvaHRtbFwiKTtcbiAgICBjb25zdCBzY3JpcHRfZXZhbF90YWdzID0gZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0LWV2YWxcIik7XG4gICAgd2hpbGUgKHNjcmlwdF9ldmFsX3RhZ3MubGVuZ3RoKSB7XG4gICAgICAgIC8vIEdldCB0aGUgZmlyc3QgdGFnLiBJdCB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgY29sbGVjdGlvbiBhZnRlciBpdCdzIHJlcGxhY2VkIHdpdGggaXRzIHZhbHVlLlxuICAgICAgICBjb25zdCBzY3JpcHRfZXZhbF90YWcgPSBzY3JpcHRfZXZhbF90YWdzWzBdO1xuICAgICAgICAvLyBTZWUgaWYgdGhpcyBgYDxzY3JpcHQtZXZhbD5gYCB0YWcgaGFzIGFzIGBgQGV4cHJgYCBhdHRyaWJ1dGUuXG4gICAgICAgIGNvbnN0IGV4cHIgPSBzY3JpcHRfZXZhbF90YWcuZ2V0QXR0cmlidXRlKFwiZXhwclwiKTtcbiAgICAgICAgLy8gSWYgc28sIGV2YWx1YXRlIGl0LlxuICAgICAgICBpZiAoZXhwcikge1xuICAgICAgICAgICAgY29uc3QgZXZhbF9yZXN1bHQgPSB3aW5kb3cuRnVuY3Rpb24oXG4gICAgICAgICAgICAgICAgXCJ2XCIsXG4gICAgICAgICAgICAgICAgLi4uT2JqZWN0LmtleXMoZHluX3ZhcnNfZXZhbCksXG4gICAgICAgICAgICAgICAgYFwidXNlIHN0cmljdDtcIlxcbnJldHVybiAke2V4cHJ9O2BcbiAgICAgICAgICAgICkoZHluX3ZhcnNfZXZhbCwgLi4uT2JqZWN0LnZhbHVlcyhkeW5fdmFyc19ldmFsKSk7XG4gICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSB0YWcgd2l0aCB0aGUgcmVzdWx0aW5nIHZhbHVlLlxuICAgICAgICAgICAgc2NyaXB0X2V2YWxfdGFnLnJlcGxhY2VXaXRoKGV2YWxfcmVzdWx0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiB0aGUgYm9keSBjb250ZW50cy4gTm90ZSB0aGF0IHRoZSBgYERPTVBhcnNlcmBgIGNvbnN0cnVjdHMgYW4gZW50aXJlIGRvY3VtZW50LCBub3QganVzdCB0aGUgZG9jdW1lbnQgZnJhZ21lbnQgd2UgcGFzc2VkIGl0LiBUaGVyZWZvcmUsIGV4dHJhY3QgdGhlIGRlc2lyZWQgZnJhZ21lbnQgYW5kIHJldHVybiB0aGF0LiBOb3RlIHRoYXQgd2UgbmVlZCB0byB1c2UgYGNoaWxkTm9kZXMgPGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlL2NoaWxkTm9kZXM+YF8sIHdoaWNoIGluY2x1ZGVzIG5vbi1lbGVtZW50IGNoaWxkcmVuIGxpa2UgdGV4dCBhbmQgY29tbWVudHM7IHVzaW5nIGBgY2hpbGRyZW5gYCBvbWl0cyB0aGVzZSBub24tZWxlbWVudCBjaGlsZHJlbi5cbiAgICByZXR1cm4gZG9jLmJvZHkuY2hpbGROb2Rlcztcbn1cblxuLy8gRnVuY3Rpb25zXG4vLyA9PT09PT09PT1cbi8vIFVwZGF0ZSB0aGUgcHJvYmxlbSdzIGRlc2NyaXB0aW9uIGJhc2VkIG9uIGR5bmFtaWNhbGx5LWdlbmVyYXRlZCBjb250ZW50LlxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckR5bmFtaWNDb250ZW50KFxuICAgIHNlZWQsXG4gICAgZHluX3ZhcnMsXG4gICAgZHluX2ltcG9ydHMsXG4gICAgaHRtbF9pbixcbiAgICBkaXZpZCxcbiAgICBwcmVwYXJlQ2hlY2tBbnN3ZXJzXG4pIHtcbiAgICAvLyBJbml0aWFsaXplIFJORyB3aXRoIGBgc2VlZGBgLlxuICAgIGNvbnN0IHJhbmQgPSBhbGVhUFJORyhzZWVkKTtcblxuICAgIC8vIFNlZSBgUkFORF9GVU5DIDxSQU5EX0ZVTkM+YF8sIHdoaWNoIHJlZmVycyB0byBgYHJhbmRgYCBhYm92ZS5cbiAgICBjb25zdCBkeW5fdmFyc19ldmFsID0gd2luZG93LkZ1bmN0aW9uKFxuICAgICAgICBcInZcIixcbiAgICAgICAgXCJyYW5kXCIsXG4gICAgICAgIC4uLk9iamVjdC5rZXlzKGR5bl9pbXBvcnRzKSxcbiAgICAgICAgYFwidXNlIHN0cmljdFwiO1xcbiR7ZHluX3ZhcnN9O1xcbnJldHVybiB2O2BcbiAgICApKHsgZGl2aWQsIHByZXBhcmVDaGVja0Fuc3dlcnMsIGR5bl9pbXBvcnRzIH0sIHJhbmQsIC4uLk9iamVjdC52YWx1ZXMoZHluX2ltcG9ydHMpKTtcblxuICAgIGxldCBodG1sX291dDtcbiAgICBpZiAodHlwZW9mIGR5bl92YXJzX2V2YWwuYmVmb3JlQ29udGVudFJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBkeW5fdmFyc19ldmFsLmJlZm9yZUNvbnRlbnRSZW5kZXIoZHluX3ZhcnNfZXZhbCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsXG4gICAgICAgICAgICAgICAgYEVycm9yIGluIHByb2JsZW0gJHtkaXZpZH0gaW52b2tpbmcgYmVmb3JlQ29udGVudFJlbmRlcmBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaHRtbF9vdXQgPSByZW5kZXJfaHRtbChodG1sX2luLCBkeW5fdmFyc19ldmFsKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIGBFcnJvciByZW5kZXJpbmcgcHJvYmxlbSAke2RpdmlkfSB0ZXh0IHVzaW5nIEVKU2ApO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgfVxuXG4gICAgLy8gdGhlIGFmdGVyQ29udGVudFJlbmRlciBldmVudCB3aWxsIGJlIGNhbGxlZCBieSB0aGUgY2FsbGVyIG9mIHRoaXMgZnVuY3Rpb24gKGFmdGVyIGl0IHVwZGF0ZWQgdGhlIEhUTUwgYmFzZWQgb24gdGhlIGNvbnRlbnRzIG9mIGh0bWxfb3V0KS5cbiAgICByZXR1cm4gW2h0bWxfb3V0LCBkeW5fdmFyc19ldmFsXTtcbn1cblxuLy8gR2l2ZW4gc3R1ZGVudCBhbnN3ZXJzLCBncmFkZSB0aGVtIGFuZCBwcm92aWRlIGZlZWRiYWNrLlxuLy9cbi8vIE91dHB1dHM6XG4vL1xuLy8gLSAgICBgYGRpc3BsYXlGZWVkYGAgaXMgYW4gYXJyYXkgb2YgSFRNTCBmZWVkYmFjay5cbi8vIC0gICAgYGBpc0NvcnJlY3RBcnJheWBgIGlzIGFuIGFycmF5IG9mIHRydWUsIGZhbHNlLCBvciBudWxsICh0aGUgcXVlc3Rpb24gd2Fzbid0IGFuc3dlcmVkKS5cbi8vIC0gICAgYGBjb3JyZWN0YGAgaXMgdHJ1ZSwgZmFsc2UsIG9yIG51bGwgKHRoZSBxdWVzdGlvbiB3YXNuJ3QgYW5zd2VyZWQpLlxuLy8gLSAgICBgYHBlcmNlbnRgYCBpcyB0aGUgcGVyY2VudGFnZSBvZiBjb3JyZWN0IGFuc3dlcnMgKGZyb20gMCB0byAxLCBub3QgMCB0byAxMDApLlxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrQW5zd2Vyc0NvcmUoXG4gICAgLy8gX2BibGFua05hbWVzRGljdGA6IEFuIGRpY3Qgb2Yge2JsYW5rX25hbWUsIGJsYW5rX2luZGV4fSBzcGVjaWZ5aW5nIHRoZSBuYW1lIGZvciBlYWNoIG5hbWVkIGJsYW5rLlxuICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgIC8vIF9gZ2l2ZW5fYXJyYDogQW4gYXJyYXkgb2Ygc3RyaW5ncyBjb250YWluaW5nIHN0dWRlbnQtcHJvdmlkZWQgYW5zd2VycyBmb3IgZWFjaCBibGFuay5cbiAgICBnaXZlbl9hcnIsXG4gICAgLy8gQSAyLUQgYXJyYXkgb2Ygc3RyaW5ncyBnaXZpbmcgZmVlZGJhY2sgZm9yIGVhY2ggYmxhbmsuXG4gICAgZmVlZGJhY2tBcnJheSxcbiAgICAvLyBfYGR5bl92YXJzX2V2YWxgOiBBIGRpY3QgcHJvZHVjZWQgYnkgZXZhbHVhdGluZyB0aGUgSmF2YVNjcmlwdCBmb3IgYSBkeW5hbWljIGV4ZXJjaXNlLlxuICAgIGR5bl92YXJzX2V2YWxcbikge1xuICAgIGlmIChcbiAgICAgICAgZHluX3ZhcnNfZXZhbCAmJlxuICAgICAgICB0eXBlb2YgZHluX3ZhcnNfZXZhbC5iZWZvcmVDaGVja0Fuc3dlcnMgPT09IFwiZnVuY3Rpb25cIlxuICAgICkge1xuICAgICAgICBjb25zdCBbbmFtZWRCbGFua1ZhbHVlcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZF0gPSBwYXJzZUFuc3dlcnMoXG4gICAgICAgICAgICBibGFua05hbWVzRGljdCxcbiAgICAgICAgICAgIGdpdmVuX2FycixcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgZHZlX2JsYW5rcyA9IE9iamVjdC5hc3NpZ24oe30sIGR5bl92YXJzX2V2YWwsIG5hbWVkQmxhbmtWYWx1ZXMpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZHluX3ZhcnNfZXZhbC5iZWZvcmVDaGVja0Fuc3dlcnMoZHZlX2JsYW5rcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIFwiRXJyb3IgY2FsbGluZyBiZWZvcmVDaGVja0Fuc3dlcnNcIik7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBLZWVwIHRyYWNrIGlmIGFsbCBhbnN3ZXJzIGFyZSBjb3JyZWN0IG9yIG5vdC5cbiAgICBsZXQgY29ycmVjdCA9IHRydWU7XG4gICAgY29uc3QgaXNDb3JyZWN0QXJyYXkgPSBbXTtcbiAgICBjb25zdCBkaXNwbGF5RmVlZCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ2l2ZW5fYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGdpdmVuID0gZ2l2ZW5fYXJyW2ldO1xuICAgICAgICAvLyBJZiB0aGlzIGJsYW5rIGlzIGVtcHR5LCBwcm92aWRlIG5vIGZlZWRiYWNrIGZvciBpdC5cbiAgICAgICAgaWYgKGdpdmVuID09PSBcIlwiKSB7XG4gICAgICAgICAgICBpc0NvcnJlY3RBcnJheS5wdXNoKG51bGwpO1xuICAgICAgICAgICAgLy8gVE9ETzogd2FzICQuaTE4bihcIm1zZ19ub19hbnN3ZXJcIikuXG4gICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKFwiTm8gYW5zd2VyIHByb3ZpZGVkLlwiKTtcbiAgICAgICAgICAgIGNvcnJlY3QgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIExvb2sgdGhyb3VnaCBhbGwgZmVlZGJhY2sgZm9yIHRoaXMgYmxhbmsuIFRoZSBsYXN0IGVsZW1lbnQgaW4gdGhlIGFycmF5IGFsd2F5cyBtYXRjaGVzLiBJZiBubyBmZWVkYmFjayBmb3IgdGhpcyBibGFuayBleGlzdHMsIHVzZSBhbiBlbXB0eSBsaXN0LlxuICAgICAgICAgICAgY29uc3QgZmJsID0gZmVlZGJhY2tBcnJheVtpXSB8fCBbXTtcbiAgICAgICAgICAgIGxldCBqO1xuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGZibC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIC8vIFRoZSBsYXN0IGl0ZW0gb2YgZmVlZGJhY2sgYWx3YXlzIG1hdGNoZXMuXG4gICAgICAgICAgICAgICAgaWYgKGogPT09IGZibC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goZmJsW2pdW1wiZmVlZGJhY2tcIl0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBhIGR5bmFtaWMgc29sdXRpb24uLi5cbiAgICAgICAgICAgICAgICBpZiAoZHluX3ZhcnNfZXZhbCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbbmFtZWRCbGFua1ZhbHVlcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZF0gPVxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VBbnN3ZXJzKGJsYW5rTmFtZXNEaWN0LCBnaXZlbl9hcnIsIGR5bl92YXJzX2V2YWwpO1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSB3YXMgYSBwYXJzZSBlcnJvciwgdGhlbiBpdCBzdHVkZW50J3MgYW5zd2VyIGlzIGluY29ycmVjdC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGdpdmVuX2Fycl9jb252ZXJ0ZWRbaV0gaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goZ2l2ZW5fYXJyX2NvbnZlcnRlZFtpXS5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvdW50IHRoaXMgYXMgd3JvbmcgYnkgbWFraW5nIGogIT0gMCAtLSBzZWUgdGhlIGNvZGUgdGhhdCBydW5zIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBleGVjdXRpbmcgdGhlIGJyZWFrLlxuICAgICAgICAgICAgICAgICAgICAgICAgaiA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYSBmdW5jdGlvbiB0byB3cmFwIHRoZSBleHByZXNzaW9uIHRvIGV2YWx1YXRlLiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRnVuY3Rpb24vRnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgIC8vIFBhc3MgdGhlIGFuc3dlciwgYXJyYXkgb2YgYWxsIGFuc3dlcnMsIHRoZW4gYWxsIGVudHJpZXMgaW4gYGB0aGlzLmR5bl92YXJzX2V2YWxgYCBkaWN0IGFzIGZ1bmN0aW9uIHBhcmFtZXRlcnMuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzX2VxdWFsID0gd2luZG93LkZ1bmN0aW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYW5zX2FycmF5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5PYmplY3Qua2V5cyhkeW5fdmFyc19ldmFsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLk9iamVjdC5rZXlzKG5hbWVkQmxhbmtWYWx1ZXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgYFwidXNlIHN0cmljdDtcIlxcbnJldHVybiAke2ZibFtqXVtcInNvbHV0aW9uX2NvZGVcIl19O2BcbiAgICAgICAgICAgICAgICAgICAgKShcbiAgICAgICAgICAgICAgICAgICAgICAgIGdpdmVuX2Fycl9jb252ZXJ0ZWRbaV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBnaXZlbl9hcnJfY29udmVydGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uT2JqZWN0LnZhbHVlcyhkeW5fdmFyc19ldmFsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLk9iamVjdC52YWx1ZXMobmFtZWRCbGFua1ZhbHVlcylcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgc3R1ZGVudCdzIGFuc3dlciBpcyBlcXVhbCB0byB0aGlzIGl0ZW0sIHRoZW4gYXBwZW5kIHRoaXMgaXRlbSdzIGZlZWRiYWNrLlxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNfZXF1YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGlzX2VxdWFsID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gaXNfZXF1YWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBmYmxbal1bXCJmZWVkYmFja1wiXVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBhIHJlZ2V4cC4uLlxuICAgICAgICAgICAgICAgICAgICBpZiAoXCJyZWdleFwiIGluIGZibFtqXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0dCA9IFJlZ0V4cChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYmxbal1bXCJyZWdleFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYmxbal1bXCJyZWdleEZsYWdzXCJdXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhdHQudGVzdChnaXZlbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKGZibFtqXVtcImZlZWRiYWNrXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBudW1iZXIuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChcIm51bWJlclwiIGluIGZibFtqXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBbbWluLCBtYXhdID0gZmJsW2pdW1wibnVtYmVyXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29udmVydCB0aGUgZ2l2ZW4gc3RyaW5nIHRvIGEgbnVtYmVyLiBXaGlsZSB0aGVyZSBhcmUgYGxvdHMgb2Ygd2F5cyA8aHR0cHM6Ly9jb2RlcndhbGwuY29tL3AvNXRsaG13L2NvbnZlcnRpbmctc3RyaW5ncy10by1udW1iZXItaW4tamF2YXNjcmlwdC1waXRmYWxscz5gXyB0byBkbyB0aGlzOyB0aGlzIHZlcnNpb24gc3VwcG9ydHMgb3RoZXIgYmFzZXMgKGhleC9iaW5hcnkvb2N0YWwpIGFzIHdlbGwgYXMgZmxvYXRzLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0dWFsID0gK2dpdmVuO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdHVhbCA+PSBtaW4gJiYgYWN0dWFsIDw9IG1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goZmJsW2pdW1wiZmVlZGJhY2tcIl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUaGUgYW5zd2VyIGlzIGNvcnJlY3QgaWYgaXQgbWF0Y2hlZCB0aGUgZmlyc3QgZWxlbWVudCBpbiB0aGUgYXJyYXkuIEEgc3BlY2lhbCBjYXNlOiBpZiBvbmx5IG9uZSBhbnN3ZXIgaXMgcHJvdmlkZWQsIGNvdW50IGl0IHdyb25nOyB0aGlzIGlzIGEgbWlzZm9ybWVkIHByb2JsZW0uXG4gICAgICAgICAgICBjb25zdCBpc19jb3JyZWN0ID0gaiA9PT0gMCAmJiBmYmwubGVuZ3RoID4gMTtcbiAgICAgICAgICAgIGlzQ29ycmVjdEFycmF5LnB1c2goaXNfY29ycmVjdCk7XG4gICAgICAgICAgICBpZiAoIWlzX2NvcnJlY3QpIHtcbiAgICAgICAgICAgICAgICBjb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAgIGR5bl92YXJzX2V2YWwgJiZcbiAgICAgICAgdHlwZW9mIGR5bl92YXJzX2V2YWwuYWZ0ZXJDaGVja0Fuc3dlcnMgPT09IFwiZnVuY3Rpb25cIlxuICAgICkge1xuICAgICAgICBjb25zdCBbbmFtZWRCbGFua1ZhbHVlcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZF0gPSBwYXJzZUFuc3dlcnMoXG4gICAgICAgICAgICBibGFua05hbWVzRGljdCxcbiAgICAgICAgICAgIGdpdmVuX2FycixcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgZHZlX2JsYW5rcyA9IE9iamVjdC5hc3NpZ24oe30sIGR5bl92YXJzX2V2YWwsIG5hbWVkQmxhbmtWYWx1ZXMpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZHluX3ZhcnNfZXZhbC5hZnRlckNoZWNrQW5zd2VycyhkdmVfYmxhbmtzLCBnaXZlbl9hcnJfY29udmVydGVkKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmFzc2VydChmYWxzZSwgXCJFcnJvciBjYWxsaW5nIGFmdGVyQ2hlY2tBbnN3ZXJzXCIpO1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcGVyY2VudCA9XG4gICAgICAgIGlzQ29ycmVjdEFycmF5LmZpbHRlcihCb29sZWFuKS5sZW5ndGggLyBpc0NvcnJlY3RBcnJheS5sZW5ndGg7XG4gICAgcmV0dXJuIFtkaXNwbGF5RmVlZCwgY29ycmVjdCwgaXNDb3JyZWN0QXJyYXksIHBlcmNlbnRdO1xufVxuXG4vLyBVc2UgdGhlIHByb3ZpZGVkIHBhcnNlcnMgdG8gY29udmVydCBhIHN0dWRlbnQncyBhbnN3ZXJzIChhcyBzdHJpbmdzKSB0byB0aGUgdHlwZSBwcm9kdWNlZCBieSB0aGUgcGFyc2VyIGZvciBlYWNoIGJsYW5rLlxuZnVuY3Rpb24gcGFyc2VBbnN3ZXJzKFxuICAgIC8vIFNlZSBibGFua05hbWVzRGljdF8uXG4gICAgYmxhbmtOYW1lc0RpY3QsXG4gICAgLy8gU2VlIGdpdmVuX2Fycl8uXG4gICAgZ2l2ZW5fYXJyLFxuICAgIC8vIFNlZSBgZHluX3ZhcnNfZXZhbGAuXG4gICAgZHluX3ZhcnNfZXZhbFxuKSB7XG4gICAgLy8gUHJvdmlkZSBhIGRpY3Qgb2Yge2JsYW5rX25hbWUsIGNvbnZlcnRlcl9hbnN3ZXJfdmFsdWV9LlxuICAgIGNvbnN0IG5hbWVkQmxhbmtWYWx1ZXMgPSBnZXROYW1lZEJsYW5rVmFsdWVzKFxuICAgICAgICBnaXZlbl9hcnIsXG4gICAgICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgICAgICBkeW5fdmFyc19ldmFsXG4gICAgKTtcbiAgICAvLyBJbnZlcnQgYmxhbmtOYW1lZERpY3Q6IGNvbXB1dGUgYW4gYXJyYXkgb2YgW2JsYW5rXzBfbmFtZSwgLi4uXS4gTm90ZSB0aGF0IHRoZSBhcnJheSBtYXkgYmUgc3BhcnNlOiBpdCBvbmx5IGNvbnRhaW5zIHZhbHVlcyBmb3IgbmFtZWQgYmxhbmtzLlxuICAgIGNvbnN0IGdpdmVuX2Fycl9uYW1lcyA9IFtdO1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKGJsYW5rTmFtZXNEaWN0KSkge1xuICAgICAgICBnaXZlbl9hcnJfbmFtZXNbdl0gPSBrO1xuICAgIH1cbiAgICAvLyBDb21wdXRlIGFuIGFycmF5IG9mIFtjb252ZXJ0ZWRfYmxhbmtfMF92YWwsIC4uLl0uIE5vdGUgdGhhdCB0aGlzIHJlLWNvbnZlcnRzIGFsbCB0aGUgdmFsdWVzLCByYXRoZXIgdGhhbiAocG9zc2libHkgZGVlcCkgY29weWluZyB0aGUgdmFsdWVzIGZyb20gYWxyZWFkeS1jb252ZXJ0ZWQgbmFtZWQgYmxhbmtzLlxuICAgIGNvbnN0IGdpdmVuX2Fycl9jb252ZXJ0ZWQgPSBnaXZlbl9hcnIubWFwKCh2YWx1ZSwgaW5kZXgpID0+XG4gICAgICAgIHR5cGVfY29udmVydChnaXZlbl9hcnJfbmFtZXNbaW5kZXhdLCB2YWx1ZSwgaW5kZXgsIGR5bl92YXJzX2V2YWwpXG4gICAgKTtcblxuICAgIHJldHVybiBbbmFtZWRCbGFua1ZhbHVlcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZF07XG59XG5cbi8vIFJlbmRlciB0aGUgZmVlZGJhY2sgZm9yIGEgZHluYW1pYyBwcm9ibGVtLlxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckR5bmFtaWNGZWVkYmFjayhcbiAgICAvLyBTZWUgYmxhbmtOYW1lc0RpY3RfLlxuICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgIC8vIFNlZSBnaXZlbl9hcnJfLlxuICAgIGdpdmVuX2FycixcbiAgICAvLyBUaGUgaW5kZXggb2YgdGhpcyBibGFuayBpbiBnaXZlbl9hcnJfLlxuICAgIGluZGV4LFxuICAgIC8vIFRoZSBmZWVkYmFjayBmb3IgdGhpcyBibGFuaywgY29udGFpbmluZyBhIHRlbXBsYXRlIHRvIGJlIHJlbmRlcmVkLlxuICAgIGRpc3BsYXlGZWVkX2ksXG4gICAgLy8gU2VlIGR5bl92YXJzX2V2YWxfLlxuICAgIGR5bl92YXJzX2V2YWxcbikge1xuICAgIC8vIFVzZSB0aGUgYW5zd2VyLCBhbiBhcnJheSBvZiBhbGwgYW5zd2VycywgdGhlIHZhbHVlIG9mIGFsbCBuYW1lZCBibGFua3MsIGFuZCBhbGwgc29sdXRpb24gdmFyaWFibGVzIGZvciB0aGUgdGVtcGxhdGUuXG4gICAgY29uc3QgbmFtZWRCbGFua1ZhbHVlcyA9IGdldE5hbWVkQmxhbmtWYWx1ZXMoXG4gICAgICAgIGdpdmVuX2FycixcbiAgICAgICAgYmxhbmtOYW1lc0RpY3QsXG4gICAgICAgIGR5bl92YXJzX2V2YWxcbiAgICApO1xuICAgIGNvbnN0IHNvbF92YXJzX3BsdXMgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICB7XG4gICAgICAgICAgICBhbnM6IGdpdmVuX2FycltpbmRleF0sXG4gICAgICAgICAgICBhbnNfYXJyYXk6IGdpdmVuX2FycixcbiAgICAgICAgfSxcbiAgICAgICAgZHluX3ZhcnNfZXZhbCxcbiAgICAgICAgbmFtZWRCbGFua1ZhbHVlc1xuICAgICk7XG4gICAgdHJ5IHtcbiAgICAgICAgZGlzcGxheUZlZWRfaSA9IHJlbmRlcl9odG1sKGRpc3BsYXlGZWVkX2ksIHNvbF92YXJzX3BsdXMpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmFzc2VydChmYWxzZSwgYEVycm9yIGV2YWx1YXRpbmcgZmVlZGJhY2sgaW5kZXggJHtpbmRleH0uYCk7XG4gICAgICAgIHRocm93IGVycjtcbiAgICB9XG5cbiAgICByZXR1cm4gZGlzcGxheUZlZWRfaTtcbn1cblxuLy8gVXRpbGl0aWVzXG4vLyAtLS0tLS0tLS1cbi8vIEZvciBlYWNoIG5hbWVkIGJsYW5rLCBnZXQgdGhlIHZhbHVlIGZvciB0aGUgYmxhbms6IHRoZSB2YWx1ZSBvZiBlYWNoIGBgYmxhbmtOYW1lYGAgZ2l2ZXMgdGhlIGluZGV4IG9mIHRoZSBibGFuayBmb3IgdGhhdCBuYW1lLlxuZnVuY3Rpb24gZ2V0TmFtZWRCbGFua1ZhbHVlcyhnaXZlbl9hcnIsIGJsYW5rTmFtZXNEaWN0LCBkeW5fdmFyc19ldmFsKSB7XG4gICAgY29uc3QgbmFtZWRCbGFua1ZhbHVlcyA9IHt9O1xuICAgIGZvciAoY29uc3QgW2JsYW5rX25hbWUsIGJsYW5rX2luZGV4XSBvZiBPYmplY3QuZW50cmllcyhibGFua05hbWVzRGljdCkpIHtcbiAgICAgICAgbmFtZWRCbGFua1ZhbHVlc1tibGFua19uYW1lXSA9IHR5cGVfY29udmVydChcbiAgICAgICAgICAgIGJsYW5rX25hbWUsXG4gICAgICAgICAgICBnaXZlbl9hcnJbYmxhbmtfaW5kZXhdLFxuICAgICAgICAgICAgYmxhbmtfaW5kZXgsXG4gICAgICAgICAgICBkeW5fdmFyc19ldmFsXG4gICAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBuYW1lZEJsYW5rVmFsdWVzO1xufVxuXG4vLyBDb252ZXJ0IGEgdmFsdWUgZ2l2ZW4gaXRzIHR5cGUuXG5mdW5jdGlvbiB0eXBlX2NvbnZlcnQobmFtZSwgdmFsdWUsIGluZGV4LCBkeW5fdmFyc19ldmFsKSB7XG4gICAgLy8gVGhlIGNvbnZlcnRlciBjYW4gYmUgZGVmaW5lZCBieSBpbmRleCwgbmFtZSwgb3IgYnkgYSBzaW5nbGUgdmFsdWUgKHdoaWNoIGFwcGxpZXMgdG8gYWxsIGJsYW5rcykuIElmIG5vdCBwcm92aWRlZCwganVzdCBwYXNzIHRoZSBkYXRhIHRocm91Z2guXG4gICAgY29uc3QgdHlwZXMgPSBkeW5fdmFyc19ldmFsLnR5cGVzIHx8IHBhc3NfdGhyb3VnaDtcbiAgICBjb25zdCBjb252ZXJ0ZXIgPSB0eXBlc1tuYW1lXSB8fCB0eXBlc1tpbmRleF0gfHwgdHlwZXM7XG4gICAgLy8gRVM1IGhhY2s6IGl0IGRvZXNuJ3Qgc3VwcG9ydCBiaW5hcnkgdmFsdWVzLCBhbmQganMycHkgZG9lc24ndCBhbGxvdyBtZSB0byBvdmVycmlkZSB0aGUgYGBOdW1iZXJgYCBjbGFzcy4gU28sIGRlZmluZSB0aGUgd29ya2Fyb3VuZCBjbGFzcyBgYE51bWJlcl9gYCBhbmQgdXNlIGl0IGlmIGF2YWlsYWJsZS5cbiAgICBpZiAoY29udmVydGVyID09PSBOdW1iZXIgJiYgdHlwZW9mIE51bWJlcl8gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgY29udmVydGVyID0gTnVtYmVyXztcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gdGhlIGNvbnZlcnRlZCB0eXBlLiBJZiB0aGUgY29udmVydGVyIHJhaXNlcyBhIFR5cGVFcnJvciwgcmV0dXJuIHRoYXQ7IGl0IHdpbGwgYmUgZGlzcGxheWVkIHRvIHRoZSB1c2VyLCBzaW5jZSB3ZSBhc3N1bWUgdHlwZSBlcnJvcnMgYXJlIGEgd2F5IGZvciB0aGUgcGFyc2VyIHRvIGV4cGxhaW4gdG8gdGhlIHVzZXIgd2h5IHRoZSBwYXJzZSBmYWlsZWQuIEZvciBhbGwgb3RoZXIgZXJyb3JzLCByZS10aHJvdyBpdCBzaW5jZSBzb21ldGhpbmcgd2VudCB3cm9uZy5cbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gY29udmVydGVyKHZhbHVlKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGVycjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gQSBwYXNzLXRocm91Z2ggXCJjb252ZXJ0ZXJcIi5cbmZ1bmN0aW9uIHBhc3NfdGhyb3VnaCh2YWwpIHtcbiAgICByZXR1cm4gdmFsO1xufVxuIiwiLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIHxkb2NuYW1lfCAtLSBmaWxsLWluLXRoZS1ibGFuayBjbGllbnQtc2lkZSBjb2RlXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBKUyBmb3IgdGhlIFJ1bmVzdG9uZSBmaWxsaW50aGVibGFuayBjb21wb25lbnQuIEl0IHdhcyBjcmVhdGVkIEJ5IElzYWlhaCBNYXllcmNoYWsgYW5kIEtpcmJ5IE9sc29uLCA2LzQvMTUgdGhlbiByZXZpc2VkIGJ5IEJyYWQgTWlsbGVyLCAyLzcvMjAuXG4vL1xuLy8gRGF0YSBzdG9yYWdlIG5vdGVzXG4vLyA9PT09PT09PT09PT09PT09PT1cbi8vXG4vLyBJbml0aWFsIHByb2JsZW0gcmVzdG9yZVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEluIHRoZSBjb25zdHJ1Y3RvciwgdGhpcyBjb2RlICh0aGUgY2xpZW50KSByZXN0b3JlcyB0aGUgcHJvYmxlbSBieSBjYWxsaW5nIGBgY2hlY2tTZXJ2ZXJgYC4gVG8gZG8gc28sIGVpdGhlciB0aGUgc2VydmVyIHNlbmRzIG9yIGxvY2FsIHN0b3JhZ2UgaGFzOlxuLy9cbi8vIC0gICAgc2VlZCAodXNlZCBvbmx5IGZvciBkeW5hbWljIHByb2JsZW1zKVxuLy8gLSAgICBhbnN3ZXJcbi8vIC0gICAgZGlzcGxheUZlZWQgKHNlcnZlci1zaWRlIGdyYWRpbmcgb25seTsgb3RoZXJ3aXNlLCB0aGlzIGlzIGdlbmVyYXRlZCBsb2NhbGx5IGJ5IGNsaWVudCBjb2RlKVxuLy8gLSAgICBjb3JyZWN0IChTU0cpXG4vLyAtICAgIGlzQ29ycmVjdEFycmF5IChTU0cpXG4vLyAtICAgIHByb2JsZW1IdG1sIChTU0cgd2l0aCBkeW5hbWljIHByb2JsZW1zIG9ubHkpXG4vL1xuLy8gSWYgYW55IG9mIHRoZSBhbnN3ZXJzIGFyZSBjb3JyZWN0LCB0aGVuIHRoZSBjbGllbnQgc2hvd3MgZmVlZGJhY2suIFRoaXMgaXMgaW1wbGVtZW50ZWQgaW4gcmVzdG9yZUFuc3dlcnNfLlxuLy9cbi8vIEdyYWRpbmdcbi8vIC0tLS0tLS1cbi8vIFdoZW4gdGhlIHVzZXIgcHJlc3NlcyB0aGUgXCJDaGVjayBtZVwiIGJ1dHRvbiwgdGhlIGxvZ0N1cnJlbnRBbnN3ZXJfIGZ1bmN0aW9uOlxuLy9cbi8vIC0gICAgU2F2ZXMgdGhlIGZvbGxvd2luZyB0byBsb2NhbCBzdG9yYWdlOlxuLy9cbi8vICAgICAgLSAgIHNlZWRcbi8vICAgICAgLSAgIGFuc3dlclxuLy8gICAgICAtICAgdGltZXN0YW1wXG4vLyAgICAgIC0gICBwcm9ibGVtSHRtbFxuLy9cbi8vICAgICAgTm90ZSB0aGF0IHRoZXJlJ3Mgbm8gcG9pbnQgaW4gc2F2aW5nIGRpc3BsYXlGZWVkLCBjb3JyZWN0LCBvciBpc0NvcnJlY3RBcnJheSwgc2luY2UgdGhlc2UgdmFsdWVzIGFwcGxpZWQgdG8gdGhlIHByZXZpb3VzIGFuc3dlciwgbm90IHRoZSBuZXcgYW5zd2VyIGp1c3Qgc3VibWl0dGVkLlxuLy9cbi8vIC0gICAgU2VuZHMgdGhlIGZvbGxvd2luZyB0byB0aGUgc2VydmVyOyBzdG9wIGFmdGVyIHRoaXMgZm9yIGNsaWVudC1zaWRlIGdyYWRpbmc6XG4vL1xuLy8gICAgICAtICAgc2VlZCAoaWdub3JlZCBmb3Igc2VydmVyLXNpZGUgZ3JhZGluZylcbi8vICAgICAgLSAgIGFuc3dlclxuLy8gICAgICAtICAgY29ycmVjdCAoaWdub3JlZCBmb3IgU1NHKVxuLy8gICAgICAtICAgcGVyY2VudCAoaWdub3JlZCBmb3IgU1NHKVxuLy9cbi8vIC0gICAgUmVjZWl2ZXMgdGhlIGZvbGxvd2luZyBmcm9tIHRoZSBzZXJ2ZXI6XG4vL1xuLy8gICAgICAtICAgdGltZXN0YW1wXG4vLyAgICAgIC0gICBkaXNwbGF5RmVlZFxuLy8gICAgICAtICAgY29ycmVjdFxuLy8gICAgICAtICAgaXNDb3JyZWN0QXJyYXlcbi8vXG4vLyAtICAgIFNhdmVzIHRoZSBmb2xsb3dpbmcgdG8gbG9jYWwgc3RvcmFnZTpcbi8vXG4vLyAgICAgIC0gICBzZWVkXG4vLyAgICAgIC0gICBhbnN3ZXJcbi8vICAgICAgLSAgIHRpbWVzdGFtcFxuLy8gICAgICAtICAgZGlzcGxheUZlZWQgKFNTRyBvbmx5KVxuLy8gICAgICAtICAgY29ycmVjdCAoU1NHIG9ubHkpXG4vLyAgICAgIC0gICBpc0NvcnJlY3RBcnJheSAoU1NHIG9ubHkpXG4vLyAgICAgIC0gICBwcm9ibGVtSHRtbFxuLy9cbi8vIFJhbmRvbWl6ZVxuLy8gLS0tLS0tLS0tXG4vLyBXaGVuIHRoZSB1c2VyIHByZXNzZXMgdGhlIFwiUmFuZG9taXplXCIgYnV0dG9uICh3aGljaCBpcyBvbmx5IGF2YWlsYWJsZSBmb3IgZHluYW1pYyBwcm9ibGVtcyksIHRoZSByYW5kb21pemVfIGZ1bmN0aW9uOlxuLy9cbi8vIC0gICAgRm9yIHRoZSBjbGllbnQtc2lkZSBjYXNlLCBzZXRzIHRoZSBzZWVkIHRvIGEgbmV3LCByYW5kb20gdmFsdWUuIEZvciB0aGUgc2VydmVyLXNpZGUgY2FzZSwgcmVxdWVzdHMgYSBuZXcgc2VlZCBhbmQgcHJvYmxlbUh0bWwgZnJvbSB0aGUgc2VydmVyLlxuLy8gLSAgICBTZXRzIHRoZSBhbnN3ZXIgdG8gYW4gYXJyYXkgb2YgZW1wdHkgc3RyaW5ncy5cbi8vIC0gICAgU2F2ZXMgdGhlIHVzdWFsIGxvY2FsIGRhdGEuXG5cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanNcIjtcbmltcG9ydCB7XG4gIHJlbmRlckR5bmFtaWNDb250ZW50LFxuICBjaGVja0Fuc3dlcnNDb3JlLFxuICByZW5kZXJEeW5hbWljRmVlZGJhY2ssXG59IGZyb20gXCIuL2ZpdGItdXRpbHMuanNcIjtcbmltcG9ydCBcIi4vZml0Yi1pMThuLmVuLmpzXCI7XG5pbXBvcnQgXCIuL2ZpdGItaTE4bi5wdC1ici5qc1wiO1xuaW1wb3J0IFwiLi4vY3NzL2ZpdGIuY3NzXCI7XG5cbi8vIE9iamVjdCBjb250YWluaW5nIGFsbCBpbnN0YW5jZXMgb2YgRklUQiB0aGF0IGFyZW4ndCBhIGNoaWxkIG9mIGEgdGltZWQgYXNzZXNzbWVudC5cbmV4cG9ydCB2YXIgRklUQkxpc3QgPSB7fTtcblxuLy8gRklUQiBjb25zdHJ1Y3RvclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRklUQiBleHRlbmRzIFJ1bmVzdG9uZUJhc2Uge1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgc3VwZXIob3B0cyk7XG4gICAgdmFyIG9yaWcgPSBvcHRzLm9yaWc7IC8vIGVudGlyZSA8cD4gZWxlbWVudFxuICAgIHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMgPSBvcHRzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzO1xuICAgIHRoaXMub3JpZ0VsZW0gPSBvcmlnO1xuICAgIHRoaXMuZGl2aWQgPSBvcmlnLmlkO1xuICAgIHRoaXMuY29ycmVjdCA9IG51bGw7XG4gICAgLy8gU2VlIGNvbW1lbnRzIGluIGZpdGIucHkgZm9yIHRoZSBmb3JtYXQgb2YgYGBmZWVkYmFja0FycmF5YGAgKHdoaWNoIGlzIGlkZW50aWNhbCBpbiBib3RoIGZpbGVzKS5cbiAgICAvL1xuICAgIC8vIEZpbmQgdGhlIHNjcmlwdCB0YWcgY29udGFpbmluZyBKU09OIGFuZCBwYXJzZSBpdC4gU2VlIGBTTyA8aHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTMyMDQyNy9iZXN0LXByYWN0aWNlLWZvci1lbWJlZGRpbmctYXJiaXRyYXJ5LWpzb24taW4tdGhlLWRvbT5gX18uIElmIHRoaXMgdGFnIGRvZXNuJ3QgZXhpc3QsIHRoZW4gbm8gZmVlZGJhY2sgaXMgYXZhaWxhYmxlOyBzZXJ2ZXItc2lkZSBncmFkaW5nIHdpbGwgYmUgcGVyZm9ybWVkLlxuICAgIC8vXG4gICAgLy8gQSBkZXN0cnVjdHVyaW5nIGFzc2lnbm1lbnQgd291bGQgYmUgcGVyZmVjdCwgYnV0IHRoZXkgZG9uJ3Qgd29yayB3aXRoIGBgdGhpcy5ibGFoYGAgYW5kIGBgd2l0aGBgIHN0YXRlbWVudHMgYXJlbid0IHN1cHBvcnRlZCBpbiBzdHJpY3QgbW9kZS5cbiAgICBjb25zdCBqc29uX2VsZW1lbnQgPSB0aGlzLnNjcmlwdFNlbGVjdG9yKHRoaXMub3JpZ0VsZW0pO1xuICAgIGNvbnN0IGRpY3RfID0gSlNPTi5wYXJzZShqc29uX2VsZW1lbnQuaHRtbCgpKTtcbiAgICBqc29uX2VsZW1lbnQucmVtb3ZlKCk7XG4gICAgdGhpcy5wcm9ibGVtSHRtbCA9IGRpY3RfLnByb2JsZW1IdG1sO1xuICAgIHRoaXMuZHluX3ZhcnMgPSBkaWN0Xy5keW5fdmFycztcbiAgICB0aGlzLmJsYW5rTmFtZXMgPSBkaWN0Xy5ibGFua05hbWVzO1xuICAgIHRoaXMuZmVlZGJhY2tBcnJheSA9IGRpY3RfLmZlZWRiYWNrQXJyYXk7XG5cbiAgICB0aGlzLmNyZWF0ZUZJVEJFbGVtZW50KCk7XG4gICAgdGhpcy5zZXR1cEJsYW5rcygpO1xuICAgIHRoaXMuY2FwdGlvbiA9IFwiRmlsbCBpbiB0aGUgQmxhbmtcIjtcbiAgICB0aGlzLmFkZENhcHRpb24oXCJydW5lc3RvbmVcIik7XG5cbiAgICAvLyBEZWZpbmUgYSBwcm9taXNlIHdoaWNoIGltcG9ydHMgYW55IGxpYnJhcmllcyBuZWVkZWQgYnkgZHluYW1pYyBwcm9ibGVtcy5cbiAgICB0aGlzLmR5bl9pbXBvcnRzID0ge307XG4gICAgbGV0IGltcG9ydHNfcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIGlmIChkaWN0Xy5keW5faW1wb3J0cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBDb2xsZWN0IGFsbCBpbXBvcnQgcHJvbWlzZXMuXG4gICAgICBsZXQgaW1wb3J0X3Byb21pc2VzID0gW107XG4gICAgICBmb3IgKGNvbnN0IGltcG9ydF8gb2YgZGljdF8uZHluX2ltcG9ydHMpIHtcbiAgICAgICAgc3dpdGNoIChpbXBvcnRfKSB7XG4gICAgICAgICAgICBjYXNlIFwiQlRNXCI6IGltcG9ydF9wcm9taXNlcy5wdXNoKGltcG9ydChcIi4vbGlicy9CVE0vc3JjL0JUTV9yb290LmpzXCIpKTsgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyhgVW5rbm93biBkeW5hbWljIGltcG9ydCAke2ltcG9ydF99YCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQ29tYmluZSB0aGUgcmVzdWx0aW5nIG1vZHVsZSBuYW1lc3BhY2Ugb2JqZWN0cyB3aGVuIHRoZXNlIHByb21pc2VzIHJlc29sdmUuXG4gICAgICBpbXBvcnRzX3Byb21pc2UgPSBQcm9taXNlLmFsbChpbXBvcnRfcHJvbWlzZXMpLnRoZW4oKG1vZHVsZV9uYW1lc3BhY2VfYXJyKSA9PlxuICAgICAgICB0aGlzLmR5bl9pbXBvcnRzID0gT2JqZWN0LmFzc2lnbih7fSwgLi4ubW9kdWxlX25hbWVzcGFjZV9hcnIpXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIFJlc29sdmUgdGhlc2UgcHJvbWlzZXMuXG4gICAgaW1wb3J0c19wcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5jaGVja1NlcnZlcihcImZpbGxiXCIsIGZhbHNlKS50aGVuKCgpID0+IHtcbiAgICAgICAgLy8gT25lIG9wdGlvbiBmb3IgYSBkeW5hbWljIHByb2JsZW0gaXMgdG8gcHJvZHVjZSBhIHN0YXRpYyBwcm9ibGVtIGJ5IHByb3ZpZGluZyBhIGZpeGVkIHNlZWQgdmFsdWUuIFRoaXMgaXMgdHlwaWNhbGx5IHVzZWQgd2hlbiB0aGUgZ29hbCBpcyB0byByZW5kZXIgdGhlIHByb2JsZW0gYXMgYW4gaW1hZ2UgZm9yIGluY2x1c2lvbiBpbiBzdGF0aWMgY29udGVudCAoYSBQREYsIGV0Yy4pLiBUbyBzdXBwb3J0IHRoaXMsIGNvbnNpZGVyIHRoZSBmb2xsb3dpbmcgY2FzZXM6XG4gICAgICAgIC8vXG4gICAgICAgIC8vLyBDYXNlICBIYXMgc3RhdGljIHNlZWQ/ICBJcyBhIGNsaWVudC1zaWRlLCBkeW5hbWljIHByb2JsZW0/ICBIYXMgbG9jYWwgc2VlZD8gIFJlc3VsdFxuICAgICAgICAvLy8gMCAgICAgTm8gICAgICAgICAgICAgICAgTm8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWCAgICAgICAgICAgICAgICBObyBhY3Rpb24gbmVlZGVkLlxuICAgICAgICAvLy8gMSAgICAgTm8gICAgICAgICAgICAgICAgWWVzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm8gICAgICAgICAgICAgICB0aGlzLnJhbmRvbWl6ZSgpLlxuICAgICAgICAvLy8gMiAgICAgTm8gICAgICAgICAgICAgICAgWWVzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWWVzICAgICAgICAgICAgICBObyBhY3Rpb24gbmVlZGVkIC0tIHByb2JsZW0gYWxyZWFkeSByZXN0b3JlZCBmcm9tIGxvY2FsIHN0b3JhZ2UuXG4gICAgICAgIC8vLyAzICAgICBZZXMgICAgICAgICAgICAgICBObyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBYICAgICAgICAgICAgICAgIFdhcm5pbmc6IHNlZWQgaWdub3JlZC5cbiAgICAgICAgLy8vIDQgICAgIFllcyAgICAgICAgICAgICAgIFllcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vICAgICAgICAgICAgICAgQXNzaWduIHNlZWQ7IHRoaXMucmVuZGVyRHluYW1pY0NvbnRlbnQoKS5cbiAgICAgICAgLy8vIDUgICAgIFllcyAgICAgICAgICAgICAgIFllcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFllcyAgICAgICAgICAgICAgSWYgc2VlZHMgZGlmZmVyLCBpc3N1ZSB3YXJuaW5nLiBObyBhZGRpdGlvbmFsIGFjdGlvbiBuZWVkZWQgLS0gcHJvYmxlbSBhbHJlYWR5IHJlc3RvcmVkIGZyb20gbG9jYWwgc3RvcmFnZS5cblxuICAgICAgICBjb25zdCBoYXNfc3RhdGljX3NlZWQgPSBkaWN0Xy5zdGF0aWNfc2VlZCAhPT0gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBpc19jbGllbnRfZHluYW1pYyA9IHR5cGVvZiB0aGlzLmR5bl92YXJzID09PSBcInN0cmluZ1wiO1xuICAgICAgICBjb25zdCBoYXNfbG9jYWxfc2VlZCA9IHRoaXMuc2VlZCAhPT0gdW5kZWZpbmVkO1xuXG4gICAgICAgIC8vIENhc2UgMVxuICAgICAgICBpZiAoIWhhc19zdGF0aWNfc2VlZCAmJiBpc19jbGllbnRfZHluYW1pYyAmJiAhaGFzX2xvY2FsX3NlZWQpIHtcbiAgICAgICAgICB0aGlzLnJhbmRvbWl6ZSgpO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgLy8gQ2FzZSAzXG4gICAgICAgIGlmIChoYXNfc3RhdGljX3NlZWQgJiYgIWlzX2NsaWVudF9keW5hbWljKSB7XG4gICAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIFwiV2FybmluZzogdGhlIHByb3ZpZGVkIHN0YXRpYyBzZWVkIHdhcyBpZ25vcmVkLCBiZWNhdXNlIGl0IG9ubHkgYWZmZWN0cyBjbGllbnQtc2lkZSwgZHluYW1pYyBwcm9ibGVtcy5cIik7XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAvLyBDYXNlIDRcbiAgICAgICAgaWYgKGhhc19zdGF0aWNfc2VlZCAmJiBpc19jbGllbnRfZHluYW1pYyAmJiAhaGFzX2xvY2FsX3NlZWQpIHtcbiAgICAgICAgICB0aGlzLnNlZWQgPSBkaWN0Xy5zdGF0aWNfc2VlZDtcbiAgICAgICAgICB0aGlzLnJlbmRlckR5bmFtaWNDb250ZW50KCk7XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAvLyBDYXNlIDVcbiAgICAgICAgaWYgKGhhc19zdGF0aWNfc2VlZCAmJiBpc19jbGllbnRfZHluYW1pYyAmJiBoYXNfbG9jYWxfc2VlZCAmJiB0aGlzLnNlZWQgIT09IGRpY3RfLnN0YXRpY19zZWVkKSB7XG4gICAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIFwiV2FybmluZzogdGhlIHByb3ZpZGVkIHN0YXRpYyBzZWVkIHdhcyBvdmVycmlkZGVuIGJ5IHRoZSBzZWVkIGZvdW5kIGluIGxvY2FsIHN0b3JhZ2UuXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIENhc2VzIDAgYW5kIDJcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgLy8gTm8gYWN0aW9uIG5lZWRlZC5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgUHJpc20gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIFByaXNtLmhpZ2hsaWdodEFsbFVuZGVyKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gRmluZCB0aGUgc2NyaXB0IHRhZyBjb250YWluaW5nIEpTT04gaW4gYSBnaXZlbiByb290IERPTSBub2RlLlxuICBzY3JpcHRTZWxlY3Rvcihyb290X25vZGUpIHtcbiAgICByZXR1cm4gJChyb290X25vZGUpLmZpbmQoYHNjcmlwdFt0eXBlPVwiYXBwbGljYXRpb24vanNvblwiXWApO1xuICB9XG5cbiAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSAgIEZ1bmN0aW9ucyBnZW5lcmF0aW5nIGZpbmFsIEhUTUwgICA9PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gIGNyZWF0ZUZJVEJFbGVtZW50KCkge1xuICAgIHRoaXMucmVuZGVyRklUQklucHV0KCk7XG4gICAgdGhpcy5yZW5kZXJGSVRCQnV0dG9ucygpO1xuICAgIHRoaXMucmVuZGVyRklUQkZlZWRiYWNrRGl2KCk7XG4gICAgLy8gcmVwbGFjZXMgdGhlIGludGVybWVkaWF0ZSBIVE1MIGZvciB0aGlzIGNvbXBvbmVudCB3aXRoIHRoZSByZW5kZXJlZCBIVE1MIG9mIHRoaXMgY29tcG9uZW50XG4gICAgJCh0aGlzLm9yaWdFbGVtKS5yZXBsYWNlV2l0aCh0aGlzLmNvbnRhaW5lckRpdik7XG4gIH1cbiAgcmVuZGVyRklUQklucHV0KCkge1xuICAgIC8vIFRoZSB0ZXh0IFtpbnB1dF0gZWxlbWVudHMgYXJlIGNyZWF0ZWQgYnkgdGhlIHRlbXBsYXRlLlxuICAgIHRoaXMuY29udGFpbmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0aGlzLmNvbnRhaW5lckRpdi5pZCA9IHRoaXMuZGl2aWQ7XG4gICAgLy8gQ3JlYXRlIGFub3RoZXIgY29udGFpbmVyIHdoaWNoIHN0b3JlcyB0aGUgcHJvYmxlbSBkZXNjcmlwdGlvbi5cbiAgICB0aGlzLmRlc2NyaXB0aW9uRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmRlc2NyaXB0aW9uRGl2KTtcbiAgICAvLyBDb3B5IHRoZSBvcmlnaW5hbCBlbGVtZW50cyB0byB0aGUgY29udGFpbmVyIGhvbGRpbmcgd2hhdCB0aGUgdXNlciB3aWxsIHNlZSAoY2xpZW50LXNpZGUgZ3JhZGluZyBvbmx5KS5cbiAgICBpZiAodGhpcy5wcm9ibGVtSHRtbCkge1xuICAgICAgdGhpcy5kZXNjcmlwdGlvbkRpdi5pbm5lckhUTUwgPSB0aGlzLnByb2JsZW1IdG1sO1xuICAgICAgLy8gU2F2ZSBvcmlnaW5hbCBIVE1MICh3aXRoIHRlbXBsYXRlcykgdXNlZCBpbiBkeW5hbWljIHByb2JsZW1zLlxuICAgICAgdGhpcy5kZXNjcmlwdGlvbkRpdi5vcmlnSW5uZXJIVE1MID0gdGhpcy5wcm9ibGVtSHRtbDtcbiAgICB9XG4gIH1cblxuICByZW5kZXJGSVRCQnV0dG9ucygpIHtcbiAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJiclwiKSk7XG5cbiAgICAvLyBcInN1Ym1pdFwiIGJ1dHRvblxuICAgIHRoaXMuc3VibWl0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICB0aGlzLnN1Ym1pdEJ1dHRvbi50ZXh0Q29udGVudCA9ICQuaTE4bihcIm1zZ19maXRiX2NoZWNrX21lXCIpO1xuICAgICQodGhpcy5zdWJtaXRCdXR0b24pLmF0dHIoe1xuICAgICAgY2xhc3M6IFwiYnRuIGJ0bi1zdWNjZXNzXCIsXG4gICAgICBuYW1lOiBcImRvIGFuc3dlclwiLFxuICAgICAgdHlwZTogXCJidXR0b25cIixcbiAgICB9KTtcbiAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJjbGlja1wiLFxuICAgICAgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNoZWNrQ3VycmVudEFuc3dlcigpO1xuICAgICAgICBhd2FpdCB0aGlzLmxvZ0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnN1Ym1pdEJ1dHRvbik7XG5cbiAgICAvLyBcImNvbXBhcmUgbWVcIiBidXR0b25cbiAgICBpZiAodGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgdGhpcy5jb21wYXJlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICQodGhpcy5jb21wYXJlQnV0dG9uKS5hdHRyKHtcbiAgICAgICAgY2xhc3M6IFwiYnRuIGJ0bi1kZWZhdWx0XCIsXG4gICAgICAgIGlkOiB0aGlzLm9yaWdFbGVtLmlkICsgXCJfYmNvbXBcIixcbiAgICAgICAgZGlzYWJsZWQ6IFwiXCIsXG4gICAgICAgIG5hbWU6IFwiY29tcGFyZVwiLFxuICAgICAgfSk7XG4gICAgICB0aGlzLmNvbXBhcmVCdXR0b24udGV4dENvbnRlbnQgPSAkLmkxOG4oXCJtc2dfZml0Yl9jb21wYXJlX21lXCIpO1xuICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMuY29tcGFyZUZJVEJBbnN3ZXJzKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgZmFsc2VcbiAgICAgICk7XG4gICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmNvbXBhcmVCdXR0b24pO1xuICAgIH1cblxuICAgIC8vIFJhbmRvbWl6ZSBidXR0b24gZm9yIGR5bmFtaWMgcHJvYmxlbXMuXG4gICAgaWYgKHRoaXMuZHluX3ZhcnMpIHtcbiAgICAgIHRoaXMucmFuZG9taXplQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICQodGhpcy5yYW5kb21pemVCdXR0b24pLmF0dHIoe1xuICAgICAgICBjbGFzczogXCJidG4gYnRuLWRlZmF1bHRcIixcbiAgICAgICAgaWQ6IHRoaXMub3JpZ0VsZW0uaWQgKyBcIl9iY29tcFwiLFxuICAgICAgICBuYW1lOiBcInJhbmRvbWl6ZVwiLFxuICAgICAgfSk7XG4gICAgICB0aGlzLnJhbmRvbWl6ZUJ1dHRvbi50ZXh0Q29udGVudCA9ICQuaTE4bihcIm1zZ19maXRiX3JhbmRvbWl6ZVwiKTtcbiAgICAgIHRoaXMucmFuZG9taXplQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMucmFuZG9taXplKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgZmFsc2VcbiAgICAgICk7XG4gICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnJhbmRvbWl6ZUJ1dHRvbik7XG4gICAgfVxuXG4gICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSk7XG4gIH1cbiAgcmVuZGVyRklUQkZlZWRiYWNrRGl2KCkge1xuICAgIHRoaXMuZmVlZEJhY2tEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRoaXMuZmVlZEJhY2tEaXYuaWQgPSB0aGlzLmRpdmlkICsgXCJfZmVlZGJhY2tcIjtcbiAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuZmVlZEJhY2tEaXYpO1xuICB9XG5cbiAgY2xlYXJGZWVkYmFja0RpdigpIHtcbiAgICAvLyBTZXR0aW5nIHRoZSBgYG91dGVySFRNTGBgIHJlbW92ZXMgdGhpcyBmcm9tIHRoZSBET00uIFVzZSBhbiBhbHRlcm5hdGl2ZSBwcm9jZXNzIC0tIHJlbW92ZSB0aGUgY2xhc3MgKHdoaWNoIG1ha2VzIGl0IHJlZC9ncmVlbiBiYXNlZCBvbiBncmFkaW5nKSBhbmQgY29udGVudC5cbiAgICB0aGlzLmZlZWRCYWNrRGl2LmlubmVySFRNTCA9IFwiXCI7XG4gICAgdGhpcy5mZWVkQmFja0Rpdi5jbGFzc05hbWUgPSBcIlwiO1xuICB9XG5cbiAgLy8gVXBkYXRlIHRoZSBwcm9ibGVtJ3MgZGVzY3JpcHRpb24gYmFzZWQgb24gZHluYW1pY2FsbHktZ2VuZXJhdGVkIGNvbnRlbnQuXG4gIHJlbmRlckR5bmFtaWNDb250ZW50KCkge1xuICAgIC8vIGBgdGhpcy5keW5fdmFyc2BgIGNhbiBiZSB0cnVlOyBpZiBzbywgZG9uJ3QgcmVuZGVyIGl0LCBzaW5jZSB0aGUgc2VydmVyIGRvZXMgYWxsIHRoZSByZW5kZXJpbmcuXG4gICAgaWYgKHR5cGVvZiB0aGlzLmR5bl92YXJzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBsZXQgaHRtbF9ub2RlcztcbiAgICAgIFtodG1sX25vZGVzLCB0aGlzLmR5bl92YXJzX2V2YWxdID1cbiAgICAgICAgcmVuZGVyRHluYW1pY0NvbnRlbnQoXG4gICAgICAgICAgdGhpcy5zZWVkLFxuICAgICAgICAgIHRoaXMuZHluX3ZhcnMsXG4gICAgICAgICAgdGhpcy5keW5faW1wb3J0cyxcbiAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2Lm9yaWdJbm5lckhUTUwsXG4gICAgICAgICAgdGhpcy5kaXZpZCxcbiAgICAgICAgICB0aGlzLnByZXBhcmVDaGVja0Fuc3dlcnMuYmluZCh0aGlzKSxcbiAgICAgICAgKTtcbiAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYucmVwbGFjZUNoaWxkcmVuKC4uLmh0bWxfbm9kZXMpO1xuXG4gICAgICBpZiAodHlwZW9mICh0aGlzLmR5bl92YXJzX2V2YWwuYWZ0ZXJDb250ZW50UmVuZGVyKSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhpcy5keW5fdmFyc19ldmFsLmFmdGVyQ29udGVudFJlbmRlcih0aGlzLmR5bl92YXJzX2V2YWwpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBjb25zb2xlLmFzc2VydChmYWxzZSwgYEVycm9yIGluIHByb2JsZW0gJHt0aGlzLmRpdmlkfSBpbnZva2luZyBhZnRlckNvbnRlbnRSZW5kZXJgKTtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5kZXNjcmlwdGlvbkRpdik7XG4gICAgICB0aGlzLnNldHVwQmxhbmtzKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0dXBCbGFua3MoKSB7XG4gICAgLy8gRmluZCBhbmQgZm9ybWF0IHRoZSBibGFua3MuIElmIGEgZHluYW1pYyBwcm9ibGVtIGp1c3QgY2hhbmdlZCB0aGUgSFRNTCwgdGhpcyB3aWxsIGZpbmQgdGhlIG5ld2x5LWNyZWF0ZWQgYmxhbmtzLlxuICAgIGNvbnN0IGJhID0gJCh0aGlzLmRlc2NyaXB0aW9uRGl2KS5maW5kKFwiOmlucHV0XCIpO1xuICAgIGJhLmF0dHIoXCJjbGFzc1wiLCBcImZvcm0gZm9ybS1jb250cm9sIHNlbGVjdHdpZHRoYXV0b1wiKTtcbiAgICBiYS5hdHRyKFwiYXJpYS1sYWJlbFwiLCBcImlucHV0IGFyZWFcIik7XG4gICAgdGhpcy5ibGFua0FycmF5ID0gYmEudG9BcnJheSgpO1xuICAgIGZvciAobGV0IGJsYW5rIG9mIHRoaXMuYmxhbmtBcnJheSkge1xuICAgICAgJChibGFuaykuY2hhbmdlKHRoaXMucmVjb3JkQW5zd2VyZWQuYmluZCh0aGlzKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gVGhpcyB0ZWxscyB0aW1lZCBxdWVzdGlvbnMgdGhhdCB0aGUgZml0YiBibGFua3MgcmVjZWl2ZWQgc29tZSBpbnRlcmFjdGlvbi5cbiAgcmVjb3JkQW5zd2VyZWQoKSB7XG4gICAgdGhpcy5pc0Fuc3dlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT0gQ2hlY2tpbmcvbG9hZGluZyBmcm9tIHN0b3JhZ2UgPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAvLyBfYHJlc3RvcmVBbnN3ZXJzYDogdXBkYXRlIHRoZSBwcm9ibGVtIHdpdGggZGF0YSBmcm9tIHRoZSBzZXJ2ZXIgb3IgZnJvbSBsb2NhbCBzdG9yYWdlLlxuICByZXN0b3JlQW5zd2VycyhkYXRhKSB7XG4gICAgLy8gUmVzdG9yZSB0aGUgc2VlZCBmaXJzdCwgc2luY2UgdGhlIGR5bmFtaWMgcmVuZGVyIGNsZWFycyBhbGwgdGhlIGJsYW5rcy5cbiAgICB0aGlzLnNlZWQgPSBkYXRhLnNlZWQ7XG4gICAgdGhpcy5yZW5kZXJEeW5hbWljQ29udGVudCgpO1xuXG4gICAgdmFyIGFycjtcbiAgICAvLyBSZXN0b3JlIGFuc3dlcnMgZnJvbSBzdG9yYWdlIHJldHJpZXZhbCBkb25lIGluIFJ1bmVzdG9uZUJhc2UuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFRoZSBuZXdlciBmb3JtYXQgZW5jb2RlcyBkYXRhIGFzIGEgSlNPTiBvYmplY3QuXG4gICAgICBhcnIgPSBKU09OLnBhcnNlKGRhdGEuYW5zd2VyKTtcbiAgICAgIC8vIFRoZSByZXN1bHQgc2hvdWxkIGJlIGFuIGFycmF5LiBJZiBub3QsIHRyeSBjb21tYSBwYXJzaW5nIGluc3RlYWQuXG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8vIFRoZSBvbGQgZm9ybWF0IGRpZG4ndC5cbiAgICAgIGFyciA9IChkYXRhLmFuc3dlciB8fCBcIlwiKS5zcGxpdChcIixcIik7XG4gICAgfVxuICAgIGxldCBoYXNBbnN3ZXIgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgJCh0aGlzLmJsYW5rQXJyYXlbaV0pLmF0dHIoXCJ2YWx1ZVwiLCBhcnJbaV0pO1xuICAgICAgaWYgKGFycltpXSkge1xuICAgICAgICBoYXNBbnN3ZXIgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBJcyB0aGlzIGNsaWVudC1zaWRlIGdyYWRpbmcsIG9yIHNlcnZlci1zaWRlIGdyYWRpbmc/XG4gICAgaWYgKHRoaXMuZmVlZGJhY2tBcnJheSkge1xuICAgICAgLy8gRm9yIGNsaWVudC1zaWRlIGdyYWRpbmcsIHJlLWdlbmVyYXRlIGZlZWRiYWNrIGlmIHRoZXJlJ3MgYW4gYW5zd2VyLlxuICAgICAgaWYgKGhhc0Fuc3dlcikge1xuICAgICAgICB0aGlzLmNoZWNrQ3VycmVudEFuc3dlcigpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBGb3Igc2VydmVyLXNpZGUgZ3JhZGluZywgdXNlIHRoZSBwcm92aWRlZCBmZWVkYmFjayBmcm9tIHRoZSBzZXJ2ZXIgb3IgbG9jYWwgc3RvcmFnZS5cbiAgICAgIHRoaXMuZGlzcGxheUZlZWQgPSBkYXRhLmRpc3BsYXlGZWVkO1xuICAgICAgdGhpcy5jb3JyZWN0ID0gZGF0YS5jb3JyZWN0O1xuICAgICAgdGhpcy5pc0NvcnJlY3RBcnJheSA9IGRhdGEuaXNDb3JyZWN0QXJyYXk7XG4gICAgICAvLyBPbmx5IHJlbmRlciBpZiBhbGwgdGhlIGRhdGEgaXMgcHJlc2VudDsgbG9jYWwgc3RvcmFnZSBtaWdodCBoYXZlIG9sZCBkYXRhIG1pc3Npbmcgc29tZSBvZiB0aGVzZSBpdGVtcy5cbiAgICAgIGlmIChcbiAgICAgICAgdHlwZW9mIHRoaXMuZGlzcGxheUZlZWQgIT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICAgICAgdHlwZW9mIHRoaXMuY29ycmVjdCAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgICB0eXBlb2YgdGhpcy5pc0NvcnJlY3RBcnJheSAhPT0gXCJ1bmRlZmluZWRcIlxuICAgICAgKSB7XG4gICAgICAgIHRoaXMucmVuZGVyRmVlZGJhY2soKTtcbiAgICAgIH1cbiAgICAgIC8vIEZvciBzZXJ2ZXItc2lkZSBkeW5hbWljIHByb2JsZW1zLCBzaG93IHRoZSByZW5kZXJlZCBwcm9ibGVtIHRleHQuXG4gICAgICB0aGlzLnByb2JsZW1IdG1sID0gZGF0YS5wcm9ibGVtSHRtbDtcbiAgICAgIGlmICh0aGlzLnByb2JsZW1IdG1sKSB7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MID0gdGhpcy5wcm9ibGVtSHRtbDtcbiAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5kZXNjcmlwdGlvbkRpdik7XG4gICAgICAgIHRoaXMuc2V0dXBCbGFua3MoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjaGVja0xvY2FsU3RvcmFnZSgpIHtcbiAgICAvLyBMb2FkcyBwcmV2aW91cyBhbnN3ZXJzIGZyb20gbG9jYWwgc3RvcmFnZSBpZiB0aGV5IGV4aXN0XG4gICAgdmFyIHN0b3JlZERhdGE7XG4gICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBsZW4gPSBsb2NhbFN0b3JhZ2UubGVuZ3RoO1xuICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICB2YXIgZXggPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgIGlmIChleCAhPT0gbnVsbCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHN0b3JlZERhdGEgPSBKU09OLnBhcnNlKGV4KTtcbiAgICAgICAgICB2YXIgYXJyID0gc3RvcmVkRGF0YS5hbnN3ZXI7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIC8vIGVycm9yIHdoaWxlIHBhcnNpbmc7IGxpa2VseSBkdWUgdG8gYmFkIHZhbHVlIHN0b3JlZCBpbiBzdG9yYWdlXG4gICAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZXN0b3JlQW5zd2VycyhzdG9yZWREYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRMb2NhbFN0b3JhZ2UoZGF0YSkge1xuICAgIGxldCBrZXkgPSB0aGlzLmxvY2FsU3RvcmFnZUtleSgpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICB9XG5cbiAgY2hlY2tDdXJyZW50QW5zd2VyKCkge1xuICAgIC8vIFN0YXJ0IG9mIHRoZSBldmFsdWF0aW9uIGNoYWluXG4gICAgdGhpcy5pc0NvcnJlY3RBcnJheSA9IFtdO1xuICAgIHRoaXMuZGlzcGxheUZlZWQgPSBbXTtcbiAgICBjb25zdCBwY2EgPSB0aGlzLnByZXBhcmVDaGVja0Fuc3dlcnMoKTtcblxuICAgIGlmICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICBpZiAoZUJvb2tDb25maWcuZW5hYmxlQ29tcGFyZU1lKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlQ29tcGFyZUJ1dHRvbigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEdyYWRlIGxvY2FsbHkgaWYgd2UgY2FuJ3QgYXNrIHRoZSBzZXJ2ZXIgdG8gZ3JhZGUuXG4gICAgaWYgKHRoaXMuZmVlZGJhY2tBcnJheSkge1xuICAgICAgW1xuICAgICAgICAvLyBBbiBhcnJheSBvZiBIVE1MIGZlZWRiYWNrLlxuICAgICAgICB0aGlzLmRpc3BsYXlGZWVkLFxuICAgICAgICAvLyB0cnVlLCBmYWxzZSwgb3IgbnVsbCAodGhlIHF1ZXN0aW9uIHdhc24ndCBhbnN3ZXJlZCkuXG4gICAgICAgIHRoaXMuY29ycmVjdCxcbiAgICAgICAgLy8gQW4gYXJyYXkgb2YgdHJ1ZSwgZmFsc2UsIG9yIG51bGwgKHRoZSBxdWVzdGlvbiB3YXNuJ3QgYW5zd2VyZWQpLlxuICAgICAgICB0aGlzLmlzQ29ycmVjdEFycmF5LFxuICAgICAgICB0aGlzLnBlcmNlbnRcbiAgICAgIF0gPSBjaGVja0Fuc3dlcnNDb3JlKC4uLnBjYSk7XG4gICAgICBpZiAoIXRoaXMuaXNUaW1lZCkge1xuICAgICAgICB0aGlzLnJlbmRlckZlZWRiYWNrKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gSW5wdXRzOlxuICAvL1xuICAvLyAtIFN0cmluZ3MgZW50ZXJlZCBieSB0aGUgc3R1ZGVudCBpbiBgYHRoaXMuYmxhbmtBcnJheVtpXS52YWx1ZWBgLlxuICAvLyAtIEZlZWRiYWNrIGluIGBgdGhpcy5mZWVkYmFja0FycmF5YGAuXG4gIHByZXBhcmVDaGVja0Fuc3dlcnMoKSB7XG4gICAgdGhpcy5naXZlbl9hcnIgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGkrKylcbiAgICAgIHRoaXMuZ2l2ZW5fYXJyLnB1c2godGhpcy5ibGFua0FycmF5W2ldLnZhbHVlKTtcbiAgICByZXR1cm4gW3RoaXMuYmxhbmtOYW1lcywgdGhpcy5naXZlbl9hcnIsIHRoaXMuZmVlZGJhY2tBcnJheSwgdGhpcy5keW5fdmFyc19ldmFsXTtcbiAgfVxuXG4gIC8vIF9gcmFuZG9taXplYDogVGhpcyBoYW5kbGVzIGEgY2xpY2sgdG8gdGhlIFwiUmFuZG9taXplXCIgYnV0dG9uLlxuICBhc3luYyByYW5kb21pemUoKSB7XG4gICAgLy8gVXNlIHRoZSBjbGllbnQtc2lkZSBjYXNlIG9yIHRoZSBzZXJ2ZXItc2lkZSBjYXNlP1xuICAgIGlmICh0aGlzLmZlZWRiYWNrQXJyYXkpIHtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIGNsaWVudC1zaWRlIGNhc2UuXG4gICAgICAvL1xuICAgICAgdGhpcy5zZWVkID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMiAqKiAzMik7XG4gICAgICB0aGlzLnJlbmRlckR5bmFtaWNDb250ZW50KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIHNlcnZlci1zaWRlIGNhc2UuIFNlbmQgYSByZXF1ZXN0IHRvIHRoZSBgcmVzdWx0cyA8Z2V0QXNzZXNzUmVzdWx0cz5gIGVuZHBvaW50IHdpdGggYGBuZXdfc2VlZGBgIHNldCB0byBUcnVlLlxuICAgICAgY29uc3QgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KFwiL2Fzc2Vzc21lbnQvcmVzdWx0c1wiLCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBkaXZfaWQ6IHRoaXMuZGl2aWQsXG4gICAgICAgICAgY291cnNlOiBlQm9va0NvbmZpZy5jb3Vyc2UsXG4gICAgICAgICAgZXZlbnQ6IFwiZmlsbGJcIixcbiAgICAgICAgICBzaWQ6IHRoaXMuc2lkLFxuICAgICAgICAgIG5ld19zZWVkOiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgICAgaGVhZGVyczogdGhpcy5qc29uSGVhZGVycyxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgYWxlcnQoYEhUVFAgZXJyb3IgZ2V0dGluZyByZXN1bHRzOiAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICBjb25zdCByZXMgPSBkYXRhLmRldGFpbDtcbiAgICAgIHRoaXMuc2VlZCA9IHJlcy5zZWVkO1xuICAgICAgdGhpcy5kZXNjcmlwdGlvbkRpdi5pbm5lckhUTUwgPSByZXMucHJvYmxlbUh0bWw7XG4gICAgICB0aGlzLnF1ZXVlTWF0aEpheCh0aGlzLmRlc2NyaXB0aW9uRGl2KTtcbiAgICAgIHRoaXMuc2V0dXBCbGFua3MoKTtcbiAgICB9XG4gICAgLy8gV2hlbiBnZXR0aW5nIGEgbmV3IHNlZWQsIGNsZWFyIGFsbCB0aGUgb2xkIGFuc3dlcnMgYW5kIGZlZWRiYWNrLlxuICAgIHRoaXMuZ2l2ZW5fYXJyID0gQXJyYXkodGhpcy5ibGFua0FycmF5LmxlbikuZmlsbChcIlwiKTtcbiAgICAkKHRoaXMuYmxhbmtBcnJheSkuYXR0cihcInZhbHVlXCIsIFwiXCIpO1xuICAgIHRoaXMuY2xlYXJGZWVkYmFja0RpdigpO1xuICAgIHRoaXMuc2F2ZUFuc3dlcnNMb2NhbGx5T25seSgpO1xuICB9XG5cbiAgLy8gU2F2ZSB0aGUgYW5zd2VycyBhbmQgYXNzb2NpYXRlZCBkYXRhIGxvY2FsbHk7IGRvbid0IHNhdmUgZmVlZGJhY2sgcHJvdmlkZWQgYnkgdGhlIHNlcnZlciBmb3IgdGhpcyBhbnN3ZXIuIEl0IGFzc3VtZXMgdGhhdCBgYHRoaXMuZ2l2ZW5fYXJyYGAgY29udGFpbnMgdGhlIGN1cnJlbnQgYW5zd2Vycy5cbiAgc2F2ZUFuc3dlcnNMb2NhbGx5T25seSgpIHtcbiAgICB0aGlzLnNldExvY2FsU3RvcmFnZSh7XG4gICAgICAvLyBUaGUgc2VlZCBpcyB1c2VkIGZvciBjbGllbnQtc2lkZSBvcGVyYXRpb24sIGJ1dCBkb2Vzbid0IG1hdHRlciBmb3Igc2VydmVyLXNpZGUuXG4gICAgICBzZWVkOiB0aGlzLnNlZWQsXG4gICAgICBhbnN3ZXI6IEpTT04uc3RyaW5naWZ5KHRoaXMuZ2l2ZW5fYXJyKSxcbiAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKSxcbiAgICAgIC8vIFRoaXMgaXMgb25seSBuZWVkZWQgZm9yIHNlcnZlci1zaWRlIGdyYWRpbmcgd2l0aCBkeW5hbWljIHByb2JsZW1zLlxuICAgICAgcHJvYmxlbUh0bWw6IHRoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gX2Bsb2dDdXJyZW50QW5zd2VyYDogU2F2ZSB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgcHJvYmxlbSB0byBsb2NhbCBzdG9yYWdlIGFuZCB0aGUgc2VydmVyOyBkaXNwbGF5IHNlcnZlciBmZWVkYmFjay5cbiAgYXN5bmMgbG9nQ3VycmVudEFuc3dlcihzaWQpIHtcbiAgICBsZXQgYW5zd2VyID0gSlNPTi5zdHJpbmdpZnkodGhpcy5naXZlbl9hcnIpO1xuICAgIGxldCBmZWVkYmFjayA9IHRydWU7XG4gICAgLy8gU2F2ZSB0aGUgYW5zd2VyIGxvY2FsbHkuXG4gICAgdGhpcy5zYXZlQW5zd2Vyc0xvY2FsbHlPbmx5KCk7XG4gICAgLy8gU2F2ZSB0aGUgYW5zd2VyIHRvIHRoZSBzZXJ2ZXIuXG4gICAgY29uc3QgZGF0YSA9IHtcbiAgICAgIGV2ZW50OiBcImZpbGxiXCIsXG4gICAgICBkaXZfaWQ6IHRoaXMuZGl2aWQsXG4gICAgICBhY3Q6IGFuc3dlciB8fCBcIlwiLFxuICAgICAgc2VlZDogdGhpcy5zZWVkLFxuICAgICAgYW5zd2VyOiBhbnN3ZXIgfHwgXCJcIixcbiAgICAgIGNvcnJlY3Q6IHRoaXMuY29ycmVjdCA/IFwiVFwiIDogXCJGXCIsXG4gICAgICBwZXJjZW50OiB0aGlzLnBlcmNlbnQsXG4gICAgfTtcbiAgICBpZiAodHlwZW9mIHNpZCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgZGF0YS5zaWQgPSBzaWQ7XG4gICAgICBmZWVkYmFjayA9IGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBzZXJ2ZXJfZGF0YSA9IGF3YWl0IHRoaXMubG9nQm9va0V2ZW50KGRhdGEpO1xuICAgIGlmICghZmVlZGJhY2spIHJldHVybjtcbiAgICAvLyBOb24tc2VydmVyIHNpZGUgZ3JhZGVkIHByb2JsZW1zIGFyZSBkb25lIGF0IHRoaXMgcG9pbnQ7IGxpa2V3aXNlLCBzdG9wIGhlcmUgaWYgdGhlIHNlcnZlciBkaWRuJ3QgcmVzcG9uZC5cbiAgICBpZiAodGhpcy5mZWVkYmFja0FycmF5IHx8ICFzZXJ2ZXJfZGF0YSkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIC8vIFRoaXMgaXMgdGhlIHNlcnZlci1zaWRlIGNhc2UuIE9uIHN1Y2Nlc3MsIHVwZGF0ZSB0aGUgZmVlZGJhY2sgZnJvbSB0aGUgc2VydmVyJ3MgZ3JhZGUuXG4gICAgY29uc3QgcmVzID0gc2VydmVyX2RhdGEuZGV0YWlsO1xuICAgIHRoaXMudGltZXN0YW1wID0gcmVzLnRpbWVzdGFtcDtcbiAgICB0aGlzLmRpc3BsYXlGZWVkID0gcmVzLmRpc3BsYXlGZWVkO1xuICAgIHRoaXMuY29ycmVjdCA9IHJlcy5jb3JyZWN0O1xuICAgIHRoaXMuaXNDb3JyZWN0QXJyYXkgPSByZXMuaXNDb3JyZWN0QXJyYXk7XG4gICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2Uoe1xuICAgICAgc2VlZDogdGhpcy5zZWVkLFxuICAgICAgYW5zd2VyOiBhbnN3ZXIsXG4gICAgICB0aW1lc3RhbXA6IHRoaXMudGltZXN0YW1wLFxuICAgICAgcHJvYmxlbUh0bWw6IHRoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MLFxuICAgICAgZGlzcGxheUZlZWQ6IHRoaXMuZGlzcGxheUZlZWQsXG4gICAgICBjb3JyZWN0OiB0aGlzLmNvcnJlY3QsXG4gICAgICBpc0NvcnJlY3RBcnJheTogdGhpcy5pc0NvcnJlY3RBcnJheSxcbiAgICB9KTtcbiAgICB0aGlzLnJlbmRlckZlZWRiYWNrKCk7XG4gICAgcmV0dXJuIHNlcnZlcl9kYXRhO1xuICB9XG5cbiAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT0gRXZhbHVhdGlvbiBvZiBhbnN3ZXIgYW5kID09PVxuICAgID09PSAgICAgZGlzcGxheSBmZWVkYmFjayAgICAgPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgcmVuZGVyRmVlZGJhY2soKSB7XG4gICAgaWYgKHRoaXMuY29ycmVjdCkge1xuICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5hdHRyKFwiY2xhc3NcIiwgXCJhbGVydCBhbGVydC1pbmZvXCIpO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmJsYW5rQXJyYXkubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgJCh0aGlzLmJsYW5rQXJyYXlbal0pLnJlbW92ZUNsYXNzKFwiaW5wdXQtdmFsaWRhdGlvbi1lcnJvclwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuZGlzcGxheUZlZWQgPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5RmVlZCA9IFwiXCI7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGorKykge1xuICAgICAgICBpZiAodGhpcy5pc0NvcnJlY3RBcnJheVtqXSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICQodGhpcy5ibGFua0FycmF5W2pdKS5hZGRDbGFzcyhcImlucHV0LXZhbGlkYXRpb24tZXJyb3JcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJCh0aGlzLmJsYW5rQXJyYXlbal0pLnJlbW92ZUNsYXNzKFwiaW5wdXQtdmFsaWRhdGlvbi1lcnJvclwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5hdHRyKFwiY2xhc3NcIiwgXCJhbGVydCBhbGVydC1kYW5nZXJcIik7XG4gICAgfVxuICAgIHZhciBmZWVkYmFja19odG1sID0gXCI8dWw+XCI7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRpc3BsYXlGZWVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZGYgPSB0aGlzLmRpc3BsYXlGZWVkW2ldO1xuICAgICAgLy8gUmVuZGVyIGFueSBkeW5hbWljIGZlZWRiYWNrIGluIHRoZSBwcm92aWRlZCBmZWVkYmFjaywgZm9yIGNsaWVudC1zaWRlIGdyYWRpbmcgb2YgZHluYW1pYyBwcm9ibGVtcy5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5keW5fdmFycyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBkZiA9IHJlbmRlckR5bmFtaWNGZWVkYmFjayhcbiAgICAgICAgICB0aGlzLmJsYW5rTmFtZXMsXG4gICAgICAgICAgdGhpcy5naXZlbl9hcnIsXG4gICAgICAgICAgaSxcbiAgICAgICAgICBkZixcbiAgICAgICAgICB0aGlzLmR5bl92YXJzX2V2YWxcbiAgICAgICAgKTtcbiAgICAgICAgLy8gQ29udmVydCB0aGUgcmV0dXJuZWQgTm9kZUxpc3QgaW50byBhIHN0cmluZyBvZiBIVE1MLlxuICAgICAgICBkZiA9IGRmID8gZGZbMF0ucGFyZW50RWxlbWVudC5pbm5lckhUTUwgOiBcIk5vIGZlZWRiYWNrIHByb3ZpZGVkXCI7XG4gICAgICB9XG4gICAgICBmZWVkYmFja19odG1sICs9IGA8bGk+JHtkZn08L2xpPmA7XG4gICAgfVxuICAgIGZlZWRiYWNrX2h0bWwgKz0gXCI8L3VsPlwiO1xuICAgIC8vIFJlbW92ZSB0aGUgbGlzdCBpZiBpdCdzIGp1c3Qgb25lIGVsZW1lbnQuXG4gICAgaWYgKHRoaXMuZGlzcGxheUZlZWQubGVuZ3RoID09IDEpIHtcbiAgICAgIGZlZWRiYWNrX2h0bWwgPSBmZWVkYmFja19odG1sLnNsaWNlKFxuICAgICAgICBcIjx1bD48bGk+XCIubGVuZ3RoLFxuICAgICAgICAtXCI8L2xpPjwvdWw+XCIubGVuZ3RoXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLmZlZWRCYWNrRGl2LmlubmVySFRNTCA9IGZlZWRiYWNrX2h0bWw7XG4gICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5mZWVkQmFja0Rpdik7XG4gIH1cblxuICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT0gRnVuY3Rpb25zIGZvciBjb21wYXJlIGJ1dHRvbiA9PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgZW5hYmxlQ29tcGFyZUJ1dHRvbigpIHtcbiAgICB0aGlzLmNvbXBhcmVCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgfVxuICAvLyBfYGNvbXBhcmVGSVRCQW5zd2Vyc2BcbiAgY29tcGFyZUZJVEJBbnN3ZXJzKCkge1xuICAgIHZhciBkYXRhID0ge307XG4gICAgZGF0YS5kaXZfaWQgPSB0aGlzLmRpdmlkO1xuICAgIGRhdGEuY291cnNlID0gZUJvb2tDb25maWcuY291cnNlO1xuICAgIGpRdWVyeS5nZXQoXG4gICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vYXNzZXNzbWVudC9nZXR0b3AxMEFuc3dlcnNgLFxuICAgICAgZGF0YSxcbiAgICAgIHRoaXMuY29tcGFyZUZJVEJcbiAgICApO1xuICB9XG4gIGNvbXBhcmVGSVRCKGRhdGEsIHN0YXR1cywgd2hhdGV2ZXIpIHtcbiAgICB2YXIgYW5zd2VycyA9IGRhdGEuZGV0YWlsLnJlcztcbiAgICB2YXIgbWlzYyA9IGRhdGEuZGV0YWlsLm1pc2NkYXRhO1xuICAgIHZhciBib2R5ID0gXCI8dGFibGU+XCI7XG4gICAgYm9keSArPSBcIjx0cj48dGg+QW5zd2VyPC90aD48dGg+Q291bnQ8L3RoPjwvdHI+XCI7XG4gICAgZm9yICh2YXIgcm93IGluIGFuc3dlcnMpIHtcbiAgICAgIGJvZHkgKz1cbiAgICAgICAgXCI8dHI+PHRkPlwiICtcbiAgICAgICAgYW5zd2Vyc1tyb3ddLmFuc3dlciArXG4gICAgICAgIFwiPC90ZD48dGQ+XCIgK1xuICAgICAgICBhbnN3ZXJzW3Jvd10uY291bnQgK1xuICAgICAgICBcIiB0aW1lczwvdGQ+PC90cj5cIjtcbiAgICB9XG4gICAgYm9keSArPSBcIjwvdGFibGU+XCI7XG4gICAgdmFyIGh0bWwgPVxuICAgICAgXCI8ZGl2IGNsYXNzPSdtb2RhbCBmYWRlJz5cIiArXG4gICAgICBcIiAgICA8ZGl2IGNsYXNzPSdtb2RhbC1kaWFsb2cgY29tcGFyZS1tb2RhbCc+XCIgK1xuICAgICAgXCIgICAgICAgIDxkaXYgY2xhc3M9J21vZGFsLWNvbnRlbnQnPlwiICtcbiAgICAgIFwiICAgICAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtaGVhZGVyJz5cIiArXG4gICAgICBcIiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3M9J2Nsb3NlJyBkYXRhLWRpc21pc3M9J21vZGFsJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+JnRpbWVzOzwvYnV0dG9uPlwiICtcbiAgICAgIFwiICAgICAgICAgICAgICAgIDxoNCBjbGFzcz0nbW9kYWwtdGl0bGUnPlRvcCBBbnN3ZXJzPC9oND5cIiArXG4gICAgICBcIiAgICAgICAgICAgIDwvZGl2PlwiICtcbiAgICAgIFwiICAgICAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtYm9keSc+XCIgK1xuICAgICAgYm9keSArXG4gICAgICBcIiAgICAgICAgICAgIDwvZGl2PlwiICtcbiAgICAgIFwiICAgICAgICA8L2Rpdj5cIiArXG4gICAgICBcIiAgICA8L2Rpdj5cIiArXG4gICAgICBcIjwvZGl2PlwiO1xuICAgIHZhciBlbCA9ICQoaHRtbCk7XG4gICAgZWwubW9kYWwoKTtcbiAgfVxuXG4gIGRpc2FibGVJbnRlcmFjdGlvbigpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5ibGFua0FycmF5W2ldLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09IEZpbmQgdGhlIGN1c3RvbSBIVE1MIHRhZ3MgYW5kID09XG49PSAgIGV4ZWN1dGUgb3VyIGNvZGUgb24gdGhlbSAgICA9PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiQoZG9jdW1lbnQpLm9uKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGZ1bmN0aW9uICgpIHtcbiAgJChcIltkYXRhLWNvbXBvbmVudD1maWxsaW50aGVibGFua11cIikuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICB2YXIgb3B0cyA9IHtcbiAgICAgIG9yaWc6IHRoaXMsXG4gICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMsXG4gICAgfTtcbiAgICBpZiAoJCh0aGlzKS5jbG9zZXN0KFwiW2RhdGEtY29tcG9uZW50PXRpbWVkQXNzZXNzbWVudF1cIikubGVuZ3RoID09IDApIHtcbiAgICAgIC8vIElmIHRoaXMgZWxlbWVudCBleGlzdHMgd2l0aGluIGEgdGltZWQgY29tcG9uZW50LCBkb24ndCByZW5kZXIgaXQgaGVyZVxuICAgICAgdHJ5IHtcbiAgICAgICAgRklUQkxpc3RbdGhpcy5pZF0gPSBuZXcgRklUQihvcHRzKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmFzc2VydChmYWxzZSxcbiAgICAgICAgICBgRXJyb3IgcmVuZGVyaW5nIEZpbGwgaW4gdGhlIEJsYW5rIFByb2JsZW0gJHt0aGlzLmlkfVxuICAgICAgICAgICAgICAgICAgICAgRGV0YWlsczogJHtlcnJ9YFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59KTtcbiIsIi8qLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuYWxlYVBSTkcgMS4xXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmh0dHBzOi8vZ2l0aHViLmNvbS9tYWNtY21lYW5zL2FsZWFQUk5HL2Jsb2IvbWFzdGVyL2FsZWFQUk5HLTEuMS5qc1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5PcmlnaW5hbCB3b3JrIGNvcHlyaWdodCDCqSAyMDEwIEpvaGFubmVzIEJhYWfDuGUsIHVuZGVyIE1JVCBsaWNlbnNlXG5UaGlzIGlzIGEgZGVyaXZhdGl2ZSB3b3JrIGNvcHlyaWdodCAoYykgMjAxNy0yMDIwLCBXLiBNYWNcIiBNY01lYW5zLCB1bmRlciBCU0QgbGljZW5zZS5cblJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dCBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcbjEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbjIuIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cbjMuIE5laXRoZXIgdGhlIG5hbWUgb2YgdGhlIGNvcHlyaWdodCBob2xkZXIgbm9yIHRoZSBuYW1lcyBvZiBpdHMgY29udHJpYnV0b3JzIG1heSBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0cyBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cblRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgSE9MREVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8qL1xuZXhwb3J0IGZ1bmN0aW9uIGFsZWFQUk5HKCkge1xuICAgIHJldHVybiggZnVuY3Rpb24oIGFyZ3MgKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIGNvbnN0IHZlcnNpb24gPSAnYWxlYVBSTkcgMS4xLjAnO1xuXG4gICAgICAgIHZhciBzMFxuICAgICAgICAgICAgLCBzMVxuICAgICAgICAgICAgLCBzMlxuICAgICAgICAgICAgLCBjXG4gICAgICAgICAgICAsIHVpbnRhID0gbmV3IFVpbnQzMkFycmF5KCAzIClcbiAgICAgICAgICAgICwgaW5pdGlhbEFyZ3NcbiAgICAgICAgICAgICwgbWFzaHZlciA9ICcnXG4gICAgICAgIDtcblxuICAgICAgICAvKiBwcml2YXRlOiBpbml0aWFsaXplcyBnZW5lcmF0b3Igd2l0aCBzcGVjaWZpZWQgc2VlZCAqL1xuICAgICAgICBmdW5jdGlvbiBfaW5pdFN0YXRlKCBfaW50ZXJuYWxTZWVkICkge1xuICAgICAgICAgICAgdmFyIG1hc2ggPSBNYXNoKCk7XG5cbiAgICAgICAgICAgIC8vIGludGVybmFsIHN0YXRlIG9mIGdlbmVyYXRvclxuICAgICAgICAgICAgczAgPSBtYXNoKCAnICcgKTtcbiAgICAgICAgICAgIHMxID0gbWFzaCggJyAnICk7XG4gICAgICAgICAgICBzMiA9IG1hc2goICcgJyApO1xuXG4gICAgICAgICAgICBjID0gMTtcblxuICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBfaW50ZXJuYWxTZWVkLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgICAgIHMwIC09IG1hc2goIF9pbnRlcm5hbFNlZWRbIGkgXSApO1xuICAgICAgICAgICAgICAgIGlmKCBzMCA8IDAgKSB7IHMwICs9IDE7IH1cblxuICAgICAgICAgICAgICAgIHMxIC09IG1hc2goIF9pbnRlcm5hbFNlZWRbIGkgXSApO1xuICAgICAgICAgICAgICAgIGlmKCBzMSA8IDAgKSB7IHMxICs9IDE7IH1cblxuICAgICAgICAgICAgICAgIHMyIC09IG1hc2goIF9pbnRlcm5hbFNlZWRbIGkgXSApO1xuICAgICAgICAgICAgICAgIGlmKCBzMiA8IDAgKSB7IHMyICs9IDE7IH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWFzaHZlciA9IG1hc2gudmVyc2lvbjtcblxuICAgICAgICAgICAgbWFzaCA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHJpdmF0ZTogZGVwZW5kZW50IHN0cmluZyBoYXNoIGZ1bmN0aW9uICovXG4gICAgICAgIGZ1bmN0aW9uIE1hc2goKSB7XG4gICAgICAgICAgICB2YXIgbiA9IDQwMjI4NzExOTc7IC8vIDB4ZWZjODI0OWRcblxuICAgICAgICAgICAgdmFyIG1hc2ggPSBmdW5jdGlvbiggZGF0YSApIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS50b1N0cmluZygpO1xuXG4gICAgICAgICAgICAgICAgLy8gY2FjaGUgdGhlIGxlbmd0aFxuICAgICAgICAgICAgICAgIGZvciggdmFyIGkgPSAwLCBsID0gZGF0YS5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgICAgIG4gKz0gZGF0YS5jaGFyQ29kZUF0KCBpICk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGggPSAwLjAyNTE5NjAzMjgyNDE2OTM4ICogbjtcblxuICAgICAgICAgICAgICAgICAgICBuICA9IGggPj4+IDA7XG4gICAgICAgICAgICAgICAgICAgIGggLT0gbjtcbiAgICAgICAgICAgICAgICAgICAgaCAqPSBuO1xuICAgICAgICAgICAgICAgICAgICBuICA9IGggPj4+IDA7XG4gICAgICAgICAgICAgICAgICAgIGggLT0gbjtcbiAgICAgICAgICAgICAgICAgICAgbiArPSBoICogNDI5NDk2NzI5NjsgLy8gMHgxMDAwMDAwMDAgICAgICAyXjMyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAoIG4gPj4+IDAgKSAqIDIuMzI4MzA2NDM2NTM4Njk2M2UtMTA7IC8vIDJeLTMyXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBtYXNoLnZlcnNpb24gPSAnTWFzaCAwLjknO1xuICAgICAgICAgICAgcmV0dXJuIG1hc2g7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvKiBwcml2YXRlOiBjaGVjayBpZiBudW1iZXIgaXMgaW50ZWdlciAqL1xuICAgICAgICBmdW5jdGlvbiBfaXNJbnRlZ2VyKCBfaW50ICkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KCBfaW50LCAxMCApID09PSBfaW50O1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogcmV0dXJuIGEgMzItYml0IGZyYWN0aW9uIGluIHRoZSByYW5nZSBbMCwgMV1cbiAgICAgICAgVGhpcyBpcyB0aGUgbWFpbiBmdW5jdGlvbiByZXR1cm5lZCB3aGVuIGFsZWFQUk5HIGlzIGluc3RhbnRpYXRlZFxuICAgICAgICAqL1xuICAgICAgICB2YXIgcmFuZG9tID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdCA9IDIwOTE2MzkgKiBzMCArIGMgKiAyLjMyODMwNjQzNjUzODY5NjNlLTEwOyAvLyAyXi0zMlxuXG4gICAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICAgICAgczEgPSBzMjtcblxuICAgICAgICAgICAgcmV0dXJuIHMyID0gdCAtICggYyA9IHQgfCAwICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiByZXR1cm4gYSA1My1iaXQgZnJhY3Rpb24gaW4gdGhlIHJhbmdlIFswLCAxXSAqL1xuICAgICAgICByYW5kb20uZnJhY3Q1MyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJhbmRvbSgpICsgKCByYW5kb20oKSAqIDB4MjAwMDAwICB8IDAgKSAqIDEuMTEwMjIzMDI0NjI1MTU2NWUtMTY7IC8vIDJeLTUzXG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiByZXR1cm4gYW4gdW5zaWduZWQgaW50ZWdlciBpbiB0aGUgcmFuZ2UgWzAsIDJeMzJdICovXG4gICAgICAgIHJhbmRvbS5pbnQzMiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJhbmRvbSgpICogMHgxMDAwMDAwMDA7IC8vIDJeMzJcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IGFkdmFuY2UgdGhlIGdlbmVyYXRvciB0aGUgc3BlY2lmaWVkIGFtb3VudCBvZiBjeWNsZXMgKi9cbiAgICAgICAgcmFuZG9tLmN5Y2xlID0gZnVuY3Rpb24oIF9ydW4gKSB7XG4gICAgICAgICAgICBfcnVuID0gdHlwZW9mIF9ydW4gPT09ICd1bmRlZmluZWQnID8gMSA6ICtfcnVuO1xuICAgICAgICAgICAgaWYoIF9ydW4gPCAxICkgeyBfcnVuID0gMTsgfVxuICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBfcnVuOyBpKysgKSB7IHJhbmRvbSgpOyB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiByZXR1cm4gaW5jbHVzaXZlIHJhbmdlICovXG4gICAgICAgIHJhbmRvbS5yYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGxvQm91bmRcbiAgICAgICAgICAgICAgICAsIGhpQm91bmRcbiAgICAgICAgICAgIDtcblxuICAgICAgICAgICAgaWYoIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgKSB7XG4gICAgICAgICAgICAgICAgbG9Cb3VuZCA9IDA7XG4gICAgICAgICAgICAgICAgaGlCb3VuZCA9IGFyZ3VtZW50c1sgMCBdO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvQm91bmQgPSBhcmd1bWVudHNbIDAgXTtcbiAgICAgICAgICAgICAgICBoaUJvdW5kID0gYXJndW1lbnRzWyAxIF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCBhcmd1bWVudHNbIDAgXSA+IGFyZ3VtZW50c1sgMSBdICkge1xuICAgICAgICAgICAgICAgIGxvQm91bmQgPSBhcmd1bWVudHNbIDEgXTtcbiAgICAgICAgICAgICAgICBoaUJvdW5kID0gYXJndW1lbnRzWyAwIF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHJldHVybiBpbnRlZ2VyXG4gICAgICAgICAgICBpZiggX2lzSW50ZWdlciggbG9Cb3VuZCApICYmIF9pc0ludGVnZXIoIGhpQm91bmQgKSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vciggcmFuZG9tKCkgKiAoIGhpQm91bmQgLSBsb0JvdW5kICsgMSApICkgKyBsb0JvdW5kO1xuXG4gICAgICAgICAgICAvLyByZXR1cm4gZmxvYXRcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJhbmRvbSgpICogKCBoaUJvdW5kIC0gbG9Cb3VuZCApICsgbG9Cb3VuZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IGluaXRpYWxpemUgZ2VuZXJhdG9yIHdpdGggdGhlIHNlZWQgdmFsdWVzIHVzZWQgdXBvbiBpbnN0YW50aWF0aW9uICovXG4gICAgICAgIHJhbmRvbS5yZXN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBfaW5pdFN0YXRlKCBpbml0aWFsQXJncyApO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogc2VlZGluZyBmdW5jdGlvbiAqL1xuICAgICAgICByYW5kb20uc2VlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgX2luaXRTdGF0ZSggQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiBzaG93IHRoZSB2ZXJzaW9uIG9mIHRoZSBSTkcgKi9cbiAgICAgICAgcmFuZG9tLnZlcnNpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB2ZXJzaW9uO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogc2hvdyB0aGUgdmVyc2lvbiBvZiB0aGUgUk5HIGFuZCB0aGUgTWFzaCBzdHJpbmcgaGFzaGVyICovXG4gICAgICAgIHJhbmRvbS52ZXJzaW9ucyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZlcnNpb24gKyAnLCAnICsgbWFzaHZlcjtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyB3aGVuIG5vIHNlZWQgaXMgc3BlY2lmaWVkLCBjcmVhdGUgYSByYW5kb20gb25lIGZyb20gV2luZG93cyBDcnlwdG8gKE1vbnRlIENhcmxvIGFwcGxpY2F0aW9uKVxuICAgICAgICBpZiggYXJncy5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICAgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoIHVpbnRhICk7XG4gICAgICAgICAgICAgYXJncyA9IFsgdWludGFbIDAgXSwgdWludGFbIDEgXSwgdWludGFbIDIgXSBdO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIHN0b3JlIHRoZSBzZWVkIHVzZWQgd2hlbiB0aGUgUk5HIHdhcyBpbnN0YW50aWF0ZWQsIGlmIGFueVxuICAgICAgICBpbml0aWFsQXJncyA9IGFyZ3M7XG5cbiAgICAgICAgLy8gaW5pdGlhbGl6ZSB0aGUgUk5HXG4gICAgICAgIF9pbml0U3RhdGUoIGFyZ3MgKTtcblxuICAgICAgICByZXR1cm4gcmFuZG9tO1xuXG4gICAgfSkoIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSApO1xufTsiLCJpbXBvcnQgRklUQiBmcm9tIFwiLi9maXRiLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lZEZJVEIgZXh0ZW5kcyBGSVRCIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB0aGlzLnJlbmRlclRpbWVkSWNvbih0aGlzLmlucHV0RGl2KTtcbiAgICAgICAgdGhpcy5oaWRlQnV0dG9ucygpO1xuICAgICAgICB0aGlzLm5lZWRzUmVpbml0aWFsaXphdGlvbiA9IHRydWU7XG4gICAgfVxuICAgIGhpZGVCdXR0b25zKCkge1xuICAgICAgICAkKHRoaXMuc3VibWl0QnV0dG9uKS5oaWRlKCk7XG4gICAgICAgICQodGhpcy5jb21wYXJlQnV0dG9uKS5oaWRlKCk7XG4gICAgfVxuICAgIHJlbmRlclRpbWVkSWNvbihjb21wb25lbnQpIHtcbiAgICAgICAgLy8gcmVuZGVycyB0aGUgY2xvY2sgaWNvbiBvbiB0aW1lZCBjb21wb25lbnRzLiAgICBUaGUgY29tcG9uZW50IHBhcmFtZXRlclxuICAgICAgICAvLyBpcyB0aGUgZWxlbWVudCB0aGF0IHRoZSBpY29uIHNob3VsZCBiZSBhcHBlbmRlZCB0by5cbiAgICAgICAgdmFyIHRpbWVJY29uRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdmFyIHRpbWVJY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgJCh0aW1lSWNvbikuYXR0cih7XG4gICAgICAgICAgICBzcmM6IFwiLi4vX3N0YXRpYy9jbG9jay5wbmdcIixcbiAgICAgICAgICAgIHN0eWxlOiBcIndpZHRoOjE1cHg7aGVpZ2h0OjE1cHhcIixcbiAgICAgICAgfSk7XG4gICAgICAgIHRpbWVJY29uRGl2LmNsYXNzTmFtZSA9IFwidGltZVRpcFwiO1xuICAgICAgICB0aW1lSWNvbkRpdi50aXRsZSA9IFwiXCI7XG4gICAgICAgIHRpbWVJY29uRGl2LmFwcGVuZENoaWxkKHRpbWVJY29uKTtcbiAgICAgICAgJChjb21wb25lbnQpLnByZXBlbmQodGltZUljb25EaXYpO1xuICAgIH1cbiAgICBjaGVja0NvcnJlY3RUaW1lZCgpIHtcbiAgICAgICAgLy8gUmV0dXJucyBpZiB0aGUgcXVlc3Rpb24gd2FzIGNvcnJlY3QsIGluY29ycmVjdCwgb3Igc2tpcHBlZCAocmV0dXJuIG51bGwgaW4gdGhlIGxhc3QgY2FzZSlcbiAgICAgICAgc3dpdGNoICh0aGlzLmNvcnJlY3QpIHtcbiAgICAgICAgICAgIGNhc2UgdHJ1ZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJUXCI7XG4gICAgICAgICAgICBjYXNlIGZhbHNlOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIkZcIjtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaGlkZUZlZWRiYWNrKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgJCh0aGlzLmJsYW5rQXJyYXlbaV0pLnJlbW92ZUNsYXNzKFwiaW5wdXQtdmFsaWRhdGlvbi1lcnJvclwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG5cbiAgICByZWluaXRpYWxpemVMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuc2V0dXBCbGFua3MoKTtcbiAgICB9XG59XG5cbmlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID0ge307XG59XG53aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkuZmlsbGludGhlYmxhbmsgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIGlmIChvcHRzLnRpbWVkKSB7XG4gICAgICAgIHJldHVybiBuZXcgVGltZWRGSVRCKG9wdHMpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEZJVEIob3B0cyk7XG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9