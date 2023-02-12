(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_parsons_js_timedparsons_js"],{

/***/ 44098:
/*!*******************************************!*\
  !*** ./runestone/parsons/css/parsons.css ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 99786:
/*!********************************************!*\
  !*** ./runestone/parsons/css/prettify.css ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 12732:
/*!*******************************************!*\
  !*** ./runestone/parsons/js/dagGrader.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DAGGrader)
/* harmony export */ });
/* harmony import */ var _lineGrader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lineGrader */ 21417);
/* harmony import */ var _dagHelpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dagHelpers */ 17341);



function graphToNX(answerLines) {
  var graph = new _dagHelpers__WEBPACK_IMPORTED_MODULE_1__.DiGraph();
  for (let line1 of answerLines) {
    graph.addNode(line1.tag);
    for (let line2tag of line1.depends) {
      // the depends graph lists the *incoming* edges of a node
      graph.addEdge(line2tag, line1.tag);
    }
  }
  return graph;
}

function isVertexCover(graph, vertexCover) {
  for (let edge of graph.edges()) {
    if (!(vertexCover.has(edge[0]) || vertexCover.has(edge[1]))) {
      return false;
    }
  }
  return true;
}

// Find all subsets of the set using the correspondence of subsets of
// a set to binary string whose length are the size of the set
function allSubsets(arr) {
  let subsets = {};
  for (let i = 0; i <= arr.length; i++) {
    subsets[i] = [];
  }
  for (let i = 0; i < Math.pow(2, arr.length); i++) {
    let bin = i.toString(2);
    while (bin.length < arr.length) {
      bin = "0" + bin;
    }
    let subset = new Set();
    for (let j = 0; j < bin.length; j++) {
      if (bin[j] == "1") {
        subset.add(arr[j]);
      }
    }
    subsets[subset.size].push(subset);
  }
  return subsets;
}

class DAGGrader extends _lineGrader__WEBPACK_IMPORTED_MODULE_0__["default"] {
  inverseLISIndices(arr, inSolution) {
    // For more details and a proof of the correctness of the algorithm, see the paper: https://arxiv.org/abs/2204.04196

    var solution = this.problem.solution;
    var answerLines = inSolution.map((block) => block.lines[0]); // assume NOT adaptive for DAG grading (for now)

    let graph = graphToNX(solution);

    let seen = new Set();
    let problematicSubgraph = new _dagHelpers__WEBPACK_IMPORTED_MODULE_1__.DiGraph();
    for (let line1 of answerLines) {
      for (let line2 of seen) {
        let problematic = (0,_dagHelpers__WEBPACK_IMPORTED_MODULE_1__.hasPath)(graph, {
          source: line1.tag,
          target: line2.tag,
        });
        if (problematic) {
          problematicSubgraph.addEdge(line1.tag, line2.tag);
        }
      }

      seen.add(line1);
    }

    let mvc = null;
    let subsets = allSubsets(problematicSubgraph.nodes());
    for (let i = 0; i <= problematicSubgraph.numberOfNodes(); i++) {
      for (let subset of subsets[i]) {
        if (isVertexCover(problematicSubgraph, subset)) {
          mvc = subset;
          break;
        }
      }
      if (mvc != null) {
        break;
      }
    }

    let indices = [...mvc].map((tag) => {
      for (let i = 0; i < answerLines.length; i++) {
        if (answerLines[i].tag === tag) return i;
      }
    });
    return indices;
  }

  checkCorrectIndentation(solutionLines, answerLines) {
      this.indentLeft = [];
      this.indentRight = [];

      let indentationByTag = {};
      for (let i = 0; i < solutionLines.length; i++) {
        const line = solutionLines[i];
        indentationByTag[line.tag] = line.indent;
      }

      let loopLimit = Math.min(solutionLines.length, answerLines.length);
      for (let i = 0; i < loopLimit; i++) {
          let solutionIndent = indentationByTag[answerLines[i].tag];
          if (answerLines[i].viewIndent() < solutionIndent) {
              this.indentRight.push(answerLines[i]);
          } else if (answerLines[i].viewIndent() > solutionIndent) {
              this.indentLeft.push(answerLines[i]);
          }
      }
      this.incorrectIndents =
          this.indentLeft.length + this.indentRight.length;

      return this.incorrectIndents == 0;
  }

  checkCorrectOrdering(solutionLines, answerLines) {
    if (!(0,_dagHelpers__WEBPACK_IMPORTED_MODULE_1__.isDirectedAcyclicGraph)(graphToNX(solutionLines))) {
      throw "Dependency between blocks does not form a Directed Acyclic Graph; Problem unsolvable.";
    }

    let seen = new Set();
    let isCorrectOrder = true;
    this.correctLines = 0;
    this.solutionLength = solutionLines.length;
    let loopLimit = Math.min(solutionLines.length, answerLines.length);
    for (let i = 0; i < loopLimit; i++) {
      let line = answerLines[i];
      if (line.distractor) {
        isCorrectOrder = false;
      } else {
        for (let j = 0; j < line.depends.length; j++) {
          if (!seen.has(line.depends[j])) {
            isCorrectOrder = false;
          }
        }
      }
      if (isCorrectOrder) {
        this.correctLines += 1;
      }
      seen.add(line.tag);
    }
    return isCorrectOrder;
  }
}


/***/ }),

/***/ 17341:
/*!********************************************!*\
  !*** ./runestone/parsons/js/dagHelpers.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DiGraph": () => (/* binding */ DiGraph),
/* harmony export */   "hasPath": () => (/* binding */ hasPath),
/* harmony export */   "isDirectedAcyclicGraph": () => (/* binding */ isDirectedAcyclicGraph)
/* harmony export */ });

/**
 * This file adapted from JSNetworkX: https://github.com/fkling/JSNetworkX
 * Copyright (C) 2012 Felix Kling <felix.kling@gmx.net>
 * JSNetworkX is distributed with the BSD license
 */

function hasPath(G, { source, target }) {
  try {
    bidirectionalShortestPath(G, source, target);
  } catch (error) {
    if (error instanceof JSNetworkXNoPath) {
      return false;
    }
    throw error;
  }
  return true;
}

function nodesAreEqual(a, b) {
  return a === b || (typeof a === "object" && a.toString() === b.toString());
}

function bidirectionalShortestPath(G, source, target) {
  // call helper to do the real work
  var [pred, succ, w] = bidirectionalPredSucc(G, source, target);

  // build path from pred+w+succ
  var path = [];
  // from source to w
  while (w != null) {
    path.push(w);
    w = pred.get(w);
  }
  w = succ.get(path[0]);
  path.reverse();
  // from w to target
  while (w != null) {
    path.push(w);
    w = succ.get(w);
  }
  return path;
}

function bidirectionalPredSucc(G, source, target) {
  // does BFS from both source and target and meets in the middle
  if (nodesAreEqual(source, target)) {
    return [new Map([[source, null]]), new Map([[target, null]]), source];
  }

  // handle either directed or undirected
  var gpred, gsucc;
  gpred = G.predecessorsIter.bind(G);
  gsucc = G.successorsIter.bind(G);

  // predecesssor and successors in search
  var pred = new Map([[source, null]]);
  var succ = new Map([[target, null]]);
  //
  // initialize fringes, start with forward
  var forwardFringe = [source];
  var reverseFringe = [target];
  var thisLevel;

  /*jshint newcap:false*/
  while (forwardFringe.length > 0 && reverseFringe.length > 0) {
    if (forwardFringe.length <= reverseFringe.length) {
      thisLevel = forwardFringe;
      forwardFringe = [];
      for (let v of thisLevel) {
        for (let w of gsucc(v)) {
          if (!pred.has(w)) {
            forwardFringe.push(w);
            pred.set(w, v);
          }
          if (succ.has(w)) {
            return [pred, succ, w]; // found path
          }
        }
      }
    } else {
      thisLevel = reverseFringe;
      reverseFringe = [];
      for (let v of thisLevel) {
        for (let w of gpred(v)) {
          if (!succ.has(w)) {
            reverseFringe.push(w);
            succ.set(w, v);
          }
          if (pred.has(w)) {
            return [pred, succ, w]; // found path
          }
        }
      }
    }
  }
  throw new JSNetworkXNoPath(
    "No path between " + source.toString() + " and " + target.toString() + "."
  );
}

function topologicalSort(G, optNbunch) {
  // nonrecursive version
  var seen = new Set();
  var orderExplored = []; // provide order and
  // fast search without more general priorityDictionary
  var explored = new Set();

  if (optNbunch == null) {
    optNbunch = G.nodesIter();
  }

  for (let v of optNbunch) {
    // process all vertices in G
    if (explored.has(v)) {
      return; // continue
    }

    var fringe = [v]; // nodes yet to look at
    while (fringe.length > 0) {
      var w = fringe[fringe.length - 1]; // depth first search
      if (explored.has(w)) {
        // already looked down this branch
        fringe.pop();
        continue;
      }
      seen.add(w); // mark as seen
      // Check successors for cycles for new nodes
      var newNodes = [];
      /*eslint-disable no-loop-func*/
      G.get(w).forEach(function (_, n) {
        if (!explored.has(n)) {
          if (seen.has(n)) {
            // CYCLE !!
            throw new JSNetworkXUnfeasible("Graph contains a cycle.");
          }
          newNodes.push(n);
        }
      });
      /*eslint-enable no-loop-func*/
      if (newNodes.length > 0) {
        // add new nodes to fringe
        fringe.push.apply(fringe, newNodes);
      } else {
        explored.add(w);
        orderExplored.unshift(w);
      }
    }
  }

  return orderExplored;
}

function isDirectedAcyclicGraph(G) {
  try {
    topologicalSort(G);
    return true;
  } catch (ex) {
    if (ex instanceof JSNetworkXUnfeasible) {
      return false;
    }
    throw ex;
  }
}

class DiGraph {
  constructor() {
    this.graph = {}; // dictionary for graph attributes
    this.node = new Map(); // dictionary for node attributes
    // We store two adjacency lists:
    // the predecessors of node n are stored in the dict self.pred
    // the successors of node n are stored in the dict self.succ=self.adj
    this.adj = new Map(); // empty adjacency dictionary
    this.pred = new Map(); // predecessor
    this.succ = this.adj; // successor

    this.edge = this.adj;
  }

  addNode(n) {
    if (!this.succ.has(n)) {
      this.succ.set(n, new Map());
      this.pred.set(n, new Map());
      this.node.set(n);
    }
  }

  addEdge(u, v) {
    // add nodes
    if (!this.succ.has(u)) {
      this.succ.set(u, new Map());
      this.pred.set(u, new Map());
      this.node.set(u, {});
    }

    if (!this.succ.has(v)) {
      this.succ.set(v, new Map());
      this.pred.set(v, new Map());
      this.node.set(v, {});
    }

    // add the edge
    var datadict = this.adj.get(u).get(v) || {};
    this.succ.get(u).set(v, datadict);
    this.pred.get(v).set(u, datadict);
  }

  nodes(optData = false) {
    return Array.from(optData ? this.node.entries() : this.node.keys());
  }

  edges(optNbunch, optData = false) {
    return Array.from(this.edgesIter(optNbunch, optData));
  }

  nodesIter(optData = false) {
    if (optData) {
      return toIterator(this.node);
    }
    return this.node.keys();
  }

  get(n) {
    var value = this.adj.get(n);
    if (typeof value === "undefined") {
      throw new KeyError("Graph does not contain node " + n + ".");
    }
    return value;
  }

  numberOfNodes() {
    return this.node.size;
  }

  *nbunchIter(optNbunch) {
    if (optNbunch == null) {
      // include all nodes
      /*jshint expr:true*/
      yield* this.adj.keys();
    } else if (this.hasNode(optNbunch)) {
      // if nbunch is a single node
      yield optNbunch;
    } else {
      // if nbunch is a sequence of nodes
      var adj = this.adj;

      try {
        for (var n of toIterator(optNbunch)) {
          if (adj.has(n)) {
            yield n;
          }
        }
      } catch (ex) {
        if (ex instanceof TypeError) {
          throw new JSNetworkXError(
            "nbunch is not a node or a sequence of nodes"
          );
        }
      }
    }
  }

  *edgesIter(optNbunch, optData = false) {
    // handle calls with opt_data being the only argument
    if (isBoolean(optNbunch)) {
      optData = optNbunch;
      optNbunch = undefined;
    }

    var nodesNbrs;

    if (optNbunch === undefined) {
      nodesNbrs = this.adj;
    } else {
      nodesNbrs = mapIterator(this.nbunchIter(optNbunch), (n) =>
        tuple2(n, this.adj.get(n))
      );
    }

    for (var nodeNbrs of nodesNbrs) {
      for (var nbrData of nodeNbrs[1]) {
        var result = [nodeNbrs[0], nbrData[0]];
        if (optData) {
          result[2] = nbrData[1];
        }
        yield result;
      }
    }
  }

  reverse(optCopy = true) {
    var H;
    if (optCopy) {
      H = new this.constructor(null, {
        name: "Reverse of (" + this.name + ")",
      });
      H.addNodesFrom(this);
      H.addEdgesFrom(
        mapIterator(this.edgesIter(null, true), (edge) =>
          tuple3c(edge[1], edge[0], deepcopy(edge[2]), edge)
        )
      );
      H.graph = deepcopy(this.graph);
      H.node = deepcopy(this.node);
    } else {
      var thisPred = this.pred;
      var thisSucc = this.succ;

      this.succ = thisPred;
      this.pred = thisSucc;
      this.adj = this.succ;
      H = this;
    }
    return H;
  }

  successorsIter(n) {
    var nbrs = this.succ.get(n);
    if (nbrs !== undefined) {
      return nbrs.keys();
    }
    throw new JSNetworkXError(
      sprintf('The node "%j" is not in the digraph.', n)
    );
  }

  predecessorsIter(n) {
    var nbrs = this.pred.get(n);
    if (nbrs !== undefined) {
      return nbrs.keys();
    }
    throw new JSNetworkXError(
      sprintf('The node "%j" is not in the digraph.', n)
    );
  }

  successors(n) {
    return Array.from(this.successorsIter(n));
  }

  predecessors(n) {
    return Array.from(this.predecessorsIter(n));
  }
}

class JSNetworkXException {
  constructor(message) {
    this.name = "JSNetworkXException";
    this.message = message;
  }
}

class JSNetworkXAlgorithmError extends JSNetworkXException {
  constructor(message) {
    super(message);
    this.name = "JSNetworkXAlgorithmError";
  }
}

class JSNetworkXError extends JSNetworkXException {
  constructor(message) {
    super(message);
    this.name = "JSNetworkXError";
  }
}

class JSNetworkXUnfeasible extends JSNetworkXAlgorithmError {
  constructor(message) {
    super(message);
    this.name = "JSNetworkXUnfeasible";
  }
}

class JSNetworkXNoPath extends JSNetworkXUnfeasible {
  constructor(message) {
    super(message);
    this.name = "JSNetworkXNoPath";
  }
}

// function from LoDash, needed by functions from JSNetworkX
function isObjectLike(value) {
  return !!value && typeof value == "object";
}

// function from LoDash, needed by functions from JSNetworkX
function isBoolean(value) {
  var boolTag = "[object Boolean]";
  return (
    value === true ||
    value === false ||
    (isObjectLike(value) && Object.prototype.toString.call(value) == boolTag)
  );
}


/***/ }),

/***/ 97430:
/*!********************************************!*\
  !*** ./runestone/parsons/js/hammer.min.js ***!
  \********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_RESULT__;/*! Hammer.JS - v2.0.8 - 2016-04-23
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
!function(a,b,c,d){"use strict";function e(a,b,c){return setTimeout(j(a,c),b)}function f(a,b,c){return Array.isArray(a)?(g(a,c[b],c),!0):!1}function g(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function h(b,c,d){var e="DEPRECATED METHOD: "+c+"\n"+d+" AT \n";return function(){var c=new Error("get-stack-trace"),d=c&&c.stack?c.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",f=a.console&&(a.console.warn||a.console.log);return f&&f.call(a.console,e,d),b.apply(this,arguments)}}function i(a,b,c){var d,e=b.prototype;d=a.prototype=Object.create(e),d.constructor=a,d._super=e,c&&la(d,c)}function j(a,b){return function(){return a.apply(b,arguments)}}function k(a,b){return typeof a==oa?a.apply(b?b[0]||d:d,b):a}function l(a,b){return a===d?b:a}function m(a,b,c){g(q(b),function(b){a.addEventListener(b,c,!1)})}function n(a,b,c){g(q(b),function(b){a.removeEventListener(b,c,!1)})}function o(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function p(a,b){return a.indexOf(b)>-1}function q(a){return a.trim().split(/\s+/g)}function r(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function s(a){return Array.prototype.slice.call(a,0)}function t(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];r(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function u(a,b){for(var c,e,f=b[0].toUpperCase()+b.slice(1),g=0;g<ma.length;){if(c=ma[g],e=c?c+f:b,e in a)return e;g++}return d}function v(){return ua++}function w(b){var c=b.ownerDocument||b;return c.defaultView||c.parentWindow||a}function x(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){k(a.options.enable,[a])&&c.handler(b)},this.init()}function y(a){var b,c=a.options.inputClass;return new(b=c?c:xa?M:ya?P:wa?R:L)(a,z)}function z(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&Ea&&d-e===0,g=b&(Ga|Ha)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,A(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function A(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=D(b)),e>1&&!c.firstMultiple?c.firstMultiple=D(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=E(d);b.timeStamp=ra(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=I(h,i),b.distance=H(h,i),B(c,b),b.offsetDirection=G(b.deltaX,b.deltaY);var j=F(b.deltaTime,b.deltaX,b.deltaY);b.overallVelocityX=j.x,b.overallVelocityY=j.y,b.overallVelocity=qa(j.x)>qa(j.y)?j.x:j.y,b.scale=g?K(g.pointers,d):1,b.rotation=g?J(g.pointers,d):0,b.maxPointers=c.prevInput?b.pointers.length>c.prevInput.maxPointers?b.pointers.length:c.prevInput.maxPointers:b.pointers.length,C(c,b);var k=a.element;o(b.srcEvent.target,k)&&(k=b.srcEvent.target),b.target=k}function B(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};b.eventType!==Ea&&f.eventType!==Ga||(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function C(a,b){var c,e,f,g,h=a.lastInterval||b,i=b.timeStamp-h.timeStamp;if(b.eventType!=Ha&&(i>Da||h.velocity===d)){var j=b.deltaX-h.deltaX,k=b.deltaY-h.deltaY,l=F(i,j,k);e=l.x,f=l.y,c=qa(l.x)>qa(l.y)?l.x:l.y,g=G(j,k),a.lastInterval=b}else c=h.velocity,e=h.velocityX,f=h.velocityY,g=h.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g}function D(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:pa(a.pointers[c].clientX),clientY:pa(a.pointers[c].clientY)},c++;return{timeStamp:ra(),pointers:b,center:E(b),deltaX:a.deltaX,deltaY:a.deltaY}}function E(a){var b=a.length;if(1===b)return{x:pa(a[0].clientX),y:pa(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:pa(c/b),y:pa(d/b)}}function F(a,b,c){return{x:b/a||0,y:c/a||0}}function G(a,b){return a===b?Ia:qa(a)>=qa(b)?0>a?Ja:Ka:0>b?La:Ma}function H(a,b,c){c||(c=Qa);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function I(a,b,c){c||(c=Qa);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function J(a,b){return I(b[1],b[0],Ra)+I(a[1],a[0],Ra)}function K(a,b){return H(b[0],b[1],Ra)/H(a[0],a[1],Ra)}function L(){this.evEl=Ta,this.evWin=Ua,this.pressed=!1,x.apply(this,arguments)}function M(){this.evEl=Xa,this.evWin=Ya,x.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function N(){this.evTarget=$a,this.evWin=_a,this.started=!1,x.apply(this,arguments)}function O(a,b){var c=s(a.touches),d=s(a.changedTouches);return b&(Ga|Ha)&&(c=t(c.concat(d),"identifier",!0)),[c,d]}function P(){this.evTarget=bb,this.targetIds={},x.apply(this,arguments)}function Q(a,b){var c=s(a.touches),d=this.targetIds;if(b&(Ea|Fa)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=s(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return o(a.target,i)}),b===Ea)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Ga|Ha)&&delete d[g[e].identifier],e++;return h.length?[t(f.concat(h),"identifier",!0),h]:void 0}function R(){x.apply(this,arguments);var a=j(this.handler,this);this.touch=new P(this.manager,a),this.mouse=new L(this.manager,a),this.primaryTouch=null,this.lastTouches=[]}function S(a,b){a&Ea?(this.primaryTouch=b.changedPointers[0].identifier,T.call(this,b)):a&(Ga|Ha)&&T.call(this,b)}function T(a){var b=a.changedPointers[0];if(b.identifier===this.primaryTouch){var c={x:b.clientX,y:b.clientY};this.lastTouches.push(c);var d=this.lastTouches,e=function(){var a=d.indexOf(c);a>-1&&d.splice(a,1)};setTimeout(e,cb)}}function U(a){for(var b=a.srcEvent.clientX,c=a.srcEvent.clientY,d=0;d<this.lastTouches.length;d++){var e=this.lastTouches[d],f=Math.abs(b-e.x),g=Math.abs(c-e.y);if(db>=f&&db>=g)return!0}return!1}function V(a,b){this.manager=a,this.set(b)}function W(a){if(p(a,jb))return jb;var b=p(a,kb),c=p(a,lb);return b&&c?jb:b||c?b?kb:lb:p(a,ib)?ib:hb}function X(){if(!fb)return!1;var b={},c=a.CSS&&a.CSS.supports;return["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach(function(d){b[d]=c?a.CSS.supports("touch-action",d):!0}),b}function Y(a){this.options=la({},this.defaults,a||{}),this.id=v(),this.manager=null,this.options.enable=l(this.options.enable,!0),this.state=nb,this.simultaneous={},this.requireFail=[]}function Z(a){return a&sb?"cancel":a&qb?"end":a&pb?"move":a&ob?"start":""}function $(a){return a==Ma?"down":a==La?"up":a==Ja?"left":a==Ka?"right":""}function _(a,b){var c=b.manager;return c?c.get(a):a}function aa(){Y.apply(this,arguments)}function ba(){aa.apply(this,arguments),this.pX=null,this.pY=null}function ca(){aa.apply(this,arguments)}function da(){Y.apply(this,arguments),this._timer=null,this._input=null}function ea(){aa.apply(this,arguments)}function fa(){aa.apply(this,arguments)}function ga(){Y.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function ha(a,b){return b=b||{},b.recognizers=l(b.recognizers,ha.defaults.preset),new ia(a,b)}function ia(a,b){this.options=la({},ha.defaults,b||{}),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=a,this.input=y(this),this.touchAction=new V(this,this.options.touchAction),ja(this,!0),g(this.options.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function ja(a,b){var c=a.element;if(c.style){var d;g(a.options.cssProps,function(e,f){d=u(c.style,f),b?(a.oldCssProps[d]=c.style[d],c.style[d]=e):c.style[d]=a.oldCssProps[d]||""}),b||(a.oldCssProps={})}}function ka(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var la,ma=["","webkit","Moz","MS","ms","o"],na=b.createElement("div"),oa="function",pa=Math.round,qa=Math.abs,ra=Date.now;la="function"!=typeof Object.assign?function(a){if(a===d||null===a)throw new TypeError("Cannot convert undefined or null to object");for(var b=Object(a),c=1;c<arguments.length;c++){var e=arguments[c];if(e!==d&&null!==e)for(var f in e)e.hasOwnProperty(f)&&(b[f]=e[f])}return b}:Object.assign;var sa=h(function(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a},"extend","Use `assign`."),ta=h(function(a,b){return sa(a,b,!0)},"merge","Use `assign`."),ua=1,va=/mobile|tablet|ip(ad|hone|od)|android/i,wa="ontouchstart"in a,xa=u(a,"PointerEvent")!==d,ya=wa&&va.test(navigator.userAgent),za="touch",Aa="pen",Ba="mouse",Ca="kinect",Da=25,Ea=1,Fa=2,Ga=4,Ha=8,Ia=1,Ja=2,Ka=4,La=8,Ma=16,Na=Ja|Ka,Oa=La|Ma,Pa=Na|Oa,Qa=["x","y"],Ra=["clientX","clientY"];x.prototype={handler:function(){},init:function(){this.evEl&&m(this.element,this.evEl,this.domHandler),this.evTarget&&m(this.target,this.evTarget,this.domHandler),this.evWin&&m(w(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&n(this.element,this.evEl,this.domHandler),this.evTarget&&n(this.target,this.evTarget,this.domHandler),this.evWin&&n(w(this.element),this.evWin,this.domHandler)}};var Sa={mousedown:Ea,mousemove:Fa,mouseup:Ga},Ta="mousedown",Ua="mousemove mouseup";i(L,x,{handler:function(a){var b=Sa[a.type];b&Ea&&0===a.button&&(this.pressed=!0),b&Fa&&1!==a.which&&(b=Ga),this.pressed&&(b&Ga&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:Ba,srcEvent:a}))}});var Va={pointerdown:Ea,pointermove:Fa,pointerup:Ga,pointercancel:Ha,pointerout:Ha},Wa={2:za,3:Aa,4:Ba,5:Ca},Xa="pointerdown",Ya="pointermove pointerup pointercancel";a.MSPointerEvent&&!a.PointerEvent&&(Xa="MSPointerDown",Ya="MSPointerMove MSPointerUp MSPointerCancel"),i(M,x,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=Va[d],f=Wa[a.pointerType]||a.pointerType,g=f==za,h=r(b,a.pointerId,"pointerId");e&Ea&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Ga|Ha)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var Za={touchstart:Ea,touchmove:Fa,touchend:Ga,touchcancel:Ha},$a="touchstart",_a="touchstart touchmove touchend touchcancel";i(N,x,{handler:function(a){var b=Za[a.type];if(b===Ea&&(this.started=!0),this.started){var c=O.call(this,a,b);b&(Ga|Ha)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:za,srcEvent:a})}}});var ab={touchstart:Ea,touchmove:Fa,touchend:Ga,touchcancel:Ha},bb="touchstart touchmove touchend touchcancel";i(P,x,{handler:function(a){var b=ab[a.type],c=Q.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:za,srcEvent:a})}});var cb=2500,db=25;i(R,x,{handler:function(a,b,c){var d=c.pointerType==za,e=c.pointerType==Ba;if(!(e&&c.sourceCapabilities&&c.sourceCapabilities.firesTouchEvents)){if(d)S.call(this,b,c);else if(e&&U.call(this,c))return;this.callback(a,b,c)}},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var eb=u(na.style,"touchAction"),fb=eb!==d,gb="compute",hb="auto",ib="manipulation",jb="none",kb="pan-x",lb="pan-y",mb=X();V.prototype={set:function(a){a==gb&&(a=this.compute()),fb&&this.manager.element.style&&mb[a]&&(this.manager.element.style[eb]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return g(this.manager.recognizers,function(b){k(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),W(a.join(" "))},preventDefaults:function(a){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=p(d,jb)&&!mb[jb],f=p(d,lb)&&!mb[lb],g=p(d,kb)&&!mb[kb];if(e){var h=1===a.pointers.length,i=a.distance<2,j=a.deltaTime<250;if(h&&i&&j)return}return g&&f?void 0:e||f&&c&Na||g&&c&Oa?this.preventSrc(b):void 0},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var nb=1,ob=2,pb=4,qb=8,rb=qb,sb=16,tb=32;Y.prototype={defaults:{},set:function(a){return la(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(f(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=_(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return f(a,"dropRecognizeWith",this)?this:(a=_(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(f(a,"requireFailure",this))return this;var b=this.requireFail;return a=_(a,this),-1===r(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(f(a,"dropRequireFailure",this))return this;a=_(a,this);var b=r(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function b(b){c.manager.emit(b,a)}var c=this,d=this.state;qb>d&&b(c.options.event+Z(d)),b(c.options.event),a.additionalEvent&&b(a.additionalEvent),d>=qb&&b(c.options.event+Z(d))},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=tb)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(tb|nb)))return!1;a++}return!0},recognize:function(a){var b=la({},a);return k(this.options.enable,[this,b])?(this.state&(rb|sb|tb)&&(this.state=nb),this.state=this.process(b),void(this.state&(ob|pb|qb|sb)&&this.tryEmit(b))):(this.reset(),void(this.state=tb))},process:function(a){},getTouchAction:function(){},reset:function(){}},i(aa,Y,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(ob|pb),e=this.attrTest(a);return d&&(c&Ha||!e)?b|sb:d||e?c&Ga?b|qb:b&ob?b|pb:ob:tb}}),i(ba,aa,{defaults:{event:"pan",threshold:10,pointers:1,direction:Pa},getTouchAction:function(){var a=this.options.direction,b=[];return a&Na&&b.push(lb),a&Oa&&b.push(kb),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Na?(e=0===f?Ia:0>f?Ja:Ka,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?Ia:0>g?La:Ma,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return aa.prototype.attrTest.call(this,a)&&(this.state&ob||!(this.state&ob)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=$(a.direction);b&&(a.additionalEvent=this.options.event+b),this._super.emit.call(this,a)}}),i(ca,aa,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[jb]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&ob)},emit:function(a){if(1!==a.scale){var b=a.scale<1?"in":"out";a.additionalEvent=this.options.event+b}this._super.emit.call(this,a)}}),i(da,Y,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[hb]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Ga|Ha)&&!f)this.reset();else if(a.eventType&Ea)this.reset(),this._timer=e(function(){this.state=rb,this.tryEmit()},b.time,this);else if(a.eventType&Ga)return rb;return tb},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===rb&&(a&&a.eventType&Ga?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=ra(),this.manager.emit(this.options.event,this._input)))}}),i(ea,aa,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[jb]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&ob)}}),i(fa,aa,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:Na|Oa,pointers:1},getTouchAction:function(){return ba.prototype.getTouchAction.call(this)},attrTest:function(a){var b,c=this.options.direction;return c&(Na|Oa)?b=a.overallVelocity:c&Na?b=a.overallVelocityX:c&Oa&&(b=a.overallVelocityY),this._super.attrTest.call(this,a)&&c&a.offsetDirection&&a.distance>this.options.threshold&&a.maxPointers==this.options.pointers&&qa(b)>this.options.velocity&&a.eventType&Ga},emit:function(a){var b=$(a.offsetDirection);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),i(ga,Y,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[ib]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime<b.time;if(this.reset(),a.eventType&Ea&&0===this.count)return this.failTimeout();if(d&&f&&c){if(a.eventType!=Ga)return this.failTimeout();var g=this.pTime?a.timeStamp-this.pTime<b.interval:!0,h=!this.pCenter||H(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,h&&g?this.count+=1:this.count=1,this._input=a;var i=this.count%b.taps;if(0===i)return this.hasRequireFailures()?(this._timer=e(function(){this.state=rb,this.tryEmit()},b.interval,this),ob):rb}return tb},failTimeout:function(){return this._timer=e(function(){this.state=tb},this.options.interval,this),tb},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==rb&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),ha.VERSION="2.0.8",ha.defaults={domEvents:!1,touchAction:gb,enable:!0,inputTarget:null,inputClass:null,preset:[[ea,{enable:!1}],[ca,{enable:!1},["rotate"]],[fa,{direction:Na}],[ba,{direction:Na},["swipe"]],[ga],[ga,{event:"doubletap",taps:2},["tap"]],[da]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var ub=1,vb=2;ia.prototype={set:function(a){return la(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?vb:ub},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&rb)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===vb||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(ob|pb|qb)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof Y)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(f(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(f(a,"remove",this))return this;if(a=this.get(a)){var b=this.recognizers,c=r(b,a);-1!==c&&(b.splice(c,1),this.touchAction.update())}return this},on:function(a,b){if(a!==d&&b!==d){var c=this.handlers;return g(q(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this}},off:function(a,b){if(a!==d){var c=this.handlers;return g(q(a),function(a){b?c[a]&&c[a].splice(r(c[a],b),1):delete c[a]}),this}},emit:function(a,b){this.options.domEvents&&ka(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&ja(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},la(ha,{INPUT_START:Ea,INPUT_MOVE:Fa,INPUT_END:Ga,INPUT_CANCEL:Ha,STATE_POSSIBLE:nb,STATE_BEGAN:ob,STATE_CHANGED:pb,STATE_ENDED:qb,STATE_RECOGNIZED:rb,STATE_CANCELLED:sb,STATE_FAILED:tb,DIRECTION_NONE:Ia,DIRECTION_LEFT:Ja,DIRECTION_RIGHT:Ka,DIRECTION_UP:La,DIRECTION_DOWN:Ma,DIRECTION_HORIZONTAL:Na,DIRECTION_VERTICAL:Oa,DIRECTION_ALL:Pa,Manager:ia,Input:x,TouchAction:V,TouchInput:P,MouseInput:L,PointerEventInput:M,TouchMouseInput:R,SingleTouchInput:N,Recognizer:Y,AttrRecognizer:aa,Tap:ga,Pan:ba,Swipe:fa,Pinch:ca,Rotate:ea,Press:da,on:m,off:n,each:g,merge:ta,extend:sa,assign:la,inherit:i,bindFn:j,prefixed:u});var wb="undefined"!=typeof a?a:"undefined"!=typeof self?self:{};wb.Hammer=ha, true?!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(){return ha}).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):0}(window,document,"Hammer");
//# sourceMappingURL=hammer.min.js.map

/***/ }),

/***/ 21417:
/*!********************************************!*\
  !*** ./runestone/parsons/js/lineGrader.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LineBasedGrader)
/* harmony export */ });
class LineBasedGrader {
    constructor(problem) {
        this.problem = problem;
    }
    // Use a LIS (Longest Increasing Subsequence) algorithm to return the indexes
    // that are not part of that subsequence.
    inverseLISIndices(arr) {
        // Get all subsequences
        var allSubsequences = [];
        for (var i = 0; i < arr.length; i++) {
            var subsequenceForCurrent = [arr[i]],
                current = arr[i],
                lastElementAdded = -1;
            for (var j = i; j < arr.length; j++) {
                var subsequent = arr[j];
                if (subsequent > current && lastElementAdded < subsequent) {
                    subsequenceForCurrent.push(subsequent);
                    lastElementAdded = subsequent;
                }
            }
            allSubsequences.push(subsequenceForCurrent);
        }
        // Figure out the longest one
        var longestSubsequenceLength = -1;
        var longestSubsequence;
        for (let i in allSubsequences) {
            var subs = allSubsequences[i];
            if (subs.length > longestSubsequenceLength) {
                longestSubsequenceLength = subs.length;
                longestSubsequence = subs;
            }
        }
        // Create the inverse indexes
        var indexes = [];
        var lIndex = 0;
        for (let i = 0; i < arr.length; i++) {
            if (lIndex > longestSubsequence.length) {
                indexes.push(i);
            } else {
                if (arr[i] == longestSubsequence[lIndex]) {
                    lIndex += 1;
                } else {
                    indexes.push(i);
                }
            }
        }
        return indexes;
    }
    // grade that element, returning the state
    grade() {
        var problem = this.problem;
        problem.clearFeedback();
        this.correctLines = 0;
        this.percentLines = 0;
        this.incorrectIndents = 0;
        var solutionLines = problem.solution;
        var answerLines = problem.answerLines();
        var i;
        var state;
        this.percentLines =
            Math.min(answerLines.length, solutionLines.length) /
            Math.max(answerLines.length, solutionLines.length);
        if (answerLines.length < solutionLines.length) {
            state = "incorrectTooShort";
            this.correctLength = false;
        } else if (answerLines.length == solutionLines.length) {
            this.correctLength = true;
        } else {
            state = "incorrectMoveBlocks";
            this.correctLength = false;
        }

        // Determine whether the code **that is there** is in the correct order
        // If there is too much or too little code this only matters for
        // calculating a percentage score.
        let isCorrectOrder = this.checkCorrectOrdering(solutionLines, answerLines)

        // Determine whether blocks are indented correctly
        let isCorrectIndents = this.checkCorrectIndentation(solutionLines, answerLines);

        if (
            isCorrectIndents &&
            isCorrectOrder &&
            this.correctLength
        ) {
            // Perfect
            state = "correct";
        } else if (this.correctLength && isCorrectOrder) {
            state = "incorrectIndent";
        } else if (!isCorrectOrder && state != "incorrectTooShort") {
            state = "incorrectMoveBlocks";
        }
        this.calculatePercent();
        this.graderState = state;

        return state;
    }

    checkCorrectIndentation(solutionLines, answerLines) {
        this.indentLeft = [];
        this.indentRight = [];
        let loopLimit = Math.min(solutionLines.length, answerLines.length);
        for (let i = 0; i < loopLimit; i++) {
            if (answerLines[i].viewIndent() < answerLines[i].indent) {
                this.indentRight.push(answerLines[i]);
            } else if (answerLines[i].viewIndent() > solutionLines[i].indent) {
                this.indentLeft.push(answerLines[i]);
            }
        }
        this.incorrectIndents =
            this.indentLeft.length + this.indentRight.length;

        return this.incorrectIndents == 0;
    }

    checkCorrectOrdering(solutionLines, answerLines) {
        let isCorrectOrder = true;
        this.correctLines = 0;
        this.solutionLength = solutionLines.length;
        let loopLimit = Math.min(solutionLines.length, answerLines.length);
        for (let i = 0; i < loopLimit; i++) {
            if (answerLines[i].text !== solutionLines[i].text) {
                isCorrectOrder = false;
            } else {
                this.correctLines += 1;
            }
        }
        return isCorrectOrder
    }

    calculatePercent() {
        let numLines = this.percentLines * 0.2;
        let lines = this.problem.answerLines().length;
        let numCorrectBlocks = (this.correctLines / lines) * 0.4;
        let numCorrectIndents =
            ((this.correctLines - this.incorrectIndents) / lines) * 0.4;

        this.problem.percent = numLines + numCorrectBlocks + numCorrectIndents;
    }
}


/***/ }),

/***/ 59164:
/*!*************************************************!*\
  !*** ./runestone/parsons/js/parsons-i18n.en.js ***!
  \*************************************************/
/***/ (() => {

$.i18n().load({
    en: {
        msg_parson_check_me: "Check",
        msg_parson_reset: "Reset",
        msg_parson_help: "Help me",
        msg_parson_too_short: "Your answer is too short. Add more blocks.",
        msg_parson_drag_from_here: "Drag from here",
        msg_parson_drag_to_here: "Drop blocks here",
        msg_parson_correct_first_try:
            "Perfect!  It took you only one try to solve this.  Great job!",
        msg_parson_correct:
            "Perfect!  It took you $1 tries to solve this.  Click Reset to try to solve it in one attempt.",
        msg_parson_wrong_indent:
            "This block is not indented correctly. Either indent it more by dragging it right or reduce the indention by dragging it left.",
        msg_parson_wrong_indents:
            "These blocks are not indented correctly. To indent a block more, drag it to the right. To reduce the indention, drag it to the left.",
        msg_parson_wrong_order:
            "Highlighted blocks in your answer are wrong or are in the wrong order. This can be fixed by moving, removing, or replacing highlighted blocks.",
        msg_parson_arrow_navigate:
            "Arrow keys to navigate. Space to select / deselect block to move.",
        msg_parson_help_info:
            "Click on the Help Me button if you want to make the problem easier",
        msg_parson_not_solution:
            "Disabled an unneeded code block (one that is not part of the solution).",
        msg_parson_provided_indent: "Provided the indentation.",
        msg_parson_combined_blocks: "Combined two code blocks into one.",
        msg_parson_remove_incorrect:
            "Will remove an incorrect code block from answer area",
        msg_parson_will_combine: "Will combine two blocks",
        msg_parson_atleast_three_attempts:
            "You must make at least three distinct full attempts at a solution before you can get help",
        msg_parson_three_blocks_left:
            "There are only 3 correct blocks left.  You should be able to put them in order",
        msg_parson_will_provide_indent: "Will provide indentation",
    },
});


/***/ }),

/***/ 16432:
/*!****************************************************!*\
  !*** ./runestone/parsons/js/parsons-i18n.pt-br.js ***!
  \****************************************************/
/***/ (() => {

$.i18n().load({
    "pt-br": {
        msg_parson_check_me: "Verificar",
        msg_parson_reset: "Resetar",
        msg_parson_help:"Ajuda",
        msg_parson_too_short: "Seu programa é muito curto. Adicione mais blocos.",
        msg_parson_drag_from_here: "Arraste daqui",
        msg_parson_drag_to_here: "Largue os blocos aqui",
        msg_parson_correct_first_try:
            "Perfeito! Você levou apenas uma tentativa para resolver. Bom trabalho!",
        msg_parson_correct:
            "Perfeito! Você levou $1 tentativas para resolver. Clique em Resetar para tentar resolver em uma tentativa." ,
        msg_parson_wrong_indent:
            "Este bloco não está indentado corretamente. Indente mais arrastando-o para a direita ou reduza a indentação arrastando para a esquerda.",
        msg_parson_wrong_indents:
            "Estes blocos não estão indentados corretamente. Para indentar mais, arraste o bloco para a direita. Para reduzir a indentação, arraste para a esquerda.",
        msg_parson_wrong_order:
            "Blocos destacados no seu programa estão errados ou estão na ordem errada. Isso pode ser resolvido movendo, excluindo ou substituindo os blocos destacados.",
        msg_parson_arrow_navigate:
            "Use as teclas de setas para navegar. Espaço para selecionar/ desmarcar blocos para mover.",
        msg_parson_help_info:
            "Clique no botão Ajuda se você quiser facilitar o problema",
        msg_parson_not_solution:
            "Foi desabilitado um bloco de código desnecessário (que não faz parte da solução).",
        msg_parson_provided_indent:"Foi fornecida a indentação.",
        msg_parson_combined_blocks:"Dois blocos de códigos foram combinados em um.",
        msg_parson_remove_incorrect:
            "Será removido um bloco de código incorreto da área de resposta",
        msg_parson_will_combine:"Serão combinados dois blocos",
        msg_parson_atleast_three_attempts:
            "Você deve tentar pelo menos três vezes antes de pedir ajuda",
        msg_parson_three_blocks_left:
            "Restam apenas 3 blocos corretos. Você deve colocá-los em ordem",
        msg_parson_will_provide_indent: "Será fornecida a indentação"
    },
});


/***/ }),

/***/ 35718:
/*!*****************************************!*\
  !*** ./runestone/parsons/js/parsons.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Parsons),
/* harmony export */   "prsList": () => (/* binding */ prsList)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 2568);
/* harmony import */ var _parsons_i18n_en_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parsons-i18n.en.js */ 59164);
/* harmony import */ var _parsons_i18n_en_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_parsons_i18n_en_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _parsons_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./parsons-i18n.pt-br.js */ 16432);
/* harmony import */ var _parsons_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_parsons_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _prettify_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./prettify.js */ 87904);
/* harmony import */ var _prettify_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_prettify_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _css_parsons_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../css/parsons.css */ 44098);
/* harmony import */ var _css_prettify_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../css/prettify.css */ 99786);
/* harmony import */ var _lineGrader__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./lineGrader */ 21417);
/* harmony import */ var _dagGrader__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./dagGrader */ 12732);
/* harmony import */ var _parsonsLine__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./parsonsLine */ 18423);
/* harmony import */ var _parsonsBlock__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./parsonsBlock */ 404);
/* =====================================================================
==== Parsons Runestone Directive Javascript ============================
======== Renders a Parsons problem based on the HTML created by the
======== parsons.py script and the RST file.
==== CONTRIBUTORS ======================================================
======== Isaiah Mayerchak
======== Jeff Rick
======== Barbara Ericson
======== Cole Bowers
==== Adapted form the original JS Parsons by ===========================
======== Ville Karavirta
======== Petri Ihantola
======== Juha Helminen
======== Mike Hewner
===================================================================== */
/* =====================================================================
==== LineBasedGrader Object ============================================
======== Used for grading a Parsons problem.
==== PROPERTIES ========================================================
======== problem: the Parsons problem
===================================================================== */













/* =====================================================================
==== Parsons Object ====================================================
======== The model and view of a Parsons problem based on what is
======== specified in the HTML, which is based on what is specified
======== in the RST file
==== PROPERTIES ========================================================
======== options: options largely specified from the HTML
======== grader: a LineGrader for grading the problem
======== lines: an array of all ParsonsLine as specified in the problem
======== solution: an array of ParsonsLine in the solution
======== blocks: the current blocks
======== sourceArea: the element that contains the source blocks
======== answerArea: the element that contains the answer blocks
===================================================================== */

/* =====================================================================
==== INITIALIZATION ====================================================
===================================================================== */

var prsList = {}; // Parsons dictionary
class Parsons extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; // entire <pre> element that will be replaced by new HTML
        this.containerDiv = orig;
        this.origElem = $(orig).find("pre.parsonsblocks")[0];
        // Find the question text and store it in .question
        this.question = $(orig).find(`.parsons_question`)[0];
        this.useRunestoneServices = opts.useRunestoneServices;
        this.divid = opts.orig.id;
        // Set the storageId (key for storing data)
        var storageId = super.localStorageKey();
        this.storageId = storageId;
        this.children = this.origElem.childNodes; // this contains all of the child elements of the entire tag...
        this.contentArray = [];
        Parsons.counter++; //    Unique identifier
        this.counterId = "parsons-" + Parsons.counter;

        // for (var i = 0; i < this.children.length; i++) {
        //     if ($(this.children[i]).is("[data-question]")) {
        //         this.question = this.children[i];
        //         break;
        //     }
        // }
        this.initializeOptions();
        this.grader =
            this.options.grader === "dag" ?
            new _dagGrader__WEBPACK_IMPORTED_MODULE_7__["default"](this) :
            new _lineGrader__WEBPACK_IMPORTED_MODULE_6__["default"](this);
        this.grader.showfeedback = this.showfeedback;
        var fulltext = $(this.origElem).html();
        this.blockIndex = 0;
        this.checkCount = 0;
        this.numDistinct = 0;
        this.hasSolved = false;
        this.initializeLines(fulltext.trim());
        this.initializeView();
        this.caption = "Parsons";
        this.addCaption("runestone");
        // Check the server for an answer to complete things
        this.checkServer("parsons", true);
        if (typeof Prism !== "undefined") {
            Prism.highlightAllUnder(this.containerDiv);
        }
    }
    // Based on the data-fields in the original HTML, initialize options
    initializeOptions() {
        var options = {
            pixelsPerIndent: 30,
        };
        // add maxdist and order if present
        var maxdist = $(this.origElem).data("maxdist");
        var order = $(this.origElem).data("order");
        var noindent = $(this.origElem).data("noindent");
        var adaptive = $(this.origElem).data("adaptive");
        var numbered = $(this.origElem).data("numbered");
        var grader = $(this.origElem).data("grader");
        options["numbered"] = numbered;
        options["grader"] = grader;
        if (maxdist !== undefined) {
            options["maxdist"] = maxdist;
        }
        if (order !== undefined) {
            // convert order string to array of numbers
            order = order.match(/\d+/g);
            for (var i = 0; i < order.length; i++) {
                order[i] = parseInt(order[i]);
            }
            options["order"] = order;
        }
        if (noindent == undefined) {
            noindent = false;
        }
        options["noindent"] = noindent;
        this.noindent = noindent;
        if (adaptive == undefined) {
            adaptive = false;
        } else if (adaptive) {
            this.initializeAdaptive();
        }
        options["adaptive"] = adaptive;
        // add locale and language
        var locale = eBookConfig.locale;
        if (locale == undefined) {
            locale = "en";
        }
        options["locale"] = locale;
        var language = $(this.origElem).data("language");
        if (language == undefined) {
            language = eBookConfig.language;
            if (language == undefined) {
                language = "python";
            }
        }
        options["language"] = language;
        var prettifyLanguage = {
            python: "prettyprint lang-py",
            java: "prettyprint lang-java",
            javascript: "prettyprint lang-js",
            html: "prettyprint lang-html",
            c: "prettyprint lang-c",
            "c++": "prettyprint lang-cpp",
            ruby: "prettyprint lang-rb",
        } [language];
        if (prettifyLanguage == undefined) {
            prettifyLanguage = "";
        }
        options["prettifyLanguage"] = prettifyLanguage;
        this.options = options;
    }
    // Based on what is specified in the original HTML, create the HTML view
    initializeView() {
        this.outerDiv = document.createElement("div");
        $(this.outerDiv).addClass("parsons");
        this.outerDiv.id = this.counterId;
        this.parsTextDiv = document.createElement("div");
        $(this.parsTextDiv).addClass("parsons-text");
        this.keyboardTip = document.createElement("div");
        $(this.keyboardTip).attr("role", "tooltip");
        this.keyboardTip.id = this.counterId + "-tip";
        this.keyboardTip.innerHTML = $.i18n("msg_parson_arrow_navigate");
        this.outerDiv.appendChild(this.keyboardTip);
        $(this.keyboardTip).hide();
        this.sortContainerDiv = document.createElement("div");
        $(this.sortContainerDiv).addClass("sortable-code-container");
        $(this.sortContainerDiv).attr(
            "aria-describedby",
            this.counterId + "-tip"
        );
        this.outerDiv.appendChild(this.sortContainerDiv);
        this.sourceRegionDiv = document.createElement("div");
        this.sourceRegionDiv.id = this.counterId + "-sourceRegion";
        $(this.sourceRegionDiv).addClass("sortable-code");
        this.sourceLabel = document.createElement("div");
        $(this.sourceLabel).attr("role", "tooltip");
        this.sourceLabel.id = this.counterId + "-sourceTip";
        this.sourceLabel.innerHTML = $.i18n("msg_parson_drag_from_here");
        this.sourceRegionDiv.appendChild(this.sourceLabel);
        this.sortContainerDiv.appendChild(this.sourceRegionDiv);
        this.sourceArea = document.createElement("div");
        this.sourceArea.id = this.counterId + "-source";
        $(this.sourceArea).addClass("source");
        $(this.sourceArea).attr(
            "aria-describedby",
            this.counterId + "-sourceTip"
        );
        // set the source width to its max value.  This allows the blocks to be created
        // at their "natural" size. As long as that is smaller than the max.
        // This allows us to use sensible functions to determine the correct heights
        // and widths for the drag and drop areas.
        this.sourceArea.style.width = "425px" // The max it will be resized later.
        this.sourceRegionDiv.appendChild(this.sourceArea);
        this.answerRegionDiv = document.createElement("div");
        this.answerRegionDiv.id = this.counterId + "-answerRegion";
        $(this.answerRegionDiv).addClass("sortable-code");
        this.answerLabel = document.createElement("div");
        $(this.answerLabel).attr("role", "tooltip");
        this.answerLabel.id = this.counterId + "-answerTip";
        this.answerLabel.innerHTML = $.i18n("msg_parson_drag_to_here");
        this.answerRegionDiv.appendChild(this.answerLabel);
        this.sortContainerDiv.appendChild(this.answerRegionDiv);
        this.answerArea = document.createElement("div");
        this.answerArea.id = this.counterId + "-answer";
        $(this.answerArea).attr(
            "aria-describedby",
            this.counterId + "-answerTip"
        );
        this.answerRegionDiv.appendChild(this.answerArea);
        this.parsonsControlDiv = document.createElement("div");
        $(this.parsonsControlDiv).addClass("parsons-controls");
        this.outerDiv.appendChild(this.parsonsControlDiv);
        var that = this;
        this.checkButton = document.createElement("button");
        $(this.checkButton).attr("class", "btn btn-success");
        this.checkButton.textContent = $.i18n("msg_parson_check_me");
        this.checkButton.id = this.counterId + "-check";
        this.parsonsControlDiv.appendChild(this.checkButton);
        this.checkButton.type = "button";
        this.checkButton.addEventListener("click", function(event) {
            event.preventDefault();
            that.checkCurrentAnswer();
            that.logCurrentAnswer();
            that.renderFeedback();
        });
        this.resetButton = document.createElement("button");
        $(this.resetButton).attr("class", "btn btn-default");
        this.resetButton.textContent = $.i18n("msg_parson_reset");
        this.resetButton.id = this.counterId + "-reset";
        this.resetButton.type = "button";
        this.parsonsControlDiv.appendChild(this.resetButton);
        this.resetButton.addEventListener("click", function(event) {
            event.preventDefault();
            that.clearFeedback();
            $(that.checkButton).prop("disabled", false);
            that.resetView();
            that.checkCount = 0;
            that.logMove("reset");
            that.setLocalStorage();
        });
        if (this.options.adaptive) {
            this.helpButton = document.createElement("button");
            $(this.helpButton).attr("class", "btn btn-primary");
            this.helpButton.textContent = $.i18n("msg_parson_help");
            this.helpButton.id = this.counterId + "-help";
            this.helpButton.disabled = false; // bje
            this.parsonsControlDiv.appendChild(this.helpButton);
            this.helpButton.addEventListener("click", function(event) {
                event.preventDefault();
                that.helpMe();
            });
        }
        this.messageDiv = document.createElement("div");
        this.messageDiv.id = this.counterId + "-message";
        this.parsonsControlDiv.appendChild(this.messageDiv);
        $(this.messageDiv).hide();
        $(this.origElem).replaceWith(this.outerDiv);
        $(this.outerDiv).closest(".sqcontainer").css("max-width", "none");
        if (this.outerDiv) {
            if ($(this.question).html().match(/^\s+$/)) {
                $(this.question).remove();
            } else {
                $(this.outerDiv).prepend(this.question);
            }
        }
    }
    // Initialize lines and solution properties
    initializeLines(text) {
        this.lines = [];
        // Create the initial blocks
        var textBlocks = text.split("---");
        if (textBlocks.length === 1) {
            // If there are no ---, then every line is its own block
            textBlocks = text.split("\n");
        }
        var solution = [];
        var indents = [];
        for (var i = 0; i < textBlocks.length; i++) {
            var textBlock = textBlocks[i];
            // Figure out options based on the #option
            // Remove the options from the code
            // only options are #paired or #distractor
            var options = {};
            var distractIndex;
            var distractHelptext = "";
            var tagIndex;
            var tag;
            var dependsIndex;
            var depends = [];
            if (textBlock.includes("#paired:")) {
                distractIndex = textBlock.indexOf("#paired:");
                distractHelptext = textBlock
                    .substring(distractIndex + 8, textBlock.length)
                    .trim();
                textBlock = textBlock.substring(0, distractIndex + 7);
            } else if (textBlock.includes("#distractor:")) {
                distractIndex = textBlock.indexOf("#distractor:");
                distractHelptext = textBlock
                    .substring(distractIndex + 12, textBlock.length)
                    .trim();
                textBlock = textBlock.substring(0, distractIndex + 11);
            } else if (textBlock.includes("#tag:")) {
                textBlock = textBlock.replace(/#tag:.*;.*;/, (s) =>
                    s.replace(/\s+/g, "")
                ); // remove whitespace in tag and depends list
                tagIndex = textBlock.indexOf("#tag:");
                tag = textBlock.substring(
                    tagIndex + 5,
                    textBlock.indexOf(";", tagIndex + 5)
                );
                if (tag == "") tag = "block-" + i;
                dependsIndex = textBlock.indexOf(";depends:");
                let dependsString = textBlock.substring(
                    dependsIndex + 9,
                    textBlock.indexOf(";", dependsIndex + 9)
                );
                depends =
                    dependsString.length > 0 ? dependsString.split(",") : [];
            }
            if (textBlock.includes('class="displaymath')) {
                options["displaymath"] = true;
            } else {
                options["displaymath"] = false;
            }
            textBlock = textBlock.replace(
                /#(paired|distractor|tag:.*;.*;)/,
                function(mystring, arg1) {
                    options[arg1] = true;
                    return "";
                }
            );
            // Create lines
            var lines = [];
            if (!options["displaymath"]) {
                var split = textBlock.split("\n");
            } else {
                var split = [textBlock];
            }
            for (var j = 0; j < split.length; j++) {
                var code = split[j];
                // discard blank rows
                if (!/^\s*$/.test(code)) {
                    var line = new _parsonsLine__WEBPACK_IMPORTED_MODULE_8__["default"](
                        this,
                        code,
                        options["displaymath"]
                    );
                    lines.push(line);
                    if (options["paired"]) {
                        line.distractor = true;
                        line.paired = true;
                        line.distractHelptext = distractHelptext;
                    } else if (options["distractor"]) {
                        line.distractor = true;
                        line.paired = false;
                        line.distractHelptext = distractHelptext;
                    } else {
                        line.distractor = false;
                        line.paired = false;
                        if (this.options.grader === "dag") {
                            line.tag = tag;
                            line.depends = depends;
                        }
                        solution.push(line);
                    }
                    if ($.inArray(line.indent, indents) == -1) {
                        indents.push(line.indent);
                    }
                }
            }
            if (lines.length > 0) {
                // Add groupWithNext
                for (j = 0; j < lines.length - 1; j++) {
                    lines[j].groupWithNext = true;
                }
                lines[lines.length - 1].groupWithNext = false;
            }
        }
        // Normalize the indents
        indents = indents.sort(function(a, b) {
            return a - b;
        });
        for (i = 0; i < this.lines.length; i++) {
            line = this.lines[i];
            line.indent = indents.indexOf(line.indent);
        }
        this.solution = solution;
    }
    // Based on the blocks, create the source and answer areas
    async initializeAreas(sourceBlocks, answerBlocks, options) {
        // Create blocks property as the sum of the two
        var blocks = [];
        var i, block;
        for (i = 0; i < sourceBlocks.length; i++) {
            block = sourceBlocks[i];
            blocks.push(block);
            this.sourceArea.appendChild(block.view);
        }
        for (i = 0; i < answerBlocks.length; i++) {
            block = answerBlocks[i];
            blocks.push(block);
            this.answerArea.appendChild(block.view);
        }
        this.blocks = blocks;
        // If present, disable some blocks
        var disabled = options.disabled;
        if (disabled !== undefined) {
            for (i = 0; i < blocks.length; i++) {
                block = blocks[i];
                if (disabled.includes(block.lines[0].index)) {
                    $(block.view).addClass("disabled");
                }
            }
        }
        // Determine how much indent should be possible in the answer area
        var indent = 0;
        if (!this.noindent) {
            if (this.options.language == "natural") {
                indent = this.solutionIndent();
            } else {
                indent = Math.max(0, this.solutionIndent());
            }
        }
        this.indent = indent;
        // For rendering, place in an onscreen position
        var isHidden = this.outerDiv.offsetParent == null;
        var replaceElement;
        if (isHidden) {
            replaceElement = document.createElement("div");
            $(this.outerDiv).replaceWith(replaceElement);
            document.body.appendChild(this.outerDiv);
        }
        if (this.options.prettifyLanguage !== "") {
            prettyPrint();
        }
        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].initializeWidth();
        }
        // Layout the areas
        var areaWidth, areaHeight;
        // Establish the width and height of the droppable areas
        var item, maxFunction;
        areaHeight = 20;
        var height_add = 0;
        if (this.options.numbered != undefined) {
            height_add = 1;
        }
        // Warning -- all of this is just a bit of pixie dust discovered by trial
        // and error to try to get the height of the drag and drop boxes.
        // item is a jQuery object
        // outerHeight can be unreliable if elements are not yet visible
        // outerHeight will return bad results if MathJax has not rendered the math
        areaWidth = 300;
        let self = this;
        maxFunction = async function(item) {
            if (this.options.language == "natural" || this.options.language == "math") {
                if (typeof runestoneMathready !== "undefined") {
                    await runestoneMathReady.then(async () => await self.queueMathJax(item[0]));
                } else { // this is for older rst builds not ptx
                    if (typeof MathJax.startup !== "undefined") {
                        await self.queueMathJax(item[0]);
                    }
                }
            }
            areaWidth = Math.max(areaWidth, item.outerWidth(true));
            item.width(areaWidth - 22);
            var addition = 3.8;
            if (item.outerHeight(true) != 38)
                addition = (3.1 * (item.outerHeight(true) - 38)) / 21;
            areaHeight += item.outerHeight(true) + height_add * addition;
        }.bind(this);
        for (i = 0; i < blocks.length; i++) {
            await maxFunction($(blocks[i].view));
        }
        this.areaWidth = areaWidth;
        if (this.options.numbered != undefined) {
            this.areaWidth += 25;
            //areaHeight += (blocks.length);
        }
        // + 40 to areaHeight to provide some additional buffer in case any text overflow still happens - Vincent Qiu (September 2020)
        this.areaHeight = areaHeight + 40;
        $(this.sourceArea).css({
            width: this.areaWidth + 2,
            height: areaHeight,
        });
        $(this.answerArea).css({
            width: this.options.pixelsPerIndent * indent + this.areaWidth + 2,
            height: areaHeight,
        });
        if (indent > 0 && indent <= 4) {
            $(this.answerArea).addClass("answer" + indent);
        } else {
            $(this.answerArea).addClass("answer");
        }
        // Initialize paired distractor decoration
        var bins = [];
        var bin = [];
        for (i = 0; i < this.lines.length; i++) {
            var line = this.lines[i];
            if (line.block() == undefined) {
                if (bin.length > 0) {
                    bins.push(bin);
                    bin = [];
                }
            } else {
                bin.push(line);
                if (!line.groupWithNext) {
                    bins.push(bin);
                    bin = [];
                }
            }
        }
        var pairedBins = [];
        var lineNumbers = [];
        var pairedDivs = [];
        var j;
        if (this.pairDistractors || !this.options.adaptive) {
            for (i = bins.length - 1; i > -1; i--) {
                bin = bins[i];
                if (bin[0].paired) {
                    // Add all in bin to line numbers
                    for (j = bin.length - 1; j > -1; j--) {
                        lineNumbers.unshift(bin[j].index);
                    }
                } else {
                    if (lineNumbers.length > 0) {
                        // Add all in bin to line numbers
                        for (j = bin.length - 1; j > -1; j--) {
                            lineNumbers.unshift(bin[j].index);
                        }
                        pairedBins.unshift(lineNumbers);
                        lineNumbers = [];
                    }
                }
            }
            for (i = 0; i < pairedBins.length; i++) {
                var pairedDiv = document.createElement("div");
                $(pairedDiv).addClass("paired");
                $(pairedDiv).html(
                    "<span id= 'st' style = 'vertical-align: middle; font-weight: bold'>or{</span>"
                );
                pairedDivs.push(pairedDiv);
                this.sourceArea.appendChild(pairedDiv);
            }
        } else {
            pairedBins = [];
        }
        this.pairedBins = pairedBins;
        this.pairedDivs = pairedDivs;
        if (this.options.numbered != undefined) {
            this.addBlockLabels(sourceBlocks.concat(answerBlocks));
        }
        // Update the view
        this.state = undefined; // needs to be here for loading from storage
        this.updateView();
        // Put back into the offscreen position
        if (isHidden) {
            $(replaceElement).replaceWith(this.outerDiv);
        }
    }
    // Make blocks interactive (both drag-and-drop and keyboard)
    initializeInteractivity() {
        for (var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].initializeInteractivity();
        }
        this.initializeTabIndex();
        let self = this;
        if (
            this.options.language == "natural" ||
            this.options.language == "math"
        ) {
            if (typeof MathJax.startup !== "undefined") {
                self.queueMathJax(self.outerDiv);
            }
        }
    }
    // Make one block be keyboard accessible
    initializeTabIndex() {
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];
            if (block.enabled()) {
                block.makeTabIndex();
                return this;
            }
        }
    }
    /* =====================================================================
    ==== SERVER COMMUNICATION ==============================================
    ===================================================================== */
    // Return the argument that is newer based on the timestamp
    newerData(dataA, dataB) {
        var dateA = dataA.timestamp;
        var dateB = dataB.timestamp;
        if (dateA == undefined) {
            return dataB;
        }
        if (dateB == undefined) {
            return dataA;
        }
        dateA = this.dateFromTimestamp(dateA);
        dateB = this.dateFromTimestamp(dateB);
        if (dateA > dateB) {
            return dataA;
        } else {
            return dataB;
        }
    }
    // Based on the data, load
    async loadData(data) {
        var sourceHash = data.source;
        if (sourceHash == undefined) {
            // maintain backwards compatibility
            sourceHash = data.trash;
        }
        var answerHash = data.answer;
        var adaptiveHash = data.adaptive;
        var options;
        if (adaptiveHash == undefined) {
            options = {};
        } else {
            options = this.optionsFromHash(adaptiveHash);
        }
        if (options.noindent !== undefined) {
            this.noindent = true;
        }
        if (options.checkCount !== undefined) {
            this.checkCount = options.checkCount;
        }
        if (options.hasSolved !== undefined) {
            this.hasSolved = options.hasSolved;
        }
        if (
            sourceHash == undefined ||
            answerHash == undefined ||
            answerHash.length == 1
        ) {
            await this.initializeAreas(this.blocksFromSource(), [], options);
        } else {
            this.initializeAreas(
                this.blocksFromHash(sourceHash),
                this.blocksFromHash(answerHash),
                options
            );
            this.grade = this.grader.grade();
            this.correct = this.grade;
        }
        // Start the interface
        if (this.needsReinitialization !== true) {
            this.initializeInteractivity();
        }
    }
    // Return what is stored in local storage
    localData() {
        var data = localStorage.getItem(this.storageId);
        if (data !== null) {
            if (data.charAt(0) == "{") {
                data = JSON.parse(data);
            } else {
                data = {};
            }
        } else {
            data = {};
        }
        return data;
    }
    // RunestoneBase: Sent when the server has data
    restoreAnswers(serverData) {
        this.loadData(serverData);
    }
    // RunestoneBase: Load what is in local storage
    checkLocalStorage() {
        if (this.graderactive) {
            return;
        }
        this.loadData(this.localData());
    }
    // RunestoneBase: Set the state of the problem in local storage
    setLocalStorage(data) {
        var toStore;
        if (data == undefined) {
            toStore = {
                source: this.sourceHash(),
                answer: this.answerHash(),
                timestamp: new Date(),
            };
            var adaptiveHash = this.adaptiveHash();
            if (adaptiveHash.length > 0) {
                toStore.adaptive = adaptiveHash;
            }
        } else {
            toStore = data;
        }
        localStorage.setItem(this.storageId, JSON.stringify(toStore));
    }
    /* =====================================================================
    ==== LOGGING ===========================================================
    ===================================================================== */
    // Log the interaction with the problem to the server:
    //   start: the user started interacting with this problem
    //   move: the user moved a block to a new position
    //   reset: the reset button was pressed
    //   removeDistractor: "Help Me" removed a distractor
    //   removeIndentation: "Help Me" removed indentation
    //   combineBlocks: "Help Me" combined blocks
    logMove(activity) {
        var event = {
            event: "parsonsMove",
            div_id: this.divid,
            storageid: super.localStorageKey(),
        };
        var act = activity + "|" + this.sourceHash() + "|" + this.answerHash();
        var adaptiveHash = this.adaptiveHash();
        if (adaptiveHash !== "") {
            act = act + "|" + adaptiveHash;
        }
        event.act = act;
        this.logBookEvent(event);
    }
    // Log the answer to the problem
    //   correct: The answer given matches the solution
    //   incorrect*: The answer is wrong for various reasons
    async logCurrentAnswer(sid) {
        var event = {
            event: "parsons",
            div_id: this.divid,
        };
        var answerHash = this.answerHash();
        event.answer = answerHash;
        var sourceHash = this.sourceHash();
        event.source = sourceHash;
        var act = sourceHash + "|" + answerHash;
        var adaptiveHash = this.adaptiveHash();
        if (adaptiveHash !== "") {
            event.adaptive = adaptiveHash;
            act = act + "|" + adaptiveHash;
        }
        if (this.grade == "correct") {
            act = "correct|" + act;
            event.correct = "T";
        } else {
            act = "incorrect|" + act;
            event.correct = "F";
        }
        event.act = act;

        if (typeof sid !== "undefined") {
            event.sid = sid;
        }

        await this.logBookEvent(event);
    }
    /* =====================================================================
    ==== ACCESSING =========================================================
    ===================================================================== */
    // Answer the hash of the adaptive state
    adaptiveHash() {
        if (!this.options.adaptive) {
            return "";
        }
        var hash = [];
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];
            if (!block.enabled()) {
                hash.push("d" + block.lines[0].index);
            }
        }
        if (this.noindent !== this.options.noindent) {
            hash.push("i");
        }
        hash.push("c" + this.checkCount);
        if (this.hasSolved) {
            hash.push("s");
        }
        return hash.join("-");
    }
    // Create options for creating blocks based on a hash
    optionsFromHash(hash) {
        var split;
        if (hash === "-" || hash === "" || hash === null) {
            split = [];
        } else {
            split = hash.split("-");
        }
        var options = {};
        var disabled = [];
        for (var i = 0; i < split.length; i++) {
            var key = split[i];
            if (key[0] == "i") {
                options.noindent = true;
            } else if (key[0] == "d") {
                disabled.push(parseInt(key.slice(1)));
            } else if (key[0] == "s") {
                options.hasSolved = true;
            } else if (key[0] == "c") {
                options.checkCount = parseInt(key.slice(1));
            }
        }
        if (disabled.length > 0) {
            options.disabled = disabled;
        }
        return options;
    }
    // Answer the hash of the answer area
    answerHash() {
        var hash = [];
        var blocks = this.answerBlocks();
        for (var i = 0; i < blocks.length; i++) {
            hash.push(blocks[i].hash());
        }
        if (hash.length === 0) {
            return "-";
        } else {
            return hash.join("-");
        }
    }
    // Answer the hash of the source area
    sourceHash() {
        var hash = [];
        var blocks = this.sourceBlocks();
        for (var i = 0; i < blocks.length; i++) {
            hash.push(blocks[i].hash());
        }
        if (hash.length === 0) {
            return "-";
        } else {
            return hash.join("-");
        }
    }
    // Inter-problem adaptive changes
    // Based on the recentAttempts, remove distractors, add indent, combine blocks
    adaptBlocks(input) {
        var blocks = [];
        var distractors = [];
        var block;
        for (var i = 0; i < input.length; i++) {
            block = input[i];
            if (block.isDistractor()) {
                distractors.push(block);
            } else {
                blocks.push(block);
            }
        }
        this.recentAttempts = localStorage.getItem(
            this.adaptiveId + "recentAttempts"
        );
        if (this.recentAttempts == undefined || this.recentAttempts == "NaN") {
            this.recentAttempts = 3;
        }
        var lastestAttemptCount = this.recentAttempts;
        var nBlocks = blocks.length;
        var nBlocksToCombine = 0;
        var nDistractors = distractors.length;
        var nToRemove = 0;
        this.pairDistractors = true;
        var giveIndentation = false;
        if (lastestAttemptCount < 2) {
            // 1 Try
            this.pairDistractors = false;
            this.limitDistractors = false;
        } else if (lastestAttemptCount < 4) {
            // 2-3 Tries
            // Do nothing they are doing normal
            this.pairDistractors = true;
        } else if (lastestAttemptCount < 6) {
            // 4-5 Tries
            // pair distractors
            this.pairDistractors = true;
        } else if (lastestAttemptCount < 8) {
            // 6-7 Tries
            // Remove 50% of distractors
            nToRemove = 0.5 * nDistractors;
            this.pairDistractors = true;
        } else {
            // 8+ Tries
            // Remove all of distractors
            nToRemove = nDistractors;
            this.pairDistractors = true;
        }
        /*
        else if(lastestAttemptCount < 12) { //10-11
            // Remove all distractors and give indentation
            nToRemove = nDistractors;
            giveIndentation = true;
            this.pairDistractors = true;
        } else if(lastestAttemptCount < 14) { // 12-13 Tries
            // Remove all of distractors
            // give indentation
            // reduce problem to 3/4 size
            giveIndentation = true;
            nToRemove = nDistractors;
            nBlocksToCombine = .25 * nBlocks;
            this.pairDistractors = true;
        } else { // >= 14 Tries
            // Remove all of distractors
            // give indentation
            // reduce problem to 1/2 size
            giveIndentation = true;
            nToRemove = nDistractors;
            nBlocksToCombine = .5 * nBlocks;
            this.pairDistractors = true;
        }
        */
        nBlocksToCombine = Math.min(nBlocksToCombine, nBlocks - 3);
        // Never combine so where there are less than three blocks left
        // Remove distractors
        distractors = this.shuffled(distractors);
        distractors = distractors.slice(0, nToRemove);
        var output = [];
        for (i = 0; i < input.length; i++) {
            block = input[i];
            if (!block.isDistractor()) {
                output.push(block);
            } else if ($.inArray(block, distractors) == -1) {
                output.push(block);
            }
        }
        //var output = input;
        if (giveIndentation) {
            for (let i = 0; i < output.length; i++) {
                output[i].addIndent();
            }
            this.indent = 0;
            this.noindent = true;
        }
        // combine blocks
        var solution = [];
        for (i = 0; i < this.lines.length; i++) {
            for (var j = 0; j < output.length; j++) {
                if (output[j].lines[0].index == i) {
                    solution.push(output[j]);
                }
            }
        }
        for (let i = 0; i < nBlocksToCombine; i++) {
            // combine one set of blocks
            var best = -10;
            var combineIndex = -10;
            for (j = 0; j < solution.length - 1; j++) {
                block = solution[j];
                var next = solution[j + 1];
                var rating = 10 - block.lines.length - next.lines.length;
                var blockIndent = block.minimumLineIndent();
                var nextIndent = next.minimumLineIndent();
                if (blockIndent == nextIndent) {
                    rating += 2;
                } else if (blockIndent > nextIndent) {
                    rating -= 1;
                }
                if (
                    block.lines[block.lines.length - 1].indent ==
                    next.lines[0].indent
                ) {
                    rating += 1;
                }
                if (rating >= best) {
                    best = rating;
                    combineIndex = j;
                }
            }
            block = solution[combineIndex];
            next = solution[combineIndex + 1];
            for (j = 0; j < next.lines.length; j++) {
                block.addLine(next.lines[j]);
            }
            var newSolution = [];
            for (j = 0; j < solution.length; j++) {
                if (j !== combineIndex + 1) {
                    newSolution.push(solution[j]);
                }
            }
            var solution = newSolution;
        }
        // reorder
        var combinedOutput = [];
        for (i = 0; i < output.length; i++) {
            for (j = 0; j < solution.length; j++) {
                if (output[i].lines[0].index == solution[j].lines[0].index) {
                    combinedOutput.push(solution[j]);
                }
            }
        }
        return combinedOutput;
    }
    // Return an array of code blocks based on what is specified in the problem
    blocksFromSource() {
        var unorderedBlocks = [];
        var originalBlocks = [];
        var blocks = [];
        var lines = [];
        var block, line, i;
        for (i = 0; i < this.lines.length; i++) {
            line = this.lines[i];
            lines.push(line);
            if (!line.groupWithNext) {
                unorderedBlocks.push(new _parsonsBlock__WEBPACK_IMPORTED_MODULE_9__["default"](this, lines));
                lines = [];
            }
        }
        originalBlocks = unorderedBlocks;
        // Trim the distractors
        var removedBlocks = [];
        if (this.options.maxdist !== undefined) {
            var maxdist = this.options.maxdist;
            var distractors = [];
            for (i = 0; i < unorderedBlocks.length; i++) {
                block = unorderedBlocks[i];
                if (block.lines[0].distractor) {
                    distractors.push(block);
                }
            }
            if (maxdist < distractors.length) {
                distractors = this.shuffled(distractors);
                distractors = distractors.slice(0, maxdist);
                for (i = 0; i < unorderedBlocks.length; i++) {
                    block = unorderedBlocks[i];
                    if (block.lines[0].distractor) {
                        if ($.inArray(block, distractors) > -1) {
                            blocks.push(block);
                        } else {
                            removedBlocks.push(i);
                        }
                    } else {
                        blocks.push(block);
                    }
                }
                unorderedBlocks = blocks;
                blocks = [];
            }
        }

        // This is necessary, set the pairDistractors value before blocks get shuffled - William Li (August 2020)
        if (this.recentAttempts < 2) {
            // 1 Try
            this.pairDistractors = false;
        } else {
            this.pairDistractors = true;
        }

        if (this.options.order === undefined) {
            // Shuffle, respecting paired distractors
            var chunks = [],
                chunk = [];
            for (i = 0; i < unorderedBlocks.length; i++) {
                block = unorderedBlocks[i];
                if (block.lines[0].paired && this.pairDistractors) {
                    // William Li (August 2020)
                    chunk.push(block);
                } else {
                    chunk = [];
                    chunk.push(block);
                    chunks.push(chunk);
                }
            }
            chunks = this.shuffled(chunks);
            for (i = 0; i < chunks.length; i++) {
                chunk = chunks[i];
                if (chunk.length > 1) {
                    // shuffle paired distractors
                    chunk = this.shuffled(chunk);
                    for (j = 0; j < chunk.length; j++) {
                        blocks.push(chunk[j]);
                    }
                } else {
                    blocks.push(chunk[0]);
                }
            }
        } else {
            // Order according to order specified
            for (i = 0; i < this.options.order.length; i++) {
                block = originalBlocks[this.options.order[i]];
                if (
                    block !== undefined &&
                    $.inArray(this.options.order[i], removedBlocks) < 0
                ) {
                    blocks.push(block);
                }
            }
        }
        this.pairDistractors = true;
        if (this.options.adaptive) {
            this.limitDistractors = true;
            blocks = this.adaptBlocks(blocks);
            if (!this.limitDistractors) {
                for (i = 0; i < removedBlocks.length; i++) {
                    var index =
                        this.options.order == undefined ?
                        Math.random(0, blocks.length) :
                        $.inArray(removedBlocks[i], this.options.order);
                    blocks.splice(index, 0, originalBlocks[removedBlocks[i]]);
                }
            }
        }
        if (this.pairDistractors && this.options.order != undefined) {
            //move pairs together
            //Go through array looking for ditractor and its pair
            for (i = 1; i < originalBlocks.length; i++) {
                if (
                    originalBlocks[i].lines[0].paired &&
                    $.inArray(originalBlocks[i], blocks) >= 0
                ) {
                    var j = i;
                    while ($.inArray(originalBlocks[j - 1], blocks) < 0) {
                        // find the paired distractor or solution block it will be next to
                        j--;
                    }
                    var indexTo = $.inArray(originalBlocks[j - 1], blocks);
                    var indexFrom = $.inArray(originalBlocks[i], blocks);
                    blocks.splice(indexFrom, 1);
                    blocks.splice(indexTo, 0, originalBlocks[i]);
                }
            }
        }
        return blocks;
    }
    // Return a codeblock that corresponds to the hash
    blockFromHash(hash) {
        var split = hash.split("_");
        var lines = [];
        for (var i = 0; i < split.length - 1; i++) {
            lines.push(this.lines[split[i]]);
        }
        var block = new _parsonsBlock__WEBPACK_IMPORTED_MODULE_9__["default"](this, lines);
        if (this.noindent) {
            block.indent = 0;
        } else {
            block.indent = Number(split[split.length - 1]);
        }
        return block;
    }
    // Return an array of codeblocks that corresponds to the hash
    blocksFromHash(hash) {
        var split;
        if (hash === "-" || hash === "" || hash === null) {
            split = [];
        } else {
            split = hash.split("-");
        }
        var blocks = [];
        for (var i = 0; i < split.length; i++) {
            blocks.push(this.blockFromHash(split[i]));
        }
        if (this.options.adaptive) {
            return this.adaptBlocks(blocks);
        } else {
            return blocks;
        }
    }
    // Return a block object by the full id including id prefix
    getBlockById(id) {
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];
            if (block.view.id == id) {
                return block;
            }
        }
        return undefined;
    }
    // Return array of codeblocks that are the solution
    solutionBlocks() {
        var solutionBlocks = [];
        var solutionLines = [];
        for (var i = 0; i < this.lines.length; i++) {
            if (!this.lines[i].distractor) {
                solutionLines.push(this.lines[i]);
            }
        }
        var block = solutionLines[0].block();
        solutionBlocks.push(block);
        for (let i = 1; i < solutionLines.length; i++) {
            var nextBlock = solutionLines[i].block();
            if (block !== nextBlock) {
                block = nextBlock;
                solutionBlocks.push(block);
            }
        }
        return solutionBlocks;
    }
    // Return array of codeblocks based on what is in the source field
    sourceBlocks() {
        var sourceBlocks = [];
        var children = this.sourceArea.childNodes;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if ($(child).hasClass("block")) {
                sourceBlocks.push(this.getBlockById(child.id));
            }
        }
        return sourceBlocks;
    }
    // Return array of enabled codeblocks based on what is in the source field
    enabledSourceBlocks() {
        var all = this.sourceBlocks();
        var enabled = [];
        for (var i = 0; i < all.length; i++) {
            var block = all[i];
            if (block.enabled()) {
                enabled.push(block);
            }
        }
        return enabled;
    }
    // Return array of codeblocks based on what is in the answer field
    answerBlocks() {
        var answerBlocks = [];
        var children = this.answerArea.childNodes;
        for (var i = 0; i < children.length; i++) {
            var block = this.getBlockById(children[i].id);
            if (block !== undefined) {
                answerBlocks.push(block);
            }
        }
        return answerBlocks;
    }
    // Return array of enabled codeblocks based on what is in the answer field
    enabledAnswerBlocks() {
        var all = this.answerBlocks();
        var enabled = [];
        for (var i = 0; i < all.length; i++) {
            var block = all[i];
            if (block.enabled()) {
                enabled.push(block);
            }
        }
        return enabled;
    }
    // Return array of codelines based on what is in the answer field
    answerLines() {
        var answerLines = [];
        var blocks = this.answerBlocks();
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            for (var j = 0; j < block.lines.length; j++) {
                answerLines.push(block.lines[j]);
            }
        }
        return answerLines;
    }
    // Go up the hierarchy until you get to a block; return that block element
    getBlockFor(element) {
        var check = element;
        while (!check.classList.contains("block")) {
            check = check.parentElement;
        }
        return check;
    }
    // Return the maximum indent for the solution
    solutionIndent() {
        var indent = 0;
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];
            indent = Math.max(indent, block.solutionIndent());
        }
        return indent;
    }
    /* =====================================================================
    ==== ACTION ============================================================
    ===================================================================== */
    // The "Check Me" button was pressed.
    checkCurrentAnswer() {
        if (!this.hasSolved) {
            this.checkCount++;
            this.clearFeedback();
            if (this.adaptiveId == undefined) {
                this.adaptiveId = this.storageId;
            }
            // TODO - rendering feedback is buried in the grader.grade method.
            // to disable feedback set this.grader.showfeedback boolean
            this.grader.showfeedback = false;
            this.grade = this.grader.grade();
            if (this.grade == "correct") {
                this.hasSolved = true;
                this.correct = true;
                $(this.checkButton).prop("disabled", true);
                localStorage.setItem(this.adaptiveId + "Solved", true);
                this.recentAttempts = this.checkCount;
                localStorage.setItem(
                    this.adaptiveId + "recentAttempts",
                    this.recentAttempts
                );
            }
            localStorage.setItem(
                this.adaptiveId + this.divid + "Count",
                this.checkCount
            );
            this.setLocalStorage();
            // if not solved and not too short then check if should provide help
            if (!this.hasSolved && this.grade !== "incorrectTooShort") {
                if (this.canHelp) {
                    // only count the attempt if the answer is different (to prevent gaming)
                    var answerHash = this.answerHash();
                    if (this.lastAnswerHash !== answerHash) {
                        this.numDistinct++;
                        this.lastAnswerHash = answerHash;
                    }
                    // if time to offer help
                    if (this.numDistinct == 3 && !this.gotHelp) {
                        alert($.i18n("msg_parson_help_info"));
                    } // end if
                } // end if can help
            } // end if not solved
        } // end outer if not solved
    }

    renderFeedback() {
        this.grader.showfeedback = true;
        this.grade = this.grader.graderState;
        var feedbackArea;
        var answerArea = $(this.answerArea);

        if (this.showfeedback === true) {
            feedbackArea = $(this.messageDiv);
        } else {
            feedbackArea = $("#doesnotexist");
        }

        if (this.grade === "correct") {
            answerArea.addClass("correct");
            feedbackArea.fadeIn(100);
            feedbackArea.attr("class", "alert alert-info");
            if (this.checkCount > 1) {
                feedbackArea.html(
                    $.i18n("msg_parson_correct", this.checkCount)
                );
            } else {
                feedbackArea.html($.i18n("msg_parson_correct_first_try"));
            }
        }

        if (this.grade === "incorrectTooShort") {
            // too little code
            answerArea.addClass("incorrect");
            feedbackArea.fadeIn(500);
            feedbackArea.attr("class", "alert alert-danger");
            feedbackArea.html($.i18n("msg_parson_too_short"));
        }

        if (this.grade === "incorrectIndent") {
            var incorrectBlocks = [];
            for (let i = 0; i < this.grader.indentLeft.length; i++) {
                block = this.grader.indentLeft[i].block();
                if (incorrectBlocks.indexOf(block) == -1) {
                    incorrectBlocks.push(block);
                    $(block.view).addClass("indentLeft");
                }
            }
            for (let i = 0; i < this.grader.indentRight.length; i++) {
                block = this.grader.indentRight[i].block();
                if (incorrectBlocks.indexOf(block) == -1) {
                    incorrectBlocks.push(block);
                    $(block.view).addClass("indentRight");
                }
            }
            feedbackArea.fadeIn(500);
            feedbackArea.attr("class", "alert alert-danger");
            if (incorrectBlocks.length == 1) {
                feedbackArea.html($.i18n("msg_parson_wrong_indent"));
            } else {
                feedbackArea.html($.i18n("msg_parson_wrong_indents"));
            }
        }

        if (this.grade === "incorrectMoveBlocks") {
            var answerBlocks = this.answerBlocks();
            var inSolution = [];
            var inSolutionIndexes = [];
            var notInSolution = [];
            for (let i = 0; i < answerBlocks.length; i++) {
                var block = answerBlocks[i];
                var index = this.solution.indexOf(block.lines[0]);
                if (index == -1) {
                    notInSolution.push(block);
                } else {
                    inSolution.push(block);
                    inSolutionIndexes.push(index);
                }
            }
            var lisIndexes = this.grader.inverseLISIndices(
                inSolutionIndexes,
                inSolution
            );
            for (let i = 0; i < lisIndexes.length; i++) {
                notInSolution.push(inSolution[lisIndexes[i]]);
            }
            answerArea.addClass("incorrect");
            feedbackArea.fadeIn(500);
            feedbackArea.attr("class", "alert alert-danger");
            if (this.showfeedback === true) {
                for (let i = 0; i < notInSolution.length; i++) {
                    $(notInSolution[i].view).addClass("incorrectPosition");
                }
            }
            feedbackArea.html($.i18n("msg_parson_wrong_order"));
        }
    }

    /* =====================================================================
    ==== ADAPTIVE ==========================================================
    ===================================================================== */
    // Initialize this problem as adaptive
    //    helpCount = number of checks before help is given (negative)
    //    canHelp = boolean as to whether help can be provided
    //    checkCount = how many times it has been checked before correct
    //    userRating = 0..100 how good the person is at solving problems
    initializeAdaptive() {
        this.adaptiveId = super.localStorageKey();
        this.canHelp = true;
        //this.helpCount = -3; // Number of checks before help is offered
        this.checkCount = 0;
        this.numDistinct = 0; // number of distinct solution attempts (different from previous)
        this.gotHelp = false;
        // Initialize the userRating
        var storageProblem = localStorage.getItem(this.adaptiveId + "Problem");
        if (storageProblem == this.divid) {
            // Already in this problem
            this.checkCount = localStorage.getItem(
                this.adaptiveId + this.divid + "Count"
            );
            if (this.checkCount == undefined) {
                this.checkCount = 0;
            }
            return this;
        }
        var count = localStorage.getItem(
            this.adaptiveId + this.divid + "Count"
        );
        if (count == undefined || count == "NaN") {
            count = 0;
        }
        this.checkCount = count;
        this.recentAttempts = localStorage.getItem(
            this.adaptiveId + "recentAttempts"
        );
        if (this.recentAttempts == undefined || this.recentAttempts == "NaN") {
            this.recentAttempts = 3;
        }
        localStorage.setItem(
            this.adaptiveId + "recentAttempts",
            this.recentAttempts
        );
        localStorage.setItem(this.adaptiveId + "Problem", this.divid);
        localStorage.setItem(
            this.adaptiveId + this.divid + "Count",
            this.checkCount
        );
        localStorage.setItem(this.adaptiveId + "Solved", false);
    }
    // Return a boolean of whether the user must deal with indentation
    usesIndentation() {
        if (this.noindent || this.solutionIndent() == 0) {
            // was $(this.answerArea).hasClass("answer") - bje changed
            return false;
        } else {
            return true;
        }
    }
    // Find a distractor to remove to make the problem easier
    //  * try first in the answer area
    //  * if not, try the source area
    //  * if not, return undefined
    distractorToRemove() {
        var blocks = this.enabledAnswerBlocks();
        var block;
        for (let i = 0; i < blocks.length; i++) {
            block = blocks[i];
            if (block.isDistractor()) {
                return block;
            }
        }
        blocks = this.enabledSourceBlocks();
        for (let i = 0; i < blocks.length; i++) {
            block = blocks[i];
            if (block.isDistractor()) {
                return block;
            }
        }
        return undefined;
    }
    // Return the number of blocks that exist
    numberOfBlocks(fIncludeDistractors = true) {
        var numberOfBlocks = 0;
        for (var i = 0; i < this.blocks.length; i++) {
            if (
                this.blocks[i].enabled() &&
                (fIncludeDistractors || !this.blocks[i].isDistractor())
            ) {
                numberOfBlocks += 1;
            }
        }
        return numberOfBlocks;
    }
    // Remove this distractors to make the problem easier
    removeDistractor(block) {
        // Alert the user to what is happening
        var feedbackArea = $(this.messageDiv);
        feedbackArea.fadeIn(500);
        feedbackArea.attr("class", "alert alert-info");
        feedbackArea.html($.i18n("msg_parson_not_solution"));
        // Stop ability to select
        if (block.lines[0].distractHelptext) {
            block.view.setAttribute("data-toggle", "tooltip");
            block.view.setAttribute("title", block.lines[0].distractHelptext);
        }
        block.disable();
        // If in answer area, move to source area
        if (!block.inSourceArea()) {
            var sourceRect = this.sourceArea.getBoundingClientRect();
            var startX = block.pageXCenter() - 1;
            var startY = block.pageYCenter();
            var endX =
                sourceRect.left + window.pageXOffset + sourceRect.width / 2;
            var endY =
                sourceRect.top +
                window.pageYOffset +
                block.view.getBoundingClientRect().height / 2;
            var slideUnderBlock = block.slideUnderBlock();
            if (slideUnderBlock !== undefined) {
                endY +=
                    slideUnderBlock.view.getBoundingClientRect().height + 20;
                endY += parseInt($(slideUnderBlock.view).css("top"));
            }
            var that = this;
            $(block.view).css({
                "border-color": "#000",
                "background-color": "#fff",
            });
            $(block.view).animate({
                opacity: 1.0,
            }, {
                duration: Math.sqrt(
                        Math.pow(endY - startY, 2) +
                        Math.pow(endX - startX, 2)
                    ) *
                    4 +
                    500,
                start: function() {
                    that.moving = block;
                    that.movingX = startX;
                    that.movingY = startY;
                    that.updateView();
                },
                progress: function(a, p, c) {
                    that.movingX = startX * (1 - p) + endX * p;
                    that.movingY = startY * (1 - p) + endY * p;
                    that.updateView();
                },
                complete: function() {
                    delete that.moving;
                    delete that.movingX;
                    delete that.movingY;
                    that.updateView();
                    $(block.view).animate({
                        opacity: 0.3,
                        "border-color": "#d3d3d3",
                        "background-color": "#efefef",
                    }, {
                        duration: 1000,
                        complete: function() {
                            $(block.view).css({
                                opacity: "",
                                "border-color": "",
                                "background-color": "",
                            });
                            $(block.view).addClass("disabled");
                        },
                    });
                },
            });
        } else {
            $(block.view).css({
                "border-color": "#000",
                "background-color": "#fff",
            });
            $(block.view).animate({
                opacity: 0.3,
                "border-color": "#d3d3d3",
                "background-color": "#efefef",
            }, {
                duration: 2000,
                complete: function() {
                    $(block.view).css({
                        "border-color": "",
                        "background-color": "",
                    });
                },
            });
        }
    }
    // Give the user the indentation
    removeIndentation() {
        // Alert the user to what is happening
        var feedbackArea = $(this.messageDiv);
        feedbackArea.fadeIn(500);
        feedbackArea.attr("class", "alert alert-info");
        feedbackArea.html($.i18n("msg_parson_provided_indent"));
        // Move and resize blocks
        var blockWidth = 200;
        for (var i = 0; i < this.lines.length; i++) {
            var line = this.lines[i];
            var expandedWidth =
                line.width + line.indent * this.options.pixelsPerIndent + 30;
            blockWidth = Math.max(blockWidth, expandedWidth);
        }
        if (this.options.numbered != undefined) {
            blockWidth += 25;
        }
        this.areaWidth = blockWidth + 22;
        var block, indent;
        var sourceBlocks = this.sourceBlocks();
        for (let i = 0; i < sourceBlocks.length; i++) {
            block = sourceBlocks[i];
            indent = block.solutionIndent();
            if (indent == 0) {
                $(block.view).animate({
                    width: blockWidth,
                }, {
                    duration: 1000,
                });
            } else {
                $(block.view).animate({
                    width: blockWidth - indent * this.options.pixelsPerIndent,
                    "padding-left": indent * this.options.pixelsPerIndent + 10,
                }, {
                    duration: 1000,
                });
            }
        }
        for (let i = 0; i < this.pairedDivs.length; i++) {
            $(this.pairedDivs[i]).animate({
                width: blockWidth + 34,
            }, {
                duration: 1000,
            });
        }
        var answerBlocks = this.answerBlocks();
        for (let i = 0; i < answerBlocks.length; i++) {
            block = answerBlocks[i];
            indent = block.solutionIndent();
            if (indent == 0) {
                $(block.view).animate({
                    left: 0,
                    width: blockWidth,
                }, {
                    duration: 1000,
                });
            } else {
                $(block.view).animate({
                    left: 0,
                    width: blockWidth - indent * this.options.pixelsPerIndent,
                    "padding-left": indent * this.options.pixelsPerIndent + 10,
                }, {
                    duration: 1000,
                });
            }
        }
        // Resize answer and source area
        $(this.answerArea).removeClass("answer1 answer2 answer3 answer4");
        $(this.answerArea).addClass("answer");
        this.indent = 0;
        this.noindent = true;
        $(this.sourceArea).animate({
            width: this.areaWidth + 2,
        }, {
            duration: 1000,
        });
        $(this.answerArea).animate({
            width: this.areaWidth + 2,
        }, {
            duration: 1000,
        });
        // Change the model (with view)
        $(this.answerArea).animate({
            opacity: 1.0,
        }, {
            duration: 1100,
            complete: function() {
                $(this.answerArea).css({
                    opacity: "",
                });
                // Update the model
                for (let i = 0; i < sourceBlocks.length; i++) {
                    sourceBlocks[i].addIndent();
                }
                for (let i = 0; i < answerBlocks.length; i++) {
                    answerBlocks[i].addIndent();
                }
            },
        });
    }

    // first check if any solution blocks are in the source still (left side) and not
    // in the answer
    getSolutionBlockInSource() {
        var solutionBlocks = this.solutionBlocks();
        var answerBlocks = this.answerBlocks();
        var sourceBlocks = this.sourceBlocks();
        var solBlock = null;
        var currBlock = null;

        // loop through sourceBlocks and return a block if it is not in the solution
        for (var i = 0; i < sourceBlocks.length; i++) {
            // get the current block from the source
            currBlock = sourceBlocks[i];

            // if currBlock is in the solution and isn't the first block and isn't in the answer
            if (
                solutionBlocks.indexOf(currBlock) > 0 &&
                answerBlocks.indexOf(currBlock) < 0
            ) {
                return currBlock;
            }
        }
        // didn't find any block in the source that is in the solution
        return null;
    }

    // Find a block2 that is furthest from block1 in the answer
    // don't use the very first block in the solution as block2
    getFurthestBlock() {
        var solutionBlocks = this.solutionBlocks();
        var answerBlocks = this.answerBlocks();
        var maxDist = 0;
        var dist = 0;
        var maxBlock = null;
        var currBlock = null;
        var indexSol = 0;
        var prevBlock = null;
        var indexPrev = 0;

        // loop through the blocks in the answer
        for (var i = 0; i < answerBlocks.length; i++) {
            currBlock = answerBlocks[i];
            indexSol = solutionBlocks.indexOf(currBlock);
            if (indexSol > 0) {
                prevBlock = solutionBlocks[indexSol - 1];
                indexPrev = answerBlocks.indexOf(prevBlock);
                //alert("my index " + i + " index prev " + indexPrev);

                // calculate the distance in the answer
                dist = Math.abs(i - indexPrev);
                if (dist > maxDist) {
                    maxDist = dist;
                    maxBlock = currBlock;
                }
            }
        }
        return maxBlock;
    }

    // Combine blocks together
    combineBlocks() {
        var solutionBlocks = this.solutionBlocks();
        var answerBlocks = this.answerBlocks();
        var sourceBlocks = this.sourceBlocks();

        // Alert the user to what is happening
        var feedbackArea = $(this.messageDiv);
        feedbackArea.fadeIn(500);
        feedbackArea.attr("class", "alert alert-info");
        feedbackArea.html($.i18n("msg_parson_combined_blocks"));
        var block1 = null;
        var block2 = null;

        // get a solution block that is still in source (not answer), if any
        block2 = this.getSolutionBlockInSource();

        // if none in source get block that is furthest from block1
        if (block2 == null) {
            block2 = this.getFurthestBlock();
        }

        // get block1 (above block2) in solution
        var index = solutionBlocks.indexOf(block2);
        block1 = solutionBlocks[index - 1];

        // get index of each in answer
        var index1 = answerBlocks.indexOf(block1);
        var index2 = answerBlocks.indexOf(block2);
        var move = false;

        // if both in answer set move based on if directly above each other
        if (index1 >= 0 && index2 >= 0) {
            move = index1 + 1 !== index2;

            // else if both in source set move again based on if above each other
        } else if (index1 < 0 && index2 < 0) {
            index1 = sourceBlocks.indexOf(block1);
            index2 = sourceBlocks.indexOf(block2);
            move = index1 + 1 !== index2;

            // one in source and one in answer so must move
        } else {
            move = true;
            if (index1 < 0) {
                index1 = sourceBlocks.indexOf(block1);
            }
            if (index2 < 0) {
                index2 = sourceBlocks.indexOf(block2);
            }
        }

        var subtract = index2 < index1; // is block2 higher

        if (move) {
            // Move the block
            var startX = block2.pageXCenter() - 1;
            var startY = block2.pageYCenter();
            var endX = block1.pageXCenter() - 1;
            var endY =
                block1.pageYCenter() +
                block1.view.getBoundingClientRect().height / 2 +
                5;
            if (subtract) {
                endY -= block2.view.getBoundingClientRect().height / 2;
            } else {
                endY += block2.view.getBoundingClientRect().height / 2;
            }
            var that = this;
            $(block2.view).animate({
                opacity: 1,
            }, {
                duration: 1000, // 1 seccond
                start: function() {
                    $(block1.view).css({
                        "border-color": "#000",
                        "background-color": "#fff",
                    });
                    $(block2.view).css({
                        "border-color": "#000",
                        "background-color": "#fff",
                    });
                    block2.lines[0].index += 1000;
                    that.moving = block2;
                    that.movingX = startX;
                    that.movingY = startY;
                    that.updateView();
                },
                progress: function(a, p, c) {
                    that.movingX = startX * (1 - p) + endX * p;
                    that.movingY = startY * (1 - p) + endY * p;
                    that.updateView();
                },
                complete: function() {
                    delete that.moving;
                    delete that.movingX;
                    delete that.movingY;
                    that.updateView();
                    block2.lines[0].index -= 1000;
                    block1.consumeBlock(block2);
                    $(block1.view).animate({
                        "border-color": "#d3d3d3",
                        "background-color": "#efefef",
                    }, {
                        duration: 1000,
                        complete: function() {
                            $(block1.view).css({
                                "border-color": "",
                                "background-color": "",
                            });
                        },
                    });
                },
            });
        } else {
            $(block2.view).animate({
                opacity: 1,
            }, {
                duration: 1000,
                start: function() {
                    $(block1.view).css({
                        "border-color": "#000",
                        "background-color": "#fff",
                    });
                    $(block2.view).css({
                        "border-color": "#000",
                        "background-color": "#fff",
                    });
                },
                complete: function() {
                    block1.consumeBlock(block2);
                    $(block1.view).animate({
                        "border-color": "#d3d3d3",
                        "background-color": "#efefef",
                    }, {
                        duration: 1000,
                        complete: function() {
                            $(block1.view).css({
                                "border-color": "",
                                "background-color": "",
                            });
                        },
                    });
                },
            });
        }
    }
    // Adapt the problem to be easier
    //  * remove a distractor until none are present
    //  * combine blocks until 3 are left
    makeEasier() {
        var distractorToRemove = this.distractorToRemove();
        if (
            distractorToRemove !== undefined &&
            !distractorToRemove.inSourceArea()
        ) {
            alert($.i18n("msg_parson_remove_incorrect"));
            this.removeDistractor(distractorToRemove);
            this.logMove("removedDistractor-" + distractorToRemove.hash());
        } else {
            var numberOfBlocks = this.numberOfBlocks(false);
            if (numberOfBlocks > 3) {
                alert($.i18n("msg_parson_will_combine"));
                this.combineBlocks();
                this.logMove("combinedBlocks");
            }
            /*else if(this.numberOfBlocks(true) > 3 && distractorToRemove !==  undefined) {
                           alert("Will remove an incorrect code block from source area");
                           this.removeDistractor(distractorToRemove);
                           this.logMove("removedDistractor-" + distractorToRemove.hash());
                       } */
            else {
                alert($.i18n("msg_parson_three_blocks_left"));
                this.canHelp = false;
            }
            //if (numberOfBlocks < 5) {
            //	this.canHelp = false;
            //	this.helpButton.disabled = true;
            //}
        }
    }
    // The "Help Me" button was pressed and the problem should be simplified
    helpMe() {
        this.clearFeedback();
        //this.helpCount = -1; // amount to allow for multiple helps in a row
        //if (this.helpCount < 0) {
        //	this.helpCount = Math.max(this.helpCount, -1); // min 1 attempt before more help
        //this.helpButton.disabled = true;
        //}
        // if less than 3 attempts
        if (this.numDistinct < 3) {
            alert($.i18n("msg_parson_atleast_three_attempts"));
        }
        // otherwise give help
        else {
            this.gotHelp = true;
            this.makeEasier();
        }
    }
    /* =====================================================================
    ==== UTILITY ===========================================================
    ===================================================================== */
    // Return a date from a timestamp (either mySQL or JS format)
    dateFromTimestamp(timestamp) {
        var date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            var t = timestamp.split(/[- :]/);
            date = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
        }
        return date;
    }
    // A function for returning a shuffled version of an array
    shuffled(array) {
        var currentIndex = array.length;
        var returnArray = array.slice();
        var temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = returnArray[currentIndex];
            returnArray[currentIndex] = returnArray[randomIndex];
            returnArray[randomIndex] = temporaryValue;
        }
        return returnArray;
    }
    /* =====================================================================
    ==== KEYBOARD INTERACTION ==============================================
    ===================================================================== */
    // When the user has entered the Parsons problem via keyboard mode
    enterKeyboardMode() {
        $(this.keyboardTip).show();
        $(this.sourceLabel).hide();
        $(this.answerLabel).hide();
        this.clearFeedback();
    }
    // When the user leaves the Parsons problem via keyboard mode
    exitKeyboardMode() {
        $(this.keyboardTip).hide();
        $(this.sourceLabel).show();
        $(this.answerLabel).show();
    }
    /* =====================================================================
    ==== VIEW ==============================================================
    ===================================================================== */
    // Clear any feedback from the answer area
    clearFeedback() {
        $(this.answerArea).removeClass("incorrect correct");
        var children = this.answerArea.childNodes;
        for (var i = 0; i < children.length; i++) {
            $(children[i]).removeClass(
                "correctPosition incorrectPosition indentLeft indentRight"
            );
        }
        $(this.messageDiv).hide();
    }
    // Disable the interface
    async disableInteraction() {
        // Disable blocks
        await this.checkServerComplete;
        console.log("disabling blocks");
        if (this.blocks !== undefined) {
            for (var i = 0; i < this.blocks.length; i++) {
                var block = this.blocks[i];
                block.disable();
            }
        }
        // Hide buttons
        $(this.checkButton).hide();
        $(this.resetButton).hide();
    }
    // Based on the moving element, etc., establish the moving state
    //   rest: not moving
    //   source: moving inside source area
    //   answer: moving inside answer area
    //   moving: moving outside areas
    movingState() {
        if (this.moving == undefined) {
            return "rest";
        }
        var x = this.movingX - window.pageXOffset;
        var y = this.movingY - window.pageYOffset;
        // Check if in answer area
        var bounds = this.answerArea.getBoundingClientRect();
        if (
            x >= bounds.left &&
            x <= bounds.right &&
            y >= bounds.top &&
            y <= bounds.bottom
        ) {
            return "answer";
        }
        // Check if in source area
        bounds = this.sourceArea.getBoundingClientRect();
        if (
            x >= bounds.left &&
            x <= bounds.right &&
            y >= bounds.top &&
            y <= bounds.bottom
        ) {
            return "source";
        }
        return "moving";
    }
    // Update the Parsons view
    // This gets called when dragging a block
    updateView() {
        // Based on the new and the old state, figure out what to update
        var state = this.state;
        var newState = this.movingState();
        var updateSource = true;
        var updateAnswer = true;
        var updateMoving = newState == "moving";
        if (state == newState) {
            if (newState == "rest") {
                updateSource = false;
                updateAnswer = false;
            } else if (newState == "source") {
                updateAnswer = false;
            } else if (newState == "answer") {
                updateSource = false;
            } else if (newState == "moving") {
                updateAnswer = false;
                updateSource = false;
            }
        }
        var movingHeight;
        if (this.moving !== undefined) {
            // Must get height here as detached items don't have height
            movingHeight = $(this.moving.view).outerHeight(true);
            $(this.moving.view).detach();
        }
        var positionTop, width;
        var baseWidth = this.areaWidth - 22;
        // Update the Source Area
        if (updateSource) {
            positionTop = 0;
            var blocks = this.sourceBlocks();
            if (newState == "source") {
                var hasInserted = false;
                var movingBin = this.moving.pairedBin();
                var binForBlock = [];
                for (i = 0; i < blocks.length; i++) {
                    binForBlock.push(blocks[i].pairedBin());
                }
                if (!binForBlock.includes(movingBin)) {
                    movingBin = -1;
                }
                var insertPositions = [];
                if (binForBlock.length == 0) {
                    insertPositions.push(0);
                } else {
                    if (movingBin == -1) {
                        insertPositions.push(0);
                    } else if (binForBlock[0] == movingBin) {
                        insertPositions.push(0);
                    }
                    for (i = 1; i < blocks.length; i++) {
                        if (binForBlock[i - 1] == movingBin) {
                            insertPositions.push(i);
                        } else if (binForBlock[i] == movingBin) {
                            insertPositions.push(i);
                        } else if (
                            movingBin == -1 &&
                            binForBlock[i - 1] != binForBlock[i]
                        ) {
                            insertPositions.push(i);
                        }
                    }
                    if (movingBin == -1) {
                        insertPositions.push(binForBlock.length);
                    } else if (
                        binForBlock[binForBlock.length - 1] == movingBin
                    ) {
                        insertPositions.push(binForBlock.length);
                    }
                }
                var x =
                    this.movingX -
                    this.sourceArea.getBoundingClientRect().left -
                    window.pageXOffset -
                    baseWidth / 2 -
                    11;
                var y =
                    this.movingY -
                    this.sourceArea.getBoundingClientRect().top -
                    window.pageYOffset;
                for (i = 0; i < blocks.length; i++) {
                    var item = blocks[i];
                    var j;
                    if (!hasInserted && insertPositions.includes(i)) {
                        var testHeight = $(item.view).outerHeight(true);
                        for (j = i + 1; j < blocks.length; j++) {
                            if (insertPositions.includes(j)) {
                                break;
                            }
                            testHeight += $(blocks[j].view).outerHeight(true);
                        }
                        if (
                            y - positionTop < movingHeight + testHeight / 2 ||
                            i == insertPositions[insertPositions.length - 1]
                        ) {
                            hasInserted = true;
                            this.sourceArea.insertBefore(
                                this.moving.view,
                                item.view
                            );
                            $(this.moving.view).css({
                                left: x,
                                top: y - movingHeight / 2,
                                width: baseWidth,
                                "z-index": 3,
                            });
                            positionTop = positionTop + movingHeight;
                        }
                    }
                    $(item.view).css({
                        left: 0,
                        top: positionTop,
                        width: baseWidth,
                        "z-index": 2,
                    });
                    positionTop = positionTop + $(item.view).outerHeight(true);
                }
                if (!hasInserted) {
                    $(this.moving.view).appendTo(
                        "#" + this.counterId + "-source"
                    );
                    $(this.moving.view).css({
                        left: x,
                        top: y - $(this.moving.view).outerHeight(true) / 2,
                        width: baseWidth,
                        "z-index": 3,
                    });
                }
            } else {
                for (var i = 0; i < blocks.length; i++) {
                    item = blocks[i];
                    $(item.view).css({
                        left: 0,
                        top: positionTop,
                        width: baseWidth,
                        "z-index": 2,
                    });
                    positionTop = positionTop + $(item.view).outerHeight(true);
                }
            }
            // Update the Paired Distractor Indicators
            for (i = 0; i < this.pairedBins.length; i++) {
                var bin = this.pairedBins[i];
                var matching = [];
                for (j = 0; j < blocks.length; j++) {
                    block = blocks[j];
                    if (block.matchesBin(bin)) {
                        matching.push(block);
                    }
                }
                var div = this.pairedDivs[i];
                if (matching.length == 0) {
                    $(div).hide();
                } else {
                    $(div).show();
                    var height = -5;
                    height += parseInt(
                        $(matching[matching.length - 1].view).css("top")
                    );
                    height -= parseInt($(matching[0].view).css("top"));
                    height += $(matching[matching.length - 1].view).outerHeight(
                        true
                    );
                    $(div).css({
                        left: -6,
                        top: $(matching[0].view).css("top"),
                        width: baseWidth + 34,
                        height: height,
                        "z-index": 1,
                        "text-indent": -30,
                        "padding-top": (height - 70) / 2,
                        overflow: "visible",
                        "font-size": 43,
                        "vertical-align": "middle",
                        color: "#7e7ee7",
                    });
                    $(div).html(
                        "<span id= 'st' style = 'vertical-align: middle; font-weight: bold; font-size: 15px'>or</span>{"
                    );
                }
                if (matching.length == 1) {
                    $(div).html("");
                }
            }
        }
        // Update the Answer Area
        if (updateAnswer) {
            var block, indent;
            positionTop = 0;
            width =
                this.areaWidth +
                this.indent * this.options.pixelsPerIndent -
                22;
            var blocks = this.answerBlocks();
            if (newState == "answer") {
                var hasInserted = false;
                var x =
                    this.movingX -
                    this.answerArea.getBoundingClientRect().left -
                    window.pageXOffset -
                    baseWidth / 2 -
                    11;
                var movingIndent = Math.round(x / this.options.pixelsPerIndent);
                if (movingIndent < 0) {
                    movingIndent = 0;
                } else if (movingIndent > this.indent) {
                    movingIndent = this.indent;
                } else {
                    x = movingIndent * this.options.pixelsPerIndent;
                }
                var y =
                    this.movingY -
                    this.answerArea.getBoundingClientRect().top -
                    window.pageYOffset;
                this.moving.indent = movingIndent;
                for (i = 0; i < blocks.length; i++) {
                    block = blocks[i];
                    if (!hasInserted) {
                        if (
                            y - positionTop <
                            (movingHeight + $(block.view).outerHeight(true)) / 2
                        ) {
                            hasInserted = true;
                            this.answerArea.insertBefore(
                                this.moving.view,
                                block.view
                            );
                            $(this.moving.view).css({
                                left: x,
                                top: y - movingHeight / 2,
                                width: baseWidth,
                                "z-index": 3,
                            });
                            positionTop = positionTop + movingHeight;
                        }
                    }
                    indent = block.indent * this.options.pixelsPerIndent;
                    $(block.view).css({
                        left: indent,
                        top: positionTop,
                        width: width - indent,
                        "z-index": 2,
                    });
                    positionTop = positionTop + $(block.view).outerHeight(true);
                }
                if (!hasInserted) {
                    $(this.moving.view).appendTo(
                        "#" + this.counterId + "-answer"
                    );
                    $(this.moving.view).css({
                        left: x,
                        top: y - $(this.moving.view).outerHeight(true) / 2,
                        width: baseWidth,
                        "z-index": 3,
                    });
                }
            } else {
                for (let i = 0; i < blocks.length; i++) {
                    block = blocks[i];
                    indent = block.indent * this.options.pixelsPerIndent;
                    $(block.view).css({
                        left: indent,
                        top: positionTop,
                        width: width - indent,
                        "z-index": 2,
                    });
                    positionTop = positionTop + $(block.view).outerHeight(true);
                }
            }
        }
        // Update the Moving Area
        if (updateMoving) {
            // Add it to the lowest place in the source area
            movingBin = this.moving.pairedBin();
            if (movingBin == -1) {
                $(this.moving.view).appendTo("#" + this.counterId + "-source");
            } else {
                var before;
                blocks = this.sourceBlocks;
                for (i = 0; i < blocks.length; i++) {
                    block = blocks[i];
                    if (block.pairedBin() == movingBin) {
                        before = i + 1;
                    }
                }
                if (before == undefined || before == blocks.length) {
                    $(this.moving.view).appendTo(
                        "#" + this.counterId + "-source"
                    );
                } else {
                    this.sourceArea.insertBefore(
                        this.moving.view,
                        blocks[before].view
                    );
                }
            }
            // Place in the middle of the mouse cursor
            $(this.moving.view).css({
                left: this.movingX -
                    this.sourceArea.getBoundingClientRect().left -
                    window.pageXOffset -
                    $(this.moving.view).outerWidth(true) / 2,
                top: this.movingY -
                    this.sourceArea.getBoundingClientRect().top -
                    window.pageYOffset -
                    movingHeight / 2,
                width: baseWidth,
                "z-index": 3,
            });
        }
        state = newState;
        this.state = state;
    }
    addBlockLabels(blocks) {
        var bin = -1;
        var binCount = 0;
        var binChildren = 0;
        var blocksNotInBins = 0;
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].pairedBin() == -1) {
                blocksNotInBins++;
            }
        }
        for (let i = 0; i < blocks.length; i++) {
            var currentBin = blocks[i].pairedBin();
            if (currentBin == -1 || currentBin != bin) {
                bin = currentBin;
                binChildren = 0;
                binCount++;
            }
            var label =
                "" +
                binCount +
                (currentBin != -1 ?
                    String.fromCharCode(97 + binChildren) :
                    " ");
            if (
                binCount < 10 &&
                blocksNotInBins + this.pairedBins.length >= 10
            ) {
                label += " ";
            }
            blocks[i].addLabel(label, 0);
            binChildren++;
        }
        if (blocksNotInBins + this.pairedBins.length >= 10) {
            this.areaWidth += 5;
            $(this.sourceArea).css({
                width: $(this.sourceArea).width() + 5,
            });
            $(this.answerArea).css({
                width: $(this.answerArea).width() + 5,
            });
        }
    }
    // Put all the blocks back into the source area, reshuffling as necessary
    resetView() {
        // Clear everything
        this.clearFeedback();
        var scrollTop = document.body.scrollTop;
        var block;
        for (let i = 0; i < this.blocks.length; i++) {
            block = this.blocks[i];
            for (var j = 0; j < block.lines.length; j++) {
                var children = $(block.lines[j].view).find(".block-label");
                for (var c = 0; c < children.length; c++) {
                    children[c].remove();
                }
            }
            block.destroy();
            $(this.blocks[i].view).detach();
        }
        delete this.blocks;
        this.blockIndex = 0;
        for (let i = 0; i < this.pairedDivs.length; i++) {
            $(this.pairedDivs[i]).detach();
        }
        $(this.sourceArea).attr("style", "");
        $(this.answerArea).removeClass();
        $(this.answerArea).attr("style", "");
        this.noindent = this.options.noindent;
        // Reinitialize
        if (this.hasSolved) {
            this.checkCount = 0;
            this.numDistinct = 0;
            this.hasSolved = false;
            if (this.options.adaptive) {
                this.canHelp = true;
            }
            //this.helpCount = -3; // enable after 3 failed attempts
            //this.helpButton.disabled = true;
            localStorage.setItem(this.adaptiveId + "Problem", this.divid);
            localStorage.setItem(
                this.adaptiveId + this.divid + "Count",
                this.checkCount
            );
            localStorage.setItem(this.adaptiveId + "Solved", false);
        }
        this.initializeAreas(this.blocksFromSource(), [], {});
        this.initializeInteractivity();
        document.body.scrollTop = scrollTop;
    }
}

Parsons.counter = 0;

$(document).on("runestone:login-complete", function() {
    $("[data-component=parsons]").each(function(index) {
        if ($(this).closest("[data-component=timedAssessment]").length == 0) {
            try {
                prsList[this.id] = new Parsons({
                    orig: this,
                    useRunestoneServices: eBookConfig.useRunestoneServices,
                });
            } catch (err) {
                console.log(`Error rendering Parsons Problem ${this.id}
                             Details: ${err}`);
                console.log(err.stack);
            }
        }
    });
});


/***/ }),

/***/ 404:
/*!**********************************************!*\
  !*** ./runestone/parsons/js/parsonsBlock.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ParsonsBlock)
/* harmony export */ });
/* harmony import */ var _hammer_min_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hammer.min.js */ 97430);
/* harmony import */ var _hammer_min_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_hammer_min_js__WEBPACK_IMPORTED_MODULE_0__);
/* =====================================================================
==== ParsonsBlock Object ===============================================
======== The model and view of a code block.
==== PROPERTIES ========================================================
======== problem: the Parsons problem
======== lines: an array of ParsonsLine in this block
======== indent: indent based on movement
======== view: an element for viewing this object
======== labels: [label, line] the labels numbering the block and the lines they go on
======== hammer: the controller based on hammer.js
===================================================================== */



// Initialize based on the problem and the lines
class ParsonsBlock {
    constructor(problem, lines) {
        this.problem = problem;
        this.lines = lines;
        this.indent = 0;
        this.labels = [];
        // Create view, adding view of lines and updating indent
        var view = document.createElement("div");
        view.id = problem.counterId + "-block-" + problem.blockIndex;
        problem.blockIndex += 1;
        $(view).addClass("block");
        var sharedIndent = lines[0].indent;
        for (let i = 1; i < lines.length; i++) {
            sharedIndent = Math.min(sharedIndent, lines[i].indent);
        }
        var lineDiv = document.createElement("div");
        $(lineDiv).addClass("lines");
        $(view).append(lineDiv);
        for (let i = 0; i < lines.length; i++) {
            var line = lines[i];
            var lineIndent;
            if (problem.noindent) {
                lineIndent = line.indent;
            } else {
                lineIndent = line.indent - sharedIndent;
            }
            $(line.view).removeClass("indent1 indent2 indent3 indent4");
            if (lineIndent > 0) {
                $(line.view).addClass("indent" + lineIndent);
            }
            lineDiv.appendChild(line.view);
        }
        var labelDiv = document.createElement("div");
        $(labelDiv).addClass("labels");
        if (this.problem.options.numbered == "left") {
            $(lineDiv).addClass("border_left");
            $(view).prepend(labelDiv);
            $(view).css({
                "justify-content": "flex-start",
            });
        } else if (this.problem.options.numbered == "right") {
            $(labelDiv).addClass("border_left");
            $(labelDiv).css({
                float: "right",
            });
            $(view).css({
                "justify-content": "space-between",
            });
            $(view).append(labelDiv);
        }
        this.view = view;
    }
    // Add a line (from another block) to this block
    addLine(line) {
        $(line.view).removeClass("indent1 indent2 indent3 indent4");
        if (this.problem.noindent) {
            if (line.indent > 0) {
                $(line.view).addClass("indent" + line.indent);
            }
        } else {
            var lines = this.lines;
            var sharedIndent = lines[0].indent;
            for (let i = 1; i < lines.length; i++) {
                sharedIndent = Math.min(sharedIndent, lines[i].indent);
            }
            if (sharedIndent < line.indent) {
                $(line.view).addClass("indent" + (line.indent - sharedIndent));
            } else if (sharedIndent > line.indent) {
                for (let i = 0; i < lines.length; i++) {
                    $(lines[i].view).removeClass(
                        "indent1 indent2 indent3 indent4"
                    );
                    $(lines[i].view).addClass(
                        "indent" + (lines[i].indent - line.indent)
                    );
                }
            }
        }
        this.lines.push(line);
        $(this.view).children(".lines")[0].appendChild(line.view);
    }
    // Add the contents of that block to myself and then delete that block
    consumeBlock(block) {
        for (let i = 0; i < block.lines.length; i++) {
            this.addLine(block.lines[i]);
        }
        if ($(block.view).attr("tabindex") == "0") {
            this.makeTabIndex();
        }
        $(block.view).detach();
        var newBlocks = [];
        for (let i = 0; i < this.problem.blocks.length; i++) {
            if (this.problem.blocks[i] !== block) {
                newBlocks.push(this.problem.blocks[i]);
            }
        }
        for (let i = 0; i < block.labels.length; i++) {
            this.addLabel(
                block.labels[i][0],
                this.lines.length - block.lines.length + block.labels[i][1]
            );
        }
        this.problem.blocks = newBlocks;
        this.problem.state = undefined;
        this.problem.updateView();
    }
    // Update the model and view when block is converted to contain indent
    addIndent() {
        // Update the lines model / view
        for (let i = 0; i < this.lines.length; i++) {
            var line = this.lines[i];
            if (line.indent > 0) {
                $(line.view).removeClass("indent1 indent2 indent3 indent4");
                $(line.view).addClass("indent" + line.indent);
            }
        }
        // Update the block model / view
        this.indent = 0;
        $(this.view).css({
            "padding-left": "",
            width: this.problem.areaWidth - 22,
        });
    }
    // Add a label to block and update its view
    addLabel(label, line) {
        var div = document.createElement("div");
        $(div).addClass("block-label");
        if (this.problem.options.numbered == "right") {
            $(div).addClass("right-label");
        }
        if (this.problem.options.numbered == "left") {
            $(div).addClass("left-label");
        }
        $(div).append(document.createTextNode(label));
        $(this.view).children(".labels")[0].append(div);
        if (this.labels.length != 0) {
            $(div).css(
                "margin-top",
                (line - this.labels[this.labels.length - 1][1] - 1) *
                    this.lines[line].view.offsetHeight
            );
        }
        this.labels.push([label, line]);
    }
    // Initialize Interactivity
    initializeInteractivity() {
        if ($(this.view).hasClass("disabled")) {
            return this;
        }
        $(this.view).attr("tabindex", "-1");
        this.hammer = new (_hammer_min_js__WEBPACK_IMPORTED_MODULE_0___default().Manager)(this.view, {
            recognizers: [
                [
                    (_hammer_min_js__WEBPACK_IMPORTED_MODULE_0___default().Pan),
                    {
                        direction: (_hammer_min_js__WEBPACK_IMPORTED_MODULE_0___default().DIRECTION_ALL),
                        threshold: 0,
                        pointers: 1,
                    },
                ],
            ],
        });
        var that = this;
        this.hammer.on("panstart", function (event) {
            that.panStart(event);
        });
        this.hammer.on("panend", function (event) {
            that.panEnd(event);
        });
        this.hammer.on("panmove", function (event) {
            that.panMove(event);
        });
    }
    // Return a boolean as to whether this block is able to be selected
    enabled() {
        return $(this.view).attr("tabindex") !== undefined;
    }
    // Return a boolean as to whether this block is a distractor
    isDistractor() {
        return this.lines[0].distractor;
    }
    // Return a boolean as to whether this block is in the source area
    inSourceArea() {
        var children = this.problem.sourceArea.childNodes;
        for (let i = 0; i < children.length; i++) {
            var item = children[i];
            if (item.id == this.view.id) {
                return true;
            }
        }
        return false;
    }
    // Return the page X position of the center of the view
    pageXCenter() {
        var boundingRect = this.view.getBoundingClientRect();
        var pageXCenter =
            window.pageXOffset + boundingRect.left + boundingRect.width / 2;
        return pageXCenter;
    }
    // Return the page Y position of the center of the view
    pageYCenter() {
        var boundingRect = this.view.getBoundingClientRect();
        var pageYCenter =
            window.pageYOffset + boundingRect.top + boundingRect.height / 2;
        return pageYCenter;
    }
    // Of all the line indents, return the minimum value
    minimumLineIndent() {
        var minimumLineIndent = this.lines[0].indent;
        for (let i = 1; i < this.lines.length; i++) {
            minimumLineIndent = Math.min(
                this.lines[i].indent,
                minimumLineIndent
            );
        }
        return minimumLineIndent;
    }
    // Return the last block in the source area that matches the paired bin it is in
    slideUnderBlock() {
        var sourceBlocks = this.problem.sourceBlocks();
        if (sourceBlocks.length == 0) {
            return undefined;
        }
        var pairedBin = this.pairedBin();
        if (pairedBin == -1) {
            return sourceBlocks[sourceBlocks.length - 1];
        }
        for (let i = sourceBlocks.length - 1; i >= 0; i--) {
            var block = sourceBlocks[i];
            if (block.pairedBin() == pairedBin) {
                return block;
            }
        }
        return sourceBlocks[sourceBlocks.length - 1];
    }
    // Return which paired bin it is in (-1) if not
    pairedBin() {
        var pairedBins = this.problem.pairedBins;
        for (var i = 0; i < pairedBins.length; i++) {
            if (this.matchesBin(pairedBins[i])) {
                return i;
            }
        }
        return -1;
    }
    // Return true if all lines are in that bin
    matchesBin(bin) {
        for (var i = 0; i < this.lines.length; i++) {
            var test = this.lines[i].index;
            if (bin.indexOf(test) == -1) {
                return false;
            }
        }
        return true;
    }
    // Return a list of indexes where this block could be inserted before
    validSourceIndexes() {
        var blocks = this.problem.sourceBlocks();
        var indexes = [];
        var pairedBin = this.pairedBin();
        var i, lastBin;
        if (pairedBin >= 0) {
            for (i = 0; i < blocks.length; i++) {
                var block = blocks[i];
                if (block.view.id !== this.view.id) {
                    var blockBin = block.pairedBin();
                    if (blockBin == pairedBin) {
                        indexes.push(i);
                    } else if (lastBin == pairedBin) {
                        indexes.push(i);
                    }
                    lastBin = blockBin;
                }
            }
            if (lastBin == pairedBin) {
                indexes.push(blocks.length);
            }
            if (indexes.length > 0) {
                return indexes;
            }
        }
        for (i = 0; i < blocks.length; i++) {
            let block = blocks[i];
            if (block.view.id !== this.view.id) {
                let blockBin = block.pairedBin();
                if (blockBin !== lastBin) {
                    indexes.push(i);
                } else if (blockBin == -1) {
                    indexes.push(i);
                }
                lastBin = blockBin;
            }
        }
        indexes.push(blocks.length);
        return indexes;
    }
    // A measure of how far the middle of this block is vertically positioned
    verticalOffset() {
        var verticalOffset;
        if (this.inSourceArea()) {
            verticalOffset = this.problem.sourceArea.getBoundingClientRect()
                .top;
        } else {
            verticalOffset = this.problem.answerArea.getBoundingClientRect()
                .top;
        }
        verticalOffset =
            this.view.getBoundingClientRect().top +
            this.view.getBoundingClientRect().bottom -
            verticalOffset * 2;
        return verticalOffset;
    }
    // This block just gained textual focus
    newFocus() {
        if (this.problem.textFocus == undefined) {
            this.problem.enterKeyboardMode();
            this.problem.textFocus = this;
            this.problem.textMove = false;
            $(this.view).addClass("down");
        } else if (this.problem.textFocus == this) {
            if (this.problem.textMove) {
                $(this.view).addClass("up");
            } else {
                $(this.view).addClass("down");
            }
        } else {
            // already in keyboard mode
            this.problem.textFocus = this;
            this.problem.textMove = false;
            $(this.view).addClass("down");
        }
        this.problem.textMoving = false;
    }
    // This block just lost textual focus
    releaseFocus() {
        $(this.view).removeClass("down up");
        if (this.problem.textFocus == this) {
            if (!this.problem.textMoving) {
                // exit out of problem but stay way into problem
                this.problem.textFocus = undefined;
                if (this.problem.textMove) {
                    this.problem.logMove("kmove");
                    this.problem.textMove = false;
                }
                this.problem.exitKeyboardMode();
            }
        } else {
            // become selectable, but not active
            $(this.view).attr("tabindex", "-1");
            $(this.view).unbind("focus");
            $(this.view).unbind("blur");
            $(this.view).unbind("keydown");
        }
    }
    // Make this block into the keyboard entry point
    makeTabIndex() {
        $(this.view).attr("tabindex", "0");
        var that = this;
        $(this.view).focus(function () {
            that.newFocus();
        });
        $(this.view).blur(function () {
            that.releaseFocus();
        });
        $(this.view).keydown(function (event) {
            that.keyDown(event);
        });
    }
    // Called to disable interaction for the future
    disable() {
        if (this.hammer !== undefined) {
            this.hammer.set({ enable: false });
        }
        if ($(this.view).attr("tabindex") == "0") {
            this.releaseFocus();
            $(this.view).removeAttr("tabindex");
            this.problem.initializeTabIndex();
        } else {
            $(this.view).removeAttr("tabindex");
        }
    }
    // Enable functionality after reset button has been pressed
    resetView() {
        if (this.hammer !== undefined) {
            this.hammer.set({ enable: true });
        }
        if (!$(this.view)[0].hasAttribute("tabindex")) {
            $(this.view).attr("tabindex", "-1");
        }
        $(this.view).css({ opacity: "" });
    }
    // Called to destroy interaction for the future
    destroy() {
        if (this.hammer !== undefined) {
            this.hammer.destroy();
            delete this.hammer;
        }
        if ($(this.view).attr("tabindex") == "0") {
            this.releaseFocus();
        }
        $(this.view).removeAttr("tabindex");
    }
    // Called when a block is picked up
    panStart(event) {
        this.problem.clearFeedback();
        if (this.problem.started == undefined) {
            // log the first time that something gets moved
            this.problem.started = true;
            this.problem.logMove("start");
        }
        if (this.problem.textFocus !== undefined) {
            // stop text focus when dragging
            this.problem.textFocus.releaseFocus();
        }
        this.problem.moving = this;
        // Update the view
        this.problem.movingX = event.srcEvent.pageX;
        this.problem.movingY = event.srcEvent.pageY;
        this.problem.updateView();
    }
    // Called when a block is dropped
    panEnd(event) {
        this.problem.isAnswered = true;
        delete this.problem.moving;
        delete this.problem.movingX;
        delete this.problem.movingY;
        this.problem.updateView();
        this.problem.logMove("move");
    }
    // Called when a block is moved
    panMove(event) {
        // Update the view
        this.problem.movingX = event.srcEvent.pageX;
        this.problem.movingY = event.srcEvent.pageY;
        this.problem.updateView();
    }
    // Handle a keypress event when in focus
    keyDown(event) {
        if (this.problem.started == undefined) {
            // log the first time that something gets moved
            this.problem.started = true;
            this.problem.logMove("kstart");
        }
        switch (event.keyCode) {
            case 37: // left
                if (this.problem.textMove) {
                    this.moveLeft();
                } else {
                    this.selectLeft();
                }
                break;
            case 38: // up
                if (this.problem.textMove) {
                    this.moveUp();
                } else {
                    this.selectUp();
                }
                event.preventDefault();
                break;
            case 39: // right
                if (this.problem.textMove) {
                    this.moveRight();
                } else {
                    this.selectRight();
                }
                event.preventDefault();
                break;
            case 40: // down
                if (this.problem.textMove) {
                    this.moveDown();
                } else {
                    this.selectDown();
                }
                event.preventDefault();
                break;
            case 32: // space
                this.toggleMove();
                event.preventDefault();
                break;
            case 13: // enter
                this.toggleMove();
                event.preventDefault();
                break;
        }
    }
    // Move block left
    moveLeft() {
        var index, block;
        if (!this.inSourceArea()) {
            if (this.indent == 0) {
                // move to source area
                var blocks = this.problem.sourceBlocks();
                var offset = this.verticalOffset();
                var validSourceIndexes = this.validSourceIndexes();
                for (var i = 0; i < validSourceIndexes.length; i++) {
                    index = validSourceIndexes[i];
                    if (index == blocks.length) {
                        this.problem.textMoving = true;
                        this.problem.sourceArea.appendChild(this.view);
                        $(this.view).focus();
                        this.problem.state = undefined;
                        this.problem.updateView();
                        return this;
                    } else {
                        block = blocks[index];
                        if (block.verticalOffset() >= offset) {
                            break;
                        }
                    }
                }
                this.problem.textMoving = true;
                this.problem.sourceArea.insertBefore(this.view, block.view);
                $(this.view).focus();
            } else {
                // reduce indent
                this.indent = this.indent - 1;
            }
            this.problem.state = undefined;
            this.problem.updateView();
        }
    }
    // Move block up
    moveUp() {
        if (this.inSourceArea()) {
            let blocks = this.problem.sourceBlocks();
            var offset = this.verticalOffset();
            var validSourceIndexes = this.validSourceIndexes();
            for (let i = 0; i < validSourceIndexes.length; i++) {
                var index =
                    validSourceIndexes[validSourceIndexes.length - 1 - i];
                if (index < blocks.length) {
                    var block = blocks[index];
                    if (block.verticalOffset() < offset) {
                        this.problem.textMoving = true;
                        this.problem.sourceArea.insertBefore(
                            this.view,
                            block.view
                        );
                        $(this.view).focus();
                        this.problem.state = undefined;
                        this.problem.updateView();
                        return this;
                    }
                }
            }
        } else {
            let blocks = this.problem.answerBlocks();
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i].view.id == this.view.id) {
                    if (i == 0) {
                        return this;
                    }
                    this.problem.textMoving = true;
                    this.problem.answerArea.insertBefore(
                        this.view,
                        blocks[i - 1].view
                    );
                    $(this.view).focus();
                    this.problem.state = undefined;
                    this.problem.updateView();
                }
            }
        }
    }
    // Move block right
    moveRight() {
        if (this.inSourceArea()) {
            // move to answer area
            this.indent = 0;
            var offset = this.verticalOffset();
            var answerBlocks = this.problem.answerBlocks();
            for (var i = 0; i < answerBlocks.length; i++) {
                var item = answerBlocks[i];
                var itemOffset = item.verticalOffset();
                if (itemOffset >= offset) {
                    this.problem.textMoving = true;
                    this.problem.answerArea.insertBefore(this.view, item.view);
                    $(this.view).focus();
                    this.problem.state = undefined;
                    this.problem.updateView();
                    return this;
                }
            }
            this.problem.textMoving = true;
            this.problem.answerArea.appendChild(this.view);
            $(this.view).focus();
            this.problem.state = undefined;
            this.problem.updateView();
        } else {
            // in answer area: increase the indent
            if (this.indent !== this.problem.indent) {
                this.indent = this.indent + 1;
                this.problem.state = undefined;
                this.problem.updateView();
            }
        }
    }
    // Move block down
    moveDown() {
        if (this.inSourceArea()) {
            let blocks = this.problem.sourceBlocks();
            var validSourceIndexes = this.validSourceIndexes();
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i].view.id == this.view.id) {
                    var myIndex = i;
                }
            }
            for (let i = 0; i < validSourceIndexes.length; i++) {
                var index = validSourceIndexes[i];
                if (index == blocks.length) {
                    this.problem.textMoving = true;
                    this.problem.sourceArea.appendChild(this.view);
                    $(this.view).focus();
                    this.problem.state = undefined;
                    this.problem.updateView();
                    return this;
                } else if (index - myIndex > 1) {
                    this.problem.textMoving = true;
                    this.problem.sourceArea.insertBefore(
                        this.view,
                        blocks[index].view
                    );
                    $(this.view).focus();
                    this.problem.state = undefined;
                    this.problem.updateView();
                    return this;
                }
            }
        } else {
            let blocks = this.problem.answerBlocks();
            for (var i = 0; i < blocks.length; i++) {
                if (blocks[i].view.id == this.view.id) {
                    if (i == blocks.length - 1) {
                        return this;
                    } else if (i == blocks.length - 2) {
                        this.problem.textMoving = true;
                        this.problem.answerArea.appendChild(this.view);
                    } else {
                        this.problem.textMoving = true;
                        this.problem.answerArea.insertBefore(
                            this.view,
                            blocks[i + 2].view
                        );
                    }
                    $(this.view).focus();
                    this.problem.state = undefined;
                    this.problem.updateView();
                }
            }
        }
    }
    // Move selection left
    selectLeft() {
        if (!this.inSourceArea()) {
            var offset = this.verticalOffset();
            var sourceBlocks = this.problem.enabledSourceBlocks();
            if (sourceBlocks.length == 0) {
                return this;
            }
            var chooseNext = sourceBlocks[0];
            var chooseOffset = chooseNext.verticalOffset() - offset;
            for (var i = 1; i < sourceBlocks.length; i++) {
                var item = sourceBlocks[i];
                var itemOffset = item.verticalOffset() - offset;
                if (Math.abs(itemOffset) < Math.abs(chooseOffset)) {
                    chooseNext = item;
                    chooseOffset = itemOffset;
                }
            }
            this.problem.textFocus = chooseNext;
            chooseNext.makeTabIndex();
            $(chooseNext.view).focus();
        }
    }
    // Move selection up
    selectUp() {
        var chooseNext = false;
        var blocks;
        if (this.inSourceArea()) {
            blocks = this.problem.enabledSourceBlocks();
        } else {
            blocks = this.problem.enabledAnswerBlocks();
        }
        for (var i = blocks.length - 1; i >= 0; i--) {
            var item = blocks[i];
            if (chooseNext) {
                this.problem.textFocus = item;
                item.makeTabIndex();
                $(item.view).focus();
                return this;
            } else {
                if (item.view.id == this.view.id) {
                    chooseNext = true;
                }
            }
        }
    }
    // Move selection right
    selectRight() {
        if (this.inSourceArea()) {
            var offset = this.verticalOffset();
            var blocks = this.problem.enabledAnswerBlocks();
            if (blocks.length == 0) {
                return this;
            }
            var chooseNext = blocks[0];
            var chooseOffset = chooseNext.verticalOffset() - offset;
            for (var i = 1; i < blocks.length; i++) {
                var item = blocks[i];
                var itemOffset = item.verticalOffset() - offset;
                if (Math.abs(itemOffset) < Math.abs(chooseOffset)) {
                    chooseNext = item;
                    chooseOffset = itemOffset;
                }
            }
            this.problem.textFocus = chooseNext;
            chooseNext.makeTabIndex();
            $(chooseNext.view).focus();
        }
    }
    // Move selection down
    selectDown() {
        var chooseNext = false;
        var blocks;
        if (this.inSourceArea()) {
            blocks = this.problem.enabledSourceBlocks();
        } else {
            blocks = this.problem.enabledAnswerBlocks();
        }
        for (var i = 0; i < blocks.length; i++) {
            var item = blocks[i];
            if (chooseNext) {
                this.problem.textFocus = item;
                item.makeTabIndex();
                $(item.view).focus();
                return this;
            } else {
                if (item.view.id == this.view.id) {
                    chooseNext = true;
                }
            }
        }
    }
    // Toggle whether to move this block
    toggleMove() {
        if (this.problem.textMove) {
            $(this.view).removeClass("up");
            $(this.view).addClass("down");
            this.problem.textMove = false;
            this.problem.logMove("kmove");
        } else {
            $(this.view).removeClass("down");
            $(this.view).addClass("up");
            this.problem.textMove = true;
        }
    }
    // Answer a string that represents this codeblock for saving
    hash() {
        var hash = "";
        for (var i = 0; i < this.lines.length; i++) {
            hash += this.lines[i].index + "_";
        }
        hash += this.indent;
        return hash;
    }
    // Answer what the indent should be for the solution
    solutionIndent() {
        var sharedIndent = this.lines[0].indent;
        for (var i = 1; i < this.lines.length; i++) {
            sharedIndent = Math.min(sharedIndent, this.lines[i].indent);
        }
        return sharedIndent;
    }
}


/***/ }),

/***/ 18423:
/*!*********************************************!*\
  !*** ./runestone/parsons/js/parsonsLine.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ParsonsLine)
/* harmony export */ });
/* =====================================================================
==== ParsonsLine Object ================================================
======== The model and view of a line of code.
======== Based on what is specified in the problem.
======== ParsonBlock objects have one or more of these.
==== PROPERTIES ========================================================
======== problem: the Parsons problem
======== index: the index of the line in the problem
======== text: the text of the code line
======== indent: the indent level
======== view: an element for viewing this object
======== distractor: whether it is a distractor
======== paired: whether it is a paired distractor
======== groupWithNext: whether it is grouped with the following line
======== width: the pixel width when rendered
============ in the initial grouping
===================================================================== */
// Initialize from codestring

class ParsonsLine {
    constructor(problem, codestring, displaymath) {
        this.problem = problem;
        this.index = problem.lines.length;
        var trimmed = codestring.replace(/\s*$/, "");
        this.text = trimmed.replace(/^\s*/, "");
        this.indent = trimmed.length - this.text.length;
        // Create the View
        var view;
        // TODO: this does not work with display math... Perhaps with pretext we should have html as a language and do nothing?
        
        if (problem.options.language == "natural" || problem.options.language == "math") {
            if (! displaymath) {
                view = document.createElement("p");
            } else {
                view = document.createElement("div");
            }
        } else {
            view = document.createElement("code");
            $(view).addClass(problem.options.prettifyLanguage);
        }
        view.id = problem.counterId + "-line-" + this.index;
        view.innerHTML += this.text;
        this.view = view;
        problem.lines.push(this);
    }
    // Initialize what width the line would naturally have (without indent)
    initializeWidth() {
        // this.width does not appear to be used anywhere later
        // since changing the value of this.width appears to have no effect. - Vincent Qiu (September 2020)
        this.width =
            $(this.view).outerWidth(true) -
            this.problem.options.pixelsPerIndent * this.indent;

        // Pass this information on to be used in class Parsons function initializeAreas
        // to manually determine appropriate widths - Vincent Qiu (September 2020)
        this.view.fontSize = window
            .getComputedStyle(this.view, null)
            .getPropertyValue("font-size");
        this.view.pixelsPerIndent = this.problem.options.pixelsPerIndent;
        this.view.indent = this.indent;

        // Figure out which typeface will be rendered by comparing text widths to browser default - Vincent Qiu (September 2020)
        var tempCanvas = document.createElement("canvas");
        var tempCanvasCtx = tempCanvas.getContext("2d");
        var possibleFonts = window
            .getComputedStyle(this.view, null)
            .getPropertyValue("font-family")
            .split(", ");
        var fillerText = "abcdefghijklmnopqrstuvwxyz0123456789,./!@#$%^&*-+";
        tempCanvasCtx.font = this.view.fontSize + " serif";
        var serifWidth = tempCanvasCtx.measureText(fillerText).width;
        for (let i = 0; i < possibleFonts.length; i++) {
            if (possibleFonts[i].includes('"')) {
                possibleFonts[i] = possibleFonts[i].replaceAll('"', "");
            }
            if (possibleFonts[i].includes("'")) {
                possibleFonts[i] = possibleFonts[i].replaceAll("'", "");
            }
            tempCanvasCtx.font = this.view.fontSize + " " + possibleFonts[i];
            if (tempCanvasCtx.measureText(fillerText).width !== serifWidth) {
                this.view.fontFamily = possibleFonts[i];
                break;
            }
        }
    }
    // Answer the block that this line is currently in
    block() {
        for (let i = 0; i < this.problem.blocks.length; i++) {
            var block = this.problem.blocks[i];
            for (var j = 0; j < block.lines.length; j++) {
                if (block.lines[j] === this) {
                    return block;
                }
            }
        }
        return undefined;
    }
    // Answer the indent based on the view
    viewIndent() {
        if (this.problem.noindent) {
            return this.indent;
        } else {
            var block = this.block();
            return this.indent - block.solutionIndent() + block.indent;
        }
    }
}


/***/ }),

/***/ 87904:
/*!******************************************!*\
  !*** ./runestone/parsons/js/prettify.js ***!
  \******************************************/
/***/ (() => {

function H() {
    var x =
        navigator &&
        navigator.userAgent &&
        /\bMSIE 6\./.test(navigator.userAgent);
    H = function() {
        return x;
    };
    return x;
}
(function() {
    function x(b) {
        b = b.split(/ /g);
        var a = {};
        for (var c = b.length; --c >= 0; ) {
            var d = b[c];
            if (d) a[d] = null;
        }
        return a;
    }
    var y = "break continue do else for if return while ",
        U =
            y +
            "auto case char const default double enum extern float goto int long register short signed sizeof static struct switch typedef union unsigned void volatile ",
        D =
            U +
            "catch class delete false import new operator private protected public this throw true try ",
        I =
            D +
            "alignof align_union asm axiom bool concept concept_map const_cast constexpr decltype dynamic_cast explicit export friend inline late_check mutable namespace nullptr reinterpret_cast static_assert static_cast template typeid typename typeof using virtual wchar_t where ",
        J =
            D +
            "boolean byte extends final finally implements import instanceof null native package strictfp super synchronized throws transient ",
        V =
            J +
            "as base by checked decimal delegate descending event fixed foreach from group implicit in interface internal into is lock object out override orderby params readonly ref sbyte sealed stackalloc string select uint ulong unchecked unsafe ushort var ",
        K =
            D +
            "debugger eval export function get null set undefined var with Infinity NaN ",
        L =
            "caller delete die do dump elsif eval exit foreach for goto if import last local my next no our print package redo require sub undef unless until use wantarray while BEGIN END ",
        M =
            y +
            "and as assert class def del elif except exec finally from global import in is lambda nonlocal not or pass print raise try with yield False True None ",
        N =
            y +
            "alias and begin case class def defined elsif end ensure false in module next nil not or redo rescue retry self super then true undef unless until when yield BEGIN END ",
        O = y + "case done elif esac eval fi function in local set then until ",
        W = I + V + K + L + M + N + O;
    function X(b) {
        return (b >= "a" && b <= "z") || (b >= "A" && b <= "Z");
    }
    function u(b, a, c, d) {
        b.unshift(c, d || 0);
        try {
            a.splice.apply(a, b);
        } finally {
            b.splice(0, 2);
        }
    }
    var Y = (function() {
            var b = [
                    "!",
                    "!=",
                    "!==",
                    "#",
                    "%",
                    "%=",
                    "&",
                    "&&",
                    "&&=",
                    "&=",
                    "(",
                    "*",
                    "*=",
                    "+=",
                    ",",
                    "-=",
                    "->",
                    "/",
                    "/=",
                    ":",
                    "::",
                    ";",
                    "<",
                    "<<",
                    "<<=",
                    "<=",
                    "=",
                    "==",
                    "===",
                    ">",
                    ">=",
                    ">>",
                    ">>=",
                    ">>>",
                    ">>>=",
                    "?",
                    "@",
                    "[",
                    "^",
                    "^=",
                    "^^",
                    "^^=",
                    "{",
                    "|",
                    "|=",
                    "||",
                    "||=",
                    "~",
                    "break",
                    "case",
                    "continue",
                    "delete",
                    "do",
                    "else",
                    "finally",
                    "instanceof",
                    "return",
                    "throw",
                    "try",
                    "typeof"
                ],
                a =
                    "(?:(?:(?:^|[^0-9.])\\.{1,3})|(?:(?:^|[^\\+])\\+)|(?:(?:^|[^\\-])-)";
            for (var c = 0; c < b.length; ++c) {
                var d = b[c];
                a += X(d.charAt(0))
                    ? "|\\b" + d
                    : "|" + d.replace(/([^=<>:&])/g, "\\$1");
            }
            a += "|^)\\s*$";
            return new RegExp(a);
        })(),
        P = /&/g,
        Q = /</g,
        R = />/g,
        Z = /\"/g;
    function $(b) {
        return b
            .replace(P, "&amp;")
            .replace(Q, "&lt;")
            .replace(R, "&gt;")
            .replace(Z, "&quot;");
    }
    function E(b) {
        return b
            .replace(P, "&amp;")
            .replace(Q, "&lt;")
            .replace(R, "&gt;");
    }
    var aa = /&lt;/g,
        ba = /&gt;/g,
        ca = /&apos;/g,
        da = /&quot;/g,
        ea = /&amp;/g,
        fa = /&nbsp;/g;
    function ga(b) {
        var a = b.indexOf("&");
        if (a < 0) return b;
        for (--a; (a = b.indexOf("&#", a + 1)) >= 0; ) {
            var c = b.indexOf(";", a);
            if (c >= 0) {
                var d = b.substring(a + 3, c),
                    g = 10;
                if (d && d.charAt(0) === "x") {
                    d = d.substring(1);
                    g = 16;
                }
                var e = parseInt(d, g);
                if (!isNaN(e))
                    b =
                        b.substring(0, a) +
                        String.fromCharCode(e) +
                        b.substring(c + 1);
            }
        }
        return b
            .replace(aa, "<")
            .replace(ba, ">")
            .replace(ca, "'")
            .replace(da, '"')
            .replace(ea, "&")
            .replace(fa, " ");
    }
    function S(b) {
        return "XMP" === b.tagName;
    }
    function z(b, a) {
        switch (b.nodeType) {
            case 1:
                var c = b.tagName.toLowerCase();
                a.push("<", c);
                for (var d = 0; d < b.attributes.length; ++d) {
                    var g = b.attributes[d];
                    if (!g.specified) continue;
                    a.push(" ");
                    z(g, a);
                }
                a.push(">");
                for (var e = b.firstChild; e; e = e.nextSibling) z(e, a);
                if (b.firstChild || !/^(?:br|link|img)$/.test(c))
                    a.push("</", c, ">");
                break;
            case 2:
                a.push(b.name.toLowerCase(), '="', $(b.value), '"');
                break;
            case 3:
            case 4:
                a.push(E(b.nodeValue));
                break;
        }
    }
    var F = null;
    function ha(b) {
        if (null === F) {
            var a = document.createElement("PRE");
            a.appendChild(
                document.createTextNode(
                    '<!DOCTYPE foo PUBLIC "foo bar">\n<foo />'
                )
            );
            F = !/</.test(a.innerHTML);
        }
        if (F) {
            var c = b.innerHTML;
            if (S(b)) c = E(c);
            return c;
        }
        var d = [];
        for (var g = b.firstChild; g; g = g.nextSibling) z(g, d);
        return d.join("");
    }
    function ia(b) {
        var a = 0;
        return function(c) {
            var d = null,
                g = 0;
            for (var e = 0, h = c.length; e < h; ++e) {
                var f = c.charAt(e);
                switch (f) {
                    case "\t":
                        if (!d) d = [];
                        d.push(c.substring(g, e));
                        var i = b - (a % b);
                        a += i;
                        for (; i >= 0; i -= "                ".length)
                            d.push("                ".substring(0, i));
                        g = e + 1;
                        break;
                    case "\n":
                        a = 0;
                        break;
                    default:
                        ++a;
                }
            }
            if (!d) return c;
            d.push(c.substring(g));
            return d.join("");
        };
    }
    var ja = /(?:[^<]+|<!--[\s\S]*?--\>|<!\[CDATA\[([\s\S]*?)\]\]>|<\/?[a-zA-Z][^>]*>|<)/g,
        ka = /^<!--/,
        la = /^<\[CDATA\[/,
        ma = /^<br\b/i;
    function na(b) {
        var a = b.match(ja),
            c = [],
            d = 0,
            g = [];
        if (a)
            for (var e = 0, h = a.length; e < h; ++e) {
                var f = a[e];
                if (f.length > 1 && f.charAt(0) === "<") {
                    if (ka.test(f)) continue;
                    if (la.test(f)) {
                        c.push(f.substring(9, f.length - 3));
                        d += f.length - 12;
                    } else if (ma.test(f)) {
                        c.push("\n");
                        ++d;
                    } else g.push(d, f);
                } else {
                    var i = ga(f);
                    c.push(i);
                    d += i.length;
                }
            }
        return {
            source: c.join(""),
            tags: g
        };
    }
    function v(b, a) {
        var c = {};
        (function() {
            var g = b.concat(a);
            for (var e = g.length; --e >= 0; ) {
                var h = g[e],
                    f = h[3];
                if (f) for (var i = f.length; --i >= 0; ) c[f.charAt(i)] = h;
            }
        })();
        var d = a.length;
        return function(g, e) {
            e = e || 0;
            var h = [e, "pln"],
                f = "",
                i = 0,
                j = g;
            while (j.length) {
                var o,
                    m = null,
                    k,
                    l = c[j.charAt(0)];
                if (l) {
                    k = j.match(l[1]);
                    m = k[0];
                    o = l[0];
                } else {
                    for (var n = 0; n < d; ++n) {
                        l = a[n];
                        var p = l[2];
                        if (p && !p.test(f)) continue;
                        k = j.match(l[1]);
                        if (k) {
                            m = k[0];
                            o = l[0];
                            break;
                        }
                    }
                    if (!m) {
                        o = "pln";
                        m = j.substring(0, 1);
                    }
                }
                h.push(e + i, o);
                i += m.length;
                j = j.substring(m.length);
                if (o !== "com" && /\S/.test(m)) f = m;
            }
            return h;
        };
    }
    var oa = v(
        [],
        [
            ["pln", /^[^<]+/, null],
            ["dec", /^<!\w[^>]*(?:>|$)/, null],
            ["com", /^<!--[\s\S]*?(?:--\>|$)/, null],
            ["src", /^<\?[\s\S]*?(?:\?>|$)/, null],
            ["src", /^<%[\s\S]*?(?:%>|$)/, null],
            ["src", /^<(script|style|xmp)\b[^>]*>[\s\S]*?<\/\1\b[^>]*>/i, null],
            ["tag", /^<\/?\w[^<>]*>/, null]
        ]
    );
    function pa(b) {
        var a = oa(b);
        for (var c = 0; c < a.length; c += 2)
            if (a[c + 1] === "src") {
                var d, g;
                d = a[c];
                g = c + 2 < a.length ? a[c + 2] : b.length;
                var e = b.substring(d, g),
                    h = e.match(/^(<[^>]*>)([\s\S]*)(<\/[^>]*>)$/);
                if (h)
                    a.splice(
                        c,
                        2,
                        d,
                        "tag",
                        d + h[1].length,
                        "src",
                        d + h[1].length + (h[2] || "").length,
                        "tag"
                    );
            }
        return a;
    }
    var qa = v(
        [
            ["atv", /^\'[^\']*(?:\'|$)/, null, "'"],
            ["atv", /^\"[^\"]*(?:\"|$)/, null, '"'],
            ["pun", /^[<>\/=]+/, null, "<>/="]
        ],
        [
            ["tag", /^[\w:\-]+/, /^</],
            ["atv", /^[\w\-]+/, /^=/],
            ["atn", /^[\w:\-]+/, null],
            ["pln", /^\s+/, null, " \t\r\n"]
        ]
    );
    function ra(b, a) {
        for (var c = 0; c < a.length; c += 2) {
            var d = a[c + 1];
            if (d === "tag") {
                var g, e;
                g = a[c];
                e = c + 2 < a.length ? a[c + 2] : b.length;
                var h = b.substring(g, e),
                    f = qa(h, g);
                u(f, a, c, 2);
                c += f.length - 2;
            }
        }
        return a;
    }
    function r(b) {
        var a = [],
            c = [];
        if (b.tripleQuotedStrings)
            a.push([
                "str",
                /^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/,
                null,
                "'\""
            ]);
        else if (b.multiLineStrings)
            a.push([
                "str",
                /^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/,
                null,
                "'\"`"
            ]);
        else
            a.push([
                "str",
                /^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/,
                null,
                "\"'"
            ]);
        c.push(["pln", /^(?:[^\'\"\`\/\#]+)/, null, " \r\n"]);
        if (b.hashComments) a.push(["com", /^#[^\r\n]*/, null, "#"]);
        if (b.cStyleComments) c.push(["com", /^\/\/[^\r\n]*/, null]);
        if (b.regexLiterals)
            c.push([
                "str",
                /^\/(?:[^\\\*\/\[]|\\[\s\S]|\[(?:[^\]\\]|\\.)*(?:\]|$))+(?:\/|$)/,
                Y
            ]);
        if (b.cStyleComments) c.push(["com", /^\/\*[\s\S]*?(?:\*\/|$)/, null]);
        var d = x(b.keywords);
        b = null;
        var g = v(a, c),
            e = v(
                [],
                [
                    ["pln", /^\s+/, null, " \r\n"],
                    ["pln", /^[a-z_$@][a-z_$@0-9]*/i, null],
                    ["lit", /^0x[a-f0-9]+[a-z]/i, null],
                    [
                        "lit",
                        /^(?:\d(?:_\d+)*\d*(?:\.\d*)?|\.\d+)(?:e[+\-]?\d+)?[a-z]*/i,
                        null,
                        "123456789"
                    ],
                    ["pun", /^[^\s\w\.$@]+/, null]
                ]
            );
        function h(f, i) {
            for (var j = 0; j < i.length; j += 2) {
                var o = i[j + 1];
                if (o === "pln") {
                    var m, k, l, n;
                    m = i[j];
                    k = j + 2 < i.length ? i[j + 2] : f.length;
                    l = f.substring(m, k);
                    n = e(l, m);
                    for (var p = 0, t = n.length; p < t; p += 2) {
                        var w = n[p + 1];
                        if (w === "pln") {
                            var A = n[p],
                                B = p + 2 < t ? n[p + 2] : l.length,
                                s = f.substring(A, B);
                            if (s === ".") n[p + 1] = "pun";
                            else if (s in d) n[p + 1] = "kwd";
                            else if (/^@?[A-Z][A-Z$]*[a-z][A-Za-z$]*$/.test(s))
                                n[p + 1] = s.charAt(0) === "@" ? "lit" : "typ";
                        }
                    }
                    u(n, i, j, 2);
                    j += n.length - 2;
                }
            }
            return i;
        }
        return function(f) {
            var i = g(f);
            i = h(f, i);
            return i;
        };
    }
    var G = r({
        keywords: W,
        hashComments: true,
        cStyleComments: true,
        multiLineStrings: true,
        regexLiterals: true
    });
    function sa(b, a) {
        for (var c = 0; c < a.length; c += 2) {
            var d = a[c + 1];
            if (d === "src") {
                var g, e;
                g = a[c];
                e = c + 2 < a.length ? a[c + 2] : b.length;
                var h = G(b.substring(g, e));
                for (var f = 0, i = h.length; f < i; f += 2) h[f] += g;
                u(h, a, c, 2);
                c += h.length - 2;
            }
        }
        return a;
    }
    function ta(b, a) {
        var c = false;
        for (var d = 0; d < a.length; d += 2) {
            var g = a[d + 1],
                e,
                h;
            if (g === "atn") {
                e = a[d];
                h = d + 2 < a.length ? a[d + 2] : b.length;
                c = /^on|^style$/i.test(b.substring(e, h));
            } else if (g === "atv") {
                if (c) {
                    e = a[d];
                    h = d + 2 < a.length ? a[d + 2] : b.length;
                    var f = b.substring(e, h),
                        i = f.length,
                        j =
                            i >= 2 &&
                            /^[\"\']/.test(f) &&
                            f.charAt(0) === f.charAt(i - 1),
                        o,
                        m,
                        k;
                    if (j) {
                        m = e + 1;
                        k = h - 1;
                        o = f;
                    } else {
                        m = e + 1;
                        k = h - 1;
                        o = f.substring(1, f.length - 1);
                    }
                    var l = G(o);
                    for (var n = 0, p = l.length; n < p; n += 2) l[n] += m;
                    if (j) {
                        l.push(k, "atv");
                        u(l, a, d + 2, 0);
                    } else u(l, a, d, 2);
                }
                c = false;
            }
        }
        return a;
    }
    function ua(b) {
        var a = pa(b);
        a = ra(b, a);
        a = sa(b, a);
        a = ta(b, a);
        return a;
    }
    function va(b, a, c) {
        var d = [],
            g = 0,
            e = null,
            h = null,
            f = 0,
            i = 0,
            j = ia(8);
        function o(k) {
            if (k > g) {
                if (e && e !== h) {
                    d.push("</span>");
                    e = null;
                }
                if (!e && h) {
                    e = h;
                    d.push('<span class="', e, '">');
                }
                var l = E(j(b.substring(g, k)))
                    .replace(/(\r\n?|\n| ) /g, "$1&nbsp;")
                    .replace(/\r\n?|\n/g, "<br />");
                d.push(l);
                g = k;
            }
        }
        while (true) {
            var m;
            m = f < a.length ? (i < c.length ? a[f] <= c[i] : true) : false;
            if (m) {
                o(a[f]);
                if (e) {
                    d.push("</span>");
                    e = null;
                }
                d.push(a[f + 1]);
                f += 2;
            } else if (i < c.length) {
                o(c[i]);
                h = c[i + 1];
                i += 2;
            } else break;
        }
        o(b.length);
        if (e) d.push("</span>");
        return d.join("");
    }
    var C = {};
    function q(b, a) {
        for (var c = a.length; --c >= 0; ) {
            var d = a[c];
            if (!C.hasOwnProperty(d)) C[d] = b;
            else if ("console" in window)
                console.log("cannot override language handler %s", d);
        }
    }
    q(G, ["default-code"]);
    q(ua, ["default-markup", "html", "htm", "xhtml", "xml", "xsl"]);
    q(
        r({
            keywords: I,
            hashComments: true,
            cStyleComments: true
        }),
        ["c", "cc", "cpp", "cs", "cxx", "cyc"]
    );
    q(
        r({
            keywords: J,
            cStyleComments: true
        }),
        ["java"]
    );
    q(
        r({
            keywords: O,
            hashComments: true,
            multiLineStrings: true
        }),
        ["bsh", "csh", "sh"]
    );
    q(
        r({
            keywords: M,
            hashComments: true,
            multiLineStrings: true,
            tripleQuotedStrings: true
        }),
        ["cv", "py"]
    );
    q(
        r({
            keywords: L,
            hashComments: true,
            multiLineStrings: true,
            regexLiterals: true
        }),
        ["perl", "pl", "pm"]
    );
    q(
        r({
            keywords: N,
            hashComments: true,
            multiLineStrings: true,
            regexLiterals: true
        }),
        ["rb"]
    );
    q(
        r({
            keywords: K,
            cStyleComments: true,
            regexLiterals: true
        }),
        ["js"]
    );
    function T(b, a) {
        try {
            var c = na(b),
                d = c.source,
                g = c.tags;
            if (!C.hasOwnProperty(a))
                a = /^\s*</.test(d) ? "default-markup" : "default-code";
            var e = C[a].call({}, d);
            return va(d, g, e);
        } catch (h) {
            if ("console" in window) {
                console.log(h);
                console.trace();
            }
            return b;
        }
    }
    function wa(b) {
        var a = H(),
            c = [
                document.getElementsByTagName("pre"),
                document.getElementsByTagName("code"),
                document.getElementsByTagName("li"),
                document.getElementsByTagName("xmp")
            ],
            d = [];
        for (var g = 0; g < c.length; ++g)
            for (var e = 0; e < c[g].length; ++e) d.push(c[g][e]);
        c = null;
        var h = 0;
        function f() {
            var i = new Date().getTime() + 250;
            for (; h < d.length && new Date().getTime() < i; h++) {
                var j = d[h];
                if (j.className && j.className.indexOf("prettyprint") >= 0) {
                    var o = j.className.match(/\blang-(\w+)\b/);
                    if (o) o = o[1];
                    var m = false;
                    for (var k = j.parentNode; k; k = k.parentNode)
                        if (
                            (k.tagName === "pre" ||
                                k.tagName === "code" ||
                                k.tagName === "xmp") &&
                            k.className &&
                            k.className.indexOf("prettyprint") >= 0
                        ) {
                            m = true;
                            break;
                        }
                    if (!m) {
                        var l = ha(j);
                        l = l.replace(/(?:\r\n?|\n)$/, "");
                        var n = T(l, o);
                        if (!S(j)) j.innerHTML = n;
                        else {
                            var p = document.createElement("PRE");
                            for (var t = 0; t < j.attributes.length; ++t) {
                                var w = j.attributes[t];
                                if (w.specified)
                                    p.setAttribute(w.name, w.value);
                            }
                            p.innerHTML = n;
                            j.parentNode.replaceChild(p, j);
                            p = j;
                        }
                        if (a && j.tagName === "PRE") {
                            var A = j.getElementsByTagName("br");
                            for (var B = A.length; --B >= 0; ) {
                                var s = A[B];
                                s.parentNode.replaceChild(
                                    document.createTextNode("\r\n"),
                                    s
                                );
                            }
                        }
                    }
                }
            }
            if (h < d.length) setTimeout(f, 250);
            else if (b) b();
        }
        f();
    }
    window.PR_normalizedHtml = z;
    window.prettyPrintOne = T;
    window.prettyPrint = wa;
    window.PR = {
        createSimpleLexer: v,
        registerLangHandler: q,
        sourceDecorator: r,
        PR_ATTRIB_NAME: "atn",
        PR_ATTRIB_VALUE: "atv",
        PR_COMMENT: "com",
        PR_DECLARATION: "dec",
        PR_KEYWORD: "kwd",
        PR_LITERAL: "lit",
        PR_PLAIN: "pln",
        PR_PUNCTUATION: "pun",
        PR_SOURCE: "src",
        PR_STRING: "str",
        PR_TAG: "tag",
        PR_TYPE: "typ"
    };
})();


/***/ }),

/***/ 79661:
/*!**********************************************!*\
  !*** ./runestone/parsons/js/timedparsons.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimedParsons)
/* harmony export */ });
/* harmony import */ var _parsons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parsons */ 35718);


class TimedParsons extends _parsons__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        // todo -- make this configurable
        if (opts.timedfeedback) {
            this.showfeedback = true;
        } else {
            this.showfeedback = false;
        }
        this.grader.showfeedback = this.showfeedback;
        this.hideFeedback();
        $(this.checkButton).hide();
        $(this.helpButton).hide();
        $(this.resetButton).hide();
    }
    checkCorrectTimed() {
        return this.correct ? "T" : "F";
    }
    hideFeedback() {
        $(this.messageDiv).hide();
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory["parsons"] = function (opts) {
    if (opts.timed) {
        return new TimedParsons(opts);
    }
    return new _parsons__WEBPACK_IMPORTED_MODULE_0__["default"](opts);
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3BhcnNvbnNfanNfdGltZWRwYXJzb25zX2pzLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQTJDO0FBQzZCOztBQUV4RTtBQUNBLGtCQUFrQixnREFBTztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixpQkFBaUI7QUFDbkM7QUFDQTtBQUNBLGtCQUFrQiw2QkFBNkI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFZSx3QkFBd0IsbURBQWU7QUFDdEQ7QUFDQTs7QUFFQTtBQUNBLGlFQUFpRTs7QUFFakU7O0FBRUE7QUFDQSxrQ0FBa0MsZ0RBQU87QUFDekM7QUFDQTtBQUNBLDBCQUEwQixvREFBTztBQUNqQztBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQiwwQ0FBMEM7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBc0Isd0JBQXdCO0FBQzlDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBc0IsMEJBQTBCO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQixlQUFlO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTLG1FQUFzQjtBQUMvQiwrRUFBK0U7QUFDL0U7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixlQUFlO0FBQ25DO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUix3QkFBd0IseUJBQXlCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuSmE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPLHNCQUFzQixnQkFBZ0I7QUFDN0M7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDs7QUFFQSxzQkFBc0I7QUFDdEI7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBLHFCQUFxQjtBQUNyQiwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDJCQUEyQjtBQUMzQiwwQkFBMEI7O0FBRTFCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZUFBZTtBQUN2QztBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGVBQWU7QUFDdkM7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDM0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7Ozs7O0FDbkNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25DRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDYTs7QUFFZ0Q7QUFDL0I7QUFDRztBQUNWO0FBQ0s7QUFDQztBQUNjO0FBQ1A7QUFDSTtBQUNFOztBQUUxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFTyxrQkFBa0I7QUFDVixzQkFBc0IsbUVBQWE7QUFDbEQ7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQSwyQkFBMkI7QUFDM0I7O0FBRUEsMkJBQTJCLDBCQUEwQjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGtEQUFTO0FBQ3pCLGdCQUFnQixtREFBZTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsa0JBQWtCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix1QkFBdUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkLHVEQUF1RCxHQUFHO0FBQzFEO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4QztBQUNBO0FBQ0EsbURBQW1EO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHdCQUF3QjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHFCQUFxQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsd0JBQXdCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBLGNBQWM7QUFDZDtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLG1CQUFtQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtC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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsMEJBQTBCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnQ0FBZ0M7QUFDeEQ7QUFDQSw0QkFBNEIsd0JBQXdCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixVQUFVO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFz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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixjQUFjO0FBQ3RDLDRCQUE0QixpQkFBaUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsMENBQTBDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsR0FBRztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDLHlCQUF5QjtBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRCxVQUFVO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2h4QitCOztBQUVqQiwyQkFBMkIsZ0RBQU87QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGdEQUFPO0FBQ3RCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2Nzcy9wYXJzb25zLmNzcz9mOGJjIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcGFyc29ucy9jc3MvcHJldHRpZnkuY3NzPzBlNWMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL2RhZ0dyYWRlci5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvZGFnSGVscGVycy5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvaGFtbWVyLm1pbi5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvbGluZUdyYWRlci5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvcGFyc29ucy1pMThuLmVuLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcGFyc29ucy9qcy9wYXJzb25zLWkxOG4ucHQtYnIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL3BhcnNvbnMuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL3BhcnNvbnNCbG9jay5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvcGFyc29uc0xpbmUuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL3ByZXR0aWZ5LmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcGFyc29ucy9qcy90aW1lZHBhcnNvbnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiaW1wb3J0IExpbmVCYXNlZEdyYWRlciBmcm9tIFwiLi9saW5lR3JhZGVyXCI7XG5pbXBvcnQgeyBEaUdyYXBoLCBoYXNQYXRoLCBpc0RpcmVjdGVkQWN5Y2xpY0dyYXBoIH0gZnJvbSBcIi4vZGFnSGVscGVyc1wiO1xuXG5mdW5jdGlvbiBncmFwaFRvTlgoYW5zd2VyTGluZXMpIHtcbiAgdmFyIGdyYXBoID0gbmV3IERpR3JhcGgoKTtcbiAgZm9yIChsZXQgbGluZTEgb2YgYW5zd2VyTGluZXMpIHtcbiAgICBncmFwaC5hZGROb2RlKGxpbmUxLnRhZyk7XG4gICAgZm9yIChsZXQgbGluZTJ0YWcgb2YgbGluZTEuZGVwZW5kcykge1xuICAgICAgLy8gdGhlIGRlcGVuZHMgZ3JhcGggbGlzdHMgdGhlICppbmNvbWluZyogZWRnZXMgb2YgYSBub2RlXG4gICAgICBncmFwaC5hZGRFZGdlKGxpbmUydGFnLCBsaW5lMS50YWcpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZ3JhcGg7XG59XG5cbmZ1bmN0aW9uIGlzVmVydGV4Q292ZXIoZ3JhcGgsIHZlcnRleENvdmVyKSB7XG4gIGZvciAobGV0IGVkZ2Ugb2YgZ3JhcGguZWRnZXMoKSkge1xuICAgIGlmICghKHZlcnRleENvdmVyLmhhcyhlZGdlWzBdKSB8fCB2ZXJ0ZXhDb3Zlci5oYXMoZWRnZVsxXSkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBGaW5kIGFsbCBzdWJzZXRzIG9mIHRoZSBzZXQgdXNpbmcgdGhlIGNvcnJlc3BvbmRlbmNlIG9mIHN1YnNldHMgb2Zcbi8vIGEgc2V0IHRvIGJpbmFyeSBzdHJpbmcgd2hvc2UgbGVuZ3RoIGFyZSB0aGUgc2l6ZSBvZiB0aGUgc2V0XG5mdW5jdGlvbiBhbGxTdWJzZXRzKGFycikge1xuICBsZXQgc3Vic2V0cyA9IHt9O1xuICBmb3IgKGxldCBpID0gMDsgaSA8PSBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICBzdWJzZXRzW2ldID0gW107XG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLnBvdygyLCBhcnIubGVuZ3RoKTsgaSsrKSB7XG4gICAgbGV0IGJpbiA9IGkudG9TdHJpbmcoMik7XG4gICAgd2hpbGUgKGJpbi5sZW5ndGggPCBhcnIubGVuZ3RoKSB7XG4gICAgICBiaW4gPSBcIjBcIiArIGJpbjtcbiAgICB9XG4gICAgbGV0IHN1YnNldCA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJpbi5sZW5ndGg7IGorKykge1xuICAgICAgaWYgKGJpbltqXSA9PSBcIjFcIikge1xuICAgICAgICBzdWJzZXQuYWRkKGFycltqXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHN1YnNldHNbc3Vic2V0LnNpemVdLnB1c2goc3Vic2V0KTtcbiAgfVxuICByZXR1cm4gc3Vic2V0cztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgREFHR3JhZGVyIGV4dGVuZHMgTGluZUJhc2VkR3JhZGVyIHtcbiAgaW52ZXJzZUxJU0luZGljZXMoYXJyLCBpblNvbHV0aW9uKSB7XG4gICAgLy8gRm9yIG1vcmUgZGV0YWlscyBhbmQgYSBwcm9vZiBvZiB0aGUgY29ycmVjdG5lc3Mgb2YgdGhlIGFsZ29yaXRobSwgc2VlIHRoZSBwYXBlcjogaHR0cHM6Ly9hcnhpdi5vcmcvYWJzLzIyMDQuMDQxOTZcblxuICAgIHZhciBzb2x1dGlvbiA9IHRoaXMucHJvYmxlbS5zb2x1dGlvbjtcbiAgICB2YXIgYW5zd2VyTGluZXMgPSBpblNvbHV0aW9uLm1hcCgoYmxvY2spID0+IGJsb2NrLmxpbmVzWzBdKTsgLy8gYXNzdW1lIE5PVCBhZGFwdGl2ZSBmb3IgREFHIGdyYWRpbmcgKGZvciBub3cpXG5cbiAgICBsZXQgZ3JhcGggPSBncmFwaFRvTlgoc29sdXRpb24pO1xuXG4gICAgbGV0IHNlZW4gPSBuZXcgU2V0KCk7XG4gICAgbGV0IHByb2JsZW1hdGljU3ViZ3JhcGggPSBuZXcgRGlHcmFwaCgpO1xuICAgIGZvciAobGV0IGxpbmUxIG9mIGFuc3dlckxpbmVzKSB7XG4gICAgICBmb3IgKGxldCBsaW5lMiBvZiBzZWVuKSB7XG4gICAgICAgIGxldCBwcm9ibGVtYXRpYyA9IGhhc1BhdGgoZ3JhcGgsIHtcbiAgICAgICAgICBzb3VyY2U6IGxpbmUxLnRhZyxcbiAgICAgICAgICB0YXJnZXQ6IGxpbmUyLnRhZyxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChwcm9ibGVtYXRpYykge1xuICAgICAgICAgIHByb2JsZW1hdGljU3ViZ3JhcGguYWRkRWRnZShsaW5lMS50YWcsIGxpbmUyLnRhZyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc2Vlbi5hZGQobGluZTEpO1xuICAgIH1cblxuICAgIGxldCBtdmMgPSBudWxsO1xuICAgIGxldCBzdWJzZXRzID0gYWxsU3Vic2V0cyhwcm9ibGVtYXRpY1N1YmdyYXBoLm5vZGVzKCkpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHByb2JsZW1hdGljU3ViZ3JhcGgubnVtYmVyT2ZOb2RlcygpOyBpKyspIHtcbiAgICAgIGZvciAobGV0IHN1YnNldCBvZiBzdWJzZXRzW2ldKSB7XG4gICAgICAgIGlmIChpc1ZlcnRleENvdmVyKHByb2JsZW1hdGljU3ViZ3JhcGgsIHN1YnNldCkpIHtcbiAgICAgICAgICBtdmMgPSBzdWJzZXQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtdmMgIT0gbnVsbCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgaW5kaWNlcyA9IFsuLi5tdmNdLm1hcCgodGFnKSA9PiB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFuc3dlckxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhbnN3ZXJMaW5lc1tpXS50YWcgPT09IHRhZykgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGluZGljZXM7XG4gIH1cblxuICBjaGVja0NvcnJlY3RJbmRlbnRhdGlvbihzb2x1dGlvbkxpbmVzLCBhbnN3ZXJMaW5lcykge1xuICAgICAgdGhpcy5pbmRlbnRMZWZ0ID0gW107XG4gICAgICB0aGlzLmluZGVudFJpZ2h0ID0gW107XG5cbiAgICAgIGxldCBpbmRlbnRhdGlvbkJ5VGFnID0ge307XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNvbHV0aW9uTGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgbGluZSA9IHNvbHV0aW9uTGluZXNbaV07XG4gICAgICAgIGluZGVudGF0aW9uQnlUYWdbbGluZS50YWddID0gbGluZS5pbmRlbnQ7XG4gICAgICB9XG5cbiAgICAgIGxldCBsb29wTGltaXQgPSBNYXRoLm1pbihzb2x1dGlvbkxpbmVzLmxlbmd0aCwgYW5zd2VyTGluZXMubGVuZ3RoKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbG9vcExpbWl0OyBpKyspIHtcbiAgICAgICAgICBsZXQgc29sdXRpb25JbmRlbnQgPSBpbmRlbnRhdGlvbkJ5VGFnW2Fuc3dlckxpbmVzW2ldLnRhZ107XG4gICAgICAgICAgaWYgKGFuc3dlckxpbmVzW2ldLnZpZXdJbmRlbnQoKSA8IHNvbHV0aW9uSW5kZW50KSB7XG4gICAgICAgICAgICAgIHRoaXMuaW5kZW50UmlnaHQucHVzaChhbnN3ZXJMaW5lc1tpXSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChhbnN3ZXJMaW5lc1tpXS52aWV3SW5kZW50KCkgPiBzb2x1dGlvbkluZGVudCkge1xuICAgICAgICAgICAgICB0aGlzLmluZGVudExlZnQucHVzaChhbnN3ZXJMaW5lc1tpXSk7XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5pbmNvcnJlY3RJbmRlbnRzID1cbiAgICAgICAgICB0aGlzLmluZGVudExlZnQubGVuZ3RoICsgdGhpcy5pbmRlbnRSaWdodC5sZW5ndGg7XG5cbiAgICAgIHJldHVybiB0aGlzLmluY29ycmVjdEluZGVudHMgPT0gMDtcbiAgfVxuXG4gIGNoZWNrQ29ycmVjdE9yZGVyaW5nKHNvbHV0aW9uTGluZXMsIGFuc3dlckxpbmVzKSB7XG4gICAgaWYgKCFpc0RpcmVjdGVkQWN5Y2xpY0dyYXBoKGdyYXBoVG9OWChzb2x1dGlvbkxpbmVzKSkpIHtcbiAgICAgIHRocm93IFwiRGVwZW5kZW5jeSBiZXR3ZWVuIGJsb2NrcyBkb2VzIG5vdCBmb3JtIGEgRGlyZWN0ZWQgQWN5Y2xpYyBHcmFwaDsgUHJvYmxlbSB1bnNvbHZhYmxlLlwiO1xuICAgIH1cblxuICAgIGxldCBzZWVuID0gbmV3IFNldCgpO1xuICAgIGxldCBpc0NvcnJlY3RPcmRlciA9IHRydWU7XG4gICAgdGhpcy5jb3JyZWN0TGluZXMgPSAwO1xuICAgIHRoaXMuc29sdXRpb25MZW5ndGggPSBzb2x1dGlvbkxpbmVzLmxlbmd0aDtcbiAgICBsZXQgbG9vcExpbWl0ID0gTWF0aC5taW4oc29sdXRpb25MaW5lcy5sZW5ndGgsIGFuc3dlckxpbmVzLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb29wTGltaXQ7IGkrKykge1xuICAgICAgbGV0IGxpbmUgPSBhbnN3ZXJMaW5lc1tpXTtcbiAgICAgIGlmIChsaW5lLmRpc3RyYWN0b3IpIHtcbiAgICAgICAgaXNDb3JyZWN0T3JkZXIgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbGluZS5kZXBlbmRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgaWYgKCFzZWVuLmhhcyhsaW5lLmRlcGVuZHNbal0pKSB7XG4gICAgICAgICAgICBpc0NvcnJlY3RPcmRlciA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGlzQ29ycmVjdE9yZGVyKSB7XG4gICAgICAgIHRoaXMuY29ycmVjdExpbmVzICs9IDE7XG4gICAgICB9XG4gICAgICBzZWVuLmFkZChsaW5lLnRhZyk7XG4gICAgfVxuICAgIHJldHVybiBpc0NvcnJlY3RPcmRlcjtcbiAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIFRoaXMgZmlsZSBhZGFwdGVkIGZyb20gSlNOZXR3b3JrWDogaHR0cHM6Ly9naXRodWIuY29tL2ZrbGluZy9KU05ldHdvcmtYXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTIgRmVsaXggS2xpbmcgPGZlbGl4LmtsaW5nQGdteC5uZXQ+XG4gKiBKU05ldHdvcmtYIGlzIGRpc3RyaWJ1dGVkIHdpdGggdGhlIEJTRCBsaWNlbnNlXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc1BhdGgoRywgeyBzb3VyY2UsIHRhcmdldCB9KSB7XG4gIHRyeSB7XG4gICAgYmlkaXJlY3Rpb25hbFNob3J0ZXN0UGF0aChHLCBzb3VyY2UsIHRhcmdldCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgSlNOZXR3b3JrWE5vUGF0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gbm9kZXNBcmVFcXVhbChhLCBiKSB7XG4gIHJldHVybiBhID09PSBiIHx8ICh0eXBlb2YgYSA9PT0gXCJvYmplY3RcIiAmJiBhLnRvU3RyaW5nKCkgPT09IGIudG9TdHJpbmcoKSk7XG59XG5cbmZ1bmN0aW9uIGJpZGlyZWN0aW9uYWxTaG9ydGVzdFBhdGgoRywgc291cmNlLCB0YXJnZXQpIHtcbiAgLy8gY2FsbCBoZWxwZXIgdG8gZG8gdGhlIHJlYWwgd29ya1xuICB2YXIgW3ByZWQsIHN1Y2MsIHddID0gYmlkaXJlY3Rpb25hbFByZWRTdWNjKEcsIHNvdXJjZSwgdGFyZ2V0KTtcblxuICAvLyBidWlsZCBwYXRoIGZyb20gcHJlZCt3K3N1Y2NcbiAgdmFyIHBhdGggPSBbXTtcbiAgLy8gZnJvbSBzb3VyY2UgdG8gd1xuICB3aGlsZSAodyAhPSBudWxsKSB7XG4gICAgcGF0aC5wdXNoKHcpO1xuICAgIHcgPSBwcmVkLmdldCh3KTtcbiAgfVxuICB3ID0gc3VjYy5nZXQocGF0aFswXSk7XG4gIHBhdGgucmV2ZXJzZSgpO1xuICAvLyBmcm9tIHcgdG8gdGFyZ2V0XG4gIHdoaWxlICh3ICE9IG51bGwpIHtcbiAgICBwYXRoLnB1c2godyk7XG4gICAgdyA9IHN1Y2MuZ2V0KHcpO1xuICB9XG4gIHJldHVybiBwYXRoO1xufVxuXG5mdW5jdGlvbiBiaWRpcmVjdGlvbmFsUHJlZFN1Y2MoRywgc291cmNlLCB0YXJnZXQpIHtcbiAgLy8gZG9lcyBCRlMgZnJvbSBib3RoIHNvdXJjZSBhbmQgdGFyZ2V0IGFuZCBtZWV0cyBpbiB0aGUgbWlkZGxlXG4gIGlmIChub2Rlc0FyZUVxdWFsKHNvdXJjZSwgdGFyZ2V0KSkge1xuICAgIHJldHVybiBbbmV3IE1hcChbW3NvdXJjZSwgbnVsbF1dKSwgbmV3IE1hcChbW3RhcmdldCwgbnVsbF1dKSwgc291cmNlXTtcbiAgfVxuXG4gIC8vIGhhbmRsZSBlaXRoZXIgZGlyZWN0ZWQgb3IgdW5kaXJlY3RlZFxuICB2YXIgZ3ByZWQsIGdzdWNjO1xuICBncHJlZCA9IEcucHJlZGVjZXNzb3JzSXRlci5iaW5kKEcpO1xuICBnc3VjYyA9IEcuc3VjY2Vzc29yc0l0ZXIuYmluZChHKTtcblxuICAvLyBwcmVkZWNlc3Nzb3IgYW5kIHN1Y2Nlc3NvcnMgaW4gc2VhcmNoXG4gIHZhciBwcmVkID0gbmV3IE1hcChbW3NvdXJjZSwgbnVsbF1dKTtcbiAgdmFyIHN1Y2MgPSBuZXcgTWFwKFtbdGFyZ2V0LCBudWxsXV0pO1xuICAvL1xuICAvLyBpbml0aWFsaXplIGZyaW5nZXMsIHN0YXJ0IHdpdGggZm9yd2FyZFxuICB2YXIgZm9yd2FyZEZyaW5nZSA9IFtzb3VyY2VdO1xuICB2YXIgcmV2ZXJzZUZyaW5nZSA9IFt0YXJnZXRdO1xuICB2YXIgdGhpc0xldmVsO1xuXG4gIC8qanNoaW50IG5ld2NhcDpmYWxzZSovXG4gIHdoaWxlIChmb3J3YXJkRnJpbmdlLmxlbmd0aCA+IDAgJiYgcmV2ZXJzZUZyaW5nZS5sZW5ndGggPiAwKSB7XG4gICAgaWYgKGZvcndhcmRGcmluZ2UubGVuZ3RoIDw9IHJldmVyc2VGcmluZ2UubGVuZ3RoKSB7XG4gICAgICB0aGlzTGV2ZWwgPSBmb3J3YXJkRnJpbmdlO1xuICAgICAgZm9yd2FyZEZyaW5nZSA9IFtdO1xuICAgICAgZm9yIChsZXQgdiBvZiB0aGlzTGV2ZWwpIHtcbiAgICAgICAgZm9yIChsZXQgdyBvZiBnc3VjYyh2KSkge1xuICAgICAgICAgIGlmICghcHJlZC5oYXModykpIHtcbiAgICAgICAgICAgIGZvcndhcmRGcmluZ2UucHVzaCh3KTtcbiAgICAgICAgICAgIHByZWQuc2V0KHcsIHYpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc3VjYy5oYXModykpIHtcbiAgICAgICAgICAgIHJldHVybiBbcHJlZCwgc3VjYywgd107IC8vIGZvdW5kIHBhdGhcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpc0xldmVsID0gcmV2ZXJzZUZyaW5nZTtcbiAgICAgIHJldmVyc2VGcmluZ2UgPSBbXTtcbiAgICAgIGZvciAobGV0IHYgb2YgdGhpc0xldmVsKSB7XG4gICAgICAgIGZvciAobGV0IHcgb2YgZ3ByZWQodikpIHtcbiAgICAgICAgICBpZiAoIXN1Y2MuaGFzKHcpKSB7XG4gICAgICAgICAgICByZXZlcnNlRnJpbmdlLnB1c2godyk7XG4gICAgICAgICAgICBzdWNjLnNldCh3LCB2KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHByZWQuaGFzKHcpKSB7XG4gICAgICAgICAgICByZXR1cm4gW3ByZWQsIHN1Y2MsIHddOyAvLyBmb3VuZCBwYXRoXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHRocm93IG5ldyBKU05ldHdvcmtYTm9QYXRoKFxuICAgIFwiTm8gcGF0aCBiZXR3ZWVuIFwiICsgc291cmNlLnRvU3RyaW5nKCkgKyBcIiBhbmQgXCIgKyB0YXJnZXQudG9TdHJpbmcoKSArIFwiLlwiXG4gICk7XG59XG5cbmZ1bmN0aW9uIHRvcG9sb2dpY2FsU29ydChHLCBvcHROYnVuY2gpIHtcbiAgLy8gbm9ucmVjdXJzaXZlIHZlcnNpb25cbiAgdmFyIHNlZW4gPSBuZXcgU2V0KCk7XG4gIHZhciBvcmRlckV4cGxvcmVkID0gW107IC8vIHByb3ZpZGUgb3JkZXIgYW5kXG4gIC8vIGZhc3Qgc2VhcmNoIHdpdGhvdXQgbW9yZSBnZW5lcmFsIHByaW9yaXR5RGljdGlvbmFyeVxuICB2YXIgZXhwbG9yZWQgPSBuZXcgU2V0KCk7XG5cbiAgaWYgKG9wdE5idW5jaCA9PSBudWxsKSB7XG4gICAgb3B0TmJ1bmNoID0gRy5ub2Rlc0l0ZXIoKTtcbiAgfVxuXG4gIGZvciAobGV0IHYgb2Ygb3B0TmJ1bmNoKSB7XG4gICAgLy8gcHJvY2VzcyBhbGwgdmVydGljZXMgaW4gR1xuICAgIGlmIChleHBsb3JlZC5oYXModikpIHtcbiAgICAgIHJldHVybjsgLy8gY29udGludWVcbiAgICB9XG5cbiAgICB2YXIgZnJpbmdlID0gW3ZdOyAvLyBub2RlcyB5ZXQgdG8gbG9vayBhdFxuICAgIHdoaWxlIChmcmluZ2UubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIHcgPSBmcmluZ2VbZnJpbmdlLmxlbmd0aCAtIDFdOyAvLyBkZXB0aCBmaXJzdCBzZWFyY2hcbiAgICAgIGlmIChleHBsb3JlZC5oYXModykpIHtcbiAgICAgICAgLy8gYWxyZWFkeSBsb29rZWQgZG93biB0aGlzIGJyYW5jaFxuICAgICAgICBmcmluZ2UucG9wKCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgc2Vlbi5hZGQodyk7IC8vIG1hcmsgYXMgc2VlblxuICAgICAgLy8gQ2hlY2sgc3VjY2Vzc29ycyBmb3IgY3ljbGVzIGZvciBuZXcgbm9kZXNcbiAgICAgIHZhciBuZXdOb2RlcyA9IFtdO1xuICAgICAgLyplc2xpbnQtZGlzYWJsZSBuby1sb29wLWZ1bmMqL1xuICAgICAgRy5nZXQodykuZm9yRWFjaChmdW5jdGlvbiAoXywgbikge1xuICAgICAgICBpZiAoIWV4cGxvcmVkLmhhcyhuKSkge1xuICAgICAgICAgIGlmIChzZWVuLmhhcyhuKSkge1xuICAgICAgICAgICAgLy8gQ1lDTEUgISFcbiAgICAgICAgICAgIHRocm93IG5ldyBKU05ldHdvcmtYVW5mZWFzaWJsZShcIkdyYXBoIGNvbnRhaW5zIGEgY3ljbGUuXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBuZXdOb2Rlcy5wdXNoKG4pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8qZXNsaW50LWVuYWJsZSBuby1sb29wLWZ1bmMqL1xuICAgICAgaWYgKG5ld05vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gYWRkIG5ldyBub2RlcyB0byBmcmluZ2VcbiAgICAgICAgZnJpbmdlLnB1c2guYXBwbHkoZnJpbmdlLCBuZXdOb2Rlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBleHBsb3JlZC5hZGQodyk7XG4gICAgICAgIG9yZGVyRXhwbG9yZWQudW5zaGlmdCh3KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gb3JkZXJFeHBsb3JlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGlyZWN0ZWRBY3ljbGljR3JhcGgoRykge1xuICB0cnkge1xuICAgIHRvcG9sb2dpY2FsU29ydChHKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICBpZiAoZXggaW5zdGFuY2VvZiBKU05ldHdvcmtYVW5mZWFzaWJsZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aHJvdyBleDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGlHcmFwaCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZ3JhcGggPSB7fTsgLy8gZGljdGlvbmFyeSBmb3IgZ3JhcGggYXR0cmlidXRlc1xuICAgIHRoaXMubm9kZSA9IG5ldyBNYXAoKTsgLy8gZGljdGlvbmFyeSBmb3Igbm9kZSBhdHRyaWJ1dGVzXG4gICAgLy8gV2Ugc3RvcmUgdHdvIGFkamFjZW5jeSBsaXN0czpcbiAgICAvLyB0aGUgcHJlZGVjZXNzb3JzIG9mIG5vZGUgbiBhcmUgc3RvcmVkIGluIHRoZSBkaWN0IHNlbGYucHJlZFxuICAgIC8vIHRoZSBzdWNjZXNzb3JzIG9mIG5vZGUgbiBhcmUgc3RvcmVkIGluIHRoZSBkaWN0IHNlbGYuc3VjYz1zZWxmLmFkalxuICAgIHRoaXMuYWRqID0gbmV3IE1hcCgpOyAvLyBlbXB0eSBhZGphY2VuY3kgZGljdGlvbmFyeVxuICAgIHRoaXMucHJlZCA9IG5ldyBNYXAoKTsgLy8gcHJlZGVjZXNzb3JcbiAgICB0aGlzLnN1Y2MgPSB0aGlzLmFkajsgLy8gc3VjY2Vzc29yXG5cbiAgICB0aGlzLmVkZ2UgPSB0aGlzLmFkajtcbiAgfVxuXG4gIGFkZE5vZGUobikge1xuICAgIGlmICghdGhpcy5zdWNjLmhhcyhuKSkge1xuICAgICAgdGhpcy5zdWNjLnNldChuLCBuZXcgTWFwKCkpO1xuICAgICAgdGhpcy5wcmVkLnNldChuLCBuZXcgTWFwKCkpO1xuICAgICAgdGhpcy5ub2RlLnNldChuKTtcbiAgICB9XG4gIH1cblxuICBhZGRFZGdlKHUsIHYpIHtcbiAgICAvLyBhZGQgbm9kZXNcbiAgICBpZiAoIXRoaXMuc3VjYy5oYXModSkpIHtcbiAgICAgIHRoaXMuc3VjYy5zZXQodSwgbmV3IE1hcCgpKTtcbiAgICAgIHRoaXMucHJlZC5zZXQodSwgbmV3IE1hcCgpKTtcbiAgICAgIHRoaXMubm9kZS5zZXQodSwge30pO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5zdWNjLmhhcyh2KSkge1xuICAgICAgdGhpcy5zdWNjLnNldCh2LCBuZXcgTWFwKCkpO1xuICAgICAgdGhpcy5wcmVkLnNldCh2LCBuZXcgTWFwKCkpO1xuICAgICAgdGhpcy5ub2RlLnNldCh2LCB7fSk7XG4gICAgfVxuXG4gICAgLy8gYWRkIHRoZSBlZGdlXG4gICAgdmFyIGRhdGFkaWN0ID0gdGhpcy5hZGouZ2V0KHUpLmdldCh2KSB8fCB7fTtcbiAgICB0aGlzLnN1Y2MuZ2V0KHUpLnNldCh2LCBkYXRhZGljdCk7XG4gICAgdGhpcy5wcmVkLmdldCh2KS5zZXQodSwgZGF0YWRpY3QpO1xuICB9XG5cbiAgbm9kZXMob3B0RGF0YSA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20ob3B0RGF0YSA/IHRoaXMubm9kZS5lbnRyaWVzKCkgOiB0aGlzLm5vZGUua2V5cygpKTtcbiAgfVxuXG4gIGVkZ2VzKG9wdE5idW5jaCwgb3B0RGF0YSA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5lZGdlc0l0ZXIob3B0TmJ1bmNoLCBvcHREYXRhKSk7XG4gIH1cblxuICBub2Rlc0l0ZXIob3B0RGF0YSA9IGZhbHNlKSB7XG4gICAgaWYgKG9wdERhdGEpIHtcbiAgICAgIHJldHVybiB0b0l0ZXJhdG9yKHRoaXMubm9kZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm5vZGUua2V5cygpO1xuICB9XG5cbiAgZ2V0KG4pIHtcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmFkai5nZXQobik7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhyb3cgbmV3IEtleUVycm9yKFwiR3JhcGggZG9lcyBub3QgY29udGFpbiBub2RlIFwiICsgbiArIFwiLlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgbnVtYmVyT2ZOb2RlcygpIHtcbiAgICByZXR1cm4gdGhpcy5ub2RlLnNpemU7XG4gIH1cblxuICAqbmJ1bmNoSXRlcihvcHROYnVuY2gpIHtcbiAgICBpZiAob3B0TmJ1bmNoID09IG51bGwpIHtcbiAgICAgIC8vIGluY2x1ZGUgYWxsIG5vZGVzXG4gICAgICAvKmpzaGludCBleHByOnRydWUqL1xuICAgICAgeWllbGQqIHRoaXMuYWRqLmtleXMoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaGFzTm9kZShvcHROYnVuY2gpKSB7XG4gICAgICAvLyBpZiBuYnVuY2ggaXMgYSBzaW5nbGUgbm9kZVxuICAgICAgeWllbGQgb3B0TmJ1bmNoO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpZiBuYnVuY2ggaXMgYSBzZXF1ZW5jZSBvZiBub2Rlc1xuICAgICAgdmFyIGFkaiA9IHRoaXMuYWRqO1xuXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBuIG9mIHRvSXRlcmF0b3Iob3B0TmJ1bmNoKSkge1xuICAgICAgICAgIGlmIChhZGouaGFzKG4pKSB7XG4gICAgICAgICAgICB5aWVsZCBuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgaWYgKGV4IGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEpTTmV0d29ya1hFcnJvcihcbiAgICAgICAgICAgIFwibmJ1bmNoIGlzIG5vdCBhIG5vZGUgb3IgYSBzZXF1ZW5jZSBvZiBub2Rlc1wiXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gICplZGdlc0l0ZXIob3B0TmJ1bmNoLCBvcHREYXRhID0gZmFsc2UpIHtcbiAgICAvLyBoYW5kbGUgY2FsbHMgd2l0aCBvcHRfZGF0YSBiZWluZyB0aGUgb25seSBhcmd1bWVudFxuICAgIGlmIChpc0Jvb2xlYW4ob3B0TmJ1bmNoKSkge1xuICAgICAgb3B0RGF0YSA9IG9wdE5idW5jaDtcbiAgICAgIG9wdE5idW5jaCA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB2YXIgbm9kZXNOYnJzO1xuXG4gICAgaWYgKG9wdE5idW5jaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBub2Rlc05icnMgPSB0aGlzLmFkajtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZXNOYnJzID0gbWFwSXRlcmF0b3IodGhpcy5uYnVuY2hJdGVyKG9wdE5idW5jaCksIChuKSA9PlxuICAgICAgICB0dXBsZTIobiwgdGhpcy5hZGouZ2V0KG4pKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBub2RlTmJycyBvZiBub2Rlc05icnMpIHtcbiAgICAgIGZvciAodmFyIG5ickRhdGEgb2Ygbm9kZU5icnNbMV0pIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtub2RlTmJyc1swXSwgbmJyRGF0YVswXV07XG4gICAgICAgIGlmIChvcHREYXRhKSB7XG4gICAgICAgICAgcmVzdWx0WzJdID0gbmJyRGF0YVsxXTtcbiAgICAgICAgfVxuICAgICAgICB5aWVsZCByZXN1bHQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV2ZXJzZShvcHRDb3B5ID0gdHJ1ZSkge1xuICAgIHZhciBIO1xuICAgIGlmIChvcHRDb3B5KSB7XG4gICAgICBIID0gbmV3IHRoaXMuY29uc3RydWN0b3IobnVsbCwge1xuICAgICAgICBuYW1lOiBcIlJldmVyc2Ugb2YgKFwiICsgdGhpcy5uYW1lICsgXCIpXCIsXG4gICAgICB9KTtcbiAgICAgIEguYWRkTm9kZXNGcm9tKHRoaXMpO1xuICAgICAgSC5hZGRFZGdlc0Zyb20oXG4gICAgICAgIG1hcEl0ZXJhdG9yKHRoaXMuZWRnZXNJdGVyKG51bGwsIHRydWUpLCAoZWRnZSkgPT5cbiAgICAgICAgICB0dXBsZTNjKGVkZ2VbMV0sIGVkZ2VbMF0sIGRlZXBjb3B5KGVkZ2VbMl0pLCBlZGdlKVxuICAgICAgICApXG4gICAgICApO1xuICAgICAgSC5ncmFwaCA9IGRlZXBjb3B5KHRoaXMuZ3JhcGgpO1xuICAgICAgSC5ub2RlID0gZGVlcGNvcHkodGhpcy5ub2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHRoaXNQcmVkID0gdGhpcy5wcmVkO1xuICAgICAgdmFyIHRoaXNTdWNjID0gdGhpcy5zdWNjO1xuXG4gICAgICB0aGlzLnN1Y2MgPSB0aGlzUHJlZDtcbiAgICAgIHRoaXMucHJlZCA9IHRoaXNTdWNjO1xuICAgICAgdGhpcy5hZGogPSB0aGlzLnN1Y2M7XG4gICAgICBIID0gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIEg7XG4gIH1cblxuICBzdWNjZXNzb3JzSXRlcihuKSB7XG4gICAgdmFyIG5icnMgPSB0aGlzLnN1Y2MuZ2V0KG4pO1xuICAgIGlmIChuYnJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBuYnJzLmtleXMoKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEpTTmV0d29ya1hFcnJvcihcbiAgICAgIHNwcmludGYoJ1RoZSBub2RlIFwiJWpcIiBpcyBub3QgaW4gdGhlIGRpZ3JhcGguJywgbilcbiAgICApO1xuICB9XG5cbiAgcHJlZGVjZXNzb3JzSXRlcihuKSB7XG4gICAgdmFyIG5icnMgPSB0aGlzLnByZWQuZ2V0KG4pO1xuICAgIGlmIChuYnJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBuYnJzLmtleXMoKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEpTTmV0d29ya1hFcnJvcihcbiAgICAgIHNwcmludGYoJ1RoZSBub2RlIFwiJWpcIiBpcyBub3QgaW4gdGhlIGRpZ3JhcGguJywgbilcbiAgICApO1xuICB9XG5cbiAgc3VjY2Vzc29ycyhuKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5zdWNjZXNzb3JzSXRlcihuKSk7XG4gIH1cblxuICBwcmVkZWNlc3NvcnMobikge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMucHJlZGVjZXNzb3JzSXRlcihuKSk7XG4gIH1cbn1cblxuY2xhc3MgSlNOZXR3b3JrWEV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICB0aGlzLm5hbWUgPSBcIkpTTmV0d29ya1hFeGNlcHRpb25cIjtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB9XG59XG5cbmNsYXNzIEpTTmV0d29ya1hBbGdvcml0aG1FcnJvciBleHRlbmRzIEpTTmV0d29ya1hFeGNlcHRpb24ge1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5uYW1lID0gXCJKU05ldHdvcmtYQWxnb3JpdGhtRXJyb3JcIjtcbiAgfVxufVxuXG5jbGFzcyBKU05ldHdvcmtYRXJyb3IgZXh0ZW5kcyBKU05ldHdvcmtYRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIHRoaXMubmFtZSA9IFwiSlNOZXR3b3JrWEVycm9yXCI7XG4gIH1cbn1cblxuY2xhc3MgSlNOZXR3b3JrWFVuZmVhc2libGUgZXh0ZW5kcyBKU05ldHdvcmtYQWxnb3JpdGhtRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5uYW1lID0gXCJKU05ldHdvcmtYVW5mZWFzaWJsZVwiO1xuICB9XG59XG5cbmNsYXNzIEpTTmV0d29ya1hOb1BhdGggZXh0ZW5kcyBKU05ldHdvcmtYVW5mZWFzaWJsZSB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB0aGlzLm5hbWUgPSBcIkpTTmV0d29ya1hOb1BhdGhcIjtcbiAgfVxufVxuXG4vLyBmdW5jdGlvbiBmcm9tIExvRGFzaCwgbmVlZGVkIGJ5IGZ1bmN0aW9ucyBmcm9tIEpTTmV0d29ya1hcbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gXCJvYmplY3RcIjtcbn1cblxuLy8gZnVuY3Rpb24gZnJvbSBMb0Rhc2gsIG5lZWRlZCBieSBmdW5jdGlvbnMgZnJvbSBKU05ldHdvcmtYXG5mdW5jdGlvbiBpc0Jvb2xlYW4odmFsdWUpIHtcbiAgdmFyIGJvb2xUYWcgPSBcIltvYmplY3QgQm9vbGVhbl1cIjtcbiAgcmV0dXJuIChcbiAgICB2YWx1ZSA9PT0gdHJ1ZSB8fFxuICAgIHZhbHVlID09PSBmYWxzZSB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gYm9vbFRhZylcbiAgKTtcbn1cbiIsIi8qISBIYW1tZXIuSlMgLSB2Mi4wLjggLSAyMDE2LTA0LTIzXG4gKiBodHRwOi8vaGFtbWVyanMuZ2l0aHViLmlvL1xuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNiBKb3JpayBUYW5nZWxkZXI7XG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKi9cbiFmdW5jdGlvbihhLGIsYyxkKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBlKGEsYixjKXtyZXR1cm4gc2V0VGltZW91dChqKGEsYyksYil9ZnVuY3Rpb24gZihhLGIsYyl7cmV0dXJuIEFycmF5LmlzQXJyYXkoYSk/KGcoYSxjW2JdLGMpLCEwKTohMX1mdW5jdGlvbiBnKGEsYixjKXt2YXIgZTtpZihhKWlmKGEuZm9yRWFjaClhLmZvckVhY2goYixjKTtlbHNlIGlmKGEubGVuZ3RoIT09ZClmb3IoZT0wO2U8YS5sZW5ndGg7KWIuY2FsbChjLGFbZV0sZSxhKSxlKys7ZWxzZSBmb3IoZSBpbiBhKWEuaGFzT3duUHJvcGVydHkoZSkmJmIuY2FsbChjLGFbZV0sZSxhKX1mdW5jdGlvbiBoKGIsYyxkKXt2YXIgZT1cIkRFUFJFQ0FURUQgTUVUSE9EOiBcIitjK1wiXFxuXCIrZCtcIiBBVCBcXG5cIjtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgYz1uZXcgRXJyb3IoXCJnZXQtc3RhY2stdHJhY2VcIiksZD1jJiZjLnN0YWNrP2Muc3RhY2sucmVwbGFjZSgvXlteXFwoXSs/W1xcbiRdL2dtLFwiXCIpLnJlcGxhY2UoL15cXHMrYXRcXHMrL2dtLFwiXCIpLnJlcGxhY2UoL15PYmplY3QuPGFub255bW91cz5cXHMqXFwoL2dtLFwie2Fub255bW91c30oKUBcIik6XCJVbmtub3duIFN0YWNrIFRyYWNlXCIsZj1hLmNvbnNvbGUmJihhLmNvbnNvbGUud2Fybnx8YS5jb25zb2xlLmxvZyk7cmV0dXJuIGYmJmYuY2FsbChhLmNvbnNvbGUsZSxkKSxiLmFwcGx5KHRoaXMsYXJndW1lbnRzKX19ZnVuY3Rpb24gaShhLGIsYyl7dmFyIGQsZT1iLnByb3RvdHlwZTtkPWEucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSksZC5jb25zdHJ1Y3Rvcj1hLGQuX3N1cGVyPWUsYyYmbGEoZCxjKX1mdW5jdGlvbiBqKGEsYil7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGEuYXBwbHkoYixhcmd1bWVudHMpfX1mdW5jdGlvbiBrKGEsYil7cmV0dXJuIHR5cGVvZiBhPT1vYT9hLmFwcGx5KGI/YlswXXx8ZDpkLGIpOmF9ZnVuY3Rpb24gbChhLGIpe3JldHVybiBhPT09ZD9iOmF9ZnVuY3Rpb24gbShhLGIsYyl7ZyhxKGIpLGZ1bmN0aW9uKGIpe2EuYWRkRXZlbnRMaXN0ZW5lcihiLGMsITEpfSl9ZnVuY3Rpb24gbihhLGIsYyl7ZyhxKGIpLGZ1bmN0aW9uKGIpe2EucmVtb3ZlRXZlbnRMaXN0ZW5lcihiLGMsITEpfSl9ZnVuY3Rpb24gbyhhLGIpe2Zvcig7YTspe2lmKGE9PWIpcmV0dXJuITA7YT1hLnBhcmVudE5vZGV9cmV0dXJuITF9ZnVuY3Rpb24gcChhLGIpe3JldHVybiBhLmluZGV4T2YoYik+LTF9ZnVuY3Rpb24gcShhKXtyZXR1cm4gYS50cmltKCkuc3BsaXQoL1xccysvZyl9ZnVuY3Rpb24gcihhLGIsYyl7aWYoYS5pbmRleE9mJiYhYylyZXR1cm4gYS5pbmRleE9mKGIpO2Zvcih2YXIgZD0wO2Q8YS5sZW5ndGg7KXtpZihjJiZhW2RdW2NdPT1ifHwhYyYmYVtkXT09PWIpcmV0dXJuIGQ7ZCsrfXJldHVybi0xfWZ1bmN0aW9uIHMoYSl7cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGEsMCl9ZnVuY3Rpb24gdChhLGIsYyl7Zm9yKHZhciBkPVtdLGU9W10sZj0wO2Y8YS5sZW5ndGg7KXt2YXIgZz1iP2FbZl1bYl06YVtmXTtyKGUsZyk8MCYmZC5wdXNoKGFbZl0pLGVbZl09ZyxmKyt9cmV0dXJuIGMmJihkPWI/ZC5zb3J0KGZ1bmN0aW9uKGEsYyl7cmV0dXJuIGFbYl0+Y1tiXX0pOmQuc29ydCgpKSxkfWZ1bmN0aW9uIHUoYSxiKXtmb3IodmFyIGMsZSxmPWJbMF0udG9VcHBlckNhc2UoKStiLnNsaWNlKDEpLGc9MDtnPG1hLmxlbmd0aDspe2lmKGM9bWFbZ10sZT1jP2MrZjpiLGUgaW4gYSlyZXR1cm4gZTtnKyt9cmV0dXJuIGR9ZnVuY3Rpb24gdigpe3JldHVybiB1YSsrfWZ1bmN0aW9uIHcoYil7dmFyIGM9Yi5vd25lckRvY3VtZW50fHxiO3JldHVybiBjLmRlZmF1bHRWaWV3fHxjLnBhcmVudFdpbmRvd3x8YX1mdW5jdGlvbiB4KGEsYil7dmFyIGM9dGhpczt0aGlzLm1hbmFnZXI9YSx0aGlzLmNhbGxiYWNrPWIsdGhpcy5lbGVtZW50PWEuZWxlbWVudCx0aGlzLnRhcmdldD1hLm9wdGlvbnMuaW5wdXRUYXJnZXQsdGhpcy5kb21IYW5kbGVyPWZ1bmN0aW9uKGIpe2soYS5vcHRpb25zLmVuYWJsZSxbYV0pJiZjLmhhbmRsZXIoYil9LHRoaXMuaW5pdCgpfWZ1bmN0aW9uIHkoYSl7dmFyIGIsYz1hLm9wdGlvbnMuaW5wdXRDbGFzcztyZXR1cm4gbmV3KGI9Yz9jOnhhP006eWE/UDp3YT9SOkwpKGEseil9ZnVuY3Rpb24geihhLGIsYyl7dmFyIGQ9Yy5wb2ludGVycy5sZW5ndGgsZT1jLmNoYW5nZWRQb2ludGVycy5sZW5ndGgsZj1iJkVhJiZkLWU9PT0wLGc9YiYoR2F8SGEpJiZkLWU9PT0wO2MuaXNGaXJzdD0hIWYsYy5pc0ZpbmFsPSEhZyxmJiYoYS5zZXNzaW9uPXt9KSxjLmV2ZW50VHlwZT1iLEEoYSxjKSxhLmVtaXQoXCJoYW1tZXIuaW5wdXRcIixjKSxhLnJlY29nbml6ZShjKSxhLnNlc3Npb24ucHJldklucHV0PWN9ZnVuY3Rpb24gQShhLGIpe3ZhciBjPWEuc2Vzc2lvbixkPWIucG9pbnRlcnMsZT1kLmxlbmd0aDtjLmZpcnN0SW5wdXR8fChjLmZpcnN0SW5wdXQ9RChiKSksZT4xJiYhYy5maXJzdE11bHRpcGxlP2MuZmlyc3RNdWx0aXBsZT1EKGIpOjE9PT1lJiYoYy5maXJzdE11bHRpcGxlPSExKTt2YXIgZj1jLmZpcnN0SW5wdXQsZz1jLmZpcnN0TXVsdGlwbGUsaD1nP2cuY2VudGVyOmYuY2VudGVyLGk9Yi5jZW50ZXI9RShkKTtiLnRpbWVTdGFtcD1yYSgpLGIuZGVsdGFUaW1lPWIudGltZVN0YW1wLWYudGltZVN0YW1wLGIuYW5nbGU9SShoLGkpLGIuZGlzdGFuY2U9SChoLGkpLEIoYyxiKSxiLm9mZnNldERpcmVjdGlvbj1HKGIuZGVsdGFYLGIuZGVsdGFZKTt2YXIgaj1GKGIuZGVsdGFUaW1lLGIuZGVsdGFYLGIuZGVsdGFZKTtiLm92ZXJhbGxWZWxvY2l0eVg9ai54LGIub3ZlcmFsbFZlbG9jaXR5WT1qLnksYi5vdmVyYWxsVmVsb2NpdHk9cWEoai54KT5xYShqLnkpP2oueDpqLnksYi5zY2FsZT1nP0soZy5wb2ludGVycyxkKToxLGIucm90YXRpb249Zz9KKGcucG9pbnRlcnMsZCk6MCxiLm1heFBvaW50ZXJzPWMucHJldklucHV0P2IucG9pbnRlcnMubGVuZ3RoPmMucHJldklucHV0Lm1heFBvaW50ZXJzP2IucG9pbnRlcnMubGVuZ3RoOmMucHJldklucHV0Lm1heFBvaW50ZXJzOmIucG9pbnRlcnMubGVuZ3RoLEMoYyxiKTt2YXIgaz1hLmVsZW1lbnQ7byhiLnNyY0V2ZW50LnRhcmdldCxrKSYmKGs9Yi5zcmNFdmVudC50YXJnZXQpLGIudGFyZ2V0PWt9ZnVuY3Rpb24gQihhLGIpe3ZhciBjPWIuY2VudGVyLGQ9YS5vZmZzZXREZWx0YXx8e30sZT1hLnByZXZEZWx0YXx8e30sZj1hLnByZXZJbnB1dHx8e307Yi5ldmVudFR5cGUhPT1FYSYmZi5ldmVudFR5cGUhPT1HYXx8KGU9YS5wcmV2RGVsdGE9e3g6Zi5kZWx0YVh8fDAseTpmLmRlbHRhWXx8MH0sZD1hLm9mZnNldERlbHRhPXt4OmMueCx5OmMueX0pLGIuZGVsdGFYPWUueCsoYy54LWQueCksYi5kZWx0YVk9ZS55KyhjLnktZC55KX1mdW5jdGlvbiBDKGEsYil7dmFyIGMsZSxmLGcsaD1hLmxhc3RJbnRlcnZhbHx8YixpPWIudGltZVN0YW1wLWgudGltZVN0YW1wO2lmKGIuZXZlbnRUeXBlIT1IYSYmKGk+RGF8fGgudmVsb2NpdHk9PT1kKSl7dmFyIGo9Yi5kZWx0YVgtaC5kZWx0YVgsaz1iLmRlbHRhWS1oLmRlbHRhWSxsPUYoaSxqLGspO2U9bC54LGY9bC55LGM9cWEobC54KT5xYShsLnkpP2wueDpsLnksZz1HKGosayksYS5sYXN0SW50ZXJ2YWw9Yn1lbHNlIGM9aC52ZWxvY2l0eSxlPWgudmVsb2NpdHlYLGY9aC52ZWxvY2l0eVksZz1oLmRpcmVjdGlvbjtiLnZlbG9jaXR5PWMsYi52ZWxvY2l0eVg9ZSxiLnZlbG9jaXR5WT1mLGIuZGlyZWN0aW9uPWd9ZnVuY3Rpb24gRChhKXtmb3IodmFyIGI9W10sYz0wO2M8YS5wb2ludGVycy5sZW5ndGg7KWJbY109e2NsaWVudFg6cGEoYS5wb2ludGVyc1tjXS5jbGllbnRYKSxjbGllbnRZOnBhKGEucG9pbnRlcnNbY10uY2xpZW50WSl9LGMrKztyZXR1cm57dGltZVN0YW1wOnJhKCkscG9pbnRlcnM6YixjZW50ZXI6RShiKSxkZWx0YVg6YS5kZWx0YVgsZGVsdGFZOmEuZGVsdGFZfX1mdW5jdGlvbiBFKGEpe3ZhciBiPWEubGVuZ3RoO2lmKDE9PT1iKXJldHVybnt4OnBhKGFbMF0uY2xpZW50WCkseTpwYShhWzBdLmNsaWVudFkpfTtmb3IodmFyIGM9MCxkPTAsZT0wO2I+ZTspYys9YVtlXS5jbGllbnRYLGQrPWFbZV0uY2xpZW50WSxlKys7cmV0dXJue3g6cGEoYy9iKSx5OnBhKGQvYil9fWZ1bmN0aW9uIEYoYSxiLGMpe3JldHVybnt4OmIvYXx8MCx5OmMvYXx8MH19ZnVuY3Rpb24gRyhhLGIpe3JldHVybiBhPT09Yj9JYTpxYShhKT49cWEoYik/MD5hP0phOkthOjA+Yj9MYTpNYX1mdW5jdGlvbiBIKGEsYixjKXtjfHwoYz1RYSk7dmFyIGQ9YltjWzBdXS1hW2NbMF1dLGU9YltjWzFdXS1hW2NbMV1dO3JldHVybiBNYXRoLnNxcnQoZCpkK2UqZSl9ZnVuY3Rpb24gSShhLGIsYyl7Y3x8KGM9UWEpO3ZhciBkPWJbY1swXV0tYVtjWzBdXSxlPWJbY1sxXV0tYVtjWzFdXTtyZXR1cm4gMTgwKk1hdGguYXRhbjIoZSxkKS9NYXRoLlBJfWZ1bmN0aW9uIEooYSxiKXtyZXR1cm4gSShiWzFdLGJbMF0sUmEpK0koYVsxXSxhWzBdLFJhKX1mdW5jdGlvbiBLKGEsYil7cmV0dXJuIEgoYlswXSxiWzFdLFJhKS9IKGFbMF0sYVsxXSxSYSl9ZnVuY3Rpb24gTCgpe3RoaXMuZXZFbD1UYSx0aGlzLmV2V2luPVVhLHRoaXMucHJlc3NlZD0hMSx4LmFwcGx5KHRoaXMsYXJndW1lbnRzKX1mdW5jdGlvbiBNKCl7dGhpcy5ldkVsPVhhLHRoaXMuZXZXaW49WWEseC5hcHBseSh0aGlzLGFyZ3VtZW50cyksdGhpcy5zdG9yZT10aGlzLm1hbmFnZXIuc2Vzc2lvbi5wb2ludGVyRXZlbnRzPVtdfWZ1bmN0aW9uIE4oKXt0aGlzLmV2VGFyZ2V0PSRhLHRoaXMuZXZXaW49X2EsdGhpcy5zdGFydGVkPSExLHguYXBwbHkodGhpcyxhcmd1bWVudHMpfWZ1bmN0aW9uIE8oYSxiKXt2YXIgYz1zKGEudG91Y2hlcyksZD1zKGEuY2hhbmdlZFRvdWNoZXMpO3JldHVybiBiJihHYXxIYSkmJihjPXQoYy5jb25jYXQoZCksXCJpZGVudGlmaWVyXCIsITApKSxbYyxkXX1mdW5jdGlvbiBQKCl7dGhpcy5ldlRhcmdldD1iYix0aGlzLnRhcmdldElkcz17fSx4LmFwcGx5KHRoaXMsYXJndW1lbnRzKX1mdW5jdGlvbiBRKGEsYil7dmFyIGM9cyhhLnRvdWNoZXMpLGQ9dGhpcy50YXJnZXRJZHM7aWYoYiYoRWF8RmEpJiYxPT09Yy5sZW5ndGgpcmV0dXJuIGRbY1swXS5pZGVudGlmaWVyXT0hMCxbYyxjXTt2YXIgZSxmLGc9cyhhLmNoYW5nZWRUb3VjaGVzKSxoPVtdLGk9dGhpcy50YXJnZXQ7aWYoZj1jLmZpbHRlcihmdW5jdGlvbihhKXtyZXR1cm4gbyhhLnRhcmdldCxpKX0pLGI9PT1FYSlmb3IoZT0wO2U8Zi5sZW5ndGg7KWRbZltlXS5pZGVudGlmaWVyXT0hMCxlKys7Zm9yKGU9MDtlPGcubGVuZ3RoOylkW2dbZV0uaWRlbnRpZmllcl0mJmgucHVzaChnW2VdKSxiJihHYXxIYSkmJmRlbGV0ZSBkW2dbZV0uaWRlbnRpZmllcl0sZSsrO3JldHVybiBoLmxlbmd0aD9bdChmLmNvbmNhdChoKSxcImlkZW50aWZpZXJcIiwhMCksaF06dm9pZCAwfWZ1bmN0aW9uIFIoKXt4LmFwcGx5KHRoaXMsYXJndW1lbnRzKTt2YXIgYT1qKHRoaXMuaGFuZGxlcix0aGlzKTt0aGlzLnRvdWNoPW5ldyBQKHRoaXMubWFuYWdlcixhKSx0aGlzLm1vdXNlPW5ldyBMKHRoaXMubWFuYWdlcixhKSx0aGlzLnByaW1hcnlUb3VjaD1udWxsLHRoaXMubGFzdFRvdWNoZXM9W119ZnVuY3Rpb24gUyhhLGIpe2EmRWE/KHRoaXMucHJpbWFyeVRvdWNoPWIuY2hhbmdlZFBvaW50ZXJzWzBdLmlkZW50aWZpZXIsVC5jYWxsKHRoaXMsYikpOmEmKEdhfEhhKSYmVC5jYWxsKHRoaXMsYil9ZnVuY3Rpb24gVChhKXt2YXIgYj1hLmNoYW5nZWRQb2ludGVyc1swXTtpZihiLmlkZW50aWZpZXI9PT10aGlzLnByaW1hcnlUb3VjaCl7dmFyIGM9e3g6Yi5jbGllbnRYLHk6Yi5jbGllbnRZfTt0aGlzLmxhc3RUb3VjaGVzLnB1c2goYyk7dmFyIGQ9dGhpcy5sYXN0VG91Y2hlcyxlPWZ1bmN0aW9uKCl7dmFyIGE9ZC5pbmRleE9mKGMpO2E+LTEmJmQuc3BsaWNlKGEsMSl9O3NldFRpbWVvdXQoZSxjYil9fWZ1bmN0aW9uIFUoYSl7Zm9yKHZhciBiPWEuc3JjRXZlbnQuY2xpZW50WCxjPWEuc3JjRXZlbnQuY2xpZW50WSxkPTA7ZDx0aGlzLmxhc3RUb3VjaGVzLmxlbmd0aDtkKyspe3ZhciBlPXRoaXMubGFzdFRvdWNoZXNbZF0sZj1NYXRoLmFicyhiLWUueCksZz1NYXRoLmFicyhjLWUueSk7aWYoZGI+PWYmJmRiPj1nKXJldHVybiEwfXJldHVybiExfWZ1bmN0aW9uIFYoYSxiKXt0aGlzLm1hbmFnZXI9YSx0aGlzLnNldChiKX1mdW5jdGlvbiBXKGEpe2lmKHAoYSxqYikpcmV0dXJuIGpiO3ZhciBiPXAoYSxrYiksYz1wKGEsbGIpO3JldHVybiBiJiZjP2piOmJ8fGM/Yj9rYjpsYjpwKGEsaWIpP2liOmhifWZ1bmN0aW9uIFgoKXtpZighZmIpcmV0dXJuITE7dmFyIGI9e30sYz1hLkNTUyYmYS5DU1Muc3VwcG9ydHM7cmV0dXJuW1wiYXV0b1wiLFwibWFuaXB1bGF0aW9uXCIsXCJwYW4teVwiLFwicGFuLXhcIixcInBhbi14IHBhbi15XCIsXCJub25lXCJdLmZvckVhY2goZnVuY3Rpb24oZCl7YltkXT1jP2EuQ1NTLnN1cHBvcnRzKFwidG91Y2gtYWN0aW9uXCIsZCk6ITB9KSxifWZ1bmN0aW9uIFkoYSl7dGhpcy5vcHRpb25zPWxhKHt9LHRoaXMuZGVmYXVsdHMsYXx8e30pLHRoaXMuaWQ9digpLHRoaXMubWFuYWdlcj1udWxsLHRoaXMub3B0aW9ucy5lbmFibGU9bCh0aGlzLm9wdGlvbnMuZW5hYmxlLCEwKSx0aGlzLnN0YXRlPW5iLHRoaXMuc2ltdWx0YW5lb3VzPXt9LHRoaXMucmVxdWlyZUZhaWw9W119ZnVuY3Rpb24gWihhKXtyZXR1cm4gYSZzYj9cImNhbmNlbFwiOmEmcWI/XCJlbmRcIjphJnBiP1wibW92ZVwiOmEmb2I/XCJzdGFydFwiOlwiXCJ9ZnVuY3Rpb24gJChhKXtyZXR1cm4gYT09TWE/XCJkb3duXCI6YT09TGE/XCJ1cFwiOmE9PUphP1wibGVmdFwiOmE9PUthP1wicmlnaHRcIjpcIlwifWZ1bmN0aW9uIF8oYSxiKXt2YXIgYz1iLm1hbmFnZXI7cmV0dXJuIGM/Yy5nZXQoYSk6YX1mdW5jdGlvbiBhYSgpe1kuYXBwbHkodGhpcyxhcmd1bWVudHMpfWZ1bmN0aW9uIGJhKCl7YWEuYXBwbHkodGhpcyxhcmd1bWVudHMpLHRoaXMucFg9bnVsbCx0aGlzLnBZPW51bGx9ZnVuY3Rpb24gY2EoKXthYS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZnVuY3Rpb24gZGEoKXtZLmFwcGx5KHRoaXMsYXJndW1lbnRzKSx0aGlzLl90aW1lcj1udWxsLHRoaXMuX2lucHV0PW51bGx9ZnVuY3Rpb24gZWEoKXthYS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZnVuY3Rpb24gZmEoKXthYS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZnVuY3Rpb24gZ2EoKXtZLmFwcGx5KHRoaXMsYXJndW1lbnRzKSx0aGlzLnBUaW1lPSExLHRoaXMucENlbnRlcj0hMSx0aGlzLl90aW1lcj1udWxsLHRoaXMuX2lucHV0PW51bGwsdGhpcy5jb3VudD0wfWZ1bmN0aW9uIGhhKGEsYil7cmV0dXJuIGI9Ynx8e30sYi5yZWNvZ25pemVycz1sKGIucmVjb2duaXplcnMsaGEuZGVmYXVsdHMucHJlc2V0KSxuZXcgaWEoYSxiKX1mdW5jdGlvbiBpYShhLGIpe3RoaXMub3B0aW9ucz1sYSh7fSxoYS5kZWZhdWx0cyxifHx7fSksdGhpcy5vcHRpb25zLmlucHV0VGFyZ2V0PXRoaXMub3B0aW9ucy5pbnB1dFRhcmdldHx8YSx0aGlzLmhhbmRsZXJzPXt9LHRoaXMuc2Vzc2lvbj17fSx0aGlzLnJlY29nbml6ZXJzPVtdLHRoaXMub2xkQ3NzUHJvcHM9e30sdGhpcy5lbGVtZW50PWEsdGhpcy5pbnB1dD15KHRoaXMpLHRoaXMudG91Y2hBY3Rpb249bmV3IFYodGhpcyx0aGlzLm9wdGlvbnMudG91Y2hBY3Rpb24pLGphKHRoaXMsITApLGcodGhpcy5vcHRpb25zLnJlY29nbml6ZXJzLGZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuYWRkKG5ldyBhWzBdKGFbMV0pKTthWzJdJiZiLnJlY29nbml6ZVdpdGgoYVsyXSksYVszXSYmYi5yZXF1aXJlRmFpbHVyZShhWzNdKX0sdGhpcyl9ZnVuY3Rpb24gamEoYSxiKXt2YXIgYz1hLmVsZW1lbnQ7aWYoYy5zdHlsZSl7dmFyIGQ7ZyhhLm9wdGlvbnMuY3NzUHJvcHMsZnVuY3Rpb24oZSxmKXtkPXUoYy5zdHlsZSxmKSxiPyhhLm9sZENzc1Byb3BzW2RdPWMuc3R5bGVbZF0sYy5zdHlsZVtkXT1lKTpjLnN0eWxlW2RdPWEub2xkQ3NzUHJvcHNbZF18fFwiXCJ9KSxifHwoYS5vbGRDc3NQcm9wcz17fSl9fWZ1bmN0aW9uIGthKGEsYyl7dmFyIGQ9Yi5jcmVhdGVFdmVudChcIkV2ZW50XCIpO2QuaW5pdEV2ZW50KGEsITAsITApLGQuZ2VzdHVyZT1jLGMudGFyZ2V0LmRpc3BhdGNoRXZlbnQoZCl9dmFyIGxhLG1hPVtcIlwiLFwid2Via2l0XCIsXCJNb3pcIixcIk1TXCIsXCJtc1wiLFwib1wiXSxuYT1iLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksb2E9XCJmdW5jdGlvblwiLHBhPU1hdGgucm91bmQscWE9TWF0aC5hYnMscmE9RGF0ZS5ub3c7bGE9XCJmdW5jdGlvblwiIT10eXBlb2YgT2JqZWN0LmFzc2lnbj9mdW5jdGlvbihhKXtpZihhPT09ZHx8bnVsbD09PWEpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdFwiKTtmb3IodmFyIGI9T2JqZWN0KGEpLGM9MTtjPGFyZ3VtZW50cy5sZW5ndGg7YysrKXt2YXIgZT1hcmd1bWVudHNbY107aWYoZSE9PWQmJm51bGwhPT1lKWZvcih2YXIgZiBpbiBlKWUuaGFzT3duUHJvcGVydHkoZikmJihiW2ZdPWVbZl0pfXJldHVybiBifTpPYmplY3QuYXNzaWduO3ZhciBzYT1oKGZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGU9T2JqZWN0LmtleXMoYiksZj0wO2Y8ZS5sZW5ndGg7KSghY3x8YyYmYVtlW2ZdXT09PWQpJiYoYVtlW2ZdXT1iW2VbZl1dKSxmKys7cmV0dXJuIGF9LFwiZXh0ZW5kXCIsXCJVc2UgYGFzc2lnbmAuXCIpLHRhPWgoZnVuY3Rpb24oYSxiKXtyZXR1cm4gc2EoYSxiLCEwKX0sXCJtZXJnZVwiLFwiVXNlIGBhc3NpZ25gLlwiKSx1YT0xLHZhPS9tb2JpbGV8dGFibGV0fGlwKGFkfGhvbmV8b2QpfGFuZHJvaWQvaSx3YT1cIm9udG91Y2hzdGFydFwiaW4gYSx4YT11KGEsXCJQb2ludGVyRXZlbnRcIikhPT1kLHlhPXdhJiZ2YS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLHphPVwidG91Y2hcIixBYT1cInBlblwiLEJhPVwibW91c2VcIixDYT1cImtpbmVjdFwiLERhPTI1LEVhPTEsRmE9MixHYT00LEhhPTgsSWE9MSxKYT0yLEthPTQsTGE9OCxNYT0xNixOYT1KYXxLYSxPYT1MYXxNYSxQYT1OYXxPYSxRYT1bXCJ4XCIsXCJ5XCJdLFJhPVtcImNsaWVudFhcIixcImNsaWVudFlcIl07eC5wcm90b3R5cGU9e2hhbmRsZXI6ZnVuY3Rpb24oKXt9LGluaXQ6ZnVuY3Rpb24oKXt0aGlzLmV2RWwmJm0odGhpcy5lbGVtZW50LHRoaXMuZXZFbCx0aGlzLmRvbUhhbmRsZXIpLHRoaXMuZXZUYXJnZXQmJm0odGhpcy50YXJnZXQsdGhpcy5ldlRhcmdldCx0aGlzLmRvbUhhbmRsZXIpLHRoaXMuZXZXaW4mJm0odyh0aGlzLmVsZW1lbnQpLHRoaXMuZXZXaW4sdGhpcy5kb21IYW5kbGVyKX0sZGVzdHJveTpmdW5jdGlvbigpe3RoaXMuZXZFbCYmbih0aGlzLmVsZW1lbnQsdGhpcy5ldkVsLHRoaXMuZG9tSGFuZGxlciksdGhpcy5ldlRhcmdldCYmbih0aGlzLnRhcmdldCx0aGlzLmV2VGFyZ2V0LHRoaXMuZG9tSGFuZGxlciksdGhpcy5ldldpbiYmbih3KHRoaXMuZWxlbWVudCksdGhpcy5ldldpbix0aGlzLmRvbUhhbmRsZXIpfX07dmFyIFNhPXttb3VzZWRvd246RWEsbW91c2Vtb3ZlOkZhLG1vdXNldXA6R2F9LFRhPVwibW91c2Vkb3duXCIsVWE9XCJtb3VzZW1vdmUgbW91c2V1cFwiO2koTCx4LHtoYW5kbGVyOmZ1bmN0aW9uKGEpe3ZhciBiPVNhW2EudHlwZV07YiZFYSYmMD09PWEuYnV0dG9uJiYodGhpcy5wcmVzc2VkPSEwKSxiJkZhJiYxIT09YS53aGljaCYmKGI9R2EpLHRoaXMucHJlc3NlZCYmKGImR2EmJih0aGlzLnByZXNzZWQ9ITEpLHRoaXMuY2FsbGJhY2sodGhpcy5tYW5hZ2VyLGIse3BvaW50ZXJzOlthXSxjaGFuZ2VkUG9pbnRlcnM6W2FdLHBvaW50ZXJUeXBlOkJhLHNyY0V2ZW50OmF9KSl9fSk7dmFyIFZhPXtwb2ludGVyZG93bjpFYSxwb2ludGVybW92ZTpGYSxwb2ludGVydXA6R2EscG9pbnRlcmNhbmNlbDpIYSxwb2ludGVyb3V0OkhhfSxXYT17Mjp6YSwzOkFhLDQ6QmEsNTpDYX0sWGE9XCJwb2ludGVyZG93blwiLFlhPVwicG9pbnRlcm1vdmUgcG9pbnRlcnVwIHBvaW50ZXJjYW5jZWxcIjthLk1TUG9pbnRlckV2ZW50JiYhYS5Qb2ludGVyRXZlbnQmJihYYT1cIk1TUG9pbnRlckRvd25cIixZYT1cIk1TUG9pbnRlck1vdmUgTVNQb2ludGVyVXAgTVNQb2ludGVyQ2FuY2VsXCIpLGkoTSx4LHtoYW5kbGVyOmZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuc3RvcmUsYz0hMSxkPWEudHlwZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoXCJtc1wiLFwiXCIpLGU9VmFbZF0sZj1XYVthLnBvaW50ZXJUeXBlXXx8YS5wb2ludGVyVHlwZSxnPWY9PXphLGg9cihiLGEucG9pbnRlcklkLFwicG9pbnRlcklkXCIpO2UmRWEmJigwPT09YS5idXR0b258fGcpPzA+aCYmKGIucHVzaChhKSxoPWIubGVuZ3RoLTEpOmUmKEdhfEhhKSYmKGM9ITApLDA+aHx8KGJbaF09YSx0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlcixlLHtwb2ludGVyczpiLGNoYW5nZWRQb2ludGVyczpbYV0scG9pbnRlclR5cGU6ZixzcmNFdmVudDphfSksYyYmYi5zcGxpY2UoaCwxKSl9fSk7dmFyIFphPXt0b3VjaHN0YXJ0OkVhLHRvdWNobW92ZTpGYSx0b3VjaGVuZDpHYSx0b3VjaGNhbmNlbDpIYX0sJGE9XCJ0b3VjaHN0YXJ0XCIsX2E9XCJ0b3VjaHN0YXJ0IHRvdWNobW92ZSB0b3VjaGVuZCB0b3VjaGNhbmNlbFwiO2koTix4LHtoYW5kbGVyOmZ1bmN0aW9uKGEpe3ZhciBiPVphW2EudHlwZV07aWYoYj09PUVhJiYodGhpcy5zdGFydGVkPSEwKSx0aGlzLnN0YXJ0ZWQpe3ZhciBjPU8uY2FsbCh0aGlzLGEsYik7YiYoR2F8SGEpJiZjWzBdLmxlbmd0aC1jWzFdLmxlbmd0aD09PTAmJih0aGlzLnN0YXJ0ZWQ9ITEpLHRoaXMuY2FsbGJhY2sodGhpcy5tYW5hZ2VyLGIse3BvaW50ZXJzOmNbMF0sY2hhbmdlZFBvaW50ZXJzOmNbMV0scG9pbnRlclR5cGU6emEsc3JjRXZlbnQ6YX0pfX19KTt2YXIgYWI9e3RvdWNoc3RhcnQ6RWEsdG91Y2htb3ZlOkZhLHRvdWNoZW5kOkdhLHRvdWNoY2FuY2VsOkhhfSxiYj1cInRvdWNoc3RhcnQgdG91Y2htb3ZlIHRvdWNoZW5kIHRvdWNoY2FuY2VsXCI7aShQLHgse2hhbmRsZXI6ZnVuY3Rpb24oYSl7dmFyIGI9YWJbYS50eXBlXSxjPVEuY2FsbCh0aGlzLGEsYik7YyYmdGhpcy5jYWxsYmFjayh0aGlzLm1hbmFnZXIsYix7cG9pbnRlcnM6Y1swXSxjaGFuZ2VkUG9pbnRlcnM6Y1sxXSxwb2ludGVyVHlwZTp6YSxzcmNFdmVudDphfSl9fSk7dmFyIGNiPTI1MDAsZGI9MjU7aShSLHgse2hhbmRsZXI6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWMucG9pbnRlclR5cGU9PXphLGU9Yy5wb2ludGVyVHlwZT09QmE7aWYoIShlJiZjLnNvdXJjZUNhcGFiaWxpdGllcyYmYy5zb3VyY2VDYXBhYmlsaXRpZXMuZmlyZXNUb3VjaEV2ZW50cykpe2lmKGQpUy5jYWxsKHRoaXMsYixjKTtlbHNlIGlmKGUmJlUuY2FsbCh0aGlzLGMpKXJldHVybjt0aGlzLmNhbGxiYWNrKGEsYixjKX19LGRlc3Ryb3k6ZnVuY3Rpb24oKXt0aGlzLnRvdWNoLmRlc3Ryb3koKSx0aGlzLm1vdXNlLmRlc3Ryb3koKX19KTt2YXIgZWI9dShuYS5zdHlsZSxcInRvdWNoQWN0aW9uXCIpLGZiPWViIT09ZCxnYj1cImNvbXB1dGVcIixoYj1cImF1dG9cIixpYj1cIm1hbmlwdWxhdGlvblwiLGpiPVwibm9uZVwiLGtiPVwicGFuLXhcIixsYj1cInBhbi15XCIsbWI9WCgpO1YucHJvdG90eXBlPXtzZXQ6ZnVuY3Rpb24oYSl7YT09Z2ImJihhPXRoaXMuY29tcHV0ZSgpKSxmYiYmdGhpcy5tYW5hZ2VyLmVsZW1lbnQuc3R5bGUmJm1iW2FdJiYodGhpcy5tYW5hZ2VyLmVsZW1lbnQuc3R5bGVbZWJdPWEpLHRoaXMuYWN0aW9ucz1hLnRvTG93ZXJDYXNlKCkudHJpbSgpfSx1cGRhdGU6ZnVuY3Rpb24oKXt0aGlzLnNldCh0aGlzLm1hbmFnZXIub3B0aW9ucy50b3VjaEFjdGlvbil9LGNvbXB1dGU6ZnVuY3Rpb24oKXt2YXIgYT1bXTtyZXR1cm4gZyh0aGlzLm1hbmFnZXIucmVjb2duaXplcnMsZnVuY3Rpb24oYil7ayhiLm9wdGlvbnMuZW5hYmxlLFtiXSkmJihhPWEuY29uY2F0KGIuZ2V0VG91Y2hBY3Rpb24oKSkpfSksVyhhLmpvaW4oXCIgXCIpKX0scHJldmVudERlZmF1bHRzOmZ1bmN0aW9uKGEpe3ZhciBiPWEuc3JjRXZlbnQsYz1hLm9mZnNldERpcmVjdGlvbjtpZih0aGlzLm1hbmFnZXIuc2Vzc2lvbi5wcmV2ZW50ZWQpcmV0dXJuIHZvaWQgYi5wcmV2ZW50RGVmYXVsdCgpO3ZhciBkPXRoaXMuYWN0aW9ucyxlPXAoZCxqYikmJiFtYltqYl0sZj1wKGQsbGIpJiYhbWJbbGJdLGc9cChkLGtiKSYmIW1iW2tiXTtpZihlKXt2YXIgaD0xPT09YS5wb2ludGVycy5sZW5ndGgsaT1hLmRpc3RhbmNlPDIsaj1hLmRlbHRhVGltZTwyNTA7aWYoaCYmaSYmailyZXR1cm59cmV0dXJuIGcmJmY/dm9pZCAwOmV8fGYmJmMmTmF8fGcmJmMmT2E/dGhpcy5wcmV2ZW50U3JjKGIpOnZvaWQgMH0scHJldmVudFNyYzpmdW5jdGlvbihhKXt0aGlzLm1hbmFnZXIuc2Vzc2lvbi5wcmV2ZW50ZWQ9ITAsYS5wcmV2ZW50RGVmYXVsdCgpfX07dmFyIG5iPTEsb2I9MixwYj00LHFiPTgscmI9cWIsc2I9MTYsdGI9MzI7WS5wcm90b3R5cGU9e2RlZmF1bHRzOnt9LHNldDpmdW5jdGlvbihhKXtyZXR1cm4gbGEodGhpcy5vcHRpb25zLGEpLHRoaXMubWFuYWdlciYmdGhpcy5tYW5hZ2VyLnRvdWNoQWN0aW9uLnVwZGF0ZSgpLHRoaXN9LHJlY29nbml6ZVdpdGg6ZnVuY3Rpb24oYSl7aWYoZihhLFwicmVjb2duaXplV2l0aFwiLHRoaXMpKXJldHVybiB0aGlzO3ZhciBiPXRoaXMuc2ltdWx0YW5lb3VzO3JldHVybiBhPV8oYSx0aGlzKSxiW2EuaWRdfHwoYlthLmlkXT1hLGEucmVjb2duaXplV2l0aCh0aGlzKSksdGhpc30sZHJvcFJlY29nbml6ZVdpdGg6ZnVuY3Rpb24oYSl7cmV0dXJuIGYoYSxcImRyb3BSZWNvZ25pemVXaXRoXCIsdGhpcyk/dGhpczooYT1fKGEsdGhpcyksZGVsZXRlIHRoaXMuc2ltdWx0YW5lb3VzW2EuaWRdLHRoaXMpfSxyZXF1aXJlRmFpbHVyZTpmdW5jdGlvbihhKXtpZihmKGEsXCJyZXF1aXJlRmFpbHVyZVwiLHRoaXMpKXJldHVybiB0aGlzO3ZhciBiPXRoaXMucmVxdWlyZUZhaWw7cmV0dXJuIGE9XyhhLHRoaXMpLC0xPT09cihiLGEpJiYoYi5wdXNoKGEpLGEucmVxdWlyZUZhaWx1cmUodGhpcykpLHRoaXN9LGRyb3BSZXF1aXJlRmFpbHVyZTpmdW5jdGlvbihhKXtpZihmKGEsXCJkcm9wUmVxdWlyZUZhaWx1cmVcIix0aGlzKSlyZXR1cm4gdGhpczthPV8oYSx0aGlzKTt2YXIgYj1yKHRoaXMucmVxdWlyZUZhaWwsYSk7cmV0dXJuIGI+LTEmJnRoaXMucmVxdWlyZUZhaWwuc3BsaWNlKGIsMSksdGhpc30saGFzUmVxdWlyZUZhaWx1cmVzOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucmVxdWlyZUZhaWwubGVuZ3RoPjB9LGNhblJlY29nbml6ZVdpdGg6ZnVuY3Rpb24oYSl7cmV0dXJuISF0aGlzLnNpbXVsdGFuZW91c1thLmlkXX0sZW1pdDpmdW5jdGlvbihhKXtmdW5jdGlvbiBiKGIpe2MubWFuYWdlci5lbWl0KGIsYSl9dmFyIGM9dGhpcyxkPXRoaXMuc3RhdGU7cWI+ZCYmYihjLm9wdGlvbnMuZXZlbnQrWihkKSksYihjLm9wdGlvbnMuZXZlbnQpLGEuYWRkaXRpb25hbEV2ZW50JiZiKGEuYWRkaXRpb25hbEV2ZW50KSxkPj1xYiYmYihjLm9wdGlvbnMuZXZlbnQrWihkKSl9LHRyeUVtaXQ6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuY2FuRW1pdCgpP3RoaXMuZW1pdChhKTp2b2lkKHRoaXMuc3RhdGU9dGIpfSxjYW5FbWl0OmZ1bmN0aW9uKCl7Zm9yKHZhciBhPTA7YTx0aGlzLnJlcXVpcmVGYWlsLmxlbmd0aDspe2lmKCEodGhpcy5yZXF1aXJlRmFpbFthXS5zdGF0ZSYodGJ8bmIpKSlyZXR1cm4hMTthKyt9cmV0dXJuITB9LHJlY29nbml6ZTpmdW5jdGlvbihhKXt2YXIgYj1sYSh7fSxhKTtyZXR1cm4gayh0aGlzLm9wdGlvbnMuZW5hYmxlLFt0aGlzLGJdKT8odGhpcy5zdGF0ZSYocmJ8c2J8dGIpJiYodGhpcy5zdGF0ZT1uYiksdGhpcy5zdGF0ZT10aGlzLnByb2Nlc3MoYiksdm9pZCh0aGlzLnN0YXRlJihvYnxwYnxxYnxzYikmJnRoaXMudHJ5RW1pdChiKSkpOih0aGlzLnJlc2V0KCksdm9pZCh0aGlzLnN0YXRlPXRiKSl9LHByb2Nlc3M6ZnVuY3Rpb24oYSl7fSxnZXRUb3VjaEFjdGlvbjpmdW5jdGlvbigpe30scmVzZXQ6ZnVuY3Rpb24oKXt9fSxpKGFhLFkse2RlZmF1bHRzOntwb2ludGVyczoxfSxhdHRyVGVzdDpmdW5jdGlvbihhKXt2YXIgYj10aGlzLm9wdGlvbnMucG9pbnRlcnM7cmV0dXJuIDA9PT1ifHxhLnBvaW50ZXJzLmxlbmd0aD09PWJ9LHByb2Nlc3M6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5zdGF0ZSxjPWEuZXZlbnRUeXBlLGQ9YiYob2J8cGIpLGU9dGhpcy5hdHRyVGVzdChhKTtyZXR1cm4gZCYmKGMmSGF8fCFlKT9ifHNiOmR8fGU/YyZHYT9ifHFiOmImb2I/YnxwYjpvYjp0Yn19KSxpKGJhLGFhLHtkZWZhdWx0czp7ZXZlbnQ6XCJwYW5cIix0aHJlc2hvbGQ6MTAscG9pbnRlcnM6MSxkaXJlY3Rpb246UGF9LGdldFRvdWNoQWN0aW9uOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5vcHRpb25zLmRpcmVjdGlvbixiPVtdO3JldHVybiBhJk5hJiZiLnB1c2gobGIpLGEmT2EmJmIucHVzaChrYiksYn0sZGlyZWN0aW9uVGVzdDpmdW5jdGlvbihhKXt2YXIgYj10aGlzLm9wdGlvbnMsYz0hMCxkPWEuZGlzdGFuY2UsZT1hLmRpcmVjdGlvbixmPWEuZGVsdGFYLGc9YS5kZWx0YVk7cmV0dXJuIGUmYi5kaXJlY3Rpb258fChiLmRpcmVjdGlvbiZOYT8oZT0wPT09Zj9JYTowPmY/SmE6S2EsYz1mIT10aGlzLnBYLGQ9TWF0aC5hYnMoYS5kZWx0YVgpKTooZT0wPT09Zz9JYTowPmc/TGE6TWEsYz1nIT10aGlzLnBZLGQ9TWF0aC5hYnMoYS5kZWx0YVkpKSksYS5kaXJlY3Rpb249ZSxjJiZkPmIudGhyZXNob2xkJiZlJmIuZGlyZWN0aW9ufSxhdHRyVGVzdDpmdW5jdGlvbihhKXtyZXR1cm4gYWEucHJvdG90eXBlLmF0dHJUZXN0LmNhbGwodGhpcyxhKSYmKHRoaXMuc3RhdGUmb2J8fCEodGhpcy5zdGF0ZSZvYikmJnRoaXMuZGlyZWN0aW9uVGVzdChhKSl9LGVtaXQ6ZnVuY3Rpb24oYSl7dGhpcy5wWD1hLmRlbHRhWCx0aGlzLnBZPWEuZGVsdGFZO3ZhciBiPSQoYS5kaXJlY3Rpb24pO2ImJihhLmFkZGl0aW9uYWxFdmVudD10aGlzLm9wdGlvbnMuZXZlbnQrYiksdGhpcy5fc3VwZXIuZW1pdC5jYWxsKHRoaXMsYSl9fSksaShjYSxhYSx7ZGVmYXVsdHM6e2V2ZW50OlwicGluY2hcIix0aHJlc2hvbGQ6MCxwb2ludGVyczoyfSxnZXRUb3VjaEFjdGlvbjpmdW5jdGlvbigpe3JldHVybltqYl19LGF0dHJUZXN0OmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLl9zdXBlci5hdHRyVGVzdC5jYWxsKHRoaXMsYSkmJihNYXRoLmFicyhhLnNjYWxlLTEpPnRoaXMub3B0aW9ucy50aHJlc2hvbGR8fHRoaXMuc3RhdGUmb2IpfSxlbWl0OmZ1bmN0aW9uKGEpe2lmKDEhPT1hLnNjYWxlKXt2YXIgYj1hLnNjYWxlPDE/XCJpblwiOlwib3V0XCI7YS5hZGRpdGlvbmFsRXZlbnQ9dGhpcy5vcHRpb25zLmV2ZW50K2J9dGhpcy5fc3VwZXIuZW1pdC5jYWxsKHRoaXMsYSl9fSksaShkYSxZLHtkZWZhdWx0czp7ZXZlbnQ6XCJwcmVzc1wiLHBvaW50ZXJzOjEsdGltZToyNTEsdGhyZXNob2xkOjl9LGdldFRvdWNoQWN0aW9uOmZ1bmN0aW9uKCl7cmV0dXJuW2hiXX0scHJvY2VzczpmdW5jdGlvbihhKXt2YXIgYj10aGlzLm9wdGlvbnMsYz1hLnBvaW50ZXJzLmxlbmd0aD09PWIucG9pbnRlcnMsZD1hLmRpc3RhbmNlPGIudGhyZXNob2xkLGY9YS5kZWx0YVRpbWU+Yi50aW1lO2lmKHRoaXMuX2lucHV0PWEsIWR8fCFjfHxhLmV2ZW50VHlwZSYoR2F8SGEpJiYhZil0aGlzLnJlc2V0KCk7ZWxzZSBpZihhLmV2ZW50VHlwZSZFYSl0aGlzLnJlc2V0KCksdGhpcy5fdGltZXI9ZShmdW5jdGlvbigpe3RoaXMuc3RhdGU9cmIsdGhpcy50cnlFbWl0KCl9LGIudGltZSx0aGlzKTtlbHNlIGlmKGEuZXZlbnRUeXBlJkdhKXJldHVybiByYjtyZXR1cm4gdGJ9LHJlc2V0OmZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKX0sZW1pdDpmdW5jdGlvbihhKXt0aGlzLnN0YXRlPT09cmImJihhJiZhLmV2ZW50VHlwZSZHYT90aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQrXCJ1cFwiLGEpOih0aGlzLl9pbnB1dC50aW1lU3RhbXA9cmEoKSx0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQsdGhpcy5faW5wdXQpKSl9fSksaShlYSxhYSx7ZGVmYXVsdHM6e2V2ZW50Olwicm90YXRlXCIsdGhyZXNob2xkOjAscG9pbnRlcnM6Mn0sZ2V0VG91Y2hBY3Rpb246ZnVuY3Rpb24oKXtyZXR1cm5bamJdfSxhdHRyVGVzdDpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5fc3VwZXIuYXR0clRlc3QuY2FsbCh0aGlzLGEpJiYoTWF0aC5hYnMoYS5yb3RhdGlvbik+dGhpcy5vcHRpb25zLnRocmVzaG9sZHx8dGhpcy5zdGF0ZSZvYil9fSksaShmYSxhYSx7ZGVmYXVsdHM6e2V2ZW50Olwic3dpcGVcIix0aHJlc2hvbGQ6MTAsdmVsb2NpdHk6LjMsZGlyZWN0aW9uOk5hfE9hLHBvaW50ZXJzOjF9LGdldFRvdWNoQWN0aW9uOmZ1bmN0aW9uKCl7cmV0dXJuIGJhLnByb3RvdHlwZS5nZXRUb3VjaEFjdGlvbi5jYWxsKHRoaXMpfSxhdHRyVGVzdDpmdW5jdGlvbihhKXt2YXIgYixjPXRoaXMub3B0aW9ucy5kaXJlY3Rpb247cmV0dXJuIGMmKE5hfE9hKT9iPWEub3ZlcmFsbFZlbG9jaXR5OmMmTmE/Yj1hLm92ZXJhbGxWZWxvY2l0eVg6YyZPYSYmKGI9YS5vdmVyYWxsVmVsb2NpdHlZKSx0aGlzLl9zdXBlci5hdHRyVGVzdC5jYWxsKHRoaXMsYSkmJmMmYS5vZmZzZXREaXJlY3Rpb24mJmEuZGlzdGFuY2U+dGhpcy5vcHRpb25zLnRocmVzaG9sZCYmYS5tYXhQb2ludGVycz09dGhpcy5vcHRpb25zLnBvaW50ZXJzJiZxYShiKT50aGlzLm9wdGlvbnMudmVsb2NpdHkmJmEuZXZlbnRUeXBlJkdhfSxlbWl0OmZ1bmN0aW9uKGEpe3ZhciBiPSQoYS5vZmZzZXREaXJlY3Rpb24pO2ImJnRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCtiLGEpLHRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCxhKX19KSxpKGdhLFkse2RlZmF1bHRzOntldmVudDpcInRhcFwiLHBvaW50ZXJzOjEsdGFwczoxLGludGVydmFsOjMwMCx0aW1lOjI1MCx0aHJlc2hvbGQ6OSxwb3NUaHJlc2hvbGQ6MTB9LGdldFRvdWNoQWN0aW9uOmZ1bmN0aW9uKCl7cmV0dXJuW2liXX0scHJvY2VzczpmdW5jdGlvbihhKXt2YXIgYj10aGlzLm9wdGlvbnMsYz1hLnBvaW50ZXJzLmxlbmd0aD09PWIucG9pbnRlcnMsZD1hLmRpc3RhbmNlPGIudGhyZXNob2xkLGY9YS5kZWx0YVRpbWU8Yi50aW1lO2lmKHRoaXMucmVzZXQoKSxhLmV2ZW50VHlwZSZFYSYmMD09PXRoaXMuY291bnQpcmV0dXJuIHRoaXMuZmFpbFRpbWVvdXQoKTtpZihkJiZmJiZjKXtpZihhLmV2ZW50VHlwZSE9R2EpcmV0dXJuIHRoaXMuZmFpbFRpbWVvdXQoKTt2YXIgZz10aGlzLnBUaW1lP2EudGltZVN0YW1wLXRoaXMucFRpbWU8Yi5pbnRlcnZhbDohMCxoPSF0aGlzLnBDZW50ZXJ8fEgodGhpcy5wQ2VudGVyLGEuY2VudGVyKTxiLnBvc1RocmVzaG9sZDt0aGlzLnBUaW1lPWEudGltZVN0YW1wLHRoaXMucENlbnRlcj1hLmNlbnRlcixoJiZnP3RoaXMuY291bnQrPTE6dGhpcy5jb3VudD0xLHRoaXMuX2lucHV0PWE7dmFyIGk9dGhpcy5jb3VudCViLnRhcHM7aWYoMD09PWkpcmV0dXJuIHRoaXMuaGFzUmVxdWlyZUZhaWx1cmVzKCk/KHRoaXMuX3RpbWVyPWUoZnVuY3Rpb24oKXt0aGlzLnN0YXRlPXJiLHRoaXMudHJ5RW1pdCgpfSxiLmludGVydmFsLHRoaXMpLG9iKTpyYn1yZXR1cm4gdGJ9LGZhaWxUaW1lb3V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3RpbWVyPWUoZnVuY3Rpb24oKXt0aGlzLnN0YXRlPXRifSx0aGlzLm9wdGlvbnMuaW50ZXJ2YWwsdGhpcyksdGJ9LHJlc2V0OmZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKX0sZW1pdDpmdW5jdGlvbigpe3RoaXMuc3RhdGU9PXJiJiYodGhpcy5faW5wdXQudGFwQ291bnQ9dGhpcy5jb3VudCx0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQsdGhpcy5faW5wdXQpKX19KSxoYS5WRVJTSU9OPVwiMi4wLjhcIixoYS5kZWZhdWx0cz17ZG9tRXZlbnRzOiExLHRvdWNoQWN0aW9uOmdiLGVuYWJsZTohMCxpbnB1dFRhcmdldDpudWxsLGlucHV0Q2xhc3M6bnVsbCxwcmVzZXQ6W1tlYSx7ZW5hYmxlOiExfV0sW2NhLHtlbmFibGU6ITF9LFtcInJvdGF0ZVwiXV0sW2ZhLHtkaXJlY3Rpb246TmF9XSxbYmEse2RpcmVjdGlvbjpOYX0sW1wic3dpcGVcIl1dLFtnYV0sW2dhLHtldmVudDpcImRvdWJsZXRhcFwiLHRhcHM6Mn0sW1widGFwXCJdXSxbZGFdXSxjc3NQcm9wczp7dXNlclNlbGVjdDpcIm5vbmVcIix0b3VjaFNlbGVjdDpcIm5vbmVcIix0b3VjaENhbGxvdXQ6XCJub25lXCIsY29udGVudFpvb21pbmc6XCJub25lXCIsdXNlckRyYWc6XCJub25lXCIsdGFwSGlnaGxpZ2h0Q29sb3I6XCJyZ2JhKDAsMCwwLDApXCJ9fTt2YXIgdWI9MSx2Yj0yO2lhLnByb3RvdHlwZT17c2V0OmZ1bmN0aW9uKGEpe3JldHVybiBsYSh0aGlzLm9wdGlvbnMsYSksYS50b3VjaEFjdGlvbiYmdGhpcy50b3VjaEFjdGlvbi51cGRhdGUoKSxhLmlucHV0VGFyZ2V0JiYodGhpcy5pbnB1dC5kZXN0cm95KCksdGhpcy5pbnB1dC50YXJnZXQ9YS5pbnB1dFRhcmdldCx0aGlzLmlucHV0LmluaXQoKSksdGhpc30sc3RvcDpmdW5jdGlvbihhKXt0aGlzLnNlc3Npb24uc3RvcHBlZD1hP3ZiOnVifSxyZWNvZ25pemU6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5zZXNzaW9uO2lmKCFiLnN0b3BwZWQpe3RoaXMudG91Y2hBY3Rpb24ucHJldmVudERlZmF1bHRzKGEpO3ZhciBjLGQ9dGhpcy5yZWNvZ25pemVycyxlPWIuY3VyUmVjb2duaXplcjsoIWV8fGUmJmUuc3RhdGUmcmIpJiYoZT1iLmN1clJlY29nbml6ZXI9bnVsbCk7Zm9yKHZhciBmPTA7ZjxkLmxlbmd0aDspYz1kW2ZdLGIuc3RvcHBlZD09PXZifHxlJiZjIT1lJiYhYy5jYW5SZWNvZ25pemVXaXRoKGUpP2MucmVzZXQoKTpjLnJlY29nbml6ZShhKSwhZSYmYy5zdGF0ZSYob2J8cGJ8cWIpJiYoZT1iLmN1clJlY29nbml6ZXI9YyksZisrfX0sZ2V0OmZ1bmN0aW9uKGEpe2lmKGEgaW5zdGFuY2VvZiBZKXJldHVybiBhO2Zvcih2YXIgYj10aGlzLnJlY29nbml6ZXJzLGM9MDtjPGIubGVuZ3RoO2MrKylpZihiW2NdLm9wdGlvbnMuZXZlbnQ9PWEpcmV0dXJuIGJbY107cmV0dXJuIG51bGx9LGFkZDpmdW5jdGlvbihhKXtpZihmKGEsXCJhZGRcIix0aGlzKSlyZXR1cm4gdGhpczt2YXIgYj10aGlzLmdldChhLm9wdGlvbnMuZXZlbnQpO3JldHVybiBiJiZ0aGlzLnJlbW92ZShiKSx0aGlzLnJlY29nbml6ZXJzLnB1c2goYSksYS5tYW5hZ2VyPXRoaXMsdGhpcy50b3VjaEFjdGlvbi51cGRhdGUoKSxhfSxyZW1vdmU6ZnVuY3Rpb24oYSl7aWYoZihhLFwicmVtb3ZlXCIsdGhpcykpcmV0dXJuIHRoaXM7aWYoYT10aGlzLmdldChhKSl7dmFyIGI9dGhpcy5yZWNvZ25pemVycyxjPXIoYixhKTstMSE9PWMmJihiLnNwbGljZShjLDEpLHRoaXMudG91Y2hBY3Rpb24udXBkYXRlKCkpfXJldHVybiB0aGlzfSxvbjpmdW5jdGlvbihhLGIpe2lmKGEhPT1kJiZiIT09ZCl7dmFyIGM9dGhpcy5oYW5kbGVycztyZXR1cm4gZyhxKGEpLGZ1bmN0aW9uKGEpe2NbYV09Y1thXXx8W10sY1thXS5wdXNoKGIpfSksdGhpc319LG9mZjpmdW5jdGlvbihhLGIpe2lmKGEhPT1kKXt2YXIgYz10aGlzLmhhbmRsZXJzO3JldHVybiBnKHEoYSksZnVuY3Rpb24oYSl7Yj9jW2FdJiZjW2FdLnNwbGljZShyKGNbYV0sYiksMSk6ZGVsZXRlIGNbYV19KSx0aGlzfX0sZW1pdDpmdW5jdGlvbihhLGIpe3RoaXMub3B0aW9ucy5kb21FdmVudHMmJmthKGEsYik7dmFyIGM9dGhpcy5oYW5kbGVyc1thXSYmdGhpcy5oYW5kbGVyc1thXS5zbGljZSgpO2lmKGMmJmMubGVuZ3RoKXtiLnR5cGU9YSxiLnByZXZlbnREZWZhdWx0PWZ1bmN0aW9uKCl7Yi5zcmNFdmVudC5wcmV2ZW50RGVmYXVsdCgpfTtmb3IodmFyIGQ9MDtkPGMubGVuZ3RoOyljW2RdKGIpLGQrK319LGRlc3Ryb3k6ZnVuY3Rpb24oKXt0aGlzLmVsZW1lbnQmJmphKHRoaXMsITEpLHRoaXMuaGFuZGxlcnM9e30sdGhpcy5zZXNzaW9uPXt9LHRoaXMuaW5wdXQuZGVzdHJveSgpLHRoaXMuZWxlbWVudD1udWxsfX0sbGEoaGEse0lOUFVUX1NUQVJUOkVhLElOUFVUX01PVkU6RmEsSU5QVVRfRU5EOkdhLElOUFVUX0NBTkNFTDpIYSxTVEFURV9QT1NTSUJMRTpuYixTVEFURV9CRUdBTjpvYixTVEFURV9DSEFOR0VEOnBiLFNUQVRFX0VOREVEOnFiLFNUQVRFX1JFQ09HTklaRUQ6cmIsU1RBVEVfQ0FOQ0VMTEVEOnNiLFNUQVRFX0ZBSUxFRDp0YixESVJFQ1RJT05fTk9ORTpJYSxESVJFQ1RJT05fTEVGVDpKYSxESVJFQ1RJT05fUklHSFQ6S2EsRElSRUNUSU9OX1VQOkxhLERJUkVDVElPTl9ET1dOOk1hLERJUkVDVElPTl9IT1JJWk9OVEFMOk5hLERJUkVDVElPTl9WRVJUSUNBTDpPYSxESVJFQ1RJT05fQUxMOlBhLE1hbmFnZXI6aWEsSW5wdXQ6eCxUb3VjaEFjdGlvbjpWLFRvdWNoSW5wdXQ6UCxNb3VzZUlucHV0OkwsUG9pbnRlckV2ZW50SW5wdXQ6TSxUb3VjaE1vdXNlSW5wdXQ6UixTaW5nbGVUb3VjaElucHV0Ok4sUmVjb2duaXplcjpZLEF0dHJSZWNvZ25pemVyOmFhLFRhcDpnYSxQYW46YmEsU3dpcGU6ZmEsUGluY2g6Y2EsUm90YXRlOmVhLFByZXNzOmRhLG9uOm0sb2ZmOm4sZWFjaDpnLG1lcmdlOnRhLGV4dGVuZDpzYSxhc3NpZ246bGEsaW5oZXJpdDppLGJpbmRGbjpqLHByZWZpeGVkOnV9KTt2YXIgd2I9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGE/YTpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZj9zZWxmOnt9O3diLkhhbW1lcj1oYSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIGhhfSk6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9aGE6YVtjXT1oYX0od2luZG93LGRvY3VtZW50LFwiSGFtbWVyXCIpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGFtbWVyLm1pbi5qcy5tYXAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lQmFzZWRHcmFkZXIge1xuICAgIGNvbnN0cnVjdG9yKHByb2JsZW0pIHtcbiAgICAgICAgdGhpcy5wcm9ibGVtID0gcHJvYmxlbTtcbiAgICB9XG4gICAgLy8gVXNlIGEgTElTIChMb25nZXN0IEluY3JlYXNpbmcgU3Vic2VxdWVuY2UpIGFsZ29yaXRobSB0byByZXR1cm4gdGhlIGluZGV4ZXNcbiAgICAvLyB0aGF0IGFyZSBub3QgcGFydCBvZiB0aGF0IHN1YnNlcXVlbmNlLlxuICAgIGludmVyc2VMSVNJbmRpY2VzKGFycikge1xuICAgICAgICAvLyBHZXQgYWxsIHN1YnNlcXVlbmNlc1xuICAgICAgICB2YXIgYWxsU3Vic2VxdWVuY2VzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc3Vic2VxdWVuY2VGb3JDdXJyZW50ID0gW2FycltpXV0sXG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGFycltpXSxcbiAgICAgICAgICAgICAgICBsYXN0RWxlbWVudEFkZGVkID0gLTE7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gaTsgaiA8IGFyci5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHZhciBzdWJzZXF1ZW50ID0gYXJyW2pdO1xuICAgICAgICAgICAgICAgIGlmIChzdWJzZXF1ZW50ID4gY3VycmVudCAmJiBsYXN0RWxlbWVudEFkZGVkIDwgc3Vic2VxdWVudCkge1xuICAgICAgICAgICAgICAgICAgICBzdWJzZXF1ZW5jZUZvckN1cnJlbnQucHVzaChzdWJzZXF1ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgbGFzdEVsZW1lbnRBZGRlZCA9IHN1YnNlcXVlbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWxsU3Vic2VxdWVuY2VzLnB1c2goc3Vic2VxdWVuY2VGb3JDdXJyZW50KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGaWd1cmUgb3V0IHRoZSBsb25nZXN0IG9uZVxuICAgICAgICB2YXIgbG9uZ2VzdFN1YnNlcXVlbmNlTGVuZ3RoID0gLTE7XG4gICAgICAgIHZhciBsb25nZXN0U3Vic2VxdWVuY2U7XG4gICAgICAgIGZvciAobGV0IGkgaW4gYWxsU3Vic2VxdWVuY2VzKSB7XG4gICAgICAgICAgICB2YXIgc3VicyA9IGFsbFN1YnNlcXVlbmNlc1tpXTtcbiAgICAgICAgICAgIGlmIChzdWJzLmxlbmd0aCA+IGxvbmdlc3RTdWJzZXF1ZW5jZUxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGxvbmdlc3RTdWJzZXF1ZW5jZUxlbmd0aCA9IHN1YnMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGxvbmdlc3RTdWJzZXF1ZW5jZSA9IHN1YnM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBpbnZlcnNlIGluZGV4ZXNcbiAgICAgICAgdmFyIGluZGV4ZXMgPSBbXTtcbiAgICAgICAgdmFyIGxJbmRleCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAobEluZGV4ID4gbG9uZ2VzdFN1YnNlcXVlbmNlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGluZGV4ZXMucHVzaChpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGFycltpXSA9PSBsb25nZXN0U3Vic2VxdWVuY2VbbEluZGV4XSkge1xuICAgICAgICAgICAgICAgICAgICBsSW5kZXggKz0gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbmRleGVzLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbmRleGVzO1xuICAgIH1cbiAgICAvLyBncmFkZSB0aGF0IGVsZW1lbnQsIHJldHVybmluZyB0aGUgc3RhdGVcbiAgICBncmFkZSgpIHtcbiAgICAgICAgdmFyIHByb2JsZW0gPSB0aGlzLnByb2JsZW07XG4gICAgICAgIHByb2JsZW0uY2xlYXJGZWVkYmFjaygpO1xuICAgICAgICB0aGlzLmNvcnJlY3RMaW5lcyA9IDA7XG4gICAgICAgIHRoaXMucGVyY2VudExpbmVzID0gMDtcbiAgICAgICAgdGhpcy5pbmNvcnJlY3RJbmRlbnRzID0gMDtcbiAgICAgICAgdmFyIHNvbHV0aW9uTGluZXMgPSBwcm9ibGVtLnNvbHV0aW9uO1xuICAgICAgICB2YXIgYW5zd2VyTGluZXMgPSBwcm9ibGVtLmFuc3dlckxpbmVzKCk7XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgc3RhdGU7XG4gICAgICAgIHRoaXMucGVyY2VudExpbmVzID1cbiAgICAgICAgICAgIE1hdGgubWluKGFuc3dlckxpbmVzLmxlbmd0aCwgc29sdXRpb25MaW5lcy5sZW5ndGgpIC9cbiAgICAgICAgICAgIE1hdGgubWF4KGFuc3dlckxpbmVzLmxlbmd0aCwgc29sdXRpb25MaW5lcy5sZW5ndGgpO1xuICAgICAgICBpZiAoYW5zd2VyTGluZXMubGVuZ3RoIDwgc29sdXRpb25MaW5lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHN0YXRlID0gXCJpbmNvcnJlY3RUb29TaG9ydFwiO1xuICAgICAgICAgICAgdGhpcy5jb3JyZWN0TGVuZ3RoID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAoYW5zd2VyTGluZXMubGVuZ3RoID09IHNvbHV0aW9uTGluZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3RMZW5ndGggPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUgPSBcImluY29ycmVjdE1vdmVCbG9ja3NcIjtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdExlbmd0aCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGNvZGUgKip0aGF0IGlzIHRoZXJlKiogaXMgaW4gdGhlIGNvcnJlY3Qgb3JkZXJcbiAgICAgICAgLy8gSWYgdGhlcmUgaXMgdG9vIG11Y2ggb3IgdG9vIGxpdHRsZSBjb2RlIHRoaXMgb25seSBtYXR0ZXJzIGZvclxuICAgICAgICAvLyBjYWxjdWxhdGluZyBhIHBlcmNlbnRhZ2Ugc2NvcmUuXG4gICAgICAgIGxldCBpc0NvcnJlY3RPcmRlciA9IHRoaXMuY2hlY2tDb3JyZWN0T3JkZXJpbmcoc29sdXRpb25MaW5lcywgYW5zd2VyTGluZXMpXG5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgYmxvY2tzIGFyZSBpbmRlbnRlZCBjb3JyZWN0bHlcbiAgICAgICAgbGV0IGlzQ29ycmVjdEluZGVudHMgPSB0aGlzLmNoZWNrQ29ycmVjdEluZGVudGF0aW9uKHNvbHV0aW9uTGluZXMsIGFuc3dlckxpbmVzKTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBpc0NvcnJlY3RJbmRlbnRzICYmXG4gICAgICAgICAgICBpc0NvcnJlY3RPcmRlciAmJlxuICAgICAgICAgICAgdGhpcy5jb3JyZWN0TGVuZ3RoXG4gICAgICAgICkge1xuICAgICAgICAgICAgLy8gUGVyZmVjdFxuICAgICAgICAgICAgc3RhdGUgPSBcImNvcnJlY3RcIjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvcnJlY3RMZW5ndGggJiYgaXNDb3JyZWN0T3JkZXIpIHtcbiAgICAgICAgICAgIHN0YXRlID0gXCJpbmNvcnJlY3RJbmRlbnRcIjtcbiAgICAgICAgfSBlbHNlIGlmICghaXNDb3JyZWN0T3JkZXIgJiYgc3RhdGUgIT0gXCJpbmNvcnJlY3RUb29TaG9ydFwiKSB7XG4gICAgICAgICAgICBzdGF0ZSA9IFwiaW5jb3JyZWN0TW92ZUJsb2Nrc1wiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlUGVyY2VudCgpO1xuICAgICAgICB0aGlzLmdyYWRlclN0YXRlID0gc3RhdGU7XG5cbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIGNoZWNrQ29ycmVjdEluZGVudGF0aW9uKHNvbHV0aW9uTGluZXMsIGFuc3dlckxpbmVzKSB7XG4gICAgICAgIHRoaXMuaW5kZW50TGVmdCA9IFtdO1xuICAgICAgICB0aGlzLmluZGVudFJpZ2h0ID0gW107XG4gICAgICAgIGxldCBsb29wTGltaXQgPSBNYXRoLm1pbihzb2x1dGlvbkxpbmVzLmxlbmd0aCwgYW5zd2VyTGluZXMubGVuZ3RoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb29wTGltaXQ7IGkrKykge1xuICAgICAgICAgICAgaWYgKGFuc3dlckxpbmVzW2ldLnZpZXdJbmRlbnQoKSA8IGFuc3dlckxpbmVzW2ldLmluZGVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50UmlnaHQucHVzaChhbnN3ZXJMaW5lc1tpXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFuc3dlckxpbmVzW2ldLnZpZXdJbmRlbnQoKSA+IHNvbHV0aW9uTGluZXNbaV0uaW5kZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRlbnRMZWZ0LnB1c2goYW5zd2VyTGluZXNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5jb3JyZWN0SW5kZW50cyA9XG4gICAgICAgICAgICB0aGlzLmluZGVudExlZnQubGVuZ3RoICsgdGhpcy5pbmRlbnRSaWdodC5sZW5ndGg7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuaW5jb3JyZWN0SW5kZW50cyA9PSAwO1xuICAgIH1cblxuICAgIGNoZWNrQ29ycmVjdE9yZGVyaW5nKHNvbHV0aW9uTGluZXMsIGFuc3dlckxpbmVzKSB7XG4gICAgICAgIGxldCBpc0NvcnJlY3RPcmRlciA9IHRydWU7XG4gICAgICAgIHRoaXMuY29ycmVjdExpbmVzID0gMDtcbiAgICAgICAgdGhpcy5zb2x1dGlvbkxlbmd0aCA9IHNvbHV0aW9uTGluZXMubGVuZ3RoO1xuICAgICAgICBsZXQgbG9vcExpbWl0ID0gTWF0aC5taW4oc29sdXRpb25MaW5lcy5sZW5ndGgsIGFuc3dlckxpbmVzLmxlbmd0aCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbG9vcExpbWl0OyBpKyspIHtcbiAgICAgICAgICAgIGlmIChhbnN3ZXJMaW5lc1tpXS50ZXh0ICE9PSBzb2x1dGlvbkxpbmVzW2ldLnRleHQpIHtcbiAgICAgICAgICAgICAgICBpc0NvcnJlY3RPcmRlciA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3RMaW5lcyArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc0NvcnJlY3RPcmRlclxuICAgIH1cblxuICAgIGNhbGN1bGF0ZVBlcmNlbnQoKSB7XG4gICAgICAgIGxldCBudW1MaW5lcyA9IHRoaXMucGVyY2VudExpbmVzICogMC4yO1xuICAgICAgICBsZXQgbGluZXMgPSB0aGlzLnByb2JsZW0uYW5zd2VyTGluZXMoKS5sZW5ndGg7XG4gICAgICAgIGxldCBudW1Db3JyZWN0QmxvY2tzID0gKHRoaXMuY29ycmVjdExpbmVzIC8gbGluZXMpICogMC40O1xuICAgICAgICBsZXQgbnVtQ29ycmVjdEluZGVudHMgPVxuICAgICAgICAgICAgKCh0aGlzLmNvcnJlY3RMaW5lcyAtIHRoaXMuaW5jb3JyZWN0SW5kZW50cykgLyBsaW5lcykgKiAwLjQ7XG5cbiAgICAgICAgdGhpcy5wcm9ibGVtLnBlcmNlbnQgPSBudW1MaW5lcyArIG51bUNvcnJlY3RCbG9ja3MgKyBudW1Db3JyZWN0SW5kZW50cztcbiAgICB9XG59XG4iLCIkLmkxOG4oKS5sb2FkKHtcbiAgICBlbjoge1xuICAgICAgICBtc2dfcGFyc29uX2NoZWNrX21lOiBcIkNoZWNrXCIsXG4gICAgICAgIG1zZ19wYXJzb25fcmVzZXQ6IFwiUmVzZXRcIixcbiAgICAgICAgbXNnX3BhcnNvbl9oZWxwOiBcIkhlbHAgbWVcIixcbiAgICAgICAgbXNnX3BhcnNvbl90b29fc2hvcnQ6IFwiWW91ciBhbnN3ZXIgaXMgdG9vIHNob3J0LiBBZGQgbW9yZSBibG9ja3MuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fZHJhZ19mcm9tX2hlcmU6IFwiRHJhZyBmcm9tIGhlcmVcIixcbiAgICAgICAgbXNnX3BhcnNvbl9kcmFnX3RvX2hlcmU6IFwiRHJvcCBibG9ja3MgaGVyZVwiLFxuICAgICAgICBtc2dfcGFyc29uX2NvcnJlY3RfZmlyc3RfdHJ5OlxuICAgICAgICAgICAgXCJQZXJmZWN0ISAgSXQgdG9vayB5b3Ugb25seSBvbmUgdHJ5IHRvIHNvbHZlIHRoaXMuICBHcmVhdCBqb2IhXCIsXG4gICAgICAgIG1zZ19wYXJzb25fY29ycmVjdDpcbiAgICAgICAgICAgIFwiUGVyZmVjdCEgIEl0IHRvb2sgeW91ICQxIHRyaWVzIHRvIHNvbHZlIHRoaXMuICBDbGljayBSZXNldCB0byB0cnkgdG8gc29sdmUgaXQgaW4gb25lIGF0dGVtcHQuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd3JvbmdfaW5kZW50OlxuICAgICAgICAgICAgXCJUaGlzIGJsb2NrIGlzIG5vdCBpbmRlbnRlZCBjb3JyZWN0bHkuIEVpdGhlciBpbmRlbnQgaXQgbW9yZSBieSBkcmFnZ2luZyBpdCByaWdodCBvciByZWR1Y2UgdGhlIGluZGVudGlvbiBieSBkcmFnZ2luZyBpdCBsZWZ0LlwiLFxuICAgICAgICBtc2dfcGFyc29uX3dyb25nX2luZGVudHM6XG4gICAgICAgICAgICBcIlRoZXNlIGJsb2NrcyBhcmUgbm90IGluZGVudGVkIGNvcnJlY3RseS4gVG8gaW5kZW50IGEgYmxvY2sgbW9yZSwgZHJhZyBpdCB0byB0aGUgcmlnaHQuIFRvIHJlZHVjZSB0aGUgaW5kZW50aW9uLCBkcmFnIGl0IHRvIHRoZSBsZWZ0LlwiLFxuICAgICAgICBtc2dfcGFyc29uX3dyb25nX29yZGVyOlxuICAgICAgICAgICAgXCJIaWdobGlnaHRlZCBibG9ja3MgaW4geW91ciBhbnN3ZXIgYXJlIHdyb25nIG9yIGFyZSBpbiB0aGUgd3Jvbmcgb3JkZXIuIFRoaXMgY2FuIGJlIGZpeGVkIGJ5IG1vdmluZywgcmVtb3ZpbmcsIG9yIHJlcGxhY2luZyBoaWdobGlnaHRlZCBibG9ja3MuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fYXJyb3dfbmF2aWdhdGU6XG4gICAgICAgICAgICBcIkFycm93IGtleXMgdG8gbmF2aWdhdGUuIFNwYWNlIHRvIHNlbGVjdCAvIGRlc2VsZWN0IGJsb2NrIHRvIG1vdmUuXCIsXG4gICAgICAgIG1zZ19wYXJzb25faGVscF9pbmZvOlxuICAgICAgICAgICAgXCJDbGljayBvbiB0aGUgSGVscCBNZSBidXR0b24gaWYgeW91IHdhbnQgdG8gbWFrZSB0aGUgcHJvYmxlbSBlYXNpZXJcIixcbiAgICAgICAgbXNnX3BhcnNvbl9ub3Rfc29sdXRpb246XG4gICAgICAgICAgICBcIkRpc2FibGVkIGFuIHVubmVlZGVkIGNvZGUgYmxvY2sgKG9uZSB0aGF0IGlzIG5vdCBwYXJ0IG9mIHRoZSBzb2x1dGlvbikuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fcHJvdmlkZWRfaW5kZW50OiBcIlByb3ZpZGVkIHRoZSBpbmRlbnRhdGlvbi5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9jb21iaW5lZF9ibG9ja3M6IFwiQ29tYmluZWQgdHdvIGNvZGUgYmxvY2tzIGludG8gb25lLlwiLFxuICAgICAgICBtc2dfcGFyc29uX3JlbW92ZV9pbmNvcnJlY3Q6XG4gICAgICAgICAgICBcIldpbGwgcmVtb3ZlIGFuIGluY29ycmVjdCBjb2RlIGJsb2NrIGZyb20gYW5zd2VyIGFyZWFcIixcbiAgICAgICAgbXNnX3BhcnNvbl93aWxsX2NvbWJpbmU6IFwiV2lsbCBjb21iaW5lIHR3byBibG9ja3NcIixcbiAgICAgICAgbXNnX3BhcnNvbl9hdGxlYXN0X3RocmVlX2F0dGVtcHRzOlxuICAgICAgICAgICAgXCJZb3UgbXVzdCBtYWtlIGF0IGxlYXN0IHRocmVlIGRpc3RpbmN0IGZ1bGwgYXR0ZW1wdHMgYXQgYSBzb2x1dGlvbiBiZWZvcmUgeW91IGNhbiBnZXQgaGVscFwiLFxuICAgICAgICBtc2dfcGFyc29uX3RocmVlX2Jsb2Nrc19sZWZ0OlxuICAgICAgICAgICAgXCJUaGVyZSBhcmUgb25seSAzIGNvcnJlY3QgYmxvY2tzIGxlZnQuICBZb3Ugc2hvdWxkIGJlIGFibGUgdG8gcHV0IHRoZW0gaW4gb3JkZXJcIixcbiAgICAgICAgbXNnX3BhcnNvbl93aWxsX3Byb3ZpZGVfaW5kZW50OiBcIldpbGwgcHJvdmlkZSBpbmRlbnRhdGlvblwiLFxuICAgIH0sXG59KTtcbiIsIiQuaTE4bigpLmxvYWQoe1xuICAgIFwicHQtYnJcIjoge1xuICAgICAgICBtc2dfcGFyc29uX2NoZWNrX21lOiBcIlZlcmlmaWNhclwiLFxuICAgICAgICBtc2dfcGFyc29uX3Jlc2V0OiBcIlJlc2V0YXJcIixcbiAgICAgICAgbXNnX3BhcnNvbl9oZWxwOlwiQWp1ZGFcIixcbiAgICAgICAgbXNnX3BhcnNvbl90b29fc2hvcnQ6IFwiU2V1IHByb2dyYW1hIMOpIG11aXRvIGN1cnRvLiBBZGljaW9uZSBtYWlzIGJsb2Nvcy5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9kcmFnX2Zyb21faGVyZTogXCJBcnJhc3RlIGRhcXVpXCIsXG4gICAgICAgIG1zZ19wYXJzb25fZHJhZ190b19oZXJlOiBcIkxhcmd1ZSBvcyBibG9jb3MgYXF1aVwiLFxuICAgICAgICBtc2dfcGFyc29uX2NvcnJlY3RfZmlyc3RfdHJ5OlxuICAgICAgICAgICAgXCJQZXJmZWl0byEgVm9jw6ogbGV2b3UgYXBlbmFzIHVtYSB0ZW50YXRpdmEgcGFyYSByZXNvbHZlci4gQm9tIHRyYWJhbGhvIVwiLFxuICAgICAgICBtc2dfcGFyc29uX2NvcnJlY3Q6XG4gICAgICAgICAgICBcIlBlcmZlaXRvISBWb2PDqiBsZXZvdSAkMSB0ZW50YXRpdmFzIHBhcmEgcmVzb2x2ZXIuIENsaXF1ZSBlbSBSZXNldGFyIHBhcmEgdGVudGFyIHJlc29sdmVyIGVtIHVtYSB0ZW50YXRpdmEuXCIgLFxuICAgICAgICBtc2dfcGFyc29uX3dyb25nX2luZGVudDpcbiAgICAgICAgICAgIFwiRXN0ZSBibG9jbyBuw6NvIGVzdMOhIGluZGVudGFkbyBjb3JyZXRhbWVudGUuIEluZGVudGUgbWFpcyBhcnJhc3RhbmRvLW8gcGFyYSBhIGRpcmVpdGEgb3UgcmVkdXphIGEgaW5kZW50YcOnw6NvIGFycmFzdGFuZG8gcGFyYSBhIGVzcXVlcmRhLlwiLFxuICAgICAgICBtc2dfcGFyc29uX3dyb25nX2luZGVudHM6XG4gICAgICAgICAgICBcIkVzdGVzIGJsb2NvcyBuw6NvIGVzdMOjbyBpbmRlbnRhZG9zIGNvcnJldGFtZW50ZS4gUGFyYSBpbmRlbnRhciBtYWlzLCBhcnJhc3RlIG8gYmxvY28gcGFyYSBhIGRpcmVpdGEuIFBhcmEgcmVkdXppciBhIGluZGVudGHDp8OjbywgYXJyYXN0ZSBwYXJhIGEgZXNxdWVyZGEuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd3Jvbmdfb3JkZXI6XG4gICAgICAgICAgICBcIkJsb2NvcyBkZXN0YWNhZG9zIG5vIHNldSBwcm9ncmFtYSBlc3TDo28gZXJyYWRvcyBvdSBlc3TDo28gbmEgb3JkZW0gZXJyYWRhLiBJc3NvIHBvZGUgc2VyIHJlc29sdmlkbyBtb3ZlbmRvLCBleGNsdWluZG8gb3Ugc3Vic3RpdHVpbmRvIG9zIGJsb2NvcyBkZXN0YWNhZG9zLlwiLFxuICAgICAgICBtc2dfcGFyc29uX2Fycm93X25hdmlnYXRlOlxuICAgICAgICAgICAgXCJVc2UgYXMgdGVjbGFzIGRlIHNldGFzIHBhcmEgbmF2ZWdhci4gRXNwYcOnbyBwYXJhIHNlbGVjaW9uYXIvIGRlc21hcmNhciBibG9jb3MgcGFyYSBtb3Zlci5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9oZWxwX2luZm86XG4gICAgICAgICAgICBcIkNsaXF1ZSBubyBib3TDo28gQWp1ZGEgc2Ugdm9jw6ogcXVpc2VyIGZhY2lsaXRhciBvIHByb2JsZW1hXCIsXG4gICAgICAgIG1zZ19wYXJzb25fbm90X3NvbHV0aW9uOlxuICAgICAgICAgICAgXCJGb2kgZGVzYWJpbGl0YWRvIHVtIGJsb2NvIGRlIGPDs2RpZ28gZGVzbmVjZXNzw6FyaW8gKHF1ZSBuw6NvIGZheiBwYXJ0ZSBkYSBzb2x1w6fDo28pLlwiLFxuICAgICAgICBtc2dfcGFyc29uX3Byb3ZpZGVkX2luZGVudDpcIkZvaSBmb3JuZWNpZGEgYSBpbmRlbnRhw6fDo28uXCIsXG4gICAgICAgIG1zZ19wYXJzb25fY29tYmluZWRfYmxvY2tzOlwiRG9pcyBibG9jb3MgZGUgY8OzZGlnb3MgZm9yYW0gY29tYmluYWRvcyBlbSB1bS5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9yZW1vdmVfaW5jb3JyZWN0OlxuICAgICAgICAgICAgXCJTZXLDoSByZW1vdmlkbyB1bSBibG9jbyBkZSBjw7NkaWdvIGluY29ycmV0byBkYSDDoXJlYSBkZSByZXNwb3N0YVwiLFxuICAgICAgICBtc2dfcGFyc29uX3dpbGxfY29tYmluZTpcIlNlcsOjbyBjb21iaW5hZG9zIGRvaXMgYmxvY29zXCIsXG4gICAgICAgIG1zZ19wYXJzb25fYXRsZWFzdF90aHJlZV9hdHRlbXB0czpcbiAgICAgICAgICAgIFwiVm9jw6ogZGV2ZSB0ZW50YXIgcGVsbyBtZW5vcyB0csOqcyB2ZXplcyBhbnRlcyBkZSBwZWRpciBhanVkYVwiLFxuICAgICAgICBtc2dfcGFyc29uX3RocmVlX2Jsb2Nrc19sZWZ0OlxuICAgICAgICAgICAgXCJSZXN0YW0gYXBlbmFzIDMgYmxvY29zIGNvcnJldG9zLiBWb2PDqiBkZXZlIGNvbG9jw6EtbG9zIGVtIG9yZGVtXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd2lsbF9wcm92aWRlX2luZGVudDogXCJTZXLDoSBmb3JuZWNpZGEgYSBpbmRlbnRhw6fDo29cIlxuICAgIH0sXG59KTtcbiIsIi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PSBQYXJzb25zIFJ1bmVzdG9uZSBEaXJlY3RpdmUgSmF2YXNjcmlwdCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09PSBSZW5kZXJzIGEgUGFyc29ucyBwcm9ibGVtIGJhc2VkIG9uIHRoZSBIVE1MIGNyZWF0ZWQgYnkgdGhlXG49PT09PT09PSBwYXJzb25zLnB5IHNjcmlwdCBhbmQgdGhlIFJTVCBmaWxlLlxuPT09PSBDT05UUklCVVRPUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09PSBJc2FpYWggTWF5ZXJjaGFrXG49PT09PT09PSBKZWZmIFJpY2tcbj09PT09PT09IEJhcmJhcmEgRXJpY3NvblxuPT09PT09PT0gQ29sZSBCb3dlcnNcbj09PT0gQWRhcHRlZCBmb3JtIHRoZSBvcmlnaW5hbCBKUyBQYXJzb25zIGJ5ID09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gVmlsbGUgS2FyYXZpcnRhXG49PT09PT09PSBQZXRyaSBJaGFudG9sYVxuPT09PT09PT0gSnVoYSBIZWxtaW5lblxuPT09PT09PT0gTWlrZSBIZXduZXJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09IExpbmVCYXNlZEdyYWRlciBPYmplY3QgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09IFVzZWQgZm9yIGdyYWRpbmcgYSBQYXJzb25zIHByb2JsZW0uXG49PT09IFBST1BFUlRJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09IHByb2JsZW06IHRoZSBQYXJzb25zIHByb2JsZW1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qc1wiO1xuaW1wb3J0IFwiLi9wYXJzb25zLWkxOG4uZW4uanNcIjtcbmltcG9ydCBcIi4vcGFyc29ucy1pMThuLnB0LWJyLmpzXCI7XG5pbXBvcnQgXCIuL3ByZXR0aWZ5LmpzXCI7XG5pbXBvcnQgXCIuLi9jc3MvcGFyc29ucy5jc3NcIjtcbmltcG9ydCBcIi4uL2Nzcy9wcmV0dGlmeS5jc3NcIjtcbmltcG9ydCBMaW5lQmFzZWRHcmFkZXIgZnJvbSBcIi4vbGluZUdyYWRlclwiO1xuaW1wb3J0IERBR0dyYWRlciBmcm9tIFwiLi9kYWdHcmFkZXJcIjtcbmltcG9ydCBQYXJzb25zTGluZSBmcm9tIFwiLi9wYXJzb25zTGluZVwiO1xuaW1wb3J0IFBhcnNvbnNCbG9jayBmcm9tIFwiLi9wYXJzb25zQmxvY2tcIjtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09IFBhcnNvbnMgT2JqZWN0ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09IFRoZSBtb2RlbCBhbmQgdmlldyBvZiBhIFBhcnNvbnMgcHJvYmxlbSBiYXNlZCBvbiB3aGF0IGlzXG49PT09PT09PSBzcGVjaWZpZWQgaW4gdGhlIEhUTUwsIHdoaWNoIGlzIGJhc2VkIG9uIHdoYXQgaXMgc3BlY2lmaWVkXG49PT09PT09PSBpbiB0aGUgUlNUIGZpbGVcbj09PT0gUFJPUEVSVElFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gb3B0aW9uczogb3B0aW9ucyBsYXJnZWx5IHNwZWNpZmllZCBmcm9tIHRoZSBIVE1MXG49PT09PT09PSBncmFkZXI6IGEgTGluZUdyYWRlciBmb3IgZ3JhZGluZyB0aGUgcHJvYmxlbVxuPT09PT09PT0gbGluZXM6IGFuIGFycmF5IG9mIGFsbCBQYXJzb25zTGluZSBhcyBzcGVjaWZpZWQgaW4gdGhlIHByb2JsZW1cbj09PT09PT09IHNvbHV0aW9uOiBhbiBhcnJheSBvZiBQYXJzb25zTGluZSBpbiB0aGUgc29sdXRpb25cbj09PT09PT09IGJsb2NrczogdGhlIGN1cnJlbnQgYmxvY2tzXG49PT09PT09PSBzb3VyY2VBcmVhOiB0aGUgZWxlbWVudCB0aGF0IGNvbnRhaW5zIHRoZSBzb3VyY2UgYmxvY2tzXG49PT09PT09PSBhbnN3ZXJBcmVhOiB0aGUgZWxlbWVudCB0aGF0IGNvbnRhaW5zIHRoZSBhbnN3ZXIgYmxvY2tzXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09IElOSVRJQUxJWkFUSU9OID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5leHBvcnQgdmFyIHByc0xpc3QgPSB7fTsgLy8gUGFyc29ucyBkaWN0aW9uYXJ5XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJzb25zIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdmFyIG9yaWcgPSBvcHRzLm9yaWc7IC8vIGVudGlyZSA8cHJlPiBlbGVtZW50IHRoYXQgd2lsbCBiZSByZXBsYWNlZCBieSBuZXcgSFRNTFxuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IG9yaWc7XG4gICAgICAgIHRoaXMub3JpZ0VsZW0gPSAkKG9yaWcpLmZpbmQoXCJwcmUucGFyc29uc2Jsb2Nrc1wiKVswXTtcbiAgICAgICAgLy8gRmluZCB0aGUgcXVlc3Rpb24gdGV4dCBhbmQgc3RvcmUgaXQgaW4gLnF1ZXN0aW9uXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSAkKG9yaWcpLmZpbmQoYC5wYXJzb25zX3F1ZXN0aW9uYClbMF07XG4gICAgICAgIHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMgPSBvcHRzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzO1xuICAgICAgICB0aGlzLmRpdmlkID0gb3B0cy5vcmlnLmlkO1xuICAgICAgICAvLyBTZXQgdGhlIHN0b3JhZ2VJZCAoa2V5IGZvciBzdG9yaW5nIGRhdGEpXG4gICAgICAgIHZhciBzdG9yYWdlSWQgPSBzdXBlci5sb2NhbFN0b3JhZ2VLZXkoKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlSWQgPSBzdG9yYWdlSWQ7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSB0aGlzLm9yaWdFbGVtLmNoaWxkTm9kZXM7IC8vIHRoaXMgY29udGFpbnMgYWxsIG9mIHRoZSBjaGlsZCBlbGVtZW50cyBvZiB0aGUgZW50aXJlIHRhZy4uLlxuICAgICAgICB0aGlzLmNvbnRlbnRBcnJheSA9IFtdO1xuICAgICAgICBQYXJzb25zLmNvdW50ZXIrKzsgLy8gICAgVW5pcXVlIGlkZW50aWZpZXJcbiAgICAgICAgdGhpcy5jb3VudGVySWQgPSBcInBhcnNvbnMtXCIgKyBQYXJzb25zLmNvdW50ZXI7XG5cbiAgICAgICAgLy8gZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vICAgICBpZiAoJCh0aGlzLmNoaWxkcmVuW2ldKS5pcyhcIltkYXRhLXF1ZXN0aW9uXVwiKSkge1xuICAgICAgICAvLyAgICAgICAgIHRoaXMucXVlc3Rpb24gPSB0aGlzLmNoaWxkcmVuW2ldO1xuICAgICAgICAvLyAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZU9wdGlvbnMoKTtcbiAgICAgICAgdGhpcy5ncmFkZXIgPVxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmdyYWRlciA9PT0gXCJkYWdcIiA/XG4gICAgICAgICAgICBuZXcgREFHR3JhZGVyKHRoaXMpIDpcbiAgICAgICAgICAgIG5ldyBMaW5lQmFzZWRHcmFkZXIodGhpcyk7XG4gICAgICAgIHRoaXMuZ3JhZGVyLnNob3dmZWVkYmFjayA9IHRoaXMuc2hvd2ZlZWRiYWNrO1xuICAgICAgICB2YXIgZnVsbHRleHQgPSAkKHRoaXMub3JpZ0VsZW0pLmh0bWwoKTtcbiAgICAgICAgdGhpcy5ibG9ja0luZGV4ID0gMDtcbiAgICAgICAgdGhpcy5jaGVja0NvdW50ID0gMDtcbiAgICAgICAgdGhpcy5udW1EaXN0aW5jdCA9IDA7XG4gICAgICAgIHRoaXMuaGFzU29sdmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUxpbmVzKGZ1bGx0ZXh0LnRyaW0oKSk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVZpZXcoKTtcbiAgICAgICAgdGhpcy5jYXB0aW9uID0gXCJQYXJzb25zXCI7XG4gICAgICAgIHRoaXMuYWRkQ2FwdGlvbihcInJ1bmVzdG9uZVwiKTtcbiAgICAgICAgLy8gQ2hlY2sgdGhlIHNlcnZlciBmb3IgYW4gYW5zd2VyIHRvIGNvbXBsZXRlIHRoaW5nc1xuICAgICAgICB0aGlzLmNoZWNrU2VydmVyKFwicGFyc29uc1wiLCB0cnVlKTtcbiAgICAgICAgaWYgKHR5cGVvZiBQcmlzbSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgUHJpc20uaGlnaGxpZ2h0QWxsVW5kZXIodGhpcy5jb250YWluZXJEaXYpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEJhc2VkIG9uIHRoZSBkYXRhLWZpZWxkcyBpbiB0aGUgb3JpZ2luYWwgSFRNTCwgaW5pdGlhbGl6ZSBvcHRpb25zXG4gICAgaW5pdGlhbGl6ZU9wdGlvbnMoKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgcGl4ZWxzUGVySW5kZW50OiAzMCxcbiAgICAgICAgfTtcbiAgICAgICAgLy8gYWRkIG1heGRpc3QgYW5kIG9yZGVyIGlmIHByZXNlbnRcbiAgICAgICAgdmFyIG1heGRpc3QgPSAkKHRoaXMub3JpZ0VsZW0pLmRhdGEoXCJtYXhkaXN0XCIpO1xuICAgICAgICB2YXIgb3JkZXIgPSAkKHRoaXMub3JpZ0VsZW0pLmRhdGEoXCJvcmRlclwiKTtcbiAgICAgICAgdmFyIG5vaW5kZW50ID0gJCh0aGlzLm9yaWdFbGVtKS5kYXRhKFwibm9pbmRlbnRcIik7XG4gICAgICAgIHZhciBhZGFwdGl2ZSA9ICQodGhpcy5vcmlnRWxlbSkuZGF0YShcImFkYXB0aXZlXCIpO1xuICAgICAgICB2YXIgbnVtYmVyZWQgPSAkKHRoaXMub3JpZ0VsZW0pLmRhdGEoXCJudW1iZXJlZFwiKTtcbiAgICAgICAgdmFyIGdyYWRlciA9ICQodGhpcy5vcmlnRWxlbSkuZGF0YShcImdyYWRlclwiKTtcbiAgICAgICAgb3B0aW9uc1tcIm51bWJlcmVkXCJdID0gbnVtYmVyZWQ7XG4gICAgICAgIG9wdGlvbnNbXCJncmFkZXJcIl0gPSBncmFkZXI7XG4gICAgICAgIGlmIChtYXhkaXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG9wdGlvbnNbXCJtYXhkaXN0XCJdID0gbWF4ZGlzdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3JkZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gY29udmVydCBvcmRlciBzdHJpbmcgdG8gYXJyYXkgb2YgbnVtYmVyc1xuICAgICAgICAgICAgb3JkZXIgPSBvcmRlci5tYXRjaCgvXFxkKy9nKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3JkZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBvcmRlcltpXSA9IHBhcnNlSW50KG9yZGVyW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wdGlvbnNbXCJvcmRlclwiXSA9IG9yZGVyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2luZGVudCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG5vaW5kZW50ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9uc1tcIm5vaW5kZW50XCJdID0gbm9pbmRlbnQ7XG4gICAgICAgIHRoaXMubm9pbmRlbnQgPSBub2luZGVudDtcbiAgICAgICAgaWYgKGFkYXB0aXZlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgYWRhcHRpdmUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmIChhZGFwdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplQWRhcHRpdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zW1wiYWRhcHRpdmVcIl0gPSBhZGFwdGl2ZTtcbiAgICAgICAgLy8gYWRkIGxvY2FsZSBhbmQgbGFuZ3VhZ2VcbiAgICAgICAgdmFyIGxvY2FsZSA9IGVCb29rQ29uZmlnLmxvY2FsZTtcbiAgICAgICAgaWYgKGxvY2FsZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGxvY2FsZSA9IFwiZW5cIjtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zW1wibG9jYWxlXCJdID0gbG9jYWxlO1xuICAgICAgICB2YXIgbGFuZ3VhZ2UgPSAkKHRoaXMub3JpZ0VsZW0pLmRhdGEoXCJsYW5ndWFnZVwiKTtcbiAgICAgICAgaWYgKGxhbmd1YWdlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbGFuZ3VhZ2UgPSBlQm9va0NvbmZpZy5sYW5ndWFnZTtcbiAgICAgICAgICAgIGlmIChsYW5ndWFnZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBsYW5ndWFnZSA9IFwicHl0aG9uXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9uc1tcImxhbmd1YWdlXCJdID0gbGFuZ3VhZ2U7XG4gICAgICAgIHZhciBwcmV0dGlmeUxhbmd1YWdlID0ge1xuICAgICAgICAgICAgcHl0aG9uOiBcInByZXR0eXByaW50IGxhbmctcHlcIixcbiAgICAgICAgICAgIGphdmE6IFwicHJldHR5cHJpbnQgbGFuZy1qYXZhXCIsXG4gICAgICAgICAgICBqYXZhc2NyaXB0OiBcInByZXR0eXByaW50IGxhbmctanNcIixcbiAgICAgICAgICAgIGh0bWw6IFwicHJldHR5cHJpbnQgbGFuZy1odG1sXCIsXG4gICAgICAgICAgICBjOiBcInByZXR0eXByaW50IGxhbmctY1wiLFxuICAgICAgICAgICAgXCJjKytcIjogXCJwcmV0dHlwcmludCBsYW5nLWNwcFwiLFxuICAgICAgICAgICAgcnVieTogXCJwcmV0dHlwcmludCBsYW5nLXJiXCIsXG4gICAgICAgIH0gW2xhbmd1YWdlXTtcbiAgICAgICAgaWYgKHByZXR0aWZ5TGFuZ3VhZ2UgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwcmV0dGlmeUxhbmd1YWdlID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zW1wicHJldHRpZnlMYW5ndWFnZVwiXSA9IHByZXR0aWZ5TGFuZ3VhZ2U7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfVxuICAgIC8vIEJhc2VkIG9uIHdoYXQgaXMgc3BlY2lmaWVkIGluIHRoZSBvcmlnaW5hbCBIVE1MLCBjcmVhdGUgdGhlIEhUTUwgdmlld1xuICAgIGluaXRpYWxpemVWaWV3KCkge1xuICAgICAgICB0aGlzLm91dGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgJCh0aGlzLm91dGVyRGl2KS5hZGRDbGFzcyhcInBhcnNvbnNcIik7XG4gICAgICAgIHRoaXMub3V0ZXJEaXYuaWQgPSB0aGlzLmNvdW50ZXJJZDtcbiAgICAgICAgdGhpcy5wYXJzVGV4dERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICQodGhpcy5wYXJzVGV4dERpdikuYWRkQ2xhc3MoXCJwYXJzb25zLXRleHRcIik7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRUaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAkKHRoaXMua2V5Ym9hcmRUaXApLmF0dHIoXCJyb2xlXCIsIFwidG9vbHRpcFwiKTtcbiAgICAgICAgdGhpcy5rZXlib2FyZFRpcC5pZCA9IHRoaXMuY291bnRlcklkICsgXCItdGlwXCI7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRUaXAuaW5uZXJIVE1MID0gJC5pMThuKFwibXNnX3BhcnNvbl9hcnJvd19uYXZpZ2F0ZVwiKTtcbiAgICAgICAgdGhpcy5vdXRlckRpdi5hcHBlbmRDaGlsZCh0aGlzLmtleWJvYXJkVGlwKTtcbiAgICAgICAgJCh0aGlzLmtleWJvYXJkVGlwKS5oaWRlKCk7XG4gICAgICAgIHRoaXMuc29ydENvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICQodGhpcy5zb3J0Q29udGFpbmVyRGl2KS5hZGRDbGFzcyhcInNvcnRhYmxlLWNvZGUtY29udGFpbmVyXCIpO1xuICAgICAgICAkKHRoaXMuc29ydENvbnRhaW5lckRpdikuYXR0cihcbiAgICAgICAgICAgIFwiYXJpYS1kZXNjcmliZWRieVwiLFxuICAgICAgICAgICAgdGhpcy5jb3VudGVySWQgKyBcIi10aXBcIlxuICAgICAgICApO1xuICAgICAgICB0aGlzLm91dGVyRGl2LmFwcGVuZENoaWxkKHRoaXMuc29ydENvbnRhaW5lckRpdik7XG4gICAgICAgIHRoaXMuc291cmNlUmVnaW9uRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5zb3VyY2VSZWdpb25EaXYuaWQgPSB0aGlzLmNvdW50ZXJJZCArIFwiLXNvdXJjZVJlZ2lvblwiO1xuICAgICAgICAkKHRoaXMuc291cmNlUmVnaW9uRGl2KS5hZGRDbGFzcyhcInNvcnRhYmxlLWNvZGVcIik7XG4gICAgICAgIHRoaXMuc291cmNlTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAkKHRoaXMuc291cmNlTGFiZWwpLmF0dHIoXCJyb2xlXCIsIFwidG9vbHRpcFwiKTtcbiAgICAgICAgdGhpcy5zb3VyY2VMYWJlbC5pZCA9IHRoaXMuY291bnRlcklkICsgXCItc291cmNlVGlwXCI7XG4gICAgICAgIHRoaXMuc291cmNlTGFiZWwuaW5uZXJIVE1MID0gJC5pMThuKFwibXNnX3BhcnNvbl9kcmFnX2Zyb21faGVyZVwiKTtcbiAgICAgICAgdGhpcy5zb3VyY2VSZWdpb25EaXYuYXBwZW5kQ2hpbGQodGhpcy5zb3VyY2VMYWJlbCk7XG4gICAgICAgIHRoaXMuc29ydENvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnNvdXJjZVJlZ2lvbkRpdik7XG4gICAgICAgIHRoaXMuc291cmNlQXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuc291cmNlQXJlYS5pZCA9IHRoaXMuY291bnRlcklkICsgXCItc291cmNlXCI7XG4gICAgICAgICQodGhpcy5zb3VyY2VBcmVhKS5hZGRDbGFzcyhcInNvdXJjZVwiKTtcbiAgICAgICAgJCh0aGlzLnNvdXJjZUFyZWEpLmF0dHIoXG4gICAgICAgICAgICBcImFyaWEtZGVzY3JpYmVkYnlcIixcbiAgICAgICAgICAgIHRoaXMuY291bnRlcklkICsgXCItc291cmNlVGlwXCJcbiAgICAgICAgKTtcbiAgICAgICAgLy8gc2V0IHRoZSBzb3VyY2Ugd2lkdGggdG8gaXRzIG1heCB2YWx1ZS4gIFRoaXMgYWxsb3dzIHRoZSBibG9ja3MgdG8gYmUgY3JlYXRlZFxuICAgICAgICAvLyBhdCB0aGVpciBcIm5hdHVyYWxcIiBzaXplLiBBcyBsb25nIGFzIHRoYXQgaXMgc21hbGxlciB0aGFuIHRoZSBtYXguXG4gICAgICAgIC8vIFRoaXMgYWxsb3dzIHVzIHRvIHVzZSBzZW5zaWJsZSBmdW5jdGlvbnMgdG8gZGV0ZXJtaW5lIHRoZSBjb3JyZWN0IGhlaWdodHNcbiAgICAgICAgLy8gYW5kIHdpZHRocyBmb3IgdGhlIGRyYWcgYW5kIGRyb3AgYXJlYXMuXG4gICAgICAgIHRoaXMuc291cmNlQXJlYS5zdHlsZS53aWR0aCA9IFwiNDI1cHhcIiAvLyBUaGUgbWF4IGl0IHdpbGwgYmUgcmVzaXplZCBsYXRlci5cbiAgICAgICAgdGhpcy5zb3VyY2VSZWdpb25EaXYuYXBwZW5kQ2hpbGQodGhpcy5zb3VyY2VBcmVhKTtcbiAgICAgICAgdGhpcy5hbnN3ZXJSZWdpb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmFuc3dlclJlZ2lvbkRpdi5pZCA9IHRoaXMuY291bnRlcklkICsgXCItYW5zd2VyUmVnaW9uXCI7XG4gICAgICAgICQodGhpcy5hbnN3ZXJSZWdpb25EaXYpLmFkZENsYXNzKFwic29ydGFibGUtY29kZVwiKTtcbiAgICAgICAgdGhpcy5hbnN3ZXJMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICQodGhpcy5hbnN3ZXJMYWJlbCkuYXR0cihcInJvbGVcIiwgXCJ0b29sdGlwXCIpO1xuICAgICAgICB0aGlzLmFuc3dlckxhYmVsLmlkID0gdGhpcy5jb3VudGVySWQgKyBcIi1hbnN3ZXJUaXBcIjtcbiAgICAgICAgdGhpcy5hbnN3ZXJMYWJlbC5pbm5lckhUTUwgPSAkLmkxOG4oXCJtc2dfcGFyc29uX2RyYWdfdG9faGVyZVwiKTtcbiAgICAgICAgdGhpcy5hbnN3ZXJSZWdpb25EaXYuYXBwZW5kQ2hpbGQodGhpcy5hbnN3ZXJMYWJlbCk7XG4gICAgICAgIHRoaXMuc29ydENvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmFuc3dlclJlZ2lvbkRpdik7XG4gICAgICAgIHRoaXMuYW5zd2VyQXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuYW5zd2VyQXJlYS5pZCA9IHRoaXMuY291bnRlcklkICsgXCItYW5zd2VyXCI7XG4gICAgICAgICQodGhpcy5hbnN3ZXJBcmVhKS5hdHRyKFxuICAgICAgICAgICAgXCJhcmlhLWRlc2NyaWJlZGJ5XCIsXG4gICAgICAgICAgICB0aGlzLmNvdW50ZXJJZCArIFwiLWFuc3dlclRpcFwiXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuYW5zd2VyUmVnaW9uRGl2LmFwcGVuZENoaWxkKHRoaXMuYW5zd2VyQXJlYSk7XG4gICAgICAgIHRoaXMucGFyc29uc0NvbnRyb2xEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAkKHRoaXMucGFyc29uc0NvbnRyb2xEaXYpLmFkZENsYXNzKFwicGFyc29ucy1jb250cm9sc1wiKTtcbiAgICAgICAgdGhpcy5vdXRlckRpdi5hcHBlbmRDaGlsZCh0aGlzLnBhcnNvbnNDb250cm9sRGl2KTtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICB0aGlzLmNoZWNrQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgJCh0aGlzLmNoZWNrQnV0dG9uKS5hdHRyKFwiY2xhc3NcIiwgXCJidG4gYnRuLXN1Y2Nlc3NcIik7XG4gICAgICAgIHRoaXMuY2hlY2tCdXR0b24udGV4dENvbnRlbnQgPSAkLmkxOG4oXCJtc2dfcGFyc29uX2NoZWNrX21lXCIpO1xuICAgICAgICB0aGlzLmNoZWNrQnV0dG9uLmlkID0gdGhpcy5jb3VudGVySWQgKyBcIi1jaGVja1wiO1xuICAgICAgICB0aGlzLnBhcnNvbnNDb250cm9sRGl2LmFwcGVuZENoaWxkKHRoaXMuY2hlY2tCdXR0b24pO1xuICAgICAgICB0aGlzLmNoZWNrQnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgICB0aGlzLmNoZWNrQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoYXQuY2hlY2tDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICB0aGF0LmxvZ0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgICAgIHRoYXQucmVuZGVyRmVlZGJhY2soKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVzZXRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAkKHRoaXMucmVzZXRCdXR0b24pLmF0dHIoXCJjbGFzc1wiLCBcImJ0biBidG4tZGVmYXVsdFwiKTtcbiAgICAgICAgdGhpcy5yZXNldEJ1dHRvbi50ZXh0Q29udGVudCA9ICQuaTE4bihcIm1zZ19wYXJzb25fcmVzZXRcIik7XG4gICAgICAgIHRoaXMucmVzZXRCdXR0b24uaWQgPSB0aGlzLmNvdW50ZXJJZCArIFwiLXJlc2V0XCI7XG4gICAgICAgIHRoaXMucmVzZXRCdXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgIHRoaXMucGFyc29uc0NvbnRyb2xEaXYuYXBwZW5kQ2hpbGQodGhpcy5yZXNldEJ1dHRvbik7XG4gICAgICAgIHRoaXMucmVzZXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhhdC5jbGVhckZlZWRiYWNrKCk7XG4gICAgICAgICAgICAkKHRoYXQuY2hlY2tCdXR0b24pLnByb3AoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGF0LnJlc2V0VmlldygpO1xuICAgICAgICAgICAgdGhhdC5jaGVja0NvdW50ID0gMDtcbiAgICAgICAgICAgIHRoYXQubG9nTW92ZShcInJlc2V0XCIpO1xuICAgICAgICAgICAgdGhhdC5zZXRMb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYWRhcHRpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuaGVscEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICAgICAkKHRoaXMuaGVscEJ1dHRvbikuYXR0cihcImNsYXNzXCIsIFwiYnRuIGJ0bi1wcmltYXJ5XCIpO1xuICAgICAgICAgICAgdGhpcy5oZWxwQnV0dG9uLnRleHRDb250ZW50ID0gJC5pMThuKFwibXNnX3BhcnNvbl9oZWxwXCIpO1xuICAgICAgICAgICAgdGhpcy5oZWxwQnV0dG9uLmlkID0gdGhpcy5jb3VudGVySWQgKyBcIi1oZWxwXCI7XG4gICAgICAgICAgICB0aGlzLmhlbHBCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTsgLy8gYmplXG4gICAgICAgICAgICB0aGlzLnBhcnNvbnNDb250cm9sRGl2LmFwcGVuZENoaWxkKHRoaXMuaGVscEJ1dHRvbik7XG4gICAgICAgICAgICB0aGlzLmhlbHBCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGF0LmhlbHBNZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tZXNzYWdlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5tZXNzYWdlRGl2LmlkID0gdGhpcy5jb3VudGVySWQgKyBcIi1tZXNzYWdlXCI7XG4gICAgICAgIHRoaXMucGFyc29uc0NvbnRyb2xEaXYuYXBwZW5kQ2hpbGQodGhpcy5tZXNzYWdlRGl2KTtcbiAgICAgICAgJCh0aGlzLm1lc3NhZ2VEaXYpLmhpZGUoKTtcbiAgICAgICAgJCh0aGlzLm9yaWdFbGVtKS5yZXBsYWNlV2l0aCh0aGlzLm91dGVyRGl2KTtcbiAgICAgICAgJCh0aGlzLm91dGVyRGl2KS5jbG9zZXN0KFwiLnNxY29udGFpbmVyXCIpLmNzcyhcIm1heC13aWR0aFwiLCBcIm5vbmVcIik7XG4gICAgICAgIGlmICh0aGlzLm91dGVyRGl2KSB7XG4gICAgICAgICAgICBpZiAoJCh0aGlzLnF1ZXN0aW9uKS5odG1sKCkubWF0Y2goL15cXHMrJC8pKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLnF1ZXN0aW9uKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLm91dGVyRGl2KS5wcmVwZW5kKHRoaXMucXVlc3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEluaXRpYWxpemUgbGluZXMgYW5kIHNvbHV0aW9uIHByb3BlcnRpZXNcbiAgICBpbml0aWFsaXplTGluZXModGV4dCkge1xuICAgICAgICB0aGlzLmxpbmVzID0gW107XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgaW5pdGlhbCBibG9ja3NcbiAgICAgICAgdmFyIHRleHRCbG9ja3MgPSB0ZXh0LnNwbGl0KFwiLS0tXCIpO1xuICAgICAgICBpZiAodGV4dEJsb2Nrcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyAtLS0sIHRoZW4gZXZlcnkgbGluZSBpcyBpdHMgb3duIGJsb2NrXG4gICAgICAgICAgICB0ZXh0QmxvY2tzID0gdGV4dC5zcGxpdChcIlxcblwiKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc29sdXRpb24gPSBbXTtcbiAgICAgICAgdmFyIGluZGVudHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0QmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdGV4dEJsb2NrID0gdGV4dEJsb2Nrc1tpXTtcbiAgICAgICAgICAgIC8vIEZpZ3VyZSBvdXQgb3B0aW9ucyBiYXNlZCBvbiB0aGUgI29wdGlvblxuICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBvcHRpb25zIGZyb20gdGhlIGNvZGVcbiAgICAgICAgICAgIC8vIG9ubHkgb3B0aW9ucyBhcmUgI3BhaXJlZCBvciAjZGlzdHJhY3RvclxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgIHZhciBkaXN0cmFjdEluZGV4O1xuICAgICAgICAgICAgdmFyIGRpc3RyYWN0SGVscHRleHQgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIHRhZ0luZGV4O1xuICAgICAgICAgICAgdmFyIHRhZztcbiAgICAgICAgICAgIHZhciBkZXBlbmRzSW5kZXg7XG4gICAgICAgICAgICB2YXIgZGVwZW5kcyA9IFtdO1xuICAgICAgICAgICAgaWYgKHRleHRCbG9jay5pbmNsdWRlcyhcIiNwYWlyZWQ6XCIpKSB7XG4gICAgICAgICAgICAgICAgZGlzdHJhY3RJbmRleCA9IHRleHRCbG9jay5pbmRleE9mKFwiI3BhaXJlZDpcIik7XG4gICAgICAgICAgICAgICAgZGlzdHJhY3RIZWxwdGV4dCA9IHRleHRCbG9ja1xuICAgICAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKGRpc3RyYWN0SW5kZXggKyA4LCB0ZXh0QmxvY2subGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAudHJpbSgpO1xuICAgICAgICAgICAgICAgIHRleHRCbG9jayA9IHRleHRCbG9jay5zdWJzdHJpbmcoMCwgZGlzdHJhY3RJbmRleCArIDcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0ZXh0QmxvY2suaW5jbHVkZXMoXCIjZGlzdHJhY3RvcjpcIikpIHtcbiAgICAgICAgICAgICAgICBkaXN0cmFjdEluZGV4ID0gdGV4dEJsb2NrLmluZGV4T2YoXCIjZGlzdHJhY3RvcjpcIik7XG4gICAgICAgICAgICAgICAgZGlzdHJhY3RIZWxwdGV4dCA9IHRleHRCbG9ja1xuICAgICAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKGRpc3RyYWN0SW5kZXggKyAxMiwgdGV4dEJsb2NrLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgLnRyaW0oKTtcbiAgICAgICAgICAgICAgICB0ZXh0QmxvY2sgPSB0ZXh0QmxvY2suc3Vic3RyaW5nKDAsIGRpc3RyYWN0SW5kZXggKyAxMSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRleHRCbG9jay5pbmNsdWRlcyhcIiN0YWc6XCIpKSB7XG4gICAgICAgICAgICAgICAgdGV4dEJsb2NrID0gdGV4dEJsb2NrLnJlcGxhY2UoLyN0YWc6Lio7Lio7LywgKHMpID0+XG4gICAgICAgICAgICAgICAgICAgIHMucmVwbGFjZSgvXFxzKy9nLCBcIlwiKVxuICAgICAgICAgICAgICAgICk7IC8vIHJlbW92ZSB3aGl0ZXNwYWNlIGluIHRhZyBhbmQgZGVwZW5kcyBsaXN0XG4gICAgICAgICAgICAgICAgdGFnSW5kZXggPSB0ZXh0QmxvY2suaW5kZXhPZihcIiN0YWc6XCIpO1xuICAgICAgICAgICAgICAgIHRhZyA9IHRleHRCbG9jay5zdWJzdHJpbmcoXG4gICAgICAgICAgICAgICAgICAgIHRhZ0luZGV4ICsgNSxcbiAgICAgICAgICAgICAgICAgICAgdGV4dEJsb2NrLmluZGV4T2YoXCI7XCIsIHRhZ0luZGV4ICsgNSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGlmICh0YWcgPT0gXCJcIikgdGFnID0gXCJibG9jay1cIiArIGk7XG4gICAgICAgICAgICAgICAgZGVwZW5kc0luZGV4ID0gdGV4dEJsb2NrLmluZGV4T2YoXCI7ZGVwZW5kczpcIik7XG4gICAgICAgICAgICAgICAgbGV0IGRlcGVuZHNTdHJpbmcgPSB0ZXh0QmxvY2suc3Vic3RyaW5nKFxuICAgICAgICAgICAgICAgICAgICBkZXBlbmRzSW5kZXggKyA5LFxuICAgICAgICAgICAgICAgICAgICB0ZXh0QmxvY2suaW5kZXhPZihcIjtcIiwgZGVwZW5kc0luZGV4ICsgOSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGRlcGVuZHMgPVxuICAgICAgICAgICAgICAgICAgICBkZXBlbmRzU3RyaW5nLmxlbmd0aCA+IDAgPyBkZXBlbmRzU3RyaW5nLnNwbGl0KFwiLFwiKSA6IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRleHRCbG9jay5pbmNsdWRlcygnY2xhc3M9XCJkaXNwbGF5bWF0aCcpKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9uc1tcImRpc3BsYXltYXRoXCJdID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3B0aW9uc1tcImRpc3BsYXltYXRoXCJdID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ZXh0QmxvY2sgPSB0ZXh0QmxvY2sucmVwbGFjZShcbiAgICAgICAgICAgICAgICAvIyhwYWlyZWR8ZGlzdHJhY3Rvcnx0YWc6Lio7Lio7KS8sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24obXlzdHJpbmcsIGFyZzEpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1thcmcxXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAvLyBDcmVhdGUgbGluZXNcbiAgICAgICAgICAgIHZhciBsaW5lcyA9IFtdO1xuICAgICAgICAgICAgaWYgKCFvcHRpb25zW1wiZGlzcGxheW1hdGhcIl0pIHtcbiAgICAgICAgICAgICAgICB2YXIgc3BsaXQgPSB0ZXh0QmxvY2suc3BsaXQoXCJcXG5cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBzcGxpdCA9IFt0ZXh0QmxvY2tdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzcGxpdC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHZhciBjb2RlID0gc3BsaXRbal07XG4gICAgICAgICAgICAgICAgLy8gZGlzY2FyZCBibGFuayByb3dzXG4gICAgICAgICAgICAgICAgaWYgKCEvXlxccyokLy50ZXN0KGNvZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsaW5lID0gbmV3IFBhcnNvbnNMaW5lKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zW1wiZGlzcGxheW1hdGhcIl1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgbGluZXMucHVzaChsaW5lKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnNbXCJwYWlyZWRcIl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUuZGlzdHJhY3RvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lLnBhaXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmRpc3RyYWN0SGVscHRleHQgPSBkaXN0cmFjdEhlbHB0ZXh0O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnNbXCJkaXN0cmFjdG9yXCJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmRpc3RyYWN0b3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5wYWlyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUuZGlzdHJhY3RIZWxwdGV4dCA9IGRpc3RyYWN0SGVscHRleHQ7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmRpc3RyYWN0b3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUucGFpcmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmdyYWRlciA9PT0gXCJkYWdcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUudGFnID0gdGFnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUuZGVwZW5kcyA9IGRlcGVuZHM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzb2x1dGlvbi5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICgkLmluQXJyYXkobGluZS5pbmRlbnQsIGluZGVudHMpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRlbnRzLnB1c2gobGluZS5pbmRlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxpbmVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAvLyBBZGQgZ3JvdXBXaXRoTmV4dFxuICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBsaW5lcy5sZW5ndGggLSAxOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGluZXNbal0uZ3JvdXBXaXRoTmV4dCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxpbmVzW2xpbmVzLmxlbmd0aCAtIDFdLmdyb3VwV2l0aE5leHQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBOb3JtYWxpemUgdGhlIGluZGVudHNcbiAgICAgICAgaW5kZW50cyA9IGluZGVudHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYSAtIGI7XG4gICAgICAgIH0pO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGluZSA9IHRoaXMubGluZXNbaV07XG4gICAgICAgICAgICBsaW5lLmluZGVudCA9IGluZGVudHMuaW5kZXhPZihsaW5lLmluZGVudCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zb2x1dGlvbiA9IHNvbHV0aW9uO1xuICAgIH1cbiAgICAvLyBCYXNlZCBvbiB0aGUgYmxvY2tzLCBjcmVhdGUgdGhlIHNvdXJjZSBhbmQgYW5zd2VyIGFyZWFzXG4gICAgYXN5bmMgaW5pdGlhbGl6ZUFyZWFzKHNvdXJjZUJsb2NrcywgYW5zd2VyQmxvY2tzLCBvcHRpb25zKSB7XG4gICAgICAgIC8vIENyZWF0ZSBibG9ja3MgcHJvcGVydHkgYXMgdGhlIHN1bSBvZiB0aGUgdHdvXG4gICAgICAgIHZhciBibG9ja3MgPSBbXTtcbiAgICAgICAgdmFyIGksIGJsb2NrO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc291cmNlQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBibG9jayA9IHNvdXJjZUJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgIHRoaXMuc291cmNlQXJlYS5hcHBlbmRDaGlsZChibG9jay52aWV3KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYW5zd2VyQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBibG9jayA9IGFuc3dlckJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyQXJlYS5hcHBlbmRDaGlsZChibG9jay52aWV3KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgICAgICAgLy8gSWYgcHJlc2VudCwgZGlzYWJsZSBzb21lIGJsb2Nrc1xuICAgICAgICB2YXIgZGlzYWJsZWQgPSBvcHRpb25zLmRpc2FibGVkO1xuICAgICAgICBpZiAoZGlzYWJsZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGJsb2NrID0gYmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChkaXNhYmxlZC5pbmNsdWRlcyhibG9jay5saW5lc1swXS5pbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgJChibG9jay52aWV3KS5hZGRDbGFzcyhcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBEZXRlcm1pbmUgaG93IG11Y2ggaW5kZW50IHNob3VsZCBiZSBwb3NzaWJsZSBpbiB0aGUgYW5zd2VyIGFyZWFcbiAgICAgICAgdmFyIGluZGVudCA9IDA7XG4gICAgICAgIGlmICghdGhpcy5ub2luZGVudCkge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5sYW5ndWFnZSA9PSBcIm5hdHVyYWxcIikge1xuICAgICAgICAgICAgICAgIGluZGVudCA9IHRoaXMuc29sdXRpb25JbmRlbnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5kZW50ID0gTWF0aC5tYXgoMCwgdGhpcy5zb2x1dGlvbkluZGVudCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluZGVudCA9IGluZGVudDtcbiAgICAgICAgLy8gRm9yIHJlbmRlcmluZywgcGxhY2UgaW4gYW4gb25zY3JlZW4gcG9zaXRpb25cbiAgICAgICAgdmFyIGlzSGlkZGVuID0gdGhpcy5vdXRlckRpdi5vZmZzZXRQYXJlbnQgPT0gbnVsbDtcbiAgICAgICAgdmFyIHJlcGxhY2VFbGVtZW50O1xuICAgICAgICBpZiAoaXNIaWRkZW4pIHtcbiAgICAgICAgICAgIHJlcGxhY2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICQodGhpcy5vdXRlckRpdikucmVwbGFjZVdpdGgocmVwbGFjZUVsZW1lbnQpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm91dGVyRGl2KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnByZXR0aWZ5TGFuZ3VhZ2UgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIHByZXR0eVByaW50KCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmxpbmVzW2ldLmluaXRpYWxpemVXaWR0aCgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIExheW91dCB0aGUgYXJlYXNcbiAgICAgICAgdmFyIGFyZWFXaWR0aCwgYXJlYUhlaWdodDtcbiAgICAgICAgLy8gRXN0YWJsaXNoIHRoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSBkcm9wcGFibGUgYXJlYXNcbiAgICAgICAgdmFyIGl0ZW0sIG1heEZ1bmN0aW9uO1xuICAgICAgICBhcmVhSGVpZ2h0ID0gMjA7XG4gICAgICAgIHZhciBoZWlnaHRfYWRkID0gMDtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5udW1iZXJlZCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGhlaWdodF9hZGQgPSAxO1xuICAgICAgICB9XG4gICAgICAgIC8vIFdhcm5pbmcgLS0gYWxsIG9mIHRoaXMgaXMganVzdCBhIGJpdCBvZiBwaXhpZSBkdXN0IGRpc2NvdmVyZWQgYnkgdHJpYWxcbiAgICAgICAgLy8gYW5kIGVycm9yIHRvIHRyeSB0byBnZXQgdGhlIGhlaWdodCBvZiB0aGUgZHJhZyBhbmQgZHJvcCBib3hlcy5cbiAgICAgICAgLy8gaXRlbSBpcyBhIGpRdWVyeSBvYmplY3RcbiAgICAgICAgLy8gb3V0ZXJIZWlnaHQgY2FuIGJlIHVucmVsaWFibGUgaWYgZWxlbWVudHMgYXJlIG5vdCB5ZXQgdmlzaWJsZVxuICAgICAgICAvLyBvdXRlckhlaWdodCB3aWxsIHJldHVybiBiYWQgcmVzdWx0cyBpZiBNYXRoSmF4IGhhcyBub3QgcmVuZGVyZWQgdGhlIG1hdGhcbiAgICAgICAgYXJlYVdpZHRoID0gMzAwO1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIG1heEZ1bmN0aW9uID0gYXN5bmMgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5sYW5ndWFnZSA9PSBcIm5hdHVyYWxcIiB8fCB0aGlzLm9wdGlvbnMubGFuZ3VhZ2UgPT0gXCJtYXRoXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJ1bmVzdG9uZU1hdGhyZWFkeSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBydW5lc3RvbmVNYXRoUmVhZHkudGhlbihhc3luYyAoKSA9PiBhd2FpdCBzZWxmLnF1ZXVlTWF0aEpheChpdGVtWzBdKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gdGhpcyBpcyBmb3Igb2xkZXIgcnN0IGJ1aWxkcyBub3QgcHR4XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTWF0aEpheC5zdGFydHVwICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBzZWxmLnF1ZXVlTWF0aEpheChpdGVtWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFyZWFXaWR0aCA9IE1hdGgubWF4KGFyZWFXaWR0aCwgaXRlbS5vdXRlcldpZHRoKHRydWUpKTtcbiAgICAgICAgICAgIGl0ZW0ud2lkdGgoYXJlYVdpZHRoIC0gMjIpO1xuICAgICAgICAgICAgdmFyIGFkZGl0aW9uID0gMy44O1xuICAgICAgICAgICAgaWYgKGl0ZW0ub3V0ZXJIZWlnaHQodHJ1ZSkgIT0gMzgpXG4gICAgICAgICAgICAgICAgYWRkaXRpb24gPSAoMy4xICogKGl0ZW0ub3V0ZXJIZWlnaHQodHJ1ZSkgLSAzOCkpIC8gMjE7XG4gICAgICAgICAgICBhcmVhSGVpZ2h0ICs9IGl0ZW0ub3V0ZXJIZWlnaHQodHJ1ZSkgKyBoZWlnaHRfYWRkICogYWRkaXRpb247XG4gICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXdhaXQgbWF4RnVuY3Rpb24oJChibG9ja3NbaV0udmlldykpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXJlYVdpZHRoID0gYXJlYVdpZHRoO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm51bWJlcmVkICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5hcmVhV2lkdGggKz0gMjU7XG4gICAgICAgICAgICAvL2FyZWFIZWlnaHQgKz0gKGJsb2Nrcy5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIC8vICsgNDAgdG8gYXJlYUhlaWdodCB0byBwcm92aWRlIHNvbWUgYWRkaXRpb25hbCBidWZmZXIgaW4gY2FzZSBhbnkgdGV4dCBvdmVyZmxvdyBzdGlsbCBoYXBwZW5zIC0gVmluY2VudCBRaXUgKFNlcHRlbWJlciAyMDIwKVxuICAgICAgICB0aGlzLmFyZWFIZWlnaHQgPSBhcmVhSGVpZ2h0ICsgNDA7XG4gICAgICAgICQodGhpcy5zb3VyY2VBcmVhKS5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6IHRoaXMuYXJlYVdpZHRoICsgMixcbiAgICAgICAgICAgIGhlaWdodDogYXJlYUhlaWdodCxcbiAgICAgICAgfSk7XG4gICAgICAgICQodGhpcy5hbnN3ZXJBcmVhKS5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6IHRoaXMub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQgKiBpbmRlbnQgKyB0aGlzLmFyZWFXaWR0aCArIDIsXG4gICAgICAgICAgICBoZWlnaHQ6IGFyZWFIZWlnaHQsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoaW5kZW50ID4gMCAmJiBpbmRlbnQgPD0gNCkge1xuICAgICAgICAgICAgJCh0aGlzLmFuc3dlckFyZWEpLmFkZENsYXNzKFwiYW5zd2VyXCIgKyBpbmRlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzLmFuc3dlckFyZWEpLmFkZENsYXNzKFwiYW5zd2VyXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEluaXRpYWxpemUgcGFpcmVkIGRpc3RyYWN0b3IgZGVjb3JhdGlvblxuICAgICAgICB2YXIgYmlucyA9IFtdO1xuICAgICAgICB2YXIgYmluID0gW107XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbGluZSA9IHRoaXMubGluZXNbaV07XG4gICAgICAgICAgICBpZiAobGluZS5ibG9jaygpID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmIChiaW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBiaW5zLnB1c2goYmluKTtcbiAgICAgICAgICAgICAgICAgICAgYmluID0gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBiaW4ucHVzaChsaW5lKTtcbiAgICAgICAgICAgICAgICBpZiAoIWxpbmUuZ3JvdXBXaXRoTmV4dCkge1xuICAgICAgICAgICAgICAgICAgICBiaW5zLnB1c2goYmluKTtcbiAgICAgICAgICAgICAgICAgICAgYmluID0gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBwYWlyZWRCaW5zID0gW107XG4gICAgICAgIHZhciBsaW5lTnVtYmVycyA9IFtdO1xuICAgICAgICB2YXIgcGFpcmVkRGl2cyA9IFtdO1xuICAgICAgICB2YXIgajtcbiAgICAgICAgaWYgKHRoaXMucGFpckRpc3RyYWN0b3JzIHx8ICF0aGlzLm9wdGlvbnMuYWRhcHRpdmUpIHtcbiAgICAgICAgICAgIGZvciAoaSA9IGJpbnMubGVuZ3RoIC0gMTsgaSA+IC0xOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBiaW4gPSBiaW5zW2ldO1xuICAgICAgICAgICAgICAgIGlmIChiaW5bMF0ucGFpcmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFkZCBhbGwgaW4gYmluIHRvIGxpbmUgbnVtYmVyc1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSBiaW4ubGVuZ3RoIC0gMTsgaiA+IC0xOyBqLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXJzLnVuc2hpZnQoYmluW2pdLmluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5lTnVtYmVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBZGQgYWxsIGluIGJpbiB0byBsaW5lIG51bWJlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IGJpbi5sZW5ndGggLSAxOyBqID4gLTE7IGotLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXJzLnVuc2hpZnQoYmluW2pdLmluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBhaXJlZEJpbnMudW5zaGlmdChsaW5lTnVtYmVycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHBhaXJlZEJpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpcmVkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICAkKHBhaXJlZERpdikuYWRkQ2xhc3MoXCJwYWlyZWRcIik7XG4gICAgICAgICAgICAgICAgJChwYWlyZWREaXYpLmh0bWwoXG4gICAgICAgICAgICAgICAgICAgIFwiPHNwYW4gaWQ9ICdzdCcgc3R5bGUgPSAndmVydGljYWwtYWxpZ246IG1pZGRsZTsgZm9udC13ZWlnaHQ6IGJvbGQnPm9yezwvc3Bhbj5cIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcGFpcmVkRGl2cy5wdXNoKHBhaXJlZERpdik7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3VyY2VBcmVhLmFwcGVuZENoaWxkKHBhaXJlZERpdik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYWlyZWRCaW5zID0gW107XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYWlyZWRCaW5zID0gcGFpcmVkQmlucztcbiAgICAgICAgdGhpcy5wYWlyZWREaXZzID0gcGFpcmVkRGl2cztcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5udW1iZXJlZCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkQmxvY2tMYWJlbHMoc291cmNlQmxvY2tzLmNvbmNhdChhbnN3ZXJCbG9ja3MpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBVcGRhdGUgdGhlIHZpZXdcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHVuZGVmaW5lZDsgLy8gbmVlZHMgdG8gYmUgaGVyZSBmb3IgbG9hZGluZyBmcm9tIHN0b3JhZ2VcbiAgICAgICAgdGhpcy51cGRhdGVWaWV3KCk7XG4gICAgICAgIC8vIFB1dCBiYWNrIGludG8gdGhlIG9mZnNjcmVlbiBwb3NpdGlvblxuICAgICAgICBpZiAoaXNIaWRkZW4pIHtcbiAgICAgICAgICAgICQocmVwbGFjZUVsZW1lbnQpLnJlcGxhY2VXaXRoKHRoaXMub3V0ZXJEaXYpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIE1ha2UgYmxvY2tzIGludGVyYWN0aXZlIChib3RoIGRyYWctYW5kLWRyb3AgYW5kIGtleWJvYXJkKVxuICAgIGluaXRpYWxpemVJbnRlcmFjdGl2aXR5KCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmJsb2Nrc1tpXS5pbml0aWFsaXplSW50ZXJhY3Rpdml0eSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVRhYkluZGV4KCk7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmxhbmd1YWdlID09IFwibmF0dXJhbFwiIHx8XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMubGFuZ3VhZ2UgPT0gXCJtYXRoXCJcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIE1hdGhKYXguc3RhcnR1cCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHNlbGYucXVldWVNYXRoSmF4KHNlbGYub3V0ZXJEaXYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIE1ha2Ugb25lIGJsb2NrIGJlIGtleWJvYXJkIGFjY2Vzc2libGVcbiAgICBpbml0aWFsaXplVGFiSW5kZXgoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBibG9jayA9IHRoaXMuYmxvY2tzW2ldO1xuICAgICAgICAgICAgaWYgKGJsb2NrLmVuYWJsZWQoKSkge1xuICAgICAgICAgICAgICAgIGJsb2NrLm1ha2VUYWJJbmRleCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gU0VSVkVSIENPTU1VTklDQVRJT04gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuICAgIC8vIFJldHVybiB0aGUgYXJndW1lbnQgdGhhdCBpcyBuZXdlciBiYXNlZCBvbiB0aGUgdGltZXN0YW1wXG4gICAgbmV3ZXJEYXRhKGRhdGFBLCBkYXRhQikge1xuICAgICAgICB2YXIgZGF0ZUEgPSBkYXRhQS50aW1lc3RhbXA7XG4gICAgICAgIHZhciBkYXRlQiA9IGRhdGFCLnRpbWVzdGFtcDtcbiAgICAgICAgaWYgKGRhdGVBID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFCO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRlQiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhQTtcbiAgICAgICAgfVxuICAgICAgICBkYXRlQSA9IHRoaXMuZGF0ZUZyb21UaW1lc3RhbXAoZGF0ZUEpO1xuICAgICAgICBkYXRlQiA9IHRoaXMuZGF0ZUZyb21UaW1lc3RhbXAoZGF0ZUIpO1xuICAgICAgICBpZiAoZGF0ZUEgPiBkYXRlQikge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFBO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFCO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEJhc2VkIG9uIHRoZSBkYXRhLCBsb2FkXG4gICAgYXN5bmMgbG9hZERhdGEoZGF0YSkge1xuICAgICAgICB2YXIgc291cmNlSGFzaCA9IGRhdGEuc291cmNlO1xuICAgICAgICBpZiAoc291cmNlSGFzaCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIG1haW50YWluIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgICAgICAgICBzb3VyY2VIYXNoID0gZGF0YS50cmFzaDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYW5zd2VySGFzaCA9IGRhdGEuYW5zd2VyO1xuICAgICAgICB2YXIgYWRhcHRpdmVIYXNoID0gZGF0YS5hZGFwdGl2ZTtcbiAgICAgICAgdmFyIG9wdGlvbnM7XG4gICAgICAgIGlmIChhZGFwdGl2ZUhhc2ggPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zRnJvbUhhc2goYWRhcHRpdmVIYXNoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5ub2luZGVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLm5vaW5kZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5jaGVja0NvdW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tDb3VudCA9IG9wdGlvbnMuY2hlY2tDb3VudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5oYXNTb2x2ZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5oYXNTb2x2ZWQgPSBvcHRpb25zLmhhc1NvbHZlZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBzb3VyY2VIYXNoID09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgYW5zd2VySGFzaCA9PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgIGFuc3dlckhhc2gubGVuZ3RoID09IDFcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemVBcmVhcyh0aGlzLmJsb2Nrc0Zyb21Tb3VyY2UoKSwgW10sIG9wdGlvbnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplQXJlYXMoXG4gICAgICAgICAgICAgICAgdGhpcy5ibG9ja3NGcm9tSGFzaChzb3VyY2VIYXNoKSxcbiAgICAgICAgICAgICAgICB0aGlzLmJsb2Nrc0Zyb21IYXNoKGFuc3dlckhhc2gpLFxuICAgICAgICAgICAgICAgIG9wdGlvbnNcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmdyYWRlID0gdGhpcy5ncmFkZXIuZ3JhZGUoKTtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IHRoaXMuZ3JhZGU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU3RhcnQgdGhlIGludGVyZmFjZVxuICAgICAgICBpZiAodGhpcy5uZWVkc1JlaW5pdGlhbGl6YXRpb24gIT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZUludGVyYWN0aXZpdHkoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBSZXR1cm4gd2hhdCBpcyBzdG9yZWQgaW4gbG9jYWwgc3RvcmFnZVxuICAgIGxvY2FsRGF0YSgpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnN0b3JhZ2VJZCk7XG4gICAgICAgIGlmIChkYXRhICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoZGF0YS5jaGFyQXQoMCkgPT0gXCJ7XCIpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0YSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICAvLyBSdW5lc3RvbmVCYXNlOiBTZW50IHdoZW4gdGhlIHNlcnZlciBoYXMgZGF0YVxuICAgIHJlc3RvcmVBbnN3ZXJzKHNlcnZlckRhdGEpIHtcbiAgICAgICAgdGhpcy5sb2FkRGF0YShzZXJ2ZXJEYXRhKTtcbiAgICB9XG4gICAgLy8gUnVuZXN0b25lQmFzZTogTG9hZCB3aGF0IGlzIGluIGxvY2FsIHN0b3JhZ2VcbiAgICBjaGVja0xvY2FsU3RvcmFnZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2FkRGF0YSh0aGlzLmxvY2FsRGF0YSgpKTtcbiAgICB9XG4gICAgLy8gUnVuZXN0b25lQmFzZTogU2V0IHRoZSBzdGF0ZSBvZiB0aGUgcHJvYmxlbSBpbiBsb2NhbCBzdG9yYWdlXG4gICAgc2V0TG9jYWxTdG9yYWdlKGRhdGEpIHtcbiAgICAgICAgdmFyIHRvU3RvcmU7XG4gICAgICAgIGlmIChkYXRhID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdG9TdG9yZSA9IHtcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlSGFzaCgpLFxuICAgICAgICAgICAgICAgIGFuc3dlcjogdGhpcy5hbnN3ZXJIYXNoKCksXG4gICAgICAgICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBhZGFwdGl2ZUhhc2ggPSB0aGlzLmFkYXB0aXZlSGFzaCgpO1xuICAgICAgICAgICAgaWYgKGFkYXB0aXZlSGFzaC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdG9TdG9yZS5hZGFwdGl2ZSA9IGFkYXB0aXZlSGFzaDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvU3RvcmUgPSBkYXRhO1xuICAgICAgICB9XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuc3RvcmFnZUlkLCBKU09OLnN0cmluZ2lmeSh0b1N0b3JlKSk7XG4gICAgfVxuICAgIC8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gTE9HR0lORyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuICAgIC8vIExvZyB0aGUgaW50ZXJhY3Rpb24gd2l0aCB0aGUgcHJvYmxlbSB0byB0aGUgc2VydmVyOlxuICAgIC8vICAgc3RhcnQ6IHRoZSB1c2VyIHN0YXJ0ZWQgaW50ZXJhY3Rpbmcgd2l0aCB0aGlzIHByb2JsZW1cbiAgICAvLyAgIG1vdmU6IHRoZSB1c2VyIG1vdmVkIGEgYmxvY2sgdG8gYSBuZXcgcG9zaXRpb25cbiAgICAvLyAgIHJlc2V0OiB0aGUgcmVzZXQgYnV0dG9uIHdhcyBwcmVzc2VkXG4gICAgLy8gICByZW1vdmVEaXN0cmFjdG9yOiBcIkhlbHAgTWVcIiByZW1vdmVkIGEgZGlzdHJhY3RvclxuICAgIC8vICAgcmVtb3ZlSW5kZW50YXRpb246IFwiSGVscCBNZVwiIHJlbW92ZWQgaW5kZW50YXRpb25cbiAgICAvLyAgIGNvbWJpbmVCbG9ja3M6IFwiSGVscCBNZVwiIGNvbWJpbmVkIGJsb2Nrc1xuICAgIGxvZ01vdmUoYWN0aXZpdHkpIHtcbiAgICAgICAgdmFyIGV2ZW50ID0ge1xuICAgICAgICAgICAgZXZlbnQ6IFwicGFyc29uc01vdmVcIixcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgIHN0b3JhZ2VpZDogc3VwZXIubG9jYWxTdG9yYWdlS2V5KCksXG4gICAgICAgIH07XG4gICAgICAgIHZhciBhY3QgPSBhY3Rpdml0eSArIFwifFwiICsgdGhpcy5zb3VyY2VIYXNoKCkgKyBcInxcIiArIHRoaXMuYW5zd2VySGFzaCgpO1xuICAgICAgICB2YXIgYWRhcHRpdmVIYXNoID0gdGhpcy5hZGFwdGl2ZUhhc2goKTtcbiAgICAgICAgaWYgKGFkYXB0aXZlSGFzaCAhPT0gXCJcIikge1xuICAgICAgICAgICAgYWN0ID0gYWN0ICsgXCJ8XCIgKyBhZGFwdGl2ZUhhc2g7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQuYWN0ID0gYWN0O1xuICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudChldmVudCk7XG4gICAgfVxuICAgIC8vIExvZyB0aGUgYW5zd2VyIHRvIHRoZSBwcm9ibGVtXG4gICAgLy8gICBjb3JyZWN0OiBUaGUgYW5zd2VyIGdpdmVuIG1hdGNoZXMgdGhlIHNvbHV0aW9uXG4gICAgLy8gICBpbmNvcnJlY3QqOiBUaGUgYW5zd2VyIGlzIHdyb25nIGZvciB2YXJpb3VzIHJlYXNvbnNcbiAgICBhc3luYyBsb2dDdXJyZW50QW5zd2VyKHNpZCkge1xuICAgICAgICB2YXIgZXZlbnQgPSB7XG4gICAgICAgICAgICBldmVudDogXCJwYXJzb25zXCIsXG4gICAgICAgICAgICBkaXZfaWQ6IHRoaXMuZGl2aWQsXG4gICAgICAgIH07XG4gICAgICAgIHZhciBhbnN3ZXJIYXNoID0gdGhpcy5hbnN3ZXJIYXNoKCk7XG4gICAgICAgIGV2ZW50LmFuc3dlciA9IGFuc3dlckhhc2g7XG4gICAgICAgIHZhciBzb3VyY2VIYXNoID0gdGhpcy5zb3VyY2VIYXNoKCk7XG4gICAgICAgIGV2ZW50LnNvdXJjZSA9IHNvdXJjZUhhc2g7XG4gICAgICAgIHZhciBhY3QgPSBzb3VyY2VIYXNoICsgXCJ8XCIgKyBhbnN3ZXJIYXNoO1xuICAgICAgICB2YXIgYWRhcHRpdmVIYXNoID0gdGhpcy5hZGFwdGl2ZUhhc2goKTtcbiAgICAgICAgaWYgKGFkYXB0aXZlSGFzaCAhPT0gXCJcIikge1xuICAgICAgICAgICAgZXZlbnQuYWRhcHRpdmUgPSBhZGFwdGl2ZUhhc2g7XG4gICAgICAgICAgICBhY3QgPSBhY3QgKyBcInxcIiArIGFkYXB0aXZlSGFzaDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5ncmFkZSA9PSBcImNvcnJlY3RcIikge1xuICAgICAgICAgICAgYWN0ID0gXCJjb3JyZWN0fFwiICsgYWN0O1xuICAgICAgICAgICAgZXZlbnQuY29ycmVjdCA9IFwiVFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWN0ID0gXCJpbmNvcnJlY3R8XCIgKyBhY3Q7XG4gICAgICAgICAgICBldmVudC5jb3JyZWN0ID0gXCJGXCI7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQuYWN0ID0gYWN0O1xuXG4gICAgICAgIGlmICh0eXBlb2Ygc2lkICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBldmVudC5zaWQgPSBzaWQ7XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCB0aGlzLmxvZ0Jvb2tFdmVudChldmVudCk7XG4gICAgfVxuICAgIC8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gQUNDRVNTSU5HID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuICAgIC8vIEFuc3dlciB0aGUgaGFzaCBvZiB0aGUgYWRhcHRpdmUgc3RhdGVcbiAgICBhZGFwdGl2ZUhhc2goKSB7XG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLmFkYXB0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaGFzaCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGlmICghYmxvY2suZW5hYmxlZCgpKSB7XG4gICAgICAgICAgICAgICAgaGFzaC5wdXNoKFwiZFwiICsgYmxvY2subGluZXNbMF0uaW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm5vaW5kZW50ICE9PSB0aGlzLm9wdGlvbnMubm9pbmRlbnQpIHtcbiAgICAgICAgICAgIGhhc2gucHVzaChcImlcIik7XG4gICAgICAgIH1cbiAgICAgICAgaGFzaC5wdXNoKFwiY1wiICsgdGhpcy5jaGVja0NvdW50KTtcbiAgICAgICAgaWYgKHRoaXMuaGFzU29sdmVkKSB7XG4gICAgICAgICAgICBoYXNoLnB1c2goXCJzXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYXNoLmpvaW4oXCItXCIpO1xuICAgIH1cbiAgICAvLyBDcmVhdGUgb3B0aW9ucyBmb3IgY3JlYXRpbmcgYmxvY2tzIGJhc2VkIG9uIGEgaGFzaFxuICAgIG9wdGlvbnNGcm9tSGFzaChoYXNoKSB7XG4gICAgICAgIHZhciBzcGxpdDtcbiAgICAgICAgaWYgKGhhc2ggPT09IFwiLVwiIHx8IGhhc2ggPT09IFwiXCIgfHwgaGFzaCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgc3BsaXQgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNwbGl0ID0gaGFzaC5zcGxpdChcIi1cIik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgdmFyIGRpc2FibGVkID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3BsaXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBzcGxpdFtpXTtcbiAgICAgICAgICAgIGlmIChrZXlbMF0gPT0gXCJpXCIpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLm5vaW5kZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5WzBdID09IFwiZFwiKSB7XG4gICAgICAgICAgICAgICAgZGlzYWJsZWQucHVzaChwYXJzZUludChrZXkuc2xpY2UoMSkpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5WzBdID09IFwic1wiKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5oYXNTb2x2ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXlbMF0gPT0gXCJjXCIpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmNoZWNrQ291bnQgPSBwYXJzZUludChrZXkuc2xpY2UoMSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChkaXNhYmxlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBvcHRpb25zLmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfVxuICAgIC8vIEFuc3dlciB0aGUgaGFzaCBvZiB0aGUgYW5zd2VyIGFyZWFcbiAgICBhbnN3ZXJIYXNoKCkge1xuICAgICAgICB2YXIgaGFzaCA9IFtdO1xuICAgICAgICB2YXIgYmxvY2tzID0gdGhpcy5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGhhc2gucHVzaChibG9ja3NbaV0uaGFzaCgpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFzaC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBcIi1cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBoYXNoLmpvaW4oXCItXCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEFuc3dlciB0aGUgaGFzaCBvZiB0aGUgc291cmNlIGFyZWFcbiAgICBzb3VyY2VIYXNoKCkge1xuICAgICAgICB2YXIgaGFzaCA9IFtdO1xuICAgICAgICB2YXIgYmxvY2tzID0gdGhpcy5zb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGhhc2gucHVzaChibG9ja3NbaV0uaGFzaCgpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFzaC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBcIi1cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBoYXNoLmpvaW4oXCItXCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEludGVyLXByb2JsZW0gYWRhcHRpdmUgY2hhbmdlc1xuICAgIC8vIEJhc2VkIG9uIHRoZSByZWNlbnRBdHRlbXB0cywgcmVtb3ZlIGRpc3RyYWN0b3JzLCBhZGQgaW5kZW50LCBjb21iaW5lIGJsb2Nrc1xuICAgIGFkYXB0QmxvY2tzKGlucHV0KSB7XG4gICAgICAgIHZhciBibG9ja3MgPSBbXTtcbiAgICAgICAgdmFyIGRpc3RyYWN0b3JzID0gW107XG4gICAgICAgIHZhciBibG9jaztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYmxvY2sgPSBpbnB1dFtpXTtcbiAgICAgICAgICAgIGlmIChibG9jay5pc0Rpc3RyYWN0b3IoKSkge1xuICAgICAgICAgICAgICAgIGRpc3RyYWN0b3JzLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBibG9ja3MucHVzaChibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZWNlbnRBdHRlbXB0cyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFxuICAgICAgICAgICAgdGhpcy5hZGFwdGl2ZUlkICsgXCJyZWNlbnRBdHRlbXB0c1wiXG4gICAgICAgICk7XG4gICAgICAgIGlmICh0aGlzLnJlY2VudEF0dGVtcHRzID09IHVuZGVmaW5lZCB8fCB0aGlzLnJlY2VudEF0dGVtcHRzID09IFwiTmFOXCIpIHtcbiAgICAgICAgICAgIHRoaXMucmVjZW50QXR0ZW1wdHMgPSAzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsYXN0ZXN0QXR0ZW1wdENvdW50ID0gdGhpcy5yZWNlbnRBdHRlbXB0cztcbiAgICAgICAgdmFyIG5CbG9ja3MgPSBibG9ja3MubGVuZ3RoO1xuICAgICAgICB2YXIgbkJsb2Nrc1RvQ29tYmluZSA9IDA7XG4gICAgICAgIHZhciBuRGlzdHJhY3RvcnMgPSBkaXN0cmFjdG9ycy5sZW5ndGg7XG4gICAgICAgIHZhciBuVG9SZW1vdmUgPSAwO1xuICAgICAgICB0aGlzLnBhaXJEaXN0cmFjdG9ycyA9IHRydWU7XG4gICAgICAgIHZhciBnaXZlSW5kZW50YXRpb24gPSBmYWxzZTtcbiAgICAgICAgaWYgKGxhc3Rlc3RBdHRlbXB0Q291bnQgPCAyKSB7XG4gICAgICAgICAgICAvLyAxIFRyeVxuICAgICAgICAgICAgdGhpcy5wYWlyRGlzdHJhY3RvcnMgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMubGltaXREaXN0cmFjdG9ycyA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKGxhc3Rlc3RBdHRlbXB0Q291bnQgPCA0KSB7XG4gICAgICAgICAgICAvLyAyLTMgVHJpZXNcbiAgICAgICAgICAgIC8vIERvIG5vdGhpbmcgdGhleSBhcmUgZG9pbmcgbm9ybWFsXG4gICAgICAgICAgICB0aGlzLnBhaXJEaXN0cmFjdG9ycyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAobGFzdGVzdEF0dGVtcHRDb3VudCA8IDYpIHtcbiAgICAgICAgICAgIC8vIDQtNSBUcmllc1xuICAgICAgICAgICAgLy8gcGFpciBkaXN0cmFjdG9yc1xuICAgICAgICAgICAgdGhpcy5wYWlyRGlzdHJhY3RvcnMgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGxhc3Rlc3RBdHRlbXB0Q291bnQgPCA4KSB7XG4gICAgICAgICAgICAvLyA2LTcgVHJpZXNcbiAgICAgICAgICAgIC8vIFJlbW92ZSA1MCUgb2YgZGlzdHJhY3RvcnNcbiAgICAgICAgICAgIG5Ub1JlbW92ZSA9IDAuNSAqIG5EaXN0cmFjdG9ycztcbiAgICAgICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIDgrIFRyaWVzXG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIG9mIGRpc3RyYWN0b3JzXG4gICAgICAgICAgICBuVG9SZW1vdmUgPSBuRGlzdHJhY3RvcnM7XG4gICAgICAgICAgICB0aGlzLnBhaXJEaXN0cmFjdG9ycyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgLypcbiAgICAgICAgZWxzZSBpZihsYXN0ZXN0QXR0ZW1wdENvdW50IDwgMTIpIHsgLy8xMC0xMVxuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBkaXN0cmFjdG9ycyBhbmQgZ2l2ZSBpbmRlbnRhdGlvblxuICAgICAgICAgICAgblRvUmVtb3ZlID0gbkRpc3RyYWN0b3JzO1xuICAgICAgICAgICAgZ2l2ZUluZGVudGF0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmKGxhc3Rlc3RBdHRlbXB0Q291bnQgPCAxNCkgeyAvLyAxMi0xMyBUcmllc1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBvZiBkaXN0cmFjdG9yc1xuICAgICAgICAgICAgLy8gZ2l2ZSBpbmRlbnRhdGlvblxuICAgICAgICAgICAgLy8gcmVkdWNlIHByb2JsZW0gdG8gMy80IHNpemVcbiAgICAgICAgICAgIGdpdmVJbmRlbnRhdGlvbiA9IHRydWU7XG4gICAgICAgICAgICBuVG9SZW1vdmUgPSBuRGlzdHJhY3RvcnM7XG4gICAgICAgICAgICBuQmxvY2tzVG9Db21iaW5lID0gLjI1ICogbkJsb2NrcztcbiAgICAgICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHsgLy8gPj0gMTQgVHJpZXNcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgb2YgZGlzdHJhY3RvcnNcbiAgICAgICAgICAgIC8vIGdpdmUgaW5kZW50YXRpb25cbiAgICAgICAgICAgIC8vIHJlZHVjZSBwcm9ibGVtIHRvIDEvMiBzaXplXG4gICAgICAgICAgICBnaXZlSW5kZW50YXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgblRvUmVtb3ZlID0gbkRpc3RyYWN0b3JzO1xuICAgICAgICAgICAgbkJsb2Nrc1RvQ29tYmluZSA9IC41ICogbkJsb2NrcztcbiAgICAgICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAqL1xuICAgICAgICBuQmxvY2tzVG9Db21iaW5lID0gTWF0aC5taW4obkJsb2Nrc1RvQ29tYmluZSwgbkJsb2NrcyAtIDMpO1xuICAgICAgICAvLyBOZXZlciBjb21iaW5lIHNvIHdoZXJlIHRoZXJlIGFyZSBsZXNzIHRoYW4gdGhyZWUgYmxvY2tzIGxlZnRcbiAgICAgICAgLy8gUmVtb3ZlIGRpc3RyYWN0b3JzXG4gICAgICAgIGRpc3RyYWN0b3JzID0gdGhpcy5zaHVmZmxlZChkaXN0cmFjdG9ycyk7XG4gICAgICAgIGRpc3RyYWN0b3JzID0gZGlzdHJhY3RvcnMuc2xpY2UoMCwgblRvUmVtb3ZlKTtcbiAgICAgICAgdmFyIG91dHB1dCA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJsb2NrID0gaW5wdXRbaV07XG4gICAgICAgICAgICBpZiAoIWJsb2NrLmlzRGlzdHJhY3RvcigpKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goYmxvY2spO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkLmluQXJyYXkoYmxvY2ssIGRpc3RyYWN0b3JzKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL3ZhciBvdXRwdXQgPSBpbnB1dDtcbiAgICAgICAgaWYgKGdpdmVJbmRlbnRhdGlvbikge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdXRwdXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBvdXRwdXRbaV0uYWRkSW5kZW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmluZGVudCA9IDA7XG4gICAgICAgICAgICB0aGlzLm5vaW5kZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb21iaW5lIGJsb2Nrc1xuICAgICAgICB2YXIgc29sdXRpb24gPSBbXTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgb3V0cHV0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKG91dHB1dFtqXS5saW5lc1swXS5pbmRleCA9PSBpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNvbHV0aW9uLnB1c2gob3V0cHV0W2pdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuQmxvY2tzVG9Db21iaW5lOyBpKyspIHtcbiAgICAgICAgICAgIC8vIGNvbWJpbmUgb25lIHNldCBvZiBibG9ja3NcbiAgICAgICAgICAgIHZhciBiZXN0ID0gLTEwO1xuICAgICAgICAgICAgdmFyIGNvbWJpbmVJbmRleCA9IC0xMDtcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBzb2x1dGlvbi5sZW5ndGggLSAxOyBqKyspIHtcbiAgICAgICAgICAgICAgICBibG9jayA9IHNvbHV0aW9uW2pdO1xuICAgICAgICAgICAgICAgIHZhciBuZXh0ID0gc29sdXRpb25baiArIDFdO1xuICAgICAgICAgICAgICAgIHZhciByYXRpbmcgPSAxMCAtIGJsb2NrLmxpbmVzLmxlbmd0aCAtIG5leHQubGluZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHZhciBibG9ja0luZGVudCA9IGJsb2NrLm1pbmltdW1MaW5lSW5kZW50KCk7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRJbmRlbnQgPSBuZXh0Lm1pbmltdW1MaW5lSW5kZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKGJsb2NrSW5kZW50ID09IG5leHRJbmRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmF0aW5nICs9IDI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChibG9ja0luZGVudCA+IG5leHRJbmRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmF0aW5nIC09IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgYmxvY2subGluZXNbYmxvY2subGluZXMubGVuZ3RoIC0gMV0uaW5kZW50ID09XG4gICAgICAgICAgICAgICAgICAgIG5leHQubGluZXNbMF0uaW5kZW50XG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJhdGluZyArPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmF0aW5nID49IGJlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgYmVzdCA9IHJhdGluZztcbiAgICAgICAgICAgICAgICAgICAgY29tYmluZUluZGV4ID0gajtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBibG9jayA9IHNvbHV0aW9uW2NvbWJpbmVJbmRleF07XG4gICAgICAgICAgICBuZXh0ID0gc29sdXRpb25bY29tYmluZUluZGV4ICsgMV07XG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgbmV4dC5saW5lcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGJsb2NrLmFkZExpbmUobmV4dC5saW5lc1tqXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbmV3U29sdXRpb24gPSBbXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBzb2x1dGlvbi5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChqICE9PSBjb21iaW5lSW5kZXggKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1NvbHV0aW9uLnB1c2goc29sdXRpb25bal0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBzb2x1dGlvbiA9IG5ld1NvbHV0aW9uO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJlb3JkZXJcbiAgICAgICAgdmFyIGNvbWJpbmVkT3V0cHV0ID0gW107XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBvdXRwdXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBzb2x1dGlvbi5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChvdXRwdXRbaV0ubGluZXNbMF0uaW5kZXggPT0gc29sdXRpb25bal0ubGluZXNbMF0uaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tYmluZWRPdXRwdXQucHVzaChzb2x1dGlvbltqXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21iaW5lZE91dHB1dDtcbiAgICB9XG4gICAgLy8gUmV0dXJuIGFuIGFycmF5IG9mIGNvZGUgYmxvY2tzIGJhc2VkIG9uIHdoYXQgaXMgc3BlY2lmaWVkIGluIHRoZSBwcm9ibGVtXG4gICAgYmxvY2tzRnJvbVNvdXJjZSgpIHtcbiAgICAgICAgdmFyIHVub3JkZXJlZEJsb2NrcyA9IFtdO1xuICAgICAgICB2YXIgb3JpZ2luYWxCbG9ja3MgPSBbXTtcbiAgICAgICAgdmFyIGJsb2NrcyA9IFtdO1xuICAgICAgICB2YXIgbGluZXMgPSBbXTtcbiAgICAgICAgdmFyIGJsb2NrLCBsaW5lLCBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGluZSA9IHRoaXMubGluZXNbaV07XG4gICAgICAgICAgICBsaW5lcy5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgaWYgKCFsaW5lLmdyb3VwV2l0aE5leHQpIHtcbiAgICAgICAgICAgICAgICB1bm9yZGVyZWRCbG9ja3MucHVzaChuZXcgUGFyc29uc0Jsb2NrKHRoaXMsIGxpbmVzKSk7XG4gICAgICAgICAgICAgICAgbGluZXMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBvcmlnaW5hbEJsb2NrcyA9IHVub3JkZXJlZEJsb2NrcztcbiAgICAgICAgLy8gVHJpbSB0aGUgZGlzdHJhY3RvcnNcbiAgICAgICAgdmFyIHJlbW92ZWRCbG9ja3MgPSBbXTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5tYXhkaXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciBtYXhkaXN0ID0gdGhpcy5vcHRpb25zLm1heGRpc3Q7XG4gICAgICAgICAgICB2YXIgZGlzdHJhY3RvcnMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB1bm9yZGVyZWRCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBibG9jayA9IHVub3JkZXJlZEJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2subGluZXNbMF0uZGlzdHJhY3Rvcikge1xuICAgICAgICAgICAgICAgICAgICBkaXN0cmFjdG9ycy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF4ZGlzdCA8IGRpc3RyYWN0b3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGRpc3RyYWN0b3JzID0gdGhpcy5zaHVmZmxlZChkaXN0cmFjdG9ycyk7XG4gICAgICAgICAgICAgICAgZGlzdHJhY3RvcnMgPSBkaXN0cmFjdG9ycy5zbGljZSgwLCBtYXhkaXN0KTtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdW5vcmRlcmVkQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrID0gdW5vcmRlcmVkQmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2subGluZXNbMF0uZGlzdHJhY3Rvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShibG9jaywgZGlzdHJhY3RvcnMpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9ja3MucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZWRCbG9ja3MucHVzaChpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB1bm9yZGVyZWRCbG9ja3MgPSBibG9ja3M7XG4gICAgICAgICAgICAgICAgYmxvY2tzID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGlzIGlzIG5lY2Vzc2FyeSwgc2V0IHRoZSBwYWlyRGlzdHJhY3RvcnMgdmFsdWUgYmVmb3JlIGJsb2NrcyBnZXQgc2h1ZmZsZWQgLSBXaWxsaWFtIExpIChBdWd1c3QgMjAyMClcbiAgICAgICAgaWYgKHRoaXMucmVjZW50QXR0ZW1wdHMgPCAyKSB7XG4gICAgICAgICAgICAvLyAxIFRyeVxuICAgICAgICAgICAgdGhpcy5wYWlyRGlzdHJhY3RvcnMgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMub3JkZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gU2h1ZmZsZSwgcmVzcGVjdGluZyBwYWlyZWQgZGlzdHJhY3RvcnNcbiAgICAgICAgICAgIHZhciBjaHVua3MgPSBbXSxcbiAgICAgICAgICAgICAgICBjaHVuayA9IFtdO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHVub3JkZXJlZEJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGJsb2NrID0gdW5vcmRlcmVkQmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChibG9jay5saW5lc1swXS5wYWlyZWQgJiYgdGhpcy5wYWlyRGlzdHJhY3RvcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2lsbGlhbSBMaSAoQXVndXN0IDIwMjApXG4gICAgICAgICAgICAgICAgICAgIGNodW5rLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNodW5rID0gW107XG4gICAgICAgICAgICAgICAgICAgIGNodW5rLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICBjaHVua3MucHVzaChjaHVuayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2h1bmtzID0gdGhpcy5zaHVmZmxlZChjaHVua3MpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGNodW5rcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNodW5rID0gY2h1bmtzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChjaHVuay5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNodWZmbGUgcGFpcmVkIGRpc3RyYWN0b3JzXG4gICAgICAgICAgICAgICAgICAgIGNodW5rID0gdGhpcy5zaHVmZmxlZChjaHVuayk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBjaHVuay5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnB1c2goY2h1bmtbal0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnB1c2goY2h1bmtbMF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE9yZGVyIGFjY29yZGluZyB0byBvcmRlciBzcGVjaWZpZWRcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMub3JkZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBibG9jayA9IG9yaWdpbmFsQmxvY2tzW3RoaXMub3B0aW9ucy5vcmRlcltpXV07XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBibG9jayAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICAgICAgICAgICQuaW5BcnJheSh0aGlzLm9wdGlvbnMub3JkZXJbaV0sIHJlbW92ZWRCbG9ja3MpIDwgMFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBibG9ja3MucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hZGFwdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5saW1pdERpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgICAgIGJsb2NrcyA9IHRoaXMuYWRhcHRCbG9ja3MoYmxvY2tzKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5saW1pdERpc3RyYWN0b3JzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHJlbW92ZWRCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5vcmRlciA9PSB1bmRlZmluZWQgP1xuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5yYW5kb20oMCwgYmxvY2tzLmxlbmd0aCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgJC5pbkFycmF5KHJlbW92ZWRCbG9ja3NbaV0sIHRoaXMub3B0aW9ucy5vcmRlcik7XG4gICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5zcGxpY2UoaW5kZXgsIDAsIG9yaWdpbmFsQmxvY2tzW3JlbW92ZWRCbG9ja3NbaV1dKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucGFpckRpc3RyYWN0b3JzICYmIHRoaXMub3B0aW9ucy5vcmRlciAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vbW92ZSBwYWlycyB0b2dldGhlclxuICAgICAgICAgICAgLy9HbyB0aHJvdWdoIGFycmF5IGxvb2tpbmcgZm9yIGRpdHJhY3RvciBhbmQgaXRzIHBhaXJcbiAgICAgICAgICAgIGZvciAoaSA9IDE7IGkgPCBvcmlnaW5hbEJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxCbG9ja3NbaV0ubGluZXNbMF0ucGFpcmVkICYmXG4gICAgICAgICAgICAgICAgICAgICQuaW5BcnJheShvcmlnaW5hbEJsb2Nrc1tpXSwgYmxvY2tzKSA+PSAwXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBqID0gaTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCQuaW5BcnJheShvcmlnaW5hbEJsb2Nrc1tqIC0gMV0sIGJsb2NrcykgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaW5kIHRoZSBwYWlyZWQgZGlzdHJhY3RvciBvciBzb2x1dGlvbiBibG9jayBpdCB3aWxsIGJlIG5leHQgdG9cbiAgICAgICAgICAgICAgICAgICAgICAgIGotLTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXhUbyA9ICQuaW5BcnJheShvcmlnaW5hbEJsb2Nrc1tqIC0gMV0sIGJsb2Nrcyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmRleEZyb20gPSAkLmluQXJyYXkob3JpZ2luYWxCbG9ja3NbaV0sIGJsb2Nrcyk7XG4gICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5zcGxpY2UoaW5kZXhGcm9tLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnNwbGljZShpbmRleFRvLCAwLCBvcmlnaW5hbEJsb2Nrc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBibG9ja3M7XG4gICAgfVxuICAgIC8vIFJldHVybiBhIGNvZGVibG9jayB0aGF0IGNvcnJlc3BvbmRzIHRvIHRoZSBoYXNoXG4gICAgYmxvY2tGcm9tSGFzaChoYXNoKSB7XG4gICAgICAgIHZhciBzcGxpdCA9IGhhc2guc3BsaXQoXCJfXCIpO1xuICAgICAgICB2YXIgbGluZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcGxpdC5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIGxpbmVzLnB1c2godGhpcy5saW5lc1tzcGxpdFtpXV0pO1xuICAgICAgICB9XG4gICAgICAgIHZhciBibG9jayA9IG5ldyBQYXJzb25zQmxvY2sodGhpcywgbGluZXMpO1xuICAgICAgICBpZiAodGhpcy5ub2luZGVudCkge1xuICAgICAgICAgICAgYmxvY2suaW5kZW50ID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJsb2NrLmluZGVudCA9IE51bWJlcihzcGxpdFtzcGxpdC5sZW5ndGggLSAxXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJsb2NrO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYW4gYXJyYXkgb2YgY29kZWJsb2NrcyB0aGF0IGNvcnJlc3BvbmRzIHRvIHRoZSBoYXNoXG4gICAgYmxvY2tzRnJvbUhhc2goaGFzaCkge1xuICAgICAgICB2YXIgc3BsaXQ7XG4gICAgICAgIGlmIChoYXNoID09PSBcIi1cIiB8fCBoYXNoID09PSBcIlwiIHx8IGhhc2ggPT09IG51bGwpIHtcbiAgICAgICAgICAgIHNwbGl0ID0gW107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzcGxpdCA9IGhhc2guc3BsaXQoXCItXCIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBibG9ja3MgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcGxpdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYmxvY2tzLnB1c2godGhpcy5ibG9ja0Zyb21IYXNoKHNwbGl0W2ldKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hZGFwdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRCbG9ja3MoYmxvY2tzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBibG9ja3M7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gUmV0dXJuIGEgYmxvY2sgb2JqZWN0IGJ5IHRoZSBmdWxsIGlkIGluY2x1ZGluZyBpZCBwcmVmaXhcbiAgICBnZXRCbG9ja0J5SWQoaWQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGJsb2NrID0gdGhpcy5ibG9ja3NbaV07XG4gICAgICAgICAgICBpZiAoYmxvY2sudmlldy5pZCA9PSBpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBibG9jaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYXJyYXkgb2YgY29kZWJsb2NrcyB0aGF0IGFyZSB0aGUgc29sdXRpb25cbiAgICBzb2x1dGlvbkJsb2NrcygpIHtcbiAgICAgICAgdmFyIHNvbHV0aW9uQmxvY2tzID0gW107XG4gICAgICAgIHZhciBzb2x1dGlvbkxpbmVzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmxpbmVzW2ldLmRpc3RyYWN0b3IpIHtcbiAgICAgICAgICAgICAgICBzb2x1dGlvbkxpbmVzLnB1c2godGhpcy5saW5lc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGJsb2NrID0gc29sdXRpb25MaW5lc1swXS5ibG9jaygpO1xuICAgICAgICBzb2x1dGlvbkJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBzb2x1dGlvbkxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbmV4dEJsb2NrID0gc29sdXRpb25MaW5lc1tpXS5ibG9jaygpO1xuICAgICAgICAgICAgaWYgKGJsb2NrICE9PSBuZXh0QmxvY2spIHtcbiAgICAgICAgICAgICAgICBibG9jayA9IG5leHRCbG9jaztcbiAgICAgICAgICAgICAgICBzb2x1dGlvbkJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc29sdXRpb25CbG9ja3M7XG4gICAgfVxuICAgIC8vIFJldHVybiBhcnJheSBvZiBjb2RlYmxvY2tzIGJhc2VkIG9uIHdoYXQgaXMgaW4gdGhlIHNvdXJjZSBmaWVsZFxuICAgIHNvdXJjZUJsb2NrcygpIHtcbiAgICAgICAgdmFyIHNvdXJjZUJsb2NrcyA9IFtdO1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLnNvdXJjZUFyZWEuY2hpbGROb2RlcztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAoJChjaGlsZCkuaGFzQ2xhc3MoXCJibG9ja1wiKSkge1xuICAgICAgICAgICAgICAgIHNvdXJjZUJsb2Nrcy5wdXNoKHRoaXMuZ2V0QmxvY2tCeUlkKGNoaWxkLmlkKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNvdXJjZUJsb2NrcztcbiAgICB9XG4gICAgLy8gUmV0dXJuIGFycmF5IG9mIGVuYWJsZWQgY29kZWJsb2NrcyBiYXNlZCBvbiB3aGF0IGlzIGluIHRoZSBzb3VyY2UgZmllbGRcbiAgICBlbmFibGVkU291cmNlQmxvY2tzKCkge1xuICAgICAgICB2YXIgYWxsID0gdGhpcy5zb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgdmFyIGVuYWJsZWQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBibG9jayA9IGFsbFtpXTtcbiAgICAgICAgICAgIGlmIChibG9jay5lbmFibGVkKCkpIHtcbiAgICAgICAgICAgICAgICBlbmFibGVkLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbmFibGVkO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYXJyYXkgb2YgY29kZWJsb2NrcyBiYXNlZCBvbiB3aGF0IGlzIGluIHRoZSBhbnN3ZXIgZmllbGRcbiAgICBhbnN3ZXJCbG9ja3MoKSB7XG4gICAgICAgIHZhciBhbnN3ZXJCbG9ja3MgPSBbXTtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5hbnN3ZXJBcmVhLmNoaWxkTm9kZXM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBibG9jayA9IHRoaXMuZ2V0QmxvY2tCeUlkKGNoaWxkcmVuW2ldLmlkKTtcbiAgICAgICAgICAgIGlmIChibG9jayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYW5zd2VyQmxvY2tzLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbnN3ZXJCbG9ja3M7XG4gICAgfVxuICAgIC8vIFJldHVybiBhcnJheSBvZiBlbmFibGVkIGNvZGVibG9ja3MgYmFzZWQgb24gd2hhdCBpcyBpbiB0aGUgYW5zd2VyIGZpZWxkXG4gICAgZW5hYmxlZEFuc3dlckJsb2NrcygpIHtcbiAgICAgICAgdmFyIGFsbCA9IHRoaXMuYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgIHZhciBlbmFibGVkID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYmxvY2sgPSBhbGxbaV07XG4gICAgICAgICAgICBpZiAoYmxvY2suZW5hYmxlZCgpKSB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZC5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZW5hYmxlZDtcbiAgICB9XG4gICAgLy8gUmV0dXJuIGFycmF5IG9mIGNvZGVsaW5lcyBiYXNlZCBvbiB3aGF0IGlzIGluIHRoZSBhbnN3ZXIgZmllbGRcbiAgICBhbnN3ZXJMaW5lcygpIHtcbiAgICAgICAgdmFyIGFuc3dlckxpbmVzID0gW107XG4gICAgICAgIHZhciBibG9ja3MgPSB0aGlzLmFuc3dlckJsb2NrcygpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGJsb2NrID0gYmxvY2tzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBibG9jay5saW5lcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGFuc3dlckxpbmVzLnB1c2goYmxvY2subGluZXNbal0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbnN3ZXJMaW5lcztcbiAgICB9XG4gICAgLy8gR28gdXAgdGhlIGhpZXJhcmNoeSB1bnRpbCB5b3UgZ2V0IHRvIGEgYmxvY2s7IHJldHVybiB0aGF0IGJsb2NrIGVsZW1lbnRcbiAgICBnZXRCbG9ja0ZvcihlbGVtZW50KSB7XG4gICAgICAgIHZhciBjaGVjayA9IGVsZW1lbnQ7XG4gICAgICAgIHdoaWxlICghY2hlY2suY2xhc3NMaXN0LmNvbnRhaW5zKFwiYmxvY2tcIikpIHtcbiAgICAgICAgICAgIGNoZWNrID0gY2hlY2sucGFyZW50RWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2hlY2s7XG4gICAgfVxuICAgIC8vIFJldHVybiB0aGUgbWF4aW11bSBpbmRlbnQgZm9yIHRoZSBzb2x1dGlvblxuICAgIHNvbHV0aW9uSW5kZW50KCkge1xuICAgICAgICB2YXIgaW5kZW50ID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGJsb2NrID0gdGhpcy5ibG9ja3NbaV07XG4gICAgICAgICAgICBpbmRlbnQgPSBNYXRoLm1heChpbmRlbnQsIGJsb2NrLnNvbHV0aW9uSW5kZW50KCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbmRlbnQ7XG4gICAgfVxuICAgIC8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gQUNUSU9OID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuICAgIC8vIFRoZSBcIkNoZWNrIE1lXCIgYnV0dG9uIHdhcyBwcmVzc2VkLlxuICAgIGNoZWNrQ3VycmVudEFuc3dlcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmhhc1NvbHZlZCkge1xuICAgICAgICAgICAgdGhpcy5jaGVja0NvdW50Kys7XG4gICAgICAgICAgICB0aGlzLmNsZWFyRmVlZGJhY2soKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmFkYXB0aXZlSWQgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGFwdGl2ZUlkID0gdGhpcy5zdG9yYWdlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUT0RPIC0gcmVuZGVyaW5nIGZlZWRiYWNrIGlzIGJ1cmllZCBpbiB0aGUgZ3JhZGVyLmdyYWRlIG1ldGhvZC5cbiAgICAgICAgICAgIC8vIHRvIGRpc2FibGUgZmVlZGJhY2sgc2V0IHRoaXMuZ3JhZGVyLnNob3dmZWVkYmFjayBib29sZWFuXG4gICAgICAgICAgICB0aGlzLmdyYWRlci5zaG93ZmVlZGJhY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZ3JhZGUgPSB0aGlzLmdyYWRlci5ncmFkZSgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ3JhZGUgPT0gXCJjb3JyZWN0XCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhc1NvbHZlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAkKHRoaXMuY2hlY2tCdXR0b24pLnByb3AoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmFkYXB0aXZlSWQgKyBcIlNvbHZlZFwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlY2VudEF0dGVtcHRzID0gdGhpcy5jaGVja0NvdW50O1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkYXB0aXZlSWQgKyBcInJlY2VudEF0dGVtcHRzXCIsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVjZW50QXR0ZW1wdHNcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICAgICAgdGhpcy5hZGFwdGl2ZUlkICsgdGhpcy5kaXZpZCArIFwiQ291bnRcIixcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrQ291bnRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSgpO1xuICAgICAgICAgICAgLy8gaWYgbm90IHNvbHZlZCBhbmQgbm90IHRvbyBzaG9ydCB0aGVuIGNoZWNrIGlmIHNob3VsZCBwcm92aWRlIGhlbHBcbiAgICAgICAgICAgIGlmICghdGhpcy5oYXNTb2x2ZWQgJiYgdGhpcy5ncmFkZSAhPT0gXCJpbmNvcnJlY3RUb29TaG9ydFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2FuSGVscCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBvbmx5IGNvdW50IHRoZSBhdHRlbXB0IGlmIHRoZSBhbnN3ZXIgaXMgZGlmZmVyZW50ICh0byBwcmV2ZW50IGdhbWluZylcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuc3dlckhhc2ggPSB0aGlzLmFuc3dlckhhc2goKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdEFuc3dlckhhc2ggIT09IGFuc3dlckhhc2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubnVtRGlzdGluY3QrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdEFuc3dlckhhc2ggPSBhbnN3ZXJIYXNoO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRpbWUgdG8gb2ZmZXIgaGVscFxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5udW1EaXN0aW5jdCA9PSAzICYmICF0aGlzLmdvdEhlbHApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCQuaTE4bihcIm1zZ19wYXJzb25faGVscF9pbmZvXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgfSAvLyBlbmQgaWZcbiAgICAgICAgICAgICAgICB9IC8vIGVuZCBpZiBjYW4gaGVscFxuICAgICAgICAgICAgfSAvLyBlbmQgaWYgbm90IHNvbHZlZFxuICAgICAgICB9IC8vIGVuZCBvdXRlciBpZiBub3Qgc29sdmVkXG4gICAgfVxuXG4gICAgcmVuZGVyRmVlZGJhY2soKSB7XG4gICAgICAgIHRoaXMuZ3JhZGVyLnNob3dmZWVkYmFjayA9IHRydWU7XG4gICAgICAgIHRoaXMuZ3JhZGUgPSB0aGlzLmdyYWRlci5ncmFkZXJTdGF0ZTtcbiAgICAgICAgdmFyIGZlZWRiYWNrQXJlYTtcbiAgICAgICAgdmFyIGFuc3dlckFyZWEgPSAkKHRoaXMuYW5zd2VyQXJlYSk7XG5cbiAgICAgICAgaWYgKHRoaXMuc2hvd2ZlZWRiYWNrID09PSB0cnVlKSB7XG4gICAgICAgICAgICBmZWVkYmFja0FyZWEgPSAkKHRoaXMubWVzc2FnZURpdik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmZWVkYmFja0FyZWEgPSAkKFwiI2RvZXNub3RleGlzdFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdyYWRlID09PSBcImNvcnJlY3RcIikge1xuICAgICAgICAgICAgYW5zd2VyQXJlYS5hZGRDbGFzcyhcImNvcnJlY3RcIik7XG4gICAgICAgICAgICBmZWVkYmFja0FyZWEuZmFkZUluKDEwMCk7XG4gICAgICAgICAgICBmZWVkYmFja0FyZWEuYXR0cihcImNsYXNzXCIsIFwiYWxlcnQgYWxlcnQtaW5mb1wiKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrQ291bnQgPiAxKSB7XG4gICAgICAgICAgICAgICAgZmVlZGJhY2tBcmVhLmh0bWwoXG4gICAgICAgICAgICAgICAgICAgICQuaTE4bihcIm1zZ19wYXJzb25fY29ycmVjdFwiLCB0aGlzLmNoZWNrQ291bnQpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmVlZGJhY2tBcmVhLmh0bWwoJC5pMThuKFwibXNnX3BhcnNvbl9jb3JyZWN0X2ZpcnN0X3RyeVwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ncmFkZSA9PT0gXCJpbmNvcnJlY3RUb29TaG9ydFwiKSB7XG4gICAgICAgICAgICAvLyB0b28gbGl0dGxlIGNvZGVcbiAgICAgICAgICAgIGFuc3dlckFyZWEuYWRkQ2xhc3MoXCJpbmNvcnJlY3RcIik7XG4gICAgICAgICAgICBmZWVkYmFja0FyZWEuZmFkZUluKDUwMCk7XG4gICAgICAgICAgICBmZWVkYmFja0FyZWEuYXR0cihcImNsYXNzXCIsIFwiYWxlcnQgYWxlcnQtZGFuZ2VyXCIpO1xuICAgICAgICAgICAgZmVlZGJhY2tBcmVhLmh0bWwoJC5pMThuKFwibXNnX3BhcnNvbl90b29fc2hvcnRcIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ3JhZGUgPT09IFwiaW5jb3JyZWN0SW5kZW50XCIpIHtcbiAgICAgICAgICAgIHZhciBpbmNvcnJlY3RCbG9ja3MgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ncmFkZXIuaW5kZW50TGVmdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGJsb2NrID0gdGhpcy5ncmFkZXIuaW5kZW50TGVmdFtpXS5ibG9jaygpO1xuICAgICAgICAgICAgICAgIGlmIChpbmNvcnJlY3RCbG9ja3MuaW5kZXhPZihibG9jaykgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5jb3JyZWN0QmxvY2tzLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICAkKGJsb2NrLnZpZXcpLmFkZENsYXNzKFwiaW5kZW50TGVmdFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ3JhZGVyLmluZGVudFJpZ2h0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYmxvY2sgPSB0aGlzLmdyYWRlci5pbmRlbnRSaWdodFtpXS5ibG9jaygpO1xuICAgICAgICAgICAgICAgIGlmIChpbmNvcnJlY3RCbG9ja3MuaW5kZXhPZihibG9jaykgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5jb3JyZWN0QmxvY2tzLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICAkKGJsb2NrLnZpZXcpLmFkZENsYXNzKFwiaW5kZW50UmlnaHRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmVlZGJhY2tBcmVhLmZhZGVJbig1MDApO1xuICAgICAgICAgICAgZmVlZGJhY2tBcmVhLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWRhbmdlclwiKTtcbiAgICAgICAgICAgIGlmIChpbmNvcnJlY3RCbG9ja3MubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICBmZWVkYmFja0FyZWEuaHRtbCgkLmkxOG4oXCJtc2dfcGFyc29uX3dyb25nX2luZGVudFwiKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZlZWRiYWNrQXJlYS5odG1sKCQuaTE4bihcIm1zZ19wYXJzb25fd3JvbmdfaW5kZW50c1wiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ncmFkZSA9PT0gXCJpbmNvcnJlY3RNb3ZlQmxvY2tzXCIpIHtcbiAgICAgICAgICAgIHZhciBhbnN3ZXJCbG9ja3MgPSB0aGlzLmFuc3dlckJsb2NrcygpO1xuICAgICAgICAgICAgdmFyIGluU29sdXRpb24gPSBbXTtcbiAgICAgICAgICAgIHZhciBpblNvbHV0aW9uSW5kZXhlcyA9IFtdO1xuICAgICAgICAgICAgdmFyIG5vdEluU29sdXRpb24gPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW5zd2VyQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJsb2NrID0gYW5zd2VyQmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuc29sdXRpb24uaW5kZXhPZihibG9jay5saW5lc1swXSk7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vdEluU29sdXRpb24ucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5Tb2x1dGlvbi5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgaW5Tb2x1dGlvbkluZGV4ZXMucHVzaChpbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGxpc0luZGV4ZXMgPSB0aGlzLmdyYWRlci5pbnZlcnNlTElTSW5kaWNlcyhcbiAgICAgICAgICAgICAgICBpblNvbHV0aW9uSW5kZXhlcyxcbiAgICAgICAgICAgICAgICBpblNvbHV0aW9uXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXNJbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbm90SW5Tb2x1dGlvbi5wdXNoKGluU29sdXRpb25bbGlzSW5kZXhlc1tpXV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYW5zd2VyQXJlYS5hZGRDbGFzcyhcImluY29ycmVjdFwiKTtcbiAgICAgICAgICAgIGZlZWRiYWNrQXJlYS5mYWRlSW4oNTAwKTtcbiAgICAgICAgICAgIGZlZWRiYWNrQXJlYS5hdHRyKFwiY2xhc3NcIiwgXCJhbGVydCBhbGVydC1kYW5nZXJcIik7XG4gICAgICAgICAgICBpZiAodGhpcy5zaG93ZmVlZGJhY2sgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vdEluU29sdXRpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgJChub3RJblNvbHV0aW9uW2ldLnZpZXcpLmFkZENsYXNzKFwiaW5jb3JyZWN0UG9zaXRpb25cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmVlZGJhY2tBcmVhLmh0bWwoJC5pMThuKFwibXNnX3BhcnNvbl93cm9uZ19vcmRlclwiKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09IEFEQVBUSVZFID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbiAgICAvLyBJbml0aWFsaXplIHRoaXMgcHJvYmxlbSBhcyBhZGFwdGl2ZVxuICAgIC8vICAgIGhlbHBDb3VudCA9IG51bWJlciBvZiBjaGVja3MgYmVmb3JlIGhlbHAgaXMgZ2l2ZW4gKG5lZ2F0aXZlKVxuICAgIC8vICAgIGNhbkhlbHAgPSBib29sZWFuIGFzIHRvIHdoZXRoZXIgaGVscCBjYW4gYmUgcHJvdmlkZWRcbiAgICAvLyAgICBjaGVja0NvdW50ID0gaG93IG1hbnkgdGltZXMgaXQgaGFzIGJlZW4gY2hlY2tlZCBiZWZvcmUgY29ycmVjdFxuICAgIC8vICAgIHVzZXJSYXRpbmcgPSAwLi4xMDAgaG93IGdvb2QgdGhlIHBlcnNvbiBpcyBhdCBzb2x2aW5nIHByb2JsZW1zXG4gICAgaW5pdGlhbGl6ZUFkYXB0aXZlKCkge1xuICAgICAgICB0aGlzLmFkYXB0aXZlSWQgPSBzdXBlci5sb2NhbFN0b3JhZ2VLZXkoKTtcbiAgICAgICAgdGhpcy5jYW5IZWxwID0gdHJ1ZTtcbiAgICAgICAgLy90aGlzLmhlbHBDb3VudCA9IC0zOyAvLyBOdW1iZXIgb2YgY2hlY2tzIGJlZm9yZSBoZWxwIGlzIG9mZmVyZWRcbiAgICAgICAgdGhpcy5jaGVja0NvdW50ID0gMDtcbiAgICAgICAgdGhpcy5udW1EaXN0aW5jdCA9IDA7IC8vIG51bWJlciBvZiBkaXN0aW5jdCBzb2x1dGlvbiBhdHRlbXB0cyAoZGlmZmVyZW50IGZyb20gcHJldmlvdXMpXG4gICAgICAgIHRoaXMuZ290SGVscCA9IGZhbHNlO1xuICAgICAgICAvLyBJbml0aWFsaXplIHRoZSB1c2VyUmF0aW5nXG4gICAgICAgIHZhciBzdG9yYWdlUHJvYmxlbSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuYWRhcHRpdmVJZCArIFwiUHJvYmxlbVwiKTtcbiAgICAgICAgaWYgKHN0b3JhZ2VQcm9ibGVtID09IHRoaXMuZGl2aWQpIHtcbiAgICAgICAgICAgIC8vIEFscmVhZHkgaW4gdGhpcyBwcm9ibGVtXG4gICAgICAgICAgICB0aGlzLmNoZWNrQ291bnQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcbiAgICAgICAgICAgICAgICB0aGlzLmFkYXB0aXZlSWQgKyB0aGlzLmRpdmlkICsgXCJDb3VudFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tDb3VudCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrQ291bnQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvdW50ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXG4gICAgICAgICAgICB0aGlzLmFkYXB0aXZlSWQgKyB0aGlzLmRpdmlkICsgXCJDb3VudFwiXG4gICAgICAgICk7XG4gICAgICAgIGlmIChjb3VudCA9PSB1bmRlZmluZWQgfHwgY291bnQgPT0gXCJOYU5cIikge1xuICAgICAgICAgICAgY291bnQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hlY2tDb3VudCA9IGNvdW50O1xuICAgICAgICB0aGlzLnJlY2VudEF0dGVtcHRzID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXG4gICAgICAgICAgICB0aGlzLmFkYXB0aXZlSWQgKyBcInJlY2VudEF0dGVtcHRzXCJcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKHRoaXMucmVjZW50QXR0ZW1wdHMgPT0gdW5kZWZpbmVkIHx8IHRoaXMucmVjZW50QXR0ZW1wdHMgPT0gXCJOYU5cIikge1xuICAgICAgICAgICAgdGhpcy5yZWNlbnRBdHRlbXB0cyA9IDM7XG4gICAgICAgIH1cbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICB0aGlzLmFkYXB0aXZlSWQgKyBcInJlY2VudEF0dGVtcHRzXCIsXG4gICAgICAgICAgICB0aGlzLnJlY2VudEF0dGVtcHRzXG4gICAgICAgICk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuYWRhcHRpdmVJZCArIFwiUHJvYmxlbVwiLCB0aGlzLmRpdmlkKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICB0aGlzLmFkYXB0aXZlSWQgKyB0aGlzLmRpdmlkICsgXCJDb3VudFwiLFxuICAgICAgICAgICAgdGhpcy5jaGVja0NvdW50XG4gICAgICAgICk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuYWRhcHRpdmVJZCArIFwiU29sdmVkXCIsIGZhbHNlKTtcbiAgICB9XG4gICAgLy8gUmV0dXJuIGEgYm9vbGVhbiBvZiB3aGV0aGVyIHRoZSB1c2VyIG11c3QgZGVhbCB3aXRoIGluZGVudGF0aW9uXG4gICAgdXNlc0luZGVudGF0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5ub2luZGVudCB8fCB0aGlzLnNvbHV0aW9uSW5kZW50KCkgPT0gMCkge1xuICAgICAgICAgICAgLy8gd2FzICQodGhpcy5hbnN3ZXJBcmVhKS5oYXNDbGFzcyhcImFuc3dlclwiKSAtIGJqZSBjaGFuZ2VkXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBGaW5kIGEgZGlzdHJhY3RvciB0byByZW1vdmUgdG8gbWFrZSB0aGUgcHJvYmxlbSBlYXNpZXJcbiAgICAvLyAgKiB0cnkgZmlyc3QgaW4gdGhlIGFuc3dlciBhcmVhXG4gICAgLy8gICogaWYgbm90LCB0cnkgdGhlIHNvdXJjZSBhcmVhXG4gICAgLy8gICogaWYgbm90LCByZXR1cm4gdW5kZWZpbmVkXG4gICAgZGlzdHJhY3RvclRvUmVtb3ZlKCkge1xuICAgICAgICB2YXIgYmxvY2tzID0gdGhpcy5lbmFibGVkQW5zd2VyQmxvY2tzKCk7XG4gICAgICAgIHZhciBibG9jaztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJsb2NrID0gYmxvY2tzW2ldO1xuICAgICAgICAgICAgaWYgKGJsb2NrLmlzRGlzdHJhY3RvcigpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJsb2NrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJsb2NrcyA9IHRoaXMuZW5hYmxlZFNvdXJjZUJsb2NrcygpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYmxvY2sgPSBibG9ja3NbaV07XG4gICAgICAgICAgICBpZiAoYmxvY2suaXNEaXN0cmFjdG9yKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmxvY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8gUmV0dXJuIHRoZSBudW1iZXIgb2YgYmxvY2tzIHRoYXQgZXhpc3RcbiAgICBudW1iZXJPZkJsb2NrcyhmSW5jbHVkZURpc3RyYWN0b3JzID0gdHJ1ZSkge1xuICAgICAgICB2YXIgbnVtYmVyT2ZCbG9ja3MgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdGhpcy5ibG9ja3NbaV0uZW5hYmxlZCgpICYmXG4gICAgICAgICAgICAgICAgKGZJbmNsdWRlRGlzdHJhY3RvcnMgfHwgIXRoaXMuYmxvY2tzW2ldLmlzRGlzdHJhY3RvcigpKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgbnVtYmVyT2ZCbG9ja3MgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVtYmVyT2ZCbG9ja3M7XG4gICAgfVxuICAgIC8vIFJlbW92ZSB0aGlzIGRpc3RyYWN0b3JzIHRvIG1ha2UgdGhlIHByb2JsZW0gZWFzaWVyXG4gICAgcmVtb3ZlRGlzdHJhY3RvcihibG9jaykge1xuICAgICAgICAvLyBBbGVydCB0aGUgdXNlciB0byB3aGF0IGlzIGhhcHBlbmluZ1xuICAgICAgICB2YXIgZmVlZGJhY2tBcmVhID0gJCh0aGlzLm1lc3NhZ2VEaXYpO1xuICAgICAgICBmZWVkYmFja0FyZWEuZmFkZUluKDUwMCk7XG4gICAgICAgIGZlZWRiYWNrQXJlYS5hdHRyKFwiY2xhc3NcIiwgXCJhbGVydCBhbGVydC1pbmZvXCIpO1xuICAgICAgICBmZWVkYmFja0FyZWEuaHRtbCgkLmkxOG4oXCJtc2dfcGFyc29uX25vdF9zb2x1dGlvblwiKSk7XG4gICAgICAgIC8vIFN0b3AgYWJpbGl0eSB0byBzZWxlY3RcbiAgICAgICAgaWYgKGJsb2NrLmxpbmVzWzBdLmRpc3RyYWN0SGVscHRleHQpIHtcbiAgICAgICAgICAgIGJsb2NrLnZpZXcuc2V0QXR0cmlidXRlKFwiZGF0YS10b2dnbGVcIiwgXCJ0b29sdGlwXCIpO1xuICAgICAgICAgICAgYmxvY2sudmlldy5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBibG9jay5saW5lc1swXS5kaXN0cmFjdEhlbHB0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBibG9jay5kaXNhYmxlKCk7XG4gICAgICAgIC8vIElmIGluIGFuc3dlciBhcmVhLCBtb3ZlIHRvIHNvdXJjZSBhcmVhXG4gICAgICAgIGlmICghYmxvY2suaW5Tb3VyY2VBcmVhKCkpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2VSZWN0ID0gdGhpcy5zb3VyY2VBcmVhLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgdmFyIHN0YXJ0WCA9IGJsb2NrLnBhZ2VYQ2VudGVyKCkgLSAxO1xuICAgICAgICAgICAgdmFyIHN0YXJ0WSA9IGJsb2NrLnBhZ2VZQ2VudGVyKCk7XG4gICAgICAgICAgICB2YXIgZW5kWCA9XG4gICAgICAgICAgICAgICAgc291cmNlUmVjdC5sZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0ICsgc291cmNlUmVjdC53aWR0aCAvIDI7XG4gICAgICAgICAgICB2YXIgZW5kWSA9XG4gICAgICAgICAgICAgICAgc291cmNlUmVjdC50b3AgK1xuICAgICAgICAgICAgICAgIHdpbmRvdy5wYWdlWU9mZnNldCArXG4gICAgICAgICAgICAgICAgYmxvY2sudmlldy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgdmFyIHNsaWRlVW5kZXJCbG9jayA9IGJsb2NrLnNsaWRlVW5kZXJCbG9jaygpO1xuICAgICAgICAgICAgaWYgKHNsaWRlVW5kZXJCbG9jayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZW5kWSArPVxuICAgICAgICAgICAgICAgICAgICBzbGlkZVVuZGVyQmxvY2sudmlldy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyAyMDtcbiAgICAgICAgICAgICAgICBlbmRZICs9IHBhcnNlSW50KCQoc2xpZGVVbmRlckJsb2NrLnZpZXcpLmNzcyhcInRvcFwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICAkKGJsb2NrLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgXCJib3JkZXItY29sb3JcIjogXCIjMDAwXCIsXG4gICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiI2ZmZlwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKGJsb2NrLnZpZXcpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEuMCxcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogTWF0aC5zcXJ0KFxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coZW5kWSAtIHN0YXJ0WSwgMikgK1xuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coZW5kWCAtIHN0YXJ0WCwgMilcbiAgICAgICAgICAgICAgICAgICAgKSAqXG4gICAgICAgICAgICAgICAgICAgIDQgK1xuICAgICAgICAgICAgICAgICAgICA1MDAsXG4gICAgICAgICAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vdmluZyA9IGJsb2NrO1xuICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vdmluZ1ggPSBzdGFydFg7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQubW92aW5nWSA9IHN0YXJ0WTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwcm9ncmVzczogZnVuY3Rpb24oYSwgcCwgYykge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vdmluZ1ggPSBzdGFydFggKiAoMSAtIHApICsgZW5kWCAqIHA7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQubW92aW5nWSA9IHN0YXJ0WSAqICgxIC0gcCkgKyBlbmRZICogcDtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGF0Lm1vdmluZztcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoYXQubW92aW5nWDtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoYXQubW92aW5nWTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgICQoYmxvY2sudmlldykuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjMsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJvcmRlci1jb2xvclwiOiBcIiNkM2QzZDNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIiNlZmVmZWZcIixcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDEwMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChibG9jay52aWV3KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvcmRlci1jb2xvclwiOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGJsb2NrLnZpZXcpLmFkZENsYXNzKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKGJsb2NrLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgXCJib3JkZXItY29sb3JcIjogXCIjMDAwXCIsXG4gICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiI2ZmZlwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKGJsb2NrLnZpZXcpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuMyxcbiAgICAgICAgICAgICAgICBcImJvcmRlci1jb2xvclwiOiBcIiNkM2QzZDNcIixcbiAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogXCIjZWZlZmVmXCIsXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDIwMDAsXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKGJsb2NrLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImJvcmRlci1jb2xvclwiOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBHaXZlIHRoZSB1c2VyIHRoZSBpbmRlbnRhdGlvblxuICAgIHJlbW92ZUluZGVudGF0aW9uKCkge1xuICAgICAgICAvLyBBbGVydCB0aGUgdXNlciB0byB3aGF0IGlzIGhhcHBlbmluZ1xuICAgICAgICB2YXIgZmVlZGJhY2tBcmVhID0gJCh0aGlzLm1lc3NhZ2VEaXYpO1xuICAgICAgICBmZWVkYmFja0FyZWEuZmFkZUluKDUwMCk7XG4gICAgICAgIGZlZWRiYWNrQXJlYS5hdHRyKFwiY2xhc3NcIiwgXCJhbGVydCBhbGVydC1pbmZvXCIpO1xuICAgICAgICBmZWVkYmFja0FyZWEuaHRtbCgkLmkxOG4oXCJtc2dfcGFyc29uX3Byb3ZpZGVkX2luZGVudFwiKSk7XG4gICAgICAgIC8vIE1vdmUgYW5kIHJlc2l6ZSBibG9ja3NcbiAgICAgICAgdmFyIGJsb2NrV2lkdGggPSAyMDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGxpbmUgPSB0aGlzLmxpbmVzW2ldO1xuICAgICAgICAgICAgdmFyIGV4cGFuZGVkV2lkdGggPVxuICAgICAgICAgICAgICAgIGxpbmUud2lkdGggKyBsaW5lLmluZGVudCAqIHRoaXMub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQgKyAzMDtcbiAgICAgICAgICAgIGJsb2NrV2lkdGggPSBNYXRoLm1heChibG9ja1dpZHRoLCBleHBhbmRlZFdpZHRoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm51bWJlcmVkICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgYmxvY2tXaWR0aCArPSAyNTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFyZWFXaWR0aCA9IGJsb2NrV2lkdGggKyAyMjtcbiAgICAgICAgdmFyIGJsb2NrLCBpbmRlbnQ7XG4gICAgICAgIHZhciBzb3VyY2VCbG9ja3MgPSB0aGlzLnNvdXJjZUJsb2NrcygpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNvdXJjZUJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYmxvY2sgPSBzb3VyY2VCbG9ja3NbaV07XG4gICAgICAgICAgICBpbmRlbnQgPSBibG9jay5zb2x1dGlvbkluZGVudCgpO1xuICAgICAgICAgICAgaWYgKGluZGVudCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgJChibG9jay52aWV3KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGJsb2NrV2lkdGgsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChibG9jay52aWV3KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGJsb2NrV2lkdGggLSBpbmRlbnQgKiB0aGlzLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50LFxuICAgICAgICAgICAgICAgICAgICBcInBhZGRpbmctbGVmdFwiOiBpbmRlbnQgKiB0aGlzLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50ICsgMTAsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGFpcmVkRGl2cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgJCh0aGlzLnBhaXJlZERpdnNbaV0pLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIHdpZHRoOiBibG9ja1dpZHRoICsgMzQsXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDEwMDAsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYW5zd2VyQmxvY2tzID0gdGhpcy5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbnN3ZXJCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJsb2NrID0gYW5zd2VyQmxvY2tzW2ldO1xuICAgICAgICAgICAgaW5kZW50ID0gYmxvY2suc29sdXRpb25JbmRlbnQoKTtcbiAgICAgICAgICAgIGlmIChpbmRlbnQgPT0gMCkge1xuICAgICAgICAgICAgICAgICQoYmxvY2sudmlldykuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBibG9ja1dpZHRoLFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDEwMDAsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoYmxvY2sudmlldykuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBibG9ja1dpZHRoIC0gaW5kZW50ICogdGhpcy5vcHRpb25zLnBpeGVsc1BlckluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgXCJwYWRkaW5nLWxlZnRcIjogaW5kZW50ICogdGhpcy5vcHRpb25zLnBpeGVsc1BlckluZGVudCArIDEwLFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDEwMDAsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmVzaXplIGFuc3dlciBhbmQgc291cmNlIGFyZWFcbiAgICAgICAgJCh0aGlzLmFuc3dlckFyZWEpLnJlbW92ZUNsYXNzKFwiYW5zd2VyMSBhbnN3ZXIyIGFuc3dlcjMgYW5zd2VyNFwiKTtcbiAgICAgICAgJCh0aGlzLmFuc3dlckFyZWEpLmFkZENsYXNzKFwiYW5zd2VyXCIpO1xuICAgICAgICB0aGlzLmluZGVudCA9IDA7XG4gICAgICAgIHRoaXMubm9pbmRlbnQgPSB0cnVlO1xuICAgICAgICAkKHRoaXMuc291cmNlQXJlYSkuYW5pbWF0ZSh7XG4gICAgICAgICAgICB3aWR0aDogdGhpcy5hcmVhV2lkdGggKyAyLFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgfSk7XG4gICAgICAgICQodGhpcy5hbnN3ZXJBcmVhKS5hbmltYXRlKHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmFyZWFXaWR0aCArIDIsXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gQ2hhbmdlIHRoZSBtb2RlbCAod2l0aCB2aWV3KVxuICAgICAgICAkKHRoaXMuYW5zd2VyQXJlYSkuYW5pbWF0ZSh7XG4gICAgICAgICAgICBvcGFjaXR5OiAxLjAsXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiAxMTAwLFxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICQodGhpcy5hbnN3ZXJBcmVhKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBcIlwiLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgbW9kZWxcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNvdXJjZUJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2VCbG9ja3NbaV0uYWRkSW5kZW50KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW5zd2VyQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuc3dlckJsb2Nrc1tpXS5hZGRJbmRlbnQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBmaXJzdCBjaGVjayBpZiBhbnkgc29sdXRpb24gYmxvY2tzIGFyZSBpbiB0aGUgc291cmNlIHN0aWxsIChsZWZ0IHNpZGUpIGFuZCBub3RcbiAgICAvLyBpbiB0aGUgYW5zd2VyXG4gICAgZ2V0U29sdXRpb25CbG9ja0luU291cmNlKCkge1xuICAgICAgICB2YXIgc29sdXRpb25CbG9ja3MgPSB0aGlzLnNvbHV0aW9uQmxvY2tzKCk7XG4gICAgICAgIHZhciBhbnN3ZXJCbG9ja3MgPSB0aGlzLmFuc3dlckJsb2NrcygpO1xuICAgICAgICB2YXIgc291cmNlQmxvY2tzID0gdGhpcy5zb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgdmFyIHNvbEJsb2NrID0gbnVsbDtcbiAgICAgICAgdmFyIGN1cnJCbG9jayA9IG51bGw7XG5cbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHNvdXJjZUJsb2NrcyBhbmQgcmV0dXJuIGEgYmxvY2sgaWYgaXQgaXMgbm90IGluIHRoZSBzb2x1dGlvblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZUJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy8gZ2V0IHRoZSBjdXJyZW50IGJsb2NrIGZyb20gdGhlIHNvdXJjZVxuICAgICAgICAgICAgY3VyckJsb2NrID0gc291cmNlQmxvY2tzW2ldO1xuXG4gICAgICAgICAgICAvLyBpZiBjdXJyQmxvY2sgaXMgaW4gdGhlIHNvbHV0aW9uIGFuZCBpc24ndCB0aGUgZmlyc3QgYmxvY2sgYW5kIGlzbid0IGluIHRoZSBhbnN3ZXJcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBzb2x1dGlvbkJsb2Nrcy5pbmRleE9mKGN1cnJCbG9jaykgPiAwICYmXG4gICAgICAgICAgICAgICAgYW5zd2VyQmxvY2tzLmluZGV4T2YoY3VyckJsb2NrKSA8IDBcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdXJyQmxvY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gZGlkbid0IGZpbmQgYW55IGJsb2NrIGluIHRoZSBzb3VyY2UgdGhhdCBpcyBpbiB0aGUgc29sdXRpb25cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gRmluZCBhIGJsb2NrMiB0aGF0IGlzIGZ1cnRoZXN0IGZyb20gYmxvY2sxIGluIHRoZSBhbnN3ZXJcbiAgICAvLyBkb24ndCB1c2UgdGhlIHZlcnkgZmlyc3QgYmxvY2sgaW4gdGhlIHNvbHV0aW9uIGFzIGJsb2NrMlxuICAgIGdldEZ1cnRoZXN0QmxvY2soKSB7XG4gICAgICAgIHZhciBzb2x1dGlvbkJsb2NrcyA9IHRoaXMuc29sdXRpb25CbG9ja3MoKTtcbiAgICAgICAgdmFyIGFuc3dlckJsb2NrcyA9IHRoaXMuYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgIHZhciBtYXhEaXN0ID0gMDtcbiAgICAgICAgdmFyIGRpc3QgPSAwO1xuICAgICAgICB2YXIgbWF4QmxvY2sgPSBudWxsO1xuICAgICAgICB2YXIgY3VyckJsb2NrID0gbnVsbDtcbiAgICAgICAgdmFyIGluZGV4U29sID0gMDtcbiAgICAgICAgdmFyIHByZXZCbG9jayA9IG51bGw7XG4gICAgICAgIHZhciBpbmRleFByZXYgPSAwO1xuXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYmxvY2tzIGluIHRoZSBhbnN3ZXJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbnN3ZXJCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGN1cnJCbG9jayA9IGFuc3dlckJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGluZGV4U29sID0gc29sdXRpb25CbG9ja3MuaW5kZXhPZihjdXJyQmxvY2spO1xuICAgICAgICAgICAgaWYgKGluZGV4U29sID4gMCkge1xuICAgICAgICAgICAgICAgIHByZXZCbG9jayA9IHNvbHV0aW9uQmxvY2tzW2luZGV4U29sIC0gMV07XG4gICAgICAgICAgICAgICAgaW5kZXhQcmV2ID0gYW5zd2VyQmxvY2tzLmluZGV4T2YocHJldkJsb2NrKTtcbiAgICAgICAgICAgICAgICAvL2FsZXJ0KFwibXkgaW5kZXggXCIgKyBpICsgXCIgaW5kZXggcHJldiBcIiArIGluZGV4UHJldik7XG5cbiAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIGRpc3RhbmNlIGluIHRoZSBhbnN3ZXJcbiAgICAgICAgICAgICAgICBkaXN0ID0gTWF0aC5hYnMoaSAtIGluZGV4UHJldik7XG4gICAgICAgICAgICAgICAgaWYgKGRpc3QgPiBtYXhEaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIG1heERpc3QgPSBkaXN0O1xuICAgICAgICAgICAgICAgICAgICBtYXhCbG9jayA9IGN1cnJCbG9jaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1heEJsb2NrO1xuICAgIH1cblxuICAgIC8vIENvbWJpbmUgYmxvY2tzIHRvZ2V0aGVyXG4gICAgY29tYmluZUJsb2NrcygpIHtcbiAgICAgICAgdmFyIHNvbHV0aW9uQmxvY2tzID0gdGhpcy5zb2x1dGlvbkJsb2NrcygpO1xuICAgICAgICB2YXIgYW5zd2VyQmxvY2tzID0gdGhpcy5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgdmFyIHNvdXJjZUJsb2NrcyA9IHRoaXMuc291cmNlQmxvY2tzKCk7XG5cbiAgICAgICAgLy8gQWxlcnQgdGhlIHVzZXIgdG8gd2hhdCBpcyBoYXBwZW5pbmdcbiAgICAgICAgdmFyIGZlZWRiYWNrQXJlYSA9ICQodGhpcy5tZXNzYWdlRGl2KTtcbiAgICAgICAgZmVlZGJhY2tBcmVhLmZhZGVJbig1MDApO1xuICAgICAgICBmZWVkYmFja0FyZWEuYXR0cihcImNsYXNzXCIsIFwiYWxlcnQgYWxlcnQtaW5mb1wiKTtcbiAgICAgICAgZmVlZGJhY2tBcmVhLmh0bWwoJC5pMThuKFwibXNnX3BhcnNvbl9jb21iaW5lZF9ibG9ja3NcIikpO1xuICAgICAgICB2YXIgYmxvY2sxID0gbnVsbDtcbiAgICAgICAgdmFyIGJsb2NrMiA9IG51bGw7XG5cbiAgICAgICAgLy8gZ2V0IGEgc29sdXRpb24gYmxvY2sgdGhhdCBpcyBzdGlsbCBpbiBzb3VyY2UgKG5vdCBhbnN3ZXIpLCBpZiBhbnlcbiAgICAgICAgYmxvY2syID0gdGhpcy5nZXRTb2x1dGlvbkJsb2NrSW5Tb3VyY2UoKTtcblxuICAgICAgICAvLyBpZiBub25lIGluIHNvdXJjZSBnZXQgYmxvY2sgdGhhdCBpcyBmdXJ0aGVzdCBmcm9tIGJsb2NrMVxuICAgICAgICBpZiAoYmxvY2syID09IG51bGwpIHtcbiAgICAgICAgICAgIGJsb2NrMiA9IHRoaXMuZ2V0RnVydGhlc3RCbG9jaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZ2V0IGJsb2NrMSAoYWJvdmUgYmxvY2syKSBpbiBzb2x1dGlvblxuICAgICAgICB2YXIgaW5kZXggPSBzb2x1dGlvbkJsb2Nrcy5pbmRleE9mKGJsb2NrMik7XG4gICAgICAgIGJsb2NrMSA9IHNvbHV0aW9uQmxvY2tzW2luZGV4IC0gMV07XG5cbiAgICAgICAgLy8gZ2V0IGluZGV4IG9mIGVhY2ggaW4gYW5zd2VyXG4gICAgICAgIHZhciBpbmRleDEgPSBhbnN3ZXJCbG9ja3MuaW5kZXhPZihibG9jazEpO1xuICAgICAgICB2YXIgaW5kZXgyID0gYW5zd2VyQmxvY2tzLmluZGV4T2YoYmxvY2syKTtcbiAgICAgICAgdmFyIG1vdmUgPSBmYWxzZTtcblxuICAgICAgICAvLyBpZiBib3RoIGluIGFuc3dlciBzZXQgbW92ZSBiYXNlZCBvbiBpZiBkaXJlY3RseSBhYm92ZSBlYWNoIG90aGVyXG4gICAgICAgIGlmIChpbmRleDEgPj0gMCAmJiBpbmRleDIgPj0gMCkge1xuICAgICAgICAgICAgbW92ZSA9IGluZGV4MSArIDEgIT09IGluZGV4MjtcblxuICAgICAgICAgICAgLy8gZWxzZSBpZiBib3RoIGluIHNvdXJjZSBzZXQgbW92ZSBhZ2FpbiBiYXNlZCBvbiBpZiBhYm92ZSBlYWNoIG90aGVyXG4gICAgICAgIH0gZWxzZSBpZiAoaW5kZXgxIDwgMCAmJiBpbmRleDIgPCAwKSB7XG4gICAgICAgICAgICBpbmRleDEgPSBzb3VyY2VCbG9ja3MuaW5kZXhPZihibG9jazEpO1xuICAgICAgICAgICAgaW5kZXgyID0gc291cmNlQmxvY2tzLmluZGV4T2YoYmxvY2syKTtcbiAgICAgICAgICAgIG1vdmUgPSBpbmRleDEgKyAxICE9PSBpbmRleDI7XG5cbiAgICAgICAgICAgIC8vIG9uZSBpbiBzb3VyY2UgYW5kIG9uZSBpbiBhbnN3ZXIgc28gbXVzdCBtb3ZlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtb3ZlID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChpbmRleDEgPCAwKSB7XG4gICAgICAgICAgICAgICAgaW5kZXgxID0gc291cmNlQmxvY2tzLmluZGV4T2YoYmxvY2sxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbmRleDIgPCAwKSB7XG4gICAgICAgICAgICAgICAgaW5kZXgyID0gc291cmNlQmxvY2tzLmluZGV4T2YoYmxvY2syKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdWJ0cmFjdCA9IGluZGV4MiA8IGluZGV4MTsgLy8gaXMgYmxvY2syIGhpZ2hlclxuXG4gICAgICAgIGlmIChtb3ZlKSB7XG4gICAgICAgICAgICAvLyBNb3ZlIHRoZSBibG9ja1xuICAgICAgICAgICAgdmFyIHN0YXJ0WCA9IGJsb2NrMi5wYWdlWENlbnRlcigpIC0gMTtcbiAgICAgICAgICAgIHZhciBzdGFydFkgPSBibG9jazIucGFnZVlDZW50ZXIoKTtcbiAgICAgICAgICAgIHZhciBlbmRYID0gYmxvY2sxLnBhZ2VYQ2VudGVyKCkgLSAxO1xuICAgICAgICAgICAgdmFyIGVuZFkgPVxuICAgICAgICAgICAgICAgIGJsb2NrMS5wYWdlWUNlbnRlcigpICtcbiAgICAgICAgICAgICAgICBibG9jazEudmlldy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgLyAyICtcbiAgICAgICAgICAgICAgICA1O1xuICAgICAgICAgICAgaWYgKHN1YnRyYWN0KSB7XG4gICAgICAgICAgICAgICAgZW5kWSAtPSBibG9jazIudmlldy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbmRZICs9IGJsb2NrMi52aWV3LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCAvIDI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICAkKGJsb2NrMi52aWV3KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLCAvLyAxIHNlY2NvbmRcbiAgICAgICAgICAgICAgICBzdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQoYmxvY2sxLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImJvcmRlci1jb2xvclwiOiBcIiMwMDBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIiNmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICQoYmxvY2syLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImJvcmRlci1jb2xvclwiOiBcIiMwMDBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIiNmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrMi5saW5lc1swXS5pbmRleCArPSAxMDAwO1xuICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vdmluZyA9IGJsb2NrMjtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZpbmdYID0gc3RhcnRYO1xuICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vdmluZ1kgPSBzdGFydFk7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQudXBkYXRlVmlldygpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IGZ1bmN0aW9uKGEsIHAsIGMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZpbmdYID0gc3RhcnRYICogKDEgLSBwKSArIGVuZFggKiBwO1xuICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vdmluZ1kgPSBzdGFydFkgKiAoMSAtIHApICsgZW5kWSAqIHA7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQudXBkYXRlVmlldygpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhhdC5tb3Zpbmc7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGF0Lm1vdmluZ1g7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGF0Lm1vdmluZ1k7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQudXBkYXRlVmlldygpO1xuICAgICAgICAgICAgICAgICAgICBibG9jazIubGluZXNbMF0uaW5kZXggLT0gMTAwMDtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sxLmNvbnN1bWVCbG9jayhibG9jazIpO1xuICAgICAgICAgICAgICAgICAgICAkKGJsb2NrMS52aWV3KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6IFwiI2QzZDNkM1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiI2VmZWZlZlwiLFxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGJsb2NrMS52aWV3KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvcmRlci1jb2xvclwiOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoYmxvY2syLnZpZXcpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDEwMDAsXG4gICAgICAgICAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKGJsb2NrMS52aWV3KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJib3JkZXItY29sb3JcIjogXCIjMDAwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogXCIjZmZmXCIsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAkKGJsb2NrMi52aWV3KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJib3JkZXItY29sb3JcIjogXCIjMDAwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogXCIjZmZmXCIsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBibG9jazEuY29uc3VtZUJsb2NrKGJsb2NrMik7XG4gICAgICAgICAgICAgICAgICAgICQoYmxvY2sxLnZpZXcpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJib3JkZXItY29sb3JcIjogXCIjZDNkM2QzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogXCIjZWZlZmVmXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoYmxvY2sxLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEFkYXB0IHRoZSBwcm9ibGVtIHRvIGJlIGVhc2llclxuICAgIC8vICAqIHJlbW92ZSBhIGRpc3RyYWN0b3IgdW50aWwgbm9uZSBhcmUgcHJlc2VudFxuICAgIC8vICAqIGNvbWJpbmUgYmxvY2tzIHVudGlsIDMgYXJlIGxlZnRcbiAgICBtYWtlRWFzaWVyKCkge1xuICAgICAgICB2YXIgZGlzdHJhY3RvclRvUmVtb3ZlID0gdGhpcy5kaXN0cmFjdG9yVG9SZW1vdmUoKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgZGlzdHJhY3RvclRvUmVtb3ZlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgICFkaXN0cmFjdG9yVG9SZW1vdmUuaW5Tb3VyY2VBcmVhKClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBhbGVydCgkLmkxOG4oXCJtc2dfcGFyc29uX3JlbW92ZV9pbmNvcnJlY3RcIikpO1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVEaXN0cmFjdG9yKGRpc3RyYWN0b3JUb1JlbW92ZSk7XG4gICAgICAgICAgICB0aGlzLmxvZ01vdmUoXCJyZW1vdmVkRGlzdHJhY3Rvci1cIiArIGRpc3RyYWN0b3JUb1JlbW92ZS5oYXNoKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG51bWJlck9mQmxvY2tzID0gdGhpcy5udW1iZXJPZkJsb2NrcyhmYWxzZSk7XG4gICAgICAgICAgICBpZiAobnVtYmVyT2ZCbG9ja3MgPiAzKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoJC5pMThuKFwibXNnX3BhcnNvbl93aWxsX2NvbWJpbmVcIikpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29tYmluZUJsb2NrcygpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9nTW92ZShcImNvbWJpbmVkQmxvY2tzXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyplbHNlIGlmKHRoaXMubnVtYmVyT2ZCbG9ja3ModHJ1ZSkgPiAzICYmIGRpc3RyYWN0b3JUb1JlbW92ZSAhPT0gIHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJXaWxsIHJlbW92ZSBhbiBpbmNvcnJlY3QgY29kZSBibG9jayBmcm9tIHNvdXJjZSBhcmVhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVEaXN0cmFjdG9yKGRpc3RyYWN0b3JUb1JlbW92ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ01vdmUoXCJyZW1vdmVkRGlzdHJhY3Rvci1cIiArIGRpc3RyYWN0b3JUb1JlbW92ZS5oYXNoKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICB9ICovXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGVydCgkLmkxOG4oXCJtc2dfcGFyc29uX3RocmVlX2Jsb2Nrc19sZWZ0XCIpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbkhlbHAgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vaWYgKG51bWJlck9mQmxvY2tzIDwgNSkge1xuICAgICAgICAgICAgLy9cdHRoaXMuY2FuSGVscCA9IGZhbHNlO1xuICAgICAgICAgICAgLy9cdHRoaXMuaGVscEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBUaGUgXCJIZWxwIE1lXCIgYnV0dG9uIHdhcyBwcmVzc2VkIGFuZCB0aGUgcHJvYmxlbSBzaG91bGQgYmUgc2ltcGxpZmllZFxuICAgIGhlbHBNZSgpIHtcbiAgICAgICAgdGhpcy5jbGVhckZlZWRiYWNrKCk7XG4gICAgICAgIC8vdGhpcy5oZWxwQ291bnQgPSAtMTsgLy8gYW1vdW50IHRvIGFsbG93IGZvciBtdWx0aXBsZSBoZWxwcyBpbiBhIHJvd1xuICAgICAgICAvL2lmICh0aGlzLmhlbHBDb3VudCA8IDApIHtcbiAgICAgICAgLy9cdHRoaXMuaGVscENvdW50ID0gTWF0aC5tYXgodGhpcy5oZWxwQ291bnQsIC0xKTsgLy8gbWluIDEgYXR0ZW1wdCBiZWZvcmUgbW9yZSBoZWxwXG4gICAgICAgIC8vdGhpcy5oZWxwQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgLy99XG4gICAgICAgIC8vIGlmIGxlc3MgdGhhbiAzIGF0dGVtcHRzXG4gICAgICAgIGlmICh0aGlzLm51bURpc3RpbmN0IDwgMykge1xuICAgICAgICAgICAgYWxlcnQoJC5pMThuKFwibXNnX3BhcnNvbl9hdGxlYXN0X3RocmVlX2F0dGVtcHRzXCIpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBvdGhlcndpc2UgZ2l2ZSBoZWxwXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nb3RIZWxwID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubWFrZUVhc2llcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gVVRJTElUWSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuICAgIC8vIFJldHVybiBhIGRhdGUgZnJvbSBhIHRpbWVzdGFtcCAoZWl0aGVyIG15U1FMIG9yIEpTIGZvcm1hdClcbiAgICBkYXRlRnJvbVRpbWVzdGFtcCh0aW1lc3RhbXApIHtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh0aW1lc3RhbXApO1xuICAgICAgICBpZiAoaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKSB7XG4gICAgICAgICAgICB2YXIgdCA9IHRpbWVzdGFtcC5zcGxpdCgvWy0gOl0vKTtcbiAgICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZSh0WzBdLCB0WzFdIC0gMSwgdFsyXSwgdFszXSwgdFs0XSwgdFs1XSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuICAgIC8vIEEgZnVuY3Rpb24gZm9yIHJldHVybmluZyBhIHNodWZmbGVkIHZlcnNpb24gb2YgYW4gYXJyYXlcbiAgICBzaHVmZmxlZChhcnJheSkge1xuICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoO1xuICAgICAgICB2YXIgcmV0dXJuQXJyYXkgPSBhcnJheS5zbGljZSgpO1xuICAgICAgICB2YXIgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4O1xuICAgICAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZS4uLlxuICAgICAgICB3aGlsZSAoMCAhPT0gY3VycmVudEluZGV4KSB7XG4gICAgICAgICAgICAvLyBQaWNrIGEgcmVtYWluaW5nIGVsZW1lbnQuLi5cbiAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xuICAgICAgICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSByZXR1cm5BcnJheVtjdXJyZW50SW5kZXhdO1xuICAgICAgICAgICAgcmV0dXJuQXJyYXlbY3VycmVudEluZGV4XSA9IHJldHVybkFycmF5W3JhbmRvbUluZGV4XTtcbiAgICAgICAgICAgIHJldHVybkFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXR1cm5BcnJheTtcbiAgICB9XG4gICAgLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSBLRVlCT0FSRCBJTlRFUkFDVElPTiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgLy8gV2hlbiB0aGUgdXNlciBoYXMgZW50ZXJlZCB0aGUgUGFyc29ucyBwcm9ibGVtIHZpYSBrZXlib2FyZCBtb2RlXG4gICAgZW50ZXJLZXlib2FyZE1vZGUoKSB7XG4gICAgICAgICQodGhpcy5rZXlib2FyZFRpcCkuc2hvdygpO1xuICAgICAgICAkKHRoaXMuc291cmNlTGFiZWwpLmhpZGUoKTtcbiAgICAgICAgJCh0aGlzLmFuc3dlckxhYmVsKS5oaWRlKCk7XG4gICAgICAgIHRoaXMuY2xlYXJGZWVkYmFjaygpO1xuICAgIH1cbiAgICAvLyBXaGVuIHRoZSB1c2VyIGxlYXZlcyB0aGUgUGFyc29ucyBwcm9ibGVtIHZpYSBrZXlib2FyZCBtb2RlXG4gICAgZXhpdEtleWJvYXJkTW9kZSgpIHtcbiAgICAgICAgJCh0aGlzLmtleWJvYXJkVGlwKS5oaWRlKCk7XG4gICAgICAgICQodGhpcy5zb3VyY2VMYWJlbCkuc2hvdygpO1xuICAgICAgICAkKHRoaXMuYW5zd2VyTGFiZWwpLnNob3coKTtcbiAgICB9XG4gICAgLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSBWSUVXID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgLy8gQ2xlYXIgYW55IGZlZWRiYWNrIGZyb20gdGhlIGFuc3dlciBhcmVhXG4gICAgY2xlYXJGZWVkYmFjaygpIHtcbiAgICAgICAgJCh0aGlzLmFuc3dlckFyZWEpLnJlbW92ZUNsYXNzKFwiaW5jb3JyZWN0IGNvcnJlY3RcIik7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuYW5zd2VyQXJlYS5jaGlsZE5vZGVzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAkKGNoaWxkcmVuW2ldKS5yZW1vdmVDbGFzcyhcbiAgICAgICAgICAgICAgICBcImNvcnJlY3RQb3NpdGlvbiBpbmNvcnJlY3RQb3NpdGlvbiBpbmRlbnRMZWZ0IGluZGVudFJpZ2h0XCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgJCh0aGlzLm1lc3NhZ2VEaXYpLmhpZGUoKTtcbiAgICB9XG4gICAgLy8gRGlzYWJsZSB0aGUgaW50ZXJmYWNlXG4gICAgYXN5bmMgZGlzYWJsZUludGVyYWN0aW9uKCkge1xuICAgICAgICAvLyBEaXNhYmxlIGJsb2Nrc1xuICAgICAgICBhd2FpdCB0aGlzLmNoZWNrU2VydmVyQ29tcGxldGU7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZGlzYWJsaW5nIGJsb2Nrc1wiKTtcbiAgICAgICAgaWYgKHRoaXMuYmxvY2tzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICBibG9jay5kaXNhYmxlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSGlkZSBidXR0b25zXG4gICAgICAgICQodGhpcy5jaGVja0J1dHRvbikuaGlkZSgpO1xuICAgICAgICAkKHRoaXMucmVzZXRCdXR0b24pLmhpZGUoKTtcbiAgICB9XG4gICAgLy8gQmFzZWQgb24gdGhlIG1vdmluZyBlbGVtZW50LCBldGMuLCBlc3RhYmxpc2ggdGhlIG1vdmluZyBzdGF0ZVxuICAgIC8vICAgcmVzdDogbm90IG1vdmluZ1xuICAgIC8vICAgc291cmNlOiBtb3ZpbmcgaW5zaWRlIHNvdXJjZSBhcmVhXG4gICAgLy8gICBhbnN3ZXI6IG1vdmluZyBpbnNpZGUgYW5zd2VyIGFyZWFcbiAgICAvLyAgIG1vdmluZzogbW92aW5nIG91dHNpZGUgYXJlYXNcbiAgICBtb3ZpbmdTdGF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMubW92aW5nID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIFwicmVzdFwiO1xuICAgICAgICB9XG4gICAgICAgIHZhciB4ID0gdGhpcy5tb3ZpbmdYIC0gd2luZG93LnBhZ2VYT2Zmc2V0O1xuICAgICAgICB2YXIgeSA9IHRoaXMubW92aW5nWSAtIHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgLy8gQ2hlY2sgaWYgaW4gYW5zd2VyIGFyZWFcbiAgICAgICAgdmFyIGJvdW5kcyA9IHRoaXMuYW5zd2VyQXJlYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgeCA+PSBib3VuZHMubGVmdCAmJlxuICAgICAgICAgICAgeCA8PSBib3VuZHMucmlnaHQgJiZcbiAgICAgICAgICAgIHkgPj0gYm91bmRzLnRvcCAmJlxuICAgICAgICAgICAgeSA8PSBib3VuZHMuYm90dG9tXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIFwiYW5zd2VyXCI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2hlY2sgaWYgaW4gc291cmNlIGFyZWFcbiAgICAgICAgYm91bmRzID0gdGhpcy5zb3VyY2VBcmVhLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB4ID49IGJvdW5kcy5sZWZ0ICYmXG4gICAgICAgICAgICB4IDw9IGJvdW5kcy5yaWdodCAmJlxuICAgICAgICAgICAgeSA+PSBib3VuZHMudG9wICYmXG4gICAgICAgICAgICB5IDw9IGJvdW5kcy5ib3R0b21cbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJzb3VyY2VcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJtb3ZpbmdcIjtcbiAgICB9XG4gICAgLy8gVXBkYXRlIHRoZSBQYXJzb25zIHZpZXdcbiAgICAvLyBUaGlzIGdldHMgY2FsbGVkIHdoZW4gZHJhZ2dpbmcgYSBibG9ja1xuICAgIHVwZGF0ZVZpZXcoKSB7XG4gICAgICAgIC8vIEJhc2VkIG9uIHRoZSBuZXcgYW5kIHRoZSBvbGQgc3RhdGUsIGZpZ3VyZSBvdXQgd2hhdCB0byB1cGRhdGVcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgdmFyIG5ld1N0YXRlID0gdGhpcy5tb3ZpbmdTdGF0ZSgpO1xuICAgICAgICB2YXIgdXBkYXRlU291cmNlID0gdHJ1ZTtcbiAgICAgICAgdmFyIHVwZGF0ZUFuc3dlciA9IHRydWU7XG4gICAgICAgIHZhciB1cGRhdGVNb3ZpbmcgPSBuZXdTdGF0ZSA9PSBcIm1vdmluZ1wiO1xuICAgICAgICBpZiAoc3RhdGUgPT0gbmV3U3RhdGUpIHtcbiAgICAgICAgICAgIGlmIChuZXdTdGF0ZSA9PSBcInJlc3RcIikge1xuICAgICAgICAgICAgICAgIHVwZGF0ZVNvdXJjZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHVwZGF0ZUFuc3dlciA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuZXdTdGF0ZSA9PSBcInNvdXJjZVwiKSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlQW5zd2VyID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5ld1N0YXRlID09IFwiYW5zd2VyXCIpIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVTb3VyY2UgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobmV3U3RhdGUgPT0gXCJtb3ZpbmdcIikge1xuICAgICAgICAgICAgICAgIHVwZGF0ZUFuc3dlciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHVwZGF0ZVNvdXJjZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBtb3ZpbmdIZWlnaHQ7XG4gICAgICAgIGlmICh0aGlzLm1vdmluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBNdXN0IGdldCBoZWlnaHQgaGVyZSBhcyBkZXRhY2hlZCBpdGVtcyBkb24ndCBoYXZlIGhlaWdodFxuICAgICAgICAgICAgbW92aW5nSGVpZ2h0ID0gJCh0aGlzLm1vdmluZy52aWV3KS5vdXRlckhlaWdodCh0cnVlKTtcbiAgICAgICAgICAgICQodGhpcy5tb3ZpbmcudmlldykuZGV0YWNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBvc2l0aW9uVG9wLCB3aWR0aDtcbiAgICAgICAgdmFyIGJhc2VXaWR0aCA9IHRoaXMuYXJlYVdpZHRoIC0gMjI7XG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgU291cmNlIEFyZWFcbiAgICAgICAgaWYgKHVwZGF0ZVNvdXJjZSkge1xuICAgICAgICAgICAgcG9zaXRpb25Ub3AgPSAwO1xuICAgICAgICAgICAgdmFyIGJsb2NrcyA9IHRoaXMuc291cmNlQmxvY2tzKCk7XG4gICAgICAgICAgICBpZiAobmV3U3RhdGUgPT0gXCJzb3VyY2VcIikge1xuICAgICAgICAgICAgICAgIHZhciBoYXNJbnNlcnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciBtb3ZpbmdCaW4gPSB0aGlzLm1vdmluZy5wYWlyZWRCaW4oKTtcbiAgICAgICAgICAgICAgICB2YXIgYmluRm9yQmxvY2sgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGJpbkZvckJsb2NrLnB1c2goYmxvY2tzW2ldLnBhaXJlZEJpbigpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFiaW5Gb3JCbG9jay5pbmNsdWRlcyhtb3ZpbmdCaW4pKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdmluZ0JpbiA9IC0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgaW5zZXJ0UG9zaXRpb25zID0gW107XG4gICAgICAgICAgICAgICAgaWYgKGJpbkZvckJsb2NrLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGluc2VydFBvc2l0aW9ucy5wdXNoKDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb3ZpbmdCaW4gPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydFBvc2l0aW9ucy5wdXNoKDApO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGJpbkZvckJsb2NrWzBdID09IG1vdmluZ0Jpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0UG9zaXRpb25zLnB1c2goMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMTsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJpbkZvckJsb2NrW2kgLSAxXSA9PSBtb3ZpbmdCaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRQb3NpdGlvbnMucHVzaChpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYmluRm9yQmxvY2tbaV0gPT0gbW92aW5nQmluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0UG9zaXRpb25zLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdmluZ0JpbiA9PSAtMSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbkZvckJsb2NrW2kgLSAxXSAhPSBiaW5Gb3JCbG9ja1tpXVxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0UG9zaXRpb25zLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vdmluZ0JpbiA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0UG9zaXRpb25zLnB1c2goYmluRm9yQmxvY2subGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGJpbkZvckJsb2NrW2JpbkZvckJsb2NrLmxlbmd0aCAtIDFdID09IG1vdmluZ0JpblxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydFBvc2l0aW9ucy5wdXNoKGJpbkZvckJsb2NrLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHggPVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmluZ1ggLVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZUFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCAtXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5wYWdlWE9mZnNldCAtXG4gICAgICAgICAgICAgICAgICAgIGJhc2VXaWR0aCAvIDIgLVxuICAgICAgICAgICAgICAgICAgICAxMTtcbiAgICAgICAgICAgICAgICB2YXIgeSA9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92aW5nWSAtXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc291cmNlQXJlYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLVxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGo7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaGFzSW5zZXJ0ZWQgJiYgaW5zZXJ0UG9zaXRpb25zLmluY2x1ZGVzKGkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVzdEhlaWdodCA9ICQoaXRlbS52aWV3KS5vdXRlckhlaWdodCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IGkgKyAxOyBqIDwgYmxvY2tzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluc2VydFBvc2l0aW9ucy5pbmNsdWRlcyhqKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdEhlaWdodCArPSAkKGJsb2Nrc1tqXS52aWV3KS5vdXRlckhlaWdodCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5IC0gcG9zaXRpb25Ub3AgPCBtb3ZpbmdIZWlnaHQgKyB0ZXN0SGVpZ2h0IC8gMiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgPT0gaW5zZXJ0UG9zaXRpb25zW2luc2VydFBvc2l0aW9ucy5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzSW5zZXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc291cmNlQXJlYS5pbnNlcnRCZWZvcmUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW92aW5nLnZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0udmlld1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzLm1vdmluZy52aWV3KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiB4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IHkgLSBtb3ZpbmdIZWlnaHQgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogYmFzZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInotaW5kZXhcIjogMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblRvcCA9IHBvc2l0aW9uVG9wICsgbW92aW5nSGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICQoaXRlbS52aWV3KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogcG9zaXRpb25Ub3AsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogYmFzZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6LWluZGV4XCI6IDIsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblRvcCA9IHBvc2l0aW9uVG9wICsgJChpdGVtLnZpZXcpLm91dGVySGVpZ2h0KHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWhhc0luc2VydGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5tb3ZpbmcudmlldykuYXBwZW5kVG8oXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiNcIiArIHRoaXMuY291bnRlcklkICsgXCItc291cmNlXCJcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLm1vdmluZy52aWV3KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogeCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogeSAtICQodGhpcy5tb3Zpbmcudmlldykub3V0ZXJIZWlnaHQodHJ1ZSkgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGJhc2VXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiei1pbmRleFwiOiAzLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0gPSBibG9ja3NbaV07XG4gICAgICAgICAgICAgICAgICAgICQoaXRlbS52aWV3KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogcG9zaXRpb25Ub3AsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogYmFzZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6LWluZGV4XCI6IDIsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblRvcCA9IHBvc2l0aW9uVG9wICsgJChpdGVtLnZpZXcpLm91dGVySGVpZ2h0KHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgUGFpcmVkIERpc3RyYWN0b3IgSW5kaWNhdG9yc1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMucGFpcmVkQmlucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBiaW4gPSB0aGlzLnBhaXJlZEJpbnNbaV07XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoaW5nID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGJsb2Nrcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBibG9jayA9IGJsb2Nrc1tqXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrLm1hdGNoZXNCaW4oYmluKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hpbmcucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGRpdiA9IHRoaXMucGFpcmVkRGl2c1tpXTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hpbmcubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgJChkaXYpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKGRpdikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gLTU7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCArPSBwYXJzZUludChcbiAgICAgICAgICAgICAgICAgICAgICAgICQobWF0Y2hpbmdbbWF0Y2hpbmcubGVuZ3RoIC0gMV0udmlldykuY3NzKFwidG9wXCIpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCAtPSBwYXJzZUludCgkKG1hdGNoaW5nWzBdLnZpZXcpLmNzcyhcInRvcFwiKSk7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCArPSAkKG1hdGNoaW5nW21hdGNoaW5nLmxlbmd0aCAtIDFdLnZpZXcpLm91dGVySGVpZ2h0KFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAkKGRpdikuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IC02LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAkKG1hdGNoaW5nWzBdLnZpZXcpLmNzcyhcInRvcFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBiYXNlV2lkdGggKyAzNCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6LWluZGV4XCI6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRleHQtaW5kZW50XCI6IC0zMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFkZGluZy10b3BcIjogKGhlaWdodCAtIDcwKSAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogXCJ2aXNpYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiA0MyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmVydGljYWwtYWxpZ25cIjogXCJtaWRkbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiM3ZTdlZTdcIixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICQoZGl2KS5odG1sKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCI8c3BhbiBpZD0gJ3N0JyBzdHlsZSA9ICd2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlOyBmb250LXdlaWdodDogYm9sZDsgZm9udC1zaXplOiAxNXB4Jz5vcjwvc3Bhbj57XCJcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoaW5nLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICQoZGl2KS5odG1sKFwiXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBVcGRhdGUgdGhlIEFuc3dlciBBcmVhXG4gICAgICAgIGlmICh1cGRhdGVBbnN3ZXIpIHtcbiAgICAgICAgICAgIHZhciBibG9jaywgaW5kZW50O1xuICAgICAgICAgICAgcG9zaXRpb25Ub3AgPSAwO1xuICAgICAgICAgICAgd2lkdGggPVxuICAgICAgICAgICAgICAgIHRoaXMuYXJlYVdpZHRoICtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGVudCAqIHRoaXMub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQgLVxuICAgICAgICAgICAgICAgIDIyO1xuICAgICAgICAgICAgdmFyIGJsb2NrcyA9IHRoaXMuYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgICAgICBpZiAobmV3U3RhdGUgPT0gXCJhbnN3ZXJcIikge1xuICAgICAgICAgICAgICAgIHZhciBoYXNJbnNlcnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciB4ID1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmdYIC1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbnN3ZXJBcmVhLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgLVxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucGFnZVhPZmZzZXQgLVxuICAgICAgICAgICAgICAgICAgICBiYXNlV2lkdGggLyAyIC1cbiAgICAgICAgICAgICAgICAgICAgMTE7XG4gICAgICAgICAgICAgICAgdmFyIG1vdmluZ0luZGVudCA9IE1hdGgucm91bmQoeCAvIHRoaXMub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQpO1xuICAgICAgICAgICAgICAgIGlmIChtb3ZpbmdJbmRlbnQgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdmluZ0luZGVudCA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtb3ZpbmdJbmRlbnQgPiB0aGlzLmluZGVudCkge1xuICAgICAgICAgICAgICAgICAgICBtb3ZpbmdJbmRlbnQgPSB0aGlzLmluZGVudDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB4ID0gbW92aW5nSW5kZW50ICogdGhpcy5vcHRpb25zLnBpeGVsc1BlckluZGVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHkgPVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmluZ1kgLVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuc3dlckFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC1cbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgICAgICAgICAgIHRoaXMubW92aW5nLmluZGVudCA9IG1vdmluZ0luZGVudDtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrID0gYmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWhhc0luc2VydGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeSAtIHBvc2l0aW9uVG9wIDxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobW92aW5nSGVpZ2h0ICsgJChibG9jay52aWV3KS5vdXRlckhlaWdodCh0cnVlKSkgLyAyXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNJbnNlcnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbnN3ZXJBcmVhLmluc2VydEJlZm9yZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmcudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sudmlld1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzLm1vdmluZy52aWV3KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiB4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IHkgLSBtb3ZpbmdIZWlnaHQgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogYmFzZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInotaW5kZXhcIjogMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblRvcCA9IHBvc2l0aW9uVG9wICsgbW92aW5nSGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGluZGVudCA9IGJsb2NrLmluZGVudCAqIHRoaXMub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQ7XG4gICAgICAgICAgICAgICAgICAgICQoYmxvY2sudmlldykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogcG9zaXRpb25Ub3AsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGggLSBpbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInotaW5kZXhcIjogMixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG9wID0gcG9zaXRpb25Ub3AgKyAkKGJsb2NrLnZpZXcpLm91dGVySGVpZ2h0KHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWhhc0luc2VydGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5tb3ZpbmcudmlldykuYXBwZW5kVG8oXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiNcIiArIHRoaXMuY291bnRlcklkICsgXCItYW5zd2VyXCJcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLm1vdmluZy52aWV3KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogeCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogeSAtICQodGhpcy5tb3Zpbmcudmlldykub3V0ZXJIZWlnaHQodHJ1ZSkgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGJhc2VXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiei1pbmRleFwiOiAzLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrID0gYmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpbmRlbnQgPSBibG9jay5pbmRlbnQgKiB0aGlzLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50O1xuICAgICAgICAgICAgICAgICAgICAkKGJsb2NrLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBpbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6IHBvc2l0aW9uVG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoIC0gaW5kZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6LWluZGV4XCI6IDIsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblRvcCA9IHBvc2l0aW9uVG9wICsgJChibG9jay52aWV3KS5vdXRlckhlaWdodCh0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBNb3ZpbmcgQXJlYVxuICAgICAgICBpZiAodXBkYXRlTW92aW5nKSB7XG4gICAgICAgICAgICAvLyBBZGQgaXQgdG8gdGhlIGxvd2VzdCBwbGFjZSBpbiB0aGUgc291cmNlIGFyZWFcbiAgICAgICAgICAgIG1vdmluZ0JpbiA9IHRoaXMubW92aW5nLnBhaXJlZEJpbigpO1xuICAgICAgICAgICAgaWYgKG1vdmluZ0JpbiA9PSAtMSkge1xuICAgICAgICAgICAgICAgICQodGhpcy5tb3ZpbmcudmlldykuYXBwZW5kVG8oXCIjXCIgKyB0aGlzLmNvdW50ZXJJZCArIFwiLXNvdXJjZVwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGJlZm9yZTtcbiAgICAgICAgICAgICAgICBibG9ja3MgPSB0aGlzLnNvdXJjZUJsb2NrcztcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrID0gYmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2sucGFpcmVkQmluKCkgPT0gbW92aW5nQmluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiZWZvcmUgPSBpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYmVmb3JlID09IHVuZGVmaW5lZCB8fCBiZWZvcmUgPT0gYmxvY2tzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMubW92aW5nLnZpZXcpLmFwcGVuZFRvKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjXCIgKyB0aGlzLmNvdW50ZXJJZCArIFwiLXNvdXJjZVwiXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VyY2VBcmVhLmluc2VydEJlZm9yZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW92aW5nLnZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9ja3NbYmVmb3JlXS52aWV3XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUGxhY2UgaW4gdGhlIG1pZGRsZSBvZiB0aGUgbW91c2UgY3Vyc29yXG4gICAgICAgICAgICAkKHRoaXMubW92aW5nLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgbGVmdDogdGhpcy5tb3ZpbmdYIC1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VyY2VBcmVhLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgLVxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucGFnZVhPZmZzZXQgLVxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMubW92aW5nLnZpZXcpLm91dGVyV2lkdGgodHJ1ZSkgLyAyLFxuICAgICAgICAgICAgICAgIHRvcDogdGhpcy5tb3ZpbmdZIC1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VyY2VBcmVhLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5wYWdlWU9mZnNldCAtXG4gICAgICAgICAgICAgICAgICAgIG1vdmluZ0hlaWdodCAvIDIsXG4gICAgICAgICAgICAgICAgd2lkdGg6IGJhc2VXaWR0aCxcbiAgICAgICAgICAgICAgICBcInotaW5kZXhcIjogMyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRlID0gbmV3U3RhdGU7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICB9XG4gICAgYWRkQmxvY2tMYWJlbHMoYmxvY2tzKSB7XG4gICAgICAgIHZhciBiaW4gPSAtMTtcbiAgICAgICAgdmFyIGJpbkNvdW50ID0gMDtcbiAgICAgICAgdmFyIGJpbkNoaWxkcmVuID0gMDtcbiAgICAgICAgdmFyIGJsb2Nrc05vdEluQmlucyA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYmxvY2tzW2ldLnBhaXJlZEJpbigpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgYmxvY2tzTm90SW5CaW5zKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50QmluID0gYmxvY2tzW2ldLnBhaXJlZEJpbigpO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRCaW4gPT0gLTEgfHwgY3VycmVudEJpbiAhPSBiaW4pIHtcbiAgICAgICAgICAgICAgICBiaW4gPSBjdXJyZW50QmluO1xuICAgICAgICAgICAgICAgIGJpbkNoaWxkcmVuID0gMDtcbiAgICAgICAgICAgICAgICBiaW5Db3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGxhYmVsID1cbiAgICAgICAgICAgICAgICBcIlwiICtcbiAgICAgICAgICAgICAgICBiaW5Db3VudCArXG4gICAgICAgICAgICAgICAgKGN1cnJlbnRCaW4gIT0gLTEgP1xuICAgICAgICAgICAgICAgICAgICBTdHJpbmcuZnJvbUNoYXJDb2RlKDk3ICsgYmluQ2hpbGRyZW4pIDpcbiAgICAgICAgICAgICAgICAgICAgXCIgXCIpO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGJpbkNvdW50IDwgMTAgJiZcbiAgICAgICAgICAgICAgICBibG9ja3NOb3RJbkJpbnMgKyB0aGlzLnBhaXJlZEJpbnMubGVuZ3RoID49IDEwXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBsYWJlbCArPSBcIiBcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJsb2Nrc1tpXS5hZGRMYWJlbChsYWJlbCwgMCk7XG4gICAgICAgICAgICBiaW5DaGlsZHJlbisrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChibG9ja3NOb3RJbkJpbnMgKyB0aGlzLnBhaXJlZEJpbnMubGVuZ3RoID49IDEwKSB7XG4gICAgICAgICAgICB0aGlzLmFyZWFXaWR0aCArPSA1O1xuICAgICAgICAgICAgJCh0aGlzLnNvdXJjZUFyZWEpLmNzcyh7XG4gICAgICAgICAgICAgICAgd2lkdGg6ICQodGhpcy5zb3VyY2VBcmVhKS53aWR0aCgpICsgNSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCh0aGlzLmFuc3dlckFyZWEpLmNzcyh7XG4gICAgICAgICAgICAgICAgd2lkdGg6ICQodGhpcy5hbnN3ZXJBcmVhKS53aWR0aCgpICsgNSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFB1dCBhbGwgdGhlIGJsb2NrcyBiYWNrIGludG8gdGhlIHNvdXJjZSBhcmVhLCByZXNodWZmbGluZyBhcyBuZWNlc3NhcnlcbiAgICByZXNldFZpZXcoKSB7XG4gICAgICAgIC8vIENsZWFyIGV2ZXJ5dGhpbmdcbiAgICAgICAgdGhpcy5jbGVhckZlZWRiYWNrKCk7XG4gICAgICAgIHZhciBzY3JvbGxUb3AgPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcbiAgICAgICAgdmFyIGJsb2NrO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBibG9jayA9IHRoaXMuYmxvY2tzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBibG9jay5saW5lcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9ICQoYmxvY2subGluZXNbal0udmlldykuZmluZChcIi5ibG9jay1sYWJlbFwiKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGNoaWxkcmVuLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuW2NdLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJsb2NrLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICQodGhpcy5ibG9ja3NbaV0udmlldykuZGV0YWNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIHRoaXMuYmxvY2tzO1xuICAgICAgICB0aGlzLmJsb2NrSW5kZXggPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGFpcmVkRGl2cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgJCh0aGlzLnBhaXJlZERpdnNbaV0pLmRldGFjaCgpO1xuICAgICAgICB9XG4gICAgICAgICQodGhpcy5zb3VyY2VBcmVhKS5hdHRyKFwic3R5bGVcIiwgXCJcIik7XG4gICAgICAgICQodGhpcy5hbnN3ZXJBcmVhKS5yZW1vdmVDbGFzcygpO1xuICAgICAgICAkKHRoaXMuYW5zd2VyQXJlYSkuYXR0cihcInN0eWxlXCIsIFwiXCIpO1xuICAgICAgICB0aGlzLm5vaW5kZW50ID0gdGhpcy5vcHRpb25zLm5vaW5kZW50O1xuICAgICAgICAvLyBSZWluaXRpYWxpemVcbiAgICAgICAgaWYgKHRoaXMuaGFzU29sdmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrQ291bnQgPSAwO1xuICAgICAgICAgICAgdGhpcy5udW1EaXN0aW5jdCA9IDA7XG4gICAgICAgICAgICB0aGlzLmhhc1NvbHZlZCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hZGFwdGl2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FuSGVscCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL3RoaXMuaGVscENvdW50ID0gLTM7IC8vIGVuYWJsZSBhZnRlciAzIGZhaWxlZCBhdHRlbXB0c1xuICAgICAgICAgICAgLy90aGlzLmhlbHBCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5hZGFwdGl2ZUlkICsgXCJQcm9ibGVtXCIsIHRoaXMuZGl2aWQpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICAgICAgdGhpcy5hZGFwdGl2ZUlkICsgdGhpcy5kaXZpZCArIFwiQ291bnRcIixcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrQ291bnRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmFkYXB0aXZlSWQgKyBcIlNvbHZlZFwiLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0aWFsaXplQXJlYXModGhpcy5ibG9ja3NGcm9tU291cmNlKCksIFtdLCB7fSk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUludGVyYWN0aXZpdHkoKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSBzY3JvbGxUb3A7XG4gICAgfVxufVxuXG5QYXJzb25zLmNvdW50ZXIgPSAwO1xuXG4kKGRvY3VtZW50KS5vbihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAkKFwiW2RhdGEtY29tcG9uZW50PXBhcnNvbnNdXCIpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgaWYgKCQodGhpcykuY2xvc2VzdChcIltkYXRhLWNvbXBvbmVudD10aW1lZEFzc2Vzc21lbnRdXCIpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHByc0xpc3RbdGhpcy5pZF0gPSBuZXcgUGFyc29ucyh7XG4gICAgICAgICAgICAgICAgICAgIG9yaWc6IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIHVzZVJ1bmVzdG9uZVNlcnZpY2VzOiBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciByZW5kZXJpbmcgUGFyc29ucyBQcm9ibGVtICR7dGhpcy5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRGV0YWlsczogJHtlcnJ9YCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyLnN0YWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iLCIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT0gUGFyc29uc0Jsb2NrIE9iamVjdCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gVGhlIG1vZGVsIGFuZCB2aWV3IG9mIGEgY29kZSBibG9jay5cbj09PT0gUFJPUEVSVElFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gcHJvYmxlbTogdGhlIFBhcnNvbnMgcHJvYmxlbVxuPT09PT09PT0gbGluZXM6IGFuIGFycmF5IG9mIFBhcnNvbnNMaW5lIGluIHRoaXMgYmxvY2tcbj09PT09PT09IGluZGVudDogaW5kZW50IGJhc2VkIG9uIG1vdmVtZW50XG49PT09PT09PSB2aWV3OiBhbiBlbGVtZW50IGZvciB2aWV3aW5nIHRoaXMgb2JqZWN0XG49PT09PT09PSBsYWJlbHM6IFtsYWJlbCwgbGluZV0gdGhlIGxhYmVscyBudW1iZXJpbmcgdGhlIGJsb2NrIGFuZCB0aGUgbGluZXMgdGhleSBnbyBvblxuPT09PT09PT0gaGFtbWVyOiB0aGUgY29udHJvbGxlciBiYXNlZCBvbiBoYW1tZXIuanNcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5pbXBvcnQgSGFtbWVyIGZyb20gXCIuL2hhbW1lci5taW4uanNcIjtcblxuLy8gSW5pdGlhbGl6ZSBiYXNlZCBvbiB0aGUgcHJvYmxlbSBhbmQgdGhlIGxpbmVzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJzb25zQmxvY2sge1xuICAgIGNvbnN0cnVjdG9yKHByb2JsZW0sIGxpbmVzKSB7XG4gICAgICAgIHRoaXMucHJvYmxlbSA9IHByb2JsZW07XG4gICAgICAgIHRoaXMubGluZXMgPSBsaW5lcztcbiAgICAgICAgdGhpcy5pbmRlbnQgPSAwO1xuICAgICAgICB0aGlzLmxhYmVscyA9IFtdO1xuICAgICAgICAvLyBDcmVhdGUgdmlldywgYWRkaW5nIHZpZXcgb2YgbGluZXMgYW5kIHVwZGF0aW5nIGluZGVudFxuICAgICAgICB2YXIgdmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHZpZXcuaWQgPSBwcm9ibGVtLmNvdW50ZXJJZCArIFwiLWJsb2NrLVwiICsgcHJvYmxlbS5ibG9ja0luZGV4O1xuICAgICAgICBwcm9ibGVtLmJsb2NrSW5kZXggKz0gMTtcbiAgICAgICAgJCh2aWV3KS5hZGRDbGFzcyhcImJsb2NrXCIpO1xuICAgICAgICB2YXIgc2hhcmVkSW5kZW50ID0gbGluZXNbMF0uaW5kZW50O1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzaGFyZWRJbmRlbnQgPSBNYXRoLm1pbihzaGFyZWRJbmRlbnQsIGxpbmVzW2ldLmluZGVudCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxpbmVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAkKGxpbmVEaXYpLmFkZENsYXNzKFwibGluZXNcIik7XG4gICAgICAgICQodmlldykuYXBwZW5kKGxpbmVEaXYpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbGluZSA9IGxpbmVzW2ldO1xuICAgICAgICAgICAgdmFyIGxpbmVJbmRlbnQ7XG4gICAgICAgICAgICBpZiAocHJvYmxlbS5ub2luZGVudCkge1xuICAgICAgICAgICAgICAgIGxpbmVJbmRlbnQgPSBsaW5lLmluZGVudDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGluZUluZGVudCA9IGxpbmUuaW5kZW50IC0gc2hhcmVkSW5kZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChsaW5lLnZpZXcpLnJlbW92ZUNsYXNzKFwiaW5kZW50MSBpbmRlbnQyIGluZGVudDMgaW5kZW50NFwiKTtcbiAgICAgICAgICAgIGlmIChsaW5lSW5kZW50ID4gMCkge1xuICAgICAgICAgICAgICAgICQobGluZS52aWV3KS5hZGRDbGFzcyhcImluZGVudFwiICsgbGluZUluZGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsaW5lRGl2LmFwcGVuZENoaWxkKGxpbmUudmlldyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxhYmVsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgJChsYWJlbERpdikuYWRkQ2xhc3MoXCJsYWJlbHNcIik7XG4gICAgICAgIGlmICh0aGlzLnByb2JsZW0ub3B0aW9ucy5udW1iZXJlZCA9PSBcImxlZnRcIikge1xuICAgICAgICAgICAgJChsaW5lRGl2KS5hZGRDbGFzcyhcImJvcmRlcl9sZWZ0XCIpO1xuICAgICAgICAgICAgJCh2aWV3KS5wcmVwZW5kKGxhYmVsRGl2KTtcbiAgICAgICAgICAgICQodmlldykuY3NzKHtcbiAgICAgICAgICAgICAgICBcImp1c3RpZnktY29udGVudFwiOiBcImZsZXgtc3RhcnRcIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJvYmxlbS5vcHRpb25zLm51bWJlcmVkID09IFwicmlnaHRcIikge1xuICAgICAgICAgICAgJChsYWJlbERpdikuYWRkQ2xhc3MoXCJib3JkZXJfbGVmdFwiKTtcbiAgICAgICAgICAgICQobGFiZWxEaXYpLmNzcyh7XG4gICAgICAgICAgICAgICAgZmxvYXQ6IFwicmlnaHRcIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCh2aWV3KS5jc3Moe1xuICAgICAgICAgICAgICAgIFwianVzdGlmeS1jb250ZW50XCI6IFwic3BhY2UtYmV0d2VlblwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKHZpZXcpLmFwcGVuZChsYWJlbERpdik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52aWV3ID0gdmlldztcbiAgICB9XG4gICAgLy8gQWRkIGEgbGluZSAoZnJvbSBhbm90aGVyIGJsb2NrKSB0byB0aGlzIGJsb2NrXG4gICAgYWRkTGluZShsaW5lKSB7XG4gICAgICAgICQobGluZS52aWV3KS5yZW1vdmVDbGFzcyhcImluZGVudDEgaW5kZW50MiBpbmRlbnQzIGluZGVudDRcIik7XG4gICAgICAgIGlmICh0aGlzLnByb2JsZW0ubm9pbmRlbnQpIHtcbiAgICAgICAgICAgIGlmIChsaW5lLmluZGVudCA+IDApIHtcbiAgICAgICAgICAgICAgICAkKGxpbmUudmlldykuYWRkQ2xhc3MoXCJpbmRlbnRcIiArIGxpbmUuaW5kZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBsaW5lcyA9IHRoaXMubGluZXM7XG4gICAgICAgICAgICB2YXIgc2hhcmVkSW5kZW50ID0gbGluZXNbMF0uaW5kZW50O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHNoYXJlZEluZGVudCA9IE1hdGgubWluKHNoYXJlZEluZGVudCwgbGluZXNbaV0uaW5kZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzaGFyZWRJbmRlbnQgPCBsaW5lLmluZGVudCkge1xuICAgICAgICAgICAgICAgICQobGluZS52aWV3KS5hZGRDbGFzcyhcImluZGVudFwiICsgKGxpbmUuaW5kZW50IC0gc2hhcmVkSW5kZW50KSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoYXJlZEluZGVudCA+IGxpbmUuaW5kZW50KSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAkKGxpbmVzW2ldLnZpZXcpLnJlbW92ZUNsYXNzKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbmRlbnQxIGluZGVudDIgaW5kZW50MyBpbmRlbnQ0XCJcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgJChsaW5lc1tpXS52aWV3KS5hZGRDbGFzcyhcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW5kZW50XCIgKyAobGluZXNbaV0uaW5kZW50IC0gbGluZS5pbmRlbnQpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubGluZXMucHVzaChsaW5lKTtcbiAgICAgICAgJCh0aGlzLnZpZXcpLmNoaWxkcmVuKFwiLmxpbmVzXCIpWzBdLmFwcGVuZENoaWxkKGxpbmUudmlldyk7XG4gICAgfVxuICAgIC8vIEFkZCB0aGUgY29udGVudHMgb2YgdGhhdCBibG9jayB0byBteXNlbGYgYW5kIHRoZW4gZGVsZXRlIHRoYXQgYmxvY2tcbiAgICBjb25zdW1lQmxvY2soYmxvY2spIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9jay5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGJsb2NrLmxpbmVzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJChibG9jay52aWV3KS5hdHRyKFwidGFiaW5kZXhcIikgPT0gXCIwXCIpIHtcbiAgICAgICAgICAgIHRoaXMubWFrZVRhYkluZGV4KCk7XG4gICAgICAgIH1cbiAgICAgICAgJChibG9jay52aWV3KS5kZXRhY2goKTtcbiAgICAgICAgdmFyIG5ld0Jsb2NrcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJvYmxlbS5ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2JsZW0uYmxvY2tzW2ldICE9PSBibG9jaykge1xuICAgICAgICAgICAgICAgIG5ld0Jsb2Nrcy5wdXNoKHRoaXMucHJvYmxlbS5ibG9ja3NbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2subGFiZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmFkZExhYmVsKFxuICAgICAgICAgICAgICAgIGJsb2NrLmxhYmVsc1tpXVswXSxcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVzLmxlbmd0aCAtIGJsb2NrLmxpbmVzLmxlbmd0aCArIGJsb2NrLmxhYmVsc1tpXVsxXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByb2JsZW0uYmxvY2tzID0gbmV3QmxvY2tzO1xuICAgICAgICB0aGlzLnByb2JsZW0uc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgfVxuICAgIC8vIFVwZGF0ZSB0aGUgbW9kZWwgYW5kIHZpZXcgd2hlbiBibG9jayBpcyBjb252ZXJ0ZWQgdG8gY29udGFpbiBpbmRlbnRcbiAgICBhZGRJbmRlbnQoKSB7XG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgbGluZXMgbW9kZWwgLyB2aWV3XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGxpbmUgPSB0aGlzLmxpbmVzW2ldO1xuICAgICAgICAgICAgaWYgKGxpbmUuaW5kZW50ID4gMCkge1xuICAgICAgICAgICAgICAgICQobGluZS52aWV3KS5yZW1vdmVDbGFzcyhcImluZGVudDEgaW5kZW50MiBpbmRlbnQzIGluZGVudDRcIik7XG4gICAgICAgICAgICAgICAgJChsaW5lLnZpZXcpLmFkZENsYXNzKFwiaW5kZW50XCIgKyBsaW5lLmluZGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBibG9jayBtb2RlbCAvIHZpZXdcbiAgICAgICAgdGhpcy5pbmRlbnQgPSAwO1xuICAgICAgICAkKHRoaXMudmlldykuY3NzKHtcbiAgICAgICAgICAgIFwicGFkZGluZy1sZWZ0XCI6IFwiXCIsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5wcm9ibGVtLmFyZWFXaWR0aCAtIDIyLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gQWRkIGEgbGFiZWwgdG8gYmxvY2sgYW5kIHVwZGF0ZSBpdHMgdmlld1xuICAgIGFkZExhYmVsKGxhYmVsLCBsaW5lKSB7XG4gICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAkKGRpdikuYWRkQ2xhc3MoXCJibG9jay1sYWJlbFwiKTtcbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbS5vcHRpb25zLm51bWJlcmVkID09IFwicmlnaHRcIikge1xuICAgICAgICAgICAgJChkaXYpLmFkZENsYXNzKFwicmlnaHQtbGFiZWxcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbS5vcHRpb25zLm51bWJlcmVkID09IFwibGVmdFwiKSB7XG4gICAgICAgICAgICAkKGRpdikuYWRkQ2xhc3MoXCJsZWZ0LWxhYmVsXCIpO1xuICAgICAgICB9XG4gICAgICAgICQoZGl2KS5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGFiZWwpKTtcbiAgICAgICAgJCh0aGlzLnZpZXcpLmNoaWxkcmVuKFwiLmxhYmVsc1wiKVswXS5hcHBlbmQoZGl2KTtcbiAgICAgICAgaWYgKHRoaXMubGFiZWxzLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICAkKGRpdikuY3NzKFxuICAgICAgICAgICAgICAgIFwibWFyZ2luLXRvcFwiLFxuICAgICAgICAgICAgICAgIChsaW5lIC0gdGhpcy5sYWJlbHNbdGhpcy5sYWJlbHMubGVuZ3RoIC0gMV1bMV0gLSAxKSAqXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGluZXNbbGluZV0udmlldy5vZmZzZXRIZWlnaHRcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYWJlbHMucHVzaChbbGFiZWwsIGxpbmVdKTtcbiAgICB9XG4gICAgLy8gSW5pdGlhbGl6ZSBJbnRlcmFjdGl2aXR5XG4gICAgaW5pdGlhbGl6ZUludGVyYWN0aXZpdHkoKSB7XG4gICAgICAgIGlmICgkKHRoaXMudmlldykuaGFzQ2xhc3MoXCJkaXNhYmxlZFwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgJCh0aGlzLnZpZXcpLmF0dHIoXCJ0YWJpbmRleFwiLCBcIi0xXCIpO1xuICAgICAgICB0aGlzLmhhbW1lciA9IG5ldyBIYW1tZXIuTWFuYWdlcih0aGlzLnZpZXcsIHtcbiAgICAgICAgICAgIHJlY29nbml6ZXJzOiBbXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICBIYW1tZXIuUGFuLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb246IEhhbW1lci5ESVJFQ1RJT05fQUxMLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyZXNob2xkOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRlcnM6IDEsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHRoaXMuaGFtbWVyLm9uKFwicGFuc3RhcnRcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGF0LnBhblN0YXJ0KGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaGFtbWVyLm9uKFwicGFuZW5kXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhhdC5wYW5FbmQoZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5oYW1tZXIub24oXCJwYW5tb3ZlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhhdC5wYW5Nb3ZlKGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIFJldHVybiBhIGJvb2xlYW4gYXMgdG8gd2hldGhlciB0aGlzIGJsb2NrIGlzIGFibGUgdG8gYmUgc2VsZWN0ZWRcbiAgICBlbmFibGVkKCkge1xuICAgICAgICByZXR1cm4gJCh0aGlzLnZpZXcpLmF0dHIoXCJ0YWJpbmRleFwiKSAhPT0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYSBib29sZWFuIGFzIHRvIHdoZXRoZXIgdGhpcyBibG9jayBpcyBhIGRpc3RyYWN0b3JcbiAgICBpc0Rpc3RyYWN0b3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpbmVzWzBdLmRpc3RyYWN0b3I7XG4gICAgfVxuICAgIC8vIFJldHVybiBhIGJvb2xlYW4gYXMgdG8gd2hldGhlciB0aGlzIGJsb2NrIGlzIGluIHRoZSBzb3VyY2UgYXJlYVxuICAgIGluU291cmNlQXJlYSgpIHtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5wcm9ibGVtLnNvdXJjZUFyZWEuY2hpbGROb2RlcztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChpdGVtLmlkID09IHRoaXMudmlldy5pZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gUmV0dXJuIHRoZSBwYWdlIFggcG9zaXRpb24gb2YgdGhlIGNlbnRlciBvZiB0aGUgdmlld1xuICAgIHBhZ2VYQ2VudGVyKCkge1xuICAgICAgICB2YXIgYm91bmRpbmdSZWN0ID0gdGhpcy52aWV3LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB2YXIgcGFnZVhDZW50ZXIgPVxuICAgICAgICAgICAgd2luZG93LnBhZ2VYT2Zmc2V0ICsgYm91bmRpbmdSZWN0LmxlZnQgKyBib3VuZGluZ1JlY3Qud2lkdGggLyAyO1xuICAgICAgICByZXR1cm4gcGFnZVhDZW50ZXI7XG4gICAgfVxuICAgIC8vIFJldHVybiB0aGUgcGFnZSBZIHBvc2l0aW9uIG9mIHRoZSBjZW50ZXIgb2YgdGhlIHZpZXdcbiAgICBwYWdlWUNlbnRlcigpIHtcbiAgICAgICAgdmFyIGJvdW5kaW5nUmVjdCA9IHRoaXMudmlldy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdmFyIHBhZ2VZQ2VudGVyID1cbiAgICAgICAgICAgIHdpbmRvdy5wYWdlWU9mZnNldCArIGJvdW5kaW5nUmVjdC50b3AgKyBib3VuZGluZ1JlY3QuaGVpZ2h0IC8gMjtcbiAgICAgICAgcmV0dXJuIHBhZ2VZQ2VudGVyO1xuICAgIH1cbiAgICAvLyBPZiBhbGwgdGhlIGxpbmUgaW5kZW50cywgcmV0dXJuIHRoZSBtaW5pbXVtIHZhbHVlXG4gICAgbWluaW11bUxpbmVJbmRlbnQoKSB7XG4gICAgICAgIHZhciBtaW5pbXVtTGluZUluZGVudCA9IHRoaXMubGluZXNbMF0uaW5kZW50O1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG1pbmltdW1MaW5lSW5kZW50ID0gTWF0aC5taW4oXG4gICAgICAgICAgICAgICAgdGhpcy5saW5lc1tpXS5pbmRlbnQsXG4gICAgICAgICAgICAgICAgbWluaW11bUxpbmVJbmRlbnRcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1pbmltdW1MaW5lSW5kZW50O1xuICAgIH1cbiAgICAvLyBSZXR1cm4gdGhlIGxhc3QgYmxvY2sgaW4gdGhlIHNvdXJjZSBhcmVhIHRoYXQgbWF0Y2hlcyB0aGUgcGFpcmVkIGJpbiBpdCBpcyBpblxuICAgIHNsaWRlVW5kZXJCbG9jaygpIHtcbiAgICAgICAgdmFyIHNvdXJjZUJsb2NrcyA9IHRoaXMucHJvYmxlbS5zb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgaWYgKHNvdXJjZUJsb2Nrcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGFpcmVkQmluID0gdGhpcy5wYWlyZWRCaW4oKTtcbiAgICAgICAgaWYgKHBhaXJlZEJpbiA9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZUJsb2Nrc1tzb3VyY2VCbG9ja3MubGVuZ3RoIC0gMV07XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IHNvdXJjZUJsb2Nrcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdmFyIGJsb2NrID0gc291cmNlQmxvY2tzW2ldO1xuICAgICAgICAgICAgaWYgKGJsb2NrLnBhaXJlZEJpbigpID09IHBhaXJlZEJpbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBibG9jaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc291cmNlQmxvY2tzW3NvdXJjZUJsb2Nrcy5sZW5ndGggLSAxXTtcbiAgICB9XG4gICAgLy8gUmV0dXJuIHdoaWNoIHBhaXJlZCBiaW4gaXQgaXMgaW4gKC0xKSBpZiBub3RcbiAgICBwYWlyZWRCaW4oKSB7XG4gICAgICAgIHZhciBwYWlyZWRCaW5zID0gdGhpcy5wcm9ibGVtLnBhaXJlZEJpbnM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFpcmVkQmlucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMubWF0Y2hlc0JpbihwYWlyZWRCaW5zW2ldKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gICAgLy8gUmV0dXJuIHRydWUgaWYgYWxsIGxpbmVzIGFyZSBpbiB0aGF0IGJpblxuICAgIG1hdGNoZXNCaW4oYmluKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHRlc3QgPSB0aGlzLmxpbmVzW2ldLmluZGV4O1xuICAgICAgICAgICAgaWYgKGJpbi5pbmRleE9mKHRlc3QpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYSBsaXN0IG9mIGluZGV4ZXMgd2hlcmUgdGhpcyBibG9jayBjb3VsZCBiZSBpbnNlcnRlZCBiZWZvcmVcbiAgICB2YWxpZFNvdXJjZUluZGV4ZXMoKSB7XG4gICAgICAgIHZhciBibG9ja3MgPSB0aGlzLnByb2JsZW0uc291cmNlQmxvY2tzKCk7XG4gICAgICAgIHZhciBpbmRleGVzID0gW107XG4gICAgICAgIHZhciBwYWlyZWRCaW4gPSB0aGlzLnBhaXJlZEJpbigpO1xuICAgICAgICB2YXIgaSwgbGFzdEJpbjtcbiAgICAgICAgaWYgKHBhaXJlZEJpbiA+PSAwKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJsb2NrID0gYmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChibG9jay52aWV3LmlkICE9PSB0aGlzLnZpZXcuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJsb2NrQmluID0gYmxvY2sucGFpcmVkQmluKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9ja0JpbiA9PSBwYWlyZWRCaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ZXMucHVzaChpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChsYXN0QmluID09IHBhaXJlZEJpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhlcy5wdXNoKGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxhc3RCaW4gPSBibG9ja0JpbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGFzdEJpbiA9PSBwYWlyZWRCaW4pIHtcbiAgICAgICAgICAgICAgICBpbmRleGVzLnB1c2goYmxvY2tzLmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5kZXhlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluZGV4ZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGJsb2NrID0gYmxvY2tzW2ldO1xuICAgICAgICAgICAgaWYgKGJsb2NrLnZpZXcuaWQgIT09IHRoaXMudmlldy5pZCkge1xuICAgICAgICAgICAgICAgIGxldCBibG9ja0JpbiA9IGJsb2NrLnBhaXJlZEJpbigpO1xuICAgICAgICAgICAgICAgIGlmIChibG9ja0JpbiAhPT0gbGFzdEJpbikge1xuICAgICAgICAgICAgICAgICAgICBpbmRleGVzLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChibG9ja0JpbiA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBpbmRleGVzLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxhc3RCaW4gPSBibG9ja0JpbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpbmRleGVzLnB1c2goYmxvY2tzLmxlbmd0aCk7XG4gICAgICAgIHJldHVybiBpbmRleGVzO1xuICAgIH1cbiAgICAvLyBBIG1lYXN1cmUgb2YgaG93IGZhciB0aGUgbWlkZGxlIG9mIHRoaXMgYmxvY2sgaXMgdmVydGljYWxseSBwb3NpdGlvbmVkXG4gICAgdmVydGljYWxPZmZzZXQoKSB7XG4gICAgICAgIHZhciB2ZXJ0aWNhbE9mZnNldDtcbiAgICAgICAgaWYgKHRoaXMuaW5Tb3VyY2VBcmVhKCkpIHtcbiAgICAgICAgICAgIHZlcnRpY2FsT2Zmc2V0ID0gdGhpcy5wcm9ibGVtLnNvdXJjZUFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgICAgICAgICAudG9wO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPSB0aGlzLnByb2JsZW0uYW5zd2VyQXJlYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICAgICAgICAgIC50b3A7XG4gICAgICAgIH1cbiAgICAgICAgdmVydGljYWxPZmZzZXQgPVxuICAgICAgICAgICAgdGhpcy52aWV3LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArXG4gICAgICAgICAgICB0aGlzLnZpZXcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tIC1cbiAgICAgICAgICAgIHZlcnRpY2FsT2Zmc2V0ICogMjtcbiAgICAgICAgcmV0dXJuIHZlcnRpY2FsT2Zmc2V0O1xuICAgIH1cbiAgICAvLyBUaGlzIGJsb2NrIGp1c3QgZ2FpbmVkIHRleHR1YWwgZm9jdXNcbiAgICBuZXdGb2N1cygpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbS50ZXh0Rm9jdXMgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0uZW50ZXJLZXlib2FyZE1vZGUoKTtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0Rm9jdXMgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZlID0gZmFsc2U7XG4gICAgICAgICAgICAkKHRoaXMudmlldykuYWRkQ2xhc3MoXCJkb3duXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJvYmxlbS50ZXh0Rm9jdXMgPT0gdGhpcykge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJvYmxlbS50ZXh0TW92ZSkge1xuICAgICAgICAgICAgICAgICQodGhpcy52aWV3KS5hZGRDbGFzcyhcInVwXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMudmlldykuYWRkQ2xhc3MoXCJkb3duXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gYWxyZWFkeSBpbiBrZXlib2FyZCBtb2RlXG4gICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dEZvY3VzID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0TW92ZSA9IGZhbHNlO1xuICAgICAgICAgICAgJCh0aGlzLnZpZXcpLmFkZENsYXNzKFwiZG93blwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBUaGlzIGJsb2NrIGp1c3QgbG9zdCB0ZXh0dWFsIGZvY3VzXG4gICAgcmVsZWFzZUZvY3VzKCkge1xuICAgICAgICAkKHRoaXMudmlldykucmVtb3ZlQ2xhc3MoXCJkb3duIHVwXCIpO1xuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnRleHRGb2N1cyA9PSB0aGlzKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMucHJvYmxlbS50ZXh0TW92aW5nKSB7XG4gICAgICAgICAgICAgICAgLy8gZXhpdCBvdXQgb2YgcHJvYmxlbSBidXQgc3RheSB3YXkgaW50byBwcm9ibGVtXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRGb2N1cyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnRleHRNb3ZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5sb2dNb3ZlKFwia21vdmVcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0TW92ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uZXhpdEtleWJvYXJkTW9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gYmVjb21lIHNlbGVjdGFibGUsIGJ1dCBub3QgYWN0aXZlXG4gICAgICAgICAgICAkKHRoaXMudmlldykuYXR0cihcInRhYmluZGV4XCIsIFwiLTFcIik7XG4gICAgICAgICAgICAkKHRoaXMudmlldykudW5iaW5kKFwiZm9jdXNcIik7XG4gICAgICAgICAgICAkKHRoaXMudmlldykudW5iaW5kKFwiYmx1clwiKTtcbiAgICAgICAgICAgICQodGhpcy52aWV3KS51bmJpbmQoXCJrZXlkb3duXCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIE1ha2UgdGhpcyBibG9jayBpbnRvIHRoZSBrZXlib2FyZCBlbnRyeSBwb2ludFxuICAgIG1ha2VUYWJJbmRleCgpIHtcbiAgICAgICAgJCh0aGlzLnZpZXcpLmF0dHIoXCJ0YWJpbmRleFwiLCBcIjBcIik7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgJCh0aGlzLnZpZXcpLmZvY3VzKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoYXQubmV3Rm9jdXMoKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQodGhpcy52aWV3KS5ibHVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoYXQucmVsZWFzZUZvY3VzKCk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKHRoaXMudmlldykua2V5ZG93bihmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoYXQua2V5RG93bihldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBDYWxsZWQgdG8gZGlzYWJsZSBpbnRlcmFjdGlvbiBmb3IgdGhlIGZ1dHVyZVxuICAgIGRpc2FibGUoKSB7XG4gICAgICAgIGlmICh0aGlzLmhhbW1lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmhhbW1lci5zZXQoeyBlbmFibGU6IGZhbHNlIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICgkKHRoaXMudmlldykuYXR0cihcInRhYmluZGV4XCIpID09IFwiMFwiKSB7XG4gICAgICAgICAgICB0aGlzLnJlbGVhc2VGb2N1cygpO1xuICAgICAgICAgICAgJCh0aGlzLnZpZXcpLnJlbW92ZUF0dHIoXCJ0YWJpbmRleFwiKTtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5pbml0aWFsaXplVGFiSW5kZXgoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQodGhpcy52aWV3KS5yZW1vdmVBdHRyKFwidGFiaW5kZXhcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gRW5hYmxlIGZ1bmN0aW9uYWxpdHkgYWZ0ZXIgcmVzZXQgYnV0dG9uIGhhcyBiZWVuIHByZXNzZWRcbiAgICByZXNldFZpZXcoKSB7XG4gICAgICAgIGlmICh0aGlzLmhhbW1lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmhhbW1lci5zZXQoeyBlbmFibGU6IHRydWUgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEkKHRoaXMudmlldylbMF0uaGFzQXR0cmlidXRlKFwidGFiaW5kZXhcIikpIHtcbiAgICAgICAgICAgICQodGhpcy52aWV3KS5hdHRyKFwidGFiaW5kZXhcIiwgXCItMVwiKTtcbiAgICAgICAgfVxuICAgICAgICAkKHRoaXMudmlldykuY3NzKHsgb3BhY2l0eTogXCJcIiB9KTtcbiAgICB9XG4gICAgLy8gQ2FsbGVkIHRvIGRlc3Ryb3kgaW50ZXJhY3Rpb24gZm9yIHRoZSBmdXR1cmVcbiAgICBkZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5oYW1tZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5oYW1tZXIuZGVzdHJveSgpO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuaGFtbWVyO1xuICAgICAgICB9XG4gICAgICAgIGlmICgkKHRoaXMudmlldykuYXR0cihcInRhYmluZGV4XCIpID09IFwiMFwiKSB7XG4gICAgICAgICAgICB0aGlzLnJlbGVhc2VGb2N1cygpO1xuICAgICAgICB9XG4gICAgICAgICQodGhpcy52aWV3KS5yZW1vdmVBdHRyKFwidGFiaW5kZXhcIik7XG4gICAgfVxuICAgIC8vIENhbGxlZCB3aGVuIGEgYmxvY2sgaXMgcGlja2VkIHVwXG4gICAgcGFuU3RhcnQoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5wcm9ibGVtLmNsZWFyRmVlZGJhY2soKTtcbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbS5zdGFydGVkID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gbG9nIHRoZSBmaXJzdCB0aW1lIHRoYXQgc29tZXRoaW5nIGdldHMgbW92ZWRcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5sb2dNb3ZlKFwic3RhcnRcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbS50ZXh0Rm9jdXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gc3RvcCB0ZXh0IGZvY3VzIHdoZW4gZHJhZ2dpbmdcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0Rm9jdXMucmVsZWFzZUZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcm9ibGVtLm1vdmluZyA9IHRoaXM7XG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgdmlld1xuICAgICAgICB0aGlzLnByb2JsZW0ubW92aW5nWCA9IGV2ZW50LnNyY0V2ZW50LnBhZ2VYO1xuICAgICAgICB0aGlzLnByb2JsZW0ubW92aW5nWSA9IGV2ZW50LnNyY0V2ZW50LnBhZ2VZO1xuICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgIH1cbiAgICAvLyBDYWxsZWQgd2hlbiBhIGJsb2NrIGlzIGRyb3BwZWRcbiAgICBwYW5FbmQoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5wcm9ibGVtLmlzQW5zd2VyZWQgPSB0cnVlO1xuICAgICAgICBkZWxldGUgdGhpcy5wcm9ibGVtLm1vdmluZztcbiAgICAgICAgZGVsZXRlIHRoaXMucHJvYmxlbS5tb3ZpbmdYO1xuICAgICAgICBkZWxldGUgdGhpcy5wcm9ibGVtLm1vdmluZ1k7XG4gICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgICAgIHRoaXMucHJvYmxlbS5sb2dNb3ZlKFwibW92ZVwiKTtcbiAgICB9XG4gICAgLy8gQ2FsbGVkIHdoZW4gYSBibG9jayBpcyBtb3ZlZFxuICAgIHBhbk1vdmUoZXZlbnQpIHtcbiAgICAgICAgLy8gVXBkYXRlIHRoZSB2aWV3XG4gICAgICAgIHRoaXMucHJvYmxlbS5tb3ZpbmdYID0gZXZlbnQuc3JjRXZlbnQucGFnZVg7XG4gICAgICAgIHRoaXMucHJvYmxlbS5tb3ZpbmdZID0gZXZlbnQuc3JjRXZlbnQucGFnZVk7XG4gICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgfVxuICAgIC8vIEhhbmRsZSBhIGtleXByZXNzIGV2ZW50IHdoZW4gaW4gZm9jdXNcbiAgICBrZXlEb3duKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLnByb2JsZW0uc3RhcnRlZCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIGxvZyB0aGUgZmlyc3QgdGltZSB0aGF0IHNvbWV0aGluZyBnZXRzIG1vdmVkXG4gICAgICAgICAgICB0aGlzLnByb2JsZW0uc3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0ubG9nTW92ZShcImtzdGFydFwiKTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgMzc6IC8vIGxlZnRcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnRleHRNb3ZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZUxlZnQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdExlZnQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM4OiAvLyB1cFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb2JsZW0udGV4dE1vdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlVXAoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdFVwKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM5OiAvLyByaWdodFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb2JsZW0udGV4dE1vdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlUmlnaHQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdFJpZ2h0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQwOiAvLyBkb3duXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvYmxlbS50ZXh0TW92ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVEb3duKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3REb3duKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDMyOiAvLyBzcGFjZVxuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlTW92ZSgpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDEzOiAvLyBlbnRlclxuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlTW92ZSgpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTW92ZSBibG9jayBsZWZ0XG4gICAgbW92ZUxlZnQoKSB7XG4gICAgICAgIHZhciBpbmRleCwgYmxvY2s7XG4gICAgICAgIGlmICghdGhpcy5pblNvdXJjZUFyZWEoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5kZW50ID09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBtb3ZlIHRvIHNvdXJjZSBhcmVhXG4gICAgICAgICAgICAgICAgdmFyIGJsb2NrcyA9IHRoaXMucHJvYmxlbS5zb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy52ZXJ0aWNhbE9mZnNldCgpO1xuICAgICAgICAgICAgICAgIHZhciB2YWxpZFNvdXJjZUluZGV4ZXMgPSB0aGlzLnZhbGlkU291cmNlSW5kZXhlcygpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsaWRTb3VyY2VJbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gdmFsaWRTb3VyY2VJbmRleGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT0gYmxvY2tzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnNvdXJjZUFyZWEuYXBwZW5kQ2hpbGQodGhpcy52aWV3KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcy52aWV3KS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sgPSBibG9ja3NbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrLnZlcnRpY2FsT2Zmc2V0KCkgPj0gb2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zb3VyY2VBcmVhLmluc2VydEJlZm9yZSh0aGlzLnZpZXcsIGJsb2NrLnZpZXcpO1xuICAgICAgICAgICAgICAgICQodGhpcy52aWV3KS5mb2N1cygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyByZWR1Y2UgaW5kZW50XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRlbnQgPSB0aGlzLmluZGVudCAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0uc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIE1vdmUgYmxvY2sgdXBcbiAgICBtb3ZlVXAoKSB7XG4gICAgICAgIGlmICh0aGlzLmluU291cmNlQXJlYSgpKSB7XG4gICAgICAgICAgICBsZXQgYmxvY2tzID0gdGhpcy5wcm9ibGVtLnNvdXJjZUJsb2NrcygpO1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMudmVydGljYWxPZmZzZXQoKTtcbiAgICAgICAgICAgIHZhciB2YWxpZFNvdXJjZUluZGV4ZXMgPSB0aGlzLnZhbGlkU291cmNlSW5kZXhlcygpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWxpZFNvdXJjZUluZGV4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPVxuICAgICAgICAgICAgICAgICAgICB2YWxpZFNvdXJjZUluZGV4ZXNbdmFsaWRTb3VyY2VJbmRleGVzLmxlbmd0aCAtIDEgLSBpXTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCBibG9ja3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBibG9jayA9IGJsb2Nrc1tpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jay52ZXJ0aWNhbE9mZnNldCgpIDwgb2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uc291cmNlQXJlYS5pbnNlcnRCZWZvcmUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLnZpZXdcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMudmlldykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBibG9ja3MgPSB0aGlzLnByb2JsZW0uYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChibG9ja3NbaV0udmlldy5pZCA9PSB0aGlzLnZpZXcuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uYW5zd2VyQXJlYS5pbnNlcnRCZWZvcmUoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9ja3NbaSAtIDFdLnZpZXdcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLnZpZXcpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTW92ZSBibG9jayByaWdodFxuICAgIG1vdmVSaWdodCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5Tb3VyY2VBcmVhKCkpIHtcbiAgICAgICAgICAgIC8vIG1vdmUgdG8gYW5zd2VyIGFyZWFcbiAgICAgICAgICAgIHRoaXMuaW5kZW50ID0gMDtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLnZlcnRpY2FsT2Zmc2V0KCk7XG4gICAgICAgICAgICB2YXIgYW5zd2VyQmxvY2tzID0gdGhpcy5wcm9ibGVtLmFuc3dlckJsb2NrcygpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbnN3ZXJCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGFuc3dlckJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbU9mZnNldCA9IGl0ZW0udmVydGljYWxPZmZzZXQoKTtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbU9mZnNldCA+PSBvZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uYW5zd2VyQXJlYS5pbnNlcnRCZWZvcmUodGhpcy52aWV3LCBpdGVtLnZpZXcpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMudmlldykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0uYW5zd2VyQXJlYS5hcHBlbmRDaGlsZCh0aGlzLnZpZXcpO1xuICAgICAgICAgICAgJCh0aGlzLnZpZXcpLmZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0uc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaW4gYW5zd2VyIGFyZWE6IGluY3JlYXNlIHRoZSBpbmRlbnRcbiAgICAgICAgICAgIGlmICh0aGlzLmluZGVudCAhPT0gdGhpcy5wcm9ibGVtLmluZGVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50ID0gdGhpcy5pbmRlbnQgKyAxO1xuICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIE1vdmUgYmxvY2sgZG93blxuICAgIG1vdmVEb3duKCkge1xuICAgICAgICBpZiAodGhpcy5pblNvdXJjZUFyZWEoKSkge1xuICAgICAgICAgICAgbGV0IGJsb2NrcyA9IHRoaXMucHJvYmxlbS5zb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgICAgIHZhciB2YWxpZFNvdXJjZUluZGV4ZXMgPSB0aGlzLnZhbGlkU291cmNlSW5kZXhlcygpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2tzW2ldLnZpZXcuaWQgPT0gdGhpcy52aWV3LmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBteUluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbGlkU291cmNlSW5kZXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHZhbGlkU291cmNlSW5kZXhlc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT0gYmxvY2tzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zb3VyY2VBcmVhLmFwcGVuZENoaWxkKHRoaXMudmlldyk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcy52aWV3KS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZXggLSBteUluZGV4ID4gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zb3VyY2VBcmVhLmluc2VydEJlZm9yZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrc1tpbmRleF0udmlld1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMudmlldykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgYmxvY2tzID0gdGhpcy5wcm9ibGVtLmFuc3dlckJsb2NrcygpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2tzW2ldLnZpZXcuaWQgPT0gdGhpcy52aWV3LmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09IGJsb2Nrcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09IGJsb2Nrcy5sZW5ndGggLSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uYW5zd2VyQXJlYS5hcHBlbmRDaGlsZCh0aGlzLnZpZXcpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLmFuc3dlckFyZWEuaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9ja3NbaSArIDJdLnZpZXdcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLnZpZXcpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTW92ZSBzZWxlY3Rpb24gbGVmdFxuICAgIHNlbGVjdExlZnQoKSB7XG4gICAgICAgIGlmICghdGhpcy5pblNvdXJjZUFyZWEoKSkge1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMudmVydGljYWxPZmZzZXQoKTtcbiAgICAgICAgICAgIHZhciBzb3VyY2VCbG9ja3MgPSB0aGlzLnByb2JsZW0uZW5hYmxlZFNvdXJjZUJsb2NrcygpO1xuICAgICAgICAgICAgaWYgKHNvdXJjZUJsb2Nrcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGNob29zZU5leHQgPSBzb3VyY2VCbG9ja3NbMF07XG4gICAgICAgICAgICB2YXIgY2hvb3NlT2Zmc2V0ID0gY2hvb3NlTmV4dC52ZXJ0aWNhbE9mZnNldCgpIC0gb2Zmc2V0O1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBzb3VyY2VCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHNvdXJjZUJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbU9mZnNldCA9IGl0ZW0udmVydGljYWxPZmZzZXQoKSAtIG9mZnNldDtcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoaXRlbU9mZnNldCkgPCBNYXRoLmFicyhjaG9vc2VPZmZzZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNob29zZU5leHQgPSBpdGVtO1xuICAgICAgICAgICAgICAgICAgICBjaG9vc2VPZmZzZXQgPSBpdGVtT2Zmc2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0Rm9jdXMgPSBjaG9vc2VOZXh0O1xuICAgICAgICAgICAgY2hvb3NlTmV4dC5tYWtlVGFiSW5kZXgoKTtcbiAgICAgICAgICAgICQoY2hvb3NlTmV4dC52aWV3KS5mb2N1cygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIE1vdmUgc2VsZWN0aW9uIHVwXG4gICAgc2VsZWN0VXAoKSB7XG4gICAgICAgIHZhciBjaG9vc2VOZXh0ID0gZmFsc2U7XG4gICAgICAgIHZhciBibG9ja3M7XG4gICAgICAgIGlmICh0aGlzLmluU291cmNlQXJlYSgpKSB7XG4gICAgICAgICAgICBibG9ja3MgPSB0aGlzLnByb2JsZW0uZW5hYmxlZFNvdXJjZUJsb2NrcygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmxvY2tzID0gdGhpcy5wcm9ibGVtLmVuYWJsZWRBbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gYmxvY2tzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGlmIChjaG9vc2VOZXh0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRGb2N1cyA9IGl0ZW07XG4gICAgICAgICAgICAgICAgaXRlbS5tYWtlVGFiSW5kZXgoKTtcbiAgICAgICAgICAgICAgICAkKGl0ZW0udmlldykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0udmlldy5pZCA9PSB0aGlzLnZpZXcuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hvb3NlTmV4dCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIE1vdmUgc2VsZWN0aW9uIHJpZ2h0XG4gICAgc2VsZWN0UmlnaHQoKSB7XG4gICAgICAgIGlmICh0aGlzLmluU291cmNlQXJlYSgpKSB7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy52ZXJ0aWNhbE9mZnNldCgpO1xuICAgICAgICAgICAgdmFyIGJsb2NrcyA9IHRoaXMucHJvYmxlbS5lbmFibGVkQW5zd2VyQmxvY2tzKCk7XG4gICAgICAgICAgICBpZiAoYmxvY2tzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY2hvb3NlTmV4dCA9IGJsb2Nrc1swXTtcbiAgICAgICAgICAgIHZhciBjaG9vc2VPZmZzZXQgPSBjaG9vc2VOZXh0LnZlcnRpY2FsT2Zmc2V0KCkgLSBvZmZzZXQ7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gYmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBpdGVtT2Zmc2V0ID0gaXRlbS52ZXJ0aWNhbE9mZnNldCgpIC0gb2Zmc2V0O1xuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhpdGVtT2Zmc2V0KSA8IE1hdGguYWJzKGNob29zZU9mZnNldCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hvb3NlTmV4dCA9IGl0ZW07XG4gICAgICAgICAgICAgICAgICAgIGNob29zZU9mZnNldCA9IGl0ZW1PZmZzZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRGb2N1cyA9IGNob29zZU5leHQ7XG4gICAgICAgICAgICBjaG9vc2VOZXh0Lm1ha2VUYWJJbmRleCgpO1xuICAgICAgICAgICAgJChjaG9vc2VOZXh0LnZpZXcpLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTW92ZSBzZWxlY3Rpb24gZG93blxuICAgIHNlbGVjdERvd24oKSB7XG4gICAgICAgIHZhciBjaG9vc2VOZXh0ID0gZmFsc2U7XG4gICAgICAgIHZhciBibG9ja3M7XG4gICAgICAgIGlmICh0aGlzLmluU291cmNlQXJlYSgpKSB7XG4gICAgICAgICAgICBibG9ja3MgPSB0aGlzLnByb2JsZW0uZW5hYmxlZFNvdXJjZUJsb2NrcygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmxvY2tzID0gdGhpcy5wcm9ibGVtLmVuYWJsZWRBbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBibG9ja3NbaV07XG4gICAgICAgICAgICBpZiAoY2hvb3NlTmV4dCkge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0Rm9jdXMgPSBpdGVtO1xuICAgICAgICAgICAgICAgIGl0ZW0ubWFrZVRhYkluZGV4KCk7XG4gICAgICAgICAgICAgICAgJChpdGVtLnZpZXcpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLnZpZXcuaWQgPT0gdGhpcy52aWV3LmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNob29zZU5leHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBUb2dnbGUgd2hldGhlciB0byBtb3ZlIHRoaXMgYmxvY2tcbiAgICB0b2dnbGVNb3ZlKCkge1xuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnRleHRNb3ZlKSB7XG4gICAgICAgICAgICAkKHRoaXMudmlldykucmVtb3ZlQ2xhc3MoXCJ1cFwiKTtcbiAgICAgICAgICAgICQodGhpcy52aWV3KS5hZGRDbGFzcyhcImRvd25cIik7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5sb2dNb3ZlKFwia21vdmVcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMudmlldykucmVtb3ZlQ2xhc3MoXCJkb3duXCIpO1xuICAgICAgICAgICAgJCh0aGlzLnZpZXcpLmFkZENsYXNzKFwidXBcIik7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEFuc3dlciBhIHN0cmluZyB0aGF0IHJlcHJlc2VudHMgdGhpcyBjb2RlYmxvY2sgZm9yIHNhdmluZ1xuICAgIGhhc2goKSB7XG4gICAgICAgIHZhciBoYXNoID0gXCJcIjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBoYXNoICs9IHRoaXMubGluZXNbaV0uaW5kZXggKyBcIl9cIjtcbiAgICAgICAgfVxuICAgICAgICBoYXNoICs9IHRoaXMuaW5kZW50O1xuICAgICAgICByZXR1cm4gaGFzaDtcbiAgICB9XG4gICAgLy8gQW5zd2VyIHdoYXQgdGhlIGluZGVudCBzaG91bGQgYmUgZm9yIHRoZSBzb2x1dGlvblxuICAgIHNvbHV0aW9uSW5kZW50KCkge1xuICAgICAgICB2YXIgc2hhcmVkSW5kZW50ID0gdGhpcy5saW5lc1swXS5pbmRlbnQ7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc2hhcmVkSW5kZW50ID0gTWF0aC5taW4oc2hhcmVkSW5kZW50LCB0aGlzLmxpbmVzW2ldLmluZGVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNoYXJlZEluZGVudDtcbiAgICB9XG59XG4iLCIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT0gUGFyc29uc0xpbmUgT2JqZWN0ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gVGhlIG1vZGVsIGFuZCB2aWV3IG9mIGEgbGluZSBvZiBjb2RlLlxuPT09PT09PT0gQmFzZWQgb24gd2hhdCBpcyBzcGVjaWZpZWQgaW4gdGhlIHByb2JsZW0uXG49PT09PT09PSBQYXJzb25CbG9jayBvYmplY3RzIGhhdmUgb25lIG9yIG1vcmUgb2YgdGhlc2UuXG49PT09IFBST1BFUlRJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09IHByb2JsZW06IHRoZSBQYXJzb25zIHByb2JsZW1cbj09PT09PT09IGluZGV4OiB0aGUgaW5kZXggb2YgdGhlIGxpbmUgaW4gdGhlIHByb2JsZW1cbj09PT09PT09IHRleHQ6IHRoZSB0ZXh0IG9mIHRoZSBjb2RlIGxpbmVcbj09PT09PT09IGluZGVudDogdGhlIGluZGVudCBsZXZlbFxuPT09PT09PT0gdmlldzogYW4gZWxlbWVudCBmb3Igdmlld2luZyB0aGlzIG9iamVjdFxuPT09PT09PT0gZGlzdHJhY3Rvcjogd2hldGhlciBpdCBpcyBhIGRpc3RyYWN0b3Jcbj09PT09PT09IHBhaXJlZDogd2hldGhlciBpdCBpcyBhIHBhaXJlZCBkaXN0cmFjdG9yXG49PT09PT09PSBncm91cFdpdGhOZXh0OiB3aGV0aGVyIGl0IGlzIGdyb3VwZWQgd2l0aCB0aGUgZm9sbG93aW5nIGxpbmVcbj09PT09PT09IHdpZHRoOiB0aGUgcGl4ZWwgd2lkdGggd2hlbiByZW5kZXJlZFxuPT09PT09PT09PT09IGluIHRoZSBpbml0aWFsIGdyb3VwaW5nXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi8vIEluaXRpYWxpemUgZnJvbSBjb2Rlc3RyaW5nXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnNvbnNMaW5lIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9ibGVtLCBjb2Rlc3RyaW5nLCBkaXNwbGF5bWF0aCkge1xuICAgICAgICB0aGlzLnByb2JsZW0gPSBwcm9ibGVtO1xuICAgICAgICB0aGlzLmluZGV4ID0gcHJvYmxlbS5saW5lcy5sZW5ndGg7XG4gICAgICAgIHZhciB0cmltbWVkID0gY29kZXN0cmluZy5yZXBsYWNlKC9cXHMqJC8sIFwiXCIpO1xuICAgICAgICB0aGlzLnRleHQgPSB0cmltbWVkLnJlcGxhY2UoL15cXHMqLywgXCJcIik7XG4gICAgICAgIHRoaXMuaW5kZW50ID0gdHJpbW1lZC5sZW5ndGggLSB0aGlzLnRleHQubGVuZ3RoO1xuICAgICAgICAvLyBDcmVhdGUgdGhlIFZpZXdcbiAgICAgICAgdmFyIHZpZXc7XG4gICAgICAgIC8vIFRPRE86IHRoaXMgZG9lcyBub3Qgd29yayB3aXRoIGRpc3BsYXkgbWF0aC4uLiBQZXJoYXBzIHdpdGggcHJldGV4dCB3ZSBzaG91bGQgaGF2ZSBodG1sIGFzIGEgbGFuZ3VhZ2UgYW5kIGRvIG5vdGhpbmc/XG4gICAgICAgIFxuICAgICAgICBpZiAocHJvYmxlbS5vcHRpb25zLmxhbmd1YWdlID09IFwibmF0dXJhbFwiIHx8IHByb2JsZW0ub3B0aW9ucy5sYW5ndWFnZSA9PSBcIm1hdGhcIikge1xuICAgICAgICAgICAgaWYgKCEgZGlzcGxheW1hdGgpIHtcbiAgICAgICAgICAgICAgICB2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjb2RlXCIpO1xuICAgICAgICAgICAgJCh2aWV3KS5hZGRDbGFzcyhwcm9ibGVtLm9wdGlvbnMucHJldHRpZnlMYW5ndWFnZSk7XG4gICAgICAgIH1cbiAgICAgICAgdmlldy5pZCA9IHByb2JsZW0uY291bnRlcklkICsgXCItbGluZS1cIiArIHRoaXMuaW5kZXg7XG4gICAgICAgIHZpZXcuaW5uZXJIVE1MICs9IHRoaXMudGV4dDtcbiAgICAgICAgdGhpcy52aWV3ID0gdmlldztcbiAgICAgICAgcHJvYmxlbS5saW5lcy5wdXNoKHRoaXMpO1xuICAgIH1cbiAgICAvLyBJbml0aWFsaXplIHdoYXQgd2lkdGggdGhlIGxpbmUgd291bGQgbmF0dXJhbGx5IGhhdmUgKHdpdGhvdXQgaW5kZW50KVxuICAgIGluaXRpYWxpemVXaWR0aCgpIHtcbiAgICAgICAgLy8gdGhpcy53aWR0aCBkb2VzIG5vdCBhcHBlYXIgdG8gYmUgdXNlZCBhbnl3aGVyZSBsYXRlclxuICAgICAgICAvLyBzaW5jZSBjaGFuZ2luZyB0aGUgdmFsdWUgb2YgdGhpcy53aWR0aCBhcHBlYXJzIHRvIGhhdmUgbm8gZWZmZWN0LiAtIFZpbmNlbnQgUWl1IChTZXB0ZW1iZXIgMjAyMClcbiAgICAgICAgdGhpcy53aWR0aCA9XG4gICAgICAgICAgICAkKHRoaXMudmlldykub3V0ZXJXaWR0aCh0cnVlKSAtXG4gICAgICAgICAgICB0aGlzLnByb2JsZW0ub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQgKiB0aGlzLmluZGVudDtcblxuICAgICAgICAvLyBQYXNzIHRoaXMgaW5mb3JtYXRpb24gb24gdG8gYmUgdXNlZCBpbiBjbGFzcyBQYXJzb25zIGZ1bmN0aW9uIGluaXRpYWxpemVBcmVhc1xuICAgICAgICAvLyB0byBtYW51YWxseSBkZXRlcm1pbmUgYXBwcm9wcmlhdGUgd2lkdGhzIC0gVmluY2VudCBRaXUgKFNlcHRlbWJlciAyMDIwKVxuICAgICAgICB0aGlzLnZpZXcuZm9udFNpemUgPSB3aW5kb3dcbiAgICAgICAgICAgIC5nZXRDb21wdXRlZFN0eWxlKHRoaXMudmlldywgbnVsbClcbiAgICAgICAgICAgIC5nZXRQcm9wZXJ0eVZhbHVlKFwiZm9udC1zaXplXCIpO1xuICAgICAgICB0aGlzLnZpZXcucGl4ZWxzUGVySW5kZW50ID0gdGhpcy5wcm9ibGVtLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50O1xuICAgICAgICB0aGlzLnZpZXcuaW5kZW50ID0gdGhpcy5pbmRlbnQ7XG5cbiAgICAgICAgLy8gRmlndXJlIG91dCB3aGljaCB0eXBlZmFjZSB3aWxsIGJlIHJlbmRlcmVkIGJ5IGNvbXBhcmluZyB0ZXh0IHdpZHRocyB0byBicm93c2VyIGRlZmF1bHQgLSBWaW5jZW50IFFpdSAoU2VwdGVtYmVyIDIwMjApXG4gICAgICAgIHZhciB0ZW1wQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgICAgdmFyIHRlbXBDYW52YXNDdHggPSB0ZW1wQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgdmFyIHBvc3NpYmxlRm9udHMgPSB3aW5kb3dcbiAgICAgICAgICAgIC5nZXRDb21wdXRlZFN0eWxlKHRoaXMudmlldywgbnVsbClcbiAgICAgICAgICAgIC5nZXRQcm9wZXJ0eVZhbHVlKFwiZm9udC1mYW1pbHlcIilcbiAgICAgICAgICAgIC5zcGxpdChcIiwgXCIpO1xuICAgICAgICB2YXIgZmlsbGVyVGV4dCA9IFwiYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5LC4vIUAjJCVeJiotK1wiO1xuICAgICAgICB0ZW1wQ2FudmFzQ3R4LmZvbnQgPSB0aGlzLnZpZXcuZm9udFNpemUgKyBcIiBzZXJpZlwiO1xuICAgICAgICB2YXIgc2VyaWZXaWR0aCA9IHRlbXBDYW52YXNDdHgubWVhc3VyZVRleHQoZmlsbGVyVGV4dCkud2lkdGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zc2libGVGb250cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHBvc3NpYmxlRm9udHNbaV0uaW5jbHVkZXMoJ1wiJykpIHtcbiAgICAgICAgICAgICAgICBwb3NzaWJsZUZvbnRzW2ldID0gcG9zc2libGVGb250c1tpXS5yZXBsYWNlQWxsKCdcIicsIFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc3NpYmxlRm9udHNbaV0uaW5jbHVkZXMoXCInXCIpKSB7XG4gICAgICAgICAgICAgICAgcG9zc2libGVGb250c1tpXSA9IHBvc3NpYmxlRm9udHNbaV0ucmVwbGFjZUFsbChcIidcIiwgXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ZW1wQ2FudmFzQ3R4LmZvbnQgPSB0aGlzLnZpZXcuZm9udFNpemUgKyBcIiBcIiArIHBvc3NpYmxlRm9udHNbaV07XG4gICAgICAgICAgICBpZiAodGVtcENhbnZhc0N0eC5tZWFzdXJlVGV4dChmaWxsZXJUZXh0KS53aWR0aCAhPT0gc2VyaWZXaWR0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMudmlldy5mb250RmFtaWx5ID0gcG9zc2libGVGb250c1tpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBBbnN3ZXIgdGhlIGJsb2NrIHRoYXQgdGhpcyBsaW5lIGlzIGN1cnJlbnRseSBpblxuICAgIGJsb2NrKCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJvYmxlbS5ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBibG9jayA9IHRoaXMucHJvYmxlbS5ibG9ja3NbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGJsb2NrLmxpbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJsb2NrLmxpbmVzW2pdID09PSB0aGlzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBibG9jaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8gQW5zd2VyIHRoZSBpbmRlbnQgYmFzZWQgb24gdGhlIHZpZXdcbiAgICB2aWV3SW5kZW50KCkge1xuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLm5vaW5kZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbmRlbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgYmxvY2sgPSB0aGlzLmJsb2NrKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbmRlbnQgLSBibG9jay5zb2x1dGlvbkluZGVudCgpICsgYmxvY2suaW5kZW50O1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiZnVuY3Rpb24gSCgpIHtcbiAgICB2YXIgeCA9XG4gICAgICAgIG5hdmlnYXRvciAmJlxuICAgICAgICBuYXZpZ2F0b3IudXNlckFnZW50ICYmXG4gICAgICAgIC9cXGJNU0lFIDZcXC4vLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgSCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4geDtcbiAgICB9O1xuICAgIHJldHVybiB4O1xufVxuKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIHgoYikge1xuICAgICAgICBiID0gYi5zcGxpdCgvIC9nKTtcbiAgICAgICAgdmFyIGEgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgYyA9IGIubGVuZ3RoOyAtLWMgPj0gMDsgKSB7XG4gICAgICAgICAgICB2YXIgZCA9IGJbY107XG4gICAgICAgICAgICBpZiAoZCkgYVtkXSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuICAgIHZhciB5ID0gXCJicmVhayBjb250aW51ZSBkbyBlbHNlIGZvciBpZiByZXR1cm4gd2hpbGUgXCIsXG4gICAgICAgIFUgPVxuICAgICAgICAgICAgeSArXG4gICAgICAgICAgICBcImF1dG8gY2FzZSBjaGFyIGNvbnN0IGRlZmF1bHQgZG91YmxlIGVudW0gZXh0ZXJuIGZsb2F0IGdvdG8gaW50IGxvbmcgcmVnaXN0ZXIgc2hvcnQgc2lnbmVkIHNpemVvZiBzdGF0aWMgc3RydWN0IHN3aXRjaCB0eXBlZGVmIHVuaW9uIHVuc2lnbmVkIHZvaWQgdm9sYXRpbGUgXCIsXG4gICAgICAgIEQgPVxuICAgICAgICAgICAgVSArXG4gICAgICAgICAgICBcImNhdGNoIGNsYXNzIGRlbGV0ZSBmYWxzZSBpbXBvcnQgbmV3IG9wZXJhdG9yIHByaXZhdGUgcHJvdGVjdGVkIHB1YmxpYyB0aGlzIHRocm93IHRydWUgdHJ5IFwiLFxuICAgICAgICBJID1cbiAgICAgICAgICAgIEQgK1xuICAgICAgICAgICAgXCJhbGlnbm9mIGFsaWduX3VuaW9uIGFzbSBheGlvbSBib29sIGNvbmNlcHQgY29uY2VwdF9tYXAgY29uc3RfY2FzdCBjb25zdGV4cHIgZGVjbHR5cGUgZHluYW1pY19jYXN0IGV4cGxpY2l0IGV4cG9ydCBmcmllbmQgaW5saW5lIGxhdGVfY2hlY2sgbXV0YWJsZSBuYW1lc3BhY2UgbnVsbHB0ciByZWludGVycHJldF9jYXN0IHN0YXRpY19hc3NlcnQgc3RhdGljX2Nhc3QgdGVtcGxhdGUgdHlwZWlkIHR5cGVuYW1lIHR5cGVvZiB1c2luZyB2aXJ0dWFsIHdjaGFyX3Qgd2hlcmUgXCIsXG4gICAgICAgIEogPVxuICAgICAgICAgICAgRCArXG4gICAgICAgICAgICBcImJvb2xlYW4gYnl0ZSBleHRlbmRzIGZpbmFsIGZpbmFsbHkgaW1wbGVtZW50cyBpbXBvcnQgaW5zdGFuY2VvZiBudWxsIG5hdGl2ZSBwYWNrYWdlIHN0cmljdGZwIHN1cGVyIHN5bmNocm9uaXplZCB0aHJvd3MgdHJhbnNpZW50IFwiLFxuICAgICAgICBWID1cbiAgICAgICAgICAgIEogK1xuICAgICAgICAgICAgXCJhcyBiYXNlIGJ5IGNoZWNrZWQgZGVjaW1hbCBkZWxlZ2F0ZSBkZXNjZW5kaW5nIGV2ZW50IGZpeGVkIGZvcmVhY2ggZnJvbSBncm91cCBpbXBsaWNpdCBpbiBpbnRlcmZhY2UgaW50ZXJuYWwgaW50byBpcyBsb2NrIG9iamVjdCBvdXQgb3ZlcnJpZGUgb3JkZXJieSBwYXJhbXMgcmVhZG9ubHkgcmVmIHNieXRlIHNlYWxlZCBzdGFja2FsbG9jIHN0cmluZyBzZWxlY3QgdWludCB1bG9uZyB1bmNoZWNrZWQgdW5zYWZlIHVzaG9ydCB2YXIgXCIsXG4gICAgICAgIEsgPVxuICAgICAgICAgICAgRCArXG4gICAgICAgICAgICBcImRlYnVnZ2VyIGV2YWwgZXhwb3J0IGZ1bmN0aW9uIGdldCBudWxsIHNldCB1bmRlZmluZWQgdmFyIHdpdGggSW5maW5pdHkgTmFOIFwiLFxuICAgICAgICBMID1cbiAgICAgICAgICAgIFwiY2FsbGVyIGRlbGV0ZSBkaWUgZG8gZHVtcCBlbHNpZiBldmFsIGV4aXQgZm9yZWFjaCBmb3IgZ290byBpZiBpbXBvcnQgbGFzdCBsb2NhbCBteSBuZXh0IG5vIG91ciBwcmludCBwYWNrYWdlIHJlZG8gcmVxdWlyZSBzdWIgdW5kZWYgdW5sZXNzIHVudGlsIHVzZSB3YW50YXJyYXkgd2hpbGUgQkVHSU4gRU5EIFwiLFxuICAgICAgICBNID1cbiAgICAgICAgICAgIHkgK1xuICAgICAgICAgICAgXCJhbmQgYXMgYXNzZXJ0IGNsYXNzIGRlZiBkZWwgZWxpZiBleGNlcHQgZXhlYyBmaW5hbGx5IGZyb20gZ2xvYmFsIGltcG9ydCBpbiBpcyBsYW1iZGEgbm9ubG9jYWwgbm90IG9yIHBhc3MgcHJpbnQgcmFpc2UgdHJ5IHdpdGggeWllbGQgRmFsc2UgVHJ1ZSBOb25lIFwiLFxuICAgICAgICBOID1cbiAgICAgICAgICAgIHkgK1xuICAgICAgICAgICAgXCJhbGlhcyBhbmQgYmVnaW4gY2FzZSBjbGFzcyBkZWYgZGVmaW5lZCBlbHNpZiBlbmQgZW5zdXJlIGZhbHNlIGluIG1vZHVsZSBuZXh0IG5pbCBub3Qgb3IgcmVkbyByZXNjdWUgcmV0cnkgc2VsZiBzdXBlciB0aGVuIHRydWUgdW5kZWYgdW5sZXNzIHVudGlsIHdoZW4geWllbGQgQkVHSU4gRU5EIFwiLFxuICAgICAgICBPID0geSArIFwiY2FzZSBkb25lIGVsaWYgZXNhYyBldmFsIGZpIGZ1bmN0aW9uIGluIGxvY2FsIHNldCB0aGVuIHVudGlsIFwiLFxuICAgICAgICBXID0gSSArIFYgKyBLICsgTCArIE0gKyBOICsgTztcbiAgICBmdW5jdGlvbiBYKGIpIHtcbiAgICAgICAgcmV0dXJuIChiID49IFwiYVwiICYmIGIgPD0gXCJ6XCIpIHx8IChiID49IFwiQVwiICYmIGIgPD0gXCJaXCIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiB1KGIsIGEsIGMsIGQpIHtcbiAgICAgICAgYi51bnNoaWZ0KGMsIGQgfHwgMCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhLnNwbGljZS5hcHBseShhLCBiKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIGIuc3BsaWNlKDAsIDIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHZhciBZID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGIgPSBbXG4gICAgICAgICAgICAgICAgICAgIFwiIVwiLFxuICAgICAgICAgICAgICAgICAgICBcIiE9XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiIT09XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiI1wiLFxuICAgICAgICAgICAgICAgICAgICBcIiVcIixcbiAgICAgICAgICAgICAgICAgICAgXCIlPVwiLFxuICAgICAgICAgICAgICAgICAgICBcIiZcIixcbiAgICAgICAgICAgICAgICAgICAgXCImJlwiLFxuICAgICAgICAgICAgICAgICAgICBcIiYmPVwiLFxuICAgICAgICAgICAgICAgICAgICBcIiY9XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiKFwiLFxuICAgICAgICAgICAgICAgICAgICBcIipcIixcbiAgICAgICAgICAgICAgICAgICAgXCIqPVwiLFxuICAgICAgICAgICAgICAgICAgICBcIis9XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiLFwiLFxuICAgICAgICAgICAgICAgICAgICBcIi09XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiLT5cIixcbiAgICAgICAgICAgICAgICAgICAgXCIvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiLz1cIixcbiAgICAgICAgICAgICAgICAgICAgXCI6XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiOjpcIixcbiAgICAgICAgICAgICAgICAgICAgXCI7XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiPFwiLFxuICAgICAgICAgICAgICAgICAgICBcIjw8XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiPDw9XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiPD1cIixcbiAgICAgICAgICAgICAgICAgICAgXCI9XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiPT1cIixcbiAgICAgICAgICAgICAgICAgICAgXCI9PT1cIixcbiAgICAgICAgICAgICAgICAgICAgXCI+XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiPj1cIixcbiAgICAgICAgICAgICAgICAgICAgXCI+PlwiLFxuICAgICAgICAgICAgICAgICAgICBcIj4+PVwiLFxuICAgICAgICAgICAgICAgICAgICBcIj4+PlwiLFxuICAgICAgICAgICAgICAgICAgICBcIj4+Pj1cIixcbiAgICAgICAgICAgICAgICAgICAgXCI/XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiQFwiLFxuICAgICAgICAgICAgICAgICAgICBcIltcIixcbiAgICAgICAgICAgICAgICAgICAgXCJeXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiXj1cIixcbiAgICAgICAgICAgICAgICAgICAgXCJeXlwiLFxuICAgICAgICAgICAgICAgICAgICBcIl5ePVwiLFxuICAgICAgICAgICAgICAgICAgICBcIntcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ8XCIsXG4gICAgICAgICAgICAgICAgICAgIFwifD1cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ8fFwiLFxuICAgICAgICAgICAgICAgICAgICBcInx8PVwiLFxuICAgICAgICAgICAgICAgICAgICBcIn5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJicmVha1wiLFxuICAgICAgICAgICAgICAgICAgICBcImNhc2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjb250aW51ZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImRvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZWxzZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImZpbmFsbHlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpbnN0YW5jZW9mXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicmV0dXJuXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGhyb3dcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0cnlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlb2ZcIlxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgYSA9XG4gICAgICAgICAgICAgICAgICAgIFwiKD86KD86KD86XnxbXjAtOS5dKVxcXFwuezEsM30pfCg/Oig/Ol58W15cXFxcK10pXFxcXCspfCg/Oig/Ol58W15cXFxcLV0pLSlcIjtcbiAgICAgICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgYi5sZW5ndGg7ICsrYykge1xuICAgICAgICAgICAgICAgIHZhciBkID0gYltjXTtcbiAgICAgICAgICAgICAgICBhICs9IFgoZC5jaGFyQXQoMCkpXG4gICAgICAgICAgICAgICAgICAgID8gXCJ8XFxcXGJcIiArIGRcbiAgICAgICAgICAgICAgICAgICAgOiBcInxcIiArIGQucmVwbGFjZSgvKFtePTw+OiZdKS9nLCBcIlxcXFwkMVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGEgKz0gXCJ8XilcXFxccyokXCI7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChhKTtcbiAgICAgICAgfSkoKSxcbiAgICAgICAgUCA9IC8mL2csXG4gICAgICAgIFEgPSAvPC9nLFxuICAgICAgICBSID0gLz4vZyxcbiAgICAgICAgWiA9IC9cXFwiL2c7XG4gICAgZnVuY3Rpb24gJChiKSB7XG4gICAgICAgIHJldHVybiBiXG4gICAgICAgICAgICAucmVwbGFjZShQLCBcIiZhbXA7XCIpXG4gICAgICAgICAgICAucmVwbGFjZShRLCBcIiZsdDtcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKFIsIFwiJmd0O1wiKVxuICAgICAgICAgICAgLnJlcGxhY2UoWiwgXCImcXVvdDtcIik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIEUoYikge1xuICAgICAgICByZXR1cm4gYlxuICAgICAgICAgICAgLnJlcGxhY2UoUCwgXCImYW1wO1wiKVxuICAgICAgICAgICAgLnJlcGxhY2UoUSwgXCImbHQ7XCIpXG4gICAgICAgICAgICAucmVwbGFjZShSLCBcIiZndDtcIik7XG4gICAgfVxuICAgIHZhciBhYSA9IC8mbHQ7L2csXG4gICAgICAgIGJhID0gLyZndDsvZyxcbiAgICAgICAgY2EgPSAvJmFwb3M7L2csXG4gICAgICAgIGRhID0gLyZxdW90Oy9nLFxuICAgICAgICBlYSA9IC8mYW1wOy9nLFxuICAgICAgICBmYSA9IC8mbmJzcDsvZztcbiAgICBmdW5jdGlvbiBnYShiKSB7XG4gICAgICAgIHZhciBhID0gYi5pbmRleE9mKFwiJlwiKTtcbiAgICAgICAgaWYgKGEgPCAwKSByZXR1cm4gYjtcbiAgICAgICAgZm9yICgtLWE7IChhID0gYi5pbmRleE9mKFwiJiNcIiwgYSArIDEpKSA+PSAwOyApIHtcbiAgICAgICAgICAgIHZhciBjID0gYi5pbmRleE9mKFwiO1wiLCBhKTtcbiAgICAgICAgICAgIGlmIChjID49IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgZCA9IGIuc3Vic3RyaW5nKGEgKyAzLCBjKSxcbiAgICAgICAgICAgICAgICAgICAgZyA9IDEwO1xuICAgICAgICAgICAgICAgIGlmIChkICYmIGQuY2hhckF0KDApID09PSBcInhcIikge1xuICAgICAgICAgICAgICAgICAgICBkID0gZC5zdWJzdHJpbmcoMSk7XG4gICAgICAgICAgICAgICAgICAgIGcgPSAxNjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGUgPSBwYXJzZUludChkLCBnKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKGUpKVxuICAgICAgICAgICAgICAgICAgICBiID1cbiAgICAgICAgICAgICAgICAgICAgICAgIGIuc3Vic3RyaW5nKDAsIGEpICtcbiAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZy5mcm9tQ2hhckNvZGUoZSkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYi5zdWJzdHJpbmcoYyArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiXG4gICAgICAgICAgICAucmVwbGFjZShhYSwgXCI8XCIpXG4gICAgICAgICAgICAucmVwbGFjZShiYSwgXCI+XCIpXG4gICAgICAgICAgICAucmVwbGFjZShjYSwgXCInXCIpXG4gICAgICAgICAgICAucmVwbGFjZShkYSwgJ1wiJylcbiAgICAgICAgICAgIC5yZXBsYWNlKGVhLCBcIiZcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKGZhLCBcIiBcIik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIFMoYikge1xuICAgICAgICByZXR1cm4gXCJYTVBcIiA9PT0gYi50YWdOYW1lO1xuICAgIH1cbiAgICBmdW5jdGlvbiB6KGIsIGEpIHtcbiAgICAgICAgc3dpdGNoIChiLm5vZGVUeXBlKSB7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgdmFyIGMgPSBiLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBhLnB1c2goXCI8XCIsIGMpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGQgPSAwOyBkIDwgYi5hdHRyaWJ1dGVzLmxlbmd0aDsgKytkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBnID0gYi5hdHRyaWJ1dGVzW2RdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWcuc3BlY2lmaWVkKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgYS5wdXNoKFwiIFwiKTtcbiAgICAgICAgICAgICAgICAgICAgeihnLCBhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYS5wdXNoKFwiPlwiKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBlID0gYi5maXJzdENoaWxkOyBlOyBlID0gZS5uZXh0U2libGluZykgeihlLCBhKTtcbiAgICAgICAgICAgICAgICBpZiAoYi5maXJzdENoaWxkIHx8ICEvXig/OmJyfGxpbmt8aW1nKSQvLnRlc3QoYykpXG4gICAgICAgICAgICAgICAgICAgIGEucHVzaChcIjwvXCIsIGMsIFwiPlwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBhLnB1c2goYi5uYW1lLnRvTG93ZXJDYXNlKCksICc9XCInLCAkKGIudmFsdWUpLCAnXCInKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBhLnB1c2goRShiLm5vZGVWYWx1ZSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHZhciBGID0gbnVsbDtcbiAgICBmdW5jdGlvbiBoYShiKSB7XG4gICAgICAgIGlmIChudWxsID09PSBGKSB7XG4gICAgICAgICAgICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJQUkVcIik7XG4gICAgICAgICAgICBhLmFwcGVuZENoaWxkKFxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFxuICAgICAgICAgICAgICAgICAgICAnPCFET0NUWVBFIGZvbyBQVUJMSUMgXCJmb28gYmFyXCI+XFxuPGZvbyAvPidcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgRiA9ICEvPC8udGVzdChhLmlubmVySFRNTCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEYpIHtcbiAgICAgICAgICAgIHZhciBjID0gYi5pbm5lckhUTUw7XG4gICAgICAgICAgICBpZiAoUyhiKSkgYyA9IEUoYyk7XG4gICAgICAgICAgICByZXR1cm4gYztcbiAgICAgICAgfVxuICAgICAgICB2YXIgZCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBnID0gYi5maXJzdENoaWxkOyBnOyBnID0gZy5uZXh0U2libGluZykgeihnLCBkKTtcbiAgICAgICAgcmV0dXJuIGQuam9pbihcIlwiKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaWEoYikge1xuICAgICAgICB2YXIgYSA9IDA7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihjKSB7XG4gICAgICAgICAgICB2YXIgZCA9IG51bGwsXG4gICAgICAgICAgICAgICAgZyA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBlID0gMCwgaCA9IGMubGVuZ3RoOyBlIDwgaDsgKytlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGYgPSBjLmNoYXJBdChlKTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGYpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlxcdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFkKSBkID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBkLnB1c2goYy5zdWJzdHJpbmcoZywgZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSBiIC0gKGEgJSBiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgKz0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoOyBpID49IDA7IGkgLT0gXCIgICAgICAgICAgICAgICAgXCIubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQucHVzaChcIiAgICAgICAgICAgICAgICBcIi5zdWJzdHJpbmcoMCwgaSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZyA9IGUgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJcXG5cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICArK2E7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFkKSByZXR1cm4gYztcbiAgICAgICAgICAgIGQucHVzaChjLnN1YnN0cmluZyhnKSk7XG4gICAgICAgICAgICByZXR1cm4gZC5qb2luKFwiXCIpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICB2YXIgamEgPSAvKD86W148XSt8PCEtLVtcXHNcXFNdKj8tLVxcPnw8IVxcW0NEQVRBXFxbKFtcXHNcXFNdKj8pXFxdXFxdPnw8XFwvP1thLXpBLVpdW14+XSo+fDwpL2csXG4gICAgICAgIGthID0gL148IS0tLyxcbiAgICAgICAgbGEgPSAvXjxcXFtDREFUQVxcWy8sXG4gICAgICAgIG1hID0gL148YnJcXGIvaTtcbiAgICBmdW5jdGlvbiBuYShiKSB7XG4gICAgICAgIHZhciBhID0gYi5tYXRjaChqYSksXG4gICAgICAgICAgICBjID0gW10sXG4gICAgICAgICAgICBkID0gMCxcbiAgICAgICAgICAgIGcgPSBbXTtcbiAgICAgICAgaWYgKGEpXG4gICAgICAgICAgICBmb3IgKHZhciBlID0gMCwgaCA9IGEubGVuZ3RoOyBlIDwgaDsgKytlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGYgPSBhW2VdO1xuICAgICAgICAgICAgICAgIGlmIChmLmxlbmd0aCA+IDEgJiYgZi5jaGFyQXQoMCkgPT09IFwiPFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrYS50ZXN0KGYpKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhLnRlc3QoZikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMucHVzaChmLnN1YnN0cmluZyg5LCBmLmxlbmd0aCAtIDMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgKz0gZi5sZW5ndGggLSAxMjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYS50ZXN0KGYpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjLnB1c2goXCJcXG5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICArK2Q7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBnLnB1c2goZCwgZik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSBnYShmKTtcbiAgICAgICAgICAgICAgICAgICAgYy5wdXNoKGkpO1xuICAgICAgICAgICAgICAgICAgICBkICs9IGkubGVuZ3RoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNvdXJjZTogYy5qb2luKFwiXCIpLFxuICAgICAgICAgICAgdGFnczogZ1xuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiB2KGIsIGEpIHtcbiAgICAgICAgdmFyIGMgPSB7fTtcbiAgICAgICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGcgPSBiLmNvbmNhdChhKTtcbiAgICAgICAgICAgIGZvciAodmFyIGUgPSBnLmxlbmd0aDsgLS1lID49IDA7ICkge1xuICAgICAgICAgICAgICAgIHZhciBoID0gZ1tlXSxcbiAgICAgICAgICAgICAgICAgICAgZiA9IGhbM107XG4gICAgICAgICAgICAgICAgaWYgKGYpIGZvciAodmFyIGkgPSBmLmxlbmd0aDsgLS1pID49IDA7ICkgY1tmLmNoYXJBdChpKV0gPSBoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSgpO1xuICAgICAgICB2YXIgZCA9IGEubGVuZ3RoO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZywgZSkge1xuICAgICAgICAgICAgZSA9IGUgfHwgMDtcbiAgICAgICAgICAgIHZhciBoID0gW2UsIFwicGxuXCJdLFxuICAgICAgICAgICAgICAgIGYgPSBcIlwiLFxuICAgICAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgICAgIGogPSBnO1xuICAgICAgICAgICAgd2hpbGUgKGoubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdmFyIG8sXG4gICAgICAgICAgICAgICAgICAgIG0gPSBudWxsLFxuICAgICAgICAgICAgICAgICAgICBrLFxuICAgICAgICAgICAgICAgICAgICBsID0gY1tqLmNoYXJBdCgwKV07XG4gICAgICAgICAgICAgICAgaWYgKGwpIHtcbiAgICAgICAgICAgICAgICAgICAgayA9IGoubWF0Y2gobFsxXSk7XG4gICAgICAgICAgICAgICAgICAgIG0gPSBrWzBdO1xuICAgICAgICAgICAgICAgICAgICBvID0gbFswXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBuID0gMDsgbiA8IGQ7ICsrbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbCA9IGFbbl07XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcCA9IGxbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocCAmJiAhcC50ZXN0KGYpKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSBqLm1hdGNoKGxbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtID0ga1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvID0gbFswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG8gPSBcInBsblwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgbSA9IGouc3Vic3RyaW5nKDAsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGgucHVzaChlICsgaSwgbyk7XG4gICAgICAgICAgICAgICAgaSArPSBtLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBqID0gai5zdWJzdHJpbmcobS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIGlmIChvICE9PSBcImNvbVwiICYmIC9cXFMvLnRlc3QobSkpIGYgPSBtO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGg7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHZhciBvYSA9IHYoXG4gICAgICAgIFtdLFxuICAgICAgICBbXG4gICAgICAgICAgICBbXCJwbG5cIiwgL15bXjxdKy8sIG51bGxdLFxuICAgICAgICAgICAgW1wiZGVjXCIsIC9ePCFcXHdbXj5dKig/Oj58JCkvLCBudWxsXSxcbiAgICAgICAgICAgIFtcImNvbVwiLCAvXjwhLS1bXFxzXFxTXSo/KD86LS1cXD58JCkvLCBudWxsXSxcbiAgICAgICAgICAgIFtcInNyY1wiLCAvXjxcXD9bXFxzXFxTXSo/KD86XFw/PnwkKS8sIG51bGxdLFxuICAgICAgICAgICAgW1wic3JjXCIsIC9ePCVbXFxzXFxTXSo/KD86JT58JCkvLCBudWxsXSxcbiAgICAgICAgICAgIFtcInNyY1wiLCAvXjwoc2NyaXB0fHN0eWxlfHhtcClcXGJbXj5dKj5bXFxzXFxTXSo/PFxcL1xcMVxcYltePl0qPi9pLCBudWxsXSxcbiAgICAgICAgICAgIFtcInRhZ1wiLCAvXjxcXC8/XFx3W148Pl0qPi8sIG51bGxdXG4gICAgICAgIF1cbiAgICApO1xuICAgIGZ1bmN0aW9uIHBhKGIpIHtcbiAgICAgICAgdmFyIGEgPSBvYShiKTtcbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBhLmxlbmd0aDsgYyArPSAyKVxuICAgICAgICAgICAgaWYgKGFbYyArIDFdID09PSBcInNyY1wiKSB7XG4gICAgICAgICAgICAgICAgdmFyIGQsIGc7XG4gICAgICAgICAgICAgICAgZCA9IGFbY107XG4gICAgICAgICAgICAgICAgZyA9IGMgKyAyIDwgYS5sZW5ndGggPyBhW2MgKyAyXSA6IGIubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHZhciBlID0gYi5zdWJzdHJpbmcoZCwgZyksXG4gICAgICAgICAgICAgICAgICAgIGggPSBlLm1hdGNoKC9eKDxbXj5dKj4pKFtcXHNcXFNdKikoPFxcL1tePl0qPikkLyk7XG4gICAgICAgICAgICAgICAgaWYgKGgpXG4gICAgICAgICAgICAgICAgICAgIGEuc3BsaWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgYyxcbiAgICAgICAgICAgICAgICAgICAgICAgIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICBkLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0YWdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgKyBoWzFdLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3JjXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBkICsgaFsxXS5sZW5ndGggKyAoaFsyXSB8fCBcIlwiKS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRhZ1wiXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICB2YXIgcWEgPSB2KFxuICAgICAgICBbXG4gICAgICAgICAgICBbXCJhdHZcIiwgL15cXCdbXlxcJ10qKD86XFwnfCQpLywgbnVsbCwgXCInXCJdLFxuICAgICAgICAgICAgW1wiYXR2XCIsIC9eXFxcIlteXFxcIl0qKD86XFxcInwkKS8sIG51bGwsICdcIiddLFxuICAgICAgICAgICAgW1wicHVuXCIsIC9eWzw+XFwvPV0rLywgbnVsbCwgXCI8Pi89XCJdXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAgIFtcInRhZ1wiLCAvXltcXHc6XFwtXSsvLCAvXjwvXSxcbiAgICAgICAgICAgIFtcImF0dlwiLCAvXltcXHdcXC1dKy8sIC9ePS9dLFxuICAgICAgICAgICAgW1wiYXRuXCIsIC9eW1xcdzpcXC1dKy8sIG51bGxdLFxuICAgICAgICAgICAgW1wicGxuXCIsIC9eXFxzKy8sIG51bGwsIFwiIFxcdFxcclxcblwiXVxuICAgICAgICBdXG4gICAgKTtcbiAgICBmdW5jdGlvbiByYShiLCBhKSB7XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgYS5sZW5ndGg7IGMgKz0gMikge1xuICAgICAgICAgICAgdmFyIGQgPSBhW2MgKyAxXTtcbiAgICAgICAgICAgIGlmIChkID09PSBcInRhZ1wiKSB7XG4gICAgICAgICAgICAgICAgdmFyIGcsIGU7XG4gICAgICAgICAgICAgICAgZyA9IGFbY107XG4gICAgICAgICAgICAgICAgZSA9IGMgKyAyIDwgYS5sZW5ndGggPyBhW2MgKyAyXSA6IGIubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHZhciBoID0gYi5zdWJzdHJpbmcoZywgZSksXG4gICAgICAgICAgICAgICAgICAgIGYgPSBxYShoLCBnKTtcbiAgICAgICAgICAgICAgICB1KGYsIGEsIGMsIDIpO1xuICAgICAgICAgICAgICAgIGMgKz0gZi5sZW5ndGggLSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICBmdW5jdGlvbiByKGIpIHtcbiAgICAgICAgdmFyIGEgPSBbXSxcbiAgICAgICAgICAgIGMgPSBbXTtcbiAgICAgICAgaWYgKGIudHJpcGxlUXVvdGVkU3RyaW5ncylcbiAgICAgICAgICAgIGEucHVzaChbXG4gICAgICAgICAgICAgICAgXCJzdHJcIixcbiAgICAgICAgICAgICAgICAvXig/OlxcJ1xcJ1xcJyg/OlteXFwnXFxcXF18XFxcXFtcXHNcXFNdfFxcJ3sxLDJ9KD89W15cXCddKSkqKD86XFwnXFwnXFwnfCQpfFxcXCJcXFwiXFxcIig/OlteXFxcIlxcXFxdfFxcXFxbXFxzXFxTXXxcXFwiezEsMn0oPz1bXlxcXCJdKSkqKD86XFxcIlxcXCJcXFwifCQpfFxcJyg/OlteXFxcXFxcJ118XFxcXFtcXHNcXFNdKSooPzpcXCd8JCl8XFxcIig/OlteXFxcXFxcXCJdfFxcXFxbXFxzXFxTXSkqKD86XFxcInwkKSkvLFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgXCInXFxcIlwiXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgZWxzZSBpZiAoYi5tdWx0aUxpbmVTdHJpbmdzKVxuICAgICAgICAgICAgYS5wdXNoKFtcbiAgICAgICAgICAgICAgICBcInN0clwiLFxuICAgICAgICAgICAgICAgIC9eKD86XFwnKD86W15cXFxcXFwnXXxcXFxcW1xcc1xcU10pKig/OlxcJ3wkKXxcXFwiKD86W15cXFxcXFxcIl18XFxcXFtcXHNcXFNdKSooPzpcXFwifCQpfFxcYCg/OlteXFxcXFxcYF18XFxcXFtcXHNcXFNdKSooPzpcXGB8JCkpLyxcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgIFwiJ1xcXCJgXCJcbiAgICAgICAgICAgIF0pO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBhLnB1c2goW1xuICAgICAgICAgICAgICAgIFwic3RyXCIsXG4gICAgICAgICAgICAgICAgL14oPzpcXCcoPzpbXlxcXFxcXCdcXHJcXG5dfFxcXFwuKSooPzpcXCd8JCl8XFxcIig/OlteXFxcXFxcXCJcXHJcXG5dfFxcXFwuKSooPzpcXFwifCQpKS8sXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICBcIlxcXCInXCJcbiAgICAgICAgICAgIF0pO1xuICAgICAgICBjLnB1c2goW1wicGxuXCIsIC9eKD86W15cXCdcXFwiXFxgXFwvXFwjXSspLywgbnVsbCwgXCIgXFxyXFxuXCJdKTtcbiAgICAgICAgaWYgKGIuaGFzaENvbW1lbnRzKSBhLnB1c2goW1wiY29tXCIsIC9eI1teXFxyXFxuXSovLCBudWxsLCBcIiNcIl0pO1xuICAgICAgICBpZiAoYi5jU3R5bGVDb21tZW50cykgYy5wdXNoKFtcImNvbVwiLCAvXlxcL1xcL1teXFxyXFxuXSovLCBudWxsXSk7XG4gICAgICAgIGlmIChiLnJlZ2V4TGl0ZXJhbHMpXG4gICAgICAgICAgICBjLnB1c2goW1xuICAgICAgICAgICAgICAgIFwic3RyXCIsXG4gICAgICAgICAgICAgICAgL15cXC8oPzpbXlxcXFxcXCpcXC9cXFtdfFxcXFxbXFxzXFxTXXxcXFsoPzpbXlxcXVxcXFxdfFxcXFwuKSooPzpcXF18JCkpKyg/OlxcL3wkKS8sXG4gICAgICAgICAgICAgICAgWVxuICAgICAgICAgICAgXSk7XG4gICAgICAgIGlmIChiLmNTdHlsZUNvbW1lbnRzKSBjLnB1c2goW1wiY29tXCIsIC9eXFwvXFwqW1xcc1xcU10qPyg/OlxcKlxcL3wkKS8sIG51bGxdKTtcbiAgICAgICAgdmFyIGQgPSB4KGIua2V5d29yZHMpO1xuICAgICAgICBiID0gbnVsbDtcbiAgICAgICAgdmFyIGcgPSB2KGEsIGMpLFxuICAgICAgICAgICAgZSA9IHYoXG4gICAgICAgICAgICAgICAgW10sXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICBbXCJwbG5cIiwgL15cXHMrLywgbnVsbCwgXCIgXFxyXFxuXCJdLFxuICAgICAgICAgICAgICAgICAgICBbXCJwbG5cIiwgL15bYS16XyRAXVthLXpfJEAwLTldKi9pLCBudWxsXSxcbiAgICAgICAgICAgICAgICAgICAgW1wibGl0XCIsIC9eMHhbYS1mMC05XStbYS16XS9pLCBudWxsXSxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJsaXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIC9eKD86XFxkKD86X1xcZCspKlxcZCooPzpcXC5cXGQqKT98XFwuXFxkKykoPzplWytcXC1dP1xcZCspP1thLXpdKi9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiMTIzNDU2Nzg5XCJcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgW1wicHVuXCIsIC9eW15cXHNcXHdcXC4kQF0rLywgbnVsbF1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICApO1xuICAgICAgICBmdW5jdGlvbiBoKGYsIGkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaS5sZW5ndGg7IGogKz0gMikge1xuICAgICAgICAgICAgICAgIHZhciBvID0gaVtqICsgMV07XG4gICAgICAgICAgICAgICAgaWYgKG8gPT09IFwicGxuXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG0sIGssIGwsIG47XG4gICAgICAgICAgICAgICAgICAgIG0gPSBpW2pdO1xuICAgICAgICAgICAgICAgICAgICBrID0gaiArIDIgPCBpLmxlbmd0aCA/IGlbaiArIDJdIDogZi5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGwgPSBmLnN1YnN0cmluZyhtLCBrKTtcbiAgICAgICAgICAgICAgICAgICAgbiA9IGUobCwgbSk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHAgPSAwLCB0ID0gbi5sZW5ndGg7IHAgPCB0OyBwICs9IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3ID0gbltwICsgMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodyA9PT0gXCJwbG5cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBBID0gbltwXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQiA9IHAgKyAyIDwgdCA/IG5bcCArIDJdIDogbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHMgPSBmLnN1YnN0cmluZyhBLCBCKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocyA9PT0gXCIuXCIpIG5bcCArIDFdID0gXCJwdW5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChzIGluIGQpIG5bcCArIDFdID0gXCJrd2RcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgvXkA/W0EtWl1bQS1aJF0qW2Etel1bQS1aYS16JF0qJC8udGVzdChzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbltwICsgMV0gPSBzLmNoYXJBdCgwKSA9PT0gXCJAXCIgPyBcImxpdFwiIDogXCJ0eXBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB1KG4sIGksIGosIDIpO1xuICAgICAgICAgICAgICAgICAgICBqICs9IG4ubGVuZ3RoIC0gMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZikge1xuICAgICAgICAgICAgdmFyIGkgPSBnKGYpO1xuICAgICAgICAgICAgaSA9IGgoZiwgaSk7XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgdmFyIEcgPSByKHtcbiAgICAgICAga2V5d29yZHM6IFcsXG4gICAgICAgIGhhc2hDb21tZW50czogdHJ1ZSxcbiAgICAgICAgY1N0eWxlQ29tbWVudHM6IHRydWUsXG4gICAgICAgIG11bHRpTGluZVN0cmluZ3M6IHRydWUsXG4gICAgICAgIHJlZ2V4TGl0ZXJhbHM6IHRydWVcbiAgICB9KTtcbiAgICBmdW5jdGlvbiBzYShiLCBhKSB7XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgYS5sZW5ndGg7IGMgKz0gMikge1xuICAgICAgICAgICAgdmFyIGQgPSBhW2MgKyAxXTtcbiAgICAgICAgICAgIGlmIChkID09PSBcInNyY1wiKSB7XG4gICAgICAgICAgICAgICAgdmFyIGcsIGU7XG4gICAgICAgICAgICAgICAgZyA9IGFbY107XG4gICAgICAgICAgICAgICAgZSA9IGMgKyAyIDwgYS5sZW5ndGggPyBhW2MgKyAyXSA6IGIubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHZhciBoID0gRyhiLnN1YnN0cmluZyhnLCBlKSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgZiA9IDAsIGkgPSBoLmxlbmd0aDsgZiA8IGk7IGYgKz0gMikgaFtmXSArPSBnO1xuICAgICAgICAgICAgICAgIHUoaCwgYSwgYywgMik7XG4gICAgICAgICAgICAgICAgYyArPSBoLmxlbmd0aCAtIDI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHRhKGIsIGEpIHtcbiAgICAgICAgdmFyIGMgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBhLmxlbmd0aDsgZCArPSAyKSB7XG4gICAgICAgICAgICB2YXIgZyA9IGFbZCArIDFdLFxuICAgICAgICAgICAgICAgIGUsXG4gICAgICAgICAgICAgICAgaDtcbiAgICAgICAgICAgIGlmIChnID09PSBcImF0blwiKSB7XG4gICAgICAgICAgICAgICAgZSA9IGFbZF07XG4gICAgICAgICAgICAgICAgaCA9IGQgKyAyIDwgYS5sZW5ndGggPyBhW2QgKyAyXSA6IGIubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGMgPSAvXm9ufF5zdHlsZSQvaS50ZXN0KGIuc3Vic3RyaW5nKGUsIGgpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZyA9PT0gXCJhdHZcIikge1xuICAgICAgICAgICAgICAgIGlmIChjKSB7XG4gICAgICAgICAgICAgICAgICAgIGUgPSBhW2RdO1xuICAgICAgICAgICAgICAgICAgICBoID0gZCArIDIgPCBhLmxlbmd0aCA/IGFbZCArIDJdIDogYi5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmID0gYi5zdWJzdHJpbmcoZSwgaCksXG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gZi5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBqID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpID49IDIgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvXltcXFwiXFwnXS8udGVzdChmKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGYuY2hhckF0KDApID09PSBmLmNoYXJBdChpIC0gMSksXG4gICAgICAgICAgICAgICAgICAgICAgICBvLFxuICAgICAgICAgICAgICAgICAgICAgICAgbSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGs7XG4gICAgICAgICAgICAgICAgICAgIGlmIChqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtID0gZSArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBrID0gaCAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBvID0gZjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG0gPSBlICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSBoIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG8gPSBmLnN1YnN0cmluZygxLCBmLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBsID0gRyhvKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbiA9IDAsIHAgPSBsLmxlbmd0aDsgbiA8IHA7IG4gKz0gMikgbFtuXSArPSBtO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbC5wdXNoKGssIFwiYXR2XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdShsLCBhLCBkICsgMiwgMCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB1KGwsIGEsIGQsIDIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVhKGIpIHtcbiAgICAgICAgdmFyIGEgPSBwYShiKTtcbiAgICAgICAgYSA9IHJhKGIsIGEpO1xuICAgICAgICBhID0gc2EoYiwgYSk7XG4gICAgICAgIGEgPSB0YShiLCBhKTtcbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHZhKGIsIGEsIGMpIHtcbiAgICAgICAgdmFyIGQgPSBbXSxcbiAgICAgICAgICAgIGcgPSAwLFxuICAgICAgICAgICAgZSA9IG51bGwsXG4gICAgICAgICAgICBoID0gbnVsbCxcbiAgICAgICAgICAgIGYgPSAwLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBqID0gaWEoOCk7XG4gICAgICAgIGZ1bmN0aW9uIG8oaykge1xuICAgICAgICAgICAgaWYgKGsgPiBnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUgJiYgZSAhPT0gaCkge1xuICAgICAgICAgICAgICAgICAgICBkLnB1c2goXCI8L3NwYW4+XCIpO1xuICAgICAgICAgICAgICAgICAgICBlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFlICYmIGgpIHtcbiAgICAgICAgICAgICAgICAgICAgZSA9IGg7XG4gICAgICAgICAgICAgICAgICAgIGQucHVzaCgnPHNwYW4gY2xhc3M9XCInLCBlLCAnXCI+Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBsID0gRShqKGIuc3Vic3RyaW5nKGcsIGspKSlcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyhcXHJcXG4/fFxcbnwgKSAvZywgXCIkMSZuYnNwO1wiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxyXFxuP3xcXG4vZywgXCI8YnIgLz5cIik7XG4gICAgICAgICAgICAgICAgZC5wdXNoKGwpO1xuICAgICAgICAgICAgICAgIGcgPSBrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICB2YXIgbTtcbiAgICAgICAgICAgIG0gPSBmIDwgYS5sZW5ndGggPyAoaSA8IGMubGVuZ3RoID8gYVtmXSA8PSBjW2ldIDogdHJ1ZSkgOiBmYWxzZTtcbiAgICAgICAgICAgIGlmIChtKSB7XG4gICAgICAgICAgICAgICAgbyhhW2ZdKTtcbiAgICAgICAgICAgICAgICBpZiAoZSkge1xuICAgICAgICAgICAgICAgICAgICBkLnB1c2goXCI8L3NwYW4+XCIpO1xuICAgICAgICAgICAgICAgICAgICBlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZC5wdXNoKGFbZiArIDFdKTtcbiAgICAgICAgICAgICAgICBmICs9IDI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGkgPCBjLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIG8oY1tpXSk7XG4gICAgICAgICAgICAgICAgaCA9IGNbaSArIDFdO1xuICAgICAgICAgICAgICAgIGkgKz0gMjtcbiAgICAgICAgICAgIH0gZWxzZSBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBvKGIubGVuZ3RoKTtcbiAgICAgICAgaWYgKGUpIGQucHVzaChcIjwvc3Bhbj5cIik7XG4gICAgICAgIHJldHVybiBkLmpvaW4oXCJcIik7XG4gICAgfVxuICAgIHZhciBDID0ge307XG4gICAgZnVuY3Rpb24gcShiLCBhKSB7XG4gICAgICAgIGZvciAodmFyIGMgPSBhLmxlbmd0aDsgLS1jID49IDA7ICkge1xuICAgICAgICAgICAgdmFyIGQgPSBhW2NdO1xuICAgICAgICAgICAgaWYgKCFDLmhhc093blByb3BlcnR5KGQpKSBDW2RdID0gYjtcbiAgICAgICAgICAgIGVsc2UgaWYgKFwiY29uc29sZVwiIGluIHdpbmRvdylcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNhbm5vdCBvdmVycmlkZSBsYW5ndWFnZSBoYW5kbGVyICVzXCIsIGQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHEoRywgW1wiZGVmYXVsdC1jb2RlXCJdKTtcbiAgICBxKHVhLCBbXCJkZWZhdWx0LW1hcmt1cFwiLCBcImh0bWxcIiwgXCJodG1cIiwgXCJ4aHRtbFwiLCBcInhtbFwiLCBcInhzbFwiXSk7XG4gICAgcShcbiAgICAgICAgcih7XG4gICAgICAgICAgICBrZXl3b3JkczogSSxcbiAgICAgICAgICAgIGhhc2hDb21tZW50czogdHJ1ZSxcbiAgICAgICAgICAgIGNTdHlsZUNvbW1lbnRzOiB0cnVlXG4gICAgICAgIH0pLFxuICAgICAgICBbXCJjXCIsIFwiY2NcIiwgXCJjcHBcIiwgXCJjc1wiLCBcImN4eFwiLCBcImN5Y1wiXVxuICAgICk7XG4gICAgcShcbiAgICAgICAgcih7XG4gICAgICAgICAgICBrZXl3b3JkczogSixcbiAgICAgICAgICAgIGNTdHlsZUNvbW1lbnRzOiB0cnVlXG4gICAgICAgIH0pLFxuICAgICAgICBbXCJqYXZhXCJdXG4gICAgKTtcbiAgICBxKFxuICAgICAgICByKHtcbiAgICAgICAgICAgIGtleXdvcmRzOiBPLFxuICAgICAgICAgICAgaGFzaENvbW1lbnRzOiB0cnVlLFxuICAgICAgICAgICAgbXVsdGlMaW5lU3RyaW5nczogdHJ1ZVxuICAgICAgICB9KSxcbiAgICAgICAgW1wiYnNoXCIsIFwiY3NoXCIsIFwic2hcIl1cbiAgICApO1xuICAgIHEoXG4gICAgICAgIHIoe1xuICAgICAgICAgICAga2V5d29yZHM6IE0sXG4gICAgICAgICAgICBoYXNoQ29tbWVudHM6IHRydWUsXG4gICAgICAgICAgICBtdWx0aUxpbmVTdHJpbmdzOiB0cnVlLFxuICAgICAgICAgICAgdHJpcGxlUXVvdGVkU3RyaW5nczogdHJ1ZVxuICAgICAgICB9KSxcbiAgICAgICAgW1wiY3ZcIiwgXCJweVwiXVxuICAgICk7XG4gICAgcShcbiAgICAgICAgcih7XG4gICAgICAgICAgICBrZXl3b3JkczogTCxcbiAgICAgICAgICAgIGhhc2hDb21tZW50czogdHJ1ZSxcbiAgICAgICAgICAgIG11bHRpTGluZVN0cmluZ3M6IHRydWUsXG4gICAgICAgICAgICByZWdleExpdGVyYWxzOiB0cnVlXG4gICAgICAgIH0pLFxuICAgICAgICBbXCJwZXJsXCIsIFwicGxcIiwgXCJwbVwiXVxuICAgICk7XG4gICAgcShcbiAgICAgICAgcih7XG4gICAgICAgICAgICBrZXl3b3JkczogTixcbiAgICAgICAgICAgIGhhc2hDb21tZW50czogdHJ1ZSxcbiAgICAgICAgICAgIG11bHRpTGluZVN0cmluZ3M6IHRydWUsXG4gICAgICAgICAgICByZWdleExpdGVyYWxzOiB0cnVlXG4gICAgICAgIH0pLFxuICAgICAgICBbXCJyYlwiXVxuICAgICk7XG4gICAgcShcbiAgICAgICAgcih7XG4gICAgICAgICAgICBrZXl3b3JkczogSyxcbiAgICAgICAgICAgIGNTdHlsZUNvbW1lbnRzOiB0cnVlLFxuICAgICAgICAgICAgcmVnZXhMaXRlcmFsczogdHJ1ZVxuICAgICAgICB9KSxcbiAgICAgICAgW1wianNcIl1cbiAgICApO1xuICAgIGZ1bmN0aW9uIFQoYiwgYSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIGMgPSBuYShiKSxcbiAgICAgICAgICAgICAgICBkID0gYy5zb3VyY2UsXG4gICAgICAgICAgICAgICAgZyA9IGMudGFncztcbiAgICAgICAgICAgIGlmICghQy5oYXNPd25Qcm9wZXJ0eShhKSlcbiAgICAgICAgICAgICAgICBhID0gL15cXHMqPC8udGVzdChkKSA/IFwiZGVmYXVsdC1tYXJrdXBcIiA6IFwiZGVmYXVsdC1jb2RlXCI7XG4gICAgICAgICAgICB2YXIgZSA9IENbYV0uY2FsbCh7fSwgZCk7XG4gICAgICAgICAgICByZXR1cm4gdmEoZCwgZywgZSk7XG4gICAgICAgIH0gY2F0Y2ggKGgpIHtcbiAgICAgICAgICAgIGlmIChcImNvbnNvbGVcIiBpbiB3aW5kb3cpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiB3YShiKSB7XG4gICAgICAgIHZhciBhID0gSCgpLFxuICAgICAgICAgICAgYyA9IFtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInByZVwiKSxcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImNvZGVcIiksXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJsaVwiKSxcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInhtcFwiKVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgZyA9IDA7IGcgPCBjLmxlbmd0aDsgKytnKVxuICAgICAgICAgICAgZm9yICh2YXIgZSA9IDA7IGUgPCBjW2ddLmxlbmd0aDsgKytlKSBkLnB1c2goY1tnXVtlXSk7XG4gICAgICAgIGMgPSBudWxsO1xuICAgICAgICB2YXIgaCA9IDA7XG4gICAgICAgIGZ1bmN0aW9uIGYoKSB7XG4gICAgICAgICAgICB2YXIgaSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgMjUwO1xuICAgICAgICAgICAgZm9yICg7IGggPCBkLmxlbmd0aCAmJiBuZXcgRGF0ZSgpLmdldFRpbWUoKSA8IGk7IGgrKykge1xuICAgICAgICAgICAgICAgIHZhciBqID0gZFtoXTtcbiAgICAgICAgICAgICAgICBpZiAoai5jbGFzc05hbWUgJiYgai5jbGFzc05hbWUuaW5kZXhPZihcInByZXR0eXByaW50XCIpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSBqLmNsYXNzTmFtZS5tYXRjaCgvXFxibGFuZy0oXFx3KylcXGIvKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG8pIG8gPSBvWzFdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gai5wYXJlbnROb2RlOyBrOyBrID0gay5wYXJlbnROb2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChrLnRhZ05hbWUgPT09IFwicHJlXCIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgay50YWdOYW1lID09PSBcImNvZGVcIiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrLnRhZ05hbWUgPT09IFwieG1wXCIpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgay5jbGFzc05hbWUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrLmNsYXNzTmFtZS5pbmRleE9mKFwicHJldHR5cHJpbnRcIikgPj0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGwgPSBoYShqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGwgPSBsLnJlcGxhY2UoLyg/Olxcclxcbj98XFxuKSQvLCBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuID0gVChsLCBvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghUyhqKSkgai5pbm5lckhUTUwgPSBuO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiUFJFXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHQgPSAwOyB0IDwgai5hdHRyaWJ1dGVzLmxlbmd0aDsgKyt0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3ID0gai5hdHRyaWJ1dGVzW3RdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAody5zcGVjaWZpZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwLnNldEF0dHJpYnV0ZSh3Lm5hbWUsIHcudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwLmlubmVySFRNTCA9IG47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgai5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChwLCBqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwID0gajtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhICYmIGoudGFnTmFtZSA9PT0gXCJQUkVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBBID0gai5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJyXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIEIgPSBBLmxlbmd0aDsgLS1CID49IDA7ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IEFbQl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHMucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlxcclxcblwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaCA8IGQubGVuZ3RoKSBzZXRUaW1lb3V0KGYsIDI1MCk7XG4gICAgICAgICAgICBlbHNlIGlmIChiKSBiKCk7XG4gICAgICAgIH1cbiAgICAgICAgZigpO1xuICAgIH1cbiAgICB3aW5kb3cuUFJfbm9ybWFsaXplZEh0bWwgPSB6O1xuICAgIHdpbmRvdy5wcmV0dHlQcmludE9uZSA9IFQ7XG4gICAgd2luZG93LnByZXR0eVByaW50ID0gd2E7XG4gICAgd2luZG93LlBSID0ge1xuICAgICAgICBjcmVhdGVTaW1wbGVMZXhlcjogdixcbiAgICAgICAgcmVnaXN0ZXJMYW5nSGFuZGxlcjogcSxcbiAgICAgICAgc291cmNlRGVjb3JhdG9yOiByLFxuICAgICAgICBQUl9BVFRSSUJfTkFNRTogXCJhdG5cIixcbiAgICAgICAgUFJfQVRUUklCX1ZBTFVFOiBcImF0dlwiLFxuICAgICAgICBQUl9DT01NRU5UOiBcImNvbVwiLFxuICAgICAgICBQUl9ERUNMQVJBVElPTjogXCJkZWNcIixcbiAgICAgICAgUFJfS0VZV09SRDogXCJrd2RcIixcbiAgICAgICAgUFJfTElURVJBTDogXCJsaXRcIixcbiAgICAgICAgUFJfUExBSU46IFwicGxuXCIsXG4gICAgICAgIFBSX1BVTkNUVUFUSU9OOiBcInB1blwiLFxuICAgICAgICBQUl9TT1VSQ0U6IFwic3JjXCIsXG4gICAgICAgIFBSX1NUUklORzogXCJzdHJcIixcbiAgICAgICAgUFJfVEFHOiBcInRhZ1wiLFxuICAgICAgICBQUl9UWVBFOiBcInR5cFwiXG4gICAgfTtcbn0pKCk7XG4iLCJpbXBvcnQgUGFyc29ucyBmcm9tIFwiLi9wYXJzb25zXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVkUGFyc29ucyBleHRlbmRzIFBhcnNvbnMge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIC8vIHRvZG8gLS0gbWFrZSB0aGlzIGNvbmZpZ3VyYWJsZVxuICAgICAgICBpZiAob3B0cy50aW1lZGZlZWRiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dmZWVkYmFjayA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNob3dmZWVkYmFjayA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ3JhZGVyLnNob3dmZWVkYmFjayA9IHRoaXMuc2hvd2ZlZWRiYWNrO1xuICAgICAgICB0aGlzLmhpZGVGZWVkYmFjaygpO1xuICAgICAgICAkKHRoaXMuY2hlY2tCdXR0b24pLmhpZGUoKTtcbiAgICAgICAgJCh0aGlzLmhlbHBCdXR0b24pLmhpZGUoKTtcbiAgICAgICAgJCh0aGlzLnJlc2V0QnV0dG9uKS5oaWRlKCk7XG4gICAgfVxuICAgIGNoZWNrQ29ycmVjdFRpbWVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb3JyZWN0ID8gXCJUXCIgOiBcIkZcIjtcbiAgICB9XG4gICAgaGlkZUZlZWRiYWNrKCkge1xuICAgICAgICAkKHRoaXMubWVzc2FnZURpdikuaGlkZSgpO1xuICAgIH1cbn1cblxuaWYgKHR5cGVvZiB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPSB7fTtcbn1cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeVtcInBhcnNvbnNcIl0gPSBmdW5jdGlvbiAob3B0cykge1xuICAgIGlmIChvcHRzLnRpbWVkKSB7XG4gICAgICAgIHJldHVybiBuZXcgVGltZWRQYXJzb25zKG9wdHMpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFBhcnNvbnMob3B0cyk7XG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9