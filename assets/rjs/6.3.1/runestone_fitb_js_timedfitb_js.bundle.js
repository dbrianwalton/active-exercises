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
                    case "BTM":
                        import_promises.push(
                            __webpack_require__.e(/*! import() */ "vendors-node_modules_btm-expressions_src_BTM_root_js").then(__webpack_require__.bind(__webpack_require__, /*! btm-expressions/src/BTM_root.js */ 33792))
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
                df = df
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2ZpdGJfanNfdGltZWRmaXRiX2pzLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7Ozs7O0FDUEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkQ7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRXFDOztBQUVsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLHVCQUF1QjtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsWUFBWSxNQUFNO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEseVdBQXlXO0FBQ3pXO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLCtEQUFROztBQUV6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLElBQUksVUFBVSxXQUFXO0FBQy9DO0FBQ0E7QUFDQSx3QkFBd0IsMkJBQTJCO0FBQ25EO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLG9DQUFvQyxPQUFPO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTix5REFBeUQsT0FBTztBQUNoRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUCxzQ0FBc0MseUJBQXlCO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixzQkFBc0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdCQUFnQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLFlBQVkseUJBQXlCO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQSxrTUFBa007QUFDbE07QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtSkFBbUo7QUFDbko7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLG1DQUFtQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLGlFQUFpRSxNQUFNO0FBQ3ZFO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9GQUFvRjtBQUNwRjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7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RUE7QUFDQTs7QUFFQTs7QUFFQSxLQUFLO0FBQ0w7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0TDZCO0FBQ2Qsd0JBQXdCLGdEQUFJO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsNEJBQTRCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxnREFBSTtBQUNuQiIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9jc3MvZml0Yi5jc3MiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2pzL2ZpdGItaTE4bi5lbi5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvZml0Yi1pMThuLnB0LWJyLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLXV0aWxzLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9saWJzL2FsZWFQUk5HLTEuMS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvdGltZWRmaXRiLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIiQuaTE4bigpLmxvYWQoe1xuICAgIGVuOiB7XG4gICAgICAgIG1zZ19ub19hbnN3ZXI6IFwiTm8gYW5zd2VyIHByb3ZpZGVkLlwiLFxuICAgICAgICBtc2dfZml0Yl9jaGVja19tZTogXCJDaGVjayBtZVwiLFxuICAgICAgICBtc2dfZml0Yl9jb21wYXJlX21lOiBcIkNvbXBhcmUgbWVcIixcbiAgICAgICAgbXNnX2ZpdGJfcmFuZG9taXplOiBcIlJhbmRvbWl6ZVwiLFxuICAgIH0sXG59KTtcbiIsIiQuaTE4bigpLmxvYWQoe1xuICAgIFwicHQtYnJcIjoge1xuICAgICAgICBtc2dfbm9fYW5zd2VyOiBcIk5lbmh1bWEgcmVzcG9zdGEgZGFkYS5cIixcbiAgICAgICAgbXNnX2ZpdGJfY2hlY2tfbWU6IFwiVmVyaWZpY2FyXCIsXG4gICAgICAgIG1zZ19maXRiX2NvbXBhcmVfbWU6IFwiQ29tcGFyYXJcIlxuICAgIH0sXG59KTtcbiIsIi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyB8ZG9jbmFtZXwgLSBncmFkaW5nLXJlbGF0ZWQgdXRpbGl0aWVzIGZvciBGSVRCIHF1ZXN0aW9uc1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIFRoaXMgY29kZSBydW5zIGJvdGggb24gdGhlIHNlcnZlciAoZm9yIHNlcnZlci1zaWRlIGdyYWRpbmcpIGFuZCBvbiB0aGUgY2xpZW50LiBJdCdzIHBsYWNlZCBoZXJlIGFzIGEgc2V0IG9mIGZ1bmN0aW9ucyBzcGVjaWZpY2FsbHkgZm9yIHRoaXMgcHVycG9zZS5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCB7IGFsZWFQUk5HIH0gZnJvbSBcIi4vbGlicy9hbGVhUFJORy0xLjEuanNcIjtcblxuLy8gSW5jbHVkZXNcbi8vID09PT09PT09XG4vLyBOb25lLlxuLy9cbi8vXG4vLyBHbG9iYWxzXG4vLyA9PT09PT09XG5mdW5jdGlvbiByZW5kZXJfaHRtbChodG1sX2luLCBkeW5fdmFyc19ldmFsKSB7XG4gICAgLy8gQ2hhbmdlIHRoZSByZXBsYWNlbWVudCB0b2tlbnMgaW4gdGhlIEhUTUwgaW50byB0YWdzLCBzbyB3ZSBjYW4gcmVwbGFjZSB0aGVtIHVzaW5nIFhNTC4gVGhlIGhvcnJpYmxlIHJlZ2V4IGlzOlxuICAgIC8vXG4gICAgLy8gTG9vayBmb3IgdGhlIGNoYXJhY3RlcnMgYGBbJT1gYCAodGhlIG9wZW5pbmcgZGVsaW1pdGVyKVxuICAgIC8vLyBcXFslPVxuICAgIC8vIEZvbGxvd2VkIGJ5IGFueSBhbW91bnQgb2Ygd2hpdGVzcGFjZS5cbiAgICAvLy8gXFxzKlxuICAgIC8vIFN0YXJ0IGEgZ3JvdXAgdGhhdCB3aWxsIGNhcHR1cmUgdGhlIGNvbnRlbnRzIChleGNsdWRpbmcgd2hpdGVzcGFjZSkgb2YgdGhlIHRva2Vucy4gRm9yIGV4YW1wbGUsIGdpdmVuIGBgWyU9IGZvbygpICVdYGAsIHRoZSBjb250ZW50cyBpcyBgYGZvbygpYGAuXG4gICAgLy8vIChcbiAgICAvLyBEb24ndCBjYXB0dXJlIHRoZSBjb250ZW50cyBvZiB0aGlzIGdyb3VwLCBzaW5jZSBpdCdzIG9ubHkgYSBzaW5nbGUgY2hhcmFjdGVyLiBNYXRjaCBhbnkgY2hhcmFjdGVyLi4uXG4gICAgLy8vIChcbiAgICAvLy8gPzouXG4gICAgLy8vIC4uLnRoYXQgZG9lc24ndCBlbmQgd2l0aCBgYCVdYGAgKHRoZSBjbG9zaW5nIGRlbGltaXRlcikuXG4gICAgLy8vICg/ISVdKVxuICAgIC8vLyApXG4gICAgLy8gTWF0Y2ggdGhpcyAoYW55dGhpbmcgYnV0IHRoZSBjbG9zaW5nIGRlbGltaXRlcikgYXMgbXVjaCBhcyB3ZSBjYW4uXG4gICAgLy8vICopXG4gICAgLy8gTmV4dCwgbG9vayBmb3IgYW55IHdoaXRlc3BhY2UuXG4gICAgLy8vIFxccypcbiAgICAvLyBGaW5hbGx5LCBsb29rIGZvciB0aGUgY2xvc2luZyBkZWxpbWl0ZXIgYGAlXWBgLlxuICAgIC8vLyAlXFxdXG4gICAgY29uc3QgaHRtbF9yZXBsYWNlZCA9IGh0bWxfaW4ucmVwbGFjZUFsbChcbiAgICAgICAgL1xcWyU9XFxzKigoPzouKD8hJV0pKSopXFxzKiVcXF0vZyxcbiAgICAgICAgLy8gUmVwbGFjZSBpdCB3aXRoIGEgYDxzY3JpcHQtZXZhbD5gIHRhZy4gUXVvdGUgdGhlIHN0cmluZywgd2hpY2ggd2lsbCBhdXRvbWF0aWNhbGx5IGVzY2FwZSBhbnkgZG91YmxlIHF1b3RlcywgdXNpbmcgSlNPTi5cbiAgICAgICAgKG1hdGNoLCBncm91cDEpID0+XG4gICAgICAgICAgICBgPHNjcmlwdC1ldmFsIGV4cHI9JHtKU09OLnN0cmluZ2lmeShncm91cDEpfT48L3NjcmlwdC1ldmFsPmBcbiAgICApO1xuICAgIC8vIEdpdmVuIEhUTUwsIHR1cm4gaXQgaW50byBhIERPTS4gV2FsayB0aGUgYGA8c2NyaXB0LWV2YWw+YGAgdGFncywgcGVyZm9ybWluZyB0aGUgcmVxdWVzdGVkIGV2YWx1YXRpb24gb24gdGhlbS5cbiAgICAvL1xuICAgIC8vIFNlZSBgRE9NUGFyc2VyIDxodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRE9NUGFyc2VyPmBfLlxuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbiAgICAvLyBTZWUgYERPTVBhcnNlci5wYXJzZUZyb21TdHJpbmcoKSA8aHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0RPTVBhcnNlci9wYXJzZUZyb21TdHJpbmc+YF8uXG4gICAgY29uc3QgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhodG1sX3JlcGxhY2VkLCBcInRleHQvaHRtbFwiKTtcbiAgICBjb25zdCBzY3JpcHRfZXZhbF90YWdzID0gZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0LWV2YWxcIik7XG4gICAgd2hpbGUgKHNjcmlwdF9ldmFsX3RhZ3MubGVuZ3RoKSB7XG4gICAgICAgIC8vIEdldCB0aGUgZmlyc3QgdGFnLiBJdCB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgY29sbGVjdGlvbiBhZnRlciBpdCdzIHJlcGxhY2VkIHdpdGggaXRzIHZhbHVlLlxuICAgICAgICBjb25zdCBzY3JpcHRfZXZhbF90YWcgPSBzY3JpcHRfZXZhbF90YWdzWzBdO1xuICAgICAgICAvLyBTZWUgaWYgdGhpcyBgYDxzY3JpcHQtZXZhbD5gYCB0YWcgaGFzIGFzIGBgQGV4cHJgYCBhdHRyaWJ1dGUuXG4gICAgICAgIGNvbnN0IGV4cHIgPSBzY3JpcHRfZXZhbF90YWcuZ2V0QXR0cmlidXRlKFwiZXhwclwiKTtcbiAgICAgICAgLy8gSWYgc28sIGV2YWx1YXRlIGl0LlxuICAgICAgICBpZiAoZXhwcikge1xuICAgICAgICAgICAgY29uc3QgZXZhbF9yZXN1bHQgPSB3aW5kb3cuRnVuY3Rpb24oXG4gICAgICAgICAgICAgICAgXCJ2XCIsXG4gICAgICAgICAgICAgICAgLi4uT2JqZWN0LmtleXMoZHluX3ZhcnNfZXZhbCksXG4gICAgICAgICAgICAgICAgYFwidXNlIHN0cmljdDtcIlxcbnJldHVybiAke2V4cHJ9O2BcbiAgICAgICAgICAgICkoZHluX3ZhcnNfZXZhbCwgLi4uT2JqZWN0LnZhbHVlcyhkeW5fdmFyc19ldmFsKSk7XG4gICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSB0YWcgd2l0aCB0aGUgcmVzdWx0aW5nIHZhbHVlLlxuICAgICAgICAgICAgc2NyaXB0X2V2YWxfdGFnLnJlcGxhY2VXaXRoKGV2YWxfcmVzdWx0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiB0aGUgYm9keSBjb250ZW50cy4gTm90ZSB0aGF0IHRoZSBgYERPTVBhcnNlcmBgIGNvbnN0cnVjdHMgYW4gZW50aXJlIGRvY3VtZW50LCBub3QganVzdCB0aGUgZG9jdW1lbnQgZnJhZ21lbnQgd2UgcGFzc2VkIGl0LiBUaGVyZWZvcmUsIGV4dHJhY3QgdGhlIGRlc2lyZWQgZnJhZ21lbnQgYW5kIHJldHVybiB0aGF0LiBOb3RlIHRoYXQgd2UgbmVlZCB0byB1c2UgYGNoaWxkTm9kZXMgPGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlL2NoaWxkTm9kZXM+YF8sIHdoaWNoIGluY2x1ZGVzIG5vbi1lbGVtZW50IGNoaWxkcmVuIGxpa2UgdGV4dCBhbmQgY29tbWVudHM7IHVzaW5nIGBgY2hpbGRyZW5gYCBvbWl0cyB0aGVzZSBub24tZWxlbWVudCBjaGlsZHJlbi5cbiAgICByZXR1cm4gZG9jLmJvZHkuY2hpbGROb2Rlcztcbn1cblxuLy8gRnVuY3Rpb25zXG4vLyA9PT09PT09PT1cbi8vIFVwZGF0ZSB0aGUgcHJvYmxlbSdzIGRlc2NyaXB0aW9uIGJhc2VkIG9uIGR5bmFtaWNhbGx5LWdlbmVyYXRlZCBjb250ZW50LlxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckR5bmFtaWNDb250ZW50KFxuICAgIHNlZWQsXG4gICAgZHluX3ZhcnMsXG4gICAgZHluX2ltcG9ydHMsXG4gICAgaHRtbF9pbixcbiAgICBkaXZpZCxcbiAgICBwcmVwYXJlQ2hlY2tBbnN3ZXJzXG4pIHtcbiAgICAvLyBJbml0aWFsaXplIFJORyB3aXRoIGBgc2VlZGBgLlxuICAgIGNvbnN0IHJhbmQgPSBhbGVhUFJORyhzZWVkKTtcblxuICAgIC8vIFNlZSBgUkFORF9GVU5DIDxSQU5EX0ZVTkM+YF8sIHdoaWNoIHJlZmVycyB0byBgYHJhbmRgYCBhYm92ZS5cbiAgICBjb25zdCBkeW5fdmFyc19ldmFsID0gd2luZG93LkZ1bmN0aW9uKFxuICAgICAgICBcInZcIixcbiAgICAgICAgXCJyYW5kXCIsXG4gICAgICAgIC4uLk9iamVjdC5rZXlzKGR5bl9pbXBvcnRzKSxcbiAgICAgICAgYFwidXNlIHN0cmljdFwiO1xcbiR7ZHluX3ZhcnN9O1xcbnJldHVybiB2O2BcbiAgICApKFxuICAgICAgICAvLyBXZSB3YW50IHYuZGl2aWQgPSBkaXZpZCBhbmQgdi5wcmVwYXJlQ2hlY2tBbnN3ZXJzID0gcHJlcGFyZUNoZWNrQW5zd2Vycy4gSW4gY29udHJhc3QsIHRoZSBrZXkvdmFsdWVzIHBhaXJzIG9mIGR5bl9pbXBvcnRzIHNob3VsZCBiZSBkaXJlY3RseSBhc3NpZ25lZCB0byB2LCBoZW5jZSB0aGUgT2JqZWN0LmFzc2lnbi5cbiAgICAgICAgT2JqZWN0LmFzc2lnbih7IGRpdmlkLCBwcmVwYXJlQ2hlY2tBbnN3ZXJzfSwgZHluX2ltcG9ydHMpLFxuICAgICAgICByYW5kLFxuICAgICAgICAvLyBJbiBhZGRpdGlvbiB0byBwcm92aWRpbmcgdGhpcyBpbiB2LCBtYWtlIGl0IGF2YWlsYWJsZSBpbiB0aGUgZnVuY3Rpb24gYXMgd2VsbCwgc2luY2UgbW9zdCBwcm9ibGVtIGF1dGhvcnMgd2lsbCB3cml0ZSBgYGZvbyA9IG5ldyBCVE0oKWBgIChmb3IgZXhhbXBsZSwgYXNzdW1pbmcgQlRNIGlzIGluIGR5bl9pbXBvcnRzKSBpbnN0ZWFkIG9mIGBgZm9vID0gbmV3IHYuQlRNKClgYCAod2hpY2ggaXMgdW51c3VhbCBzeW50YXgpLlxuICAgICAgICAuLi5PYmplY3QudmFsdWVzKGR5bl9pbXBvcnRzKSk7XG5cbiAgICBsZXQgaHRtbF9vdXQ7XG4gICAgaWYgKHR5cGVvZiBkeW5fdmFyc19ldmFsLmJlZm9yZUNvbnRlbnRSZW5kZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZHluX3ZhcnNfZXZhbC5iZWZvcmVDb250ZW50UmVuZGVyKGR5bl92YXJzX2V2YWwpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLFxuICAgICAgICAgICAgICAgIGBFcnJvciBpbiBwcm9ibGVtICR7ZGl2aWR9IGludm9raW5nIGJlZm9yZUNvbnRlbnRSZW5kZXJgXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGh0bWxfb3V0ID0gcmVuZGVyX2h0bWwoaHRtbF9pbiwgZHluX3ZhcnNfZXZhbCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLCBgRXJyb3IgcmVuZGVyaW5nIHByb2JsZW0gJHtkaXZpZH0gdGV4dC5gKTtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgIH1cblxuICAgIC8vIHRoZSBhZnRlckNvbnRlbnRSZW5kZXIgZXZlbnQgd2lsbCBiZSBjYWxsZWQgYnkgdGhlIGNhbGxlciBvZiB0aGlzIGZ1bmN0aW9uIChhZnRlciBpdCB1cGRhdGVkIHRoZSBIVE1MIGJhc2VkIG9uIHRoZSBjb250ZW50cyBvZiBodG1sX291dCkuXG4gICAgcmV0dXJuIFtodG1sX291dCwgZHluX3ZhcnNfZXZhbF07XG59XG5cbi8vIEdpdmVuIHN0dWRlbnQgYW5zd2VycywgZ3JhZGUgdGhlbSBhbmQgcHJvdmlkZSBmZWVkYmFjay5cbi8vXG4vLyBPdXRwdXRzOlxuLy9cbi8vIC0gICAgYGBkaXNwbGF5RmVlZGBgIGlzIGFuIGFycmF5IG9mIEhUTUwgZmVlZGJhY2suXG4vLyAtICAgIGBgaXNDb3JyZWN0QXJyYXlgYCBpcyBhbiBhcnJheSBvZiB0cnVlLCBmYWxzZSwgb3IgbnVsbCAodGhlIHF1ZXN0aW9uIHdhc24ndCBhbnN3ZXJlZCkuXG4vLyAtICAgIGBgY29ycmVjdGBgIGlzIHRydWUsIGZhbHNlLCBvciBudWxsICh0aGUgcXVlc3Rpb24gd2Fzbid0IGFuc3dlcmVkKS5cbi8vIC0gICAgYGBwZXJjZW50YGAgaXMgdGhlIHBlcmNlbnRhZ2Ugb2YgY29ycmVjdCBhbnN3ZXJzIChmcm9tIDAgdG8gMSwgbm90IDAgdG8gMTAwKS5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja0Fuc3dlcnNDb3JlKFxuICAgIC8vIF9gYmxhbmtOYW1lc0RpY3RgOiBBbiBkaWN0IG9mIHtibGFua19uYW1lLCBibGFua19pbmRleH0gc3BlY2lmeWluZyB0aGUgbmFtZSBmb3IgZWFjaCBuYW1lZCBibGFuay5cbiAgICBibGFua05hbWVzRGljdCxcbiAgICAvLyBfYGdpdmVuX2FycmA6IEFuIGFycmF5IG9mIHN0cmluZ3MgY29udGFpbmluZyBzdHVkZW50LXByb3ZpZGVkIGFuc3dlcnMgZm9yIGVhY2ggYmxhbmsuXG4gICAgZ2l2ZW5fYXJyLFxuICAgIC8vIEEgMi1EIGFycmF5IG9mIHN0cmluZ3MgZ2l2aW5nIGZlZWRiYWNrIGZvciBlYWNoIGJsYW5rLlxuICAgIGZlZWRiYWNrQXJyYXksXG4gICAgLy8gX2BkeW5fdmFyc19ldmFsYDogQSBkaWN0IHByb2R1Y2VkIGJ5IGV2YWx1YXRpbmcgdGhlIEphdmFTY3JpcHQgZm9yIGEgZHluYW1pYyBleGVyY2lzZS5cbiAgICBkeW5fdmFyc19ldmFsXG4pIHtcbiAgICBpZiAoXG4gICAgICAgIGR5bl92YXJzX2V2YWwgJiZcbiAgICAgICAgdHlwZW9mIGR5bl92YXJzX2V2YWwuYmVmb3JlQ2hlY2tBbnN3ZXJzID09PSBcImZ1bmN0aW9uXCJcbiAgICApIHtcbiAgICAgICAgY29uc3QgW25hbWVkQmxhbmtWYWx1ZXMsIGdpdmVuX2Fycl9jb252ZXJ0ZWRdID0gcGFyc2VBbnN3ZXJzKFxuICAgICAgICAgICAgYmxhbmtOYW1lc0RpY3QsXG4gICAgICAgICAgICBnaXZlbl9hcnIsXG4gICAgICAgICAgICBkeW5fdmFyc19ldmFsXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGR2ZV9ibGFua3MgPSBPYmplY3QuYXNzaWduKHt9LCBkeW5fdmFyc19ldmFsLCBuYW1lZEJsYW5rVmFsdWVzKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWwuYmVmb3JlQ2hlY2tBbnN3ZXJzKGR2ZV9ibGFua3MsIGdpdmVuX2Fycl9jb252ZXJ0ZWQpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLCBcIkVycm9yIGNhbGxpbmcgYmVmb3JlQ2hlY2tBbnN3ZXJzXCIpO1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gS2VlcCB0cmFjayBpZiBhbGwgYW5zd2VycyBhcmUgY29ycmVjdCBvciBub3QuXG4gICAgbGV0IGNvcnJlY3QgPSB0cnVlO1xuICAgIGNvbnN0IGlzQ29ycmVjdEFycmF5ID0gW107XG4gICAgY29uc3QgZGlzcGxheUZlZWQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdpdmVuX2Fyci5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBnaXZlbiA9IGdpdmVuX2FycltpXTtcbiAgICAgICAgLy8gSWYgdGhpcyBibGFuayBpcyBlbXB0eSwgcHJvdmlkZSBubyBmZWVkYmFjayBmb3IgaXQuXG4gICAgICAgIGlmIChnaXZlbiA9PT0gXCJcIikge1xuICAgICAgICAgICAgaXNDb3JyZWN0QXJyYXkucHVzaChudWxsKTtcbiAgICAgICAgICAgIC8vIFRPRE86IHdhcyAkLmkxOG4oXCJtc2dfbm9fYW5zd2VyXCIpLlxuICAgICAgICAgICAgZGlzcGxheUZlZWQucHVzaChcIk5vIGFuc3dlciBwcm92aWRlZC5cIik7XG4gICAgICAgICAgICBjb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBMb29rIHRocm91Z2ggYWxsIGZlZWRiYWNrIGZvciB0aGlzIGJsYW5rLiBUaGUgbGFzdCBlbGVtZW50IGluIHRoZSBhcnJheSBhbHdheXMgbWF0Y2hlcy4gSWYgbm8gZmVlZGJhY2sgZm9yIHRoaXMgYmxhbmsgZXhpc3RzLCB1c2UgYW4gZW1wdHkgbGlzdC5cbiAgICAgICAgICAgIGNvbnN0IGZibCA9IGZlZWRiYWNrQXJyYXlbaV0gfHwgW107XG4gICAgICAgICAgICBsZXQgajtcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBmYmwubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgbGFzdCBpdGVtIG9mIGZlZWRiYWNrIGFsd2F5cyBtYXRjaGVzLlxuICAgICAgICAgICAgICAgIGlmIChqID09PSBmYmwubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKGZibFtqXVtcImZlZWRiYWNrXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgYSBkeW5hbWljIHNvbHV0aW9uLi4uXG4gICAgICAgICAgICAgICAgaWYgKGR5bl92YXJzX2V2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW25hbWVkQmxhbmtWYWx1ZXMsIGdpdmVuX2Fycl9jb252ZXJ0ZWRdID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlQW5zd2VycyhibGFua05hbWVzRGljdCwgZ2l2ZW5fYXJyLCBkeW5fdmFyc19ldmFsKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgd2FzIGEgcGFyc2UgZXJyb3IsIHRoZW4gaXQgc3R1ZGVudCdzIGFuc3dlciBpcyBpbmNvcnJlY3QuXG4gICAgICAgICAgICAgICAgICAgIGlmIChnaXZlbl9hcnJfY29udmVydGVkW2ldIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKGdpdmVuX2Fycl9jb252ZXJ0ZWRbaV0ubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDb3VudCB0aGlzIGFzIHdyb25nIGJ5IG1ha2luZyBqICE9IDAgLS0gc2VlIHRoZSBjb2RlIHRoYXQgcnVucyBpbW1lZGlhdGVseSBhZnRlciB0aGUgZXhlY3V0aW5nIHRoZSBicmVhay5cbiAgICAgICAgICAgICAgICAgICAgICAgIGogPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGEgZnVuY3Rpb24gdG8gd3JhcCB0aGUgZXhwcmVzc2lvbiB0byBldmFsdWF0ZS4gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0Z1bmN0aW9uL0Z1bmN0aW9uLlxuICAgICAgICAgICAgICAgICAgICAvLyBQYXNzIHRoZSBhbnN3ZXIsIGFycmF5IG9mIGFsbCBhbnN3ZXJzLCB0aGVuIGFsbCBlbnRyaWVzIGluIGBgdGhpcy5keW5fdmFyc19ldmFsYGAgZGljdCBhcyBmdW5jdGlvbiBwYXJhbWV0ZXJzLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc19lcXVhbCA9IHdpbmRvdy5GdW5jdGlvbihcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYW5zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFuc19hcnJheVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uT2JqZWN0LmtleXMoZHluX3ZhcnNfZXZhbCksXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5PYmplY3Qua2V5cyhuYW1lZEJsYW5rVmFsdWVzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGBcInVzZSBzdHJpY3Q7XCJcXG5yZXR1cm4gJHtmYmxbal1bXCJzb2x1dGlvbl9jb2RlXCJdfTtgXG4gICAgICAgICAgICAgICAgICAgICkoXG4gICAgICAgICAgICAgICAgICAgICAgICBnaXZlbl9hcnJfY29udmVydGVkW2ldLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2l2ZW5fYXJyX2NvbnZlcnRlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLk9iamVjdC52YWx1ZXMoZHluX3ZhcnNfZXZhbCksXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5PYmplY3QudmFsdWVzKG5hbWVkQmxhbmtWYWx1ZXMpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHN0dWRlbnQncyBhbnN3ZXIgaXMgZXF1YWwgdG8gdGhpcyBpdGVtLCB0aGVuIGFwcGVuZCB0aGlzIGl0ZW0ncyBmZWVkYmFjay5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzX2VxdWFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBpc19lcXVhbCA9PT0gXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGlzX2VxdWFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZmJsW2pdW1wiZmVlZGJhY2tcIl1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgYSByZWdleHAuLi5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFwicmVnZXhcIiBpbiBmYmxbal0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdHQgPSBSZWdFeHAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmJsW2pdW1wicmVnZXhcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmJsW2pdW1wicmVnZXhGbGFnc1wiXVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXR0LnRlc3QoZ2l2ZW4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheUZlZWQucHVzaChmYmxbal1bXCJmZWVkYmFja1wiXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIGEgbnVtYmVyLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoXCJudW1iZXJcIiBpbiBmYmxbal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgW21pbiwgbWF4XSA9IGZibFtqXVtcIm51bWJlclwiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgdGhlIGdpdmVuIHN0cmluZyB0byBhIG51bWJlci4gV2hpbGUgdGhlcmUgYXJlIGBsb3RzIG9mIHdheXMgPGh0dHBzOi8vY29kZXJ3YWxsLmNvbS9wLzV0bGhtdy9jb252ZXJ0aW5nLXN0cmluZ3MtdG8tbnVtYmVyLWluLWphdmFzY3JpcHQtcGl0ZmFsbHM+YF8gdG8gZG8gdGhpczsgdGhpcyB2ZXJzaW9uIHN1cHBvcnRzIG90aGVyIGJhc2VzIChoZXgvYmluYXJ5L29jdGFsKSBhcyB3ZWxsIGFzIGZsb2F0cy5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdHVhbCA9ICtnaXZlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3R1YWwgPj0gbWluICYmIGFjdHVhbCA8PSBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKGZibFtqXVtcImZlZWRiYWNrXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVGhlIGFuc3dlciBpcyBjb3JyZWN0IGlmIGl0IG1hdGNoZWQgdGhlIGZpcnN0IGVsZW1lbnQgaW4gdGhlIGFycmF5LiBBIHNwZWNpYWwgY2FzZTogaWYgb25seSBvbmUgYW5zd2VyIGlzIHByb3ZpZGVkLCBjb3VudCBpdCB3cm9uZzsgdGhpcyBpcyBhIG1pc2Zvcm1lZCBwcm9ibGVtLlxuICAgICAgICAgICAgY29uc3QgaXNfY29ycmVjdCA9IGogPT09IDAgJiYgZmJsLmxlbmd0aCA+IDE7XG4gICAgICAgICAgICBpc0NvcnJlY3RBcnJheS5wdXNoKGlzX2NvcnJlY3QpO1xuICAgICAgICAgICAgaWYgKCFpc19jb3JyZWN0KSB7XG4gICAgICAgICAgICAgICAgY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgICBkeW5fdmFyc19ldmFsICYmXG4gICAgICAgIHR5cGVvZiBkeW5fdmFyc19ldmFsLmFmdGVyQ2hlY2tBbnN3ZXJzID09PSBcImZ1bmN0aW9uXCJcbiAgICApIHtcbiAgICAgICAgY29uc3QgW25hbWVkQmxhbmtWYWx1ZXMsIGdpdmVuX2Fycl9jb252ZXJ0ZWRdID0gcGFyc2VBbnN3ZXJzKFxuICAgICAgICAgICAgYmxhbmtOYW1lc0RpY3QsXG4gICAgICAgICAgICBnaXZlbl9hcnIsXG4gICAgICAgICAgICBkeW5fdmFyc19ldmFsXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGR2ZV9ibGFua3MgPSBPYmplY3QuYXNzaWduKHt9LCBkeW5fdmFyc19ldmFsLCBuYW1lZEJsYW5rVmFsdWVzKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWwuYWZ0ZXJDaGVja0Fuc3dlcnMoZHZlX2JsYW5rcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIFwiRXJyb3IgY2FsbGluZyBhZnRlckNoZWNrQW5zd2Vyc1wiKTtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHBlcmNlbnQgPVxuICAgICAgICBpc0NvcnJlY3RBcnJheS5maWx0ZXIoQm9vbGVhbikubGVuZ3RoIC8gaXNDb3JyZWN0QXJyYXkubGVuZ3RoO1xuICAgIHJldHVybiBbZGlzcGxheUZlZWQsIGNvcnJlY3QsIGlzQ29ycmVjdEFycmF5LCBwZXJjZW50XTtcbn1cblxuLy8gVXNlIHRoZSBwcm92aWRlZCBwYXJzZXJzIHRvIGNvbnZlcnQgYSBzdHVkZW50J3MgYW5zd2VycyAoYXMgc3RyaW5ncykgdG8gdGhlIHR5cGUgcHJvZHVjZWQgYnkgdGhlIHBhcnNlciBmb3IgZWFjaCBibGFuay5cbmZ1bmN0aW9uIHBhcnNlQW5zd2VycyhcbiAgICAvLyBTZWUgYmxhbmtOYW1lc0RpY3RfLlxuICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgIC8vIFNlZSBnaXZlbl9hcnJfLlxuICAgIGdpdmVuX2FycixcbiAgICAvLyBTZWUgYGR5bl92YXJzX2V2YWxgLlxuICAgIGR5bl92YXJzX2V2YWxcbikge1xuICAgIC8vIFByb3ZpZGUgYSBkaWN0IG9mIHtibGFua19uYW1lLCBjb252ZXJ0ZXJfYW5zd2VyX3ZhbHVlfS5cbiAgICBjb25zdCBuYW1lZEJsYW5rVmFsdWVzID0gZ2V0TmFtZWRCbGFua1ZhbHVlcyhcbiAgICAgICAgZ2l2ZW5fYXJyLFxuICAgICAgICBibGFua05hbWVzRGljdCxcbiAgICAgICAgZHluX3ZhcnNfZXZhbFxuICAgICk7XG4gICAgLy8gSW52ZXJ0IGJsYW5rTmFtZWREaWN0OiBjb21wdXRlIGFuIGFycmF5IG9mIFtibGFua18wX25hbWUsIC4uLl0uIE5vdGUgdGhhdCB0aGUgYXJyYXkgbWF5IGJlIHNwYXJzZTogaXQgb25seSBjb250YWlucyB2YWx1ZXMgZm9yIG5hbWVkIGJsYW5rcy5cbiAgICBjb25zdCBnaXZlbl9hcnJfbmFtZXMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhibGFua05hbWVzRGljdCkpIHtcbiAgICAgICAgZ2l2ZW5fYXJyX25hbWVzW3ZdID0gaztcbiAgICB9XG4gICAgLy8gQ29tcHV0ZSBhbiBhcnJheSBvZiBbY29udmVydGVkX2JsYW5rXzBfdmFsLCAuLi5dLiBOb3RlIHRoYXQgdGhpcyByZS1jb252ZXJ0cyBhbGwgdGhlIHZhbHVlcywgcmF0aGVyIHRoYW4gKHBvc3NpYmx5IGRlZXApIGNvcHlpbmcgdGhlIHZhbHVlcyBmcm9tIGFscmVhZHktY29udmVydGVkIG5hbWVkIGJsYW5rcy5cbiAgICBjb25zdCBnaXZlbl9hcnJfY29udmVydGVkID0gZ2l2ZW5fYXJyLm1hcCgodmFsdWUsIGluZGV4KSA9PlxuICAgICAgICB0eXBlX2NvbnZlcnQoZ2l2ZW5fYXJyX25hbWVzW2luZGV4XSwgdmFsdWUsIGluZGV4LCBkeW5fdmFyc19ldmFsKVxuICAgICk7XG5cbiAgICByZXR1cm4gW25hbWVkQmxhbmtWYWx1ZXMsIGdpdmVuX2Fycl9jb252ZXJ0ZWRdO1xufVxuXG4vLyBSZW5kZXIgdGhlIGZlZWRiYWNrIGZvciBhIGR5bmFtaWMgcHJvYmxlbS5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJEeW5hbWljRmVlZGJhY2soXG4gICAgLy8gU2VlIGJsYW5rTmFtZXNEaWN0Xy5cbiAgICBibGFua05hbWVzRGljdCxcbiAgICAvLyBTZWUgZ2l2ZW5fYXJyXy5cbiAgICBnaXZlbl9hcnIsXG4gICAgLy8gVGhlIGluZGV4IG9mIHRoaXMgYmxhbmsgaW4gZ2l2ZW5fYXJyXy5cbiAgICBpbmRleCxcbiAgICAvLyBUaGUgZmVlZGJhY2sgZm9yIHRoaXMgYmxhbmssIGNvbnRhaW5pbmcgYSB0ZW1wbGF0ZSB0byBiZSByZW5kZXJlZC5cbiAgICBkaXNwbGF5RmVlZF9pLFxuICAgIC8vIFNlZSBkeW5fdmFyc19ldmFsXy5cbiAgICBkeW5fdmFyc19ldmFsXG4pIHtcbiAgICAvLyBVc2UgdGhlIGFuc3dlciwgYW4gYXJyYXkgb2YgYWxsIGFuc3dlcnMsIHRoZSB2YWx1ZSBvZiBhbGwgbmFtZWQgYmxhbmtzLCBhbmQgYWxsIHNvbHV0aW9uIHZhcmlhYmxlcyBmb3IgdGhlIHRlbXBsYXRlLlxuICAgIGNvbnN0IG5hbWVkQmxhbmtWYWx1ZXMgPSBnZXROYW1lZEJsYW5rVmFsdWVzKFxuICAgICAgICBnaXZlbl9hcnIsXG4gICAgICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgICAgICBkeW5fdmFyc19ldmFsXG4gICAgKTtcbiAgICBjb25zdCBzb2xfdmFyc19wbHVzID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAge1xuICAgICAgICAgICAgYW5zOiBnaXZlbl9hcnJbaW5kZXhdLFxuICAgICAgICAgICAgYW5zX2FycmF5OiBnaXZlbl9hcnIsXG4gICAgICAgIH0sXG4gICAgICAgIGR5bl92YXJzX2V2YWwsXG4gICAgICAgIG5hbWVkQmxhbmtWYWx1ZXNcbiAgICApO1xuICAgIHRyeSB7XG4gICAgICAgIGRpc3BsYXlGZWVkX2kgPSByZW5kZXJfaHRtbChkaXNwbGF5RmVlZF9pLCBzb2xfdmFyc19wbHVzKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIGBFcnJvciBldmFsdWF0aW5nIGZlZWRiYWNrIGluZGV4ICR7aW5kZXh9LmApO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpc3BsYXlGZWVkX2k7XG59XG5cbi8vIFV0aWxpdGllc1xuLy8gLS0tLS0tLS0tXG4vLyBGb3IgZWFjaCBuYW1lZCBibGFuaywgZ2V0IHRoZSB2YWx1ZSBmb3IgdGhlIGJsYW5rOiB0aGUgdmFsdWUgb2YgZWFjaCBgYGJsYW5rTmFtZWBgIGdpdmVzIHRoZSBpbmRleCBvZiB0aGUgYmxhbmsgZm9yIHRoYXQgbmFtZS5cbmZ1bmN0aW9uIGdldE5hbWVkQmxhbmtWYWx1ZXMoZ2l2ZW5fYXJyLCBibGFua05hbWVzRGljdCwgZHluX3ZhcnNfZXZhbCkge1xuICAgIGNvbnN0IG5hbWVkQmxhbmtWYWx1ZXMgPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtibGFua19uYW1lLCBibGFua19pbmRleF0gb2YgT2JqZWN0LmVudHJpZXMoYmxhbmtOYW1lc0RpY3QpKSB7XG4gICAgICAgIG5hbWVkQmxhbmtWYWx1ZXNbYmxhbmtfbmFtZV0gPSB0eXBlX2NvbnZlcnQoXG4gICAgICAgICAgICBibGFua19uYW1lLFxuICAgICAgICAgICAgZ2l2ZW5fYXJyW2JsYW5rX2luZGV4XSxcbiAgICAgICAgICAgIGJsYW5rX2luZGV4LFxuICAgICAgICAgICAgZHluX3ZhcnNfZXZhbFxuICAgICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZWRCbGFua1ZhbHVlcztcbn1cblxuLy8gQ29udmVydCBhIHZhbHVlIGdpdmVuIGl0cyB0eXBlLlxuZnVuY3Rpb24gdHlwZV9jb252ZXJ0KG5hbWUsIHZhbHVlLCBpbmRleCwgZHluX3ZhcnNfZXZhbCkge1xuICAgIC8vIFRoZSBjb252ZXJ0ZXIgY2FuIGJlIGRlZmluZWQgYnkgaW5kZXgsIG5hbWUsIG9yIGJ5IGEgc2luZ2xlIHZhbHVlICh3aGljaCBhcHBsaWVzIHRvIGFsbCBibGFua3MpLiBJZiBub3QgcHJvdmlkZWQsIGp1c3QgcGFzcyB0aGUgZGF0YSB0aHJvdWdoLlxuICAgIGNvbnN0IHR5cGVzID0gZHluX3ZhcnNfZXZhbC50eXBlcyB8fCBwYXNzX3Rocm91Z2g7XG4gICAgY29uc3QgY29udmVydGVyID0gdHlwZXNbbmFtZV0gfHwgdHlwZXNbaW5kZXhdIHx8IHR5cGVzO1xuICAgIC8vIEVTNSBoYWNrOiBpdCBkb2Vzbid0IHN1cHBvcnQgYmluYXJ5IHZhbHVlcywgYW5kIGpzMnB5IGRvZXNuJ3QgYWxsb3cgbWUgdG8gb3ZlcnJpZGUgdGhlIGBgTnVtYmVyYGAgY2xhc3MuIFNvLCBkZWZpbmUgdGhlIHdvcmthcm91bmQgY2xhc3MgYGBOdW1iZXJfYGAgYW5kIHVzZSBpdCBpZiBhdmFpbGFibGUuXG4gICAgaWYgKGNvbnZlcnRlciA9PT0gTnVtYmVyICYmIHR5cGVvZiBOdW1iZXJfICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGNvbnZlcnRlciA9IE51bWJlcl87XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHRoZSBjb252ZXJ0ZWQgdHlwZS4gSWYgdGhlIGNvbnZlcnRlciByYWlzZXMgYSBUeXBlRXJyb3IsIHJldHVybiB0aGF0OyBpdCB3aWxsIGJlIGRpc3BsYXllZCB0byB0aGUgdXNlciwgc2luY2Ugd2UgYXNzdW1lIHR5cGUgZXJyb3JzIGFyZSBhIHdheSBmb3IgdGhlIHBhcnNlciB0byBleHBsYWluIHRvIHRoZSB1c2VyIHdoeSB0aGUgcGFyc2UgZmFpbGVkLiBGb3IgYWxsIG90aGVyIGVycm9ycywgcmUtdGhyb3cgaXQgc2luY2Ugc29tZXRoaW5nIHdlbnQgd3JvbmcuXG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGNvbnZlcnRlcih2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIEEgcGFzcy10aHJvdWdoIFwiY29udmVydGVyXCIuXG5mdW5jdGlvbiBwYXNzX3Rocm91Z2godmFsKSB7XG4gICAgcmV0dXJuIHZhbDtcbn1cbiIsIi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyB8ZG9jbmFtZXwgLS0gZmlsbC1pbi10aGUtYmxhbmsgY2xpZW50LXNpZGUgY29kZVxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIFRoaXMgZmlsZSBjb250YWlucyB0aGUgSlMgZm9yIHRoZSBSdW5lc3RvbmUgZmlsbGludGhlYmxhbmsgY29tcG9uZW50LiBJdCB3YXMgY3JlYXRlZCBCeSBJc2FpYWggTWF5ZXJjaGFrIGFuZCBLaXJieSBPbHNvbiwgNi80LzE1IHRoZW4gcmV2aXNlZCBieSBCcmFkIE1pbGxlciwgMi83LzIwLlxuLy9cbi8vIERhdGEgc3RvcmFnZSBub3Rlc1xuLy8gPT09PT09PT09PT09PT09PT09XG4vL1xuLy8gSW5pdGlhbCBwcm9ibGVtIHJlc3RvcmVcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbiB0aGUgY29uc3RydWN0b3IsIHRoaXMgY29kZSAodGhlIGNsaWVudCkgcmVzdG9yZXMgdGhlIHByb2JsZW0gYnkgY2FsbGluZyBgYGNoZWNrU2VydmVyYGAuIFRvIGRvIHNvLCBlaXRoZXIgdGhlIHNlcnZlciBzZW5kcyBvciBsb2NhbCBzdG9yYWdlIGhhczpcbi8vXG4vLyAtICAgIHNlZWQgKHVzZWQgb25seSBmb3IgZHluYW1pYyBwcm9ibGVtcylcbi8vIC0gICAgYW5zd2VyXG4vLyAtICAgIGRpc3BsYXlGZWVkIChzZXJ2ZXItc2lkZSBncmFkaW5nIG9ubHk7IG90aGVyd2lzZSwgdGhpcyBpcyBnZW5lcmF0ZWQgbG9jYWxseSBieSBjbGllbnQgY29kZSlcbi8vIC0gICAgY29ycmVjdCAoU1NHKVxuLy8gLSAgICBpc0NvcnJlY3RBcnJheSAoU1NHKVxuLy8gLSAgICBwcm9ibGVtSHRtbCAoU1NHIHdpdGggZHluYW1pYyBwcm9ibGVtcyBvbmx5KVxuLy9cbi8vIElmIGFueSBvZiB0aGUgYW5zd2VycyBhcmUgY29ycmVjdCwgdGhlbiB0aGUgY2xpZW50IHNob3dzIGZlZWRiYWNrLiBUaGlzIGlzIGltcGxlbWVudGVkIGluIHJlc3RvcmVBbnN3ZXJzXy5cbi8vXG4vLyBHcmFkaW5nXG4vLyAtLS0tLS0tXG4vLyBXaGVuIHRoZSB1c2VyIHByZXNzZXMgdGhlIFwiQ2hlY2sgbWVcIiBidXR0b24sIHRoZSBsb2dDdXJyZW50QW5zd2VyXyBmdW5jdGlvbjpcbi8vXG4vLyAtICAgIFNhdmVzIHRoZSBmb2xsb3dpbmcgdG8gbG9jYWwgc3RvcmFnZTpcbi8vXG4vLyAgICAgIC0gICBzZWVkXG4vLyAgICAgIC0gICBhbnN3ZXJcbi8vICAgICAgLSAgIHRpbWVzdGFtcFxuLy8gICAgICAtICAgcHJvYmxlbUh0bWxcbi8vXG4vLyAgICAgIE5vdGUgdGhhdCB0aGVyZSdzIG5vIHBvaW50IGluIHNhdmluZyBkaXNwbGF5RmVlZCwgY29ycmVjdCwgb3IgaXNDb3JyZWN0QXJyYXksIHNpbmNlIHRoZXNlIHZhbHVlcyBhcHBsaWVkIHRvIHRoZSBwcmV2aW91cyBhbnN3ZXIsIG5vdCB0aGUgbmV3IGFuc3dlciBqdXN0IHN1Ym1pdHRlZC5cbi8vXG4vLyAtICAgIFNlbmRzIHRoZSBmb2xsb3dpbmcgdG8gdGhlIHNlcnZlcjsgc3RvcCBhZnRlciB0aGlzIGZvciBjbGllbnQtc2lkZSBncmFkaW5nOlxuLy9cbi8vICAgICAgLSAgIHNlZWQgKGlnbm9yZWQgZm9yIHNlcnZlci1zaWRlIGdyYWRpbmcpXG4vLyAgICAgIC0gICBhbnN3ZXJcbi8vICAgICAgLSAgIGNvcnJlY3QgKGlnbm9yZWQgZm9yIFNTRylcbi8vICAgICAgLSAgIHBlcmNlbnQgKGlnbm9yZWQgZm9yIFNTRylcbi8vXG4vLyAtICAgIFJlY2VpdmVzIHRoZSBmb2xsb3dpbmcgZnJvbSB0aGUgc2VydmVyOlxuLy9cbi8vICAgICAgLSAgIHRpbWVzdGFtcFxuLy8gICAgICAtICAgZGlzcGxheUZlZWRcbi8vICAgICAgLSAgIGNvcnJlY3Rcbi8vICAgICAgLSAgIGlzQ29ycmVjdEFycmF5XG4vL1xuLy8gLSAgICBTYXZlcyB0aGUgZm9sbG93aW5nIHRvIGxvY2FsIHN0b3JhZ2U6XG4vL1xuLy8gICAgICAtICAgc2VlZFxuLy8gICAgICAtICAgYW5zd2VyXG4vLyAgICAgIC0gICB0aW1lc3RhbXBcbi8vICAgICAgLSAgIGRpc3BsYXlGZWVkIChTU0cgb25seSlcbi8vICAgICAgLSAgIGNvcnJlY3QgKFNTRyBvbmx5KVxuLy8gICAgICAtICAgaXNDb3JyZWN0QXJyYXkgKFNTRyBvbmx5KVxuLy8gICAgICAtICAgcHJvYmxlbUh0bWxcbi8vXG4vLyBSYW5kb21pemVcbi8vIC0tLS0tLS0tLVxuLy8gV2hlbiB0aGUgdXNlciBwcmVzc2VzIHRoZSBcIlJhbmRvbWl6ZVwiIGJ1dHRvbiAod2hpY2ggaXMgb25seSBhdmFpbGFibGUgZm9yIGR5bmFtaWMgcHJvYmxlbXMpLCB0aGUgcmFuZG9taXplXyBmdW5jdGlvbjpcbi8vXG4vLyAtICAgIEZvciB0aGUgY2xpZW50LXNpZGUgY2FzZSwgc2V0cyB0aGUgc2VlZCB0byBhIG5ldywgcmFuZG9tIHZhbHVlLiBGb3IgdGhlIHNlcnZlci1zaWRlIGNhc2UsIHJlcXVlc3RzIGEgbmV3IHNlZWQgYW5kIHByb2JsZW1IdG1sIGZyb20gdGhlIHNlcnZlci5cbi8vIC0gICAgU2V0cyB0aGUgYW5zd2VyIHRvIGFuIGFycmF5IG9mIGVtcHR5IHN0cmluZ3MuXG4vLyAtICAgIFNhdmVzIHRoZSB1c3VhbCBsb2NhbCBkYXRhLlxuXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlLmpzXCI7XG5pbXBvcnQge1xuICAgIHJlbmRlckR5bmFtaWNDb250ZW50LFxuICAgIGNoZWNrQW5zd2Vyc0NvcmUsXG4gICAgcmVuZGVyRHluYW1pY0ZlZWRiYWNrLFxufSBmcm9tIFwiLi9maXRiLXV0aWxzLmpzXCI7XG5pbXBvcnQgXCIuL2ZpdGItaTE4bi5lbi5qc1wiO1xuaW1wb3J0IFwiLi9maXRiLWkxOG4ucHQtYnIuanNcIjtcbmltcG9ydCBcIi4uL2Nzcy9maXRiLmNzc1wiO1xuXG4vLyBPYmplY3QgY29udGFpbmluZyBhbGwgaW5zdGFuY2VzIG9mIEZJVEIgdGhhdCBhcmVuJ3QgYSBjaGlsZCBvZiBhIHRpbWVkIGFzc2Vzc21lbnQuXG5leHBvcnQgdmFyIEZJVEJMaXN0ID0ge307XG5cbi8vIEZJVEIgY29uc3RydWN0b3JcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZJVEIgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB2YXIgb3JpZyA9IG9wdHMub3JpZzsgLy8gZW50aXJlIDxwPiBlbGVtZW50XG4gICAgICAgIHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMgPSBvcHRzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzO1xuICAgICAgICB0aGlzLm9yaWdFbGVtID0gb3JpZztcbiAgICAgICAgdGhpcy5kaXZpZCA9IG9yaWcuaWQ7XG4gICAgICAgIHRoaXMuY29ycmVjdCA9IG51bGw7XG4gICAgICAgIC8vIFNlZSBjb21tZW50cyBpbiBmaXRiLnB5IGZvciB0aGUgZm9ybWF0IG9mIGBgZmVlZGJhY2tBcnJheWBgICh3aGljaCBpcyBpZGVudGljYWwgaW4gYm90aCBmaWxlcykuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIEZpbmQgdGhlIHNjcmlwdCB0YWcgY29udGFpbmluZyBKU09OIGFuZCBwYXJzZSBpdC4gU2VlIGBTTyA8aHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTMyMDQyNy9iZXN0LXByYWN0aWNlLWZvci1lbWJlZGRpbmctYXJiaXRyYXJ5LWpzb24taW4tdGhlLWRvbT5gX18uIElmIHRoaXMgdGFnIGRvZXNuJ3QgZXhpc3QsIHRoZW4gbm8gZmVlZGJhY2sgaXMgYXZhaWxhYmxlOyBzZXJ2ZXItc2lkZSBncmFkaW5nIHdpbGwgYmUgcGVyZm9ybWVkLlxuICAgICAgICAvL1xuICAgICAgICAvLyBBIGRlc3RydWN0dXJpbmcgYXNzaWdubWVudCB3b3VsZCBiZSBwZXJmZWN0LCBidXQgdGhleSBkb24ndCB3b3JrIHdpdGggYGB0aGlzLmJsYWhgYCBhbmQgYGB3aXRoYGAgc3RhdGVtZW50cyBhcmVuJ3Qgc3VwcG9ydGVkIGluIHN0cmljdCBtb2RlLlxuICAgICAgICBjb25zdCBqc29uX2VsZW1lbnQgPSB0aGlzLnNjcmlwdFNlbGVjdG9yKHRoaXMub3JpZ0VsZW0pO1xuICAgICAgICBjb25zdCBkaWN0XyA9IEpTT04ucGFyc2UoanNvbl9lbGVtZW50Lmh0bWwoKSk7XG4gICAgICAgIGpzb25fZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5wcm9ibGVtSHRtbCA9IGRpY3RfLnByb2JsZW1IdG1sO1xuICAgICAgICB0aGlzLmR5bl92YXJzID0gZGljdF8uZHluX3ZhcnM7XG4gICAgICAgIHRoaXMuYmxhbmtOYW1lcyA9IGRpY3RfLmJsYW5rTmFtZXM7XG4gICAgICAgIHRoaXMuZmVlZGJhY2tBcnJheSA9IGRpY3RfLmZlZWRiYWNrQXJyYXk7XG5cbiAgICAgICAgdGhpcy5jcmVhdGVGSVRCRWxlbWVudCgpO1xuICAgICAgICB0aGlzLnNldHVwQmxhbmtzKCk7XG4gICAgICAgIHRoaXMuY2FwdGlvbiA9IFwiRmlsbCBpbiB0aGUgQmxhbmtcIjtcbiAgICAgICAgdGhpcy5hZGRDYXB0aW9uKFwicnVuZXN0b25lXCIpO1xuXG4gICAgICAgIC8vIERlZmluZSBhIHByb21pc2Ugd2hpY2ggaW1wb3J0cyBhbnkgbGlicmFyaWVzIG5lZWRlZCBieSBkeW5hbWljIHByb2JsZW1zLlxuICAgICAgICB0aGlzLmR5bl9pbXBvcnRzID0ge307XG4gICAgICAgIGxldCBpbXBvcnRzX3Byb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgaWYgKGRpY3RfLmR5bl9pbXBvcnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIENvbGxlY3QgYWxsIGltcG9ydCBwcm9taXNlcy5cbiAgICAgICAgICAgIGxldCBpbXBvcnRfcHJvbWlzZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaW1wb3J0XyBvZiBkaWN0Xy5keW5faW1wb3J0cykge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoaW1wb3J0Xykge1xuICAgICAgICAgICAgICAgICAgICAvLyBGb3IgaW1wb3J0cyBrbm93biBhdCB3ZWJwYWNrIGJ1aWxkLCBicmluZyB0aGVzZSBpbi5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkJUTVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0X3Byb21pc2VzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0KFwiYnRtLWV4cHJlc3Npb25zL3NyYy9CVE1fcm9vdC5qc1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAvLyBBbGxvdyBmb3IgbG9jYWwgaW1wb3J0cywgdXN1YWxseSBmcm9tIHByb2JsZW1zIGRlZmluZWQgb3V0c2lkZSB0aGUgUnVuZXN0b25lIENvbXBvbmVudHMuXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRfcHJvbWlzZXMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLyBpbXBvcnRfKVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ29tYmluZSB0aGUgcmVzdWx0aW5nIG1vZHVsZSBuYW1lc3BhY2Ugb2JqZWN0cyB3aGVuIHRoZXNlIHByb21pc2VzIHJlc29sdmUuXG4gICAgICAgICAgICBpbXBvcnRzX3Byb21pc2UgPSBQcm9taXNlLmFsbChpbXBvcnRfcHJvbWlzZXMpXG4gICAgICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgIChtb2R1bGVfbmFtZXNwYWNlX2FycikgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLmR5bl9pbXBvcnRzID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5tb2R1bGVfbmFtZXNwYWNlX2FyclxuICAgICAgICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYEZhaWxlZCBkeW5hbWljIGltcG9ydDogJHtlcnJ9LmA7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXNvbHZlIHRoZXNlIHByb21pc2VzLlxuICAgICAgICBpbXBvcnRzX3Byb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrU2VydmVyKFwiZmlsbGJcIiwgZmFsc2UpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIE9uZSBvcHRpb24gZm9yIGEgZHluYW1pYyBwcm9ibGVtIGlzIHRvIHByb2R1Y2UgYSBzdGF0aWMgcHJvYmxlbSBieSBwcm92aWRpbmcgYSBmaXhlZCBzZWVkIHZhbHVlLiBUaGlzIGlzIHR5cGljYWxseSB1c2VkIHdoZW4gdGhlIGdvYWwgaXMgdG8gcmVuZGVyIHRoZSBwcm9ibGVtIGFzIGFuIGltYWdlIGZvciBpbmNsdXNpb24gaW4gc3RhdGljIGNvbnRlbnQgKGEgUERGLCBldGMuKS4gVG8gc3VwcG9ydCB0aGlzLCBjb25zaWRlciB0aGUgZm9sbG93aW5nIGNhc2VzOlxuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8vIENhc2UgIEhhcyBzdGF0aWMgc2VlZD8gIElzIGEgY2xpZW50LXNpZGUsIGR5bmFtaWMgcHJvYmxlbT8gIEhhcyBsb2NhbCBzZWVkPyAgUmVzdWx0XG4gICAgICAgICAgICAgICAgLy8vIDAgICAgIE5vICAgICAgICAgICAgICAgIE5vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFggICAgICAgICAgICAgICAgTm8gYWN0aW9uIG5lZWRlZC5cbiAgICAgICAgICAgICAgICAvLy8gMSAgICAgTm8gICAgICAgICAgICAgICAgWWVzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm8gICAgICAgICAgICAgICB0aGlzLnJhbmRvbWl6ZSgpLlxuICAgICAgICAgICAgICAgIC8vLyAyICAgICBObyAgICAgICAgICAgICAgICBZZXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBZZXMgICAgICAgICAgICAgIE5vIGFjdGlvbiBuZWVkZWQgLS0gcHJvYmxlbSBhbHJlYWR5IHJlc3RvcmVkIGZyb20gbG9jYWwgc3RvcmFnZS5cbiAgICAgICAgICAgICAgICAvLy8gMyAgICAgWWVzICAgICAgICAgICAgICAgTm8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWCAgICAgICAgICAgICAgICBXYXJuaW5nOiBzZWVkIGlnbm9yZWQuXG4gICAgICAgICAgICAgICAgLy8vIDQgICAgIFllcyAgICAgICAgICAgICAgIFllcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vICAgICAgICAgICAgICAgQXNzaWduIHNlZWQ7IHRoaXMucmVuZGVyRHluYW1pY0NvbnRlbnQoKS5cbiAgICAgICAgICAgICAgICAvLy8gNSAgICAgWWVzICAgICAgICAgICAgICAgWWVzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWWVzICAgICAgICAgICAgICBJZiBzZWVkcyBkaWZmZXIsIGlzc3VlIHdhcm5pbmcuIE5vIGFkZGl0aW9uYWwgYWN0aW9uIG5lZWRlZCAtLSBwcm9ibGVtIGFscmVhZHkgcmVzdG9yZWQgZnJvbSBsb2NhbCBzdG9yYWdlLlxuXG4gICAgICAgICAgICAgICAgY29uc3QgaGFzX3N0YXRpY19zZWVkID0gZGljdF8uc3RhdGljX3NlZWQgIT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBjb25zdCBpc19jbGllbnRfZHluYW1pYyA9IHR5cGVvZiB0aGlzLmR5bl92YXJzID09PSBcInN0cmluZ1wiO1xuICAgICAgICAgICAgICAgIGNvbnN0IGhhc19sb2NhbF9zZWVkID0gdGhpcy5zZWVkICE9PSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICAvLyBDYXNlIDFcbiAgICAgICAgICAgICAgICBpZiAoIWhhc19zdGF0aWNfc2VlZCAmJiBpc19jbGllbnRfZHluYW1pYyAmJiAhaGFzX2xvY2FsX3NlZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yYW5kb21pemUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gQ2FzZSAzXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaGFzX3N0YXRpY19zZWVkICYmICFpc19jbGllbnRfZHluYW1pYykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXYXJuaW5nOiB0aGUgcHJvdmlkZWQgc3RhdGljIHNlZWQgd2FzIGlnbm9yZWQsIGJlY2F1c2UgaXQgb25seSBhZmZlY3RzIGNsaWVudC1zaWRlLCBkeW5hbWljIHByb2JsZW1zLlwiXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIENhc2UgNFxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICBoYXNfc3RhdGljX3NlZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgaXNfY2xpZW50X2R5bmFtaWMgJiZcbiAgICAgICAgICAgICAgICAgICAgIWhhc19sb2NhbF9zZWVkXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VlZCA9IGRpY3RfLnN0YXRpY19zZWVkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckR5bmFtaWNDb250ZW50KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIENhc2UgNVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICBoYXNfc3RhdGljX3NlZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgaXNfY2xpZW50X2R5bmFtaWMgJiZcbiAgICAgICAgICAgICAgICAgICAgaGFzX2xvY2FsX3NlZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWVkICE9PSBkaWN0Xy5zdGF0aWNfc2VlZFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXYXJuaW5nOiB0aGUgcHJvdmlkZWQgc3RhdGljIHNlZWQgd2FzIG92ZXJyaWRkZW4gYnkgdGhlIHNlZWQgZm91bmQgaW4gbG9jYWwgc3RvcmFnZS5cIlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBDYXNlcyAwIGFuZCAyXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE5vIGFjdGlvbiBuZWVkZWQuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBQcmlzbSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICBQcmlzbS5oaWdobGlnaHRBbGxVbmRlcih0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBGaW5kIHRoZSBzY3JpcHQgdGFnIGNvbnRhaW5pbmcgSlNPTiBpbiBhIGdpdmVuIHJvb3QgRE9NIG5vZGUuXG4gICAgc2NyaXB0U2VsZWN0b3Iocm9vdF9ub2RlKSB7XG4gICAgICAgIHJldHVybiAkKHJvb3Rfbm9kZSkuZmluZChgc2NyaXB0W3R5cGU9XCJhcHBsaWNhdGlvbi9qc29uXCJdYCk7XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSAgIEZ1bmN0aW9ucyBnZW5lcmF0aW5nIGZpbmFsIEhUTUwgICA9PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgY3JlYXRlRklUQkVsZW1lbnQoKSB7XG4gICAgICAgIHRoaXMucmVuZGVyRklUQklucHV0KCk7XG4gICAgICAgIHRoaXMucmVuZGVyRklUQkJ1dHRvbnMoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJGSVRCRmVlZGJhY2tEaXYoKTtcbiAgICAgICAgLy8gcmVwbGFjZXMgdGhlIGludGVybWVkaWF0ZSBIVE1MIGZvciB0aGlzIGNvbXBvbmVudCB3aXRoIHRoZSByZW5kZXJlZCBIVE1MIG9mIHRoaXMgY29tcG9uZW50XG4gICAgICAgICQodGhpcy5vcmlnRWxlbSkucmVwbGFjZVdpdGgodGhpcy5jb250YWluZXJEaXYpO1xuICAgIH1cbiAgICByZW5kZXJGSVRCSW5wdXQoKSB7XG4gICAgICAgIC8vIFRoZSB0ZXh0IFtpbnB1dF0gZWxlbWVudHMgYXJlIGNyZWF0ZWQgYnkgdGhlIHRlbXBsYXRlLlxuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgLy8gQ3JlYXRlIGFub3RoZXIgY29udGFpbmVyIHdoaWNoIHN0b3JlcyB0aGUgcHJvYmxlbSBkZXNjcmlwdGlvbi5cbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuZGVzY3JpcHRpb25EaXYpO1xuICAgICAgICAvLyBDb3B5IHRoZSBvcmlnaW5hbCBlbGVtZW50cyB0byB0aGUgY29udGFpbmVyIGhvbGRpbmcgd2hhdCB0aGUgdXNlciB3aWxsIHNlZSAoY2xpZW50LXNpZGUgZ3JhZGluZyBvbmx5KS5cbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbUh0bWwpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MID0gdGhpcy5wcm9ibGVtSHRtbDtcbiAgICAgICAgICAgIC8vIFNhdmUgb3JpZ2luYWwgSFRNTCAod2l0aCB0ZW1wbGF0ZXMpIHVzZWQgaW4gZHluYW1pYyBwcm9ibGVtcy5cbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYub3JpZ0lubmVySFRNTCA9IHRoaXMucHJvYmxlbUh0bWw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXJGSVRCQnV0dG9ucygpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcblxuICAgICAgICAvLyBcInN1Ym1pdFwiIGJ1dHRvblxuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLnRleHRDb250ZW50ID0gJC5pMThuKFwibXNnX2ZpdGJfY2hlY2tfbWVcIik7XG4gICAgICAgICQodGhpcy5zdWJtaXRCdXR0b24pLmF0dHIoe1xuICAgICAgICAgICAgY2xhc3M6IFwiYnRuIGJ0bi1zdWNjZXNzXCIsXG4gICAgICAgICAgICBuYW1lOiBcImRvIGFuc3dlclwiLFxuICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIixcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmxvZ0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuc3VibWl0QnV0dG9uKTtcblxuICAgICAgICAvLyBcImNvbXBhcmUgbWVcIiBidXR0b25cbiAgICAgICAgaWYgKHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICAgICAkKHRoaXMuY29tcGFyZUJ1dHRvbikuYXR0cih7XG4gICAgICAgICAgICAgICAgY2xhc3M6IFwiYnRuIGJ0bi1kZWZhdWx0XCIsXG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMub3JpZ0VsZW0uaWQgKyBcIl9iY29tcFwiLFxuICAgICAgICAgICAgICAgIGRpc2FibGVkOiBcIlwiLFxuICAgICAgICAgICAgICAgIG5hbWU6IFwiY29tcGFyZVwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24udGV4dENvbnRlbnQgPSAkLmkxOG4oXCJtc2dfZml0Yl9jb21wYXJlX21lXCIpO1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wYXJlRklUQkFuc3dlcnMoKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmNvbXBhcmVCdXR0b24pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmFuZG9taXplIGJ1dHRvbiBmb3IgZHluYW1pYyBwcm9ibGVtcy5cbiAgICAgICAgaWYgKHRoaXMuZHluX3ZhcnMpIHtcbiAgICAgICAgICAgIHRoaXMucmFuZG9taXplQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgICAgICQodGhpcy5yYW5kb21pemVCdXR0b24pLmF0dHIoe1xuICAgICAgICAgICAgICAgIGNsYXNzOiBcImJ0biBidG4tZGVmYXVsdFwiLFxuICAgICAgICAgICAgICAgIGlkOiB0aGlzLm9yaWdFbGVtLmlkICsgXCJfYmNvbXBcIixcbiAgICAgICAgICAgICAgICBuYW1lOiBcInJhbmRvbWl6ZVwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnJhbmRvbWl6ZUJ1dHRvbi50ZXh0Q29udGVudCA9ICQuaTE4bihcIm1zZ19maXRiX3JhbmRvbWl6ZVwiKTtcbiAgICAgICAgICAgIHRoaXMucmFuZG9taXplQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yYW5kb21pemUoKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnJhbmRvbWl6ZUJ1dHRvbik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcbiAgICB9XG4gICAgcmVuZGVyRklUQkZlZWRiYWNrRGl2KCkge1xuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5pZCA9IHRoaXMuZGl2aWQgKyBcIl9mZWVkYmFja1wiO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmZlZWRCYWNrRGl2KTtcbiAgICB9XG5cbiAgICBjbGVhckZlZWRiYWNrRGl2KCkge1xuICAgICAgICAvLyBTZXR0aW5nIHRoZSBgYG91dGVySFRNTGBgIHJlbW92ZXMgdGhpcyBmcm9tIHRoZSBET00uIFVzZSBhbiBhbHRlcm5hdGl2ZSBwcm9jZXNzIC0tIHJlbW92ZSB0aGUgY2xhc3MgKHdoaWNoIG1ha2VzIGl0IHJlZC9ncmVlbiBiYXNlZCBvbiBncmFkaW5nKSBhbmQgY29udGVudC5cbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmNsYXNzTmFtZSA9IFwiXCI7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIHRoZSBwcm9ibGVtJ3MgZGVzY3JpcHRpb24gYmFzZWQgb24gZHluYW1pY2FsbHktZ2VuZXJhdGVkIGNvbnRlbnQuXG4gICAgcmVuZGVyRHluYW1pY0NvbnRlbnQoKSB7XG4gICAgICAgIC8vIGBgdGhpcy5keW5fdmFyc2BgIGNhbiBiZSB0cnVlOyBpZiBzbywgZG9uJ3QgcmVuZGVyIGl0LCBzaW5jZSB0aGUgc2VydmVyIGRvZXMgYWxsIHRoZSByZW5kZXJpbmcuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5keW5fdmFycyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgbGV0IGh0bWxfbm9kZXM7XG4gICAgICAgICAgICBbaHRtbF9ub2RlcywgdGhpcy5keW5fdmFyc19ldmFsXSA9IHJlbmRlckR5bmFtaWNDb250ZW50KFxuICAgICAgICAgICAgICAgIHRoaXMuc2VlZCxcbiAgICAgICAgICAgICAgICB0aGlzLmR5bl92YXJzLFxuICAgICAgICAgICAgICAgIHRoaXMuZHluX2ltcG9ydHMsXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbkRpdi5vcmlnSW5uZXJIVE1MLFxuICAgICAgICAgICAgICAgIHRoaXMuZGl2aWQsXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVwYXJlQ2hlY2tBbnN3ZXJzLmJpbmQodGhpcylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2LnJlcGxhY2VDaGlsZHJlbiguLi5odG1sX25vZGVzKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmR5bl92YXJzX2V2YWwuYWZ0ZXJDb250ZW50UmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmR5bl92YXJzX2V2YWwuYWZ0ZXJDb250ZW50UmVuZGVyKHRoaXMuZHluX3ZhcnNfZXZhbCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KFxuICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBgRXJyb3IgaW4gcHJvYmxlbSAke3RoaXMuZGl2aWR9IGludm9raW5nIGFmdGVyQ29udGVudFJlbmRlcmBcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5kZXNjcmlwdGlvbkRpdik7XG4gICAgICAgICAgICB0aGlzLnNldHVwQmxhbmtzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXR1cEJsYW5rcygpIHtcbiAgICAgICAgLy8gRmluZCBhbmQgZm9ybWF0IHRoZSBibGFua3MuIElmIGEgZHluYW1pYyBwcm9ibGVtIGp1c3QgY2hhbmdlZCB0aGUgSFRNTCwgdGhpcyB3aWxsIGZpbmQgdGhlIG5ld2x5LWNyZWF0ZWQgYmxhbmtzLlxuICAgICAgICBjb25zdCBiYSA9ICQodGhpcy5kZXNjcmlwdGlvbkRpdikuZmluZChcIjppbnB1dFwiKTtcbiAgICAgICAgYmEuYXR0cihcImNsYXNzXCIsIFwiZm9ybSBmb3JtLWNvbnRyb2wgc2VsZWN0d2lkdGhhdXRvXCIpO1xuICAgICAgICBiYS5hdHRyKFwiYXJpYS1sYWJlbFwiLCBcImlucHV0IGFyZWFcIik7XG4gICAgICAgIHRoaXMuYmxhbmtBcnJheSA9IGJhLnRvQXJyYXkoKTtcbiAgICAgICAgZm9yIChsZXQgYmxhbmsgb2YgdGhpcy5ibGFua0FycmF5KSB7XG4gICAgICAgICAgICAkKGJsYW5rKS5jaGFuZ2UodGhpcy5yZWNvcmRBbnN3ZXJlZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoaXMgdGVsbHMgdGltZWQgcXVlc3Rpb25zIHRoYXQgdGhlIGZpdGIgYmxhbmtzIHJlY2VpdmVkIHNvbWUgaW50ZXJhY3Rpb24uXG4gICAgcmVjb3JkQW5zd2VyZWQoKSB7XG4gICAgICAgIHRoaXMuaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBDaGVja2luZy9sb2FkaW5nIGZyb20gc3RvcmFnZSA9PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgLy8gX2ByZXN0b3JlQW5zd2Vyc2A6IHVwZGF0ZSB0aGUgcHJvYmxlbSB3aXRoIGRhdGEgZnJvbSB0aGUgc2VydmVyIG9yIGZyb20gbG9jYWwgc3RvcmFnZS5cbiAgICByZXN0b3JlQW5zd2VycyhkYXRhKSB7XG4gICAgICAgIC8vIFJlc3RvcmUgdGhlIHNlZWQgZmlyc3QsIHNpbmNlIHRoZSBkeW5hbWljIHJlbmRlciBjbGVhcnMgYWxsIHRoZSBibGFua3MuXG4gICAgICAgIHRoaXMuc2VlZCA9IGRhdGEuc2VlZDtcbiAgICAgICAgdGhpcy5yZW5kZXJEeW5hbWljQ29udGVudCgpO1xuXG4gICAgICAgIHZhciBhcnI7XG4gICAgICAgIC8vIFJlc3RvcmUgYW5zd2VycyBmcm9tIHN0b3JhZ2UgcmV0cmlldmFsIGRvbmUgaW4gUnVuZXN0b25lQmFzZS5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFRoZSBuZXdlciBmb3JtYXQgZW5jb2RlcyBkYXRhIGFzIGEgSlNPTiBvYmplY3QuXG4gICAgICAgICAgICBhcnIgPSBKU09OLnBhcnNlKGRhdGEuYW5zd2VyKTtcbiAgICAgICAgICAgIC8vIFRoZSByZXN1bHQgc2hvdWxkIGJlIGFuIGFycmF5LiBJZiBub3QsIHRyeSBjb21tYSBwYXJzaW5nIGluc3RlYWQuXG4gICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIC8vIFRoZSBvbGQgZm9ybWF0IGRpZG4ndC5cbiAgICAgICAgICAgIGFyciA9IChkYXRhLmFuc3dlciB8fCBcIlwiKS5zcGxpdChcIixcIik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGhhc0Fuc3dlciA9IGZhbHNlO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgJCh0aGlzLmJsYW5rQXJyYXlbaV0pLmF0dHIoXCJ2YWx1ZVwiLCBhcnJbaV0pO1xuICAgICAgICAgICAgaWYgKGFycltpXSkge1xuICAgICAgICAgICAgICAgIGhhc0Fuc3dlciA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSXMgdGhpcyBjbGllbnQtc2lkZSBncmFkaW5nLCBvciBzZXJ2ZXItc2lkZSBncmFkaW5nP1xuICAgICAgICBpZiAodGhpcy5mZWVkYmFja0FycmF5KSB7XG4gICAgICAgICAgICAvLyBGb3IgY2xpZW50LXNpZGUgZ3JhZGluZywgcmUtZ2VuZXJhdGUgZmVlZGJhY2sgaWYgdGhlcmUncyBhbiBhbnN3ZXIuXG4gICAgICAgICAgICBpZiAoaGFzQW5zd2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEZvciBzZXJ2ZXItc2lkZSBncmFkaW5nLCB1c2UgdGhlIHByb3ZpZGVkIGZlZWRiYWNrIGZyb20gdGhlIHNlcnZlciBvciBsb2NhbCBzdG9yYWdlLlxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5RmVlZCA9IGRhdGEuZGlzcGxheUZlZWQ7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBkYXRhLmNvcnJlY3Q7XG4gICAgICAgICAgICB0aGlzLmlzQ29ycmVjdEFycmF5ID0gZGF0YS5pc0NvcnJlY3RBcnJheTtcbiAgICAgICAgICAgIC8vIE9ubHkgcmVuZGVyIGlmIGFsbCB0aGUgZGF0YSBpcyBwcmVzZW50OyBsb2NhbCBzdG9yYWdlIG1pZ2h0IGhhdmUgb2xkIGRhdGEgbWlzc2luZyBzb21lIG9mIHRoZXNlIGl0ZW1zLlxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLmRpc3BsYXlGZWVkICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIHRoaXMuY29ycmVjdCAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLmlzQ29ycmVjdEFycmF5ICE9PSBcInVuZGVmaW5lZFwiXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckZlZWRiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBGb3Igc2VydmVyLXNpZGUgZHluYW1pYyBwcm9ibGVtcywgc2hvdyB0aGUgcmVuZGVyZWQgcHJvYmxlbSB0ZXh0LlxuICAgICAgICAgICAgdGhpcy5wcm9ibGVtSHRtbCA9IGRhdGEucHJvYmxlbUh0bWw7XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9ibGVtSHRtbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MID0gdGhpcy5wcm9ibGVtSHRtbDtcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXVlTWF0aEpheCh0aGlzLmRlc2NyaXB0aW9uRGl2KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHVwQmxhbmtzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja0xvY2FsU3RvcmFnZSgpIHtcbiAgICAgICAgLy8gTG9hZHMgcHJldmlvdXMgYW5zd2VycyBmcm9tIGxvY2FsIHN0b3JhZ2UgaWYgdGhleSBleGlzdFxuICAgICAgICB2YXIgc3RvcmVkRGF0YTtcbiAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxlbiA9IGxvY2FsU3RvcmFnZS5sZW5ndGg7XG4gICAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgICAgICB2YXIgZXggPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgIGlmIChleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHN0b3JlZERhdGEgPSBKU09OLnBhcnNlKGV4KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyciA9IHN0b3JlZERhdGEuYW5zd2VyO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAvLyBlcnJvciB3aGlsZSBwYXJzaW5nOyBsaWtlbHkgZHVlIHRvIGJhZCB2YWx1ZSBzdG9yZWQgaW4gc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChmYWxzZSwgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RvcmVBbnN3ZXJzKHN0b3JlZERhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0TG9jYWxTdG9yYWdlKGRhdGEpIHtcbiAgICAgICAgbGV0IGtleSA9IHRoaXMubG9jYWxTdG9yYWdlS2V5KCk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIH1cblxuICAgIGNoZWNrQ3VycmVudEFuc3dlcigpIHtcbiAgICAgICAgLy8gU3RhcnQgb2YgdGhlIGV2YWx1YXRpb24gY2hhaW5cbiAgICAgICAgdGhpcy5pc0NvcnJlY3RBcnJheSA9IFtdO1xuICAgICAgICB0aGlzLmRpc3BsYXlGZWVkID0gW107XG4gICAgICAgIGNvbnN0IHBjYSA9IHRoaXMucHJlcGFyZUNoZWNrQW5zd2VycygpO1xuXG4gICAgICAgIGlmICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgICAgICBpZiAoZUJvb2tDb25maWcuZW5hYmxlQ29tcGFyZU1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmFibGVDb21wYXJlQnV0dG9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBHcmFkZSBsb2NhbGx5IGlmIHdlIGNhbid0IGFzayB0aGUgc2VydmVyIHRvIGdyYWRlLlxuICAgICAgICBpZiAodGhpcy5mZWVkYmFja0FycmF5KSB7XG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgLy8gQW4gYXJyYXkgb2YgSFRNTCBmZWVkYmFjay5cbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlGZWVkLFxuICAgICAgICAgICAgICAgIC8vIHRydWUsIGZhbHNlLCBvciBudWxsICh0aGUgcXVlc3Rpb24gd2Fzbid0IGFuc3dlcmVkKS5cbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3QsXG4gICAgICAgICAgICAgICAgLy8gQW4gYXJyYXkgb2YgdHJ1ZSwgZmFsc2UsIG9yIG51bGwgKHRoZSBxdWVzdGlvbiB3YXNuJ3QgYW5zd2VyZWQpLlxuICAgICAgICAgICAgICAgIHRoaXMuaXNDb3JyZWN0QXJyYXksXG4gICAgICAgICAgICAgICAgdGhpcy5wZXJjZW50LFxuICAgICAgICAgICAgXSA9IGNoZWNrQW5zd2Vyc0NvcmUoLi4ucGNhKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1RpbWVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJGZWVkYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gSW5wdXRzOlxuICAgIC8vXG4gICAgLy8gLSBTdHJpbmdzIGVudGVyZWQgYnkgdGhlIHN0dWRlbnQgaW4gYGB0aGlzLmJsYW5rQXJyYXlbaV0udmFsdWVgYC5cbiAgICAvLyAtIEZlZWRiYWNrIGluIGBgdGhpcy5mZWVkYmFja0FycmF5YGAuXG4gICAgcHJlcGFyZUNoZWNrQW5zd2VycygpIHtcbiAgICAgICAgdGhpcy5naXZlbl9hcnIgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsYW5rQXJyYXkubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICB0aGlzLmdpdmVuX2Fyci5wdXNoKHRoaXMuYmxhbmtBcnJheVtpXS52YWx1ZSk7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB0aGlzLmJsYW5rTmFtZXMsXG4gICAgICAgICAgICB0aGlzLmdpdmVuX2FycixcbiAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tBcnJheSxcbiAgICAgICAgICAgIHRoaXMuZHluX3ZhcnNfZXZhbCxcbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICAvLyBfYHJhbmRvbWl6ZWA6IFRoaXMgaGFuZGxlcyBhIGNsaWNrIHRvIHRoZSBcIlJhbmRvbWl6ZVwiIGJ1dHRvbi5cbiAgICBhc3luYyByYW5kb21pemUoKSB7XG4gICAgICAgIC8vIFVzZSB0aGUgY2xpZW50LXNpZGUgY2FzZSBvciB0aGUgc2VydmVyLXNpZGUgY2FzZT9cbiAgICAgICAgaWYgKHRoaXMuZmVlZGJhY2tBcnJheSkge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyB0aGUgY2xpZW50LXNpZGUgY2FzZS5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICB0aGlzLnNlZWQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyICoqIDMyKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyRHluYW1pY0NvbnRlbnQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIHNlcnZlci1zaWRlIGNhc2UuIFNlbmQgYSByZXF1ZXN0IHRvIHRoZSBgcmVzdWx0cyA8Z2V0QXNzZXNzUmVzdWx0cz5gIGVuZHBvaW50IHdpdGggYGBuZXdfc2VlZGBgIHNldCB0byBUcnVlLlxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KFwiL2Fzc2Vzc21lbnQvcmVzdWx0c1wiLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgICAgICAgICAgY291cnNlOiBlQm9va0NvbmZpZy5jb3Vyc2UsXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50OiBcImZpbGxiXCIsXG4gICAgICAgICAgICAgICAgICAgIHNpZDogdGhpcy5zaWQsXG4gICAgICAgICAgICAgICAgICAgIG5ld19zZWVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuanNvbkhlYWRlcnMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG4gICAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoYEhUVFAgZXJyb3IgZ2V0dGluZyByZXN1bHRzOiAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGRhdGEuZGV0YWlsO1xuICAgICAgICAgICAgdGhpcy5zZWVkID0gcmVzLnNlZWQ7XG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2LmlubmVySFRNTCA9IHJlcy5wcm9ibGVtSHRtbDtcbiAgICAgICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuZGVzY3JpcHRpb25EaXYpO1xuICAgICAgICAgICAgdGhpcy5zZXR1cEJsYW5rcygpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFdoZW4gZ2V0dGluZyBhIG5ldyBzZWVkLCBjbGVhciBhbGwgdGhlIG9sZCBhbnN3ZXJzIGFuZCBmZWVkYmFjay5cbiAgICAgICAgdGhpcy5naXZlbl9hcnIgPSBBcnJheSh0aGlzLmJsYW5rQXJyYXkubGVuKS5maWxsKFwiXCIpO1xuICAgICAgICAkKHRoaXMuYmxhbmtBcnJheSkuYXR0cihcInZhbHVlXCIsIFwiXCIpO1xuICAgICAgICB0aGlzLmNsZWFyRmVlZGJhY2tEaXYoKTtcbiAgICAgICAgdGhpcy5zYXZlQW5zd2Vyc0xvY2FsbHlPbmx5KCk7XG4gICAgfVxuXG4gICAgLy8gU2F2ZSB0aGUgYW5zd2VycyBhbmQgYXNzb2NpYXRlZCBkYXRhIGxvY2FsbHk7IGRvbid0IHNhdmUgZmVlZGJhY2sgcHJvdmlkZWQgYnkgdGhlIHNlcnZlciBmb3IgdGhpcyBhbnN3ZXIuIEl0IGFzc3VtZXMgdGhhdCBgYHRoaXMuZ2l2ZW5fYXJyYGAgY29udGFpbnMgdGhlIGN1cnJlbnQgYW5zd2Vycy5cbiAgICBzYXZlQW5zd2Vyc0xvY2FsbHlPbmx5KCkge1xuICAgICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSh7XG4gICAgICAgICAgICAvLyBUaGUgc2VlZCBpcyB1c2VkIGZvciBjbGllbnQtc2lkZSBvcGVyYXRpb24sIGJ1dCBkb2Vzbid0IG1hdHRlciBmb3Igc2VydmVyLXNpZGUuXG4gICAgICAgICAgICBzZWVkOiB0aGlzLnNlZWQsXG4gICAgICAgICAgICBhbnN3ZXI6IEpTT04uc3RyaW5naWZ5KHRoaXMuZ2l2ZW5fYXJyKSxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgb25seSBuZWVkZWQgZm9yIHNlcnZlci1zaWRlIGdyYWRpbmcgd2l0aCBkeW5hbWljIHByb2JsZW1zLlxuICAgICAgICAgICAgcHJvYmxlbUh0bWw6IHRoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBfYGxvZ0N1cnJlbnRBbnN3ZXJgOiBTYXZlIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBwcm9ibGVtIHRvIGxvY2FsIHN0b3JhZ2UgYW5kIHRoZSBzZXJ2ZXI7IGRpc3BsYXkgc2VydmVyIGZlZWRiYWNrLlxuICAgIGFzeW5jIGxvZ0N1cnJlbnRBbnN3ZXIoc2lkKSB7XG4gICAgICAgIGxldCBhbnN3ZXIgPSBKU09OLnN0cmluZ2lmeSh0aGlzLmdpdmVuX2Fycik7XG4gICAgICAgIGxldCBmZWVkYmFjayA9IHRydWU7XG4gICAgICAgIC8vIFNhdmUgdGhlIGFuc3dlciBsb2NhbGx5LlxuICAgICAgICB0aGlzLnNhdmVBbnN3ZXJzTG9jYWxseU9ubHkoKTtcbiAgICAgICAgLy8gU2F2ZSB0aGUgYW5zd2VyIHRvIHRoZSBzZXJ2ZXIuXG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICBldmVudDogXCJmaWxsYlwiLFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgYWN0OiBhbnN3ZXIgfHwgXCJcIixcbiAgICAgICAgICAgIHNlZWQ6IHRoaXMuc2VlZCxcbiAgICAgICAgICAgIGFuc3dlcjogYW5zd2VyIHx8IFwiXCIsXG4gICAgICAgICAgICBjb3JyZWN0OiB0aGlzLmNvcnJlY3QgPyBcIlRcIiA6IFwiRlwiLFxuICAgICAgICAgICAgcGVyY2VudDogdGhpcy5wZXJjZW50LFxuICAgICAgICB9O1xuICAgICAgICBpZiAodHlwZW9mIHNpZCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZGF0YS5zaWQgPSBzaWQ7XG4gICAgICAgICAgICBmZWVkYmFjayA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlcnZlcl9kYXRhID0gYXdhaXQgdGhpcy5sb2dCb29rRXZlbnQoZGF0YSk7XG4gICAgICAgIGlmICghZmVlZGJhY2spIHJldHVybjtcbiAgICAgICAgLy8gTm9uLXNlcnZlciBzaWRlIGdyYWRlZCBwcm9ibGVtcyBhcmUgZG9uZSBhdCB0aGlzIHBvaW50OyBsaWtld2lzZSwgc3RvcCBoZXJlIGlmIHRoZSBzZXJ2ZXIgZGlkbid0IHJlc3BvbmQuXG4gICAgICAgIGlmICh0aGlzLmZlZWRiYWNrQXJyYXkgfHwgIXNlcnZlcl9kYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUaGlzIGlzIHRoZSBzZXJ2ZXItc2lkZSBjYXNlLiBPbiBzdWNjZXNzLCB1cGRhdGUgdGhlIGZlZWRiYWNrIGZyb20gdGhlIHNlcnZlcidzIGdyYWRlLlxuICAgICAgICBjb25zdCByZXMgPSBzZXJ2ZXJfZGF0YS5kZXRhaWw7XG4gICAgICAgIHRoaXMudGltZXN0YW1wID0gcmVzLnRpbWVzdGFtcDtcbiAgICAgICAgdGhpcy5kaXNwbGF5RmVlZCA9IHJlcy5kaXNwbGF5RmVlZDtcbiAgICAgICAgdGhpcy5jb3JyZWN0ID0gcmVzLmNvcnJlY3Q7XG4gICAgICAgIHRoaXMuaXNDb3JyZWN0QXJyYXkgPSByZXMuaXNDb3JyZWN0QXJyYXk7XG4gICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKHtcbiAgICAgICAgICAgIHNlZWQ6IHRoaXMuc2VlZCxcbiAgICAgICAgICAgIGFuc3dlcjogYW5zd2VyLFxuICAgICAgICAgICAgdGltZXN0YW1wOiB0aGlzLnRpbWVzdGFtcCxcbiAgICAgICAgICAgIHByb2JsZW1IdG1sOiB0aGlzLmRlc2NyaXB0aW9uRGl2LmlubmVySFRNTCxcbiAgICAgICAgICAgIGRpc3BsYXlGZWVkOiB0aGlzLmRpc3BsYXlGZWVkLFxuICAgICAgICAgICAgY29ycmVjdDogdGhpcy5jb3JyZWN0LFxuICAgICAgICAgICAgaXNDb3JyZWN0QXJyYXk6IHRoaXMuaXNDb3JyZWN0QXJyYXksXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJlbmRlckZlZWRiYWNrKCk7XG4gICAgICAgIHJldHVybiBzZXJ2ZXJfZGF0YTtcbiAgICB9XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBFdmFsdWF0aW9uIG9mIGFuc3dlciBhbmQgPT09XG4gICAgPT09ICAgICBkaXNwbGF5IGZlZWRiYWNrICAgICA9PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIHJlbmRlckZlZWRiYWNrKCkge1xuICAgICAgICBpZiAodGhpcy5jb3JyZWN0KSB7XG4gICAgICAgICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWluZm9cIik7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICQodGhpcy5ibGFua0FycmF5W2pdKS5yZW1vdmVDbGFzcyhcImlucHV0LXZhbGlkYXRpb24tZXJyb3JcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kaXNwbGF5RmVlZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheUZlZWQgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmJsYW5rQXJyYXkubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0NvcnJlY3RBcnJheVtqXSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMuYmxhbmtBcnJheVtqXSkuYWRkQ2xhc3MoXCJpbnB1dC12YWxpZGF0aW9uLWVycm9yXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5ibGFua0FycmF5W2pdKS5yZW1vdmVDbGFzcyhcImlucHV0LXZhbGlkYXRpb24tZXJyb3JcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5hdHRyKFwiY2xhc3NcIiwgXCJhbGVydCBhbGVydC1kYW5nZXJcIik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZlZWRiYWNrX2h0bWwgPSBcIjx1bD5cIjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRpc3BsYXlGZWVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZGYgPSB0aGlzLmRpc3BsYXlGZWVkW2ldO1xuICAgICAgICAgICAgLy8gUmVuZGVyIGFueSBkeW5hbWljIGZlZWRiYWNrIGluIHRoZSBwcm92aWRlZCBmZWVkYmFjaywgZm9yIGNsaWVudC1zaWRlIGdyYWRpbmcgb2YgZHluYW1pYyBwcm9ibGVtcy5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5keW5fdmFycyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIGRmID0gcmVuZGVyRHluYW1pY0ZlZWRiYWNrKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJsYW5rTmFtZXMsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2l2ZW5fYXJyLFxuICAgICAgICAgICAgICAgICAgICBpLFxuICAgICAgICAgICAgICAgICAgICBkZixcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5keW5fdmFyc19ldmFsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAvLyBDb252ZXJ0IHRoZSByZXR1cm5lZCBOb2RlTGlzdCBpbnRvIGEgc3RyaW5nIG9mIEhUTUwuXG4gICAgICAgICAgICAgICAgZGYgPSBkZlxuICAgICAgICAgICAgICAgICAgICA/IGRmWzBdLnBhcmVudEVsZW1lbnQuaW5uZXJIVE1MXG4gICAgICAgICAgICAgICAgICAgIDogXCJObyBmZWVkYmFjayBwcm92aWRlZFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmVlZGJhY2tfaHRtbCArPSBgPGxpPiR7ZGZ9PC9saT5gO1xuICAgICAgICB9XG4gICAgICAgIGZlZWRiYWNrX2h0bWwgKz0gXCI8L3VsPlwiO1xuICAgICAgICAvLyBSZW1vdmUgdGhlIGxpc3QgaWYgaXQncyBqdXN0IG9uZSBlbGVtZW50LlxuICAgICAgICBpZiAodGhpcy5kaXNwbGF5RmVlZC5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgZmVlZGJhY2tfaHRtbCA9IGZlZWRiYWNrX2h0bWwuc2xpY2UoXG4gICAgICAgICAgICAgICAgXCI8dWw+PGxpPlwiLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAtXCI8L2xpPjwvdWw+XCIubGVuZ3RoXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuaW5uZXJIVE1MID0gZmVlZGJhY2tfaHRtbDtcbiAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5mZWVkQmFja0Rpdik7XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09IEZ1bmN0aW9ucyBmb3IgY29tcGFyZSBidXR0b24gPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgZW5hYmxlQ29tcGFyZUJ1dHRvbigpIHtcbiAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIF9gY29tcGFyZUZJVEJBbnN3ZXJzYFxuICAgIGNvbXBhcmVGSVRCQW5zd2VycygpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgICAgZGF0YS5kaXZfaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICBkYXRhLmNvdXJzZSA9IGVCb29rQ29uZmlnLmNvdXJzZTtcbiAgICAgICAgalF1ZXJ5LmdldChcbiAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9hc3Nlc3NtZW50L2dldHRvcDEwQW5zd2Vyc2AsXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgdGhpcy5jb21wYXJlRklUQlxuICAgICAgICApO1xuICAgIH1cbiAgICBjb21wYXJlRklUQihkYXRhLCBzdGF0dXMsIHdoYXRldmVyKSB7XG4gICAgICAgIHZhciBhbnN3ZXJzID0gZGF0YS5kZXRhaWwucmVzO1xuICAgICAgICB2YXIgbWlzYyA9IGRhdGEuZGV0YWlsLm1pc2NkYXRhO1xuICAgICAgICB2YXIgYm9keSA9IFwiPHRhYmxlPlwiO1xuICAgICAgICBib2R5ICs9IFwiPHRyPjx0aD5BbnN3ZXI8L3RoPjx0aD5Db3VudDwvdGg+PC90cj5cIjtcbiAgICAgICAgZm9yICh2YXIgcm93IGluIGFuc3dlcnMpIHtcbiAgICAgICAgICAgIGJvZHkgKz1cbiAgICAgICAgICAgICAgICBcIjx0cj48dGQ+XCIgK1xuICAgICAgICAgICAgICAgIGFuc3dlcnNbcm93XS5hbnN3ZXIgK1xuICAgICAgICAgICAgICAgIFwiPC90ZD48dGQ+XCIgK1xuICAgICAgICAgICAgICAgIGFuc3dlcnNbcm93XS5jb3VudCArXG4gICAgICAgICAgICAgICAgXCIgdGltZXM8L3RkPjwvdHI+XCI7XG4gICAgICAgIH1cbiAgICAgICAgYm9keSArPSBcIjwvdGFibGU+XCI7XG4gICAgICAgIHZhciBodG1sID1cbiAgICAgICAgICAgIFwiPGRpdiBjbGFzcz0nbW9kYWwgZmFkZSc+XCIgK1xuICAgICAgICAgICAgXCIgICAgPGRpdiBjbGFzcz0nbW9kYWwtZGlhbG9nIGNvbXBhcmUtbW9kYWwnPlwiICtcbiAgICAgICAgICAgIFwiICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1jb250ZW50Jz5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9J21vZGFsLWhlYWRlcic+XCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzPSdjbG9zZScgZGF0YS1kaXNtaXNzPSdtb2RhbCcgYXJpYS1oaWRkZW49J3RydWUnPiZ0aW1lczs8L2J1dHRvbj5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICA8aDQgY2xhc3M9J21vZGFsLXRpdGxlJz5Ub3AgQW5zd2VyczwvaDQ+XCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICA8L2Rpdj5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9J21vZGFsLWJvZHknPlwiICtcbiAgICAgICAgICAgIGJvZHkgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICA8L2Rpdj5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgPC9kaXY+XCIgK1xuICAgICAgICAgICAgXCIgICAgPC9kaXY+XCIgK1xuICAgICAgICAgICAgXCI8L2Rpdj5cIjtcbiAgICAgICAgdmFyIGVsID0gJChodG1sKTtcbiAgICAgICAgZWwubW9kYWwoKTtcbiAgICB9XG5cbiAgICBkaXNhYmxlSW50ZXJhY3Rpb24oKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmJsYW5rQXJyYXlbaV0uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT0gRmluZCB0aGUgY3VzdG9tIEhUTUwgdGFncyBhbmQgPT1cbj09ICAgZXhlY3V0ZSBvdXIgY29kZSBvbiB0aGVtICAgID09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuJChkb2N1bWVudCkub24oXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuICAgICQoXCJbZGF0YS1jb21wb25lbnQ9ZmlsbGludGhlYmxhbmtdXCIpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHZhciBvcHRzID0ge1xuICAgICAgICAgICAgb3JpZzogdGhpcyxcbiAgICAgICAgICAgIHVzZVJ1bmVzdG9uZVNlcnZpY2VzOiBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCQodGhpcykuY2xvc2VzdChcIltkYXRhLWNvbXBvbmVudD10aW1lZEFzc2Vzc21lbnRdXCIpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGlzIGVsZW1lbnQgZXhpc3RzIHdpdGhpbiBhIHRpbWVkIGNvbXBvbmVudCwgZG9uJ3QgcmVuZGVyIGl0IGhlcmVcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgRklUQkxpc3RbdGhpcy5pZF0gPSBuZXcgRklUQihvcHRzKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KFxuICAgICAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgYEVycm9yIHJlbmRlcmluZyBGaWxsIGluIHRoZSBCbGFuayBQcm9ibGVtICR7dGhpcy5pZH1cbiAgICAgICAgICAgICAgICAgICAgIERldGFpbHM6ICR7ZXJyfWBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59KTtcbiIsIi8qLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuYWxlYVBSTkcgMS4xXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmh0dHBzOi8vZ2l0aHViLmNvbS9tYWNtY21lYW5zL2FsZWFQUk5HL2Jsb2IvbWFzdGVyL2FsZWFQUk5HLTEuMS5qc1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5PcmlnaW5hbCB3b3JrIGNvcHlyaWdodCDCqSAyMDEwIEpvaGFubmVzIEJhYWfDuGUsIHVuZGVyIE1JVCBsaWNlbnNlXG5UaGlzIGlzIGEgZGVyaXZhdGl2ZSB3b3JrIGNvcHlyaWdodCAoYykgMjAxNy0yMDIwLCBXLiBNYWNcIiBNY01lYW5zLCB1bmRlciBCU0QgbGljZW5zZS5cblJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dCBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcbjEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbjIuIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cbjMuIE5laXRoZXIgdGhlIG5hbWUgb2YgdGhlIGNvcHlyaWdodCBob2xkZXIgbm9yIHRoZSBuYW1lcyBvZiBpdHMgY29udHJpYnV0b3JzIG1heSBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0cyBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cblRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgSE9MREVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8qL1xuZXhwb3J0IGZ1bmN0aW9uIGFsZWFQUk5HKCkge1xuICAgIHJldHVybiggZnVuY3Rpb24oIGFyZ3MgKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIGNvbnN0IHZlcnNpb24gPSAnYWxlYVBSTkcgMS4xLjAnO1xuXG4gICAgICAgIHZhciBzMFxuICAgICAgICAgICAgLCBzMVxuICAgICAgICAgICAgLCBzMlxuICAgICAgICAgICAgLCBjXG4gICAgICAgICAgICAsIHVpbnRhID0gbmV3IFVpbnQzMkFycmF5KCAzIClcbiAgICAgICAgICAgICwgaW5pdGlhbEFyZ3NcbiAgICAgICAgICAgICwgbWFzaHZlciA9ICcnXG4gICAgICAgIDtcblxuICAgICAgICAvKiBwcml2YXRlOiBpbml0aWFsaXplcyBnZW5lcmF0b3Igd2l0aCBzcGVjaWZpZWQgc2VlZCAqL1xuICAgICAgICBmdW5jdGlvbiBfaW5pdFN0YXRlKCBfaW50ZXJuYWxTZWVkICkge1xuICAgICAgICAgICAgdmFyIG1hc2ggPSBNYXNoKCk7XG5cbiAgICAgICAgICAgIC8vIGludGVybmFsIHN0YXRlIG9mIGdlbmVyYXRvclxuICAgICAgICAgICAgczAgPSBtYXNoKCAnICcgKTtcbiAgICAgICAgICAgIHMxID0gbWFzaCggJyAnICk7XG4gICAgICAgICAgICBzMiA9IG1hc2goICcgJyApO1xuXG4gICAgICAgICAgICBjID0gMTtcblxuICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBfaW50ZXJuYWxTZWVkLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgICAgIHMwIC09IG1hc2goIF9pbnRlcm5hbFNlZWRbIGkgXSApO1xuICAgICAgICAgICAgICAgIGlmKCBzMCA8IDAgKSB7IHMwICs9IDE7IH1cblxuICAgICAgICAgICAgICAgIHMxIC09IG1hc2goIF9pbnRlcm5hbFNlZWRbIGkgXSApO1xuICAgICAgICAgICAgICAgIGlmKCBzMSA8IDAgKSB7IHMxICs9IDE7IH1cblxuICAgICAgICAgICAgICAgIHMyIC09IG1hc2goIF9pbnRlcm5hbFNlZWRbIGkgXSApO1xuICAgICAgICAgICAgICAgIGlmKCBzMiA8IDAgKSB7IHMyICs9IDE7IH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWFzaHZlciA9IG1hc2gudmVyc2lvbjtcblxuICAgICAgICAgICAgbWFzaCA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHJpdmF0ZTogZGVwZW5kZW50IHN0cmluZyBoYXNoIGZ1bmN0aW9uICovXG4gICAgICAgIGZ1bmN0aW9uIE1hc2goKSB7XG4gICAgICAgICAgICB2YXIgbiA9IDQwMjI4NzExOTc7IC8vIDB4ZWZjODI0OWRcblxuICAgICAgICAgICAgdmFyIG1hc2ggPSBmdW5jdGlvbiggZGF0YSApIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS50b1N0cmluZygpO1xuXG4gICAgICAgICAgICAgICAgLy8gY2FjaGUgdGhlIGxlbmd0aFxuICAgICAgICAgICAgICAgIGZvciggdmFyIGkgPSAwLCBsID0gZGF0YS5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgICAgIG4gKz0gZGF0YS5jaGFyQ29kZUF0KCBpICk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGggPSAwLjAyNTE5NjAzMjgyNDE2OTM4ICogbjtcblxuICAgICAgICAgICAgICAgICAgICBuICA9IGggPj4+IDA7XG4gICAgICAgICAgICAgICAgICAgIGggLT0gbjtcbiAgICAgICAgICAgICAgICAgICAgaCAqPSBuO1xuICAgICAgICAgICAgICAgICAgICBuICA9IGggPj4+IDA7XG4gICAgICAgICAgICAgICAgICAgIGggLT0gbjtcbiAgICAgICAgICAgICAgICAgICAgbiArPSBoICogNDI5NDk2NzI5NjsgLy8gMHgxMDAwMDAwMDAgICAgICAyXjMyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAoIG4gPj4+IDAgKSAqIDIuMzI4MzA2NDM2NTM4Njk2M2UtMTA7IC8vIDJeLTMyXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBtYXNoLnZlcnNpb24gPSAnTWFzaCAwLjknO1xuICAgICAgICAgICAgcmV0dXJuIG1hc2g7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvKiBwcml2YXRlOiBjaGVjayBpZiBudW1iZXIgaXMgaW50ZWdlciAqL1xuICAgICAgICBmdW5jdGlvbiBfaXNJbnRlZ2VyKCBfaW50ICkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KCBfaW50LCAxMCApID09PSBfaW50O1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogcmV0dXJuIGEgMzItYml0IGZyYWN0aW9uIGluIHRoZSByYW5nZSBbMCwgMV1cbiAgICAgICAgVGhpcyBpcyB0aGUgbWFpbiBmdW5jdGlvbiByZXR1cm5lZCB3aGVuIGFsZWFQUk5HIGlzIGluc3RhbnRpYXRlZFxuICAgICAgICAqL1xuICAgICAgICB2YXIgcmFuZG9tID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdCA9IDIwOTE2MzkgKiBzMCArIGMgKiAyLjMyODMwNjQzNjUzODY5NjNlLTEwOyAvLyAyXi0zMlxuXG4gICAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICAgICAgczEgPSBzMjtcblxuICAgICAgICAgICAgcmV0dXJuIHMyID0gdCAtICggYyA9IHQgfCAwICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiByZXR1cm4gYSA1My1iaXQgZnJhY3Rpb24gaW4gdGhlIHJhbmdlIFswLCAxXSAqL1xuICAgICAgICByYW5kb20uZnJhY3Q1MyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJhbmRvbSgpICsgKCByYW5kb20oKSAqIDB4MjAwMDAwICB8IDAgKSAqIDEuMTEwMjIzMDI0NjI1MTU2NWUtMTY7IC8vIDJeLTUzXG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiByZXR1cm4gYW4gdW5zaWduZWQgaW50ZWdlciBpbiB0aGUgcmFuZ2UgWzAsIDJeMzJdICovXG4gICAgICAgIHJhbmRvbS5pbnQzMiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJhbmRvbSgpICogMHgxMDAwMDAwMDA7IC8vIDJeMzJcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IGFkdmFuY2UgdGhlIGdlbmVyYXRvciB0aGUgc3BlY2lmaWVkIGFtb3VudCBvZiBjeWNsZXMgKi9cbiAgICAgICAgcmFuZG9tLmN5Y2xlID0gZnVuY3Rpb24oIF9ydW4gKSB7XG4gICAgICAgICAgICBfcnVuID0gdHlwZW9mIF9ydW4gPT09ICd1bmRlZmluZWQnID8gMSA6ICtfcnVuO1xuICAgICAgICAgICAgaWYoIF9ydW4gPCAxICkgeyBfcnVuID0gMTsgfVxuICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBfcnVuOyBpKysgKSB7IHJhbmRvbSgpOyB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiByZXR1cm4gaW5jbHVzaXZlIHJhbmdlICovXG4gICAgICAgIHJhbmRvbS5yYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGxvQm91bmRcbiAgICAgICAgICAgICAgICAsIGhpQm91bmRcbiAgICAgICAgICAgIDtcblxuICAgICAgICAgICAgaWYoIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgKSB7XG4gICAgICAgICAgICAgICAgbG9Cb3VuZCA9IDA7XG4gICAgICAgICAgICAgICAgaGlCb3VuZCA9IGFyZ3VtZW50c1sgMCBdO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvQm91bmQgPSBhcmd1bWVudHNbIDAgXTtcbiAgICAgICAgICAgICAgICBoaUJvdW5kID0gYXJndW1lbnRzWyAxIF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCBhcmd1bWVudHNbIDAgXSA+IGFyZ3VtZW50c1sgMSBdICkge1xuICAgICAgICAgICAgICAgIGxvQm91bmQgPSBhcmd1bWVudHNbIDEgXTtcbiAgICAgICAgICAgICAgICBoaUJvdW5kID0gYXJndW1lbnRzWyAwIF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHJldHVybiBpbnRlZ2VyXG4gICAgICAgICAgICBpZiggX2lzSW50ZWdlciggbG9Cb3VuZCApICYmIF9pc0ludGVnZXIoIGhpQm91bmQgKSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vciggcmFuZG9tKCkgKiAoIGhpQm91bmQgLSBsb0JvdW5kICsgMSApICkgKyBsb0JvdW5kO1xuXG4gICAgICAgICAgICAvLyByZXR1cm4gZmxvYXRcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJhbmRvbSgpICogKCBoaUJvdW5kIC0gbG9Cb3VuZCApICsgbG9Cb3VuZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IGluaXRpYWxpemUgZ2VuZXJhdG9yIHdpdGggdGhlIHNlZWQgdmFsdWVzIHVzZWQgdXBvbiBpbnN0YW50aWF0aW9uICovXG4gICAgICAgIHJhbmRvbS5yZXN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBfaW5pdFN0YXRlKCBpbml0aWFsQXJncyApO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogc2VlZGluZyBmdW5jdGlvbiAqL1xuICAgICAgICByYW5kb20uc2VlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgX2luaXRTdGF0ZSggQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiBzaG93IHRoZSB2ZXJzaW9uIG9mIHRoZSBSTkcgKi9cbiAgICAgICAgcmFuZG9tLnZlcnNpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB2ZXJzaW9uO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogc2hvdyB0aGUgdmVyc2lvbiBvZiB0aGUgUk5HIGFuZCB0aGUgTWFzaCBzdHJpbmcgaGFzaGVyICovXG4gICAgICAgIHJhbmRvbS52ZXJzaW9ucyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZlcnNpb24gKyAnLCAnICsgbWFzaHZlcjtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyB3aGVuIG5vIHNlZWQgaXMgc3BlY2lmaWVkLCBjcmVhdGUgYSByYW5kb20gb25lIGZyb20gV2luZG93cyBDcnlwdG8gKE1vbnRlIENhcmxvIGFwcGxpY2F0aW9uKVxuICAgICAgICBpZiggYXJncy5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICAgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoIHVpbnRhICk7XG4gICAgICAgICAgICAgYXJncyA9IFsgdWludGFbIDAgXSwgdWludGFbIDEgXSwgdWludGFbIDIgXSBdO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIHN0b3JlIHRoZSBzZWVkIHVzZWQgd2hlbiB0aGUgUk5HIHdhcyBpbnN0YW50aWF0ZWQsIGlmIGFueVxuICAgICAgICBpbml0aWFsQXJncyA9IGFyZ3M7XG5cbiAgICAgICAgLy8gaW5pdGlhbGl6ZSB0aGUgUk5HXG4gICAgICAgIF9pbml0U3RhdGUoIGFyZ3MgKTtcblxuICAgICAgICByZXR1cm4gcmFuZG9tO1xuXG4gICAgfSkoIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSApO1xufTsiLCJpbXBvcnQgRklUQiBmcm9tIFwiLi9maXRiLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lZEZJVEIgZXh0ZW5kcyBGSVRCIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB0aGlzLnJlbmRlclRpbWVkSWNvbih0aGlzLmlucHV0RGl2KTtcbiAgICAgICAgdGhpcy5oaWRlQnV0dG9ucygpO1xuICAgICAgICB0aGlzLm5lZWRzUmVpbml0aWFsaXphdGlvbiA9IHRydWU7XG4gICAgfVxuICAgIGhpZGVCdXR0b25zKCkge1xuICAgICAgICAkKHRoaXMuc3VibWl0QnV0dG9uKS5oaWRlKCk7XG4gICAgICAgICQodGhpcy5jb21wYXJlQnV0dG9uKS5oaWRlKCk7XG4gICAgfVxuICAgIHJlbmRlclRpbWVkSWNvbihjb21wb25lbnQpIHtcbiAgICAgICAgLy8gcmVuZGVycyB0aGUgY2xvY2sgaWNvbiBvbiB0aW1lZCBjb21wb25lbnRzLiAgICBUaGUgY29tcG9uZW50IHBhcmFtZXRlclxuICAgICAgICAvLyBpcyB0aGUgZWxlbWVudCB0aGF0IHRoZSBpY29uIHNob3VsZCBiZSBhcHBlbmRlZCB0by5cbiAgICAgICAgdmFyIHRpbWVJY29uRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdmFyIHRpbWVJY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgJCh0aW1lSWNvbikuYXR0cih7XG4gICAgICAgICAgICBzcmM6IFwiLi4vX3N0YXRpYy9jbG9jay5wbmdcIixcbiAgICAgICAgICAgIHN0eWxlOiBcIndpZHRoOjE1cHg7aGVpZ2h0OjE1cHhcIixcbiAgICAgICAgfSk7XG4gICAgICAgIHRpbWVJY29uRGl2LmNsYXNzTmFtZSA9IFwidGltZVRpcFwiO1xuICAgICAgICB0aW1lSWNvbkRpdi50aXRsZSA9IFwiXCI7XG4gICAgICAgIHRpbWVJY29uRGl2LmFwcGVuZENoaWxkKHRpbWVJY29uKTtcbiAgICAgICAgJChjb21wb25lbnQpLnByZXBlbmQodGltZUljb25EaXYpO1xuICAgIH1cbiAgICBjaGVja0NvcnJlY3RUaW1lZCgpIHtcbiAgICAgICAgLy8gUmV0dXJucyBpZiB0aGUgcXVlc3Rpb24gd2FzIGNvcnJlY3QsIGluY29ycmVjdCwgb3Igc2tpcHBlZCAocmV0dXJuIG51bGwgaW4gdGhlIGxhc3QgY2FzZSlcbiAgICAgICAgc3dpdGNoICh0aGlzLmNvcnJlY3QpIHtcbiAgICAgICAgICAgIGNhc2UgdHJ1ZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJUXCI7XG4gICAgICAgICAgICBjYXNlIGZhbHNlOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIkZcIjtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaGlkZUZlZWRiYWNrKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgJCh0aGlzLmJsYW5rQXJyYXlbaV0pLnJlbW92ZUNsYXNzKFwiaW5wdXQtdmFsaWRhdGlvbi1lcnJvclwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG5cbiAgICByZWluaXRpYWxpemVMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuc2V0dXBCbGFua3MoKTtcbiAgICB9XG59XG5cbmlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID0ge307XG59XG53aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkuZmlsbGludGhlYmxhbmsgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIGlmIChvcHRzLnRpbWVkKSB7XG4gICAgICAgIHJldHVybiBuZXcgVGltZWRGSVRCKG9wdHMpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEZJVEIob3B0cyk7XG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9