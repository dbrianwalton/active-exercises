"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["BTM_src_BTM_root_js"],{

/***/ 38781:
/*!******************************!*\
  !*** ../BTM/src/BTM_root.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BTM": () => (/* binding */ BTM),
/* harmony export */   "exprType": () => (/* binding */ exprType),
/* harmony export */   "exprValue": () => (/* binding */ exprValue),
/* harmony export */   "opPrec": () => (/* binding */ opPrec),
/* harmony export */   "toTeX": () => (/* binding */ toTeX)
/* harmony export */ });
/* harmony import */ var _reductions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reductions.js */ 56985);
/* harmony import */ var _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scalar_expr.js */ 5447);
/* harmony import */ var _variable_expr_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./variable_expr.js */ 15260);
/* harmony import */ var _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./unop_expr.js */ 86946);
/* harmony import */ var _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./binop_expr.js */ 32525);
/* harmony import */ var _multiop_expr_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./multiop_expr.js */ 51067);
/* harmony import */ var _function_expr_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./function_expr.js */ 57019);
/* harmony import */ var _deriv_expr_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./deriv_expr.js */ 8813);
/* harmony import */ var _random_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./random.js */ 63529);
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./expression.js */ 70430);
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

    toString() {
        return "stringified BTM environment object";
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
                let Nvals = Math.floor((max-min) / by)+1;
                do {
                    rndVal = min + by * this.rng.randInt(0,Nvals-1);
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
                    let Nvals = Math.floor((max-min) / by)+1;
                    do {
                        newParam = min + by * this.rng.randInt(0,Nvals-1);
                    } while (options.nonzero && Math.abs(newParam) < this.options.absTol);
                    break;
            }
        } else if (options.mode == 'calculate') {
            newParam = this.parse(options.formula, "formula").evaluate(this.data.params);
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

/***/ 32525:
/*!********************************!*\
  !*** ../BTM/src/binop_expr.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "binop_expr": () => (/* binding */ binop_expr)
/* harmony export */ });
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BTM_root.js */ 38781);
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./expression.js */ 70430);
/* harmony import */ var _scalar_expr_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scalar_expr.js */ 5447);
/* harmony import */ var _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./unop_expr.js */ 86946);
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

/***/ 8813:
/*!********************************!*\
  !*** ../BTM/src/deriv_expr.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "deriv_expr": () => (/* binding */ deriv_expr)
/* harmony export */ });
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expression.js */ 70430);
/* harmony import */ var _variable_expr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./variable_expr.js */ 15260);
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BTM_root.js */ 38781);
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

/***/ 70430:
/*!********************************!*\
  !*** ../BTM/src/expression.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MathObject": () => (/* binding */ MathObject),
/* harmony export */   "expression": () => (/* binding */ expression)
/* harmony export */ });
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BTM_root.js */ 38781);
/* harmony import */ var _reductions_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reductions.js */ 56985);
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

/***/ 57019:
/*!***********************************!*\
  !*** ../BTM/src/function_expr.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "function_expr": () => (/* binding */ function_expr)
/* harmony export */ });
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expression.js */ 70430);
/* harmony import */ var _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scalar_expr.js */ 5447);
/* harmony import */ var _variable_expr_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./variable_expr.js */ 15260);
/* harmony import */ var _unop_expr_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./unop_expr.js */ 86946);
/* harmony import */ var _binop_expr_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./binop_expr.js */ 32525);
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./BTM_root.js */ 38781);
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

/***/ 51067:
/*!**********************************!*\
  !*** ../BTM/src/multiop_expr.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "multiop_expr": () => (/* binding */ multiop_expr)
/* harmony export */ });
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expression.js */ 70430);
/* harmony import */ var _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scalar_expr.js */ 5447);
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BTM_root.js */ 38781);
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

/***/ 63529:
/*!****************************!*\
  !*** ../BTM/src/random.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RNG": () => (/* binding */ RNG)
/* harmony export */ });
/* harmony import */ var _rational_number_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rational_number.js */ 20715);
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

/***/ 20715:
/*!*************************************!*\
  !*** ../BTM/src/rational_number.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "findGCD": () => (/* binding */ findGCD),
/* harmony export */   "rational_number": () => (/* binding */ rational_number)
/* harmony export */ });
/* harmony import */ var _real_number_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./real_number.js */ 35215);
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

/***/ 35215:
/*!*********************************!*\
  !*** ../BTM/src/real_number.js ***!
  \*********************************/
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

/***/ 56985:
/*!********************************!*\
  !*** ../BTM/src/reductions.js ***!
  \********************************/
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
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BTM_root.js */ 38781);
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

/***/ 5447:
/*!*********************************!*\
  !*** ../BTM/src/scalar_expr.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "scalar_expr": () => (/* binding */ scalar_expr)
/* harmony export */ });
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expression.js */ 70430);
/* harmony import */ var _real_number_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./real_number.js */ 35215);
/* harmony import */ var _rational_number_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./rational_number.js */ 20715);
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./BTM_root.js */ 38781);
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

/***/ 86946:
/*!*******************************!*\
  !*** ../BTM/src/unop_expr.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "unop_expr": () => (/* binding */ unop_expr)
/* harmony export */ });
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expression.js */ 70430);
/* harmony import */ var _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scalar_expr.js */ 5447);
/* harmony import */ var _binop_expr_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./binop_expr.js */ 32525);
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./BTM_root.js */ 38781);
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

/***/ 15260:
/*!***********************************!*\
  !*** ../BTM/src/variable_expr.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "index_expr": () => (/* binding */ index_expr),
/* harmony export */   "variable_expr": () => (/* binding */ variable_expr)
/* harmony export */ });
/* harmony import */ var _expression_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expression.js */ 70430);
/* harmony import */ var _scalar_expr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scalar_expr.js */ 5447);
/* harmony import */ var _BTM_root_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BTM_root.js */ 38781);
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
            if (typeof bindings[this.name].value === 'function') {
                retVal = bindings[this.name].value();
            } else {
                retVal = bindings[this.name];
            }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLHdEQUFXO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjs7QUFFcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBLFFBQVEsUUFBUTtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL3lCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVnRTtBQUNwQjtBQUNFO0FBQ0o7O0FBRW5DLHlCQUF5QixzREFBVTtBQUMxQztBQUNBO0FBQ0Esb0JBQW9CLHdEQUFjO0FBQ2xDO0FBQ0E7QUFDQSx5QkFBeUIsc0RBQVU7QUFDbkM7QUFDQSx5QkFBeUIsc0RBQVU7QUFDbkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qix1REFBYTtBQUN6QztBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsd0RBQWM7QUFDMUM7QUFDQTtBQUNBLDRCQUE0QixzREFBWTtBQUN4QztBQUNBO0FBQ0EsNEJBQTRCLHFEQUFXO0FBQ3ZDLGlDQUFpQyx3REFBYztBQUMvQztBQUNBO0FBQ0EsNEJBQTRCLHFEQUFXO0FBQ3ZDLGlDQUFpQyx3REFBYztBQUMvQztBQUNBO0FBQ0EsNEJBQTRCLHNEQUFZO0FBQ3hDLGlDQUFpQyx3REFBYztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0Esd0NBQXdDLHVEQUFhO0FBQ3JEO0FBQ0EsMkNBQTJDLHlEQUFlO0FBQzFEO0FBQ0EsdUJBQXVCLHdEQUFjO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSx3Q0FBd0MsdURBQWE7QUFDckQ7QUFDQSwyQ0FBMkMseURBQWU7QUFDMUQ7QUFDQSx1QkFBdUIsd0RBQWM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLHVEQUFhO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyx1REFBYTtBQUN4RDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSwrQ0FBK0MsdURBQWE7QUFDNUQ7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLHVEQUFhO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxJQUFJO0FBQ3pDO0FBQ0E7QUFDQSxxQ0FBcUMsSUFBSTtBQUN6QztBQUNBO0FBQ0EscUNBQXFDLEtBQUs7QUFDMUM7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsaUVBQWlFLHlEQUFlO0FBQ2hGO0FBQ0Esc0JBQXNCLGtEQUFrRCx3REFBYztBQUN0Riw0RkFBNEYseURBQWU7QUFDM0c7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsSUFBSTtBQUN6QztBQUNBO0FBQ0EscUNBQXFDLElBQUk7QUFDekM7QUFDQTtBQUNBLHFDQUFxQyxLQUFLO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLGdCQUFnQixlQUFlO0FBQzVELFVBQVU7QUFDVix5REFBeUQsc0RBQVk7QUFDckU7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBLGdDQUFnQyxlQUFlO0FBQy9DLFVBQVU7QUFDVjs7QUFFQTtBQUNBLDRCQUE0QixRQUFRLEtBQUs7QUFDekMsNEJBQTRCO0FBQzVCLDJCQUEyQixRQUFRLElBQUk7QUFDdkMsMkJBQTJCO0FBQzNCO0FBQ0EseURBQXlELHVEQUFhO0FBQ3RFO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCx1REFBYTtBQUN0RTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixRQUFRLElBQUksUUFBUSxnQkFBZ0I7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLElBQUk7QUFDeEM7QUFDQTtBQUNBLG9DQUFvQyxJQUFJO0FBQ3hDO0FBQ0E7QUFDQSxvQ0FBb0MsS0FBSztBQUN6QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsd0RBQVc7QUFDekMsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyx5REFBZTtBQUNuRCwyQ0FBMkMsdURBQWEscUNBQXFDLHlEQUFlO0FBQzVHO0FBQ0Esb0NBQW9DLHlEQUFlO0FBQ25ELDJDQUEyQyx1REFBYSxxQ0FBcUMseURBQWU7QUFDNUc7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLHlEQUFlO0FBQ3REO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1Qyx5REFBZTtBQUN0RDtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLG9EQUFTLG9CQUFvQix3REFBVztBQUN6RSxrQkFBa0I7QUFDbEIsaUNBQWlDLHdEQUFXO0FBQzVDO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLHlEQUFlO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELHlEQUFlO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyx5REFBZTtBQUM5RDtBQUNBLHFDQUFxQyxvREFBUztBQUM5QztBQUNBO0FBQ0Esb0RBQW9ELHlEQUFlO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyx5REFBZTtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRCx5REFBZTtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MseURBQWU7QUFDOUQ7QUFDQSxxQ0FBcUMsb0RBQVM7QUFDOUM7QUFDQTtBQUNBLG9EQUFvRCx5REFBZTtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MseURBQWU7QUFDOUQ7QUFDQSxxQ0FBcUMsd0RBQVc7QUFDaEQ7QUFDQTtBQUNBLG9EQUFvRCx5REFBZTtBQUNuRTtBQUNBLHFDQUFxQyx3REFBVztBQUNoRDtBQUNBO0FBQ0Esb0RBQW9ELHlEQUFlO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsMERBQWdCLGdCQUFnQix3REFBYztBQUMvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBLGlDQUFpQywwREFBZ0IsZ0JBQWdCLHdEQUFjO0FBQy9FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBLHlDQUF5QywwREFBZ0IsZ0JBQWdCLHdEQUFjO0FBQ3ZGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELG9EQUFTO0FBQ3pEO0FBQ0EsMEJBQTBCO0FBQzFCLDRDQUE0QyxvREFBUztBQUNyRDtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLDBEQUFnQixnQkFBZ0Isd0RBQWM7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQSxpQ0FBaUMsMERBQWdCLGdCQUFnQix3REFBYztBQUMvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQSx5Q0FBeUMsMERBQWdCLGdCQUFnQix3REFBYztBQUN2RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxvREFBUztBQUN6RDtBQUNBLDBCQUEwQjtBQUMxQiw0Q0FBNEMsb0RBQVM7QUFDckQ7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF3Qix5REFBZSxnQkFBZ0IseURBQWU7QUFDdEU7QUFDQTtBQUNBLGlDQUFpQyx3REFBVztBQUM1QztBQUNBO0FBQ0EsaUNBQWlDLHdEQUFXO0FBQzVDO0FBQ0E7QUFDQSxpQ0FBaUMsd0RBQVc7QUFDNUM7QUFDQTtBQUNBLGlDQUFpQyx3REFBVztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMkJBQTJCLHdEQUFXO0FBQ3RDLFVBQVU7QUFDVjs7QUFFQTtBQUNBLDJCQUEyQix3REFBVztBQUN0QyxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLHdEQUFXO0FBQ3RDLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0Qix3Q0FBd0Msb0RBQVM7QUFDakQsc0ZBQXNGLHdEQUFXO0FBQ2pHO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBLHNGQUFzRix3REFBVztBQUNqRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEIsdUZBQXVGLHdEQUFXO0FBQ2xHO0FBQ0EsbURBQW1ELDJEQUFpQjtBQUNwRTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0Qix1Q0FBdUMsd0RBQVc7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUU0QztBQUNNO0FBQ1Y7O0FBRWpDLHlCQUF5QixzREFBVTtBQUMxQztBQUNBO0FBQ0Esb0JBQW9CLDJEQUFpQjtBQUNyQztBQUNBO0FBQ0EsMEJBQTBCLHNEQUFVO0FBQ3BDO0FBQ0EsMkJBQTJCLDREQUFhO0FBQ3hDLFVBQVU7QUFDViwyQkFBMkIsNERBQWE7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrREFBa0QsMkRBQWlCO0FBQ25FO0FBQ0E7QUFDQSx5Q0FBeUMsa0JBQWtCLGFBQWEsVUFBVTtBQUNsRixnREFBZ0Q7QUFDaEQsY0FBYztBQUNkLGlDQUFpQyxpQkFBaUIsWUFBWTtBQUM5RDtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0Esd0NBQXdDLEdBQUcsYUFBYSxVQUFVO0FBQ2xFLGdEQUFnRDtBQUNoRCxjQUFjO0FBQ2QsZ0NBQWdDLEdBQUcsWUFBWTtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUU4QztBQUNFOztBQUV6QztBQUNQO0FBQ0E7QUFDQSw2QkFBNkIsNkNBQUc7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5Qix5REFBZTtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFTztBQUNQO0FBQ0EsNkJBQTZCLDZDQUFHO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QiwyREFBaUI7QUFDMUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDBCQUEwQixpQkFBaUI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxrQkFBa0Isa0JBQWtCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixrQkFBa0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isd0JBQXdCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixLQUFLO0FBQy9CO0FBQ0E7QUFDQTs7QUFFQTtBQUNB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLDhCQUE4QjtBQUM1RDtBQUNBLHFCQUFxQixRQUFRLElBQUksYUFBYTtBQUM5QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixpQkFBaUI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uLi9CVE0vc3JjL0JUTV9yb290LmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi4vQlRNL3NyYy9iaW5vcF9leHByLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi4vQlRNL3NyYy9kZXJpdl9leHByLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi4vQlRNL3NyYy9leHByZXNzaW9uLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi4vQlRNL3NyYy9mdW5jdGlvbl9leHByLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi4vQlRNL3NyYy9tdWx0aW9wX2V4cHIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uLi9CVE0vc3JjL3JhbmRvbS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4uL0JUTS9zcmMvcmF0aW9uYWxfbnVtYmVyLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi4vQlRNL3NyYy9yZWFsX251bWJlci5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4uL0JUTS9zcmMvcmVkdWN0aW9ucy5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4uL0JUTS9zcmMvc2NhbGFyX2V4cHIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uLi9CVE0vc3JjL3Vub3BfZXhwci5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4uL0JUTS9zcmMvdmFyaWFibGVfZXhwci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEJUTSBKYXZhU2NyaXB0IExpYnJhcnkgdkBWRVJTSU9OXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGJyaWFud2FsdG9uL0JUTVxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKlxuKiogRXZhbHVhdGluZyBleHByZXNzaW9ucyBvY2N1cnMgaW4gdGhlIGNvbnRleHQgb2YgYSBCVE0gZW52aXJvbm1lbnQuXG4qKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmltcG9ydCB7IGRlZmF1bHRSZWR1Y3Rpb25zLCBkZWZhdWx0U3VtUmVkdWN0aW9ucywgZGVmYXVsdFByb2R1Y3RSZWR1Y3Rpb25zLCBkaXNhYmxlUnVsZSwgbmV3UnVsZSwgZmluZE1hdGNoUnVsZXMgfSBmcm9tIFwiLi9yZWR1Y3Rpb25zLmpzXCJcbmltcG9ydCB7IHNjYWxhcl9leHByIH0gZnJvbSBcIi4vc2NhbGFyX2V4cHIuanNcIjtcbmltcG9ydCB7IHZhcmlhYmxlX2V4cHIsIGluZGV4X2V4cHIgfSBmcm9tIFwiLi92YXJpYWJsZV9leHByLmpzXCI7XG5pbXBvcnQgeyB1bm9wX2V4cHIgfSBmcm9tIFwiLi91bm9wX2V4cHIuanNcIjtcbmltcG9ydCB7IGJpbm9wX2V4cHIgfSBmcm9tIFwiLi9iaW5vcF9leHByLmpzXCI7XG5pbXBvcnQgeyBtdWx0aW9wX2V4cHIgfSBmcm9tIFwiLi9tdWx0aW9wX2V4cHIuanNcIjtcbmltcG9ydCB7IGZ1bmN0aW9uX2V4cHIgfSBmcm9tIFwiLi9mdW5jdGlvbl9leHByLmpzXCI7XG5pbXBvcnQgeyBkZXJpdl9leHByIH0gZnJvbSBcIi4vZGVyaXZfZXhwci5qc1wiO1xuaW1wb3J0IHsgUk5HIH0gZnJvbSBcIi4vcmFuZG9tLmpzXCJcbmltcG9ydCB7IGV4cHJlc3Npb24gfSBmcm9tIFwiLi9leHByZXNzaW9uLmpzXCI7XG5cbmV4cG9ydCBjb25zdCBvcFByZWMgPSB7XG4gICAgZGlzajogMCxcbiAgICBjb25qOiAxLFxuICAgIGVxdWFsOiAyLFxuICAgIGFkZHN1YjogMyxcbiAgICBtdWx0ZGl2OiA0LFxuICAgIHBvd2VyOiA1LFxuICAgIGZjbjogNixcbiAgICBmb3A6IDdcbn07XG5cbmV4cG9ydCBjb25zdCBleHByVHlwZSA9IHtcbiAgICBudW1iZXI6IDAsXG4gICAgdmFyaWFibGU6IDEsXG4gICAgZmNuOiAyLFxuICAgIHVub3A6IDMsXG4gICAgYmlub3A6IDQsXG4gICAgbXVsdGlvcDogNSxcbiAgICBvcGVyYXRvcjogNixcbiAgICBhcnJheTogNyxcbiAgICBtYXRyaXg6IDhcbn07XG5cbmV4cG9ydCBjb25zdCBleHByVmFsdWUgPSB7IHVuZGVmOiAtMSwgYm9vbCA6IDAsIG51bWVyaWMgOiAxIH07XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1RlWChleHByKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBleHByLnRvVGVYID09PSBcImZ1bmN0aW9uXCIgPyBleHByLnRvVGVYKCkgOiBleHByO1xufVxuXG5leHBvcnQgY2xhc3MgQlRNIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncykge1xuICAgICAgICBpZiAoc2V0dGluZ3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0dGluZ3MgPSB7fTtcbiAgICAgICAgICAgIHNldHRpbmdzLnNlZWQgPSAnMTIzNCc7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRWFjaCBpbnN0YW5jZSBvZiBCVE0gZW52aXJvbm1lbnQgbmVlZHMgYmluZGluZ3MgYWNyb3NzIGFsbCBleHByZXNzaW9ucy5cbiAgICAgICAgdGhpcy5yYW5kb21CaW5kaW5ncyA9IHt9O1xuICAgICAgICB0aGlzLmJpbmRpbmdzID0ge307XG4gICAgICAgIHRoaXMuZGF0YSA9IHt9O1xuICAgICAgICB0aGlzLmRhdGEuYWxsVmFsdWVzID0ge307XG4gICAgICAgIHRoaXMuZGF0YS5wYXJhbXMgPSB7fTtcbiAgICAgICAgdGhpcy5kYXRhLnZhcmlhYmxlcyA9IHt9O1xuICAgICAgICB0aGlzLmRhdGEuZXhwcmVzc2lvbnMgPSB7fTtcbiAgICAgICAgdGhpcy5vcFByZWMgPSBvcFByZWM7XG4gICAgICAgIHRoaXMuZXhwclR5cGUgPSBleHByVHlwZTtcbiAgICAgICAgdGhpcy5leHByVmFsdWUgPSBleHByVmFsdWU7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG5lZ2F0aXZlTnVtYmVyczogdHJ1ZSxcbiAgICAgICAgICAgIGFic1RvbDogMWUtOCxcbiAgICAgICAgICAgIHJlbFRvbDogMWUtNCxcbiAgICAgICAgICAgIHVzZVJlbEVycjogdHJ1ZSxcbiAgICAgICAgICAgIGRvRmxhdHRlbjogZmFsc2UgXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0UmVkdWN0aW9uUnVsZXMoKTtcbiAgICAgICAgdGhpcy5tdWx0aW9wX2V4cHIgPSBtdWx0aW9wX2V4cHI7XG4gICAgICAgIHRoaXMuYmlub3BfZXhwciA9IGJpbm9wX2V4cHI7XG5cbiAgICAgICAgLy8gR2VuZXJhdGUgYSByYW5kb20gZ2VuZXJhdG9yLiBXZSBtaWdodCBiZSBwYXNzZWQgZWl0aGVyIGEgcHJlLXNlZWRlZCBgcmFuZGAgZnVuY3Rpb24gb3IgYSBzZWVkIGZvciBvdXIgb3duLlxuICAgICAgICBsZXQgcm5nT3B0aW9ucyA9IHt9O1xuICAgICAgICBpZiAodHlwZW9mIHNldHRpbmdzLnJhbmQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBybmdPcHRpb25zLnJhbmQgPSBzZXR0aW5ncy5yYW5kO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0dGluZ3Muc2VlZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJuZ09wdGlvbnMuc2VlZCA9IHNldHRpbmdzLnNlZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ybmcgPSBuZXcgUk5HKHJuZ09wdGlvbnMpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gXCJzdHJpbmdpZmllZCBCVE0gZW52aXJvbm1lbnQgb2JqZWN0XCI7XG4gICAgfVxuXG4gICAgLy8gUGVyZm9ybSBhcHByb3hpbWF0ZSBjb21wYXJpc29uIHRlc3RzIHVzaW5nIGVudmlyb25tZW50IHNldHRpbmdzXG4gICAgLy8gYSA8IGI6IC0xXG4gICAgLy8gYSB+PSBiOiAwXG4gICAgLy8gYSA+IGI6IDFcbiAgICBudW1iZXJDbXAoYSxiLG92ZXJyaWRlKSB7XG4gICAgICAgIC8vIFdvcmsgd2l0aCBhY3R1YWwgdmFsdWVzLlxuICAgICAgICB2YXIgdmFsQSwgdmFsQiwgY21wUmVzdWx0O1xuICAgICAgICB2YXIgdXNlUmVsRXJyID0gdGhpcy5vcHRpb25zLnVzZVJlbEVycixcbiAgICAgICAgICAgIHJlbFRvbCA9IHRoaXMub3B0aW9ucy5yZWxUb2wsXG4gICAgICAgICAgICBhYnNUb2wgPSB0aGlzLm9wdGlvbnMuYWJzVG9sO1xuXG4gICAgICAgIGlmICh0eXBlb2YgYSA9PT0gJ251bWJlcicgfHwgdHlwZW9mIGEgPT09ICdOdW1iZXInKSB7XG4gICAgICAgICAgICB2YWxBID0gYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbEEgPSBhLnZhbHVlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBiID09PSAnbnVtYmVyJyB8fCB0eXBlb2YgYiA9PT0gJ051bWJlcicpIHtcbiAgICAgICAgICAgIHZhbEIgPSBiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsQiA9IGIudmFsdWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFB1bGwgb3V0IHRoZSBvcHRpb25zLlxuICAgICAgICBpZiAodHlwZW9mIG92ZXJyaWRlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvdmVycmlkZS51c2VSZWxFcnIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgdXNlUmVsRXJyID0gb3ZlcnJpZGUudXNlUmVsRXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvdmVycmlkZS5yZWxUb2wgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmVsVG9sID0gb3ZlcnJpZGUucmVsVG9sO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvdmVycmlkZS5hYnNUb2wgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgYWJzVG9sID0gb3ZlcnJpZGUuYWJzVG9sO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF1c2VSZWxFcnIgfHwgTWF0aC5hYnModmFsQSkgPCBhYnNUb2wpIHtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyh2YWxCLXZhbEEpIDwgYWJzVG9sKSB7XG4gICAgICAgICAgICAgICAgY21wUmVzdWx0ID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsQSA8IHZhbEIpIHtcbiAgICAgICAgICAgICAgICBjbXBSZXN1bHQgPSAtMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY21wUmVzdWx0ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyh2YWxCLXZhbEEpL01hdGguYWJzKHZhbEEpIDwgcmVsVG9sKSB7XG4gICAgICAgICAgICAgICAgY21wUmVzdWx0ID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsQSA8IHZhbEIpIHtcbiAgICAgICAgICAgICAgICBjbXBSZXN1bHQgPSAtMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY21wUmVzdWx0ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY21wUmVzdWx0O1xuICAgIH1cblxuICAgIC8qIEJsb2NrIG9mIG1ldGhvZHMgdG8gZGVhbCB3aXRoIHJlZHVjdGlvbiBydWxlcyBpbiBjb250ZXh0ICovXG4gICAgc2V0UmVkdWN0aW9uUnVsZXMoKSB7XG4gICAgICAgIHRoaXMucmVkdWNlUnVsZXMgPSBkZWZhdWx0UmVkdWN0aW9ucyh0aGlzKTtcbiAgICB9XG5cbiAgICBhZGRSZWR1Y3Rpb25SdWxlKGVxdWF0aW9uLCBkZXNjcmlwdGlvbiwgdXNlT25lV2F5KSB7XG4gICAgICAgIG5ld1J1bGUodGhpcywgdGhpcy5yZWR1Y2VSdWxlcywgZXF1YXRpb24sIGRlc2NyaXB0aW9uLCB0cnVlLCB1c2VPbmVXYXkpO1xuICAgIH1cblxuICAgIGRpc2FibGVSZWR1Y3Rpb25SdWxlKGVxdWF0aW9uKSB7XG4gICAgICAgIGRpc2FibGVSdWxlKHRoaXMsIHRoaXMucmVkdWNlUnVsZXMsIGVxdWF0aW9uKTtcbiAgICB9XG5cbiAgICBhZGRSdWxlKHJ1bGVMaXN0LCBlcXVhdGlvbiwgZGVzY3JpcHRpb24sIHVzZU9uZVdheSl7XG4gICAgICAgIG5ld1J1bGUodGhpcywgcnVsZUxpc3QsIGVxdWF0aW9uLCBkZXNjcmlwdGlvbiwgdHJ1ZSwgdXNlT25lV2F5KTtcbiAgICB9XG5cbiAgICBmaW5kTWF0Y2hSdWxlcyhyZWR1Y3Rpb25MaXN0LCB0ZXN0RXhwciwgZG9WYWxpZGF0ZSkge1xuICAgICAgICByZXR1cm4gZmluZE1hdGNoUnVsZXMocmVkdWN0aW9uTGlzdCwgdGVzdEV4cHIsIGRvVmFsaWRhdGUpO1xuICAgIH1cblxuICAgIGFkZE1hdGhPYmplY3QobmFtZSwgY29udGV4dCwgbmV3T2JqZWN0KSB7XG4gICAgICAgIHN3aXRjaChjb250ZXh0KSB7XG4gICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgICAgIGlmIChuZXdPYmplY3QuaXNDb25zdGFudCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5wYXJhbXNbbmFtZV0gPSBuZXdPYmplY3Q7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5hbGxWYWx1ZXNbbmFtZV0gPSBuZXdPYmplY3Q7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYEF0dGVtcHQgdG8gYWRkIG1hdGggb2JqZWN0ICcke25hbWV9JyB3aXRoIGNvbnRleHQgJyR7Y29udGV4dH0nIHRoYXQgZG9lcyBub3QgbWF0Y2guYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdmb3JtdWxhJzpcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuYWxsVmFsdWVzW25hbWVdID0gbmV3T2JqZWN0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdPYmplY3Q7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVSYW5kb20oZGlzdHIsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHJuZFZhbCwgcm5kU2NhbGFyO1xuXG4gICAgICAgIHN3aXRjaCAoZGlzdHIpIHtcbiAgICAgICAgICAgIGNhc2UgJ2Rpc2NyZXRlJzpcbiAgICAgICAgICAgICAgICBsZXQgbWluID0gb3B0aW9ucy5taW47XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtaW4udmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgbWluID0gbWluLnZhbHVlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBtYXggPSBvcHRpb25zLm1heDtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1heC52YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBtYXggPSBtYXgudmFsdWUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IGJ5ID0gb3B0aW9ucy5ieTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGJ5LnZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGJ5ID0gYnkudmFsdWUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IE52YWxzID0gTWF0aC5mbG9vcigobWF4LW1pbikgLyBieSkrMTtcbiAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgIHJuZFZhbCA9IG1pbiArIGJ5ICogdGhpcy5ybmcucmFuZEludCgwLE52YWxzLTEpO1xuICAgICAgICAgICAgICAgIH0gd2hpbGUgKG9wdGlvbnMubm9uemVybyAmJiBNYXRoLmFicyhybmRWYWwpIDwgdGhpcy5vcHRpb25zLmFic1RvbCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcm5kU2NhbGFyID0gbmV3IHNjYWxhcl9leHByKHRoaXMsIHJuZFZhbCk7XG4gICAgICAgIHJldHVybiBybmRTY2FsYXI7XG4gICAgfVxuXG4gICAgYWRkUGFyYW1ldGVyKG5hbWUsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIG5ld1BhcmFtO1xuICAgICAgICBsZXQgcHJlYyA9IG9wdGlvbnMucHJlYztcbiAgICAgICAgaWYgKG9wdGlvbnMubW9kZSA9PT0gJ3JhbmRvbScpIHtcbiAgICAgICAgICAgIGxldCBkaXN0ciA9IG9wdGlvbnMuZGlzdHI7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGRpc3RyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGRpc3RyID0gJ2Rpc2NyZXRlX3JhbmdlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAoZGlzdHIpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdkaXNjcmV0ZV9yYW5nZSc6XG4gICAgICAgICAgICAgICAgICAgIGxldCBtaW4gPSBvcHRpb25zLm1pbjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtaW4udmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbiA9IG1pbi52YWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCBtYXggPSBvcHRpb25zLm1heDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtYXgudmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heCA9IG1heC52YWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCBieSA9IG9wdGlvbnMuYnk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYnkudmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ5ID0gYnkudmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgTnZhbHMgPSBNYXRoLmZsb29yKChtYXgtbWluKSAvIGJ5KSsxO1xuICAgICAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdQYXJhbSA9IG1pbiArIGJ5ICogdGhpcy5ybmcucmFuZEludCgwLE52YWxzLTEpO1xuICAgICAgICAgICAgICAgICAgICB9IHdoaWxlIChvcHRpb25zLm5vbnplcm8gJiYgTWF0aC5hYnMobmV3UGFyYW0pIDwgdGhpcy5vcHRpb25zLmFic1RvbCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMubW9kZSA9PSAnY2FsY3VsYXRlJykge1xuICAgICAgICAgICAgbmV3UGFyYW0gPSB0aGlzLnBhcnNlKG9wdGlvbnMuZm9ybXVsYSwgXCJmb3JtdWxhXCIpLmV2YWx1YXRlKHRoaXMuZGF0YS5wYXJhbXMpO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMubW9kZSA9PSAncmF0aW9uYWwnKSB7XG4gICAgICAgICAgICBuZXdQYXJhbSA9IHRoaXMucGFyc2UobmV3IHJhdGlvbmFsX251bWJlcihvcHRpb25zLm51bWVyLG9wdGlvbnMuZGVub20pLnRvU3RyaW5nKCksIFwibnVtYmVyXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMubW9kZSA9PSAnc3RhdGljJykge1xuICAgICAgICAgICAgbmV3UGFyYW0gPSBvcHRpb25zLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgcHJlYyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIG5ld1BhcmFtID0gTWF0aC5yb3VuZChuZXdQYXJhbS9wcmVjKSAvIE1hdGgucm91bmQoMS9wcmVjKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRhdGEucGFyYW1zW25hbWVdID0gbmV3UGFyYW07XG4gICAgICAgIHRoaXMuZGF0YS5hbGxWYWx1ZXNbbmFtZV0gPSBuZXdQYXJhbTtcblxuICAgICAgICByZXR1cm4gbmV3UGFyYW07XG4gICAgfVxuXG4gICAgYWRkVmFyaWFibGUobmFtZSwgb3B0aW9ucykge1xuICAgICAgICB2YXIgbmV3VmFyID0gbmV3IHZhcmlhYmxlX2V4cHIobmFtZSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmRhdGEudmFyaWFibGVzW25hbWVdID0gbmV3VmFyO1xuICAgICAgICB0aGlzLmRhdGEuYWxsVmFsdWVzW25hbWVdID0gbmV3VmFyO1xuXG4gICAgICAgIHJldHVybiBuZXdWYXI7XG4gICAgfVxuXG4gICAgZXZhbHVhdGVNYXRoT2JqZWN0KG1hdGhPYmplY3QsIGNvbnRleHQsIGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciB0aGVFeHByLCBuZXdFeHByLCByZXRWYWx1ZTtcbiAgICAgICAgLy8gTm90IHlldCBwYXJzZWRcbiAgICAgICAgaWYgKHR5cGVvZiBtYXRoT2JqZWN0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdmFyIGZvcm11bGEgPSB0aGlzLmRlY29kZUZvcm11bGEobWF0aE9iamVjdCk7XG4gICAgICAgICAgICB0aGVFeHByID0gdGhpcy5wYXJzZShmb3JtdWxhLCBcImZvcm11bGFcIik7XG4gICAgICAgIC8vIEFscmVhZHkgcGFyc2VkXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG1hdGhPYmplY3QgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB0aGVFeHByID0gbWF0aE9iamVjdDtcbiAgICAgICAgfVxuICAgICAgICByZXRWYWx1ZSA9IHRoZUV4cHIuZXZhbHVhdGUoYmluZGluZ3MpO1xuICAgICAgICBuZXdFeHByID0gbmV3IHNjYWxhcl9leHByKHRoaXMsIHJldFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ld0V4cHI7XG4gICAgfVxuXG4gICAgcGFyc2VFeHByZXNzaW9uKGV4cHJlc3Npb24sIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIG5ld0V4cHI7XG4gICAgICAgIC8vIE5vdCB5ZXQgcGFyc2VkXG4gICAgICAgIGlmICh0eXBlb2YgZXhwcmVzc2lvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmFyIGZvcm11bGEgPSB0aGlzLmRlY29kZUZvcm11bGEoZXhwcmVzc2lvbik7XG4gICAgICAgIG5ld0V4cHIgPSB0aGlzLnBhcnNlKGZvcm11bGEsIGNvbnRleHQpO1xuICAgICAgICAvLyBBbHJlYWR5IHBhcnNlZFxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHByZXNzaW9uID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgbmV3RXhwciA9IGV4cHJlc3Npb247XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0V4cHI7XG4gICAgfVxuXG4gICAgYWRkRXhwcmVzc2lvbihuYW1lLCBleHByZXNzaW9uKSB7XG4gICAgICAgIHZhciBuZXdFeHByID0gdGhpcy5wYXJzZUV4cHJlc3Npb24oZXhwcmVzc2lvbiwgXCJmb3JtdWxhXCIpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5kYXRhLmV4cHJlc3Npb25zW25hbWVdID0gbmV3RXhwcjtcbiAgICAgICAgdGhpcy5kYXRhLmFsbFZhbHVlc1tuYW1lXSA9IG5ld0V4cHI7XG5cbiAgICAgICAgcmV0dXJuIG5ld0V4cHI7XG4gICAgfVxuXG4gICAgLy8gVGhpcyByb3V0aW5lIHRha2VzIHRoZSB0ZXh0IGFuZCBsb29rcyBmb3Igc3RyaW5ncyBpbiBtdXN0YWNoZXMge3tuYW1lfX1cbiAgICAvLyBJdCByZXBsYWNlcyB0aGlzIGVsZW1lbnQgd2l0aCB0aGUgY29ycmVzcG9uZGluZyBwYXJhbWV0ZXIsIHZhcmlhYmxlLCBvciBleHByZXNzaW9uLlxuICAgIC8vIFRoZXNlIHNob3VsZCBoYXZlIGJlZW4gcHJldmlvdXNseSBwYXJzZWQgYW5kIHN0b3JlZCBpbiB0aGlzLmRhdGEuXG4gICAgZGVjb2RlRm9ybXVsYShzdGF0ZW1lbnQsIGRpc3BsYXlNb2RlKSB7XG4gICAgICAgIC8vIEZpcnN0IGZpbmQgYWxsIG9mIHRoZSBleHBlY3RlZCBzdWJzdGl0dXRpb25zLlxuICAgICAgICB2YXIgc3Vic3RSZXF1ZXN0TGlzdCA9IHt9O1xuICAgICAgICB2YXIgbWF0Y2hSRSA9IC9cXHtcXHtbQS1aYS16XVxcdypcXH1cXH0vZztcbiAgICAgICAgdmFyIHN1YnN0TWF0Y2hlcyA9IHN0YXRlbWVudC5tYXRjaChtYXRjaFJFKTtcbiAgICAgICAgaWYgKHN1YnN0TWF0Y2hlcyAhPSBudWxsKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8c3Vic3RNYXRjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoTmFtZSA9IHN1YnN0TWF0Y2hlc1tpXTtcbiAgICAgICAgICAgICAgICBtYXRjaE5hbWUgPSBtYXRjaE5hbWUuc3Vic3RyKDIsbWF0Y2hOYW1lLmxlbmd0aC00KTtcbiAgICAgICAgICAgICAgICAvLyBOb3cgc2VlIGlmIHRoZSBuYW1lIGlzIGluIG91ciBzdWJzdGl0dXRpb24gcnVsZXMuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5hbGxWYWx1ZXNbbWF0Y2hOYW1lXSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3BsYXlNb2RlICE9IHVuZGVmaW5lZCAmJiBkaXNwbGF5TW9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic3RSZXF1ZXN0TGlzdFttYXRjaE5hbWVdID0gJ3snK3RoaXMuZGF0YS5hbGxWYWx1ZXNbbWF0Y2hOYW1lXS50b1RlWCgpKyd9JztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnN0UmVxdWVzdExpc3RbbWF0Y2hOYW1lXSA9ICcoJyt0aGlzLmRhdGEuYWxsVmFsdWVzW21hdGNoTmFtZV0udG9TdHJpbmcoKSsnKSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXZSBhcmUgbm93IHJlYWR5IHRvIG1ha2UgdGhlIHN1YnN0aXR1dGlvbnMuXG4gICAgICAgIHZhciByZXRTdHJpbmcgPSBzdGF0ZW1lbnQ7XG4gICAgICAgIGZvciAodmFyIG1hdGNoIGluIHN1YnN0UmVxdWVzdExpc3QpIHtcbiAgICAgICAgICAgIHZhciByZSA9IG5ldyBSZWdFeHAoXCJ7e1wiICsgbWF0Y2ggKyBcIn19XCIsIFwiZ1wiKTtcbiAgICAgICAgICAgIHZhciBzdWJzdCA9IHN1YnN0UmVxdWVzdExpc3RbbWF0Y2hdO1xuICAgICAgICAgICAgcmV0U3RyaW5nID0gcmV0U3RyaW5nLnJlcGxhY2UocmUsIHN1YnN0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0U3RyaW5nO1xuICAgIH1cblxuICAgIGNvbXBhcmVFeHByZXNzaW9ucyhleHByMSwgZXhwcjIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBleHByMSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGV4cHIxID0gdGhpcy5wYXJzZShleHByMSwgXCJmb3JtdWxhXCIpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBleHByMiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGV4cHIyID0gdGhpcy5wYXJzZShleHByMiwgXCJmb3JtdWxhXCIpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChleHByMS5jb21wYXJlKGV4cHIyKSk7XG4gICAgfVxuXG4gICAgZ2V0UGFyc2VyKGNvbnRleHQpIHtcbiAgICAgICAgdmFyIHNlbGY9dGhpcyxcbiAgICAgICAgICAgIHBhcnNlQ29udGV4dD1jb250ZXh0O1xuICAgICAgICByZXR1cm4gKGZ1bmN0aW9uKGV4cHJTdHJpbmcpeyByZXR1cm4gc2VsZi5wYXJzZShleHByU3RyaW5nLCBwYXJzZUNvbnRleHQpOyB9KVxuICAgIH1cbiBcbiAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgIGJ0bS5wYXJzZSgpIGlzIHRoZSB3b3JraG9yc2UuXG5cbiAgICAgIFRha2UgYSBzdHJpbmcgcmVwcmVzZW50aW5nIGEgZm9ybXVsYSwgYW5kIGRlY29tcG9zZSBpdCBpbnRvIGFuIGFwcHJvcHJpYXRlXG4gICAgICB0cmVlIHN0cnVjdHVyZSBzdWl0YWJsZSBmb3IgcmVjdXJzaXZlIGV2YWx1YXRpb24gb2YgdGhlIGZ1bmN0aW9uLlxuICAgICAgUmV0dXJucyB0aGUgcm9vdCBlbGVtZW50IHRvIHRoZSB0cmVlLlxuICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICBwYXJzZShmb3JtdWxhU3RyLCBjb250ZXh0LCBiaW5kaW5ncywgb3B0aW9ucykge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgICBjb250ZXh0ID0gXCJmb3JtdWxhXCI7XG4gICAgfVxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykge1xuICAgICAgYmluZGluZ3MgPSB7fTtcbiAgICB9XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCA0KSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgY29uc3QgbnVtYmVyTWF0Y2ggPSAvXFxkfChcXC5cXGQpLztcbiAgICBjb25zdCBuYW1lTWF0Y2ggPSAvW2EtekEtWl0vO1xuICAgIGNvbnN0IHVub3BNYXRjaCA9IC9bXFwrXFwtL10vO1xuICAgIGNvbnN0IG9wTWF0Y2ggPSAvW1xcK1xcLSovXj1cXCQmXS87XG5cbiAgICB2YXIgY2hhclBvcyA9IDAsIGVuZFBvcztcbiAgICB2YXIgcGFyc2VFcnJvciA9ICcnO1xuXG4gICAgLy8gU3RyaXAgYW55IGV4dHJhbmVvdXMgd2hpdGUgc3BhY2UgYW5kIHBhcmVudGhlc2VzLlxuICAgIHZhciB3b3JraW5nU3RyO1xuICAgIHdvcmtpbmdTdHIgPSBmb3JtdWxhU3RyLnRyaW0oKTtcblxuICAgIC8vIFRlc3QgaWYgcGFyZW50aGVzZXMgYXJlIGFsbCBiYWxhbmNlZC5cbiAgICB2YXIgaGFzRXh0cmFQYXJlbnMgPSB0cnVlO1xuICAgIHdoaWxlIChoYXNFeHRyYVBhcmVucykge1xuICAgICAgaGFzRXh0cmFQYXJlbnMgPSBmYWxzZTtcbiAgICAgIGlmICh3b3JraW5nU3RyLmNoYXJBdCgwKSA9PSAnKCcpIHtcbiAgICAgICAgdmFyIGVuZEV4cHIgPSBjb21wbGV0ZVBhcmVudGhlc2lzKHdvcmtpbmdTdHIsIDApO1xuICAgICAgICBpZiAoZW5kRXhwcisxID49IHdvcmtpbmdTdHIubGVuZ3RoKSB7XG4gICAgICAgICAgaGFzRXh0cmFQYXJlbnMgPSB0cnVlO1xuICAgICAgICAgIHdvcmtpbmdTdHIgPSB3b3JraW5nU3RyLnNsaWNlKDEsLTEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gV2UgYnVpbGQgdGhlIHRyZWUgYXMgaXQgaXMgcGFyc2VkLiBcbiAgICAvLyBUd28gc3RhY2tzIGtlZXAgdHJhY2sgb2Ygb3BlcmFuZHMgKGV4cHJlc3Npb25zKSBhbmQgb3BlcmF0b3JzXG4gICAgLy8gd2hpY2ggd2Ugd2lsbCBpZGVudGlmeSBhcyB0aGUgc3RyaW5nIGlzIHBhcnNlZCBsZWZ0IHRvIHJpZ2h0XG4gICAgLy8gQXQgdGhlIHRpbWUgYW4gb3BlcmFuZCBpcyBwYXJzZWQsIHdlIGRvbid0IGtub3cgdG8gd2hpY2ggb3BlcmF0b3IgXG4gICAgLy8gaXQgdWx0aW1hdGVseSBiZWxvbmdzLCBzbyB3ZSBwdXNoIGl0IG9udG8gYSBzdGFjayB1bnRpbCB3ZSBrbm93LlxuICAgIHZhciBvcGVyYW5kU3RhY2sgPSBuZXcgQXJyYXkoKTtcbiAgICB2YXIgb3BlcmF0b3JTdGFjayA9IG5ldyBBcnJheSgpO1xuXG4gICAgLy8gV2hlbiBhbiBvcGVyYXRvciBpcyBwdXNoZWQsIHdlIHdhbnQgdG8gY29tcGFyZSBpdCB0byB0aGUgcHJldmlvdXMgb3BlcmF0b3JcbiAgICAvLyBhbmQgc2VlIGlmIHdlIG5lZWQgdG8gYXBwbHkgdGhlIG9wZXJhdG9ycyB0byBzb21lIG9wZXJhbmRzLlxuICAgIC8vIFRoaXMgaXMgYmFzZWQgb24gb3BlcmF0b3IgcHJlY2VkZW5jZSAob3JkZXIgb2Ygb3BlcmF0aW9ucykuXG4gICAgLy8gQW4gZW1wdHkgbmV3T3AgbWVhbnMgdG8gZmluaXNoIHJlc29sdmUgdGhlIHJlc3Qgb2YgdGhlIHN0YWNrcy5cbiAgICBmdW5jdGlvbiByZXNvbHZlT3BlcmF0b3IoYnRtLCBvcGVyYXRvclN0YWNrLCBvcGVyYW5kU3RhY2ssIG5ld09wKSB7XG4gICAgICAvLyBUZXN0IGlmIHRoZSBvcGVyYXRvciBoYXMgbG93ZXIgcHJlY2VkZW5jZS5cbiAgICAgIHZhciBvbGRPcCA9IDA7XG4gICAgICB3aGlsZSAob3BlcmF0b3JTdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgIG9sZE9wID0gb3BlcmF0b3JTdGFjay5wb3AoKTtcbiAgICAgICAgaWYgKG5ld09wICYmIChuZXdPcC50eXBlPT1leHByVHlwZS51bm9wIHx8IG9sZE9wLnByZWMgPCBuZXdPcC5wcmVjKSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUbyBnZXQgaGVyZSwgdGhlIG5ldyBvcGVyYXRvciBtdXN0IGJlICpiaW5hcnkqXG4gICAgICAgIC8vIGFuZCB0aGUgb3BlcmF0b3IgdG8gdGhlIGxlZnQgaGFzICpoaWdoZXIqIHByZWNlZGVuY2UuXG4gICAgICAgIC8vIFNvIHdlIG5lZWQgdG8gcGVlbCBvZmYgdGhlIG9wZXJhdG9yIHRvIHRoZSBsZWZ0IHdpdGggaXRzIG9wZXJhbmRzXG4gICAgICAgIC8vIHRvIGZvcm0gYW4gZXhwcmVzc2lvbiBhcyBhIG5ldyBjb21wb3VuZCBvcGVyYW5kIGZvciB0aGUgbmV3IG9wZXJhdG9yLlxuICAgICAgICB2YXIgbmV3RXhwcjtcbiAgICAgICAgLy8gVW5hcnk6IEVpdGhlciBuZWdhdGl2ZSBvciByZWNpcHJvY2FsIHJlcXVpcmUgKm9uZSogb3BlcmFuZFxuICAgICAgICBpZiAob2xkT3AudHlwZSA9PSBleHByVHlwZS51bm9wKSB7XG4gICAgICAgICAgaWYgKG9wZXJhbmRTdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgaW5wdXQgPSBvcGVyYW5kU3RhY2sucG9wKCk7XG5cbiAgICAgICAgICAgIC8vIERlYWwgd2l0aCBuZWdhdGl2ZSBudW1iZXJzIHNlcGFyYXRlbHkuXG4gICAgICAgICAgICBpZiAoYnRtLm9wdGlvbnMubmVnYXRpdmVOdW1iZXJzICYmIGlucHV0LnR5cGUgPT0gZXhwclR5cGUubnVtYmVyICYmIG9sZE9wLm9wID09ICctJykge1xuICAgICAgICAgICAgICBuZXdFeHByID0gbmV3IHNjYWxhcl9leHByKGJ0bSwgaW5wdXQubnVtYmVyLm11bHRpcGx5KC0xKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBuZXdFeHByID0gbmV3IHVub3BfZXhwcihidG0sIG9sZE9wLm9wLCBpbnB1dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0V4cHIgPSBuZXcgZXhwcmVzc2lvbihidG0pO1xuICAgICAgICAgICAgbmV3RXhwci5zZXRQYXJzaW5nRXJyb3IoXCJJbmNvbXBsZXRlIGZvcm11bGE6IG1pc3NpbmcgdmFsdWUgZm9yIFwiICsgb2xkT3Aub3ApO1xuICAgICAgICAgIH1cbiAgICAgICAgLy8gQmluYXJ5OiBXaWxsIGJlICp0d28qIG9wZXJhbmRzLlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcGVyYW5kU3RhY2subGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgdmFyIGlucHV0QiA9IG9wZXJhbmRTdGFjay5wb3AoKTtcbiAgICAgICAgICAgIHZhciBpbnB1dEEgPSBvcGVyYW5kU3RhY2sucG9wKCk7XG4gICAgICAgICAgICBuZXdFeHByID0gbmV3IGJpbm9wX2V4cHIoYnRtLCBvbGRPcC5vcCwgaW5wdXRBLCBpbnB1dEIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdFeHByID0gbmV3IGV4cHJlc3Npb24oYnRtKTtcbiAgICAgICAgICAgIG5ld0V4cHIuc2V0UGFyc2luZ0Vycm9yKFwiSW5jb21wbGV0ZSBmb3JtdWxhOiBtaXNzaW5nIHZhbHVlIGZvciBcIiArIG9sZE9wLm9wKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgb3BlcmFuZFN0YWNrLnB1c2gobmV3RXhwcik7XG4gICAgICAgIG9sZE9wID0gMDtcbiAgICAgIH1cbiAgICAgIC8vIFRoZSBuZXcgb3BlcmF0b3IgaXMgdW5hcnkgb3IgaGFzIGhpZ2hlciBwcmVjZWRlbmNlIHRoYW4gdGhlIHByZXZpb3VzIG9wLlxuICAgICAgLy8gV2UgbmVlZCB0byBwdXNoIHRoZSBvbGQgb3BlcmF0b3IgYmFjayBvbiB0aGUgc3RhY2sgdG8gdXNlIGxhdGVyLlxuICAgICAgaWYgKG9sZE9wICE9IDApIHtcbiAgICAgICAgb3BlcmF0b3JTdGFjay5wdXNoKG9sZE9wKTtcbiAgICAgIH1cbiAgICAgIC8vIEEgbmV3IG9wZXJhdGlvbiB3YXMgYWRkZWQgdG8gZGVhbCB3aXRoIGxhdGVyLlxuICAgICAgaWYgKG5ld09wKSB7XG4gICAgICAgIG9wZXJhdG9yU3RhY2sucHVzaChuZXdPcCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTm93IHdlIGJlZ2luIHRvIHByb2Nlc3MgdGhlIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGV4cHJlc3Npb24uXG4gICAgdmFyIGxhc3RFbGVtZW50ID0gLTEsIG5ld0VsZW1lbnQ7IC8vIDAgZm9yIG9wZXJhbmQsIDEgZm9yIG9wZXJhdG9yLlxuXG4gICAgLy8gUmVhZCBzdHJpbmcgbGVmdCB0byByaWdodC5cbiAgICAvLyBJZGVudGlmeSB3aGF0IHR5cGUgb2YgbWF0aCBvYmplY3Qgc3RhcnRzIGF0IHRoaXMgY2hhcmFjdGVyLlxuICAgIC8vIEZpbmQgdGhlIG90aGVyIGVuZCBvZiB0aGF0IG9iamVjdCBieSBjb21wbGV0aW9uLlxuICAgIC8vIEludGVycHJldCB0aGF0IG9iamVjdCwgcG9zc2libHkgdGhyb3VnaCBhIHJlY3Vyc2l2ZSBwYXJzaW5nLlxuICAgIGZvciAoY2hhclBvcyA9IDA7IGNoYXJQb3M8d29ya2luZ1N0ci5sZW5ndGg7IGNoYXJQb3MrKykge1xuICAgICAgLy8gSWRlbnRpZnkgdGhlIG5leHQgZWxlbWVudCBpbiB0aGUgc3RyaW5nLlxuICAgICAgaWYgKHdvcmtpbmdTdHIuY2hhckF0KGNoYXJQb3MpID09ICcgJykge1xuICAgICAgICBjb250aW51ZTtcblxuICAgICAgLy8gSXQgbWlnaHQgYmUgYSBjbG9zZSBwYXJlbnRoZXNlcyB0aGF0IHdhcyBub3QgbWF0Y2hlZCBvbiB0aGUgbGVmdC5cbiAgICAgIH0gZWxzZSBpZiAod29ya2luZ1N0ci5jaGFyQXQoY2hhclBvcykgPT0gJyknKSB7XG4gICAgICAgIC8vIFRyZWF0IHRoaXMgbGlrZSBhbiBpbXBsaWNpdCBvcGVuIHBhcmVudGhlc2lzIG9uIHRoZSBsZWZ0LlxuICAgICAgICByZXNvbHZlT3BlcmF0b3IodGhpcywgb3BlcmF0b3JTdGFjaywgb3BlcmFuZFN0YWNrKTtcbiAgICAgICAgbmV3RWxlbWVudCA9IDA7XG4gICAgICAgIGxhc3RFbGVtZW50ID0gLTE7XG5cbiAgICAgIC8vIEl0IGNvdWxkIGJlIGFuIGV4cHJlc3Npb24gc3Vycm91bmRlZCBieSBwYXJlbnRoZXNlcyAtLSB1c2UgcmVjdXJzaW9uXG4gICAgICB9IGVsc2UgaWYgKHdvcmtpbmdTdHIuY2hhckF0KGNoYXJQb3MpID09ICcoJykge1xuICAgICAgICBlbmRQb3MgPSBjb21wbGV0ZVBhcmVudGhlc2lzKHdvcmtpbmdTdHIsIGNoYXJQb3MpO1xuICAgICAgICB2YXIgc3ViRXhwclN0ciA9IHdvcmtpbmdTdHIuc2xpY2UoY2hhclBvcysxLGVuZFBvcyk7XG4gICAgICAgIHZhciBzdWJFeHByID0gdGhpcy5wYXJzZShzdWJFeHByU3RyLCBjb250ZXh0LCBiaW5kaW5ncyk7XG4gICAgICAgIG9wZXJhbmRTdGFjay5wdXNoKHN1YkV4cHIpO1xuICAgICAgICBuZXdFbGVtZW50ID0gMDtcbiAgICAgICAgY2hhclBvcyA9IGVuZFBvcztcblxuICAgICAgLy8gSXQgY291bGQgYmUgYW4gYWJzb2x1dGUgdmFsdWVcbiAgICAgIH0gZWxzZSBpZiAod29ya2luZ1N0ci5jaGFyQXQoY2hhclBvcykgPT0gJ3wnKSB7XG4gICAgICAgIGVuZFBvcyA9IGNvbXBsZXRlQWJzVmFsdWUod29ya2luZ1N0ciwgY2hhclBvcyk7XG4gICAgICAgIHZhciBzdWJFeHByU3RyID0gd29ya2luZ1N0ci5zbGljZShjaGFyUG9zKzEsZW5kUG9zKTtcbiAgICAgICAgdmFyIHN1YkV4cHIgPSB0aGlzLnBhcnNlKHN1YkV4cHJTdHIsIGNvbnRleHQsIGJpbmRpbmdzKTtcbiAgICAgICAgdmFyIG5ld0V4cHIgPSBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLCAnYWJzJywgc3ViRXhwcik7XG4gICAgICAgIG9wZXJhbmRTdGFjay5wdXNoKG5ld0V4cHIpO1xuICAgICAgICBuZXdFbGVtZW50ID0gMDtcbiAgICAgICAgY2hhclBvcyA9IGVuZFBvcztcblxuICAgICAgLy8gSXQgY291bGQgYmUgYSBudW1iZXIuIEp1c3QgcmVhZCBpdCBvZmZcbiAgICAgIH0gZWxzZSBpZiAod29ya2luZ1N0ci5zdWJzdHIoY2hhclBvcykuc2VhcmNoKG51bWJlck1hdGNoKSA9PSAwKSB7XG4gICAgICAgIGVuZFBvcyA9IGNvbXBsZXRlTnVtYmVyKHdvcmtpbmdTdHIsIGNoYXJQb3MsIG9wdGlvbnMpO1xuICAgICAgICB2YXIgbmV3RXhwciA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLCBuZXcgTnVtYmVyKHdvcmtpbmdTdHIuc2xpY2UoY2hhclBvcywgZW5kUG9zKSkpO1xuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLm5vRGVjaW1hbHMgJiYgd29ya2luZ1N0ci5jaGFyQXQoY2hhclBvcykgPT0gJy4nKSB7XG4gICAgICAgICAgbmV3RXhwci5zZXRQYXJzaW5nRXJyb3IoXCJXaG9sZSBudW1iZXJzIG9ubHkuIE5vIGRlY2ltYWwgdmFsdWVzIGFyZSBhbGxvd2VkLlwiKVxuICAgICAgICB9XG4gICAgICAgIG9wZXJhbmRTdGFjay5wdXNoKG5ld0V4cHIpO1xuICAgICAgICBuZXdFbGVtZW50ID0gMDtcbiAgICAgICAgY2hhclBvcyA9IGVuZFBvcy0xO1xuXG4gICAgICAvLyBJdCBjb3VsZCBiZSBhIG5hbWUsIGVpdGhlciBhIGZ1bmN0aW9uIG9yIHZhcmlhYmxlLlxuICAgICAgfSBlbHNlIGlmICh3b3JraW5nU3RyLnN1YnN0cihjaGFyUG9zKS5zZWFyY2gobmFtZU1hdGNoKSA9PSAwKSB7XG4gICAgICAgIGVuZFBvcyA9IGNvbXBsZXRlTmFtZSh3b3JraW5nU3RyLCBjaGFyUG9zKTtcbiAgICAgICAgdmFyIHRoZU5hbWUgPSB3b3JraW5nU3RyLnNsaWNlKGNoYXJQb3MsZW5kUG9zKTtcbiAgICAgICAgLy8gSWYgbm90IGEga25vd24gbmFtZSwgYnJlYWsgaXQgZG93biB1c2luZyBjb21wb3NpdGUgaWYgcG9zc2libGUuXG4gICAgICAgIGlmIChiaW5kaW5nc1t0aGVOYW1lXT09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBrbm93biBuYW1lLCBvciB0aGVOYW1lIG5vdCBjb21wb3NpdGUuXG4gICAgICAgICAgdmFyIHRlc3RSZXN1bHRzID0gVGVzdE5hbWVJc0NvbXBvc2l0ZSh0aGVOYW1lLCBiaW5kaW5ncyk7XG4gICAgICAgICAgaWYgKHRlc3RSZXN1bHRzLmlzQ29tcG9zaXRlKSB7XG4gICAgICAgICAgICB0aGVOYW1lID0gdGVzdFJlc3VsdHMubmFtZTtcbiAgICAgICAgICAgIGVuZFBvcyA9IGNoYXJQb3MgKyB0aGVOYW1lLmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGVzdCBpZiBhIGZ1bmN0aW9uXG4gICAgICAgIGlmIChiaW5kaW5nc1t0aGVOYW1lXT09PXVuZGVmaW5lZCAmJiB3b3JraW5nU3RyLmNoYXJBdChlbmRQb3MpID09ICcoJykge1xuICAgICAgICAgIHZhciBlbmRQYXJlbiA9IGNvbXBsZXRlUGFyZW50aGVzaXMod29ya2luZ1N0ciwgZW5kUG9zKTtcblxuICAgICAgICAgIHZhciBmY25OYW1lID0gdGhlTmFtZTtcbiAgICAgICAgICB2YXIgbmV3RXhwcjtcbiAgICAgICAgICAvLyBTZWUgaWYgdGhpcyBpcyBhIGRlcml2YXRpdmVcbiAgICAgICAgICBpZiAoZmNuTmFtZSA9PSAnRCcpIHtcbiAgICAgICAgICAgIHZhciBleHByLCBpdmFyLCBpdmFyVmFsdWU7XG4gICAgICAgICAgICB2YXIgZW50cmllcyA9IHdvcmtpbmdTdHIuc2xpY2UoZW5kUG9zKzEsZW5kUGFyZW4pLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgIGV4cHIgPSB0aGlzLnBhcnNlKGVudHJpZXNbMF0sIGNvbnRleHQsIGJpbmRpbmdzKTtcbiAgICAgICAgICAgIGlmIChlbnRyaWVzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgIG5ld0V4cHIgPSBuZXcgZGVyaXZfZXhwcih0aGlzLCBleHByLCAneCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaXZhciA9IHRoaXMucGFyc2UoZW50cmllc1sxXSwgY29udGV4dCwgYmluZGluZ3MpO1xuICAgICAgICAgICAgICAvLyBEKGYoeCkseCxjKSBtZWFucyBmJyhjKVxuICAgICAgICAgICAgICBpZiAoZW50cmllcy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICAgICAgaXZhclZhbHVlID0gdGhpcy5wYXJzZShlbnRyaWVzWzJdLCBjb250ZXh0LCBiaW5kaW5ncyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbmV3RXhwciA9IG5ldyBkZXJpdl9leHByKHRoaXMsIGV4cHIsIGl2YXIsIGl2YXJWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBzdWJFeHByID0gdGhpcy5wYXJzZSh3b3JraW5nU3RyLnNsaWNlKGVuZFBvcysxLGVuZFBhcmVuKSwgY29udGV4dCwgYmluZGluZ3MpO1xuICAgICAgICAgICAgbmV3RXhwciA9IG5ldyBmdW5jdGlvbl9leHByKHRoaXMsIHRoZU5hbWUsIHN1YkV4cHIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvcGVyYW5kU3RhY2sucHVzaChuZXdFeHByKTtcbiAgICAgICAgICBuZXdFbGVtZW50ID0gMDtcbiAgICAgICAgICBjaGFyUG9zID0gZW5kUGFyZW47XG4gICAgICAgIH1cbiAgICAgICAgLy8gb3IgYSB2YXJpYWJsZS5cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgLy8gVGVzdCBpZiBuZWVkcyBpbmRleFxuICAgICAgICAgIGlmICh3b3JraW5nU3RyLmNoYXJBdChlbmRQb3MpID09ICdbJykge1xuICAgICAgICAgICAgdmFyIGVuZFBhcmVuLCBoYXNFcnJvcj1mYWxzZTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGVuZFBhcmVuID0gY29tcGxldGVCcmFja2V0KHdvcmtpbmdTdHIsIGVuZFBvcywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICBwYXJzZUVycm9yID0gZXJyb3I7XG4gICAgICAgICAgICAgIGhhc0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgZW5kUGFyZW4gPSBlbmRQb3MrMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBpbmRleEV4cHIgPSB0aGlzLnBhcnNlKHdvcmtpbmdTdHIuc2xpY2UoZW5kUG9zKzEsZW5kUGFyZW4pLCBjb250ZXh0LCBiaW5kaW5ncyk7XG4gICAgICAgICAgICB2YXIgbmV3RXhwciA9IG5ldyBpbmRleF9leHByKHRoaXMsIHRoZU5hbWUsIGluZGV4RXhwcik7XG4gICAgICAgICAgICBpZiAoaGFzRXJyb3IpIHtcbiAgICAgICAgICAgICAgbmV3RXhwci5zZXRQYXJzaW5nRXJyb3IocGFyc2VFcnJvcik7XG4gICAgICAgICAgICAgIHBhcnNlRXJyb3IgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3BlcmFuZFN0YWNrLnB1c2gobmV3RXhwcik7XG4gICAgICAgICAgICBuZXdFbGVtZW50ID0gMDtcbiAgICAgICAgICAgIGNoYXJQb3MgPSBlbmRQYXJlbjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG5ld0V4cHIgPSBuZXcgdmFyaWFibGVfZXhwcih0aGlzLCB0aGVOYW1lKTtcbiAgICAgICAgICAgIG9wZXJhbmRTdGFjay5wdXNoKG5ld0V4cHIpO1xuICAgICAgICAgICAgbmV3RWxlbWVudCA9IDA7XG4gICAgICAgICAgICBjaGFyUG9zID0gZW5kUG9zLTE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgIC8vIEl0IGNvdWxkIGJlIGFuIG9wZXJhdG9yLlxuICAgICAgfSBlbHNlIGlmICh3b3JraW5nU3RyLnN1YnN0cihjaGFyUG9zKS5zZWFyY2gob3BNYXRjaCkgPT0gMCkge1xuICAgICAgICBuZXdFbGVtZW50ID0gMTtcbiAgICAgICAgdmFyIG9wID0gd29ya2luZ1N0ci5jaGFyQXQoY2hhclBvcyk7XG4gICAgICAgIHZhciBuZXdPcCA9IG5ldyBvcGVyYXRvcihvcCk7XG5cbiAgICAgICAgLy8gQ29uc2VjdXRpdmUgb3BlcmF0b3JzPyAgICBCZXR0ZXIgYmUgc2lnbiBjaGFuZ2Ugb3IgcmVjaXByb2NhbC5cbiAgICAgICAgaWYgKGxhc3RFbGVtZW50ICE9IDApIHtcbiAgICAgICAgICBpZiAob3AgPT0gXCItXCIgfHwgb3AgPT0gXCIvXCIpIHtcbiAgICAgICAgICAgIG5ld09wLnR5cGUgPSBleHByVHlwZS51bm9wO1xuICAgICAgICAgICAgbmV3T3AucHJlYyA9IG9wUHJlYy5tdWx0ZGl2O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBFUlJPUiEhIVxuICAgICAgICAgICAgcGFyc2VFcnJvciA9IFwiRXJyb3I6IGNvbnNlY3V0aXZlIG9wZXJhdG9yc1wiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlT3BlcmF0b3IodGhpcywgb3BlcmF0b3JTdGFjaywgb3BlcmFuZFN0YWNrLCBuZXdPcCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFR3byBjb25zZWN1dGl2ZSBvcGVyYW5kcyBtdXN0IGhhdmUgYW4gaW1wbGljaXQgbXVsdGlwbGljYXRpb24gYmV0d2VlbiB0aGVtXG4gICAgICBpZiAobGFzdEVsZW1lbnQgPT0gMCAmJiBuZXdFbGVtZW50ID09IDApIHtcbiAgICAgICAgdmFyIGhvbGRFbGVtZW50ID0gb3BlcmFuZFN0YWNrLnBvcCgpO1xuXG4gICAgICAgIC8vIFB1c2ggYSBtdWx0aXBsaWNhdGlvblxuICAgICAgICB2YXIgbmV3T3AgPSBuZXcgb3BlcmF0b3IoJyonKTtcbiAgICAgICAgcmVzb2x2ZU9wZXJhdG9yKHRoaXMsIG9wZXJhdG9yU3RhY2ssIG9wZXJhbmRTdGFjaywgbmV3T3ApO1xuXG4gICAgICAgIC8vIFRoZW4gcmVzdG9yZSB0aGUgb3BlcmFuZCBzdGFjay5cbiAgICAgICAgb3BlcmFuZFN0YWNrLnB1c2goaG9sZEVsZW1lbnQpO1xuICAgICAgfVxuICAgICAgbGFzdEVsZW1lbnQgPSBuZXdFbGVtZW50O1xuICAgIH1cblxuICAgIC8vIE5vdyBmaW5pc2ggdXAgdGhlIG9wZXJhdG9yIHN0YWNrOiBub3RoaW5nIG5ldyB0byBpbmNsdWRlXG4gICAgcmVzb2x2ZU9wZXJhdG9yKHRoaXMsIG9wZXJhdG9yU3RhY2ssIG9wZXJhbmRTdGFjayk7XG4gICAgdmFyIGZpbmFsRXhwcmVzc2lvbiA9IG9wZXJhbmRTdGFjay5wb3AoKTtcbiAgICBpZiAocGFyc2VFcnJvci5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZpbmFsRXhwcmVzc2lvbi5zZXRQYXJzaW5nRXJyb3IocGFyc2VFcnJvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVGVzdCBpZiBjb250ZXh0IGlzIGNvbnNpc3RlbnRcbiAgICAgICAgc3dpdGNoIChjb250ZXh0KSB7XG4gICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgICAgIGlmICghZmluYWxFeHByZXNzaW9uLmlzQ29uc3RhbnQoKSkge1xuICAgICAgICAgICAgICAgICAgICAvL3Rocm93IFwiVGhlIGV4cHJlc3Npb24gc2hvdWxkIGJlIGEgY29uc3RhbnQgYnV0IGRlcGVuZHMgb24gdmFyaWFibGVzLlwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZpbmFsRXhwcmVzc2lvbiA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLCBmaW5hbEV4cHJlc3Npb24udmFsdWUoKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdmb3JtdWxhJzpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICAvL2ZpbmFsRXhwcmVzc2lvbi5zZXRDb250ZXh0KGNvbnRleHQpO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5kb0ZsYXR0ZW4pIHtcbiAgICAgIGZpbmFsRXhwcmVzc2lvbi5mbGF0dGVuKCk7XG4gICAgfVxuICAgIHJldHVybiBmaW5hbEV4cHJlc3Npb247XG4gIH1cbn1cblxuLy8gVXNlZCBpbiBwYXJzZVxuZnVuY3Rpb24gb3BlcmF0b3Iob3BTdHIpIHtcbiAgdGhpcy5vcCA9IG9wU3RyO1xuICBzd2l0Y2gob3BTdHIpIHtcbiAgICBjYXNlICcrJzpcbiAgICBjYXNlICctJzpcbiAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5hZGRzdWI7XG4gICAgICB0aGlzLnR5cGUgPSBleHByVHlwZS5iaW5vcDtcbiAgICAgIHRoaXMudmFsdWVUeXBlID0gZXhwclZhbHVlLm51bWVyaWM7XG4gICAgICBicmVhaztcbiAgICBjYXNlICcqJzpcbiAgICBjYXNlICcvJzpcbiAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5tdWx0ZGl2O1xuICAgICAgdGhpcy50eXBlID0gZXhwclR5cGUuYmlub3A7XG4gICAgICB0aGlzLnZhbHVlVHlwZSA9IGV4cHJWYWx1ZS5udW1lcmljO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnXic6XG4gICAgICB0aGlzLnByZWMgPSBvcFByZWMucG93ZXI7XG4gICAgICB0aGlzLnR5cGUgPSBleHByVHlwZS5iaW5vcDtcbiAgICAgIHRoaXMudmFsdWVUeXBlID0gZXhwclZhbHVlLm51bWVyaWM7XG4gICAgICBicmVhaztcbiAgICBjYXNlICcmJzpcbiAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5jb25qO1xuICAgICAgdGhpcy50eXBlID0gZXhwclR5cGUuYmlub3A7XG4gICAgICB0aGlzLnZhbHVlVHlwZSA9IGV4cHJWYWx1ZS5ib29sO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnJCc6ICAvLyAkPW9yIHNpbmNlIHw9YWJzb2x1dGUgdmFsdWUgYmFyXG4vLyAgICB0aGlzLm9wID0gJ3wnXG4gICAgICB0aGlzLnByZWMgPSBvcFByZWMuZGlzajtcbiAgICAgIHRoaXMudHlwZSA9IGV4cHJUeXBlLmJpbm9wO1xuICAgICAgdGhpcy52YWx1ZVR5cGUgPSBleHByVmFsdWUuYm9vbDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJz0nOlxuICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLmVxdWFsO1xuICAgICAgdGhpcy50eXBlID0gZXhwclR5cGUuYmlub3A7XG4gICAgICB0aGlzLnZhbHVlVHlwZSA9IGV4cHJWYWx1ZS5ib29sO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnLCc6XG4gICAgICB0aGlzLnByZWMgPSBvcFByZWMuZm9wO1xuICAgICAgdGhpcy50eXBlID0gZXhwclR5cGUuYXJyYXk7XG4gICAgICB0aGlzLnZhbHVlVHlwZSA9IGV4cHJWYWx1ZS52ZWN0b3I7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLmZjbjtcbiAgICAgIHRoaXMudHlwZSA9IGV4cHJUeXBlLmZjbjtcbiAgICAgIGJyZWFrO1xuICB9XG59XG5cbi8qIEFuIGFic29sdXRlIHZhbHVlIGNhbiBiZSBjb21wbGljYXRlZCBiZWNhdXNlIGFsc28gYSBmdW5jdGlvbi4gXG5NYXkgbm90IGJlIGNsZWFyIGlmIG5lc3RlZDogfDJ8eC0zfC0gNXwuXG5JcyB0aGF0IDJ4LTE1IG9yIGFicygyfHgtM3wtNSk/XG5SZXNvbHZlIGJ5IHJlcXVpcmluZyBleHBsaWNpdCBvcGVyYXRpb25zOiB8Mip8eC0zfC01fCBvciB8MnwqeC0zKnwtNXxcbiovXG5mdW5jdGlvbiBjb21wbGV0ZUFic1ZhbHVlKGZvcm11bGFTdHIsIHN0YXJ0UG9zKSB7XG4gIHZhciBwTGV2ZWwgPSAxO1xuICB2YXIgY2hhclBvcyA9IHN0YXJ0UG9zO1xuICB2YXIgd2FzT3AgPSB0cnVlOyAvLyBvcGVuIGFic29sdXRlIHZhbHVlIGltcGxpY2l0bHkgaGFzIHByZXZpb3VzIG9wZXJhdGlvbi5cblxuICB3aGlsZSAocExldmVsID4gMCAmJiBjaGFyUG9zIDwgZm9ybXVsYVN0ci5sZW5ndGgpIHtcbiAgICBjaGFyUG9zKys7XG4gICAgLy8gV2UgZW5jb3VudGVyIGFub3RoZXIgYWJzb2x1dGUgdmFsdWUuXG4gICAgaWYgKGZvcm11bGFTdHIuY2hhckF0KGNoYXJQb3MpID09ICd8Jykge1xuICAgICAgaWYgKHdhc09wKSB7IC8vIE11c3QgYmUgb3BlbmluZyBhIG5ldyBhYnNvbHV0ZSB2YWx1ZS5cbiAgICAgICAgcExldmVsKys7XG4gICAgICAgIC8vIHdhc09wIGlzIHN0aWxsIHRydWUgc2luY2UgY2FuJ3QgY2xvc2UgaW1tZWRpYXRlbHlcbiAgICAgIH0gZWxzZSB7ICAvLyBBc3N1bWUgY2xvc2luZyBhYnNvbHV0ZSB2YWx1ZS4gSWYgbm90IHdhbnRlZCwgbmVlZCBvcGVyYXRvci5cbiAgICAgICAgcExldmVsLS07XG4gICAgICAgIC8vIHdhc09wIGlzIHN0aWxsIGZhbHNlIHNpbmNlIGp1c3QgY2xvc2VkIGEgdmFsdWUuXG4gICAgICB9XG4gICAgLy8gS2VlcCB0cmFjayBvZiB3aGV0aGVyIGp1c3QgaGFkIG9wZXJhdG9yIG9yIG5vdC5cbiAgICB9IGVsc2UgaWYgKFwiKy0qLyhbXCIuc2VhcmNoKGZvcm11bGFTdHIuY2hhckF0KGNoYXJQb3MpKSA+PSAwKSB7XG4gICAgICB3YXNPcCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmb3JtdWxhU3RyLmNoYXJBdChjaGFyUG9zKSAhPSAnICcpIHtcbiAgICAgIHdhc09wID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybihjaGFyUG9zKTtcbn1cblxuLy8gRmluZCB0aGUgYmFsYW5jaW5nIGNsb3NpbmcgcGFyZW50aGVzaXMuXG5mdW5jdGlvbiBjb21wbGV0ZVBhcmVudGhlc2lzKGZvcm11bGFTdHIsIHN0YXJ0UG9zKSB7XG4gIHZhciBwTGV2ZWwgPSAxO1xuICB2YXIgY2hhclBvcyA9IHN0YXJ0UG9zO1xuXG4gIHdoaWxlIChwTGV2ZWwgPiAwICYmIGNoYXJQb3MgPCBmb3JtdWxhU3RyLmxlbmd0aCkge1xuICAgIGNoYXJQb3MrKztcbiAgICBpZiAoZm9ybXVsYVN0ci5jaGFyQXQoY2hhclBvcykgPT0gJyknKSB7XG4gICAgICBwTGV2ZWwtLTtcbiAgICB9IGVsc2UgaWYgKGZvcm11bGFTdHIuY2hhckF0KGNoYXJQb3MpID09ICcoJykge1xuICAgICAgcExldmVsKys7XG4gICAgfVxuICB9XG4gIHJldHVybihjaGFyUG9zKTtcbn1cblxuLy8gQnJhY2tldHMgYXJlIHVzZWQgZm9yIHNlcXVlbmNlIGluZGV4aW5nLCBub3QgcmVndWxhciBncm91cGluZy5cbmZ1bmN0aW9uIGNvbXBsZXRlQnJhY2tldChmb3JtdWxhU3RyLCBzdGFydFBvcywgYXNTdWJzY3JpcHQpIHtcbiAgdmFyIHBMZXZlbCA9IDE7XG4gIHZhciBjaGFyUG9zID0gc3RhcnRQb3M7XG4gIHZhciBmYWlsID0gZmFsc2U7XG5cbiAgd2hpbGUgKHBMZXZlbCA+IDAgJiYgY2hhclBvcyA8IGZvcm11bGFTdHIubGVuZ3RoKSB7XG4gICAgY2hhclBvcysrO1xuICAgIGlmIChmb3JtdWxhU3RyLmNoYXJBdChjaGFyUG9zKSA9PSAnXScpIHtcbiAgICAgICAgcExldmVsLS07XG4gICAgfSBlbHNlIGlmIChmb3JtdWxhU3RyLmNoYXJBdChjaGFyUG9zKSA9PSAnWycpIHtcbiAgICAgICAgaWYgKGFzU3Vic2NyaXB0KSB7XG4gICAgICAgICAgZmFpbCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcExldmVsKys7XG4gICAgfVxuICB9XG4gIGlmIChhc1N1YnNjcmlwdCAmJiBmYWlsKSB7XG4gICAgdGhyb3cgXCJOZXN0ZWQgYnJhY2tldHMgdXNlZCBmb3Igc3Vic2NyaXB0cyBhcmUgbm90IHN1cHBvcnRlZC5cIjtcbiAgfVxuICByZXR1cm4oY2hhclBvcyk7XG59XG5cbi8qIEdpdmVuIGEgc3RyaW5nIGFuZCBhIHN0YXJ0aW5nIHBvc2l0aW9uIG9mIGEgbmFtZSwgaWRlbnRpZnkgdGhlIGVudGlyZSBuYW1lLiAqL1xuLyogUmVxdWlyZSBzdGFydCB3aXRoIGxldHRlciwgdGhlbiBhbnkgc2VxdWVuY2Ugb2YgKndvcmQqIGNoYXJhY3RlciAqL1xuLyogQWxzbyBhbGxvdyBwcmltZXMgZm9yIGRlcml2YXRpdmVzIGF0IHRoZSBlbmQuICovXG5mdW5jdGlvbiBjb21wbGV0ZU5hbWUoZm9ybXVsYVN0ciwgc3RhcnRQb3MpIHtcbiAgdmFyIG1hdGNoUnVsZSA9IC9bQS1aYS16XVxcdyonKi87XG4gIHZhciBtYXRjaCA9IGZvcm11bGFTdHIuc3Vic3RyKHN0YXJ0UG9zKS5tYXRjaChtYXRjaFJ1bGUpO1xuICByZXR1cm4oc3RhcnRQb3MgKyBtYXRjaFswXS5sZW5ndGgpO1xufVxuXG4vKiBHaXZlbiBhIHN0cmluZyBhbmQgYSBzdGFydGluZyBwb3NpdGlvbiBvZiBhIG51bWJlciwgaWRlbnRpZnkgdGhlIGVudGlyZSBudW1iZXIuICovXG5mdW5jdGlvbiBjb21wbGV0ZU51bWJlcihmb3JtdWxhU3RyLCBzdGFydFBvcywgb3B0aW9ucykge1xuICB2YXIgbWF0Y2hSdWxlO1xuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLm5vRGVjaW1hbHMpIHtcbiAgICBtYXRjaFJ1bGUgPSAvWzAtOV0qLztcbiAgfSBlbHNlIHtcbiAgICBtYXRjaFJ1bGUgPSAvWzAtOV0qKFxcLlswLTldKik/KGUtP1swLTldKyk/LztcbiAgfVxuICB2YXIgbWF0Y2ggPSBmb3JtdWxhU3RyLnN1YnN0cihzdGFydFBvcykubWF0Y2gobWF0Y2hSdWxlKTtcbiAgcmV0dXJuKHN0YXJ0UG9zICsgbWF0Y2hbMF0ubGVuZ3RoKTtcbn1cblxuLyogVGVzdHMgYSBzdHJpbmcgdG8gc2VlIGlmIGl0IGNhbiBiZSBjb25zdHJ1Y3RlZCBhcyBhIGNvbmNhdGVudGF0aW9uIG9mIGtub3duIG5hbWVzLiAqL1xuLyogRm9yIGV4YW1wbGUsIGFiYyBjb3VsZCBiZSBhIG5hbWUgb3IgY291bGQgYmUgYSpiKmMgKi9cbi8qIFBhc3MgaW4gdGhlIGJpbmRpbmdzIGdpdmluZyB0aGUga25vd24gbmFtZXMgYW5kIHNlZSBpZiB3ZSBjYW4gYnVpbGQgdGhpcyBuYW1lICovXG4vKiBSZXR1cm4gdGhlICpmaXJzdCogbmFtZSB0aGF0IGlzIHBhcnQgb2YgdGhlIHdob2xlLiAqL1xuZnVuY3Rpb24gVGVzdE5hbWVJc0NvbXBvc2l0ZSh0ZXh0LCBiaW5kaW5ncykge1xuICB2YXIgcmV0U3RydWN0ID0gbmV3IE9iamVjdCgpO1xuICByZXRTdHJ1Y3QuaXNDb21wb3NpdGUgPSBmYWxzZTtcblxuICBpZiAoYmluZGluZ3MgIT09IHVuZGVmaW5lZCkge1xuICAgIHZhciByZW1haW4sIG5leHROYW1lO1xuICAgIGlmIChiaW5kaW5nc1t0ZXh0XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXRTdHJ1Y3QuaXNDb21wb3NpdGUgPSB0cnVlO1xuICAgICAgcmV0U3RydWN0Lm5hbWUgPSB0ZXh0O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTZWUgaWYgdGhlIHRleHQgKnN0YXJ0cyogd2l0aCBhIGtub3duIG5hbWVcbiAgICAgIHZhciBrbm93bk5hbWVzID0gT2JqZWN0LmtleXMoYmluZGluZ3MpO1xuICAgICAgZm9yICh2YXIgaWtleSBpbiBrbm93bk5hbWVzKSB7XG4gICAgICAgIG5leHROYW1lID0ga25vd25OYW1lc1tpa2V5XTtcbiAgICAgICAgLy8gSWYgKnRoaXMqIG5hbWUgaXMgdGhlIHN0YXJ0IG9mIHRoZSB0ZXh0LCBzZWUgaWYgdGhlIHJlc3QgZnJvbSBrbm93biBuYW1lcy5cbiAgICAgICAgaWYgKHRleHQuc2VhcmNoKG5leHROYW1lKT09MCkge1xuICAgICAgICAgIHJlbWFpbiA9IFRlc3ROYW1lSXNDb21wb3NpdGUodGV4dC5zbGljZShuZXh0TmFtZS5sZW5ndGgpLCBiaW5kaW5ncyk7XG4gICAgICAgICAgaWYgKHJlbWFpbi5pc0NvbXBvc2l0ZSkge1xuICAgICAgICAgICAgcmV0U3RydWN0LmlzQ29tcG9zaXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldFN0cnVjdC5uYW1lID0gbmV4dE5hbWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJldFN0cnVjdDtcbn1cbiIsIi8qIVxuICogQlRNIEphdmFTY3JpcHQgTGlicmFyeSB2QFZFUlNJT05cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kYnJpYW53YWx0b24vQlRNXG4gKlxuICogQ29weXJpZ2h0IEQuIEJyaWFuIFdhbHRvblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIChodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVClcbiAqXG4gKiBEYXRlOiBAREFURVxuICovXG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBEZWZpbmUgdGhlIEJpbmFyeSBFeHByZXNzaW9uIC0tIGRlZmluZWQgYnkgYW4gb3BlcmF0b3IgYW5kIHR3byBpbnB1dHMuXG4qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5pbXBvcnQgeyBCVE0sIG9wUHJlYywgZXhwclR5cGUsIGV4cHJWYWx1ZSB9IGZyb20gXCIuL0JUTV9yb290LmpzXCJcbmltcG9ydCB7IGV4cHJlc3Npb24gfSBmcm9tIFwiLi9leHByZXNzaW9uLmpzXCJcbmltcG9ydCB7IHNjYWxhcl9leHByIH0gZnJvbSBcIi4vc2NhbGFyX2V4cHIuanNcIlxuaW1wb3J0IHsgdW5vcF9leHByIH0gZnJvbSBcIi4vdW5vcF9leHByLmpzXCJcblxuZXhwb3J0IGNsYXNzIGJpbm9wX2V4cHIgZXh0ZW5kcyBleHByZXNzaW9uIHtcbiAgICBjb25zdHJ1Y3RvcihidG0sIG9wLCBpbnB1dEEsIGlucHV0Qikge1xuICAgICAgICBzdXBlcihidG0pO1xuICAgICAgICB0aGlzLnR5cGUgPSBleHByVHlwZS5iaW5vcDtcbiAgICAgICAgdGhpcy5vcCA9IG9wO1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0QSA9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIGlucHV0QSA9IG5ldyBleHByZXNzaW9uKHRoaXMuYnRtKTtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dEIgPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICBpbnB1dEIgPSBuZXcgZXhwcmVzc2lvbih0aGlzLmJ0bSk7XG4gICAgICAgIHRoaXMuaW5wdXRzID0gW2lucHV0QSwgaW5wdXRCXTtcbiAgICAgICAgICAgIGlucHV0QS5wYXJlbnQgPSB0aGlzO1xuICAgICAgICAgICAgaW5wdXRCLnBhcmVudCA9IHRoaXM7XG5cbiAgICAgICAgc3dpdGNoIChvcCkge1xuICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICB0aGlzLnByZWMgPSBvcFByZWMuYWRkc3ViO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICB0aGlzLnByZWMgPSBvcFByZWMubXVsdGRpdjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgICAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5wb3dlcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyYnOlxuICAgICAgICAgICAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5jb25qO1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVUeXBlID0gZXhwclZhbHVlLmJvb2w7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICckJzpcbiAgICAgICAgICAgICAgICB0aGlzLnByZWMgPSBvcFByZWMuZGlzajtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlVHlwZSA9IGV4cHJWYWx1ZS5ib29sO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnPSc6XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLmVxdWFsO1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVUeXBlID0gZXhwclZhbHVlLmJvb2w7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5rbm93biBiaW5hcnkgb3BlcmF0b3I6ICdcIitvcCtcIicuXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHZhciB0aGVTdHI7XG4gICAgICAgIHZhciBvcEFTdHIsIG9wQlN0cjtcbiAgICAgICAgdmFyIGlzRXJyb3IgPSBmYWxzZTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaW5wdXRzWzBdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBvcEFTdHIgPSAnPyc7XG4gICAgICAgICAgICBpc0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9wQVN0ciA9IHRoaXMuaW5wdXRzWzBdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBpZiAoKHRoaXMuaW5wdXRzWzBdLnR5cGUgPj0gZXhwclR5cGUudW5vcFxuICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1swXS5wcmVjIDwgdGhpcy5wcmVjKVxuICAgICAgICAgICAgICAgIHx8ICh0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICAgICAmJiBvcEFTdHIuaW5kZXhPZihcIi9cIikgPj0gMFxuICAgICAgICAgICAgICAgICAgICAmJiBvcFByZWMubXVsdGRpdiA8PSB0aGlzLnByZWMpXG4gICAgICAgICAgICAgICAgKSBcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBvcEFTdHIgPSAnKCcgKyBvcEFTdHIgKyAnKSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0c1sxXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb3BCU3RyID0gJz8nO1xuICAgICAgICAgICAgaXNFcnJvciA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcEJTdHIgPSB0aGlzLmlucHV0c1sxXS50b1N0cmluZygpO1xuICAgICAgICAgICAgaWYgKCh0aGlzLmlucHV0c1sxXS50eXBlID49IGV4cHJUeXBlLnVub3BcbiAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbMV0ucHJlYyA8PSB0aGlzLnByZWMpXG4gICAgICAgICAgICAgICAgfHwgKHRoaXMuaW5wdXRzWzFdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICYmIG9wQlN0ci5pbmRleE9mKFwiL1wiKSA+PSAwXG4gICAgICAgICAgICAgICAgICAgICYmIG9wUHJlYy5tdWx0ZGl2IDw9IHRoaXMucHJlYylcbiAgICAgICAgICAgICAgICApIFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG9wQlN0ciA9ICcoJyArIG9wQlN0ciArICcpJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0aGVPcCA9IHRoaXMub3A7XG4gICAgICAgIGlmICh0aGVPcCA9PSAnfCcpIHtcbiAgICAgICAgICAgIHRoZU9wID0gJyAkICc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGVTdHIgPSBvcEFTdHIgKyB0aGVPcCArIG9wQlN0cjtcbiAgICAgICAgcmV0dXJuKHRoZVN0cik7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRlc3RlZCBlcXVpdmFsZW50IHN0cmluZ3MuXG4gICAgYWxsU3RyaW5nRXF1aXZzKCkge1xuICAgICAgICB2YXIgYWxsSW5wdXRzQSA9IHRoaXMuaW5wdXRzWzBdLmFsbFN0cmluZ0VxdWl2cygpLFxuICAgICAgICAgICAgYWxsSW5wdXRzQiA9IHRoaXMuaW5wdXRzWzFdLmFsbFN0cmluZ0VxdWl2cygpO1xuXG4gICAgICAgIHZhciByZXRWYWx1ZSA9IFtdO1xuXG4gICAgICAgIHZhciB0aGVPcCA9IHRoaXMub3A7XG4gICAgICAgIGlmICh0aGVPcCA9PSAnfCcpIHtcbiAgICAgICAgICAgIHRoZU9wID0gJyAkICc7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpIGluIGFsbElucHV0c0EpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogaW4gYWxsSW5wdXRzQikge1xuICAgICAgICAgICAgICAgIG9wQVN0ciA9IGFsbElucHV0c0FbaV07XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzWzBdLnR5cGUgPj0gZXhwclR5cGUudW5vcCAmJiB0aGlzLmlucHV0c1swXS5wcmVjIDwgdGhpcy5wcmVjKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wQVN0ciA9ICcoJyArIG9wQVN0ciArICcpJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3BCU3RyID0gYWxsSW5wdXRzQltqXTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbMV0udHlwZSA+PSBleHByVHlwZS51bm9wICYmIHRoaXMuaW5wdXRzWzFdLnByZWMgPD0gdGhpcy5wcmVjKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wQlN0ciA9ICcoJyArIG9wQlN0ciArICcpJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXRWYWx1ZS5wdXNoKG9wQVN0ciArIHRoZU9wICsgb3BCU3RyKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wID09ICcrJyB8fCB0aGlzLm9wID09ICcqJyB8fCB0aGlzLm9wID09ICcmJyB8fCB0aGlzLm9wID09ICckJykge1xuICAgICAgICAgICAgICAgICAgICBvcEJTdHIgPSBhbGxJbnB1dHNCW2pdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbMV0udHlwZSA+PSBleHByVHlwZS51bm9wICYmIHRoaXMuaW5wdXRzWzFdLnByZWMgPCB0aGlzLnByZWMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wQlN0ciA9ICcoJyArIG9wQlN0ciArICcpJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBvcEFTdHIgPSBhbGxJbnB1dHNBW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbMF0udHlwZSA+PSBleHByVHlwZS51bm9wICYmIHRoaXMuaW5wdXRzWzBdLnByZWMgPD0gdGhpcy5wcmVjKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcEFTdHIgPSAnKCcgKyBvcEFTdHIgKyAnKSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsdWUucHVzaChvcEJTdHIgKyB0aGVPcCArIG9wQVN0cik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKHJldFZhbHVlKTtcbiAgICB9XG5cbiAgICB0b1RlWChzaG93U2VsZWN0KSB7XG4gICAgICAgIHZhciB0aGVTdHI7XG4gICAgICAgIHZhciB0aGVPcDtcbiAgICAgICAgdmFyIG9wQVN0ciwgb3BCU3RyO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygc2hvd1NlbGVjdCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgc2hvd1NlbGVjdCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0c1swXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb3BBU3RyID0gJz8nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3BBU3RyID0gdGhpcy5pbnB1dHNbMF0udG9UZVgoc2hvd1NlbGVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0c1sxXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb3BCU3RyID0gJz8nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3BCU3RyID0gdGhpcy5pbnB1dHNbMV0udG9UZVgoc2hvd1NlbGVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhlT3AgPSB0aGlzLm9wO1xuICAgICAgICBpZiAoc2hvd1NlbGVjdCAmJiB0aGlzLnNlbGVjdCkge1xuICAgICAgICAgICAgc3dpdGNoICh0aGVPcCkge1xuICAgICAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgICAgICB0aGVPcCA9ICdcXFxcY2RvdCAnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICAgICAgdGhlT3AgPSAnXFxcXGRpdiAnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICAgICAgICAgICAgdGhlT3AgPSAnXFxcXHdlZGdlICc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3wnOlxuICAgICAgICAgICAgICAgICAgICB0aGVPcCA9ICdcXFxcaGJveHsgb3IgfSc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJyQnOlxuICAgICAgICAgICAgICAgICAgICB0aGVPcCA9ICdcXFxcaGJveHsgb3IgfSc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJyYnOlxuICAgICAgICAgICAgICAgICAgICB0aGVPcCA9ICdcXFxcaGJveHsgYW5kIH0nO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhlT3ApIHtcbiAgICAgICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzWzFdICYmIHRoaXMuaW5wdXRzWzFdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVPcCA9ICdcXFxcY2RvdCAnO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW5wdXRzWzFdICYmIHRoaXMuaW5wdXRzWzFdLnR5cGUgPT0gZXhwclR5cGUuYmlub3BcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbMV0ub3A9PSdeJyAmJiB0aGlzLmlucHV0c1sxXS5pbnB1dHNbMF0udHlwZT09ZXhwclR5cGUubnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVPcCA9ICdcXFxcY2RvdCAnO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlT3AgPSAnICc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnfCc6XG4gICAgICAgICAgICAgICAgICAgIHRoZU9wID0gJ1xcXFxoYm94eyBvciB9JztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnJCc6XG4gICAgICAgICAgICAgICAgICAgIHRoZU9wID0gJ1xcXFxoYm94eyBvciB9JztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnJic6XG4gICAgICAgICAgICAgICAgICAgIHRoZU9wID0gJ1xcXFxoYm94eyBhbmQgfSc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGVPcCA9PSAnLycpIHtcbiAgICAgICAgICAgIHRoZVN0ciA9ICdcXFxcZnJhY3snICsgb3BBU3RyICsgJ317JyArIG9wQlN0ciArICd9JztcbiAgICAgICAgfSBlbHNlIGlmICh0aGVPcCA9PSAnXicpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1swXSAmJiB0aGlzLmlucHV0c1swXS50eXBlID49IGV4cHJUeXBlLmZjbikge1xuICAgICAgICAgICAgICAgIHRoZVN0ciA9ICdcXFxcbGVmdCgnICsgb3BBU3RyICsgJ1xcXFxyaWdodCknO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGVTdHIgPSBvcEFTdHI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGVTdHIgKz0gdGhlT3AgKyAneycgKyBvcEJTdHIgKyAnfSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgYXJnU3RyTD0nJywgYXJnU3RyUj0nJywgb3BTdHJMPScnLCBvcFN0clI9Jyc7XG5cbiAgICAgICAgICAgIGlmIChzaG93U2VsZWN0ICYmIHRoaXMuc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgYXJnU3RyTCA9ICd7XFxcXGNvbG9ye2JsdWV9JztcbiAgICAgICAgICAgICAgICBhcmdTdHJSID0gJ30nO1xuICAgICAgICAgICAgICAgIG9wU3RyTCA9ICd7XFxcXGNvbG9ye3JlZH0nO1xuICAgICAgICAgICAgICAgIG9wU3RyUiA9ICd9JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1swXSAmJiB0aGlzLmlucHV0c1swXS50eXBlID49IGV4cHJUeXBlLnVub3AgJiYgdGhpcy5pbnB1dHNbMF0ucHJlYyA8IHRoaXMucHJlYykge1xuICAgICAgICAgICAgICAgIHRoZVN0ciA9ICdcXFxcbGVmdCgnICsgYXJnU3RyTCArIG9wQVN0ciArIGFyZ1N0clIgKyAnXFxcXHJpZ2h0KSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoZVN0ciA9IGFyZ1N0ckwgKyBvcEFTdHIgKyBhcmdTdHJSO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhlU3RyICs9IG9wU3RyTCArIHRoZU9wICsgb3BTdHJSO1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzWzFdICYmIHRoaXMuaW5wdXRzWzFdLnR5cGUgPj0gZXhwclR5cGUudW5vcCAmJiB0aGlzLmlucHV0c1sxXS5wcmVjIDw9IHRoaXMucHJlYykge1xuICAgICAgICAgICAgICAgIHRoZVN0ciArPSAnXFxcXGxlZnQoJyArIGFyZ1N0ckwgKyBvcEJTdHIgKyBhcmdTdHJSICsgJ1xcXFxyaWdodCknO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGVTdHIgKz0gYXJnU3RyTCArIG9wQlN0ciArIGFyZ1N0clI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNob3dTZWxlY3QgJiYgdGhpcy5zZWxlY3QpIHtcbiAgICAgICAgICB0aGVTdHIgPSBcIntcXFxcY29sb3J7cmVkfVxcXFxib3hlZHtcIiArIHRoZVN0ciArIFwifX1cIjtcbiAgICAgICAgfVxuICAgICAgICB0aGVTdHIgPSB0aGVTdHIucmVwbGFjZSgvXFwrLS9nLCAnLScpO1xuICAgICAgICByZXR1cm4odGhlU3RyKTtcbiAgICB9XG5cbiAgICB0b01hdGhNTCgpIHtcbiAgICAgICAgdmFyIHRoZVN0cjtcbiAgICAgICAgdmFyIHRoZU9wO1xuICAgICAgICB2YXIgb3BBU3RyLCBvcEJTdHI7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0c1swXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb3BBU3RyID0gJz8nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3BBU3RyID0gdGhpcy5pbnB1dHNbMF0udG9NYXRoTUwoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaW5wdXRzWzFdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBvcEJTdHIgPSAnPyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcEJTdHIgPSB0aGlzLmlucHV0c1sxXS50b01hdGhNTCgpO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAodGhpcy5vcCkge1xuICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgdGhlT3AgPSBcIjxwbHVzLz5cIlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgdGhlT3AgPSBcIjxtaW51cy8+XCJcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgIHRoZU9wID0gXCI8dGltZXMvPlwiXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICB0aGVPcCA9IFwiPGRpdmlkZS8+XCJcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgICAgICAgIHRoZU9wID0gXCI8cG93ZXIvPlwiXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgdGhlU3RyID0gXCI8YXBwbHk+XCIgKyB0aGVPcCArIG9wQVN0ciArIG9wQlN0ciArIFwiPC9hcHBseT5cIjtcblxuICAgICAgICByZXR1cm4odGhlU3RyKTtcbiAgICB9XG5cbiAgICBvcGVyYXRlVG9UZVgoKSB7XG4gICAgICAgIHZhciBvcFN0cmluZyA9IHRoaXMub3A7XG5cbiAgICAgICAgc3dpdGNoIChvcFN0cmluZykge1xuICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgb3BTdHJpbmcgPSAnXFxcXHRpbWVzICc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICBvcFN0cmluZyA9ICdcXFxcZGl2ICc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICAgICAgICBvcFN0cmluZyA9ICdcXFxcd2VkZ2UgJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3wnOlxuICAgICAgICAgICAgICAgIG9wU3RyaW5nID0gJ1xcXFxoYm94eyBvciB9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyQnOlxuICAgICAgICAgICAgICAgIG9wU3RyaW5nID0gJ1xcXFxoYm94eyBvciB9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyYnOlxuICAgICAgICAgICAgICAgIG9wU3RyaW5nID0gJ1xcXFxoYm94eyBhbmQgfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ob3BTdHJpbmcpO1xuICAgIH1cblxuICAgIGlzQ29tbXV0YXRpdmUoKSB7XG4gICAgICAgIHZhciBjb21tdXRlcyA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5vcCA9PT0gJysnIHx8IHRoaXMub3AgPT09ICcqJykge1xuICAgICAgICAgICAgY29tbXV0ZXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihjb21tdXRlcyk7XG4gICAgfVxuXG4gICAgZXZhbHVhdGUoYmluZGluZ3MpIHtcbiAgICAgICAgdmFyIGlucHV0QVZhbCA9IHRoaXMuaW5wdXRzWzBdLmV2YWx1YXRlKGJpbmRpbmdzKTtcbiAgICAgICAgdmFyIGlucHV0QlZhbCA9IHRoaXMuaW5wdXRzWzFdLmV2YWx1YXRlKGJpbmRpbmdzKTtcblxuICAgICAgICBpZiAoaW5wdXRBVmFsID09IHVuZGVmaW5lZCB8fCBpbnB1dEJWYWwgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4odW5kZWZpbmVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXRWYWwgPSB1bmRlZmluZWQ7XG4gICAgICAgIHN3aXRjaCAodGhpcy5vcCkge1xuICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gaW5wdXRBVmFsICsgaW5wdXRCVmFsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gaW5wdXRBVmFsIC0gaW5wdXRCVmFsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gaW5wdXRBVmFsICogaW5wdXRCVmFsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gaW5wdXRBVmFsIC8gaW5wdXRCVmFsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnXic6XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlucHV0c1sxXS5pc0NvbnN0YW50KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5leHAoaW5wdXRCVmFsICogTWF0aC5sb2coaW5wdXRBVmFsKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0QVZhbCA+PSAwIHx8IChpbnB1dEJWYWwgJSAxID09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLnBvdyhpbnB1dEFWYWwsaW5wdXRCVmFsKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGguZXhwKGlucHV0QlZhbCAqIE1hdGgubG9nKGlucHV0QVZhbCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnPSc6XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gKE1hdGguYWJzKGlucHV0QVZhbCAtIGlucHV0QlZhbCkgPCB0aGlzLmJ0bS5vcHRpb25zLmFic1RvbCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcmJzpcbiAgICAgICAgICAgICAgICByZXRWYWwgPSBpbnB1dEFWYWwgJiYgaW5wdXRCVmFsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnfCc6XG4gICAgICAgICAgICBjYXNlICckJzpcbiAgICAgICAgICAgICAgICByZXRWYWwgPSBpbnB1dEFWYWwgfHwgaW5wdXRCVmFsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZSBiaW5hcnkgb3BlcmF0b3IgJ1wiICsgdGhpcy5vcCArIFwiJyBpcyBub3QgZGVmaW5lZC5cIik7XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWwpO1xuICAgIH1cblxuICAgIC8vIFNlZSBpZiB0aGlzIG9wZXJhdG9yIGlzIG5vdyByZWR1bmRhbnQuXG4gICAgLy8gUmV0dXJuIHRoZSByZXN1bHRpbmcgZXhwcmVzc2lvbi5cbiAgICByZWR1Y2UoKSB7XG4gICAgICAgIHZhciBuZXdFeHByID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMuaW5wdXRzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBTdW0gd2l0aCBubyBlbGVtZW50cyA9IDBcbiAgICAgICAgICAgICAgICAvLyBQcm9kdWN0IHdpdGggbm8gZWxlbWVudHMgPSAxXG4gICAgICAgICAgICAgICAgbmV3RXhwciA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgdGhpcy5vcCA9PSAnKycgPyAwIDogMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFN1bSBvciBwcm9kdWN0IHdpdGggb25lIGVsZW1lbnQgKmlzKiB0aGF0IGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgbmV3RXhwciA9IHRoaXMuaW5wdXRzWzBdLnJlZHVjZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV3RXhwci5wYXJlbnQgPSB0aGlzLnBhcmVudDtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LmlucHV0U3Vic3QodGhpcywgbmV3RXhwcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKG5ld0V4cHIpO1xuICAgIH1cblxuICAgIHNpbXBsaWZ5Q29uc3RhbnRzKCkge1xuICAgICAgICB2YXIgcmV0VmFsID0gdGhpcztcbiAgICAgICAgdGhpcy5pbnB1dHNbMF0gPSB0aGlzLmlucHV0c1swXS5zaW1wbGlmeUNvbnN0YW50cygpO1xuICAgICAgICB0aGlzLmlucHV0c1swXS5wYXJlbnQgPSB0aGlzO1xuICAgICAgICB0aGlzLmlucHV0c1sxXSA9IHRoaXMuaW5wdXRzWzFdLnNpbXBsaWZ5Q29uc3RhbnRzKCk7XG4gICAgICAgIHRoaXMuaW5wdXRzWzFdLnBhcmVudCA9IHRoaXM7XG4gICAgICAgIGlmICgodGhpcy5pbnB1dHNbMF0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICB8fCAodGhpcy5pbnB1dHNbMF0udHlwZSA9PSBleHByVHlwZS51bm9wICYmIHRoaXMuaW5wdXRzWzBdLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLm51bWJlcilcbiAgICAgICAgICAgICkgJiZcbiAgICAgICAgICAgICh0aGlzLmlucHV0c1sxXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgIHx8ICh0aGlzLmlucHV0c1sxXS50eXBlID09IGV4cHJUeXBlLnVub3AgJiYgdGhpcy5pbnB1dHNbMV0uaW5wdXRzWzBdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyKVxuICAgICAgICAgICAgKSlcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIG51bUEsIG51bUIsIHRoZU51bWJlcjtcbiAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLm51bWJlcikge1xuICAgICAgICAgICAgICAgIG51bUEgPSB0aGlzLmlucHV0c1swXS5udW1iZXI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5pbnB1dHNbMF0ub3ApIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBudW1BID0gdGhpcy5pbnB1dHNbMF0uaW5wdXRzWzBdLm51bWJlci5hZGRJbnZlcnNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBudW1BID0gdGhpcy5pbnB1dHNbMF0uaW5wdXRzWzBdLm51bWJlci5tdWx0SW52ZXJzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzWzFdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgbnVtQiA9IHRoaXMuaW5wdXRzWzFdLm51bWJlcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmlucHV0c1sxXS5vcCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bUIgPSB0aGlzLmlucHV0c1sxXS5pbnB1dHNbMF0ubnVtYmVyLmFkZEludmVyc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bUIgPSB0aGlzLmlucHV0c1sxXS5pbnB1dHNbMF0ubnVtYmVyLm11bHRJbnZlcnNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICAgICAgdGhlTnVtYmVyID0gbnVtQS5hZGQobnVtQik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgICAgICB0aGVOdW1iZXIgPSBudW1BLnN1YnRyYWN0KG51bUIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICAgICAgdGhlTnVtYmVyID0gbnVtQS5tdWx0aXBseShudW1CKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgICAgIHRoZU51bWJlciA9IG51bUEuZGl2aWRlKG51bUIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICAgICAgICAgICAgLy8gSW50ZWdlciBwb3dlcnMgb2YgYSByYXRpb25hbCBudW1iZXIgY2FuIGJlIHJlcHJlc2VudGVkIGV4YWN0bHkuXG4gICAgICAgICAgICAgICAgICAgIGlmIChudW1BIGluc3RhbmNlb2YgcmF0aW9uYWxfbnVtYmVyICYmIG51bUIgaW5zdGFuY2VvZiByYXRpb25hbF9udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBudW1CLnEgPT0gMSAmJiBudW1CLnAgJSAxID09IDAgJiYgbnVtQi5wID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlTnVtYmVyID0gbmV3IHJhdGlvbmFsX251bWJlcihNYXRoLnBvdyhudW1BLnAsIG51bUIucCksIE1hdGgucG93KG51bUEucSwgbnVtQi5wKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhlTnVtYmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYnRtLm9wdGlvbnMubmVnYXRpdmVOdW1iZXJzICYmIHRoZU51bWJlci5wIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBuZXcgdW5vcF9leHByKHRoaXMuYnRtLCAnLScsIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgdGhlTnVtYmVyLm11bHRpcGx5KC0xKSkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgdGhlTnVtYmVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICAgICAgLy8gU2ltcGxpZnkgMCthXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzWzBdLm51bWJlci52YWx1ZSgpPT0wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSB0aGlzLmlucHV0c1sxXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBTaW1wbGlmeSBhKzBcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5pbnB1dHNbMV0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1sxXS5udW1iZXIudmFsdWUoKSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSB0aGlzLmlucHV0c1swXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICAgICAgLy8gU2ltcGxpZnkgMC1hXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzWzBdLm51bWJlci52YWx1ZSgpPT0wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBuZXcgdW5vcF9leHByKHRoaXMuYnRtLCBcIi1cIiwgdGhpcy5pbnB1dHNbMV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbXBsaWZ5IGEtMFxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLmlucHV0c1sxXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzWzFdLm51bWJlci52YWx1ZSgpID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IHRoaXMuaW5wdXRzWzBdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgICAgICAvLyBTaW1wbGlmeSAxKmFcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzWzBdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbMF0ubnVtYmVyLnZhbHVlKCk9PTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IHRoaXMuaW5wdXRzWzFdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbXBsaWZ5IGEqMVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLmlucHV0c1sxXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzWzFdLm51bWJlci52YWx1ZSgpID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IHRoaXMuaW5wdXRzWzBdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgICAgICAgICAgICAvLyBTaW1wbGlmeSAxL2EgdG8gdW5hcnkgb3BlcmF0b3Igb2YgbXVsdGlwbGljYXRpdmUgaW52ZXJzZS5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzWzBdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbMF0ubnVtYmVyLnZhbHVlKCk9PTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IG5ldyB1bm9wX2V4cHIodGhpcy5idG0sIFwiL1wiLCB0aGlzLmlucHV0c1sxXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gU2ltcGxpZnkgYS8xXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuaW5wdXRzWzFdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbMV0ubnVtYmVyLnZhbHVlKCkgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gdGhpcy5pbnB1dHNbMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnXic6XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbXBsaWZ5IDBecFxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbMF0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1swXS5udW1iZXIudmFsdWUoKT09MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBTaW1wbGlmeSAxXnBcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5pbnB1dHNbMF0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1swXS5udW1iZXIudmFsdWUoKSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbXBsaWZ5IHBeMVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLmlucHV0c1sxXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzWzFdLm51bWJlci52YWx1ZSgpID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IHRoaXMuaW5wdXRzWzBdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWwpO1xuICAgIH1cblxuICAgIGZsYXR0ZW4oKSB7XG4gICAgICAgIHZhciBpbkEgPSB0aGlzLmlucHV0c1swXS5mbGF0dGVuKCk7XG4gICAgICAgIHZhciBpbkIgPSB0aGlzLmlucHV0c1sxXS5mbGF0dGVuKCk7XG5cbiAgICAgICAgdmFyIHJldFZhbDtcbiAgICAgICAgc3dpdGNoICh0aGlzLm9wKSB7XG4gICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgIHZhciBpbnB1dHMgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAoKGluQS50eXBlID09IGV4cHJUeXBlLm11bHRpb3AgfHwgaW5BLnR5cGUgPT0gZXhwclR5cGUuYmlub3ApXG4gICAgICAgICAgICAgICAgICAgICYmIChpbkEub3AgPT0gJysnIHx8IGluQS5vcCA9PSAnLScpKSBcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdJbnB1dCA9IGluQS5mbGF0dGVuKCk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gbmV3SW5wdXQuaW5wdXRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dHMucHVzaChuZXdJbnB1dC5pbnB1dHNbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzLnB1c2goaW5BKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKChpbkIudHlwZSA9PSBleHByVHlwZS5tdWx0aW9wIHx8IGluQi50eXBlID09IGV4cHJUeXBlLmJpbm9wKVxuICAgICAgICAgICAgICAgICAgICAmJiAoaW5CLm9wID09ICcrJyB8fCBpbkIub3AgPT0gJy0nKSkgXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3SW5wdXQgPSBpbkIuZmxhdHRlbigpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG5ld0lucHV0LmlucHV0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzLnB1c2gobmV3SW5wdXQuaW5wdXRzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wID09ICctJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChpbkIudHlwZSA9PSBleHByVHlwZS5tdWx0aW9wIHx8IGluQi50eXBlID09IGV4cHJUeXBlLmJpbm9wKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIChpbkIub3AgPT0gJysnIHx8IGluQi5vcCA9PSAnLScpKSBcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3SW5wdXQgPSBpbkIuZmxhdHRlbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gbmV3SW5wdXQuaW5wdXRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKG5ldyB1bm9wX2V4cHIodGhpcy5idG0sICctJyxuZXdJbnB1dC5pbnB1dHNbaV0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKG5ldyB1bm9wX2V4cHIodGhpcy5idG0sICctJyxpbkIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKGluQik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gbmV3IG11bHRpb3BfZXhwcih0aGlzLmJ0bSwgJysnLCBpbnB1dHMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXRzID0gW107XG4gICAgICAgICAgICAgICAgaWYgKChpbkEudHlwZSA9PSBleHByVHlwZS5tdWx0aW9wIHx8IGluQS50eXBlID09IGV4cHJUeXBlLmJpbm9wKVxuICAgICAgICAgICAgICAgICAgICAmJiAoaW5BLm9wID09ICcqJyB8fCBpbkEub3AgPT0gJy8nKSkgXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3SW5wdXQgPSBpbkEuZmxhdHRlbigpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG5ld0lucHV0LmlucHV0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzLnB1c2gobmV3SW5wdXQuaW5wdXRzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKGluQSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgoaW5CLnR5cGUgPT0gZXhwclR5cGUubXVsdGlvcCB8fCBpbkIudHlwZSA9PSBleHByVHlwZS5iaW5vcClcbiAgICAgICAgICAgICAgICAgICAgJiYgKGluQi5vcCA9PSAnKicgfHwgaW5CLm9wID09ICcvJykpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3SW5wdXQgPSBpbkIuZmxhdHRlbigpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG5ld0lucHV0LmlucHV0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzLnB1c2gobmV3SW5wdXQuaW5wdXRzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wID09ICcvJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChpbkIudHlwZSA9PSBleHByVHlwZS5tdWx0aW9wIHx8IGluQi50eXBlID09IGV4cHJUeXBlLmJpbm9wKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIChpbkIub3AgPT0gJyonIHx8IGluQi5vcCA9PSAnLycpKSBcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3SW5wdXQgPSBpbkIuZmxhdHRlbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gbmV3SW5wdXQuaW5wdXRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKG5ldyB1bm9wX2V4cHIodGhpcy5idG0sICcvJyxuZXdJbnB1dC5pbnB1dHNbaV0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKG5ldyB1bm9wX2V4cHIodGhpcy5idG0sICcvJyxpbkIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKGluQik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gbmV3IG11bHRpb3BfZXhwcih0aGlzLmJ0bSwgJyonLCBpbnB1dHMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXRWYWwgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgdGhpcy5vcCwgaW5BLCBpbkIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWwpO1xuICAgIH1cblxuICAgIGNvcHkoKSB7XG4gICAgICB2YXIgaW5BID0gdGhpcy5pbnB1dHNbMF0uY29weSgpO1xuICAgICAgdmFyIGluQiA9IHRoaXMuaW5wdXRzWzFdLmNvcHkoKTtcbiAgICAgIHJldHVybiAobmV3IGJpbm9wX2V4cHIodGhpcy5idG0sIHRoaXMub3AsIGluQSwgaW5CKSk7XG4gICAgfVxuXG4gICAgY29tcG9zZShiaW5kaW5ncykge1xuICAgICAgICB2YXIgaW5BID0gdGhpcy5pbnB1dHNbMF0uY29tcG9zZShiaW5kaW5ncyk7XG4gICAgICAgIHZhciBpbkIgPSB0aGlzLmlucHV0c1sxXS5jb21wb3NlKGJpbmRpbmdzKTtcblxuICAgICAgICB2YXIgcmV0VmFsO1xuICAgICAgICByZXRWYWwgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgdGhpcy5vcCwgaW5BLCBpbkIpO1xuICAgICAgICBpZiAoaW5BLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyICYmIGluQi50eXBlID09IGV4cHJUeXBlLm51bWJlcikge1xuICAgICAgICAgICAgc3dpdGNoICh0aGlzLm9wKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgaW5BLm51bWJlci5hZGQoaW5CLm51bWJlcikpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCBpbkEubnVtYmVyLnN1YnRyYWN0KGluQi5udW1iZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgaW5BLm51bWJlci5tdWx0aXBseShpbkIubnVtYmVyKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIGluQS5udW1iZXIuZGl2aWRlKGluQi5udW1iZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHJldFZhbCk7XG4gICAgfVxuXG4gICAgZGVyaXZhdGl2ZShpdmFyLCB2YXJMaXN0KSB7XG4gICAgICAgIHZhciB1Q29uc3QgPSB0aGlzLmlucHV0c1swXS5pc0NvbnN0YW50KCk7XG4gICAgICAgIHZhciB2Q29uc3QgPSB0aGlzLmlucHV0c1sxXS5pc0NvbnN0YW50KCk7XG5cbiAgICAgICAgdmFyIHRoZURlcml2O1xuICAgICAgICBpZiAodUNvbnN0ICYmIHZDb25zdCkge1xuICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGR1ZHgsIGR2ZHg7XG5cbiAgICAgICAgICAgIGlmICh1Q29uc3QpIHtcbiAgICAgICAgICAgICAgICBkdWR4ID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHVkeCA9IHRoaXMuaW5wdXRzWzBdLmRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodkNvbnN0KSB7XG4gICAgICAgICAgICAgICAgZHZkeCA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGR2ZHggPSB0aGlzLmlucHV0c1sxXS5kZXJpdmF0aXZlKGl2YXIsIHZhckxpc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3dpdGNoICh0aGlzLm9wKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgICAgIHRoZURlcml2ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcrJywgZHVkeCwgZHZkeCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnLScsIGR1ZHgsIGR2ZHgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVkdiA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnKicsIHRoaXMuaW5wdXRzWzBdLCBkdmR4KVxuICAgICAgICAgICAgICAgICAgICB2YXIgdmR1ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcqJywgZHVkeCwgdGhpcy5pbnB1dHNbMV0pXG4gICAgICAgICAgICAgICAgICAgIGlmICh1Q29uc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZURlcml2ID0gdWR2O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZDb25zdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSB2ZHU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnKycsIHZkdSwgdWR2KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZDb25zdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJy8nLCBkdWR4LCB0aGlzLmlucHV0c1sxXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodUNvbnN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbnVtZXIgPSBuZXcgdW5vcF9leHByKHRoaXMuYnRtLCAnLScsIG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnKicsIHRoaXMuaW5wdXRzWzBdLCBkdmR4KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVub20gPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJ14nLCB0aGlzLmlucHV0c1sxXSwgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnLycsIG51bWVyLCBkZW5vbSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdWR2ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcqJywgdGhpcy5pbnB1dHNbMF0sIGR2ZHgpXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmR1ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcqJywgZHVkeCwgdGhpcy5pbnB1dHNbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbnVtZXIgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJy0nLCB2ZHUsIHVkdik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVub20gPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJ14nLCB0aGlzLmlucHV0c1sxXSwgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnLycsIG51bWVyLCBkZW5vbSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnXic6XG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3dEZXAgPSB0aGlzLmlucHV0c1sxXS5kZXBlbmRlbmNpZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl2YXJOYW1lID0gKHR5cGVvZiBpdmFyID09ICdzdHJpbmcnKSA/IGl2YXIgOiBpdmFyLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNlZSBpZiB0aGUgcG93ZXIgZGVwZW5kcyBvbiB0aGUgdmFyaWFibGVcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvd0RlcC5sZW5ndGggPiAwICYmIHBvd0RlcC5pbmRleE9mKGl2YXJOYW1lKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlQXJnID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcqJywgdGhpcy5pbnB1dHNbMV0sIG5ldyBmdW5jdGlvbl9leHByKHRoaXMuYnRtLCAnbG9nJywgdGhpcy5pbnB1dHNbMF0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGVGY24gPSBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLmJ0bSwgJ2V4cCcsIHRoZUFyZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IHRoZUZjbi5kZXJpdmF0aXZlKGl2YXIsIHZhckxpc3QpO1xuICAgICAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UgdGhpcyBpcyBhIHNpbXBsZSBhcHBsaWNhdGlvbiBvZiB0aGUgcG93ZXIgcnVsZVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF1Q29uc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdQb3cgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJy0nLCB0aGlzLmlucHV0c1sxXSwgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAxKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZHlkdSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnKicsIHRoaXMuaW5wdXRzWzFdLCBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJ14nLCB0aGlzLmlucHV0c1swXSwgbmV3UG93KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbMF0udHlwZSA9PSBleHByVHlwZS52YXJpYWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1swXS5uYW1lID09IGl2YXJOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSBkeWR1O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZHVkeCA9IHRoaXMuaW5wdXRzWzBdLmRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJyonLCBkeWR1LCBkdWR4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZURlcml2ID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZSBiaW5hcnkgb3BlcmF0b3IgJ1wiICsgdGhpcy5vcCArIFwiJyBpcyBub3QgZGVmaW5lZC5cIik7XG4gICAgICAgICAgICAgICAgICAgIHRoZURlcml2ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4odGhlRGVyaXYpO1xuICAgIH1cbn1cbiIsIi8qIVxuICogQlRNIEphdmFTY3JpcHQgTGlicmFyeSB2QFZFUlNJT05cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kYnJpYW53YWx0b24vQlRNXG4gKlxuICogQ29weXJpZ2h0IEQuIEJyaWFuIFdhbHRvblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIChodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVClcbiAqXG4gKiBEYXRlOiBAREFURVxuICovXG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBEZWZpbmUgdGhlIERlcml2YXRpdmUgb2YgYW4gRXhwcmVzc2lvblxuKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuaW1wb3J0IHsgZXhwcmVzc2lvbiB9IGZyb20gXCIuL2V4cHJlc3Npb24uanNcIlxuaW1wb3J0IHsgdmFyaWFibGVfZXhwciB9IGZyb20gXCIuL3ZhcmlhYmxlX2V4cHIuanNcIlxuaW1wb3J0IHsgZXhwclR5cGUgfSBmcm9tIFwiLi9CVE1fcm9vdC5qc1wiXG5cbmV4cG9ydCBjbGFzcyBkZXJpdl9leHByIGV4dGVuZHMgZXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IoYnRtLCBmb3JtdWxhLCB2YXJpYWJsZSwgYXRWYWx1ZSkge1xuICAgICAgICBzdXBlcihidG0pO1xuICAgICAgICB0aGlzLnR5cGUgPSBleHByVHlwZS5vcGVyYXRvcjtcbiAgICAgICAgdGhpcy5vcCA9IFwiRFwiO1xuICAgICAgICBpZiAodHlwZW9mIGZvcm11bGEgPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICBmb3JtdWxhID0gbmV3IGV4cHJlc3Npb24odGhpcy5idG0pO1xuICAgICAgICBpZiAodHlwZW9mIHZhcmlhYmxlID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB2YXJpYWJsZSA9IG5ldyB2YXJpYWJsZV9leHByKHRoaXMuYnRtLCAneCcpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YXJpYWJsZSA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdmFyaWFibGUgPSBuZXcgdmFyaWFibGVfZXhwcih0aGlzLmJ0bSwgdmFyaWFibGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXZhciA9IHZhcmlhYmxlO1xuICAgICAgICB0aGlzLml2YXJWYWx1ZSA9IGF0VmFsdWU7XG4gICAgICAgIHRoaXMuaW5wdXRzID0gW2Zvcm11bGFdO1xuICAgICAgICB0aGlzLmlzUmF0ZSA9IGZhbHNlO1xuICAgICAgICBmb3JtdWxhLnBhcmVudCA9IHRoaXM7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHZhciB0aGVTdHI7XG4gICAgICAgIHZhciBleHByU3RyLCB2YXJTdHIsIHZhbFN0cjtcblxuICAgICAgICB2YXJTdHIgPSB0aGlzLml2YXIudG9TdHJpbmcoKTtcbiAgICAgICAgZXhwclN0ciA9IHRoaXMuaW5wdXRzWzBdLnRvU3RyaW5nKCk7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pdmFyVmFsdWUgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHZhbFN0ciA9IHRoaXMuaXZhclZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB0aGVTdHIgPSBcIkQoXCIrZXhwclN0citcIixcIit2YXJTdHIrXCIsXCIrdmFsU3RyK1wiKVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhlU3RyID0gXCJEKFwiK2V4cHJTdHIrXCIsXCIrdmFyU3RyK1wiKVwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybih0aGVTdHIpO1xuICAgIH1cblxuICAgIHRvVGVYKHNob3dTZWxlY3QpIHtcbiAgICAgICAgdmFyIHRoZVN0cjtcbiAgICAgICAgdmFyIG9wU3RyLCB2YXJTdHIsIGV4cHJTdHIsIHZhbFN0cjtcblxuICAgICAgICB2YXJTdHIgPSB0aGlzLml2YXIudG9UZVgoKTtcbiAgICAgICAgZXhwclN0ciA9IHRoaXMuaW5wdXRzWzBdLnRvVGVYKCk7XG4gICAgICAgIGlmICh0aGlzLmlzUmF0ZSAmJiB0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLnZhcmlhYmxlKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuaXZhclZhbHVlICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgdmFsU3RyID0gdGhpcy5pdmFyVmFsdWUudG9UZVgoKTtcbiAgICAgICAgICAgICAgICB0aGVTdHIgPSBcIlxcXFxsZWZ0LiBcXFxcZnJhY3tkXCIgKyBleHByU3RyICsgXCJ9e2RcIit2YXJTdHIrXCJ9IFxcXFxyaWdodHxfe1wiXG4gICAgICAgICAgICAgICAgICAgICsgdmFyU3RyICsgXCI9XCIgKyB2YWxTdHIgKyBcIn1cIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhlU3RyID0gXCJcXFxcZnJhY3tkXCIgKyBleHByU3RyICtcIn17ZFwiK3ZhclN0citcIn1cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5pdmFyVmFsdWUgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICB2YWxTdHIgPSB0aGlzLml2YXJWYWx1ZS50b1RlWCgpO1xuICAgICAgICAgICAgICAgIG9wU3RyID0gXCJcXFxcbGVmdC4gXFxcXGZyYWN7ZH17ZFwiK3ZhclN0citcIn0gXFxcXHJpZ2h0fF97XCJcbiAgICAgICAgICAgICAgICAgICAgKyB2YXJTdHIgKyBcIj1cIiArIHZhbFN0ciArIFwifVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvcFN0ciA9IFwiXFxcXGZyYWN7ZH17ZFwiK3ZhclN0citcIn1cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoZVN0ciA9IG9wU3RyICsgXCJcXFxcQmlnW1wiICsgZXhwclN0ciArIFwiXFxcXEJpZ11cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4odGhlU3RyKTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgdGVzdGVkIGVxdWl2YWxlbnQgc3RyaW5ncy5cbiAgICBhbGxTdHJpbmdFcXVpdnMoKSB7XG4gICAgICAgIHZhciBhbGxJbnB1dHMgPSB0aGlzLmlucHV0c1swXS5hbGxTdHJpbmdFcXVpdnMoKTtcbiAgICAgICAgdmFyIHZhclN0ciwgdmFsU3RyO1xuICAgICAgICB2YXIgcmV0VmFsdWUgPSBbXTtcblxuICAgICAgICB2YXJTdHIgPSB0aGlzLml2YXIudG9TdHJpbmcoKTtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLml2YXJWYWx1ZSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdmFsU3RyID0gdGhpcy5pdmFyVmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpIGluIGFsbElucHV0cykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLml2YXJWYWx1ZSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHJldFZhbHVlW2ldID0gXCJEKFwiK2FsbElucHV0c1tpXStcIixcIit2YXJTdHIrXCIsXCIrdmFsU3RyK1wiKVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXRWYWx1ZVtpXSA9IFwiRChcIithbGxJbnB1dHNbaV0rXCIsXCIrdmFyU3RyK1wiKVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKGFsbElucHV0cyk7XG4gICAgfVxuXG4gICAgdG9NYXRoTUwoKSB7XG4gICAgICAgIHZhciB0aGVTdHI7XG4gICAgICAgIHZhciBleHByU3RyO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dHNbMF0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGV4cHJTdHIgPSAnPyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHByU3RyID0gdGhpcy5pbnB1dHNbMF0udG9NYXRoTUwoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGVTdHIgPSBcIjxhcHBseT48ZGVyaXZhdGl2ZS8+XCIgKyBleHByU3RyICsgXCI8L2FwcGx5PlwiO1xuXG4gICAgICAgIHJldHVybih0aGVTdHIpO1xuICAgIH1cblxuICAgIGV2YWx1YXRlKGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciByZXRWYWw7XG4gICAgICAgIHZhciBkZXJpdkV4cHI7XG4gICAgICAgIHZhciBkYmluZCA9IHt9O1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pdmFyVmFsdWUgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGRiaW5kW3RoaXMuaXZhci5uYW1lXSA9IHRoaXMuaXZhclZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIENvbXB1dGUgdGhlIGRlcml2YXRpdmUgb2YgdGhlIGV4cHJlc3Npb24sIHRoZW4gZXZhbHVhdGUgYXQgYmluZGluZ1xuICAgICAgICBkZXJpdkV4cHIgPSB0aGlzLmlucHV0c1swXS5kZXJpdmF0aXZlKHRoaXMuaXZhciwgYmluZGluZ3MpO1xuICAgICAgICBkZXJpdkV4cHIgPSBkZXJpdkV4cHIuY29tcG9zZShkYmluZCk7XG4gICAgICAgIHJldFZhbCA9IGRlcml2RXhwci5ldmFsdWF0ZShiaW5kaW5ncyk7XG4gICAgICAgIHJldHVybihyZXRWYWwpO1xuICAgIH1cblxuICAgIHNpbXBsaWZ5Q29uc3RhbnRzKCkge1xuICAgICAgICByZXR1cm4odGhpcyk7XG4gICAgfVxuXG4gICAgZmxhdHRlbigpIHtcbiAgICAgIHJldHVybiAobmV3IGRlcml2X2V4cHIodGhpcy5idG0sIHRoaXMuaW5wdXRzWzBdLmZsYXR0ZW4oKSwgdGhpcy5pdmFyLCB0aGlzLml2YXJWYWx1ZSkpO1xuICAgIH1cblxuICAgIGNvcHkoKSB7XG4gICAgICByZXR1cm4gKG5ldyBkZXJpdl9leHByKHRoaXMuYnRtLCB0aGlzLmlucHV0c1swXS5jb3B5KCksIHRoaXMuaXZhciwgdGhpcy5pdmFyVmFsdWUpKTtcbiAgICB9XG5cblxuICAgIGNvbXBvc2UoYmluZGluZ3MpIHtcbiAgICB9XG5cbiAgICBkZXJpdmF0aXZlKGl2YXIsIHZhckxpc3QpIHtcbiAgICAgICAgdmFyIGRiaW5kID0ge307XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLml2YXJWYWx1ZSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZGJpbmRbdGhpcy5pdmFyXSA9IHRoaXMuaXZhclZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIEV2YWx1YXRlIHRoZSBtYWluIGV4cHJlc3Npb24gdXNpbmcgb3JpZ2luYWwgYmluZGluZ1xuICAgICAgICB2YXIgZmlyc3REZXJpdiA9IHRoaXMuaW5wdXRzWzBdLmRlcml2YXRpdmUodGhpcy5pdmFyLCB2YXJMaXN0KTtcbiAgICAgICAgZmlyc3REZXJpdi5jb21wb3NlKGRiaW5kKTtcblxuICAgICAgICAvLyBOb3cgZGlmZmVyZW50aWF0ZSB0aGF0IGV4cHJlc3Npb24gdXNpbmcgbmV3IGJpbmRpbmcuXG4gICAgICAgIHJldHVybiBmaXJzdERlcml2LmRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCk7XG4gICAgfVxufVxuIiwiLyohXG4gKiBCVE0gSmF2YVNjcmlwdCBMaWJyYXJ5IHZAVkVSU0lPTlxuICogaHR0cHM6Ly9naXRodWIuY29tL2RicmlhbndhbHRvbi9CVE1cbiAqXG4gKiBDb3B5cmlnaHQgRC4gQnJpYW4gV2FsdG9uXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUKVxuICpcbiAqIERhdGU6IEBEQVRFXG4gKi9cblxuaW1wb3J0IHsgQlRNLCBleHByVmFsdWUgfSBmcm9tIFwiLi9CVE1fcm9vdC5qc1wiXG5pbXBvcnQgeyBmaW5kTWF0Y2hSdWxlcyB9IGZyb20gXCIuL3JlZHVjdGlvbnMuanNcIlxuXG5leHBvcnQgY2xhc3MgTWF0aE9iamVjdCB7XG4gICAgY29uc3RydWN0b3IoYnRtKSB7XG4gICAgICAgIHRoaXMuYnRtID0gYnRtO1xuICAgICAgICBpZiAoIShidG0gaW5zdGFuY2VvZiBCVE0pKSB7XG4gICAgICAgICAgICB0aHJvdyBcIk1hdGhPYmplY3QgY29uc3RydWN0ZWQgd2l0aCBpbnZhbGlkIGVudmlyb25tZW50XCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgICAgICB0aGlzLmlucHV0cyA9IFtdO1xuICAgICAgICB0aGlzLnZhbHVlVHlwZSA9IGV4cHJWYWx1ZS51bmRlZjtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBcbiAgICAvLyBNZXRob2QgdG8gKmV2YWx1YXRlKiB0aGUgb2JqZWN0LlxuICAgIC8vIC0gUmV0dXJuIHVuZGVmaW5lZFxuICAgIHZhbHVlKGJpbmRpbmdzKSB7XG4gICAgfVxuICAgIFxuICAgIC8vIFVwZGF0ZSBjb250ZXh0IHNldHRpbmdcbiAgICBzZXRDb250ZXh0KGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgLy8gVXBkYXRlIGNvbnRleHQgb24gaW5wdXRzLlxuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0c1tpXS5zZXRDb250ZXh0KGNvbnRleHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gV2hlbiB0aGUgcGFyc2VyIHRocm93cyBhbiBlcnJvciwgbmVlZCB0byByZWNvcmQgaXQuXG4gICAgc2V0UGFyc2luZ0Vycm9yKGVycm9yU3RyaW5nKSB7XG4gICAgICAgIHRoaXMucGFyc2VFcnJvciA9IGVycm9yU3RyaW5nO1xuICAgIH1cblxuICAgIC8vIEVycm9ycyBmcm9tIHBhcnNpbmcuIENoZWNrIGFsbCBwb3NzaWJsZSBjaGlsZHJlbiAocmVjdXJzaXZlbHkpXG4gICAgaGFzUGFyc2luZ0Vycm9yKCkge1xuICAgICAgICB2YXIgcmV0VmFsdWUgPSBmYWxzZSxcbiAgICAgICAgICAgIGkgPSAwO1xuICAgICAgICBpZiAodGhpcy5wYXJzZUVycm9yKSB7XG4gICAgICAgICAgICByZXRWYWx1ZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoIXJldFZhbHVlICYmIGkgPCB0aGlzLmlucHV0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIGZvciByZWR1Y3Rpb25zIG9uIGlucHV0cy5cbiAgICAgICAgICAgIHJldFZhbHVlID0gdGhpcy5pbnB1dHNbaV0uaGFzUGFyc2luZ0Vycm9yKCk7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldFZhbHVlO1xuICAgIH1cbiAgICBcbiAgICAvLyBFcnJvcnMgZnJvbSBwYXJzaW5nLiBGaW5kIHRoZSAqZmlyc3QqIGVycm9yIGluIHRoZSBwYXJzaW5nIHByb2Nlc3MuXG4gICAgZ2V0UGFyc2luZ0Vycm9yKCkge1xuICAgICAgICB2YXIgZXJyU3RyaW5nID0gdGhpcy5wYXJzZUVycm9yO1xuICAgICAgICB2YXIgaT0wO1xuICAgICAgICB3aGlsZSAoIWVyclN0cmluZyAmJiBpIDwgdGhpcy5pbnB1dHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBlcnJTdHJpbmcgPSB0aGlzLmlucHV0c1tpXS5nZXRQYXJzaW5nRXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKGVyclN0cmluZyk7XG4gICAgfVxuICAgIFxuICAgIC8vIE1ldGhvZCB0byBnZW5lcmF0ZSB0aGUgZXhwcmVzc2lvbiBhcyBpbnB1dC1zdHlsZSBzdHJpbmcuXG4gICAgdG9TdHJpbmcoZWxlbWVudE9ubHkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50T25seSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZWxlbWVudE9ubHkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGhlU3RyID0gJyc7XG4gICAgICAgIHJldHVybih0aGVTdHIpO1xuICAgIH1cbiAgICBcbiAgICAvLyBNZXRob2QgdG8gZ2VuZXJhdGUgdGhlIGV4cHJlc3Npb24gdXNpbmcgcHJlc2VudGF0aW9uLXN0eWxlIChMYVRlWClcbiAgICAvLyAtIHNob3dTZWxlY3QgaXMgc28gdGhhdCBwYXJ0IG9mIHRoZSBleHByZXNzaW9uIGNhbiBiZSBoaWdobGlnaHRlZFxuICAgIHRvVGVYKHNob3dTZWxlY3QpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzaG93U2VsZWN0ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBzaG93U2VsZWN0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHRoaXMudG9TdHJpbmcoKSk7XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kIHRvIHJlcHJlc2VudCB0aGUgZXhwcmVzc2lvbiB1c2luZyBNYXRoTUxcbiAgICB0b01hdGhNTCgpIHtcbiAgICAgICAgcmV0dXJuKFwiPG1pPlwiICsgdGhpcy50b1N0cmluZygpICsgXCI8L21pPlwiKTtcbiAgICB9XG4gICAgXG4gICAgLy8gUmV0dXJuIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRlc3RlZCBlcXVpdmFsZW50IHN0cmluZ3MuXG4gICAgYWxsU3RyaW5nRXF1aXZzKCkge1xuICAgICAgICByZXR1cm4oW10pO1xuICAgIH1cbiAgICBcbiAgICAvLyBUbyBjb252ZXJ0IGJpbmFyeSB0cmVlIHN0cnVjdHVyZSB0byBuLWFyeSB0cmVlIGZvciBzdXBwb3J0ZWQgb3BlcmF0aW9ucyAoKyBhbmQgKilcbiAgICAvLyBNb3N0IHRoaW5ncyBjYW4ndCBmbGF0dGVuLiBSZXR1cm4gYSBjb3B5LlxuICAgIGZsYXR0ZW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvcHkoKTtcbiAgICB9XG4gICAgXG4gICAgLy8gVGVzdCBpZiB0aGUgZXhwcmVzc2lvbiBldmFsdWF0ZXMgdG8gYSBjb25zdGFudC5cbiAgICBpc0NvbnN0YW50KCkge1xuICAgICAgICB2YXIgcmV0VmFsdWUgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuKHJldFZhbHVlKTtcbiAgICB9XG4gICAgXG4gICAgLy8gVGVzdCBpZiB0aGUgZXhwcmVzc2lvbiBldmFsdWF0ZXMgdG8gYSBjb25zdGFudC5cbiAgICBpc0V4cHJlc3Npb24oKSB7XG4gICAgICAgIHZhciByZXRWYWx1ZSA9IGZhbHNlO1xuICAgICAgICByZXR1cm4ocmV0VmFsdWUpO1xuICAgIH1cblxufVxuXG5leHBvcnQgY2xhc3MgZXhwcmVzc2lvbiBleHRlbmRzIE1hdGhPYmplY3Qge1xuICBjb25zdHJ1Y3RvcihidG0pIHtcbiAgICAgICAgaWYgKCEoYnRtIGluc3RhbmNlb2YgQlRNKSkge1xuICAgICAgICAgICAgdGhyb3cgXCJleHByZXNzaW9uIGNvbnN0cnVjdGVkIHdpdGggaW52YWxpZCBlbnZpcm9ubWVudFwiO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyKGJ0bSk7XG4gICAgICAgIHRoaXMuc2VsZWN0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5pbnB1dHMgPSBbXTtcbiAgICAgICAgdGhpcy52YWx1ZVR5cGUgPSBleHByVmFsdWUubnVtZXJpYztcbiAgICB9XG5cbiAgICAvLyBNZXRob2QgdG8gKmV2YWx1YXRlKiB0aGUgdmFsdWUgb2YgdGhlIGV4cHJlc3Npb24gdXNpbmcgZ2l2ZW4gc3ltYm9sIGJpbmRpbmdzLlxuICAgIC8vIC0gUmV0dXJuIG5hdGl2ZSBOdW1iZXIgdmFsdWVcbiAgICB2YWx1ZShiaW5kaW5ncykge1xuICAgICAgICByZXR1cm4odGhpcy5ldmFsdWF0ZShiaW5kaW5ncykpO1xuICAgIH1cblxuICAgIC8vIFdoZW4gdGhlIHBhcnNlciB0aHJvd3MgYW4gZXJyb3IsIG5lZWQgdG8gcmVjb3JkIGl0LlxuICAgIHNldFBhcnNpbmdFcnJvcihlcnJvclN0cmluZykge1xuICAgICAgICB0aGlzLnBhcnNlRXJyb3IgPSBlcnJvclN0cmluZztcbiAgICB9XG5cbiAgICAvLyBFcnJvcnMgZnJvbSBwYXJzaW5nLiBDaGVjayBhbGwgcG9zc2libGUgY2hpbGRyZW4gKHJlY3Vyc2l2ZWx5KVxuICAgIGhhc1BhcnNpbmdFcnJvcigpIHtcbiAgICAgICAgdmFyIHJldFZhbHVlID0gZmFsc2UsXG4gICAgICAgICAgICBpID0gMDtcbiAgICAgICAgaWYgKHRoaXMucGFyc2VFcnJvcikge1xuICAgICAgICAgICAgcmV0VmFsdWUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKCFyZXRWYWx1ZSAmJiBpIDwgdGhpcy5pbnB1dHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBDaGVjayBmb3IgcmVkdWN0aW9ucyBvbiBpbnB1dHMuXG4gICAgICAgICAgICByZXRWYWx1ZSA9IHRoaXMuaW5wdXRzW2ldLmhhc1BhcnNpbmdFcnJvcigpO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXRWYWx1ZTtcbiAgICB9XG5cbiAgICAvLyBFcnJvcnMgZnJvbSBwYXJzaW5nLiBGaW5kIHRoZSAqZmlyc3QqIGVycm9yIGluIHRoZSBwYXJzaW5nIHByb2Nlc3MuXG4gICAgZ2V0UGFyc2luZ0Vycm9yKCkge1xuICAgICAgICB2YXIgZXJyU3RyaW5nID0gdGhpcy5wYXJzZUVycm9yO1xuICAgICAgICB2YXIgaT0wO1xuICAgICAgICB3aGlsZSAoIWVyclN0cmluZyAmJiBpIDwgdGhpcy5pbnB1dHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBlcnJTdHJpbmcgPSB0aGlzLmlucHV0c1tpXS5nZXRQYXJzaW5nRXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKGVyclN0cmluZyk7XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kIHRvIGdlbmVyYXRlIHRoZSBleHByZXNzaW9uIGFzIGlucHV0LXN0eWxlIHN0cmluZy5cbiAgICB0b1N0cmluZyhlbGVtZW50T25seSkge1xuICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnRPbmx5ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBlbGVtZW50T25seSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0aGVTdHIgPSAnJztcbiAgICAgICAgcmV0dXJuKHRoZVN0cik7XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kIHRvIGdlbmVyYXRlIHRoZSBleHByZXNzaW9uIHVzaW5nIHByZXNlbnRhdGlvbi1zdHlsZSAoTGFUZVgpXG4gICAgLy8gLSBzaG93U2VsZWN0IGlzIHNvIHRoYXQgcGFydCBvZiB0aGUgZXhwcmVzc2lvbiBjYW4gYmUgaGlnaGxpZ2h0ZWRcbiAgICB0b1RlWChzaG93U2VsZWN0KSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2hvd1NlbGVjdCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgc2hvd1NlbGVjdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybih0aGlzLnRvU3RyaW5nKCkpO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZCB0byByZXByZXNlbnQgdGhlIGV4cHJlc3Npb24gdXNpbmcgTWF0aE1MXG4gICAgdG9NYXRoTUwoKSB7XG4gICAgICAgIHJldHVybihcIjxtaT5cIiArIHRoaXMudG9TdHJpbmcoKSArIFwiPC9taT5cIik7XG4gICAgfVxuXG4gICAgb3BlcmF0ZVRvVGVYKCkge1xuICAgICAgICByZXR1cm4odGhpcy50b1RlWCgpKTtcbiAgICB9XG5cbiAgICB0cmVlVG9UZVgoZXhwYW5kKSB7XG4gICAgICAgIHZhciByZXRTdHJ1Y3QgPSB7fTtcbiAgICAgICAgXG4gICAgICAgIHJldFN0cnVjdC5wYXJlbnQgPSAodHlwZW9mIHRoaXMucGFyZW50ID09PSAndW5kZWZpbmVkJyB8fCB0aGlzLnBhcmVudCA9PT0gbnVsbCkgPyBudWxsIDogdGhpcy5wYXJlbnQub3BlcmF0ZVRvVGVYKCk7XG4gICAgICAgIGlmICh0eXBlb2YgZXhwYW5kID09PSAndW5kZWZpbmVkJyB8fCAhZXhwYW5kKSB7XG4gICAgICAgICAgICByZXRTdHJ1Y3QuY3VycmVudCA9IHRoaXMudG9UZVgoKTtcbiAgICAgICAgICAgIHJldFN0cnVjdC5pbnB1dHMgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0U3RydWN0LmN1cnJlbnQgPSB0aGlzLm9wZXJhdGVUb1RlWCgpO1xuICAgICAgICAgICAgcmV0U3RydWN0LmlucHV0cyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgICAgIHJldFN0cnVjdC5pbnB1dHNbaV0gPSB0aGlzLmlucHV0c1tpXS50b1RlWCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRTdHJ1Y3QpO1xuICAgIH1cblxuXG4gICAgLy8gUmV0dXJuIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRlc3RlZCBlcXVpdmFsZW50IHN0cmluZ3MuXG4gICAgYWxsU3RyaW5nRXF1aXZzKCkge1xuICAgICAgICByZXR1cm4oW10pO1xuICAgIH1cblxuICAgIC8vIFRvIGNvbnZlcnQgYmluYXJ5IHRyZWUgc3RydWN0dXJlIHRvIG4tYXJ5IHRyZWUgZm9yIHN1cHBvcnRlZCBvcGVyYXRpb25zICgrIGFuZCAqKVxuICAgIC8vIE1vc3QgdGhpbmdzIGNhbid0IGZsYXR0ZW4uIFJldHVybiBhIGNvcHkuXG4gICAgZmxhdHRlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29weSgpO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSBhIG5ldyBleHByZXNzaW9uIHRoYXQgaXMgYSBjb3B5LlxuICAgIGNvcHkoKSB7XG4gICAgICAgIHZhciBteUNvcHkgPSBuZXcgZXhwcmVzc2lvbih0aGlzLmJ0bSk7XG4gICAgICAgIHJldHVybiBteUNvcHk7XG4gICAgfVxuXG4gICAgLy8gV2hlbiBzdWJ0cmVlIG9ubHkgaW52b2x2ZXMgY29uc3RhbnRzLCBzaW1wbGlmeSB0aGUgZm9ybXVsYSB0byBhIHZhbHVlLlxuICAgIC8vIERlZmF1bHQ6IExvb2sgYXQgYWxsIGRlc2NlbmRhbnRzIChpbnB1dHMpIGFuZCBzaW1wbGlmeSB0aGVyZS5cbiAgICBzaW1wbGlmeUNvbnN0YW50cygpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgdGhpcy5pbnB1dHNbaV0gPSB0aGlzLmlucHV0c1tpXS5zaW1wbGlmeUNvbnN0YW50cygpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dHNbaV0ucGFyZW50ID0gdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4odGhpcyk7XG4gICAgfVxuXG4gICAgLy8gRmluZCBhbGwgZGVwZW5kZW5jaWVzIChzeW1ib2xzKSByZXF1aXJlZCB0byBldmFsdWF0ZSBleHByZXNzaW9uLlxuICAgIGRlcGVuZGVuY2llcyhmb3JjZWQpIHtcbiAgICAgICAgdmFyIGluRGVwcztcbiAgICAgICAgdmFyIGksIGo7XG4gICAgICAgIHZhciBkZXBBcnJheSA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgIHZhciBtYXN0ZXIgPSB7fTtcbiAgICAgICAgaWYgKGZvcmNlZCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxmb3JjZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkZXBBcnJheS5wdXNoKGZvcmNlZFtpXSk7XG4gICAgICAgICAgICAgICAgbWFzdGVyW2ZvcmNlZFtpXV0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgaW5EZXBzID0gdGhpcy5pbnB1dHNbaV0uZGVwZW5kZW5jaWVzKCk7XG4gICAgICAgICAgICBmb3IgKGogaW4gaW5EZXBzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtYXN0ZXJbaW5EZXBzW2pdXSA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlcEFycmF5LnB1c2goaW5EZXBzW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgbWFzdGVyW2luRGVwc1tqXV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihkZXBBcnJheSk7XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kIHRvIHJldHVybiBpbnB1dCBhdCBnaXZlbiBpbmRleC5cbiAgICBnZXRJbnB1dCh3aGljaElucHV0KSB7XG4gICAgICAgIHZhciBpbnB1dEV4cHIgPSBudWxsO1xuICAgICAgICBpZiAod2hpY2hJbnB1dCA8IDAgfHwgd2hpY2hJbnB1dCA+PSB0aGlzLmlucHV0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRocm93ICdBdHRlbXB0IHRvIGdldCBhbiB1bmRlZmluZWQgaW5wdXQgZXhwcmVzc2lvbi4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5wdXRFeHByID0gdGhpcy5pbnB1dHNbd2hpY2hJbnB1dF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKGlucHV0RXhwcik7XG4gICAgfVxuXG4gICAgLy8gVGVzdCBpZiB0aGUgZXhwcmVzc2lvbiBldmFsdWF0ZXMgdG8gYSBjb25zdGFudC5cbiAgICBpc0NvbnN0YW50KCkge1xuICAgICAgICB2YXIgcmV0VmFsdWUgPSB0cnVlO1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICByZXRWYWx1ZSA9IHJldFZhbHVlICYgdGhpcy5pbnB1dHNbaV0uaXNDb25zdGFudCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gRXZhbHVhdGUgdGhlIGV4cHJlc3Npb24gZ2l2ZW4gdGhlIGJpbmRpbmdzIHRvIHN5bWJvbHMuXG4gICAgZXZhbHVhdGUoYmluZGluZ3MpIHtcbiAgICAgICAgcmV0dXJuKDApO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSBhICpuZXcqIGV4cHJlc3Npb24gd2hlcmUgYSBzeW1ib2wgaXMgKnJlcGxhY2VkKiBieSBhIGJvdW5kIGV4cHJlc3Npb25cbiAgICBjb21wb3NlKGJpbmRpbmdzKSB7XG4gICAgICAgIHJldHVybihuZXcgZXhwcmVzc2lvbih0aGlzLmJ0bSkpO1xuICAgIH1cblxuICAgIC8vIENvbXBhcmUgKnRoaXMqIGV4cHJlc3Npb24gdG8gYSBnaXZlbiAqdGVzdEV4cHIqLlxuICAgIC8vICpvcHRpb25zKiBnaXZlcyBvcHRpb25zIGFzc29jaWF0ZWQgd2l0aCB0ZXN0aW5nIChlLmcuLCByZWxhdGl2ZSB0b2xlcmFuY2UpXG4gICAgLy8gYnV0IGFsc28gc3VwcG9ydHMgZml4aW5nIGNlcnRhaW4gYmluZGluZ3MuXG4gICAgLy8gU3VwcG9ydHMgYWJzdHJhY3QgaW5wdXQgbWF0Y2hpbmcgYWdhaW5zdCB2YXJpYWJsZXMgdXNpbmcgKm1hdGNoSW5wdXRzKlxuICAgIGNvbXBhcmUodGVzdEV4cHIsIG9wdGlvbnMsIG1hdGNoSW5wdXRzKSB7XG4gICAgICAgIHZhciBpc0VxdWFsID0gdHJ1ZTtcbiAgICAgICAgdmFyIGksIG47XG5cbiAgICAgICAgaWYgKG1hdGNoSW5wdXRzID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbWF0Y2hJbnB1dHMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucyA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICB2YXIga25vd25CaW5kaW5ncyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpO1xuICAgICAgICB2YXIgdW5rbm93bkJpbmRpbmdzID0gW107XG5cbiAgICAgICAgdmFyIHJUb2wgPSAxZS04O1xuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuclRvbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJUb2wgPSBvcHRpb25zLnJUb2w7XG4gICAgICAgICAgICBpID0ga25vd25CaW5kaW5ncy5pbmRleE9mKCdyVG9sJyk7XG4gICAgICAgICAgICBrbm93bkJpbmRpbmdzLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkZXBlbmRBID0gdGhpcy5kZXBlbmRlbmNpZXMoKTtcbiAgICAgICAgdmFyIGRlcGVuZEIgPSB0ZXN0RXhwci5kZXBlbmRlbmNpZXMoKTtcblxuICAgICAgICBmb3IgKGk9MDsgaTxkZXBlbmRBLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoa25vd25CaW5kaW5ncy5pbmRleE9mKGRlcGVuZEFbaV0pIDwgMFxuICAgICAgICAgICAgICAgICYmIHVua25vd25CaW5kaW5ncy5pbmRleE9mKGRlcGVuZEFbaV0pIDwgMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB1bmtub3duQmluZGluZ3MucHVzaChkZXBlbmRBW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGk9MDsgaTxkZXBlbmRCLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoa25vd25CaW5kaW5ncy5pbmRleE9mKGRlcGVuZEJbaV0pIDwgMFxuICAgICAgICAgICAgICAgICYmIHVua25vd25CaW5kaW5ncy5pbmRleE9mKGRlcGVuZEJbaV0pIDwgMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB1bmtub3duQmluZGluZ3MucHVzaChkZXBlbmRCW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgYXJyYXlzIG9mIHRlc3QgcG9pbnRzLlxuICAgICAgICB2YXIgdmFyaWFibGVMaXN0ID0gW107XG4gICAgICAgIHZhciB0ZXN0UG9pbnRMaXN0ID0gW107XG4gICAgICAgIHZhciB4LCB4T3B0LCB4TWluLCB4TWF4LCBkeCwgbiwgdGVzdFBvaW50cztcbiAgICAgICAgbiA9IDEwO1xuICAgICAgICBmb3IgKGk9MDsgaTxrbm93bkJpbmRpbmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB4ID0ga25vd25CaW5kaW5nc1tpXTtcbiAgICAgICAgICAgIHhPcHQgPSBvcHRpb25zW3hdO1xuICAgICAgICAgICAgeE1pbiA9IHhPcHQubWluO1xuICAgICAgICAgICAgeE1heCA9IHhPcHQubWF4O1xuICAgICAgICAgICAgZHggPSAoeE1heC14TWluKS9uO1xuICAgICAgICAgICAgdGVzdFBvaW50cyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaj0wOyBqPG47IGorKykge1xuICAgICAgICAgICAgICAgIHRlc3RQb2ludHNbal0gPSB4TWluK2oqZHg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ZXN0UG9pbnRzW25dID0geE1heDtcblxuICAgICAgICAgICAgLy8gQWRkIHRoaXMgdG8gdGhlIGxpc3Qgb2YgdGVzdGluZyBhcnJheXMuXG4gICAgICAgICAgICB2YXJpYWJsZUxpc3QucHVzaCh4KTtcbiAgICAgICAgICAgIHRlc3RQb2ludExpc3QucHVzaCh0ZXN0UG9pbnRzKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGk9MDsgaTx1bmtub3duQmluZGluZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHggPSB1bmtub3duQmluZGluZ3NbaV07XG4gICAgICAgICAgICB4TWluID0gLTI7XG4gICAgICAgICAgICB4TWF4ID0gMjtcbiAgICAgICAgICAgIGR4ID0gKHhNYXgteE1pbikvbjtcbiAgICAgICAgICAgIHRlc3RQb2ludHMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGo9MDsgajxuOyBqKyspIHtcbiAgICAgICAgICAgICAgICB0ZXN0UG9pbnRzW2pdID0geE1pbitqKmR4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGVzdFBvaW50c1tuXSA9IHhNYXg7XG5cbiAgICAgICAgICAgIC8vIEFkZCB0aGlzIHRvIHRoZSBsaXN0IG9mIHRlc3RpbmcgYXJyYXlzLlxuICAgICAgICAgICAgdmFyaWFibGVMaXN0LnB1c2goeCk7XG4gICAgICAgICAgICB0ZXN0UG9pbnRMaXN0LnB1c2godGVzdFBvaW50cyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3cgd2Ugd2lsbCBwcm9jZWVkIHRocm91Z2ggYWxsIHBvc3NpYmxlIHBvaW50cy5cbiAgICAgICAgLy8gQW5hbG9neTogRWFjaCB2YXJpYWJsZSBpcyBsaWtlIG9uZSBcImRpZ2l0XCIgb24gYW4gb2RvbWV0ZXIuXG4gICAgICAgIC8vIEdvIHRocm91Z2ggZnVsbCBjeWNsZSBvZiBhIHZhcmlhYmxlJ3Mgb3B0aW9ucyBhbmQgdGhlbiBhZHZhbmNlIHRoZSBuZXh0IHZhcmlhYmxlLlxuICAgICAgICAvLyBVc2UgYW4gb2RvbWV0ZXItbGlrZSBhcnJheSB0aGF0IHJlZmVyZW5jZXMgd2hpY2ggcG9pbnQgZnJvbVxuICAgICAgICAvLyBlYWNoIGxpc3QgaXMgYmVpbmcgdXNlZC4gV2hlbiB0aGUgbGFzdCBlbnRyeSByZWFjaGVzIHRoZSBlbmQsXG4gICAgICAgIC8vIHRoZSBvZG9tZXRlciByb2xscyBvdmVyIHVudGlsIGFsbCBlbnRyaWVzIGFyZSBkb25lLlxuICAgICAgICB2YXIgb2RvbWV0ZXIgPSBbXTtcbiAgICAgICAgZm9yIChpPTA7IGk8dmFyaWFibGVMaXN0Lmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgb2RvbWV0ZXJbaV09MDtcbiAgICAgICAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgICAgICAgd2hpbGUgKCFkb25lICYmIGlzRXF1YWwpIHtcbiAgICAgICAgICAgIHZhciB5MSwgeTI7XG4gICAgICAgICAgICB2YXIgYmluZGluZ3MgPSB7fTtcbiAgICAgICAgICAgIGZvciAoaT0wOyBpPHZhcmlhYmxlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHggPSB2YXJpYWJsZUxpc3RbaV07XG4gICAgICAgICAgICAgICAgYmluZGluZ3NbeF0gPSB0ZXN0UG9pbnRMaXN0W2ldW29kb21ldGVyW2ldXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHkxID0gdGhpcy5ldmFsdWF0ZShiaW5kaW5ncyk7XG4gICAgICAgICAgICB5MiA9IHRlc3RFeHByLmV2YWx1YXRlKGJpbmRpbmdzKTtcbiAgICAgICAgICAgIC8vIEJvdGggZmluaXRlPyBDaGVjayBmb3IgcmVsYXRpdmUgZXJyb3IuXG4gICAgICAgICAgICBpZiAoaXNGaW5pdGUoeTEpICYmIGlzRmluaXRlKHkyKSkge1xuICAgICAgICAgICAgICAgIGlmICghKE1hdGguYWJzKHkxKTwxZS0xMiAmJiBNYXRoLmFicyh5Mik8MWUtMTIpXG4gICAgICAgICAgICAgICAgICAgICYmIE1hdGguYWJzKHkxLXkyKS9NYXRoLmFicyh5MSk+clRvbCkge1xuICAgICAgICAgICAgICAgICAgICBpc0VxdWFsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIElmIG9uZSBpcyBmaW5pdGUsIG90aGVyIG11c3QgYmUgTmFOXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggKGlzRmluaXRlKHkxKSAmJiAhaXNOYU4oeTIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IChpc0Zpbml0ZSh5MikgJiYgIWlzTmFOKHkxKSkgKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzRXF1YWwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBBZHZhbmNlIHRoZSBvZG9tZXRlci5cbiAgICAgICAgICAgICAgICB2YXIgaj0wO1xuICAgICAgICAgICAgICAgIGRvbmUgPSB0cnVlOyAvLyBUaGlzIHdpbGwgb25seSBwZXJzaXN0IHdoZW4gdGhlIG9kb21ldGVyIGlzIGRvbmUuXG4gICAgICAgICAgICAgICAgd2hpbGUgKGogPCB2YXJpYWJsZUxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIG9kb21ldGVyW2pdKys7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvZG9tZXRlcltqXSA+PSB0ZXN0UG9pbnRMaXN0W2pdLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2RvbWV0ZXJbal0gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgaisrO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF0Y2hJbnB1dHMgJiYgaXNFcXVhbCkge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaE9wO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wID09ICcrJyB8fCB0aGlzLm9wID09ICctJykge1xuICAgICAgICAgICAgICAgICAgICBtYXRjaE9wID0gJysnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcCA9PSAnKicgfHwgdGhpcy5vcCA9PSAnLycpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hPcCA9ICcqJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKChtYXRjaE9wPT0nKycgJiYgdGVzdEV4cHIub3AgIT0gJysnICYmIHRlc3RFeHByLm9wICE9ICctJylcbiAgICAgICAgICAgICAgICAgICAgfHwgKG1hdGNoT3A9PScqJyAmJiB0ZXN0RXhwci5vcCAhPSAnKicgJiYgdGVzdEV4cHIub3AgIT0gJy8nKSkge1xuICAgICAgICAgICAgICAgICAgICBpc0VxdWFsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpc0VxdWFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbGF0QSwgZmxhdEI7XG4gICAgICAgICAgICAgICAgICAgIGZsYXRBID0gdGhpcy5mbGF0dGVuKCk7XG4gICAgICAgICAgICAgICAgICAgIGZsYXRCID0gdGVzdEV4cHIuZmxhdHRlbigpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmxhdEEuaW5wdXRzLmxlbmd0aCA9PSBmbGF0Qi5pbnB1dHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbnB1dE1hdGNoZWQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpPTA7IGk8ZmxhdEEuaW5wdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dE1hdGNoZWRbaV0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBHbyB0aHJvdWdoIGVhY2ggaW5wdXQgb2YgdGVzdEV4cHIgYW5kIHNlZSBpZiBpdCBtYXRjaGVzIG9uIG9mIHRoaXMgaW5wdXRzLlxuICAgICAgICAgICAgICAgICAgICBmb3IgKGk9MDsgaTxmbGF0Qi5pbnB1dHMubGVuZ3RoICYmIGlzRXF1YWw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1hdGNoRm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaj0wOyBqPGZsYXRBLmlucHV0cy5sZW5ndGggJiYgIW1hdGNoRm91bmQ7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW5wdXRNYXRjaGVkW2pdICYmIGZsYXRBLmlucHV0c1tqXS5jb21wYXJlKGZsYXRCLmlucHV0c1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRNYXRjaGVkW2pdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hGb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFtYXRjaEZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNFcXVhbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaXNFcXVhbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4oaXNFcXVhbCk7XG4gICAgfVxuXG4gICAgLy8gQXBwbHkgcmVkdWN0aW9uIHJ1bGVzIHRvIGNyZWF0ZSBhIHJlZHVjZWQgZXhwcmVzc2lvblxuICAgIHJlZHVjZSgpIHtcbiAgICAgICAgdmFyIHdvcmtFeHByID0gdGhpcy5zaW1wbGlmeUNvbnN0YW50cygpO1xuICAgICAgICB2YXIgbWF0Y2hSdWxlcztcblxuICAgICAgICAvLyBDaGVjayBmb3IgcmVkdWN0aW9ucyBvbiBpbnB1dHMuXG4gICAgICAgIGZvciAodmFyIGkgaW4gd29ya0V4cHIuaW5wdXRzKSB7XG4gICAgICAgICAgICB3b3JrRXhwci5pbnB1dHNbaV0gPSB3b3JrRXhwci5pbnB1dHNbaV0ucmVkdWNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgbWF0Y2hSdWxlcyA9IGZpbmRNYXRjaFJ1bGVzKHRoaXMuYnRtLnJlZHVjZVJ1bGVzLCB3b3JrRXhwciwgdHJ1ZSk7XG4gICAgICAgIHdoaWxlIChtYXRjaFJ1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHdvcmtFeHByID0gdGhpcy5idG0ucGFyc2UobWF0Y2hSdWxlc1swXS5zdWJTdHIsIHRoaXMuY29udGV4dCk7XG4gICAgICAgICAgICBtYXRjaFJ1bGVzID0gZmluZE1hdGNoUnVsZXModGhpcy5idG0ucmVkdWNlUnVsZXMsIHdvcmtFeHByLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gd29ya0V4cHI7XG4gICAgfVxuXG4gICAgXG4gICAgZGVyaXZhdGl2ZShpdmFyLCB2YXJMaXN0KSB7XG4gICAgICAgIHJldHVybihuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDApKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAgICBUaGUgbWF0Y2ggbWV0aG9kIGlzIGRlc2lnbmVkIHRvIGNvbXBhcmUgXCJ0aGlzXCIgZXhwcmVzc2lvblxuICAgICAgICB0byB0aGUgZ2l2ZW4gXCJleHByXCIgZXhwcmVzc2lvbiBhbmQgc2VlIGlmIGl0IGlzIGNvbnNpc3RlbnQgd2l0aFxuICAgICAgICB0aGUgY3VycmVudCBiaW5kaW5ncy4gVGhlIGJpbmRpbmdzIHdpbGwgYmUgYW4gb2JqZWN0IHdoZXJlXG4gICAgICAgIHZhcmlhYmxlcyBpbiBcInRoaXNcIiBhcmUgYXNzaWduZWQgdG8gc3RyaW5ncyByZXByZXNlbnRpbmcgZXhwcmVzc2lvbnMuXG4gICAgICAgIElmIHRoZXJlIGlzIGEgbWlzbWF0Y2gsIHJldHVybiBcIm51bGxcIiBhbmQgdGhlIG1hdGNoaW5nIHByb2Nlc3Mgc2hvdWxkIHRlcm1pbmF0ZS5cblxuICAgICAgICBPdmVycmlkZXM6XG4gICAgICAgICAgICAtIG51bWJlcnMsIHRvIGRlYWwgd2l0aCBzY2FsYXIgZm9ybXVsYSB0aGF0IHNpbXBsaWZ5XG4gICAgICAgICAgICAtIHZhcmlhYmxlcywgd2hpY2ggY2FuIG1hdGNoIGFyYml0cmFyeSBleHByZXNzaW9ucy5cbiAgICAgICAgICAgIC0gaW5kZXhlZCBleHByZXNzaW9ucyBtaWdodCBuZWVkIGEgc3BlY2lhbCBtZXRob2QuXG4gICAgICAgICAgICAtIG11bHRpb3AsIHdoZXJlIHNob3VsZCBzZWUgaWYgYSB2YXJpYWJsZSBjYW4gbWF0Y2ggYSBzdWJjb2xsZWN0aW9uIG9mIGlucHV0cy5cbiAgICAqL1xuICAgIG1hdGNoKGV4cHIsIGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciByZXRWYWx1ZSA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT0gZXhwci50eXBlICYmIHRoaXMub3BlcmF0ZVRvVGVYKCkgPT0gZXhwci5vcGVyYXRlVG9UZVgoKSkge1xuICAgICAgICAgICAgcmV0VmFsdWUgPSBiaW5kaW5ncztcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLmlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChyZXRWYWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXRWYWx1ZSA9IHRoaXMuaW5wdXRzW2ldLm1hdGNoKGV4cHIuaW5wdXRzW2ldLCByZXRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxuXG4gICAgaW5wdXRTdWJzdChvcmlnRXhwciwgc3ViRXhwcikge1xuICAgICAgICB2YXIgaSA9IHRoaXMuaW5wdXRzLmluZGV4T2Yob3JpZ0V4cHIpO1xuICAgICAgICBpZiAoaSA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0c1tpXSA9IHN1YkV4cHI7XG4gICAgICAgICAgICBpZiAoc3ViRXhwciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgc3ViRXhwci5wYXJlbnQgPSB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsIi8qIVxuICogQlRNIEphdmFTY3JpcHQgTGlicmFyeSB2QFZFUlNJT05cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kYnJpYW53YWx0b24vQlRNXG4gKlxuICogQ29weXJpZ2h0IEQuIEJyaWFuIFdhbHRvblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIChodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVClcbiAqXG4gKiBEYXRlOiBAREFURVxuICovXG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKiBEZWZpbmUgdGhlIEZ1bmN0aW9uIEV4cHJlc3Npb24gLS0gZGVmaW5lZCBieSBhIGZ1bmN0aW9uIG5hbWUgYW5kIGlucHV0IGV4cHJlc3Npb25cbiAgICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmltcG9ydCB7IGV4cHJlc3Npb24gfSBmcm9tIFwiLi9leHByZXNzaW9uLmpzXCJcbmltcG9ydCB7IHNjYWxhcl9leHByIH0gZnJvbSBcIi4vc2NhbGFyX2V4cHIuanNcIlxuaW1wb3J0IHsgdmFyaWFibGVfZXhwciB9IGZyb20gXCIuL3ZhcmlhYmxlX2V4cHIuanNcIlxuaW1wb3J0IHsgdW5vcF9leHByIH0gZnJvbSBcIi4vdW5vcF9leHByLmpzXCJcbmltcG9ydCB7IGJpbm9wX2V4cHIgfSBmcm9tIFwiLi9iaW5vcF9leHByLmpzXCJcbmltcG9ydCB7IGV4cHJUeXBlIH0gZnJvbSBcIi4vQlRNX3Jvb3QuanNcIlxuXG5leHBvcnQgY2xhc3MgZnVuY3Rpb25fZXhwciBleHRlbmRzIGV4cHJlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKGJ0bSwgbmFtZSwgaW5wdXRFeHByLCByZXN0cmljdERvbWFpbikge1xuICAgICAgICBzdXBlcihidG0pO1xuICAgICAgICB0aGlzLnR5cGUgPSBleHByVHlwZS5mY247XG4gICAgICAgIC8vIENvdW50IGhvdyBtYW55IGRlcml2YXRpdmVzLlxuICAgICAgICB2YXIgcHJpbWVQb3MgPSBuYW1lLmluZGV4T2YoXCInXCIpO1xuICAgICAgICB0aGlzLmRlcml2cyA9IDA7XG4gICAgICAgIGlmIChwcmltZVBvcyA+IDApIHtcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IG5hbWUuc2xpY2UoMCxwcmltZVBvcyk7XG4gICAgICAgICAgICB0aGlzLmRlcml2cyA9IG5hbWUuc2xpY2UocHJpbWVQb3MpLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dEV4cHIgPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICBpbnB1dEV4cHIgPSBuZXcgZXhwcmVzc2lvbih0aGlzLmJ0bSk7XG4gICAgICAgIHRoaXMuaW5wdXRzID0gW2lucHV0RXhwcl07XG4gICAgICAgIGlucHV0RXhwci5wYXJlbnQgPSB0aGlzO1xuICAgICAgICB0aGlzLmRvbWFpbiA9IHJlc3RyaWN0RG9tYWluO1xuXG4gICAgICAgIHRoaXMuYWx0ZXJuYXRlID0gbnVsbDtcbiAgICAgICAgdGhpcy5idWlsdGluID0gdHJ1ZTtcbiAgICAgICAgc3dpdGNoKHRoaXMubmFtZSkge1xuICAgICAgICAgICAgY2FzZSAnYXNpbic6XG4gICAgICAgICAgICBjYXNlICdhY29zJzpcbiAgICAgICAgICAgIGNhc2UgJ2F0YW4nOlxuICAgICAgICAgICAgY2FzZSAnYXNlYyc6XG4gICAgICAgICAgICBjYXNlICdhY3NjJzpcbiAgICAgICAgICAgIGNhc2UgJ2Fjb3QnOlxuICAgICAgICAgICAgICAgIHRoaXMubmFtZSA9ICdhcmMnK3RoaXMubmFtZS5zbGljZSgxLDQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbG9nJzpcbiAgICAgICAgICAgICAgICB0aGlzLm5hbWUgPSAnbG4nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc2luJzpcbiAgICAgICAgICAgIGNhc2UgJ2Nvcyc6XG4gICAgICAgICAgICBjYXNlICd0YW4nOlxuICAgICAgICAgICAgY2FzZSAnY3NjJzpcbiAgICAgICAgICAgIGNhc2UgJ3NlYyc6XG4gICAgICAgICAgICBjYXNlICdjb3QnOlxuICAgICAgICAgICAgY2FzZSAnYXJjc2luJzpcbiAgICAgICAgICAgIGNhc2UgJ2FyY2Nvcyc6XG4gICAgICAgICAgICBjYXNlICdhcmN0YW4nOlxuICAgICAgICAgICAgY2FzZSAnYXJjc2VjJzpcbiAgICAgICAgICAgIGNhc2UgJ2FyY2NzYyc6XG4gICAgICAgICAgICBjYXNlICdhcmNjb3QnOlxuICAgICAgICAgICAgY2FzZSAnc3FydCc6XG4gICAgICAgICAgICBjYXNlICdyb290JzpcbiAgICAgICAgICAgIGNhc2UgJ2Ficyc6XG4gICAgICAgICAgICBjYXNlICdleHAnOlxuICAgICAgICAgICAgY2FzZSAnZXhwYic6XG4gICAgICAgICAgICBjYXNlICdsbic6XG4gICAgICAgICAgICBjYXNlICdsb2cxMCc6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMuYnVpbHRpbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIC8vIFdoZW4gdXNpbmcgYSBjdXN0b20gZnVuY3Rpb24gZm9yIHRoZSBmaXJzdCB0aW1lLCB3ZSBuZWVkIHRvIGNyZWF0ZVxuICAgICAgICAgICAgICAgIC8vIGEgcmFuZG9tIGR1bW15IGZ1bmN0aW9uIGZvciB3b3JrIHdoZW4gbm90IGJvdW5kIHRvIGRlZmluaXRpb24uXG4gICAgICAgICAgICAgICAgLy8gU2VlIGlmIHdlIGhhdmUgYWxyZWFkeSB1c2VkIHRoaXMgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgLy8gRm9yIGNvbnNpc3RlbmN5LCB3ZSBzaG91bGQga2VlcCBpdCB0aGUgc2FtZS5cbiAgICAgICAgICAgICAgICB2YXIgZnVuY3Rpb25FbnRyeSA9IHRoaXMuYnRtLnJhbmRvbUJpbmRpbmdzW3RoaXMubmFtZV07XG4gICAgICAgICAgICAgICAgLy8gSWYgbmV2ZXIgdXNlZCBwcmV2aW91c2x5LCBnZW5lcmF0ZSBhIHJhbmRvbSBmdW5jdGlvbi5cbiAgICAgICAgICAgICAgICAvLyBUaGlzIHdpbGwgYWxsb3cgdmFsaWQgY29tcGFyaXNvbnMgdG8gb2NjdXIuXG4gICAgICAgICAgICAgICAgaWYgKGZ1bmN0aW9uRW50cnkgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uRW50cnkgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25FbnRyeVtcImlucHV0XCJdID0gXCJ4XCI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmb3JtdWxhID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCB0aGlzLmJ0bS5ybmcucmFuZFJhdGlvbmFsKFstMjAsMjBdLFsxLDE1XSkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3VGVybSwgdmFyVGVybTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaT0xOyBpPD02OyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1Rlcm0gPSB0aGlzLmJ0bS5wYXJzZShcInNpbihcIitpK1wiKngpXCIsIFwiZm9ybXVsYVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1Rlcm0gPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgXCIqXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCB0aGlzLmJ0bS5ybmcucmFuZFJhdGlvbmFsKFstMjAsMjBdLFsxLDEwXSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1Rlcm0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybXVsYSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCBcIitcIiwgZm9ybXVsYSwgbmV3VGVybSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25FbnRyeVtcInZhbHVlXCJdID0gWyBmb3JtdWxhIF07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnRtLnJhbmRvbUJpbmRpbmdzW3RoaXMubmFtZV0gPSBmdW5jdGlvbkVudHJ5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kZXJpdnMgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB4dmFyID0gbmV3IHZhcmlhYmxlX2V4cHIodGhpcy5idG0sIFwieFwiKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaT1mdW5jdGlvbkVudHJ5W1widmFsdWVcIl0ubGVuZ3RoOyBpPD10aGlzLmRlcml2czsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbkVudHJ5W1widmFsdWVcIl1baV0gPSBmdW5jdGlvbkVudHJ5W1widmFsdWVcIl1baS0xXS5kZXJpdmF0aXZlKHh2YXIsIHtcInhcIjowfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgdXNpbmcgYSBkZXJpdmF0aXZlIG9mIGEga25vd24gZnVuY3Rpb24sIHRoZW4gd2Ugc2hvdWxkIGNvbXB1dGUgdGhhdCBpbiBhZHZhbmNlLlxuICAgICAgICBpZiAodGhpcy5idWlsdGluICYmIHRoaXMuZGVyaXZzID4gMCkge1xuICAgICAgICAgICAgdmFyIHh2YXIgPSBuZXcgdmFyaWFibGVfZXhwcih0aGlzLmJ0bSwgXCJ4XCIpO1xuICAgICAgICAgICAgdmFyIGRlcml2ID0gbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5idG0sIHRoaXMubmFtZSwgeHZhcik7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy5kZXJpdnM7IGkrKykge1xuICAgICAgICAgICAgICAgIGRlcml2ID0gZGVyaXYuZGVyaXZhdGl2ZSh4dmFyLCB7XCJ4XCI6MH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGJpbmRpbmcgPSB7fTtcbiAgICAgICAgICAgIGJpbmRpbmdbXCJ4XCJdID0gaW5wdXRFeHByO1xuICAgICAgICAgICAgdGhpcy5hbHRlcm5hdGUgPSBkZXJpdi5jb21wb3NlKGJpbmRpbmcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLm5hbWUgKyBcIidcIi5yZXBlYXQodGhpcy5kZXJpdnMpKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZyhlbGVtZW50T25seSkge1xuICAgICAgICB2YXIgZmNuU3RyaW5nLCByZXRTdHJpbmc7XG4gICAgICAgIGlmICh0eXBlb2YgZWxlbWVudE9ubHkgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGVsZW1lbnRPbmx5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZmNuU3RyaW5nID0gdGhpcy5nZXROYW1lKCk7XG4gICAgICAgIGlmIChlbGVtZW50T25seSkge1xuICAgICAgICAgICAgcmV0U3RyaW5nID0gZmNuU3RyaW5nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGFyZ1N0cmluZ3MgPSBbXTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlucHV0cy5sZW5ndGggPT0gMCB8fCB0eXBlb2YgdGhpcy5pbnB1dHNbMF0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBhcmdTdHJpbmdzLnB1c2goJz8nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgICAgICAgICBhcmdTdHJpbmdzLnB1c2godGhpcy5pbnB1dHNbaV0udG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0U3RyaW5nID0gZmNuU3RyaW5nICsgJygnICsgYXJnU3RyaW5ncy5qb2luKCcsJykgKyAnKSc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHJldFN0cmluZyk7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRlc3RlZCBlcXVpdmFsZW50IHN0cmluZ3MuXG4gICAgYWxsU3RyaW5nRXF1aXZzKCkge1xuICAgICAgICB2YXIgYWxsSW5wdXRzID0gW10sIGlucHV0T3B0aW9ucyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICBpbnB1dE9wdGlvbnMucHVzaCh0aGlzLmlucHV0c1tpXS5hbGxTdHJpbmdFcXVpdnMoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJldFZhbHVlID0gW107XG4gICAgICAgIHZhciBmY25TdHJpbmcgPSB0aGlzLmdldE5hbWUoKTtcbiAgICAgICAgLy8gV2FudCB0byBjcmVhdGUgYSBsaXN0IG9mIGFsbCBwb3NzaWJsZSBpbnB1dCByZXByZXNlbnRhdGlvbnMuXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlQXJncyhsZWZ0LCByaWdodE9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChyaWdodE9wdGlvbnMubGVuZ3RoPT0wKSB7XG4gICAgICAgICAgICAgICAgYWxsSW5wdXRzLnB1c2gobGVmdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBOID0gbGVmdC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdmFyIG5ld0xlZnQgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrIGluIGxlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3TGVmdC5wdXNoKGxlZnRba10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrIGluIHJpZ2h0T3B0aW9uc1swXSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdMZWZ0W05dID0gcmlnaHRPcHRpb25zWzBdW2tdO1xuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZUFyZ3MobmV3TGVmdCwgcmlnaHRPcHRpb25zLnNsaWNlKDEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZ2VuZXJhdGVBcmdzKFtdLCBpbnB1dE9wdGlvbnMpO1xuICAgICAgICBmb3IgKHZhciBpIGluIGFsbElucHV0cykge1xuICAgICAgICAgICAgcmV0VmFsdWVbaV0gPSBmY25TdHJpbmcrJygnICsgYWxsSW5wdXRzW2ldLmpvaW4oJysnKSArICcpJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxuXG4gICAgdG9UZVgoc2hvd1NlbGVjdCkge1xuICAgICAgICBpZiAodHlwZW9mIHNob3dTZWxlY3QgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHNob3dTZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGV4U3RyaW5nID0gJyc7XG4gICAgICAgIHZhciBmY25TdHJpbmc7XG4gICAgICAgIHZhciBhcmdTdHJpbmdzID0gW107XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dHNbMF0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGFyZ1N0cmluZ3MucHVzaCgnPycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgICAgIGFyZ1N0cmluZ3MucHVzaCh0aGlzLmlucHV0c1tpXS50b1RlWChzaG93U2VsZWN0KSk7XG4gICAgICAgICAgICAgICAgaWYgKHNob3dTZWxlY3QgJiYgdGhpcy5zZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnU3RyaW5nc1tpXSA9IFwie1xcXFxjb2xvcntibHVlfVwiICsgYXJnU3RyaW5nc1tpXSArIFwifVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCh0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3Npbic6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxzaW4nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY29zJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGNvcyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd0YW4nOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcdGFuJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2NzYyc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxjc2MnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc2VjJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXHNlYyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjb3QnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcY290JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FyY3Npbic6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxzaW5eey0xfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcmNjb3MnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcY29zXnstMX0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYXJjdGFuJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXHRhbl57LTF9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FyY2NzYyc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxjc2Neey0xfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcmNzZWMnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcc2VjXnstMX0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYXJjY290JzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGNvdF57LTF9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3NxcnQnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcbWF0aHJte3NxcnR9JztcbiAgICAgICAgICAgICAgICB0ZXhTdHJpbmcgPSAnXFxcXHNxcnR7JyArIGFyZ1N0cmluZ3NbMF0gKyAnfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdyb290JzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXG1hdGhybXtyb290fSc7XG4gICAgICAgICAgICAgICAgdGV4U3RyaW5nID0gJ1xcXFxzcXJ0WycgKyBhcmdTdHJpbmdzWzFdICsnXXsnICsgYXJnU3RyaW5nc1swXSArICd9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Ficyc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxhYnMnO1xuICAgICAgICAgICAgICAgIHRleFN0cmluZyA9ICdcXFxcbGVmdHwnICsgYXJnU3RyaW5nc1swXSArICdcXFxccmlnaHR8JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2V4cCc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ2VeJztcbiAgICAgICAgICAgICAgICB0ZXhTdHJpbmcgPSAnZV57JyArIGFyZ1N0cmluZ3NbMF0gKyAnfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdleHBiJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGV4cCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdsbic6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxsbidcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2xvZzEwJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGxvZ197MTB9J1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5uYW1lLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxtYXRocm17JyArIHRoaXMubmFtZSArICd9JztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSB0aGlzLm5hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmRlcml2cyA+IDApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRlcml2cyA8PSAzKSB7XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gZmNuU3RyaW5nICsgXCInXCIucmVwZWF0KHRoaXMuZGVyaXZzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gZmNuU3RyaW5nICsgXCJeeyhcIit0aGlzLmRlcml2cytcIil9XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2hvd1NlbGVjdCAmJiB0aGlzLnNlbGVjdCkge1xuICAgICAgICAgICAgZmNuU3RyaW5nID0gXCJcXFxcY29sb3J7cmVkfXtcIiArIGZjblN0cmluZyArIFwifVwiO1xuICAgICAgICAgICAgdGV4U3RyaW5nID0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRleFN0cmluZyA9PSAnJykge1xuICAgICAgICAgICAgdGV4U3RyaW5nID0gZmNuU3RyaW5nICsgJyBcXFxcbWF0aG9wZW57fVxcXFxsZWZ0KCcgKyBhcmdTdHJpbmdzLmpvaW4oJywnKSArICdcXFxccmlnaHQpXFxcXG1hdGhjbG9zZXt9JztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4odGV4U3RyaW5nKTtcbiAgICB9XG5cbiAgICB0b01hdGhNTCgpIHtcbiAgICAgICAgdmFyIHRleFN0cmluZztcbiAgICAgICAgdmFyIGFyZ1N0cmluZztcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0c1swXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgYXJnU3RyaW5nID0gJz8nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXJnU3RyaW5nID0gdGhpcy5pbnB1dHNbMF0udG9NYXRoTUwoKTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2godGhpcy5uYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdzaW4nOlxuICAgICAgICAgICAgY2FzZSAnY29zJzpcbiAgICAgICAgICAgIGNhc2UgJ3Rhbic6XG4gICAgICAgICAgICBjYXNlICdjc2MnOlxuICAgICAgICAgICAgY2FzZSAnc2VjJzpcbiAgICAgICAgICAgIGNhc2UgJ2NvdCc6XG4gICAgICAgICAgICBjYXNlICdhcmNzaW4nOlxuICAgICAgICAgICAgY2FzZSAnYXJjY29zJzpcbiAgICAgICAgICAgIGNhc2UgJ2FyY3Rhbic6XG4gICAgICAgICAgICBjYXNlICdleHAnOlxuICAgICAgICAgICAgY2FzZSAnZXhwYic6XG4gICAgICAgICAgICBjYXNlICdsbic6XG4gICAgICAgICAgICBjYXNlICdhYnMnOlxuICAgICAgICAgICAgICAgIHRleFN0cmluZyA9ICc8YXBwbHk+PCcgKyB0aGlzLm5hbWUgKyAnLz4nICsgYXJnU3RyaW5nICsgJzwvYXBwbHk+JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3NxcnQnOlxuICAgICAgICAgICAgICAgIHRleFN0cmluZyA9ICc8YXBwbHk+PHJvb3QvPicgKyBhcmdTdHJpbmcgKyAnPC9hcHBseT4nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbG9nMTAnOlxuICAgICAgICAgICAgICAgIHRleFN0cmluZyA9ICc8YXBwbHk+PGxvZy8+PGxvZ2Jhc2U+PGNuPjEwPC9jbj48L2xvZ2Jhc2U+JyArIGFyZ1N0cmluZyArICc8L2FwcGx5Pic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRleFN0cmluZyA9ICc8YXBwbHk+PGNpPicgKyBuYW1lICsgJzwvY2k+JyArIGFyZ1N0cmluZyArICc8L2FwcGx5Pic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHRleFN0cmluZyk7XG4gICAgfVxuXG4gICAgb3BlcmF0ZVRvVGVYKCkge1xuICAgICAgICB2YXIgZmNuU3RyaW5nO1xuICAgICAgICBzd2l0Y2godGhpcy5uYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdzaW4nOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcc2luJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Nvcyc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxjb3MnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndGFuJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXHRhbic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjc2MnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcY3NjJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3NlYyc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxzZWMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY290JzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGNvdCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcmNzaW4nOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcc2luXnstMX0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYXJjY29zJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGNvc157LTF9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FyY3Rhbic6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFx0YW5eey0xfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcmNjc2MnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcY3NjXnstMX0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYXJjc2VjJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXHNlY157LTF9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FyY2NvdCc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxjb3Reey0xfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzcXJ0JzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXG1hdGhybXtzcXJ0fSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhYnMnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcYWJzJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2V4cCc6XG4gICAgICAgICAgICBjYXNlICdleHBiJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGV4cCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdsbic6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxsbidcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2xvZzEwJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGxvZ197MTB9J1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5uYW1lLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxtYXRocm17JyArIHRoaXMubmFtZSArICd9JztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSB0aGlzLm5hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmRlcml2cyA+IDApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRlcml2cyA8PSAzKSB7XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gZmNuU3RyaW5nICsgXCInXCIucmVwZWF0KHRoaXMuZGVyaXZzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gZmNuU3RyaW5nICsgXCJeeyhcIit0aGlzLmRlcml2cytcIil9XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4oZmNuU3RyaW5nK1wiKFxcXFxCb3gpXCIpO1xuICAgIH1cblxuICAgIGV2YWx1YXRlKGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciBpbnB1dFZhbCA9IHRoaXMuaW5wdXRzWzBdLmV2YWx1YXRlKGJpbmRpbmdzKTtcbiAgICAgICAgdmFyIHJldFZhbCA9IHVuZGVmaW5lZDtcblxuICAgICAgICBpZiAoaW5wdXRWYWwgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4odW5kZWZpbmVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJ1aWx0LWluIGZ1bmN0aW9ucyB3aXRoIGRlcml2YXRpdmVzIGhhdmUgY29tcHV0ZWQgZGVyaXZhdGl2ZSBlYXJsaWVyLlxuICAgICAgICBpZiAodGhpcy5idWlsdGluICYmIHRoaXMuZGVyaXZzID4gMCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYWx0ZXJuYXRlICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldFZhbCA9IHRoaXMuYWx0ZXJuYXRlLmV2YWx1YXRlKGJpbmRpbmdzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcjogQnVpbHQtaW4gZnVuY3Rpb24gY2FsbGVkIHdpdGggdW5zcGVjaWZpZWQgZGVyaXZhdGl2ZSBmb3JtdWxhLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChiaW5kaW5nc1t0aGlzLm5hbWVdID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIHRoZSBsaXN0IG9mIGNvbW1vbiBtYXRoZW1hdGljYWwgZnVuY3Rpb25zLlxuICAgICAgICAgICAgICAgIHN3aXRjaCh0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc2luJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGguc2luKGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdjb3MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5jb3MoaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Rhbic6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLnRhbihpbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnY3NjJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IDEvTWF0aC5zaW4oaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3NlYyc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSAxL01hdGguY29zKGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdjb3QnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gMS9NYXRoLnRhbihpbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJjc2luJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhpbnB1dFZhbCkgPD0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGguYXNpbihpbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJjY29zJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhpbnB1dFZhbCkgPD0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGguYWNvcyhpbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJjdGFuJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGguYXRhbihpbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJjY3NjJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhpbnB1dFZhbCkgPj0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGguYXNpbigxL2lucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhcmNzZWMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGlucHV0VmFsKSA+PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5hY29zKDEvaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FyY2NvdCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXRWYWwgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGguUEkvMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5QSS8yIC0gTWF0aC5hdGFuKDEvaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3NxcnQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0VmFsID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLnNxcnQoaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Ficyc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLmFicyhpbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZXhwJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZXhwYic6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLmV4cChpbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbG4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0VmFsID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGgubG9nKGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdsb2cxMCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXRWYWwgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5MT0cxMEUgKiBNYXRoLmxvZyhpbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNlZSBpZiB3ZSBoYXZlIGFscmVhZHkgdXNlZCB0aGlzIGZ1bmN0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yIGNvbnNpc3RlbmN5LCB3ZSBzaG91bGQga2VlcCBpdCB0aGUgc2FtZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbkVudHJ5ID0gdGhpcy5idG0ucmFuZG9tQmluZGluZ3NbdGhpcy5uYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIG5ldmVyIHVzZWQgcHJldmlvdXNseSwgZ2VuZXJhdGUgYSByYW5kb20gZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHdpbGwgYWxsb3cgdmFsaWQgY29tcGFyaXNvbnMgdG8gb2NjdXIuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZnVuY3Rpb25FbnRyeSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBBIGN1c3RvbSBmdW5jdGlvbiBuZXZlciBoYWQgYSBiYWNrZW5kIGRlZmluaXRpb24uXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29weSB0aGUgYmluZGluZ3MuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZkJpbmQgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGJpbmRpbmdzKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZCaW5kWyBrZXkgXSA9IGJpbmRpbmdzWyBrZXkgXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm93LCB1c2UgdGhlIHZhcmlhYmxlIG9mIHRoZSBmdW5jdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZCaW5kW2Z1bmN0aW9uRW50cnlbXCJpbnB1dFwiXV0gPSBpbnB1dFZhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNlZSBpZiB3ZSBuZWVkIGFkZGl0aW9uYWwgZGVyaXZhdGl2ZXMgaW4gYmluZGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVyaXZzID49IGZ1bmN0aW9uRW50cnlbXCJ2YWx1ZVwiXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXZhciA9IG5ldyB2YXJpYWJsZV9leHByKHRoaXMuYnRtLCBmdW5jdGlvbkVudHJ5W1wiaW5wdXRcIl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YXJCaW5kID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyQmluZFtpdmFyXSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaT1mdW5jdGlvbkVudHJ5W1widmFsdWVcIl0ubGVuZ3RoOyBpIDw9IHRoaXMuZGVyaXZzOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25FbnRyeVtcInZhbHVlXCJdW2ldID0gZnVuY3Rpb25FbnRyeVtcInZhbHVlXCJdW2ktMV0uZGVyaXZhdGl2ZShpdmFyLCB2YXJCaW5kKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBmdW5jdGlvbkVudHJ5W1widmFsdWVcIl1bdGhpcy5kZXJpdnNdLmV2YWx1YXRlKGZCaW5kKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uRW50cnkgPSBiaW5kaW5nc1t0aGlzLm5hbWVdO1xuICAgICAgICAgICAgICAgIC8vIENvcHkgdGhlIGJpbmRpbmdzLlxuICAgICAgICAgICAgICAgIHZhciBmQmluZCA9IHt9O1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGJpbmRpbmdzKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgICAgICBmQmluZFsga2V5IF0gPSBiaW5kaW5nc1sga2V5IF07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gTm93LCB1c2UgdGhlIHZhcmlhYmxlIG9mIHRoZSBmdW5jdGlvbi5cbiAgICAgICAgICAgICAgICBmQmluZFtmdW5jdGlvbkVudHJ5W1wiaW5wdXRcIl1dID0gaW5wdXRWYWw7XG4gICAgICAgICAgICAgICAgLy8gU2VlIGlmIHdlIG5lZWQgYWRkaXRpb25hbCBkZXJpdmF0aXZlcyBpbiBiaW5kaW5nXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVyaXZzID49IGZ1bmN0aW9uRW50cnlbXCJ2YWx1ZVwiXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl2YXIgPSBuZXcgdmFyaWFibGVfZXhwcih0aGlzLmJ0bSwgZnVuY3Rpb25FbnRyeVtcImlucHV0XCJdKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhckJpbmQgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgdmFyQmluZFtpdmFyXSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGk9ZnVuY3Rpb25FbnRyeVtcInZhbHVlXCJdLmxlbmd0aDsgaSA8PSB0aGlzLmRlcml2czsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbkVudHJ5W1widmFsdWVcIl1baV0gPSBmdW5jdGlvbkVudHJ5W1widmFsdWVcIl1baS0xXS5kZXJpdmF0aXZlKGl2YXIsIHZhckJpbmQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldFZhbCA9IGZ1bmN0aW9uRW50cnlbXCJ2YWx1ZVwiXVt0aGlzLmRlcml2c10uZXZhbHVhdGUoZkJpbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWwpO1xuICAgIH1cblxuICAgIGZsYXR0ZW4oKSB7XG4gICAgICAgIHJldHVybihuZXcgZnVuY3Rpb25fZXhwcih0aGlzLmJ0bSwgdGhpcy5nZXROYW1lKCksIHRoaXMuaW5wdXRzWzBdLmZsYXR0ZW4oKSkpO1xuICAgIH1cblxuICAgIGNvcHkoKSB7XG4gICAgICByZXR1cm4obmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5idG0sIHRoaXMuZ2V0TmFtZSgpLCB0aGlzLmlucHV0c1swXS5jb3B5KCkpKTtcbiAgICB9XG5cbiAgICBjb21wb3NlKGJpbmRpbmdzKSB7XG4gICAgICAgIHJldHVybihuZXcgZnVuY3Rpb25fZXhwcih0aGlzLmJ0bSwgdGhpcy5nZXROYW1lKCksIHRoaXMuaW5wdXRzWzBdLmNvbXBvc2UoYmluZGluZ3MpKSk7XG4gICAgfVxuXG4gICAgZGVyaXZhdGl2ZShpdmFyLCB2YXJMaXN0KSB7XG4gICAgICAgIHZhciB0aGVEZXJpdjtcbiAgICAgICAgdmFyIGRlcEFycmF5ID0gdGhpcy5pbnB1dHNbMF0uZGVwZW5kZW5jaWVzKCk7XG4gICAgICAgIHZhciB1Q29uc3QgPSB0cnVlO1xuICAgICAgICB2YXIgaXZhck5hbWUgPSAodHlwZW9mIGl2YXIgPT0gJ3N0cmluZycpID8gaXZhciA6IGl2YXIubmFtZTtcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPGRlcEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZGVwQXJyYXlbaV0gPT0gaXZhck5hbWUpIHtcbiAgICAgICAgICAgICAgICB1Q29uc3QgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1Q29uc3QpIHtcbiAgICAgICAgICAgIHRoZURlcml2ID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBkeWR1O1xuXG4gICAgICAgICAgICBzd2l0Y2godGhpcy5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Npbic6XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5idG0sICdjb3MnLCB0aGlzLmlucHV0c1swXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnY29zJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgdW5vcF9leHByKHRoaXMuYnRtLCAnLScsIG5ldyBmdW5jdGlvbl9leHByKHRoaXMuYnRtLCAnc2luJywgdGhpcy5pbnB1dHNbMF0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd0YW4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZVNlYyA9IG5ldyBmdW5jdGlvbl9leHByKHRoaXMuYnRtLCAnc2VjJywgdGhpcy5pbnB1dHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnXicsIHRoZVNlYywgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnY3NjJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGVDb3QgPSBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLmJ0bSwgJ2NvdCcsIHRoaXMuaW5wdXRzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgdW5vcF9leHByKHRoaXMuYnRtLCAnLScsIG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnKicsIHRoaXMsIHRoZUNvdCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3NlYyc6XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlVGFuID0gbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5idG0sICd0YW4nLCB0aGlzLmlucHV0c1swXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcqJywgdGhpcywgdGhlVGFuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdjb3QnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZUNzYyA9IG5ldyBmdW5jdGlvbl9leHByKHRoaXMuYnRtLCAnY3NjJywgdGhpcy5pbnB1dHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyB1bm9wX2V4cHIodGhpcy5idG0sICctJywgbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICdeJywgdGhlQ3NjLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDIpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJjc2luJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGVDb3MgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJy0nLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDEpLCBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJ14nLCB0aGlzLmlucHV0c1swXSwgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAyKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnLycsIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMSksIG5ldyBmdW5jdGlvbl9leHByKHRoaXMuYnRtLCAnc3FydCcsIHRoZUNvcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FyY2Nvcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlU2luID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICctJywgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAxKSwgbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICdeJywgdGhpcy5pbnB1dHNbMF0sIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMikpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJy8nLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIC0xKSwgbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5idG0sICdzcXJ0JywgdGhlU2luKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJjdGFuJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0YW5TcSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnXicsIHRoaXMuaW5wdXRzWzBdLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJy8nLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDEpLCBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJysnLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDEpLCB0YW5TcSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FyY3NlYyc6XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlU3EgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJ14nLCB0aGlzLmlucHV0c1swXSwgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlUmFkID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICctJywgdGhlU3EsIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnLycsIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMSksIG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnKicsIG5ldyBmdW5jdGlvbl9leHByKHRoaXMuYnRtLCAnYWJzJywgdGhpcy5pbnB1dHNbMF0pLCBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLmJ0bSwgJ3NxcnQnLCB0aGVSYWQpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJjY3NjJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGVTcSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnXicsIHRoaXMuaW5wdXRzWzBdLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGVSYWQgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJy0nLCB0aGVTcSwgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAxKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcvJywgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAtMSksIG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnKicsIG5ldyBmdW5jdGlvbl9leHByKHRoaXMuYnRtLCAnYWJzJywgdGhpcy5pbnB1dHNbMF0pLCBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLmJ0bSwgJ3NxcnQnLCB0aGVSYWQpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJjY290JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb3RTcSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnXicsIHRoaXMuaW5wdXRzWzBdLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJy8nLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIC0xKSwgbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcrJywgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAxKSwgY290U3EpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdzcXJ0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJy8nLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDEpLCBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJyonLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDIpLCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYWJzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJy8nLCB0aGlzLCB0aGlzLmlucHV0c1swXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZXhwJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZXhwYic6XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5idG0sIHRoaXMubmFtZSwgdGhpcy5pbnB1dHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2xuJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJy8nLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDEpLCB0aGlzLmlucHV0c1swXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbG9nMTAnOlxuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnLycsIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgTWF0aC5MT0cxMEUpLCB0aGlzLmlucHV0c1swXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLmJ0bSwgdGhpcy5nZXROYW1lKCkrXCInXCIsIHRoaXMuaW5wdXRzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF1Q29uc3QgJiYgdGhpcy5pbnB1dHNbMF0udHlwZSA9PSBleHByVHlwZS52YXJpYWJsZSkge1xuICAgICAgICAgICAgICAgIHRoZURlcml2ID0gZHlkdTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGR1ZHggPSB0aGlzLmlucHV0c1swXS5kZXJpdmF0aXZlKGl2YXIsIHZhckxpc3QpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGR1ZHggPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoZURlcml2ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoZURlcml2ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcqJywgZHlkdSwgZHVkeCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybih0aGVEZXJpdik7XG4gICAgfVxufSIsIi8qIVxuICogQlRNIEphdmFTY3JpcHQgTGlicmFyeSB2QFZFUlNJT05cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kYnJpYW53YWx0b24vQlRNXG4gKlxuICogQ29weXJpZ2h0IEQuIEJyaWFuIFdhbHRvblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIChodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVClcbiAqXG4gKiBEYXRlOiBAREFURVxuICovXG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBEZWZpbmUgdGhlIE11bHRpLU9wZXJhbmQgRXhwcmVzc2lvbiAoZm9yIHN1bSBhbmQgcHJvZHVjdClcbiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmltcG9ydCB7IGV4cHJlc3Npb24gfSBmcm9tIFwiLi9leHByZXNzaW9uLmpzXCJcbmltcG9ydCB7IHNjYWxhcl9leHByIH0gZnJvbSBcIi4vc2NhbGFyX2V4cHIuanNcIlxuaW1wb3J0IHsgZXhwclR5cGUsIG9wUHJlYyB9IGZyb20gXCIuL0JUTV9yb290LmpzXCJcblxuZXhwb3J0IGNsYXNzIG11bHRpb3BfZXhwciBleHRlbmRzIGV4cHJlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKGJ0bSwgb3AsIGlucHV0cykge1xuICAgICAgICBzdXBlcihidG0pO1xuICAgICAgICB0aGlzLnR5cGUgPSBleHByVHlwZS5tdWx0aW9wO1xuICAgICAgICB0aGlzLm9wID0gb3A7XG4gICAgICAgIHRoaXMuaW5wdXRzID0gaW5wdXRzOyAvLyBhbiBhcnJheVxuICAgICAgICBmb3IgKHZhciBpIGluIGlucHV0cykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dHNbaV0gPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICAgICAgaW5wdXRzW2ldID0gbmV3IGV4cHJlc3Npb24odGhpcy5idG0pO1xuICAgICAgICAgICAgaW5wdXRzW2ldLnBhcmVudCA9IHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChvcCkge1xuICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLmFkZHN1YjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5tdWx0ZGl2O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBhbGVydChcIlVua25vd24gbXVsdGktb3BlcmFuZCBvcGVyYXRvcjogJ1wiK29wK1wiJy5cIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgdmFyIHRoZVN0cixcbiAgICAgICAgICAgIG9wU3RyLFxuICAgICAgICAgICAgaXNFcnJvciA9IGZhbHNlLFxuICAgICAgICAgICAgc2hvd09wO1xuXG4gICAgICAgIHRoZVN0ciA9ICcnO1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICBzaG93T3AgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0c1tpXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIG9wU3RyID0gJz8nO1xuICAgICAgICAgICAgICAgIGlzRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvcFN0ciA9IHRoaXMuaW5wdXRzW2ldLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgaWYgKCh0aGlzLmlucHV0c1tpXS50eXBlID49IGV4cHJUeXBlLnVub3BcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzW2ldLnByZWMgPD0gdGhpcy5wcmVjKVxuICAgICAgICAgICAgICAgICAgICB8fCAodGhpcy5pbnB1dHNbaV0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzW2ldLm51bWJlci5xICE9IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIG9wUHJlYy5tdWx0ZGl2IDw9IHRoaXMucHJlYylcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgb3BTdHIgPSAnKCcgKyBvcFN0ciArICcpJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGVTdHIgKz0gKCBpPjAgPyB0aGlzLm9wIDogJycgKSArIG9wU3RyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKHRoZVN0cik7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRlc3RlZCBlcXVpdmFsZW50IHN0cmluZ3MuXG4gICAgYWxsU3RyaW5nRXF1aXZzKCkge1xuICAgICAgICB2YXIgYWxsSW5wdXRzQXJyYXlzID0gW107XG5cbiAgICAgICAgdmFyIGluZGV4TGlzdCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICBhbGxJbnB1dHNBcnJheXNbaV0gPSB0aGlzLmlucHV0c1tpXS5hbGxTdHJpbmdFcXVpdnMoKTtcbiAgICAgICAgICAgIGluZGV4TGlzdC5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpbnB1dFBlcm1zID0gcGVybXV0YXRpb25zKGluZGV4TGlzdCk7XG5cbiAgICAgICAgdmFyIHJldFZhbHVlID0gW107XG5cbiAgICAgICAgdmFyIHRoZU9wID0gdGhpcy5vcDtcbiAgICAgICAgaWYgKHRoZU9wID09ICd8Jykge1xuICAgICAgICAgICAgLy8gRG9uJ3Qgd2FudCBcIm9yXCIgdG8gYmUgdHJhbnNsYXRlZCBhcyBhYnNvbHV0ZSB2YWx1ZVxuICAgICAgICAgICAgdGhlT3AgPSAnICQgJztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkU3RyaW5nRXF1aXZzKGluZGV4TGlzdCwgbGVmdFN0cikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBsZWZ0U3RyID09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICBsZWZ0U3RyID0gXCJcIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZXhMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBsZWZ0U3RyICs9IHRoZU9wO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluZGV4TGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHdvcmtJbnB1dHMgPSBhbGxJbnB1dHNBcnJheXNbaW5kZXhMaXN0WzBdXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIHdvcmtJbnB1dHMpIHtcbiAgICAgICAgICAgICAgICAgICAgYnVpbGRTdHJpbmdFcXVpdnMoaW5kZXhMaXN0LnNsaWNlKDEpLCBsZWZ0U3RyICsgXCIoXCIgKyB3b3JrSW5wdXRzW2ldICsgXCIpXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0VmFsdWUucHVzaChsZWZ0U3RyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgaW4gaW5wdXRQZXJtcykge1xuICAgICAgICAgICAgYnVpbGRTdHJpbmdFcXVpdnMoaW5wdXRQZXJtc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ocmV0VmFsdWUpO1xuICAgIH1cblxuICAgIHRvVGVYKHNob3dTZWxlY3QpIHtcbiAgICAgICAgdmFyIHRoZVN0cjtcbiAgICAgICAgdmFyIHRoZU9wO1xuICAgICAgICB2YXIgb3BTdHI7XG4gICAgICAgIHZhciBhcmdTdHJMLCBhcmdTdHJSLCBvcFN0ckwsIG9wU3RyUjtcblxuICAgICAgICBpZiAodHlwZW9mIHNob3dTZWxlY3QgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHNob3dTZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoZU9wID0gdGhpcy5vcDtcbiAgICAgICAgaWYgKHRoaXMub3AgPT0gJyonKSB7XG4gICAgICAgICAgICBpZiAoc2hvd1NlbGVjdCAmJiB0aGlzLnNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHRoZU9wID0gJ1xcXFx0aW1lcyc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoZU9wID0gJyAnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNob3dTZWxlY3QgJiYgdGhpcy5zZWxlY3QpIHtcbiAgICAgICAgICAgIGFyZ1N0ckwgPSAne1xcXFxjb2xvcntibHVlfSc7XG4gICAgICAgICAgICBhcmdTdHJSID0gJ30nO1xuICAgICAgICAgICAgb3BTdHJMID0gJ3tcXFxcY29sb3J7cmVkfSc7XG4gICAgICAgICAgICBvcFN0clIgPSAnfSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcmdTdHJMID0gJyc7XG4gICAgICAgICAgICBhcmdTdHJSID0gJyc7XG4gICAgICAgICAgICBvcFN0ckwgPSAnJztcbiAgICAgICAgICAgIG9wU3RyUiA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhlU3RyID0gJyc7XG4gICAgICAgIHZhciBtaW5QcmVjID0gdGhpcy5wcmVjO1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuaW5wdXRzW2ldID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgb3BTdHIgPSAnPyc7XG4gICAgICAgICAgICAgICAgdGhlU3RyICs9ICggaT4wID8gb3BTdHJMICsgdGhlT3AgKyBvcFN0clIgOiAnJyApICsgb3BTdHI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wID09ICcqJ1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbaV0udHlwZSA9PSBleHByVHlwZS51bm9wICYmIHRoaXMuaW5wdXRzW2ldLm9wID09ICcvJ1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgIShzaG93U2VsZWN0ICYmIHRoaXMuc2VsZWN0KSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG9wU3RyID0gYXJnU3RyTCArIHRoaXMuaW5wdXRzW2ldLmlucHV0c1swXS50b1RlWChzaG93U2VsZWN0KSArIGFyZ1N0clI7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1tpXS5pbnB1dHNbMF0udHlwZSA+PSBleHByVHlwZS51bm9wICYmIHRoaXMuaW5wdXRzW2ldLmlucHV0c1swXS5wcmVjIDwgbWluUHJlYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BTdHIgPSAnXFxcXGxlZnQoJyArIG9wU3RyICsgJ1xcXFxyaWdodCknO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGVTdHIgPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZVN0ciA9ICcxJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoZVN0ciA9ICdcXFxcZnJhY3snICsgdGhlU3RyICsgJ317JyArIG9wU3RyICsgJ30nO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9wID09ICcrJ1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbaV0udHlwZSA9PSBleHByVHlwZS51bm9wICYmIHRoaXMuaW5wdXRzW2ldLm9wID09ICctJ1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgIShzaG93U2VsZWN0ICYmIHRoaXMuc2VsZWN0KSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG9wU3RyID0gYXJnU3RyTCArIHRoaXMuaW5wdXRzW2ldLnRvVGVYKHNob3dTZWxlY3QpICsgYXJnU3RyUjtcbiAgICAgICAgICAgICAgICAgICAgdGhlU3RyICs9IG9wU3RyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG9wU3RyID0gYXJnU3RyTCArIHRoaXMuaW5wdXRzW2ldLnRvVGVYKHNob3dTZWxlY3QpICsgYXJnU3RyUjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCh0aGlzLmlucHV0c1tpXS50eXBlID49IGV4cHJUeXBlLnVub3BcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1tpXS5wcmVjIDw9IG1pblByZWMpXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCAoaT4wICYmIHRoaXMub3AgPT0gJyonICYmIHRoaXMuaW5wdXRzW2ldLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BTdHIgPSAnXFxcXGxlZnQoJyArIG9wU3RyICsgJ1xcXFxyaWdodCknO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoZVN0ciArPSAoIGk+MCA/IG9wU3RyTCArIHRoZU9wICsgb3BTdHJSIDogJycgKSArIG9wU3RyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybih0aGVTdHIpO1xuICAgIH1cblxuICAgIHRvTWF0aE1MKCkge1xuICAgICAgICB2YXIgdGhlU3RyO1xuICAgICAgICB2YXIgdGhlT3A7XG4gICAgICAgIHZhciBvcFN0cjtcblxuICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgIHRoZU9wID0gXCI8cGx1cy8+XCJcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgIHRoZU9wID0gXCI8dGltZXMvPlwiXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB0aGVTdHIgPSBcIjxhcHBseT5cIiArIHRoZU9wO1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuaW5wdXRzW2ldID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgb3BTdHIgPSAnPyc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9wU3RyID0gdGhpcy5pbnB1dHNbaV0udG9NYXRoTUwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoZVN0ciArPSBvcFN0cjtcbiAgICAgICAgfVxuICAgICAgICB0aGVTdHIgKz0gXCI8L2FwcGx5PlwiO1xuXG4gICAgICAgIHJldHVybih0aGVTdHIpO1xuICAgIH1cblxuICAgIG9wZXJhdGVUb1RlWCgpIHtcbiAgICAgICAgdmFyIG9wU3RyaW5nID0gdGhpcy5vcDtcblxuICAgICAgICBzd2l0Y2ggKG9wU3RyaW5nKSB7XG4gICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICBvcFN0cmluZyA9ICdcXFxcdGltZXMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKG9wU3RyaW5nKTtcbiAgICB9XG5cbiAgICBpc0NvbW11dGF0aXZlKCkge1xuICAgICAgICB2YXIgY29tbXV0ZXMgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMub3AgPT09ICcrJyB8fCB0aGlzLm9wID09PSAnKicpIHtcbiAgICAgICAgICAgIGNvbW11dGVzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4oY29tbXV0ZXMpO1xuICAgIH1cblxuICAgIGV2YWx1YXRlKGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciBpbnB1dFZhbDtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciByZXRWYWw7XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLm9wKSB7XG4gICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICByZXRWYWwgPSAwO1xuICAgICAgICAgICAgICAgIGZvciAoaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dFZhbCA9IHRoaXMuaW5wdXRzW2ldLmV2YWx1YXRlKGJpbmRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsICs9IGlucHV0VmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgIHJldFZhbCA9IDE7XG4gICAgICAgICAgICAgICAgZm9yIChpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0VmFsID0gdGhpcy5pbnB1dHNbaV0uZXZhbHVhdGUoYmluZGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICByZXRWYWwgKj0gaW5wdXRWYWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZSBiaW5hcnkgb3BlcmF0b3IgJ1wiICsgdGhpcy5vcCArIFwiJyBpcyBub3QgZGVmaW5lZC5cIik7XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWwpO1xuICAgIH1cblxuICAgIC8vIEZsYXR0ZW4gYW5kIGFsc28gc29ydCB0ZXJtcy5cbiAgICBmbGF0dGVuKCkge1xuICAgICAgICB2YXIgbmV3SW5wdXRzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgIHZhciBuZXh0SW5wdXQgPSB0aGlzLmlucHV0c1tpXS5mbGF0dGVuKCk7XG4gICAgICAgICAgICBpZiAobmV4dElucHV0LnR5cGUgPT0gZXhwclR5cGUubXVsdGlvcCAmJiBuZXh0SW5wdXQub3AgPT0gdGhpcy5vcCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gbmV4dElucHV0LmlucHV0cykge1xuICAgICAgICAgICAgICAgICAgICBuZXdJbnB1dHMucHVzaChuZXh0SW5wdXQuaW5wdXRzW2pdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld0lucHV0cy5wdXNoKG5leHRJbnB1dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmV0VmFsdWU7XG4gICAgICAgIGlmIChuZXdJbnB1dHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIC8vIEFkZGluZyBubyBlbGVtZW50cyA9IDBcbiAgICAgICAgICAgIC8vIE11bHRpcGx5aW5nIG5vIGVsZW1lbnRzID0gMVxuICAgICAgICAgICAgcmV0VmFsdWUgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIHRoaXMub3AgPT0gJysnID8gMCA6IDEpO1xuICAgICAgICB9IGVsc2UgaWYgKG5ld0lucHV0cy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgcmV0VmFsdWUgPSBuZXdJbnB1dHNbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBTb3J0IHRoZSBpbnB1dHMgYnkgcHJlY2VkZW5jZSBmb3IgcHJvZHVjdHNcbiAgICAgICAgICAgIC8vIFVzdWFsbHkgdmVyeSBzbWFsbCwgc28gYnViYmxlIHNvcnQgaXMgZ29vZCBlbm91Z2hcbiAgICAgICAgICAgIGlmICh0aGlzLm9wPT0nKicpIHtcbiAgICAgICAgICAgICAgICB2YXIgdG1wO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxuZXdJbnB1dHMubGVuZ3RoLTE7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqPWkrMTsgajxuZXdJbnB1dHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdJbnB1dHNbaV0udHlwZSA+IG5ld0lucHV0c1tqXS50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG1wID0gbmV3SW5wdXRzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0lucHV0c1tpXSA9IG5ld0lucHV0c1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdJbnB1dHNbal0gPSB0bXA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXRWYWx1ZSA9IG5ldyBtdWx0aW9wX2V4cHIodGhpcy5idG0sIHRoaXMub3AsIG5ld0lucHV0cyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHJldFZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBTZWUgaWYgdGhpcyBvcGVyYXRvciBpcyBub3cgcmVkdW5kYW50LlxuICAgIC8vIFJldHVybiB0aGUgcmVzdWx0aW5nIGV4cHJlc3Npb24uXG4gICAgcmVkdWNlKCkge1xuICAgICAgICB2YXIgbmV3RXhwciA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLmlucHV0cy5sZW5ndGggPD0gMSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gU3VtIHdpdGggbm8gZWxlbWVudHMgPSAwXG4gICAgICAgICAgICAgICAgLy8gUHJvZHVjdCB3aXRoIG5vIGVsZW1lbnRzID0gMVxuICAgICAgICAgICAgICAgIG5ld0V4cHIgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIHRoaXMub3AgPT0gJysnID8gMCA6IDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBTdW0gb3IgcHJvZHVjdCB3aXRoIG9uZSBlbGVtZW50ICppcyogdGhhdCBlbGVtZW50LlxuICAgICAgICAgICAgICAgIG5ld0V4cHIgPSB0aGlzLmlucHV0c1swXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld0V4cHIucGFyZW50ID0gdGhpcy5wYXJlbnQ7XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJlbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5pbnB1dFN1YnN0KHRoaXMsIG5ld0V4cHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybihuZXdFeHByKTtcbiAgICB9XG5cbiAgICBzaW1wbGlmeUNvbnN0YW50cygpIHtcbiAgICAgICAgdmFyIGksXG4gICAgICAgICAgICBjb25zdEluZGV4ID0gW10sXG4gICAgICAgICAgICBuZXdJbnB1dHMgPSBbXTtcbiAgICAgICAgLy8gU2ltcGxpZnkgYWxsIGlucHV0c1xuICAgICAgICAvLyBOb3RpY2Ugd2hpY2ggaW5wdXRzIGFyZSB0aGVtc2VsdmVzIGNvbnN0YW50IFxuICAgICAgICBmb3IgKGkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRzW2ldID0gdGhpcy5pbnB1dHNbaV0uc2ltcGxpZnlDb25zdGFudHMoKTtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRzW2ldLnBhcmVudCA9IHRoaXM7XG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbaV0udHlwZSA9PSBleHByVHlwZS5udW1iZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdEluZGV4LnB1c2goaSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld0lucHV0cy5wdXNoKHRoaXMuaW5wdXRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZvciBhbGwgaW5wdXRzIHRoYXQgYXJlIGNvbnN0YW50cywgZ3JvdXAgdGhlbSB0b2dldGhlciBhbmQgc2ltcGxpZnkuXG4gICAgICAgIHZhciBuZXdFeHByID0gdGhpcztcbiAgICAgICAgaWYgKGNvbnN0SW5kZXgubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgdmFyIG5ld0NvbnN0YW50ID0gdGhpcy5pbnB1dHNbY29uc3RJbmRleFswXV0ubnVtYmVyO1xuICAgICAgICAgICAgZm9yIChpPTE7IGk8Y29uc3RJbmRleC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5vcCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbnN0YW50ID0gbmV3Q29uc3RhbnQuYWRkKHRoaXMuaW5wdXRzW2NvbnN0SW5kZXhbaV1dLm51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdDb25zdGFudCA9IG5ld0NvbnN0YW50Lm11bHRpcGx5KHRoaXMuaW5wdXRzW2NvbnN0SW5kZXhbaV1dLm51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEZvciBhZGRpdGlvbiwgdGhlIGNvbnN0YW50IGdvZXMgdG8gdGhlIGVuZC5cbiAgICAgICAgICAgIC8vIEZvciBtdWx0aXBsaWNhdGlvbiwgdGhlIGNvbnN0YW50IGdvZXMgdG8gdGhlIGJlZ2lubmluZy5cbiAgICAgICAgICAgIHZhciBuZXdJbnB1dDtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5vcCkge1xuICAgICAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgICAgICBuZXdJbnB1dHMucHVzaChuZXdJbnB1dCA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgbmV3Q29uc3RhbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgICAgIG5ld0lucHV0cy5zcGxpY2UoMCwgMCwgbmV3SW5wdXQgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIG5ld0NvbnN0YW50KSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5ld0lucHV0cy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgIG5ld0V4cHIgPSBuZXdJbnB1dHNbMF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld0lucHV0LnBhcmVudCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgbmV3RXhwciA9IG5ldyBtdWx0aW9wX2V4cHIodGhpcy5idG0sIHRoaXMub3AsIG5ld0lucHV0cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKG5ld0V4cHIpO1xuICAgIH1cblxuICAgIC8vIFRoaXMgY29tcGFyaXNvbiByb3V0aW5lIG5lZWRzIHRvIGRlYWwgd2l0aCB0d28gaXNzdWVzLlxuICAgIC8vICgxKSBUaGUgcGFzc2VkIGV4cHJlc3Npb24gaGFzIG1vcmUgaW5wdXRzIHRoYW4gdGhpcyAoaW4gd2hpY2ggY2FzZSB3ZSBncm91cCB0aGVtKVxuICAgIC8vICgyKSBQb3NzaWJpbGl0eSBvZiBjb21tdXRpbmcgbWFrZXMgdGhlIG1hdGNoIHdvcmsuXG4gICAgbWF0Y2goZXhwciwgYmluZGluZ3MpIHtcbiAgICAgICAgZnVuY3Rpb24gY29weUJpbmRpbmdzKGJpbmRpbmdzKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgcmV0VmFsdWUgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBiaW5kaW5ncykge1xuICAgICAgICAgICAgICAgIHJldFZhbHVlW2tleV0gPSBiaW5kaW5nc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuKHJldFZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXRWYWx1ZSA9IG51bGwsXG4gICAgICAgICAgICBuID0gdGhpcy5pbnB1dHMubGVuZ3RoO1xuICAgICAgICBpZiAoZXhwci50eXBlID09IGV4cHJUeXBlLm11bHRpb3AgJiYgdGhpcy5vcCA9PSBleHByLm9wXG4gICAgICAgICAgICAgICAgJiYgbiA8PSBleHByLmlucHV0cy5sZW5ndGgpIHtcblxuICAgICAgICAgICAgLy8gTWF0Y2ggb24gZmlyc3Qgbi0xIGFuZCBncm91cCByZW1haW5kZXIgYXQgZW5kLlxuICAgICAgICAgICAgdmFyIGNtcEV4cHIsXG4gICAgICAgICAgICAgICAgY21wSW5wdXRzID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaTwobi0xKSB8fCBleHByLmlucHV0cy5sZW5ndGg9PW4pIHtcbiAgICAgICAgICAgICAgICAgICAgY21wSW5wdXRzW2ldID0gdGhpcy5idG0ucGFyc2UoZXhwci5pbnB1dHNbaV0udG9TdHJpbmcoKSwgZXhwci5pbnB1dHNbaV0uY29udGV4dCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGNvcGllcyBvZiB0aGUgaW5wdXRzXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdJbnB1dHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaj0wOyBqPD1leHByLmlucHV0cy5sZW5ndGgtbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdJbnB1dHNbal0gPSB0aGlzLmJ0bS5wYXJzZShleHByLmlucHV0c1tuK2otMV0udG9TdHJpbmcoKSwgZXhwci5pbnB1dHNbbitqLTFdLmNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNtcElucHV0c1tpXSA9IG5ldyBtdWx0aW9wX2V4cHIodGhpcy5idG0sIGV4cHIub3AsIG5ld0lucHV0cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY21wRXhwciA9IG5ldyBtdWx0aW9wX2V4cHIodGhpcy5idG0sIGV4cHIub3AsIGNtcElucHV0cyk7XG5cbiAgICAgICAgICAgIC8vIE5vdyBtYWtlIHRoZSBjb21wYXJpc29uLlxuICAgICAgICAgICAgcmV0VmFsdWUgPSBjb3B5QmluZGluZ3MoYmluZGluZ3MpO1xuICAgICAgICAgICAgcmV0VmFsdWUgPSBleHByZXNzaW9uLnByb3RvdHlwZS5tYXRjaC5jYWxsKHRoaXMsIGNtcEV4cHIsIHJldFZhbHVlKTtcblxuICAgICAgICAgICAgLy8gSWYgc3RpbGwgZmFpbCB0byBtYXRjaCwgdHJ5IHRoZSByZXZlcnNlIGdyb3VwaW5nOiBtYXRjaCBvbiBsYXN0IG4tMSBhbmQgZ3JvdXAgYmVnaW5uaW5nLlxuICAgICAgICAgICAgaWYgKHJldFZhbHVlID09IG51bGwgJiYgbiA8IGV4cHIuaW5wdXRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHZhciBkaWZmID0gZXhwci5pbnB1dHMubGVuZ3RoIC0gbjtcbiAgICAgICAgICAgICAgICBjbXBJbnB1dHMgPSBbXTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGk9PTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBjb3BpZXMgb2YgdGhlIGlucHV0c1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0lucHV0cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaj0wOyBqPD1kaWZmOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdJbnB1dHNbal0gPSB0aGlzLmJ0bS5wYXJzZShleHByLmlucHV0c1tqXS50b1N0cmluZygpLCBleHByLmlucHV0c1tqXS5jb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNtcElucHV0c1tpXSA9IG5ldyBtdWx0aW9wX2V4cHIodGhpcy5idG0sIGV4cHIub3AsIG5ld0lucHV0cyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbXBJbnB1dHNbaV0gPSB0aGlzLmJ0bS5wYXJzZShleHByLmlucHV0c1tkaWZmK2ldLnRvU3RyaW5nKCksIGV4cHIuaW5wdXRzW2RpZmYraV0uY29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY21wRXhwciA9IG5ldyBtdWx0aW9wX2V4cHIodGhpcy5idG0sIGV4cHIub3AsIGNtcElucHV0cyk7XG5cbiAgICAgICAgICAgICAgICAvLyBOb3cgbWFrZSB0aGUgY29tcGFyaXNvbi5cbiAgICAgICAgICAgICAgICByZXRWYWx1ZSA9IGNvcHlCaW5kaW5ncyhiaW5kaW5ncyk7XG4gICAgICAgICAgICAgICAgcmV0VmFsdWUgPSBleHByZXNzaW9uLnByb3RvdHlwZS5tYXRjaC5jYWxsKHRoaXMsIGNtcEV4cHIsIHJldFZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ocmV0VmFsdWUpO1xuICAgIH1cblxuICAgIGNvbXBvc2UoYmluZGluZ3MpIHtcbiAgICAgICAgdmFyIG5ld0lucHV0cyA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgIG5ld0lucHV0cy5wdXNoKHRoaXMuaW5wdXRzW2ldLmNvbXBvc2UoYmluZGluZ3MpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXRWYWx1ZTtcbiAgICAgICAgaWYgKG5ld0lucHV0cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0VmFsdWUgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIHRoaXMub3AgPT0gJysnID8gMCA6IDEpO1xuICAgICAgICB9IGVsc2UgaWYgKG5ld0lucHV0cy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgcmV0VmFsdWUgPSBuZXdJbnB1dHNbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXRWYWx1ZSA9IG5ldyBtdWx0aW9wX2V4cHIodGhpcy5idG0sIHRoaXMub3AsIG5ld0lucHV0cyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHJldFZhbHVlKTtcbiAgICB9XG5cbiAgICBkZXJpdmF0aXZlKGl2YXIsIHZhckxpc3QpIHtcbiAgICAgICAgdmFyIGRUZXJtcyA9IFtdO1xuXG4gICAgICAgIHZhciB0aGVEZXJpdjtcbiAgICAgICAgdmFyIGksIGR1ZHg7XG4gICAgICAgIGZvciAoaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlucHV0c1tpXS5pc0NvbnN0YW50KCkpIHtcbiAgICAgICAgICAgICAgICBkdWR4ID0gdGhpcy5pbnB1dHNbaV0uZGVyaXZhdGl2ZShpdmFyLCB2YXJMaXN0KTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBkVGVybXMucHVzaChkdWR4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkUHJvZFRlcm1zID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGogaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PSBqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRQcm9kVGVybXMucHVzaChkdWR4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkUHJvZFRlcm1zLnB1c2godGhpcy5pbnB1dHNbal0uY29tcG9zZSh7fSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGRUZXJtcy5wdXNoKG5ldyBtdWx0aW9wX2V4cHIodGhpcy5idG0sICcqJywgZFByb2RUZXJtcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChkVGVybXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHRoZURlcml2ID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAwKTtcbiAgICAgICAgfSBlbHNlIGlmIChkVGVybXMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIHRoZURlcml2ID0gZFRlcm1zWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgbXVsdGlvcF9leHByKHRoaXMuYnRtLCAnKycsIGRUZXJtcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHRoZURlcml2KTtcbiAgICB9XG59IiwiLyohXG4gKiBCVE0gSmF2YVNjcmlwdCBMaWJyYXJ5IHZAVkVSU0lPTlxuICogaHR0cHM6Ly9naXRodWIuY29tL2RicmlhbndhbHRvbi9CVE1cbiAqXG4gKiBDb3B5cmlnaHQgRC4gQnJpYW4gV2FsdG9uXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUKVxuICpcbiAqIERhdGU6IEBEQVRFXG4gKi9cblxuaW1wb3J0IHsgcmF0aW9uYWxfbnVtYmVyIH0gZnJvbSBcIi4vcmF0aW9uYWxfbnVtYmVyLmpzXCJcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiAgICBSb3V0aW5lcyBmb3IgZGVhbGluZyB3aXRoIHJhbmRvbSB2YWx1ZXNcbiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG4vKiBUbyB1c2UgYSBzZWVkZWQgUk5HLCB3ZSByZWx5IG9uIGFuIG9wZW4gc291cmNlIHByb2plY3QgZm9yIHRoZSB1bmRlcmx5aW5nIG1lY2hhbmljcy4gKi9cblxuLyovLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5hbGVhUFJORyAxLjFcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuaHR0cHM6Ly9naXRodWIuY29tL21hY21jbWVhbnMvYWxlYVBSTkcvYmxvYi9tYXN0ZXIvYWxlYVBSTkctMS4xLmpzXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbk9yaWdpbmFsIHdvcmsgY29weXJpZ2h0IMKpIDIwMTAgSm9oYW5uZXMgQmFhZ8O4ZSwgdW5kZXIgTUlUIGxpY2Vuc2VcblRoaXMgaXMgYSBkZXJpdmF0aXZlIHdvcmsgY29weXJpZ2h0IChjKSAyMDE3LTIwMjAsIFcuIE1hY1wiIE1jTWVhbnMsIHVuZGVyIEJTRCBsaWNlbnNlLlxuUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0IG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuMy4gTmVpdGhlciB0aGUgbmFtZSBvZiB0aGUgY29weXJpZ2h0IGhvbGRlciBub3IgdGhlIG5hbWVzIG9mIGl0cyBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxuVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBIT0xERVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyovXG5mdW5jdGlvbiBhbGVhUFJORygpIHtcbiAgICByZXR1cm4oIGZ1bmN0aW9uKCBhcmdzICkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICBjb25zdCB2ZXJzaW9uID0gJ2FsZWFQUk5HIDEuMS4wJztcblxuICAgICAgICB2YXIgczBcbiAgICAgICAgICAgICwgczFcbiAgICAgICAgICAgICwgczJcbiAgICAgICAgICAgICwgY1xuICAgICAgICAgICAgLCB1aW50YSA9IG5ldyBVaW50MzJBcnJheSggMyApXG4gICAgICAgICAgICAsIGluaXRpYWxBcmdzXG4gICAgICAgICAgICAsIG1hc2h2ZXIgPSAnJ1xuICAgICAgICA7XG5cbiAgICAgICAgLyogcHJpdmF0ZTogaW5pdGlhbGl6ZXMgZ2VuZXJhdG9yIHdpdGggc3BlY2lmaWVkIHNlZWQgKi9cbiAgICAgICAgZnVuY3Rpb24gX2luaXRTdGF0ZSggX2ludGVybmFsU2VlZCApIHtcbiAgICAgICAgICAgIHZhciBtYXNoID0gTWFzaCgpO1xuXG4gICAgICAgICAgICAvLyBpbnRlcm5hbCBzdGF0ZSBvZiBnZW5lcmF0b3JcbiAgICAgICAgICAgIHMwID0gbWFzaCggJyAnICk7XG4gICAgICAgICAgICBzMSA9IG1hc2goICcgJyApO1xuICAgICAgICAgICAgczIgPSBtYXNoKCAnICcgKTtcblxuICAgICAgICAgICAgYyA9IDE7XG5cbiAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgX2ludGVybmFsU2VlZC5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgICAgICBzMCAtPSBtYXNoKCBfaW50ZXJuYWxTZWVkWyBpIF0gKTtcbiAgICAgICAgICAgICAgICBpZiggczAgPCAwICkgeyBzMCArPSAxOyB9XG5cbiAgICAgICAgICAgICAgICBzMSAtPSBtYXNoKCBfaW50ZXJuYWxTZWVkWyBpIF0gKTtcbiAgICAgICAgICAgICAgICBpZiggczEgPCAwICkgeyBzMSArPSAxOyB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgczIgLT0gbWFzaCggX2ludGVybmFsU2VlZFsgaSBdICk7XG4gICAgICAgICAgICAgICAgaWYoIHMyIDwgMCApIHsgczIgKz0gMTsgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXNodmVyID0gbWFzaC52ZXJzaW9uO1xuXG4gICAgICAgICAgICBtYXNoID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwcml2YXRlOiBkZXBlbmRlbnQgc3RyaW5nIGhhc2ggZnVuY3Rpb24gKi9cbiAgICAgICAgZnVuY3Rpb24gTWFzaCgpIHtcbiAgICAgICAgICAgIHZhciBuID0gNDAyMjg3MTE5NzsgLy8gMHhlZmM4MjQ5ZFxuXG4gICAgICAgICAgICB2YXIgbWFzaCA9IGZ1bmN0aW9uKCBkYXRhICkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gY2FjaGUgdGhlIGxlbmd0aFxuICAgICAgICAgICAgICAgIGZvciggdmFyIGkgPSAwLCBsID0gZGF0YS5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgICAgIG4gKz0gZGF0YS5jaGFyQ29kZUF0KCBpICk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB2YXIgaCA9IDAuMDI1MTk2MDMyODI0MTY5MzggKiBuO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgbiAgPSBoID4+PiAwO1xuICAgICAgICAgICAgICAgICAgICBoIC09IG47XG4gICAgICAgICAgICAgICAgICAgIGggKj0gbjtcbiAgICAgICAgICAgICAgICAgICAgbiAgPSBoID4+PiAwO1xuICAgICAgICAgICAgICAgICAgICBoIC09IG47XG4gICAgICAgICAgICAgICAgICAgIG4gKz0gaCAqIDQyOTQ5NjcyOTY7IC8vIDB4MTAwMDAwMDAwICAgICAgMl4zMlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gKCBuID4+PiAwICkgKiAyLjMyODMwNjQzNjUzODY5NjNlLTEwOyAvLyAyXi0zMlxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbWFzaC52ZXJzaW9uID0gJ01hc2ggMC45JztcbiAgICAgICAgICAgIHJldHVybiBtYXNoO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLyogcHJpdmF0ZTogY2hlY2sgaWYgbnVtYmVyIGlzIGludGVnZXIgKi9cbiAgICAgICAgZnVuY3Rpb24gX2lzSW50ZWdlciggX2ludCApIHsgXG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoIF9pbnQsIDEwICkgPT09IF9pbnQ7IFxuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogcmV0dXJuIGEgMzItYml0IGZyYWN0aW9uIGluIHRoZSByYW5nZSBbMCwgMV1cbiAgICAgICAgVGhpcyBpcyB0aGUgbWFpbiBmdW5jdGlvbiByZXR1cm5lZCB3aGVuIGFsZWFQUk5HIGlzIGluc3RhbnRpYXRlZFxuICAgICAgICAqL1xuICAgICAgICB2YXIgcmFuZG9tID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdCA9IDIwOTE2MzkgKiBzMCArIGMgKiAyLjMyODMwNjQzNjUzODY5NjNlLTEwOyAvLyAyXi0zMlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICAgICAgczEgPSBzMjtcblxuICAgICAgICAgICAgcmV0dXJuIHMyID0gdCAtICggYyA9IHQgfCAwICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiByZXR1cm4gYSA1My1iaXQgZnJhY3Rpb24gaW4gdGhlIHJhbmdlIFswLCAxXSAqL1xuICAgICAgICByYW5kb20uZnJhY3Q1MyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJhbmRvbSgpICsgKCByYW5kb20oKSAqIDB4MjAwMDAwICB8IDAgKSAqIDEuMTEwMjIzMDI0NjI1MTU2NWUtMTY7IC8vIDJeLTUzXG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiByZXR1cm4gYW4gdW5zaWduZWQgaW50ZWdlciBpbiB0aGUgcmFuZ2UgWzAsIDJeMzJdICovXG4gICAgICAgIHJhbmRvbS5pbnQzMiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJhbmRvbSgpICogMHgxMDAwMDAwMDA7IC8vIDJeMzJcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IGFkdmFuY2UgdGhlIGdlbmVyYXRvciB0aGUgc3BlY2lmaWVkIGFtb3VudCBvZiBjeWNsZXMgKi9cbiAgICAgICAgcmFuZG9tLmN5Y2xlID0gZnVuY3Rpb24oIF9ydW4gKSB7XG4gICAgICAgICAgICBfcnVuID0gdHlwZW9mIF9ydW4gPT09ICd1bmRlZmluZWQnID8gMSA6ICtfcnVuO1xuICAgICAgICAgICAgaWYoIF9ydW4gPCAxICkgeyBfcnVuID0gMTsgfVxuICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBfcnVuOyBpKysgKSB7IHJhbmRvbSgpOyB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiByZXR1cm4gaW5jbHVzaXZlIHJhbmdlICovXG4gICAgICAgIHJhbmRvbS5yYW5nZSA9IGZ1bmN0aW9uKCkgeyBcbiAgICAgICAgICAgIHZhciBsb0JvdW5kXG4gICAgICAgICAgICAgICAgLCBoaUJvdW5kXG4gICAgICAgICAgICA7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKCBhcmd1bWVudHMubGVuZ3RoID09PSAxICkge1xuICAgICAgICAgICAgICAgIGxvQm91bmQgPSAwO1xuICAgICAgICAgICAgICAgIGhpQm91bmQgPSBhcmd1bWVudHNbIDAgXTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb0JvdW5kID0gYXJndW1lbnRzWyAwIF07XG4gICAgICAgICAgICAgICAgaGlCb3VuZCA9IGFyZ3VtZW50c1sgMSBdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiggYXJndW1lbnRzWyAwIF0gPiBhcmd1bWVudHNbIDEgXSApIHsgXG4gICAgICAgICAgICAgICAgbG9Cb3VuZCA9IGFyZ3VtZW50c1sgMSBdO1xuICAgICAgICAgICAgICAgIGhpQm91bmQgPSBhcmd1bWVudHNbIDAgXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcmV0dXJuIGludGVnZXJcbiAgICAgICAgICAgIGlmKCBfaXNJbnRlZ2VyKCBsb0JvdW5kICkgJiYgX2lzSW50ZWdlciggaGlCb3VuZCApICkgeyBcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vciggcmFuZG9tKCkgKiAoIGhpQm91bmQgLSBsb0JvdW5kICsgMSApICkgKyBsb0JvdW5kOyBcblxuICAgICAgICAgICAgLy8gcmV0dXJuIGZsb2F0XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiByYW5kb20oKSAqICggaGlCb3VuZCAtIGxvQm91bmQgKSArIGxvQm91bmQ7IFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogaW5pdGlhbGl6ZSBnZW5lcmF0b3Igd2l0aCB0aGUgc2VlZCB2YWx1ZXMgdXNlZCB1cG9uIGluc3RhbnRpYXRpb24gKi9cbiAgICAgICAgcmFuZG9tLnJlc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIF9pbml0U3RhdGUoIGluaXRpYWxBcmdzICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiBzZWVkaW5nIGZ1bmN0aW9uICovXG4gICAgICAgIHJhbmRvbS5zZWVkID0gZnVuY3Rpb24oKSB7IFxuICAgICAgICAgICAgX2luaXRTdGF0ZSggQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApICk7XG4gICAgICAgIH07IFxuXG4gICAgICAgIC8qIHB1YmxpYzogc2hvdyB0aGUgdmVyc2lvbiBvZiB0aGUgUk5HICovXG4gICAgICAgIHJhbmRvbS52ZXJzaW9uID0gZnVuY3Rpb24oKSB7IFxuICAgICAgICAgICAgcmV0dXJuIHZlcnNpb247XG4gICAgICAgIH07IFxuXG4gICAgICAgIC8qIHB1YmxpYzogc2hvdyB0aGUgdmVyc2lvbiBvZiB0aGUgUk5HIGFuZCB0aGUgTWFzaCBzdHJpbmcgaGFzaGVyICovXG4gICAgICAgIHJhbmRvbS52ZXJzaW9ucyA9IGZ1bmN0aW9uKCkgeyBcbiAgICAgICAgICAgIHJldHVybiB2ZXJzaW9uICsgJywgJyArIG1hc2h2ZXI7XG4gICAgICAgIH07IFxuXG4gICAgICAgIC8vIHdoZW4gbm8gc2VlZCBpcyBzcGVjaWZpZWQsIGNyZWF0ZSBhIHJhbmRvbSBvbmUgZnJvbSBXaW5kb3dzIENyeXB0byAoTW9udGUgQ2FybG8gYXBwbGljYXRpb24pIFxuICAgICAgICBpZiggYXJncy5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICAgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoIHVpbnRhICk7XG4gICAgICAgICAgICAgYXJncyA9IFsgdWludGFbIDAgXSwgdWludGFbIDEgXSwgdWludGFbIDIgXSBdO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIHN0b3JlIHRoZSBzZWVkIHVzZWQgd2hlbiB0aGUgUk5HIHdhcyBpbnN0YW50aWF0ZWQsIGlmIGFueVxuICAgICAgICBpbml0aWFsQXJncyA9IGFyZ3M7XG5cbiAgICAgICAgLy8gaW5pdGlhbGl6ZSB0aGUgUk5HXG4gICAgICAgIF9pbml0U3RhdGUoIGFyZ3MgKTtcblxuICAgICAgICByZXR1cm4gcmFuZG9tO1xuXG4gICAgfSkoIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSApO1xufTtcblxuZXhwb3J0IGNsYXNzIFJORyB7XG4gICAgY29uc3RydWN0b3Iocm5nU2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKHJuZ1NldHRpbmdzLnJhbmQpIHtcbiAgICAgICAgICB0aGlzLnJhbmQgPSBybmdTZXR0aW5ncy5yYW5kO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxldCBzZWVkO1xuICAgICAgICAgIGlmIChybmdTZXR0aW5ncy5zZWVkID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc2VlZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlZWQgPSBybmdTZXR0aW5ncy5zZWVkO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnJhbmQgPSBhbGVhUFJORyhzZWVkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldFNlZWQoc2VlZCkge1xuICAgICAgICB0aGlzLmFsZWEuc2VlZChzZWVkLnRvU3RyaW5nKCkpO1xuICAgIH1cblxuICAgIC8vIFN0YW5kYXJkIHVuaWZvcm0gZ2VuZXJhdG9yIHZhbHVlcyBpbiBbMCwxKVxuICAgIHJhbmRvbSgpIHtcbiAgICAgICAgcmV0dXJuKHRoaXMucmFuZCgpKTtcbiAgICB9XG5cbiAgICAvLyBSYW5kb21seSBjaG9vc2UgKzEgb3IgLTEuXG4gICAgcmFuZFNpZ24oKSB7XG4gICAgICAgIHZhciBhID0gMipNYXRoLmZsb29yKDIqdGhpcy5yYW5kb20oKSktMTtcbiAgICAgICAgcmV0dXJuKGEpO1xuICAgIH1cblxuICAgIC8vIFJhbmRvbWx5IGNob29zZSBpbnRlZ2VyIHVuaWZvcm1seSBpbiB7bWluLCAuLi4sIG1heH0uXG4gICAgcmFuZEludChtaW4sIG1heCkge1xuICAgICAgICB2YXIgYSA9IG1pbitNYXRoLmZsb29yKCAobWF4LW1pbisxKSp0aGlzLnJhbmRvbSgpICk7XG4gICAgICAgIHJldHVybihhKTtcbiAgICB9XG4gICAgXG4gICAgLy8gUmFuZG9tbHkgY2hvb3NlIGZsb2F0aW5nIHBvaW50IHVuaWZvcm1seSBpbiBbbWluLG1heClcbiAgICByYW5kVW5pZm9ybShtaW4sIG1heCkge1xuICAgICAgICB2YXIgYSA9IG1pbisobWF4LW1pbikqdGhpcy5yYW5kb20oKTtcbiAgICAgICAgcmV0dXJuKGEpO1xuICAgIH1cblxuICAgIC8vIFJhbmRvbWx5IGEgay1sZW5ndGggcGVybXV0ZWQgc3Vic2VxdWVuY2Ugb2Yge21pbiwgLi4uLCBtYXh9XG4gICAgcmFuZENob2ljZShtaW4sIG1heCwgaykge1xuICAgICAgICB2YXIgYSA9IG5ldyBBcnJheSgpO1xuICAgICAgICB2YXIgYiA9IG5ldyBBcnJheSgpO1xuICAgICAgICB2YXIgaSxqO1xuICAgICAgICBmb3IgKGk9MDsgaTw9bWF4LW1pbjsgaSsrKSB7XG4gICAgICAgICAgICBhW2ldID0gbWluK2k7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpPTA7IGk8azsgaSsrKSB7XG4gICAgICAgICAgICBqID0gTWF0aC5mbG9vciggKG1heC1taW4rMS1pKSp0aGlzLnJhbmRvbSgpICk7XG4gICAgICAgICAgICBiW2ldID0gYS5zcGxpY2UoaiwxKVswXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoYik7XG4gICAgfVxuXG4gICAgLy8gR2VuZXJhdGUgYSByYW5kb20gcmF0aW9uYWwgbnVtYmVyLCBwYXNzaW5nIGluIDItbGVuIGFycmF5cyBmb3IgbGltaXRzLlxuICAgIHJhbmRSYXRpb25hbChwTGltcywgcUxpbXMpIHtcbiAgICAgICAgdmFyIHAsIHE7XG5cbiAgICAgICAgLy8gRmluZCB0aGUgcmF3IHJhdGlvbmFsIG51bWJlclxuICAgICAgICBwID0gdGhpcy5yYW5kSW50KHBMaW1zWzBdLCBwTGltc1sxXSk7XG4gICAgICAgIHEgPSB0aGlzLnJhbmRJbnQocUxpbXNbMF0sIHFMaW1zWzFdKTtcblxuICAgICAgICByZXR1cm4gKG5ldyByYXRpb25hbF9udW1iZXIocCxxKSk7XG4gICAgfVxuXG4gICAgLy8gR2VuZXJhdGUgYSByYW5kb20gaGV4IGNvZGUgb2YgZGVzaXJlZCBsZW5ndGguXG4gICAgcmFuZEhleEhhc2gobikge1xuICAgICAgdmFyIGhhc2ggPSAnJztcbiAgICAgIHZhciBjaGFycyA9ICcwMTIzNDU2Nzg5YWJjZGVmJztcbiAgICAgIGZvciAodmFyIGk9MDsgaTxuOyBpKyspIHtcbiAgICAgICAgaGFzaCArPSBjaGFyc1t0aGlzLnJhbmRJbnQoMCwxNSldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGhhc2g7XG4gICAgfVxufSIsIi8qIVxuICogQlRNIEphdmFTY3JpcHQgTGlicmFyeSB2QFZFUlNJT05cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kYnJpYW53YWx0b24vQlRNXG4gKlxuICogQ29weXJpZ2h0IEQuIEJyaWFuIFdhbHRvblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIChodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVClcbiAqXG4gKiBEYXRlOiBAREFURVxuICovXG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbioqIERlZmluZSBhIGNsYXNzIHRvIHdvcmsgd2l0aCByYXRpb25hbCBudW1iZXJzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmltcG9ydCB7IHJlYWxfbnVtYmVyIH0gZnJvbSBcIi4vcmVhbF9udW1iZXIuanNcIjtcblxuLyogUHJpdmF0ZSB1dGlsaXR5IGNvbW1hbmRzLiAqL1xuICBcbmZ1bmN0aW9uIGlzSW50KHgpIHtcbiAgICB2YXIgcmV0VmFsdWUgPSBmYWxzZTtcbiAgICBpZiAoTnVtYmVyLmlzSW50ZWdlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0VmFsdWUgPSAoeCA9PSBNYXRoLmZsb29yKHgpKTtcbiAgICB9IGVsc2Uge1xuICAgIHJldFZhbHVlID0gTnVtYmVyLmlzSW50ZWdlcih4KTtcbiAgICB9XG4gICAgcmV0dXJuIHJldFZhbHVlO1xufVxuXG5cbiAvLyBJbXBsZW1lbnQgRXVjbGlkJ3MgYWxnb3JpdGhtLlxuIGV4cG9ydCBmdW5jdGlvbiBmaW5kR0NEKGEsYikge1xuICAgIHZhciBjO1xuICAgIGEgPSBNYXRoLmFicyhhKTtcbiAgICBiID0gTWF0aC5hYnMoYik7XG4gICAgaWYgKGEgPCBiKSB7XG4gICAgICAgIGM9YTsgYT1iOyBiPWM7XG4gICAgfVxuXG4gICAgaWYgKGIgPT0gMClcbiAgICAgICAgcmV0dXJuIDA7XG5cbiAgICAvLyBJbiB0aGlzIGxvb3AsIHdlIGFsd2F5cyBoYXZlIGEgPiBiLlxuICAgIHdoaWxlIChiID4gMCkge1xuICAgICAgICBjID0gYSAlIGI7XG4gICAgICAgIGEgPSBiO1xuICAgICAgICBiID0gYztcbiAgICB9XG4gICAgcmV0dXJuIGE7XG59XG5cbmV4cG9ydCBjbGFzcyByYXRpb25hbF9udW1iZXIgZXh0ZW5kcyByZWFsX251bWJlciB7XG4gICAgY29uc3RydWN0b3IocCxxKSB7XG4gICAgICAgIGlmIChxID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc3VwZXIocCk7XG4gICAgICAgICAgICB0aGlzLnAgPSBwO1xuICAgICAgICAgICAgdGhpcy5xID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1cGVyKHAvcSk7XG4gICAgICAgICAgICBpZiAocSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wID0gTWF0aC5zcXJ0KC0xKTtcbiAgICAgICAgICAgICAgICB0aGlzLnEgPSAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwID09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnAgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMucSA9IDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChxIDwgMCkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5wID0gLXA7XG4gICAgICAgICAgICAgICAgICB0aGlzLnEgPSAtcTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgdGhpcy5wID0gcDtcbiAgICAgICAgICAgICAgICAgIHRoaXMucSA9IHE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2ltcGxpZnkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhIG51bWVyaWNhbCB2YWx1ZSBvZiB0aGUgcmF0aW9uYWwgZXhwcmVzc2lvbi5cbiAgICB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLnAvdGhpcy5xKTtcbiAgICB9XG4gICAgXG4gICAgLy8gVXNlIEV1Y2xpZCdzIGFsZ29yaXRobSB0byBmaW5kIHRoZSBnY2QsIHRoZW4gcmVkdWNlXG4gICAgc2ltcGxpZnkoKSB7XG4gICAgICAgIHZhciBhO1xuXG4gICAgICAgIC8vIERvbid0IHNpbXBsaWZ5IGlmIG5vdCByYXRpbyBvZiBpbnRlZ2Vycy5cbiAgICAgICAgaWYgKHRoaXMucCAlIDEgIT0gMCB8fCB0aGlzLnEgJSAxICE9IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGEgPSBmaW5kR0NEKHRoaXMucCwgdGhpcy5xKTtcbiAgICAgICAgdGhpcy5wIC89IGE7XG4gICAgICAgIHRoaXMucSAvPSBhO1xuICAgIH1cblxuICAgIGVxdWFsKG90aGVyKSB7XG4gICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIHJhdGlvbmFsX251bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnAudmFsdWVPZigpPT1vdGhlci5wLnZhbHVlT2YoKVxuICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLnEudmFsdWVPZigpID09IG90aGVyLnEudmFsdWVPZigpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy52YWx1ZSgpPT1vdGhlci52YWx1ZSgpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCB0byB0aGlzIHJhdGlvbmFsIGFub3RoZXIgcmF0aW9uYWwgbnVtYmVyIGFuZCBjcmVhdGUgbmV3IG9iamVjdC5cbiAgICBhZGQob3RoZXIpIHtcbiAgICAgICAgdmFyIHN1bTtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgcmF0aW9uYWxfbnVtYmVyKSB7XG4gICAgICAgIHN1bSA9IG5ldyByYXRpb25hbF9udW1iZXIodGhpcy5wKm90aGVyLnErb3RoZXIucCp0aGlzLnEsIHRoaXMucSpvdGhlci5xKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0ludChvdGhlcikpIHtcbiAgICAgICAgc3VtID0gbmV3IHJhdGlvbmFsX251bWJlcih0aGlzLnArb3RoZXIqdGhpcy5xLCB0aGlzLnEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICBzdW0gPSBuZXcgcmVhbF9udW1iZXIodGhpcy52YWx1ZSgpICsgb3RoZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihzdW0pO1xuICAgIH1cblxuICAgIC8vIFN1YnRyYWN0IGZyb20gdGhpcyByYXRpb25hbCBhbm90aGVyIHJhdGlvbmFsIG51bWJlciBhbmQgY3JlYXRlIG5ldyBvYmplY3QuXG4gICAgc3VidHJhY3Qob3RoZXIpIHtcbiAgICAgICAgdmFyIHN1bTtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgcmF0aW9uYWxfbnVtYmVyKSB7XG4gICAgICAgICAgICBzdW0gPSBuZXcgcmF0aW9uYWxfbnVtYmVyKHRoaXMucCpvdGhlci5xLW90aGVyLnAqdGhpcy5xLCB0aGlzLnEqb3RoZXIucSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNJbnQob3RoZXIpKSB7XG4gICAgICAgICAgICBzdW0gPSBuZXcgcmF0aW9uYWxfbnVtYmVyKHRoaXMucC1vdGhlcip0aGlzLnEsIHRoaXMucSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdW0gPSBuZXcgcmVhbF9udW1iZXIodGhpcy52YWx1ZSgpIC0gb3RoZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihzdW0pO1xuICAgIH1cblxuICAgIC8vIE11bHRpcGx5IHRoaXMgcmF0aW9uYWwgYnkgYW5vdGhlciByYXRpb25hbCBudW1iZXIgYW5kIGNyZWF0ZSBuZXcgb2JqZWN0LlxuICAgIG11bHRpcGx5KG90aGVyKSB7XG4gICAgICAgIHZhciBwcm9kdWN0O1xuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiByYXRpb25hbF9udW1iZXIpIHtcbiAgICAgICAgICAgIHByb2R1Y3QgPSBuZXcgcmF0aW9uYWxfbnVtYmVyKHRoaXMucCpvdGhlci5wLCB0aGlzLnEqb3RoZXIucSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNJbnQob3RoZXIpKSB7XG4gICAgICAgICAgICBwcm9kdWN0ID0gbmV3IHJhdGlvbmFsX251bWJlcih0aGlzLnAqb3RoZXIsIHRoaXMucSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9kdWN0ID0gbmV3IHJlYWxfbnVtYmVyKHRoaXMudmFsdWUoKSAqIG90aGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihwcm9kdWN0KTtcbiAgICB9XG5cbiAgICAvLyBEaXZpZGUgdGhpcyByYXRpb25hbCBieSBhbm90aGVyIHJhdGlvbmFsIG51bWJlciBhbmQgY3JlYXRlIG5ldyBvYmplY3QuXG4gICAgZGl2aWRlKG90aGVyKSB7XG4gICAgICAgIHZhciBwcm9kdWN0O1xuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiByYXRpb25hbF9udW1iZXIpIHtcbiAgICAgICAgICAgIHByb2R1Y3QgPSBuZXcgcmF0aW9uYWxfbnVtYmVyKHRoaXMucCpvdGhlci5xLCB0aGlzLnEqb3RoZXIucCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNJbnQob3RoZXIpKSB7XG4gICAgICAgICAgICBwcm9kdWN0ID0gbmV3IHJhdGlvbmFsX251bWJlcih0aGlzLnAsIHRoaXMucSpvdGhlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9kdWN0ID0gbmV3IHJlYWxfbnVtYmVyKHRoaXMudmFsdWUoKSAvIG90aGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihwcm9kdWN0KTtcbiAgICB9XG5cbiAgICAvLyBBZGRpdGl2ZSBJbnZlcnNlXG4gICAgYWRkSW52ZXJzZSgpIHtcbiAgICAgICAgdmFyIGludmVyc2UgPSBuZXcgcmF0aW9uYWxfbnVtYmVyKC10aGlzLnAsIHRoaXMucSk7XG4gICAgICAgIHJldHVybihpbnZlcnNlKTtcbiAgICB9XG5cbiAgICAvLyBNdWx0aXBsaWNhdGl2ZSBJbnZlcnNlXG4gICAgbXVsdEludmVyc2UoKSB7XG4gICAgICAgIHZhciBpbnZlcnNlO1xuICAgICAgICBpZiAodGhpcy5wICE9IDApIHtcbiAgICAgICAgICAgIGludmVyc2UgPSBuZXcgcmF0aW9uYWxfbnVtYmVyKHRoaXMucSwgdGhpcy5wKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGludmVyc2UgPSBuZXcgcmVhbF9udW1iZXIoTmFOKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4oaW52ZXJzZSk7XG4gICAgfVxuXG4gICAgLy8gRm9ybWF0IHRoZSByYXRpb25hbCBudW1iZXIgYXMgc3RyaW5nLlxuICAgIHRvU3RyaW5nKGxlYWRTaWduKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbGVhZFNpZ24gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGxlYWRTaWduID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0ciA9IChsZWFkU2lnbiAmJiB0aGlzLnA+MCkgPyAnKycgOiAnJztcbiAgICAgICAgaWYgKGlzTmFOKHRoaXMucCkpIHtcbiAgICAgICAgICAgIHN0ciA9ICdOYU4nO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucSA9PSAxKSB7XG4gICAgICAgICAgICBzdHIgPSBzdHIgKyB0aGlzLnA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHIgPSBzdHIgKyB0aGlzLnAgKyAnLycgKyB0aGlzLnE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4oc3RyKTtcbiAgICB9XG5cbiAgICAvLyBGb3JtYXQgdGhlIHJhdGlvbmFsIG51bWJlciBhcyBUZVggc3RyaW5nLlxuICAgIHRvVGVYKGxlYWRTaWduKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbGVhZFNpZ24gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGxlYWRTaWduID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0ciA9IChsZWFkU2lnbiAmJiB0aGlzLnA+MCkgPyAnKycgOiAnJztcbiAgICAgICAgaWYgKGlzTmFOKHRoaXMucCkpIHtcbiAgICAgICAgICAgIHN0ciA9ICdcXFxcbWF0aHJte05hTn0nO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucSA9PSAxKSB7XG4gICAgICAgICAgICBzdHIgPSBzdHIgKyB0aGlzLnA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wIDwgMCkge1xuICAgICAgICAgICAgICAgIHN0ciA9ICctXFxcXGZyYWN7JyArIC10aGlzLnAgKyAnfXsnICsgdGhpcy5xICsgJ30nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdHIgPSBzdHIgKyAnXFxcXGZyYWN7JyArIHRoaXMucCArICd9eycgKyB0aGlzLnEgKyAnfSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4oc3RyKTtcbiAgICB9XG5cbiAgICB0b01hdGhNTCgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBsZWFkU2lnbiA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgbGVhZFNpZ24gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb3BBU3RyID0gXCI8Y24+XCIgKyB0aGlzLnAgKyBcIjwvY24+XCIsXG4gICAgICAgICAgICBvcEJTdHIgPSBcIjxjbj5cIiArIHRoaXMucSArIFwiPC9jbj5cIjtcblxuICAgICAgICByZXR1cm4oXCI8Y24+XCIgKyB0aGlzLnRvU3RyaW5nKCkgKyBcIjwvY24+XCIpO1xuXG4gICAgICAgIGlmIChpc05hTih0aGlzLnApKSB7XG4gICAgICAgICAgICBzdHIgPSBcIjxjbj4/PC9jbj5cIjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnEgPT0gMSkge1xuICAgICAgICAgICAgc3RyID0gb3BBU3RyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RyID0gXCI8YXBwbHk+PGRpdmlkZS8+XCIrb3BBU3RyK29wQlN0citcIjwvYXBwbHk+XCI7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG5cblxuIFxuXG5cblxuIiwiLyohXG4gKiBCVE0gSmF2YVNjcmlwdCBMaWJyYXJ5IHZAVkVSU0lPTlxuICogaHR0cHM6Ly9naXRodWIuY29tL2RicmlhbndhbHRvbi9CVE1cbiAqXG4gKiBDb3B5cmlnaHQgRC4gQnJpYW4gV2FsdG9uXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUKVxuICpcbiAqIERhdGU6IEBEQVRFXG4gKi9cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiogRGVmaW5lIGEgZ2VuZXJpYyBjbGFzcyB0byB3b3JrIG51bWJlcnNcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuZXhwb3J0IGNsYXNzIHJlYWxfbnVtYmVyIHtcbiAgICBjb25zdHJ1Y3RvcihhKSB7XG4gICAgICBpZiAodHlwZW9mIGEgPT09ICdudW1iZXInIHx8IGEgaW5zdGFuY2VvZiBOdW1iZXIpIHtcbiAgICAgICAgdGhpcy5udW1iZXIgPSBhO1xuICAgICAgfSBlbHNlIGlmIChhIGluc3RhbmNlb2YgcmVhbF9udW1iZXIpIHtcbiAgICAgICAgdGhpcy5udW1iZXIgPSBhLm51bWJlcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYSBudW1lcmljYWwgdmFsdWUgb2YgdGhlIHJhdGlvbmFsIGV4cHJlc3Npb24uXG4gICAgdmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm51bWJlcjtcbiAgICB9XG4gICAgXG4gICAgLy8gUmVhbCBudW1iZXJzIGhhdmUgbm8gbmF0dXJhbCBzaW1wbGlmaWNhdGlvbiwgYnV0IGRlY2xhcmluZyB0aGUgbWV0aG9kLlxuICAgIHNpbXBsaWZ5KCkge1xuICAgIH1cblxuICAgIGVxdWFsKG90aGVyKSB7XG4gICAgICBpZiAodHlwZW9mIG90aGVyID09PSAnbnVtYmVyJykge1xuICAgICAgICBvdGhlciA9IG5ldyByZWFsX251bWJlcihvdGhlcik7XG4gICAgICB9XG4gICAgICAgIHJldHVybiAodGhpcy52YWx1ZSgpPT1vdGhlci52YWx1ZSgpKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgbnVtYmVycy5cbiAgICBhZGQob3RoZXIpIHtcbiAgICAgIGlmICh0eXBlb2Ygb3RoZXIgPT09ICdudW1iZXInKSB7XG4gICAgICAgIG90aGVyID0gbmV3IHJlYWxfbnVtYmVyKG90aGVyKTtcbiAgICAgIH1cbiAgICAgICAgdmFyIHN1bSA9IG5ldyByZWFsX251bWJlcih0aGlzLm51bWJlciArIG90aGVyLnZhbHVlKCkpO1xuICAgICAgICByZXR1cm4oc3VtKTtcbiAgICB9XG5cbiAgICAvLyBTdWJ0cmFjdCB0aGlzIC0gb3RoZXJcbiAgICBzdWJ0cmFjdChvdGhlcikge1xuICAgICAgaWYgKHR5cGVvZiBvdGhlciA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgb3RoZXIgPSBuZXcgcmVhbF9udW1iZXIob3RoZXIpO1xuICAgICAgfVxuICAgICAgICB2YXIgc3VtID0gbmV3IHJlYWxfbnVtYmVyKHRoaXMubnVtYmVyIC0gb3RoZXIudmFsdWUoKSk7XG4gICAgICAgIHJldHVybihzdW0pO1xuICAgIH1cblxuICAgIC8vIE11bHRpcGx5IHRoaXMgcmF0aW9uYWwgYnkgYW5vdGhlciByYXRpb25hbCBudW1iZXIgYW5kIGNyZWF0ZSBuZXcgb2JqZWN0LlxuICAgIG11bHRpcGx5KG90aGVyKSB7XG4gICAgICBpZiAodHlwZW9mIG90aGVyID09PSAnbnVtYmVyJykge1xuICAgICAgICBvdGhlciA9IG5ldyByZWFsX251bWJlcihvdGhlcik7XG4gICAgICB9XG4gICAgICAgIHZhciBwcm9kdWN0ID0gbmV3IHJlYWxfbnVtYmVyKHRoaXMubnVtYmVyICogb3RoZXIudmFsdWUoKSk7XG4gICAgICAgIHJldHVybihwcm9kdWN0KTtcbiAgICB9XG5cbiAgICAvLyBEaXZpZGUgdGhpcyByYXRpb25hbCBieSBhbm90aGVyIHJhdGlvbmFsIG51bWJlciBhbmQgY3JlYXRlIG5ldyBvYmplY3QuXG4gICAgZGl2aWRlKG90aGVyKSB7XG4gICAgICBpZiAodHlwZW9mIG90aGVyID09PSAnbnVtYmVyJykge1xuICAgICAgICBvdGhlciA9IG5ldyByZWFsX251bWJlcihvdGhlcik7XG4gICAgICB9XG4gICAgICAgIHZhciBwcm9kdWN0O1xuICAgICAgICBpZiAob3RoZXIudmFsdWUgIT0gMCkge1xuICAgICAgICAgICAgcHJvZHVjdCA9IG5ldyByZWFsX251bWJlcih0aGlzLm51bWJlciAvIG90aGVyLnZhbHVlKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvZHVjdCA9IG5ldyByZWFsX251bWJlcihOYU4pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihwcm9kdWN0KTtcbiAgICB9XG5cbiAgICAvLyBBZGRpdGl2ZSBJbnZlcnNlXG4gICAgYWRkSW52ZXJzZSgpIHtcbiAgICAgICAgdmFyIGludmVyc2UgPSBuZXcgcmVhbF9udW1iZXIoLXRoaXMubnVtYmVyKTtcbiAgICAgICAgcmV0dXJuKGludmVyc2UpO1xuICAgIH1cblxuICAgIC8vIE11bHRpcGxpY2F0aXZlIEludmVyc2VcbiAgICBtdWx0SW52ZXJzZSgpIHtcbiAgICAgICAgdmFyIGludmVyc2U7XG4gICAgICAgIGlmICh0aGlzLm51bWJlciAhPSAwKSB7XG4gICAgICAgICAgICBpbnZlcnNlID0gbmV3IHJlYWxfbnVtYmVyKHRoaXMubnVtYmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGludmVyc2UgPSBuZXcgcmVhbF9udW1iZXIoTmFOKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4oaW52ZXJzZSk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcobGVhZFNpZ24pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBsZWFkU2lnbiA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgbGVhZFNpZ24gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3RyID0gKGxlYWRTaWduICYmIHRoaXMubnVtYmVyPjApID8gJysnIDogJyc7XG4gICAgICAgIGlmIChpc05hTih0aGlzLm51bWJlcikpIHtcbiAgICAgICAgICAgIHN0ciA9ICdOYU4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RyID0gc3RyICsgTnVtYmVyKHRoaXMubnVtYmVyLnRvRml4ZWQoMTApKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgcmV0dXJuKHN0cik7XG4gICAgfVxuICBcbiAgICAvLyBGb3JtYXQgdGhlIHJhdGlvbmFsIG51bWJlciBhcyBUZVggc3RyaW5nLlxuICAgIHRvVGVYKGxlYWRTaWduKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbGVhZFNpZ24gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGxlYWRTaWduID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0ciA9IChsZWFkU2lnbiAmJiB0aGlzLm51bWJlcj4wKSA/ICcrJyA6ICcnO1xuICAgICAgICBpZiAoaXNOYU4odGhpcy5udW1iZXIpKSB7XG4gICAgICAgICAgICBzdHIgPSAnXFxcXG1hdGhybXtOYU59JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ciArIE51bWJlcih0aGlzLnRvU3RyaW5nKGxlYWRTaWduKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHN0cik7XG4gICAgfVxuXG4gICAgLy8gRm9ybWF0IGFzIGEgcm9vdCBNYXRoTUwgZWxlbWVudC5cbiAgICB0b01hdGhNTChsZWFkU2lnbikge1xuICAgICAgICByZXR1cm4oXCI8Y24+XCIgKyB0aGlzLnRvU3RyaW5nKCkgKyBcIjwvY24+XCIpO1xuICAgIH1cbn1cblxuXG5cblxuXG4gXG5cblxuXG4iLCIvKiFcbiAqIEJUTSBKYXZhU2NyaXB0IExpYnJhcnkgdkBWRVJTSU9OXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGJyaWFud2FsdG9uL0JUTVxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbioqICBEZWFsaW5nIHdpdGggaWRlbnRpdGllcyBhbmQgcmVkdWN0aW9ucy5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5pbXBvcnQge0JUTSwgZXhwclR5cGUsIGV4cHJWYWx1ZSB9IGZyb20gXCIuL0JUTV9yb290LmpzXCI7XG5cbmNsYXNzIElkZW50aXR5IHtcbiAgICBjb25zdHJ1Y3RvcihyZWZFeHByLCBlcUV4cHIsIGRlc2NyaXB0aW9uLCBpc1ZhbGlkLCBpZE51bSkge1xuICAgICAgICB0aGlzLnJlZkV4cHIgPSByZWZFeHByO1xuICAgICAgICB0aGlzLmVxRXhwciA9IGVxRXhwcjtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgICAgICB0aGlzLmlzVmFsaWQgPSBpc1ZhbGlkO1xuICAgICAgICB0aGlzLmlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5pZE51bSA9IGlkTnVtO1xuICAgIH1cbn1cblxuY2xhc3MgTWF0Y2gge1xuICAgIGNvbnN0cnVjdG9yKHRlc3RSdWxlLCBiaW5kaW5ncykge1xuICAgICAgICAvLyBGaW5kIHVuYm91bmQgdmFyaWFibGVzLlxuICAgICAgICB2YXIgYWxsVmFycyA9IHRlc3RSdWxlLmVxRXhwci5kZXBlbmRlbmNpZXMoKSxcbiAgICAgICAgICAgIG1pc3NWYXJzID0gW107XG4gICAgICAgIGZvciAodmFyIGogaW4gYWxsVmFycykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBiaW5kaW5nc1thbGxWYXJzW2pdXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIG1pc3NWYXJzLnB1c2goYWxsVmFyc1tqXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaiBpbiBtaXNzVmFycykge1xuICAgICAgICAgICAgYmluZGluZ3NbbWlzc1ZhcnNbal1dID0gXCJpbnB1dFwiKygraisxKStcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdWJzdEV4cHIgPSB0ZXN0UnVsZS5lcUV4cHIuY29tcG9zZShiaW5kaW5ncyk7XG5cbiAgICAgICAgdGhpcy5zdWJUZVggPSBzdWJzdEV4cHIudG9UZVgoKTtcbiAgICAgICAgdGhpcy5zdWJTdHIgPSBzdWJzdEV4cHIudG9TdHJpbmcoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gdGVzdFJ1bGUuZGVzY3JpcHRpb247XG4gICAgICAgIGlmIChzdWJzdEV4cHIudHlwZSA9PSBleHByVHlwZS5iaW5vcCAmJiBzdWJzdEV4cHIudmFsdWVUeXBlID09IGV4cHJWYWx1ZS5ib29sKSB7XG4gICAgICAgICAgICB0aGlzLmVxdWF0aW9uID0gdGVzdFJ1bGUucmVmRXhwci50b1RlWCgpICsgXCIgXFxcXGlmZiBcIiArIHRlc3RSdWxlLmVxRXhwci50b1RlWCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lcXVhdGlvbiA9IHRlc3RSdWxlLnJlZkV4cHIudG9UZVgoKSArIFwiPVwiICsgdGVzdFJ1bGUuZXFFeHByLnRvVGVYKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5iaW5kaW5ncyA9IGJpbmRpbmdzO1xuICAgICAgICB0aGlzLm51bUlucHV0cyA9IG1pc3NWYXJzLmxlbmd0aDtcbiAgICAgICAgdGhpcy5ydWxlSUQgPSB0ZXN0UnVsZS5pZE51bTtcbiAgICB9XG59XG5cblxuXG5leHBvcnQgZnVuY3Rpb24gbmV3UnVsZShidG0sIHJlZHVjdGlvbkxpc3QsIGVxdWF0aW9uLCBkZXNjcmlwdGlvbiwgaXNWYWxpZCwgdXNlT25lV2F5LCBjb25zdHJhaW50cykge1xuICAgIHZhciBleHByRm9ybXVsYXMgPSBlcXVhdGlvbi5zcGxpdCgnPT0nKTtcbiAgICBpZiAoZXhwckZvcm11bGFzLmxlbmd0aCAhPSAyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSW52YWxpZCBlcXVhdGlvbiBpbiBpZGVudGl0eSBsaXN0OiBcIiArIGVxdWF0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciByZWZJRD0wOyByZWZJRCA8PSAxOyByZWZJRCsrKSB7XG4gICAgICAgICAgICBpZiAocmVmSUQgPT0gMSAmJiB0eXBlb2YgdXNlT25lV2F5ICE9ICd1bmRlZmluZWQnICYmIHVzZU9uZVdheSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGlkZW50aXR5O1xuXG4gICAgICAgICAgICB2YXIgcmVmRXhwciA9IGJ0bS5wYXJzZShleHByRm9ybXVsYXNbcmVmSURdLFwiZm9ybXVsYVwiKTtcbiAgICAgICAgICAgIHZhciBlcUV4cHIgPSBidG0ucGFyc2UoZXhwckZvcm11bGFzWzEtcmVmSURdLFwiZm9ybXVsYVwiKTtcbiAgICAgICAgICAgIHZhciBudW1WYXJzID0gcmVmRXhwci5kZXBlbmRlbmNpZXMoKS5sZW5ndGg7XG4gICAgICAgICAgICB2YXIgYWxsUmVmRXhwciA9IFtleHByRm9ybXVsYXNbcmVmSURdXTtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgYSBiaWcgc2xvdyBkb3duLCBzbyBqdXN0IG1ha2Ugc3VyZSBlYWNoIHJ1bGUgaXMgd3JpdHRlbiBpbiBtdWx0aXBsZSB3YXlzLlxuICAgICAgICAgICAgLy8gICAgICB2YXIgYWxsUmVmRXhwciA9IHJlZkV4cHIuYWxsU3RyaW5nRXF1aXZzKCk7XG5cbiAgICAgICAgICAgIHZhciB1bmlxdWVFeHByID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIGFsbFJlZkV4cHIpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dEV4cHIgPSBidG0ucGFyc2UoYWxsUmVmRXhwcltpXSxcImZvcm11bGFcIik7XG4gICAgICAgICAgICAgICAgdmFyIGlzTmV3ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqIGluIHVuaXF1ZUV4cHIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJpbmRpbmdzID0gdW5pcXVlRXhwcltqXS5tYXRjaChuZXh0RXhwciwge30pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmluZGluZ3MgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzTmV3ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGlzTmV3KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBydWxlSUQgPSByZWR1Y3Rpb25MaXN0Lmxlbmd0aCsxO1xuICAgICAgICAgICAgICAgICAgICBpZGVudGl0eSA9IG5ldyBJZGVudGl0eShuZXh0RXhwciwgZXFFeHByLCBkZXNjcmlwdGlvbiwgaXNWYWxpZCwgcnVsZUlEKTtcbiAgICAgICAgICAgICAgICAgICAgcmVkdWN0aW9uTGlzdC5wdXNoKGlkZW50aXR5KTtcbiAgICAgICAgICAgICAgICAgICAgdW5pcXVlRXhwci5wdXNoKG5leHRFeHByKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIERpc2FibGUgYSBydWxlIGluIHRoZSBsaXN0LlxuZXhwb3J0IGZ1bmN0aW9uIGRpc2FibGVSdWxlKGJ0bSwgcmVkdWN0aW9uTGlzdCwgZXF1YXRpb24pIHtcbiAgLy8gTWF0Y2ggb25seSBvbiByZWZFeHByLlxuICB2YXIgZXhwckZvcm11bGFzID0gZXF1YXRpb24uc3BsaXQoJz09Jyk7XG4gIHZhciByZWZFeHByLCBlcUV4cHI7XG4gIGlmIChleHByRm9ybXVsYXMubGVuZ3RoID4gMikge1xuICAgIGNvbnNvbGUubG9nKFwiSW52YWxpZCBlcXVhdGlvbiBpbiBpZGVudGl0eSBsaXN0OiBcIiArIGVxdWF0aW9uKTtcbiAgICByZXR1cm47XG4gIH0gZWxzZSB7XG4gICAgcmVmRXhwciA9IGJ0bS5wYXJzZShleHByRm9ybXVsYXNbMF0sXCJmb3JtdWxhXCIpO1xuICB9XG4gIGZvciAodmFyIGkgaW4gcmVkdWN0aW9uTGlzdCkge1xuICAgIHZhciB0ZXN0UnVsZSA9IHJlZHVjdGlvbkxpc3RbaV07XG4gICAgdmFyIGJpbmRpbmdzID0gdGVzdFJ1bGUucmVmRXhwci5tYXRjaChyZWZFeHByLCB7fSlcbiAgICBpZiAoYmluZGluZ3MgIT09IG51bGwpIHtcbiAgICAgIHJlZHVjdGlvbkxpc3RbaV0uaXNBY3RpdmUgPSBmYWxzZTtcbiAgICB9XG59XG59XG5cbi8qICoqKioqKioqKioqKioqKioqKipcbioqIEdpdmVuIGEgbGlzdCBvZiByZWR1Y3Rpb24gcnVsZXMgYW5kIGEgZ2l2ZW4gZXhwcmVzc2lvbixcbioqIHRlc3QgZWFjaCByZWR1Y3Rpb24gcnVsZSB0byBzZWUgaWYgaXQgbWF0Y2hlcyB0aGUgc3RydWN0dXJlLlxuKiogQ3JlYXRlIGFuIGFycmF5IG9mIG5ldyBvYmplY3RzIHdpdGggYmluZGluZ3Mgc3RhdGluZyB3aGF0XG4qKiBzdWJzdGl0dXRpb25zIGFyZSBuZWNlc3NhcnkgdG8gbWFrZSB0aGUgbWF0Y2hlcy5cbioqKioqKioqKioqKioqKioqKiogKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kTWF0Y2hSdWxlcyhyZWR1Y3Rpb25MaXN0LCB0ZXN0RXhwciwgZG9WYWxpZGF0ZSkge1xuICAgIHZhciBtYXRjaExpc3QgPSBbXTtcbiAgICB2YXIgaSwgdGVzdFJ1bGU7XG4gICAgZm9yIChpIGluIHJlZHVjdGlvbkxpc3QpIHtcbiAgICAgICAgdGVzdFJ1bGUgPSByZWR1Y3Rpb25MaXN0W2ldO1xuICAgICAgICB2YXIgYmluZGluZ3MgPSB0ZXN0UnVsZS5yZWZFeHByLm1hdGNoKHRlc3RFeHByLCB7fSlcbiAgICAgICAgaWYgKHRlc3RSdWxlLmlzQWN0aXZlICYmIGJpbmRpbmdzICE9PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSBuZXcgTWF0Y2godGVzdFJ1bGUsIGJpbmRpbmdzKTtcbiAgICAgICAgICAgIG1hdGNoTGlzdC5wdXNoKG1hdGNoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4obWF0Y2hMaXN0KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdFJlZHVjdGlvbnMoYnRtKSB7XG4gICAgdmFyIHJlZHVjZVJ1bGVzID0gbmV3IEFycmF5KCk7XG5cbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICcwK3g9PXgnLCAnQWRkaXRpdmUgSWRlbnRpdHknLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICd4KzA9PXgnLCAnQWRkaXRpdmUgSWRlbnRpdHknLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICcwLXg9PS14JywgJ0FkZGl0aXZlIEludmVyc2UnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICd4LTA9PXgnLCAnQWRkaXRpdmUgSWRlbnRpdHknLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICcwKng9PTAnLCAnTXVsdGlwbHkgYnkgWmVybycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJ3gqMD09MCcsICdNdWx0aXBseSBieSBaZXJvJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAnMSp4PT14JywgJ011bHRpcGxpY2F0aXZlIElkZW50aXR5JywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAneCoxPT14JywgJ011bHRpcGxpY2F0aXZlIElkZW50aXR5JywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAnMC94PT0wJywgJ011bHRpcGx5IGJ5IFplcm8nLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICd4LzE9PXgnLCAnRGl2aWRlIGJ5IE9uZScsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJ3heMT09eCcsICdGaXJzdCBQb3dlcicsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJ3heMD09MScsICdaZXJvIFBvd2VyJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAneF4oLWEpPT0xLyh4XmEpJywgJ05lZ2F0aXZlIFBvd2VyJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAnMV54PT0xJywgJ09uZSB0byBhIFBvd2VyJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAnLTEqeD09LXgnLCAnTXVsdGlwbGljYXRpdmUgSWRlbnRpdHknLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICd4Ki0xPT0teCcsICdNdWx0aXBsaWNhdGl2ZSBJZGVudGl0eScsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJ3gteD09MCcsICdBZGRpdGl2ZSBJbnZlcnNlcyBDYW5jZWwnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICd4Ky14PT0wJywgJ0FkZGl0aXZlIEludmVyc2VzIENhbmNlbCcsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJy14K3g9PTAnLCAnQWRkaXRpdmUgSW52ZXJzZXMgQ2FuY2VsJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAnKC14KSt5PT15LXgnLCBcIlN3YXAgTGVhZGluZyBOZWdhdGl2ZVwiLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICd4KygteSk9PXgteScsIFwiU3VidHJhY3Rpb25cIiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAnKC14KSsoLXkpPT0tKHgreSknLCBcIkZhY3RvciBOZWdhdGlvbiBmcm9tIEFkZGl0aW9uXCIsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJygteCkteT09LSh4K3kpJywgXCJGYWN0b3IgTmVnYXRpb24gZnJvbSBBZGRpdGlvblwiLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICd4LSgteSk9PXgreScsIFwiQWRkaXRpdmUgSW52ZXJzZSdzIEludmVyc2VcIiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAnKC14KSp5PT0tKHgqeSknLCBcIkZhY3RvciBOZWdhdGlvbiBmcm9tIE11bHRpcGxpY2F0aW9uXCIsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJ3gqKC15KT09LSh4KnkpJywgXCJGYWN0b3IgTmVnYXRpb24gZnJvbSBNdWx0aXBsaWNhdGlvblwiLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICcoLXgpL3k9PS0oeC95KScsIFwiRmFjdG9yIE5lZ2F0aW9uIGZyb20gTXVsdGlwbGljYXRpb25cIiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAneC8oLXkpPT0tKHgveSknLCBcIkZhY3RvciBOZWdhdGlvbiBmcm9tIE11bHRpcGxpY2F0aW9uXCIsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJy0oLXgpPT14JywgXCJBZGRpdGl2ZSBJbnZlcnNlJ3MgSW52ZXJzZVwiLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICcvKC94KT09eCcsIFwiTXVsdGlwbGljYXRpdmUgSW52ZXJzZSdzIEludmVyc2VcIiwgdHJ1ZSwgdHJ1ZSk7XG5cbiAgICByZXR1cm4ocmVkdWNlUnVsZXMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdFN1bVJlZHVjdGlvbnMoYnRtKSB7XG4gICAgdmFyIHN1bVJlZHVjdGlvbnMgPSBuZXcgQXJyYXkoKTtcblxuICAgIG5ld1J1bGUoYnRtLCBzdW1SZWR1Y3Rpb25zLCAnYSswPT1hJywgJ1NpbXBsaWZ5IEFkZGl0aW9uIGJ5IFplcm8nLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgc3VtUmVkdWN0aW9ucywgJzArYT09YScsICdTaW1wbGlmeSBBZGRpdGlvbiBieSBaZXJvJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHN1bVJlZHVjdGlvbnMsICdhLWE9PTAnLCAnQ2FuY2VsIEFkZGl0aXZlIEludmVyc2VzJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHN1bVJlZHVjdGlvbnMsICdhKy1hPT0wJywgJ0NhbmNlbCBBZGRpdGl2ZSBJbnZlcnNlcycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBzdW1SZWR1Y3Rpb25zLCAnLWErYT09MCcsICdDYW5jZWwgQWRkaXRpdmUgSW52ZXJzZXMnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgc3VtUmVkdWN0aW9ucywgJ2EqYistYSpiPT0wJywgJ0NhbmNlbCBBZGRpdGl2ZSBJbnZlcnNlcycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBzdW1SZWR1Y3Rpb25zLCAnLWEqYithKmI9PTAnLCAnQ2FuY2VsIEFkZGl0aXZlIEludmVyc2VzJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHN1bVJlZHVjdGlvbnMsICdhKihiK2MpPT1hKmIrYSpjJywgJ0V4cGFuZCBQcm9kdWN0cyBieSBEaXN0cmlidXRpbmcnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgc3VtUmVkdWN0aW9ucywgJyhhK2IpKmM9PWEqYytiKmMnLCAnRXhwYW5kIFByb2R1Y3RzIGJ5IERpc3RyaWJ1dGluZycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBzdW1SZWR1Y3Rpb25zLCAnYSooYi1jKT09YSpiLWEqYycsICdFeHBhbmQgUHJvZHVjdHMgYnkgRGlzdHJpYnV0aW5nJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHN1bVJlZHVjdGlvbnMsICcoYS1iKSpjPT1hKmMtYipjJywgJ0V4cGFuZCBQcm9kdWN0cyBieSBEaXN0cmlidXRpbmcnLCB0cnVlLCB0cnVlKTtcblxuICAgIHJldHVybihzdW1SZWR1Y3Rpb25zKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRQcm9kdWN0UmVkdWN0aW9ucyhidG0pIHtcbiAgICB2YXIgcHJvZHVjdFJlZHVjdGlvbnMgPSBuZXcgQXJyYXkoKTtcblxuICAgIG5ld1J1bGUoYnRtLCBwcm9kdWN0UmVkdWN0aW9ucywgJzAqYT09MCcsICdTaW1wbGlmeSBNdWx0aXBsaWNhdGlvbiBieSBaZXJvJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHByb2R1Y3RSZWR1Y3Rpb25zLCAnYSowPT0wJywgJ1NpbXBsaWZ5IE11bHRpcGxpY2F0aW9uIGJ5IFplcm8nLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcHJvZHVjdFJlZHVjdGlvbnMsICcxKmE9PWEnLCAnU2ltcGxpZnkgTXVsdGlwbGljYXRpb24gYnkgT25lJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHByb2R1Y3RSZWR1Y3Rpb25zLCAnYSoxPT1hJywgJ1NpbXBsaWZ5IE11bHRpcGxpY2F0aW9uIGJ5IE9uZScsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBwcm9kdWN0UmVkdWN0aW9ucywgJ2EvYT09MScsICdDYW5jZWwgTXVsdGlwbGljYXRpdmUgSW52ZXJzZXMnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcHJvZHVjdFJlZHVjdGlvbnMsICdhKi9hPT0xJywgJ0NhbmNlbCBNdWx0aXBsaWNhdGl2ZSBJbnZlcnNlcycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBwcm9kdWN0UmVkdWN0aW9ucywgJy9hKmE9PTEnLCAnQ2FuY2VsIE11bHRpcGxpY2F0aXZlIEludmVyc2VzJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHByb2R1Y3RSZWR1Y3Rpb25zLCAnKGEqYikvKGEqYyk9PWIvYycsICdDYW5jZWwgQ29tbW9uIEZhY3RvcnMnLCB0cnVlLHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBwcm9kdWN0UmVkdWN0aW9ucywgJ2FebS9hXm49PWFeKG0tbiknLCAnQ2FuY2VsIENvbW1vbiBGYWN0b3JzJywgdHJ1ZSx0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcHJvZHVjdFJlZHVjdGlvbnMsICcoYV5tKmIpLyhhXm4qYyk9PShhXihtLW4pKmIpL2MnLCAnQ2FuY2VsIENvbW1vbiBGYWN0b3JzJywgdHJ1ZSx0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcHJvZHVjdFJlZHVjdGlvbnMsICdhKmE9PWFeMicsICdXcml0ZSBQcm9kdWN0cyBvZiBDb21tb24gVGVybXMgYXMgUG93ZXJzJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHByb2R1Y3RSZWR1Y3Rpb25zLCAnYSphXm49PWFeKG4rMSknLCAnV3JpdGUgUHJvZHVjdHMgb2YgQ29tbW9uIFRlcm1zIGFzIFBvd2VycycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBwcm9kdWN0UmVkdWN0aW9ucywgJ2FebiphPT1hXihuKzEpJywgJ1dyaXRlIFByb2R1Y3RzIG9mIENvbW1vbiBUZXJtcyBhcyBQb3dlcnMnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcHJvZHVjdFJlZHVjdGlvbnMsICdhXm0qYV5uPT1hXihtK24pJywgJ1dyaXRlIFByb2R1Y3RzIG9mIENvbW1vbiBUZXJtcyBhcyBQb3dlcnMnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcHJvZHVjdFJlZHVjdGlvbnMsICcoYV4tbSpiKS9jPT1iLyhhXm0qYyknLCAnUmV3cml0ZSBVc2luZyBQb3NpdGl2ZSBQb3dlcnMnLCB0cnVlLHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBwcm9kdWN0UmVkdWN0aW9ucywgJyhiKmFeLW0pL2M9PWIvKGFebSpjKScsICdSZXdyaXRlIFVzaW5nIFBvc2l0aXZlIFBvd2VycycsIHRydWUsdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHByb2R1Y3RSZWR1Y3Rpb25zLCAnYi8oYV4tbSpjKT09KGFebSpiKS9jJywgJ1Jld3JpdGUgVXNpbmcgUG9zaXRpdmUgUG93ZXJzJywgdHJ1ZSx0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcHJvZHVjdFJlZHVjdGlvbnMsICdiLyhjKmFeLW0pPT0oYV5tKmIpL2MnLCAnUmV3cml0ZSBVc2luZyBQb3NpdGl2ZSBQb3dlcnMnLCB0cnVlLHRydWUpO1xuXG4gICAgcmV0dXJuIChwcm9kdWN0UmVkdWN0aW9ucyk7XG4gIH0iLCIvKiFcbiAqIEJUTSBKYXZhU2NyaXB0IExpYnJhcnkgdkBWRVJTSU9OXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGJyaWFud2FsdG9uL0JUTVxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogRGVmaW5lIHRoZSBTY2FsYXIgRXhwcmVzc2lvbiAtLSBhIG51bWVyaWNhbCB2YWx1ZVxuKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuaW1wb3J0IHsgZXhwcmVzc2lvbiB9IGZyb20gXCIuL2V4cHJlc3Npb24uanNcIlxuaW1wb3J0IHsgcmVhbF9udW1iZXIgfSBmcm9tIFwiLi9yZWFsX251bWJlci5qc1wiXG5pbXBvcnQgeyByYXRpb25hbF9udW1iZXIgfSBmcm9tIFwiLi9yYXRpb25hbF9udW1iZXIuanNcIlxuaW1wb3J0IHsgZXhwclR5cGUgfSBmcm9tIFwiLi9CVE1fcm9vdC5qc1wiXG5cbmV4cG9ydCBjbGFzcyBzY2FsYXJfZXhwciBleHRlbmRzIGV4cHJlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKGJ0bSwgbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKGJ0bSk7XG4gICAgICAgIHRoaXMudHlwZSA9IGV4cHJUeXBlLm51bWJlcjtcbiAgICAgICAgaWYgKHR5cGVvZiBudW1iZXIgPT09IFwibnVtYmVyXCIgfHxcbiAgICAgICAgICAgICAgICBudW1iZXIgaW5zdGFuY2VvZiBOdW1iZXIpIHtcbiAgICAgICAgICAgIGlmIChNYXRoLmZsb29yKG51bWJlcik9PW51bWJlcikge1xuICAgICAgICAgICAgICAgIHRoaXMubnVtYmVyID0gbmV3IHJhdGlvbmFsX251bWJlcihudW1iZXIsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm51bWJlciA9IG5ldyByZWFsX251bWJlcihudW1iZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG51bWJlciBpbnN0YW5jZW9mIHJlYWxfbnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5udW1iZXIgPSBudW1iZXI7XG4gICAgICAgIH0gZWxzZSBpZiAobnVtYmVyIGluc3RhbmNlb2Ygc2NhbGFyX2V4cHIpIHtcbiAgICAgICAgICAgIHRoaXMubnVtYmVyID0gbnVtYmVyLm51bWJlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVHJ5aW5nIHRvIGluc3RhbnRpYXRlIGEgc2NhbGFyX2V4cHIgd2l0aCBhIG5vbi1udW1iZXIgb2JqZWN0OiBcIiArIG51bWJlcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250ZXh0ID0gXCJudW1iZXJcIjtcbiAgICB9XG5cbiAgICAvLyBQYXJzZWQgcmVwcmVzZW50YXRpb24uXG4gICAgdG9TdHJpbmcoZWxlbWVudE9ubHkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50T25seSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZWxlbWVudE9ubHkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4odGhpcy5udW1iZXIudG9TdHJpbmcoKSk7XG4gICAgfVxuICAgIFxuICAgIC8vIERpc3BsYXkgcmVwcmVzZW50YXRpb24uXG4gICAgdG9UZVgoc2hvd1NlbGVjdCkge1xuICAgICAgICBpZiAodHlwZW9mIHNob3dTZWxlY3QgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHNob3dTZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgd29yZCA9IHRoaXMubnVtYmVyLnRvVGVYKCk7XG4gICAgICAgIGlmIChzaG93U2VsZWN0ICYmIHRoaXMuc2VsZWN0KSB7XG4gICAgICAgICAgICB3b3JkID0gXCJ7XFxcXGNvbG9ye3JlZH1cIiArIHdvcmQgKyBcIn1cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4od29yZCk7XG4gICAgfVxuICAgIFxuICAgIC8vIE1hdGhNTCByZXByZXNlbnRhdGlvbi5cbiAgICB0b01hdGhNTCgpIHtcbiAgICAgICAgcmV0dXJuKFwiPGNuPlwiICsgdGhpcy50b1N0cmluZygpICsgXCI8L2NuPlwiKTtcbiAgICB9XG4gICAgXG4gICAgLy8gUmV0dXJuIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRlc3RlZCBlcXVpdmFsZW50IHN0cmluZ3MuXG4gICAgYWxsU3RyaW5nRXF1aXZzKCkge1xuICAgICAgICByZXR1cm4oW3RoaXMudG9TdHJpbmcoKV0pO1xuICAgIH1cbiAgICBcbiAgICAvLyBUZXN0IGlmIHJlcHJlc2VudHMgY29uc3RhbnQgdmFsdWUuXG4gICAgaXNDb25zdGFudCgpIHtcbiAgICAgICAgLypcbiAgICAgICAgVGhpcyBjb3VsZCBqdXN0IHVzZSBleHByZXNzaW9uLnByb3RvdHlwZS5jb25zdGFudCwgYnV0IHVzZSB0aGlzXG4gICAgICAgIGJlY2F1c2UgaXQgQUxXQVlTIGlzIHRydWUgZm9yIHNjYWxhcl9leHByIGFuZCBkb2VzIG5vdCBuZWVkIGEgY2hlY2tcbiAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuKHRydWUpO1xuICAgIH1cbiAgICBcbiAgICAvLyBDb21iaW5lIGNvbnN0YW50cyB3aGVyZSBwb3NzaWJsZVxuICAgIHNpbXBsaWZ5Q29uc3RhbnRzKCkge1xuICAgICAgICB2YXIgcmV0VmFsdWU7XG4gICAgICAgIGlmICghdGhpcy5idG0ub3B0aW9ucy5uZWdhdGl2ZU51bWJlcnMgJiYgdGhpcy5udW1iZXIucCA8IDApIHtcbiAgICAgICAgICAgIHZhciB0aGVOdW1iZXIgPSB0aGlzLm51bWJlci5tdWx0aXBseSgtMSk7XG4gICAgICAgICAgICByZXRWYWx1ZSA9IG5ldyB1bm9wX2V4cHIodGhpcy5idG0sICctJywgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCB0aGVOdW1iZXIpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldFZhbHVlID0gdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ocmV0VmFsdWUpO1xuICAgIH1cbiAgICBcbiAgICB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuKHRoaXMubnVtYmVyLnZhbHVlKCkpO1xuICAgIH1cblxuICAgIGV2YWx1YXRlKGJpbmRpbmdzKSB7XG4gICAgICAgIHJldHVybih0aGlzLnZhbHVlKCkpO1xuICAgIH1cbiAgICBcbiAgICBjb3B5KCkge1xuICAgICAgICByZXR1cm4obmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCB0aGlzLm51bWJlcikpO1xuICAgIH1cbiAgICBcbiAgICBjb21wb3NlKGJpbmRpbmdzKSB7XG4gICAgICAgIHJldHVybihuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIHRoaXMubnVtYmVyKSk7XG4gICAgfVxuICAgIFxuICAgIGRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCkge1xuICAgICAgICByZXR1cm4obmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAwKSk7XG4gICAgfVxuICAgIFxuICAgIC8qXG4gICAgICAgIFNlZSBleHByZXNzaW9ucy5wcm90b3R5cGUubWF0Y2ggZm9yIGV4cGxhbmF0aW9uLlxuICAgIFxuICAgICAgICBBIHNjYWxhciBtaWdodCBtYXRjaCBhIGNvbnN0YW50IGZvcm11bGEuXG4gICAgKi9cbiAgICBtYXRjaChleHByLCBiaW5kaW5ncykge1xuICAgICAgICB2YXIgcmV0VmFsdWUgPSBudWxsLFxuICAgICAgICAgICAgdGVzdEV4cHIgPSBleHByO1xuICAgIFxuICAgICAgICAvLyBTcGVjaWFsIG5hbWVkIGNvbnN0YW50cyBjYW4gbm90IG1hdGNoIGV4cHJlc3Npb25zLlxuICAgICAgICBpZiAoZXhwci5pc0NvbnN0YW50KCkgJiYgZXhwci50eXBlICE9IGV4cHJUeXBlLm51bWJlcikge1xuICAgICAgICAgICAgdmFyIHRlc3RFeHByID0gdGhpcy5idG0ucGFyc2UoZXhwci50b1N0cmluZygpLCBleHByLmNvbnRleHQpLnNpbXBsaWZ5Q29uc3RhbnRzKCk7XG4gICAgICAgICAgICBpZiAodGhpcy50b1N0cmluZygpID09PSB0ZXN0RXhwci50b1N0cmluZygpKSB7XG4gICAgICAgICAgICAgIHJldFZhbHVlID0gYmluZGluZ3M7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGVzdEV4cHIudHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAmJiB0aGlzLm51bWJlci5lcXVhbCh0ZXN0RXhwci5udW1iZXIpKSB7XG4gICAgICAgICAgICByZXRWYWx1ZSA9IGJpbmRpbmdzO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfSAgICBcbn1cblxuIiwiLyohXG4gKiBCVE0gSmF2YVNjcmlwdCBMaWJyYXJ5IHZAVkVSU0lPTlxuICogaHR0cHM6Ly9naXRodWIuY29tL2RicmlhbndhbHRvbi9CVE1cbiAqXG4gKiBDb3B5cmlnaHQgRC4gQnJpYW4gV2FsdG9uXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUKVxuICpcbiAqIERhdGU6IEBEQVRFXG4gKi9cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIERlZmluZSB0aGUgVW5hcnkgRXhwcmVzc2lvbiAtLSBkZWZpbmVkIGJ5IGFuIG9wZXJhdG9yIGFuZCBhbiBpbnB1dC5cbiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmltcG9ydCB7IGV4cHJlc3Npb24gfSBmcm9tIFwiLi9leHByZXNzaW9uLmpzXCJcbmltcG9ydCB7IHNjYWxhcl9leHByIH0gZnJvbSBcIi4vc2NhbGFyX2V4cHIuanNcIlxuaW1wb3J0IHsgYmlub3BfZXhwciB9IGZyb20gXCIuL2Jpbm9wX2V4cHIuanNcIlxuaW1wb3J0IHsgZXhwclR5cGUsIG9wUHJlYyB9IGZyb20gXCIuL0JUTV9yb290LmpzXCJcblxuZXhwb3J0IGNsYXNzIHVub3BfZXhwciBleHRlbmRzIGV4cHJlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKGJ0bSwgb3AsIGlucHV0KSB7XG4gICAgICAgIHN1cGVyKGJ0bSk7XG4gICAgICAgIHRoaXMudHlwZSA9IGV4cHJUeXBlLnVub3A7XG4gICAgICAgIHRoaXMub3AgPSBvcDtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIGlucHV0ID0gbmV3IGV4cHJlc3Npb24oKTtcbiAgICAgICAgdGhpcy5pbnB1dHMgPSBbaW5wdXRdO1xuICAgICAgICAgICAgaW5wdXQucGFyZW50ID0gdGhpcztcbiAgICAgICAgc3dpdGNoIChvcCkge1xuICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLm11bHRkaXY7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICB0aGlzLnByZWMgPSBvcFByZWMubXVsdGRpdjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgICAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5wb3dlcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJVbmtub3duIHVuYXJ5IG9wZXJhdG9yOiAnXCIrb3ArXCInLlwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICB2YXIgdGhlU3RyO1xuICAgICAgICB2YXIgb3BTdHI7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0c1swXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb3BTdHIgPSAnPyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcFN0ciA9IHRoaXMuaW5wdXRzWzBdLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCh0aGlzLmlucHV0c1swXS50eXBlID49IGV4cHJUeXBlLnVub3BcbiAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1swXS5wcmVjIDwgdGhpcy5wcmVjKVxuICAgICAgICAgICAgfHwgKHRoaXMuaW5wdXRzWzBdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgJiYgb3BTdHIuaW5kZXhPZignLycpID49IDBcbiAgICAgICAgICAgICAgICAmJiBvcFByZWMubXVsdGRpdiA8PSB0aGlzLnByZWMpXG4gICAgICAgICAgICApIFxuICAgICAgICB7XG4gICAgICAgICAgICB0aGVTdHIgPSB0aGlzLm9wICsgJygnICsgb3BTdHIgKyAnKSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGVTdHIgPSB0aGlzLm9wICsgb3BTdHI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4odGhlU3RyKTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgdGVzdGVkIGVxdWl2YWxlbnQgc3RyaW5ncy5cbiAgICBhbGxTdHJpbmdFcXVpdnMoKSB7XG4gICAgICAgIHZhciBhbGxJbnB1dHMgPSB0aGlzLmlucHV0c1swXS5hbGxTdHJpbmdFcXVpdnMoKTtcbiAgICAgICAgdmFyIHJldFZhbHVlID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSBpbiBhbGxJbnB1dHMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1swXS50eXBlID49IGV4cHJUeXBlLnVub3AgJiYgdGhpcy5pbnB1dHNbMF0ucHJlYyA8PSB0aGlzLnByZWMpIHtcbiAgICAgICAgICAgICAgICByZXRWYWx1ZVtpXSA9IHRoaXMub3AgKyAnKCcgKyBhbGxJbnB1dHNbaV0gKyAnKSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldFZhbHVlW2ldID0gdGhpcy5vcCArIGFsbElucHV0c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxuXG4gICAgdG9UZVgoc2hvd1NlbGVjdCkge1xuICAgICAgICB2YXIgdGhlU3RyO1xuICAgICAgICB2YXIgb3BTdHIsIHRoZU9wO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygc2hvd1NlbGVjdCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgc2hvd1NlbGVjdCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0c1swXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb3BTdHIgPSAnPyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcFN0ciA9IHRoaXMuaW5wdXRzWzBdLnRvVGVYKHNob3dTZWxlY3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhlT3AgPSB0aGlzLm9wO1xuICAgICAgICBpZiAodGhlT3AgPT0gJy8nKSB7XG4gICAgICAgICAgICB0aGVPcCA9ICdcXFxcZGl2ICc7XG4gICAgICAgICAgICBpZiAoc2hvd1NlbGVjdCAmJiB0aGlzLnNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHRoZVN0ciA9IFwie1xcXFxjb2xvcntyZWR9XCIgKyB0aGlzLm9wICsgXCJ9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnXFxcXGxlZnQoe1xcXFxjb2xvcntibHVlfScgKyBvcFN0ciArICd9XFxcXHJpZ2h0KSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoZVN0ciA9ICdcXFxcZnJhY3sxfXsnICsgb3BTdHIgKyAnfSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc2hvd1NlbGVjdCAmJiB0aGlzLnNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHRoZVN0ciA9IFwie1xcXFxjb2xvcntyZWR9XCIgKyB0aGlzLm9wICsgXCJ9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnXFxcXGxlZnQoe1xcXFxjb2xvcntibHVlfScgKyBvcFN0ciArICd9XFxcXHJpZ2h0KSc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW5wdXRzWzBdLnR5cGUgPj0gZXhwclR5cGUudW5vcCAmJiB0aGlzLmlucHV0c1swXS5wcmVjIDw9IHRoaXMucHJlY1xuICAgICAgICAgICAgICAgICYmICh0aGlzLmlucHV0c1swXS50eXBlICE9IGV4cHJUeXBlLnVub3AgfHwgdGhpcy5vcCAhPSAnLScgfHwgdGhpcy5pbnB1dHNbMF0ub3AgIT0gJy8nKSkge1xuICAgICAgICAgICAgICAgIHRoZVN0ciA9IHRoZU9wICsgJ1xcXFxsZWZ0KCcgKyBvcFN0ciArICdcXFxccmlnaHQpJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhlU3RyID0gdGhlT3AgKyBvcFN0cjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4odGhlU3RyKTtcbiAgICB9XG5cbiAgICB0b01hdGhNTCgpIHtcbiAgICAgICAgdmFyIHRoZVN0cjtcbiAgICAgICAgdmFyIG9wU3RyO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dHNbMF0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG9wU3RyID0gJz8nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3BTdHIgPSB0aGlzLmlucHV0c1swXS50b01hdGhNTCgpO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAodGhpcy5vcCkge1xuICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgdGhlU3RyID0gb3BTdHI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICB0aGVTdHIgPSBcIjxhcHBseT48bWludXMvPlwiICsgb3BTdHIgKyBcIjwvYXBwbHk+XCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICB0aGVTdHIgPSBcIjxhcHBseT48ZGl2aWRlLz48Y24+MTwvY24+XCIgKyBvcFN0ciArIFwiPC9hcHBseT5cIjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybih0aGVTdHIpO1xuICAgIH1cblxuICAgIG9wZXJhdGVUb1RlWCgpIHtcbiAgICAgICAgdmFyIG9wU3RyaW5nID0gdGhpcy5vcDtcblxuICAgICAgICBpZiAob3BTdHJpbmcgPT09ICcvJykge1xuICAgICAgICAgICAgb3BTdHJpbmcgPSAnXFxcXGRpdic7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ob3BTdHJpbmcpO1xuICAgIH1cblxuICAgIGV2YWx1YXRlKGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciBpbnB1dFZhbCA9IHRoaXMuaW5wdXRzWzBdLmV2YWx1YXRlKGJpbmRpbmdzKTtcblxuICAgICAgICB2YXIgcmV0VmFsO1xuICAgICAgICBpZiAoaW5wdXRWYWwgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4odW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgIHJldFZhbCA9IGlucHV0VmFsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gLTEqaW5wdXRWYWw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICAvLyBFdmVuIHdoZW4gZGl2aWRlIGJ5IHplcm8sIHdlIHdhbnQgdG8gdXNlIHRoaXMsIHNpbmNlIGluIHRoZSBleGNlcHRpb25cbiAgICAgICAgICAgICAgICAvLyB3ZSB3YW50IHRoZSB2YWx1ZSB0byBiZSBJbmZpbml0ZSBhbmQgbm90IHVuZGVmaW5lZC5cbiAgICAgICAgICAgICAgICByZXRWYWwgPSAxL2lucHV0VmFsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBhbGVydChcIlRoZSB1bmFyeSBvcGVyYXRvciAnXCIgKyB0aGlzLm9wICsgXCInIGlzIG5vdCBkZWZpbmVkLlwiKTtcbiAgICAgICAgICAgICAgICByZXRWYWwgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHJldFZhbCk7XG4gICAgfVxuXG4gICAgc2ltcGxpZnlDb25zdGFudHMoKSB7XG4gICAgICAgIHZhciByZXRWYWw7XG5cbiAgICAgICAgdGhpcy5pbnB1dHNbMF0gPSB0aGlzLmlucHV0c1swXS5zaW1wbGlmeUNvbnN0YW50cygpO1xuICAgICAgICB0aGlzLmlucHV0c1swXS5wYXJlbnQgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy5pbnB1dHNbMF0udHlwZSA9PSBleHByVHlwZS5udW1iZXIpIHtcbiAgICAgICAgICAgIHZhciB0aGVOdW1iZXIgPSB0aGlzLmlucHV0c1swXS5udW1iZXI7XG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMubmVnYXRpdmVOdW1iZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgdGhlTnVtYmVyLmFkZEludmVyc2UoKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgdGhlTnVtYmVyLm11bHRJbnZlcnNlKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldFZhbCA9IHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHJldFZhbCk7XG4gICAgfVxuXG4gICAgZmxhdHRlbigpIHtcbiAgICAgIHJldHVybihuZXcgdW5vcF9leHByKHRoaXMuYnRtLCB0aGlzLm9wLCB0aGlzLmlucHV0c1swXS5mbGF0dGVuKCkpKTtcbiAgICB9XG5cbiAgICBjb3B5KCkge1xuICAgICAgcmV0dXJuKG5ldyB1bm9wX2V4cHIodGhpcy5idG0sIHRoaXMub3AsIHRoaXMuaW5wdXRzWzBdLmNvcHkoKSkpO1xuICAgIH1cblxuICAgIGNvbXBvc2UoYmluZGluZ3MpIHtcbiAgICAgICAgcmV0dXJuKG5ldyB1bm9wX2V4cHIodGhpcy5idG0sIHRoaXMub3AsIHRoaXMuaW5wdXRzWzBdLmNvbXBvc2UoYmluZGluZ3MpKSk7XG4gICAgfVxuXG4gICAgZGVyaXZhdGl2ZShpdmFyLCB2YXJMaXN0KSB7XG4gICAgICAgIHZhciB0aGVEZXJpdjtcblxuICAgICAgICB2YXIgdUNvbnN0ID0gdGhpcy5pbnB1dHNbMF0uaXNDb25zdGFudCgpO1xuICAgICAgICBpZiAodUNvbnN0KSB7XG4gICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSB0aGlzLmlucHV0c1swXS5kZXJpdmF0aXZlKGl2YXIsIHZhckxpc3QpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgdW5vcF9leHByKHRoaXMuYnRtLCAnLScsIHRoaXMuaW5wdXRzWzBdLmRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlbm9tID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcqJywgdGhpcy5pbnB1dHNbMF0sIHRoaXMuaW5wdXRzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgdW5vcF9leHByKHRoaXMuYnRtLCAnLScsIG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnLycsIHRoaXMuaW5wdXRzWzBdLmRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCksIGRlbm9tKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIGRlcml2YXRpdmUgb2YgdGhlIHVuYXJ5IG9wZXJhdG9yICdcIiArIHRoaXMub3AgKyBcIicgaXMgbm90IGRlZmluZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHRoZURlcml2KTtcbiAgICB9XG5cbiAgICBtYXRjaChleHByLCBiaW5kaW5ncykge1xuICAgICAgICB2YXIgcmV0VmFsdWUgPSBudWxsO1xuXG4gICAgICAgIC8vIFNwZWNpYWwgbmFtZWQgY29uc3RhbnRzIGNhbiBub3QgbWF0Y2ggZXhwcmVzc2lvbnMuXG4gICAgICAgIGlmICh0aGlzLmlzQ29uc3RhbnQoKSAmJiBleHByLmlzQ29uc3RhbnQoKSkge1xuICAgICAgICAgICAgdmFyIG5ld0V4cHIgPSBleHByLnNpbXBsaWZ5Q29uc3RhbnRzKCksXG4gICAgICAgICAgICAgICAgbmV3VGhpcyA9IHRoaXMuc2ltcGxpZnlDb25zdGFudHMoKTtcblxuICAgICAgICAgICAgaWYgKG5ld0V4cHIudG9TdHJpbmcoKSA9PT0gbmV3VGhpcy50b1N0cmluZygpXG4gICAgICAgICAgICAgICAgfHwgbmV3RXhwci50eXBlID09IGV4cHJUeXBlLm51bWJlciAmJiBuZXdUaGlzLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICYmIG5ld1RoaXMubnVtYmVyLmVxdWFsKG5ld0V4cHIubnVtYmVyKSkge1xuICAgICAgICAgICAgICAgIHJldFZhbHVlID0gYmluZGluZ3M7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXRWYWx1ZSA9IGV4cHJlc3Npb24ucHJvdG90eXBlLm1hdGNoLmNhbGwodGhpcywgZXhwciwgYmluZGluZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKHJldFZhbHVlKTtcbiAgICB9XG59XG4iLCIvKiFcbiAqIEJUTSBKYXZhU2NyaXB0IExpYnJhcnkgdkBWRVJTSU9OXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGJyaWFud2FsdG9uL0JUTVxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogRGVmaW5lIHRoZSBWYXJpYWJsZSBFeHByZXNzaW9uIC0tIGEgdmFsdWUgZGVmaW5lZCBieSBhIG5hbWVcbiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5pbXBvcnQgeyBleHByZXNzaW9uIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi5qc1wiXG5pbXBvcnQgeyBzY2FsYXJfZXhwciB9IGZyb20gXCIuL3NjYWxhcl9leHByLmpzXCJcbmltcG9ydCB7IGV4cHJUeXBlLCBleHByVmFsdWUgfSBmcm9tIFwiLi9CVE1fcm9vdC5qc1wiXG5cbmV4cG9ydCBjbGFzcyB2YXJpYWJsZV9leHByIGV4dGVuZHMgZXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IoYnRtLCBuYW1lKSB7XG4gICAgICAgIHN1cGVyKGJ0bSk7XG4gICAgICAgIHRoaXMudHlwZSA9IGV4cHJUeXBlLnZhcmlhYmxlO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuXG4gICAgICAgIC8vIENvdW50IGhvdyBtYW55IGRlcml2YXRpdmVzLlxuICAgICAgICB2YXIgcHJpbWVQb3MgPSBuYW1lLmluZGV4T2YoXCInXCIpO1xuICAgICAgICB0aGlzLmRlcml2cyA9IDA7XG4gICAgICAgIGlmIChwcmltZVBvcyA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuZGVyaXZzID0gbmFtZS5zbGljZShwcmltZVBvcykubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pc0NvbnN0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNTcGVjaWFsID0gZmFsc2U7XG4gICAgICAgIHN3aXRjaCh0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2UnOlxuICAgICAgICAgICAgY2FzZSAncGknOlxuICAgICAgICAgICAgY2FzZSAnZG5lJzpcbiAgICAgICAgICAgIGNhc2UgJ2luZic6XG4gICAgICAgICAgICAgICAgdGhpcy5pc0NvbnN0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzU3BlY2lhbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b1N0cmluZyhlbGVtZW50T25seSkge1xuICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnRPbmx5ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBlbGVtZW50T25seSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybih0aGlzLm5hbWUpO1xuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBhcnJheSBjb250YWluaW5nIGFsbCB0ZXN0ZWQgZXF1aXZhbGVudCBzdHJpbmdzLlxuICAgIGFsbFN0cmluZ0VxdWl2cygpIHtcbiAgICAgICAgcmV0dXJuKFt0aGlzLnRvU3RyaW5nKCldKTtcbiAgICB9XG5cbiAgICB0b1RlWChzaG93U2VsZWN0KSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2hvd1NlbGVjdCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgc2hvd1NlbGVjdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdHIgPSB0aGlzLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2FscGhhJzpcbiAgICAgICAgICAgIGNhc2UgJ2JldGEnOlxuICAgICAgICAgICAgY2FzZSAnZ2FtbWEnOlxuICAgICAgICAgICAgY2FzZSAnZGVsdGEnOlxuICAgICAgICAgICAgY2FzZSAnZXBzaWxvbic6XG4gICAgICAgICAgICBjYXNlICd6ZXRhJzpcbiAgICAgICAgICAgIGNhc2UgJ2V0YSc6XG4gICAgICAgICAgICBjYXNlICd0aGV0YSc6XG4gICAgICAgICAgICBjYXNlICdrYXBwYSc6XG4gICAgICAgICAgICBjYXNlICdsYW1iZGEnOlxuICAgICAgICAgICAgY2FzZSAnbXUnOlxuICAgICAgICAgICAgY2FzZSAnbnUnOlxuICAgICAgICAgICAgY2FzZSAneGknOlxuICAgICAgICAgICAgY2FzZSAncGknOlxuICAgICAgICAgICAgY2FzZSAncmhvJzpcbiAgICAgICAgICAgIGNhc2UgJ3NpZ21hJzpcbiAgICAgICAgICAgIGNhc2UgJ3RhdSc6XG4gICAgICAgICAgICBjYXNlICd1cHNpbG9uJzpcbiAgICAgICAgICAgIGNhc2UgJ3BoaSc6XG4gICAgICAgICAgICBjYXNlICdjaGknOlxuICAgICAgICAgICAgY2FzZSAncHNpJzpcbiAgICAgICAgICAgIGNhc2UgJ29tZWdhJzpcbiAgICAgICAgICAgIGNhc2UgJ0dhbW1hJzpcbiAgICAgICAgICAgIGNhc2UgJ0RlbHRhJzpcbiAgICAgICAgICAgIGNhc2UgJ1RoZXRhJzpcbiAgICAgICAgICAgIGNhc2UgJ0xhbWJkYSc6XG4gICAgICAgICAgICBjYXNlICdYaSc6XG4gICAgICAgICAgICBjYXNlICdQaSc6XG4gICAgICAgICAgICBjYXNlICdTaWdtYSc6XG4gICAgICAgICAgICBjYXNlICdVcHNpbG9uJzpcbiAgICAgICAgICAgIGNhc2UgJ1BoaSc6XG4gICAgICAgICAgICBjYXNlICdQc2knOlxuICAgICAgICAgICAgY2FzZSAnT21lZ2EnOlxuICAgICAgICAgICAgICAgIHN0ciA9ICdcXFxcJyArIHRoaXMubmFtZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2luZic6XG4gICAgICAgICAgICAgICAgc3RyID0gJ1xcXFxpbmZ0eSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU3BlY2lhbCkge1xuICAgICAgICAgICAgICAgICAgICBzdHIgPSAnXFxcXG1hdGhybXsnICsgdGhpcy5uYW1lICsgJ30nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5uYW1lLmluZGV4T2YoXCJpbnB1dFwiKT09MCkge1xuICAgICAgICAgICAgc3RyID0gXCJcXFxcYm94ZWR7XFxcXGRvdHM/XntcIiArIHRoaXMubmFtZS5zbGljZSg1KSArIFwifX1cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaG93U2VsZWN0ICYmIHRoaXMuc2VsZWN0KSB7XG4gICAgICAgICAgICBzdHIgPSBcIntcXFxcY29sb3J7cmVkfVwiICsgc3RyICsgXCJ9XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHN0cik7XG4gICAgfVxuXG4gICAgZGVwZW5kZW5jaWVzKGZvcmNlZCkge1xuICAgICAgICB2YXIgZGVwQXJyYXkgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgaWYgKGZvcmNlZCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxmb3JjZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkZXBBcnJheS5wdXNoKGZvcmNlZFtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmlzQ29uc3QgJiYgZGVwQXJyYXkuaW5kZXhPZih0aGlzLm5hbWUpIDwgMCkge1xuICAgICAgICAgICAgZGVwQXJyYXkucHVzaCh0aGlzLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihkZXBBcnJheSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgICAgQSB2YXJpYWJsZSBpcyBjb25zdGFudCBvbmx5IGlmIHJlZmVycmluZyB0byBtYXRoZW1hdGljYWwgY29uc3RhbnRzIChlLCBwaSlcbiAgICAqL1xuICAgIGlzQ29uc3RhbnQoKSB7XG4gICAgICAgIHJldHVybih0aGlzLmlzQ29uc3QpO1xuICAgIH1cblxuICAgIGV2YWx1YXRlKGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciByZXRWYWw7XG5cbiAgICAgICAgaWYgKGJpbmRpbmdzW3RoaXMubmFtZV0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzd2l0Y2godGhpcy5uYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnZSc6XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGguRTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAncGknOlxuICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLlBJO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdpbmYnOlxuICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBJbmZpbml0eTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnZG5lJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTnVtYmVyLk5hTjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJWYXJpYWJsZSBldmFsdWF0ZWQgd2l0aG91dCBiaW5kaW5nLlwiKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYmluZGluZ3NbdGhpcy5uYW1lXS52YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHJldFZhbCA9IGJpbmRpbmdzW3RoaXMubmFtZV0udmFsdWUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gYmluZGluZ3NbdGhpcy5uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihyZXRWYWwpO1xuICAgIH1cblxuICAgIGNvcHkoKSB7XG4gICAgICAgIHJldHVybihuZXcgdmFyaWFibGVfZXhwcih0aGlzLmJ0bSwgdGhpcy5uYW1lKSk7XG4gICAgfVxuXG4gICAgY29tcG9zZShiaW5kaW5ncykge1xuICAgICAgICB2YXIgcmV0VmFsO1xuXG4gICAgICAgIGlmIChiaW5kaW5nc1t0aGlzLm5hbWVdID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0VmFsID0gbmV3IHZhcmlhYmxlX2V4cHIodGhpcy5idG0sIHRoaXMubmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGJpbmRpbmdzW3RoaXMubmFtZV0gPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHJldFZhbCA9IHRoaXMuYnRtLnBhcnNlKGJpbmRpbmdzW3RoaXMubmFtZV0sIFwiZm9ybXVsYVwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gYmluZGluZ3NbdGhpcy5uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihyZXRWYWwpO1xuICAgIH1cblxuICAgIGRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCkge1xuICAgICAgICB2YXIgcmV0VmFsO1xuICAgICAgICB2YXIgaXZhck5hbWUgPSAodHlwZW9mIGl2YXIgPT0gJ3N0cmluZycpID8gaXZhciA6IGl2YXIubmFtZTtcblxuICAgICAgICBpZiAodGhpcy5uYW1lID09PSBpdmFyTmFtZSkge1xuICAgICAgICAgICAgcmV0VmFsID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAxKTtcblxuICAgICAgICAvLyBJZiBlaXRoZXIgYSBjb25zdGFudCBvciBhbm90aGVyIGluZGVwZW5kZW50IHZhcmlhYmxlLCBkZXJpdj0wXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0NvbnN0IHx8IHZhckxpc3QgJiYgdmFyTGlzdFt0aGlzLm5hbWVdICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0VmFsID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAwKTtcblxuICAgICAgICAvLyBQcmVzdW1pbmcgb3RoZXIgdmFyaWFibGVzIGFyZSBkZXBlbmRlbnQgdmFyaWFibGVzLlxuICAgICAgICB9IGVsc2UgIHtcbiAgICAgICAgICAgIHJldFZhbCA9IG5ldyB2YXJpYWJsZV9leHByKHRoaXMuYnRtLCB0aGlzLm5hbWUrXCInXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWwpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgIFNlZSBleHByZXNzaW9ucy5wcm90b3R5cGUubWF0Y2ggZm9yIGV4cGxhbmF0aW9uLlxuXG4gICAgICAgIEEgdmFyaWFibGUgY2FuIG1hdGNoIGFueSBleHByZXNzaW9uLiBCdXQgd2UgbmVlZCB0byBjaGVja1xuICAgICAgICBpZiB0aGUgdmFyaWFibGUgaGFzIGFscmVhZHkgbWF0Y2hlZCBhbiBleHByZXNzaW9uLiBJZiBzbyxcbiAgICAgICAgaXQgbXVzdCBiZSB0aGUgc2FtZSBhZ2Fpbi5cbiAgICAqL1xuICAgIG1hdGNoKGV4cHIsIGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciByZXRWYWx1ZSA9IG51bGw7XG5cbiAgICAgICAgLy8gU3BlY2lhbCBuYW1lZCBjb25zdGFudHMgY2FuIG5vdCBtYXRjaCBleHByZXNzaW9ucy5cbiAgICAgICAgaWYgKHRoaXMuaXNDb25zdCkge1xuICAgICAgICAgICAgaWYgKGV4cHIudG9TdHJpbmcoKSA9PT0gdGhpcy5uYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0VmFsdWUgPSBiaW5kaW5ncztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAvLyBJZiBuZXZlciBwcmV2aW91c2x5IGFzc2lnbmVkLCBjYW4gbWF0Y2ggYW55IGV4cHJlc3Npb24uXG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZ3MgIT0gbnVsbCAmJiBiaW5kaW5nc1t0aGlzLm5hbWVdID09IHVuZGVmaW5lZCAmJiBleHByLnZhbHVlVHlwZSA9PSBleHByVmFsdWUubnVtZXJpYykge1xuICAgICAgICAgICAgcmV0VmFsdWUgPSBiaW5kaW5ncztcbiAgICAgICAgICAgIHJldFZhbHVlW3RoaXMubmFtZV0gPSBleHByLnRvU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZ3MgIT0gbnVsbCAmJiBiaW5kaW5nc1t0aGlzLm5hbWVdID09IGV4cHIudG9TdHJpbmcoKSkge1xuICAgICAgICAgICAgcmV0VmFsdWUgPSBiaW5kaW5ncztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxufVxuXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgKiBEZWZpbmUgdGhlIEluZGV4IEV4cHJlc3Npb24gLS0gYSByZWZlcmVuY2UgaW50byBhIGxpc3RcbiAgICAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5leHBvcnQgY2xhc3MgaW5kZXhfZXhwciB7XG4gICAgXG4gICAgY29uc3RydWN0b3IoYnRtLCBuYW1lLCBpbmRleCkge1xuICAgICAgICB0aGlzLmJ0bSA9IGJ0bTtcbiAgICAgICAgaWYgKCEoYnRtIGluc3RhbmNlb2YgQlRNKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ2YXJpYWJsZV9leHByIGNvbnN0cnVjdGVkIHdpdGggaW52YWxpZCBlbnZpcm9ubWVudFwiKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudHlwZSA9IGV4cHJUeXBlLnZhcmlhYmxlO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnNlbGVjdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmJvdW5kTmFtZSA9IFwiW11cIituYW1lO1xuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgdmFyIGRlcEFycmF5ID0gaW5kZXguZGVwZW5kZW5jaWVzKCk7XG4gICAgICAgIGlmIChkZXBBcnJheS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBhbGVydChcIkFuIGFycmF5IHJlZmVyZW5jZSBjYW4gb25seSBoYXZlIG9uZSBpbmRleCB2YXJpYWJsZS5cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmsgPSBkZXBBcnJheVswXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvU3RyaW5nKGVsZW1lbnRPbmx5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgZWxlbWVudE9ubHkgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGVsZW1lbnRPbmx5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHRoaXMubmFtZSArIFwiW1wiICsgdGhpcy5pbmRleC50b1N0cmluZygpICsgXCJdXCIpO1xuICAgIH1cblxuICAgIHRvVGVYKHNob3dTZWxlY3QpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzaG93U2VsZWN0ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBzaG93U2VsZWN0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgd29yZCA9IHRoaXMubmFtZSArIFwiX3tcIiArIHRoaXMuaW5kZXgudG9TdHJpbmcoKSArIFwifVwiO1xuICAgICAgICBpZiAoc2hvd1NlbGVjdCAmJiB0aGlzLnNlbGVjdCkge1xuICAgICAgICAgICAgd29yZCA9IFwie1xcXFxjb2xvcntyZWR9XCIgKyB3b3JkICsgXCJ9XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHdvcmQpO1xuICAgIH1cblxuICAgIHRvTWF0aE1MKCkge1xuICAgICAgICByZXR1cm4oXCI8YXBwbHk+PHNlbGVjdG9yLz48Y2kgdHlwZT1cXFwidmVjdG9yXFxcIj5cIiArIHRoaXMubmFtZSArIFwiPC9jaT5cIiArIHRoaXMuaW5kZXgudG9TdHJpbmcoKSArIFwiPC9hcHBseT5cIik7XG4gICAgfVxuXG4gICAgZGVwZW5kZW5jaWVzKGZvcmNlZCkge1xuICAgICAgICB2YXIgZGVwQXJyYXkgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgaWYgKGZvcmNlZCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxmb3JjZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkZXBBcnJheS5wdXNoKGZvcmNlZFtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoKHRoaXMubmFtZSkge1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBkZXBBcnJheS5wdXNoKFwicm93XCIpO1xuICAgICAgICAgICAgICAgIGRlcEFycmF5LnB1c2godGhpcy5ib3VuZE5hbWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihkZXBBcnJheSk7XG4gICAgfVxuXG4gICAgZXZhbHVhdGUoYmluZGluZ3MpIHtcbiAgICAgICAgdmFyIHJldFZhbDtcblxuICAgICAgICBpZiAoYmluZGluZ3NbdGhpcy5ib3VuZE5hbWVdID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc3dpdGNoKHRoaXMubmFtZSkge1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdG1wQmluZCA9IHt9O1xuICAgICAgICAgICAgaWYgKHRoaXMuayAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0bXBCaW5kW3RoaXMua10gPSBiaW5kaW5nc1tcInJvd1wiXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBpID0gdGhpcy5pbmRleC5ldmFsdWF0ZSh0bXBCaW5kKS0xO1xuICAgICAgICAgICAgaWYgKGkgPj0gMCAmJiBpPGJpbmRpbmdzW3RoaXMuYm91bmROYW1lXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXRWYWwgPSBiaW5kaW5nc1t0aGlzLmJvdW5kTmFtZV1baV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ocmV0VmFsKTtcbiAgICB9XG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9