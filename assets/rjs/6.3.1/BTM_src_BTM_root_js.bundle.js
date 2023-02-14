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
                if (typeof min === 'object' && min.constructor.name !== 'Number') {
                    min = min.value();
                }
                let max = options.max;
                if (typeof max === 'object' && max.constructor.name !== 'Number') {
                    max = max.value();
                }
                let by = options.by;
                if (typeof by === 'object' && by.constructor.name !== 'Number') {
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
                    if (typeof min === 'object' && min.constructor.name !== 'Number') {
                        min = min.value();
                    }
                    let max = options.max;
                    if (typeof max === 'object' && max.constructor.name !== 'Number') {
                        max = max.value();
                    }
                    let by = options.by;
                    if (typeof by === 'object' && by.constructor.name !== 'Number') {
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
        if (typeof number === "object" && number.constructor.name !== "Number") {
            if (number.constructor.name === "rational_number"
                ||
                number.constructor.name === "real_number")    
            {
                this.number = number;
            } else if (number.constructor.name === "scalar_expr") {
                this.number = number.number;
            } else {
                console.log("Trying to instantiate a scalar_expr with a non-number object: " + number);
            }
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
            if (typeof bindings[this.name]==='object' &&
                bindings[this.name].constructor.name !== "Number") {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0Msd0RBQVc7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9COztBQUVwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0EsUUFBUSxRQUFRO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1B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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQTBCLGlCQUFpQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGtCQUFrQixrQkFBa0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGtCQUFrQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQix3QkFBd0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLEtBQUs7QUFDL0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Es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QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLDhCQUE4QjtBQUM1RDtBQUNBLHFCQUFxQixRQUFRLElBQUksYUFBYTtBQUM5QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixpQkFBaUI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uLi9CVE0vc3JjL0JUTV9yb290LmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi4vQlRNL3NyYy9iaW5vcF9leHByLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi4vQlRNL3NyYy9kZXJpdl9leHByLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi4vQlRNL3NyYy9leHByZXNzaW9uLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi4vQlRNL3NyYy9mdW5jdGlvbl9leHByLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi4vQlRNL3NyYy9tdWx0aW9wX2V4cHIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uLi9CVE0vc3JjL3JhbmRvbS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4uL0JUTS9zcmMvcmF0aW9uYWxfbnVtYmVyLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi4vQlRNL3NyYy9yZWFsX251bWJlci5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4uL0JUTS9zcmMvcmVkdWN0aW9ucy5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4uL0JUTS9zcmMvc2NhbGFyX2V4cHIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uLi9CVE0vc3JjL3Vub3BfZXhwci5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4uL0JUTS9zcmMvdmFyaWFibGVfZXhwci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEJUTSBKYXZhU2NyaXB0IExpYnJhcnkgdkBWRVJTSU9OXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGJyaWFud2FsdG9uL0JUTVxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKlxuKiogRXZhbHVhdGluZyBleHByZXNzaW9ucyBvY2N1cnMgaW4gdGhlIGNvbnRleHQgb2YgYSBCVE0gZW52aXJvbm1lbnQuXG4qKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmltcG9ydCB7IGRlZmF1bHRSZWR1Y3Rpb25zLCBkZWZhdWx0U3VtUmVkdWN0aW9ucywgZGVmYXVsdFByb2R1Y3RSZWR1Y3Rpb25zLCBkaXNhYmxlUnVsZSwgbmV3UnVsZSwgZmluZE1hdGNoUnVsZXMgfSBmcm9tIFwiLi9yZWR1Y3Rpb25zLmpzXCJcbmltcG9ydCB7IHNjYWxhcl9leHByIH0gZnJvbSBcIi4vc2NhbGFyX2V4cHIuanNcIjtcbmltcG9ydCB7IHZhcmlhYmxlX2V4cHIsIGluZGV4X2V4cHIgfSBmcm9tIFwiLi92YXJpYWJsZV9leHByLmpzXCI7XG5pbXBvcnQgeyB1bm9wX2V4cHIgfSBmcm9tIFwiLi91bm9wX2V4cHIuanNcIjtcbmltcG9ydCB7IGJpbm9wX2V4cHIgfSBmcm9tIFwiLi9iaW5vcF9leHByLmpzXCI7XG5pbXBvcnQgeyBtdWx0aW9wX2V4cHIgfSBmcm9tIFwiLi9tdWx0aW9wX2V4cHIuanNcIjtcbmltcG9ydCB7IGZ1bmN0aW9uX2V4cHIgfSBmcm9tIFwiLi9mdW5jdGlvbl9leHByLmpzXCI7XG5pbXBvcnQgeyBkZXJpdl9leHByIH0gZnJvbSBcIi4vZGVyaXZfZXhwci5qc1wiO1xuaW1wb3J0IHsgUk5HIH0gZnJvbSBcIi4vcmFuZG9tLmpzXCJcbmltcG9ydCB7IGV4cHJlc3Npb24gfSBmcm9tIFwiLi9leHByZXNzaW9uLmpzXCI7XG5cbmV4cG9ydCBjb25zdCBvcFByZWMgPSB7XG4gICAgZGlzajogMCxcbiAgICBjb25qOiAxLFxuICAgIGVxdWFsOiAyLFxuICAgIGFkZHN1YjogMyxcbiAgICBtdWx0ZGl2OiA0LFxuICAgIHBvd2VyOiA1LFxuICAgIGZjbjogNixcbiAgICBmb3A6IDdcbn07XG5cbmV4cG9ydCBjb25zdCBleHByVHlwZSA9IHtcbiAgICBudW1iZXI6IDAsXG4gICAgdmFyaWFibGU6IDEsXG4gICAgZmNuOiAyLFxuICAgIHVub3A6IDMsXG4gICAgYmlub3A6IDQsXG4gICAgbXVsdGlvcDogNSxcbiAgICBvcGVyYXRvcjogNixcbiAgICBhcnJheTogNyxcbiAgICBtYXRyaXg6IDhcbn07XG5cbmV4cG9ydCBjb25zdCBleHByVmFsdWUgPSB7IHVuZGVmOiAtMSwgYm9vbCA6IDAsIG51bWVyaWMgOiAxIH07XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1RlWChleHByKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBleHByLnRvVGVYID09PSBcImZ1bmN0aW9uXCIgPyBleHByLnRvVGVYKCkgOiBleHByO1xufVxuXG5leHBvcnQgY2xhc3MgQlRNIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncykge1xuICAgICAgICBpZiAoc2V0dGluZ3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0dGluZ3MgPSB7fTtcbiAgICAgICAgICAgIHNldHRpbmdzLnNlZWQgPSAnMTIzNCc7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRWFjaCBpbnN0YW5jZSBvZiBCVE0gZW52aXJvbm1lbnQgbmVlZHMgYmluZGluZ3MgYWNyb3NzIGFsbCBleHByZXNzaW9ucy5cbiAgICAgICAgdGhpcy5yYW5kb21CaW5kaW5ncyA9IHt9O1xuICAgICAgICB0aGlzLmJpbmRpbmdzID0ge307XG4gICAgICAgIHRoaXMuZGF0YSA9IHt9O1xuICAgICAgICB0aGlzLmRhdGEuYWxsVmFsdWVzID0ge307XG4gICAgICAgIHRoaXMuZGF0YS5wYXJhbXMgPSB7fTtcbiAgICAgICAgdGhpcy5kYXRhLnZhcmlhYmxlcyA9IHt9O1xuICAgICAgICB0aGlzLmRhdGEuZXhwcmVzc2lvbnMgPSB7fTtcbiAgICAgICAgdGhpcy5vcFByZWMgPSBvcFByZWM7XG4gICAgICAgIHRoaXMuZXhwclR5cGUgPSBleHByVHlwZTtcbiAgICAgICAgdGhpcy5leHByVmFsdWUgPSBleHByVmFsdWU7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG5lZ2F0aXZlTnVtYmVyczogdHJ1ZSxcbiAgICAgICAgICAgIGFic1RvbDogMWUtOCxcbiAgICAgICAgICAgIHJlbFRvbDogMWUtNCxcbiAgICAgICAgICAgIHVzZVJlbEVycjogdHJ1ZSxcbiAgICAgICAgICAgIGRvRmxhdHRlbjogZmFsc2UgXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0UmVkdWN0aW9uUnVsZXMoKTtcbiAgICAgICAgdGhpcy5tdWx0aW9wX2V4cHIgPSBtdWx0aW9wX2V4cHI7XG4gICAgICAgIHRoaXMuYmlub3BfZXhwciA9IGJpbm9wX2V4cHI7XG5cbiAgICAgICAgLy8gR2VuZXJhdGUgYSByYW5kb20gZ2VuZXJhdG9yLiBXZSBtaWdodCBiZSBwYXNzZWQgZWl0aGVyIGEgcHJlLXNlZWRlZCBgcmFuZGAgZnVuY3Rpb24gb3IgYSBzZWVkIGZvciBvdXIgb3duLlxuICAgICAgICBsZXQgcm5nT3B0aW9ucyA9IHt9O1xuICAgICAgICBpZiAodHlwZW9mIHNldHRpbmdzLnJhbmQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBybmdPcHRpb25zLnJhbmQgPSBzZXR0aW5ncy5yYW5kO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0dGluZ3Muc2VlZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJuZ09wdGlvbnMuc2VlZCA9IHNldHRpbmdzLnNlZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ybmcgPSBuZXcgUk5HKHJuZ09wdGlvbnMpO1xuICAgIH1cblxuICAgIC8vIFBlcmZvcm0gYXBwcm94aW1hdGUgY29tcGFyaXNvbiB0ZXN0cyB1c2luZyBlbnZpcm9ubWVudCBzZXR0aW5nc1xuICAgIC8vIGEgPCBiOiAtMVxuICAgIC8vIGEgfj0gYjogMFxuICAgIC8vIGEgPiBiOiAxXG4gICAgbnVtYmVyQ21wKGEsYixvdmVycmlkZSkge1xuICAgICAgICAvLyBXb3JrIHdpdGggYWN0dWFsIHZhbHVlcy5cbiAgICAgICAgdmFyIHZhbEEsIHZhbEIsIGNtcFJlc3VsdDtcbiAgICAgICAgdmFyIHVzZVJlbEVyciA9IHRoaXMub3B0aW9ucy51c2VSZWxFcnIsXG4gICAgICAgICAgICByZWxUb2wgPSB0aGlzLm9wdGlvbnMucmVsVG9sLFxuICAgICAgICAgICAgYWJzVG9sID0gdGhpcy5vcHRpb25zLmFic1RvbDtcblxuICAgICAgICBpZiAodHlwZW9mIGEgPT09ICdudW1iZXInIHx8IHR5cGVvZiBhID09PSAnTnVtYmVyJykge1xuICAgICAgICAgICAgdmFsQSA9IGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWxBID0gYS52YWx1ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgYiA9PT0gJ251bWJlcicgfHwgdHlwZW9mIGIgPT09ICdOdW1iZXInKSB7XG4gICAgICAgICAgICB2YWxCID0gYjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbEIgPSBiLnZhbHVlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQdWxsIG91dCB0aGUgb3B0aW9ucy5cbiAgICAgICAgaWYgKHR5cGVvZiBvdmVycmlkZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3ZlcnJpZGUudXNlUmVsRXJyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHVzZVJlbEVyciA9IG92ZXJyaWRlLnVzZVJlbEVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3ZlcnJpZGUucmVsVG9sICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHJlbFRvbCA9IG92ZXJyaWRlLnJlbFRvbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3ZlcnJpZGUuYWJzVG9sICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGFic1RvbCA9IG92ZXJyaWRlLmFic1RvbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdXNlUmVsRXJyIHx8IE1hdGguYWJzKHZhbEEpIDwgYWJzVG9sKSB7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnModmFsQi12YWxBKSA8IGFic1RvbCkge1xuICAgICAgICAgICAgICAgIGNtcFJlc3VsdCA9IDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbEEgPCB2YWxCKSB7XG4gICAgICAgICAgICAgICAgY21wUmVzdWx0ID0gLTE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNtcFJlc3VsdCA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnModmFsQi12YWxBKS9NYXRoLmFicyh2YWxBKSA8IHJlbFRvbCkge1xuICAgICAgICAgICAgICAgIGNtcFJlc3VsdCA9IDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbEEgPCB2YWxCKSB7XG4gICAgICAgICAgICAgICAgY21wUmVzdWx0ID0gLTE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNtcFJlc3VsdCA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNtcFJlc3VsdDtcbiAgICB9XG5cbiAgICAvKiBCbG9jayBvZiBtZXRob2RzIHRvIGRlYWwgd2l0aCByZWR1Y3Rpb24gcnVsZXMgaW4gY29udGV4dCAqL1xuICAgIHNldFJlZHVjdGlvblJ1bGVzKCkge1xuICAgICAgICB0aGlzLnJlZHVjZVJ1bGVzID0gZGVmYXVsdFJlZHVjdGlvbnModGhpcyk7XG4gICAgfVxuXG4gICAgYWRkUmVkdWN0aW9uUnVsZShlcXVhdGlvbiwgZGVzY3JpcHRpb24sIHVzZU9uZVdheSkge1xuICAgICAgICBuZXdSdWxlKHRoaXMsIHRoaXMucmVkdWNlUnVsZXMsIGVxdWF0aW9uLCBkZXNjcmlwdGlvbiwgdHJ1ZSwgdXNlT25lV2F5KTtcbiAgICB9XG5cbiAgICBkaXNhYmxlUmVkdWN0aW9uUnVsZShlcXVhdGlvbikge1xuICAgICAgICBkaXNhYmxlUnVsZSh0aGlzLCB0aGlzLnJlZHVjZVJ1bGVzLCBlcXVhdGlvbik7XG4gICAgfVxuXG4gICAgYWRkUnVsZShydWxlTGlzdCwgZXF1YXRpb24sIGRlc2NyaXB0aW9uLCB1c2VPbmVXYXkpe1xuICAgICAgICBuZXdSdWxlKHRoaXMsIHJ1bGVMaXN0LCBlcXVhdGlvbiwgZGVzY3JpcHRpb24sIHRydWUsIHVzZU9uZVdheSk7XG4gICAgfVxuXG4gICAgZmluZE1hdGNoUnVsZXMocmVkdWN0aW9uTGlzdCwgdGVzdEV4cHIsIGRvVmFsaWRhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZpbmRNYXRjaFJ1bGVzKHJlZHVjdGlvbkxpc3QsIHRlc3RFeHByLCBkb1ZhbGlkYXRlKTtcbiAgICB9XG5cbiAgICBhZGRNYXRoT2JqZWN0KG5hbWUsIGNvbnRleHQsIG5ld09iamVjdCkge1xuICAgICAgICBzd2l0Y2goY29udGV4dCkge1xuICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICBpZiAobmV3T2JqZWN0LmlzQ29uc3RhbnQoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEucGFyYW1zW25hbWVdID0gbmV3T2JqZWN0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEuYWxsVmFsdWVzW25hbWVdID0gbmV3T2JqZWN0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGBBdHRlbXB0IHRvIGFkZCBtYXRoIG9iamVjdCAnJHtuYW1lfScgd2l0aCBjb250ZXh0ICcke2NvbnRleHR9JyB0aGF0IGRvZXMgbm90IG1hdGNoLmA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZm9ybXVsYSc6XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLmFsbFZhbHVlc1tuYW1lXSA9IG5ld09iamVjdDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3T2JqZWN0O1xuICAgIH1cblxuICAgIGdlbmVyYXRlUmFuZG9tKGRpc3RyLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBybmRWYWwsIHJuZFNjYWxhcjtcblxuICAgICAgICBzd2l0Y2ggKGRpc3RyKSB7XG4gICAgICAgICAgICBjYXNlICdkaXNjcmV0ZSc6XG4gICAgICAgICAgICAgICAgbGV0IG1pbiA9IG9wdGlvbnMubWluO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWluID09PSAnb2JqZWN0JyAmJiBtaW4uY29uc3RydWN0b3IubmFtZSAhPT0gJ051bWJlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgbWluID0gbWluLnZhbHVlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBtYXggPSBvcHRpb25zLm1heDtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1heCA9PT0gJ29iamVjdCcgJiYgbWF4LmNvbnN0cnVjdG9yLm5hbWUgIT09ICdOdW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIG1heCA9IG1heC52YWx1ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgYnkgPSBvcHRpb25zLmJ5O1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYnkgPT09ICdvYmplY3QnICYmIGJ5LmNvbnN0cnVjdG9yLm5hbWUgIT09ICdOdW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIGJ5ID0gYnkudmFsdWUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IE52YWxzID0gTWF0aC5mbG9vcigobWF4LW1pbikgLyBieSkrMTtcbiAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgIHJuZFZhbCA9IG1pbiArIGJ5ICogdGhpcy5ybmcucmFuZEludCgwLE52YWxzLTEpO1xuICAgICAgICAgICAgICAgIH0gd2hpbGUgKG9wdGlvbnMubm9uemVybyAmJiBNYXRoLmFicyhybmRWYWwpIDwgdGhpcy5vcHRpb25zLmFic1RvbCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcm5kU2NhbGFyID0gbmV3IHNjYWxhcl9leHByKHRoaXMsIHJuZFZhbCk7XG4gICAgICAgIHJldHVybiBybmRTY2FsYXI7XG4gICAgfVxuXG4gICAgYWRkUGFyYW1ldGVyKG5hbWUsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIG5ld1BhcmFtO1xuICAgICAgICBsZXQgcHJlYyA9IG9wdGlvbnMucHJlYztcbiAgICAgICAgaWYgKG9wdGlvbnMubW9kZSA9PT0gJ3JhbmRvbScpIHtcbiAgICAgICAgICAgIGxldCBkaXN0ciA9IG9wdGlvbnMuZGlzdHI7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGRpc3RyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGRpc3RyID0gJ2Rpc2NyZXRlX3JhbmdlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAoZGlzdHIpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdkaXNjcmV0ZV9yYW5nZSc6XG4gICAgICAgICAgICAgICAgICAgIGxldCBtaW4gPSBvcHRpb25zLm1pbjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtaW4gPT09ICdvYmplY3QnICYmIG1pbi5jb25zdHJ1Y3Rvci5uYW1lICE9PSAnTnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluID0gbWluLnZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IG1heCA9IG9wdGlvbnMubWF4O1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1heCA9PT0gJ29iamVjdCcgJiYgbWF4LmNvbnN0cnVjdG9yLm5hbWUgIT09ICdOdW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXggPSBtYXgudmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgYnkgPSBvcHRpb25zLmJ5O1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGJ5ID09PSAnb2JqZWN0JyAmJiBieS5jb25zdHJ1Y3Rvci5uYW1lICE9PSAnTnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnkgPSBieS52YWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCBOdmFscyA9IE1hdGguZmxvb3IoKG1heC1taW4pIC8gYnkpKzE7XG4gICAgICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1BhcmFtID0gbWluICsgYnkgKiB0aGlzLnJuZy5yYW5kSW50KDAsTnZhbHMtMSk7XG4gICAgICAgICAgICAgICAgICAgIH0gd2hpbGUgKG9wdGlvbnMubm9uemVybyAmJiBNYXRoLmFicyhuZXdQYXJhbSkgPCB0aGlzLm9wdGlvbnMuYWJzVG9sKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5tb2RlID09ICdjYWxjdWxhdGUnKSB7XG4gICAgICAgICAgICBuZXdQYXJhbSA9IHRoaXMucGFyc2Uob3B0aW9ucy5mb3JtdWxhLCBcImZvcm11bGFcIikuZXZhbHVhdGUodGhpcy5kYXRhLnBhcmFtcyk7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5tb2RlID09ICdyYXRpb25hbCcpIHtcbiAgICAgICAgICAgIG5ld1BhcmFtID0gdGhpcy5wYXJzZShuZXcgcmF0aW9uYWxfbnVtYmVyKG9wdGlvbnMubnVtZXIsb3B0aW9ucy5kZW5vbSkudG9TdHJpbmcoKSwgXCJudW1iZXJcIik7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5tb2RlID09ICdzdGF0aWMnKSB7XG4gICAgICAgICAgICBuZXdQYXJhbSA9IG9wdGlvbnMudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBwcmVjID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgbmV3UGFyYW0gPSBNYXRoLnJvdW5kKG5ld1BhcmFtL3ByZWMpIC8gTWF0aC5yb3VuZCgxL3ByZWMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGF0YS5wYXJhbXNbbmFtZV0gPSBuZXdQYXJhbTtcbiAgICAgICAgdGhpcy5kYXRhLmFsbFZhbHVlc1tuYW1lXSA9IG5ld1BhcmFtO1xuXG4gICAgICAgIHJldHVybiBuZXdQYXJhbTtcbiAgICB9XG5cbiAgICBhZGRWYXJpYWJsZShuYW1lLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBuZXdWYXIgPSBuZXcgdmFyaWFibGVfZXhwcihuYW1lKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZGF0YS52YXJpYWJsZXNbbmFtZV0gPSBuZXdWYXI7XG4gICAgICAgIHRoaXMuZGF0YS5hbGxWYWx1ZXNbbmFtZV0gPSBuZXdWYXI7XG5cbiAgICAgICAgcmV0dXJuIG5ld1ZhcjtcbiAgICB9XG5cbiAgICBldmFsdWF0ZU1hdGhPYmplY3QobWF0aE9iamVjdCwgY29udGV4dCwgYmluZGluZ3MpIHtcbiAgICAgICAgdmFyIHRoZUV4cHIsIG5ld0V4cHIsIHJldFZhbHVlO1xuICAgICAgICAvLyBOb3QgeWV0IHBhcnNlZFxuICAgICAgICBpZiAodHlwZW9mIG1hdGhPYmplY3QgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YXIgZm9ybXVsYSA9IHRoaXMuZGVjb2RlRm9ybXVsYShtYXRoT2JqZWN0KTtcbiAgICAgICAgICAgIHRoZUV4cHIgPSB0aGlzLnBhcnNlKGZvcm11bGEsIFwiZm9ybXVsYVwiKTtcbiAgICAgICAgLy8gQWxyZWFkeSBwYXJzZWRcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbWF0aE9iamVjdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHRoZUV4cHIgPSBtYXRoT2JqZWN0O1xuICAgICAgICB9XG4gICAgICAgIHJldFZhbHVlID0gdGhlRXhwci5ldmFsdWF0ZShiaW5kaW5ncyk7XG4gICAgICAgIG5ld0V4cHIgPSBuZXcgc2NhbGFyX2V4cHIodGhpcywgcmV0VmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3RXhwcjtcbiAgICB9XG5cbiAgICBwYXJzZUV4cHJlc3Npb24oZXhwcmVzc2lvbiwgY29udGV4dCkge1xuICAgICAgICB2YXIgbmV3RXhwcjtcbiAgICAgICAgLy8gTm90IHlldCBwYXJzZWRcbiAgICAgICAgaWYgKHR5cGVvZiBleHByZXNzaW9uID09PSAnc3RyaW5nJykge1xuICAgICAgICB2YXIgZm9ybXVsYSA9IHRoaXMuZGVjb2RlRm9ybXVsYShleHByZXNzaW9uKTtcbiAgICAgICAgbmV3RXhwciA9IHRoaXMucGFyc2UoZm9ybXVsYSwgY29udGV4dCk7XG4gICAgICAgIC8vIEFscmVhZHkgcGFyc2VkXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cHJlc3Npb24gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBuZXdFeHByID0gZXhwcmVzc2lvbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RXhwcjtcbiAgICB9XG5cbiAgICBhZGRFeHByZXNzaW9uKG5hbWUsIGV4cHJlc3Npb24pIHtcbiAgICAgICAgdmFyIG5ld0V4cHIgPSB0aGlzLnBhcnNlRXhwcmVzc2lvbihleHByZXNzaW9uLCBcImZvcm11bGFcIik7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmRhdGEuZXhwcmVzc2lvbnNbbmFtZV0gPSBuZXdFeHByO1xuICAgICAgICB0aGlzLmRhdGEuYWxsVmFsdWVzW25hbWVdID0gbmV3RXhwcjtcblxuICAgICAgICByZXR1cm4gbmV3RXhwcjtcbiAgICB9XG5cbiAgICAvLyBUaGlzIHJvdXRpbmUgdGFrZXMgdGhlIHRleHQgYW5kIGxvb2tzIGZvciBzdHJpbmdzIGluIG11c3RhY2hlcyB7e25hbWV9fVxuICAgIC8vIEl0IHJlcGxhY2VzIHRoaXMgZWxlbWVudCB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIHBhcmFtZXRlciwgdmFyaWFibGUsIG9yIGV4cHJlc3Npb24uXG4gICAgLy8gVGhlc2Ugc2hvdWxkIGhhdmUgYmVlbiBwcmV2aW91c2x5IHBhcnNlZCBhbmQgc3RvcmVkIGluIHRoaXMuZGF0YS5cbiAgICBkZWNvZGVGb3JtdWxhKHN0YXRlbWVudCwgZGlzcGxheU1vZGUpIHtcbiAgICAgICAgLy8gRmlyc3QgZmluZCBhbGwgb2YgdGhlIGV4cGVjdGVkIHN1YnN0aXR1dGlvbnMuXG4gICAgICAgIHZhciBzdWJzdFJlcXVlc3RMaXN0ID0ge307XG4gICAgICAgIHZhciBtYXRjaFJFID0gL1xce1xce1tBLVphLXpdXFx3KlxcfVxcfS9nO1xuICAgICAgICB2YXIgc3Vic3RNYXRjaGVzID0gc3RhdGVtZW50Lm1hdGNoKG1hdGNoUkUpO1xuICAgICAgICBpZiAoc3Vic3RNYXRjaGVzICE9IG51bGwpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxzdWJzdE1hdGNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2hOYW1lID0gc3Vic3RNYXRjaGVzW2ldO1xuICAgICAgICAgICAgICAgIG1hdGNoTmFtZSA9IG1hdGNoTmFtZS5zdWJzdHIoMixtYXRjaE5hbWUubGVuZ3RoLTQpO1xuICAgICAgICAgICAgICAgIC8vIE5vdyBzZWUgaWYgdGhlIG5hbWUgaXMgaW4gb3VyIHN1YnN0aXR1dGlvbiBydWxlcy5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhLmFsbFZhbHVlc1ttYXRjaE5hbWVdICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzcGxheU1vZGUgIT0gdW5kZWZpbmVkICYmIGRpc3BsYXlNb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzdFJlcXVlc3RMaXN0W21hdGNoTmFtZV0gPSAneycrdGhpcy5kYXRhLmFsbFZhbHVlc1ttYXRjaE5hbWVdLnRvVGVYKCkrJ30nO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic3RSZXF1ZXN0TGlzdFttYXRjaE5hbWVdID0gJygnK3RoaXMuZGF0YS5hbGxWYWx1ZXNbbWF0Y2hOYW1lXS50b1N0cmluZygpKycpJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdlIGFyZSBub3cgcmVhZHkgdG8gbWFrZSB0aGUgc3Vic3RpdHV0aW9ucy5cbiAgICAgICAgdmFyIHJldFN0cmluZyA9IHN0YXRlbWVudDtcbiAgICAgICAgZm9yICh2YXIgbWF0Y2ggaW4gc3Vic3RSZXF1ZXN0TGlzdCkge1xuICAgICAgICAgICAgdmFyIHJlID0gbmV3IFJlZ0V4cChcInt7XCIgKyBtYXRjaCArIFwifX1cIiwgXCJnXCIpO1xuICAgICAgICAgICAgdmFyIHN1YnN0ID0gc3Vic3RSZXF1ZXN0TGlzdFttYXRjaF07XG4gICAgICAgICAgICByZXRTdHJpbmcgPSByZXRTdHJpbmcucmVwbGFjZShyZSwgc3Vic3QpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXRTdHJpbmc7XG4gICAgfVxuXG4gICAgY29tcGFyZUV4cHJlc3Npb25zKGV4cHIxLCBleHByMikge1xuICAgICAgICBpZiAodHlwZW9mIGV4cHIxID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZXhwcjEgPSB0aGlzLnBhcnNlKGV4cHIxLCBcImZvcm11bGFcIilcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGV4cHIyID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZXhwcjIgPSB0aGlzLnBhcnNlKGV4cHIyLCBcImZvcm11bGFcIilcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKGV4cHIxLmNvbXBhcmUoZXhwcjIpKTtcbiAgICB9XG5cbiAgICBnZXRQYXJzZXIoY29udGV4dCkge1xuICAgICAgICB2YXIgc2VsZj10aGlzLFxuICAgICAgICAgICAgcGFyc2VDb250ZXh0PWNvbnRleHQ7XG4gICAgICAgIHJldHVybiAoZnVuY3Rpb24oZXhwclN0cmluZyl7IHJldHVybiBzZWxmLnBhcnNlKGV4cHJTdHJpbmcsIHBhcnNlQ29udGV4dCk7IH0pXG4gICAgfVxuIFxuICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgYnRtLnBhcnNlKCkgaXMgdGhlIHdvcmtob3JzZS5cblxuICAgICAgVGFrZSBhIHN0cmluZyByZXByZXNlbnRpbmcgYSBmb3JtdWxhLCBhbmQgZGVjb21wb3NlIGl0IGludG8gYW4gYXBwcm9wcmlhdGVcbiAgICAgIHRyZWUgc3RydWN0dXJlIHN1aXRhYmxlIGZvciByZWN1cnNpdmUgZXZhbHVhdGlvbiBvZiB0aGUgZnVuY3Rpb24uXG4gICAgICBSZXR1cm5zIHRoZSByb290IGVsZW1lbnQgdG8gdGhlIHRyZWUuXG4gICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gIHBhcnNlKGZvcm11bGFTdHIsIGNvbnRleHQsIGJpbmRpbmdzLCBvcHRpb25zKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICAgIGNvbnRleHQgPSBcImZvcm11bGFcIjtcbiAgICB9XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgICBiaW5kaW5ncyA9IHt9O1xuICAgIH1cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDQpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICBjb25zdCBudW1iZXJNYXRjaCA9IC9cXGR8KFxcLlxcZCkvO1xuICAgIGNvbnN0IG5hbWVNYXRjaCA9IC9bYS16QS1aXS87XG4gICAgY29uc3QgdW5vcE1hdGNoID0gL1tcXCtcXC0vXS87XG4gICAgY29uc3Qgb3BNYXRjaCA9IC9bXFwrXFwtKi9ePVxcJCZdLztcblxuICAgIHZhciBjaGFyUG9zID0gMCwgZW5kUG9zO1xuICAgIHZhciBwYXJzZUVycm9yID0gJyc7XG5cbiAgICAvLyBTdHJpcCBhbnkgZXh0cmFuZW91cyB3aGl0ZSBzcGFjZSBhbmQgcGFyZW50aGVzZXMuXG4gICAgdmFyIHdvcmtpbmdTdHI7XG4gICAgd29ya2luZ1N0ciA9IGZvcm11bGFTdHIudHJpbSgpO1xuXG4gICAgLy8gVGVzdCBpZiBwYXJlbnRoZXNlcyBhcmUgYWxsIGJhbGFuY2VkLlxuICAgIHZhciBoYXNFeHRyYVBhcmVucyA9IHRydWU7XG4gICAgd2hpbGUgKGhhc0V4dHJhUGFyZW5zKSB7XG4gICAgICBoYXNFeHRyYVBhcmVucyA9IGZhbHNlO1xuICAgICAgaWYgKHdvcmtpbmdTdHIuY2hhckF0KDApID09ICcoJykge1xuICAgICAgICB2YXIgZW5kRXhwciA9IGNvbXBsZXRlUGFyZW50aGVzaXMod29ya2luZ1N0ciwgMCk7XG4gICAgICAgIGlmIChlbmRFeHByKzEgPj0gd29ya2luZ1N0ci5sZW5ndGgpIHtcbiAgICAgICAgICBoYXNFeHRyYVBhcmVucyA9IHRydWU7XG4gICAgICAgICAgd29ya2luZ1N0ciA9IHdvcmtpbmdTdHIuc2xpY2UoMSwtMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXZSBidWlsZCB0aGUgdHJlZSBhcyBpdCBpcyBwYXJzZWQuIFxuICAgIC8vIFR3byBzdGFja3Mga2VlcCB0cmFjayBvZiBvcGVyYW5kcyAoZXhwcmVzc2lvbnMpIGFuZCBvcGVyYXRvcnNcbiAgICAvLyB3aGljaCB3ZSB3aWxsIGlkZW50aWZ5IGFzIHRoZSBzdHJpbmcgaXMgcGFyc2VkIGxlZnQgdG8gcmlnaHRcbiAgICAvLyBBdCB0aGUgdGltZSBhbiBvcGVyYW5kIGlzIHBhcnNlZCwgd2UgZG9uJ3Qga25vdyB0byB3aGljaCBvcGVyYXRvciBcbiAgICAvLyBpdCB1bHRpbWF0ZWx5IGJlbG9uZ3MsIHNvIHdlIHB1c2ggaXQgb250byBhIHN0YWNrIHVudGlsIHdlIGtub3cuXG4gICAgdmFyIG9wZXJhbmRTdGFjayA9IG5ldyBBcnJheSgpO1xuICAgIHZhciBvcGVyYXRvclN0YWNrID0gbmV3IEFycmF5KCk7XG5cbiAgICAvLyBXaGVuIGFuIG9wZXJhdG9yIGlzIHB1c2hlZCwgd2Ugd2FudCB0byBjb21wYXJlIGl0IHRvIHRoZSBwcmV2aW91cyBvcGVyYXRvclxuICAgIC8vIGFuZCBzZWUgaWYgd2UgbmVlZCB0byBhcHBseSB0aGUgb3BlcmF0b3JzIHRvIHNvbWUgb3BlcmFuZHMuXG4gICAgLy8gVGhpcyBpcyBiYXNlZCBvbiBvcGVyYXRvciBwcmVjZWRlbmNlIChvcmRlciBvZiBvcGVyYXRpb25zKS5cbiAgICAvLyBBbiBlbXB0eSBuZXdPcCBtZWFucyB0byBmaW5pc2ggcmVzb2x2ZSB0aGUgcmVzdCBvZiB0aGUgc3RhY2tzLlxuICAgIGZ1bmN0aW9uIHJlc29sdmVPcGVyYXRvcihidG0sIG9wZXJhdG9yU3RhY2ssIG9wZXJhbmRTdGFjaywgbmV3T3ApIHtcbiAgICAgIC8vIFRlc3QgaWYgdGhlIG9wZXJhdG9yIGhhcyBsb3dlciBwcmVjZWRlbmNlLlxuICAgICAgdmFyIG9sZE9wID0gMDtcbiAgICAgIHdoaWxlIChvcGVyYXRvclN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgb2xkT3AgPSBvcGVyYXRvclN0YWNrLnBvcCgpO1xuICAgICAgICBpZiAobmV3T3AgJiYgKG5ld09wLnR5cGU9PWV4cHJUeXBlLnVub3AgfHwgb2xkT3AucHJlYyA8IG5ld09wLnByZWMpKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRvIGdldCBoZXJlLCB0aGUgbmV3IG9wZXJhdG9yIG11c3QgYmUgKmJpbmFyeSpcbiAgICAgICAgLy8gYW5kIHRoZSBvcGVyYXRvciB0byB0aGUgbGVmdCBoYXMgKmhpZ2hlciogcHJlY2VkZW5jZS5cbiAgICAgICAgLy8gU28gd2UgbmVlZCB0byBwZWVsIG9mZiB0aGUgb3BlcmF0b3IgdG8gdGhlIGxlZnQgd2l0aCBpdHMgb3BlcmFuZHNcbiAgICAgICAgLy8gdG8gZm9ybSBhbiBleHByZXNzaW9uIGFzIGEgbmV3IGNvbXBvdW5kIG9wZXJhbmQgZm9yIHRoZSBuZXcgb3BlcmF0b3IuXG4gICAgICAgIHZhciBuZXdFeHByO1xuICAgICAgICAvLyBVbmFyeTogRWl0aGVyIG5lZ2F0aXZlIG9yIHJlY2lwcm9jYWwgcmVxdWlyZSAqb25lKiBvcGVyYW5kXG4gICAgICAgIGlmIChvbGRPcC50eXBlID09IGV4cHJUeXBlLnVub3ApIHtcbiAgICAgICAgICBpZiAob3BlcmFuZFN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBpbnB1dCA9IG9wZXJhbmRTdGFjay5wb3AoKTtcblxuICAgICAgICAgICAgLy8gRGVhbCB3aXRoIG5lZ2F0aXZlIG51bWJlcnMgc2VwYXJhdGVseS5cbiAgICAgICAgICAgIGlmIChidG0ub3B0aW9ucy5uZWdhdGl2ZU51bWJlcnMgJiYgaW5wdXQudHlwZSA9PSBleHByVHlwZS5udW1iZXIgJiYgb2xkT3Aub3AgPT0gJy0nKSB7XG4gICAgICAgICAgICAgIG5ld0V4cHIgPSBuZXcgc2NhbGFyX2V4cHIoYnRtLCBpbnB1dC5udW1iZXIubXVsdGlwbHkoLTEpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG5ld0V4cHIgPSBuZXcgdW5vcF9leHByKGJ0bSwgb2xkT3Aub3AsIGlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3RXhwciA9IG5ldyBleHByZXNzaW9uKGJ0bSk7XG4gICAgICAgICAgICBuZXdFeHByLnNldFBhcnNpbmdFcnJvcihcIkluY29tcGxldGUgZm9ybXVsYTogbWlzc2luZyB2YWx1ZSBmb3IgXCIgKyBvbGRPcC5vcCk7XG4gICAgICAgICAgfVxuICAgICAgICAvLyBCaW5hcnk6IFdpbGwgYmUgKnR3byogb3BlcmFuZHMuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG9wZXJhbmRTdGFjay5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICB2YXIgaW5wdXRCID0gb3BlcmFuZFN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgdmFyIGlucHV0QSA9IG9wZXJhbmRTdGFjay5wb3AoKTtcbiAgICAgICAgICAgIG5ld0V4cHIgPSBuZXcgYmlub3BfZXhwcihidG0sIG9sZE9wLm9wLCBpbnB1dEEsIGlucHV0Qik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0V4cHIgPSBuZXcgZXhwcmVzc2lvbihidG0pO1xuICAgICAgICAgICAgbmV3RXhwci5zZXRQYXJzaW5nRXJyb3IoXCJJbmNvbXBsZXRlIGZvcm11bGE6IG1pc3NpbmcgdmFsdWUgZm9yIFwiICsgb2xkT3Aub3ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBvcGVyYW5kU3RhY2sucHVzaChuZXdFeHByKTtcbiAgICAgICAgb2xkT3AgPSAwO1xuICAgICAgfVxuICAgICAgLy8gVGhlIG5ldyBvcGVyYXRvciBpcyB1bmFyeSBvciBoYXMgaGlnaGVyIHByZWNlZGVuY2UgdGhhbiB0aGUgcHJldmlvdXMgb3AuXG4gICAgICAvLyBXZSBuZWVkIHRvIHB1c2ggdGhlIG9sZCBvcGVyYXRvciBiYWNrIG9uIHRoZSBzdGFjayB0byB1c2UgbGF0ZXIuXG4gICAgICBpZiAob2xkT3AgIT0gMCkge1xuICAgICAgICBvcGVyYXRvclN0YWNrLnB1c2gob2xkT3ApO1xuICAgICAgfVxuICAgICAgLy8gQSBuZXcgb3BlcmF0aW9uIHdhcyBhZGRlZCB0byBkZWFsIHdpdGggbGF0ZXIuXG4gICAgICBpZiAobmV3T3ApIHtcbiAgICAgICAgb3BlcmF0b3JTdGFjay5wdXNoKG5ld09wKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOb3cgd2UgYmVnaW4gdG8gcHJvY2VzcyB0aGUgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZXhwcmVzc2lvbi5cbiAgICB2YXIgbGFzdEVsZW1lbnQgPSAtMSwgbmV3RWxlbWVudDsgLy8gMCBmb3Igb3BlcmFuZCwgMSBmb3Igb3BlcmF0b3IuXG5cbiAgICAvLyBSZWFkIHN0cmluZyBsZWZ0IHRvIHJpZ2h0LlxuICAgIC8vIElkZW50aWZ5IHdoYXQgdHlwZSBvZiBtYXRoIG9iamVjdCBzdGFydHMgYXQgdGhpcyBjaGFyYWN0ZXIuXG4gICAgLy8gRmluZCB0aGUgb3RoZXIgZW5kIG9mIHRoYXQgb2JqZWN0IGJ5IGNvbXBsZXRpb24uXG4gICAgLy8gSW50ZXJwcmV0IHRoYXQgb2JqZWN0LCBwb3NzaWJseSB0aHJvdWdoIGEgcmVjdXJzaXZlIHBhcnNpbmcuXG4gICAgZm9yIChjaGFyUG9zID0gMDsgY2hhclBvczx3b3JraW5nU3RyLmxlbmd0aDsgY2hhclBvcysrKSB7XG4gICAgICAvLyBJZGVudGlmeSB0aGUgbmV4dCBlbGVtZW50IGluIHRoZSBzdHJpbmcuXG4gICAgICBpZiAod29ya2luZ1N0ci5jaGFyQXQoY2hhclBvcykgPT0gJyAnKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAvLyBJdCBtaWdodCBiZSBhIGNsb3NlIHBhcmVudGhlc2VzIHRoYXQgd2FzIG5vdCBtYXRjaGVkIG9uIHRoZSBsZWZ0LlxuICAgICAgfSBlbHNlIGlmICh3b3JraW5nU3RyLmNoYXJBdChjaGFyUG9zKSA9PSAnKScpIHtcbiAgICAgICAgLy8gVHJlYXQgdGhpcyBsaWtlIGFuIGltcGxpY2l0IG9wZW4gcGFyZW50aGVzaXMgb24gdGhlIGxlZnQuXG4gICAgICAgIHJlc29sdmVPcGVyYXRvcih0aGlzLCBvcGVyYXRvclN0YWNrLCBvcGVyYW5kU3RhY2spO1xuICAgICAgICBuZXdFbGVtZW50ID0gMDtcbiAgICAgICAgbGFzdEVsZW1lbnQgPSAtMTtcblxuICAgICAgLy8gSXQgY291bGQgYmUgYW4gZXhwcmVzc2lvbiBzdXJyb3VuZGVkIGJ5IHBhcmVudGhlc2VzIC0tIHVzZSByZWN1cnNpb25cbiAgICAgIH0gZWxzZSBpZiAod29ya2luZ1N0ci5jaGFyQXQoY2hhclBvcykgPT0gJygnKSB7XG4gICAgICAgIGVuZFBvcyA9IGNvbXBsZXRlUGFyZW50aGVzaXMod29ya2luZ1N0ciwgY2hhclBvcyk7XG4gICAgICAgIHZhciBzdWJFeHByU3RyID0gd29ya2luZ1N0ci5zbGljZShjaGFyUG9zKzEsZW5kUG9zKTtcbiAgICAgICAgdmFyIHN1YkV4cHIgPSB0aGlzLnBhcnNlKHN1YkV4cHJTdHIsIGNvbnRleHQsIGJpbmRpbmdzKTtcbiAgICAgICAgb3BlcmFuZFN0YWNrLnB1c2goc3ViRXhwcik7XG4gICAgICAgIG5ld0VsZW1lbnQgPSAwO1xuICAgICAgICBjaGFyUG9zID0gZW5kUG9zO1xuXG4gICAgICAvLyBJdCBjb3VsZCBiZSBhbiBhYnNvbHV0ZSB2YWx1ZVxuICAgICAgfSBlbHNlIGlmICh3b3JraW5nU3RyLmNoYXJBdChjaGFyUG9zKSA9PSAnfCcpIHtcbiAgICAgICAgZW5kUG9zID0gY29tcGxldGVBYnNWYWx1ZSh3b3JraW5nU3RyLCBjaGFyUG9zKTtcbiAgICAgICAgdmFyIHN1YkV4cHJTdHIgPSB3b3JraW5nU3RyLnNsaWNlKGNoYXJQb3MrMSxlbmRQb3MpO1xuICAgICAgICB2YXIgc3ViRXhwciA9IHRoaXMucGFyc2Uoc3ViRXhwclN0ciwgY29udGV4dCwgYmluZGluZ3MpO1xuICAgICAgICB2YXIgbmV3RXhwciA9IG5ldyBmdW5jdGlvbl9leHByKHRoaXMsICdhYnMnLCBzdWJFeHByKTtcbiAgICAgICAgb3BlcmFuZFN0YWNrLnB1c2gobmV3RXhwcik7XG4gICAgICAgIG5ld0VsZW1lbnQgPSAwO1xuICAgICAgICBjaGFyUG9zID0gZW5kUG9zO1xuXG4gICAgICAvLyBJdCBjb3VsZCBiZSBhIG51bWJlci4gSnVzdCByZWFkIGl0IG9mZlxuICAgICAgfSBlbHNlIGlmICh3b3JraW5nU3RyLnN1YnN0cihjaGFyUG9zKS5zZWFyY2gobnVtYmVyTWF0Y2gpID09IDApIHtcbiAgICAgICAgZW5kUG9zID0gY29tcGxldGVOdW1iZXIod29ya2luZ1N0ciwgY2hhclBvcywgb3B0aW9ucyk7XG4gICAgICAgIHZhciBuZXdFeHByID0gbmV3IHNjYWxhcl9leHByKHRoaXMsIG5ldyBOdW1iZXIod29ya2luZ1N0ci5zbGljZShjaGFyUG9zLCBlbmRQb3MpKSk7XG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubm9EZWNpbWFscyAmJiB3b3JraW5nU3RyLmNoYXJBdChjaGFyUG9zKSA9PSAnLicpIHtcbiAgICAgICAgICBuZXdFeHByLnNldFBhcnNpbmdFcnJvcihcIldob2xlIG51bWJlcnMgb25seS4gTm8gZGVjaW1hbCB2YWx1ZXMgYXJlIGFsbG93ZWQuXCIpXG4gICAgICAgIH1cbiAgICAgICAgb3BlcmFuZFN0YWNrLnB1c2gobmV3RXhwcik7XG4gICAgICAgIG5ld0VsZW1lbnQgPSAwO1xuICAgICAgICBjaGFyUG9zID0gZW5kUG9zLTE7XG5cbiAgICAgIC8vIEl0IGNvdWxkIGJlIGEgbmFtZSwgZWl0aGVyIGEgZnVuY3Rpb24gb3IgdmFyaWFibGUuXG4gICAgICB9IGVsc2UgaWYgKHdvcmtpbmdTdHIuc3Vic3RyKGNoYXJQb3MpLnNlYXJjaChuYW1lTWF0Y2gpID09IDApIHtcbiAgICAgICAgZW5kUG9zID0gY29tcGxldGVOYW1lKHdvcmtpbmdTdHIsIGNoYXJQb3MpO1xuICAgICAgICB2YXIgdGhlTmFtZSA9IHdvcmtpbmdTdHIuc2xpY2UoY2hhclBvcyxlbmRQb3MpO1xuICAgICAgICAvLyBJZiBub3QgYSBrbm93biBuYW1lLCBicmVhayBpdCBkb3duIHVzaW5nIGNvbXBvc2l0ZSBpZiBwb3NzaWJsZS5cbiAgICAgICAgaWYgKGJpbmRpbmdzW3RoZU5hbWVdPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vIFJldHVybnMgdGhlIGZpcnN0IGtub3duIG5hbWUsIG9yIHRoZU5hbWUgbm90IGNvbXBvc2l0ZS5cbiAgICAgICAgICB2YXIgdGVzdFJlc3VsdHMgPSBUZXN0TmFtZUlzQ29tcG9zaXRlKHRoZU5hbWUsIGJpbmRpbmdzKTtcbiAgICAgICAgICBpZiAodGVzdFJlc3VsdHMuaXNDb21wb3NpdGUpIHtcbiAgICAgICAgICAgIHRoZU5hbWUgPSB0ZXN0UmVzdWx0cy5uYW1lO1xuICAgICAgICAgICAgZW5kUG9zID0gY2hhclBvcyArIHRoZU5hbWUubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBUZXN0IGlmIGEgZnVuY3Rpb25cbiAgICAgICAgaWYgKGJpbmRpbmdzW3RoZU5hbWVdPT09dW5kZWZpbmVkICYmIHdvcmtpbmdTdHIuY2hhckF0KGVuZFBvcykgPT0gJygnKSB7XG4gICAgICAgICAgdmFyIGVuZFBhcmVuID0gY29tcGxldGVQYXJlbnRoZXNpcyh3b3JraW5nU3RyLCBlbmRQb3MpO1xuXG4gICAgICAgICAgdmFyIGZjbk5hbWUgPSB0aGVOYW1lO1xuICAgICAgICAgIHZhciBuZXdFeHByO1xuICAgICAgICAgIC8vIFNlZSBpZiB0aGlzIGlzIGEgZGVyaXZhdGl2ZVxuICAgICAgICAgIGlmIChmY25OYW1lID09ICdEJykge1xuICAgICAgICAgICAgdmFyIGV4cHIsIGl2YXIsIGl2YXJWYWx1ZTtcbiAgICAgICAgICAgIHZhciBlbnRyaWVzID0gd29ya2luZ1N0ci5zbGljZShlbmRQb3MrMSxlbmRQYXJlbikuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgZXhwciA9IHRoaXMucGFyc2UoZW50cmllc1swXSwgY29udGV4dCwgYmluZGluZ3MpO1xuICAgICAgICAgICAgaWYgKGVudHJpZXMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgbmV3RXhwciA9IG5ldyBkZXJpdl9leHByKHRoaXMsIGV4cHIsICd4Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpdmFyID0gdGhpcy5wYXJzZShlbnRyaWVzWzFdLCBjb250ZXh0LCBiaW5kaW5ncyk7XG4gICAgICAgICAgICAgIC8vIEQoZih4KSx4LGMpIG1lYW5zIGYnKGMpXG4gICAgICAgICAgICAgIGlmIChlbnRyaWVzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgICAgICBpdmFyVmFsdWUgPSB0aGlzLnBhcnNlKGVudHJpZXNbMl0sIGNvbnRleHQsIGJpbmRpbmdzKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBuZXdFeHByID0gbmV3IGRlcml2X2V4cHIodGhpcywgZXhwciwgaXZhciwgaXZhclZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHN1YkV4cHIgPSB0aGlzLnBhcnNlKHdvcmtpbmdTdHIuc2xpY2UoZW5kUG9zKzEsZW5kUGFyZW4pLCBjb250ZXh0LCBiaW5kaW5ncyk7XG4gICAgICAgICAgICBuZXdFeHByID0gbmV3IGZ1bmN0aW9uX2V4cHIodGhpcywgdGhlTmFtZSwgc3ViRXhwcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIG9wZXJhbmRTdGFjay5wdXNoKG5ld0V4cHIpO1xuICAgICAgICAgIG5ld0VsZW1lbnQgPSAwO1xuICAgICAgICAgIGNoYXJQb3MgPSBlbmRQYXJlbjtcbiAgICAgICAgfVxuICAgICAgICAvLyBvciBhIHZhcmlhYmxlLlxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAvLyBUZXN0IGlmIG5lZWRzIGluZGV4XG4gICAgICAgICAgaWYgKHdvcmtpbmdTdHIuY2hhckF0KGVuZFBvcykgPT0gJ1snKSB7XG4gICAgICAgICAgICB2YXIgZW5kUGFyZW4sIGhhc0Vycm9yPWZhbHNlO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgZW5kUGFyZW4gPSBjb21wbGV0ZUJyYWNrZXQod29ya2luZ1N0ciwgZW5kUG9zLCB0cnVlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgIHBhcnNlRXJyb3IgPSBlcnJvcjtcbiAgICAgICAgICAgICAgaGFzRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICBlbmRQYXJlbiA9IGVuZFBvcysxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGluZGV4RXhwciA9IHRoaXMucGFyc2Uod29ya2luZ1N0ci5zbGljZShlbmRQb3MrMSxlbmRQYXJlbiksIGNvbnRleHQsIGJpbmRpbmdzKTtcbiAgICAgICAgICAgIHZhciBuZXdFeHByID0gbmV3IGluZGV4X2V4cHIodGhpcywgdGhlTmFtZSwgaW5kZXhFeHByKTtcbiAgICAgICAgICAgIGlmIChoYXNFcnJvcikge1xuICAgICAgICAgICAgICBuZXdFeHByLnNldFBhcnNpbmdFcnJvcihwYXJzZUVycm9yKTtcbiAgICAgICAgICAgICAgcGFyc2VFcnJvciA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcGVyYW5kU3RhY2sucHVzaChuZXdFeHByKTtcbiAgICAgICAgICAgIG5ld0VsZW1lbnQgPSAwO1xuICAgICAgICAgICAgY2hhclBvcyA9IGVuZFBhcmVuO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbmV3RXhwciA9IG5ldyB2YXJpYWJsZV9leHByKHRoaXMsIHRoZU5hbWUpO1xuICAgICAgICAgICAgb3BlcmFuZFN0YWNrLnB1c2gobmV3RXhwcik7XG4gICAgICAgICAgICBuZXdFbGVtZW50ID0gMDtcbiAgICAgICAgICAgIGNoYXJQb3MgPSBlbmRQb3MtMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgLy8gSXQgY291bGQgYmUgYW4gb3BlcmF0b3IuXG4gICAgICB9IGVsc2UgaWYgKHdvcmtpbmdTdHIuc3Vic3RyKGNoYXJQb3MpLnNlYXJjaChvcE1hdGNoKSA9PSAwKSB7XG4gICAgICAgIG5ld0VsZW1lbnQgPSAxO1xuICAgICAgICB2YXIgb3AgPSB3b3JraW5nU3RyLmNoYXJBdChjaGFyUG9zKTtcbiAgICAgICAgdmFyIG5ld09wID0gbmV3IG9wZXJhdG9yKG9wKTtcblxuICAgICAgICAvLyBDb25zZWN1dGl2ZSBvcGVyYXRvcnM/ICAgIEJldHRlciBiZSBzaWduIGNoYW5nZSBvciByZWNpcHJvY2FsLlxuICAgICAgICBpZiAobGFzdEVsZW1lbnQgIT0gMCkge1xuICAgICAgICAgIGlmIChvcCA9PSBcIi1cIiB8fCBvcCA9PSBcIi9cIikge1xuICAgICAgICAgICAgbmV3T3AudHlwZSA9IGV4cHJUeXBlLnVub3A7XG4gICAgICAgICAgICBuZXdPcC5wcmVjID0gb3BQcmVjLm11bHRkaXY7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEVSUk9SISEhXG4gICAgICAgICAgICBwYXJzZUVycm9yID0gXCJFcnJvcjogY29uc2VjdXRpdmUgb3BlcmF0b3JzXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlc29sdmVPcGVyYXRvcih0aGlzLCBvcGVyYXRvclN0YWNrLCBvcGVyYW5kU3RhY2ssIG5ld09wKTtcbiAgICAgIH1cblxuICAgICAgLy8gVHdvIGNvbnNlY3V0aXZlIG9wZXJhbmRzIG11c3QgaGF2ZSBhbiBpbXBsaWNpdCBtdWx0aXBsaWNhdGlvbiBiZXR3ZWVuIHRoZW1cbiAgICAgIGlmIChsYXN0RWxlbWVudCA9PSAwICYmIG5ld0VsZW1lbnQgPT0gMCkge1xuICAgICAgICB2YXIgaG9sZEVsZW1lbnQgPSBvcGVyYW5kU3RhY2sucG9wKCk7XG5cbiAgICAgICAgLy8gUHVzaCBhIG11bHRpcGxpY2F0aW9uXG4gICAgICAgIHZhciBuZXdPcCA9IG5ldyBvcGVyYXRvcignKicpO1xuICAgICAgICByZXNvbHZlT3BlcmF0b3IodGhpcywgb3BlcmF0b3JTdGFjaywgb3BlcmFuZFN0YWNrLCBuZXdPcCk7XG5cbiAgICAgICAgLy8gVGhlbiByZXN0b3JlIHRoZSBvcGVyYW5kIHN0YWNrLlxuICAgICAgICBvcGVyYW5kU3RhY2sucHVzaChob2xkRWxlbWVudCk7XG4gICAgICB9XG4gICAgICBsYXN0RWxlbWVudCA9IG5ld0VsZW1lbnQ7XG4gICAgfVxuXG4gICAgLy8gTm93IGZpbmlzaCB1cCB0aGUgb3BlcmF0b3Igc3RhY2s6IG5vdGhpbmcgbmV3IHRvIGluY2x1ZGVcbiAgICByZXNvbHZlT3BlcmF0b3IodGhpcywgb3BlcmF0b3JTdGFjaywgb3BlcmFuZFN0YWNrKTtcbiAgICB2YXIgZmluYWxFeHByZXNzaW9uID0gb3BlcmFuZFN0YWNrLnBvcCgpO1xuICAgIGlmIChwYXJzZUVycm9yLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZmluYWxFeHByZXNzaW9uLnNldFBhcnNpbmdFcnJvcihwYXJzZUVycm9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUZXN0IGlmIGNvbnRleHQgaXMgY29uc2lzdGVudFxuICAgICAgICBzd2l0Y2ggKGNvbnRleHQpIHtcbiAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICAgICAgaWYgKCFmaW5hbEV4cHJlc3Npb24uaXNDb25zdGFudCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vdGhyb3cgXCJUaGUgZXhwcmVzc2lvbiBzaG91bGQgYmUgYSBjb25zdGFudCBidXQgZGVwZW5kcyBvbiB2YXJpYWJsZXMuXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmluYWxFeHByZXNzaW9uID0gbmV3IHNjYWxhcl9leHByKHRoaXMsIGZpbmFsRXhwcmVzc2lvbi52YWx1ZSgpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Zvcm11bGEnOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIC8vZmluYWxFeHByZXNzaW9uLnNldENvbnRleHQoY29udGV4dCk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmRvRmxhdHRlbikge1xuICAgICAgZmluYWxFeHByZXNzaW9uLmZsYXR0ZW4oKTtcbiAgICB9XG4gICAgcmV0dXJuIGZpbmFsRXhwcmVzc2lvbjtcbiAgfVxufVxuXG4vLyBVc2VkIGluIHBhcnNlXG5mdW5jdGlvbiBvcGVyYXRvcihvcFN0cikge1xuICB0aGlzLm9wID0gb3BTdHI7XG4gIHN3aXRjaChvcFN0cikge1xuICAgIGNhc2UgJysnOlxuICAgIGNhc2UgJy0nOlxuICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLmFkZHN1YjtcbiAgICAgIHRoaXMudHlwZSA9IGV4cHJUeXBlLmJpbm9wO1xuICAgICAgdGhpcy52YWx1ZVR5cGUgPSBleHByVmFsdWUubnVtZXJpYztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJyonOlxuICAgIGNhc2UgJy8nOlxuICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLm11bHRkaXY7XG4gICAgICB0aGlzLnR5cGUgPSBleHByVHlwZS5iaW5vcDtcbiAgICAgIHRoaXMudmFsdWVUeXBlID0gZXhwclZhbHVlLm51bWVyaWM7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdeJzpcbiAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5wb3dlcjtcbiAgICAgIHRoaXMudHlwZSA9IGV4cHJUeXBlLmJpbm9wO1xuICAgICAgdGhpcy52YWx1ZVR5cGUgPSBleHByVmFsdWUubnVtZXJpYztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJyYnOlxuICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLmNvbmo7XG4gICAgICB0aGlzLnR5cGUgPSBleHByVHlwZS5iaW5vcDtcbiAgICAgIHRoaXMudmFsdWVUeXBlID0gZXhwclZhbHVlLmJvb2w7XG4gICAgICBicmVhaztcbiAgICBjYXNlICckJzogIC8vICQ9b3Igc2luY2UgfD1hYnNvbHV0ZSB2YWx1ZSBiYXJcbi8vICAgIHRoaXMub3AgPSAnfCdcbiAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5kaXNqO1xuICAgICAgdGhpcy50eXBlID0gZXhwclR5cGUuYmlub3A7XG4gICAgICB0aGlzLnZhbHVlVHlwZSA9IGV4cHJWYWx1ZS5ib29sO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnPSc6XG4gICAgICB0aGlzLnByZWMgPSBvcFByZWMuZXF1YWw7XG4gICAgICB0aGlzLnR5cGUgPSBleHByVHlwZS5iaW5vcDtcbiAgICAgIHRoaXMudmFsdWVUeXBlID0gZXhwclZhbHVlLmJvb2w7XG4gICAgICBicmVhaztcbiAgICBjYXNlICcsJzpcbiAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5mb3A7XG4gICAgICB0aGlzLnR5cGUgPSBleHByVHlwZS5hcnJheTtcbiAgICAgIHRoaXMudmFsdWVUeXBlID0gZXhwclZhbHVlLnZlY3RvcjtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aGlzLnByZWMgPSBvcFByZWMuZmNuO1xuICAgICAgdGhpcy50eXBlID0gZXhwclR5cGUuZmNuO1xuICAgICAgYnJlYWs7XG4gIH1cbn1cblxuLyogQW4gYWJzb2x1dGUgdmFsdWUgY2FuIGJlIGNvbXBsaWNhdGVkIGJlY2F1c2UgYWxzbyBhIGZ1bmN0aW9uLiBcbk1heSBub3QgYmUgY2xlYXIgaWYgbmVzdGVkOiB8Mnx4LTN8LSA1fC5cbklzIHRoYXQgMngtMTUgb3IgYWJzKDJ8eC0zfC01KT9cblJlc29sdmUgYnkgcmVxdWlyaW5nIGV4cGxpY2l0IG9wZXJhdGlvbnM6IHwyKnx4LTN8LTV8IG9yIHwyfCp4LTMqfC01fFxuKi9cbmZ1bmN0aW9uIGNvbXBsZXRlQWJzVmFsdWUoZm9ybXVsYVN0ciwgc3RhcnRQb3MpIHtcbiAgdmFyIHBMZXZlbCA9IDE7XG4gIHZhciBjaGFyUG9zID0gc3RhcnRQb3M7XG4gIHZhciB3YXNPcCA9IHRydWU7IC8vIG9wZW4gYWJzb2x1dGUgdmFsdWUgaW1wbGljaXRseSBoYXMgcHJldmlvdXMgb3BlcmF0aW9uLlxuXG4gIHdoaWxlIChwTGV2ZWwgPiAwICYmIGNoYXJQb3MgPCBmb3JtdWxhU3RyLmxlbmd0aCkge1xuICAgIGNoYXJQb3MrKztcbiAgICAvLyBXZSBlbmNvdW50ZXIgYW5vdGhlciBhYnNvbHV0ZSB2YWx1ZS5cbiAgICBpZiAoZm9ybXVsYVN0ci5jaGFyQXQoY2hhclBvcykgPT0gJ3wnKSB7XG4gICAgICBpZiAod2FzT3ApIHsgLy8gTXVzdCBiZSBvcGVuaW5nIGEgbmV3IGFic29sdXRlIHZhbHVlLlxuICAgICAgICBwTGV2ZWwrKztcbiAgICAgICAgLy8gd2FzT3AgaXMgc3RpbGwgdHJ1ZSBzaW5jZSBjYW4ndCBjbG9zZSBpbW1lZGlhdGVseVxuICAgICAgfSBlbHNlIHsgIC8vIEFzc3VtZSBjbG9zaW5nIGFic29sdXRlIHZhbHVlLiBJZiBub3Qgd2FudGVkLCBuZWVkIG9wZXJhdG9yLlxuICAgICAgICBwTGV2ZWwtLTtcbiAgICAgICAgLy8gd2FzT3AgaXMgc3RpbGwgZmFsc2Ugc2luY2UganVzdCBjbG9zZWQgYSB2YWx1ZS5cbiAgICAgIH1cbiAgICAvLyBLZWVwIHRyYWNrIG9mIHdoZXRoZXIganVzdCBoYWQgb3BlcmF0b3Igb3Igbm90LlxuICAgIH0gZWxzZSBpZiAoXCIrLSovKFtcIi5zZWFyY2goZm9ybXVsYVN0ci5jaGFyQXQoY2hhclBvcykpID49IDApIHtcbiAgICAgIHdhc09wID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGZvcm11bGFTdHIuY2hhckF0KGNoYXJQb3MpICE9ICcgJykge1xuICAgICAgd2FzT3AgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuKGNoYXJQb3MpO1xufVxuXG4vLyBGaW5kIHRoZSBiYWxhbmNpbmcgY2xvc2luZyBwYXJlbnRoZXNpcy5cbmZ1bmN0aW9uIGNvbXBsZXRlUGFyZW50aGVzaXMoZm9ybXVsYVN0ciwgc3RhcnRQb3MpIHtcbiAgdmFyIHBMZXZlbCA9IDE7XG4gIHZhciBjaGFyUG9zID0gc3RhcnRQb3M7XG5cbiAgd2hpbGUgKHBMZXZlbCA+IDAgJiYgY2hhclBvcyA8IGZvcm11bGFTdHIubGVuZ3RoKSB7XG4gICAgY2hhclBvcysrO1xuICAgIGlmIChmb3JtdWxhU3RyLmNoYXJBdChjaGFyUG9zKSA9PSAnKScpIHtcbiAgICAgIHBMZXZlbC0tO1xuICAgIH0gZWxzZSBpZiAoZm9ybXVsYVN0ci5jaGFyQXQoY2hhclBvcykgPT0gJygnKSB7XG4gICAgICBwTGV2ZWwrKztcbiAgICB9XG4gIH1cbiAgcmV0dXJuKGNoYXJQb3MpO1xufVxuXG4vLyBCcmFja2V0cyBhcmUgdXNlZCBmb3Igc2VxdWVuY2UgaW5kZXhpbmcsIG5vdCByZWd1bGFyIGdyb3VwaW5nLlxuZnVuY3Rpb24gY29tcGxldGVCcmFja2V0KGZvcm11bGFTdHIsIHN0YXJ0UG9zLCBhc1N1YnNjcmlwdCkge1xuICB2YXIgcExldmVsID0gMTtcbiAgdmFyIGNoYXJQb3MgPSBzdGFydFBvcztcbiAgdmFyIGZhaWwgPSBmYWxzZTtcblxuICB3aGlsZSAocExldmVsID4gMCAmJiBjaGFyUG9zIDwgZm9ybXVsYVN0ci5sZW5ndGgpIHtcbiAgICBjaGFyUG9zKys7XG4gICAgaWYgKGZvcm11bGFTdHIuY2hhckF0KGNoYXJQb3MpID09ICddJykge1xuICAgICAgICBwTGV2ZWwtLTtcbiAgICB9IGVsc2UgaWYgKGZvcm11bGFTdHIuY2hhckF0KGNoYXJQb3MpID09ICdbJykge1xuICAgICAgICBpZiAoYXNTdWJzY3JpcHQpIHtcbiAgICAgICAgICBmYWlsID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBwTGV2ZWwrKztcbiAgICB9XG4gIH1cbiAgaWYgKGFzU3Vic2NyaXB0ICYmIGZhaWwpIHtcbiAgICB0aHJvdyBcIk5lc3RlZCBicmFja2V0cyB1c2VkIGZvciBzdWJzY3JpcHRzIGFyZSBub3Qgc3VwcG9ydGVkLlwiO1xuICB9XG4gIHJldHVybihjaGFyUG9zKTtcbn1cblxuLyogR2l2ZW4gYSBzdHJpbmcgYW5kIGEgc3RhcnRpbmcgcG9zaXRpb24gb2YgYSBuYW1lLCBpZGVudGlmeSB0aGUgZW50aXJlIG5hbWUuICovXG4vKiBSZXF1aXJlIHN0YXJ0IHdpdGggbGV0dGVyLCB0aGVuIGFueSBzZXF1ZW5jZSBvZiAqd29yZCogY2hhcmFjdGVyICovXG4vKiBBbHNvIGFsbG93IHByaW1lcyBmb3IgZGVyaXZhdGl2ZXMgYXQgdGhlIGVuZC4gKi9cbmZ1bmN0aW9uIGNvbXBsZXRlTmFtZShmb3JtdWxhU3RyLCBzdGFydFBvcykge1xuICB2YXIgbWF0Y2hSdWxlID0gL1tBLVphLXpdXFx3KicqLztcbiAgdmFyIG1hdGNoID0gZm9ybXVsYVN0ci5zdWJzdHIoc3RhcnRQb3MpLm1hdGNoKG1hdGNoUnVsZSk7XG4gIHJldHVybihzdGFydFBvcyArIG1hdGNoWzBdLmxlbmd0aCk7XG59XG5cbi8qIEdpdmVuIGEgc3RyaW5nIGFuZCBhIHN0YXJ0aW5nIHBvc2l0aW9uIG9mIGEgbnVtYmVyLCBpZGVudGlmeSB0aGUgZW50aXJlIG51bWJlci4gKi9cbmZ1bmN0aW9uIGNvbXBsZXRlTnVtYmVyKGZvcm11bGFTdHIsIHN0YXJ0UG9zLCBvcHRpb25zKSB7XG4gIHZhciBtYXRjaFJ1bGU7XG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMubm9EZWNpbWFscykge1xuICAgIG1hdGNoUnVsZSA9IC9bMC05XSovO1xuICB9IGVsc2Uge1xuICAgIG1hdGNoUnVsZSA9IC9bMC05XSooXFwuWzAtOV0qKT8oZS0/WzAtOV0rKT8vO1xuICB9XG4gIHZhciBtYXRjaCA9IGZvcm11bGFTdHIuc3Vic3RyKHN0YXJ0UG9zKS5tYXRjaChtYXRjaFJ1bGUpO1xuICByZXR1cm4oc3RhcnRQb3MgKyBtYXRjaFswXS5sZW5ndGgpO1xufVxuXG4vKiBUZXN0cyBhIHN0cmluZyB0byBzZWUgaWYgaXQgY2FuIGJlIGNvbnN0cnVjdGVkIGFzIGEgY29uY2F0ZW50YXRpb24gb2Yga25vd24gbmFtZXMuICovXG4vKiBGb3IgZXhhbXBsZSwgYWJjIGNvdWxkIGJlIGEgbmFtZSBvciBjb3VsZCBiZSBhKmIqYyAqL1xuLyogUGFzcyBpbiB0aGUgYmluZGluZ3MgZ2l2aW5nIHRoZSBrbm93biBuYW1lcyBhbmQgc2VlIGlmIHdlIGNhbiBidWlsZCB0aGlzIG5hbWUgKi9cbi8qIFJldHVybiB0aGUgKmZpcnN0KiBuYW1lIHRoYXQgaXMgcGFydCBvZiB0aGUgd2hvbGUuICovXG5mdW5jdGlvbiBUZXN0TmFtZUlzQ29tcG9zaXRlKHRleHQsIGJpbmRpbmdzKSB7XG4gIHZhciByZXRTdHJ1Y3QgPSBuZXcgT2JqZWN0KCk7XG4gIHJldFN0cnVjdC5pc0NvbXBvc2l0ZSA9IGZhbHNlO1xuXG4gIGlmIChiaW5kaW5ncyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIHJlbWFpbiwgbmV4dE5hbWU7XG4gICAgaWYgKGJpbmRpbmdzW3RleHRdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldFN0cnVjdC5pc0NvbXBvc2l0ZSA9IHRydWU7XG4gICAgICByZXRTdHJ1Y3QubmFtZSA9IHRleHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNlZSBpZiB0aGUgdGV4dCAqc3RhcnRzKiB3aXRoIGEga25vd24gbmFtZVxuICAgICAgdmFyIGtub3duTmFtZXMgPSBPYmplY3Qua2V5cyhiaW5kaW5ncyk7XG4gICAgICBmb3IgKHZhciBpa2V5IGluIGtub3duTmFtZXMpIHtcbiAgICAgICAgbmV4dE5hbWUgPSBrbm93bk5hbWVzW2lrZXldO1xuICAgICAgICAvLyBJZiAqdGhpcyogbmFtZSBpcyB0aGUgc3RhcnQgb2YgdGhlIHRleHQsIHNlZSBpZiB0aGUgcmVzdCBmcm9tIGtub3duIG5hbWVzLlxuICAgICAgICBpZiAodGV4dC5zZWFyY2gobmV4dE5hbWUpPT0wKSB7XG4gICAgICAgICAgcmVtYWluID0gVGVzdE5hbWVJc0NvbXBvc2l0ZSh0ZXh0LnNsaWNlKG5leHROYW1lLmxlbmd0aCksIGJpbmRpbmdzKTtcbiAgICAgICAgICBpZiAocmVtYWluLmlzQ29tcG9zaXRlKSB7XG4gICAgICAgICAgICByZXRTdHJ1Y3QuaXNDb21wb3NpdGUgPSB0cnVlO1xuICAgICAgICAgICAgcmV0U3RydWN0Lm5hbWUgPSBuZXh0TmFtZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0U3RydWN0O1xufVxuIiwiLyohXG4gKiBCVE0gSmF2YVNjcmlwdCBMaWJyYXJ5IHZAVkVSU0lPTlxuICogaHR0cHM6Ly9naXRodWIuY29tL2RicmlhbndhbHRvbi9CVE1cbiAqXG4gKiBDb3B5cmlnaHQgRC4gQnJpYW4gV2FsdG9uXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUKVxuICpcbiAqIERhdGU6IEBEQVRFXG4gKi9cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIERlZmluZSB0aGUgQmluYXJ5IEV4cHJlc3Npb24gLS0gZGVmaW5lZCBieSBhbiBvcGVyYXRvciBhbmQgdHdvIGlucHV0cy5cbiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmltcG9ydCB7IEJUTSwgb3BQcmVjLCBleHByVHlwZSwgZXhwclZhbHVlIH0gZnJvbSBcIi4vQlRNX3Jvb3QuanNcIlxuaW1wb3J0IHsgZXhwcmVzc2lvbiB9IGZyb20gXCIuL2V4cHJlc3Npb24uanNcIlxuaW1wb3J0IHsgc2NhbGFyX2V4cHIgfSBmcm9tIFwiLi9zY2FsYXJfZXhwci5qc1wiXG5pbXBvcnQgeyB1bm9wX2V4cHIgfSBmcm9tIFwiLi91bm9wX2V4cHIuanNcIlxuXG5leHBvcnQgY2xhc3MgYmlub3BfZXhwciBleHRlbmRzIGV4cHJlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKGJ0bSwgb3AsIGlucHV0QSwgaW5wdXRCKSB7XG4gICAgICAgIHN1cGVyKGJ0bSk7XG4gICAgICAgIHRoaXMudHlwZSA9IGV4cHJUeXBlLmJpbm9wO1xuICAgICAgICB0aGlzLm9wID0gb3A7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXRBID09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgaW5wdXRBID0gbmV3IGV4cHJlc3Npb24odGhpcy5idG0pO1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0QiA9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIGlucHV0QiA9IG5ldyBleHByZXNzaW9uKHRoaXMuYnRtKTtcbiAgICAgICAgdGhpcy5pbnB1dHMgPSBbaW5wdXRBLCBpbnB1dEJdO1xuICAgICAgICAgICAgaW5wdXRBLnBhcmVudCA9IHRoaXM7XG4gICAgICAgICAgICBpbnB1dEIucGFyZW50ID0gdGhpcztcblxuICAgICAgICBzd2l0Y2ggKG9wKSB7XG4gICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5hZGRzdWI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgICAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5tdWx0ZGl2O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnXic6XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLnBvd2VyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnJic6XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLmNvbmo7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZVR5cGUgPSBleHByVmFsdWUuYm9vbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyQnOlxuICAgICAgICAgICAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5kaXNqO1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVUeXBlID0gZXhwclZhbHVlLmJvb2w7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICc9JzpcbiAgICAgICAgICAgICAgICB0aGlzLnByZWMgPSBvcFByZWMuZXF1YWw7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZVR5cGUgPSBleHByVmFsdWUuYm9vbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbmtub3duIGJpbmFyeSBvcGVyYXRvcjogJ1wiK29wK1wiJy5cIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgdmFyIHRoZVN0cjtcbiAgICAgICAgdmFyIG9wQVN0ciwgb3BCU3RyO1xuICAgICAgICB2YXIgaXNFcnJvciA9IGZhbHNlO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dHNbMF0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG9wQVN0ciA9ICc/JztcbiAgICAgICAgICAgIGlzRXJyb3IgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3BBU3RyID0gdGhpcy5pbnB1dHNbMF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmICgodGhpcy5pbnB1dHNbMF0udHlwZSA+PSBleHByVHlwZS51bm9wXG4gICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzWzBdLnByZWMgPCB0aGlzLnByZWMpXG4gICAgICAgICAgICAgICAgfHwgKHRoaXMuaW5wdXRzWzBdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICYmIG9wQVN0ci5pbmRleE9mKFwiL1wiKSA+PSAwXG4gICAgICAgICAgICAgICAgICAgICYmIG9wUHJlYy5tdWx0ZGl2IDw9IHRoaXMucHJlYylcbiAgICAgICAgICAgICAgICApIFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG9wQVN0ciA9ICcoJyArIG9wQVN0ciArICcpJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaW5wdXRzWzFdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBvcEJTdHIgPSAnPyc7XG4gICAgICAgICAgICBpc0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9wQlN0ciA9IHRoaXMuaW5wdXRzWzFdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBpZiAoKHRoaXMuaW5wdXRzWzFdLnR5cGUgPj0gZXhwclR5cGUudW5vcFxuICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1sxXS5wcmVjIDw9IHRoaXMucHJlYylcbiAgICAgICAgICAgICAgICB8fCAodGhpcy5pbnB1dHNbMV0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgJiYgb3BCU3RyLmluZGV4T2YoXCIvXCIpID49IDBcbiAgICAgICAgICAgICAgICAgICAgJiYgb3BQcmVjLm11bHRkaXYgPD0gdGhpcy5wcmVjKVxuICAgICAgICAgICAgICAgICkgXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgb3BCU3RyID0gJygnICsgb3BCU3RyICsgJyknO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRoZU9wID0gdGhpcy5vcDtcbiAgICAgICAgaWYgKHRoZU9wID09ICd8Jykge1xuICAgICAgICAgICAgdGhlT3AgPSAnICQgJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoZVN0ciA9IG9wQVN0ciArIHRoZU9wICsgb3BCU3RyO1xuICAgICAgICByZXR1cm4odGhlU3RyKTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgdGVzdGVkIGVxdWl2YWxlbnQgc3RyaW5ncy5cbiAgICBhbGxTdHJpbmdFcXVpdnMoKSB7XG4gICAgICAgIHZhciBhbGxJbnB1dHNBID0gdGhpcy5pbnB1dHNbMF0uYWxsU3RyaW5nRXF1aXZzKCksXG4gICAgICAgICAgICBhbGxJbnB1dHNCID0gdGhpcy5pbnB1dHNbMV0uYWxsU3RyaW5nRXF1aXZzKCk7XG5cbiAgICAgICAgdmFyIHJldFZhbHVlID0gW107XG5cbiAgICAgICAgdmFyIHRoZU9wID0gdGhpcy5vcDtcbiAgICAgICAgaWYgKHRoZU9wID09ICd8Jykge1xuICAgICAgICAgICAgdGhlT3AgPSAnICQgJztcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgaW4gYWxsSW5wdXRzQSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBhbGxJbnB1dHNCKSB7XG4gICAgICAgICAgICAgICAgb3BBU3RyID0gYWxsSW5wdXRzQVtpXTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbMF0udHlwZSA+PSBleHByVHlwZS51bm9wICYmIHRoaXMuaW5wdXRzWzBdLnByZWMgPCB0aGlzLnByZWMpIHtcbiAgICAgICAgICAgICAgICAgICAgb3BBU3RyID0gJygnICsgb3BBU3RyICsgJyknO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvcEJTdHIgPSBhbGxJbnB1dHNCW2pdO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1sxXS50eXBlID49IGV4cHJUeXBlLnVub3AgJiYgdGhpcy5pbnB1dHNbMV0ucHJlYyA8PSB0aGlzLnByZWMpIHtcbiAgICAgICAgICAgICAgICAgICAgb3BCU3RyID0gJygnICsgb3BCU3RyICsgJyknO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldFZhbHVlLnB1c2gob3BBU3RyICsgdGhlT3AgKyBvcEJTdHIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3AgPT0gJysnIHx8IHRoaXMub3AgPT0gJyonIHx8IHRoaXMub3AgPT0gJyYnIHx8IHRoaXMub3AgPT0gJyQnKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wQlN0ciA9IGFsbElucHV0c0Jbal07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1sxXS50eXBlID49IGV4cHJUeXBlLnVub3AgJiYgdGhpcy5pbnB1dHNbMV0ucHJlYyA8IHRoaXMucHJlYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BCU3RyID0gJygnICsgb3BCU3RyICsgJyknO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG9wQVN0ciA9IGFsbElucHV0c0FbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1swXS50eXBlID49IGV4cHJUeXBlLnVub3AgJiYgdGhpcy5pbnB1dHNbMF0ucHJlYyA8PSB0aGlzLnByZWMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wQVN0ciA9ICcoJyArIG9wQVN0ciArICcpJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXRWYWx1ZS5wdXNoKG9wQlN0ciArIHRoZU9wICsgb3BBU3RyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ocmV0VmFsdWUpO1xuICAgIH1cblxuICAgIHRvVGVYKHNob3dTZWxlY3QpIHtcbiAgICAgICAgdmFyIHRoZVN0cjtcbiAgICAgICAgdmFyIHRoZU9wO1xuICAgICAgICB2YXIgb3BBU3RyLCBvcEJTdHI7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBzaG93U2VsZWN0ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBzaG93U2VsZWN0ID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaW5wdXRzWzBdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBvcEFTdHIgPSAnPyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcEFTdHIgPSB0aGlzLmlucHV0c1swXS50b1RlWChzaG93U2VsZWN0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaW5wdXRzWzFdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBvcEJTdHIgPSAnPyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcEJTdHIgPSB0aGlzLmlucHV0c1sxXS50b1RlWChzaG93U2VsZWN0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGVPcCA9IHRoaXMub3A7XG4gICAgICAgIGlmIChzaG93U2VsZWN0ICYmIHRoaXMuc2VsZWN0KSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHRoZU9wKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgICAgIHRoZU9wID0gJ1xcXFxjZG90ICc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgICAgICAgICAgICB0aGVPcCA9ICdcXFxcZGl2ICc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgICAgICAgICAgICB0aGVPcCA9ICdcXFxcd2VkZ2UgJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnfCc6XG4gICAgICAgICAgICAgICAgICAgIHRoZU9wID0gJ1xcXFxoYm94eyBvciB9JztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnJCc6XG4gICAgICAgICAgICAgICAgICAgIHRoZU9wID0gJ1xcXFxoYm94eyBvciB9JztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnJic6XG4gICAgICAgICAgICAgICAgICAgIHRoZU9wID0gJ1xcXFxoYm94eyBhbmQgfSc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3dpdGNoICh0aGVPcCkge1xuICAgICAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbMV0gJiYgdGhpcy5pbnB1dHNbMV0udHlwZSA9PSBleHByVHlwZS5udW1iZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZU9wID0gJ1xcXFxjZG90ICc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pbnB1dHNbMV0gJiYgdGhpcy5pbnB1dHNbMV0udHlwZSA9PSBleHByVHlwZS5iaW5vcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1sxXS5vcD09J14nICYmIHRoaXMuaW5wdXRzWzFdLmlucHV0c1swXS50eXBlPT1leHByVHlwZS5udW1iZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZU9wID0gJ1xcXFxjZG90ICc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVPcCA9ICcgJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd8JzpcbiAgICAgICAgICAgICAgICAgICAgdGhlT3AgPSAnXFxcXGhib3h7IG9yIH0nO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICckJzpcbiAgICAgICAgICAgICAgICAgICAgdGhlT3AgPSAnXFxcXGhib3h7IG9yIH0nO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcmJzpcbiAgICAgICAgICAgICAgICAgICAgdGhlT3AgPSAnXFxcXGhib3h7IGFuZCB9JztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoZU9wID09ICcvJykge1xuICAgICAgICAgICAgdGhlU3RyID0gJ1xcXFxmcmFjeycgKyBvcEFTdHIgKyAnfXsnICsgb3BCU3RyICsgJ30nO1xuICAgICAgICB9IGVsc2UgaWYgKHRoZU9wID09ICdeJykge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzWzBdICYmIHRoaXMuaW5wdXRzWzBdLnR5cGUgPj0gZXhwclR5cGUuZmNuKSB7XG4gICAgICAgICAgICAgICAgdGhlU3RyID0gJ1xcXFxsZWZ0KCcgKyBvcEFTdHIgKyAnXFxcXHJpZ2h0KSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoZVN0ciA9IG9wQVN0cjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoZVN0ciArPSB0aGVPcCArICd7JyArIG9wQlN0ciArICd9JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBhcmdTdHJMPScnLCBhcmdTdHJSPScnLCBvcFN0ckw9JycsIG9wU3RyUj0nJztcblxuICAgICAgICAgICAgaWYgKHNob3dTZWxlY3QgJiYgdGhpcy5zZWxlY3QpIHtcbiAgICAgICAgICAgICAgICBhcmdTdHJMID0gJ3tcXFxcY29sb3J7Ymx1ZX0nO1xuICAgICAgICAgICAgICAgIGFyZ1N0clIgPSAnfSc7XG4gICAgICAgICAgICAgICAgb3BTdHJMID0gJ3tcXFxcY29sb3J7cmVkfSc7XG4gICAgICAgICAgICAgICAgb3BTdHJSID0gJ30nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzWzBdICYmIHRoaXMuaW5wdXRzWzBdLnR5cGUgPj0gZXhwclR5cGUudW5vcCAmJiB0aGlzLmlucHV0c1swXS5wcmVjIDwgdGhpcy5wcmVjKSB7XG4gICAgICAgICAgICAgICAgdGhlU3RyID0gJ1xcXFxsZWZ0KCcgKyBhcmdTdHJMICsgb3BBU3RyICsgYXJnU3RyUiArICdcXFxccmlnaHQpJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhlU3RyID0gYXJnU3RyTCArIG9wQVN0ciArIGFyZ1N0clI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGVTdHIgKz0gb3BTdHJMICsgdGhlT3AgKyBvcFN0clI7XG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbMV0gJiYgdGhpcy5pbnB1dHNbMV0udHlwZSA+PSBleHByVHlwZS51bm9wICYmIHRoaXMuaW5wdXRzWzFdLnByZWMgPD0gdGhpcy5wcmVjKSB7XG4gICAgICAgICAgICAgICAgdGhlU3RyICs9ICdcXFxcbGVmdCgnICsgYXJnU3RyTCArIG9wQlN0ciArIGFyZ1N0clIgKyAnXFxcXHJpZ2h0KSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoZVN0ciArPSBhcmdTdHJMICsgb3BCU3RyICsgYXJnU3RyUjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoc2hvd1NlbGVjdCAmJiB0aGlzLnNlbGVjdCkge1xuICAgICAgICAgIHRoZVN0ciA9IFwie1xcXFxjb2xvcntyZWR9XFxcXGJveGVke1wiICsgdGhlU3RyICsgXCJ9fVwiO1xuICAgICAgICB9XG4gICAgICAgIHRoZVN0ciA9IHRoZVN0ci5yZXBsYWNlKC9cXCstL2csICctJyk7XG4gICAgICAgIHJldHVybih0aGVTdHIpO1xuICAgIH1cblxuICAgIHRvTWF0aE1MKCkge1xuICAgICAgICB2YXIgdGhlU3RyO1xuICAgICAgICB2YXIgdGhlT3A7XG4gICAgICAgIHZhciBvcEFTdHIsIG9wQlN0cjtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaW5wdXRzWzBdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBvcEFTdHIgPSAnPyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcEFTdHIgPSB0aGlzLmlucHV0c1swXS50b01hdGhNTCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dHNbMV0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG9wQlN0ciA9ICc/JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9wQlN0ciA9IHRoaXMuaW5wdXRzWzFdLnRvTWF0aE1MKCk7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0aGlzLm9wKSB7XG4gICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICB0aGVPcCA9IFwiPHBsdXMvPlwiXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICB0aGVPcCA9IFwiPG1pbnVzLz5cIlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgdGhlT3AgPSBcIjx0aW1lcy8+XCJcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgICAgICAgIHRoZU9wID0gXCI8ZGl2aWRlLz5cIlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnXic6XG4gICAgICAgICAgICAgICAgdGhlT3AgPSBcIjxwb3dlci8+XCJcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB0aGVTdHIgPSBcIjxhcHBseT5cIiArIHRoZU9wICsgb3BBU3RyICsgb3BCU3RyICsgXCI8L2FwcGx5PlwiO1xuXG4gICAgICAgIHJldHVybih0aGVTdHIpO1xuICAgIH1cblxuICAgIG9wZXJhdGVUb1RlWCgpIHtcbiAgICAgICAgdmFyIG9wU3RyaW5nID0gdGhpcy5vcDtcblxuICAgICAgICBzd2l0Y2ggKG9wU3RyaW5nKSB7XG4gICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICBvcFN0cmluZyA9ICdcXFxcdGltZXMgJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgICAgICAgIG9wU3RyaW5nID0gJ1xcXFxkaXYgJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgICAgICAgIG9wU3RyaW5nID0gJ1xcXFx3ZWRnZSAnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnfCc6XG4gICAgICAgICAgICAgICAgb3BTdHJpbmcgPSAnXFxcXGhib3h7IG9yIH0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnJCc6XG4gICAgICAgICAgICAgICAgb3BTdHJpbmcgPSAnXFxcXGhib3h7IG9yIH0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnJic6XG4gICAgICAgICAgICAgICAgb3BTdHJpbmcgPSAnXFxcXGhib3h7IGFuZCB9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihvcFN0cmluZyk7XG4gICAgfVxuXG4gICAgaXNDb21tdXRhdGl2ZSgpIHtcbiAgICAgICAgdmFyIGNvbW11dGVzID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLm9wID09PSAnKycgfHwgdGhpcy5vcCA9PT0gJyonKSB7XG4gICAgICAgICAgICBjb21tdXRlcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKGNvbW11dGVzKTtcbiAgICB9XG5cbiAgICBldmFsdWF0ZShiaW5kaW5ncykge1xuICAgICAgICB2YXIgaW5wdXRBVmFsID0gdGhpcy5pbnB1dHNbMF0uZXZhbHVhdGUoYmluZGluZ3MpO1xuICAgICAgICB2YXIgaW5wdXRCVmFsID0gdGhpcy5pbnB1dHNbMV0uZXZhbHVhdGUoYmluZGluZ3MpO1xuXG4gICAgICAgIGlmIChpbnB1dEFWYWwgPT0gdW5kZWZpbmVkIHx8IGlucHV0QlZhbCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybih1bmRlZmluZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJldFZhbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgc3dpdGNoICh0aGlzLm9wKSB7XG4gICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICByZXRWYWwgPSBpbnB1dEFWYWwgKyBpbnB1dEJWYWw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICByZXRWYWwgPSBpbnB1dEFWYWwgLSBpbnB1dEJWYWw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICByZXRWYWwgPSBpbnB1dEFWYWwgKiBpbnB1dEJWYWw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICByZXRWYWwgPSBpbnB1dEFWYWwgLyBpbnB1dEJWYWw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaW5wdXRzWzFdLmlzQ29uc3RhbnQoKSkge1xuICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLmV4cChpbnB1dEJWYWwgKiBNYXRoLmxvZyhpbnB1dEFWYWwpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXRBVmFsID49IDAgfHwgKGlucHV0QlZhbCAlIDEgPT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGgucG93KGlucHV0QVZhbCxpbnB1dEJWYWwpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5leHAoaW5wdXRCVmFsICogTWF0aC5sb2coaW5wdXRBVmFsKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICc9JzpcbiAgICAgICAgICAgICAgICByZXRWYWwgPSAoTWF0aC5hYnMoaW5wdXRBVmFsIC0gaW5wdXRCVmFsKSA8IHRoaXMuYnRtLm9wdGlvbnMuYWJzVG9sKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyYnOlxuICAgICAgICAgICAgICAgIHJldFZhbCA9IGlucHV0QVZhbCAmJiBpbnB1dEJWYWw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd8JzpcbiAgICAgICAgICAgIGNhc2UgJyQnOlxuICAgICAgICAgICAgICAgIHJldFZhbCA9IGlucHV0QVZhbCB8fCBpbnB1dEJWYWw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIGJpbmFyeSBvcGVyYXRvciAnXCIgKyB0aGlzLm9wICsgXCInIGlzIG5vdCBkZWZpbmVkLlwiKTtcbiAgICAgICAgICAgICAgICByZXRWYWwgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHJldFZhbCk7XG4gICAgfVxuXG4gICAgLy8gU2VlIGlmIHRoaXMgb3BlcmF0b3IgaXMgbm93IHJlZHVuZGFudC5cbiAgICAvLyBSZXR1cm4gdGhlIHJlc3VsdGluZyBleHByZXNzaW9uLlxuICAgIHJlZHVjZSgpIHtcbiAgICAgICAgdmFyIG5ld0V4cHIgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy5pbnB1dHMubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlucHV0cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIFN1bSB3aXRoIG5vIGVsZW1lbnRzID0gMFxuICAgICAgICAgICAgICAgIC8vIFByb2R1Y3Qgd2l0aCBubyBlbGVtZW50cyA9IDFcbiAgICAgICAgICAgICAgICBuZXdFeHByID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCB0aGlzLm9wID09ICcrJyA/IDAgOiAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gU3VtIG9yIHByb2R1Y3Qgd2l0aCBvbmUgZWxlbWVudCAqaXMqIHRoYXQgZWxlbWVudC5cbiAgICAgICAgICAgICAgICBuZXdFeHByID0gdGhpcy5pbnB1dHNbMF0ucmVkdWNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdFeHByLnBhcmVudCA9IHRoaXMucGFyZW50O1xuICAgICAgICAgICAgaWYgKHRoaXMucGFyZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuaW5wdXRTdWJzdCh0aGlzLCBuZXdFeHByKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4obmV3RXhwcik7XG4gICAgfVxuXG4gICAgc2ltcGxpZnlDb25zdGFudHMoKSB7XG4gICAgICAgIHZhciByZXRWYWwgPSB0aGlzO1xuICAgICAgICB0aGlzLmlucHV0c1swXSA9IHRoaXMuaW5wdXRzWzBdLnNpbXBsaWZ5Q29uc3RhbnRzKCk7XG4gICAgICAgIHRoaXMuaW5wdXRzWzBdLnBhcmVudCA9IHRoaXM7XG4gICAgICAgIHRoaXMuaW5wdXRzWzFdID0gdGhpcy5pbnB1dHNbMV0uc2ltcGxpZnlDb25zdGFudHMoKTtcbiAgICAgICAgdGhpcy5pbnB1dHNbMV0ucGFyZW50ID0gdGhpcztcbiAgICAgICAgaWYgKCh0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgIHx8ICh0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLnVub3AgJiYgdGhpcy5pbnB1dHNbMF0uaW5wdXRzWzBdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyKVxuICAgICAgICAgICAgKSAmJlxuICAgICAgICAgICAgKHRoaXMuaW5wdXRzWzFdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgfHwgKHRoaXMuaW5wdXRzWzFdLnR5cGUgPT0gZXhwclR5cGUudW5vcCAmJiB0aGlzLmlucHV0c1sxXS5pbnB1dHNbMF0udHlwZSA9PSBleHByVHlwZS5udW1iZXIpXG4gICAgICAgICAgICApKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgbnVtQSwgbnVtQiwgdGhlTnVtYmVyO1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzWzBdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgbnVtQSA9IHRoaXMuaW5wdXRzWzBdLm51bWJlcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmlucHV0c1swXS5vcCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bUEgPSB0aGlzLmlucHV0c1swXS5pbnB1dHNbMF0ubnVtYmVyLmFkZEludmVyc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bUEgPSB0aGlzLmlucHV0c1swXS5pbnB1dHNbMF0ubnVtYmVyLm11bHRJbnZlcnNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbMV0udHlwZSA9PSBleHByVHlwZS5udW1iZXIpIHtcbiAgICAgICAgICAgICAgICBudW1CID0gdGhpcy5pbnB1dHNbMV0ubnVtYmVyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMuaW5wdXRzWzFdLm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgICAgICAgICAgbnVtQiA9IHRoaXMuaW5wdXRzWzFdLmlucHV0c1swXS5udW1iZXIuYWRkSW52ZXJzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgbnVtQiA9IHRoaXMuaW5wdXRzWzFdLmlucHV0c1swXS5udW1iZXIubXVsdEludmVyc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5vcCkge1xuICAgICAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgICAgICB0aGVOdW1iZXIgPSBudW1BLmFkZChudW1CKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgICAgIHRoZU51bWJlciA9IG51bUEuc3VidHJhY3QobnVtQik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgICAgICB0aGVOdW1iZXIgPSBudW1BLm11bHRpcGx5KG51bUIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICAgICAgdGhlTnVtYmVyID0gbnVtQS5kaXZpZGUobnVtQik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgICAgICAgICAgICAvLyBJbnRlZ2VyIHBvd2VycyBvZiBhIHJhdGlvbmFsIG51bWJlciBjYW4gYmUgcmVwcmVzZW50ZWQgZXhhY3RseS5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG51bUEgaW5zdGFuY2VvZiByYXRpb25hbF9udW1iZXIgJiYgbnVtQiBpbnN0YW5jZW9mIHJhdGlvbmFsX251bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIG51bUIucSA9PSAxICYmIG51bUIucCAlIDEgPT0gMCAmJiBudW1CLnAgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVOdW1iZXIgPSBuZXcgcmF0aW9uYWxfbnVtYmVyKE1hdGgucG93KG51bUEucCwgbnVtQi5wKSwgTWF0aC5wb3cobnVtQS5xLCBudW1CLnApKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGVOdW1iZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5idG0ub3B0aW9ucy5uZWdhdGl2ZU51bWJlcnMgJiYgdGhlTnVtYmVyLnAgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IG5ldyB1bm9wX2V4cHIodGhpcy5idG0sICctJywgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCB0aGVOdW1iZXIubXVsdGlwbHkoLTEpKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCB0aGVOdW1iZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5vcCkge1xuICAgICAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgICAgICAvLyBTaW1wbGlmeSAwK2FcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzWzBdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbMF0ubnVtYmVyLnZhbHVlKCk9PTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IHRoaXMuaW5wdXRzWzFdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbXBsaWZ5IGErMFxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLmlucHV0c1sxXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzWzFdLm51bWJlci52YWx1ZSgpID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IHRoaXMuaW5wdXRzWzBdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgICAgICAvLyBTaW1wbGlmeSAwLWFcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzWzBdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbMF0ubnVtYmVyLnZhbHVlKCk9PTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IG5ldyB1bm9wX2V4cHIodGhpcy5idG0sIFwiLVwiLCB0aGlzLmlucHV0c1sxXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gU2ltcGxpZnkgYS0wXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuaW5wdXRzWzFdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbMV0ubnVtYmVyLnZhbHVlKCkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gdGhpcy5pbnB1dHNbMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbXBsaWZ5IDEqYVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbMF0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1swXS5udW1iZXIudmFsdWUoKT09MSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gdGhpcy5pbnB1dHNbMV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gU2ltcGxpZnkgYSoxXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuaW5wdXRzWzFdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbMV0ubnVtYmVyLnZhbHVlKCkgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gdGhpcy5pbnB1dHNbMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbXBsaWZ5IDEvYSB0byB1bmFyeSBvcGVyYXRvciBvZiBtdWx0aXBsaWNhdGl2ZSBpbnZlcnNlLlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbMF0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1swXS5udW1iZXIudmFsdWUoKT09MSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gbmV3IHVub3BfZXhwcih0aGlzLmJ0bSwgXCIvXCIsIHRoaXMuaW5wdXRzWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBTaW1wbGlmeSBhLzFcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5pbnB1dHNbMV0udHlwZSA9PSBleHByVHlwZS5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1sxXS5udW1iZXIudmFsdWUoKSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSB0aGlzLmlucHV0c1swXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICAgICAgICAgICAgLy8gU2ltcGxpZnkgMF5wXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzWzBdLm51bWJlci52YWx1ZSgpPT0wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbXBsaWZ5IDFecFxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzWzBdLm51bWJlci52YWx1ZSgpID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gU2ltcGxpZnkgcF4xXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuaW5wdXRzWzFdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbMV0ubnVtYmVyLnZhbHVlKCkgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gdGhpcy5pbnB1dHNbMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHJldFZhbCk7XG4gICAgfVxuXG4gICAgZmxhdHRlbigpIHtcbiAgICAgICAgdmFyIGluQSA9IHRoaXMuaW5wdXRzWzBdLmZsYXR0ZW4oKTtcbiAgICAgICAgdmFyIGluQiA9IHRoaXMuaW5wdXRzWzFdLmZsYXR0ZW4oKTtcblxuICAgICAgICB2YXIgcmV0VmFsO1xuICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0cyA9IFtdO1xuICAgICAgICAgICAgICAgIGlmICgoaW5BLnR5cGUgPT0gZXhwclR5cGUubXVsdGlvcCB8fCBpbkEudHlwZSA9PSBleHByVHlwZS5iaW5vcClcbiAgICAgICAgICAgICAgICAgICAgJiYgKGluQS5vcCA9PSAnKycgfHwgaW5BLm9wID09ICctJykpIFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0lucHV0ID0gaW5BLmZsYXR0ZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBuZXdJbnB1dC5pbnB1dHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKG5ld0lucHV0LmlucHV0c1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dHMucHVzaChpbkEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoKGluQi50eXBlID09IGV4cHJUeXBlLm11bHRpb3AgfHwgaW5CLnR5cGUgPT0gZXhwclR5cGUuYmlub3ApXG4gICAgICAgICAgICAgICAgICAgICYmIChpbkIub3AgPT0gJysnIHx8IGluQi5vcCA9PSAnLScpKSBcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdJbnB1dCA9IGluQi5mbGF0dGVuKCk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gbmV3SW5wdXQuaW5wdXRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dHMucHVzaChuZXdJbnB1dC5pbnB1dHNbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3AgPT0gJy0nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGluQi50eXBlID09IGV4cHJUeXBlLm11bHRpb3AgfHwgaW5CLnR5cGUgPT0gZXhwclR5cGUuYmlub3ApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgKGluQi5vcCA9PSAnKycgfHwgaW5CLm9wID09ICctJykpIFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdJbnB1dCA9IGluQi5mbGF0dGVuKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBuZXdJbnB1dC5pbnB1dHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzLnB1c2gobmV3IHVub3BfZXhwcih0aGlzLmJ0bSwgJy0nLG5ld0lucHV0LmlucHV0c1tpXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzLnB1c2gobmV3IHVub3BfZXhwcih0aGlzLmJ0bSwgJy0nLGluQikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzLnB1c2goaW5CKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXRWYWwgPSBuZXcgbXVsdGlvcF9leHByKHRoaXMuYnRtLCAnKycsIGlucHV0cyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgICAgICAgIHZhciBpbnB1dHMgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAoKGluQS50eXBlID09IGV4cHJUeXBlLm11bHRpb3AgfHwgaW5BLnR5cGUgPT0gZXhwclR5cGUuYmlub3ApXG4gICAgICAgICAgICAgICAgICAgICYmIChpbkEub3AgPT0gJyonIHx8IGluQS5vcCA9PSAnLycpKSBcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdJbnB1dCA9IGluQS5mbGF0dGVuKCk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gbmV3SW5wdXQuaW5wdXRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dHMucHVzaChuZXdJbnB1dC5pbnB1dHNbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzLnB1c2goaW5BKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKChpbkIudHlwZSA9PSBleHByVHlwZS5tdWx0aW9wIHx8IGluQi50eXBlID09IGV4cHJUeXBlLmJpbm9wKVxuICAgICAgICAgICAgICAgICAgICAmJiAoaW5CLm9wID09ICcqJyB8fCBpbkIub3AgPT0gJy8nKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdJbnB1dCA9IGluQi5mbGF0dGVuKCk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gbmV3SW5wdXQuaW5wdXRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dHMucHVzaChuZXdJbnB1dC5pbnB1dHNbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3AgPT0gJy8nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGluQi50eXBlID09IGV4cHJUeXBlLm11bHRpb3AgfHwgaW5CLnR5cGUgPT0gZXhwclR5cGUuYmlub3ApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgKGluQi5vcCA9PSAnKicgfHwgaW5CLm9wID09ICcvJykpIFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdJbnB1dCA9IGluQi5mbGF0dGVuKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBuZXdJbnB1dC5pbnB1dHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzLnB1c2gobmV3IHVub3BfZXhwcih0aGlzLmJ0bSwgJy8nLG5ld0lucHV0LmlucHV0c1tpXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzLnB1c2gobmV3IHVub3BfZXhwcih0aGlzLmJ0bSwgJy8nLGluQikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzLnB1c2goaW5CKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXRWYWwgPSBuZXcgbXVsdGlvcF9leHByKHRoaXMuYnRtLCAnKicsIGlucHV0cyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldFZhbCA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCB0aGlzLm9wLCBpbkEsIGluQik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHJldFZhbCk7XG4gICAgfVxuXG4gICAgY29weSgpIHtcbiAgICAgIHZhciBpbkEgPSB0aGlzLmlucHV0c1swXS5jb3B5KCk7XG4gICAgICB2YXIgaW5CID0gdGhpcy5pbnB1dHNbMV0uY29weSgpO1xuICAgICAgcmV0dXJuIChuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgdGhpcy5vcCwgaW5BLCBpbkIpKTtcbiAgICB9XG5cbiAgICBjb21wb3NlKGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciBpbkEgPSB0aGlzLmlucHV0c1swXS5jb21wb3NlKGJpbmRpbmdzKTtcbiAgICAgICAgdmFyIGluQiA9IHRoaXMuaW5wdXRzWzFdLmNvbXBvc2UoYmluZGluZ3MpO1xuXG4gICAgICAgIHZhciByZXRWYWw7XG4gICAgICAgIHJldFZhbCA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCB0aGlzLm9wLCBpbkEsIGluQik7XG4gICAgICAgIGlmIChpbkEudHlwZSA9PSBleHByVHlwZS5udW1iZXIgJiYgaW5CLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCBpbkEubnVtYmVyLmFkZChpbkIubnVtYmVyKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIGluQS5udW1iZXIuc3VidHJhY3QoaW5CLm51bWJlcikpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCBpbkEubnVtYmVyLm11bHRpcGx5KGluQi5udW1iZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgaW5BLm51bWJlci5kaXZpZGUoaW5CLm51bWJlcikpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ocmV0VmFsKTtcbiAgICB9XG5cbiAgICBkZXJpdmF0aXZlKGl2YXIsIHZhckxpc3QpIHtcbiAgICAgICAgdmFyIHVDb25zdCA9IHRoaXMuaW5wdXRzWzBdLmlzQ29uc3RhbnQoKTtcbiAgICAgICAgdmFyIHZDb25zdCA9IHRoaXMuaW5wdXRzWzFdLmlzQ29uc3RhbnQoKTtcblxuICAgICAgICB2YXIgdGhlRGVyaXY7XG4gICAgICAgIGlmICh1Q29uc3QgJiYgdkNvbnN0KSB7XG4gICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgZHVkeCwgZHZkeDtcblxuICAgICAgICAgICAgaWYgKHVDb25zdCkge1xuICAgICAgICAgICAgICAgIGR1ZHggPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkdWR4ID0gdGhpcy5pbnB1dHNbMF0uZGVyaXZhdGl2ZShpdmFyLCB2YXJMaXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh2Q29uc3QpIHtcbiAgICAgICAgICAgICAgICBkdmR4ID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHZkeCA9IHRoaXMuaW5wdXRzWzFdLmRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJysnLCBkdWR4LCBkdmR4KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgICAgIHRoZURlcml2ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICctJywgZHVkeCwgZHZkeCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgICAgICB2YXIgdWR2ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcqJywgdGhpcy5pbnB1dHNbMF0sIGR2ZHgpXG4gICAgICAgICAgICAgICAgICAgIHZhciB2ZHUgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJyonLCBkdWR4LCB0aGlzLmlucHV0c1sxXSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVDb25zdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSB1ZHY7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodkNvbnN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IHZkdTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZURlcml2ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcrJywgdmR1LCB1ZHYpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgICAgICAgICAgICBpZiAodkNvbnN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnLycsIGR1ZHgsIHRoaXMuaW5wdXRzWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh1Q29uc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBudW1lciA9IG5ldyB1bm9wX2V4cHIodGhpcy5idG0sICctJywgbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcqJywgdGhpcy5pbnB1dHNbMF0sIGR2ZHgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZW5vbSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnXicsIHRoaXMuaW5wdXRzWzFdLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZURlcml2ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcvJywgbnVtZXIsIGRlbm9tKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1ZHYgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJyonLCB0aGlzLmlucHV0c1swXSwgZHZkeClcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ZHUgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJyonLCBkdWR4LCB0aGlzLmlucHV0c1sxXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBudW1lciA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnLScsIHZkdSwgdWR2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZW5vbSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnXicsIHRoaXMuaW5wdXRzWzFdLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZURlcml2ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcvJywgbnVtZXIsIGRlbm9tKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvd0RlcCA9IHRoaXMuaW5wdXRzWzFdLmRlcGVuZGVuY2llcygpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXZhck5hbWUgPSAodHlwZW9mIGl2YXIgPT0gJ3N0cmluZycpID8gaXZhciA6IGl2YXIubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2VlIGlmIHRoZSBwb3dlciBkZXBlbmRzIG9uIHRoZSB2YXJpYWJsZVxuICAgICAgICAgICAgICAgICAgICBpZiAocG93RGVwLmxlbmd0aCA+IDAgJiYgcG93RGVwLmluZGV4T2YoaXZhck5hbWUpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGVBcmcgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJyonLCB0aGlzLmlucHV0c1sxXSwgbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5idG0sICdsb2cnLCB0aGlzLmlucHV0c1swXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZUZjbiA9IG5ldyBmdW5jdGlvbl9leHByKHRoaXMuYnRtLCAnZXhwJywgdGhlQXJnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZURlcml2ID0gdGhlRmNuLmRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSB0aGlzIGlzIGEgc2ltcGxlIGFwcGxpY2F0aW9uIG9mIHRoZSBwb3dlciBydWxlXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXVDb25zdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1BvdyA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnLScsIHRoaXMuaW5wdXRzWzFdLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkeWR1ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcqJywgdGhpcy5pbnB1dHNbMV0sIG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnXicsIHRoaXMuaW5wdXRzWzBdLCBuZXdQb3cpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLnZhcmlhYmxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzWzBdLm5hbWUgPT0gaXZhck5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IGR5ZHU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkdWR4ID0gdGhpcy5pbnB1dHNbMF0uZGVyaXZhdGl2ZShpdmFyLCB2YXJMaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnKicsIGR5ZHUsIGR1ZHgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIGJpbmFyeSBvcGVyYXRvciAnXCIgKyB0aGlzLm9wICsgXCInIGlzIG5vdCBkZWZpbmVkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybih0aGVEZXJpdik7XG4gICAgfVxufVxuIiwiLyohXG4gKiBCVE0gSmF2YVNjcmlwdCBMaWJyYXJ5IHZAVkVSU0lPTlxuICogaHR0cHM6Ly9naXRodWIuY29tL2RicmlhbndhbHRvbi9CVE1cbiAqXG4gKiBDb3B5cmlnaHQgRC4gQnJpYW4gV2FsdG9uXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUKVxuICpcbiAqIERhdGU6IEBEQVRFXG4gKi9cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIERlZmluZSB0aGUgRGVyaXZhdGl2ZSBvZiBhbiBFeHByZXNzaW9uXG4qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5pbXBvcnQgeyBleHByZXNzaW9uIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi5qc1wiXG5pbXBvcnQgeyB2YXJpYWJsZV9leHByIH0gZnJvbSBcIi4vdmFyaWFibGVfZXhwci5qc1wiXG5pbXBvcnQgeyBleHByVHlwZSB9IGZyb20gXCIuL0JUTV9yb290LmpzXCJcblxuZXhwb3J0IGNsYXNzIGRlcml2X2V4cHIgZXh0ZW5kcyBleHByZXNzaW9uIHtcbiAgICBjb25zdHJ1Y3RvcihidG0sIGZvcm11bGEsIHZhcmlhYmxlLCBhdFZhbHVlKSB7XG4gICAgICAgIHN1cGVyKGJ0bSk7XG4gICAgICAgIHRoaXMudHlwZSA9IGV4cHJUeXBlLm9wZXJhdG9yO1xuICAgICAgICB0aGlzLm9wID0gXCJEXCI7XG4gICAgICAgIGlmICh0eXBlb2YgZm9ybXVsYSA9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIGZvcm11bGEgPSBuZXcgZXhwcmVzc2lvbih0aGlzLmJ0bSk7XG4gICAgICAgIGlmICh0eXBlb2YgdmFyaWFibGUgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHZhcmlhYmxlID0gbmV3IHZhcmlhYmxlX2V4cHIodGhpcy5idG0sICd4Jyk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhcmlhYmxlID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YXJpYWJsZSA9IG5ldyB2YXJpYWJsZV9leHByKHRoaXMuYnRtLCB2YXJpYWJsZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pdmFyID0gdmFyaWFibGU7XG4gICAgICAgIHRoaXMuaXZhclZhbHVlID0gYXRWYWx1ZTtcbiAgICAgICAgdGhpcy5pbnB1dHMgPSBbZm9ybXVsYV07XG4gICAgICAgIHRoaXMuaXNSYXRlID0gZmFsc2U7XG4gICAgICAgIGZvcm11bGEucGFyZW50ID0gdGhpcztcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgdmFyIHRoZVN0cjtcbiAgICAgICAgdmFyIGV4cHJTdHIsIHZhclN0ciwgdmFsU3RyO1xuXG4gICAgICAgIHZhclN0ciA9IHRoaXMuaXZhci50b1N0cmluZygpO1xuICAgICAgICBleHByU3RyID0gdGhpcy5pbnB1dHNbMF0udG9TdHJpbmcoKTtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLml2YXJWYWx1ZSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdmFsU3RyID0gdGhpcy5pdmFyVmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIHRoZVN0ciA9IFwiRChcIitleHByU3RyK1wiLFwiK3ZhclN0citcIixcIit2YWxTdHIrXCIpXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGVTdHIgPSBcIkQoXCIrZXhwclN0citcIixcIit2YXJTdHIrXCIpXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHRoZVN0cik7XG4gICAgfVxuXG4gICAgdG9UZVgoc2hvd1NlbGVjdCkge1xuICAgICAgICB2YXIgdGhlU3RyO1xuICAgICAgICB2YXIgb3BTdHIsIHZhclN0ciwgZXhwclN0ciwgdmFsU3RyO1xuXG4gICAgICAgIHZhclN0ciA9IHRoaXMuaXZhci50b1RlWCgpO1xuICAgICAgICBleHByU3RyID0gdGhpcy5pbnB1dHNbMF0udG9UZVgoKTtcbiAgICAgICAgaWYgKHRoaXMuaXNSYXRlICYmIHRoaXMuaW5wdXRzWzBdLnR5cGUgPT0gZXhwclR5cGUudmFyaWFibGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5pdmFyVmFsdWUgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICB2YWxTdHIgPSB0aGlzLml2YXJWYWx1ZS50b1RlWCgpO1xuICAgICAgICAgICAgICAgIHRoZVN0ciA9IFwiXFxcXGxlZnQuIFxcXFxmcmFje2RcIiArIGV4cHJTdHIgKyBcIn17ZFwiK3ZhclN0citcIn0gXFxcXHJpZ2h0fF97XCJcbiAgICAgICAgICAgICAgICAgICAgKyB2YXJTdHIgKyBcIj1cIiArIHZhbFN0ciArIFwifVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGVTdHIgPSBcIlxcXFxmcmFje2RcIiArIGV4cHJTdHIgK1wifXtkXCIrdmFyU3RyK1wifVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLml2YXJWYWx1ZSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHZhbFN0ciA9IHRoaXMuaXZhclZhbHVlLnRvVGVYKCk7XG4gICAgICAgICAgICAgICAgb3BTdHIgPSBcIlxcXFxsZWZ0LiBcXFxcZnJhY3tkfXtkXCIrdmFyU3RyK1wifSBcXFxccmlnaHR8X3tcIlxuICAgICAgICAgICAgICAgICAgICArIHZhclN0ciArIFwiPVwiICsgdmFsU3RyICsgXCJ9XCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9wU3RyID0gXCJcXFxcZnJhY3tkfXtkXCIrdmFyU3RyK1wifVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhlU3RyID0gb3BTdHIgKyBcIlxcXFxCaWdbXCIgKyBleHByU3RyICsgXCJcXFxcQmlnXVwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybih0aGVTdHIpO1xuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBhcnJheSBjb250YWluaW5nIGFsbCB0ZXN0ZWQgZXF1aXZhbGVudCBzdHJpbmdzLlxuICAgIGFsbFN0cmluZ0VxdWl2cygpIHtcbiAgICAgICAgdmFyIGFsbElucHV0cyA9IHRoaXMuaW5wdXRzWzBdLmFsbFN0cmluZ0VxdWl2cygpO1xuICAgICAgICB2YXIgdmFyU3RyLCB2YWxTdHI7XG4gICAgICAgIHZhciByZXRWYWx1ZSA9IFtdO1xuXG4gICAgICAgIHZhclN0ciA9IHRoaXMuaXZhci50b1N0cmluZygpO1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaXZhclZhbHVlICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB2YWxTdHIgPSB0aGlzLml2YXJWYWx1ZS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgaW4gYWxsSW5wdXRzKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuaXZhclZhbHVlICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmV0VmFsdWVbaV0gPSBcIkQoXCIrYWxsSW5wdXRzW2ldK1wiLFwiK3ZhclN0citcIixcIit2YWxTdHIrXCIpXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldFZhbHVlW2ldID0gXCJEKFwiK2FsbElucHV0c1tpXStcIixcIit2YXJTdHIrXCIpXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4oYWxsSW5wdXRzKTtcbiAgICB9XG5cbiAgICB0b01hdGhNTCgpIHtcbiAgICAgICAgdmFyIHRoZVN0cjtcbiAgICAgICAgdmFyIGV4cHJTdHI7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0c1swXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZXhwclN0ciA9ICc/JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV4cHJTdHIgPSB0aGlzLmlucHV0c1swXS50b01hdGhNTCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoZVN0ciA9IFwiPGFwcGx5PjxkZXJpdmF0aXZlLz5cIiArIGV4cHJTdHIgKyBcIjwvYXBwbHk+XCI7XG5cbiAgICAgICAgcmV0dXJuKHRoZVN0cik7XG4gICAgfVxuXG4gICAgZXZhbHVhdGUoYmluZGluZ3MpIHtcbiAgICAgICAgdmFyIHJldFZhbDtcbiAgICAgICAgdmFyIGRlcml2RXhwcjtcbiAgICAgICAgdmFyIGRiaW5kID0ge307XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLml2YXJWYWx1ZSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZGJpbmRbdGhpcy5pdmFyLm5hbWVdID0gdGhpcy5pdmFyVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ29tcHV0ZSB0aGUgZGVyaXZhdGl2ZSBvZiB0aGUgZXhwcmVzc2lvbiwgdGhlbiBldmFsdWF0ZSBhdCBiaW5kaW5nXG4gICAgICAgIGRlcml2RXhwciA9IHRoaXMuaW5wdXRzWzBdLmRlcml2YXRpdmUodGhpcy5pdmFyLCBiaW5kaW5ncyk7XG4gICAgICAgIGRlcml2RXhwciA9IGRlcml2RXhwci5jb21wb3NlKGRiaW5kKTtcbiAgICAgICAgcmV0VmFsID0gZGVyaXZFeHByLmV2YWx1YXRlKGJpbmRpbmdzKTtcbiAgICAgICAgcmV0dXJuKHJldFZhbCk7XG4gICAgfVxuXG4gICAgc2ltcGxpZnlDb25zdGFudHMoKSB7XG4gICAgICAgIHJldHVybih0aGlzKTtcbiAgICB9XG5cbiAgICBmbGF0dGVuKCkge1xuICAgICAgcmV0dXJuIChuZXcgZGVyaXZfZXhwcih0aGlzLmJ0bSwgdGhpcy5pbnB1dHNbMF0uZmxhdHRlbigpLCB0aGlzLml2YXIsIHRoaXMuaXZhclZhbHVlKSk7XG4gICAgfVxuXG4gICAgY29weSgpIHtcbiAgICAgIHJldHVybiAobmV3IGRlcml2X2V4cHIodGhpcy5idG0sIHRoaXMuaW5wdXRzWzBdLmNvcHkoKSwgdGhpcy5pdmFyLCB0aGlzLml2YXJWYWx1ZSkpO1xuICAgIH1cblxuXG4gICAgY29tcG9zZShiaW5kaW5ncykge1xuICAgIH1cblxuICAgIGRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCkge1xuICAgICAgICB2YXIgZGJpbmQgPSB7fTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaXZhclZhbHVlICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBkYmluZFt0aGlzLml2YXJdID0gdGhpcy5pdmFyVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRXZhbHVhdGUgdGhlIG1haW4gZXhwcmVzc2lvbiB1c2luZyBvcmlnaW5hbCBiaW5kaW5nXG4gICAgICAgIHZhciBmaXJzdERlcml2ID0gdGhpcy5pbnB1dHNbMF0uZGVyaXZhdGl2ZSh0aGlzLml2YXIsIHZhckxpc3QpO1xuICAgICAgICBmaXJzdERlcml2LmNvbXBvc2UoZGJpbmQpO1xuXG4gICAgICAgIC8vIE5vdyBkaWZmZXJlbnRpYXRlIHRoYXQgZXhwcmVzc2lvbiB1c2luZyBuZXcgYmluZGluZy5cbiAgICAgICAgcmV0dXJuIGZpcnN0RGVyaXYuZGVyaXZhdGl2ZShpdmFyLCB2YXJMaXN0KTtcbiAgICB9XG59XG4iLCIvKiFcbiAqIEJUTSBKYXZhU2NyaXB0IExpYnJhcnkgdkBWRVJTSU9OXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGJyaWFud2FsdG9uL0JUTVxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG5pbXBvcnQgeyBCVE0sIGV4cHJWYWx1ZSB9IGZyb20gXCIuL0JUTV9yb290LmpzXCJcbmltcG9ydCB7IGZpbmRNYXRjaFJ1bGVzIH0gZnJvbSBcIi4vcmVkdWN0aW9ucy5qc1wiXG5cbmV4cG9ydCBjbGFzcyBNYXRoT2JqZWN0IHtcbiAgICBjb25zdHJ1Y3RvcihidG0pIHtcbiAgICAgICAgdGhpcy5idG0gPSBidG07XG4gICAgICAgIGlmICghKGJ0bSBpbnN0YW5jZW9mIEJUTSkpIHtcbiAgICAgICAgICAgIHRocm93IFwiTWF0aE9iamVjdCBjb25zdHJ1Y3RlZCB3aXRoIGludmFsaWQgZW52aXJvbm1lbnRcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlbGVjdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuaW5wdXRzID0gW107XG4gICAgICAgIHRoaXMudmFsdWVUeXBlID0gZXhwclZhbHVlLnVuZGVmO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIFxuICAgIC8vIE1ldGhvZCB0byAqZXZhbHVhdGUqIHRoZSBvYmplY3QuXG4gICAgLy8gLSBSZXR1cm4gdW5kZWZpbmVkXG4gICAgdmFsdWUoYmluZGluZ3MpIHtcbiAgICB9XG4gICAgXG4gICAgLy8gVXBkYXRlIGNvbnRleHQgc2V0dGluZ1xuICAgIHNldENvbnRleHQoY29udGV4dCkge1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAvLyBVcGRhdGUgY29udGV4dCBvbiBpbnB1dHMuXG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRzW2ldLnNldENvbnRleHQoY29udGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXaGVuIHRoZSBwYXJzZXIgdGhyb3dzIGFuIGVycm9yLCBuZWVkIHRvIHJlY29yZCBpdC5cbiAgICBzZXRQYXJzaW5nRXJyb3IoZXJyb3JTdHJpbmcpIHtcbiAgICAgICAgdGhpcy5wYXJzZUVycm9yID0gZXJyb3JTdHJpbmc7XG4gICAgfVxuXG4gICAgLy8gRXJyb3JzIGZyb20gcGFyc2luZy4gQ2hlY2sgYWxsIHBvc3NpYmxlIGNoaWxkcmVuIChyZWN1cnNpdmVseSlcbiAgICBoYXNQYXJzaW5nRXJyb3IoKSB7XG4gICAgICAgIHZhciByZXRWYWx1ZSA9IGZhbHNlLFxuICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgIGlmICh0aGlzLnBhcnNlRXJyb3IpIHtcbiAgICAgICAgICAgIHJldFZhbHVlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlICghcmV0VmFsdWUgJiYgaSA8IHRoaXMuaW5wdXRzLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIHJlZHVjdGlvbnMgb24gaW5wdXRzLlxuICAgICAgICAgICAgcmV0VmFsdWUgPSB0aGlzLmlucHV0c1tpXS5oYXNQYXJzaW5nRXJyb3IoKTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0VmFsdWU7XG4gICAgfVxuICAgIFxuICAgIC8vIEVycm9ycyBmcm9tIHBhcnNpbmcuIEZpbmQgdGhlICpmaXJzdCogZXJyb3IgaW4gdGhlIHBhcnNpbmcgcHJvY2Vzcy5cbiAgICBnZXRQYXJzaW5nRXJyb3IoKSB7XG4gICAgICAgIHZhciBlcnJTdHJpbmcgPSB0aGlzLnBhcnNlRXJyb3I7XG4gICAgICAgIHZhciBpPTA7XG4gICAgICAgIHdoaWxlICghZXJyU3RyaW5nICYmIGkgPCB0aGlzLmlucHV0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGVyclN0cmluZyA9IHRoaXMuaW5wdXRzW2ldLmdldFBhcnNpbmdFcnJvcigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoZXJyU3RyaW5nKTtcbiAgICB9XG4gICAgXG4gICAgLy8gTWV0aG9kIHRvIGdlbmVyYXRlIHRoZSBleHByZXNzaW9uIGFzIGlucHV0LXN0eWxlIHN0cmluZy5cbiAgICB0b1N0cmluZyhlbGVtZW50T25seSkge1xuICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnRPbmx5ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBlbGVtZW50T25seSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0aGVTdHIgPSAnJztcbiAgICAgICAgcmV0dXJuKHRoZVN0cik7XG4gICAgfVxuICAgIFxuICAgIC8vIE1ldGhvZCB0byBnZW5lcmF0ZSB0aGUgZXhwcmVzc2lvbiB1c2luZyBwcmVzZW50YXRpb24tc3R5bGUgKExhVGVYKVxuICAgIC8vIC0gc2hvd1NlbGVjdCBpcyBzbyB0aGF0IHBhcnQgb2YgdGhlIGV4cHJlc3Npb24gY2FuIGJlIGhpZ2hsaWdodGVkXG4gICAgdG9UZVgoc2hvd1NlbGVjdCkge1xuICAgICAgICBpZiAodHlwZW9mIHNob3dTZWxlY3QgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHNob3dTZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4odGhpcy50b1N0cmluZygpKTtcbiAgICB9XG5cbiAgICAvLyBNZXRob2QgdG8gcmVwcmVzZW50IHRoZSBleHByZXNzaW9uIHVzaW5nIE1hdGhNTFxuICAgIHRvTWF0aE1MKCkge1xuICAgICAgICByZXR1cm4oXCI8bWk+XCIgKyB0aGlzLnRvU3RyaW5nKCkgKyBcIjwvbWk+XCIpO1xuICAgIH1cbiAgICBcbiAgICAvLyBSZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgdGVzdGVkIGVxdWl2YWxlbnQgc3RyaW5ncy5cbiAgICBhbGxTdHJpbmdFcXVpdnMoKSB7XG4gICAgICAgIHJldHVybihbXSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFRvIGNvbnZlcnQgYmluYXJ5IHRyZWUgc3RydWN0dXJlIHRvIG4tYXJ5IHRyZWUgZm9yIHN1cHBvcnRlZCBvcGVyYXRpb25zICgrIGFuZCAqKVxuICAgIC8vIE1vc3QgdGhpbmdzIGNhbid0IGZsYXR0ZW4uIFJldHVybiBhIGNvcHkuXG4gICAgZmxhdHRlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29weSgpO1xuICAgIH1cbiAgICBcbiAgICAvLyBUZXN0IGlmIHRoZSBleHByZXNzaW9uIGV2YWx1YXRlcyB0byBhIGNvbnN0YW50LlxuICAgIGlzQ29uc3RhbnQoKSB7XG4gICAgICAgIHZhciByZXRWYWx1ZSA9IGZhbHNlO1xuICAgICAgICByZXR1cm4ocmV0VmFsdWUpO1xuICAgIH1cbiAgICBcbiAgICAvLyBUZXN0IGlmIHRoZSBleHByZXNzaW9uIGV2YWx1YXRlcyB0byBhIGNvbnN0YW50LlxuICAgIGlzRXhwcmVzc2lvbigpIHtcbiAgICAgICAgdmFyIHJldFZhbHVlID0gZmFsc2U7XG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBjbGFzcyBleHByZXNzaW9uIGV4dGVuZHMgTWF0aE9iamVjdCB7XG4gIGNvbnN0cnVjdG9yKGJ0bSkge1xuICAgICAgICBpZiAoIShidG0gaW5zdGFuY2VvZiBCVE0pKSB7XG4gICAgICAgICAgICB0aHJvdyBcImV4cHJlc3Npb24gY29uc3RydWN0ZWQgd2l0aCBpbnZhbGlkIGVudmlyb25tZW50XCI7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIoYnRtKTtcbiAgICAgICAgdGhpcy5zZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgICAgICB0aGlzLmlucHV0cyA9IFtdO1xuICAgICAgICB0aGlzLnZhbHVlVHlwZSA9IGV4cHJWYWx1ZS5udW1lcmljO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZCB0byAqZXZhbHVhdGUqIHRoZSB2YWx1ZSBvZiB0aGUgZXhwcmVzc2lvbiB1c2luZyBnaXZlbiBzeW1ib2wgYmluZGluZ3MuXG4gICAgLy8gLSBSZXR1cm4gbmF0aXZlIE51bWJlciB2YWx1ZVxuICAgIHZhbHVlKGJpbmRpbmdzKSB7XG4gICAgICAgIHJldHVybih0aGlzLmV2YWx1YXRlKGJpbmRpbmdzKSk7XG4gICAgfVxuXG4gICAgLy8gV2hlbiB0aGUgcGFyc2VyIHRocm93cyBhbiBlcnJvciwgbmVlZCB0byByZWNvcmQgaXQuXG4gICAgc2V0UGFyc2luZ0Vycm9yKGVycm9yU3RyaW5nKSB7XG4gICAgICAgIHRoaXMucGFyc2VFcnJvciA9IGVycm9yU3RyaW5nO1xuICAgIH1cblxuICAgIC8vIEVycm9ycyBmcm9tIHBhcnNpbmcuIENoZWNrIGFsbCBwb3NzaWJsZSBjaGlsZHJlbiAocmVjdXJzaXZlbHkpXG4gICAgaGFzUGFyc2luZ0Vycm9yKCkge1xuICAgICAgICB2YXIgcmV0VmFsdWUgPSBmYWxzZSxcbiAgICAgICAgICAgIGkgPSAwO1xuICAgICAgICBpZiAodGhpcy5wYXJzZUVycm9yKSB7XG4gICAgICAgICAgICByZXRWYWx1ZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoIXJldFZhbHVlICYmIGkgPCB0aGlzLmlucHV0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIGZvciByZWR1Y3Rpb25zIG9uIGlucHV0cy5cbiAgICAgICAgICAgIHJldFZhbHVlID0gdGhpcy5pbnB1dHNbaV0uaGFzUGFyc2luZ0Vycm9yKCk7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldFZhbHVlO1xuICAgIH1cblxuICAgIC8vIEVycm9ycyBmcm9tIHBhcnNpbmcuIEZpbmQgdGhlICpmaXJzdCogZXJyb3IgaW4gdGhlIHBhcnNpbmcgcHJvY2Vzcy5cbiAgICBnZXRQYXJzaW5nRXJyb3IoKSB7XG4gICAgICAgIHZhciBlcnJTdHJpbmcgPSB0aGlzLnBhcnNlRXJyb3I7XG4gICAgICAgIHZhciBpPTA7XG4gICAgICAgIHdoaWxlICghZXJyU3RyaW5nICYmIGkgPCB0aGlzLmlucHV0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGVyclN0cmluZyA9IHRoaXMuaW5wdXRzW2ldLmdldFBhcnNpbmdFcnJvcigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoZXJyU3RyaW5nKTtcbiAgICB9XG5cbiAgICAvLyBNZXRob2QgdG8gZ2VuZXJhdGUgdGhlIGV4cHJlc3Npb24gYXMgaW5wdXQtc3R5bGUgc3RyaW5nLlxuICAgIHRvU3RyaW5nKGVsZW1lbnRPbmx5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgZWxlbWVudE9ubHkgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGVsZW1lbnRPbmx5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRoZVN0ciA9ICcnO1xuICAgICAgICByZXR1cm4odGhlU3RyKTtcbiAgICB9XG5cbiAgICAvLyBNZXRob2QgdG8gZ2VuZXJhdGUgdGhlIGV4cHJlc3Npb24gdXNpbmcgcHJlc2VudGF0aW9uLXN0eWxlIChMYVRlWClcbiAgICAvLyAtIHNob3dTZWxlY3QgaXMgc28gdGhhdCBwYXJ0IG9mIHRoZSBleHByZXNzaW9uIGNhbiBiZSBoaWdobGlnaHRlZFxuICAgIHRvVGVYKHNob3dTZWxlY3QpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzaG93U2VsZWN0ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBzaG93U2VsZWN0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHRoaXMudG9TdHJpbmcoKSk7XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kIHRvIHJlcHJlc2VudCB0aGUgZXhwcmVzc2lvbiB1c2luZyBNYXRoTUxcbiAgICB0b01hdGhNTCgpIHtcbiAgICAgICAgcmV0dXJuKFwiPG1pPlwiICsgdGhpcy50b1N0cmluZygpICsgXCI8L21pPlwiKTtcbiAgICB9XG5cbiAgICBvcGVyYXRlVG9UZVgoKSB7XG4gICAgICAgIHJldHVybih0aGlzLnRvVGVYKCkpO1xuICAgIH1cblxuICAgIHRyZWVUb1RlWChleHBhbmQpIHtcbiAgICAgICAgdmFyIHJldFN0cnVjdCA9IHt9O1xuICAgICAgICBcbiAgICAgICAgcmV0U3RydWN0LnBhcmVudCA9ICh0eXBlb2YgdGhpcy5wYXJlbnQgPT09ICd1bmRlZmluZWQnIHx8IHRoaXMucGFyZW50ID09PSBudWxsKSA/IG51bGwgOiB0aGlzLnBhcmVudC5vcGVyYXRlVG9UZVgoKTtcbiAgICAgICAgaWYgKHR5cGVvZiBleHBhbmQgPT09ICd1bmRlZmluZWQnIHx8ICFleHBhbmQpIHtcbiAgICAgICAgICAgIHJldFN0cnVjdC5jdXJyZW50ID0gdGhpcy50b1RlWCgpO1xuICAgICAgICAgICAgcmV0U3RydWN0LmlucHV0cyA9IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXRTdHJ1Y3QuY3VycmVudCA9IHRoaXMub3BlcmF0ZVRvVGVYKCk7XG4gICAgICAgICAgICByZXRTdHJ1Y3QuaW5wdXRzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICAgICAgcmV0U3RydWN0LmlucHV0c1tpXSA9IHRoaXMuaW5wdXRzW2ldLnRvVGVYKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHJldFN0cnVjdCk7XG4gICAgfVxuXG5cbiAgICAvLyBSZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgdGVzdGVkIGVxdWl2YWxlbnQgc3RyaW5ncy5cbiAgICBhbGxTdHJpbmdFcXVpdnMoKSB7XG4gICAgICAgIHJldHVybihbXSk7XG4gICAgfVxuXG4gICAgLy8gVG8gY29udmVydCBiaW5hcnkgdHJlZSBzdHJ1Y3R1cmUgdG8gbi1hcnkgdHJlZSBmb3Igc3VwcG9ydGVkIG9wZXJhdGlvbnMgKCsgYW5kICopXG4gICAgLy8gTW9zdCB0aGluZ3MgY2FuJ3QgZmxhdHRlbi4gUmV0dXJuIGEgY29weS5cbiAgICBmbGF0dGVuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb3B5KCk7XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIGEgbmV3IGV4cHJlc3Npb24gdGhhdCBpcyBhIGNvcHkuXG4gICAgY29weSgpIHtcbiAgICAgICAgdmFyIG15Q29weSA9IG5ldyBleHByZXNzaW9uKHRoaXMuYnRtKTtcbiAgICAgICAgcmV0dXJuIG15Q29weTtcbiAgICB9XG5cbiAgICAvLyBXaGVuIHN1YnRyZWUgb25seSBpbnZvbHZlcyBjb25zdGFudHMsIHNpbXBsaWZ5IHRoZSBmb3JtdWxhIHRvIGEgdmFsdWUuXG4gICAgLy8gRGVmYXVsdDogTG9vayBhdCBhbGwgZGVzY2VuZGFudHMgKGlucHV0cykgYW5kIHNpbXBsaWZ5IHRoZXJlLlxuICAgIHNpbXBsaWZ5Q29uc3RhbnRzKCkge1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0c1tpXSA9IHRoaXMuaW5wdXRzW2ldLnNpbXBsaWZ5Q29uc3RhbnRzKCk7XG4gICAgICAgICAgICB0aGlzLmlucHV0c1tpXS5wYXJlbnQgPSB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybih0aGlzKTtcbiAgICB9XG5cbiAgICAvLyBGaW5kIGFsbCBkZXBlbmRlbmNpZXMgKHN5bWJvbHMpIHJlcXVpcmVkIHRvIGV2YWx1YXRlIGV4cHJlc3Npb24uXG4gICAgZGVwZW5kZW5jaWVzKGZvcmNlZCkge1xuICAgICAgICB2YXIgaW5EZXBzO1xuICAgICAgICB2YXIgaSwgajtcbiAgICAgICAgdmFyIGRlcEFycmF5ID0gbmV3IEFycmF5KCk7XG5cbiAgICAgICAgdmFyIG1hc3RlciA9IHt9O1xuICAgICAgICBpZiAoZm9yY2VkICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPGZvcmNlZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGRlcEFycmF5LnB1c2goZm9yY2VkW2ldKTtcbiAgICAgICAgICAgICAgICBtYXN0ZXJbZm9yY2VkW2ldXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICBpbkRlcHMgPSB0aGlzLmlucHV0c1tpXS5kZXBlbmRlbmNpZXMoKTtcbiAgICAgICAgICAgIGZvciAoaiBpbiBpbkRlcHMpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1hc3RlcltpbkRlcHNbal1dID09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVwQXJyYXkucHVzaChpbkRlcHNbal0pO1xuICAgICAgICAgICAgICAgICAgICBtYXN0ZXJbaW5EZXBzW2pdXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKGRlcEFycmF5KTtcbiAgICB9XG5cbiAgICAvLyBNZXRob2QgdG8gcmV0dXJuIGlucHV0IGF0IGdpdmVuIGluZGV4LlxuICAgIGdldElucHV0KHdoaWNoSW5wdXQpIHtcbiAgICAgICAgdmFyIGlucHV0RXhwciA9IG51bGw7XG4gICAgICAgIGlmICh3aGljaElucHV0IDwgMCB8fCB3aGljaElucHV0ID49IHRoaXMuaW5wdXRzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgJ0F0dGVtcHQgdG8gZ2V0IGFuIHVuZGVmaW5lZCBpbnB1dCBleHByZXNzaW9uLic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnB1dEV4cHIgPSB0aGlzLmlucHV0c1t3aGljaElucHV0XTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4oaW5wdXRFeHByKTtcbiAgICB9XG5cbiAgICAvLyBUZXN0IGlmIHRoZSBleHByZXNzaW9uIGV2YWx1YXRlcyB0byBhIGNvbnN0YW50LlxuICAgIGlzQ29uc3RhbnQoKSB7XG4gICAgICAgIHZhciByZXRWYWx1ZSA9IHRydWU7XG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgIHJldFZhbHVlID0gcmV0VmFsdWUgJiB0aGlzLmlucHV0c1tpXS5pc0NvbnN0YW50KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHJldFZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBFdmFsdWF0ZSB0aGUgZXhwcmVzc2lvbiBnaXZlbiB0aGUgYmluZGluZ3MgdG8gc3ltYm9scy5cbiAgICBldmFsdWF0ZShiaW5kaW5ncykge1xuICAgICAgICByZXR1cm4oMCk7XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIGEgKm5ldyogZXhwcmVzc2lvbiB3aGVyZSBhIHN5bWJvbCBpcyAqcmVwbGFjZWQqIGJ5IGEgYm91bmQgZXhwcmVzc2lvblxuICAgIGNvbXBvc2UoYmluZGluZ3MpIHtcbiAgICAgICAgcmV0dXJuKG5ldyBleHByZXNzaW9uKHRoaXMuYnRtKSk7XG4gICAgfVxuXG4gICAgLy8gQ29tcGFyZSAqdGhpcyogZXhwcmVzc2lvbiB0byBhIGdpdmVuICp0ZXN0RXhwciouXG4gICAgLy8gKm9wdGlvbnMqIGdpdmVzIG9wdGlvbnMgYXNzb2NpYXRlZCB3aXRoIHRlc3RpbmcgKGUuZy4sIHJlbGF0aXZlIHRvbGVyYW5jZSlcbiAgICAvLyBidXQgYWxzbyBzdXBwb3J0cyBmaXhpbmcgY2VydGFpbiBiaW5kaW5ncy5cbiAgICAvLyBTdXBwb3J0cyBhYnN0cmFjdCBpbnB1dCBtYXRjaGluZyBhZ2FpbnN0IHZhcmlhYmxlcyB1c2luZyAqbWF0Y2hJbnB1dHMqXG4gICAgY29tcGFyZSh0ZXN0RXhwciwgb3B0aW9ucywgbWF0Y2hJbnB1dHMpIHtcbiAgICAgICAgdmFyIGlzRXF1YWwgPSB0cnVlO1xuICAgICAgICB2YXIgaSwgbjtcblxuICAgICAgICBpZiAobWF0Y2hJbnB1dHMgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBtYXRjaElucHV0cyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHZhciBrbm93bkJpbmRpbmdzID0gT2JqZWN0LmtleXMob3B0aW9ucyk7XG4gICAgICAgIHZhciB1bmtub3duQmluZGluZ3MgPSBbXTtcblxuICAgICAgICB2YXIgclRvbCA9IDFlLTg7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5yVG9sICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgclRvbCA9IG9wdGlvbnMuclRvbDtcbiAgICAgICAgICAgIGkgPSBrbm93bkJpbmRpbmdzLmluZGV4T2YoJ3JUb2wnKTtcbiAgICAgICAgICAgIGtub3duQmluZGluZ3Muc3BsaWNlKGksIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRlcGVuZEEgPSB0aGlzLmRlcGVuZGVuY2llcygpO1xuICAgICAgICB2YXIgZGVwZW5kQiA9IHRlc3RFeHByLmRlcGVuZGVuY2llcygpO1xuXG4gICAgICAgIGZvciAoaT0wOyBpPGRlcGVuZEEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChrbm93bkJpbmRpbmdzLmluZGV4T2YoZGVwZW5kQVtpXSkgPCAwXG4gICAgICAgICAgICAgICAgJiYgdW5rbm93bkJpbmRpbmdzLmluZGV4T2YoZGVwZW5kQVtpXSkgPCAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHVua25vd25CaW5kaW5ncy5wdXNoKGRlcGVuZEFbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoaT0wOyBpPGRlcGVuZEIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChrbm93bkJpbmRpbmdzLmluZGV4T2YoZGVwZW5kQltpXSkgPCAwXG4gICAgICAgICAgICAgICAgJiYgdW5rbm93bkJpbmRpbmdzLmluZGV4T2YoZGVwZW5kQltpXSkgPCAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHVua25vd25CaW5kaW5ncy5wdXNoKGRlcGVuZEJbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBhcnJheXMgb2YgdGVzdCBwb2ludHMuXG4gICAgICAgIHZhciB2YXJpYWJsZUxpc3QgPSBbXTtcbiAgICAgICAgdmFyIHRlc3RQb2ludExpc3QgPSBbXTtcbiAgICAgICAgdmFyIHgsIHhPcHQsIHhNaW4sIHhNYXgsIGR4LCBuLCB0ZXN0UG9pbnRzO1xuICAgICAgICBuID0gMTA7XG4gICAgICAgIGZvciAoaT0wOyBpPGtub3duQmluZGluZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHggPSBrbm93bkJpbmRpbmdzW2ldO1xuICAgICAgICAgICAgeE9wdCA9IG9wdGlvbnNbeF07XG4gICAgICAgICAgICB4TWluID0geE9wdC5taW47XG4gICAgICAgICAgICB4TWF4ID0geE9wdC5tYXg7XG4gICAgICAgICAgICBkeCA9ICh4TWF4LXhNaW4pL247XG4gICAgICAgICAgICB0ZXN0UG9pbnRzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBqPTA7IGo8bjsgaisrKSB7XG4gICAgICAgICAgICAgICAgdGVzdFBvaW50c1tqXSA9IHhNaW4raipkeDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlc3RQb2ludHNbbl0gPSB4TWF4O1xuXG4gICAgICAgICAgICAvLyBBZGQgdGhpcyB0byB0aGUgbGlzdCBvZiB0ZXN0aW5nIGFycmF5cy5cbiAgICAgICAgICAgIHZhcmlhYmxlTGlzdC5wdXNoKHgpO1xuICAgICAgICAgICAgdGVzdFBvaW50TGlzdC5wdXNoKHRlc3RQb2ludHMpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaT0wOyBpPHVua25vd25CaW5kaW5ncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgeCA9IHVua25vd25CaW5kaW5nc1tpXTtcbiAgICAgICAgICAgIHhNaW4gPSAtMjtcbiAgICAgICAgICAgIHhNYXggPSAyO1xuICAgICAgICAgICAgZHggPSAoeE1heC14TWluKS9uO1xuICAgICAgICAgICAgdGVzdFBvaW50cyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaj0wOyBqPG47IGorKykge1xuICAgICAgICAgICAgICAgIHRlc3RQb2ludHNbal0gPSB4TWluK2oqZHg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ZXN0UG9pbnRzW25dID0geE1heDtcblxuICAgICAgICAgICAgLy8gQWRkIHRoaXMgdG8gdGhlIGxpc3Qgb2YgdGVzdGluZyBhcnJheXMuXG4gICAgICAgICAgICB2YXJpYWJsZUxpc3QucHVzaCh4KTtcbiAgICAgICAgICAgIHRlc3RQb2ludExpc3QucHVzaCh0ZXN0UG9pbnRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vdyB3ZSB3aWxsIHByb2NlZWQgdGhyb3VnaCBhbGwgcG9zc2libGUgcG9pbnRzLlxuICAgICAgICAvLyBBbmFsb2d5OiBFYWNoIHZhcmlhYmxlIGlzIGxpa2Ugb25lIFwiZGlnaXRcIiBvbiBhbiBvZG9tZXRlci5cbiAgICAgICAgLy8gR28gdGhyb3VnaCBmdWxsIGN5Y2xlIG9mIGEgdmFyaWFibGUncyBvcHRpb25zIGFuZCB0aGVuIGFkdmFuY2UgdGhlIG5leHQgdmFyaWFibGUuXG4gICAgICAgIC8vIFVzZSBhbiBvZG9tZXRlci1saWtlIGFycmF5IHRoYXQgcmVmZXJlbmNlcyB3aGljaCBwb2ludCBmcm9tXG4gICAgICAgIC8vIGVhY2ggbGlzdCBpcyBiZWluZyB1c2VkLiBXaGVuIHRoZSBsYXN0IGVudHJ5IHJlYWNoZXMgdGhlIGVuZCxcbiAgICAgICAgLy8gdGhlIG9kb21ldGVyIHJvbGxzIG92ZXIgdW50aWwgYWxsIGVudHJpZXMgYXJlIGRvbmUuXG4gICAgICAgIHZhciBvZG9tZXRlciA9IFtdO1xuICAgICAgICBmb3IgKGk9MDsgaTx2YXJpYWJsZUxpc3QubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICBvZG9tZXRlcltpXT0wO1xuICAgICAgICB2YXIgZG9uZSA9IGZhbHNlO1xuICAgICAgICB3aGlsZSAoIWRvbmUgJiYgaXNFcXVhbCkge1xuICAgICAgICAgICAgdmFyIHkxLCB5MjtcbiAgICAgICAgICAgIHZhciBiaW5kaW5ncyA9IHt9O1xuICAgICAgICAgICAgZm9yIChpPTA7IGk8dmFyaWFibGVMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgeCA9IHZhcmlhYmxlTGlzdFtpXTtcbiAgICAgICAgICAgICAgICBiaW5kaW5nc1t4XSA9IHRlc3RQb2ludExpc3RbaV1bb2RvbWV0ZXJbaV1dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeTEgPSB0aGlzLmV2YWx1YXRlKGJpbmRpbmdzKTtcbiAgICAgICAgICAgIHkyID0gdGVzdEV4cHIuZXZhbHVhdGUoYmluZGluZ3MpO1xuICAgICAgICAgICAgLy8gQm90aCBmaW5pdGU/IENoZWNrIGZvciByZWxhdGl2ZSBlcnJvci5cbiAgICAgICAgICAgIGlmIChpc0Zpbml0ZSh5MSkgJiYgaXNGaW5pdGUoeTIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoTWF0aC5hYnMoeTEpPDFlLTEyICYmIE1hdGguYWJzKHkyKTwxZS0xMilcbiAgICAgICAgICAgICAgICAgICAgJiYgTWF0aC5hYnMoeTEteTIpL01hdGguYWJzKHkxKT5yVG9sKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzRXF1YWwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gSWYgb25lIGlzIGZpbml0ZSwgb3RoZXIgbXVzdCBiZSBOYU5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAoaXNGaW5pdGUoeTEpICYmICFpc05hTih5MikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgKGlzRmluaXRlKHkyKSAmJiAhaXNOYU4oeTEpKSApIHtcbiAgICAgICAgICAgICAgICAgICAgaXNFcXVhbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEFkdmFuY2UgdGhlIG9kb21ldGVyLlxuICAgICAgICAgICAgICAgIHZhciBqPTA7XG4gICAgICAgICAgICAgICAgZG9uZSA9IHRydWU7IC8vIFRoaXMgd2lsbCBvbmx5IHBlcnNpc3Qgd2hlbiB0aGUgb2RvbWV0ZXIgaXMgZG9uZS5cbiAgICAgICAgICAgICAgICB3aGlsZSAoaiA8IHZhcmlhYmxlTGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgb2RvbWV0ZXJbal0rKztcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9kb21ldGVyW2pdID49IHRlc3RQb2ludExpc3Rbal0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvZG9tZXRlcltqXSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBqKys7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXRjaElucHV0cyAmJiBpc0VxdWFsKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoT3A7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3AgPT0gJysnIHx8IHRoaXMub3AgPT0gJy0nKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoT3AgPSAnKyc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9wID09ICcqJyB8fCB0aGlzLm9wID09ICcvJykge1xuICAgICAgICAgICAgICAgICAgICBtYXRjaE9wID0gJyonO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoKG1hdGNoT3A9PScrJyAmJiB0ZXN0RXhwci5vcCAhPSAnKycgJiYgdGVzdEV4cHIub3AgIT0gJy0nKVxuICAgICAgICAgICAgICAgICAgICB8fCAobWF0Y2hPcD09JyonICYmIHRlc3RFeHByLm9wICE9ICcqJyAmJiB0ZXN0RXhwci5vcCAhPSAnLycpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzRXF1YWwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGlzRXF1YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZsYXRBLCBmbGF0QjtcbiAgICAgICAgICAgICAgICAgICAgZmxhdEEgPSB0aGlzLmZsYXR0ZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgZmxhdEIgPSB0ZXN0RXhwci5mbGF0dGVuKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmbGF0QS5pbnB1dHMubGVuZ3RoID09IGZsYXRCLmlucHV0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlucHV0TWF0Y2hlZCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGk9MDsgaTxmbGF0QS5pbnB1dHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0TWF0Y2hlZFtpXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIEdvIHRocm91Z2ggZWFjaCBpbnB1dCBvZiB0ZXN0RXhwciBhbmQgc2VlIGlmIGl0IG1hdGNoZXMgb24gb2YgdGhpcyBpbnB1dHMuXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaT0wOyBpPGZsYXRCLmlucHV0cy5sZW5ndGggJiYgaXNFcXVhbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF0Y2hGb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqPTA7IGo8ZmxhdEEuaW5wdXRzLmxlbmd0aCAmJiAhbWF0Y2hGb3VuZDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpbnB1dE1hdGNoZWRbal0gJiYgZmxhdEEuaW5wdXRzW2pdLmNvbXBhcmUoZmxhdEIuaW5wdXRzW2ldKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dE1hdGNoZWRbal0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaEZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW1hdGNoRm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0VxdWFsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpc0VxdWFsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybihpc0VxdWFsKTtcbiAgICB9XG5cbiAgICAvLyBBcHBseSByZWR1Y3Rpb24gcnVsZXMgdG8gY3JlYXRlIGEgcmVkdWNlZCBleHByZXNzaW9uXG4gICAgcmVkdWNlKCkge1xuICAgICAgICB2YXIgd29ya0V4cHIgPSB0aGlzLnNpbXBsaWZ5Q29uc3RhbnRzKCk7XG4gICAgICAgIHZhciBtYXRjaFJ1bGVzO1xuXG4gICAgICAgIC8vIENoZWNrIGZvciByZWR1Y3Rpb25zIG9uIGlucHV0cy5cbiAgICAgICAgZm9yICh2YXIgaSBpbiB3b3JrRXhwci5pbnB1dHMpIHtcbiAgICAgICAgICAgIHdvcmtFeHByLmlucHV0c1tpXSA9IHdvcmtFeHByLmlucHV0c1tpXS5yZWR1Y2UoKTtcbiAgICAgICAgfVxuICAgICAgICBtYXRjaFJ1bGVzID0gZmluZE1hdGNoUnVsZXModGhpcy5idG0ucmVkdWNlUnVsZXMsIHdvcmtFeHByLCB0cnVlKTtcbiAgICAgICAgd2hpbGUgKG1hdGNoUnVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgd29ya0V4cHIgPSB0aGlzLmJ0bS5wYXJzZShtYXRjaFJ1bGVzWzBdLnN1YlN0ciwgdGhpcy5jb250ZXh0KTtcbiAgICAgICAgICAgIG1hdGNoUnVsZXMgPSBmaW5kTWF0Y2hSdWxlcyh0aGlzLmJ0bS5yZWR1Y2VSdWxlcywgd29ya0V4cHIsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB3b3JrRXhwcjtcbiAgICB9XG5cbiAgICBcbiAgICBkZXJpdmF0aXZlKGl2YXIsIHZhckxpc3QpIHtcbiAgICAgICAgcmV0dXJuKG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMCkpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgIFRoZSBtYXRjaCBtZXRob2QgaXMgZGVzaWduZWQgdG8gY29tcGFyZSBcInRoaXNcIiBleHByZXNzaW9uXG4gICAgICAgIHRvIHRoZSBnaXZlbiBcImV4cHJcIiBleHByZXNzaW9uIGFuZCBzZWUgaWYgaXQgaXMgY29uc2lzdGVudCB3aXRoXG4gICAgICAgIHRoZSBjdXJyZW50IGJpbmRpbmdzLiBUaGUgYmluZGluZ3Mgd2lsbCBiZSBhbiBvYmplY3Qgd2hlcmVcbiAgICAgICAgdmFyaWFibGVzIGluIFwidGhpc1wiIGFyZSBhc3NpZ25lZCB0byBzdHJpbmdzIHJlcHJlc2VudGluZyBleHByZXNzaW9ucy5cbiAgICAgICAgSWYgdGhlcmUgaXMgYSBtaXNtYXRjaCwgcmV0dXJuIFwibnVsbFwiIGFuZCB0aGUgbWF0Y2hpbmcgcHJvY2VzcyBzaG91bGQgdGVybWluYXRlLlxuXG4gICAgICAgIE92ZXJyaWRlczpcbiAgICAgICAgICAgIC0gbnVtYmVycywgdG8gZGVhbCB3aXRoIHNjYWxhciBmb3JtdWxhIHRoYXQgc2ltcGxpZnlcbiAgICAgICAgICAgIC0gdmFyaWFibGVzLCB3aGljaCBjYW4gbWF0Y2ggYXJiaXRyYXJ5IGV4cHJlc3Npb25zLlxuICAgICAgICAgICAgLSBpbmRleGVkIGV4cHJlc3Npb25zIG1pZ2h0IG5lZWQgYSBzcGVjaWFsIG1ldGhvZC5cbiAgICAgICAgICAgIC0gbXVsdGlvcCwgd2hlcmUgc2hvdWxkIHNlZSBpZiBhIHZhcmlhYmxlIGNhbiBtYXRjaCBhIHN1YmNvbGxlY3Rpb24gb2YgaW5wdXRzLlxuICAgICovXG4gICAgbWF0Y2goZXhwciwgYmluZGluZ3MpIHtcbiAgICAgICAgdmFyIHJldFZhbHVlID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PSBleHByLnR5cGUgJiYgdGhpcy5vcGVyYXRlVG9UZVgoKSA9PSBleHByLm9wZXJhdGVUb1RlWCgpKSB7XG4gICAgICAgICAgICByZXRWYWx1ZSA9IGJpbmRpbmdzO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMuaW5wdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJldFZhbHVlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbHVlID0gdGhpcy5pbnB1dHNbaV0ubWF0Y2goZXhwci5pbnB1dHNbaV0sIHJldFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHJldFZhbHVlKTtcbiAgICB9XG5cbiAgICBpbnB1dFN1YnN0KG9yaWdFeHByLCBzdWJFeHByKSB7XG4gICAgICAgIHZhciBpID0gdGhpcy5pbnB1dHMuaW5kZXhPZihvcmlnRXhwcik7XG4gICAgICAgIGlmIChpID49IDApIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRzW2ldID0gc3ViRXhwcjtcbiAgICAgICAgICAgIGlmIChzdWJFeHByICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBzdWJFeHByLnBhcmVudCA9IHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwiLyohXG4gKiBCVE0gSmF2YVNjcmlwdCBMaWJyYXJ5IHZAVkVSU0lPTlxuICogaHR0cHM6Ly9naXRodWIuY29tL2RicmlhbndhbHRvbi9CVE1cbiAqXG4gKiBDb3B5cmlnaHQgRC4gQnJpYW4gV2FsdG9uXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUKVxuICpcbiAqIERhdGU6IEBEQVRFXG4gKi9cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqIERlZmluZSB0aGUgRnVuY3Rpb24gRXhwcmVzc2lvbiAtLSBkZWZpbmVkIGJ5IGEgZnVuY3Rpb24gbmFtZSBhbmQgaW5wdXQgZXhwcmVzc2lvblxuICAgKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuaW1wb3J0IHsgZXhwcmVzc2lvbiB9IGZyb20gXCIuL2V4cHJlc3Npb24uanNcIlxuaW1wb3J0IHsgc2NhbGFyX2V4cHIgfSBmcm9tIFwiLi9zY2FsYXJfZXhwci5qc1wiXG5pbXBvcnQgeyB2YXJpYWJsZV9leHByIH0gZnJvbSBcIi4vdmFyaWFibGVfZXhwci5qc1wiXG5pbXBvcnQgeyB1bm9wX2V4cHIgfSBmcm9tIFwiLi91bm9wX2V4cHIuanNcIlxuaW1wb3J0IHsgYmlub3BfZXhwciB9IGZyb20gXCIuL2Jpbm9wX2V4cHIuanNcIlxuaW1wb3J0IHsgZXhwclR5cGUgfSBmcm9tIFwiLi9CVE1fcm9vdC5qc1wiXG5cbmV4cG9ydCBjbGFzcyBmdW5jdGlvbl9leHByIGV4dGVuZHMgZXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IoYnRtLCBuYW1lLCBpbnB1dEV4cHIsIHJlc3RyaWN0RG9tYWluKSB7XG4gICAgICAgIHN1cGVyKGJ0bSk7XG4gICAgICAgIHRoaXMudHlwZSA9IGV4cHJUeXBlLmZjbjtcbiAgICAgICAgLy8gQ291bnQgaG93IG1hbnkgZGVyaXZhdGl2ZXMuXG4gICAgICAgIHZhciBwcmltZVBvcyA9IG5hbWUuaW5kZXhPZihcIidcIik7XG4gICAgICAgIHRoaXMuZGVyaXZzID0gMDtcbiAgICAgICAgaWYgKHByaW1lUG9zID4gMCkge1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gbmFtZS5zbGljZSgwLHByaW1lUG9zKTtcbiAgICAgICAgICAgIHRoaXMuZGVyaXZzID0gbmFtZS5zbGljZShwcmltZVBvcykubGVuZ3RoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGlucHV0RXhwciA9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIGlucHV0RXhwciA9IG5ldyBleHByZXNzaW9uKHRoaXMuYnRtKTtcbiAgICAgICAgdGhpcy5pbnB1dHMgPSBbaW5wdXRFeHByXTtcbiAgICAgICAgaW5wdXRFeHByLnBhcmVudCA9IHRoaXM7XG4gICAgICAgIHRoaXMuZG9tYWluID0gcmVzdHJpY3REb21haW47XG5cbiAgICAgICAgdGhpcy5hbHRlcm5hdGUgPSBudWxsO1xuICAgICAgICB0aGlzLmJ1aWx0aW4gPSB0cnVlO1xuICAgICAgICBzd2l0Y2godGhpcy5uYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdhc2luJzpcbiAgICAgICAgICAgIGNhc2UgJ2Fjb3MnOlxuICAgICAgICAgICAgY2FzZSAnYXRhbic6XG4gICAgICAgICAgICBjYXNlICdhc2VjJzpcbiAgICAgICAgICAgIGNhc2UgJ2Fjc2MnOlxuICAgICAgICAgICAgY2FzZSAnYWNvdCc6XG4gICAgICAgICAgICAgICAgdGhpcy5uYW1lID0gJ2FyYycrdGhpcy5uYW1lLnNsaWNlKDEsNCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdsb2cnOlxuICAgICAgICAgICAgICAgIHRoaXMubmFtZSA9ICdsbic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzaW4nOlxuICAgICAgICAgICAgY2FzZSAnY29zJzpcbiAgICAgICAgICAgIGNhc2UgJ3Rhbic6XG4gICAgICAgICAgICBjYXNlICdjc2MnOlxuICAgICAgICAgICAgY2FzZSAnc2VjJzpcbiAgICAgICAgICAgIGNhc2UgJ2NvdCc6XG4gICAgICAgICAgICBjYXNlICdhcmNzaW4nOlxuICAgICAgICAgICAgY2FzZSAnYXJjY29zJzpcbiAgICAgICAgICAgIGNhc2UgJ2FyY3Rhbic6XG4gICAgICAgICAgICBjYXNlICdhcmNzZWMnOlxuICAgICAgICAgICAgY2FzZSAnYXJjY3NjJzpcbiAgICAgICAgICAgIGNhc2UgJ2FyY2NvdCc6XG4gICAgICAgICAgICBjYXNlICdzcXJ0JzpcbiAgICAgICAgICAgIGNhc2UgJ3Jvb3QnOlxuICAgICAgICAgICAgY2FzZSAnYWJzJzpcbiAgICAgICAgICAgIGNhc2UgJ2V4cCc6XG4gICAgICAgICAgICBjYXNlICdleHBiJzpcbiAgICAgICAgICAgIGNhc2UgJ2xuJzpcbiAgICAgICAgICAgIGNhc2UgJ2xvZzEwJzpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhpcy5idWlsdGluID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy8gV2hlbiB1c2luZyBhIGN1c3RvbSBmdW5jdGlvbiBmb3IgdGhlIGZpcnN0IHRpbWUsIHdlIG5lZWQgdG8gY3JlYXRlXG4gICAgICAgICAgICAgICAgLy8gYSByYW5kb20gZHVtbXkgZnVuY3Rpb24gZm9yIHdvcmsgd2hlbiBub3QgYm91bmQgdG8gZGVmaW5pdGlvbi5cbiAgICAgICAgICAgICAgICAvLyBTZWUgaWYgd2UgaGF2ZSBhbHJlYWR5IHVzZWQgdGhpcyBmdW5jdGlvbi5cbiAgICAgICAgICAgICAgICAvLyBGb3IgY29uc2lzdGVuY3ksIHdlIHNob3VsZCBrZWVwIGl0IHRoZSBzYW1lLlxuICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbkVudHJ5ID0gdGhpcy5idG0ucmFuZG9tQmluZGluZ3NbdGhpcy5uYW1lXTtcbiAgICAgICAgICAgICAgICAvLyBJZiBuZXZlciB1c2VkIHByZXZpb3VzbHksIGdlbmVyYXRlIGEgcmFuZG9tIGZ1bmN0aW9uLlxuICAgICAgICAgICAgICAgIC8vIFRoaXMgd2lsbCBhbGxvdyB2YWxpZCBjb21wYXJpc29ucyB0byBvY2N1ci5cbiAgICAgICAgICAgICAgICBpZiAoZnVuY3Rpb25FbnRyeSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25FbnRyeSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbkVudHJ5W1wiaW5wdXRcIl0gPSBcInhcIjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZvcm11bGEgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIHRoaXMuYnRtLnJuZy5yYW5kUmF0aW9uYWwoWy0yMCwyMF0sWzEsMTVdKSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdUZXJtLCB2YXJUZXJtO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTE7IGk8PTY7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3VGVybSA9IHRoaXMuYnRtLnBhcnNlKFwic2luKFwiK2krXCIqeClcIiwgXCJmb3JtdWxhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3VGVybSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCBcIipcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIHRoaXMuYnRtLnJuZy5yYW5kUmF0aW9uYWwoWy0yMCwyMF0sWzEsMTBdKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3VGVybSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtdWxhID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sIFwiK1wiLCBmb3JtdWxhLCBuZXdUZXJtKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbkVudHJ5W1widmFsdWVcIl0gPSBbIGZvcm11bGEgXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idG0ucmFuZG9tQmluZGluZ3NbdGhpcy5uYW1lXSA9IGZ1bmN0aW9uRW50cnk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlcml2cyA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHh2YXIgPSBuZXcgdmFyaWFibGVfZXhwcih0aGlzLmJ0bSwgXCJ4XCIpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpPWZ1bmN0aW9uRW50cnlbXCJ2YWx1ZVwiXS5sZW5ndGg7IGk8PXRoaXMuZGVyaXZzOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uRW50cnlbXCJ2YWx1ZVwiXVtpXSA9IGZ1bmN0aW9uRW50cnlbXCJ2YWx1ZVwiXVtpLTFdLmRlcml2YXRpdmUoeHZhciwge1wieFwiOjB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB1c2luZyBhIGRlcml2YXRpdmUgb2YgYSBrbm93biBmdW5jdGlvbiwgdGhlbiB3ZSBzaG91bGQgY29tcHV0ZSB0aGF0IGluIGFkdmFuY2UuXG4gICAgICAgIGlmICh0aGlzLmJ1aWx0aW4gJiYgdGhpcy5kZXJpdnMgPiAwKSB7XG4gICAgICAgICAgICB2YXIgeHZhciA9IG5ldyB2YXJpYWJsZV9leHByKHRoaXMuYnRtLCBcInhcIik7XG4gICAgICAgICAgICB2YXIgZGVyaXYgPSBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLmJ0bSwgdGhpcy5uYW1lLCB4dmFyKTtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLmRlcml2czsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGVyaXYgPSBkZXJpdi5kZXJpdmF0aXZlKHh2YXIsIHtcInhcIjowfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYmluZGluZyA9IHt9O1xuICAgICAgICAgICAgYmluZGluZ1tcInhcIl0gPSBpbnB1dEV4cHI7XG4gICAgICAgICAgICB0aGlzLmFsdGVybmF0ZSA9IGRlcml2LmNvbXBvc2UoYmluZGluZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXROYW1lKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMubmFtZSArIFwiJ1wiLnJlcGVhdCh0aGlzLmRlcml2cykpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKGVsZW1lbnRPbmx5KSB7XG4gICAgICAgIHZhciBmY25TdHJpbmcsIHJldFN0cmluZztcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50T25seSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZWxlbWVudE9ubHkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBmY25TdHJpbmcgPSB0aGlzLmdldE5hbWUoKTtcbiAgICAgICAgaWYgKGVsZW1lbnRPbmx5KSB7XG4gICAgICAgICAgICByZXRTdHJpbmcgPSBmY25TdHJpbmc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgYXJnU3RyaW5ncyA9IFtdO1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzLmxlbmd0aCA9PSAwIHx8IHR5cGVvZiB0aGlzLmlucHV0c1swXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGFyZ1N0cmluZ3MucHVzaCgnPycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ1N0cmluZ3MucHVzaCh0aGlzLmlucHV0c1tpXS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXRTdHJpbmcgPSBmY25TdHJpbmcgKyAnKCcgKyBhcmdTdHJpbmdzLmpvaW4oJywnKSArICcpJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ocmV0U3RyaW5nKTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgdGVzdGVkIGVxdWl2YWxlbnQgc3RyaW5ncy5cbiAgICBhbGxTdHJpbmdFcXVpdnMoKSB7XG4gICAgICAgIHZhciBhbGxJbnB1dHMgPSBbXSwgaW5wdXRPcHRpb25zID0gW107XG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgIGlucHV0T3B0aW9ucy5wdXNoKHRoaXMuaW5wdXRzW2ldLmFsbFN0cmluZ0VxdWl2cygpKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmV0VmFsdWUgPSBbXTtcbiAgICAgICAgdmFyIGZjblN0cmluZyA9IHRoaXMuZ2V0TmFtZSgpO1xuICAgICAgICAvLyBXYW50IHRvIGNyZWF0ZSBhIGxpc3Qgb2YgYWxsIHBvc3NpYmxlIGlucHV0IHJlcHJlc2VudGF0aW9ucy5cbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVBcmdzKGxlZnQsIHJpZ2h0T3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKHJpZ2h0T3B0aW9ucy5sZW5ndGg9PTApIHtcbiAgICAgICAgICAgICAgICBhbGxJbnB1dHMucHVzaChsZWZ0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIE4gPSBsZWZ0Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICB2YXIgbmV3TGVmdCA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGsgaW4gbGVmdCkge1xuICAgICAgICAgICAgICAgICAgICBuZXdMZWZ0LnB1c2gobGVmdFtrXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGsgaW4gcmlnaHRPcHRpb25zWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0xlZnRbTl0gPSByaWdodE9wdGlvbnNbMF1ba107XG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlQXJncyhuZXdMZWZ0LCByaWdodE9wdGlvbnMuc2xpY2UoMSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBnZW5lcmF0ZUFyZ3MoW10sIGlucHV0T3B0aW9ucyk7XG4gICAgICAgIGZvciAodmFyIGkgaW4gYWxsSW5wdXRzKSB7XG4gICAgICAgICAgICByZXRWYWx1ZVtpXSA9IGZjblN0cmluZysnKCcgKyBhbGxJbnB1dHNbaV0uam9pbignKycpICsgJyknO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKHJldFZhbHVlKTtcbiAgICB9XG5cbiAgICB0b1RlWChzaG93U2VsZWN0KSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2hvd1NlbGVjdCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgc2hvd1NlbGVjdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0ZXhTdHJpbmcgPSAnJztcbiAgICAgICAgdmFyIGZjblN0cmluZztcbiAgICAgICAgdmFyIGFyZ1N0cmluZ3MgPSBbXTtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0c1swXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgYXJnU3RyaW5ncy5wdXNoKCc/Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICAgICAgYXJnU3RyaW5ncy5wdXNoKHRoaXMuaW5wdXRzW2ldLnRvVGVYKHNob3dTZWxlY3QpKTtcbiAgICAgICAgICAgICAgICBpZiAoc2hvd1NlbGVjdCAmJiB0aGlzLnNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgICBhcmdTdHJpbmdzW2ldID0gXCJ7XFxcXGNvbG9ye2JsdWV9XCIgKyBhcmdTdHJpbmdzW2ldICsgXCJ9XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoKHRoaXMubmFtZSkge1xuICAgICAgICAgICAgY2FzZSAnc2luJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXHNpbic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjb3MnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcY29zJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3Rhbic6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFx0YW4nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY3NjJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGNzYyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzZWMnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcc2VjJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2NvdCc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxjb3QnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYXJjc2luJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXHNpbl57LTF9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FyY2Nvcyc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxjb3Neey0xfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcmN0YW4nOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcdGFuXnstMX0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYXJjY3NjJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGNzY157LTF9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FyY3NlYyc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxzZWNeey0xfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcmNjb3QnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcY290XnstMX0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc3FydCc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxtYXRocm17c3FydH0nO1xuICAgICAgICAgICAgICAgIHRleFN0cmluZyA9ICdcXFxcc3FydHsnICsgYXJnU3RyaW5nc1swXSArICd9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3Jvb3QnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcbWF0aHJte3Jvb3R9JztcbiAgICAgICAgICAgICAgICB0ZXhTdHJpbmcgPSAnXFxcXHNxcnRbJyArIGFyZ1N0cmluZ3NbMV0gKyddeycgKyBhcmdTdHJpbmdzWzBdICsgJ30nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYWJzJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGFicyc7XG4gICAgICAgICAgICAgICAgdGV4U3RyaW5nID0gJ1xcXFxsZWZ0fCcgKyBhcmdTdHJpbmdzWzBdICsgJ1xcXFxyaWdodHwnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZXhwJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnZV4nO1xuICAgICAgICAgICAgICAgIHRleFN0cmluZyA9ICdlXnsnICsgYXJnU3RyaW5nc1swXSArICd9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2V4cGInOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcZXhwJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2xuJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGxuJ1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbG9nMTAnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcbG9nX3sxMH0nXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm5hbWUubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXG1hdGhybXsnICsgdGhpcy5uYW1lICsgJ30nO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZjblN0cmluZyA9IHRoaXMubmFtZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZGVyaXZzID4gMCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZGVyaXZzIDw9IDMpIHtcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSBmY25TdHJpbmcgKyBcIidcIi5yZXBlYXQodGhpcy5kZXJpdnMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSBmY25TdHJpbmcgKyBcIl57KFwiK3RoaXMuZGVyaXZzK1wiKX1cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaG93U2VsZWN0ICYmIHRoaXMuc2VsZWN0KSB7XG4gICAgICAgICAgICBmY25TdHJpbmcgPSBcIlxcXFxjb2xvcntyZWR9e1wiICsgZmNuU3RyaW5nICsgXCJ9XCI7XG4gICAgICAgICAgICB0ZXhTdHJpbmcgPSAnJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGV4U3RyaW5nID09ICcnKSB7XG4gICAgICAgICAgICB0ZXhTdHJpbmcgPSBmY25TdHJpbmcgKyAnIFxcXFxtYXRob3Blbnt9XFxcXGxlZnQoJyArIGFyZ1N0cmluZ3Muam9pbignLCcpICsgJ1xcXFxyaWdodClcXFxcbWF0aGNsb3Nle30nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybih0ZXhTdHJpbmcpO1xuICAgIH1cblxuICAgIHRvTWF0aE1MKCkge1xuICAgICAgICB2YXIgdGV4U3RyaW5nO1xuICAgICAgICB2YXIgYXJnU3RyaW5nO1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaW5wdXRzWzBdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBhcmdTdHJpbmcgPSAnPyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcmdTdHJpbmcgPSB0aGlzLmlucHV0c1swXS50b01hdGhNTCgpO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCh0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3Npbic6XG4gICAgICAgICAgICBjYXNlICdjb3MnOlxuICAgICAgICAgICAgY2FzZSAndGFuJzpcbiAgICAgICAgICAgIGNhc2UgJ2NzYyc6XG4gICAgICAgICAgICBjYXNlICdzZWMnOlxuICAgICAgICAgICAgY2FzZSAnY290JzpcbiAgICAgICAgICAgIGNhc2UgJ2FyY3Npbic6XG4gICAgICAgICAgICBjYXNlICdhcmNjb3MnOlxuICAgICAgICAgICAgY2FzZSAnYXJjdGFuJzpcbiAgICAgICAgICAgIGNhc2UgJ2V4cCc6XG4gICAgICAgICAgICBjYXNlICdleHBiJzpcbiAgICAgICAgICAgIGNhc2UgJ2xuJzpcbiAgICAgICAgICAgIGNhc2UgJ2Ficyc6XG4gICAgICAgICAgICAgICAgdGV4U3RyaW5nID0gJzxhcHBseT48JyArIHRoaXMubmFtZSArICcvPicgKyBhcmdTdHJpbmcgKyAnPC9hcHBseT4nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc3FydCc6XG4gICAgICAgICAgICAgICAgdGV4U3RyaW5nID0gJzxhcHBseT48cm9vdC8+JyArIGFyZ1N0cmluZyArICc8L2FwcGx5Pic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdsb2cxMCc6XG4gICAgICAgICAgICAgICAgdGV4U3RyaW5nID0gJzxhcHBseT48bG9nLz48bG9nYmFzZT48Y24+MTA8L2NuPjwvbG9nYmFzZT4nICsgYXJnU3RyaW5nICsgJzwvYXBwbHk+JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGV4U3RyaW5nID0gJzxhcHBseT48Y2k+JyArIG5hbWUgKyAnPC9jaT4nICsgYXJnU3RyaW5nICsgJzwvYXBwbHk+JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4odGV4U3RyaW5nKTtcbiAgICB9XG5cbiAgICBvcGVyYXRlVG9UZVgoKSB7XG4gICAgICAgIHZhciBmY25TdHJpbmc7XG4gICAgICAgIHN3aXRjaCh0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3Npbic6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxzaW4nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY29zJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGNvcyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd0YW4nOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcdGFuJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2NzYyc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxjc2MnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc2VjJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXHNlYyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjb3QnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcY290JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FyY3Npbic6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxzaW5eey0xfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcmNjb3MnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcY29zXnstMX0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYXJjdGFuJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXHRhbl57LTF9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FyY2NzYyc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxjc2Neey0xfSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcmNzZWMnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcc2VjXnstMX0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYXJjY290JzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGNvdF57LTF9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3NxcnQnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcbWF0aHJte3NxcnR9JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Ficyc6XG4gICAgICAgICAgICAgICAgZmNuU3RyaW5nID0gJ1xcXFxhYnMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZXhwJzpcbiAgICAgICAgICAgIGNhc2UgJ2V4cGInOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcZXhwJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2xuJzpcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXGxuJ1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbG9nMTAnOlxuICAgICAgICAgICAgICAgIGZjblN0cmluZyA9ICdcXFxcbG9nX3sxMH0nXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm5hbWUubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSAnXFxcXG1hdGhybXsnICsgdGhpcy5uYW1lICsgJ30nO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZjblN0cmluZyA9IHRoaXMubmFtZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZGVyaXZzID4gMCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZGVyaXZzIDw9IDMpIHtcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSBmY25TdHJpbmcgKyBcIidcIi5yZXBlYXQodGhpcy5kZXJpdnMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmY25TdHJpbmcgPSBmY25TdHJpbmcgKyBcIl57KFwiK3RoaXMuZGVyaXZzK1wiKX1cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihmY25TdHJpbmcrXCIoXFxcXEJveClcIik7XG4gICAgfVxuXG4gICAgZXZhbHVhdGUoYmluZGluZ3MpIHtcbiAgICAgICAgdmFyIGlucHV0VmFsID0gdGhpcy5pbnB1dHNbMF0uZXZhbHVhdGUoYmluZGluZ3MpO1xuICAgICAgICB2YXIgcmV0VmFsID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIGlmIChpbnB1dFZhbCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybih1bmRlZmluZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQnVpbHQtaW4gZnVuY3Rpb25zIHdpdGggZGVyaXZhdGl2ZXMgaGF2ZSBjb21wdXRlZCBkZXJpdmF0aXZlIGVhcmxpZXIuXG4gICAgICAgIGlmICh0aGlzLmJ1aWx0aW4gJiYgdGhpcy5kZXJpdnMgPiAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hbHRlcm5hdGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gdGhpcy5hbHRlcm5hdGUuZXZhbHVhdGUoYmluZGluZ3MpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBCdWlsdC1pbiBmdW5jdGlvbiBjYWxsZWQgd2l0aCB1bnNwZWNpZmllZCBkZXJpdmF0aXZlIGZvcm11bGEuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGJpbmRpbmdzW3RoaXMubmFtZV0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgdGhlIGxpc3Qgb2YgY29tbW9uIG1hdGhlbWF0aWNhbCBmdW5jdGlvbnMuXG4gICAgICAgICAgICAgICAgc3dpdGNoKHRoaXMubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdzaW4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5zaW4oaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Nvcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLmNvcyhpbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndGFuJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGgudGFuKGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdjc2MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gMS9NYXRoLnNpbihpbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc2VjJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IDEvTWF0aC5jb3MoaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NvdCc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSAxL01hdGgudGFuKGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhcmNzaW4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGlucHV0VmFsKSA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5hc2luKGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhcmNjb3MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGlucHV0VmFsKSA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5hY29zKGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhcmN0YW4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5hdGFuKGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhcmNjc2MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGlucHV0VmFsKSA+PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5hc2luKDEvaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FyY3NlYyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoaW5wdXRWYWwpID49IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLmFjb3MoMS9pbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJjY290JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dFZhbCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5QSS8yO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLlBJLzIgLSBNYXRoLmF0YW4oMS9pbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc3FydCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXRWYWwgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGguc3FydChpbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYWJzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGguYWJzKGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdleHAnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdleHBiJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE1hdGguZXhwKGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdsbic6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXRWYWwgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5sb2coaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2xvZzEwJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dFZhbCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLkxPRzEwRSAqIE1hdGgubG9nKGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2VlIGlmIHdlIGhhdmUgYWxyZWFkeSB1c2VkIHRoaXMgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3IgY29uc2lzdGVuY3ksIHdlIHNob3VsZCBrZWVwIGl0IHRoZSBzYW1lLlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uRW50cnkgPSB0aGlzLmJ0bS5yYW5kb21CaW5kaW5nc1t0aGlzLm5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgbmV2ZXIgdXNlZCBwcmV2aW91c2x5LCBnZW5lcmF0ZSBhIHJhbmRvbSBmdW5jdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgd2lsbCBhbGxvdyB2YWxpZCBjb21wYXJpc29ucyB0byBvY2N1ci5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmdW5jdGlvbkVudHJ5ID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3I6IEEgY3VzdG9tIGZ1bmN0aW9uIG5ldmVyIGhhZCBhIGJhY2tlbmQgZGVmaW5pdGlvbi5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDb3B5IHRoZSBiaW5kaW5ncy5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmQmluZCA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoYmluZGluZ3MpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZkJpbmRbIGtleSBdID0gYmluZGluZ3NbIGtleSBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBOb3csIHVzZSB0aGUgdmFyaWFibGUgb2YgdGhlIGZ1bmN0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAgZkJpbmRbZnVuY3Rpb25FbnRyeVtcImlucHV0XCJdXSA9IGlucHV0VmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2VlIGlmIHdlIG5lZWQgYWRkaXRpb25hbCBkZXJpdmF0aXZlcyBpbiBiaW5kaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZXJpdnMgPj0gZnVuY3Rpb25FbnRyeVtcInZhbHVlXCJdLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdmFyID0gbmV3IHZhcmlhYmxlX2V4cHIodGhpcy5idG0sIGZ1bmN0aW9uRW50cnlbXCJpbnB1dFwiXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhckJpbmQgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJCaW5kW2l2YXJdID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpPWZ1bmN0aW9uRW50cnlbXCJ2YWx1ZVwiXS5sZW5ndGg7IGkgPD0gdGhpcy5kZXJpdnM7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbkVudHJ5W1widmFsdWVcIl1baV0gPSBmdW5jdGlvbkVudHJ5W1widmFsdWVcIl1baS0xXS5kZXJpdmF0aXZlKGl2YXIsIHZhckJpbmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IGZ1bmN0aW9uRW50cnlbXCJ2YWx1ZVwiXVt0aGlzLmRlcml2c10uZXZhbHVhdGUoZkJpbmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZnVuY3Rpb25FbnRyeSA9IGJpbmRpbmdzW3RoaXMubmFtZV07XG4gICAgICAgICAgICAgICAgLy8gQ29weSB0aGUgYmluZGluZ3MuXG4gICAgICAgICAgICAgICAgdmFyIGZCaW5kID0ge307XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoYmluZGluZ3MpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGZCaW5kWyBrZXkgXSA9IGJpbmRpbmdzWyBrZXkgXTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvLyBOb3csIHVzZSB0aGUgdmFyaWFibGUgb2YgdGhlIGZ1bmN0aW9uLlxuICAgICAgICAgICAgICAgIGZCaW5kW2Z1bmN0aW9uRW50cnlbXCJpbnB1dFwiXV0gPSBpbnB1dFZhbDtcbiAgICAgICAgICAgICAgICAvLyBTZWUgaWYgd2UgbmVlZCBhZGRpdGlvbmFsIGRlcml2YXRpdmVzIGluIGJpbmRpbmdcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kZXJpdnMgPj0gZnVuY3Rpb25FbnRyeVtcInZhbHVlXCJdLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXZhciA9IG5ldyB2YXJpYWJsZV9leHByKHRoaXMuYnRtLCBmdW5jdGlvbkVudHJ5W1wiaW5wdXRcIl0pO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmFyQmluZCA9IHt9O1xuICAgICAgICAgICAgICAgICAgICB2YXJCaW5kW2l2YXJdID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaT1mdW5jdGlvbkVudHJ5W1widmFsdWVcIl0ubGVuZ3RoOyBpIDw9IHRoaXMuZGVyaXZzOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uRW50cnlbXCJ2YWx1ZVwiXVtpXSA9IGZ1bmN0aW9uRW50cnlbXCJ2YWx1ZVwiXVtpLTFdLmRlcml2YXRpdmUoaXZhciwgdmFyQmluZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gZnVuY3Rpb25FbnRyeVtcInZhbHVlXCJdW3RoaXMuZGVyaXZzXS5ldmFsdWF0ZShmQmluZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHJldFZhbCk7XG4gICAgfVxuXG4gICAgZmxhdHRlbigpIHtcbiAgICAgICAgcmV0dXJuKG5ldyBmdW5jdGlvbl9leHByKHRoaXMuYnRtLCB0aGlzLmdldE5hbWUoKSwgdGhpcy5pbnB1dHNbMF0uZmxhdHRlbigpKSk7XG4gICAgfVxuXG4gICAgY29weSgpIHtcbiAgICAgIHJldHVybihuZXcgZnVuY3Rpb25fZXhwcih0aGlzLmJ0bSwgdGhpcy5nZXROYW1lKCksIHRoaXMuaW5wdXRzWzBdLmNvcHkoKSkpO1xuICAgIH1cblxuICAgIGNvbXBvc2UoYmluZGluZ3MpIHtcbiAgICAgICAgcmV0dXJuKG5ldyBmdW5jdGlvbl9leHByKHRoaXMuYnRtLCB0aGlzLmdldE5hbWUoKSwgdGhpcy5pbnB1dHNbMF0uY29tcG9zZShiaW5kaW5ncykpKTtcbiAgICB9XG5cbiAgICBkZXJpdmF0aXZlKGl2YXIsIHZhckxpc3QpIHtcbiAgICAgICAgdmFyIHRoZURlcml2O1xuICAgICAgICB2YXIgZGVwQXJyYXkgPSB0aGlzLmlucHV0c1swXS5kZXBlbmRlbmNpZXMoKTtcbiAgICAgICAgdmFyIHVDb25zdCA9IHRydWU7XG4gICAgICAgIHZhciBpdmFyTmFtZSA9ICh0eXBlb2YgaXZhciA9PSAnc3RyaW5nJykgPyBpdmFyIDogaXZhci5uYW1lO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8ZGVwQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChkZXBBcnJheVtpXSA9PSBpdmFyTmFtZSkge1xuICAgICAgICAgICAgICAgIHVDb25zdCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHVDb25zdCkge1xuICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGR5ZHU7XG5cbiAgICAgICAgICAgIHN3aXRjaCh0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc2luJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLmJ0bSwgJ2NvcycsIHRoaXMuaW5wdXRzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdjb3MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyB1bm9wX2V4cHIodGhpcy5idG0sICctJywgbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5idG0sICdzaW4nLCB0aGlzLmlucHV0c1swXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Rhbic6XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlU2VjID0gbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5idG0sICdzZWMnLCB0aGlzLmlucHV0c1swXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICdeJywgdGhlU2VjLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdjc2MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZUNvdCA9IG5ldyBmdW5jdGlvbl9leHByKHRoaXMuYnRtLCAnY290JywgdGhpcy5pbnB1dHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyB1bm9wX2V4cHIodGhpcy5idG0sICctJywgbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcqJywgdGhpcywgdGhlQ290KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc2VjJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGVUYW4gPSBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLmJ0bSwgJ3RhbicsIHRoaXMuaW5wdXRzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJyonLCB0aGlzLCB0aGVUYW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NvdCc6XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlQ3NjID0gbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5idG0sICdjc2MnLCB0aGlzLmlucHV0c1swXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IHVub3BfZXhwcih0aGlzLmJ0bSwgJy0nLCBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJ14nLCB0aGVDc2MsIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMikpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhcmNzaW4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZUNvcyA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnLScsIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMSksIG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnXicsIHRoaXMuaW5wdXRzWzBdLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDIpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcvJywgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAxKSwgbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5idG0sICdzcXJ0JywgdGhlQ29zKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJjY29zJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGVTaW4gPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJy0nLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDEpLCBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJ14nLCB0aGlzLmlucHV0c1swXSwgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAyKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnLycsIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgLTEpLCBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLmJ0bSwgJ3NxcnQnLCB0aGVTaW4pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhcmN0YW4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRhblNxID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICdeJywgdGhpcy5pbnB1dHNbMF0sIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnLycsIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMSksIG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnKycsIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMSksIHRhblNxKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJjc2VjJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGVTcSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnXicsIHRoaXMuaW5wdXRzWzBdLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGVSYWQgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJy0nLCB0aGVTcSwgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAxKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcvJywgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAxKSwgbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcqJywgbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5idG0sICdhYnMnLCB0aGlzLmlucHV0c1swXSksIG5ldyBmdW5jdGlvbl9leHByKHRoaXMuYnRtLCAnc3FydCcsIHRoZVJhZCkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhcmNjc2MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZVNxID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICdeJywgdGhpcy5pbnB1dHNbMF0sIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZVJhZCA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnLScsIHRoZVNxLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJy8nLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIC0xKSwgbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcqJywgbmV3IGZ1bmN0aW9uX2V4cHIodGhpcy5idG0sICdhYnMnLCB0aGlzLmlucHV0c1swXSksIG5ldyBmdW5jdGlvbl9leHByKHRoaXMuYnRtLCAnc3FydCcsIHRoZVJhZCkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhcmNjb3QnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvdFNxID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICdeJywgdGhpcy5pbnB1dHNbMF0sIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnLycsIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgLTEpLCBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJysnLCBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDEpLCBjb3RTcSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3NxcnQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnLycsIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMSksIG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnKicsIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMiksIHRoaXMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhYnMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnLycsIHRoaXMsIHRoaXMuaW5wdXRzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdleHAnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdleHBiJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5ZHUgPSBuZXcgZnVuY3Rpb25fZXhwcih0aGlzLmJ0bSwgdGhpcy5uYW1lLCB0aGlzLmlucHV0c1swXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbG4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnLycsIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMSksIHRoaXMuaW5wdXRzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdsb2cxMCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBkeWR1ID0gbmV3IGJpbm9wX2V4cHIodGhpcy5idG0sICcvJywgbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCBNYXRoLkxPRzEwRSksIHRoaXMuaW5wdXRzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgZHlkdSA9IG5ldyBmdW5jdGlvbl9leHByKHRoaXMuYnRtLCB0aGlzLmdldE5hbWUoKStcIidcIiwgdGhpcy5pbnB1dHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXVDb25zdCAmJiB0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLnZhcmlhYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhlRGVyaXYgPSBkeWR1O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZHVkeCA9IHRoaXMuaW5wdXRzWzBdLmRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZHVkeCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJyonLCBkeWR1LCBkdWR4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHRoZURlcml2KTtcbiAgICB9XG59IiwiLyohXG4gKiBCVE0gSmF2YVNjcmlwdCBMaWJyYXJ5IHZAVkVSU0lPTlxuICogaHR0cHM6Ly9naXRodWIuY29tL2RicmlhbndhbHRvbi9CVE1cbiAqXG4gKiBDb3B5cmlnaHQgRC4gQnJpYW4gV2FsdG9uXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUKVxuICpcbiAqIERhdGU6IEBEQVRFXG4gKi9cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIERlZmluZSB0aGUgTXVsdGktT3BlcmFuZCBFeHByZXNzaW9uIChmb3Igc3VtIGFuZCBwcm9kdWN0KVxuKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuaW1wb3J0IHsgZXhwcmVzc2lvbiB9IGZyb20gXCIuL2V4cHJlc3Npb24uanNcIlxuaW1wb3J0IHsgc2NhbGFyX2V4cHIgfSBmcm9tIFwiLi9zY2FsYXJfZXhwci5qc1wiXG5pbXBvcnQgeyBleHByVHlwZSwgb3BQcmVjIH0gZnJvbSBcIi4vQlRNX3Jvb3QuanNcIlxuXG5leHBvcnQgY2xhc3MgbXVsdGlvcF9leHByIGV4dGVuZHMgZXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IoYnRtLCBvcCwgaW5wdXRzKSB7XG4gICAgICAgIHN1cGVyKGJ0bSk7XG4gICAgICAgIHRoaXMudHlwZSA9IGV4cHJUeXBlLm11bHRpb3A7XG4gICAgICAgIHRoaXMub3AgPSBvcDtcbiAgICAgICAgdGhpcy5pbnB1dHMgPSBpbnB1dHM7IC8vIGFuIGFycmF5XG4gICAgICAgIGZvciAodmFyIGkgaW4gaW5wdXRzKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0c1tpXSA9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgICAgICBpbnB1dHNbaV0gPSBuZXcgZXhwcmVzc2lvbih0aGlzLmJ0bSk7XG4gICAgICAgICAgICBpbnB1dHNbaV0ucGFyZW50ID0gdGhpcztcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKG9wKSB7XG4gICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICB0aGlzLnByZWMgPSBvcFByZWMuYWRkc3ViO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLm11bHRkaXY7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiVW5rbm93biBtdWx0aS1vcGVyYW5kIG9wZXJhdG9yOiAnXCIrb3ArXCInLlwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICB2YXIgdGhlU3RyLFxuICAgICAgICAgICAgb3BTdHIsXG4gICAgICAgICAgICBpc0Vycm9yID0gZmFsc2UsXG4gICAgICAgICAgICBzaG93T3A7XG5cbiAgICAgICAgdGhlU3RyID0gJyc7XG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgIHNob3dPcCA9IHRydWU7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuaW5wdXRzW2ldID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgb3BTdHIgPSAnPyc7XG4gICAgICAgICAgICAgICAgaXNFcnJvciA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9wU3RyID0gdGhpcy5pbnB1dHNbaV0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBpZiAoKHRoaXMuaW5wdXRzW2ldLnR5cGUgPj0gZXhwclR5cGUudW5vcFxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbaV0ucHJlYyA8PSB0aGlzLnByZWMpXG4gICAgICAgICAgICAgICAgICAgIHx8ICh0aGlzLmlucHV0c1tpXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbaV0ubnVtYmVyLnEgIT0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgb3BQcmVjLm11bHRkaXYgPD0gdGhpcy5wcmVjKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBvcFN0ciA9ICcoJyArIG9wU3RyICsgJyknO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoZVN0ciArPSAoIGk+MCA/IHRoaXMub3AgOiAnJyApICsgb3BTdHI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4odGhlU3RyKTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgdGVzdGVkIGVxdWl2YWxlbnQgc3RyaW5ncy5cbiAgICBhbGxTdHJpbmdFcXVpdnMoKSB7XG4gICAgICAgIHZhciBhbGxJbnB1dHNBcnJheXMgPSBbXTtcblxuICAgICAgICB2YXIgaW5kZXhMaXN0ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgIGFsbElucHV0c0FycmF5c1tpXSA9IHRoaXMuaW5wdXRzW2ldLmFsbFN0cmluZ0VxdWl2cygpO1xuICAgICAgICAgICAgaW5kZXhMaXN0LnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlucHV0UGVybXMgPSBwZXJtdXRhdGlvbnMoaW5kZXhMaXN0KTtcblxuICAgICAgICB2YXIgcmV0VmFsdWUgPSBbXTtcblxuICAgICAgICB2YXIgdGhlT3AgPSB0aGlzLm9wO1xuICAgICAgICBpZiAodGhlT3AgPT0gJ3wnKSB7XG4gICAgICAgICAgICAvLyBEb24ndCB3YW50IFwib3JcIiB0byBiZSB0cmFuc2xhdGVkIGFzIGFic29sdXRlIHZhbHVlXG4gICAgICAgICAgICB0aGVPcCA9ICcgJCAnO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYnVpbGRTdHJpbmdFcXVpdnMoaW5kZXhMaXN0LCBsZWZ0U3RyKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGxlZnRTdHIgPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIGxlZnRTdHIgPSBcIlwiO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbmRleExpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGxlZnRTdHIgKz0gdGhlT3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5kZXhMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgd29ya0lucHV0cyA9IGFsbElucHV0c0FycmF5c1tpbmRleExpc3RbMF1dO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gd29ya0lucHV0cykge1xuICAgICAgICAgICAgICAgICAgICBidWlsZFN0cmluZ0VxdWl2cyhpbmRleExpc3Quc2xpY2UoMSksIGxlZnRTdHIgKyBcIihcIiArIHdvcmtJbnB1dHNbaV0gKyBcIilcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXRWYWx1ZS5wdXNoKGxlZnRTdHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSBpbiBpbnB1dFBlcm1zKSB7XG4gICAgICAgICAgICBidWlsZFN0cmluZ0VxdWl2cyhpbnB1dFBlcm1zW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxuXG4gICAgdG9UZVgoc2hvd1NlbGVjdCkge1xuICAgICAgICB2YXIgdGhlU3RyO1xuICAgICAgICB2YXIgdGhlT3A7XG4gICAgICAgIHZhciBvcFN0cjtcbiAgICAgICAgdmFyIGFyZ1N0ckwsIGFyZ1N0clIsIG9wU3RyTCwgb3BTdHJSO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygc2hvd1NlbGVjdCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgc2hvd1NlbGVjdCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhlT3AgPSB0aGlzLm9wO1xuICAgICAgICBpZiAodGhpcy5vcCA9PSAnKicpIHtcbiAgICAgICAgICAgIGlmIChzaG93U2VsZWN0ICYmIHRoaXMuc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgdGhlT3AgPSAnXFxcXHRpbWVzJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhlT3AgPSAnICc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2hvd1NlbGVjdCAmJiB0aGlzLnNlbGVjdCkge1xuICAgICAgICAgICAgYXJnU3RyTCA9ICd7XFxcXGNvbG9ye2JsdWV9JztcbiAgICAgICAgICAgIGFyZ1N0clIgPSAnfSc7XG4gICAgICAgICAgICBvcFN0ckwgPSAne1xcXFxjb2xvcntyZWR9JztcbiAgICAgICAgICAgIG9wU3RyUiA9ICd9JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyZ1N0ckwgPSAnJztcbiAgICAgICAgICAgIGFyZ1N0clIgPSAnJztcbiAgICAgICAgICAgIG9wU3RyTCA9ICcnO1xuICAgICAgICAgICAgb3BTdHJSID0gJyc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGVTdHIgPSAnJztcbiAgICAgICAgdmFyIG1pblByZWMgPSB0aGlzLnByZWM7XG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dHNbaV0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBvcFN0ciA9ICc/JztcbiAgICAgICAgICAgICAgICB0aGVTdHIgKz0gKCBpPjAgPyBvcFN0ckwgKyB0aGVPcCArIG9wU3RyUiA6ICcnICkgKyBvcFN0cjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3AgPT0gJyonXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1tpXS50eXBlID09IGV4cHJUeXBlLnVub3AgJiYgdGhpcy5pbnB1dHNbaV0ub3AgPT0gJy8nXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiAhKHNob3dTZWxlY3QgJiYgdGhpcy5zZWxlY3QpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3BTdHIgPSBhcmdTdHJMICsgdGhpcy5pbnB1dHNbaV0uaW5wdXRzWzBdLnRvVGVYKHNob3dTZWxlY3QpICsgYXJnU3RyUjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzW2ldLmlucHV0c1swXS50eXBlID49IGV4cHJUeXBlLnVub3AgJiYgdGhpcy5pbnB1dHNbaV0uaW5wdXRzWzBdLnByZWMgPCBtaW5QcmVjKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcFN0ciA9ICdcXFxcbGVmdCgnICsgb3BTdHIgKyAnXFxcXHJpZ2h0KSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoZVN0ciA9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlU3RyID0gJzEnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhlU3RyID0gJ1xcXFxmcmFjeycgKyB0aGVTdHIgKyAnfXsnICsgb3BTdHIgKyAnfSc7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3AgPT0gJysnXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmlucHV0c1tpXS50eXBlID09IGV4cHJUeXBlLnVub3AgJiYgdGhpcy5pbnB1dHNbaV0ub3AgPT0gJy0nXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiAhKHNob3dTZWxlY3QgJiYgdGhpcy5zZWxlY3QpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3BTdHIgPSBhcmdTdHJMICsgdGhpcy5pbnB1dHNbaV0udG9UZVgoc2hvd1NlbGVjdCkgKyBhcmdTdHJSO1xuICAgICAgICAgICAgICAgICAgICB0aGVTdHIgKz0gb3BTdHI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3BTdHIgPSBhcmdTdHJMICsgdGhpcy5pbnB1dHNbaV0udG9UZVgoc2hvd1NlbGVjdCkgKyBhcmdTdHJSO1xuICAgICAgICAgICAgICAgICAgICBpZiAoKHRoaXMuaW5wdXRzW2ldLnR5cGUgPj0gZXhwclR5cGUudW5vcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaW5wdXRzW2ldLnByZWMgPD0gbWluUHJlYylcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8IChpPjAgJiYgdGhpcy5vcCA9PSAnKicgJiYgdGhpcy5pbnB1dHNbaV0udHlwZSA9PSBleHByVHlwZS5udW1iZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcFN0ciA9ICdcXFxcbGVmdCgnICsgb3BTdHIgKyAnXFxcXHJpZ2h0KSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhlU3RyICs9ICggaT4wID8gb3BTdHJMICsgdGhlT3AgKyBvcFN0clIgOiAnJyApICsgb3BTdHI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKHRoZVN0cik7XG4gICAgfVxuXG4gICAgdG9NYXRoTUwoKSB7XG4gICAgICAgIHZhciB0aGVTdHI7XG4gICAgICAgIHZhciB0aGVPcDtcbiAgICAgICAgdmFyIG9wU3RyO1xuXG4gICAgICAgIHN3aXRjaCAodGhpcy5vcCkge1xuICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgdGhlT3AgPSBcIjxwbHVzLz5cIlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgdGhlT3AgPSBcIjx0aW1lcy8+XCJcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoZVN0ciA9IFwiPGFwcGx5PlwiICsgdGhlT3A7XG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dHNbaV0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBvcFN0ciA9ICc/JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3BTdHIgPSB0aGlzLmlucHV0c1tpXS50b01hdGhNTCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhlU3RyICs9IG9wU3RyO1xuICAgICAgICB9XG4gICAgICAgIHRoZVN0ciArPSBcIjwvYXBwbHk+XCI7XG5cbiAgICAgICAgcmV0dXJuKHRoZVN0cik7XG4gICAgfVxuXG4gICAgb3BlcmF0ZVRvVGVYKCkge1xuICAgICAgICB2YXIgb3BTdHJpbmcgPSB0aGlzLm9wO1xuXG4gICAgICAgIHN3aXRjaCAob3BTdHJpbmcpIHtcbiAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgIG9wU3RyaW5nID0gJ1xcXFx0aW1lcyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ob3BTdHJpbmcpO1xuICAgIH1cblxuICAgIGlzQ29tbXV0YXRpdmUoKSB7XG4gICAgICAgIHZhciBjb21tdXRlcyA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5vcCA9PT0gJysnIHx8IHRoaXMub3AgPT09ICcqJykge1xuICAgICAgICAgICAgY29tbXV0ZXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihjb21tdXRlcyk7XG4gICAgfVxuXG4gICAgZXZhbHVhdGUoYmluZGluZ3MpIHtcbiAgICAgICAgdmFyIGlucHV0VmFsO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIHJldFZhbDtcblxuICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgIHJldFZhbCA9IDA7XG4gICAgICAgICAgICAgICAgZm9yIChpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0VmFsID0gdGhpcy5pbnB1dHNbaV0uZXZhbHVhdGUoYmluZGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICByZXRWYWwgKz0gaW5wdXRWYWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gMTtcbiAgICAgICAgICAgICAgICBmb3IgKGkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWwgPSB0aGlzLmlucHV0c1tpXS5ldmFsdWF0ZShiaW5kaW5ncyk7XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCAqPSBpbnB1dFZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIGJpbmFyeSBvcGVyYXRvciAnXCIgKyB0aGlzLm9wICsgXCInIGlzIG5vdCBkZWZpbmVkLlwiKTtcbiAgICAgICAgICAgICAgICByZXRWYWwgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHJldFZhbCk7XG4gICAgfVxuXG4gICAgLy8gRmxhdHRlbiBhbmQgYWxzbyBzb3J0IHRlcm1zLlxuICAgIGZsYXR0ZW4oKSB7XG4gICAgICAgIHZhciBuZXdJbnB1dHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgdmFyIG5leHRJbnB1dCA9IHRoaXMuaW5wdXRzW2ldLmZsYXR0ZW4oKTtcbiAgICAgICAgICAgIGlmIChuZXh0SW5wdXQudHlwZSA9PSBleHByVHlwZS5tdWx0aW9wICYmIG5leHRJbnB1dC5vcCA9PSB0aGlzLm9wKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBuZXh0SW5wdXQuaW5wdXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0lucHV0cy5wdXNoKG5leHRJbnB1dC5pbnB1dHNbal0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3SW5wdXRzLnB1c2gobmV4dElucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXRWYWx1ZTtcbiAgICAgICAgaWYgKG5ld0lucHV0cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgLy8gQWRkaW5nIG5vIGVsZW1lbnRzID0gMFxuICAgICAgICAgICAgLy8gTXVsdGlwbHlpbmcgbm8gZWxlbWVudHMgPSAxXG4gICAgICAgICAgICByZXRWYWx1ZSA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgdGhpcy5vcCA9PSAnKycgPyAwIDogMSk7XG4gICAgICAgIH0gZWxzZSBpZiAobmV3SW5wdXRzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICByZXRWYWx1ZSA9IG5ld0lucHV0c1swXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFNvcnQgdGhlIGlucHV0cyBieSBwcmVjZWRlbmNlIGZvciBwcm9kdWN0c1xuICAgICAgICAgICAgLy8gVXN1YWxseSB2ZXJ5IHNtYWxsLCBzbyBidWJibGUgc29ydCBpcyBnb29kIGVub3VnaFxuICAgICAgICAgICAgaWYgKHRoaXMub3A9PScqJykge1xuICAgICAgICAgICAgICAgIHZhciB0bXA7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPG5ld0lucHV0cy5sZW5ndGgtMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGo9aSsxOyBqPG5ld0lucHV0cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld0lucHV0c1tpXS50eXBlID4gbmV3SW5wdXRzW2pdLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bXAgPSBuZXdJbnB1dHNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SW5wdXRzW2ldID0gbmV3SW5wdXRzW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0lucHV0c1tqXSA9IHRtcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldFZhbHVlID0gbmV3IG11bHRpb3BfZXhwcih0aGlzLmJ0bSwgdGhpcy5vcCwgbmV3SW5wdXRzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ocmV0VmFsdWUpO1xuICAgIH1cblxuICAgIC8vIFNlZSBpZiB0aGlzIG9wZXJhdG9yIGlzIG5vdyByZWR1bmRhbnQuXG4gICAgLy8gUmV0dXJuIHRoZSByZXN1bHRpbmcgZXhwcmVzc2lvbi5cbiAgICByZWR1Y2UoKSB7XG4gICAgICAgIHZhciBuZXdFeHByID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMuaW5wdXRzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBTdW0gd2l0aCBubyBlbGVtZW50cyA9IDBcbiAgICAgICAgICAgICAgICAvLyBQcm9kdWN0IHdpdGggbm8gZWxlbWVudHMgPSAxXG4gICAgICAgICAgICAgICAgbmV3RXhwciA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgdGhpcy5vcCA9PSAnKycgPyAwIDogMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFN1bSBvciBwcm9kdWN0IHdpdGggb25lIGVsZW1lbnQgKmlzKiB0aGF0IGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgbmV3RXhwciA9IHRoaXMuaW5wdXRzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV3RXhwci5wYXJlbnQgPSB0aGlzLnBhcmVudDtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LmlucHV0U3Vic3QodGhpcywgbmV3RXhwcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKG5ld0V4cHIpO1xuICAgIH1cblxuICAgIHNpbXBsaWZ5Q29uc3RhbnRzKCkge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIGNvbnN0SW5kZXggPSBbXSxcbiAgICAgICAgICAgIG5ld0lucHV0cyA9IFtdO1xuICAgICAgICAvLyBTaW1wbGlmeSBhbGwgaW5wdXRzXG4gICAgICAgIC8vIE5vdGljZSB3aGljaCBpbnB1dHMgYXJlIHRoZW1zZWx2ZXMgY29uc3RhbnQgXG4gICAgICAgIGZvciAoaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgdGhpcy5pbnB1dHNbaV0gPSB0aGlzLmlucHV0c1tpXS5zaW1wbGlmeUNvbnN0YW50cygpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dHNbaV0ucGFyZW50ID0gdGhpcztcbiAgICAgICAgICAgIGlmICh0aGlzLmlucHV0c1tpXS50eXBlID09IGV4cHJUeXBlLm51bWJlcikge1xuICAgICAgICAgICAgICAgIGNvbnN0SW5kZXgucHVzaChpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3SW5wdXRzLnB1c2godGhpcy5pbnB1dHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRm9yIGFsbCBpbnB1dHMgdGhhdCBhcmUgY29uc3RhbnRzLCBncm91cCB0aGVtIHRvZ2V0aGVyIGFuZCBzaW1wbGlmeS5cbiAgICAgICAgdmFyIG5ld0V4cHIgPSB0aGlzO1xuICAgICAgICBpZiAoY29uc3RJbmRleC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICB2YXIgbmV3Q29uc3RhbnQgPSB0aGlzLmlucHV0c1tjb25zdEluZGV4WzBdXS5udW1iZXI7XG4gICAgICAgICAgICBmb3IgKGk9MTsgaTxjb25zdEluZGV4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q29uc3RhbnQgPSBuZXdDb25zdGFudC5hZGQodGhpcy5pbnB1dHNbY29uc3RJbmRleFtpXV0ubnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbnN0YW50ID0gbmV3Q29uc3RhbnQubXVsdGlwbHkodGhpcy5pbnB1dHNbY29uc3RJbmRleFtpXV0ubnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRm9yIGFkZGl0aW9uLCB0aGUgY29uc3RhbnQgZ29lcyB0byB0aGUgZW5kLlxuICAgICAgICAgICAgLy8gRm9yIG11bHRpcGxpY2F0aW9uLCB0aGUgY29uc3RhbnQgZ29lcyB0byB0aGUgYmVnaW5uaW5nLlxuICAgICAgICAgICAgdmFyIG5ld0lucHV0O1xuICAgICAgICAgICAgc3dpdGNoICh0aGlzLm9wKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgICAgIG5ld0lucHV0cy5wdXNoKG5ld0lucHV0ID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCBuZXdDb25zdGFudCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICAgICAgbmV3SW5wdXRzLnNwbGljZSgwLCAwLCBuZXdJbnB1dCA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgbmV3Q29uc3RhbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobmV3SW5wdXRzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgbmV3RXhwciA9IG5ld0lucHV0c1swXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3SW5wdXQucGFyZW50ID0gdGhpcztcbiAgICAgICAgICAgICAgICBuZXdFeHByID0gbmV3IG11bHRpb3BfZXhwcih0aGlzLmJ0bSwgdGhpcy5vcCwgbmV3SW5wdXRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4obmV3RXhwcik7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBjb21wYXJpc29uIHJvdXRpbmUgbmVlZHMgdG8gZGVhbCB3aXRoIHR3byBpc3N1ZXMuXG4gICAgLy8gKDEpIFRoZSBwYXNzZWQgZXhwcmVzc2lvbiBoYXMgbW9yZSBpbnB1dHMgdGhhbiB0aGlzIChpbiB3aGljaCBjYXNlIHdlIGdyb3VwIHRoZW0pXG4gICAgLy8gKDIpIFBvc3NpYmlsaXR5IG9mIGNvbW11dGluZyBtYWtlcyB0aGUgbWF0Y2ggd29yay5cbiAgICBtYXRjaChleHByLCBiaW5kaW5ncykge1xuICAgICAgICBmdW5jdGlvbiBjb3B5QmluZGluZ3MoYmluZGluZ3MpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciByZXRWYWx1ZSA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGJpbmRpbmdzKSB7XG4gICAgICAgICAgICAgICAgcmV0VmFsdWVba2V5XSA9IGJpbmRpbmdzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ocmV0VmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJldFZhbHVlID0gbnVsbCxcbiAgICAgICAgICAgIG4gPSB0aGlzLmlucHV0cy5sZW5ndGg7XG4gICAgICAgIGlmIChleHByLnR5cGUgPT0gZXhwclR5cGUubXVsdGlvcCAmJiB0aGlzLm9wID09IGV4cHIub3BcbiAgICAgICAgICAgICAgICAmJiBuIDw9IGV4cHIuaW5wdXRzLmxlbmd0aCkge1xuXG4gICAgICAgICAgICAvLyBNYXRjaCBvbiBmaXJzdCBuLTEgYW5kIGdyb3VwIHJlbWFpbmRlciBhdCBlbmQuXG4gICAgICAgICAgICB2YXIgY21wRXhwcixcbiAgICAgICAgICAgICAgICBjbXBJbnB1dHMgPSBbXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPG47IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpPChuLTEpIHx8IGV4cHIuaW5wdXRzLmxlbmd0aD09bikge1xuICAgICAgICAgICAgICAgICAgICBjbXBJbnB1dHNbaV0gPSB0aGlzLmJ0bS5wYXJzZShleHByLmlucHV0c1tpXS50b1N0cmluZygpLCBleHByLmlucHV0c1tpXS5jb250ZXh0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgY29waWVzIG9mIHRoZSBpbnB1dHNcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0lucHV0cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqPTA7IGo8PWV4cHIuaW5wdXRzLmxlbmd0aC1uOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0lucHV0c1tqXSA9IHRoaXMuYnRtLnBhcnNlKGV4cHIuaW5wdXRzW24rai0xXS50b1N0cmluZygpLCBleHByLmlucHV0c1tuK2otMV0uY29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY21wSW5wdXRzW2ldID0gbmV3IG11bHRpb3BfZXhwcih0aGlzLmJ0bSwgZXhwci5vcCwgbmV3SW5wdXRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjbXBFeHByID0gbmV3IG11bHRpb3BfZXhwcih0aGlzLmJ0bSwgZXhwci5vcCwgY21wSW5wdXRzKTtcblxuICAgICAgICAgICAgLy8gTm93IG1ha2UgdGhlIGNvbXBhcmlzb24uXG4gICAgICAgICAgICByZXRWYWx1ZSA9IGNvcHlCaW5kaW5ncyhiaW5kaW5ncyk7XG4gICAgICAgICAgICByZXRWYWx1ZSA9IGV4cHJlc3Npb24ucHJvdG90eXBlLm1hdGNoLmNhbGwodGhpcywgY21wRXhwciwgcmV0VmFsdWUpO1xuXG4gICAgICAgICAgICAvLyBJZiBzdGlsbCBmYWlsIHRvIG1hdGNoLCB0cnkgdGhlIHJldmVyc2UgZ3JvdXBpbmc6IG1hdGNoIG9uIGxhc3Qgbi0xIGFuZCBncm91cCBiZWdpbm5pbmcuXG4gICAgICAgICAgICBpZiAocmV0VmFsdWUgPT0gbnVsbCAmJiBuIDwgZXhwci5pbnB1dHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpZmYgPSBleHByLmlucHV0cy5sZW5ndGggLSBuO1xuICAgICAgICAgICAgICAgIGNtcElucHV0cyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPG47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaT09MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGNvcGllcyBvZiB0aGUgaW5wdXRzXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3SW5wdXRzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqPTA7IGo8PWRpZmY7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0lucHV0c1tqXSA9IHRoaXMuYnRtLnBhcnNlKGV4cHIuaW5wdXRzW2pdLnRvU3RyaW5nKCksIGV4cHIuaW5wdXRzW2pdLmNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY21wSW5wdXRzW2ldID0gbmV3IG11bHRpb3BfZXhwcih0aGlzLmJ0bSwgZXhwci5vcCwgbmV3SW5wdXRzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtcElucHV0c1tpXSA9IHRoaXMuYnRtLnBhcnNlKGV4cHIuaW5wdXRzW2RpZmYraV0udG9TdHJpbmcoKSwgZXhwci5pbnB1dHNbZGlmZitpXS5jb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjbXBFeHByID0gbmV3IG11bHRpb3BfZXhwcih0aGlzLmJ0bSwgZXhwci5vcCwgY21wSW5wdXRzKTtcblxuICAgICAgICAgICAgICAgIC8vIE5vdyBtYWtlIHRoZSBjb21wYXJpc29uLlxuICAgICAgICAgICAgICAgIHJldFZhbHVlID0gY29weUJpbmRpbmdzKGJpbmRpbmdzKTtcbiAgICAgICAgICAgICAgICByZXRWYWx1ZSA9IGV4cHJlc3Npb24ucHJvdG90eXBlLm1hdGNoLmNhbGwodGhpcywgY21wRXhwciwgcmV0VmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxuXG4gICAgY29tcG9zZShiaW5kaW5ncykge1xuICAgICAgICB2YXIgbmV3SW5wdXRzID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgbmV3SW5wdXRzLnB1c2godGhpcy5pbnB1dHNbaV0uY29tcG9zZShiaW5kaW5ncykpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJldFZhbHVlO1xuICAgICAgICBpZiAobmV3SW5wdXRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXRWYWx1ZSA9IG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgdGhpcy5vcCA9PSAnKycgPyAwIDogMSk7XG4gICAgICAgIH0gZWxzZSBpZiAobmV3SW5wdXRzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICByZXRWYWx1ZSA9IG5ld0lucHV0c1swXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldFZhbHVlID0gbmV3IG11bHRpb3BfZXhwcih0aGlzLmJ0bSwgdGhpcy5vcCwgbmV3SW5wdXRzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ocmV0VmFsdWUpO1xuICAgIH1cblxuICAgIGRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCkge1xuICAgICAgICB2YXIgZFRlcm1zID0gW107XG5cbiAgICAgICAgdmFyIHRoZURlcml2O1xuICAgICAgICB2YXIgaSwgZHVkeDtcbiAgICAgICAgZm9yIChpIGluIHRoaXMuaW5wdXRzKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaW5wdXRzW2ldLmlzQ29uc3RhbnQoKSkge1xuICAgICAgICAgICAgICAgIGR1ZHggPSB0aGlzLmlucHV0c1tpXS5kZXJpdmF0aXZlKGl2YXIsIHZhckxpc3QpO1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5vcCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGRUZXJtcy5wdXNoKGR1ZHgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRQcm9kVGVybXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaiBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpID09IGopIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZFByb2RUZXJtcy5wdXNoKGR1ZHgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRQcm9kVGVybXMucHVzaCh0aGlzLmlucHV0c1tqXS5jb21wb3NlKHt9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZFRlcm1zLnB1c2gobmV3IG11bHRpb3BfZXhwcih0aGlzLmJ0bSwgJyonLCBkUHJvZFRlcm1zKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRUZXJtcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDApO1xuICAgICAgICB9IGVsc2UgaWYgKGRUZXJtcy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgdGhlRGVyaXYgPSBkVGVybXNbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGVEZXJpdiA9IG5ldyBtdWx0aW9wX2V4cHIodGhpcy5idG0sICcrJywgZFRlcm1zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4odGhlRGVyaXYpO1xuICAgIH1cbn0iLCIvKiFcbiAqIEJUTSBKYXZhU2NyaXB0IExpYnJhcnkgdkBWRVJTSU9OXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGJyaWFud2FsdG9uL0JUTVxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG5pbXBvcnQgeyByYXRpb25hbF9udW1iZXIgfSBmcm9tIFwiLi9yYXRpb25hbF9udW1iZXIuanNcIlxuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qICAgIFJvdXRpbmVzIGZvciBkZWFsaW5nIHdpdGggcmFuZG9tIHZhbHVlc1xuKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbi8qIFRvIHVzZSBhIHNlZWRlZCBSTkcsIHdlIHJlbHkgb24gYW4gb3BlbiBzb3VyY2UgcHJvamVjdCBmb3IgdGhlIHVuZGVybHlpbmcgbWVjaGFuaWNzLiAqL1xuXG4vKi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmFsZWFQUk5HIDEuMVxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5odHRwczovL2dpdGh1Yi5jb20vbWFjbWNtZWFucy9hbGVhUFJORy9ibG9iL21hc3Rlci9hbGVhUFJORy0xLjEuanNcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuT3JpZ2luYWwgd29yayBjb3B5cmlnaHQgwqkgMjAxMCBKb2hhbm5lcyBCYWFnw7hlLCB1bmRlciBNSVQgbGljZW5zZVxuVGhpcyBpcyBhIGRlcml2YXRpdmUgd29yayBjb3B5cmlnaHQgKGMpIDIwMTctMjAyMCwgVy4gTWFjXCIgTWNNZWFucywgdW5kZXIgQlNEIGxpY2Vuc2UuXG5SZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXQgbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4xLiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4yLiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4zLiBOZWl0aGVyIHRoZSBuYW1lIG9mIHRoZSBjb3B5cmlnaHQgaG9sZGVyIG5vciB0aGUgbmFtZXMgb2YgaXRzIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXG5USElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIEhPTERFUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vKi9cbmZ1bmN0aW9uIGFsZWFQUk5HKCkge1xuICAgIHJldHVybiggZnVuY3Rpb24oIGFyZ3MgKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIGNvbnN0IHZlcnNpb24gPSAnYWxlYVBSTkcgMS4xLjAnO1xuXG4gICAgICAgIHZhciBzMFxuICAgICAgICAgICAgLCBzMVxuICAgICAgICAgICAgLCBzMlxuICAgICAgICAgICAgLCBjXG4gICAgICAgICAgICAsIHVpbnRhID0gbmV3IFVpbnQzMkFycmF5KCAzIClcbiAgICAgICAgICAgICwgaW5pdGlhbEFyZ3NcbiAgICAgICAgICAgICwgbWFzaHZlciA9ICcnXG4gICAgICAgIDtcblxuICAgICAgICAvKiBwcml2YXRlOiBpbml0aWFsaXplcyBnZW5lcmF0b3Igd2l0aCBzcGVjaWZpZWQgc2VlZCAqL1xuICAgICAgICBmdW5jdGlvbiBfaW5pdFN0YXRlKCBfaW50ZXJuYWxTZWVkICkge1xuICAgICAgICAgICAgdmFyIG1hc2ggPSBNYXNoKCk7XG5cbiAgICAgICAgICAgIC8vIGludGVybmFsIHN0YXRlIG9mIGdlbmVyYXRvclxuICAgICAgICAgICAgczAgPSBtYXNoKCAnICcgKTtcbiAgICAgICAgICAgIHMxID0gbWFzaCggJyAnICk7XG4gICAgICAgICAgICBzMiA9IG1hc2goICcgJyApO1xuXG4gICAgICAgICAgICBjID0gMTtcblxuICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBfaW50ZXJuYWxTZWVkLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgICAgIHMwIC09IG1hc2goIF9pbnRlcm5hbFNlZWRbIGkgXSApO1xuICAgICAgICAgICAgICAgIGlmKCBzMCA8IDAgKSB7IHMwICs9IDE7IH1cblxuICAgICAgICAgICAgICAgIHMxIC09IG1hc2goIF9pbnRlcm5hbFNlZWRbIGkgXSApO1xuICAgICAgICAgICAgICAgIGlmKCBzMSA8IDAgKSB7IHMxICs9IDE7IH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBzMiAtPSBtYXNoKCBfaW50ZXJuYWxTZWVkWyBpIF0gKTtcbiAgICAgICAgICAgICAgICBpZiggczIgPCAwICkgeyBzMiArPSAxOyB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hc2h2ZXIgPSBtYXNoLnZlcnNpb247XG5cbiAgICAgICAgICAgIG1hc2ggPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHByaXZhdGU6IGRlcGVuZGVudCBzdHJpbmcgaGFzaCBmdW5jdGlvbiAqL1xuICAgICAgICBmdW5jdGlvbiBNYXNoKCkge1xuICAgICAgICAgICAgdmFyIG4gPSA0MDIyODcxMTk3OyAvLyAweGVmYzgyNDlkXG5cbiAgICAgICAgICAgIHZhciBtYXNoID0gZnVuY3Rpb24oIGRhdGEgKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBjYWNoZSB0aGUgbGVuZ3RoXG4gICAgICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDAsIGwgPSBkYXRhLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcbiAgICAgICAgICAgICAgICAgICAgbiArPSBkYXRhLmNoYXJDb2RlQXQoIGkgKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHZhciBoID0gMC4wMjUxOTYwMzI4MjQxNjkzOCAqIG47XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBuICA9IGggPj4+IDA7XG4gICAgICAgICAgICAgICAgICAgIGggLT0gbjtcbiAgICAgICAgICAgICAgICAgICAgaCAqPSBuO1xuICAgICAgICAgICAgICAgICAgICBuICA9IGggPj4+IDA7XG4gICAgICAgICAgICAgICAgICAgIGggLT0gbjtcbiAgICAgICAgICAgICAgICAgICAgbiArPSBoICogNDI5NDk2NzI5NjsgLy8gMHgxMDAwMDAwMDAgICAgICAyXjMyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAoIG4gPj4+IDAgKSAqIDIuMzI4MzA2NDM2NTM4Njk2M2UtMTA7IC8vIDJeLTMyXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBtYXNoLnZlcnNpb24gPSAnTWFzaCAwLjknO1xuICAgICAgICAgICAgcmV0dXJuIG1hc2g7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvKiBwcml2YXRlOiBjaGVjayBpZiBudW1iZXIgaXMgaW50ZWdlciAqL1xuICAgICAgICBmdW5jdGlvbiBfaXNJbnRlZ2VyKCBfaW50ICkgeyBcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludCggX2ludCwgMTAgKSA9PT0gX2ludDsgXG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiByZXR1cm4gYSAzMi1iaXQgZnJhY3Rpb24gaW4gdGhlIHJhbmdlIFswLCAxXVxuICAgICAgICBUaGlzIGlzIHRoZSBtYWluIGZ1bmN0aW9uIHJldHVybmVkIHdoZW4gYWxlYVBSTkcgaXMgaW5zdGFudGlhdGVkXG4gICAgICAgICovXG4gICAgICAgIHZhciByYW5kb20gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0ID0gMjA5MTYzOSAqIHMwICsgYyAqIDIuMzI4MzA2NDM2NTM4Njk2M2UtMTA7IC8vIDJeLTMyXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHMwID0gczE7XG4gICAgICAgICAgICBzMSA9IHMyO1xuXG4gICAgICAgICAgICByZXR1cm4gczIgPSB0IC0gKCBjID0gdCB8IDAgKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHJldHVybiBhIDUzLWJpdCBmcmFjdGlvbiBpbiB0aGUgcmFuZ2UgWzAsIDFdICovXG4gICAgICAgIHJhbmRvbS5mcmFjdDUzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmFuZG9tKCkgKyAoIHJhbmRvbSgpICogMHgyMDAwMDAgIHwgMCApICogMS4xMTAyMjMwMjQ2MjUxNTY1ZS0xNjsgLy8gMl4tNTNcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHJldHVybiBhbiB1bnNpZ25lZCBpbnRlZ2VyIGluIHRoZSByYW5nZSBbMCwgMl4zMl0gKi9cbiAgICAgICAgcmFuZG9tLmludDMyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmFuZG9tKCkgKiAweDEwMDAwMDAwMDsgLy8gMl4zMlxuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogYWR2YW5jZSB0aGUgZ2VuZXJhdG9yIHRoZSBzcGVjaWZpZWQgYW1vdW50IG9mIGN5Y2xlcyAqL1xuICAgICAgICByYW5kb20uY3ljbGUgPSBmdW5jdGlvbiggX3J1biApIHtcbiAgICAgICAgICAgIF9ydW4gPSB0eXBlb2YgX3J1biA9PT0gJ3VuZGVmaW5lZCcgPyAxIDogK19ydW47XG4gICAgICAgICAgICBpZiggX3J1biA8IDEgKSB7IF9ydW4gPSAxOyB9XG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IF9ydW47IGkrKyApIHsgcmFuZG9tKCk7IH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHJldHVybiBpbmNsdXNpdmUgcmFuZ2UgKi9cbiAgICAgICAgcmFuZG9tLnJhbmdlID0gZnVuY3Rpb24oKSB7IFxuICAgICAgICAgICAgdmFyIGxvQm91bmRcbiAgICAgICAgICAgICAgICAsIGhpQm91bmRcbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYoIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgKSB7XG4gICAgICAgICAgICAgICAgbG9Cb3VuZCA9IDA7XG4gICAgICAgICAgICAgICAgaGlCb3VuZCA9IGFyZ3VtZW50c1sgMCBdO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvQm91bmQgPSBhcmd1bWVudHNbIDAgXTtcbiAgICAgICAgICAgICAgICBoaUJvdW5kID0gYXJndW1lbnRzWyAxIF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCBhcmd1bWVudHNbIDAgXSA+IGFyZ3VtZW50c1sgMSBdICkgeyBcbiAgICAgICAgICAgICAgICBsb0JvdW5kID0gYXJndW1lbnRzWyAxIF07XG4gICAgICAgICAgICAgICAgaGlCb3VuZCA9IGFyZ3VtZW50c1sgMCBdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyByZXR1cm4gaW50ZWdlclxuICAgICAgICAgICAgaWYoIF9pc0ludGVnZXIoIGxvQm91bmQgKSAmJiBfaXNJbnRlZ2VyKCBoaUJvdW5kICkgKSB7IFxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKCByYW5kb20oKSAqICggaGlCb3VuZCAtIGxvQm91bmQgKyAxICkgKSArIGxvQm91bmQ7IFxuXG4gICAgICAgICAgICAvLyByZXR1cm4gZmxvYXRcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJhbmRvbSgpICogKCBoaUJvdW5kIC0gbG9Cb3VuZCApICsgbG9Cb3VuZDsgXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiBpbml0aWFsaXplIGdlbmVyYXRvciB3aXRoIHRoZSBzZWVkIHZhbHVlcyB1c2VkIHVwb24gaW5zdGFudGlhdGlvbiAqL1xuICAgICAgICByYW5kb20ucmVzdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgX2luaXRTdGF0ZSggaW5pdGlhbEFyZ3MgKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHNlZWRpbmcgZnVuY3Rpb24gKi9cbiAgICAgICAgcmFuZG9tLnNlZWQgPSBmdW5jdGlvbigpIHsgXG4gICAgICAgICAgICBfaW5pdFN0YXRlKCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICkgKTtcbiAgICAgICAgfTsgXG5cbiAgICAgICAgLyogcHVibGljOiBzaG93IHRoZSB2ZXJzaW9uIG9mIHRoZSBSTkcgKi9cbiAgICAgICAgcmFuZG9tLnZlcnNpb24gPSBmdW5jdGlvbigpIHsgXG4gICAgICAgICAgICByZXR1cm4gdmVyc2lvbjtcbiAgICAgICAgfTsgXG5cbiAgICAgICAgLyogcHVibGljOiBzaG93IHRoZSB2ZXJzaW9uIG9mIHRoZSBSTkcgYW5kIHRoZSBNYXNoIHN0cmluZyBoYXNoZXIgKi9cbiAgICAgICAgcmFuZG9tLnZlcnNpb25zID0gZnVuY3Rpb24oKSB7IFxuICAgICAgICAgICAgcmV0dXJuIHZlcnNpb24gKyAnLCAnICsgbWFzaHZlcjtcbiAgICAgICAgfTsgXG5cbiAgICAgICAgLy8gd2hlbiBubyBzZWVkIGlzIHNwZWNpZmllZCwgY3JlYXRlIGEgcmFuZG9tIG9uZSBmcm9tIFdpbmRvd3MgQ3J5cHRvIChNb250ZSBDYXJsbyBhcHBsaWNhdGlvbikgXG4gICAgICAgIGlmKCBhcmdzLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgICB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyggdWludGEgKTtcbiAgICAgICAgICAgICBhcmdzID0gWyB1aW50YVsgMCBdLCB1aW50YVsgMSBdLCB1aW50YVsgMiBdIF07XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gc3RvcmUgdGhlIHNlZWQgdXNlZCB3aGVuIHRoZSBSTkcgd2FzIGluc3RhbnRpYXRlZCwgaWYgYW55XG4gICAgICAgIGluaXRpYWxBcmdzID0gYXJncztcblxuICAgICAgICAvLyBpbml0aWFsaXplIHRoZSBSTkdcbiAgICAgICAgX2luaXRTdGF0ZSggYXJncyApO1xuXG4gICAgICAgIHJldHVybiByYW5kb207XG5cbiAgICB9KSggQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApICk7XG59O1xuXG5leHBvcnQgY2xhc3MgUk5HIHtcbiAgICBjb25zdHJ1Y3RvcihybmdTZXR0aW5ncykge1xuICAgICAgICBpZiAocm5nU2V0dGluZ3MucmFuZCkge1xuICAgICAgICAgIHRoaXMucmFuZCA9IHJuZ1NldHRpbmdzLnJhbmQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IHNlZWQ7XG4gICAgICAgICAgaWYgKHJuZ1NldHRpbmdzLnNlZWQgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzZWVkID0gbmV3IERhdGUoKS5nZXRUaW1lKCkudG9TdHJpbmcoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VlZCA9IHJuZ1NldHRpbmdzLnNlZWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMucmFuZCA9IGFsZWFQUk5HKHNlZWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0U2VlZChzZWVkKSB7XG4gICAgICAgIHRoaXMuYWxlYS5zZWVkKHNlZWQudG9TdHJpbmcoKSk7XG4gICAgfVxuXG4gICAgLy8gU3RhbmRhcmQgdW5pZm9ybSBnZW5lcmF0b3IgdmFsdWVzIGluIFswLDEpXG4gICAgcmFuZG9tKCkge1xuICAgICAgICByZXR1cm4odGhpcy5yYW5kKCkpO1xuICAgIH1cblxuICAgIC8vIFJhbmRvbWx5IGNob29zZSArMSBvciAtMS5cbiAgICByYW5kU2lnbigpIHtcbiAgICAgICAgdmFyIGEgPSAyKk1hdGguZmxvb3IoMip0aGlzLnJhbmRvbSgpKS0xO1xuICAgICAgICByZXR1cm4oYSk7XG4gICAgfVxuXG4gICAgLy8gUmFuZG9tbHkgY2hvb3NlIGludGVnZXIgdW5pZm9ybWx5IGluIHttaW4sIC4uLiwgbWF4fS5cbiAgICByYW5kSW50KG1pbiwgbWF4KSB7XG4gICAgICAgIHZhciBhID0gbWluK01hdGguZmxvb3IoIChtYXgtbWluKzEpKnRoaXMucmFuZG9tKCkgKTtcbiAgICAgICAgcmV0dXJuKGEpO1xuICAgIH1cbiAgICBcbiAgICAvLyBSYW5kb21seSBjaG9vc2UgZmxvYXRpbmcgcG9pbnQgdW5pZm9ybWx5IGluIFttaW4sbWF4KVxuICAgIHJhbmRVbmlmb3JtKG1pbiwgbWF4KSB7XG4gICAgICAgIHZhciBhID0gbWluKyhtYXgtbWluKSp0aGlzLnJhbmRvbSgpO1xuICAgICAgICByZXR1cm4oYSk7XG4gICAgfVxuXG4gICAgLy8gUmFuZG9tbHkgYSBrLWxlbmd0aCBwZXJtdXRlZCBzdWJzZXF1ZW5jZSBvZiB7bWluLCAuLi4sIG1heH1cbiAgICByYW5kQ2hvaWNlKG1pbiwgbWF4LCBrKSB7XG4gICAgICAgIHZhciBhID0gbmV3IEFycmF5KCk7XG4gICAgICAgIHZhciBiID0gbmV3IEFycmF5KCk7XG4gICAgICAgIHZhciBpLGo7XG4gICAgICAgIGZvciAoaT0wOyBpPD1tYXgtbWluOyBpKyspIHtcbiAgICAgICAgICAgIGFbaV0gPSBtaW4raTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGk9MDsgaTxrOyBpKyspIHtcbiAgICAgICAgICAgIGogPSBNYXRoLmZsb29yKCAobWF4LW1pbisxLWkpKnRoaXMucmFuZG9tKCkgKTtcbiAgICAgICAgICAgIGJbaV0gPSBhLnNwbGljZShqLDEpWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChiKTtcbiAgICB9XG5cbiAgICAvLyBHZW5lcmF0ZSBhIHJhbmRvbSByYXRpb25hbCBudW1iZXIsIHBhc3NpbmcgaW4gMi1sZW4gYXJyYXlzIGZvciBsaW1pdHMuXG4gICAgcmFuZFJhdGlvbmFsKHBMaW1zLCBxTGltcykge1xuICAgICAgICB2YXIgcCwgcTtcblxuICAgICAgICAvLyBGaW5kIHRoZSByYXcgcmF0aW9uYWwgbnVtYmVyXG4gICAgICAgIHAgPSB0aGlzLnJhbmRJbnQocExpbXNbMF0sIHBMaW1zWzFdKTtcbiAgICAgICAgcSA9IHRoaXMucmFuZEludChxTGltc1swXSwgcUxpbXNbMV0pO1xuXG4gICAgICAgIHJldHVybiAobmV3IHJhdGlvbmFsX251bWJlcihwLHEpKTtcbiAgICB9XG5cbiAgICAvLyBHZW5lcmF0ZSBhIHJhbmRvbSBoZXggY29kZSBvZiBkZXNpcmVkIGxlbmd0aC5cbiAgICByYW5kSGV4SGFzaChuKSB7XG4gICAgICB2YXIgaGFzaCA9ICcnO1xuICAgICAgdmFyIGNoYXJzID0gJzAxMjM0NTY3ODlhYmNkZWYnO1xuICAgICAgZm9yICh2YXIgaT0wOyBpPG47IGkrKykge1xuICAgICAgICBoYXNoICs9IGNoYXJzW3RoaXMucmFuZEludCgwLDE1KV07XG4gICAgICB9XG4gICAgICByZXR1cm4gaGFzaDtcbiAgICB9XG59IiwiLyohXG4gKiBCVE0gSmF2YVNjcmlwdCBMaWJyYXJ5IHZAVkVSU0lPTlxuICogaHR0cHM6Ly9naXRodWIuY29tL2RicmlhbndhbHRvbi9CVE1cbiAqXG4gKiBDb3B5cmlnaHQgRC4gQnJpYW4gV2FsdG9uXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUKVxuICpcbiAqIERhdGU6IEBEQVRFXG4gKi9cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiogRGVmaW5lIGEgY2xhc3MgdG8gd29yayB3aXRoIHJhdGlvbmFsIG51bWJlcnNcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuaW1wb3J0IHsgcmVhbF9udW1iZXIgfSBmcm9tIFwiLi9yZWFsX251bWJlci5qc1wiO1xuXG4vKiBQcml2YXRlIHV0aWxpdHkgY29tbWFuZHMuICovXG4gIFxuZnVuY3Rpb24gaXNJbnQoeCkge1xuICAgIHZhciByZXRWYWx1ZSA9IGZhbHNlO1xuICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyID09PSB1bmRlZmluZWQpIHtcbiAgICByZXRWYWx1ZSA9ICh4ID09IE1hdGguZmxvb3IoeCkpO1xuICAgIH0gZWxzZSB7XG4gICAgcmV0VmFsdWUgPSBOdW1iZXIuaXNJbnRlZ2VyKHgpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0VmFsdWU7XG59XG5cblxuIC8vIEltcGxlbWVudCBFdWNsaWQncyBhbGdvcml0aG0uXG4gZXhwb3J0IGZ1bmN0aW9uIGZpbmRHQ0QoYSxiKSB7XG4gICAgdmFyIGM7XG4gICAgYSA9IE1hdGguYWJzKGEpO1xuICAgIGIgPSBNYXRoLmFicyhiKTtcbiAgICBpZiAoYSA8IGIpIHtcbiAgICAgICAgYz1hOyBhPWI7IGI9YztcbiAgICB9XG5cbiAgICBpZiAoYiA9PSAwKVxuICAgICAgICByZXR1cm4gMDtcblxuICAgIC8vIEluIHRoaXMgbG9vcCwgd2UgYWx3YXlzIGhhdmUgYSA+IGIuXG4gICAgd2hpbGUgKGIgPiAwKSB7XG4gICAgICAgIGMgPSBhICUgYjtcbiAgICAgICAgYSA9IGI7XG4gICAgICAgIGIgPSBjO1xuICAgIH1cbiAgICByZXR1cm4gYTtcbn1cblxuZXhwb3J0IGNsYXNzIHJhdGlvbmFsX251bWJlciBleHRlbmRzIHJlYWxfbnVtYmVyIHtcbiAgICBjb25zdHJ1Y3RvcihwLHEpIHtcbiAgICAgICAgaWYgKHEgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzdXBlcihwKTtcbiAgICAgICAgICAgIHRoaXMucCA9IHA7XG4gICAgICAgICAgICB0aGlzLnEgPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3VwZXIocC9xKTtcbiAgICAgICAgICAgIGlmIChxID09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnAgPSBNYXRoLnNxcnQoLTEpO1xuICAgICAgICAgICAgICAgIHRoaXMucSA9IDE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHAgPT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMucCA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5xID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHEgPCAwKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnAgPSAtcDtcbiAgICAgICAgICAgICAgICAgIHRoaXMucSA9IC1xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnAgPSBwO1xuICAgICAgICAgICAgICAgICAgdGhpcy5xID0gcTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zaW1wbGlmeSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGEgbnVtZXJpY2FsIHZhbHVlIG9mIHRoZSByYXRpb25hbCBleHByZXNzaW9uLlxuICAgIHZhbHVlKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMucC90aGlzLnEpO1xuICAgIH1cbiAgICBcbiAgICAvLyBVc2UgRXVjbGlkJ3MgYWxnb3JpdGhtIHRvIGZpbmQgdGhlIGdjZCwgdGhlbiByZWR1Y2VcbiAgICBzaW1wbGlmeSgpIHtcbiAgICAgICAgdmFyIGE7XG5cbiAgICAgICAgLy8gRG9uJ3Qgc2ltcGxpZnkgaWYgbm90IHJhdGlvIG9mIGludGVnZXJzLlxuICAgICAgICBpZiAodGhpcy5wICUgMSAhPSAwIHx8IHRoaXMucSAlIDEgIT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYSA9IGZpbmRHQ0QodGhpcy5wLCB0aGlzLnEpO1xuICAgICAgICB0aGlzLnAgLz0gYTtcbiAgICAgICAgdGhpcy5xIC89IGE7XG4gICAgfVxuXG4gICAgZXF1YWwob3RoZXIpIHtcbiAgICAgICAgaWYgKG90aGVyLmNvbnN0cnVjdG9yLm5hbWUgIT0gXCJyYXRpb25hbF9udW1iZXJcIikge1xuICAgICAgICAgIHJldHVybiAodGhpcy52YWx1ZSgpPT1vdGhlci52YWx1ZSgpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gKHRoaXMucC52YWx1ZU9mKCk9PW90aGVyLnAudmFsdWVPZigpXG4gICAgICAgICAgICAgICAgICAgICYmIHRoaXMucS52YWx1ZU9mKCkgPT0gb3RoZXIucS52YWx1ZU9mKCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWRkIHRvIHRoaXMgcmF0aW9uYWwgYW5vdGhlciByYXRpb25hbCBudW1iZXIgYW5kIGNyZWF0ZSBuZXcgb2JqZWN0LlxuICAgIGFkZChvdGhlcikge1xuICAgICAgICB2YXIgc3VtO1xuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiByYXRpb25hbF9udW1iZXIpIHtcbiAgICAgICAgc3VtID0gbmV3IHJhdGlvbmFsX251bWJlcih0aGlzLnAqb3RoZXIucStvdGhlci5wKnRoaXMucSwgdGhpcy5xKm90aGVyLnEpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzSW50KG90aGVyKSkge1xuICAgICAgICBzdW0gPSBuZXcgcmF0aW9uYWxfbnVtYmVyKHRoaXMucCtvdGhlcip0aGlzLnEsIHRoaXMucSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN1bSA9IG5ldyByZWFsX251bWJlcih0aGlzLnZhbHVlKCkgKyBvdGhlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHN1bSk7XG4gICAgfVxuXG4gICAgLy8gU3VidHJhY3QgZnJvbSB0aGlzIHJhdGlvbmFsIGFub3RoZXIgcmF0aW9uYWwgbnVtYmVyIGFuZCBjcmVhdGUgbmV3IG9iamVjdC5cbiAgICBzdWJ0cmFjdChvdGhlcikge1xuICAgICAgICB2YXIgc3VtO1xuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiByYXRpb25hbF9udW1iZXIpIHtcbiAgICAgICAgICAgIHN1bSA9IG5ldyByYXRpb25hbF9udW1iZXIodGhpcy5wKm90aGVyLnEtb3RoZXIucCp0aGlzLnEsIHRoaXMucSpvdGhlci5xKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0ludChvdGhlcikpIHtcbiAgICAgICAgICAgIHN1bSA9IG5ldyByYXRpb25hbF9udW1iZXIodGhpcy5wLW90aGVyKnRoaXMucSwgdGhpcy5xKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1bSA9IG5ldyByZWFsX251bWJlcih0aGlzLnZhbHVlKCkgLSBvdGhlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHN1bSk7XG4gICAgfVxuXG4gICAgLy8gTXVsdGlwbHkgdGhpcyByYXRpb25hbCBieSBhbm90aGVyIHJhdGlvbmFsIG51bWJlciBhbmQgY3JlYXRlIG5ldyBvYmplY3QuXG4gICAgbXVsdGlwbHkob3RoZXIpIHtcbiAgICAgICAgdmFyIHByb2R1Y3Q7XG4gICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIHJhdGlvbmFsX251bWJlcikge1xuICAgICAgICAgICAgcHJvZHVjdCA9IG5ldyByYXRpb25hbF9udW1iZXIodGhpcy5wKm90aGVyLnAsIHRoaXMucSpvdGhlci5xKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0ludChvdGhlcikpIHtcbiAgICAgICAgICAgIHByb2R1Y3QgPSBuZXcgcmF0aW9uYWxfbnVtYmVyKHRoaXMucCpvdGhlciwgdGhpcy5xKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb2R1Y3QgPSBuZXcgcmVhbF9udW1iZXIodGhpcy52YWx1ZSgpICogb3RoZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKHByb2R1Y3QpO1xuICAgIH1cblxuICAgIC8vIERpdmlkZSB0aGlzIHJhdGlvbmFsIGJ5IGFub3RoZXIgcmF0aW9uYWwgbnVtYmVyIGFuZCBjcmVhdGUgbmV3IG9iamVjdC5cbiAgICBkaXZpZGUob3RoZXIpIHtcbiAgICAgICAgdmFyIHByb2R1Y3Q7XG4gICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIHJhdGlvbmFsX251bWJlcikge1xuICAgICAgICAgICAgcHJvZHVjdCA9IG5ldyByYXRpb25hbF9udW1iZXIodGhpcy5wKm90aGVyLnEsIHRoaXMucSpvdGhlci5wKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0ludChvdGhlcikpIHtcbiAgICAgICAgICAgIHByb2R1Y3QgPSBuZXcgcmF0aW9uYWxfbnVtYmVyKHRoaXMucCwgdGhpcy5xKm90aGVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb2R1Y3QgPSBuZXcgcmVhbF9udW1iZXIodGhpcy52YWx1ZSgpIC8gb3RoZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKHByb2R1Y3QpO1xuICAgIH1cblxuICAgIC8vIEFkZGl0aXZlIEludmVyc2VcbiAgICBhZGRJbnZlcnNlKCkge1xuICAgICAgICB2YXIgaW52ZXJzZSA9IG5ldyByYXRpb25hbF9udW1iZXIoLXRoaXMucCwgdGhpcy5xKTtcbiAgICAgICAgcmV0dXJuKGludmVyc2UpO1xuICAgIH1cblxuICAgIC8vIE11bHRpcGxpY2F0aXZlIEludmVyc2VcbiAgICBtdWx0SW52ZXJzZSgpIHtcbiAgICAgICAgdmFyIGludmVyc2U7XG4gICAgICAgIGlmICh0aGlzLnAgIT0gMCkge1xuICAgICAgICAgICAgaW52ZXJzZSA9IG5ldyByYXRpb25hbF9udW1iZXIodGhpcy5xLCB0aGlzLnApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW52ZXJzZSA9IG5ldyByZWFsX251bWJlcihOYU4pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihpbnZlcnNlKTtcbiAgICB9XG5cbiAgICAvLyBGb3JtYXQgdGhlIHJhdGlvbmFsIG51bWJlciBhcyBzdHJpbmcuXG4gICAgdG9TdHJpbmcobGVhZFNpZ24pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBsZWFkU2lnbiA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgbGVhZFNpZ24gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3RyID0gKGxlYWRTaWduICYmIHRoaXMucD4wKSA/ICcrJyA6ICcnO1xuICAgICAgICBpZiAoaXNOYU4odGhpcy5wKSkge1xuICAgICAgICAgICAgc3RyID0gJ05hTic7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5xID09IDEpIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ciArIHRoaXMucDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ciArIHRoaXMucCArICcvJyArIHRoaXMucTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihzdHIpO1xuICAgIH1cblxuICAgIC8vIEZvcm1hdCB0aGUgcmF0aW9uYWwgbnVtYmVyIGFzIFRlWCBzdHJpbmcuXG4gICAgdG9UZVgobGVhZFNpZ24pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBsZWFkU2lnbiA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgbGVhZFNpZ24gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3RyID0gKGxlYWRTaWduICYmIHRoaXMucD4wKSA/ICcrJyA6ICcnO1xuICAgICAgICBpZiAoaXNOYU4odGhpcy5wKSkge1xuICAgICAgICAgICAgc3RyID0gJ1xcXFxtYXRocm17TmFOfSc7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5xID09IDEpIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ciArIHRoaXMucDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnAgPCAwKSB7XG4gICAgICAgICAgICAgICAgc3RyID0gJy1cXFxcZnJhY3snICsgLXRoaXMucCArICd9eycgKyB0aGlzLnEgKyAnfSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0ciA9IHN0ciArICdcXFxcZnJhY3snICsgdGhpcy5wICsgJ317JyArIHRoaXMucSArICd9JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihzdHIpO1xuICAgIH1cblxuICAgIHRvTWF0aE1MKCkge1xuICAgICAgICBpZiAodHlwZW9mIGxlYWRTaWduID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBsZWFkU2lnbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvcEFTdHIgPSBcIjxjbj5cIiArIHRoaXMucCArIFwiPC9jbj5cIixcbiAgICAgICAgICAgIG9wQlN0ciA9IFwiPGNuPlwiICsgdGhpcy5xICsgXCI8L2NuPlwiO1xuXG4gICAgICAgIHJldHVybihcIjxjbj5cIiArIHRoaXMudG9TdHJpbmcoKSArIFwiPC9jbj5cIik7XG5cbiAgICAgICAgaWYgKGlzTmFOKHRoaXMucCkpIHtcbiAgICAgICAgICAgIHN0ciA9IFwiPGNuPj88L2NuPlwiO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucSA9PSAxKSB7XG4gICAgICAgICAgICBzdHIgPSBvcEFTdHI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHIgPSBcIjxhcHBseT48ZGl2aWRlLz5cIitvcEFTdHIrb3BCU3RyK1wiPC9hcHBseT5cIjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cblxuXG4gXG5cblxuXG4iLCIvKiFcbiAqIEJUTSBKYXZhU2NyaXB0IExpYnJhcnkgdkBWRVJTSU9OXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGJyaWFud2FsdG9uL0JUTVxuICpcbiAqIENvcHlyaWdodCBELiBCcmlhbiBXYWx0b25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAoaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQpXG4gKlxuICogRGF0ZTogQERBVEVcbiAqL1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qKiBEZWZpbmUgYSBnZW5lcmljIGNsYXNzIHRvIHdvcmsgbnVtYmVyc1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5leHBvcnQgY2xhc3MgcmVhbF9udW1iZXIge1xuICAgIGNvbnN0cnVjdG9yKGEpIHtcbiAgICAgIGlmICh0eXBlb2YgYSA9PT0gJ251bWJlcicgfHwgYSBpbnN0YW5jZW9mIE51bWJlcikge1xuICAgICAgICB0aGlzLm51bWJlciA9IGE7XG4gICAgICB9IGVsc2UgaWYgKGEgaW5zdGFuY2VvZiByZWFsX251bWJlcikge1xuICAgICAgICB0aGlzLm51bWJlciA9IGEubnVtYmVyO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhIG51bWVyaWNhbCB2YWx1ZSBvZiB0aGUgcmF0aW9uYWwgZXhwcmVzc2lvbi5cbiAgICB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubnVtYmVyO1xuICAgIH1cbiAgICBcbiAgICAvLyBSZWFsIG51bWJlcnMgaGF2ZSBubyBuYXR1cmFsIHNpbXBsaWZpY2F0aW9uLCBidXQgZGVjbGFyaW5nIHRoZSBtZXRob2QuXG4gICAgc2ltcGxpZnkoKSB7XG4gICAgfVxuXG4gICAgZXF1YWwob3RoZXIpIHtcbiAgICAgIGlmICh0eXBlb2Ygb3RoZXIgPT09ICdudW1iZXInKSB7XG4gICAgICAgIG90aGVyID0gbmV3IHJlYWxfbnVtYmVyKG90aGVyKTtcbiAgICAgIH1cbiAgICAgICAgcmV0dXJuICh0aGlzLnZhbHVlKCk9PW90aGVyLnZhbHVlKCkpO1xuICAgIH1cblxuICAgIC8vIEFkZCBudW1iZXJzLlxuICAgIGFkZChvdGhlcikge1xuICAgICAgaWYgKHR5cGVvZiBvdGhlciA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgb3RoZXIgPSBuZXcgcmVhbF9udW1iZXIob3RoZXIpO1xuICAgICAgfVxuICAgICAgICB2YXIgc3VtID0gbmV3IHJlYWxfbnVtYmVyKHRoaXMubnVtYmVyICsgb3RoZXIudmFsdWUoKSk7XG4gICAgICAgIHJldHVybihzdW0pO1xuICAgIH1cblxuICAgIC8vIFN1YnRyYWN0IHRoaXMgLSBvdGhlclxuICAgIHN1YnRyYWN0KG90aGVyKSB7XG4gICAgICBpZiAodHlwZW9mIG90aGVyID09PSAnbnVtYmVyJykge1xuICAgICAgICBvdGhlciA9IG5ldyByZWFsX251bWJlcihvdGhlcik7XG4gICAgICB9XG4gICAgICAgIHZhciBzdW0gPSBuZXcgcmVhbF9udW1iZXIodGhpcy5udW1iZXIgLSBvdGhlci52YWx1ZSgpKTtcbiAgICAgICAgcmV0dXJuKHN1bSk7XG4gICAgfVxuXG4gICAgLy8gTXVsdGlwbHkgdGhpcyByYXRpb25hbCBieSBhbm90aGVyIHJhdGlvbmFsIG51bWJlciBhbmQgY3JlYXRlIG5ldyBvYmplY3QuXG4gICAgbXVsdGlwbHkob3RoZXIpIHtcbiAgICAgIGlmICh0eXBlb2Ygb3RoZXIgPT09ICdudW1iZXInKSB7XG4gICAgICAgIG90aGVyID0gbmV3IHJlYWxfbnVtYmVyKG90aGVyKTtcbiAgICAgIH1cbiAgICAgICAgdmFyIHByb2R1Y3QgPSBuZXcgcmVhbF9udW1iZXIodGhpcy5udW1iZXIgKiBvdGhlci52YWx1ZSgpKTtcbiAgICAgICAgcmV0dXJuKHByb2R1Y3QpO1xuICAgIH1cblxuICAgIC8vIERpdmlkZSB0aGlzIHJhdGlvbmFsIGJ5IGFub3RoZXIgcmF0aW9uYWwgbnVtYmVyIGFuZCBjcmVhdGUgbmV3IG9iamVjdC5cbiAgICBkaXZpZGUob3RoZXIpIHtcbiAgICAgIGlmICh0eXBlb2Ygb3RoZXIgPT09ICdudW1iZXInKSB7XG4gICAgICAgIG90aGVyID0gbmV3IHJlYWxfbnVtYmVyKG90aGVyKTtcbiAgICAgIH1cbiAgICAgICAgdmFyIHByb2R1Y3Q7XG4gICAgICAgIGlmIChvdGhlci52YWx1ZSAhPSAwKSB7XG4gICAgICAgICAgICBwcm9kdWN0ID0gbmV3IHJlYWxfbnVtYmVyKHRoaXMubnVtYmVyIC8gb3RoZXIudmFsdWUoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9kdWN0ID0gbmV3IHJlYWxfbnVtYmVyKE5hTik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHByb2R1Y3QpO1xuICAgIH1cblxuICAgIC8vIEFkZGl0aXZlIEludmVyc2VcbiAgICBhZGRJbnZlcnNlKCkge1xuICAgICAgICB2YXIgaW52ZXJzZSA9IG5ldyByZWFsX251bWJlcigtdGhpcy5udW1iZXIpO1xuICAgICAgICByZXR1cm4oaW52ZXJzZSk7XG4gICAgfVxuXG4gICAgLy8gTXVsdGlwbGljYXRpdmUgSW52ZXJzZVxuICAgIG11bHRJbnZlcnNlKCkge1xuICAgICAgICB2YXIgaW52ZXJzZTtcbiAgICAgICAgaWYgKHRoaXMubnVtYmVyICE9IDApIHtcbiAgICAgICAgICAgIGludmVyc2UgPSBuZXcgcmVhbF9udW1iZXIodGhpcy5udW1iZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW52ZXJzZSA9IG5ldyByZWFsX251bWJlcihOYU4pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihpbnZlcnNlKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZyhsZWFkU2lnbikge1xuICAgICAgICBpZiAodHlwZW9mIGxlYWRTaWduID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBsZWFkU2lnbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdHIgPSAobGVhZFNpZ24gJiYgdGhpcy5udW1iZXI+MCkgPyAnKycgOiAnJztcbiAgICAgICAgaWYgKGlzTmFOKHRoaXMubnVtYmVyKSkge1xuICAgICAgICAgICAgc3RyID0gJ05hTic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHIgPSBzdHIgKyBOdW1iZXIodGhpcy5udW1iZXIudG9GaXhlZCgxMCkpO1xuICAgICAgICB9XG4gIFxuICAgICAgICByZXR1cm4oc3RyKTtcbiAgICB9XG4gIFxuICAgIC8vIEZvcm1hdCB0aGUgcmF0aW9uYWwgbnVtYmVyIGFzIFRlWCBzdHJpbmcuXG4gICAgdG9UZVgobGVhZFNpZ24pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBsZWFkU2lnbiA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgbGVhZFNpZ24gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3RyID0gKGxlYWRTaWduICYmIHRoaXMubnVtYmVyPjApID8gJysnIDogJyc7XG4gICAgICAgIGlmIChpc05hTih0aGlzLm51bWJlcikpIHtcbiAgICAgICAgICAgIHN0ciA9ICdcXFxcbWF0aHJte05hTn0nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RyID0gc3RyICsgTnVtYmVyKHRoaXMudG9TdHJpbmcobGVhZFNpZ24pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4oc3RyKTtcbiAgICB9XG5cbiAgICAvLyBGb3JtYXQgYXMgYSByb290IE1hdGhNTCBlbGVtZW50LlxuICAgIHRvTWF0aE1MKGxlYWRTaWduKSB7XG4gICAgICAgIHJldHVybihcIjxjbj5cIiArIHRoaXMudG9TdHJpbmcoKSArIFwiPC9jbj5cIik7XG4gICAgfVxufVxuXG5cblxuXG5cbiBcblxuXG5cbiIsIi8qIVxuICogQlRNIEphdmFTY3JpcHQgTGlicmFyeSB2QFZFUlNJT05cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kYnJpYW53YWx0b24vQlRNXG4gKlxuICogQ29weXJpZ2h0IEQuIEJyaWFuIFdhbHRvblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIChodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVClcbiAqXG4gKiBEYXRlOiBAREFURVxuICovXG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiogIERlYWxpbmcgd2l0aCBpZGVudGl0aWVzIGFuZCByZWR1Y3Rpb25zLlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmltcG9ydCB7QlRNLCBleHByVHlwZSwgZXhwclZhbHVlIH0gZnJvbSBcIi4vQlRNX3Jvb3QuanNcIjtcblxuY2xhc3MgSWRlbnRpdHkge1xuICAgIGNvbnN0cnVjdG9yKHJlZkV4cHIsIGVxRXhwciwgZGVzY3JpcHRpb24sIGlzVmFsaWQsIGlkTnVtKSB7XG4gICAgICAgIHRoaXMucmVmRXhwciA9IHJlZkV4cHI7XG4gICAgICAgIHRoaXMuZXFFeHByID0gZXFFeHByO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgICAgIHRoaXMuaXNWYWxpZCA9IGlzVmFsaWQ7XG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLmlkTnVtID0gaWROdW07XG4gICAgfVxufVxuXG5jbGFzcyBNYXRjaCB7XG4gICAgY29uc3RydWN0b3IodGVzdFJ1bGUsIGJpbmRpbmdzKSB7XG4gICAgICAgIC8vIEZpbmQgdW5ib3VuZCB2YXJpYWJsZXMuXG4gICAgICAgIHZhciBhbGxWYXJzID0gdGVzdFJ1bGUuZXFFeHByLmRlcGVuZGVuY2llcygpLFxuICAgICAgICAgICAgbWlzc1ZhcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaiBpbiBhbGxWYXJzKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGJpbmRpbmdzW2FsbFZhcnNbal1dID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgbWlzc1ZhcnMucHVzaChhbGxWYXJzW2pdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBqIGluIG1pc3NWYXJzKSB7XG4gICAgICAgICAgICBiaW5kaW5nc1ttaXNzVmFyc1tqXV0gPSBcImlucHV0XCIrKCtqKzEpK1wiXCI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN1YnN0RXhwciA9IHRlc3RSdWxlLmVxRXhwci5jb21wb3NlKGJpbmRpbmdzKTtcblxuICAgICAgICB0aGlzLnN1YlRlWCA9IHN1YnN0RXhwci50b1RlWCgpO1xuICAgICAgICB0aGlzLnN1YlN0ciA9IHN1YnN0RXhwci50b1N0cmluZygpO1xuICAgICAgICB0aGlzLm5hbWUgPSB0ZXN0UnVsZS5kZXNjcmlwdGlvbjtcbiAgICAgICAgaWYgKHN1YnN0RXhwci50eXBlID09IGV4cHJUeXBlLmJpbm9wICYmIHN1YnN0RXhwci52YWx1ZVR5cGUgPT0gZXhwclZhbHVlLmJvb2wpIHtcbiAgICAgICAgICAgIHRoaXMuZXF1YXRpb24gPSB0ZXN0UnVsZS5yZWZFeHByLnRvVGVYKCkgKyBcIiBcXFxcaWZmIFwiICsgdGVzdFJ1bGUuZXFFeHByLnRvVGVYKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVxdWF0aW9uID0gdGVzdFJ1bGUucmVmRXhwci50b1RlWCgpICsgXCI9XCIgKyB0ZXN0UnVsZS5lcUV4cHIudG9UZVgoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJpbmRpbmdzID0gYmluZGluZ3M7XG4gICAgICAgIHRoaXMubnVtSW5wdXRzID0gbWlzc1ZhcnMubGVuZ3RoO1xuICAgICAgICB0aGlzLnJ1bGVJRCA9IHRlc3RSdWxlLmlkTnVtO1xuICAgIH1cbn1cblxuXG5cbmV4cG9ydCBmdW5jdGlvbiBuZXdSdWxlKGJ0bSwgcmVkdWN0aW9uTGlzdCwgZXF1YXRpb24sIGRlc2NyaXB0aW9uLCBpc1ZhbGlkLCB1c2VPbmVXYXksIGNvbnN0cmFpbnRzKSB7XG4gICAgdmFyIGV4cHJGb3JtdWxhcyA9IGVxdWF0aW9uLnNwbGl0KCc9PScpO1xuICAgIGlmIChleHByRm9ybXVsYXMubGVuZ3RoICE9IDIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJJbnZhbGlkIGVxdWF0aW9uIGluIGlkZW50aXR5IGxpc3Q6IFwiICsgZXF1YXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIHJlZklEPTA7IHJlZklEIDw9IDE7IHJlZklEKyspIHtcbiAgICAgICAgICAgIGlmIChyZWZJRCA9PSAxICYmIHR5cGVvZiB1c2VPbmVXYXkgIT0gJ3VuZGVmaW5lZCcgJiYgdXNlT25lV2F5KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaWRlbnRpdHk7XG5cbiAgICAgICAgICAgIHZhciByZWZFeHByID0gYnRtLnBhcnNlKGV4cHJGb3JtdWxhc1tyZWZJRF0sXCJmb3JtdWxhXCIpO1xuICAgICAgICAgICAgdmFyIGVxRXhwciA9IGJ0bS5wYXJzZShleHByRm9ybXVsYXNbMS1yZWZJRF0sXCJmb3JtdWxhXCIpO1xuICAgICAgICAgICAgdmFyIG51bVZhcnMgPSByZWZFeHByLmRlcGVuZGVuY2llcygpLmxlbmd0aDtcbiAgICAgICAgICAgIHZhciBhbGxSZWZFeHByID0gW2V4cHJGb3JtdWxhc1tyZWZJRF1dO1xuICAgICAgICAgICAgLy8gdGhpcyBpcyBhIGJpZyBzbG93IGRvd24sIHNvIGp1c3QgbWFrZSBzdXJlIGVhY2ggcnVsZSBpcyB3cml0dGVuIGluIG11bHRpcGxlIHdheXMuXG4gICAgICAgICAgICAvLyAgICAgIHZhciBhbGxSZWZFeHByID0gcmVmRXhwci5hbGxTdHJpbmdFcXVpdnMoKTtcblxuICAgICAgICAgICAgdmFyIHVuaXF1ZUV4cHIgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gYWxsUmVmRXhwcikge1xuICAgICAgICAgICAgICAgIHZhciBuZXh0RXhwciA9IGJ0bS5wYXJzZShhbGxSZWZFeHByW2ldLFwiZm9ybXVsYVwiKTtcbiAgICAgICAgICAgICAgICB2YXIgaXNOZXcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gdW5pcXVlRXhwcikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmluZGluZ3MgPSB1bmlxdWVFeHByW2pdLm1hdGNoKG5leHRFeHByLCB7fSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiaW5kaW5ncyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNOZXcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaXNOZXcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJ1bGVJRCA9IHJlZHVjdGlvbkxpc3QubGVuZ3RoKzE7XG4gICAgICAgICAgICAgICAgICAgIGlkZW50aXR5ID0gbmV3IElkZW50aXR5KG5leHRFeHByLCBlcUV4cHIsIGRlc2NyaXB0aW9uLCBpc1ZhbGlkLCBydWxlSUQpO1xuICAgICAgICAgICAgICAgICAgICByZWR1Y3Rpb25MaXN0LnB1c2goaWRlbnRpdHkpO1xuICAgICAgICAgICAgICAgICAgICB1bmlxdWVFeHByLnB1c2gobmV4dEV4cHIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gRGlzYWJsZSBhIHJ1bGUgaW4gdGhlIGxpc3QuXG5leHBvcnQgZnVuY3Rpb24gZGlzYWJsZVJ1bGUoYnRtLCByZWR1Y3Rpb25MaXN0LCBlcXVhdGlvbikge1xuICAvLyBNYXRjaCBvbmx5IG9uIHJlZkV4cHIuXG4gIHZhciBleHByRm9ybXVsYXMgPSBlcXVhdGlvbi5zcGxpdCgnPT0nKTtcbiAgdmFyIHJlZkV4cHIsIGVxRXhwcjtcbiAgaWYgKGV4cHJGb3JtdWxhcy5sZW5ndGggPiAyKSB7XG4gICAgY29uc29sZS5sb2coXCJJbnZhbGlkIGVxdWF0aW9uIGluIGlkZW50aXR5IGxpc3Q6IFwiICsgZXF1YXRpb24pO1xuICAgIHJldHVybjtcbiAgfSBlbHNlIHtcbiAgICByZWZFeHByID0gYnRtLnBhcnNlKGV4cHJGb3JtdWxhc1swXSxcImZvcm11bGFcIik7XG4gIH1cbiAgZm9yICh2YXIgaSBpbiByZWR1Y3Rpb25MaXN0KSB7XG4gICAgdmFyIHRlc3RSdWxlID0gcmVkdWN0aW9uTGlzdFtpXTtcbiAgICB2YXIgYmluZGluZ3MgPSB0ZXN0UnVsZS5yZWZFeHByLm1hdGNoKHJlZkV4cHIsIHt9KVxuICAgIGlmIChiaW5kaW5ncyAhPT0gbnVsbCkge1xuICAgICAgcmVkdWN0aW9uTGlzdFtpXS5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgIH1cbn1cbn1cblxuLyogKioqKioqKioqKioqKioqKioqKlxuKiogR2l2ZW4gYSBsaXN0IG9mIHJlZHVjdGlvbiBydWxlcyBhbmQgYSBnaXZlbiBleHByZXNzaW9uLFxuKiogdGVzdCBlYWNoIHJlZHVjdGlvbiBydWxlIHRvIHNlZSBpZiBpdCBtYXRjaGVzIHRoZSBzdHJ1Y3R1cmUuXG4qKiBDcmVhdGUgYW4gYXJyYXkgb2YgbmV3IG9iamVjdHMgd2l0aCBiaW5kaW5ncyBzdGF0aW5nIHdoYXRcbioqIHN1YnN0aXR1dGlvbnMgYXJlIG5lY2Vzc2FyeSB0byBtYWtlIHRoZSBtYXRjaGVzLlxuKioqKioqKioqKioqKioqKioqKiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRNYXRjaFJ1bGVzKHJlZHVjdGlvbkxpc3QsIHRlc3RFeHByLCBkb1ZhbGlkYXRlKSB7XG4gICAgdmFyIG1hdGNoTGlzdCA9IFtdO1xuICAgIHZhciBpLCB0ZXN0UnVsZTtcbiAgICBmb3IgKGkgaW4gcmVkdWN0aW9uTGlzdCkge1xuICAgICAgICB0ZXN0UnVsZSA9IHJlZHVjdGlvbkxpc3RbaV07XG4gICAgICAgIHZhciBiaW5kaW5ncyA9IHRlc3RSdWxlLnJlZkV4cHIubWF0Y2godGVzdEV4cHIsIHt9KVxuICAgICAgICBpZiAodGVzdFJ1bGUuaXNBY3RpdmUgJiYgYmluZGluZ3MgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IG5ldyBNYXRjaCh0ZXN0UnVsZSwgYmluZGluZ3MpO1xuICAgICAgICAgICAgbWF0Y2hMaXN0LnB1c2gobWF0Y2gpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybihtYXRjaExpc3QpO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0UmVkdWN0aW9ucyhidG0pIHtcbiAgICB2YXIgcmVkdWNlUnVsZXMgPSBuZXcgQXJyYXkoKTtcblxuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJzAreD09eCcsICdBZGRpdGl2ZSBJZGVudGl0eScsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJ3grMD09eCcsICdBZGRpdGl2ZSBJZGVudGl0eScsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJzAteD09LXgnLCAnQWRkaXRpdmUgSW52ZXJzZScsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJ3gtMD09eCcsICdBZGRpdGl2ZSBJZGVudGl0eScsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJzAqeD09MCcsICdNdWx0aXBseSBieSBaZXJvJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAneCowPT0wJywgJ011bHRpcGx5IGJ5IFplcm8nLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICcxKng9PXgnLCAnTXVsdGlwbGljYXRpdmUgSWRlbnRpdHknLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICd4KjE9PXgnLCAnTXVsdGlwbGljYXRpdmUgSWRlbnRpdHknLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICcwL3g9PTAnLCAnTXVsdGlwbHkgYnkgWmVybycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJ3gvMT09eCcsICdEaXZpZGUgYnkgT25lJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAneF4xPT14JywgJ0ZpcnN0IFBvd2VyJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAneF4wPT0xJywgJ1plcm8gUG93ZXInLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICd4XigtYSk9PTEvKHheYSknLCAnTmVnYXRpdmUgUG93ZXInLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICcxXng9PTEnLCAnT25lIHRvIGEgUG93ZXInLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICctMSp4PT0teCcsICdNdWx0aXBsaWNhdGl2ZSBJZGVudGl0eScsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJ3gqLTE9PS14JywgJ011bHRpcGxpY2F0aXZlIElkZW50aXR5JywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAneC14PT0wJywgJ0FkZGl0aXZlIEludmVyc2VzIENhbmNlbCcsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJ3grLXg9PTAnLCAnQWRkaXRpdmUgSW52ZXJzZXMgQ2FuY2VsJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAnLXgreD09MCcsICdBZGRpdGl2ZSBJbnZlcnNlcyBDYW5jZWwnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICcoLXgpK3k9PXkteCcsIFwiU3dhcCBMZWFkaW5nIE5lZ2F0aXZlXCIsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJ3grKC15KT09eC15JywgXCJTdWJ0cmFjdGlvblwiLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICcoLXgpKygteSk9PS0oeCt5KScsIFwiRmFjdG9yIE5lZ2F0aW9uIGZyb20gQWRkaXRpb25cIiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAnKC14KS15PT0tKHgreSknLCBcIkZhY3RvciBOZWdhdGlvbiBmcm9tIEFkZGl0aW9uXCIsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJ3gtKC15KT09eCt5JywgXCJBZGRpdGl2ZSBJbnZlcnNlJ3MgSW52ZXJzZVwiLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICcoLXgpKnk9PS0oeCp5KScsIFwiRmFjdG9yIE5lZ2F0aW9uIGZyb20gTXVsdGlwbGljYXRpb25cIiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAneCooLXkpPT0tKHgqeSknLCBcIkZhY3RvciBOZWdhdGlvbiBmcm9tIE11bHRpcGxpY2F0aW9uXCIsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJygteCkveT09LSh4L3kpJywgXCJGYWN0b3IgTmVnYXRpb24gZnJvbSBNdWx0aXBsaWNhdGlvblwiLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcmVkdWNlUnVsZXMsICd4LygteSk9PS0oeC95KScsIFwiRmFjdG9yIE5lZ2F0aW9uIGZyb20gTXVsdGlwbGljYXRpb25cIiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHJlZHVjZVJ1bGVzLCAnLSgteCk9PXgnLCBcIkFkZGl0aXZlIEludmVyc2UncyBJbnZlcnNlXCIsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCByZWR1Y2VSdWxlcywgJy8oL3gpPT14JywgXCJNdWx0aXBsaWNhdGl2ZSBJbnZlcnNlJ3MgSW52ZXJzZVwiLCB0cnVlLCB0cnVlKTtcblxuICAgIHJldHVybihyZWR1Y2VSdWxlcyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0U3VtUmVkdWN0aW9ucyhidG0pIHtcbiAgICB2YXIgc3VtUmVkdWN0aW9ucyA9IG5ldyBBcnJheSgpO1xuXG4gICAgbmV3UnVsZShidG0sIHN1bVJlZHVjdGlvbnMsICdhKzA9PWEnLCAnU2ltcGxpZnkgQWRkaXRpb24gYnkgWmVybycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBzdW1SZWR1Y3Rpb25zLCAnMCthPT1hJywgJ1NpbXBsaWZ5IEFkZGl0aW9uIGJ5IFplcm8nLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgc3VtUmVkdWN0aW9ucywgJ2EtYT09MCcsICdDYW5jZWwgQWRkaXRpdmUgSW52ZXJzZXMnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgc3VtUmVkdWN0aW9ucywgJ2ErLWE9PTAnLCAnQ2FuY2VsIEFkZGl0aXZlIEludmVyc2VzJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHN1bVJlZHVjdGlvbnMsICctYSthPT0wJywgJ0NhbmNlbCBBZGRpdGl2ZSBJbnZlcnNlcycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBzdW1SZWR1Y3Rpb25zLCAnYSpiKy1hKmI9PTAnLCAnQ2FuY2VsIEFkZGl0aXZlIEludmVyc2VzJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHN1bVJlZHVjdGlvbnMsICctYSpiK2EqYj09MCcsICdDYW5jZWwgQWRkaXRpdmUgSW52ZXJzZXMnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgc3VtUmVkdWN0aW9ucywgJ2EqKGIrYyk9PWEqYithKmMnLCAnRXhwYW5kIFByb2R1Y3RzIGJ5IERpc3RyaWJ1dGluZycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBzdW1SZWR1Y3Rpb25zLCAnKGErYikqYz09YSpjK2IqYycsICdFeHBhbmQgUHJvZHVjdHMgYnkgRGlzdHJpYnV0aW5nJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHN1bVJlZHVjdGlvbnMsICdhKihiLWMpPT1hKmItYSpjJywgJ0V4cGFuZCBQcm9kdWN0cyBieSBEaXN0cmlidXRpbmcnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgc3VtUmVkdWN0aW9ucywgJyhhLWIpKmM9PWEqYy1iKmMnLCAnRXhwYW5kIFByb2R1Y3RzIGJ5IERpc3RyaWJ1dGluZycsIHRydWUsIHRydWUpO1xuXG4gICAgcmV0dXJuKHN1bVJlZHVjdGlvbnMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdFByb2R1Y3RSZWR1Y3Rpb25zKGJ0bSkge1xuICAgIHZhciBwcm9kdWN0UmVkdWN0aW9ucyA9IG5ldyBBcnJheSgpO1xuXG4gICAgbmV3UnVsZShidG0sIHByb2R1Y3RSZWR1Y3Rpb25zLCAnMCphPT0wJywgJ1NpbXBsaWZ5IE11bHRpcGxpY2F0aW9uIGJ5IFplcm8nLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcHJvZHVjdFJlZHVjdGlvbnMsICdhKjA9PTAnLCAnU2ltcGxpZnkgTXVsdGlwbGljYXRpb24gYnkgWmVybycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBwcm9kdWN0UmVkdWN0aW9ucywgJzEqYT09YScsICdTaW1wbGlmeSBNdWx0aXBsaWNhdGlvbiBieSBPbmUnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcHJvZHVjdFJlZHVjdGlvbnMsICdhKjE9PWEnLCAnU2ltcGxpZnkgTXVsdGlwbGljYXRpb24gYnkgT25lJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHByb2R1Y3RSZWR1Y3Rpb25zLCAnYS9hPT0xJywgJ0NhbmNlbCBNdWx0aXBsaWNhdGl2ZSBJbnZlcnNlcycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBwcm9kdWN0UmVkdWN0aW9ucywgJ2EqL2E9PTEnLCAnQ2FuY2VsIE11bHRpcGxpY2F0aXZlIEludmVyc2VzJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHByb2R1Y3RSZWR1Y3Rpb25zLCAnL2EqYT09MScsICdDYW5jZWwgTXVsdGlwbGljYXRpdmUgSW52ZXJzZXMnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcHJvZHVjdFJlZHVjdGlvbnMsICcoYSpiKS8oYSpjKT09Yi9jJywgJ0NhbmNlbCBDb21tb24gRmFjdG9ycycsIHRydWUsdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHByb2R1Y3RSZWR1Y3Rpb25zLCAnYV5tL2Febj09YV4obS1uKScsICdDYW5jZWwgQ29tbW9uIEZhY3RvcnMnLCB0cnVlLHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBwcm9kdWN0UmVkdWN0aW9ucywgJyhhXm0qYikvKGFebipjKT09KGFeKG0tbikqYikvYycsICdDYW5jZWwgQ29tbW9uIEZhY3RvcnMnLCB0cnVlLHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBwcm9kdWN0UmVkdWN0aW9ucywgJ2EqYT09YV4yJywgJ1dyaXRlIFByb2R1Y3RzIG9mIENvbW1vbiBUZXJtcyBhcyBQb3dlcnMnLCB0cnVlLCB0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcHJvZHVjdFJlZHVjdGlvbnMsICdhKmFebj09YV4obisxKScsICdXcml0ZSBQcm9kdWN0cyBvZiBDb21tb24gVGVybXMgYXMgUG93ZXJzJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHByb2R1Y3RSZWR1Y3Rpb25zLCAnYV5uKmE9PWFeKG4rMSknLCAnV3JpdGUgUHJvZHVjdHMgb2YgQ29tbW9uIFRlcm1zIGFzIFBvd2VycycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBwcm9kdWN0UmVkdWN0aW9ucywgJ2FebSphXm49PWFeKG0rbiknLCAnV3JpdGUgUHJvZHVjdHMgb2YgQ29tbW9uIFRlcm1zIGFzIFBvd2VycycsIHRydWUsIHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBwcm9kdWN0UmVkdWN0aW9ucywgJyhhXi1tKmIpL2M9PWIvKGFebSpjKScsICdSZXdyaXRlIFVzaW5nIFBvc2l0aXZlIFBvd2VycycsIHRydWUsdHJ1ZSk7XG4gICAgbmV3UnVsZShidG0sIHByb2R1Y3RSZWR1Y3Rpb25zLCAnKGIqYV4tbSkvYz09Yi8oYV5tKmMpJywgJ1Jld3JpdGUgVXNpbmcgUG9zaXRpdmUgUG93ZXJzJywgdHJ1ZSx0cnVlKTtcbiAgICBuZXdSdWxlKGJ0bSwgcHJvZHVjdFJlZHVjdGlvbnMsICdiLyhhXi1tKmMpPT0oYV5tKmIpL2MnLCAnUmV3cml0ZSBVc2luZyBQb3NpdGl2ZSBQb3dlcnMnLCB0cnVlLHRydWUpO1xuICAgIG5ld1J1bGUoYnRtLCBwcm9kdWN0UmVkdWN0aW9ucywgJ2IvKGMqYV4tbSk9PShhXm0qYikvYycsICdSZXdyaXRlIFVzaW5nIFBvc2l0aXZlIFBvd2VycycsIHRydWUsdHJ1ZSk7XG5cbiAgICByZXR1cm4gKHByb2R1Y3RSZWR1Y3Rpb25zKTtcbiAgfSIsIi8qIVxuICogQlRNIEphdmFTY3JpcHQgTGlicmFyeSB2QFZFUlNJT05cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kYnJpYW53YWx0b24vQlRNXG4gKlxuICogQ29weXJpZ2h0IEQuIEJyaWFuIFdhbHRvblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIChodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVClcbiAqXG4gKiBEYXRlOiBAREFURVxuICovXG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBEZWZpbmUgdGhlIFNjYWxhciBFeHByZXNzaW9uIC0tIGEgbnVtZXJpY2FsIHZhbHVlXG4qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5pbXBvcnQgeyBleHByZXNzaW9uIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi5qc1wiXG5pbXBvcnQgeyByZWFsX251bWJlciB9IGZyb20gXCIuL3JlYWxfbnVtYmVyLmpzXCJcbmltcG9ydCB7IHJhdGlvbmFsX251bWJlciB9IGZyb20gXCIuL3JhdGlvbmFsX251bWJlci5qc1wiXG5pbXBvcnQgeyBleHByVHlwZSB9IGZyb20gXCIuL0JUTV9yb290LmpzXCJcblxuZXhwb3J0IGNsYXNzIHNjYWxhcl9leHByIGV4dGVuZHMgZXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IoYnRtLCBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoYnRtKTtcbiAgICAgICAgdGhpcy50eXBlID0gZXhwclR5cGUubnVtYmVyO1xuICAgICAgICBpZiAodHlwZW9mIG51bWJlciA9PT0gXCJvYmplY3RcIiAmJiBudW1iZXIuY29uc3RydWN0b3IubmFtZSAhPT0gXCJOdW1iZXJcIikge1xuICAgICAgICAgICAgaWYgKG51bWJlci5jb25zdHJ1Y3Rvci5uYW1lID09PSBcInJhdGlvbmFsX251bWJlclwiXG4gICAgICAgICAgICAgICAgfHxcbiAgICAgICAgICAgICAgICBudW1iZXIuY29uc3RydWN0b3IubmFtZSA9PT0gXCJyZWFsX251bWJlclwiKSAgICBcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLm51bWJlciA9IG51bWJlcjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobnVtYmVyLmNvbnN0cnVjdG9yLm5hbWUgPT09IFwic2NhbGFyX2V4cHJcIikge1xuICAgICAgICAgICAgICAgIHRoaXMubnVtYmVyID0gbnVtYmVyLm51bWJlcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUcnlpbmcgdG8gaW5zdGFudGlhdGUgYSBzY2FsYXJfZXhwciB3aXRoIGEgbm9uLW51bWJlciBvYmplY3Q6IFwiICsgbnVtYmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChNYXRoLmZsb29yKG51bWJlcik9PW51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5udW1iZXIgPSBuZXcgcmF0aW9uYWxfbnVtYmVyKG51bWJlciwgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm51bWJlciA9IG5ldyByZWFsX251bWJlcihudW1iZXIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29udGV4dCA9IFwibnVtYmVyXCI7XG4gICAgfVxuXG4gICAgLy8gUGFyc2VkIHJlcHJlc2VudGF0aW9uLlxuICAgIHRvU3RyaW5nKGVsZW1lbnRPbmx5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgZWxlbWVudE9ubHkgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGVsZW1lbnRPbmx5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHRoaXMubnVtYmVyLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgICBcbiAgICAvLyBEaXNwbGF5IHJlcHJlc2VudGF0aW9uLlxuICAgIHRvVGVYKHNob3dTZWxlY3QpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzaG93U2VsZWN0ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBzaG93U2VsZWN0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHdvcmQgPSB0aGlzLm51bWJlci50b1RlWCgpO1xuICAgICAgICBpZiAoc2hvd1NlbGVjdCAmJiB0aGlzLnNlbGVjdCkge1xuICAgICAgICAgICAgd29yZCA9IFwie1xcXFxjb2xvcntyZWR9XCIgKyB3b3JkICsgXCJ9XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHdvcmQpO1xuICAgIH1cbiAgICBcbiAgICAvLyBNYXRoTUwgcmVwcmVzZW50YXRpb24uXG4gICAgdG9NYXRoTUwoKSB7XG4gICAgICAgIHJldHVybihcIjxjbj5cIiArIHRoaXMudG9TdHJpbmcoKSArIFwiPC9jbj5cIik7XG4gICAgfVxuICAgIFxuICAgIC8vIFJldHVybiBhbiBhcnJheSBjb250YWluaW5nIGFsbCB0ZXN0ZWQgZXF1aXZhbGVudCBzdHJpbmdzLlxuICAgIGFsbFN0cmluZ0VxdWl2cygpIHtcbiAgICAgICAgcmV0dXJuKFt0aGlzLnRvU3RyaW5nKCldKTtcbiAgICB9XG4gICAgXG4gICAgLy8gVGVzdCBpZiByZXByZXNlbnRzIGNvbnN0YW50IHZhbHVlLlxuICAgIGlzQ29uc3RhbnQoKSB7XG4gICAgICAgIC8qXG4gICAgICAgIFRoaXMgY291bGQganVzdCB1c2UgZXhwcmVzc2lvbi5wcm90b3R5cGUuY29uc3RhbnQsIGJ1dCB1c2UgdGhpc1xuICAgICAgICBiZWNhdXNlIGl0IEFMV0FZUyBpcyB0cnVlIGZvciBzY2FsYXJfZXhwciBhbmQgZG9lcyBub3QgbmVlZCBhIGNoZWNrXG4gICAgICAgICovXG4gICAgICAgIHJldHVybih0cnVlKTtcbiAgICB9XG4gICAgXG4gICAgLy8gQ29tYmluZSBjb25zdGFudHMgd2hlcmUgcG9zc2libGVcbiAgICBzaW1wbGlmeUNvbnN0YW50cygpIHtcbiAgICAgICAgdmFyIHJldFZhbHVlO1xuICAgICAgICBpZiAoIXRoaXMuYnRtLm9wdGlvbnMubmVnYXRpdmVOdW1iZXJzICYmIHRoaXMubnVtYmVyLnAgPCAwKSB7XG4gICAgICAgICAgICB2YXIgdGhlTnVtYmVyID0gdGhpcy5udW1iZXIubXVsdGlwbHkoLTEpO1xuICAgICAgICAgICAgcmV0VmFsdWUgPSBuZXcgdW5vcF9leHByKHRoaXMuYnRtLCAnLScsIG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgdGhlTnVtYmVyKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXRWYWx1ZSA9IHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHJldFZhbHVlKTtcbiAgICB9XG4gICAgXG4gICAgdmFsdWUoKSB7XG4gICAgICAgIHJldHVybih0aGlzLm51bWJlci52YWx1ZSgpKTtcbiAgICB9XG5cbiAgICBldmFsdWF0ZShiaW5kaW5ncykge1xuICAgICAgICByZXR1cm4odGhpcy52YWx1ZSgpKTtcbiAgICB9XG4gICAgXG4gICAgY29weSgpIHtcbiAgICAgICAgcmV0dXJuKG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgdGhpcy5udW1iZXIpKTtcbiAgICB9XG4gICAgXG4gICAgY29tcG9zZShiaW5kaW5ncykge1xuICAgICAgICByZXR1cm4obmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCB0aGlzLm51bWJlcikpO1xuICAgIH1cbiAgICBcbiAgICBkZXJpdmF0aXZlKGl2YXIsIHZhckxpc3QpIHtcbiAgICAgICAgcmV0dXJuKG5ldyBzY2FsYXJfZXhwcih0aGlzLmJ0bSwgMCkpO1xuICAgIH1cbiAgICBcbiAgICAvKlxuICAgICAgICBTZWUgZXhwcmVzc2lvbnMucHJvdG90eXBlLm1hdGNoIGZvciBleHBsYW5hdGlvbi5cbiAgICBcbiAgICAgICAgQSBzY2FsYXIgbWlnaHQgbWF0Y2ggYSBjb25zdGFudCBmb3JtdWxhLlxuICAgICovXG4gICAgbWF0Y2goZXhwciwgYmluZGluZ3MpIHtcbiAgICAgICAgdmFyIHJldFZhbHVlID0gbnVsbCxcbiAgICAgICAgICAgIHRlc3RFeHByID0gZXhwcjtcbiAgICBcbiAgICAgICAgLy8gU3BlY2lhbCBuYW1lZCBjb25zdGFudHMgY2FuIG5vdCBtYXRjaCBleHByZXNzaW9ucy5cbiAgICAgICAgaWYgKGV4cHIuaXNDb25zdGFudCgpICYmIGV4cHIudHlwZSAhPSBleHByVHlwZS5udW1iZXIpIHtcbiAgICAgICAgICAgIHZhciB0ZXN0RXhwciA9IHRoaXMuYnRtLnBhcnNlKGV4cHIudG9TdHJpbmcoKSwgZXhwci5jb250ZXh0KS5zaW1wbGlmeUNvbnN0YW50cygpO1xuICAgICAgICAgICAgaWYgKHRoaXMudG9TdHJpbmcoKSA9PT0gdGVzdEV4cHIudG9TdHJpbmcoKSkge1xuICAgICAgICAgICAgICByZXRWYWx1ZSA9IGJpbmRpbmdzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRlc3RFeHByLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyXG4gICAgICAgICAgICAgICAgJiYgdGhpcy5udW1iZXIuZXF1YWwodGVzdEV4cHIubnVtYmVyKSkge1xuICAgICAgICAgICAgcmV0VmFsdWUgPSBiaW5kaW5ncztcbiAgICAgICAgfVxuICAgIFxuICAgICAgICByZXR1cm4ocmV0VmFsdWUpO1xuICAgIH0gICAgXG59XG5cbiIsIi8qIVxuICogQlRNIEphdmFTY3JpcHQgTGlicmFyeSB2QFZFUlNJT05cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kYnJpYW53YWx0b24vQlRNXG4gKlxuICogQ29weXJpZ2h0IEQuIEJyaWFuIFdhbHRvblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIChodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVClcbiAqXG4gKiBEYXRlOiBAREFURVxuICovXG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBEZWZpbmUgdGhlIFVuYXJ5IEV4cHJlc3Npb24gLS0gZGVmaW5lZCBieSBhbiBvcGVyYXRvciBhbmQgYW4gaW5wdXQuXG4qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5pbXBvcnQgeyBleHByZXNzaW9uIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi5qc1wiXG5pbXBvcnQgeyBzY2FsYXJfZXhwciB9IGZyb20gXCIuL3NjYWxhcl9leHByLmpzXCJcbmltcG9ydCB7IGJpbm9wX2V4cHIgfSBmcm9tIFwiLi9iaW5vcF9leHByLmpzXCJcbmltcG9ydCB7IGV4cHJUeXBlLCBvcFByZWMgfSBmcm9tIFwiLi9CVE1fcm9vdC5qc1wiXG5cbmV4cG9ydCBjbGFzcyB1bm9wX2V4cHIgZXh0ZW5kcyBleHByZXNzaW9uIHtcbiAgICBjb25zdHJ1Y3RvcihidG0sIG9wLCBpbnB1dCkge1xuICAgICAgICBzdXBlcihidG0pO1xuICAgICAgICB0aGlzLnR5cGUgPSBleHByVHlwZS51bm9wO1xuICAgICAgICB0aGlzLm9wID0gb3A7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICBpbnB1dCA9IG5ldyBleHByZXNzaW9uKCk7XG4gICAgICAgIHRoaXMuaW5wdXRzID0gW2lucHV0XTtcbiAgICAgICAgICAgIGlucHV0LnBhcmVudCA9IHRoaXM7XG4gICAgICAgIHN3aXRjaCAob3ApIHtcbiAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgIHRoaXMucHJlYyA9IG9wUHJlYy5tdWx0ZGl2O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVjID0gb3BQcmVjLm11bHRkaXY7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICB0aGlzLnByZWMgPSBvcFByZWMucG93ZXI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiVW5rbm93biB1bmFyeSBvcGVyYXRvcjogJ1wiK29wK1wiJy5cIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgdmFyIHRoZVN0cjtcbiAgICAgICAgdmFyIG9wU3RyO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dHNbMF0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG9wU3RyID0gJz8nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3BTdHIgPSB0aGlzLmlucHV0c1swXS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmICgodGhpcy5pbnB1dHNbMF0udHlwZSA+PSBleHByVHlwZS51bm9wXG4gICAgICAgICAgICAgICAgJiYgdGhpcy5pbnB1dHNbMF0ucHJlYyA8IHRoaXMucHJlYylcbiAgICAgICAgICAgIHx8ICh0aGlzLmlucHV0c1swXS50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICYmIG9wU3RyLmluZGV4T2YoJy8nKSA+PSAwXG4gICAgICAgICAgICAgICAgJiYgb3BQcmVjLm11bHRkaXYgPD0gdGhpcy5wcmVjKVxuICAgICAgICAgICAgKSBcbiAgICAgICAge1xuICAgICAgICAgICAgdGhlU3RyID0gdGhpcy5vcCArICcoJyArIG9wU3RyICsgJyknO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhlU3RyID0gdGhpcy5vcCArIG9wU3RyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKHRoZVN0cik7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRlc3RlZCBlcXVpdmFsZW50IHN0cmluZ3MuXG4gICAgYWxsU3RyaW5nRXF1aXZzKCkge1xuICAgICAgICB2YXIgYWxsSW5wdXRzID0gdGhpcy5pbnB1dHNbMF0uYWxsU3RyaW5nRXF1aXZzKCk7XG4gICAgICAgIHZhciByZXRWYWx1ZSA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgaW4gYWxsSW5wdXRzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dHNbMF0udHlwZSA+PSBleHByVHlwZS51bm9wICYmIHRoaXMuaW5wdXRzWzBdLnByZWMgPD0gdGhpcy5wcmVjKSB7XG4gICAgICAgICAgICAgICAgcmV0VmFsdWVbaV0gPSB0aGlzLm9wICsgJygnICsgYWxsSW5wdXRzW2ldICsgJyknO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXRWYWx1ZVtpXSA9IHRoaXMub3AgKyBhbGxJbnB1dHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ocmV0VmFsdWUpO1xuICAgIH1cblxuICAgIHRvVGVYKHNob3dTZWxlY3QpIHtcbiAgICAgICAgdmFyIHRoZVN0cjtcbiAgICAgICAgdmFyIG9wU3RyLCB0aGVPcDtcblxuICAgICAgICBpZiAodHlwZW9mIHNob3dTZWxlY3QgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHNob3dTZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dHNbMF0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG9wU3RyID0gJz8nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3BTdHIgPSB0aGlzLmlucHV0c1swXS50b1RlWChzaG93U2VsZWN0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoZU9wID0gdGhpcy5vcDtcbiAgICAgICAgaWYgKHRoZU9wID09ICcvJykge1xuICAgICAgICAgICAgdGhlT3AgPSAnXFxcXGRpdiAnO1xuICAgICAgICAgICAgaWYgKHNob3dTZWxlY3QgJiYgdGhpcy5zZWxlY3QpIHtcbiAgICAgICAgICAgICAgICB0aGVTdHIgPSBcIntcXFxcY29sb3J7cmVkfVwiICsgdGhpcy5vcCArIFwifVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgJ1xcXFxsZWZ0KHtcXFxcY29sb3J7Ymx1ZX0nICsgb3BTdHIgKyAnfVxcXFxyaWdodCknO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGVTdHIgPSAnXFxcXGZyYWN7MX17JyArIG9wU3RyICsgJ30nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNob3dTZWxlY3QgJiYgdGhpcy5zZWxlY3QpIHtcbiAgICAgICAgICAgICAgICB0aGVTdHIgPSBcIntcXFxcY29sb3J7cmVkfVwiICsgdGhpcy5vcCArIFwifVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgJ1xcXFxsZWZ0KHtcXFxcY29sb3J7Ymx1ZX0nICsgb3BTdHIgKyAnfVxcXFxyaWdodCknO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlucHV0c1swXS50eXBlID49IGV4cHJUeXBlLnVub3AgJiYgdGhpcy5pbnB1dHNbMF0ucHJlYyA8PSB0aGlzLnByZWNcbiAgICAgICAgICAgICAgICAmJiAodGhpcy5pbnB1dHNbMF0udHlwZSAhPSBleHByVHlwZS51bm9wIHx8IHRoaXMub3AgIT0gJy0nIHx8IHRoaXMuaW5wdXRzWzBdLm9wICE9ICcvJykpIHtcbiAgICAgICAgICAgICAgICB0aGVTdHIgPSB0aGVPcCArICdcXFxcbGVmdCgnICsgb3BTdHIgKyAnXFxcXHJpZ2h0KSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoZVN0ciA9IHRoZU9wICsgb3BTdHI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHRoZVN0cik7XG4gICAgfVxuXG4gICAgdG9NYXRoTUwoKSB7XG4gICAgICAgIHZhciB0aGVTdHI7XG4gICAgICAgIHZhciBvcFN0cjtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaW5wdXRzWzBdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBvcFN0ciA9ICc/JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9wU3RyID0gdGhpcy5pbnB1dHNbMF0udG9NYXRoTUwoKTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHRoaXMub3ApIHtcbiAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgIHRoZVN0ciA9IG9wU3RyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgdGhlU3RyID0gXCI8YXBwbHk+PG1pbnVzLz5cIiArIG9wU3RyICsgXCI8L2FwcGx5PlwiO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgdGhlU3RyID0gXCI8YXBwbHk+PGRpdmlkZS8+PGNuPjE8L2NuPlwiICsgb3BTdHIgKyBcIjwvYXBwbHk+XCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4odGhlU3RyKTtcbiAgICB9XG5cbiAgICBvcGVyYXRlVG9UZVgoKSB7XG4gICAgICAgIHZhciBvcFN0cmluZyA9IHRoaXMub3A7XG5cbiAgICAgICAgaWYgKG9wU3RyaW5nID09PSAnLycpIHtcbiAgICAgICAgICAgIG9wU3RyaW5nID0gJ1xcXFxkaXYnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKG9wU3RyaW5nKTtcbiAgICB9XG5cbiAgICBldmFsdWF0ZShiaW5kaW5ncykge1xuICAgICAgICB2YXIgaW5wdXRWYWwgPSB0aGlzLmlucHV0c1swXS5ldmFsdWF0ZShiaW5kaW5ncyk7XG5cbiAgICAgICAgdmFyIHJldFZhbDtcbiAgICAgICAgaWYgKGlucHV0VmFsID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuKHVuZGVmaW5lZCk7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0aGlzLm9wKSB7XG4gICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICByZXRWYWwgPSBpbnB1dFZhbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgIHJldFZhbCA9IC0xKmlucHV0VmFsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgLy8gRXZlbiB3aGVuIGRpdmlkZSBieSB6ZXJvLCB3ZSB3YW50IHRvIHVzZSB0aGlzLCBzaW5jZSBpbiB0aGUgZXhjZXB0aW9uXG4gICAgICAgICAgICAgICAgLy8gd2Ugd2FudCB0aGUgdmFsdWUgdG8gYmUgSW5maW5pdGUgYW5kIG5vdCB1bmRlZmluZWQuXG4gICAgICAgICAgICAgICAgcmV0VmFsID0gMS9pbnB1dFZhbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJUaGUgdW5hcnkgb3BlcmF0b3IgJ1wiICsgdGhpcy5vcCArIFwiJyBpcyBub3QgZGVmaW5lZC5cIik7XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWwpO1xuICAgIH1cblxuICAgIHNpbXBsaWZ5Q29uc3RhbnRzKCkge1xuICAgICAgICB2YXIgcmV0VmFsO1xuXG4gICAgICAgIHRoaXMuaW5wdXRzWzBdID0gdGhpcy5pbnB1dHNbMF0uc2ltcGxpZnlDb25zdGFudHMoKTtcbiAgICAgICAgdGhpcy5pbnB1dHNbMF0ucGFyZW50ID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMuaW5wdXRzWzBdLnR5cGUgPT0gZXhwclR5cGUubnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgdGhlTnVtYmVyID0gdGhpcy5pbnB1dHNbMF0ubnVtYmVyO1xuICAgICAgICAgICAgc3dpdGNoICh0aGlzLm9wKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLm5lZ2F0aXZlTnVtYmVycykge1xuICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIHRoZU51bWJlci5hZGRJbnZlcnNlKCkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIHRoZU51bWJlci5tdWx0SW52ZXJzZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXRWYWwgPSB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWwpO1xuICAgIH1cblxuICAgIGZsYXR0ZW4oKSB7XG4gICAgICByZXR1cm4obmV3IHVub3BfZXhwcih0aGlzLmJ0bSwgdGhpcy5vcCwgdGhpcy5pbnB1dHNbMF0uZmxhdHRlbigpKSk7XG4gICAgfVxuXG4gICAgY29weSgpIHtcbiAgICAgIHJldHVybihuZXcgdW5vcF9leHByKHRoaXMuYnRtLCB0aGlzLm9wLCB0aGlzLmlucHV0c1swXS5jb3B5KCkpKTtcbiAgICB9XG5cbiAgICBjb21wb3NlKGJpbmRpbmdzKSB7XG4gICAgICAgIHJldHVybihuZXcgdW5vcF9leHByKHRoaXMuYnRtLCB0aGlzLm9wLCB0aGlzLmlucHV0c1swXS5jb21wb3NlKGJpbmRpbmdzKSkpO1xuICAgIH1cblxuICAgIGRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCkge1xuICAgICAgICB2YXIgdGhlRGVyaXY7XG5cbiAgICAgICAgdmFyIHVDb25zdCA9IHRoaXMuaW5wdXRzWzBdLmlzQ29uc3RhbnQoKTtcbiAgICAgICAgaWYgKHVDb25zdCkge1xuICAgICAgICAgICAgdGhlRGVyaXYgPSBuZXcgc2NhbGFyX2V4cHIodGhpcy5idG0sIDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3dpdGNoICh0aGlzLm9wKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgICAgIHRoZURlcml2ID0gdGhpcy5pbnB1dHNbMF0uZGVyaXZhdGl2ZShpdmFyLCB2YXJMaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgICAgIHRoZURlcml2ID0gbmV3IHVub3BfZXhwcih0aGlzLmJ0bSwgJy0nLCB0aGlzLmlucHV0c1swXS5kZXJpdmF0aXZlKGl2YXIsIHZhckxpc3QpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgICAgIHZhciBkZW5vbSA9IG5ldyBiaW5vcF9leHByKHRoaXMuYnRtLCAnKicsIHRoaXMuaW5wdXRzWzBdLCB0aGlzLmlucHV0c1swXSk7XG4gICAgICAgICAgICAgICAgICAgIHRoZURlcml2ID0gbmV3IHVub3BfZXhwcih0aGlzLmJ0bSwgJy0nLCBuZXcgYmlub3BfZXhwcih0aGlzLmJ0bSwgJy8nLCB0aGlzLmlucHV0c1swXS5kZXJpdmF0aXZlKGl2YXIsIHZhckxpc3QpLCBkZW5vbSkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZSBkZXJpdmF0aXZlIG9mIHRoZSB1bmFyeSBvcGVyYXRvciAnXCIgKyB0aGlzLm9wICsgXCInIGlzIG5vdCBkZWZpbmVkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhlRGVyaXYgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybih0aGVEZXJpdik7XG4gICAgfVxuXG4gICAgbWF0Y2goZXhwciwgYmluZGluZ3MpIHtcbiAgICAgICAgdmFyIHJldFZhbHVlID0gbnVsbDtcblxuICAgICAgICAvLyBTcGVjaWFsIG5hbWVkIGNvbnN0YW50cyBjYW4gbm90IG1hdGNoIGV4cHJlc3Npb25zLlxuICAgICAgICBpZiAodGhpcy5pc0NvbnN0YW50KCkgJiYgZXhwci5pc0NvbnN0YW50KCkpIHtcbiAgICAgICAgICAgIHZhciBuZXdFeHByID0gZXhwci5zaW1wbGlmeUNvbnN0YW50cygpLFxuICAgICAgICAgICAgICAgIG5ld1RoaXMgPSB0aGlzLnNpbXBsaWZ5Q29uc3RhbnRzKCk7XG5cbiAgICAgICAgICAgIGlmIChuZXdFeHByLnRvU3RyaW5nKCkgPT09IG5ld1RoaXMudG9TdHJpbmcoKVxuICAgICAgICAgICAgICAgIHx8IG5ld0V4cHIudHlwZSA9PSBleHByVHlwZS5udW1iZXIgJiYgbmV3VGhpcy50eXBlID09IGV4cHJUeXBlLm51bWJlclxuICAgICAgICAgICAgICAgICAgICAmJiBuZXdUaGlzLm51bWJlci5lcXVhbChuZXdFeHByLm51bWJlcikpIHtcbiAgICAgICAgICAgICAgICByZXRWYWx1ZSA9IGJpbmRpbmdzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0VmFsdWUgPSBleHByZXNzaW9uLnByb3RvdHlwZS5tYXRjaC5jYWxsKHRoaXMsIGV4cHIsIGJpbmRpbmdzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxufVxuIiwiLyohXG4gKiBCVE0gSmF2YVNjcmlwdCBMaWJyYXJ5IHZAVkVSU0lPTlxuICogaHR0cHM6Ly9naXRodWIuY29tL2RicmlhbndhbHRvbi9CVE1cbiAqXG4gKiBDb3B5cmlnaHQgRC4gQnJpYW4gV2FsdG9uXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUKVxuICpcbiAqIERhdGU6IEBEQVRFXG4gKi9cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIERlZmluZSB0aGUgVmFyaWFibGUgRXhwcmVzc2lvbiAtLSBhIHZhbHVlIGRlZmluZWQgYnkgYSBuYW1lXG4qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuaW1wb3J0IHsgZXhwcmVzc2lvbiB9IGZyb20gXCIuL2V4cHJlc3Npb24uanNcIlxuaW1wb3J0IHsgc2NhbGFyX2V4cHIgfSBmcm9tIFwiLi9zY2FsYXJfZXhwci5qc1wiXG5pbXBvcnQgeyBleHByVHlwZSwgZXhwclZhbHVlIH0gZnJvbSBcIi4vQlRNX3Jvb3QuanNcIlxuXG5leHBvcnQgY2xhc3MgdmFyaWFibGVfZXhwciBleHRlbmRzIGV4cHJlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKGJ0bSwgbmFtZSkge1xuICAgICAgICBzdXBlcihidG0pO1xuICAgICAgICB0aGlzLnR5cGUgPSBleHByVHlwZS52YXJpYWJsZTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcblxuICAgICAgICAvLyBDb3VudCBob3cgbWFueSBkZXJpdmF0aXZlcy5cbiAgICAgICAgdmFyIHByaW1lUG9zID0gbmFtZS5pbmRleE9mKFwiJ1wiKTtcbiAgICAgICAgdGhpcy5kZXJpdnMgPSAwO1xuICAgICAgICBpZiAocHJpbWVQb3MgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmRlcml2cyA9IG5hbWUuc2xpY2UocHJpbWVQb3MpLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaXNDb25zdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzU3BlY2lhbCA9IGZhbHNlO1xuICAgICAgICBzd2l0Y2godGhpcy5uYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdlJzpcbiAgICAgICAgICAgIGNhc2UgJ3BpJzpcbiAgICAgICAgICAgIGNhc2UgJ2RuZSc6XG4gICAgICAgICAgICBjYXNlICdpbmYnOlxuICAgICAgICAgICAgICAgIHRoaXMuaXNDb25zdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5pc1NwZWNpYWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoZWxlbWVudE9ubHkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50T25seSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZWxlbWVudE9ubHkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4odGhpcy5uYW1lKTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgdGVzdGVkIGVxdWl2YWxlbnQgc3RyaW5ncy5cbiAgICBhbGxTdHJpbmdFcXVpdnMoKSB7XG4gICAgICAgIHJldHVybihbdGhpcy50b1N0cmluZygpXSk7XG4gICAgfVxuXG4gICAgdG9UZVgoc2hvd1NlbGVjdCkge1xuICAgICAgICBpZiAodHlwZW9mIHNob3dTZWxlY3QgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHNob3dTZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3RyID0gdGhpcy50b1N0cmluZygpO1xuXG4gICAgICAgIHN3aXRjaCAodGhpcy5uYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdhbHBoYSc6XG4gICAgICAgICAgICBjYXNlICdiZXRhJzpcbiAgICAgICAgICAgIGNhc2UgJ2dhbW1hJzpcbiAgICAgICAgICAgIGNhc2UgJ2RlbHRhJzpcbiAgICAgICAgICAgIGNhc2UgJ2Vwc2lsb24nOlxuICAgICAgICAgICAgY2FzZSAnemV0YSc6XG4gICAgICAgICAgICBjYXNlICdldGEnOlxuICAgICAgICAgICAgY2FzZSAndGhldGEnOlxuICAgICAgICAgICAgY2FzZSAna2FwcGEnOlxuICAgICAgICAgICAgY2FzZSAnbGFtYmRhJzpcbiAgICAgICAgICAgIGNhc2UgJ211JzpcbiAgICAgICAgICAgIGNhc2UgJ251JzpcbiAgICAgICAgICAgIGNhc2UgJ3hpJzpcbiAgICAgICAgICAgIGNhc2UgJ3BpJzpcbiAgICAgICAgICAgIGNhc2UgJ3Jobyc6XG4gICAgICAgICAgICBjYXNlICdzaWdtYSc6XG4gICAgICAgICAgICBjYXNlICd0YXUnOlxuICAgICAgICAgICAgY2FzZSAndXBzaWxvbic6XG4gICAgICAgICAgICBjYXNlICdwaGknOlxuICAgICAgICAgICAgY2FzZSAnY2hpJzpcbiAgICAgICAgICAgIGNhc2UgJ3BzaSc6XG4gICAgICAgICAgICBjYXNlICdvbWVnYSc6XG4gICAgICAgICAgICBjYXNlICdHYW1tYSc6XG4gICAgICAgICAgICBjYXNlICdEZWx0YSc6XG4gICAgICAgICAgICBjYXNlICdUaGV0YSc6XG4gICAgICAgICAgICBjYXNlICdMYW1iZGEnOlxuICAgICAgICAgICAgY2FzZSAnWGknOlxuICAgICAgICAgICAgY2FzZSAnUGknOlxuICAgICAgICAgICAgY2FzZSAnU2lnbWEnOlxuICAgICAgICAgICAgY2FzZSAnVXBzaWxvbic6XG4gICAgICAgICAgICBjYXNlICdQaGknOlxuICAgICAgICAgICAgY2FzZSAnUHNpJzpcbiAgICAgICAgICAgIGNhc2UgJ09tZWdhJzpcbiAgICAgICAgICAgICAgICBzdHIgPSAnXFxcXCcgKyB0aGlzLm5hbWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdpbmYnOlxuICAgICAgICAgICAgICAgIHN0ciA9ICdcXFxcaW5mdHknO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1NwZWNpYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyID0gJ1xcXFxtYXRocm17JyArIHRoaXMubmFtZSArICd9JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubmFtZS5pbmRleE9mKFwiaW5wdXRcIik9PTApIHtcbiAgICAgICAgICAgIHN0ciA9IFwiXFxcXGJveGVke1xcXFxkb3RzP157XCIgKyB0aGlzLm5hbWUuc2xpY2UoNSkgKyBcIn19XCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2hvd1NlbGVjdCAmJiB0aGlzLnNlbGVjdCkge1xuICAgICAgICAgICAgc3RyID0gXCJ7XFxcXGNvbG9ye3JlZH1cIiArIHN0ciArIFwifVwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihzdHIpO1xuICAgIH1cblxuICAgIGRlcGVuZGVuY2llcyhmb3JjZWQpIHtcbiAgICAgICAgdmFyIGRlcEFycmF5ID0gbmV3IEFycmF5KCk7XG4gICAgICAgIGlmIChmb3JjZWQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8Zm9yY2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGVwQXJyYXkucHVzaChmb3JjZWRbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5pc0NvbnN0ICYmIGRlcEFycmF5LmluZGV4T2YodGhpcy5uYW1lKSA8IDApIHtcbiAgICAgICAgICAgIGRlcEFycmF5LnB1c2godGhpcy5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4oZGVwQXJyYXkpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgIEEgdmFyaWFibGUgaXMgY29uc3RhbnQgb25seSBpZiByZWZlcnJpbmcgdG8gbWF0aGVtYXRpY2FsIGNvbnN0YW50cyAoZSwgcGkpXG4gICAgKi9cbiAgICBpc0NvbnN0YW50KCkge1xuICAgICAgICByZXR1cm4odGhpcy5pc0NvbnN0KTtcbiAgICB9XG5cbiAgICBldmFsdWF0ZShiaW5kaW5ncykge1xuICAgICAgICB2YXIgcmV0VmFsO1xuXG4gICAgICAgIGlmIChiaW5kaW5nc1t0aGlzLm5hbWVdID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc3dpdGNoKHRoaXMubmFtZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2UnOlxuICAgICAgICAgICAgICAgICAgICByZXRWYWwgPSBNYXRoLkU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3BpJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gTWF0aC5QSTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnaW5mJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gSW5maW5pdHk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2RuZSc6XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IE51bWJlci5OYU47XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVmFyaWFibGUgZXZhbHVhdGVkIHdpdGhvdXQgYmluZGluZy5cIilcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGJpbmRpbmdzW3RoaXMubmFtZV09PT0nb2JqZWN0JyAmJlxuICAgICAgICAgICAgICAgIGJpbmRpbmdzW3RoaXMubmFtZV0uY29uc3RydWN0b3IubmFtZSAhPT0gXCJOdW1iZXJcIikge1xuICAgICAgICAgICAgICAgIHJldFZhbCA9IGJpbmRpbmdzW3RoaXMubmFtZV0udmFsdWUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gYmluZGluZ3NbdGhpcy5uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihyZXRWYWwpO1xuICAgIH1cblxuICAgIGNvcHkoKSB7XG4gICAgICAgIHJldHVybihuZXcgdmFyaWFibGVfZXhwcih0aGlzLmJ0bSwgdGhpcy5uYW1lKSk7XG4gICAgfVxuXG4gICAgY29tcG9zZShiaW5kaW5ncykge1xuICAgICAgICB2YXIgcmV0VmFsO1xuXG4gICAgICAgIGlmIChiaW5kaW5nc1t0aGlzLm5hbWVdID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0VmFsID0gbmV3IHZhcmlhYmxlX2V4cHIodGhpcy5idG0sIHRoaXMubmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGJpbmRpbmdzW3RoaXMubmFtZV0gPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHJldFZhbCA9IHRoaXMuYnRtLnBhcnNlKGJpbmRpbmdzW3RoaXMubmFtZV0sIFwiZm9ybXVsYVwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0VmFsID0gYmluZGluZ3NbdGhpcy5uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihyZXRWYWwpO1xuICAgIH1cblxuICAgIGRlcml2YXRpdmUoaXZhciwgdmFyTGlzdCkge1xuICAgICAgICB2YXIgcmV0VmFsO1xuICAgICAgICB2YXIgaXZhck5hbWUgPSAodHlwZW9mIGl2YXIgPT0gJ3N0cmluZycpID8gaXZhciA6IGl2YXIubmFtZTtcblxuICAgICAgICBpZiAodGhpcy5uYW1lID09PSBpdmFyTmFtZSkge1xuICAgICAgICAgICAgcmV0VmFsID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAxKTtcblxuICAgICAgICAvLyBJZiBlaXRoZXIgYSBjb25zdGFudCBvciBhbm90aGVyIGluZGVwZW5kZW50IHZhcmlhYmxlLCBkZXJpdj0wXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0NvbnN0IHx8IHZhckxpc3QgJiYgdmFyTGlzdFt0aGlzLm5hbWVdICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0VmFsID0gbmV3IHNjYWxhcl9leHByKHRoaXMuYnRtLCAwKTtcblxuICAgICAgICAvLyBQcmVzdW1pbmcgb3RoZXIgdmFyaWFibGVzIGFyZSBkZXBlbmRlbnQgdmFyaWFibGVzLlxuICAgICAgICB9IGVsc2UgIHtcbiAgICAgICAgICAgIHJldFZhbCA9IG5ldyB2YXJpYWJsZV9leHByKHRoaXMuYnRtLCB0aGlzLm5hbWUrXCInXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihyZXRWYWwpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgIFNlZSBleHByZXNzaW9ucy5wcm90b3R5cGUubWF0Y2ggZm9yIGV4cGxhbmF0aW9uLlxuXG4gICAgICAgIEEgdmFyaWFibGUgY2FuIG1hdGNoIGFueSBleHByZXNzaW9uLiBCdXQgd2UgbmVlZCB0byBjaGVja1xuICAgICAgICBpZiB0aGUgdmFyaWFibGUgaGFzIGFscmVhZHkgbWF0Y2hlZCBhbiBleHByZXNzaW9uLiBJZiBzbyxcbiAgICAgICAgaXQgbXVzdCBiZSB0aGUgc2FtZSBhZ2Fpbi5cbiAgICAqL1xuICAgIG1hdGNoKGV4cHIsIGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciByZXRWYWx1ZSA9IG51bGw7XG5cbiAgICAgICAgLy8gU3BlY2lhbCBuYW1lZCBjb25zdGFudHMgY2FuIG5vdCBtYXRjaCBleHByZXNzaW9ucy5cbiAgICAgICAgaWYgKHRoaXMuaXNDb25zdCkge1xuICAgICAgICAgICAgaWYgKGV4cHIudG9TdHJpbmcoKSA9PT0gdGhpcy5uYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0VmFsdWUgPSBiaW5kaW5ncztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAvLyBJZiBuZXZlciBwcmV2aW91c2x5IGFzc2lnbmVkLCBjYW4gbWF0Y2ggYW55IGV4cHJlc3Npb24uXG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZ3MgIT0gbnVsbCAmJiBiaW5kaW5nc1t0aGlzLm5hbWVdID09IHVuZGVmaW5lZCAmJiBleHByLnZhbHVlVHlwZSA9PSBleHByVmFsdWUubnVtZXJpYykge1xuICAgICAgICAgICAgcmV0VmFsdWUgPSBiaW5kaW5ncztcbiAgICAgICAgICAgIHJldFZhbHVlW3RoaXMubmFtZV0gPSBleHByLnRvU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZ3MgIT0gbnVsbCAmJiBiaW5kaW5nc1t0aGlzLm5hbWVdID09IGV4cHIudG9TdHJpbmcoKSkge1xuICAgICAgICAgICAgcmV0VmFsdWUgPSBiaW5kaW5ncztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybihyZXRWYWx1ZSk7XG4gICAgfVxufVxuXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgKiBEZWZpbmUgdGhlIEluZGV4IEV4cHJlc3Npb24gLS0gYSByZWZlcmVuY2UgaW50byBhIGxpc3RcbiAgICAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5leHBvcnQgY2xhc3MgaW5kZXhfZXhwciB7XG4gICAgXG4gICAgY29uc3RydWN0b3IoYnRtLCBuYW1lLCBpbmRleCkge1xuICAgICAgICB0aGlzLmJ0bSA9IGJ0bTtcbiAgICAgICAgaWYgKCEoYnRtIGluc3RhbmNlb2YgQlRNKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ2YXJpYWJsZV9leHByIGNvbnN0cnVjdGVkIHdpdGggaW52YWxpZCBlbnZpcm9ubWVudFwiKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudHlwZSA9IGV4cHJUeXBlLnZhcmlhYmxlO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnNlbGVjdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmJvdW5kTmFtZSA9IFwiW11cIituYW1lO1xuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgdmFyIGRlcEFycmF5ID0gaW5kZXguZGVwZW5kZW5jaWVzKCk7XG4gICAgICAgIGlmIChkZXBBcnJheS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBhbGVydChcIkFuIGFycmF5IHJlZmVyZW5jZSBjYW4gb25seSBoYXZlIG9uZSBpbmRleCB2YXJpYWJsZS5cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmsgPSBkZXBBcnJheVswXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvU3RyaW5nKGVsZW1lbnRPbmx5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgZWxlbWVudE9ubHkgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGVsZW1lbnRPbmx5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHRoaXMubmFtZSArIFwiW1wiICsgdGhpcy5pbmRleC50b1N0cmluZygpICsgXCJdXCIpO1xuICAgIH1cblxuICAgIHRvVGVYKHNob3dTZWxlY3QpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzaG93U2VsZWN0ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBzaG93U2VsZWN0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgd29yZCA9IHRoaXMubmFtZSArIFwiX3tcIiArIHRoaXMuaW5kZXgudG9TdHJpbmcoKSArIFwifVwiO1xuICAgICAgICBpZiAoc2hvd1NlbGVjdCAmJiB0aGlzLnNlbGVjdCkge1xuICAgICAgICAgICAgd29yZCA9IFwie1xcXFxjb2xvcntyZWR9XCIgKyB3b3JkICsgXCJ9XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHdvcmQpO1xuICAgIH1cblxuICAgIHRvTWF0aE1MKCkge1xuICAgICAgICByZXR1cm4oXCI8YXBwbHk+PHNlbGVjdG9yLz48Y2kgdHlwZT1cXFwidmVjdG9yXFxcIj5cIiArIHRoaXMubmFtZSArIFwiPC9jaT5cIiArIHRoaXMuaW5kZXgudG9TdHJpbmcoKSArIFwiPC9hcHBseT5cIik7XG4gICAgfVxuXG4gICAgZGVwZW5kZW5jaWVzKGZvcmNlZCkge1xuICAgICAgICB2YXIgZGVwQXJyYXkgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgaWYgKGZvcmNlZCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxmb3JjZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkZXBBcnJheS5wdXNoKGZvcmNlZFtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoKHRoaXMubmFtZSkge1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBkZXBBcnJheS5wdXNoKFwicm93XCIpO1xuICAgICAgICAgICAgICAgIGRlcEFycmF5LnB1c2godGhpcy5ib3VuZE5hbWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybihkZXBBcnJheSk7XG4gICAgfVxuXG4gICAgZXZhbHVhdGUoYmluZGluZ3MpIHtcbiAgICAgICAgdmFyIHJldFZhbDtcblxuICAgICAgICBpZiAoYmluZGluZ3NbdGhpcy5ib3VuZE5hbWVdID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc3dpdGNoKHRoaXMubmFtZSkge1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJldFZhbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdG1wQmluZCA9IHt9O1xuICAgICAgICAgICAgaWYgKHRoaXMuayAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0bXBCaW5kW3RoaXMua10gPSBiaW5kaW5nc1tcInJvd1wiXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBpID0gdGhpcy5pbmRleC5ldmFsdWF0ZSh0bXBCaW5kKS0xO1xuICAgICAgICAgICAgaWYgKGkgPj0gMCAmJiBpPGJpbmRpbmdzW3RoaXMuYm91bmROYW1lXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXRWYWwgPSBiaW5kaW5nc1t0aGlzLmJvdW5kTmFtZV1baV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ocmV0VmFsKTtcbiAgICB9XG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9