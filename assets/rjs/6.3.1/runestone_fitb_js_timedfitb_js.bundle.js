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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2ZpdGJfanNfdGltZWRmaXRiX2pzLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7Ozs7O0FDUEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkQ7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRXFDOztBQUVsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLHVCQUF1QjtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsWUFBWSxNQUFNO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEseVdBQXlXO0FBQ3pXO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLCtEQUFROztBQUV6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLElBQUksVUFBVSxXQUFXO0FBQy9DO0FBQ0E7QUFDQSx3QkFBd0IsMkJBQTJCO0FBQ25EO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLG9DQUFvQyxPQUFPO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTix5REFBeUQsT0FBTztBQUNoRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUCxzQ0FBc0MseUJBQXlCO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixzQkFBc0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdCQUFnQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLFlBQVkseUJBQXlCO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQSxrTUFBa007QUFDbE07QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtSkFBbUo7QUFDbko7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLG1DQUFtQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLGlFQUFpRSxNQUFNO0FBQ3ZFO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9GQUFvRjtBQUNwRjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDRCQUE0QjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsZ0RBQUk7QUFDbkIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvY3NzL2ZpdGIuY3NzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLWkxOG4uZW4uanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2pzL2ZpdGItaTE4bi5wdC1ici5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvZml0Yi11dGlscy5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvZml0Yi5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvbGlicy9hbGVhUFJORy0xLjEuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2pzL3RpbWVkZml0Yi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIkLmkxOG4oKS5sb2FkKHtcbiAgICBlbjoge1xuICAgICAgICBtc2dfbm9fYW5zd2VyOiBcIk5vIGFuc3dlciBwcm92aWRlZC5cIixcbiAgICAgICAgbXNnX2ZpdGJfY2hlY2tfbWU6IFwiQ2hlY2sgbWVcIixcbiAgICAgICAgbXNnX2ZpdGJfY29tcGFyZV9tZTogXCJDb21wYXJlIG1lXCIsXG4gICAgICAgIG1zZ19maXRiX3JhbmRvbWl6ZTogXCJSYW5kb21pemVcIlxuICAgIH0sXG59KTtcbiIsIiQuaTE4bigpLmxvYWQoe1xuICAgIFwicHQtYnJcIjoge1xuICAgICAgICBtc2dfbm9fYW5zd2VyOiBcIk5lbmh1bWEgcmVzcG9zdGEgZGFkYS5cIixcbiAgICAgICAgbXNnX2ZpdGJfY2hlY2tfbWU6IFwiVmVyaWZpY2FyXCIsXG4gICAgICAgIG1zZ19maXRiX2NvbXBhcmVfbWU6IFwiQ29tcGFyYXJcIlxuICAgIH0sXG59KTtcbiIsIi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyB8ZG9jbmFtZXwgLSBncmFkaW5nLXJlbGF0ZWQgdXRpbGl0aWVzIGZvciBGSVRCIHF1ZXN0aW9uc1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIFRoaXMgY29kZSBydW5zIGJvdGggb24gdGhlIHNlcnZlciAoZm9yIHNlcnZlci1zaWRlIGdyYWRpbmcpIGFuZCBvbiB0aGUgY2xpZW50LiBJdCdzIHBsYWNlZCBoZXJlIGFzIGEgc2V0IG9mIGZ1bmN0aW9ucyBzcGVjaWZpY2FsbHkgZm9yIHRoaXMgcHVycG9zZS5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCB7IGFsZWFQUk5HIH0gZnJvbSBcIi4vbGlicy9hbGVhUFJORy0xLjEuanNcIjtcblxuLy8gSW5jbHVkZXNcbi8vID09PT09PT09XG4vLyBOb25lLlxuLy9cbi8vXG4vLyBHbG9iYWxzXG4vLyA9PT09PT09XG5mdW5jdGlvbiByZW5kZXJfaHRtbChodG1sX2luLCBkeW5fdmFyc19ldmFsKSB7XG4gICAgLy8gQ2hhbmdlIHRoZSByZXBsYWNlbWVudCB0b2tlbnMgaW4gdGhlIEhUTUwgaW50byB0YWdzLCBzbyB3ZSBjYW4gcmVwbGFjZSB0aGVtIHVzaW5nIFhNTC4gVGhlIGhvcnJpYmxlIHJlZ2V4IGlzOlxuICAgIC8vXG4gICAgLy8gTG9vayBmb3IgdGhlIGNoYXJhY3RlcnMgYGBbJT1gYCAodGhlIG9wZW5pbmcgZGVsaW1pdGVyKVxuICAgIC8vLyBcXFslPVxuICAgIC8vIEZvbGxvd2VkIGJ5IGFueSBhbW91bnQgb2Ygd2hpdGVzcGFjZS5cbiAgICAvLy8gXFxzKlxuICAgIC8vIFN0YXJ0IGEgZ3JvdXAgdGhhdCB3aWxsIGNhcHR1cmUgdGhlIGNvbnRlbnRzIChleGNsdWRpbmcgd2hpdGVzcGFjZSkgb2YgdGhlIHRva2Vucy4gRm9yIGV4YW1wbGUsIGdpdmVuIGBgWyU9IGZvbygpICVdYGAsIHRoZSBjb250ZW50cyBpcyBgYGZvbygpYGAuXG4gICAgLy8vIChcbiAgICAvLyBEb24ndCBjYXB0dXJlIHRoZSBjb250ZW50cyBvZiB0aGlzIGdyb3VwLCBzaW5jZSBpdCdzIG9ubHkgYSBzaW5nbGUgY2hhcmFjdGVyLiBNYXRjaCBhbnkgY2hhcmFjdGVyLi4uXG4gICAgLy8vIChcbiAgICAvLy8gPzouXG4gICAgLy8vIC4uLnRoYXQgZG9lc24ndCBlbmQgd2l0aCBgYCVdYGAgKHRoZSBjbG9zaW5nIGRlbGltaXRlcikuXG4gICAgLy8vICg/ISVdKVxuICAgIC8vLyApXG4gICAgLy8gTWF0Y2ggdGhpcyAoYW55dGhpbmcgYnV0IHRoZSBjbG9zaW5nIGRlbGltaXRlcikgYXMgbXVjaCBhcyB3ZSBjYW4uXG4gICAgLy8vICopXG4gICAgLy8gTmV4dCwgbG9vayBmb3IgYW55IHdoaXRlc3BhY2UuXG4gICAgLy8vIFxccypcbiAgICAvLyBGaW5hbGx5LCBsb29rIGZvciB0aGUgY2xvc2luZyBkZWxpbWl0ZXIgYGAlXWBgLlxuICAgIC8vLyAlXFxdXG4gICAgY29uc3QgaHRtbF9yZXBsYWNlZCA9IGh0bWxfaW4ucmVwbGFjZUFsbChcbiAgICAgICAgL1xcWyU9XFxzKigoPzouKD8hJV0pKSopXFxzKiVcXF0vZyxcbiAgICAgICAgLy8gUmVwbGFjZSBpdCB3aXRoIGEgYDxzY3JpcHQtZXZhbD5gIHRhZy4gUXVvdGUgdGhlIHN0cmluZywgd2hpY2ggd2lsbCBhdXRvbWF0aWNhbGx5IGVzY2FwZSBhbnkgZG91YmxlIHF1b3RlcywgdXNpbmcgSlNPTi5cbiAgICAgICAgKG1hdGNoLCBncm91cDEpID0+XG4gICAgICAgICAgICBgPHNjcmlwdC1ldmFsIGV4cHI9JHtKU09OLnN0cmluZ2lmeShncm91cDEpfT48L3NjcmlwdC1ldmFsPmBcbiAgICApO1xuICAgIC8vIEdpdmVuIEhUTUwsIHR1cm4gaXQgaW50byBhIERPTS4gV2FsayB0aGUgYGA8c2NyaXB0LWV2YWw+YGAgdGFncywgcGVyZm9ybWluZyB0aGUgcmVxdWVzdGVkIGV2YWx1YXRpb24gb24gdGhlbS5cbiAgICAvL1xuICAgIC8vIFNlZSBgRE9NUGFyc2VyIDxodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRE9NUGFyc2VyPmBfLlxuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbiAgICAvLyBTZWUgYERPTVBhcnNlci5wYXJzZUZyb21TdHJpbmcoKSA8aHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0RPTVBhcnNlci9wYXJzZUZyb21TdHJpbmc+YF8uXG4gICAgY29uc3QgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhodG1sX3JlcGxhY2VkLCBcInRleHQvaHRtbFwiKTtcbiAgICBjb25zdCBzY3JpcHRfZXZhbF90YWdzID0gZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0LWV2YWxcIik7XG4gICAgd2hpbGUgKHNjcmlwdF9ldmFsX3RhZ3MubGVuZ3RoKSB7XG4gICAgICAgIC8vIEdldCB0aGUgZmlyc3QgdGFnLiBJdCB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgY29sbGVjdGlvbiBhZnRlciBpdCdzIHJlcGxhY2VkIHdpdGggaXRzIHZhbHVlLlxuICAgICAgICBjb25zdCBzY3JpcHRfZXZhbF90YWcgPSBzY3JpcHRfZXZhbF90YWdzWzBdO1xuICAgICAgICAvLyBTZWUgaWYgdGhpcyBgYDxzY3JpcHQtZXZhbD5gYCB0YWcgaGFzIGFzIGBgQGV4cHJgYCBhdHRyaWJ1dGUuXG4gICAgICAgIGNvbnN0IGV4cHIgPSBzY3JpcHRfZXZhbF90YWcuZ2V0QXR0cmlidXRlKFwiZXhwclwiKTtcbiAgICAgICAgLy8gSWYgc28sIGV2YWx1YXRlIGl0LlxuICAgICAgICBpZiAoZXhwcikge1xuICAgICAgICAgICAgY29uc3QgZXZhbF9yZXN1bHQgPSB3aW5kb3cuRnVuY3Rpb24oXG4gICAgICAgICAgICAgICAgXCJ2XCIsXG4gICAgICAgICAgICAgICAgLi4uT2JqZWN0LmtleXMoZHluX3ZhcnNfZXZhbCksXG4gICAgICAgICAgICAgICAgYFwidXNlIHN0cmljdDtcIlxcbnJldHVybiAke2V4cHJ9O2BcbiAgICAgICAgICAgICkoZHluX3ZhcnNfZXZhbCwgLi4uT2JqZWN0LnZhbHVlcyhkeW5fdmFyc19ldmFsKSk7XG4gICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSB0YWcgd2l0aCB0aGUgcmVzdWx0aW5nIHZhbHVlLlxuICAgICAgICAgICAgc2NyaXB0X2V2YWxfdGFnLnJlcGxhY2VXaXRoKGV2YWxfcmVzdWx0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiB0aGUgYm9keSBjb250ZW50cy4gTm90ZSB0aGF0IHRoZSBgYERPTVBhcnNlcmBgIGNvbnN0cnVjdHMgYW4gZW50aXJlIGRvY3VtZW50LCBub3QganVzdCB0aGUgZG9jdW1lbnQgZnJhZ21lbnQgd2UgcGFzc2VkIGl0LiBUaGVyZWZvcmUsIGV4dHJhY3QgdGhlIGRlc2lyZWQgZnJhZ21lbnQgYW5kIHJldHVybiB0aGF0LiBOb3RlIHRoYXQgd2UgbmVlZCB0byB1c2UgYGNoaWxkTm9kZXMgPGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlL2NoaWxkTm9kZXM+YF8sIHdoaWNoIGluY2x1ZGVzIG5vbi1lbGVtZW50IGNoaWxkcmVuIGxpa2UgdGV4dCBhbmQgY29tbWVudHM7IHVzaW5nIGBgY2hpbGRyZW5gYCBvbWl0cyB0aGVzZSBub24tZWxlbWVudCBjaGlsZHJlbi5cbiAgICByZXR1cm4gZG9jLmJvZHkuY2hpbGROb2Rlcztcbn1cblxuLy8gRnVuY3Rpb25zXG4vLyA9PT09PT09PT1cbi8vIFVwZGF0ZSB0aGUgcHJvYmxlbSdzIGRlc2NyaXB0aW9uIGJhc2VkIG9uIGR5bmFtaWNhbGx5LWdlbmVyYXRlZCBjb250ZW50LlxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckR5bmFtaWNDb250ZW50KFxuICAgIHNlZWQsXG4gICAgZHluX3ZhcnMsXG4gICAgZHluX2ltcG9ydHMsXG4gICAgaHRtbF9pbixcbiAgICBkaXZpZCxcbiAgICBwcmVwYXJlQ2hlY2tBbnN3ZXJzXG4pIHtcbiAgICAvLyBJbml0aWFsaXplIFJORyB3aXRoIGBgc2VlZGBgLlxuICAgIGNvbnN0IHJhbmQgPSBhbGVhUFJORyhzZWVkKTtcblxuICAgIC8vIFNlZSBgUkFORF9GVU5DIDxSQU5EX0ZVTkM+YF8sIHdoaWNoIHJlZmVycyB0byBgYHJhbmRgYCBhYm92ZS5cbiAgICBjb25zdCBkeW5fdmFyc19ldmFsID0gd2luZG93LkZ1bmN0aW9uKFxuICAgICAgICBcInZcIixcbiAgICAgICAgXCJyYW5kXCIsXG4gICAgICAgIC4uLk9iamVjdC5rZXlzKGR5bl9pbXBvcnRzKSxcbiAgICAgICAgYFwidXNlIHN0cmljdFwiO1xcbiR7ZHluX3ZhcnN9O1xcbnJldHVybiB2O2BcbiAgICApKFxuICAgICAgICAvLyBXZSB3YW50IHYuZGl2aWQgPSBkaXZpZCBhbmQgdi5wcmVwYXJlQ2hlY2tBbnN3ZXJzID0gcHJlcGFyZUNoZWNrQW5zd2Vycy4gSW4gY29udHJhc3QsIHRoZSBrZXkvdmFsdWVzIHBhaXJzIG9mIGR5bl9pbXBvcnRzIHNob3VsZCBiZSBkaXJlY3RseSBhc3NpZ25lZCB0byB2LCBoZW5jZSB0aGUgT2JqZWN0LmFzc2lnbi5cbiAgICAgICAgT2JqZWN0LmFzc2lnbih7IGRpdmlkLCBwcmVwYXJlQ2hlY2tBbnN3ZXJzfSwgZHluX2ltcG9ydHMpLFxuICAgICAgICByYW5kLFxuICAgICAgICAvLyBJbiBhZGRpdGlvbiB0byBwcm92aWRpbmcgdGhpcyBpbiB2LCBtYWtlIGl0IGF2YWlsYWJsZSBpbiB0aGUgZnVuY3Rpb24gYXMgd2VsbCwgc2luY2UgbW9zdCBwcm9ibGVtIGF1dGhvcnMgd2lsbCB3cml0ZSBgYGZvbyA9IG5ldyBCVE0oKWBgIChmb3IgZXhhbXBsZSwgYXNzdW1pbmcgQlRNIGlzIGluIGR5bl9pbXBvcnRzKSBpbnN0ZWFkIG9mIGBgZm9vID0gbmV3IHYuQlRNKClgYCAod2hpY2ggaXMgdW51c3VhbCBzeW50YXgpLlxuICAgICAgICAuLi5PYmplY3QudmFsdWVzKGR5bl9pbXBvcnRzKSk7XG5cbiAgICBsZXQgaHRtbF9vdXQ7XG4gICAgaWYgKHR5cGVvZiBkeW5fdmFyc19ldmFsLmJlZm9yZUNvbnRlbnRSZW5kZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZHluX3ZhcnNfZXZhbC5iZWZvcmVDb250ZW50UmVuZGVyKGR5bl92YXJzX2V2YWwpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLFxuICAgICAgICAgICAgICAgIGBFcnJvciBpbiBwcm9ibGVtICR7ZGl2aWR9IGludm9raW5nIGJlZm9yZUNvbnRlbnRSZW5kZXJgXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGh0bWxfb3V0ID0gcmVuZGVyX2h0bWwoaHRtbF9pbiwgZHluX3ZhcnNfZXZhbCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLCBgRXJyb3IgcmVuZGVyaW5nIHByb2JsZW0gJHtkaXZpZH0gdGV4dC5gKTtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgIH1cblxuICAgIC8vIHRoZSBhZnRlckNvbnRlbnRSZW5kZXIgZXZlbnQgd2lsbCBiZSBjYWxsZWQgYnkgdGhlIGNhbGxlciBvZiB0aGlzIGZ1bmN0aW9uIChhZnRlciBpdCB1cGRhdGVkIHRoZSBIVE1MIGJhc2VkIG9uIHRoZSBjb250ZW50cyBvZiBodG1sX291dCkuXG4gICAgcmV0dXJuIFtodG1sX291dCwgZHluX3ZhcnNfZXZhbF07XG59XG5cbi8vIEdpdmVuIHN0dWRlbnQgYW5zd2VycywgZ3JhZGUgdGhlbSBhbmQgcHJvdmlkZSBmZWVkYmFjay5cbi8vXG4vLyBPdXRwdXRzOlxuLy9cbi8vIC0gICAgYGBkaXNwbGF5RmVlZGBgIGlzIGFuIGFycmF5IG9mIEhUTUwgZmVlZGJhY2suXG4vLyAtICAgIGBgaXNDb3JyZWN0QXJyYXlgYCBpcyBhbiBhcnJheSBvZiB0cnVlLCBmYWxzZSwgb3IgbnVsbCAodGhlIHF1ZXN0aW9uIHdhc24ndCBhbnN3ZXJlZCkuXG4vLyAtICAgIGBgY29ycmVjdGBgIGlzIHRydWUsIGZhbHNlLCBvciBudWxsICh0aGUgcXVlc3Rpb24gd2Fzbid0IGFuc3dlcmVkKS5cbi8vIC0gICAgYGBwZXJjZW50YGAgaXMgdGhlIHBlcmNlbnRhZ2Ugb2YgY29ycmVjdCBhbnN3ZXJzIChmcm9tIDAgdG8gMSwgbm90IDAgdG8gMTAwKS5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja0Fuc3dlcnNDb3JlKFxuICAgIC8vIF9gYmxhbmtOYW1lc0RpY3RgOiBBbiBkaWN0IG9mIHtibGFua19uYW1lLCBibGFua19pbmRleH0gc3BlY2lmeWluZyB0aGUgbmFtZSBmb3IgZWFjaCBuYW1lZCBibGFuay5cbiAgICBibGFua05hbWVzRGljdCxcbiAgICAvLyBfYGdpdmVuX2FycmA6IEFuIGFycmF5IG9mIHN0cmluZ3MgY29udGFpbmluZyBzdHVkZW50LXByb3ZpZGVkIGFuc3dlcnMgZm9yIGVhY2ggYmxhbmsuXG4gICAgZ2l2ZW5fYXJyLFxuICAgIC8vIEEgMi1EIGFycmF5IG9mIHN0cmluZ3MgZ2l2aW5nIGZlZWRiYWNrIGZvciBlYWNoIGJsYW5rLlxuICAgIGZlZWRiYWNrQXJyYXksXG4gICAgLy8gX2BkeW5fdmFyc19ldmFsYDogQSBkaWN0IHByb2R1Y2VkIGJ5IGV2YWx1YXRpbmcgdGhlIEphdmFTY3JpcHQgZm9yIGEgZHluYW1pYyBleGVyY2lzZS5cbiAgICBkeW5fdmFyc19ldmFsXG4pIHtcbiAgICBpZiAoXG4gICAgICAgIGR5bl92YXJzX2V2YWwgJiZcbiAgICAgICAgdHlwZW9mIGR5bl92YXJzX2V2YWwuYmVmb3JlQ2hlY2tBbnN3ZXJzID09PSBcImZ1bmN0aW9uXCJcbiAgICApIHtcbiAgICAgICAgY29uc3QgW25hbWVkQmxhbmtWYWx1ZXMsIGdpdmVuX2Fycl9jb252ZXJ0ZWRdID0gcGFyc2VBbnN3ZXJzKFxuICAgICAgICAgICAgYmxhbmtOYW1lc0RpY3QsXG4gICAgICAgICAgICBnaXZlbl9hcnIsXG4gICAgICAgICAgICBkeW5fdmFyc19ldmFsXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGR2ZV9ibGFua3MgPSBPYmplY3QuYXNzaWduKHt9LCBkeW5fdmFyc19ldmFsLCBuYW1lZEJsYW5rVmFsdWVzKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWwuYmVmb3JlQ2hlY2tBbnN3ZXJzKGR2ZV9ibGFua3MsIGdpdmVuX2Fycl9jb252ZXJ0ZWQpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLCBcIkVycm9yIGNhbGxpbmcgYmVmb3JlQ2hlY2tBbnN3ZXJzXCIpO1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gS2VlcCB0cmFjayBpZiBhbGwgYW5zd2VycyBhcmUgY29ycmVjdCBvciBub3QuXG4gICAgbGV0IGNvcnJlY3QgPSB0cnVlO1xuICAgIGNvbnN0IGlzQ29ycmVjdEFycmF5ID0gW107XG4gICAgY29uc3QgZGlzcGxheUZlZWQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdpdmVuX2Fyci5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBnaXZlbiA9IGdpdmVuX2FycltpXTtcbiAgICAgICAgLy8gSWYgdGhpcyBibGFuayBpcyBlbXB0eSwgcHJvdmlkZSBubyBmZWVkYmFjayBmb3IgaXQuXG4gICAgICAgIGlmIChnaXZlbiA9PT0gXCJcIikge1xuICAgICAgICAgICAgaXNDb3JyZWN0QXJyYXkucHVzaChudWxsKTtcbiAgICAgICAgICAgIC8vIFRPRE86IHdhcyAkLmkxOG4oXCJtc2dfbm9fYW5zd2VyXCIpLlxuICAgICAgICAgICAgZGlzcGxheUZlZWQucHVzaChcIk5vIGFuc3dlciBwcm92aWRlZC5cIik7XG4gICAgICAgICAgICBjb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBMb29rIHRocm91Z2ggYWxsIGZlZWRiYWNrIGZvciB0aGlzIGJsYW5rLiBUaGUgbGFzdCBlbGVtZW50IGluIHRoZSBhcnJheSBhbHdheXMgbWF0Y2hlcy4gSWYgbm8gZmVlZGJhY2sgZm9yIHRoaXMgYmxhbmsgZXhpc3RzLCB1c2UgYW4gZW1wdHkgbGlzdC5cbiAgICAgICAgICAgIGNvbnN0IGZibCA9IGZlZWRiYWNrQXJyYXlbaV0gfHwgW107XG4gICAgICAgICAgICBsZXQgajtcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBmYmwubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgbGFzdCBpdGVtIG9mIGZlZWRiYWNrIGFsd2F5cyBtYXRjaGVzLlxuICAgICAgICAgICAgICAgIGlmIChqID09PSBmYmwubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKGZibFtqXVtcImZlZWRiYWNrXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgYSBkeW5hbWljIHNvbHV0aW9uLi4uXG4gICAgICAgICAgICAgICAgaWYgKGR5bl92YXJzX2V2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW25hbWVkQmxhbmtWYWx1ZXMsIGdpdmVuX2Fycl9jb252ZXJ0ZWRdID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlQW5zd2VycyhibGFua05hbWVzRGljdCwgZ2l2ZW5fYXJyLCBkeW5fdmFyc19ldmFsKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgd2FzIGEgcGFyc2UgZXJyb3IsIHRoZW4gaXQgc3R1ZGVudCdzIGFuc3dlciBpcyBpbmNvcnJlY3QuXG4gICAgICAgICAgICAgICAgICAgIGlmIChnaXZlbl9hcnJfY29udmVydGVkW2ldIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKGdpdmVuX2Fycl9jb252ZXJ0ZWRbaV0ubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDb3VudCB0aGlzIGFzIHdyb25nIGJ5IG1ha2luZyBqICE9IDAgLS0gc2VlIHRoZSBjb2RlIHRoYXQgcnVucyBpbW1lZGlhdGVseSBhZnRlciB0aGUgZXhlY3V0aW5nIHRoZSBicmVhay5cbiAgICAgICAgICAgICAgICAgICAgICAgIGogPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGEgZnVuY3Rpb24gdG8gd3JhcCB0aGUgZXhwcmVzc2lvbiB0byBldmFsdWF0ZS4gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0Z1bmN0aW9uL0Z1bmN0aW9uLlxuICAgICAgICAgICAgICAgICAgICAvLyBQYXNzIHRoZSBhbnN3ZXIsIGFycmF5IG9mIGFsbCBhbnN3ZXJzLCB0aGVuIGFsbCBlbnRyaWVzIGluIGBgdGhpcy5keW5fdmFyc19ldmFsYGAgZGljdCBhcyBmdW5jdGlvbiBwYXJhbWV0ZXJzLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc19lcXVhbCA9IHdpbmRvdy5GdW5jdGlvbihcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYW5zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFuc19hcnJheVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uT2JqZWN0LmtleXMoZHluX3ZhcnNfZXZhbCksXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5PYmplY3Qua2V5cyhuYW1lZEJsYW5rVmFsdWVzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGBcInVzZSBzdHJpY3Q7XCJcXG5yZXR1cm4gJHtmYmxbal1bXCJzb2x1dGlvbl9jb2RlXCJdfTtgXG4gICAgICAgICAgICAgICAgICAgICkoXG4gICAgICAgICAgICAgICAgICAgICAgICBnaXZlbl9hcnJfY29udmVydGVkW2ldLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2l2ZW5fYXJyX2NvbnZlcnRlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLk9iamVjdC52YWx1ZXMoZHluX3ZhcnNfZXZhbCksXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5PYmplY3QudmFsdWVzKG5hbWVkQmxhbmtWYWx1ZXMpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHN0dWRlbnQncyBhbnN3ZXIgaXMgZXF1YWwgdG8gdGhpcyBpdGVtLCB0aGVuIGFwcGVuZCB0aGlzIGl0ZW0ncyBmZWVkYmFjay5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzX2VxdWFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBpc19lcXVhbCA9PT0gXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGlzX2VxdWFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZmJsW2pdW1wiZmVlZGJhY2tcIl1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgYSByZWdleHAuLi5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFwicmVnZXhcIiBpbiBmYmxbal0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdHQgPSBSZWdFeHAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmJsW2pdW1wicmVnZXhcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmJsW2pdW1wicmVnZXhGbGFnc1wiXVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXR0LnRlc3QoZ2l2ZW4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheUZlZWQucHVzaChmYmxbal1bXCJmZWVkYmFja1wiXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIGEgbnVtYmVyLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoXCJudW1iZXJcIiBpbiBmYmxbal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgW21pbiwgbWF4XSA9IGZibFtqXVtcIm51bWJlclwiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgdGhlIGdpdmVuIHN0cmluZyB0byBhIG51bWJlci4gV2hpbGUgdGhlcmUgYXJlIGBsb3RzIG9mIHdheXMgPGh0dHBzOi8vY29kZXJ3YWxsLmNvbS9wLzV0bGhtdy9jb252ZXJ0aW5nLXN0cmluZ3MtdG8tbnVtYmVyLWluLWphdmFzY3JpcHQtcGl0ZmFsbHM+YF8gdG8gZG8gdGhpczsgdGhpcyB2ZXJzaW9uIHN1cHBvcnRzIG90aGVyIGJhc2VzIChoZXgvYmluYXJ5L29jdGFsKSBhcyB3ZWxsIGFzIGZsb2F0cy5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdHVhbCA9ICtnaXZlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3R1YWwgPj0gbWluICYmIGFjdHVhbCA8PSBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKGZibFtqXVtcImZlZWRiYWNrXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVGhlIGFuc3dlciBpcyBjb3JyZWN0IGlmIGl0IG1hdGNoZWQgdGhlIGZpcnN0IGVsZW1lbnQgaW4gdGhlIGFycmF5LiBBIHNwZWNpYWwgY2FzZTogaWYgb25seSBvbmUgYW5zd2VyIGlzIHByb3ZpZGVkLCBjb3VudCBpdCB3cm9uZzsgdGhpcyBpcyBhIG1pc2Zvcm1lZCBwcm9ibGVtLlxuICAgICAgICAgICAgY29uc3QgaXNfY29ycmVjdCA9IGogPT09IDAgJiYgZmJsLmxlbmd0aCA+IDE7XG4gICAgICAgICAgICBpc0NvcnJlY3RBcnJheS5wdXNoKGlzX2NvcnJlY3QpO1xuICAgICAgICAgICAgaWYgKCFpc19jb3JyZWN0KSB7XG4gICAgICAgICAgICAgICAgY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgICBkeW5fdmFyc19ldmFsICYmXG4gICAgICAgIHR5cGVvZiBkeW5fdmFyc19ldmFsLmFmdGVyQ2hlY2tBbnN3ZXJzID09PSBcImZ1bmN0aW9uXCJcbiAgICApIHtcbiAgICAgICAgY29uc3QgW25hbWVkQmxhbmtWYWx1ZXMsIGdpdmVuX2Fycl9jb252ZXJ0ZWRdID0gcGFyc2VBbnN3ZXJzKFxuICAgICAgICAgICAgYmxhbmtOYW1lc0RpY3QsXG4gICAgICAgICAgICBnaXZlbl9hcnIsXG4gICAgICAgICAgICBkeW5fdmFyc19ldmFsXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGR2ZV9ibGFua3MgPSBPYmplY3QuYXNzaWduKHt9LCBkeW5fdmFyc19ldmFsLCBuYW1lZEJsYW5rVmFsdWVzKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWwuYWZ0ZXJDaGVja0Fuc3dlcnMoZHZlX2JsYW5rcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIFwiRXJyb3IgY2FsbGluZyBhZnRlckNoZWNrQW5zd2Vyc1wiKTtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHBlcmNlbnQgPVxuICAgICAgICBpc0NvcnJlY3RBcnJheS5maWx0ZXIoQm9vbGVhbikubGVuZ3RoIC8gaXNDb3JyZWN0QXJyYXkubGVuZ3RoO1xuICAgIHJldHVybiBbZGlzcGxheUZlZWQsIGNvcnJlY3QsIGlzQ29ycmVjdEFycmF5LCBwZXJjZW50XTtcbn1cblxuLy8gVXNlIHRoZSBwcm92aWRlZCBwYXJzZXJzIHRvIGNvbnZlcnQgYSBzdHVkZW50J3MgYW5zd2VycyAoYXMgc3RyaW5ncykgdG8gdGhlIHR5cGUgcHJvZHVjZWQgYnkgdGhlIHBhcnNlciBmb3IgZWFjaCBibGFuay5cbmZ1bmN0aW9uIHBhcnNlQW5zd2VycyhcbiAgICAvLyBTZWUgYmxhbmtOYW1lc0RpY3RfLlxuICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgIC8vIFNlZSBnaXZlbl9hcnJfLlxuICAgIGdpdmVuX2FycixcbiAgICAvLyBTZWUgYGR5bl92YXJzX2V2YWxgLlxuICAgIGR5bl92YXJzX2V2YWxcbikge1xuICAgIC8vIFByb3ZpZGUgYSBkaWN0IG9mIHtibGFua19uYW1lLCBjb252ZXJ0ZXJfYW5zd2VyX3ZhbHVlfS5cbiAgICBjb25zdCBuYW1lZEJsYW5rVmFsdWVzID0gZ2V0TmFtZWRCbGFua1ZhbHVlcyhcbiAgICAgICAgZ2l2ZW5fYXJyLFxuICAgICAgICBibGFua05hbWVzRGljdCxcbiAgICAgICAgZHluX3ZhcnNfZXZhbFxuICAgICk7XG4gICAgLy8gSW52ZXJ0IGJsYW5rTmFtZWREaWN0OiBjb21wdXRlIGFuIGFycmF5IG9mIFtibGFua18wX25hbWUsIC4uLl0uIE5vdGUgdGhhdCB0aGUgYXJyYXkgbWF5IGJlIHNwYXJzZTogaXQgb25seSBjb250YWlucyB2YWx1ZXMgZm9yIG5hbWVkIGJsYW5rcy5cbiAgICBjb25zdCBnaXZlbl9hcnJfbmFtZXMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhibGFua05hbWVzRGljdCkpIHtcbiAgICAgICAgZ2l2ZW5fYXJyX25hbWVzW3ZdID0gaztcbiAgICB9XG4gICAgLy8gQ29tcHV0ZSBhbiBhcnJheSBvZiBbY29udmVydGVkX2JsYW5rXzBfdmFsLCAuLi5dLiBOb3RlIHRoYXQgdGhpcyByZS1jb252ZXJ0cyBhbGwgdGhlIHZhbHVlcywgcmF0aGVyIHRoYW4gKHBvc3NpYmx5IGRlZXApIGNvcHlpbmcgdGhlIHZhbHVlcyBmcm9tIGFscmVhZHktY29udmVydGVkIG5hbWVkIGJsYW5rcy5cbiAgICBjb25zdCBnaXZlbl9hcnJfY29udmVydGVkID0gZ2l2ZW5fYXJyLm1hcCgodmFsdWUsIGluZGV4KSA9PlxuICAgICAgICB0eXBlX2NvbnZlcnQoZ2l2ZW5fYXJyX25hbWVzW2luZGV4XSwgdmFsdWUsIGluZGV4LCBkeW5fdmFyc19ldmFsKVxuICAgICk7XG5cbiAgICByZXR1cm4gW25hbWVkQmxhbmtWYWx1ZXMsIGdpdmVuX2Fycl9jb252ZXJ0ZWRdO1xufVxuXG4vLyBSZW5kZXIgdGhlIGZlZWRiYWNrIGZvciBhIGR5bmFtaWMgcHJvYmxlbS5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJEeW5hbWljRmVlZGJhY2soXG4gICAgLy8gU2VlIGJsYW5rTmFtZXNEaWN0Xy5cbiAgICBibGFua05hbWVzRGljdCxcbiAgICAvLyBTZWUgZ2l2ZW5fYXJyXy5cbiAgICBnaXZlbl9hcnIsXG4gICAgLy8gVGhlIGluZGV4IG9mIHRoaXMgYmxhbmsgaW4gZ2l2ZW5fYXJyXy5cbiAgICBpbmRleCxcbiAgICAvLyBUaGUgZmVlZGJhY2sgZm9yIHRoaXMgYmxhbmssIGNvbnRhaW5pbmcgYSB0ZW1wbGF0ZSB0byBiZSByZW5kZXJlZC5cbiAgICBkaXNwbGF5RmVlZF9pLFxuICAgIC8vIFNlZSBkeW5fdmFyc19ldmFsXy5cbiAgICBkeW5fdmFyc19ldmFsXG4pIHtcbiAgICAvLyBVc2UgdGhlIGFuc3dlciwgYW4gYXJyYXkgb2YgYWxsIGFuc3dlcnMsIHRoZSB2YWx1ZSBvZiBhbGwgbmFtZWQgYmxhbmtzLCBhbmQgYWxsIHNvbHV0aW9uIHZhcmlhYmxlcyBmb3IgdGhlIHRlbXBsYXRlLlxuICAgIGNvbnN0IG5hbWVkQmxhbmtWYWx1ZXMgPSBnZXROYW1lZEJsYW5rVmFsdWVzKFxuICAgICAgICBnaXZlbl9hcnIsXG4gICAgICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgICAgICBkeW5fdmFyc19ldmFsXG4gICAgKTtcbiAgICBjb25zdCBzb2xfdmFyc19wbHVzID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAge1xuICAgICAgICAgICAgYW5zOiBnaXZlbl9hcnJbaW5kZXhdLFxuICAgICAgICAgICAgYW5zX2FycmF5OiBnaXZlbl9hcnIsXG4gICAgICAgIH0sXG4gICAgICAgIGR5bl92YXJzX2V2YWwsXG4gICAgICAgIG5hbWVkQmxhbmtWYWx1ZXNcbiAgICApO1xuICAgIHRyeSB7XG4gICAgICAgIGRpc3BsYXlGZWVkX2kgPSByZW5kZXJfaHRtbChkaXNwbGF5RmVlZF9pLCBzb2xfdmFyc19wbHVzKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIGBFcnJvciBldmFsdWF0aW5nIGZlZWRiYWNrIGluZGV4ICR7aW5kZXh9LmApO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpc3BsYXlGZWVkX2k7XG59XG5cbi8vIFV0aWxpdGllc1xuLy8gLS0tLS0tLS0tXG4vLyBGb3IgZWFjaCBuYW1lZCBibGFuaywgZ2V0IHRoZSB2YWx1ZSBmb3IgdGhlIGJsYW5rOiB0aGUgdmFsdWUgb2YgZWFjaCBgYGJsYW5rTmFtZWBgIGdpdmVzIHRoZSBpbmRleCBvZiB0aGUgYmxhbmsgZm9yIHRoYXQgbmFtZS5cbmZ1bmN0aW9uIGdldE5hbWVkQmxhbmtWYWx1ZXMoZ2l2ZW5fYXJyLCBibGFua05hbWVzRGljdCwgZHluX3ZhcnNfZXZhbCkge1xuICAgIGNvbnN0IG5hbWVkQmxhbmtWYWx1ZXMgPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtibGFua19uYW1lLCBibGFua19pbmRleF0gb2YgT2JqZWN0LmVudHJpZXMoYmxhbmtOYW1lc0RpY3QpKSB7XG4gICAgICAgIG5hbWVkQmxhbmtWYWx1ZXNbYmxhbmtfbmFtZV0gPSB0eXBlX2NvbnZlcnQoXG4gICAgICAgICAgICBibGFua19uYW1lLFxuICAgICAgICAgICAgZ2l2ZW5fYXJyW2JsYW5rX2luZGV4XSxcbiAgICAgICAgICAgIGJsYW5rX2luZGV4LFxuICAgICAgICAgICAgZHluX3ZhcnNfZXZhbFxuICAgICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZWRCbGFua1ZhbHVlcztcbn1cblxuLy8gQ29udmVydCBhIHZhbHVlIGdpdmVuIGl0cyB0eXBlLlxuZnVuY3Rpb24gdHlwZV9jb252ZXJ0KG5hbWUsIHZhbHVlLCBpbmRleCwgZHluX3ZhcnNfZXZhbCkge1xuICAgIC8vIFRoZSBjb252ZXJ0ZXIgY2FuIGJlIGRlZmluZWQgYnkgaW5kZXgsIG5hbWUsIG9yIGJ5IGEgc2luZ2xlIHZhbHVlICh3aGljaCBhcHBsaWVzIHRvIGFsbCBibGFua3MpLiBJZiBub3QgcHJvdmlkZWQsIGp1c3QgcGFzcyB0aGUgZGF0YSB0aHJvdWdoLlxuICAgIGNvbnN0IHR5cGVzID0gZHluX3ZhcnNfZXZhbC50eXBlcyB8fCBwYXNzX3Rocm91Z2g7XG4gICAgY29uc3QgY29udmVydGVyID0gdHlwZXNbbmFtZV0gfHwgdHlwZXNbaW5kZXhdIHx8IHR5cGVzO1xuICAgIC8vIEVTNSBoYWNrOiBpdCBkb2Vzbid0IHN1cHBvcnQgYmluYXJ5IHZhbHVlcywgYW5kIGpzMnB5IGRvZXNuJ3QgYWxsb3cgbWUgdG8gb3ZlcnJpZGUgdGhlIGBgTnVtYmVyYGAgY2xhc3MuIFNvLCBkZWZpbmUgdGhlIHdvcmthcm91bmQgY2xhc3MgYGBOdW1iZXJfYGAgYW5kIHVzZSBpdCBpZiBhdmFpbGFibGUuXG4gICAgaWYgKGNvbnZlcnRlciA9PT0gTnVtYmVyICYmIHR5cGVvZiBOdW1iZXJfICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGNvbnZlcnRlciA9IE51bWJlcl87XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHRoZSBjb252ZXJ0ZWQgdHlwZS4gSWYgdGhlIGNvbnZlcnRlciByYWlzZXMgYSBUeXBlRXJyb3IsIHJldHVybiB0aGF0OyBpdCB3aWxsIGJlIGRpc3BsYXllZCB0byB0aGUgdXNlciwgc2luY2Ugd2UgYXNzdW1lIHR5cGUgZXJyb3JzIGFyZSBhIHdheSBmb3IgdGhlIHBhcnNlciB0byBleHBsYWluIHRvIHRoZSB1c2VyIHdoeSB0aGUgcGFyc2UgZmFpbGVkLiBGb3IgYWxsIG90aGVyIGVycm9ycywgcmUtdGhyb3cgaXQgc2luY2Ugc29tZXRoaW5nIHdlbnQgd3JvbmcuXG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGNvbnZlcnRlcih2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIEEgcGFzcy10aHJvdWdoIFwiY29udmVydGVyXCIuXG5mdW5jdGlvbiBwYXNzX3Rocm91Z2godmFsKSB7XG4gICAgcmV0dXJuIHZhbDtcbn1cbiIsIi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyB8ZG9jbmFtZXwgLS0gZmlsbC1pbi10aGUtYmxhbmsgY2xpZW50LXNpZGUgY29kZVxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIFRoaXMgZmlsZSBjb250YWlucyB0aGUgSlMgZm9yIHRoZSBSdW5lc3RvbmUgZmlsbGludGhlYmxhbmsgY29tcG9uZW50LiBJdCB3YXMgY3JlYXRlZCBCeSBJc2FpYWggTWF5ZXJjaGFrIGFuZCBLaXJieSBPbHNvbiwgNi80LzE1IHRoZW4gcmV2aXNlZCBieSBCcmFkIE1pbGxlciwgMi83LzIwLlxuLy9cbi8vIERhdGEgc3RvcmFnZSBub3Rlc1xuLy8gPT09PT09PT09PT09PT09PT09XG4vL1xuLy8gSW5pdGlhbCBwcm9ibGVtIHJlc3RvcmVcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbiB0aGUgY29uc3RydWN0b3IsIHRoaXMgY29kZSAodGhlIGNsaWVudCkgcmVzdG9yZXMgdGhlIHByb2JsZW0gYnkgY2FsbGluZyBgYGNoZWNrU2VydmVyYGAuIFRvIGRvIHNvLCBlaXRoZXIgdGhlIHNlcnZlciBzZW5kcyBvciBsb2NhbCBzdG9yYWdlIGhhczpcbi8vXG4vLyAtICAgIHNlZWQgKHVzZWQgb25seSBmb3IgZHluYW1pYyBwcm9ibGVtcylcbi8vIC0gICAgYW5zd2VyXG4vLyAtICAgIGRpc3BsYXlGZWVkIChzZXJ2ZXItc2lkZSBncmFkaW5nIG9ubHk7IG90aGVyd2lzZSwgdGhpcyBpcyBnZW5lcmF0ZWQgbG9jYWxseSBieSBjbGllbnQgY29kZSlcbi8vIC0gICAgY29ycmVjdCAoU1NHKVxuLy8gLSAgICBpc0NvcnJlY3RBcnJheSAoU1NHKVxuLy8gLSAgICBwcm9ibGVtSHRtbCAoU1NHIHdpdGggZHluYW1pYyBwcm9ibGVtcyBvbmx5KVxuLy9cbi8vIElmIGFueSBvZiB0aGUgYW5zd2VycyBhcmUgY29ycmVjdCwgdGhlbiB0aGUgY2xpZW50IHNob3dzIGZlZWRiYWNrLiBUaGlzIGlzIGltcGxlbWVudGVkIGluIHJlc3RvcmVBbnN3ZXJzXy5cbi8vXG4vLyBHcmFkaW5nXG4vLyAtLS0tLS0tXG4vLyBXaGVuIHRoZSB1c2VyIHByZXNzZXMgdGhlIFwiQ2hlY2sgbWVcIiBidXR0b24sIHRoZSBsb2dDdXJyZW50QW5zd2VyXyBmdW5jdGlvbjpcbi8vXG4vLyAtICAgIFNhdmVzIHRoZSBmb2xsb3dpbmcgdG8gbG9jYWwgc3RvcmFnZTpcbi8vXG4vLyAgICAgIC0gICBzZWVkXG4vLyAgICAgIC0gICBhbnN3ZXJcbi8vICAgICAgLSAgIHRpbWVzdGFtcFxuLy8gICAgICAtICAgcHJvYmxlbUh0bWxcbi8vXG4vLyAgICAgIE5vdGUgdGhhdCB0aGVyZSdzIG5vIHBvaW50IGluIHNhdmluZyBkaXNwbGF5RmVlZCwgY29ycmVjdCwgb3IgaXNDb3JyZWN0QXJyYXksIHNpbmNlIHRoZXNlIHZhbHVlcyBhcHBsaWVkIHRvIHRoZSBwcmV2aW91cyBhbnN3ZXIsIG5vdCB0aGUgbmV3IGFuc3dlciBqdXN0IHN1Ym1pdHRlZC5cbi8vXG4vLyAtICAgIFNlbmRzIHRoZSBmb2xsb3dpbmcgdG8gdGhlIHNlcnZlcjsgc3RvcCBhZnRlciB0aGlzIGZvciBjbGllbnQtc2lkZSBncmFkaW5nOlxuLy9cbi8vICAgICAgLSAgIHNlZWQgKGlnbm9yZWQgZm9yIHNlcnZlci1zaWRlIGdyYWRpbmcpXG4vLyAgICAgIC0gICBhbnN3ZXJcbi8vICAgICAgLSAgIGNvcnJlY3QgKGlnbm9yZWQgZm9yIFNTRylcbi8vICAgICAgLSAgIHBlcmNlbnQgKGlnbm9yZWQgZm9yIFNTRylcbi8vXG4vLyAtICAgIFJlY2VpdmVzIHRoZSBmb2xsb3dpbmcgZnJvbSB0aGUgc2VydmVyOlxuLy9cbi8vICAgICAgLSAgIHRpbWVzdGFtcFxuLy8gICAgICAtICAgZGlzcGxheUZlZWRcbi8vICAgICAgLSAgIGNvcnJlY3Rcbi8vICAgICAgLSAgIGlzQ29ycmVjdEFycmF5XG4vL1xuLy8gLSAgICBTYXZlcyB0aGUgZm9sbG93aW5nIHRvIGxvY2FsIHN0b3JhZ2U6XG4vL1xuLy8gICAgICAtICAgc2VlZFxuLy8gICAgICAtICAgYW5zd2VyXG4vLyAgICAgIC0gICB0aW1lc3RhbXBcbi8vICAgICAgLSAgIGRpc3BsYXlGZWVkIChTU0cgb25seSlcbi8vICAgICAgLSAgIGNvcnJlY3QgKFNTRyBvbmx5KVxuLy8gICAgICAtICAgaXNDb3JyZWN0QXJyYXkgKFNTRyBvbmx5KVxuLy8gICAgICAtICAgcHJvYmxlbUh0bWxcbi8vXG4vLyBSYW5kb21pemVcbi8vIC0tLS0tLS0tLVxuLy8gV2hlbiB0aGUgdXNlciBwcmVzc2VzIHRoZSBcIlJhbmRvbWl6ZVwiIGJ1dHRvbiAod2hpY2ggaXMgb25seSBhdmFpbGFibGUgZm9yIGR5bmFtaWMgcHJvYmxlbXMpLCB0aGUgcmFuZG9taXplXyBmdW5jdGlvbjpcbi8vXG4vLyAtICAgIEZvciB0aGUgY2xpZW50LXNpZGUgY2FzZSwgc2V0cyB0aGUgc2VlZCB0byBhIG5ldywgcmFuZG9tIHZhbHVlLiBGb3IgdGhlIHNlcnZlci1zaWRlIGNhc2UsIHJlcXVlc3RzIGEgbmV3IHNlZWQgYW5kIHByb2JsZW1IdG1sIGZyb20gdGhlIHNlcnZlci5cbi8vIC0gICAgU2V0cyB0aGUgYW5zd2VyIHRvIGFuIGFycmF5IG9mIGVtcHR5IHN0cmluZ3MuXG4vLyAtICAgIFNhdmVzIHRoZSB1c3VhbCBsb2NhbCBkYXRhLlxuXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlLmpzXCI7XG5pbXBvcnQge1xuICByZW5kZXJEeW5hbWljQ29udGVudCxcbiAgY2hlY2tBbnN3ZXJzQ29yZSxcbiAgcmVuZGVyRHluYW1pY0ZlZWRiYWNrLFxufSBmcm9tIFwiLi9maXRiLXV0aWxzLmpzXCI7XG5pbXBvcnQgXCIuL2ZpdGItaTE4bi5lbi5qc1wiO1xuaW1wb3J0IFwiLi9maXRiLWkxOG4ucHQtYnIuanNcIjtcbmltcG9ydCBcIi4uL2Nzcy9maXRiLmNzc1wiO1xuXG4vLyBPYmplY3QgY29udGFpbmluZyBhbGwgaW5zdGFuY2VzIG9mIEZJVEIgdGhhdCBhcmVuJ3QgYSBjaGlsZCBvZiBhIHRpbWVkIGFzc2Vzc21lbnQuXG5leHBvcnQgdmFyIEZJVEJMaXN0ID0ge307XG5cbi8vIEZJVEIgY29uc3RydWN0b3JcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZJVEIgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgY29uc3RydWN0b3Iob3B0cykge1xuICAgIHN1cGVyKG9wdHMpO1xuICAgIHZhciBvcmlnID0gb3B0cy5vcmlnOyAvLyBlbnRpcmUgPHA+IGVsZW1lbnRcbiAgICB0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzID0gb3B0cy51c2VSdW5lc3RvbmVTZXJ2aWNlcztcbiAgICB0aGlzLm9yaWdFbGVtID0gb3JpZztcbiAgICB0aGlzLmRpdmlkID0gb3JpZy5pZDtcbiAgICB0aGlzLmNvcnJlY3QgPSBudWxsO1xuICAgIC8vIFNlZSBjb21tZW50cyBpbiBmaXRiLnB5IGZvciB0aGUgZm9ybWF0IG9mIGBgZmVlZGJhY2tBcnJheWBgICh3aGljaCBpcyBpZGVudGljYWwgaW4gYm90aCBmaWxlcykuXG4gICAgLy9cbiAgICAvLyBGaW5kIHRoZSBzY3JpcHQgdGFnIGNvbnRhaW5pbmcgSlNPTiBhbmQgcGFyc2UgaXQuIFNlZSBgU08gPGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkzMjA0MjcvYmVzdC1wcmFjdGljZS1mb3ItZW1iZWRkaW5nLWFyYml0cmFyeS1qc29uLWluLXRoZS1kb20+YF9fLiBJZiB0aGlzIHRhZyBkb2Vzbid0IGV4aXN0LCB0aGVuIG5vIGZlZWRiYWNrIGlzIGF2YWlsYWJsZTsgc2VydmVyLXNpZGUgZ3JhZGluZyB3aWxsIGJlIHBlcmZvcm1lZC5cbiAgICAvL1xuICAgIC8vIEEgZGVzdHJ1Y3R1cmluZyBhc3NpZ25tZW50IHdvdWxkIGJlIHBlcmZlY3QsIGJ1dCB0aGV5IGRvbid0IHdvcmsgd2l0aCBgYHRoaXMuYmxhaGBgIGFuZCBgYHdpdGhgYCBzdGF0ZW1lbnRzIGFyZW4ndCBzdXBwb3J0ZWQgaW4gc3RyaWN0IG1vZGUuXG4gICAgY29uc3QganNvbl9lbGVtZW50ID0gdGhpcy5zY3JpcHRTZWxlY3Rvcih0aGlzLm9yaWdFbGVtKTtcbiAgICBjb25zdCBkaWN0XyA9IEpTT04ucGFyc2UoanNvbl9lbGVtZW50Lmh0bWwoKSk7XG4gICAganNvbl9lbGVtZW50LnJlbW92ZSgpO1xuICAgIHRoaXMucHJvYmxlbUh0bWwgPSBkaWN0Xy5wcm9ibGVtSHRtbDtcbiAgICB0aGlzLmR5bl92YXJzID0gZGljdF8uZHluX3ZhcnM7XG4gICAgdGhpcy5ibGFua05hbWVzID0gZGljdF8uYmxhbmtOYW1lcztcbiAgICB0aGlzLmZlZWRiYWNrQXJyYXkgPSBkaWN0Xy5mZWVkYmFja0FycmF5O1xuXG4gICAgdGhpcy5jcmVhdGVGSVRCRWxlbWVudCgpO1xuICAgIHRoaXMuc2V0dXBCbGFua3MoKTtcbiAgICB0aGlzLmNhcHRpb24gPSBcIkZpbGwgaW4gdGhlIEJsYW5rXCI7XG4gICAgdGhpcy5hZGRDYXB0aW9uKFwicnVuZXN0b25lXCIpO1xuXG4gICAgLy8gRGVmaW5lIGEgcHJvbWlzZSB3aGljaCBpbXBvcnRzIGFueSBsaWJyYXJpZXMgbmVlZGVkIGJ5IGR5bmFtaWMgcHJvYmxlbXMuXG4gICAgdGhpcy5keW5faW1wb3J0cyA9IHt9O1xuICAgIGxldCBpbXBvcnRzX3Byb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBpZiAoZGljdF8uZHluX2ltcG9ydHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQ29sbGVjdCBhbGwgaW1wb3J0IHByb21pc2VzLlxuICAgICAgbGV0IGltcG9ydF9wcm9taXNlcyA9IFtdO1xuICAgICAgZm9yIChjb25zdCBpbXBvcnRfIG9mIGRpY3RfLmR5bl9pbXBvcnRzKSB7XG4gICAgICAgIHN3aXRjaCAoaW1wb3J0Xykge1xuICAgICAgICAgICAgY2FzZSBcIkJUTVwiOiBpbXBvcnRfcHJvbWlzZXMucHVzaChpbXBvcnQoXCIuL2xpYnMvQlRNL3NyYy9CVE1fcm9vdC5qc1wiKSk7IGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDogdGhyb3coYFVua25vd24gZHluYW1pYyBpbXBvcnQgJHtpbXBvcnRffWApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIENvbWJpbmUgdGhlIHJlc3VsdGluZyBtb2R1bGUgbmFtZXNwYWNlIG9iamVjdHMgd2hlbiB0aGVzZSBwcm9taXNlcyByZXNvbHZlLlxuICAgICAgaW1wb3J0c19wcm9taXNlID0gUHJvbWlzZS5hbGwoaW1wb3J0X3Byb21pc2VzKS50aGVuKChtb2R1bGVfbmFtZXNwYWNlX2FycikgPT5cbiAgICAgICAgdGhpcy5keW5faW1wb3J0cyA9IE9iamVjdC5hc3NpZ24oe30sIC4uLm1vZHVsZV9uYW1lc3BhY2VfYXJyKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBSZXNvbHZlIHRoZXNlIHByb21pc2VzLlxuICAgIGltcG9ydHNfcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuY2hlY2tTZXJ2ZXIoXCJmaWxsYlwiLCBmYWxzZSkudGhlbigoKSA9PiB7XG4gICAgICAgIC8vIE9uZSBvcHRpb24gZm9yIGEgZHluYW1pYyBwcm9ibGVtIGlzIHRvIHByb2R1Y2UgYSBzdGF0aWMgcHJvYmxlbSBieSBwcm92aWRpbmcgYSBmaXhlZCBzZWVkIHZhbHVlLiBUaGlzIGlzIHR5cGljYWxseSB1c2VkIHdoZW4gdGhlIGdvYWwgaXMgdG8gcmVuZGVyIHRoZSBwcm9ibGVtIGFzIGFuIGltYWdlIGZvciBpbmNsdXNpb24gaW4gc3RhdGljIGNvbnRlbnQgKGEgUERGLCBldGMuKS4gVG8gc3VwcG9ydCB0aGlzLCBjb25zaWRlciB0aGUgZm9sbG93aW5nIGNhc2VzOlxuICAgICAgICAvL1xuICAgICAgICAvLy8gQ2FzZSAgSGFzIHN0YXRpYyBzZWVkPyAgSXMgYSBjbGllbnQtc2lkZSwgZHluYW1pYyBwcm9ibGVtPyAgSGFzIGxvY2FsIHNlZWQ/ICBSZXN1bHRcbiAgICAgICAgLy8vIDAgICAgIE5vICAgICAgICAgICAgICAgIE5vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFggICAgICAgICAgICAgICAgTm8gYWN0aW9uIG5lZWRlZC5cbiAgICAgICAgLy8vIDEgICAgIE5vICAgICAgICAgICAgICAgIFllcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vICAgICAgICAgICAgICAgdGhpcy5yYW5kb21pemUoKS5cbiAgICAgICAgLy8vIDIgICAgIE5vICAgICAgICAgICAgICAgIFllcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFllcyAgICAgICAgICAgICAgTm8gYWN0aW9uIG5lZWRlZCAtLSBwcm9ibGVtIGFscmVhZHkgcmVzdG9yZWQgZnJvbSBsb2NhbCBzdG9yYWdlLlxuICAgICAgICAvLy8gMyAgICAgWWVzICAgICAgICAgICAgICAgTm8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWCAgICAgICAgICAgICAgICBXYXJuaW5nOiBzZWVkIGlnbm9yZWQuXG4gICAgICAgIC8vLyA0ICAgICBZZXMgICAgICAgICAgICAgICBZZXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBObyAgICAgICAgICAgICAgIEFzc2lnbiBzZWVkOyB0aGlzLnJlbmRlckR5bmFtaWNDb250ZW50KCkuXG4gICAgICAgIC8vLyA1ICAgICBZZXMgICAgICAgICAgICAgICBZZXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBZZXMgICAgICAgICAgICAgIElmIHNlZWRzIGRpZmZlciwgaXNzdWUgd2FybmluZy4gTm8gYWRkaXRpb25hbCBhY3Rpb24gbmVlZGVkIC0tIHByb2JsZW0gYWxyZWFkeSByZXN0b3JlZCBmcm9tIGxvY2FsIHN0b3JhZ2UuXG5cbiAgICAgICAgY29uc3QgaGFzX3N0YXRpY19zZWVkID0gZGljdF8uc3RhdGljX3NlZWQgIT09IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgaXNfY2xpZW50X2R5bmFtaWMgPSB0eXBlb2YgdGhpcy5keW5fdmFycyA9PT0gXCJzdHJpbmdcIjtcbiAgICAgICAgY29uc3QgaGFzX2xvY2FsX3NlZWQgPSB0aGlzLnNlZWQgIT09IHVuZGVmaW5lZDtcblxuICAgICAgICAvLyBDYXNlIDFcbiAgICAgICAgaWYgKCFoYXNfc3RhdGljX3NlZWQgJiYgaXNfY2xpZW50X2R5bmFtaWMgJiYgIWhhc19sb2NhbF9zZWVkKSB7XG4gICAgICAgICAgdGhpcy5yYW5kb21pemUoKTtcbiAgICAgICAgfSBlbHNlXG4gICAgICAgIC8vIENhc2UgM1xuICAgICAgICBpZiAoaGFzX3N0YXRpY19zZWVkICYmICFpc19jbGllbnRfZHluYW1pYykge1xuICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLCBcIldhcm5pbmc6IHRoZSBwcm92aWRlZCBzdGF0aWMgc2VlZCB3YXMgaWdub3JlZCwgYmVjYXVzZSBpdCBvbmx5IGFmZmVjdHMgY2xpZW50LXNpZGUsIGR5bmFtaWMgcHJvYmxlbXMuXCIpO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgLy8gQ2FzZSA0XG4gICAgICAgIGlmIChoYXNfc3RhdGljX3NlZWQgJiYgaXNfY2xpZW50X2R5bmFtaWMgJiYgIWhhc19sb2NhbF9zZWVkKSB7XG4gICAgICAgICAgdGhpcy5zZWVkID0gZGljdF8uc3RhdGljX3NlZWQ7XG4gICAgICAgICAgdGhpcy5yZW5kZXJEeW5hbWljQ29udGVudCgpO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgLy8gQ2FzZSA1XG4gICAgICAgIGlmIChoYXNfc3RhdGljX3NlZWQgJiYgaXNfY2xpZW50X2R5bmFtaWMgJiYgaGFzX2xvY2FsX3NlZWQgJiYgdGhpcy5zZWVkICE9PSBkaWN0Xy5zdGF0aWNfc2VlZCkge1xuICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLCBcIldhcm5pbmc6IHRoZSBwcm92aWRlZCBzdGF0aWMgc2VlZCB3YXMgb3ZlcnJpZGRlbiBieSB0aGUgc2VlZCBmb3VuZCBpbiBsb2NhbCBzdG9yYWdlLlwiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDYXNlcyAwIGFuZCAyXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIC8vIE5vIGFjdGlvbiBuZWVkZWQuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIFByaXNtICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBQcmlzbS5oaWdobGlnaHRBbGxVbmRlcih0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5kaWNhdGVfY29tcG9uZW50X3JlYWR5KCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEZpbmQgdGhlIHNjcmlwdCB0YWcgY29udGFpbmluZyBKU09OIGluIGEgZ2l2ZW4gcm9vdCBET00gbm9kZS5cbiAgc2NyaXB0U2VsZWN0b3Iocm9vdF9ub2RlKSB7XG4gICAgcmV0dXJuICQocm9vdF9ub2RlKS5maW5kKGBzY3JpcHRbdHlwZT1cImFwcGxpY2F0aW9uL2pzb25cIl1gKTtcbiAgfVxuXG4gIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gICBGdW5jdGlvbnMgZ2VuZXJhdGluZyBmaW5hbCBIVE1MICAgPT09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICBjcmVhdGVGSVRCRWxlbWVudCgpIHtcbiAgICB0aGlzLnJlbmRlckZJVEJJbnB1dCgpO1xuICAgIHRoaXMucmVuZGVyRklUQkJ1dHRvbnMoKTtcbiAgICB0aGlzLnJlbmRlckZJVEJGZWVkYmFja0RpdigpO1xuICAgIC8vIHJlcGxhY2VzIHRoZSBpbnRlcm1lZGlhdGUgSFRNTCBmb3IgdGhpcyBjb21wb25lbnQgd2l0aCB0aGUgcmVuZGVyZWQgSFRNTCBvZiB0aGlzIGNvbXBvbmVudFxuICAgICQodGhpcy5vcmlnRWxlbSkucmVwbGFjZVdpdGgodGhpcy5jb250YWluZXJEaXYpO1xuICB9XG4gIHJlbmRlckZJVEJJbnB1dCgpIHtcbiAgICAvLyBUaGUgdGV4dCBbaW5wdXRdIGVsZW1lbnRzIGFyZSBjcmVhdGVkIGJ5IHRoZSB0ZW1wbGF0ZS5cbiAgICB0aGlzLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdGhpcy5jb250YWluZXJEaXYuaWQgPSB0aGlzLmRpdmlkO1xuICAgIC8vIENyZWF0ZSBhbm90aGVyIGNvbnRhaW5lciB3aGljaCBzdG9yZXMgdGhlIHByb2JsZW0gZGVzY3JpcHRpb24uXG4gICAgdGhpcy5kZXNjcmlwdGlvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5kZXNjcmlwdGlvbkRpdik7XG4gICAgLy8gQ29weSB0aGUgb3JpZ2luYWwgZWxlbWVudHMgdG8gdGhlIGNvbnRhaW5lciBob2xkaW5nIHdoYXQgdGhlIHVzZXIgd2lsbCBzZWUgKGNsaWVudC1zaWRlIGdyYWRpbmcgb25seSkuXG4gICAgaWYgKHRoaXMucHJvYmxlbUh0bWwpIHtcbiAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MID0gdGhpcy5wcm9ibGVtSHRtbDtcbiAgICAgIC8vIFNhdmUgb3JpZ2luYWwgSFRNTCAod2l0aCB0ZW1wbGF0ZXMpIHVzZWQgaW4gZHluYW1pYyBwcm9ibGVtcy5cbiAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYub3JpZ0lubmVySFRNTCA9IHRoaXMucHJvYmxlbUh0bWw7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyRklUQkJ1dHRvbnMoKSB7XG4gICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcbiAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuXG4gICAgLy8gXCJzdWJtaXRcIiBidXR0b25cbiAgICB0aGlzLnN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgdGhpcy5zdWJtaXRCdXR0b24udGV4dENvbnRlbnQgPSAkLmkxOG4oXCJtc2dfZml0Yl9jaGVja19tZVwiKTtcbiAgICAkKHRoaXMuc3VibWl0QnV0dG9uKS5hdHRyKHtcbiAgICAgIGNsYXNzOiBcImJ0biBidG4tc3VjY2Vzc1wiLFxuICAgICAgbmFtZTogXCJkbyBhbnN3ZXJcIixcbiAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXG4gICAgfSk7XG4gICAgdGhpcy5zdWJtaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwiY2xpY2tcIixcbiAgICAgIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jaGVja0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgYXdhaXQgdGhpcy5sb2dDdXJyZW50QW5zd2VyKCk7XG4gICAgICB9LmJpbmQodGhpcyksXG4gICAgICBmYWxzZVxuICAgICk7XG4gICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5zdWJtaXRCdXR0b24pO1xuXG4gICAgLy8gXCJjb21wYXJlIG1lXCIgYnV0dG9uXG4gICAgaWYgKHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAkKHRoaXMuY29tcGFyZUJ1dHRvbikuYXR0cih7XG4gICAgICAgIGNsYXNzOiBcImJ0biBidG4tZGVmYXVsdFwiLFxuICAgICAgICBpZDogdGhpcy5vcmlnRWxlbS5pZCArIFwiX2Jjb21wXCIsXG4gICAgICAgIGRpc2FibGVkOiBcIlwiLFxuICAgICAgICBuYW1lOiBcImNvbXBhcmVcIixcbiAgICAgIH0pO1xuICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLnRleHRDb250ZW50ID0gJC5pMThuKFwibXNnX2ZpdGJfY29tcGFyZV9tZVwiKTtcbiAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLmNvbXBhcmVGSVRCQW5zd2VycygpO1xuICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgIGZhbHNlXG4gICAgICApO1xuICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5jb21wYXJlQnV0dG9uKTtcbiAgICB9XG5cbiAgICAvLyBSYW5kb21pemUgYnV0dG9uIGZvciBkeW5hbWljIHByb2JsZW1zLlxuICAgIGlmICh0aGlzLmR5bl92YXJzKSB7XG4gICAgICB0aGlzLnJhbmRvbWl6ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAkKHRoaXMucmFuZG9taXplQnV0dG9uKS5hdHRyKHtcbiAgICAgICAgY2xhc3M6IFwiYnRuIGJ0bi1kZWZhdWx0XCIsXG4gICAgICAgIGlkOiB0aGlzLm9yaWdFbGVtLmlkICsgXCJfYmNvbXBcIixcbiAgICAgICAgbmFtZTogXCJyYW5kb21pemVcIixcbiAgICAgIH0pO1xuICAgICAgdGhpcy5yYW5kb21pemVCdXR0b24udGV4dENvbnRlbnQgPSAkLmkxOG4oXCJtc2dfZml0Yl9yYW5kb21pemVcIik7XG4gICAgICB0aGlzLnJhbmRvbWl6ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLnJhbmRvbWl6ZSgpO1xuICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgIGZhbHNlXG4gICAgICApO1xuICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5yYW5kb21pemVCdXR0b24pO1xuICAgIH1cblxuICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICB9XG4gIHJlbmRlckZJVEJGZWVkYmFja0RpdigpIHtcbiAgICB0aGlzLmZlZWRCYWNrRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0aGlzLmZlZWRCYWNrRGl2LmlkID0gdGhpcy5kaXZpZCArIFwiX2ZlZWRiYWNrXCI7XG4gICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcbiAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmZlZWRCYWNrRGl2KTtcbiAgfVxuXG4gIGNsZWFyRmVlZGJhY2tEaXYoKSB7XG4gICAgLy8gU2V0dGluZyB0aGUgYGBvdXRlckhUTUxgYCByZW1vdmVzIHRoaXMgZnJvbSB0aGUgRE9NLiBVc2UgYW4gYWx0ZXJuYXRpdmUgcHJvY2VzcyAtLSByZW1vdmUgdGhlIGNsYXNzICh3aGljaCBtYWtlcyBpdCByZWQvZ3JlZW4gYmFzZWQgb24gZ3JhZGluZykgYW5kIGNvbnRlbnQuXG4gICAgdGhpcy5mZWVkQmFja0Rpdi5pbm5lckhUTUwgPSBcIlwiO1xuICAgIHRoaXMuZmVlZEJhY2tEaXYuY2xhc3NOYW1lID0gXCJcIjtcbiAgfVxuXG4gIC8vIFVwZGF0ZSB0aGUgcHJvYmxlbSdzIGRlc2NyaXB0aW9uIGJhc2VkIG9uIGR5bmFtaWNhbGx5LWdlbmVyYXRlZCBjb250ZW50LlxuICByZW5kZXJEeW5hbWljQ29udGVudCgpIHtcbiAgICAvLyBgYHRoaXMuZHluX3ZhcnNgYCBjYW4gYmUgdHJ1ZTsgaWYgc28sIGRvbid0IHJlbmRlciBpdCwgc2luY2UgdGhlIHNlcnZlciBkb2VzIGFsbCB0aGUgcmVuZGVyaW5nLlxuICAgIGlmICh0eXBlb2YgdGhpcy5keW5fdmFycyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbGV0IGh0bWxfbm9kZXM7XG4gICAgICBbaHRtbF9ub2RlcywgdGhpcy5keW5fdmFyc19ldmFsXSA9XG4gICAgICAgIHJlbmRlckR5bmFtaWNDb250ZW50KFxuICAgICAgICAgIHRoaXMuc2VlZCxcbiAgICAgICAgICB0aGlzLmR5bl92YXJzLFxuICAgICAgICAgIHRoaXMuZHluX2ltcG9ydHMsXG4gICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbkRpdi5vcmlnSW5uZXJIVE1MLFxuICAgICAgICAgIHRoaXMuZGl2aWQsXG4gICAgICAgICAgdGhpcy5wcmVwYXJlQ2hlY2tBbnN3ZXJzLmJpbmQodGhpcyksXG4gICAgICAgICk7XG4gICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2LnJlcGxhY2VDaGlsZHJlbiguLi5odG1sX25vZGVzKTtcblxuICAgICAgaWYgKHR5cGVvZiAodGhpcy5keW5fdmFyc19ldmFsLmFmdGVyQ29udGVudFJlbmRlcikgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMuZHluX3ZhcnNfZXZhbC5hZnRlckNvbnRlbnRSZW5kZXIodGhpcy5keW5fdmFyc19ldmFsKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIGBFcnJvciBpbiBwcm9ibGVtICR7dGhpcy5kaXZpZH0gaW52b2tpbmcgYWZ0ZXJDb250ZW50UmVuZGVyYCk7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuZGVzY3JpcHRpb25EaXYpO1xuICAgICAgdGhpcy5zZXR1cEJsYW5rcygpO1xuICAgIH1cbiAgfVxuXG4gIHNldHVwQmxhbmtzKCkge1xuICAgIC8vIEZpbmQgYW5kIGZvcm1hdCB0aGUgYmxhbmtzLiBJZiBhIGR5bmFtaWMgcHJvYmxlbSBqdXN0IGNoYW5nZWQgdGhlIEhUTUwsIHRoaXMgd2lsbCBmaW5kIHRoZSBuZXdseS1jcmVhdGVkIGJsYW5rcy5cbiAgICBjb25zdCBiYSA9ICQodGhpcy5kZXNjcmlwdGlvbkRpdikuZmluZChcIjppbnB1dFwiKTtcbiAgICBiYS5hdHRyKFwiY2xhc3NcIiwgXCJmb3JtIGZvcm0tY29udHJvbCBzZWxlY3R3aWR0aGF1dG9cIik7XG4gICAgYmEuYXR0cihcImFyaWEtbGFiZWxcIiwgXCJpbnB1dCBhcmVhXCIpO1xuICAgIHRoaXMuYmxhbmtBcnJheSA9IGJhLnRvQXJyYXkoKTtcbiAgICBmb3IgKGxldCBibGFuayBvZiB0aGlzLmJsYW5rQXJyYXkpIHtcbiAgICAgICQoYmxhbmspLmNoYW5nZSh0aGlzLnJlY29yZEFuc3dlcmVkLmJpbmQodGhpcykpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFRoaXMgdGVsbHMgdGltZWQgcXVlc3Rpb25zIHRoYXQgdGhlIGZpdGIgYmxhbmtzIHJlY2VpdmVkIHNvbWUgaW50ZXJhY3Rpb24uXG4gIHJlY29yZEFuc3dlcmVkKCkge1xuICAgIHRoaXMuaXNBbnN3ZXJlZCA9IHRydWU7XG4gIH1cblxuICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09IENoZWNraW5nL2xvYWRpbmcgZnJvbSBzdG9yYWdlID09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgLy8gX2ByZXN0b3JlQW5zd2Vyc2A6IHVwZGF0ZSB0aGUgcHJvYmxlbSB3aXRoIGRhdGEgZnJvbSB0aGUgc2VydmVyIG9yIGZyb20gbG9jYWwgc3RvcmFnZS5cbiAgcmVzdG9yZUFuc3dlcnMoZGF0YSkge1xuICAgIC8vIFJlc3RvcmUgdGhlIHNlZWQgZmlyc3QsIHNpbmNlIHRoZSBkeW5hbWljIHJlbmRlciBjbGVhcnMgYWxsIHRoZSBibGFua3MuXG4gICAgdGhpcy5zZWVkID0gZGF0YS5zZWVkO1xuICAgIHRoaXMucmVuZGVyRHluYW1pY0NvbnRlbnQoKTtcblxuICAgIHZhciBhcnI7XG4gICAgLy8gUmVzdG9yZSBhbnN3ZXJzIGZyb20gc3RvcmFnZSByZXRyaWV2YWwgZG9uZSBpbiBSdW5lc3RvbmVCYXNlLlxuICAgIHRyeSB7XG4gICAgICAvLyBUaGUgbmV3ZXIgZm9ybWF0IGVuY29kZXMgZGF0YSBhcyBhIEpTT04gb2JqZWN0LlxuICAgICAgYXJyID0gSlNPTi5wYXJzZShkYXRhLmFuc3dlcik7XG4gICAgICAvLyBUaGUgcmVzdWx0IHNob3VsZCBiZSBhbiBhcnJheS4gSWYgbm90LCB0cnkgY29tbWEgcGFyc2luZyBpbnN0ZWFkLlxuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBUaGUgb2xkIGZvcm1hdCBkaWRuJ3QuXG4gICAgICBhcnIgPSAoZGF0YS5hbnN3ZXIgfHwgXCJcIikuc3BsaXQoXCIsXCIpO1xuICAgIH1cbiAgICBsZXQgaGFzQW5zd2VyID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsYW5rQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICQodGhpcy5ibGFua0FycmF5W2ldKS5hdHRyKFwidmFsdWVcIiwgYXJyW2ldKTtcbiAgICAgIGlmIChhcnJbaV0pIHtcbiAgICAgICAgaGFzQW5zd2VyID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gSXMgdGhpcyBjbGllbnQtc2lkZSBncmFkaW5nLCBvciBzZXJ2ZXItc2lkZSBncmFkaW5nP1xuICAgIGlmICh0aGlzLmZlZWRiYWNrQXJyYXkpIHtcbiAgICAgIC8vIEZvciBjbGllbnQtc2lkZSBncmFkaW5nLCByZS1nZW5lcmF0ZSBmZWVkYmFjayBpZiB0aGVyZSdzIGFuIGFuc3dlci5cbiAgICAgIGlmIChoYXNBbnN3ZXIpIHtcbiAgICAgICAgdGhpcy5jaGVja0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRm9yIHNlcnZlci1zaWRlIGdyYWRpbmcsIHVzZSB0aGUgcHJvdmlkZWQgZmVlZGJhY2sgZnJvbSB0aGUgc2VydmVyIG9yIGxvY2FsIHN0b3JhZ2UuXG4gICAgICB0aGlzLmRpc3BsYXlGZWVkID0gZGF0YS5kaXNwbGF5RmVlZDtcbiAgICAgIHRoaXMuY29ycmVjdCA9IGRhdGEuY29ycmVjdDtcbiAgICAgIHRoaXMuaXNDb3JyZWN0QXJyYXkgPSBkYXRhLmlzQ29ycmVjdEFycmF5O1xuICAgICAgLy8gT25seSByZW5kZXIgaWYgYWxsIHRoZSBkYXRhIGlzIHByZXNlbnQ7IGxvY2FsIHN0b3JhZ2UgbWlnaHQgaGF2ZSBvbGQgZGF0YSBtaXNzaW5nIHNvbWUgb2YgdGhlc2UgaXRlbXMuXG4gICAgICBpZiAoXG4gICAgICAgIHR5cGVvZiB0aGlzLmRpc3BsYXlGZWVkICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgIHR5cGVvZiB0aGlzLmNvcnJlY3QgIT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICAgICAgdHlwZW9mIHRoaXMuaXNDb3JyZWN0QXJyYXkgIT09IFwidW5kZWZpbmVkXCJcbiAgICAgICkge1xuICAgICAgICB0aGlzLnJlbmRlckZlZWRiYWNrKCk7XG4gICAgICB9XG4gICAgICAvLyBGb3Igc2VydmVyLXNpZGUgZHluYW1pYyBwcm9ibGVtcywgc2hvdyB0aGUgcmVuZGVyZWQgcHJvYmxlbSB0ZXh0LlxuICAgICAgdGhpcy5wcm9ibGVtSHRtbCA9IGRhdGEucHJvYmxlbUh0bWw7XG4gICAgICBpZiAodGhpcy5wcm9ibGVtSHRtbCkge1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2LmlubmVySFRNTCA9IHRoaXMucHJvYmxlbUh0bWw7XG4gICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuZGVzY3JpcHRpb25EaXYpO1xuICAgICAgICB0aGlzLnNldHVwQmxhbmtzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2hlY2tMb2NhbFN0b3JhZ2UoKSB7XG4gICAgLy8gTG9hZHMgcHJldmlvdXMgYW5zd2VycyBmcm9tIGxvY2FsIHN0b3JhZ2UgaWYgdGhleSBleGlzdFxuICAgIHZhciBzdG9yZWREYXRhO1xuICAgIGlmICh0aGlzLmdyYWRlcmFjdGl2ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgbGVuID0gbG9jYWxTdG9yYWdlLmxlbmd0aDtcbiAgICBpZiAobGVuID4gMCkge1xuICAgICAgdmFyIGV4ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG4gICAgICBpZiAoZXggIT09IG51bGwpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBzdG9yZWREYXRhID0gSlNPTi5wYXJzZShleCk7XG4gICAgICAgICAgdmFyIGFyciA9IHN0b3JlZERhdGEuYW5zd2VyO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAvLyBlcnJvciB3aGlsZSBwYXJzaW5nOyBsaWtlbHkgZHVlIHRvIGJhZCB2YWx1ZSBzdG9yZWQgaW4gc3RvcmFnZVxuICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLCBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzdG9yZUFuc3dlcnMoc3RvcmVkRGF0YSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0TG9jYWxTdG9yYWdlKGRhdGEpIHtcbiAgICBsZXQga2V5ID0gdGhpcy5sb2NhbFN0b3JhZ2VLZXkoKTtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgfVxuXG4gIGNoZWNrQ3VycmVudEFuc3dlcigpIHtcbiAgICAvLyBTdGFydCBvZiB0aGUgZXZhbHVhdGlvbiBjaGFpblxuICAgIHRoaXMuaXNDb3JyZWN0QXJyYXkgPSBbXTtcbiAgICB0aGlzLmRpc3BsYXlGZWVkID0gW107XG4gICAgY29uc3QgcGNhID0gdGhpcy5wcmVwYXJlQ2hlY2tBbnN3ZXJzKCk7XG5cbiAgICBpZiAodGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgaWYgKGVCb29rQ29uZmlnLmVuYWJsZUNvbXBhcmVNZSkge1xuICAgICAgICB0aGlzLmVuYWJsZUNvbXBhcmVCdXR0b24oKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBHcmFkZSBsb2NhbGx5IGlmIHdlIGNhbid0IGFzayB0aGUgc2VydmVyIHRvIGdyYWRlLlxuICAgIGlmICh0aGlzLmZlZWRiYWNrQXJyYXkpIHtcbiAgICAgIFtcbiAgICAgICAgLy8gQW4gYXJyYXkgb2YgSFRNTCBmZWVkYmFjay5cbiAgICAgICAgdGhpcy5kaXNwbGF5RmVlZCxcbiAgICAgICAgLy8gdHJ1ZSwgZmFsc2UsIG9yIG51bGwgKHRoZSBxdWVzdGlvbiB3YXNuJ3QgYW5zd2VyZWQpLlxuICAgICAgICB0aGlzLmNvcnJlY3QsXG4gICAgICAgIC8vIEFuIGFycmF5IG9mIHRydWUsIGZhbHNlLCBvciBudWxsICh0aGUgcXVlc3Rpb24gd2Fzbid0IGFuc3dlcmVkKS5cbiAgICAgICAgdGhpcy5pc0NvcnJlY3RBcnJheSxcbiAgICAgICAgdGhpcy5wZXJjZW50XG4gICAgICBdID0gY2hlY2tBbnN3ZXJzQ29yZSguLi5wY2EpO1xuICAgICAgaWYgKCF0aGlzLmlzVGltZWQpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJGZWVkYmFjaygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIElucHV0czpcbiAgLy9cbiAgLy8gLSBTdHJpbmdzIGVudGVyZWQgYnkgdGhlIHN0dWRlbnQgaW4gYGB0aGlzLmJsYW5rQXJyYXlbaV0udmFsdWVgYC5cbiAgLy8gLSBGZWVkYmFjayBpbiBgYHRoaXMuZmVlZGJhY2tBcnJheWBgLlxuICBwcmVwYXJlQ2hlY2tBbnN3ZXJzKCkge1xuICAgIHRoaXMuZ2l2ZW5fYXJyID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsYW5rQXJyYXkubGVuZ3RoOyBpKyspXG4gICAgICB0aGlzLmdpdmVuX2Fyci5wdXNoKHRoaXMuYmxhbmtBcnJheVtpXS52YWx1ZSk7XG4gICAgcmV0dXJuIFt0aGlzLmJsYW5rTmFtZXMsIHRoaXMuZ2l2ZW5fYXJyLCB0aGlzLmZlZWRiYWNrQXJyYXksIHRoaXMuZHluX3ZhcnNfZXZhbF07XG4gIH1cblxuICAvLyBfYHJhbmRvbWl6ZWA6IFRoaXMgaGFuZGxlcyBhIGNsaWNrIHRvIHRoZSBcIlJhbmRvbWl6ZVwiIGJ1dHRvbi5cbiAgYXN5bmMgcmFuZG9taXplKCkge1xuICAgIC8vIFVzZSB0aGUgY2xpZW50LXNpZGUgY2FzZSBvciB0aGUgc2VydmVyLXNpZGUgY2FzZT9cbiAgICBpZiAodGhpcy5mZWVkYmFja0FycmF5KSB7XG4gICAgICAvLyBUaGlzIGlzIHRoZSBjbGllbnQtc2lkZSBjYXNlLlxuICAgICAgLy9cbiAgICAgIHRoaXMuc2VlZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIgKiogMzIpO1xuICAgICAgdGhpcy5yZW5kZXJEeW5hbWljQ29udGVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaGlzIGlzIHRoZSBzZXJ2ZXItc2lkZSBjYXNlLiBTZW5kIGEgcmVxdWVzdCB0byB0aGUgYHJlc3VsdHMgPGdldEFzc2Vzc1Jlc3VsdHM+YCBlbmRwb2ludCB3aXRoIGBgbmV3X3NlZWRgYCBzZXQgdG8gVHJ1ZS5cbiAgICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdChcIi9hc3Nlc3NtZW50L3Jlc3VsdHNcIiwge1xuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgIGNvdXJzZTogZUJvb2tDb25maWcuY291cnNlLFxuICAgICAgICAgIGV2ZW50OiBcImZpbGxiXCIsXG4gICAgICAgICAgc2lkOiB0aGlzLnNpZCxcbiAgICAgICAgICBuZXdfc2VlZDogdHJ1ZSxcbiAgICAgICAgfSksXG4gICAgICAgIGhlYWRlcnM6IHRoaXMuanNvbkhlYWRlcnMsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGFsZXJ0KGBIVFRQIGVycm9yIGdldHRpbmcgcmVzdWx0czogJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgY29uc3QgcmVzID0gZGF0YS5kZXRhaWw7XG4gICAgICB0aGlzLnNlZWQgPSByZXMuc2VlZDtcbiAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MID0gcmVzLnByb2JsZW1IdG1sO1xuICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5kZXNjcmlwdGlvbkRpdik7XG4gICAgICB0aGlzLnNldHVwQmxhbmtzKCk7XG4gICAgfVxuICAgIC8vIFdoZW4gZ2V0dGluZyBhIG5ldyBzZWVkLCBjbGVhciBhbGwgdGhlIG9sZCBhbnN3ZXJzIGFuZCBmZWVkYmFjay5cbiAgICB0aGlzLmdpdmVuX2FyciA9IEFycmF5KHRoaXMuYmxhbmtBcnJheS5sZW4pLmZpbGwoXCJcIik7XG4gICAgJCh0aGlzLmJsYW5rQXJyYXkpLmF0dHIoXCJ2YWx1ZVwiLCBcIlwiKTtcbiAgICB0aGlzLmNsZWFyRmVlZGJhY2tEaXYoKTtcbiAgICB0aGlzLnNhdmVBbnN3ZXJzTG9jYWxseU9ubHkoKTtcbiAgfVxuXG4gIC8vIFNhdmUgdGhlIGFuc3dlcnMgYW5kIGFzc29jaWF0ZWQgZGF0YSBsb2NhbGx5OyBkb24ndCBzYXZlIGZlZWRiYWNrIHByb3ZpZGVkIGJ5IHRoZSBzZXJ2ZXIgZm9yIHRoaXMgYW5zd2VyLiBJdCBhc3N1bWVzIHRoYXQgYGB0aGlzLmdpdmVuX2FycmBgIGNvbnRhaW5zIHRoZSBjdXJyZW50IGFuc3dlcnMuXG4gIHNhdmVBbnN3ZXJzTG9jYWxseU9ubHkoKSB7XG4gICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2Uoe1xuICAgICAgLy8gVGhlIHNlZWQgaXMgdXNlZCBmb3IgY2xpZW50LXNpZGUgb3BlcmF0aW9uLCBidXQgZG9lc24ndCBtYXR0ZXIgZm9yIHNlcnZlci1zaWRlLlxuICAgICAgc2VlZDogdGhpcy5zZWVkLFxuICAgICAgYW5zd2VyOiBKU09OLnN0cmluZ2lmeSh0aGlzLmdpdmVuX2FyciksXG4gICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCksXG4gICAgICAvLyBUaGlzIGlzIG9ubHkgbmVlZGVkIGZvciBzZXJ2ZXItc2lkZSBncmFkaW5nIHdpdGggZHluYW1pYyBwcm9ibGVtcy5cbiAgICAgIHByb2JsZW1IdG1sOiB0aGlzLmRlc2NyaXB0aW9uRGl2LmlubmVySFRNTCxcbiAgICB9KTtcbiAgfVxuXG4gIC8vIF9gbG9nQ3VycmVudEFuc3dlcmA6IFNhdmUgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHByb2JsZW0gdG8gbG9jYWwgc3RvcmFnZSBhbmQgdGhlIHNlcnZlcjsgZGlzcGxheSBzZXJ2ZXIgZmVlZGJhY2suXG4gIGFzeW5jIGxvZ0N1cnJlbnRBbnN3ZXIoc2lkKSB7XG4gICAgbGV0IGFuc3dlciA9IEpTT04uc3RyaW5naWZ5KHRoaXMuZ2l2ZW5fYXJyKTtcbiAgICBsZXQgZmVlZGJhY2sgPSB0cnVlO1xuICAgIC8vIFNhdmUgdGhlIGFuc3dlciBsb2NhbGx5LlxuICAgIHRoaXMuc2F2ZUFuc3dlcnNMb2NhbGx5T25seSgpO1xuICAgIC8vIFNhdmUgdGhlIGFuc3dlciB0byB0aGUgc2VydmVyLlxuICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICBldmVudDogXCJmaWxsYlwiLFxuICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgYWN0OiBhbnN3ZXIgfHwgXCJcIixcbiAgICAgIHNlZWQ6IHRoaXMuc2VlZCxcbiAgICAgIGFuc3dlcjogYW5zd2VyIHx8IFwiXCIsXG4gICAgICBjb3JyZWN0OiB0aGlzLmNvcnJlY3QgPyBcIlRcIiA6IFwiRlwiLFxuICAgICAgcGVyY2VudDogdGhpcy5wZXJjZW50LFxuICAgIH07XG4gICAgaWYgKHR5cGVvZiBzaWQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGRhdGEuc2lkID0gc2lkO1xuICAgICAgZmVlZGJhY2sgPSBmYWxzZTtcbiAgICB9XG4gICAgY29uc3Qgc2VydmVyX2RhdGEgPSBhd2FpdCB0aGlzLmxvZ0Jvb2tFdmVudChkYXRhKTtcbiAgICBpZiAoIWZlZWRiYWNrKSByZXR1cm47XG4gICAgLy8gTm9uLXNlcnZlciBzaWRlIGdyYWRlZCBwcm9ibGVtcyBhcmUgZG9uZSBhdCB0aGlzIHBvaW50OyBsaWtld2lzZSwgc3RvcCBoZXJlIGlmIHRoZSBzZXJ2ZXIgZGlkbid0IHJlc3BvbmQuXG4gICAgaWYgKHRoaXMuZmVlZGJhY2tBcnJheSB8fCAhc2VydmVyX2RhdGEpIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICAvLyBUaGlzIGlzIHRoZSBzZXJ2ZXItc2lkZSBjYXNlLiBPbiBzdWNjZXNzLCB1cGRhdGUgdGhlIGZlZWRiYWNrIGZyb20gdGhlIHNlcnZlcidzIGdyYWRlLlxuICAgIGNvbnN0IHJlcyA9IHNlcnZlcl9kYXRhLmRldGFpbDtcbiAgICB0aGlzLnRpbWVzdGFtcCA9IHJlcy50aW1lc3RhbXA7XG4gICAgdGhpcy5kaXNwbGF5RmVlZCA9IHJlcy5kaXNwbGF5RmVlZDtcbiAgICB0aGlzLmNvcnJlY3QgPSByZXMuY29ycmVjdDtcbiAgICB0aGlzLmlzQ29ycmVjdEFycmF5ID0gcmVzLmlzQ29ycmVjdEFycmF5O1xuICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKHtcbiAgICAgIHNlZWQ6IHRoaXMuc2VlZCxcbiAgICAgIGFuc3dlcjogYW5zd2VyLFxuICAgICAgdGltZXN0YW1wOiB0aGlzLnRpbWVzdGFtcCxcbiAgICAgIHByb2JsZW1IdG1sOiB0aGlzLmRlc2NyaXB0aW9uRGl2LmlubmVySFRNTCxcbiAgICAgIGRpc3BsYXlGZWVkOiB0aGlzLmRpc3BsYXlGZWVkLFxuICAgICAgY29ycmVjdDogdGhpcy5jb3JyZWN0LFxuICAgICAgaXNDb3JyZWN0QXJyYXk6IHRoaXMuaXNDb3JyZWN0QXJyYXksXG4gICAgfSk7XG4gICAgdGhpcy5yZW5kZXJGZWVkYmFjaygpO1xuICAgIHJldHVybiBzZXJ2ZXJfZGF0YTtcbiAgfVxuXG4gIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09IEV2YWx1YXRpb24gb2YgYW5zd2VyIGFuZCA9PT1cbiAgICA9PT0gICAgIGRpc3BsYXkgZmVlZGJhY2sgICAgID09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gIHJlbmRlckZlZWRiYWNrKCkge1xuICAgIGlmICh0aGlzLmNvcnJlY3QpIHtcbiAgICAgICQodGhpcy5mZWVkQmFja0RpdikuYXR0cihcImNsYXNzXCIsIFwiYWxlcnQgYWxlcnQtaW5mb1wiKTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICQodGhpcy5ibGFua0FycmF5W2pdKS5yZW1vdmVDbGFzcyhcImlucHV0LXZhbGlkYXRpb24tZXJyb3JcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmRpc3BsYXlGZWVkID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheUZlZWQgPSBcIlwiO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmJsYW5rQXJyYXkubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKHRoaXMuaXNDb3JyZWN0QXJyYXlbal0gIT09IHRydWUpIHtcbiAgICAgICAgICAkKHRoaXMuYmxhbmtBcnJheVtqXSkuYWRkQ2xhc3MoXCJpbnB1dC12YWxpZGF0aW9uLWVycm9yXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQodGhpcy5ibGFua0FycmF5W2pdKS5yZW1vdmVDbGFzcyhcImlucHV0LXZhbGlkYXRpb24tZXJyb3JcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgICQodGhpcy5mZWVkQmFja0RpdikuYXR0cihcImNsYXNzXCIsIFwiYWxlcnQgYWxlcnQtZGFuZ2VyXCIpO1xuICAgIH1cbiAgICB2YXIgZmVlZGJhY2tfaHRtbCA9IFwiPHVsPlwiO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5kaXNwbGF5RmVlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGRmID0gdGhpcy5kaXNwbGF5RmVlZFtpXTtcbiAgICAgIC8vIFJlbmRlciBhbnkgZHluYW1pYyBmZWVkYmFjayBpbiB0aGUgcHJvdmlkZWQgZmVlZGJhY2ssIGZvciBjbGllbnQtc2lkZSBncmFkaW5nIG9mIGR5bmFtaWMgcHJvYmxlbXMuXG4gICAgICBpZiAodHlwZW9mIHRoaXMuZHluX3ZhcnMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgZGYgPSByZW5kZXJEeW5hbWljRmVlZGJhY2soXG4gICAgICAgICAgdGhpcy5ibGFua05hbWVzLFxuICAgICAgICAgIHRoaXMuZ2l2ZW5fYXJyLFxuICAgICAgICAgIGksXG4gICAgICAgICAgZGYsXG4gICAgICAgICAgdGhpcy5keW5fdmFyc19ldmFsXG4gICAgICAgICk7XG4gICAgICAgIC8vIENvbnZlcnQgdGhlIHJldHVybmVkIE5vZGVMaXN0IGludG8gYSBzdHJpbmcgb2YgSFRNTC5cbiAgICAgICAgZGYgPSBkZiA/IGRmWzBdLnBhcmVudEVsZW1lbnQuaW5uZXJIVE1MIDogXCJObyBmZWVkYmFjayBwcm92aWRlZFwiO1xuICAgICAgfVxuICAgICAgZmVlZGJhY2tfaHRtbCArPSBgPGxpPiR7ZGZ9PC9saT5gO1xuICAgIH1cbiAgICBmZWVkYmFja19odG1sICs9IFwiPC91bD5cIjtcbiAgICAvLyBSZW1vdmUgdGhlIGxpc3QgaWYgaXQncyBqdXN0IG9uZSBlbGVtZW50LlxuICAgIGlmICh0aGlzLmRpc3BsYXlGZWVkLmxlbmd0aCA9PSAxKSB7XG4gICAgICBmZWVkYmFja19odG1sID0gZmVlZGJhY2tfaHRtbC5zbGljZShcbiAgICAgICAgXCI8dWw+PGxpPlwiLmxlbmd0aCxcbiAgICAgICAgLVwiPC9saT48L3VsPlwiLmxlbmd0aFxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5mZWVkQmFja0Rpdi5pbm5lckhUTUwgPSBmZWVkYmFja19odG1sO1xuICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuZmVlZEJhY2tEaXYpO1xuICB9XG5cbiAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09IEZ1bmN0aW9ucyBmb3IgY29tcGFyZSBidXR0b24gPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gIGVuYWJsZUNvbXBhcmVCdXR0b24oKSB7XG4gICAgdGhpcy5jb21wYXJlQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gIH1cbiAgLy8gX2Bjb21wYXJlRklUQkFuc3dlcnNgXG4gIGNvbXBhcmVGSVRCQW5zd2VycygpIHtcbiAgICB2YXIgZGF0YSA9IHt9O1xuICAgIGRhdGEuZGl2X2lkID0gdGhpcy5kaXZpZDtcbiAgICBkYXRhLmNvdXJzZSA9IGVCb29rQ29uZmlnLmNvdXJzZTtcbiAgICBqUXVlcnkuZ2V0KFxuICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2Fzc2Vzc21lbnQvZ2V0dG9wMTBBbnN3ZXJzYCxcbiAgICAgIGRhdGEsXG4gICAgICB0aGlzLmNvbXBhcmVGSVRCXG4gICAgKTtcbiAgfVxuICBjb21wYXJlRklUQihkYXRhLCBzdGF0dXMsIHdoYXRldmVyKSB7XG4gICAgdmFyIGFuc3dlcnMgPSBkYXRhLmRldGFpbC5yZXM7XG4gICAgdmFyIG1pc2MgPSBkYXRhLmRldGFpbC5taXNjZGF0YTtcbiAgICB2YXIgYm9keSA9IFwiPHRhYmxlPlwiO1xuICAgIGJvZHkgKz0gXCI8dHI+PHRoPkFuc3dlcjwvdGg+PHRoPkNvdW50PC90aD48L3RyPlwiO1xuICAgIGZvciAodmFyIHJvdyBpbiBhbnN3ZXJzKSB7XG4gICAgICBib2R5ICs9XG4gICAgICAgIFwiPHRyPjx0ZD5cIiArXG4gICAgICAgIGFuc3dlcnNbcm93XS5hbnN3ZXIgK1xuICAgICAgICBcIjwvdGQ+PHRkPlwiICtcbiAgICAgICAgYW5zd2Vyc1tyb3ddLmNvdW50ICtcbiAgICAgICAgXCIgdGltZXM8L3RkPjwvdHI+XCI7XG4gICAgfVxuICAgIGJvZHkgKz0gXCI8L3RhYmxlPlwiO1xuICAgIHZhciBodG1sID1cbiAgICAgIFwiPGRpdiBjbGFzcz0nbW9kYWwgZmFkZSc+XCIgK1xuICAgICAgXCIgICAgPGRpdiBjbGFzcz0nbW9kYWwtZGlhbG9nIGNvbXBhcmUtbW9kYWwnPlwiICtcbiAgICAgIFwiICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1jb250ZW50Jz5cIiArXG4gICAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9J21vZGFsLWhlYWRlcic+XCIgK1xuICAgICAgXCIgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzPSdjbG9zZScgZGF0YS1kaXNtaXNzPSdtb2RhbCcgYXJpYS1oaWRkZW49J3RydWUnPiZ0aW1lczs8L2J1dHRvbj5cIiArXG4gICAgICBcIiAgICAgICAgICAgICAgICA8aDQgY2xhc3M9J21vZGFsLXRpdGxlJz5Ub3AgQW5zd2VyczwvaDQ+XCIgK1xuICAgICAgXCIgICAgICAgICAgICA8L2Rpdj5cIiArXG4gICAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9J21vZGFsLWJvZHknPlwiICtcbiAgICAgIGJvZHkgK1xuICAgICAgXCIgICAgICAgICAgICA8L2Rpdj5cIiArXG4gICAgICBcIiAgICAgICAgPC9kaXY+XCIgK1xuICAgICAgXCIgICAgPC9kaXY+XCIgK1xuICAgICAgXCI8L2Rpdj5cIjtcbiAgICB2YXIgZWwgPSAkKGh0bWwpO1xuICAgIGVsLm1vZGFsKCk7XG4gIH1cblxuICBkaXNhYmxlSW50ZXJhY3Rpb24oKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsYW5rQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuYmxhbmtBcnJheVtpXS5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuICB9XG59XG5cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PSBGaW5kIHRoZSBjdXN0b20gSFRNTCB0YWdzIGFuZCA9PVxuPT0gICBleGVjdXRlIG91ciBjb2RlIG9uIHRoZW0gICAgPT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4kKGRvY3VtZW50KS5vbihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICQoXCJbZGF0YS1jb21wb25lbnQ9ZmlsbGludGhlYmxhbmtdXCIpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgdmFyIG9wdHMgPSB7XG4gICAgICBvcmlnOiB0aGlzLFxuICAgICAgdXNlUnVuZXN0b25lU2VydmljZXM6IGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzLFxuICAgIH07XG4gICAgaWYgKCQodGhpcykuY2xvc2VzdChcIltkYXRhLWNvbXBvbmVudD10aW1lZEFzc2Vzc21lbnRdXCIpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAvLyBJZiB0aGlzIGVsZW1lbnQgZXhpc3RzIHdpdGhpbiBhIHRpbWVkIGNvbXBvbmVudCwgZG9uJ3QgcmVuZGVyIGl0IGhlcmVcbiAgICAgIHRyeSB7XG4gICAgICAgIEZJVEJMaXN0W3RoaXMuaWRdID0gbmV3IEZJVEIob3B0cyk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsXG4gICAgICAgICAgYEVycm9yIHJlbmRlcmluZyBGaWxsIGluIHRoZSBCbGFuayBQcm9ibGVtICR7dGhpcy5pZH1cbiAgICAgICAgICAgICAgICAgICAgIERldGFpbHM6ICR7ZXJyfWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufSk7XG4iLCIvKi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmFsZWFQUk5HIDEuMVxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5odHRwczovL2dpdGh1Yi5jb20vbWFjbWNtZWFucy9hbGVhUFJORy9ibG9iL21hc3Rlci9hbGVhUFJORy0xLjEuanNcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuT3JpZ2luYWwgd29yayBjb3B5cmlnaHQgwqkgMjAxMCBKb2hhbm5lcyBCYWFnw7hlLCB1bmRlciBNSVQgbGljZW5zZVxuVGhpcyBpcyBhIGRlcml2YXRpdmUgd29yayBjb3B5cmlnaHQgKGMpIDIwMTctMjAyMCwgVy4gTWFjXCIgTWNNZWFucywgdW5kZXIgQlNEIGxpY2Vuc2UuXG5SZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXQgbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4xLiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4yLiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4zLiBOZWl0aGVyIHRoZSBuYW1lIG9mIHRoZSBjb3B5cmlnaHQgaG9sZGVyIG5vciB0aGUgbmFtZXMgb2YgaXRzIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXG5USElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIEhPTERFUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vKi9cbmV4cG9ydCBmdW5jdGlvbiBhbGVhUFJORygpIHtcbiAgICByZXR1cm4oIGZ1bmN0aW9uKCBhcmdzICkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICBjb25zdCB2ZXJzaW9uID0gJ2FsZWFQUk5HIDEuMS4wJztcblxuICAgICAgICB2YXIgczBcbiAgICAgICAgICAgICwgczFcbiAgICAgICAgICAgICwgczJcbiAgICAgICAgICAgICwgY1xuICAgICAgICAgICAgLCB1aW50YSA9IG5ldyBVaW50MzJBcnJheSggMyApXG4gICAgICAgICAgICAsIGluaXRpYWxBcmdzXG4gICAgICAgICAgICAsIG1hc2h2ZXIgPSAnJ1xuICAgICAgICA7XG5cbiAgICAgICAgLyogcHJpdmF0ZTogaW5pdGlhbGl6ZXMgZ2VuZXJhdG9yIHdpdGggc3BlY2lmaWVkIHNlZWQgKi9cbiAgICAgICAgZnVuY3Rpb24gX2luaXRTdGF0ZSggX2ludGVybmFsU2VlZCApIHtcbiAgICAgICAgICAgIHZhciBtYXNoID0gTWFzaCgpO1xuXG4gICAgICAgICAgICAvLyBpbnRlcm5hbCBzdGF0ZSBvZiBnZW5lcmF0b3JcbiAgICAgICAgICAgIHMwID0gbWFzaCggJyAnICk7XG4gICAgICAgICAgICBzMSA9IG1hc2goICcgJyApO1xuICAgICAgICAgICAgczIgPSBtYXNoKCAnICcgKTtcblxuICAgICAgICAgICAgYyA9IDE7XG5cbiAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgX2ludGVybmFsU2VlZC5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgICAgICBzMCAtPSBtYXNoKCBfaW50ZXJuYWxTZWVkWyBpIF0gKTtcbiAgICAgICAgICAgICAgICBpZiggczAgPCAwICkgeyBzMCArPSAxOyB9XG5cbiAgICAgICAgICAgICAgICBzMSAtPSBtYXNoKCBfaW50ZXJuYWxTZWVkWyBpIF0gKTtcbiAgICAgICAgICAgICAgICBpZiggczEgPCAwICkgeyBzMSArPSAxOyB9XG5cbiAgICAgICAgICAgICAgICBzMiAtPSBtYXNoKCBfaW50ZXJuYWxTZWVkWyBpIF0gKTtcbiAgICAgICAgICAgICAgICBpZiggczIgPCAwICkgeyBzMiArPSAxOyB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hc2h2ZXIgPSBtYXNoLnZlcnNpb247XG5cbiAgICAgICAgICAgIG1hc2ggPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHByaXZhdGU6IGRlcGVuZGVudCBzdHJpbmcgaGFzaCBmdW5jdGlvbiAqL1xuICAgICAgICBmdW5jdGlvbiBNYXNoKCkge1xuICAgICAgICAgICAgdmFyIG4gPSA0MDIyODcxMTk3OyAvLyAweGVmYzgyNDlkXG5cbiAgICAgICAgICAgIHZhciBtYXNoID0gZnVuY3Rpb24oIGRhdGEgKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgICAgIC8vIGNhY2hlIHRoZSBsZW5ndGhcbiAgICAgICAgICAgICAgICBmb3IoIHZhciBpID0gMCwgbCA9IGRhdGEubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuICAgICAgICAgICAgICAgICAgICBuICs9IGRhdGEuY2hhckNvZGVBdCggaSApO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBoID0gMC4wMjUxOTYwMzI4MjQxNjkzOCAqIG47XG5cbiAgICAgICAgICAgICAgICAgICAgbiAgPSBoID4+PiAwO1xuICAgICAgICAgICAgICAgICAgICBoIC09IG47XG4gICAgICAgICAgICAgICAgICAgIGggKj0gbjtcbiAgICAgICAgICAgICAgICAgICAgbiAgPSBoID4+PiAwO1xuICAgICAgICAgICAgICAgICAgICBoIC09IG47XG4gICAgICAgICAgICAgICAgICAgIG4gKz0gaCAqIDQyOTQ5NjcyOTY7IC8vIDB4MTAwMDAwMDAwICAgICAgMl4zMlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gKCBuID4+PiAwICkgKiAyLjMyODMwNjQzNjUzODY5NjNlLTEwOyAvLyAyXi0zMlxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbWFzaC52ZXJzaW9uID0gJ01hc2ggMC45JztcbiAgICAgICAgICAgIHJldHVybiBtYXNoO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLyogcHJpdmF0ZTogY2hlY2sgaWYgbnVtYmVyIGlzIGludGVnZXIgKi9cbiAgICAgICAgZnVuY3Rpb24gX2lzSW50ZWdlciggX2ludCApIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludCggX2ludCwgMTAgKSA9PT0gX2ludDtcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHJldHVybiBhIDMyLWJpdCBmcmFjdGlvbiBpbiB0aGUgcmFuZ2UgWzAsIDFdXG4gICAgICAgIFRoaXMgaXMgdGhlIG1haW4gZnVuY3Rpb24gcmV0dXJuZWQgd2hlbiBhbGVhUFJORyBpcyBpbnN0YW50aWF0ZWRcbiAgICAgICAgKi9cbiAgICAgICAgdmFyIHJhbmRvbSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHQgPSAyMDkxNjM5ICogczAgKyBjICogMi4zMjgzMDY0MzY1Mzg2OTYzZS0xMDsgLy8gMl4tMzJcblxuICAgICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgICAgIHMxID0gczI7XG5cbiAgICAgICAgICAgIHJldHVybiBzMiA9IHQgLSAoIGMgPSB0IHwgMCApO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogcmV0dXJuIGEgNTMtYml0IGZyYWN0aW9uIGluIHRoZSByYW5nZSBbMCwgMV0gKi9cbiAgICAgICAgcmFuZG9tLmZyYWN0NTMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiByYW5kb20oKSArICggcmFuZG9tKCkgKiAweDIwMDAwMCAgfCAwICkgKiAxLjExMDIyMzAyNDYyNTE1NjVlLTE2OyAvLyAyXi01M1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogcmV0dXJuIGFuIHVuc2lnbmVkIGludGVnZXIgaW4gdGhlIHJhbmdlIFswLCAyXjMyXSAqL1xuICAgICAgICByYW5kb20uaW50MzIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiByYW5kb20oKSAqIDB4MTAwMDAwMDAwOyAvLyAyXjMyXG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiBhZHZhbmNlIHRoZSBnZW5lcmF0b3IgdGhlIHNwZWNpZmllZCBhbW91bnQgb2YgY3ljbGVzICovXG4gICAgICAgIHJhbmRvbS5jeWNsZSA9IGZ1bmN0aW9uKCBfcnVuICkge1xuICAgICAgICAgICAgX3J1biA9IHR5cGVvZiBfcnVuID09PSAndW5kZWZpbmVkJyA/IDEgOiArX3J1bjtcbiAgICAgICAgICAgIGlmKCBfcnVuIDwgMSApIHsgX3J1biA9IDE7IH1cbiAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgX3J1bjsgaSsrICkgeyByYW5kb20oKTsgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogcmV0dXJuIGluY2x1c2l2ZSByYW5nZSAqL1xuICAgICAgICByYW5kb20ucmFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBsb0JvdW5kXG4gICAgICAgICAgICAgICAgLCBoaUJvdW5kXG4gICAgICAgICAgICA7XG5cbiAgICAgICAgICAgIGlmKCBhcmd1bWVudHMubGVuZ3RoID09PSAxICkge1xuICAgICAgICAgICAgICAgIGxvQm91bmQgPSAwO1xuICAgICAgICAgICAgICAgIGhpQm91bmQgPSBhcmd1bWVudHNbIDAgXTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb0JvdW5kID0gYXJndW1lbnRzWyAwIF07XG4gICAgICAgICAgICAgICAgaGlCb3VuZCA9IGFyZ3VtZW50c1sgMSBdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiggYXJndW1lbnRzWyAwIF0gPiBhcmd1bWVudHNbIDEgXSApIHtcbiAgICAgICAgICAgICAgICBsb0JvdW5kID0gYXJndW1lbnRzWyAxIF07XG4gICAgICAgICAgICAgICAgaGlCb3VuZCA9IGFyZ3VtZW50c1sgMCBdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyByZXR1cm4gaW50ZWdlclxuICAgICAgICAgICAgaWYoIF9pc0ludGVnZXIoIGxvQm91bmQgKSAmJiBfaXNJbnRlZ2VyKCBoaUJvdW5kICkgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoIHJhbmRvbSgpICogKCBoaUJvdW5kIC0gbG9Cb3VuZCArIDEgKSApICsgbG9Cb3VuZDtcblxuICAgICAgICAgICAgLy8gcmV0dXJuIGZsb2F0XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiByYW5kb20oKSAqICggaGlCb3VuZCAtIGxvQm91bmQgKSArIGxvQm91bmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiBpbml0aWFsaXplIGdlbmVyYXRvciB3aXRoIHRoZSBzZWVkIHZhbHVlcyB1c2VkIHVwb24gaW5zdGFudGlhdGlvbiAqL1xuICAgICAgICByYW5kb20ucmVzdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgX2luaXRTdGF0ZSggaW5pdGlhbEFyZ3MgKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHNlZWRpbmcgZnVuY3Rpb24gKi9cbiAgICAgICAgcmFuZG9tLnNlZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIF9pbml0U3RhdGUoIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSApO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogc2hvdyB0aGUgdmVyc2lvbiBvZiB0aGUgUk5HICovXG4gICAgICAgIHJhbmRvbS52ZXJzaW9uID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdmVyc2lvbjtcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHNob3cgdGhlIHZlcnNpb24gb2YgdGhlIFJORyBhbmQgdGhlIE1hc2ggc3RyaW5nIGhhc2hlciAqL1xuICAgICAgICByYW5kb20udmVyc2lvbnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB2ZXJzaW9uICsgJywgJyArIG1hc2h2ZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gd2hlbiBubyBzZWVkIGlzIHNwZWNpZmllZCwgY3JlYXRlIGEgcmFuZG9tIG9uZSBmcm9tIFdpbmRvd3MgQ3J5cHRvIChNb250ZSBDYXJsbyBhcHBsaWNhdGlvbilcbiAgICAgICAgaWYoIGFyZ3MubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKCB1aW50YSApO1xuICAgICAgICAgICAgIGFyZ3MgPSBbIHVpbnRhWyAwIF0sIHVpbnRhWyAxIF0sIHVpbnRhWyAyIF0gXTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBzdG9yZSB0aGUgc2VlZCB1c2VkIHdoZW4gdGhlIFJORyB3YXMgaW5zdGFudGlhdGVkLCBpZiBhbnlcbiAgICAgICAgaW5pdGlhbEFyZ3MgPSBhcmdzO1xuXG4gICAgICAgIC8vIGluaXRpYWxpemUgdGhlIFJOR1xuICAgICAgICBfaW5pdFN0YXRlKCBhcmdzICk7XG5cbiAgICAgICAgcmV0dXJuIHJhbmRvbTtcblxuICAgIH0pKCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICkgKTtcbn07IiwiaW1wb3J0IEZJVEIgZnJvbSBcIi4vZml0Yi5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWRGSVRCIGV4dGVuZHMgRklUQiB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdGhpcy5yZW5kZXJUaW1lZEljb24odGhpcy5pbnB1dERpdik7XG4gICAgICAgIHRoaXMuaGlkZUJ1dHRvbnMoKTtcbiAgICAgICAgdGhpcy5uZWVkc1JlaW5pdGlhbGl6YXRpb24gPSB0cnVlO1xuICAgIH1cbiAgICBoaWRlQnV0dG9ucygpIHtcbiAgICAgICAgJCh0aGlzLnN1Ym1pdEJ1dHRvbikuaGlkZSgpO1xuICAgICAgICAkKHRoaXMuY29tcGFyZUJ1dHRvbikuaGlkZSgpO1xuICAgIH1cbiAgICByZW5kZXJUaW1lZEljb24oY29tcG9uZW50KSB7XG4gICAgICAgIC8vIHJlbmRlcnMgdGhlIGNsb2NrIGljb24gb24gdGltZWQgY29tcG9uZW50cy4gICAgVGhlIGNvbXBvbmVudCBwYXJhbWV0ZXJcbiAgICAgICAgLy8gaXMgdGhlIGVsZW1lbnQgdGhhdCB0aGUgaWNvbiBzaG91bGQgYmUgYXBwZW5kZWQgdG8uXG4gICAgICAgIHZhciB0aW1lSWNvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHZhciB0aW1lSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICAgICQodGltZUljb24pLmF0dHIoe1xuICAgICAgICAgICAgc3JjOiBcIi4uL19zdGF0aWMvY2xvY2sucG5nXCIsXG4gICAgICAgICAgICBzdHlsZTogXCJ3aWR0aDoxNXB4O2hlaWdodDoxNXB4XCIsXG4gICAgICAgIH0pO1xuICAgICAgICB0aW1lSWNvbkRpdi5jbGFzc05hbWUgPSBcInRpbWVUaXBcIjtcbiAgICAgICAgdGltZUljb25EaXYudGl0bGUgPSBcIlwiO1xuICAgICAgICB0aW1lSWNvbkRpdi5hcHBlbmRDaGlsZCh0aW1lSWNvbik7XG4gICAgICAgICQoY29tcG9uZW50KS5wcmVwZW5kKHRpbWVJY29uRGl2KTtcbiAgICB9XG4gICAgY2hlY2tDb3JyZWN0VGltZWQoKSB7XG4gICAgICAgIC8vIFJldHVybnMgaWYgdGhlIHF1ZXN0aW9uIHdhcyBjb3JyZWN0LCBpbmNvcnJlY3QsIG9yIHNraXBwZWQgKHJldHVybiBudWxsIGluIHRoZSBsYXN0IGNhc2UpXG4gICAgICAgIHN3aXRjaCAodGhpcy5jb3JyZWN0KSB7XG4gICAgICAgICAgICBjYXNlIHRydWU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiVFwiO1xuICAgICAgICAgICAgY2FzZSBmYWxzZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJGXCI7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGhpZGVGZWVkYmFjaygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsYW5rQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICQodGhpcy5ibGFua0FycmF5W2ldKS5yZW1vdmVDbGFzcyhcImlucHV0LXZhbGlkYXRpb24tZXJyb3JcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxuXG4gICAgcmVpbml0aWFsaXplTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLnNldHVwQmxhbmtzKCk7XG4gICAgfVxufVxuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5LmZpbGxpbnRoZWJsYW5rID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICBpZiAob3B0cy50aW1lZCkge1xuICAgICAgICByZXR1cm4gbmV3IFRpbWVkRklUQihvcHRzKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBGSVRCKG9wdHMpO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==