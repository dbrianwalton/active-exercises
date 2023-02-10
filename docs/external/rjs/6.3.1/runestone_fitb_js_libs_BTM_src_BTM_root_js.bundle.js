"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_fitb_js_libs_BTM_src_BTM_root_js"],{

/***/ 63368:
/*!****************************************************!*\
  !*** ./runestone/fitb/js/libs/BTM/src/BTM_root.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BTM": () => (/* binding */ BTM),
/* harmony export */   "exprType": () => (/* binding */ exprType),
/* harmony export */   "exprValue": () => (/* binding */ exprValue),
/* harmony export */   "opPrec": () => (/* binding */ opPrec),
/* harmony export */   "toTeX": () => (/* binding */ toTeX)
/* harmony export */ });
/* harmony import */ var _reductions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reductions.js */ 68528);
/* harmony import */ var _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scalar_expr.js */ 45706);
/* harmony import */ var _variable_expr_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./variable_expr.js */ 41487);
/* harmony import */ var _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./unop_expr.js */ 87521);
/* harmony import */ var _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./binop_expr.js */ 14715);
/* harmony import */ var _multiop_expr_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./multiop_expr.js */ 36167);
/* harmony import */ var _function_expr_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./function_expr.js */ 69807);
/* harmony import */ var _deriv_expr_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./deriv_expr.js */ 29731);
/* harmony import */ var _random_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./random.js */ 43488);
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./expression.js */ 55676);
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

class BTM {
    constructor(settings) {
        if (settings === undefined) {
            settings = {};
            settings.seed = '1234';
        }
        // Each instance of BTM environment needs bindings across all expressions.
        this.randomBindings = {};
        this.bindings = {};
        this.data = {};
        this.data.allValues = {};
        this.data.params = {};
        this.data.variables = {};
        this.data.expressions = {};
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
        var rndVal, rndScalar;

        switch (distr) {
            case 'discrete':
                let Nvals = Math.floor((options.max-options.min) / options.by)+1;
                do {
                    rndVal = options.min + options.by * this.rng.randInt(0,Nvals-1);
                } while (options.nonzero && Math.abs(rndVal) < this.options.absTol);
                break;
        }
        rndScalar = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this, rndVal);
        return rndScalar;
    }

    addParameter(name, options) {
        var newParam;
        let prec = options.prec;
        if (options.mode === 'random') {
            let distr = options.distr;
            if (typeof distr === 'undefined') {
                distr = 'discrete_range';
            }
            switch (distr) {
                case 'discrete_range':
                let Nvals = Math.floor((options.max-options.min) / options.by)+1;
                do {
                    newParam = options.min + options.by * this.rng.randInt(0,Nvals-1);
                } while (options.nonzero && Math.abs(newParam) < this.options.absTol);
                break;
            }
        } else if (options.mode == 'calculate') {
            newParam = this.parse(options.formula, "number").evaluate(this.data.params);
        } else if (options.mode == 'rational') {
            newParam = this.parse(new rational_number(options.numer,options.denom).toString(), "number");
        } else if (options.mode == 'static') {
            newParam = options.value;
        }
        if (typeof prec === 'number') {
            newParam = Math.round(newParam/prec) / Math.round(1/prec);
        }
        this.data.params[name] = newParam;
        this.data.allValues[name] = newParam;

        return newParam;
    }

    addVariable(name, options) {
        var newVar = new _variable_expr_js__WEBPACK_IMPORTED_MODULE_2__.variable_expr(name);

        this.data.variables[name] = newVar;
        this.data.allValues[name] = newVar;

        return newVar;
    }

    evaluateMathObject(mathObject, context, bindings) {
        var theExpr, newExpr, retValue;
        // Not yet parsed
        if (typeof mathObject === 'string') {
            var formula = this.decodeFormula(mathObject);
            theExpr = this.parse(formula, "formula");
        // Already parsed
        } else if (typeof mathObject === 'object') {
            theExpr = mathObject;
        }
        retValue = theExpr.evaluate(bindings);
        newExpr = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this, retValue);
        return newExpr;
    }

    parseExpression(expression, context) {
        var newExpr;
        // Not yet parsed
        if (typeof expression === 'string') {
        var formula = this.decodeFormula(expression);
        newExpr = this.parse(formula, context);
        // Already parsed
        } else if (typeof expression === 'object') {
            newExpr = expression;
        }
        return newExpr;
    }

    addExpression(name, expression) {
        var newExpr = this.parseExpression(expression, "formula");

        this.data.expressions[name] = newExpr;
        this.data.allValues[name] = newExpr;

        return newExpr;
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
    btm.parse() is the workhorse.

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
    function resolveOperator(btm, operatorStack, operandStack, newOp) {
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
            if (btm.options.negativeNumbers && input.type == exprType.number && oldOp.op == '-') {
              newExpr = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(btm, input.number.multiply(-1));
            } else {
              newExpr = new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(btm, oldOp.op, input);
            }
          } else {
            newExpr = new _expression_js__WEBPACK_IMPORTED_MODULE_9__.expression(btm);
            newExpr.setParsingError("Incomplete formula: missing value for " + oldOp.op);
          }
        // Binary: Will be *two* operands.
        } else {
          if (operandStack.length > 1) {
            var inputB = operandStack.pop();
            var inputA = operandStack.pop();
            newExpr = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(btm, oldOp.op, inputA, inputB);
          } else {
            newExpr = new _expression_js__WEBPACK_IMPORTED_MODULE_9__.expression(btm);
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
        // Test if a function
        if (bindings[theName]===undefined && workingStr.charAt(endPos) == '(') {
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
        // Test if context is consistent
        switch (context) {
            case 'number':
                if (!finalExpression.isConstant()) {
                    //throw "The expression should be a constant but depends on variables."
                }
                finalExpression = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this, finalExpression.value());
                break;
            case 'formula':
                break;
        }
        //finalExpression.setContext(context);
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


/***/ }),

/***/ 14715:
/*!******************************************************!*\
  !*** ./runestone/fitb/js/libs/BTM/src/binop_expr.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "binop_expr": () => (/* binding */ binop_expr)
/* harmony export */ });
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BTM_root.js */ 63368);
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./expression.js */ 55676);
/* harmony import */ var _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scalar_expr.js */ 45706);
/* harmony import */ var _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./unop_expr.js */ 87521);
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
    constructor(btm, op, inputA, inputB) {
        super(btm);
        this.type = _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.binop;
        this.op = op;
        if (typeof inputA == 'undefined')
            inputA = new _expression_js__WEBPACK_IMPORTED_MODULE_1__.expression(this.btm);
        if (typeof inputB == 'undefined')
            inputB = new _expression_js__WEBPACK_IMPORTED_MODULE_1__.expression(this.btm);
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
                retVal = (Math.abs(inputAVal - inputBVal) < this.btm.options.absTol);
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
                newExpr = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.btm, this.op == '+' ? 0 : 1);
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
                if (!this.btm.options.negativeNumbers && theNumber.p < 0) {
                    retVal = new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(this.btm, '-', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.btm, theNumber.multiply(-1)));
                } else {
                    retVal = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.btm, theNumber);
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
                        retVal = new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(this.btm, "-", this.inputs[1]);
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
                        retVal = new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(this.btm, "/", this.inputs[1]);
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
                        retVal = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.btm, 0);
                    }
                    // Simplify 1^p
                    else if (this.inputs[0].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number
                            && this.inputs[0].number.value() == 1) {
                        retVal = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.btm, 1);
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
                                inputs.push(new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(this.btm, '-',newInput.inputs[i]));
                            }
                        } else {
                            inputs.push(new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(this.btm, '-',inB));
                        }
                    } else {
                        inputs.push(inB);
                    }
                }
                retVal = new multiop_expr(this.btm, '+', inputs);
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
                                inputs.push(new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(this.btm, '/',newInput.inputs[i]));
                            }
                        } else {
                            inputs.push(new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(this.btm, '/',inB));
                        }
                    } else {
                        inputs.push(inB);
                    }
                }
                retVal = new multiop_expr(this.btm, '*', inputs);
                break;
            default:
                retVal = new binop_expr(this.btm, this.op, inA, inB);
        }
        return(retVal);
    }

    copy() {
      var inA = this.inputs[0].copy();
      var inB = this.inputs[1].copy();
      return (new binop_expr(this.btm, this.op, inA, inB));
    }

    compose(bindings) {
        var inA = this.inputs[0].compose(bindings);
        var inB = this.inputs[1].compose(bindings);

        var retVal;
        retVal = new binop_expr(this.btm, this.op, inA, inB);
        if (inA.type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number && inB.type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.number) {
            switch (this.op) {
                case '+':
                    retVal = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.btm, inA.number.add(inB.number));
                    break;
                case '-':
                    retVal = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.btm, inA.number.subtract(inB.number));
                    break;
                case '*':
                    retVal = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.btm, inA.number.multiply(inB.number));
                    break;
                case '/':
                    retVal = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.btm, inA.number.divide(inB.number));
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
            theDeriv = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.btm, 0);
        } else {
            var dudx, dvdx;

            if (uConst) {
                dudx = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.btm, 0);
            } else {
                dudx = this.inputs[0].derivative(ivar, varList);
            }
            if (vConst) {
                dvdx = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.btm, 0);
            } else {
                dvdx = this.inputs[1].derivative(ivar, varList);
            }
            switch (this.op) {
                case '+':
                    theDeriv = new binop_expr(this.btm, '+', dudx, dvdx);
                    break;
                case '-':
                    theDeriv = new binop_expr(this.btm, '-', dudx, dvdx);
                    break;
                case '*':
                    var udv = new binop_expr(this.btm, '*', this.inputs[0], dvdx)
                    var vdu = new binop_expr(this.btm, '*', dudx, this.inputs[1])
                    if (uConst) {
                        theDeriv = udv;
                    } else if (vConst) {
                        theDeriv = vdu;
                    } else {
                        theDeriv = new binop_expr(this.btm, '+', vdu, udv);
                    }
                    break;
                case '/':
                    if (vConst) {
                        theDeriv = new binop_expr(this.btm, '/', dudx, this.inputs[1]);
                    } else if (uConst) {
                        var numer = new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(this.btm, '-', new binop_expr(this.btm, '*', this.inputs[0], dvdx));
                        var denom = new binop_expr(this.btm, '^', this.inputs[1], new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.btm, 2));
                        theDeriv = new binop_expr(this.btm, '/', numer, denom);
                    } else {
                        var udv = new binop_expr(this.btm, '*', this.inputs[0], dvdx)
                        var vdu = new binop_expr(this.btm, '*', dudx, this.inputs[1])
                        var numer = new binop_expr(this.btm, '-', vdu, udv);
                        var denom = new binop_expr(this.btm, '^', this.inputs[1], new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.btm, 2));
                        theDeriv = new binop_expr(this.btm, '/', numer, denom);
                    }
                    break;
                case '^':
                    var powDep = this.inputs[1].dependencies();
                    var ivarName = (typeof ivar == 'string') ? ivar : ivar.name;
                    // See if the power depends on the variable
                    if (powDep.length > 0 && powDep.indexOf(ivarName) >= 0) {
                        var theArg = new binop_expr(this.btm, '*', this.inputs[1], new function_expr(this.btm, 'log', this.inputs[0]));
                        var theFcn = new function_expr(this.btm, 'exp', theArg);
                        theDeriv = theFcn.derivative(ivar, varList);
                    // Otherwise this is a simple application of the power rule
                    } else if (!uConst) {
                        var newPow = new binop_expr(this.btm, '-', this.inputs[1], new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.btm, 1));
                        var dydu = new binop_expr(this.btm, '*', this.inputs[1], new binop_expr(this.btm, '^', this.inputs[0], newPow));
                        if (this.inputs[0].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.exprType.variable
                                && this.inputs[0].name == ivarName) {
                            theDeriv = dydu;
                        } else {
                            var dudx = this.inputs[0].derivative(ivar, varList);
                            theDeriv = new binop_expr(this.btm, '*', dydu, dudx);
                        }
                    } else {
                        theDeriv = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__.scalar_expr(this.btm, 0);
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

/***/ 29731:
/*!******************************************************!*\
  !*** ./runestone/fitb/js/libs/BTM/src/deriv_expr.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "deriv_expr": () => (/* binding */ deriv_expr)
/* harmony export */ });
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expression.js */ 55676);
/* harmony import */ var _variable_expr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./variable_expr.js */ 41487);
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BTM_root.js */ 63368);
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
    constructor(btm, formula, variable, atValue) {
        super(btm);
        this.type = _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__.exprType.operator;
        this.op = "D";
        if (typeof formula == 'undefined')
            formula = new _expression_js__WEBPACK_IMPORTED_MODULE_0__.expression(this.btm);
        if (typeof variable == 'undefined') {
            variable = new _variable_expr_js__WEBPACK_IMPORTED_MODULE_1__.variable_expr(this.btm, 'x');
        } else if (typeof variable == 'string') {
            variable = new _variable_expr_js__WEBPACK_IMPORTED_MODULE_1__.variable_expr(this.btm, variable);
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
      return (new deriv_expr(this.btm, this.inputs[0].flatten(), this.ivar, this.ivarValue));
    }

    copy() {
      return (new deriv_expr(this.btm, this.inputs[0].copy(), this.ivar, this.ivarValue));
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

/***/ 55676:
/*!******************************************************!*\
  !*** ./runestone/fitb/js/libs/BTM/src/expression.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MathObject": () => (/* binding */ MathObject),
/* harmony export */   "expression": () => (/* binding */ expression)
/* harmony export */ });
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BTM_root.js */ 63368);
/* harmony import */ var _reductions_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reductions.js */ 68528);
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
    constructor(btm) {
        this.btm = btm;
        if (!(btm instanceof _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.BTM)) {
            throw "MathObject constructed with invalid environment";
        }
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
  constructor(btm) {
        if (!(btm instanceof _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__.BTM)) {
            throw "expression constructed with invalid environment";
        }
        super(btm);
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
        var myCopy = new expression(this.btm);
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
        return(new expression(this.btm));
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
            options = {};
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
                            if (!inputMatched[j] && flatA.inputs[j].compare(flatB.inputs[i])) {
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
        matchRules = (0,_reductions_js__WEBPACK_IMPORTED_MODULE_1__.findMatchRules)(this.btm.reduceRules, workExpr, true);
        while (matchRules.length > 0) {
            workExpr = this.btm.parse(matchRules[0].subStr, this.context);
            matchRules = (0,_reductions_js__WEBPACK_IMPORTED_MODULE_1__.findMatchRules)(this.btm.reduceRules, workExpr, true);
        }
        return workExpr;
    }

    
    derivative(ivar, varList) {
        return(new scalar_expr(this.btm, 0));
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

/***/ 69807:
/*!*********************************************************!*\
  !*** ./runestone/fitb/js/libs/BTM/src/function_expr.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "function_expr": () => (/* binding */ function_expr)
/* harmony export */ });
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expression.js */ 55676);
/* harmony import */ var _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scalar_expr.js */ 45706);
/* harmony import */ var _variable_expr_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./variable_expr.js */ 41487);
/* harmony import */ var _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./unop_expr.js */ 87521);
/* harmony import */ var _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./binop_expr.js */ 14715);
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./BTM_root.js */ 63368);
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
    constructor(btm, name, inputExpr, restrictDomain) {
        super(btm);
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
            inputExpr = new _expression_js__WEBPACK_IMPORTED_MODULE_0__.expression(this.btm);
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
                // When using a custom function for the first time, we need to create
                // a random dummy function for work when not bound to definition.
                // See if we have already used this function.
                // For consistency, we should keep it the same.
                var functionEntry = this.btm.randomBindings[this.name];
                // If never used previously, generate a random function.
                // This will allow valid comparisons to occur.
                if (functionEntry == undefined) {
                    functionEntry = {};
                    functionEntry["input"] = "x";
                    var formula = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, this.btm.rng.randRational([-20,20],[1,15]));
                    var newTerm, varTerm;
                    for (var i=1; i<=6; i++) {
                        newTerm = this.btm.parse("sin("+i+"*x)", "formula");
                        newTerm = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, "*",
                                        new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, this.btm.rng.randRational([-20,20],[1,10])),
                                        newTerm);
                        formula = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, "+", formula, newTerm);
                    }
                    functionEntry["value"] = [ formula ];
                    this.btm.randomBindings[this.name] = functionEntry;
                }
                if (this.derivs > 0) {
                    var xvar = new _variable_expr_js__WEBPACK_IMPORTED_MODULE_2__.variable_expr(this.btm, "x");
                    for (var i=functionEntry["value"].length; i<=this.derivs; i++) {
                        functionEntry["value"][i] = functionEntry["value"][i-1].derivative(xvar, {"x":0});
                    }
                }
                break;
        }
        // If using a derivative of a known function, then we should compute that in advance.
        if (this.builtin && this.derivs > 0) {
            var xvar = new _variable_expr_js__WEBPACK_IMPORTED_MODULE_2__.variable_expr(this.btm, "x");
            var deriv = new function_expr(this.btm, this.name, xvar);
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
                texString = '<apply><ci>' + name + '</ci>' + argString + '</apply>';
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
                        var functionEntry = this.btm.randomBindings[this.name];
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
                        fBind[functionEntry["input"]] = inputVal;
                        // See if we need additional derivatives in binding
                        if (this.derivs >= functionEntry["value"].length) {
                            var ivar = new _variable_expr_js__WEBPACK_IMPORTED_MODULE_2__.variable_expr(this.btm, functionEntry["input"]);
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
                fBind[functionEntry["input"]] = inputVal;
                // See if we need additional derivatives in binding
                if (this.derivs >= functionEntry["value"].length) {
                    var ivar = new _variable_expr_js__WEBPACK_IMPORTED_MODULE_2__.variable_expr(this.btm, functionEntry["input"]);
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
        return(new function_expr(this.btm, this.getName(), this.inputs[0].flatten()));
    }

    copy() {
      return(new function_expr(this.btm, this.getName(), this.inputs[0].copy()));
    }

    compose(bindings) {
        return(new function_expr(this.btm, this.getName(), this.inputs[0].compose(bindings)));
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
            theDeriv = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 0);
        } else {
            var dydu;

            switch(this.name) {
                    case 'sin':
                        dydu = new function_expr(this.btm, 'cos', this.inputs[0]);
                        break;
                    case 'cos':
                        dydu = new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(this.btm, '-', new function_expr(this.btm, 'sin', this.inputs[0]));
                        break;
                    case 'tan':
                        var theSec = new function_expr(this.btm, 'sec', this.inputs[0]);
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '^', theSec, new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 2));
                        break;
                    case 'csc':
                        var theCot = new function_expr(this.btm, 'cot', this.inputs[0]);
                        dydu = new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(this.btm, '-', new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '*', this, theCot));
                        break;
                    case 'sec':
                        var theTan = new function_expr(this.btm, 'tan', this.inputs[0]);
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '*', this, theTan);
                        break;
                    case 'cot':
                        var theCsc = new function_expr(this.btm, 'csc', this.inputs[0]);
                        dydu = new _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__.unop_expr(this.btm, '-', new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '^', theCsc, new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 2)));
                        break;
                    case 'arcsin':
                        var theCos = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '-', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 1), new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '^', this.inputs[0], new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 2)));
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '/', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 1), new function_expr(this.btm, 'sqrt', theCos));
                        break;
                    case 'arccos':
                        var theSin = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '-', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 1), new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '^', this.inputs[0], new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 2)));
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '/', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, -1), new function_expr(this.btm, 'sqrt', theSin));
                        break;
                    case 'arctan':
                        var tanSq = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '^', this.inputs[0], new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 2));
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '/', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 1), new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '+', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 1), tanSq));
                        break;
                    case 'arcsec':
                        var theSq = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '^', this.inputs[0], new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 2));
                        var theRad = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '-', theSq, new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 1));
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '/', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 1), new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '*', new function_expr(this.btm, 'abs', this.inputs[0]), new function_expr(this.btm, 'sqrt', theRad)));
                        break;
                    case 'arccsc':
                        var theSq = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '^', this.inputs[0], new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 2));
                        var theRad = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '-', theSq, new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 1));
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '/', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, -1), new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '*', new function_expr(this.btm, 'abs', this.inputs[0]), new function_expr(this.btm, 'sqrt', theRad)));
                        break;
                    case 'arccot':
                        var cotSq = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '^', this.inputs[0], new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 2));
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '/', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, -1), new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '+', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 1), cotSq));
                        break;
                    case 'sqrt':
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '/', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 1), new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '*', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 2), this));
                        break;
                    case 'abs':
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '/', this, this.inputs[0]);
                        break;
                    case 'exp':
                    case 'expb':
                        dydu = new function_expr(this.btm, this.name, this.inputs[0]);
                        break;
                    case 'ln':
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '/', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 1), this.inputs[0]);
                        break;
                    case 'log10':
                        dydu = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '/', new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, Math.LOG10E), this.inputs[0]);
                        break;
                    default:
                        dydu = new function_expr(this.btm, this.getName()+"'", this.inputs[0]);
                        break;
            }
            if (!uConst && this.inputs[0].type == _BTM_root_js__WEBPACK_IMPORTED_MODULE_5__.exprType.variable) {
                theDeriv = dydu;
            } else {
                var dudx = this.inputs[0].derivative(ivar, varList);

                if (dudx == undefined) {
                    theDeriv = undefined;
                } else {
                    theDeriv = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__.binop_expr(this.btm, '*', dydu, dudx);
                }
            }
        }
        return(theDeriv);
    }
}

/***/ }),

/***/ 36167:
/*!********************************************************!*\
  !*** ./runestone/fitb/js/libs/BTM/src/multiop_expr.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "multiop_expr": () => (/* binding */ multiop_expr)
/* harmony export */ });
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expression.js */ 55676);
/* harmony import */ var _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scalar_expr.js */ 45706);
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BTM_root.js */ 63368);
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
    constructor(btm, op, inputs) {
        super(btm);
        this.type = _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__.exprType.multiop;
        this.op = op;
        this.inputs = inputs; // an array
        for (var i in inputs) {
            if (typeof inputs[i] == 'undefined')
                inputs[i] = new _expression_js__WEBPACK_IMPORTED_MODULE_0__.expression(this.btm);
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
            retValue = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, this.op == '+' ? 0 : 1);
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
            retValue = new multiop_expr(this.btm, this.op, newInputs);
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
                newExpr = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, this.op == '+' ? 0 : 1);
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
                    newInputs.push(newInput = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, newConstant));
                    break;
                case '*':
                    newInputs.splice(0, 0, newInput = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, newConstant));
                    break;
            }
            if (newInputs.length == 1) {
                newExpr = newInputs[0];
            } else {
                newInput.parent = this;
                newExpr = new multiop_expr(this.btm, this.op, newInputs);
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
                    cmpInputs[i] = this.btm.parse(expr.inputs[i].toString(), expr.inputs[i].context);
                } else {
                    // Create copies of the inputs
                    var newInputs = [];
                    for (var j=0; j<=expr.inputs.length-n; j++) {
                        newInputs[j] = this.btm.parse(expr.inputs[n+j-1].toString(), expr.inputs[n+j-1].context);
                    }
                    cmpInputs[i] = new multiop_expr(this.btm, expr.op, newInputs);
                }
            }
            cmpExpr = new multiop_expr(this.btm, expr.op, cmpInputs);

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
                            newInputs[j] = this.btm.parse(expr.inputs[j].toString(), expr.inputs[j].context);
                        }
                        cmpInputs[i] = new multiop_expr(this.btm, expr.op, newInputs);
                    } else {
                        cmpInputs[i] = this.btm.parse(expr.inputs[diff+i].toString(), expr.inputs[diff+i].context);
                    }
                }
                cmpExpr = new multiop_expr(this.btm, expr.op, cmpInputs);

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
            retValue = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, this.op == '+' ? 0 : 1);
        } else if (newInputs.length == 1) {
            retValue = newInputs[0];
        } else {
            retValue = new multiop_expr(this.btm, this.op, newInputs);
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
                        dTerms.push(new multiop_expr(this.btm, '*', dProdTerms));
                        break;
                }
            }
        }
        if (dTerms.length == 0) {
            theDeriv = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 0);
        } else if (dTerms.length == 1) {
            theDeriv = dTerms[0];
        } else {
            theDeriv = new multiop_expr(this.btm, '+', dTerms);
        }
        return(theDeriv);
    }
}

/***/ }),

/***/ 43488:
/*!**************************************************!*\
  !*** ./runestone/fitb/js/libs/BTM/src/random.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RNG": () => (/* binding */ RNG)
/* harmony export */ });
/* harmony import */ var _rational_number_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rational_number.js */ 66248);
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

/***/ 66248:
/*!***********************************************************!*\
  !*** ./runestone/fitb/js/libs/BTM/src/rational_number.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "findGCD": () => (/* binding */ findGCD),
/* harmony export */   "rational_number": () => (/* binding */ rational_number)
/* harmony export */ });
/* harmony import */ var _real_number_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./real_number.js */ 22290);
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
        if (other.constructor.name != "rational_number") {
          return (this.value()==other.value());
        } else {
          return (this.p.valueOf()==other.p.valueOf()
                    && this.q.valueOf() == other.q.valueOf());
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

/***/ 22290:
/*!*******************************************************!*\
  !*** ./runestone/fitb/js/libs/BTM/src/real_number.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "real_number": () => (/* binding */ real_number)
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

/***/ 68528:
/*!******************************************************!*\
  !*** ./runestone/fitb/js/libs/BTM/src/reductions.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "defaultProductReductions": () => (/* binding */ defaultProductReductions),
/* harmony export */   "defaultReductions": () => (/* binding */ defaultReductions),
/* harmony export */   "defaultSumReductions": () => (/* binding */ defaultSumReductions),
/* harmony export */   "disableRule": () => (/* binding */ disableRule),
/* harmony export */   "findMatchRules": () => (/* binding */ findMatchRules),
/* harmony export */   "newRule": () => (/* binding */ newRule)
/* harmony export */ });
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BTM_root.js */ 63368);
/*!
 * BTM JavaScript Library v@VERSION
 * https://github.com/dbrianwalton/BTM
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



function newRule(btm, reductionList, equation, description, isValid, useOneWay, constraints) {
    var exprFormulas = equation.split('==');
    if (exprFormulas.length != 2) {
        console.log("Invalid equation in identity list: " + equation);
    } else {
        for (var refID=0; refID <= 1; refID++) {
            if (refID == 1 && typeof useOneWay != 'undefined' && useOneWay) {
                break;
            }
            var identity;

            var refExpr = btm.parse(exprFormulas[refID],"formula");
            var eqExpr = btm.parse(exprFormulas[1-refID],"formula");
            var numVars = refExpr.dependencies().length;
            var allRefExpr = [exprFormulas[refID]];
            // this is a big slow down, so just make sure each rule is written in multiple ways.
            //      var allRefExpr = refExpr.allStringEquivs();

            var uniqueExpr = [];
            for (var i in allRefExpr) {
                var nextExpr = btm.parse(allRefExpr[i],"formula");
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
function disableRule(btm, reductionList, equation) {
  // Match only on refExpr.
  var exprFormulas = equation.split('==');
  var refExpr, eqExpr;
  if (exprFormulas.length > 2) {
    console.log("Invalid equation in identity list: " + equation);
    return;
  } else {
    refExpr = btm.parse(exprFormulas[0],"formula");
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


function defaultReductions(btm) {
    var reduceRules = new Array();

    newRule(btm, reduceRules, '0+x==x', 'Additive Identity', true, true);
    newRule(btm, reduceRules, 'x+0==x', 'Additive Identity', true, true);
    newRule(btm, reduceRules, '0-x==-x', 'Additive Inverse', true, true);
    newRule(btm, reduceRules, 'x-0==x', 'Additive Identity', true, true);
    newRule(btm, reduceRules, '0*x==0', 'Multiply by Zero', true, true);
    newRule(btm, reduceRules, 'x*0==0', 'Multiply by Zero', true, true);
    newRule(btm, reduceRules, '1*x==x', 'Multiplicative Identity', true, true);
    newRule(btm, reduceRules, 'x*1==x', 'Multiplicative Identity', true, true);
    newRule(btm, reduceRules, '0/x==0', 'Multiply by Zero', true, true);
    newRule(btm, reduceRules, 'x/1==x', 'Divide by One', true, true);
    newRule(btm, reduceRules, 'x^1==x', 'First Power', true, true);
    newRule(btm, reduceRules, 'x^0==1', 'Zero Power', true, true);
    newRule(btm, reduceRules, 'x^(-a)==1/(x^a)', 'Negative Power', true, true);
    newRule(btm, reduceRules, '1^x==1', 'One to a Power', true, true);
    newRule(btm, reduceRules, '-1*x==-x', 'Multiplicative Identity', true, true);
    newRule(btm, reduceRules, 'x*-1==-x', 'Multiplicative Identity', true, true);
    newRule(btm, reduceRules, 'x-x==0', 'Additive Inverses Cancel', true, true);
    newRule(btm, reduceRules, 'x+-x==0', 'Additive Inverses Cancel', true, true);
    newRule(btm, reduceRules, '-x+x==0', 'Additive Inverses Cancel', true, true);
    newRule(btm, reduceRules, '(-x)+y==y-x', "Swap Leading Negative", true, true);
    newRule(btm, reduceRules, 'x+(-y)==x-y', "Subtraction", true, true);
    newRule(btm, reduceRules, '(-x)+(-y)==-(x+y)', "Factor Negation from Addition", true, true);
    newRule(btm, reduceRules, '(-x)-y==-(x+y)', "Factor Negation from Addition", true, true);
    newRule(btm, reduceRules, 'x-(-y)==x+y', "Additive Inverse's Inverse", true, true);
    newRule(btm, reduceRules, '(-x)*y==-(x*y)', "Factor Negation from Multiplication", true, true);
    newRule(btm, reduceRules, 'x*(-y)==-(x*y)', "Factor Negation from Multiplication", true, true);
    newRule(btm, reduceRules, '(-x)/y==-(x/y)', "Factor Negation from Multiplication", true, true);
    newRule(btm, reduceRules, 'x/(-y)==-(x/y)', "Factor Negation from Multiplication", true, true);
    newRule(btm, reduceRules, '-(-x)==x', "Additive Inverse's Inverse", true, true);
    newRule(btm, reduceRules, '/(/x)==x', "Multiplicative Inverse's Inverse", true, true);

    return(reduceRules);
}

function defaultSumReductions(btm) {
    var sumReductions = new Array();

    newRule(btm, sumReductions, 'a+0==a', 'Simplify Addition by Zero', true, true);
    newRule(btm, sumReductions, '0+a==a', 'Simplify Addition by Zero', true, true);
    newRule(btm, sumReductions, 'a-a==0', 'Cancel Additive Inverses', true, true);
    newRule(btm, sumReductions, 'a+-a==0', 'Cancel Additive Inverses', true, true);
    newRule(btm, sumReductions, '-a+a==0', 'Cancel Additive Inverses', true, true);
    newRule(btm, sumReductions, 'a*b+-a*b==0', 'Cancel Additive Inverses', true, true);
    newRule(btm, sumReductions, '-a*b+a*b==0', 'Cancel Additive Inverses', true, true);
    newRule(btm, sumReductions, 'a*(b+c)==a*b+a*c', 'Expand Products by Distributing', true, true);
    newRule(btm, sumReductions, '(a+b)*c==a*c+b*c', 'Expand Products by Distributing', true, true);
    newRule(btm, sumReductions, 'a*(b-c)==a*b-a*c', 'Expand Products by Distributing', true, true);
    newRule(btm, sumReductions, '(a-b)*c==a*c-b*c', 'Expand Products by Distributing', true, true);

    return(sumReductions);
}

function defaultProductReductions(btm) {
    var productReductions = new Array();

    newRule(btm, productReductions, '0*a==0', 'Simplify Multiplication by Zero', true, true);
    newRule(btm, productReductions, 'a*0==0', 'Simplify Multiplication by Zero', true, true);
    newRule(btm, productReductions, '1*a==a', 'Simplify Multiplication by One', true, true);
    newRule(btm, productReductions, 'a*1==a', 'Simplify Multiplication by One', true, true);
    newRule(btm, productReductions, 'a/a==1', 'Cancel Multiplicative Inverses', true, true);
    newRule(btm, productReductions, 'a*/a==1', 'Cancel Multiplicative Inverses', true, true);
    newRule(btm, productReductions, '/a*a==1', 'Cancel Multiplicative Inverses', true, true);
    newRule(btm, productReductions, '(a*b)/(a*c)==b/c', 'Cancel Common Factors', true,true);
    newRule(btm, productReductions, 'a^m/a^n==a^(m-n)', 'Cancel Common Factors', true,true);
    newRule(btm, productReductions, '(a^m*b)/(a^n*c)==(a^(m-n)*b)/c', 'Cancel Common Factors', true,true);
    newRule(btm, productReductions, 'a*a==a^2', 'Write Products of Common Terms as Powers', true, true);
    newRule(btm, productReductions, 'a*a^n==a^(n+1)', 'Write Products of Common Terms as Powers', true, true);
    newRule(btm, productReductions, 'a^n*a==a^(n+1)', 'Write Products of Common Terms as Powers', true, true);
    newRule(btm, productReductions, 'a^m*a^n==a^(m+n)', 'Write Products of Common Terms as Powers', true, true);
    newRule(btm, productReductions, '(a^-m*b)/c==b/(a^m*c)', 'Rewrite Using Positive Powers', true,true);
    newRule(btm, productReductions, '(b*a^-m)/c==b/(a^m*c)', 'Rewrite Using Positive Powers', true,true);
    newRule(btm, productReductions, 'b/(a^-m*c)==(a^m*b)/c', 'Rewrite Using Positive Powers', true,true);
    newRule(btm, productReductions, 'b/(c*a^-m)==(a^m*b)/c', 'Rewrite Using Positive Powers', true,true);

    return (productReductions);
  }

/***/ }),

/***/ 45706:
/*!*******************************************************!*\
  !*** ./runestone/fitb/js/libs/BTM/src/scalar_expr.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "scalar_expr": () => (/* binding */ scalar_expr)
/* harmony export */ });
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expression.js */ 55676);
/* harmony import */ var _real_number_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./real_number.js */ 22290);
/* harmony import */ var _rational_number_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./rational_number.js */ 66248);
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./BTM_root.js */ 63368);
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
    constructor(btm, number) {
        super(btm);
        this.type = _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__.exprType.number;
        if (typeof number == "object" &&
            (number.constructor.name === "rational_number"
              ||
             number.constructor.name === "real_number")
            )
        {
            this.number = number;
        } else if (Math.floor(number)==number) {
            this.number = new _rational_number_js__WEBPACK_IMPORTED_MODULE_2__.rational_number(number, 1);
        } else {
            this.number = new _real_number_js__WEBPACK_IMPORTED_MODULE_1__.real_number(number);
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
        if (!this.btm.options.negativeNumbers && this.number.p < 0) {
            var theNumber = this.number.multiply(-1);
            retValue = new unop_expr(this.btm, '-', new scalar_expr(this.btm, theNumber));
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
        return(new scalar_expr(this.btm, this.number));
    }
    
    compose(bindings) {
        return(new scalar_expr(this.btm, this.number));
    }
    
    derivative(ivar, varList) {
        return(new scalar_expr(this.btm, 0));
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
            var testExpr = this.btm.parse(expr.toString(), expr.context).simplifyConstants();
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

/***/ 87521:
/*!*****************************************************!*\
  !*** ./runestone/fitb/js/libs/BTM/src/unop_expr.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "unop_expr": () => (/* binding */ unop_expr)
/* harmony export */ });
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expression.js */ 55676);
/* harmony import */ var _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scalar_expr.js */ 45706);
/* harmony import */ var _binop_expr_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./binop_expr.js */ 14715);
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./BTM_root.js */ 63368);
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
    constructor(btm, op, input) {
        super(btm);
        this.type = _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__.exprType.unop;
        this.op = op;
        if (typeof input == 'undefined')
            input = new _expression_js__WEBPACK_IMPORTED_MODULE_0__.expression();
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
                    if (options.negativeNumbers) {
                    retVal = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, theNumber.addInverse());
                    } else {
                    retVal = this;
                    }
                    break;
                case '/':
                    retVal = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, theNumber.multInverse());
                    break;
            }
        } else {
            retVal = this;
        }
        return(retVal);
    }

    flatten() {
      return(new unop_expr(this.btm, this.op, this.inputs[0].flatten()));
    }

    copy() {
      return(new unop_expr(this.btm, this.op, this.inputs[0].copy()));
    }

    compose(bindings) {
        return(new unop_expr(this.btm, this.op, this.inputs[0].compose(bindings)));
    }

    derivative(ivar, varList) {
        var theDeriv;

        var uConst = this.inputs[0].isConstant();
        if (uConst) {
            theDeriv = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 0);
        } else {
            switch (this.op) {
                case '+':
                    theDeriv = this.inputs[0].derivative(ivar, varList);
                    break;
                case '-':
                    theDeriv = new unop_expr(this.btm, '-', this.inputs[0].derivative(ivar, varList));
                    break;
                case '/':
                    var denom = new _binop_expr_js__WEBPACK_IMPORTED_MODULE_2__.binop_expr(this.btm, '*', this.inputs[0], this.inputs[0]);
                    theDeriv = new unop_expr(this.btm, '-', new _binop_expr_js__WEBPACK_IMPORTED_MODULE_2__.binop_expr(this.btm, '/', this.inputs[0].derivative(ivar, varList), denom));
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

/***/ 41487:
/*!*********************************************************!*\
  !*** ./runestone/fitb/js/libs/BTM/src/variable_expr.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "index_expr": () => (/* binding */ index_expr),
/* harmony export */   "variable_expr": () => (/* binding */ variable_expr)
/* harmony export */ });
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expression.js */ 55676);
/* harmony import */ var _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scalar_expr.js */ 45706);
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BTM_root.js */ 63368);
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
    constructor(btm, name) {
        super(btm);
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
            retVal = bindings[this.name];
        }

        return(retVal);
    }

    copy() {
        return(new variable_expr(this.btm, this.name));
    }

    compose(bindings) {
        var retVal;

        if (bindings[this.name] == undefined) {
            retVal = new variable_expr(this.btm, this.name);
        } else {
            if (typeof bindings[this.name] == "string") {
                retVal = this.btm.parse(bindings[this.name], "formula");
            } else {
                retVal = bindings[this.name];
            }
        }

        return(retVal);
    }

    derivative(ivar, varList) {
        var retVal;
        var ivarName = (typeof ivar == 'string') ? ivar : ivar.name;

        if (this.name === ivarName) {
            retVal = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 1);

        // If either a constant or another independent variable, deriv=0
        } else if (this.isConst || varList && varList[this.name] != undefined) {
            retVal = new _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__.scalar_expr(this.btm, 0);

        // Presuming other variables are dependent variables.
        } else  {
            retVal = new variable_expr(this.btm, this.name+"'");
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
    
    constructor(btm, name, index) {
        this.btm = btm;
        if (!(btm instanceof BTM)) {
            console.log("variable_expr constructed with invalid environment")
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2ZpdGJfanNfbGlic19CVE1fc3JjX0JUTV9yb290X2pzLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUV5STtBQUMxRjtBQUNnQjtBQUNwQjtBQUNFO0FBQ0k7QUFDRTtBQUNOO0FBQ1o7QUFDWTs7QUFFdEM7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTyxvQkFBb0I7O0FBRXBCO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QiwwREFBWTtBQUN4QywwQkFBMEIsc0RBQVU7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsMkNBQUc7QUFDMUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFD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O0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7O0FBRXBCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQSxRQUFRLFFBQVE7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7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QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIseURBQWU7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRU87QUFDUDtBQUNBLDZCQUE2Qiw2Q0FBRztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsMkRBQWlCO0FBQzFDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwQkFBMEIsaUJBQWlCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsa0JBQWtCLGtCQUFrQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isa0JBQWtCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHdCQUF3QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsS0FBSztBQUMvQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsMEJBQTBCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsS0FBSztBQUMvQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNB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RUE7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLGlCQUFpQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvbGlicy9CVE0vc3JjL0JUTV9yb290LmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9saWJzL0JUTS9zcmMvYmlub3BfZXhwci5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvbGlicy9CVE0vc3JjL2Rlcml2X2V4cHIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2pzL2xpYnMvQlRNL3NyYy9leHByZXNzaW9uLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9saWJzL0JUTS9zcmMvZnVuY3Rpb25fZXhwci5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvbGlicy9CVE0vc3JjL211bHRpb3BfZXhwci5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvbGlicy9CVE0vc3JjL3JhbmRvbS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvbGlicy9CVE0vc3JjL3JhdGlvbmFsX251bWJlci5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvbGlicy9CVE0vc3JjL3JlYWxfbnVtYmVyLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9saWJzL0JUTS9zcmMvcmVkdWN0aW9ucy5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvbGlicy9CVE0vc3JjL3NjYWxhcl9leHByLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9saWJzL0JUTS9zcmMvdW5vcF9leHByLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9saWJzL0JUTS9zcmMvdmFyaWFibGVfZXhwci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEJUTSBKYXZhU2NyaXB0IExpYnJhcnkgdkBWRVJTSU9OXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGJyaWFud2FsdG9uL0JUTVxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKlxuKiogRXZhbHVhdGluZyBleHByZXNzaW9ucyBvY2N1cnMgaW4gdGhlIGNvbnRleHQgb2YgYSBCVE0gZW52aXJvbm1lbnQuXG4qKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmltcG9ydCB7IGRlZmF1bHRSZWR1Y3Rpb25zLCBkZWZhdWx0U3VtUmVkdWN0aW9ucywgZGVmYXVsdFByb2R1Y3RSZWR1Y3Rpb25zLCBkaXNhYmxlUnVsZSwgbmV3UnVsZSwgZmluZE1hdGNoUnVsZXMgfSBmcm9tIFwiLi9yZWR1Y3Rpb25zLmpzXCJcbmltcG9ydCB7IHNjYWxhcl9leHByIH0gZnJvbSBcIi4vc2NhbGFyX2V4cHIuanNcIjtcbmltcG9ydCB7IHZhcmlhYmxlX2V4cHIsIGluZGV4X2V4cHIgfSBmcm9tIFwiLi92YXJpYWJsZV9leHByLmpzXCI7XG5pbXBvcnQgeyB1bm9wX2V4cHIgfSBmcm9tIFwiLi91bm9wX2V4cHIuanNcIjtcbmltcG9ydCB7IGJpbm9wX2V4cHIgfSBmcm9tIFwiLi9iaW5vcF9leHByLmpzXCI7XG5pbXBvcnQgeyBtdWx0aW9wX2V4cHIgfSBmcm9tIFwiLi9tdWx0aW9wX2V4cHIuanNcIjtcbmltcG9ydCB7IGZ1bmN0aW9uX2V4cHIgfSBmcm9tIFwiLi9mdW5jdGlvbl9leHByLmpzXCI7XG5pbXBvcnQgeyBkZXJpdl9leHByIH0gZnJvbSBcIi4vZGVyaXZfZXhwci5qc1wiO1xuaW1wb3J0IHsgUk5HIH0gZnJvbSBcIi4vcmFuZG9tLmpzXCJcbmltcG9ydCB7IGV4cHJlc3Npb24gfSBmcm9tIFwiLi9leHByZXNzaW9uLmpzXCI7XG5cbmV4cG9ydCBjb25zdCBvcFByZWMgPSB7XG4gICAgZGlzajogMCxcbiAgICBjb25qOiAxLFxuICAgIGVxdWFsOiAyLFxuICAgIGFkZHN1YjogMyxcbiAgICBtdWx0ZGl2OiA0LFxuICAgIHBvd2VyOiA1LFxuICAgIGZjbjogNixcbiAgICBmb3A6IDdcbn07XG5cbmV4cG9ydCBjb25zdCBleHByVHlwZSA9IHtcbiAgICBudW1iZXI6IDAsXG4gICAgdmFyaWFibGU6IDEsXG4gICAgZmNuOiAyLFxuICAgIHVub3A6IDMsXG4gICAgYmlub3A6IDQsXG4gICAgbXVsdGlvcDogNSxcbiAgICBvcGVyYXRvcjogNixcbiAgICBhcnJheTogNyxcbiAgICBtYXRyaXg6IDhcbn07XG5cbmV4cG9ydCBjb25zdCBleHByVmFsdWUgPSB7IHVuZGVmOiAtMSwgYm9vbCA6IDAsIG51bWVyaWMgOiAxIH07XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1RlWChleHByKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBleHByLnRvVGVYID09PSBcImZ1bmN0aW9uXCIgPyBleHByLnRvVGVYKCkgOiBleHByO1xufVxuXG5leHBvcnQgY2xhc3MgQlRNIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncykge1xuICAgICAgICBpZiAoc2V0dGluZ3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0dGluZ3MgPSB7fTtcbiAgICAgICAgICAgIHNldHRpbmdzLnNlZWQgPSAnMTIzNCc7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRWFjaCBpbnN0YW5jZSBvZiBCVE0gZW52aXJvbm1lbnQgbmVlZHMgYmluZGluZ3MgYWNyb3NzIGFsbCBleHByZXNzaW9ucy5cbiAgICAgICAgdGhpcy5yYW5kb21CaW5kaW5ncyA9IHt9O1xuICAgICAgICB0aGlzLmJpbmRpbmdzID0ge307XG4gICAgICAgIHRoaXMuZGF0YSA9IHt9O1xuICAgICAgICB0aGlzLmRhdGEuYWxsVmFsdWVzID0ge307XG4gICAgICAgIHRoaXMuZGF0YS5wYXJhbXMgPSB7fTtcbiAgICAgICAgdGhpcy5kYXRhLnZhcmlhYmxlcyA9IHt9O1xuICAgICAgICB0aGlzLmRhdGEuZXhwcmVzc2lvbnMgPSB7fTtcbiAgICAgICAgdGhpcy5vcFByZWMgPSBvcFByZWM7XG4gICAgICAgIHRoaXMuZXhwclR5cGUgPSBleHByVHlwZTtcbiAgICAgICAgdGhpcy5leHByVmFsdWUgPSBleHByVmFsdWU7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG5lZ2F0aXZlTnVtYmVyczogdHJ1ZSxcbiAgICAgICAgICAgIGFic1RvbDogMWUtOCxcbiAgICAgICAgICAgIHJlbFRvbDogMWUtNCxcbiAgICAgICAgICAgIHVzZVJlbEVycjogdHJ1ZSxcbiAgICAgICAgICAgIGRvRmxhdHRlbjogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZXRSZWR1Y3Rpb25SdWxlcygpO1xuICAgICAgICB0aGlzLm11bHRpb3BfZXhwciA9IG11bHRpb3BfZXhwcjtcbiAgICAgICAgdGhpcy5iaW5vcF9leHByID0gYmlub3BfZXhwcjtcblxuICAgICAgICAvLyBHZW5lcmF0ZSBhIHJhbmRvbSBnZW5lcmF0b3IuIFdlIG1pZ2h0IGJlIHBhc3NlZCBlaXRoZXIgYSBwcmUtc2VlZGVkIGByYW5kYCBmdW5jdGlvbiBvciBhIHNlZWQgZm9yIG91ciBvd24uXG4gICAgICAgIGxldCBybmdPcHRpb25zID0ge307XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0dGluZ3MucmFuZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJuZ09wdGlvbnMucmFuZCA9IHNldHRpbmdzLnJhbmQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBzZXR0aW5ncy5zZWVkICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcm5nT3B0aW9ucy5zZWVkID0gc2V0dGluZ3Muc2VlZDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJuZyA9IG5ldyBSTkcocm5nT3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLy8gUGVyZm9ybSBhcHByb3hpbWF0ZSBjb21wYXJpc29uIHRlc3RzIHVzaW5nIGVudmlyb25tZW50IHNldHRpbmdzXG4gICAgLy8gYSA8IGI6IC0xXG4gICAgLy8gYSB+PSBiOiAwXG4gICAgLy8gYSA+IGI6IDFcbiAgICBudW1iZXJDbXAoYSxiLG92ZXJyaWRlKSB7XG4gICAgICAgIC8vIFdvcmsgd2l0aCBhY3R1YWwgdmFsdWVzLlxuICAgICAgICB2YXIgdmFsQSwgdmFsQiwgY21wUmVzdWx0O1xuICAgICAgICB2YXIgdXNlUmVsRXJyID0gdGhpcy5vcHRpb25zLnVzZVJlbEVycixcbiAgICAgICAgICAgIHJlbFRvbCA9IHRoaXMub3B0aW9ucy5yZWxUb2wsXG4gICAgICAgICAgICBhYnNUb2wgPSB0aGlzLm9wdGlvbnMuYWJzVG9sO1xuXG4gICAgICAgIGlmICh0eXBlb2YgYSA9PT0gJ251bWJlcicgfHwgdHlwZW9mIGEgPT09ICdOdW1iZXInKSB7XG4gICAgICAgICAgICB2YWxBID0gYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbEEgPSBhLnZhbHVlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBiID09PSAnbnVtYmVyJyB8fCB0eXBlb2YgYiA9PT0gJ051bWJlcicpIHtcbiAgICAgICAgICAgIHZhbEIgPSBiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsQiA9IGIudmFsdWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFB1bGwgb3V0IHRoZSBvcHRpb25zLlxuICAgICAgICBpZiAodHlwZW9mIG92ZXJyaWRlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvdmVycmlkZS51c2VSZWxFcnIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgdXNlUmVsRXJyID0gb3ZlcnJpZGUudXNlUmVsRXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvdmVycmlkZS5yZWxUb2wgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmVsVG9sID0gb3ZlcnJpZGUucmVsVG9sO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvdmVycmlkZS5hYnNUb2wgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgYWJzVG9sID0gb3ZlcnJpZGUuYWJzVG9sO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF1c2VSZWxFcnIgfHwgTWF0aC5hYnModmFsQSkgPCBhYnNUb2wpIHtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyh2YWxCLXZhbEEpIDwgYWJzVG9sKSB7XG4gICAgICAgICAgICAgICAgY21wUmVzdWx0ID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsQSA8IHZhbEIpIHtcbiAgICAgICAgICAgICAgICBjbXBSZXN1bHQgPSAtMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY21wUmVzdWx0ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyh2YWxCLXZhbEEpL01hdGguYWJzKHZhbEEpIDwgcmVsVG9sKSB7XG4gICAgICAgICAgICAgICAgY21wUmVzdWx0ID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsQSA8IHZhbEIpIHtcbiAgICAgICAgICAgICAgICBjbXBSZXN1bHQgPSAtMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY21wUmVzdWx0ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY21wUmVzdWx0O1xuICAgIH1cblxuICAgIC8qIEJsb2NrIG9mIG1ldGhvZHMgdG8gZGVhbCB3aXRoIHJlZHVjdGlvbiBydWxlcyBpbiBjb250ZXh0ICovXG4gICAgc2V0UmVkdWN0aW9uUnVsZXMoKSB7XG4gICAgICAgIHRoaXMucmVkdWNlUnVsZXMgPSBkZWZhdWx0UmVkdWN0aW9ucyh0aGlzKTtcbiAgICB9XG5cbiAgICBhZGRSZWR1Y3Rpb25SdWxlKGVxdWF0aW9uLCBkZXNjcmlwdGlvbiwgdXNlT25lV2F5KSB7XG4gICAgICAgIG5ld1J1bGUodGhpcywgdGhpcy5yZWR1Y2VSdWxlcywgZXF1YXRpb24sIGRlc2NyaXB0aW9uLCB0cnVlLCB1c2VPbmVXYXkpO1xuICAgIH1cblxuICAgIGRpc2FibGVSZWR1Y3Rpb25SdWxlKGVxdWF0aW9uKSB7XG4gICAgICAgIGRpc2FibGVSdWxlKHRoaXMsIHRoaXMucmVkdWNlUnVsZXMsIGVxdWF0aW9uKTtcbiAgICB9XG5cbiAgICBhZGRSdWxlKHJ1bGVMaXN0LCBlcXVhdGlvbiwgZGVzY3JpcHRpb24sIHVzZU9uZVdheSl7XG4gICAgICAgIG5ld1J1bGUodGhpcywgcnVsZUxpc3QsIGVxdWF0aW9uLCBkZXNjcmlwdGlvbiwgdHJ1ZSwgdXNlT25lV2F5KTtcbiAgICB9XG5cbiAgICBmaW5kTWF0Y2hSdWxlcyhyZWR1Y3Rpb25MaXN0LCB0ZXN0RXhwciwgZG9WYWxpZGF0ZSkge1xuICAgICAgICByZXR1cm4gZmluZE1hdGNoUnVsZXMocmVkdWN0aW9uTGlzdCwgdGVzdEV4cHIsIGRvVmFsaWRhdGUpO1xuICAgIH1cblxuICAgIGFkZE1hdGhPYmplY3QobmFtZSwgY29udGV4dCwgbmV3T2JqZWN0KSB7XG4gICAgICAgIHN3aXRjaChjb250ZXh0KSB7XG4gICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgICAgIGlmIChuZXdPYmplY3QuaXNDb25zdGFudCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5wYXJhbXNbbmFtZV0gPSBuZXdPYmplY3Q7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5hbGxWYWx1ZXNbbmFtZV0gPSBuZXdPYmplY3Q7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYEF0dGVtcHQgdG8gYWRkIG1hdGggb2JqZWN0ICcke25hbWV9JyB3aXRoIGNvbnRleHQgJyR7Y29udGV4dH0nIHRoYXQgZG9lcyBub3QgbWF0Y2guYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdmb3JtdWxhJzpcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuYWxsVmFsdWVzW25hbWVdID0gbmV3T2JqZWN0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdPYmplY3Q7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVSYW5kb20oZGlzdHIsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHJuZFZhbCwgcm5kU2NhbGFyO1xuXG4gICAgICAgIHN3aXRjaCAoZGlzdHIpIHtcbiAgICAgICAgICAgIGNhc2UgJ2Rpc2NyZXRlJzpcbiAgICAgICAgICAgICAgICBsZXQgTnZhbHMgPSBNYXRoLmZsb29yKChvcHRpb25zLm1heC1vcHRpb25zLm1pbikgLyBvcHRpb25zLmJ5KSsxO1xuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgcm5kVmFsID0gb3B0aW9ucy5taW4gKyBvcHRpb25zLmJ5ICogdGhpcy5ybmcucmFuZEludCgwLE52YWxzLTEpO1xuICAgICAgICAgICAgICAgIH0gd2hpbGUgKG9wdGlvbnMubm9uemVybyAmJiBNYXRoLmFicyhybmRWYWwpIDwgdGhpcy5vcHRpb25zLmFic1RvbCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcm5kU2NhbGFyID0gbmV3IHNjYWxhcl9leHByKHRoaXMsIHJuZFZhbCk7XG4gICAgICAgIHJldHVybiBybmRTY2FsYXI7XG4gICAgfVxuXG4gICAgYWRkUGFyYW1ldGVyKG5hbWUsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIG5ld1BhcmFtO1xuICAgICAgICBsZXQgcHJlYyA9IG9wdGlvbnMucHJlYztcbiAgICAgICAgaWYgKG9wdGlvbnMubW9kZSA9PT0gJ3JhbmRvbScpIHtcbiAgICAgICAgICAgIGxldCBkaXN0ciA9IG9wdGlvbnMuZGlzdHI7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGRpc3RyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGRpc3RyID0gJ2Rpc2NyZXRlX3JhbmdlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAoZGlzdHIpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdkaXNjcmV0ZV9yYW5nZSc6XG4gICAgICAgICAgICAgICAgbGV0IE52YWxzID0gTWF0aC5mbG9vcigob3B0aW9ucy5tYXgtb3B0aW9ucy5taW4pIC8gb3B0aW9ucy5ieSkrMTtcbiAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1BhcmFtID0gb3B0aW9ucy5taW4gKyBvcHRpb25zLmJ5ICogdGhpcy5ybmcucmFuZEludCgwLE52YWxzLTEpO1xuICAgICAgICAgICAgICAgIH0gd2hpbGUgKG9wdGlvbnMubm9uemVybyAmJiBNYXRoLmFicyhuZXdQYXJhbSkgPCB0aGlzLm9wdGlvbnMuYWJzVG9sKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLm1vZGUgPT0gJ2NhbGN1bGF0ZScpIHtcbiAgICAgICAgICAgIG5ld1BhcmFtID0gdGhpcy5wYXJzZShvcHRpb25zLmZvcm11bGEsIFwibnVtYmVyXCIpLmV2YWx1YXRlKHRoaXMuZGF0YS5wYXJhbXMpO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMubW9kZSA9PSAncmF0aW9uYWwnKSB7XG4gICAgICAgICAgICBuZXdQYXJhbSA9IHRoaXMucGFyc2UobmV3IHJhdGlvbmFsX251bWJlcihvcHRpb25zLm51bWVyLG9wdGlvbnMuZGVub20pLnRvU3RyaW5nKCksIFwibnVtYmVyXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMubW9kZSA9PSAnc3RhdGljJykge1xuICAgICAgICAgICAgbmV3UGFyYW0gPSBvcHRpb25zLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgcHJlYyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIG5ld1BhcmFtID0gTWF0aC5yb3VuZChuZXdQYXJhbS9wcmVjKSAvIE1hdGgucm91bmQoMS9wcmVjKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRhdGEucGFyYW1zW25hbWVdID0gbmV3UGFyYW07XG4gICAgICAgIHRoaXMuZGF0YS5hbGxWYWx1ZXNbbmFtZV0gPSBuZXdQYXJhbTtcblxuICAgICAgICByZXR1cm4gbmV3UGFyYW07XG4gICAgfVxuXG4gICAgYWRkVmFyaWFibGUobmFtZSwgb3B0aW9ucykge1xuICAgICAgICB2YXIgbmV3VmFyID0gbmV3IHZhcmlhYmxlX2V4cHIobmFtZSk7XG5cbiAgICAgICAgdGhpcy5kYXRhLnZhcmlhYmxlc1tuYW1lXSA9IG5ld1ZhcjtcbiAgICAgICAgdGhpcy5kYXRhLmFsbFZhbHVlc1tuYW1lXSA9IG5ld1ZhcjtcblxuICAgICAgICByZXR1cm4gbmV3VmFyO1xuICAgIH1cblxuICAgIGV2YWx1YXRlTWF0aE9iamVjdChtYXRoT2JqZWN0LCBjb250ZXh0LCBiaW5kaW5ncykge1xuICAgICAgICB2YXIgdGhlRXhwciwgbmV3RXhwciwgcmV0VmFsdWU7XG4gICAgICAgIC8vIE5vdCB5ZXQgcGFyc2VkXG4gICAgICAgIGlmICh0eXBlb2YgbWF0aE9iamVjdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhciBmb3JtdWxhID0gdGhpcy5kZWNvZGVGb3JtdWxhKG1hdGhPYmplY3QpO1xuICAgICAgICAgICAgdGhlRXhwciA9IHRoaXMucGFyc2UoZm9ybXVsYSwgXCJmb3JtdWxhXCIpO1xuICAgICAgICAvLyBBbHJlYWR5IHBhcnNlZFxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBtYXRoT2JqZWN0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGhlRXhwciA9IG1hdGhPYmplY3Q7XG4gICAgICAgIH1cbiAgICAgICAgcmV0VmFsdWUgPSB0aGVFeHByLmV2YWx1YXRlKGJpbmRpbmdzKTtcbiAgICAgICAgbmV3RXhwciA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLCByZXRWYWx1ZSk7XG4gICAgICAgIHJldHVybiBuZXdFeHByO1xuICAgIH1cblxuICAgIHBhcnNlRXhwcmVzc2lvbihleHByZXNzaW9uLCBjb250ZXh0KSB7XG4gICAgICAgIHZhciBuZXdFeHByO1xuICAgICAgICAvLyBOb3QgeWV0IHBhcnNlZFxuICAgICAgICBpZiAodHlwZW9mIGV4cHJlc3Npb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHZhciBmb3JtdWxhID0gdGhpcy5kZWNvZGVGb3JtdWxhKGV4cHJlc3Npb24pO1xuICAgICAgICBuZXdFeHByID0gdGhpcy5wYXJzZShmb3JtdWxhLCBjb250ZXh0KTtcbiAgICAgICAgLy8gQWxyZWFkeSBwYXJzZWRcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwcmVzc2lvbiA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIG5ld0V4cHIgPSBleHByZXNzaW9uO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdFeHByO1xuICAgIH1cblxuICAgIGFkZEV4cHJlc3Npb24obmFtZSwgZXhwcmVzc2lvbikge1xuICAgICAgICB2YXIgbmV3RXhwciA9IHRoaXMucGFyc2VFeHByZXNzaW9uKGV4cHJlc3Npb24sIFwiZm9ybXVsYVwiKTtcblxuICAgICAgICB0aGlzLmRhdGEuZXhwcmVzc2lvbnNbbmFtZV0gPSBuZXdFeHByO1xuICAgICAgICB0aGlzLmRhdGEuYWxsVmFsdWVzW25hbWVdID0gbmV3RXhwcjtcblxuICAgICAgICByZXR1cm4gbmV3RXhwcjtcbiAgICB9XG5cbiAgICAvLyBUaGlzIHJvdXRpbmUgdGFrZXMgdGhlIHRleHQgYW5kIGxvb2tzIGZvciBzdHJpbmdzIGluIG11c3RhY2hlcyB7e25hbWV9fVxuICAgIC8vIEl0IHJlcGxhY2VzIHRoaXMgZWxlbWVudCB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIHBhcmFtZXRlciwgdmFyaWFibGUsIG9yIGV4cHJlc3Npb24uXG4gICAgLy8gVGhlc2Ugc2hvdWxkIGhhdmUgYmVlbiBwcmV2aW91c2x5IHBhcnNlZCBhbmQgc3RvcmVkIGluIHRoaXMuZGF0YS5cbiAgICBkZWNvZGVGb3JtdWxhKHN0YXRlbWVudCwgZGlzcGxheU1vZGUpIHtcbiAgICAgICAgLy8gRmlyc3QgZmluZCBhbGwgb2YgdGhlIGV4cGVjdGVkIHN1YnN0aXR1dGlvbnMuXG4gICAgICAgIHZhciBzdWJzdFJlcXVlc3RMaXN0ID0ge307XG4gICAgICAgIHZhciBtYXRjaFJFID0gL1xce1xce1tBLVphLXpdXFx3KlxcfVxcfS9nO1xuICAgICAgICB2YXIgc3Vic3RNYXRjaGVzID0gc3RhdGVtZW50Lm1hdGNoKG1hdGNoUkUpO1xuICAgICAgICBpZiAoc3Vic3RNYXRjaGVzICE9IG51bGwpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxzdWJzdE1hdGNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2hOYW1lID0gc3Vic3RNYXRjaGVzW2ldO1xuICAgICAgICAgICAgICAgIG1hdGNoTmFtZSA9IG1hdGNoTmFtZS5zdWJzdHIoMixtYXRjaE5hbWUubGVuZ3RoLTQpO1xuICAgICAgICAgICAgICAgIC8vIE5vdyBzZWUgaWYgdGhlIG5hbWUgaXMgaW4gb3VyIHN1YnN0aXR1dGlvbiBydWxlcy5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhLmFsbFZhbHVlc1ttYXRjaE5hbWVdICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzcGxheU1vZGUgIT0gdW5kZWZpbmVkICYmIGRpc3BsYXlNb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzdFJlcXVlc3RMaXN0W21hdGNoTmFtZV0gPSAneycrdGhpcy5kYXRhLmFsbFZhbHVlc1ttYXRjaE5hbWVdLnRvVGVYKCkrJ30nO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic3RSZXF1ZXN0TGlzdFttYXRjaE5hbWVdID0gJygnK3RoaXMuZGF0YS5hbGxWYWx1ZXNbbWF0Y2hOYW1lXS50b1N0cmluZygpKycpJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdlIGFyZSBub3cgcmVhZHkgdG8gbWFrZSB0aGUgc3Vic3RpdHV0aW9ucy5cbiAgICAgICAgdmFyIHJldFN0cmluZyA9IHN0YXRlbWVudDtcbiAgICAgICAgZm9yICh2YXIgbWF0Y2ggaW4gc3Vic3RSZXF1ZXN0TGlzdCkge1xuICAgICAgICAgICAgdmFyIHJlID0gbmV3IFJlZ0V4cChcInt7XCIgKyBtYXRjaCArIFwifX1cIiwgXCJnXCIpO1xuICAgICAgICAgICAgdmFyIHN1YnN0ID0gc3Vic3RSZXF1ZXN0TGlzdFttYXRjaF07XG4gICAgICAgICAgICByZXRTdHJpbmcgPSByZXRTdHJpbmcucmVwbGFjZShyZSwgc3Vic3QpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXRTdHJpbmc7XG4gICAgfVxuXG4gICAgY29tcGFyZUV4cHJlc3Npb25zKGV4cHIxLCBleHByMikge1xuICAgICAgICBpZiAodHlwZW9mIGV4cHIxID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZXhwcjEgPSB0aGlzLnBhcnNlKGV4cHIxLCBcImZvcm11bGFcIilcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGV4cHIyID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZXhwcjIgPSB0aGlzLnBhcnNlKGV4cHIyLCBcImZvcm11bGFcIilcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKGV4cHIxLmNvbXBhcmUoZXhwcjIpKTtcbiAgICB9XG5cbiAgICBnZXRQYXJzZXIoY29udGV4dCkge1xuICAgICAgICB2YXIgc2VsZj10aGlzLFxuICAgICAgICAgICAgcGFyc2VDb250ZXh0PWNvbnRleHQ7XG4gICAgICAgIHJldHVybiAoZnVuY3Rpb24oZXhwclN0cmluZyl7IHJldHVybiBzZWxmLnBhcnNlKGV4cHJTdHJpbmcsIHBhcnNlQ29udGV4dCk7IH0pXG4gICAgfVxuXG4gIC8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICBidG0ucGFyc2UoKSBpcyB0aGUgd29ya2hvcnNlLlxuXG4gICAgICBUYWtlIGEgc3RyaW5nIHJlcHJlc2VudGluZyBhIGZvcm11bGEsIGFuZCBkZWNvbXBvc2UgaXQgaW50byBhbiBhcHByb3ByaWF0ZVxuICAgICAgdHJlZSBzdHJ1Y3R1cmUgc3VpdGFibGUgZm9yIHJlY3Vyc2l2ZSBldmFsdWF0aW9uIG9mIHRoZSBmdW5jdGlvbi5cbiAgICAgIFJldHVybnMgdGhlIHJvb3QgZWxlbWVudCB0byB0aGUgdHJlZS5cbiAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgcGFyc2UoZm9ybXVsYVN0ciwgY29udGV4dCwgYmluZGluZ3MsIG9wdGlvbnMpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgY29udGV4dCA9IFwiZm9ybXVsYVwiO1xuICAgIH1cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHtcbiAgICAgIGJpbmRpbmdzID0ge307XG4gICAgfVxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgNCkge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIGNvbnN0IG51bWJlck1hdGNoID0gL1xcZHwoXFwuXFxkKS87XG4gICAgY29uc3QgbmFtZU1hdGNoID0gL1thLXpBLVpdLztcbiAgICBjb25zdCB1bm9wTWF0Y2ggPSAvW1xcK1xcLS9dLztcbiAgICBjb25zdCBvcE1hdGNoID0gL1tcXCtcXC0qL149XFwkJl0vO1xuXG4gICAgdmFyIGNoYXJQb3MgPSAwLCBlbmRQb3M7XG4gICAgdmFyIHBhcnNlRXJyb3IgPSAnJztcblxuICAgIC8vIFN0cmlwIGFueSBleHRyYW5lb3VzIHdoaXRlIHNwYWNlIGFuZCBwYXJlbnRoZXNlcy5cbiAgICB2YXIgd29ya2luZ1N0cjtcbiAgICB3b3JraW5nU3RyID0gZm9ybXVsYVN0ci50cmltKCk7XG5cbiAgICAvLyBUZXN0IGlmIHBhcmVudGhlc2VzIGFyZSBhbGwgYmFsYW5jZWQuXG4gICAgdmFyIGhhc0V4dHJhUGFyZW5zID0gdHJ1ZTtcbiAgICB3aGlsZSAoaGFzRXh0cmFQYXJlbnMpIHtcbiAgICAgIGhhc0V4dHJhUGFyZW5zID0gZmFsc2U7XG4gICAgICBpZiAod29ya2luZ1N0ci5jaGFyQXQoMCkgPT0gJygnKSB7XG4gICAgICAgIHZhciBlbmRFeHByID0gY29tcGxldGVQYXJlbnRoZXNpcyh3b3JraW5nU3RyLCAwKTtcbiAgICAgICAgaWYgKGVuZEV4cHIrMSA+PSB3b3JraW5nU3RyLmxlbmd0aCkge1xuICAgICAgICAgIGhhc0V4dHJhUGFyZW5zID0gdHJ1ZTtcbiAgICAgICAgICB3b3JraW5nU3RyID0gd29ya2luZ1N0ci5zbGljZSgxLC0xKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdlIGJ1aWxkIHRoZSB0cmVlIGFzIGl0IGlzIHBhcnNlZC5cbiAgICAvLyBUd28gc3RhY2tzIGtlZXAgdHJhY2sgb2Ygb3BlcmFuZHMgKGV4cHJlc3Npb25zKSBhbmQgb3BlcmF0b3JzXG4gICAgLy8gd2hpY2ggd2Ugd2lsbCBpZGVudGlmeSBhcyB0aGUgc3RyaW5nIGlzIHBhcnNlZCBsZWZ0IHRvIHJpZ2h0XG4gICAgLy8gQXQgdGhlIHRpbWUgYW4gb3BlcmFuZCBpcyBwYXJzZWQsIHdlIGRvbid0IGtub3cgdG8gd2hpY2ggb3BlcmF0b3JcbiAgICAvLyBpdCB1bHRpbWF0ZWx5IGJlbG9uZ3MsIHNvIHdlIHB1c2ggaXQgb250byBhIHN0YWNrIHVudGlsIHdlIGtub3cuXG4gICAgdmFyIG9wZXJhbmRTdGFjayA9IG5ldyBBcnJheSgpO1xuICAgIHZhciBvcGVyYXRvclN0YWNrID0gbmV3IEFycmF5KCk7XG5cbiAgICAvLyBXaGVuIGFuIG9wZXJhdG9yIGlzIHB1c2hlZCwgd2Ugd2FudCB0byBjb21wYXJlIGl0IHRvIHRoZSBwcmV2aW91cyBvcGVyYXRvclxuICAgIC8vIGFuZCBzZWUgaWYgd2UgbmVlZCB0byBhcHBseSB0aGUgb3BlcmF0b3JzIHRvIHNvbWUgb3BlcmFuZHMuXG4gICAgLy8gVGhpcyBpcyBiYXNlZCBvbiBvcGVyYXRvciBwcmVjZWRlbmNlIChvcmRlciBvZiBvcGVyYXRpb25zKS5cbiAgICAvLyBBbiBlbXB0eSBuZXdPcCBtZWFucyB0byBmaW5pc2ggcmVzb2x2ZSB0aGUgcmVzdCBvZiB0aGUgc3RhY2tzLlxuICAgIGZ1bmN0aW9uIHJlc29sdmVPcGVyYXRvcihidG0sIG9wZXJhdG9yU3RhY2ssIG9wZXJhbmRTdGFjaywgbmV3T3ApIHtcbiAgICAgIC8vIFRlc3QgaWYgdGhlIG9wZXJhdG9yIGhhcyBsb3dlciBwcmVjZWRlbmNlLlxuICAgICAgdmFyIG9sZE9wID0gMDtcbiAgICAgIHdoaWxlIChvcGVyYXRvclN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgb2xkT3AgPSBvcGVyYXRvclN0YWNrLnBvcCgpO1xuICAgICAgICBpZiAobmV3T3AgJiYgKG5ld09wLnR5cGU9PWV4cHJUeXBlLnVub3AgfHwgb2xkT3AucHJlYyA8IG5ld09wLnByZWMpKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRvIGdldCBoZXJlLCB0aGUgbmV3IG9wZXJhdG9yIG11c3QgYmUgKmJpbmFyeSpcbiAgICAgICAgLy8gYW5kIHRoZSBvcGVyYXRvciB0byB0aGUgbGVmdCBoYXMgKmhpZ2hlciogcHJlY2VkZW5jZS5cbiAgICAgICAgLy8gU28gd2UgbmVlZCB0byBwZWVsIG9mZiB0aGUgb3BlcmF0b3IgdG8gdGhlIGxlZnQgd2l0aCBpdHMgb3BlcmFuZHNcbiAgICAgICAgLy8gdG8gZm9ybSBhbiBleHByZXNzaW9uIGFzIGEgbmV3IGNvbXBvdW5kIG9wZXJhbmQgZm9yIHRoZSBuZXcgb3BlcmF0b3IuXG4gICAgICAgIHZhciBuZXdFeHByO1xuICAgICAgICAvLyBVbmFyeTogRWl0aGVyIG5lZ2F0aXZlIG9yIHJlY2lwcm9jYWwgcmVxdWlyZSAqb25lKiBvcGVyYW5kXG4gICAgICAgIGlmIChvbGRPcC50eXBlID09IGV4cHJUeXBlLnVub3ApIHtcbiAgICAgICAgICBpZiAob3BlcmFuZFN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBpbnB1dCA9IG9wZXJhbmRTdGFjay5wb3AoKTtcblxuICAgICAgICAgICAgLy8gRGVhbCB3aXRoIG5lZ2F0aXZlIG51bWJlcnMgc2VwYXJhdGVseS5cbiAgICAgICAgICAgIGlmIChidG0ub3B0aW9ucy5uZWdhdGl2ZU51bWJlcnMgJiYgaW5wdXQudHlwZSA9PSBleHByVHlwZS5udW1iZXIgJiYgb2xkT3Aub3AgPT0gJy0nKSB7XG4gICAgICAgICAgICAgIG5ld0V4cHIgPSBuZXcgc2NhbGFyX2V4cHIoYnRtLCBpbnB1dC5udW1iZXIubXVsdGlwbHkoLTEpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG5ld0V4cHIgPSBuZXcgdW5vcF9leHByKGJ0bSwgb2xkT3Aub3AsIGlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3RXhwciA9IG5ldyBleHByZXNzaW9uKGJ0bSk7XG4gICAgICAgICAgICBuZXdFeHByLnNldFBhcnNpbmdFcnJvcihcIkluY29tcGxldGUgZm9ybXVsYTogbWlzc2luZyB2YWx1ZSBmb3IgXCIgKyBvbGRPcC5vcCk7XG4gICAgICAgICAgfVxuICAgICAgICAvLyBCaW5hcnk6IFdpbGwgYmUgKnR3byogb3BlcmFuZHMuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG9wZXJhbmRTdGFjay5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICB2YXIgaW5wdXRCID0gb3BlcmFuZFN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgdmFyIGlucHV0QSA9IG9wZXJhbmRTdGFjay5wb3AoKTtcbiAgICAgICAgICAgIG5ld0V4cHIgPSBuZXcgYmlub3BfZXhwcihidG0sIG9sZE9wLm9wLCBpbnB1dEEsIGlucHV0Qik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0V4cHIgPSBuZXcgZXhwcmVzc2lvbihidG0pO1xuICAgICAgICAgICAgbmV3RXhwci5zZXRQYXJzaW5nRXJyb3IoXCJJbmNvbXBsZXRlIGZvcm11bGE6IG1pc3NpbmcgdmFsdWUgZm9yIFwiICsgb2xkT3Aub3ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBvcGVyYW5kU3RhY2sucHVzaChuZXdFeHByKTtcbiAgICAgICAgb2xkT3AgPSAwO1xuICAgICAgfVxuICAgICAgLy8gVGhlIG5ldyBvcGVyYXRvciBpcyB1bmFyeSBvciBoYXMgaGlnaGVyIHByZWNlZGVuY2UgdGhhbiB0aGUgcHJldmlvdXMgb3AuXG4gICAgICAvLyBXZSBuZWVkIHRvIHB1c2ggdGhlIG9sZCBvcGVyYXRvciBiYWNrIG9uIHRoZSBzdGFjayB0byB1c2UgbGF0ZXIuXG4gICAgICBpZiAob2xkT3AgIT0gMCkge1xuICAgICAgICBvcGVyYXRvclN0YWNrLnB1c2gob2xkT3ApO1xuICAgICAgfVxuICAgICAgLy8gQSBuZXcgb3BlcmF0aW9uIHdhcyBhZGRlZCB0byBkZWFsIHdpdGggbGF0ZXIuXG4gICAgICBpZiAobmV3T3ApIHtcbiAgICAgICAgb3BlcmF0b3JTdGFjay5wdXNoKG5ld09wKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOb3cgd2UgYmVnaW4gdG8gcHJvY2VzcyB0aGUgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZXhwcmVzc2lvbi5cbiAgICB2YXIgbGFzdEVsZW1lbnQgPSAtMSwgbmV3RWxlbWVudDsgLy8gMCBmb3Igb3BlcmFuZCwgMSBmb3Igb3BlcmF0b3IuXG5cbiAgICAvLyBSZWFkIHN0cmluZyBsZWZ0IHRvIHJpZ2h0LlxuICAgIC8vIElkZW50aWZ5IHdoYXQgdHlwZSBvZiBtYXRoIG9iamVjdCBzdGFydHMgYXQgdGhpcyBjaGFyYWN0ZXIuXG4gICAgLy8gRmluZCB0aGUgb3RoZXIgZW5kIG9mIHRoYXQgb2JqZWN0IGJ5IGNvbXBsZXRpb24uXG4gICAgLy8gSW50ZXJwcmV0IHRoYXQgb2JqZWN0LCBwb3NzaWJseSB0aHJvdWdoIGEgcmVjdXJzaXZlIHBhcnNpbmcuXG4gICAgZm9yIChjaGFyUG9zID0gMDsgY2hhclBvczx3b3JraW5nU3RyLmxlbmd0aDsgY2hhclBvcysrKSB7XG4gICAgICAvLyBJZGVudGlmeSB0aGUgbmV4dCBlbGVtZW50IGluIHRoZSBzdHJpbmcuXG4gICAgICBpZiAod29ya2luZ1N0ci5jaGFyQXQoY2hhclBvcykgPT0gJyAnKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAvLyBJdCBtaWdodCBiZSBhIGNsb3NlIHBhcmVudGhlc2VzIHRoYXQgd2FzIG5vdCBtYXRjaGVkIG9uIHRoZSBsZWZ0LlxuICAgICAgfSBlbHNlIGlmICh3b3JraW5nU3RyLmNoYXJBdChjaGFyUG9zKSA9PSAnKScpIHtcbiAgICAgICAgLy8gVHJlYXQgdGhpcyBsaWtlIGFuIGltcGxpY2l0IG9wZW4gcGFyZW50aGVzaXMgb24gdGhlIGxlZnQuXG4gICAgICAgIHJlc29sdmVPcGVyYXRvcih0aGlzLCBvcGVyYXRvclN0YWNrLCBvcGVyYW5kU3RhY2spO1xuICAgICAgICBuZXdFbGVtZW50ID0gMDtcbiAgICAgICAgbGFzdEVsZW1lbnQgPSAtMTtcblxuICAgICAgLy8gSXQgY291bGQgYmUgYW4gZXhwcmVzc2lvbiBzdXJyb3VuZGVkIGJ5IHBhcmVudGhlc2VzIC0tIHVzZSByZWN1cnNpb25cbiAgICAgIH0gZWxzZSBpZiAod29ya2luZ1N0ci5jaGFyQXQoY2hhclBvcykgPT0gJygnKSB7XG4gICAgICAgIGVuZFBvcyA9IGNvbXBsZXRlUGFyZW50aGVzaXMod29ya2luZ1N0ciwgY2hhclBvcyk7XG4gICAgICAgIHZhciBzdWJFeHByU3RyID0gd29ya2luZ1N0ci5zbGljZShjaGFyUG9zKzEsZW5kUG9zKTtcbiAgICAgICAgdmFyIHN1YkV4cHIgPSB0aGlzLnBhcnNlKHN1YkV4cHJTdHIsIGNvbnRleHQsIGJpbmRpbmdzKTtcbiAgICAgICAgb3BlcmFuZFN0YWNrLnB1c2goc3ViRXhwcik7XG4gICAgICAgIG5ld0VsZW1lbnQgPSAwO1xuICAgICAgICBjaGFyUG9zID0gZW5kUG9zO1xuXG4gICAgICAvLyBJdCBjb3VsZCBiZSBhbiBhYnNvbHV0ZSB2YWx1ZVxuICAgICAgfSBlbHNlIGlmICh3b3JraW5nU3RyLmNoYXJBdChjaGFyUG9zKSA9PSAnfCcpIHtcbiAgICAgICAgZW5kUG9zID0gY29tcGxldGVBYnNWYWx1ZSh3b3JraW5nU3RyLCBjaGFyUG9zKTtcbiAgICAgICAgdmFyIHN1YkV4cHJTdHIgPSB3b3JraW5nU3RyLnNsaWNlKGNoYXJQb3MrMSxlbmRQb3MpO1xuICAgICAgICB2YXIgc3ViRXhwciA9IHRoaXMucGFyc2Uoc3ViRXhwclN0ciwgY29udGV4dCwgYmluZGluZ3MpO1xuICAgICAgICB2YXIgbmV3RXhwciA9IG5ldyBmdW5jdGlvbl9leHByKHRoaXMsICdhYnMnLCBzdWJFeHByKTtcbiAgICAgICAgb3BlcmFuZFN0YWNrLnB1c2gobmV3RXhwcik7XG4gICAgICAgIG5ld0VsZW1lbnQgPSAwO1xuICAgICAgICBjaGFyUG9zID0gZW5kUG9zO1xuXG4gICAgICAvLyBJdCBjb3VsZCBiZSBhIG51bWJlci4gSnVzdCByZWFkIGl0IG9mZlxuICAgICAgfSBlbHNlIGlmICh3b3JraW5nU3RyLnN1YnN0cihjaGFyUG9zKS5zZWFyY2gobnVtYmVyTWF0Y2gpID09IDApIHtcbiAgICAgICAgZW5kUG9zID0gY29tcGxldGVOdW1iZXIod29ya2luZ1N0ciwgY2hhclBvcywgb3B0aW9ucyk7XG4gICAgICAgIHZhciBuZXdFeHByID0gbmV3IHNjYWxhcl9leHByKHRoaXMsIG5ldyBOdW1iZXIod29ya2luZ1N0ci5zbGljZShjaGFyUG9zLCBlbmRQb3MpKSk7XG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubm9EZWNpbWFscyAmJiB3b3JraW5nU3RyLmNoYXJBdChjaGFyUG9zKSA9PSAnLicpIHtcbiAgICAgICAgICBuZXdFeHByLnNldFBhcnNpbmdFcnJvcihcIldob2xlIG51bWJlcnMgb25seS4gTm8gZGVjaW1hbCB2YWx1ZXMgYXJlIGFsbG93ZWQuXCIpXG4gICAgICAgIH1cbiAgICAgICAgb3BlcmFuZFN0YWNrLnB1c2gobmV3RXhwcik7XG4gICAgICAgIG5ld0VsZW1lbnQgPSAwO1xuICAgICAgICBjaGFyUG9zID0gZW5kUG9zLTE7XG5cbiAgICAgIC8vIEl0IGNvdWxkIGJlIGEgbmFtZSwgZWl0aGVyIGEgZnVuY3Rpb24gb3IgdmFyaWFibGUuXG4gICAgICB9IGVsc2UgaWYgKHdvcmtpbmdTdHIuc3Vic3RyKGNoYXJQb3MpLnNlYXJjaChuYW1lTWF0Y2gpID09IDApIHtcbiAgICAgICAgZW5kUG9zID0gY29tcGxldGVOYW1lKHdvcmtpbmdTdHIsIGNoYXJQb3MpO1xuICAgICAgICB2YXIgdGhlTmFtZSA9IHdvcmtpbmdTdHIuc2xpY2UoY2hhclBvcyxlbmRQb3MpO1xuICAgICAgICAvLyBJZiBub3QgYSBrbm93biBuYW1lLCBicmVhayBpdCBkb3duIHVzaW5nIGNvbXBvc2l0ZSBpZiBwb3NzaWJsZS5cbiAgICAgICAgaWYgKGJpbmRpbmdzW3RoZU5hbWVdPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vIFJldHVybnMgdGhlIGZpcnN0IGtub3duIG5hbWUsIG9yIHRoZU5hbWUgbm90IGNvbXBvc2l0ZS5cbiAgICAgICAgICB2YXIgdGVzdFJlc3VsdHMgPSBUZXN0TmFtZUlzQ29tcG9zaXRlKHRoZU5hbWUsIGJpbmRpbmdzKTtcbiAgICAgICAgICBpZiAodGVzdFJlc3VsdHMuaXNDb21wb3NpdGUpIHtcbiAgICAgICAgICAgIHRoZU5hbWUgPSB0ZXN0UmVzdWx0cy5uYW1lO1xuICAgICAgICAgICAgZW5kUG9zID0gY2hhclBvcyArIHRoZU5hbWUubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBUZXN0IGlmIGEgZnVuY3Rpb25cbiAgICAgICAgaWYgKGJpbmRpbmdzW3RoZU5hbWVdPT09dW5kZWZpbmVkICYmIHdvcmtpbmdTdHIuY2hhckF0KGVuZFBvcykgPT0gJygnKSB7XG4gICAgICAgICAgdmFyIGVuZFBhcmVuID0gY29tcGxldGVQYXJlbnRoZXNpcyh3b3JraW5nU3RyLCBlbmRQb3MpO1xuXG4gICAgICAgICAgdmFyIGZjbk5hbWUgPSB0aGVOYW1lO1xuICAgICAgICAgIHZhciBuZXdFeHByO1xuICAgICAgICAgIC8vIFNlZSBpZiB0aGlzIGlzIGEgZGVyaXZhdGl2ZVxuICAgICAgICAgIGlmIChmY25OYW1lID09ICdEJykge1xuICAgICAgICAgICAgdmFyIGV4cHIsIGl2YXIsIGl2YXJWYWx1ZTtcbiAgICAgICAgICAgIHZhciBlbnRyaWVzID0gd29ya2luZ1N0ci5zbGljZShlbmRQb3MrMSxlbmRQYXJlbikuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgZXhwciA9IHRoaXMucGFyc2UoZW50cmllc1swXSwgY29udGV4dCwgYmluZGluZ3MpO1xuICAgICAgICAgICAgaWYgKGVudHJpZXMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgbmV3RXhwciA9IG5ldyBkZXJpdl9leHByKHRoaXMsIGV4cHIsICd4Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpdmFyID0gdGhpcy5wYXJzZShlbnRyaWVzWzFdLCBjb250ZXh0LCBiaW5kaW5ncyk7XG4gICAgICAgICAgICAgIC8vIEQoZih4KSx4LGMpIG1lYW5zIGYnKGMpXG4gICAgICAgICAgICAgIGlmIChlbnRyaWVzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgICAgICBpdmFyVmFsdWUgPSB0aGlzLnBhcnNlKGVudHJpZXNbMl0sIGNvbnRleHQsIGJpbmRpbmdzKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBuZXdFeHByID0gbmV3IGRlcml2X2V4cHIodGhpcywgZXhwciwgaXZhciwgaXZhclZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHN1YkV4cHIgPSB0aGlzLnBhcnNlKHdvcmtpbmdTdHIuc2xpY2UoZW5kUG9zKzEsZW5kUGFyZW4pLCBjb250ZXh0LCBiaW5kaW5ncyk7XG4gICAgICAgICAgICBuZXdFeHByID0gbmV3IGZ1bmN0aW9uX2V4cHIodGhpcywgdGhlTmFtZSwgc3ViRXhwcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIG9wZXJhbmRTdGFjay5wdXNoKG5ld0V4cHIpO1xuICAgICAgICAgIG5ld0VsZW1lbnQgPSAwO1xuICAgICAgICAgIGNoYXJQb3MgPSBlbmRQYXJlbjtcbiAgICAgICAgfVxuICAgICAgICAvLyBvciBhIHZhcmlhYmxlLlxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAvLyBUZXN0IGlmIG5lZWRzIGluZGV4XG4gICAgICAgICAgaWYgKHdvcmtpbmdTdHIuY2hhckF0KGVuZFBvcykgPT0gJ1snKSB7XG4gICAgICAgICAgICB2YXIgZW5kUGFyZW4sIGhhc0Vycm9yPWZhbHNlO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgZW5kUGFyZW4gPSBjb21wbGV0ZUJyYWNrZXQod29ya2luZ1N0ciwgZW5kUG9zLCB0cnVlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgIHBhcnNlRXJyb3IgPSBlcnJvcjtcbiAgICAgICAgICAgICAgaGFzRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICBlbmRQYXJlbiA9IGVuZFBvcysxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGluZGV4RXhwciA9IHRoaXMucGFyc2Uod29ya2luZ1N0ci5zbGljZShlbmRQb3MrMSxlbmRQYXJlbiksIGNvbnRleHQsIGJpbmRpbmdzKTtcbiAgICAgICAgICAgIHZhciBuZXdFeHByID0gbmV3IGluZGV4X2V4cHIodGhpcywgdGhlTmFtZSwgaW5kZXhFeHByKTtcbiAgICAgICAgICAgIGlmIChoYXNFcnJvcikge1xuICAgICAgICAgICAgICBuZXdFeHByLnNldFBhcnNpbmdFcnJvcihwYXJzZUVycm9yKTtcbiAgICAgICAgICAgICAgcGFyc2VFcnJvciA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcGVyYW5kU3RhY2sucHVzaChuZXdFeHByKTtcbiAgICAgICAgICAgIG5ld0VsZW1lbnQgPSAwO1xuICAgICAgICAgICAgY2hhclBvcyA9IGVuZFBhcmVuO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbmV3RXhwciA9IG5ldyB2YXJpYWJsZV9leHByKHRoaXMsIHRoZU5hbWUpO1xuICAgICAgICAgICAgb3BlcmFuZFN0YWNrLnB1c2gobmV3RXhwcik7XG4gICAgICAgICAgICBuZXdFbGVtZW50ID0gMDtcbiAgICAgICAgICAgIGNoYXJQb3MgPSBlbmRQb3MtMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgLy8gSXQgY291bGQgYmUgYW4gb3BlcmF0b3IuXG4gICAgICB9IGVsc2UgaWYgKHdvcmtpbmdTdHIuc3Vic3RyKGNoYXJQb3MpLnNlYXJjaChvcE1hdGNoKSA9PSAwKSB7XG4gICAgICAgIG5ld0VsZW1lbnQgPSAxO1xuICAgICAgICB2YXIgb3AgPSB3b3JraW5nU3RyLmNoYXJBdChjaGFyUG9zKTtcbiAgICAgICAgdmFyIG5ld09wID0gbmV3IG9wZXJhdG9yKG9wKTtcblxuICAgICAgICAvLyBDb25zZWN1dGl2ZSBvcGVyYXRvcnM/ICAgIEJldHRlciBiZSBzaWduIGNoYW5nZSBvciByZWNpcHJvY2FsLlxuICAgICAgICBpZiAobGFzdEVsZW1lbnQgIT0gMCkge1xuICAgICAgICAgIGlmIChvcCA9PSBcIi1cIiB8fCBvcCA9PSBcIi9cIikge1xuICAgICAgICAgICAgbmV3T3AudHlwZSA9IGV4cHJUeXBlLnVub3A7XG4gICAgICAgICAgICBuZXdPcC5wcmVjID0gb3BQcmVjLm11bHRkaXY7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEVSUk9SISEhXG4gICAgICAgICAgICBwYXJzZUVycm9yID0gXCJFcnJvcjogY29uc2VjdXRpdmUgb3BlcmF0b3JzXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlc29sdmVPcGVyYXRvcih0aGlzLCBvcGVyYXRvclN0YWNrLCBvcGVyYW5kU3RhY2ssIG5ld09wKTtcbiAgICAgIH1cblxuICAgICAgLy8gVHdvIGNvbnNlY3V0aXZlIG9wZXJhbmRzIG11c3QgaGF2ZSBhbiBpbXBsaWNpdCBtdWx0aXBsaWNhdGlvbiBiZXR3ZWVuIHRoZW1cbiAgICAgIGlmIChsYXN0RWxlbWVudCA9PSAwICYmIG5ld0VsZW1lbnQgPT0gMCkge1xuICAgICAgICB2YXIgaG9sZEVsZW1lbnQgPSBvcGVyYW5kU3RhY2sucG9wKCk7XG5cbiAgICAgICAgLy8gUHVzaCBhIG11bHRpcGxpY2F0aW9uXG4gICAgICAgIHZhciBuZXdPcCA9IG5ldyBvcGVyYXRvcignKicpO1xuICAgICAgICByZXNvbHZlT3BlcmF0b3IodGhpcywgb3BlcmF0b3JTdGFjaywgb3BlcmFuZFN0YWNrLCBuZXdPcCk7XG5cbiAgICAgICAgLy8gVGhlbiByZXN0b3JlIHRoZSBvcGVyYW5kIHN0YWNrLlxuICAgICAgICBvcGVyYW5kU3RhY2sucHVzaChob2xkRWxlbWVudCk7XG4gICAgICB9XG4gICAgICBsYXN0RWxlbWVudCA9IG5ld0VsZW1lbnQ7XG4gICAgfVxuXG4gICAgLy8gTm93IGZpbmlzaCB1cCB0aGUgb3BlcmF0b3Igc3RhY2s6IG5vdGhpbmcgbmV3IHRvIGluY2x1ZGVcbiAgICByZXNvbHZlT3BlcmF0b3IodGhpcywgb3BlcmF0b3JTdGFjaywgb3BlcmFuZFN0YWNrKTtcbiAgICB2YXIgZmluYWxFeHByZXNzaW9uID0gb3BlcmFuZFN0YWNrLnBvcCgpO1xuICAgIGlmIChwYXJzZUVycm9yLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZmluYWxFeHByZXNzaW9uLnNldFBhcnNpbmdFcnJvcihwYXJzZUVycm9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUZXN0IGlmIGNvbnRleHQgaXMgY29uc2lzdGVudFxuICAgICAgICBzd2l0Y2ggKGNvbnRleHQpIHtcbiAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICAgICAgaWYgKCFmaW5hbEV4cHJlc3Npb24uaXNDb25zdGFudCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vdGhyb3cgXCJUaGUgZXhwcmVzc2lvbiBzaG91bGQgYmUgYSBjb25zdGFudCBidXQgZGVwZW5kcyBvbiB2YXJpYWJsZXMuXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmluYWxFeHByZXNzaW9uID0gbmV3IHNjYWxhcl9leHByKHRoaXMsIGZpbmFsRXhwcmVzc2lvbi52YWx1ZSgpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Zvcm11bGEnOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIC8vZmluYWxFeHByZXNzaW9uLnNldENvbnRleHQoY29udGV4dCk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmRvRmxhdHRlbikge1xuICAgICAgZmluYWxFeHByZXNzaW9uLmZsYXR0ZW4oKTtcbiAgICB9XG4gICAgcmV0dXJuIGZpbmFsRXhwcmVzc2lvbjtcbiAgfVxufVxuXG4vLyBVc2VkIGluIHBhcnNlXG5mdW5jdGlvbiBvcGVyYXRvcihvcFN0cikge1xuICB0aGlzLm9wID0gb3BTdHI7XG4gIHN3aXRjaChvcFN0cikge1xuICAgIGNhc2UgJysnOlxuICAgIGNhc2UgJy0nOlxuICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLmFkZHN1YjtcbiAgICAgIHRoaXMudHlwZSA9IGV4cHJUeXBlLmJpbm9wO1xuICAgICAgdGhpcy52YWx1ZVR5cGUgPSBleHByVmFsdWUubnVtZXJpYztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJyonOlxuICAgIGNhc2UgJy8nOlxuICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLm11bHRkaXY7XG4gICAgICB0aGlzLnR5cGUgPSBleHByVHlwZS5iaW5vcDtcbiAgICAgIHRoaXMudmFsdWVUeXBlID0gZXhwclZhbHVlLm51bWVyaWM7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdeJzpcbiAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5wb3dlcjtcbiAgICAgIHRoaXMudHlwZSA9IGV4cHJUeXBlLmJpbm9wO1xuICAgICAgdGhpcy52YWx1ZVR5cGUgPSBleHByVmFsdWUubnVtZXJpYztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJyYnOlxuICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLmNvbmo7XG4gICAgICB0aGlzLnR5cGUgPSBleHByVHlwZS5iaW5vcDtcbiAgICAgIHRoaXMudmFsdWVUeXBlID0gZXhwclZhbHVlLmJvb2w7XG4gICAgICBicmVhaztcbiAgICBjYXNlICckJzogIC8vICQ9b3Igc2luY2UgfD1hYnNvbHV0ZSB2YWx1ZSBiYXJcbi8vICAgIHRoaXMub3AgPSAnfCdcbiAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5kaXNqO1xuICAgICAgdGhpcy50eXBlID0gZXhwclR5cGUuYmlub3A7XG4gICAgICB0aGlzLnZhbHVlVHlwZSA9IGV4cHJWYWx1ZS5ib29sO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnPSc6XG4gICAgICB0aGlzLnByZWMgPSBvcFByZWMuZXF1YWw7XG4gICAgICB0aGlzLnR5cGUgPSBleHByVHlwZS5iaW5vcDtcbiAgICAgIHRoaXMudmFsdWVUeXBlID0gZXhwclZhbHVlLmJvb2w7XG4gICAgICBicmVhaztcbiAgICBjYXNlICcsJzpcbiAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5mb3A7XG4gICAgICB0aGlzLnR5cGUgPSBleHByVHlwZS5hcnJheTtcbiAgICAgIHRoaXMudmFsdWVUeXBlID0gZXhwclZhbHVlLnZlY3RvcjtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aGlzLnByZWMgPSBvcFByZWMuZmNuO1xuICAgICAgdGhpcy50eXBlID0gZXhwclR5cGUuZmNuO1xuICAgICAgYnJlYWs7XG4gIH1cbn1cblxuLyogQW4gYWJzb2x1dGUgdmFsdWUgY2FuIGJlIGNvbXBsaWNhdGVkIGJlY2F1c2UgYWxzbyBhIGZ1bmN0aW9uLlxuTWF5IG5vdCBiZSBjbGVhciBpZiBuZXN0ZWQ6IHwyfHgtM3wtIDV8LlxuSXMgdGhhdCAyeC0xNSBvciBhYnMoMnx4LTN8LTUpP1xuUmVzb2x2ZSBieSByZXF1aXJpbmcgZXhwbGljaXQgb3BlcmF0aW9uczogfDIqfHgtM3wtNXwgb3IgfDJ8KngtMyp8LTV8XG4qL1xuZnVuY3Rpb24gY29tcGxldGVBYnNWYWx1ZShmb3JtdWxhU3RyLCBzdGFydFBvcykge1xuICB2YXIgcExldmVsID0gMTtcbiAgdmFyIGNoYXJQb3MgPSBzdGFydFBvcztcbiAgdmFyIHdhc09wID0gdHJ1ZTsgLy8gb3BlbiBhYnNvbHV0ZSB2YWx1ZSBpbXBsaWNpdGx5IGhhcyBwcmV2aW91cyBvcGVyYXRpb24uXG5cbiAgd2hpbGUgKHBMZXZlbCA+IDAgJiYgY2hhclBvcyA8IGZvcm11bGFTdHIubGVuZ3RoKSB7XG4gICAgY2hhclBvcysrO1xuICAgIC8vIFdlIGVuY291bnRlciBhbm90aGVyIGFic29sdXRlIHZhbHVlLlxuICAgIGlmIChmb3JtdWxhU3RyLmNoYXJBdChjaGFyUG9zKSA9PSAnfCcpIHtcbiAgICAgIGlmICh3YXNPcCkgeyAvLyBNdXN0IGJlIG9wZW5pbmcgYSBuZXcgYWJzb2x1dGUgdmFsdWUuXG4gICAgICAgIHBMZXZlbCsrO1xuICAgICAgICAvLyB3YXNPcCBpcyBzdGlsbCB0cnVlIHNpbmNlIGNhbid0IGNsb3NlIGltbWVkaWF0ZWx5XG4gICAgICB9IGVsc2UgeyAgLy8gQXNzdW1lIGNsb3NpbmcgYWJzb2x1dGUgdmFsdWUuIElmIG5vdCB3YW50ZWQsIG5lZWQgb3BlcmF0b3IuXG4gICAgICAgIHBMZXZlbC0tO1xuICAgICAgICAvLyB3YXNPcCBpcyBzdGlsbCBmYWxzZSBzaW5jZSBqdXN0IGNsb3NlZCBhIHZhbHVlLlxuICAgICAgfVxuICAgIC8vIEtlZXAgdHJhY2sgb2Ygd2hldGhlciBqdXN0IGhhZCBvcGVyYXRvciBvciBub3QuXG4gICAgfSBlbHNlIGlmIChcIistKi8oW1wiLnNlYXJjaChmb3JtdWxhU3RyLmNoYXJBdChjaGFyUG9zKSkgPj0gMCkge1xuICAgICAgd2FzT3AgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZm9ybXVsYVN0ci5jaGFyQXQoY2hhclBvcykgIT0gJyAnKSB7XG4gICAgICB3YXNPcCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4oY2hhclBvcyk7XG59XG5cbi8vIEZpbmQgdGhlIGJhbGFuY2luZyBjbG9zaW5nIHBhcmVudGhlc2lzLlxuZnVuY3Rpb24gY29tcGxldGVQYXJlbnRoZXNpcyhmb3JtdWxhU3RyLCBzdGFydFBvcykge1xuICB2YXIgcExldmVsID0gMTtcbiAgdmFyIGNoYXJQb3MgPSBzdGFydFBvcztcblxuICB3aGlsZSAocExldmVsID4gMCAmJiBjaGFyUG9zIDwgZm9ybXVsYVN0ci5sZW5ndGgpIHtcbiAgICBjaGFyUG9zKys7XG4gICAgaWYgKGZvcm11bGFTdHIuY2hhckF0KGNoYXJQb3MpID09ICcpJykge1xuICAgICAgcExldmVsLS07XG4gICAgfSBlbHNlIGlmIChmb3JtdWxhU3RyLmNoYXJBdChjaGFyUG9zKSA9PSAnKCcpIHtcbiAgICAgIHBMZXZlbCsrO1xuICAgIH1cbiAgfVxuICByZXR1cm4oY2hhclBvcyk7XG59XG5cbi8vIEJyYWNrZXRzIGFyZSB1c2VkIGZvciBzZXF1ZW5jZSBpbmRleGluZywgbm90IHJlZ3VsYXIgZ3JvdXBpbmcuXG5mdW5jdGlvbiBjb21wbGV0ZUJyYWNrZXQoZm9ybXVsYVN0ciwgc3RhcnRQb3MsIGFzU3Vic2NyaXB0KSB7XG4gIHZhciBwTGV2ZWwgPSAxO1xuICB2YXIgY2hhclBvcyA9IHN0YXJ0UG9zO1xuICB2YXIgZmFpbCA9IGZhbHNlO1xuXG4gIHdoaWxlIChwTGV2ZWwgPiAwICYmIGNoYXJQb3MgPCBmb3JtdWxhU3RyLmxlbmd0aCkge1xuICAgIGNoYXJQb3MrKztcbiAgICBpZiAoZm9ybXVsYVN0ci5jaGFyQXQoY2hhclBvcykgPT0gJ10nKSB7XG4gICAgICAgIHBMZXZlbC0tO1xuICAgIH0gZWxzZSBpZiAoZm9ybXVsYVN0ci5jaGFyQXQoY2hhclBvcykgPT0gJ1snKSB7XG4gICAgICAgIGlmIChhc1N1YnNjcmlwdCkge1xuICAgICAgICAgIGZhaWwgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHBMZXZlbCsrO1xuICAgIH1cbiAgfVxuICBpZiAoYXNTdWJzY3JpcHQgJiYgZmFpbCkge1xuICAgIHRocm93IFwiTmVzdGVkIGJyYWNrZXRzIHVzZWQgZm9yIHN1YnNjcmlwdHMgYXJlIG5vdCBzdXBwb3J0ZWQuXCI7XG4gIH1cbiAgcmV0dXJuKGNoYXJQb3MpO1xufVxuXG4vKiBHaXZlbiBhIHN0cmluZyBhbmQgYSBzdGFydGluZyBwb3NpdGlvbiBvZiBhIG5hbWUsIGlkZW50aWZ5IHRoZSBlbnRpcmUgbmFtZS4gKi9cbi8qIFJlcXVpcmUgc3RhcnQgd2l0aCBsZXR0ZXIsIHRoZW4gYW55IHNlcXVlbmNlIG9mICp3b3JkKiBjaGFyYWN0ZXIgKi9cbi8qIEFsc28gYWxsb3cgcHJpbWVzIGZvciBkZXJpdmF0aXZlcyBhdCB0aGUgZW5kLiAqL1xuZnVuY3Rpb24gY29tcGxldGVOYW1lKGZvcm11bGFTdHIsIHN0YXJ0UG9zKSB7XG4gIHZhciBtYXRjaFJ1bGUgPSAvW0EtWmEtel1cXHcqJyovO1xuICB2YXIgbWF0Y2ggPSBmb3JtdWxhU3RyLnN1YnN0cihzdGFydFBvcykubWF0Y2gobWF0Y2hSdWxlKTtcbiAgcmV0dXJuKHN0YXJ0UG9zICsgbWF0Y2hbMF0ubGVuZ3RoKTtcbn1cblxuLyogR2l2ZW4gYSBzdHJpbmcgYW5kIGEgc3RhcnRpbmcgcG9zaXRpb24gb2YgYSBudW1iZXIsIGlkZW50aWZ5IHRoZSBlbnRpcmUgbnVtYmVyLiAqL1xuZnVuY3Rpb24gY29tcGxldGVOdW1iZXIoZm9ybXVsYVN0ciwgc3RhcnRQb3MsIG9wdGlvbnMpIHtcbiAgdmFyIG1hdGNoUnVsZTtcbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5ub0RlY2ltYWxzKSB7XG4gICAgbWF0Y2hSdWxlID0gL1swLTldKi87XG4gIH0gZWxzZSB7XG4gICAgbWF0Y2hSdWxlID0gL1swLTldKihcXC5bMC05XSopPyhlLT9bMC05XSspPy87XG4gIH1cbiAgdmFyIG1hdGNoID0gZm9ybXVsYVN0ci5zdWJzdHIoc3RhcnRQb3MpLm1hdGNoKG1hdGNoUnVsZSk7XG4gIHJldHVybihzdGFydFBvcyArIG1hdGNoWzBdLmxlbmd0aCk7XG59XG5cbi8qIFRlc3RzIGEgc3RyaW5nIHRvIHNlZSBpZiBpdCBjYW4gYmUgY29uc3RydWN0ZWQgYXMgYSBjb25jYXRlbnRhdGlvbiBvZiBrbm93biBuYW1lcy4gKi9cbi8qIEZvciBleGFtcGxlLCBhYmMgY291bGQgYmUgYSBuYW1lIG9yIGNvdWxkIGJlIGEqYipjICovXG4vKiBQYXNzIGluIHRoZSBiaW5kaW5ncyBnaXZpbmcgdGhlIGtub3duIG5hbWVzIGFuZCBzZWUgaWYgd2UgY2FuIGJ1aWxkIHRoaXMgbmFtZSAqL1xuLyogUmV0dXJuIHRoZSAqZmlyc3QqIG5hbWUgdGhhdCBpcyBwYXJ0IG9mIHRoZSB3aG9sZS4gKi9cbmZ1bmN0aW9uIFRlc3ROYW1lSXNDb21wb3NpdGUodGV4dCwgYmluZGluZ3MpIHtcbiAgdmFyIHJldFN0cnVjdCA9IG5ldyBPYmplY3QoKTtcbiAgcmV0U3RydWN0LmlzQ29tcG9zaXRlID0gZmFsc2U7XG5cbiAgaWYgKGJpbmRpbmdzICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgcmVtYWluLCBuZXh0TmFtZTtcbiAgICBpZiAoYmluZGluZ3NbdGV4dF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0U3RydWN0LmlzQ29tcG9zaXRlID0gdHJ1ZTtcbiAgICAgIHJldFN0cnVjdC5uYW1lID0gdGV4dDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2VlIGlmIHRoZSB0ZXh0ICpzdGFydHMqIHdpdGggYSBrbm93biBuYW1lXG4gICAgICB2YXIga25vd25OYW1lcyA9IE9iamVjdC5rZXlzKGJpbmRpbmdzKTtcbiAgICAgIGZvciAodmFyIGlrZXkgaW4ga25vd25OYW1lcykge1xuICAgICAgICBuZXh0TmFtZSA9IGtub3duTmFtZXNbaWtleV07XG4gICAgICAgIC8vIElmICp0aGlzKiBuYW1lIGlzIHRoZSBzdGFydCBvZiB0aGUgdGV4dCwgc2VlIGlmIHRoZSByZXN0IGZyb20ga25vd24gbmFtZXMuXG4gICAgICAgIGlmICh0ZXh0LnNlYXJjaChuZXh0TmFtZSk9PTApIHtcbiAgICAgICAgICByZW1haW4gPSBUZXN0TmFtZUlzQ29tcG9zaXRlKHRleHQuc2xpY2UobmV4dE5hbWUubGVuZ3RoKSwgYmluZGluZ3MpO1xuICAgICAgICAgIGlmIChyZW1haW4uaXNDb21wb3NpdGUpIHtcbiAgICAgICAgICAgIHJldFN0cnVjdC5pc0NvbXBvc2l0ZSA9IHRydWU7XG4gICAgICAgICAgICByZXRTdHJ1Y3QubmFtZSA9IG5leHROYW1lO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXRTdHJ1Y3Q7XG59XG4iLCIvKiFcbiAqIEJUTSBKYXZhU2NyaXB0IExpYnJhcnkgdkBWRVJTSU9OXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGJyaWFud2FsdG9uL0JUTVxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogRGVmaW5lIHRoZSBCaW5hcnkgRXhwcmVzc2lvbiAtLSBkZWZpbmVkIGJ5IGFuIG9wZXJhdG9yIGFuZCB0d28gaW5wdXRzLlxuKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuaW1wb3J0IHsgQlRNLCBvcFByZWMsIGV4cHJUeXBlLCBleHByVmFsdWUgfSBmcm9tIFwiLi9CVE1fcm9vdC5qc1wiXG5pbXBvcnQgeyBleHByZXNzaW9uIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi5qc1wiXG5pbXBvcnQgeyBzY2FsYXJfZXhwciB9IGZyb20gXCIuL3NjYWxhcl9leHByLmpzXCJcbmltcG9ydCB7IHVub3BfZXhwciB9IGZyb20gXCIuL3Vub3BfZXhwci5qc1wiXG5cbmV4cG9ydCBjbGFzcyBiaW5vcF9leHByIGV4dGVuZHMgZXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IoYnRtLCBvcCwgaW5wdXRBLCBpbnB1dEIpIHtcbiAgICAgICAgc3VwZXIoYnRtKTtcbiAgICAgICAgdGhpcy50eXBlID0gZXhwclR5cGUuYmlub3A7XG4gICAgICAgIHRoaXMub3AgPSBvcDtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dEEgPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICBpbnB1dEEgPSBuZXcgZXhwcmVzc2lvbih0aGlzLmJ0bSk7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXRCID09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgaW5wdXRCID0gbmV3IGV4cHJlc3Npb24odGhpcy5idG0pO1xuICAgICAgICB0aGlzLmlucHV0cyA9IFtpbnB1dEEsIGlucHV0Ql07XG4gICAgICAgICAgICBpbnB1dEEucGFyZW50ID0gdGhpcztcbiAgICAgICAgICAgIGlucHV0Qi5wYXJlbnQgPSB0aGlzO1xuXG4gICAgICAgIHN3aXRjaCAob3ApIHtcbiAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLmFkZHN1YjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLm11bHRkaXY7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICAgICAgICB0aGlzLnByZWMgPSBvcFByZWMucG93ZXI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcmJzpcbiAgICAgICAgICAgICAgICB0aGlzLnByZWMgPSBvcFByZWMuY29uajtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlVHlwZSA9IGV4cHJWYWx1ZS5ib29sO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnJCc6XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLmRpc2o7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZVR5cGUgPSBleHByVmFsdWUuYm9vbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJz0nOlxuICAgICAgICAgICAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5lcXVhbDtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlVHlwZSA9IGV4cHJWYWx1ZS5ib29sO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVua25vd24gYmluYXJ5IG9wZXJhdG9yOiAnXCIrb3ArXCInLlwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICB2YXIgdGhlU3RyO1xuICAgICAgICB2YXIgb3BBU3RyLCBvcEJTdHI7XG4gICAgICAgIHZhciBpc0Vycm9yID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0c1swXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb3BBU3RyID0gJz8nO1xuICAgICAgICAgICAgaXNFcnJvciA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcEFTdHIgPSB0aGlzLmlucHV0c1swXS50b1N0cmluZygpO1xuICAgICAgICAgICAgaWYgKCh0aGlzLmlucHV0c1swXS50eXBlID49IGV4cHJUeXBlLnVub3BcbiAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbMF0ucHJlYyA8IHRoaXMucHJlYylcbiAgICAgICAgICAgICAgICB8fCAodGhpcy5pbnB1dHNbMF0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgJiYgb3BBU3RyLmluZGV4T2YoXCIvXCIpID49IDBcbiAgICAgICAgICAgICAgICAgICAgJiYgb3BQcmVjLm11bHRkaXYgPD0gdGhpcy5wcmVjKVxuICAgICAgICAgICAgICAgICkgXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgb3BBU3RyID0gJygnICsgb3BBU3RyICsgJyknO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dHNbMV0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG9wQlN0ciA9ICc/JztcbiAgICAgICAgICAgIGlzRXJyb3IgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3BCU3RyID0gdGhpcy5pbnB1dHNbMV0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmICgodGhpcy5pbnB1dHNbMV0udHlwZSA+PSBleHByVHlwZS51bm9wXG4gICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzWzFdLnByZWMgPD0gdGhpcy5wcmVjKVxuICAgICAgICAgICAgICAgIHx8ICh0aGlzLmlucHV0c1sxXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICAgICAmJiBvcEJTdHIuaW5kZXhPZihcIi9cIikgPj0gMFxuICAgICAgICAgICAgICAgICAgICAmJiBvcFByZWMubXVsdGRpdiA8PSB0aGlzLnByZWMpXG4gICAgICAgICAgICAgICAgKSBcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBvcEJTdHIgPSAnKCcgKyBvcEJTdHIgKyAnKSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdGhlT3AgPSB0aGlzLm9wO1xuICAgICAgICBpZiAodGhlT3AgPT0gJ3wnKSB7XG4gICAgICAgICAgICB0aGVPcCA9ICcgJCAnO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhlU3RyID0gb3BBU3RyICsgdGhlT3AgKyBvcEJTdHI7XG4gICAgICAgIHJldHVybih0aGVTdHIpO1xuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBhcnJheSBjb250YWluaW5nIGFsbCB0ZXN0ZWQgZXF1aXZhbGVudCBzdHJpbmdzLlxuICAgIGFsbFN0cmluZ0VxdWl2cygpIHtcbiAgICAgICAgdmFyIGFsbElucHV0c0EgPSB0aGlzLmlucHV0c1swXS5hbGxTdHJpbmdFcXVpdnMoKSxcbiAgICAgICAgICAgIGFsbElucHV0c0IgPSB0aGlzLmlucHV0c1sxXS5hbGxTdHJpbmdFcXVpdnMoKTtcblxuICAgICAgICB2YXIgcmV0VmFsdWUgPSBbXTtcblxuICAgICAgICB2YXIgdGhlT3AgPSB0aGlzLm9wO1xuICAgICAgICBpZiAodGhlT3AgPT0gJ3wnKSB7XG4gICAgICAgICAgICB0aGVPcCA9ICcgJCAnO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSBpbiBhbGxJbnB1dHNBKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBqIGluIGFsbElucHV0c0IpIHtcbiAgICAgICAgICAgICAgICBvcEFTdHIgPSBhbGxJbnB1dHNBW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1swXS50eXBlID49IGV4cHJUeXBlLnVub3AgJiYgdGhpcy5pbnB1dHNbMF0ucHJlYyA8IHRoaXMucHJlYykge1xuICAgICAgICAgICAgICAgICAgICBvcEFTdHIgPSAnKCcgKyBvcEFTdHIgKyAnKSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9wQlN0ciA9IGFsbElucHV0c0Jbal07XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzWzFdLnR5cGUgPj0gZXhwclR5cGUudW5vcCAmJiB0aGlzLmlucHV0c1sxXS5wcmVjIDw9IHRoaXMucHJlYykge1xuICAgICAgICAgICAgICAgICAgICBvcEJTdHIgPSAnKCcgKyBvcEJTdHIgKyAnKSc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0VmFsdWUucHVzaChvcEFTdHIgKyB0aGVPcCArIG9wQlN0cik7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcCA9PSAnKycgfHwgdGhpcy5vcCA9PSAnKicgfHwgdGhpcy5vcCA9PSAnJicgfHwgdGhpcy5vcCA9PSAnJCcpIHtcbiAgICAgICAgICAgICAgICAgICAgb3BCU3RyID0gYWxsSW5wdXRzQltqXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzWzFdLnR5cGUgPj0gZXhwclR5cGUudW5vcCAmJiB0aGlzLmlucHV0c1sxXS5wcmVjIDwgdGhpcy5wcmVjKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcEJTdHIgPSAnKCcgKyBvcEJTdHIgKyAnKSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb3BBU3RyID0gYWxsSW5wdXRzQVtpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzWzBdLnR5cGUgPj0gZXhwclR5cGUudW5vcCAmJiB0aGlzLmlucHV0c1swXS5wcmVjIDw9IHRoaXMucHJlYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BBU3RyID0gJygnICsgb3BBU3RyICsgJyknO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbHVlLnB1c2gob3BCU3RyICsgdGhlT3AgKyBvcEFTdHIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxuXG4gICAgdG9UZVgoc2hvd1NlbGVjdCkge1xuICAgICAgICB2YXIgdGhlU3RyO1xuICAgICAgICB2YXIgdGhlT3A7XG4gICAgICAgIHZhciBvcEFTdHIsIG9wQlN0cjtcblxuICAgICAgICBpZiAodHlwZW9mIHNob3dTZWxlY3QgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHNob3dTZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dHNbMF0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG9wQVN0ciA9ICc/JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9wQVN0ciA9IHRoaXMuaW5wdXRzWzBdLnRvVGVYKHNob3dTZWxlY3QpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dHNbMV0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG9wQlN0ciA9ICc/JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9wQlN0ciA9IHRoaXMuaW5wdXRzWzFdLnRvVGVYKHNob3dTZWxlY3QpO1xuICAgICAgICB9XG4gICAgICAgIHRoZU9wID0gdGhpcy5vcDtcbiAgICAgICAgaWYgKHNob3dTZWxlY3QgJiYgdGhpcy5zZWxlY3QpIHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhlT3ApIHtcbiAgICAgICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICAgICAgdGhlT3AgPSAnXFxcXGNkb3QgJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgICAgIHRoZU9wID0gJ1xcXFxkaXYgJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnXic6XG4gICAgICAgICAgICAgICAgICAgIHRoZU9wID0gJ1xcXFx3ZWRnZSAnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd8JzpcbiAgICAgICAgICAgICAgICAgICAgdGhlT3AgPSAnXFxcXGhib3h7IG9yIH0nO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICckJzpcbiAgICAgICAgICAgICAgICAgICAgdGhlT3AgPSAnXFxcXGhib3h7IG9yIH0nO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcmJzpcbiAgICAgICAgICAgICAgICAgICAgdGhlT3AgPSAnXFxcXGhib3h7IGFuZCB9JztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHRoZU9wKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1sxXSAmJiB0aGlzLmlucHV0c1sxXS50eXBlID09IGV4cHJUeXBlLm51bWJlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlT3AgPSAnXFxcXGNkb3QgJztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlucHV0c1sxXSAmJiB0aGlzLmlucHV0c1sxXS50eXBlID09IGV4cHJUeXBlLmJpbm9wXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzWzFdLm9wPT0nXicgJiYgdGhpcy5pbnB1dHNbMV0uaW5wdXRzWzBdLnR5cGU9PWV4cHJUeXBlLm51bWJlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlT3AgPSAnXFxcXGNkb3QgJztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZU9wID0gJyAnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3wnOlxuICAgICAgICAgICAgICAgICAgICB0aGVPcCA9ICdcXFxcaGJveHsgb3IgfSc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJyQnOlxuICAgICAgICAgICAgICAgICAgICB0aGVPcCA9ICdcXFxcaGJveHsgb3IgfSc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJyYnOlxuICAgICAgICAgICAgICAgICAgICB0aGVPcCA9ICdcXFxcaGJveHsgYW5kIH0nO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhlT3AgPT0gJy8nKSB7XG4gICAgICAgICAgICB0aGVTdHIgPSAnXFxcXGZyYWN7JyArIG9wQVN0ciArICd9eycgKyBvcEJTdHIgKyAnfSc7XG4gICAgICAgIH0gZWxzZSBpZiAodGhlT3AgPT0gJ14nKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbMF0gJiYgdGhpcy5pbnB1dHNbMF0udHlwZSA+PSBleHByVHlwZS5mY24pIHtcbiAgICAgICAgICAgICAgICB0aGVTdHIgPSAnXFxcXGxlZnQoJyArIG9wQVN0ciArICdcXFxccmlnaHQpJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhlU3RyID0gb3BBU3RyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhlU3RyICs9IHRoZU9wICsgJ3snICsgb3BCU3RyICsgJ30nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGFyZ1N0ckw9JycsIGFyZ1N0clI9JycsIG9wU3RyTD0nJywgb3BTdHJSPScnO1xuXG4gICAgICAgICAgICBpZiAoc2hvd1NlbGVjdCAmJiB0aGlzLnNlbGVjdCkge1xuICAgICAgICAgICAgICAgIGFyZ1N0ckwgPSAne1xcXFxjb2xvcntibHVlfSc7XG4gICAgICAgICAgICAgICAgYXJnU3RyUiA9ICd9JztcbiAgICAgICAgICAgICAgICBvcFN0ckwgPSAne1xcXFxjb2xvcntyZWR9JztcbiAgICAgICAgICAgICAgICBvcFN0clIgPSAnfSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbMF0gJiYgdGhpcy5pbnB1dHNbMF0udHlwZSA+PSBleHByVHlwZS51bm9wICYmIHRoaXMuaW5wdXRzWzBdLnByZWMgPCB0aGlzLnByZWMpIHtcbiAgICAgICAgICAgICAgICB0aGVTdHIgPSAnXFxcXGxlZnQoJyArIGFyZ1N0ckwgKyBvcEFTdHIgKyBhcmdTdHJSICsgJ1xcXFxyaWdodCknO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGVTdHIgPSBhcmdTdHJMICsgb3BBU3RyICsgYXJnU3RyUjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoZVN0ciArPSBvcFN0ckwgKyB0aGVPcCArIG9wU3RyUjtcbiAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1sxXSAmJiB0aGlzLmlucHV0c1sxXS50eXBlID49IGV4cHJUeXBlLnVub3AgJiYgdGhpcy5pbnB1dHNbMV0ucHJlYyA8PSB0aGlzLnByZWMpIHtcbiAgICAgICAgICAgICAgICB0aGVTdHIgKz0gJ1xcXFxsZWZ0KCcgKyBhcmdTdHJMICsgb3BCU3RyICsgYXJnU3RyUiArICdcXFxccmlnaHQpJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhlU3RyICs9IGFyZ1N0ckwgKyBvcEJTdHIgKyBhcmdTdHJSO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzaG93U2VsZWN0ICYmIHRoaXMuc2VsZWN0KSB7XG4gICAgICAgICAgdGhlU3RyID0gXCJ7XFxcXGNvbG9ye3JlZH1cXFxcYm94ZWR7XCIgKyB0aGVTdHIgKyBcIn19XCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhlU3RyID0gdGhlU3RyLnJlcGxhY2UoL1xcKy0vZywgJy0nKTtcbiAgICAgICAgcmV0dXJuKHRoZVN0cik7XG4gICAgfVxuXG4gICAgdG9NYXRoTUwoKSB7XG4gICAgICAgIHZhciB0aGVTdHI7XG4gICAgICAgIHZhciB0aGVPcDtcbiAgICAgICAgdmFyIG9wQVN0ciwgb3BCU3RyO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dHNbMF0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG9wQVN0ciA9ICc/JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9wQVN0ciA9IHRoaXMuaW5wdXRzWzBdLnRvTWF0aE1MKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0c1sxXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb3BCU3RyID0gJz8nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3BCU3RyID0gdGhpcy5pbnB1dHNbMV0udG9NYXRoTUwoKTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgIHRoZU9wID0gXCI8cGx1cy8+XCJcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgIHRoZU9wID0gXCI8bWludXMvPlwiXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICB0aGVPcCA9IFwiPHRpbWVzLz5cIlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgdGhlT3AgPSBcIjxkaXZpZGUvPlwiXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICAgICAgICB0aGVPcCA9IFwiPHBvd2VyLz5cIlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHRoZVN0ciA9IFwiPGFwcGx5PlwiICsgdGhlT3AgKyBvcEFTdHIgKyBvcEJTdHIgKyBcIjwvYXBwbHk+XCI7XG5cbiAgICAgICAgcmV0dXJuKHRoZVN0cik7XG4gICAgfVxuXG4gICAgb3BlcmF0ZVRvVGVYKCkge1xuICAgICAgICB2YXIgb3BTdHJpbmcgPSB0aGlzLm9wO1xuXG4gICAgICAgIHN3aXRjaCAob3BTdHJpbmcpIHtcbiAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgIG9wU3RyaW5nID0gJ1xcXFx0aW1lcyAnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgb3BTdHJpbmcgPSAnXFxcXGRpdiAnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnXic6XG4gICAgICAgICAgICAgICAgb3BTdHJpbmcgPSAnXFxcXHdlZGdlICc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd8JzpcbiAgICAgICAgICAgICAgICBvcFN0cmluZyA9ICdcXFxcaGJveHsgb3IgfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICckJzpcbiAgICAgICAgICAgICAgICBvcFN0cmluZyA9ICdcXFxcaGJveHsgb3IgfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcmJzpcbiAgICAgICAgICAgICAgICBvcFN0cmluZyA9ICdcXFxcaGJveHsgYW5kIH0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKG9wU3RyaW5nKTtcbiAgICB9XG5cbiAgICBpc0NvbW11dGF0aXZlKCkge1xuICAgICAgICB2YXIgY29tbXV0ZXMgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMub3AgPT09ICcrJyB8fCB0aGlzLm9wID09PSAnKicpIHtcbiAgICAgICAgICAgIGNvbW11dGVzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4oY29tbXV0ZXMpO1xuICAgIH1cblxuICAgIGV2YWx1YXRlKGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciBpbnB1dEFWYWwgPSB0aGlzLmlucHV0c1swXS5ldmFsdWF0ZShiaW5kaW5ncyk7XG4gICAgICAgIHZhciBpbnB1dEJWYWwgPSB0aGlzLmlucHV0c1sxXS5ldmFsdWF0ZShiaW5kaW5ncyk7XG5cbiAgICAgICAgaWYgKGlucHV0QVZhbCA9PSB1bmRlZmluZWQgfHwgaW5wdXRCVmFsID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuKHVuZGVmaW5lZCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmV0VmFsID0gdW5kZWZpbmVkO1xuICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgIHJldFZhbCA9IGlucHV0QVZhbCArIGlucHV0QlZhbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgIHJldFZhbCA9IGlucHV0QVZhbCAtIGlucHV0QlZhbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgIHJldFZhbCA9IGlucHV0QVZhbCAqIGlucHV0QlZhbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgICAgICAgIHJldFZhbCA9IGlucHV0QVZhbCAvIGlucHV0QlZhbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pbnB1dHNbMV0uaXNDb25zdGFudCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGguZXhwKGlucHV0QlZhbCAqIE1hdGgubG9nKGlucHV0QVZhbCkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dEFWYWwgPj0gMCB8fCAoaW5wdXRCVmFsICUgMSA9PSAwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5wb3coaW5wdXRBVmFsLGlucHV0QlZhbCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLmV4cChpbnB1dEJWYWwgKiBNYXRoLmxvZyhpbnB1dEFWYWwpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJz0nOlxuICAgICAgICAgICAgICAgIHJldFZhbCA9IChNYXRoLmFicyhpbnB1dEFWYWwgLSBpbnB1dEJWYWwpIDwgdGhpcy5idG0ub3B0aW9ucy5hYnNUb2wpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnJic6XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gaW5wdXRBVmFsICYmIGlucHV0QlZhbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3wnOlxuICAgICAgICAgICAgY2FzZSAnJCc6XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gaW5wdXRBVmFsIHx8IGlucHV0QlZhbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGUgYmluYXJ5IG9wZXJhdG9yICdcIiArIHRoaXMub3AgKyBcIicgaXMgbm90IGRlZmluZWQuXCIpO1xuICAgICAgICAgICAgICAgIHJldFZhbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ocmV0VmFsKTtcbiAgICB9XG5cbiAgICAvLyBTZWUgaWYgdGhpcyBvcGVyYXRvciBpcyBub3cgcmVkdW5kYW50LlxuICAgIC8vIFJldHVybiB0aGUgcmVzdWx0aW5nIGV4cHJlc3Npb24uXG4gICAgcmVkdWNlKCkge1xuICAgICAgICB2YXIgbmV3RXhwciA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLmlucHV0cy5sZW5ndGggPD0gMSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gU3VtIHdpdGggbm8gZWxlbWVudHMgPSAwXG4gICAgICAgICAgICAgICAgLy8gUHJvZHVjdCB3aXRoIG5vIGVsZW1lbnRzID0gMVxuICAgICAgICAgICAgICAgIG5ld0V4cHIgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIHRoaXMub3AgPT0gJysnID8gMCA6IDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBTdW0gb3IgcHJvZHVjdCB3aXRoIG9uZSBlbGVtZW50ICppcyogdGhhdCBlbGVtZW50LlxuICAgICAgICAgICAgICAgIG5ld0V4cHIgPSB0aGlzLmlucHV0c1swXS5yZWR1Y2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld0V4cHIucGFyZW50ID0gdGhpcy5wYXJlbnQ7XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJlbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5pbnB1dFN1YnN0KHRoaXMsIG5ld0V4cHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybihuZXdFeHByKTtcbiAgICB9XG5cbiAgICBzaW1wbGlmeUNvbnN0YW50cygpIHtcbiAgICAgICAgdmFyIHJldFZhbCA9IHRoaXM7XG4gICAgICAgIHRoaXMuaW5wdXRzWzBdID0gdGhpcy5pbnB1dHNbMF0uc2ltcGxpZnlDb25zdGFudHMoKTtcbiAgICAgICAgdGhpcy5pbnB1dHNbMF0ucGFyZW50ID0gdGhpcztcbiAgICAgICAgdGhpcy5pbnB1dHNbMV0gPSB0aGlzLmlucHV0c1sxXS5zaW1wbGlmeUNvbnN0YW50cygpO1xuICAgICAgICB0aGlzLmlucHV0c1sxXS5wYXJlbnQgPSB0aGlzO1xuICAgICAgICBpZiAoKHRoaXMuaW5wdXRzWzBdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgfHwgKHRoaXMuaW5wdXRzWzBdLnR5cGUgPT0gZXhwclR5cGUudW5vcCAmJiB0aGlzLmlucHV0c1swXS5pbnB1dHNbMF0udHlwZSA9PSBleHByVHlwZS5udW1iZXIpXG4gICAgICAgICAgICApICYmXG4gICAgICAgICAgICAodGhpcy5pbnB1dHNbMV0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICB8fCAodGhpcy5pbnB1dHNbMV0udHlwZSA9PSBleHByVHlwZS51bm9wICYmIHRoaXMuaW5wdXRzWzFdLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLm51bWJlcilcbiAgICAgICAgICAgICkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBudW1BLCBudW1CLCB0aGVOdW1iZXI7XG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbMF0udHlwZSA9PSBleHByVHlwZS5udW1iZXIpIHtcbiAgICAgICAgICAgICAgICBudW1BID0gdGhpcy5pbnB1dHNbMF0ubnVtYmVyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMuaW5wdXRzWzBdLm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgICAgICAgICAgbnVtQSA9IHRoaXMuaW5wdXRzWzBdLmlucHV0c1swXS5udW1iZXIuYWRkSW52ZXJzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgbnVtQSA9IHRoaXMuaW5wdXRzWzBdLmlucHV0c1swXS5udW1iZXIubXVsdEludmVyc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1sxXS50eXBlID09IGV4cHJUeXBlLm51bWJlcikge1xuICAgICAgICAgICAgICAgIG51bUIgPSB0aGlzLmlucHV0c1sxXS5udW1iZXI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5pbnB1dHNbMV0ub3ApIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBudW1CID0gdGhpcy5pbnB1dHNbMV0uaW5wdXRzWzBdLm51bWJlci5hZGRJbnZlcnNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBudW1CID0gdGhpcy5pbnB1dHNbMV0uaW5wdXRzWzBdLm51bWJlci5tdWx0SW52ZXJzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3dpdGNoICh0aGlzLm9wKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgICAgIHRoZU51bWJlciA9IG51bUEuYWRkKG51bUIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICAgICAgdGhlTnVtYmVyID0gbnVtQS5zdWJ0cmFjdChudW1CKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgICAgIHRoZU51bWJlciA9IG51bUEubXVsdGlwbHkobnVtQik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgICAgICAgICAgICB0aGVOdW1iZXIgPSBudW1BLmRpdmlkZShudW1CKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnXic6XG4gICAgICAgICAgICAgICAgICAgIC8vIEludGVnZXIgcG93ZXJzIG9mIGEgcmF0aW9uYWwgbnVtYmVyIGNhbiBiZSByZXByZXNlbnRlZCBleGFjdGx5LlxuICAgICAgICAgICAgICAgICAgICBpZiAobnVtQSBpbnN0YW5jZW9mIHJhdGlvbmFsX251bWJlciAmJiBudW1CIGluc3RhbmNlb2YgcmF0aW9uYWxfbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgbnVtQi5xID09IDEgJiYgbnVtQi5wICUgMSA9PSAwICYmIG51bUIucCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZU51bWJlciA9IG5ldyByYXRpb25hbF9udW1iZXIoTWF0aC5wb3cobnVtQS5wLCBudW1CLnApLCBNYXRoLnBvdyhudW1BLnEsIG51bUIucCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoZU51bWJlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJ0bS5vcHRpb25zLm5lZ2F0aXZlTnVtYmVycyAmJiB0aGVOdW1iZXIucCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gbmV3IHVub3BfZXhwcih0aGlzLmJ0bSwgJy0nLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIHRoZU51bWJlci5tdWx0aXBseSgtMSkpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIHRoZU51bWJlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3dpdGNoICh0aGlzLm9wKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbXBsaWZ5IDArYVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbMF0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1swXS5udW1iZXIudmFsdWUoKT09MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gdGhpcy5pbnB1dHNbMV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gU2ltcGxpZnkgYSswXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuaW5wdXRzWzFdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbMV0ubnVtYmVyLnZhbHVlKCkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gdGhpcy5pbnB1dHNbMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbXBsaWZ5IDAtYVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbMF0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1swXS5udW1iZXIudmFsdWUoKT09MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gbmV3IHVub3BfZXhwcih0aGlzLmJ0bSwgXCItXCIsIHRoaXMuaW5wdXRzWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBTaW1wbGlmeSBhLTBcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5pbnB1dHNbMV0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1sxXS5udW1iZXIudmFsdWUoKSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSB0aGlzLmlucHV0c1swXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICAgICAgLy8gU2ltcGxpZnkgMSphXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzWzBdLm51bWJlci52YWx1ZSgpPT0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSB0aGlzLmlucHV0c1sxXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBTaW1wbGlmeSBhKjFcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5pbnB1dHNbMV0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1sxXS5udW1iZXIudmFsdWUoKSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSB0aGlzLmlucHV0c1swXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICAgICAgLy8gU2ltcGxpZnkgMS9hIHRvIHVuYXJ5IG9wZXJhdG9yIG9mIG11bHRpcGxpY2F0aXZlIGludmVyc2UuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzWzBdLm51bWJlci52YWx1ZSgpPT0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBuZXcgdW5vcF9leHByKHRoaXMuYnRtLCBcIi9cIiwgdGhpcy5pbnB1dHNbMV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbXBsaWZ5IGEvMVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLmlucHV0c1sxXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzWzFdLm51bWJlci52YWx1ZSgpID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IHRoaXMuaW5wdXRzWzBdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgICAgICAgICAgICAvLyBTaW1wbGlmeSAwXnBcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzWzBdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbMF0ubnVtYmVyLnZhbHVlKCk9PTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gU2ltcGxpZnkgMV5wXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuaW5wdXRzWzBdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbMF0ubnVtYmVyLnZhbHVlKCkgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBTaW1wbGlmeSBwXjFcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5pbnB1dHNbMV0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1sxXS5udW1iZXIudmFsdWUoKSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSB0aGlzLmlucHV0c1swXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ocmV0VmFsKTtcbiAgICB9XG5cbiAgICBmbGF0dGVuKCkge1xuICAgICAgICB2YXIgaW5BID0gdGhpcy5pbnB1dHNbMF0uZmxhdHRlbigpO1xuICAgICAgICB2YXIgaW5CID0gdGhpcy5pbnB1dHNbMV0uZmxhdHRlbigpO1xuXG4gICAgICAgIHZhciByZXRWYWw7XG4gICAgICAgIHN3aXRjaCAodGhpcy5vcCkge1xuICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXRzID0gW107XG4gICAgICAgICAgICAgICAgaWYgKChpbkEudHlwZSA9PSBleHByVHlwZS5tdWx0aW9wIHx8IGluQS50eXBlID09IGV4cHJUeXBlLmJpbm9wKVxuICAgICAgICAgICAgICAgICAgICAmJiAoaW5BLm9wID09ICcrJyB8fCBpbkEub3AgPT0gJy0nKSkgXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3SW5wdXQgPSBpbkEuZmxhdHRlbigpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG5ld0lucHV0LmlucHV0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzLnB1c2gobmV3SW5wdXQuaW5wdXRzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKGluQSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgoaW5CLnR5cGUgPT0gZXhwclR5cGUubXVsdGlvcCB8fCBpbkIudHlwZSA9PSBleHByVHlwZS5iaW5vcClcbiAgICAgICAgICAgICAgICAgICAgJiYgKGluQi5vcCA9PSAnKycgfHwgaW5CLm9wID09ICctJykpIFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0lucHV0ID0gaW5CLmZsYXR0ZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBuZXdJbnB1dC5pbnB1dHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKG5ld0lucHV0LmlucHV0c1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vcCA9PSAnLScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoaW5CLnR5cGUgPT0gZXhwclR5cGUubXVsdGlvcCB8fCBpbkIudHlwZSA9PSBleHByVHlwZS5iaW5vcClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAoaW5CLm9wID09ICcrJyB8fCBpbkIub3AgPT0gJy0nKSkgXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0lucHV0ID0gaW5CLmZsYXR0ZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG5ld0lucHV0LmlucHV0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dHMucHVzaChuZXcgdW5vcF9leHByKHRoaXMuYnRtLCAnLScsbmV3SW5wdXQuaW5wdXRzW2ldKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dHMucHVzaChuZXcgdW5vcF9leHByKHRoaXMuYnRtLCAnLScsaW5CKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dHMucHVzaChpbkIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldFZhbCA9IG5ldyBtdWx0aW9wX2V4cHIodGhpcy5idG0sICcrJywgaW5wdXRzKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0cyA9IFtdO1xuICAgICAgICAgICAgICAgIGlmICgoaW5BLnR5cGUgPT0gZXhwclR5cGUubXVsdGlvcCB8fCBpbkEudHlwZSA9PSBleHByVHlwZS5iaW5vcClcbiAgICAgICAgICAgICAgICAgICAgJiYgKGluQS5vcCA9PSAnKicgfHwgaW5BLm9wID09ICcvJykpIFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0lucHV0ID0gaW5BLmZsYXR0ZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBuZXdJbnB1dC5pbnB1dHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKG5ld0lucHV0LmlucHV0c1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dHMucHVzaChpbkEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoKGluQi50eXBlID09IGV4cHJUeXBlLm11bHRpb3AgfHwgaW5CLnR5cGUgPT0gZXhwclR5cGUuYmlub3ApXG4gICAgICAgICAgICAgICAgICAgICYmIChpbkIub3AgPT0gJyonIHx8IGluQi5vcCA9PSAnLycpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0lucHV0ID0gaW5CLmZsYXR0ZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBuZXdJbnB1dC5pbnB1dHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKG5ld0lucHV0LmlucHV0c1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vcCA9PSAnLycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoaW5CLnR5cGUgPT0gZXhwclR5cGUubXVsdGlvcCB8fCBpbkIudHlwZSA9PSBleHByVHlwZS5iaW5vcClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAoaW5CLm9wID09ICcqJyB8fCBpbkIub3AgPT0gJy8nKSkgXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0lucHV0ID0gaW5CLmZsYXR0ZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG5ld0lucHV0LmlucHV0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dHMucHVzaChuZXcgdW5vcF9leHByKHRoaXMuYnRtLCAnLycsbmV3SW5wdXQuaW5wdXRzW2ldKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dHMucHVzaChuZXcgdW5vcF9leHByKHRoaXMuYnRtLCAnLycsaW5CKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dHMucHVzaChpbkIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldFZhbCA9IG5ldyBtdWx0aW9wX2V4cHIodGhpcy5idG0sICcqJywgaW5wdXRzKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sIHRoaXMub3AsIGluQSwgaW5CKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ocmV0VmFsKTtcbiAgICB9XG5cbiAgICBjb3B5KCkge1xuICAgICAgdmFyIGluQSA9IHRoaXMuaW5wdXRzWzBdLmNvcHkoKTtcbiAgICAgIHZhciBpbkIgPSB0aGlzLmlucHV0c1sxXS5jb3B5KCk7XG4gICAgICByZXR1cm4gKG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCB0aGlzLm9wLCBpbkEsIGluQikpO1xuICAgIH1cblxuICAgIGNvbXBvc2UoYmluZGluZ3MpIHtcbiAgICAgICAgdmFyIGluQSA9IHRoaXMuaW5wdXRzWzBdLmNvbXBvc2UoYmluZGluZ3MpO1xuICAgICAgICB2YXIgaW5CID0gdGhpcy5pbnB1dHNbMV0uY29tcG9zZShiaW5kaW5ncyk7XG5cbiAgICAgICAgdmFyIHJldFZhbDtcbiAgICAgICAgcmV0VmFsID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sIHRoaXMub3AsIGluQSwgaW5CKTtcbiAgICAgICAgaWYgKGluQS50eXBlID09IGV4cHJUeXBlLm51bWJlciAmJiBpbkIudHlwZSA9PSBleHByVHlwZS5udW1iZXIpIHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5vcCkge1xuICAgICAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIGluQS5udW1iZXIuYWRkKGluQi5udW1iZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgaW5BLm51bWJlci5zdWJ0cmFjdChpbkIubnVtYmVyKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIGluQS5udW1iZXIubXVsdGlwbHkoaW5CLm51bWJlcikpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCBpbkEubnVtYmVyLmRpdmlkZShpbkIubnVtYmVyKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWwpO1xuICAgIH1cblxuICAgIGRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCkge1xuICAgICAgICB2YXIgdUNvbnN0ID0gdGhpcy5pbnB1dHNbMF0uaXNDb25zdGFudCgpO1xuICAgICAgICB2YXIgdkNvbnN0ID0gdGhpcy5pbnB1dHNbMV0uaXNDb25zdGFudCgpO1xuXG4gICAgICAgIHZhciB0aGVEZXJpdjtcbiAgICAgICAgaWYgKHVDb25zdCAmJiB2Q29uc3QpIHtcbiAgICAgICAgICAgIHRoZURlcml2ID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBkdWR4LCBkdmR4O1xuXG4gICAgICAgICAgICBpZiAodUNvbnN0KSB7XG4gICAgICAgICAgICAgICAgZHVkeCA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGR1ZHggPSB0aGlzLmlucHV0c1swXS5kZXJpdmF0aXZlKGl2YXIsIHZhckxpc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZDb25zdCkge1xuICAgICAgICAgICAgICAgIGR2ZHggPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkdmR4ID0gdGhpcy5pbnB1dHNbMV0uZGVyaXZhdGl2ZShpdmFyLCB2YXJMaXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5vcCkge1xuICAgICAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnKycsIGR1ZHgsIGR2ZHgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJy0nLCBkdWR4LCBkdmR4KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgICAgIHZhciB1ZHYgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJyonLCB0aGlzLmlucHV0c1swXSwgZHZkeClcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZkdSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnKicsIGR1ZHgsIHRoaXMuaW5wdXRzWzFdKVxuICAgICAgICAgICAgICAgICAgICBpZiAodUNvbnN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IHVkdjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2Q29uc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZURlcml2ID0gdmR1O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJysnLCB2ZHUsIHVkdik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgICAgIGlmICh2Q29uc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZURlcml2ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcvJywgZHVkeCwgdGhpcy5pbnB1dHNbMV0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHVDb25zdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG51bWVyID0gbmV3IHVub3BfZXhwcih0aGlzLmJ0bSwgJy0nLCBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJyonLCB0aGlzLmlucHV0c1swXSwgZHZkeCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlbm9tID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICdeJywgdGhpcy5pbnB1dHNbMV0sIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJy8nLCBudW1lciwgZGVub20pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVkdiA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnKicsIHRoaXMuaW5wdXRzWzBdLCBkdmR4KVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZkdSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnKicsIGR1ZHgsIHRoaXMuaW5wdXRzWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG51bWVyID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICctJywgdmR1LCB1ZHYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlbm9tID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICdeJywgdGhpcy5pbnB1dHNbMV0sIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJy8nLCBudW1lciwgZGVub20pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgICAgICAgICAgICB2YXIgcG93RGVwID0gdGhpcy5pbnB1dHNbMV0uZGVwZW5kZW5jaWVzKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpdmFyTmFtZSA9ICh0eXBlb2YgaXZhciA9PSAnc3RyaW5nJykgPyBpdmFyIDogaXZhci5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAvLyBTZWUgaWYgdGhlIHBvd2VyIGRlcGVuZHMgb24gdGhlIHZhcmlhYmxlXG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3dEZXAubGVuZ3RoID4gMCAmJiBwb3dEZXAuaW5kZXhPZihpdmFyTmFtZSkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZUFyZyA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnKicsIHRoaXMuaW5wdXRzWzFdLCBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLmJ0bSwgJ2xvZycsIHRoaXMuaW5wdXRzWzBdKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlRmNuID0gbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5idG0sICdleHAnLCB0aGVBcmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSB0aGVGY24uZGVyaXZhdGl2ZShpdmFyLCB2YXJMaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlIHRoaXMgaXMgYSBzaW1wbGUgYXBwbGljYXRpb24gb2YgdGhlIHBvd2VyIHJ1bGVcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdUNvbnN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3UG93ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICctJywgdGhpcy5pbnB1dHNbMV0sIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGR5ZHUgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJyonLCB0aGlzLmlucHV0c1sxXSwgbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICdeJywgdGhpcy5pbnB1dHNbMF0sIG5ld1BvdykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzWzBdLnR5cGUgPT0gZXhwclR5cGUudmFyaWFibGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbMF0ubmFtZSA9PSBpdmFyTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZURlcml2ID0gZHlkdTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGR1ZHggPSB0aGlzLmlucHV0c1swXS5kZXJpdmF0aXZlKGl2YXIsIHZhckxpc3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZURlcml2ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcqJywgZHlkdSwgZHVkeCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGUgYmluYXJ5IG9wZXJhdG9yICdcIiArIHRoaXMub3AgKyBcIicgaXMgbm90IGRlZmluZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHRoZURlcml2KTtcbiAgICB9XG59XG4iLCIvKiFcbiAqIEJUTSBKYXZhU2NyaXB0IExpYnJhcnkgdkBWRVJTSU9OXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGJyaWFud2FsdG9uL0JUTVxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogRGVmaW5lIHRoZSBEZXJpdmF0aXZlIG9mIGFuIEV4cHJlc3Npb25cbiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmltcG9ydCB7IGV4cHJlc3Npb24gfSBmcm9tIFwiLi9leHByZXNzaW9uLmpzXCJcbmltcG9ydCB7IHZhcmlhYmxlX2V4cHIgfSBmcm9tIFwiLi92YXJpYWJsZV9leHByLmpzXCJcbmltcG9ydCB7IGV4cHJUeXBlIH0gZnJvbSBcIi4vQlRNX3Jvb3QuanNcIlxuXG5leHBvcnQgY2xhc3MgZGVyaXZfZXhwciBleHRlbmRzIGV4cHJlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKGJ0bSwgZm9ybXVsYSwgdmFyaWFibGUsIGF0VmFsdWUpIHtcbiAgICAgICAgc3VwZXIoYnRtKTtcbiAgICAgICAgdGhpcy50eXBlID0gZXhwclR5cGUub3BlcmF0b3I7XG4gICAgICAgIHRoaXMub3AgPSBcIkRcIjtcbiAgICAgICAgaWYgKHR5cGVvZiBmb3JtdWxhID09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgZm9ybXVsYSA9IG5ldyBleHByZXNzaW9uKHRoaXMuYnRtKTtcbiAgICAgICAgaWYgKHR5cGVvZiB2YXJpYWJsZSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdmFyaWFibGUgPSBuZXcgdmFyaWFibGVfZXhwcih0aGlzLmJ0bSwgJ3gnKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFyaWFibGUgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhcmlhYmxlID0gbmV3IHZhcmlhYmxlX2V4cHIodGhpcy5idG0sIHZhcmlhYmxlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLml2YXIgPSB2YXJpYWJsZTtcbiAgICAgICAgdGhpcy5pdmFyVmFsdWUgPSBhdFZhbHVlO1xuICAgICAgICB0aGlzLmlucHV0cyA9IFtmb3JtdWxhXTtcbiAgICAgICAgdGhpcy5pc1JhdGUgPSBmYWxzZTtcbiAgICAgICAgZm9ybXVsYS5wYXJlbnQgPSB0aGlzO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICB2YXIgdGhlU3RyO1xuICAgICAgICB2YXIgZXhwclN0ciwgdmFyU3RyLCB2YWxTdHI7XG5cbiAgICAgICAgdmFyU3RyID0gdGhpcy5pdmFyLnRvU3RyaW5nKCk7XG4gICAgICAgIGV4cHJTdHIgPSB0aGlzLmlucHV0c1swXS50b1N0cmluZygpO1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaXZhclZhbHVlICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB2YWxTdHIgPSB0aGlzLml2YXJWYWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgdGhlU3RyID0gXCJEKFwiK2V4cHJTdHIrXCIsXCIrdmFyU3RyK1wiLFwiK3ZhbFN0citcIilcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoZVN0ciA9IFwiRChcIitleHByU3RyK1wiLFwiK3ZhclN0citcIilcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4odGhlU3RyKTtcbiAgICB9XG5cbiAgICB0b1RlWChzaG93U2VsZWN0KSB7XG4gICAgICAgIHZhciB0aGVTdHI7XG4gICAgICAgIHZhciBvcFN0ciwgdmFyU3RyLCBleHByU3RyLCB2YWxTdHI7XG5cbiAgICAgICAgdmFyU3RyID0gdGhpcy5pdmFyLnRvVGVYKCk7XG4gICAgICAgIGV4cHJTdHIgPSB0aGlzLmlucHV0c1swXS50b1RlWCgpO1xuICAgICAgICBpZiAodGhpcy5pc1JhdGUgJiYgdGhpcy5pbnB1dHNbMF0udHlwZSA9PSBleHByVHlwZS52YXJpYWJsZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLml2YXJWYWx1ZSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHZhbFN0ciA9IHRoaXMuaXZhclZhbHVlLnRvVGVYKCk7XG4gICAgICAgICAgICAgICAgdGhlU3RyID0gXCJcXFxcbGVmdC4gXFxcXGZyYWN7ZFwiICsgZXhwclN0ciArIFwifXtkXCIrdmFyU3RyK1wifSBcXFxccmlnaHR8X3tcIlxuICAgICAgICAgICAgICAgICAgICArIHZhclN0ciArIFwiPVwiICsgdmFsU3RyICsgXCJ9XCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoZVN0ciA9IFwiXFxcXGZyYWN7ZFwiICsgZXhwclN0ciArXCJ9e2RcIit2YXJTdHIrXCJ9XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuaXZhclZhbHVlICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgdmFsU3RyID0gdGhpcy5pdmFyVmFsdWUudG9UZVgoKTtcbiAgICAgICAgICAgICAgICBvcFN0ciA9IFwiXFxcXGxlZnQuIFxcXFxmcmFje2R9e2RcIit2YXJTdHIrXCJ9IFxcXFxyaWdodHxfe1wiXG4gICAgICAgICAgICAgICAgICAgICsgdmFyU3RyICsgXCI9XCIgKyB2YWxTdHIgKyBcIn1cIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3BTdHIgPSBcIlxcXFxmcmFje2R9e2RcIit2YXJTdHIrXCJ9XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGVTdHIgPSBvcFN0ciArIFwiXFxcXEJpZ1tcIiArIGV4cHJTdHIgKyBcIlxcXFxCaWddXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHRoZVN0cik7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRlc3RlZCBlcXVpdmFsZW50IHN0cmluZ3MuXG4gICAgYWxsU3RyaW5nRXF1aXZzKCkge1xuICAgICAgICB2YXIgYWxsSW5wdXRzID0gdGhpcy5pbnB1dHNbMF0uYWxsU3RyaW5nRXF1aXZzKCk7XG4gICAgICAgIHZhciB2YXJTdHIsIHZhbFN0cjtcbiAgICAgICAgdmFyIHJldFZhbHVlID0gW107XG5cbiAgICAgICAgdmFyU3RyID0gdGhpcy5pdmFyLnRvU3RyaW5nKCk7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pdmFyVmFsdWUgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHZhbFN0ciA9IHRoaXMuaXZhclZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSBpbiBhbGxJbnB1dHMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5pdmFyVmFsdWUgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICByZXRWYWx1ZVtpXSA9IFwiRChcIithbGxJbnB1dHNbaV0rXCIsXCIrdmFyU3RyK1wiLFwiK3ZhbFN0citcIilcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0VmFsdWVbaV0gPSBcIkQoXCIrYWxsSW5wdXRzW2ldK1wiLFwiK3ZhclN0citcIilcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihhbGxJbnB1dHMpO1xuICAgIH1cblxuICAgIHRvTWF0aE1MKCkge1xuICAgICAgICB2YXIgdGhlU3RyO1xuICAgICAgICB2YXIgZXhwclN0cjtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaW5wdXRzWzBdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBleHByU3RyID0gJz8nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhwclN0ciA9IHRoaXMuaW5wdXRzWzBdLnRvTWF0aE1MKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhlU3RyID0gXCI8YXBwbHk+PGRlcml2YXRpdmUvPlwiICsgZXhwclN0ciArIFwiPC9hcHBseT5cIjtcblxuICAgICAgICByZXR1cm4odGhlU3RyKTtcbiAgICB9XG5cbiAgICBldmFsdWF0ZShiaW5kaW5ncykge1xuICAgICAgICB2YXIgcmV0VmFsO1xuICAgICAgICB2YXIgZGVyaXZFeHByO1xuICAgICAgICB2YXIgZGJpbmQgPSB7fTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaXZhclZhbHVlICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBkYmluZFt0aGlzLml2YXIubmFtZV0gPSB0aGlzLml2YXJWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDb21wdXRlIHRoZSBkZXJpdmF0aXZlIG9mIHRoZSBleHByZXNzaW9uLCB0aGVuIGV2YWx1YXRlIGF0IGJpbmRpbmdcbiAgICAgICAgZGVyaXZFeHByID0gdGhpcy5pbnB1dHNbMF0uZGVyaXZhdGl2ZSh0aGlzLml2YXIsIGJpbmRpbmdzKTtcbiAgICAgICAgZGVyaXZFeHByID0gZGVyaXZFeHByLmNvbXBvc2UoZGJpbmQpO1xuICAgICAgICByZXRWYWwgPSBkZXJpdkV4cHIuZXZhbHVhdGUoYmluZGluZ3MpO1xuICAgICAgICByZXR1cm4ocmV0VmFsKTtcbiAgICB9XG5cbiAgICBzaW1wbGlmeUNvbnN0YW50cygpIHtcbiAgICAgICAgcmV0dXJuKHRoaXMpO1xuICAgIH1cblxuICAgIGZsYXR0ZW4oKSB7XG4gICAgICByZXR1cm4gKG5ldyBkZXJpdl9leHByKHRoaXMuYnRtLCB0aGlzLmlucHV0c1swXS5mbGF0dGVuKCksIHRoaXMuaXZhciwgdGhpcy5pdmFyVmFsdWUpKTtcbiAgICB9XG5cbiAgICBjb3B5KCkge1xuICAgICAgcmV0dXJuIChuZXcgZGVyaXZfZXhwcih0aGlzLmJ0bSwgdGhpcy5pbnB1dHNbMF0uY29weSgpLCB0aGlzLml2YXIsIHRoaXMuaXZhclZhbHVlKSk7XG4gICAgfVxuXG5cbiAgICBjb21wb3NlKGJpbmRpbmdzKSB7XG4gICAgfVxuXG4gICAgZGVyaXZhdGl2ZShpdmFyLCB2YXJMaXN0KSB7XG4gICAgICAgIHZhciBkYmluZCA9IHt9O1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pdmFyVmFsdWUgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGRiaW5kW3RoaXMuaXZhcl0gPSB0aGlzLml2YXJWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBFdmFsdWF0ZSB0aGUgbWFpbiBleHByZXNzaW9uIHVzaW5nIG9yaWdpbmFsIGJpbmRpbmdcbiAgICAgICAgdmFyIGZpcnN0RGVyaXYgPSB0aGlzLmlucHV0c1swXS5kZXJpdmF0aXZlKHRoaXMuaXZhciwgdmFyTGlzdCk7XG4gICAgICAgIGZpcnN0RGVyaXYuY29tcG9zZShkYmluZCk7XG5cbiAgICAgICAgLy8gTm93IGRpZmZlcmVudGlhdGUgdGhhdCBleHByZXNzaW9uIHVzaW5nIG5ldyBiaW5kaW5nLlxuICAgICAgICByZXR1cm4gZmlyc3REZXJpdi5kZXJpdmF0aXZlKGl2YXIsIHZhckxpc3QpO1xuICAgIH1cbn1cbiIsIi8qIVxuICogQlRNIEphdmFTY3JpcHQgTGlicmFyeSB2QFZFUlNJT05cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kYnJpYW53YWx0b24vQlRNXG4gKlxuICogQ29weXJpZ2h0IEQuIEJyaWFuIFdhbHRvblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIChodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVClcbiAqXG4gKiBEYXRlOiBAREFURVxuICovXG5cbmltcG9ydCB7IEJUTSwgZXhwclZhbHVlIH0gZnJvbSBcIi4vQlRNX3Jvb3QuanNcIlxuaW1wb3J0IHsgZmluZE1hdGNoUnVsZXMgfSBmcm9tIFwiLi9yZWR1Y3Rpb25zLmpzXCJcblxuZXhwb3J0IGNsYXNzIE1hdGhPYmplY3Qge1xuICAgIGNvbnN0cnVjdG9yKGJ0bSkge1xuICAgICAgICB0aGlzLmJ0bSA9IGJ0bTtcbiAgICAgICAgaWYgKCEoYnRtIGluc3RhbmNlb2YgQlRNKSkge1xuICAgICAgICAgICAgdGhyb3cgXCJNYXRoT2JqZWN0IGNvbnN0cnVjdGVkIHdpdGggaW52YWxpZCBlbnZpcm9ubWVudFwiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VsZWN0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5pbnB1dHMgPSBbXTtcbiAgICAgICAgdGhpcy52YWx1ZVR5cGUgPSBleHByVmFsdWUudW5kZWY7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgXG4gICAgLy8gTWV0aG9kIHRvICpldmFsdWF0ZSogdGhlIG9iamVjdC5cbiAgICAvLyAtIFJldHVybiB1bmRlZmluZWRcbiAgICB2YWx1ZShiaW5kaW5ncykge1xuICAgIH1cbiAgICBcbiAgICAvLyBVcGRhdGUgY29udGV4dCBzZXR0aW5nXG4gICAgc2V0Q29udGV4dChjb250ZXh0KSB7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIC8vIFVwZGF0ZSBjb250ZXh0IG9uIGlucHV0cy5cbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgdGhpcy5pbnB1dHNbaV0uc2V0Q29udGV4dChjb250ZXh0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdoZW4gdGhlIHBhcnNlciB0aHJvd3MgYW4gZXJyb3IsIG5lZWQgdG8gcmVjb3JkIGl0LlxuICAgIHNldFBhcnNpbmdFcnJvcihlcnJvclN0cmluZykge1xuICAgICAgICB0aGlzLnBhcnNlRXJyb3IgPSBlcnJvclN0cmluZztcbiAgICB9XG5cbiAgICAvLyBFcnJvcnMgZnJvbSBwYXJzaW5nLiBDaGVjayBhbGwgcG9zc2libGUgY2hpbGRyZW4gKHJlY3Vyc2l2ZWx5KVxuICAgIGhhc1BhcnNpbmdFcnJvcigpIHtcbiAgICAgICAgdmFyIHJldFZhbHVlID0gZmFsc2UsXG4gICAgICAgICAgICBpID0gMDtcbiAgICAgICAgaWYgKHRoaXMucGFyc2VFcnJvcikge1xuICAgICAgICAgICAgcmV0VmFsdWUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKCFyZXRWYWx1ZSAmJiBpIDwgdGhpcy5pbnB1dHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBDaGVjayBmb3IgcmVkdWN0aW9ucyBvbiBpbnB1dHMuXG4gICAgICAgICAgICByZXRWYWx1ZSA9IHRoaXMuaW5wdXRzW2ldLmhhc1BhcnNpbmdFcnJvcigpO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXRWYWx1ZTtcbiAgICB9XG4gICAgXG4gICAgLy8gRXJyb3JzIGZyb20gcGFyc2luZy4gRmluZCB0aGUgKmZpcnN0KiBlcnJvciBpbiB0aGUgcGFyc2luZyBwcm9jZXNzLlxuICAgIGdldFBhcnNpbmdFcnJvcigpIHtcbiAgICAgICAgdmFyIGVyclN0cmluZyA9IHRoaXMucGFyc2VFcnJvcjtcbiAgICAgICAgdmFyIGk9MDtcbiAgICAgICAgd2hpbGUgKCFlcnJTdHJpbmcgJiYgaSA8IHRoaXMuaW5wdXRzLmxlbmd0aCkge1xuICAgICAgICAgICAgZXJyU3RyaW5nID0gdGhpcy5pbnB1dHNbaV0uZ2V0UGFyc2luZ0Vycm9yKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChlcnJTdHJpbmcpO1xuICAgIH1cbiAgICBcbiAgICAvLyBNZXRob2QgdG8gZ2VuZXJhdGUgdGhlIGV4cHJlc3Npb24gYXMgaW5wdXQtc3R5bGUgc3RyaW5nLlxuICAgIHRvU3RyaW5nKGVsZW1lbnRPbmx5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgZWxlbWVudE9ubHkgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGVsZW1lbnRPbmx5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRoZVN0ciA9ICcnO1xuICAgICAgICByZXR1cm4odGhlU3RyKTtcbiAgICB9XG4gICAgXG4gICAgLy8gTWV0aG9kIHRvIGdlbmVyYXRlIHRoZSBleHByZXNzaW9uIHVzaW5nIHByZXNlbnRhdGlvbi1zdHlsZSAoTGFUZVgpXG4gICAgLy8gLSBzaG93U2VsZWN0IGlzIHNvIHRoYXQgcGFydCBvZiB0aGUgZXhwcmVzc2lvbiBjYW4gYmUgaGlnaGxpZ2h0ZWRcbiAgICB0b1RlWChzaG93U2VsZWN0KSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2hvd1NlbGVjdCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgc2hvd1NlbGVjdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybih0aGlzLnRvU3RyaW5nKCkpO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZCB0byByZXByZXNlbnQgdGhlIGV4cHJlc3Npb24gdXNpbmcgTWF0aE1MXG4gICAgdG9NYXRoTUwoKSB7XG4gICAgICAgIHJldHVybihcIjxtaT5cIiArIHRoaXMudG9TdHJpbmcoKSArIFwiPC9taT5cIik7XG4gICAgfVxuICAgIFxuICAgIC8vIFJldHVybiBhbiBhcnJheSBjb250YWluaW5nIGFsbCB0ZXN0ZWQgZXF1aXZhbGVudCBzdHJpbmdzLlxuICAgIGFsbFN0cmluZ0VxdWl2cygpIHtcbiAgICAgICAgcmV0dXJuKFtdKTtcbiAgICB9XG4gICAgXG4gICAgLy8gVG8gY29udmVydCBiaW5hcnkgdHJlZSBzdHJ1Y3R1cmUgdG8gbi1hcnkgdHJlZSBmb3Igc3VwcG9ydGVkIG9wZXJhdGlvbnMgKCsgYW5kICopXG4gICAgLy8gTW9zdCB0aGluZ3MgY2FuJ3QgZmxhdHRlbi4gUmV0dXJuIGEgY29weS5cbiAgICBmbGF0dGVuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb3B5KCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFRlc3QgaWYgdGhlIGV4cHJlc3Npb24gZXZhbHVhdGVzIHRvIGEgY29uc3RhbnQuXG4gICAgaXNDb25zdGFudCgpIHtcbiAgICAgICAgdmFyIHJldFZhbHVlID0gZmFsc2U7XG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFRlc3QgaWYgdGhlIGV4cHJlc3Npb24gZXZhbHVhdGVzIHRvIGEgY29uc3RhbnQuXG4gICAgaXNFeHByZXNzaW9uKCkge1xuICAgICAgICB2YXIgcmV0VmFsdWUgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuKHJldFZhbHVlKTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIGV4cHJlc3Npb24gZXh0ZW5kcyBNYXRoT2JqZWN0IHtcbiAgY29uc3RydWN0b3IoYnRtKSB7XG4gICAgICAgIGlmICghKGJ0bSBpbnN0YW5jZW9mIEJUTSkpIHtcbiAgICAgICAgICAgIHRocm93IFwiZXhwcmVzc2lvbiBjb25zdHJ1Y3RlZCB3aXRoIGludmFsaWQgZW52aXJvbm1lbnRcIjtcbiAgICAgICAgfVxuICAgICAgICBzdXBlcihidG0pO1xuICAgICAgICB0aGlzLnNlbGVjdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuaW5wdXRzID0gW107XG4gICAgICAgIHRoaXMudmFsdWVUeXBlID0gZXhwclZhbHVlLm51bWVyaWM7XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kIHRvICpldmFsdWF0ZSogdGhlIHZhbHVlIG9mIHRoZSBleHByZXNzaW9uIHVzaW5nIGdpdmVuIHN5bWJvbCBiaW5kaW5ncy5cbiAgICAvLyAtIFJldHVybiBuYXRpdmUgTnVtYmVyIHZhbHVlXG4gICAgdmFsdWUoYmluZGluZ3MpIHtcbiAgICAgICAgcmV0dXJuKHRoaXMuZXZhbHVhdGUoYmluZGluZ3MpKTtcbiAgICB9XG5cbiAgICAvLyBXaGVuIHRoZSBwYXJzZXIgdGhyb3dzIGFuIGVycm9yLCBuZWVkIHRvIHJlY29yZCBpdC5cbiAgICBzZXRQYXJzaW5nRXJyb3IoZXJyb3JTdHJpbmcpIHtcbiAgICAgICAgdGhpcy5wYXJzZUVycm9yID0gZXJyb3JTdHJpbmc7XG4gICAgfVxuXG4gICAgLy8gRXJyb3JzIGZyb20gcGFyc2luZy4gQ2hlY2sgYWxsIHBvc3NpYmxlIGNoaWxkcmVuIChyZWN1cnNpdmVseSlcbiAgICBoYXNQYXJzaW5nRXJyb3IoKSB7XG4gICAgICAgIHZhciByZXRWYWx1ZSA9IGZhbHNlLFxuICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgIGlmICh0aGlzLnBhcnNlRXJyb3IpIHtcbiAgICAgICAgICAgIHJldFZhbHVlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlICghcmV0VmFsdWUgJiYgaSA8IHRoaXMuaW5wdXRzLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIHJlZHVjdGlvbnMgb24gaW5wdXRzLlxuICAgICAgICAgICAgcmV0VmFsdWUgPSB0aGlzLmlucHV0c1tpXS5oYXNQYXJzaW5nRXJyb3IoKTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0VmFsdWU7XG4gICAgfVxuXG4gICAgLy8gRXJyb3JzIGZyb20gcGFyc2luZy4gRmluZCB0aGUgKmZpcnN0KiBlcnJvciBpbiB0aGUgcGFyc2luZyBwcm9jZXNzLlxuICAgIGdldFBhcnNpbmdFcnJvcigpIHtcbiAgICAgICAgdmFyIGVyclN0cmluZyA9IHRoaXMucGFyc2VFcnJvcjtcbiAgICAgICAgdmFyIGk9MDtcbiAgICAgICAgd2hpbGUgKCFlcnJTdHJpbmcgJiYgaSA8IHRoaXMuaW5wdXRzLmxlbmd0aCkge1xuICAgICAgICAgICAgZXJyU3RyaW5nID0gdGhpcy5pbnB1dHNbaV0uZ2V0UGFyc2luZ0Vycm9yKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChlcnJTdHJpbmcpO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZCB0byBnZW5lcmF0ZSB0aGUgZXhwcmVzc2lvbiBhcyBpbnB1dC1zdHlsZSBzdHJpbmcuXG4gICAgdG9TdHJpbmcoZWxlbWVudE9ubHkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50T25seSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZWxlbWVudE9ubHkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGhlU3RyID0gJyc7XG4gICAgICAgIHJldHVybih0aGVTdHIpO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZCB0byBnZW5lcmF0ZSB0aGUgZXhwcmVzc2lvbiB1c2luZyBwcmVzZW50YXRpb24tc3R5bGUgKExhVGVYKVxuICAgIC8vIC0gc2hvd1NlbGVjdCBpcyBzbyB0aGF0IHBhcnQgb2YgdGhlIGV4cHJlc3Npb24gY2FuIGJlIGhpZ2hsaWdodGVkXG4gICAgdG9UZVgoc2hvd1NlbGVjdCkge1xuICAgICAgICBpZiAodHlwZW9mIHNob3dTZWxlY3QgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHNob3dTZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4odGhpcy50b1N0cmluZygpKTtcbiAgICB9XG5cbiAgICAvLyBNZXRob2QgdG8gcmVwcmVzZW50IHRoZSBleHByZXNzaW9uIHVzaW5nIE1hdGhNTFxuICAgIHRvTWF0aE1MKCkge1xuICAgICAgICByZXR1cm4oXCI8bWk+XCIgKyB0aGlzLnRvU3RyaW5nKCkgKyBcIjwvbWk+XCIpO1xuICAgIH1cblxuICAgIG9wZXJhdGVUb1RlWCgpIHtcbiAgICAgICAgcmV0dXJuKHRoaXMudG9UZVgoKSk7XG4gICAgfVxuXG4gICAgdHJlZVRvVGVYKGV4cGFuZCkge1xuICAgICAgICB2YXIgcmV0U3RydWN0ID0ge307XG4gICAgICAgIFxuICAgICAgICByZXRTdHJ1Y3QucGFyZW50ID0gKHR5cGVvZiB0aGlzLnBhcmVudCA9PT0gJ3VuZGVmaW5lZCcgfHwgdGhpcy5wYXJlbnQgPT09IG51bGwpID8gbnVsbCA6IHRoaXMucGFyZW50Lm9wZXJhdGVUb1RlWCgpO1xuICAgICAgICBpZiAodHlwZW9mIGV4cGFuZCA9PT0gJ3VuZGVmaW5lZCcgfHwgIWV4cGFuZCkge1xuICAgICAgICAgICAgcmV0U3RydWN0LmN1cnJlbnQgPSB0aGlzLnRvVGVYKCk7XG4gICAgICAgICAgICByZXRTdHJ1Y3QuaW5wdXRzID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldFN0cnVjdC5jdXJyZW50ID0gdGhpcy5vcGVyYXRlVG9UZVgoKTtcbiAgICAgICAgICAgIHJldFN0cnVjdC5pbnB1dHMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgICAgICByZXRTdHJ1Y3QuaW5wdXRzW2ldID0gdGhpcy5pbnB1dHNbaV0udG9UZVgoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ocmV0U3RydWN0KTtcbiAgICB9XG5cblxuICAgIC8vIFJldHVybiBhbiBhcnJheSBjb250YWluaW5nIGFsbCB0ZXN0ZWQgZXF1aXZhbGVudCBzdHJpbmdzLlxuICAgIGFsbFN0cmluZ0VxdWl2cygpIHtcbiAgICAgICAgcmV0dXJuKFtdKTtcbiAgICB9XG5cbiAgICAvLyBUbyBjb252ZXJ0IGJpbmFyeSB0cmVlIHN0cnVjdHVyZSB0byBuLWFyeSB0cmVlIGZvciBzdXBwb3J0ZWQgb3BlcmF0aW9ucyAoKyBhbmQgKilcbiAgICAvLyBNb3N0IHRoaW5ncyBjYW4ndCBmbGF0dGVuLiBSZXR1cm4gYSBjb3B5LlxuICAgIGZsYXR0ZW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvcHkoKTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgYSBuZXcgZXhwcmVzc2lvbiB0aGF0IGlzIGEgY29weS5cbiAgICBjb3B5KCkge1xuICAgICAgICB2YXIgbXlDb3B5ID0gbmV3IGV4cHJlc3Npb24odGhpcy5idG0pO1xuICAgICAgICByZXR1cm4gbXlDb3B5O1xuICAgIH1cblxuICAgIC8vIFdoZW4gc3VidHJlZSBvbmx5IGludm9sdmVzIGNvbnN0YW50cywgc2ltcGxpZnkgdGhlIGZvcm11bGEgdG8gYSB2YWx1ZS5cbiAgICAvLyBEZWZhdWx0OiBMb29rIGF0IGFsbCBkZXNjZW5kYW50cyAoaW5wdXRzKSBhbmQgc2ltcGxpZnkgdGhlcmUuXG4gICAgc2ltcGxpZnlDb25zdGFudHMoKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRzW2ldID0gdGhpcy5pbnB1dHNbaV0uc2ltcGxpZnlDb25zdGFudHMoKTtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRzW2ldLnBhcmVudCA9IHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHRoaXMpO1xuICAgIH1cblxuICAgIC8vIEZpbmQgYWxsIGRlcGVuZGVuY2llcyAoc3ltYm9scykgcmVxdWlyZWQgdG8gZXZhbHVhdGUgZXhwcmVzc2lvbi5cbiAgICBkZXBlbmRlbmNpZXMoZm9yY2VkKSB7XG4gICAgICAgIHZhciBpbkRlcHM7XG4gICAgICAgIHZhciBpLCBqO1xuICAgICAgICB2YXIgZGVwQXJyYXkgPSBuZXcgQXJyYXkoKTtcblxuICAgICAgICB2YXIgbWFzdGVyID0ge307XG4gICAgICAgIGlmIChmb3JjZWQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8Zm9yY2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGVwQXJyYXkucHVzaChmb3JjZWRbaV0pO1xuICAgICAgICAgICAgICAgIG1hc3Rlcltmb3JjZWRbaV1dID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgIGluRGVwcyA9IHRoaXMuaW5wdXRzW2ldLmRlcGVuZGVuY2llcygpO1xuICAgICAgICAgICAgZm9yIChqIGluIGluRGVwcykge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWFzdGVyW2luRGVwc1tqXV0gPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICBkZXBBcnJheS5wdXNoKGluRGVwc1tqXSk7XG4gICAgICAgICAgICAgICAgICAgIG1hc3RlcltpbkRlcHNbal1dID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4oZGVwQXJyYXkpO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZCB0byByZXR1cm4gaW5wdXQgYXQgZ2l2ZW4gaW5kZXguXG4gICAgZ2V0SW5wdXQod2hpY2hJbnB1dCkge1xuICAgICAgICB2YXIgaW5wdXRFeHByID0gbnVsbDtcbiAgICAgICAgaWYgKHdoaWNoSW5wdXQgPCAwIHx8IHdoaWNoSW5wdXQgPj0gdGhpcy5pbnB1dHMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aHJvdyAnQXR0ZW1wdCB0byBnZXQgYW4gdW5kZWZpbmVkIGlucHV0IGV4cHJlc3Npb24uJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlucHV0RXhwciA9IHRoaXMuaW5wdXRzW3doaWNoSW5wdXRdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihpbnB1dEV4cHIpO1xuICAgIH1cblxuICAgIC8vIFRlc3QgaWYgdGhlIGV4cHJlc3Npb24gZXZhbHVhdGVzIHRvIGEgY29uc3RhbnQuXG4gICAgaXNDb25zdGFudCgpIHtcbiAgICAgICAgdmFyIHJldFZhbHVlID0gdHJ1ZTtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgcmV0VmFsdWUgPSByZXRWYWx1ZSAmIHRoaXMuaW5wdXRzW2ldLmlzQ29uc3RhbnQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ocmV0VmFsdWUpO1xuICAgIH1cblxuICAgIC8vIEV2YWx1YXRlIHRoZSBleHByZXNzaW9uIGdpdmVuIHRoZSBiaW5kaW5ncyB0byBzeW1ib2xzLlxuICAgIGV2YWx1YXRlKGJpbmRpbmdzKSB7XG4gICAgICAgIHJldHVybigwKTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgYSAqbmV3KiBleHByZXNzaW9uIHdoZXJlIGEgc3ltYm9sIGlzICpyZXBsYWNlZCogYnkgYSBib3VuZCBleHByZXNzaW9uXG4gICAgY29tcG9zZShiaW5kaW5ncykge1xuICAgICAgICByZXR1cm4obmV3IGV4cHJlc3Npb24odGhpcy5idG0pKTtcbiAgICB9XG5cbiAgICAvLyBDb21wYXJlICp0aGlzKiBleHByZXNzaW9uIHRvIGEgZ2l2ZW4gKnRlc3RFeHByKi5cbiAgICAvLyAqb3B0aW9ucyogZ2l2ZXMgb3B0aW9ucyBhc3NvY2lhdGVkIHdpdGggdGVzdGluZyAoZS5nLiwgcmVsYXRpdmUgdG9sZXJhbmNlKVxuICAgIC8vIGJ1dCBhbHNvIHN1cHBvcnRzIGZpeGluZyBjZXJ0YWluIGJpbmRpbmdzLlxuICAgIC8vIFN1cHBvcnRzIGFic3RyYWN0IGlucHV0IG1hdGNoaW5nIGFnYWluc3QgdmFyaWFibGVzIHVzaW5nICptYXRjaElucHV0cypcbiAgICBjb21wYXJlKHRlc3RFeHByLCBvcHRpb25zLCBtYXRjaElucHV0cykge1xuICAgICAgICB2YXIgaXNFcXVhbCA9IHRydWU7XG4gICAgICAgIHZhciBpLCBuO1xuXG4gICAgICAgIGlmIChtYXRjaElucHV0cyA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG1hdGNoSW5wdXRzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGtub3duQmluZGluZ3MgPSBPYmplY3Qua2V5cyhvcHRpb25zKTtcbiAgICAgICAgdmFyIHVua25vd25CaW5kaW5ncyA9IFtdO1xuXG4gICAgICAgIHZhciByVG9sID0gMWUtODtcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnJUb2wgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByVG9sID0gb3B0aW9ucy5yVG9sO1xuICAgICAgICAgICAgaSA9IGtub3duQmluZGluZ3MuaW5kZXhPZignclRvbCcpO1xuICAgICAgICAgICAga25vd25CaW5kaW5ncy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGVwZW5kQSA9IHRoaXMuZGVwZW5kZW5jaWVzKCk7XG4gICAgICAgIHZhciBkZXBlbmRCID0gdGVzdEV4cHIuZGVwZW5kZW5jaWVzKCk7XG5cbiAgICAgICAgZm9yIChpPTA7IGk8ZGVwZW5kQS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGtub3duQmluZGluZ3MuaW5kZXhPZihkZXBlbmRBW2ldKSA8IDBcbiAgICAgICAgICAgICAgICAmJiB1bmtub3duQmluZGluZ3MuaW5kZXhPZihkZXBlbmRBW2ldKSA8IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdW5rbm93bkJpbmRpbmdzLnB1c2goZGVwZW5kQVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpPTA7IGk8ZGVwZW5kQi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGtub3duQmluZGluZ3MuaW5kZXhPZihkZXBlbmRCW2ldKSA8IDBcbiAgICAgICAgICAgICAgICAmJiB1bmtub3duQmluZGluZ3MuaW5kZXhPZihkZXBlbmRCW2ldKSA8IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdW5rbm93bkJpbmRpbmdzLnB1c2goZGVwZW5kQltpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDcmVhdGUgdGhlIGFycmF5cyBvZiB0ZXN0IHBvaW50cy5cbiAgICAgICAgdmFyIHZhcmlhYmxlTGlzdCA9IFtdO1xuICAgICAgICB2YXIgdGVzdFBvaW50TGlzdCA9IFtdO1xuICAgICAgICB2YXIgeCwgeE9wdCwgeE1pbiwgeE1heCwgZHgsIG4sIHRlc3RQb2ludHM7XG4gICAgICAgIG4gPSAxMDtcbiAgICAgICAgZm9yIChpPTA7IGk8a25vd25CaW5kaW5ncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgeCA9IGtub3duQmluZGluZ3NbaV07XG4gICAgICAgICAgICB4T3B0ID0gb3B0aW9uc1t4XTtcbiAgICAgICAgICAgIHhNaW4gPSB4T3B0Lm1pbjtcbiAgICAgICAgICAgIHhNYXggPSB4T3B0Lm1heDtcbiAgICAgICAgICAgIGR4ID0gKHhNYXgteE1pbikvbjtcbiAgICAgICAgICAgIHRlc3RQb2ludHMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGo9MDsgajxuOyBqKyspIHtcbiAgICAgICAgICAgICAgICB0ZXN0UG9pbnRzW2pdID0geE1pbitqKmR4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGVzdFBvaW50c1tuXSA9IHhNYXg7XG5cbiAgICAgICAgICAgIC8vIEFkZCB0aGlzIHRvIHRoZSBsaXN0IG9mIHRlc3RpbmcgYXJyYXlzLlxuICAgICAgICAgICAgdmFyaWFibGVMaXN0LnB1c2goeCk7XG4gICAgICAgICAgICB0ZXN0UG9pbnRMaXN0LnB1c2godGVzdFBvaW50cyk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpPTA7IGk8dW5rbm93bkJpbmRpbmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB4ID0gdW5rbm93bkJpbmRpbmdzW2ldO1xuICAgICAgICAgICAgeE1pbiA9IC0yO1xuICAgICAgICAgICAgeE1heCA9IDI7XG4gICAgICAgICAgICBkeCA9ICh4TWF4LXhNaW4pL247XG4gICAgICAgICAgICB0ZXN0UG9pbnRzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBqPTA7IGo8bjsgaisrKSB7XG4gICAgICAgICAgICAgICAgdGVzdFBvaW50c1tqXSA9IHhNaW4raipkeDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlc3RQb2ludHNbbl0gPSB4TWF4O1xuXG4gICAgICAgICAgICAvLyBBZGQgdGhpcyB0byB0aGUgbGlzdCBvZiB0ZXN0aW5nIGFycmF5cy5cbiAgICAgICAgICAgIHZhcmlhYmxlTGlzdC5wdXNoKHgpO1xuICAgICAgICAgICAgdGVzdFBvaW50TGlzdC5wdXNoKHRlc3RQb2ludHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm93IHdlIHdpbGwgcHJvY2VlZCB0aHJvdWdoIGFsbCBwb3NzaWJsZSBwb2ludHMuXG4gICAgICAgIC8vIEFuYWxvZ3k6IEVhY2ggdmFyaWFibGUgaXMgbGlrZSBvbmUgXCJkaWdpdFwiIG9uIGFuIG9kb21ldGVyLlxuICAgICAgICAvLyBHbyB0aHJvdWdoIGZ1bGwgY3ljbGUgb2YgYSB2YXJpYWJsZSdzIG9wdGlvbnMgYW5kIHRoZW4gYWR2YW5jZSB0aGUgbmV4dCB2YXJpYWJsZS5cbiAgICAgICAgLy8gVXNlIGFuIG9kb21ldGVyLWxpa2UgYXJyYXkgdGhhdCByZWZlcmVuY2VzIHdoaWNoIHBvaW50IGZyb21cbiAgICAgICAgLy8gZWFjaCBsaXN0IGlzIGJlaW5nIHVzZWQuIFdoZW4gdGhlIGxhc3QgZW50cnkgcmVhY2hlcyB0aGUgZW5kLFxuICAgICAgICAvLyB0aGUgb2RvbWV0ZXIgcm9sbHMgb3ZlciB1bnRpbCBhbGwgZW50cmllcyBhcmUgZG9uZS5cbiAgICAgICAgdmFyIG9kb21ldGVyID0gW107XG4gICAgICAgIGZvciAoaT0wOyBpPHZhcmlhYmxlTGlzdC5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIG9kb21ldGVyW2ldPTA7XG4gICAgICAgIHZhciBkb25lID0gZmFsc2U7XG4gICAgICAgIHdoaWxlICghZG9uZSAmJiBpc0VxdWFsKSB7XG4gICAgICAgICAgICB2YXIgeTEsIHkyO1xuICAgICAgICAgICAgdmFyIGJpbmRpbmdzID0ge307XG4gICAgICAgICAgICBmb3IgKGk9MDsgaTx2YXJpYWJsZUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB4ID0gdmFyaWFibGVMaXN0W2ldO1xuICAgICAgICAgICAgICAgIGJpbmRpbmdzW3hdID0gdGVzdFBvaW50TGlzdFtpXVtvZG9tZXRlcltpXV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB5MSA9IHRoaXMuZXZhbHVhdGUoYmluZGluZ3MpO1xuICAgICAgICAgICAgeTIgPSB0ZXN0RXhwci5ldmFsdWF0ZShiaW5kaW5ncyk7XG4gICAgICAgICAgICAvLyBCb3RoIGZpbml0ZT8gQ2hlY2sgZm9yIHJlbGF0aXZlIGVycm9yLlxuICAgICAgICAgICAgaWYgKGlzRmluaXRlKHkxKSAmJiBpc0Zpbml0ZSh5MikpIHtcbiAgICAgICAgICAgICAgICBpZiAoIShNYXRoLmFicyh5MSk8MWUtMTIgJiYgTWF0aC5hYnMoeTIpPDFlLTEyKVxuICAgICAgICAgICAgICAgICAgICAmJiBNYXRoLmFicyh5MS15MikvTWF0aC5hYnMoeTEpPnJUb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNFcXVhbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBJZiBvbmUgaXMgZmluaXRlLCBvdGhlciBtdXN0IGJlIE5hTlxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIChpc0Zpbml0ZSh5MSkgJiYgIWlzTmFOKHkyKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCAoaXNGaW5pdGUoeTIpICYmICFpc05hTih5MSkpICkge1xuICAgICAgICAgICAgICAgICAgICBpc0VxdWFsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQWR2YW5jZSB0aGUgb2RvbWV0ZXIuXG4gICAgICAgICAgICAgICAgdmFyIGo9MDtcbiAgICAgICAgICAgICAgICBkb25lID0gdHJ1ZTsgLy8gVGhpcyB3aWxsIG9ubHkgcGVyc2lzdCB3aGVuIHRoZSBvZG9tZXRlciBpcyBkb25lLlxuICAgICAgICAgICAgICAgIHdoaWxlIChqIDwgdmFyaWFibGVMaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBvZG9tZXRlcltqXSsrO1xuICAgICAgICAgICAgICAgICAgICBpZiAob2RvbWV0ZXJbal0gPj0gdGVzdFBvaW50TGlzdFtqXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9kb21ldGVyW2pdID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGorKztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1hdGNoSW5wdXRzICYmIGlzRXF1YWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2hPcDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcCA9PSAnKycgfHwgdGhpcy5vcCA9PSAnLScpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hPcCA9ICcrJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3AgPT0gJyonIHx8IHRoaXMub3AgPT0gJy8nKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoT3AgPSAnKic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgobWF0Y2hPcD09JysnICYmIHRlc3RFeHByLm9wICE9ICcrJyAmJiB0ZXN0RXhwci5vcCAhPSAnLScpXG4gICAgICAgICAgICAgICAgICAgIHx8IChtYXRjaE9wPT0nKicgJiYgdGVzdEV4cHIub3AgIT0gJyonICYmIHRlc3RFeHByLm9wICE9ICcvJykpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNFcXVhbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaXNFcXVhbCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmxhdEEsIGZsYXRCO1xuICAgICAgICAgICAgICAgICAgICBmbGF0QSA9IHRoaXMuZmxhdHRlbigpO1xuICAgICAgICAgICAgICAgICAgICBmbGF0QiA9IHRlc3RFeHByLmZsYXR0ZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZsYXRBLmlucHV0cy5sZW5ndGggPT0gZmxhdEIuaW5wdXRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5wdXRNYXRjaGVkID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaT0wOyBpPGZsYXRBLmlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRNYXRjaGVkW2ldID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gR28gdGhyb3VnaCBlYWNoIGlucHV0IG9mIHRlc3RFeHByIGFuZCBzZWUgaWYgaXQgbWF0Y2hlcyBvbiBvZiB0aGlzIGlucHV0cy5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChpPTA7IGk8ZmxhdEIuaW5wdXRzLmxlbmd0aCAmJiBpc0VxdWFsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXRjaEZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGo9MDsgajxmbGF0QS5pbnB1dHMubGVuZ3RoICYmICFtYXRjaEZvdW5kOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlucHV0TWF0Y2hlZFtqXSAmJiBmbGF0QS5pbnB1dHNbal0uY29tcGFyZShmbGF0Qi5pbnB1dHNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0TWF0Y2hlZFtqXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoRm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbWF0Y2hGb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRXF1YWwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlzRXF1YWwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKGlzRXF1YWwpO1xuICAgIH1cblxuICAgIC8vIEFwcGx5IHJlZHVjdGlvbiBydWxlcyB0byBjcmVhdGUgYSByZWR1Y2VkIGV4cHJlc3Npb25cbiAgICByZWR1Y2UoKSB7XG4gICAgICAgIHZhciB3b3JrRXhwciA9IHRoaXMuc2ltcGxpZnlDb25zdGFudHMoKTtcbiAgICAgICAgdmFyIG1hdGNoUnVsZXM7XG5cbiAgICAgICAgLy8gQ2hlY2sgZm9yIHJlZHVjdGlvbnMgb24gaW5wdXRzLlxuICAgICAgICBmb3IgKHZhciBpIGluIHdvcmtFeHByLmlucHV0cykge1xuICAgICAgICAgICAgd29ya0V4cHIuaW5wdXRzW2ldID0gd29ya0V4cHIuaW5wdXRzW2ldLnJlZHVjZSgpO1xuICAgICAgICB9XG4gICAgICAgIG1hdGNoUnVsZXMgPSBmaW5kTWF0Y2hSdWxlcyh0aGlzLmJ0bS5yZWR1Y2VSdWxlcywgd29ya0V4cHIsIHRydWUpO1xuICAgICAgICB3aGlsZSAobWF0Y2hSdWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB3b3JrRXhwciA9IHRoaXMuYnRtLnBhcnNlKG1hdGNoUnVsZXNbMF0uc3ViU3RyLCB0aGlzLmNvbnRleHQpO1xuICAgICAgICAgICAgbWF0Y2hSdWxlcyA9IGZpbmRNYXRjaFJ1bGVzKHRoaXMuYnRtLnJlZHVjZVJ1bGVzLCB3b3JrRXhwciwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHdvcmtFeHByO1xuICAgIH1cblxuICAgIFxuICAgIGRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCkge1xuICAgICAgICByZXR1cm4obmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAwKSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgICAgVGhlIG1hdGNoIG1ldGhvZCBpcyBkZXNpZ25lZCB0byBjb21wYXJlIFwidGhpc1wiIGV4cHJlc3Npb25cbiAgICAgICAgdG8gdGhlIGdpdmVuIFwiZXhwclwiIGV4cHJlc3Npb24gYW5kIHNlZSBpZiBpdCBpcyBjb25zaXN0ZW50IHdpdGhcbiAgICAgICAgdGhlIGN1cnJlbnQgYmluZGluZ3MuIFRoZSBiaW5kaW5ncyB3aWxsIGJlIGFuIG9iamVjdCB3aGVyZVxuICAgICAgICB2YXJpYWJsZXMgaW4gXCJ0aGlzXCIgYXJlIGFzc2lnbmVkIHRvIHN0cmluZ3MgcmVwcmVzZW50aW5nIGV4cHJlc3Npb25zLlxuICAgICAgICBJZiB0aGVyZSBpcyBhIG1pc21hdGNoLCByZXR1cm4gXCJudWxsXCIgYW5kIHRoZSBtYXRjaGluZyBwcm9jZXNzIHNob3VsZCB0ZXJtaW5hdGUuXG5cbiAgICAgICAgT3ZlcnJpZGVzOlxuICAgICAgICAgICAgLSBudW1iZXJzLCB0byBkZWFsIHdpdGggc2NhbGFyIGZvcm11bGEgdGhhdCBzaW1wbGlmeVxuICAgICAgICAgICAgLSB2YXJpYWJsZXMsIHdoaWNoIGNhbiBtYXRjaCBhcmJpdHJhcnkgZXhwcmVzc2lvbnMuXG4gICAgICAgICAgICAtIGluZGV4ZWQgZXhwcmVzc2lvbnMgbWlnaHQgbmVlZCBhIHNwZWNpYWwgbWV0aG9kLlxuICAgICAgICAgICAgLSBtdWx0aW9wLCB3aGVyZSBzaG91bGQgc2VlIGlmIGEgdmFyaWFibGUgY2FuIG1hdGNoIGEgc3ViY29sbGVjdGlvbiBvZiBpbnB1dHMuXG4gICAgKi9cbiAgICBtYXRjaChleHByLCBiaW5kaW5ncykge1xuICAgICAgICB2YXIgcmV0VmFsdWUgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy50eXBlID09IGV4cHIudHlwZSAmJiB0aGlzLm9wZXJhdGVUb1RlWCgpID09IGV4cHIub3BlcmF0ZVRvVGVYKCkpIHtcbiAgICAgICAgICAgIHJldFZhbHVlID0gYmluZGluZ3M7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy5pbnB1dHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAocmV0VmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsdWUgPSB0aGlzLmlucHV0c1tpXS5tYXRjaChleHByLmlucHV0c1tpXSwgcmV0VmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ocmV0VmFsdWUpO1xuICAgIH1cblxuICAgIGlucHV0U3Vic3Qob3JpZ0V4cHIsIHN1YkV4cHIpIHtcbiAgICAgICAgdmFyIGkgPSB0aGlzLmlucHV0cy5pbmRleE9mKG9yaWdFeHByKTtcbiAgICAgICAgaWYgKGkgPj0gMCkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dHNbaV0gPSBzdWJFeHByO1xuICAgICAgICAgICAgaWYgKHN1YkV4cHIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHN1YkV4cHIucGFyZW50ID0gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCIvKiFcbiAqIEJUTSBKYXZhU2NyaXB0IExpYnJhcnkgdkBWRVJTSU9OXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGJyaWFud2FsdG9uL0JUTVxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICogRGVmaW5lIHRoZSBGdW5jdGlvbiBFeHByZXNzaW9uIC0tIGRlZmluZWQgYnkgYSBmdW5jdGlvbiBuYW1lIGFuZCBpbnB1dCBleHByZXNzaW9uXG4gICAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5pbXBvcnQgeyBleHByZXNzaW9uIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi5qc1wiXG5pbXBvcnQgeyBzY2FsYXJfZXhwciB9IGZyb20gXCIuL3NjYWxhcl9leHByLmpzXCJcbmltcG9ydCB7IHZhcmlhYmxlX2V4cHIgfSBmcm9tIFwiLi92YXJpYWJsZV9leHByLmpzXCJcbmltcG9ydCB7IHVub3BfZXhwciB9IGZyb20gXCIuL3Vub3BfZXhwci5qc1wiXG5pbXBvcnQgeyBiaW5vcF9leHByIH0gZnJvbSBcIi4vYmlub3BfZXhwci5qc1wiXG5pbXBvcnQgeyBleHByVHlwZSB9IGZyb20gXCIuL0JUTV9yb290LmpzXCJcblxuZXhwb3J0IGNsYXNzIGZ1bmN0aW9uX2V4cHIgZXh0ZW5kcyBleHByZXNzaW9uIHtcbiAgICBjb25zdHJ1Y3RvcihidG0sIG5hbWUsIGlucHV0RXhwciwgcmVzdHJpY3REb21haW4pIHtcbiAgICAgICAgc3VwZXIoYnRtKTtcbiAgICAgICAgdGhpcy50eXBlID0gZXhwclR5cGUuZmNuO1xuICAgICAgICAvLyBDb3VudCBob3cgbWFueSBkZXJpdmF0aXZlcy5cbiAgICAgICAgdmFyIHByaW1lUG9zID0gbmFtZS5pbmRleE9mKFwiJ1wiKTtcbiAgICAgICAgdGhpcy5kZXJpdnMgPSAwO1xuICAgICAgICBpZiAocHJpbWVQb3MgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBuYW1lLnNsaWNlKDAscHJpbWVQb3MpO1xuICAgICAgICAgICAgdGhpcy5kZXJpdnMgPSBuYW1lLnNsaWNlKHByaW1lUG9zKS5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXRFeHByID09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgaW5wdXRFeHByID0gbmV3IGV4cHJlc3Npb24odGhpcy5idG0pO1xuICAgICAgICB0aGlzLmlucHV0cyA9IFtpbnB1dEV4cHJdO1xuICAgICAgICBpbnB1dEV4cHIucGFyZW50ID0gdGhpcztcbiAgICAgICAgdGhpcy5kb21haW4gPSByZXN0cmljdERvbWFpbjtcblxuICAgICAgICB0aGlzLmFsdGVybmF0ZSA9IG51bGw7XG4gICAgICAgIHRoaXMuYnVpbHRpbiA9IHRydWU7XG4gICAgICAgIHN3aXRjaCh0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2FzaW4nOlxuICAgICAgICAgICAgY2FzZSAnYWNvcyc6XG4gICAgICAgICAgICBjYXNlICdhdGFuJzpcbiAgICAgICAgICAgIGNhc2UgJ2FzZWMnOlxuICAgICAgICAgICAgY2FzZSAnYWNzYyc6XG4gICAgICAgICAgICBjYXNlICdhY290JzpcbiAgICAgICAgICAgICAgICB0aGlzLm5hbWUgPSAnYXJjJyt0aGlzLm5hbWUuc2xpY2UoMSw0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2xvZyc6XG4gICAgICAgICAgICAgICAgdGhpcy5uYW1lID0gJ2xuJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3Npbic6XG4gICAgICAgICAgICBjYXNlICdjb3MnOlxuICAgICAgICAgICAgY2FzZSAndGFuJzpcbiAgICAgICAgICAgIGNhc2UgJ2NzYyc6XG4gICAgICAgICAgICBjYXNlICdzZWMnOlxuICAgICAgICAgICAgY2FzZSAnY290JzpcbiAgICAgICAgICAgIGNhc2UgJ2FyY3Npbic6XG4gICAgICAgICAgICBjYXNlICdhcmNjb3MnOlxuICAgICAgICAgICAgY2FzZSAnYXJjdGFuJzpcbiAgICAgICAgICAgIGNhc2UgJ2FyY3NlYyc6XG4gICAgICAgICAgICBjYXNlICdhcmNjc2MnOlxuICAgICAgICAgICAgY2FzZSAnYXJjY290JzpcbiAgICAgICAgICAgIGNhc2UgJ3NxcnQnOlxuICAgICAgICAgICAgY2FzZSAncm9vdCc6XG4gICAgICAgICAgICBjYXNlICdhYnMnOlxuICAgICAgICAgICAgY2FzZSAnZXhwJzpcbiAgICAgICAgICAgIGNhc2UgJ2V4cGInOlxuICAgICAgICAgICAgY2FzZSAnbG4nOlxuICAgICAgICAgICAgY2FzZSAnbG9nMTAnOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLmJ1aWx0aW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAvLyBXaGVuIHVzaW5nIGEgY3VzdG9tIGZ1bmN0aW9uIGZvciB0aGUgZmlyc3QgdGltZSwgd2UgbmVlZCB0byBjcmVhdGVcbiAgICAgICAgICAgICAgICAvLyBhIHJhbmRvbSBkdW1teSBmdW5jdGlvbiBmb3Igd29yayB3aGVuIG5vdCBib3VuZCB0byBkZWZpbml0aW9uLlxuICAgICAgICAgICAgICAgIC8vIFNlZSBpZiB3ZSBoYXZlIGFscmVhZHkgdXNlZCB0aGlzIGZ1bmN0aW9uLlxuICAgICAgICAgICAgICAgIC8vIEZvciBjb25zaXN0ZW5jeSwgd2Ugc2hvdWxkIGtlZXAgaXQgdGhlIHNhbWUuXG4gICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uRW50cnkgPSB0aGlzLmJ0bS5yYW5kb21CaW5kaW5nc1t0aGlzLm5hbWVdO1xuICAgICAgICAgICAgICAgIC8vIElmIG5ldmVyIHVzZWQgcHJldmlvdXNseSwgZ2VuZXJhdGUgYSByYW5kb20gZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgLy8gVGhpcyB3aWxsIGFsbG93IHZhbGlkIGNvbXBhcmlzb25zIHRvIG9jY3VyLlxuICAgICAgICAgICAgICAgIGlmIChmdW5jdGlvbkVudHJ5ID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbkVudHJ5ID0ge307XG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uRW50cnlbXCJpbnB1dFwiXSA9IFwieFwiO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm9ybXVsYSA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgdGhpcy5idG0ucm5nLnJhbmRSYXRpb25hbChbLTIwLDIwXSxbMSwxNV0pKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1Rlcm0sIHZhclRlcm07XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MTsgaTw9NjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdUZXJtID0gdGhpcy5idG0ucGFyc2UoXCJzaW4oXCIraStcIip4KVwiLCBcImZvcm11bGFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdUZXJtID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sIFwiKlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgdGhpcy5idG0ucm5nLnJhbmRSYXRpb25hbChbLTIwLDIwXSxbMSwxMF0pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdUZXJtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm11bGEgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgXCIrXCIsIGZvcm11bGEsIG5ld1Rlcm0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uRW50cnlbXCJ2YWx1ZVwiXSA9IFsgZm9ybXVsYSBdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ0bS5yYW5kb21CaW5kaW5nc1t0aGlzLm5hbWVdID0gZnVuY3Rpb25FbnRyeTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVyaXZzID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgeHZhciA9IG5ldyB2YXJpYWJsZV9leHByKHRoaXMuYnRtLCBcInhcIik7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGk9ZnVuY3Rpb25FbnRyeVtcInZhbHVlXCJdLmxlbmd0aDsgaTw9dGhpcy5kZXJpdnM7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25FbnRyeVtcInZhbHVlXCJdW2ldID0gZnVuY3Rpb25FbnRyeVtcInZhbHVlXCJdW2ktMV0uZGVyaXZhdGl2ZSh4dmFyLCB7XCJ4XCI6MH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIHVzaW5nIGEgZGVyaXZhdGl2ZSBvZiBhIGtub3duIGZ1bmN0aW9uLCB0aGVuIHdlIHNob3VsZCBjb21wdXRlIHRoYXQgaW4gYWR2YW5jZS5cbiAgICAgICAgaWYgKHRoaXMuYnVpbHRpbiAmJiB0aGlzLmRlcml2cyA+IDApIHtcbiAgICAgICAgICAgIHZhciB4dmFyID0gbmV3IHZhcmlhYmxlX2V4cHIodGhpcy5idG0sIFwieFwiKTtcbiAgICAgICAgICAgIHZhciBkZXJpdiA9IG5ldyBmdW5jdGlvbl9leHByKHRoaXMuYnRtLCB0aGlzLm5hbWUsIHh2YXIpO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMuZGVyaXZzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkZXJpdiA9IGRlcml2LmRlcml2YXRpdmUoeHZhciwge1wieFwiOjB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBiaW5kaW5nID0ge307XG4gICAgICAgICAgICBiaW5kaW5nW1wieFwiXSA9IGlucHV0RXhwcjtcbiAgICAgICAgICAgIHRoaXMuYWx0ZXJuYXRlID0gZGVyaXYuY29tcG9zZShiaW5kaW5nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldE5hbWUoKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5uYW1lICsgXCInXCIucmVwZWF0KHRoaXMuZGVyaXZzKSk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoZWxlbWVudE9ubHkpIHtcbiAgICAgICAgdmFyIGZjblN0cmluZywgcmV0U3RyaW5nO1xuICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnRPbmx5ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBlbGVtZW50T25seSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGZjblN0cmluZyA9IHRoaXMuZ2V0TmFtZSgpO1xuICAgICAgICBpZiAoZWxlbWVudE9ubHkpIHtcbiAgICAgICAgICAgIHJldFN0cmluZyA9IGZjblN0cmluZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBhcmdTdHJpbmdzID0gW107XG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dHMubGVuZ3RoID09IDAgfHwgdHlwZW9mIHRoaXMuaW5wdXRzWzBdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgYXJnU3RyaW5ncy5wdXNoKCc/Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnU3RyaW5ncy5wdXNoKHRoaXMuaW5wdXRzW2ldLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldFN0cmluZyA9IGZjblN0cmluZyArICcoJyArIGFyZ1N0cmluZ3Muam9pbignLCcpICsgJyknO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRTdHJpbmcpO1xuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBhcnJheSBjb250YWluaW5nIGFsbCB0ZXN0ZWQgZXF1aXZhbGVudCBzdHJpbmdzLlxuICAgIGFsbFN0cmluZ0VxdWl2cygpIHtcbiAgICAgICAgdmFyIGFsbElucHV0cyA9IFtdLCBpbnB1dE9wdGlvbnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgaW5wdXRPcHRpb25zLnB1c2godGhpcy5pbnB1dHNbaV0uYWxsU3RyaW5nRXF1aXZzKCkpO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXRWYWx1ZSA9IFtdO1xuICAgICAgICB2YXIgZmNuU3RyaW5nID0gdGhpcy5nZXROYW1lKCk7XG4gICAgICAgIC8vIFdhbnQgdG8gY3JlYXRlIGEgbGlzdCBvZiBhbGwgcG9zc2libGUgaW5wdXQgcmVwcmVzZW50YXRpb25zLlxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZUFyZ3MobGVmdCwgcmlnaHRPcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAocmlnaHRPcHRpb25zLmxlbmd0aD09MCkge1xuICAgICAgICAgICAgICAgIGFsbElucHV0cy5wdXNoKGxlZnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgTiA9IGxlZnQubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHZhciBuZXdMZWZ0ID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgayBpbiBsZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0xlZnQucHVzaChsZWZ0W2tdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgayBpbiByaWdodE9wdGlvbnNbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3TGVmdFtOXSA9IHJpZ2h0T3B0aW9uc1swXVtrXTtcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVBcmdzKG5ld0xlZnQsIHJpZ2h0T3B0aW9ucy5zbGljZSgxKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGdlbmVyYXRlQXJncyhbXSwgaW5wdXRPcHRpb25zKTtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBhbGxJbnB1dHMpIHtcbiAgICAgICAgICAgIHJldFZhbHVlW2ldID0gZmNuU3RyaW5nKycoJyArIGFsbElucHV0c1tpXS5qb2luKCcrJykgKyAnKSc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ocmV0VmFsdWUpO1xuICAgIH1cblxuICAgIHRvVGVYKHNob3dTZWxlY3QpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzaG93U2VsZWN0ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBzaG93U2VsZWN0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRleFN0cmluZyA9ICcnO1xuICAgICAgICB2YXIgZmNuU3RyaW5nO1xuICAgICAgICB2YXIgYXJnU3RyaW5ncyA9IFtdO1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaW5wdXRzWzBdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBhcmdTdHJpbmdzLnB1c2goJz8nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgICAgICBhcmdTdHJpbmdzLnB1c2godGhpcy5pbnB1dHNbaV0udG9UZVgoc2hvd1NlbGVjdCkpO1xuICAgICAgICAgICAgICAgIGlmIChzaG93U2VsZWN0ICYmIHRoaXMuc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ1N0cmluZ3NbaV0gPSBcIntcXFxcY29sb3J7Ymx1ZX1cIiArIGFyZ1N0cmluZ3NbaV0gKyBcIn1cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2godGhpcy5uYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdzaW4nOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcc2luJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Nvcyc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxjb3MnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndGFuJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXHRhbic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjc2MnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcY3NjJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3NlYyc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxzZWMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY290JzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGNvdCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcmNzaW4nOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcc2luXnstMX0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYXJjY29zJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGNvc157LTF9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FyY3Rhbic6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFx0YW5eey0xfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcmNjc2MnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcY3NjXnstMX0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYXJjc2VjJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXHNlY157LTF9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FyY2NvdCc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxjb3Reey0xfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzcXJ0JzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXG1hdGhybXtzcXJ0fSc7XG4gICAgICAgICAgICAgICAgdGV4U3RyaW5nID0gJ1xcXFxzcXJ0eycgKyBhcmdTdHJpbmdzWzBdICsgJ30nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncm9vdCc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxtYXRocm17cm9vdH0nO1xuICAgICAgICAgICAgICAgIHRleFN0cmluZyA9ICdcXFxcc3FydFsnICsgYXJnU3RyaW5nc1sxXSArJ117JyArIGFyZ1N0cmluZ3NbMF0gKyAnfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhYnMnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcYWJzJztcbiAgICAgICAgICAgICAgICB0ZXhTdHJpbmcgPSAnXFxcXGxlZnR8JyArIGFyZ1N0cmluZ3NbMF0gKyAnXFxcXHJpZ2h0fCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdleHAnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdlXic7XG4gICAgICAgICAgICAgICAgdGV4U3RyaW5nID0gJ2VeeycgKyBhcmdTdHJpbmdzWzBdICsgJ30nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZXhwYic6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxleHAnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbG4nOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcbG4nXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdsb2cxMCc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxsb2dfezEwfSdcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubmFtZS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcbWF0aHJteycgKyB0aGlzLm5hbWUgKyAnfSc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gdGhpcy5uYW1lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5kZXJpdnMgPiAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kZXJpdnMgPD0gMykge1xuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9IGZjblN0cmluZyArIFwiJ1wiLnJlcGVhdCh0aGlzLmRlcml2cyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9IGZjblN0cmluZyArIFwiXnsoXCIrdGhpcy5kZXJpdnMrXCIpfVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNob3dTZWxlY3QgJiYgdGhpcy5zZWxlY3QpIHtcbiAgICAgICAgICAgIGZjblN0cmluZyA9IFwiXFxcXGNvbG9ye3JlZH17XCIgKyBmY25TdHJpbmcgKyBcIn1cIjtcbiAgICAgICAgICAgIHRleFN0cmluZyA9ICcnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0ZXhTdHJpbmcgPT0gJycpIHtcbiAgICAgICAgICAgIHRleFN0cmluZyA9IGZjblN0cmluZyArICcgXFxcXG1hdGhvcGVue31cXFxcbGVmdCgnICsgYXJnU3RyaW5ncy5qb2luKCcsJykgKyAnXFxcXHJpZ2h0KVxcXFxtYXRoY2xvc2V7fSc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHRleFN0cmluZyk7XG4gICAgfVxuXG4gICAgdG9NYXRoTUwoKSB7XG4gICAgICAgIHZhciB0ZXhTdHJpbmc7XG4gICAgICAgIHZhciBhcmdTdHJpbmc7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dHNbMF0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGFyZ1N0cmluZyA9ICc/JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyZ1N0cmluZyA9IHRoaXMuaW5wdXRzWzBdLnRvTWF0aE1MKCk7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoKHRoaXMubmFtZSkge1xuICAgICAgICAgICAgY2FzZSAnc2luJzpcbiAgICAgICAgICAgIGNhc2UgJ2Nvcyc6XG4gICAgICAgICAgICBjYXNlICd0YW4nOlxuICAgICAgICAgICAgY2FzZSAnY3NjJzpcbiAgICAgICAgICAgIGNhc2UgJ3NlYyc6XG4gICAgICAgICAgICBjYXNlICdjb3QnOlxuICAgICAgICAgICAgY2FzZSAnYXJjc2luJzpcbiAgICAgICAgICAgIGNhc2UgJ2FyY2Nvcyc6XG4gICAgICAgICAgICBjYXNlICdhcmN0YW4nOlxuICAgICAgICAgICAgY2FzZSAnZXhwJzpcbiAgICAgICAgICAgIGNhc2UgJ2V4cGInOlxuICAgICAgICAgICAgY2FzZSAnbG4nOlxuICAgICAgICAgICAgY2FzZSAnYWJzJzpcbiAgICAgICAgICAgICAgICB0ZXhTdHJpbmcgPSAnPGFwcGx5PjwnICsgdGhpcy5uYW1lICsgJy8+JyArIGFyZ1N0cmluZyArICc8L2FwcGx5Pic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzcXJ0JzpcbiAgICAgICAgICAgICAgICB0ZXhTdHJpbmcgPSAnPGFwcGx5Pjxyb290Lz4nICsgYXJnU3RyaW5nICsgJzwvYXBwbHk+JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2xvZzEwJzpcbiAgICAgICAgICAgICAgICB0ZXhTdHJpbmcgPSAnPGFwcGx5Pjxsb2cvPjxsb2diYXNlPjxjbj4xMDwvY24+PC9sb2diYXNlPicgKyBhcmdTdHJpbmcgKyAnPC9hcHBseT4nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0ZXhTdHJpbmcgPSAnPGFwcGx5PjxjaT4nICsgbmFtZSArICc8L2NpPicgKyBhcmdTdHJpbmcgKyAnPC9hcHBseT4nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybih0ZXhTdHJpbmcpO1xuICAgIH1cblxuICAgIG9wZXJhdGVUb1RlWCgpIHtcbiAgICAgICAgdmFyIGZjblN0cmluZztcbiAgICAgICAgc3dpdGNoKHRoaXMubmFtZSkge1xuICAgICAgICAgICAgY2FzZSAnc2luJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXHNpbic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjb3MnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcY29zJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3Rhbic6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFx0YW4nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY3NjJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGNzYyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzZWMnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcc2VjJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2NvdCc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxjb3QnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYXJjc2luJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXHNpbl57LTF9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FyY2Nvcyc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxjb3Neey0xfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcmN0YW4nOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcdGFuXnstMX0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYXJjY3NjJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGNzY157LTF9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FyY3NlYyc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxzZWNeey0xfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcmNjb3QnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcY290XnstMX0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc3FydCc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxtYXRocm17c3FydH0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYWJzJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGFicyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdleHAnOlxuICAgICAgICAgICAgY2FzZSAnZXhwYic6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxleHAnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbG4nOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcbG4nXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdsb2cxMCc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxsb2dfezEwfSdcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubmFtZS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcbWF0aHJteycgKyB0aGlzLm5hbWUgKyAnfSc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gdGhpcy5uYW1lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5kZXJpdnMgPiAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kZXJpdnMgPD0gMykge1xuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9IGZjblN0cmluZyArIFwiJ1wiLnJlcGVhdCh0aGlzLmRlcml2cyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9IGZjblN0cmluZyArIFwiXnsoXCIrdGhpcy5kZXJpdnMrXCIpfVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKGZjblN0cmluZytcIihcXFxcQm94KVwiKTtcbiAgICB9XG5cbiAgICBldmFsdWF0ZShiaW5kaW5ncykge1xuICAgICAgICB2YXIgaW5wdXRWYWwgPSB0aGlzLmlucHV0c1swXS5ldmFsdWF0ZShiaW5kaW5ncyk7XG4gICAgICAgIHZhciByZXRWYWwgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgaWYgKGlucHV0VmFsID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuKHVuZGVmaW5lZCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCdWlsdC1pbiBmdW5jdGlvbnMgd2l0aCBkZXJpdmF0aXZlcyBoYXZlIGNvbXB1dGVkIGRlcml2YXRpdmUgZWFybGllci5cbiAgICAgICAgaWYgKHRoaXMuYnVpbHRpbiAmJiB0aGlzLmRlcml2cyA+IDApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFsdGVybmF0ZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXRWYWwgPSB0aGlzLmFsdGVybmF0ZS5ldmFsdWF0ZShiaW5kaW5ncyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3I6IEJ1aWx0LWluIGZ1bmN0aW9uIGNhbGxlZCB3aXRoIHVuc3BlY2lmaWVkIGRlcml2YXRpdmUgZm9ybXVsYS5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoYmluZGluZ3NbdGhpcy5uYW1lXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBDaGVjayB0aGUgbGlzdCBvZiBjb21tb24gbWF0aGVtYXRpY2FsIGZ1bmN0aW9ucy5cbiAgICAgICAgICAgICAgICBzd2l0Y2godGhpcy5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Npbic6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLnNpbihpbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnY29zJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGguY29zKGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd0YW4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC50YW4oaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NzYyc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSAxL01hdGguc2luKGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdzZWMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gMS9NYXRoLmNvcyhpbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnY290JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IDEvTWF0aC50YW4oaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FyY3Npbic6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoaW5wdXRWYWwpIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLmFzaW4oaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FyY2Nvcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoaW5wdXRWYWwpIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLmFjb3MoaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FyY3Rhbic6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLmF0YW4oaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FyY2NzYyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoaW5wdXRWYWwpID49IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLmFzaW4oMS9pbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJjc2VjJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhpbnB1dFZhbCkgPj0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGguYWNvcygxL2lucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhcmNjb3QnOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0VmFsID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLlBJLzI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGguUEkvMiAtIE1hdGguYXRhbigxL2lucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdzcXJ0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dFZhbCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5zcXJ0KGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhYnMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5hYnMoaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2V4cCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2V4cGInOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5leHAoaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2xuJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dFZhbCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLmxvZyhpbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbG9nMTAnOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0VmFsID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGguTE9HMTBFICogTWF0aC5sb2coaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTZWUgaWYgd2UgaGF2ZSBhbHJlYWR5IHVzZWQgdGhpcyBmdW5jdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvciBjb25zaXN0ZW5jeSwgd2Ugc2hvdWxkIGtlZXAgaXQgdGhlIHNhbWUuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZnVuY3Rpb25FbnRyeSA9IHRoaXMuYnRtLnJhbmRvbUJpbmRpbmdzW3RoaXMubmFtZV07XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBuZXZlciB1c2VkIHByZXZpb3VzbHksIGdlbmVyYXRlIGEgcmFuZG9tIGZ1bmN0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyB3aWxsIGFsbG93IHZhbGlkIGNvbXBhcmlzb25zIHRvIG9jY3VyLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZ1bmN0aW9uRW50cnkgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcjogQSBjdXN0b20gZnVuY3Rpb24gbmV2ZXIgaGFkIGEgYmFja2VuZCBkZWZpbml0aW9uLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvcHkgdGhlIGJpbmRpbmdzLlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZCaW5kID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhiaW5kaW5ncykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmQmluZFsga2V5IF0gPSBiaW5kaW5nc1sga2V5IF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vdywgdXNlIHRoZSB2YXJpYWJsZSBvZiB0aGUgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgICAgICBmQmluZFtmdW5jdGlvbkVudHJ5W1wiaW5wdXRcIl1dID0gaW5wdXRWYWw7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTZWUgaWYgd2UgbmVlZCBhZGRpdGlvbmFsIGRlcml2YXRpdmVzIGluIGJpbmRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlcml2cyA+PSBmdW5jdGlvbkVudHJ5W1widmFsdWVcIl0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGl2YXIgPSBuZXcgdmFyaWFibGVfZXhwcih0aGlzLmJ0bSwgZnVuY3Rpb25FbnRyeVtcImlucHV0XCJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFyQmluZCA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhckJpbmRbaXZhcl0gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGk9ZnVuY3Rpb25FbnRyeVtcInZhbHVlXCJdLmxlbmd0aDsgaSA8PSB0aGlzLmRlcml2czsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uRW50cnlbXCJ2YWx1ZVwiXVtpXSA9IGZ1bmN0aW9uRW50cnlbXCJ2YWx1ZVwiXVtpLTFdLmRlcml2YXRpdmUoaXZhciwgdmFyQmluZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gZnVuY3Rpb25FbnRyeVtcInZhbHVlXCJdW3RoaXMuZGVyaXZzXS5ldmFsdWF0ZShmQmluZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbkVudHJ5ID0gYmluZGluZ3NbdGhpcy5uYW1lXTtcbiAgICAgICAgICAgICAgICAvLyBDb3B5IHRoZSBiaW5kaW5ncy5cbiAgICAgICAgICAgICAgICB2YXIgZkJpbmQgPSB7fTtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhiaW5kaW5ncykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgZkJpbmRbIGtleSBdID0gYmluZGluZ3NbIGtleSBdO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vIE5vdywgdXNlIHRoZSB2YXJpYWJsZSBvZiB0aGUgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgZkJpbmRbZnVuY3Rpb25FbnRyeVtcImlucHV0XCJdXSA9IGlucHV0VmFsO1xuICAgICAgICAgICAgICAgIC8vIFNlZSBpZiB3ZSBuZWVkIGFkZGl0aW9uYWwgZGVyaXZhdGl2ZXMgaW4gYmluZGluZ1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlcml2cyA+PSBmdW5jdGlvbkVudHJ5W1widmFsdWVcIl0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpdmFyID0gbmV3IHZhcmlhYmxlX2V4cHIodGhpcy5idG0sIGZ1bmN0aW9uRW50cnlbXCJpbnB1dFwiXSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2YXJCaW5kID0ge307XG4gICAgICAgICAgICAgICAgICAgIHZhckJpbmRbaXZhcl0gPSAwO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpPWZ1bmN0aW9uRW50cnlbXCJ2YWx1ZVwiXS5sZW5ndGg7IGkgPD0gdGhpcy5kZXJpdnM7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25FbnRyeVtcInZhbHVlXCJdW2ldID0gZnVuY3Rpb25FbnRyeVtcInZhbHVlXCJdW2ktMV0uZGVyaXZhdGl2ZShpdmFyLCB2YXJCaW5kKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXRWYWwgPSBmdW5jdGlvbkVudHJ5W1widmFsdWVcIl1bdGhpcy5kZXJpdnNdLmV2YWx1YXRlKGZCaW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ocmV0VmFsKTtcbiAgICB9XG5cbiAgICBmbGF0dGVuKCkge1xuICAgICAgICByZXR1cm4obmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5idG0sIHRoaXMuZ2V0TmFtZSgpLCB0aGlzLmlucHV0c1swXS5mbGF0dGVuKCkpKTtcbiAgICB9XG5cbiAgICBjb3B5KCkge1xuICAgICAgcmV0dXJuKG5ldyBmdW5jdGlvbl9leHByKHRoaXMuYnRtLCB0aGlzLmdldE5hbWUoKSwgdGhpcy5pbnB1dHNbMF0uY29weSgpKSk7XG4gICAgfVxuXG4gICAgY29tcG9zZShiaW5kaW5ncykge1xuICAgICAgICByZXR1cm4obmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5idG0sIHRoaXMuZ2V0TmFtZSgpLCB0aGlzLmlucHV0c1swXS5jb21wb3NlKGJpbmRpbmdzKSkpO1xuICAgIH1cblxuICAgIGRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCkge1xuICAgICAgICB2YXIgdGhlRGVyaXY7XG4gICAgICAgIHZhciBkZXBBcnJheSA9IHRoaXMuaW5wdXRzWzBdLmRlcGVuZGVuY2llcygpO1xuICAgICAgICB2YXIgdUNvbnN0ID0gdHJ1ZTtcbiAgICAgICAgdmFyIGl2YXJOYW1lID0gKHR5cGVvZiBpdmFyID09ICdzdHJpbmcnKSA/IGl2YXIgOiBpdmFyLm5hbWU7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxkZXBBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGRlcEFycmF5W2ldID09IGl2YXJOYW1lKSB7XG4gICAgICAgICAgICAgICAgdUNvbnN0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodUNvbnN0KSB7XG4gICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgZHlkdTtcblxuICAgICAgICAgICAgc3dpdGNoKHRoaXMubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdzaW4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyBmdW5jdGlvbl9leHByKHRoaXMuYnRtLCAnY29zJywgdGhpcy5pbnB1dHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Nvcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IHVub3BfZXhwcih0aGlzLmJ0bSwgJy0nLCBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLmJ0bSwgJ3NpbicsIHRoaXMuaW5wdXRzWzBdKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndGFuJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGVTZWMgPSBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLmJ0bSwgJ3NlYycsIHRoaXMuaW5wdXRzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJ14nLCB0aGVTZWMsIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NzYyc6XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlQ290ID0gbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5idG0sICdjb3QnLCB0aGlzLmlucHV0c1swXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IHVub3BfZXhwcih0aGlzLmJ0bSwgJy0nLCBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJyonLCB0aGlzLCB0aGVDb3QpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdzZWMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZVRhbiA9IG5ldyBmdW5jdGlvbl9leHByKHRoaXMuYnRtLCAndGFuJywgdGhpcy5pbnB1dHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnKicsIHRoaXMsIHRoZVRhbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnY290JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGVDc2MgPSBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLmJ0bSwgJ2NzYycsIHRoaXMuaW5wdXRzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgdW5vcF9leHByKHRoaXMuYnRtLCAnLScsIG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnXicsIHRoZUNzYywgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAyKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FyY3Npbic6XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlQ29zID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICctJywgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAxKSwgbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICdeJywgdGhpcy5pbnB1dHNbMF0sIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMikpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJy8nLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDEpLCBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLmJ0bSwgJ3NxcnQnLCB0aGVDb3MpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhcmNjb3MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZVNpbiA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnLScsIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMSksIG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnXicsIHRoaXMuaW5wdXRzWzBdLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDIpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcvJywgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAtMSksIG5ldyBmdW5jdGlvbl9leHByKHRoaXMuYnRtLCAnc3FydCcsIHRoZVNpbikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FyY3Rhbic6XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGFuU3EgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJ14nLCB0aGlzLmlucHV0c1swXSwgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcvJywgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAxKSwgbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcrJywgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAxKSwgdGFuU3EpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhcmNzZWMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZVNxID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICdeJywgdGhpcy5pbnB1dHNbMF0sIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZVJhZCA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnLScsIHRoZVNxLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJy8nLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDEpLCBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJyonLCBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLmJ0bSwgJ2FicycsIHRoaXMuaW5wdXRzWzBdKSwgbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5idG0sICdzcXJ0JywgdGhlUmFkKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FyY2NzYyc6XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlU3EgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJ14nLCB0aGlzLmlucHV0c1swXSwgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlUmFkID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICctJywgdGhlU3EsIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnLycsIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgLTEpLCBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJyonLCBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLmJ0bSwgJ2FicycsIHRoaXMuaW5wdXRzWzBdKSwgbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5idG0sICdzcXJ0JywgdGhlUmFkKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FyY2NvdCc6XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY290U3EgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJ14nLCB0aGlzLmlucHV0c1swXSwgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcvJywgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAtMSksIG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnKycsIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMSksIGNvdFNxKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc3FydCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcvJywgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAxKSwgbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcqJywgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAyKSwgdGhpcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Ficyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcvJywgdGhpcywgdGhpcy5pbnB1dHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2V4cCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2V4cGInOlxuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyBmdW5jdGlvbl9leHByKHRoaXMuYnRtLCB0aGlzLm5hbWUsIHRoaXMuaW5wdXRzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdsbic6XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcvJywgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAxKSwgdGhpcy5pbnB1dHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2xvZzEwJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJy8nLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIE1hdGguTE9HMTBFKSwgdGhpcy5pbnB1dHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5idG0sIHRoaXMuZ2V0TmFtZSgpK1wiJ1wiLCB0aGlzLmlucHV0c1swXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdUNvbnN0ICYmIHRoaXMuaW5wdXRzWzBdLnR5cGUgPT0gZXhwclR5cGUudmFyaWFibGUpIHtcbiAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IGR5ZHU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBkdWR4ID0gdGhpcy5pbnB1dHNbMF0uZGVyaXZhdGl2ZShpdmFyLCB2YXJMaXN0KTtcblxuICAgICAgICAgICAgICAgIGlmIChkdWR4ID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnKicsIGR5ZHUsIGR1ZHgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4odGhlRGVyaXYpO1xuICAgIH1cbn0iLCIvKiFcbiAqIEJUTSBKYXZhU2NyaXB0IExpYnJhcnkgdkBWRVJTSU9OXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGJyaWFud2FsdG9uL0JUTVxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogRGVmaW5lIHRoZSBNdWx0aS1PcGVyYW5kIEV4cHJlc3Npb24gKGZvciBzdW0gYW5kIHByb2R1Y3QpXG4qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5pbXBvcnQgeyBleHByZXNzaW9uIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi5qc1wiXG5pbXBvcnQgeyBzY2FsYXJfZXhwciB9IGZyb20gXCIuL3NjYWxhcl9leHByLmpzXCJcbmltcG9ydCB7IGV4cHJUeXBlLCBvcFByZWMgfSBmcm9tIFwiLi9CVE1fcm9vdC5qc1wiXG5cbmV4cG9ydCBjbGFzcyBtdWx0aW9wX2V4cHIgZXh0ZW5kcyBleHByZXNzaW9uIHtcbiAgICBjb25zdHJ1Y3RvcihidG0sIG9wLCBpbnB1dHMpIHtcbiAgICAgICAgc3VwZXIoYnRtKTtcbiAgICAgICAgdGhpcy50eXBlID0gZXhwclR5cGUubXVsdGlvcDtcbiAgICAgICAgdGhpcy5vcCA9IG9wO1xuICAgICAgICB0aGlzLmlucHV0cyA9IGlucHV0czsgLy8gYW4gYXJyYXlcbiAgICAgICAgZm9yICh2YXIgaSBpbiBpbnB1dHMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXRzW2ldID09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgICAgIGlucHV0c1tpXSA9IG5ldyBleHByZXNzaW9uKHRoaXMuYnRtKTtcbiAgICAgICAgICAgIGlucHV0c1tpXS5wYXJlbnQgPSB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAob3ApIHtcbiAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5hZGRzdWI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICB0aGlzLnByZWMgPSBvcFByZWMubXVsdGRpdjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJVbmtub3duIG11bHRpLW9wZXJhbmQgb3BlcmF0b3I6ICdcIitvcCtcIicuXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHZhciB0aGVTdHIsXG4gICAgICAgICAgICBvcFN0cixcbiAgICAgICAgICAgIGlzRXJyb3IgPSBmYWxzZSxcbiAgICAgICAgICAgIHNob3dPcDtcblxuICAgICAgICB0aGVTdHIgPSAnJztcbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgc2hvd09wID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dHNbaV0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBvcFN0ciA9ICc/JztcbiAgICAgICAgICAgICAgICBpc0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3BTdHIgPSB0aGlzLmlucHV0c1tpXS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIGlmICgodGhpcy5pbnB1dHNbaV0udHlwZSA+PSBleHByVHlwZS51bm9wXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1tpXS5wcmVjIDw9IHRoaXMucHJlYylcbiAgICAgICAgICAgICAgICAgICAgfHwgKHRoaXMuaW5wdXRzW2ldLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1tpXS5udW1iZXIucSAhPSAxXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBvcFByZWMubXVsdGRpdiA8PSB0aGlzLnByZWMpXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wU3RyID0gJygnICsgb3BTdHIgKyAnKSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhlU3RyICs9ICggaT4wID8gdGhpcy5vcCA6ICcnICkgKyBvcFN0cjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybih0aGVTdHIpO1xuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBhcnJheSBjb250YWluaW5nIGFsbCB0ZXN0ZWQgZXF1aXZhbGVudCBzdHJpbmdzLlxuICAgIGFsbFN0cmluZ0VxdWl2cygpIHtcbiAgICAgICAgdmFyIGFsbElucHV0c0FycmF5cyA9IFtdO1xuXG4gICAgICAgIHZhciBpbmRleExpc3QgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgYWxsSW5wdXRzQXJyYXlzW2ldID0gdGhpcy5pbnB1dHNbaV0uYWxsU3RyaW5nRXF1aXZzKCk7XG4gICAgICAgICAgICBpbmRleExpc3QucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaW5wdXRQZXJtcyA9IHBlcm11dGF0aW9ucyhpbmRleExpc3QpO1xuXG4gICAgICAgIHZhciByZXRWYWx1ZSA9IFtdO1xuXG4gICAgICAgIHZhciB0aGVPcCA9IHRoaXMub3A7XG4gICAgICAgIGlmICh0aGVPcCA9PSAnfCcpIHtcbiAgICAgICAgICAgIC8vIERvbid0IHdhbnQgXCJvclwiIHRvIGJlIHRyYW5zbGF0ZWQgYXMgYWJzb2x1dGUgdmFsdWVcbiAgICAgICAgICAgIHRoZU9wID0gJyAkICc7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBidWlsZFN0cmluZ0VxdWl2cyhpbmRleExpc3QsIGxlZnRTdHIpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbGVmdFN0ciA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgbGVmdFN0ciA9IFwiXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGluZGV4TGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbGVmdFN0ciArPSB0aGVPcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbmRleExpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciB3b3JrSW5wdXRzID0gYWxsSW5wdXRzQXJyYXlzW2luZGV4TGlzdFswXV07XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB3b3JrSW5wdXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1aWxkU3RyaW5nRXF1aXZzKGluZGV4TGlzdC5zbGljZSgxKSwgbGVmdFN0ciArIFwiKFwiICsgd29ya0lucHV0c1tpXSArIFwiKVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldFZhbHVlLnB1c2gobGVmdFN0cik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpIGluIGlucHV0UGVybXMpIHtcbiAgICAgICAgICAgIGJ1aWxkU3RyaW5nRXF1aXZzKGlucHV0UGVybXNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKHJldFZhbHVlKTtcbiAgICB9XG5cbiAgICB0b1RlWChzaG93U2VsZWN0KSB7XG4gICAgICAgIHZhciB0aGVTdHI7XG4gICAgICAgIHZhciB0aGVPcDtcbiAgICAgICAgdmFyIG9wU3RyO1xuICAgICAgICB2YXIgYXJnU3RyTCwgYXJnU3RyUiwgb3BTdHJMLCBvcFN0clI7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBzaG93U2VsZWN0ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBzaG93U2VsZWN0ID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0aGVPcCA9IHRoaXMub3A7XG4gICAgICAgIGlmICh0aGlzLm9wID09ICcqJykge1xuICAgICAgICAgICAgaWYgKHNob3dTZWxlY3QgJiYgdGhpcy5zZWxlY3QpIHtcbiAgICAgICAgICAgICAgICB0aGVPcCA9ICdcXFxcdGltZXMnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGVPcCA9ICcgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaG93U2VsZWN0ICYmIHRoaXMuc2VsZWN0KSB7XG4gICAgICAgICAgICBhcmdTdHJMID0gJ3tcXFxcY29sb3J7Ymx1ZX0nO1xuICAgICAgICAgICAgYXJnU3RyUiA9ICd9JztcbiAgICAgICAgICAgIG9wU3RyTCA9ICd7XFxcXGNvbG9ye3JlZH0nO1xuICAgICAgICAgICAgb3BTdHJSID0gJ30nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXJnU3RyTCA9ICcnO1xuICAgICAgICAgICAgYXJnU3RyUiA9ICcnO1xuICAgICAgICAgICAgb3BTdHJMID0gJyc7XG4gICAgICAgICAgICBvcFN0clIgPSAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoZVN0ciA9ICcnO1xuICAgICAgICB2YXIgbWluUHJlYyA9IHRoaXMucHJlYztcbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0c1tpXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIG9wU3RyID0gJz8nO1xuICAgICAgICAgICAgICAgIHRoZVN0ciArPSAoIGk+MCA/IG9wU3RyTCArIHRoZU9wICsgb3BTdHJSIDogJycgKSArIG9wU3RyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcCA9PSAnKidcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzW2ldLnR5cGUgPT0gZXhwclR5cGUudW5vcCAmJiB0aGlzLmlucHV0c1tpXS5vcCA9PSAnLydcbiAgICAgICAgICAgICAgICAgICAgICAgICYmICEoc2hvd1NlbGVjdCAmJiB0aGlzLnNlbGVjdCkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvcFN0ciA9IGFyZ1N0ckwgKyB0aGlzLmlucHV0c1tpXS5pbnB1dHNbMF0udG9UZVgoc2hvd1NlbGVjdCkgKyBhcmdTdHJSO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbaV0uaW5wdXRzWzBdLnR5cGUgPj0gZXhwclR5cGUudW5vcCAmJiB0aGlzLmlucHV0c1tpXS5pbnB1dHNbMF0ucHJlYyA8IG1pblByZWMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wU3RyID0gJ1xcXFxsZWZ0KCcgKyBvcFN0ciArICdcXFxccmlnaHQpJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhlU3RyID09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVTdHIgPSAnMSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGVTdHIgPSAnXFxcXGZyYWN7JyArIHRoZVN0ciArICd9eycgKyBvcFN0ciArICd9JztcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcCA9PSAnKydcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzW2ldLnR5cGUgPT0gZXhwclR5cGUudW5vcCAmJiB0aGlzLmlucHV0c1tpXS5vcCA9PSAnLSdcbiAgICAgICAgICAgICAgICAgICAgICAgICYmICEoc2hvd1NlbGVjdCAmJiB0aGlzLnNlbGVjdCkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvcFN0ciA9IGFyZ1N0ckwgKyB0aGlzLmlucHV0c1tpXS50b1RlWChzaG93U2VsZWN0KSArIGFyZ1N0clI7XG4gICAgICAgICAgICAgICAgICAgIHRoZVN0ciArPSBvcFN0cjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvcFN0ciA9IGFyZ1N0ckwgKyB0aGlzLmlucHV0c1tpXS50b1RlWChzaG93U2VsZWN0KSArIGFyZ1N0clI7XG4gICAgICAgICAgICAgICAgICAgIGlmICgodGhpcy5pbnB1dHNbaV0udHlwZSA+PSBleHByVHlwZS51bm9wXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbaV0ucHJlYyA8PSBtaW5QcmVjKVxuICAgICAgICAgICAgICAgICAgICAgICAgfHwgKGk+MCAmJiB0aGlzLm9wID09ICcqJyAmJiB0aGlzLmlucHV0c1tpXS50eXBlID09IGV4cHJUeXBlLm51bWJlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wU3RyID0gJ1xcXFxsZWZ0KCcgKyBvcFN0ciArICdcXFxccmlnaHQpJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGVTdHIgKz0gKCBpPjAgPyBvcFN0ckwgKyB0aGVPcCArIG9wU3RyUiA6ICcnICkgKyBvcFN0cjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4odGhlU3RyKTtcbiAgICB9XG5cbiAgICB0b01hdGhNTCgpIHtcbiAgICAgICAgdmFyIHRoZVN0cjtcbiAgICAgICAgdmFyIHRoZU9wO1xuICAgICAgICB2YXIgb3BTdHI7XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLm9wKSB7XG4gICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICB0aGVPcCA9IFwiPHBsdXMvPlwiXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICB0aGVPcCA9IFwiPHRpbWVzLz5cIlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhlU3RyID0gXCI8YXBwbHk+XCIgKyB0aGVPcDtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0c1tpXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIG9wU3RyID0gJz8nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvcFN0ciA9IHRoaXMuaW5wdXRzW2ldLnRvTWF0aE1MKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGVTdHIgKz0gb3BTdHI7XG4gICAgICAgIH1cbiAgICAgICAgdGhlU3RyICs9IFwiPC9hcHBseT5cIjtcblxuICAgICAgICByZXR1cm4odGhlU3RyKTtcbiAgICB9XG5cbiAgICBvcGVyYXRlVG9UZVgoKSB7XG4gICAgICAgIHZhciBvcFN0cmluZyA9IHRoaXMub3A7XG5cbiAgICAgICAgc3dpdGNoIChvcFN0cmluZykge1xuICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgb3BTdHJpbmcgPSAnXFxcXHRpbWVzJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihvcFN0cmluZyk7XG4gICAgfVxuXG4gICAgaXNDb21tdXRhdGl2ZSgpIHtcbiAgICAgICAgdmFyIGNvbW11dGVzID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLm9wID09PSAnKycgfHwgdGhpcy5vcCA9PT0gJyonKSB7XG4gICAgICAgICAgICBjb21tdXRlcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKGNvbW11dGVzKTtcbiAgICB9XG5cbiAgICBldmFsdWF0ZShiaW5kaW5ncykge1xuICAgICAgICB2YXIgaW5wdXRWYWw7XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgcmV0VmFsO1xuXG4gICAgICAgIHN3aXRjaCAodGhpcy5vcCkge1xuICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gMDtcbiAgICAgICAgICAgICAgICBmb3IgKGkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWwgPSB0aGlzLmlucHV0c1tpXS5ldmFsdWF0ZShiaW5kaW5ncyk7XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCArPSBpbnB1dFZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICByZXRWYWwgPSAxO1xuICAgICAgICAgICAgICAgIGZvciAoaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dFZhbCA9IHRoaXMuaW5wdXRzW2ldLmV2YWx1YXRlKGJpbmRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsICo9IGlucHV0VmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGUgYmluYXJ5IG9wZXJhdG9yICdcIiArIHRoaXMub3AgKyBcIicgaXMgbm90IGRlZmluZWQuXCIpO1xuICAgICAgICAgICAgICAgIHJldFZhbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ocmV0VmFsKTtcbiAgICB9XG5cbiAgICAvLyBGbGF0dGVuIGFuZCBhbHNvIHNvcnQgdGVybXMuXG4gICAgZmxhdHRlbigpIHtcbiAgICAgICAgdmFyIG5ld0lucHV0cyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICB2YXIgbmV4dElucHV0ID0gdGhpcy5pbnB1dHNbaV0uZmxhdHRlbigpO1xuICAgICAgICAgICAgaWYgKG5leHRJbnB1dC50eXBlID09IGV4cHJUeXBlLm11bHRpb3AgJiYgbmV4dElucHV0Lm9wID09IHRoaXMub3ApIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqIGluIG5leHRJbnB1dC5pbnB1dHMpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3SW5wdXRzLnB1c2gobmV4dElucHV0LmlucHV0c1tqXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdJbnB1dHMucHVzaChuZXh0SW5wdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJldFZhbHVlO1xuICAgICAgICBpZiAobmV3SW5wdXRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAvLyBBZGRpbmcgbm8gZWxlbWVudHMgPSAwXG4gICAgICAgICAgICAvLyBNdWx0aXBseWluZyBubyBlbGVtZW50cyA9IDFcbiAgICAgICAgICAgIHJldFZhbHVlID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCB0aGlzLm9wID09ICcrJyA/IDAgOiAxKTtcbiAgICAgICAgfSBlbHNlIGlmIChuZXdJbnB1dHMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIHJldFZhbHVlID0gbmV3SW5wdXRzWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gU29ydCB0aGUgaW5wdXRzIGJ5IHByZWNlZGVuY2UgZm9yIHByb2R1Y3RzXG4gICAgICAgICAgICAvLyBVc3VhbGx5IHZlcnkgc21hbGwsIHNvIGJ1YmJsZSBzb3J0IGlzIGdvb2QgZW5vdWdoXG4gICAgICAgICAgICBpZiAodGhpcy5vcD09JyonKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRtcDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8bmV3SW5wdXRzLmxlbmd0aC0xOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaj1pKzE7IGo8bmV3SW5wdXRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3SW5wdXRzW2ldLnR5cGUgPiBuZXdJbnB1dHNbal0udHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRtcCA9IG5ld0lucHV0c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdJbnB1dHNbaV0gPSBuZXdJbnB1dHNbal07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SW5wdXRzW2pdID0gdG1wO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0VmFsdWUgPSBuZXcgbXVsdGlvcF9leHByKHRoaXMuYnRtLCB0aGlzLm9wLCBuZXdJbnB1dHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gU2VlIGlmIHRoaXMgb3BlcmF0b3IgaXMgbm93IHJlZHVuZGFudC5cbiAgICAvLyBSZXR1cm4gdGhlIHJlc3VsdGluZyBleHByZXNzaW9uLlxuICAgIHJlZHVjZSgpIHtcbiAgICAgICAgdmFyIG5ld0V4cHIgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy5pbnB1dHMubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlucHV0cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIFN1bSB3aXRoIG5vIGVsZW1lbnRzID0gMFxuICAgICAgICAgICAgICAgIC8vIFByb2R1Y3Qgd2l0aCBubyBlbGVtZW50cyA9IDFcbiAgICAgICAgICAgICAgICBuZXdFeHByID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCB0aGlzLm9wID09ICcrJyA/IDAgOiAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gU3VtIG9yIHByb2R1Y3Qgd2l0aCBvbmUgZWxlbWVudCAqaXMqIHRoYXQgZWxlbWVudC5cbiAgICAgICAgICAgICAgICBuZXdFeHByID0gdGhpcy5pbnB1dHNbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdFeHByLnBhcmVudCA9IHRoaXMucGFyZW50O1xuICAgICAgICAgICAgaWYgKHRoaXMucGFyZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuaW5wdXRTdWJzdCh0aGlzLCBuZXdFeHByKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4obmV3RXhwcik7XG4gICAgfVxuXG4gICAgc2ltcGxpZnlDb25zdGFudHMoKSB7XG4gICAgICAgIHZhciBpLFxuICAgICAgICAgICAgY29uc3RJbmRleCA9IFtdLFxuICAgICAgICAgICAgbmV3SW5wdXRzID0gW107XG4gICAgICAgIC8vIFNpbXBsaWZ5IGFsbCBpbnB1dHNcbiAgICAgICAgLy8gTm90aWNlIHdoaWNoIGlucHV0cyBhcmUgdGhlbXNlbHZlcyBjb25zdGFudCBcbiAgICAgICAgZm9yIChpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0c1tpXSA9IHRoaXMuaW5wdXRzW2ldLnNpbXBsaWZ5Q29uc3RhbnRzKCk7XG4gICAgICAgICAgICB0aGlzLmlucHV0c1tpXS5wYXJlbnQgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzW2ldLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgY29uc3RJbmRleC5wdXNoKGkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdJbnB1dHMucHVzaCh0aGlzLmlucHV0c1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGb3IgYWxsIGlucHV0cyB0aGF0IGFyZSBjb25zdGFudHMsIGdyb3VwIHRoZW0gdG9nZXRoZXIgYW5kIHNpbXBsaWZ5LlxuICAgICAgICB2YXIgbmV3RXhwciA9IHRoaXM7XG4gICAgICAgIGlmIChjb25zdEluZGV4Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHZhciBuZXdDb25zdGFudCA9IHRoaXMuaW5wdXRzW2NvbnN0SW5kZXhbMF1dLm51bWJlcjtcbiAgICAgICAgICAgIGZvciAoaT0xOyBpPGNvbnN0SW5kZXgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdDb25zdGFudCA9IG5ld0NvbnN0YW50LmFkZCh0aGlzLmlucHV0c1tjb25zdEluZGV4W2ldXS5udW1iZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q29uc3RhbnQgPSBuZXdDb25zdGFudC5tdWx0aXBseSh0aGlzLmlucHV0c1tjb25zdEluZGV4W2ldXS5udW1iZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBGb3IgYWRkaXRpb24sIHRoZSBjb25zdGFudCBnb2VzIHRvIHRoZSBlbmQuXG4gICAgICAgICAgICAvLyBGb3IgbXVsdGlwbGljYXRpb24sIHRoZSBjb25zdGFudCBnb2VzIHRvIHRoZSBiZWdpbm5pbmcuXG4gICAgICAgICAgICB2YXIgbmV3SW5wdXQ7XG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICAgICAgbmV3SW5wdXRzLnB1c2gobmV3SW5wdXQgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIG5ld0NvbnN0YW50KSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgICAgICBuZXdJbnB1dHMuc3BsaWNlKDAsIDAsIG5ld0lucHV0ID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCBuZXdDb25zdGFudCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChuZXdJbnB1dHMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICBuZXdFeHByID0gbmV3SW5wdXRzWzBdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdJbnB1dC5wYXJlbnQgPSB0aGlzO1xuICAgICAgICAgICAgICAgIG5ld0V4cHIgPSBuZXcgbXVsdGlvcF9leHByKHRoaXMuYnRtLCB0aGlzLm9wLCBuZXdJbnB1dHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybihuZXdFeHByKTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGNvbXBhcmlzb24gcm91dGluZSBuZWVkcyB0byBkZWFsIHdpdGggdHdvIGlzc3Vlcy5cbiAgICAvLyAoMSkgVGhlIHBhc3NlZCBleHByZXNzaW9uIGhhcyBtb3JlIGlucHV0cyB0aGFuIHRoaXMgKGluIHdoaWNoIGNhc2Ugd2UgZ3JvdXAgdGhlbSlcbiAgICAvLyAoMikgUG9zc2liaWxpdHkgb2YgY29tbXV0aW5nIG1ha2VzIHRoZSBtYXRjaCB3b3JrLlxuICAgIG1hdGNoKGV4cHIsIGJpbmRpbmdzKSB7XG4gICAgICAgIGZ1bmN0aW9uIGNvcHlCaW5kaW5ncyhiaW5kaW5ncylcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHJldFZhbHVlID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gYmluZGluZ3MpIHtcbiAgICAgICAgICAgICAgICByZXRWYWx1ZVtrZXldID0gYmluZGluZ3Nba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmV0VmFsdWUgPSBudWxsLFxuICAgICAgICAgICAgbiA9IHRoaXMuaW5wdXRzLmxlbmd0aDtcbiAgICAgICAgaWYgKGV4cHIudHlwZSA9PSBleHByVHlwZS5tdWx0aW9wICYmIHRoaXMub3AgPT0gZXhwci5vcFxuICAgICAgICAgICAgICAgICYmIG4gPD0gZXhwci5pbnB1dHMubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgIC8vIE1hdGNoIG9uIGZpcnN0IG4tMSBhbmQgZ3JvdXAgcmVtYWluZGVyIGF0IGVuZC5cbiAgICAgICAgICAgIHZhciBjbXBFeHByLFxuICAgICAgICAgICAgICAgIGNtcElucHV0cyA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8bjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGk8KG4tMSkgfHwgZXhwci5pbnB1dHMubGVuZ3RoPT1uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNtcElucHV0c1tpXSA9IHRoaXMuYnRtLnBhcnNlKGV4cHIuaW5wdXRzW2ldLnRvU3RyaW5nKCksIGV4cHIuaW5wdXRzW2ldLmNvbnRleHQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBjb3BpZXMgb2YgdGhlIGlucHV0c1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3SW5wdXRzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGo9MDsgajw9ZXhwci5pbnB1dHMubGVuZ3RoLW47IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3SW5wdXRzW2pdID0gdGhpcy5idG0ucGFyc2UoZXhwci5pbnB1dHNbbitqLTFdLnRvU3RyaW5nKCksIGV4cHIuaW5wdXRzW24rai0xXS5jb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjbXBJbnB1dHNbaV0gPSBuZXcgbXVsdGlvcF9leHByKHRoaXMuYnRtLCBleHByLm9wLCBuZXdJbnB1dHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNtcEV4cHIgPSBuZXcgbXVsdGlvcF9leHByKHRoaXMuYnRtLCBleHByLm9wLCBjbXBJbnB1dHMpO1xuXG4gICAgICAgICAgICAvLyBOb3cgbWFrZSB0aGUgY29tcGFyaXNvbi5cbiAgICAgICAgICAgIHJldFZhbHVlID0gY29weUJpbmRpbmdzKGJpbmRpbmdzKTtcbiAgICAgICAgICAgIHJldFZhbHVlID0gZXhwcmVzc2lvbi5wcm90b3R5cGUubWF0Y2guY2FsbCh0aGlzLCBjbXBFeHByLCByZXRWYWx1ZSk7XG5cbiAgICAgICAgICAgIC8vIElmIHN0aWxsIGZhaWwgdG8gbWF0Y2gsIHRyeSB0aGUgcmV2ZXJzZSBncm91cGluZzogbWF0Y2ggb24gbGFzdCBuLTEgYW5kIGdyb3VwIGJlZ2lubmluZy5cbiAgICAgICAgICAgIGlmIChyZXRWYWx1ZSA9PSBudWxsICYmIG4gPCBleHByLmlucHV0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGlmZiA9IGV4cHIuaW5wdXRzLmxlbmd0aCAtIG47XG4gICAgICAgICAgICAgICAgY21wSW5wdXRzID0gW107XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8bjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpPT0wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgY29waWVzIG9mIHRoZSBpbnB1dHNcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdJbnB1dHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGo9MDsgajw9ZGlmZjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SW5wdXRzW2pdID0gdGhpcy5idG0ucGFyc2UoZXhwci5pbnB1dHNbal0udG9TdHJpbmcoKSwgZXhwci5pbnB1dHNbal0uY29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbXBJbnB1dHNbaV0gPSBuZXcgbXVsdGlvcF9leHByKHRoaXMuYnRtLCBleHByLm9wLCBuZXdJbnB1dHMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY21wSW5wdXRzW2ldID0gdGhpcy5idG0ucGFyc2UoZXhwci5pbnB1dHNbZGlmZitpXS50b1N0cmluZygpLCBleHByLmlucHV0c1tkaWZmK2ldLmNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNtcEV4cHIgPSBuZXcgbXVsdGlvcF9leHByKHRoaXMuYnRtLCBleHByLm9wLCBjbXBJbnB1dHMpO1xuXG4gICAgICAgICAgICAgICAgLy8gTm93IG1ha2UgdGhlIGNvbXBhcmlzb24uXG4gICAgICAgICAgICAgICAgcmV0VmFsdWUgPSBjb3B5QmluZGluZ3MoYmluZGluZ3MpO1xuICAgICAgICAgICAgICAgIHJldFZhbHVlID0gZXhwcmVzc2lvbi5wcm90b3R5cGUubWF0Y2guY2FsbCh0aGlzLCBjbXBFeHByLCByZXRWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHJldFZhbHVlKTtcbiAgICB9XG5cbiAgICBjb21wb3NlKGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciBuZXdJbnB1dHMgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICBuZXdJbnB1dHMucHVzaCh0aGlzLmlucHV0c1tpXS5jb21wb3NlKGJpbmRpbmdzKSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmV0VmFsdWU7XG4gICAgICAgIGlmIChuZXdJbnB1dHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldFZhbHVlID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCB0aGlzLm9wID09ICcrJyA/IDAgOiAxKTtcbiAgICAgICAgfSBlbHNlIGlmIChuZXdJbnB1dHMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIHJldFZhbHVlID0gbmV3SW5wdXRzWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0VmFsdWUgPSBuZXcgbXVsdGlvcF9leHByKHRoaXMuYnRtLCB0aGlzLm9wLCBuZXdJbnB1dHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxuXG4gICAgZGVyaXZhdGl2ZShpdmFyLCB2YXJMaXN0KSB7XG4gICAgICAgIHZhciBkVGVybXMgPSBbXTtcblxuICAgICAgICB2YXIgdGhlRGVyaXY7XG4gICAgICAgIHZhciBpLCBkdWR4O1xuICAgICAgICBmb3IgKGkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pbnB1dHNbaV0uaXNDb25zdGFudCgpKSB7XG4gICAgICAgICAgICAgICAgZHVkeCA9IHRoaXMuaW5wdXRzW2ldLmRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCk7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgICAgICAgICAgZFRlcm1zLnB1c2goZHVkeCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZFByb2RUZXJtcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT0gaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkUHJvZFRlcm1zLnB1c2goZHVkeCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZFByb2RUZXJtcy5wdXNoKHRoaXMuaW5wdXRzW2pdLmNvbXBvc2Uoe30pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBkVGVybXMucHVzaChuZXcgbXVsdGlvcF9leHByKHRoaXMuYnRtLCAnKicsIGRQcm9kVGVybXMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZFRlcm1zLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZFRlcm1zLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICB0aGVEZXJpdiA9IGRUZXJtc1swXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoZURlcml2ID0gbmV3IG11bHRpb3BfZXhwcih0aGlzLmJ0bSwgJysnLCBkVGVybXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybih0aGVEZXJpdik7XG4gICAgfVxufSIsIi8qIVxuICogQlRNIEphdmFTY3JpcHQgTGlicmFyeSB2QFZFUlNJT05cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kYnJpYW53YWx0b24vQlRNXG4gKlxuICogQ29weXJpZ2h0IEQuIEJyaWFuIFdhbHRvblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIChodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVClcbiAqXG4gKiBEYXRlOiBAREFURVxuICovXG5cbmltcG9ydCB7IHJhdGlvbmFsX251bWJlciB9IGZyb20gXCIuL3JhdGlvbmFsX251bWJlci5qc1wiXG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogICAgUm91dGluZXMgZm9yIGRlYWxpbmcgd2l0aCByYW5kb20gdmFsdWVzXG4qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuLyogVG8gdXNlIGEgc2VlZGVkIFJORywgd2UgcmVseSBvbiBhbiBvcGVuIHNvdXJjZSBwcm9qZWN0IGZvciB0aGUgdW5kZXJseWluZyBtZWNoYW5pY3MuICovXG5cbi8qLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuYWxlYVBSTkcgMS4xXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmh0dHBzOi8vZ2l0aHViLmNvbS9tYWNtY21lYW5zL2FsZWFQUk5HL2Jsb2IvbWFzdGVyL2FsZWFQUk5HLTEuMS5qc1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5PcmlnaW5hbCB3b3JrIGNvcHlyaWdodCDCqSAyMDEwIEpvaGFubmVzIEJhYWfDuGUsIHVuZGVyIE1JVCBsaWNlbnNlXG5UaGlzIGlzIGEgZGVyaXZhdGl2ZSB3b3JrIGNvcHlyaWdodCAoYykgMjAxNy0yMDIwLCBXLiBNYWNcIiBNY01lYW5zLCB1bmRlciBCU0QgbGljZW5zZS5cblJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dCBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcbjEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbjIuIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cbjMuIE5laXRoZXIgdGhlIG5hbWUgb2YgdGhlIGNvcHlyaWdodCBob2xkZXIgbm9yIHRoZSBuYW1lcyBvZiBpdHMgY29udHJpYnV0b3JzIG1heSBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0cyBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cblRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgSE9MREVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8qL1xuZnVuY3Rpb24gYWxlYVBSTkcoKSB7XG4gICAgcmV0dXJuKCBmdW5jdGlvbiggYXJncyApIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgY29uc3QgdmVyc2lvbiA9ICdhbGVhUFJORyAxLjEuMCc7XG5cbiAgICAgICAgdmFyIHMwXG4gICAgICAgICAgICAsIHMxXG4gICAgICAgICAgICAsIHMyXG4gICAgICAgICAgICAsIGNcbiAgICAgICAgICAgICwgdWludGEgPSBuZXcgVWludDMyQXJyYXkoIDMgKVxuICAgICAgICAgICAgLCBpbml0aWFsQXJnc1xuICAgICAgICAgICAgLCBtYXNodmVyID0gJydcbiAgICAgICAgO1xuXG4gICAgICAgIC8qIHByaXZhdGU6IGluaXRpYWxpemVzIGdlbmVyYXRvciB3aXRoIHNwZWNpZmllZCBzZWVkICovXG4gICAgICAgIGZ1bmN0aW9uIF9pbml0U3RhdGUoIF9pbnRlcm5hbFNlZWQgKSB7XG4gICAgICAgICAgICB2YXIgbWFzaCA9IE1hc2goKTtcblxuICAgICAgICAgICAgLy8gaW50ZXJuYWwgc3RhdGUgb2YgZ2VuZXJhdG9yXG4gICAgICAgICAgICBzMCA9IG1hc2goICcgJyApO1xuICAgICAgICAgICAgczEgPSBtYXNoKCAnICcgKTtcbiAgICAgICAgICAgIHMyID0gbWFzaCggJyAnICk7XG5cbiAgICAgICAgICAgIGMgPSAxO1xuXG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IF9pbnRlcm5hbFNlZWQubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgczAgLT0gbWFzaCggX2ludGVybmFsU2VlZFsgaSBdICk7XG4gICAgICAgICAgICAgICAgaWYoIHMwIDwgMCApIHsgczAgKz0gMTsgfVxuXG4gICAgICAgICAgICAgICAgczEgLT0gbWFzaCggX2ludGVybmFsU2VlZFsgaSBdICk7XG4gICAgICAgICAgICAgICAgaWYoIHMxIDwgMCApIHsgczEgKz0gMTsgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHMyIC09IG1hc2goIF9pbnRlcm5hbFNlZWRbIGkgXSApO1xuICAgICAgICAgICAgICAgIGlmKCBzMiA8IDAgKSB7IHMyICs9IDE7IH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWFzaHZlciA9IG1hc2gudmVyc2lvbjtcblxuICAgICAgICAgICAgbWFzaCA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHJpdmF0ZTogZGVwZW5kZW50IHN0cmluZyBoYXNoIGZ1bmN0aW9uICovXG4gICAgICAgIGZ1bmN0aW9uIE1hc2goKSB7XG4gICAgICAgICAgICB2YXIgbiA9IDQwMjI4NzExOTc7IC8vIDB4ZWZjODI0OWRcblxuICAgICAgICAgICAgdmFyIG1hc2ggPSBmdW5jdGlvbiggZGF0YSApIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGNhY2hlIHRoZSBsZW5ndGhcbiAgICAgICAgICAgICAgICBmb3IoIHZhciBpID0gMCwgbCA9IGRhdGEubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuICAgICAgICAgICAgICAgICAgICBuICs9IGRhdGEuY2hhckNvZGVBdCggaSApO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdmFyIGggPSAwLjAyNTE5NjAzMjgyNDE2OTM4ICogbjtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIG4gID0gaCA+Pj4gMDtcbiAgICAgICAgICAgICAgICAgICAgaCAtPSBuO1xuICAgICAgICAgICAgICAgICAgICBoICo9IG47XG4gICAgICAgICAgICAgICAgICAgIG4gID0gaCA+Pj4gMDtcbiAgICAgICAgICAgICAgICAgICAgaCAtPSBuO1xuICAgICAgICAgICAgICAgICAgICBuICs9IGggKiA0Mjk0OTY3Mjk2OyAvLyAweDEwMDAwMDAwMCAgICAgIDJeMzJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuICggbiA+Pj4gMCApICogMi4zMjgzMDY0MzY1Mzg2OTYzZS0xMDsgLy8gMl4tMzJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIG1hc2gudmVyc2lvbiA9ICdNYXNoIDAuOSc7XG4gICAgICAgICAgICByZXR1cm4gbWFzaDtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qIHByaXZhdGU6IGNoZWNrIGlmIG51bWJlciBpcyBpbnRlZ2VyICovXG4gICAgICAgIGZ1bmN0aW9uIF9pc0ludGVnZXIoIF9pbnQgKSB7IFxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KCBfaW50LCAxMCApID09PSBfaW50OyBcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHJldHVybiBhIDMyLWJpdCBmcmFjdGlvbiBpbiB0aGUgcmFuZ2UgWzAsIDFdXG4gICAgICAgIFRoaXMgaXMgdGhlIG1haW4gZnVuY3Rpb24gcmV0dXJuZWQgd2hlbiBhbGVhUFJORyBpcyBpbnN0YW50aWF0ZWRcbiAgICAgICAgKi9cbiAgICAgICAgdmFyIHJhbmRvbSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHQgPSAyMDkxNjM5ICogczAgKyBjICogMi4zMjgzMDY0MzY1Mzg2OTYzZS0xMDsgLy8gMl4tMzJcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgICAgIHMxID0gczI7XG5cbiAgICAgICAgICAgIHJldHVybiBzMiA9IHQgLSAoIGMgPSB0IHwgMCApO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogcmV0dXJuIGEgNTMtYml0IGZyYWN0aW9uIGluIHRoZSByYW5nZSBbMCwgMV0gKi9cbiAgICAgICAgcmFuZG9tLmZyYWN0NTMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiByYW5kb20oKSArICggcmFuZG9tKCkgKiAweDIwMDAwMCAgfCAwICkgKiAxLjExMDIyMzAyNDYyNTE1NjVlLTE2OyAvLyAyXi01M1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogcmV0dXJuIGFuIHVuc2lnbmVkIGludGVnZXIgaW4gdGhlIHJhbmdlIFswLCAyXjMyXSAqL1xuICAgICAgICByYW5kb20uaW50MzIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiByYW5kb20oKSAqIDB4MTAwMDAwMDAwOyAvLyAyXjMyXG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiBhZHZhbmNlIHRoZSBnZW5lcmF0b3IgdGhlIHNwZWNpZmllZCBhbW91bnQgb2YgY3ljbGVzICovXG4gICAgICAgIHJhbmRvbS5jeWNsZSA9IGZ1bmN0aW9uKCBfcnVuICkge1xuICAgICAgICAgICAgX3J1biA9IHR5cGVvZiBfcnVuID09PSAndW5kZWZpbmVkJyA/IDEgOiArX3J1bjtcbiAgICAgICAgICAgIGlmKCBfcnVuIDwgMSApIHsgX3J1biA9IDE7IH1cbiAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgX3J1bjsgaSsrICkgeyByYW5kb20oKTsgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogcmV0dXJuIGluY2x1c2l2ZSByYW5nZSAqL1xuICAgICAgICByYW5kb20ucmFuZ2UgPSBmdW5jdGlvbigpIHsgXG4gICAgICAgICAgICB2YXIgbG9Cb3VuZFxuICAgICAgICAgICAgICAgICwgaGlCb3VuZFxuICAgICAgICAgICAgO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiggYXJndW1lbnRzLmxlbmd0aCA9PT0gMSApIHtcbiAgICAgICAgICAgICAgICBsb0JvdW5kID0gMDtcbiAgICAgICAgICAgICAgICBoaUJvdW5kID0gYXJndW1lbnRzWyAwIF07XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9Cb3VuZCA9IGFyZ3VtZW50c1sgMCBdO1xuICAgICAgICAgICAgICAgIGhpQm91bmQgPSBhcmd1bWVudHNbIDEgXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIGFyZ3VtZW50c1sgMCBdID4gYXJndW1lbnRzWyAxIF0gKSB7IFxuICAgICAgICAgICAgICAgIGxvQm91bmQgPSBhcmd1bWVudHNbIDEgXTtcbiAgICAgICAgICAgICAgICBoaUJvdW5kID0gYXJndW1lbnRzWyAwIF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHJldHVybiBpbnRlZ2VyXG4gICAgICAgICAgICBpZiggX2lzSW50ZWdlciggbG9Cb3VuZCApICYmIF9pc0ludGVnZXIoIGhpQm91bmQgKSApIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoIHJhbmRvbSgpICogKCBoaUJvdW5kIC0gbG9Cb3VuZCArIDEgKSApICsgbG9Cb3VuZDsgXG5cbiAgICAgICAgICAgIC8vIHJldHVybiBmbG9hdFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmFuZG9tKCkgKiAoIGhpQm91bmQgLSBsb0JvdW5kICkgKyBsb0JvdW5kOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IGluaXRpYWxpemUgZ2VuZXJhdG9yIHdpdGggdGhlIHNlZWQgdmFsdWVzIHVzZWQgdXBvbiBpbnN0YW50aWF0aW9uICovXG4gICAgICAgIHJhbmRvbS5yZXN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBfaW5pdFN0YXRlKCBpbml0aWFsQXJncyApO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogc2VlZGluZyBmdW5jdGlvbiAqL1xuICAgICAgICByYW5kb20uc2VlZCA9IGZ1bmN0aW9uKCkgeyBcbiAgICAgICAgICAgIF9pbml0U3RhdGUoIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSApO1xuICAgICAgICB9OyBcblxuICAgICAgICAvKiBwdWJsaWM6IHNob3cgdGhlIHZlcnNpb24gb2YgdGhlIFJORyAqL1xuICAgICAgICByYW5kb20udmVyc2lvbiA9IGZ1bmN0aW9uKCkgeyBcbiAgICAgICAgICAgIHJldHVybiB2ZXJzaW9uO1xuICAgICAgICB9OyBcblxuICAgICAgICAvKiBwdWJsaWM6IHNob3cgdGhlIHZlcnNpb24gb2YgdGhlIFJORyBhbmQgdGhlIE1hc2ggc3RyaW5nIGhhc2hlciAqL1xuICAgICAgICByYW5kb20udmVyc2lvbnMgPSBmdW5jdGlvbigpIHsgXG4gICAgICAgICAgICByZXR1cm4gdmVyc2lvbiArICcsICcgKyBtYXNodmVyO1xuICAgICAgICB9OyBcblxuICAgICAgICAvLyB3aGVuIG5vIHNlZWQgaXMgc3BlY2lmaWVkLCBjcmVhdGUgYSByYW5kb20gb25lIGZyb20gV2luZG93cyBDcnlwdG8gKE1vbnRlIENhcmxvIGFwcGxpY2F0aW9uKSBcbiAgICAgICAgaWYoIGFyZ3MubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKCB1aW50YSApO1xuICAgICAgICAgICAgIGFyZ3MgPSBbIHVpbnRhWyAwIF0sIHVpbnRhWyAxIF0sIHVpbnRhWyAyIF0gXTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBzdG9yZSB0aGUgc2VlZCB1c2VkIHdoZW4gdGhlIFJORyB3YXMgaW5zdGFudGlhdGVkLCBpZiBhbnlcbiAgICAgICAgaW5pdGlhbEFyZ3MgPSBhcmdzO1xuXG4gICAgICAgIC8vIGluaXRpYWxpemUgdGhlIFJOR1xuICAgICAgICBfaW5pdFN0YXRlKCBhcmdzICk7XG5cbiAgICAgICAgcmV0dXJuIHJhbmRvbTtcblxuICAgIH0pKCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICkgKTtcbn07XG5cbmV4cG9ydCBjbGFzcyBSTkcge1xuICAgIGNvbnN0cnVjdG9yKHJuZ1NldHRpbmdzKSB7XG4gICAgICAgIGlmIChybmdTZXR0aW5ncy5yYW5kKSB7XG4gICAgICAgICAgdGhpcy5yYW5kID0gcm5nU2V0dGluZ3MucmFuZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsZXQgc2VlZDtcbiAgICAgICAgICBpZiAocm5nU2V0dGluZ3Muc2VlZCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHNlZWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKS50b1N0cmluZygpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWVkID0gcm5nU2V0dGluZ3Muc2VlZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5yYW5kID0gYWxlYVBSTkcoc2VlZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRTZWVkKHNlZWQpIHtcbiAgICAgICAgdGhpcy5hbGVhLnNlZWQoc2VlZC50b1N0cmluZygpKTtcbiAgICB9XG5cbiAgICAvLyBTdGFuZGFyZCB1bmlmb3JtIGdlbmVyYXRvciB2YWx1ZXMgaW4gWzAsMSlcbiAgICByYW5kb20oKSB7XG4gICAgICAgIHJldHVybih0aGlzLnJhbmQoKSk7XG4gICAgfVxuXG4gICAgLy8gUmFuZG9tbHkgY2hvb3NlICsxIG9yIC0xLlxuICAgIHJhbmRTaWduKCkge1xuICAgICAgICB2YXIgYSA9IDIqTWF0aC5mbG9vcigyKnRoaXMucmFuZG9tKCkpLTE7XG4gICAgICAgIHJldHVybihhKTtcbiAgICB9XG5cbiAgICAvLyBSYW5kb21seSBjaG9vc2UgaW50ZWdlciB1bmlmb3JtbHkgaW4ge21pbiwgLi4uLCBtYXh9LlxuICAgIHJhbmRJbnQobWluLCBtYXgpIHtcbiAgICAgICAgdmFyIGEgPSBtaW4rTWF0aC5mbG9vciggKG1heC1taW4rMSkqdGhpcy5yYW5kb20oKSApO1xuICAgICAgICByZXR1cm4oYSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFJhbmRvbWx5IGNob29zZSBmbG9hdGluZyBwb2ludCB1bmlmb3JtbHkgaW4gW21pbixtYXgpXG4gICAgcmFuZFVuaWZvcm0obWluLCBtYXgpIHtcbiAgICAgICAgdmFyIGEgPSBtaW4rKG1heC1taW4pKnRoaXMucmFuZG9tKCk7XG4gICAgICAgIHJldHVybihhKTtcbiAgICB9XG5cbiAgICAvLyBSYW5kb21seSBhIGstbGVuZ3RoIHBlcm11dGVkIHN1YnNlcXVlbmNlIG9mIHttaW4sIC4uLiwgbWF4fVxuICAgIHJhbmRDaG9pY2UobWluLCBtYXgsIGspIHtcbiAgICAgICAgdmFyIGEgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgdmFyIGIgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgdmFyIGksajtcbiAgICAgICAgZm9yIChpPTA7IGk8PW1heC1taW47IGkrKykge1xuICAgICAgICAgICAgYVtpXSA9IG1pbitpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaT0wOyBpPGs7IGkrKykge1xuICAgICAgICAgICAgaiA9IE1hdGguZmxvb3IoIChtYXgtbWluKzEtaSkqdGhpcy5yYW5kb20oKSApO1xuICAgICAgICAgICAgYltpXSA9IGEuc3BsaWNlKGosMSlbMF07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKGIpO1xuICAgIH1cblxuICAgIC8vIEdlbmVyYXRlIGEgcmFuZG9tIHJhdGlvbmFsIG51bWJlciwgcGFzc2luZyBpbiAyLWxlbiBhcnJheXMgZm9yIGxpbWl0cy5cbiAgICByYW5kUmF0aW9uYWwocExpbXMsIHFMaW1zKSB7XG4gICAgICAgIHZhciBwLCBxO1xuXG4gICAgICAgIC8vIEZpbmQgdGhlIHJhdyByYXRpb25hbCBudW1iZXJcbiAgICAgICAgcCA9IHRoaXMucmFuZEludChwTGltc1swXSwgcExpbXNbMV0pO1xuICAgICAgICBxID0gdGhpcy5yYW5kSW50KHFMaW1zWzBdLCBxTGltc1sxXSk7XG5cbiAgICAgICAgcmV0dXJuIChuZXcgcmF0aW9uYWxfbnVtYmVyKHAscSkpO1xuICAgIH1cblxuICAgIC8vIEdlbmVyYXRlIGEgcmFuZG9tIGhleCBjb2RlIG9mIGRlc2lyZWQgbGVuZ3RoLlxuICAgIHJhbmRIZXhIYXNoKG4pIHtcbiAgICAgIHZhciBoYXNoID0gJyc7XG4gICAgICB2YXIgY2hhcnMgPSAnMDEyMzQ1Njc4OWFiY2RlZic7XG4gICAgICBmb3IgKHZhciBpPTA7IGk8bjsgaSsrKSB7XG4gICAgICAgIGhhc2ggKz0gY2hhcnNbdGhpcy5yYW5kSW50KDAsMTUpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBoYXNoO1xuICAgIH1cbn0iLCIvKiFcbiAqIEJUTSBKYXZhU2NyaXB0IExpYnJhcnkgdkBWRVJTSU9OXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGJyaWFud2FsdG9uL0JUTVxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qKiBEZWZpbmUgYSBjbGFzcyB0byB3b3JrIHdpdGggcmF0aW9uYWwgbnVtYmVyc1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5pbXBvcnQgeyByZWFsX251bWJlciB9IGZyb20gXCIuL3JlYWxfbnVtYmVyLmpzXCI7XG5cbi8qIFByaXZhdGUgdXRpbGl0eSBjb21tYW5kcy4gKi9cbiAgXG5mdW5jdGlvbiBpc0ludCh4KSB7XG4gICAgdmFyIHJldFZhbHVlID0gZmFsc2U7XG4gICAgaWYgKE51bWJlci5pc0ludGVnZXIgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldFZhbHVlID0gKHggPT0gTWF0aC5mbG9vcih4KSk7XG4gICAgfSBlbHNlIHtcbiAgICByZXRWYWx1ZSA9IE51bWJlci5pc0ludGVnZXIoeCk7XG4gICAgfVxuICAgIHJldHVybiByZXRWYWx1ZTtcbn1cblxuXG4gLy8gSW1wbGVtZW50IEV1Y2xpZCdzIGFsZ29yaXRobS5cbiBleHBvcnQgZnVuY3Rpb24gZmluZEdDRChhLGIpIHtcbiAgICB2YXIgYztcbiAgICBhID0gTWF0aC5hYnMoYSk7XG4gICAgYiA9IE1hdGguYWJzKGIpO1xuICAgIGlmIChhIDwgYikge1xuICAgICAgICBjPWE7IGE9YjsgYj1jO1xuICAgIH1cblxuICAgIGlmIChiID09IDApXG4gICAgICAgIHJldHVybiAwO1xuXG4gICAgLy8gSW4gdGhpcyBsb29wLCB3ZSBhbHdheXMgaGF2ZSBhID4gYi5cbiAgICB3aGlsZSAoYiA+IDApIHtcbiAgICAgICAgYyA9IGEgJSBiO1xuICAgICAgICBhID0gYjtcbiAgICAgICAgYiA9IGM7XG4gICAgfVxuICAgIHJldHVybiBhO1xufVxuXG5leHBvcnQgY2xhc3MgcmF0aW9uYWxfbnVtYmVyIGV4dGVuZHMgcmVhbF9udW1iZXIge1xuICAgIGNvbnN0cnVjdG9yKHAscSkge1xuICAgICAgICBpZiAocSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHN1cGVyKHApO1xuICAgICAgICAgICAgdGhpcy5wID0gcDtcbiAgICAgICAgICAgIHRoaXMucSA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdXBlcihwL3EpO1xuICAgICAgICAgICAgaWYgKHEgPT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMucCA9IE1hdGguc3FydCgtMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5xID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLnEgPSAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocSA8IDApIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMucCA9IC1wO1xuICAgICAgICAgICAgICAgICAgdGhpcy5xID0gLXE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMucCA9IHA7XG4gICAgICAgICAgICAgICAgICB0aGlzLnEgPSBxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnNpbXBsaWZ5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYSBudW1lcmljYWwgdmFsdWUgb2YgdGhlIHJhdGlvbmFsIGV4cHJlc3Npb24uXG4gICAgdmFsdWUoKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5wL3RoaXMucSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFVzZSBFdWNsaWQncyBhbGdvcml0aG0gdG8gZmluZCB0aGUgZ2NkLCB0aGVuIHJlZHVjZVxuICAgIHNpbXBsaWZ5KCkge1xuICAgICAgICB2YXIgYTtcblxuICAgICAgICAvLyBEb24ndCBzaW1wbGlmeSBpZiBub3QgcmF0aW8gb2YgaW50ZWdlcnMuXG4gICAgICAgIGlmICh0aGlzLnAgJSAxICE9IDAgfHwgdGhpcy5xICUgMSAhPSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBhID0gZmluZEdDRCh0aGlzLnAsIHRoaXMucSk7XG4gICAgICAgIHRoaXMucCAvPSBhO1xuICAgICAgICB0aGlzLnEgLz0gYTtcbiAgICB9XG5cbiAgICBlcXVhbChvdGhlcikge1xuICAgICAgICBpZiAob3RoZXIuY29uc3RydWN0b3IubmFtZSAhPSBcInJhdGlvbmFsX251bWJlclwiKSB7XG4gICAgICAgICAgcmV0dXJuICh0aGlzLnZhbHVlKCk9PW90aGVyLnZhbHVlKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAodGhpcy5wLnZhbHVlT2YoKT09b3RoZXIucC52YWx1ZU9mKClcbiAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5xLnZhbHVlT2YoKSA9PSBvdGhlci5xLnZhbHVlT2YoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBZGQgdG8gdGhpcyByYXRpb25hbCBhbm90aGVyIHJhdGlvbmFsIG51bWJlciBhbmQgY3JlYXRlIG5ldyBvYmplY3QuXG4gICAgYWRkKG90aGVyKSB7XG4gICAgICAgIHZhciBzdW07XG4gICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIHJhdGlvbmFsX251bWJlcikge1xuICAgICAgICBzdW0gPSBuZXcgcmF0aW9uYWxfbnVtYmVyKHRoaXMucCpvdGhlci5xK290aGVyLnAqdGhpcy5xLCB0aGlzLnEqb3RoZXIucSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNJbnQob3RoZXIpKSB7XG4gICAgICAgIHN1bSA9IG5ldyByYXRpb25hbF9udW1iZXIodGhpcy5wK290aGVyKnRoaXMucSwgdGhpcy5xKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3VtID0gbmV3IHJlYWxfbnVtYmVyKHRoaXMudmFsdWUoKSArIG90aGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4oc3VtKTtcbiAgICB9XG5cbiAgICAvLyBTdWJ0cmFjdCBmcm9tIHRoaXMgcmF0aW9uYWwgYW5vdGhlciByYXRpb25hbCBudW1iZXIgYW5kIGNyZWF0ZSBuZXcgb2JqZWN0LlxuICAgIHN1YnRyYWN0KG90aGVyKSB7XG4gICAgICAgIHZhciBzdW07XG4gICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIHJhdGlvbmFsX251bWJlcikge1xuICAgICAgICAgICAgc3VtID0gbmV3IHJhdGlvbmFsX251bWJlcih0aGlzLnAqb3RoZXIucS1vdGhlci5wKnRoaXMucSwgdGhpcy5xKm90aGVyLnEpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzSW50KG90aGVyKSkge1xuICAgICAgICAgICAgc3VtID0gbmV3IHJhdGlvbmFsX251bWJlcih0aGlzLnAtb3RoZXIqdGhpcy5xLCB0aGlzLnEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3VtID0gbmV3IHJlYWxfbnVtYmVyKHRoaXMudmFsdWUoKSAtIG90aGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4oc3VtKTtcbiAgICB9XG5cbiAgICAvLyBNdWx0aXBseSB0aGlzIHJhdGlvbmFsIGJ5IGFub3RoZXIgcmF0aW9uYWwgbnVtYmVyIGFuZCBjcmVhdGUgbmV3IG9iamVjdC5cbiAgICBtdWx0aXBseShvdGhlcikge1xuICAgICAgICB2YXIgcHJvZHVjdDtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgcmF0aW9uYWxfbnVtYmVyKSB7XG4gICAgICAgICAgICBwcm9kdWN0ID0gbmV3IHJhdGlvbmFsX251bWJlcih0aGlzLnAqb3RoZXIucCwgdGhpcy5xKm90aGVyLnEpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzSW50KG90aGVyKSkge1xuICAgICAgICAgICAgcHJvZHVjdCA9IG5ldyByYXRpb25hbF9udW1iZXIodGhpcy5wKm90aGVyLCB0aGlzLnEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvZHVjdCA9IG5ldyByZWFsX251bWJlcih0aGlzLnZhbHVlKCkgKiBvdGhlcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ocHJvZHVjdCk7XG4gICAgfVxuXG4gICAgLy8gRGl2aWRlIHRoaXMgcmF0aW9uYWwgYnkgYW5vdGhlciByYXRpb25hbCBudW1iZXIgYW5kIGNyZWF0ZSBuZXcgb2JqZWN0LlxuICAgIGRpdmlkZShvdGhlcikge1xuICAgICAgICB2YXIgcHJvZHVjdDtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgcmF0aW9uYWxfbnVtYmVyKSB7XG4gICAgICAgICAgICBwcm9kdWN0ID0gbmV3IHJhdGlvbmFsX251bWJlcih0aGlzLnAqb3RoZXIucSwgdGhpcy5xKm90aGVyLnApO1xuICAgICAgICB9IGVsc2UgaWYgKGlzSW50KG90aGVyKSkge1xuICAgICAgICAgICAgcHJvZHVjdCA9IG5ldyByYXRpb25hbF9udW1iZXIodGhpcy5wLCB0aGlzLnEqb3RoZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvZHVjdCA9IG5ldyByZWFsX251bWJlcih0aGlzLnZhbHVlKCkgLyBvdGhlcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ocHJvZHVjdCk7XG4gICAgfVxuXG4gICAgLy8gQWRkaXRpdmUgSW52ZXJzZVxuICAgIGFkZEludmVyc2UoKSB7XG4gICAgICAgIHZhciBpbnZlcnNlID0gbmV3IHJhdGlvbmFsX251bWJlcigtdGhpcy5wLCB0aGlzLnEpO1xuICAgICAgICByZXR1cm4oaW52ZXJzZSk7XG4gICAgfVxuXG4gICAgLy8gTXVsdGlwbGljYXRpdmUgSW52ZXJzZVxuICAgIG11bHRJbnZlcnNlKCkge1xuICAgICAgICB2YXIgaW52ZXJzZTtcbiAgICAgICAgaWYgKHRoaXMucCAhPSAwKSB7XG4gICAgICAgICAgICBpbnZlcnNlID0gbmV3IHJhdGlvbmFsX251bWJlcih0aGlzLnEsIHRoaXMucCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnZlcnNlID0gbmV3IHJlYWxfbnVtYmVyKE5hTik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKGludmVyc2UpO1xuICAgIH1cblxuICAgIC8vIEZvcm1hdCB0aGUgcmF0aW9uYWwgbnVtYmVyIGFzIHN0cmluZy5cbiAgICB0b1N0cmluZyhsZWFkU2lnbikge1xuICAgICAgICBpZiAodHlwZW9mIGxlYWRTaWduID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBsZWFkU2lnbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdHIgPSAobGVhZFNpZ24gJiYgdGhpcy5wPjApID8gJysnIDogJyc7XG4gICAgICAgIGlmIChpc05hTih0aGlzLnApKSB7XG4gICAgICAgICAgICBzdHIgPSAnTmFOJztcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnEgPT0gMSkge1xuICAgICAgICAgICAgc3RyID0gc3RyICsgdGhpcy5wO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RyID0gc3RyICsgdGhpcy5wICsgJy8nICsgdGhpcy5xO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKHN0cik7XG4gICAgfVxuXG4gICAgLy8gRm9ybWF0IHRoZSByYXRpb25hbCBudW1iZXIgYXMgVGVYIHN0cmluZy5cbiAgICB0b1RlWChsZWFkU2lnbikge1xuICAgICAgICBpZiAodHlwZW9mIGxlYWRTaWduID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBsZWFkU2lnbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdHIgPSAobGVhZFNpZ24gJiYgdGhpcy5wPjApID8gJysnIDogJyc7XG4gICAgICAgIGlmIChpc05hTih0aGlzLnApKSB7XG4gICAgICAgICAgICBzdHIgPSAnXFxcXG1hdGhybXtOYU59JztcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnEgPT0gMSkge1xuICAgICAgICAgICAgc3RyID0gc3RyICsgdGhpcy5wO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMucCA8IDApIHtcbiAgICAgICAgICAgICAgICBzdHIgPSAnLVxcXFxmcmFjeycgKyAtdGhpcy5wICsgJ317JyArIHRoaXMucSArICd9JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RyID0gc3RyICsgJ1xcXFxmcmFjeycgKyB0aGlzLnAgKyAnfXsnICsgdGhpcy5xICsgJ30nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKHN0cik7XG4gICAgfVxuXG4gICAgdG9NYXRoTUwoKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbGVhZFNpZ24gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGxlYWRTaWduID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG9wQVN0ciA9IFwiPGNuPlwiICsgdGhpcy5wICsgXCI8L2NuPlwiLFxuICAgICAgICAgICAgb3BCU3RyID0gXCI8Y24+XCIgKyB0aGlzLnEgKyBcIjwvY24+XCI7XG5cbiAgICAgICAgcmV0dXJuKFwiPGNuPlwiICsgdGhpcy50b1N0cmluZygpICsgXCI8L2NuPlwiKTtcblxuICAgICAgICBpZiAoaXNOYU4odGhpcy5wKSkge1xuICAgICAgICAgICAgc3RyID0gXCI8Y24+PzwvY24+XCI7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5xID09IDEpIHtcbiAgICAgICAgICAgIHN0ciA9IG9wQVN0cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0ciA9IFwiPGFwcGx5PjxkaXZpZGUvPlwiK29wQVN0citvcEJTdHIrXCI8L2FwcGx5PlwiO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuXG5cbiBcblxuXG5cbiIsIi8qIVxuICogQlRNIEphdmFTY3JpcHQgTGlicmFyeSB2QFZFUlNJT05cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kYnJpYW53YWx0b24vQlRNXG4gKlxuICogQ29weXJpZ2h0IEQuIEJyaWFuIFdhbHRvblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIChodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVClcbiAqXG4gKiBEYXRlOiBAREFURVxuICovXG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbioqIERlZmluZSBhIGdlbmVyaWMgY2xhc3MgdG8gd29yayBudW1iZXJzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmV4cG9ydCBjbGFzcyByZWFsX251bWJlciB7XG4gICAgY29uc3RydWN0b3IoYSkge1xuICAgICAgaWYgKHR5cGVvZiBhID09PSAnbnVtYmVyJyB8fCBhIGluc3RhbmNlb2YgTnVtYmVyKSB7XG4gICAgICAgIHRoaXMubnVtYmVyID0gYTtcbiAgICAgIH0gZWxzZSBpZiAoYSBpbnN0YW5jZW9mIHJlYWxfbnVtYmVyKSB7XG4gICAgICAgIHRoaXMubnVtYmVyID0gYS5udW1iZXI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGEgbnVtZXJpY2FsIHZhbHVlIG9mIHRoZSByYXRpb25hbCBleHByZXNzaW9uLlxuICAgIHZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5udW1iZXI7XG4gICAgfVxuICAgIFxuICAgIC8vIFJlYWwgbnVtYmVycyBoYXZlIG5vIG5hdHVyYWwgc2ltcGxpZmljYXRpb24sIGJ1dCBkZWNsYXJpbmcgdGhlIG1ldGhvZC5cbiAgICBzaW1wbGlmeSgpIHtcbiAgICB9XG5cbiAgICBlcXVhbChvdGhlcikge1xuICAgICAgaWYgKHR5cGVvZiBvdGhlciA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgb3RoZXIgPSBuZXcgcmVhbF9udW1iZXIob3RoZXIpO1xuICAgICAgfVxuICAgICAgICByZXR1cm4gKHRoaXMudmFsdWUoKT09b3RoZXIudmFsdWUoKSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIG51bWJlcnMuXG4gICAgYWRkKG90aGVyKSB7XG4gICAgICBpZiAodHlwZW9mIG90aGVyID09PSAnbnVtYmVyJykge1xuICAgICAgICBvdGhlciA9IG5ldyByZWFsX251bWJlcihvdGhlcik7XG4gICAgICB9XG4gICAgICAgIHZhciBzdW0gPSBuZXcgcmVhbF9udW1iZXIodGhpcy5udW1iZXIgKyBvdGhlci52YWx1ZSgpKTtcbiAgICAgICAgcmV0dXJuKHN1bSk7XG4gICAgfVxuXG4gICAgLy8gU3VidHJhY3QgdGhpcyAtIG90aGVyXG4gICAgc3VidHJhY3Qob3RoZXIpIHtcbiAgICAgIGlmICh0eXBlb2Ygb3RoZXIgPT09ICdudW1iZXInKSB7XG4gICAgICAgIG90aGVyID0gbmV3IHJlYWxfbnVtYmVyKG90aGVyKTtcbiAgICAgIH1cbiAgICAgICAgdmFyIHN1bSA9IG5ldyByZWFsX251bWJlcih0aGlzLm51bWJlciAtIG90aGVyLnZhbHVlKCkpO1xuICAgICAgICByZXR1cm4oc3VtKTtcbiAgICB9XG5cbiAgICAvLyBNdWx0aXBseSB0aGlzIHJhdGlvbmFsIGJ5IGFub3RoZXIgcmF0aW9uYWwgbnVtYmVyIGFuZCBjcmVhdGUgbmV3IG9iamVjdC5cbiAgICBtdWx0aXBseShvdGhlcikge1xuICAgICAgaWYgKHR5cGVvZiBvdGhlciA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgb3RoZXIgPSBuZXcgcmVhbF9udW1iZXIob3RoZXIpO1xuICAgICAgfVxuICAgICAgICB2YXIgcHJvZHVjdCA9IG5ldyByZWFsX251bWJlcih0aGlzLm51bWJlciAqIG90aGVyLnZhbHVlKCkpO1xuICAgICAgICByZXR1cm4ocHJvZHVjdCk7XG4gICAgfVxuXG4gICAgLy8gRGl2aWRlIHRoaXMgcmF0aW9uYWwgYnkgYW5vdGhlciByYXRpb25hbCBudW1iZXIgYW5kIGNyZWF0ZSBuZXcgb2JqZWN0LlxuICAgIGRpdmlkZShvdGhlcikge1xuICAgICAgaWYgKHR5cGVvZiBvdGhlciA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgb3RoZXIgPSBuZXcgcmVhbF9udW1iZXIob3RoZXIpO1xuICAgICAgfVxuICAgICAgICB2YXIgcHJvZHVjdDtcbiAgICAgICAgaWYgKG90aGVyLnZhbHVlICE9IDApIHtcbiAgICAgICAgICAgIHByb2R1Y3QgPSBuZXcgcmVhbF9udW1iZXIodGhpcy5udW1iZXIgLyBvdGhlci52YWx1ZSgpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb2R1Y3QgPSBuZXcgcmVhbF9udW1iZXIoTmFOKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ocHJvZHVjdCk7XG4gICAgfVxuXG4gICAgLy8gQWRkaXRpdmUgSW52ZXJzZVxuICAgIGFkZEludmVyc2UoKSB7XG4gICAgICAgIHZhciBpbnZlcnNlID0gbmV3IHJlYWxfbnVtYmVyKC10aGlzLm51bWJlcik7XG4gICAgICAgIHJldHVybihpbnZlcnNlKTtcbiAgICB9XG5cbiAgICAvLyBNdWx0aXBsaWNhdGl2ZSBJbnZlcnNlXG4gICAgbXVsdEludmVyc2UoKSB7XG4gICAgICAgIHZhciBpbnZlcnNlO1xuICAgICAgICBpZiAodGhpcy5udW1iZXIgIT0gMCkge1xuICAgICAgICAgICAgaW52ZXJzZSA9IG5ldyByZWFsX251bWJlcih0aGlzLm51bWJlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnZlcnNlID0gbmV3IHJlYWxfbnVtYmVyKE5hTik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKGludmVyc2UpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKGxlYWRTaWduKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbGVhZFNpZ24gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGxlYWRTaWduID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0ciA9IChsZWFkU2lnbiAmJiB0aGlzLm51bWJlcj4wKSA/ICcrJyA6ICcnO1xuICAgICAgICBpZiAoaXNOYU4odGhpcy5udW1iZXIpKSB7XG4gICAgICAgICAgICBzdHIgPSAnTmFOJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ciArIE51bWJlcih0aGlzLm51bWJlci50b0ZpeGVkKDEwKSk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIHJldHVybihzdHIpO1xuICAgIH1cbiAgXG4gICAgLy8gRm9ybWF0IHRoZSByYXRpb25hbCBudW1iZXIgYXMgVGVYIHN0cmluZy5cbiAgICB0b1RlWChsZWFkU2lnbikge1xuICAgICAgICBpZiAodHlwZW9mIGxlYWRTaWduID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBsZWFkU2lnbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdHIgPSAobGVhZFNpZ24gJiYgdGhpcy5udW1iZXI+MCkgPyAnKycgOiAnJztcbiAgICAgICAgaWYgKGlzTmFOKHRoaXMubnVtYmVyKSkge1xuICAgICAgICAgICAgc3RyID0gJ1xcXFxtYXRocm17TmFOfSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHIgPSBzdHIgKyBOdW1iZXIodGhpcy50b1N0cmluZyhsZWFkU2lnbikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihzdHIpO1xuICAgIH1cblxuICAgIC8vIEZvcm1hdCBhcyBhIHJvb3QgTWF0aE1MIGVsZW1lbnQuXG4gICAgdG9NYXRoTUwobGVhZFNpZ24pIHtcbiAgICAgICAgcmV0dXJuKFwiPGNuPlwiICsgdGhpcy50b1N0cmluZygpICsgXCI8L2NuPlwiKTtcbiAgICB9XG59XG5cblxuXG5cblxuIFxuXG5cblxuIiwiLyohXG4gKiBCVE0gSmF2YVNjcmlwdCBMaWJyYXJ5IHZAVkVSU0lPTlxuICogaHR0cHM6Ly9naXRodWIuY29tL2RicmlhbndhbHRvbi9CVE1cbiAqXG4gKiBDb3B5cmlnaHQgRC4gQnJpYW4gV2FsdG9uXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUKVxuICpcbiAqIERhdGU6IEBEQVRFXG4gKi9cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qKiAgRGVhbGluZyB3aXRoIGlkZW50aXRpZXMgYW5kIHJlZHVjdGlvbnMuXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuaW1wb3J0IHtCVE0sIGV4cHJUeXBlLCBleHByVmFsdWUgfSBmcm9tIFwiLi9CVE1fcm9vdC5qc1wiO1xuXG5jbGFzcyBJZGVudGl0eSB7XG4gICAgY29uc3RydWN0b3IocmVmRXhwciwgZXFFeHByLCBkZXNjcmlwdGlvbiwgaXNWYWxpZCwgaWROdW0pIHtcbiAgICAgICAgdGhpcy5yZWZFeHByID0gcmVmRXhwcjtcbiAgICAgICAgdGhpcy5lcUV4cHIgPSBlcUV4cHI7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICAgICAgdGhpcy5pc1ZhbGlkID0gaXNWYWxpZDtcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuaWROdW0gPSBpZE51bTtcbiAgICB9XG59XG5cbmNsYXNzIE1hdGNoIHtcbiAgICBjb25zdHJ1Y3Rvcih0ZXN0UnVsZSwgYmluZGluZ3MpIHtcbiAgICAgICAgLy8gRmluZCB1bmJvdW5kIHZhcmlhYmxlcy5cbiAgICAgICAgdmFyIGFsbFZhcnMgPSB0ZXN0UnVsZS5lcUV4cHIuZGVwZW5kZW5jaWVzKCksXG4gICAgICAgICAgICBtaXNzVmFycyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBqIGluIGFsbFZhcnMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYmluZGluZ3NbYWxsVmFyc1tqXV0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBtaXNzVmFycy5wdXNoKGFsbFZhcnNbal0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGogaW4gbWlzc1ZhcnMpIHtcbiAgICAgICAgICAgIGJpbmRpbmdzW21pc3NWYXJzW2pdXSA9IFwiaW5wdXRcIisoK2orMSkrXCJcIjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3Vic3RFeHByID0gdGVzdFJ1bGUuZXFFeHByLmNvbXBvc2UoYmluZGluZ3MpO1xuXG4gICAgICAgIHRoaXMuc3ViVGVYID0gc3Vic3RFeHByLnRvVGVYKCk7XG4gICAgICAgIHRoaXMuc3ViU3RyID0gc3Vic3RFeHByLnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IHRlc3RSdWxlLmRlc2NyaXB0aW9uO1xuICAgICAgICBpZiAoc3Vic3RFeHByLnR5cGUgPT0gZXhwclR5cGUuYmlub3AgJiYgc3Vic3RFeHByLnZhbHVlVHlwZSA9PSBleHByVmFsdWUuYm9vbCkge1xuICAgICAgICAgICAgdGhpcy5lcXVhdGlvbiA9IHRlc3RSdWxlLnJlZkV4cHIudG9UZVgoKSArIFwiIFxcXFxpZmYgXCIgKyB0ZXN0UnVsZS5lcUV4cHIudG9UZVgoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZXF1YXRpb24gPSB0ZXN0UnVsZS5yZWZFeHByLnRvVGVYKCkgKyBcIj1cIiArIHRlc3RSdWxlLmVxRXhwci50b1RlWCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSBiaW5kaW5ncztcbiAgICAgICAgdGhpcy5udW1JbnB1dHMgPSBtaXNzVmFycy5sZW5ndGg7XG4gICAgICAgIHRoaXMucnVsZUlEID0gdGVzdFJ1bGUuaWROdW07XG4gICAgfVxufVxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIG5ld1J1bGUoYnRtLCByZWR1Y3Rpb25MaXN0LCBlcXVhdGlvbiwgZGVzY3JpcHRpb24sIGlzVmFsaWQsIHVzZU9uZVdheSwgY29uc3RyYWludHMpIHtcbiAgICB2YXIgZXhwckZvcm11bGFzID0gZXF1YXRpb24uc3BsaXQoJz09Jyk7XG4gICAgaWYgKGV4cHJGb3JtdWxhcy5sZW5ndGggIT0gMikge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkludmFsaWQgZXF1YXRpb24gaW4gaWRlbnRpdHkgbGlzdDogXCIgKyBlcXVhdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgcmVmSUQ9MDsgcmVmSUQgPD0gMTsgcmVmSUQrKykge1xuICAgICAgICAgICAgaWYgKHJlZklEID09IDEgJiYgdHlwZW9mIHVzZU9uZVdheSAhPSAndW5kZWZpbmVkJyAmJiB1c2VPbmVXYXkpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBpZGVudGl0eTtcblxuICAgICAgICAgICAgdmFyIHJlZkV4cHIgPSBidG0ucGFyc2UoZXhwckZvcm11bGFzW3JlZklEXSxcImZvcm11bGFcIik7XG4gICAgICAgICAgICB2YXIgZXFFeHByID0gYnRtLnBhcnNlKGV4cHJGb3JtdWxhc1sxLXJlZklEXSxcImZvcm11bGFcIik7XG4gICAgICAgICAgICB2YXIgbnVtVmFycyA9IHJlZkV4cHIuZGVwZW5kZW5jaWVzKCkubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIGFsbFJlZkV4cHIgPSBbZXhwckZvcm11bGFzW3JlZklEXV07XG4gICAgICAgICAgICAvLyB0aGlzIGlzIGEgYmlnIHNsb3cgZG93biwgc28ganVzdCBtYWtlIHN1cmUgZWFjaCBydWxlIGlzIHdyaXR0ZW4gaW4gbXVsdGlwbGUgd2F5cy5cbiAgICAgICAgICAgIC8vICAgICAgdmFyIGFsbFJlZkV4cHIgPSByZWZFeHByLmFsbFN0cmluZ0VxdWl2cygpO1xuXG4gICAgICAgICAgICB2YXIgdW5pcXVlRXhwciA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBhbGxSZWZFeHByKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRFeHByID0gYnRtLnBhcnNlKGFsbFJlZkV4cHJbaV0sXCJmb3JtdWxhXCIpO1xuICAgICAgICAgICAgICAgIHZhciBpc05ldyA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiB1bmlxdWVFeHByKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBiaW5kaW5ncyA9IHVuaXF1ZUV4cHJbal0ubWF0Y2gobmV4dEV4cHIsIHt9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJpbmRpbmdzICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc05ldyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpc05ldykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcnVsZUlEID0gcmVkdWN0aW9uTGlzdC5sZW5ndGgrMTtcbiAgICAgICAgICAgICAgICAgICAgaWRlbnRpdHkgPSBuZXcgSWRlbnRpdHkobmV4dEV4cHIsIGVxRXhwciwgZGVzY3JpcHRpb24sIGlzVmFsaWQsIHJ1bGVJRCk7XG4gICAgICAgICAgICAgICAgICAgIHJlZHVjdGlvbkxpc3QucHVzaChpZGVudGl0eSk7XG4gICAgICAgICAgICAgICAgICAgIHVuaXF1ZUV4cHIucHVzaChuZXh0RXhwcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBEaXNhYmxlIGEgcnVsZSBpbiB0aGUgbGlzdC5cbmV4cG9ydCBmdW5jdGlvbiBkaXNhYmxlUnVsZShidG0sIHJlZHVjdGlvbkxpc3QsIGVxdWF0aW9uKSB7XG4gIC8vIE1hdGNoIG9ubHkgb24gcmVmRXhwci5cbiAgdmFyIGV4cHJGb3JtdWxhcyA9IGVxdWF0aW9uLnNwbGl0KCc9PScpO1xuICB2YXIgcmVmRXhwciwgZXFFeHByO1xuICBpZiAoZXhwckZvcm11bGFzLmxlbmd0aCA+IDIpIHtcbiAgICBjb25zb2xlLmxvZyhcIkludmFsaWQgZXF1YXRpb24gaW4gaWRlbnRpdHkgbGlzdDogXCIgKyBlcXVhdGlvbik7XG4gICAgcmV0dXJuO1xuICB9IGVsc2Uge1xuICAgIHJlZkV4cHIgPSBidG0ucGFyc2UoZXhwckZvcm11bGFzWzBdLFwiZm9ybXVsYVwiKTtcbiAgfVxuICBmb3IgKHZhciBpIGluIHJlZHVjdGlvbkxpc3QpIHtcbiAgICB2YXIgdGVzdFJ1bGUgPSByZWR1Y3Rpb25MaXN0W2ldO1xuICAgIHZhciBiaW5kaW5ncyA9IHRlc3RSdWxlLnJlZkV4cHIubWF0Y2gocmVmRXhwciwge30pXG4gICAgaWYgKGJpbmRpbmdzICE9PSBudWxsKSB7XG4gICAgICByZWR1Y3Rpb25MaXN0W2ldLmlzQWN0aXZlID0gZmFsc2U7XG4gICAgfVxufVxufVxuXG4vKiAqKioqKioqKioqKioqKioqKioqXG4qKiBHaXZlbiBhIGxpc3Qgb2YgcmVkdWN0aW9uIHJ1bGVzIGFuZCBhIGdpdmVuIGV4cHJlc3Npb24sXG4qKiB0ZXN0IGVhY2ggcmVkdWN0aW9uIHJ1bGUgdG8gc2VlIGlmIGl0IG1hdGNoZXMgdGhlIHN0cnVjdHVyZS5cbioqIENyZWF0ZSBhbiBhcnJheSBvZiBuZXcgb2JqZWN0cyB3aXRoIGJpbmRpbmdzIHN0YXRpbmcgd2hhdFxuKiogc3Vic3RpdHV0aW9ucyBhcmUgbmVjZXNzYXJ5IHRvIG1ha2UgdGhlIG1hdGNoZXMuXG4qKioqKioqKioqKioqKioqKioqICovXG5leHBvcnQgZnVuY3Rpb24gZmluZE1hdGNoUnVsZXMocmVkdWN0aW9uTGlzdCwgdGVzdEV4cHIsIGRvVmFsaWRhdGUpIHtcbiAgICB2YXIgbWF0Y2hMaXN0ID0gW107XG4gICAgdmFyIGksIHRlc3RSdWxlO1xuICAgIGZvciAoaSBpbiByZWR1Y3Rpb25MaXN0KSB7XG4gICAgICAgIHRlc3RSdWxlID0gcmVkdWN0aW9uTGlzdFtpXTtcbiAgICAgICAgdmFyIGJpbmRpbmdzID0gdGVzdFJ1bGUucmVmRXhwci5tYXRjaCh0ZXN0RXhwciwge30pXG4gICAgICAgIGlmICh0ZXN0UnVsZS5pc0FjdGl2ZSAmJiBiaW5kaW5ncyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIG1hdGNoID0gbmV3IE1hdGNoKHRlc3RSdWxlLCBiaW5kaW5ncyk7XG4gICAgICAgICAgICBtYXRjaExpc3QucHVzaChtYXRjaCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuKG1hdGNoTGlzdCk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRSZWR1Y3Rpb25zKGJ0bSkge1xuICAgIHZhciByZWR1Y2VSdWxlcyA9IG5ldyBBcnJheSgpO1xuXG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAnMCt4PT14JywgJ0FkZGl0aXZlIElkZW50aXR5JywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAneCswPT14JywgJ0FkZGl0aXZlIElkZW50aXR5JywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAnMC14PT0teCcsICdBZGRpdGl2ZSBJbnZlcnNlJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAneC0wPT14JywgJ0FkZGl0aXZlIElkZW50aXR5JywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAnMCp4PT0wJywgJ011bHRpcGx5IGJ5IFplcm8nLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICd4KjA9PTAnLCAnTXVsdGlwbHkgYnkgWmVybycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJzEqeD09eCcsICdNdWx0aXBsaWNhdGl2ZSBJZGVudGl0eScsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJ3gqMT09eCcsICdNdWx0aXBsaWNhdGl2ZSBJZGVudGl0eScsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJzAveD09MCcsICdNdWx0aXBseSBieSBaZXJvJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAneC8xPT14JywgJ0RpdmlkZSBieSBPbmUnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICd4XjE9PXgnLCAnRmlyc3QgUG93ZXInLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICd4XjA9PTEnLCAnWmVybyBQb3dlcicsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJ3heKC1hKT09MS8oeF5hKScsICdOZWdhdGl2ZSBQb3dlcicsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJzFeeD09MScsICdPbmUgdG8gYSBQb3dlcicsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJy0xKng9PS14JywgJ011bHRpcGxpY2F0aXZlIElkZW50aXR5JywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAneCotMT09LXgnLCAnTXVsdGlwbGljYXRpdmUgSWRlbnRpdHknLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICd4LXg9PTAnLCAnQWRkaXRpdmUgSW52ZXJzZXMgQ2FuY2VsJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAneCsteD09MCcsICdBZGRpdGl2ZSBJbnZlcnNlcyBDYW5jZWwnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICcteCt4PT0wJywgJ0FkZGl0aXZlIEludmVyc2VzIENhbmNlbCcsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJygteCkreT09eS14JywgXCJTd2FwIExlYWRpbmcgTmVnYXRpdmVcIiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAneCsoLXkpPT14LXknLCBcIlN1YnRyYWN0aW9uXCIsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJygteCkrKC15KT09LSh4K3kpJywgXCJGYWN0b3IgTmVnYXRpb24gZnJvbSBBZGRpdGlvblwiLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICcoLXgpLXk9PS0oeCt5KScsIFwiRmFjdG9yIE5lZ2F0aW9uIGZyb20gQWRkaXRpb25cIiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAneC0oLXkpPT14K3knLCBcIkFkZGl0aXZlIEludmVyc2UncyBJbnZlcnNlXCIsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJygteCkqeT09LSh4KnkpJywgXCJGYWN0b3IgTmVnYXRpb24gZnJvbSBNdWx0aXBsaWNhdGlvblwiLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICd4KigteSk9PS0oeCp5KScsIFwiRmFjdG9yIE5lZ2F0aW9uIGZyb20gTXVsdGlwbGljYXRpb25cIiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAnKC14KS95PT0tKHgveSknLCBcIkZhY3RvciBOZWdhdGlvbiBmcm9tIE11bHRpcGxpY2F0aW9uXCIsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJ3gvKC15KT09LSh4L3kpJywgXCJGYWN0b3IgTmVnYXRpb24gZnJvbSBNdWx0aXBsaWNhdGlvblwiLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICctKC14KT09eCcsIFwiQWRkaXRpdmUgSW52ZXJzZSdzIEludmVyc2VcIiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAnLygveCk9PXgnLCBcIk11bHRpcGxpY2F0aXZlIEludmVyc2UncyBJbnZlcnNlXCIsIHRydWUsIHRydWUpO1xuXG4gICAgcmV0dXJuKHJlZHVjZVJ1bGVzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRTdW1SZWR1Y3Rpb25zKGJ0bSkge1xuICAgIHZhciBzdW1SZWR1Y3Rpb25zID0gbmV3IEFycmF5KCk7XG5cbiAgICBuZXdSdWxlKGJ0bSwgc3VtUmVkdWN0aW9ucywgJ2ErMD09YScsICdTaW1wbGlmeSBBZGRpdGlvbiBieSBaZXJvJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHN1bVJlZHVjdGlvbnMsICcwK2E9PWEnLCAnU2ltcGxpZnkgQWRkaXRpb24gYnkgWmVybycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBzdW1SZWR1Y3Rpb25zLCAnYS1hPT0wJywgJ0NhbmNlbCBBZGRpdGl2ZSBJbnZlcnNlcycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBzdW1SZWR1Y3Rpb25zLCAnYSstYT09MCcsICdDYW5jZWwgQWRkaXRpdmUgSW52ZXJzZXMnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgc3VtUmVkdWN0aW9ucywgJy1hK2E9PTAnLCAnQ2FuY2VsIEFkZGl0aXZlIEludmVyc2VzJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHN1bVJlZHVjdGlvbnMsICdhKmIrLWEqYj09MCcsICdDYW5jZWwgQWRkaXRpdmUgSW52ZXJzZXMnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgc3VtUmVkdWN0aW9ucywgJy1hKmIrYSpiPT0wJywgJ0NhbmNlbCBBZGRpdGl2ZSBJbnZlcnNlcycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBzdW1SZWR1Y3Rpb25zLCAnYSooYitjKT09YSpiK2EqYycsICdFeHBhbmQgUHJvZHVjdHMgYnkgRGlzdHJpYnV0aW5nJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHN1bVJlZHVjdGlvbnMsICcoYStiKSpjPT1hKmMrYipjJywgJ0V4cGFuZCBQcm9kdWN0cyBieSBEaXN0cmlidXRpbmcnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgc3VtUmVkdWN0aW9ucywgJ2EqKGItYyk9PWEqYi1hKmMnLCAnRXhwYW5kIFByb2R1Y3RzIGJ5IERpc3RyaWJ1dGluZycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBzdW1SZWR1Y3Rpb25zLCAnKGEtYikqYz09YSpjLWIqYycsICdFeHBhbmQgUHJvZHVjdHMgYnkgRGlzdHJpYnV0aW5nJywgdHJ1ZSwgdHJ1ZSk7XG5cbiAgICByZXR1cm4oc3VtUmVkdWN0aW9ucyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0UHJvZHVjdFJlZHVjdGlvbnMoYnRtKSB7XG4gICAgdmFyIHByb2R1Y3RSZWR1Y3Rpb25zID0gbmV3IEFycmF5KCk7XG5cbiAgICBuZXdSdWxlKGJ0bSwgcHJvZHVjdFJlZHVjdGlvbnMsICcwKmE9PTAnLCAnU2ltcGxpZnkgTXVsdGlwbGljYXRpb24gYnkgWmVybycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBwcm9kdWN0UmVkdWN0aW9ucywgJ2EqMD09MCcsICdTaW1wbGlmeSBNdWx0aXBsaWNhdGlvbiBieSBaZXJvJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHByb2R1Y3RSZWR1Y3Rpb25zLCAnMSphPT1hJywgJ1NpbXBsaWZ5IE11bHRpcGxpY2F0aW9uIGJ5IE9uZScsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBwcm9kdWN0UmVkdWN0aW9ucywgJ2EqMT09YScsICdTaW1wbGlmeSBNdWx0aXBsaWNhdGlvbiBieSBPbmUnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcHJvZHVjdFJlZHVjdGlvbnMsICdhL2E9PTEnLCAnQ2FuY2VsIE11bHRpcGxpY2F0aXZlIEludmVyc2VzJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHByb2R1Y3RSZWR1Y3Rpb25zLCAnYSovYT09MScsICdDYW5jZWwgTXVsdGlwbGljYXRpdmUgSW52ZXJzZXMnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcHJvZHVjdFJlZHVjdGlvbnMsICcvYSphPT0xJywgJ0NhbmNlbCBNdWx0aXBsaWNhdGl2ZSBJbnZlcnNlcycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBwcm9kdWN0UmVkdWN0aW9ucywgJyhhKmIpLyhhKmMpPT1iL2MnLCAnQ2FuY2VsIENvbW1vbiBGYWN0b3JzJywgdHJ1ZSx0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcHJvZHVjdFJlZHVjdGlvbnMsICdhXm0vYV5uPT1hXihtLW4pJywgJ0NhbmNlbCBDb21tb24gRmFjdG9ycycsIHRydWUsdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHByb2R1Y3RSZWR1Y3Rpb25zLCAnKGFebSpiKS8oYV5uKmMpPT0oYV4obS1uKSpiKS9jJywgJ0NhbmNlbCBDb21tb24gRmFjdG9ycycsIHRydWUsdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHByb2R1Y3RSZWR1Y3Rpb25zLCAnYSphPT1hXjInLCAnV3JpdGUgUHJvZHVjdHMgb2YgQ29tbW9uIFRlcm1zIGFzIFBvd2VycycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBwcm9kdWN0UmVkdWN0aW9ucywgJ2EqYV5uPT1hXihuKzEpJywgJ1dyaXRlIFByb2R1Y3RzIG9mIENvbW1vbiBUZXJtcyBhcyBQb3dlcnMnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcHJvZHVjdFJlZHVjdGlvbnMsICdhXm4qYT09YV4obisxKScsICdXcml0ZSBQcm9kdWN0cyBvZiBDb21tb24gVGVybXMgYXMgUG93ZXJzJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHByb2R1Y3RSZWR1Y3Rpb25zLCAnYV5tKmFebj09YV4obStuKScsICdXcml0ZSBQcm9kdWN0cyBvZiBDb21tb24gVGVybXMgYXMgUG93ZXJzJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHByb2R1Y3RSZWR1Y3Rpb25zLCAnKGFeLW0qYikvYz09Yi8oYV5tKmMpJywgJ1Jld3JpdGUgVXNpbmcgUG9zaXRpdmUgUG93ZXJzJywgdHJ1ZSx0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcHJvZHVjdFJlZHVjdGlvbnMsICcoYiphXi1tKS9jPT1iLyhhXm0qYyknLCAnUmV3cml0ZSBVc2luZyBQb3NpdGl2ZSBQb3dlcnMnLCB0cnVlLHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBwcm9kdWN0UmVkdWN0aW9ucywgJ2IvKGFeLW0qYyk9PShhXm0qYikvYycsICdSZXdyaXRlIFVzaW5nIFBvc2l0aXZlIFBvd2VycycsIHRydWUsdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHByb2R1Y3RSZWR1Y3Rpb25zLCAnYi8oYyphXi1tKT09KGFebSpiKS9jJywgJ1Jld3JpdGUgVXNpbmcgUG9zaXRpdmUgUG93ZXJzJywgdHJ1ZSx0cnVlKTtcblxuICAgIHJldHVybiAocHJvZHVjdFJlZHVjdGlvbnMpO1xuICB9IiwiLyohXG4gKiBCVE0gSmF2YVNjcmlwdCBMaWJyYXJ5IHZAVkVSU0lPTlxuICogaHR0cHM6Ly9naXRodWIuY29tL2RicmlhbndhbHRvbi9CVE1cbiAqXG4gKiBDb3B5cmlnaHQgRC4gQnJpYW4gV2FsdG9uXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUKVxuICpcbiAqIERhdGU6IEBEQVRFXG4gKi9cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIERlZmluZSB0aGUgU2NhbGFyIEV4cHJlc3Npb24gLS0gYSBudW1lcmljYWwgdmFsdWVcbiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmltcG9ydCB7IGV4cHJlc3Npb24gfSBmcm9tIFwiLi9leHByZXNzaW9uLmpzXCJcbmltcG9ydCB7IHJlYWxfbnVtYmVyIH0gZnJvbSBcIi4vcmVhbF9udW1iZXIuanNcIlxuaW1wb3J0IHsgcmF0aW9uYWxfbnVtYmVyIH0gZnJvbSBcIi4vcmF0aW9uYWxfbnVtYmVyLmpzXCJcbmltcG9ydCB7IGV4cHJUeXBlIH0gZnJvbSBcIi4vQlRNX3Jvb3QuanNcIlxuXG5leHBvcnQgY2xhc3Mgc2NhbGFyX2V4cHIgZXh0ZW5kcyBleHByZXNzaW9uIHtcbiAgICBjb25zdHJ1Y3RvcihidG0sIG51bWJlcikge1xuICAgICAgICBzdXBlcihidG0pO1xuICAgICAgICB0aGlzLnR5cGUgPSBleHByVHlwZS5udW1iZXI7XG4gICAgICAgIGlmICh0eXBlb2YgbnVtYmVyID09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIChudW1iZXIuY29uc3RydWN0b3IubmFtZSA9PT0gXCJyYXRpb25hbF9udW1iZXJcIlxuICAgICAgICAgICAgICB8fFxuICAgICAgICAgICAgIG51bWJlci5jb25zdHJ1Y3Rvci5uYW1lID09PSBcInJlYWxfbnVtYmVyXCIpXG4gICAgICAgICAgICApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMubnVtYmVyID0gbnVtYmVyO1xuICAgICAgICB9IGVsc2UgaWYgKE1hdGguZmxvb3IobnVtYmVyKT09bnVtYmVyKSB7XG4gICAgICAgICAgICB0aGlzLm51bWJlciA9IG5ldyByYXRpb25hbF9udW1iZXIobnVtYmVyLCAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubnVtYmVyID0gbmV3IHJlYWxfbnVtYmVyKG51bWJlcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250ZXh0ID0gXCJudW1iZXJcIjtcbiAgICB9XG5cbiAgICAvLyBQYXJzZWQgcmVwcmVzZW50YXRpb24uXG4gICAgdG9TdHJpbmcoZWxlbWVudE9ubHkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50T25seSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZWxlbWVudE9ubHkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4odGhpcy5udW1iZXIudG9TdHJpbmcoKSk7XG4gICAgfVxuICAgIFxuICAgIC8vIERpc3BsYXkgcmVwcmVzZW50YXRpb24uXG4gICAgdG9UZVgoc2hvd1NlbGVjdCkge1xuICAgICAgICBpZiAodHlwZW9mIHNob3dTZWxlY3QgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHNob3dTZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgd29yZCA9IHRoaXMubnVtYmVyLnRvVGVYKCk7XG4gICAgICAgIGlmIChzaG93U2VsZWN0ICYmIHRoaXMuc2VsZWN0KSB7XG4gICAgICAgICAgICB3b3JkID0gXCJ7XFxcXGNvbG9ye3JlZH1cIiArIHdvcmQgKyBcIn1cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4od29yZCk7XG4gICAgfVxuICAgIFxuICAgIC8vIE1hdGhNTCByZXByZXNlbnRhdGlvbi5cbiAgICB0b01hdGhNTCgpIHtcbiAgICAgICAgcmV0dXJuKFwiPGNuPlwiICsgdGhpcy50b1N0cmluZygpICsgXCI8L2NuPlwiKTtcbiAgICB9XG4gICAgXG4gICAgLy8gUmV0dXJuIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRlc3RlZCBlcXVpdmFsZW50IHN0cmluZ3MuXG4gICAgYWxsU3RyaW5nRXF1aXZzKCkge1xuICAgICAgICByZXR1cm4oW3RoaXMudG9TdHJpbmcoKV0pO1xuICAgIH1cbiAgICBcbiAgICAvLyBUZXN0IGlmIHJlcHJlc2VudHMgY29uc3RhbnQgdmFsdWUuXG4gICAgaXNDb25zdGFudCgpIHtcbiAgICAgICAgLypcbiAgICAgICAgVGhpcyBjb3VsZCBqdXN0IHVzZSBleHByZXNzaW9uLnByb3RvdHlwZS5jb25zdGFudCwgYnV0IHVzZSB0aGlzXG4gICAgICAgIGJlY2F1c2UgaXQgQUxXQVlTIGlzIHRydWUgZm9yIHNjYWxhcl9leHByIGFuZCBkb2VzIG5vdCBuZWVkIGEgY2hlY2tcbiAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuKHRydWUpO1xuICAgIH1cbiAgICBcbiAgICAvLyBDb21iaW5lIGNvbnN0YW50cyB3aGVyZSBwb3NzaWJsZVxuICAgIHNpbXBsaWZ5Q29uc3RhbnRzKCkge1xuICAgICAgICB2YXIgcmV0VmFsdWU7XG4gICAgICAgIGlmICghdGhpcy5idG0ub3B0aW9ucy5uZWdhdGl2ZU51bWJlcnMgJiYgdGhpcy5udW1iZXIucCA8IDApIHtcbiAgICAgICAgICAgIHZhciB0aGVOdW1iZXIgPSB0aGlzLm51bWJlci5tdWx0aXBseSgtMSk7XG4gICAgICAgICAgICByZXRWYWx1ZSA9IG5ldyB1bm9wX2V4cHIodGhpcy5idG0sICctJywgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCB0aGVOdW1iZXIpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldFZhbHVlID0gdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ocmV0VmFsdWUpO1xuICAgIH1cbiAgICBcbiAgICB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuKHRoaXMubnVtYmVyLnZhbHVlKCkpO1xuICAgIH1cblxuICAgIGV2YWx1YXRlKGJpbmRpbmdzKSB7XG4gICAgICAgIHJldHVybih0aGlzLnZhbHVlKCkpO1xuICAgIH1cbiAgICBcbiAgICBjb3B5KCkge1xuICAgICAgICByZXR1cm4obmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCB0aGlzLm51bWJlcikpO1xuICAgIH1cbiAgICBcbiAgICBjb21wb3NlKGJpbmRpbmdzKSB7XG4gICAgICAgIHJldHVybihuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIHRoaXMubnVtYmVyKSk7XG4gICAgfVxuICAgIFxuICAgIGRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCkge1xuICAgICAgICByZXR1cm4obmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAwKSk7XG4gICAgfVxuICAgIFxuICAgIC8qXG4gICAgICAgIFNlZSBleHByZXNzaW9ucy5wcm90b3R5cGUubWF0Y2ggZm9yIGV4cGxhbmF0aW9uLlxuICAgIFxuICAgICAgICBBIHNjYWxhciBtaWdodCBtYXRjaCBhIGNvbnN0YW50IGZvcm11bGEuXG4gICAgKi9cbiAgICBtYXRjaChleHByLCBiaW5kaW5ncykge1xuICAgICAgICB2YXIgcmV0VmFsdWUgPSBudWxsLFxuICAgICAgICAgICAgdGVzdEV4cHIgPSBleHByO1xuICAgIFxuICAgICAgICAvLyBTcGVjaWFsIG5hbWVkIGNvbnN0YW50cyBjYW4gbm90IG1hdGNoIGV4cHJlc3Npb25zLlxuICAgICAgICBpZiAoZXhwci5pc0NvbnN0YW50KCkgJiYgZXhwci50eXBlICE9IGV4cHJUeXBlLm51bWJlcikge1xuICAgICAgICAgICAgdmFyIHRlc3RFeHByID0gdGhpcy5idG0ucGFyc2UoZXhwci50b1N0cmluZygpLCBleHByLmNvbnRleHQpLnNpbXBsaWZ5Q29uc3RhbnRzKCk7XG4gICAgICAgICAgICBpZiAodGhpcy50b1N0cmluZygpID09PSB0ZXN0RXhwci50b1N0cmluZygpKSB7XG4gICAgICAgICAgICAgIHJldFZhbHVlID0gYmluZGluZ3M7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGVzdEV4cHIudHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAmJiB0aGlzLm51bWJlci5lcXVhbCh0ZXN0RXhwci5udW1iZXIpKSB7XG4gICAgICAgICAgICByZXRWYWx1ZSA9IGJpbmRpbmdzO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfSAgICBcbn1cblxuIiwiLyohXG4gKiBCVE0gSmF2YVNjcmlwdCBMaWJyYXJ5IHZAVkVSU0lPTlxuICogaHR0cHM6Ly9naXRodWIuY29tL2RicmlhbndhbHRvbi9CVE1cbiAqXG4gKiBDb3B5cmlnaHQgRC4gQnJpYW4gV2FsdG9uXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUKVxuICpcbiAqIERhdGU6IEBEQVRFXG4gKi9cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIERlZmluZSB0aGUgVW5hcnkgRXhwcmVzc2lvbiAtLSBkZWZpbmVkIGJ5IGFuIG9wZXJhdG9yIGFuZCBhbiBpbnB1dC5cbiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmltcG9ydCB7IGV4cHJlc3Npb24gfSBmcm9tIFwiLi9leHByZXNzaW9uLmpzXCJcbmltcG9ydCB7IHNjYWxhcl9leHByIH0gZnJvbSBcIi4vc2NhbGFyX2V4cHIuanNcIlxuaW1wb3J0IHsgYmlub3BfZXhwciB9IGZyb20gXCIuL2Jpbm9wX2V4cHIuanNcIlxuaW1wb3J0IHsgZXhwclR5cGUsIG9wUHJlYyB9IGZyb20gXCIuL0JUTV9yb290LmpzXCJcblxuZXhwb3J0IGNsYXNzIHVub3BfZXhwciBleHRlbmRzIGV4cHJlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKGJ0bSwgb3AsIGlucHV0KSB7XG4gICAgICAgIHN1cGVyKGJ0bSk7XG4gICAgICAgIHRoaXMudHlwZSA9IGV4cHJUeXBlLnVub3A7XG4gICAgICAgIHRoaXMub3AgPSBvcDtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIGlucHV0ID0gbmV3IGV4cHJlc3Npb24oKTtcbiAgICAgICAgdGhpcy5pbnB1dHMgPSBbaW5wdXRdO1xuICAgICAgICAgICAgaW5wdXQucGFyZW50ID0gdGhpcztcbiAgICAgICAgc3dpdGNoIChvcCkge1xuICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLm11bHRkaXY7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICB0aGlzLnByZWMgPSBvcFByZWMubXVsdGRpdjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgICAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5wb3dlcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJVbmtub3duIHVuYXJ5IG9wZXJhdG9yOiAnXCIrb3ArXCInLlwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICB2YXIgdGhlU3RyO1xuICAgICAgICB2YXIgb3BTdHI7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0c1swXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb3BTdHIgPSAnPyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcFN0ciA9IHRoaXMuaW5wdXRzWzBdLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCh0aGlzLmlucHV0c1swXS50eXBlID49IGV4cHJUeXBlLnVub3BcbiAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1swXS5wcmVjIDwgdGhpcy5wcmVjKVxuICAgICAgICAgICAgfHwgKHRoaXMuaW5wdXRzWzBdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgJiYgb3BTdHIuaW5kZXhPZignLycpID49IDBcbiAgICAgICAgICAgICAgICAmJiBvcFByZWMubXVsdGRpdiA8PSB0aGlzLnByZWMpXG4gICAgICAgICAgICApIFxuICAgICAgICB7XG4gICAgICAgICAgICB0aGVTdHIgPSB0aGlzLm9wICsgJygnICsgb3BTdHIgKyAnKSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGVTdHIgPSB0aGlzLm9wICsgb3BTdHI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4odGhlU3RyKTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgdGVzdGVkIGVxdWl2YWxlbnQgc3RyaW5ncy5cbiAgICBhbGxTdHJpbmdFcXVpdnMoKSB7XG4gICAgICAgIHZhciBhbGxJbnB1dHMgPSB0aGlzLmlucHV0c1swXS5hbGxTdHJpbmdFcXVpdnMoKTtcbiAgICAgICAgdmFyIHJldFZhbHVlID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSBpbiBhbGxJbnB1dHMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1swXS50eXBlID49IGV4cHJUeXBlLnVub3AgJiYgdGhpcy5pbnB1dHNbMF0ucHJlYyA8PSB0aGlzLnByZWMpIHtcbiAgICAgICAgICAgICAgICByZXRWYWx1ZVtpXSA9IHRoaXMub3AgKyAnKCcgKyBhbGxJbnB1dHNbaV0gKyAnKSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldFZhbHVlW2ldID0gdGhpcy5vcCArIGFsbElucHV0c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxuXG4gICAgdG9UZVgoc2hvd1NlbGVjdCkge1xuICAgICAgICB2YXIgdGhlU3RyO1xuICAgICAgICB2YXIgb3BTdHIsIHRoZU9wO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygc2hvd1NlbGVjdCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgc2hvd1NlbGVjdCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0c1swXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb3BTdHIgPSAnPyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcFN0ciA9IHRoaXMuaW5wdXRzWzBdLnRvVGVYKHNob3dTZWxlY3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhlT3AgPSB0aGlzLm9wO1xuICAgICAgICBpZiAodGhlT3AgPT0gJy8nKSB7XG4gICAgICAgICAgICB0aGVPcCA9ICdcXFxcZGl2ICc7XG4gICAgICAgICAgICBpZiAoc2hvd1NlbGVjdCAmJiB0aGlzLnNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHRoZVN0ciA9IFwie1xcXFxjb2xvcntyZWR9XCIgKyB0aGlzLm9wICsgXCJ9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnXFxcXGxlZnQoe1xcXFxjb2xvcntibHVlfScgKyBvcFN0ciArICd9XFxcXHJpZ2h0KSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoZVN0ciA9ICdcXFxcZnJhY3sxfXsnICsgb3BTdHIgKyAnfSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc2hvd1NlbGVjdCAmJiB0aGlzLnNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHRoZVN0ciA9IFwie1xcXFxjb2xvcntyZWR9XCIgKyB0aGlzLm9wICsgXCJ9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnXFxcXGxlZnQoe1xcXFxjb2xvcntibHVlfScgKyBvcFN0ciArICd9XFxcXHJpZ2h0KSc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW5wdXRzWzBdLnR5cGUgPj0gZXhwclR5cGUudW5vcCAmJiB0aGlzLmlucHV0c1swXS5wcmVjIDw9IHRoaXMucHJlY1xuICAgICAgICAgICAgICAgICYmICh0aGlzLmlucHV0c1swXS50eXBlICE9IGV4cHJUeXBlLnVub3AgfHwgdGhpcy5vcCAhPSAnLScgfHwgdGhpcy5pbnB1dHNbMF0ub3AgIT0gJy8nKSkge1xuICAgICAgICAgICAgICAgIHRoZVN0ciA9IHRoZU9wICsgJ1xcXFxsZWZ0KCcgKyBvcFN0ciArICdcXFxccmlnaHQpJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhlU3RyID0gdGhlT3AgKyBvcFN0cjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4odGhlU3RyKTtcbiAgICB9XG5cbiAgICB0b01hdGhNTCgpIHtcbiAgICAgICAgdmFyIHRoZVN0cjtcbiAgICAgICAgdmFyIG9wU3RyO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dHNbMF0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG9wU3RyID0gJz8nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3BTdHIgPSB0aGlzLmlucHV0c1swXS50b01hdGhNTCgpO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAodGhpcy5vcCkge1xuICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgdGhlU3RyID0gb3BTdHI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICB0aGVTdHIgPSBcIjxhcHBseT48bWludXMvPlwiICsgb3BTdHIgKyBcIjwvYXBwbHk+XCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICB0aGVTdHIgPSBcIjxhcHBseT48ZGl2aWRlLz48Y24+MTwvY24+XCIgKyBvcFN0ciArIFwiPC9hcHBseT5cIjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybih0aGVTdHIpO1xuICAgIH1cblxuICAgIG9wZXJhdGVUb1RlWCgpIHtcbiAgICAgICAgdmFyIG9wU3RyaW5nID0gdGhpcy5vcDtcblxuICAgICAgICBpZiAob3BTdHJpbmcgPT09ICcvJykge1xuICAgICAgICAgICAgb3BTdHJpbmcgPSAnXFxcXGRpdic7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ob3BTdHJpbmcpO1xuICAgIH1cblxuICAgIGV2YWx1YXRlKGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciBpbnB1dFZhbCA9IHRoaXMuaW5wdXRzWzBdLmV2YWx1YXRlKGJpbmRpbmdzKTtcblxuICAgICAgICB2YXIgcmV0VmFsO1xuICAgICAgICBpZiAoaW5wdXRWYWwgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4odW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgIHJldFZhbCA9IGlucHV0VmFsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gLTEqaW5wdXRWYWw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICAvLyBFdmVuIHdoZW4gZGl2aWRlIGJ5IHplcm8sIHdlIHdhbnQgdG8gdXNlIHRoaXMsIHNpbmNlIGluIHRoZSBleGNlcHRpb25cbiAgICAgICAgICAgICAgICAvLyB3ZSB3YW50IHRoZSB2YWx1ZSB0byBiZSBJbmZpbml0ZSBhbmQgbm90IHVuZGVmaW5lZC5cbiAgICAgICAgICAgICAgICByZXRWYWwgPSAxL2lucHV0VmFsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBhbGVydChcIlRoZSB1bmFyeSBvcGVyYXRvciAnXCIgKyB0aGlzLm9wICsgXCInIGlzIG5vdCBkZWZpbmVkLlwiKTtcbiAgICAgICAgICAgICAgICByZXRWYWwgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHJldFZhbCk7XG4gICAgfVxuXG4gICAgc2ltcGxpZnlDb25zdGFudHMoKSB7XG4gICAgICAgIHZhciByZXRWYWw7XG5cbiAgICAgICAgdGhpcy5pbnB1dHNbMF0gPSB0aGlzLmlucHV0c1swXS5zaW1wbGlmeUNvbnN0YW50cygpO1xuICAgICAgICB0aGlzLmlucHV0c1swXS5wYXJlbnQgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy5pbnB1dHNbMF0udHlwZSA9PSBleHByVHlwZS5udW1iZXIpIHtcbiAgICAgICAgICAgIHZhciB0aGVOdW1iZXIgPSB0aGlzLmlucHV0c1swXS5udW1iZXI7XG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMubmVnYXRpdmVOdW1iZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgdGhlTnVtYmVyLmFkZEludmVyc2UoKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgdGhlTnVtYmVyLm11bHRJbnZlcnNlKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldFZhbCA9IHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHJldFZhbCk7XG4gICAgfVxuXG4gICAgZmxhdHRlbigpIHtcbiAgICAgIHJldHVybihuZXcgdW5vcF9leHByKHRoaXMuYnRtLCB0aGlzLm9wLCB0aGlzLmlucHV0c1swXS5mbGF0dGVuKCkpKTtcbiAgICB9XG5cbiAgICBjb3B5KCkge1xuICAgICAgcmV0dXJuKG5ldyB1bm9wX2V4cHIodGhpcy5idG0sIHRoaXMub3AsIHRoaXMuaW5wdXRzWzBdLmNvcHkoKSkpO1xuICAgIH1cblxuICAgIGNvbXBvc2UoYmluZGluZ3MpIHtcbiAgICAgICAgcmV0dXJuKG5ldyB1bm9wX2V4cHIodGhpcy5idG0sIHRoaXMub3AsIHRoaXMuaW5wdXRzWzBdLmNvbXBvc2UoYmluZGluZ3MpKSk7XG4gICAgfVxuXG4gICAgZGVyaXZhdGl2ZShpdmFyLCB2YXJMaXN0KSB7XG4gICAgICAgIHZhciB0aGVEZXJpdjtcblxuICAgICAgICB2YXIgdUNvbnN0ID0gdGhpcy5pbnB1dHNbMF0uaXNDb25zdGFudCgpO1xuICAgICAgICBpZiAodUNvbnN0KSB7XG4gICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSB0aGlzLmlucHV0c1swXS5kZXJpdmF0aXZlKGl2YXIsIHZhckxpc3QpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgdW5vcF9leHByKHRoaXMuYnRtLCAnLScsIHRoaXMuaW5wdXRzWzBdLmRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlbm9tID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcqJywgdGhpcy5pbnB1dHNbMF0sIHRoaXMuaW5wdXRzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgdW5vcF9leHByKHRoaXMuYnRtLCAnLScsIG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnLycsIHRoaXMuaW5wdXRzWzBdLmRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCksIGRlbm9tKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIGRlcml2YXRpdmUgb2YgdGhlIHVuYXJ5IG9wZXJhdG9yICdcIiArIHRoaXMub3AgKyBcIicgaXMgbm90IGRlZmluZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHRoZURlcml2KTtcbiAgICB9XG5cbiAgICBtYXRjaChleHByLCBiaW5kaW5ncykge1xuICAgICAgICB2YXIgcmV0VmFsdWUgPSBudWxsO1xuXG4gICAgICAgIC8vIFNwZWNpYWwgbmFtZWQgY29uc3RhbnRzIGNhbiBub3QgbWF0Y2ggZXhwcmVzc2lvbnMuXG4gICAgICAgIGlmICh0aGlzLmlzQ29uc3RhbnQoKSAmJiBleHByLmlzQ29uc3RhbnQoKSkge1xuICAgICAgICAgICAgdmFyIG5ld0V4cHIgPSBleHByLnNpbXBsaWZ5Q29uc3RhbnRzKCksXG4gICAgICAgICAgICAgICAgbmV3VGhpcyA9IHRoaXMuc2ltcGxpZnlDb25zdGFudHMoKTtcblxuICAgICAgICAgICAgaWYgKG5ld0V4cHIudG9TdHJpbmcoKSA9PT0gbmV3VGhpcy50b1N0cmluZygpXG4gICAgICAgICAgICAgICAgfHwgbmV3RXhwci50eXBlID09IGV4cHJUeXBlLm51bWJlciAmJiBuZXdUaGlzLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICYmIG5ld1RoaXMubnVtYmVyLmVxdWFsKG5ld0V4cHIubnVtYmVyKSkge1xuICAgICAgICAgICAgICAgIHJldFZhbHVlID0gYmluZGluZ3M7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXRWYWx1ZSA9IGV4cHJlc3Npb24ucHJvdG90eXBlLm1hdGNoLmNhbGwodGhpcywgZXhwciwgYmluZGluZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKHJldFZhbHVlKTtcbiAgICB9XG59XG4iLCIvKiFcbiAqIEJUTSBKYXZhU2NyaXB0IExpYnJhcnkgdkBWRVJTSU9OXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGJyaWFud2FsdG9uL0JUTVxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogRGVmaW5lIHRoZSBWYXJpYWJsZSBFeHByZXNzaW9uIC0tIGEgdmFsdWUgZGVmaW5lZCBieSBhIG5hbWVcbiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5pbXBvcnQgeyBleHByZXNzaW9uIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi5qc1wiXG5pbXBvcnQgeyBzY2FsYXJfZXhwciB9IGZyb20gXCIuL3NjYWxhcl9leHByLmpzXCJcbmltcG9ydCB7IGV4cHJUeXBlLCBleHByVmFsdWUgfSBmcm9tIFwiLi9CVE1fcm9vdC5qc1wiXG5cbmV4cG9ydCBjbGFzcyB2YXJpYWJsZV9leHByIGV4dGVuZHMgZXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IoYnRtLCBuYW1lKSB7XG4gICAgICAgIHN1cGVyKGJ0bSk7XG4gICAgICAgIHRoaXMudHlwZSA9IGV4cHJUeXBlLnZhcmlhYmxlO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuXG4gICAgICAgIC8vIENvdW50IGhvdyBtYW55IGRlcml2YXRpdmVzLlxuICAgICAgICB2YXIgcHJpbWVQb3MgPSBuYW1lLmluZGV4T2YoXCInXCIpO1xuICAgICAgICB0aGlzLmRlcml2cyA9IDA7XG4gICAgICAgIGlmIChwcmltZVBvcyA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuZGVyaXZzID0gbmFtZS5zbGljZShwcmltZVBvcykubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pc0NvbnN0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNTcGVjaWFsID0gZmFsc2U7XG4gICAgICAgIHN3aXRjaCh0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2UnOlxuICAgICAgICAgICAgY2FzZSAncGknOlxuICAgICAgICAgICAgY2FzZSAnZG5lJzpcbiAgICAgICAgICAgIGNhc2UgJ2luZic6XG4gICAgICAgICAgICAgICAgdGhpcy5pc0NvbnN0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzU3BlY2lhbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b1N0cmluZyhlbGVtZW50T25seSkge1xuICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnRPbmx5ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBlbGVtZW50T25seSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybih0aGlzLm5hbWUpO1xuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBhcnJheSBjb250YWluaW5nIGFsbCB0ZXN0ZWQgZXF1aXZhbGVudCBzdHJpbmdzLlxuICAgIGFsbFN0cmluZ0VxdWl2cygpIHtcbiAgICAgICAgcmV0dXJuKFt0aGlzLnRvU3RyaW5nKCldKTtcbiAgICB9XG5cbiAgICB0b1RlWChzaG93U2VsZWN0KSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2hvd1NlbGVjdCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgc2hvd1NlbGVjdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdHIgPSB0aGlzLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2FscGhhJzpcbiAgICAgICAgICAgIGNhc2UgJ2JldGEnOlxuICAgICAgICAgICAgY2FzZSAnZ2FtbWEnOlxuICAgICAgICAgICAgY2FzZSAnZGVsdGEnOlxuICAgICAgICAgICAgY2FzZSAnZXBzaWxvbic6XG4gICAgICAgICAgICBjYXNlICd6ZXRhJzpcbiAgICAgICAgICAgIGNhc2UgJ2V0YSc6XG4gICAgICAgICAgICBjYXNlICd0aGV0YSc6XG4gICAgICAgICAgICBjYXNlICdrYXBwYSc6XG4gICAgICAgICAgICBjYXNlICdsYW1iZGEnOlxuICAgICAgICAgICAgY2FzZSAnbXUnOlxuICAgICAgICAgICAgY2FzZSAnbnUnOlxuICAgICAgICAgICAgY2FzZSAneGknOlxuICAgICAgICAgICAgY2FzZSAncGknOlxuICAgICAgICAgICAgY2FzZSAncmhvJzpcbiAgICAgICAgICAgIGNhc2UgJ3NpZ21hJzpcbiAgICAgICAgICAgIGNhc2UgJ3RhdSc6XG4gICAgICAgICAgICBjYXNlICd1cHNpbG9uJzpcbiAgICAgICAgICAgIGNhc2UgJ3BoaSc6XG4gICAgICAgICAgICBjYXNlICdjaGknOlxuICAgICAgICAgICAgY2FzZSAncHNpJzpcbiAgICAgICAgICAgIGNhc2UgJ29tZWdhJzpcbiAgICAgICAgICAgIGNhc2UgJ0dhbW1hJzpcbiAgICAgICAgICAgIGNhc2UgJ0RlbHRhJzpcbiAgICAgICAgICAgIGNhc2UgJ1RoZXRhJzpcbiAgICAgICAgICAgIGNhc2UgJ0xhbWJkYSc6XG4gICAgICAgICAgICBjYXNlICdYaSc6XG4gICAgICAgICAgICBjYXNlICdQaSc6XG4gICAgICAgICAgICBjYXNlICdTaWdtYSc6XG4gICAgICAgICAgICBjYXNlICdVcHNpbG9uJzpcbiAgICAgICAgICAgIGNhc2UgJ1BoaSc6XG4gICAgICAgICAgICBjYXNlICdQc2knOlxuICAgICAgICAgICAgY2FzZSAnT21lZ2EnOlxuICAgICAgICAgICAgICAgIHN0ciA9ICdcXFxcJyArIHRoaXMubmFtZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2luZic6XG4gICAgICAgICAgICAgICAgc3RyID0gJ1xcXFxpbmZ0eSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU3BlY2lhbCkge1xuICAgICAgICAgICAgICAgICAgICBzdHIgPSAnXFxcXG1hdGhybXsnICsgdGhpcy5uYW1lICsgJ30nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5uYW1lLmluZGV4T2YoXCJpbnB1dFwiKT09MCkge1xuICAgICAgICAgICAgc3RyID0gXCJcXFxcYm94ZWR7XFxcXGRvdHM/XntcIiArIHRoaXMubmFtZS5zbGljZSg1KSArIFwifX1cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaG93U2VsZWN0ICYmIHRoaXMuc2VsZWN0KSB7XG4gICAgICAgICAgICBzdHIgPSBcIntcXFxcY29sb3J7cmVkfVwiICsgc3RyICsgXCJ9XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHN0cik7XG4gICAgfVxuXG4gICAgZGVwZW5kZW5jaWVzKGZvcmNlZCkge1xuICAgICAgICB2YXIgZGVwQXJyYXkgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgaWYgKGZvcmNlZCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxmb3JjZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkZXBBcnJheS5wdXNoKGZvcmNlZFtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmlzQ29uc3QgJiYgZGVwQXJyYXkuaW5kZXhPZih0aGlzLm5hbWUpIDwgMCkge1xuICAgICAgICAgICAgZGVwQXJyYXkucHVzaCh0aGlzLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihkZXBBcnJheSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgICAgQSB2YXJpYWJsZSBpcyBjb25zdGFudCBvbmx5IGlmIHJlZmVycmluZyB0byBtYXRoZW1hdGljYWwgY29uc3RhbnRzIChlLCBwaSlcbiAgICAqL1xuICAgIGlzQ29uc3RhbnQoKSB7XG4gICAgICAgIHJldHVybih0aGlzLmlzQ29uc3QpO1xuICAgIH1cblxuICAgIGV2YWx1YXRlKGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciByZXRWYWw7XG5cbiAgICAgICAgaWYgKGJpbmRpbmdzW3RoaXMubmFtZV0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzd2l0Y2godGhpcy5uYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnZSc6XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGguRTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAncGknOlxuICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLlBJO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdpbmYnOlxuICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBJbmZpbml0eTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnZG5lJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTnVtYmVyLk5hTjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJWYXJpYWJsZSBldmFsdWF0ZWQgd2l0aG91dCBiaW5kaW5nLlwiKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldFZhbCA9IGJpbmRpbmdzW3RoaXMubmFtZV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ocmV0VmFsKTtcbiAgICB9XG5cbiAgICBjb3B5KCkge1xuICAgICAgICByZXR1cm4obmV3IHZhcmlhYmxlX2V4cHIodGhpcy5idG0sIHRoaXMubmFtZSkpO1xuICAgIH1cblxuICAgIGNvbXBvc2UoYmluZGluZ3MpIHtcbiAgICAgICAgdmFyIHJldFZhbDtcblxuICAgICAgICBpZiAoYmluZGluZ3NbdGhpcy5uYW1lXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldFZhbCA9IG5ldyB2YXJpYWJsZV9leHByKHRoaXMuYnRtLCB0aGlzLm5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBiaW5kaW5nc1t0aGlzLm5hbWVdID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICByZXRWYWwgPSB0aGlzLmJ0bS5wYXJzZShiaW5kaW5nc1t0aGlzLm5hbWVdLCBcImZvcm11bGFcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldFZhbCA9IGJpbmRpbmdzW3RoaXMubmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ocmV0VmFsKTtcbiAgICB9XG5cbiAgICBkZXJpdmF0aXZlKGl2YXIsIHZhckxpc3QpIHtcbiAgICAgICAgdmFyIHJldFZhbDtcbiAgICAgICAgdmFyIGl2YXJOYW1lID0gKHR5cGVvZiBpdmFyID09ICdzdHJpbmcnKSA/IGl2YXIgOiBpdmFyLm5hbWU7XG5cbiAgICAgICAgaWYgKHRoaXMubmFtZSA9PT0gaXZhck5hbWUpIHtcbiAgICAgICAgICAgIHJldFZhbCA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMSk7XG5cbiAgICAgICAgLy8gSWYgZWl0aGVyIGEgY29uc3RhbnQgb3IgYW5vdGhlciBpbmRlcGVuZGVudCB2YXJpYWJsZSwgZGVyaXY9MFxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNDb25zdCB8fCB2YXJMaXN0ICYmIHZhckxpc3RbdGhpcy5uYW1lXSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldFZhbCA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMCk7XG5cbiAgICAgICAgLy8gUHJlc3VtaW5nIG90aGVyIHZhcmlhYmxlcyBhcmUgZGVwZW5kZW50IHZhcmlhYmxlcy5cbiAgICAgICAgfSBlbHNlICB7XG4gICAgICAgICAgICByZXRWYWwgPSBuZXcgdmFyaWFibGVfZXhwcih0aGlzLmJ0bSwgdGhpcy5uYW1lK1wiJ1wiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ocmV0VmFsKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAgICBTZWUgZXhwcmVzc2lvbnMucHJvdG90eXBlLm1hdGNoIGZvciBleHBsYW5hdGlvbi5cblxuICAgICAgICBBIHZhcmlhYmxlIGNhbiBtYXRjaCBhbnkgZXhwcmVzc2lvbi4gQnV0IHdlIG5lZWQgdG8gY2hlY2tcbiAgICAgICAgaWYgdGhlIHZhcmlhYmxlIGhhcyBhbHJlYWR5IG1hdGNoZWQgYW4gZXhwcmVzc2lvbi4gSWYgc28sXG4gICAgICAgIGl0IG11c3QgYmUgdGhlIHNhbWUgYWdhaW4uXG4gICAgKi9cbiAgICBtYXRjaChleHByLCBiaW5kaW5ncykge1xuICAgICAgICB2YXIgcmV0VmFsdWUgPSBudWxsO1xuXG4gICAgICAgIC8vIFNwZWNpYWwgbmFtZWQgY29uc3RhbnRzIGNhbiBub3QgbWF0Y2ggZXhwcmVzc2lvbnMuXG4gICAgICAgIGlmICh0aGlzLmlzQ29uc3QpIHtcbiAgICAgICAgICAgIGlmIChleHByLnRvU3RyaW5nKCkgPT09IHRoaXMubmFtZSkge1xuICAgICAgICAgICAgICAgIHJldFZhbHVlID0gYmluZGluZ3M7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgbmV2ZXIgcHJldmlvdXNseSBhc3NpZ25lZCwgY2FuIG1hdGNoIGFueSBleHByZXNzaW9uLlxuICAgICAgICB9IGVsc2UgaWYgKGJpbmRpbmdzICE9IG51bGwgJiYgYmluZGluZ3NbdGhpcy5uYW1lXSA9PSB1bmRlZmluZWQgJiYgZXhwci52YWx1ZVR5cGUgPT0gZXhwclZhbHVlLm51bWVyaWMpIHtcbiAgICAgICAgICAgIHJldFZhbHVlID0gYmluZGluZ3M7XG4gICAgICAgICAgICByZXRWYWx1ZVt0aGlzLm5hbWVdID0gZXhwci50b1N0cmluZygpO1xuICAgICAgICB9IGVsc2UgaWYgKGJpbmRpbmdzICE9IG51bGwgJiYgYmluZGluZ3NbdGhpcy5uYW1lXSA9PSBleHByLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgICAgIHJldFZhbHVlID0gYmluZGluZ3M7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ocmV0VmFsdWUpO1xuICAgIH1cbn1cblxuICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICogRGVmaW5lIHRoZSBJbmRleCBFeHByZXNzaW9uIC0tIGEgcmVmZXJlbmNlIGludG8gYSBsaXN0XG4gICAgKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuZXhwb3J0IGNsYXNzIGluZGV4X2V4cHIge1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKGJ0bSwgbmFtZSwgaW5kZXgpIHtcbiAgICAgICAgdGhpcy5idG0gPSBidG07XG4gICAgICAgIGlmICghKGJ0bSBpbnN0YW5jZW9mIEJUTSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidmFyaWFibGVfZXhwciBjb25zdHJ1Y3RlZCB3aXRoIGludmFsaWQgZW52aXJvbm1lbnRcIilcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnR5cGUgPSBleHByVHlwZS52YXJpYWJsZTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5zZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ib3VuZE5hbWUgPSBcIltdXCIrbmFtZTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICAgIHZhciBkZXBBcnJheSA9IGluZGV4LmRlcGVuZGVuY2llcygpO1xuICAgICAgICBpZiAoZGVwQXJyYXkubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgYWxlcnQoXCJBbiBhcnJheSByZWZlcmVuY2UgY2FuIG9ubHkgaGF2ZSBvbmUgaW5kZXggdmFyaWFibGUuXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5rID0gZGVwQXJyYXlbMF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b1N0cmluZyhlbGVtZW50T25seSkge1xuICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnRPbmx5ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBlbGVtZW50T25seSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybih0aGlzLm5hbWUgKyBcIltcIiArIHRoaXMuaW5kZXgudG9TdHJpbmcoKSArIFwiXVwiKTtcbiAgICB9XG5cbiAgICB0b1RlWChzaG93U2VsZWN0KSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2hvd1NlbGVjdCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgc2hvd1NlbGVjdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHdvcmQgPSB0aGlzLm5hbWUgKyBcIl97XCIgKyB0aGlzLmluZGV4LnRvU3RyaW5nKCkgKyBcIn1cIjtcbiAgICAgICAgaWYgKHNob3dTZWxlY3QgJiYgdGhpcy5zZWxlY3QpIHtcbiAgICAgICAgICAgIHdvcmQgPSBcIntcXFxcY29sb3J7cmVkfVwiICsgd29yZCArIFwifVwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybih3b3JkKTtcbiAgICB9XG5cbiAgICB0b01hdGhNTCgpIHtcbiAgICAgICAgcmV0dXJuKFwiPGFwcGx5PjxzZWxlY3Rvci8+PGNpIHR5cGU9XFxcInZlY3RvclxcXCI+XCIgKyB0aGlzLm5hbWUgKyBcIjwvY2k+XCIgKyB0aGlzLmluZGV4LnRvU3RyaW5nKCkgKyBcIjwvYXBwbHk+XCIpO1xuICAgIH1cblxuICAgIGRlcGVuZGVuY2llcyhmb3JjZWQpIHtcbiAgICAgICAgdmFyIGRlcEFycmF5ID0gbmV3IEFycmF5KCk7XG4gICAgICAgIGlmIChmb3JjZWQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8Zm9yY2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGVwQXJyYXkucHVzaChmb3JjZWRbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCh0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgZGVwQXJyYXkucHVzaChcInJvd1wiKTtcbiAgICAgICAgICAgICAgICBkZXBBcnJheS5wdXNoKHRoaXMuYm91bmROYW1lKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4oZGVwQXJyYXkpO1xuICAgIH1cblxuICAgIGV2YWx1YXRlKGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciByZXRWYWw7XG5cbiAgICAgICAgaWYgKGJpbmRpbmdzW3RoaXMuYm91bmROYW1lXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHN3aXRjaCh0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRtcEJpbmQgPSB7fTtcbiAgICAgICAgICAgIGlmICh0aGlzLmsgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdG1wQmluZFt0aGlzLmtdID0gYmluZGluZ3NbXCJyb3dcIl07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaSA9IHRoaXMuaW5kZXguZXZhbHVhdGUodG1wQmluZCktMTtcbiAgICAgICAgICAgIGlmIChpID49IDAgJiYgaTxiaW5kaW5nc1t0aGlzLmJvdW5kTmFtZV0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gYmluZGluZ3NbdGhpcy5ib3VuZE5hbWVdW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKHJldFZhbCk7XG4gICAgfVxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==