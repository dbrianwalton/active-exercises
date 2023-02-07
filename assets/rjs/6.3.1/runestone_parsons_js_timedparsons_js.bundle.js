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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3BhcnNvbnNfanNfdGltZWRwYXJzb25zX2pzLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQTJDO0FBQzZCOztBQUV4RTtBQUNBLGtCQUFrQixnREFBTztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixpQkFBaUI7QUFDbkM7QUFDQTtBQUNBLGtCQUFrQiw2QkFBNkI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFZSx3QkFBd0IsbURBQWU7QUFDdEQ7QUFDQTs7QUFFQTtBQUNBLGlFQUFpRTs7QUFFakU7O0FBRUE7QUFDQSxrQ0FBa0MsZ0RBQU87QUFDekM7QUFDQTtBQUNBLDBCQUEwQixvREFBTztBQUNqQztBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQiwwQ0FBMEM7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBc0Isd0JBQXdCO0FBQzlDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBc0IsMEJBQTBCO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQixlQUFlO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTLG1FQUFzQjtBQUMvQiwrRUFBK0U7QUFDL0U7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixlQUFlO0FBQ25DO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUix3QkFBd0IseUJBQXlCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuSmE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPLHNCQUFzQixnQkFBZ0I7QUFDN0M7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDs7QUFFQSxzQkFBc0I7QUFDdEI7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBLHFCQUFxQjtBQUNyQiwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDJCQUEyQjtBQUMzQiwwQkFBMEI7O0FBRTFCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZUFBZTtBQUN2QztBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGVBQWU7QUFDdkM7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDM0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7Ozs7O0FDbkNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25DRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDYTs7QUFFZ0Q7QUFDL0I7QUFDRztBQUNWO0FBQ0s7QUFDQztBQUNjO0FBQ1A7QUFDSTtBQUNFOztBQUUxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFTyxrQkFBa0I7QUFDVixzQkFBc0IsbUVBQWE7QUFDbEQ7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQSwyQkFBMkI7QUFDM0I7O0FBRUEsMkJBQTJCLDBCQUEwQjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGtEQUFTO0FBQ3pCLGdCQUFnQixtREFBZTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsa0JBQWtCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix1QkFBdUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkLHVEQUF1RCxHQUFHO0FBQzFEO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4QztBQUNBO0FBQ0EsbURBQW1EO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHdCQUF3QjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHFCQUFxQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsd0JBQXdCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBLGNBQWM7QUFDZDtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLG1CQUFtQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtC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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsMEJBQTBCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnQ0FBZ0M7QUFDeEQ7QUFDQSw0QkFBNEIsd0JBQXdCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixVQUFVO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFz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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixjQUFjO0FBQ3RDLDRCQUE0QixpQkFBaUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsMENBQTBDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsR0FBRztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDLHlCQUF5QjtBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRCxVQUFVO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2h4QitCOztBQUVqQiwyQkFBMkIsZ0RBQU87QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGdEQUFPO0FBQ3RCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2Nzcy9wYXJzb25zLmNzcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvY3NzL3ByZXR0aWZ5LmNzcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvZGFnR3JhZGVyLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcGFyc29ucy9qcy9kYWdIZWxwZXJzLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcGFyc29ucy9qcy9oYW1tZXIubWluLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcGFyc29ucy9qcy9saW5lR3JhZGVyLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcGFyc29ucy9qcy9wYXJzb25zLWkxOG4uZW4uanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL3BhcnNvbnMtaTE4bi5wdC1ici5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvcGFyc29ucy5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvcGFyc29uc0Jsb2NrLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcGFyc29ucy9qcy9wYXJzb25zTGluZS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvcHJldHRpZnkuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL3RpbWVkcGFyc29ucy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJpbXBvcnQgTGluZUJhc2VkR3JhZGVyIGZyb20gXCIuL2xpbmVHcmFkZXJcIjtcbmltcG9ydCB7IERpR3JhcGgsIGhhc1BhdGgsIGlzRGlyZWN0ZWRBY3ljbGljR3JhcGggfSBmcm9tIFwiLi9kYWdIZWxwZXJzXCI7XG5cbmZ1bmN0aW9uIGdyYXBoVG9OWChhbnN3ZXJMaW5lcykge1xuICB2YXIgZ3JhcGggPSBuZXcgRGlHcmFwaCgpO1xuICBmb3IgKGxldCBsaW5lMSBvZiBhbnN3ZXJMaW5lcykge1xuICAgIGdyYXBoLmFkZE5vZGUobGluZTEudGFnKTtcbiAgICBmb3IgKGxldCBsaW5lMnRhZyBvZiBsaW5lMS5kZXBlbmRzKSB7XG4gICAgICAvLyB0aGUgZGVwZW5kcyBncmFwaCBsaXN0cyB0aGUgKmluY29taW5nKiBlZGdlcyBvZiBhIG5vZGVcbiAgICAgIGdyYXBoLmFkZEVkZ2UobGluZTJ0YWcsIGxpbmUxLnRhZyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBncmFwaDtcbn1cblxuZnVuY3Rpb24gaXNWZXJ0ZXhDb3ZlcihncmFwaCwgdmVydGV4Q292ZXIpIHtcbiAgZm9yIChsZXQgZWRnZSBvZiBncmFwaC5lZGdlcygpKSB7XG4gICAgaWYgKCEodmVydGV4Q292ZXIuaGFzKGVkZ2VbMF0pIHx8IHZlcnRleENvdmVyLmhhcyhlZGdlWzFdKSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIEZpbmQgYWxsIHN1YnNldHMgb2YgdGhlIHNldCB1c2luZyB0aGUgY29ycmVzcG9uZGVuY2Ugb2Ygc3Vic2V0cyBvZlxuLy8gYSBzZXQgdG8gYmluYXJ5IHN0cmluZyB3aG9zZSBsZW5ndGggYXJlIHRoZSBzaXplIG9mIHRoZSBzZXRcbmZ1bmN0aW9uIGFsbFN1YnNldHMoYXJyKSB7XG4gIGxldCBzdWJzZXRzID0ge307XG4gIGZvciAobGV0IGkgPSAwOyBpIDw9IGFyci5sZW5ndGg7IGkrKykge1xuICAgIHN1YnNldHNbaV0gPSBbXTtcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGgucG93KDIsIGFyci5sZW5ndGgpOyBpKyspIHtcbiAgICBsZXQgYmluID0gaS50b1N0cmluZygyKTtcbiAgICB3aGlsZSAoYmluLmxlbmd0aCA8IGFyci5sZW5ndGgpIHtcbiAgICAgIGJpbiA9IFwiMFwiICsgYmluO1xuICAgIH1cbiAgICBsZXQgc3Vic2V0ID0gbmV3IFNldCgpO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgYmluLmxlbmd0aDsgaisrKSB7XG4gICAgICBpZiAoYmluW2pdID09IFwiMVwiKSB7XG4gICAgICAgIHN1YnNldC5hZGQoYXJyW2pdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc3Vic2V0c1tzdWJzZXQuc2l6ZV0ucHVzaChzdWJzZXQpO1xuICB9XG4gIHJldHVybiBzdWJzZXRzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEQUdHcmFkZXIgZXh0ZW5kcyBMaW5lQmFzZWRHcmFkZXIge1xuICBpbnZlcnNlTElTSW5kaWNlcyhhcnIsIGluU29sdXRpb24pIHtcbiAgICAvLyBGb3IgbW9yZSBkZXRhaWxzIGFuZCBhIHByb29mIG9mIHRoZSBjb3JyZWN0bmVzcyBvZiB0aGUgYWxnb3JpdGhtLCBzZWUgdGhlIHBhcGVyOiBodHRwczovL2FyeGl2Lm9yZy9hYnMvMjIwNC4wNDE5NlxuXG4gICAgdmFyIHNvbHV0aW9uID0gdGhpcy5wcm9ibGVtLnNvbHV0aW9uO1xuICAgIHZhciBhbnN3ZXJMaW5lcyA9IGluU29sdXRpb24ubWFwKChibG9jaykgPT4gYmxvY2subGluZXNbMF0pOyAvLyBhc3N1bWUgTk9UIGFkYXB0aXZlIGZvciBEQUcgZ3JhZGluZyAoZm9yIG5vdylcblxuICAgIGxldCBncmFwaCA9IGdyYXBoVG9OWChzb2x1dGlvbik7XG5cbiAgICBsZXQgc2VlbiA9IG5ldyBTZXQoKTtcbiAgICBsZXQgcHJvYmxlbWF0aWNTdWJncmFwaCA9IG5ldyBEaUdyYXBoKCk7XG4gICAgZm9yIChsZXQgbGluZTEgb2YgYW5zd2VyTGluZXMpIHtcbiAgICAgIGZvciAobGV0IGxpbmUyIG9mIHNlZW4pIHtcbiAgICAgICAgbGV0IHByb2JsZW1hdGljID0gaGFzUGF0aChncmFwaCwge1xuICAgICAgICAgIHNvdXJjZTogbGluZTEudGFnLFxuICAgICAgICAgIHRhcmdldDogbGluZTIudGFnLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHByb2JsZW1hdGljKSB7XG4gICAgICAgICAgcHJvYmxlbWF0aWNTdWJncmFwaC5hZGRFZGdlKGxpbmUxLnRhZywgbGluZTIudGFnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzZWVuLmFkZChsaW5lMSk7XG4gICAgfVxuXG4gICAgbGV0IG12YyA9IG51bGw7XG4gICAgbGV0IHN1YnNldHMgPSBhbGxTdWJzZXRzKHByb2JsZW1hdGljU3ViZ3JhcGgubm9kZXMoKSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gcHJvYmxlbWF0aWNTdWJncmFwaC5udW1iZXJPZk5vZGVzKCk7IGkrKykge1xuICAgICAgZm9yIChsZXQgc3Vic2V0IG9mIHN1YnNldHNbaV0pIHtcbiAgICAgICAgaWYgKGlzVmVydGV4Q292ZXIocHJvYmxlbWF0aWNTdWJncmFwaCwgc3Vic2V0KSkge1xuICAgICAgICAgIG12YyA9IHN1YnNldDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG12YyAhPSBudWxsKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBpbmRpY2VzID0gWy4uLm12Y10ubWFwKCh0YWcpID0+IHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW5zd2VyTGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGFuc3dlckxpbmVzW2ldLnRhZyA9PT0gdGFnKSByZXR1cm4gaTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gaW5kaWNlcztcbiAgfVxuXG4gIGNoZWNrQ29ycmVjdEluZGVudGF0aW9uKHNvbHV0aW9uTGluZXMsIGFuc3dlckxpbmVzKSB7XG4gICAgICB0aGlzLmluZGVudExlZnQgPSBbXTtcbiAgICAgIHRoaXMuaW5kZW50UmlnaHQgPSBbXTtcblxuICAgICAgbGV0IGluZGVudGF0aW9uQnlUYWcgPSB7fTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc29sdXRpb25MaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBsaW5lID0gc29sdXRpb25MaW5lc1tpXTtcbiAgICAgICAgaW5kZW50YXRpb25CeVRhZ1tsaW5lLnRhZ10gPSBsaW5lLmluZGVudDtcbiAgICAgIH1cblxuICAgICAgbGV0IGxvb3BMaW1pdCA9IE1hdGgubWluKHNvbHV0aW9uTGluZXMubGVuZ3RoLCBhbnN3ZXJMaW5lcy5sZW5ndGgpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb29wTGltaXQ7IGkrKykge1xuICAgICAgICAgIGxldCBzb2x1dGlvbkluZGVudCA9IGluZGVudGF0aW9uQnlUYWdbYW5zd2VyTGluZXNbaV0udGFnXTtcbiAgICAgICAgICBpZiAoYW5zd2VyTGluZXNbaV0udmlld0luZGVudCgpIDwgc29sdXRpb25JbmRlbnQpIHtcbiAgICAgICAgICAgICAgdGhpcy5pbmRlbnRSaWdodC5wdXNoKGFuc3dlckxpbmVzW2ldKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFuc3dlckxpbmVzW2ldLnZpZXdJbmRlbnQoKSA+IHNvbHV0aW9uSW5kZW50KSB7XG4gICAgICAgICAgICAgIHRoaXMuaW5kZW50TGVmdC5wdXNoKGFuc3dlckxpbmVzW2ldKTtcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmluY29ycmVjdEluZGVudHMgPVxuICAgICAgICAgIHRoaXMuaW5kZW50TGVmdC5sZW5ndGggKyB0aGlzLmluZGVudFJpZ2h0Lmxlbmd0aDtcblxuICAgICAgcmV0dXJuIHRoaXMuaW5jb3JyZWN0SW5kZW50cyA9PSAwO1xuICB9XG5cbiAgY2hlY2tDb3JyZWN0T3JkZXJpbmcoc29sdXRpb25MaW5lcywgYW5zd2VyTGluZXMpIHtcbiAgICBpZiAoIWlzRGlyZWN0ZWRBY3ljbGljR3JhcGgoZ3JhcGhUb05YKHNvbHV0aW9uTGluZXMpKSkge1xuICAgICAgdGhyb3cgXCJEZXBlbmRlbmN5IGJldHdlZW4gYmxvY2tzIGRvZXMgbm90IGZvcm0gYSBEaXJlY3RlZCBBY3ljbGljIEdyYXBoOyBQcm9ibGVtIHVuc29sdmFibGUuXCI7XG4gICAgfVxuXG4gICAgbGV0IHNlZW4gPSBuZXcgU2V0KCk7XG4gICAgbGV0IGlzQ29ycmVjdE9yZGVyID0gdHJ1ZTtcbiAgICB0aGlzLmNvcnJlY3RMaW5lcyA9IDA7XG4gICAgdGhpcy5zb2x1dGlvbkxlbmd0aCA9IHNvbHV0aW9uTGluZXMubGVuZ3RoO1xuICAgIGxldCBsb29wTGltaXQgPSBNYXRoLm1pbihzb2x1dGlvbkxpbmVzLmxlbmd0aCwgYW5zd2VyTGluZXMubGVuZ3RoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxvb3BMaW1pdDsgaSsrKSB7XG4gICAgICBsZXQgbGluZSA9IGFuc3dlckxpbmVzW2ldO1xuICAgICAgaWYgKGxpbmUuZGlzdHJhY3Rvcikge1xuICAgICAgICBpc0NvcnJlY3RPcmRlciA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBsaW5lLmRlcGVuZHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBpZiAoIXNlZW4uaGFzKGxpbmUuZGVwZW5kc1tqXSkpIHtcbiAgICAgICAgICAgIGlzQ29ycmVjdE9yZGVyID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNDb3JyZWN0T3JkZXIpIHtcbiAgICAgICAgdGhpcy5jb3JyZWN0TGluZXMgKz0gMTtcbiAgICAgIH1cbiAgICAgIHNlZW4uYWRkKGxpbmUudGFnKTtcbiAgICB9XG4gICAgcmV0dXJuIGlzQ29ycmVjdE9yZGVyO1xuICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogVGhpcyBmaWxlIGFkYXB0ZWQgZnJvbSBKU05ldHdvcmtYOiBodHRwczovL2dpdGh1Yi5jb20vZmtsaW5nL0pTTmV0d29ya1hcbiAqIENvcHlyaWdodCAoQykgMjAxMiBGZWxpeCBLbGluZyA8ZmVsaXgua2xpbmdAZ214Lm5ldD5cbiAqIEpTTmV0d29ya1ggaXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGUgQlNEIGxpY2Vuc2VcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gaGFzUGF0aChHLCB7IHNvdXJjZSwgdGFyZ2V0IH0pIHtcbiAgdHJ5IHtcbiAgICBiaWRpcmVjdGlvbmFsU2hvcnRlc3RQYXRoKEcsIHNvdXJjZSwgdGFyZ2V0KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBKU05ldHdvcmtYTm9QYXRoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRocm93IGVycm9yO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBub2Rlc0FyZUVxdWFsKGEsIGIpIHtcbiAgcmV0dXJuIGEgPT09IGIgfHwgKHR5cGVvZiBhID09PSBcIm9iamVjdFwiICYmIGEudG9TdHJpbmcoKSA9PT0gYi50b1N0cmluZygpKTtcbn1cblxuZnVuY3Rpb24gYmlkaXJlY3Rpb25hbFNob3J0ZXN0UGF0aChHLCBzb3VyY2UsIHRhcmdldCkge1xuICAvLyBjYWxsIGhlbHBlciB0byBkbyB0aGUgcmVhbCB3b3JrXG4gIHZhciBbcHJlZCwgc3VjYywgd10gPSBiaWRpcmVjdGlvbmFsUHJlZFN1Y2MoRywgc291cmNlLCB0YXJnZXQpO1xuXG4gIC8vIGJ1aWxkIHBhdGggZnJvbSBwcmVkK3crc3VjY1xuICB2YXIgcGF0aCA9IFtdO1xuICAvLyBmcm9tIHNvdXJjZSB0byB3XG4gIHdoaWxlICh3ICE9IG51bGwpIHtcbiAgICBwYXRoLnB1c2godyk7XG4gICAgdyA9IHByZWQuZ2V0KHcpO1xuICB9XG4gIHcgPSBzdWNjLmdldChwYXRoWzBdKTtcbiAgcGF0aC5yZXZlcnNlKCk7XG4gIC8vIGZyb20gdyB0byB0YXJnZXRcbiAgd2hpbGUgKHcgIT0gbnVsbCkge1xuICAgIHBhdGgucHVzaCh3KTtcbiAgICB3ID0gc3VjYy5nZXQodyk7XG4gIH1cbiAgcmV0dXJuIHBhdGg7XG59XG5cbmZ1bmN0aW9uIGJpZGlyZWN0aW9uYWxQcmVkU3VjYyhHLCBzb3VyY2UsIHRhcmdldCkge1xuICAvLyBkb2VzIEJGUyBmcm9tIGJvdGggc291cmNlIGFuZCB0YXJnZXQgYW5kIG1lZXRzIGluIHRoZSBtaWRkbGVcbiAgaWYgKG5vZGVzQXJlRXF1YWwoc291cmNlLCB0YXJnZXQpKSB7XG4gICAgcmV0dXJuIFtuZXcgTWFwKFtbc291cmNlLCBudWxsXV0pLCBuZXcgTWFwKFtbdGFyZ2V0LCBudWxsXV0pLCBzb3VyY2VdO1xuICB9XG5cbiAgLy8gaGFuZGxlIGVpdGhlciBkaXJlY3RlZCBvciB1bmRpcmVjdGVkXG4gIHZhciBncHJlZCwgZ3N1Y2M7XG4gIGdwcmVkID0gRy5wcmVkZWNlc3NvcnNJdGVyLmJpbmQoRyk7XG4gIGdzdWNjID0gRy5zdWNjZXNzb3JzSXRlci5iaW5kKEcpO1xuXG4gIC8vIHByZWRlY2Vzc3NvciBhbmQgc3VjY2Vzc29ycyBpbiBzZWFyY2hcbiAgdmFyIHByZWQgPSBuZXcgTWFwKFtbc291cmNlLCBudWxsXV0pO1xuICB2YXIgc3VjYyA9IG5ldyBNYXAoW1t0YXJnZXQsIG51bGxdXSk7XG4gIC8vXG4gIC8vIGluaXRpYWxpemUgZnJpbmdlcywgc3RhcnQgd2l0aCBmb3J3YXJkXG4gIHZhciBmb3J3YXJkRnJpbmdlID0gW3NvdXJjZV07XG4gIHZhciByZXZlcnNlRnJpbmdlID0gW3RhcmdldF07XG4gIHZhciB0aGlzTGV2ZWw7XG5cbiAgLypqc2hpbnQgbmV3Y2FwOmZhbHNlKi9cbiAgd2hpbGUgKGZvcndhcmRGcmluZ2UubGVuZ3RoID4gMCAmJiByZXZlcnNlRnJpbmdlLmxlbmd0aCA+IDApIHtcbiAgICBpZiAoZm9yd2FyZEZyaW5nZS5sZW5ndGggPD0gcmV2ZXJzZUZyaW5nZS5sZW5ndGgpIHtcbiAgICAgIHRoaXNMZXZlbCA9IGZvcndhcmRGcmluZ2U7XG4gICAgICBmb3J3YXJkRnJpbmdlID0gW107XG4gICAgICBmb3IgKGxldCB2IG9mIHRoaXNMZXZlbCkge1xuICAgICAgICBmb3IgKGxldCB3IG9mIGdzdWNjKHYpKSB7XG4gICAgICAgICAgaWYgKCFwcmVkLmhhcyh3KSkge1xuICAgICAgICAgICAgZm9yd2FyZEZyaW5nZS5wdXNoKHcpO1xuICAgICAgICAgICAgcHJlZC5zZXQodywgdik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzdWNjLmhhcyh3KSkge1xuICAgICAgICAgICAgcmV0dXJuIFtwcmVkLCBzdWNjLCB3XTsgLy8gZm91bmQgcGF0aFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzTGV2ZWwgPSByZXZlcnNlRnJpbmdlO1xuICAgICAgcmV2ZXJzZUZyaW5nZSA9IFtdO1xuICAgICAgZm9yIChsZXQgdiBvZiB0aGlzTGV2ZWwpIHtcbiAgICAgICAgZm9yIChsZXQgdyBvZiBncHJlZCh2KSkge1xuICAgICAgICAgIGlmICghc3VjYy5oYXModykpIHtcbiAgICAgICAgICAgIHJldmVyc2VGcmluZ2UucHVzaCh3KTtcbiAgICAgICAgICAgIHN1Y2Muc2V0KHcsIHYpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocHJlZC5oYXModykpIHtcbiAgICAgICAgICAgIHJldHVybiBbcHJlZCwgc3VjYywgd107IC8vIGZvdW5kIHBhdGhcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdGhyb3cgbmV3IEpTTmV0d29ya1hOb1BhdGgoXG4gICAgXCJObyBwYXRoIGJldHdlZW4gXCIgKyBzb3VyY2UudG9TdHJpbmcoKSArIFwiIGFuZCBcIiArIHRhcmdldC50b1N0cmluZygpICsgXCIuXCJcbiAgKTtcbn1cblxuZnVuY3Rpb24gdG9wb2xvZ2ljYWxTb3J0KEcsIG9wdE5idW5jaCkge1xuICAvLyBub25yZWN1cnNpdmUgdmVyc2lvblxuICB2YXIgc2VlbiA9IG5ldyBTZXQoKTtcbiAgdmFyIG9yZGVyRXhwbG9yZWQgPSBbXTsgLy8gcHJvdmlkZSBvcmRlciBhbmRcbiAgLy8gZmFzdCBzZWFyY2ggd2l0aG91dCBtb3JlIGdlbmVyYWwgcHJpb3JpdHlEaWN0aW9uYXJ5XG4gIHZhciBleHBsb3JlZCA9IG5ldyBTZXQoKTtcblxuICBpZiAob3B0TmJ1bmNoID09IG51bGwpIHtcbiAgICBvcHROYnVuY2ggPSBHLm5vZGVzSXRlcigpO1xuICB9XG5cbiAgZm9yIChsZXQgdiBvZiBvcHROYnVuY2gpIHtcbiAgICAvLyBwcm9jZXNzIGFsbCB2ZXJ0aWNlcyBpbiBHXG4gICAgaWYgKGV4cGxvcmVkLmhhcyh2KSkge1xuICAgICAgcmV0dXJuOyAvLyBjb250aW51ZVxuICAgIH1cblxuICAgIHZhciBmcmluZ2UgPSBbdl07IC8vIG5vZGVzIHlldCB0byBsb29rIGF0XG4gICAgd2hpbGUgKGZyaW5nZS5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgdyA9IGZyaW5nZVtmcmluZ2UubGVuZ3RoIC0gMV07IC8vIGRlcHRoIGZpcnN0IHNlYXJjaFxuICAgICAgaWYgKGV4cGxvcmVkLmhhcyh3KSkge1xuICAgICAgICAvLyBhbHJlYWR5IGxvb2tlZCBkb3duIHRoaXMgYnJhbmNoXG4gICAgICAgIGZyaW5nZS5wb3AoKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBzZWVuLmFkZCh3KTsgLy8gbWFyayBhcyBzZWVuXG4gICAgICAvLyBDaGVjayBzdWNjZXNzb3JzIGZvciBjeWNsZXMgZm9yIG5ldyBub2Rlc1xuICAgICAgdmFyIG5ld05vZGVzID0gW107XG4gICAgICAvKmVzbGludC1kaXNhYmxlIG5vLWxvb3AtZnVuYyovXG4gICAgICBHLmdldCh3KS5mb3JFYWNoKGZ1bmN0aW9uIChfLCBuKSB7XG4gICAgICAgIGlmICghZXhwbG9yZWQuaGFzKG4pKSB7XG4gICAgICAgICAgaWYgKHNlZW4uaGFzKG4pKSB7XG4gICAgICAgICAgICAvLyBDWUNMRSAhIVxuICAgICAgICAgICAgdGhyb3cgbmV3IEpTTmV0d29ya1hVbmZlYXNpYmxlKFwiR3JhcGggY29udGFpbnMgYSBjeWNsZS5cIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5ld05vZGVzLnB1c2gobik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgLyplc2xpbnQtZW5hYmxlIG5vLWxvb3AtZnVuYyovXG4gICAgICBpZiAobmV3Tm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyBhZGQgbmV3IG5vZGVzIHRvIGZyaW5nZVxuICAgICAgICBmcmluZ2UucHVzaC5hcHBseShmcmluZ2UsIG5ld05vZGVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGV4cGxvcmVkLmFkZCh3KTtcbiAgICAgICAgb3JkZXJFeHBsb3JlZC51bnNoaWZ0KHcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvcmRlckV4cGxvcmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEaXJlY3RlZEFjeWNsaWNHcmFwaChHKSB7XG4gIHRyeSB7XG4gICAgdG9wb2xvZ2ljYWxTb3J0KEcpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChleCkge1xuICAgIGlmIChleCBpbnN0YW5jZW9mIEpTTmV0d29ya1hVbmZlYXNpYmxlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRocm93IGV4O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEaUdyYXBoIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5ncmFwaCA9IHt9OyAvLyBkaWN0aW9uYXJ5IGZvciBncmFwaCBhdHRyaWJ1dGVzXG4gICAgdGhpcy5ub2RlID0gbmV3IE1hcCgpOyAvLyBkaWN0aW9uYXJ5IGZvciBub2RlIGF0dHJpYnV0ZXNcbiAgICAvLyBXZSBzdG9yZSB0d28gYWRqYWNlbmN5IGxpc3RzOlxuICAgIC8vIHRoZSBwcmVkZWNlc3NvcnMgb2Ygbm9kZSBuIGFyZSBzdG9yZWQgaW4gdGhlIGRpY3Qgc2VsZi5wcmVkXG4gICAgLy8gdGhlIHN1Y2Nlc3NvcnMgb2Ygbm9kZSBuIGFyZSBzdG9yZWQgaW4gdGhlIGRpY3Qgc2VsZi5zdWNjPXNlbGYuYWRqXG4gICAgdGhpcy5hZGogPSBuZXcgTWFwKCk7IC8vIGVtcHR5IGFkamFjZW5jeSBkaWN0aW9uYXJ5XG4gICAgdGhpcy5wcmVkID0gbmV3IE1hcCgpOyAvLyBwcmVkZWNlc3NvclxuICAgIHRoaXMuc3VjYyA9IHRoaXMuYWRqOyAvLyBzdWNjZXNzb3JcblxuICAgIHRoaXMuZWRnZSA9IHRoaXMuYWRqO1xuICB9XG5cbiAgYWRkTm9kZShuKSB7XG4gICAgaWYgKCF0aGlzLnN1Y2MuaGFzKG4pKSB7XG4gICAgICB0aGlzLnN1Y2Muc2V0KG4sIG5ldyBNYXAoKSk7XG4gICAgICB0aGlzLnByZWQuc2V0KG4sIG5ldyBNYXAoKSk7XG4gICAgICB0aGlzLm5vZGUuc2V0KG4pO1xuICAgIH1cbiAgfVxuXG4gIGFkZEVkZ2UodSwgdikge1xuICAgIC8vIGFkZCBub2Rlc1xuICAgIGlmICghdGhpcy5zdWNjLmhhcyh1KSkge1xuICAgICAgdGhpcy5zdWNjLnNldCh1LCBuZXcgTWFwKCkpO1xuICAgICAgdGhpcy5wcmVkLnNldCh1LCBuZXcgTWFwKCkpO1xuICAgICAgdGhpcy5ub2RlLnNldCh1LCB7fSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN1Y2MuaGFzKHYpKSB7XG4gICAgICB0aGlzLnN1Y2Muc2V0KHYsIG5ldyBNYXAoKSk7XG4gICAgICB0aGlzLnByZWQuc2V0KHYsIG5ldyBNYXAoKSk7XG4gICAgICB0aGlzLm5vZGUuc2V0KHYsIHt9KTtcbiAgICB9XG5cbiAgICAvLyBhZGQgdGhlIGVkZ2VcbiAgICB2YXIgZGF0YWRpY3QgPSB0aGlzLmFkai5nZXQodSkuZ2V0KHYpIHx8IHt9O1xuICAgIHRoaXMuc3VjYy5nZXQodSkuc2V0KHYsIGRhdGFkaWN0KTtcbiAgICB0aGlzLnByZWQuZ2V0KHYpLnNldCh1LCBkYXRhZGljdCk7XG4gIH1cblxuICBub2RlcyhvcHREYXRhID0gZmFsc2UpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShvcHREYXRhID8gdGhpcy5ub2RlLmVudHJpZXMoKSA6IHRoaXMubm9kZS5rZXlzKCkpO1xuICB9XG5cbiAgZWRnZXMob3B0TmJ1bmNoLCBvcHREYXRhID0gZmFsc2UpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmVkZ2VzSXRlcihvcHROYnVuY2gsIG9wdERhdGEpKTtcbiAgfVxuXG4gIG5vZGVzSXRlcihvcHREYXRhID0gZmFsc2UpIHtcbiAgICBpZiAob3B0RGF0YSkge1xuICAgICAgcmV0dXJuIHRvSXRlcmF0b3IodGhpcy5ub2RlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMubm9kZS5rZXlzKCk7XG4gIH1cblxuICBnZXQobikge1xuICAgIHZhciB2YWx1ZSA9IHRoaXMuYWRqLmdldChuKTtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgS2V5RXJyb3IoXCJHcmFwaCBkb2VzIG5vdCBjb250YWluIG5vZGUgXCIgKyBuICsgXCIuXCIpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBudW1iZXJPZk5vZGVzKCkge1xuICAgIHJldHVybiB0aGlzLm5vZGUuc2l6ZTtcbiAgfVxuXG4gICpuYnVuY2hJdGVyKG9wdE5idW5jaCkge1xuICAgIGlmIChvcHROYnVuY2ggPT0gbnVsbCkge1xuICAgICAgLy8gaW5jbHVkZSBhbGwgbm9kZXNcbiAgICAgIC8qanNoaW50IGV4cHI6dHJ1ZSovXG4gICAgICB5aWVsZCogdGhpcy5hZGoua2V5cygpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5oYXNOb2RlKG9wdE5idW5jaCkpIHtcbiAgICAgIC8vIGlmIG5idW5jaCBpcyBhIHNpbmdsZSBub2RlXG4gICAgICB5aWVsZCBvcHROYnVuY2g7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGlmIG5idW5jaCBpcyBhIHNlcXVlbmNlIG9mIG5vZGVzXG4gICAgICB2YXIgYWRqID0gdGhpcy5hZGo7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIG4gb2YgdG9JdGVyYXRvcihvcHROYnVuY2gpKSB7XG4gICAgICAgICAgaWYgKGFkai5oYXMobikpIHtcbiAgICAgICAgICAgIHlpZWxkIG47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICBpZiAoZXggaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgSlNOZXR3b3JrWEVycm9yKFxuICAgICAgICAgICAgXCJuYnVuY2ggaXMgbm90IGEgbm9kZSBvciBhIHNlcXVlbmNlIG9mIG5vZGVzXCJcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgKmVkZ2VzSXRlcihvcHROYnVuY2gsIG9wdERhdGEgPSBmYWxzZSkge1xuICAgIC8vIGhhbmRsZSBjYWxscyB3aXRoIG9wdF9kYXRhIGJlaW5nIHRoZSBvbmx5IGFyZ3VtZW50XG4gICAgaWYgKGlzQm9vbGVhbihvcHROYnVuY2gpKSB7XG4gICAgICBvcHREYXRhID0gb3B0TmJ1bmNoO1xuICAgICAgb3B0TmJ1bmNoID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHZhciBub2Rlc05icnM7XG5cbiAgICBpZiAob3B0TmJ1bmNoID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5vZGVzTmJycyA9IHRoaXMuYWRqO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2Rlc05icnMgPSBtYXBJdGVyYXRvcih0aGlzLm5idW5jaEl0ZXIob3B0TmJ1bmNoKSwgKG4pID0+XG4gICAgICAgIHR1cGxlMihuLCB0aGlzLmFkai5nZXQobikpXG4gICAgICApO1xuICAgIH1cblxuICAgIGZvciAodmFyIG5vZGVOYnJzIG9mIG5vZGVzTmJycykge1xuICAgICAgZm9yICh2YXIgbmJyRGF0YSBvZiBub2RlTmJyc1sxXSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW25vZGVOYnJzWzBdLCBuYnJEYXRhWzBdXTtcbiAgICAgICAgaWYgKG9wdERhdGEpIHtcbiAgICAgICAgICByZXN1bHRbMl0gPSBuYnJEYXRhWzFdO1xuICAgICAgICB9XG4gICAgICAgIHlpZWxkIHJlc3VsdDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXZlcnNlKG9wdENvcHkgPSB0cnVlKSB7XG4gICAgdmFyIEg7XG4gICAgaWYgKG9wdENvcHkpIHtcbiAgICAgIEggPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihudWxsLCB7XG4gICAgICAgIG5hbWU6IFwiUmV2ZXJzZSBvZiAoXCIgKyB0aGlzLm5hbWUgKyBcIilcIixcbiAgICAgIH0pO1xuICAgICAgSC5hZGROb2Rlc0Zyb20odGhpcyk7XG4gICAgICBILmFkZEVkZ2VzRnJvbShcbiAgICAgICAgbWFwSXRlcmF0b3IodGhpcy5lZGdlc0l0ZXIobnVsbCwgdHJ1ZSksIChlZGdlKSA9PlxuICAgICAgICAgIHR1cGxlM2MoZWRnZVsxXSwgZWRnZVswXSwgZGVlcGNvcHkoZWRnZVsyXSksIGVkZ2UpXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICBILmdyYXBoID0gZGVlcGNvcHkodGhpcy5ncmFwaCk7XG4gICAgICBILm5vZGUgPSBkZWVwY29weSh0aGlzLm5vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdGhpc1ByZWQgPSB0aGlzLnByZWQ7XG4gICAgICB2YXIgdGhpc1N1Y2MgPSB0aGlzLnN1Y2M7XG5cbiAgICAgIHRoaXMuc3VjYyA9IHRoaXNQcmVkO1xuICAgICAgdGhpcy5wcmVkID0gdGhpc1N1Y2M7XG4gICAgICB0aGlzLmFkaiA9IHRoaXMuc3VjYztcbiAgICAgIEggPSB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gSDtcbiAgfVxuXG4gIHN1Y2Nlc3NvcnNJdGVyKG4pIHtcbiAgICB2YXIgbmJycyA9IHRoaXMuc3VjYy5nZXQobik7XG4gICAgaWYgKG5icnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG5icnMua2V5cygpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgSlNOZXR3b3JrWEVycm9yKFxuICAgICAgc3ByaW50ZignVGhlIG5vZGUgXCIlalwiIGlzIG5vdCBpbiB0aGUgZGlncmFwaC4nLCBuKVxuICAgICk7XG4gIH1cblxuICBwcmVkZWNlc3NvcnNJdGVyKG4pIHtcbiAgICB2YXIgbmJycyA9IHRoaXMucHJlZC5nZXQobik7XG4gICAgaWYgKG5icnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG5icnMua2V5cygpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgSlNOZXR3b3JrWEVycm9yKFxuICAgICAgc3ByaW50ZignVGhlIG5vZGUgXCIlalwiIGlzIG5vdCBpbiB0aGUgZGlncmFwaC4nLCBuKVxuICAgICk7XG4gIH1cblxuICBzdWNjZXNzb3JzKG4pIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLnN1Y2Nlc3NvcnNJdGVyKG4pKTtcbiAgfVxuXG4gIHByZWRlY2Vzc29ycyhuKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5wcmVkZWNlc3NvcnNJdGVyKG4pKTtcbiAgfVxufVxuXG5jbGFzcyBKU05ldHdvcmtYRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgIHRoaXMubmFtZSA9IFwiSlNOZXR3b3JrWEV4Y2VwdGlvblwiO1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gIH1cbn1cblxuY2xhc3MgSlNOZXR3b3JrWEFsZ29yaXRobUVycm9yIGV4dGVuZHMgSlNOZXR3b3JrWEV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB0aGlzLm5hbWUgPSBcIkpTTmV0d29ya1hBbGdvcml0aG1FcnJvclwiO1xuICB9XG59XG5cbmNsYXNzIEpTTmV0d29ya1hFcnJvciBleHRlbmRzIEpTTmV0d29ya1hFeGNlcHRpb24ge1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5uYW1lID0gXCJKU05ldHdvcmtYRXJyb3JcIjtcbiAgfVxufVxuXG5jbGFzcyBKU05ldHdvcmtYVW5mZWFzaWJsZSBleHRlbmRzIEpTTmV0d29ya1hBbGdvcml0aG1FcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB0aGlzLm5hbWUgPSBcIkpTTmV0d29ya1hVbmZlYXNpYmxlXCI7XG4gIH1cbn1cblxuY2xhc3MgSlNOZXR3b3JrWE5vUGF0aCBleHRlbmRzIEpTTmV0d29ya1hVbmZlYXNpYmxlIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIHRoaXMubmFtZSA9IFwiSlNOZXR3b3JrWE5vUGF0aFwiO1xuICB9XG59XG5cbi8vIGZ1bmN0aW9uIGZyb20gTG9EYXNoLCBuZWVkZWQgYnkgZnVuY3Rpb25zIGZyb20gSlNOZXR3b3JrWFxuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSBcIm9iamVjdFwiO1xufVxuXG4vLyBmdW5jdGlvbiBmcm9tIExvRGFzaCwgbmVlZGVkIGJ5IGZ1bmN0aW9ucyBmcm9tIEpTTmV0d29ya1hcbmZ1bmN0aW9uIGlzQm9vbGVhbih2YWx1ZSkge1xuICB2YXIgYm9vbFRhZyA9IFwiW29iamVjdCBCb29sZWFuXVwiO1xuICByZXR1cm4gKFxuICAgIHZhbHVlID09PSB0cnVlIHx8XG4gICAgdmFsdWUgPT09IGZhbHNlIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PSBib29sVGFnKVxuICApO1xufVxuIiwiLyohIEhhbW1lci5KUyAtIHYyLjAuOCAtIDIwMTYtMDQtMjNcbiAqIGh0dHA6Ly9oYW1tZXJqcy5naXRodWIuaW8vXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE2IEpvcmlrIFRhbmdlbGRlcjtcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAqL1xuIWZ1bmN0aW9uKGEsYixjLGQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGUoYSxiLGMpe3JldHVybiBzZXRUaW1lb3V0KGooYSxjKSxiKX1mdW5jdGlvbiBmKGEsYixjKXtyZXR1cm4gQXJyYXkuaXNBcnJheShhKT8oZyhhLGNbYl0sYyksITApOiExfWZ1bmN0aW9uIGcoYSxiLGMpe3ZhciBlO2lmKGEpaWYoYS5mb3JFYWNoKWEuZm9yRWFjaChiLGMpO2Vsc2UgaWYoYS5sZW5ndGghPT1kKWZvcihlPTA7ZTxhLmxlbmd0aDspYi5jYWxsKGMsYVtlXSxlLGEpLGUrKztlbHNlIGZvcihlIGluIGEpYS5oYXNPd25Qcm9wZXJ0eShlKSYmYi5jYWxsKGMsYVtlXSxlLGEpfWZ1bmN0aW9uIGgoYixjLGQpe3ZhciBlPVwiREVQUkVDQVRFRCBNRVRIT0Q6IFwiK2MrXCJcXG5cIitkK1wiIEFUIFxcblwiO3JldHVybiBmdW5jdGlvbigpe3ZhciBjPW5ldyBFcnJvcihcImdldC1zdGFjay10cmFjZVwiKSxkPWMmJmMuc3RhY2s/Yy5zdGFjay5yZXBsYWNlKC9eW15cXChdKz9bXFxuJF0vZ20sXCJcIikucmVwbGFjZSgvXlxccythdFxccysvZ20sXCJcIikucmVwbGFjZSgvXk9iamVjdC48YW5vbnltb3VzPlxccypcXCgvZ20sXCJ7YW5vbnltb3VzfSgpQFwiKTpcIlVua25vd24gU3RhY2sgVHJhY2VcIixmPWEuY29uc29sZSYmKGEuY29uc29sZS53YXJufHxhLmNvbnNvbGUubG9nKTtyZXR1cm4gZiYmZi5jYWxsKGEuY29uc29sZSxlLGQpLGIuYXBwbHkodGhpcyxhcmd1bWVudHMpfX1mdW5jdGlvbiBpKGEsYixjKXt2YXIgZCxlPWIucHJvdG90eXBlO2Q9YS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlKSxkLmNvbnN0cnVjdG9yPWEsZC5fc3VwZXI9ZSxjJiZsYShkLGMpfWZ1bmN0aW9uIGooYSxiKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gYS5hcHBseShiLGFyZ3VtZW50cyl9fWZ1bmN0aW9uIGsoYSxiKXtyZXR1cm4gdHlwZW9mIGE9PW9hP2EuYXBwbHkoYj9iWzBdfHxkOmQsYik6YX1mdW5jdGlvbiBsKGEsYil7cmV0dXJuIGE9PT1kP2I6YX1mdW5jdGlvbiBtKGEsYixjKXtnKHEoYiksZnVuY3Rpb24oYil7YS5hZGRFdmVudExpc3RlbmVyKGIsYywhMSl9KX1mdW5jdGlvbiBuKGEsYixjKXtnKHEoYiksZnVuY3Rpb24oYil7YS5yZW1vdmVFdmVudExpc3RlbmVyKGIsYywhMSl9KX1mdW5jdGlvbiBvKGEsYil7Zm9yKDthOyl7aWYoYT09YilyZXR1cm4hMDthPWEucGFyZW50Tm9kZX1yZXR1cm4hMX1mdW5jdGlvbiBwKGEsYil7cmV0dXJuIGEuaW5kZXhPZihiKT4tMX1mdW5jdGlvbiBxKGEpe3JldHVybiBhLnRyaW0oKS5zcGxpdCgvXFxzKy9nKX1mdW5jdGlvbiByKGEsYixjKXtpZihhLmluZGV4T2YmJiFjKXJldHVybiBhLmluZGV4T2YoYik7Zm9yKHZhciBkPTA7ZDxhLmxlbmd0aDspe2lmKGMmJmFbZF1bY109PWJ8fCFjJiZhW2RdPT09YilyZXR1cm4gZDtkKyt9cmV0dXJuLTF9ZnVuY3Rpb24gcyhhKXtyZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYSwwKX1mdW5jdGlvbiB0KGEsYixjKXtmb3IodmFyIGQ9W10sZT1bXSxmPTA7ZjxhLmxlbmd0aDspe3ZhciBnPWI/YVtmXVtiXTphW2ZdO3IoZSxnKTwwJiZkLnB1c2goYVtmXSksZVtmXT1nLGYrK31yZXR1cm4gYyYmKGQ9Yj9kLnNvcnQoZnVuY3Rpb24oYSxjKXtyZXR1cm4gYVtiXT5jW2JdfSk6ZC5zb3J0KCkpLGR9ZnVuY3Rpb24gdShhLGIpe2Zvcih2YXIgYyxlLGY9YlswXS50b1VwcGVyQ2FzZSgpK2Iuc2xpY2UoMSksZz0wO2c8bWEubGVuZ3RoOyl7aWYoYz1tYVtnXSxlPWM/YytmOmIsZSBpbiBhKXJldHVybiBlO2crK31yZXR1cm4gZH1mdW5jdGlvbiB2KCl7cmV0dXJuIHVhKyt9ZnVuY3Rpb24gdyhiKXt2YXIgYz1iLm93bmVyRG9jdW1lbnR8fGI7cmV0dXJuIGMuZGVmYXVsdFZpZXd8fGMucGFyZW50V2luZG93fHxhfWZ1bmN0aW9uIHgoYSxiKXt2YXIgYz10aGlzO3RoaXMubWFuYWdlcj1hLHRoaXMuY2FsbGJhY2s9Yix0aGlzLmVsZW1lbnQ9YS5lbGVtZW50LHRoaXMudGFyZ2V0PWEub3B0aW9ucy5pbnB1dFRhcmdldCx0aGlzLmRvbUhhbmRsZXI9ZnVuY3Rpb24oYil7ayhhLm9wdGlvbnMuZW5hYmxlLFthXSkmJmMuaGFuZGxlcihiKX0sdGhpcy5pbml0KCl9ZnVuY3Rpb24geShhKXt2YXIgYixjPWEub3B0aW9ucy5pbnB1dENsYXNzO3JldHVybiBuZXcoYj1jP2M6eGE/TTp5YT9QOndhP1I6TCkoYSx6KX1mdW5jdGlvbiB6KGEsYixjKXt2YXIgZD1jLnBvaW50ZXJzLmxlbmd0aCxlPWMuY2hhbmdlZFBvaW50ZXJzLmxlbmd0aCxmPWImRWEmJmQtZT09PTAsZz1iJihHYXxIYSkmJmQtZT09PTA7Yy5pc0ZpcnN0PSEhZixjLmlzRmluYWw9ISFnLGYmJihhLnNlc3Npb249e30pLGMuZXZlbnRUeXBlPWIsQShhLGMpLGEuZW1pdChcImhhbW1lci5pbnB1dFwiLGMpLGEucmVjb2duaXplKGMpLGEuc2Vzc2lvbi5wcmV2SW5wdXQ9Y31mdW5jdGlvbiBBKGEsYil7dmFyIGM9YS5zZXNzaW9uLGQ9Yi5wb2ludGVycyxlPWQubGVuZ3RoO2MuZmlyc3RJbnB1dHx8KGMuZmlyc3RJbnB1dD1EKGIpKSxlPjEmJiFjLmZpcnN0TXVsdGlwbGU/Yy5maXJzdE11bHRpcGxlPUQoYik6MT09PWUmJihjLmZpcnN0TXVsdGlwbGU9ITEpO3ZhciBmPWMuZmlyc3RJbnB1dCxnPWMuZmlyc3RNdWx0aXBsZSxoPWc/Zy5jZW50ZXI6Zi5jZW50ZXIsaT1iLmNlbnRlcj1FKGQpO2IudGltZVN0YW1wPXJhKCksYi5kZWx0YVRpbWU9Yi50aW1lU3RhbXAtZi50aW1lU3RhbXAsYi5hbmdsZT1JKGgsaSksYi5kaXN0YW5jZT1IKGgsaSksQihjLGIpLGIub2Zmc2V0RGlyZWN0aW9uPUcoYi5kZWx0YVgsYi5kZWx0YVkpO3ZhciBqPUYoYi5kZWx0YVRpbWUsYi5kZWx0YVgsYi5kZWx0YVkpO2Iub3ZlcmFsbFZlbG9jaXR5WD1qLngsYi5vdmVyYWxsVmVsb2NpdHlZPWoueSxiLm92ZXJhbGxWZWxvY2l0eT1xYShqLngpPnFhKGoueSk/ai54OmoueSxiLnNjYWxlPWc/SyhnLnBvaW50ZXJzLGQpOjEsYi5yb3RhdGlvbj1nP0ooZy5wb2ludGVycyxkKTowLGIubWF4UG9pbnRlcnM9Yy5wcmV2SW5wdXQ/Yi5wb2ludGVycy5sZW5ndGg+Yy5wcmV2SW5wdXQubWF4UG9pbnRlcnM/Yi5wb2ludGVycy5sZW5ndGg6Yy5wcmV2SW5wdXQubWF4UG9pbnRlcnM6Yi5wb2ludGVycy5sZW5ndGgsQyhjLGIpO3ZhciBrPWEuZWxlbWVudDtvKGIuc3JjRXZlbnQudGFyZ2V0LGspJiYoaz1iLnNyY0V2ZW50LnRhcmdldCksYi50YXJnZXQ9a31mdW5jdGlvbiBCKGEsYil7dmFyIGM9Yi5jZW50ZXIsZD1hLm9mZnNldERlbHRhfHx7fSxlPWEucHJldkRlbHRhfHx7fSxmPWEucHJldklucHV0fHx7fTtiLmV2ZW50VHlwZSE9PUVhJiZmLmV2ZW50VHlwZSE9PUdhfHwoZT1hLnByZXZEZWx0YT17eDpmLmRlbHRhWHx8MCx5OmYuZGVsdGFZfHwwfSxkPWEub2Zmc2V0RGVsdGE9e3g6Yy54LHk6Yy55fSksYi5kZWx0YVg9ZS54KyhjLngtZC54KSxiLmRlbHRhWT1lLnkrKGMueS1kLnkpfWZ1bmN0aW9uIEMoYSxiKXt2YXIgYyxlLGYsZyxoPWEubGFzdEludGVydmFsfHxiLGk9Yi50aW1lU3RhbXAtaC50aW1lU3RhbXA7aWYoYi5ldmVudFR5cGUhPUhhJiYoaT5EYXx8aC52ZWxvY2l0eT09PWQpKXt2YXIgaj1iLmRlbHRhWC1oLmRlbHRhWCxrPWIuZGVsdGFZLWguZGVsdGFZLGw9RihpLGosayk7ZT1sLngsZj1sLnksYz1xYShsLngpPnFhKGwueSk/bC54OmwueSxnPUcoaixrKSxhLmxhc3RJbnRlcnZhbD1ifWVsc2UgYz1oLnZlbG9jaXR5LGU9aC52ZWxvY2l0eVgsZj1oLnZlbG9jaXR5WSxnPWguZGlyZWN0aW9uO2IudmVsb2NpdHk9YyxiLnZlbG9jaXR5WD1lLGIudmVsb2NpdHlZPWYsYi5kaXJlY3Rpb249Z31mdW5jdGlvbiBEKGEpe2Zvcih2YXIgYj1bXSxjPTA7YzxhLnBvaW50ZXJzLmxlbmd0aDspYltjXT17Y2xpZW50WDpwYShhLnBvaW50ZXJzW2NdLmNsaWVudFgpLGNsaWVudFk6cGEoYS5wb2ludGVyc1tjXS5jbGllbnRZKX0sYysrO3JldHVybnt0aW1lU3RhbXA6cmEoKSxwb2ludGVyczpiLGNlbnRlcjpFKGIpLGRlbHRhWDphLmRlbHRhWCxkZWx0YVk6YS5kZWx0YVl9fWZ1bmN0aW9uIEUoYSl7dmFyIGI9YS5sZW5ndGg7aWYoMT09PWIpcmV0dXJue3g6cGEoYVswXS5jbGllbnRYKSx5OnBhKGFbMF0uY2xpZW50WSl9O2Zvcih2YXIgYz0wLGQ9MCxlPTA7Yj5lOyljKz1hW2VdLmNsaWVudFgsZCs9YVtlXS5jbGllbnRZLGUrKztyZXR1cm57eDpwYShjL2IpLHk6cGEoZC9iKX19ZnVuY3Rpb24gRihhLGIsYyl7cmV0dXJue3g6Yi9hfHwwLHk6Yy9hfHwwfX1mdW5jdGlvbiBHKGEsYil7cmV0dXJuIGE9PT1iP0lhOnFhKGEpPj1xYShiKT8wPmE/SmE6S2E6MD5iP0xhOk1hfWZ1bmN0aW9uIEgoYSxiLGMpe2N8fChjPVFhKTt2YXIgZD1iW2NbMF1dLWFbY1swXV0sZT1iW2NbMV1dLWFbY1sxXV07cmV0dXJuIE1hdGguc3FydChkKmQrZSplKX1mdW5jdGlvbiBJKGEsYixjKXtjfHwoYz1RYSk7dmFyIGQ9YltjWzBdXS1hW2NbMF1dLGU9YltjWzFdXS1hW2NbMV1dO3JldHVybiAxODAqTWF0aC5hdGFuMihlLGQpL01hdGguUEl9ZnVuY3Rpb24gSihhLGIpe3JldHVybiBJKGJbMV0sYlswXSxSYSkrSShhWzFdLGFbMF0sUmEpfWZ1bmN0aW9uIEsoYSxiKXtyZXR1cm4gSChiWzBdLGJbMV0sUmEpL0goYVswXSxhWzFdLFJhKX1mdW5jdGlvbiBMKCl7dGhpcy5ldkVsPVRhLHRoaXMuZXZXaW49VWEsdGhpcy5wcmVzc2VkPSExLHguYXBwbHkodGhpcyxhcmd1bWVudHMpfWZ1bmN0aW9uIE0oKXt0aGlzLmV2RWw9WGEsdGhpcy5ldldpbj1ZYSx4LmFwcGx5KHRoaXMsYXJndW1lbnRzKSx0aGlzLnN0b3JlPXRoaXMubWFuYWdlci5zZXNzaW9uLnBvaW50ZXJFdmVudHM9W119ZnVuY3Rpb24gTigpe3RoaXMuZXZUYXJnZXQ9JGEsdGhpcy5ldldpbj1fYSx0aGlzLnN0YXJ0ZWQ9ITEseC5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZnVuY3Rpb24gTyhhLGIpe3ZhciBjPXMoYS50b3VjaGVzKSxkPXMoYS5jaGFuZ2VkVG91Y2hlcyk7cmV0dXJuIGImKEdhfEhhKSYmKGM9dChjLmNvbmNhdChkKSxcImlkZW50aWZpZXJcIiwhMCkpLFtjLGRdfWZ1bmN0aW9uIFAoKXt0aGlzLmV2VGFyZ2V0PWJiLHRoaXMudGFyZ2V0SWRzPXt9LHguYXBwbHkodGhpcyxhcmd1bWVudHMpfWZ1bmN0aW9uIFEoYSxiKXt2YXIgYz1zKGEudG91Y2hlcyksZD10aGlzLnRhcmdldElkcztpZihiJihFYXxGYSkmJjE9PT1jLmxlbmd0aClyZXR1cm4gZFtjWzBdLmlkZW50aWZpZXJdPSEwLFtjLGNdO3ZhciBlLGYsZz1zKGEuY2hhbmdlZFRvdWNoZXMpLGg9W10saT10aGlzLnRhcmdldDtpZihmPWMuZmlsdGVyKGZ1bmN0aW9uKGEpe3JldHVybiBvKGEudGFyZ2V0LGkpfSksYj09PUVhKWZvcihlPTA7ZTxmLmxlbmd0aDspZFtmW2VdLmlkZW50aWZpZXJdPSEwLGUrKztmb3IoZT0wO2U8Zy5sZW5ndGg7KWRbZ1tlXS5pZGVudGlmaWVyXSYmaC5wdXNoKGdbZV0pLGImKEdhfEhhKSYmZGVsZXRlIGRbZ1tlXS5pZGVudGlmaWVyXSxlKys7cmV0dXJuIGgubGVuZ3RoP1t0KGYuY29uY2F0KGgpLFwiaWRlbnRpZmllclwiLCEwKSxoXTp2b2lkIDB9ZnVuY3Rpb24gUigpe3guYXBwbHkodGhpcyxhcmd1bWVudHMpO3ZhciBhPWoodGhpcy5oYW5kbGVyLHRoaXMpO3RoaXMudG91Y2g9bmV3IFAodGhpcy5tYW5hZ2VyLGEpLHRoaXMubW91c2U9bmV3IEwodGhpcy5tYW5hZ2VyLGEpLHRoaXMucHJpbWFyeVRvdWNoPW51bGwsdGhpcy5sYXN0VG91Y2hlcz1bXX1mdW5jdGlvbiBTKGEsYil7YSZFYT8odGhpcy5wcmltYXJ5VG91Y2g9Yi5jaGFuZ2VkUG9pbnRlcnNbMF0uaWRlbnRpZmllcixULmNhbGwodGhpcyxiKSk6YSYoR2F8SGEpJiZULmNhbGwodGhpcyxiKX1mdW5jdGlvbiBUKGEpe3ZhciBiPWEuY2hhbmdlZFBvaW50ZXJzWzBdO2lmKGIuaWRlbnRpZmllcj09PXRoaXMucHJpbWFyeVRvdWNoKXt2YXIgYz17eDpiLmNsaWVudFgseTpiLmNsaWVudFl9O3RoaXMubGFzdFRvdWNoZXMucHVzaChjKTt2YXIgZD10aGlzLmxhc3RUb3VjaGVzLGU9ZnVuY3Rpb24oKXt2YXIgYT1kLmluZGV4T2YoYyk7YT4tMSYmZC5zcGxpY2UoYSwxKX07c2V0VGltZW91dChlLGNiKX19ZnVuY3Rpb24gVShhKXtmb3IodmFyIGI9YS5zcmNFdmVudC5jbGllbnRYLGM9YS5zcmNFdmVudC5jbGllbnRZLGQ9MDtkPHRoaXMubGFzdFRvdWNoZXMubGVuZ3RoO2QrKyl7dmFyIGU9dGhpcy5sYXN0VG91Y2hlc1tkXSxmPU1hdGguYWJzKGItZS54KSxnPU1hdGguYWJzKGMtZS55KTtpZihkYj49ZiYmZGI+PWcpcmV0dXJuITB9cmV0dXJuITF9ZnVuY3Rpb24gVihhLGIpe3RoaXMubWFuYWdlcj1hLHRoaXMuc2V0KGIpfWZ1bmN0aW9uIFcoYSl7aWYocChhLGpiKSlyZXR1cm4gamI7dmFyIGI9cChhLGtiKSxjPXAoYSxsYik7cmV0dXJuIGImJmM/amI6Ynx8Yz9iP2tiOmxiOnAoYSxpYik/aWI6aGJ9ZnVuY3Rpb24gWCgpe2lmKCFmYilyZXR1cm4hMTt2YXIgYj17fSxjPWEuQ1NTJiZhLkNTUy5zdXBwb3J0cztyZXR1cm5bXCJhdXRvXCIsXCJtYW5pcHVsYXRpb25cIixcInBhbi15XCIsXCJwYW4teFwiLFwicGFuLXggcGFuLXlcIixcIm5vbmVcIl0uZm9yRWFjaChmdW5jdGlvbihkKXtiW2RdPWM/YS5DU1Muc3VwcG9ydHMoXCJ0b3VjaC1hY3Rpb25cIixkKTohMH0pLGJ9ZnVuY3Rpb24gWShhKXt0aGlzLm9wdGlvbnM9bGEoe30sdGhpcy5kZWZhdWx0cyxhfHx7fSksdGhpcy5pZD12KCksdGhpcy5tYW5hZ2VyPW51bGwsdGhpcy5vcHRpb25zLmVuYWJsZT1sKHRoaXMub3B0aW9ucy5lbmFibGUsITApLHRoaXMuc3RhdGU9bmIsdGhpcy5zaW11bHRhbmVvdXM9e30sdGhpcy5yZXF1aXJlRmFpbD1bXX1mdW5jdGlvbiBaKGEpe3JldHVybiBhJnNiP1wiY2FuY2VsXCI6YSZxYj9cImVuZFwiOmEmcGI/XCJtb3ZlXCI6YSZvYj9cInN0YXJ0XCI6XCJcIn1mdW5jdGlvbiAkKGEpe3JldHVybiBhPT1NYT9cImRvd25cIjphPT1MYT9cInVwXCI6YT09SmE/XCJsZWZ0XCI6YT09S2E/XCJyaWdodFwiOlwiXCJ9ZnVuY3Rpb24gXyhhLGIpe3ZhciBjPWIubWFuYWdlcjtyZXR1cm4gYz9jLmdldChhKTphfWZ1bmN0aW9uIGFhKCl7WS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZnVuY3Rpb24gYmEoKXthYS5hcHBseSh0aGlzLGFyZ3VtZW50cyksdGhpcy5wWD1udWxsLHRoaXMucFk9bnVsbH1mdW5jdGlvbiBjYSgpe2FhLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1mdW5jdGlvbiBkYSgpe1kuYXBwbHkodGhpcyxhcmd1bWVudHMpLHRoaXMuX3RpbWVyPW51bGwsdGhpcy5faW5wdXQ9bnVsbH1mdW5jdGlvbiBlYSgpe2FhLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1mdW5jdGlvbiBmYSgpe2FhLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1mdW5jdGlvbiBnYSgpe1kuYXBwbHkodGhpcyxhcmd1bWVudHMpLHRoaXMucFRpbWU9ITEsdGhpcy5wQ2VudGVyPSExLHRoaXMuX3RpbWVyPW51bGwsdGhpcy5faW5wdXQ9bnVsbCx0aGlzLmNvdW50PTB9ZnVuY3Rpb24gaGEoYSxiKXtyZXR1cm4gYj1ifHx7fSxiLnJlY29nbml6ZXJzPWwoYi5yZWNvZ25pemVycyxoYS5kZWZhdWx0cy5wcmVzZXQpLG5ldyBpYShhLGIpfWZ1bmN0aW9uIGlhKGEsYil7dGhpcy5vcHRpb25zPWxhKHt9LGhhLmRlZmF1bHRzLGJ8fHt9KSx0aGlzLm9wdGlvbnMuaW5wdXRUYXJnZXQ9dGhpcy5vcHRpb25zLmlucHV0VGFyZ2V0fHxhLHRoaXMuaGFuZGxlcnM9e30sdGhpcy5zZXNzaW9uPXt9LHRoaXMucmVjb2duaXplcnM9W10sdGhpcy5vbGRDc3NQcm9wcz17fSx0aGlzLmVsZW1lbnQ9YSx0aGlzLmlucHV0PXkodGhpcyksdGhpcy50b3VjaEFjdGlvbj1uZXcgVih0aGlzLHRoaXMub3B0aW9ucy50b3VjaEFjdGlvbiksamEodGhpcywhMCksZyh0aGlzLm9wdGlvbnMucmVjb2duaXplcnMsZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5hZGQobmV3IGFbMF0oYVsxXSkpO2FbMl0mJmIucmVjb2duaXplV2l0aChhWzJdKSxhWzNdJiZiLnJlcXVpcmVGYWlsdXJlKGFbM10pfSx0aGlzKX1mdW5jdGlvbiBqYShhLGIpe3ZhciBjPWEuZWxlbWVudDtpZihjLnN0eWxlKXt2YXIgZDtnKGEub3B0aW9ucy5jc3NQcm9wcyxmdW5jdGlvbihlLGYpe2Q9dShjLnN0eWxlLGYpLGI/KGEub2xkQ3NzUHJvcHNbZF09Yy5zdHlsZVtkXSxjLnN0eWxlW2RdPWUpOmMuc3R5bGVbZF09YS5vbGRDc3NQcm9wc1tkXXx8XCJcIn0pLGJ8fChhLm9sZENzc1Byb3BzPXt9KX19ZnVuY3Rpb24ga2EoYSxjKXt2YXIgZD1iLmNyZWF0ZUV2ZW50KFwiRXZlbnRcIik7ZC5pbml0RXZlbnQoYSwhMCwhMCksZC5nZXN0dXJlPWMsYy50YXJnZXQuZGlzcGF0Y2hFdmVudChkKX12YXIgbGEsbWE9W1wiXCIsXCJ3ZWJraXRcIixcIk1velwiLFwiTVNcIixcIm1zXCIsXCJvXCJdLG5hPWIuY3JlYXRlRWxlbWVudChcImRpdlwiKSxvYT1cImZ1bmN0aW9uXCIscGE9TWF0aC5yb3VuZCxxYT1NYXRoLmFicyxyYT1EYXRlLm5vdztsYT1cImZ1bmN0aW9uXCIhPXR5cGVvZiBPYmplY3QuYXNzaWduP2Z1bmN0aW9uKGEpe2lmKGE9PT1kfHxudWxsPT09YSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0XCIpO2Zvcih2YXIgYj1PYmplY3QoYSksYz0xO2M8YXJndW1lbnRzLmxlbmd0aDtjKyspe3ZhciBlPWFyZ3VtZW50c1tjXTtpZihlIT09ZCYmbnVsbCE9PWUpZm9yKHZhciBmIGluIGUpZS5oYXNPd25Qcm9wZXJ0eShmKSYmKGJbZl09ZVtmXSl9cmV0dXJuIGJ9Ok9iamVjdC5hc3NpZ247dmFyIHNhPWgoZnVuY3Rpb24oYSxiLGMpe2Zvcih2YXIgZT1PYmplY3Qua2V5cyhiKSxmPTA7ZjxlLmxlbmd0aDspKCFjfHxjJiZhW2VbZl1dPT09ZCkmJihhW2VbZl1dPWJbZVtmXV0pLGYrKztyZXR1cm4gYX0sXCJleHRlbmRcIixcIlVzZSBgYXNzaWduYC5cIiksdGE9aChmdW5jdGlvbihhLGIpe3JldHVybiBzYShhLGIsITApfSxcIm1lcmdlXCIsXCJVc2UgYGFzc2lnbmAuXCIpLHVhPTEsdmE9L21vYmlsZXx0YWJsZXR8aXAoYWR8aG9uZXxvZCl8YW5kcm9pZC9pLHdhPVwib250b3VjaHN0YXJ0XCJpbiBhLHhhPXUoYSxcIlBvaW50ZXJFdmVudFwiKSE9PWQseWE9d2EmJnZhLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCksemE9XCJ0b3VjaFwiLEFhPVwicGVuXCIsQmE9XCJtb3VzZVwiLENhPVwia2luZWN0XCIsRGE9MjUsRWE9MSxGYT0yLEdhPTQsSGE9OCxJYT0xLEphPTIsS2E9NCxMYT04LE1hPTE2LE5hPUphfEthLE9hPUxhfE1hLFBhPU5hfE9hLFFhPVtcInhcIixcInlcIl0sUmE9W1wiY2xpZW50WFwiLFwiY2xpZW50WVwiXTt4LnByb3RvdHlwZT17aGFuZGxlcjpmdW5jdGlvbigpe30saW5pdDpmdW5jdGlvbigpe3RoaXMuZXZFbCYmbSh0aGlzLmVsZW1lbnQsdGhpcy5ldkVsLHRoaXMuZG9tSGFuZGxlciksdGhpcy5ldlRhcmdldCYmbSh0aGlzLnRhcmdldCx0aGlzLmV2VGFyZ2V0LHRoaXMuZG9tSGFuZGxlciksdGhpcy5ldldpbiYmbSh3KHRoaXMuZWxlbWVudCksdGhpcy5ldldpbix0aGlzLmRvbUhhbmRsZXIpfSxkZXN0cm95OmZ1bmN0aW9uKCl7dGhpcy5ldkVsJiZuKHRoaXMuZWxlbWVudCx0aGlzLmV2RWwsdGhpcy5kb21IYW5kbGVyKSx0aGlzLmV2VGFyZ2V0JiZuKHRoaXMudGFyZ2V0LHRoaXMuZXZUYXJnZXQsdGhpcy5kb21IYW5kbGVyKSx0aGlzLmV2V2luJiZuKHcodGhpcy5lbGVtZW50KSx0aGlzLmV2V2luLHRoaXMuZG9tSGFuZGxlcil9fTt2YXIgU2E9e21vdXNlZG93bjpFYSxtb3VzZW1vdmU6RmEsbW91c2V1cDpHYX0sVGE9XCJtb3VzZWRvd25cIixVYT1cIm1vdXNlbW92ZSBtb3VzZXVwXCI7aShMLHgse2hhbmRsZXI6ZnVuY3Rpb24oYSl7dmFyIGI9U2FbYS50eXBlXTtiJkVhJiYwPT09YS5idXR0b24mJih0aGlzLnByZXNzZWQ9ITApLGImRmEmJjEhPT1hLndoaWNoJiYoYj1HYSksdGhpcy5wcmVzc2VkJiYoYiZHYSYmKHRoaXMucHJlc3NlZD0hMSksdGhpcy5jYWxsYmFjayh0aGlzLm1hbmFnZXIsYix7cG9pbnRlcnM6W2FdLGNoYW5nZWRQb2ludGVyczpbYV0scG9pbnRlclR5cGU6QmEsc3JjRXZlbnQ6YX0pKX19KTt2YXIgVmE9e3BvaW50ZXJkb3duOkVhLHBvaW50ZXJtb3ZlOkZhLHBvaW50ZXJ1cDpHYSxwb2ludGVyY2FuY2VsOkhhLHBvaW50ZXJvdXQ6SGF9LFdhPXsyOnphLDM6QWEsNDpCYSw1OkNhfSxYYT1cInBvaW50ZXJkb3duXCIsWWE9XCJwb2ludGVybW92ZSBwb2ludGVydXAgcG9pbnRlcmNhbmNlbFwiO2EuTVNQb2ludGVyRXZlbnQmJiFhLlBvaW50ZXJFdmVudCYmKFhhPVwiTVNQb2ludGVyRG93blwiLFlhPVwiTVNQb2ludGVyTW92ZSBNU1BvaW50ZXJVcCBNU1BvaW50ZXJDYW5jZWxcIiksaShNLHgse2hhbmRsZXI6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5zdG9yZSxjPSExLGQ9YS50eXBlLnRvTG93ZXJDYXNlKCkucmVwbGFjZShcIm1zXCIsXCJcIiksZT1WYVtkXSxmPVdhW2EucG9pbnRlclR5cGVdfHxhLnBvaW50ZXJUeXBlLGc9Zj09emEsaD1yKGIsYS5wb2ludGVySWQsXCJwb2ludGVySWRcIik7ZSZFYSYmKDA9PT1hLmJ1dHRvbnx8Zyk/MD5oJiYoYi5wdXNoKGEpLGg9Yi5sZW5ndGgtMSk6ZSYoR2F8SGEpJiYoYz0hMCksMD5ofHwoYltoXT1hLHRoaXMuY2FsbGJhY2sodGhpcy5tYW5hZ2VyLGUse3BvaW50ZXJzOmIsY2hhbmdlZFBvaW50ZXJzOlthXSxwb2ludGVyVHlwZTpmLHNyY0V2ZW50OmF9KSxjJiZiLnNwbGljZShoLDEpKX19KTt2YXIgWmE9e3RvdWNoc3RhcnQ6RWEsdG91Y2htb3ZlOkZhLHRvdWNoZW5kOkdhLHRvdWNoY2FuY2VsOkhhfSwkYT1cInRvdWNoc3RhcnRcIixfYT1cInRvdWNoc3RhcnQgdG91Y2htb3ZlIHRvdWNoZW5kIHRvdWNoY2FuY2VsXCI7aShOLHgse2hhbmRsZXI6ZnVuY3Rpb24oYSl7dmFyIGI9WmFbYS50eXBlXTtpZihiPT09RWEmJih0aGlzLnN0YXJ0ZWQ9ITApLHRoaXMuc3RhcnRlZCl7dmFyIGM9Ty5jYWxsKHRoaXMsYSxiKTtiJihHYXxIYSkmJmNbMF0ubGVuZ3RoLWNbMV0ubGVuZ3RoPT09MCYmKHRoaXMuc3RhcnRlZD0hMSksdGhpcy5jYWxsYmFjayh0aGlzLm1hbmFnZXIsYix7cG9pbnRlcnM6Y1swXSxjaGFuZ2VkUG9pbnRlcnM6Y1sxXSxwb2ludGVyVHlwZTp6YSxzcmNFdmVudDphfSl9fX0pO3ZhciBhYj17dG91Y2hzdGFydDpFYSx0b3VjaG1vdmU6RmEsdG91Y2hlbmQ6R2EsdG91Y2hjYW5jZWw6SGF9LGJiPVwidG91Y2hzdGFydCB0b3VjaG1vdmUgdG91Y2hlbmQgdG91Y2hjYW5jZWxcIjtpKFAseCx7aGFuZGxlcjpmdW5jdGlvbihhKXt2YXIgYj1hYlthLnR5cGVdLGM9US5jYWxsKHRoaXMsYSxiKTtjJiZ0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlcixiLHtwb2ludGVyczpjWzBdLGNoYW5nZWRQb2ludGVyczpjWzFdLHBvaW50ZXJUeXBlOnphLHNyY0V2ZW50OmF9KX19KTt2YXIgY2I9MjUwMCxkYj0yNTtpKFIseCx7aGFuZGxlcjpmdW5jdGlvbihhLGIsYyl7dmFyIGQ9Yy5wb2ludGVyVHlwZT09emEsZT1jLnBvaW50ZXJUeXBlPT1CYTtpZighKGUmJmMuc291cmNlQ2FwYWJpbGl0aWVzJiZjLnNvdXJjZUNhcGFiaWxpdGllcy5maXJlc1RvdWNoRXZlbnRzKSl7aWYoZClTLmNhbGwodGhpcyxiLGMpO2Vsc2UgaWYoZSYmVS5jYWxsKHRoaXMsYykpcmV0dXJuO3RoaXMuY2FsbGJhY2soYSxiLGMpfX0sZGVzdHJveTpmdW5jdGlvbigpe3RoaXMudG91Y2guZGVzdHJveSgpLHRoaXMubW91c2UuZGVzdHJveSgpfX0pO3ZhciBlYj11KG5hLnN0eWxlLFwidG91Y2hBY3Rpb25cIiksZmI9ZWIhPT1kLGdiPVwiY29tcHV0ZVwiLGhiPVwiYXV0b1wiLGliPVwibWFuaXB1bGF0aW9uXCIsamI9XCJub25lXCIsa2I9XCJwYW4teFwiLGxiPVwicGFuLXlcIixtYj1YKCk7Vi5wcm90b3R5cGU9e3NldDpmdW5jdGlvbihhKXthPT1nYiYmKGE9dGhpcy5jb21wdXRlKCkpLGZiJiZ0aGlzLm1hbmFnZXIuZWxlbWVudC5zdHlsZSYmbWJbYV0mJih0aGlzLm1hbmFnZXIuZWxlbWVudC5zdHlsZVtlYl09YSksdGhpcy5hY3Rpb25zPWEudG9Mb3dlckNhc2UoKS50cmltKCl9LHVwZGF0ZTpmdW5jdGlvbigpe3RoaXMuc2V0KHRoaXMubWFuYWdlci5vcHRpb25zLnRvdWNoQWN0aW9uKX0sY29tcHV0ZTpmdW5jdGlvbigpe3ZhciBhPVtdO3JldHVybiBnKHRoaXMubWFuYWdlci5yZWNvZ25pemVycyxmdW5jdGlvbihiKXtrKGIub3B0aW9ucy5lbmFibGUsW2JdKSYmKGE9YS5jb25jYXQoYi5nZXRUb3VjaEFjdGlvbigpKSl9KSxXKGEuam9pbihcIiBcIikpfSxwcmV2ZW50RGVmYXVsdHM6ZnVuY3Rpb24oYSl7dmFyIGI9YS5zcmNFdmVudCxjPWEub2Zmc2V0RGlyZWN0aW9uO2lmKHRoaXMubWFuYWdlci5zZXNzaW9uLnByZXZlbnRlZClyZXR1cm4gdm9pZCBiLnByZXZlbnREZWZhdWx0KCk7dmFyIGQ9dGhpcy5hY3Rpb25zLGU9cChkLGpiKSYmIW1iW2piXSxmPXAoZCxsYikmJiFtYltsYl0sZz1wKGQsa2IpJiYhbWJba2JdO2lmKGUpe3ZhciBoPTE9PT1hLnBvaW50ZXJzLmxlbmd0aCxpPWEuZGlzdGFuY2U8MixqPWEuZGVsdGFUaW1lPDI1MDtpZihoJiZpJiZqKXJldHVybn1yZXR1cm4gZyYmZj92b2lkIDA6ZXx8ZiYmYyZOYXx8ZyYmYyZPYT90aGlzLnByZXZlbnRTcmMoYik6dm9pZCAwfSxwcmV2ZW50U3JjOmZ1bmN0aW9uKGEpe3RoaXMubWFuYWdlci5zZXNzaW9uLnByZXZlbnRlZD0hMCxhLnByZXZlbnREZWZhdWx0KCl9fTt2YXIgbmI9MSxvYj0yLHBiPTQscWI9OCxyYj1xYixzYj0xNix0Yj0zMjtZLnByb3RvdHlwZT17ZGVmYXVsdHM6e30sc2V0OmZ1bmN0aW9uKGEpe3JldHVybiBsYSh0aGlzLm9wdGlvbnMsYSksdGhpcy5tYW5hZ2VyJiZ0aGlzLm1hbmFnZXIudG91Y2hBY3Rpb24udXBkYXRlKCksdGhpc30scmVjb2duaXplV2l0aDpmdW5jdGlvbihhKXtpZihmKGEsXCJyZWNvZ25pemVXaXRoXCIsdGhpcykpcmV0dXJuIHRoaXM7dmFyIGI9dGhpcy5zaW11bHRhbmVvdXM7cmV0dXJuIGE9XyhhLHRoaXMpLGJbYS5pZF18fChiW2EuaWRdPWEsYS5yZWNvZ25pemVXaXRoKHRoaXMpKSx0aGlzfSxkcm9wUmVjb2duaXplV2l0aDpmdW5jdGlvbihhKXtyZXR1cm4gZihhLFwiZHJvcFJlY29nbml6ZVdpdGhcIix0aGlzKT90aGlzOihhPV8oYSx0aGlzKSxkZWxldGUgdGhpcy5zaW11bHRhbmVvdXNbYS5pZF0sdGhpcyl9LHJlcXVpcmVGYWlsdXJlOmZ1bmN0aW9uKGEpe2lmKGYoYSxcInJlcXVpcmVGYWlsdXJlXCIsdGhpcykpcmV0dXJuIHRoaXM7dmFyIGI9dGhpcy5yZXF1aXJlRmFpbDtyZXR1cm4gYT1fKGEsdGhpcyksLTE9PT1yKGIsYSkmJihiLnB1c2goYSksYS5yZXF1aXJlRmFpbHVyZSh0aGlzKSksdGhpc30sZHJvcFJlcXVpcmVGYWlsdXJlOmZ1bmN0aW9uKGEpe2lmKGYoYSxcImRyb3BSZXF1aXJlRmFpbHVyZVwiLHRoaXMpKXJldHVybiB0aGlzO2E9XyhhLHRoaXMpO3ZhciBiPXIodGhpcy5yZXF1aXJlRmFpbCxhKTtyZXR1cm4gYj4tMSYmdGhpcy5yZXF1aXJlRmFpbC5zcGxpY2UoYiwxKSx0aGlzfSxoYXNSZXF1aXJlRmFpbHVyZXM6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5yZXF1aXJlRmFpbC5sZW5ndGg+MH0sY2FuUmVjb2duaXplV2l0aDpmdW5jdGlvbihhKXtyZXR1cm4hIXRoaXMuc2ltdWx0YW5lb3VzW2EuaWRdfSxlbWl0OmZ1bmN0aW9uKGEpe2Z1bmN0aW9uIGIoYil7Yy5tYW5hZ2VyLmVtaXQoYixhKX12YXIgYz10aGlzLGQ9dGhpcy5zdGF0ZTtxYj5kJiZiKGMub3B0aW9ucy5ldmVudCtaKGQpKSxiKGMub3B0aW9ucy5ldmVudCksYS5hZGRpdGlvbmFsRXZlbnQmJmIoYS5hZGRpdGlvbmFsRXZlbnQpLGQ+PXFiJiZiKGMub3B0aW9ucy5ldmVudCtaKGQpKX0sdHJ5RW1pdDpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5jYW5FbWl0KCk/dGhpcy5lbWl0KGEpOnZvaWQodGhpcy5zdGF0ZT10Yil9LGNhbkVtaXQ6ZnVuY3Rpb24oKXtmb3IodmFyIGE9MDthPHRoaXMucmVxdWlyZUZhaWwubGVuZ3RoOyl7aWYoISh0aGlzLnJlcXVpcmVGYWlsW2FdLnN0YXRlJih0YnxuYikpKXJldHVybiExO2ErK31yZXR1cm4hMH0scmVjb2duaXplOmZ1bmN0aW9uKGEpe3ZhciBiPWxhKHt9LGEpO3JldHVybiBrKHRoaXMub3B0aW9ucy5lbmFibGUsW3RoaXMsYl0pPyh0aGlzLnN0YXRlJihyYnxzYnx0YikmJih0aGlzLnN0YXRlPW5iKSx0aGlzLnN0YXRlPXRoaXMucHJvY2VzcyhiKSx2b2lkKHRoaXMuc3RhdGUmKG9ifHBifHFifHNiKSYmdGhpcy50cnlFbWl0KGIpKSk6KHRoaXMucmVzZXQoKSx2b2lkKHRoaXMuc3RhdGU9dGIpKX0scHJvY2VzczpmdW5jdGlvbihhKXt9LGdldFRvdWNoQWN0aW9uOmZ1bmN0aW9uKCl7fSxyZXNldDpmdW5jdGlvbigpe319LGkoYWEsWSx7ZGVmYXVsdHM6e3BvaW50ZXJzOjF9LGF0dHJUZXN0OmZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMub3B0aW9ucy5wb2ludGVycztyZXR1cm4gMD09PWJ8fGEucG9pbnRlcnMubGVuZ3RoPT09Yn0scHJvY2VzczpmdW5jdGlvbihhKXt2YXIgYj10aGlzLnN0YXRlLGM9YS5ldmVudFR5cGUsZD1iJihvYnxwYiksZT10aGlzLmF0dHJUZXN0KGEpO3JldHVybiBkJiYoYyZIYXx8IWUpP2J8c2I6ZHx8ZT9jJkdhP2J8cWI6YiZvYj9ifHBiOm9iOnRifX0pLGkoYmEsYWEse2RlZmF1bHRzOntldmVudDpcInBhblwiLHRocmVzaG9sZDoxMCxwb2ludGVyczoxLGRpcmVjdGlvbjpQYX0sZ2V0VG91Y2hBY3Rpb246ZnVuY3Rpb24oKXt2YXIgYT10aGlzLm9wdGlvbnMuZGlyZWN0aW9uLGI9W107cmV0dXJuIGEmTmEmJmIucHVzaChsYiksYSZPYSYmYi5wdXNoKGtiKSxifSxkaXJlY3Rpb25UZXN0OmZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMub3B0aW9ucyxjPSEwLGQ9YS5kaXN0YW5jZSxlPWEuZGlyZWN0aW9uLGY9YS5kZWx0YVgsZz1hLmRlbHRhWTtyZXR1cm4gZSZiLmRpcmVjdGlvbnx8KGIuZGlyZWN0aW9uJk5hPyhlPTA9PT1mP0lhOjA+Zj9KYTpLYSxjPWYhPXRoaXMucFgsZD1NYXRoLmFicyhhLmRlbHRhWCkpOihlPTA9PT1nP0lhOjA+Zz9MYTpNYSxjPWchPXRoaXMucFksZD1NYXRoLmFicyhhLmRlbHRhWSkpKSxhLmRpcmVjdGlvbj1lLGMmJmQ+Yi50aHJlc2hvbGQmJmUmYi5kaXJlY3Rpb259LGF0dHJUZXN0OmZ1bmN0aW9uKGEpe3JldHVybiBhYS5wcm90b3R5cGUuYXR0clRlc3QuY2FsbCh0aGlzLGEpJiYodGhpcy5zdGF0ZSZvYnx8ISh0aGlzLnN0YXRlJm9iKSYmdGhpcy5kaXJlY3Rpb25UZXN0KGEpKX0sZW1pdDpmdW5jdGlvbihhKXt0aGlzLnBYPWEuZGVsdGFYLHRoaXMucFk9YS5kZWx0YVk7dmFyIGI9JChhLmRpcmVjdGlvbik7YiYmKGEuYWRkaXRpb25hbEV2ZW50PXRoaXMub3B0aW9ucy5ldmVudCtiKSx0aGlzLl9zdXBlci5lbWl0LmNhbGwodGhpcyxhKX19KSxpKGNhLGFhLHtkZWZhdWx0czp7ZXZlbnQ6XCJwaW5jaFwiLHRocmVzaG9sZDowLHBvaW50ZXJzOjJ9LGdldFRvdWNoQWN0aW9uOmZ1bmN0aW9uKCl7cmV0dXJuW2piXX0sYXR0clRlc3Q6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuX3N1cGVyLmF0dHJUZXN0LmNhbGwodGhpcyxhKSYmKE1hdGguYWJzKGEuc2NhbGUtMSk+dGhpcy5vcHRpb25zLnRocmVzaG9sZHx8dGhpcy5zdGF0ZSZvYil9LGVtaXQ6ZnVuY3Rpb24oYSl7aWYoMSE9PWEuc2NhbGUpe3ZhciBiPWEuc2NhbGU8MT9cImluXCI6XCJvdXRcIjthLmFkZGl0aW9uYWxFdmVudD10aGlzLm9wdGlvbnMuZXZlbnQrYn10aGlzLl9zdXBlci5lbWl0LmNhbGwodGhpcyxhKX19KSxpKGRhLFkse2RlZmF1bHRzOntldmVudDpcInByZXNzXCIscG9pbnRlcnM6MSx0aW1lOjI1MSx0aHJlc2hvbGQ6OX0sZ2V0VG91Y2hBY3Rpb246ZnVuY3Rpb24oKXtyZXR1cm5baGJdfSxwcm9jZXNzOmZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMub3B0aW9ucyxjPWEucG9pbnRlcnMubGVuZ3RoPT09Yi5wb2ludGVycyxkPWEuZGlzdGFuY2U8Yi50aHJlc2hvbGQsZj1hLmRlbHRhVGltZT5iLnRpbWU7aWYodGhpcy5faW5wdXQ9YSwhZHx8IWN8fGEuZXZlbnRUeXBlJihHYXxIYSkmJiFmKXRoaXMucmVzZXQoKTtlbHNlIGlmKGEuZXZlbnRUeXBlJkVhKXRoaXMucmVzZXQoKSx0aGlzLl90aW1lcj1lKGZ1bmN0aW9uKCl7dGhpcy5zdGF0ZT1yYix0aGlzLnRyeUVtaXQoKX0sYi50aW1lLHRoaXMpO2Vsc2UgaWYoYS5ldmVudFR5cGUmR2EpcmV0dXJuIHJiO3JldHVybiB0Yn0scmVzZXQ6ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQodGhpcy5fdGltZXIpfSxlbWl0OmZ1bmN0aW9uKGEpe3RoaXMuc3RhdGU9PT1yYiYmKGEmJmEuZXZlbnRUeXBlJkdhP3RoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCtcInVwXCIsYSk6KHRoaXMuX2lucHV0LnRpbWVTdGFtcD1yYSgpLHRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCx0aGlzLl9pbnB1dCkpKX19KSxpKGVhLGFhLHtkZWZhdWx0czp7ZXZlbnQ6XCJyb3RhdGVcIix0aHJlc2hvbGQ6MCxwb2ludGVyczoyfSxnZXRUb3VjaEFjdGlvbjpmdW5jdGlvbigpe3JldHVybltqYl19LGF0dHJUZXN0OmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLl9zdXBlci5hdHRyVGVzdC5jYWxsKHRoaXMsYSkmJihNYXRoLmFicyhhLnJvdGF0aW9uKT50aGlzLm9wdGlvbnMudGhyZXNob2xkfHx0aGlzLnN0YXRlJm9iKX19KSxpKGZhLGFhLHtkZWZhdWx0czp7ZXZlbnQ6XCJzd2lwZVwiLHRocmVzaG9sZDoxMCx2ZWxvY2l0eTouMyxkaXJlY3Rpb246TmF8T2EscG9pbnRlcnM6MX0sZ2V0VG91Y2hBY3Rpb246ZnVuY3Rpb24oKXtyZXR1cm4gYmEucHJvdG90eXBlLmdldFRvdWNoQWN0aW9uLmNhbGwodGhpcyl9LGF0dHJUZXN0OmZ1bmN0aW9uKGEpe3ZhciBiLGM9dGhpcy5vcHRpb25zLmRpcmVjdGlvbjtyZXR1cm4gYyYoTmF8T2EpP2I9YS5vdmVyYWxsVmVsb2NpdHk6YyZOYT9iPWEub3ZlcmFsbFZlbG9jaXR5WDpjJk9hJiYoYj1hLm92ZXJhbGxWZWxvY2l0eVkpLHRoaXMuX3N1cGVyLmF0dHJUZXN0LmNhbGwodGhpcyxhKSYmYyZhLm9mZnNldERpcmVjdGlvbiYmYS5kaXN0YW5jZT50aGlzLm9wdGlvbnMudGhyZXNob2xkJiZhLm1heFBvaW50ZXJzPT10aGlzLm9wdGlvbnMucG9pbnRlcnMmJnFhKGIpPnRoaXMub3B0aW9ucy52ZWxvY2l0eSYmYS5ldmVudFR5cGUmR2F9LGVtaXQ6ZnVuY3Rpb24oYSl7dmFyIGI9JChhLm9mZnNldERpcmVjdGlvbik7YiYmdGhpcy5tYW5hZ2VyLmVtaXQodGhpcy5vcHRpb25zLmV2ZW50K2IsYSksdGhpcy5tYW5hZ2VyLmVtaXQodGhpcy5vcHRpb25zLmV2ZW50LGEpfX0pLGkoZ2EsWSx7ZGVmYXVsdHM6e2V2ZW50OlwidGFwXCIscG9pbnRlcnM6MSx0YXBzOjEsaW50ZXJ2YWw6MzAwLHRpbWU6MjUwLHRocmVzaG9sZDo5LHBvc1RocmVzaG9sZDoxMH0sZ2V0VG91Y2hBY3Rpb246ZnVuY3Rpb24oKXtyZXR1cm5baWJdfSxwcm9jZXNzOmZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMub3B0aW9ucyxjPWEucG9pbnRlcnMubGVuZ3RoPT09Yi5wb2ludGVycyxkPWEuZGlzdGFuY2U8Yi50aHJlc2hvbGQsZj1hLmRlbHRhVGltZTxiLnRpbWU7aWYodGhpcy5yZXNldCgpLGEuZXZlbnRUeXBlJkVhJiYwPT09dGhpcy5jb3VudClyZXR1cm4gdGhpcy5mYWlsVGltZW91dCgpO2lmKGQmJmYmJmMpe2lmKGEuZXZlbnRUeXBlIT1HYSlyZXR1cm4gdGhpcy5mYWlsVGltZW91dCgpO3ZhciBnPXRoaXMucFRpbWU/YS50aW1lU3RhbXAtdGhpcy5wVGltZTxiLmludGVydmFsOiEwLGg9IXRoaXMucENlbnRlcnx8SCh0aGlzLnBDZW50ZXIsYS5jZW50ZXIpPGIucG9zVGhyZXNob2xkO3RoaXMucFRpbWU9YS50aW1lU3RhbXAsdGhpcy5wQ2VudGVyPWEuY2VudGVyLGgmJmc/dGhpcy5jb3VudCs9MTp0aGlzLmNvdW50PTEsdGhpcy5faW5wdXQ9YTt2YXIgaT10aGlzLmNvdW50JWIudGFwcztpZigwPT09aSlyZXR1cm4gdGhpcy5oYXNSZXF1aXJlRmFpbHVyZXMoKT8odGhpcy5fdGltZXI9ZShmdW5jdGlvbigpe3RoaXMuc3RhdGU9cmIsdGhpcy50cnlFbWl0KCl9LGIuaW50ZXJ2YWwsdGhpcyksb2IpOnJifXJldHVybiB0Yn0sZmFpbFRpbWVvdXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdGltZXI9ZShmdW5jdGlvbigpe3RoaXMuc3RhdGU9dGJ9LHRoaXMub3B0aW9ucy5pbnRlcnZhbCx0aGlzKSx0Yn0scmVzZXQ6ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQodGhpcy5fdGltZXIpfSxlbWl0OmZ1bmN0aW9uKCl7dGhpcy5zdGF0ZT09cmImJih0aGlzLl9pbnB1dC50YXBDb3VudD10aGlzLmNvdW50LHRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCx0aGlzLl9pbnB1dCkpfX0pLGhhLlZFUlNJT049XCIyLjAuOFwiLGhhLmRlZmF1bHRzPXtkb21FdmVudHM6ITEsdG91Y2hBY3Rpb246Z2IsZW5hYmxlOiEwLGlucHV0VGFyZ2V0Om51bGwsaW5wdXRDbGFzczpudWxsLHByZXNldDpbW2VhLHtlbmFibGU6ITF9XSxbY2Ese2VuYWJsZTohMX0sW1wicm90YXRlXCJdXSxbZmEse2RpcmVjdGlvbjpOYX1dLFtiYSx7ZGlyZWN0aW9uOk5hfSxbXCJzd2lwZVwiXV0sW2dhXSxbZ2Ese2V2ZW50OlwiZG91YmxldGFwXCIsdGFwczoyfSxbXCJ0YXBcIl1dLFtkYV1dLGNzc1Byb3BzOnt1c2VyU2VsZWN0Olwibm9uZVwiLHRvdWNoU2VsZWN0Olwibm9uZVwiLHRvdWNoQ2FsbG91dDpcIm5vbmVcIixjb250ZW50Wm9vbWluZzpcIm5vbmVcIix1c2VyRHJhZzpcIm5vbmVcIix0YXBIaWdobGlnaHRDb2xvcjpcInJnYmEoMCwwLDAsMClcIn19O3ZhciB1Yj0xLHZiPTI7aWEucHJvdG90eXBlPXtzZXQ6ZnVuY3Rpb24oYSl7cmV0dXJuIGxhKHRoaXMub3B0aW9ucyxhKSxhLnRvdWNoQWN0aW9uJiZ0aGlzLnRvdWNoQWN0aW9uLnVwZGF0ZSgpLGEuaW5wdXRUYXJnZXQmJih0aGlzLmlucHV0LmRlc3Ryb3koKSx0aGlzLmlucHV0LnRhcmdldD1hLmlucHV0VGFyZ2V0LHRoaXMuaW5wdXQuaW5pdCgpKSx0aGlzfSxzdG9wOmZ1bmN0aW9uKGEpe3RoaXMuc2Vzc2lvbi5zdG9wcGVkPWE/dmI6dWJ9LHJlY29nbml6ZTpmdW5jdGlvbihhKXt2YXIgYj10aGlzLnNlc3Npb247aWYoIWIuc3RvcHBlZCl7dGhpcy50b3VjaEFjdGlvbi5wcmV2ZW50RGVmYXVsdHMoYSk7dmFyIGMsZD10aGlzLnJlY29nbml6ZXJzLGU9Yi5jdXJSZWNvZ25pemVyOyghZXx8ZSYmZS5zdGF0ZSZyYikmJihlPWIuY3VyUmVjb2duaXplcj1udWxsKTtmb3IodmFyIGY9MDtmPGQubGVuZ3RoOyljPWRbZl0sYi5zdG9wcGVkPT09dmJ8fGUmJmMhPWUmJiFjLmNhblJlY29nbml6ZVdpdGgoZSk/Yy5yZXNldCgpOmMucmVjb2duaXplKGEpLCFlJiZjLnN0YXRlJihvYnxwYnxxYikmJihlPWIuY3VyUmVjb2duaXplcj1jKSxmKyt9fSxnZXQ6ZnVuY3Rpb24oYSl7aWYoYSBpbnN0YW5jZW9mIFkpcmV0dXJuIGE7Zm9yKHZhciBiPXRoaXMucmVjb2duaXplcnMsYz0wO2M8Yi5sZW5ndGg7YysrKWlmKGJbY10ub3B0aW9ucy5ldmVudD09YSlyZXR1cm4gYltjXTtyZXR1cm4gbnVsbH0sYWRkOmZ1bmN0aW9uKGEpe2lmKGYoYSxcImFkZFwiLHRoaXMpKXJldHVybiB0aGlzO3ZhciBiPXRoaXMuZ2V0KGEub3B0aW9ucy5ldmVudCk7cmV0dXJuIGImJnRoaXMucmVtb3ZlKGIpLHRoaXMucmVjb2duaXplcnMucHVzaChhKSxhLm1hbmFnZXI9dGhpcyx0aGlzLnRvdWNoQWN0aW9uLnVwZGF0ZSgpLGF9LHJlbW92ZTpmdW5jdGlvbihhKXtpZihmKGEsXCJyZW1vdmVcIix0aGlzKSlyZXR1cm4gdGhpcztpZihhPXRoaXMuZ2V0KGEpKXt2YXIgYj10aGlzLnJlY29nbml6ZXJzLGM9cihiLGEpOy0xIT09YyYmKGIuc3BsaWNlKGMsMSksdGhpcy50b3VjaEFjdGlvbi51cGRhdGUoKSl9cmV0dXJuIHRoaXN9LG9uOmZ1bmN0aW9uKGEsYil7aWYoYSE9PWQmJmIhPT1kKXt2YXIgYz10aGlzLmhhbmRsZXJzO3JldHVybiBnKHEoYSksZnVuY3Rpb24oYSl7Y1thXT1jW2FdfHxbXSxjW2FdLnB1c2goYil9KSx0aGlzfX0sb2ZmOmZ1bmN0aW9uKGEsYil7aWYoYSE9PWQpe3ZhciBjPXRoaXMuaGFuZGxlcnM7cmV0dXJuIGcocShhKSxmdW5jdGlvbihhKXtiP2NbYV0mJmNbYV0uc3BsaWNlKHIoY1thXSxiKSwxKTpkZWxldGUgY1thXX0pLHRoaXN9fSxlbWl0OmZ1bmN0aW9uKGEsYil7dGhpcy5vcHRpb25zLmRvbUV2ZW50cyYma2EoYSxiKTt2YXIgYz10aGlzLmhhbmRsZXJzW2FdJiZ0aGlzLmhhbmRsZXJzW2FdLnNsaWNlKCk7aWYoYyYmYy5sZW5ndGgpe2IudHlwZT1hLGIucHJldmVudERlZmF1bHQ9ZnVuY3Rpb24oKXtiLnNyY0V2ZW50LnByZXZlbnREZWZhdWx0KCl9O2Zvcih2YXIgZD0wO2Q8Yy5sZW5ndGg7KWNbZF0oYiksZCsrfX0sZGVzdHJveTpmdW5jdGlvbigpe3RoaXMuZWxlbWVudCYmamEodGhpcywhMSksdGhpcy5oYW5kbGVycz17fSx0aGlzLnNlc3Npb249e30sdGhpcy5pbnB1dC5kZXN0cm95KCksdGhpcy5lbGVtZW50PW51bGx9fSxsYShoYSx7SU5QVVRfU1RBUlQ6RWEsSU5QVVRfTU9WRTpGYSxJTlBVVF9FTkQ6R2EsSU5QVVRfQ0FOQ0VMOkhhLFNUQVRFX1BPU1NJQkxFOm5iLFNUQVRFX0JFR0FOOm9iLFNUQVRFX0NIQU5HRUQ6cGIsU1RBVEVfRU5ERUQ6cWIsU1RBVEVfUkVDT0dOSVpFRDpyYixTVEFURV9DQU5DRUxMRUQ6c2IsU1RBVEVfRkFJTEVEOnRiLERJUkVDVElPTl9OT05FOklhLERJUkVDVElPTl9MRUZUOkphLERJUkVDVElPTl9SSUdIVDpLYSxESVJFQ1RJT05fVVA6TGEsRElSRUNUSU9OX0RPV046TWEsRElSRUNUSU9OX0hPUklaT05UQUw6TmEsRElSRUNUSU9OX1ZFUlRJQ0FMOk9hLERJUkVDVElPTl9BTEw6UGEsTWFuYWdlcjppYSxJbnB1dDp4LFRvdWNoQWN0aW9uOlYsVG91Y2hJbnB1dDpQLE1vdXNlSW5wdXQ6TCxQb2ludGVyRXZlbnRJbnB1dDpNLFRvdWNoTW91c2VJbnB1dDpSLFNpbmdsZVRvdWNoSW5wdXQ6TixSZWNvZ25pemVyOlksQXR0clJlY29nbml6ZXI6YWEsVGFwOmdhLFBhbjpiYSxTd2lwZTpmYSxQaW5jaDpjYSxSb3RhdGU6ZWEsUHJlc3M6ZGEsb246bSxvZmY6bixlYWNoOmcsbWVyZ2U6dGEsZXh0ZW5kOnNhLGFzc2lnbjpsYSxpbmhlcml0OmksYmluZEZuOmoscHJlZml4ZWQ6dX0pO3ZhciB3Yj1cInVuZGVmaW5lZFwiIT10eXBlb2YgYT9hOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmP3NlbGY6e307d2IuSGFtbWVyPWhhLFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gaGF9KTpcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1oYTphW2NdPWhhfSh3aW5kb3csZG9jdW1lbnQsXCJIYW1tZXJcIik7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1oYW1tZXIubWluLmpzLm1hcCIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmVCYXNlZEdyYWRlciB7XG4gICAgY29uc3RydWN0b3IocHJvYmxlbSkge1xuICAgICAgICB0aGlzLnByb2JsZW0gPSBwcm9ibGVtO1xuICAgIH1cbiAgICAvLyBVc2UgYSBMSVMgKExvbmdlc3QgSW5jcmVhc2luZyBTdWJzZXF1ZW5jZSkgYWxnb3JpdGhtIHRvIHJldHVybiB0aGUgaW5kZXhlc1xuICAgIC8vIHRoYXQgYXJlIG5vdCBwYXJ0IG9mIHRoYXQgc3Vic2VxdWVuY2UuXG4gICAgaW52ZXJzZUxJU0luZGljZXMoYXJyKSB7XG4gICAgICAgIC8vIEdldCBhbGwgc3Vic2VxdWVuY2VzXG4gICAgICAgIHZhciBhbGxTdWJzZXF1ZW5jZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzdWJzZXF1ZW5jZUZvckN1cnJlbnQgPSBbYXJyW2ldXSxcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gYXJyW2ldLFxuICAgICAgICAgICAgICAgIGxhc3RFbGVtZW50QWRkZWQgPSAtMTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSBpOyBqIDwgYXJyLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN1YnNlcXVlbnQgPSBhcnJbal07XG4gICAgICAgICAgICAgICAgaWYgKHN1YnNlcXVlbnQgPiBjdXJyZW50ICYmIGxhc3RFbGVtZW50QWRkZWQgPCBzdWJzZXF1ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNlcXVlbmNlRm9yQ3VycmVudC5wdXNoKHN1YnNlcXVlbnQpO1xuICAgICAgICAgICAgICAgICAgICBsYXN0RWxlbWVudEFkZGVkID0gc3Vic2VxdWVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhbGxTdWJzZXF1ZW5jZXMucHVzaChzdWJzZXF1ZW5jZUZvckN1cnJlbnQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEZpZ3VyZSBvdXQgdGhlIGxvbmdlc3Qgb25lXG4gICAgICAgIHZhciBsb25nZXN0U3Vic2VxdWVuY2VMZW5ndGggPSAtMTtcbiAgICAgICAgdmFyIGxvbmdlc3RTdWJzZXF1ZW5jZTtcbiAgICAgICAgZm9yIChsZXQgaSBpbiBhbGxTdWJzZXF1ZW5jZXMpIHtcbiAgICAgICAgICAgIHZhciBzdWJzID0gYWxsU3Vic2VxdWVuY2VzW2ldO1xuICAgICAgICAgICAgaWYgKHN1YnMubGVuZ3RoID4gbG9uZ2VzdFN1YnNlcXVlbmNlTGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbG9uZ2VzdFN1YnNlcXVlbmNlTGVuZ3RoID0gc3Vicy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgbG9uZ2VzdFN1YnNlcXVlbmNlID0gc3VicztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBDcmVhdGUgdGhlIGludmVyc2UgaW5kZXhlc1xuICAgICAgICB2YXIgaW5kZXhlcyA9IFtdO1xuICAgICAgICB2YXIgbEluZGV4ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChsSW5kZXggPiBsb25nZXN0U3Vic2VxdWVuY2UubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaW5kZXhlcy5wdXNoKGkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJyW2ldID09IGxvbmdlc3RTdWJzZXF1ZW5jZVtsSW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgICAgIGxJbmRleCArPSAxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ZXMucHVzaChpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluZGV4ZXM7XG4gICAgfVxuICAgIC8vIGdyYWRlIHRoYXQgZWxlbWVudCwgcmV0dXJuaW5nIHRoZSBzdGF0ZVxuICAgIGdyYWRlKCkge1xuICAgICAgICB2YXIgcHJvYmxlbSA9IHRoaXMucHJvYmxlbTtcbiAgICAgICAgcHJvYmxlbS5jbGVhckZlZWRiYWNrKCk7XG4gICAgICAgIHRoaXMuY29ycmVjdExpbmVzID0gMDtcbiAgICAgICAgdGhpcy5wZXJjZW50TGluZXMgPSAwO1xuICAgICAgICB0aGlzLmluY29ycmVjdEluZGVudHMgPSAwO1xuICAgICAgICB2YXIgc29sdXRpb25MaW5lcyA9IHByb2JsZW0uc29sdXRpb247XG4gICAgICAgIHZhciBhbnN3ZXJMaW5lcyA9IHByb2JsZW0uYW5zd2VyTGluZXMoKTtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBzdGF0ZTtcbiAgICAgICAgdGhpcy5wZXJjZW50TGluZXMgPVxuICAgICAgICAgICAgTWF0aC5taW4oYW5zd2VyTGluZXMubGVuZ3RoLCBzb2x1dGlvbkxpbmVzLmxlbmd0aCkgL1xuICAgICAgICAgICAgTWF0aC5tYXgoYW5zd2VyTGluZXMubGVuZ3RoLCBzb2x1dGlvbkxpbmVzLmxlbmd0aCk7XG4gICAgICAgIGlmIChhbnN3ZXJMaW5lcy5sZW5ndGggPCBzb2x1dGlvbkxpbmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgc3RhdGUgPSBcImluY29ycmVjdFRvb1Nob3J0XCI7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3RMZW5ndGggPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmIChhbnN3ZXJMaW5lcy5sZW5ndGggPT0gc29sdXRpb25MaW5lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdExlbmd0aCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZSA9IFwiaW5jb3JyZWN0TW92ZUJsb2Nrc1wiO1xuICAgICAgICAgICAgdGhpcy5jb3JyZWN0TGVuZ3RoID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEZXRlcm1pbmUgd2hldGhlciB0aGUgY29kZSAqKnRoYXQgaXMgdGhlcmUqKiBpcyBpbiB0aGUgY29ycmVjdCBvcmRlclxuICAgICAgICAvLyBJZiB0aGVyZSBpcyB0b28gbXVjaCBvciB0b28gbGl0dGxlIGNvZGUgdGhpcyBvbmx5IG1hdHRlcnMgZm9yXG4gICAgICAgIC8vIGNhbGN1bGF0aW5nIGEgcGVyY2VudGFnZSBzY29yZS5cbiAgICAgICAgbGV0IGlzQ29ycmVjdE9yZGVyID0gdGhpcy5jaGVja0NvcnJlY3RPcmRlcmluZyhzb2x1dGlvbkxpbmVzLCBhbnN3ZXJMaW5lcylcblxuICAgICAgICAvLyBEZXRlcm1pbmUgd2hldGhlciBibG9ja3MgYXJlIGluZGVudGVkIGNvcnJlY3RseVxuICAgICAgICBsZXQgaXNDb3JyZWN0SW5kZW50cyA9IHRoaXMuY2hlY2tDb3JyZWN0SW5kZW50YXRpb24oc29sdXRpb25MaW5lcywgYW5zd2VyTGluZXMpO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGlzQ29ycmVjdEluZGVudHMgJiZcbiAgICAgICAgICAgIGlzQ29ycmVjdE9yZGVyICYmXG4gICAgICAgICAgICB0aGlzLmNvcnJlY3RMZW5ndGhcbiAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBQZXJmZWN0XG4gICAgICAgICAgICBzdGF0ZSA9IFwiY29ycmVjdFwiO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29ycmVjdExlbmd0aCAmJiBpc0NvcnJlY3RPcmRlcikge1xuICAgICAgICAgICAgc3RhdGUgPSBcImluY29ycmVjdEluZGVudFwiO1xuICAgICAgICB9IGVsc2UgaWYgKCFpc0NvcnJlY3RPcmRlciAmJiBzdGF0ZSAhPSBcImluY29ycmVjdFRvb1Nob3J0XCIpIHtcbiAgICAgICAgICAgIHN0YXRlID0gXCJpbmNvcnJlY3RNb3ZlQmxvY2tzXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVQZXJjZW50KCk7XG4gICAgICAgIHRoaXMuZ3JhZGVyU3RhdGUgPSBzdGF0ZTtcblxuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgY2hlY2tDb3JyZWN0SW5kZW50YXRpb24oc29sdXRpb25MaW5lcywgYW5zd2VyTGluZXMpIHtcbiAgICAgICAgdGhpcy5pbmRlbnRMZWZ0ID0gW107XG4gICAgICAgIHRoaXMuaW5kZW50UmlnaHQgPSBbXTtcbiAgICAgICAgbGV0IGxvb3BMaW1pdCA9IE1hdGgubWluKHNvbHV0aW9uTGluZXMubGVuZ3RoLCBhbnN3ZXJMaW5lcy5sZW5ndGgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxvb3BMaW1pdDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYW5zd2VyTGluZXNbaV0udmlld0luZGVudCgpIDwgYW5zd2VyTGluZXNbaV0uaW5kZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRlbnRSaWdodC5wdXNoKGFuc3dlckxpbmVzW2ldKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5zd2VyTGluZXNbaV0udmlld0luZGVudCgpID4gc29sdXRpb25MaW5lc1tpXS5pbmRlbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGVudExlZnQucHVzaChhbnN3ZXJMaW5lc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbmNvcnJlY3RJbmRlbnRzID1cbiAgICAgICAgICAgIHRoaXMuaW5kZW50TGVmdC5sZW5ndGggKyB0aGlzLmluZGVudFJpZ2h0Lmxlbmd0aDtcblxuICAgICAgICByZXR1cm4gdGhpcy5pbmNvcnJlY3RJbmRlbnRzID09IDA7XG4gICAgfVxuXG4gICAgY2hlY2tDb3JyZWN0T3JkZXJpbmcoc29sdXRpb25MaW5lcywgYW5zd2VyTGluZXMpIHtcbiAgICAgICAgbGV0IGlzQ29ycmVjdE9yZGVyID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jb3JyZWN0TGluZXMgPSAwO1xuICAgICAgICB0aGlzLnNvbHV0aW9uTGVuZ3RoID0gc29sdXRpb25MaW5lcy5sZW5ndGg7XG4gICAgICAgIGxldCBsb29wTGltaXQgPSBNYXRoLm1pbihzb2x1dGlvbkxpbmVzLmxlbmd0aCwgYW5zd2VyTGluZXMubGVuZ3RoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb29wTGltaXQ7IGkrKykge1xuICAgICAgICAgICAgaWYgKGFuc3dlckxpbmVzW2ldLnRleHQgIT09IHNvbHV0aW9uTGluZXNbaV0udGV4dCkge1xuICAgICAgICAgICAgICAgIGlzQ29ycmVjdE9yZGVyID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdExpbmVzICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzQ29ycmVjdE9yZGVyXG4gICAgfVxuXG4gICAgY2FsY3VsYXRlUGVyY2VudCgpIHtcbiAgICAgICAgbGV0IG51bUxpbmVzID0gdGhpcy5wZXJjZW50TGluZXMgKiAwLjI7XG4gICAgICAgIGxldCBsaW5lcyA9IHRoaXMucHJvYmxlbS5hbnN3ZXJMaW5lcygpLmxlbmd0aDtcbiAgICAgICAgbGV0IG51bUNvcnJlY3RCbG9ja3MgPSAodGhpcy5jb3JyZWN0TGluZXMgLyBsaW5lcykgKiAwLjQ7XG4gICAgICAgIGxldCBudW1Db3JyZWN0SW5kZW50cyA9XG4gICAgICAgICAgICAoKHRoaXMuY29ycmVjdExpbmVzIC0gdGhpcy5pbmNvcnJlY3RJbmRlbnRzKSAvIGxpbmVzKSAqIDAuNDtcblxuICAgICAgICB0aGlzLnByb2JsZW0ucGVyY2VudCA9IG51bUxpbmVzICsgbnVtQ29ycmVjdEJsb2NrcyArIG51bUNvcnJlY3RJbmRlbnRzO1xuICAgIH1cbn1cbiIsIiQuaTE4bigpLmxvYWQoe1xuICAgIGVuOiB7XG4gICAgICAgIG1zZ19wYXJzb25fY2hlY2tfbWU6IFwiQ2hlY2tcIixcbiAgICAgICAgbXNnX3BhcnNvbl9yZXNldDogXCJSZXNldFwiLFxuICAgICAgICBtc2dfcGFyc29uX2hlbHA6IFwiSGVscCBtZVwiLFxuICAgICAgICBtc2dfcGFyc29uX3Rvb19zaG9ydDogXCJZb3VyIGFuc3dlciBpcyB0b28gc2hvcnQuIEFkZCBtb3JlIGJsb2Nrcy5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9kcmFnX2Zyb21faGVyZTogXCJEcmFnIGZyb20gaGVyZVwiLFxuICAgICAgICBtc2dfcGFyc29uX2RyYWdfdG9faGVyZTogXCJEcm9wIGJsb2NrcyBoZXJlXCIsXG4gICAgICAgIG1zZ19wYXJzb25fY29ycmVjdF9maXJzdF90cnk6XG4gICAgICAgICAgICBcIlBlcmZlY3QhICBJdCB0b29rIHlvdSBvbmx5IG9uZSB0cnkgdG8gc29sdmUgdGhpcy4gIEdyZWF0IGpvYiFcIixcbiAgICAgICAgbXNnX3BhcnNvbl9jb3JyZWN0OlxuICAgICAgICAgICAgXCJQZXJmZWN0ISAgSXQgdG9vayB5b3UgJDEgdHJpZXMgdG8gc29sdmUgdGhpcy4gIENsaWNrIFJlc2V0IHRvIHRyeSB0byBzb2x2ZSBpdCBpbiBvbmUgYXR0ZW1wdC5cIixcbiAgICAgICAgbXNnX3BhcnNvbl93cm9uZ19pbmRlbnQ6XG4gICAgICAgICAgICBcIlRoaXMgYmxvY2sgaXMgbm90IGluZGVudGVkIGNvcnJlY3RseS4gRWl0aGVyIGluZGVudCBpdCBtb3JlIGJ5IGRyYWdnaW5nIGl0IHJpZ2h0IG9yIHJlZHVjZSB0aGUgaW5kZW50aW9uIGJ5IGRyYWdnaW5nIGl0IGxlZnQuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd3JvbmdfaW5kZW50czpcbiAgICAgICAgICAgIFwiVGhlc2UgYmxvY2tzIGFyZSBub3QgaW5kZW50ZWQgY29ycmVjdGx5LiBUbyBpbmRlbnQgYSBibG9jayBtb3JlLCBkcmFnIGl0IHRvIHRoZSByaWdodC4gVG8gcmVkdWNlIHRoZSBpbmRlbnRpb24sIGRyYWcgaXQgdG8gdGhlIGxlZnQuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd3Jvbmdfb3JkZXI6XG4gICAgICAgICAgICBcIkhpZ2hsaWdodGVkIGJsb2NrcyBpbiB5b3VyIGFuc3dlciBhcmUgd3Jvbmcgb3IgYXJlIGluIHRoZSB3cm9uZyBvcmRlci4gVGhpcyBjYW4gYmUgZml4ZWQgYnkgbW92aW5nLCByZW1vdmluZywgb3IgcmVwbGFjaW5nIGhpZ2hsaWdodGVkIGJsb2Nrcy5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9hcnJvd19uYXZpZ2F0ZTpcbiAgICAgICAgICAgIFwiQXJyb3cga2V5cyB0byBuYXZpZ2F0ZS4gU3BhY2UgdG8gc2VsZWN0IC8gZGVzZWxlY3QgYmxvY2sgdG8gbW92ZS5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9oZWxwX2luZm86XG4gICAgICAgICAgICBcIkNsaWNrIG9uIHRoZSBIZWxwIE1lIGJ1dHRvbiBpZiB5b3Ugd2FudCB0byBtYWtlIHRoZSBwcm9ibGVtIGVhc2llclwiLFxuICAgICAgICBtc2dfcGFyc29uX25vdF9zb2x1dGlvbjpcbiAgICAgICAgICAgIFwiRGlzYWJsZWQgYW4gdW5uZWVkZWQgY29kZSBibG9jayAob25lIHRoYXQgaXMgbm90IHBhcnQgb2YgdGhlIHNvbHV0aW9uKS5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9wcm92aWRlZF9pbmRlbnQ6IFwiUHJvdmlkZWQgdGhlIGluZGVudGF0aW9uLlwiLFxuICAgICAgICBtc2dfcGFyc29uX2NvbWJpbmVkX2Jsb2NrczogXCJDb21iaW5lZCB0d28gY29kZSBibG9ja3MgaW50byBvbmUuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fcmVtb3ZlX2luY29ycmVjdDpcbiAgICAgICAgICAgIFwiV2lsbCByZW1vdmUgYW4gaW5jb3JyZWN0IGNvZGUgYmxvY2sgZnJvbSBhbnN3ZXIgYXJlYVwiLFxuICAgICAgICBtc2dfcGFyc29uX3dpbGxfY29tYmluZTogXCJXaWxsIGNvbWJpbmUgdHdvIGJsb2Nrc1wiLFxuICAgICAgICBtc2dfcGFyc29uX2F0bGVhc3RfdGhyZWVfYXR0ZW1wdHM6XG4gICAgICAgICAgICBcIllvdSBtdXN0IG1ha2UgYXQgbGVhc3QgdGhyZWUgZGlzdGluY3QgZnVsbCBhdHRlbXB0cyBhdCBhIHNvbHV0aW9uIGJlZm9yZSB5b3UgY2FuIGdldCBoZWxwXCIsXG4gICAgICAgIG1zZ19wYXJzb25fdGhyZWVfYmxvY2tzX2xlZnQ6XG4gICAgICAgICAgICBcIlRoZXJlIGFyZSBvbmx5IDMgY29ycmVjdCBibG9ja3MgbGVmdC4gIFlvdSBzaG91bGQgYmUgYWJsZSB0byBwdXQgdGhlbSBpbiBvcmRlclwiLFxuICAgICAgICBtc2dfcGFyc29uX3dpbGxfcHJvdmlkZV9pbmRlbnQ6IFwiV2lsbCBwcm92aWRlIGluZGVudGF0aW9uXCIsXG4gICAgfSxcbn0pO1xuIiwiJC5pMThuKCkubG9hZCh7XG4gICAgXCJwdC1iclwiOiB7XG4gICAgICAgIG1zZ19wYXJzb25fY2hlY2tfbWU6IFwiVmVyaWZpY2FyXCIsXG4gICAgICAgIG1zZ19wYXJzb25fcmVzZXQ6IFwiUmVzZXRhclwiLFxuICAgICAgICBtc2dfcGFyc29uX2hlbHA6XCJBanVkYVwiLFxuICAgICAgICBtc2dfcGFyc29uX3Rvb19zaG9ydDogXCJTZXUgcHJvZ3JhbWEgw6kgbXVpdG8gY3VydG8uIEFkaWNpb25lIG1haXMgYmxvY29zLlwiLFxuICAgICAgICBtc2dfcGFyc29uX2RyYWdfZnJvbV9oZXJlOiBcIkFycmFzdGUgZGFxdWlcIixcbiAgICAgICAgbXNnX3BhcnNvbl9kcmFnX3RvX2hlcmU6IFwiTGFyZ3VlIG9zIGJsb2NvcyBhcXVpXCIsXG4gICAgICAgIG1zZ19wYXJzb25fY29ycmVjdF9maXJzdF90cnk6XG4gICAgICAgICAgICBcIlBlcmZlaXRvISBWb2PDqiBsZXZvdSBhcGVuYXMgdW1hIHRlbnRhdGl2YSBwYXJhIHJlc29sdmVyLiBCb20gdHJhYmFsaG8hXCIsXG4gICAgICAgIG1zZ19wYXJzb25fY29ycmVjdDpcbiAgICAgICAgICAgIFwiUGVyZmVpdG8hIFZvY8OqIGxldm91ICQxIHRlbnRhdGl2YXMgcGFyYSByZXNvbHZlci4gQ2xpcXVlIGVtIFJlc2V0YXIgcGFyYSB0ZW50YXIgcmVzb2x2ZXIgZW0gdW1hIHRlbnRhdGl2YS5cIiAsXG4gICAgICAgIG1zZ19wYXJzb25fd3JvbmdfaW5kZW50OlxuICAgICAgICAgICAgXCJFc3RlIGJsb2NvIG7Do28gZXN0w6EgaW5kZW50YWRvIGNvcnJldGFtZW50ZS4gSW5kZW50ZSBtYWlzIGFycmFzdGFuZG8tbyBwYXJhIGEgZGlyZWl0YSBvdSByZWR1emEgYSBpbmRlbnRhw6fDo28gYXJyYXN0YW5kbyBwYXJhIGEgZXNxdWVyZGEuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd3JvbmdfaW5kZW50czpcbiAgICAgICAgICAgIFwiRXN0ZXMgYmxvY29zIG7Do28gZXN0w6NvIGluZGVudGFkb3MgY29ycmV0YW1lbnRlLiBQYXJhIGluZGVudGFyIG1haXMsIGFycmFzdGUgbyBibG9jbyBwYXJhIGEgZGlyZWl0YS4gUGFyYSByZWR1emlyIGEgaW5kZW50YcOnw6NvLCBhcnJhc3RlIHBhcmEgYSBlc3F1ZXJkYS5cIixcbiAgICAgICAgbXNnX3BhcnNvbl93cm9uZ19vcmRlcjpcbiAgICAgICAgICAgIFwiQmxvY29zIGRlc3RhY2Fkb3Mgbm8gc2V1IHByb2dyYW1hIGVzdMOjbyBlcnJhZG9zIG91IGVzdMOjbyBuYSBvcmRlbSBlcnJhZGEuIElzc28gcG9kZSBzZXIgcmVzb2x2aWRvIG1vdmVuZG8sIGV4Y2x1aW5kbyBvdSBzdWJzdGl0dWluZG8gb3MgYmxvY29zIGRlc3RhY2Fkb3MuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fYXJyb3dfbmF2aWdhdGU6XG4gICAgICAgICAgICBcIlVzZSBhcyB0ZWNsYXMgZGUgc2V0YXMgcGFyYSBuYXZlZ2FyLiBFc3Bhw6dvIHBhcmEgc2VsZWNpb25hci8gZGVzbWFyY2FyIGJsb2NvcyBwYXJhIG1vdmVyLlwiLFxuICAgICAgICBtc2dfcGFyc29uX2hlbHBfaW5mbzpcbiAgICAgICAgICAgIFwiQ2xpcXVlIG5vIGJvdMOjbyBBanVkYSBzZSB2b2PDqiBxdWlzZXIgZmFjaWxpdGFyIG8gcHJvYmxlbWFcIixcbiAgICAgICAgbXNnX3BhcnNvbl9ub3Rfc29sdXRpb246XG4gICAgICAgICAgICBcIkZvaSBkZXNhYmlsaXRhZG8gdW0gYmxvY28gZGUgY8OzZGlnbyBkZXNuZWNlc3PDoXJpbyAocXVlIG7Do28gZmF6IHBhcnRlIGRhIHNvbHXDp8OjbykuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fcHJvdmlkZWRfaW5kZW50OlwiRm9pIGZvcm5lY2lkYSBhIGluZGVudGHDp8Ojby5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9jb21iaW5lZF9ibG9ja3M6XCJEb2lzIGJsb2NvcyBkZSBjw7NkaWdvcyBmb3JhbSBjb21iaW5hZG9zIGVtIHVtLlwiLFxuICAgICAgICBtc2dfcGFyc29uX3JlbW92ZV9pbmNvcnJlY3Q6XG4gICAgICAgICAgICBcIlNlcsOhIHJlbW92aWRvIHVtIGJsb2NvIGRlIGPDs2RpZ28gaW5jb3JyZXRvIGRhIMOhcmVhIGRlIHJlc3Bvc3RhXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd2lsbF9jb21iaW5lOlwiU2Vyw6NvIGNvbWJpbmFkb3MgZG9pcyBibG9jb3NcIixcbiAgICAgICAgbXNnX3BhcnNvbl9hdGxlYXN0X3RocmVlX2F0dGVtcHRzOlxuICAgICAgICAgICAgXCJWb2PDqiBkZXZlIHRlbnRhciBwZWxvIG1lbm9zIHRyw6pzIHZlemVzIGFudGVzIGRlIHBlZGlyIGFqdWRhXCIsXG4gICAgICAgIG1zZ19wYXJzb25fdGhyZWVfYmxvY2tzX2xlZnQ6XG4gICAgICAgICAgICBcIlJlc3RhbSBhcGVuYXMgMyBibG9jb3MgY29ycmV0b3MuIFZvY8OqIGRldmUgY29sb2PDoS1sb3MgZW0gb3JkZW1cIixcbiAgICAgICAgbXNnX3BhcnNvbl93aWxsX3Byb3ZpZGVfaW5kZW50OiBcIlNlcsOhIGZvcm5lY2lkYSBhIGluZGVudGHDp8Ojb1wiXG4gICAgfSxcbn0pO1xuIiwiLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09IFBhcnNvbnMgUnVuZXN0b25lIERpcmVjdGl2ZSBKYXZhc2NyaXB0ID09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09IFJlbmRlcnMgYSBQYXJzb25zIHByb2JsZW0gYmFzZWQgb24gdGhlIEhUTUwgY3JlYXRlZCBieSB0aGVcbj09PT09PT09IHBhcnNvbnMucHkgc2NyaXB0IGFuZCB0aGUgUlNUIGZpbGUuXG49PT09IENPTlRSSUJVVE9SUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09IElzYWlhaCBNYXllcmNoYWtcbj09PT09PT09IEplZmYgUmlja1xuPT09PT09PT0gQmFyYmFyYSBFcmljc29uXG49PT09PT09PSBDb2xlIEJvd2Vyc1xuPT09PSBBZGFwdGVkIGZvcm0gdGhlIG9yaWdpbmFsIEpTIFBhcnNvbnMgYnkgPT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09PSBWaWxsZSBLYXJhdmlydGFcbj09PT09PT09IFBldHJpIEloYW50b2xhXG49PT09PT09PSBKdWhhIEhlbG1pbmVuXG49PT09PT09PSBNaWtlIEhld25lclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT0gTGluZUJhc2VkR3JhZGVyIE9iamVjdCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gVXNlZCBmb3IgZ3JhZGluZyBhIFBhcnNvbnMgcHJvYmxlbS5cbj09PT0gUFJPUEVSVElFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gcHJvYmxlbTogdGhlIFBhcnNvbnMgcHJvYmxlbVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlLmpzXCI7XG5pbXBvcnQgXCIuL3BhcnNvbnMtaTE4bi5lbi5qc1wiO1xuaW1wb3J0IFwiLi9wYXJzb25zLWkxOG4ucHQtYnIuanNcIjtcbmltcG9ydCBcIi4vcHJldHRpZnkuanNcIjtcbmltcG9ydCBcIi4uL2Nzcy9wYXJzb25zLmNzc1wiO1xuaW1wb3J0IFwiLi4vY3NzL3ByZXR0aWZ5LmNzc1wiO1xuaW1wb3J0IExpbmVCYXNlZEdyYWRlciBmcm9tIFwiLi9saW5lR3JhZGVyXCI7XG5pbXBvcnQgREFHR3JhZGVyIGZyb20gXCIuL2RhZ0dyYWRlclwiO1xuaW1wb3J0IFBhcnNvbnNMaW5lIGZyb20gXCIuL3BhcnNvbnNMaW5lXCI7XG5pbXBvcnQgUGFyc29uc0Jsb2NrIGZyb20gXCIuL3BhcnNvbnNCbG9ja1wiO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT0gUGFyc29ucyBPYmplY3QgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gVGhlIG1vZGVsIGFuZCB2aWV3IG9mIGEgUGFyc29ucyBwcm9ibGVtIGJhc2VkIG9uIHdoYXQgaXNcbj09PT09PT09IHNwZWNpZmllZCBpbiB0aGUgSFRNTCwgd2hpY2ggaXMgYmFzZWQgb24gd2hhdCBpcyBzcGVjaWZpZWRcbj09PT09PT09IGluIHRoZSBSU1QgZmlsZVxuPT09PSBQUk9QRVJUSUVTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09PSBvcHRpb25zOiBvcHRpb25zIGxhcmdlbHkgc3BlY2lmaWVkIGZyb20gdGhlIEhUTUxcbj09PT09PT09IGdyYWRlcjogYSBMaW5lR3JhZGVyIGZvciBncmFkaW5nIHRoZSBwcm9ibGVtXG49PT09PT09PSBsaW5lczogYW4gYXJyYXkgb2YgYWxsIFBhcnNvbnNMaW5lIGFzIHNwZWNpZmllZCBpbiB0aGUgcHJvYmxlbVxuPT09PT09PT0gc29sdXRpb246IGFuIGFycmF5IG9mIFBhcnNvbnNMaW5lIGluIHRoZSBzb2x1dGlvblxuPT09PT09PT0gYmxvY2tzOiB0aGUgY3VycmVudCBibG9ja3Ncbj09PT09PT09IHNvdXJjZUFyZWE6IHRoZSBlbGVtZW50IHRoYXQgY29udGFpbnMgdGhlIHNvdXJjZSBibG9ja3Ncbj09PT09PT09IGFuc3dlckFyZWE6IHRoZSBlbGVtZW50IHRoYXQgY29udGFpbnMgdGhlIGFuc3dlciBibG9ja3Ncbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT0gSU5JVElBTElaQVRJT04gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbmV4cG9ydCB2YXIgcHJzTGlzdCA9IHt9OyAvLyBQYXJzb25zIGRpY3Rpb25hcnlcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnNvbnMgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB2YXIgb3JpZyA9IG9wdHMub3JpZzsgLy8gZW50aXJlIDxwcmU+IGVsZW1lbnQgdGhhdCB3aWxsIGJlIHJlcGxhY2VkIGJ5IG5ldyBIVE1MXG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2ID0gb3JpZztcbiAgICAgICAgdGhpcy5vcmlnRWxlbSA9ICQob3JpZykuZmluZChcInByZS5wYXJzb25zYmxvY2tzXCIpWzBdO1xuICAgICAgICAvLyBGaW5kIHRoZSBxdWVzdGlvbiB0ZXh0IGFuZCBzdG9yZSBpdCBpbiAucXVlc3Rpb25cbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9ICQob3JpZykuZmluZChgLnBhcnNvbnNfcXVlc3Rpb25gKVswXTtcbiAgICAgICAgdGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcyA9IG9wdHMudXNlUnVuZXN0b25lU2VydmljZXM7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcHRzLm9yaWcuaWQ7XG4gICAgICAgIC8vIFNldCB0aGUgc3RvcmFnZUlkIChrZXkgZm9yIHN0b3JpbmcgZGF0YSlcbiAgICAgICAgdmFyIHN0b3JhZ2VJZCA9IHN1cGVyLmxvY2FsU3RvcmFnZUtleSgpO1xuICAgICAgICB0aGlzLnN0b3JhZ2VJZCA9IHN0b3JhZ2VJZDtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IHRoaXMub3JpZ0VsZW0uY2hpbGROb2RlczsgLy8gdGhpcyBjb250YWlucyBhbGwgb2YgdGhlIGNoaWxkIGVsZW1lbnRzIG9mIHRoZSBlbnRpcmUgdGFnLi4uXG4gICAgICAgIHRoaXMuY29udGVudEFycmF5ID0gW107XG4gICAgICAgIFBhcnNvbnMuY291bnRlcisrOyAvLyAgICBVbmlxdWUgaWRlbnRpZmllclxuICAgICAgICB0aGlzLmNvdW50ZXJJZCA9IFwicGFyc29ucy1cIiArIFBhcnNvbnMuY291bnRlcjtcblxuICAgICAgICAvLyBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gICAgIGlmICgkKHRoaXMuY2hpbGRyZW5baV0pLmlzKFwiW2RhdGEtcXVlc3Rpb25dXCIpKSB7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5xdWVzdGlvbiA9IHRoaXMuY2hpbGRyZW5baV07XG4gICAgICAgIC8vICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH1cbiAgICAgICAgdGhpcy5pbml0aWFsaXplT3B0aW9ucygpO1xuICAgICAgICB0aGlzLmdyYWRlciA9XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZ3JhZGVyID09PSBcImRhZ1wiID9cbiAgICAgICAgICAgIG5ldyBEQUdHcmFkZXIodGhpcykgOlxuICAgICAgICAgICAgbmV3IExpbmVCYXNlZEdyYWRlcih0aGlzKTtcbiAgICAgICAgdGhpcy5ncmFkZXIuc2hvd2ZlZWRiYWNrID0gdGhpcy5zaG93ZmVlZGJhY2s7XG4gICAgICAgIHZhciBmdWxsdGV4dCA9ICQodGhpcy5vcmlnRWxlbSkuaHRtbCgpO1xuICAgICAgICB0aGlzLmJsb2NrSW5kZXggPSAwO1xuICAgICAgICB0aGlzLmNoZWNrQ291bnQgPSAwO1xuICAgICAgICB0aGlzLm51bURpc3RpbmN0ID0gMDtcbiAgICAgICAgdGhpcy5oYXNTb2x2ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplTGluZXMoZnVsbHRleHQudHJpbSgpKTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplVmlldygpO1xuICAgICAgICB0aGlzLmNhcHRpb24gPSBcIlBhcnNvbnNcIjtcbiAgICAgICAgdGhpcy5hZGRDYXB0aW9uKFwicnVuZXN0b25lXCIpO1xuICAgICAgICAvLyBDaGVjayB0aGUgc2VydmVyIGZvciBhbiBhbnN3ZXIgdG8gY29tcGxldGUgdGhpbmdzXG4gICAgICAgIHRoaXMuY2hlY2tTZXJ2ZXIoXCJwYXJzb25zXCIsIHRydWUpO1xuICAgICAgICBpZiAodHlwZW9mIFByaXNtICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBQcmlzbS5oaWdobGlnaHRBbGxVbmRlcih0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQmFzZWQgb24gdGhlIGRhdGEtZmllbGRzIGluIHRoZSBvcmlnaW5hbCBIVE1MLCBpbml0aWFsaXplIG9wdGlvbnNcbiAgICBpbml0aWFsaXplT3B0aW9ucygpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBwaXhlbHNQZXJJbmRlbnQ6IDMwLFxuICAgICAgICB9O1xuICAgICAgICAvLyBhZGQgbWF4ZGlzdCBhbmQgb3JkZXIgaWYgcHJlc2VudFxuICAgICAgICB2YXIgbWF4ZGlzdCA9ICQodGhpcy5vcmlnRWxlbSkuZGF0YShcIm1heGRpc3RcIik7XG4gICAgICAgIHZhciBvcmRlciA9ICQodGhpcy5vcmlnRWxlbSkuZGF0YShcIm9yZGVyXCIpO1xuICAgICAgICB2YXIgbm9pbmRlbnQgPSAkKHRoaXMub3JpZ0VsZW0pLmRhdGEoXCJub2luZGVudFwiKTtcbiAgICAgICAgdmFyIGFkYXB0aXZlID0gJCh0aGlzLm9yaWdFbGVtKS5kYXRhKFwiYWRhcHRpdmVcIik7XG4gICAgICAgIHZhciBudW1iZXJlZCA9ICQodGhpcy5vcmlnRWxlbSkuZGF0YShcIm51bWJlcmVkXCIpO1xuICAgICAgICB2YXIgZ3JhZGVyID0gJCh0aGlzLm9yaWdFbGVtKS5kYXRhKFwiZ3JhZGVyXCIpO1xuICAgICAgICBvcHRpb25zW1wibnVtYmVyZWRcIl0gPSBudW1iZXJlZDtcbiAgICAgICAgb3B0aW9uc1tcImdyYWRlclwiXSA9IGdyYWRlcjtcbiAgICAgICAgaWYgKG1heGRpc3QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgb3B0aW9uc1tcIm1heGRpc3RcIl0gPSBtYXhkaXN0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcmRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBjb252ZXJ0IG9yZGVyIHN0cmluZyB0byBhcnJheSBvZiBudW1iZXJzXG4gICAgICAgICAgICBvcmRlciA9IG9yZGVyLm1hdGNoKC9cXGQrL2cpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcmRlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG9yZGVyW2ldID0gcGFyc2VJbnQob3JkZXJbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3B0aW9uc1tcIm9yZGVyXCJdID0gb3JkZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vaW5kZW50ID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbm9pbmRlbnQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zW1wibm9pbmRlbnRcIl0gPSBub2luZGVudDtcbiAgICAgICAgdGhpcy5ub2luZGVudCA9IG5vaW5kZW50O1xuICAgICAgICBpZiAoYWRhcHRpdmUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBhZGFwdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKGFkYXB0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVBZGFwdGl2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnNbXCJhZGFwdGl2ZVwiXSA9IGFkYXB0aXZlO1xuICAgICAgICAvLyBhZGQgbG9jYWxlIGFuZCBsYW5ndWFnZVxuICAgICAgICB2YXIgbG9jYWxlID0gZUJvb2tDb25maWcubG9jYWxlO1xuICAgICAgICBpZiAobG9jYWxlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbG9jYWxlID0gXCJlblwiO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnNbXCJsb2NhbGVcIl0gPSBsb2NhbGU7XG4gICAgICAgIHZhciBsYW5ndWFnZSA9ICQodGhpcy5vcmlnRWxlbSkuZGF0YShcImxhbmd1YWdlXCIpO1xuICAgICAgICBpZiAobGFuZ3VhZ2UgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBsYW5ndWFnZSA9IGVCb29rQ29uZmlnLmxhbmd1YWdlO1xuICAgICAgICAgICAgaWYgKGxhbmd1YWdlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGxhbmd1YWdlID0gXCJweXRob25cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zW1wibGFuZ3VhZ2VcIl0gPSBsYW5ndWFnZTtcbiAgICAgICAgdmFyIHByZXR0aWZ5TGFuZ3VhZ2UgPSB7XG4gICAgICAgICAgICBweXRob246IFwicHJldHR5cHJpbnQgbGFuZy1weVwiLFxuICAgICAgICAgICAgamF2YTogXCJwcmV0dHlwcmludCBsYW5nLWphdmFcIixcbiAgICAgICAgICAgIGphdmFzY3JpcHQ6IFwicHJldHR5cHJpbnQgbGFuZy1qc1wiLFxuICAgICAgICAgICAgaHRtbDogXCJwcmV0dHlwcmludCBsYW5nLWh0bWxcIixcbiAgICAgICAgICAgIGM6IFwicHJldHR5cHJpbnQgbGFuZy1jXCIsXG4gICAgICAgICAgICBcImMrK1wiOiBcInByZXR0eXByaW50IGxhbmctY3BwXCIsXG4gICAgICAgICAgICBydWJ5OiBcInByZXR0eXByaW50IGxhbmctcmJcIixcbiAgICAgICAgfSBbbGFuZ3VhZ2VdO1xuICAgICAgICBpZiAocHJldHRpZnlMYW5ndWFnZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHByZXR0aWZ5TGFuZ3VhZ2UgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnNbXCJwcmV0dGlmeUxhbmd1YWdlXCJdID0gcHJldHRpZnlMYW5ndWFnZTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB9XG4gICAgLy8gQmFzZWQgb24gd2hhdCBpcyBzcGVjaWZpZWQgaW4gdGhlIG9yaWdpbmFsIEhUTUwsIGNyZWF0ZSB0aGUgSFRNTCB2aWV3XG4gICAgaW5pdGlhbGl6ZVZpZXcoKSB7XG4gICAgICAgIHRoaXMub3V0ZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAkKHRoaXMub3V0ZXJEaXYpLmFkZENsYXNzKFwicGFyc29uc1wiKTtcbiAgICAgICAgdGhpcy5vdXRlckRpdi5pZCA9IHRoaXMuY291bnRlcklkO1xuICAgICAgICB0aGlzLnBhcnNUZXh0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgJCh0aGlzLnBhcnNUZXh0RGl2KS5hZGRDbGFzcyhcInBhcnNvbnMtdGV4dFwiKTtcbiAgICAgICAgdGhpcy5rZXlib2FyZFRpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICQodGhpcy5rZXlib2FyZFRpcCkuYXR0cihcInJvbGVcIiwgXCJ0b29sdGlwXCIpO1xuICAgICAgICB0aGlzLmtleWJvYXJkVGlwLmlkID0gdGhpcy5jb3VudGVySWQgKyBcIi10aXBcIjtcbiAgICAgICAgdGhpcy5rZXlib2FyZFRpcC5pbm5lckhUTUwgPSAkLmkxOG4oXCJtc2dfcGFyc29uX2Fycm93X25hdmlnYXRlXCIpO1xuICAgICAgICB0aGlzLm91dGVyRGl2LmFwcGVuZENoaWxkKHRoaXMua2V5Ym9hcmRUaXApO1xuICAgICAgICAkKHRoaXMua2V5Ym9hcmRUaXApLmhpZGUoKTtcbiAgICAgICAgdGhpcy5zb3J0Q29udGFpbmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgJCh0aGlzLnNvcnRDb250YWluZXJEaXYpLmFkZENsYXNzKFwic29ydGFibGUtY29kZS1jb250YWluZXJcIik7XG4gICAgICAgICQodGhpcy5zb3J0Q29udGFpbmVyRGl2KS5hdHRyKFxuICAgICAgICAgICAgXCJhcmlhLWRlc2NyaWJlZGJ5XCIsXG4gICAgICAgICAgICB0aGlzLmNvdW50ZXJJZCArIFwiLXRpcFwiXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMub3V0ZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5zb3J0Q29udGFpbmVyRGl2KTtcbiAgICAgICAgdGhpcy5zb3VyY2VSZWdpb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLnNvdXJjZVJlZ2lvbkRpdi5pZCA9IHRoaXMuY291bnRlcklkICsgXCItc291cmNlUmVnaW9uXCI7XG4gICAgICAgICQodGhpcy5zb3VyY2VSZWdpb25EaXYpLmFkZENsYXNzKFwic29ydGFibGUtY29kZVwiKTtcbiAgICAgICAgdGhpcy5zb3VyY2VMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICQodGhpcy5zb3VyY2VMYWJlbCkuYXR0cihcInJvbGVcIiwgXCJ0b29sdGlwXCIpO1xuICAgICAgICB0aGlzLnNvdXJjZUxhYmVsLmlkID0gdGhpcy5jb3VudGVySWQgKyBcIi1zb3VyY2VUaXBcIjtcbiAgICAgICAgdGhpcy5zb3VyY2VMYWJlbC5pbm5lckhUTUwgPSAkLmkxOG4oXCJtc2dfcGFyc29uX2RyYWdfZnJvbV9oZXJlXCIpO1xuICAgICAgICB0aGlzLnNvdXJjZVJlZ2lvbkRpdi5hcHBlbmRDaGlsZCh0aGlzLnNvdXJjZUxhYmVsKTtcbiAgICAgICAgdGhpcy5zb3J0Q29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuc291cmNlUmVnaW9uRGl2KTtcbiAgICAgICAgdGhpcy5zb3VyY2VBcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5zb3VyY2VBcmVhLmlkID0gdGhpcy5jb3VudGVySWQgKyBcIi1zb3VyY2VcIjtcbiAgICAgICAgJCh0aGlzLnNvdXJjZUFyZWEpLmFkZENsYXNzKFwic291cmNlXCIpO1xuICAgICAgICAkKHRoaXMuc291cmNlQXJlYSkuYXR0cihcbiAgICAgICAgICAgIFwiYXJpYS1kZXNjcmliZWRieVwiLFxuICAgICAgICAgICAgdGhpcy5jb3VudGVySWQgKyBcIi1zb3VyY2VUaXBcIlxuICAgICAgICApO1xuICAgICAgICAvLyBzZXQgdGhlIHNvdXJjZSB3aWR0aCB0byBpdHMgbWF4IHZhbHVlLiAgVGhpcyBhbGxvd3MgdGhlIGJsb2NrcyB0byBiZSBjcmVhdGVkXG4gICAgICAgIC8vIGF0IHRoZWlyIFwibmF0dXJhbFwiIHNpemUuIEFzIGxvbmcgYXMgdGhhdCBpcyBzbWFsbGVyIHRoYW4gdGhlIG1heC5cbiAgICAgICAgLy8gVGhpcyBhbGxvd3MgdXMgdG8gdXNlIHNlbnNpYmxlIGZ1bmN0aW9ucyB0byBkZXRlcm1pbmUgdGhlIGNvcnJlY3QgaGVpZ2h0c1xuICAgICAgICAvLyBhbmQgd2lkdGhzIGZvciB0aGUgZHJhZyBhbmQgZHJvcCBhcmVhcy5cbiAgICAgICAgdGhpcy5zb3VyY2VBcmVhLnN0eWxlLndpZHRoID0gXCI0MjVweFwiIC8vIFRoZSBtYXggaXQgd2lsbCBiZSByZXNpemVkIGxhdGVyLlxuICAgICAgICB0aGlzLnNvdXJjZVJlZ2lvbkRpdi5hcHBlbmRDaGlsZCh0aGlzLnNvdXJjZUFyZWEpO1xuICAgICAgICB0aGlzLmFuc3dlclJlZ2lvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuYW5zd2VyUmVnaW9uRGl2LmlkID0gdGhpcy5jb3VudGVySWQgKyBcIi1hbnN3ZXJSZWdpb25cIjtcbiAgICAgICAgJCh0aGlzLmFuc3dlclJlZ2lvbkRpdikuYWRkQ2xhc3MoXCJzb3J0YWJsZS1jb2RlXCIpO1xuICAgICAgICB0aGlzLmFuc3dlckxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgJCh0aGlzLmFuc3dlckxhYmVsKS5hdHRyKFwicm9sZVwiLCBcInRvb2x0aXBcIik7XG4gICAgICAgIHRoaXMuYW5zd2VyTGFiZWwuaWQgPSB0aGlzLmNvdW50ZXJJZCArIFwiLWFuc3dlclRpcFwiO1xuICAgICAgICB0aGlzLmFuc3dlckxhYmVsLmlubmVySFRNTCA9ICQuaTE4bihcIm1zZ19wYXJzb25fZHJhZ190b19oZXJlXCIpO1xuICAgICAgICB0aGlzLmFuc3dlclJlZ2lvbkRpdi5hcHBlbmRDaGlsZCh0aGlzLmFuc3dlckxhYmVsKTtcbiAgICAgICAgdGhpcy5zb3J0Q29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuYW5zd2VyUmVnaW9uRGl2KTtcbiAgICAgICAgdGhpcy5hbnN3ZXJBcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5hbnN3ZXJBcmVhLmlkID0gdGhpcy5jb3VudGVySWQgKyBcIi1hbnN3ZXJcIjtcbiAgICAgICAgJCh0aGlzLmFuc3dlckFyZWEpLmF0dHIoXG4gICAgICAgICAgICBcImFyaWEtZGVzY3JpYmVkYnlcIixcbiAgICAgICAgICAgIHRoaXMuY291bnRlcklkICsgXCItYW5zd2VyVGlwXCJcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5hbnN3ZXJSZWdpb25EaXYuYXBwZW5kQ2hpbGQodGhpcy5hbnN3ZXJBcmVhKTtcbiAgICAgICAgdGhpcy5wYXJzb25zQ29udHJvbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICQodGhpcy5wYXJzb25zQ29udHJvbERpdikuYWRkQ2xhc3MoXCJwYXJzb25zLWNvbnRyb2xzXCIpO1xuICAgICAgICB0aGlzLm91dGVyRGl2LmFwcGVuZENoaWxkKHRoaXMucGFyc29uc0NvbnRyb2xEaXYpO1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2hlY2tCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAkKHRoaXMuY2hlY2tCdXR0b24pLmF0dHIoXCJjbGFzc1wiLCBcImJ0biBidG4tc3VjY2Vzc1wiKTtcbiAgICAgICAgdGhpcy5jaGVja0J1dHRvbi50ZXh0Q29udGVudCA9ICQuaTE4bihcIm1zZ19wYXJzb25fY2hlY2tfbWVcIik7XG4gICAgICAgIHRoaXMuY2hlY2tCdXR0b24uaWQgPSB0aGlzLmNvdW50ZXJJZCArIFwiLWNoZWNrXCI7XG4gICAgICAgIHRoaXMucGFyc29uc0NvbnRyb2xEaXYuYXBwZW5kQ2hpbGQodGhpcy5jaGVja0J1dHRvbik7XG4gICAgICAgIHRoaXMuY2hlY2tCdXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgIHRoaXMuY2hlY2tCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhhdC5jaGVja0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgICAgIHRoYXQubG9nQ3VycmVudEFuc3dlcigpO1xuICAgICAgICAgICAgdGhhdC5yZW5kZXJGZWVkYmFjaygpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZXNldEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICQodGhpcy5yZXNldEJ1dHRvbikuYXR0cihcImNsYXNzXCIsIFwiYnRuIGJ0bi1kZWZhdWx0XCIpO1xuICAgICAgICB0aGlzLnJlc2V0QnV0dG9uLnRleHRDb250ZW50ID0gJC5pMThuKFwibXNnX3BhcnNvbl9yZXNldFwiKTtcbiAgICAgICAgdGhpcy5yZXNldEJ1dHRvbi5pZCA9IHRoaXMuY291bnRlcklkICsgXCItcmVzZXRcIjtcbiAgICAgICAgdGhpcy5yZXNldEJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgdGhpcy5wYXJzb25zQ29udHJvbERpdi5hcHBlbmRDaGlsZCh0aGlzLnJlc2V0QnV0dG9uKTtcbiAgICAgICAgdGhpcy5yZXNldEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGF0LmNsZWFyRmVlZGJhY2soKTtcbiAgICAgICAgICAgICQodGhhdC5jaGVja0J1dHRvbikucHJvcChcImRpc2FibGVkXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoYXQucmVzZXRWaWV3KCk7XG4gICAgICAgICAgICB0aGF0LmNoZWNrQ291bnQgPSAwO1xuICAgICAgICAgICAgdGhhdC5sb2dNb3ZlKFwicmVzZXRcIik7XG4gICAgICAgICAgICB0aGF0LnNldExvY2FsU3RvcmFnZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hZGFwdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5oZWxwQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgICAgICQodGhpcy5oZWxwQnV0dG9uKS5hdHRyKFwiY2xhc3NcIiwgXCJidG4gYnRuLXByaW1hcnlcIik7XG4gICAgICAgICAgICB0aGlzLmhlbHBCdXR0b24udGV4dENvbnRlbnQgPSAkLmkxOG4oXCJtc2dfcGFyc29uX2hlbHBcIik7XG4gICAgICAgICAgICB0aGlzLmhlbHBCdXR0b24uaWQgPSB0aGlzLmNvdW50ZXJJZCArIFwiLWhlbHBcIjtcbiAgICAgICAgICAgIHRoaXMuaGVscEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlOyAvLyBiamVcbiAgICAgICAgICAgIHRoaXMucGFyc29uc0NvbnRyb2xEaXYuYXBwZW5kQ2hpbGQodGhpcy5oZWxwQnV0dG9uKTtcbiAgICAgICAgICAgIHRoaXMuaGVscEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoYXQuaGVscE1lKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1lc3NhZ2VEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLm1lc3NhZ2VEaXYuaWQgPSB0aGlzLmNvdW50ZXJJZCArIFwiLW1lc3NhZ2VcIjtcbiAgICAgICAgdGhpcy5wYXJzb25zQ29udHJvbERpdi5hcHBlbmRDaGlsZCh0aGlzLm1lc3NhZ2VEaXYpO1xuICAgICAgICAkKHRoaXMubWVzc2FnZURpdikuaGlkZSgpO1xuICAgICAgICAkKHRoaXMub3JpZ0VsZW0pLnJlcGxhY2VXaXRoKHRoaXMub3V0ZXJEaXYpO1xuICAgICAgICAkKHRoaXMub3V0ZXJEaXYpLmNsb3Nlc3QoXCIuc3Fjb250YWluZXJcIikuY3NzKFwibWF4LXdpZHRoXCIsIFwibm9uZVwiKTtcbiAgICAgICAgaWYgKHRoaXMub3V0ZXJEaXYpIHtcbiAgICAgICAgICAgIGlmICgkKHRoaXMucXVlc3Rpb24pLmh0bWwoKS5tYXRjaCgvXlxccyskLykpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMucXVlc3Rpb24pLnJlbW92ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMub3V0ZXJEaXYpLnByZXBlbmQodGhpcy5xdWVzdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gSW5pdGlhbGl6ZSBsaW5lcyBhbmQgc29sdXRpb24gcHJvcGVydGllc1xuICAgIGluaXRpYWxpemVMaW5lcyh0ZXh0KSB7XG4gICAgICAgIHRoaXMubGluZXMgPSBbXTtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBpbml0aWFsIGJsb2Nrc1xuICAgICAgICB2YXIgdGV4dEJsb2NrcyA9IHRleHQuc3BsaXQoXCItLS1cIik7XG4gICAgICAgIGlmICh0ZXh0QmxvY2tzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIC0tLSwgdGhlbiBldmVyeSBsaW5lIGlzIGl0cyBvd24gYmxvY2tcbiAgICAgICAgICAgIHRleHRCbG9ja3MgPSB0ZXh0LnNwbGl0KFwiXFxuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzb2x1dGlvbiA9IFtdO1xuICAgICAgICB2YXIgaW5kZW50cyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHRCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB0ZXh0QmxvY2sgPSB0ZXh0QmxvY2tzW2ldO1xuICAgICAgICAgICAgLy8gRmlndXJlIG91dCBvcHRpb25zIGJhc2VkIG9uIHRoZSAjb3B0aW9uXG4gICAgICAgICAgICAvLyBSZW1vdmUgdGhlIG9wdGlvbnMgZnJvbSB0aGUgY29kZVxuICAgICAgICAgICAgLy8gb25seSBvcHRpb25zIGFyZSAjcGFpcmVkIG9yICNkaXN0cmFjdG9yXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgICAgICAgICAgdmFyIGRpc3RyYWN0SW5kZXg7XG4gICAgICAgICAgICB2YXIgZGlzdHJhY3RIZWxwdGV4dCA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgdGFnSW5kZXg7XG4gICAgICAgICAgICB2YXIgdGFnO1xuICAgICAgICAgICAgdmFyIGRlcGVuZHNJbmRleDtcbiAgICAgICAgICAgIHZhciBkZXBlbmRzID0gW107XG4gICAgICAgICAgICBpZiAodGV4dEJsb2NrLmluY2x1ZGVzKFwiI3BhaXJlZDpcIikpIHtcbiAgICAgICAgICAgICAgICBkaXN0cmFjdEluZGV4ID0gdGV4dEJsb2NrLmluZGV4T2YoXCIjcGFpcmVkOlwiKTtcbiAgICAgICAgICAgICAgICBkaXN0cmFjdEhlbHB0ZXh0ID0gdGV4dEJsb2NrXG4gICAgICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoZGlzdHJhY3RJbmRleCArIDgsIHRleHRCbG9jay5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIC50cmltKCk7XG4gICAgICAgICAgICAgICAgdGV4dEJsb2NrID0gdGV4dEJsb2NrLnN1YnN0cmluZygwLCBkaXN0cmFjdEluZGV4ICsgNyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRleHRCbG9jay5pbmNsdWRlcyhcIiNkaXN0cmFjdG9yOlwiKSkge1xuICAgICAgICAgICAgICAgIGRpc3RyYWN0SW5kZXggPSB0ZXh0QmxvY2suaW5kZXhPZihcIiNkaXN0cmFjdG9yOlwiKTtcbiAgICAgICAgICAgICAgICBkaXN0cmFjdEhlbHB0ZXh0ID0gdGV4dEJsb2NrXG4gICAgICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoZGlzdHJhY3RJbmRleCArIDEyLCB0ZXh0QmxvY2subGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAudHJpbSgpO1xuICAgICAgICAgICAgICAgIHRleHRCbG9jayA9IHRleHRCbG9jay5zdWJzdHJpbmcoMCwgZGlzdHJhY3RJbmRleCArIDExKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGV4dEJsb2NrLmluY2x1ZGVzKFwiI3RhZzpcIikpIHtcbiAgICAgICAgICAgICAgICB0ZXh0QmxvY2sgPSB0ZXh0QmxvY2sucmVwbGFjZSgvI3RhZzouKjsuKjsvLCAocykgPT5cbiAgICAgICAgICAgICAgICAgICAgcy5yZXBsYWNlKC9cXHMrL2csIFwiXCIpXG4gICAgICAgICAgICAgICAgKTsgLy8gcmVtb3ZlIHdoaXRlc3BhY2UgaW4gdGFnIGFuZCBkZXBlbmRzIGxpc3RcbiAgICAgICAgICAgICAgICB0YWdJbmRleCA9IHRleHRCbG9jay5pbmRleE9mKFwiI3RhZzpcIik7XG4gICAgICAgICAgICAgICAgdGFnID0gdGV4dEJsb2NrLnN1YnN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgdGFnSW5kZXggKyA1LFxuICAgICAgICAgICAgICAgICAgICB0ZXh0QmxvY2suaW5kZXhPZihcIjtcIiwgdGFnSW5kZXggKyA1KVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKHRhZyA9PSBcIlwiKSB0YWcgPSBcImJsb2NrLVwiICsgaTtcbiAgICAgICAgICAgICAgICBkZXBlbmRzSW5kZXggPSB0ZXh0QmxvY2suaW5kZXhPZihcIjtkZXBlbmRzOlwiKTtcbiAgICAgICAgICAgICAgICBsZXQgZGVwZW5kc1N0cmluZyA9IHRleHRCbG9jay5zdWJzdHJpbmcoXG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZHNJbmRleCArIDksXG4gICAgICAgICAgICAgICAgICAgIHRleHRCbG9jay5pbmRleE9mKFwiO1wiLCBkZXBlbmRzSW5kZXggKyA5KVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgZGVwZW5kcyA9XG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZHNTdHJpbmcubGVuZ3RoID4gMCA/IGRlcGVuZHNTdHJpbmcuc3BsaXQoXCIsXCIpIDogW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGV4dEJsb2NrLmluY2x1ZGVzKCdjbGFzcz1cImRpc3BsYXltYXRoJykpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zW1wiZGlzcGxheW1hdGhcIl0gPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zW1wiZGlzcGxheW1hdGhcIl0gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRleHRCbG9jayA9IHRleHRCbG9jay5yZXBsYWNlKFxuICAgICAgICAgICAgICAgIC8jKHBhaXJlZHxkaXN0cmFjdG9yfHRhZzouKjsuKjspLyxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihteXN0cmluZywgYXJnMSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zW2FyZzFdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBsaW5lc1xuICAgICAgICAgICAgdmFyIGxpbmVzID0gW107XG4gICAgICAgICAgICBpZiAoIW9wdGlvbnNbXCJkaXNwbGF5bWF0aFwiXSkge1xuICAgICAgICAgICAgICAgIHZhciBzcGxpdCA9IHRleHRCbG9jay5zcGxpdChcIlxcblwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHNwbGl0ID0gW3RleHRCbG9ja107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNwbGl0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvZGUgPSBzcGxpdFtqXTtcbiAgICAgICAgICAgICAgICAvLyBkaXNjYXJkIGJsYW5rIHJvd3NcbiAgICAgICAgICAgICAgICBpZiAoIS9eXFxzKiQvLnRlc3QoY29kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxpbmUgPSBuZXcgUGFyc29uc0xpbmUoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbXCJkaXNwbGF5bWF0aFwiXVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9uc1tcInBhaXJlZFwiXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5kaXN0cmFjdG9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUucGFpcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUuZGlzdHJhY3RIZWxwdGV4dCA9IGRpc3RyYWN0SGVscHRleHQ7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9uc1tcImRpc3RyYWN0b3JcIl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUuZGlzdHJhY3RvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lLnBhaXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5kaXN0cmFjdEhlbHB0ZXh0ID0gZGlzdHJhY3RIZWxwdGV4dDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUuZGlzdHJhY3RvciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5wYWlyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZ3JhZGVyID09PSBcImRhZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZS50YWcgPSB0YWc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5kZXBlbmRzID0gZGVwZW5kcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNvbHV0aW9uLnB1c2gobGluZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShsaW5lLmluZGVudCwgaW5kZW50cykgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGVudHMucHVzaChsaW5lLmluZGVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGluZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIC8vIEFkZCBncm91cFdpdGhOZXh0XG4gICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGxpbmVzLmxlbmd0aCAtIDE7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBsaW5lc1tqXS5ncm91cFdpdGhOZXh0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGluZXNbbGluZXMubGVuZ3RoIC0gMV0uZ3JvdXBXaXRoTmV4dCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIE5vcm1hbGl6ZSB0aGUgaW5kZW50c1xuICAgICAgICBpbmRlbnRzID0gaW5kZW50cy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgICAgfSk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsaW5lID0gdGhpcy5saW5lc1tpXTtcbiAgICAgICAgICAgIGxpbmUuaW5kZW50ID0gaW5kZW50cy5pbmRleE9mKGxpbmUuaW5kZW50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNvbHV0aW9uID0gc29sdXRpb247XG4gICAgfVxuICAgIC8vIEJhc2VkIG9uIHRoZSBibG9ja3MsIGNyZWF0ZSB0aGUgc291cmNlIGFuZCBhbnN3ZXIgYXJlYXNcbiAgICBhc3luYyBpbml0aWFsaXplQXJlYXMoc291cmNlQmxvY2tzLCBhbnN3ZXJCbG9ja3MsIG9wdGlvbnMpIHtcbiAgICAgICAgLy8gQ3JlYXRlIGJsb2NrcyBwcm9wZXJ0eSBhcyB0aGUgc3VtIG9mIHRoZSB0d29cbiAgICAgICAgdmFyIGJsb2NrcyA9IFtdO1xuICAgICAgICB2YXIgaSwgYmxvY2s7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBzb3VyY2VCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJsb2NrID0gc291cmNlQmxvY2tzW2ldO1xuICAgICAgICAgICAgYmxvY2tzLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgdGhpcy5zb3VyY2VBcmVhLmFwcGVuZENoaWxkKGJsb2NrLnZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBhbnN3ZXJCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJsb2NrID0gYW5zd2VyQmxvY2tzW2ldO1xuICAgICAgICAgICAgYmxvY2tzLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgdGhpcy5hbnN3ZXJBcmVhLmFwcGVuZENoaWxkKGJsb2NrLnZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xuICAgICAgICAvLyBJZiBwcmVzZW50LCBkaXNhYmxlIHNvbWUgYmxvY2tzXG4gICAgICAgIHZhciBkaXNhYmxlZCA9IG9wdGlvbnMuZGlzYWJsZWQ7XG4gICAgICAgIGlmIChkaXNhYmxlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYmxvY2sgPSBibG9ja3NbaV07XG4gICAgICAgICAgICAgICAgaWYgKGRpc2FibGVkLmluY2x1ZGVzKGJsb2NrLmxpbmVzWzBdLmluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICAkKGJsb2NrLnZpZXcpLmFkZENsYXNzKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIERldGVybWluZSBob3cgbXVjaCBpbmRlbnQgc2hvdWxkIGJlIHBvc3NpYmxlIGluIHRoZSBhbnN3ZXIgYXJlYVxuICAgICAgICB2YXIgaW5kZW50ID0gMDtcbiAgICAgICAgaWYgKCF0aGlzLm5vaW5kZW50KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmxhbmd1YWdlID09IFwibmF0dXJhbFwiKSB7XG4gICAgICAgICAgICAgICAgaW5kZW50ID0gdGhpcy5zb2x1dGlvbkluZGVudCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbmRlbnQgPSBNYXRoLm1heCgwLCB0aGlzLnNvbHV0aW9uSW5kZW50KCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5kZW50ID0gaW5kZW50O1xuICAgICAgICAvLyBGb3IgcmVuZGVyaW5nLCBwbGFjZSBpbiBhbiBvbnNjcmVlbiBwb3NpdGlvblxuICAgICAgICB2YXIgaXNIaWRkZW4gPSB0aGlzLm91dGVyRGl2Lm9mZnNldFBhcmVudCA9PSBudWxsO1xuICAgICAgICB2YXIgcmVwbGFjZUVsZW1lbnQ7XG4gICAgICAgIGlmIChpc0hpZGRlbikge1xuICAgICAgICAgICAgcmVwbGFjZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgJCh0aGlzLm91dGVyRGl2KS5yZXBsYWNlV2l0aChyZXBsYWNlRWxlbWVudCk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMub3V0ZXJEaXYpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMucHJldHRpZnlMYW5ndWFnZSAhPT0gXCJcIikge1xuICAgICAgICAgICAgcHJldHR5UHJpbnQoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMubGluZXNbaV0uaW5pdGlhbGl6ZVdpZHRoKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTGF5b3V0IHRoZSBhcmVhc1xuICAgICAgICB2YXIgYXJlYVdpZHRoLCBhcmVhSGVpZ2h0O1xuICAgICAgICAvLyBFc3RhYmxpc2ggdGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIGRyb3BwYWJsZSBhcmVhc1xuICAgICAgICB2YXIgaXRlbSwgbWF4RnVuY3Rpb247XG4gICAgICAgIGFyZWFIZWlnaHQgPSAyMDtcbiAgICAgICAgdmFyIGhlaWdodF9hZGQgPSAwO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm51bWJlcmVkICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaGVpZ2h0X2FkZCA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2FybmluZyAtLSBhbGwgb2YgdGhpcyBpcyBqdXN0IGEgYml0IG9mIHBpeGllIGR1c3QgZGlzY292ZXJlZCBieSB0cmlhbFxuICAgICAgICAvLyBhbmQgZXJyb3IgdG8gdHJ5IHRvIGdldCB0aGUgaGVpZ2h0IG9mIHRoZSBkcmFnIGFuZCBkcm9wIGJveGVzLlxuICAgICAgICAvLyBpdGVtIGlzIGEgalF1ZXJ5IG9iamVjdFxuICAgICAgICAvLyBvdXRlckhlaWdodCBjYW4gYmUgdW5yZWxpYWJsZSBpZiBlbGVtZW50cyBhcmUgbm90IHlldCB2aXNpYmxlXG4gICAgICAgIC8vIG91dGVySGVpZ2h0IHdpbGwgcmV0dXJuIGJhZCByZXN1bHRzIGlmIE1hdGhKYXggaGFzIG5vdCByZW5kZXJlZCB0aGUgbWF0aFxuICAgICAgICBhcmVhV2lkdGggPSAzMDA7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbWF4RnVuY3Rpb24gPSBhc3luYyBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmxhbmd1YWdlID09IFwibmF0dXJhbFwiIHx8IHRoaXMub3B0aW9ucy5sYW5ndWFnZSA9PSBcIm1hdGhcIikge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcnVuZXN0b25lTWF0aHJlYWR5ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHJ1bmVzdG9uZU1hdGhSZWFkeS50aGVuKGFzeW5jICgpID0+IGF3YWl0IHNlbGYucXVldWVNYXRoSmF4KGl0ZW1bMF0pKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgeyAvLyB0aGlzIGlzIGZvciBvbGRlciByc3QgYnVpbGRzIG5vdCBwdHhcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNYXRoSmF4LnN0YXJ0dXAgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHNlbGYucXVldWVNYXRoSmF4KGl0ZW1bMF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXJlYVdpZHRoID0gTWF0aC5tYXgoYXJlYVdpZHRoLCBpdGVtLm91dGVyV2lkdGgodHJ1ZSkpO1xuICAgICAgICAgICAgaXRlbS53aWR0aChhcmVhV2lkdGggLSAyMik7XG4gICAgICAgICAgICB2YXIgYWRkaXRpb24gPSAzLjg7XG4gICAgICAgICAgICBpZiAoaXRlbS5vdXRlckhlaWdodCh0cnVlKSAhPSAzOClcbiAgICAgICAgICAgICAgICBhZGRpdGlvbiA9ICgzLjEgKiAoaXRlbS5vdXRlckhlaWdodCh0cnVlKSAtIDM4KSkgLyAyMTtcbiAgICAgICAgICAgIGFyZWFIZWlnaHQgKz0gaXRlbS5vdXRlckhlaWdodCh0cnVlKSArIGhlaWdodF9hZGQgKiBhZGRpdGlvbjtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhd2FpdCBtYXhGdW5jdGlvbigkKGJsb2Nrc1tpXS52aWV3KSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hcmVhV2lkdGggPSBhcmVhV2lkdGg7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubnVtYmVyZWQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmFyZWFXaWR0aCArPSAyNTtcbiAgICAgICAgICAgIC8vYXJlYUhlaWdodCArPSAoYmxvY2tzLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gKyA0MCB0byBhcmVhSGVpZ2h0IHRvIHByb3ZpZGUgc29tZSBhZGRpdGlvbmFsIGJ1ZmZlciBpbiBjYXNlIGFueSB0ZXh0IG92ZXJmbG93IHN0aWxsIGhhcHBlbnMgLSBWaW5jZW50IFFpdSAoU2VwdGVtYmVyIDIwMjApXG4gICAgICAgIHRoaXMuYXJlYUhlaWdodCA9IGFyZWFIZWlnaHQgKyA0MDtcbiAgICAgICAgJCh0aGlzLnNvdXJjZUFyZWEpLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogdGhpcy5hcmVhV2lkdGggKyAyLFxuICAgICAgICAgICAgaGVpZ2h0OiBhcmVhSGVpZ2h0LFxuICAgICAgICB9KTtcbiAgICAgICAgJCh0aGlzLmFuc3dlckFyZWEpLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogdGhpcy5vcHRpb25zLnBpeGVsc1BlckluZGVudCAqIGluZGVudCArIHRoaXMuYXJlYVdpZHRoICsgMixcbiAgICAgICAgICAgIGhlaWdodDogYXJlYUhlaWdodCxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChpbmRlbnQgPiAwICYmIGluZGVudCA8PSA0KSB7XG4gICAgICAgICAgICAkKHRoaXMuYW5zd2VyQXJlYSkuYWRkQ2xhc3MoXCJhbnN3ZXJcIiArIGluZGVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMuYW5zd2VyQXJlYSkuYWRkQ2xhc3MoXCJhbnN3ZXJcIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSW5pdGlhbGl6ZSBwYWlyZWQgZGlzdHJhY3RvciBkZWNvcmF0aW9uXG4gICAgICAgIHZhciBiaW5zID0gW107XG4gICAgICAgIHZhciBiaW4gPSBbXTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBsaW5lID0gdGhpcy5saW5lc1tpXTtcbiAgICAgICAgICAgIGlmIChsaW5lLmJsb2NrKCkgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJpbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGJpbnMucHVzaChiaW4pO1xuICAgICAgICAgICAgICAgICAgICBiaW4gPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJpbi5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgICAgIGlmICghbGluZS5ncm91cFdpdGhOZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIGJpbnMucHVzaChiaW4pO1xuICAgICAgICAgICAgICAgICAgICBiaW4gPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBhaXJlZEJpbnMgPSBbXTtcbiAgICAgICAgdmFyIGxpbmVOdW1iZXJzID0gW107XG4gICAgICAgIHZhciBwYWlyZWREaXZzID0gW107XG4gICAgICAgIHZhciBqO1xuICAgICAgICBpZiAodGhpcy5wYWlyRGlzdHJhY3RvcnMgfHwgIXRoaXMub3B0aW9ucy5hZGFwdGl2ZSkge1xuICAgICAgICAgICAgZm9yIChpID0gYmlucy5sZW5ndGggLSAxOyBpID4gLTE7IGktLSkge1xuICAgICAgICAgICAgICAgIGJpbiA9IGJpbnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGJpblswXS5wYWlyZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQWRkIGFsbCBpbiBiaW4gdG8gbGluZSBudW1iZXJzXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IGJpbi5sZW5ndGggLSAxOyBqID4gLTE7IGotLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcnMudW5zaGlmdChiaW5bal0uaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmVOdW1iZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFkZCBhbGwgaW4gYmluIHRvIGxpbmUgbnVtYmVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gYmluLmxlbmd0aCAtIDE7IGogPiAtMTsgai0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcnMudW5zaGlmdChiaW5bal0uaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcGFpcmVkQmlucy51bnNoaWZ0KGxpbmVOdW1iZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXJzID0gW107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcGFpcmVkQmlucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBwYWlyZWREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgICQocGFpcmVkRGl2KS5hZGRDbGFzcyhcInBhaXJlZFwiKTtcbiAgICAgICAgICAgICAgICAkKHBhaXJlZERpdikuaHRtbChcbiAgICAgICAgICAgICAgICAgICAgXCI8c3BhbiBpZD0gJ3N0JyBzdHlsZSA9ICd2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlOyBmb250LXdlaWdodDogYm9sZCc+b3J7PC9zcGFuPlwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBwYWlyZWREaXZzLnB1c2gocGFpcmVkRGl2KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZUFyZWEuYXBwZW5kQ2hpbGQocGFpcmVkRGl2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhaXJlZEJpbnMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhaXJlZEJpbnMgPSBwYWlyZWRCaW5zO1xuICAgICAgICB0aGlzLnBhaXJlZERpdnMgPSBwYWlyZWREaXZzO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm51bWJlcmVkICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5hZGRCbG9ja0xhYmVscyhzb3VyY2VCbG9ja3MuY29uY2F0KGFuc3dlckJsb2NrcykpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgdmlld1xuICAgICAgICB0aGlzLnN0YXRlID0gdW5kZWZpbmVkOyAvLyBuZWVkcyB0byBiZSBoZXJlIGZvciBsb2FkaW5nIGZyb20gc3RvcmFnZVxuICAgICAgICB0aGlzLnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgLy8gUHV0IGJhY2sgaW50byB0aGUgb2Zmc2NyZWVuIHBvc2l0aW9uXG4gICAgICAgIGlmIChpc0hpZGRlbikge1xuICAgICAgICAgICAgJChyZXBsYWNlRWxlbWVudCkucmVwbGFjZVdpdGgodGhpcy5vdXRlckRpdik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTWFrZSBibG9ja3MgaW50ZXJhY3RpdmUgKGJvdGggZHJhZy1hbmQtZHJvcCBhbmQga2V5Ym9hcmQpXG4gICAgaW5pdGlhbGl6ZUludGVyYWN0aXZpdHkoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYmxvY2tzW2ldLmluaXRpYWxpemVJbnRlcmFjdGl2aXR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0aWFsaXplVGFiSW5kZXgoKTtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMubGFuZ3VhZ2UgPT0gXCJuYXR1cmFsXCIgfHxcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5sYW5ndWFnZSA9PSBcIm1hdGhcIlxuICAgICAgICApIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgTWF0aEpheC5zdGFydHVwICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5xdWV1ZU1hdGhKYXgoc2VsZi5vdXRlckRpdik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTWFrZSBvbmUgYmxvY2sgYmUga2V5Ym9hcmQgYWNjZXNzaWJsZVxuICAgIGluaXRpYWxpemVUYWJJbmRleCgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGJsb2NrID0gdGhpcy5ibG9ja3NbaV07XG4gICAgICAgICAgICBpZiAoYmxvY2suZW5hYmxlZCgpKSB7XG4gICAgICAgICAgICAgICAgYmxvY2subWFrZVRhYkluZGV4KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSBTRVJWRVIgQ09NTVVOSUNBVElPTiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgLy8gUmV0dXJuIHRoZSBhcmd1bWVudCB0aGF0IGlzIG5ld2VyIGJhc2VkIG9uIHRoZSB0aW1lc3RhbXBcbiAgICBuZXdlckRhdGEoZGF0YUEsIGRhdGFCKSB7XG4gICAgICAgIHZhciBkYXRlQSA9IGRhdGFBLnRpbWVzdGFtcDtcbiAgICAgICAgdmFyIGRhdGVCID0gZGF0YUIudGltZXN0YW1wO1xuICAgICAgICBpZiAoZGF0ZUEgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YUI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGVCID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFBO1xuICAgICAgICB9XG4gICAgICAgIGRhdGVBID0gdGhpcy5kYXRlRnJvbVRpbWVzdGFtcChkYXRlQSk7XG4gICAgICAgIGRhdGVCID0gdGhpcy5kYXRlRnJvbVRpbWVzdGFtcChkYXRlQik7XG4gICAgICAgIGlmIChkYXRlQSA+IGRhdGVCKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YUE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YUI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQmFzZWQgb24gdGhlIGRhdGEsIGxvYWRcbiAgICBhc3luYyBsb2FkRGF0YShkYXRhKSB7XG4gICAgICAgIHZhciBzb3VyY2VIYXNoID0gZGF0YS5zb3VyY2U7XG4gICAgICAgIGlmIChzb3VyY2VIYXNoID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gbWFpbnRhaW4gYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgICAgICAgICAgIHNvdXJjZUhhc2ggPSBkYXRhLnRyYXNoO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhbnN3ZXJIYXNoID0gZGF0YS5hbnN3ZXI7XG4gICAgICAgIHZhciBhZGFwdGl2ZUhhc2ggPSBkYXRhLmFkYXB0aXZlO1xuICAgICAgICB2YXIgb3B0aW9ucztcbiAgICAgICAgaWYgKGFkYXB0aXZlSGFzaCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNGcm9tSGFzaChhZGFwdGl2ZUhhc2gpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLm5vaW5kZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMubm9pbmRlbnQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmNoZWNrQ291bnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jaGVja0NvdW50ID0gb3B0aW9ucy5jaGVja0NvdW50O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmhhc1NvbHZlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmhhc1NvbHZlZCA9IG9wdGlvbnMuaGFzU29sdmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHNvdXJjZUhhc2ggPT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICBhbnN3ZXJIYXNoID09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgYW5zd2VySGFzaC5sZW5ndGggPT0gMVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZUFyZWFzKHRoaXMuYmxvY2tzRnJvbVNvdXJjZSgpLCBbXSwgb3B0aW9ucyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVBcmVhcyhcbiAgICAgICAgICAgICAgICB0aGlzLmJsb2Nrc0Zyb21IYXNoKHNvdXJjZUhhc2gpLFxuICAgICAgICAgICAgICAgIHRoaXMuYmxvY2tzRnJvbUhhc2goYW5zd2VySGFzaCksXG4gICAgICAgICAgICAgICAgb3B0aW9uc1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuZ3JhZGUgPSB0aGlzLmdyYWRlci5ncmFkZSgpO1xuICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gdGhpcy5ncmFkZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTdGFydCB0aGUgaW50ZXJmYWNlXG4gICAgICAgIGlmICh0aGlzLm5lZWRzUmVpbml0aWFsaXphdGlvbiAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplSW50ZXJhY3Rpdml0eSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFJldHVybiB3aGF0IGlzIHN0b3JlZCBpbiBsb2NhbCBzdG9yYWdlXG4gICAgbG9jYWxEYXRhKCkge1xuICAgICAgICB2YXIgZGF0YSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuc3RvcmFnZUlkKTtcbiAgICAgICAgaWYgKGRhdGEgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChkYXRhLmNoYXJBdCgwKSA9PSBcIntcIikge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkYXRhID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhID0ge307XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIC8vIFJ1bmVzdG9uZUJhc2U6IFNlbnQgd2hlbiB0aGUgc2VydmVyIGhhcyBkYXRhXG4gICAgcmVzdG9yZUFuc3dlcnMoc2VydmVyRGF0YSkge1xuICAgICAgICB0aGlzLmxvYWREYXRhKHNlcnZlckRhdGEpO1xuICAgIH1cbiAgICAvLyBSdW5lc3RvbmVCYXNlOiBMb2FkIHdoYXQgaXMgaW4gbG9jYWwgc3RvcmFnZVxuICAgIGNoZWNrTG9jYWxTdG9yYWdlKCkge1xuICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvYWREYXRhKHRoaXMubG9jYWxEYXRhKCkpO1xuICAgIH1cbiAgICAvLyBSdW5lc3RvbmVCYXNlOiBTZXQgdGhlIHN0YXRlIG9mIHRoZSBwcm9ibGVtIGluIGxvY2FsIHN0b3JhZ2VcbiAgICBzZXRMb2NhbFN0b3JhZ2UoZGF0YSkge1xuICAgICAgICB2YXIgdG9TdG9yZTtcbiAgICAgICAgaWYgKGRhdGEgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0b1N0b3JlID0ge1xuICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2VIYXNoKCksXG4gICAgICAgICAgICAgICAgYW5zd2VyOiB0aGlzLmFuc3dlckhhc2goKSxcbiAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIGFkYXB0aXZlSGFzaCA9IHRoaXMuYWRhcHRpdmVIYXNoKCk7XG4gICAgICAgICAgICBpZiAoYWRhcHRpdmVIYXNoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0b1N0b3JlLmFkYXB0aXZlID0gYWRhcHRpdmVIYXNoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9TdG9yZSA9IGRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5zdG9yYWdlSWQsIEpTT04uc3RyaW5naWZ5KHRvU3RvcmUpKTtcbiAgICB9XG4gICAgLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSBMT0dHSU5HID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgLy8gTG9nIHRoZSBpbnRlcmFjdGlvbiB3aXRoIHRoZSBwcm9ibGVtIHRvIHRoZSBzZXJ2ZXI6XG4gICAgLy8gICBzdGFydDogdGhlIHVzZXIgc3RhcnRlZCBpbnRlcmFjdGluZyB3aXRoIHRoaXMgcHJvYmxlbVxuICAgIC8vICAgbW92ZTogdGhlIHVzZXIgbW92ZWQgYSBibG9jayB0byBhIG5ldyBwb3NpdGlvblxuICAgIC8vICAgcmVzZXQ6IHRoZSByZXNldCBidXR0b24gd2FzIHByZXNzZWRcbiAgICAvLyAgIHJlbW92ZURpc3RyYWN0b3I6IFwiSGVscCBNZVwiIHJlbW92ZWQgYSBkaXN0cmFjdG9yXG4gICAgLy8gICByZW1vdmVJbmRlbnRhdGlvbjogXCJIZWxwIE1lXCIgcmVtb3ZlZCBpbmRlbnRhdGlvblxuICAgIC8vICAgY29tYmluZUJsb2NrczogXCJIZWxwIE1lXCIgY29tYmluZWQgYmxvY2tzXG4gICAgbG9nTW92ZShhY3Rpdml0eSkge1xuICAgICAgICB2YXIgZXZlbnQgPSB7XG4gICAgICAgICAgICBldmVudDogXCJwYXJzb25zTW92ZVwiLFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgc3RvcmFnZWlkOiBzdXBlci5sb2NhbFN0b3JhZ2VLZXkoKSxcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGFjdCA9IGFjdGl2aXR5ICsgXCJ8XCIgKyB0aGlzLnNvdXJjZUhhc2goKSArIFwifFwiICsgdGhpcy5hbnN3ZXJIYXNoKCk7XG4gICAgICAgIHZhciBhZGFwdGl2ZUhhc2ggPSB0aGlzLmFkYXB0aXZlSGFzaCgpO1xuICAgICAgICBpZiAoYWRhcHRpdmVIYXNoICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBhY3QgPSBhY3QgKyBcInxcIiArIGFkYXB0aXZlSGFzaDtcbiAgICAgICAgfVxuICAgICAgICBldmVudC5hY3QgPSBhY3Q7XG4gICAgICAgIHRoaXMubG9nQm9va0V2ZW50KGV2ZW50KTtcbiAgICB9XG4gICAgLy8gTG9nIHRoZSBhbnN3ZXIgdG8gdGhlIHByb2JsZW1cbiAgICAvLyAgIGNvcnJlY3Q6IFRoZSBhbnN3ZXIgZ2l2ZW4gbWF0Y2hlcyB0aGUgc29sdXRpb25cbiAgICAvLyAgIGluY29ycmVjdCo6IFRoZSBhbnN3ZXIgaXMgd3JvbmcgZm9yIHZhcmlvdXMgcmVhc29uc1xuICAgIGFzeW5jIGxvZ0N1cnJlbnRBbnN3ZXIoc2lkKSB7XG4gICAgICAgIHZhciBldmVudCA9IHtcbiAgICAgICAgICAgIGV2ZW50OiBcInBhcnNvbnNcIixcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGFuc3dlckhhc2ggPSB0aGlzLmFuc3dlckhhc2goKTtcbiAgICAgICAgZXZlbnQuYW5zd2VyID0gYW5zd2VySGFzaDtcbiAgICAgICAgdmFyIHNvdXJjZUhhc2ggPSB0aGlzLnNvdXJjZUhhc2goKTtcbiAgICAgICAgZXZlbnQuc291cmNlID0gc291cmNlSGFzaDtcbiAgICAgICAgdmFyIGFjdCA9IHNvdXJjZUhhc2ggKyBcInxcIiArIGFuc3dlckhhc2g7XG4gICAgICAgIHZhciBhZGFwdGl2ZUhhc2ggPSB0aGlzLmFkYXB0aXZlSGFzaCgpO1xuICAgICAgICBpZiAoYWRhcHRpdmVIYXNoICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBldmVudC5hZGFwdGl2ZSA9IGFkYXB0aXZlSGFzaDtcbiAgICAgICAgICAgIGFjdCA9IGFjdCArIFwifFwiICsgYWRhcHRpdmVIYXNoO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdyYWRlID09IFwiY29ycmVjdFwiKSB7XG4gICAgICAgICAgICBhY3QgPSBcImNvcnJlY3R8XCIgKyBhY3Q7XG4gICAgICAgICAgICBldmVudC5jb3JyZWN0ID0gXCJUXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhY3QgPSBcImluY29ycmVjdHxcIiArIGFjdDtcbiAgICAgICAgICAgIGV2ZW50LmNvcnJlY3QgPSBcIkZcIjtcbiAgICAgICAgfVxuICAgICAgICBldmVudC5hY3QgPSBhY3Q7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBzaWQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGV2ZW50LnNpZCA9IHNpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IHRoaXMubG9nQm9va0V2ZW50KGV2ZW50KTtcbiAgICB9XG4gICAgLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSBBQ0NFU1NJTkcgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgLy8gQW5zd2VyIHRoZSBoYXNoIG9mIHRoZSBhZGFwdGl2ZSBzdGF0ZVxuICAgIGFkYXB0aXZlSGFzaCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuYWRhcHRpdmUpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHZhciBoYXNoID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBibG9jayA9IHRoaXMuYmxvY2tzW2ldO1xuICAgICAgICAgICAgaWYgKCFibG9jay5lbmFibGVkKCkpIHtcbiAgICAgICAgICAgICAgICBoYXNoLnB1c2goXCJkXCIgKyBibG9jay5saW5lc1swXS5pbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubm9pbmRlbnQgIT09IHRoaXMub3B0aW9ucy5ub2luZGVudCkge1xuICAgICAgICAgICAgaGFzaC5wdXNoKFwiaVwiKTtcbiAgICAgICAgfVxuICAgICAgICBoYXNoLnB1c2goXCJjXCIgKyB0aGlzLmNoZWNrQ291bnQpO1xuICAgICAgICBpZiAodGhpcy5oYXNTb2x2ZWQpIHtcbiAgICAgICAgICAgIGhhc2gucHVzaChcInNcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhc2guam9pbihcIi1cIik7XG4gICAgfVxuICAgIC8vIENyZWF0ZSBvcHRpb25zIGZvciBjcmVhdGluZyBibG9ja3MgYmFzZWQgb24gYSBoYXNoXG4gICAgb3B0aW9uc0Zyb21IYXNoKGhhc2gpIHtcbiAgICAgICAgdmFyIHNwbGl0O1xuICAgICAgICBpZiAoaGFzaCA9PT0gXCItXCIgfHwgaGFzaCA9PT0gXCJcIiB8fCBoYXNoID09PSBudWxsKSB7XG4gICAgICAgICAgICBzcGxpdCA9IFtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3BsaXQgPSBoYXNoLnNwbGl0KFwiLVwiKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgICAgICB2YXIgZGlzYWJsZWQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcGxpdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGtleSA9IHNwbGl0W2ldO1xuICAgICAgICAgICAgaWYgKGtleVswXSA9PSBcImlcIikge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMubm9pbmRlbnQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXlbMF0gPT0gXCJkXCIpIHtcbiAgICAgICAgICAgICAgICBkaXNhYmxlZC5wdXNoKHBhcnNlSW50KGtleS5zbGljZSgxKSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXlbMF0gPT0gXCJzXCIpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmhhc1NvbHZlZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleVswXSA9PSBcImNcIikge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuY2hlY2tDb3VudCA9IHBhcnNlSW50KGtleS5zbGljZSgxKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpc2FibGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIG9wdGlvbnMuZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9XG4gICAgLy8gQW5zd2VyIHRoZSBoYXNoIG9mIHRoZSBhbnN3ZXIgYXJlYVxuICAgIGFuc3dlckhhc2goKSB7XG4gICAgICAgIHZhciBoYXNoID0gW107XG4gICAgICAgIHZhciBibG9ja3MgPSB0aGlzLmFuc3dlckJsb2NrcygpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaGFzaC5wdXNoKGJsb2Nrc1tpXS5oYXNoKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYXNoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiLVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGhhc2guam9pbihcIi1cIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQW5zd2VyIHRoZSBoYXNoIG9mIHRoZSBzb3VyY2UgYXJlYVxuICAgIHNvdXJjZUhhc2goKSB7XG4gICAgICAgIHZhciBoYXNoID0gW107XG4gICAgICAgIHZhciBibG9ja3MgPSB0aGlzLnNvdXJjZUJsb2NrcygpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaGFzaC5wdXNoKGJsb2Nrc1tpXS5oYXNoKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYXNoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiLVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGhhc2guam9pbihcIi1cIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gSW50ZXItcHJvYmxlbSBhZGFwdGl2ZSBjaGFuZ2VzXG4gICAgLy8gQmFzZWQgb24gdGhlIHJlY2VudEF0dGVtcHRzLCByZW1vdmUgZGlzdHJhY3RvcnMsIGFkZCBpbmRlbnQsIGNvbWJpbmUgYmxvY2tzXG4gICAgYWRhcHRCbG9ja3MoaW5wdXQpIHtcbiAgICAgICAgdmFyIGJsb2NrcyA9IFtdO1xuICAgICAgICB2YXIgZGlzdHJhY3RvcnMgPSBbXTtcbiAgICAgICAgdmFyIGJsb2NrO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBibG9jayA9IGlucHV0W2ldO1xuICAgICAgICAgICAgaWYgKGJsb2NrLmlzRGlzdHJhY3RvcigpKSB7XG4gICAgICAgICAgICAgICAgZGlzdHJhY3RvcnMucHVzaChibG9jayk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlY2VudEF0dGVtcHRzID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXG4gICAgICAgICAgICB0aGlzLmFkYXB0aXZlSWQgKyBcInJlY2VudEF0dGVtcHRzXCJcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKHRoaXMucmVjZW50QXR0ZW1wdHMgPT0gdW5kZWZpbmVkIHx8IHRoaXMucmVjZW50QXR0ZW1wdHMgPT0gXCJOYU5cIikge1xuICAgICAgICAgICAgdGhpcy5yZWNlbnRBdHRlbXB0cyA9IDM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxhc3Rlc3RBdHRlbXB0Q291bnQgPSB0aGlzLnJlY2VudEF0dGVtcHRzO1xuICAgICAgICB2YXIgbkJsb2NrcyA9IGJsb2Nrcy5sZW5ndGg7XG4gICAgICAgIHZhciBuQmxvY2tzVG9Db21iaW5lID0gMDtcbiAgICAgICAgdmFyIG5EaXN0cmFjdG9ycyA9IGRpc3RyYWN0b3JzLmxlbmd0aDtcbiAgICAgICAgdmFyIG5Ub1JlbW92ZSA9IDA7XG4gICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgdmFyIGdpdmVJbmRlbnRhdGlvbiA9IGZhbHNlO1xuICAgICAgICBpZiAobGFzdGVzdEF0dGVtcHRDb3VudCA8IDIpIHtcbiAgICAgICAgICAgIC8vIDEgVHJ5XG4gICAgICAgICAgICB0aGlzLnBhaXJEaXN0cmFjdG9ycyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5saW1pdERpc3RyYWN0b3JzID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAobGFzdGVzdEF0dGVtcHRDb3VudCA8IDQpIHtcbiAgICAgICAgICAgIC8vIDItMyBUcmllc1xuICAgICAgICAgICAgLy8gRG8gbm90aGluZyB0aGV5IGFyZSBkb2luZyBub3JtYWxcbiAgICAgICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChsYXN0ZXN0QXR0ZW1wdENvdW50IDwgNikge1xuICAgICAgICAgICAgLy8gNC01IFRyaWVzXG4gICAgICAgICAgICAvLyBwYWlyIGRpc3RyYWN0b3JzXG4gICAgICAgICAgICB0aGlzLnBhaXJEaXN0cmFjdG9ycyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAobGFzdGVzdEF0dGVtcHRDb3VudCA8IDgpIHtcbiAgICAgICAgICAgIC8vIDYtNyBUcmllc1xuICAgICAgICAgICAgLy8gUmVtb3ZlIDUwJSBvZiBkaXN0cmFjdG9yc1xuICAgICAgICAgICAgblRvUmVtb3ZlID0gMC41ICogbkRpc3RyYWN0b3JzO1xuICAgICAgICAgICAgdGhpcy5wYWlyRGlzdHJhY3RvcnMgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gOCsgVHJpZXNcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgb2YgZGlzdHJhY3RvcnNcbiAgICAgICAgICAgIG5Ub1JlbW92ZSA9IG5EaXN0cmFjdG9ycztcbiAgICAgICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICBlbHNlIGlmKGxhc3Rlc3RBdHRlbXB0Q291bnQgPCAxMikgeyAvLzEwLTExXG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIGRpc3RyYWN0b3JzIGFuZCBnaXZlIGluZGVudGF0aW9uXG4gICAgICAgICAgICBuVG9SZW1vdmUgPSBuRGlzdHJhY3RvcnM7XG4gICAgICAgICAgICBnaXZlSW5kZW50YXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5wYWlyRGlzdHJhY3RvcnMgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYobGFzdGVzdEF0dGVtcHRDb3VudCA8IDE0KSB7IC8vIDEyLTEzIFRyaWVzXG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIG9mIGRpc3RyYWN0b3JzXG4gICAgICAgICAgICAvLyBnaXZlIGluZGVudGF0aW9uXG4gICAgICAgICAgICAvLyByZWR1Y2UgcHJvYmxlbSB0byAzLzQgc2l6ZVxuICAgICAgICAgICAgZ2l2ZUluZGVudGF0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgIG5Ub1JlbW92ZSA9IG5EaXN0cmFjdG9ycztcbiAgICAgICAgICAgIG5CbG9ja3NUb0NvbWJpbmUgPSAuMjUgKiBuQmxvY2tzO1xuICAgICAgICAgICAgdGhpcy5wYWlyRGlzdHJhY3RvcnMgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgeyAvLyA+PSAxNCBUcmllc1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBvZiBkaXN0cmFjdG9yc1xuICAgICAgICAgICAgLy8gZ2l2ZSBpbmRlbnRhdGlvblxuICAgICAgICAgICAgLy8gcmVkdWNlIHByb2JsZW0gdG8gMS8yIHNpemVcbiAgICAgICAgICAgIGdpdmVJbmRlbnRhdGlvbiA9IHRydWU7XG4gICAgICAgICAgICBuVG9SZW1vdmUgPSBuRGlzdHJhY3RvcnM7XG4gICAgICAgICAgICBuQmxvY2tzVG9Db21iaW5lID0gLjUgKiBuQmxvY2tzO1xuICAgICAgICAgICAgdGhpcy5wYWlyRGlzdHJhY3RvcnMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgICovXG4gICAgICAgIG5CbG9ja3NUb0NvbWJpbmUgPSBNYXRoLm1pbihuQmxvY2tzVG9Db21iaW5lLCBuQmxvY2tzIC0gMyk7XG4gICAgICAgIC8vIE5ldmVyIGNvbWJpbmUgc28gd2hlcmUgdGhlcmUgYXJlIGxlc3MgdGhhbiB0aHJlZSBibG9ja3MgbGVmdFxuICAgICAgICAvLyBSZW1vdmUgZGlzdHJhY3RvcnNcbiAgICAgICAgZGlzdHJhY3RvcnMgPSB0aGlzLnNodWZmbGVkKGRpc3RyYWN0b3JzKTtcbiAgICAgICAgZGlzdHJhY3RvcnMgPSBkaXN0cmFjdG9ycy5zbGljZSgwLCBuVG9SZW1vdmUpO1xuICAgICAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYmxvY2sgPSBpbnB1dFtpXTtcbiAgICAgICAgICAgIGlmICghYmxvY2suaXNEaXN0cmFjdG9yKCkpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChibG9jayk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCQuaW5BcnJheShibG9jaywgZGlzdHJhY3RvcnMpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vdmFyIG91dHB1dCA9IGlucHV0O1xuICAgICAgICBpZiAoZ2l2ZUluZGVudGF0aW9uKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG91dHB1dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG91dHB1dFtpXS5hZGRJbmRlbnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaW5kZW50ID0gMDtcbiAgICAgICAgICAgIHRoaXMubm9pbmRlbnQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbWJpbmUgYmxvY2tzXG4gICAgICAgIHZhciBzb2x1dGlvbiA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBvdXRwdXQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAob3V0cHV0W2pdLmxpbmVzWzBdLmluZGV4ID09IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgc29sdXRpb24ucHVzaChvdXRwdXRbal0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5CbG9ja3NUb0NvbWJpbmU7IGkrKykge1xuICAgICAgICAgICAgLy8gY29tYmluZSBvbmUgc2V0IG9mIGJsb2Nrc1xuICAgICAgICAgICAgdmFyIGJlc3QgPSAtMTA7XG4gICAgICAgICAgICB2YXIgY29tYmluZUluZGV4ID0gLTEwO1xuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHNvbHV0aW9uLmxlbmd0aCAtIDE7IGorKykge1xuICAgICAgICAgICAgICAgIGJsb2NrID0gc29sdXRpb25bal07XG4gICAgICAgICAgICAgICAgdmFyIG5leHQgPSBzb2x1dGlvbltqICsgMV07XG4gICAgICAgICAgICAgICAgdmFyIHJhdGluZyA9IDEwIC0gYmxvY2subGluZXMubGVuZ3RoIC0gbmV4dC5saW5lcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdmFyIGJsb2NrSW5kZW50ID0gYmxvY2subWluaW11bUxpbmVJbmRlbnQoKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dEluZGVudCA9IG5leHQubWluaW11bUxpbmVJbmRlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2tJbmRlbnQgPT0gbmV4dEluZGVudCkge1xuICAgICAgICAgICAgICAgICAgICByYXRpbmcgKz0gMjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGJsb2NrSW5kZW50ID4gbmV4dEluZGVudCkge1xuICAgICAgICAgICAgICAgICAgICByYXRpbmcgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBibG9jay5saW5lc1tibG9jay5saW5lcy5sZW5ndGggLSAxXS5pbmRlbnQgPT1cbiAgICAgICAgICAgICAgICAgICAgbmV4dC5saW5lc1swXS5pbmRlbnRcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgcmF0aW5nICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyYXRpbmcgPj0gYmVzdCkge1xuICAgICAgICAgICAgICAgICAgICBiZXN0ID0gcmF0aW5nO1xuICAgICAgICAgICAgICAgICAgICBjb21iaW5lSW5kZXggPSBqO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJsb2NrID0gc29sdXRpb25bY29tYmluZUluZGV4XTtcbiAgICAgICAgICAgIG5leHQgPSBzb2x1dGlvbltjb21iaW5lSW5kZXggKyAxXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBuZXh0LmxpbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgYmxvY2suYWRkTGluZShuZXh0LmxpbmVzW2pdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBuZXdTb2x1dGlvbiA9IFtdO1xuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHNvbHV0aW9uLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGogIT09IGNvbWJpbmVJbmRleCArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3U29sdXRpb24ucHVzaChzb2x1dGlvbltqXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHNvbHV0aW9uID0gbmV3U29sdXRpb247XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVvcmRlclxuICAgICAgICB2YXIgY29tYmluZWRPdXRwdXQgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG91dHB1dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHNvbHV0aW9uLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKG91dHB1dFtpXS5saW5lc1swXS5pbmRleCA9PSBzb2x1dGlvbltqXS5saW5lc1swXS5pbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBjb21iaW5lZE91dHB1dC5wdXNoKHNvbHV0aW9uW2pdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbWJpbmVkT3V0cHV0O1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYW4gYXJyYXkgb2YgY29kZSBibG9ja3MgYmFzZWQgb24gd2hhdCBpcyBzcGVjaWZpZWQgaW4gdGhlIHByb2JsZW1cbiAgICBibG9ja3NGcm9tU291cmNlKCkge1xuICAgICAgICB2YXIgdW5vcmRlcmVkQmxvY2tzID0gW107XG4gICAgICAgIHZhciBvcmlnaW5hbEJsb2NrcyA9IFtdO1xuICAgICAgICB2YXIgYmxvY2tzID0gW107XG4gICAgICAgIHZhciBsaW5lcyA9IFtdO1xuICAgICAgICB2YXIgYmxvY2ssIGxpbmUsIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsaW5lID0gdGhpcy5saW5lc1tpXTtcbiAgICAgICAgICAgIGxpbmVzLnB1c2gobGluZSk7XG4gICAgICAgICAgICBpZiAoIWxpbmUuZ3JvdXBXaXRoTmV4dCkge1xuICAgICAgICAgICAgICAgIHVub3JkZXJlZEJsb2Nrcy5wdXNoKG5ldyBQYXJzb25zQmxvY2sodGhpcywgbGluZXMpKTtcbiAgICAgICAgICAgICAgICBsaW5lcyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG9yaWdpbmFsQmxvY2tzID0gdW5vcmRlcmVkQmxvY2tzO1xuICAgICAgICAvLyBUcmltIHRoZSBkaXN0cmFjdG9yc1xuICAgICAgICB2YXIgcmVtb3ZlZEJsb2NrcyA9IFtdO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm1heGRpc3QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdmFyIG1heGRpc3QgPSB0aGlzLm9wdGlvbnMubWF4ZGlzdDtcbiAgICAgICAgICAgIHZhciBkaXN0cmFjdG9ycyA9IFtdO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHVub3JkZXJlZEJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGJsb2NrID0gdW5vcmRlcmVkQmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChibG9jay5saW5lc1swXS5kaXN0cmFjdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RyYWN0b3JzLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXhkaXN0IDwgZGlzdHJhY3RvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZGlzdHJhY3RvcnMgPSB0aGlzLnNodWZmbGVkKGRpc3RyYWN0b3JzKTtcbiAgICAgICAgICAgICAgICBkaXN0cmFjdG9ycyA9IGRpc3RyYWN0b3JzLnNsaWNlKDAsIG1heGRpc3QpO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB1bm9yZGVyZWRCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sgPSB1bm9yZGVyZWRCbG9ja3NbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jay5saW5lc1swXS5kaXN0cmFjdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJC5pbkFycmF5KGJsb2NrLCBkaXN0cmFjdG9ycykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZEJsb2Nrcy5wdXNoKGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHVub3JkZXJlZEJsb2NrcyA9IGJsb2NrcztcbiAgICAgICAgICAgICAgICBibG9ja3MgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoaXMgaXMgbmVjZXNzYXJ5LCBzZXQgdGhlIHBhaXJEaXN0cmFjdG9ycyB2YWx1ZSBiZWZvcmUgYmxvY2tzIGdldCBzaHVmZmxlZCAtIFdpbGxpYW0gTGkgKEF1Z3VzdCAyMDIwKVxuICAgICAgICBpZiAodGhpcy5yZWNlbnRBdHRlbXB0cyA8IDIpIHtcbiAgICAgICAgICAgIC8vIDEgVHJ5XG4gICAgICAgICAgICB0aGlzLnBhaXJEaXN0cmFjdG9ycyA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYWlyRGlzdHJhY3RvcnMgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5vcmRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBTaHVmZmxlLCByZXNwZWN0aW5nIHBhaXJlZCBkaXN0cmFjdG9yc1xuICAgICAgICAgICAgdmFyIGNodW5rcyA9IFtdLFxuICAgICAgICAgICAgICAgIGNodW5rID0gW107XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdW5vcmRlcmVkQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYmxvY2sgPSB1bm9yZGVyZWRCbG9ja3NbaV07XG4gICAgICAgICAgICAgICAgaWYgKGJsb2NrLmxpbmVzWzBdLnBhaXJlZCAmJiB0aGlzLnBhaXJEaXN0cmFjdG9ycykge1xuICAgICAgICAgICAgICAgICAgICAvLyBXaWxsaWFtIExpIChBdWd1c3QgMjAyMClcbiAgICAgICAgICAgICAgICAgICAgY2h1bmsucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2h1bmsgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgY2h1bmsucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgICAgIGNodW5rcy5wdXNoKGNodW5rKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjaHVua3MgPSB0aGlzLnNodWZmbGVkKGNodW5rcyk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2h1bmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY2h1bmsgPSBjaHVua3NbaV07XG4gICAgICAgICAgICAgICAgaWYgKGNodW5rLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2h1ZmZsZSBwYWlyZWQgZGlzdHJhY3RvcnNcbiAgICAgICAgICAgICAgICAgICAgY2h1bmsgPSB0aGlzLnNodWZmbGVkKGNodW5rKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGNodW5rLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBibG9ja3MucHVzaChjaHVua1tqXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBibG9ja3MucHVzaChjaHVua1swXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gT3JkZXIgYWNjb3JkaW5nIHRvIG9yZGVyIHNwZWNpZmllZFxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMub3B0aW9ucy5vcmRlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGJsb2NrID0gb3JpZ2luYWxCbG9ja3NbdGhpcy5vcHRpb25zLm9yZGVyW2ldXTtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgJC5pbkFycmF5KHRoaXMub3B0aW9ucy5vcmRlcltpXSwgcmVtb3ZlZEJsb2NrcykgPCAwXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYWlyRGlzdHJhY3RvcnMgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFkYXB0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLmxpbWl0RGlzdHJhY3RvcnMgPSB0cnVlO1xuICAgICAgICAgICAgYmxvY2tzID0gdGhpcy5hZGFwdEJsb2NrcyhibG9ja3MpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmxpbWl0RGlzdHJhY3RvcnMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcmVtb3ZlZEJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLm9yZGVyID09IHVuZGVmaW5lZCA/XG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgwLCBibG9ja3MubGVuZ3RoKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAkLmluQXJyYXkocmVtb3ZlZEJsb2Nrc1tpXSwgdGhpcy5vcHRpb25zLm9yZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnNwbGljZShpbmRleCwgMCwgb3JpZ2luYWxCbG9ja3NbcmVtb3ZlZEJsb2Nrc1tpXV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wYWlyRGlzdHJhY3RvcnMgJiYgdGhpcy5vcHRpb25zLm9yZGVyICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy9tb3ZlIHBhaXJzIHRvZ2V0aGVyXG4gICAgICAgICAgICAvL0dvIHRocm91Z2ggYXJyYXkgbG9va2luZyBmb3IgZGl0cmFjdG9yIGFuZCBpdHMgcGFpclxuICAgICAgICAgICAgZm9yIChpID0gMTsgaSA8IG9yaWdpbmFsQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbEJsb2Nrc1tpXS5saW5lc1swXS5wYWlyZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgJC5pbkFycmF5KG9yaWdpbmFsQmxvY2tzW2ldLCBibG9ja3MpID49IDBcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGogPSBpO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoJC5pbkFycmF5KG9yaWdpbmFsQmxvY2tzW2ogLSAxXSwgYmxvY2tzKSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpbmQgdGhlIHBhaXJlZCBkaXN0cmFjdG9yIG9yIHNvbHV0aW9uIGJsb2NrIGl0IHdpbGwgYmUgbmV4dCB0b1xuICAgICAgICAgICAgICAgICAgICAgICAgai0tO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmRleFRvID0gJC5pbkFycmF5KG9yaWdpbmFsQmxvY2tzW2ogLSAxXSwgYmxvY2tzKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4RnJvbSA9ICQuaW5BcnJheShvcmlnaW5hbEJsb2Nrc1tpXSwgYmxvY2tzKTtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnNwbGljZShpbmRleEZyb20sIDEpO1xuICAgICAgICAgICAgICAgICAgICBibG9ja3Muc3BsaWNlKGluZGV4VG8sIDAsIG9yaWdpbmFsQmxvY2tzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJsb2NrcztcbiAgICB9XG4gICAgLy8gUmV0dXJuIGEgY29kZWJsb2NrIHRoYXQgY29ycmVzcG9uZHMgdG8gdGhlIGhhc2hcbiAgICBibG9ja0Zyb21IYXNoKGhhc2gpIHtcbiAgICAgICAgdmFyIHNwbGl0ID0gaGFzaC5zcGxpdChcIl9cIik7XG4gICAgICAgIHZhciBsaW5lcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNwbGl0Lmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgbGluZXMucHVzaCh0aGlzLmxpbmVzW3NwbGl0W2ldXSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGJsb2NrID0gbmV3IFBhcnNvbnNCbG9jayh0aGlzLCBsaW5lcyk7XG4gICAgICAgIGlmICh0aGlzLm5vaW5kZW50KSB7XG4gICAgICAgICAgICBibG9jay5pbmRlbnQgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmxvY2suaW5kZW50ID0gTnVtYmVyKHNwbGl0W3NwbGl0Lmxlbmd0aCAtIDFdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmxvY2s7XG4gICAgfVxuICAgIC8vIFJldHVybiBhbiBhcnJheSBvZiBjb2RlYmxvY2tzIHRoYXQgY29ycmVzcG9uZHMgdG8gdGhlIGhhc2hcbiAgICBibG9ja3NGcm9tSGFzaChoYXNoKSB7XG4gICAgICAgIHZhciBzcGxpdDtcbiAgICAgICAgaWYgKGhhc2ggPT09IFwiLVwiIHx8IGhhc2ggPT09IFwiXCIgfHwgaGFzaCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgc3BsaXQgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNwbGl0ID0gaGFzaC5zcGxpdChcIi1cIik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGJsb2NrcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNwbGl0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBibG9ja3MucHVzaCh0aGlzLmJsb2NrRnJvbUhhc2goc3BsaXRbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFkYXB0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hZGFwdEJsb2NrcyhibG9ja3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGJsb2NrcztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBSZXR1cm4gYSBibG9jayBvYmplY3QgYnkgdGhlIGZ1bGwgaWQgaW5jbHVkaW5nIGlkIHByZWZpeFxuICAgIGdldEJsb2NrQnlJZChpZCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGlmIChibG9jay52aWV3LmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJsb2NrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vIFJldHVybiBhcnJheSBvZiBjb2RlYmxvY2tzIHRoYXQgYXJlIHRoZSBzb2x1dGlvblxuICAgIHNvbHV0aW9uQmxvY2tzKCkge1xuICAgICAgICB2YXIgc29sdXRpb25CbG9ja3MgPSBbXTtcbiAgICAgICAgdmFyIHNvbHV0aW9uTGluZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubGluZXNbaV0uZGlzdHJhY3Rvcikge1xuICAgICAgICAgICAgICAgIHNvbHV0aW9uTGluZXMucHVzaCh0aGlzLmxpbmVzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgYmxvY2sgPSBzb2x1dGlvbkxpbmVzWzBdLmJsb2NrKCk7XG4gICAgICAgIHNvbHV0aW9uQmxvY2tzLnB1c2goYmxvY2spO1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHNvbHV0aW9uTGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBuZXh0QmxvY2sgPSBzb2x1dGlvbkxpbmVzW2ldLmJsb2NrKCk7XG4gICAgICAgICAgICBpZiAoYmxvY2sgIT09IG5leHRCbG9jaykge1xuICAgICAgICAgICAgICAgIGJsb2NrID0gbmV4dEJsb2NrO1xuICAgICAgICAgICAgICAgIHNvbHV0aW9uQmxvY2tzLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzb2x1dGlvbkJsb2NrcztcbiAgICB9XG4gICAgLy8gUmV0dXJuIGFycmF5IG9mIGNvZGVibG9ja3MgYmFzZWQgb24gd2hhdCBpcyBpbiB0aGUgc291cmNlIGZpZWxkXG4gICAgc291cmNlQmxvY2tzKCkge1xuICAgICAgICB2YXIgc291cmNlQmxvY2tzID0gW107XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuc291cmNlQXJlYS5jaGlsZE5vZGVzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmICgkKGNoaWxkKS5oYXNDbGFzcyhcImJsb2NrXCIpKSB7XG4gICAgICAgICAgICAgICAgc291cmNlQmxvY2tzLnB1c2godGhpcy5nZXRCbG9ja0J5SWQoY2hpbGQuaWQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc291cmNlQmxvY2tzO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYXJyYXkgb2YgZW5hYmxlZCBjb2RlYmxvY2tzIGJhc2VkIG9uIHdoYXQgaXMgaW4gdGhlIHNvdXJjZSBmaWVsZFxuICAgIGVuYWJsZWRTb3VyY2VCbG9ja3MoKSB7XG4gICAgICAgIHZhciBhbGwgPSB0aGlzLnNvdXJjZUJsb2NrcygpO1xuICAgICAgICB2YXIgZW5hYmxlZCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGJsb2NrID0gYWxsW2ldO1xuICAgICAgICAgICAgaWYgKGJsb2NrLmVuYWJsZWQoKSkge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQucHVzaChibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVuYWJsZWQ7XG4gICAgfVxuICAgIC8vIFJldHVybiBhcnJheSBvZiBjb2RlYmxvY2tzIGJhc2VkIG9uIHdoYXQgaXMgaW4gdGhlIGFuc3dlciBmaWVsZFxuICAgIGFuc3dlckJsb2NrcygpIHtcbiAgICAgICAgdmFyIGFuc3dlckJsb2NrcyA9IFtdO1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmFuc3dlckFyZWEuY2hpbGROb2RlcztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGJsb2NrID0gdGhpcy5nZXRCbG9ja0J5SWQoY2hpbGRyZW5baV0uaWQpO1xuICAgICAgICAgICAgaWYgKGJsb2NrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhbnN3ZXJCbG9ja3MucHVzaChibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFuc3dlckJsb2NrcztcbiAgICB9XG4gICAgLy8gUmV0dXJuIGFycmF5IG9mIGVuYWJsZWQgY29kZWJsb2NrcyBiYXNlZCBvbiB3aGF0IGlzIGluIHRoZSBhbnN3ZXIgZmllbGRcbiAgICBlbmFibGVkQW5zd2VyQmxvY2tzKCkge1xuICAgICAgICB2YXIgYWxsID0gdGhpcy5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgdmFyIGVuYWJsZWQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBibG9jayA9IGFsbFtpXTtcbiAgICAgICAgICAgIGlmIChibG9jay5lbmFibGVkKCkpIHtcbiAgICAgICAgICAgICAgICBlbmFibGVkLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbmFibGVkO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYXJyYXkgb2YgY29kZWxpbmVzIGJhc2VkIG9uIHdoYXQgaXMgaW4gdGhlIGFuc3dlciBmaWVsZFxuICAgIGFuc3dlckxpbmVzKCkge1xuICAgICAgICB2YXIgYW5zd2VyTGluZXMgPSBbXTtcbiAgICAgICAgdmFyIGJsb2NrcyA9IHRoaXMuYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYmxvY2sgPSBibG9ja3NbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGJsb2NrLmxpbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgYW5zd2VyTGluZXMucHVzaChibG9jay5saW5lc1tqXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFuc3dlckxpbmVzO1xuICAgIH1cbiAgICAvLyBHbyB1cCB0aGUgaGllcmFyY2h5IHVudGlsIHlvdSBnZXQgdG8gYSBibG9jazsgcmV0dXJuIHRoYXQgYmxvY2sgZWxlbWVudFxuICAgIGdldEJsb2NrRm9yKGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGNoZWNrID0gZWxlbWVudDtcbiAgICAgICAgd2hpbGUgKCFjaGVjay5jbGFzc0xpc3QuY29udGFpbnMoXCJibG9ja1wiKSkge1xuICAgICAgICAgICAgY2hlY2sgPSBjaGVjay5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGVjaztcbiAgICB9XG4gICAgLy8gUmV0dXJuIHRoZSBtYXhpbXVtIGluZGVudCBmb3IgdGhlIHNvbHV0aW9uXG4gICAgc29sdXRpb25JbmRlbnQoKSB7XG4gICAgICAgIHZhciBpbmRlbnQgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGluZGVudCA9IE1hdGgubWF4KGluZGVudCwgYmxvY2suc29sdXRpb25JbmRlbnQoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluZGVudDtcbiAgICB9XG4gICAgLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSBBQ1RJT04gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgLy8gVGhlIFwiQ2hlY2sgTWVcIiBidXR0b24gd2FzIHByZXNzZWQuXG4gICAgY2hlY2tDdXJyZW50QW5zd2VyKCkge1xuICAgICAgICBpZiAoIXRoaXMuaGFzU29sdmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrQ291bnQrKztcbiAgICAgICAgICAgIHRoaXMuY2xlYXJGZWVkYmFjaygpO1xuICAgICAgICAgICAgaWYgKHRoaXMuYWRhcHRpdmVJZCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkYXB0aXZlSWQgPSB0aGlzLnN0b3JhZ2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFRPRE8gLSByZW5kZXJpbmcgZmVlZGJhY2sgaXMgYnVyaWVkIGluIHRoZSBncmFkZXIuZ3JhZGUgbWV0aG9kLlxuICAgICAgICAgICAgLy8gdG8gZGlzYWJsZSBmZWVkYmFjayBzZXQgdGhpcy5ncmFkZXIuc2hvd2ZlZWRiYWNrIGJvb2xlYW5cbiAgICAgICAgICAgIHRoaXMuZ3JhZGVyLnNob3dmZWVkYmFjayA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5ncmFkZSA9IHRoaXMuZ3JhZGVyLmdyYWRlKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5ncmFkZSA9PSBcImNvcnJlY3RcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFzU29sdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSB0cnVlO1xuICAgICAgICAgICAgICAgICQodGhpcy5jaGVja0J1dHRvbikucHJvcChcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuYWRhcHRpdmVJZCArIFwiU29sdmVkXCIsIHRydWUpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVjZW50QXR0ZW1wdHMgPSB0aGlzLmNoZWNrQ291bnQ7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRhcHRpdmVJZCArIFwicmVjZW50QXR0ZW1wdHNcIixcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWNlbnRBdHRlbXB0c1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgICAgICAgICB0aGlzLmFkYXB0aXZlSWQgKyB0aGlzLmRpdmlkICsgXCJDb3VudFwiLFxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tDb3VudFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKCk7XG4gICAgICAgICAgICAvLyBpZiBub3Qgc29sdmVkIGFuZCBub3QgdG9vIHNob3J0IHRoZW4gY2hlY2sgaWYgc2hvdWxkIHByb3ZpZGUgaGVscFxuICAgICAgICAgICAgaWYgKCF0aGlzLmhhc1NvbHZlZCAmJiB0aGlzLmdyYWRlICE9PSBcImluY29ycmVjdFRvb1Nob3J0XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jYW5IZWxwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgY291bnQgdGhlIGF0dGVtcHQgaWYgdGhlIGFuc3dlciBpcyBkaWZmZXJlbnQgKHRvIHByZXZlbnQgZ2FtaW5nKVxuICAgICAgICAgICAgICAgICAgICB2YXIgYW5zd2VySGFzaCA9IHRoaXMuYW5zd2VySGFzaCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXN0QW5zd2VySGFzaCAhPT0gYW5zd2VySGFzaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5udW1EaXN0aW5jdCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0QW5zd2VySGFzaCA9IGFuc3dlckhhc2g7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGltZSB0byBvZmZlciBoZWxwXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm51bURpc3RpbmN0ID09IDMgJiYgIXRoaXMuZ290SGVscCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJC5pMThuKFwibXNnX3BhcnNvbl9oZWxwX2luZm9cIikpO1xuICAgICAgICAgICAgICAgICAgICB9IC8vIGVuZCBpZlxuICAgICAgICAgICAgICAgIH0gLy8gZW5kIGlmIGNhbiBoZWxwXG4gICAgICAgICAgICB9IC8vIGVuZCBpZiBub3Qgc29sdmVkXG4gICAgICAgIH0gLy8gZW5kIG91dGVyIGlmIG5vdCBzb2x2ZWRcbiAgICB9XG5cbiAgICByZW5kZXJGZWVkYmFjaygpIHtcbiAgICAgICAgdGhpcy5ncmFkZXIuc2hvd2ZlZWRiYWNrID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ncmFkZSA9IHRoaXMuZ3JhZGVyLmdyYWRlclN0YXRlO1xuICAgICAgICB2YXIgZmVlZGJhY2tBcmVhO1xuICAgICAgICB2YXIgYW5zd2VyQXJlYSA9ICQodGhpcy5hbnN3ZXJBcmVhKTtcblxuICAgICAgICBpZiAodGhpcy5zaG93ZmVlZGJhY2sgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGZlZWRiYWNrQXJlYSA9ICQodGhpcy5tZXNzYWdlRGl2KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZlZWRiYWNrQXJlYSA9ICQoXCIjZG9lc25vdGV4aXN0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ3JhZGUgPT09IFwiY29ycmVjdFwiKSB7XG4gICAgICAgICAgICBhbnN3ZXJBcmVhLmFkZENsYXNzKFwiY29ycmVjdFwiKTtcbiAgICAgICAgICAgIGZlZWRiYWNrQXJlYS5mYWRlSW4oMTAwKTtcbiAgICAgICAgICAgIGZlZWRiYWNrQXJlYS5hdHRyKFwiY2xhc3NcIiwgXCJhbGVydCBhbGVydC1pbmZvXCIpO1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tDb3VudCA+IDEpIHtcbiAgICAgICAgICAgICAgICBmZWVkYmFja0FyZWEuaHRtbChcbiAgICAgICAgICAgICAgICAgICAgJC5pMThuKFwibXNnX3BhcnNvbl9jb3JyZWN0XCIsIHRoaXMuY2hlY2tDb3VudClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmZWVkYmFja0FyZWEuaHRtbCgkLmkxOG4oXCJtc2dfcGFyc29uX2NvcnJlY3RfZmlyc3RfdHJ5XCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdyYWRlID09PSBcImluY29ycmVjdFRvb1Nob3J0XCIpIHtcbiAgICAgICAgICAgIC8vIHRvbyBsaXR0bGUgY29kZVxuICAgICAgICAgICAgYW5zd2VyQXJlYS5hZGRDbGFzcyhcImluY29ycmVjdFwiKTtcbiAgICAgICAgICAgIGZlZWRiYWNrQXJlYS5mYWRlSW4oNTAwKTtcbiAgICAgICAgICAgIGZlZWRiYWNrQXJlYS5hdHRyKFwiY2xhc3NcIiwgXCJhbGVydCBhbGVydC1kYW5nZXJcIik7XG4gICAgICAgICAgICBmZWVkYmFja0FyZWEuaHRtbCgkLmkxOG4oXCJtc2dfcGFyc29uX3Rvb19zaG9ydFwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ncmFkZSA9PT0gXCJpbmNvcnJlY3RJbmRlbnRcIikge1xuICAgICAgICAgICAgdmFyIGluY29ycmVjdEJsb2NrcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdyYWRlci5pbmRlbnRMZWZ0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYmxvY2sgPSB0aGlzLmdyYWRlci5pbmRlbnRMZWZ0W2ldLmJsb2NrKCk7XG4gICAgICAgICAgICAgICAgaWYgKGluY29ycmVjdEJsb2Nrcy5pbmRleE9mKGJsb2NrKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBpbmNvcnJlY3RCbG9ja3MucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgICAgICQoYmxvY2sudmlldykuYWRkQ2xhc3MoXCJpbmRlbnRMZWZ0XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ncmFkZXIuaW5kZW50UmlnaHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBibG9jayA9IHRoaXMuZ3JhZGVyLmluZGVudFJpZ2h0W2ldLmJsb2NrKCk7XG4gICAgICAgICAgICAgICAgaWYgKGluY29ycmVjdEJsb2Nrcy5pbmRleE9mKGJsb2NrKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBpbmNvcnJlY3RCbG9ja3MucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgICAgICQoYmxvY2sudmlldykuYWRkQ2xhc3MoXCJpbmRlbnRSaWdodFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmZWVkYmFja0FyZWEuZmFkZUluKDUwMCk7XG4gICAgICAgICAgICBmZWVkYmFja0FyZWEuYXR0cihcImNsYXNzXCIsIFwiYWxlcnQgYWxlcnQtZGFuZ2VyXCIpO1xuICAgICAgICAgICAgaWYgKGluY29ycmVjdEJsb2Nrcy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgIGZlZWRiYWNrQXJlYS5odG1sKCQuaTE4bihcIm1zZ19wYXJzb25fd3JvbmdfaW5kZW50XCIpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmVlZGJhY2tBcmVhLmh0bWwoJC5pMThuKFwibXNnX3BhcnNvbl93cm9uZ19pbmRlbnRzXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdyYWRlID09PSBcImluY29ycmVjdE1vdmVCbG9ja3NcIikge1xuICAgICAgICAgICAgdmFyIGFuc3dlckJsb2NrcyA9IHRoaXMuYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgICAgICB2YXIgaW5Tb2x1dGlvbiA9IFtdO1xuICAgICAgICAgICAgdmFyIGluU29sdXRpb25JbmRleGVzID0gW107XG4gICAgICAgICAgICB2YXIgbm90SW5Tb2x1dGlvbiA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbnN3ZXJCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYmxvY2sgPSBhbnN3ZXJCbG9ja3NbaV07XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5zb2x1dGlvbi5pbmRleE9mKGJsb2NrLmxpbmVzWzBdKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgbm90SW5Tb2x1dGlvbi5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpblNvbHV0aW9uLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICBpblNvbHV0aW9uSW5kZXhlcy5wdXNoKGluZGV4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbGlzSW5kZXhlcyA9IHRoaXMuZ3JhZGVyLmludmVyc2VMSVNJbmRpY2VzKFxuICAgICAgICAgICAgICAgIGluU29sdXRpb25JbmRleGVzLFxuICAgICAgICAgICAgICAgIGluU29sdXRpb25cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc0luZGV4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBub3RJblNvbHV0aW9uLnB1c2goaW5Tb2x1dGlvbltsaXNJbmRleGVzW2ldXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhbnN3ZXJBcmVhLmFkZENsYXNzKFwiaW5jb3JyZWN0XCIpO1xuICAgICAgICAgICAgZmVlZGJhY2tBcmVhLmZhZGVJbig1MDApO1xuICAgICAgICAgICAgZmVlZGJhY2tBcmVhLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWRhbmdlclwiKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNob3dmZWVkYmFjayA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm90SW5Tb2x1dGlvbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAkKG5vdEluU29sdXRpb25baV0udmlldykuYWRkQ2xhc3MoXCJpbmNvcnJlY3RQb3NpdGlvblwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmZWVkYmFja0FyZWEuaHRtbCgkLmkxOG4oXCJtc2dfcGFyc29uX3dyb25nX29yZGVyXCIpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gQURBUFRJVkUgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuICAgIC8vIEluaXRpYWxpemUgdGhpcyBwcm9ibGVtIGFzIGFkYXB0aXZlXG4gICAgLy8gICAgaGVscENvdW50ID0gbnVtYmVyIG9mIGNoZWNrcyBiZWZvcmUgaGVscCBpcyBnaXZlbiAobmVnYXRpdmUpXG4gICAgLy8gICAgY2FuSGVscCA9IGJvb2xlYW4gYXMgdG8gd2hldGhlciBoZWxwIGNhbiBiZSBwcm92aWRlZFxuICAgIC8vICAgIGNoZWNrQ291bnQgPSBob3cgbWFueSB0aW1lcyBpdCBoYXMgYmVlbiBjaGVja2VkIGJlZm9yZSBjb3JyZWN0XG4gICAgLy8gICAgdXNlclJhdGluZyA9IDAuLjEwMCBob3cgZ29vZCB0aGUgcGVyc29uIGlzIGF0IHNvbHZpbmcgcHJvYmxlbXNcbiAgICBpbml0aWFsaXplQWRhcHRpdmUoKSB7XG4gICAgICAgIHRoaXMuYWRhcHRpdmVJZCA9IHN1cGVyLmxvY2FsU3RvcmFnZUtleSgpO1xuICAgICAgICB0aGlzLmNhbkhlbHAgPSB0cnVlO1xuICAgICAgICAvL3RoaXMuaGVscENvdW50ID0gLTM7IC8vIE51bWJlciBvZiBjaGVja3MgYmVmb3JlIGhlbHAgaXMgb2ZmZXJlZFxuICAgICAgICB0aGlzLmNoZWNrQ291bnQgPSAwO1xuICAgICAgICB0aGlzLm51bURpc3RpbmN0ID0gMDsgLy8gbnVtYmVyIG9mIGRpc3RpbmN0IHNvbHV0aW9uIGF0dGVtcHRzIChkaWZmZXJlbnQgZnJvbSBwcmV2aW91cylcbiAgICAgICAgdGhpcy5nb3RIZWxwID0gZmFsc2U7XG4gICAgICAgIC8vIEluaXRpYWxpemUgdGhlIHVzZXJSYXRpbmdcbiAgICAgICAgdmFyIHN0b3JhZ2VQcm9ibGVtID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5hZGFwdGl2ZUlkICsgXCJQcm9ibGVtXCIpO1xuICAgICAgICBpZiAoc3RvcmFnZVByb2JsZW0gPT0gdGhpcy5kaXZpZCkge1xuICAgICAgICAgICAgLy8gQWxyZWFkeSBpbiB0aGlzIHByb2JsZW1cbiAgICAgICAgICAgIHRoaXMuY2hlY2tDb3VudCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFxuICAgICAgICAgICAgICAgIHRoaXMuYWRhcHRpdmVJZCArIHRoaXMuZGl2aWQgKyBcIkNvdW50XCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0NvdW50ID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tDb3VudCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICB2YXIgY291bnQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcbiAgICAgICAgICAgIHRoaXMuYWRhcHRpdmVJZCArIHRoaXMuZGl2aWQgKyBcIkNvdW50XCJcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGNvdW50ID09IHVuZGVmaW5lZCB8fCBjb3VudCA9PSBcIk5hTlwiKSB7XG4gICAgICAgICAgICBjb3VudCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGVja0NvdW50ID0gY291bnQ7XG4gICAgICAgIHRoaXMucmVjZW50QXR0ZW1wdHMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcbiAgICAgICAgICAgIHRoaXMuYWRhcHRpdmVJZCArIFwicmVjZW50QXR0ZW1wdHNcIlxuICAgICAgICApO1xuICAgICAgICBpZiAodGhpcy5yZWNlbnRBdHRlbXB0cyA9PSB1bmRlZmluZWQgfHwgdGhpcy5yZWNlbnRBdHRlbXB0cyA9PSBcIk5hTlwiKSB7XG4gICAgICAgICAgICB0aGlzLnJlY2VudEF0dGVtcHRzID0gMztcbiAgICAgICAgfVxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgICAgIHRoaXMuYWRhcHRpdmVJZCArIFwicmVjZW50QXR0ZW1wdHNcIixcbiAgICAgICAgICAgIHRoaXMucmVjZW50QXR0ZW1wdHNcbiAgICAgICAgKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5hZGFwdGl2ZUlkICsgXCJQcm9ibGVtXCIsIHRoaXMuZGl2aWQpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgICAgIHRoaXMuYWRhcHRpdmVJZCArIHRoaXMuZGl2aWQgKyBcIkNvdW50XCIsXG4gICAgICAgICAgICB0aGlzLmNoZWNrQ291bnRcbiAgICAgICAgKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5hZGFwdGl2ZUlkICsgXCJTb2x2ZWRcIiwgZmFsc2UpO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYSBib29sZWFuIG9mIHdoZXRoZXIgdGhlIHVzZXIgbXVzdCBkZWFsIHdpdGggaW5kZW50YXRpb25cbiAgICB1c2VzSW5kZW50YXRpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLm5vaW5kZW50IHx8IHRoaXMuc29sdXRpb25JbmRlbnQoKSA9PSAwKSB7XG4gICAgICAgICAgICAvLyB3YXMgJCh0aGlzLmFuc3dlckFyZWEpLmhhc0NsYXNzKFwiYW5zd2VyXCIpIC0gYmplIGNoYW5nZWRcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEZpbmQgYSBkaXN0cmFjdG9yIHRvIHJlbW92ZSB0byBtYWtlIHRoZSBwcm9ibGVtIGVhc2llclxuICAgIC8vICAqIHRyeSBmaXJzdCBpbiB0aGUgYW5zd2VyIGFyZWFcbiAgICAvLyAgKiBpZiBub3QsIHRyeSB0aGUgc291cmNlIGFyZWFcbiAgICAvLyAgKiBpZiBub3QsIHJldHVybiB1bmRlZmluZWRcbiAgICBkaXN0cmFjdG9yVG9SZW1vdmUoKSB7XG4gICAgICAgIHZhciBibG9ja3MgPSB0aGlzLmVuYWJsZWRBbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgdmFyIGJsb2NrO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYmxvY2sgPSBibG9ja3NbaV07XG4gICAgICAgICAgICBpZiAoYmxvY2suaXNEaXN0cmFjdG9yKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmxvY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2tzID0gdGhpcy5lbmFibGVkU291cmNlQmxvY2tzKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBibG9jayA9IGJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGlmIChibG9jay5pc0Rpc3RyYWN0b3IoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBibG9jaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gdGhlIG51bWJlciBvZiBibG9ja3MgdGhhdCBleGlzdFxuICAgIG51bWJlck9mQmxvY2tzKGZJbmNsdWRlRGlzdHJhY3RvcnMgPSB0cnVlKSB7XG4gICAgICAgIHZhciBudW1iZXJPZkJsb2NrcyA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLmJsb2Nrc1tpXS5lbmFibGVkKCkgJiZcbiAgICAgICAgICAgICAgICAoZkluY2x1ZGVEaXN0cmFjdG9ycyB8fCAhdGhpcy5ibG9ja3NbaV0uaXNEaXN0cmFjdG9yKCkpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBudW1iZXJPZkJsb2NrcyArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudW1iZXJPZkJsb2NrcztcbiAgICB9XG4gICAgLy8gUmVtb3ZlIHRoaXMgZGlzdHJhY3RvcnMgdG8gbWFrZSB0aGUgcHJvYmxlbSBlYXNpZXJcbiAgICByZW1vdmVEaXN0cmFjdG9yKGJsb2NrKSB7XG4gICAgICAgIC8vIEFsZXJ0IHRoZSB1c2VyIHRvIHdoYXQgaXMgaGFwcGVuaW5nXG4gICAgICAgIHZhciBmZWVkYmFja0FyZWEgPSAkKHRoaXMubWVzc2FnZURpdik7XG4gICAgICAgIGZlZWRiYWNrQXJlYS5mYWRlSW4oNTAwKTtcbiAgICAgICAgZmVlZGJhY2tBcmVhLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWluZm9cIik7XG4gICAgICAgIGZlZWRiYWNrQXJlYS5odG1sKCQuaTE4bihcIm1zZ19wYXJzb25fbm90X3NvbHV0aW9uXCIpKTtcbiAgICAgICAgLy8gU3RvcCBhYmlsaXR5IHRvIHNlbGVjdFxuICAgICAgICBpZiAoYmxvY2subGluZXNbMF0uZGlzdHJhY3RIZWxwdGV4dCkge1xuICAgICAgICAgICAgYmxvY2sudmlldy5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRvZ2dsZVwiLCBcInRvb2x0aXBcIik7XG4gICAgICAgICAgICBibG9jay52aWV3LnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIGJsb2NrLmxpbmVzWzBdLmRpc3RyYWN0SGVscHRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGJsb2NrLmRpc2FibGUoKTtcbiAgICAgICAgLy8gSWYgaW4gYW5zd2VyIGFyZWEsIG1vdmUgdG8gc291cmNlIGFyZWFcbiAgICAgICAgaWYgKCFibG9jay5pblNvdXJjZUFyZWEoKSkge1xuICAgICAgICAgICAgdmFyIHNvdXJjZVJlY3QgPSB0aGlzLnNvdXJjZUFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICB2YXIgc3RhcnRYID0gYmxvY2sucGFnZVhDZW50ZXIoKSAtIDE7XG4gICAgICAgICAgICB2YXIgc3RhcnRZID0gYmxvY2sucGFnZVlDZW50ZXIoKTtcbiAgICAgICAgICAgIHZhciBlbmRYID1cbiAgICAgICAgICAgICAgICBzb3VyY2VSZWN0LmxlZnQgKyB3aW5kb3cucGFnZVhPZmZzZXQgKyBzb3VyY2VSZWN0LndpZHRoIC8gMjtcbiAgICAgICAgICAgIHZhciBlbmRZID1cbiAgICAgICAgICAgICAgICBzb3VyY2VSZWN0LnRvcCArXG4gICAgICAgICAgICAgICAgd2luZG93LnBhZ2VZT2Zmc2V0ICtcbiAgICAgICAgICAgICAgICBibG9jay52aWV3LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCAvIDI7XG4gICAgICAgICAgICB2YXIgc2xpZGVVbmRlckJsb2NrID0gYmxvY2suc2xpZGVVbmRlckJsb2NrKCk7XG4gICAgICAgICAgICBpZiAoc2xpZGVVbmRlckJsb2NrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBlbmRZICs9XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlVW5kZXJCbG9jay52aWV3LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCArIDIwO1xuICAgICAgICAgICAgICAgIGVuZFkgKz0gcGFyc2VJbnQoJChzbGlkZVVuZGVyQmxvY2sudmlldykuY3NzKFwidG9wXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgICQoYmxvY2sudmlldykuY3NzKHtcbiAgICAgICAgICAgICAgICBcImJvcmRlci1jb2xvclwiOiBcIiMwMDBcIixcbiAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogXCIjZmZmXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoYmxvY2sudmlldykuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMS4wLFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBNYXRoLnNxcnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhlbmRZIC0gc3RhcnRZLCAyKSArXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhlbmRYIC0gc3RhcnRYLCAyKVxuICAgICAgICAgICAgICAgICAgICApICpcbiAgICAgICAgICAgICAgICAgICAgNCArXG4gICAgICAgICAgICAgICAgICAgIDUwMCxcbiAgICAgICAgICAgICAgICBzdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQubW92aW5nID0gYmxvY2s7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQubW92aW5nWCA9IHN0YXJ0WDtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZpbmdZID0gc3RhcnRZO1xuICAgICAgICAgICAgICAgICAgICB0aGF0LnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHByb2dyZXNzOiBmdW5jdGlvbihhLCBwLCBjKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQubW92aW5nWCA9IHN0YXJ0WCAqICgxIC0gcCkgKyBlbmRYICogcDtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZpbmdZID0gc3RhcnRZICogKDEgLSBwKSArIGVuZFkgKiBwO1xuICAgICAgICAgICAgICAgICAgICB0aGF0LnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoYXQubW92aW5nO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhhdC5tb3ZpbmdYO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhhdC5tb3ZpbmdZO1xuICAgICAgICAgICAgICAgICAgICB0aGF0LnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgJChibG9jay52aWV3KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuMyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6IFwiI2QzZDNkM1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiI2VmZWZlZlwiLFxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGJsb2NrLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoYmxvY2sudmlldykuYWRkQ2xhc3MoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoYmxvY2sudmlldykuY3NzKHtcbiAgICAgICAgICAgICAgICBcImJvcmRlci1jb2xvclwiOiBcIiMwMDBcIixcbiAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogXCIjZmZmXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoYmxvY2sudmlldykuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMC4zLFxuICAgICAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6IFwiI2QzZDNkM1wiLFxuICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIiNlZmVmZWZcIixcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjAwMCxcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQoYmxvY2sudmlldykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEdpdmUgdGhlIHVzZXIgdGhlIGluZGVudGF0aW9uXG4gICAgcmVtb3ZlSW5kZW50YXRpb24oKSB7XG4gICAgICAgIC8vIEFsZXJ0IHRoZSB1c2VyIHRvIHdoYXQgaXMgaGFwcGVuaW5nXG4gICAgICAgIHZhciBmZWVkYmFja0FyZWEgPSAkKHRoaXMubWVzc2FnZURpdik7XG4gICAgICAgIGZlZWRiYWNrQXJlYS5mYWRlSW4oNTAwKTtcbiAgICAgICAgZmVlZGJhY2tBcmVhLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWluZm9cIik7XG4gICAgICAgIGZlZWRiYWNrQXJlYS5odG1sKCQuaTE4bihcIm1zZ19wYXJzb25fcHJvdmlkZWRfaW5kZW50XCIpKTtcbiAgICAgICAgLy8gTW92ZSBhbmQgcmVzaXplIGJsb2Nrc1xuICAgICAgICB2YXIgYmxvY2tXaWR0aCA9IDIwMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbGluZSA9IHRoaXMubGluZXNbaV07XG4gICAgICAgICAgICB2YXIgZXhwYW5kZWRXaWR0aCA9XG4gICAgICAgICAgICAgICAgbGluZS53aWR0aCArIGxpbmUuaW5kZW50ICogdGhpcy5vcHRpb25zLnBpeGVsc1BlckluZGVudCArIDMwO1xuICAgICAgICAgICAgYmxvY2tXaWR0aCA9IE1hdGgubWF4KGJsb2NrV2lkdGgsIGV4cGFuZGVkV2lkdGgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubnVtYmVyZWQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBibG9ja1dpZHRoICs9IDI1O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXJlYVdpZHRoID0gYmxvY2tXaWR0aCArIDIyO1xuICAgICAgICB2YXIgYmxvY2ssIGluZGVudDtcbiAgICAgICAgdmFyIHNvdXJjZUJsb2NrcyA9IHRoaXMuc291cmNlQmxvY2tzKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc291cmNlQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBibG9jayA9IHNvdXJjZUJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGluZGVudCA9IGJsb2NrLnNvbHV0aW9uSW5kZW50KCk7XG4gICAgICAgICAgICBpZiAoaW5kZW50ID09IDApIHtcbiAgICAgICAgICAgICAgICAkKGJsb2NrLnZpZXcpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogYmxvY2tXaWR0aCxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKGJsb2NrLnZpZXcpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogYmxvY2tXaWR0aCAtIGluZGVudCAqIHRoaXMub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgIFwicGFkZGluZy1sZWZ0XCI6IGluZGVudCAqIHRoaXMub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQgKyAxMCxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYWlyZWREaXZzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAkKHRoaXMucGFpcmVkRGl2c1tpXSkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgd2lkdGg6IGJsb2NrV2lkdGggKyAzNCxcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhbnN3ZXJCbG9ja3MgPSB0aGlzLmFuc3dlckJsb2NrcygpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFuc3dlckJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYmxvY2sgPSBhbnN3ZXJCbG9ja3NbaV07XG4gICAgICAgICAgICBpbmRlbnQgPSBibG9jay5zb2x1dGlvbkluZGVudCgpO1xuICAgICAgICAgICAgaWYgKGluZGVudCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgJChibG9jay52aWV3KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGJsb2NrV2lkdGgsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChibG9jay52aWV3KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGJsb2NrV2lkdGggLSBpbmRlbnQgKiB0aGlzLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50LFxuICAgICAgICAgICAgICAgICAgICBcInBhZGRpbmctbGVmdFwiOiBpbmRlbnQgKiB0aGlzLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50ICsgMTAsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBSZXNpemUgYW5zd2VyIGFuZCBzb3VyY2UgYXJlYVxuICAgICAgICAkKHRoaXMuYW5zd2VyQXJlYSkucmVtb3ZlQ2xhc3MoXCJhbnN3ZXIxIGFuc3dlcjIgYW5zd2VyMyBhbnN3ZXI0XCIpO1xuICAgICAgICAkKHRoaXMuYW5zd2VyQXJlYSkuYWRkQ2xhc3MoXCJhbnN3ZXJcIik7XG4gICAgICAgIHRoaXMuaW5kZW50ID0gMDtcbiAgICAgICAgdGhpcy5ub2luZGVudCA9IHRydWU7XG4gICAgICAgICQodGhpcy5zb3VyY2VBcmVhKS5hbmltYXRlKHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmFyZWFXaWR0aCArIDIsXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxuICAgICAgICB9KTtcbiAgICAgICAgJCh0aGlzLmFuc3dlckFyZWEpLmFuaW1hdGUoe1xuICAgICAgICAgICAgd2lkdGg6IHRoaXMuYXJlYVdpZHRoICsgMixcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgZHVyYXRpb246IDEwMDAsXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBDaGFuZ2UgdGhlIG1vZGVsICh3aXRoIHZpZXcpXG4gICAgICAgICQodGhpcy5hbnN3ZXJBcmVhKS5hbmltYXRlKHtcbiAgICAgICAgICAgIG9wYWNpdHk6IDEuMCxcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgZHVyYXRpb246IDExMDAsXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLmFuc3dlckFyZWEpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IFwiXCIsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBtb2RlbFxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc291cmNlQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUJsb2Nrc1tpXS5hZGRJbmRlbnQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbnN3ZXJCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VyQmxvY2tzW2ldLmFkZEluZGVudCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIGZpcnN0IGNoZWNrIGlmIGFueSBzb2x1dGlvbiBibG9ja3MgYXJlIGluIHRoZSBzb3VyY2Ugc3RpbGwgKGxlZnQgc2lkZSkgYW5kIG5vdFxuICAgIC8vIGluIHRoZSBhbnN3ZXJcbiAgICBnZXRTb2x1dGlvbkJsb2NrSW5Tb3VyY2UoKSB7XG4gICAgICAgIHZhciBzb2x1dGlvbkJsb2NrcyA9IHRoaXMuc29sdXRpb25CbG9ja3MoKTtcbiAgICAgICAgdmFyIGFuc3dlckJsb2NrcyA9IHRoaXMuYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgIHZhciBzb3VyY2VCbG9ja3MgPSB0aGlzLnNvdXJjZUJsb2NrcygpO1xuICAgICAgICB2YXIgc29sQmxvY2sgPSBudWxsO1xuICAgICAgICB2YXIgY3VyckJsb2NrID0gbnVsbDtcblxuICAgICAgICAvLyBsb29wIHRocm91Z2ggc291cmNlQmxvY2tzIGFuZCByZXR1cm4gYSBibG9jayBpZiBpdCBpcyBub3QgaW4gdGhlIHNvbHV0aW9uXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBnZXQgdGhlIGN1cnJlbnQgYmxvY2sgZnJvbSB0aGUgc291cmNlXG4gICAgICAgICAgICBjdXJyQmxvY2sgPSBzb3VyY2VCbG9ja3NbaV07XG5cbiAgICAgICAgICAgIC8vIGlmIGN1cnJCbG9jayBpcyBpbiB0aGUgc29sdXRpb24gYW5kIGlzbid0IHRoZSBmaXJzdCBibG9jayBhbmQgaXNuJ3QgaW4gdGhlIGFuc3dlclxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHNvbHV0aW9uQmxvY2tzLmluZGV4T2YoY3VyckJsb2NrKSA+IDAgJiZcbiAgICAgICAgICAgICAgICBhbnN3ZXJCbG9ja3MuaW5kZXhPZihjdXJyQmxvY2spIDwgMFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJCbG9jaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBkaWRuJ3QgZmluZCBhbnkgYmxvY2sgaW4gdGhlIHNvdXJjZSB0aGF0IGlzIGluIHRoZSBzb2x1dGlvblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBGaW5kIGEgYmxvY2syIHRoYXQgaXMgZnVydGhlc3QgZnJvbSBibG9jazEgaW4gdGhlIGFuc3dlclxuICAgIC8vIGRvbid0IHVzZSB0aGUgdmVyeSBmaXJzdCBibG9jayBpbiB0aGUgc29sdXRpb24gYXMgYmxvY2syXG4gICAgZ2V0RnVydGhlc3RCbG9jaygpIHtcbiAgICAgICAgdmFyIHNvbHV0aW9uQmxvY2tzID0gdGhpcy5zb2x1dGlvbkJsb2NrcygpO1xuICAgICAgICB2YXIgYW5zd2VyQmxvY2tzID0gdGhpcy5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgdmFyIG1heERpc3QgPSAwO1xuICAgICAgICB2YXIgZGlzdCA9IDA7XG4gICAgICAgIHZhciBtYXhCbG9jayA9IG51bGw7XG4gICAgICAgIHZhciBjdXJyQmxvY2sgPSBudWxsO1xuICAgICAgICB2YXIgaW5kZXhTb2wgPSAwO1xuICAgICAgICB2YXIgcHJldkJsb2NrID0gbnVsbDtcbiAgICAgICAgdmFyIGluZGV4UHJldiA9IDA7XG5cbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBibG9ja3MgaW4gdGhlIGFuc3dlclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFuc3dlckJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY3VyckJsb2NrID0gYW5zd2VyQmxvY2tzW2ldO1xuICAgICAgICAgICAgaW5kZXhTb2wgPSBzb2x1dGlvbkJsb2Nrcy5pbmRleE9mKGN1cnJCbG9jayk7XG4gICAgICAgICAgICBpZiAoaW5kZXhTb2wgPiAwKSB7XG4gICAgICAgICAgICAgICAgcHJldkJsb2NrID0gc29sdXRpb25CbG9ja3NbaW5kZXhTb2wgLSAxXTtcbiAgICAgICAgICAgICAgICBpbmRleFByZXYgPSBhbnN3ZXJCbG9ja3MuaW5kZXhPZihwcmV2QmxvY2spO1xuICAgICAgICAgICAgICAgIC8vYWxlcnQoXCJteSBpbmRleCBcIiArIGkgKyBcIiBpbmRleCBwcmV2IFwiICsgaW5kZXhQcmV2KTtcblxuICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgZGlzdGFuY2UgaW4gdGhlIGFuc3dlclxuICAgICAgICAgICAgICAgIGRpc3QgPSBNYXRoLmFicyhpIC0gaW5kZXhQcmV2KTtcbiAgICAgICAgICAgICAgICBpZiAoZGlzdCA+IG1heERpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4RGlzdCA9IGRpc3Q7XG4gICAgICAgICAgICAgICAgICAgIG1heEJsb2NrID0gY3VyckJsb2NrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWF4QmxvY2s7XG4gICAgfVxuXG4gICAgLy8gQ29tYmluZSBibG9ja3MgdG9nZXRoZXJcbiAgICBjb21iaW5lQmxvY2tzKCkge1xuICAgICAgICB2YXIgc29sdXRpb25CbG9ja3MgPSB0aGlzLnNvbHV0aW9uQmxvY2tzKCk7XG4gICAgICAgIHZhciBhbnN3ZXJCbG9ja3MgPSB0aGlzLmFuc3dlckJsb2NrcygpO1xuICAgICAgICB2YXIgc291cmNlQmxvY2tzID0gdGhpcy5zb3VyY2VCbG9ja3MoKTtcblxuICAgICAgICAvLyBBbGVydCB0aGUgdXNlciB0byB3aGF0IGlzIGhhcHBlbmluZ1xuICAgICAgICB2YXIgZmVlZGJhY2tBcmVhID0gJCh0aGlzLm1lc3NhZ2VEaXYpO1xuICAgICAgICBmZWVkYmFja0FyZWEuZmFkZUluKDUwMCk7XG4gICAgICAgIGZlZWRiYWNrQXJlYS5hdHRyKFwiY2xhc3NcIiwgXCJhbGVydCBhbGVydC1pbmZvXCIpO1xuICAgICAgICBmZWVkYmFja0FyZWEuaHRtbCgkLmkxOG4oXCJtc2dfcGFyc29uX2NvbWJpbmVkX2Jsb2Nrc1wiKSk7XG4gICAgICAgIHZhciBibG9jazEgPSBudWxsO1xuICAgICAgICB2YXIgYmxvY2syID0gbnVsbDtcblxuICAgICAgICAvLyBnZXQgYSBzb2x1dGlvbiBibG9jayB0aGF0IGlzIHN0aWxsIGluIHNvdXJjZSAobm90IGFuc3dlciksIGlmIGFueVxuICAgICAgICBibG9jazIgPSB0aGlzLmdldFNvbHV0aW9uQmxvY2tJblNvdXJjZSgpO1xuXG4gICAgICAgIC8vIGlmIG5vbmUgaW4gc291cmNlIGdldCBibG9jayB0aGF0IGlzIGZ1cnRoZXN0IGZyb20gYmxvY2sxXG4gICAgICAgIGlmIChibG9jazIgPT0gbnVsbCkge1xuICAgICAgICAgICAgYmxvY2syID0gdGhpcy5nZXRGdXJ0aGVzdEJsb2NrKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnZXQgYmxvY2sxIChhYm92ZSBibG9jazIpIGluIHNvbHV0aW9uXG4gICAgICAgIHZhciBpbmRleCA9IHNvbHV0aW9uQmxvY2tzLmluZGV4T2YoYmxvY2syKTtcbiAgICAgICAgYmxvY2sxID0gc29sdXRpb25CbG9ja3NbaW5kZXggLSAxXTtcblxuICAgICAgICAvLyBnZXQgaW5kZXggb2YgZWFjaCBpbiBhbnN3ZXJcbiAgICAgICAgdmFyIGluZGV4MSA9IGFuc3dlckJsb2Nrcy5pbmRleE9mKGJsb2NrMSk7XG4gICAgICAgIHZhciBpbmRleDIgPSBhbnN3ZXJCbG9ja3MuaW5kZXhPZihibG9jazIpO1xuICAgICAgICB2YXIgbW92ZSA9IGZhbHNlO1xuXG4gICAgICAgIC8vIGlmIGJvdGggaW4gYW5zd2VyIHNldCBtb3ZlIGJhc2VkIG9uIGlmIGRpcmVjdGx5IGFib3ZlIGVhY2ggb3RoZXJcbiAgICAgICAgaWYgKGluZGV4MSA+PSAwICYmIGluZGV4MiA+PSAwKSB7XG4gICAgICAgICAgICBtb3ZlID0gaW5kZXgxICsgMSAhPT0gaW5kZXgyO1xuXG4gICAgICAgICAgICAvLyBlbHNlIGlmIGJvdGggaW4gc291cmNlIHNldCBtb3ZlIGFnYWluIGJhc2VkIG9uIGlmIGFib3ZlIGVhY2ggb3RoZXJcbiAgICAgICAgfSBlbHNlIGlmIChpbmRleDEgPCAwICYmIGluZGV4MiA8IDApIHtcbiAgICAgICAgICAgIGluZGV4MSA9IHNvdXJjZUJsb2Nrcy5pbmRleE9mKGJsb2NrMSk7XG4gICAgICAgICAgICBpbmRleDIgPSBzb3VyY2VCbG9ja3MuaW5kZXhPZihibG9jazIpO1xuICAgICAgICAgICAgbW92ZSA9IGluZGV4MSArIDEgIT09IGluZGV4MjtcblxuICAgICAgICAgICAgLy8gb25lIGluIHNvdXJjZSBhbmQgb25lIGluIGFuc3dlciBzbyBtdXN0IG1vdmVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1vdmUgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKGluZGV4MSA8IDApIHtcbiAgICAgICAgICAgICAgICBpbmRleDEgPSBzb3VyY2VCbG9ja3MuaW5kZXhPZihibG9jazEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluZGV4MiA8IDApIHtcbiAgICAgICAgICAgICAgICBpbmRleDIgPSBzb3VyY2VCbG9ja3MuaW5kZXhPZihibG9jazIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN1YnRyYWN0ID0gaW5kZXgyIDwgaW5kZXgxOyAvLyBpcyBibG9jazIgaGlnaGVyXG5cbiAgICAgICAgaWYgKG1vdmUpIHtcbiAgICAgICAgICAgIC8vIE1vdmUgdGhlIGJsb2NrXG4gICAgICAgICAgICB2YXIgc3RhcnRYID0gYmxvY2syLnBhZ2VYQ2VudGVyKCkgLSAxO1xuICAgICAgICAgICAgdmFyIHN0YXJ0WSA9IGJsb2NrMi5wYWdlWUNlbnRlcigpO1xuICAgICAgICAgICAgdmFyIGVuZFggPSBibG9jazEucGFnZVhDZW50ZXIoKSAtIDE7XG4gICAgICAgICAgICB2YXIgZW5kWSA9XG4gICAgICAgICAgICAgICAgYmxvY2sxLnBhZ2VZQ2VudGVyKCkgK1xuICAgICAgICAgICAgICAgIGJsb2NrMS52aWV3LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCAvIDIgK1xuICAgICAgICAgICAgICAgIDU7XG4gICAgICAgICAgICBpZiAoc3VidHJhY3QpIHtcbiAgICAgICAgICAgICAgICBlbmRZIC09IGJsb2NrMi52aWV3LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCAvIDI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVuZFkgKz0gYmxvY2syLnZpZXcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0IC8gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgICQoYmxvY2syLnZpZXcpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDEwMDAsIC8vIDEgc2VjY29uZFxuICAgICAgICAgICAgICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJChibG9jazEudmlldykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6IFwiIzAwMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiI2ZmZlwiLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJChibG9jazIudmlldykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6IFwiIzAwMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiI2ZmZlwiLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2syLmxpbmVzWzBdLmluZGV4ICs9IDEwMDA7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQubW92aW5nID0gYmxvY2syO1xuICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vdmluZ1ggPSBzdGFydFg7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQubW92aW5nWSA9IHN0YXJ0WTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwcm9ncmVzczogZnVuY3Rpb24oYSwgcCwgYykge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vdmluZ1ggPSBzdGFydFggKiAoMSAtIHApICsgZW5kWCAqIHA7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQubW92aW5nWSA9IHN0YXJ0WSAqICgxIC0gcCkgKyBlbmRZICogcDtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGF0Lm1vdmluZztcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoYXQubW92aW5nWDtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoYXQubW92aW5nWTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrMi5saW5lc1swXS5pbmRleCAtPSAxMDAwO1xuICAgICAgICAgICAgICAgICAgICBibG9jazEuY29uc3VtZUJsb2NrKGJsb2NrMik7XG4gICAgICAgICAgICAgICAgICAgICQoYmxvY2sxLnZpZXcpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJib3JkZXItY29sb3JcIjogXCIjZDNkM2QzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogXCIjZWZlZmVmXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoYmxvY2sxLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJChibG9jazIudmlldykuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgICAgICBzdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQoYmxvY2sxLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImJvcmRlci1jb2xvclwiOiBcIiMwMDBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIiNmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICQoYmxvY2syLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImJvcmRlci1jb2xvclwiOiBcIiMwMDBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIiNmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrMS5jb25zdW1lQmxvY2soYmxvY2syKTtcbiAgICAgICAgICAgICAgICAgICAgJChibG9jazEudmlldykuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImJvcmRlci1jb2xvclwiOiBcIiNkM2QzZDNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIiNlZmVmZWZcIixcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDEwMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChibG9jazEudmlldykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJib3JkZXItY29sb3JcIjogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQWRhcHQgdGhlIHByb2JsZW0gdG8gYmUgZWFzaWVyXG4gICAgLy8gICogcmVtb3ZlIGEgZGlzdHJhY3RvciB1bnRpbCBub25lIGFyZSBwcmVzZW50XG4gICAgLy8gICogY29tYmluZSBibG9ja3MgdW50aWwgMyBhcmUgbGVmdFxuICAgIG1ha2VFYXNpZXIoKSB7XG4gICAgICAgIHZhciBkaXN0cmFjdG9yVG9SZW1vdmUgPSB0aGlzLmRpc3RyYWN0b3JUb1JlbW92ZSgpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBkaXN0cmFjdG9yVG9SZW1vdmUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgIWRpc3RyYWN0b3JUb1JlbW92ZS5pblNvdXJjZUFyZWEoKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGFsZXJ0KCQuaTE4bihcIm1zZ19wYXJzb25fcmVtb3ZlX2luY29ycmVjdFwiKSk7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZURpc3RyYWN0b3IoZGlzdHJhY3RvclRvUmVtb3ZlKTtcbiAgICAgICAgICAgIHRoaXMubG9nTW92ZShcInJlbW92ZWREaXN0cmFjdG9yLVwiICsgZGlzdHJhY3RvclRvUmVtb3ZlLmhhc2goKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbnVtYmVyT2ZCbG9ja3MgPSB0aGlzLm51bWJlck9mQmxvY2tzKGZhbHNlKTtcbiAgICAgICAgICAgIGlmIChudW1iZXJPZkJsb2NrcyA+IDMpIHtcbiAgICAgICAgICAgICAgICBhbGVydCgkLmkxOG4oXCJtc2dfcGFyc29uX3dpbGxfY29tYmluZVwiKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21iaW5lQmxvY2tzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dNb3ZlKFwiY29tYmluZWRCbG9ja3NcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKmVsc2UgaWYodGhpcy5udW1iZXJPZkJsb2Nrcyh0cnVlKSA+IDMgJiYgZGlzdHJhY3RvclRvUmVtb3ZlICE9PSAgdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIldpbGwgcmVtb3ZlIGFuIGluY29ycmVjdCBjb2RlIGJsb2NrIGZyb20gc291cmNlIGFyZWFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZURpc3RyYWN0b3IoZGlzdHJhY3RvclRvUmVtb3ZlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nTW92ZShcInJlbW92ZWREaXN0cmFjdG9yLVwiICsgZGlzdHJhY3RvclRvUmVtb3ZlLmhhc2goKSk7XG4gICAgICAgICAgICAgICAgICAgICAgIH0gKi9cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsZXJ0KCQuaTE4bihcIm1zZ19wYXJzb25fdGhyZWVfYmxvY2tzX2xlZnRcIikpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FuSGVscCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9pZiAobnVtYmVyT2ZCbG9ja3MgPCA1KSB7XG4gICAgICAgICAgICAvL1x0dGhpcy5jYW5IZWxwID0gZmFsc2U7XG4gICAgICAgICAgICAvL1x0dGhpcy5oZWxwQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFRoZSBcIkhlbHAgTWVcIiBidXR0b24gd2FzIHByZXNzZWQgYW5kIHRoZSBwcm9ibGVtIHNob3VsZCBiZSBzaW1wbGlmaWVkXG4gICAgaGVscE1lKCkge1xuICAgICAgICB0aGlzLmNsZWFyRmVlZGJhY2soKTtcbiAgICAgICAgLy90aGlzLmhlbHBDb3VudCA9IC0xOyAvLyBhbW91bnQgdG8gYWxsb3cgZm9yIG11bHRpcGxlIGhlbHBzIGluIGEgcm93XG4gICAgICAgIC8vaWYgKHRoaXMuaGVscENvdW50IDwgMCkge1xuICAgICAgICAvL1x0dGhpcy5oZWxwQ291bnQgPSBNYXRoLm1heCh0aGlzLmhlbHBDb3VudCwgLTEpOyAvLyBtaW4gMSBhdHRlbXB0IGJlZm9yZSBtb3JlIGhlbHBcbiAgICAgICAgLy90aGlzLmhlbHBCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAvL31cbiAgICAgICAgLy8gaWYgbGVzcyB0aGFuIDMgYXR0ZW1wdHNcbiAgICAgICAgaWYgKHRoaXMubnVtRGlzdGluY3QgPCAzKSB7XG4gICAgICAgICAgICBhbGVydCgkLmkxOG4oXCJtc2dfcGFyc29uX2F0bGVhc3RfdGhyZWVfYXR0ZW1wdHNcIikpO1xuICAgICAgICB9XG4gICAgICAgIC8vIG90aGVyd2lzZSBnaXZlIGhlbHBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdvdEhlbHAgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5tYWtlRWFzaWVyKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSBVVElMSVRZID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgLy8gUmV0dXJuIGEgZGF0ZSBmcm9tIGEgdGltZXN0YW1wIChlaXRoZXIgbXlTUUwgb3IgSlMgZm9ybWF0KVxuICAgIGRhdGVGcm9tVGltZXN0YW1wKHRpbWVzdGFtcCkge1xuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHRpbWVzdGFtcCk7XG4gICAgICAgIGlmIChpc05hTihkYXRlLmdldFRpbWUoKSkpIHtcbiAgICAgICAgICAgIHZhciB0ID0gdGltZXN0YW1wLnNwbGl0KC9bLSA6XS8pO1xuICAgICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKHRbMF0sIHRbMV0gLSAxLCB0WzJdLCB0WzNdLCB0WzRdLCB0WzVdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG4gICAgLy8gQSBmdW5jdGlvbiBmb3IgcmV0dXJuaW5nIGEgc2h1ZmZsZWQgdmVyc2lvbiBvZiBhbiBhcnJheVxuICAgIHNodWZmbGVkKGFycmF5KSB7XG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGg7XG4gICAgICAgIHZhciByZXR1cm5BcnJheSA9IGFycmF5LnNsaWNlKCk7XG4gICAgICAgIHZhciB0ZW1wb3JhcnlWYWx1ZSwgcmFuZG9tSW5kZXg7XG4gICAgICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXG4gICAgICAgIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcbiAgICAgICAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xuICAgICAgICAgICAgY3VycmVudEluZGV4IC09IDE7XG4gICAgICAgICAgICAvLyBBbmQgc3dhcCBpdCB3aXRoIHRoZSBjdXJyZW50IGVsZW1lbnQuXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IHJldHVybkFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgICAgICAgICByZXR1cm5BcnJheVtjdXJyZW50SW5kZXhdID0gcmV0dXJuQXJyYXlbcmFuZG9tSW5kZXhdO1xuICAgICAgICAgICAgcmV0dXJuQXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldHVybkFycmF5O1xuICAgIH1cbiAgICAvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09IEtFWUJPQVJEIElOVEVSQUNUSU9OID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbiAgICAvLyBXaGVuIHRoZSB1c2VyIGhhcyBlbnRlcmVkIHRoZSBQYXJzb25zIHByb2JsZW0gdmlhIGtleWJvYXJkIG1vZGVcbiAgICBlbnRlcktleWJvYXJkTW9kZSgpIHtcbiAgICAgICAgJCh0aGlzLmtleWJvYXJkVGlwKS5zaG93KCk7XG4gICAgICAgICQodGhpcy5zb3VyY2VMYWJlbCkuaGlkZSgpO1xuICAgICAgICAkKHRoaXMuYW5zd2VyTGFiZWwpLmhpZGUoKTtcbiAgICAgICAgdGhpcy5jbGVhckZlZWRiYWNrKCk7XG4gICAgfVxuICAgIC8vIFdoZW4gdGhlIHVzZXIgbGVhdmVzIHRoZSBQYXJzb25zIHByb2JsZW0gdmlhIGtleWJvYXJkIG1vZGVcbiAgICBleGl0S2V5Ym9hcmRNb2RlKCkge1xuICAgICAgICAkKHRoaXMua2V5Ym9hcmRUaXApLmhpZGUoKTtcbiAgICAgICAgJCh0aGlzLnNvdXJjZUxhYmVsKS5zaG93KCk7XG4gICAgICAgICQodGhpcy5hbnN3ZXJMYWJlbCkuc2hvdygpO1xuICAgIH1cbiAgICAvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09IFZJRVcgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbiAgICAvLyBDbGVhciBhbnkgZmVlZGJhY2sgZnJvbSB0aGUgYW5zd2VyIGFyZWFcbiAgICBjbGVhckZlZWRiYWNrKCkge1xuICAgICAgICAkKHRoaXMuYW5zd2VyQXJlYSkucmVtb3ZlQ2xhc3MoXCJpbmNvcnJlY3QgY29ycmVjdFwiKTtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5hbnN3ZXJBcmVhLmNoaWxkTm9kZXM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICQoY2hpbGRyZW5baV0pLnJlbW92ZUNsYXNzKFxuICAgICAgICAgICAgICAgIFwiY29ycmVjdFBvc2l0aW9uIGluY29ycmVjdFBvc2l0aW9uIGluZGVudExlZnQgaW5kZW50UmlnaHRcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICAkKHRoaXMubWVzc2FnZURpdikuaGlkZSgpO1xuICAgIH1cbiAgICAvLyBEaXNhYmxlIHRoZSBpbnRlcmZhY2VcbiAgICBhc3luYyBkaXNhYmxlSW50ZXJhY3Rpb24oKSB7XG4gICAgICAgIC8vIERpc2FibGUgYmxvY2tzXG4gICAgICAgIGF3YWl0IHRoaXMuY2hlY2tTZXJ2ZXJDb21wbGV0ZTtcbiAgICAgICAgY29uc29sZS5sb2coXCJkaXNhYmxpbmcgYmxvY2tzXCIpO1xuICAgICAgICBpZiAodGhpcy5ibG9ja3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBibG9jayA9IHRoaXMuYmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgIGJsb2NrLmRpc2FibGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBIaWRlIGJ1dHRvbnNcbiAgICAgICAgJCh0aGlzLmNoZWNrQnV0dG9uKS5oaWRlKCk7XG4gICAgICAgICQodGhpcy5yZXNldEJ1dHRvbikuaGlkZSgpO1xuICAgIH1cbiAgICAvLyBCYXNlZCBvbiB0aGUgbW92aW5nIGVsZW1lbnQsIGV0Yy4sIGVzdGFibGlzaCB0aGUgbW92aW5nIHN0YXRlXG4gICAgLy8gICByZXN0OiBub3QgbW92aW5nXG4gICAgLy8gICBzb3VyY2U6IG1vdmluZyBpbnNpZGUgc291cmNlIGFyZWFcbiAgICAvLyAgIGFuc3dlcjogbW92aW5nIGluc2lkZSBhbnN3ZXIgYXJlYVxuICAgIC8vICAgbW92aW5nOiBtb3Zpbmcgb3V0c2lkZSBhcmVhc1xuICAgIG1vdmluZ1N0YXRlKCkge1xuICAgICAgICBpZiAodGhpcy5tb3ZpbmcgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJyZXN0XCI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHggPSB0aGlzLm1vdmluZ1ggLSB3aW5kb3cucGFnZVhPZmZzZXQ7XG4gICAgICAgIHZhciB5ID0gdGhpcy5tb3ZpbmdZIC0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgICAvLyBDaGVjayBpZiBpbiBhbnN3ZXIgYXJlYVxuICAgICAgICB2YXIgYm91bmRzID0gdGhpcy5hbnN3ZXJBcmVhLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB4ID49IGJvdW5kcy5sZWZ0ICYmXG4gICAgICAgICAgICB4IDw9IGJvdW5kcy5yaWdodCAmJlxuICAgICAgICAgICAgeSA+PSBib3VuZHMudG9wICYmXG4gICAgICAgICAgICB5IDw9IGJvdW5kcy5ib3R0b21cbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJhbnN3ZXJcIjtcbiAgICAgICAgfVxuICAgICAgICAvLyBDaGVjayBpZiBpbiBzb3VyY2UgYXJlYVxuICAgICAgICBib3VuZHMgPSB0aGlzLnNvdXJjZUFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHggPj0gYm91bmRzLmxlZnQgJiZcbiAgICAgICAgICAgIHggPD0gYm91bmRzLnJpZ2h0ICYmXG4gICAgICAgICAgICB5ID49IGJvdW5kcy50b3AgJiZcbiAgICAgICAgICAgIHkgPD0gYm91bmRzLmJvdHRvbVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiBcInNvdXJjZVwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIm1vdmluZ1wiO1xuICAgIH1cbiAgICAvLyBVcGRhdGUgdGhlIFBhcnNvbnMgdmlld1xuICAgIC8vIFRoaXMgZ2V0cyBjYWxsZWQgd2hlbiBkcmFnZ2luZyBhIGJsb2NrXG4gICAgdXBkYXRlVmlldygpIHtcbiAgICAgICAgLy8gQmFzZWQgb24gdGhlIG5ldyBhbmQgdGhlIG9sZCBzdGF0ZSwgZmlndXJlIG91dCB3aGF0IHRvIHVwZGF0ZVxuICAgICAgICB2YXIgc3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgICAgICB2YXIgbmV3U3RhdGUgPSB0aGlzLm1vdmluZ1N0YXRlKCk7XG4gICAgICAgIHZhciB1cGRhdGVTb3VyY2UgPSB0cnVlO1xuICAgICAgICB2YXIgdXBkYXRlQW5zd2VyID0gdHJ1ZTtcbiAgICAgICAgdmFyIHVwZGF0ZU1vdmluZyA9IG5ld1N0YXRlID09IFwibW92aW5nXCI7XG4gICAgICAgIGlmIChzdGF0ZSA9PSBuZXdTdGF0ZSkge1xuICAgICAgICAgICAgaWYgKG5ld1N0YXRlID09IFwicmVzdFwiKSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlU291cmNlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdXBkYXRlQW5zd2VyID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5ld1N0YXRlID09IFwic291cmNlXCIpIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVBbnN3ZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobmV3U3RhdGUgPT0gXCJhbnN3ZXJcIikge1xuICAgICAgICAgICAgICAgIHVwZGF0ZVNvdXJjZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuZXdTdGF0ZSA9PSBcIm1vdmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlQW5zd2VyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdXBkYXRlU291cmNlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1vdmluZ0hlaWdodDtcbiAgICAgICAgaWYgKHRoaXMubW92aW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIE11c3QgZ2V0IGhlaWdodCBoZXJlIGFzIGRldGFjaGVkIGl0ZW1zIGRvbid0IGhhdmUgaGVpZ2h0XG4gICAgICAgICAgICBtb3ZpbmdIZWlnaHQgPSAkKHRoaXMubW92aW5nLnZpZXcpLm91dGVySGVpZ2h0KHRydWUpO1xuICAgICAgICAgICAgJCh0aGlzLm1vdmluZy52aWV3KS5kZXRhY2goKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcG9zaXRpb25Ub3AsIHdpZHRoO1xuICAgICAgICB2YXIgYmFzZVdpZHRoID0gdGhpcy5hcmVhV2lkdGggLSAyMjtcbiAgICAgICAgLy8gVXBkYXRlIHRoZSBTb3VyY2UgQXJlYVxuICAgICAgICBpZiAodXBkYXRlU291cmNlKSB7XG4gICAgICAgICAgICBwb3NpdGlvblRvcCA9IDA7XG4gICAgICAgICAgICB2YXIgYmxvY2tzID0gdGhpcy5zb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgICAgIGlmIChuZXdTdGF0ZSA9PSBcInNvdXJjZVwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhhc0luc2VydGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIG1vdmluZ0JpbiA9IHRoaXMubW92aW5nLnBhaXJlZEJpbigpO1xuICAgICAgICAgICAgICAgIHZhciBiaW5Gb3JCbG9jayA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYmluRm9yQmxvY2sucHVzaChibG9ja3NbaV0ucGFpcmVkQmluKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWJpbkZvckJsb2NrLmluY2x1ZGVzKG1vdmluZ0JpbikpIHtcbiAgICAgICAgICAgICAgICAgICAgbW92aW5nQmluID0gLTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBpbnNlcnRQb3NpdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAoYmluRm9yQmxvY2subGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0UG9zaXRpb25zLnB1c2goMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vdmluZ0JpbiA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0UG9zaXRpb25zLnB1c2goMCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYmluRm9yQmxvY2tbMF0gPT0gbW92aW5nQmluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRQb3NpdGlvbnMucHVzaCgwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAxOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmluRm9yQmxvY2tbaSAtIDFdID09IG1vdmluZ0Jpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydFBvc2l0aW9ucy5wdXNoKGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChiaW5Gb3JCbG9ja1tpXSA9PSBtb3ZpbmdCaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRQb3NpdGlvbnMucHVzaChpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW92aW5nQmluID09IC0xICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluRm9yQmxvY2tbaSAtIDFdICE9IGJpbkZvckJsb2NrW2ldXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRQb3NpdGlvbnMucHVzaChpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobW92aW5nQmluID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRQb3NpdGlvbnMucHVzaChiaW5Gb3JCbG9jay5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgYmluRm9yQmxvY2tbYmluRm9yQmxvY2subGVuZ3RoIC0gMV0gPT0gbW92aW5nQmluXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0UG9zaXRpb25zLnB1c2goYmluRm9yQmxvY2subGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgeCA9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92aW5nWCAtXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc291cmNlQXJlYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0IC1cbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnBhZ2VYT2Zmc2V0IC1cbiAgICAgICAgICAgICAgICAgICAgYmFzZVdpZHRoIC8gMiAtXG4gICAgICAgICAgICAgICAgICAgIDExO1xuICAgICAgICAgICAgICAgIHZhciB5ID1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmdZIC1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VyY2VBcmVhLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gYmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgICAgICB2YXIgajtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFoYXNJbnNlcnRlZCAmJiBpbnNlcnRQb3NpdGlvbnMuaW5jbHVkZXMoaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0SGVpZ2h0ID0gJChpdGVtLnZpZXcpLm91dGVySGVpZ2h0KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gaSArIDE7IGogPCBibG9ja3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5zZXJ0UG9zaXRpb25zLmluY2x1ZGVzKGopKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0SGVpZ2h0ICs9ICQoYmxvY2tzW2pdLnZpZXcpLm91dGVySGVpZ2h0KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgLSBwb3NpdGlvblRvcCA8IG1vdmluZ0hlaWdodCArIHRlc3RIZWlnaHQgLyAyIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSA9PSBpbnNlcnRQb3NpdGlvbnNbaW5zZXJ0UG9zaXRpb25zLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNJbnNlcnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VyY2VBcmVhLmluc2VydEJlZm9yZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmcudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS52aWV3XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMubW92aW5nLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IHgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogeSAtIG1vdmluZ0hlaWdodCAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBiYXNlV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiei1pbmRleFwiOiAzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG9wID0gcG9zaXRpb25Ub3AgKyBtb3ZpbmdIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJChpdGVtLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBwb3NpdGlvblRvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBiYXNlV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInotaW5kZXhcIjogMixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG9wID0gcG9zaXRpb25Ub3AgKyAkKGl0ZW0udmlldykub3V0ZXJIZWlnaHQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghaGFzSW5zZXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLm1vdmluZy52aWV3KS5hcHBlbmRUbyhcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiI1wiICsgdGhpcy5jb3VudGVySWQgKyBcIi1zb3VyY2VcIlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMubW92aW5nLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiB4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiB5IC0gJCh0aGlzLm1vdmluZy52aWV3KS5vdXRlckhlaWdodCh0cnVlKSAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogYmFzZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6LWluZGV4XCI6IDMsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbSA9IGJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgJChpdGVtLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBwb3NpdGlvblRvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBiYXNlV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInotaW5kZXhcIjogMixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG9wID0gcG9zaXRpb25Ub3AgKyAkKGl0ZW0udmlldykub3V0ZXJIZWlnaHQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBQYWlyZWQgRGlzdHJhY3RvciBJbmRpY2F0b3JzXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5wYWlyZWRCaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJpbiA9IHRoaXMucGFpcmVkQmluc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2hpbmcgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgYmxvY2tzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrID0gYmxvY2tzW2pdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2subWF0Y2hlc0JpbihiaW4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGluZy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgZGl2ID0gdGhpcy5wYWlyZWREaXZzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaGluZy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAkKGRpdikuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoZGl2KS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSAtNTtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ICs9IHBhcnNlSW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJChtYXRjaGluZ1ttYXRjaGluZy5sZW5ndGggLSAxXS52aWV3KS5jc3MoXCJ0b3BcIilcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0IC09IHBhcnNlSW50KCQobWF0Y2hpbmdbMF0udmlldykuY3NzKFwidG9wXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ICs9ICQobWF0Y2hpbmdbbWF0Y2hpbmcubGVuZ3RoIC0gMV0udmlldykub3V0ZXJIZWlnaHQoXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICQoZGl2KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogLTYsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6ICQobWF0Y2hpbmdbMF0udmlldykuY3NzKFwidG9wXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGJhc2VXaWR0aCArIDM0LFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInotaW5kZXhcIjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dC1pbmRlbnRcIjogLTMwLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYWRkaW5nLXRvcFwiOiAoaGVpZ2h0IC0gNzApIC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiBcInZpc2libGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IDQzLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2ZXJ0aWNhbC1hbGlnblwiOiBcIm1pZGRsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzdlN2VlN1wiLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJChkaXYpLmh0bWwoXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjxzcGFuIGlkPSAnc3QnIHN0eWxlID0gJ3ZlcnRpY2FsLWFsaWduOiBtaWRkbGU7IGZvbnQtd2VpZ2h0OiBib2xkOyBmb250LXNpemU6IDE1cHgnPm9yPC9zcGFuPntcIlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hpbmcubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgJChkaXYpLmh0bWwoXCJcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgQW5zd2VyIEFyZWFcbiAgICAgICAgaWYgKHVwZGF0ZUFuc3dlcikge1xuICAgICAgICAgICAgdmFyIGJsb2NrLCBpbmRlbnQ7XG4gICAgICAgICAgICBwb3NpdGlvblRvcCA9IDA7XG4gICAgICAgICAgICB3aWR0aCA9XG4gICAgICAgICAgICAgICAgdGhpcy5hcmVhV2lkdGggK1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50ICogdGhpcy5vcHRpb25zLnBpeGVsc1BlckluZGVudCAtXG4gICAgICAgICAgICAgICAgMjI7XG4gICAgICAgICAgICB2YXIgYmxvY2tzID0gdGhpcy5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgICAgIGlmIChuZXdTdGF0ZSA9PSBcImFuc3dlclwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhhc0luc2VydGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIHggPVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmluZ1ggLVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuc3dlckFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCAtXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5wYWdlWE9mZnNldCAtXG4gICAgICAgICAgICAgICAgICAgIGJhc2VXaWR0aCAvIDIgLVxuICAgICAgICAgICAgICAgICAgICAxMTtcbiAgICAgICAgICAgICAgICB2YXIgbW92aW5nSW5kZW50ID0gTWF0aC5yb3VuZCh4IC8gdGhpcy5vcHRpb25zLnBpeGVsc1BlckluZGVudCk7XG4gICAgICAgICAgICAgICAgaWYgKG1vdmluZ0luZGVudCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbW92aW5nSW5kZW50ID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1vdmluZ0luZGVudCA+IHRoaXMuaW5kZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdmluZ0luZGVudCA9IHRoaXMuaW5kZW50O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHggPSBtb3ZpbmdJbmRlbnQgKiB0aGlzLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgeSA9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92aW5nWSAtXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5zd2VyQXJlYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLVxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmcuaW5kZW50ID0gbW92aW5nSW5kZW50O1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sgPSBibG9ja3NbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghaGFzSW5zZXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5IC0gcG9zaXRpb25Ub3AgPFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtb3ZpbmdIZWlnaHQgKyAkKGJsb2NrLnZpZXcpLm91dGVySGVpZ2h0KHRydWUpKSAvIDJcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc0luc2VydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuc3dlckFyZWEuaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmluZy52aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9jay52aWV3XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMubW92aW5nLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IHgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogeSAtIG1vdmluZ0hlaWdodCAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBiYXNlV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiei1pbmRleFwiOiAzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG9wID0gcG9zaXRpb25Ub3AgKyBtb3ZpbmdIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaW5kZW50ID0gYmxvY2suaW5kZW50ICogdGhpcy5vcHRpb25zLnBpeGVsc1BlckluZGVudDtcbiAgICAgICAgICAgICAgICAgICAgJChibG9jay52aWV3KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogaW5kZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBwb3NpdGlvblRvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aCAtIGluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiei1pbmRleFwiOiAyLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25Ub3AgPSBwb3NpdGlvblRvcCArICQoYmxvY2sudmlldykub3V0ZXJIZWlnaHQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghaGFzSW5zZXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLm1vdmluZy52aWV3KS5hcHBlbmRUbyhcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiI1wiICsgdGhpcy5jb3VudGVySWQgKyBcIi1hbnN3ZXJcIlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMubW92aW5nLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiB4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiB5IC0gJCh0aGlzLm1vdmluZy52aWV3KS5vdXRlckhlaWdodCh0cnVlKSAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogYmFzZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6LWluZGV4XCI6IDMsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sgPSBibG9ja3NbaV07XG4gICAgICAgICAgICAgICAgICAgIGluZGVudCA9IGJsb2NrLmluZGVudCAqIHRoaXMub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQ7XG4gICAgICAgICAgICAgICAgICAgICQoYmxvY2sudmlldykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogcG9zaXRpb25Ub3AsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGggLSBpbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInotaW5kZXhcIjogMixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG9wID0gcG9zaXRpb25Ub3AgKyAkKGJsb2NrLnZpZXcpLm91dGVySGVpZ2h0KHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBVcGRhdGUgdGhlIE1vdmluZyBBcmVhXG4gICAgICAgIGlmICh1cGRhdGVNb3ZpbmcpIHtcbiAgICAgICAgICAgIC8vIEFkZCBpdCB0byB0aGUgbG93ZXN0IHBsYWNlIGluIHRoZSBzb3VyY2UgYXJlYVxuICAgICAgICAgICAgbW92aW5nQmluID0gdGhpcy5tb3ZpbmcucGFpcmVkQmluKCk7XG4gICAgICAgICAgICBpZiAobW92aW5nQmluID09IC0xKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLm1vdmluZy52aWV3KS5hcHBlbmRUbyhcIiNcIiArIHRoaXMuY291bnRlcklkICsgXCItc291cmNlXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgYmVmb3JlO1xuICAgICAgICAgICAgICAgIGJsb2NrcyA9IHRoaXMuc291cmNlQmxvY2tzO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sgPSBibG9ja3NbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jay5wYWlyZWRCaW4oKSA9PSBtb3ZpbmdCaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlZm9yZSA9IGkgKyAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiZWZvcmUgPT0gdW5kZWZpbmVkIHx8IGJlZm9yZSA9PSBibG9ja3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5tb3ZpbmcudmlldykuYXBwZW5kVG8oXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiNcIiArIHRoaXMuY291bnRlcklkICsgXCItc291cmNlXCJcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZUFyZWEuaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmcudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrc1tiZWZvcmVdLnZpZXdcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBQbGFjZSBpbiB0aGUgbWlkZGxlIG9mIHRoZSBtb3VzZSBjdXJzb3JcbiAgICAgICAgICAgICQodGhpcy5tb3ZpbmcudmlldykuY3NzKHtcbiAgICAgICAgICAgICAgICBsZWZ0OiB0aGlzLm1vdmluZ1ggLVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZUFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCAtXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5wYWdlWE9mZnNldCAtXG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5tb3Zpbmcudmlldykub3V0ZXJXaWR0aCh0cnVlKSAvIDIsXG4gICAgICAgICAgICAgICAgdG9wOiB0aGlzLm1vdmluZ1kgLVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZUFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC1cbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnBhZ2VZT2Zmc2V0IC1cbiAgICAgICAgICAgICAgICAgICAgbW92aW5nSGVpZ2h0IC8gMixcbiAgICAgICAgICAgICAgICB3aWR0aDogYmFzZVdpZHRoLFxuICAgICAgICAgICAgICAgIFwiei1pbmRleFwiOiAzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGUgPSBuZXdTdGF0ZTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgIH1cbiAgICBhZGRCbG9ja0xhYmVscyhibG9ja3MpIHtcbiAgICAgICAgdmFyIGJpbiA9IC0xO1xuICAgICAgICB2YXIgYmluQ291bnQgPSAwO1xuICAgICAgICB2YXIgYmluQ2hpbGRyZW4gPSAwO1xuICAgICAgICB2YXIgYmxvY2tzTm90SW5CaW5zID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChibG9ja3NbaV0ucGFpcmVkQmluKCkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBibG9ja3NOb3RJbkJpbnMrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRCaW4gPSBibG9ja3NbaV0ucGFpcmVkQmluKCk7XG4gICAgICAgICAgICBpZiAoY3VycmVudEJpbiA9PSAtMSB8fCBjdXJyZW50QmluICE9IGJpbikge1xuICAgICAgICAgICAgICAgIGJpbiA9IGN1cnJlbnRCaW47XG4gICAgICAgICAgICAgICAgYmluQ2hpbGRyZW4gPSAwO1xuICAgICAgICAgICAgICAgIGJpbkNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbGFiZWwgPVxuICAgICAgICAgICAgICAgIFwiXCIgK1xuICAgICAgICAgICAgICAgIGJpbkNvdW50ICtcbiAgICAgICAgICAgICAgICAoY3VycmVudEJpbiAhPSAtMSA/XG4gICAgICAgICAgICAgICAgICAgIFN0cmluZy5mcm9tQ2hhckNvZGUoOTcgKyBiaW5DaGlsZHJlbikgOlxuICAgICAgICAgICAgICAgICAgICBcIiBcIik7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgYmluQ291bnQgPCAxMCAmJlxuICAgICAgICAgICAgICAgIGJsb2Nrc05vdEluQmlucyArIHRoaXMucGFpcmVkQmlucy5sZW5ndGggPj0gMTBcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGxhYmVsICs9IFwiIFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmxvY2tzW2ldLmFkZExhYmVsKGxhYmVsLCAwKTtcbiAgICAgICAgICAgIGJpbkNoaWxkcmVuKys7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJsb2Nrc05vdEluQmlucyArIHRoaXMucGFpcmVkQmlucy5sZW5ndGggPj0gMTApIHtcbiAgICAgICAgICAgIHRoaXMuYXJlYVdpZHRoICs9IDU7XG4gICAgICAgICAgICAkKHRoaXMuc291cmNlQXJlYSkuY3NzKHtcbiAgICAgICAgICAgICAgICB3aWR0aDogJCh0aGlzLnNvdXJjZUFyZWEpLndpZHRoKCkgKyA1LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKHRoaXMuYW5zd2VyQXJlYSkuY3NzKHtcbiAgICAgICAgICAgICAgICB3aWR0aDogJCh0aGlzLmFuc3dlckFyZWEpLndpZHRoKCkgKyA1LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gUHV0IGFsbCB0aGUgYmxvY2tzIGJhY2sgaW50byB0aGUgc291cmNlIGFyZWEsIHJlc2h1ZmZsaW5nIGFzIG5lY2Vzc2FyeVxuICAgIHJlc2V0VmlldygpIHtcbiAgICAgICAgLy8gQ2xlYXIgZXZlcnl0aGluZ1xuICAgICAgICB0aGlzLmNsZWFyRmVlZGJhY2soKTtcbiAgICAgICAgdmFyIHNjcm9sbFRvcCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xuICAgICAgICB2YXIgYmxvY2s7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJsb2NrID0gdGhpcy5ibG9ja3NbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGJsb2NrLmxpbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gJChibG9jay5saW5lc1tqXS52aWV3KS5maW5kKFwiLmJsb2NrLWxhYmVsXCIpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgY2hpbGRyZW4ubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5bY10ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmxvY2suZGVzdHJveSgpO1xuICAgICAgICAgICAgJCh0aGlzLmJsb2Nrc1tpXS52aWV3KS5kZXRhY2goKTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5ibG9ja3M7XG4gICAgICAgIHRoaXMuYmxvY2tJbmRleCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYWlyZWREaXZzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAkKHRoaXMucGFpcmVkRGl2c1tpXSkuZGV0YWNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgJCh0aGlzLnNvdXJjZUFyZWEpLmF0dHIoXCJzdHlsZVwiLCBcIlwiKTtcbiAgICAgICAgJCh0aGlzLmFuc3dlckFyZWEpLnJlbW92ZUNsYXNzKCk7XG4gICAgICAgICQodGhpcy5hbnN3ZXJBcmVhKS5hdHRyKFwic3R5bGVcIiwgXCJcIik7XG4gICAgICAgIHRoaXMubm9pbmRlbnQgPSB0aGlzLm9wdGlvbnMubm9pbmRlbnQ7XG4gICAgICAgIC8vIFJlaW5pdGlhbGl6ZVxuICAgICAgICBpZiAodGhpcy5oYXNTb2x2ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tDb3VudCA9IDA7XG4gICAgICAgICAgICB0aGlzLm51bURpc3RpbmN0ID0gMDtcbiAgICAgICAgICAgIHRoaXMuaGFzU29sdmVkID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFkYXB0aXZlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW5IZWxwID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vdGhpcy5oZWxwQ291bnQgPSAtMzsgLy8gZW5hYmxlIGFmdGVyIDMgZmFpbGVkIGF0dGVtcHRzXG4gICAgICAgICAgICAvL3RoaXMuaGVscEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmFkYXB0aXZlSWQgKyBcIlByb2JsZW1cIiwgdGhpcy5kaXZpZCk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgICAgICAgICB0aGlzLmFkYXB0aXZlSWQgKyB0aGlzLmRpdmlkICsgXCJDb3VudFwiLFxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tDb3VudFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuYWRhcHRpdmVJZCArIFwiU29sdmVkXCIsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluaXRpYWxpemVBcmVhcyh0aGlzLmJsb2Nrc0Zyb21Tb3VyY2UoKSwgW10sIHt9KTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplSW50ZXJhY3Rpdml0eSgpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IHNjcm9sbFRvcDtcbiAgICB9XG59XG5cblBhcnNvbnMuY291bnRlciA9IDA7XG5cbiQoZG9jdW1lbnQpLm9uKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGZ1bmN0aW9uKCkge1xuICAgICQoXCJbZGF0YS1jb21wb25lbnQ9cGFyc29uc11cIikuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICBpZiAoJCh0aGlzKS5jbG9zZXN0KFwiW2RhdGEtY29tcG9uZW50PXRpbWVkQXNzZXNzbWVudF1cIikubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcHJzTGlzdFt0aGlzLmlkXSA9IG5ldyBQYXJzb25zKHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZzogdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgdXNlUnVuZXN0b25lU2VydmljZXM6IGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHJlbmRlcmluZyBQYXJzb25zIFByb2JsZW0gJHt0aGlzLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEZXRhaWxzOiAke2Vycn1gKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIuc3RhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59KTtcbiIsIi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PSBQYXJzb25zQmxvY2sgT2JqZWN0ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09PSBUaGUgbW9kZWwgYW5kIHZpZXcgb2YgYSBjb2RlIGJsb2NrLlxuPT09PSBQUk9QRVJUSUVTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09PSBwcm9ibGVtOiB0aGUgUGFyc29ucyBwcm9ibGVtXG49PT09PT09PSBsaW5lczogYW4gYXJyYXkgb2YgUGFyc29uc0xpbmUgaW4gdGhpcyBibG9ja1xuPT09PT09PT0gaW5kZW50OiBpbmRlbnQgYmFzZWQgb24gbW92ZW1lbnRcbj09PT09PT09IHZpZXc6IGFuIGVsZW1lbnQgZm9yIHZpZXdpbmcgdGhpcyBvYmplY3Rcbj09PT09PT09IGxhYmVsczogW2xhYmVsLCBsaW5lXSB0aGUgbGFiZWxzIG51bWJlcmluZyB0aGUgYmxvY2sgYW5kIHRoZSBsaW5lcyB0aGV5IGdvIG9uXG49PT09PT09PSBoYW1tZXI6IHRoZSBjb250cm9sbGVyIGJhc2VkIG9uIGhhbW1lci5qc1xuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbmltcG9ydCBIYW1tZXIgZnJvbSBcIi4vaGFtbWVyLm1pbi5qc1wiO1xuXG4vLyBJbml0aWFsaXplIGJhc2VkIG9uIHRoZSBwcm9ibGVtIGFuZCB0aGUgbGluZXNcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnNvbnNCbG9jayB7XG4gICAgY29uc3RydWN0b3IocHJvYmxlbSwgbGluZXMpIHtcbiAgICAgICAgdGhpcy5wcm9ibGVtID0gcHJvYmxlbTtcbiAgICAgICAgdGhpcy5saW5lcyA9IGxpbmVzO1xuICAgICAgICB0aGlzLmluZGVudCA9IDA7XG4gICAgICAgIHRoaXMubGFiZWxzID0gW107XG4gICAgICAgIC8vIENyZWF0ZSB2aWV3LCBhZGRpbmcgdmlldyBvZiBsaW5lcyBhbmQgdXBkYXRpbmcgaW5kZW50XG4gICAgICAgIHZhciB2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdmlldy5pZCA9IHByb2JsZW0uY291bnRlcklkICsgXCItYmxvY2stXCIgKyBwcm9ibGVtLmJsb2NrSW5kZXg7XG4gICAgICAgIHByb2JsZW0uYmxvY2tJbmRleCArPSAxO1xuICAgICAgICAkKHZpZXcpLmFkZENsYXNzKFwiYmxvY2tcIik7XG4gICAgICAgIHZhciBzaGFyZWRJbmRlbnQgPSBsaW5lc1swXS5pbmRlbnQ7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHNoYXJlZEluZGVudCA9IE1hdGgubWluKHNoYXJlZEluZGVudCwgbGluZXNbaV0uaW5kZW50KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGluZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICQobGluZURpdikuYWRkQ2xhc3MoXCJsaW5lc1wiKTtcbiAgICAgICAgJCh2aWV3KS5hcHBlbmQobGluZURpdik7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBsaW5lID0gbGluZXNbaV07XG4gICAgICAgICAgICB2YXIgbGluZUluZGVudDtcbiAgICAgICAgICAgIGlmIChwcm9ibGVtLm5vaW5kZW50KSB7XG4gICAgICAgICAgICAgICAgbGluZUluZGVudCA9IGxpbmUuaW5kZW50O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsaW5lSW5kZW50ID0gbGluZS5pbmRlbnQgLSBzaGFyZWRJbmRlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKGxpbmUudmlldykucmVtb3ZlQ2xhc3MoXCJpbmRlbnQxIGluZGVudDIgaW5kZW50MyBpbmRlbnQ0XCIpO1xuICAgICAgICAgICAgaWYgKGxpbmVJbmRlbnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgJChsaW5lLnZpZXcpLmFkZENsYXNzKFwiaW5kZW50XCIgKyBsaW5lSW5kZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxpbmVEaXYuYXBwZW5kQ2hpbGQobGluZS52aWV3KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGFiZWxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAkKGxhYmVsRGl2KS5hZGRDbGFzcyhcImxhYmVsc1wiKTtcbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbS5vcHRpb25zLm51bWJlcmVkID09IFwibGVmdFwiKSB7XG4gICAgICAgICAgICAkKGxpbmVEaXYpLmFkZENsYXNzKFwiYm9yZGVyX2xlZnRcIik7XG4gICAgICAgICAgICAkKHZpZXcpLnByZXBlbmQobGFiZWxEaXYpO1xuICAgICAgICAgICAgJCh2aWV3KS5jc3Moe1xuICAgICAgICAgICAgICAgIFwianVzdGlmeS1jb250ZW50XCI6IFwiZmxleC1zdGFydFwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcm9ibGVtLm9wdGlvbnMubnVtYmVyZWQgPT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgICAkKGxhYmVsRGl2KS5hZGRDbGFzcyhcImJvcmRlcl9sZWZ0XCIpO1xuICAgICAgICAgICAgJChsYWJlbERpdikuY3NzKHtcbiAgICAgICAgICAgICAgICBmbG9hdDogXCJyaWdodFwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKHZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgXCJqdXN0aWZ5LWNvbnRlbnRcIjogXCJzcGFjZS1iZXR3ZWVuXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQodmlldykuYXBwZW5kKGxhYmVsRGl2KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuICAgIH1cbiAgICAvLyBBZGQgYSBsaW5lIChmcm9tIGFub3RoZXIgYmxvY2spIHRvIHRoaXMgYmxvY2tcbiAgICBhZGRMaW5lKGxpbmUpIHtcbiAgICAgICAgJChsaW5lLnZpZXcpLnJlbW92ZUNsYXNzKFwiaW5kZW50MSBpbmRlbnQyIGluZGVudDMgaW5kZW50NFwiKTtcbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbS5ub2luZGVudCkge1xuICAgICAgICAgICAgaWYgKGxpbmUuaW5kZW50ID4gMCkge1xuICAgICAgICAgICAgICAgICQobGluZS52aWV3KS5hZGRDbGFzcyhcImluZGVudFwiICsgbGluZS5pbmRlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGxpbmVzID0gdGhpcy5saW5lcztcbiAgICAgICAgICAgIHZhciBzaGFyZWRJbmRlbnQgPSBsaW5lc1swXS5pbmRlbnQ7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc2hhcmVkSW5kZW50ID0gTWF0aC5taW4oc2hhcmVkSW5kZW50LCBsaW5lc1tpXS5pbmRlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNoYXJlZEluZGVudCA8IGxpbmUuaW5kZW50KSB7XG4gICAgICAgICAgICAgICAgJChsaW5lLnZpZXcpLmFkZENsYXNzKFwiaW5kZW50XCIgKyAobGluZS5pbmRlbnQgLSBzaGFyZWRJbmRlbnQpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2hhcmVkSW5kZW50ID4gbGluZS5pbmRlbnQpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICQobGluZXNbaV0udmlldykucmVtb3ZlQ2xhc3MoXG4gICAgICAgICAgICAgICAgICAgICAgICBcImluZGVudDEgaW5kZW50MiBpbmRlbnQzIGluZGVudDRcIlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAkKGxpbmVzW2ldLnZpZXcpLmFkZENsYXNzKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbmRlbnRcIiArIChsaW5lc1tpXS5pbmRlbnQgLSBsaW5lLmluZGVudClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5saW5lcy5wdXNoKGxpbmUpO1xuICAgICAgICAkKHRoaXMudmlldykuY2hpbGRyZW4oXCIubGluZXNcIilbMF0uYXBwZW5kQ2hpbGQobGluZS52aWV3KTtcbiAgICB9XG4gICAgLy8gQWRkIHRoZSBjb250ZW50cyBvZiB0aGF0IGJsb2NrIHRvIG15c2VsZiBhbmQgdGhlbiBkZWxldGUgdGhhdCBibG9ja1xuICAgIGNvbnN1bWVCbG9jayhibG9jaykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2NrLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmFkZExpbmUoYmxvY2subGluZXNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICgkKGJsb2NrLnZpZXcpLmF0dHIoXCJ0YWJpbmRleFwiKSA9PSBcIjBcIikge1xuICAgICAgICAgICAgdGhpcy5tYWtlVGFiSW5kZXgoKTtcbiAgICAgICAgfVxuICAgICAgICAkKGJsb2NrLnZpZXcpLmRldGFjaCgpO1xuICAgICAgICB2YXIgbmV3QmxvY2tzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wcm9ibGVtLmJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJvYmxlbS5ibG9ja3NbaV0gIT09IGJsb2NrKSB7XG4gICAgICAgICAgICAgICAgbmV3QmxvY2tzLnB1c2godGhpcy5wcm9ibGVtLmJsb2Nrc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9jay5sYWJlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYWRkTGFiZWwoXG4gICAgICAgICAgICAgICAgYmxvY2subGFiZWxzW2ldWzBdLFxuICAgICAgICAgICAgICAgIHRoaXMubGluZXMubGVuZ3RoIC0gYmxvY2subGluZXMubGVuZ3RoICsgYmxvY2subGFiZWxzW2ldWzFdXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJvYmxlbS5ibG9ja3MgPSBuZXdCbG9ja3M7XG4gICAgICAgIHRoaXMucHJvYmxlbS5zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVZpZXcoKTtcbiAgICB9XG4gICAgLy8gVXBkYXRlIHRoZSBtb2RlbCBhbmQgdmlldyB3aGVuIGJsb2NrIGlzIGNvbnZlcnRlZCB0byBjb250YWluIGluZGVudFxuICAgIGFkZEluZGVudCgpIHtcbiAgICAgICAgLy8gVXBkYXRlIHRoZSBsaW5lcyBtb2RlbCAvIHZpZXdcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbGluZSA9IHRoaXMubGluZXNbaV07XG4gICAgICAgICAgICBpZiAobGluZS5pbmRlbnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgJChsaW5lLnZpZXcpLnJlbW92ZUNsYXNzKFwiaW5kZW50MSBpbmRlbnQyIGluZGVudDMgaW5kZW50NFwiKTtcbiAgICAgICAgICAgICAgICAkKGxpbmUudmlldykuYWRkQ2xhc3MoXCJpbmRlbnRcIiArIGxpbmUuaW5kZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBVcGRhdGUgdGhlIGJsb2NrIG1vZGVsIC8gdmlld1xuICAgICAgICB0aGlzLmluZGVudCA9IDA7XG4gICAgICAgICQodGhpcy52aWV3KS5jc3Moe1xuICAgICAgICAgICAgXCJwYWRkaW5nLWxlZnRcIjogXCJcIixcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnByb2JsZW0uYXJlYVdpZHRoIC0gMjIsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBBZGQgYSBsYWJlbCB0byBibG9jayBhbmQgdXBkYXRlIGl0cyB2aWV3XG4gICAgYWRkTGFiZWwobGFiZWwsIGxpbmUpIHtcbiAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICQoZGl2KS5hZGRDbGFzcyhcImJsb2NrLWxhYmVsXCIpO1xuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLm9wdGlvbnMubnVtYmVyZWQgPT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgICAkKGRpdikuYWRkQ2xhc3MoXCJyaWdodC1sYWJlbFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLm9wdGlvbnMubnVtYmVyZWQgPT0gXCJsZWZ0XCIpIHtcbiAgICAgICAgICAgICQoZGl2KS5hZGRDbGFzcyhcImxlZnQtbGFiZWxcIik7XG4gICAgICAgIH1cbiAgICAgICAgJChkaXYpLmFwcGVuZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShsYWJlbCkpO1xuICAgICAgICAkKHRoaXMudmlldykuY2hpbGRyZW4oXCIubGFiZWxzXCIpWzBdLmFwcGVuZChkaXYpO1xuICAgICAgICBpZiAodGhpcy5sYWJlbHMubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgICQoZGl2KS5jc3MoXG4gICAgICAgICAgICAgICAgXCJtYXJnaW4tdG9wXCIsXG4gICAgICAgICAgICAgICAgKGxpbmUgLSB0aGlzLmxhYmVsc1t0aGlzLmxhYmVscy5sZW5ndGggLSAxXVsxXSAtIDEpICpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5lc1tsaW5lXS52aWV3Lm9mZnNldEhlaWdodFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxhYmVscy5wdXNoKFtsYWJlbCwgbGluZV0pO1xuICAgIH1cbiAgICAvLyBJbml0aWFsaXplIEludGVyYWN0aXZpdHlcbiAgICBpbml0aWFsaXplSW50ZXJhY3Rpdml0eSgpIHtcbiAgICAgICAgaWYgKCQodGhpcy52aWV3KS5oYXNDbGFzcyhcImRpc2FibGVkXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICAkKHRoaXMudmlldykuYXR0cihcInRhYmluZGV4XCIsIFwiLTFcIik7XG4gICAgICAgIHRoaXMuaGFtbWVyID0gbmV3IEhhbW1lci5NYW5hZ2VyKHRoaXMudmlldywge1xuICAgICAgICAgICAgcmVjb2duaXplcnM6IFtcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIEhhbW1lci5QYW4sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogSGFtbWVyLkRJUkVDVElPTl9BTEwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJlc2hvbGQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludGVyczogMSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdGhpcy5oYW1tZXIub24oXCJwYW5zdGFydFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoYXQucGFuU3RhcnQoZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5oYW1tZXIub24oXCJwYW5lbmRcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGF0LnBhbkVuZChldmVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmhhbW1lci5vbihcInBhbm1vdmVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGF0LnBhbk1vdmUoZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gUmV0dXJuIGEgYm9vbGVhbiBhcyB0byB3aGV0aGVyIHRoaXMgYmxvY2sgaXMgYWJsZSB0byBiZSBzZWxlY3RlZFxuICAgIGVuYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiAkKHRoaXMudmlldykuYXR0cihcInRhYmluZGV4XCIpICE9PSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vIFJldHVybiBhIGJvb2xlYW4gYXMgdG8gd2hldGhlciB0aGlzIGJsb2NrIGlzIGEgZGlzdHJhY3RvclxuICAgIGlzRGlzdHJhY3RvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGluZXNbMF0uZGlzdHJhY3RvcjtcbiAgICB9XG4gICAgLy8gUmV0dXJuIGEgYm9vbGVhbiBhcyB0byB3aGV0aGVyIHRoaXMgYmxvY2sgaXMgaW4gdGhlIHNvdXJjZSBhcmVhXG4gICAgaW5Tb3VyY2VBcmVhKCkge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLnByb2JsZW0uc291cmNlQXJlYS5jaGlsZE5vZGVzO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT0gdGhpcy52aWV3LmlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gdGhlIHBhZ2UgWCBwb3NpdGlvbiBvZiB0aGUgY2VudGVyIG9mIHRoZSB2aWV3XG4gICAgcGFnZVhDZW50ZXIoKSB7XG4gICAgICAgIHZhciBib3VuZGluZ1JlY3QgPSB0aGlzLnZpZXcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHZhciBwYWdlWENlbnRlciA9XG4gICAgICAgICAgICB3aW5kb3cucGFnZVhPZmZzZXQgKyBib3VuZGluZ1JlY3QubGVmdCArIGJvdW5kaW5nUmVjdC53aWR0aCAvIDI7XG4gICAgICAgIHJldHVybiBwYWdlWENlbnRlcjtcbiAgICB9XG4gICAgLy8gUmV0dXJuIHRoZSBwYWdlIFkgcG9zaXRpb24gb2YgdGhlIGNlbnRlciBvZiB0aGUgdmlld1xuICAgIHBhZ2VZQ2VudGVyKCkge1xuICAgICAgICB2YXIgYm91bmRpbmdSZWN0ID0gdGhpcy52aWV3LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB2YXIgcGFnZVlDZW50ZXIgPVxuICAgICAgICAgICAgd2luZG93LnBhZ2VZT2Zmc2V0ICsgYm91bmRpbmdSZWN0LnRvcCArIGJvdW5kaW5nUmVjdC5oZWlnaHQgLyAyO1xuICAgICAgICByZXR1cm4gcGFnZVlDZW50ZXI7XG4gICAgfVxuICAgIC8vIE9mIGFsbCB0aGUgbGluZSBpbmRlbnRzLCByZXR1cm4gdGhlIG1pbmltdW0gdmFsdWVcbiAgICBtaW5pbXVtTGluZUluZGVudCgpIHtcbiAgICAgICAgdmFyIG1pbmltdW1MaW5lSW5kZW50ID0gdGhpcy5saW5lc1swXS5pbmRlbnQ7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbWluaW11bUxpbmVJbmRlbnQgPSBNYXRoLm1pbihcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVzW2ldLmluZGVudCxcbiAgICAgICAgICAgICAgICBtaW5pbXVtTGluZUluZGVudFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluaW11bUxpbmVJbmRlbnQ7XG4gICAgfVxuICAgIC8vIFJldHVybiB0aGUgbGFzdCBibG9jayBpbiB0aGUgc291cmNlIGFyZWEgdGhhdCBtYXRjaGVzIHRoZSBwYWlyZWQgYmluIGl0IGlzIGluXG4gICAgc2xpZGVVbmRlckJsb2NrKCkge1xuICAgICAgICB2YXIgc291cmNlQmxvY2tzID0gdGhpcy5wcm9ibGVtLnNvdXJjZUJsb2NrcygpO1xuICAgICAgICBpZiAoc291cmNlQmxvY2tzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwYWlyZWRCaW4gPSB0aGlzLnBhaXJlZEJpbigpO1xuICAgICAgICBpZiAocGFpcmVkQmluID09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gc291cmNlQmxvY2tzW3NvdXJjZUJsb2Nrcy5sZW5ndGggLSAxXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gc291cmNlQmxvY2tzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB2YXIgYmxvY2sgPSBzb3VyY2VCbG9ja3NbaV07XG4gICAgICAgICAgICBpZiAoYmxvY2sucGFpcmVkQmluKCkgPT0gcGFpcmVkQmluKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJsb2NrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzb3VyY2VCbG9ja3Nbc291cmNlQmxvY2tzLmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gd2hpY2ggcGFpcmVkIGJpbiBpdCBpcyBpbiAoLTEpIGlmIG5vdFxuICAgIHBhaXJlZEJpbigpIHtcbiAgICAgICAgdmFyIHBhaXJlZEJpbnMgPSB0aGlzLnByb2JsZW0ucGFpcmVkQmlucztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWlyZWRCaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5tYXRjaGVzQmluKHBhaXJlZEJpbnNbaV0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gdHJ1ZSBpZiBhbGwgbGluZXMgYXJlIGluIHRoYXQgYmluXG4gICAgbWF0Y2hlc0JpbihiaW4pIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdGVzdCA9IHRoaXMubGluZXNbaV0uaW5kZXg7XG4gICAgICAgICAgICBpZiAoYmluLmluZGV4T2YodGVzdCkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIFJldHVybiBhIGxpc3Qgb2YgaW5kZXhlcyB3aGVyZSB0aGlzIGJsb2NrIGNvdWxkIGJlIGluc2VydGVkIGJlZm9yZVxuICAgIHZhbGlkU291cmNlSW5kZXhlcygpIHtcbiAgICAgICAgdmFyIGJsb2NrcyA9IHRoaXMucHJvYmxlbS5zb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgdmFyIGluZGV4ZXMgPSBbXTtcbiAgICAgICAgdmFyIHBhaXJlZEJpbiA9IHRoaXMucGFpcmVkQmluKCk7XG4gICAgICAgIHZhciBpLCBsYXN0QmluO1xuICAgICAgICBpZiAocGFpcmVkQmluID49IDApIHtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYmxvY2sgPSBibG9ja3NbaV07XG4gICAgICAgICAgICAgICAgaWYgKGJsb2NrLnZpZXcuaWQgIT09IHRoaXMudmlldy5pZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmxvY2tCaW4gPSBibG9jay5wYWlyZWRCaW4oKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrQmluID09IHBhaXJlZEJpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhlcy5wdXNoKGkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxhc3RCaW4gPT0gcGFpcmVkQmluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleGVzLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGFzdEJpbiA9IGJsb2NrQmluO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsYXN0QmluID09IHBhaXJlZEJpbikge1xuICAgICAgICAgICAgICAgIGluZGV4ZXMucHVzaChibG9ja3MubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbmRleGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5kZXhlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYmxvY2sgPSBibG9ja3NbaV07XG4gICAgICAgICAgICBpZiAoYmxvY2sudmlldy5pZCAhPT0gdGhpcy52aWV3LmlkKSB7XG4gICAgICAgICAgICAgICAgbGV0IGJsb2NrQmluID0gYmxvY2sucGFpcmVkQmluKCk7XG4gICAgICAgICAgICAgICAgaWYgKGJsb2NrQmluICE9PSBsYXN0QmluKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ZXMucHVzaChpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGJsb2NrQmluID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ZXMucHVzaChpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGFzdEJpbiA9IGJsb2NrQmluO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGluZGV4ZXMucHVzaChibG9ja3MubGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuIGluZGV4ZXM7XG4gICAgfVxuICAgIC8vIEEgbWVhc3VyZSBvZiBob3cgZmFyIHRoZSBtaWRkbGUgb2YgdGhpcyBibG9jayBpcyB2ZXJ0aWNhbGx5IHBvc2l0aW9uZWRcbiAgICB2ZXJ0aWNhbE9mZnNldCgpIHtcbiAgICAgICAgdmFyIHZlcnRpY2FsT2Zmc2V0O1xuICAgICAgICBpZiAodGhpcy5pblNvdXJjZUFyZWEoKSkge1xuICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPSB0aGlzLnByb2JsZW0uc291cmNlQXJlYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICAgICAgICAgIC50b3A7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9IHRoaXMucHJvYmxlbS5hbnN3ZXJBcmVhLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgICAgICAgICAgLnRvcDtcbiAgICAgICAgfVxuICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9XG4gICAgICAgICAgICB0aGlzLnZpZXcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICtcbiAgICAgICAgICAgIHRoaXMudmlldy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b20gLVxuICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgKiAyO1xuICAgICAgICByZXR1cm4gdmVydGljYWxPZmZzZXQ7XG4gICAgfVxuICAgIC8vIFRoaXMgYmxvY2sganVzdCBnYWluZWQgdGV4dHVhbCBmb2N1c1xuICAgIG5ld0ZvY3VzKCkge1xuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnRleHRGb2N1cyA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5lbnRlcktleWJvYXJkTW9kZSgpO1xuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRGb2N1cyA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICQodGhpcy52aWV3KS5hZGRDbGFzcyhcImRvd25cIik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcm9ibGVtLnRleHRGb2N1cyA9PSB0aGlzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnRleHRNb3ZlKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLnZpZXcpLmFkZENsYXNzKFwidXBcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQodGhpcy52aWV3KS5hZGRDbGFzcyhcImRvd25cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBhbHJlYWR5IGluIGtleWJvYXJkIG1vZGVcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0Rm9jdXMgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZlID0gZmFsc2U7XG4gICAgICAgICAgICAkKHRoaXMudmlldykuYWRkQ2xhc3MoXCJkb3duXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJvYmxlbS50ZXh0TW92aW5nID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIFRoaXMgYmxvY2sganVzdCBsb3N0IHRleHR1YWwgZm9jdXNcbiAgICByZWxlYXNlRm9jdXMoKSB7XG4gICAgICAgICQodGhpcy52aWV3KS5yZW1vdmVDbGFzcyhcImRvd24gdXBcIik7XG4gICAgICAgIGlmICh0aGlzLnByb2JsZW0udGV4dEZvY3VzID09IHRoaXMpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5wcm9ibGVtLnRleHRNb3ZpbmcpIHtcbiAgICAgICAgICAgICAgICAvLyBleGl0IG91dCBvZiBwcm9ibGVtIGJ1dCBzdGF5IHdheSBpbnRvIHByb2JsZW1cbiAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dEZvY3VzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb2JsZW0udGV4dE1vdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLmxvZ01vdmUoXCJrbW92ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5leGl0S2V5Ym9hcmRNb2RlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBiZWNvbWUgc2VsZWN0YWJsZSwgYnV0IG5vdCBhY3RpdmVcbiAgICAgICAgICAgICQodGhpcy52aWV3KS5hdHRyKFwidGFiaW5kZXhcIiwgXCItMVwiKTtcbiAgICAgICAgICAgICQodGhpcy52aWV3KS51bmJpbmQoXCJmb2N1c1wiKTtcbiAgICAgICAgICAgICQodGhpcy52aWV3KS51bmJpbmQoXCJibHVyXCIpO1xuICAgICAgICAgICAgJCh0aGlzLnZpZXcpLnVuYmluZChcImtleWRvd25cIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTWFrZSB0aGlzIGJsb2NrIGludG8gdGhlIGtleWJvYXJkIGVudHJ5IHBvaW50XG4gICAgbWFrZVRhYkluZGV4KCkge1xuICAgICAgICAkKHRoaXMudmlldykuYXR0cihcInRhYmluZGV4XCIsIFwiMFwiKTtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAkKHRoaXMudmlldykuZm9jdXMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhhdC5uZXdGb2N1cygpO1xuICAgICAgICB9KTtcbiAgICAgICAgJCh0aGlzLnZpZXcpLmJsdXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhhdC5yZWxlYXNlRm9jdXMoKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQodGhpcy52aWV3KS5rZXlkb3duKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhhdC5rZXlEb3duKGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIENhbGxlZCB0byBkaXNhYmxlIGludGVyYWN0aW9uIGZvciB0aGUgZnV0dXJlXG4gICAgZGlzYWJsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFtbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuaGFtbWVyLnNldCh7IGVuYWJsZTogZmFsc2UgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCQodGhpcy52aWV3KS5hdHRyKFwidGFiaW5kZXhcIikgPT0gXCIwXCIpIHtcbiAgICAgICAgICAgIHRoaXMucmVsZWFzZUZvY3VzKCk7XG4gICAgICAgICAgICAkKHRoaXMudmlldykucmVtb3ZlQXR0cihcInRhYmluZGV4XCIpO1xuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLmluaXRpYWxpemVUYWJJbmRleCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzLnZpZXcpLnJlbW92ZUF0dHIoXCJ0YWJpbmRleFwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBFbmFibGUgZnVuY3Rpb25hbGl0eSBhZnRlciByZXNldCBidXR0b24gaGFzIGJlZW4gcHJlc3NlZFxuICAgIHJlc2V0VmlldygpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFtbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuaGFtbWVyLnNldCh7IGVuYWJsZTogdHJ1ZSB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoISQodGhpcy52aWV3KVswXS5oYXNBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiKSkge1xuICAgICAgICAgICAgJCh0aGlzLnZpZXcpLmF0dHIoXCJ0YWJpbmRleFwiLCBcIi0xXCIpO1xuICAgICAgICB9XG4gICAgICAgICQodGhpcy52aWV3KS5jc3MoeyBvcGFjaXR5OiBcIlwiIH0pO1xuICAgIH1cbiAgICAvLyBDYWxsZWQgdG8gZGVzdHJveSBpbnRlcmFjdGlvbiBmb3IgdGhlIGZ1dHVyZVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLmhhbW1lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmhhbW1lci5kZXN0cm95KCk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5oYW1tZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCQodGhpcy52aWV3KS5hdHRyKFwidGFiaW5kZXhcIikgPT0gXCIwXCIpIHtcbiAgICAgICAgICAgIHRoaXMucmVsZWFzZUZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgJCh0aGlzLnZpZXcpLnJlbW92ZUF0dHIoXCJ0YWJpbmRleFwiKTtcbiAgICB9XG4gICAgLy8gQ2FsbGVkIHdoZW4gYSBibG9jayBpcyBwaWNrZWQgdXBcbiAgICBwYW5TdGFydChldmVudCkge1xuICAgICAgICB0aGlzLnByb2JsZW0uY2xlYXJGZWVkYmFjaygpO1xuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnN0YXJ0ZWQgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBsb2cgdGhlIGZpcnN0IHRpbWUgdGhhdCBzb21ldGhpbmcgZ2V0cyBtb3ZlZFxuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLmxvZ01vdmUoXCJzdGFydFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnRleHRGb2N1cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBzdG9wIHRleHQgZm9jdXMgd2hlbiBkcmFnZ2luZ1xuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRGb2N1cy5yZWxlYXNlRm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByb2JsZW0ubW92aW5nID0gdGhpcztcbiAgICAgICAgLy8gVXBkYXRlIHRoZSB2aWV3XG4gICAgICAgIHRoaXMucHJvYmxlbS5tb3ZpbmdYID0gZXZlbnQuc3JjRXZlbnQucGFnZVg7XG4gICAgICAgIHRoaXMucHJvYmxlbS5tb3ZpbmdZID0gZXZlbnQuc3JjRXZlbnQucGFnZVk7XG4gICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgfVxuICAgIC8vIENhbGxlZCB3aGVuIGEgYmxvY2sgaXMgZHJvcHBlZFxuICAgIHBhbkVuZChldmVudCkge1xuICAgICAgICB0aGlzLnByb2JsZW0uaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnByb2JsZW0ubW92aW5nO1xuICAgICAgICBkZWxldGUgdGhpcy5wcm9ibGVtLm1vdmluZ1g7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnByb2JsZW0ubW92aW5nWTtcbiAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgdGhpcy5wcm9ibGVtLmxvZ01vdmUoXCJtb3ZlXCIpO1xuICAgIH1cbiAgICAvLyBDYWxsZWQgd2hlbiBhIGJsb2NrIGlzIG1vdmVkXG4gICAgcGFuTW92ZShldmVudCkge1xuICAgICAgICAvLyBVcGRhdGUgdGhlIHZpZXdcbiAgICAgICAgdGhpcy5wcm9ibGVtLm1vdmluZ1ggPSBldmVudC5zcmNFdmVudC5wYWdlWDtcbiAgICAgICAgdGhpcy5wcm9ibGVtLm1vdmluZ1kgPSBldmVudC5zcmNFdmVudC5wYWdlWTtcbiAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVZpZXcoKTtcbiAgICB9XG4gICAgLy8gSGFuZGxlIGEga2V5cHJlc3MgZXZlbnQgd2hlbiBpbiBmb2N1c1xuICAgIGtleURvd24oZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbS5zdGFydGVkID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gbG9nIHRoZSBmaXJzdCB0aW1lIHRoYXQgc29tZXRoaW5nIGdldHMgbW92ZWRcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5sb2dNb3ZlKFwia3N0YXJ0XCIpO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgICAgICAgY2FzZSAzNzogLy8gbGVmdFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb2JsZW0udGV4dE1vdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlTGVmdCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0TGVmdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzg6IC8vIHVwXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvYmxlbS50ZXh0TW92ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVVcCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0VXAoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzk6IC8vIHJpZ2h0XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvYmxlbS50ZXh0TW92ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVSaWdodCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0UmlnaHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDA6IC8vIGRvd25cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnRleHRNb3ZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZURvd24oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdERvd24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzI6IC8vIHNwYWNlXG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGVNb3ZlKCk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTM6IC8vIGVudGVyXG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGVNb3ZlKCk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBNb3ZlIGJsb2NrIGxlZnRcbiAgICBtb3ZlTGVmdCgpIHtcbiAgICAgICAgdmFyIGluZGV4LCBibG9jaztcbiAgICAgICAgaWYgKCF0aGlzLmluU291cmNlQXJlYSgpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbmRlbnQgPT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIG1vdmUgdG8gc291cmNlIGFyZWFcbiAgICAgICAgICAgICAgICB2YXIgYmxvY2tzID0gdGhpcy5wcm9ibGVtLnNvdXJjZUJsb2NrcygpO1xuICAgICAgICAgICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLnZlcnRpY2FsT2Zmc2V0KCk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbGlkU291cmNlSW5kZXhlcyA9IHRoaXMudmFsaWRTb3VyY2VJbmRleGVzKCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWxpZFNvdXJjZUluZGV4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSB2YWxpZFNvdXJjZUluZGV4ZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSBibG9ja3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uc291cmNlQXJlYS5hcHBlbmRDaGlsZCh0aGlzLnZpZXcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzLnZpZXcpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jayA9IGJsb2Nrc1tpbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2sudmVydGljYWxPZmZzZXQoKSA+PSBvZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnNvdXJjZUFyZWEuaW5zZXJ0QmVmb3JlKHRoaXMudmlldywgYmxvY2sudmlldyk7XG4gICAgICAgICAgICAgICAgJCh0aGlzLnZpZXcpLmZvY3VzKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHJlZHVjZSBpbmRlbnRcbiAgICAgICAgICAgICAgICB0aGlzLmluZGVudCA9IHRoaXMuaW5kZW50IC0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTW92ZSBibG9jayB1cFxuICAgIG1vdmVVcCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5Tb3VyY2VBcmVhKCkpIHtcbiAgICAgICAgICAgIGxldCBibG9ja3MgPSB0aGlzLnByb2JsZW0uc291cmNlQmxvY2tzKCk7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy52ZXJ0aWNhbE9mZnNldCgpO1xuICAgICAgICAgICAgdmFyIHZhbGlkU291cmNlSW5kZXhlcyA9IHRoaXMudmFsaWRTb3VyY2VJbmRleGVzKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbGlkU291cmNlSW5kZXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkU291cmNlSW5kZXhlc1t2YWxpZFNvdXJjZUluZGV4ZXMubGVuZ3RoIC0gMSAtIGldO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IGJsb2Nrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJsb2NrID0gYmxvY2tzW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrLnZlcnRpY2FsT2Zmc2V0KCkgPCBvZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0TW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zb3VyY2VBcmVhLmluc2VydEJlZm9yZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sudmlld1xuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcy52aWV3KS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGJsb2NrcyA9IHRoaXMucHJvYmxlbS5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJsb2Nrc1tpXS52aWV3LmlkID09IHRoaXMudmlldy5pZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5hbnN3ZXJBcmVhLmluc2VydEJlZm9yZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrc1tpIC0gMV0udmlld1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMudmlldykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBNb3ZlIGJsb2NrIHJpZ2h0XG4gICAgbW92ZVJpZ2h0KCkge1xuICAgICAgICBpZiAodGhpcy5pblNvdXJjZUFyZWEoKSkge1xuICAgICAgICAgICAgLy8gbW92ZSB0byBhbnN3ZXIgYXJlYVxuICAgICAgICAgICAgdGhpcy5pbmRlbnQgPSAwO1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMudmVydGljYWxPZmZzZXQoKTtcbiAgICAgICAgICAgIHZhciBhbnN3ZXJCbG9ja3MgPSB0aGlzLnByb2JsZW0uYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFuc3dlckJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gYW5zd2VyQmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBpdGVtT2Zmc2V0ID0gaXRlbS52ZXJ0aWNhbE9mZnNldCgpO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtT2Zmc2V0ID49IG9mZnNldCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5hbnN3ZXJBcmVhLmluc2VydEJlZm9yZSh0aGlzLnZpZXcsIGl0ZW0udmlldyk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcy52aWV3KS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0TW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5hbnN3ZXJBcmVhLmFwcGVuZENoaWxkKHRoaXMudmlldyk7XG4gICAgICAgICAgICAkKHRoaXMudmlldykuZm9jdXMoKTtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBpbiBhbnN3ZXIgYXJlYTogaW5jcmVhc2UgdGhlIGluZGVudFxuICAgICAgICAgICAgaWYgKHRoaXMuaW5kZW50ICE9PSB0aGlzLnByb2JsZW0uaW5kZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRlbnQgPSB0aGlzLmluZGVudCArIDE7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTW92ZSBibG9jayBkb3duXG4gICAgbW92ZURvd24oKSB7XG4gICAgICAgIGlmICh0aGlzLmluU291cmNlQXJlYSgpKSB7XG4gICAgICAgICAgICBsZXQgYmxvY2tzID0gdGhpcy5wcm9ibGVtLnNvdXJjZUJsb2NrcygpO1xuICAgICAgICAgICAgdmFyIHZhbGlkU291cmNlSW5kZXhlcyA9IHRoaXMudmFsaWRTb3VyY2VJbmRleGVzKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChibG9ja3NbaV0udmlldy5pZCA9PSB0aGlzLnZpZXcuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG15SW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsaWRTb3VyY2VJbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdmFsaWRTb3VyY2VJbmRleGVzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSBibG9ja3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0TW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnNvdXJjZUFyZWEuYXBwZW5kQ2hpbGQodGhpcy52aWV3KTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLnZpZXcpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbmRleCAtIG15SW5kZXggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0TW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnNvdXJjZUFyZWEuaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tzW2luZGV4XS52aWV3XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcy52aWV3KS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBibG9ja3MgPSB0aGlzLnByb2JsZW0uYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChibG9ja3NbaV0udmlldy5pZCA9PSB0aGlzLnZpZXcuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT0gYmxvY2tzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT0gYmxvY2tzLmxlbmd0aCAtIDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0TW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5hbnN3ZXJBcmVhLmFwcGVuZENoaWxkKHRoaXMudmlldyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uYW5zd2VyQXJlYS5pbnNlcnRCZWZvcmUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrc1tpICsgMl0udmlld1xuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMudmlldykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBNb3ZlIHNlbGVjdGlvbiBsZWZ0XG4gICAgc2VsZWN0TGVmdCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmluU291cmNlQXJlYSgpKSB7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy52ZXJ0aWNhbE9mZnNldCgpO1xuICAgICAgICAgICAgdmFyIHNvdXJjZUJsb2NrcyA9IHRoaXMucHJvYmxlbS5lbmFibGVkU291cmNlQmxvY2tzKCk7XG4gICAgICAgICAgICBpZiAoc291cmNlQmxvY2tzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY2hvb3NlTmV4dCA9IHNvdXJjZUJsb2Nrc1swXTtcbiAgICAgICAgICAgIHZhciBjaG9vc2VPZmZzZXQgPSBjaG9vc2VOZXh0LnZlcnRpY2FsT2Zmc2V0KCkgLSBvZmZzZXQ7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHNvdXJjZUJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gc291cmNlQmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBpdGVtT2Zmc2V0ID0gaXRlbS52ZXJ0aWNhbE9mZnNldCgpIC0gb2Zmc2V0O1xuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhpdGVtT2Zmc2V0KSA8IE1hdGguYWJzKGNob29zZU9mZnNldCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hvb3NlTmV4dCA9IGl0ZW07XG4gICAgICAgICAgICAgICAgICAgIGNob29zZU9mZnNldCA9IGl0ZW1PZmZzZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRGb2N1cyA9IGNob29zZU5leHQ7XG4gICAgICAgICAgICBjaG9vc2VOZXh0Lm1ha2VUYWJJbmRleCgpO1xuICAgICAgICAgICAgJChjaG9vc2VOZXh0LnZpZXcpLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTW92ZSBzZWxlY3Rpb24gdXBcbiAgICBzZWxlY3RVcCgpIHtcbiAgICAgICAgdmFyIGNob29zZU5leHQgPSBmYWxzZTtcbiAgICAgICAgdmFyIGJsb2NrcztcbiAgICAgICAgaWYgKHRoaXMuaW5Tb3VyY2VBcmVhKCkpIHtcbiAgICAgICAgICAgIGJsb2NrcyA9IHRoaXMucHJvYmxlbS5lbmFibGVkU291cmNlQmxvY2tzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBibG9ja3MgPSB0aGlzLnByb2JsZW0uZW5hYmxlZEFuc3dlckJsb2NrcygpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSBibG9ja3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gYmxvY2tzW2ldO1xuICAgICAgICAgICAgaWYgKGNob29zZU5leHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dEZvY3VzID0gaXRlbTtcbiAgICAgICAgICAgICAgICBpdGVtLm1ha2VUYWJJbmRleCgpO1xuICAgICAgICAgICAgICAgICQoaXRlbS52aWV3KS5mb2N1cygpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS52aWV3LmlkID09IHRoaXMudmlldy5pZCkge1xuICAgICAgICAgICAgICAgICAgICBjaG9vc2VOZXh0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTW92ZSBzZWxlY3Rpb24gcmlnaHRcbiAgICBzZWxlY3RSaWdodCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5Tb3VyY2VBcmVhKCkpIHtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLnZlcnRpY2FsT2Zmc2V0KCk7XG4gICAgICAgICAgICB2YXIgYmxvY2tzID0gdGhpcy5wcm9ibGVtLmVuYWJsZWRBbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgICAgIGlmIChibG9ja3MubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjaG9vc2VOZXh0ID0gYmxvY2tzWzBdO1xuICAgICAgICAgICAgdmFyIGNob29zZU9mZnNldCA9IGNob29zZU5leHQudmVydGljYWxPZmZzZXQoKSAtIG9mZnNldDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBibG9ja3NbaV07XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1PZmZzZXQgPSBpdGVtLnZlcnRpY2FsT2Zmc2V0KCkgLSBvZmZzZXQ7XG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGl0ZW1PZmZzZXQpIDwgTWF0aC5hYnMoY2hvb3NlT2Zmc2V0KSkge1xuICAgICAgICAgICAgICAgICAgICBjaG9vc2VOZXh0ID0gaXRlbTtcbiAgICAgICAgICAgICAgICAgICAgY2hvb3NlT2Zmc2V0ID0gaXRlbU9mZnNldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dEZvY3VzID0gY2hvb3NlTmV4dDtcbiAgICAgICAgICAgIGNob29zZU5leHQubWFrZVRhYkluZGV4KCk7XG4gICAgICAgICAgICAkKGNob29zZU5leHQudmlldykuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBNb3ZlIHNlbGVjdGlvbiBkb3duXG4gICAgc2VsZWN0RG93bigpIHtcbiAgICAgICAgdmFyIGNob29zZU5leHQgPSBmYWxzZTtcbiAgICAgICAgdmFyIGJsb2NrcztcbiAgICAgICAgaWYgKHRoaXMuaW5Tb3VyY2VBcmVhKCkpIHtcbiAgICAgICAgICAgIGJsb2NrcyA9IHRoaXMucHJvYmxlbS5lbmFibGVkU291cmNlQmxvY2tzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBibG9ja3MgPSB0aGlzLnByb2JsZW0uZW5hYmxlZEFuc3dlckJsb2NrcygpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGlmIChjaG9vc2VOZXh0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRGb2N1cyA9IGl0ZW07XG4gICAgICAgICAgICAgICAgaXRlbS5tYWtlVGFiSW5kZXgoKTtcbiAgICAgICAgICAgICAgICAkKGl0ZW0udmlldykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0udmlldy5pZCA9PSB0aGlzLnZpZXcuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hvb3NlTmV4dCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFRvZ2dsZSB3aGV0aGVyIHRvIG1vdmUgdGhpcyBibG9ja1xuICAgIHRvZ2dsZU1vdmUoKSB7XG4gICAgICAgIGlmICh0aGlzLnByb2JsZW0udGV4dE1vdmUpIHtcbiAgICAgICAgICAgICQodGhpcy52aWV3KS5yZW1vdmVDbGFzcyhcInVwXCIpO1xuICAgICAgICAgICAgJCh0aGlzLnZpZXcpLmFkZENsYXNzKFwiZG93blwiKTtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0TW92ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLmxvZ01vdmUoXCJrbW92ZVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQodGhpcy52aWV3KS5yZW1vdmVDbGFzcyhcImRvd25cIik7XG4gICAgICAgICAgICAkKHRoaXMudmlldykuYWRkQ2xhc3MoXCJ1cFwiKTtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0TW92ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQW5zd2VyIGEgc3RyaW5nIHRoYXQgcmVwcmVzZW50cyB0aGlzIGNvZGVibG9jayBmb3Igc2F2aW5nXG4gICAgaGFzaCgpIHtcbiAgICAgICAgdmFyIGhhc2ggPSBcIlwiO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGhhc2ggKz0gdGhpcy5saW5lc1tpXS5pbmRleCArIFwiX1wiO1xuICAgICAgICB9XG4gICAgICAgIGhhc2ggKz0gdGhpcy5pbmRlbnQ7XG4gICAgICAgIHJldHVybiBoYXNoO1xuICAgIH1cbiAgICAvLyBBbnN3ZXIgd2hhdCB0aGUgaW5kZW50IHNob3VsZCBiZSBmb3IgdGhlIHNvbHV0aW9uXG4gICAgc29sdXRpb25JbmRlbnQoKSB7XG4gICAgICAgIHZhciBzaGFyZWRJbmRlbnQgPSB0aGlzLmxpbmVzWzBdLmluZGVudDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzaGFyZWRJbmRlbnQgPSBNYXRoLm1pbihzaGFyZWRJbmRlbnQsIHRoaXMubGluZXNbaV0uaW5kZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2hhcmVkSW5kZW50O1xuICAgIH1cbn1cbiIsIi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PSBQYXJzb25zTGluZSBPYmplY3QgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09PSBUaGUgbW9kZWwgYW5kIHZpZXcgb2YgYSBsaW5lIG9mIGNvZGUuXG49PT09PT09PSBCYXNlZCBvbiB3aGF0IGlzIHNwZWNpZmllZCBpbiB0aGUgcHJvYmxlbS5cbj09PT09PT09IFBhcnNvbkJsb2NrIG9iamVjdHMgaGF2ZSBvbmUgb3IgbW9yZSBvZiB0aGVzZS5cbj09PT0gUFJPUEVSVElFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gcHJvYmxlbTogdGhlIFBhcnNvbnMgcHJvYmxlbVxuPT09PT09PT0gaW5kZXg6IHRoZSBpbmRleCBvZiB0aGUgbGluZSBpbiB0aGUgcHJvYmxlbVxuPT09PT09PT0gdGV4dDogdGhlIHRleHQgb2YgdGhlIGNvZGUgbGluZVxuPT09PT09PT0gaW5kZW50OiB0aGUgaW5kZW50IGxldmVsXG49PT09PT09PSB2aWV3OiBhbiBlbGVtZW50IGZvciB2aWV3aW5nIHRoaXMgb2JqZWN0XG49PT09PT09PSBkaXN0cmFjdG9yOiB3aGV0aGVyIGl0IGlzIGEgZGlzdHJhY3RvclxuPT09PT09PT0gcGFpcmVkOiB3aGV0aGVyIGl0IGlzIGEgcGFpcmVkIGRpc3RyYWN0b3Jcbj09PT09PT09IGdyb3VwV2l0aE5leHQ6IHdoZXRoZXIgaXQgaXMgZ3JvdXBlZCB3aXRoIHRoZSBmb2xsb3dpbmcgbGluZVxuPT09PT09PT0gd2lkdGg6IHRoZSBwaXhlbCB3aWR0aCB3aGVuIHJlbmRlcmVkXG49PT09PT09PT09PT0gaW4gdGhlIGluaXRpYWwgZ3JvdXBpbmdcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLy8gSW5pdGlhbGl6ZSBmcm9tIGNvZGVzdHJpbmdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyc29uc0xpbmUge1xuICAgIGNvbnN0cnVjdG9yKHByb2JsZW0sIGNvZGVzdHJpbmcsIGRpc3BsYXltYXRoKSB7XG4gICAgICAgIHRoaXMucHJvYmxlbSA9IHByb2JsZW07XG4gICAgICAgIHRoaXMuaW5kZXggPSBwcm9ibGVtLmxpbmVzLmxlbmd0aDtcbiAgICAgICAgdmFyIHRyaW1tZWQgPSBjb2Rlc3RyaW5nLnJlcGxhY2UoL1xccyokLywgXCJcIik7XG4gICAgICAgIHRoaXMudGV4dCA9IHRyaW1tZWQucmVwbGFjZSgvXlxccyovLCBcIlwiKTtcbiAgICAgICAgdGhpcy5pbmRlbnQgPSB0cmltbWVkLmxlbmd0aCAtIHRoaXMudGV4dC5sZW5ndGg7XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgVmlld1xuICAgICAgICB2YXIgdmlldztcbiAgICAgICAgLy8gVE9ETzogdGhpcyBkb2VzIG5vdCB3b3JrIHdpdGggZGlzcGxheSBtYXRoLi4uIFBlcmhhcHMgd2l0aCBwcmV0ZXh0IHdlIHNob3VsZCBoYXZlIGh0bWwgYXMgYSBsYW5ndWFnZSBhbmQgZG8gbm90aGluZz9cbiAgICAgICAgXG4gICAgICAgIGlmIChwcm9ibGVtLm9wdGlvbnMubGFuZ3VhZ2UgPT0gXCJuYXR1cmFsXCIgfHwgcHJvYmxlbS5vcHRpb25zLmxhbmd1YWdlID09IFwibWF0aFwiKSB7XG4gICAgICAgICAgICBpZiAoISBkaXNwbGF5bWF0aCkge1xuICAgICAgICAgICAgICAgIHZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNvZGVcIik7XG4gICAgICAgICAgICAkKHZpZXcpLmFkZENsYXNzKHByb2JsZW0ub3B0aW9ucy5wcmV0dGlmeUxhbmd1YWdlKTtcbiAgICAgICAgfVxuICAgICAgICB2aWV3LmlkID0gcHJvYmxlbS5jb3VudGVySWQgKyBcIi1saW5lLVwiICsgdGhpcy5pbmRleDtcbiAgICAgICAgdmlldy5pbm5lckhUTUwgKz0gdGhpcy50ZXh0O1xuICAgICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuICAgICAgICBwcm9ibGVtLmxpbmVzLnB1c2godGhpcyk7XG4gICAgfVxuICAgIC8vIEluaXRpYWxpemUgd2hhdCB3aWR0aCB0aGUgbGluZSB3b3VsZCBuYXR1cmFsbHkgaGF2ZSAod2l0aG91dCBpbmRlbnQpXG4gICAgaW5pdGlhbGl6ZVdpZHRoKCkge1xuICAgICAgICAvLyB0aGlzLndpZHRoIGRvZXMgbm90IGFwcGVhciB0byBiZSB1c2VkIGFueXdoZXJlIGxhdGVyXG4gICAgICAgIC8vIHNpbmNlIGNoYW5naW5nIHRoZSB2YWx1ZSBvZiB0aGlzLndpZHRoIGFwcGVhcnMgdG8gaGF2ZSBubyBlZmZlY3QuIC0gVmluY2VudCBRaXUgKFNlcHRlbWJlciAyMDIwKVxuICAgICAgICB0aGlzLndpZHRoID1cbiAgICAgICAgICAgICQodGhpcy52aWV3KS5vdXRlcldpZHRoKHRydWUpIC1cbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5vcHRpb25zLnBpeGVsc1BlckluZGVudCAqIHRoaXMuaW5kZW50O1xuXG4gICAgICAgIC8vIFBhc3MgdGhpcyBpbmZvcm1hdGlvbiBvbiB0byBiZSB1c2VkIGluIGNsYXNzIFBhcnNvbnMgZnVuY3Rpb24gaW5pdGlhbGl6ZUFyZWFzXG4gICAgICAgIC8vIHRvIG1hbnVhbGx5IGRldGVybWluZSBhcHByb3ByaWF0ZSB3aWR0aHMgLSBWaW5jZW50IFFpdSAoU2VwdGVtYmVyIDIwMjApXG4gICAgICAgIHRoaXMudmlldy5mb250U2l6ZSA9IHdpbmRvd1xuICAgICAgICAgICAgLmdldENvbXB1dGVkU3R5bGUodGhpcy52aWV3LCBudWxsKVxuICAgICAgICAgICAgLmdldFByb3BlcnR5VmFsdWUoXCJmb250LXNpemVcIik7XG4gICAgICAgIHRoaXMudmlldy5waXhlbHNQZXJJbmRlbnQgPSB0aGlzLnByb2JsZW0ub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQ7XG4gICAgICAgIHRoaXMudmlldy5pbmRlbnQgPSB0aGlzLmluZGVudDtcblxuICAgICAgICAvLyBGaWd1cmUgb3V0IHdoaWNoIHR5cGVmYWNlIHdpbGwgYmUgcmVuZGVyZWQgYnkgY29tcGFyaW5nIHRleHQgd2lkdGhzIHRvIGJyb3dzZXIgZGVmYXVsdCAtIFZpbmNlbnQgUWl1IChTZXB0ZW1iZXIgMjAyMClcbiAgICAgICAgdmFyIHRlbXBDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgICB2YXIgdGVtcENhbnZhc0N0eCA9IHRlbXBDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICB2YXIgcG9zc2libGVGb250cyA9IHdpbmRvd1xuICAgICAgICAgICAgLmdldENvbXB1dGVkU3R5bGUodGhpcy52aWV3LCBudWxsKVxuICAgICAgICAgICAgLmdldFByb3BlcnR5VmFsdWUoXCJmb250LWZhbWlseVwiKVxuICAgICAgICAgICAgLnNwbGl0KFwiLCBcIik7XG4gICAgICAgIHZhciBmaWxsZXJUZXh0ID0gXCJhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODksLi8hQCMkJV4mKi0rXCI7XG4gICAgICAgIHRlbXBDYW52YXNDdHguZm9udCA9IHRoaXMudmlldy5mb250U2l6ZSArIFwiIHNlcmlmXCI7XG4gICAgICAgIHZhciBzZXJpZldpZHRoID0gdGVtcENhbnZhc0N0eC5tZWFzdXJlVGV4dChmaWxsZXJUZXh0KS53aWR0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb3NzaWJsZUZvbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocG9zc2libGVGb250c1tpXS5pbmNsdWRlcygnXCInKSkge1xuICAgICAgICAgICAgICAgIHBvc3NpYmxlRm9udHNbaV0gPSBwb3NzaWJsZUZvbnRzW2ldLnJlcGxhY2VBbGwoJ1wiJywgXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zc2libGVGb250c1tpXS5pbmNsdWRlcyhcIidcIikpIHtcbiAgICAgICAgICAgICAgICBwb3NzaWJsZUZvbnRzW2ldID0gcG9zc2libGVGb250c1tpXS5yZXBsYWNlQWxsKFwiJ1wiLCBcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlbXBDYW52YXNDdHguZm9udCA9IHRoaXMudmlldy5mb250U2l6ZSArIFwiIFwiICsgcG9zc2libGVGb250c1tpXTtcbiAgICAgICAgICAgIGlmICh0ZW1wQ2FudmFzQ3R4Lm1lYXN1cmVUZXh0KGZpbGxlclRleHQpLndpZHRoICE9PSBzZXJpZldpZHRoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52aWV3LmZvbnRGYW1pbHkgPSBwb3NzaWJsZUZvbnRzW2ldO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEFuc3dlciB0aGUgYmxvY2sgdGhhdCB0aGlzIGxpbmUgaXMgY3VycmVudGx5IGluXG4gICAgYmxvY2soKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wcm9ibGVtLmJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGJsb2NrID0gdGhpcy5wcm9ibGVtLmJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYmxvY2subGluZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2subGluZXNbal0gPT09IHRoaXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJsb2NrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBBbnN3ZXIgdGhlIGluZGVudCBiYXNlZCBvbiB0aGUgdmlld1xuICAgIHZpZXdJbmRlbnQoKSB7XG4gICAgICAgIGlmICh0aGlzLnByb2JsZW0ubm9pbmRlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluZGVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBibG9jayA9IHRoaXMuYmxvY2soKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluZGVudCAtIGJsb2NrLnNvbHV0aW9uSW5kZW50KCkgKyBibG9jay5pbmRlbnQ7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJmdW5jdGlvbiBIKCkge1xuICAgIHZhciB4ID1cbiAgICAgICAgbmF2aWdhdG9yICYmXG4gICAgICAgIG5hdmlnYXRvci51c2VyQWdlbnQgJiZcbiAgICAgICAgL1xcYk1TSUUgNlxcLi8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICBIID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB4O1xuICAgIH07XG4gICAgcmV0dXJuIHg7XG59XG4oZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24geChiKSB7XG4gICAgICAgIGIgPSBiLnNwbGl0KC8gL2cpO1xuICAgICAgICB2YXIgYSA9IHt9O1xuICAgICAgICBmb3IgKHZhciBjID0gYi5sZW5ndGg7IC0tYyA+PSAwOyApIHtcbiAgICAgICAgICAgIHZhciBkID0gYltjXTtcbiAgICAgICAgICAgIGlmIChkKSBhW2RdID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG4gICAgdmFyIHkgPSBcImJyZWFrIGNvbnRpbnVlIGRvIGVsc2UgZm9yIGlmIHJldHVybiB3aGlsZSBcIixcbiAgICAgICAgVSA9XG4gICAgICAgICAgICB5ICtcbiAgICAgICAgICAgIFwiYXV0byBjYXNlIGNoYXIgY29uc3QgZGVmYXVsdCBkb3VibGUgZW51bSBleHRlcm4gZmxvYXQgZ290byBpbnQgbG9uZyByZWdpc3RlciBzaG9ydCBzaWduZWQgc2l6ZW9mIHN0YXRpYyBzdHJ1Y3Qgc3dpdGNoIHR5cGVkZWYgdW5pb24gdW5zaWduZWQgdm9pZCB2b2xhdGlsZSBcIixcbiAgICAgICAgRCA9XG4gICAgICAgICAgICBVICtcbiAgICAgICAgICAgIFwiY2F0Y2ggY2xhc3MgZGVsZXRlIGZhbHNlIGltcG9ydCBuZXcgb3BlcmF0b3IgcHJpdmF0ZSBwcm90ZWN0ZWQgcHVibGljIHRoaXMgdGhyb3cgdHJ1ZSB0cnkgXCIsXG4gICAgICAgIEkgPVxuICAgICAgICAgICAgRCArXG4gICAgICAgICAgICBcImFsaWdub2YgYWxpZ25fdW5pb24gYXNtIGF4aW9tIGJvb2wgY29uY2VwdCBjb25jZXB0X21hcCBjb25zdF9jYXN0IGNvbnN0ZXhwciBkZWNsdHlwZSBkeW5hbWljX2Nhc3QgZXhwbGljaXQgZXhwb3J0IGZyaWVuZCBpbmxpbmUgbGF0ZV9jaGVjayBtdXRhYmxlIG5hbWVzcGFjZSBudWxscHRyIHJlaW50ZXJwcmV0X2Nhc3Qgc3RhdGljX2Fzc2VydCBzdGF0aWNfY2FzdCB0ZW1wbGF0ZSB0eXBlaWQgdHlwZW5hbWUgdHlwZW9mIHVzaW5nIHZpcnR1YWwgd2NoYXJfdCB3aGVyZSBcIixcbiAgICAgICAgSiA9XG4gICAgICAgICAgICBEICtcbiAgICAgICAgICAgIFwiYm9vbGVhbiBieXRlIGV4dGVuZHMgZmluYWwgZmluYWxseSBpbXBsZW1lbnRzIGltcG9ydCBpbnN0YW5jZW9mIG51bGwgbmF0aXZlIHBhY2thZ2Ugc3RyaWN0ZnAgc3VwZXIgc3luY2hyb25pemVkIHRocm93cyB0cmFuc2llbnQgXCIsXG4gICAgICAgIFYgPVxuICAgICAgICAgICAgSiArXG4gICAgICAgICAgICBcImFzIGJhc2UgYnkgY2hlY2tlZCBkZWNpbWFsIGRlbGVnYXRlIGRlc2NlbmRpbmcgZXZlbnQgZml4ZWQgZm9yZWFjaCBmcm9tIGdyb3VwIGltcGxpY2l0IGluIGludGVyZmFjZSBpbnRlcm5hbCBpbnRvIGlzIGxvY2sgb2JqZWN0IG91dCBvdmVycmlkZSBvcmRlcmJ5IHBhcmFtcyByZWFkb25seSByZWYgc2J5dGUgc2VhbGVkIHN0YWNrYWxsb2Mgc3RyaW5nIHNlbGVjdCB1aW50IHVsb25nIHVuY2hlY2tlZCB1bnNhZmUgdXNob3J0IHZhciBcIixcbiAgICAgICAgSyA9XG4gICAgICAgICAgICBEICtcbiAgICAgICAgICAgIFwiZGVidWdnZXIgZXZhbCBleHBvcnQgZnVuY3Rpb24gZ2V0IG51bGwgc2V0IHVuZGVmaW5lZCB2YXIgd2l0aCBJbmZpbml0eSBOYU4gXCIsXG4gICAgICAgIEwgPVxuICAgICAgICAgICAgXCJjYWxsZXIgZGVsZXRlIGRpZSBkbyBkdW1wIGVsc2lmIGV2YWwgZXhpdCBmb3JlYWNoIGZvciBnb3RvIGlmIGltcG9ydCBsYXN0IGxvY2FsIG15IG5leHQgbm8gb3VyIHByaW50IHBhY2thZ2UgcmVkbyByZXF1aXJlIHN1YiB1bmRlZiB1bmxlc3MgdW50aWwgdXNlIHdhbnRhcnJheSB3aGlsZSBCRUdJTiBFTkQgXCIsXG4gICAgICAgIE0gPVxuICAgICAgICAgICAgeSArXG4gICAgICAgICAgICBcImFuZCBhcyBhc3NlcnQgY2xhc3MgZGVmIGRlbCBlbGlmIGV4Y2VwdCBleGVjIGZpbmFsbHkgZnJvbSBnbG9iYWwgaW1wb3J0IGluIGlzIGxhbWJkYSBub25sb2NhbCBub3Qgb3IgcGFzcyBwcmludCByYWlzZSB0cnkgd2l0aCB5aWVsZCBGYWxzZSBUcnVlIE5vbmUgXCIsXG4gICAgICAgIE4gPVxuICAgICAgICAgICAgeSArXG4gICAgICAgICAgICBcImFsaWFzIGFuZCBiZWdpbiBjYXNlIGNsYXNzIGRlZiBkZWZpbmVkIGVsc2lmIGVuZCBlbnN1cmUgZmFsc2UgaW4gbW9kdWxlIG5leHQgbmlsIG5vdCBvciByZWRvIHJlc2N1ZSByZXRyeSBzZWxmIHN1cGVyIHRoZW4gdHJ1ZSB1bmRlZiB1bmxlc3MgdW50aWwgd2hlbiB5aWVsZCBCRUdJTiBFTkQgXCIsXG4gICAgICAgIE8gPSB5ICsgXCJjYXNlIGRvbmUgZWxpZiBlc2FjIGV2YWwgZmkgZnVuY3Rpb24gaW4gbG9jYWwgc2V0IHRoZW4gdW50aWwgXCIsXG4gICAgICAgIFcgPSBJICsgViArIEsgKyBMICsgTSArIE4gKyBPO1xuICAgIGZ1bmN0aW9uIFgoYikge1xuICAgICAgICByZXR1cm4gKGIgPj0gXCJhXCIgJiYgYiA8PSBcInpcIikgfHwgKGIgPj0gXCJBXCIgJiYgYiA8PSBcIlpcIik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHUoYiwgYSwgYywgZCkge1xuICAgICAgICBiLnVuc2hpZnQoYywgZCB8fCAwKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGEuc3BsaWNlLmFwcGx5KGEsIGIpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgYi5zcGxpY2UoMCwgMik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIFkgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYiA9IFtcbiAgICAgICAgICAgICAgICAgICAgXCIhXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiIT1cIixcbiAgICAgICAgICAgICAgICAgICAgXCIhPT1cIixcbiAgICAgICAgICAgICAgICAgICAgXCIjXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiJVwiLFxuICAgICAgICAgICAgICAgICAgICBcIiU9XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiJlwiLFxuICAgICAgICAgICAgICAgICAgICBcIiYmXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiJiY9XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiJj1cIixcbiAgICAgICAgICAgICAgICAgICAgXCIoXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiKlwiLFxuICAgICAgICAgICAgICAgICAgICBcIio9XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiKz1cIixcbiAgICAgICAgICAgICAgICAgICAgXCIsXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiLT1cIixcbiAgICAgICAgICAgICAgICAgICAgXCItPlwiLFxuICAgICAgICAgICAgICAgICAgICBcIi9cIixcbiAgICAgICAgICAgICAgICAgICAgXCIvPVwiLFxuICAgICAgICAgICAgICAgICAgICBcIjpcIixcbiAgICAgICAgICAgICAgICAgICAgXCI6OlwiLFxuICAgICAgICAgICAgICAgICAgICBcIjtcIixcbiAgICAgICAgICAgICAgICAgICAgXCI8XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiPDxcIixcbiAgICAgICAgICAgICAgICAgICAgXCI8PD1cIixcbiAgICAgICAgICAgICAgICAgICAgXCI8PVwiLFxuICAgICAgICAgICAgICAgICAgICBcIj1cIixcbiAgICAgICAgICAgICAgICAgICAgXCI9PVwiLFxuICAgICAgICAgICAgICAgICAgICBcIj09PVwiLFxuICAgICAgICAgICAgICAgICAgICBcIj5cIixcbiAgICAgICAgICAgICAgICAgICAgXCI+PVwiLFxuICAgICAgICAgICAgICAgICAgICBcIj4+XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiPj49XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiPj4+XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiPj4+PVwiLFxuICAgICAgICAgICAgICAgICAgICBcIj9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJAXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiW1wiLFxuICAgICAgICAgICAgICAgICAgICBcIl5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJePVwiLFxuICAgICAgICAgICAgICAgICAgICBcIl5eXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiXl49XCIsXG4gICAgICAgICAgICAgICAgICAgIFwie1wiLFxuICAgICAgICAgICAgICAgICAgICBcInxcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ8PVwiLFxuICAgICAgICAgICAgICAgICAgICBcInx8XCIsXG4gICAgICAgICAgICAgICAgICAgIFwifHw9XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiflwiLFxuICAgICAgICAgICAgICAgICAgICBcImJyZWFrXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY2FzZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImNvbnRpbnVlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVsZXRlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZG9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJlbHNlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZmluYWxseVwiLFxuICAgICAgICAgICAgICAgICAgICBcImluc3RhbmNlb2ZcIixcbiAgICAgICAgICAgICAgICAgICAgXCJyZXR1cm5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0aHJvd1wiLFxuICAgICAgICAgICAgICAgICAgICBcInRyeVwiLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVvZlwiXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBhID1cbiAgICAgICAgICAgICAgICAgICAgXCIoPzooPzooPzpefFteMC05Ll0pXFxcXC57MSwzfSl8KD86KD86XnxbXlxcXFwrXSlcXFxcKyl8KD86KD86XnxbXlxcXFwtXSktKVwiO1xuICAgICAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBiLmxlbmd0aDsgKytjKSB7XG4gICAgICAgICAgICAgICAgdmFyIGQgPSBiW2NdO1xuICAgICAgICAgICAgICAgIGEgKz0gWChkLmNoYXJBdCgwKSlcbiAgICAgICAgICAgICAgICAgICAgPyBcInxcXFxcYlwiICsgZFxuICAgICAgICAgICAgICAgICAgICA6IFwifFwiICsgZC5yZXBsYWNlKC8oW149PD46Jl0pL2csIFwiXFxcXCQxXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYSArPSBcInxeKVxcXFxzKiRcIjtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKGEpO1xuICAgICAgICB9KSgpLFxuICAgICAgICBQID0gLyYvZyxcbiAgICAgICAgUSA9IC88L2csXG4gICAgICAgIFIgPSAvPi9nLFxuICAgICAgICBaID0gL1xcXCIvZztcbiAgICBmdW5jdGlvbiAkKGIpIHtcbiAgICAgICAgcmV0dXJuIGJcbiAgICAgICAgICAgIC5yZXBsYWNlKFAsIFwiJmFtcDtcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKFEsIFwiJmx0O1wiKVxuICAgICAgICAgICAgLnJlcGxhY2UoUiwgXCImZ3Q7XCIpXG4gICAgICAgICAgICAucmVwbGFjZShaLCBcIiZxdW90O1wiKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gRShiKSB7XG4gICAgICAgIHJldHVybiBiXG4gICAgICAgICAgICAucmVwbGFjZShQLCBcIiZhbXA7XCIpXG4gICAgICAgICAgICAucmVwbGFjZShRLCBcIiZsdDtcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKFIsIFwiJmd0O1wiKTtcbiAgICB9XG4gICAgdmFyIGFhID0gLyZsdDsvZyxcbiAgICAgICAgYmEgPSAvJmd0Oy9nLFxuICAgICAgICBjYSA9IC8mYXBvczsvZyxcbiAgICAgICAgZGEgPSAvJnF1b3Q7L2csXG4gICAgICAgIGVhID0gLyZhbXA7L2csXG4gICAgICAgIGZhID0gLyZuYnNwOy9nO1xuICAgIGZ1bmN0aW9uIGdhKGIpIHtcbiAgICAgICAgdmFyIGEgPSBiLmluZGV4T2YoXCImXCIpO1xuICAgICAgICBpZiAoYSA8IDApIHJldHVybiBiO1xuICAgICAgICBmb3IgKC0tYTsgKGEgPSBiLmluZGV4T2YoXCImI1wiLCBhICsgMSkpID49IDA7ICkge1xuICAgICAgICAgICAgdmFyIGMgPSBiLmluZGV4T2YoXCI7XCIsIGEpO1xuICAgICAgICAgICAgaWYgKGMgPj0gMCkge1xuICAgICAgICAgICAgICAgIHZhciBkID0gYi5zdWJzdHJpbmcoYSArIDMsIGMpLFxuICAgICAgICAgICAgICAgICAgICBnID0gMTA7XG4gICAgICAgICAgICAgICAgaWYgKGQgJiYgZC5jaGFyQXQoMCkgPT09IFwieFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGQgPSBkLnN1YnN0cmluZygxKTtcbiAgICAgICAgICAgICAgICAgICAgZyA9IDE2O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgZSA9IHBhcnNlSW50KGQsIGcpO1xuICAgICAgICAgICAgICAgIGlmICghaXNOYU4oZSkpXG4gICAgICAgICAgICAgICAgICAgIGIgPVxuICAgICAgICAgICAgICAgICAgICAgICAgYi5zdWJzdHJpbmcoMCwgYSkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nLmZyb21DaGFyQ29kZShlKSArXG4gICAgICAgICAgICAgICAgICAgICAgICBiLnN1YnN0cmluZyhjICsgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJcbiAgICAgICAgICAgIC5yZXBsYWNlKGFhLCBcIjxcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKGJhLCBcIj5cIilcbiAgICAgICAgICAgIC5yZXBsYWNlKGNhLCBcIidcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKGRhLCAnXCInKVxuICAgICAgICAgICAgLnJlcGxhY2UoZWEsIFwiJlwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoZmEsIFwiIFwiKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gUyhiKSB7XG4gICAgICAgIHJldHVybiBcIlhNUFwiID09PSBiLnRhZ05hbWU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHooYiwgYSkge1xuICAgICAgICBzd2l0Y2ggKGIubm9kZVR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICB2YXIgYyA9IGIudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIGEucHVzaChcIjxcIiwgYyk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBiLmF0dHJpYnV0ZXMubGVuZ3RoOyArK2QpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGcgPSBiLmF0dHJpYnV0ZXNbZF07XG4gICAgICAgICAgICAgICAgICAgIGlmICghZy5zcGVjaWZpZWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICBhLnB1c2goXCIgXCIpO1xuICAgICAgICAgICAgICAgICAgICB6KGcsIGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhLnB1c2goXCI+XCIpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGUgPSBiLmZpcnN0Q2hpbGQ7IGU7IGUgPSBlLm5leHRTaWJsaW5nKSB6KGUsIGEpO1xuICAgICAgICAgICAgICAgIGlmIChiLmZpcnN0Q2hpbGQgfHwgIS9eKD86YnJ8bGlua3xpbWcpJC8udGVzdChjKSlcbiAgICAgICAgICAgICAgICAgICAgYS5wdXNoKFwiPC9cIiwgYywgXCI+XCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGEucHVzaChiLm5hbWUudG9Mb3dlckNhc2UoKSwgJz1cIicsICQoYi52YWx1ZSksICdcIicpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIGEucHVzaChFKGIubm9kZVZhbHVlKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIEYgPSBudWxsO1xuICAgIGZ1bmN0aW9uIGhhKGIpIHtcbiAgICAgICAgaWYgKG51bGwgPT09IEYpIHtcbiAgICAgICAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIlBSRVwiKTtcbiAgICAgICAgICAgIGEuYXBwZW5kQ2hpbGQoXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXG4gICAgICAgICAgICAgICAgICAgICc8IURPQ1RZUEUgZm9vIFBVQkxJQyBcImZvbyBiYXJcIj5cXG48Zm9vIC8+J1xuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBGID0gIS88Ly50ZXN0KGEuaW5uZXJIVE1MKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoRikge1xuICAgICAgICAgICAgdmFyIGMgPSBiLmlubmVySFRNTDtcbiAgICAgICAgICAgIGlmIChTKGIpKSBjID0gRShjKTtcbiAgICAgICAgICAgIHJldHVybiBjO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkID0gW107XG4gICAgICAgIGZvciAodmFyIGcgPSBiLmZpcnN0Q2hpbGQ7IGc7IGcgPSBnLm5leHRTaWJsaW5nKSB6KGcsIGQpO1xuICAgICAgICByZXR1cm4gZC5qb2luKFwiXCIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpYShiKSB7XG4gICAgICAgIHZhciBhID0gMDtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgICAgIHZhciBkID0gbnVsbCxcbiAgICAgICAgICAgICAgICBnID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGUgPSAwLCBoID0gYy5sZW5ndGg7IGUgPCBoOyArK2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgZiA9IGMuY2hhckF0KGUpO1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoZikge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiXFx0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWQpIGQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQucHVzaChjLnN1YnN0cmluZyhnLCBlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaSA9IGIgLSAoYSAlIGIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYSArPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICg7IGkgPj0gMDsgaSAtPSBcIiAgICAgICAgICAgICAgICBcIi5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZC5wdXNoKFwiICAgICAgICAgICAgICAgIFwiLnN1YnN0cmluZygwLCBpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBnID0gZSArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlxcblwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICsrYTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWQpIHJldHVybiBjO1xuICAgICAgICAgICAgZC5wdXNoKGMuc3Vic3RyaW5nKGcpKTtcbiAgICAgICAgICAgIHJldHVybiBkLmpvaW4oXCJcIik7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHZhciBqYSA9IC8oPzpbXjxdK3w8IS0tW1xcc1xcU10qPy0tXFw+fDwhXFxbQ0RBVEFcXFsoW1xcc1xcU10qPylcXF1cXF0+fDxcXC8/W2EtekEtWl1bXj5dKj58PCkvZyxcbiAgICAgICAga2EgPSAvXjwhLS0vLFxuICAgICAgICBsYSA9IC9ePFxcW0NEQVRBXFxbLyxcbiAgICAgICAgbWEgPSAvXjxiclxcYi9pO1xuICAgIGZ1bmN0aW9uIG5hKGIpIHtcbiAgICAgICAgdmFyIGEgPSBiLm1hdGNoKGphKSxcbiAgICAgICAgICAgIGMgPSBbXSxcbiAgICAgICAgICAgIGQgPSAwLFxuICAgICAgICAgICAgZyA9IFtdO1xuICAgICAgICBpZiAoYSlcbiAgICAgICAgICAgIGZvciAodmFyIGUgPSAwLCBoID0gYS5sZW5ndGg7IGUgPCBoOyArK2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgZiA9IGFbZV07XG4gICAgICAgICAgICAgICAgaWYgKGYubGVuZ3RoID4gMSAmJiBmLmNoYXJBdCgwKSA9PT0gXCI8XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGthLnRlc3QoZikpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGEudGVzdChmKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYy5wdXNoKGYuc3Vic3RyaW5nKDksIGYubGVuZ3RoIC0gMykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZCArPSBmLmxlbmd0aCAtIDEyO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1hLnRlc3QoZikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMucHVzaChcIlxcblwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICsrZDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGcucHVzaChkLCBmKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaSA9IGdhKGYpO1xuICAgICAgICAgICAgICAgICAgICBjLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgICAgIGQgKz0gaS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc291cmNlOiBjLmpvaW4oXCJcIiksXG4gICAgICAgICAgICB0YWdzOiBnXG4gICAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIHYoYiwgYSkge1xuICAgICAgICB2YXIgYyA9IHt9O1xuICAgICAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZyA9IGIuY29uY2F0KGEpO1xuICAgICAgICAgICAgZm9yICh2YXIgZSA9IGcubGVuZ3RoOyAtLWUgPj0gMDsgKSB7XG4gICAgICAgICAgICAgICAgdmFyIGggPSBnW2VdLFxuICAgICAgICAgICAgICAgICAgICBmID0gaFszXTtcbiAgICAgICAgICAgICAgICBpZiAoZikgZm9yICh2YXIgaSA9IGYubGVuZ3RoOyAtLWkgPj0gMDsgKSBjW2YuY2hhckF0KGkpXSA9IGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHZhciBkID0gYS5sZW5ndGg7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihnLCBlKSB7XG4gICAgICAgICAgICBlID0gZSB8fCAwO1xuICAgICAgICAgICAgdmFyIGggPSBbZSwgXCJwbG5cIl0sXG4gICAgICAgICAgICAgICAgZiA9IFwiXCIsXG4gICAgICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICAgICAgaiA9IGc7XG4gICAgICAgICAgICB3aGlsZSAoai5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgbyxcbiAgICAgICAgICAgICAgICAgICAgbSA9IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGssXG4gICAgICAgICAgICAgICAgICAgIGwgPSBjW2ouY2hhckF0KDApXTtcbiAgICAgICAgICAgICAgICBpZiAobCkge1xuICAgICAgICAgICAgICAgICAgICBrID0gai5tYXRjaChsWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgbSA9IGtbMF07XG4gICAgICAgICAgICAgICAgICAgIG8gPSBsWzBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIG4gPSAwOyBuIDwgZDsgKytuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsID0gYVtuXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwID0gbFsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwICYmICFwLnRlc3QoZikpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgayA9IGoubWF0Y2gobFsxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0gPSBrWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8gPSBsWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbyA9IFwicGxuXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBtID0gai5zdWJzdHJpbmcoMCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaC5wdXNoKGUgKyBpLCBvKTtcbiAgICAgICAgICAgICAgICBpICs9IG0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGogPSBqLnN1YnN0cmluZyhtLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgaWYgKG8gIT09IFwiY29tXCIgJiYgL1xcUy8udGVzdChtKSkgZiA9IG07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaDtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgdmFyIG9hID0gdihcbiAgICAgICAgW10sXG4gICAgICAgIFtcbiAgICAgICAgICAgIFtcInBsblwiLCAvXltePF0rLywgbnVsbF0sXG4gICAgICAgICAgICBbXCJkZWNcIiwgL148IVxcd1tePl0qKD86PnwkKS8sIG51bGxdLFxuICAgICAgICAgICAgW1wiY29tXCIsIC9ePCEtLVtcXHNcXFNdKj8oPzotLVxcPnwkKS8sIG51bGxdLFxuICAgICAgICAgICAgW1wic3JjXCIsIC9ePFxcP1tcXHNcXFNdKj8oPzpcXD8+fCQpLywgbnVsbF0sXG4gICAgICAgICAgICBbXCJzcmNcIiwgL148JVtcXHNcXFNdKj8oPzolPnwkKS8sIG51bGxdLFxuICAgICAgICAgICAgW1wic3JjXCIsIC9ePChzY3JpcHR8c3R5bGV8eG1wKVxcYltePl0qPltcXHNcXFNdKj88XFwvXFwxXFxiW14+XSo+L2ksIG51bGxdLFxuICAgICAgICAgICAgW1widGFnXCIsIC9ePFxcLz9cXHdbXjw+XSo+LywgbnVsbF1cbiAgICAgICAgXVxuICAgICk7XG4gICAgZnVuY3Rpb24gcGEoYikge1xuICAgICAgICB2YXIgYSA9IG9hKGIpO1xuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGEubGVuZ3RoOyBjICs9IDIpXG4gICAgICAgICAgICBpZiAoYVtjICsgMV0gPT09IFwic3JjXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgZCwgZztcbiAgICAgICAgICAgICAgICBkID0gYVtjXTtcbiAgICAgICAgICAgICAgICBnID0gYyArIDIgPCBhLmxlbmd0aCA/IGFbYyArIDJdIDogYi5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdmFyIGUgPSBiLnN1YnN0cmluZyhkLCBnKSxcbiAgICAgICAgICAgICAgICAgICAgaCA9IGUubWF0Y2goL14oPFtePl0qPikoW1xcc1xcU10qKSg8XFwvW14+XSo+KSQvKTtcbiAgICAgICAgICAgICAgICBpZiAoaClcbiAgICAgICAgICAgICAgICAgICAgYS5zcGxpY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICBjLFxuICAgICAgICAgICAgICAgICAgICAgICAgMixcbiAgICAgICAgICAgICAgICAgICAgICAgIGQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRhZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZCArIGhbMV0ubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzcmNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgKyBoWzFdLmxlbmd0aCArIChoWzJdIHx8IFwiXCIpLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGFnXCJcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuICAgIHZhciBxYSA9IHYoXG4gICAgICAgIFtcbiAgICAgICAgICAgIFtcImF0dlwiLCAvXlxcJ1teXFwnXSooPzpcXCd8JCkvLCBudWxsLCBcIidcIl0sXG4gICAgICAgICAgICBbXCJhdHZcIiwgL15cXFwiW15cXFwiXSooPzpcXFwifCQpLywgbnVsbCwgJ1wiJ10sXG4gICAgICAgICAgICBbXCJwdW5cIiwgL15bPD5cXC89XSsvLCBudWxsLCBcIjw+Lz1cIl1cbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgICAgW1widGFnXCIsIC9eW1xcdzpcXC1dKy8sIC9ePC9dLFxuICAgICAgICAgICAgW1wiYXR2XCIsIC9eW1xcd1xcLV0rLywgL149L10sXG4gICAgICAgICAgICBbXCJhdG5cIiwgL15bXFx3OlxcLV0rLywgbnVsbF0sXG4gICAgICAgICAgICBbXCJwbG5cIiwgL15cXHMrLywgbnVsbCwgXCIgXFx0XFxyXFxuXCJdXG4gICAgICAgIF1cbiAgICApO1xuICAgIGZ1bmN0aW9uIHJhKGIsIGEpIHtcbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBhLmxlbmd0aDsgYyArPSAyKSB7XG4gICAgICAgICAgICB2YXIgZCA9IGFbYyArIDFdO1xuICAgICAgICAgICAgaWYgKGQgPT09IFwidGFnXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgZywgZTtcbiAgICAgICAgICAgICAgICBnID0gYVtjXTtcbiAgICAgICAgICAgICAgICBlID0gYyArIDIgPCBhLmxlbmd0aCA/IGFbYyArIDJdIDogYi5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdmFyIGggPSBiLnN1YnN0cmluZyhnLCBlKSxcbiAgICAgICAgICAgICAgICAgICAgZiA9IHFhKGgsIGcpO1xuICAgICAgICAgICAgICAgIHUoZiwgYSwgYywgMik7XG4gICAgICAgICAgICAgICAgYyArPSBmLmxlbmd0aCAtIDI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHIoYikge1xuICAgICAgICB2YXIgYSA9IFtdLFxuICAgICAgICAgICAgYyA9IFtdO1xuICAgICAgICBpZiAoYi50cmlwbGVRdW90ZWRTdHJpbmdzKVxuICAgICAgICAgICAgYS5wdXNoKFtcbiAgICAgICAgICAgICAgICBcInN0clwiLFxuICAgICAgICAgICAgICAgIC9eKD86XFwnXFwnXFwnKD86W15cXCdcXFxcXXxcXFxcW1xcc1xcU118XFwnezEsMn0oPz1bXlxcJ10pKSooPzpcXCdcXCdcXCd8JCl8XFxcIlxcXCJcXFwiKD86W15cXFwiXFxcXF18XFxcXFtcXHNcXFNdfFxcXCJ7MSwyfSg/PVteXFxcIl0pKSooPzpcXFwiXFxcIlxcXCJ8JCl8XFwnKD86W15cXFxcXFwnXXxcXFxcW1xcc1xcU10pKig/OlxcJ3wkKXxcXFwiKD86W15cXFxcXFxcIl18XFxcXFtcXHNcXFNdKSooPzpcXFwifCQpKS8sXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICBcIidcXFwiXCJcbiAgICAgICAgICAgIF0pO1xuICAgICAgICBlbHNlIGlmIChiLm11bHRpTGluZVN0cmluZ3MpXG4gICAgICAgICAgICBhLnB1c2goW1xuICAgICAgICAgICAgICAgIFwic3RyXCIsXG4gICAgICAgICAgICAgICAgL14oPzpcXCcoPzpbXlxcXFxcXCddfFxcXFxbXFxzXFxTXSkqKD86XFwnfCQpfFxcXCIoPzpbXlxcXFxcXFwiXXxcXFxcW1xcc1xcU10pKig/OlxcXCJ8JCl8XFxgKD86W15cXFxcXFxgXXxcXFxcW1xcc1xcU10pKig/OlxcYHwkKSkvLFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgXCInXFxcImBcIlxuICAgICAgICAgICAgXSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGEucHVzaChbXG4gICAgICAgICAgICAgICAgXCJzdHJcIixcbiAgICAgICAgICAgICAgICAvXig/OlxcJyg/OlteXFxcXFxcJ1xcclxcbl18XFxcXC4pKig/OlxcJ3wkKXxcXFwiKD86W15cXFxcXFxcIlxcclxcbl18XFxcXC4pKig/OlxcXCJ8JCkpLyxcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgIFwiXFxcIidcIlxuICAgICAgICAgICAgXSk7XG4gICAgICAgIGMucHVzaChbXCJwbG5cIiwgL14oPzpbXlxcJ1xcXCJcXGBcXC9cXCNdKykvLCBudWxsLCBcIiBcXHJcXG5cIl0pO1xuICAgICAgICBpZiAoYi5oYXNoQ29tbWVudHMpIGEucHVzaChbXCJjb21cIiwgL14jW15cXHJcXG5dKi8sIG51bGwsIFwiI1wiXSk7XG4gICAgICAgIGlmIChiLmNTdHlsZUNvbW1lbnRzKSBjLnB1c2goW1wiY29tXCIsIC9eXFwvXFwvW15cXHJcXG5dKi8sIG51bGxdKTtcbiAgICAgICAgaWYgKGIucmVnZXhMaXRlcmFscylcbiAgICAgICAgICAgIGMucHVzaChbXG4gICAgICAgICAgICAgICAgXCJzdHJcIixcbiAgICAgICAgICAgICAgICAvXlxcLyg/OlteXFxcXFxcKlxcL1xcW118XFxcXFtcXHNcXFNdfFxcWyg/OlteXFxdXFxcXF18XFxcXC4pKig/OlxcXXwkKSkrKD86XFwvfCQpLyxcbiAgICAgICAgICAgICAgICBZXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgaWYgKGIuY1N0eWxlQ29tbWVudHMpIGMucHVzaChbXCJjb21cIiwgL15cXC9cXCpbXFxzXFxTXSo/KD86XFwqXFwvfCQpLywgbnVsbF0pO1xuICAgICAgICB2YXIgZCA9IHgoYi5rZXl3b3Jkcyk7XG4gICAgICAgIGIgPSBudWxsO1xuICAgICAgICB2YXIgZyA9IHYoYSwgYyksXG4gICAgICAgICAgICBlID0gdihcbiAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIFtcInBsblwiLCAvXlxccysvLCBudWxsLCBcIiBcXHJcXG5cIl0sXG4gICAgICAgICAgICAgICAgICAgIFtcInBsblwiLCAvXlthLXpfJEBdW2Etel8kQDAtOV0qL2ksIG51bGxdLFxuICAgICAgICAgICAgICAgICAgICBbXCJsaXRcIiwgL14weFthLWYwLTldK1thLXpdL2ksIG51bGxdLFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxpdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgL14oPzpcXGQoPzpfXFxkKykqXFxkKig/OlxcLlxcZCopP3xcXC5cXGQrKSg/OmVbK1xcLV0/XFxkKyk/W2Etel0qL2ksXG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIxMjM0NTY3ODlcIlxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBbXCJwdW5cIiwgL15bXlxcc1xcd1xcLiRAXSsvLCBudWxsXVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICk7XG4gICAgICAgIGZ1bmN0aW9uIGgoZiwgaSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBpLmxlbmd0aDsgaiArPSAyKSB7XG4gICAgICAgICAgICAgICAgdmFyIG8gPSBpW2ogKyAxXTtcbiAgICAgICAgICAgICAgICBpZiAobyA9PT0gXCJwbG5cIikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbSwgaywgbCwgbjtcbiAgICAgICAgICAgICAgICAgICAgbSA9IGlbal07XG4gICAgICAgICAgICAgICAgICAgIGsgPSBqICsgMiA8IGkubGVuZ3RoID8gaVtqICsgMl0gOiBmLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgbCA9IGYuc3Vic3RyaW5nKG0sIGspO1xuICAgICAgICAgICAgICAgICAgICBuID0gZShsLCBtKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcCA9IDAsIHQgPSBuLmxlbmd0aDsgcCA8IHQ7IHAgKz0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHcgPSBuW3AgKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3ID09PSBcInBsblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIEEgPSBuW3BdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBCID0gcCArIDIgPCB0ID8gbltwICsgMl0gOiBsLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcyA9IGYuc3Vic3RyaW5nKEEsIEIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzID09PSBcIi5cIikgbltwICsgMV0gPSBcInB1blwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHMgaW4gZCkgbltwICsgMV0gPSBcImt3ZFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKC9eQD9bQS1aXVtBLVokXSpbYS16XVtBLVphLXokXSokLy50ZXN0KHMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuW3AgKyAxXSA9IHMuY2hhckF0KDApID09PSBcIkBcIiA/IFwibGl0XCIgOiBcInR5cFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHUobiwgaSwgaiwgMik7XG4gICAgICAgICAgICAgICAgICAgIGogKz0gbi5sZW5ndGggLSAyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihmKSB7XG4gICAgICAgICAgICB2YXIgaSA9IGcoZik7XG4gICAgICAgICAgICBpID0gaChmLCBpKTtcbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICB2YXIgRyA9IHIoe1xuICAgICAgICBrZXl3b3JkczogVyxcbiAgICAgICAgaGFzaENvbW1lbnRzOiB0cnVlLFxuICAgICAgICBjU3R5bGVDb21tZW50czogdHJ1ZSxcbiAgICAgICAgbXVsdGlMaW5lU3RyaW5nczogdHJ1ZSxcbiAgICAgICAgcmVnZXhMaXRlcmFsczogdHJ1ZVxuICAgIH0pO1xuICAgIGZ1bmN0aW9uIHNhKGIsIGEpIHtcbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBhLmxlbmd0aDsgYyArPSAyKSB7XG4gICAgICAgICAgICB2YXIgZCA9IGFbYyArIDFdO1xuICAgICAgICAgICAgaWYgKGQgPT09IFwic3JjXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgZywgZTtcbiAgICAgICAgICAgICAgICBnID0gYVtjXTtcbiAgICAgICAgICAgICAgICBlID0gYyArIDIgPCBhLmxlbmd0aCA/IGFbYyArIDJdIDogYi5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdmFyIGggPSBHKGIuc3Vic3RyaW5nKGcsIGUpKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBmID0gMCwgaSA9IGgubGVuZ3RoOyBmIDwgaTsgZiArPSAyKSBoW2ZdICs9IGc7XG4gICAgICAgICAgICAgICAgdShoLCBhLCBjLCAyKTtcbiAgICAgICAgICAgICAgICBjICs9IGgubGVuZ3RoIC0gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdGEoYiwgYSkge1xuICAgICAgICB2YXIgYyA9IGZhbHNlO1xuICAgICAgICBmb3IgKHZhciBkID0gMDsgZCA8IGEubGVuZ3RoOyBkICs9IDIpIHtcbiAgICAgICAgICAgIHZhciBnID0gYVtkICsgMV0sXG4gICAgICAgICAgICAgICAgZSxcbiAgICAgICAgICAgICAgICBoO1xuICAgICAgICAgICAgaWYgKGcgPT09IFwiYXRuXCIpIHtcbiAgICAgICAgICAgICAgICBlID0gYVtkXTtcbiAgICAgICAgICAgICAgICBoID0gZCArIDIgPCBhLmxlbmd0aCA/IGFbZCArIDJdIDogYi5sZW5ndGg7XG4gICAgICAgICAgICAgICAgYyA9IC9eb258XnN0eWxlJC9pLnRlc3QoYi5zdWJzdHJpbmcoZSwgaCkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChnID09PSBcImF0dlwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGMpIHtcbiAgICAgICAgICAgICAgICAgICAgZSA9IGFbZF07XG4gICAgICAgICAgICAgICAgICAgIGggPSBkICsgMiA8IGEubGVuZ3RoID8gYVtkICsgMl0gOiBiLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGYgPSBiLnN1YnN0cmluZyhlLCBoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBmLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGogPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgPj0gMiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC9eW1xcXCJcXCddLy50ZXN0KGYpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZi5jaGFyQXQoMCkgPT09IGYuY2hhckF0KGkgLSAxKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG8sXG4gICAgICAgICAgICAgICAgICAgICAgICBtLFxuICAgICAgICAgICAgICAgICAgICAgICAgaztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGopIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG0gPSBlICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSBoIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG8gPSBmO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbSA9IGUgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgayA9IGggLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgbyA9IGYuc3Vic3RyaW5nKDEsIGYubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIGwgPSBHKG8pO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBuID0gMCwgcCA9IGwubGVuZ3RoOyBuIDwgcDsgbiArPSAyKSBsW25dICs9IG07XG4gICAgICAgICAgICAgICAgICAgIGlmIChqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsLnB1c2goaywgXCJhdHZcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB1KGwsIGEsIGQgKyAyLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHUobCwgYSwgZCwgMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGMgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdWEoYikge1xuICAgICAgICB2YXIgYSA9IHBhKGIpO1xuICAgICAgICBhID0gcmEoYiwgYSk7XG4gICAgICAgIGEgPSBzYShiLCBhKTtcbiAgICAgICAgYSA9IHRhKGIsIGEpO1xuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdmEoYiwgYSwgYykge1xuICAgICAgICB2YXIgZCA9IFtdLFxuICAgICAgICAgICAgZyA9IDAsXG4gICAgICAgICAgICBlID0gbnVsbCxcbiAgICAgICAgICAgIGggPSBudWxsLFxuICAgICAgICAgICAgZiA9IDAsXG4gICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgIGogPSBpYSg4KTtcbiAgICAgICAgZnVuY3Rpb24gbyhrKSB7XG4gICAgICAgICAgICBpZiAoayA+IGcpIHtcbiAgICAgICAgICAgICAgICBpZiAoZSAmJiBlICE9PSBoKSB7XG4gICAgICAgICAgICAgICAgICAgIGQucHVzaChcIjwvc3Bhbj5cIik7XG4gICAgICAgICAgICAgICAgICAgIGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWUgJiYgaCkge1xuICAgICAgICAgICAgICAgICAgICBlID0gaDtcbiAgICAgICAgICAgICAgICAgICAgZC5wdXNoKCc8c3BhbiBjbGFzcz1cIicsIGUsICdcIj4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGwgPSBFKGooYi5zdWJzdHJpbmcoZywgaykpKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKFxcclxcbj98XFxufCApIC9nLCBcIiQxJm5ic3A7XCIpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHJcXG4/fFxcbi9nLCBcIjxiciAvPlwiKTtcbiAgICAgICAgICAgICAgICBkLnB1c2gobCk7XG4gICAgICAgICAgICAgICAgZyA9IGs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIHZhciBtO1xuICAgICAgICAgICAgbSA9IGYgPCBhLmxlbmd0aCA/IChpIDwgYy5sZW5ndGggPyBhW2ZdIDw9IGNbaV0gOiB0cnVlKSA6IGZhbHNlO1xuICAgICAgICAgICAgaWYgKG0pIHtcbiAgICAgICAgICAgICAgICBvKGFbZl0pO1xuICAgICAgICAgICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGQucHVzaChcIjwvc3Bhbj5cIik7XG4gICAgICAgICAgICAgICAgICAgIGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkLnB1c2goYVtmICsgMV0pO1xuICAgICAgICAgICAgICAgIGYgKz0gMjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA8IGMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbyhjW2ldKTtcbiAgICAgICAgICAgICAgICBoID0gY1tpICsgMV07XG4gICAgICAgICAgICAgICAgaSArPSAyO1xuICAgICAgICAgICAgfSBlbHNlIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG8oYi5sZW5ndGgpO1xuICAgICAgICBpZiAoZSkgZC5wdXNoKFwiPC9zcGFuPlwiKTtcbiAgICAgICAgcmV0dXJuIGQuam9pbihcIlwiKTtcbiAgICB9XG4gICAgdmFyIEMgPSB7fTtcbiAgICBmdW5jdGlvbiBxKGIsIGEpIHtcbiAgICAgICAgZm9yICh2YXIgYyA9IGEubGVuZ3RoOyAtLWMgPj0gMDsgKSB7XG4gICAgICAgICAgICB2YXIgZCA9IGFbY107XG4gICAgICAgICAgICBpZiAoIUMuaGFzT3duUHJvcGVydHkoZCkpIENbZF0gPSBiO1xuICAgICAgICAgICAgZWxzZSBpZiAoXCJjb25zb2xlXCIgaW4gd2luZG93KVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2Fubm90IG92ZXJyaWRlIGxhbmd1YWdlIGhhbmRsZXIgJXNcIiwgZCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcShHLCBbXCJkZWZhdWx0LWNvZGVcIl0pO1xuICAgIHEodWEsIFtcImRlZmF1bHQtbWFya3VwXCIsIFwiaHRtbFwiLCBcImh0bVwiLCBcInhodG1sXCIsIFwieG1sXCIsIFwieHNsXCJdKTtcbiAgICBxKFxuICAgICAgICByKHtcbiAgICAgICAgICAgIGtleXdvcmRzOiBJLFxuICAgICAgICAgICAgaGFzaENvbW1lbnRzOiB0cnVlLFxuICAgICAgICAgICAgY1N0eWxlQ29tbWVudHM6IHRydWVcbiAgICAgICAgfSksXG4gICAgICAgIFtcImNcIiwgXCJjY1wiLCBcImNwcFwiLCBcImNzXCIsIFwiY3h4XCIsIFwiY3ljXCJdXG4gICAgKTtcbiAgICBxKFxuICAgICAgICByKHtcbiAgICAgICAgICAgIGtleXdvcmRzOiBKLFxuICAgICAgICAgICAgY1N0eWxlQ29tbWVudHM6IHRydWVcbiAgICAgICAgfSksXG4gICAgICAgIFtcImphdmFcIl1cbiAgICApO1xuICAgIHEoXG4gICAgICAgIHIoe1xuICAgICAgICAgICAga2V5d29yZHM6IE8sXG4gICAgICAgICAgICBoYXNoQ29tbWVudHM6IHRydWUsXG4gICAgICAgICAgICBtdWx0aUxpbmVTdHJpbmdzOiB0cnVlXG4gICAgICAgIH0pLFxuICAgICAgICBbXCJic2hcIiwgXCJjc2hcIiwgXCJzaFwiXVxuICAgICk7XG4gICAgcShcbiAgICAgICAgcih7XG4gICAgICAgICAgICBrZXl3b3JkczogTSxcbiAgICAgICAgICAgIGhhc2hDb21tZW50czogdHJ1ZSxcbiAgICAgICAgICAgIG11bHRpTGluZVN0cmluZ3M6IHRydWUsXG4gICAgICAgICAgICB0cmlwbGVRdW90ZWRTdHJpbmdzOiB0cnVlXG4gICAgICAgIH0pLFxuICAgICAgICBbXCJjdlwiLCBcInB5XCJdXG4gICAgKTtcbiAgICBxKFxuICAgICAgICByKHtcbiAgICAgICAgICAgIGtleXdvcmRzOiBMLFxuICAgICAgICAgICAgaGFzaENvbW1lbnRzOiB0cnVlLFxuICAgICAgICAgICAgbXVsdGlMaW5lU3RyaW5nczogdHJ1ZSxcbiAgICAgICAgICAgIHJlZ2V4TGl0ZXJhbHM6IHRydWVcbiAgICAgICAgfSksXG4gICAgICAgIFtcInBlcmxcIiwgXCJwbFwiLCBcInBtXCJdXG4gICAgKTtcbiAgICBxKFxuICAgICAgICByKHtcbiAgICAgICAgICAgIGtleXdvcmRzOiBOLFxuICAgICAgICAgICAgaGFzaENvbW1lbnRzOiB0cnVlLFxuICAgICAgICAgICAgbXVsdGlMaW5lU3RyaW5nczogdHJ1ZSxcbiAgICAgICAgICAgIHJlZ2V4TGl0ZXJhbHM6IHRydWVcbiAgICAgICAgfSksXG4gICAgICAgIFtcInJiXCJdXG4gICAgKTtcbiAgICBxKFxuICAgICAgICByKHtcbiAgICAgICAgICAgIGtleXdvcmRzOiBLLFxuICAgICAgICAgICAgY1N0eWxlQ29tbWVudHM6IHRydWUsXG4gICAgICAgICAgICByZWdleExpdGVyYWxzOiB0cnVlXG4gICAgICAgIH0pLFxuICAgICAgICBbXCJqc1wiXVxuICAgICk7XG4gICAgZnVuY3Rpb24gVChiLCBhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgYyA9IG5hKGIpLFxuICAgICAgICAgICAgICAgIGQgPSBjLnNvdXJjZSxcbiAgICAgICAgICAgICAgICBnID0gYy50YWdzO1xuICAgICAgICAgICAgaWYgKCFDLmhhc093blByb3BlcnR5KGEpKVxuICAgICAgICAgICAgICAgIGEgPSAvXlxccyo8Ly50ZXN0KGQpID8gXCJkZWZhdWx0LW1hcmt1cFwiIDogXCJkZWZhdWx0LWNvZGVcIjtcbiAgICAgICAgICAgIHZhciBlID0gQ1thXS5jYWxsKHt9LCBkKTtcbiAgICAgICAgICAgIHJldHVybiB2YShkLCBnLCBlKTtcbiAgICAgICAgfSBjYXRjaCAoaCkge1xuICAgICAgICAgICAgaWYgKFwiY29uc29sZVwiIGluIHdpbmRvdykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBiO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHdhKGIpIHtcbiAgICAgICAgdmFyIGEgPSBIKCksXG4gICAgICAgICAgICBjID0gW1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwicHJlXCIpLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiY29kZVwiKSxcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImxpXCIpLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwieG1wXCIpXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgZCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBnID0gMDsgZyA8IGMubGVuZ3RoOyArK2cpXG4gICAgICAgICAgICBmb3IgKHZhciBlID0gMDsgZSA8IGNbZ10ubGVuZ3RoOyArK2UpIGQucHVzaChjW2ddW2VdKTtcbiAgICAgICAgYyA9IG51bGw7XG4gICAgICAgIHZhciBoID0gMDtcbiAgICAgICAgZnVuY3Rpb24gZigpIHtcbiAgICAgICAgICAgIHZhciBpID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgKyAyNTA7XG4gICAgICAgICAgICBmb3IgKDsgaCA8IGQubGVuZ3RoICYmIG5ldyBEYXRlKCkuZ2V0VGltZSgpIDwgaTsgaCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGogPSBkW2hdO1xuICAgICAgICAgICAgICAgIGlmIChqLmNsYXNzTmFtZSAmJiBqLmNsYXNzTmFtZS5pbmRleE9mKFwicHJldHR5cHJpbnRcIikgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IGouY2xhc3NOYW1lLm1hdGNoKC9cXGJsYW5nLShcXHcrKVxcYi8pO1xuICAgICAgICAgICAgICAgICAgICBpZiAobykgbyA9IG9bMV07XG4gICAgICAgICAgICAgICAgICAgIHZhciBtID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGsgPSBqLnBhcmVudE5vZGU7IGs7IGsgPSBrLnBhcmVudE5vZGUpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGsudGFnTmFtZSA9PT0gXCJwcmVcIiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrLnRhZ05hbWUgPT09IFwiY29kZVwiIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGsudGFnTmFtZSA9PT0gXCJ4bXBcIikgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrLmNsYXNzTmFtZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGsuY2xhc3NOYW1lLmluZGV4T2YoXCJwcmV0dHlwcmludFwiKSA+PSAwXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbCA9IGhhKGopO1xuICAgICAgICAgICAgICAgICAgICAgICAgbCA9IGwucmVwbGFjZSgvKD86XFxyXFxuP3xcXG4pJC8sIFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG4gPSBUKGwsIG8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFTKGopKSBqLmlubmVySFRNTCA9IG47XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJQUkVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgdCA9IDA7IHQgPCBqLmF0dHJpYnV0ZXMubGVuZ3RoOyArK3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHcgPSBqLmF0dHJpYnV0ZXNbdF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3LnNwZWNpZmllZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHAuc2V0QXR0cmlidXRlKHcubmFtZSwgdy52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHAuaW5uZXJIVE1MID0gbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHAsIGopO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHAgPSBqO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGEgJiYgai50YWdOYW1lID09PSBcIlBSRVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIEEgPSBqLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYnJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgQiA9IEEubGVuZ3RoOyAtLUIgPj0gMDsgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzID0gQVtCXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcy5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXFxyXFxuXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoIDwgZC5sZW5ndGgpIHNldFRpbWVvdXQoZiwgMjUwKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGIpIGIoKTtcbiAgICAgICAgfVxuICAgICAgICBmKCk7XG4gICAgfVxuICAgIHdpbmRvdy5QUl9ub3JtYWxpemVkSHRtbCA9IHo7XG4gICAgd2luZG93LnByZXR0eVByaW50T25lID0gVDtcbiAgICB3aW5kb3cucHJldHR5UHJpbnQgPSB3YTtcbiAgICB3aW5kb3cuUFIgPSB7XG4gICAgICAgIGNyZWF0ZVNpbXBsZUxleGVyOiB2LFxuICAgICAgICByZWdpc3RlckxhbmdIYW5kbGVyOiBxLFxuICAgICAgICBzb3VyY2VEZWNvcmF0b3I6IHIsXG4gICAgICAgIFBSX0FUVFJJQl9OQU1FOiBcImF0blwiLFxuICAgICAgICBQUl9BVFRSSUJfVkFMVUU6IFwiYXR2XCIsXG4gICAgICAgIFBSX0NPTU1FTlQ6IFwiY29tXCIsXG4gICAgICAgIFBSX0RFQ0xBUkFUSU9OOiBcImRlY1wiLFxuICAgICAgICBQUl9LRVlXT1JEOiBcImt3ZFwiLFxuICAgICAgICBQUl9MSVRFUkFMOiBcImxpdFwiLFxuICAgICAgICBQUl9QTEFJTjogXCJwbG5cIixcbiAgICAgICAgUFJfUFVOQ1RVQVRJT046IFwicHVuXCIsXG4gICAgICAgIFBSX1NPVVJDRTogXCJzcmNcIixcbiAgICAgICAgUFJfU1RSSU5HOiBcInN0clwiLFxuICAgICAgICBQUl9UQUc6IFwidGFnXCIsXG4gICAgICAgIFBSX1RZUEU6IFwidHlwXCJcbiAgICB9O1xufSkoKTtcbiIsImltcG9ydCBQYXJzb25zIGZyb20gXCIuL3BhcnNvbnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWRQYXJzb25zIGV4dGVuZHMgUGFyc29ucyB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgLy8gdG9kbyAtLSBtYWtlIHRoaXMgY29uZmlndXJhYmxlXG4gICAgICAgIGlmIChvcHRzLnRpbWVkZmVlZGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd2ZlZWRiYWNrID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd2ZlZWRiYWNrID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ncmFkZXIuc2hvd2ZlZWRiYWNrID0gdGhpcy5zaG93ZmVlZGJhY2s7XG4gICAgICAgIHRoaXMuaGlkZUZlZWRiYWNrKCk7XG4gICAgICAgICQodGhpcy5jaGVja0J1dHRvbikuaGlkZSgpO1xuICAgICAgICAkKHRoaXMuaGVscEJ1dHRvbikuaGlkZSgpO1xuICAgICAgICAkKHRoaXMucmVzZXRCdXR0b24pLmhpZGUoKTtcbiAgICB9XG4gICAgY2hlY2tDb3JyZWN0VGltZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvcnJlY3QgPyBcIlRcIiA6IFwiRlwiO1xuICAgIH1cbiAgICBoaWRlRmVlZGJhY2soKSB7XG4gICAgICAgICQodGhpcy5tZXNzYWdlRGl2KS5oaWRlKCk7XG4gICAgfVxufVxuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5W1wicGFyc29uc1wiXSA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgaWYgKG9wdHMudGltZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW1lZFBhcnNvbnMob3B0cyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUGFyc29ucyhvcHRzKTtcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=