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
    )(
        // We want v.divid = divid and v.prepareCheckAnswers = prepareCheckAnswers. In contrast, the key/values pairs of dyn_imports should be directly assigned to v, hence the Object.assign.
        Object.assign({ divid, prepareCheckAnswers}, dyn_imports),
        rand,
        // In addition to providing this in v, make it available in the function as well, since most problem authors will write ``foo = new BTM()`` (for example, assuming BTM is in dyn_imports) instead of ``foo = new v.BTM()`` (which is unusual syntax).
        ...Object.values(dyn_imports));

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
        console.assert(false, `Error rendering problem ${divid} text.`);
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
            // For imports known at webpack build, bring these in.
            case "BTM": import_promises.push(__webpack_require__.e(/*! import() */ "vendors-node_modules_btm-expressions_src_BTM_root_js").then(__webpack_require__.bind(__webpack_require__, /*! btm-expressions/src/BTM_root.js */ 33792))); break;
            // Allow for local imports, usually from problems defined outside the Runestone Components.
            default: import_promises.push(import(/* webpackIgnore: true */ import_)); break;
        }
      }

      // Combine the resulting module namespace objects when these promises resolve.
      imports_promise = Promise.all(import_promises).then((module_namespace_arr) =>
        this.dyn_imports = Object.assign({}, ...module_namespace_arr)
      ).catch(err => { throw `Failed dynamic import: ${err}.` });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2ZpdGJfanNfdGltZWRmaXRiX2pzLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7Ozs7O0FDUEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkQ7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRXFDOztBQUVsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLHVCQUF1QjtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsWUFBWSxNQUFNO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEseVdBQXlXO0FBQ3pXO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLCtEQUFROztBQUV6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLElBQUksVUFBVSxXQUFXO0FBQy9DO0FBQ0E7QUFDQSx3QkFBd0IsMkJBQTJCO0FBQ25EO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLG9DQUFvQyxPQUFPO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTix5REFBeUQsT0FBTztBQUNoRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUCxzQ0FBc0MseUJBQXlCO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixzQkFBc0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdCQUFnQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLFlBQVkseUJBQXlCO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQSxrTUFBa007QUFDbE07QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtSkFBbUo7QUFDbko7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLG1DQUFtQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLGlFQUFpRSxNQUFNO0FBQ3ZFO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9GQUFvRjtBQUNwRjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDRCQUE0QjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsZ0RBQUk7QUFDbkIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvY3NzL2ZpdGIuY3NzPzllYmQiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2pzL2ZpdGItaTE4bi5lbi5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvZml0Yi1pMThuLnB0LWJyLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLXV0aWxzLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9saWJzL2FsZWFQUk5HLTEuMS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvdGltZWRmaXRiLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIiQuaTE4bigpLmxvYWQoe1xuICAgIGVuOiB7XG4gICAgICAgIG1zZ19ub19hbnN3ZXI6IFwiTm8gYW5zd2VyIHByb3ZpZGVkLlwiLFxuICAgICAgICBtc2dfZml0Yl9jaGVja19tZTogXCJDaGVjayBtZVwiLFxuICAgICAgICBtc2dfZml0Yl9jb21wYXJlX21lOiBcIkNvbXBhcmUgbWVcIixcbiAgICAgICAgbXNnX2ZpdGJfcmFuZG9taXplOiBcIlJhbmRvbWl6ZVwiXG4gICAgfSxcbn0pO1xuIiwiJC5pMThuKCkubG9hZCh7XG4gICAgXCJwdC1iclwiOiB7XG4gICAgICAgIG1zZ19ub19hbnN3ZXI6IFwiTmVuaHVtYSByZXNwb3N0YSBkYWRhLlwiLFxuICAgICAgICBtc2dfZml0Yl9jaGVja19tZTogXCJWZXJpZmljYXJcIixcbiAgICAgICAgbXNnX2ZpdGJfY29tcGFyZV9tZTogXCJDb21wYXJhclwiXG4gICAgfSxcbn0pO1xuIiwiLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIHxkb2NuYW1lfCAtIGdyYWRpbmctcmVsYXRlZCB1dGlsaXRpZXMgZm9yIEZJVEIgcXVlc3Rpb25zXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gVGhpcyBjb2RlIHJ1bnMgYm90aCBvbiB0aGUgc2VydmVyIChmb3Igc2VydmVyLXNpZGUgZ3JhZGluZykgYW5kIG9uIHRoZSBjbGllbnQuIEl0J3MgcGxhY2VkIGhlcmUgYXMgYSBzZXQgb2YgZnVuY3Rpb25zIHNwZWNpZmljYWxseSBmb3IgdGhpcyBwdXJwb3NlLlxuXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IHsgYWxlYVBSTkcgfSBmcm9tIFwiLi9saWJzL2FsZWFQUk5HLTEuMS5qc1wiO1xuXG4vLyBJbmNsdWRlc1xuLy8gPT09PT09PT1cbi8vIE5vbmUuXG4vL1xuLy9cbi8vIEdsb2JhbHNcbi8vID09PT09PT1cbmZ1bmN0aW9uIHJlbmRlcl9odG1sKGh0bWxfaW4sIGR5bl92YXJzX2V2YWwpIHtcbiAgICAvLyBDaGFuZ2UgdGhlIHJlcGxhY2VtZW50IHRva2VucyBpbiB0aGUgSFRNTCBpbnRvIHRhZ3MsIHNvIHdlIGNhbiByZXBsYWNlIHRoZW0gdXNpbmcgWE1MLiBUaGUgaG9ycmlibGUgcmVnZXggaXM6XG4gICAgLy9cbiAgICAvLyBMb29rIGZvciB0aGUgY2hhcmFjdGVycyBgYFslPWBgICh0aGUgb3BlbmluZyBkZWxpbWl0ZXIpXG4gICAgLy8vIFxcWyU9XG4gICAgLy8gRm9sbG93ZWQgYnkgYW55IGFtb3VudCBvZiB3aGl0ZXNwYWNlLlxuICAgIC8vLyBcXHMqXG4gICAgLy8gU3RhcnQgYSBncm91cCB0aGF0IHdpbGwgY2FwdHVyZSB0aGUgY29udGVudHMgKGV4Y2x1ZGluZyB3aGl0ZXNwYWNlKSBvZiB0aGUgdG9rZW5zLiBGb3IgZXhhbXBsZSwgZ2l2ZW4gYGBbJT0gZm9vKCkgJV1gYCwgdGhlIGNvbnRlbnRzIGlzIGBgZm9vKClgYC5cbiAgICAvLy8gKFxuICAgIC8vIERvbid0IGNhcHR1cmUgdGhlIGNvbnRlbnRzIG9mIHRoaXMgZ3JvdXAsIHNpbmNlIGl0J3Mgb25seSBhIHNpbmdsZSBjaGFyYWN0ZXIuIE1hdGNoIGFueSBjaGFyYWN0ZXIuLi5cbiAgICAvLy8gKFxuICAgIC8vLyA/Oi5cbiAgICAvLy8gLi4udGhhdCBkb2Vzbid0IGVuZCB3aXRoIGBgJV1gYCAodGhlIGNsb3NpbmcgZGVsaW1pdGVyKS5cbiAgICAvLy8gKD8hJV0pXG4gICAgLy8vIClcbiAgICAvLyBNYXRjaCB0aGlzIChhbnl0aGluZyBidXQgdGhlIGNsb3NpbmcgZGVsaW1pdGVyKSBhcyBtdWNoIGFzIHdlIGNhbi5cbiAgICAvLy8gKilcbiAgICAvLyBOZXh0LCBsb29rIGZvciBhbnkgd2hpdGVzcGFjZS5cbiAgICAvLy8gXFxzKlxuICAgIC8vIEZpbmFsbHksIGxvb2sgZm9yIHRoZSBjbG9zaW5nIGRlbGltaXRlciBgYCVdYGAuXG4gICAgLy8vICVcXF1cbiAgICBjb25zdCBodG1sX3JlcGxhY2VkID0gaHRtbF9pbi5yZXBsYWNlQWxsKFxuICAgICAgICAvXFxbJT1cXHMqKCg/Oi4oPyElXSkpKilcXHMqJVxcXS9nLFxuICAgICAgICAvLyBSZXBsYWNlIGl0IHdpdGggYSBgPHNjcmlwdC1ldmFsPmAgdGFnLiBRdW90ZSB0aGUgc3RyaW5nLCB3aGljaCB3aWxsIGF1dG9tYXRpY2FsbHkgZXNjYXBlIGFueSBkb3VibGUgcXVvdGVzLCB1c2luZyBKU09OLlxuICAgICAgICAobWF0Y2gsIGdyb3VwMSkgPT5cbiAgICAgICAgICAgIGA8c2NyaXB0LWV2YWwgZXhwcj0ke0pTT04uc3RyaW5naWZ5KGdyb3VwMSl9Pjwvc2NyaXB0LWV2YWw+YFxuICAgICk7XG4gICAgLy8gR2l2ZW4gSFRNTCwgdHVybiBpdCBpbnRvIGEgRE9NLiBXYWxrIHRoZSBgYDxzY3JpcHQtZXZhbD5gYCB0YWdzLCBwZXJmb3JtaW5nIHRoZSByZXF1ZXN0ZWQgZXZhbHVhdGlvbiBvbiB0aGVtLlxuICAgIC8vXG4gICAgLy8gU2VlIGBET01QYXJzZXIgPGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9ET01QYXJzZXI+YF8uXG4gICAgY29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuICAgIC8vIFNlZSBgRE9NUGFyc2VyLnBhcnNlRnJvbVN0cmluZygpIDxodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRE9NUGFyc2VyL3BhcnNlRnJvbVN0cmluZz5gXy5cbiAgICBjb25zdCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGh0bWxfcmVwbGFjZWQsIFwidGV4dC9odG1sXCIpO1xuICAgIGNvbnN0IHNjcmlwdF9ldmFsX3RhZ3MgPSBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHQtZXZhbFwiKTtcbiAgICB3aGlsZSAoc2NyaXB0X2V2YWxfdGFncy5sZW5ndGgpIHtcbiAgICAgICAgLy8gR2V0IHRoZSBmaXJzdCB0YWcuIEl0IHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBjb2xsZWN0aW9uIGFmdGVyIGl0J3MgcmVwbGFjZWQgd2l0aCBpdHMgdmFsdWUuXG4gICAgICAgIGNvbnN0IHNjcmlwdF9ldmFsX3RhZyA9IHNjcmlwdF9ldmFsX3RhZ3NbMF07XG4gICAgICAgIC8vIFNlZSBpZiB0aGlzIGBgPHNjcmlwdC1ldmFsPmBgIHRhZyBoYXMgYXMgYGBAZXhwcmBgIGF0dHJpYnV0ZS5cbiAgICAgICAgY29uc3QgZXhwciA9IHNjcmlwdF9ldmFsX3RhZy5nZXRBdHRyaWJ1dGUoXCJleHByXCIpO1xuICAgICAgICAvLyBJZiBzbywgZXZhbHVhdGUgaXQuXG4gICAgICAgIGlmIChleHByKSB7XG4gICAgICAgICAgICBjb25zdCBldmFsX3Jlc3VsdCA9IHdpbmRvdy5GdW5jdGlvbihcbiAgICAgICAgICAgICAgICBcInZcIixcbiAgICAgICAgICAgICAgICAuLi5PYmplY3Qua2V5cyhkeW5fdmFyc19ldmFsKSxcbiAgICAgICAgICAgICAgICBgXCJ1c2Ugc3RyaWN0O1wiXFxucmV0dXJuICR7ZXhwcn07YFxuICAgICAgICAgICAgKShkeW5fdmFyc19ldmFsLCAuLi5PYmplY3QudmFsdWVzKGR5bl92YXJzX2V2YWwpKTtcbiAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIHRhZyB3aXRoIHRoZSByZXN1bHRpbmcgdmFsdWUuXG4gICAgICAgICAgICBzY3JpcHRfZXZhbF90YWcucmVwbGFjZVdpdGgoZXZhbF9yZXN1bHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHRoZSBib2R5IGNvbnRlbnRzLiBOb3RlIHRoYXQgdGhlIGBgRE9NUGFyc2VyYGAgY29uc3RydWN0cyBhbiBlbnRpcmUgZG9jdW1lbnQsIG5vdCBqdXN0IHRoZSBkb2N1bWVudCBmcmFnbWVudCB3ZSBwYXNzZWQgaXQuIFRoZXJlZm9yZSwgZXh0cmFjdCB0aGUgZGVzaXJlZCBmcmFnbWVudCBhbmQgcmV0dXJuIHRoYXQuIE5vdGUgdGhhdCB3ZSBuZWVkIHRvIHVzZSBgY2hpbGROb2RlcyA8aHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvY2hpbGROb2Rlcz5gXywgd2hpY2ggaW5jbHVkZXMgbm9uLWVsZW1lbnQgY2hpbGRyZW4gbGlrZSB0ZXh0IGFuZCBjb21tZW50czsgdXNpbmcgYGBjaGlsZHJlbmBgIG9taXRzIHRoZXNlIG5vbi1lbGVtZW50IGNoaWxkcmVuLlxuICAgIHJldHVybiBkb2MuYm9keS5jaGlsZE5vZGVzO1xufVxuXG4vLyBGdW5jdGlvbnNcbi8vID09PT09PT09PVxuLy8gVXBkYXRlIHRoZSBwcm9ibGVtJ3MgZGVzY3JpcHRpb24gYmFzZWQgb24gZHluYW1pY2FsbHktZ2VuZXJhdGVkIGNvbnRlbnQuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyRHluYW1pY0NvbnRlbnQoXG4gICAgc2VlZCxcbiAgICBkeW5fdmFycyxcbiAgICBkeW5faW1wb3J0cyxcbiAgICBodG1sX2luLFxuICAgIGRpdmlkLFxuICAgIHByZXBhcmVDaGVja0Fuc3dlcnNcbikge1xuICAgIC8vIEluaXRpYWxpemUgUk5HIHdpdGggYGBzZWVkYGAuXG4gICAgY29uc3QgcmFuZCA9IGFsZWFQUk5HKHNlZWQpO1xuXG4gICAgLy8gU2VlIGBSQU5EX0ZVTkMgPFJBTkRfRlVOQz5gXywgd2hpY2ggcmVmZXJzIHRvIGBgcmFuZGBgIGFib3ZlLlxuICAgIGNvbnN0IGR5bl92YXJzX2V2YWwgPSB3aW5kb3cuRnVuY3Rpb24oXG4gICAgICAgIFwidlwiLFxuICAgICAgICBcInJhbmRcIixcbiAgICAgICAgLi4uT2JqZWN0LmtleXMoZHluX2ltcG9ydHMpLFxuICAgICAgICBgXCJ1c2Ugc3RyaWN0XCI7XFxuJHtkeW5fdmFyc307XFxucmV0dXJuIHY7YFxuICAgICkoXG4gICAgICAgIC8vIFdlIHdhbnQgdi5kaXZpZCA9IGRpdmlkIGFuZCB2LnByZXBhcmVDaGVja0Fuc3dlcnMgPSBwcmVwYXJlQ2hlY2tBbnN3ZXJzLiBJbiBjb250cmFzdCwgdGhlIGtleS92YWx1ZXMgcGFpcnMgb2YgZHluX2ltcG9ydHMgc2hvdWxkIGJlIGRpcmVjdGx5IGFzc2lnbmVkIHRvIHYsIGhlbmNlIHRoZSBPYmplY3QuYXNzaWduLlxuICAgICAgICBPYmplY3QuYXNzaWduKHsgZGl2aWQsIHByZXBhcmVDaGVja0Fuc3dlcnN9LCBkeW5faW1wb3J0cyksXG4gICAgICAgIHJhbmQsXG4gICAgICAgIC8vIEluIGFkZGl0aW9uIHRvIHByb3ZpZGluZyB0aGlzIGluIHYsIG1ha2UgaXQgYXZhaWxhYmxlIGluIHRoZSBmdW5jdGlvbiBhcyB3ZWxsLCBzaW5jZSBtb3N0IHByb2JsZW0gYXV0aG9ycyB3aWxsIHdyaXRlIGBgZm9vID0gbmV3IEJUTSgpYGAgKGZvciBleGFtcGxlLCBhc3N1bWluZyBCVE0gaXMgaW4gZHluX2ltcG9ydHMpIGluc3RlYWQgb2YgYGBmb28gPSBuZXcgdi5CVE0oKWBgICh3aGljaCBpcyB1bnVzdWFsIHN5bnRheCkuXG4gICAgICAgIC4uLk9iamVjdC52YWx1ZXMoZHluX2ltcG9ydHMpKTtcblxuICAgIGxldCBodG1sX291dDtcbiAgICBpZiAodHlwZW9mIGR5bl92YXJzX2V2YWwuYmVmb3JlQ29udGVudFJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBkeW5fdmFyc19ldmFsLmJlZm9yZUNvbnRlbnRSZW5kZXIoZHluX3ZhcnNfZXZhbCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsXG4gICAgICAgICAgICAgICAgYEVycm9yIGluIHByb2JsZW0gJHtkaXZpZH0gaW52b2tpbmcgYmVmb3JlQ29udGVudFJlbmRlcmBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaHRtbF9vdXQgPSByZW5kZXJfaHRtbChodG1sX2luLCBkeW5fdmFyc19ldmFsKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIGBFcnJvciByZW5kZXJpbmcgcHJvYmxlbSAke2RpdmlkfSB0ZXh0LmApO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgfVxuXG4gICAgLy8gdGhlIGFmdGVyQ29udGVudFJlbmRlciBldmVudCB3aWxsIGJlIGNhbGxlZCBieSB0aGUgY2FsbGVyIG9mIHRoaXMgZnVuY3Rpb24gKGFmdGVyIGl0IHVwZGF0ZWQgdGhlIEhUTUwgYmFzZWQgb24gdGhlIGNvbnRlbnRzIG9mIGh0bWxfb3V0KS5cbiAgICByZXR1cm4gW2h0bWxfb3V0LCBkeW5fdmFyc19ldmFsXTtcbn1cblxuLy8gR2l2ZW4gc3R1ZGVudCBhbnN3ZXJzLCBncmFkZSB0aGVtIGFuZCBwcm92aWRlIGZlZWRiYWNrLlxuLy9cbi8vIE91dHB1dHM6XG4vL1xuLy8gLSAgICBgYGRpc3BsYXlGZWVkYGAgaXMgYW4gYXJyYXkgb2YgSFRNTCBmZWVkYmFjay5cbi8vIC0gICAgYGBpc0NvcnJlY3RBcnJheWBgIGlzIGFuIGFycmF5IG9mIHRydWUsIGZhbHNlLCBvciBudWxsICh0aGUgcXVlc3Rpb24gd2Fzbid0IGFuc3dlcmVkKS5cbi8vIC0gICAgYGBjb3JyZWN0YGAgaXMgdHJ1ZSwgZmFsc2UsIG9yIG51bGwgKHRoZSBxdWVzdGlvbiB3YXNuJ3QgYW5zd2VyZWQpLlxuLy8gLSAgICBgYHBlcmNlbnRgYCBpcyB0aGUgcGVyY2VudGFnZSBvZiBjb3JyZWN0IGFuc3dlcnMgKGZyb20gMCB0byAxLCBub3QgMCB0byAxMDApLlxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrQW5zd2Vyc0NvcmUoXG4gICAgLy8gX2BibGFua05hbWVzRGljdGA6IEFuIGRpY3Qgb2Yge2JsYW5rX25hbWUsIGJsYW5rX2luZGV4fSBzcGVjaWZ5aW5nIHRoZSBuYW1lIGZvciBlYWNoIG5hbWVkIGJsYW5rLlxuICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgIC8vIF9gZ2l2ZW5fYXJyYDogQW4gYXJyYXkgb2Ygc3RyaW5ncyBjb250YWluaW5nIHN0dWRlbnQtcHJvdmlkZWQgYW5zd2VycyBmb3IgZWFjaCBibGFuay5cbiAgICBnaXZlbl9hcnIsXG4gICAgLy8gQSAyLUQgYXJyYXkgb2Ygc3RyaW5ncyBnaXZpbmcgZmVlZGJhY2sgZm9yIGVhY2ggYmxhbmsuXG4gICAgZmVlZGJhY2tBcnJheSxcbiAgICAvLyBfYGR5bl92YXJzX2V2YWxgOiBBIGRpY3QgcHJvZHVjZWQgYnkgZXZhbHVhdGluZyB0aGUgSmF2YVNjcmlwdCBmb3IgYSBkeW5hbWljIGV4ZXJjaXNlLlxuICAgIGR5bl92YXJzX2V2YWxcbikge1xuICAgIGlmIChcbiAgICAgICAgZHluX3ZhcnNfZXZhbCAmJlxuICAgICAgICB0eXBlb2YgZHluX3ZhcnNfZXZhbC5iZWZvcmVDaGVja0Fuc3dlcnMgPT09IFwiZnVuY3Rpb25cIlxuICAgICkge1xuICAgICAgICBjb25zdCBbbmFtZWRCbGFua1ZhbHVlcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZF0gPSBwYXJzZUFuc3dlcnMoXG4gICAgICAgICAgICBibGFua05hbWVzRGljdCxcbiAgICAgICAgICAgIGdpdmVuX2FycixcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgZHZlX2JsYW5rcyA9IE9iamVjdC5hc3NpZ24oe30sIGR5bl92YXJzX2V2YWwsIG5hbWVkQmxhbmtWYWx1ZXMpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZHluX3ZhcnNfZXZhbC5iZWZvcmVDaGVja0Fuc3dlcnMoZHZlX2JsYW5rcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIFwiRXJyb3IgY2FsbGluZyBiZWZvcmVDaGVja0Fuc3dlcnNcIik7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBLZWVwIHRyYWNrIGlmIGFsbCBhbnN3ZXJzIGFyZSBjb3JyZWN0IG9yIG5vdC5cbiAgICBsZXQgY29ycmVjdCA9IHRydWU7XG4gICAgY29uc3QgaXNDb3JyZWN0QXJyYXkgPSBbXTtcbiAgICBjb25zdCBkaXNwbGF5RmVlZCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ2l2ZW5fYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGdpdmVuID0gZ2l2ZW5fYXJyW2ldO1xuICAgICAgICAvLyBJZiB0aGlzIGJsYW5rIGlzIGVtcHR5LCBwcm92aWRlIG5vIGZlZWRiYWNrIGZvciBpdC5cbiAgICAgICAgaWYgKGdpdmVuID09PSBcIlwiKSB7XG4gICAgICAgICAgICBpc0NvcnJlY3RBcnJheS5wdXNoKG51bGwpO1xuICAgICAgICAgICAgLy8gVE9ETzogd2FzICQuaTE4bihcIm1zZ19ub19hbnN3ZXJcIikuXG4gICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKFwiTm8gYW5zd2VyIHByb3ZpZGVkLlwiKTtcbiAgICAgICAgICAgIGNvcnJlY3QgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIExvb2sgdGhyb3VnaCBhbGwgZmVlZGJhY2sgZm9yIHRoaXMgYmxhbmsuIFRoZSBsYXN0IGVsZW1lbnQgaW4gdGhlIGFycmF5IGFsd2F5cyBtYXRjaGVzLiBJZiBubyBmZWVkYmFjayBmb3IgdGhpcyBibGFuayBleGlzdHMsIHVzZSBhbiBlbXB0eSBsaXN0LlxuICAgICAgICAgICAgY29uc3QgZmJsID0gZmVlZGJhY2tBcnJheVtpXSB8fCBbXTtcbiAgICAgICAgICAgIGxldCBqO1xuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGZibC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIC8vIFRoZSBsYXN0IGl0ZW0gb2YgZmVlZGJhY2sgYWx3YXlzIG1hdGNoZXMuXG4gICAgICAgICAgICAgICAgaWYgKGogPT09IGZibC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goZmJsW2pdW1wiZmVlZGJhY2tcIl0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBhIGR5bmFtaWMgc29sdXRpb24uLi5cbiAgICAgICAgICAgICAgICBpZiAoZHluX3ZhcnNfZXZhbCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbbmFtZWRCbGFua1ZhbHVlcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZF0gPVxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VBbnN3ZXJzKGJsYW5rTmFtZXNEaWN0LCBnaXZlbl9hcnIsIGR5bl92YXJzX2V2YWwpO1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSB3YXMgYSBwYXJzZSBlcnJvciwgdGhlbiBpdCBzdHVkZW50J3MgYW5zd2VyIGlzIGluY29ycmVjdC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGdpdmVuX2Fycl9jb252ZXJ0ZWRbaV0gaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goZ2l2ZW5fYXJyX2NvbnZlcnRlZFtpXS5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvdW50IHRoaXMgYXMgd3JvbmcgYnkgbWFraW5nIGogIT0gMCAtLSBzZWUgdGhlIGNvZGUgdGhhdCBydW5zIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBleGVjdXRpbmcgdGhlIGJyZWFrLlxuICAgICAgICAgICAgICAgICAgICAgICAgaiA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYSBmdW5jdGlvbiB0byB3cmFwIHRoZSBleHByZXNzaW9uIHRvIGV2YWx1YXRlLiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRnVuY3Rpb24vRnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgIC8vIFBhc3MgdGhlIGFuc3dlciwgYXJyYXkgb2YgYWxsIGFuc3dlcnMsIHRoZW4gYWxsIGVudHJpZXMgaW4gYGB0aGlzLmR5bl92YXJzX2V2YWxgYCBkaWN0IGFzIGZ1bmN0aW9uIHBhcmFtZXRlcnMuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzX2VxdWFsID0gd2luZG93LkZ1bmN0aW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYW5zX2FycmF5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5PYmplY3Qua2V5cyhkeW5fdmFyc19ldmFsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLk9iamVjdC5rZXlzKG5hbWVkQmxhbmtWYWx1ZXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgYFwidXNlIHN0cmljdDtcIlxcbnJldHVybiAke2ZibFtqXVtcInNvbHV0aW9uX2NvZGVcIl19O2BcbiAgICAgICAgICAgICAgICAgICAgKShcbiAgICAgICAgICAgICAgICAgICAgICAgIGdpdmVuX2Fycl9jb252ZXJ0ZWRbaV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBnaXZlbl9hcnJfY29udmVydGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uT2JqZWN0LnZhbHVlcyhkeW5fdmFyc19ldmFsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLk9iamVjdC52YWx1ZXMobmFtZWRCbGFua1ZhbHVlcylcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgc3R1ZGVudCdzIGFuc3dlciBpcyBlcXVhbCB0byB0aGlzIGl0ZW0sIHRoZW4gYXBwZW5kIHRoaXMgaXRlbSdzIGZlZWRiYWNrLlxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNfZXF1YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGlzX2VxdWFsID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gaXNfZXF1YWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBmYmxbal1bXCJmZWVkYmFja1wiXVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBhIHJlZ2V4cC4uLlxuICAgICAgICAgICAgICAgICAgICBpZiAoXCJyZWdleFwiIGluIGZibFtqXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0dCA9IFJlZ0V4cChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYmxbal1bXCJyZWdleFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYmxbal1bXCJyZWdleEZsYWdzXCJdXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhdHQudGVzdChnaXZlbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKGZibFtqXVtcImZlZWRiYWNrXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBudW1iZXIuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChcIm51bWJlclwiIGluIGZibFtqXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBbbWluLCBtYXhdID0gZmJsW2pdW1wibnVtYmVyXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29udmVydCB0aGUgZ2l2ZW4gc3RyaW5nIHRvIGEgbnVtYmVyLiBXaGlsZSB0aGVyZSBhcmUgYGxvdHMgb2Ygd2F5cyA8aHR0cHM6Ly9jb2RlcndhbGwuY29tL3AvNXRsaG13L2NvbnZlcnRpbmctc3RyaW5ncy10by1udW1iZXItaW4tamF2YXNjcmlwdC1waXRmYWxscz5gXyB0byBkbyB0aGlzOyB0aGlzIHZlcnNpb24gc3VwcG9ydHMgb3RoZXIgYmFzZXMgKGhleC9iaW5hcnkvb2N0YWwpIGFzIHdlbGwgYXMgZmxvYXRzLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0dWFsID0gK2dpdmVuO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdHVhbCA+PSBtaW4gJiYgYWN0dWFsIDw9IG1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goZmJsW2pdW1wiZmVlZGJhY2tcIl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUaGUgYW5zd2VyIGlzIGNvcnJlY3QgaWYgaXQgbWF0Y2hlZCB0aGUgZmlyc3QgZWxlbWVudCBpbiB0aGUgYXJyYXkuIEEgc3BlY2lhbCBjYXNlOiBpZiBvbmx5IG9uZSBhbnN3ZXIgaXMgcHJvdmlkZWQsIGNvdW50IGl0IHdyb25nOyB0aGlzIGlzIGEgbWlzZm9ybWVkIHByb2JsZW0uXG4gICAgICAgICAgICBjb25zdCBpc19jb3JyZWN0ID0gaiA9PT0gMCAmJiBmYmwubGVuZ3RoID4gMTtcbiAgICAgICAgICAgIGlzQ29ycmVjdEFycmF5LnB1c2goaXNfY29ycmVjdCk7XG4gICAgICAgICAgICBpZiAoIWlzX2NvcnJlY3QpIHtcbiAgICAgICAgICAgICAgICBjb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAgIGR5bl92YXJzX2V2YWwgJiZcbiAgICAgICAgdHlwZW9mIGR5bl92YXJzX2V2YWwuYWZ0ZXJDaGVja0Fuc3dlcnMgPT09IFwiZnVuY3Rpb25cIlxuICAgICkge1xuICAgICAgICBjb25zdCBbbmFtZWRCbGFua1ZhbHVlcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZF0gPSBwYXJzZUFuc3dlcnMoXG4gICAgICAgICAgICBibGFua05hbWVzRGljdCxcbiAgICAgICAgICAgIGdpdmVuX2FycixcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgZHZlX2JsYW5rcyA9IE9iamVjdC5hc3NpZ24oe30sIGR5bl92YXJzX2V2YWwsIG5hbWVkQmxhbmtWYWx1ZXMpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZHluX3ZhcnNfZXZhbC5hZnRlckNoZWNrQW5zd2VycyhkdmVfYmxhbmtzLCBnaXZlbl9hcnJfY29udmVydGVkKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmFzc2VydChmYWxzZSwgXCJFcnJvciBjYWxsaW5nIGFmdGVyQ2hlY2tBbnN3ZXJzXCIpO1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcGVyY2VudCA9XG4gICAgICAgIGlzQ29ycmVjdEFycmF5LmZpbHRlcihCb29sZWFuKS5sZW5ndGggLyBpc0NvcnJlY3RBcnJheS5sZW5ndGg7XG4gICAgcmV0dXJuIFtkaXNwbGF5RmVlZCwgY29ycmVjdCwgaXNDb3JyZWN0QXJyYXksIHBlcmNlbnRdO1xufVxuXG4vLyBVc2UgdGhlIHByb3ZpZGVkIHBhcnNlcnMgdG8gY29udmVydCBhIHN0dWRlbnQncyBhbnN3ZXJzIChhcyBzdHJpbmdzKSB0byB0aGUgdHlwZSBwcm9kdWNlZCBieSB0aGUgcGFyc2VyIGZvciBlYWNoIGJsYW5rLlxuZnVuY3Rpb24gcGFyc2VBbnN3ZXJzKFxuICAgIC8vIFNlZSBibGFua05hbWVzRGljdF8uXG4gICAgYmxhbmtOYW1lc0RpY3QsXG4gICAgLy8gU2VlIGdpdmVuX2Fycl8uXG4gICAgZ2l2ZW5fYXJyLFxuICAgIC8vIFNlZSBgZHluX3ZhcnNfZXZhbGAuXG4gICAgZHluX3ZhcnNfZXZhbFxuKSB7XG4gICAgLy8gUHJvdmlkZSBhIGRpY3Qgb2Yge2JsYW5rX25hbWUsIGNvbnZlcnRlcl9hbnN3ZXJfdmFsdWV9LlxuICAgIGNvbnN0IG5hbWVkQmxhbmtWYWx1ZXMgPSBnZXROYW1lZEJsYW5rVmFsdWVzKFxuICAgICAgICBnaXZlbl9hcnIsXG4gICAgICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgICAgICBkeW5fdmFyc19ldmFsXG4gICAgKTtcbiAgICAvLyBJbnZlcnQgYmxhbmtOYW1lZERpY3Q6IGNvbXB1dGUgYW4gYXJyYXkgb2YgW2JsYW5rXzBfbmFtZSwgLi4uXS4gTm90ZSB0aGF0IHRoZSBhcnJheSBtYXkgYmUgc3BhcnNlOiBpdCBvbmx5IGNvbnRhaW5zIHZhbHVlcyBmb3IgbmFtZWQgYmxhbmtzLlxuICAgIGNvbnN0IGdpdmVuX2Fycl9uYW1lcyA9IFtdO1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKGJsYW5rTmFtZXNEaWN0KSkge1xuICAgICAgICBnaXZlbl9hcnJfbmFtZXNbdl0gPSBrO1xuICAgIH1cbiAgICAvLyBDb21wdXRlIGFuIGFycmF5IG9mIFtjb252ZXJ0ZWRfYmxhbmtfMF92YWwsIC4uLl0uIE5vdGUgdGhhdCB0aGlzIHJlLWNvbnZlcnRzIGFsbCB0aGUgdmFsdWVzLCByYXRoZXIgdGhhbiAocG9zc2libHkgZGVlcCkgY29weWluZyB0aGUgdmFsdWVzIGZyb20gYWxyZWFkeS1jb252ZXJ0ZWQgbmFtZWQgYmxhbmtzLlxuICAgIGNvbnN0IGdpdmVuX2Fycl9jb252ZXJ0ZWQgPSBnaXZlbl9hcnIubWFwKCh2YWx1ZSwgaW5kZXgpID0+XG4gICAgICAgIHR5cGVfY29udmVydChnaXZlbl9hcnJfbmFtZXNbaW5kZXhdLCB2YWx1ZSwgaW5kZXgsIGR5bl92YXJzX2V2YWwpXG4gICAgKTtcblxuICAgIHJldHVybiBbbmFtZWRCbGFua1ZhbHVlcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZF07XG59XG5cbi8vIFJlbmRlciB0aGUgZmVlZGJhY2sgZm9yIGEgZHluYW1pYyBwcm9ibGVtLlxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckR5bmFtaWNGZWVkYmFjayhcbiAgICAvLyBTZWUgYmxhbmtOYW1lc0RpY3RfLlxuICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgIC8vIFNlZSBnaXZlbl9hcnJfLlxuICAgIGdpdmVuX2FycixcbiAgICAvLyBUaGUgaW5kZXggb2YgdGhpcyBibGFuayBpbiBnaXZlbl9hcnJfLlxuICAgIGluZGV4LFxuICAgIC8vIFRoZSBmZWVkYmFjayBmb3IgdGhpcyBibGFuaywgY29udGFpbmluZyBhIHRlbXBsYXRlIHRvIGJlIHJlbmRlcmVkLlxuICAgIGRpc3BsYXlGZWVkX2ksXG4gICAgLy8gU2VlIGR5bl92YXJzX2V2YWxfLlxuICAgIGR5bl92YXJzX2V2YWxcbikge1xuICAgIC8vIFVzZSB0aGUgYW5zd2VyLCBhbiBhcnJheSBvZiBhbGwgYW5zd2VycywgdGhlIHZhbHVlIG9mIGFsbCBuYW1lZCBibGFua3MsIGFuZCBhbGwgc29sdXRpb24gdmFyaWFibGVzIGZvciB0aGUgdGVtcGxhdGUuXG4gICAgY29uc3QgbmFtZWRCbGFua1ZhbHVlcyA9IGdldE5hbWVkQmxhbmtWYWx1ZXMoXG4gICAgICAgIGdpdmVuX2FycixcbiAgICAgICAgYmxhbmtOYW1lc0RpY3QsXG4gICAgICAgIGR5bl92YXJzX2V2YWxcbiAgICApO1xuICAgIGNvbnN0IHNvbF92YXJzX3BsdXMgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICB7XG4gICAgICAgICAgICBhbnM6IGdpdmVuX2FycltpbmRleF0sXG4gICAgICAgICAgICBhbnNfYXJyYXk6IGdpdmVuX2FycixcbiAgICAgICAgfSxcbiAgICAgICAgZHluX3ZhcnNfZXZhbCxcbiAgICAgICAgbmFtZWRCbGFua1ZhbHVlc1xuICAgICk7XG4gICAgdHJ5IHtcbiAgICAgICAgZGlzcGxheUZlZWRfaSA9IHJlbmRlcl9odG1sKGRpc3BsYXlGZWVkX2ksIHNvbF92YXJzX3BsdXMpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmFzc2VydChmYWxzZSwgYEVycm9yIGV2YWx1YXRpbmcgZmVlZGJhY2sgaW5kZXggJHtpbmRleH0uYCk7XG4gICAgICAgIHRocm93IGVycjtcbiAgICB9XG5cbiAgICByZXR1cm4gZGlzcGxheUZlZWRfaTtcbn1cblxuLy8gVXRpbGl0aWVzXG4vLyAtLS0tLS0tLS1cbi8vIEZvciBlYWNoIG5hbWVkIGJsYW5rLCBnZXQgdGhlIHZhbHVlIGZvciB0aGUgYmxhbms6IHRoZSB2YWx1ZSBvZiBlYWNoIGBgYmxhbmtOYW1lYGAgZ2l2ZXMgdGhlIGluZGV4IG9mIHRoZSBibGFuayBmb3IgdGhhdCBuYW1lLlxuZnVuY3Rpb24gZ2V0TmFtZWRCbGFua1ZhbHVlcyhnaXZlbl9hcnIsIGJsYW5rTmFtZXNEaWN0LCBkeW5fdmFyc19ldmFsKSB7XG4gICAgY29uc3QgbmFtZWRCbGFua1ZhbHVlcyA9IHt9O1xuICAgIGZvciAoY29uc3QgW2JsYW5rX25hbWUsIGJsYW5rX2luZGV4XSBvZiBPYmplY3QuZW50cmllcyhibGFua05hbWVzRGljdCkpIHtcbiAgICAgICAgbmFtZWRCbGFua1ZhbHVlc1tibGFua19uYW1lXSA9IHR5cGVfY29udmVydChcbiAgICAgICAgICAgIGJsYW5rX25hbWUsXG4gICAgICAgICAgICBnaXZlbl9hcnJbYmxhbmtfaW5kZXhdLFxuICAgICAgICAgICAgYmxhbmtfaW5kZXgsXG4gICAgICAgICAgICBkeW5fdmFyc19ldmFsXG4gICAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBuYW1lZEJsYW5rVmFsdWVzO1xufVxuXG4vLyBDb252ZXJ0IGEgdmFsdWUgZ2l2ZW4gaXRzIHR5cGUuXG5mdW5jdGlvbiB0eXBlX2NvbnZlcnQobmFtZSwgdmFsdWUsIGluZGV4LCBkeW5fdmFyc19ldmFsKSB7XG4gICAgLy8gVGhlIGNvbnZlcnRlciBjYW4gYmUgZGVmaW5lZCBieSBpbmRleCwgbmFtZSwgb3IgYnkgYSBzaW5nbGUgdmFsdWUgKHdoaWNoIGFwcGxpZXMgdG8gYWxsIGJsYW5rcykuIElmIG5vdCBwcm92aWRlZCwganVzdCBwYXNzIHRoZSBkYXRhIHRocm91Z2guXG4gICAgY29uc3QgdHlwZXMgPSBkeW5fdmFyc19ldmFsLnR5cGVzIHx8IHBhc3NfdGhyb3VnaDtcbiAgICBjb25zdCBjb252ZXJ0ZXIgPSB0eXBlc1tuYW1lXSB8fCB0eXBlc1tpbmRleF0gfHwgdHlwZXM7XG4gICAgLy8gRVM1IGhhY2s6IGl0IGRvZXNuJ3Qgc3VwcG9ydCBiaW5hcnkgdmFsdWVzLCBhbmQganMycHkgZG9lc24ndCBhbGxvdyBtZSB0byBvdmVycmlkZSB0aGUgYGBOdW1iZXJgYCBjbGFzcy4gU28sIGRlZmluZSB0aGUgd29ya2Fyb3VuZCBjbGFzcyBgYE51bWJlcl9gYCBhbmQgdXNlIGl0IGlmIGF2YWlsYWJsZS5cbiAgICBpZiAoY29udmVydGVyID09PSBOdW1iZXIgJiYgdHlwZW9mIE51bWJlcl8gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgY29udmVydGVyID0gTnVtYmVyXztcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gdGhlIGNvbnZlcnRlZCB0eXBlLiBJZiB0aGUgY29udmVydGVyIHJhaXNlcyBhIFR5cGVFcnJvciwgcmV0dXJuIHRoYXQ7IGl0IHdpbGwgYmUgZGlzcGxheWVkIHRvIHRoZSB1c2VyLCBzaW5jZSB3ZSBhc3N1bWUgdHlwZSBlcnJvcnMgYXJlIGEgd2F5IGZvciB0aGUgcGFyc2VyIHRvIGV4cGxhaW4gdG8gdGhlIHVzZXIgd2h5IHRoZSBwYXJzZSBmYWlsZWQuIEZvciBhbGwgb3RoZXIgZXJyb3JzLCByZS10aHJvdyBpdCBzaW5jZSBzb21ldGhpbmcgd2VudCB3cm9uZy5cbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gY29udmVydGVyKHZhbHVlKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGVycjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gQSBwYXNzLXRocm91Z2ggXCJjb252ZXJ0ZXJcIi5cbmZ1bmN0aW9uIHBhc3NfdGhyb3VnaCh2YWwpIHtcbiAgICByZXR1cm4gdmFsO1xufVxuIiwiLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIHxkb2NuYW1lfCAtLSBmaWxsLWluLXRoZS1ibGFuayBjbGllbnQtc2lkZSBjb2RlXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBKUyBmb3IgdGhlIFJ1bmVzdG9uZSBmaWxsaW50aGVibGFuayBjb21wb25lbnQuIEl0IHdhcyBjcmVhdGVkIEJ5IElzYWlhaCBNYXllcmNoYWsgYW5kIEtpcmJ5IE9sc29uLCA2LzQvMTUgdGhlbiByZXZpc2VkIGJ5IEJyYWQgTWlsbGVyLCAyLzcvMjAuXG4vL1xuLy8gRGF0YSBzdG9yYWdlIG5vdGVzXG4vLyA9PT09PT09PT09PT09PT09PT1cbi8vXG4vLyBJbml0aWFsIHByb2JsZW0gcmVzdG9yZVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEluIHRoZSBjb25zdHJ1Y3RvciwgdGhpcyBjb2RlICh0aGUgY2xpZW50KSByZXN0b3JlcyB0aGUgcHJvYmxlbSBieSBjYWxsaW5nIGBgY2hlY2tTZXJ2ZXJgYC4gVG8gZG8gc28sIGVpdGhlciB0aGUgc2VydmVyIHNlbmRzIG9yIGxvY2FsIHN0b3JhZ2UgaGFzOlxuLy9cbi8vIC0gICAgc2VlZCAodXNlZCBvbmx5IGZvciBkeW5hbWljIHByb2JsZW1zKVxuLy8gLSAgICBhbnN3ZXJcbi8vIC0gICAgZGlzcGxheUZlZWQgKHNlcnZlci1zaWRlIGdyYWRpbmcgb25seTsgb3RoZXJ3aXNlLCB0aGlzIGlzIGdlbmVyYXRlZCBsb2NhbGx5IGJ5IGNsaWVudCBjb2RlKVxuLy8gLSAgICBjb3JyZWN0IChTU0cpXG4vLyAtICAgIGlzQ29ycmVjdEFycmF5IChTU0cpXG4vLyAtICAgIHByb2JsZW1IdG1sIChTU0cgd2l0aCBkeW5hbWljIHByb2JsZW1zIG9ubHkpXG4vL1xuLy8gSWYgYW55IG9mIHRoZSBhbnN3ZXJzIGFyZSBjb3JyZWN0LCB0aGVuIHRoZSBjbGllbnQgc2hvd3MgZmVlZGJhY2suIFRoaXMgaXMgaW1wbGVtZW50ZWQgaW4gcmVzdG9yZUFuc3dlcnNfLlxuLy9cbi8vIEdyYWRpbmdcbi8vIC0tLS0tLS1cbi8vIFdoZW4gdGhlIHVzZXIgcHJlc3NlcyB0aGUgXCJDaGVjayBtZVwiIGJ1dHRvbiwgdGhlIGxvZ0N1cnJlbnRBbnN3ZXJfIGZ1bmN0aW9uOlxuLy9cbi8vIC0gICAgU2F2ZXMgdGhlIGZvbGxvd2luZyB0byBsb2NhbCBzdG9yYWdlOlxuLy9cbi8vICAgICAgLSAgIHNlZWRcbi8vICAgICAgLSAgIGFuc3dlclxuLy8gICAgICAtICAgdGltZXN0YW1wXG4vLyAgICAgIC0gICBwcm9ibGVtSHRtbFxuLy9cbi8vICAgICAgTm90ZSB0aGF0IHRoZXJlJ3Mgbm8gcG9pbnQgaW4gc2F2aW5nIGRpc3BsYXlGZWVkLCBjb3JyZWN0LCBvciBpc0NvcnJlY3RBcnJheSwgc2luY2UgdGhlc2UgdmFsdWVzIGFwcGxpZWQgdG8gdGhlIHByZXZpb3VzIGFuc3dlciwgbm90IHRoZSBuZXcgYW5zd2VyIGp1c3Qgc3VibWl0dGVkLlxuLy9cbi8vIC0gICAgU2VuZHMgdGhlIGZvbGxvd2luZyB0byB0aGUgc2VydmVyOyBzdG9wIGFmdGVyIHRoaXMgZm9yIGNsaWVudC1zaWRlIGdyYWRpbmc6XG4vL1xuLy8gICAgICAtICAgc2VlZCAoaWdub3JlZCBmb3Igc2VydmVyLXNpZGUgZ3JhZGluZylcbi8vICAgICAgLSAgIGFuc3dlclxuLy8gICAgICAtICAgY29ycmVjdCAoaWdub3JlZCBmb3IgU1NHKVxuLy8gICAgICAtICAgcGVyY2VudCAoaWdub3JlZCBmb3IgU1NHKVxuLy9cbi8vIC0gICAgUmVjZWl2ZXMgdGhlIGZvbGxvd2luZyBmcm9tIHRoZSBzZXJ2ZXI6XG4vL1xuLy8gICAgICAtICAgdGltZXN0YW1wXG4vLyAgICAgIC0gICBkaXNwbGF5RmVlZFxuLy8gICAgICAtICAgY29ycmVjdFxuLy8gICAgICAtICAgaXNDb3JyZWN0QXJyYXlcbi8vXG4vLyAtICAgIFNhdmVzIHRoZSBmb2xsb3dpbmcgdG8gbG9jYWwgc3RvcmFnZTpcbi8vXG4vLyAgICAgIC0gICBzZWVkXG4vLyAgICAgIC0gICBhbnN3ZXJcbi8vICAgICAgLSAgIHRpbWVzdGFtcFxuLy8gICAgICAtICAgZGlzcGxheUZlZWQgKFNTRyBvbmx5KVxuLy8gICAgICAtICAgY29ycmVjdCAoU1NHIG9ubHkpXG4vLyAgICAgIC0gICBpc0NvcnJlY3RBcnJheSAoU1NHIG9ubHkpXG4vLyAgICAgIC0gICBwcm9ibGVtSHRtbFxuLy9cbi8vIFJhbmRvbWl6ZVxuLy8gLS0tLS0tLS0tXG4vLyBXaGVuIHRoZSB1c2VyIHByZXNzZXMgdGhlIFwiUmFuZG9taXplXCIgYnV0dG9uICh3aGljaCBpcyBvbmx5IGF2YWlsYWJsZSBmb3IgZHluYW1pYyBwcm9ibGVtcyksIHRoZSByYW5kb21pemVfIGZ1bmN0aW9uOlxuLy9cbi8vIC0gICAgRm9yIHRoZSBjbGllbnQtc2lkZSBjYXNlLCBzZXRzIHRoZSBzZWVkIHRvIGEgbmV3LCByYW5kb20gdmFsdWUuIEZvciB0aGUgc2VydmVyLXNpZGUgY2FzZSwgcmVxdWVzdHMgYSBuZXcgc2VlZCBhbmQgcHJvYmxlbUh0bWwgZnJvbSB0aGUgc2VydmVyLlxuLy8gLSAgICBTZXRzIHRoZSBhbnN3ZXIgdG8gYW4gYXJyYXkgb2YgZW1wdHkgc3RyaW5ncy5cbi8vIC0gICAgU2F2ZXMgdGhlIHVzdWFsIGxvY2FsIGRhdGEuXG5cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanNcIjtcbmltcG9ydCB7XG4gIHJlbmRlckR5bmFtaWNDb250ZW50LFxuICBjaGVja0Fuc3dlcnNDb3JlLFxuICByZW5kZXJEeW5hbWljRmVlZGJhY2ssXG59IGZyb20gXCIuL2ZpdGItdXRpbHMuanNcIjtcbmltcG9ydCBcIi4vZml0Yi1pMThuLmVuLmpzXCI7XG5pbXBvcnQgXCIuL2ZpdGItaTE4bi5wdC1ici5qc1wiO1xuaW1wb3J0IFwiLi4vY3NzL2ZpdGIuY3NzXCI7XG5cbi8vIE9iamVjdCBjb250YWluaW5nIGFsbCBpbnN0YW5jZXMgb2YgRklUQiB0aGF0IGFyZW4ndCBhIGNoaWxkIG9mIGEgdGltZWQgYXNzZXNzbWVudC5cbmV4cG9ydCB2YXIgRklUQkxpc3QgPSB7fTtcblxuLy8gRklUQiBjb25zdHJ1Y3RvclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRklUQiBleHRlbmRzIFJ1bmVzdG9uZUJhc2Uge1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgc3VwZXIob3B0cyk7XG4gICAgdmFyIG9yaWcgPSBvcHRzLm9yaWc7IC8vIGVudGlyZSA8cD4gZWxlbWVudFxuICAgIHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMgPSBvcHRzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzO1xuICAgIHRoaXMub3JpZ0VsZW0gPSBvcmlnO1xuICAgIHRoaXMuZGl2aWQgPSBvcmlnLmlkO1xuICAgIHRoaXMuY29ycmVjdCA9IG51bGw7XG4gICAgLy8gU2VlIGNvbW1lbnRzIGluIGZpdGIucHkgZm9yIHRoZSBmb3JtYXQgb2YgYGBmZWVkYmFja0FycmF5YGAgKHdoaWNoIGlzIGlkZW50aWNhbCBpbiBib3RoIGZpbGVzKS5cbiAgICAvL1xuICAgIC8vIEZpbmQgdGhlIHNjcmlwdCB0YWcgY29udGFpbmluZyBKU09OIGFuZCBwYXJzZSBpdC4gU2VlIGBTTyA8aHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTMyMDQyNy9iZXN0LXByYWN0aWNlLWZvci1lbWJlZGRpbmctYXJiaXRyYXJ5LWpzb24taW4tdGhlLWRvbT5gX18uIElmIHRoaXMgdGFnIGRvZXNuJ3QgZXhpc3QsIHRoZW4gbm8gZmVlZGJhY2sgaXMgYXZhaWxhYmxlOyBzZXJ2ZXItc2lkZSBncmFkaW5nIHdpbGwgYmUgcGVyZm9ybWVkLlxuICAgIC8vXG4gICAgLy8gQSBkZXN0cnVjdHVyaW5nIGFzc2lnbm1lbnQgd291bGQgYmUgcGVyZmVjdCwgYnV0IHRoZXkgZG9uJ3Qgd29yayB3aXRoIGBgdGhpcy5ibGFoYGAgYW5kIGBgd2l0aGBgIHN0YXRlbWVudHMgYXJlbid0IHN1cHBvcnRlZCBpbiBzdHJpY3QgbW9kZS5cbiAgICBjb25zdCBqc29uX2VsZW1lbnQgPSB0aGlzLnNjcmlwdFNlbGVjdG9yKHRoaXMub3JpZ0VsZW0pO1xuICAgIGNvbnN0IGRpY3RfID0gSlNPTi5wYXJzZShqc29uX2VsZW1lbnQuaHRtbCgpKTtcbiAgICBqc29uX2VsZW1lbnQucmVtb3ZlKCk7XG4gICAgdGhpcy5wcm9ibGVtSHRtbCA9IGRpY3RfLnByb2JsZW1IdG1sO1xuICAgIHRoaXMuZHluX3ZhcnMgPSBkaWN0Xy5keW5fdmFycztcbiAgICB0aGlzLmJsYW5rTmFtZXMgPSBkaWN0Xy5ibGFua05hbWVzO1xuICAgIHRoaXMuZmVlZGJhY2tBcnJheSA9IGRpY3RfLmZlZWRiYWNrQXJyYXk7XG5cbiAgICB0aGlzLmNyZWF0ZUZJVEJFbGVtZW50KCk7XG4gICAgdGhpcy5zZXR1cEJsYW5rcygpO1xuICAgIHRoaXMuY2FwdGlvbiA9IFwiRmlsbCBpbiB0aGUgQmxhbmtcIjtcbiAgICB0aGlzLmFkZENhcHRpb24oXCJydW5lc3RvbmVcIik7XG5cbiAgICAvLyBEZWZpbmUgYSBwcm9taXNlIHdoaWNoIGltcG9ydHMgYW55IGxpYnJhcmllcyBuZWVkZWQgYnkgZHluYW1pYyBwcm9ibGVtcy5cbiAgICB0aGlzLmR5bl9pbXBvcnRzID0ge307XG4gICAgbGV0IGltcG9ydHNfcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIGlmIChkaWN0Xy5keW5faW1wb3J0cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBDb2xsZWN0IGFsbCBpbXBvcnQgcHJvbWlzZXMuXG4gICAgICBsZXQgaW1wb3J0X3Byb21pc2VzID0gW107XG4gICAgICBmb3IgKGNvbnN0IGltcG9ydF8gb2YgZGljdF8uZHluX2ltcG9ydHMpIHtcbiAgICAgICAgc3dpdGNoIChpbXBvcnRfKSB7XG4gICAgICAgICAgICAvLyBGb3IgaW1wb3J0cyBrbm93biBhdCB3ZWJwYWNrIGJ1aWxkLCBicmluZyB0aGVzZSBpbi5cbiAgICAgICAgICAgIGNhc2UgXCJCVE1cIjogaW1wb3J0X3Byb21pc2VzLnB1c2goaW1wb3J0KFwiYnRtLWV4cHJlc3Npb25zL3NyYy9CVE1fcm9vdC5qc1wiKSk7IGJyZWFrO1xuICAgICAgICAgICAgLy8gQWxsb3cgZm9yIGxvY2FsIGltcG9ydHMsIHVzdWFsbHkgZnJvbSBwcm9ibGVtcyBkZWZpbmVkIG91dHNpZGUgdGhlIFJ1bmVzdG9uZSBDb21wb25lbnRzLlxuICAgICAgICAgICAgZGVmYXVsdDogaW1wb3J0X3Byb21pc2VzLnB1c2goaW1wb3J0KC8qIHdlYnBhY2tJZ25vcmU6IHRydWUgKi8gaW1wb3J0XykpOyBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBDb21iaW5lIHRoZSByZXN1bHRpbmcgbW9kdWxlIG5hbWVzcGFjZSBvYmplY3RzIHdoZW4gdGhlc2UgcHJvbWlzZXMgcmVzb2x2ZS5cbiAgICAgIGltcG9ydHNfcHJvbWlzZSA9IFByb21pc2UuYWxsKGltcG9ydF9wcm9taXNlcykudGhlbigobW9kdWxlX25hbWVzcGFjZV9hcnIpID0+XG4gICAgICAgIHRoaXMuZHluX2ltcG9ydHMgPSBPYmplY3QuYXNzaWduKHt9LCAuLi5tb2R1bGVfbmFtZXNwYWNlX2FycilcbiAgICAgICkuY2F0Y2goZXJyID0+IHsgdGhyb3cgYEZhaWxlZCBkeW5hbWljIGltcG9ydDogJHtlcnJ9LmAgfSk7XG4gICAgfVxuXG4gICAgLy8gUmVzb2x2ZSB0aGVzZSBwcm9taXNlcy5cbiAgICBpbXBvcnRzX3Byb21pc2UudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLmNoZWNrU2VydmVyKFwiZmlsbGJcIiwgZmFsc2UpLnRoZW4oKCkgPT4ge1xuICAgICAgICAvLyBPbmUgb3B0aW9uIGZvciBhIGR5bmFtaWMgcHJvYmxlbSBpcyB0byBwcm9kdWNlIGEgc3RhdGljIHByb2JsZW0gYnkgcHJvdmlkaW5nIGEgZml4ZWQgc2VlZCB2YWx1ZS4gVGhpcyBpcyB0eXBpY2FsbHkgdXNlZCB3aGVuIHRoZSBnb2FsIGlzIHRvIHJlbmRlciB0aGUgcHJvYmxlbSBhcyBhbiBpbWFnZSBmb3IgaW5jbHVzaW9uIGluIHN0YXRpYyBjb250ZW50IChhIFBERiwgZXRjLikuIFRvIHN1cHBvcnQgdGhpcywgY29uc2lkZXIgdGhlIGZvbGxvd2luZyBjYXNlczpcbiAgICAgICAgLy9cbiAgICAgICAgLy8vIENhc2UgIEhhcyBzdGF0aWMgc2VlZD8gIElzIGEgY2xpZW50LXNpZGUsIGR5bmFtaWMgcHJvYmxlbT8gIEhhcyBsb2NhbCBzZWVkPyAgUmVzdWx0XG4gICAgICAgIC8vLyAwICAgICBObyAgICAgICAgICAgICAgICBObyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBYICAgICAgICAgICAgICAgIE5vIGFjdGlvbiBuZWVkZWQuXG4gICAgICAgIC8vLyAxICAgICBObyAgICAgICAgICAgICAgICBZZXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBObyAgICAgICAgICAgICAgIHRoaXMucmFuZG9taXplKCkuXG4gICAgICAgIC8vLyAyICAgICBObyAgICAgICAgICAgICAgICBZZXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBZZXMgICAgICAgICAgICAgIE5vIGFjdGlvbiBuZWVkZWQgLS0gcHJvYmxlbSBhbHJlYWR5IHJlc3RvcmVkIGZyb20gbG9jYWwgc3RvcmFnZS5cbiAgICAgICAgLy8vIDMgICAgIFllcyAgICAgICAgICAgICAgIE5vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFggICAgICAgICAgICAgICAgV2FybmluZzogc2VlZCBpZ25vcmVkLlxuICAgICAgICAvLy8gNCAgICAgWWVzICAgICAgICAgICAgICAgWWVzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm8gICAgICAgICAgICAgICBBc3NpZ24gc2VlZDsgdGhpcy5yZW5kZXJEeW5hbWljQ29udGVudCgpLlxuICAgICAgICAvLy8gNSAgICAgWWVzICAgICAgICAgICAgICAgWWVzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWWVzICAgICAgICAgICAgICBJZiBzZWVkcyBkaWZmZXIsIGlzc3VlIHdhcm5pbmcuIE5vIGFkZGl0aW9uYWwgYWN0aW9uIG5lZWRlZCAtLSBwcm9ibGVtIGFscmVhZHkgcmVzdG9yZWQgZnJvbSBsb2NhbCBzdG9yYWdlLlxuXG4gICAgICAgIGNvbnN0IGhhc19zdGF0aWNfc2VlZCA9IGRpY3RfLnN0YXRpY19zZWVkICE9PSB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IGlzX2NsaWVudF9keW5hbWljID0gdHlwZW9mIHRoaXMuZHluX3ZhcnMgPT09IFwic3RyaW5nXCI7XG4gICAgICAgIGNvbnN0IGhhc19sb2NhbF9zZWVkID0gdGhpcy5zZWVkICE9PSB1bmRlZmluZWQ7XG5cbiAgICAgICAgLy8gQ2FzZSAxXG4gICAgICAgIGlmICghaGFzX3N0YXRpY19zZWVkICYmIGlzX2NsaWVudF9keW5hbWljICYmICFoYXNfbG9jYWxfc2VlZCkge1xuICAgICAgICAgIHRoaXMucmFuZG9taXplKCk7XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAvLyBDYXNlIDNcbiAgICAgICAgaWYgKGhhc19zdGF0aWNfc2VlZCAmJiAhaXNfY2xpZW50X2R5bmFtaWMpIHtcbiAgICAgICAgICBjb25zb2xlLmFzc2VydChmYWxzZSwgXCJXYXJuaW5nOiB0aGUgcHJvdmlkZWQgc3RhdGljIHNlZWQgd2FzIGlnbm9yZWQsIGJlY2F1c2UgaXQgb25seSBhZmZlY3RzIGNsaWVudC1zaWRlLCBkeW5hbWljIHByb2JsZW1zLlwiKTtcbiAgICAgICAgfSBlbHNlXG4gICAgICAgIC8vIENhc2UgNFxuICAgICAgICBpZiAoaGFzX3N0YXRpY19zZWVkICYmIGlzX2NsaWVudF9keW5hbWljICYmICFoYXNfbG9jYWxfc2VlZCkge1xuICAgICAgICAgIHRoaXMuc2VlZCA9IGRpY3RfLnN0YXRpY19zZWVkO1xuICAgICAgICAgIHRoaXMucmVuZGVyRHluYW1pY0NvbnRlbnQoKTtcbiAgICAgICAgfSBlbHNlXG4gICAgICAgIC8vIENhc2UgNVxuICAgICAgICBpZiAoaGFzX3N0YXRpY19zZWVkICYmIGlzX2NsaWVudF9keW5hbWljICYmIGhhc19sb2NhbF9zZWVkICYmIHRoaXMuc2VlZCAhPT0gZGljdF8uc3RhdGljX3NlZWQpIHtcbiAgICAgICAgICBjb25zb2xlLmFzc2VydChmYWxzZSwgXCJXYXJuaW5nOiB0aGUgcHJvdmlkZWQgc3RhdGljIHNlZWQgd2FzIG92ZXJyaWRkZW4gYnkgdGhlIHNlZWQgZm91bmQgaW4gbG9jYWwgc3RvcmFnZS5cIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2FzZXMgMCBhbmQgMlxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAvLyBObyBhY3Rpb24gbmVlZGVkLlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBQcmlzbSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgUHJpc20uaGlnaGxpZ2h0QWxsVW5kZXIodGhpcy5jb250YWluZXJEaXYpO1xuICAgICAgICAgIH1cblxuICAgICAgICB0aGlzLmluZGljYXRlX2NvbXBvbmVudF9yZWFkeSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBGaW5kIHRoZSBzY3JpcHQgdGFnIGNvbnRhaW5pbmcgSlNPTiBpbiBhIGdpdmVuIHJvb3QgRE9NIG5vZGUuXG4gIHNjcmlwdFNlbGVjdG9yKHJvb3Rfbm9kZSkge1xuICAgIHJldHVybiAkKHJvb3Rfbm9kZSkuZmluZChgc2NyaXB0W3R5cGU9XCJhcHBsaWNhdGlvbi9qc29uXCJdYCk7XG4gIH1cblxuICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09ICAgRnVuY3Rpb25zIGdlbmVyYXRpbmcgZmluYWwgSFRNTCAgID09PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgY3JlYXRlRklUQkVsZW1lbnQoKSB7XG4gICAgdGhpcy5yZW5kZXJGSVRCSW5wdXQoKTtcbiAgICB0aGlzLnJlbmRlckZJVEJCdXR0b25zKCk7XG4gICAgdGhpcy5yZW5kZXJGSVRCRmVlZGJhY2tEaXYoKTtcbiAgICAvLyByZXBsYWNlcyB0aGUgaW50ZXJtZWRpYXRlIEhUTUwgZm9yIHRoaXMgY29tcG9uZW50IHdpdGggdGhlIHJlbmRlcmVkIEhUTUwgb2YgdGhpcyBjb21wb25lbnRcbiAgICAkKHRoaXMub3JpZ0VsZW0pLnJlcGxhY2VXaXRoKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgfVxuICByZW5kZXJGSVRCSW5wdXQoKSB7XG4gICAgLy8gVGhlIHRleHQgW2lucHV0XSBlbGVtZW50cyBhcmUgY3JlYXRlZCBieSB0aGUgdGVtcGxhdGUuXG4gICAgdGhpcy5jb250YWluZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRoaXMuY29udGFpbmVyRGl2LmlkID0gdGhpcy5kaXZpZDtcbiAgICAvLyBDcmVhdGUgYW5vdGhlciBjb250YWluZXIgd2hpY2ggc3RvcmVzIHRoZSBwcm9ibGVtIGRlc2NyaXB0aW9uLlxuICAgIHRoaXMuZGVzY3JpcHRpb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuZGVzY3JpcHRpb25EaXYpO1xuICAgIC8vIENvcHkgdGhlIG9yaWdpbmFsIGVsZW1lbnRzIHRvIHRoZSBjb250YWluZXIgaG9sZGluZyB3aGF0IHRoZSB1c2VyIHdpbGwgc2VlIChjbGllbnQtc2lkZSBncmFkaW5nIG9ubHkpLlxuICAgIGlmICh0aGlzLnByb2JsZW1IdG1sKSB7XG4gICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2LmlubmVySFRNTCA9IHRoaXMucHJvYmxlbUh0bWw7XG4gICAgICAvLyBTYXZlIG9yaWdpbmFsIEhUTUwgKHdpdGggdGVtcGxhdGVzKSB1c2VkIGluIGR5bmFtaWMgcHJvYmxlbXMuXG4gICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2Lm9yaWdJbm5lckhUTUwgPSB0aGlzLnByb2JsZW1IdG1sO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlckZJVEJCdXR0b25zKCkge1xuICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJiclwiKSk7XG4gICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcblxuICAgIC8vIFwic3VibWl0XCIgYnV0dG9uXG4gICAgdGhpcy5zdWJtaXRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIHRoaXMuc3VibWl0QnV0dG9uLnRleHRDb250ZW50ID0gJC5pMThuKFwibXNnX2ZpdGJfY2hlY2tfbWVcIik7XG4gICAgJCh0aGlzLnN1Ym1pdEJ1dHRvbikuYXR0cih7XG4gICAgICBjbGFzczogXCJidG4gYnRuLXN1Y2Nlc3NcIixcbiAgICAgIG5hbWU6IFwiZG8gYW5zd2VyXCIsXG4gICAgICB0eXBlOiBcImJ1dHRvblwiLFxuICAgIH0pO1xuICAgIHRoaXMuc3VibWl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcImNsaWNrXCIsXG4gICAgICBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2hlY2tDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgIGF3YWl0IHRoaXMubG9nQ3VycmVudEFuc3dlcigpO1xuICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgZmFsc2VcbiAgICApO1xuICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuc3VibWl0QnV0dG9uKTtcblxuICAgIC8vIFwiY29tcGFyZSBtZVwiIGJ1dHRvblxuICAgIGlmICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICB0aGlzLmNvbXBhcmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgJCh0aGlzLmNvbXBhcmVCdXR0b24pLmF0dHIoe1xuICAgICAgICBjbGFzczogXCJidG4gYnRuLWRlZmF1bHRcIixcbiAgICAgICAgaWQ6IHRoaXMub3JpZ0VsZW0uaWQgKyBcIl9iY29tcFwiLFxuICAgICAgICBkaXNhYmxlZDogXCJcIixcbiAgICAgICAgbmFtZTogXCJjb21wYXJlXCIsXG4gICAgICB9KTtcbiAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbi50ZXh0Q29udGVudCA9ICQuaTE4bihcIm1zZ19maXRiX2NvbXBhcmVfbWVcIik7XG4gICAgICB0aGlzLmNvbXBhcmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5jb21wYXJlRklUQkFuc3dlcnMoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICBmYWxzZVxuICAgICAgKTtcbiAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuY29tcGFyZUJ1dHRvbik7XG4gICAgfVxuXG4gICAgLy8gUmFuZG9taXplIGJ1dHRvbiBmb3IgZHluYW1pYyBwcm9ibGVtcy5cbiAgICBpZiAodGhpcy5keW5fdmFycykge1xuICAgICAgdGhpcy5yYW5kb21pemVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgJCh0aGlzLnJhbmRvbWl6ZUJ1dHRvbikuYXR0cih7XG4gICAgICAgIGNsYXNzOiBcImJ0biBidG4tZGVmYXVsdFwiLFxuICAgICAgICBpZDogdGhpcy5vcmlnRWxlbS5pZCArIFwiX2Jjb21wXCIsXG4gICAgICAgIG5hbWU6IFwicmFuZG9taXplXCIsXG4gICAgICB9KTtcbiAgICAgIHRoaXMucmFuZG9taXplQnV0dG9uLnRleHRDb250ZW50ID0gJC5pMThuKFwibXNnX2ZpdGJfcmFuZG9taXplXCIpO1xuICAgICAgdGhpcy5yYW5kb21pemVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5yYW5kb21pemUoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICBmYWxzZVxuICAgICAgKTtcbiAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMucmFuZG9taXplQnV0dG9uKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcbiAgfVxuICByZW5kZXJGSVRCRmVlZGJhY2tEaXYoKSB7XG4gICAgdGhpcy5mZWVkQmFja0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdGhpcy5mZWVkQmFja0Rpdi5pZCA9IHRoaXMuZGl2aWQgKyBcIl9mZWVkYmFja1wiO1xuICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJiclwiKSk7XG4gICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5mZWVkQmFja0Rpdik7XG4gIH1cblxuICBjbGVhckZlZWRiYWNrRGl2KCkge1xuICAgIC8vIFNldHRpbmcgdGhlIGBgb3V0ZXJIVE1MYGAgcmVtb3ZlcyB0aGlzIGZyb20gdGhlIERPTS4gVXNlIGFuIGFsdGVybmF0aXZlIHByb2Nlc3MgLS0gcmVtb3ZlIHRoZSBjbGFzcyAod2hpY2ggbWFrZXMgaXQgcmVkL2dyZWVuIGJhc2VkIG9uIGdyYWRpbmcpIGFuZCBjb250ZW50LlxuICAgIHRoaXMuZmVlZEJhY2tEaXYuaW5uZXJIVE1MID0gXCJcIjtcbiAgICB0aGlzLmZlZWRCYWNrRGl2LmNsYXNzTmFtZSA9IFwiXCI7XG4gIH1cblxuICAvLyBVcGRhdGUgdGhlIHByb2JsZW0ncyBkZXNjcmlwdGlvbiBiYXNlZCBvbiBkeW5hbWljYWxseS1nZW5lcmF0ZWQgY29udGVudC5cbiAgcmVuZGVyRHluYW1pY0NvbnRlbnQoKSB7XG4gICAgLy8gYGB0aGlzLmR5bl92YXJzYGAgY2FuIGJlIHRydWU7IGlmIHNvLCBkb24ndCByZW5kZXIgaXQsIHNpbmNlIHRoZSBzZXJ2ZXIgZG9lcyBhbGwgdGhlIHJlbmRlcmluZy5cbiAgICBpZiAodHlwZW9mIHRoaXMuZHluX3ZhcnMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGxldCBodG1sX25vZGVzO1xuICAgICAgW2h0bWxfbm9kZXMsIHRoaXMuZHluX3ZhcnNfZXZhbF0gPVxuICAgICAgICByZW5kZXJEeW5hbWljQ29udGVudChcbiAgICAgICAgICB0aGlzLnNlZWQsXG4gICAgICAgICAgdGhpcy5keW5fdmFycyxcbiAgICAgICAgICB0aGlzLmR5bl9pbXBvcnRzLFxuICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYub3JpZ0lubmVySFRNTCxcbiAgICAgICAgICB0aGlzLmRpdmlkLFxuICAgICAgICAgIHRoaXMucHJlcGFyZUNoZWNrQW5zd2Vycy5iaW5kKHRoaXMpLFxuICAgICAgICApO1xuICAgICAgdGhpcy5kZXNjcmlwdGlvbkRpdi5yZXBsYWNlQ2hpbGRyZW4oLi4uaHRtbF9ub2Rlcyk7XG5cbiAgICAgIGlmICh0eXBlb2YgKHRoaXMuZHluX3ZhcnNfZXZhbC5hZnRlckNvbnRlbnRSZW5kZXIpID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGlzLmR5bl92YXJzX2V2YWwuYWZ0ZXJDb250ZW50UmVuZGVyKHRoaXMuZHluX3ZhcnNfZXZhbCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLCBgRXJyb3IgaW4gcHJvYmxlbSAke3RoaXMuZGl2aWR9IGludm9raW5nIGFmdGVyQ29udGVudFJlbmRlcmApO1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnF1ZXVlTWF0aEpheCh0aGlzLmRlc2NyaXB0aW9uRGl2KTtcbiAgICAgIHRoaXMuc2V0dXBCbGFua3MoKTtcbiAgICB9XG4gIH1cblxuICBzZXR1cEJsYW5rcygpIHtcbiAgICAvLyBGaW5kIGFuZCBmb3JtYXQgdGhlIGJsYW5rcy4gSWYgYSBkeW5hbWljIHByb2JsZW0ganVzdCBjaGFuZ2VkIHRoZSBIVE1MLCB0aGlzIHdpbGwgZmluZCB0aGUgbmV3bHktY3JlYXRlZCBibGFua3MuXG4gICAgY29uc3QgYmEgPSAkKHRoaXMuZGVzY3JpcHRpb25EaXYpLmZpbmQoXCI6aW5wdXRcIik7XG4gICAgYmEuYXR0cihcImNsYXNzXCIsIFwiZm9ybSBmb3JtLWNvbnRyb2wgc2VsZWN0d2lkdGhhdXRvXCIpO1xuICAgIGJhLmF0dHIoXCJhcmlhLWxhYmVsXCIsIFwiaW5wdXQgYXJlYVwiKTtcbiAgICB0aGlzLmJsYW5rQXJyYXkgPSBiYS50b0FycmF5KCk7XG4gICAgZm9yIChsZXQgYmxhbmsgb2YgdGhpcy5ibGFua0FycmF5KSB7XG4gICAgICAkKGJsYW5rKS5jaGFuZ2UodGhpcy5yZWNvcmRBbnN3ZXJlZC5iaW5kKHRoaXMpKTtcbiAgICB9XG4gIH1cblxuICAvLyBUaGlzIHRlbGxzIHRpbWVkIHF1ZXN0aW9ucyB0aGF0IHRoZSBmaXRiIGJsYW5rcyByZWNlaXZlZCBzb21lIGludGVyYWN0aW9uLlxuICByZWNvcmRBbnN3ZXJlZCgpIHtcbiAgICB0aGlzLmlzQW5zd2VyZWQgPSB0cnVlO1xuICB9XG5cbiAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBDaGVja2luZy9sb2FkaW5nIGZyb20gc3RvcmFnZSA9PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gIC8vIF9gcmVzdG9yZUFuc3dlcnNgOiB1cGRhdGUgdGhlIHByb2JsZW0gd2l0aCBkYXRhIGZyb20gdGhlIHNlcnZlciBvciBmcm9tIGxvY2FsIHN0b3JhZ2UuXG4gIHJlc3RvcmVBbnN3ZXJzKGRhdGEpIHtcbiAgICAvLyBSZXN0b3JlIHRoZSBzZWVkIGZpcnN0LCBzaW5jZSB0aGUgZHluYW1pYyByZW5kZXIgY2xlYXJzIGFsbCB0aGUgYmxhbmtzLlxuICAgIHRoaXMuc2VlZCA9IGRhdGEuc2VlZDtcbiAgICB0aGlzLnJlbmRlckR5bmFtaWNDb250ZW50KCk7XG5cbiAgICB2YXIgYXJyO1xuICAgIC8vIFJlc3RvcmUgYW5zd2VycyBmcm9tIHN0b3JhZ2UgcmV0cmlldmFsIGRvbmUgaW4gUnVuZXN0b25lQmFzZS5cbiAgICB0cnkge1xuICAgICAgLy8gVGhlIG5ld2VyIGZvcm1hdCBlbmNvZGVzIGRhdGEgYXMgYSBKU09OIG9iamVjdC5cbiAgICAgIGFyciA9IEpTT04ucGFyc2UoZGF0YS5hbnN3ZXIpO1xuICAgICAgLy8gVGhlIHJlc3VsdCBzaG91bGQgYmUgYW4gYXJyYXkuIElmIG5vdCwgdHJ5IGNvbW1hIHBhcnNpbmcgaW5zdGVhZC5cbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gVGhlIG9sZCBmb3JtYXQgZGlkbid0LlxuICAgICAgYXJyID0gKGRhdGEuYW5zd2VyIHx8IFwiXCIpLnNwbGl0KFwiLFwiKTtcbiAgICB9XG4gICAgbGV0IGhhc0Fuc3dlciA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAkKHRoaXMuYmxhbmtBcnJheVtpXSkuYXR0cihcInZhbHVlXCIsIGFycltpXSk7XG4gICAgICBpZiAoYXJyW2ldKSB7XG4gICAgICAgIGhhc0Fuc3dlciA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIElzIHRoaXMgY2xpZW50LXNpZGUgZ3JhZGluZywgb3Igc2VydmVyLXNpZGUgZ3JhZGluZz9cbiAgICBpZiAodGhpcy5mZWVkYmFja0FycmF5KSB7XG4gICAgICAvLyBGb3IgY2xpZW50LXNpZGUgZ3JhZGluZywgcmUtZ2VuZXJhdGUgZmVlZGJhY2sgaWYgdGhlcmUncyBhbiBhbnN3ZXIuXG4gICAgICBpZiAoaGFzQW5zd2VyKSB7XG4gICAgICAgIHRoaXMuY2hlY2tDdXJyZW50QW5zd2VyKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZvciBzZXJ2ZXItc2lkZSBncmFkaW5nLCB1c2UgdGhlIHByb3ZpZGVkIGZlZWRiYWNrIGZyb20gdGhlIHNlcnZlciBvciBsb2NhbCBzdG9yYWdlLlxuICAgICAgdGhpcy5kaXNwbGF5RmVlZCA9IGRhdGEuZGlzcGxheUZlZWQ7XG4gICAgICB0aGlzLmNvcnJlY3QgPSBkYXRhLmNvcnJlY3Q7XG4gICAgICB0aGlzLmlzQ29ycmVjdEFycmF5ID0gZGF0YS5pc0NvcnJlY3RBcnJheTtcbiAgICAgIC8vIE9ubHkgcmVuZGVyIGlmIGFsbCB0aGUgZGF0YSBpcyBwcmVzZW50OyBsb2NhbCBzdG9yYWdlIG1pZ2h0IGhhdmUgb2xkIGRhdGEgbWlzc2luZyBzb21lIG9mIHRoZXNlIGl0ZW1zLlxuICAgICAgaWYgKFxuICAgICAgICB0eXBlb2YgdGhpcy5kaXNwbGF5RmVlZCAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgICB0eXBlb2YgdGhpcy5jb3JyZWN0ICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgIHR5cGVvZiB0aGlzLmlzQ29ycmVjdEFycmF5ICE9PSBcInVuZGVmaW5lZFwiXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5yZW5kZXJGZWVkYmFjaygpO1xuICAgICAgfVxuICAgICAgLy8gRm9yIHNlcnZlci1zaWRlIGR5bmFtaWMgcHJvYmxlbXMsIHNob3cgdGhlIHJlbmRlcmVkIHByb2JsZW0gdGV4dC5cbiAgICAgIHRoaXMucHJvYmxlbUh0bWwgPSBkYXRhLnByb2JsZW1IdG1sO1xuICAgICAgaWYgKHRoaXMucHJvYmxlbUh0bWwpIHtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbkRpdi5pbm5lckhUTUwgPSB0aGlzLnByb2JsZW1IdG1sO1xuICAgICAgICB0aGlzLnF1ZXVlTWF0aEpheCh0aGlzLmRlc2NyaXB0aW9uRGl2KTtcbiAgICAgICAgdGhpcy5zZXR1cEJsYW5rcygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNoZWNrTG9jYWxTdG9yYWdlKCkge1xuICAgIC8vIExvYWRzIHByZXZpb3VzIGFuc3dlcnMgZnJvbSBsb2NhbCBzdG9yYWdlIGlmIHRoZXkgZXhpc3RcbiAgICB2YXIgc3RvcmVkRGF0YTtcbiAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGxlbiA9IGxvY2FsU3RvcmFnZS5sZW5ndGg7XG4gICAgaWYgKGxlbiA+IDApIHtcbiAgICAgIHZhciBleCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgaWYgKGV4ICE9PSBudWxsKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgc3RvcmVkRGF0YSA9IEpTT04ucGFyc2UoZXgpO1xuICAgICAgICAgIHZhciBhcnIgPSBzdG9yZWREYXRhLmFuc3dlcjtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgLy8gZXJyb3Igd2hpbGUgcGFyc2luZzsgbGlrZWx5IGR1ZSB0byBiYWQgdmFsdWUgc3RvcmVkIGluIHN0b3JhZ2VcbiAgICAgICAgICBjb25zb2xlLmFzc2VydChmYWxzZSwgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlc3RvcmVBbnN3ZXJzKHN0b3JlZERhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldExvY2FsU3RvcmFnZShkYXRhKSB7XG4gICAgbGV0IGtleSA9IHRoaXMubG9jYWxTdG9yYWdlS2V5KCk7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIH1cblxuICBjaGVja0N1cnJlbnRBbnN3ZXIoKSB7XG4gICAgLy8gU3RhcnQgb2YgdGhlIGV2YWx1YXRpb24gY2hhaW5cbiAgICB0aGlzLmlzQ29ycmVjdEFycmF5ID0gW107XG4gICAgdGhpcy5kaXNwbGF5RmVlZCA9IFtdO1xuICAgIGNvbnN0IHBjYSA9IHRoaXMucHJlcGFyZUNoZWNrQW5zd2VycygpO1xuXG4gICAgaWYgKHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgIGlmIChlQm9va0NvbmZpZy5lbmFibGVDb21wYXJlTWUpIHtcbiAgICAgICAgdGhpcy5lbmFibGVDb21wYXJlQnV0dG9uKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gR3JhZGUgbG9jYWxseSBpZiB3ZSBjYW4ndCBhc2sgdGhlIHNlcnZlciB0byBncmFkZS5cbiAgICBpZiAodGhpcy5mZWVkYmFja0FycmF5KSB7XG4gICAgICBbXG4gICAgICAgIC8vIEFuIGFycmF5IG9mIEhUTUwgZmVlZGJhY2suXG4gICAgICAgIHRoaXMuZGlzcGxheUZlZWQsXG4gICAgICAgIC8vIHRydWUsIGZhbHNlLCBvciBudWxsICh0aGUgcXVlc3Rpb24gd2Fzbid0IGFuc3dlcmVkKS5cbiAgICAgICAgdGhpcy5jb3JyZWN0LFxuICAgICAgICAvLyBBbiBhcnJheSBvZiB0cnVlLCBmYWxzZSwgb3IgbnVsbCAodGhlIHF1ZXN0aW9uIHdhc24ndCBhbnN3ZXJlZCkuXG4gICAgICAgIHRoaXMuaXNDb3JyZWN0QXJyYXksXG4gICAgICAgIHRoaXMucGVyY2VudFxuICAgICAgXSA9IGNoZWNrQW5zd2Vyc0NvcmUoLi4ucGNhKTtcbiAgICAgIGlmICghdGhpcy5pc1RpbWVkKSB7XG4gICAgICAgIHRoaXMucmVuZGVyRmVlZGJhY2soKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBJbnB1dHM6XG4gIC8vXG4gIC8vIC0gU3RyaW5ncyBlbnRlcmVkIGJ5IHRoZSBzdHVkZW50IGluIGBgdGhpcy5ibGFua0FycmF5W2ldLnZhbHVlYGAuXG4gIC8vIC0gRmVlZGJhY2sgaW4gYGB0aGlzLmZlZWRiYWNrQXJyYXlgYC5cbiAgcHJlcGFyZUNoZWNrQW5zd2VycygpIHtcbiAgICB0aGlzLmdpdmVuX2FyciA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaSsrKVxuICAgICAgdGhpcy5naXZlbl9hcnIucHVzaCh0aGlzLmJsYW5rQXJyYXlbaV0udmFsdWUpO1xuICAgIHJldHVybiBbdGhpcy5ibGFua05hbWVzLCB0aGlzLmdpdmVuX2FyciwgdGhpcy5mZWVkYmFja0FycmF5LCB0aGlzLmR5bl92YXJzX2V2YWxdO1xuICB9XG5cbiAgLy8gX2ByYW5kb21pemVgOiBUaGlzIGhhbmRsZXMgYSBjbGljayB0byB0aGUgXCJSYW5kb21pemVcIiBidXR0b24uXG4gIGFzeW5jIHJhbmRvbWl6ZSgpIHtcbiAgICAvLyBVc2UgdGhlIGNsaWVudC1zaWRlIGNhc2Ugb3IgdGhlIHNlcnZlci1zaWRlIGNhc2U/XG4gICAgaWYgKHRoaXMuZmVlZGJhY2tBcnJheSkge1xuICAgICAgLy8gVGhpcyBpcyB0aGUgY2xpZW50LXNpZGUgY2FzZS5cbiAgICAgIC8vXG4gICAgICB0aGlzLnNlZWQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyICoqIDMyKTtcbiAgICAgIHRoaXMucmVuZGVyRHluYW1pY0NvbnRlbnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhpcyBpcyB0aGUgc2VydmVyLXNpZGUgY2FzZS4gU2VuZCBhIHJlcXVlc3QgdG8gdGhlIGByZXN1bHRzIDxnZXRBc3Nlc3NSZXN1bHRzPmAgZW5kcG9pbnQgd2l0aCBgYG5ld19zZWVkYGAgc2V0IHRvIFRydWUuXG4gICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXCIvYXNzZXNzbWVudC9yZXN1bHRzXCIsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICBjb3Vyc2U6IGVCb29rQ29uZmlnLmNvdXJzZSxcbiAgICAgICAgICBldmVudDogXCJmaWxsYlwiLFxuICAgICAgICAgIHNpZDogdGhpcy5zaWQsXG4gICAgICAgICAgbmV3X3NlZWQ6IHRydWUsXG4gICAgICAgIH0pLFxuICAgICAgICBoZWFkZXJzOiB0aGlzLmpzb25IZWFkZXJzLFxuICAgICAgfSk7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBhbGVydChgSFRUUCBlcnJvciBnZXR0aW5nIHJlc3VsdHM6ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIGNvbnN0IHJlcyA9IGRhdGEuZGV0YWlsO1xuICAgICAgdGhpcy5zZWVkID0gcmVzLnNlZWQ7XG4gICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2LmlubmVySFRNTCA9IHJlcy5wcm9ibGVtSHRtbDtcbiAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuZGVzY3JpcHRpb25EaXYpO1xuICAgICAgdGhpcy5zZXR1cEJsYW5rcygpO1xuICAgIH1cbiAgICAvLyBXaGVuIGdldHRpbmcgYSBuZXcgc2VlZCwgY2xlYXIgYWxsIHRoZSBvbGQgYW5zd2VycyBhbmQgZmVlZGJhY2suXG4gICAgdGhpcy5naXZlbl9hcnIgPSBBcnJheSh0aGlzLmJsYW5rQXJyYXkubGVuKS5maWxsKFwiXCIpO1xuICAgICQodGhpcy5ibGFua0FycmF5KS5hdHRyKFwidmFsdWVcIiwgXCJcIik7XG4gICAgdGhpcy5jbGVhckZlZWRiYWNrRGl2KCk7XG4gICAgdGhpcy5zYXZlQW5zd2Vyc0xvY2FsbHlPbmx5KCk7XG4gIH1cblxuICAvLyBTYXZlIHRoZSBhbnN3ZXJzIGFuZCBhc3NvY2lhdGVkIGRhdGEgbG9jYWxseTsgZG9uJ3Qgc2F2ZSBmZWVkYmFjayBwcm92aWRlZCBieSB0aGUgc2VydmVyIGZvciB0aGlzIGFuc3dlci4gSXQgYXNzdW1lcyB0aGF0IGBgdGhpcy5naXZlbl9hcnJgYCBjb250YWlucyB0aGUgY3VycmVudCBhbnN3ZXJzLlxuICBzYXZlQW5zd2Vyc0xvY2FsbHlPbmx5KCkge1xuICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKHtcbiAgICAgIC8vIFRoZSBzZWVkIGlzIHVzZWQgZm9yIGNsaWVudC1zaWRlIG9wZXJhdGlvbiwgYnV0IGRvZXNuJ3QgbWF0dGVyIGZvciBzZXJ2ZXItc2lkZS5cbiAgICAgIHNlZWQ6IHRoaXMuc2VlZCxcbiAgICAgIGFuc3dlcjogSlNPTi5zdHJpbmdpZnkodGhpcy5naXZlbl9hcnIpLFxuICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLFxuICAgICAgLy8gVGhpcyBpcyBvbmx5IG5lZWRlZCBmb3Igc2VydmVyLXNpZGUgZ3JhZGluZyB3aXRoIGR5bmFtaWMgcHJvYmxlbXMuXG4gICAgICBwcm9ibGVtSHRtbDogdGhpcy5kZXNjcmlwdGlvbkRpdi5pbm5lckhUTUwsXG4gICAgfSk7XG4gIH1cblxuICAvLyBfYGxvZ0N1cnJlbnRBbnN3ZXJgOiBTYXZlIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBwcm9ibGVtIHRvIGxvY2FsIHN0b3JhZ2UgYW5kIHRoZSBzZXJ2ZXI7IGRpc3BsYXkgc2VydmVyIGZlZWRiYWNrLlxuICBhc3luYyBsb2dDdXJyZW50QW5zd2VyKHNpZCkge1xuICAgIGxldCBhbnN3ZXIgPSBKU09OLnN0cmluZ2lmeSh0aGlzLmdpdmVuX2Fycik7XG4gICAgbGV0IGZlZWRiYWNrID0gdHJ1ZTtcbiAgICAvLyBTYXZlIHRoZSBhbnN3ZXIgbG9jYWxseS5cbiAgICB0aGlzLnNhdmVBbnN3ZXJzTG9jYWxseU9ubHkoKTtcbiAgICAvLyBTYXZlIHRoZSBhbnN3ZXIgdG8gdGhlIHNlcnZlci5cbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgZXZlbnQ6IFwiZmlsbGJcIixcbiAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgIGFjdDogYW5zd2VyIHx8IFwiXCIsXG4gICAgICBzZWVkOiB0aGlzLnNlZWQsXG4gICAgICBhbnN3ZXI6IGFuc3dlciB8fCBcIlwiLFxuICAgICAgY29ycmVjdDogdGhpcy5jb3JyZWN0ID8gXCJUXCIgOiBcIkZcIixcbiAgICAgIHBlcmNlbnQ6IHRoaXMucGVyY2VudCxcbiAgICB9O1xuICAgIGlmICh0eXBlb2Ygc2lkICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBkYXRhLnNpZCA9IHNpZDtcbiAgICAgIGZlZWRiYWNrID0gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHNlcnZlcl9kYXRhID0gYXdhaXQgdGhpcy5sb2dCb29rRXZlbnQoZGF0YSk7XG4gICAgaWYgKCFmZWVkYmFjaykgcmV0dXJuO1xuICAgIC8vIE5vbi1zZXJ2ZXIgc2lkZSBncmFkZWQgcHJvYmxlbXMgYXJlIGRvbmUgYXQgdGhpcyBwb2ludDsgbGlrZXdpc2UsIHN0b3AgaGVyZSBpZiB0aGUgc2VydmVyIGRpZG4ndCByZXNwb25kLlxuICAgIGlmICh0aGlzLmZlZWRiYWNrQXJyYXkgfHwgIXNlcnZlcl9kYXRhKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgLy8gVGhpcyBpcyB0aGUgc2VydmVyLXNpZGUgY2FzZS4gT24gc3VjY2VzcywgdXBkYXRlIHRoZSBmZWVkYmFjayBmcm9tIHRoZSBzZXJ2ZXIncyBncmFkZS5cbiAgICBjb25zdCByZXMgPSBzZXJ2ZXJfZGF0YS5kZXRhaWw7XG4gICAgdGhpcy50aW1lc3RhbXAgPSByZXMudGltZXN0YW1wO1xuICAgIHRoaXMuZGlzcGxheUZlZWQgPSByZXMuZGlzcGxheUZlZWQ7XG4gICAgdGhpcy5jb3JyZWN0ID0gcmVzLmNvcnJlY3Q7XG4gICAgdGhpcy5pc0NvcnJlY3RBcnJheSA9IHJlcy5pc0NvcnJlY3RBcnJheTtcbiAgICB0aGlzLnNldExvY2FsU3RvcmFnZSh7XG4gICAgICBzZWVkOiB0aGlzLnNlZWQsXG4gICAgICBhbnN3ZXI6IGFuc3dlcixcbiAgICAgIHRpbWVzdGFtcDogdGhpcy50aW1lc3RhbXAsXG4gICAgICBwcm9ibGVtSHRtbDogdGhpcy5kZXNjcmlwdGlvbkRpdi5pbm5lckhUTUwsXG4gICAgICBkaXNwbGF5RmVlZDogdGhpcy5kaXNwbGF5RmVlZCxcbiAgICAgIGNvcnJlY3Q6IHRoaXMuY29ycmVjdCxcbiAgICAgIGlzQ29ycmVjdEFycmF5OiB0aGlzLmlzQ29ycmVjdEFycmF5LFxuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyRmVlZGJhY2soKTtcbiAgICByZXR1cm4gc2VydmVyX2RhdGE7XG4gIH1cblxuICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBFdmFsdWF0aW9uIG9mIGFuc3dlciBhbmQgPT09XG4gICAgPT09ICAgICBkaXNwbGF5IGZlZWRiYWNrICAgICA9PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICByZW5kZXJGZWVkYmFjaygpIHtcbiAgICBpZiAodGhpcy5jb3JyZWN0KSB7XG4gICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWluZm9cIik7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGorKykge1xuICAgICAgICAkKHRoaXMuYmxhbmtBcnJheVtqXSkucmVtb3ZlQ2xhc3MoXCJpbnB1dC12YWxpZGF0aW9uLWVycm9yXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5kaXNwbGF5RmVlZCA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLmRpc3BsYXlGZWVkID0gXCJcIjtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQ29ycmVjdEFycmF5W2pdICE9PSB0cnVlKSB7XG4gICAgICAgICAgJCh0aGlzLmJsYW5rQXJyYXlbal0pLmFkZENsYXNzKFwiaW5wdXQtdmFsaWRhdGlvbi1lcnJvclwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkKHRoaXMuYmxhbmtBcnJheVtqXSkucmVtb3ZlQ2xhc3MoXCJpbnB1dC12YWxpZGF0aW9uLWVycm9yXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWRhbmdlclwiKTtcbiAgICB9XG4gICAgdmFyIGZlZWRiYWNrX2h0bWwgPSBcIjx1bD5cIjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZGlzcGxheUZlZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBkZiA9IHRoaXMuZGlzcGxheUZlZWRbaV07XG4gICAgICAvLyBSZW5kZXIgYW55IGR5bmFtaWMgZmVlZGJhY2sgaW4gdGhlIHByb3ZpZGVkIGZlZWRiYWNrLCBmb3IgY2xpZW50LXNpZGUgZ3JhZGluZyBvZiBkeW5hbWljIHByb2JsZW1zLlxuICAgICAgaWYgKHR5cGVvZiB0aGlzLmR5bl92YXJzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGRmID0gcmVuZGVyRHluYW1pY0ZlZWRiYWNrKFxuICAgICAgICAgIHRoaXMuYmxhbmtOYW1lcyxcbiAgICAgICAgICB0aGlzLmdpdmVuX2FycixcbiAgICAgICAgICBpLFxuICAgICAgICAgIGRmLFxuICAgICAgICAgIHRoaXMuZHluX3ZhcnNfZXZhbFxuICAgICAgICApO1xuICAgICAgICAvLyBDb252ZXJ0IHRoZSByZXR1cm5lZCBOb2RlTGlzdCBpbnRvIGEgc3RyaW5nIG9mIEhUTUwuXG4gICAgICAgIGRmID0gZGYgPyBkZlswXS5wYXJlbnRFbGVtZW50LmlubmVySFRNTCA6IFwiTm8gZmVlZGJhY2sgcHJvdmlkZWRcIjtcbiAgICAgIH1cbiAgICAgIGZlZWRiYWNrX2h0bWwgKz0gYDxsaT4ke2RmfTwvbGk+YDtcbiAgICB9XG4gICAgZmVlZGJhY2tfaHRtbCArPSBcIjwvdWw+XCI7XG4gICAgLy8gUmVtb3ZlIHRoZSBsaXN0IGlmIGl0J3MganVzdCBvbmUgZWxlbWVudC5cbiAgICBpZiAodGhpcy5kaXNwbGF5RmVlZC5sZW5ndGggPT0gMSkge1xuICAgICAgZmVlZGJhY2tfaHRtbCA9IGZlZWRiYWNrX2h0bWwuc2xpY2UoXG4gICAgICAgIFwiPHVsPjxsaT5cIi5sZW5ndGgsXG4gICAgICAgIC1cIjwvbGk+PC91bD5cIi5sZW5ndGhcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMuZmVlZEJhY2tEaXYuaW5uZXJIVE1MID0gZmVlZGJhY2tfaHRtbDtcbiAgICB0aGlzLnF1ZXVlTWF0aEpheCh0aGlzLmZlZWRCYWNrRGl2KTtcbiAgfVxuXG4gIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBGdW5jdGlvbnMgZm9yIGNvbXBhcmUgYnV0dG9uID09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICBlbmFibGVDb21wYXJlQnV0dG9uKCkge1xuICAgIHRoaXMuY29tcGFyZUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICB9XG4gIC8vIF9gY29tcGFyZUZJVEJBbnN3ZXJzYFxuICBjb21wYXJlRklUQkFuc3dlcnMoKSB7XG4gICAgdmFyIGRhdGEgPSB7fTtcbiAgICBkYXRhLmRpdl9pZCA9IHRoaXMuZGl2aWQ7XG4gICAgZGF0YS5jb3Vyc2UgPSBlQm9va0NvbmZpZy5jb3Vyc2U7XG4gICAgalF1ZXJ5LmdldChcbiAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9hc3Nlc3NtZW50L2dldHRvcDEwQW5zd2Vyc2AsXG4gICAgICBkYXRhLFxuICAgICAgdGhpcy5jb21wYXJlRklUQlxuICAgICk7XG4gIH1cbiAgY29tcGFyZUZJVEIoZGF0YSwgc3RhdHVzLCB3aGF0ZXZlcikge1xuICAgIHZhciBhbnN3ZXJzID0gZGF0YS5kZXRhaWwucmVzO1xuICAgIHZhciBtaXNjID0gZGF0YS5kZXRhaWwubWlzY2RhdGE7XG4gICAgdmFyIGJvZHkgPSBcIjx0YWJsZT5cIjtcbiAgICBib2R5ICs9IFwiPHRyPjx0aD5BbnN3ZXI8L3RoPjx0aD5Db3VudDwvdGg+PC90cj5cIjtcbiAgICBmb3IgKHZhciByb3cgaW4gYW5zd2Vycykge1xuICAgICAgYm9keSArPVxuICAgICAgICBcIjx0cj48dGQ+XCIgK1xuICAgICAgICBhbnN3ZXJzW3Jvd10uYW5zd2VyICtcbiAgICAgICAgXCI8L3RkPjx0ZD5cIiArXG4gICAgICAgIGFuc3dlcnNbcm93XS5jb3VudCArXG4gICAgICAgIFwiIHRpbWVzPC90ZD48L3RyPlwiO1xuICAgIH1cbiAgICBib2R5ICs9IFwiPC90YWJsZT5cIjtcbiAgICB2YXIgaHRtbCA9XG4gICAgICBcIjxkaXYgY2xhc3M9J21vZGFsIGZhZGUnPlwiICtcbiAgICAgIFwiICAgIDxkaXYgY2xhc3M9J21vZGFsLWRpYWxvZyBjb21wYXJlLW1vZGFsJz5cIiArXG4gICAgICBcIiAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtY29udGVudCc+XCIgK1xuICAgICAgXCIgICAgICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1oZWFkZXInPlwiICtcbiAgICAgIFwiICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzcz0nY2xvc2UnIGRhdGEtZGlzbWlzcz0nbW9kYWwnIGFyaWEtaGlkZGVuPSd0cnVlJz4mdGltZXM7PC9idXR0b24+XCIgK1xuICAgICAgXCIgICAgICAgICAgICAgICAgPGg0IGNsYXNzPSdtb2RhbC10aXRsZSc+VG9wIEFuc3dlcnM8L2g0PlwiICtcbiAgICAgIFwiICAgICAgICAgICAgPC9kaXY+XCIgK1xuICAgICAgXCIgICAgICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1ib2R5Jz5cIiArXG4gICAgICBib2R5ICtcbiAgICAgIFwiICAgICAgICAgICAgPC9kaXY+XCIgK1xuICAgICAgXCIgICAgICAgIDwvZGl2PlwiICtcbiAgICAgIFwiICAgIDwvZGl2PlwiICtcbiAgICAgIFwiPC9kaXY+XCI7XG4gICAgdmFyIGVsID0gJChodG1sKTtcbiAgICBlbC5tb2RhbCgpO1xuICB9XG5cbiAgZGlzYWJsZUludGVyYWN0aW9uKCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmJsYW5rQXJyYXlbaV0uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxufVxuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT0gRmluZCB0aGUgY3VzdG9tIEhUTUwgdGFncyBhbmQgPT1cbj09ICAgZXhlY3V0ZSBvdXIgY29kZSBvbiB0aGVtICAgID09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuJChkb2N1bWVudCkub24oXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuICAkKFwiW2RhdGEtY29tcG9uZW50PWZpbGxpbnRoZWJsYW5rXVwiKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgIHZhciBvcHRzID0ge1xuICAgICAgb3JpZzogdGhpcyxcbiAgICAgIHVzZVJ1bmVzdG9uZVNlcnZpY2VzOiBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyxcbiAgICB9O1xuICAgIGlmICgkKHRoaXMpLmNsb3Nlc3QoXCJbZGF0YS1jb21wb25lbnQ9dGltZWRBc3Nlc3NtZW50XVwiKS5sZW5ndGggPT0gMCkge1xuICAgICAgLy8gSWYgdGhpcyBlbGVtZW50IGV4aXN0cyB3aXRoaW4gYSB0aW1lZCBjb21wb25lbnQsIGRvbid0IHJlbmRlciBpdCBoZXJlXG4gICAgICB0cnkge1xuICAgICAgICBGSVRCTGlzdFt0aGlzLmlkXSA9IG5ldyBGSVRCKG9wdHMpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLFxuICAgICAgICAgIGBFcnJvciByZW5kZXJpbmcgRmlsbCBpbiB0aGUgQmxhbmsgUHJvYmxlbSAke3RoaXMuaWR9XG4gICAgICAgICAgICAgICAgICAgICBEZXRhaWxzOiAke2Vycn1gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiLyovLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5hbGVhUFJORyAxLjFcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuaHR0cHM6Ly9naXRodWIuY29tL21hY21jbWVhbnMvYWxlYVBSTkcvYmxvYi9tYXN0ZXIvYWxlYVBSTkctMS4xLmpzXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbk9yaWdpbmFsIHdvcmsgY29weXJpZ2h0IMKpIDIwMTAgSm9oYW5uZXMgQmFhZ8O4ZSwgdW5kZXIgTUlUIGxpY2Vuc2VcblRoaXMgaXMgYSBkZXJpdmF0aXZlIHdvcmsgY29weXJpZ2h0IChjKSAyMDE3LTIwMjAsIFcuIE1hY1wiIE1jTWVhbnMsIHVuZGVyIEJTRCBsaWNlbnNlLlxuUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0IG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuMy4gTmVpdGhlciB0aGUgbmFtZSBvZiB0aGUgY29weXJpZ2h0IGhvbGRlciBub3IgdGhlIG5hbWVzIG9mIGl0cyBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxuVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBIT0xERVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyovXG5leHBvcnQgZnVuY3Rpb24gYWxlYVBSTkcoKSB7XG4gICAgcmV0dXJuKCBmdW5jdGlvbiggYXJncyApIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgY29uc3QgdmVyc2lvbiA9ICdhbGVhUFJORyAxLjEuMCc7XG5cbiAgICAgICAgdmFyIHMwXG4gICAgICAgICAgICAsIHMxXG4gICAgICAgICAgICAsIHMyXG4gICAgICAgICAgICAsIGNcbiAgICAgICAgICAgICwgdWludGEgPSBuZXcgVWludDMyQXJyYXkoIDMgKVxuICAgICAgICAgICAgLCBpbml0aWFsQXJnc1xuICAgICAgICAgICAgLCBtYXNodmVyID0gJydcbiAgICAgICAgO1xuXG4gICAgICAgIC8qIHByaXZhdGU6IGluaXRpYWxpemVzIGdlbmVyYXRvciB3aXRoIHNwZWNpZmllZCBzZWVkICovXG4gICAgICAgIGZ1bmN0aW9uIF9pbml0U3RhdGUoIF9pbnRlcm5hbFNlZWQgKSB7XG4gICAgICAgICAgICB2YXIgbWFzaCA9IE1hc2goKTtcblxuICAgICAgICAgICAgLy8gaW50ZXJuYWwgc3RhdGUgb2YgZ2VuZXJhdG9yXG4gICAgICAgICAgICBzMCA9IG1hc2goICcgJyApO1xuICAgICAgICAgICAgczEgPSBtYXNoKCAnICcgKTtcbiAgICAgICAgICAgIHMyID0gbWFzaCggJyAnICk7XG5cbiAgICAgICAgICAgIGMgPSAxO1xuXG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IF9pbnRlcm5hbFNlZWQubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgczAgLT0gbWFzaCggX2ludGVybmFsU2VlZFsgaSBdICk7XG4gICAgICAgICAgICAgICAgaWYoIHMwIDwgMCApIHsgczAgKz0gMTsgfVxuXG4gICAgICAgICAgICAgICAgczEgLT0gbWFzaCggX2ludGVybmFsU2VlZFsgaSBdICk7XG4gICAgICAgICAgICAgICAgaWYoIHMxIDwgMCApIHsgczEgKz0gMTsgfVxuXG4gICAgICAgICAgICAgICAgczIgLT0gbWFzaCggX2ludGVybmFsU2VlZFsgaSBdICk7XG4gICAgICAgICAgICAgICAgaWYoIHMyIDwgMCApIHsgczIgKz0gMTsgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXNodmVyID0gbWFzaC52ZXJzaW9uO1xuXG4gICAgICAgICAgICBtYXNoID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwcml2YXRlOiBkZXBlbmRlbnQgc3RyaW5nIGhhc2ggZnVuY3Rpb24gKi9cbiAgICAgICAgZnVuY3Rpb24gTWFzaCgpIHtcbiAgICAgICAgICAgIHZhciBuID0gNDAyMjg3MTE5NzsgLy8gMHhlZmM4MjQ5ZFxuXG4gICAgICAgICAgICB2YXIgbWFzaCA9IGZ1bmN0aW9uKCBkYXRhICkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBjYWNoZSB0aGUgbGVuZ3RoXG4gICAgICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDAsIGwgPSBkYXRhLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcbiAgICAgICAgICAgICAgICAgICAgbiArPSBkYXRhLmNoYXJDb2RlQXQoIGkgKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgaCA9IDAuMDI1MTk2MDMyODI0MTY5MzggKiBuO1xuXG4gICAgICAgICAgICAgICAgICAgIG4gID0gaCA+Pj4gMDtcbiAgICAgICAgICAgICAgICAgICAgaCAtPSBuO1xuICAgICAgICAgICAgICAgICAgICBoICo9IG47XG4gICAgICAgICAgICAgICAgICAgIG4gID0gaCA+Pj4gMDtcbiAgICAgICAgICAgICAgICAgICAgaCAtPSBuO1xuICAgICAgICAgICAgICAgICAgICBuICs9IGggKiA0Mjk0OTY3Mjk2OyAvLyAweDEwMDAwMDAwMCAgICAgIDJeMzJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuICggbiA+Pj4gMCApICogMi4zMjgzMDY0MzY1Mzg2OTYzZS0xMDsgLy8gMl4tMzJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIG1hc2gudmVyc2lvbiA9ICdNYXNoIDAuOSc7XG4gICAgICAgICAgICByZXR1cm4gbWFzaDtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qIHByaXZhdGU6IGNoZWNrIGlmIG51bWJlciBpcyBpbnRlZ2VyICovXG4gICAgICAgIGZ1bmN0aW9uIF9pc0ludGVnZXIoIF9pbnQgKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoIF9pbnQsIDEwICkgPT09IF9pbnQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiByZXR1cm4gYSAzMi1iaXQgZnJhY3Rpb24gaW4gdGhlIHJhbmdlIFswLCAxXVxuICAgICAgICBUaGlzIGlzIHRoZSBtYWluIGZ1bmN0aW9uIHJldHVybmVkIHdoZW4gYWxlYVBSTkcgaXMgaW5zdGFudGlhdGVkXG4gICAgICAgICovXG4gICAgICAgIHZhciByYW5kb20gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0ID0gMjA5MTYzOSAqIHMwICsgYyAqIDIuMzI4MzA2NDM2NTM4Njk2M2UtMTA7IC8vIDJeLTMyXG5cbiAgICAgICAgICAgIHMwID0gczE7XG4gICAgICAgICAgICBzMSA9IHMyO1xuXG4gICAgICAgICAgICByZXR1cm4gczIgPSB0IC0gKCBjID0gdCB8IDAgKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHJldHVybiBhIDUzLWJpdCBmcmFjdGlvbiBpbiB0aGUgcmFuZ2UgWzAsIDFdICovXG4gICAgICAgIHJhbmRvbS5mcmFjdDUzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmFuZG9tKCkgKyAoIHJhbmRvbSgpICogMHgyMDAwMDAgIHwgMCApICogMS4xMTAyMjMwMjQ2MjUxNTY1ZS0xNjsgLy8gMl4tNTNcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHJldHVybiBhbiB1bnNpZ25lZCBpbnRlZ2VyIGluIHRoZSByYW5nZSBbMCwgMl4zMl0gKi9cbiAgICAgICAgcmFuZG9tLmludDMyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmFuZG9tKCkgKiAweDEwMDAwMDAwMDsgLy8gMl4zMlxuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogYWR2YW5jZSB0aGUgZ2VuZXJhdG9yIHRoZSBzcGVjaWZpZWQgYW1vdW50IG9mIGN5Y2xlcyAqL1xuICAgICAgICByYW5kb20uY3ljbGUgPSBmdW5jdGlvbiggX3J1biApIHtcbiAgICAgICAgICAgIF9ydW4gPSB0eXBlb2YgX3J1biA9PT0gJ3VuZGVmaW5lZCcgPyAxIDogK19ydW47XG4gICAgICAgICAgICBpZiggX3J1biA8IDEgKSB7IF9ydW4gPSAxOyB9XG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IF9ydW47IGkrKyApIHsgcmFuZG9tKCk7IH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHJldHVybiBpbmNsdXNpdmUgcmFuZ2UgKi9cbiAgICAgICAgcmFuZG9tLnJhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgbG9Cb3VuZFxuICAgICAgICAgICAgICAgICwgaGlCb3VuZFxuICAgICAgICAgICAgO1xuXG4gICAgICAgICAgICBpZiggYXJndW1lbnRzLmxlbmd0aCA9PT0gMSApIHtcbiAgICAgICAgICAgICAgICBsb0JvdW5kID0gMDtcbiAgICAgICAgICAgICAgICBoaUJvdW5kID0gYXJndW1lbnRzWyAwIF07XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9Cb3VuZCA9IGFyZ3VtZW50c1sgMCBdO1xuICAgICAgICAgICAgICAgIGhpQm91bmQgPSBhcmd1bWVudHNbIDEgXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIGFyZ3VtZW50c1sgMCBdID4gYXJndW1lbnRzWyAxIF0gKSB7XG4gICAgICAgICAgICAgICAgbG9Cb3VuZCA9IGFyZ3VtZW50c1sgMSBdO1xuICAgICAgICAgICAgICAgIGhpQm91bmQgPSBhcmd1bWVudHNbIDAgXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcmV0dXJuIGludGVnZXJcbiAgICAgICAgICAgIGlmKCBfaXNJbnRlZ2VyKCBsb0JvdW5kICkgJiYgX2lzSW50ZWdlciggaGlCb3VuZCApICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKCByYW5kb20oKSAqICggaGlCb3VuZCAtIGxvQm91bmQgKyAxICkgKSArIGxvQm91bmQ7XG5cbiAgICAgICAgICAgIC8vIHJldHVybiBmbG9hdFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmFuZG9tKCkgKiAoIGhpQm91bmQgLSBsb0JvdW5kICkgKyBsb0JvdW5kO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogaW5pdGlhbGl6ZSBnZW5lcmF0b3Igd2l0aCB0aGUgc2VlZCB2YWx1ZXMgdXNlZCB1cG9uIGluc3RhbnRpYXRpb24gKi9cbiAgICAgICAgcmFuZG9tLnJlc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIF9pbml0U3RhdGUoIGluaXRpYWxBcmdzICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiBzZWVkaW5nIGZ1bmN0aW9uICovXG4gICAgICAgIHJhbmRvbS5zZWVkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBfaW5pdFN0YXRlKCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICkgKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHNob3cgdGhlIHZlcnNpb24gb2YgdGhlIFJORyAqL1xuICAgICAgICByYW5kb20udmVyc2lvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZlcnNpb247XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiBzaG93IHRoZSB2ZXJzaW9uIG9mIHRoZSBSTkcgYW5kIHRoZSBNYXNoIHN0cmluZyBoYXNoZXIgKi9cbiAgICAgICAgcmFuZG9tLnZlcnNpb25zID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdmVyc2lvbiArICcsICcgKyBtYXNodmVyO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIHdoZW4gbm8gc2VlZCBpcyBzcGVjaWZpZWQsIGNyZWF0ZSBhIHJhbmRvbSBvbmUgZnJvbSBXaW5kb3dzIENyeXB0byAoTW9udGUgQ2FybG8gYXBwbGljYXRpb24pXG4gICAgICAgIGlmKCBhcmdzLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgICB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyggdWludGEgKTtcbiAgICAgICAgICAgICBhcmdzID0gWyB1aW50YVsgMCBdLCB1aW50YVsgMSBdLCB1aW50YVsgMiBdIF07XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gc3RvcmUgdGhlIHNlZWQgdXNlZCB3aGVuIHRoZSBSTkcgd2FzIGluc3RhbnRpYXRlZCwgaWYgYW55XG4gICAgICAgIGluaXRpYWxBcmdzID0gYXJncztcblxuICAgICAgICAvLyBpbml0aWFsaXplIHRoZSBSTkdcbiAgICAgICAgX2luaXRTdGF0ZSggYXJncyApO1xuXG4gICAgICAgIHJldHVybiByYW5kb207XG5cbiAgICB9KSggQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApICk7XG59OyIsImltcG9ydCBGSVRCIGZyb20gXCIuL2ZpdGIuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVkRklUQiBleHRlbmRzIEZJVEIge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHRoaXMucmVuZGVyVGltZWRJY29uKHRoaXMuaW5wdXREaXYpO1xuICAgICAgICB0aGlzLmhpZGVCdXR0b25zKCk7XG4gICAgICAgIHRoaXMubmVlZHNSZWluaXRpYWxpemF0aW9uID0gdHJ1ZTtcbiAgICB9XG4gICAgaGlkZUJ1dHRvbnMoKSB7XG4gICAgICAgICQodGhpcy5zdWJtaXRCdXR0b24pLmhpZGUoKTtcbiAgICAgICAgJCh0aGlzLmNvbXBhcmVCdXR0b24pLmhpZGUoKTtcbiAgICB9XG4gICAgcmVuZGVyVGltZWRJY29uKGNvbXBvbmVudCkge1xuICAgICAgICAvLyByZW5kZXJzIHRoZSBjbG9jayBpY29uIG9uIHRpbWVkIGNvbXBvbmVudHMuICAgIFRoZSBjb21wb25lbnQgcGFyYW1ldGVyXG4gICAgICAgIC8vIGlzIHRoZSBlbGVtZW50IHRoYXQgdGhlIGljb24gc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuICAgICAgICB2YXIgdGltZUljb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2YXIgdGltZUljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICAkKHRpbWVJY29uKS5hdHRyKHtcbiAgICAgICAgICAgIHNyYzogXCIuLi9fc3RhdGljL2Nsb2NrLnBuZ1wiLFxuICAgICAgICAgICAgc3R5bGU6IFwid2lkdGg6MTVweDtoZWlnaHQ6MTVweFwiLFxuICAgICAgICB9KTtcbiAgICAgICAgdGltZUljb25EaXYuY2xhc3NOYW1lID0gXCJ0aW1lVGlwXCI7XG4gICAgICAgIHRpbWVJY29uRGl2LnRpdGxlID0gXCJcIjtcbiAgICAgICAgdGltZUljb25EaXYuYXBwZW5kQ2hpbGQodGltZUljb24pO1xuICAgICAgICAkKGNvbXBvbmVudCkucHJlcGVuZCh0aW1lSWNvbkRpdik7XG4gICAgfVxuICAgIGNoZWNrQ29ycmVjdFRpbWVkKCkge1xuICAgICAgICAvLyBSZXR1cm5zIGlmIHRoZSBxdWVzdGlvbiB3YXMgY29ycmVjdCwgaW5jb3JyZWN0LCBvciBza2lwcGVkIChyZXR1cm4gbnVsbCBpbiB0aGUgbGFzdCBjYXNlKVxuICAgICAgICBzd2l0Y2ggKHRoaXMuY29ycmVjdCkge1xuICAgICAgICAgICAgY2FzZSB0cnVlOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIlRcIjtcbiAgICAgICAgICAgIGNhc2UgZmFsc2U6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiRlwiO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBoaWRlRmVlZGJhY2soKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAkKHRoaXMuYmxhbmtBcnJheVtpXSkucmVtb3ZlQ2xhc3MoXCJpbnB1dC12YWxpZGF0aW9uLWVycm9yXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cblxuICAgIHJlaW5pdGlhbGl6ZUxpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5zZXR1cEJsYW5rcygpO1xuICAgIH1cbn1cblxuaWYgKHR5cGVvZiB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPSB7fTtcbn1cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeS5maWxsaW50aGVibGFuayA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgaWYgKG9wdHMudGltZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW1lZEZJVEIob3B0cyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgRklUQihvcHRzKTtcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=