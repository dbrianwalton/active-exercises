"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["BTM_src_BTM_root_js"],{

/***/ 84490:
/*!******************************************!*\
  !*** ../../../../../BTM/src/BTM_root.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BTM: () => (/* binding */ BTM),
/* harmony export */   MENV: () => (/* binding */ MENV),
/* harmony export */   exprType: () => (/* binding */ exprType),
/* harmony export */   exprValue: () => (/* binding */ exprValue),
/* harmony export */   opPrec: () => (/* binding */ opPrec),
/* harmony export */   toTeX: () => (/* binding */ toTeX)
/* harmony export */ });
/* harmony import */ var _reductions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reductions.js */ 64621);
/* harmony import */ var _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scalar_expr.js */ 45306);
/* harmony import */ var _variable_expr_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./variable_expr.js */ 69082);
/* harmony import */ var _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./unop_expr.js */ 72224);
/* harmony import */ var _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./binop_expr.js */ 66718);
/* harmony import */ var _multiop_expr_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./multiop_expr.js */ 46987);
/* harmony import */ var _function_expr_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./function_expr.js */ 77967);
/* harmony import */ var _deriv_expr_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./deriv_expr.js */ 2813);
/* harmony import */ var _random_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./random.js */ 95821);
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./expression.js */ 53921);
/*!
 * BTM JavaScript Library v@VERSION
 * https://github.com/dbrianwalton/BTM
 *
 * Copyright D. Brian Walton
 * Released under the MIT license (https://opensource.org/licenses/MIT)
 *
 * Date: @DATE
 */

/* ***********************
** Evaluating expressions occurs in the context of a BTM environment.
************************* */












const opPrec = {
    disj: 0,
    conj: 1,
    equal: 2,
    addsub: 3,
    multdiv: 4,
    power: 5,
    fcn: 6,
    fop: 7
};

const exprType = {
    number: 0,
    variable: 1,
    fcn: 2,
    unop: 3,
    binop: 4,
    multiop: 5,
    operator: 6,
    array: 7,
    matrix: 8
};

const exprValue = { undef: -1, bool : 0, numeric : 1 };

function toTeX(expr) {
    return typeof expr.toTeX === "function" ? expr.toTeX() : expr;
}

// Class to define parsing and reduction rules.
class MENV {
    constructor(settings) {
        if (settings === undefined) {
            settings = {};
            settings.seed = '1234';
        }
        // Each instance of BTM environment needs bindings across all expressions.
        this.randomBindings = {};
        this.bindings = {};
        this.functions = {};
        this.opPrec = opPrec;
        this.exprType = exprType;
        this.exprValue = exprValue;
        this.options = {
            negativeNumbers: true,
            absTol: 1e-8,
            relTol: 1e-4,
            useRelErr: true,
            doFlatten: false 
        };
        this.setReductionRules();
        this.multiop_expr = _multiop_expr_js__WEBPACK_IMPORTED_MODULE_5__.multiop_expr;
        this.binop_expr = _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr;

        // Generate a random generator. We might be passed either a pre-seeded `rand` function or a seed for our own.
        let rngOptions = {};
        if (typeof settings.rand !== 'undefined') {
            rngOptions.rand = settings.rand;
        }
        if (typeof settings.seed !== 'undefined') {
            rngOptions.seed = settings.seed;
        }
        rngOptions.absTol = this.options.absTol;
        this.rng = new _random_js__WEBPACK_IMPORTED_MODULE_8__.RNG(rngOptions);
    }

    // Perform approximate comparison tests using environment settings
    // a < b: -1
    // a ~= b: 0
    // a > b: 1
    numberCmp(a,b,override) {
        // Work with actual values.
        var valA, valB, cmpResult;
        var useRelErr = this.options.useRelErr,
            relTol = this.options.relTol,
            absTol = this.options.absTol;

        if (typeof a === 'number' || typeof a === 'Number') {
            valA = a;
        } else {
            valA = a.value();
        }
        if (typeof b === 'number' || typeof b === 'Number') {
            valB = b;
        } else {
            valB = b.value();
        }

        // Pull out the options.
        if (typeof override !== 'undefined') {
            if (typeof override.useRelErr !== 'undefined') {
                useRelErr = override.useRelErr;
            }
            if (typeof override.relTol !== 'undefined') {
                relTol = override.relTol;
            }
            if (typeof override.absTol !== 'undefined') {
                absTol = override.absTol;
            }
        }

        if (!useRelErr || Math.abs(valA) < absTol) {
            if (Math.abs(valB-valA) < absTol) {
                cmpResult = 0;
            } else if (valA < valB) {
                cmpResult = -1;
            } else {
                cmpResult = 1;
            }
        } else {
            if (Math.abs(valB-valA)/Math.abs(valA) < relTol) {
                cmpResult = 0;
            } else if (valA < valB) {
                cmpResult = -1;
            } else {
                cmpResult = 1;
            }
        }
        return cmpResult;
    }

    /* Block of methods to deal with reduction rules in context */
    setReductionRules() {
        this.reduceRules = (0,_reductions_js__WEBPACK_IMPORTED_MODULE_0__.defaultReductions)(this);
    }

    addReductionRule(equation, description, useOneWay) {
        (0,_reductions_js__WEBPACK_IMPORTED_MODULE_0__.newRule)(this, this.reduceRules, equation, description, true, useOneWay);
    }

    disableReductionRule(equation) {
        (0,_reductions_js__WEBPACK_IMPORTED_MODULE_0__.disableRule)(this, this.reduceRules, equation);
    }

    addRule(ruleList, equation, description, useOneWay){
        (0,_reductions_js__WEBPACK_IMPORTED_MODULE_0__.newRule)(this, ruleList, equation, description, true, useOneWay);
    }

    findMatchRules(reductionList, testExpr, doValidate) {
        return (0,_reductions_js__WEBPACK_IMPORTED_MODULE_0__.findMatchRules)(reductionList, testExpr, doValidate);
    }

    generateRandom(distr, options) {
        var rndVal, rndScalar;

        switch (distr) {
            case 'discrete':
                let min = options.min;
                if (typeof min.value === 'function') {
                    min = min.value();
                }
                let max = options.max;
                if (typeof max.value === 'function') {
                    max = max.value();
                }
                let by = options.by;
                if (typeof by.value === 'function') {
                    by = by.value();
                }
                let nonzero = options.nonzero ? true : false;
                rndVal = this.rng.randDiscrete(min,max,by,nonzero);
                break;
        }
        rndScalar = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this, rndVal);
        return rndScalar;
    }

    addFunction(name, input, expression) {
        if (arguments.length < 2) {
            input = "x";
        }
        // No expression? Make it random.
        if (arguments.length < 3) {
            var formula = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this, this.rng.randRational([-20,20],[1,15]));
            var newTerm;
            for (var i=1; i<=6; i++) {
                if (Array.isArray(input)) {
                    newTerm = this.parse("sin("+i+"*"+input[0]+")", "formula");
                    for (var j=1; j<input.length; j++) {
                        newTerm = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this, "*",
                            this.parse("sin("+i+"*"+input[j]+")", "formula"),
                            newTerm
                        );
                    }
                } else {
                    newTerm = this.parse("sin("+i+"*"+input+")", "formula");
                }
                newTerm = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this, "*",
                                new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this, this.rng.randRational([-20,20],[1,10])),
                                newTerm);
                formula = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this, "+", formula, newTerm);
            }
            expression = formula;
        }
        var functionEntry = {};
        functionEntry["input"] = input;
        functionEntry["value"] = expression;
        this.functions[name] = functionEntry;
    }

    compareMathObjects(expr1, expr2) {
        if (typeof expr1 === 'string') {
            expr1 = this.parse(expr1, "formula")
        }
        if (typeof expr2 === 'string') {
            expr2 = this.parse(expr2, "formula")
        }
        return (expr1.compare(expr2));
    }

    getParser(context) {
        var self=this,
            parseContext=context;
        return (function(exprString){ return self.parse(exprString, parseContext); })
    }
 
  /* ****************************************
    parse() is the workhorse.

      Take a string representing a formula, and decompose it into an appropriate
      tree structure suitable for recursive evaluation of the function.
      Returns the root element to the tree.
  ***************************************** */
  parse(formulaStr, context, bindings, options) {
    if (arguments.length < 2) {
        context = "formula";
    }
    if (arguments.length < 3) {
      bindings = {};
    }
    if (arguments.length < 4) {
      options = {};
    }

    const numberMatch = /\d|(\.\d)/;
    const nameMatch = /[a-zA-Z]/;
    const unopMatch = /[\+\-/]/;
    const opMatch = /[\+\-*/^=\$&]/;

    var charPos = 0, endPos;
    var parseError = '';

    // Strip any extraneous white space and parentheses.
    var workingStr;
    workingStr = formulaStr.trim();

    // Test if parentheses are all balanced.
    var hasExtraParens = true;
    while (hasExtraParens) {
      hasExtraParens = false;
      if (workingStr.charAt(0) == '(') {
        var endExpr = completeParenthesis(workingStr, 0);
        if (endExpr+1 >= workingStr.length) {
          hasExtraParens = true;
          workingStr = workingStr.slice(1,-1);
        }
      }
    }

    // We build the tree as it is parsed. 
    // Two stacks keep track of operands (expressions) and operators
    // which we will identify as the string is parsed left to right
    // At the time an operand is parsed, we don't know to which operator 
    // it ultimately belongs, so we push it onto a stack until we know.
    var operandStack = new Array();
    var operatorStack = new Array();

    // When an operator is pushed, we want to compare it to the previous operator
    // and see if we need to apply the operators to some operands.
    // This is based on operator precedence (order of operations).
    // An empty newOp means to finish resolve the rest of the stacks.
    function resolveOperator(menv, operatorStack, operandStack, newOp) {
      // Test if the operator has lower precedence.
      var oldOp = 0;
      while (operatorStack.length > 0) {
        oldOp = operatorStack.pop();
        if (newOp && (newOp.type==exprType.unop || oldOp.prec < newOp.prec)) {
            break;
        }

        // To get here, the new operator must be *binary*
        // and the operator to the left has *higher* precedence.
        // So we need to peel off the operator to the left with its operands
        // to form an expression as a new compound operand for the new operator.
        var newExpr;
        // Unary: Either negative or reciprocal require *one* operand
        if (oldOp.type == exprType.unop) {
          if (operandStack.length > 0) {
            var input = operandStack.pop();

            // Deal with negative numbers separately.
            if (menv.options.negativeNumbers && input.type == exprType.number && oldOp.op == '-') {
              newExpr = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(menv, input.number.multiply(-1));
            } else {
              newExpr = new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(menv, oldOp.op, input);
            }
          } else {
            newExpr = new _expression_js__WEBPACK_IMPORTED_MODULE_9__.expression(menv);
            newExpr.setParsingError("Incomplete formula: missing value for " + oldOp.op);
          }
        // Binary: Will be *two* operands.
        } else {
          if (operandStack.length > 1) {
            var inputB = operandStack.pop();
            var inputA = operandStack.pop();
            newExpr = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(menv, oldOp.op, inputA, inputB);
          } else {
            newExpr = new _expression_js__WEBPACK_IMPORTED_MODULE_9__.expression(menv);
            newExpr.setParsingError("Incomplete formula: missing value for " + oldOp.op);
          }
        }
        operandStack.push(newExpr);
        oldOp = 0;
      }
      // The new operator is unary or has higher precedence than the previous op.
      // We need to push the old operator back on the stack to use later.
      if (oldOp != 0) {
        operatorStack.push(oldOp);
      }
      // A new operation was added to deal with later.
      if (newOp) {
        operatorStack.push(newOp);
      }
    }

    // Now we begin to process the string representing the expression.
    var lastElement = -1, newElement; // 0 for operand, 1 for operator.

    // Read string left to right.
    // Identify what type of math object starts at this character.
    // Find the other end of that object by completion.
    // Interpret that object, possibly through a recursive parsing.
    for (charPos = 0; charPos<workingStr.length; charPos++) {
      // Identify the next element in the string.
      if (workingStr.charAt(charPos) == ' ') {
        continue;

      // It might be a close parentheses that was not matched on the left.
      } else if (workingStr.charAt(charPos) == ')') {
        // Treat this like an implicit open parenthesis on the left.
        resolveOperator(this, operatorStack, operandStack);
        newElement = 0;
        lastElement = -1;

      // It could be an expression surrounded by parentheses -- use recursion
      } else if (workingStr.charAt(charPos) == '(') {
        endPos = completeParenthesis(workingStr, charPos);
        var subExprStr = workingStr.slice(charPos+1,endPos);
        var subExpr = this.parse(subExprStr, context, bindings);
        operandStack.push(subExpr);
        newElement = 0;
        charPos = endPos;

      // It could be an absolute value
      } else if (workingStr.charAt(charPos) == '|') {
        endPos = completeAbsValue(workingStr, charPos);
        var subExprStr = workingStr.slice(charPos+1,endPos);
        var subExpr = this.parse(subExprStr, context, bindings);
        var newExpr = new _function_expr_js__WEBPACK_IMPORTED_MODULE_6__.function_expr(this, 'abs', subExpr);
        operandStack.push(newExpr);
        newElement = 0;
        charPos = endPos;

      // It could be a number. Just read it off
      } else if (workingStr.substr(charPos).search(numberMatch) == 0) {
        endPos = completeNumber(workingStr, charPos, options);
        var newExpr = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this, new Number(workingStr.slice(charPos, endPos)));
        if (options && options.noDecimals && workingStr.charAt(charPos) == '.') {
          newExpr.setParsingError("Whole numbers only. No decimal values are allowed.")
        }
        operandStack.push(newExpr);
        newElement = 0;
        charPos = endPos-1;

      // It could be a name, either a function or variable.
      } else if (workingStr.substr(charPos).search(nameMatch) == 0) {
        endPos = completeName(workingStr, charPos);
        var theName = workingStr.slice(charPos,endPos);
        // If not a known name, break it down using composite if possible.
        if (bindings[theName]=== undefined) {
          // Returns the first known name, or theName not composite.
          var testResults = TestNameIsComposite(theName, bindings);
          if (testResults.isComposite) {
            theName = testResults.name;
            endPos = charPos + theName.length;
          }
        }
        // Test if a function.
        // Expand this once we allow parsing of user-defined functions.
        if (workingStr.charAt(endPos) == '(' && 
            (bindings[theName]===undefined)) {
          var endParen = completeParenthesis(workingStr, endPos);

          var fcnName = theName;
          var newExpr;
          // See if this is a derivative
          if (fcnName == 'D') {
            var expr, ivar, ivarValue;
            var entries = workingStr.slice(endPos+1,endParen).split(",");
            expr = this.parse(entries[0], context, bindings);
            if (entries.length == 1) {
              newExpr = new _deriv_expr_js__WEBPACK_IMPORTED_MODULE_7__.deriv_expr(this, expr, 'x');
            } else {
              ivar = this.parse(entries[1], context, bindings);
              // D(f(x),x,c) means f'(c)
              if (entries.length > 2) {
                ivarValue = this.parse(entries[2], context, bindings);
              }
              newExpr = new _deriv_expr_js__WEBPACK_IMPORTED_MODULE_7__.deriv_expr(this, expr, ivar, ivarValue);
            }
          } else {
            var subExpr = this.parse(workingStr.slice(endPos+1,endParen), context, bindings);
            newExpr = new _function_expr_js__WEBPACK_IMPORTED_MODULE_6__.function_expr(this, theName, subExpr);
          }
          operandStack.push(newExpr);
          newElement = 0;
          charPos = endParen;
        }
        // or a variable.
        else {
          // Test if needs index
          if (workingStr.charAt(endPos) == '[') {
            var endParen, hasError=false;
            try {
              endParen = completeBracket(workingStr, endPos, true);
            } catch (error) {
              parseError = error;
              hasError = true;
              endParen = endPos+1;
            }
            var indexExpr = this.parse(workingStr.slice(endPos+1,endParen), context, bindings);
            var newExpr = new _variable_expr_js__WEBPACK_IMPORTED_MODULE_2__.index_expr(this, theName, indexExpr);
            if (hasError) {
              newExpr.setParsingError(parseError);
              parseError = "";
            }
            operandStack.push(newExpr);
            newElement = 0;
            charPos = endParen;
          } else {
            var newExpr = new _variable_expr_js__WEBPACK_IMPORTED_MODULE_2__.variable_expr(this, theName);
            operandStack.push(newExpr);
            newElement = 0;
            charPos = endPos-1;
          }
        }

      // It could be an operator.
      } else if (workingStr.substr(charPos).search(opMatch) == 0) {
        newElement = 1;
        var op = workingStr.charAt(charPos);
        var newOp = new operator(op);

        // Consecutive operators?    Better be sign change or reciprocal.
        if (lastElement != 0) {
          if (op == "-" || op == "/") {
            newOp.type = exprType.unop;
            newOp.prec = opPrec.multdiv;
          } else {
            // ERROR!!!
            parseError = "Error: consecutive operators";
          }
        }
        resolveOperator(this, operatorStack, operandStack, newOp);
      }

      // Two consecutive operands must have an implicit multiplication between them
      if (lastElement == 0 && newElement == 0) {
        var holdElement = operandStack.pop();

        // Push a multiplication
        var newOp = new operator('*');
        resolveOperator(this, operatorStack, operandStack, newOp);

        // Then restore the operand stack.
        operandStack.push(holdElement);
      }
      lastElement = newElement;
    }

    // Now finish up the operator stack: nothing new to include
    resolveOperator(this, operatorStack, operandStack);
    var finalExpression = operandStack.pop();
    if (parseError.length > 0) {
        finalExpression.setParsingError(parseError);
    } else {
        // Substitute any expressions provided
        finalExpression = finalExpression.compose(bindings);
        // Test if context is consistent
        switch (context) {
            case 'number':
                if (!finalExpression.isConstant()) {
                    throw new TypeError(`The expression ${formulaStr} is expected to be a constant but depends on variables.`);
                }
                finalExpression.simplifyConstants();
                break;
            case 'formula':
                break;
        }
        finalExpression.setContext(context);
    }
    if (options.doFlatten) {
      finalExpression.flatten();
    }
    return finalExpression;
  }
}

// Used in parse
function operator(opStr) {
  this.op = opStr;
  switch(opStr) {
    case '+':
    case '-':
      this.prec = opPrec.addsub;
      this.type = exprType.binop;
      this.valueType = exprValue.numeric;
      break;
    case '*':
    case '/':
      this.prec = opPrec.multdiv;
      this.type = exprType.binop;
      this.valueType = exprValue.numeric;
      break;
    case '^':
      this.prec = opPrec.power;
      this.type = exprType.binop;
      this.valueType = exprValue.numeric;
      break;
    case '&':
      this.prec = opPrec.conj;
      this.type = exprType.binop;
      this.valueType = exprValue.bool;
      break;
    case '$':  // $=or since |=absolute value bar
//    this.op = '|'
      this.prec = opPrec.disj;
      this.type = exprType.binop;
      this.valueType = exprValue.bool;
      break;
    case '=':
      this.prec = opPrec.equal;
      this.type = exprType.binop;
      this.valueType = exprValue.bool;
      break;
    case ',':
      this.prec = opPrec.fop;
      this.type = exprType.array;
      this.valueType = exprValue.vector;
      break;
    default:
      this.prec = opPrec.fcn;
      this.type = exprType.fcn;
      break;
  }
}



/* An absolute value can be complicated because also a function. 
May not be clear if nested: |2|x-3|- 5|.
Is that 2x-15 or abs(2|x-3|-5)?
Resolve by requiring explicit operations: |2*|x-3|-5| or |2|*x-3*|-5|
*/
function completeAbsValue(formulaStr, startPos) {
    var pLevel = 1;
    var charPos = startPos;
    var wasOp = true; // open absolute value implicitly has previous operation.

    while (pLevel > 0 && charPos < formulaStr.length) {
        charPos++;
        // We encounter another absolute value.
        if (formulaStr.charAt(charPos) == '|') {
            if (wasOp) { // Must be opening a new absolute value.
                pLevel++;
                // wasOp is still true since can't close immediately
            } else {  // Assume closing absolute value. If not wanted, need operator.
                pLevel--;
                // wasOp is still false since just closed a value.
            }
        // Keep track of whether just had operator or not.
        } else if ("+-*/([".search(formulaStr.charAt(charPos)) >= 0) {
            wasOp = true;
        } else if (formulaStr.charAt(charPos) != ' ') {
            wasOp = false;
        }
    }
    return(charPos);
}

// Find the balancing closing parenthesis.
function completeParenthesis(formulaStr, startPos) {
    var pLevel = 1;
    var charPos = startPos;

    while (pLevel > 0 && charPos < formulaStr.length) {
        charPos++;
        if (formulaStr.charAt(charPos) == ')') {
            pLevel--;
        } else if (formulaStr.charAt(charPos) == '(') {
            pLevel++;
        }
    }
    return(charPos);
}

// Brackets are used for sequence indexing, not regular grouping.
function completeBracket(formulaStr, startPos, asSubscript) {
    var pLevel = 1;
    var charPos = startPos;
    var fail = false;

    while (pLevel > 0 && charPos < formulaStr.length) {
        charPos++;
        if (formulaStr.charAt(charPos) == ']') {
            pLevel--;
        } else if (formulaStr.charAt(charPos) == '[') {
            if (asSubscript) {
                fail = true;
            }
            pLevel++;
        }
    }
    if (asSubscript && fail) {
        throw "Nested brackets used for subscripts are not supported.";
    }
    return(charPos);
}

/* Given a string and a starting position of a name, identify the entire name. */
/* Require start with letter, then any sequence of *word* character */
/* Also allow primes for derivatives at the end. */
function completeName(formulaStr, startPos) {
    var matchRule = /[A-Za-z]\w*'*/;
    var match = formulaStr.substr(startPos).match(matchRule);
    return(startPos + match[0].length);
}

/* Given a string and a starting position of a number, identify the entire number. */
function completeNumber(formulaStr, startPos, options) {
    var matchRule;
    if (options && options.noDecimals) {
        matchRule = /[0-9]*/;
    } else {
        matchRule = /[0-9]*(\.[0-9]*)?(e-?[0-9]+)?/;
    }
    var match = formulaStr.substr(startPos).match(matchRule);
    return(startPos + match[0].length);
}

/* Tests a string to see if it can be constructed as a concatentation of known names. */
/* For example, abc could be a name or could be a*b*c */
/* Pass in the bindings giving the known names and see if we can build this name */
/* Return the *first* name that is part of the whole. */
function TestNameIsComposite(text, bindings) {
    var retStruct = new Object();
    retStruct.isComposite = false;

    if (bindings !== undefined) {
        var remain, nextName;
        if (bindings[text] !== undefined) {
            retStruct.isComposite = true;
            retStruct.name = text;
        } else {
            // See if the text *starts* with a known name
            var knownNames = Object.keys(bindings);
            for (var ikey in knownNames) {
                nextName = knownNames[ikey];
                // If *this* name is the start of the text, see if the rest from known names.
                if (text.search(nextName)==0) {
                    remain = TestNameIsComposite(text.slice(nextName.length), bindings);
                    if (remain.isComposite) {
                        retStruct.isComposite = true;
                        retStruct.name = nextName;
                        break;
                    }
                }
            }
        }
    }
    return retStruct;
}
  
class BTM {
    constructor(settings) {
        this.menv = new MENV(settings);

        // Each instance of BTM environment needs bindings across all expressions.
        this.data = {};
        this.data.allValues = {};
        this.data.params = {};
        this.data.variables = {};
        this.data.expressions = {};
    }


    addMathObject(name, context, newObject) {
        switch(context) {
            case 'number':
                if (newObject.isConstant()) {
                    this.data.params[name] = newObject;
                    this.data.allValues[name] = newObject;
                } else {
                    throw `Attempt to add math object '${name}' with context '${context}' that does not match.`;
                }
                break;
            case 'formula':
                this.data.allValues[name] = newObject;
                break;
        }
        return newObject;
    }

    generateRandom(distr, options) {
       return this.menv.generateRandom(distr,options);
    }

    addVariable(name, options) {
        var newVar = new _variable_expr_js__WEBPACK_IMPORTED_MODULE_2__.variable_expr(this.menv, name);
        
        this.data.variables[name] = newVar;
        this.data.allValues[name] = newVar;

        return newVar;
    }

    parseExpression(expression, context) {
        var newExpr;
        // Not yet parsed
        if (typeof expression === 'string') {
            var formula = this.decodeFormula(expression);
            newExpr = this.menv.parse(formula, context, this.data.allValues)
                            .compose(this.data.allValues);
        // Already parsed
        } else if (typeof expression === 'object') {
            newExpr = expression;
        }
        return newExpr;
    }

    evaluateExpression(expression, context, bindings) {
        var theExpr, newExpr, retValue;
        // Not yet parsed
        if (typeof expression === 'string') {
            var formula = this.decodeFormula(expression);
            theExpr = this.menv.parse(formula, "formula");
        // Already parsed
        } else if (typeof expression === 'object') {
            theExpr = expression;
        }
        retValue = theExpr.evaluate(bindings);
        newExpr = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, retValue);
        return newExpr;
    }

    composeExpression(expression, substitution) {
        var myExpr;
        // Not yet parsed
        if (typeof expression === 'string') {
            var formula = this.decodeFormula(expression);
            myExpr = this.menv.parse(formula, "formula");
        // Already parsed
        } else if (typeof expression === 'object') {
            myExpr = expression;
        }
        var mySubs = Object.entries(substitution);
        var substVar, substExpr;
        [substVar, substExpr] = mySubs[0];
        if (typeof substExpr == "string") {
            substExpr = this.menv.parse(substExpr, "formula");
        }
        var binding = {};
        binding[substVar] = substExpr;
        return myExpr.compose(binding);
    }

    addExpression(name, expression) {
        var newExpr = this.parseExpression(expression, "formula");
        
        this.data.expressions[name] = newExpr;
        this.data.allValues[name] = newExpr;

        return newExpr;
    }

    addFunction(name, input, expression) {
        this.menv.addFunction(name, input, expression);
    }

    // This routine takes the text and looks for strings in mustaches {{name}}
    // It replaces this element with the corresponding parameter, variable, or expression.
    // These should have been previously parsed and stored in this.data.
    decodeFormula(statement, displayMode) {
        // First find all of the expected substitutions.
        var substRequestList = {};
        var matchRE = /\{\{[A-Za-z]\w*\}\}/g;
        var substMatches = statement.match(matchRE);
        if (substMatches != null) {
            for (var i=0; i<substMatches.length; i++) {
                var matchName = substMatches[i];
                matchName = matchName.substr(2,matchName.length-4);
                // Now see if the name is in our substitution rules.
                if (this.data.allValues[matchName] != undefined) {
                    if (displayMode != undefined && displayMode) {
                        substRequestList[matchName] = '{'+this.data.allValues[matchName].toTeX()+'}';
                    } else {
                        substRequestList[matchName] = '('+this.data.allValues[matchName].toString()+')';
                    }
                }
            }
        }

        // We are now ready to make the substitutions.
        var retString = statement;
        for (var match in substRequestList) {
            var re = new RegExp("{{" + match + "}}", "g");
            var subst = substRequestList[match];
            retString = retString.replace(re, subst);
        }
        return retString;
    }

    compareExpressions(expr1, expr2) {
        var myExpr1, myExpr2;
        // Not yet parsed
        if (typeof expr1 === 'string') {
            var formula1 = this.decodeFormula(expr1);
            myExpr1 = this.menv.parse(formula1, "formula");
        // Already parsed
        } else if (typeof expr1 === 'object') {
            myExpr1 = expr1;
        }
        if (typeof expr2 === 'string') {
            var formula2 = this.decodeFormula(expr2);
            myExpr2 = this.menv.parse(formula2, "formula");
        // Already parsed
        } else if (typeof expr2 === 'object') {
            myExpr2 = expr2;
        }

        return this.menv.compareMathObjects(myExpr1,myExpr2);
    }

    getParser(context) {
        return this.menv.getParser(context);
    }
}


/***/ }),

/***/ 66718:
/*!********************************************!*\
  !*** ../../../../../BTM/src/binop_expr.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   binop_expr: () => (/* binding */ binop_expr)
/* harmony export */ });
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BTM_root.js */ 84490);
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./expression.js */ 53921);
/* harmony import */ var _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scalar_expr.js */ 45306);
/* harmony import */ var _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./unop_expr.js */ 72224);
/*!
 * BTM JavaScript Library v@VERSION
 * https://github.com/dbrianwalton/BTM
 *
 * Copyright D. Brian Walton
 * Released under the MIT license (https://opensource.org/licenses/MIT)
 *
 * Date: @DATE
 */

/* ***************************************************
* Define the Binary Expression -- defined by an operator and two inputs.
* *************************************************** */






class binop_expr extends _expression_js__WEBPACK_IMPORTED_MODULE_1__.expression {
    constructor(menv, op, inputA, inputB) {
        super(menv);
        this.type = _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.binop;
        this.op = op;
        if (typeof inputA == 'undefined')
            inputA = new _expression_js__WEBPACK_IMPORTED_MODULE_1__.expression(this.menv);
        if (typeof inputB == 'undefined')
            inputB = new _expression_js__WEBPACK_IMPORTED_MODULE_1__.expression(this.menv);
        this.inputs = [inputA, inputB];
            inputA.parent = this;
            inputB.parent = this;

        switch (op) {
            case '+':
            case '-':
                this.prec = _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.opPrec.addsub;
                break;
            case '*':
            case '/':
                this.prec = _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.opPrec.multdiv;
                break;
            case '^':
                this.prec = _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.opPrec.power;
                break;
            case '&':
                this.prec = _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.opPrec.conj;
                this.valueType = _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprValue.bool;
                break;
            case '$':
                this.prec = _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.opPrec.disj;
                this.valueType = _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprValue.bool;
                break;
            case '=':
                this.prec = _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.opPrec.equal;
                this.valueType = _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprValue.bool;
                break;
            default:
                console.log("Unknown binary operator: '"+op+"'.");
                break;
        }
    }

    toString() {
        var theStr;
        var opAStr, opBStr;
        var isError = false;

        if (typeof this.inputs[0] == 'undefined') {
            opAStr = '?';
            isError = true;
        } else {
            opAStr = this.inputs[0].toString();
            if ((this.inputs[0].type >= _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.unop
                    && this.inputs[0].prec < this.prec)
                || (this.inputs[0].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number
                    && opAStr.indexOf("/") >= 0
                    && _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.opPrec.multdiv <= this.prec)
                ) 
            {
                opAStr = '(' + opAStr + ')';
            }
        }
        if (typeof this.inputs[1] == 'undefined') {
            opBStr = '?';
            isError = true;
        } else {
            opBStr = this.inputs[1].toString();
            if ((this.inputs[1].type >= _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.unop
                    && this.inputs[1].prec <= this.prec)
                || (this.inputs[1].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number
                    && opBStr.indexOf("/") >= 0
                    && _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.opPrec.multdiv <= this.prec)
                ) 
            {
                opBStr = '(' + opBStr + ')';
            }
        }

        var theOp = this.op;
        if (theOp == '|') {
            theOp = ' $ ';
        }

        theStr = opAStr + theOp + opBStr;
        return(theStr);
    }

    // Return an array containing all tested equivalent strings.
    allStringEquivs() {
        var allInputsA = this.inputs[0].allStringEquivs(),
            allInputsB = this.inputs[1].allStringEquivs();

        var retValue = [];

        var theOp = this.op;
        if (theOp == '|') {
            theOp = ' $ ';
        }

        for (var i in allInputsA) {
            for (var j in allInputsB) {
                opAStr = allInputsA[i];
                if (this.inputs[0].type >= _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.unop && this.inputs[0].prec < this.prec) {
                    opAStr = '(' + opAStr + ')';
                }
                opBStr = allInputsB[j];
                if (this.inputs[1].type >= _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.unop && this.inputs[1].prec <= this.prec) {
                    opBStr = '(' + opBStr + ')';
                }

                retValue.push(opAStr + theOp + opBStr);

                if (this.op == '+' || this.op == '*' || this.op == '&' || this.op == '$') {
                    opBStr = allInputsB[j];
                    if (this.inputs[1].type >= _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.unop && this.inputs[1].prec < this.prec) {
                        opBStr = '(' + opBStr + ')';
                    }
                    opAStr = allInputsA[i];
                    if (this.inputs[0].type >= _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.unop && this.inputs[0].prec <= this.prec) {
                        opAStr = '(' + opAStr + ')';
                    }
                    retValue.push(opBStr + theOp + opAStr);
                }
            }
        }

        return(retValue);
    }

    toTeX(showSelect) {
        var theStr;
        var theOp;
        var opAStr, opBStr;

        if (typeof showSelect == 'undefined') {
            showSelect = false;
        }

        if (typeof this.inputs[0] == 'undefined') {
            opAStr = '?';
        } else {
            opAStr = this.inputs[0].toTeX(showSelect);
        }
        if (typeof this.inputs[1] == 'undefined') {
            opBStr = '?';
        } else {
            opBStr = this.inputs[1].toTeX(showSelect);
        }
        theOp = this.op;
        if (showSelect && this.select) {
            switch (theOp) {
                case '*':
                    theOp = '\\cdot ';
                    break;
                case '/':
                    theOp = '\\div ';
                    break;
                case '^':
                    theOp = '\\wedge ';
                    break;
                case '|':
                    theOp = '\\hbox{ or }';
                    break;
                case '$':
                    theOp = '\\hbox{ or }';
                    break;
                case '&':
                    theOp = '\\hbox{ and }';
                    break;
            }
        } else {
            switch (theOp) {
                case '*':
                    if (this.inputs[1] && this.inputs[1].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number) {
                        theOp = '\\cdot ';
                    } else if (this.inputs[1] && this.inputs[1].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.binop
                                && this.inputs[1].op=='^' && this.inputs[1].inputs[0].type==_BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number) {
                        theOp = '\\cdot ';
                    } else {
                        theOp = ' ';
                    }
                    break;
                case '|':
                    theOp = '\\hbox{ or }';
                    break;
                case '$':
                    theOp = '\\hbox{ or }';
                    break;
                case '&':
                    theOp = '\\hbox{ and }';
                    break;
            }
        }
        if (theOp == '/') {
            theStr = '\\frac{' + opAStr + '}{' + opBStr + '}';
        } else if (theOp == '^') {
            if (this.inputs[0] && this.inputs[0].type >= _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.fcn) {
                theStr = '\\left(' + opAStr + '\\right)';
            } else {
                theStr = opAStr;
            }
            theStr += theOp + '{' + opBStr + '}';
        } else {
            var argStrL='', argStrR='', opStrL='', opStrR='';

            if (showSelect && this.select) {
                argStrL = '{\\color{blue}';
                argStrR = '}';
                opStrL = '{\\color{red}';
                opStrR = '}';
            }
            if (this.inputs[0] && this.inputs[0].type >= _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.unop && this.inputs[0].prec < this.prec) {
                theStr = '\\left(' + argStrL + opAStr + argStrR + '\\right)';
            } else {
                theStr = argStrL + opAStr + argStrR;
            }
            theStr += opStrL + theOp + opStrR;
            if (this.inputs[1] && this.inputs[1].type >= _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.unop && this.inputs[1].prec <= this.prec) {
                theStr += '\\left(' + argStrL + opBStr + argStrR + '\\right)';
            } else {
                theStr += argStrL + opBStr + argStrR;
            }
        }
        if (showSelect && this.select) {
          theStr = "{\\color{red}\\boxed{" + theStr + "}}";
        }
        theStr = theStr.replace(/\+-/g, '-');
        return(theStr);
    }

    toMathML() {
        var theStr;
        var theOp;
        var opAStr, opBStr;

        if (typeof this.inputs[0] == 'undefined') {
            opAStr = '?';
        } else {
            opAStr = this.inputs[0].toMathML();
        }
        if (typeof this.inputs[1] == 'undefined') {
            opBStr = '?';
        } else {
            opBStr = this.inputs[1].toMathML();
        }
        switch (this.op) {
            case '+':
                theOp = "<plus/>"
                break;
            case '-':
                theOp = "<minus/>"
                break;
            case '*':
                theOp = "<times/>"
                break;
            case '/':
                theOp = "<divide/>"
                break;
            case '^':
                theOp = "<power/>"
                break;
        }
        theStr = "<apply>" + theOp + opAStr + opBStr + "</apply>";

        return(theStr);
    }

    operateToTeX() {
        var opString = this.op;

        switch (opString) {
            case '*':
                opString = '\\times ';
                break;
            case '/':
                opString = '\\div ';
                break;
            case '^':
                opString = '\\wedge ';
                break;
            case '|':
                opString = '\\hbox{ or }';
                break;
            case '$':
                opString = '\\hbox{ or }';
                break;
            case '&':
                opString = '\\hbox{ and }';
                break;
        }

        return(opString);
    }

    isCommutative() {
        var commutes = false;
        if (this.op === '+' || this.op === '*') {
            commutes = true;
        }
        return(commutes);
    }

    evaluate(bindings) {
        var inputAVal = this.inputs[0].evaluate(bindings);
        var inputBVal = this.inputs[1].evaluate(bindings);

        if (inputAVal == undefined || inputBVal == undefined) {
            return(undefined);
        }

        var retVal = undefined;
        switch (this.op) {
            case '+':
                retVal = inputAVal + inputBVal;
                break;
            case '-':
                retVal = inputAVal - inputBVal;
                break;
            case '*':
                retVal = inputAVal * inputBVal;
                break;
            case '/':
                retVal = inputAVal / inputBVal;
                break;
            case '^':
                if (!this.inputs[1].isConstant()) {
                    retVal = Math.exp(inputBVal * Math.log(inputAVal));
                } else {
                    if (inputAVal >= 0 || (inputBVal % 1 == 0)) {
                        retVal = Math.pow(inputAVal,inputBVal);
                    } else {
                        retVal = Math.exp(inputBVal * Math.log(inputAVal));
                    }
                }
                break;
            case '=':
                retVal = (Math.abs(inputAVal - inputBVal) < this.menv.options.absTol);
                break;
            case '&':
                retVal = inputAVal && inputBVal;
                break;
            case '|':
            case '$':
                retVal = inputAVal || inputBVal;
                break;
            default:
                console.log("The binary operator '" + this.op + "' is not defined.");
                retVal = undefined;
                break;
        }
        return(retVal);
    }

    // See if this operator is now redundant.
    // Return the resulting expression.
    reduce() {
        var newExpr = this;
        if (this.inputs.length <= 1) {
            if (this.inputs.length == 0) {
                // Sum with no elements = 0
                // Product with no elements = 1
                newExpr = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.menv, this.op == '+' ? 0 : 1);
            } else {
                // Sum or product with one element *is* that element.
                newExpr = this.inputs[0].reduce();
            }
            newExpr.parent = this.parent;
            if (this.parent !== null) {
                this.parent.inputSubst(this, newExpr);
            }
        }
        return(newExpr);
    }

    simplifyConstants() {
        var retVal = this;
        this.inputs[0] = this.inputs[0].simplifyConstants();
        this.inputs[0].parent = this;
        this.inputs[1] = this.inputs[1].simplifyConstants();
        this.inputs[1].parent = this;
        if ((this.inputs[0].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number
                || (this.inputs[0].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.unop && this.inputs[0].inputs[0].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number)
            ) &&
            (this.inputs[1].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number
                || (this.inputs[1].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.unop && this.inputs[1].inputs[0].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number)
            ))
        {
            var numA, numB, theNumber;
            if (this.inputs[0].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number) {
                numA = this.inputs[0].number;
            } else {
                switch (this.inputs[0].op) {
                    case '-':
                        numA = this.inputs[0].inputs[0].number.addInverse();
                        break;
                    case '/':
                        numA = this.inputs[0].inputs[0].number.multInverse();
                        break;
                }
            }
            if (this.inputs[1].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number) {
                numB = this.inputs[1].number;
            } else {
                switch (this.inputs[1].op) {
                    case '-':
                        numB = this.inputs[1].inputs[0].number.addInverse();
                        break;
                    case '/':
                        numB = this.inputs[1].inputs[0].number.multInverse();
                        break;
                }
            }
            switch (this.op) {
                case '+':
                    theNumber = numA.add(numB);
                    break;
                case '-':
                    theNumber = numA.subtract(numB);
                    break;
                case '*':
                    theNumber = numA.multiply(numB);
                    break;
                case '/':
                    theNumber = numA.divide(numB);
                    break;
                case '^':
                    // Integer powers of a rational number can be represented exactly.
                    if (numA instanceof rational_number && numB instanceof rational_number
                            && numB.q == 1 && numB.p % 1 == 0 && numB.p > 0) {
                        theNumber = new rational_number(Math.pow(numA.p, numB.p), Math.pow(numA.q, numB.p));
                    }
                    break;
            }
            if (theNumber !== undefined) {
                if (!this.menv.options.negativeNumbers && theNumber.p < 0) {
                    retVal = new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(this.menv, '-', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.menv, theNumber.multiply(-1)));
                } else {
                    retVal = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.menv, theNumber);
                }
            }
        } else {
            switch (this.op) {
                case '+':
                    // Simplify 0+a
                    if (this.inputs[0].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number
                            && this.inputs[0].number.value()==0) {
                        retVal = this.inputs[1];
                    }
                    // Simplify a+0
                    else if (this.inputs[1].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number
                            && this.inputs[1].number.value() == 0) {
                        retVal = this.inputs[0];
                    }
                    break;
                case '-':
                    // Simplify 0-a
                    if (this.inputs[0].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number
                            && this.inputs[0].number.value()==0) {
                        retVal = new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(this.menv, "-", this.inputs[1]);
                    }
                    // Simplify a-0
                    else if (this.inputs[1].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number
                            && this.inputs[1].number.value() == 0) {
                        retVal = this.inputs[0];
                    }
                    break;
                case '*':
                    // Simplify 1*a
                    if (this.inputs[0].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number
                            && this.inputs[0].number.value()==1) {
                        retVal = this.inputs[1];
                    }
                    // Simplify a*1
                    else if (this.inputs[1].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number
                            && this.inputs[1].number.value() == 1) {
                        retVal = this.inputs[0];
                    }
                    break;
                case '/':
                    // Simplify 1/a to unary operator of multiplicative inverse.
                    if (this.inputs[0].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number
                            && this.inputs[0].number.value()==1) {
                        retVal = new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(this.menv, "/", this.inputs[1]);
                    }
                    // Simplify a/1
                    else if (this.inputs[1].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number
                            && this.inputs[1].number.value() == 1) {
                        retVal = this.inputs[0];
                    }
                    break;
                case '^':
                    // Simplify 0^p
                    if (this.inputs[0].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number
                            && this.inputs[0].number.value()==0) {
                        retVal = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.menv, 0);
                    }
                    // Simplify 1^p
                    else if (this.inputs[0].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number
                            && this.inputs[0].number.value() == 1) {
                        retVal = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.menv, 1);
                    }
                    // Simplify p^1
                    else if (this.inputs[1].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number
                            && this.inputs[1].number.value() == 1) {
                        retVal = this.inputs[0];
                    }
                    break;
            }
        }
        return(retVal);
    }

    flatten() {
        var inA = this.inputs[0].flatten();
        var inB = this.inputs[1].flatten();

        var retVal;
        switch (this.op) {
            case '+':
            case '-':
                var inputs = [];
                if ((inA.type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.multiop || inA.type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.binop)
                    && (inA.op == '+' || inA.op == '-')) 
                {
                    var newInput = inA.flatten();
                    for (var i in newInput.inputs) {
                        inputs.push(newInput.inputs[i]);
                    }
                } else {
                    inputs.push(inA);
                }
                if ((inB.type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.multiop || inB.type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.binop)
                    && (inB.op == '+' || inB.op == '-')) 
                {
                    var newInput = inB.flatten();
                    for (var i in newInput.inputs) {
                        inputs.push(newInput.inputs[i]);
                    }
                } else {
                    if (this.op == '-') {
                        if ((inB.type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.multiop || inB.type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.binop)
                            && (inB.op == '+' || inB.op == '-')) 
                        {
                            var newInput = inB.flatten();
                            for (var i in newInput.inputs) {
                                inputs.push(new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(this.menv, '-',newInput.inputs[i]));
                            }
                        } else {
                            inputs.push(new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(this.menv, '-',inB));
                        }
                    } else {
                        inputs.push(inB);
                    }
                }
                retVal = new multiop_expr(this.menv, '+', inputs);
                break;
            case '*':
            case '/':
                var inputs = [];
                if ((inA.type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.multiop || inA.type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.binop)
                    && (inA.op == '*' || inA.op == '/')) 
                {
                    var newInput = inA.flatten();
                    for (var i in newInput.inputs) {
                        inputs.push(newInput.inputs[i]);
                    }
                } else {
                    inputs.push(inA);
                }
                if ((inB.type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.multiop || inB.type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.binop)
                    && (inB.op == '*' || inB.op == '/'))
                {
                    var newInput = inB.flatten();
                    for (var i in newInput.inputs) {
                        inputs.push(newInput.inputs[i]);
                    }
                } else {
                    if (this.op == '/') {
                        if ((inB.type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.multiop || inB.type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.binop)
                            && (inB.op == '*' || inB.op == '/')) 
                        {
                            var newInput = inB.flatten();
                            for (var i in newInput.inputs) {
                                inputs.push(new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(this.menv, '/',newInput.inputs[i]));
                            }
                        } else {
                            inputs.push(new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(this.menv, '/',inB));
                        }
                    } else {
                        inputs.push(inB);
                    }
                }
                retVal = new multiop_expr(this.menv, '*', inputs);
                break;
            default:
                retVal = new binop_expr(this.menv, this.op, inA, inB);
        }
        return(retVal);
    }

    copy() {
      var inA = this.inputs[0].copy();
      var inB = this.inputs[1].copy();
      return (new binop_expr(this.menv, this.op, inA, inB));
    }

    compose(bindings) {
        var inA = this.inputs[0].compose(bindings);
        var inB = this.inputs[1].compose(bindings);

        var retVal;
        retVal = new binop_expr(this.menv, this.op, inA, inB);
        if (inA.type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number && inB.type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number) {
            switch (this.op) {
                case '+':
                    retVal = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.menv, inA.number.add(inB.number));
                    break;
                case '-':
                    retVal = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.menv, inA.number.subtract(inB.number));
                    break;
                case '*':
                    retVal = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.menv, inA.number.multiply(inB.number));
                    break;
                case '/':
                    retVal = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.menv, inA.number.divide(inB.number));
                    break;
            }
        }
        return(retVal);
    }

    derivative(ivar, varList) {
        var uConst = this.inputs[0].isConstant();
        var vConst = this.inputs[1].isConstant();

        var theDeriv;
        if (uConst && vConst) {
            theDeriv = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.menv, 0);
        } else {
            var dudx, dvdx;

            if (uConst) {
                dudx = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.menv, 0);
            } else {
                dudx = this.inputs[0].derivative(ivar, varList);
            }
            if (vConst) {
                dvdx = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.menv, 0);
            } else {
                dvdx = this.inputs[1].derivative(ivar, varList);
            }
            switch (this.op) {
                case '+':
                    theDeriv = new binop_expr(this.menv, '+', dudx, dvdx);
                    break;
                case '-':
                    theDeriv = new binop_expr(this.menv, '-', dudx, dvdx);
                    break;
                case '*':
                    var udv = new binop_expr(this.menv, '*', this.inputs[0], dvdx)
                    var vdu = new binop_expr(this.menv, '*', dudx, this.inputs[1])
                    if (uConst) {
                        theDeriv = udv;
                    } else if (vConst) {
                        theDeriv = vdu;
                    } else {
                        theDeriv = new binop_expr(this.menv, '+', vdu, udv);
                    }
                    break;
                case '/':
                    if (vConst) {
                        theDeriv = new binop_expr(this.menv, '/', dudx, this.inputs[1]);
                    } else if (uConst) {
                        var numer = new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(this.menv, '-', new binop_expr(this.menv, '*', this.inputs[0], dvdx));
                        var denom = new binop_expr(this.menv, '^', this.inputs[1], new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.menv, 2));
                        theDeriv = new binop_expr(this.menv, '/', numer, denom);
                    } else {
                        var udv = new binop_expr(this.menv, '*', this.inputs[0], dvdx)
                        var vdu = new binop_expr(this.menv, '*', dudx, this.inputs[1])
                        var numer = new binop_expr(this.menv, '-', vdu, udv);
                        var denom = new binop_expr(this.menv, '^', this.inputs[1], new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.menv, 2));
                        theDeriv = new binop_expr(this.menv, '/', numer, denom);
                    }
                    break;
                case '^':
                    var powDep = this.inputs[1].dependencies();
                    var ivarName = (typeof ivar == 'string') ? ivar : ivar.name;
                    // See if the power depends on the variable
                    if (powDep.length > 0 && powDep.indexOf(ivarName) >= 0) {
                        var theArg = new binop_expr(this.menv, '*', this.inputs[1], new function_expr(this.menv, 'log', this.inputs[0]));
                        var theFcn = new function_expr(this.menv, 'exp', theArg);
                        theDeriv = theFcn.derivative(ivar, varList);
                    // Otherwise this is a simple application of the power rule
                    } else if (!uConst) {
                        var newPow = new binop_expr(this.menv, '-', this.inputs[1], new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.menv, 1));
                        var dydu = new binop_expr(this.menv, '*', this.inputs[1], new binop_expr(this.menv, '^', this.inputs[0], newPow));
                        if (this.inputs[0].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.variable
                                && this.inputs[0].name == ivarName) {
                            theDeriv = dydu;
                        } else {
                            var dudx = this.inputs[0].derivative(ivar, varList);
                            theDeriv = new binop_expr(this.menv, '*', dydu, dudx);
                        }
                    } else {
                        theDeriv = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.menv, 0);
                    }
                    break;
                default:
                    console.log("The binary operator '" + this.op + "' is not defined.");
                    theDeriv = undefined;
                    break;
            }
        }
        return(theDeriv);
    }
}


/***/ }),

/***/ 2813:
/*!********************************************!*\
  !*** ../../../../../BTM/src/deriv_expr.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deriv_expr: () => (/* binding */ deriv_expr)
/* harmony export */ });
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expression.js */ 53921);
/* harmony import */ var _variable_expr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./variable_expr.js */ 69082);
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BTM_root.js */ 84490);
/*!
 * BTM JavaScript Library v@VERSION
 * https://github.com/dbrianwalton/BTM
 *
 * Copyright D. Brian Walton
 * Released under the MIT license (https://opensource.org/licenses/MIT)
 *
 * Date: @DATE
 */

/* ***************************************************
* Define the Derivative of an Expression
* *************************************************** */





class deriv_expr extends _expression_js__WEBPACK_IMPORTED_MODULE_0__.expression {
    constructor(menv, formula, variable, atValue) {
        super(menv);
        this.type = _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__.exprType.operator;
        this.op = "D";
        if (typeof formula == 'undefined')
            formula = new _expression_js__WEBPACK_IMPORTED_MODULE_0__.expression(menv);
        if (typeof variable == 'undefined') {
            variable = new _variable_expr_js__WEBPACK_IMPORTED_MODULE_1__.variable_expr(menv, 'x');
        } else if (typeof variable == 'string') {
            variable = new _variable_expr_js__WEBPACK_IMPORTED_MODULE_1__.variable_expr(menv, variable);
        }
        this.ivar = variable;
        this.ivarValue = atValue;
        this.inputs = [formula];
        this.isRate = false;
        formula.parent = this;
    }

    toString() {
        var theStr;
        var exprStr, varStr, valStr;

        varStr = this.ivar.toString();
        exprStr = this.inputs[0].toString();
        if (typeof this.ivarValue != 'undefined') {
            valStr = this.ivarValue.toString();
            theStr = "D("+exprStr+","+varStr+","+valStr+")";
        } else {
            theStr = "D("+exprStr+","+varStr+")";
        }
        return(theStr);
    }

    toTeX(showSelect) {
        var theStr;
        var opStr, varStr, exprStr, valStr;

        varStr = this.ivar.toTeX();
        exprStr = this.inputs[0].toTeX();
        if (this.isRate && this.inputs[0].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__.exprType.variable) {
            if (typeof this.ivarValue != 'undefined') {
                valStr = this.ivarValue.toTeX();
                theStr = "\\left. \\frac{d" + exprStr + "}{d"+varStr+"} \\right|_{"
                    + varStr + "=" + valStr + "}";
            } else {
                theStr = "\\frac{d" + exprStr +"}{d"+varStr+"}";
            }
        } else {
            if (typeof this.ivarValue != 'undefined') {
                valStr = this.ivarValue.toTeX();
                opStr = "\\left. \\frac{d}{d"+varStr+"} \\right|_{"
                    + varStr + "=" + valStr + "}";
            } else {
                opStr = "\\frac{d}{d"+varStr+"}";
            }
            theStr = opStr + "\\Big[" + exprStr + "\\Big]";
        }
        return(theStr);
    }

    // Return an array containing all tested equivalent strings.
    allStringEquivs() {
        var allInputs = this.inputs[0].allStringEquivs();
        var varStr, valStr;
        var retValue = [];

        varStr = this.ivar.toString();
        if (typeof this.ivarValue != 'undefined') {
            valStr = this.ivarValue.toString();
        }
        for (var i in allInputs) {
            if (typeof this.ivarValue != 'undefined') {
                retValue[i] = "D("+allInputs[i]+","+varStr+","+valStr+")";
            } else {
                retValue[i] = "D("+allInputs[i]+","+varStr+")";
            }
        }

        return(allInputs);
    }

    toMathML() {
        var theStr;
        var exprStr;

        if (typeof this.inputs[0] == 'undefined') {
            exprStr = '?';
        } else {
            exprStr = this.inputs[0].toMathML();
        }
        theStr = "<apply><derivative/>" + exprStr + "</apply>";

        return(theStr);
    }

    evaluate(bindings) {
        var retVal;
        var derivExpr;
        var dbind = {};

        if (typeof this.ivarValue != 'undefined') {
            dbind[this.ivar.name] = this.ivarValue;
        }
        // Compute the derivative of the expression, then evaluate at binding
        derivExpr = this.inputs[0].derivative(this.ivar, bindings);
        derivExpr = derivExpr.compose(dbind);
        retVal = derivExpr.evaluate(bindings);
        return(retVal);
    }

    simplifyConstants() {
        return(this);
    }

    flatten() {
      return (new deriv_expr(this.menv, this.inputs[0].flatten(), this.ivar, this.ivarValue));
    }

    copy() {
      return (new deriv_expr(this.menv, this.inputs[0].copy(), this.ivar, this.ivarValue));
    }


    compose(bindings) {
    }

    derivative(ivar, varList) {
        var dbind = {};

        if (typeof this.ivarValue != 'undefined') {
            dbind[this.ivar] = this.ivarValue;
        }
        // Evaluate the main expression using original binding
        var firstDeriv = this.inputs[0].derivative(this.ivar, varList);
        firstDeriv.compose(dbind);

        // Now differentiate that expression using new binding.
        return firstDeriv.derivative(ivar, varList);
    }
}


/***/ }),

/***/ 53921:
/*!********************************************!*\
  !*** ../../../../../BTM/src/expression.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MathObject: () => (/* binding */ MathObject),
/* harmony export */   expression: () => (/* binding */ expression)
/* harmony export */ });
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BTM_root.js */ 84490);
/* harmony import */ var _reductions_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reductions.js */ 64621);
/*!
 * BTM JavaScript Library v@VERSION
 * https://github.com/dbrianwalton/BTM
 *
 * Copyright D. Brian Walton
 * Released under the MIT license (https://opensource.org/licenses/MIT)
 *
 * Date: @DATE
 */




class MathObject {
    constructor(menv) {
        this.menv = menv;

        this.select = false;
        this.parent = null;
        this.inputs = [];
        this.valueType = _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprValue.undef;
        this.context = undefined;
    }
    
    // Method to *evaluate* the object.
    // - Return undefined
    value(bindings) {
    }
    
    // Update context setting
    setContext(context) {
        this.context = context;
        // Update context on inputs.
        for (var i in this.inputs) {
            this.inputs[i].setContext(context);
        }
    }

    // When the parser throws an error, need to record it.
    setParsingError(errorString) {
        this.parseError = errorString;
    }

    // Errors from parsing. Check all possible children (recursively)
    hasParsingError() {
        var retValue = false,
            i = 0;
        if (this.parseError) {
            retValue = true;
        }

        while (!retValue && i < this.inputs.length) {
            // Check for reductions on inputs.
            retValue = this.inputs[i].hasParsingError();
            i++;
        }
        return retValue;
    }
    
    // Errors from parsing. Find the *first* error in the parsing process.
    getParsingError() {
        var errString = this.parseError;
        var i=0;
        while (!errString && i < this.inputs.length) {
            errString = this.inputs[i].getParsingError();
        }
        return (errString);
    }
    
    // Method to generate the expression as input-style string.
    toString(elementOnly) {
        if (typeof elementOnly == 'undefined') {
            elementOnly = false;
        }
        var theStr = '';
        return(theStr);
    }
    
    // Method to generate the expression using presentation-style (LaTeX)
    // - showSelect is so that part of the expression can be highlighted
    toTeX(showSelect) {
        if (typeof showSelect == 'undefined') {
            showSelect = false;
        }
        return(this.toString());
    }

    // Method to represent the expression using MathML
    toMathML() {
        return("<mi>" + this.toString() + "</mi>");
    }
    
    // Return an array containing all tested equivalent strings.
    allStringEquivs() {
        return([]);
    }
    
    // To convert binary tree structure to n-ary tree for supported operations (+ and *)
    // Most things can't flatten. Return a copy.
    flatten() {
        return this.copy();
    }
    
    // Test if the expression evaluates to a constant.
    isConstant() {
        var retValue = false;
        return(retValue);
    }
    
    // Test if the expression evaluates to a constant.
    isExpression() {
        var retValue = false;
        return(retValue);
    }

}

class expression extends MathObject {
  constructor(menv) {
        super(menv);
        this.select = false;
        this.parent = null;
        this.inputs = [];
        this.valueType = _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprValue.numeric;
    }

    // Method to *evaluate* the value of the expression using given symbol bindings.
    // - Return native Number value
    value(bindings) {
        return(this.evaluate(bindings));
    }

    // When the parser throws an error, need to record it.
    setParsingError(errorString) {
        this.parseError = errorString;
    }

    // Errors from parsing. Check all possible children (recursively)
    hasParsingError() {
        var retValue = false,
            i = 0;
        if (this.parseError) {
            retValue = true;
        }

        while (!retValue && i < this.inputs.length) {
            // Check for reductions on inputs.
            retValue = this.inputs[i].hasParsingError();
            i++;
        }
        return retValue;
    }

    // Errors from parsing. Find the *first* error in the parsing process.
    getParsingError() {
        var errString = this.parseError;
        var i=0;
        while (!errString && i < this.inputs.length) {
            errString = this.inputs[i].getParsingError();
        }
        return (errString);
    }

    // Method to generate the expression as input-style string.
    toString(elementOnly) {
        if (typeof elementOnly == 'undefined') {
            elementOnly = false;
        }
        var theStr = '';
        return(theStr);
    }

    // Method to generate the expression using presentation-style (LaTeX)
    // - showSelect is so that part of the expression can be highlighted
    toTeX(showSelect) {
        if (typeof showSelect == 'undefined') {
            showSelect = false;
        }
        return(this.toString());
    }

    // Method to represent the expression using MathML
    toMathML() {
        return("<mi>" + this.toString() + "</mi>");
    }

    operateToTeX() {
        return(this.toTeX());
    }

    treeToTeX(expand) {
        var retStruct = {};
        
        retStruct.parent = (typeof this.parent === 'undefined' || this.parent === null) ? null : this.parent.operateToTeX();
        if (typeof expand === 'undefined' || !expand) {
            retStruct.current = this.toTeX();
            retStruct.inputs = null;
        } else {
            retStruct.current = this.operateToTeX();
            retStruct.inputs = [];
            for (var i in this.inputs) {
                retStruct.inputs[i] = this.inputs[i].toTeX();
            }
        }
        return(retStruct);
    }


    // Return an array containing all tested equivalent strings.
    allStringEquivs() {
        return([]);
    }

    // To convert binary tree structure to n-ary tree for supported operations (+ and *)
    // Most things can't flatten. Return a copy.
    flatten() {
        return this.copy();
    }

    // Create a new expression that is a copy.
    copy() {
        var myCopy = new expression();
        myCopy.valueType = this.valueType;
        myCopy.context = this.context;
        for (var i in this.inputs) {
            myCopy.inputs[i] = myCopy.inputs[i].copy();
            myCopy.inputs[i].parent = myCopy;
        }
        return myCopy;
    }

    // When subtree only involves constants, simplify the formula to a value.
    // Default: Look at all descendants (inputs) and simplify there.
    simplifyConstants() {
        for (var i in this.inputs) {
            this.inputs[i] = this.inputs[i].simplifyConstants();
            this.inputs[i].parent = this;
        }
        return(this);
    }

    // Find all dependencies (symbols) required to evaluate expression.
    dependencies(forced) {
        var inDeps;
        var i, j;
        var depArray = new Array();

        var master = {};
        if (forced != undefined) {
            for (var i=0; i<forced.length; i++) {
                depArray.push(forced[i]);
                master[forced[i]] = true;
            }
        }
        for (i in this.inputs) {
            inDeps = this.inputs[i].dependencies();
            for (j in inDeps) {
                if (typeof master[inDeps[j]] == "undefined") {
                    depArray.push(inDeps[j]);
                    master[inDeps[j]] = true;
                }
            }
        }

        return(depArray);
    }

    // Method to return input at given index.
    getInput(whichInput) {
        var inputExpr = null;
        if (whichInput < 0 || whichInput >= this.inputs.length) {
            throw 'Attempt to get an undefined input expression.';
        } else {
            inputExpr = this.inputs[whichInput];
        }
        return(inputExpr);
    }

    // Test if the expression evaluates to a constant.
    isConstant() {
        var retValue = true;
        for (var i in this.inputs) {
            retValue = retValue & this.inputs[i].isConstant();
        }
        return(retValue);
    }

    // Evaluate the expression given the bindings to symbols.
    evaluate(bindings) {
        return(0);
    }

    // Create a *new* expression where a symbol is *replaced* by a bound expression
    compose(bindings) {
        return(new expression());
    }

    // Compare *this* expression to a given *testExpr*.
    // *options* gives options associated with testing (e.g., relative tolerance)
    // but also supports fixing certain bindings.
    // Supports abstract input matching against variables using *matchInputs*
    compare(testExpr, options, matchInputs) {
        var isEqual = true;
        var i, n;

        if (matchInputs == undefined) {
            matchInputs = false;
        }
        if (options == undefined) {
            options = this.menv.options;
        }
        var knownBindings = Object.keys(options);
        var unknownBindings = [];

        var rTol = 1e-8;
        if (typeof options.rTol !== 'undefined') {
            rTol = options.rTol;
            i = knownBindings.indexOf('rTol');
            knownBindings.splice(i, 1);
        }

        var dependA = this.dependencies();
        var dependB = testExpr.dependencies();

        for (i=0; i<dependA.length; i++) {
            if (knownBindings.indexOf(dependA[i]) < 0
                && unknownBindings.indexOf(dependA[i]) < 0)
            {
                unknownBindings.push(dependA[i]);
            }
        }
        for (i=0; i<dependB.length; i++) {
            if (knownBindings.indexOf(dependB[i]) < 0
                && unknownBindings.indexOf(dependB[i]) < 0)
            {
                unknownBindings.push(dependB[i]);
            }
        }

        // Create the arrays of test points.
        var variableList = [];
        var testPointList = [];
        var x, xOpt, xMin, xMax, dx, n, testPoints;
        n = 10;
        for (i=0; i<knownBindings.length; i++) {
            x = knownBindings[i];
            xOpt = options[x];
            xMin = xOpt.min;
            xMax = xOpt.max;
            dx = (xMax-xMin)/n;
            testPoints = [];
            for (var j=0; j<n; j++) {
                testPoints[j] = xMin+j*dx;
            }
            testPoints[n] = xMax;

            // Add this to the list of testing arrays.
            variableList.push(x);
            testPointList.push(testPoints);
        }
        for (i=0; i<unknownBindings.length; i++) {
            x = unknownBindings[i];
            xMin = -2;
            xMax = 2;
            dx = (xMax-xMin)/n;
            testPoints = [];
            for (var j=0; j<n; j++) {
                testPoints[j] = xMin+j*dx;
            }
            testPoints[n] = xMax;

            // Add this to the list of testing arrays.
            variableList.push(x);
            testPointList.push(testPoints);
        }

        // Now we will proceed through all possible points.
        // Analogy: Each variable is like one "digit" on an odometer.
        // Go through full cycle of a variable's options and then advance the next variable.
        // Use an odometer-like array that references which point from
        // each list is being used. When the last entry reaches the end,
        // the odometer rolls over until all entries are done.
        var odometer = [];
        for (i=0; i<variableList.length; i++)
            odometer[i]=0;
        var done = false;
        while (!done && isEqual) {
            var y1, y2;
            var bindings = {};
            for (i=0; i<variableList.length; i++) {
                x = variableList[i];
                bindings[x] = testPointList[i][odometer[i]];
            }
            y1 = this.evaluate(bindings);
            y2 = testExpr.evaluate(bindings);
            // Both finite? Check for relative error.
            if (isFinite(y1) && isFinite(y2)) {
                if (!(Math.abs(y1)<1e-12 && Math.abs(y2)<1e-12)
                    && Math.abs(y1-y2)/Math.abs(y1)>rTol) {
                    isEqual = false;
                }
                // If one is finite, other must be NaN
                } else if ( (isFinite(y1) && !isNaN(y2))
                            || (isFinite(y2) && !isNaN(y1)) ) {
                    isEqual = false;
                }

                // Advance the odometer.
                var j=0;
                done = true; // This will only persist when the odometer is done.
                while (j < variableList.length) {
                    odometer[j]++;
                    if (odometer[j] >= testPointList[j].length) {
                        odometer[j] = 0;
                        j++;
                    } else {
                        done = false;
                        break;
                    }
                }
            }
            if (matchInputs && isEqual) {
                var matchOp;
                if (this.op == '+' || this.op == '-') {
                    matchOp = '+';
                } else if (this.op == '*' || this.op == '/') {
                    matchOp = '*';
                }
                if ((matchOp=='+' && testExpr.op != '+' && testExpr.op != '-')
                    || (matchOp=='*' && testExpr.op != '*' && testExpr.op != '/')) {
                    isEqual = false;
                }
                if (isEqual) {
                    var flatA, flatB;
                    flatA = this.flatten();
                    flatB = testExpr.flatten();
                    if (flatA.inputs.length == flatB.inputs.length) {
                    var inputMatched = [];
                    for (i=0; i<flatA.inputs.length; i++) {
                        inputMatched[i] = false;
                    }
                    // Go through each input of testExpr and see if it matches on of this inputs.
                    for (i=0; i<flatB.inputs.length && isEqual; i++) {
                        var matchFound = false;
                        for (j=0; j<flatA.inputs.length && !matchFound; j++) {
                            if (!inputMatched[j] && flatA.inputs[j].compare(flatB.inputs[i], options)) {
                                inputMatched[j] = true;
                                matchFound = true;
                            }
                        }
                        if (!matchFound) {
                            isEqual = false;
                        }
                    }
                } else {
                    isEqual = false;
                }
            }
        }
        return(isEqual);
    }

    // Apply reduction rules to create a reduced expression
    reduce() {
        var workExpr = this.simplifyConstants();
        var matchRules;

        // Check for reductions on inputs.
        for (var i in workExpr.inputs) {
            workExpr.inputs[i] = workExpr.inputs[i].reduce();
        }
        matchRules = (0,_reductions_js__WEBPACK_IMPORTED_MODULE_1__.findMatchRules)(this.menv.reduceRules, workExpr, true);
        while (matchRules.length > 0) {
            workExpr = this.menv.parse(matchRules[0].subStr, this.context);
            matchRules = (0,_reductions_js__WEBPACK_IMPORTED_MODULE_1__.findMatchRules)(this.menv.reduceRules, workExpr, true);
        }
        return workExpr;
    }

    
    derivative(ivar, varList) {
        return(new scalar_expr(0));
    }

    /*
        The match method is designed to compare "this" expression
        to the given "expr" expression and see if it is consistent with
        the current bindings. The bindings will be an object where
        variables in "this" are assigned to strings representing expressions.
        If there is a mismatch, return "null" and the matching process should terminate.

        Overrides:
            - numbers, to deal with scalar formula that simplify
            - variables, which can match arbitrary expressions.
            - indexed expressions might need a special method.
            - multiop, where should see if a variable can match a subcollection of inputs.
    */
    match(expr, bindings) {
        var retValue = null;
        if (this.type == expr.type && this.operateToTeX() == expr.operateToTeX()) {
            retValue = bindings;
            for (var i=0; i<this.inputs.length; i++) {
                if (retValue !== null) {
                    retValue = this.inputs[i].match(expr.inputs[i], retValue);
                }
            }
        }
        return(retValue);
    }

    inputSubst(origExpr, subExpr) {
        var i = this.inputs.indexOf(origExpr);
        if (i >= 0) {
            this.inputs[i] = subExpr;
            if (subExpr !== undefined) {
                subExpr.parent = this;
            }
        }
    }
}

/***/ }),

/***/ 77967:
/*!***********************************************!*\
  !*** ../../../../../BTM/src/function_expr.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   function_expr: () => (/* binding */ function_expr)
/* harmony export */ });
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expression.js */ 53921);
/* harmony import */ var _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scalar_expr.js */ 45306);
/* harmony import */ var _variable_expr_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./variable_expr.js */ 69082);
/* harmony import */ var _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./unop_expr.js */ 72224);
/* harmony import */ var _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./binop_expr.js */ 66718);
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./BTM_root.js */ 84490);
/*!
 * BTM JavaScript Library v@VERSION
 * https://github.com/dbrianwalton/BTM
 *
 * Copyright D. Brian Walton
 * Released under the MIT license (https://opensource.org/licenses/MIT)
 *
 * Date: @DATE
 */

/* ***************************************************
   * Define the Function Expression -- defined by a function name and input expression
   * *************************************************** */








class function_expr extends _expression_js__WEBPACK_IMPORTED_MODULE_0__.expression {
    constructor(menv, name, inputExpr, restrictDomain) {
        super(menv);
        this.type = _BTM_root_js__WEBPACK_IMPORTED_MODULE_5__.exprType.fcn;
        // Count how many derivatives.
        var primePos = name.indexOf("'");
        this.derivs = 0;
        if (primePos > 0) {
            this.name = name.slice(0,primePos);
            this.derivs = name.slice(primePos).length;
        } else {
            this.name = name;
        }
        if (typeof inputExpr == 'undefined')
            inputExpr = new _expression_js__WEBPACK_IMPORTED_MODULE_0__.expression();
        this.inputs = [inputExpr];
        inputExpr.parent = this;
        this.domain = restrictDomain;

        this.alternate = null;
        this.builtin = true;
        switch(this.name) {
            case 'asin':
            case 'acos':
            case 'atan':
            case 'asec':
            case 'acsc':
            case 'acot':
                this.name = 'arc'+this.name.slice(1,4);
                break;
            case 'log':
                this.name = 'ln';
                break;
            case 'sin':
            case 'cos':
            case 'tan':
            case 'csc':
            case 'sec':
            case 'cot':
            case 'arcsin':
            case 'arccos':
            case 'arctan':
            case 'arcsec':
            case 'arccsc':
            case 'arccot':
            case 'sqrt':
            case 'root':
            case 'abs':
            case 'exp':
            case 'expb':
            case 'ln':
            case 'log10':
                break;
            default:
                this.builtin = false;
                break;
        }
        // If using a derivative of a known function, then we should compute that in advance.
        if (this.builtin && this.derivs > 0) {
            var xvar = new _variable_expr_js__WEBPACK_IMPORTED_MODULE_2__.variable_expr(this.menv, "x");
            var deriv = new function_expr(this.menv, this.name, xvar);
            for (var i=0; i<this.derivs; i++) {
                deriv = deriv.derivative(xvar, {"x":0});
            }
            var binding = {};
            binding["x"] = inputExpr;
            this.alternate = deriv.compose(binding);
        }
    }

    getName() {
        return (this.name + "'".repeat(this.derivs));
    }

    toString(elementOnly) {
        var fcnString, retString;
        if (typeof elementOnly == 'undefined') {
            elementOnly = false;
        }
        fcnString = this.getName();
        if (elementOnly) {
            retString = fcnString;
        } else {
            var argStrings = [];
            if (this.inputs.length == 0 || typeof this.inputs[0] == 'undefined') {
                argStrings.push('?');
            } else {
                for (var i in this.inputs) {
                    argStrings.push(this.inputs[i].toString());
                }
            }
            retString = fcnString + '(' + argStrings.join(',') + ')';
        }
        return(retString);
    }

    // Return an array containing all tested equivalent strings.
    allStringEquivs() {
        var allInputs = [], inputOptions = [];
        for (var i in this.inputs) {
            inputOptions.push(this.inputs[i].allStringEquivs());
        }
        var retValue = [];
        var fcnString = this.getName();
        // Want to create a list of all possible input representations.
        function generateArgs(left, rightOptions) {
            if (rightOptions.length==0) {
                allInputs.push(left);
            } else {
                var N = left.length;
                var newLeft = [];
                for (var k in left) {
                    newLeft.push(left[k]);
                }
                for (var k in rightOptions[0]) {
                    newLeft[N] = rightOptions[0][k];
                    generateArgs(newLeft, rightOptions.slice(1));
                }
            }
        }
        generateArgs([], inputOptions);
        for (var i in allInputs) {
            retValue[i] = fcnString+'(' + allInputs[i].join('+') + ')';
        }

        return(retValue);
    }

    toTeX(showSelect) {
        if (typeof showSelect == 'undefined') {
            showSelect = false;
        }
        var texString = '';
        var fcnString;
        var argStrings = [];
        if (typeof this.inputs[0] == 'undefined') {
            argStrings.push('?');
        } else {
            for (var i in this.inputs) {
                argStrings.push(this.inputs[i].toTeX(showSelect));
                if (showSelect && this.select) {
                    argStrings[i] = "{\\color{blue}" + argStrings[i] + "}";
                }
            }
        }

        switch(this.name) {
            case 'sin':
                fcnString = '\\sin';
                break;
            case 'cos':
                fcnString = '\\cos';
                break;
            case 'tan':
                fcnString = '\\tan';
                break;
            case 'csc':
                fcnString = '\\csc';
                break;
            case 'sec':
                fcnString = '\\sec';
                break;
            case 'cot':
                fcnString = '\\cot';
                break;
            case 'arcsin':
                fcnString = '\\sin^{-1}';
                break;
            case 'arccos':
                fcnString = '\\cos^{-1}';
                break;
            case 'arctan':
                fcnString = '\\tan^{-1}';
                break;
            case 'arccsc':
                fcnString = '\\csc^{-1}';
                break;
            case 'arcsec':
                fcnString = '\\sec^{-1}';
                break;
            case 'arccot':
                fcnString = '\\cot^{-1}';
                break;
            case 'sqrt':
                fcnString = '\\mathrm{sqrt}';
                texString = '\\sqrt{' + argStrings[0] + '}';
                break;
            case 'root':
                fcnString = '\\mathrm{root}';
                texString = '\\sqrt[' + argStrings[1] +']{' + argStrings[0] + '}';
                break;
            case 'abs':
                fcnString = '\\abs';
                texString = '\\left|' + argStrings[0] + '\\right|';
                break;
            case 'exp':
                fcnString = 'e^';
                texString = 'e^{' + argStrings[0] + '}';
                break;
            case 'expb':
                fcnString = '\\exp';
                break;
            case 'ln':
                fcnString = '\\ln'
                break;
            case 'log10':
                fcnString = '\\log_{10}'
                break;
            default:
                if (this.name.length > 1) {
                    fcnString = '\\mathrm{' + this.name + '}';
                } else {
                    fcnString = this.name;
                }
                break;
        }
        if (this.derivs > 0) {
            if (this.derivs <= 3) {
                fcnString = fcnString + "'".repeat(this.derivs);
            } else {
                fcnString = fcnString + "^{("+this.derivs+")}";
            }
        }

        if (showSelect && this.select) {
            fcnString = "\\color{red}{" + fcnString + "}";
            texString = '';
        }
        if (texString == '') {
            texString = fcnString + ' \\mathopen{}\\left(' + argStrings.join(',') + '\\right)\\mathclose{}';
        }
        return(texString);
    }

    toMathML() {
        var texString;
        var argString;
        if (typeof this.inputs[0] == 'undefined') {
            argString = '?';
        } else {
            argString = this.inputs[0].toMathML();
        }
        switch(this.name) {
            case 'sin':
            case 'cos':
            case 'tan':
            case 'csc':
            case 'sec':
            case 'cot':
            case 'arcsin':
            case 'arccos':
            case 'arctan':
            case 'exp':
            case 'expb':
            case 'ln':
            case 'abs':
                texString = '<apply><' + this.name + '/>' + argString + '</apply>';
                break;
            case 'sqrt':
                texString = '<apply><root/>' + argString + '</apply>';
                break;
            case 'log10':
                texString = '<apply><log/><logbase><cn>10</cn></logbase>' + argString + '</apply>';
                break;
            default:
                texString = '<apply><ci>' + this.name + '</ci>' + argString + '</apply>';
                break;
        }
        return(texString);
    }

    operateToTeX() {
        var fcnString;
        switch(this.name) {
            case 'sin':
                fcnString = '\\sin';
                break;
            case 'cos':
                fcnString = '\\cos';
                break;
            case 'tan':
                fcnString = '\\tan';
                break;
            case 'csc':
                fcnString = '\\csc';
                break;
            case 'sec':
                fcnString = '\\sec';
                break;
            case 'cot':
                fcnString = '\\cot';
                break;
            case 'arcsin':
                fcnString = '\\sin^{-1}';
                break;
            case 'arccos':
                fcnString = '\\cos^{-1}';
                break;
            case 'arctan':
                fcnString = '\\tan^{-1}';
                break;
            case 'arccsc':
                fcnString = '\\csc^{-1}';
                break;
            case 'arcsec':
                fcnString = '\\sec^{-1}';
                break;
            case 'arccot':
                fcnString = '\\cot^{-1}';
                break;
            case 'sqrt':
                fcnString = '\\mathrm{sqrt}';
                break;
            case 'abs':
                fcnString = '\\abs';
                break;
            case 'exp':
            case 'expb':
                fcnString = '\\exp';
                break;
            case 'ln':
                fcnString = '\\ln'
                break;
            case 'log10':
                fcnString = '\\log_{10}'
                break;
            default:
                if (this.name.length > 1) {
                    fcnString = '\\mathrm{' + this.name + '}';
                } else {
                    fcnString = this.name;
                }
                break;
        }
        if (this.derivs > 0) {
            if (this.derivs <= 3) {
                fcnString = fcnString + "'".repeat(this.derivs);
            } else {
                fcnString = fcnString + "^{("+this.derivs+")}";
            }
        }

        return(fcnString+"(\\Box)");
    }

    evaluate(bindings) {
        var inputVal = this.inputs[0].evaluate(bindings);
        var retVal = undefined;

        if (inputVal == undefined) {
            return(undefined);
        }

        // Built-in functions with derivatives have computed derivative earlier.
        if (this.builtin && this.derivs > 0) {
            if (this.alternate != undefined) {
                retVal = this.alternate.evaluate(bindings);
            } else {
                console.log("Error: Built-in function called with unspecified derivative formula.");
            }
        } else {
            if (bindings[this.name] == undefined) {
                // Check the list of common mathematical functions.
                switch(this.name) {
                    case 'sin':
                        retVal = Math.sin(inputVal);
                        break;
                    case 'cos':
                        retVal = Math.cos(inputVal);
                        break;
                    case 'tan':
                        retVal = Math.tan(inputVal);
                        break;
                    case 'csc':
                        retVal = 1/Math.sin(inputVal);
                        break;
                    case 'sec':
                        retVal = 1/Math.cos(inputVal);
                        break;
                    case 'cot':
                        retVal = 1/Math.tan(inputVal);
                        break;
                    case 'arcsin':
                        if (Math.abs(inputVal) <= 1) {
                            retVal = Math.asin(inputVal);
                        }
                        break;
                    case 'arccos':
                        if (Math.abs(inputVal) <= 1) {
                            retVal = Math.acos(inputVal);
                        }
                        break;
                    case 'arctan':
                        retVal = Math.atan(inputVal);
                        break;
                    case 'arccsc':
                        if (Math.abs(inputVal) >= 1) {
                            retVal = Math.asin(1/inputVal);
                        }
                        break;
                    case 'arcsec':
                        if (Math.abs(inputVal) >= 1) {
                            retVal = Math.acos(1/inputVal);
                        }
                        break;
                    case 'arccot':
                        if (inputVal == 0) {
                            retVal = Math.PI/2;
                        } else {
                            retVal = Math.PI/2 - Math.atan(1/inputVal);
                        }
                        break;
                    case 'sqrt':
                        if (inputVal >= 0) {
                            retVal = Math.sqrt(inputVal);
                        }
                        break;
                    case 'abs':
                        retVal = Math.abs(inputVal);
                        break;
                    case 'exp':
                    case 'expb':
                        retVal = Math.exp(inputVal);
                        break;
                    case 'ln':
                        if (inputVal > 0) {
                            retVal = Math.log(inputVal);
                        }
                        break;
                    case 'log10':
                        if (inputVal > 0) {
                            retVal = Math.LOG10E * Math.log(inputVal);
                        }
                        break;
                    default:
                        // See if we have already used this function.
                        // For consistency, we should keep it the same.
                        var functionEntry = this.menv.functions[this.name];
                        // If never used previously, generate a random function.
                        // This will allow valid comparisons to occur.
                        if (functionEntry == undefined) {
                            console.log("Error: A custom function never had a backend definition.");
                        }
                        // Copy the bindings.
                        var fBind = {};
                        Object.keys(bindings).forEach(function(key) {
                            fBind[ key ] = bindings[ key ];
                        });
                        // Now, use the variable of the function.
                        var inVar = functionEntry["input"];
                        if (Array.isArray(inVar)) {
                            console.log("Error: Function is defined to expect multiple inputs. Not yet implemented.");
                        }
                        fBind[inVar] = inputVal;
                        // See if we need additional derivatives in binding
                        if (this.derivs >= functionEntry["value"].length) {
                            var ivar = new _variable_expr_js__WEBPACK_IMPORTED_MODULE_2__.variable_expr(this.menv, inVar);
                            var varBind = {};
                            varBind[ivar] = 0;
                            for (var i=functionEntry["value"].length; i <= this.derivs; i++) {
                                functionEntry["value"][i] = functionEntry["value"][i-1].derivative(ivar, varBind);
                            }
                        }
                        retVal = functionEntry["value"][this.derivs].evaluate(fBind);
                        break;
                }
            } else {
                var functionEntry = bindings[this.name];
                // Copy the bindings.
                var fBind = {};
                Object.keys(bindings).forEach(function(key) {
                    fBind[ key ] = bindings[ key ];
                });
                // Now, use the variable of the function.
                var inVar = functionEntry["input"];
                if (Array.isArray(inVar)) {
                    console.log("Error: Function is defined to expect multiple inputs. Not yet implemented.");
                }
                fBind[inVar] = inputVal;
                // See if we need additional derivatives in binding
                if (this.derivs >= functionEntry["value"].length) {
                    var ivar = new _variable_expr_js__WEBPACK_IMPORTED_MODULE_2__.variable_expr(this.menv, inVar);
                    var varBind = {};
                    varBind[ivar] = 0;
                    for (var i=functionEntry["value"].length; i <= this.derivs; i++) {
                        functionEntry["value"][i] = functionEntry["value"][i-1].derivative(ivar, varBind);
                    }
                }
                retVal = functionEntry["value"][this.derivs].evaluate(fBind);
            }
        }
        return(retVal);
    }

    flatten() {
        return(new function_expr(this.menv, this.getName(), this.inputs[0].flatten()));
    }

    copy() {
      return(new function_expr(this.menv, this.getName(), this.inputs[0].copy()));
    }

    compose(bindings) {
        return(new function_expr(this.menv, this.getName(), this.inputs[0].compose(bindings)));
    }

    derivative(ivar, varList) {
        var theDeriv;
        var depArray = this.inputs[0].dependencies();
        var uConst = true;
        var ivarName = (typeof ivar == 'string') ? ivar : ivar.name;
        for (var i=0; i<depArray.length; i++) {
            if (depArray[i] == ivarName) {
                uConst = false;
            }
        }

        if (uConst) {
            theDeriv = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 0);
        } else {
            var dydu;

            switch(this.name) {
                    case 'sin':
                        dydu = new function_expr(this.menv, 'cos', this.inputs[0]);
                        break;
                    case 'cos':
                        dydu = new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(this.menv, '-', new function_expr(this.menv, 'sin', this.inputs[0]));
                        break;
                    case 'tan':
                        var theSec = new function_expr(this.menv, 'sec', this.inputs[0]);
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '^', theSec, new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 2));
                        break;
                    case 'csc':
                        var theCot = new function_expr(this.menv, 'cot', this.inputs[0]);
                        dydu = new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(this.menv, '-', new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '*', this, theCot));
                        break;
                    case 'sec':
                        var theTan = new function_expr(this.menv, 'tan', this.inputs[0]);
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '*', this, theTan);
                        break;
                    case 'cot':
                        var theCsc = new function_expr(this.menv, 'csc', this.inputs[0]);
                        dydu = new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(this.menv, '-', new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '^', theCsc, new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 2)));
                        break;
                    case 'arcsin':
                        var theCos = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '-', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 1), new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '^', this.inputs[0], new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 2)));
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '/', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 1), new function_expr(this.menv, 'sqrt', theCos));
                        break;
                    case 'arccos':
                        var theSin = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '-', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 1), new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '^', this.inputs[0], new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 2)));
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '/', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, -1), new function_expr(this.menv, 'sqrt', theSin));
                        break;
                    case 'arctan':
                        var tanSq = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '^', this.inputs[0], new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 2));
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '/', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 1), new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '+', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 1), tanSq));
                        break;
                    case 'arcsec':
                        var theSq = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '^', this.inputs[0], new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 2));
                        var theRad = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '-', theSq, new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 1));
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '/', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 1), new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '*', new function_expr(this.menv, 'abs', this.inputs[0]), new function_expr(this.menv, 'sqrt', theRad)));
                        break;
                    case 'arccsc':
                        var theSq = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '^', this.inputs[0], new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 2));
                        var theRad = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '-', theSq, new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 1));
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '/', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, -1), new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '*', new function_expr(this.menv, 'abs', this.inputs[0]), new function_expr(this.menv, 'sqrt', theRad)));
                        break;
                    case 'arccot':
                        var cotSq = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '^', this.inputs[0], new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 2));
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '/', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, -1), new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '+', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 1), cotSq));
                        break;
                    case 'sqrt':
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '/', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 1), new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '*', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 2), this));
                        break;
                    case 'abs':
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '/', this, this.inputs[0]);
                        break;
                    case 'exp':
                    case 'expb':
                        dydu = new function_expr(this.menv, this.name, this.inputs[0]);
                        break;
                    case 'ln':
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '/', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 1), this.inputs[0]);
                        break;
                    case 'log10':
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '/', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, Math.LOG10E), this.inputs[0]);
                        break;
                    default:
                        dydu = new function_expr(this.menv, this.getName()+"'", this.inputs[0]);
                        break;
            }
            if (!uConst && this.inputs[0].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_5__.exprType.variable) {
                theDeriv = dydu;
            } else {
                var dudx = this.inputs[0].derivative(ivar, varList);

                if (dudx == undefined) {
                    theDeriv = undefined;
                } else {
                    theDeriv = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.menv, '*', dydu, dudx);
                }
            }
        }
        return(theDeriv);
    }
}

/***/ }),

/***/ 46987:
/*!**********************************************!*\
  !*** ../../../../../BTM/src/multiop_expr.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   multiop_expr: () => (/* binding */ multiop_expr)
/* harmony export */ });
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expression.js */ 53921);
/* harmony import */ var _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scalar_expr.js */ 45306);
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BTM_root.js */ 84490);
/*!
 * BTM JavaScript Library v@VERSION
 * https://github.com/dbrianwalton/BTM
 *
 * Copyright D. Brian Walton
 * Released under the MIT license (https://opensource.org/licenses/MIT)
 *
 * Date: @DATE
 */

/* ***************************************************
* Define the Multi-Operand Expression (for sum and product)
* *************************************************** */





class multiop_expr extends _expression_js__WEBPACK_IMPORTED_MODULE_0__.expression {
    constructor(menv, op, inputs) {
        super(menv);
        this.type = _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__.exprType.multiop;
        this.op = op;
        this.inputs = inputs; // an array
        for (var i in inputs) {
            if (typeof inputs[i] == 'undefined')
                inputs[i] = new _expression_js__WEBPACK_IMPORTED_MODULE_0__.expression(menv);
            inputs[i].parent = this;
        }
        switch (op) {
            case '+':
                this.prec = _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__.opPrec.addsub;
                break;
            case '*':
                this.prec = _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__.opPrec.multdiv;
                break;
            default:
                alert("Unknown multi-operand operator: '"+op+"'.");
                break;
        }
    }

    toString() {
        var theStr,
            opStr,
            isError = false,
            showOp;

        theStr = '';
        for (var i in this.inputs) {
            showOp = true;
            if (typeof this.inputs[i] == 'undefined') {
                opStr = '?';
                isError = true;
            } else {
                opStr = this.inputs[i].toString();
                if ((this.inputs[i].type >= _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__.exprType.unop
                        && this.inputs[i].prec <= this.prec)
                    || (this.inputs[i].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__.exprType.number
                        && this.inputs[i].number.q != 1
                        && _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__.opPrec.multdiv <= this.prec)
                ) {
                    opStr = '(' + opStr + ')';
                }
            }
            theStr += ( i>0 ? this.op : '' ) + opStr;
        }

        return(theStr);
    }

    // Return an array containing all tested equivalent strings.
    allStringEquivs() {
        var allInputsArrays = [];

        var indexList = [];
        for (var i in this.inputs) {
            allInputsArrays[i] = this.inputs[i].allStringEquivs();
            indexList.push(i);
        }
        var inputPerms = permutations(indexList);

        var retValue = [];

        var theOp = this.op;
        if (theOp == '|') {
            // Don't want "or" to be translated as absolute value
            theOp = ' $ ';
        }

        function buildStringEquivs(indexList, leftStr) {
            if (typeof leftStr == "undefined") {
                leftStr = "";
            } else if (indexList.length > 0) {
                leftStr += theOp;
            }
            if (indexList.length > 0) {
                var workInputs = allInputsArrays[indexList[0]];
                for (var i in workInputs) {
                    buildStringEquivs(indexList.slice(1), leftStr + "(" + workInputs[i] + ")");
                }
            } else {
                retValue.push(leftStr);
            }
        }

        for (var i in inputPerms) {
            buildStringEquivs(inputPerms[i]);
        }

        return(retValue);
    }

    toTeX(showSelect) {
        var theStr;
        var theOp;
        var opStr;
        var argStrL, argStrR, opStrL, opStrR;

        if (typeof showSelect == 'undefined') {
            showSelect = false;
        }

        theOp = this.op;
        if (this.op == '*') {
            if (showSelect && this.select) {
                theOp = '\\times';
            } else {
                theOp = ' ';
            }
        }

        if (showSelect && this.select) {
            argStrL = '{\\color{blue}';
            argStrR = '}';
            opStrL = '{\\color{red}';
            opStrR = '}';
        } else {
            argStrL = '';
            argStrR = '';
            opStrL = '';
            opStrR = '';
        }

        theStr = '';
        var minPrec = this.prec;
        for (var i in this.inputs) {
            if (typeof this.inputs[i] == 'undefined') {
                opStr = '?';
                theStr += ( i>0 ? opStrL + theOp + opStrR : '' ) + opStr;
            } else {
                if (this.op == '*'
                        && this.inputs[i].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__.exprType.unop && this.inputs[i].op == '/'
                        && !(showSelect && this.select))
                {
                    opStr = argStrL + this.inputs[i].inputs[0].toTeX(showSelect) + argStrR;
                    if (this.inputs[i].inputs[0].type >= _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__.exprType.unop && this.inputs[i].inputs[0].prec < minPrec) {
                        opStr = '\\left(' + opStr + '\\right)';
                    }
                    if (theStr == '') {
                        theStr = '1'
                    }
                    theStr = '\\frac{' + theStr + '}{' + opStr + '}';

                } else if (this.op == '+'
                        && this.inputs[i].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__.exprType.unop && this.inputs[i].op == '-'
                        && !(showSelect && this.select))
                {
                    opStr = argStrL + this.inputs[i].toTeX(showSelect) + argStrR;
                    theStr += opStr;
                } else {
                    opStr = argStrL + this.inputs[i].toTeX(showSelect) + argStrR;
                    if ((this.inputs[i].type >= _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__.exprType.unop
                            && this.inputs[i].prec <= minPrec)
                        || (i>0 && this.op == '*' && this.inputs[i].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__.exprType.number)) {
                        opStr = '\\left(' + opStr + '\\right)';
                    }
                    theStr += ( i>0 ? opStrL + theOp + opStrR : '' ) + opStr;
                }
            }
        }

        return(theStr);
    }

    toMathML() {
        var theStr;
        var theOp;
        var opStr;

        switch (this.op) {
            case '+':
                theOp = "<plus/>"
                break;
            case '*':
                theOp = "<times/>"
                break;
        }

        theStr = "<apply>" + theOp;
        for (var i in this.inputs) {
            if (typeof this.inputs[i] == 'undefined') {
                opStr = '?';
            } else {
                opStr = this.inputs[i].toMathML();
            }
            theStr += opStr;
        }
        theStr += "</apply>";

        return(theStr);
    }

    operateToTeX() {
        var opString = this.op;

        switch (opString) {
            case '*':
                opString = '\\times';
                break;
        }

        return(opString);
    }

    isCommutative() {
        var commutes = false;
        if (this.op === '+' || this.op === '*') {
            commutes = true;
        }
        return(commutes);
    }

    evaluate(bindings) {
        var inputVal;
        var i;
        var retVal;

        switch (this.op) {
            case '+':
                retVal = 0;
                for (i in this.inputs) {
                    inputVal = this.inputs[i].evaluate(bindings);
                    retVal += inputVal;
                }
                break;
            case '*':
                retVal = 1;
                for (i in this.inputs) {
                    inputVal = this.inputs[i].evaluate(bindings);
                    retVal *= inputVal;
                }
                break;
            default:
                console.log("The binary operator '" + this.op + "' is not defined.");
                retVal = undefined;
                break;
        }
        return(retVal);
    }

    // Flatten and also sort terms.
    flatten() {
        var newInputs = [];
        for (var i in this.inputs) {
            var nextInput = this.inputs[i].flatten();
            if (nextInput.type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__.exprType.multiop && nextInput.op == this.op) {
                for (var j in nextInput.inputs) {
                    newInputs.push(nextInput.inputs[j]);
                }
            } else {
                newInputs.push(nextInput);
            }
        }

        var retValue;
        if (newInputs.length == 0) {
            // Adding no elements = 0
            // Multiplying no elements = 1
            retValue = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, this.op == '+' ? 0 : 1);
        } else if (newInputs.length == 1) {
            retValue = newInputs[0];
        } else {
            // Sort the inputs by precedence for products
            // Usually very small, so bubble sort is good enough
            if (this.op=='*') {
                var tmp;
                for (var i=0; i<newInputs.length-1; i++) {
                    for (var j=i+1; j<newInputs.length; j++) {
                        if (newInputs[i].type > newInputs[j].type) {
                            tmp = newInputs[i];
                            newInputs[i] = newInputs[j];
                            newInputs[j] = tmp;
                        }
                    }
                }
            }
            retValue = new multiop_expr(this.menv, this.op, newInputs);
        }
        return(retValue);
    }

    // See if this operator is now redundant.
    // Return the resulting expression.
    reduce() {
        var newExpr = this;
        if (this.inputs.length <= 1) {
            if (this.inputs.length == 0) {
                // Sum with no elements = 0
                // Product with no elements = 1
                newExpr = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, this.op == '+' ? 0 : 1);
            } else {
                // Sum or product with one element *is* that element.
                newExpr = this.inputs[0];
            }
            newExpr.parent = this.parent;
            if (this.parent !== null) {
                this.parent.inputSubst(this, newExpr);
            }
        }
        return(newExpr);
    }

    simplifyConstants() {
        var i,
            constIndex = [],
            newInputs = [];
        // Simplify all inputs
        // Notice which inputs are themselves constant 
        for (i in this.inputs) {
            this.inputs[i] = this.inputs[i].simplifyConstants();
            this.inputs[i].parent = this;
            if (this.inputs[i].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__.exprType.number) {
                constIndex.push(i);
            } else {
                newInputs.push(this.inputs[i]);
            }
        }

        // For all inputs that are constants, group them together and simplify.
        var newExpr = this;
        if (constIndex.length > 1) {
            var newConstant = this.inputs[constIndex[0]].number;
            for (i=1; i<constIndex.length; i++) {
                switch (this.op) {
                    case '+':
                        newConstant = newConstant.add(this.inputs[constIndex[i]].number);
                        break;
                    case '*':
                        newConstant = newConstant.multiply(this.inputs[constIndex[i]].number);
                        break;
                }
            }

            // For addition, the constant goes to the end.
            // For multiplication, the constant goes to the beginning.
            var newInput;
            switch (this.op) {
                case '+':
                    newInputs.push(newInput = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, newConstant));
                    break;
                case '*':
                    newInputs.splice(0, 0, newInput = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, newConstant));
                    break;
            }
            if (newInputs.length == 1) {
                newExpr = newInputs[0];
            } else {
                newInput.parent = this;
                newExpr = new multiop_expr(this.menv, this.op, newInputs);
            }
        }
        return(newExpr);
    }

    // This comparison routine needs to deal with two issues.
    // (1) The passed expression has more inputs than this (in which case we group them)
    // (2) Possibility of commuting makes the match work.
    match(expr, bindings) {
        function copyBindings(bindings)
        {
            var retValue = {};
            for (var key in bindings) {
                retValue[key] = bindings[key];
            }
            return(retValue);
        }

        var retValue = null,
            n = this.inputs.length;
        if (expr.type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__.exprType.multiop && this.op == expr.op
                && n <= expr.inputs.length) {

            // Match on first n-1 and group remainder at end.
            var cmpExpr,
                cmpInputs = [];

            for (var i=0; i<n; i++) {
                if (i<(n-1) || expr.inputs.length==n) {
                    cmpInputs[i] = expr.inputs[i].copy();
                } else {
                    // Create copies of the inputs
                    var newInputs = [];
                    for (var j=0; j<=expr.inputs.length-n; j++) {
                        newInputs[j] = expr.inputs[n+j-1].copy();
                    }
                    cmpInputs[i] = new multiop_expr(this.menv, expr.op, newInputs);
                }
            }
            cmpExpr = new multiop_expr(this.menv, expr.op, cmpInputs);

            // Now make the comparison.
            retValue = copyBindings(bindings);
            retValue = _expression_js__WEBPACK_IMPORTED_MODULE_0__.expression.prototype.match.call(this, cmpExpr, retValue);

            // If still fail to match, try the reverse grouping: match on last n-1 and group beginning.
            if (retValue == null && n < expr.inputs.length) {
                var diff = expr.inputs.length - n;
                cmpInputs = [];

                for (var i=0; i<n; i++) {
                    if (i==0) {
                        // Create copies of the inputs
                        var newInputs = [];
                        for (var j=0; j<=diff; j++) {
                            newInputs[j] = expr.inputs[j].copy();
                        }
                        cmpInputs[i] = new multiop_expr(this.menv, expr.op, newInputs);
                    } else {
                        cmpInputs[i] = expr.inputs[diff+i].copy();
                    }
                }
                cmpExpr = new multiop_expr(this.menv, expr.op, cmpInputs);

                // Now make the comparison.
                retValue = copyBindings(bindings);
                retValue = _expression_js__WEBPACK_IMPORTED_MODULE_0__.expression.prototype.match.call(this, cmpExpr, retValue);
            }
        }
        return(retValue);
    }

    compose(bindings) {
        var newInputs = [];

        for (var i in this.inputs) {
            newInputs.push(this.inputs[i].compose(bindings));
        }

        var retValue;
        if (newInputs.length == 0) {
            retValue = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, this.op == '+' ? 0 : 1);
        } else if (newInputs.length == 1) {
            retValue = newInputs[0];
        } else {
            retValue = new multiop_expr(this.menv, this.op, newInputs);
        }
        return(retValue);
    }

    derivative(ivar, varList) {
        var dTerms = [];

        var theDeriv;
        var i, dudx;
        for (i in this.inputs) {
            if (!this.inputs[i].isConstant()) {
                dudx = this.inputs[i].derivative(ivar, varList);
                switch (this.op) {
                    case '+':
                        dTerms.push(dudx);
                        break;
                    case '*':
                        var dProdTerms = [];
                        for (j in this.inputs) {
                            if (i == j) {
                                dProdTerms.push(dudx);
                            } else {
                                dProdTerms.push(this.inputs[j].compose({}));
                            }
                        }
                        dTerms.push(new multiop_expr(this.menv, '*', dProdTerms));
                        break;
                }
            }
        }
        if (dTerms.length == 0) {
            theDeriv = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 0);
        } else if (dTerms.length == 1) {
            theDeriv = dTerms[0];
        } else {
            theDeriv = new multiop_expr(this.menv, '+', dTerms);
        }
        return(theDeriv);
    }
}

/***/ }),

/***/ 95821:
/*!****************************************!*\
  !*** ../../../../../BTM/src/random.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RNG: () => (/* binding */ RNG)
/* harmony export */ });
/* harmony import */ var _rational_number_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rational_number.js */ 34971);
/*!
 * BTM JavaScript Library v@VERSION
 * https://github.com/dbrianwalton/BTM
 *
 * Copyright D. Brian Walton
 * Released under the MIT license (https://opensource.org/licenses/MIT)
 *
 * Date: @DATE
 */



/* ****************************************************
*    Routines for dealing with random values
* **************************************************** */

/* To use a seeded RNG, we rely on an open source project for the underlying mechanics. */

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

class RNG {
    constructor(rngSettings) {
        if (rngSettings.rand) {
          this.rand = rngSettings.rand;
        } else {
          let seed;
          if (rngSettings.seed == undefined) {
            seed = new Date().getTime().toString();
          } else {
            seed = rngSettings.seed;
          }
          this.rand = aleaPRNG(seed);
        }
    }

    setSeed(seed) {
        this.alea.seed(seed.toString());
    }

    // Standard uniform generator values in [0,1)
    random() {
        return(this.rand());
    }

    // Randomly choose +1 or -1.
    randSign() {
        var a = 2*Math.floor(2*this.random())-1;
        return(a);
    }

    // Randomly choose integer uniformly in {min, ..., max}.
    randInt(min, max) {
        var a = min+Math.floor( (max-min+1)*this.random() );
        return(a);
    }
    
    // Randomly choose floating point uniformly in [min,max)
    randUniform(min, max) {
        var a = min+(max-min)*this.random();
        return(a);
    }

    // Randomly choose floating point uniformly in [min,max)
    randDiscrete(min, max, by, nonzero) {
        if (arguments.length < 3 || by == 0) {
            by = 1;
        }
        if (arguments.length < 4) {
            nonzero=false;
        }
        var rndVal;
        let Nvals = Math.floor((max-min) / by)+1;
        do {
            rndVal = min + by * this.randInt(0,Nvals-1);
        } while (nonzero && Math.abs(rndVal) < 1e-16);
        return(rndVal);
    }

    // Randomly a k-length permuted subsequence of {min, ..., max}
    randChoice(min, max, k) {
        var a = new Array();
        var b = new Array();
        var i,j;
        for (i=0; i<=max-min; i++) {
            a[i] = min+i;
        }
        for (i=0; i<k; i++) {
            j = Math.floor( (max-min+1-i)*this.random() );
            b[i] = a.splice(j,1)[0];
        }

        return (b);
    }

    // Generate a random rational number, passing in 2-len arrays for limits.
    randRational(pLims, qLims) {
        var p, q;

        // Find the raw rational number
        p = this.randInt(pLims[0], pLims[1]);
        q = this.randInt(qLims[0], qLims[1]);

        return (new _rational_number_js__WEBPACK_IMPORTED_MODULE_0__.rational_number(p,q));
    }

    // Generate a random hex code of desired length.
    randHexHash(n) {
      var hash = '';
      var chars = '0123456789abcdef';
      for (var i=0; i<n; i++) {
        hash += chars[this.randInt(0,15)];
      }
      return hash;
    }
}

/***/ }),

/***/ 34971:
/*!*************************************************!*\
  !*** ../../../../../BTM/src/rational_number.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   findGCD: () => (/* binding */ findGCD),
/* harmony export */   rational_number: () => (/* binding */ rational_number)
/* harmony export */ });
/* harmony import */ var _real_number_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./real_number.js */ 88640);
/*!
 * BTM JavaScript Library v@VERSION
 * https://github.com/dbrianwalton/BTM
 *
 * Copyright D. Brian Walton
 * Released under the MIT license (https://opensource.org/licenses/MIT)
 *
 * Date: @DATE
 */

/* *******************************
** Define a class to work with rational numbers
******************************* */



/* Private utility commands. */
  
function isInt(x) {
    var retValue = false;
    if (Number.isInteger === undefined) {
    retValue = (x == Math.floor(x));
    } else {
    retValue = Number.isInteger(x);
    }
    return retValue;
}


 // Implement Euclid's algorithm.
 function findGCD(a,b) {
    var c;
    a = Math.abs(a);
    b = Math.abs(b);
    if (a < b) {
        c=a; a=b; b=c;
    }

    if (b == 0)
        return 0;

    // In this loop, we always have a > b.
    while (b > 0) {
        c = a % b;
        a = b;
        b = c;
    }
    return a;
}

class rational_number extends _real_number_js__WEBPACK_IMPORTED_MODULE_0__.real_number {
    constructor(p,q) {
        if (q == undefined) {
            super(p);
            this.p = p;
            this.q = 1;
        } else {
            super(p/q);
            if (q == 0) {
                this.p = Math.sqrt(-1);
                this.q = 1;
            } else if (p == 0) {
                this.p = 0;
                this.q = 1;
            } else {
                if (q < 0) {
                  this.p = -p;
                  this.q = -q;
                } else {
                  this.p = p;
                  this.q = q;
                }
                this.simplify();
            }
        }
    }

    // Return a numerical value of the rational expression.
    value() {
        return (this.p/this.q);
    }
    
    // Use Euclid's algorithm to find the gcd, then reduce
    simplify() {
        var a;

        // Don't simplify if not ratio of integers.
        if (this.p % 1 != 0 || this.q % 1 != 0) {
        return;
        }
        a = findGCD(this.p, this.q);
        this.p /= a;
        this.q /= a;
    }

    equal(other) {
        if (other instanceof rational_number) {
            return (this.p.valueOf()==other.p.valueOf()
                    && this.q.valueOf() == other.q.valueOf());
        } else {
            return (this.value()==other.value());
        }
    }

    // Add to this rational another rational number and create new object.
    add(other) {
        var sum;
        if (other instanceof rational_number) {
        sum = new rational_number(this.p*other.q+other.p*this.q, this.q*other.q);
        } else if (isInt(other)) {
        sum = new rational_number(this.p+other*this.q, this.q);
        } else {
        sum = new _real_number_js__WEBPACK_IMPORTED_MODULE_0__.real_number(this.value() + other);
        }
        return(sum);
    }

    // Subtract from this rational another rational number and create new object.
    subtract(other) {
        var sum;
        if (other instanceof rational_number) {
            sum = new rational_number(this.p*other.q-other.p*this.q, this.q*other.q);
        } else if (isInt(other)) {
            sum = new rational_number(this.p-other*this.q, this.q);
        } else {
            sum = new _real_number_js__WEBPACK_IMPORTED_MODULE_0__.real_number(this.value() - other);
        }
        return(sum);
    }

    // Multiply this rational by another rational number and create new object.
    multiply(other) {
        var product;
        if (other instanceof rational_number) {
            product = new rational_number(this.p*other.p, this.q*other.q);
        } else if (isInt(other)) {
            product = new rational_number(this.p*other, this.q);
        } else {
            product = new _real_number_js__WEBPACK_IMPORTED_MODULE_0__.real_number(this.value() * other);
        }

        return(product);
    }

    // Divide this rational by another rational number and create new object.
    divide(other) {
        var product;
        if (other instanceof rational_number) {
            product = new rational_number(this.p*other.q, this.q*other.p);
        } else if (isInt(other)) {
            product = new rational_number(this.p, this.q*other);
        } else {
            product = new _real_number_js__WEBPACK_IMPORTED_MODULE_0__.real_number(this.value() / other);
        }

        return(product);
    }

    // Additive Inverse
    addInverse() {
        var inverse = new rational_number(-this.p, this.q);
        return(inverse);
    }

    // Multiplicative Inverse
    multInverse() {
        var inverse;
        if (this.p != 0) {
            inverse = new rational_number(this.q, this.p);
        } else {
            inverse = new _real_number_js__WEBPACK_IMPORTED_MODULE_0__.real_number(NaN);
        }
        return(inverse);
    }

    // Format the rational number as string.
    toString(leadSign) {
        if (typeof leadSign == 'undefined') {
            leadSign = false;
        }
        var str = (leadSign && this.p>0) ? '+' : '';
        if (isNaN(this.p)) {
            str = 'NaN';
        } else if (this.q == 1) {
            str = str + this.p;
        } else {
            str = str + this.p + '/' + this.q;
        }

        return(str);
    }

    // Format the rational number as TeX string.
    toTeX(leadSign) {
        if (typeof leadSign == 'undefined') {
            leadSign = false;
        }
        var str = (leadSign && this.p>0) ? '+' : '';
        if (isNaN(this.p)) {
            str = '\\mathrm{NaN}';
        } else if (this.q == 1) {
            str = str + this.p;
        } else {
            if (this.p < 0) {
                str = '-\\frac{' + -this.p + '}{' + this.q + '}';
            } else {
                str = str + '\\frac{' + this.p + '}{' + this.q + '}';
            }
        }

        return(str);
    }

    toMathML() {
        if (typeof leadSign == 'undefined') {
            leadSign = false;
        }
        var opAStr = "<cn>" + this.p + "</cn>",
            opBStr = "<cn>" + this.q + "</cn>";

        return("<cn>" + this.toString() + "</cn>");

        if (isNaN(this.p)) {
            str = "<cn>?</cn>";
        } else if (this.q == 1) {
            str = opAStr;
        } else {
            str = "<apply><divide/>"+opAStr+opBStr+"</apply>";
        }
    }
}





 





/***/ }),

/***/ 88640:
/*!*********************************************!*\
  !*** ../../../../../BTM/src/real_number.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   real_number: () => (/* binding */ real_number)
/* harmony export */ });
/*!
 * BTM JavaScript Library v@VERSION
 * https://github.com/dbrianwalton/BTM
 *
 * Copyright D. Brian Walton
 * Released under the MIT license (https://opensource.org/licenses/MIT)
 *
 * Date: @DATE
 */

/* *******************************
** Define a generic class to work numbers
******************************* */

class real_number {
    constructor(a) {
      if (typeof a === 'number' || a instanceof Number) {
        this.number = a;
      } else if (a instanceof real_number) {
        this.number = a.number;
      }
    }

    // Return a numerical value of the rational expression.
    value() {
        return this.number;
    }
    
    // Real numbers have no natural simplification, but declaring the method.
    simplify() {
    }

    equal(other) {
      if (typeof other === 'number') {
        other = new real_number(other);
      }
        return (this.value()==other.value());
    }

    // Add numbers.
    add(other) {
      if (typeof other === 'number') {
        other = new real_number(other);
      }
        var sum = new real_number(this.number + other.value());
        return(sum);
    }

    // Subtract this - other
    subtract(other) {
      if (typeof other === 'number') {
        other = new real_number(other);
      }
        var sum = new real_number(this.number - other.value());
        return(sum);
    }

    // Multiply this rational by another rational number and create new object.
    multiply(other) {
      if (typeof other === 'number') {
        other = new real_number(other);
      }
        var product = new real_number(this.number * other.value());
        return(product);
    }

    // Divide this rational by another rational number and create new object.
    divide(other) {
      if (typeof other === 'number') {
        other = new real_number(other);
      }
        var product;
        if (other.value != 0) {
            product = new real_number(this.number / other.value());
        } else {
            product = new real_number(NaN);
        }
        return(product);
    }

    // Additive Inverse
    addInverse() {
        var inverse = new real_number(-this.number);
        return(inverse);
    }

    // Multiplicative Inverse
    multInverse() {
        var inverse;
        if (this.number != 0) {
            inverse = new real_number(this.number);
        } else {
            inverse = new real_number(NaN);
        }
        return(inverse);
    }

    toString(leadSign) {
        if (typeof leadSign == 'undefined') {
            leadSign = false;
        }
        var str = (leadSign && this.number>0) ? '+' : '';
        if (isNaN(this.number)) {
            str = 'NaN';
        } else {
            str = str + Number(this.number.toFixed(10));
        }
  
        return(str);
    }
  
    // Format the rational number as TeX string.
    toTeX(leadSign) {
        if (typeof leadSign == 'undefined') {
            leadSign = false;
        }
        var str = (leadSign && this.number>0) ? '+' : '';
        if (isNaN(this.number)) {
            str = '\\mathrm{NaN}';
        } else {
            str = str + Number(this.toString(leadSign));
        }
        return(str);
    }

    // Format as a root MathML element.
    toMathML(leadSign) {
        return("<cn>" + this.toString() + "</cn>");
    }
}





 





/***/ }),

/***/ 64621:
/*!********************************************!*\
  !*** ../../../../../BTM/src/reductions.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   defaultProductReductions: () => (/* binding */ defaultProductReductions),
/* harmony export */   defaultReductions: () => (/* binding */ defaultReductions),
/* harmony export */   defaultSumReductions: () => (/* binding */ defaultSumReductions),
/* harmony export */   disableRule: () => (/* binding */ disableRule),
/* harmony export */   findMatchRules: () => (/* binding */ findMatchRules),
/* harmony export */   newRule: () => (/* binding */ newRule)
/* harmony export */ });
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BTM_root.js */ 84490);
/*!
 * menv JavaScript Library v@VERSION
 * https://github.com/dbrianwalton/menv
 *
 * Copyright D. Brian Walton
 * Released under the MIT license (https://opensource.org/licenses/MIT)
 *
 * Date: @DATE
 */

/* *********************************************************************************
**  Dealing with identities and reductions.
********************************************************************************* */



class Identity {
    constructor(refExpr, eqExpr, description, isValid, idNum) {
        this.refExpr = refExpr;
        this.eqExpr = eqExpr;
        this.description = description;
        this.isValid = isValid;
        this.isActive = true;
        this.idNum = idNum;
    }
}

class Match {
    constructor(testRule, bindings) {
        // Find unbound variables.
        var allVars = testRule.eqExpr.dependencies(),
            missVars = [];
        for (var j in allVars) {
            if (typeof bindings[allVars[j]] == 'undefined') {
                missVars.push(allVars[j]);
            }
        }
        for (var j in missVars) {
            bindings[missVars[j]] = "input"+(+j+1)+"";
        }
        var substExpr = testRule.eqExpr.compose(bindings);

        this.subTeX = substExpr.toTeX();
        this.subStr = substExpr.toString();
        this.name = testRule.description;
        if (substExpr.type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.binop && substExpr.valueType == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprValue.bool) {
            this.equation = testRule.refExpr.toTeX() + " \\iff " + testRule.eqExpr.toTeX();
        } else {
            this.equation = testRule.refExpr.toTeX() + "=" + testRule.eqExpr.toTeX();
        }
        this.bindings = bindings;
        this.numInputs = missVars.length;
        this.ruleID = testRule.idNum;
    }
}



function newRule(menv, reductionList, equation, description, isValid, useOneWay, constraints) {
    var exprFormulas = equation.split('==');
    if (exprFormulas.length != 2) {
        console.log("Invalid equation in identity list: " + equation);
    } else {
        for (var refID=0; refID <= 1; refID++) {
            if (refID == 1 && typeof useOneWay != 'undefined' && useOneWay) {
                break;
            }
            var identity;

            var refExpr = menv.parse(exprFormulas[refID],"formula");
            var eqExpr = menv.parse(exprFormulas[1-refID],"formula");
            var numVars = refExpr.dependencies().length;
            var allRefExpr = [exprFormulas[refID]];
            // this is a big slow down, so just make sure each rule is written in multiple ways.
            //      var allRefExpr = refExpr.allStringEquivs();

            var uniqueExpr = [];
            for (var i in allRefExpr) {
                var nextExpr = menv.parse(allRefExpr[i],"formula");
                var isNew = true;
                for (var j in uniqueExpr) {
                    var bindings = uniqueExpr[j].match(nextExpr, {});
                    if (bindings !== null) {
                        isNew = false;
                    }
                }
                if (isNew) {
                    var ruleID = reductionList.length+1;
                    identity = new Identity(nextExpr, eqExpr, description, isValid, ruleID);
                    reductionList.push(identity);
                    uniqueExpr.push(nextExpr);
                }
            }
        }
    }
}

// Disable a rule in the list.
function disableRule(menv, reductionList, equation) {
  // Match only on refExpr.
  var exprFormulas = equation.split('==');
  var refExpr, eqExpr;
  if (exprFormulas.length > 2) {
    console.log("Invalid equation in identity list: " + equation);
    return;
  } else {
    refExpr = menv.parse(exprFormulas[0],"formula");
  }
  for (var i in reductionList) {
    var testRule = reductionList[i];
    var bindings = testRule.refExpr.match(refExpr, {})
    if (bindings !== null) {
      reductionList[i].isActive = false;
    }
}
}

/* *******************
** Given a list of reduction rules and a given expression,
** test each reduction rule to see if it matches the structure.
** Create an array of new objects with bindings stating what
** substitutions are necessary to make the matches.
******************* */
function findMatchRules(reductionList, testExpr, doValidate) {
    var matchList = [];
    var i, testRule;
    for (i in reductionList) {
        testRule = reductionList[i];
        var bindings = testRule.refExpr.match(testExpr, {})
        if (testRule.isActive && bindings !== null) {
            var match = new Match(testRule, bindings);
            matchList.push(match);
        }
    }
    return(matchList);
}


function defaultReductions(menv) {
    var reduceRules = new Array();

    newRule(menv, reduceRules, '0+x==x', 'Additive Identity', true, true);
    newRule(menv, reduceRules, 'x+0==x', 'Additive Identity', true, true);
    newRule(menv, reduceRules, '0-x==-x', 'Additive Inverse', true, true);
    newRule(menv, reduceRules, 'x-0==x', 'Additive Identity', true, true);
    newRule(menv, reduceRules, '0*x==0', 'Multiply by Zero', true, true);
    newRule(menv, reduceRules, 'x*0==0', 'Multiply by Zero', true, true);
    newRule(menv, reduceRules, '1*x==x', 'Multiplicative Identity', true, true);
    newRule(menv, reduceRules, 'x*1==x', 'Multiplicative Identity', true, true);
    newRule(menv, reduceRules, '0/x==0', 'Multiply by Zero', true, true);
    newRule(menv, reduceRules, 'x/1==x', 'Divide by One', true, true);
    newRule(menv, reduceRules, 'x^1==x', 'First Power', true, true);
    newRule(menv, reduceRules, 'x^0==1', 'Zero Power', true, true);
    newRule(menv, reduceRules, 'x^(-a)==1/(x^a)', 'Negative Power', true, true);
    newRule(menv, reduceRules, '1^x==1', 'One to a Power', true, true);
    newRule(menv, reduceRules, '-1*x==-x', 'Multiplicative Identity', true, true);
    newRule(menv, reduceRules, 'x*-1==-x', 'Multiplicative Identity', true, true);
    newRule(menv, reduceRules, 'x-x==0', 'Additive Inverses Cancel', true, true);
    newRule(menv, reduceRules, 'x+-x==0', 'Additive Inverses Cancel', true, true);
    newRule(menv, reduceRules, '-x+x==0', 'Additive Inverses Cancel', true, true);
    newRule(menv, reduceRules, '(-x)+y==y-x', "Swap Leading Negative", true, true);
    newRule(menv, reduceRules, 'x+(-y)==x-y', "Subtraction", true, true);
    newRule(menv, reduceRules, '(-x)+(-y)==-(x+y)', "Factor Negation from Addition", true, true);
    newRule(menv, reduceRules, '(-x)-y==-(x+y)', "Factor Negation from Addition", true, true);
    newRule(menv, reduceRules, 'x-(-y)==x+y', "Additive Inverse's Inverse", true, true);
    newRule(menv, reduceRules, '(-x)*y==-(x*y)', "Factor Negation from Multiplication", true, true);
    newRule(menv, reduceRules, 'x*(-y)==-(x*y)', "Factor Negation from Multiplication", true, true);
    newRule(menv, reduceRules, '(-x)/y==-(x/y)', "Factor Negation from Multiplication", true, true);
    newRule(menv, reduceRules, 'x/(-y)==-(x/y)', "Factor Negation from Multiplication", true, true);
    newRule(menv, reduceRules, '-(-x)==x', "Additive Inverse's Inverse", true, true);
    newRule(menv, reduceRules, '/(/x)==x', "Multiplicative Inverse's Inverse", true, true);

    return(reduceRules);
}

function defaultSumReductions(menv) {
    var sumReductions = new Array();

    newRule(menv, sumReductions, 'a+0==a', 'Simplify Addition by Zero', true, true);
    newRule(menv, sumReductions, '0+a==a', 'Simplify Addition by Zero', true, true);
    newRule(menv, sumReductions, 'a-a==0', 'Cancel Additive Inverses', true, true);
    newRule(menv, sumReductions, 'a+-a==0', 'Cancel Additive Inverses', true, true);
    newRule(menv, sumReductions, '-a+a==0', 'Cancel Additive Inverses', true, true);
    newRule(menv, sumReductions, 'a*b+-a*b==0', 'Cancel Additive Inverses', true, true);
    newRule(menv, sumReductions, '-a*b+a*b==0', 'Cancel Additive Inverses', true, true);
    newRule(menv, sumReductions, 'a*(b+c)==a*b+a*c', 'Expand Products by Distributing', true, true);
    newRule(menv, sumReductions, '(a+b)*c==a*c+b*c', 'Expand Products by Distributing', true, true);
    newRule(menv, sumReductions, 'a*(b-c)==a*b-a*c', 'Expand Products by Distributing', true, true);
    newRule(menv, sumReductions, '(a-b)*c==a*c-b*c', 'Expand Products by Distributing', true, true);

    return(sumReductions);
}

function defaultProductReductions(menv) {
    var productReductions = new Array();

    newRule(menv, productReductions, '0*a==0', 'Simplify Multiplication by Zero', true, true);
    newRule(menv, productReductions, 'a*0==0', 'Simplify Multiplication by Zero', true, true);
    newRule(menv, productReductions, '1*a==a', 'Simplify Multiplication by One', true, true);
    newRule(menv, productReductions, 'a*1==a', 'Simplify Multiplication by One', true, true);
    newRule(menv, productReductions, 'a/a==1', 'Cancel Multiplicative Inverses', true, true);
    newRule(menv, productReductions, 'a*/a==1', 'Cancel Multiplicative Inverses', true, true);
    newRule(menv, productReductions, '/a*a==1', 'Cancel Multiplicative Inverses', true, true);
    newRule(menv, productReductions, '(a*b)/(a*c)==b/c', 'Cancel Common Factors', true,true);
    newRule(menv, productReductions, 'a^m/a^n==a^(m-n)', 'Cancel Common Factors', true,true);
    newRule(menv, productReductions, '(a^m*b)/(a^n*c)==(a^(m-n)*b)/c', 'Cancel Common Factors', true,true);
    newRule(menv, productReductions, 'a*a==a^2', 'Write Products of Common Terms as Powers', true, true);
    newRule(menv, productReductions, 'a*a^n==a^(n+1)', 'Write Products of Common Terms as Powers', true, true);
    newRule(menv, productReductions, 'a^n*a==a^(n+1)', 'Write Products of Common Terms as Powers', true, true);
    newRule(menv, productReductions, 'a^m*a^n==a^(m+n)', 'Write Products of Common Terms as Powers', true, true);
    newRule(menv, productReductions, '(a^-m*b)/c==b/(a^m*c)', 'Rewrite Using Positive Powers', true,true);
    newRule(menv, productReductions, '(b*a^-m)/c==b/(a^m*c)', 'Rewrite Using Positive Powers', true,true);
    newRule(menv, productReductions, 'b/(a^-m*c)==(a^m*b)/c', 'Rewrite Using Positive Powers', true,true);
    newRule(menv, productReductions, 'b/(c*a^-m)==(a^m*b)/c', 'Rewrite Using Positive Powers', true,true);

    return (productReductions);
  }

/***/ }),

/***/ 45306:
/*!*********************************************!*\
  !*** ../../../../../BTM/src/scalar_expr.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   scalar_expr: () => (/* binding */ scalar_expr)
/* harmony export */ });
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expression.js */ 53921);
/* harmony import */ var _real_number_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./real_number.js */ 88640);
/* harmony import */ var _rational_number_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./rational_number.js */ 34971);
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./BTM_root.js */ 84490);
/*!
 * BTM JavaScript Library v@VERSION
 * https://github.com/dbrianwalton/BTM
 *
 * Copyright D. Brian Walton
 * Released under the MIT license (https://opensource.org/licenses/MIT)
 *
 * Date: @DATE
 */

/* ***************************************************
* Define the Scalar Expression -- a numerical value
* *************************************************** */






class scalar_expr extends _expression_js__WEBPACK_IMPORTED_MODULE_0__.expression {
    constructor(menv, number) {
        super(menv);
        this.type = _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__.exprType.number;
        if (typeof number === "number" ||
                number instanceof Number) {
            if (Math.floor(number)==number) {
                this.number = new _rational_number_js__WEBPACK_IMPORTED_MODULE_2__.rational_number(number, 1);
            } else {
                this.number = new _real_number_js__WEBPACK_IMPORTED_MODULE_1__.real_number(number);
            }
        } else if (number instanceof _real_number_js__WEBPACK_IMPORTED_MODULE_1__.real_number) {
                this.number = number;
        } else if (number instanceof scalar_expr) {
            this.number = number.number;
        } else {
            console.log("Trying to instantiate a scalar_expr with a non-number object: " + number);
        }
        this.context = "number";
    }

    // Parsed representation.
    toString(elementOnly) {
        if (typeof elementOnly == 'undefined') {
            elementOnly = false;
        }
        return(this.number.toString());
    }
    
    // Display representation.
    toTeX(showSelect) {
        if (typeof showSelect == 'undefined') {
            showSelect = false;
        }
        var word = this.number.toTeX();
        if (showSelect && this.select) {
            word = "{\\color{red}" + word + "}";
        }
        return(word);
    }
    
    // MathML representation.
    toMathML() {
        return("<cn>" + this.toString() + "</cn>");
    }
    
    // Return an array containing all tested equivalent strings.
    allStringEquivs() {
        return([this.toString()]);
    }
    
    // Test if represents constant value.
    isConstant() {
        /*
        This could just use expression.prototype.constant, but use this
        because it ALWAYS is true for scalar_expr and does not need a check
        */
        return(true);
    }
    
    // Combine constants where possible
    simplifyConstants() {
        var retValue;
        if (!this.menv.options.negativeNumbers && this.number.p < 0) {
            var theNumber = this.number.multiply(-1);
            retValue = new unop_expr(this.menv, '-', new scalar_expr(this.menv, theNumber));
        } else {
            retValue = this;
        }
        return(retValue);
    }
    
    value() {
        return(this.number.value());
    }

    evaluate(bindings) {
        return(this.value());
    }
    
    copy() {
        return(new scalar_expr(this.menv, this.number));
    }
    
    compose(bindings) {
        return(new scalar_expr(this.menv, this.number));
    }
    
    derivative(ivar, varList) {
        return(new scalar_expr(this.menv, 0));
    }
    
    /*
        See expressions.prototype.match for explanation.
    
        A scalar might match a constant formula.
    */
    match(expr, bindings) {
        var retValue = null,
            testExpr = expr;
    
        // Special named constants can not match expressions.
        if (expr.isConstant() && expr.type != _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__.exprType.number) {
            var testExpr = expr.copy().simplifyConstants();
            if (this.toString() === testExpr.toString()) {
              retValue = bindings;
            }
        }
        else if (testExpr.type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__.exprType.number
                && this.number.equal(testExpr.number)) {
            retValue = bindings;
        }
    
        return(retValue);
    }    
}



/***/ }),

/***/ 72224:
/*!*******************************************!*\
  !*** ../../../../../BTM/src/unop_expr.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   unop_expr: () => (/* binding */ unop_expr)
/* harmony export */ });
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expression.js */ 53921);
/* harmony import */ var _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scalar_expr.js */ 45306);
/* harmony import */ var _binop_expr_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./binop_expr.js */ 66718);
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./BTM_root.js */ 84490);
/*!
 * BTM JavaScript Library v@VERSION
 * https://github.com/dbrianwalton/BTM
 *
 * Copyright D. Brian Walton
 * Released under the MIT license (https://opensource.org/licenses/MIT)
 *
 * Date: @DATE
 */

/* ***************************************************
* Define the Unary Expression -- defined by an operator and an input.
* *************************************************** */






class unop_expr extends _expression_js__WEBPACK_IMPORTED_MODULE_0__.expression {
    constructor(menv, op, input) {
        super(menv);
        this.type = _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__.exprType.unop;
        this.op = op;
        if (typeof input == 'undefined')
            input = new _expression_js__WEBPACK_IMPORTED_MODULE_0__.expression(menv);
        this.inputs = [input];
            input.parent = this;
        switch (op) {
            case '+':
                this.prec = _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__.opPrec.multdiv;
                break;
            case '-':
                this.prec = _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__.opPrec.multdiv;
                break;
            case '/':
                this.prec = _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__.opPrec.power;
                break;
            default:
                alert("Unknown unary operator: '"+op+"'.");
                break;
        }
    }

    toString() {
        var theStr;
        var opStr;

        if (typeof this.inputs[0] == 'undefined') {
            opStr = '?';
        } else {
            opStr = this.inputs[0].toString();
        }
        if ((this.inputs[0].type >= _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__.exprType.unop
                && this.inputs[0].prec < this.prec)
            || (this.inputs[0].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__.exprType.number
                && opStr.indexOf('/') >= 0
                && _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__.opPrec.multdiv <= this.prec)
            ) 
        {
            theStr = this.op + '(' + opStr + ')';
        } else {
            theStr = this.op + opStr;
        }

        return(theStr);
    }

    // Return an array containing all tested equivalent strings.
    allStringEquivs() {
        var allInputs = this.inputs[0].allStringEquivs();
        var retValue = [];

        for (var i in allInputs) {
            if (this.inputs[0].type >= _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__.exprType.unop && this.inputs[0].prec <= this.prec) {
                retValue[i] = this.op + '(' + allInputs[i] + ')';
            } else {
                retValue[i] = this.op + allInputs[i];
            }
        }

        return(retValue);
    }

    toTeX(showSelect) {
        var theStr;
        var opStr, theOp;

        if (typeof showSelect == 'undefined') {
            showSelect = false;
        }

        if (typeof this.inputs[0] == 'undefined') {
            opStr = '?';
        } else {
            opStr = this.inputs[0].toTeX(showSelect);
        }

        theOp = this.op;
        if (theOp == '/') {
            theOp = '\\div ';
            if (showSelect && this.select) {
                theStr = "{\\color{red}" + this.op + "}"
                                + '\\left({\\color{blue}' + opStr + '}\\right)';
            } else {
                theStr = '\\frac{1}{' + opStr + '}';
            }
        } else {
            if (showSelect && this.select) {
                theStr = "{\\color{red}" + this.op + "}"
                                + '\\left({\\color{blue}' + opStr + '}\\right)';
            } else if (this.inputs[0].type >= _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__.exprType.unop && this.inputs[0].prec <= this.prec
                && (this.inputs[0].type != _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__.exprType.unop || this.op != '-' || this.inputs[0].op != '/')) {
                theStr = theOp + '\\left(' + opStr + '\\right)';
            } else {
                theStr = theOp + opStr;
            }
        }
        return(theStr);
    }

    toMathML() {
        var theStr;
        var opStr;

        if (typeof this.inputs[0] == 'undefined') {
            opStr = '?';
        } else {
            opStr = this.inputs[0].toMathML();
        }
        switch (this.op) {
            case '+':
                theStr = opStr;
                break;
            case '-':
                theStr = "<apply><minus/>" + opStr + "</apply>";
                break;
            case '/':
                theStr = "<apply><divide/><cn>1</cn>" + opStr + "</apply>";
                break;
        }

        return(theStr);
    }

    operateToTeX() {
        var opString = this.op;

        if (opString === '/') {
            opString = '\\div';
        }

        return(opString);
    }

    evaluate(bindings) {
        var inputVal = this.inputs[0].evaluate(bindings);

        var retVal;
        if (inputVal == undefined) {
            return(undefined);
        }
        switch (this.op) {
            case '+':
                retVal = inputVal;
                break;
            case '-':
                retVal = -1*inputVal;
                break;
            case '/':
                // Even when divide by zero, we want to use this, since in the exception
                // we want the value to be Infinite and not undefined.
                retVal = 1/inputVal;
                break;
            default:
                alert("The unary operator '" + this.op + "' is not defined.");
                retVal = undefined;
                break;
        }
        return(retVal);
    }

    simplifyConstants() {
        var retVal;

        this.inputs[0] = this.inputs[0].simplifyConstants();
        this.inputs[0].parent = this;
        if (this.inputs[0].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__.exprType.number) {
            var theNumber = this.inputs[0].number;
            switch (this.op) {
                case '-':
                    if (this.menv.options.negativeNumbers) {
                    retVal = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, theNumber.addInverse());
                    } else {
                    retVal = this;
                    }
                    break;
                case '/':
                    retVal = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, theNumber.multInverse());
                    break;
            }
        } else {
            retVal = this;
        }
        return(retVal);
    }

    flatten() {
      return(new unop_expr(this.menv, this.op, this.inputs[0].flatten()));
    }

    copy() {
      return(new unop_expr(this.menv, this.op, this.inputs[0].copy()));
    }

    compose(bindings) {
        return(new unop_expr(this.menv, this.op, this.inputs[0].compose(bindings)));
    }

    derivative(ivar, varList) {
        var theDeriv;

        var uConst = this.inputs[0].isConstant();
        if (uConst) {
            theDeriv = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 0);
        } else {
            switch (this.op) {
                case '+':
                    theDeriv = this.inputs[0].derivative(ivar, varList);
                    break;
                case '-':
                    theDeriv = new unop_expr(this.menv, '-', this.inputs[0].derivative(ivar, varList));
                    break;
                case '/':
                    var denom = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_2__.binop_expr(this.menv, '*', this.inputs[0], this.inputs[0]);
                    theDeriv = new unop_expr(this.menv, '-', new _binop_expr_js__WEBPACK_IMPORTED_MODULE_2__.binop_expr(this.menv, '/', this.inputs[0].derivative(ivar, varList), denom));
                    break;
                default:
                    console.log("The derivative of the unary operator '" + this.op + "' is not defined.");
                    theDeriv = undefined;
                    break;
            }
        }
        return(theDeriv);
    }

    match(expr, bindings) {
        var retValue = null;

        // Special named constants can not match expressions.
        if (this.isConstant() && expr.isConstant()) {
            var newExpr = expr.simplifyConstants(),
                newThis = this.simplifyConstants();

            if (newExpr.toString() === newThis.toString()
                || newExpr.type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__.exprType.number && newThis.type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__.exprType.number
                    && newThis.number.equal(newExpr.number)) {
                retValue = bindings;
            }
        } else {
            retValue = _expression_js__WEBPACK_IMPORTED_MODULE_0__.expression.prototype.match.call(this, expr, bindings);
        }

        return(retValue);
    }
}


/***/ }),

/***/ 69082:
/*!***********************************************!*\
  !*** ../../../../../BTM/src/variable_expr.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   index_expr: () => (/* binding */ index_expr),
/* harmony export */   variable_expr: () => (/* binding */ variable_expr)
/* harmony export */ });
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expression.js */ 53921);
/* harmony import */ var _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scalar_expr.js */ 45306);
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BTM_root.js */ 84490);
/*!
 * BTM JavaScript Library v@VERSION
 * https://github.com/dbrianwalton/BTM
 *
 * Copyright D. Brian Walton
 * Released under the MIT license (https://opensource.org/licenses/MIT)
 *
 * Date: @DATE
 */

/* ***************************************************
* Define the Variable Expression -- a value defined by a name
* *************************************************** */




class variable_expr extends _expression_js__WEBPACK_IMPORTED_MODULE_0__.expression {
    constructor(menv, name) {
        super(menv);
        this.type = _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__.exprType.variable;
        this.name = name;

        // Count how many derivatives.
        var primePos = name.indexOf("'");
        this.derivs = 0;
        if (primePos > 0) {
            this.derivs = name.slice(primePos).length;
        }

        this.isConst = false;
        this.isSpecial = false;
        switch(this.name) {
            case 'e':
            case 'pi':
            case 'dne':
            case 'inf':
                this.isConst = true;
                this.isSpecial = true;
                break;
        }
    }

    toString(elementOnly) {
        if (typeof elementOnly == 'undefined') {
            elementOnly = false;
        }
        return(this.name);
    }

    // Return an array containing all tested equivalent strings.
    allStringEquivs() {
        return([this.toString()]);
    }

    toTeX(showSelect) {
        if (typeof showSelect == 'undefined') {
            showSelect = false;
        }
        var str = this.toString();

        switch (this.name) {
            case 'alpha':
            case 'beta':
            case 'gamma':
            case 'delta':
            case 'epsilon':
            case 'zeta':
            case 'eta':
            case 'theta':
            case 'kappa':
            case 'lambda':
            case 'mu':
            case 'nu':
            case 'xi':
            case 'pi':
            case 'rho':
            case 'sigma':
            case 'tau':
            case 'upsilon':
            case 'phi':
            case 'chi':
            case 'psi':
            case 'omega':
            case 'Gamma':
            case 'Delta':
            case 'Theta':
            case 'Lambda':
            case 'Xi':
            case 'Pi':
            case 'Sigma':
            case 'Upsilon':
            case 'Phi':
            case 'Psi':
            case 'Omega':
                str = '\\' + this.name;
                break;
            case 'inf':
                str = '\\infty';
                break;
            default:
                if (this.isSpecial) {
                    str = '\\mathrm{' + this.name + '}';
                }
                break;
        }
        if (this.name.indexOf("input")==0) {
            str = "\\boxed{\\dots?^{" + this.name.slice(5) + "}}";
        }

        if (showSelect && this.select) {
            str = "{\\color{red}" + str + "}";
        }
        return(str);
    }

    dependencies(forced) {
        var depArray = new Array();
        if (forced != undefined) {
            for (var i=0; i<forced.length; i++) {
                depArray.push(forced[i]);
            }
        }
        if (!this.isConst && depArray.indexOf(this.name) < 0) {
            depArray.push(this.name);
        }
        return(depArray);
    }

    /*
        A variable is constant only if referring to mathematical constants (e, pi)
    */
    isConstant() {
        return(this.isConst);
    }

    evaluate(bindings) {
        var retVal;

        if (bindings[this.name] == undefined) {
            switch(this.name) {
                case 'e':
                    retVal = Math.E;
                    break;
                case 'pi':
                    retVal = Math.PI;
                    break;
                case 'inf':
                    retVal = Infinity;
                    break;
                case 'dne':
                    retVal = Number.NaN;
                    break;
                default:
                    console.log("Variable evaluated without binding.")
                    break;
            }
        } else {
            if (typeof bindings[this.name].value === 'function') {
                retVal = bindings[this.name].value();
            } else {
                retVal = bindings[this.name];
            }
        }

        return(retVal);
    }

    copy() {
        return(new variable_expr(this.menv, this.name));
    }

    compose(bindings) {
        var retVal;

        if (bindings[this.name] == undefined) {
            retVal = new variable_expr(this.menv, this.name);
        } else {
            retVal = bindings[this.name];
        }

        return(retVal);
    }

    derivative(ivar, varList) {
        var retVal;
        var ivarName = (typeof ivar == 'string') ? ivar : ivar.name;

        if (this.name === ivarName) {
            retVal = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 1);

        // If either a constant or another independent variable, deriv=0
        } else if (this.isConst || varList && varList[this.name] != undefined) {
            retVal = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.menv, 0);

        // Presuming other variables are dependent variables.
        } else  {
            retVal = new variable_expr(this.menv, this.name+"'");
        }
        return(retVal);
    }

    /*
        See expressions.prototype.match for explanation.

        A variable can match any expression. But we need to check
        if the variable has already matched an expression. If so,
        it must be the same again.
    */
    match(expr, bindings) {
        var retValue = null;

        // Special named constants can not match expressions.
        if (this.isConst) {
            if (expr.toString() === this.name) {
                retValue = bindings;
            }

        // If never previously assigned, can match any expression.
        } else if (bindings != null && bindings[this.name] == undefined && expr.valueType == _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__.exprValue.numeric) {
            retValue = bindings;
            retValue[this.name] = expr.toString();
        } else if (bindings != null && bindings[this.name] == expr.toString()) {
            retValue = bindings;
        }

        return(retValue);
    }
}

    /* ***************************************************
    * Define the Index Expression -- a reference into a list
    * *************************************************** */

class index_expr {
    
    constructor(name, index) {
        this.type = _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__.exprType.variable;
        this.name = name;
        this.select = false;
        this.boundName = "[]"+name;
        this.parent = null;
        this.index = index;
        var depArray = index.dependencies();
        if (depArray.length > 1) {
            alert("An array reference can only have one index variable.");
        } else {
            this.k = depArray[0];
        }
    }

    toString(elementOnly) {
        if (typeof elementOnly == 'undefined') {
            elementOnly = false;
        }
        return(this.name + "[" + this.index.toString() + "]");
    }

    toTeX(showSelect) {
        if (typeof showSelect == 'undefined') {
            showSelect = false;
        }
        word = this.name + "_{" + this.index.toString() + "}";
        if (showSelect && this.select) {
            word = "{\\color{red}" + word + "}";
        }
        return(word);
    }

    toMathML() {
        return("<apply><selector/><ci type=\"vector\">" + this.name + "</ci>" + this.index.toString() + "</apply>");
    }

    dependencies(forced) {
        var depArray = new Array();
        if (forced != undefined) {
            for (var i=0; i<forced.length; i++) {
                depArray.push(forced[i]);
            }
        }
        switch(this.name) {
            default:
                depArray.push("row");
                depArray.push(this.boundName);
                break;
        }
        return(depArray);
    }

    evaluate(bindings) {
        var retVal;

        if (bindings[this.boundName] == undefined) {
            switch(this.name) {
                default:
                    retVal = undefined;
                    break;
            }
        } else {
            var tmpBind = {};
            if (this.k != undefined) {
                tmpBind[this.k] = bindings["row"];
            }
            var i = this.index.evaluate(tmpBind)-1;
            if (i >= 0 && i<bindings[this.boundName].length) {
                retVal = bindings[this.boundName][i];
            }
        }

        return(retVal);
    }
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LUJUTV9zcmNfQlRNX3Jvb3RfanMuYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUV5STtBQUMxRjtBQUNnQjtBQUNwQjtBQUNFO0FBQ0k7QUFDRTtBQUNOO0FBQ1o7QUFDWTs7QUFFdEM7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTyxvQkFBb0I7O0FBRXBCO0FBQ1A7QUFDQTs7QUFFQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QiwwREFBWTtBQUN4QywwQkFBMEIsc0RBQVU7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QiwyQ0FBRztBQUMxQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMkJBQTJCLGlFQUFpQjtBQUM1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QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUUrQztBQUNDOztBQUV6QztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLG1EQUFTO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixtREFBUztBQUNsQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQTBCLGlCQUFpQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGtCQUFrQixrQkFBa0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGtCQUFrQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQix3QkFBd0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLEtBQUs7QUFDL0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLDBCQUEwQjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLEtBQUs7QUFDL0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHVCQUF1QjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLHVCQUF1QjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLHVCQUF1QjtBQUNyRDtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsa0NBQWtDO0FBQ2hFO0FBQ0Esa0NBQWtDLHNDQUFzQztBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDhEQUFjO0FBQ25DO0FBQ0E7QUFDQSx5QkFBeUIsOERBQWM7QUFDdkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixzQkFBc0I7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdmdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUU0QztBQUNFO0FBQ0k7QUFDUjtBQUNFO0FBQ0o7O0FBRWpDLDRCQUE0QixzREFBVTtBQUM3QztBQUNBO0FBQ0Esb0JBQW9CLGtEQUFRO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsc0RBQVU7QUFDdEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLDREQUFhO0FBQ3hDO0FBQ0EsMEJBQTBCLGVBQWU7QUFDekMsZ0RBQWdELE1BQU07QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLFFBQVEsS0FBSyxzQkFBc0I7QUFDekU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsR0FBRztBQUN2QztBQUNBO0FBQ0Esb0NBQW9DLEdBQUc7QUFDdkM7QUFDQTtBQUNBLG9DQUFvQyxHQUFHO0FBQ3ZDO0FBQ0E7QUFDQSxvQ0FBb0MsR0FBRztBQUN2QztBQUNBO0FBQ0Esb0NBQW9DLEdBQUc7QUFDdkM7QUFDQTtBQUNBLG9DQUFvQyxHQUFHO0FBQ3ZDO0FBQ0E7QUFDQSxzQ0FBc0MsS0FBSztBQUMzQyxvQ0FBb0Msc0JBQXNCO0FBQzFEO0FBQ0E7QUFDQSxzQ0FBc0MsS0FBSztBQUMzQywwREFBMEQsc0JBQXNCO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLHNCQUFzQjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLEdBQUc7QUFDdkM7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLGtCQUFrQjtBQUM1RCxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2QsMkNBQTJDLGtCQUFrQjtBQUM3RDtBQUNBOztBQUVBO0FBQ0EsaUNBQWlDLEtBQUssa0JBQWtCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRCx3REFBd0Q7QUFDMUc7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLEdBQUc7QUFDdkM7QUFDQTtBQUNBLG9DQUFvQyxHQUFHO0FBQ3ZDO0FBQ0E7QUFDQSxvQ0FBb0MsR0FBRztBQUN2QztBQUNBO0FBQ0Esb0NBQW9DLEdBQUc7QUFDdkM7QUFDQTtBQUNBLG9DQUFvQyxHQUFHO0FBQ3ZDO0FBQ0E7QUFDQSxvQ0FBb0MsR0FBRztBQUN2QztBQUNBO0FBQ0Esc0NBQXNDLEtBQUs7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLEdBQUc7QUFDdkM7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLGtCQUFrQjtBQUM1RCxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2QsMkNBQTJDLGtCQUFrQjtBQUM3RDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLDREQUFhO0FBQ3hEO0FBQ0E7QUFDQSxzRUFBc0Usa0JBQWtCO0FBQ3hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsNERBQWE7QUFDaEQ7QUFDQTtBQUNBLDhEQUE4RCxrQkFBa0I7QUFDaEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLG1CQUFtQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJCQUEyQix3REFBVztBQUN0QyxVQUFVO0FBQ1Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxvREFBUztBQUM1QztBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsc0RBQVUsNkJBQTZCLHdEQUFXO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxvREFBUyxxQkFBcUIsc0RBQVU7QUFDM0U7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLHNEQUFVO0FBQzdDO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxvREFBUyxxQkFBcUIsc0RBQVUsNkJBQTZCLHdEQUFXO0FBQ25IO0FBQ0E7QUFDQSx5Q0FBeUMsc0RBQVUscUJBQXFCLHdEQUFXLG9CQUFvQixzREFBVSxxQ0FBcUMsd0RBQVc7QUFDakssbUNBQW1DLHNEQUFVLHFCQUFxQix3REFBVztBQUM3RTtBQUNBO0FBQ0EseUNBQXlDLHNEQUFVLHFCQUFxQix3REFBVyxvQkFBb0Isc0RBQVUscUNBQXFDLHdEQUFXO0FBQ2pLLG1DQUFtQyxzREFBVSxxQkFBcUIsd0RBQVc7QUFDN0U7QUFDQTtBQUNBLHdDQUF3QyxzREFBVSxxQ0FBcUMsd0RBQVc7QUFDbEcsbUNBQW1DLHNEQUFVLHFCQUFxQix3REFBVyxvQkFBb0Isc0RBQVUscUJBQXFCLHdEQUFXO0FBQzNJO0FBQ0E7QUFDQSx3Q0FBd0Msc0RBQVUscUNBQXFDLHdEQUFXO0FBQ2xHLHlDQUF5QyxzREFBVSw0QkFBNEIsd0RBQVc7QUFDMUYsbUNBQW1DLHNEQUFVLHFCQUFxQix3REFBVyxvQkFBb0Isc0RBQVU7QUFDM0c7QUFDQTtBQUNBLHdDQUF3QyxzREFBVSxxQ0FBcUMsd0RBQVc7QUFDbEcseUNBQXlDLHNEQUFVLDRCQUE0Qix3REFBVztBQUMxRixtQ0FBbUMsc0RBQVUscUJBQXFCLHdEQUFXLHFCQUFxQixzREFBVTtBQUM1RztBQUNBO0FBQ0Esd0NBQXdDLHNEQUFVLHFDQUFxQyx3REFBVztBQUNsRyxtQ0FBbUMsc0RBQVUscUJBQXFCLHdEQUFXLHFCQUFxQixzREFBVSxxQkFBcUIsd0RBQVc7QUFDNUk7QUFDQTtBQUNBLG1DQUFtQyxzREFBVSxxQkFBcUIsd0RBQVcsb0JBQW9CLHNEQUFVLHFCQUFxQix3REFBVztBQUMzSTtBQUNBO0FBQ0EsbUNBQW1DLHNEQUFVO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxzREFBVSxxQkFBcUIsd0RBQVc7QUFDN0U7QUFDQTtBQUNBLG1DQUFtQyxzREFBVSxxQkFBcUIsd0RBQVc7QUFDN0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRCxrREFBUTtBQUMxRDtBQUNBLGNBQWM7QUFDZDs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCLG1DQUFtQyxzREFBVTtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbG5CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUU0QztBQUNFO0FBQ0U7O0FBRXpDLDJCQUEyQixzREFBVTtBQUM1QztBQUNBO0FBQ0Esb0JBQW9CLGtEQUFRO0FBQzVCO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQSxnQ0FBZ0Msc0RBQVU7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsZ0RBQU07QUFDbEM7QUFDQTtBQUNBLDRCQUE0QixnREFBTTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQSw0Q0FBNEMsa0RBQVE7QUFDcEQ7QUFDQSwrQ0FBK0Msa0RBQVE7QUFDdkQ7QUFDQSwyQkFBMkIsZ0RBQU07QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0JBQXdCLFFBQVEsS0FBSztBQUNyQyx3QkFBd0I7QUFDeEIsdUJBQXVCLFFBQVEsSUFBSTtBQUNuQyx1QkFBdUI7QUFDdkIsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0Esa0RBQWtELGtEQUFRO0FBQzFEO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxrREFBUTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLGdCQUFnQixjQUFjOztBQUVuRSxrQkFBa0I7QUFDbEIsa0RBQWtELGtEQUFRO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0EsZ0RBQWdELGtEQUFRO0FBQ3hEO0FBQ0EsNEVBQTRFLGtEQUFRO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0Msa0RBQVE7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQix3REFBVztBQUN0QyxVQUFVO0FBQ1Y7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsc0JBQXNCO0FBQ3BELG9DQUFvQyxvQkFBb0I7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsd0RBQVc7QUFDekMsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxrREFBUTtBQUMvQztBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IscUJBQXFCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELHdEQUFXO0FBQzdEO0FBQ0E7QUFDQSwwREFBMEQsd0RBQVc7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQXlCLGtEQUFRO0FBQ2pDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSwwQkFBMEIsS0FBSztBQUMvQjtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQSxrQ0FBa0MseUJBQXlCO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCLHNEQUFVOztBQUVqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4QkFBOEIsS0FBSztBQUNuQztBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsU0FBUztBQUMvQztBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDJCQUEyQixzREFBVTtBQUNyQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMkJBQTJCLHdEQUFXO0FBQ3RDLFVBQVU7QUFDVjtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUIseUVBQXlFO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsd0RBQVc7QUFDdEMsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQy9lQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRXNEOztBQUV0RDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtkQUFrZCwrQkFBK0I7QUFDamY7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsNEJBQTRCLDBCQUEwQjtBQUN0RDtBQUNBLCtCQUErQjs7QUFFL0I7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQ0FBZ0M7O0FBRWhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlELE9BQU87QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDO0FBQ3pDO0FBQ0EsNkRBQTZEO0FBQzdEOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFGQUFxRjtBQUNyRjs7QUFFQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3Qiw0QkFBNEIsVUFBVSxRQUFRO0FBQzlDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsS0FBSztBQUNMOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZDQUE2QyxjQUFjO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBLG9EQUFvRDtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7QUFDQSxrQkFBa0IsS0FBSztBQUN2QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLG9CQUFvQixnRUFBZTtBQUNuQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixLQUFLO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFK0M7O0FBRS9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQSxDQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPLDhCQUE4Qix3REFBVztBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLFVBQVU7QUFDVixrQkFBa0Isd0RBQVc7QUFDN0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxVQUFVO0FBQ1Ysc0JBQXNCLHdEQUFXO0FBQ2pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWLDBCQUEwQix3REFBVztBQUNyQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxVQUFVO0FBQ1YsMEJBQTBCLHdEQUFXO0FBQ3JDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLDBCQUEwQix3REFBVztBQUNyQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsSUFBSTtBQUNoQyxVQUFVO0FBQ1Y7QUFDQSxVQUFVO0FBQ1Y7QUFDQSwrQkFBK0IsaUJBQWlCLGVBQWU7QUFDL0QsY0FBYztBQUNkLG9DQUFvQyxnQkFBZ0IsZUFBZTtBQUNuRTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQU1BOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsSUFBSTtBQUNoQyxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FBTUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUV5RDs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsa0RBQVEsaUNBQWlDLG1EQUFTO0FBQ2hGO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sMEJBQTBCLFlBQVk7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBbUU7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFEO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUEwRDtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR087QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFNEM7QUFDRTtBQUNRO0FBQ2Q7O0FB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REFBUztBQUN0RztBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQSxvQkFBb0Isa0RBQVE7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLDhCQUE4QjtBQUM1RDtBQUNBLHFCQUFxQixRQUFRLElBQUksYUFBYTtBQUM5QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixpQkFBaUI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uLi8uLi8uLi8uLi8uLi9CVE0vc3JjL0JUTV9yb290LmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi4vLi4vLi4vLi4vLi4vQlRNL3NyYy9iaW5vcF9leHByLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi4vLi4vLi4vLi4vLi4vQlRNL3NyYy9kZXJpdl9leHByLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi4vLi4vLi4vLi4vLi4vQlRNL3NyYy9leHByZXNzaW9uLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi4vLi4vLi4vLi4vLi4vQlRNL3NyYy9mdW5jdGlvbl9leHByLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi4vLi4vLi4vLi4vLi4vQlRNL3NyYy9tdWx0aW9wX2V4cHIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uLi8uLi8uLi8uLi8uLi9CVE0vc3JjL3JhbmRvbS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4uLy4uLy4uLy4uLy4uL0JUTS9zcmMvcmF0aW9uYWxfbnVtYmVyLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi4vLi4vLi4vLi4vLi4vQlRNL3NyYy9yZWFsX251bWJlci5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4uLy4uLy4uLy4uLy4uL0JUTS9zcmMvcmVkdWN0aW9ucy5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4uLy4uLy4uLy4uLy4uL0JUTS9zcmMvc2NhbGFyX2V4cHIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uLi8uLi8uLi8uLi8uLi9CVE0vc3JjL3Vub3BfZXhwci5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4uLy4uLy4uLy4uLy4uL0JUTS9zcmMvdmFyaWFibGVfZXhwci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEJUTSBKYXZhU2NyaXB0IExpYnJhcnkgdkBWRVJTSU9OXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGJyaWFud2FsdG9uL0JUTVxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKlxuKiogRXZhbHVhdGluZyBleHByZXNzaW9ucyBvY2N1cnMgaW4gdGhlIGNvbnRleHQgb2YgYSBCVE0gZW52aXJvbm1lbnQuXG4qKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmltcG9ydCB7IGRlZmF1bHRSZWR1Y3Rpb25zLCBkZWZhdWx0U3VtUmVkdWN0aW9ucywgZGVmYXVsdFByb2R1Y3RSZWR1Y3Rpb25zLCBkaXNhYmxlUnVsZSwgbmV3UnVsZSwgZmluZE1hdGNoUnVsZXMgfSBmcm9tIFwiLi9yZWR1Y3Rpb25zLmpzXCJcbmltcG9ydCB7IHNjYWxhcl9leHByIH0gZnJvbSBcIi4vc2NhbGFyX2V4cHIuanNcIjtcbmltcG9ydCB7IHZhcmlhYmxlX2V4cHIsIGluZGV4X2V4cHIgfSBmcm9tIFwiLi92YXJpYWJsZV9leHByLmpzXCI7XG5pbXBvcnQgeyB1bm9wX2V4cHIgfSBmcm9tIFwiLi91bm9wX2V4cHIuanNcIjtcbmltcG9ydCB7IGJpbm9wX2V4cHIgfSBmcm9tIFwiLi9iaW5vcF9leHByLmpzXCI7XG5pbXBvcnQgeyBtdWx0aW9wX2V4cHIgfSBmcm9tIFwiLi9tdWx0aW9wX2V4cHIuanNcIjtcbmltcG9ydCB7IGZ1bmN0aW9uX2V4cHIgfSBmcm9tIFwiLi9mdW5jdGlvbl9leHByLmpzXCI7XG5pbXBvcnQgeyBkZXJpdl9leHByIH0gZnJvbSBcIi4vZGVyaXZfZXhwci5qc1wiO1xuaW1wb3J0IHsgUk5HIH0gZnJvbSBcIi4vcmFuZG9tLmpzXCJcbmltcG9ydCB7IGV4cHJlc3Npb24gfSBmcm9tIFwiLi9leHByZXNzaW9uLmpzXCI7XG5cbmV4cG9ydCBjb25zdCBvcFByZWMgPSB7XG4gICAgZGlzajogMCxcbiAgICBjb25qOiAxLFxuICAgIGVxdWFsOiAyLFxuICAgIGFkZHN1YjogMyxcbiAgICBtdWx0ZGl2OiA0LFxuICAgIHBvd2VyOiA1LFxuICAgIGZjbjogNixcbiAgICBmb3A6IDdcbn07XG5cbmV4cG9ydCBjb25zdCBleHByVHlwZSA9IHtcbiAgICBudW1iZXI6IDAsXG4gICAgdmFyaWFibGU6IDEsXG4gICAgZmNuOiAyLFxuICAgIHVub3A6IDMsXG4gICAgYmlub3A6IDQsXG4gICAgbXVsdGlvcDogNSxcbiAgICBvcGVyYXRvcjogNixcbiAgICBhcnJheTogNyxcbiAgICBtYXRyaXg6IDhcbn07XG5cbmV4cG9ydCBjb25zdCBleHByVmFsdWUgPSB7IHVuZGVmOiAtMSwgYm9vbCA6IDAsIG51bWVyaWMgOiAxIH07XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1RlWChleHByKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBleHByLnRvVGVYID09PSBcImZ1bmN0aW9uXCIgPyBleHByLnRvVGVYKCkgOiBleHByO1xufVxuXG4vLyBDbGFzcyB0byBkZWZpbmUgcGFyc2luZyBhbmQgcmVkdWN0aW9uIHJ1bGVzLlxuZXhwb3J0IGNsYXNzIE1FTlYge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzKSB7XG4gICAgICAgIGlmIChzZXR0aW5ncyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXR0aW5ncyA9IHt9O1xuICAgICAgICAgICAgc2V0dGluZ3Muc2VlZCA9ICcxMjM0JztcbiAgICAgICAgfVxuICAgICAgICAvLyBFYWNoIGluc3RhbmNlIG9mIEJUTSBlbnZpcm9ubWVudCBuZWVkcyBiaW5kaW5ncyBhY3Jvc3MgYWxsIGV4cHJlc3Npb25zLlxuICAgICAgICB0aGlzLnJhbmRvbUJpbmRpbmdzID0ge307XG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSB7fTtcbiAgICAgICAgdGhpcy5mdW5jdGlvbnMgPSB7fTtcbiAgICAgICAgdGhpcy5vcFByZWMgPSBvcFByZWM7XG4gICAgICAgIHRoaXMuZXhwclR5cGUgPSBleHByVHlwZTtcbiAgICAgICAgdGhpcy5leHByVmFsdWUgPSBleHByVmFsdWU7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG5lZ2F0aXZlTnVtYmVyczogdHJ1ZSxcbiAgICAgICAgICAgIGFic1RvbDogMWUtOCxcbiAgICAgICAgICAgIHJlbFRvbDogMWUtNCxcbiAgICAgICAgICAgIHVzZVJlbEVycjogdHJ1ZSxcbiAgICAgICAgICAgIGRvRmxhdHRlbjogZmFsc2UgXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0UmVkdWN0aW9uUnVsZXMoKTtcbiAgICAgICAgdGhpcy5tdWx0aW9wX2V4cHIgPSBtdWx0aW9wX2V4cHI7XG4gICAgICAgIHRoaXMuYmlub3BfZXhwciA9IGJpbm9wX2V4cHI7XG5cbiAgICAgICAgLy8gR2VuZXJhdGUgYSByYW5kb20gZ2VuZXJhdG9yLiBXZSBtaWdodCBiZSBwYXNzZWQgZWl0aGVyIGEgcHJlLXNlZWRlZCBgcmFuZGAgZnVuY3Rpb24gb3IgYSBzZWVkIGZvciBvdXIgb3duLlxuICAgICAgICBsZXQgcm5nT3B0aW9ucyA9IHt9O1xuICAgICAgICBpZiAodHlwZW9mIHNldHRpbmdzLnJhbmQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBybmdPcHRpb25zLnJhbmQgPSBzZXR0aW5ncy5yYW5kO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0dGluZ3Muc2VlZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJuZ09wdGlvbnMuc2VlZCA9IHNldHRpbmdzLnNlZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcm5nT3B0aW9ucy5hYnNUb2wgPSB0aGlzLm9wdGlvbnMuYWJzVG9sO1xuICAgICAgICB0aGlzLnJuZyA9IG5ldyBSTkcocm5nT3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLy8gUGVyZm9ybSBhcHByb3hpbWF0ZSBjb21wYXJpc29uIHRlc3RzIHVzaW5nIGVudmlyb25tZW50IHNldHRpbmdzXG4gICAgLy8gYSA8IGI6IC0xXG4gICAgLy8gYSB+PSBiOiAwXG4gICAgLy8gYSA+IGI6IDFcbiAgICBudW1iZXJDbXAoYSxiLG92ZXJyaWRlKSB7XG4gICAgICAgIC8vIFdvcmsgd2l0aCBhY3R1YWwgdmFsdWVzLlxuICAgICAgICB2YXIgdmFsQSwgdmFsQiwgY21wUmVzdWx0O1xuICAgICAgICB2YXIgdXNlUmVsRXJyID0gdGhpcy5vcHRpb25zLnVzZVJlbEVycixcbiAgICAgICAgICAgIHJlbFRvbCA9IHRoaXMub3B0aW9ucy5yZWxUb2wsXG4gICAgICAgICAgICBhYnNUb2wgPSB0aGlzLm9wdGlvbnMuYWJzVG9sO1xuXG4gICAgICAgIGlmICh0eXBlb2YgYSA9PT0gJ251bWJlcicgfHwgdHlwZW9mIGEgPT09ICdOdW1iZXInKSB7XG4gICAgICAgICAgICB2YWxBID0gYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbEEgPSBhLnZhbHVlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBiID09PSAnbnVtYmVyJyB8fCB0eXBlb2YgYiA9PT0gJ051bWJlcicpIHtcbiAgICAgICAgICAgIHZhbEIgPSBiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsQiA9IGIudmFsdWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFB1bGwgb3V0IHRoZSBvcHRpb25zLlxuICAgICAgICBpZiAodHlwZW9mIG92ZXJyaWRlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvdmVycmlkZS51c2VSZWxFcnIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgdXNlUmVsRXJyID0gb3ZlcnJpZGUudXNlUmVsRXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvdmVycmlkZS5yZWxUb2wgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmVsVG9sID0gb3ZlcnJpZGUucmVsVG9sO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvdmVycmlkZS5hYnNUb2wgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgYWJzVG9sID0gb3ZlcnJpZGUuYWJzVG9sO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF1c2VSZWxFcnIgfHwgTWF0aC5hYnModmFsQSkgPCBhYnNUb2wpIHtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyh2YWxCLXZhbEEpIDwgYWJzVG9sKSB7XG4gICAgICAgICAgICAgICAgY21wUmVzdWx0ID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsQSA8IHZhbEIpIHtcbiAgICAgICAgICAgICAgICBjbXBSZXN1bHQgPSAtMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY21wUmVzdWx0ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyh2YWxCLXZhbEEpL01hdGguYWJzKHZhbEEpIDwgcmVsVG9sKSB7XG4gICAgICAgICAgICAgICAgY21wUmVzdWx0ID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsQSA8IHZhbEIpIHtcbiAgICAgICAgICAgICAgICBjbXBSZXN1bHQgPSAtMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY21wUmVzdWx0ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY21wUmVzdWx0O1xuICAgIH1cblxuICAgIC8qIEJsb2NrIG9mIG1ldGhvZHMgdG8gZGVhbCB3aXRoIHJlZHVjdGlvbiBydWxlcyBpbiBjb250ZXh0ICovXG4gICAgc2V0UmVkdWN0aW9uUnVsZXMoKSB7XG4gICAgICAgIHRoaXMucmVkdWNlUnVsZXMgPSBkZWZhdWx0UmVkdWN0aW9ucyh0aGlzKTtcbiAgICB9XG5cbiAgICBhZGRSZWR1Y3Rpb25SdWxlKGVxdWF0aW9uLCBkZXNjcmlwdGlvbiwgdXNlT25lV2F5KSB7XG4gICAgICAgIG5ld1J1bGUodGhpcywgdGhpcy5yZWR1Y2VSdWxlcywgZXF1YXRpb24sIGRlc2NyaXB0aW9uLCB0cnVlLCB1c2VPbmVXYXkpO1xuICAgIH1cblxuICAgIGRpc2FibGVSZWR1Y3Rpb25SdWxlKGVxdWF0aW9uKSB7XG4gICAgICAgIGRpc2FibGVSdWxlKHRoaXMsIHRoaXMucmVkdWNlUnVsZXMsIGVxdWF0aW9uKTtcbiAgICB9XG5cbiAgICBhZGRSdWxlKHJ1bGVMaXN0LCBlcXVhdGlvbiwgZGVzY3JpcHRpb24sIHVzZU9uZVdheSl7XG4gICAgICAgIG5ld1J1bGUodGhpcywgcnVsZUxpc3QsIGVxdWF0aW9uLCBkZXNjcmlwdGlvbiwgdHJ1ZSwgdXNlT25lV2F5KTtcbiAgICB9XG5cbiAgICBmaW5kTWF0Y2hSdWxlcyhyZWR1Y3Rpb25MaXN0LCB0ZXN0RXhwciwgZG9WYWxpZGF0ZSkge1xuICAgICAgICByZXR1cm4gZmluZE1hdGNoUnVsZXMocmVkdWN0aW9uTGlzdCwgdGVzdEV4cHIsIGRvVmFsaWRhdGUpO1xuICAgIH1cblxuICAgIGdlbmVyYXRlUmFuZG9tKGRpc3RyLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBybmRWYWwsIHJuZFNjYWxhcjtcblxuICAgICAgICBzd2l0Y2ggKGRpc3RyKSB7XG4gICAgICAgICAgICBjYXNlICdkaXNjcmV0ZSc6XG4gICAgICAgICAgICAgICAgbGV0IG1pbiA9IG9wdGlvbnMubWluO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWluLnZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IG1pbi52YWx1ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgbWF4ID0gb3B0aW9ucy5tYXg7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtYXgudmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gbWF4LnZhbHVlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBieSA9IG9wdGlvbnMuYnk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBieS52YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBieSA9IGJ5LnZhbHVlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBub256ZXJvID0gb3B0aW9ucy5ub256ZXJvID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJuZFZhbCA9IHRoaXMucm5nLnJhbmREaXNjcmV0ZShtaW4sbWF4LGJ5LG5vbnplcm8pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJuZFNjYWxhciA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLCBybmRWYWwpO1xuICAgICAgICByZXR1cm4gcm5kU2NhbGFyO1xuICAgIH1cblxuICAgIGFkZEZ1bmN0aW9uKG5hbWUsIGlucHV0LCBleHByZXNzaW9uKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgaW5wdXQgPSBcInhcIjtcbiAgICAgICAgfVxuICAgICAgICAvLyBObyBleHByZXNzaW9uPyBNYWtlIGl0IHJhbmRvbS5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgICAgICAgICB2YXIgZm9ybXVsYSA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLCB0aGlzLnJuZy5yYW5kUmF0aW9uYWwoWy0yMCwyMF0sWzEsMTVdKSk7XG4gICAgICAgICAgICB2YXIgbmV3VGVybTtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MTsgaTw9NjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1Rlcm0gPSB0aGlzLnBhcnNlKFwic2luKFwiK2krXCIqXCIraW5wdXRbMF0rXCIpXCIsIFwiZm9ybXVsYVwiKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaj0xOyBqPGlucHV0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdUZXJtID0gbmV3IGJpbm9wX2V4cHIodGhpcywgXCIqXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZShcInNpbihcIitpK1wiKlwiK2lucHV0W2pdK1wiKVwiLCBcImZvcm11bGFcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3VGVybVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1Rlcm0gPSB0aGlzLnBhcnNlKFwic2luKFwiK2krXCIqXCIraW5wdXQrXCIpXCIsIFwiZm9ybXVsYVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbmV3VGVybSA9IG5ldyBiaW5vcF9leHByKHRoaXMsIFwiKlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgc2NhbGFyX2V4cHIodGhpcywgdGhpcy5ybmcucmFuZFJhdGlvbmFsKFstMjAsMjBdLFsxLDEwXSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdUZXJtKTtcbiAgICAgICAgICAgICAgICBmb3JtdWxhID0gbmV3IGJpbm9wX2V4cHIodGhpcywgXCIrXCIsIGZvcm11bGEsIG5ld1Rlcm0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXhwcmVzc2lvbiA9IGZvcm11bGE7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZ1bmN0aW9uRW50cnkgPSB7fTtcbiAgICAgICAgZnVuY3Rpb25FbnRyeVtcImlucHV0XCJdID0gaW5wdXQ7XG4gICAgICAgIGZ1bmN0aW9uRW50cnlbXCJ2YWx1ZVwiXSA9IGV4cHJlc3Npb247XG4gICAgICAgIHRoaXMuZnVuY3Rpb25zW25hbWVdID0gZnVuY3Rpb25FbnRyeTtcbiAgICB9XG5cbiAgICBjb21wYXJlTWF0aE9iamVjdHMoZXhwcjEsIGV4cHIyKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZXhwcjEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBleHByMSA9IHRoaXMucGFyc2UoZXhwcjEsIFwiZm9ybXVsYVwiKVxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZXhwcjIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBleHByMiA9IHRoaXMucGFyc2UoZXhwcjIsIFwiZm9ybXVsYVwiKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoZXhwcjEuY29tcGFyZShleHByMikpO1xuICAgIH1cblxuICAgIGdldFBhcnNlcihjb250ZXh0KSB7XG4gICAgICAgIHZhciBzZWxmPXRoaXMsXG4gICAgICAgICAgICBwYXJzZUNvbnRleHQ9Y29udGV4dDtcbiAgICAgICAgcmV0dXJuIChmdW5jdGlvbihleHByU3RyaW5nKXsgcmV0dXJuIHNlbGYucGFyc2UoZXhwclN0cmluZywgcGFyc2VDb250ZXh0KTsgfSlcbiAgICB9XG4gXG4gIC8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICBwYXJzZSgpIGlzIHRoZSB3b3JraG9yc2UuXG5cbiAgICAgIFRha2UgYSBzdHJpbmcgcmVwcmVzZW50aW5nIGEgZm9ybXVsYSwgYW5kIGRlY29tcG9zZSBpdCBpbnRvIGFuIGFwcHJvcHJpYXRlXG4gICAgICB0cmVlIHN0cnVjdHVyZSBzdWl0YWJsZSBmb3IgcmVjdXJzaXZlIGV2YWx1YXRpb24gb2YgdGhlIGZ1bmN0aW9uLlxuICAgICAgUmV0dXJucyB0aGUgcm9vdCBlbGVtZW50IHRvIHRoZSB0cmVlLlxuICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICBwYXJzZShmb3JtdWxhU3RyLCBjb250ZXh0LCBiaW5kaW5ncywgb3B0aW9ucykge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgICBjb250ZXh0ID0gXCJmb3JtdWxhXCI7XG4gICAgfVxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykge1xuICAgICAgYmluZGluZ3MgPSB7fTtcbiAgICB9XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCA0KSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgY29uc3QgbnVtYmVyTWF0Y2ggPSAvXFxkfChcXC5cXGQpLztcbiAgICBjb25zdCBuYW1lTWF0Y2ggPSAvW2EtekEtWl0vO1xuICAgIGNvbnN0IHVub3BNYXRjaCA9IC9bXFwrXFwtL10vO1xuICAgIGNvbnN0IG9wTWF0Y2ggPSAvW1xcK1xcLSovXj1cXCQmXS87XG5cbiAgICB2YXIgY2hhclBvcyA9IDAsIGVuZFBvcztcbiAgICB2YXIgcGFyc2VFcnJvciA9ICcnO1xuXG4gICAgLy8gU3RyaXAgYW55IGV4dHJhbmVvdXMgd2hpdGUgc3BhY2UgYW5kIHBhcmVudGhlc2VzLlxuICAgIHZhciB3b3JraW5nU3RyO1xuICAgIHdvcmtpbmdTdHIgPSBmb3JtdWxhU3RyLnRyaW0oKTtcblxuICAgIC8vIFRlc3QgaWYgcGFyZW50aGVzZXMgYXJlIGFsbCBiYWxhbmNlZC5cbiAgICB2YXIgaGFzRXh0cmFQYXJlbnMgPSB0cnVlO1xuICAgIHdoaWxlIChoYXNFeHRyYVBhcmVucykge1xuICAgICAgaGFzRXh0cmFQYXJlbnMgPSBmYWxzZTtcbiAgICAgIGlmICh3b3JraW5nU3RyLmNoYXJBdCgwKSA9PSAnKCcpIHtcbiAgICAgICAgdmFyIGVuZEV4cHIgPSBjb21wbGV0ZVBhcmVudGhlc2lzKHdvcmtpbmdTdHIsIDApO1xuICAgICAgICBpZiAoZW5kRXhwcisxID49IHdvcmtpbmdTdHIubGVuZ3RoKSB7XG4gICAgICAgICAgaGFzRXh0cmFQYXJlbnMgPSB0cnVlO1xuICAgICAgICAgIHdvcmtpbmdTdHIgPSB3b3JraW5nU3RyLnNsaWNlKDEsLTEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gV2UgYnVpbGQgdGhlIHRyZWUgYXMgaXQgaXMgcGFyc2VkLiBcbiAgICAvLyBUd28gc3RhY2tzIGtlZXAgdHJhY2sgb2Ygb3BlcmFuZHMgKGV4cHJlc3Npb25zKSBhbmQgb3BlcmF0b3JzXG4gICAgLy8gd2hpY2ggd2Ugd2lsbCBpZGVudGlmeSBhcyB0aGUgc3RyaW5nIGlzIHBhcnNlZCBsZWZ0IHRvIHJpZ2h0XG4gICAgLy8gQXQgdGhlIHRpbWUgYW4gb3BlcmFuZCBpcyBwYXJzZWQsIHdlIGRvbid0IGtub3cgdG8gd2hpY2ggb3BlcmF0b3IgXG4gICAgLy8gaXQgdWx0aW1hdGVseSBiZWxvbmdzLCBzbyB3ZSBwdXNoIGl0IG9udG8gYSBzdGFjayB1bnRpbCB3ZSBrbm93LlxuICAgIHZhciBvcGVyYW5kU3RhY2sgPSBuZXcgQXJyYXkoKTtcbiAgICB2YXIgb3BlcmF0b3JTdGFjayA9IG5ldyBBcnJheSgpO1xuXG4gICAgLy8gV2hlbiBhbiBvcGVyYXRvciBpcyBwdXNoZWQsIHdlIHdhbnQgdG8gY29tcGFyZSBpdCB0byB0aGUgcHJldmlvdXMgb3BlcmF0b3JcbiAgICAvLyBhbmQgc2VlIGlmIHdlIG5lZWQgdG8gYXBwbHkgdGhlIG9wZXJhdG9ycyB0byBzb21lIG9wZXJhbmRzLlxuICAgIC8vIFRoaXMgaXMgYmFzZWQgb24gb3BlcmF0b3IgcHJlY2VkZW5jZSAob3JkZXIgb2Ygb3BlcmF0aW9ucykuXG4gICAgLy8gQW4gZW1wdHkgbmV3T3AgbWVhbnMgdG8gZmluaXNoIHJlc29sdmUgdGhlIHJlc3Qgb2YgdGhlIHN0YWNrcy5cbiAgICBmdW5jdGlvbiByZXNvbHZlT3BlcmF0b3IobWVudiwgb3BlcmF0b3JTdGFjaywgb3BlcmFuZFN0YWNrLCBuZXdPcCkge1xuICAgICAgLy8gVGVzdCBpZiB0aGUgb3BlcmF0b3IgaGFzIGxvd2VyIHByZWNlZGVuY2UuXG4gICAgICB2YXIgb2xkT3AgPSAwO1xuICAgICAgd2hpbGUgKG9wZXJhdG9yU3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICBvbGRPcCA9IG9wZXJhdG9yU3RhY2sucG9wKCk7XG4gICAgICAgIGlmIChuZXdPcCAmJiAobmV3T3AudHlwZT09ZXhwclR5cGUudW5vcCB8fCBvbGRPcC5wcmVjIDwgbmV3T3AucHJlYykpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVG8gZ2V0IGhlcmUsIHRoZSBuZXcgb3BlcmF0b3IgbXVzdCBiZSAqYmluYXJ5KlxuICAgICAgICAvLyBhbmQgdGhlIG9wZXJhdG9yIHRvIHRoZSBsZWZ0IGhhcyAqaGlnaGVyKiBwcmVjZWRlbmNlLlxuICAgICAgICAvLyBTbyB3ZSBuZWVkIHRvIHBlZWwgb2ZmIHRoZSBvcGVyYXRvciB0byB0aGUgbGVmdCB3aXRoIGl0cyBvcGVyYW5kc1xuICAgICAgICAvLyB0byBmb3JtIGFuIGV4cHJlc3Npb24gYXMgYSBuZXcgY29tcG91bmQgb3BlcmFuZCBmb3IgdGhlIG5ldyBvcGVyYXRvci5cbiAgICAgICAgdmFyIG5ld0V4cHI7XG4gICAgICAgIC8vIFVuYXJ5OiBFaXRoZXIgbmVnYXRpdmUgb3IgcmVjaXByb2NhbCByZXF1aXJlICpvbmUqIG9wZXJhbmRcbiAgICAgICAgaWYgKG9sZE9wLnR5cGUgPT0gZXhwclR5cGUudW5vcCkge1xuICAgICAgICAgIGlmIChvcGVyYW5kU3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIGlucHV0ID0gb3BlcmFuZFN0YWNrLnBvcCgpO1xuXG4gICAgICAgICAgICAvLyBEZWFsIHdpdGggbmVnYXRpdmUgbnVtYmVycyBzZXBhcmF0ZWx5LlxuICAgICAgICAgICAgaWYgKG1lbnYub3B0aW9ucy5uZWdhdGl2ZU51bWJlcnMgJiYgaW5wdXQudHlwZSA9PSBleHByVHlwZS5udW1iZXIgJiYgb2xkT3Aub3AgPT0gJy0nKSB7XG4gICAgICAgICAgICAgIG5ld0V4cHIgPSBuZXcgc2NhbGFyX2V4cHIobWVudiwgaW5wdXQubnVtYmVyLm11bHRpcGx5KC0xKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBuZXdFeHByID0gbmV3IHVub3BfZXhwcihtZW52LCBvbGRPcC5vcCwgaW5wdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdFeHByID0gbmV3IGV4cHJlc3Npb24obWVudik7XG4gICAgICAgICAgICBuZXdFeHByLnNldFBhcnNpbmdFcnJvcihcIkluY29tcGxldGUgZm9ybXVsYTogbWlzc2luZyB2YWx1ZSBmb3IgXCIgKyBvbGRPcC5vcCk7XG4gICAgICAgICAgfVxuICAgICAgICAvLyBCaW5hcnk6IFdpbGwgYmUgKnR3byogb3BlcmFuZHMuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG9wZXJhbmRTdGFjay5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICB2YXIgaW5wdXRCID0gb3BlcmFuZFN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgdmFyIGlucHV0QSA9IG9wZXJhbmRTdGFjay5wb3AoKTtcbiAgICAgICAgICAgIG5ld0V4cHIgPSBuZXcgYmlub3BfZXhwcihtZW52LCBvbGRPcC5vcCwgaW5wdXRBLCBpbnB1dEIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdFeHByID0gbmV3IGV4cHJlc3Npb24obWVudik7XG4gICAgICAgICAgICBuZXdFeHByLnNldFBhcnNpbmdFcnJvcihcIkluY29tcGxldGUgZm9ybXVsYTogbWlzc2luZyB2YWx1ZSBmb3IgXCIgKyBvbGRPcC5vcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG9wZXJhbmRTdGFjay5wdXNoKG5ld0V4cHIpO1xuICAgICAgICBvbGRPcCA9IDA7XG4gICAgICB9XG4gICAgICAvLyBUaGUgbmV3IG9wZXJhdG9yIGlzIHVuYXJ5IG9yIGhhcyBoaWdoZXIgcHJlY2VkZW5jZSB0aGFuIHRoZSBwcmV2aW91cyBvcC5cbiAgICAgIC8vIFdlIG5lZWQgdG8gcHVzaCB0aGUgb2xkIG9wZXJhdG9yIGJhY2sgb24gdGhlIHN0YWNrIHRvIHVzZSBsYXRlci5cbiAgICAgIGlmIChvbGRPcCAhPSAwKSB7XG4gICAgICAgIG9wZXJhdG9yU3RhY2sucHVzaChvbGRPcCk7XG4gICAgICB9XG4gICAgICAvLyBBIG5ldyBvcGVyYXRpb24gd2FzIGFkZGVkIHRvIGRlYWwgd2l0aCBsYXRlci5cbiAgICAgIGlmIChuZXdPcCkge1xuICAgICAgICBvcGVyYXRvclN0YWNrLnB1c2gobmV3T3ApO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5vdyB3ZSBiZWdpbiB0byBwcm9jZXNzIHRoZSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBleHByZXNzaW9uLlxuICAgIHZhciBsYXN0RWxlbWVudCA9IC0xLCBuZXdFbGVtZW50OyAvLyAwIGZvciBvcGVyYW5kLCAxIGZvciBvcGVyYXRvci5cblxuICAgIC8vIFJlYWQgc3RyaW5nIGxlZnQgdG8gcmlnaHQuXG4gICAgLy8gSWRlbnRpZnkgd2hhdCB0eXBlIG9mIG1hdGggb2JqZWN0IHN0YXJ0cyBhdCB0aGlzIGNoYXJhY3Rlci5cbiAgICAvLyBGaW5kIHRoZSBvdGhlciBlbmQgb2YgdGhhdCBvYmplY3QgYnkgY29tcGxldGlvbi5cbiAgICAvLyBJbnRlcnByZXQgdGhhdCBvYmplY3QsIHBvc3NpYmx5IHRocm91Z2ggYSByZWN1cnNpdmUgcGFyc2luZy5cbiAgICBmb3IgKGNoYXJQb3MgPSAwOyBjaGFyUG9zPHdvcmtpbmdTdHIubGVuZ3RoOyBjaGFyUG9zKyspIHtcbiAgICAgIC8vIElkZW50aWZ5IHRoZSBuZXh0IGVsZW1lbnQgaW4gdGhlIHN0cmluZy5cbiAgICAgIGlmICh3b3JraW5nU3RyLmNoYXJBdChjaGFyUG9zKSA9PSAnICcpIHtcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIC8vIEl0IG1pZ2h0IGJlIGEgY2xvc2UgcGFyZW50aGVzZXMgdGhhdCB3YXMgbm90IG1hdGNoZWQgb24gdGhlIGxlZnQuXG4gICAgICB9IGVsc2UgaWYgKHdvcmtpbmdTdHIuY2hhckF0KGNoYXJQb3MpID09ICcpJykge1xuICAgICAgICAvLyBUcmVhdCB0aGlzIGxpa2UgYW4gaW1wbGljaXQgb3BlbiBwYXJlbnRoZXNpcyBvbiB0aGUgbGVmdC5cbiAgICAgICAgcmVzb2x2ZU9wZXJhdG9yKHRoaXMsIG9wZXJhdG9yU3RhY2ssIG9wZXJhbmRTdGFjayk7XG4gICAgICAgIG5ld0VsZW1lbnQgPSAwO1xuICAgICAgICBsYXN0RWxlbWVudCA9IC0xO1xuXG4gICAgICAvLyBJdCBjb3VsZCBiZSBhbiBleHByZXNzaW9uIHN1cnJvdW5kZWQgYnkgcGFyZW50aGVzZXMgLS0gdXNlIHJlY3Vyc2lvblxuICAgICAgfSBlbHNlIGlmICh3b3JraW5nU3RyLmNoYXJBdChjaGFyUG9zKSA9PSAnKCcpIHtcbiAgICAgICAgZW5kUG9zID0gY29tcGxldGVQYXJlbnRoZXNpcyh3b3JraW5nU3RyLCBjaGFyUG9zKTtcbiAgICAgICAgdmFyIHN1YkV4cHJTdHIgPSB3b3JraW5nU3RyLnNsaWNlKGNoYXJQb3MrMSxlbmRQb3MpO1xuICAgICAgICB2YXIgc3ViRXhwciA9IHRoaXMucGFyc2Uoc3ViRXhwclN0ciwgY29udGV4dCwgYmluZGluZ3MpO1xuICAgICAgICBvcGVyYW5kU3RhY2sucHVzaChzdWJFeHByKTtcbiAgICAgICAgbmV3RWxlbWVudCA9IDA7XG4gICAgICAgIGNoYXJQb3MgPSBlbmRQb3M7XG5cbiAgICAgIC8vIEl0IGNvdWxkIGJlIGFuIGFic29sdXRlIHZhbHVlXG4gICAgICB9IGVsc2UgaWYgKHdvcmtpbmdTdHIuY2hhckF0KGNoYXJQb3MpID09ICd8Jykge1xuICAgICAgICBlbmRQb3MgPSBjb21wbGV0ZUFic1ZhbHVlKHdvcmtpbmdTdHIsIGNoYXJQb3MpO1xuICAgICAgICB2YXIgc3ViRXhwclN0ciA9IHdvcmtpbmdTdHIuc2xpY2UoY2hhclBvcysxLGVuZFBvcyk7XG4gICAgICAgIHZhciBzdWJFeHByID0gdGhpcy5wYXJzZShzdWJFeHByU3RyLCBjb250ZXh0LCBiaW5kaW5ncyk7XG4gICAgICAgIHZhciBuZXdFeHByID0gbmV3IGZ1bmN0aW9uX2V4cHIodGhpcywgJ2FicycsIHN1YkV4cHIpO1xuICAgICAgICBvcGVyYW5kU3RhY2sucHVzaChuZXdFeHByKTtcbiAgICAgICAgbmV3RWxlbWVudCA9IDA7XG4gICAgICAgIGNoYXJQb3MgPSBlbmRQb3M7XG5cbiAgICAgIC8vIEl0IGNvdWxkIGJlIGEgbnVtYmVyLiBKdXN0IHJlYWQgaXQgb2ZmXG4gICAgICB9IGVsc2UgaWYgKHdvcmtpbmdTdHIuc3Vic3RyKGNoYXJQb3MpLnNlYXJjaChudW1iZXJNYXRjaCkgPT0gMCkge1xuICAgICAgICBlbmRQb3MgPSBjb21wbGV0ZU51bWJlcih3b3JraW5nU3RyLCBjaGFyUG9zLCBvcHRpb25zKTtcbiAgICAgICAgdmFyIG5ld0V4cHIgPSBuZXcgc2NhbGFyX2V4cHIodGhpcywgbmV3IE51bWJlcih3b3JraW5nU3RyLnNsaWNlKGNoYXJQb3MsIGVuZFBvcykpKTtcbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5ub0RlY2ltYWxzICYmIHdvcmtpbmdTdHIuY2hhckF0KGNoYXJQb3MpID09ICcuJykge1xuICAgICAgICAgIG5ld0V4cHIuc2V0UGFyc2luZ0Vycm9yKFwiV2hvbGUgbnVtYmVycyBvbmx5LiBObyBkZWNpbWFsIHZhbHVlcyBhcmUgYWxsb3dlZC5cIilcbiAgICAgICAgfVxuICAgICAgICBvcGVyYW5kU3RhY2sucHVzaChuZXdFeHByKTtcbiAgICAgICAgbmV3RWxlbWVudCA9IDA7XG4gICAgICAgIGNoYXJQb3MgPSBlbmRQb3MtMTtcblxuICAgICAgLy8gSXQgY291bGQgYmUgYSBuYW1lLCBlaXRoZXIgYSBmdW5jdGlvbiBvciB2YXJpYWJsZS5cbiAgICAgIH0gZWxzZSBpZiAod29ya2luZ1N0ci5zdWJzdHIoY2hhclBvcykuc2VhcmNoKG5hbWVNYXRjaCkgPT0gMCkge1xuICAgICAgICBlbmRQb3MgPSBjb21wbGV0ZU5hbWUod29ya2luZ1N0ciwgY2hhclBvcyk7XG4gICAgICAgIHZhciB0aGVOYW1lID0gd29ya2luZ1N0ci5zbGljZShjaGFyUG9zLGVuZFBvcyk7XG4gICAgICAgIC8vIElmIG5vdCBhIGtub3duIG5hbWUsIGJyZWFrIGl0IGRvd24gdXNpbmcgY29tcG9zaXRlIGlmIHBvc3NpYmxlLlxuICAgICAgICBpZiAoYmluZGluZ3NbdGhlTmFtZV09PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgLy8gUmV0dXJucyB0aGUgZmlyc3Qga25vd24gbmFtZSwgb3IgdGhlTmFtZSBub3QgY29tcG9zaXRlLlxuICAgICAgICAgIHZhciB0ZXN0UmVzdWx0cyA9IFRlc3ROYW1lSXNDb21wb3NpdGUodGhlTmFtZSwgYmluZGluZ3MpO1xuICAgICAgICAgIGlmICh0ZXN0UmVzdWx0cy5pc0NvbXBvc2l0ZSkge1xuICAgICAgICAgICAgdGhlTmFtZSA9IHRlc3RSZXN1bHRzLm5hbWU7XG4gICAgICAgICAgICBlbmRQb3MgPSBjaGFyUG9zICsgdGhlTmFtZS5sZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFRlc3QgaWYgYSBmdW5jdGlvbi5cbiAgICAgICAgLy8gRXhwYW5kIHRoaXMgb25jZSB3ZSBhbGxvdyBwYXJzaW5nIG9mIHVzZXItZGVmaW5lZCBmdW5jdGlvbnMuXG4gICAgICAgIGlmICh3b3JraW5nU3RyLmNoYXJBdChlbmRQb3MpID09ICcoJyAmJiBcbiAgICAgICAgICAgIChiaW5kaW5nc1t0aGVOYW1lXT09PXVuZGVmaW5lZCkpIHtcbiAgICAgICAgICB2YXIgZW5kUGFyZW4gPSBjb21wbGV0ZVBhcmVudGhlc2lzKHdvcmtpbmdTdHIsIGVuZFBvcyk7XG5cbiAgICAgICAgICB2YXIgZmNuTmFtZSA9IHRoZU5hbWU7XG4gICAgICAgICAgdmFyIG5ld0V4cHI7XG4gICAgICAgICAgLy8gU2VlIGlmIHRoaXMgaXMgYSBkZXJpdmF0aXZlXG4gICAgICAgICAgaWYgKGZjbk5hbWUgPT0gJ0QnKSB7XG4gICAgICAgICAgICB2YXIgZXhwciwgaXZhciwgaXZhclZhbHVlO1xuICAgICAgICAgICAgdmFyIGVudHJpZXMgPSB3b3JraW5nU3RyLnNsaWNlKGVuZFBvcysxLGVuZFBhcmVuKS5zcGxpdChcIixcIik7XG4gICAgICAgICAgICBleHByID0gdGhpcy5wYXJzZShlbnRyaWVzWzBdLCBjb250ZXh0LCBiaW5kaW5ncyk7XG4gICAgICAgICAgICBpZiAoZW50cmllcy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICBuZXdFeHByID0gbmV3IGRlcml2X2V4cHIodGhpcywgZXhwciwgJ3gnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGl2YXIgPSB0aGlzLnBhcnNlKGVudHJpZXNbMV0sIGNvbnRleHQsIGJpbmRpbmdzKTtcbiAgICAgICAgICAgICAgLy8gRChmKHgpLHgsYykgbWVhbnMgZicoYylcbiAgICAgICAgICAgICAgaWYgKGVudHJpZXMubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgICAgIGl2YXJWYWx1ZSA9IHRoaXMucGFyc2UoZW50cmllc1syXSwgY29udGV4dCwgYmluZGluZ3MpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG5ld0V4cHIgPSBuZXcgZGVyaXZfZXhwcih0aGlzLCBleHByLCBpdmFyLCBpdmFyVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgc3ViRXhwciA9IHRoaXMucGFyc2Uod29ya2luZ1N0ci5zbGljZShlbmRQb3MrMSxlbmRQYXJlbiksIGNvbnRleHQsIGJpbmRpbmdzKTtcbiAgICAgICAgICAgIG5ld0V4cHIgPSBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLCB0aGVOYW1lLCBzdWJFeHByKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgb3BlcmFuZFN0YWNrLnB1c2gobmV3RXhwcik7XG4gICAgICAgICAgbmV3RWxlbWVudCA9IDA7XG4gICAgICAgICAgY2hhclBvcyA9IGVuZFBhcmVuO1xuICAgICAgICB9XG4gICAgICAgIC8vIG9yIGEgdmFyaWFibGUuXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIC8vIFRlc3QgaWYgbmVlZHMgaW5kZXhcbiAgICAgICAgICBpZiAod29ya2luZ1N0ci5jaGFyQXQoZW5kUG9zKSA9PSAnWycpIHtcbiAgICAgICAgICAgIHZhciBlbmRQYXJlbiwgaGFzRXJyb3I9ZmFsc2U7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBlbmRQYXJlbiA9IGNvbXBsZXRlQnJhY2tldCh3b3JraW5nU3RyLCBlbmRQb3MsIHRydWUpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgcGFyc2VFcnJvciA9IGVycm9yO1xuICAgICAgICAgICAgICBoYXNFcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgIGVuZFBhcmVuID0gZW5kUG9zKzE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaW5kZXhFeHByID0gdGhpcy5wYXJzZSh3b3JraW5nU3RyLnNsaWNlKGVuZFBvcysxLGVuZFBhcmVuKSwgY29udGV4dCwgYmluZGluZ3MpO1xuICAgICAgICAgICAgdmFyIG5ld0V4cHIgPSBuZXcgaW5kZXhfZXhwcih0aGlzLCB0aGVOYW1lLCBpbmRleEV4cHIpO1xuICAgICAgICAgICAgaWYgKGhhc0Vycm9yKSB7XG4gICAgICAgICAgICAgIG5ld0V4cHIuc2V0UGFyc2luZ0Vycm9yKHBhcnNlRXJyb3IpO1xuICAgICAgICAgICAgICBwYXJzZUVycm9yID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wZXJhbmRTdGFjay5wdXNoKG5ld0V4cHIpO1xuICAgICAgICAgICAgbmV3RWxlbWVudCA9IDA7XG4gICAgICAgICAgICBjaGFyUG9zID0gZW5kUGFyZW47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBuZXdFeHByID0gbmV3IHZhcmlhYmxlX2V4cHIodGhpcywgdGhlTmFtZSk7XG4gICAgICAgICAgICBvcGVyYW5kU3RhY2sucHVzaChuZXdFeHByKTtcbiAgICAgICAgICAgIG5ld0VsZW1lbnQgPSAwO1xuICAgICAgICAgICAgY2hhclBvcyA9IGVuZFBvcy0xO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAvLyBJdCBjb3VsZCBiZSBhbiBvcGVyYXRvci5cbiAgICAgIH0gZWxzZSBpZiAod29ya2luZ1N0ci5zdWJzdHIoY2hhclBvcykuc2VhcmNoKG9wTWF0Y2gpID09IDApIHtcbiAgICAgICAgbmV3RWxlbWVudCA9IDE7XG4gICAgICAgIHZhciBvcCA9IHdvcmtpbmdTdHIuY2hhckF0KGNoYXJQb3MpO1xuICAgICAgICB2YXIgbmV3T3AgPSBuZXcgb3BlcmF0b3Iob3ApO1xuXG4gICAgICAgIC8vIENvbnNlY3V0aXZlIG9wZXJhdG9ycz8gICAgQmV0dGVyIGJlIHNpZ24gY2hhbmdlIG9yIHJlY2lwcm9jYWwuXG4gICAgICAgIGlmIChsYXN0RWxlbWVudCAhPSAwKSB7XG4gICAgICAgICAgaWYgKG9wID09IFwiLVwiIHx8IG9wID09IFwiL1wiKSB7XG4gICAgICAgICAgICBuZXdPcC50eXBlID0gZXhwclR5cGUudW5vcDtcbiAgICAgICAgICAgIG5ld09wLnByZWMgPSBvcFByZWMubXVsdGRpdjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gRVJST1IhISFcbiAgICAgICAgICAgIHBhcnNlRXJyb3IgPSBcIkVycm9yOiBjb25zZWN1dGl2ZSBvcGVyYXRvcnNcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZU9wZXJhdG9yKHRoaXMsIG9wZXJhdG9yU3RhY2ssIG9wZXJhbmRTdGFjaywgbmV3T3ApO1xuICAgICAgfVxuXG4gICAgICAvLyBUd28gY29uc2VjdXRpdmUgb3BlcmFuZHMgbXVzdCBoYXZlIGFuIGltcGxpY2l0IG11bHRpcGxpY2F0aW9uIGJldHdlZW4gdGhlbVxuICAgICAgaWYgKGxhc3RFbGVtZW50ID09IDAgJiYgbmV3RWxlbWVudCA9PSAwKSB7XG4gICAgICAgIHZhciBob2xkRWxlbWVudCA9IG9wZXJhbmRTdGFjay5wb3AoKTtcblxuICAgICAgICAvLyBQdXNoIGEgbXVsdGlwbGljYXRpb25cbiAgICAgICAgdmFyIG5ld09wID0gbmV3IG9wZXJhdG9yKCcqJyk7XG4gICAgICAgIHJlc29sdmVPcGVyYXRvcih0aGlzLCBvcGVyYXRvclN0YWNrLCBvcGVyYW5kU3RhY2ssIG5ld09wKTtcblxuICAgICAgICAvLyBUaGVuIHJlc3RvcmUgdGhlIG9wZXJhbmQgc3RhY2suXG4gICAgICAgIG9wZXJhbmRTdGFjay5wdXNoKGhvbGRFbGVtZW50KTtcbiAgICAgIH1cbiAgICAgIGxhc3RFbGVtZW50ID0gbmV3RWxlbWVudDtcbiAgICB9XG5cbiAgICAvLyBOb3cgZmluaXNoIHVwIHRoZSBvcGVyYXRvciBzdGFjazogbm90aGluZyBuZXcgdG8gaW5jbHVkZVxuICAgIHJlc29sdmVPcGVyYXRvcih0aGlzLCBvcGVyYXRvclN0YWNrLCBvcGVyYW5kU3RhY2spO1xuICAgIHZhciBmaW5hbEV4cHJlc3Npb24gPSBvcGVyYW5kU3RhY2sucG9wKCk7XG4gICAgaWYgKHBhcnNlRXJyb3IubGVuZ3RoID4gMCkge1xuICAgICAgICBmaW5hbEV4cHJlc3Npb24uc2V0UGFyc2luZ0Vycm9yKHBhcnNlRXJyb3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFN1YnN0aXR1dGUgYW55IGV4cHJlc3Npb25zIHByb3ZpZGVkXG4gICAgICAgIGZpbmFsRXhwcmVzc2lvbiA9IGZpbmFsRXhwcmVzc2lvbi5jb21wb3NlKGJpbmRpbmdzKTtcbiAgICAgICAgLy8gVGVzdCBpZiBjb250ZXh0IGlzIGNvbnNpc3RlbnRcbiAgICAgICAgc3dpdGNoIChjb250ZXh0KSB7XG4gICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgICAgIGlmICghZmluYWxFeHByZXNzaW9uLmlzQ29uc3RhbnQoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBUaGUgZXhwcmVzc2lvbiAke2Zvcm11bGFTdHJ9IGlzIGV4cGVjdGVkIHRvIGJlIGEgY29uc3RhbnQgYnV0IGRlcGVuZHMgb24gdmFyaWFibGVzLmApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaW5hbEV4cHJlc3Npb24uc2ltcGxpZnlDb25zdGFudHMoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Zvcm11bGEnOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsRXhwcmVzc2lvbi5zZXRDb250ZXh0KGNvbnRleHQpO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5kb0ZsYXR0ZW4pIHtcbiAgICAgIGZpbmFsRXhwcmVzc2lvbi5mbGF0dGVuKCk7XG4gICAgfVxuICAgIHJldHVybiBmaW5hbEV4cHJlc3Npb247XG4gIH1cbn1cblxuLy8gVXNlZCBpbiBwYXJzZVxuZnVuY3Rpb24gb3BlcmF0b3Iob3BTdHIpIHtcbiAgdGhpcy5vcCA9IG9wU3RyO1xuICBzd2l0Y2gob3BTdHIpIHtcbiAgICBjYXNlICcrJzpcbiAgICBjYXNlICctJzpcbiAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5hZGRzdWI7XG4gICAgICB0aGlzLnR5cGUgPSBleHByVHlwZS5iaW5vcDtcbiAgICAgIHRoaXMudmFsdWVUeXBlID0gZXhwclZhbHVlLm51bWVyaWM7XG4gICAgICBicmVhaztcbiAgICBjYXNlICcqJzpcbiAgICBjYXNlICcvJzpcbiAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5tdWx0ZGl2O1xuICAgICAgdGhpcy50eXBlID0gZXhwclR5cGUuYmlub3A7XG4gICAgICB0aGlzLnZhbHVlVHlwZSA9IGV4cHJWYWx1ZS5udW1lcmljO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnXic6XG4gICAgICB0aGlzLnByZWMgPSBvcFByZWMucG93ZXI7XG4gICAgICB0aGlzLnR5cGUgPSBleHByVHlwZS5iaW5vcDtcbiAgICAgIHRoaXMudmFsdWVUeXBlID0gZXhwclZhbHVlLm51bWVyaWM7XG4gICAgICBicmVhaztcbiAgICBjYXNlICcmJzpcbiAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5jb25qO1xuICAgICAgdGhpcy50eXBlID0gZXhwclR5cGUuYmlub3A7XG4gICAgICB0aGlzLnZhbHVlVHlwZSA9IGV4cHJWYWx1ZS5ib29sO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnJCc6ICAvLyAkPW9yIHNpbmNlIHw9YWJzb2x1dGUgdmFsdWUgYmFyXG4vLyAgICB0aGlzLm9wID0gJ3wnXG4gICAgICB0aGlzLnByZWMgPSBvcFByZWMuZGlzajtcbiAgICAgIHRoaXMudHlwZSA9IGV4cHJUeXBlLmJpbm9wO1xuICAgICAgdGhpcy52YWx1ZVR5cGUgPSBleHByVmFsdWUuYm9vbDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJz0nOlxuICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLmVxdWFsO1xuICAgICAgdGhpcy50eXBlID0gZXhwclR5cGUuYmlub3A7XG4gICAgICB0aGlzLnZhbHVlVHlwZSA9IGV4cHJWYWx1ZS5ib29sO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnLCc6XG4gICAgICB0aGlzLnByZWMgPSBvcFByZWMuZm9wO1xuICAgICAgdGhpcy50eXBlID0gZXhwclR5cGUuYXJyYXk7XG4gICAgICB0aGlzLnZhbHVlVHlwZSA9IGV4cHJWYWx1ZS52ZWN0b3I7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLmZjbjtcbiAgICAgIHRoaXMudHlwZSA9IGV4cHJUeXBlLmZjbjtcbiAgICAgIGJyZWFrO1xuICB9XG59XG5cblxuXG4vKiBBbiBhYnNvbHV0ZSB2YWx1ZSBjYW4gYmUgY29tcGxpY2F0ZWQgYmVjYXVzZSBhbHNvIGEgZnVuY3Rpb24uIFxuTWF5IG5vdCBiZSBjbGVhciBpZiBuZXN0ZWQ6IHwyfHgtM3wtIDV8LlxuSXMgdGhhdCAyeC0xNSBvciBhYnMoMnx4LTN8LTUpP1xuUmVzb2x2ZSBieSByZXF1aXJpbmcgZXhwbGljaXQgb3BlcmF0aW9uczogfDIqfHgtM3wtNXwgb3IgfDJ8KngtMyp8LTV8XG4qL1xuZnVuY3Rpb24gY29tcGxldGVBYnNWYWx1ZShmb3JtdWxhU3RyLCBzdGFydFBvcykge1xuICAgIHZhciBwTGV2ZWwgPSAxO1xuICAgIHZhciBjaGFyUG9zID0gc3RhcnRQb3M7XG4gICAgdmFyIHdhc09wID0gdHJ1ZTsgLy8gb3BlbiBhYnNvbHV0ZSB2YWx1ZSBpbXBsaWNpdGx5IGhhcyBwcmV2aW91cyBvcGVyYXRpb24uXG5cbiAgICB3aGlsZSAocExldmVsID4gMCAmJiBjaGFyUG9zIDwgZm9ybXVsYVN0ci5sZW5ndGgpIHtcbiAgICAgICAgY2hhclBvcysrO1xuICAgICAgICAvLyBXZSBlbmNvdW50ZXIgYW5vdGhlciBhYnNvbHV0ZSB2YWx1ZS5cbiAgICAgICAgaWYgKGZvcm11bGFTdHIuY2hhckF0KGNoYXJQb3MpID09ICd8Jykge1xuICAgICAgICAgICAgaWYgKHdhc09wKSB7IC8vIE11c3QgYmUgb3BlbmluZyBhIG5ldyBhYnNvbHV0ZSB2YWx1ZS5cbiAgICAgICAgICAgICAgICBwTGV2ZWwrKztcbiAgICAgICAgICAgICAgICAvLyB3YXNPcCBpcyBzdGlsbCB0cnVlIHNpbmNlIGNhbid0IGNsb3NlIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICB9IGVsc2UgeyAgLy8gQXNzdW1lIGNsb3NpbmcgYWJzb2x1dGUgdmFsdWUuIElmIG5vdCB3YW50ZWQsIG5lZWQgb3BlcmF0b3IuXG4gICAgICAgICAgICAgICAgcExldmVsLS07XG4gICAgICAgICAgICAgICAgLy8gd2FzT3AgaXMgc3RpbGwgZmFsc2Ugc2luY2UganVzdCBjbG9zZWQgYSB2YWx1ZS5cbiAgICAgICAgICAgIH1cbiAgICAgICAgLy8gS2VlcCB0cmFjayBvZiB3aGV0aGVyIGp1c3QgaGFkIG9wZXJhdG9yIG9yIG5vdC5cbiAgICAgICAgfSBlbHNlIGlmIChcIistKi8oW1wiLnNlYXJjaChmb3JtdWxhU3RyLmNoYXJBdChjaGFyUG9zKSkgPj0gMCkge1xuICAgICAgICAgICAgd2FzT3AgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGZvcm11bGFTdHIuY2hhckF0KGNoYXJQb3MpICE9ICcgJykge1xuICAgICAgICAgICAgd2FzT3AgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4oY2hhclBvcyk7XG59XG5cbi8vIEZpbmQgdGhlIGJhbGFuY2luZyBjbG9zaW5nIHBhcmVudGhlc2lzLlxuZnVuY3Rpb24gY29tcGxldGVQYXJlbnRoZXNpcyhmb3JtdWxhU3RyLCBzdGFydFBvcykge1xuICAgIHZhciBwTGV2ZWwgPSAxO1xuICAgIHZhciBjaGFyUG9zID0gc3RhcnRQb3M7XG5cbiAgICB3aGlsZSAocExldmVsID4gMCAmJiBjaGFyUG9zIDwgZm9ybXVsYVN0ci5sZW5ndGgpIHtcbiAgICAgICAgY2hhclBvcysrO1xuICAgICAgICBpZiAoZm9ybXVsYVN0ci5jaGFyQXQoY2hhclBvcykgPT0gJyknKSB7XG4gICAgICAgICAgICBwTGV2ZWwtLTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtdWxhU3RyLmNoYXJBdChjaGFyUG9zKSA9PSAnKCcpIHtcbiAgICAgICAgICAgIHBMZXZlbCsrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybihjaGFyUG9zKTtcbn1cblxuLy8gQnJhY2tldHMgYXJlIHVzZWQgZm9yIHNlcXVlbmNlIGluZGV4aW5nLCBub3QgcmVndWxhciBncm91cGluZy5cbmZ1bmN0aW9uIGNvbXBsZXRlQnJhY2tldChmb3JtdWxhU3RyLCBzdGFydFBvcywgYXNTdWJzY3JpcHQpIHtcbiAgICB2YXIgcExldmVsID0gMTtcbiAgICB2YXIgY2hhclBvcyA9IHN0YXJ0UG9zO1xuICAgIHZhciBmYWlsID0gZmFsc2U7XG5cbiAgICB3aGlsZSAocExldmVsID4gMCAmJiBjaGFyUG9zIDwgZm9ybXVsYVN0ci5sZW5ndGgpIHtcbiAgICAgICAgY2hhclBvcysrO1xuICAgICAgICBpZiAoZm9ybXVsYVN0ci5jaGFyQXQoY2hhclBvcykgPT0gJ10nKSB7XG4gICAgICAgICAgICBwTGV2ZWwtLTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtdWxhU3RyLmNoYXJBdChjaGFyUG9zKSA9PSAnWycpIHtcbiAgICAgICAgICAgIGlmIChhc1N1YnNjcmlwdCkge1xuICAgICAgICAgICAgICAgIGZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcExldmVsKys7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGFzU3Vic2NyaXB0ICYmIGZhaWwpIHtcbiAgICAgICAgdGhyb3cgXCJOZXN0ZWQgYnJhY2tldHMgdXNlZCBmb3Igc3Vic2NyaXB0cyBhcmUgbm90IHN1cHBvcnRlZC5cIjtcbiAgICB9XG4gICAgcmV0dXJuKGNoYXJQb3MpO1xufVxuXG4vKiBHaXZlbiBhIHN0cmluZyBhbmQgYSBzdGFydGluZyBwb3NpdGlvbiBvZiBhIG5hbWUsIGlkZW50aWZ5IHRoZSBlbnRpcmUgbmFtZS4gKi9cbi8qIFJlcXVpcmUgc3RhcnQgd2l0aCBsZXR0ZXIsIHRoZW4gYW55IHNlcXVlbmNlIG9mICp3b3JkKiBjaGFyYWN0ZXIgKi9cbi8qIEFsc28gYWxsb3cgcHJpbWVzIGZvciBkZXJpdmF0aXZlcyBhdCB0aGUgZW5kLiAqL1xuZnVuY3Rpb24gY29tcGxldGVOYW1lKGZvcm11bGFTdHIsIHN0YXJ0UG9zKSB7XG4gICAgdmFyIG1hdGNoUnVsZSA9IC9bQS1aYS16XVxcdyonKi87XG4gICAgdmFyIG1hdGNoID0gZm9ybXVsYVN0ci5zdWJzdHIoc3RhcnRQb3MpLm1hdGNoKG1hdGNoUnVsZSk7XG4gICAgcmV0dXJuKHN0YXJ0UG9zICsgbWF0Y2hbMF0ubGVuZ3RoKTtcbn1cblxuLyogR2l2ZW4gYSBzdHJpbmcgYW5kIGEgc3RhcnRpbmcgcG9zaXRpb24gb2YgYSBudW1iZXIsIGlkZW50aWZ5IHRoZSBlbnRpcmUgbnVtYmVyLiAqL1xuZnVuY3Rpb24gY29tcGxldGVOdW1iZXIoZm9ybXVsYVN0ciwgc3RhcnRQb3MsIG9wdGlvbnMpIHtcbiAgICB2YXIgbWF0Y2hSdWxlO1xuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubm9EZWNpbWFscykge1xuICAgICAgICBtYXRjaFJ1bGUgPSAvWzAtOV0qLztcbiAgICB9IGVsc2Uge1xuICAgICAgICBtYXRjaFJ1bGUgPSAvWzAtOV0qKFxcLlswLTldKik/KGUtP1swLTldKyk/LztcbiAgICB9XG4gICAgdmFyIG1hdGNoID0gZm9ybXVsYVN0ci5zdWJzdHIoc3RhcnRQb3MpLm1hdGNoKG1hdGNoUnVsZSk7XG4gICAgcmV0dXJuKHN0YXJ0UG9zICsgbWF0Y2hbMF0ubGVuZ3RoKTtcbn1cblxuLyogVGVzdHMgYSBzdHJpbmcgdG8gc2VlIGlmIGl0IGNhbiBiZSBjb25zdHJ1Y3RlZCBhcyBhIGNvbmNhdGVudGF0aW9uIG9mIGtub3duIG5hbWVzLiAqL1xuLyogRm9yIGV4YW1wbGUsIGFiYyBjb3VsZCBiZSBhIG5hbWUgb3IgY291bGQgYmUgYSpiKmMgKi9cbi8qIFBhc3MgaW4gdGhlIGJpbmRpbmdzIGdpdmluZyB0aGUga25vd24gbmFtZXMgYW5kIHNlZSBpZiB3ZSBjYW4gYnVpbGQgdGhpcyBuYW1lICovXG4vKiBSZXR1cm4gdGhlICpmaXJzdCogbmFtZSB0aGF0IGlzIHBhcnQgb2YgdGhlIHdob2xlLiAqL1xuZnVuY3Rpb24gVGVzdE5hbWVJc0NvbXBvc2l0ZSh0ZXh0LCBiaW5kaW5ncykge1xuICAgIHZhciByZXRTdHJ1Y3QgPSBuZXcgT2JqZWN0KCk7XG4gICAgcmV0U3RydWN0LmlzQ29tcG9zaXRlID0gZmFsc2U7XG5cbiAgICBpZiAoYmluZGluZ3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YXIgcmVtYWluLCBuZXh0TmFtZTtcbiAgICAgICAgaWYgKGJpbmRpbmdzW3RleHRdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldFN0cnVjdC5pc0NvbXBvc2l0ZSA9IHRydWU7XG4gICAgICAgICAgICByZXRTdHJ1Y3QubmFtZSA9IHRleHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBTZWUgaWYgdGhlIHRleHQgKnN0YXJ0cyogd2l0aCBhIGtub3duIG5hbWVcbiAgICAgICAgICAgIHZhciBrbm93bk5hbWVzID0gT2JqZWN0LmtleXMoYmluZGluZ3MpO1xuICAgICAgICAgICAgZm9yICh2YXIgaWtleSBpbiBrbm93bk5hbWVzKSB7XG4gICAgICAgICAgICAgICAgbmV4dE5hbWUgPSBrbm93bk5hbWVzW2lrZXldO1xuICAgICAgICAgICAgICAgIC8vIElmICp0aGlzKiBuYW1lIGlzIHRoZSBzdGFydCBvZiB0aGUgdGV4dCwgc2VlIGlmIHRoZSByZXN0IGZyb20ga25vd24gbmFtZXMuXG4gICAgICAgICAgICAgICAgaWYgKHRleHQuc2VhcmNoKG5leHROYW1lKT09MCkge1xuICAgICAgICAgICAgICAgICAgICByZW1haW4gPSBUZXN0TmFtZUlzQ29tcG9zaXRlKHRleHQuc2xpY2UobmV4dE5hbWUubGVuZ3RoKSwgYmluZGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVtYWluLmlzQ29tcG9zaXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRTdHJ1Y3QuaXNDb21wb3NpdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0U3RydWN0Lm5hbWUgPSBuZXh0TmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXRTdHJ1Y3Q7XG59XG4gIFxuZXhwb3J0IGNsYXNzIEJUTSB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MpIHtcbiAgICAgICAgdGhpcy5tZW52ID0gbmV3IE1FTlYoc2V0dGluZ3MpO1xuXG4gICAgICAgIC8vIEVhY2ggaW5zdGFuY2Ugb2YgQlRNIGVudmlyb25tZW50IG5lZWRzIGJpbmRpbmdzIGFjcm9zcyBhbGwgZXhwcmVzc2lvbnMuXG4gICAgICAgIHRoaXMuZGF0YSA9IHt9O1xuICAgICAgICB0aGlzLmRhdGEuYWxsVmFsdWVzID0ge307XG4gICAgICAgIHRoaXMuZGF0YS5wYXJhbXMgPSB7fTtcbiAgICAgICAgdGhpcy5kYXRhLnZhcmlhYmxlcyA9IHt9O1xuICAgICAgICB0aGlzLmRhdGEuZXhwcmVzc2lvbnMgPSB7fTtcbiAgICB9XG5cblxuICAgIGFkZE1hdGhPYmplY3QobmFtZSwgY29udGV4dCwgbmV3T2JqZWN0KSB7XG4gICAgICAgIHN3aXRjaChjb250ZXh0KSB7XG4gICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgICAgIGlmIChuZXdPYmplY3QuaXNDb25zdGFudCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5wYXJhbXNbbmFtZV0gPSBuZXdPYmplY3Q7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5hbGxWYWx1ZXNbbmFtZV0gPSBuZXdPYmplY3Q7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYEF0dGVtcHQgdG8gYWRkIG1hdGggb2JqZWN0ICcke25hbWV9JyB3aXRoIGNvbnRleHQgJyR7Y29udGV4dH0nIHRoYXQgZG9lcyBub3QgbWF0Y2guYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdmb3JtdWxhJzpcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuYWxsVmFsdWVzW25hbWVdID0gbmV3T2JqZWN0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdPYmplY3Q7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVSYW5kb20oZGlzdHIsIG9wdGlvbnMpIHtcbiAgICAgICByZXR1cm4gdGhpcy5tZW52LmdlbmVyYXRlUmFuZG9tKGRpc3RyLG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGFkZFZhcmlhYmxlKG5hbWUsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIG5ld1ZhciA9IG5ldyB2YXJpYWJsZV9leHByKHRoaXMubWVudiwgbmFtZSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmRhdGEudmFyaWFibGVzW25hbWVdID0gbmV3VmFyO1xuICAgICAgICB0aGlzLmRhdGEuYWxsVmFsdWVzW25hbWVdID0gbmV3VmFyO1xuXG4gICAgICAgIHJldHVybiBuZXdWYXI7XG4gICAgfVxuXG4gICAgcGFyc2VFeHByZXNzaW9uKGV4cHJlc3Npb24sIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIG5ld0V4cHI7XG4gICAgICAgIC8vIE5vdCB5ZXQgcGFyc2VkXG4gICAgICAgIGlmICh0eXBlb2YgZXhwcmVzc2lvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhciBmb3JtdWxhID0gdGhpcy5kZWNvZGVGb3JtdWxhKGV4cHJlc3Npb24pO1xuICAgICAgICAgICAgbmV3RXhwciA9IHRoaXMubWVudi5wYXJzZShmb3JtdWxhLCBjb250ZXh0LCB0aGlzLmRhdGEuYWxsVmFsdWVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jb21wb3NlKHRoaXMuZGF0YS5hbGxWYWx1ZXMpO1xuICAgICAgICAvLyBBbHJlYWR5IHBhcnNlZFxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHByZXNzaW9uID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgbmV3RXhwciA9IGV4cHJlc3Npb247XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0V4cHI7XG4gICAgfVxuXG4gICAgZXZhbHVhdGVFeHByZXNzaW9uKGV4cHJlc3Npb24sIGNvbnRleHQsIGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciB0aGVFeHByLCBuZXdFeHByLCByZXRWYWx1ZTtcbiAgICAgICAgLy8gTm90IHlldCBwYXJzZWRcbiAgICAgICAgaWYgKHR5cGVvZiBleHByZXNzaW9uID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdmFyIGZvcm11bGEgPSB0aGlzLmRlY29kZUZvcm11bGEoZXhwcmVzc2lvbik7XG4gICAgICAgICAgICB0aGVFeHByID0gdGhpcy5tZW52LnBhcnNlKGZvcm11bGEsIFwiZm9ybXVsYVwiKTtcbiAgICAgICAgLy8gQWxyZWFkeSBwYXJzZWRcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwcmVzc2lvbiA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHRoZUV4cHIgPSBleHByZXNzaW9uO1xuICAgICAgICB9XG4gICAgICAgIHJldFZhbHVlID0gdGhlRXhwci5ldmFsdWF0ZShiaW5kaW5ncyk7XG4gICAgICAgIG5ld0V4cHIgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCByZXRWYWx1ZSk7XG4gICAgICAgIHJldHVybiBuZXdFeHByO1xuICAgIH1cblxuICAgIGNvbXBvc2VFeHByZXNzaW9uKGV4cHJlc3Npb24sIHN1YnN0aXR1dGlvbikge1xuICAgICAgICB2YXIgbXlFeHByO1xuICAgICAgICAvLyBOb3QgeWV0IHBhcnNlZFxuICAgICAgICBpZiAodHlwZW9mIGV4cHJlc3Npb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YXIgZm9ybXVsYSA9IHRoaXMuZGVjb2RlRm9ybXVsYShleHByZXNzaW9uKTtcbiAgICAgICAgICAgIG15RXhwciA9IHRoaXMubWVudi5wYXJzZShmb3JtdWxhLCBcImZvcm11bGFcIik7XG4gICAgICAgIC8vIEFscmVhZHkgcGFyc2VkXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cHJlc3Npb24gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBteUV4cHIgPSBleHByZXNzaW9uO1xuICAgICAgICB9XG4gICAgICAgIHZhciBteVN1YnMgPSBPYmplY3QuZW50cmllcyhzdWJzdGl0dXRpb24pO1xuICAgICAgICB2YXIgc3Vic3RWYXIsIHN1YnN0RXhwcjtcbiAgICAgICAgW3N1YnN0VmFyLCBzdWJzdEV4cHJdID0gbXlTdWJzWzBdO1xuICAgICAgICBpZiAodHlwZW9mIHN1YnN0RXhwciA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBzdWJzdEV4cHIgPSB0aGlzLm1lbnYucGFyc2Uoc3Vic3RFeHByLCBcImZvcm11bGFcIik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGJpbmRpbmcgPSB7fTtcbiAgICAgICAgYmluZGluZ1tzdWJzdFZhcl0gPSBzdWJzdEV4cHI7XG4gICAgICAgIHJldHVybiBteUV4cHIuY29tcG9zZShiaW5kaW5nKTtcbiAgICB9XG5cbiAgICBhZGRFeHByZXNzaW9uKG5hbWUsIGV4cHJlc3Npb24pIHtcbiAgICAgICAgdmFyIG5ld0V4cHIgPSB0aGlzLnBhcnNlRXhwcmVzc2lvbihleHByZXNzaW9uLCBcImZvcm11bGFcIik7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmRhdGEuZXhwcmVzc2lvbnNbbmFtZV0gPSBuZXdFeHByO1xuICAgICAgICB0aGlzLmRhdGEuYWxsVmFsdWVzW25hbWVdID0gbmV3RXhwcjtcblxuICAgICAgICByZXR1cm4gbmV3RXhwcjtcbiAgICB9XG5cbiAgICBhZGRGdW5jdGlvbihuYW1lLCBpbnB1dCwgZXhwcmVzc2lvbikge1xuICAgICAgICB0aGlzLm1lbnYuYWRkRnVuY3Rpb24obmFtZSwgaW5wdXQsIGV4cHJlc3Npb24pO1xuICAgIH1cblxuICAgIC8vIFRoaXMgcm91dGluZSB0YWtlcyB0aGUgdGV4dCBhbmQgbG9va3MgZm9yIHN0cmluZ3MgaW4gbXVzdGFjaGVzIHt7bmFtZX19XG4gICAgLy8gSXQgcmVwbGFjZXMgdGhpcyBlbGVtZW50IHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgcGFyYW1ldGVyLCB2YXJpYWJsZSwgb3IgZXhwcmVzc2lvbi5cbiAgICAvLyBUaGVzZSBzaG91bGQgaGF2ZSBiZWVuIHByZXZpb3VzbHkgcGFyc2VkIGFuZCBzdG9yZWQgaW4gdGhpcy5kYXRhLlxuICAgIGRlY29kZUZvcm11bGEoc3RhdGVtZW50LCBkaXNwbGF5TW9kZSkge1xuICAgICAgICAvLyBGaXJzdCBmaW5kIGFsbCBvZiB0aGUgZXhwZWN0ZWQgc3Vic3RpdHV0aW9ucy5cbiAgICAgICAgdmFyIHN1YnN0UmVxdWVzdExpc3QgPSB7fTtcbiAgICAgICAgdmFyIG1hdGNoUkUgPSAvXFx7XFx7W0EtWmEtel1cXHcqXFx9XFx9L2c7XG4gICAgICAgIHZhciBzdWJzdE1hdGNoZXMgPSBzdGF0ZW1lbnQubWF0Y2gobWF0Y2hSRSk7XG4gICAgICAgIGlmIChzdWJzdE1hdGNoZXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPHN1YnN0TWF0Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaE5hbWUgPSBzdWJzdE1hdGNoZXNbaV07XG4gICAgICAgICAgICAgICAgbWF0Y2hOYW1lID0gbWF0Y2hOYW1lLnN1YnN0cigyLG1hdGNoTmFtZS5sZW5ndGgtNCk7XG4gICAgICAgICAgICAgICAgLy8gTm93IHNlZSBpZiB0aGUgbmFtZSBpcyBpbiBvdXIgc3Vic3RpdHV0aW9uIHJ1bGVzLlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRhdGEuYWxsVmFsdWVzW21hdGNoTmFtZV0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXNwbGF5TW9kZSAhPSB1bmRlZmluZWQgJiYgZGlzcGxheU1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnN0UmVxdWVzdExpc3RbbWF0Y2hOYW1lXSA9ICd7Jyt0aGlzLmRhdGEuYWxsVmFsdWVzW21hdGNoTmFtZV0udG9UZVgoKSsnfSc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzdFJlcXVlc3RMaXN0W21hdGNoTmFtZV0gPSAnKCcrdGhpcy5kYXRhLmFsbFZhbHVlc1ttYXRjaE5hbWVdLnRvU3RyaW5nKCkrJyknO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2UgYXJlIG5vdyByZWFkeSB0byBtYWtlIHRoZSBzdWJzdGl0dXRpb25zLlxuICAgICAgICB2YXIgcmV0U3RyaW5nID0gc3RhdGVtZW50O1xuICAgICAgICBmb3IgKHZhciBtYXRjaCBpbiBzdWJzdFJlcXVlc3RMaXN0KSB7XG4gICAgICAgICAgICB2YXIgcmUgPSBuZXcgUmVnRXhwKFwie3tcIiArIG1hdGNoICsgXCJ9fVwiLCBcImdcIik7XG4gICAgICAgICAgICB2YXIgc3Vic3QgPSBzdWJzdFJlcXVlc3RMaXN0W21hdGNoXTtcbiAgICAgICAgICAgIHJldFN0cmluZyA9IHJldFN0cmluZy5yZXBsYWNlKHJlLCBzdWJzdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldFN0cmluZztcbiAgICB9XG5cbiAgICBjb21wYXJlRXhwcmVzc2lvbnMoZXhwcjEsIGV4cHIyKSB7XG4gICAgICAgIHZhciBteUV4cHIxLCBteUV4cHIyO1xuICAgICAgICAvLyBOb3QgeWV0IHBhcnNlZFxuICAgICAgICBpZiAodHlwZW9mIGV4cHIxID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdmFyIGZvcm11bGExID0gdGhpcy5kZWNvZGVGb3JtdWxhKGV4cHIxKTtcbiAgICAgICAgICAgIG15RXhwcjEgPSB0aGlzLm1lbnYucGFyc2UoZm9ybXVsYTEsIFwiZm9ybXVsYVwiKTtcbiAgICAgICAgLy8gQWxyZWFkeSBwYXJzZWRcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwcjEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBteUV4cHIxID0gZXhwcjE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBleHByMiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhciBmb3JtdWxhMiA9IHRoaXMuZGVjb2RlRm9ybXVsYShleHByMik7XG4gICAgICAgICAgICBteUV4cHIyID0gdGhpcy5tZW52LnBhcnNlKGZvcm11bGEyLCBcImZvcm11bGFcIik7XG4gICAgICAgIC8vIEFscmVhZHkgcGFyc2VkXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cHIyID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgbXlFeHByMiA9IGV4cHIyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubWVudi5jb21wYXJlTWF0aE9iamVjdHMobXlFeHByMSxteUV4cHIyKTtcbiAgICB9XG5cbiAgICBnZXRQYXJzZXIoY29udGV4dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZW52LmdldFBhcnNlcihjb250ZXh0KTtcbiAgICB9XG59XG4iLCIvKiFcbiAqIEJUTSBKYXZhU2NyaXB0IExpYnJhcnkgdkBWRVJTSU9OXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGJyaWFud2FsdG9uL0JUTVxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogRGVmaW5lIHRoZSBCaW5hcnkgRXhwcmVzc2lvbiAtLSBkZWZpbmVkIGJ5IGFuIG9wZXJhdG9yIGFuZCB0d28gaW5wdXRzLlxuKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuaW1wb3J0IHsgTUVOViwgb3BQcmVjLCBleHByVHlwZSwgZXhwclZhbHVlIH0gZnJvbSBcIi4vQlRNX3Jvb3QuanNcIlxuaW1wb3J0IHsgZXhwcmVzc2lvbiB9IGZyb20gXCIuL2V4cHJlc3Npb24uanNcIlxuaW1wb3J0IHsgc2NhbGFyX2V4cHIgfSBmcm9tIFwiLi9zY2FsYXJfZXhwci5qc1wiXG5pbXBvcnQgeyB1bm9wX2V4cHIgfSBmcm9tIFwiLi91bm9wX2V4cHIuanNcIlxuXG5leHBvcnQgY2xhc3MgYmlub3BfZXhwciBleHRlbmRzIGV4cHJlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKG1lbnYsIG9wLCBpbnB1dEEsIGlucHV0Qikge1xuICAgICAgICBzdXBlcihtZW52KTtcbiAgICAgICAgdGhpcy50eXBlID0gZXhwclR5cGUuYmlub3A7XG4gICAgICAgIHRoaXMub3AgPSBvcDtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dEEgPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICBpbnB1dEEgPSBuZXcgZXhwcmVzc2lvbih0aGlzLm1lbnYpO1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0QiA9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIGlucHV0QiA9IG5ldyBleHByZXNzaW9uKHRoaXMubWVudik7XG4gICAgICAgIHRoaXMuaW5wdXRzID0gW2lucHV0QSwgaW5wdXRCXTtcbiAgICAgICAgICAgIGlucHV0QS5wYXJlbnQgPSB0aGlzO1xuICAgICAgICAgICAgaW5wdXRCLnBhcmVudCA9IHRoaXM7XG5cbiAgICAgICAgc3dpdGNoIChvcCkge1xuICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICB0aGlzLnByZWMgPSBvcFByZWMuYWRkc3ViO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICB0aGlzLnByZWMgPSBvcFByZWMubXVsdGRpdjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgICAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5wb3dlcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyYnOlxuICAgICAgICAgICAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5jb25qO1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVUeXBlID0gZXhwclZhbHVlLmJvb2w7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICckJzpcbiAgICAgICAgICAgICAgICB0aGlzLnByZWMgPSBvcFByZWMuZGlzajtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlVHlwZSA9IGV4cHJWYWx1ZS5ib29sO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnPSc6XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLmVxdWFsO1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVUeXBlID0gZXhwclZhbHVlLmJvb2w7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5rbm93biBiaW5hcnkgb3BlcmF0b3I6ICdcIitvcCtcIicuXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHZhciB0aGVTdHI7XG4gICAgICAgIHZhciBvcEFTdHIsIG9wQlN0cjtcbiAgICAgICAgdmFyIGlzRXJyb3IgPSBmYWxzZTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaW5wdXRzWzBdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBvcEFTdHIgPSAnPyc7XG4gICAgICAgICAgICBpc0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9wQVN0ciA9IHRoaXMuaW5wdXRzWzBdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBpZiAoKHRoaXMuaW5wdXRzWzBdLnR5cGUgPj0gZXhwclR5cGUudW5vcFxuICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1swXS5wcmVjIDwgdGhpcy5wcmVjKVxuICAgICAgICAgICAgICAgIHx8ICh0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICAgICAmJiBvcEFTdHIuaW5kZXhPZihcIi9cIikgPj0gMFxuICAgICAgICAgICAgICAgICAgICAmJiBvcFByZWMubXVsdGRpdiA8PSB0aGlzLnByZWMpXG4gICAgICAgICAgICAgICAgKSBcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBvcEFTdHIgPSAnKCcgKyBvcEFTdHIgKyAnKSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0c1sxXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb3BCU3RyID0gJz8nO1xuICAgICAgICAgICAgaXNFcnJvciA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcEJTdHIgPSB0aGlzLmlucHV0c1sxXS50b1N0cmluZygpO1xuICAgICAgICAgICAgaWYgKCh0aGlzLmlucHV0c1sxXS50eXBlID49IGV4cHJUeXBlLnVub3BcbiAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbMV0ucHJlYyA8PSB0aGlzLnByZWMpXG4gICAgICAgICAgICAgICAgfHwgKHRoaXMuaW5wdXRzWzFdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICYmIG9wQlN0ci5pbmRleE9mKFwiL1wiKSA+PSAwXG4gICAgICAgICAgICAgICAgICAgICYmIG9wUHJlYy5tdWx0ZGl2IDw9IHRoaXMucHJlYylcbiAgICAgICAgICAgICAgICApIFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG9wQlN0ciA9ICcoJyArIG9wQlN0ciArICcpJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0aGVPcCA9IHRoaXMub3A7XG4gICAgICAgIGlmICh0aGVPcCA9PSAnfCcpIHtcbiAgICAgICAgICAgIHRoZU9wID0gJyAkICc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGVTdHIgPSBvcEFTdHIgKyB0aGVPcCArIG9wQlN0cjtcbiAgICAgICAgcmV0dXJuKHRoZVN0cik7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRlc3RlZCBlcXVpdmFsZW50IHN0cmluZ3MuXG4gICAgYWxsU3RyaW5nRXF1aXZzKCkge1xuICAgICAgICB2YXIgYWxsSW5wdXRzQSA9IHRoaXMuaW5wdXRzWzBdLmFsbFN0cmluZ0VxdWl2cygpLFxuICAgICAgICAgICAgYWxsSW5wdXRzQiA9IHRoaXMuaW5wdXRzWzFdLmFsbFN0cmluZ0VxdWl2cygpO1xuXG4gICAgICAgIHZhciByZXRWYWx1ZSA9IFtdO1xuXG4gICAgICAgIHZhciB0aGVPcCA9IHRoaXMub3A7XG4gICAgICAgIGlmICh0aGVPcCA9PSAnfCcpIHtcbiAgICAgICAgICAgIHRoZU9wID0gJyAkICc7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpIGluIGFsbElucHV0c0EpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogaW4gYWxsSW5wdXRzQikge1xuICAgICAgICAgICAgICAgIG9wQVN0ciA9IGFsbElucHV0c0FbaV07XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzWzBdLnR5cGUgPj0gZXhwclR5cGUudW5vcCAmJiB0aGlzLmlucHV0c1swXS5wcmVjIDwgdGhpcy5wcmVjKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wQVN0ciA9ICcoJyArIG9wQVN0ciArICcpJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3BCU3RyID0gYWxsSW5wdXRzQltqXTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbMV0udHlwZSA+PSBleHByVHlwZS51bm9wICYmIHRoaXMuaW5wdXRzWzFdLnByZWMgPD0gdGhpcy5wcmVjKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wQlN0ciA9ICcoJyArIG9wQlN0ciArICcpJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXRWYWx1ZS5wdXNoKG9wQVN0ciArIHRoZU9wICsgb3BCU3RyKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wID09ICcrJyB8fCB0aGlzLm9wID09ICcqJyB8fCB0aGlzLm9wID09ICcmJyB8fCB0aGlzLm9wID09ICckJykge1xuICAgICAgICAgICAgICAgICAgICBvcEJTdHIgPSBhbGxJbnB1dHNCW2pdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbMV0udHlwZSA+PSBleHByVHlwZS51bm9wICYmIHRoaXMuaW5wdXRzWzFdLnByZWMgPCB0aGlzLnByZWMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wQlN0ciA9ICcoJyArIG9wQlN0ciArICcpJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBvcEFTdHIgPSBhbGxJbnB1dHNBW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbMF0udHlwZSA+PSBleHByVHlwZS51bm9wICYmIHRoaXMuaW5wdXRzWzBdLnByZWMgPD0gdGhpcy5wcmVjKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcEFTdHIgPSAnKCcgKyBvcEFTdHIgKyAnKSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsdWUucHVzaChvcEJTdHIgKyB0aGVPcCArIG9wQVN0cik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKHJldFZhbHVlKTtcbiAgICB9XG5cbiAgICB0b1RlWChzaG93U2VsZWN0KSB7XG4gICAgICAgIHZhciB0aGVTdHI7XG4gICAgICAgIHZhciB0aGVPcDtcbiAgICAgICAgdmFyIG9wQVN0ciwgb3BCU3RyO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygc2hvd1NlbGVjdCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgc2hvd1NlbGVjdCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0c1swXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb3BBU3RyID0gJz8nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3BBU3RyID0gdGhpcy5pbnB1dHNbMF0udG9UZVgoc2hvd1NlbGVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0c1sxXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb3BCU3RyID0gJz8nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3BCU3RyID0gdGhpcy5pbnB1dHNbMV0udG9UZVgoc2hvd1NlbGVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhlT3AgPSB0aGlzLm9wO1xuICAgICAgICBpZiAoc2hvd1NlbGVjdCAmJiB0aGlzLnNlbGVjdCkge1xuICAgICAgICAgICAgc3dpdGNoICh0aGVPcCkge1xuICAgICAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgICAgICB0aGVPcCA9ICdcXFxcY2RvdCAnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICAgICAgdGhlT3AgPSAnXFxcXGRpdiAnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICAgICAgICAgICAgdGhlT3AgPSAnXFxcXHdlZGdlICc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3wnOlxuICAgICAgICAgICAgICAgICAgICB0aGVPcCA9ICdcXFxcaGJveHsgb3IgfSc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJyQnOlxuICAgICAgICAgICAgICAgICAgICB0aGVPcCA9ICdcXFxcaGJveHsgb3IgfSc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJyYnOlxuICAgICAgICAgICAgICAgICAgICB0aGVPcCA9ICdcXFxcaGJveHsgYW5kIH0nO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhlT3ApIHtcbiAgICAgICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzWzFdICYmIHRoaXMuaW5wdXRzWzFdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVPcCA9ICdcXFxcY2RvdCAnO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW5wdXRzWzFdICYmIHRoaXMuaW5wdXRzWzFdLnR5cGUgPT0gZXhwclR5cGUuYmlub3BcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbMV0ub3A9PSdeJyAmJiB0aGlzLmlucHV0c1sxXS5pbnB1dHNbMF0udHlwZT09ZXhwclR5cGUubnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVPcCA9ICdcXFxcY2RvdCAnO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlT3AgPSAnICc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnfCc6XG4gICAgICAgICAgICAgICAgICAgIHRoZU9wID0gJ1xcXFxoYm94eyBvciB9JztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnJCc6XG4gICAgICAgICAgICAgICAgICAgIHRoZU9wID0gJ1xcXFxoYm94eyBvciB9JztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnJic6XG4gICAgICAgICAgICAgICAgICAgIHRoZU9wID0gJ1xcXFxoYm94eyBhbmQgfSc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGVPcCA9PSAnLycpIHtcbiAgICAgICAgICAgIHRoZVN0ciA9ICdcXFxcZnJhY3snICsgb3BBU3RyICsgJ317JyArIG9wQlN0ciArICd9JztcbiAgICAgICAgfSBlbHNlIGlmICh0aGVPcCA9PSAnXicpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1swXSAmJiB0aGlzLmlucHV0c1swXS50eXBlID49IGV4cHJUeXBlLmZjbikge1xuICAgICAgICAgICAgICAgIHRoZVN0ciA9ICdcXFxcbGVmdCgnICsgb3BBU3RyICsgJ1xcXFxyaWdodCknO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGVTdHIgPSBvcEFTdHI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGVTdHIgKz0gdGhlT3AgKyAneycgKyBvcEJTdHIgKyAnfSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgYXJnU3RyTD0nJywgYXJnU3RyUj0nJywgb3BTdHJMPScnLCBvcFN0clI9Jyc7XG5cbiAgICAgICAgICAgIGlmIChzaG93U2VsZWN0ICYmIHRoaXMuc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgYXJnU3RyTCA9ICd7XFxcXGNvbG9ye2JsdWV9JztcbiAgICAgICAgICAgICAgICBhcmdTdHJSID0gJ30nO1xuICAgICAgICAgICAgICAgIG9wU3RyTCA9ICd7XFxcXGNvbG9ye3JlZH0nO1xuICAgICAgICAgICAgICAgIG9wU3RyUiA9ICd9JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1swXSAmJiB0aGlzLmlucHV0c1swXS50eXBlID49IGV4cHJUeXBlLnVub3AgJiYgdGhpcy5pbnB1dHNbMF0ucHJlYyA8IHRoaXMucHJlYykge1xuICAgICAgICAgICAgICAgIHRoZVN0ciA9ICdcXFxcbGVmdCgnICsgYXJnU3RyTCArIG9wQVN0ciArIGFyZ1N0clIgKyAnXFxcXHJpZ2h0KSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoZVN0ciA9IGFyZ1N0ckwgKyBvcEFTdHIgKyBhcmdTdHJSO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhlU3RyICs9IG9wU3RyTCArIHRoZU9wICsgb3BTdHJSO1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzWzFdICYmIHRoaXMuaW5wdXRzWzFdLnR5cGUgPj0gZXhwclR5cGUudW5vcCAmJiB0aGlzLmlucHV0c1sxXS5wcmVjIDw9IHRoaXMucHJlYykge1xuICAgICAgICAgICAgICAgIHRoZVN0ciArPSAnXFxcXGxlZnQoJyArIGFyZ1N0ckwgKyBvcEJTdHIgKyBhcmdTdHJSICsgJ1xcXFxyaWdodCknO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGVTdHIgKz0gYXJnU3RyTCArIG9wQlN0ciArIGFyZ1N0clI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNob3dTZWxlY3QgJiYgdGhpcy5zZWxlY3QpIHtcbiAgICAgICAgICB0aGVTdHIgPSBcIntcXFxcY29sb3J7cmVkfVxcXFxib3hlZHtcIiArIHRoZVN0ciArIFwifX1cIjtcbiAgICAgICAgfVxuICAgICAgICB0aGVTdHIgPSB0aGVTdHIucmVwbGFjZSgvXFwrLS9nLCAnLScpO1xuICAgICAgICByZXR1cm4odGhlU3RyKTtcbiAgICB9XG5cbiAgICB0b01hdGhNTCgpIHtcbiAgICAgICAgdmFyIHRoZVN0cjtcbiAgICAgICAgdmFyIHRoZU9wO1xuICAgICAgICB2YXIgb3BBU3RyLCBvcEJTdHI7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0c1swXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb3BBU3RyID0gJz8nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3BBU3RyID0gdGhpcy5pbnB1dHNbMF0udG9NYXRoTUwoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaW5wdXRzWzFdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBvcEJTdHIgPSAnPyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcEJTdHIgPSB0aGlzLmlucHV0c1sxXS50b01hdGhNTCgpO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAodGhpcy5vcCkge1xuICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgdGhlT3AgPSBcIjxwbHVzLz5cIlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgdGhlT3AgPSBcIjxtaW51cy8+XCJcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgIHRoZU9wID0gXCI8dGltZXMvPlwiXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICB0aGVPcCA9IFwiPGRpdmlkZS8+XCJcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgICAgICAgIHRoZU9wID0gXCI8cG93ZXIvPlwiXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgdGhlU3RyID0gXCI8YXBwbHk+XCIgKyB0aGVPcCArIG9wQVN0ciArIG9wQlN0ciArIFwiPC9hcHBseT5cIjtcblxuICAgICAgICByZXR1cm4odGhlU3RyKTtcbiAgICB9XG5cbiAgICBvcGVyYXRlVG9UZVgoKSB7XG4gICAgICAgIHZhciBvcFN0cmluZyA9IHRoaXMub3A7XG5cbiAgICAgICAgc3dpdGNoIChvcFN0cmluZykge1xuICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgb3BTdHJpbmcgPSAnXFxcXHRpbWVzICc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICBvcFN0cmluZyA9ICdcXFxcZGl2ICc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICAgICAgICBvcFN0cmluZyA9ICdcXFxcd2VkZ2UgJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3wnOlxuICAgICAgICAgICAgICAgIG9wU3RyaW5nID0gJ1xcXFxoYm94eyBvciB9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyQnOlxuICAgICAgICAgICAgICAgIG9wU3RyaW5nID0gJ1xcXFxoYm94eyBvciB9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyYnOlxuICAgICAgICAgICAgICAgIG9wU3RyaW5nID0gJ1xcXFxoYm94eyBhbmQgfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ob3BTdHJpbmcpO1xuICAgIH1cblxuICAgIGlzQ29tbXV0YXRpdmUoKSB7XG4gICAgICAgIHZhciBjb21tdXRlcyA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5vcCA9PT0gJysnIHx8IHRoaXMub3AgPT09ICcqJykge1xuICAgICAgICAgICAgY29tbXV0ZXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihjb21tdXRlcyk7XG4gICAgfVxuXG4gICAgZXZhbHVhdGUoYmluZGluZ3MpIHtcbiAgICAgICAgdmFyIGlucHV0QVZhbCA9IHRoaXMuaW5wdXRzWzBdLmV2YWx1YXRlKGJpbmRpbmdzKTtcbiAgICAgICAgdmFyIGlucHV0QlZhbCA9IHRoaXMuaW5wdXRzWzFdLmV2YWx1YXRlKGJpbmRpbmdzKTtcblxuICAgICAgICBpZiAoaW5wdXRBVmFsID09IHVuZGVmaW5lZCB8fCBpbnB1dEJWYWwgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4odW5kZWZpbmVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXRWYWwgPSB1bmRlZmluZWQ7XG4gICAgICAgIHN3aXRjaCAodGhpcy5vcCkge1xuICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gaW5wdXRBVmFsICsgaW5wdXRCVmFsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gaW5wdXRBVmFsIC0gaW5wdXRCVmFsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gaW5wdXRBVmFsICogaW5wdXRCVmFsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gaW5wdXRBVmFsIC8gaW5wdXRCVmFsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnXic6XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlucHV0c1sxXS5pc0NvbnN0YW50KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5leHAoaW5wdXRCVmFsICogTWF0aC5sb2coaW5wdXRBVmFsKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0QVZhbCA+PSAwIHx8IChpbnB1dEJWYWwgJSAxID09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLnBvdyhpbnB1dEFWYWwsaW5wdXRCVmFsKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGguZXhwKGlucHV0QlZhbCAqIE1hdGgubG9nKGlucHV0QVZhbCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnPSc6XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gKE1hdGguYWJzKGlucHV0QVZhbCAtIGlucHV0QlZhbCkgPCB0aGlzLm1lbnYub3B0aW9ucy5hYnNUb2wpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnJic6XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gaW5wdXRBVmFsICYmIGlucHV0QlZhbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3wnOlxuICAgICAgICAgICAgY2FzZSAnJCc6XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gaW5wdXRBVmFsIHx8IGlucHV0QlZhbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGUgYmluYXJ5IG9wZXJhdG9yICdcIiArIHRoaXMub3AgKyBcIicgaXMgbm90IGRlZmluZWQuXCIpO1xuICAgICAgICAgICAgICAgIHJldFZhbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ocmV0VmFsKTtcbiAgICB9XG5cbiAgICAvLyBTZWUgaWYgdGhpcyBvcGVyYXRvciBpcyBub3cgcmVkdW5kYW50LlxuICAgIC8vIFJldHVybiB0aGUgcmVzdWx0aW5nIGV4cHJlc3Npb24uXG4gICAgcmVkdWNlKCkge1xuICAgICAgICB2YXIgbmV3RXhwciA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLmlucHV0cy5sZW5ndGggPD0gMSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gU3VtIHdpdGggbm8gZWxlbWVudHMgPSAwXG4gICAgICAgICAgICAgICAgLy8gUHJvZHVjdCB3aXRoIG5vIGVsZW1lbnRzID0gMVxuICAgICAgICAgICAgICAgIG5ld0V4cHIgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCB0aGlzLm9wID09ICcrJyA/IDAgOiAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gU3VtIG9yIHByb2R1Y3Qgd2l0aCBvbmUgZWxlbWVudCAqaXMqIHRoYXQgZWxlbWVudC5cbiAgICAgICAgICAgICAgICBuZXdFeHByID0gdGhpcy5pbnB1dHNbMF0ucmVkdWNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdFeHByLnBhcmVudCA9IHRoaXMucGFyZW50O1xuICAgICAgICAgICAgaWYgKHRoaXMucGFyZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuaW5wdXRTdWJzdCh0aGlzLCBuZXdFeHByKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4obmV3RXhwcik7XG4gICAgfVxuXG4gICAgc2ltcGxpZnlDb25zdGFudHMoKSB7XG4gICAgICAgIHZhciByZXRWYWwgPSB0aGlzO1xuICAgICAgICB0aGlzLmlucHV0c1swXSA9IHRoaXMuaW5wdXRzWzBdLnNpbXBsaWZ5Q29uc3RhbnRzKCk7XG4gICAgICAgIHRoaXMuaW5wdXRzWzBdLnBhcmVudCA9IHRoaXM7XG4gICAgICAgIHRoaXMuaW5wdXRzWzFdID0gdGhpcy5pbnB1dHNbMV0uc2ltcGxpZnlDb25zdGFudHMoKTtcbiAgICAgICAgdGhpcy5pbnB1dHNbMV0ucGFyZW50ID0gdGhpcztcbiAgICAgICAgaWYgKCh0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgIHx8ICh0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLnVub3AgJiYgdGhpcy5pbnB1dHNbMF0uaW5wdXRzWzBdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyKVxuICAgICAgICAgICAgKSAmJlxuICAgICAgICAgICAgKHRoaXMuaW5wdXRzWzFdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgfHwgKHRoaXMuaW5wdXRzWzFdLnR5cGUgPT0gZXhwclR5cGUudW5vcCAmJiB0aGlzLmlucHV0c1sxXS5pbnB1dHNbMF0udHlwZSA9PSBleHByVHlwZS5udW1iZXIpXG4gICAgICAgICAgICApKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgbnVtQSwgbnVtQiwgdGhlTnVtYmVyO1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzWzBdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgbnVtQSA9IHRoaXMuaW5wdXRzWzBdLm51bWJlcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmlucHV0c1swXS5vcCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bUEgPSB0aGlzLmlucHV0c1swXS5pbnB1dHNbMF0ubnVtYmVyLmFkZEludmVyc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bUEgPSB0aGlzLmlucHV0c1swXS5pbnB1dHNbMF0ubnVtYmVyLm11bHRJbnZlcnNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbMV0udHlwZSA9PSBleHByVHlwZS5udW1iZXIpIHtcbiAgICAgICAgICAgICAgICBudW1CID0gdGhpcy5pbnB1dHNbMV0ubnVtYmVyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMuaW5wdXRzWzFdLm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgICAgICAgICAgbnVtQiA9IHRoaXMuaW5wdXRzWzFdLmlucHV0c1swXS5udW1iZXIuYWRkSW52ZXJzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgbnVtQiA9IHRoaXMuaW5wdXRzWzFdLmlucHV0c1swXS5udW1iZXIubXVsdEludmVyc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5vcCkge1xuICAgICAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgICAgICB0aGVOdW1iZXIgPSBudW1BLmFkZChudW1CKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgICAgIHRoZU51bWJlciA9IG51bUEuc3VidHJhY3QobnVtQik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgICAgICB0aGVOdW1iZXIgPSBudW1BLm11bHRpcGx5KG51bUIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICAgICAgdGhlTnVtYmVyID0gbnVtQS5kaXZpZGUobnVtQik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgICAgICAgICAgICAvLyBJbnRlZ2VyIHBvd2VycyBvZiBhIHJhdGlvbmFsIG51bWJlciBjYW4gYmUgcmVwcmVzZW50ZWQgZXhhY3RseS5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG51bUEgaW5zdGFuY2VvZiByYXRpb25hbF9udW1iZXIgJiYgbnVtQiBpbnN0YW5jZW9mIHJhdGlvbmFsX251bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIG51bUIucSA9PSAxICYmIG51bUIucCAlIDEgPT0gMCAmJiBudW1CLnAgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVOdW1iZXIgPSBuZXcgcmF0aW9uYWxfbnVtYmVyKE1hdGgucG93KG51bUEucCwgbnVtQi5wKSwgTWF0aC5wb3cobnVtQS5xLCBudW1CLnApKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGVOdW1iZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5tZW52Lm9wdGlvbnMubmVnYXRpdmVOdW1iZXJzICYmIHRoZU51bWJlci5wIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBuZXcgdW5vcF9leHByKHRoaXMubWVudiwgJy0nLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCB0aGVOdW1iZXIubXVsdGlwbHkoLTEpKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gbmV3IHNjYWxhcl9leHByKHRoaXMubWVudiwgdGhlTnVtYmVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICAgICAgLy8gU2ltcGxpZnkgMCthXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzWzBdLm51bWJlci52YWx1ZSgpPT0wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSB0aGlzLmlucHV0c1sxXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBTaW1wbGlmeSBhKzBcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5pbnB1dHNbMV0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1sxXS5udW1iZXIudmFsdWUoKSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSB0aGlzLmlucHV0c1swXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICAgICAgLy8gU2ltcGxpZnkgMC1hXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzWzBdLm51bWJlci52YWx1ZSgpPT0wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBuZXcgdW5vcF9leHByKHRoaXMubWVudiwgXCItXCIsIHRoaXMuaW5wdXRzWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBTaW1wbGlmeSBhLTBcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5pbnB1dHNbMV0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1sxXS5udW1iZXIudmFsdWUoKSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSB0aGlzLmlucHV0c1swXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICAgICAgLy8gU2ltcGxpZnkgMSphXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzWzBdLm51bWJlci52YWx1ZSgpPT0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSB0aGlzLmlucHV0c1sxXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBTaW1wbGlmeSBhKjFcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5pbnB1dHNbMV0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1sxXS5udW1iZXIudmFsdWUoKSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSB0aGlzLmlucHV0c1swXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICAgICAgLy8gU2ltcGxpZnkgMS9hIHRvIHVuYXJ5IG9wZXJhdG9yIG9mIG11bHRpcGxpY2F0aXZlIGludmVyc2UuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzWzBdLm51bWJlci52YWx1ZSgpPT0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBuZXcgdW5vcF9leHByKHRoaXMubWVudiwgXCIvXCIsIHRoaXMuaW5wdXRzWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBTaW1wbGlmeSBhLzFcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5pbnB1dHNbMV0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1sxXS5udW1iZXIudmFsdWUoKSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSB0aGlzLmlucHV0c1swXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICAgICAgICAgICAgLy8gU2ltcGxpZnkgMF5wXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzWzBdLm51bWJlci52YWx1ZSgpPT0wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBTaW1wbGlmeSAxXnBcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5pbnB1dHNbMF0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1swXS5udW1iZXIudmFsdWUoKSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBTaW1wbGlmeSBwXjFcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5pbnB1dHNbMV0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1sxXS5udW1iZXIudmFsdWUoKSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSB0aGlzLmlucHV0c1swXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ocmV0VmFsKTtcbiAgICB9XG5cbiAgICBmbGF0dGVuKCkge1xuICAgICAgICB2YXIgaW5BID0gdGhpcy5pbnB1dHNbMF0uZmxhdHRlbigpO1xuICAgICAgICB2YXIgaW5CID0gdGhpcy5pbnB1dHNbMV0uZmxhdHRlbigpO1xuXG4gICAgICAgIHZhciByZXRWYWw7XG4gICAgICAgIHN3aXRjaCAodGhpcy5vcCkge1xuICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXRzID0gW107XG4gICAgICAgICAgICAgICAgaWYgKChpbkEudHlwZSA9PSBleHByVHlwZS5tdWx0aW9wIHx8IGluQS50eXBlID09IGV4cHJUeXBlLmJpbm9wKVxuICAgICAgICAgICAgICAgICAgICAmJiAoaW5BLm9wID09ICcrJyB8fCBpbkEub3AgPT0gJy0nKSkgXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3SW5wdXQgPSBpbkEuZmxhdHRlbigpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG5ld0lucHV0LmlucHV0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzLnB1c2gobmV3SW5wdXQuaW5wdXRzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKGluQSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgoaW5CLnR5cGUgPT0gZXhwclR5cGUubXVsdGlvcCB8fCBpbkIudHlwZSA9PSBleHByVHlwZS5iaW5vcClcbiAgICAgICAgICAgICAgICAgICAgJiYgKGluQi5vcCA9PSAnKycgfHwgaW5CLm9wID09ICctJykpIFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0lucHV0ID0gaW5CLmZsYXR0ZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBuZXdJbnB1dC5pbnB1dHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKG5ld0lucHV0LmlucHV0c1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vcCA9PSAnLScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoaW5CLnR5cGUgPT0gZXhwclR5cGUubXVsdGlvcCB8fCBpbkIudHlwZSA9PSBleHByVHlwZS5iaW5vcClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAoaW5CLm9wID09ICcrJyB8fCBpbkIub3AgPT0gJy0nKSkgXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0lucHV0ID0gaW5CLmZsYXR0ZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG5ld0lucHV0LmlucHV0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dHMucHVzaChuZXcgdW5vcF9leHByKHRoaXMubWVudiwgJy0nLG5ld0lucHV0LmlucHV0c1tpXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzLnB1c2gobmV3IHVub3BfZXhwcih0aGlzLm1lbnYsICctJyxpbkIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKGluQik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gbmV3IG11bHRpb3BfZXhwcih0aGlzLm1lbnYsICcrJywgaW5wdXRzKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0cyA9IFtdO1xuICAgICAgICAgICAgICAgIGlmICgoaW5BLnR5cGUgPT0gZXhwclR5cGUubXVsdGlvcCB8fCBpbkEudHlwZSA9PSBleHByVHlwZS5iaW5vcClcbiAgICAgICAgICAgICAgICAgICAgJiYgKGluQS5vcCA9PSAnKicgfHwgaW5BLm9wID09ICcvJykpIFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0lucHV0ID0gaW5BLmZsYXR0ZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBuZXdJbnB1dC5pbnB1dHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKG5ld0lucHV0LmlucHV0c1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dHMucHVzaChpbkEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoKGluQi50eXBlID09IGV4cHJUeXBlLm11bHRpb3AgfHwgaW5CLnR5cGUgPT0gZXhwclR5cGUuYmlub3ApXG4gICAgICAgICAgICAgICAgICAgICYmIChpbkIub3AgPT0gJyonIHx8IGluQi5vcCA9PSAnLycpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0lucHV0ID0gaW5CLmZsYXR0ZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBuZXdJbnB1dC5pbnB1dHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKG5ld0lucHV0LmlucHV0c1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vcCA9PSAnLycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoaW5CLnR5cGUgPT0gZXhwclR5cGUubXVsdGlvcCB8fCBpbkIudHlwZSA9PSBleHByVHlwZS5iaW5vcClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAoaW5CLm9wID09ICcqJyB8fCBpbkIub3AgPT0gJy8nKSkgXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0lucHV0ID0gaW5CLmZsYXR0ZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG5ld0lucHV0LmlucHV0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dHMucHVzaChuZXcgdW5vcF9leHByKHRoaXMubWVudiwgJy8nLG5ld0lucHV0LmlucHV0c1tpXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzLnB1c2gobmV3IHVub3BfZXhwcih0aGlzLm1lbnYsICcvJyxpbkIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKGluQik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gbmV3IG11bHRpb3BfZXhwcih0aGlzLm1lbnYsICcqJywgaW5wdXRzKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gbmV3IGJpbm9wX2V4cHIodGhpcy5tZW52LCB0aGlzLm9wLCBpbkEsIGluQik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHJldFZhbCk7XG4gICAgfVxuXG4gICAgY29weSgpIHtcbiAgICAgIHZhciBpbkEgPSB0aGlzLmlucHV0c1swXS5jb3B5KCk7XG4gICAgICB2YXIgaW5CID0gdGhpcy5pbnB1dHNbMV0uY29weSgpO1xuICAgICAgcmV0dXJuIChuZXcgYmlub3BfZXhwcih0aGlzLm1lbnYsIHRoaXMub3AsIGluQSwgaW5CKSk7XG4gICAgfVxuXG4gICAgY29tcG9zZShiaW5kaW5ncykge1xuICAgICAgICB2YXIgaW5BID0gdGhpcy5pbnB1dHNbMF0uY29tcG9zZShiaW5kaW5ncyk7XG4gICAgICAgIHZhciBpbkIgPSB0aGlzLmlucHV0c1sxXS5jb21wb3NlKGJpbmRpbmdzKTtcblxuICAgICAgICB2YXIgcmV0VmFsO1xuICAgICAgICByZXRWYWwgPSBuZXcgYmlub3BfZXhwcih0aGlzLm1lbnYsIHRoaXMub3AsIGluQSwgaW5CKTtcbiAgICAgICAgaWYgKGluQS50eXBlID09IGV4cHJUeXBlLm51bWJlciAmJiBpbkIudHlwZSA9PSBleHByVHlwZS5udW1iZXIpIHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5vcCkge1xuICAgICAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCBpbkEubnVtYmVyLmFkZChpbkIubnVtYmVyKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCBpbkEubnVtYmVyLnN1YnRyYWN0KGluQi5udW1iZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLm1lbnYsIGluQS5udW1iZXIubXVsdGlwbHkoaW5CLm51bWJlcikpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gbmV3IHNjYWxhcl9leHByKHRoaXMubWVudiwgaW5BLm51bWJlci5kaXZpZGUoaW5CLm51bWJlcikpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ocmV0VmFsKTtcbiAgICB9XG5cbiAgICBkZXJpdmF0aXZlKGl2YXIsIHZhckxpc3QpIHtcbiAgICAgICAgdmFyIHVDb25zdCA9IHRoaXMuaW5wdXRzWzBdLmlzQ29uc3RhbnQoKTtcbiAgICAgICAgdmFyIHZDb25zdCA9IHRoaXMuaW5wdXRzWzFdLmlzQ29uc3RhbnQoKTtcblxuICAgICAgICB2YXIgdGhlRGVyaXY7XG4gICAgICAgIGlmICh1Q29uc3QgJiYgdkNvbnN0KSB7XG4gICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLm1lbnYsIDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGR1ZHgsIGR2ZHg7XG5cbiAgICAgICAgICAgIGlmICh1Q29uc3QpIHtcbiAgICAgICAgICAgICAgICBkdWR4ID0gbmV3IHNjYWxhcl9leHByKHRoaXMubWVudiwgMCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGR1ZHggPSB0aGlzLmlucHV0c1swXS5kZXJpdmF0aXZlKGl2YXIsIHZhckxpc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZDb25zdCkge1xuICAgICAgICAgICAgICAgIGR2ZHggPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCAwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHZkeCA9IHRoaXMuaW5wdXRzWzFdLmRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgYmlub3BfZXhwcih0aGlzLm1lbnYsICcrJywgZHVkeCwgZHZkeCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyBiaW5vcF9leHByKHRoaXMubWVudiwgJy0nLCBkdWR4LCBkdmR4KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgICAgIHZhciB1ZHYgPSBuZXcgYmlub3BfZXhwcih0aGlzLm1lbnYsICcqJywgdGhpcy5pbnB1dHNbMF0sIGR2ZHgpXG4gICAgICAgICAgICAgICAgICAgIHZhciB2ZHUgPSBuZXcgYmlub3BfZXhwcih0aGlzLm1lbnYsICcqJywgZHVkeCwgdGhpcy5pbnB1dHNbMV0pXG4gICAgICAgICAgICAgICAgICAgIGlmICh1Q29uc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZURlcml2ID0gdWR2O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZDb25zdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSB2ZHU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyBiaW5vcF9leHByKHRoaXMubWVudiwgJysnLCB2ZHUsIHVkdik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgICAgIGlmICh2Q29uc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZURlcml2ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5tZW52LCAnLycsIGR1ZHgsIHRoaXMuaW5wdXRzWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh1Q29uc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBudW1lciA9IG5ldyB1bm9wX2V4cHIodGhpcy5tZW52LCAnLScsIG5ldyBiaW5vcF9leHByKHRoaXMubWVudiwgJyonLCB0aGlzLmlucHV0c1swXSwgZHZkeCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlbm9tID0gbmV3IGJpbm9wX2V4cHIodGhpcy5tZW52LCAnXicsIHRoaXMuaW5wdXRzWzFdLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCAyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyBiaW5vcF9leHByKHRoaXMubWVudiwgJy8nLCBudW1lciwgZGVub20pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVkdiA9IG5ldyBiaW5vcF9leHByKHRoaXMubWVudiwgJyonLCB0aGlzLmlucHV0c1swXSwgZHZkeClcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ZHUgPSBuZXcgYmlub3BfZXhwcih0aGlzLm1lbnYsICcqJywgZHVkeCwgdGhpcy5pbnB1dHNbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbnVtZXIgPSBuZXcgYmlub3BfZXhwcih0aGlzLm1lbnYsICctJywgdmR1LCB1ZHYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlbm9tID0gbmV3IGJpbm9wX2V4cHIodGhpcy5tZW52LCAnXicsIHRoaXMuaW5wdXRzWzFdLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCAyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyBiaW5vcF9leHByKHRoaXMubWVudiwgJy8nLCBudW1lciwgZGVub20pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgICAgICAgICAgICB2YXIgcG93RGVwID0gdGhpcy5pbnB1dHNbMV0uZGVwZW5kZW5jaWVzKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpdmFyTmFtZSA9ICh0eXBlb2YgaXZhciA9PSAnc3RyaW5nJykgPyBpdmFyIDogaXZhci5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAvLyBTZWUgaWYgdGhlIHBvd2VyIGRlcGVuZHMgb24gdGhlIHZhcmlhYmxlXG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3dEZXAubGVuZ3RoID4gMCAmJiBwb3dEZXAuaW5kZXhPZihpdmFyTmFtZSkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZUFyZyA9IG5ldyBiaW5vcF9leHByKHRoaXMubWVudiwgJyonLCB0aGlzLmlucHV0c1sxXSwgbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5tZW52LCAnbG9nJywgdGhpcy5pbnB1dHNbMF0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGVGY24gPSBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLm1lbnYsICdleHAnLCB0aGVBcmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSB0aGVGY24uZGVyaXZhdGl2ZShpdmFyLCB2YXJMaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlIHRoaXMgaXMgYSBzaW1wbGUgYXBwbGljYXRpb24gb2YgdGhlIHBvd2VyIHJ1bGVcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdUNvbnN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3UG93ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5tZW52LCAnLScsIHRoaXMuaW5wdXRzWzFdLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCAxKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZHlkdSA9IG5ldyBiaW5vcF9leHByKHRoaXMubWVudiwgJyonLCB0aGlzLmlucHV0c1sxXSwgbmV3IGJpbm9wX2V4cHIodGhpcy5tZW52LCAnXicsIHRoaXMuaW5wdXRzWzBdLCBuZXdQb3cpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLnZhcmlhYmxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzWzBdLm5hbWUgPT0gaXZhck5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IGR5ZHU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkdWR4ID0gdGhpcy5pbnB1dHNbMF0uZGVyaXZhdGl2ZShpdmFyLCB2YXJMaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyBiaW5vcF9leHByKHRoaXMubWVudiwgJyonLCBkeWR1LCBkdWR4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZURlcml2ID0gbmV3IHNjYWxhcl9leHByKHRoaXMubWVudiwgMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGUgYmluYXJ5IG9wZXJhdG9yICdcIiArIHRoaXMub3AgKyBcIicgaXMgbm90IGRlZmluZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHRoZURlcml2KTtcbiAgICB9XG59XG4iLCIvKiFcbiAqIEJUTSBKYXZhU2NyaXB0IExpYnJhcnkgdkBWRVJTSU9OXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGJyaWFud2FsdG9uL0JUTVxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogRGVmaW5lIHRoZSBEZXJpdmF0aXZlIG9mIGFuIEV4cHJlc3Npb25cbiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmltcG9ydCB7IGV4cHJlc3Npb24gfSBmcm9tIFwiLi9leHByZXNzaW9uLmpzXCJcbmltcG9ydCB7IHZhcmlhYmxlX2V4cHIgfSBmcm9tIFwiLi92YXJpYWJsZV9leHByLmpzXCJcbmltcG9ydCB7IGV4cHJUeXBlIH0gZnJvbSBcIi4vQlRNX3Jvb3QuanNcIlxuXG5leHBvcnQgY2xhc3MgZGVyaXZfZXhwciBleHRlbmRzIGV4cHJlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKG1lbnYsIGZvcm11bGEsIHZhcmlhYmxlLCBhdFZhbHVlKSB7XG4gICAgICAgIHN1cGVyKG1lbnYpO1xuICAgICAgICB0aGlzLnR5cGUgPSBleHByVHlwZS5vcGVyYXRvcjtcbiAgICAgICAgdGhpcy5vcCA9IFwiRFwiO1xuICAgICAgICBpZiAodHlwZW9mIGZvcm11bGEgPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICBmb3JtdWxhID0gbmV3IGV4cHJlc3Npb24obWVudik7XG4gICAgICAgIGlmICh0eXBlb2YgdmFyaWFibGUgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHZhcmlhYmxlID0gbmV3IHZhcmlhYmxlX2V4cHIobWVudiwgJ3gnKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFyaWFibGUgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhcmlhYmxlID0gbmV3IHZhcmlhYmxlX2V4cHIobWVudiwgdmFyaWFibGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXZhciA9IHZhcmlhYmxlO1xuICAgICAgICB0aGlzLml2YXJWYWx1ZSA9IGF0VmFsdWU7XG4gICAgICAgIHRoaXMuaW5wdXRzID0gW2Zvcm11bGFdO1xuICAgICAgICB0aGlzLmlzUmF0ZSA9IGZhbHNlO1xuICAgICAgICBmb3JtdWxhLnBhcmVudCA9IHRoaXM7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHZhciB0aGVTdHI7XG4gICAgICAgIHZhciBleHByU3RyLCB2YXJTdHIsIHZhbFN0cjtcblxuICAgICAgICB2YXJTdHIgPSB0aGlzLml2YXIudG9TdHJpbmcoKTtcbiAgICAgICAgZXhwclN0ciA9IHRoaXMuaW5wdXRzWzBdLnRvU3RyaW5nKCk7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pdmFyVmFsdWUgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHZhbFN0ciA9IHRoaXMuaXZhclZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB0aGVTdHIgPSBcIkQoXCIrZXhwclN0citcIixcIit2YXJTdHIrXCIsXCIrdmFsU3RyK1wiKVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhlU3RyID0gXCJEKFwiK2V4cHJTdHIrXCIsXCIrdmFyU3RyK1wiKVwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybih0aGVTdHIpO1xuICAgIH1cblxuICAgIHRvVGVYKHNob3dTZWxlY3QpIHtcbiAgICAgICAgdmFyIHRoZVN0cjtcbiAgICAgICAgdmFyIG9wU3RyLCB2YXJTdHIsIGV4cHJTdHIsIHZhbFN0cjtcblxuICAgICAgICB2YXJTdHIgPSB0aGlzLml2YXIudG9UZVgoKTtcbiAgICAgICAgZXhwclN0ciA9IHRoaXMuaW5wdXRzWzBdLnRvVGVYKCk7XG4gICAgICAgIGlmICh0aGlzLmlzUmF0ZSAmJiB0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLnZhcmlhYmxlKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuaXZhclZhbHVlICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgdmFsU3RyID0gdGhpcy5pdmFyVmFsdWUudG9UZVgoKTtcbiAgICAgICAgICAgICAgICB0aGVTdHIgPSBcIlxcXFxsZWZ0LiBcXFxcZnJhY3tkXCIgKyBleHByU3RyICsgXCJ9e2RcIit2YXJTdHIrXCJ9IFxcXFxyaWdodHxfe1wiXG4gICAgICAgICAgICAgICAgICAgICsgdmFyU3RyICsgXCI9XCIgKyB2YWxTdHIgKyBcIn1cIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhlU3RyID0gXCJcXFxcZnJhY3tkXCIgKyBleHByU3RyICtcIn17ZFwiK3ZhclN0citcIn1cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5pdmFyVmFsdWUgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICB2YWxTdHIgPSB0aGlzLml2YXJWYWx1ZS50b1RlWCgpO1xuICAgICAgICAgICAgICAgIG9wU3RyID0gXCJcXFxcbGVmdC4gXFxcXGZyYWN7ZH17ZFwiK3ZhclN0citcIn0gXFxcXHJpZ2h0fF97XCJcbiAgICAgICAgICAgICAgICAgICAgKyB2YXJTdHIgKyBcIj1cIiArIHZhbFN0ciArIFwifVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvcFN0ciA9IFwiXFxcXGZyYWN7ZH17ZFwiK3ZhclN0citcIn1cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoZVN0ciA9IG9wU3RyICsgXCJcXFxcQmlnW1wiICsgZXhwclN0ciArIFwiXFxcXEJpZ11cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4odGhlU3RyKTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgdGVzdGVkIGVxdWl2YWxlbnQgc3RyaW5ncy5cbiAgICBhbGxTdHJpbmdFcXVpdnMoKSB7XG4gICAgICAgIHZhciBhbGxJbnB1dHMgPSB0aGlzLmlucHV0c1swXS5hbGxTdHJpbmdFcXVpdnMoKTtcbiAgICAgICAgdmFyIHZhclN0ciwgdmFsU3RyO1xuICAgICAgICB2YXIgcmV0VmFsdWUgPSBbXTtcblxuICAgICAgICB2YXJTdHIgPSB0aGlzLml2YXIudG9TdHJpbmcoKTtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLml2YXJWYWx1ZSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdmFsU3RyID0gdGhpcy5pdmFyVmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpIGluIGFsbElucHV0cykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLml2YXJWYWx1ZSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHJldFZhbHVlW2ldID0gXCJEKFwiK2FsbElucHV0c1tpXStcIixcIit2YXJTdHIrXCIsXCIrdmFsU3RyK1wiKVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXRWYWx1ZVtpXSA9IFwiRChcIithbGxJbnB1dHNbaV0rXCIsXCIrdmFyU3RyK1wiKVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKGFsbElucHV0cyk7XG4gICAgfVxuXG4gICAgdG9NYXRoTUwoKSB7XG4gICAgICAgIHZhciB0aGVTdHI7XG4gICAgICAgIHZhciBleHByU3RyO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dHNbMF0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGV4cHJTdHIgPSAnPyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHByU3RyID0gdGhpcy5pbnB1dHNbMF0udG9NYXRoTUwoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGVTdHIgPSBcIjxhcHBseT48ZGVyaXZhdGl2ZS8+XCIgKyBleHByU3RyICsgXCI8L2FwcGx5PlwiO1xuXG4gICAgICAgIHJldHVybih0aGVTdHIpO1xuICAgIH1cblxuICAgIGV2YWx1YXRlKGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciByZXRWYWw7XG4gICAgICAgIHZhciBkZXJpdkV4cHI7XG4gICAgICAgIHZhciBkYmluZCA9IHt9O1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pdmFyVmFsdWUgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGRiaW5kW3RoaXMuaXZhci5uYW1lXSA9IHRoaXMuaXZhclZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIENvbXB1dGUgdGhlIGRlcml2YXRpdmUgb2YgdGhlIGV4cHJlc3Npb24sIHRoZW4gZXZhbHVhdGUgYXQgYmluZGluZ1xuICAgICAgICBkZXJpdkV4cHIgPSB0aGlzLmlucHV0c1swXS5kZXJpdmF0aXZlKHRoaXMuaXZhciwgYmluZGluZ3MpO1xuICAgICAgICBkZXJpdkV4cHIgPSBkZXJpdkV4cHIuY29tcG9zZShkYmluZCk7XG4gICAgICAgIHJldFZhbCA9IGRlcml2RXhwci5ldmFsdWF0ZShiaW5kaW5ncyk7XG4gICAgICAgIHJldHVybihyZXRWYWwpO1xuICAgIH1cblxuICAgIHNpbXBsaWZ5Q29uc3RhbnRzKCkge1xuICAgICAgICByZXR1cm4odGhpcyk7XG4gICAgfVxuXG4gICAgZmxhdHRlbigpIHtcbiAgICAgIHJldHVybiAobmV3IGRlcml2X2V4cHIodGhpcy5tZW52LCB0aGlzLmlucHV0c1swXS5mbGF0dGVuKCksIHRoaXMuaXZhciwgdGhpcy5pdmFyVmFsdWUpKTtcbiAgICB9XG5cbiAgICBjb3B5KCkge1xuICAgICAgcmV0dXJuIChuZXcgZGVyaXZfZXhwcih0aGlzLm1lbnYsIHRoaXMuaW5wdXRzWzBdLmNvcHkoKSwgdGhpcy5pdmFyLCB0aGlzLml2YXJWYWx1ZSkpO1xuICAgIH1cblxuXG4gICAgY29tcG9zZShiaW5kaW5ncykge1xuICAgIH1cblxuICAgIGRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCkge1xuICAgICAgICB2YXIgZGJpbmQgPSB7fTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaXZhclZhbHVlICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBkYmluZFt0aGlzLml2YXJdID0gdGhpcy5pdmFyVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRXZhbHVhdGUgdGhlIG1haW4gZXhwcmVzc2lvbiB1c2luZyBvcmlnaW5hbCBiaW5kaW5nXG4gICAgICAgIHZhciBmaXJzdERlcml2ID0gdGhpcy5pbnB1dHNbMF0uZGVyaXZhdGl2ZSh0aGlzLml2YXIsIHZhckxpc3QpO1xuICAgICAgICBmaXJzdERlcml2LmNvbXBvc2UoZGJpbmQpO1xuXG4gICAgICAgIC8vIE5vdyBkaWZmZXJlbnRpYXRlIHRoYXQgZXhwcmVzc2lvbiB1c2luZyBuZXcgYmluZGluZy5cbiAgICAgICAgcmV0dXJuIGZpcnN0RGVyaXYuZGVyaXZhdGl2ZShpdmFyLCB2YXJMaXN0KTtcbiAgICB9XG59XG4iLCIvKiFcbiAqIEJUTSBKYXZhU2NyaXB0IExpYnJhcnkgdkBWRVJTSU9OXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGJyaWFud2FsdG9uL0JUTVxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG5pbXBvcnQgeyBNRU5WLCBleHByVmFsdWUgfSBmcm9tIFwiLi9CVE1fcm9vdC5qc1wiXG5pbXBvcnQgeyBmaW5kTWF0Y2hSdWxlcyB9IGZyb20gXCIuL3JlZHVjdGlvbnMuanNcIlxuXG5leHBvcnQgY2xhc3MgTWF0aE9iamVjdCB7XG4gICAgY29uc3RydWN0b3IobWVudikge1xuICAgICAgICB0aGlzLm1lbnYgPSBtZW52O1xuXG4gICAgICAgIHRoaXMuc2VsZWN0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5pbnB1dHMgPSBbXTtcbiAgICAgICAgdGhpcy52YWx1ZVR5cGUgPSBleHByVmFsdWUudW5kZWY7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgXG4gICAgLy8gTWV0aG9kIHRvICpldmFsdWF0ZSogdGhlIG9iamVjdC5cbiAgICAvLyAtIFJldHVybiB1bmRlZmluZWRcbiAgICB2YWx1ZShiaW5kaW5ncykge1xuICAgIH1cbiAgICBcbiAgICAvLyBVcGRhdGUgY29udGV4dCBzZXR0aW5nXG4gICAgc2V0Q29udGV4dChjb250ZXh0KSB7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIC8vIFVwZGF0ZSBjb250ZXh0IG9uIGlucHV0cy5cbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgdGhpcy5pbnB1dHNbaV0uc2V0Q29udGV4dChjb250ZXh0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdoZW4gdGhlIHBhcnNlciB0aHJvd3MgYW4gZXJyb3IsIG5lZWQgdG8gcmVjb3JkIGl0LlxuICAgIHNldFBhcnNpbmdFcnJvcihlcnJvclN0cmluZykge1xuICAgICAgICB0aGlzLnBhcnNlRXJyb3IgPSBlcnJvclN0cmluZztcbiAgICB9XG5cbiAgICAvLyBFcnJvcnMgZnJvbSBwYXJzaW5nLiBDaGVjayBhbGwgcG9zc2libGUgY2hpbGRyZW4gKHJlY3Vyc2l2ZWx5KVxuICAgIGhhc1BhcnNpbmdFcnJvcigpIHtcbiAgICAgICAgdmFyIHJldFZhbHVlID0gZmFsc2UsXG4gICAgICAgICAgICBpID0gMDtcbiAgICAgICAgaWYgKHRoaXMucGFyc2VFcnJvcikge1xuICAgICAgICAgICAgcmV0VmFsdWUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKCFyZXRWYWx1ZSAmJiBpIDwgdGhpcy5pbnB1dHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBDaGVjayBmb3IgcmVkdWN0aW9ucyBvbiBpbnB1dHMuXG4gICAgICAgICAgICByZXRWYWx1ZSA9IHRoaXMuaW5wdXRzW2ldLmhhc1BhcnNpbmdFcnJvcigpO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXRWYWx1ZTtcbiAgICB9XG4gICAgXG4gICAgLy8gRXJyb3JzIGZyb20gcGFyc2luZy4gRmluZCB0aGUgKmZpcnN0KiBlcnJvciBpbiB0aGUgcGFyc2luZyBwcm9jZXNzLlxuICAgIGdldFBhcnNpbmdFcnJvcigpIHtcbiAgICAgICAgdmFyIGVyclN0cmluZyA9IHRoaXMucGFyc2VFcnJvcjtcbiAgICAgICAgdmFyIGk9MDtcbiAgICAgICAgd2hpbGUgKCFlcnJTdHJpbmcgJiYgaSA8IHRoaXMuaW5wdXRzLmxlbmd0aCkge1xuICAgICAgICAgICAgZXJyU3RyaW5nID0gdGhpcy5pbnB1dHNbaV0uZ2V0UGFyc2luZ0Vycm9yKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChlcnJTdHJpbmcpO1xuICAgIH1cbiAgICBcbiAgICAvLyBNZXRob2QgdG8gZ2VuZXJhdGUgdGhlIGV4cHJlc3Npb24gYXMgaW5wdXQtc3R5bGUgc3RyaW5nLlxuICAgIHRvU3RyaW5nKGVsZW1lbnRPbmx5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgZWxlbWVudE9ubHkgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGVsZW1lbnRPbmx5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRoZVN0ciA9ICcnO1xuICAgICAgICByZXR1cm4odGhlU3RyKTtcbiAgICB9XG4gICAgXG4gICAgLy8gTWV0aG9kIHRvIGdlbmVyYXRlIHRoZSBleHByZXNzaW9uIHVzaW5nIHByZXNlbnRhdGlvbi1zdHlsZSAoTGFUZVgpXG4gICAgLy8gLSBzaG93U2VsZWN0IGlzIHNvIHRoYXQgcGFydCBvZiB0aGUgZXhwcmVzc2lvbiBjYW4gYmUgaGlnaGxpZ2h0ZWRcbiAgICB0b1RlWChzaG93U2VsZWN0KSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2hvd1NlbGVjdCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgc2hvd1NlbGVjdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybih0aGlzLnRvU3RyaW5nKCkpO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZCB0byByZXByZXNlbnQgdGhlIGV4cHJlc3Npb24gdXNpbmcgTWF0aE1MXG4gICAgdG9NYXRoTUwoKSB7XG4gICAgICAgIHJldHVybihcIjxtaT5cIiArIHRoaXMudG9TdHJpbmcoKSArIFwiPC9taT5cIik7XG4gICAgfVxuICAgIFxuICAgIC8vIFJldHVybiBhbiBhcnJheSBjb250YWluaW5nIGFsbCB0ZXN0ZWQgZXF1aXZhbGVudCBzdHJpbmdzLlxuICAgIGFsbFN0cmluZ0VxdWl2cygpIHtcbiAgICAgICAgcmV0dXJuKFtdKTtcbiAgICB9XG4gICAgXG4gICAgLy8gVG8gY29udmVydCBiaW5hcnkgdHJlZSBzdHJ1Y3R1cmUgdG8gbi1hcnkgdHJlZSBmb3Igc3VwcG9ydGVkIG9wZXJhdGlvbnMgKCsgYW5kICopXG4gICAgLy8gTW9zdCB0aGluZ3MgY2FuJ3QgZmxhdHRlbi4gUmV0dXJuIGEgY29weS5cbiAgICBmbGF0dGVuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb3B5KCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFRlc3QgaWYgdGhlIGV4cHJlc3Npb24gZXZhbHVhdGVzIHRvIGEgY29uc3RhbnQuXG4gICAgaXNDb25zdGFudCgpIHtcbiAgICAgICAgdmFyIHJldFZhbHVlID0gZmFsc2U7XG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFRlc3QgaWYgdGhlIGV4cHJlc3Npb24gZXZhbHVhdGVzIHRvIGEgY29uc3RhbnQuXG4gICAgaXNFeHByZXNzaW9uKCkge1xuICAgICAgICB2YXIgcmV0VmFsdWUgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuKHJldFZhbHVlKTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIGV4cHJlc3Npb24gZXh0ZW5kcyBNYXRoT2JqZWN0IHtcbiAgY29uc3RydWN0b3IobWVudikge1xuICAgICAgICBzdXBlcihtZW52KTtcbiAgICAgICAgdGhpcy5zZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgICAgICB0aGlzLmlucHV0cyA9IFtdO1xuICAgICAgICB0aGlzLnZhbHVlVHlwZSA9IGV4cHJWYWx1ZS5udW1lcmljO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZCB0byAqZXZhbHVhdGUqIHRoZSB2YWx1ZSBvZiB0aGUgZXhwcmVzc2lvbiB1c2luZyBnaXZlbiBzeW1ib2wgYmluZGluZ3MuXG4gICAgLy8gLSBSZXR1cm4gbmF0aXZlIE51bWJlciB2YWx1ZVxuICAgIHZhbHVlKGJpbmRpbmdzKSB7XG4gICAgICAgIHJldHVybih0aGlzLmV2YWx1YXRlKGJpbmRpbmdzKSk7XG4gICAgfVxuXG4gICAgLy8gV2hlbiB0aGUgcGFyc2VyIHRocm93cyBhbiBlcnJvciwgbmVlZCB0byByZWNvcmQgaXQuXG4gICAgc2V0UGFyc2luZ0Vycm9yKGVycm9yU3RyaW5nKSB7XG4gICAgICAgIHRoaXMucGFyc2VFcnJvciA9IGVycm9yU3RyaW5nO1xuICAgIH1cblxuICAgIC8vIEVycm9ycyBmcm9tIHBhcnNpbmcuIENoZWNrIGFsbCBwb3NzaWJsZSBjaGlsZHJlbiAocmVjdXJzaXZlbHkpXG4gICAgaGFzUGFyc2luZ0Vycm9yKCkge1xuICAgICAgICB2YXIgcmV0VmFsdWUgPSBmYWxzZSxcbiAgICAgICAgICAgIGkgPSAwO1xuICAgICAgICBpZiAodGhpcy5wYXJzZUVycm9yKSB7XG4gICAgICAgICAgICByZXRWYWx1ZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoIXJldFZhbHVlICYmIGkgPCB0aGlzLmlucHV0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIGZvciByZWR1Y3Rpb25zIG9uIGlucHV0cy5cbiAgICAgICAgICAgIHJldFZhbHVlID0gdGhpcy5pbnB1dHNbaV0uaGFzUGFyc2luZ0Vycm9yKCk7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldFZhbHVlO1xuICAgIH1cblxuICAgIC8vIEVycm9ycyBmcm9tIHBhcnNpbmcuIEZpbmQgdGhlICpmaXJzdCogZXJyb3IgaW4gdGhlIHBhcnNpbmcgcHJvY2Vzcy5cbiAgICBnZXRQYXJzaW5nRXJyb3IoKSB7XG4gICAgICAgIHZhciBlcnJTdHJpbmcgPSB0aGlzLnBhcnNlRXJyb3I7XG4gICAgICAgIHZhciBpPTA7XG4gICAgICAgIHdoaWxlICghZXJyU3RyaW5nICYmIGkgPCB0aGlzLmlucHV0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGVyclN0cmluZyA9IHRoaXMuaW5wdXRzW2ldLmdldFBhcnNpbmdFcnJvcigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoZXJyU3RyaW5nKTtcbiAgICB9XG5cbiAgICAvLyBNZXRob2QgdG8gZ2VuZXJhdGUgdGhlIGV4cHJlc3Npb24gYXMgaW5wdXQtc3R5bGUgc3RyaW5nLlxuICAgIHRvU3RyaW5nKGVsZW1lbnRPbmx5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgZWxlbWVudE9ubHkgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGVsZW1lbnRPbmx5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRoZVN0ciA9ICcnO1xuICAgICAgICByZXR1cm4odGhlU3RyKTtcbiAgICB9XG5cbiAgICAvLyBNZXRob2QgdG8gZ2VuZXJhdGUgdGhlIGV4cHJlc3Npb24gdXNpbmcgcHJlc2VudGF0aW9uLXN0eWxlIChMYVRlWClcbiAgICAvLyAtIHNob3dTZWxlY3QgaXMgc28gdGhhdCBwYXJ0IG9mIHRoZSBleHByZXNzaW9uIGNhbiBiZSBoaWdobGlnaHRlZFxuICAgIHRvVGVYKHNob3dTZWxlY3QpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzaG93U2VsZWN0ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBzaG93U2VsZWN0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHRoaXMudG9TdHJpbmcoKSk7XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kIHRvIHJlcHJlc2VudCB0aGUgZXhwcmVzc2lvbiB1c2luZyBNYXRoTUxcbiAgICB0b01hdGhNTCgpIHtcbiAgICAgICAgcmV0dXJuKFwiPG1pPlwiICsgdGhpcy50b1N0cmluZygpICsgXCI8L21pPlwiKTtcbiAgICB9XG5cbiAgICBvcGVyYXRlVG9UZVgoKSB7XG4gICAgICAgIHJldHVybih0aGlzLnRvVGVYKCkpO1xuICAgIH1cblxuICAgIHRyZWVUb1RlWChleHBhbmQpIHtcbiAgICAgICAgdmFyIHJldFN0cnVjdCA9IHt9O1xuICAgICAgICBcbiAgICAgICAgcmV0U3RydWN0LnBhcmVudCA9ICh0eXBlb2YgdGhpcy5wYXJlbnQgPT09ICd1bmRlZmluZWQnIHx8IHRoaXMucGFyZW50ID09PSBudWxsKSA/IG51bGwgOiB0aGlzLnBhcmVudC5vcGVyYXRlVG9UZVgoKTtcbiAgICAgICAgaWYgKHR5cGVvZiBleHBhbmQgPT09ICd1bmRlZmluZWQnIHx8ICFleHBhbmQpIHtcbiAgICAgICAgICAgIHJldFN0cnVjdC5jdXJyZW50ID0gdGhpcy50b1RlWCgpO1xuICAgICAgICAgICAgcmV0U3RydWN0LmlucHV0cyA9IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXRTdHJ1Y3QuY3VycmVudCA9IHRoaXMub3BlcmF0ZVRvVGVYKCk7XG4gICAgICAgICAgICByZXRTdHJ1Y3QuaW5wdXRzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICAgICAgcmV0U3RydWN0LmlucHV0c1tpXSA9IHRoaXMuaW5wdXRzW2ldLnRvVGVYKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHJldFN0cnVjdCk7XG4gICAgfVxuXG5cbiAgICAvLyBSZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgdGVzdGVkIGVxdWl2YWxlbnQgc3RyaW5ncy5cbiAgICBhbGxTdHJpbmdFcXVpdnMoKSB7XG4gICAgICAgIHJldHVybihbXSk7XG4gICAgfVxuXG4gICAgLy8gVG8gY29udmVydCBiaW5hcnkgdHJlZSBzdHJ1Y3R1cmUgdG8gbi1hcnkgdHJlZSBmb3Igc3VwcG9ydGVkIG9wZXJhdGlvbnMgKCsgYW5kICopXG4gICAgLy8gTW9zdCB0aGluZ3MgY2FuJ3QgZmxhdHRlbi4gUmV0dXJuIGEgY29weS5cbiAgICBmbGF0dGVuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb3B5KCk7XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIGEgbmV3IGV4cHJlc3Npb24gdGhhdCBpcyBhIGNvcHkuXG4gICAgY29weSgpIHtcbiAgICAgICAgdmFyIG15Q29weSA9IG5ldyBleHByZXNzaW9uKCk7XG4gICAgICAgIG15Q29weS52YWx1ZVR5cGUgPSB0aGlzLnZhbHVlVHlwZTtcbiAgICAgICAgbXlDb3B5LmNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgIG15Q29weS5pbnB1dHNbaV0gPSBteUNvcHkuaW5wdXRzW2ldLmNvcHkoKTtcbiAgICAgICAgICAgIG15Q29weS5pbnB1dHNbaV0ucGFyZW50ID0gbXlDb3B5O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBteUNvcHk7XG4gICAgfVxuXG4gICAgLy8gV2hlbiBzdWJ0cmVlIG9ubHkgaW52b2x2ZXMgY29uc3RhbnRzLCBzaW1wbGlmeSB0aGUgZm9ybXVsYSB0byBhIHZhbHVlLlxuICAgIC8vIERlZmF1bHQ6IExvb2sgYXQgYWxsIGRlc2NlbmRhbnRzIChpbnB1dHMpIGFuZCBzaW1wbGlmeSB0aGVyZS5cbiAgICBzaW1wbGlmeUNvbnN0YW50cygpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgdGhpcy5pbnB1dHNbaV0gPSB0aGlzLmlucHV0c1tpXS5zaW1wbGlmeUNvbnN0YW50cygpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dHNbaV0ucGFyZW50ID0gdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4odGhpcyk7XG4gICAgfVxuXG4gICAgLy8gRmluZCBhbGwgZGVwZW5kZW5jaWVzIChzeW1ib2xzKSByZXF1aXJlZCB0byBldmFsdWF0ZSBleHByZXNzaW9uLlxuICAgIGRlcGVuZGVuY2llcyhmb3JjZWQpIHtcbiAgICAgICAgdmFyIGluRGVwcztcbiAgICAgICAgdmFyIGksIGo7XG4gICAgICAgIHZhciBkZXBBcnJheSA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgIHZhciBtYXN0ZXIgPSB7fTtcbiAgICAgICAgaWYgKGZvcmNlZCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxmb3JjZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkZXBBcnJheS5wdXNoKGZvcmNlZFtpXSk7XG4gICAgICAgICAgICAgICAgbWFzdGVyW2ZvcmNlZFtpXV0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgaW5EZXBzID0gdGhpcy5pbnB1dHNbaV0uZGVwZW5kZW5jaWVzKCk7XG4gICAgICAgICAgICBmb3IgKGogaW4gaW5EZXBzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtYXN0ZXJbaW5EZXBzW2pdXSA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlcEFycmF5LnB1c2goaW5EZXBzW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgbWFzdGVyW2luRGVwc1tqXV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihkZXBBcnJheSk7XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kIHRvIHJldHVybiBpbnB1dCBhdCBnaXZlbiBpbmRleC5cbiAgICBnZXRJbnB1dCh3aGljaElucHV0KSB7XG4gICAgICAgIHZhciBpbnB1dEV4cHIgPSBudWxsO1xuICAgICAgICBpZiAod2hpY2hJbnB1dCA8IDAgfHwgd2hpY2hJbnB1dCA+PSB0aGlzLmlucHV0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRocm93ICdBdHRlbXB0IHRvIGdldCBhbiB1bmRlZmluZWQgaW5wdXQgZXhwcmVzc2lvbi4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5wdXRFeHByID0gdGhpcy5pbnB1dHNbd2hpY2hJbnB1dF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKGlucHV0RXhwcik7XG4gICAgfVxuXG4gICAgLy8gVGVzdCBpZiB0aGUgZXhwcmVzc2lvbiBldmFsdWF0ZXMgdG8gYSBjb25zdGFudC5cbiAgICBpc0NvbnN0YW50KCkge1xuICAgICAgICB2YXIgcmV0VmFsdWUgPSB0cnVlO1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICByZXRWYWx1ZSA9IHJldFZhbHVlICYgdGhpcy5pbnB1dHNbaV0uaXNDb25zdGFudCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gRXZhbHVhdGUgdGhlIGV4cHJlc3Npb24gZ2l2ZW4gdGhlIGJpbmRpbmdzIHRvIHN5bWJvbHMuXG4gICAgZXZhbHVhdGUoYmluZGluZ3MpIHtcbiAgICAgICAgcmV0dXJuKDApO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSBhICpuZXcqIGV4cHJlc3Npb24gd2hlcmUgYSBzeW1ib2wgaXMgKnJlcGxhY2VkKiBieSBhIGJvdW5kIGV4cHJlc3Npb25cbiAgICBjb21wb3NlKGJpbmRpbmdzKSB7XG4gICAgICAgIHJldHVybihuZXcgZXhwcmVzc2lvbigpKTtcbiAgICB9XG5cbiAgICAvLyBDb21wYXJlICp0aGlzKiBleHByZXNzaW9uIHRvIGEgZ2l2ZW4gKnRlc3RFeHByKi5cbiAgICAvLyAqb3B0aW9ucyogZ2l2ZXMgb3B0aW9ucyBhc3NvY2lhdGVkIHdpdGggdGVzdGluZyAoZS5nLiwgcmVsYXRpdmUgdG9sZXJhbmNlKVxuICAgIC8vIGJ1dCBhbHNvIHN1cHBvcnRzIGZpeGluZyBjZXJ0YWluIGJpbmRpbmdzLlxuICAgIC8vIFN1cHBvcnRzIGFic3RyYWN0IGlucHV0IG1hdGNoaW5nIGFnYWluc3QgdmFyaWFibGVzIHVzaW5nICptYXRjaElucHV0cypcbiAgICBjb21wYXJlKHRlc3RFeHByLCBvcHRpb25zLCBtYXRjaElucHV0cykge1xuICAgICAgICB2YXIgaXNFcXVhbCA9IHRydWU7XG4gICAgICAgIHZhciBpLCBuO1xuXG4gICAgICAgIGlmIChtYXRjaElucHV0cyA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG1hdGNoSW5wdXRzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gdGhpcy5tZW52Lm9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGtub3duQmluZGluZ3MgPSBPYmplY3Qua2V5cyhvcHRpb25zKTtcbiAgICAgICAgdmFyIHVua25vd25CaW5kaW5ncyA9IFtdO1xuXG4gICAgICAgIHZhciByVG9sID0gMWUtODtcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnJUb2wgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByVG9sID0gb3B0aW9ucy5yVG9sO1xuICAgICAgICAgICAgaSA9IGtub3duQmluZGluZ3MuaW5kZXhPZignclRvbCcpO1xuICAgICAgICAgICAga25vd25CaW5kaW5ncy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGVwZW5kQSA9IHRoaXMuZGVwZW5kZW5jaWVzKCk7XG4gICAgICAgIHZhciBkZXBlbmRCID0gdGVzdEV4cHIuZGVwZW5kZW5jaWVzKCk7XG5cbiAgICAgICAgZm9yIChpPTA7IGk8ZGVwZW5kQS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGtub3duQmluZGluZ3MuaW5kZXhPZihkZXBlbmRBW2ldKSA8IDBcbiAgICAgICAgICAgICAgICAmJiB1bmtub3duQmluZGluZ3MuaW5kZXhPZihkZXBlbmRBW2ldKSA8IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdW5rbm93bkJpbmRpbmdzLnB1c2goZGVwZW5kQVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpPTA7IGk8ZGVwZW5kQi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGtub3duQmluZGluZ3MuaW5kZXhPZihkZXBlbmRCW2ldKSA8IDBcbiAgICAgICAgICAgICAgICAmJiB1bmtub3duQmluZGluZ3MuaW5kZXhPZihkZXBlbmRCW2ldKSA8IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdW5rbm93bkJpbmRpbmdzLnB1c2goZGVwZW5kQltpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDcmVhdGUgdGhlIGFycmF5cyBvZiB0ZXN0IHBvaW50cy5cbiAgICAgICAgdmFyIHZhcmlhYmxlTGlzdCA9IFtdO1xuICAgICAgICB2YXIgdGVzdFBvaW50TGlzdCA9IFtdO1xuICAgICAgICB2YXIgeCwgeE9wdCwgeE1pbiwgeE1heCwgZHgsIG4sIHRlc3RQb2ludHM7XG4gICAgICAgIG4gPSAxMDtcbiAgICAgICAgZm9yIChpPTA7IGk8a25vd25CaW5kaW5ncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgeCA9IGtub3duQmluZGluZ3NbaV07XG4gICAgICAgICAgICB4T3B0ID0gb3B0aW9uc1t4XTtcbiAgICAgICAgICAgIHhNaW4gPSB4T3B0Lm1pbjtcbiAgICAgICAgICAgIHhNYXggPSB4T3B0Lm1heDtcbiAgICAgICAgICAgIGR4ID0gKHhNYXgteE1pbikvbjtcbiAgICAgICAgICAgIHRlc3RQb2ludHMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGo9MDsgajxuOyBqKyspIHtcbiAgICAgICAgICAgICAgICB0ZXN0UG9pbnRzW2pdID0geE1pbitqKmR4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGVzdFBvaW50c1tuXSA9IHhNYXg7XG5cbiAgICAgICAgICAgIC8vIEFkZCB0aGlzIHRvIHRoZSBsaXN0IG9mIHRlc3RpbmcgYXJyYXlzLlxuICAgICAgICAgICAgdmFyaWFibGVMaXN0LnB1c2goeCk7XG4gICAgICAgICAgICB0ZXN0UG9pbnRMaXN0LnB1c2godGVzdFBvaW50cyk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpPTA7IGk8dW5rbm93bkJpbmRpbmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB4ID0gdW5rbm93bkJpbmRpbmdzW2ldO1xuICAgICAgICAgICAgeE1pbiA9IC0yO1xuICAgICAgICAgICAgeE1heCA9IDI7XG4gICAgICAgICAgICBkeCA9ICh4TWF4LXhNaW4pL247XG4gICAgICAgICAgICB0ZXN0UG9pbnRzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBqPTA7IGo8bjsgaisrKSB7XG4gICAgICAgICAgICAgICAgdGVzdFBvaW50c1tqXSA9IHhNaW4raipkeDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlc3RQb2ludHNbbl0gPSB4TWF4O1xuXG4gICAgICAgICAgICAvLyBBZGQgdGhpcyB0byB0aGUgbGlzdCBvZiB0ZXN0aW5nIGFycmF5cy5cbiAgICAgICAgICAgIHZhcmlhYmxlTGlzdC5wdXNoKHgpO1xuICAgICAgICAgICAgdGVzdFBvaW50TGlzdC5wdXNoKHRlc3RQb2ludHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm93IHdlIHdpbGwgcHJvY2VlZCB0aHJvdWdoIGFsbCBwb3NzaWJsZSBwb2ludHMuXG4gICAgICAgIC8vIEFuYWxvZ3k6IEVhY2ggdmFyaWFibGUgaXMgbGlrZSBvbmUgXCJkaWdpdFwiIG9uIGFuIG9kb21ldGVyLlxuICAgICAgICAvLyBHbyB0aHJvdWdoIGZ1bGwgY3ljbGUgb2YgYSB2YXJpYWJsZSdzIG9wdGlvbnMgYW5kIHRoZW4gYWR2YW5jZSB0aGUgbmV4dCB2YXJpYWJsZS5cbiAgICAgICAgLy8gVXNlIGFuIG9kb21ldGVyLWxpa2UgYXJyYXkgdGhhdCByZWZlcmVuY2VzIHdoaWNoIHBvaW50IGZyb21cbiAgICAgICAgLy8gZWFjaCBsaXN0IGlzIGJlaW5nIHVzZWQuIFdoZW4gdGhlIGxhc3QgZW50cnkgcmVhY2hlcyB0aGUgZW5kLFxuICAgICAgICAvLyB0aGUgb2RvbWV0ZXIgcm9sbHMgb3ZlciB1bnRpbCBhbGwgZW50cmllcyBhcmUgZG9uZS5cbiAgICAgICAgdmFyIG9kb21ldGVyID0gW107XG4gICAgICAgIGZvciAoaT0wOyBpPHZhcmlhYmxlTGlzdC5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIG9kb21ldGVyW2ldPTA7XG4gICAgICAgIHZhciBkb25lID0gZmFsc2U7XG4gICAgICAgIHdoaWxlICghZG9uZSAmJiBpc0VxdWFsKSB7XG4gICAgICAgICAgICB2YXIgeTEsIHkyO1xuICAgICAgICAgICAgdmFyIGJpbmRpbmdzID0ge307XG4gICAgICAgICAgICBmb3IgKGk9MDsgaTx2YXJpYWJsZUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB4ID0gdmFyaWFibGVMaXN0W2ldO1xuICAgICAgICAgICAgICAgIGJpbmRpbmdzW3hdID0gdGVzdFBvaW50TGlzdFtpXVtvZG9tZXRlcltpXV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB5MSA9IHRoaXMuZXZhbHVhdGUoYmluZGluZ3MpO1xuICAgICAgICAgICAgeTIgPSB0ZXN0RXhwci5ldmFsdWF0ZShiaW5kaW5ncyk7XG4gICAgICAgICAgICAvLyBCb3RoIGZpbml0ZT8gQ2hlY2sgZm9yIHJlbGF0aXZlIGVycm9yLlxuICAgICAgICAgICAgaWYgKGlzRmluaXRlKHkxKSAmJiBpc0Zpbml0ZSh5MikpIHtcbiAgICAgICAgICAgICAgICBpZiAoIShNYXRoLmFicyh5MSk8MWUtMTIgJiYgTWF0aC5hYnMoeTIpPDFlLTEyKVxuICAgICAgICAgICAgICAgICAgICAmJiBNYXRoLmFicyh5MS15MikvTWF0aC5hYnMoeTEpPnJUb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNFcXVhbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBJZiBvbmUgaXMgZmluaXRlLCBvdGhlciBtdXN0IGJlIE5hTlxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIChpc0Zpbml0ZSh5MSkgJiYgIWlzTmFOKHkyKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCAoaXNGaW5pdGUoeTIpICYmICFpc05hTih5MSkpICkge1xuICAgICAgICAgICAgICAgICAgICBpc0VxdWFsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQWR2YW5jZSB0aGUgb2RvbWV0ZXIuXG4gICAgICAgICAgICAgICAgdmFyIGo9MDtcbiAgICAgICAgICAgICAgICBkb25lID0gdHJ1ZTsgLy8gVGhpcyB3aWxsIG9ubHkgcGVyc2lzdCB3aGVuIHRoZSBvZG9tZXRlciBpcyBkb25lLlxuICAgICAgICAgICAgICAgIHdoaWxlIChqIDwgdmFyaWFibGVMaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBvZG9tZXRlcltqXSsrO1xuICAgICAgICAgICAgICAgICAgICBpZiAob2RvbWV0ZXJbal0gPj0gdGVzdFBvaW50TGlzdFtqXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9kb21ldGVyW2pdID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGorKztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1hdGNoSW5wdXRzICYmIGlzRXF1YWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2hPcDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcCA9PSAnKycgfHwgdGhpcy5vcCA9PSAnLScpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hPcCA9ICcrJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3AgPT0gJyonIHx8IHRoaXMub3AgPT0gJy8nKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoT3AgPSAnKic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgobWF0Y2hPcD09JysnICYmIHRlc3RFeHByLm9wICE9ICcrJyAmJiB0ZXN0RXhwci5vcCAhPSAnLScpXG4gICAgICAgICAgICAgICAgICAgIHx8IChtYXRjaE9wPT0nKicgJiYgdGVzdEV4cHIub3AgIT0gJyonICYmIHRlc3RFeHByLm9wICE9ICcvJykpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNFcXVhbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaXNFcXVhbCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmxhdEEsIGZsYXRCO1xuICAgICAgICAgICAgICAgICAgICBmbGF0QSA9IHRoaXMuZmxhdHRlbigpO1xuICAgICAgICAgICAgICAgICAgICBmbGF0QiA9IHRlc3RFeHByLmZsYXR0ZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZsYXRBLmlucHV0cy5sZW5ndGggPT0gZmxhdEIuaW5wdXRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5wdXRNYXRjaGVkID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaT0wOyBpPGZsYXRBLmlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRNYXRjaGVkW2ldID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gR28gdGhyb3VnaCBlYWNoIGlucHV0IG9mIHRlc3RFeHByIGFuZCBzZWUgaWYgaXQgbWF0Y2hlcyBvbiBvZiB0aGlzIGlucHV0cy5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChpPTA7IGk8ZmxhdEIuaW5wdXRzLmxlbmd0aCAmJiBpc0VxdWFsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXRjaEZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGo9MDsgajxmbGF0QS5pbnB1dHMubGVuZ3RoICYmICFtYXRjaEZvdW5kOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlucHV0TWF0Y2hlZFtqXSAmJiBmbGF0QS5pbnB1dHNbal0uY29tcGFyZShmbGF0Qi5pbnB1dHNbaV0sIG9wdGlvbnMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0TWF0Y2hlZFtqXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoRm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbWF0Y2hGb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRXF1YWwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlzRXF1YWwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKGlzRXF1YWwpO1xuICAgIH1cblxuICAgIC8vIEFwcGx5IHJlZHVjdGlvbiBydWxlcyB0byBjcmVhdGUgYSByZWR1Y2VkIGV4cHJlc3Npb25cbiAgICByZWR1Y2UoKSB7XG4gICAgICAgIHZhciB3b3JrRXhwciA9IHRoaXMuc2ltcGxpZnlDb25zdGFudHMoKTtcbiAgICAgICAgdmFyIG1hdGNoUnVsZXM7XG5cbiAgICAgICAgLy8gQ2hlY2sgZm9yIHJlZHVjdGlvbnMgb24gaW5wdXRzLlxuICAgICAgICBmb3IgKHZhciBpIGluIHdvcmtFeHByLmlucHV0cykge1xuICAgICAgICAgICAgd29ya0V4cHIuaW5wdXRzW2ldID0gd29ya0V4cHIuaW5wdXRzW2ldLnJlZHVjZSgpO1xuICAgICAgICB9XG4gICAgICAgIG1hdGNoUnVsZXMgPSBmaW5kTWF0Y2hSdWxlcyh0aGlzLm1lbnYucmVkdWNlUnVsZXMsIHdvcmtFeHByLCB0cnVlKTtcbiAgICAgICAgd2hpbGUgKG1hdGNoUnVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgd29ya0V4cHIgPSB0aGlzLm1lbnYucGFyc2UobWF0Y2hSdWxlc1swXS5zdWJTdHIsIHRoaXMuY29udGV4dCk7XG4gICAgICAgICAgICBtYXRjaFJ1bGVzID0gZmluZE1hdGNoUnVsZXModGhpcy5tZW52LnJlZHVjZVJ1bGVzLCB3b3JrRXhwciwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHdvcmtFeHByO1xuICAgIH1cblxuICAgIFxuICAgIGRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCkge1xuICAgICAgICByZXR1cm4obmV3IHNjYWxhcl9leHByKDApKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAgICBUaGUgbWF0Y2ggbWV0aG9kIGlzIGRlc2lnbmVkIHRvIGNvbXBhcmUgXCJ0aGlzXCIgZXhwcmVzc2lvblxuICAgICAgICB0byB0aGUgZ2l2ZW4gXCJleHByXCIgZXhwcmVzc2lvbiBhbmQgc2VlIGlmIGl0IGlzIGNvbnNpc3RlbnQgd2l0aFxuICAgICAgICB0aGUgY3VycmVudCBiaW5kaW5ncy4gVGhlIGJpbmRpbmdzIHdpbGwgYmUgYW4gb2JqZWN0IHdoZXJlXG4gICAgICAgIHZhcmlhYmxlcyBpbiBcInRoaXNcIiBhcmUgYXNzaWduZWQgdG8gc3RyaW5ncyByZXByZXNlbnRpbmcgZXhwcmVzc2lvbnMuXG4gICAgICAgIElmIHRoZXJlIGlzIGEgbWlzbWF0Y2gsIHJldHVybiBcIm51bGxcIiBhbmQgdGhlIG1hdGNoaW5nIHByb2Nlc3Mgc2hvdWxkIHRlcm1pbmF0ZS5cblxuICAgICAgICBPdmVycmlkZXM6XG4gICAgICAgICAgICAtIG51bWJlcnMsIHRvIGRlYWwgd2l0aCBzY2FsYXIgZm9ybXVsYSB0aGF0IHNpbXBsaWZ5XG4gICAgICAgICAgICAtIHZhcmlhYmxlcywgd2hpY2ggY2FuIG1hdGNoIGFyYml0cmFyeSBleHByZXNzaW9ucy5cbiAgICAgICAgICAgIC0gaW5kZXhlZCBleHByZXNzaW9ucyBtaWdodCBuZWVkIGEgc3BlY2lhbCBtZXRob2QuXG4gICAgICAgICAgICAtIG11bHRpb3AsIHdoZXJlIHNob3VsZCBzZWUgaWYgYSB2YXJpYWJsZSBjYW4gbWF0Y2ggYSBzdWJjb2xsZWN0aW9uIG9mIGlucHV0cy5cbiAgICAqL1xuICAgIG1hdGNoKGV4cHIsIGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciByZXRWYWx1ZSA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT0gZXhwci50eXBlICYmIHRoaXMub3BlcmF0ZVRvVGVYKCkgPT0gZXhwci5vcGVyYXRlVG9UZVgoKSkge1xuICAgICAgICAgICAgcmV0VmFsdWUgPSBiaW5kaW5ncztcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLmlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChyZXRWYWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXRWYWx1ZSA9IHRoaXMuaW5wdXRzW2ldLm1hdGNoKGV4cHIuaW5wdXRzW2ldLCByZXRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxuXG4gICAgaW5wdXRTdWJzdChvcmlnRXhwciwgc3ViRXhwcikge1xuICAgICAgICB2YXIgaSA9IHRoaXMuaW5wdXRzLmluZGV4T2Yob3JpZ0V4cHIpO1xuICAgICAgICBpZiAoaSA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0c1tpXSA9IHN1YkV4cHI7XG4gICAgICAgICAgICBpZiAoc3ViRXhwciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgc3ViRXhwci5wYXJlbnQgPSB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsIi8qIVxuICogQlRNIEphdmFTY3JpcHQgTGlicmFyeSB2QFZFUlNJT05cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kYnJpYW53YWx0b24vQlRNXG4gKlxuICogQ29weXJpZ2h0IEQuIEJyaWFuIFdhbHRvblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIChodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVClcbiAqXG4gKiBEYXRlOiBAREFURVxuICovXG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKiBEZWZpbmUgdGhlIEZ1bmN0aW9uIEV4cHJlc3Npb24gLS0gZGVmaW5lZCBieSBhIGZ1bmN0aW9uIG5hbWUgYW5kIGlucHV0IGV4cHJlc3Npb25cbiAgICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmltcG9ydCB7IGV4cHJlc3Npb24gfSBmcm9tIFwiLi9leHByZXNzaW9uLmpzXCJcbmltcG9ydCB7IHNjYWxhcl9leHByIH0gZnJvbSBcIi4vc2NhbGFyX2V4cHIuanNcIlxuaW1wb3J0IHsgdmFyaWFibGVfZXhwciB9IGZyb20gXCIuL3ZhcmlhYmxlX2V4cHIuanNcIlxuaW1wb3J0IHsgdW5vcF9leHByIH0gZnJvbSBcIi4vdW5vcF9leHByLmpzXCJcbmltcG9ydCB7IGJpbm9wX2V4cHIgfSBmcm9tIFwiLi9iaW5vcF9leHByLmpzXCJcbmltcG9ydCB7IGV4cHJUeXBlIH0gZnJvbSBcIi4vQlRNX3Jvb3QuanNcIlxuXG5leHBvcnQgY2xhc3MgZnVuY3Rpb25fZXhwciBleHRlbmRzIGV4cHJlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKG1lbnYsIG5hbWUsIGlucHV0RXhwciwgcmVzdHJpY3REb21haW4pIHtcbiAgICAgICAgc3VwZXIobWVudik7XG4gICAgICAgIHRoaXMudHlwZSA9IGV4cHJUeXBlLmZjbjtcbiAgICAgICAgLy8gQ291bnQgaG93IG1hbnkgZGVyaXZhdGl2ZXMuXG4gICAgICAgIHZhciBwcmltZVBvcyA9IG5hbWUuaW5kZXhPZihcIidcIik7XG4gICAgICAgIHRoaXMuZGVyaXZzID0gMDtcbiAgICAgICAgaWYgKHByaW1lUG9zID4gMCkge1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gbmFtZS5zbGljZSgwLHByaW1lUG9zKTtcbiAgICAgICAgICAgIHRoaXMuZGVyaXZzID0gbmFtZS5zbGljZShwcmltZVBvcykubGVuZ3RoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGlucHV0RXhwciA9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIGlucHV0RXhwciA9IG5ldyBleHByZXNzaW9uKCk7XG4gICAgICAgIHRoaXMuaW5wdXRzID0gW2lucHV0RXhwcl07XG4gICAgICAgIGlucHV0RXhwci5wYXJlbnQgPSB0aGlzO1xuICAgICAgICB0aGlzLmRvbWFpbiA9IHJlc3RyaWN0RG9tYWluO1xuXG4gICAgICAgIHRoaXMuYWx0ZXJuYXRlID0gbnVsbDtcbiAgICAgICAgdGhpcy5idWlsdGluID0gdHJ1ZTtcbiAgICAgICAgc3dpdGNoKHRoaXMubmFtZSkge1xuICAgICAgICAgICAgY2FzZSAnYXNpbic6XG4gICAgICAgICAgICBjYXNlICdhY29zJzpcbiAgICAgICAgICAgIGNhc2UgJ2F0YW4nOlxuICAgICAgICAgICAgY2FzZSAnYXNlYyc6XG4gICAgICAgICAgICBjYXNlICdhY3NjJzpcbiAgICAgICAgICAgIGNhc2UgJ2Fjb3QnOlxuICAgICAgICAgICAgICAgIHRoaXMubmFtZSA9ICdhcmMnK3RoaXMubmFtZS5zbGljZSgxLDQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbG9nJzpcbiAgICAgICAgICAgICAgICB0aGlzLm5hbWUgPSAnbG4nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc2luJzpcbiAgICAgICAgICAgIGNhc2UgJ2Nvcyc6XG4gICAgICAgICAgICBjYXNlICd0YW4nOlxuICAgICAgICAgICAgY2FzZSAnY3NjJzpcbiAgICAgICAgICAgIGNhc2UgJ3NlYyc6XG4gICAgICAgICAgICBjYXNlICdjb3QnOlxuICAgICAgICAgICAgY2FzZSAnYXJjc2luJzpcbiAgICAgICAgICAgIGNhc2UgJ2FyY2Nvcyc6XG4gICAgICAgICAgICBjYXNlICdhcmN0YW4nOlxuICAgICAgICAgICAgY2FzZSAnYXJjc2VjJzpcbiAgICAgICAgICAgIGNhc2UgJ2FyY2NzYyc6XG4gICAgICAgICAgICBjYXNlICdhcmNjb3QnOlxuICAgICAgICAgICAgY2FzZSAnc3FydCc6XG4gICAgICAgICAgICBjYXNlICdyb290JzpcbiAgICAgICAgICAgIGNhc2UgJ2Ficyc6XG4gICAgICAgICAgICBjYXNlICdleHAnOlxuICAgICAgICAgICAgY2FzZSAnZXhwYic6XG4gICAgICAgICAgICBjYXNlICdsbic6XG4gICAgICAgICAgICBjYXNlICdsb2cxMCc6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMuYnVpbHRpbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIHVzaW5nIGEgZGVyaXZhdGl2ZSBvZiBhIGtub3duIGZ1bmN0aW9uLCB0aGVuIHdlIHNob3VsZCBjb21wdXRlIHRoYXQgaW4gYWR2YW5jZS5cbiAgICAgICAgaWYgKHRoaXMuYnVpbHRpbiAmJiB0aGlzLmRlcml2cyA+IDApIHtcbiAgICAgICAgICAgIHZhciB4dmFyID0gbmV3IHZhcmlhYmxlX2V4cHIodGhpcy5tZW52LCBcInhcIik7XG4gICAgICAgICAgICB2YXIgZGVyaXYgPSBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLm1lbnYsIHRoaXMubmFtZSwgeHZhcik7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy5kZXJpdnM7IGkrKykge1xuICAgICAgICAgICAgICAgIGRlcml2ID0gZGVyaXYuZGVyaXZhdGl2ZSh4dmFyLCB7XCJ4XCI6MH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGJpbmRpbmcgPSB7fTtcbiAgICAgICAgICAgIGJpbmRpbmdbXCJ4XCJdID0gaW5wdXRFeHByO1xuICAgICAgICAgICAgdGhpcy5hbHRlcm5hdGUgPSBkZXJpdi5jb21wb3NlKGJpbmRpbmcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLm5hbWUgKyBcIidcIi5yZXBlYXQodGhpcy5kZXJpdnMpKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZyhlbGVtZW50T25seSkge1xuICAgICAgICB2YXIgZmNuU3RyaW5nLCByZXRTdHJpbmc7XG4gICAgICAgIGlmICh0eXBlb2YgZWxlbWVudE9ubHkgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGVsZW1lbnRPbmx5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZmNuU3RyaW5nID0gdGhpcy5nZXROYW1lKCk7XG4gICAgICAgIGlmIChlbGVtZW50T25seSkge1xuICAgICAgICAgICAgcmV0U3RyaW5nID0gZmNuU3RyaW5nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGFyZ1N0cmluZ3MgPSBbXTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlucHV0cy5sZW5ndGggPT0gMCB8fCB0eXBlb2YgdGhpcy5pbnB1dHNbMF0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBhcmdTdHJpbmdzLnB1c2goJz8nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgICAgICAgICBhcmdTdHJpbmdzLnB1c2godGhpcy5pbnB1dHNbaV0udG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0U3RyaW5nID0gZmNuU3RyaW5nICsgJygnICsgYXJnU3RyaW5ncy5qb2luKCcsJykgKyAnKSc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHJldFN0cmluZyk7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRlc3RlZCBlcXVpdmFsZW50IHN0cmluZ3MuXG4gICAgYWxsU3RyaW5nRXF1aXZzKCkge1xuICAgICAgICB2YXIgYWxsSW5wdXRzID0gW10sIGlucHV0T3B0aW9ucyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICBpbnB1dE9wdGlvbnMucHVzaCh0aGlzLmlucHV0c1tpXS5hbGxTdHJpbmdFcXVpdnMoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJldFZhbHVlID0gW107XG4gICAgICAgIHZhciBmY25TdHJpbmcgPSB0aGlzLmdldE5hbWUoKTtcbiAgICAgICAgLy8gV2FudCB0byBjcmVhdGUgYSBsaXN0IG9mIGFsbCBwb3NzaWJsZSBpbnB1dCByZXByZXNlbnRhdGlvbnMuXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlQXJncyhsZWZ0LCByaWdodE9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChyaWdodE9wdGlvbnMubGVuZ3RoPT0wKSB7XG4gICAgICAgICAgICAgICAgYWxsSW5wdXRzLnB1c2gobGVmdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBOID0gbGVmdC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdmFyIG5ld0xlZnQgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrIGluIGxlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3TGVmdC5wdXNoKGxlZnRba10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrIGluIHJpZ2h0T3B0aW9uc1swXSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdMZWZ0W05dID0gcmlnaHRPcHRpb25zWzBdW2tdO1xuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZUFyZ3MobmV3TGVmdCwgcmlnaHRPcHRpb25zLnNsaWNlKDEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZ2VuZXJhdGVBcmdzKFtdLCBpbnB1dE9wdGlvbnMpO1xuICAgICAgICBmb3IgKHZhciBpIGluIGFsbElucHV0cykge1xuICAgICAgICAgICAgcmV0VmFsdWVbaV0gPSBmY25TdHJpbmcrJygnICsgYWxsSW5wdXRzW2ldLmpvaW4oJysnKSArICcpJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxuXG4gICAgdG9UZVgoc2hvd1NlbGVjdCkge1xuICAgICAgICBpZiAodHlwZW9mIHNob3dTZWxlY3QgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHNob3dTZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGV4U3RyaW5nID0gJyc7XG4gICAgICAgIHZhciBmY25TdHJpbmc7XG4gICAgICAgIHZhciBhcmdTdHJpbmdzID0gW107XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dHNbMF0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGFyZ1N0cmluZ3MucHVzaCgnPycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgICAgIGFyZ1N0cmluZ3MucHVzaCh0aGlzLmlucHV0c1tpXS50b1RlWChzaG93U2VsZWN0KSk7XG4gICAgICAgICAgICAgICAgaWYgKHNob3dTZWxlY3QgJiYgdGhpcy5zZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnU3RyaW5nc1tpXSA9IFwie1xcXFxjb2xvcntibHVlfVwiICsgYXJnU3RyaW5nc1tpXSArIFwifVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCh0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3Npbic6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxzaW4nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY29zJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGNvcyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd0YW4nOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcdGFuJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2NzYyc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxjc2MnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc2VjJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXHNlYyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjb3QnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcY290JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FyY3Npbic6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxzaW5eey0xfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcmNjb3MnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcY29zXnstMX0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYXJjdGFuJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXHRhbl57LTF9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FyY2NzYyc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxjc2Neey0xfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcmNzZWMnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcc2VjXnstMX0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYXJjY290JzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGNvdF57LTF9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3NxcnQnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcbWF0aHJte3NxcnR9JztcbiAgICAgICAgICAgICAgICB0ZXhTdHJpbmcgPSAnXFxcXHNxcnR7JyArIGFyZ1N0cmluZ3NbMF0gKyAnfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdyb290JzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXG1hdGhybXtyb290fSc7XG4gICAgICAgICAgICAgICAgdGV4U3RyaW5nID0gJ1xcXFxzcXJ0WycgKyBhcmdTdHJpbmdzWzFdICsnXXsnICsgYXJnU3RyaW5nc1swXSArICd9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Ficyc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxhYnMnO1xuICAgICAgICAgICAgICAgIHRleFN0cmluZyA9ICdcXFxcbGVmdHwnICsgYXJnU3RyaW5nc1swXSArICdcXFxccmlnaHR8JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2V4cCc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ2VeJztcbiAgICAgICAgICAgICAgICB0ZXhTdHJpbmcgPSAnZV57JyArIGFyZ1N0cmluZ3NbMF0gKyAnfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdleHBiJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGV4cCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdsbic6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxsbidcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2xvZzEwJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGxvZ197MTB9J1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5uYW1lLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxtYXRocm17JyArIHRoaXMubmFtZSArICd9JztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSB0aGlzLm5hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmRlcml2cyA+IDApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRlcml2cyA8PSAzKSB7XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gZmNuU3RyaW5nICsgXCInXCIucmVwZWF0KHRoaXMuZGVyaXZzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gZmNuU3RyaW5nICsgXCJeeyhcIit0aGlzLmRlcml2cytcIil9XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2hvd1NlbGVjdCAmJiB0aGlzLnNlbGVjdCkge1xuICAgICAgICAgICAgZmNuU3RyaW5nID0gXCJcXFxcY29sb3J7cmVkfXtcIiArIGZjblN0cmluZyArIFwifVwiO1xuICAgICAgICAgICAgdGV4U3RyaW5nID0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRleFN0cmluZyA9PSAnJykge1xuICAgICAgICAgICAgdGV4U3RyaW5nID0gZmNuU3RyaW5nICsgJyBcXFxcbWF0aG9wZW57fVxcXFxsZWZ0KCcgKyBhcmdTdHJpbmdzLmpvaW4oJywnKSArICdcXFxccmlnaHQpXFxcXG1hdGhjbG9zZXt9JztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4odGV4U3RyaW5nKTtcbiAgICB9XG5cbiAgICB0b01hdGhNTCgpIHtcbiAgICAgICAgdmFyIHRleFN0cmluZztcbiAgICAgICAgdmFyIGFyZ1N0cmluZztcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0c1swXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgYXJnU3RyaW5nID0gJz8nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXJnU3RyaW5nID0gdGhpcy5pbnB1dHNbMF0udG9NYXRoTUwoKTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2godGhpcy5uYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdzaW4nOlxuICAgICAgICAgICAgY2FzZSAnY29zJzpcbiAgICAgICAgICAgIGNhc2UgJ3Rhbic6XG4gICAgICAgICAgICBjYXNlICdjc2MnOlxuICAgICAgICAgICAgY2FzZSAnc2VjJzpcbiAgICAgICAgICAgIGNhc2UgJ2NvdCc6XG4gICAgICAgICAgICBjYXNlICdhcmNzaW4nOlxuICAgICAgICAgICAgY2FzZSAnYXJjY29zJzpcbiAgICAgICAgICAgIGNhc2UgJ2FyY3Rhbic6XG4gICAgICAgICAgICBjYXNlICdleHAnOlxuICAgICAgICAgICAgY2FzZSAnZXhwYic6XG4gICAgICAgICAgICBjYXNlICdsbic6XG4gICAgICAgICAgICBjYXNlICdhYnMnOlxuICAgICAgICAgICAgICAgIHRleFN0cmluZyA9ICc8YXBwbHk+PCcgKyB0aGlzLm5hbWUgKyAnLz4nICsgYXJnU3RyaW5nICsgJzwvYXBwbHk+JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3NxcnQnOlxuICAgICAgICAgICAgICAgIHRleFN0cmluZyA9ICc8YXBwbHk+PHJvb3QvPicgKyBhcmdTdHJpbmcgKyAnPC9hcHBseT4nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbG9nMTAnOlxuICAgICAgICAgICAgICAgIHRleFN0cmluZyA9ICc8YXBwbHk+PGxvZy8+PGxvZ2Jhc2U+PGNuPjEwPC9jbj48L2xvZ2Jhc2U+JyArIGFyZ1N0cmluZyArICc8L2FwcGx5Pic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRleFN0cmluZyA9ICc8YXBwbHk+PGNpPicgKyB0aGlzLm5hbWUgKyAnPC9jaT4nICsgYXJnU3RyaW5nICsgJzwvYXBwbHk+JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4odGV4U3RyaW5nKTtcbiAgICB9XG5cbiAgICBvcGVyYXRlVG9UZVgoKSB7XG4gICAgICAgIHZhciBmY25TdHJpbmc7XG4gICAgICAgIHN3aXRjaCh0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3Npbic6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxzaW4nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY29zJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGNvcyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd0YW4nOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcdGFuJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2NzYyc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxjc2MnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc2VjJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXHNlYyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjb3QnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcY290JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FyY3Npbic6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxzaW5eey0xfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcmNjb3MnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcY29zXnstMX0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYXJjdGFuJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXHRhbl57LTF9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FyY2NzYyc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxjc2Neey0xfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcmNzZWMnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcc2VjXnstMX0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYXJjY290JzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGNvdF57LTF9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3NxcnQnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcbWF0aHJte3NxcnR9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Ficyc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxhYnMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZXhwJzpcbiAgICAgICAgICAgIGNhc2UgJ2V4cGInOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcZXhwJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2xuJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGxuJ1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbG9nMTAnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcbG9nX3sxMH0nXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm5hbWUubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXG1hdGhybXsnICsgdGhpcy5uYW1lICsgJ30nO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZjblN0cmluZyA9IHRoaXMubmFtZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZGVyaXZzID4gMCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZGVyaXZzIDw9IDMpIHtcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSBmY25TdHJpbmcgKyBcIidcIi5yZXBlYXQodGhpcy5kZXJpdnMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSBmY25TdHJpbmcgKyBcIl57KFwiK3RoaXMuZGVyaXZzK1wiKX1cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihmY25TdHJpbmcrXCIoXFxcXEJveClcIik7XG4gICAgfVxuXG4gICAgZXZhbHVhdGUoYmluZGluZ3MpIHtcbiAgICAgICAgdmFyIGlucHV0VmFsID0gdGhpcy5pbnB1dHNbMF0uZXZhbHVhdGUoYmluZGluZ3MpO1xuICAgICAgICB2YXIgcmV0VmFsID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIGlmIChpbnB1dFZhbCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybih1bmRlZmluZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQnVpbHQtaW4gZnVuY3Rpb25zIHdpdGggZGVyaXZhdGl2ZXMgaGF2ZSBjb21wdXRlZCBkZXJpdmF0aXZlIGVhcmxpZXIuXG4gICAgICAgIGlmICh0aGlzLmJ1aWx0aW4gJiYgdGhpcy5kZXJpdnMgPiAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hbHRlcm5hdGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gdGhpcy5hbHRlcm5hdGUuZXZhbHVhdGUoYmluZGluZ3MpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBCdWlsdC1pbiBmdW5jdGlvbiBjYWxsZWQgd2l0aCB1bnNwZWNpZmllZCBkZXJpdmF0aXZlIGZvcm11bGEuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGJpbmRpbmdzW3RoaXMubmFtZV0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgdGhlIGxpc3Qgb2YgY29tbW9uIG1hdGhlbWF0aWNhbCBmdW5jdGlvbnMuXG4gICAgICAgICAgICAgICAgc3dpdGNoKHRoaXMubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdzaW4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5zaW4oaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Nvcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLmNvcyhpbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndGFuJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGgudGFuKGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdjc2MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gMS9NYXRoLnNpbihpbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc2VjJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IDEvTWF0aC5jb3MoaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NvdCc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSAxL01hdGgudGFuKGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhcmNzaW4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGlucHV0VmFsKSA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5hc2luKGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhcmNjb3MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGlucHV0VmFsKSA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5hY29zKGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhcmN0YW4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5hdGFuKGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhcmNjc2MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGlucHV0VmFsKSA+PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5hc2luKDEvaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FyY3NlYyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoaW5wdXRWYWwpID49IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLmFjb3MoMS9pbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJjY290JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dFZhbCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5QSS8yO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLlBJLzIgLSBNYXRoLmF0YW4oMS9pbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc3FydCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXRWYWwgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGguc3FydChpbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYWJzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGguYWJzKGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdleHAnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdleHBiJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGguZXhwKGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdsbic6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXRWYWwgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5sb2coaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2xvZzEwJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dFZhbCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLkxPRzEwRSAqIE1hdGgubG9nKGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2VlIGlmIHdlIGhhdmUgYWxyZWFkeSB1c2VkIHRoaXMgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3IgY29uc2lzdGVuY3ksIHdlIHNob3VsZCBrZWVwIGl0IHRoZSBzYW1lLlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uRW50cnkgPSB0aGlzLm1lbnYuZnVuY3Rpb25zW3RoaXMubmFtZV07XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBuZXZlciB1c2VkIHByZXZpb3VzbHksIGdlbmVyYXRlIGEgcmFuZG9tIGZ1bmN0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyB3aWxsIGFsbG93IHZhbGlkIGNvbXBhcmlzb25zIHRvIG9jY3VyLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZ1bmN0aW9uRW50cnkgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcjogQSBjdXN0b20gZnVuY3Rpb24gbmV2ZXIgaGFkIGEgYmFja2VuZCBkZWZpbml0aW9uLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvcHkgdGhlIGJpbmRpbmdzLlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZCaW5kID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhiaW5kaW5ncykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmQmluZFsga2V5IF0gPSBiaW5kaW5nc1sga2V5IF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vdywgdXNlIHRoZSB2YXJpYWJsZSBvZiB0aGUgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5WYXIgPSBmdW5jdGlvbkVudHJ5W1wiaW5wdXRcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpblZhcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBGdW5jdGlvbiBpcyBkZWZpbmVkIHRvIGV4cGVjdCBtdWx0aXBsZSBpbnB1dHMuIE5vdCB5ZXQgaW1wbGVtZW50ZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZkJpbmRbaW5WYXJdID0gaW5wdXRWYWw7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTZWUgaWYgd2UgbmVlZCBhZGRpdGlvbmFsIGRlcml2YXRpdmVzIGluIGJpbmRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlcml2cyA+PSBmdW5jdGlvbkVudHJ5W1widmFsdWVcIl0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGl2YXIgPSBuZXcgdmFyaWFibGVfZXhwcih0aGlzLm1lbnYsIGluVmFyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFyQmluZCA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhckJpbmRbaXZhcl0gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGk9ZnVuY3Rpb25FbnRyeVtcInZhbHVlXCJdLmxlbmd0aDsgaSA8PSB0aGlzLmRlcml2czsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uRW50cnlbXCJ2YWx1ZVwiXVtpXSA9IGZ1bmN0aW9uRW50cnlbXCJ2YWx1ZVwiXVtpLTFdLmRlcml2YXRpdmUoaXZhciwgdmFyQmluZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gZnVuY3Rpb25FbnRyeVtcInZhbHVlXCJdW3RoaXMuZGVyaXZzXS5ldmFsdWF0ZShmQmluZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbkVudHJ5ID0gYmluZGluZ3NbdGhpcy5uYW1lXTtcbiAgICAgICAgICAgICAgICAvLyBDb3B5IHRoZSBiaW5kaW5ncy5cbiAgICAgICAgICAgICAgICB2YXIgZkJpbmQgPSB7fTtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhiaW5kaW5ncykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgZkJpbmRbIGtleSBdID0gYmluZGluZ3NbIGtleSBdO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vIE5vdywgdXNlIHRoZSB2YXJpYWJsZSBvZiB0aGUgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgdmFyIGluVmFyID0gZnVuY3Rpb25FbnRyeVtcImlucHV0XCJdO1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGluVmFyKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBGdW5jdGlvbiBpcyBkZWZpbmVkIHRvIGV4cGVjdCBtdWx0aXBsZSBpbnB1dHMuIE5vdCB5ZXQgaW1wbGVtZW50ZWQuXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmQmluZFtpblZhcl0gPSBpbnB1dFZhbDtcbiAgICAgICAgICAgICAgICAvLyBTZWUgaWYgd2UgbmVlZCBhZGRpdGlvbmFsIGRlcml2YXRpdmVzIGluIGJpbmRpbmdcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kZXJpdnMgPj0gZnVuY3Rpb25FbnRyeVtcInZhbHVlXCJdLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXZhciA9IG5ldyB2YXJpYWJsZV9leHByKHRoaXMubWVudiwgaW5WYXIpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmFyQmluZCA9IHt9O1xuICAgICAgICAgICAgICAgICAgICB2YXJCaW5kW2l2YXJdID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaT1mdW5jdGlvbkVudHJ5W1widmFsdWVcIl0ubGVuZ3RoOyBpIDw9IHRoaXMuZGVyaXZzOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uRW50cnlbXCJ2YWx1ZVwiXVtpXSA9IGZ1bmN0aW9uRW50cnlbXCJ2YWx1ZVwiXVtpLTFdLmRlcml2YXRpdmUoaXZhciwgdmFyQmluZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gZnVuY3Rpb25FbnRyeVtcInZhbHVlXCJdW3RoaXMuZGVyaXZzXS5ldmFsdWF0ZShmQmluZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHJldFZhbCk7XG4gICAgfVxuXG4gICAgZmxhdHRlbigpIHtcbiAgICAgICAgcmV0dXJuKG5ldyBmdW5jdGlvbl9leHByKHRoaXMubWVudiwgdGhpcy5nZXROYW1lKCksIHRoaXMuaW5wdXRzWzBdLmZsYXR0ZW4oKSkpO1xuICAgIH1cblxuICAgIGNvcHkoKSB7XG4gICAgICByZXR1cm4obmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5tZW52LCB0aGlzLmdldE5hbWUoKSwgdGhpcy5pbnB1dHNbMF0uY29weSgpKSk7XG4gICAgfVxuXG4gICAgY29tcG9zZShiaW5kaW5ncykge1xuICAgICAgICByZXR1cm4obmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5tZW52LCB0aGlzLmdldE5hbWUoKSwgdGhpcy5pbnB1dHNbMF0uY29tcG9zZShiaW5kaW5ncykpKTtcbiAgICB9XG5cbiAgICBkZXJpdmF0aXZlKGl2YXIsIHZhckxpc3QpIHtcbiAgICAgICAgdmFyIHRoZURlcml2O1xuICAgICAgICB2YXIgZGVwQXJyYXkgPSB0aGlzLmlucHV0c1swXS5kZXBlbmRlbmNpZXMoKTtcbiAgICAgICAgdmFyIHVDb25zdCA9IHRydWU7XG4gICAgICAgIHZhciBpdmFyTmFtZSA9ICh0eXBlb2YgaXZhciA9PSAnc3RyaW5nJykgPyBpdmFyIDogaXZhci5uYW1lO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8ZGVwQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChkZXBBcnJheVtpXSA9PSBpdmFyTmFtZSkge1xuICAgICAgICAgICAgICAgIHVDb25zdCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHVDb25zdCkge1xuICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBkeWR1O1xuXG4gICAgICAgICAgICBzd2l0Y2godGhpcy5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Npbic6XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5tZW52LCAnY29zJywgdGhpcy5pbnB1dHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Nvcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IHVub3BfZXhwcih0aGlzLm1lbnYsICctJywgbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5tZW52LCAnc2luJywgdGhpcy5pbnB1dHNbMF0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd0YW4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZVNlYyA9IG5ldyBmdW5jdGlvbl9leHByKHRoaXMubWVudiwgJ3NlYycsIHRoaXMuaW5wdXRzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgYmlub3BfZXhwcih0aGlzLm1lbnYsICdeJywgdGhlU2VjLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCAyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnY3NjJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGVDb3QgPSBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLm1lbnYsICdjb3QnLCB0aGlzLmlucHV0c1swXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IHVub3BfZXhwcih0aGlzLm1lbnYsICctJywgbmV3IGJpbm9wX2V4cHIodGhpcy5tZW52LCAnKicsIHRoaXMsIHRoZUNvdCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3NlYyc6XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlVGFuID0gbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5tZW52LCAndGFuJywgdGhpcy5pbnB1dHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyBiaW5vcF9leHByKHRoaXMubWVudiwgJyonLCB0aGlzLCB0aGVUYW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NvdCc6XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlQ3NjID0gbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5tZW52LCAnY3NjJywgdGhpcy5pbnB1dHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyB1bm9wX2V4cHIodGhpcy5tZW52LCAnLScsIG5ldyBiaW5vcF9leHByKHRoaXMubWVudiwgJ14nLCB0aGVDc2MsIG5ldyBzY2FsYXJfZXhwcih0aGlzLm1lbnYsIDIpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJjc2luJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGVDb3MgPSBuZXcgYmlub3BfZXhwcih0aGlzLm1lbnYsICctJywgbmV3IHNjYWxhcl9leHByKHRoaXMubWVudiwgMSksIG5ldyBiaW5vcF9leHByKHRoaXMubWVudiwgJ14nLCB0aGlzLmlucHV0c1swXSwgbmV3IHNjYWxhcl9leHByKHRoaXMubWVudiwgMikpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgYmlub3BfZXhwcih0aGlzLm1lbnYsICcvJywgbmV3IHNjYWxhcl9leHByKHRoaXMubWVudiwgMSksIG5ldyBmdW5jdGlvbl9leHByKHRoaXMubWVudiwgJ3NxcnQnLCB0aGVDb3MpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhcmNjb3MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZVNpbiA9IG5ldyBiaW5vcF9leHByKHRoaXMubWVudiwgJy0nLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCAxKSwgbmV3IGJpbm9wX2V4cHIodGhpcy5tZW52LCAnXicsIHRoaXMuaW5wdXRzWzBdLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCAyKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyBiaW5vcF9leHByKHRoaXMubWVudiwgJy8nLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCAtMSksIG5ldyBmdW5jdGlvbl9leHByKHRoaXMubWVudiwgJ3NxcnQnLCB0aGVTaW4pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhcmN0YW4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRhblNxID0gbmV3IGJpbm9wX2V4cHIodGhpcy5tZW52LCAnXicsIHRoaXMuaW5wdXRzWzBdLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCAyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5tZW52LCAnLycsIG5ldyBzY2FsYXJfZXhwcih0aGlzLm1lbnYsIDEpLCBuZXcgYmlub3BfZXhwcih0aGlzLm1lbnYsICcrJywgbmV3IHNjYWxhcl9leHByKHRoaXMubWVudiwgMSksIHRhblNxKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJjc2VjJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGVTcSA9IG5ldyBiaW5vcF9leHByKHRoaXMubWVudiwgJ14nLCB0aGlzLmlucHV0c1swXSwgbmV3IHNjYWxhcl9leHByKHRoaXMubWVudiwgMikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZVJhZCA9IG5ldyBiaW5vcF9leHByKHRoaXMubWVudiwgJy0nLCB0aGVTcSwgbmV3IHNjYWxhcl9leHByKHRoaXMubWVudiwgMSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyBiaW5vcF9leHByKHRoaXMubWVudiwgJy8nLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCAxKSwgbmV3IGJpbm9wX2V4cHIodGhpcy5tZW52LCAnKicsIG5ldyBmdW5jdGlvbl9leHByKHRoaXMubWVudiwgJ2FicycsIHRoaXMuaW5wdXRzWzBdKSwgbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5tZW52LCAnc3FydCcsIHRoZVJhZCkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhcmNjc2MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZVNxID0gbmV3IGJpbm9wX2V4cHIodGhpcy5tZW52LCAnXicsIHRoaXMuaW5wdXRzWzBdLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCAyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlUmFkID0gbmV3IGJpbm9wX2V4cHIodGhpcy5tZW52LCAnLScsIHRoZVNxLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCAxKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5tZW52LCAnLycsIG5ldyBzY2FsYXJfZXhwcih0aGlzLm1lbnYsIC0xKSwgbmV3IGJpbm9wX2V4cHIodGhpcy5tZW52LCAnKicsIG5ldyBmdW5jdGlvbl9leHByKHRoaXMubWVudiwgJ2FicycsIHRoaXMuaW5wdXRzWzBdKSwgbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5tZW52LCAnc3FydCcsIHRoZVJhZCkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhcmNjb3QnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvdFNxID0gbmV3IGJpbm9wX2V4cHIodGhpcy5tZW52LCAnXicsIHRoaXMuaW5wdXRzWzBdLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCAyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5tZW52LCAnLycsIG5ldyBzY2FsYXJfZXhwcih0aGlzLm1lbnYsIC0xKSwgbmV3IGJpbm9wX2V4cHIodGhpcy5tZW52LCAnKycsIG5ldyBzY2FsYXJfZXhwcih0aGlzLm1lbnYsIDEpLCBjb3RTcSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3NxcnQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyBiaW5vcF9leHByKHRoaXMubWVudiwgJy8nLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCAxKSwgbmV3IGJpbm9wX2V4cHIodGhpcy5tZW52LCAnKicsIG5ldyBzY2FsYXJfZXhwcih0aGlzLm1lbnYsIDIpLCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYWJzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgYmlub3BfZXhwcih0aGlzLm1lbnYsICcvJywgdGhpcywgdGhpcy5pbnB1dHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2V4cCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2V4cGInOlxuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyBmdW5jdGlvbl9leHByKHRoaXMubWVudiwgdGhpcy5uYW1lLCB0aGlzLmlucHV0c1swXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbG4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyBiaW5vcF9leHByKHRoaXMubWVudiwgJy8nLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCAxKSwgdGhpcy5pbnB1dHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2xvZzEwJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgYmlub3BfZXhwcih0aGlzLm1lbnYsICcvJywgbmV3IHNjYWxhcl9leHByKHRoaXMubWVudiwgTWF0aC5MT0cxMEUpLCB0aGlzLmlucHV0c1swXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLm1lbnYsIHRoaXMuZ2V0TmFtZSgpK1wiJ1wiLCB0aGlzLmlucHV0c1swXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdUNvbnN0ICYmIHRoaXMuaW5wdXRzWzBdLnR5cGUgPT0gZXhwclR5cGUudmFyaWFibGUpIHtcbiAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IGR5ZHU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBkdWR4ID0gdGhpcy5pbnB1dHNbMF0uZGVyaXZhdGl2ZShpdmFyLCB2YXJMaXN0KTtcblxuICAgICAgICAgICAgICAgIGlmIChkdWR4ID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyBiaW5vcF9leHByKHRoaXMubWVudiwgJyonLCBkeWR1LCBkdWR4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHRoZURlcml2KTtcbiAgICB9XG59IiwiLyohXG4gKiBCVE0gSmF2YVNjcmlwdCBMaWJyYXJ5IHZAVkVSU0lPTlxuICogaHR0cHM6Ly9naXRodWIuY29tL2RicmlhbndhbHRvbi9CVE1cbiAqXG4gKiBDb3B5cmlnaHQgRC4gQnJpYW4gV2FsdG9uXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUKVxuICpcbiAqIERhdGU6IEBEQVRFXG4gKi9cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIERlZmluZSB0aGUgTXVsdGktT3BlcmFuZCBFeHByZXNzaW9uIChmb3Igc3VtIGFuZCBwcm9kdWN0KVxuKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuaW1wb3J0IHsgZXhwcmVzc2lvbiB9IGZyb20gXCIuL2V4cHJlc3Npb24uanNcIlxuaW1wb3J0IHsgc2NhbGFyX2V4cHIgfSBmcm9tIFwiLi9zY2FsYXJfZXhwci5qc1wiXG5pbXBvcnQgeyBleHByVHlwZSwgb3BQcmVjIH0gZnJvbSBcIi4vQlRNX3Jvb3QuanNcIlxuXG5leHBvcnQgY2xhc3MgbXVsdGlvcF9leHByIGV4dGVuZHMgZXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IobWVudiwgb3AsIGlucHV0cykge1xuICAgICAgICBzdXBlcihtZW52KTtcbiAgICAgICAgdGhpcy50eXBlID0gZXhwclR5cGUubXVsdGlvcDtcbiAgICAgICAgdGhpcy5vcCA9IG9wO1xuICAgICAgICB0aGlzLmlucHV0cyA9IGlucHV0czsgLy8gYW4gYXJyYXlcbiAgICAgICAgZm9yICh2YXIgaSBpbiBpbnB1dHMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXRzW2ldID09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgICAgIGlucHV0c1tpXSA9IG5ldyBleHByZXNzaW9uKG1lbnYpO1xuICAgICAgICAgICAgaW5wdXRzW2ldLnBhcmVudCA9IHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChvcCkge1xuICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLmFkZHN1YjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5tdWx0ZGl2O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBhbGVydChcIlVua25vd24gbXVsdGktb3BlcmFuZCBvcGVyYXRvcjogJ1wiK29wK1wiJy5cIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgdmFyIHRoZVN0cixcbiAgICAgICAgICAgIG9wU3RyLFxuICAgICAgICAgICAgaXNFcnJvciA9IGZhbHNlLFxuICAgICAgICAgICAgc2hvd09wO1xuXG4gICAgICAgIHRoZVN0ciA9ICcnO1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICBzaG93T3AgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0c1tpXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIG9wU3RyID0gJz8nO1xuICAgICAgICAgICAgICAgIGlzRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvcFN0ciA9IHRoaXMuaW5wdXRzW2ldLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgaWYgKCh0aGlzLmlucHV0c1tpXS50eXBlID49IGV4cHJUeXBlLnVub3BcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzW2ldLnByZWMgPD0gdGhpcy5wcmVjKVxuICAgICAgICAgICAgICAgICAgICB8fCAodGhpcy5pbnB1dHNbaV0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzW2ldLm51bWJlci5xICE9IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIG9wUHJlYy5tdWx0ZGl2IDw9IHRoaXMucHJlYylcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgb3BTdHIgPSAnKCcgKyBvcFN0ciArICcpJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGVTdHIgKz0gKCBpPjAgPyB0aGlzLm9wIDogJycgKSArIG9wU3RyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKHRoZVN0cik7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRlc3RlZCBlcXVpdmFsZW50IHN0cmluZ3MuXG4gICAgYWxsU3RyaW5nRXF1aXZzKCkge1xuICAgICAgICB2YXIgYWxsSW5wdXRzQXJyYXlzID0gW107XG5cbiAgICAgICAgdmFyIGluZGV4TGlzdCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICBhbGxJbnB1dHNBcnJheXNbaV0gPSB0aGlzLmlucHV0c1tpXS5hbGxTdHJpbmdFcXVpdnMoKTtcbiAgICAgICAgICAgIGluZGV4TGlzdC5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpbnB1dFBlcm1zID0gcGVybXV0YXRpb25zKGluZGV4TGlzdCk7XG5cbiAgICAgICAgdmFyIHJldFZhbHVlID0gW107XG5cbiAgICAgICAgdmFyIHRoZU9wID0gdGhpcy5vcDtcbiAgICAgICAgaWYgKHRoZU9wID09ICd8Jykge1xuICAgICAgICAgICAgLy8gRG9uJ3Qgd2FudCBcIm9yXCIgdG8gYmUgdHJhbnNsYXRlZCBhcyBhYnNvbHV0ZSB2YWx1ZVxuICAgICAgICAgICAgdGhlT3AgPSAnICQgJztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkU3RyaW5nRXF1aXZzKGluZGV4TGlzdCwgbGVmdFN0cikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBsZWZ0U3RyID09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICBsZWZ0U3RyID0gXCJcIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZXhMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBsZWZ0U3RyICs9IHRoZU9wO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluZGV4TGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHdvcmtJbnB1dHMgPSBhbGxJbnB1dHNBcnJheXNbaW5kZXhMaXN0WzBdXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIHdvcmtJbnB1dHMpIHtcbiAgICAgICAgICAgICAgICAgICAgYnVpbGRTdHJpbmdFcXVpdnMoaW5kZXhMaXN0LnNsaWNlKDEpLCBsZWZ0U3RyICsgXCIoXCIgKyB3b3JrSW5wdXRzW2ldICsgXCIpXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0VmFsdWUucHVzaChsZWZ0U3RyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgaW4gaW5wdXRQZXJtcykge1xuICAgICAgICAgICAgYnVpbGRTdHJpbmdFcXVpdnMoaW5wdXRQZXJtc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ocmV0VmFsdWUpO1xuICAgIH1cblxuICAgIHRvVGVYKHNob3dTZWxlY3QpIHtcbiAgICAgICAgdmFyIHRoZVN0cjtcbiAgICAgICAgdmFyIHRoZU9wO1xuICAgICAgICB2YXIgb3BTdHI7XG4gICAgICAgIHZhciBhcmdTdHJMLCBhcmdTdHJSLCBvcFN0ckwsIG9wU3RyUjtcblxuICAgICAgICBpZiAodHlwZW9mIHNob3dTZWxlY3QgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHNob3dTZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoZU9wID0gdGhpcy5vcDtcbiAgICAgICAgaWYgKHRoaXMub3AgPT0gJyonKSB7XG4gICAgICAgICAgICBpZiAoc2hvd1NlbGVjdCAmJiB0aGlzLnNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHRoZU9wID0gJ1xcXFx0aW1lcyc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoZU9wID0gJyAnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNob3dTZWxlY3QgJiYgdGhpcy5zZWxlY3QpIHtcbiAgICAgICAgICAgIGFyZ1N0ckwgPSAne1xcXFxjb2xvcntibHVlfSc7XG4gICAgICAgICAgICBhcmdTdHJSID0gJ30nO1xuICAgICAgICAgICAgb3BTdHJMID0gJ3tcXFxcY29sb3J7cmVkfSc7XG4gICAgICAgICAgICBvcFN0clIgPSAnfSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcmdTdHJMID0gJyc7XG4gICAgICAgICAgICBhcmdTdHJSID0gJyc7XG4gICAgICAgICAgICBvcFN0ckwgPSAnJztcbiAgICAgICAgICAgIG9wU3RyUiA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhlU3RyID0gJyc7XG4gICAgICAgIHZhciBtaW5QcmVjID0gdGhpcy5wcmVjO1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuaW5wdXRzW2ldID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgb3BTdHIgPSAnPyc7XG4gICAgICAgICAgICAgICAgdGhlU3RyICs9ICggaT4wID8gb3BTdHJMICsgdGhlT3AgKyBvcFN0clIgOiAnJyApICsgb3BTdHI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wID09ICcqJ1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbaV0udHlwZSA9PSBleHByVHlwZS51bm9wICYmIHRoaXMuaW5wdXRzW2ldLm9wID09ICcvJ1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgIShzaG93U2VsZWN0ICYmIHRoaXMuc2VsZWN0KSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG9wU3RyID0gYXJnU3RyTCArIHRoaXMuaW5wdXRzW2ldLmlucHV0c1swXS50b1RlWChzaG93U2VsZWN0KSArIGFyZ1N0clI7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1tpXS5pbnB1dHNbMF0udHlwZSA+PSBleHByVHlwZS51bm9wICYmIHRoaXMuaW5wdXRzW2ldLmlucHV0c1swXS5wcmVjIDwgbWluUHJlYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BTdHIgPSAnXFxcXGxlZnQoJyArIG9wU3RyICsgJ1xcXFxyaWdodCknO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGVTdHIgPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZVN0ciA9ICcxJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoZVN0ciA9ICdcXFxcZnJhY3snICsgdGhlU3RyICsgJ317JyArIG9wU3RyICsgJ30nO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9wID09ICcrJ1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbaV0udHlwZSA9PSBleHByVHlwZS51bm9wICYmIHRoaXMuaW5wdXRzW2ldLm9wID09ICctJ1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgIShzaG93U2VsZWN0ICYmIHRoaXMuc2VsZWN0KSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG9wU3RyID0gYXJnU3RyTCArIHRoaXMuaW5wdXRzW2ldLnRvVGVYKHNob3dTZWxlY3QpICsgYXJnU3RyUjtcbiAgICAgICAgICAgICAgICAgICAgdGhlU3RyICs9IG9wU3RyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG9wU3RyID0gYXJnU3RyTCArIHRoaXMuaW5wdXRzW2ldLnRvVGVYKHNob3dTZWxlY3QpICsgYXJnU3RyUjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCh0aGlzLmlucHV0c1tpXS50eXBlID49IGV4cHJUeXBlLnVub3BcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1tpXS5wcmVjIDw9IG1pblByZWMpXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCAoaT4wICYmIHRoaXMub3AgPT0gJyonICYmIHRoaXMuaW5wdXRzW2ldLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BTdHIgPSAnXFxcXGxlZnQoJyArIG9wU3RyICsgJ1xcXFxyaWdodCknO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoZVN0ciArPSAoIGk+MCA/IG9wU3RyTCArIHRoZU9wICsgb3BTdHJSIDogJycgKSArIG9wU3RyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybih0aGVTdHIpO1xuICAgIH1cblxuICAgIHRvTWF0aE1MKCkge1xuICAgICAgICB2YXIgdGhlU3RyO1xuICAgICAgICB2YXIgdGhlT3A7XG4gICAgICAgIHZhciBvcFN0cjtcblxuICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgIHRoZU9wID0gXCI8cGx1cy8+XCJcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgIHRoZU9wID0gXCI8dGltZXMvPlwiXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB0aGVTdHIgPSBcIjxhcHBseT5cIiArIHRoZU9wO1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuaW5wdXRzW2ldID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgb3BTdHIgPSAnPyc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9wU3RyID0gdGhpcy5pbnB1dHNbaV0udG9NYXRoTUwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoZVN0ciArPSBvcFN0cjtcbiAgICAgICAgfVxuICAgICAgICB0aGVTdHIgKz0gXCI8L2FwcGx5PlwiO1xuXG4gICAgICAgIHJldHVybih0aGVTdHIpO1xuICAgIH1cblxuICAgIG9wZXJhdGVUb1RlWCgpIHtcbiAgICAgICAgdmFyIG9wU3RyaW5nID0gdGhpcy5vcDtcblxuICAgICAgICBzd2l0Y2ggKG9wU3RyaW5nKSB7XG4gICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICBvcFN0cmluZyA9ICdcXFxcdGltZXMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKG9wU3RyaW5nKTtcbiAgICB9XG5cbiAgICBpc0NvbW11dGF0aXZlKCkge1xuICAgICAgICB2YXIgY29tbXV0ZXMgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMub3AgPT09ICcrJyB8fCB0aGlzLm9wID09PSAnKicpIHtcbiAgICAgICAgICAgIGNvbW11dGVzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4oY29tbXV0ZXMpO1xuICAgIH1cblxuICAgIGV2YWx1YXRlKGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciBpbnB1dFZhbDtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciByZXRWYWw7XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLm9wKSB7XG4gICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICByZXRWYWwgPSAwO1xuICAgICAgICAgICAgICAgIGZvciAoaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dFZhbCA9IHRoaXMuaW5wdXRzW2ldLmV2YWx1YXRlKGJpbmRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsICs9IGlucHV0VmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgIHJldFZhbCA9IDE7XG4gICAgICAgICAgICAgICAgZm9yIChpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0VmFsID0gdGhpcy5pbnB1dHNbaV0uZXZhbHVhdGUoYmluZGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICByZXRWYWwgKj0gaW5wdXRWYWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZSBiaW5hcnkgb3BlcmF0b3IgJ1wiICsgdGhpcy5vcCArIFwiJyBpcyBub3QgZGVmaW5lZC5cIik7XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWwpO1xuICAgIH1cblxuICAgIC8vIEZsYXR0ZW4gYW5kIGFsc28gc29ydCB0ZXJtcy5cbiAgICBmbGF0dGVuKCkge1xuICAgICAgICB2YXIgbmV3SW5wdXRzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgIHZhciBuZXh0SW5wdXQgPSB0aGlzLmlucHV0c1tpXS5mbGF0dGVuKCk7XG4gICAgICAgICAgICBpZiAobmV4dElucHV0LnR5cGUgPT0gZXhwclR5cGUubXVsdGlvcCAmJiBuZXh0SW5wdXQub3AgPT0gdGhpcy5vcCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gbmV4dElucHV0LmlucHV0cykge1xuICAgICAgICAgICAgICAgICAgICBuZXdJbnB1dHMucHVzaChuZXh0SW5wdXQuaW5wdXRzW2pdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld0lucHV0cy5wdXNoKG5leHRJbnB1dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmV0VmFsdWU7XG4gICAgICAgIGlmIChuZXdJbnB1dHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIC8vIEFkZGluZyBubyBlbGVtZW50cyA9IDBcbiAgICAgICAgICAgIC8vIE11bHRpcGx5aW5nIG5vIGVsZW1lbnRzID0gMVxuICAgICAgICAgICAgcmV0VmFsdWUgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCB0aGlzLm9wID09ICcrJyA/IDAgOiAxKTtcbiAgICAgICAgfSBlbHNlIGlmIChuZXdJbnB1dHMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIHJldFZhbHVlID0gbmV3SW5wdXRzWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gU29ydCB0aGUgaW5wdXRzIGJ5IHByZWNlZGVuY2UgZm9yIHByb2R1Y3RzXG4gICAgICAgICAgICAvLyBVc3VhbGx5IHZlcnkgc21hbGwsIHNvIGJ1YmJsZSBzb3J0IGlzIGdvb2QgZW5vdWdoXG4gICAgICAgICAgICBpZiAodGhpcy5vcD09JyonKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRtcDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8bmV3SW5wdXRzLmxlbmd0aC0xOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaj1pKzE7IGo8bmV3SW5wdXRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3SW5wdXRzW2ldLnR5cGUgPiBuZXdJbnB1dHNbal0udHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRtcCA9IG5ld0lucHV0c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdJbnB1dHNbaV0gPSBuZXdJbnB1dHNbal07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SW5wdXRzW2pdID0gdG1wO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0VmFsdWUgPSBuZXcgbXVsdGlvcF9leHByKHRoaXMubWVudiwgdGhpcy5vcCwgbmV3SW5wdXRzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ocmV0VmFsdWUpO1xuICAgIH1cblxuICAgIC8vIFNlZSBpZiB0aGlzIG9wZXJhdG9yIGlzIG5vdyByZWR1bmRhbnQuXG4gICAgLy8gUmV0dXJuIHRoZSByZXN1bHRpbmcgZXhwcmVzc2lvbi5cbiAgICByZWR1Y2UoKSB7XG4gICAgICAgIHZhciBuZXdFeHByID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMuaW5wdXRzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBTdW0gd2l0aCBubyBlbGVtZW50cyA9IDBcbiAgICAgICAgICAgICAgICAvLyBQcm9kdWN0IHdpdGggbm8gZWxlbWVudHMgPSAxXG4gICAgICAgICAgICAgICAgbmV3RXhwciA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLm1lbnYsIHRoaXMub3AgPT0gJysnID8gMCA6IDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBTdW0gb3IgcHJvZHVjdCB3aXRoIG9uZSBlbGVtZW50ICppcyogdGhhdCBlbGVtZW50LlxuICAgICAgICAgICAgICAgIG5ld0V4cHIgPSB0aGlzLmlucHV0c1swXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld0V4cHIucGFyZW50ID0gdGhpcy5wYXJlbnQ7XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJlbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5pbnB1dFN1YnN0KHRoaXMsIG5ld0V4cHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybihuZXdFeHByKTtcbiAgICB9XG5cbiAgICBzaW1wbGlmeUNvbnN0YW50cygpIHtcbiAgICAgICAgdmFyIGksXG4gICAgICAgICAgICBjb25zdEluZGV4ID0gW10sXG4gICAgICAgICAgICBuZXdJbnB1dHMgPSBbXTtcbiAgICAgICAgLy8gU2ltcGxpZnkgYWxsIGlucHV0c1xuICAgICAgICAvLyBOb3RpY2Ugd2hpY2ggaW5wdXRzIGFyZSB0aGVtc2VsdmVzIGNvbnN0YW50IFxuICAgICAgICBmb3IgKGkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRzW2ldID0gdGhpcy5pbnB1dHNbaV0uc2ltcGxpZnlDb25zdGFudHMoKTtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRzW2ldLnBhcmVudCA9IHRoaXM7XG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbaV0udHlwZSA9PSBleHByVHlwZS5udW1iZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdEluZGV4LnB1c2goaSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld0lucHV0cy5wdXNoKHRoaXMuaW5wdXRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZvciBhbGwgaW5wdXRzIHRoYXQgYXJlIGNvbnN0YW50cywgZ3JvdXAgdGhlbSB0b2dldGhlciBhbmQgc2ltcGxpZnkuXG4gICAgICAgIHZhciBuZXdFeHByID0gdGhpcztcbiAgICAgICAgaWYgKGNvbnN0SW5kZXgubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgdmFyIG5ld0NvbnN0YW50ID0gdGhpcy5pbnB1dHNbY29uc3RJbmRleFswXV0ubnVtYmVyO1xuICAgICAgICAgICAgZm9yIChpPTE7IGk8Y29uc3RJbmRleC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5vcCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbnN0YW50ID0gbmV3Q29uc3RhbnQuYWRkKHRoaXMuaW5wdXRzW2NvbnN0SW5kZXhbaV1dLm51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdDb25zdGFudCA9IG5ld0NvbnN0YW50Lm11bHRpcGx5KHRoaXMuaW5wdXRzW2NvbnN0SW5kZXhbaV1dLm51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEZvciBhZGRpdGlvbiwgdGhlIGNvbnN0YW50IGdvZXMgdG8gdGhlIGVuZC5cbiAgICAgICAgICAgIC8vIEZvciBtdWx0aXBsaWNhdGlvbiwgdGhlIGNvbnN0YW50IGdvZXMgdG8gdGhlIGJlZ2lubmluZy5cbiAgICAgICAgICAgIHZhciBuZXdJbnB1dDtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5vcCkge1xuICAgICAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgICAgICBuZXdJbnB1dHMucHVzaChuZXdJbnB1dCA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLm1lbnYsIG5ld0NvbnN0YW50KSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgICAgICBuZXdJbnB1dHMuc3BsaWNlKDAsIDAsIG5ld0lucHV0ID0gbmV3IHNjYWxhcl9leHByKHRoaXMubWVudiwgbmV3Q29uc3RhbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobmV3SW5wdXRzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgbmV3RXhwciA9IG5ld0lucHV0c1swXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3SW5wdXQucGFyZW50ID0gdGhpcztcbiAgICAgICAgICAgICAgICBuZXdFeHByID0gbmV3IG11bHRpb3BfZXhwcih0aGlzLm1lbnYsIHRoaXMub3AsIG5ld0lucHV0cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKG5ld0V4cHIpO1xuICAgIH1cblxuICAgIC8vIFRoaXMgY29tcGFyaXNvbiByb3V0aW5lIG5lZWRzIHRvIGRlYWwgd2l0aCB0d28gaXNzdWVzLlxuICAgIC8vICgxKSBUaGUgcGFzc2VkIGV4cHJlc3Npb24gaGFzIG1vcmUgaW5wdXRzIHRoYW4gdGhpcyAoaW4gd2hpY2ggY2FzZSB3ZSBncm91cCB0aGVtKVxuICAgIC8vICgyKSBQb3NzaWJpbGl0eSBvZiBjb21tdXRpbmcgbWFrZXMgdGhlIG1hdGNoIHdvcmsuXG4gICAgbWF0Y2goZXhwciwgYmluZGluZ3MpIHtcbiAgICAgICAgZnVuY3Rpb24gY29weUJpbmRpbmdzKGJpbmRpbmdzKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgcmV0VmFsdWUgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBiaW5kaW5ncykge1xuICAgICAgICAgICAgICAgIHJldFZhbHVlW2tleV0gPSBiaW5kaW5nc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuKHJldFZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXRWYWx1ZSA9IG51bGwsXG4gICAgICAgICAgICBuID0gdGhpcy5pbnB1dHMubGVuZ3RoO1xuICAgICAgICBpZiAoZXhwci50eXBlID09IGV4cHJUeXBlLm11bHRpb3AgJiYgdGhpcy5vcCA9PSBleHByLm9wXG4gICAgICAgICAgICAgICAgJiYgbiA8PSBleHByLmlucHV0cy5sZW5ndGgpIHtcblxuICAgICAgICAgICAgLy8gTWF0Y2ggb24gZmlyc3Qgbi0xIGFuZCBncm91cCByZW1haW5kZXIgYXQgZW5kLlxuICAgICAgICAgICAgdmFyIGNtcEV4cHIsXG4gICAgICAgICAgICAgICAgY21wSW5wdXRzID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaTwobi0xKSB8fCBleHByLmlucHV0cy5sZW5ndGg9PW4pIHtcbiAgICAgICAgICAgICAgICAgICAgY21wSW5wdXRzW2ldID0gZXhwci5pbnB1dHNbaV0uY29weSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBjb3BpZXMgb2YgdGhlIGlucHV0c1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3SW5wdXRzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGo9MDsgajw9ZXhwci5pbnB1dHMubGVuZ3RoLW47IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3SW5wdXRzW2pdID0gZXhwci5pbnB1dHNbbitqLTFdLmNvcHkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjbXBJbnB1dHNbaV0gPSBuZXcgbXVsdGlvcF9leHByKHRoaXMubWVudiwgZXhwci5vcCwgbmV3SW5wdXRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjbXBFeHByID0gbmV3IG11bHRpb3BfZXhwcih0aGlzLm1lbnYsIGV4cHIub3AsIGNtcElucHV0cyk7XG5cbiAgICAgICAgICAgIC8vIE5vdyBtYWtlIHRoZSBjb21wYXJpc29uLlxuICAgICAgICAgICAgcmV0VmFsdWUgPSBjb3B5QmluZGluZ3MoYmluZGluZ3MpO1xuICAgICAgICAgICAgcmV0VmFsdWUgPSBleHByZXNzaW9uLnByb3RvdHlwZS5tYXRjaC5jYWxsKHRoaXMsIGNtcEV4cHIsIHJldFZhbHVlKTtcblxuICAgICAgICAgICAgLy8gSWYgc3RpbGwgZmFpbCB0byBtYXRjaCwgdHJ5IHRoZSByZXZlcnNlIGdyb3VwaW5nOiBtYXRjaCBvbiBsYXN0IG4tMSBhbmQgZ3JvdXAgYmVnaW5uaW5nLlxuICAgICAgICAgICAgaWYgKHJldFZhbHVlID09IG51bGwgJiYgbiA8IGV4cHIuaW5wdXRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHZhciBkaWZmID0gZXhwci5pbnB1dHMubGVuZ3RoIC0gbjtcbiAgICAgICAgICAgICAgICBjbXBJbnB1dHMgPSBbXTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGk9PTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBjb3BpZXMgb2YgdGhlIGlucHV0c1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0lucHV0cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaj0wOyBqPD1kaWZmOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdJbnB1dHNbal0gPSBleHByLmlucHV0c1tqXS5jb3B5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbXBJbnB1dHNbaV0gPSBuZXcgbXVsdGlvcF9leHByKHRoaXMubWVudiwgZXhwci5vcCwgbmV3SW5wdXRzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtcElucHV0c1tpXSA9IGV4cHIuaW5wdXRzW2RpZmYraV0uY29weSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNtcEV4cHIgPSBuZXcgbXVsdGlvcF9leHByKHRoaXMubWVudiwgZXhwci5vcCwgY21wSW5wdXRzKTtcblxuICAgICAgICAgICAgICAgIC8vIE5vdyBtYWtlIHRoZSBjb21wYXJpc29uLlxuICAgICAgICAgICAgICAgIHJldFZhbHVlID0gY29weUJpbmRpbmdzKGJpbmRpbmdzKTtcbiAgICAgICAgICAgICAgICByZXRWYWx1ZSA9IGV4cHJlc3Npb24ucHJvdG90eXBlLm1hdGNoLmNhbGwodGhpcywgY21wRXhwciwgcmV0VmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxuXG4gICAgY29tcG9zZShiaW5kaW5ncykge1xuICAgICAgICB2YXIgbmV3SW5wdXRzID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgbmV3SW5wdXRzLnB1c2godGhpcy5pbnB1dHNbaV0uY29tcG9zZShiaW5kaW5ncykpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJldFZhbHVlO1xuICAgICAgICBpZiAobmV3SW5wdXRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXRWYWx1ZSA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLm1lbnYsIHRoaXMub3AgPT0gJysnID8gMCA6IDEpO1xuICAgICAgICB9IGVsc2UgaWYgKG5ld0lucHV0cy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgcmV0VmFsdWUgPSBuZXdJbnB1dHNbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXRWYWx1ZSA9IG5ldyBtdWx0aW9wX2V4cHIodGhpcy5tZW52LCB0aGlzLm9wLCBuZXdJbnB1dHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxuXG4gICAgZGVyaXZhdGl2ZShpdmFyLCB2YXJMaXN0KSB7XG4gICAgICAgIHZhciBkVGVybXMgPSBbXTtcblxuICAgICAgICB2YXIgdGhlRGVyaXY7XG4gICAgICAgIHZhciBpLCBkdWR4O1xuICAgICAgICBmb3IgKGkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pbnB1dHNbaV0uaXNDb25zdGFudCgpKSB7XG4gICAgICAgICAgICAgICAgZHVkeCA9IHRoaXMuaW5wdXRzW2ldLmRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCk7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgICAgICAgICAgZFRlcm1zLnB1c2goZHVkeCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZFByb2RUZXJtcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT0gaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkUHJvZFRlcm1zLnB1c2goZHVkeCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZFByb2RUZXJtcy5wdXNoKHRoaXMuaW5wdXRzW2pdLmNvbXBvc2Uoe30pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBkVGVybXMucHVzaChuZXcgbXVsdGlvcF9leHByKHRoaXMubWVudiwgJyonLCBkUHJvZFRlcm1zKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRUZXJtcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCAwKTtcbiAgICAgICAgfSBlbHNlIGlmIChkVGVybXMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIHRoZURlcml2ID0gZFRlcm1zWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgbXVsdGlvcF9leHByKHRoaXMubWVudiwgJysnLCBkVGVybXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybih0aGVEZXJpdik7XG4gICAgfVxufSIsIi8qIVxuICogQlRNIEphdmFTY3JpcHQgTGlicmFyeSB2QFZFUlNJT05cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kYnJpYW53YWx0b24vQlRNXG4gKlxuICogQ29weXJpZ2h0IEQuIEJyaWFuIFdhbHRvblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIChodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVClcbiAqXG4gKiBEYXRlOiBAREFURVxuICovXG5cbmltcG9ydCB7IHJhdGlvbmFsX251bWJlciB9IGZyb20gXCIuL3JhdGlvbmFsX251bWJlci5qc1wiXG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogICAgUm91dGluZXMgZm9yIGRlYWxpbmcgd2l0aCByYW5kb20gdmFsdWVzXG4qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuLyogVG8gdXNlIGEgc2VlZGVkIFJORywgd2UgcmVseSBvbiBhbiBvcGVuIHNvdXJjZSBwcm9qZWN0IGZvciB0aGUgdW5kZXJseWluZyBtZWNoYW5pY3MuICovXG5cbi8qLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuYWxlYVBSTkcgMS4xXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmh0dHBzOi8vZ2l0aHViLmNvbS9tYWNtY21lYW5zL2FsZWFQUk5HL2Jsb2IvbWFzdGVyL2FsZWFQUk5HLTEuMS5qc1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5PcmlnaW5hbCB3b3JrIGNvcHlyaWdodCDCqSAyMDEwIEpvaGFubmVzIEJhYWfDuGUsIHVuZGVyIE1JVCBsaWNlbnNlXG5UaGlzIGlzIGEgZGVyaXZhdGl2ZSB3b3JrIGNvcHlyaWdodCAoYykgMjAxNy0yMDIwLCBXLiBNYWNcIiBNY01lYW5zLCB1bmRlciBCU0QgbGljZW5zZS5cblJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dCBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcbjEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbjIuIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cbjMuIE5laXRoZXIgdGhlIG5hbWUgb2YgdGhlIGNvcHlyaWdodCBob2xkZXIgbm9yIHRoZSBuYW1lcyBvZiBpdHMgY29udHJpYnV0b3JzIG1heSBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0cyBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cblRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgSE9MREVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8qL1xuZnVuY3Rpb24gYWxlYVBSTkcoKSB7XG4gICAgcmV0dXJuKCBmdW5jdGlvbiggYXJncyApIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgY29uc3QgdmVyc2lvbiA9ICdhbGVhUFJORyAxLjEuMCc7XG5cbiAgICAgICAgdmFyIHMwXG4gICAgICAgICAgICAsIHMxXG4gICAgICAgICAgICAsIHMyXG4gICAgICAgICAgICAsIGNcbiAgICAgICAgICAgICwgdWludGEgPSBuZXcgVWludDMyQXJyYXkoIDMgKVxuICAgICAgICAgICAgLCBpbml0aWFsQXJnc1xuICAgICAgICAgICAgLCBtYXNodmVyID0gJydcbiAgICAgICAgO1xuXG4gICAgICAgIC8qIHByaXZhdGU6IGluaXRpYWxpemVzIGdlbmVyYXRvciB3aXRoIHNwZWNpZmllZCBzZWVkICovXG4gICAgICAgIGZ1bmN0aW9uIF9pbml0U3RhdGUoIF9pbnRlcm5hbFNlZWQgKSB7XG4gICAgICAgICAgICB2YXIgbWFzaCA9IE1hc2goKTtcblxuICAgICAgICAgICAgLy8gaW50ZXJuYWwgc3RhdGUgb2YgZ2VuZXJhdG9yXG4gICAgICAgICAgICBzMCA9IG1hc2goICcgJyApO1xuICAgICAgICAgICAgczEgPSBtYXNoKCAnICcgKTtcbiAgICAgICAgICAgIHMyID0gbWFzaCggJyAnICk7XG5cbiAgICAgICAgICAgIGMgPSAxO1xuXG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IF9pbnRlcm5hbFNlZWQubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgczAgLT0gbWFzaCggX2ludGVybmFsU2VlZFsgaSBdICk7XG4gICAgICAgICAgICAgICAgaWYoIHMwIDwgMCApIHsgczAgKz0gMTsgfVxuXG4gICAgICAgICAgICAgICAgczEgLT0gbWFzaCggX2ludGVybmFsU2VlZFsgaSBdICk7XG4gICAgICAgICAgICAgICAgaWYoIHMxIDwgMCApIHsgczEgKz0gMTsgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHMyIC09IG1hc2goIF9pbnRlcm5hbFNlZWRbIGkgXSApO1xuICAgICAgICAgICAgICAgIGlmKCBzMiA8IDAgKSB7IHMyICs9IDE7IH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWFzaHZlciA9IG1hc2gudmVyc2lvbjtcblxuICAgICAgICAgICAgbWFzaCA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHJpdmF0ZTogZGVwZW5kZW50IHN0cmluZyBoYXNoIGZ1bmN0aW9uICovXG4gICAgICAgIGZ1bmN0aW9uIE1hc2goKSB7XG4gICAgICAgICAgICB2YXIgbiA9IDQwMjI4NzExOTc7IC8vIDB4ZWZjODI0OWRcblxuICAgICAgICAgICAgdmFyIG1hc2ggPSBmdW5jdGlvbiggZGF0YSApIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGNhY2hlIHRoZSBsZW5ndGhcbiAgICAgICAgICAgICAgICBmb3IoIHZhciBpID0gMCwgbCA9IGRhdGEubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuICAgICAgICAgICAgICAgICAgICBuICs9IGRhdGEuY2hhckNvZGVBdCggaSApO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdmFyIGggPSAwLjAyNTE5NjAzMjgyNDE2OTM4ICogbjtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIG4gID0gaCA+Pj4gMDtcbiAgICAgICAgICAgICAgICAgICAgaCAtPSBuO1xuICAgICAgICAgICAgICAgICAgICBoICo9IG47XG4gICAgICAgICAgICAgICAgICAgIG4gID0gaCA+Pj4gMDtcbiAgICAgICAgICAgICAgICAgICAgaCAtPSBuO1xuICAgICAgICAgICAgICAgICAgICBuICs9IGggKiA0Mjk0OTY3Mjk2OyAvLyAweDEwMDAwMDAwMCAgICAgIDJeMzJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuICggbiA+Pj4gMCApICogMi4zMjgzMDY0MzY1Mzg2OTYzZS0xMDsgLy8gMl4tMzJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIG1hc2gudmVyc2lvbiA9ICdNYXNoIDAuOSc7XG4gICAgICAgICAgICByZXR1cm4gbWFzaDtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qIHByaXZhdGU6IGNoZWNrIGlmIG51bWJlciBpcyBpbnRlZ2VyICovXG4gICAgICAgIGZ1bmN0aW9uIF9pc0ludGVnZXIoIF9pbnQgKSB7IFxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KCBfaW50LCAxMCApID09PSBfaW50OyBcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHJldHVybiBhIDMyLWJpdCBmcmFjdGlvbiBpbiB0aGUgcmFuZ2UgWzAsIDFdXG4gICAgICAgIFRoaXMgaXMgdGhlIG1haW4gZnVuY3Rpb24gcmV0dXJuZWQgd2hlbiBhbGVhUFJORyBpcyBpbnN0YW50aWF0ZWRcbiAgICAgICAgKi9cbiAgICAgICAgdmFyIHJhbmRvbSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHQgPSAyMDkxNjM5ICogczAgKyBjICogMi4zMjgzMDY0MzY1Mzg2OTYzZS0xMDsgLy8gMl4tMzJcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgICAgIHMxID0gczI7XG5cbiAgICAgICAgICAgIHJldHVybiBzMiA9IHQgLSAoIGMgPSB0IHwgMCApO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogcmV0dXJuIGEgNTMtYml0IGZyYWN0aW9uIGluIHRoZSByYW5nZSBbMCwgMV0gKi9cbiAgICAgICAgcmFuZG9tLmZyYWN0NTMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiByYW5kb20oKSArICggcmFuZG9tKCkgKiAweDIwMDAwMCAgfCAwICkgKiAxLjExMDIyMzAyNDYyNTE1NjVlLTE2OyAvLyAyXi01M1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogcmV0dXJuIGFuIHVuc2lnbmVkIGludGVnZXIgaW4gdGhlIHJhbmdlIFswLCAyXjMyXSAqL1xuICAgICAgICByYW5kb20uaW50MzIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiByYW5kb20oKSAqIDB4MTAwMDAwMDAwOyAvLyAyXjMyXG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiBhZHZhbmNlIHRoZSBnZW5lcmF0b3IgdGhlIHNwZWNpZmllZCBhbW91bnQgb2YgY3ljbGVzICovXG4gICAgICAgIHJhbmRvbS5jeWNsZSA9IGZ1bmN0aW9uKCBfcnVuICkge1xuICAgICAgICAgICAgX3J1biA9IHR5cGVvZiBfcnVuID09PSAndW5kZWZpbmVkJyA/IDEgOiArX3J1bjtcbiAgICAgICAgICAgIGlmKCBfcnVuIDwgMSApIHsgX3J1biA9IDE7IH1cbiAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgX3J1bjsgaSsrICkgeyByYW5kb20oKTsgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogcmV0dXJuIGluY2x1c2l2ZSByYW5nZSAqL1xuICAgICAgICByYW5kb20ucmFuZ2UgPSBmdW5jdGlvbigpIHsgXG4gICAgICAgICAgICB2YXIgbG9Cb3VuZFxuICAgICAgICAgICAgICAgICwgaGlCb3VuZFxuICAgICAgICAgICAgO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiggYXJndW1lbnRzLmxlbmd0aCA9PT0gMSApIHtcbiAgICAgICAgICAgICAgICBsb0JvdW5kID0gMDtcbiAgICAgICAgICAgICAgICBoaUJvdW5kID0gYXJndW1lbnRzWyAwIF07XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9Cb3VuZCA9IGFyZ3VtZW50c1sgMCBdO1xuICAgICAgICAgICAgICAgIGhpQm91bmQgPSBhcmd1bWVudHNbIDEgXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIGFyZ3VtZW50c1sgMCBdID4gYXJndW1lbnRzWyAxIF0gKSB7IFxuICAgICAgICAgICAgICAgIGxvQm91bmQgPSBhcmd1bWVudHNbIDEgXTtcbiAgICAgICAgICAgICAgICBoaUJvdW5kID0gYXJndW1lbnRzWyAwIF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHJldHVybiBpbnRlZ2VyXG4gICAgICAgICAgICBpZiggX2lzSW50ZWdlciggbG9Cb3VuZCApICYmIF9pc0ludGVnZXIoIGhpQm91bmQgKSApIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoIHJhbmRvbSgpICogKCBoaUJvdW5kIC0gbG9Cb3VuZCArIDEgKSApICsgbG9Cb3VuZDsgXG5cbiAgICAgICAgICAgIC8vIHJldHVybiBmbG9hdFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmFuZG9tKCkgKiAoIGhpQm91bmQgLSBsb0JvdW5kICkgKyBsb0JvdW5kOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IGluaXRpYWxpemUgZ2VuZXJhdG9yIHdpdGggdGhlIHNlZWQgdmFsdWVzIHVzZWQgdXBvbiBpbnN0YW50aWF0aW9uICovXG4gICAgICAgIHJhbmRvbS5yZXN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBfaW5pdFN0YXRlKCBpbml0aWFsQXJncyApO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogc2VlZGluZyBmdW5jdGlvbiAqL1xuICAgICAgICByYW5kb20uc2VlZCA9IGZ1bmN0aW9uKCkgeyBcbiAgICAgICAgICAgIF9pbml0U3RhdGUoIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSApO1xuICAgICAgICB9OyBcblxuICAgICAgICAvKiBwdWJsaWM6IHNob3cgdGhlIHZlcnNpb24gb2YgdGhlIFJORyAqL1xuICAgICAgICByYW5kb20udmVyc2lvbiA9IGZ1bmN0aW9uKCkgeyBcbiAgICAgICAgICAgIHJldHVybiB2ZXJzaW9uO1xuICAgICAgICB9OyBcblxuICAgICAgICAvKiBwdWJsaWM6IHNob3cgdGhlIHZlcnNpb24gb2YgdGhlIFJORyBhbmQgdGhlIE1hc2ggc3RyaW5nIGhhc2hlciAqL1xuICAgICAgICByYW5kb20udmVyc2lvbnMgPSBmdW5jdGlvbigpIHsgXG4gICAgICAgICAgICByZXR1cm4gdmVyc2lvbiArICcsICcgKyBtYXNodmVyO1xuICAgICAgICB9OyBcblxuICAgICAgICAvLyB3aGVuIG5vIHNlZWQgaXMgc3BlY2lmaWVkLCBjcmVhdGUgYSByYW5kb20gb25lIGZyb20gV2luZG93cyBDcnlwdG8gKE1vbnRlIENhcmxvIGFwcGxpY2F0aW9uKSBcbiAgICAgICAgaWYoIGFyZ3MubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKCB1aW50YSApO1xuICAgICAgICAgICAgIGFyZ3MgPSBbIHVpbnRhWyAwIF0sIHVpbnRhWyAxIF0sIHVpbnRhWyAyIF0gXTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBzdG9yZSB0aGUgc2VlZCB1c2VkIHdoZW4gdGhlIFJORyB3YXMgaW5zdGFudGlhdGVkLCBpZiBhbnlcbiAgICAgICAgaW5pdGlhbEFyZ3MgPSBhcmdzO1xuXG4gICAgICAgIC8vIGluaXRpYWxpemUgdGhlIFJOR1xuICAgICAgICBfaW5pdFN0YXRlKCBhcmdzICk7XG5cbiAgICAgICAgcmV0dXJuIHJhbmRvbTtcblxuICAgIH0pKCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICkgKTtcbn07XG5cbmV4cG9ydCBjbGFzcyBSTkcge1xuICAgIGNvbnN0cnVjdG9yKHJuZ1NldHRpbmdzKSB7XG4gICAgICAgIGlmIChybmdTZXR0aW5ncy5yYW5kKSB7XG4gICAgICAgICAgdGhpcy5yYW5kID0gcm5nU2V0dGluZ3MucmFuZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsZXQgc2VlZDtcbiAgICAgICAgICBpZiAocm5nU2V0dGluZ3Muc2VlZCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHNlZWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKS50b1N0cmluZygpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWVkID0gcm5nU2V0dGluZ3Muc2VlZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5yYW5kID0gYWxlYVBSTkcoc2VlZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRTZWVkKHNlZWQpIHtcbiAgICAgICAgdGhpcy5hbGVhLnNlZWQoc2VlZC50b1N0cmluZygpKTtcbiAgICB9XG5cbiAgICAvLyBTdGFuZGFyZCB1bmlmb3JtIGdlbmVyYXRvciB2YWx1ZXMgaW4gWzAsMSlcbiAgICByYW5kb20oKSB7XG4gICAgICAgIHJldHVybih0aGlzLnJhbmQoKSk7XG4gICAgfVxuXG4gICAgLy8gUmFuZG9tbHkgY2hvb3NlICsxIG9yIC0xLlxuICAgIHJhbmRTaWduKCkge1xuICAgICAgICB2YXIgYSA9IDIqTWF0aC5mbG9vcigyKnRoaXMucmFuZG9tKCkpLTE7XG4gICAgICAgIHJldHVybihhKTtcbiAgICB9XG5cbiAgICAvLyBSYW5kb21seSBjaG9vc2UgaW50ZWdlciB1bmlmb3JtbHkgaW4ge21pbiwgLi4uLCBtYXh9LlxuICAgIHJhbmRJbnQobWluLCBtYXgpIHtcbiAgICAgICAgdmFyIGEgPSBtaW4rTWF0aC5mbG9vciggKG1heC1taW4rMSkqdGhpcy5yYW5kb20oKSApO1xuICAgICAgICByZXR1cm4oYSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFJhbmRvbWx5IGNob29zZSBmbG9hdGluZyBwb2ludCB1bmlmb3JtbHkgaW4gW21pbixtYXgpXG4gICAgcmFuZFVuaWZvcm0obWluLCBtYXgpIHtcbiAgICAgICAgdmFyIGEgPSBtaW4rKG1heC1taW4pKnRoaXMucmFuZG9tKCk7XG4gICAgICAgIHJldHVybihhKTtcbiAgICB9XG5cbiAgICAvLyBSYW5kb21seSBjaG9vc2UgZmxvYXRpbmcgcG9pbnQgdW5pZm9ybWx5IGluIFttaW4sbWF4KVxuICAgIHJhbmREaXNjcmV0ZShtaW4sIG1heCwgYnksIG5vbnplcm8pIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzIHx8IGJ5ID09IDApIHtcbiAgICAgICAgICAgIGJ5ID0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDQpIHtcbiAgICAgICAgICAgIG5vbnplcm89ZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJuZFZhbDtcbiAgICAgICAgbGV0IE52YWxzID0gTWF0aC5mbG9vcigobWF4LW1pbikgLyBieSkrMTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgcm5kVmFsID0gbWluICsgYnkgKiB0aGlzLnJhbmRJbnQoMCxOdmFscy0xKTtcbiAgICAgICAgfSB3aGlsZSAobm9uemVybyAmJiBNYXRoLmFicyhybmRWYWwpIDwgMWUtMTYpO1xuICAgICAgICByZXR1cm4ocm5kVmFsKTtcbiAgICB9XG5cbiAgICAvLyBSYW5kb21seSBhIGstbGVuZ3RoIHBlcm11dGVkIHN1YnNlcXVlbmNlIG9mIHttaW4sIC4uLiwgbWF4fVxuICAgIHJhbmRDaG9pY2UobWluLCBtYXgsIGspIHtcbiAgICAgICAgdmFyIGEgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgdmFyIGIgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgdmFyIGksajtcbiAgICAgICAgZm9yIChpPTA7IGk8PW1heC1taW47IGkrKykge1xuICAgICAgICAgICAgYVtpXSA9IG1pbitpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaT0wOyBpPGs7IGkrKykge1xuICAgICAgICAgICAgaiA9IE1hdGguZmxvb3IoIChtYXgtbWluKzEtaSkqdGhpcy5yYW5kb20oKSApO1xuICAgICAgICAgICAgYltpXSA9IGEuc3BsaWNlKGosMSlbMF07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKGIpO1xuICAgIH1cblxuICAgIC8vIEdlbmVyYXRlIGEgcmFuZG9tIHJhdGlvbmFsIG51bWJlciwgcGFzc2luZyBpbiAyLWxlbiBhcnJheXMgZm9yIGxpbWl0cy5cbiAgICByYW5kUmF0aW9uYWwocExpbXMsIHFMaW1zKSB7XG4gICAgICAgIHZhciBwLCBxO1xuXG4gICAgICAgIC8vIEZpbmQgdGhlIHJhdyByYXRpb25hbCBudW1iZXJcbiAgICAgICAgcCA9IHRoaXMucmFuZEludChwTGltc1swXSwgcExpbXNbMV0pO1xuICAgICAgICBxID0gdGhpcy5yYW5kSW50KHFMaW1zWzBdLCBxTGltc1sxXSk7XG5cbiAgICAgICAgcmV0dXJuIChuZXcgcmF0aW9uYWxfbnVtYmVyKHAscSkpO1xuICAgIH1cblxuICAgIC8vIEdlbmVyYXRlIGEgcmFuZG9tIGhleCBjb2RlIG9mIGRlc2lyZWQgbGVuZ3RoLlxuICAgIHJhbmRIZXhIYXNoKG4pIHtcbiAgICAgIHZhciBoYXNoID0gJyc7XG4gICAgICB2YXIgY2hhcnMgPSAnMDEyMzQ1Njc4OWFiY2RlZic7XG4gICAgICBmb3IgKHZhciBpPTA7IGk8bjsgaSsrKSB7XG4gICAgICAgIGhhc2ggKz0gY2hhcnNbdGhpcy5yYW5kSW50KDAsMTUpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBoYXNoO1xuICAgIH1cbn0iLCIvKiFcbiAqIEJUTSBKYXZhU2NyaXB0IExpYnJhcnkgdkBWRVJTSU9OXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGJyaWFud2FsdG9uL0JUTVxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qKiBEZWZpbmUgYSBjbGFzcyB0byB3b3JrIHdpdGggcmF0aW9uYWwgbnVtYmVyc1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5pbXBvcnQgeyByZWFsX251bWJlciB9IGZyb20gXCIuL3JlYWxfbnVtYmVyLmpzXCI7XG5cbi8qIFByaXZhdGUgdXRpbGl0eSBjb21tYW5kcy4gKi9cbiAgXG5mdW5jdGlvbiBpc0ludCh4KSB7XG4gICAgdmFyIHJldFZhbHVlID0gZmFsc2U7XG4gICAgaWYgKE51bWJlci5pc0ludGVnZXIgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldFZhbHVlID0gKHggPT0gTWF0aC5mbG9vcih4KSk7XG4gICAgfSBlbHNlIHtcbiAgICByZXRWYWx1ZSA9IE51bWJlci5pc0ludGVnZXIoeCk7XG4gICAgfVxuICAgIHJldHVybiByZXRWYWx1ZTtcbn1cblxuXG4gLy8gSW1wbGVtZW50IEV1Y2xpZCdzIGFsZ29yaXRobS5cbiBleHBvcnQgZnVuY3Rpb24gZmluZEdDRChhLGIpIHtcbiAgICB2YXIgYztcbiAgICBhID0gTWF0aC5hYnMoYSk7XG4gICAgYiA9IE1hdGguYWJzKGIpO1xuICAgIGlmIChhIDwgYikge1xuICAgICAgICBjPWE7IGE9YjsgYj1jO1xuICAgIH1cblxuICAgIGlmIChiID09IDApXG4gICAgICAgIHJldHVybiAwO1xuXG4gICAgLy8gSW4gdGhpcyBsb29wLCB3ZSBhbHdheXMgaGF2ZSBhID4gYi5cbiAgICB3aGlsZSAoYiA+IDApIHtcbiAgICAgICAgYyA9IGEgJSBiO1xuICAgICAgICBhID0gYjtcbiAgICAgICAgYiA9IGM7XG4gICAgfVxuICAgIHJldHVybiBhO1xufVxuXG5leHBvcnQgY2xhc3MgcmF0aW9uYWxfbnVtYmVyIGV4dGVuZHMgcmVhbF9udW1iZXIge1xuICAgIGNvbnN0cnVjdG9yKHAscSkge1xuICAgICAgICBpZiAocSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHN1cGVyKHApO1xuICAgICAgICAgICAgdGhpcy5wID0gcDtcbiAgICAgICAgICAgIHRoaXMucSA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdXBlcihwL3EpO1xuICAgICAgICAgICAgaWYgKHEgPT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMucCA9IE1hdGguc3FydCgtMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5xID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLnEgPSAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocSA8IDApIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMucCA9IC1wO1xuICAgICAgICAgICAgICAgICAgdGhpcy5xID0gLXE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMucCA9IHA7XG4gICAgICAgICAgICAgICAgICB0aGlzLnEgPSBxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnNpbXBsaWZ5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYSBudW1lcmljYWwgdmFsdWUgb2YgdGhlIHJhdGlvbmFsIGV4cHJlc3Npb24uXG4gICAgdmFsdWUoKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5wL3RoaXMucSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFVzZSBFdWNsaWQncyBhbGdvcml0aG0gdG8gZmluZCB0aGUgZ2NkLCB0aGVuIHJlZHVjZVxuICAgIHNpbXBsaWZ5KCkge1xuICAgICAgICB2YXIgYTtcblxuICAgICAgICAvLyBEb24ndCBzaW1wbGlmeSBpZiBub3QgcmF0aW8gb2YgaW50ZWdlcnMuXG4gICAgICAgIGlmICh0aGlzLnAgJSAxICE9IDAgfHwgdGhpcy5xICUgMSAhPSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBhID0gZmluZEdDRCh0aGlzLnAsIHRoaXMucSk7XG4gICAgICAgIHRoaXMucCAvPSBhO1xuICAgICAgICB0aGlzLnEgLz0gYTtcbiAgICB9XG5cbiAgICBlcXVhbChvdGhlcikge1xuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiByYXRpb25hbF9udW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5wLnZhbHVlT2YoKT09b3RoZXIucC52YWx1ZU9mKClcbiAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5xLnZhbHVlT2YoKSA9PSBvdGhlci5xLnZhbHVlT2YoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMudmFsdWUoKT09b3RoZXIudmFsdWUoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBZGQgdG8gdGhpcyByYXRpb25hbCBhbm90aGVyIHJhdGlvbmFsIG51bWJlciBhbmQgY3JlYXRlIG5ldyBvYmplY3QuXG4gICAgYWRkKG90aGVyKSB7XG4gICAgICAgIHZhciBzdW07XG4gICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIHJhdGlvbmFsX251bWJlcikge1xuICAgICAgICBzdW0gPSBuZXcgcmF0aW9uYWxfbnVtYmVyKHRoaXMucCpvdGhlci5xK290aGVyLnAqdGhpcy5xLCB0aGlzLnEqb3RoZXIucSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNJbnQob3RoZXIpKSB7XG4gICAgICAgIHN1bSA9IG5ldyByYXRpb25hbF9udW1iZXIodGhpcy5wK290aGVyKnRoaXMucSwgdGhpcy5xKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3VtID0gbmV3IHJlYWxfbnVtYmVyKHRoaXMudmFsdWUoKSArIG90aGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4oc3VtKTtcbiAgICB9XG5cbiAgICAvLyBTdWJ0cmFjdCBmcm9tIHRoaXMgcmF0aW9uYWwgYW5vdGhlciByYXRpb25hbCBudW1iZXIgYW5kIGNyZWF0ZSBuZXcgb2JqZWN0LlxuICAgIHN1YnRyYWN0KG90aGVyKSB7XG4gICAgICAgIHZhciBzdW07XG4gICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIHJhdGlvbmFsX251bWJlcikge1xuICAgICAgICAgICAgc3VtID0gbmV3IHJhdGlvbmFsX251bWJlcih0aGlzLnAqb3RoZXIucS1vdGhlci5wKnRoaXMucSwgdGhpcy5xKm90aGVyLnEpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzSW50KG90aGVyKSkge1xuICAgICAgICAgICAgc3VtID0gbmV3IHJhdGlvbmFsX251bWJlcih0aGlzLnAtb3RoZXIqdGhpcy5xLCB0aGlzLnEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3VtID0gbmV3IHJlYWxfbnVtYmVyKHRoaXMudmFsdWUoKSAtIG90aGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4oc3VtKTtcbiAgICB9XG5cbiAgICAvLyBNdWx0aXBseSB0aGlzIHJhdGlvbmFsIGJ5IGFub3RoZXIgcmF0aW9uYWwgbnVtYmVyIGFuZCBjcmVhdGUgbmV3IG9iamVjdC5cbiAgICBtdWx0aXBseShvdGhlcikge1xuICAgICAgICB2YXIgcHJvZHVjdDtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgcmF0aW9uYWxfbnVtYmVyKSB7XG4gICAgICAgICAgICBwcm9kdWN0ID0gbmV3IHJhdGlvbmFsX251bWJlcih0aGlzLnAqb3RoZXIucCwgdGhpcy5xKm90aGVyLnEpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzSW50KG90aGVyKSkge1xuICAgICAgICAgICAgcHJvZHVjdCA9IG5ldyByYXRpb25hbF9udW1iZXIodGhpcy5wKm90aGVyLCB0aGlzLnEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvZHVjdCA9IG5ldyByZWFsX251bWJlcih0aGlzLnZhbHVlKCkgKiBvdGhlcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ocHJvZHVjdCk7XG4gICAgfVxuXG4gICAgLy8gRGl2aWRlIHRoaXMgcmF0aW9uYWwgYnkgYW5vdGhlciByYXRpb25hbCBudW1iZXIgYW5kIGNyZWF0ZSBuZXcgb2JqZWN0LlxuICAgIGRpdmlkZShvdGhlcikge1xuICAgICAgICB2YXIgcHJvZHVjdDtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgcmF0aW9uYWxfbnVtYmVyKSB7XG4gICAgICAgICAgICBwcm9kdWN0ID0gbmV3IHJhdGlvbmFsX251bWJlcih0aGlzLnAqb3RoZXIucSwgdGhpcy5xKm90aGVyLnApO1xuICAgICAgICB9IGVsc2UgaWYgKGlzSW50KG90aGVyKSkge1xuICAgICAgICAgICAgcHJvZHVjdCA9IG5ldyByYXRpb25hbF9udW1iZXIodGhpcy5wLCB0aGlzLnEqb3RoZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvZHVjdCA9IG5ldyByZWFsX251bWJlcih0aGlzLnZhbHVlKCkgLyBvdGhlcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ocHJvZHVjdCk7XG4gICAgfVxuXG4gICAgLy8gQWRkaXRpdmUgSW52ZXJzZVxuICAgIGFkZEludmVyc2UoKSB7XG4gICAgICAgIHZhciBpbnZlcnNlID0gbmV3IHJhdGlvbmFsX251bWJlcigtdGhpcy5wLCB0aGlzLnEpO1xuICAgICAgICByZXR1cm4oaW52ZXJzZSk7XG4gICAgfVxuXG4gICAgLy8gTXVsdGlwbGljYXRpdmUgSW52ZXJzZVxuICAgIG11bHRJbnZlcnNlKCkge1xuICAgICAgICB2YXIgaW52ZXJzZTtcbiAgICAgICAgaWYgKHRoaXMucCAhPSAwKSB7XG4gICAgICAgICAgICBpbnZlcnNlID0gbmV3IHJhdGlvbmFsX251bWJlcih0aGlzLnEsIHRoaXMucCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnZlcnNlID0gbmV3IHJlYWxfbnVtYmVyKE5hTik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKGludmVyc2UpO1xuICAgIH1cblxuICAgIC8vIEZvcm1hdCB0aGUgcmF0aW9uYWwgbnVtYmVyIGFzIHN0cmluZy5cbiAgICB0b1N0cmluZyhsZWFkU2lnbikge1xuICAgICAgICBpZiAodHlwZW9mIGxlYWRTaWduID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBsZWFkU2lnbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdHIgPSAobGVhZFNpZ24gJiYgdGhpcy5wPjApID8gJysnIDogJyc7XG4gICAgICAgIGlmIChpc05hTih0aGlzLnApKSB7XG4gICAgICAgICAgICBzdHIgPSAnTmFOJztcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnEgPT0gMSkge1xuICAgICAgICAgICAgc3RyID0gc3RyICsgdGhpcy5wO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RyID0gc3RyICsgdGhpcy5wICsgJy8nICsgdGhpcy5xO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKHN0cik7XG4gICAgfVxuXG4gICAgLy8gRm9ybWF0IHRoZSByYXRpb25hbCBudW1iZXIgYXMgVGVYIHN0cmluZy5cbiAgICB0b1RlWChsZWFkU2lnbikge1xuICAgICAgICBpZiAodHlwZW9mIGxlYWRTaWduID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBsZWFkU2lnbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdHIgPSAobGVhZFNpZ24gJiYgdGhpcy5wPjApID8gJysnIDogJyc7XG4gICAgICAgIGlmIChpc05hTih0aGlzLnApKSB7XG4gICAgICAgICAgICBzdHIgPSAnXFxcXG1hdGhybXtOYU59JztcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnEgPT0gMSkge1xuICAgICAgICAgICAgc3RyID0gc3RyICsgdGhpcy5wO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMucCA8IDApIHtcbiAgICAgICAgICAgICAgICBzdHIgPSAnLVxcXFxmcmFjeycgKyAtdGhpcy5wICsgJ317JyArIHRoaXMucSArICd9JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RyID0gc3RyICsgJ1xcXFxmcmFjeycgKyB0aGlzLnAgKyAnfXsnICsgdGhpcy5xICsgJ30nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKHN0cik7XG4gICAgfVxuXG4gICAgdG9NYXRoTUwoKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbGVhZFNpZ24gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGxlYWRTaWduID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG9wQVN0ciA9IFwiPGNuPlwiICsgdGhpcy5wICsgXCI8L2NuPlwiLFxuICAgICAgICAgICAgb3BCU3RyID0gXCI8Y24+XCIgKyB0aGlzLnEgKyBcIjwvY24+XCI7XG5cbiAgICAgICAgcmV0dXJuKFwiPGNuPlwiICsgdGhpcy50b1N0cmluZygpICsgXCI8L2NuPlwiKTtcblxuICAgICAgICBpZiAoaXNOYU4odGhpcy5wKSkge1xuICAgICAgICAgICAgc3RyID0gXCI8Y24+PzwvY24+XCI7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5xID09IDEpIHtcbiAgICAgICAgICAgIHN0ciA9IG9wQVN0cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0ciA9IFwiPGFwcGx5PjxkaXZpZGUvPlwiK29wQVN0citvcEJTdHIrXCI8L2FwcGx5PlwiO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuXG5cbiBcblxuXG5cbiIsIi8qIVxuICogQlRNIEphdmFTY3JpcHQgTGlicmFyeSB2QFZFUlNJT05cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kYnJpYW53YWx0b24vQlRNXG4gKlxuICogQ29weXJpZ2h0IEQuIEJyaWFuIFdhbHRvblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIChodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVClcbiAqXG4gKiBEYXRlOiBAREFURVxuICovXG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbioqIERlZmluZSBhIGdlbmVyaWMgY2xhc3MgdG8gd29yayBudW1iZXJzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmV4cG9ydCBjbGFzcyByZWFsX251bWJlciB7XG4gICAgY29uc3RydWN0b3IoYSkge1xuICAgICAgaWYgKHR5cGVvZiBhID09PSAnbnVtYmVyJyB8fCBhIGluc3RhbmNlb2YgTnVtYmVyKSB7XG4gICAgICAgIHRoaXMubnVtYmVyID0gYTtcbiAgICAgIH0gZWxzZSBpZiAoYSBpbnN0YW5jZW9mIHJlYWxfbnVtYmVyKSB7XG4gICAgICAgIHRoaXMubnVtYmVyID0gYS5udW1iZXI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGEgbnVtZXJpY2FsIHZhbHVlIG9mIHRoZSByYXRpb25hbCBleHByZXNzaW9uLlxuICAgIHZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5udW1iZXI7XG4gICAgfVxuICAgIFxuICAgIC8vIFJlYWwgbnVtYmVycyBoYXZlIG5vIG5hdHVyYWwgc2ltcGxpZmljYXRpb24sIGJ1dCBkZWNsYXJpbmcgdGhlIG1ldGhvZC5cbiAgICBzaW1wbGlmeSgpIHtcbiAgICB9XG5cbiAgICBlcXVhbChvdGhlcikge1xuICAgICAgaWYgKHR5cGVvZiBvdGhlciA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgb3RoZXIgPSBuZXcgcmVhbF9udW1iZXIob3RoZXIpO1xuICAgICAgfVxuICAgICAgICByZXR1cm4gKHRoaXMudmFsdWUoKT09b3RoZXIudmFsdWUoKSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIG51bWJlcnMuXG4gICAgYWRkKG90aGVyKSB7XG4gICAgICBpZiAodHlwZW9mIG90aGVyID09PSAnbnVtYmVyJykge1xuICAgICAgICBvdGhlciA9IG5ldyByZWFsX251bWJlcihvdGhlcik7XG4gICAgICB9XG4gICAgICAgIHZhciBzdW0gPSBuZXcgcmVhbF9udW1iZXIodGhpcy5udW1iZXIgKyBvdGhlci52YWx1ZSgpKTtcbiAgICAgICAgcmV0dXJuKHN1bSk7XG4gICAgfVxuXG4gICAgLy8gU3VidHJhY3QgdGhpcyAtIG90aGVyXG4gICAgc3VidHJhY3Qob3RoZXIpIHtcbiAgICAgIGlmICh0eXBlb2Ygb3RoZXIgPT09ICdudW1iZXInKSB7XG4gICAgICAgIG90aGVyID0gbmV3IHJlYWxfbnVtYmVyKG90aGVyKTtcbiAgICAgIH1cbiAgICAgICAgdmFyIHN1bSA9IG5ldyByZWFsX251bWJlcih0aGlzLm51bWJlciAtIG90aGVyLnZhbHVlKCkpO1xuICAgICAgICByZXR1cm4oc3VtKTtcbiAgICB9XG5cbiAgICAvLyBNdWx0aXBseSB0aGlzIHJhdGlvbmFsIGJ5IGFub3RoZXIgcmF0aW9uYWwgbnVtYmVyIGFuZCBjcmVhdGUgbmV3IG9iamVjdC5cbiAgICBtdWx0aXBseShvdGhlcikge1xuICAgICAgaWYgKHR5cGVvZiBvdGhlciA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgb3RoZXIgPSBuZXcgcmVhbF9udW1iZXIob3RoZXIpO1xuICAgICAgfVxuICAgICAgICB2YXIgcHJvZHVjdCA9IG5ldyByZWFsX251bWJlcih0aGlzLm51bWJlciAqIG90aGVyLnZhbHVlKCkpO1xuICAgICAgICByZXR1cm4ocHJvZHVjdCk7XG4gICAgfVxuXG4gICAgLy8gRGl2aWRlIHRoaXMgcmF0aW9uYWwgYnkgYW5vdGhlciByYXRpb25hbCBudW1iZXIgYW5kIGNyZWF0ZSBuZXcgb2JqZWN0LlxuICAgIGRpdmlkZShvdGhlcikge1xuICAgICAgaWYgKHR5cGVvZiBvdGhlciA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgb3RoZXIgPSBuZXcgcmVhbF9udW1iZXIob3RoZXIpO1xuICAgICAgfVxuICAgICAgICB2YXIgcHJvZHVjdDtcbiAgICAgICAgaWYgKG90aGVyLnZhbHVlICE9IDApIHtcbiAgICAgICAgICAgIHByb2R1Y3QgPSBuZXcgcmVhbF9udW1iZXIodGhpcy5udW1iZXIgLyBvdGhlci52YWx1ZSgpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb2R1Y3QgPSBuZXcgcmVhbF9udW1iZXIoTmFOKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ocHJvZHVjdCk7XG4gICAgfVxuXG4gICAgLy8gQWRkaXRpdmUgSW52ZXJzZVxuICAgIGFkZEludmVyc2UoKSB7XG4gICAgICAgIHZhciBpbnZlcnNlID0gbmV3IHJlYWxfbnVtYmVyKC10aGlzLm51bWJlcik7XG4gICAgICAgIHJldHVybihpbnZlcnNlKTtcbiAgICB9XG5cbiAgICAvLyBNdWx0aXBsaWNhdGl2ZSBJbnZlcnNlXG4gICAgbXVsdEludmVyc2UoKSB7XG4gICAgICAgIHZhciBpbnZlcnNlO1xuICAgICAgICBpZiAodGhpcy5udW1iZXIgIT0gMCkge1xuICAgICAgICAgICAgaW52ZXJzZSA9IG5ldyByZWFsX251bWJlcih0aGlzLm51bWJlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnZlcnNlID0gbmV3IHJlYWxfbnVtYmVyKE5hTik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKGludmVyc2UpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKGxlYWRTaWduKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbGVhZFNpZ24gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGxlYWRTaWduID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0ciA9IChsZWFkU2lnbiAmJiB0aGlzLm51bWJlcj4wKSA/ICcrJyA6ICcnO1xuICAgICAgICBpZiAoaXNOYU4odGhpcy5udW1iZXIpKSB7XG4gICAgICAgICAgICBzdHIgPSAnTmFOJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ciArIE51bWJlcih0aGlzLm51bWJlci50b0ZpeGVkKDEwKSk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIHJldHVybihzdHIpO1xuICAgIH1cbiAgXG4gICAgLy8gRm9ybWF0IHRoZSByYXRpb25hbCBudW1iZXIgYXMgVGVYIHN0cmluZy5cbiAgICB0b1RlWChsZWFkU2lnbikge1xuICAgICAgICBpZiAodHlwZW9mIGxlYWRTaWduID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBsZWFkU2lnbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdHIgPSAobGVhZFNpZ24gJiYgdGhpcy5udW1iZXI+MCkgPyAnKycgOiAnJztcbiAgICAgICAgaWYgKGlzTmFOKHRoaXMubnVtYmVyKSkge1xuICAgICAgICAgICAgc3RyID0gJ1xcXFxtYXRocm17TmFOfSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHIgPSBzdHIgKyBOdW1iZXIodGhpcy50b1N0cmluZyhsZWFkU2lnbikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihzdHIpO1xuICAgIH1cblxuICAgIC8vIEZvcm1hdCBhcyBhIHJvb3QgTWF0aE1MIGVsZW1lbnQuXG4gICAgdG9NYXRoTUwobGVhZFNpZ24pIHtcbiAgICAgICAgcmV0dXJuKFwiPGNuPlwiICsgdGhpcy50b1N0cmluZygpICsgXCI8L2NuPlwiKTtcbiAgICB9XG59XG5cblxuXG5cblxuIFxuXG5cblxuIiwiLyohXG4gKiBtZW52IEphdmFTY3JpcHQgTGlicmFyeSB2QFZFUlNJT05cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kYnJpYW53YWx0b24vbWVudlxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbioqICBEZWFsaW5nIHdpdGggaWRlbnRpdGllcyBhbmQgcmVkdWN0aW9ucy5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5pbXBvcnQge01FTlYsIGV4cHJUeXBlLCBleHByVmFsdWUgfSBmcm9tIFwiLi9CVE1fcm9vdC5qc1wiO1xuXG5jbGFzcyBJZGVudGl0eSB7XG4gICAgY29uc3RydWN0b3IocmVmRXhwciwgZXFFeHByLCBkZXNjcmlwdGlvbiwgaXNWYWxpZCwgaWROdW0pIHtcbiAgICAgICAgdGhpcy5yZWZFeHByID0gcmVmRXhwcjtcbiAgICAgICAgdGhpcy5lcUV4cHIgPSBlcUV4cHI7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICAgICAgdGhpcy5pc1ZhbGlkID0gaXNWYWxpZDtcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuaWROdW0gPSBpZE51bTtcbiAgICB9XG59XG5cbmNsYXNzIE1hdGNoIHtcbiAgICBjb25zdHJ1Y3Rvcih0ZXN0UnVsZSwgYmluZGluZ3MpIHtcbiAgICAgICAgLy8gRmluZCB1bmJvdW5kIHZhcmlhYmxlcy5cbiAgICAgICAgdmFyIGFsbFZhcnMgPSB0ZXN0UnVsZS5lcUV4cHIuZGVwZW5kZW5jaWVzKCksXG4gICAgICAgICAgICBtaXNzVmFycyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBqIGluIGFsbFZhcnMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYmluZGluZ3NbYWxsVmFyc1tqXV0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBtaXNzVmFycy5wdXNoKGFsbFZhcnNbal0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGogaW4gbWlzc1ZhcnMpIHtcbiAgICAgICAgICAgIGJpbmRpbmdzW21pc3NWYXJzW2pdXSA9IFwiaW5wdXRcIisoK2orMSkrXCJcIjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3Vic3RFeHByID0gdGVzdFJ1bGUuZXFFeHByLmNvbXBvc2UoYmluZGluZ3MpO1xuXG4gICAgICAgIHRoaXMuc3ViVGVYID0gc3Vic3RFeHByLnRvVGVYKCk7XG4gICAgICAgIHRoaXMuc3ViU3RyID0gc3Vic3RFeHByLnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IHRlc3RSdWxlLmRlc2NyaXB0aW9uO1xuICAgICAgICBpZiAoc3Vic3RFeHByLnR5cGUgPT0gZXhwclR5cGUuYmlub3AgJiYgc3Vic3RFeHByLnZhbHVlVHlwZSA9PSBleHByVmFsdWUuYm9vbCkge1xuICAgICAgICAgICAgdGhpcy5lcXVhdGlvbiA9IHRlc3RSdWxlLnJlZkV4cHIudG9UZVgoKSArIFwiIFxcXFxpZmYgXCIgKyB0ZXN0UnVsZS5lcUV4cHIudG9UZVgoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZXF1YXRpb24gPSB0ZXN0UnVsZS5yZWZFeHByLnRvVGVYKCkgKyBcIj1cIiArIHRlc3RSdWxlLmVxRXhwci50b1RlWCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSBiaW5kaW5ncztcbiAgICAgICAgdGhpcy5udW1JbnB1dHMgPSBtaXNzVmFycy5sZW5ndGg7XG4gICAgICAgIHRoaXMucnVsZUlEID0gdGVzdFJ1bGUuaWROdW07XG4gICAgfVxufVxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIG5ld1J1bGUobWVudiwgcmVkdWN0aW9uTGlzdCwgZXF1YXRpb24sIGRlc2NyaXB0aW9uLCBpc1ZhbGlkLCB1c2VPbmVXYXksIGNvbnN0cmFpbnRzKSB7XG4gICAgdmFyIGV4cHJGb3JtdWxhcyA9IGVxdWF0aW9uLnNwbGl0KCc9PScpO1xuICAgIGlmIChleHByRm9ybXVsYXMubGVuZ3RoICE9IDIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJJbnZhbGlkIGVxdWF0aW9uIGluIGlkZW50aXR5IGxpc3Q6IFwiICsgZXF1YXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIHJlZklEPTA7IHJlZklEIDw9IDE7IHJlZklEKyspIHtcbiAgICAgICAgICAgIGlmIChyZWZJRCA9PSAxICYmIHR5cGVvZiB1c2VPbmVXYXkgIT0gJ3VuZGVmaW5lZCcgJiYgdXNlT25lV2F5KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaWRlbnRpdHk7XG5cbiAgICAgICAgICAgIHZhciByZWZFeHByID0gbWVudi5wYXJzZShleHByRm9ybXVsYXNbcmVmSURdLFwiZm9ybXVsYVwiKTtcbiAgICAgICAgICAgIHZhciBlcUV4cHIgPSBtZW52LnBhcnNlKGV4cHJGb3JtdWxhc1sxLXJlZklEXSxcImZvcm11bGFcIik7XG4gICAgICAgICAgICB2YXIgbnVtVmFycyA9IHJlZkV4cHIuZGVwZW5kZW5jaWVzKCkubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIGFsbFJlZkV4cHIgPSBbZXhwckZvcm11bGFzW3JlZklEXV07XG4gICAgICAgICAgICAvLyB0aGlzIGlzIGEgYmlnIHNsb3cgZG93biwgc28ganVzdCBtYWtlIHN1cmUgZWFjaCBydWxlIGlzIHdyaXR0ZW4gaW4gbXVsdGlwbGUgd2F5cy5cbiAgICAgICAgICAgIC8vICAgICAgdmFyIGFsbFJlZkV4cHIgPSByZWZFeHByLmFsbFN0cmluZ0VxdWl2cygpO1xuXG4gICAgICAgICAgICB2YXIgdW5pcXVlRXhwciA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBhbGxSZWZFeHByKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRFeHByID0gbWVudi5wYXJzZShhbGxSZWZFeHByW2ldLFwiZm9ybXVsYVwiKTtcbiAgICAgICAgICAgICAgICB2YXIgaXNOZXcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gdW5pcXVlRXhwcikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmluZGluZ3MgPSB1bmlxdWVFeHByW2pdLm1hdGNoKG5leHRFeHByLCB7fSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiaW5kaW5ncyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNOZXcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaXNOZXcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJ1bGVJRCA9IHJlZHVjdGlvbkxpc3QubGVuZ3RoKzE7XG4gICAgICAgICAgICAgICAgICAgIGlkZW50aXR5ID0gbmV3IElkZW50aXR5KG5leHRFeHByLCBlcUV4cHIsIGRlc2NyaXB0aW9uLCBpc1ZhbGlkLCBydWxlSUQpO1xuICAgICAgICAgICAgICAgICAgICByZWR1Y3Rpb25MaXN0LnB1c2goaWRlbnRpdHkpO1xuICAgICAgICAgICAgICAgICAgICB1bmlxdWVFeHByLnB1c2gobmV4dEV4cHIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gRGlzYWJsZSBhIHJ1bGUgaW4gdGhlIGxpc3QuXG5leHBvcnQgZnVuY3Rpb24gZGlzYWJsZVJ1bGUobWVudiwgcmVkdWN0aW9uTGlzdCwgZXF1YXRpb24pIHtcbiAgLy8gTWF0Y2ggb25seSBvbiByZWZFeHByLlxuICB2YXIgZXhwckZvcm11bGFzID0gZXF1YXRpb24uc3BsaXQoJz09Jyk7XG4gIHZhciByZWZFeHByLCBlcUV4cHI7XG4gIGlmIChleHByRm9ybXVsYXMubGVuZ3RoID4gMikge1xuICAgIGNvbnNvbGUubG9nKFwiSW52YWxpZCBlcXVhdGlvbiBpbiBpZGVudGl0eSBsaXN0OiBcIiArIGVxdWF0aW9uKTtcbiAgICByZXR1cm47XG4gIH0gZWxzZSB7XG4gICAgcmVmRXhwciA9IG1lbnYucGFyc2UoZXhwckZvcm11bGFzWzBdLFwiZm9ybXVsYVwiKTtcbiAgfVxuICBmb3IgKHZhciBpIGluIHJlZHVjdGlvbkxpc3QpIHtcbiAgICB2YXIgdGVzdFJ1bGUgPSByZWR1Y3Rpb25MaXN0W2ldO1xuICAgIHZhciBiaW5kaW5ncyA9IHRlc3RSdWxlLnJlZkV4cHIubWF0Y2gocmVmRXhwciwge30pXG4gICAgaWYgKGJpbmRpbmdzICE9PSBudWxsKSB7XG4gICAgICByZWR1Y3Rpb25MaXN0W2ldLmlzQWN0aXZlID0gZmFsc2U7XG4gICAgfVxufVxufVxuXG4vKiAqKioqKioqKioqKioqKioqKioqXG4qKiBHaXZlbiBhIGxpc3Qgb2YgcmVkdWN0aW9uIHJ1bGVzIGFuZCBhIGdpdmVuIGV4cHJlc3Npb24sXG4qKiB0ZXN0IGVhY2ggcmVkdWN0aW9uIHJ1bGUgdG8gc2VlIGlmIGl0IG1hdGNoZXMgdGhlIHN0cnVjdHVyZS5cbioqIENyZWF0ZSBhbiBhcnJheSBvZiBuZXcgb2JqZWN0cyB3aXRoIGJpbmRpbmdzIHN0YXRpbmcgd2hhdFxuKiogc3Vic3RpdHV0aW9ucyBhcmUgbmVjZXNzYXJ5IHRvIG1ha2UgdGhlIG1hdGNoZXMuXG4qKioqKioqKioqKioqKioqKioqICovXG5leHBvcnQgZnVuY3Rpb24gZmluZE1hdGNoUnVsZXMocmVkdWN0aW9uTGlzdCwgdGVzdEV4cHIsIGRvVmFsaWRhdGUpIHtcbiAgICB2YXIgbWF0Y2hMaXN0ID0gW107XG4gICAgdmFyIGksIHRlc3RSdWxlO1xuICAgIGZvciAoaSBpbiByZWR1Y3Rpb25MaXN0KSB7XG4gICAgICAgIHRlc3RSdWxlID0gcmVkdWN0aW9uTGlzdFtpXTtcbiAgICAgICAgdmFyIGJpbmRpbmdzID0gdGVzdFJ1bGUucmVmRXhwci5tYXRjaCh0ZXN0RXhwciwge30pXG4gICAgICAgIGlmICh0ZXN0UnVsZS5pc0FjdGl2ZSAmJiBiaW5kaW5ncyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIG1hdGNoID0gbmV3IE1hdGNoKHRlc3RSdWxlLCBiaW5kaW5ncyk7XG4gICAgICAgICAgICBtYXRjaExpc3QucHVzaChtYXRjaCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuKG1hdGNoTGlzdCk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRSZWR1Y3Rpb25zKG1lbnYpIHtcbiAgICB2YXIgcmVkdWNlUnVsZXMgPSBuZXcgQXJyYXkoKTtcblxuICAgIG5ld1J1bGUobWVudiwgcmVkdWNlUnVsZXMsICcwK3g9PXgnLCAnQWRkaXRpdmUgSWRlbnRpdHknLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKG1lbnYsIHJlZHVjZVJ1bGVzLCAneCswPT14JywgJ0FkZGl0aXZlIElkZW50aXR5JywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShtZW52LCByZWR1Y2VSdWxlcywgJzAteD09LXgnLCAnQWRkaXRpdmUgSW52ZXJzZScsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgcmVkdWNlUnVsZXMsICd4LTA9PXgnLCAnQWRkaXRpdmUgSWRlbnRpdHknLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKG1lbnYsIHJlZHVjZVJ1bGVzLCAnMCp4PT0wJywgJ011bHRpcGx5IGJ5IFplcm8nLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKG1lbnYsIHJlZHVjZVJ1bGVzLCAneCowPT0wJywgJ011bHRpcGx5IGJ5IFplcm8nLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKG1lbnYsIHJlZHVjZVJ1bGVzLCAnMSp4PT14JywgJ011bHRpcGxpY2F0aXZlIElkZW50aXR5JywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShtZW52LCByZWR1Y2VSdWxlcywgJ3gqMT09eCcsICdNdWx0aXBsaWNhdGl2ZSBJZGVudGl0eScsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgcmVkdWNlUnVsZXMsICcwL3g9PTAnLCAnTXVsdGlwbHkgYnkgWmVybycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgcmVkdWNlUnVsZXMsICd4LzE9PXgnLCAnRGl2aWRlIGJ5IE9uZScsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgcmVkdWNlUnVsZXMsICd4XjE9PXgnLCAnRmlyc3QgUG93ZXInLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKG1lbnYsIHJlZHVjZVJ1bGVzLCAneF4wPT0xJywgJ1plcm8gUG93ZXInLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKG1lbnYsIHJlZHVjZVJ1bGVzLCAneF4oLWEpPT0xLyh4XmEpJywgJ05lZ2F0aXZlIFBvd2VyJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShtZW52LCByZWR1Y2VSdWxlcywgJzFeeD09MScsICdPbmUgdG8gYSBQb3dlcicsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgcmVkdWNlUnVsZXMsICctMSp4PT0teCcsICdNdWx0aXBsaWNhdGl2ZSBJZGVudGl0eScsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgcmVkdWNlUnVsZXMsICd4Ki0xPT0teCcsICdNdWx0aXBsaWNhdGl2ZSBJZGVudGl0eScsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgcmVkdWNlUnVsZXMsICd4LXg9PTAnLCAnQWRkaXRpdmUgSW52ZXJzZXMgQ2FuY2VsJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShtZW52LCByZWR1Y2VSdWxlcywgJ3grLXg9PTAnLCAnQWRkaXRpdmUgSW52ZXJzZXMgQ2FuY2VsJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShtZW52LCByZWR1Y2VSdWxlcywgJy14K3g9PTAnLCAnQWRkaXRpdmUgSW52ZXJzZXMgQ2FuY2VsJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShtZW52LCByZWR1Y2VSdWxlcywgJygteCkreT09eS14JywgXCJTd2FwIExlYWRpbmcgTmVnYXRpdmVcIiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShtZW52LCByZWR1Y2VSdWxlcywgJ3grKC15KT09eC15JywgXCJTdWJ0cmFjdGlvblwiLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKG1lbnYsIHJlZHVjZVJ1bGVzLCAnKC14KSsoLXkpPT0tKHgreSknLCBcIkZhY3RvciBOZWdhdGlvbiBmcm9tIEFkZGl0aW9uXCIsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgcmVkdWNlUnVsZXMsICcoLXgpLXk9PS0oeCt5KScsIFwiRmFjdG9yIE5lZ2F0aW9uIGZyb20gQWRkaXRpb25cIiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShtZW52LCByZWR1Y2VSdWxlcywgJ3gtKC15KT09eCt5JywgXCJBZGRpdGl2ZSBJbnZlcnNlJ3MgSW52ZXJzZVwiLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKG1lbnYsIHJlZHVjZVJ1bGVzLCAnKC14KSp5PT0tKHgqeSknLCBcIkZhY3RvciBOZWdhdGlvbiBmcm9tIE11bHRpcGxpY2F0aW9uXCIsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgcmVkdWNlUnVsZXMsICd4KigteSk9PS0oeCp5KScsIFwiRmFjdG9yIE5lZ2F0aW9uIGZyb20gTXVsdGlwbGljYXRpb25cIiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShtZW52LCByZWR1Y2VSdWxlcywgJygteCkveT09LSh4L3kpJywgXCJGYWN0b3IgTmVnYXRpb24gZnJvbSBNdWx0aXBsaWNhdGlvblwiLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKG1lbnYsIHJlZHVjZVJ1bGVzLCAneC8oLXkpPT0tKHgveSknLCBcIkZhY3RvciBOZWdhdGlvbiBmcm9tIE11bHRpcGxpY2F0aW9uXCIsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgcmVkdWNlUnVsZXMsICctKC14KT09eCcsIFwiQWRkaXRpdmUgSW52ZXJzZSdzIEludmVyc2VcIiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShtZW52LCByZWR1Y2VSdWxlcywgJy8oL3gpPT14JywgXCJNdWx0aXBsaWNhdGl2ZSBJbnZlcnNlJ3MgSW52ZXJzZVwiLCB0cnVlLCB0cnVlKTtcblxuICAgIHJldHVybihyZWR1Y2VSdWxlcyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0U3VtUmVkdWN0aW9ucyhtZW52KSB7XG4gICAgdmFyIHN1bVJlZHVjdGlvbnMgPSBuZXcgQXJyYXkoKTtcblxuICAgIG5ld1J1bGUobWVudiwgc3VtUmVkdWN0aW9ucywgJ2ErMD09YScsICdTaW1wbGlmeSBBZGRpdGlvbiBieSBaZXJvJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShtZW52LCBzdW1SZWR1Y3Rpb25zLCAnMCthPT1hJywgJ1NpbXBsaWZ5IEFkZGl0aW9uIGJ5IFplcm8nLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKG1lbnYsIHN1bVJlZHVjdGlvbnMsICdhLWE9PTAnLCAnQ2FuY2VsIEFkZGl0aXZlIEludmVyc2VzJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShtZW52LCBzdW1SZWR1Y3Rpb25zLCAnYSstYT09MCcsICdDYW5jZWwgQWRkaXRpdmUgSW52ZXJzZXMnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKG1lbnYsIHN1bVJlZHVjdGlvbnMsICctYSthPT0wJywgJ0NhbmNlbCBBZGRpdGl2ZSBJbnZlcnNlcycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgc3VtUmVkdWN0aW9ucywgJ2EqYistYSpiPT0wJywgJ0NhbmNlbCBBZGRpdGl2ZSBJbnZlcnNlcycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgc3VtUmVkdWN0aW9ucywgJy1hKmIrYSpiPT0wJywgJ0NhbmNlbCBBZGRpdGl2ZSBJbnZlcnNlcycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgc3VtUmVkdWN0aW9ucywgJ2EqKGIrYyk9PWEqYithKmMnLCAnRXhwYW5kIFByb2R1Y3RzIGJ5IERpc3RyaWJ1dGluZycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgc3VtUmVkdWN0aW9ucywgJyhhK2IpKmM9PWEqYytiKmMnLCAnRXhwYW5kIFByb2R1Y3RzIGJ5IERpc3RyaWJ1dGluZycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgc3VtUmVkdWN0aW9ucywgJ2EqKGItYyk9PWEqYi1hKmMnLCAnRXhwYW5kIFByb2R1Y3RzIGJ5IERpc3RyaWJ1dGluZycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgc3VtUmVkdWN0aW9ucywgJyhhLWIpKmM9PWEqYy1iKmMnLCAnRXhwYW5kIFByb2R1Y3RzIGJ5IERpc3RyaWJ1dGluZycsIHRydWUsIHRydWUpO1xuXG4gICAgcmV0dXJuKHN1bVJlZHVjdGlvbnMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdFByb2R1Y3RSZWR1Y3Rpb25zKG1lbnYpIHtcbiAgICB2YXIgcHJvZHVjdFJlZHVjdGlvbnMgPSBuZXcgQXJyYXkoKTtcblxuICAgIG5ld1J1bGUobWVudiwgcHJvZHVjdFJlZHVjdGlvbnMsICcwKmE9PTAnLCAnU2ltcGxpZnkgTXVsdGlwbGljYXRpb24gYnkgWmVybycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgcHJvZHVjdFJlZHVjdGlvbnMsICdhKjA9PTAnLCAnU2ltcGxpZnkgTXVsdGlwbGljYXRpb24gYnkgWmVybycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgcHJvZHVjdFJlZHVjdGlvbnMsICcxKmE9PWEnLCAnU2ltcGxpZnkgTXVsdGlwbGljYXRpb24gYnkgT25lJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShtZW52LCBwcm9kdWN0UmVkdWN0aW9ucywgJ2EqMT09YScsICdTaW1wbGlmeSBNdWx0aXBsaWNhdGlvbiBieSBPbmUnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKG1lbnYsIHByb2R1Y3RSZWR1Y3Rpb25zLCAnYS9hPT0xJywgJ0NhbmNlbCBNdWx0aXBsaWNhdGl2ZSBJbnZlcnNlcycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgcHJvZHVjdFJlZHVjdGlvbnMsICdhKi9hPT0xJywgJ0NhbmNlbCBNdWx0aXBsaWNhdGl2ZSBJbnZlcnNlcycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgcHJvZHVjdFJlZHVjdGlvbnMsICcvYSphPT0xJywgJ0NhbmNlbCBNdWx0aXBsaWNhdGl2ZSBJbnZlcnNlcycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgcHJvZHVjdFJlZHVjdGlvbnMsICcoYSpiKS8oYSpjKT09Yi9jJywgJ0NhbmNlbCBDb21tb24gRmFjdG9ycycsIHRydWUsdHJ1ZSk7XG4gICAgbmV3UnVsZShtZW52LCBwcm9kdWN0UmVkdWN0aW9ucywgJ2FebS9hXm49PWFeKG0tbiknLCAnQ2FuY2VsIENvbW1vbiBGYWN0b3JzJywgdHJ1ZSx0cnVlKTtcbiAgICBuZXdSdWxlKG1lbnYsIHByb2R1Y3RSZWR1Y3Rpb25zLCAnKGFebSpiKS8oYV5uKmMpPT0oYV4obS1uKSpiKS9jJywgJ0NhbmNlbCBDb21tb24gRmFjdG9ycycsIHRydWUsdHJ1ZSk7XG4gICAgbmV3UnVsZShtZW52LCBwcm9kdWN0UmVkdWN0aW9ucywgJ2EqYT09YV4yJywgJ1dyaXRlIFByb2R1Y3RzIG9mIENvbW1vbiBUZXJtcyBhcyBQb3dlcnMnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKG1lbnYsIHByb2R1Y3RSZWR1Y3Rpb25zLCAnYSphXm49PWFeKG4rMSknLCAnV3JpdGUgUHJvZHVjdHMgb2YgQ29tbW9uIFRlcm1zIGFzIFBvd2VycycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgcHJvZHVjdFJlZHVjdGlvbnMsICdhXm4qYT09YV4obisxKScsICdXcml0ZSBQcm9kdWN0cyBvZiBDb21tb24gVGVybXMgYXMgUG93ZXJzJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShtZW52LCBwcm9kdWN0UmVkdWN0aW9ucywgJ2FebSphXm49PWFeKG0rbiknLCAnV3JpdGUgUHJvZHVjdHMgb2YgQ29tbW9uIFRlcm1zIGFzIFBvd2VycycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgcHJvZHVjdFJlZHVjdGlvbnMsICcoYV4tbSpiKS9jPT1iLyhhXm0qYyknLCAnUmV3cml0ZSBVc2luZyBQb3NpdGl2ZSBQb3dlcnMnLCB0cnVlLHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgcHJvZHVjdFJlZHVjdGlvbnMsICcoYiphXi1tKS9jPT1iLyhhXm0qYyknLCAnUmV3cml0ZSBVc2luZyBQb3NpdGl2ZSBQb3dlcnMnLCB0cnVlLHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgcHJvZHVjdFJlZHVjdGlvbnMsICdiLyhhXi1tKmMpPT0oYV5tKmIpL2MnLCAnUmV3cml0ZSBVc2luZyBQb3NpdGl2ZSBQb3dlcnMnLCB0cnVlLHRydWUpO1xuICAgIG5ld1J1bGUobWVudiwgcHJvZHVjdFJlZHVjdGlvbnMsICdiLyhjKmFeLW0pPT0oYV5tKmIpL2MnLCAnUmV3cml0ZSBVc2luZyBQb3NpdGl2ZSBQb3dlcnMnLCB0cnVlLHRydWUpO1xuXG4gICAgcmV0dXJuIChwcm9kdWN0UmVkdWN0aW9ucyk7XG4gIH0iLCIvKiFcbiAqIEJUTSBKYXZhU2NyaXB0IExpYnJhcnkgdkBWRVJTSU9OXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGJyaWFud2FsdG9uL0JUTVxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogRGVmaW5lIHRoZSBTY2FsYXIgRXhwcmVzc2lvbiAtLSBhIG51bWVyaWNhbCB2YWx1ZVxuKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuaW1wb3J0IHsgZXhwcmVzc2lvbiB9IGZyb20gXCIuL2V4cHJlc3Npb24uanNcIlxuaW1wb3J0IHsgcmVhbF9udW1iZXIgfSBmcm9tIFwiLi9yZWFsX251bWJlci5qc1wiXG5pbXBvcnQgeyByYXRpb25hbF9udW1iZXIgfSBmcm9tIFwiLi9yYXRpb25hbF9udW1iZXIuanNcIlxuaW1wb3J0IHsgZXhwclR5cGUgfSBmcm9tIFwiLi9CVE1fcm9vdC5qc1wiXG5cbmV4cG9ydCBjbGFzcyBzY2FsYXJfZXhwciBleHRlbmRzIGV4cHJlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKG1lbnYsIG51bWJlcikge1xuICAgICAgICBzdXBlcihtZW52KTtcbiAgICAgICAgdGhpcy50eXBlID0gZXhwclR5cGUubnVtYmVyO1xuICAgICAgICBpZiAodHlwZW9mIG51bWJlciA9PT0gXCJudW1iZXJcIiB8fFxuICAgICAgICAgICAgICAgIG51bWJlciBpbnN0YW5jZW9mIE51bWJlcikge1xuICAgICAgICAgICAgaWYgKE1hdGguZmxvb3IobnVtYmVyKT09bnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5udW1iZXIgPSBuZXcgcmF0aW9uYWxfbnVtYmVyKG51bWJlciwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubnVtYmVyID0gbmV3IHJlYWxfbnVtYmVyKG51bWJlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobnVtYmVyIGluc3RhbmNlb2YgcmVhbF9udW1iZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm51bWJlciA9IG51bWJlcjtcbiAgICAgICAgfSBlbHNlIGlmIChudW1iZXIgaW5zdGFuY2VvZiBzY2FsYXJfZXhwcikge1xuICAgICAgICAgICAgdGhpcy5udW1iZXIgPSBudW1iZXIubnVtYmVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUcnlpbmcgdG8gaW5zdGFudGlhdGUgYSBzY2FsYXJfZXhwciB3aXRoIGEgbm9uLW51bWJlciBvYmplY3Q6IFwiICsgbnVtYmVyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbnRleHQgPSBcIm51bWJlclwiO1xuICAgIH1cblxuICAgIC8vIFBhcnNlZCByZXByZXNlbnRhdGlvbi5cbiAgICB0b1N0cmluZyhlbGVtZW50T25seSkge1xuICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnRPbmx5ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBlbGVtZW50T25seSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybih0aGlzLm51bWJlci50b1N0cmluZygpKTtcbiAgICB9XG4gICAgXG4gICAgLy8gRGlzcGxheSByZXByZXNlbnRhdGlvbi5cbiAgICB0b1RlWChzaG93U2VsZWN0KSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2hvd1NlbGVjdCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgc2hvd1NlbGVjdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciB3b3JkID0gdGhpcy5udW1iZXIudG9UZVgoKTtcbiAgICAgICAgaWYgKHNob3dTZWxlY3QgJiYgdGhpcy5zZWxlY3QpIHtcbiAgICAgICAgICAgIHdvcmQgPSBcIntcXFxcY29sb3J7cmVkfVwiICsgd29yZCArIFwifVwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybih3b3JkKTtcbiAgICB9XG4gICAgXG4gICAgLy8gTWF0aE1MIHJlcHJlc2VudGF0aW9uLlxuICAgIHRvTWF0aE1MKCkge1xuICAgICAgICByZXR1cm4oXCI8Y24+XCIgKyB0aGlzLnRvU3RyaW5nKCkgKyBcIjwvY24+XCIpO1xuICAgIH1cbiAgICBcbiAgICAvLyBSZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgdGVzdGVkIGVxdWl2YWxlbnQgc3RyaW5ncy5cbiAgICBhbGxTdHJpbmdFcXVpdnMoKSB7XG4gICAgICAgIHJldHVybihbdGhpcy50b1N0cmluZygpXSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFRlc3QgaWYgcmVwcmVzZW50cyBjb25zdGFudCB2YWx1ZS5cbiAgICBpc0NvbnN0YW50KCkge1xuICAgICAgICAvKlxuICAgICAgICBUaGlzIGNvdWxkIGp1c3QgdXNlIGV4cHJlc3Npb24ucHJvdG90eXBlLmNvbnN0YW50LCBidXQgdXNlIHRoaXNcbiAgICAgICAgYmVjYXVzZSBpdCBBTFdBWVMgaXMgdHJ1ZSBmb3Igc2NhbGFyX2V4cHIgYW5kIGRvZXMgbm90IG5lZWQgYSBjaGVja1xuICAgICAgICAqL1xuICAgICAgICByZXR1cm4odHJ1ZSk7XG4gICAgfVxuICAgIFxuICAgIC8vIENvbWJpbmUgY29uc3RhbnRzIHdoZXJlIHBvc3NpYmxlXG4gICAgc2ltcGxpZnlDb25zdGFudHMoKSB7XG4gICAgICAgIHZhciByZXRWYWx1ZTtcbiAgICAgICAgaWYgKCF0aGlzLm1lbnYub3B0aW9ucy5uZWdhdGl2ZU51bWJlcnMgJiYgdGhpcy5udW1iZXIucCA8IDApIHtcbiAgICAgICAgICAgIHZhciB0aGVOdW1iZXIgPSB0aGlzLm51bWJlci5tdWx0aXBseSgtMSk7XG4gICAgICAgICAgICByZXRWYWx1ZSA9IG5ldyB1bm9wX2V4cHIodGhpcy5tZW52LCAnLScsIG5ldyBzY2FsYXJfZXhwcih0aGlzLm1lbnYsIHRoZU51bWJlcikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0VmFsdWUgPSB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxuICAgIFxuICAgIHZhbHVlKCkge1xuICAgICAgICByZXR1cm4odGhpcy5udW1iZXIudmFsdWUoKSk7XG4gICAgfVxuXG4gICAgZXZhbHVhdGUoYmluZGluZ3MpIHtcbiAgICAgICAgcmV0dXJuKHRoaXMudmFsdWUoKSk7XG4gICAgfVxuICAgIFxuICAgIGNvcHkoKSB7XG4gICAgICAgIHJldHVybihuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCB0aGlzLm51bWJlcikpO1xuICAgIH1cbiAgICBcbiAgICBjb21wb3NlKGJpbmRpbmdzKSB7XG4gICAgICAgIHJldHVybihuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCB0aGlzLm51bWJlcikpO1xuICAgIH1cbiAgICBcbiAgICBkZXJpdmF0aXZlKGl2YXIsIHZhckxpc3QpIHtcbiAgICAgICAgcmV0dXJuKG5ldyBzY2FsYXJfZXhwcih0aGlzLm1lbnYsIDApKTtcbiAgICB9XG4gICAgXG4gICAgLypcbiAgICAgICAgU2VlIGV4cHJlc3Npb25zLnByb3RvdHlwZS5tYXRjaCBmb3IgZXhwbGFuYXRpb24uXG4gICAgXG4gICAgICAgIEEgc2NhbGFyIG1pZ2h0IG1hdGNoIGEgY29uc3RhbnQgZm9ybXVsYS5cbiAgICAqL1xuICAgIG1hdGNoKGV4cHIsIGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciByZXRWYWx1ZSA9IG51bGwsXG4gICAgICAgICAgICB0ZXN0RXhwciA9IGV4cHI7XG4gICAgXG4gICAgICAgIC8vIFNwZWNpYWwgbmFtZWQgY29uc3RhbnRzIGNhbiBub3QgbWF0Y2ggZXhwcmVzc2lvbnMuXG4gICAgICAgIGlmIChleHByLmlzQ29uc3RhbnQoKSAmJiBleHByLnR5cGUgIT0gZXhwclR5cGUubnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgdGVzdEV4cHIgPSBleHByLmNvcHkoKS5zaW1wbGlmeUNvbnN0YW50cygpO1xuICAgICAgICAgICAgaWYgKHRoaXMudG9TdHJpbmcoKSA9PT0gdGVzdEV4cHIudG9TdHJpbmcoKSkge1xuICAgICAgICAgICAgICByZXRWYWx1ZSA9IGJpbmRpbmdzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRlc3RFeHByLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgJiYgdGhpcy5udW1iZXIuZXF1YWwodGVzdEV4cHIubnVtYmVyKSkge1xuICAgICAgICAgICAgcmV0VmFsdWUgPSBiaW5kaW5ncztcbiAgICAgICAgfVxuICAgIFxuICAgICAgICByZXR1cm4ocmV0VmFsdWUpO1xuICAgIH0gICAgXG59XG5cbiIsIi8qIVxuICogQlRNIEphdmFTY3JpcHQgTGlicmFyeSB2QFZFUlNJT05cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kYnJpYW53YWx0b24vQlRNXG4gKlxuICogQ29weXJpZ2h0IEQuIEJyaWFuIFdhbHRvblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIChodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVClcbiAqXG4gKiBEYXRlOiBAREFURVxuICovXG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBEZWZpbmUgdGhlIFVuYXJ5IEV4cHJlc3Npb24gLS0gZGVmaW5lZCBieSBhbiBvcGVyYXRvciBhbmQgYW4gaW5wdXQuXG4qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5pbXBvcnQgeyBleHByZXNzaW9uIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi5qc1wiXG5pbXBvcnQgeyBzY2FsYXJfZXhwciB9IGZyb20gXCIuL3NjYWxhcl9leHByLmpzXCJcbmltcG9ydCB7IGJpbm9wX2V4cHIgfSBmcm9tIFwiLi9iaW5vcF9leHByLmpzXCJcbmltcG9ydCB7IGV4cHJUeXBlLCBvcFByZWMgfSBmcm9tIFwiLi9CVE1fcm9vdC5qc1wiXG5cbmV4cG9ydCBjbGFzcyB1bm9wX2V4cHIgZXh0ZW5kcyBleHByZXNzaW9uIHtcbiAgICBjb25zdHJ1Y3RvcihtZW52LCBvcCwgaW5wdXQpIHtcbiAgICAgICAgc3VwZXIobWVudik7XG4gICAgICAgIHRoaXMudHlwZSA9IGV4cHJUeXBlLnVub3A7XG4gICAgICAgIHRoaXMub3AgPSBvcDtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIGlucHV0ID0gbmV3IGV4cHJlc3Npb24obWVudik7XG4gICAgICAgIHRoaXMuaW5wdXRzID0gW2lucHV0XTtcbiAgICAgICAgICAgIGlucHV0LnBhcmVudCA9IHRoaXM7XG4gICAgICAgIHN3aXRjaCAob3ApIHtcbiAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5tdWx0ZGl2O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLm11bHRkaXY7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICB0aGlzLnByZWMgPSBvcFByZWMucG93ZXI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiVW5rbm93biB1bmFyeSBvcGVyYXRvcjogJ1wiK29wK1wiJy5cIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgdmFyIHRoZVN0cjtcbiAgICAgICAgdmFyIG9wU3RyO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dHNbMF0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG9wU3RyID0gJz8nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3BTdHIgPSB0aGlzLmlucHV0c1swXS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmICgodGhpcy5pbnB1dHNbMF0udHlwZSA+PSBleHByVHlwZS51bm9wXG4gICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbMF0ucHJlYyA8IHRoaXMucHJlYylcbiAgICAgICAgICAgIHx8ICh0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICYmIG9wU3RyLmluZGV4T2YoJy8nKSA+PSAwXG4gICAgICAgICAgICAgICAgJiYgb3BQcmVjLm11bHRkaXYgPD0gdGhpcy5wcmVjKVxuICAgICAgICAgICAgKSBcbiAgICAgICAge1xuICAgICAgICAgICAgdGhlU3RyID0gdGhpcy5vcCArICcoJyArIG9wU3RyICsgJyknO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhlU3RyID0gdGhpcy5vcCArIG9wU3RyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKHRoZVN0cik7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRlc3RlZCBlcXVpdmFsZW50IHN0cmluZ3MuXG4gICAgYWxsU3RyaW5nRXF1aXZzKCkge1xuICAgICAgICB2YXIgYWxsSW5wdXRzID0gdGhpcy5pbnB1dHNbMF0uYWxsU3RyaW5nRXF1aXZzKCk7XG4gICAgICAgIHZhciByZXRWYWx1ZSA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgaW4gYWxsSW5wdXRzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbMF0udHlwZSA+PSBleHByVHlwZS51bm9wICYmIHRoaXMuaW5wdXRzWzBdLnByZWMgPD0gdGhpcy5wcmVjKSB7XG4gICAgICAgICAgICAgICAgcmV0VmFsdWVbaV0gPSB0aGlzLm9wICsgJygnICsgYWxsSW5wdXRzW2ldICsgJyknO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXRWYWx1ZVtpXSA9IHRoaXMub3AgKyBhbGxJbnB1dHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ocmV0VmFsdWUpO1xuICAgIH1cblxuICAgIHRvVGVYKHNob3dTZWxlY3QpIHtcbiAgICAgICAgdmFyIHRoZVN0cjtcbiAgICAgICAgdmFyIG9wU3RyLCB0aGVPcDtcblxuICAgICAgICBpZiAodHlwZW9mIHNob3dTZWxlY3QgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHNob3dTZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dHNbMF0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG9wU3RyID0gJz8nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3BTdHIgPSB0aGlzLmlucHV0c1swXS50b1RlWChzaG93U2VsZWN0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoZU9wID0gdGhpcy5vcDtcbiAgICAgICAgaWYgKHRoZU9wID09ICcvJykge1xuICAgICAgICAgICAgdGhlT3AgPSAnXFxcXGRpdiAnO1xuICAgICAgICAgICAgaWYgKHNob3dTZWxlY3QgJiYgdGhpcy5zZWxlY3QpIHtcbiAgICAgICAgICAgICAgICB0aGVTdHIgPSBcIntcXFxcY29sb3J7cmVkfVwiICsgdGhpcy5vcCArIFwifVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgJ1xcXFxsZWZ0KHtcXFxcY29sb3J7Ymx1ZX0nICsgb3BTdHIgKyAnfVxcXFxyaWdodCknO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGVTdHIgPSAnXFxcXGZyYWN7MX17JyArIG9wU3RyICsgJ30nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNob3dTZWxlY3QgJiYgdGhpcy5zZWxlY3QpIHtcbiAgICAgICAgICAgICAgICB0aGVTdHIgPSBcIntcXFxcY29sb3J7cmVkfVwiICsgdGhpcy5vcCArIFwifVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgJ1xcXFxsZWZ0KHtcXFxcY29sb3J7Ymx1ZX0nICsgb3BTdHIgKyAnfVxcXFxyaWdodCknO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlucHV0c1swXS50eXBlID49IGV4cHJUeXBlLnVub3AgJiYgdGhpcy5pbnB1dHNbMF0ucHJlYyA8PSB0aGlzLnByZWNcbiAgICAgICAgICAgICAgICAmJiAodGhpcy5pbnB1dHNbMF0udHlwZSAhPSBleHByVHlwZS51bm9wIHx8IHRoaXMub3AgIT0gJy0nIHx8IHRoaXMuaW5wdXRzWzBdLm9wICE9ICcvJykpIHtcbiAgICAgICAgICAgICAgICB0aGVTdHIgPSB0aGVPcCArICdcXFxcbGVmdCgnICsgb3BTdHIgKyAnXFxcXHJpZ2h0KSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoZVN0ciA9IHRoZU9wICsgb3BTdHI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHRoZVN0cik7XG4gICAgfVxuXG4gICAgdG9NYXRoTUwoKSB7XG4gICAgICAgIHZhciB0aGVTdHI7XG4gICAgICAgIHZhciBvcFN0cjtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaW5wdXRzWzBdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBvcFN0ciA9ICc/JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9wU3RyID0gdGhpcy5pbnB1dHNbMF0udG9NYXRoTUwoKTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgIHRoZVN0ciA9IG9wU3RyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgdGhlU3RyID0gXCI8YXBwbHk+PG1pbnVzLz5cIiArIG9wU3RyICsgXCI8L2FwcGx5PlwiO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgdGhlU3RyID0gXCI8YXBwbHk+PGRpdmlkZS8+PGNuPjE8L2NuPlwiICsgb3BTdHIgKyBcIjwvYXBwbHk+XCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4odGhlU3RyKTtcbiAgICB9XG5cbiAgICBvcGVyYXRlVG9UZVgoKSB7XG4gICAgICAgIHZhciBvcFN0cmluZyA9IHRoaXMub3A7XG5cbiAgICAgICAgaWYgKG9wU3RyaW5nID09PSAnLycpIHtcbiAgICAgICAgICAgIG9wU3RyaW5nID0gJ1xcXFxkaXYnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKG9wU3RyaW5nKTtcbiAgICB9XG5cbiAgICBldmFsdWF0ZShiaW5kaW5ncykge1xuICAgICAgICB2YXIgaW5wdXRWYWwgPSB0aGlzLmlucHV0c1swXS5ldmFsdWF0ZShiaW5kaW5ncyk7XG5cbiAgICAgICAgdmFyIHJldFZhbDtcbiAgICAgICAgaWYgKGlucHV0VmFsID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuKHVuZGVmaW5lZCk7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0aGlzLm9wKSB7XG4gICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICByZXRWYWwgPSBpbnB1dFZhbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgIHJldFZhbCA9IC0xKmlucHV0VmFsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgLy8gRXZlbiB3aGVuIGRpdmlkZSBieSB6ZXJvLCB3ZSB3YW50IHRvIHVzZSB0aGlzLCBzaW5jZSBpbiB0aGUgZXhjZXB0aW9uXG4gICAgICAgICAgICAgICAgLy8gd2Ugd2FudCB0aGUgdmFsdWUgdG8gYmUgSW5maW5pdGUgYW5kIG5vdCB1bmRlZmluZWQuXG4gICAgICAgICAgICAgICAgcmV0VmFsID0gMS9pbnB1dFZhbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJUaGUgdW5hcnkgb3BlcmF0b3IgJ1wiICsgdGhpcy5vcCArIFwiJyBpcyBub3QgZGVmaW5lZC5cIik7XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWwpO1xuICAgIH1cblxuICAgIHNpbXBsaWZ5Q29uc3RhbnRzKCkge1xuICAgICAgICB2YXIgcmV0VmFsO1xuXG4gICAgICAgIHRoaXMuaW5wdXRzWzBdID0gdGhpcy5pbnB1dHNbMF0uc2ltcGxpZnlDb25zdGFudHMoKTtcbiAgICAgICAgdGhpcy5pbnB1dHNbMF0ucGFyZW50ID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMuaW5wdXRzWzBdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgdGhlTnVtYmVyID0gdGhpcy5pbnB1dHNbMF0ubnVtYmVyO1xuICAgICAgICAgICAgc3dpdGNoICh0aGlzLm9wKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1lbnYub3B0aW9ucy5uZWdhdGl2ZU51bWJlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gbmV3IHNjYWxhcl9leHByKHRoaXMubWVudiwgdGhlTnVtYmVyLmFkZEludmVyc2UoKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLm1lbnYsIHRoZU51bWJlci5tdWx0SW52ZXJzZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXRWYWwgPSB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWwpO1xuICAgIH1cblxuICAgIGZsYXR0ZW4oKSB7XG4gICAgICByZXR1cm4obmV3IHVub3BfZXhwcih0aGlzLm1lbnYsIHRoaXMub3AsIHRoaXMuaW5wdXRzWzBdLmZsYXR0ZW4oKSkpO1xuICAgIH1cblxuICAgIGNvcHkoKSB7XG4gICAgICByZXR1cm4obmV3IHVub3BfZXhwcih0aGlzLm1lbnYsIHRoaXMub3AsIHRoaXMuaW5wdXRzWzBdLmNvcHkoKSkpO1xuICAgIH1cblxuICAgIGNvbXBvc2UoYmluZGluZ3MpIHtcbiAgICAgICAgcmV0dXJuKG5ldyB1bm9wX2V4cHIodGhpcy5tZW52LCB0aGlzLm9wLCB0aGlzLmlucHV0c1swXS5jb21wb3NlKGJpbmRpbmdzKSkpO1xuICAgIH1cblxuICAgIGRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCkge1xuICAgICAgICB2YXIgdGhlRGVyaXY7XG5cbiAgICAgICAgdmFyIHVDb25zdCA9IHRoaXMuaW5wdXRzWzBdLmlzQ29uc3RhbnQoKTtcbiAgICAgICAgaWYgKHVDb25zdCkge1xuICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5tZW52LCAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5vcCkge1xuICAgICAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IHRoaXMuaW5wdXRzWzBdLmRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyB1bm9wX2V4cHIodGhpcy5tZW52LCAnLScsIHRoaXMuaW5wdXRzWzBdLmRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlbm9tID0gbmV3IGJpbm9wX2V4cHIodGhpcy5tZW52LCAnKicsIHRoaXMuaW5wdXRzWzBdLCB0aGlzLmlucHV0c1swXSk7XG4gICAgICAgICAgICAgICAgICAgIHRoZURlcml2ID0gbmV3IHVub3BfZXhwcih0aGlzLm1lbnYsICctJywgbmV3IGJpbm9wX2V4cHIodGhpcy5tZW52LCAnLycsIHRoaXMuaW5wdXRzWzBdLmRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCksIGRlbm9tKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIGRlcml2YXRpdmUgb2YgdGhlIHVuYXJ5IG9wZXJhdG9yICdcIiArIHRoaXMub3AgKyBcIicgaXMgbm90IGRlZmluZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHRoZURlcml2KTtcbiAgICB9XG5cbiAgICBtYXRjaChleHByLCBiaW5kaW5ncykge1xuICAgICAgICB2YXIgcmV0VmFsdWUgPSBudWxsO1xuXG4gICAgICAgIC8vIFNwZWNpYWwgbmFtZWQgY29uc3RhbnRzIGNhbiBub3QgbWF0Y2ggZXhwcmVzc2lvbnMuXG4gICAgICAgIGlmICh0aGlzLmlzQ29uc3RhbnQoKSAmJiBleHByLmlzQ29uc3RhbnQoKSkge1xuICAgICAgICAgICAgdmFyIG5ld0V4cHIgPSBleHByLnNpbXBsaWZ5Q29uc3RhbnRzKCksXG4gICAgICAgICAgICAgICAgbmV3VGhpcyA9IHRoaXMuc2ltcGxpZnlDb25zdGFudHMoKTtcblxuICAgICAgICAgICAgaWYgKG5ld0V4cHIudG9TdHJpbmcoKSA9PT0gbmV3VGhpcy50b1N0cmluZygpXG4gICAgICAgICAgICAgICAgfHwgbmV3RXhwci50eXBlID09IGV4cHJUeXBlLm51bWJlciAmJiBuZXdUaGlzLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICYmIG5ld1RoaXMubnVtYmVyLmVxdWFsKG5ld0V4cHIubnVtYmVyKSkge1xuICAgICAgICAgICAgICAgIHJldFZhbHVlID0gYmluZGluZ3M7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXRWYWx1ZSA9IGV4cHJlc3Npb24ucHJvdG90eXBlLm1hdGNoLmNhbGwodGhpcywgZXhwciwgYmluZGluZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKHJldFZhbHVlKTtcbiAgICB9XG59XG4iLCIvKiFcbiAqIEJUTSBKYXZhU2NyaXB0IExpYnJhcnkgdkBWRVJTSU9OXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGJyaWFud2FsdG9uL0JUTVxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogRGVmaW5lIHRoZSBWYXJpYWJsZSBFeHByZXNzaW9uIC0tIGEgdmFsdWUgZGVmaW5lZCBieSBhIG5hbWVcbiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5pbXBvcnQgeyBleHByZXNzaW9uIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi5qc1wiXG5pbXBvcnQgeyBzY2FsYXJfZXhwciB9IGZyb20gXCIuL3NjYWxhcl9leHByLmpzXCJcbmltcG9ydCB7IGV4cHJUeXBlLCBleHByVmFsdWUgfSBmcm9tIFwiLi9CVE1fcm9vdC5qc1wiXG5cbmV4cG9ydCBjbGFzcyB2YXJpYWJsZV9leHByIGV4dGVuZHMgZXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IobWVudiwgbmFtZSkge1xuICAgICAgICBzdXBlcihtZW52KTtcbiAgICAgICAgdGhpcy50eXBlID0gZXhwclR5cGUudmFyaWFibGU7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG5cbiAgICAgICAgLy8gQ291bnQgaG93IG1hbnkgZGVyaXZhdGl2ZXMuXG4gICAgICAgIHZhciBwcmltZVBvcyA9IG5hbWUuaW5kZXhPZihcIidcIik7XG4gICAgICAgIHRoaXMuZGVyaXZzID0gMDtcbiAgICAgICAgaWYgKHByaW1lUG9zID4gMCkge1xuICAgICAgICAgICAgdGhpcy5kZXJpdnMgPSBuYW1lLnNsaWNlKHByaW1lUG9zKS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlzQ29uc3QgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc1NwZWNpYWwgPSBmYWxzZTtcbiAgICAgICAgc3dpdGNoKHRoaXMubmFtZSkge1xuICAgICAgICAgICAgY2FzZSAnZSc6XG4gICAgICAgICAgICBjYXNlICdwaSc6XG4gICAgICAgICAgICBjYXNlICdkbmUnOlxuICAgICAgICAgICAgY2FzZSAnaW5mJzpcbiAgICAgICAgICAgICAgICB0aGlzLmlzQ29uc3QgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNTcGVjaWFsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvU3RyaW5nKGVsZW1lbnRPbmx5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgZWxlbWVudE9ubHkgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGVsZW1lbnRPbmx5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHRoaXMubmFtZSk7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRlc3RlZCBlcXVpdmFsZW50IHN0cmluZ3MuXG4gICAgYWxsU3RyaW5nRXF1aXZzKCkge1xuICAgICAgICByZXR1cm4oW3RoaXMudG9TdHJpbmcoKV0pO1xuICAgIH1cblxuICAgIHRvVGVYKHNob3dTZWxlY3QpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzaG93U2VsZWN0ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBzaG93U2VsZWN0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0ciA9IHRoaXMudG9TdHJpbmcoKTtcblxuICAgICAgICBzd2l0Y2ggKHRoaXMubmFtZSkge1xuICAgICAgICAgICAgY2FzZSAnYWxwaGEnOlxuICAgICAgICAgICAgY2FzZSAnYmV0YSc6XG4gICAgICAgICAgICBjYXNlICdnYW1tYSc6XG4gICAgICAgICAgICBjYXNlICdkZWx0YSc6XG4gICAgICAgICAgICBjYXNlICdlcHNpbG9uJzpcbiAgICAgICAgICAgIGNhc2UgJ3pldGEnOlxuICAgICAgICAgICAgY2FzZSAnZXRhJzpcbiAgICAgICAgICAgIGNhc2UgJ3RoZXRhJzpcbiAgICAgICAgICAgIGNhc2UgJ2thcHBhJzpcbiAgICAgICAgICAgIGNhc2UgJ2xhbWJkYSc6XG4gICAgICAgICAgICBjYXNlICdtdSc6XG4gICAgICAgICAgICBjYXNlICdudSc6XG4gICAgICAgICAgICBjYXNlICd4aSc6XG4gICAgICAgICAgICBjYXNlICdwaSc6XG4gICAgICAgICAgICBjYXNlICdyaG8nOlxuICAgICAgICAgICAgY2FzZSAnc2lnbWEnOlxuICAgICAgICAgICAgY2FzZSAndGF1JzpcbiAgICAgICAgICAgIGNhc2UgJ3Vwc2lsb24nOlxuICAgICAgICAgICAgY2FzZSAncGhpJzpcbiAgICAgICAgICAgIGNhc2UgJ2NoaSc6XG4gICAgICAgICAgICBjYXNlICdwc2knOlxuICAgICAgICAgICAgY2FzZSAnb21lZ2EnOlxuICAgICAgICAgICAgY2FzZSAnR2FtbWEnOlxuICAgICAgICAgICAgY2FzZSAnRGVsdGEnOlxuICAgICAgICAgICAgY2FzZSAnVGhldGEnOlxuICAgICAgICAgICAgY2FzZSAnTGFtYmRhJzpcbiAgICAgICAgICAgIGNhc2UgJ1hpJzpcbiAgICAgICAgICAgIGNhc2UgJ1BpJzpcbiAgICAgICAgICAgIGNhc2UgJ1NpZ21hJzpcbiAgICAgICAgICAgIGNhc2UgJ1Vwc2lsb24nOlxuICAgICAgICAgICAgY2FzZSAnUGhpJzpcbiAgICAgICAgICAgIGNhc2UgJ1BzaSc6XG4gICAgICAgICAgICBjYXNlICdPbWVnYSc6XG4gICAgICAgICAgICAgICAgc3RyID0gJ1xcXFwnICsgdGhpcy5uYW1lO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnaW5mJzpcbiAgICAgICAgICAgICAgICBzdHIgPSAnXFxcXGluZnR5JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTcGVjaWFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0ciA9ICdcXFxcbWF0aHJteycgKyB0aGlzLm5hbWUgKyAnfSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm5hbWUuaW5kZXhPZihcImlucHV0XCIpPT0wKSB7XG4gICAgICAgICAgICBzdHIgPSBcIlxcXFxib3hlZHtcXFxcZG90cz9ee1wiICsgdGhpcy5uYW1lLnNsaWNlKDUpICsgXCJ9fVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNob3dTZWxlY3QgJiYgdGhpcy5zZWxlY3QpIHtcbiAgICAgICAgICAgIHN0ciA9IFwie1xcXFxjb2xvcntyZWR9XCIgKyBzdHIgKyBcIn1cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4oc3RyKTtcbiAgICB9XG5cbiAgICBkZXBlbmRlbmNpZXMoZm9yY2VkKSB7XG4gICAgICAgIHZhciBkZXBBcnJheSA9IG5ldyBBcnJheSgpO1xuICAgICAgICBpZiAoZm9yY2VkICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPGZvcmNlZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGRlcEFycmF5LnB1c2goZm9yY2VkW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuaXNDb25zdCAmJiBkZXBBcnJheS5pbmRleE9mKHRoaXMubmFtZSkgPCAwKSB7XG4gICAgICAgICAgICBkZXBBcnJheS5wdXNoKHRoaXMubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKGRlcEFycmF5KTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAgICBBIHZhcmlhYmxlIGlzIGNvbnN0YW50IG9ubHkgaWYgcmVmZXJyaW5nIHRvIG1hdGhlbWF0aWNhbCBjb25zdGFudHMgKGUsIHBpKVxuICAgICovXG4gICAgaXNDb25zdGFudCgpIHtcbiAgICAgICAgcmV0dXJuKHRoaXMuaXNDb25zdCk7XG4gICAgfVxuXG4gICAgZXZhbHVhdGUoYmluZGluZ3MpIHtcbiAgICAgICAgdmFyIHJldFZhbDtcblxuICAgICAgICBpZiAoYmluZGluZ3NbdGhpcy5uYW1lXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHN3aXRjaCh0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdlJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5FO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdwaSc6XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGguUEk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2luZic6XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IEluZmluaXR5O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdkbmUnOlxuICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBOdW1iZXIuTmFOO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlZhcmlhYmxlIGV2YWx1YXRlZCB3aXRob3V0IGJpbmRpbmcuXCIpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBiaW5kaW5nc1t0aGlzLm5hbWVdLnZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gYmluZGluZ3NbdGhpcy5uYW1lXS52YWx1ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXRWYWwgPSBiaW5kaW5nc1t0aGlzLm5hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKHJldFZhbCk7XG4gICAgfVxuXG4gICAgY29weSgpIHtcbiAgICAgICAgcmV0dXJuKG5ldyB2YXJpYWJsZV9leHByKHRoaXMubWVudiwgdGhpcy5uYW1lKSk7XG4gICAgfVxuXG4gICAgY29tcG9zZShiaW5kaW5ncykge1xuICAgICAgICB2YXIgcmV0VmFsO1xuXG4gICAgICAgIGlmIChiaW5kaW5nc1t0aGlzLm5hbWVdID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0VmFsID0gbmV3IHZhcmlhYmxlX2V4cHIodGhpcy5tZW52LCB0aGlzLm5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0VmFsID0gYmluZGluZ3NbdGhpcy5uYW1lXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihyZXRWYWwpO1xuICAgIH1cblxuICAgIGRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCkge1xuICAgICAgICB2YXIgcmV0VmFsO1xuICAgICAgICB2YXIgaXZhck5hbWUgPSAodHlwZW9mIGl2YXIgPT0gJ3N0cmluZycpID8gaXZhciA6IGl2YXIubmFtZTtcblxuICAgICAgICBpZiAodGhpcy5uYW1lID09PSBpdmFyTmFtZSkge1xuICAgICAgICAgICAgcmV0VmFsID0gbmV3IHNjYWxhcl9leHByKHRoaXMubWVudiwgMSk7XG5cbiAgICAgICAgLy8gSWYgZWl0aGVyIGEgY29uc3RhbnQgb3IgYW5vdGhlciBpbmRlcGVuZGVudCB2YXJpYWJsZSwgZGVyaXY9MFxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNDb25zdCB8fCB2YXJMaXN0ICYmIHZhckxpc3RbdGhpcy5uYW1lXSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldFZhbCA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLm1lbnYsIDApO1xuXG4gICAgICAgIC8vIFByZXN1bWluZyBvdGhlciB2YXJpYWJsZXMgYXJlIGRlcGVuZGVudCB2YXJpYWJsZXMuXG4gICAgICAgIH0gZWxzZSAge1xuICAgICAgICAgICAgcmV0VmFsID0gbmV3IHZhcmlhYmxlX2V4cHIodGhpcy5tZW52LCB0aGlzLm5hbWUrXCInXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWwpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgIFNlZSBleHByZXNzaW9ucy5wcm90b3R5cGUubWF0Y2ggZm9yIGV4cGxhbmF0aW9uLlxuXG4gICAgICAgIEEgdmFyaWFibGUgY2FuIG1hdGNoIGFueSBleHByZXNzaW9uLiBCdXQgd2UgbmVlZCB0byBjaGVja1xuICAgICAgICBpZiB0aGUgdmFyaWFibGUgaGFzIGFscmVhZHkgbWF0Y2hlZCBhbiBleHByZXNzaW9uLiBJZiBzbyxcbiAgICAgICAgaXQgbXVzdCBiZSB0aGUgc2FtZSBhZ2Fpbi5cbiAgICAqL1xuICAgIG1hdGNoKGV4cHIsIGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciByZXRWYWx1ZSA9IG51bGw7XG5cbiAgICAgICAgLy8gU3BlY2lhbCBuYW1lZCBjb25zdGFudHMgY2FuIG5vdCBtYXRjaCBleHByZXNzaW9ucy5cbiAgICAgICAgaWYgKHRoaXMuaXNDb25zdCkge1xuICAgICAgICAgICAgaWYgKGV4cHIudG9TdHJpbmcoKSA9PT0gdGhpcy5uYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0VmFsdWUgPSBiaW5kaW5ncztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAvLyBJZiBuZXZlciBwcmV2aW91c2x5IGFzc2lnbmVkLCBjYW4gbWF0Y2ggYW55IGV4cHJlc3Npb24uXG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZ3MgIT0gbnVsbCAmJiBiaW5kaW5nc1t0aGlzLm5hbWVdID09IHVuZGVmaW5lZCAmJiBleHByLnZhbHVlVHlwZSA9PSBleHByVmFsdWUubnVtZXJpYykge1xuICAgICAgICAgICAgcmV0VmFsdWUgPSBiaW5kaW5ncztcbiAgICAgICAgICAgIHJldFZhbHVlW3RoaXMubmFtZV0gPSBleHByLnRvU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZ3MgIT0gbnVsbCAmJiBiaW5kaW5nc1t0aGlzLm5hbWVdID09IGV4cHIudG9TdHJpbmcoKSkge1xuICAgICAgICAgICAgcmV0VmFsdWUgPSBiaW5kaW5ncztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxufVxuXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgKiBEZWZpbmUgdGhlIEluZGV4IEV4cHJlc3Npb24gLS0gYSByZWZlcmVuY2UgaW50byBhIGxpc3RcbiAgICAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5leHBvcnQgY2xhc3MgaW5kZXhfZXhwciB7XG4gICAgXG4gICAgY29uc3RydWN0b3IobmFtZSwgaW5kZXgpIHtcbiAgICAgICAgdGhpcy50eXBlID0gZXhwclR5cGUudmFyaWFibGU7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuc2VsZWN0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYm91bmROYW1lID0gXCJbXVwiK25hbWU7XG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICB2YXIgZGVwQXJyYXkgPSBpbmRleC5kZXBlbmRlbmNpZXMoKTtcbiAgICAgICAgaWYgKGRlcEFycmF5Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGFsZXJ0KFwiQW4gYXJyYXkgcmVmZXJlbmNlIGNhbiBvbmx5IGhhdmUgb25lIGluZGV4IHZhcmlhYmxlLlwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuayA9IGRlcEFycmF5WzBdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoZWxlbWVudE9ubHkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50T25seSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZWxlbWVudE9ubHkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4odGhpcy5uYW1lICsgXCJbXCIgKyB0aGlzLmluZGV4LnRvU3RyaW5nKCkgKyBcIl1cIik7XG4gICAgfVxuXG4gICAgdG9UZVgoc2hvd1NlbGVjdCkge1xuICAgICAgICBpZiAodHlwZW9mIHNob3dTZWxlY3QgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHNob3dTZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB3b3JkID0gdGhpcy5uYW1lICsgXCJfe1wiICsgdGhpcy5pbmRleC50b1N0cmluZygpICsgXCJ9XCI7XG4gICAgICAgIGlmIChzaG93U2VsZWN0ICYmIHRoaXMuc2VsZWN0KSB7XG4gICAgICAgICAgICB3b3JkID0gXCJ7XFxcXGNvbG9ye3JlZH1cIiArIHdvcmQgKyBcIn1cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4od29yZCk7XG4gICAgfVxuXG4gICAgdG9NYXRoTUwoKSB7XG4gICAgICAgIHJldHVybihcIjxhcHBseT48c2VsZWN0b3IvPjxjaSB0eXBlPVxcXCJ2ZWN0b3JcXFwiPlwiICsgdGhpcy5uYW1lICsgXCI8L2NpPlwiICsgdGhpcy5pbmRleC50b1N0cmluZygpICsgXCI8L2FwcGx5PlwiKTtcbiAgICB9XG5cbiAgICBkZXBlbmRlbmNpZXMoZm9yY2VkKSB7XG4gICAgICAgIHZhciBkZXBBcnJheSA9IG5ldyBBcnJheSgpO1xuICAgICAgICBpZiAoZm9yY2VkICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPGZvcmNlZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGRlcEFycmF5LnB1c2goZm9yY2VkW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2godGhpcy5uYW1lKSB7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGRlcEFycmF5LnB1c2goXCJyb3dcIik7XG4gICAgICAgICAgICAgICAgZGVwQXJyYXkucHVzaCh0aGlzLmJvdW5kTmFtZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKGRlcEFycmF5KTtcbiAgICB9XG5cbiAgICBldmFsdWF0ZShiaW5kaW5ncykge1xuICAgICAgICB2YXIgcmV0VmFsO1xuXG4gICAgICAgIGlmIChiaW5kaW5nc1t0aGlzLmJvdW5kTmFtZV0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzd2l0Y2godGhpcy5uYW1lKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB0bXBCaW5kID0ge307XG4gICAgICAgICAgICBpZiAodGhpcy5rICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRtcEJpbmRbdGhpcy5rXSA9IGJpbmRpbmdzW1wicm93XCJdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGkgPSB0aGlzLmluZGV4LmV2YWx1YXRlKHRtcEJpbmQpLTE7XG4gICAgICAgICAgICBpZiAoaSA+PSAwICYmIGk8YmluZGluZ3NbdGhpcy5ib3VuZE5hbWVdLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldFZhbCA9IGJpbmRpbmdzW3RoaXMuYm91bmROYW1lXVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihyZXRWYWwpO1xuICAgIH1cbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=