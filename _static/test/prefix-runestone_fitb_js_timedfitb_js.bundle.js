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
        msg_fitb_randomize: "Randomize",
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
/* harmony export */   checkAnswersCore: () => (/* binding */ checkAnswersCore),
/* harmony export */   renderDynamicContent: () => (/* binding */ renderDynamicContent),
/* harmony export */   renderDynamicFeedback: () => (/* binding */ renderDynamicFeedback)
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
                } else if ("number" in fbl[j]) {
                    // This is a number.
                    const [min, max] = fbl[j]["number"];
                    // Convert the given string to a number. While there are `lots of ways <https://coderwall.com/p/5tlhmw/converting-strings-to-number-in-javascript-pitfalls>`_ to do this; this version supports other bases (hex/binary/octal) as well as floats.
                    const actual = +given;
                    if (actual >= min && actual <= max) {
                        displayFeed.push(fbl[j]["feedback"]);
                        break;
                    }
                // If this is a dynamic solution, they should provide a testing function
                } else if (dyn_vars_eval) {
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
                // If this is NOT a dynamic solution, but given a testing function
                } else if ("solution_code" in fbl[j]) {
                    // Create a function to wrap the expression to evaluate. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function.
                    // Pass the answer, array of all answers, then all entries in ``this.dyn_vars_eval`` dict as function parameters.
                    const is_equal = window.Function(
                        "ans",
                        "ans_array",
                        `"use strict;"\nreturn ${fbl[j]["solution_code"]};`
                    )(given, given_arr);
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
                    // Undefined method of testing.
                    console.assert("number" in fbl[j]);
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
/* harmony export */   FITBList: () => (/* binding */ FITBList),
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
        // Check for older versions that have raw html content.
        if (dict_.problemHtml !== undefined) {
          this.problemHtml = dict_.problemHtml;
          this.dyn_vars = dict_.dyn_vars;
          this.blankNames = dict_.blankNames;
          this.feedbackArray = dict_.feedbackArray;
        } else {
          this.problemHtml = this.origElem.innerHTML;
          this.feedbackArray = dict_;
        }

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
                    case "BTM":
                        import_promises.push(
                            __webpack_require__.e(/*! import() */ "BTM_src_BTM_root_js").then(__webpack_require__.bind(__webpack_require__, /*! btm-expressions/src/BTM_root.js */ 84490))
                        );
                        break;
                    // Allow for local imports, usually from problems defined outside the Runestone Components.
                    default:
                        import_promises.push(
                            import(/* webpackIgnore: true */ import_)
                        );
                        break;
                }
            }

            // Combine the resulting module namespace objects when these promises resolve.
            imports_promise = Promise.all(import_promises)
                .then(
                    (module_namespace_arr) =>
                        (this.dyn_imports = Object.assign(
                            {},
                            ...module_namespace_arr
                        ))
                )
                .catch((err) => {
                    throw `Failed dynamic import: ${err}.`;
                });
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
                }
                // Case 3
                else if (has_static_seed && !is_client_dynamic) {
                    console.assert(
                        false,
                        "Warning: the provided static seed was ignored, because it only affects client-side, dynamic problems."
                    );
                }
                // Case 4
                else if (
                    has_static_seed &&
                    is_client_dynamic &&
                    !has_local_seed
                ) {
                    this.seed = dict_.static_seed;
                    this.renderDynamicContent();
                }
                // Case 5
                else if (
                    has_static_seed &&
                    is_client_dynamic &&
                    has_local_seed &&
                    this.seed !== dict_.static_seed
                ) {
                    console.assert(
                        false,
                        "Warning: the provided static seed was overridden by the seed found in local storage."
                    );
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
        this.queueMathJax(this.descriptionDiv);
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
            [html_nodes, this.dyn_vars_eval] = (0,_fitb_utils_js__WEBPACK_IMPORTED_MODULE_1__.renderDynamicContent)(
                this.seed,
                this.dyn_vars,
                this.dyn_imports,
                this.descriptionDiv.origInnerHTML,
                this.divid,
                this.prepareCheckAnswers.bind(this)
            );
            this.descriptionDiv.replaceChildren(...html_nodes);

            if (typeof this.dyn_vars_eval.afterContentRender === "function") {
                try {
                    this.dyn_vars_eval.afterContentRender(this.dyn_vars_eval);
                } catch (err) {
                    console.assert(
                        false,
                        `Error in problem ${this.divid} invoking afterContentRender`
                    );
                    throw err;
                }
            }

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
    restoreAnswers(data) {
        // Restore the seed first, since the dynamic render clears all the blanks.
        this.seed = data.seed;
        this.renderDynamicContent();
        this.queueMathJax(this.descriptionDiv);

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
                this.percent,
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
        return [
            this.blankNames,
            this.given_arr,
            this.feedbackArray,
            this.dyn_vars_eval,
        ];
    }

    // _`randomize`: This handles a click to the "Randomize" button.
    async randomize() {
        // Use the client-side case or the server-side case?
        if (this.feedbackArray) {
            // This is the client-side case.
            //
            this.seed = Math.floor(Math.random() * 2 ** 32);
            this.renderDynamicContent();
            this.queueMathJax(this.descriptionDiv);
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
                df = (df?.[0] !== undefined)
                    ? df[0].parentElement.innerHTML
                    : "No feedback provided";
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
        if (typeof MathJax !== "undefined") {
            this.queueMathJax(this.feedBackDiv);
        }
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
                window.componentMap[this.id] = FITBList[this.id];
            } catch (err) {
                console.assert(
                    false,
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
/* harmony export */   aleaPRNG: () => (/* binding */ aleaPRNG)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZV9maXRiX2pzX3RpbWVkZml0Yl9qcy5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDOzs7Ozs7Ozs7OztBQ1BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05EO0FBQ0E7QUFDQTtBQUNBOztBQUVhOztBQUVxQzs7QUFFbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyx1QkFBdUI7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLFlBQVksTUFBTTtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHlXQUF5VztBQUN6VztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQiwrREFBUTs7QUFFekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixJQUFJLFVBQVUsV0FBVztBQUMvQztBQUNBO0FBQ0Esd0JBQXdCLDJCQUEyQjtBQUNuRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxvQ0FBb0MsT0FBTztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04seURBQXlELE9BQU87QUFDaEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1Asc0NBQXNDLHlCQUF5QjtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0Isc0JBQXNCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnQkFBZ0I7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQSw4TEFBOEw7QUFDOUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLFlBQVkseUJBQXlCO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsWUFBWSx5QkFBeUI7QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUpBQW1KO0FBQ25KO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQztBQUMzQztBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixtQ0FBbUM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTixpRUFBaUUsTUFBTTtBQUN2RTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvRkFBb0Y7QUFDcEY7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6WUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQztBQUMzQztBQUNBO0FBQ0E7QUFD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QTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBLEtBQUs7QUFDTDs7Ozs7Ozs7Ozs7Ozs7OztBQ3RMNkI7QUFDZCx3QkFBd0IsZ0RBQUk7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw0QkFBNEI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGdEQUFJO0FBQ25CIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2Nzcy9maXRiLmNzcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvZml0Yi1pMThuLmVuLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLWkxOG4ucHQtYnIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2pzL2ZpdGItdXRpbHMuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2pzL2ZpdGIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2pzL2xpYnMvYWxlYVBSTkctMS4xLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy90aW1lZGZpdGIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiJC5pMThuKCkubG9hZCh7XG4gICAgZW46IHtcbiAgICAgICAgbXNnX25vX2Fuc3dlcjogXCJObyBhbnN3ZXIgcHJvdmlkZWQuXCIsXG4gICAgICAgIG1zZ19maXRiX2NoZWNrX21lOiBcIkNoZWNrIG1lXCIsXG4gICAgICAgIG1zZ19maXRiX2NvbXBhcmVfbWU6IFwiQ29tcGFyZSBtZVwiLFxuICAgICAgICBtc2dfZml0Yl9yYW5kb21pemU6IFwiUmFuZG9taXplXCIsXG4gICAgfSxcbn0pO1xuIiwiJC5pMThuKCkubG9hZCh7XG4gICAgXCJwdC1iclwiOiB7XG4gICAgICAgIG1zZ19ub19hbnN3ZXI6IFwiTmVuaHVtYSByZXNwb3N0YSBkYWRhLlwiLFxuICAgICAgICBtc2dfZml0Yl9jaGVja19tZTogXCJWZXJpZmljYXJcIixcbiAgICAgICAgbXNnX2ZpdGJfY29tcGFyZV9tZTogXCJDb21wYXJhclwiXG4gICAgfSxcbn0pO1xuIiwiLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIHxkb2NuYW1lfCAtIGdyYWRpbmctcmVsYXRlZCB1dGlsaXRpZXMgZm9yIEZJVEIgcXVlc3Rpb25zXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gVGhpcyBjb2RlIHJ1bnMgYm90aCBvbiB0aGUgc2VydmVyIChmb3Igc2VydmVyLXNpZGUgZ3JhZGluZykgYW5kIG9uIHRoZSBjbGllbnQuIEl0J3MgcGxhY2VkIGhlcmUgYXMgYSBzZXQgb2YgZnVuY3Rpb25zIHNwZWNpZmljYWxseSBmb3IgdGhpcyBwdXJwb3NlLlxuXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IHsgYWxlYVBSTkcgfSBmcm9tIFwiLi9saWJzL2FsZWFQUk5HLTEuMS5qc1wiO1xuXG4vLyBJbmNsdWRlc1xuLy8gPT09PT09PT1cbi8vIE5vbmUuXG4vL1xuLy9cbi8vIEdsb2JhbHNcbi8vID09PT09PT1cbmZ1bmN0aW9uIHJlbmRlcl9odG1sKGh0bWxfaW4sIGR5bl92YXJzX2V2YWwpIHtcbiAgICAvLyBDaGFuZ2UgdGhlIHJlcGxhY2VtZW50IHRva2VucyBpbiB0aGUgSFRNTCBpbnRvIHRhZ3MsIHNvIHdlIGNhbiByZXBsYWNlIHRoZW0gdXNpbmcgWE1MLiBUaGUgaG9ycmlibGUgcmVnZXggaXM6XG4gICAgLy9cbiAgICAvLyBMb29rIGZvciB0aGUgY2hhcmFjdGVycyBgYFslPWBgICh0aGUgb3BlbmluZyBkZWxpbWl0ZXIpXG4gICAgLy8vIFxcWyU9XG4gICAgLy8gRm9sbG93ZWQgYnkgYW55IGFtb3VudCBvZiB3aGl0ZXNwYWNlLlxuICAgIC8vLyBcXHMqXG4gICAgLy8gU3RhcnQgYSBncm91cCB0aGF0IHdpbGwgY2FwdHVyZSB0aGUgY29udGVudHMgKGV4Y2x1ZGluZyB3aGl0ZXNwYWNlKSBvZiB0aGUgdG9rZW5zLiBGb3IgZXhhbXBsZSwgZ2l2ZW4gYGBbJT0gZm9vKCkgJV1gYCwgdGhlIGNvbnRlbnRzIGlzIGBgZm9vKClgYC5cbiAgICAvLy8gKFxuICAgIC8vIERvbid0IGNhcHR1cmUgdGhlIGNvbnRlbnRzIG9mIHRoaXMgZ3JvdXAsIHNpbmNlIGl0J3Mgb25seSBhIHNpbmdsZSBjaGFyYWN0ZXIuIE1hdGNoIGFueSBjaGFyYWN0ZXIuLi5cbiAgICAvLy8gKFxuICAgIC8vLyA/Oi5cbiAgICAvLy8gLi4udGhhdCBkb2Vzbid0IGVuZCB3aXRoIGBgJV1gYCAodGhlIGNsb3NpbmcgZGVsaW1pdGVyKS5cbiAgICAvLy8gKD8hJV0pXG4gICAgLy8vIClcbiAgICAvLyBNYXRjaCB0aGlzIChhbnl0aGluZyBidXQgdGhlIGNsb3NpbmcgZGVsaW1pdGVyKSBhcyBtdWNoIGFzIHdlIGNhbi5cbiAgICAvLy8gKilcbiAgICAvLyBOZXh0LCBsb29rIGZvciBhbnkgd2hpdGVzcGFjZS5cbiAgICAvLy8gXFxzKlxuICAgIC8vIEZpbmFsbHksIGxvb2sgZm9yIHRoZSBjbG9zaW5nIGRlbGltaXRlciBgYCVdYGAuXG4gICAgLy8vICVcXF1cbiAgICBjb25zdCBodG1sX3JlcGxhY2VkID0gaHRtbF9pbi5yZXBsYWNlQWxsKFxuICAgICAgICAvXFxbJT1cXHMqKCg/Oi4oPyElXSkpKilcXHMqJVxcXS9nLFxuICAgICAgICAvLyBSZXBsYWNlIGl0IHdpdGggYSBgPHNjcmlwdC1ldmFsPmAgdGFnLiBRdW90ZSB0aGUgc3RyaW5nLCB3aGljaCB3aWxsIGF1dG9tYXRpY2FsbHkgZXNjYXBlIGFueSBkb3VibGUgcXVvdGVzLCB1c2luZyBKU09OLlxuICAgICAgICAobWF0Y2gsIGdyb3VwMSkgPT5cbiAgICAgICAgICAgIGA8c2NyaXB0LWV2YWwgZXhwcj0ke0pTT04uc3RyaW5naWZ5KGdyb3VwMSl9Pjwvc2NyaXB0LWV2YWw+YFxuICAgICk7XG4gICAgLy8gR2l2ZW4gSFRNTCwgdHVybiBpdCBpbnRvIGEgRE9NLiBXYWxrIHRoZSBgYDxzY3JpcHQtZXZhbD5gYCB0YWdzLCBwZXJmb3JtaW5nIHRoZSByZXF1ZXN0ZWQgZXZhbHVhdGlvbiBvbiB0aGVtLlxuICAgIC8vXG4gICAgLy8gU2VlIGBET01QYXJzZXIgPGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9ET01QYXJzZXI+YF8uXG4gICAgY29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuICAgIC8vIFNlZSBgRE9NUGFyc2VyLnBhcnNlRnJvbVN0cmluZygpIDxodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRE9NUGFyc2VyL3BhcnNlRnJvbVN0cmluZz5gXy5cbiAgICBjb25zdCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGh0bWxfcmVwbGFjZWQsIFwidGV4dC9odG1sXCIpO1xuICAgIGNvbnN0IHNjcmlwdF9ldmFsX3RhZ3MgPSBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHQtZXZhbFwiKTtcbiAgICB3aGlsZSAoc2NyaXB0X2V2YWxfdGFncy5sZW5ndGgpIHtcbiAgICAgICAgLy8gR2V0IHRoZSBmaXJzdCB0YWcuIEl0IHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBjb2xsZWN0aW9uIGFmdGVyIGl0J3MgcmVwbGFjZWQgd2l0aCBpdHMgdmFsdWUuXG4gICAgICAgIGNvbnN0IHNjcmlwdF9ldmFsX3RhZyA9IHNjcmlwdF9ldmFsX3RhZ3NbMF07XG4gICAgICAgIC8vIFNlZSBpZiB0aGlzIGBgPHNjcmlwdC1ldmFsPmBgIHRhZyBoYXMgYXMgYGBAZXhwcmBgIGF0dHJpYnV0ZS5cbiAgICAgICAgY29uc3QgZXhwciA9IHNjcmlwdF9ldmFsX3RhZy5nZXRBdHRyaWJ1dGUoXCJleHByXCIpO1xuICAgICAgICAvLyBJZiBzbywgZXZhbHVhdGUgaXQuXG4gICAgICAgIGlmIChleHByKSB7XG4gICAgICAgICAgICBjb25zdCBldmFsX3Jlc3VsdCA9IHdpbmRvdy5GdW5jdGlvbihcbiAgICAgICAgICAgICAgICBcInZcIixcbiAgICAgICAgICAgICAgICAuLi5PYmplY3Qua2V5cyhkeW5fdmFyc19ldmFsKSxcbiAgICAgICAgICAgICAgICBgXCJ1c2Ugc3RyaWN0O1wiXFxucmV0dXJuICR7ZXhwcn07YFxuICAgICAgICAgICAgKShkeW5fdmFyc19ldmFsLCAuLi5PYmplY3QudmFsdWVzKGR5bl92YXJzX2V2YWwpKTtcbiAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIHRhZyB3aXRoIHRoZSByZXN1bHRpbmcgdmFsdWUuXG4gICAgICAgICAgICBzY3JpcHRfZXZhbF90YWcucmVwbGFjZVdpdGgoZXZhbF9yZXN1bHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHRoZSBib2R5IGNvbnRlbnRzLiBOb3RlIHRoYXQgdGhlIGBgRE9NUGFyc2VyYGAgY29uc3RydWN0cyBhbiBlbnRpcmUgZG9jdW1lbnQsIG5vdCBqdXN0IHRoZSBkb2N1bWVudCBmcmFnbWVudCB3ZSBwYXNzZWQgaXQuIFRoZXJlZm9yZSwgZXh0cmFjdCB0aGUgZGVzaXJlZCBmcmFnbWVudCBhbmQgcmV0dXJuIHRoYXQuIE5vdGUgdGhhdCB3ZSBuZWVkIHRvIHVzZSBgY2hpbGROb2RlcyA8aHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvY2hpbGROb2Rlcz5gXywgd2hpY2ggaW5jbHVkZXMgbm9uLWVsZW1lbnQgY2hpbGRyZW4gbGlrZSB0ZXh0IGFuZCBjb21tZW50czsgdXNpbmcgYGBjaGlsZHJlbmBgIG9taXRzIHRoZXNlIG5vbi1lbGVtZW50IGNoaWxkcmVuLlxuICAgIHJldHVybiBkb2MuYm9keS5jaGlsZE5vZGVzO1xufVxuXG4vLyBGdW5jdGlvbnNcbi8vID09PT09PT09PVxuLy8gVXBkYXRlIHRoZSBwcm9ibGVtJ3MgZGVzY3JpcHRpb24gYmFzZWQgb24gZHluYW1pY2FsbHktZ2VuZXJhdGVkIGNvbnRlbnQuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyRHluYW1pY0NvbnRlbnQoXG4gICAgc2VlZCxcbiAgICBkeW5fdmFycyxcbiAgICBkeW5faW1wb3J0cyxcbiAgICBodG1sX2luLFxuICAgIGRpdmlkLFxuICAgIHByZXBhcmVDaGVja0Fuc3dlcnNcbikge1xuICAgIC8vIEluaXRpYWxpemUgUk5HIHdpdGggYGBzZWVkYGAuXG4gICAgY29uc3QgcmFuZCA9IGFsZWFQUk5HKHNlZWQpO1xuXG4gICAgLy8gU2VlIGBSQU5EX0ZVTkMgPFJBTkRfRlVOQz5gXywgd2hpY2ggcmVmZXJzIHRvIGBgcmFuZGBgIGFib3ZlLlxuICAgIGNvbnN0IGR5bl92YXJzX2V2YWwgPSB3aW5kb3cuRnVuY3Rpb24oXG4gICAgICAgIFwidlwiLFxuICAgICAgICBcInJhbmRcIixcbiAgICAgICAgLi4uT2JqZWN0LmtleXMoZHluX2ltcG9ydHMpLFxuICAgICAgICBgXCJ1c2Ugc3RyaWN0XCI7XFxuJHtkeW5fdmFyc307XFxucmV0dXJuIHY7YFxuICAgICkoXG4gICAgICAgIC8vIFdlIHdhbnQgdi5kaXZpZCA9IGRpdmlkIGFuZCB2LnByZXBhcmVDaGVja0Fuc3dlcnMgPSBwcmVwYXJlQ2hlY2tBbnN3ZXJzLiBJbiBjb250cmFzdCwgdGhlIGtleS92YWx1ZXMgcGFpcnMgb2YgZHluX2ltcG9ydHMgc2hvdWxkIGJlIGRpcmVjdGx5IGFzc2lnbmVkIHRvIHYsIGhlbmNlIHRoZSBPYmplY3QuYXNzaWduLlxuICAgICAgICBPYmplY3QuYXNzaWduKHsgZGl2aWQsIHByZXBhcmVDaGVja0Fuc3dlcnN9LCBkeW5faW1wb3J0cyksXG4gICAgICAgIHJhbmQsXG4gICAgICAgIC8vIEluIGFkZGl0aW9uIHRvIHByb3ZpZGluZyB0aGlzIGluIHYsIG1ha2UgaXQgYXZhaWxhYmxlIGluIHRoZSBmdW5jdGlvbiBhcyB3ZWxsLCBzaW5jZSBtb3N0IHByb2JsZW0gYXV0aG9ycyB3aWxsIHdyaXRlIGBgZm9vID0gbmV3IEJUTSgpYGAgKGZvciBleGFtcGxlLCBhc3N1bWluZyBCVE0gaXMgaW4gZHluX2ltcG9ydHMpIGluc3RlYWQgb2YgYGBmb28gPSBuZXcgdi5CVE0oKWBgICh3aGljaCBpcyB1bnVzdWFsIHN5bnRheCkuXG4gICAgICAgIC4uLk9iamVjdC52YWx1ZXMoZHluX2ltcG9ydHMpKTtcblxuICAgIGxldCBodG1sX291dDtcbiAgICBpZiAodHlwZW9mIGR5bl92YXJzX2V2YWwuYmVmb3JlQ29udGVudFJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBkeW5fdmFyc19ldmFsLmJlZm9yZUNvbnRlbnRSZW5kZXIoZHluX3ZhcnNfZXZhbCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsXG4gICAgICAgICAgICAgICAgYEVycm9yIGluIHByb2JsZW0gJHtkaXZpZH0gaW52b2tpbmcgYmVmb3JlQ29udGVudFJlbmRlcmBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaHRtbF9vdXQgPSByZW5kZXJfaHRtbChodG1sX2luLCBkeW5fdmFyc19ldmFsKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIGBFcnJvciByZW5kZXJpbmcgcHJvYmxlbSAke2RpdmlkfSB0ZXh0LmApO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgfVxuXG4gICAgLy8gdGhlIGFmdGVyQ29udGVudFJlbmRlciBldmVudCB3aWxsIGJlIGNhbGxlZCBieSB0aGUgY2FsbGVyIG9mIHRoaXMgZnVuY3Rpb24gKGFmdGVyIGl0IHVwZGF0ZWQgdGhlIEhUTUwgYmFzZWQgb24gdGhlIGNvbnRlbnRzIG9mIGh0bWxfb3V0KS5cbiAgICByZXR1cm4gW2h0bWxfb3V0LCBkeW5fdmFyc19ldmFsXTtcbn1cblxuLy8gR2l2ZW4gc3R1ZGVudCBhbnN3ZXJzLCBncmFkZSB0aGVtIGFuZCBwcm92aWRlIGZlZWRiYWNrLlxuLy9cbi8vIE91dHB1dHM6XG4vL1xuLy8gLSAgICBgYGRpc3BsYXlGZWVkYGAgaXMgYW4gYXJyYXkgb2YgSFRNTCBmZWVkYmFjay5cbi8vIC0gICAgYGBpc0NvcnJlY3RBcnJheWBgIGlzIGFuIGFycmF5IG9mIHRydWUsIGZhbHNlLCBvciBudWxsICh0aGUgcXVlc3Rpb24gd2Fzbid0IGFuc3dlcmVkKS5cbi8vIC0gICAgYGBjb3JyZWN0YGAgaXMgdHJ1ZSwgZmFsc2UsIG9yIG51bGwgKHRoZSBxdWVzdGlvbiB3YXNuJ3QgYW5zd2VyZWQpLlxuLy8gLSAgICBgYHBlcmNlbnRgYCBpcyB0aGUgcGVyY2VudGFnZSBvZiBjb3JyZWN0IGFuc3dlcnMgKGZyb20gMCB0byAxLCBub3QgMCB0byAxMDApLlxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrQW5zd2Vyc0NvcmUoXG4gICAgLy8gX2BibGFua05hbWVzRGljdGA6IEFuIGRpY3Qgb2Yge2JsYW5rX25hbWUsIGJsYW5rX2luZGV4fSBzcGVjaWZ5aW5nIHRoZSBuYW1lIGZvciBlYWNoIG5hbWVkIGJsYW5rLlxuICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgIC8vIF9gZ2l2ZW5fYXJyYDogQW4gYXJyYXkgb2Ygc3RyaW5ncyBjb250YWluaW5nIHN0dWRlbnQtcHJvdmlkZWQgYW5zd2VycyBmb3IgZWFjaCBibGFuay5cbiAgICBnaXZlbl9hcnIsXG4gICAgLy8gQSAyLUQgYXJyYXkgb2Ygc3RyaW5ncyBnaXZpbmcgZmVlZGJhY2sgZm9yIGVhY2ggYmxhbmsuXG4gICAgZmVlZGJhY2tBcnJheSxcbiAgICAvLyBfYGR5bl92YXJzX2V2YWxgOiBBIGRpY3QgcHJvZHVjZWQgYnkgZXZhbHVhdGluZyB0aGUgSmF2YVNjcmlwdCBmb3IgYSBkeW5hbWljIGV4ZXJjaXNlLlxuICAgIGR5bl92YXJzX2V2YWxcbikge1xuICAgIGlmIChcbiAgICAgICAgZHluX3ZhcnNfZXZhbCAmJlxuICAgICAgICB0eXBlb2YgZHluX3ZhcnNfZXZhbC5iZWZvcmVDaGVja0Fuc3dlcnMgPT09IFwiZnVuY3Rpb25cIlxuICAgICkge1xuICAgICAgICBjb25zdCBbbmFtZWRCbGFua1ZhbHVlcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZF0gPSBwYXJzZUFuc3dlcnMoXG4gICAgICAgICAgICBibGFua05hbWVzRGljdCxcbiAgICAgICAgICAgIGdpdmVuX2FycixcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgZHZlX2JsYW5rcyA9IE9iamVjdC5hc3NpZ24oe30sIGR5bl92YXJzX2V2YWwsIG5hbWVkQmxhbmtWYWx1ZXMpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZHluX3ZhcnNfZXZhbC5iZWZvcmVDaGVja0Fuc3dlcnMoZHZlX2JsYW5rcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIFwiRXJyb3IgY2FsbGluZyBiZWZvcmVDaGVja0Fuc3dlcnNcIik7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBLZWVwIHRyYWNrIGlmIGFsbCBhbnN3ZXJzIGFyZSBjb3JyZWN0IG9yIG5vdC5cbiAgICBsZXQgY29ycmVjdCA9IHRydWU7XG4gICAgY29uc3QgaXNDb3JyZWN0QXJyYXkgPSBbXTtcbiAgICBjb25zdCBkaXNwbGF5RmVlZCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ2l2ZW5fYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGdpdmVuID0gZ2l2ZW5fYXJyW2ldO1xuICAgICAgICAvLyBJZiB0aGlzIGJsYW5rIGlzIGVtcHR5LCBwcm92aWRlIG5vIGZlZWRiYWNrIGZvciBpdC5cbiAgICAgICAgaWYgKGdpdmVuID09PSBcIlwiKSB7XG4gICAgICAgICAgICBpc0NvcnJlY3RBcnJheS5wdXNoKG51bGwpO1xuICAgICAgICAgICAgLy8gVE9ETzogd2FzICQuaTE4bihcIm1zZ19ub19hbnN3ZXJcIikuXG4gICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKFwiTm8gYW5zd2VyIHByb3ZpZGVkLlwiKTtcbiAgICAgICAgICAgIGNvcnJlY3QgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIExvb2sgdGhyb3VnaCBhbGwgZmVlZGJhY2sgZm9yIHRoaXMgYmxhbmsuIFRoZSBsYXN0IGVsZW1lbnQgaW4gdGhlIGFycmF5IGFsd2F5cyBtYXRjaGVzLiBJZiBubyBmZWVkYmFjayBmb3IgdGhpcyBibGFuayBleGlzdHMsIHVzZSBhbiBlbXB0eSBsaXN0LlxuICAgICAgICAgICAgY29uc3QgZmJsID0gZmVlZGJhY2tBcnJheVtpXSB8fCBbXTtcbiAgICAgICAgICAgIGxldCBqO1xuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGZibC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIC8vIFRoZSBsYXN0IGl0ZW0gb2YgZmVlZGJhY2sgYWx3YXlzIG1hdGNoZXMuXG4gICAgICAgICAgICAgICAgaWYgKGogPT09IGZibC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goZmJsW2pdW1wiZmVlZGJhY2tcIl0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBhIHJlZ2V4cC4uLlxuICAgICAgICAgICAgICAgIGlmIChcInJlZ2V4XCIgaW4gZmJsW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdHQgPSBSZWdFeHAoXG4gICAgICAgICAgICAgICAgICAgICAgICBmYmxbal1bXCJyZWdleFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZibFtqXVtcInJlZ2V4RmxhZ3NcIl1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhdHQudGVzdChnaXZlbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goZmJsW2pdW1wiZmVlZGJhY2tcIl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwibnVtYmVyXCIgaW4gZmJsW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBudW1iZXIuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFttaW4sIG1heF0gPSBmYmxbal1bXCJudW1iZXJcIl07XG4gICAgICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgdGhlIGdpdmVuIHN0cmluZyB0byBhIG51bWJlci4gV2hpbGUgdGhlcmUgYXJlIGBsb3RzIG9mIHdheXMgPGh0dHBzOi8vY29kZXJ3YWxsLmNvbS9wLzV0bGhtdy9jb252ZXJ0aW5nLXN0cmluZ3MtdG8tbnVtYmVyLWluLWphdmFzY3JpcHQtcGl0ZmFsbHM+YF8gdG8gZG8gdGhpczsgdGhpcyB2ZXJzaW9uIHN1cHBvcnRzIG90aGVyIGJhc2VzIChoZXgvYmluYXJ5L29jdGFsKSBhcyB3ZWxsIGFzIGZsb2F0cy5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0dWFsID0gK2dpdmVuO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0dWFsID49IG1pbiAmJiBhY3R1YWwgPD0gbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKGZibFtqXVtcImZlZWRiYWNrXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBhIGR5bmFtaWMgc29sdXRpb24sIHRoZXkgc2hvdWxkIHByb3ZpZGUgYSB0ZXN0aW5nIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkeW5fdmFyc19ldmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtuYW1lZEJsYW5rVmFsdWVzLCBnaXZlbl9hcnJfY29udmVydGVkXSA9XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUFuc3dlcnMoYmxhbmtOYW1lc0RpY3QsIGdpdmVuX2FyciwgZHluX3ZhcnNfZXZhbCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlIHdhcyBhIHBhcnNlIGVycm9yLCB0aGVuIGl0IHN0dWRlbnQncyBhbnN3ZXIgaXMgaW5jb3JyZWN0LlxuICAgICAgICAgICAgICAgICAgICBpZiAoZ2l2ZW5fYXJyX2NvbnZlcnRlZFtpXSBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheUZlZWQucHVzaChnaXZlbl9hcnJfY29udmVydGVkW2ldLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ291bnQgdGhpcyBhcyB3cm9uZyBieSBtYWtpbmcgaiAhPSAwIC0tIHNlZSB0aGUgY29kZSB0aGF0IHJ1bnMgaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIGV4ZWN1dGluZyB0aGUgYnJlYWsuXG4gICAgICAgICAgICAgICAgICAgICAgICBqID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIGZ1bmN0aW9uIHRvIHdyYXAgdGhlIGV4cHJlc3Npb24gdG8gZXZhbHVhdGUuIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9GdW5jdGlvbi9GdW5jdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgLy8gUGFzcyB0aGUgYW5zd2VyLCBhcnJheSBvZiBhbGwgYW5zd2VycywgdGhlbiBhbGwgZW50cmllcyBpbiBgYHRoaXMuZHluX3ZhcnNfZXZhbGBgIGRpY3QgYXMgZnVuY3Rpb24gcGFyYW1ldGVycy5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNfZXF1YWwgPSB3aW5kb3cuRnVuY3Rpb24oXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFuc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbnNfYXJyYXlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLk9iamVjdC5rZXlzKGR5bl92YXJzX2V2YWwpLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uT2JqZWN0LmtleXMobmFtZWRCbGFua1ZhbHVlcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBgXCJ1c2Ugc3RyaWN0O1wiXFxucmV0dXJuICR7ZmJsW2pdW1wic29sdXRpb25fY29kZVwiXX07YFxuICAgICAgICAgICAgICAgICAgICApKFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2l2ZW5fYXJyX2NvbnZlcnRlZFtpXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdpdmVuX2Fycl9jb252ZXJ0ZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5PYmplY3QudmFsdWVzKGR5bl92YXJzX2V2YWwpLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uT2JqZWN0LnZhbHVlcyhuYW1lZEJsYW5rVmFsdWVzKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiBzdHVkZW50J3MgYW5zd2VyIGlzIGVxdWFsIHRvIHRoaXMgaXRlbSwgdGhlbiBhcHBlbmQgdGhpcyBpdGVtJ3MgZmVlZGJhY2suXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc19lcXVhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheUZlZWQucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgaXNfZXF1YWwgPT09IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBpc19lcXVhbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGZibFtqXVtcImZlZWRiYWNrXCJdXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBJZiB0aGlzIGlzIE5PVCBhIGR5bmFtaWMgc29sdXRpb24sIGJ1dCBnaXZlbiBhIHRlc3RpbmcgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwic29sdXRpb25fY29kZVwiIGluIGZibFtqXSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYSBmdW5jdGlvbiB0byB3cmFwIHRoZSBleHByZXNzaW9uIHRvIGV2YWx1YXRlLiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRnVuY3Rpb24vRnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgIC8vIFBhc3MgdGhlIGFuc3dlciwgYXJyYXkgb2YgYWxsIGFuc3dlcnMsIHRoZW4gYWxsIGVudHJpZXMgaW4gYGB0aGlzLmR5bl92YXJzX2V2YWxgYCBkaWN0IGFzIGZ1bmN0aW9uIHBhcmFtZXRlcnMuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzX2VxdWFsID0gd2luZG93LkZ1bmN0aW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYW5zX2FycmF5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBgXCJ1c2Ugc3RyaWN0O1wiXFxucmV0dXJuICR7ZmJsW2pdW1wic29sdXRpb25fY29kZVwiXX07YFxuICAgICAgICAgICAgICAgICAgICApKGdpdmVuLCBnaXZlbl9hcnIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiBzdHVkZW50J3MgYW5zd2VyIGlzIGVxdWFsIHRvIHRoaXMgaXRlbSwgdGhlbiBhcHBlbmQgdGhpcyBpdGVtJ3MgZmVlZGJhY2suXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc19lcXVhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheUZlZWQucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgaXNfZXF1YWwgPT09IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBpc19lcXVhbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGZibFtqXVtcImZlZWRiYWNrXCJdXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBVbmRlZmluZWQgbWV0aG9kIG9mIHRlc3RpbmcuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KFwibnVtYmVyXCIgaW4gZmJsW2pdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRoZSBhbnN3ZXIgaXMgY29ycmVjdCBpZiBpdCBtYXRjaGVkIHRoZSBmaXJzdCBlbGVtZW50IGluIHRoZSBhcnJheS4gQSBzcGVjaWFsIGNhc2U6IGlmIG9ubHkgb25lIGFuc3dlciBpcyBwcm92aWRlZCwgY291bnQgaXQgd3Jvbmc7IHRoaXMgaXMgYSBtaXNmb3JtZWQgcHJvYmxlbS5cbiAgICAgICAgICAgIGNvbnN0IGlzX2NvcnJlY3QgPSBqID09PSAwICYmIGZibC5sZW5ndGggPiAxO1xuICAgICAgICAgICAgaXNDb3JyZWN0QXJyYXkucHVzaChpc19jb3JyZWN0KTtcbiAgICAgICAgICAgIGlmICghaXNfY29ycmVjdCkge1xuICAgICAgICAgICAgICAgIGNvcnJlY3QgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgICAgZHluX3ZhcnNfZXZhbCAmJlxuICAgICAgICB0eXBlb2YgZHluX3ZhcnNfZXZhbC5hZnRlckNoZWNrQW5zd2VycyA9PT0gXCJmdW5jdGlvblwiXG4gICAgKSB7XG4gICAgICAgIGNvbnN0IFtuYW1lZEJsYW5rVmFsdWVzLCBnaXZlbl9hcnJfY29udmVydGVkXSA9IHBhcnNlQW5zd2VycyhcbiAgICAgICAgICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgICAgICAgICAgZ2l2ZW5fYXJyLFxuICAgICAgICAgICAgZHluX3ZhcnNfZXZhbFxuICAgICAgICApO1xuICAgICAgICBjb25zdCBkdmVfYmxhbmtzID0gT2JqZWN0LmFzc2lnbih7fSwgZHluX3ZhcnNfZXZhbCwgbmFtZWRCbGFua1ZhbHVlcyk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBkeW5fdmFyc19ldmFsLmFmdGVyQ2hlY2tBbnN3ZXJzKGR2ZV9ibGFua3MsIGdpdmVuX2Fycl9jb252ZXJ0ZWQpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLCBcIkVycm9yIGNhbGxpbmcgYWZ0ZXJDaGVja0Fuc3dlcnNcIik7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBwZXJjZW50ID1cbiAgICAgICAgaXNDb3JyZWN0QXJyYXkuZmlsdGVyKEJvb2xlYW4pLmxlbmd0aCAvIGlzQ29ycmVjdEFycmF5Lmxlbmd0aDtcbiAgICByZXR1cm4gW2Rpc3BsYXlGZWVkLCBjb3JyZWN0LCBpc0NvcnJlY3RBcnJheSwgcGVyY2VudF07XG59XG5cbi8vIFVzZSB0aGUgcHJvdmlkZWQgcGFyc2VycyB0byBjb252ZXJ0IGEgc3R1ZGVudCdzIGFuc3dlcnMgKGFzIHN0cmluZ3MpIHRvIHRoZSB0eXBlIHByb2R1Y2VkIGJ5IHRoZSBwYXJzZXIgZm9yIGVhY2ggYmxhbmsuXG5mdW5jdGlvbiBwYXJzZUFuc3dlcnMoXG4gICAgLy8gU2VlIGJsYW5rTmFtZXNEaWN0Xy5cbiAgICBibGFua05hbWVzRGljdCxcbiAgICAvLyBTZWUgZ2l2ZW5fYXJyXy5cbiAgICBnaXZlbl9hcnIsXG4gICAgLy8gU2VlIGBkeW5fdmFyc19ldmFsYC5cbiAgICBkeW5fdmFyc19ldmFsXG4pIHtcbiAgICAvLyBQcm92aWRlIGEgZGljdCBvZiB7YmxhbmtfbmFtZSwgY29udmVydGVyX2Fuc3dlcl92YWx1ZX0uXG4gICAgY29uc3QgbmFtZWRCbGFua1ZhbHVlcyA9IGdldE5hbWVkQmxhbmtWYWx1ZXMoXG4gICAgICAgIGdpdmVuX2FycixcbiAgICAgICAgYmxhbmtOYW1lc0RpY3QsXG4gICAgICAgIGR5bl92YXJzX2V2YWxcbiAgICApO1xuICAgIC8vIEludmVydCBibGFua05hbWVkRGljdDogY29tcHV0ZSBhbiBhcnJheSBvZiBbYmxhbmtfMF9uYW1lLCAuLi5dLiBOb3RlIHRoYXQgdGhlIGFycmF5IG1heSBiZSBzcGFyc2U6IGl0IG9ubHkgY29udGFpbnMgdmFsdWVzIGZvciBuYW1lZCBibGFua3MuXG4gICAgY29uc3QgZ2l2ZW5fYXJyX25hbWVzID0gW107XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoYmxhbmtOYW1lc0RpY3QpKSB7XG4gICAgICAgIGdpdmVuX2Fycl9uYW1lc1t2XSA9IGs7XG4gICAgfVxuICAgIC8vIENvbXB1dGUgYW4gYXJyYXkgb2YgW2NvbnZlcnRlZF9ibGFua18wX3ZhbCwgLi4uXS4gTm90ZSB0aGF0IHRoaXMgcmUtY29udmVydHMgYWxsIHRoZSB2YWx1ZXMsIHJhdGhlciB0aGFuIChwb3NzaWJseSBkZWVwKSBjb3B5aW5nIHRoZSB2YWx1ZXMgZnJvbSBhbHJlYWR5LWNvbnZlcnRlZCBuYW1lZCBibGFua3MuXG4gICAgY29uc3QgZ2l2ZW5fYXJyX2NvbnZlcnRlZCA9IGdpdmVuX2Fyci5tYXAoKHZhbHVlLCBpbmRleCkgPT5cbiAgICAgICAgdHlwZV9jb252ZXJ0KGdpdmVuX2Fycl9uYW1lc1tpbmRleF0sIHZhbHVlLCBpbmRleCwgZHluX3ZhcnNfZXZhbClcbiAgICApO1xuXG4gICAgcmV0dXJuIFtuYW1lZEJsYW5rVmFsdWVzLCBnaXZlbl9hcnJfY29udmVydGVkXTtcbn1cblxuLy8gUmVuZGVyIHRoZSBmZWVkYmFjayBmb3IgYSBkeW5hbWljIHByb2JsZW0uXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyRHluYW1pY0ZlZWRiYWNrKFxuICAgIC8vIFNlZSBibGFua05hbWVzRGljdF8uXG4gICAgYmxhbmtOYW1lc0RpY3QsXG4gICAgLy8gU2VlIGdpdmVuX2Fycl8uXG4gICAgZ2l2ZW5fYXJyLFxuICAgIC8vIFRoZSBpbmRleCBvZiB0aGlzIGJsYW5rIGluIGdpdmVuX2Fycl8uXG4gICAgaW5kZXgsXG4gICAgLy8gVGhlIGZlZWRiYWNrIGZvciB0aGlzIGJsYW5rLCBjb250YWluaW5nIGEgdGVtcGxhdGUgdG8gYmUgcmVuZGVyZWQuXG4gICAgZGlzcGxheUZlZWRfaSxcbiAgICAvLyBTZWUgZHluX3ZhcnNfZXZhbF8uXG4gICAgZHluX3ZhcnNfZXZhbFxuKSB7XG4gICAgLy8gVXNlIHRoZSBhbnN3ZXIsIGFuIGFycmF5IG9mIGFsbCBhbnN3ZXJzLCB0aGUgdmFsdWUgb2YgYWxsIG5hbWVkIGJsYW5rcywgYW5kIGFsbCBzb2x1dGlvbiB2YXJpYWJsZXMgZm9yIHRoZSB0ZW1wbGF0ZS5cbiAgICBjb25zdCBuYW1lZEJsYW5rVmFsdWVzID0gZ2V0TmFtZWRCbGFua1ZhbHVlcyhcbiAgICAgICAgZ2l2ZW5fYXJyLFxuICAgICAgICBibGFua05hbWVzRGljdCxcbiAgICAgICAgZHluX3ZhcnNfZXZhbFxuICAgICk7XG4gICAgY29uc3Qgc29sX3ZhcnNfcGx1cyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFuczogZ2l2ZW5fYXJyW2luZGV4XSxcbiAgICAgICAgICAgIGFuc19hcnJheTogZ2l2ZW5fYXJyLFxuICAgICAgICB9LFxuICAgICAgICBkeW5fdmFyc19ldmFsLFxuICAgICAgICBuYW1lZEJsYW5rVmFsdWVzXG4gICAgKTtcbiAgICB0cnkge1xuICAgICAgICBkaXNwbGF5RmVlZF9pID0gcmVuZGVyX2h0bWwoZGlzcGxheUZlZWRfaSwgc29sX3ZhcnNfcGx1cyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLCBgRXJyb3IgZXZhbHVhdGluZyBmZWVkYmFjayBpbmRleCAke2luZGV4fS5gKTtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgIH1cblxuICAgIHJldHVybiBkaXNwbGF5RmVlZF9pO1xufVxuXG4vLyBVdGlsaXRpZXNcbi8vIC0tLS0tLS0tLVxuLy8gRm9yIGVhY2ggbmFtZWQgYmxhbmssIGdldCB0aGUgdmFsdWUgZm9yIHRoZSBibGFuazogdGhlIHZhbHVlIG9mIGVhY2ggYGBibGFua05hbWVgYCBnaXZlcyB0aGUgaW5kZXggb2YgdGhlIGJsYW5rIGZvciB0aGF0IG5hbWUuXG5mdW5jdGlvbiBnZXROYW1lZEJsYW5rVmFsdWVzKGdpdmVuX2FyciwgYmxhbmtOYW1lc0RpY3QsIGR5bl92YXJzX2V2YWwpIHtcbiAgICBjb25zdCBuYW1lZEJsYW5rVmFsdWVzID0ge307XG4gICAgZm9yIChjb25zdCBbYmxhbmtfbmFtZSwgYmxhbmtfaW5kZXhdIG9mIE9iamVjdC5lbnRyaWVzKGJsYW5rTmFtZXNEaWN0KSkge1xuICAgICAgICBuYW1lZEJsYW5rVmFsdWVzW2JsYW5rX25hbWVdID0gdHlwZV9jb252ZXJ0KFxuICAgICAgICAgICAgYmxhbmtfbmFtZSxcbiAgICAgICAgICAgIGdpdmVuX2FycltibGFua19pbmRleF0sXG4gICAgICAgICAgICBibGFua19pbmRleCxcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWxcbiAgICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWVkQmxhbmtWYWx1ZXM7XG59XG5cbi8vIENvbnZlcnQgYSB2YWx1ZSBnaXZlbiBpdHMgdHlwZS5cbmZ1bmN0aW9uIHR5cGVfY29udmVydChuYW1lLCB2YWx1ZSwgaW5kZXgsIGR5bl92YXJzX2V2YWwpIHtcbiAgICAvLyBUaGUgY29udmVydGVyIGNhbiBiZSBkZWZpbmVkIGJ5IGluZGV4LCBuYW1lLCBvciBieSBhIHNpbmdsZSB2YWx1ZSAod2hpY2ggYXBwbGllcyB0byBhbGwgYmxhbmtzKS4gSWYgbm90IHByb3ZpZGVkLCBqdXN0IHBhc3MgdGhlIGRhdGEgdGhyb3VnaC5cbiAgICBjb25zdCB0eXBlcyA9IGR5bl92YXJzX2V2YWwudHlwZXMgfHwgcGFzc190aHJvdWdoO1xuICAgIGNvbnN0IGNvbnZlcnRlciA9IHR5cGVzW25hbWVdIHx8IHR5cGVzW2luZGV4XSB8fCB0eXBlcztcbiAgICAvLyBFUzUgaGFjazogaXQgZG9lc24ndCBzdXBwb3J0IGJpbmFyeSB2YWx1ZXMsIGFuZCBqczJweSBkb2Vzbid0IGFsbG93IG1lIHRvIG92ZXJyaWRlIHRoZSBgYE51bWJlcmBgIGNsYXNzLiBTbywgZGVmaW5lIHRoZSB3b3JrYXJvdW5kIGNsYXNzIGBgTnVtYmVyX2BgIGFuZCB1c2UgaXQgaWYgYXZhaWxhYmxlLlxuICAgIGlmIChjb252ZXJ0ZXIgPT09IE51bWJlciAmJiB0eXBlb2YgTnVtYmVyXyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBjb252ZXJ0ZXIgPSBOdW1iZXJfO1xuICAgIH1cblxuICAgIC8vIFJldHVybiB0aGUgY29udmVydGVkIHR5cGUuIElmIHRoZSBjb252ZXJ0ZXIgcmFpc2VzIGEgVHlwZUVycm9yLCByZXR1cm4gdGhhdDsgaXQgd2lsbCBiZSBkaXNwbGF5ZWQgdG8gdGhlIHVzZXIsIHNpbmNlIHdlIGFzc3VtZSB0eXBlIGVycm9ycyBhcmUgYSB3YXkgZm9yIHRoZSBwYXJzZXIgdG8gZXhwbGFpbiB0byB0aGUgdXNlciB3aHkgdGhlIHBhcnNlIGZhaWxlZC4gRm9yIGFsbCBvdGhlciBlcnJvcnMsIHJlLXRocm93IGl0IHNpbmNlIHNvbWV0aGluZyB3ZW50IHdyb25nLlxuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBjb252ZXJ0ZXIodmFsdWUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBBIHBhc3MtdGhyb3VnaCBcImNvbnZlcnRlclwiLlxuZnVuY3Rpb24gcGFzc190aHJvdWdoKHZhbCkge1xuICAgIHJldHVybiB2YWw7XG59XG4iLCIvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gfGRvY25hbWV8IC0tIGZpbGwtaW4tdGhlLWJsYW5rIGNsaWVudC1zaWRlIGNvZGVcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBUaGlzIGZpbGUgY29udGFpbnMgdGhlIEpTIGZvciB0aGUgUnVuZXN0b25lIGZpbGxpbnRoZWJsYW5rIGNvbXBvbmVudC4gSXQgd2FzIGNyZWF0ZWQgQnkgSXNhaWFoIE1heWVyY2hhayBhbmQgS2lyYnkgT2xzb24sIDYvNC8xNSB0aGVuIHJldmlzZWQgYnkgQnJhZCBNaWxsZXIsIDIvNy8yMC5cbi8vXG4vLyBEYXRhIHN0b3JhZ2Ugbm90ZXNcbi8vID09PT09PT09PT09PT09PT09PVxuLy9cbi8vIEluaXRpYWwgcHJvYmxlbSByZXN0b3JlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW4gdGhlIGNvbnN0cnVjdG9yLCB0aGlzIGNvZGUgKHRoZSBjbGllbnQpIHJlc3RvcmVzIHRoZSBwcm9ibGVtIGJ5IGNhbGxpbmcgYGBjaGVja1NlcnZlcmBgLiBUbyBkbyBzbywgZWl0aGVyIHRoZSBzZXJ2ZXIgc2VuZHMgb3IgbG9jYWwgc3RvcmFnZSBoYXM6XG4vL1xuLy8gLSAgICBzZWVkICh1c2VkIG9ubHkgZm9yIGR5bmFtaWMgcHJvYmxlbXMpXG4vLyAtICAgIGFuc3dlclxuLy8gLSAgICBkaXNwbGF5RmVlZCAoc2VydmVyLXNpZGUgZ3JhZGluZyBvbmx5OyBvdGhlcndpc2UsIHRoaXMgaXMgZ2VuZXJhdGVkIGxvY2FsbHkgYnkgY2xpZW50IGNvZGUpXG4vLyAtICAgIGNvcnJlY3QgKFNTRylcbi8vIC0gICAgaXNDb3JyZWN0QXJyYXkgKFNTRylcbi8vIC0gICAgcHJvYmxlbUh0bWwgKFNTRyB3aXRoIGR5bmFtaWMgcHJvYmxlbXMgb25seSlcbi8vXG4vLyBJZiBhbnkgb2YgdGhlIGFuc3dlcnMgYXJlIGNvcnJlY3QsIHRoZW4gdGhlIGNsaWVudCBzaG93cyBmZWVkYmFjay4gVGhpcyBpcyBpbXBsZW1lbnRlZCBpbiByZXN0b3JlQW5zd2Vyc18uXG4vL1xuLy8gR3JhZGluZ1xuLy8gLS0tLS0tLVxuLy8gV2hlbiB0aGUgdXNlciBwcmVzc2VzIHRoZSBcIkNoZWNrIG1lXCIgYnV0dG9uLCB0aGUgbG9nQ3VycmVudEFuc3dlcl8gZnVuY3Rpb246XG4vL1xuLy8gLSAgICBTYXZlcyB0aGUgZm9sbG93aW5nIHRvIGxvY2FsIHN0b3JhZ2U6XG4vL1xuLy8gICAgICAtICAgc2VlZFxuLy8gICAgICAtICAgYW5zd2VyXG4vLyAgICAgIC0gICB0aW1lc3RhbXBcbi8vICAgICAgLSAgIHByb2JsZW1IdG1sXG4vL1xuLy8gICAgICBOb3RlIHRoYXQgdGhlcmUncyBubyBwb2ludCBpbiBzYXZpbmcgZGlzcGxheUZlZWQsIGNvcnJlY3QsIG9yIGlzQ29ycmVjdEFycmF5LCBzaW5jZSB0aGVzZSB2YWx1ZXMgYXBwbGllZCB0byB0aGUgcHJldmlvdXMgYW5zd2VyLCBub3QgdGhlIG5ldyBhbnN3ZXIganVzdCBzdWJtaXR0ZWQuXG4vL1xuLy8gLSAgICBTZW5kcyB0aGUgZm9sbG93aW5nIHRvIHRoZSBzZXJ2ZXI7IHN0b3AgYWZ0ZXIgdGhpcyBmb3IgY2xpZW50LXNpZGUgZ3JhZGluZzpcbi8vXG4vLyAgICAgIC0gICBzZWVkIChpZ25vcmVkIGZvciBzZXJ2ZXItc2lkZSBncmFkaW5nKVxuLy8gICAgICAtICAgYW5zd2VyXG4vLyAgICAgIC0gICBjb3JyZWN0IChpZ25vcmVkIGZvciBTU0cpXG4vLyAgICAgIC0gICBwZXJjZW50IChpZ25vcmVkIGZvciBTU0cpXG4vL1xuLy8gLSAgICBSZWNlaXZlcyB0aGUgZm9sbG93aW5nIGZyb20gdGhlIHNlcnZlcjpcbi8vXG4vLyAgICAgIC0gICB0aW1lc3RhbXBcbi8vICAgICAgLSAgIGRpc3BsYXlGZWVkXG4vLyAgICAgIC0gICBjb3JyZWN0XG4vLyAgICAgIC0gICBpc0NvcnJlY3RBcnJheVxuLy9cbi8vIC0gICAgU2F2ZXMgdGhlIGZvbGxvd2luZyB0byBsb2NhbCBzdG9yYWdlOlxuLy9cbi8vICAgICAgLSAgIHNlZWRcbi8vICAgICAgLSAgIGFuc3dlclxuLy8gICAgICAtICAgdGltZXN0YW1wXG4vLyAgICAgIC0gICBkaXNwbGF5RmVlZCAoU1NHIG9ubHkpXG4vLyAgICAgIC0gICBjb3JyZWN0IChTU0cgb25seSlcbi8vICAgICAgLSAgIGlzQ29ycmVjdEFycmF5IChTU0cgb25seSlcbi8vICAgICAgLSAgIHByb2JsZW1IdG1sXG4vL1xuLy8gUmFuZG9taXplXG4vLyAtLS0tLS0tLS1cbi8vIFdoZW4gdGhlIHVzZXIgcHJlc3NlcyB0aGUgXCJSYW5kb21pemVcIiBidXR0b24gKHdoaWNoIGlzIG9ubHkgYXZhaWxhYmxlIGZvciBkeW5hbWljIHByb2JsZW1zKSwgdGhlIHJhbmRvbWl6ZV8gZnVuY3Rpb246XG4vL1xuLy8gLSAgICBGb3IgdGhlIGNsaWVudC1zaWRlIGNhc2UsIHNldHMgdGhlIHNlZWQgdG8gYSBuZXcsIHJhbmRvbSB2YWx1ZS4gRm9yIHRoZSBzZXJ2ZXItc2lkZSBjYXNlLCByZXF1ZXN0cyBhIG5ldyBzZWVkIGFuZCBwcm9ibGVtSHRtbCBmcm9tIHRoZSBzZXJ2ZXIuXG4vLyAtICAgIFNldHMgdGhlIGFuc3dlciB0byBhbiBhcnJheSBvZiBlbXB0eSBzdHJpbmdzLlxuLy8gLSAgICBTYXZlcyB0aGUgdXN1YWwgbG9jYWwgZGF0YS5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qc1wiO1xuaW1wb3J0IHtcbiAgICByZW5kZXJEeW5hbWljQ29udGVudCxcbiAgICBjaGVja0Fuc3dlcnNDb3JlLFxuICAgIHJlbmRlckR5bmFtaWNGZWVkYmFjayxcbn0gZnJvbSBcIi4vZml0Yi11dGlscy5qc1wiO1xuaW1wb3J0IFwiLi9maXRiLWkxOG4uZW4uanNcIjtcbmltcG9ydCBcIi4vZml0Yi1pMThuLnB0LWJyLmpzXCI7XG5pbXBvcnQgXCIuLi9jc3MvZml0Yi5jc3NcIjtcblxuLy8gT2JqZWN0IGNvbnRhaW5pbmcgYWxsIGluc3RhbmNlcyBvZiBGSVRCIHRoYXQgYXJlbid0IGEgY2hpbGQgb2YgYSB0aW1lZCBhc3Nlc3NtZW50LlxuZXhwb3J0IHZhciBGSVRCTGlzdCA9IHt9O1xuXG4vLyBGSVRCIGNvbnN0cnVjdG9yXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGSVRCIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdmFyIG9yaWcgPSBvcHRzLm9yaWc7IC8vIGVudGlyZSA8cD4gZWxlbWVudFxuICAgICAgICB0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzID0gb3B0cy51c2VSdW5lc3RvbmVTZXJ2aWNlcztcbiAgICAgICAgdGhpcy5vcmlnRWxlbSA9IG9yaWc7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcmlnLmlkO1xuICAgICAgICB0aGlzLmNvcnJlY3QgPSBudWxsO1xuICAgICAgICAvLyBTZWUgY29tbWVudHMgaW4gZml0Yi5weSBmb3IgdGhlIGZvcm1hdCBvZiBgYGZlZWRiYWNrQXJyYXlgYCAod2hpY2ggaXMgaWRlbnRpY2FsIGluIGJvdGggZmlsZXMpLlxuICAgICAgICAvL1xuICAgICAgICAvLyBGaW5kIHRoZSBzY3JpcHQgdGFnIGNvbnRhaW5pbmcgSlNPTiBhbmQgcGFyc2UgaXQuIFNlZSBgU08gPGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkzMjA0MjcvYmVzdC1wcmFjdGljZS1mb3ItZW1iZWRkaW5nLWFyYml0cmFyeS1qc29uLWluLXRoZS1kb20+YF9fLiBJZiB0aGlzIHRhZyBkb2Vzbid0IGV4aXN0LCB0aGVuIG5vIGZlZWRiYWNrIGlzIGF2YWlsYWJsZTsgc2VydmVyLXNpZGUgZ3JhZGluZyB3aWxsIGJlIHBlcmZvcm1lZC5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gQSBkZXN0cnVjdHVyaW5nIGFzc2lnbm1lbnQgd291bGQgYmUgcGVyZmVjdCwgYnV0IHRoZXkgZG9uJ3Qgd29yayB3aXRoIGBgdGhpcy5ibGFoYGAgYW5kIGBgd2l0aGBgIHN0YXRlbWVudHMgYXJlbid0IHN1cHBvcnRlZCBpbiBzdHJpY3QgbW9kZS5cbiAgICAgICAgY29uc3QganNvbl9lbGVtZW50ID0gdGhpcy5zY3JpcHRTZWxlY3Rvcih0aGlzLm9yaWdFbGVtKTtcbiAgICAgICAgY29uc3QgZGljdF8gPSBKU09OLnBhcnNlKGpzb25fZWxlbWVudC5odG1sKCkpO1xuICAgICAgICBqc29uX2VsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgIC8vIENoZWNrIGZvciBvbGRlciB2ZXJzaW9ucyB0aGF0IGhhdmUgcmF3IGh0bWwgY29udGVudC5cbiAgICAgICAgaWYgKGRpY3RfLnByb2JsZW1IdG1sICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aGlzLnByb2JsZW1IdG1sID0gZGljdF8ucHJvYmxlbUh0bWw7XG4gICAgICAgICAgdGhpcy5keW5fdmFycyA9IGRpY3RfLmR5bl92YXJzO1xuICAgICAgICAgIHRoaXMuYmxhbmtOYW1lcyA9IGRpY3RfLmJsYW5rTmFtZXM7XG4gICAgICAgICAgdGhpcy5mZWVkYmFja0FycmF5ID0gZGljdF8uZmVlZGJhY2tBcnJheTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnByb2JsZW1IdG1sID0gdGhpcy5vcmlnRWxlbS5pbm5lckhUTUw7XG4gICAgICAgICAgdGhpcy5mZWVkYmFja0FycmF5ID0gZGljdF87XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNyZWF0ZUZJVEJFbGVtZW50KCk7XG4gICAgICAgIHRoaXMuc2V0dXBCbGFua3MoKTtcbiAgICAgICAgdGhpcy5jYXB0aW9uID0gXCJGaWxsIGluIHRoZSBCbGFua1wiO1xuICAgICAgICB0aGlzLmFkZENhcHRpb24oXCJydW5lc3RvbmVcIik7XG5cbiAgICAgICAgLy8gRGVmaW5lIGEgcHJvbWlzZSB3aGljaCBpbXBvcnRzIGFueSBsaWJyYXJpZXMgbmVlZGVkIGJ5IGR5bmFtaWMgcHJvYmxlbXMuXG4gICAgICAgIHRoaXMuZHluX2ltcG9ydHMgPSB7fTtcbiAgICAgICAgbGV0IGltcG9ydHNfcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBpZiAoZGljdF8uZHluX2ltcG9ydHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gQ29sbGVjdCBhbGwgaW1wb3J0IHByb21pc2VzLlxuICAgICAgICAgICAgbGV0IGltcG9ydF9wcm9taXNlcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBpbXBvcnRfIG9mIGRpY3RfLmR5bl9pbXBvcnRzKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChpbXBvcnRfKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZvciBpbXBvcnRzIGtub3duIGF0IHdlYnBhY2sgYnVpbGQsIGJyaW5nIHRoZXNlIGluLlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiQlRNXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRfcHJvbWlzZXMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnQoXCJidG0tZXhwcmVzc2lvbnMvc3JjL0JUTV9yb290LmpzXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFsbG93IGZvciBsb2NhbCBpbXBvcnRzLCB1c3VhbGx5IGZyb20gcHJvYmxlbXMgZGVmaW5lZCBvdXRzaWRlIHRoZSBSdW5lc3RvbmUgQ29tcG9uZW50cy5cbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydF9wcm9taXNlcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydCgvKiB3ZWJwYWNrSWdub3JlOiB0cnVlICovIGltcG9ydF8pXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDb21iaW5lIHRoZSByZXN1bHRpbmcgbW9kdWxlIG5hbWVzcGFjZSBvYmplY3RzIHdoZW4gdGhlc2UgcHJvbWlzZXMgcmVzb2x2ZS5cbiAgICAgICAgICAgIGltcG9ydHNfcHJvbWlzZSA9IFByb21pc2UuYWxsKGltcG9ydF9wcm9taXNlcylcbiAgICAgICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgICAgICAgKG1vZHVsZV9uYW1lc3BhY2VfYXJyKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuZHluX2ltcG9ydHMgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLm1vZHVsZV9uYW1lc3BhY2VfYXJyXG4gICAgICAgICAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBgRmFpbGVkIGR5bmFtaWMgaW1wb3J0OiAke2Vycn0uYDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlc29sdmUgdGhlc2UgcHJvbWlzZXMuXG4gICAgICAgIGltcG9ydHNfcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tTZXJ2ZXIoXCJmaWxsYlwiLCBmYWxzZSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gT25lIG9wdGlvbiBmb3IgYSBkeW5hbWljIHByb2JsZW0gaXMgdG8gcHJvZHVjZSBhIHN0YXRpYyBwcm9ibGVtIGJ5IHByb3ZpZGluZyBhIGZpeGVkIHNlZWQgdmFsdWUuIFRoaXMgaXMgdHlwaWNhbGx5IHVzZWQgd2hlbiB0aGUgZ29hbCBpcyB0byByZW5kZXIgdGhlIHByb2JsZW0gYXMgYW4gaW1hZ2UgZm9yIGluY2x1c2lvbiBpbiBzdGF0aWMgY29udGVudCAoYSBQREYsIGV0Yy4pLiBUbyBzdXBwb3J0IHRoaXMsIGNvbnNpZGVyIHRoZSBmb2xsb3dpbmcgY2FzZXM6XG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLy8gQ2FzZSAgSGFzIHN0YXRpYyBzZWVkPyAgSXMgYSBjbGllbnQtc2lkZSwgZHluYW1pYyBwcm9ibGVtPyAgSGFzIGxvY2FsIHNlZWQ/ICBSZXN1bHRcbiAgICAgICAgICAgICAgICAvLy8gMCAgICAgTm8gICAgICAgICAgICAgICAgTm8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWCAgICAgICAgICAgICAgICBObyBhY3Rpb24gbmVlZGVkLlxuICAgICAgICAgICAgICAgIC8vLyAxICAgICBObyAgICAgICAgICAgICAgICBZZXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBObyAgICAgICAgICAgICAgIHRoaXMucmFuZG9taXplKCkuXG4gICAgICAgICAgICAgICAgLy8vIDIgICAgIE5vICAgICAgICAgICAgICAgIFllcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFllcyAgICAgICAgICAgICAgTm8gYWN0aW9uIG5lZWRlZCAtLSBwcm9ibGVtIGFscmVhZHkgcmVzdG9yZWQgZnJvbSBsb2NhbCBzdG9yYWdlLlxuICAgICAgICAgICAgICAgIC8vLyAzICAgICBZZXMgICAgICAgICAgICAgICBObyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBYICAgICAgICAgICAgICAgIFdhcm5pbmc6IHNlZWQgaWdub3JlZC5cbiAgICAgICAgICAgICAgICAvLy8gNCAgICAgWWVzICAgICAgICAgICAgICAgWWVzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm8gICAgICAgICAgICAgICBBc3NpZ24gc2VlZDsgdGhpcy5yZW5kZXJEeW5hbWljQ29udGVudCgpLlxuICAgICAgICAgICAgICAgIC8vLyA1ICAgICBZZXMgICAgICAgICAgICAgICBZZXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBZZXMgICAgICAgICAgICAgIElmIHNlZWRzIGRpZmZlciwgaXNzdWUgd2FybmluZy4gTm8gYWRkaXRpb25hbCBhY3Rpb24gbmVlZGVkIC0tIHByb2JsZW0gYWxyZWFkeSByZXN0b3JlZCBmcm9tIGxvY2FsIHN0b3JhZ2UuXG5cbiAgICAgICAgICAgICAgICBjb25zdCBoYXNfc3RhdGljX3NlZWQgPSBkaWN0Xy5zdGF0aWNfc2VlZCAhPT0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzX2NsaWVudF9keW5hbWljID0gdHlwZW9mIHRoaXMuZHluX3ZhcnMgPT09IFwic3RyaW5nXCI7XG4gICAgICAgICAgICAgICAgY29uc3QgaGFzX2xvY2FsX3NlZWQgPSB0aGlzLnNlZWQgIT09IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgIC8vIENhc2UgMVxuICAgICAgICAgICAgICAgIGlmICghaGFzX3N0YXRpY19zZWVkICYmIGlzX2NsaWVudF9keW5hbWljICYmICFoYXNfbG9jYWxfc2VlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJhbmRvbWl6ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBDYXNlIDNcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChoYXNfc3RhdGljX3NlZWQgJiYgIWlzX2NsaWVudF9keW5hbWljKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KFxuICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldhcm5pbmc6IHRoZSBwcm92aWRlZCBzdGF0aWMgc2VlZCB3YXMgaWdub3JlZCwgYmVjYXVzZSBpdCBvbmx5IGFmZmVjdHMgY2xpZW50LXNpZGUsIGR5bmFtaWMgcHJvYmxlbXMuXCJcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gQ2FzZSA0XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGhhc19zdGF0aWNfc2VlZCAmJlxuICAgICAgICAgICAgICAgICAgICBpc19jbGllbnRfZHluYW1pYyAmJlxuICAgICAgICAgICAgICAgICAgICAhaGFzX2xvY2FsX3NlZWRcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWVkID0gZGljdF8uc3RhdGljX3NlZWQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyRHluYW1pY0NvbnRlbnQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gQ2FzZSA1XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGhhc19zdGF0aWNfc2VlZCAmJlxuICAgICAgICAgICAgICAgICAgICBpc19jbGllbnRfZHluYW1pYyAmJlxuICAgICAgICAgICAgICAgICAgICBoYXNfbG9jYWxfc2VlZCAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlZWQgIT09IGRpY3RfLnN0YXRpY19zZWVkXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KFxuICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldhcm5pbmc6IHRoZSBwcm92aWRlZCBzdGF0aWMgc2VlZCB3YXMgb3ZlcnJpZGRlbiBieSB0aGUgc2VlZCBmb3VuZCBpbiBsb2NhbCBzdG9yYWdlLlwiXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIENhc2VzIDAgYW5kIDJcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTm8gYWN0aW9uIG5lZWRlZC5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIFByaXNtICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIFByaXNtLmhpZ2hsaWdodEFsbFVuZGVyKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmluZGljYXRlX2NvbXBvbmVudF9yZWFkeSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnF1ZXVlTWF0aEpheCh0aGlzLmRlc2NyaXB0aW9uRGl2KTtcbiAgICB9XG5cbiAgICAvLyBGaW5kIHRoZSBzY3JpcHQgdGFnIGNvbnRhaW5pbmcgSlNPTiBpbiBhIGdpdmVuIHJvb3QgRE9NIG5vZGUuXG4gICAgc2NyaXB0U2VsZWN0b3Iocm9vdF9ub2RlKSB7XG4gICAgICAgIHJldHVybiAkKHJvb3Rfbm9kZSkuZmluZChgc2NyaXB0W3R5cGU9XCJhcHBsaWNhdGlvbi9qc29uXCJdYCk7XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSAgIEZ1bmN0aW9ucyBnZW5lcmF0aW5nIGZpbmFsIEhUTUwgICA9PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgY3JlYXRlRklUQkVsZW1lbnQoKSB7XG4gICAgICAgIHRoaXMucmVuZGVyRklUQklucHV0KCk7XG4gICAgICAgIHRoaXMucmVuZGVyRklUQkJ1dHRvbnMoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJGSVRCRmVlZGJhY2tEaXYoKTtcbiAgICAgICAgLy8gcmVwbGFjZXMgdGhlIGludGVybWVkaWF0ZSBIVE1MIGZvciB0aGlzIGNvbXBvbmVudCB3aXRoIHRoZSByZW5kZXJlZCBIVE1MIG9mIHRoaXMgY29tcG9uZW50XG4gICAgICAgICQodGhpcy5vcmlnRWxlbSkucmVwbGFjZVdpdGgodGhpcy5jb250YWluZXJEaXYpO1xuICAgIH1cbiAgICByZW5kZXJGSVRCSW5wdXQoKSB7XG4gICAgICAgIC8vIFRoZSB0ZXh0IFtpbnB1dF0gZWxlbWVudHMgYXJlIGNyZWF0ZWQgYnkgdGhlIHRlbXBsYXRlLlxuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgLy8gQ3JlYXRlIGFub3RoZXIgY29udGFpbmVyIHdoaWNoIHN0b3JlcyB0aGUgcHJvYmxlbSBkZXNjcmlwdGlvbi5cbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuZGVzY3JpcHRpb25EaXYpO1xuICAgICAgICAvLyBDb3B5IHRoZSBvcmlnaW5hbCBlbGVtZW50cyB0byB0aGUgY29udGFpbmVyIGhvbGRpbmcgd2hhdCB0aGUgdXNlciB3aWxsIHNlZSAoY2xpZW50LXNpZGUgZ3JhZGluZyBvbmx5KS5cbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbUh0bWwpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MID0gdGhpcy5wcm9ibGVtSHRtbDtcbiAgICAgICAgICAgIC8vIFNhdmUgb3JpZ2luYWwgSFRNTCAod2l0aCB0ZW1wbGF0ZXMpIHVzZWQgaW4gZHluYW1pYyBwcm9ibGVtcy5cbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYub3JpZ0lubmVySFRNTCA9IHRoaXMucHJvYmxlbUh0bWw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXJGSVRCQnV0dG9ucygpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcblxuICAgICAgICAvLyBcInN1Ym1pdFwiIGJ1dHRvblxuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLnRleHRDb250ZW50ID0gJC5pMThuKFwibXNnX2ZpdGJfY2hlY2tfbWVcIik7XG4gICAgICAgICQodGhpcy5zdWJtaXRCdXR0b24pLmF0dHIoe1xuICAgICAgICAgICAgY2xhc3M6IFwiYnRuIGJ0bi1zdWNjZXNzXCIsXG4gICAgICAgICAgICBuYW1lOiBcImRvIGFuc3dlclwiLFxuICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIixcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmxvZ0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuc3VibWl0QnV0dG9uKTtcblxuICAgICAgICAvLyBcImNvbXBhcmUgbWVcIiBidXR0b25cbiAgICAgICAgaWYgKHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICAgICAkKHRoaXMuY29tcGFyZUJ1dHRvbikuYXR0cih7XG4gICAgICAgICAgICAgICAgY2xhc3M6IFwiYnRuIGJ0bi1kZWZhdWx0XCIsXG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMub3JpZ0VsZW0uaWQgKyBcIl9iY29tcFwiLFxuICAgICAgICAgICAgICAgIGRpc2FibGVkOiBcIlwiLFxuICAgICAgICAgICAgICAgIG5hbWU6IFwiY29tcGFyZVwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24udGV4dENvbnRlbnQgPSAkLmkxOG4oXCJtc2dfZml0Yl9jb21wYXJlX21lXCIpO1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wYXJlRklUQkFuc3dlcnMoKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmNvbXBhcmVCdXR0b24pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmFuZG9taXplIGJ1dHRvbiBmb3IgZHluYW1pYyBwcm9ibGVtcy5cbiAgICAgICAgaWYgKHRoaXMuZHluX3ZhcnMpIHtcbiAgICAgICAgICAgIHRoaXMucmFuZG9taXplQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgICAgICQodGhpcy5yYW5kb21pemVCdXR0b24pLmF0dHIoe1xuICAgICAgICAgICAgICAgIGNsYXNzOiBcImJ0biBidG4tZGVmYXVsdFwiLFxuICAgICAgICAgICAgICAgIGlkOiB0aGlzLm9yaWdFbGVtLmlkICsgXCJfYmNvbXBcIixcbiAgICAgICAgICAgICAgICBuYW1lOiBcInJhbmRvbWl6ZVwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnJhbmRvbWl6ZUJ1dHRvbi50ZXh0Q29udGVudCA9ICQuaTE4bihcIm1zZ19maXRiX3JhbmRvbWl6ZVwiKTtcbiAgICAgICAgICAgIHRoaXMucmFuZG9taXplQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yYW5kb21pemUoKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnJhbmRvbWl6ZUJ1dHRvbik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcbiAgICB9XG4gICAgcmVuZGVyRklUQkZlZWRiYWNrRGl2KCkge1xuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5pZCA9IHRoaXMuZGl2aWQgKyBcIl9mZWVkYmFja1wiO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmZlZWRCYWNrRGl2KTtcbiAgICB9XG5cbiAgICBjbGVhckZlZWRiYWNrRGl2KCkge1xuICAgICAgICAvLyBTZXR0aW5nIHRoZSBgYG91dGVySFRNTGBgIHJlbW92ZXMgdGhpcyBmcm9tIHRoZSBET00uIFVzZSBhbiBhbHRlcm5hdGl2ZSBwcm9jZXNzIC0tIHJlbW92ZSB0aGUgY2xhc3MgKHdoaWNoIG1ha2VzIGl0IHJlZC9ncmVlbiBiYXNlZCBvbiBncmFkaW5nKSBhbmQgY29udGVudC5cbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmNsYXNzTmFtZSA9IFwiXCI7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIHRoZSBwcm9ibGVtJ3MgZGVzY3JpcHRpb24gYmFzZWQgb24gZHluYW1pY2FsbHktZ2VuZXJhdGVkIGNvbnRlbnQuXG4gICAgcmVuZGVyRHluYW1pY0NvbnRlbnQoKSB7XG4gICAgICAgIC8vIGBgdGhpcy5keW5fdmFyc2BgIGNhbiBiZSB0cnVlOyBpZiBzbywgZG9uJ3QgcmVuZGVyIGl0LCBzaW5jZSB0aGUgc2VydmVyIGRvZXMgYWxsIHRoZSByZW5kZXJpbmcuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5keW5fdmFycyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgbGV0IGh0bWxfbm9kZXM7XG4gICAgICAgICAgICBbaHRtbF9ub2RlcywgdGhpcy5keW5fdmFyc19ldmFsXSA9IHJlbmRlckR5bmFtaWNDb250ZW50KFxuICAgICAgICAgICAgICAgIHRoaXMuc2VlZCxcbiAgICAgICAgICAgICAgICB0aGlzLmR5bl92YXJzLFxuICAgICAgICAgICAgICAgIHRoaXMuZHluX2ltcG9ydHMsXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbkRpdi5vcmlnSW5uZXJIVE1MLFxuICAgICAgICAgICAgICAgIHRoaXMuZGl2aWQsXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVwYXJlQ2hlY2tBbnN3ZXJzLmJpbmQodGhpcylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2LnJlcGxhY2VDaGlsZHJlbiguLi5odG1sX25vZGVzKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmR5bl92YXJzX2V2YWwuYWZ0ZXJDb250ZW50UmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmR5bl92YXJzX2V2YWwuYWZ0ZXJDb250ZW50UmVuZGVyKHRoaXMuZHluX3ZhcnNfZXZhbCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KFxuICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBgRXJyb3IgaW4gcHJvYmxlbSAke3RoaXMuZGl2aWR9IGludm9raW5nIGFmdGVyQ29udGVudFJlbmRlcmBcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zZXR1cEJsYW5rcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0dXBCbGFua3MoKSB7XG4gICAgICAgIC8vIEZpbmQgYW5kIGZvcm1hdCB0aGUgYmxhbmtzLiBJZiBhIGR5bmFtaWMgcHJvYmxlbSBqdXN0IGNoYW5nZWQgdGhlIEhUTUwsIHRoaXMgd2lsbCBmaW5kIHRoZSBuZXdseS1jcmVhdGVkIGJsYW5rcy5cbiAgICAgICAgY29uc3QgYmEgPSAkKHRoaXMuZGVzY3JpcHRpb25EaXYpLmZpbmQoXCI6aW5wdXRcIik7XG4gICAgICAgIGJhLmF0dHIoXCJjbGFzc1wiLCBcImZvcm0gZm9ybS1jb250cm9sIHNlbGVjdHdpZHRoYXV0b1wiKTtcbiAgICAgICAgYmEuYXR0cihcImFyaWEtbGFiZWxcIiwgXCJpbnB1dCBhcmVhXCIpO1xuICAgICAgICB0aGlzLmJsYW5rQXJyYXkgPSBiYS50b0FycmF5KCk7XG4gICAgICAgIGZvciAobGV0IGJsYW5rIG9mIHRoaXMuYmxhbmtBcnJheSkge1xuICAgICAgICAgICAgJChibGFuaykuY2hhbmdlKHRoaXMucmVjb3JkQW5zd2VyZWQuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUaGlzIHRlbGxzIHRpbWVkIHF1ZXN0aW9ucyB0aGF0IHRoZSBmaXRiIGJsYW5rcyByZWNlaXZlZCBzb21lIGludGVyYWN0aW9uLlxuICAgIHJlY29yZEFuc3dlcmVkKCkge1xuICAgICAgICB0aGlzLmlzQW5zd2VyZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT0gQ2hlY2tpbmcvbG9hZGluZyBmcm9tIHN0b3JhZ2UgPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIHJlc3RvcmVBbnN3ZXJzKGRhdGEpIHtcbiAgICAgICAgLy8gUmVzdG9yZSB0aGUgc2VlZCBmaXJzdCwgc2luY2UgdGhlIGR5bmFtaWMgcmVuZGVyIGNsZWFycyBhbGwgdGhlIGJsYW5rcy5cbiAgICAgICAgdGhpcy5zZWVkID0gZGF0YS5zZWVkO1xuICAgICAgICB0aGlzLnJlbmRlckR5bmFtaWNDb250ZW50KCk7XG4gICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuZGVzY3JpcHRpb25EaXYpO1xuXG4gICAgICAgIHZhciBhcnI7XG4gICAgICAgIC8vIFJlc3RvcmUgYW5zd2VycyBmcm9tIHN0b3JhZ2UgcmV0cmlldmFsIGRvbmUgaW4gUnVuZXN0b25lQmFzZS5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFRoZSBuZXdlciBmb3JtYXQgZW5jb2RlcyBkYXRhIGFzIGEgSlNPTiBvYmplY3QuXG4gICAgICAgICAgICBhcnIgPSBKU09OLnBhcnNlKGRhdGEuYW5zd2VyKTtcbiAgICAgICAgICAgIC8vIFRoZSByZXN1bHQgc2hvdWxkIGJlIGFuIGFycmF5LiBJZiBub3QsIHRyeSBjb21tYSBwYXJzaW5nIGluc3RlYWQuXG4gICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIC8vIFRoZSBvbGQgZm9ybWF0IGRpZG4ndC5cbiAgICAgICAgICAgIGFyciA9IChkYXRhLmFuc3dlciB8fCBcIlwiKS5zcGxpdChcIixcIik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGhhc0Fuc3dlciA9IGZhbHNlO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgJCh0aGlzLmJsYW5rQXJyYXlbaV0pLmF0dHIoXCJ2YWx1ZVwiLCBhcnJbaV0pO1xuICAgICAgICAgICAgaWYgKGFycltpXSkge1xuICAgICAgICAgICAgICAgIGhhc0Fuc3dlciA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSXMgdGhpcyBjbGllbnQtc2lkZSBncmFkaW5nLCBvciBzZXJ2ZXItc2lkZSBncmFkaW5nP1xuICAgICAgICBpZiAodGhpcy5mZWVkYmFja0FycmF5KSB7XG4gICAgICAgICAgICAvLyBGb3IgY2xpZW50LXNpZGUgZ3JhZGluZywgcmUtZ2VuZXJhdGUgZmVlZGJhY2sgaWYgdGhlcmUncyBhbiBhbnN3ZXIuXG4gICAgICAgICAgICBpZiAoaGFzQW5zd2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEZvciBzZXJ2ZXItc2lkZSBncmFkaW5nLCB1c2UgdGhlIHByb3ZpZGVkIGZlZWRiYWNrIGZyb20gdGhlIHNlcnZlciBvciBsb2NhbCBzdG9yYWdlLlxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5RmVlZCA9IGRhdGEuZGlzcGxheUZlZWQ7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBkYXRhLmNvcnJlY3Q7XG4gICAgICAgICAgICB0aGlzLmlzQ29ycmVjdEFycmF5ID0gZGF0YS5pc0NvcnJlY3RBcnJheTtcbiAgICAgICAgICAgIC8vIE9ubHkgcmVuZGVyIGlmIGFsbCB0aGUgZGF0YSBpcyBwcmVzZW50OyBsb2NhbCBzdG9yYWdlIG1pZ2h0IGhhdmUgb2xkIGRhdGEgbWlzc2luZyBzb21lIG9mIHRoZXNlIGl0ZW1zLlxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLmRpc3BsYXlGZWVkICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIHRoaXMuY29ycmVjdCAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLmlzQ29ycmVjdEFycmF5ICE9PSBcInVuZGVmaW5lZFwiXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckZlZWRiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBGb3Igc2VydmVyLXNpZGUgZHluYW1pYyBwcm9ibGVtcywgc2hvdyB0aGUgcmVuZGVyZWQgcHJvYmxlbSB0ZXh0LlxuICAgICAgICAgICAgdGhpcy5wcm9ibGVtSHRtbCA9IGRhdGEucHJvYmxlbUh0bWw7XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9ibGVtSHRtbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MID0gdGhpcy5wcm9ibGVtSHRtbDtcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXVlTWF0aEpheCh0aGlzLmRlc2NyaXB0aW9uRGl2KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHVwQmxhbmtzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja0xvY2FsU3RvcmFnZSgpIHtcbiAgICAgICAgLy8gTG9hZHMgcHJldmlvdXMgYW5zd2VycyBmcm9tIGxvY2FsIHN0b3JhZ2UgaWYgdGhleSBleGlzdFxuICAgICAgICB2YXIgc3RvcmVkRGF0YTtcbiAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxlbiA9IGxvY2FsU3RvcmFnZS5sZW5ndGg7XG4gICAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgICAgICB2YXIgZXggPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgIGlmIChleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHN0b3JlZERhdGEgPSBKU09OLnBhcnNlKGV4KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyciA9IHN0b3JlZERhdGEuYW5zd2VyO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAvLyBlcnJvciB3aGlsZSBwYXJzaW5nOyBsaWtlbHkgZHVlIHRvIGJhZCB2YWx1ZSBzdG9yZWQgaW4gc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChmYWxzZSwgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RvcmVBbnN3ZXJzKHN0b3JlZERhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0TG9jYWxTdG9yYWdlKGRhdGEpIHtcbiAgICAgICAgbGV0IGtleSA9IHRoaXMubG9jYWxTdG9yYWdlS2V5KCk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIH1cblxuICAgIGNoZWNrQ3VycmVudEFuc3dlcigpIHtcbiAgICAgICAgLy8gU3RhcnQgb2YgdGhlIGV2YWx1YXRpb24gY2hhaW5cbiAgICAgICAgdGhpcy5pc0NvcnJlY3RBcnJheSA9IFtdO1xuICAgICAgICB0aGlzLmRpc3BsYXlGZWVkID0gW107XG4gICAgICAgIGNvbnN0IHBjYSA9IHRoaXMucHJlcGFyZUNoZWNrQW5zd2VycygpO1xuXG4gICAgICAgIGlmICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgICAgICBpZiAoZUJvb2tDb25maWcuZW5hYmxlQ29tcGFyZU1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmFibGVDb21wYXJlQnV0dG9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBHcmFkZSBsb2NhbGx5IGlmIHdlIGNhbid0IGFzayB0aGUgc2VydmVyIHRvIGdyYWRlLlxuICAgICAgICBpZiAodGhpcy5mZWVkYmFja0FycmF5KSB7XG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgLy8gQW4gYXJyYXkgb2YgSFRNTCBmZWVkYmFjay5cbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlGZWVkLFxuICAgICAgICAgICAgICAgIC8vIHRydWUsIGZhbHNlLCBvciBudWxsICh0aGUgcXVlc3Rpb24gd2Fzbid0IGFuc3dlcmVkKS5cbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3QsXG4gICAgICAgICAgICAgICAgLy8gQW4gYXJyYXkgb2YgdHJ1ZSwgZmFsc2UsIG9yIG51bGwgKHRoZSBxdWVzdGlvbiB3YXNuJ3QgYW5zd2VyZWQpLlxuICAgICAgICAgICAgICAgIHRoaXMuaXNDb3JyZWN0QXJyYXksXG4gICAgICAgICAgICAgICAgdGhpcy5wZXJjZW50LFxuICAgICAgICAgICAgXSA9IGNoZWNrQW5zd2Vyc0NvcmUoLi4ucGNhKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1RpbWVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJGZWVkYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gSW5wdXRzOlxuICAgIC8vXG4gICAgLy8gLSBTdHJpbmdzIGVudGVyZWQgYnkgdGhlIHN0dWRlbnQgaW4gYGB0aGlzLmJsYW5rQXJyYXlbaV0udmFsdWVgYC5cbiAgICAvLyAtIEZlZWRiYWNrIGluIGBgdGhpcy5mZWVkYmFja0FycmF5YGAuXG4gICAgcHJlcGFyZUNoZWNrQW5zd2VycygpIHtcbiAgICAgICAgdGhpcy5naXZlbl9hcnIgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsYW5rQXJyYXkubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICB0aGlzLmdpdmVuX2Fyci5wdXNoKHRoaXMuYmxhbmtBcnJheVtpXS52YWx1ZSk7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB0aGlzLmJsYW5rTmFtZXMsXG4gICAgICAgICAgICB0aGlzLmdpdmVuX2FycixcbiAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tBcnJheSxcbiAgICAgICAgICAgIHRoaXMuZHluX3ZhcnNfZXZhbCxcbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICAvLyBfYHJhbmRvbWl6ZWA6IFRoaXMgaGFuZGxlcyBhIGNsaWNrIHRvIHRoZSBcIlJhbmRvbWl6ZVwiIGJ1dHRvbi5cbiAgICBhc3luYyByYW5kb21pemUoKSB7XG4gICAgICAgIC8vIFVzZSB0aGUgY2xpZW50LXNpZGUgY2FzZSBvciB0aGUgc2VydmVyLXNpZGUgY2FzZT9cbiAgICAgICAgaWYgKHRoaXMuZmVlZGJhY2tBcnJheSkge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyB0aGUgY2xpZW50LXNpZGUgY2FzZS5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICB0aGlzLnNlZWQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyICoqIDMyKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyRHluYW1pY0NvbnRlbnQoKTtcbiAgICAgICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuZGVzY3JpcHRpb25EaXYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyB0aGUgc2VydmVyLXNpZGUgY2FzZS4gU2VuZCBhIHJlcXVlc3QgdG8gdGhlIGByZXN1bHRzIDxnZXRBc3Nlc3NSZXN1bHRzPmAgZW5kcG9pbnQgd2l0aCBgYG5ld19zZWVkYGAgc2V0IHRvIFRydWUuXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXCIvYXNzZXNzbWVudC9yZXN1bHRzXCIsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgICAgICAgICBjb3Vyc2U6IGVCb29rQ29uZmlnLmNvdXJzZSxcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IFwiZmlsbGJcIixcbiAgICAgICAgICAgICAgICAgICAgc2lkOiB0aGlzLnNpZCxcbiAgICAgICAgICAgICAgICAgICAgbmV3X3NlZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5qc29uSGVhZGVycyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICBhbGVydChgSFRUUCBlcnJvciBnZXR0aW5nIHJlc3VsdHM6ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gZGF0YS5kZXRhaWw7XG4gICAgICAgICAgICB0aGlzLnNlZWQgPSByZXMuc2VlZDtcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MID0gcmVzLnByb2JsZW1IdG1sO1xuICAgICAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5kZXNjcmlwdGlvbkRpdik7XG4gICAgICAgICAgICB0aGlzLnNldHVwQmxhbmtzKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2hlbiBnZXR0aW5nIGEgbmV3IHNlZWQsIGNsZWFyIGFsbCB0aGUgb2xkIGFuc3dlcnMgYW5kIGZlZWRiYWNrLlxuICAgICAgICB0aGlzLmdpdmVuX2FyciA9IEFycmF5KHRoaXMuYmxhbmtBcnJheS5sZW4pLmZpbGwoXCJcIik7XG4gICAgICAgICQodGhpcy5ibGFua0FycmF5KS5hdHRyKFwidmFsdWVcIiwgXCJcIik7XG4gICAgICAgIHRoaXMuY2xlYXJGZWVkYmFja0RpdigpO1xuICAgICAgICB0aGlzLnNhdmVBbnN3ZXJzTG9jYWxseU9ubHkoKTtcbiAgICB9XG5cbiAgICAvLyBTYXZlIHRoZSBhbnN3ZXJzIGFuZCBhc3NvY2lhdGVkIGRhdGEgbG9jYWxseTsgZG9uJ3Qgc2F2ZSBmZWVkYmFjayBwcm92aWRlZCBieSB0aGUgc2VydmVyIGZvciB0aGlzIGFuc3dlci4gSXQgYXNzdW1lcyB0aGF0IGBgdGhpcy5naXZlbl9hcnJgYCBjb250YWlucyB0aGUgY3VycmVudCBhbnN3ZXJzLlxuICAgIHNhdmVBbnN3ZXJzTG9jYWxseU9ubHkoKSB7XG4gICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKHtcbiAgICAgICAgICAgIC8vIFRoZSBzZWVkIGlzIHVzZWQgZm9yIGNsaWVudC1zaWRlIG9wZXJhdGlvbiwgYnV0IGRvZXNuJ3QgbWF0dGVyIGZvciBzZXJ2ZXItc2lkZS5cbiAgICAgICAgICAgIHNlZWQ6IHRoaXMuc2VlZCxcbiAgICAgICAgICAgIGFuc3dlcjogSlNPTi5zdHJpbmdpZnkodGhpcy5naXZlbl9hcnIpLFxuICAgICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgLy8gVGhpcyBpcyBvbmx5IG5lZWRlZCBmb3Igc2VydmVyLXNpZGUgZ3JhZGluZyB3aXRoIGR5bmFtaWMgcHJvYmxlbXMuXG4gICAgICAgICAgICBwcm9ibGVtSHRtbDogdGhpcy5kZXNjcmlwdGlvbkRpdi5pbm5lckhUTUwsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIF9gbG9nQ3VycmVudEFuc3dlcmA6IFNhdmUgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHByb2JsZW0gdG8gbG9jYWwgc3RvcmFnZSBhbmQgdGhlIHNlcnZlcjsgZGlzcGxheSBzZXJ2ZXIgZmVlZGJhY2suXG4gICAgYXN5bmMgbG9nQ3VycmVudEFuc3dlcihzaWQpIHtcbiAgICAgICAgbGV0IGFuc3dlciA9IEpTT04uc3RyaW5naWZ5KHRoaXMuZ2l2ZW5fYXJyKTtcbiAgICAgICAgbGV0IGZlZWRiYWNrID0gdHJ1ZTtcbiAgICAgICAgLy8gU2F2ZSB0aGUgYW5zd2VyIGxvY2FsbHkuXG4gICAgICAgIHRoaXMuc2F2ZUFuc3dlcnNMb2NhbGx5T25seSgpO1xuICAgICAgICAvLyBTYXZlIHRoZSBhbnN3ZXIgdG8gdGhlIHNlcnZlci5cbiAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgIGV2ZW50OiBcImZpbGxiXCIsXG4gICAgICAgICAgICBkaXZfaWQ6IHRoaXMuZGl2aWQsXG4gICAgICAgICAgICBhY3Q6IGFuc3dlciB8fCBcIlwiLFxuICAgICAgICAgICAgc2VlZDogdGhpcy5zZWVkLFxuICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXIgfHwgXCJcIixcbiAgICAgICAgICAgIGNvcnJlY3Q6IHRoaXMuY29ycmVjdCA/IFwiVFwiIDogXCJGXCIsXG4gICAgICAgICAgICBwZXJjZW50OiB0aGlzLnBlcmNlbnQsXG4gICAgICAgIH07XG4gICAgICAgIGlmICh0eXBlb2Ygc2lkICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBkYXRhLnNpZCA9IHNpZDtcbiAgICAgICAgICAgIGZlZWRiYWNrID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2VydmVyX2RhdGEgPSBhd2FpdCB0aGlzLmxvZ0Jvb2tFdmVudChkYXRhKTtcbiAgICAgICAgaWYgKCFmZWVkYmFjaykgcmV0dXJuO1xuICAgICAgICAvLyBOb24tc2VydmVyIHNpZGUgZ3JhZGVkIHByb2JsZW1zIGFyZSBkb25lIGF0IHRoaXMgcG9pbnQ7IGxpa2V3aXNlLCBzdG9wIGhlcmUgaWYgdGhlIHNlcnZlciBkaWRuJ3QgcmVzcG9uZC5cbiAgICAgICAgaWYgKHRoaXMuZmVlZGJhY2tBcnJheSB8fCAhc2VydmVyX2RhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIHNlcnZlci1zaWRlIGNhc2UuIE9uIHN1Y2Nlc3MsIHVwZGF0ZSB0aGUgZmVlZGJhY2sgZnJvbSB0aGUgc2VydmVyJ3MgZ3JhZGUuXG4gICAgICAgIGNvbnN0IHJlcyA9IHNlcnZlcl9kYXRhLmRldGFpbDtcbiAgICAgICAgdGhpcy50aW1lc3RhbXAgPSByZXMudGltZXN0YW1wO1xuICAgICAgICB0aGlzLmRpc3BsYXlGZWVkID0gcmVzLmRpc3BsYXlGZWVkO1xuICAgICAgICB0aGlzLmNvcnJlY3QgPSByZXMuY29ycmVjdDtcbiAgICAgICAgdGhpcy5pc0NvcnJlY3RBcnJheSA9IHJlcy5pc0NvcnJlY3RBcnJheTtcbiAgICAgICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2Uoe1xuICAgICAgICAgICAgc2VlZDogdGhpcy5zZWVkLFxuICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXIsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IHRoaXMudGltZXN0YW1wLFxuICAgICAgICAgICAgcHJvYmxlbUh0bWw6IHRoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MLFxuICAgICAgICAgICAgZGlzcGxheUZlZWQ6IHRoaXMuZGlzcGxheUZlZWQsXG4gICAgICAgICAgICBjb3JyZWN0OiB0aGlzLmNvcnJlY3QsXG4gICAgICAgICAgICBpc0NvcnJlY3RBcnJheTogdGhpcy5pc0NvcnJlY3RBcnJheSxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVuZGVyRmVlZGJhY2soKTtcbiAgICAgICAgcmV0dXJuIHNlcnZlcl9kYXRhO1xuICAgIH1cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09IEV2YWx1YXRpb24gb2YgYW5zd2VyIGFuZCA9PT1cbiAgICA9PT0gICAgIGRpc3BsYXkgZmVlZGJhY2sgICAgID09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgcmVuZGVyRmVlZGJhY2soKSB7XG4gICAgICAgIGlmICh0aGlzLmNvcnJlY3QpIHtcbiAgICAgICAgICAgICQodGhpcy5mZWVkQmFja0RpdikuYXR0cihcImNsYXNzXCIsIFwiYWxlcnQgYWxlcnQtaW5mb1wiKTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLmJsYW5rQXJyYXlbal0pLnJlbW92ZUNsYXNzKFwiaW5wdXQtdmFsaWRhdGlvbi1lcnJvclwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRpc3BsYXlGZWVkID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5RmVlZCA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzQ29ycmVjdEFycmF5W2pdICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5ibGFua0FycmF5W2pdKS5hZGRDbGFzcyhcImlucHV0LXZhbGlkYXRpb24tZXJyb3JcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLmJsYW5rQXJyYXlbal0pLnJlbW92ZUNsYXNzKFwiaW5wdXQtdmFsaWRhdGlvbi1lcnJvclwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWRhbmdlclwiKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZmVlZGJhY2tfaHRtbCA9IFwiPHVsPlwiO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZGlzcGxheUZlZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBkZiA9IHRoaXMuZGlzcGxheUZlZWRbaV07XG4gICAgICAgICAgICAvLyBSZW5kZXIgYW55IGR5bmFtaWMgZmVlZGJhY2sgaW4gdGhlIHByb3ZpZGVkIGZlZWRiYWNrLCBmb3IgY2xpZW50LXNpZGUgZ3JhZGluZyBvZiBkeW5hbWljIHByb2JsZW1zLlxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmR5bl92YXJzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgZGYgPSByZW5kZXJEeW5hbWljRmVlZGJhY2soXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtOYW1lcyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5naXZlbl9hcnIsXG4gICAgICAgICAgICAgICAgICAgIGksXG4gICAgICAgICAgICAgICAgICAgIGRmLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmR5bl92YXJzX2V2YWxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgdGhlIHJldHVybmVkIE5vZGVMaXN0IGludG8gYSBzdHJpbmcgb2YgSFRNTC5cbiAgICAgICAgICAgICAgICBkZiA9IChkZj8uWzBdICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgID8gZGZbMF0ucGFyZW50RWxlbWVudC5pbm5lckhUTUxcbiAgICAgICAgICAgICAgICAgICAgOiBcIk5vIGZlZWRiYWNrIHByb3ZpZGVkXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmZWVkYmFja19odG1sICs9IGA8bGk+JHtkZn08L2xpPmA7XG4gICAgICAgIH1cbiAgICAgICAgZmVlZGJhY2tfaHRtbCArPSBcIjwvdWw+XCI7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgbGlzdCBpZiBpdCdzIGp1c3Qgb25lIGVsZW1lbnQuXG4gICAgICAgIGlmICh0aGlzLmRpc3BsYXlGZWVkLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICBmZWVkYmFja19odG1sID0gZmVlZGJhY2tfaHRtbC5zbGljZShcbiAgICAgICAgICAgICAgICBcIjx1bD48bGk+XCIubGVuZ3RoLFxuICAgICAgICAgICAgICAgIC1cIjwvbGk+PC91bD5cIi5sZW5ndGhcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5pbm5lckhUTUwgPSBmZWVkYmFja19odG1sO1xuICAgICAgICBpZiAodHlwZW9mIE1hdGhKYXggIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuZmVlZEJhY2tEaXYpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09IEZ1bmN0aW9ucyBmb3IgY29tcGFyZSBidXR0b24gPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgZW5hYmxlQ29tcGFyZUJ1dHRvbigpIHtcbiAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIF9gY29tcGFyZUZJVEJBbnN3ZXJzYFxuICAgIGNvbXBhcmVGSVRCQW5zd2VycygpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgICAgZGF0YS5kaXZfaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICBkYXRhLmNvdXJzZSA9IGVCb29rQ29uZmlnLmNvdXJzZTtcbiAgICAgICAgalF1ZXJ5LmdldChcbiAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9hc3Nlc3NtZW50L2dldHRvcDEwQW5zd2Vyc2AsXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgdGhpcy5jb21wYXJlRklUQlxuICAgICAgICApO1xuICAgIH1cbiAgICBjb21wYXJlRklUQihkYXRhLCBzdGF0dXMsIHdoYXRldmVyKSB7XG4gICAgICAgIHZhciBhbnN3ZXJzID0gZGF0YS5kZXRhaWwucmVzO1xuICAgICAgICB2YXIgbWlzYyA9IGRhdGEuZGV0YWlsLm1pc2NkYXRhO1xuICAgICAgICB2YXIgYm9keSA9IFwiPHRhYmxlPlwiO1xuICAgICAgICBib2R5ICs9IFwiPHRyPjx0aD5BbnN3ZXI8L3RoPjx0aD5Db3VudDwvdGg+PC90cj5cIjtcbiAgICAgICAgZm9yICh2YXIgcm93IGluIGFuc3dlcnMpIHtcbiAgICAgICAgICAgIGJvZHkgKz1cbiAgICAgICAgICAgICAgICBcIjx0cj48dGQ+XCIgK1xuICAgICAgICAgICAgICAgIGFuc3dlcnNbcm93XS5hbnN3ZXIgK1xuICAgICAgICAgICAgICAgIFwiPC90ZD48dGQ+XCIgK1xuICAgICAgICAgICAgICAgIGFuc3dlcnNbcm93XS5jb3VudCArXG4gICAgICAgICAgICAgICAgXCIgdGltZXM8L3RkPjwvdHI+XCI7XG4gICAgICAgIH1cbiAgICAgICAgYm9keSArPSBcIjwvdGFibGU+XCI7XG4gICAgICAgIHZhciBodG1sID1cbiAgICAgICAgICAgIFwiPGRpdiBjbGFzcz0nbW9kYWwgZmFkZSc+XCIgK1xuICAgICAgICAgICAgXCIgICAgPGRpdiBjbGFzcz0nbW9kYWwtZGlhbG9nIGNvbXBhcmUtbW9kYWwnPlwiICtcbiAgICAgICAgICAgIFwiICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1jb250ZW50Jz5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9J21vZGFsLWhlYWRlcic+XCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzPSdjbG9zZScgZGF0YS1kaXNtaXNzPSdtb2RhbCcgYXJpYS1oaWRkZW49J3RydWUnPiZ0aW1lczs8L2J1dHRvbj5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICA8aDQgY2xhc3M9J21vZGFsLXRpdGxlJz5Ub3AgQW5zd2VyczwvaDQ+XCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICA8L2Rpdj5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9J21vZGFsLWJvZHknPlwiICtcbiAgICAgICAgICAgIGJvZHkgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICA8L2Rpdj5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgPC9kaXY+XCIgK1xuICAgICAgICAgICAgXCIgICAgPC9kaXY+XCIgK1xuICAgICAgICAgICAgXCI8L2Rpdj5cIjtcbiAgICAgICAgdmFyIGVsID0gJChodG1sKTtcbiAgICAgICAgZWwubW9kYWwoKTtcbiAgICB9XG5cbiAgICBkaXNhYmxlSW50ZXJhY3Rpb24oKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmJsYW5rQXJyYXlbaV0uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT0gRmluZCB0aGUgY3VzdG9tIEhUTUwgdGFncyBhbmQgPT1cbj09ICAgZXhlY3V0ZSBvdXIgY29kZSBvbiB0aGVtICAgID09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuJChkb2N1bWVudCkub24oXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuICAgICQoXCJbZGF0YS1jb21wb25lbnQ9ZmlsbGludGhlYmxhbmtdXCIpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHZhciBvcHRzID0ge1xuICAgICAgICAgICAgb3JpZzogdGhpcyxcbiAgICAgICAgICAgIHVzZVJ1bmVzdG9uZVNlcnZpY2VzOiBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCQodGhpcykuY2xvc2VzdChcIltkYXRhLWNvbXBvbmVudD10aW1lZEFzc2Vzc21lbnRdXCIpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGlzIGVsZW1lbnQgZXhpc3RzIHdpdGhpbiBhIHRpbWVkIGNvbXBvbmVudCwgZG9uJ3QgcmVuZGVyIGl0IGhlcmVcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgRklUQkxpc3RbdGhpcy5pZF0gPSBuZXcgRklUQihvcHRzKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW3RoaXMuaWRdID0gRklUQkxpc3RbdGhpcy5pZF07XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChcbiAgICAgICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGBFcnJvciByZW5kZXJpbmcgRmlsbCBpbiB0aGUgQmxhbmsgUHJvYmxlbSAke3RoaXMuaWR9XG4gICAgICAgICAgICAgICAgICAgICBEZXRhaWxzOiAke2Vycn1gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iLCIvKi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmFsZWFQUk5HIDEuMVxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5odHRwczovL2dpdGh1Yi5jb20vbWFjbWNtZWFucy9hbGVhUFJORy9ibG9iL21hc3Rlci9hbGVhUFJORy0xLjEuanNcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuT3JpZ2luYWwgd29yayBjb3B5cmlnaHQgwqkgMjAxMCBKb2hhbm5lcyBCYWFnw7hlLCB1bmRlciBNSVQgbGljZW5zZVxuVGhpcyBpcyBhIGRlcml2YXRpdmUgd29yayBjb3B5cmlnaHQgKGMpIDIwMTctMjAyMCwgVy4gTWFjXCIgTWNNZWFucywgdW5kZXIgQlNEIGxpY2Vuc2UuXG5SZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXQgbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4xLiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4yLiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4zLiBOZWl0aGVyIHRoZSBuYW1lIG9mIHRoZSBjb3B5cmlnaHQgaG9sZGVyIG5vciB0aGUgbmFtZXMgb2YgaXRzIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXG5USElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIEhPTERFUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vKi9cbmV4cG9ydCBmdW5jdGlvbiBhbGVhUFJORygpIHtcbiAgICByZXR1cm4oIGZ1bmN0aW9uKCBhcmdzICkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICBjb25zdCB2ZXJzaW9uID0gJ2FsZWFQUk5HIDEuMS4wJztcblxuICAgICAgICB2YXIgczBcbiAgICAgICAgICAgICwgczFcbiAgICAgICAgICAgICwgczJcbiAgICAgICAgICAgICwgY1xuICAgICAgICAgICAgLCB1aW50YSA9IG5ldyBVaW50MzJBcnJheSggMyApXG4gICAgICAgICAgICAsIGluaXRpYWxBcmdzXG4gICAgICAgICAgICAsIG1hc2h2ZXIgPSAnJ1xuICAgICAgICA7XG5cbiAgICAgICAgLyogcHJpdmF0ZTogaW5pdGlhbGl6ZXMgZ2VuZXJhdG9yIHdpdGggc3BlY2lmaWVkIHNlZWQgKi9cbiAgICAgICAgZnVuY3Rpb24gX2luaXRTdGF0ZSggX2ludGVybmFsU2VlZCApIHtcbiAgICAgICAgICAgIHZhciBtYXNoID0gTWFzaCgpO1xuXG4gICAgICAgICAgICAvLyBpbnRlcm5hbCBzdGF0ZSBvZiBnZW5lcmF0b3JcbiAgICAgICAgICAgIHMwID0gbWFzaCggJyAnICk7XG4gICAgICAgICAgICBzMSA9IG1hc2goICcgJyApO1xuICAgICAgICAgICAgczIgPSBtYXNoKCAnICcgKTtcblxuICAgICAgICAgICAgYyA9IDE7XG5cbiAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgX2ludGVybmFsU2VlZC5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgICAgICBzMCAtPSBtYXNoKCBfaW50ZXJuYWxTZWVkWyBpIF0gKTtcbiAgICAgICAgICAgICAgICBpZiggczAgPCAwICkgeyBzMCArPSAxOyB9XG5cbiAgICAgICAgICAgICAgICBzMSAtPSBtYXNoKCBfaW50ZXJuYWxTZWVkWyBpIF0gKTtcbiAgICAgICAgICAgICAgICBpZiggczEgPCAwICkgeyBzMSArPSAxOyB9XG5cbiAgICAgICAgICAgICAgICBzMiAtPSBtYXNoKCBfaW50ZXJuYWxTZWVkWyBpIF0gKTtcbiAgICAgICAgICAgICAgICBpZiggczIgPCAwICkgeyBzMiArPSAxOyB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hc2h2ZXIgPSBtYXNoLnZlcnNpb247XG5cbiAgICAgICAgICAgIG1hc2ggPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHByaXZhdGU6IGRlcGVuZGVudCBzdHJpbmcgaGFzaCBmdW5jdGlvbiAqL1xuICAgICAgICBmdW5jdGlvbiBNYXNoKCkge1xuICAgICAgICAgICAgdmFyIG4gPSA0MDIyODcxMTk3OyAvLyAweGVmYzgyNDlkXG5cbiAgICAgICAgICAgIHZhciBtYXNoID0gZnVuY3Rpb24oIGRhdGEgKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgICAgIC8vIGNhY2hlIHRoZSBsZW5ndGhcbiAgICAgICAgICAgICAgICBmb3IoIHZhciBpID0gMCwgbCA9IGRhdGEubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuICAgICAgICAgICAgICAgICAgICBuICs9IGRhdGEuY2hhckNvZGVBdCggaSApO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBoID0gMC4wMjUxOTYwMzI4MjQxNjkzOCAqIG47XG5cbiAgICAgICAgICAgICAgICAgICAgbiAgPSBoID4+PiAwO1xuICAgICAgICAgICAgICAgICAgICBoIC09IG47XG4gICAgICAgICAgICAgICAgICAgIGggKj0gbjtcbiAgICAgICAgICAgICAgICAgICAgbiAgPSBoID4+PiAwO1xuICAgICAgICAgICAgICAgICAgICBoIC09IG47XG4gICAgICAgICAgICAgICAgICAgIG4gKz0gaCAqIDQyOTQ5NjcyOTY7IC8vIDB4MTAwMDAwMDAwICAgICAgMl4zMlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gKCBuID4+PiAwICkgKiAyLjMyODMwNjQzNjUzODY5NjNlLTEwOyAvLyAyXi0zMlxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbWFzaC52ZXJzaW9uID0gJ01hc2ggMC45JztcbiAgICAgICAgICAgIHJldHVybiBtYXNoO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLyogcHJpdmF0ZTogY2hlY2sgaWYgbnVtYmVyIGlzIGludGVnZXIgKi9cbiAgICAgICAgZnVuY3Rpb24gX2lzSW50ZWdlciggX2ludCApIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludCggX2ludCwgMTAgKSA9PT0gX2ludDtcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHJldHVybiBhIDMyLWJpdCBmcmFjdGlvbiBpbiB0aGUgcmFuZ2UgWzAsIDFdXG4gICAgICAgIFRoaXMgaXMgdGhlIG1haW4gZnVuY3Rpb24gcmV0dXJuZWQgd2hlbiBhbGVhUFJORyBpcyBpbnN0YW50aWF0ZWRcbiAgICAgICAgKi9cbiAgICAgICAgdmFyIHJhbmRvbSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHQgPSAyMDkxNjM5ICogczAgKyBjICogMi4zMjgzMDY0MzY1Mzg2OTYzZS0xMDsgLy8gMl4tMzJcblxuICAgICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgICAgIHMxID0gczI7XG5cbiAgICAgICAgICAgIHJldHVybiBzMiA9IHQgLSAoIGMgPSB0IHwgMCApO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogcmV0dXJuIGEgNTMtYml0IGZyYWN0aW9uIGluIHRoZSByYW5nZSBbMCwgMV0gKi9cbiAgICAgICAgcmFuZG9tLmZyYWN0NTMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiByYW5kb20oKSArICggcmFuZG9tKCkgKiAweDIwMDAwMCAgfCAwICkgKiAxLjExMDIyMzAyNDYyNTE1NjVlLTE2OyAvLyAyXi01M1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogcmV0dXJuIGFuIHVuc2lnbmVkIGludGVnZXIgaW4gdGhlIHJhbmdlIFswLCAyXjMyXSAqL1xuICAgICAgICByYW5kb20uaW50MzIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiByYW5kb20oKSAqIDB4MTAwMDAwMDAwOyAvLyAyXjMyXG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiBhZHZhbmNlIHRoZSBnZW5lcmF0b3IgdGhlIHNwZWNpZmllZCBhbW91bnQgb2YgY3ljbGVzICovXG4gICAgICAgIHJhbmRvbS5jeWNsZSA9IGZ1bmN0aW9uKCBfcnVuICkge1xuICAgICAgICAgICAgX3J1biA9IHR5cGVvZiBfcnVuID09PSAndW5kZWZpbmVkJyA/IDEgOiArX3J1bjtcbiAgICAgICAgICAgIGlmKCBfcnVuIDwgMSApIHsgX3J1biA9IDE7IH1cbiAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgX3J1bjsgaSsrICkgeyByYW5kb20oKTsgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogcmV0dXJuIGluY2x1c2l2ZSByYW5nZSAqL1xuICAgICAgICByYW5kb20ucmFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBsb0JvdW5kXG4gICAgICAgICAgICAgICAgLCBoaUJvdW5kXG4gICAgICAgICAgICA7XG5cbiAgICAgICAgICAgIGlmKCBhcmd1bWVudHMubGVuZ3RoID09PSAxICkge1xuICAgICAgICAgICAgICAgIGxvQm91bmQgPSAwO1xuICAgICAgICAgICAgICAgIGhpQm91bmQgPSBhcmd1bWVudHNbIDAgXTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb0JvdW5kID0gYXJndW1lbnRzWyAwIF07XG4gICAgICAgICAgICAgICAgaGlCb3VuZCA9IGFyZ3VtZW50c1sgMSBdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiggYXJndW1lbnRzWyAwIF0gPiBhcmd1bWVudHNbIDEgXSApIHtcbiAgICAgICAgICAgICAgICBsb0JvdW5kID0gYXJndW1lbnRzWyAxIF07XG4gICAgICAgICAgICAgICAgaGlCb3VuZCA9IGFyZ3VtZW50c1sgMCBdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyByZXR1cm4gaW50ZWdlclxuICAgICAgICAgICAgaWYoIF9pc0ludGVnZXIoIGxvQm91bmQgKSAmJiBfaXNJbnRlZ2VyKCBoaUJvdW5kICkgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoIHJhbmRvbSgpICogKCBoaUJvdW5kIC0gbG9Cb3VuZCArIDEgKSApICsgbG9Cb3VuZDtcblxuICAgICAgICAgICAgLy8gcmV0dXJuIGZsb2F0XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiByYW5kb20oKSAqICggaGlCb3VuZCAtIGxvQm91bmQgKSArIGxvQm91bmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiBpbml0aWFsaXplIGdlbmVyYXRvciB3aXRoIHRoZSBzZWVkIHZhbHVlcyB1c2VkIHVwb24gaW5zdGFudGlhdGlvbiAqL1xuICAgICAgICByYW5kb20ucmVzdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgX2luaXRTdGF0ZSggaW5pdGlhbEFyZ3MgKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHNlZWRpbmcgZnVuY3Rpb24gKi9cbiAgICAgICAgcmFuZG9tLnNlZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIF9pbml0U3RhdGUoIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSApO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogc2hvdyB0aGUgdmVyc2lvbiBvZiB0aGUgUk5HICovXG4gICAgICAgIHJhbmRvbS52ZXJzaW9uID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdmVyc2lvbjtcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHNob3cgdGhlIHZlcnNpb24gb2YgdGhlIFJORyBhbmQgdGhlIE1hc2ggc3RyaW5nIGhhc2hlciAqL1xuICAgICAgICByYW5kb20udmVyc2lvbnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB2ZXJzaW9uICsgJywgJyArIG1hc2h2ZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gd2hlbiBubyBzZWVkIGlzIHNwZWNpZmllZCwgY3JlYXRlIGEgcmFuZG9tIG9uZSBmcm9tIFdpbmRvd3MgQ3J5cHRvIChNb250ZSBDYXJsbyBhcHBsaWNhdGlvbilcbiAgICAgICAgaWYoIGFyZ3MubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKCB1aW50YSApO1xuICAgICAgICAgICAgIGFyZ3MgPSBbIHVpbnRhWyAwIF0sIHVpbnRhWyAxIF0sIHVpbnRhWyAyIF0gXTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBzdG9yZSB0aGUgc2VlZCB1c2VkIHdoZW4gdGhlIFJORyB3YXMgaW5zdGFudGlhdGVkLCBpZiBhbnlcbiAgICAgICAgaW5pdGlhbEFyZ3MgPSBhcmdzO1xuXG4gICAgICAgIC8vIGluaXRpYWxpemUgdGhlIFJOR1xuICAgICAgICBfaW5pdFN0YXRlKCBhcmdzICk7XG5cbiAgICAgICAgcmV0dXJuIHJhbmRvbTtcblxuICAgIH0pKCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICkgKTtcbn07IiwiaW1wb3J0IEZJVEIgZnJvbSBcIi4vZml0Yi5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWRGSVRCIGV4dGVuZHMgRklUQiB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdGhpcy5yZW5kZXJUaW1lZEljb24odGhpcy5pbnB1dERpdik7XG4gICAgICAgIHRoaXMuaGlkZUJ1dHRvbnMoKTtcbiAgICAgICAgdGhpcy5uZWVkc1JlaW5pdGlhbGl6YXRpb24gPSB0cnVlO1xuICAgIH1cbiAgICBoaWRlQnV0dG9ucygpIHtcbiAgICAgICAgJCh0aGlzLnN1Ym1pdEJ1dHRvbikuaGlkZSgpO1xuICAgICAgICAkKHRoaXMuY29tcGFyZUJ1dHRvbikuaGlkZSgpO1xuICAgIH1cbiAgICByZW5kZXJUaW1lZEljb24oY29tcG9uZW50KSB7XG4gICAgICAgIC8vIHJlbmRlcnMgdGhlIGNsb2NrIGljb24gb24gdGltZWQgY29tcG9uZW50cy4gICAgVGhlIGNvbXBvbmVudCBwYXJhbWV0ZXJcbiAgICAgICAgLy8gaXMgdGhlIGVsZW1lbnQgdGhhdCB0aGUgaWNvbiBzaG91bGQgYmUgYXBwZW5kZWQgdG8uXG4gICAgICAgIHZhciB0aW1lSWNvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHZhciB0aW1lSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICAgICQodGltZUljb24pLmF0dHIoe1xuICAgICAgICAgICAgc3JjOiBcIi4uL19zdGF0aWMvY2xvY2sucG5nXCIsXG4gICAgICAgICAgICBzdHlsZTogXCJ3aWR0aDoxNXB4O2hlaWdodDoxNXB4XCIsXG4gICAgICAgIH0pO1xuICAgICAgICB0aW1lSWNvbkRpdi5jbGFzc05hbWUgPSBcInRpbWVUaXBcIjtcbiAgICAgICAgdGltZUljb25EaXYudGl0bGUgPSBcIlwiO1xuICAgICAgICB0aW1lSWNvbkRpdi5hcHBlbmRDaGlsZCh0aW1lSWNvbik7XG4gICAgICAgICQoY29tcG9uZW50KS5wcmVwZW5kKHRpbWVJY29uRGl2KTtcbiAgICB9XG4gICAgY2hlY2tDb3JyZWN0VGltZWQoKSB7XG4gICAgICAgIC8vIFJldHVybnMgaWYgdGhlIHF1ZXN0aW9uIHdhcyBjb3JyZWN0LCBpbmNvcnJlY3QsIG9yIHNraXBwZWQgKHJldHVybiBudWxsIGluIHRoZSBsYXN0IGNhc2UpXG4gICAgICAgIHN3aXRjaCAodGhpcy5jb3JyZWN0KSB7XG4gICAgICAgICAgICBjYXNlIHRydWU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiVFwiO1xuICAgICAgICAgICAgY2FzZSBmYWxzZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJGXCI7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGhpZGVGZWVkYmFjaygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsYW5rQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICQodGhpcy5ibGFua0FycmF5W2ldKS5yZW1vdmVDbGFzcyhcImlucHV0LXZhbGlkYXRpb24tZXJyb3JcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxuXG4gICAgcmVpbml0aWFsaXplTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLnNldHVwQmxhbmtzKCk7XG4gICAgfVxufVxuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5LmZpbGxpbnRoZWJsYW5rID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICBpZiAob3B0cy50aW1lZCkge1xuICAgICAgICByZXR1cm4gbmV3IFRpbWVkRklUQihvcHRzKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBGSVRCKG9wdHMpO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==