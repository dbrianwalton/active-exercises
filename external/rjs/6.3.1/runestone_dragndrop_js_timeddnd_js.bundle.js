(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_dragndrop_js_timeddnd_js"],{

/***/ 80329:
/*!***********************************************!*\
  !*** ./runestone/dragndrop/css/dragndrop.css ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 33426:
/*!*************************************************!*\
  !*** ./runestone/dragndrop/js/DragDropTouch.js ***!
  \*************************************************/
/***/ (() => {

var DragDropTouch;
(function (DragDropTouch_1) {
    'use strict';
    /**
     * Object used to hold the data that is being dragged during drag and drop operations.
     *
     * It may hold one or more data items of different types. For more information about
     * drag and drop operations and data transfer objects, see
     * <a href="https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer">HTML Drag and Drop API</a>.
     *
     * This object is created automatically by the @see:DragDropTouch singleton and is
     * accessible through the @see:dataTransfer property of all drag events.
     */
    var DataTransfer = (function () {
        function DataTransfer() {
            this._dropEffect = 'move';
            this._effectAllowed = 'all';
            this._data = {};
        }
        Object.defineProperty(DataTransfer.prototype, "dropEffect", {
            /**
             * Gets or sets the type of drag-and-drop operation currently selected.
             * The value must be 'none',  'copy',  'link', or 'move'.
             */
            get: function () {
                return this._dropEffect;
            },
            set: function (value) {
                this._dropEffect = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataTransfer.prototype, "effectAllowed", {
            /**
             * Gets or sets the types of operations that are possible.
             * Must be one of 'none', 'copy', 'copyLink', 'copyMove', 'link',
             * 'linkMove', 'move', 'all' or 'uninitialized'.
             */
            get: function () {
                return this._effectAllowed;
            },
            set: function (value) {
                this._effectAllowed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataTransfer.prototype, "types", {
            /**
             * Gets an array of strings giving the formats that were set in the @see:dragstart event.
             */
            get: function () {
                return Object.keys(this._data);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Removes the data associated with a given type.
         *
         * The type argument is optional. If the type is empty or not specified, the data
         * associated with all types is removed. If data for the specified type does not exist,
         * or the data transfer contains no data, this method will have no effect.
         *
         * @param type Type of data to remove.
         */
        DataTransfer.prototype.clearData = function (type) {
            if (type != null) {
                delete this._data[type.toLowerCase()];
            }
            else {
                this._data = {};
            }
        };
        /**
         * Retrieves the data for a given type, or an empty string if data for that type does
         * not exist or the data transfer contains no data.
         *
         * @param type Type of data to retrieve.
         */
        DataTransfer.prototype.getData = function (type) {
            return this._data[type.toLowerCase()] || '';
        };
        /**
         * Set the data for a given type.
         *
         * For a list of recommended drag types, please see
         * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Recommended_Drag_Types.
         *
         * @param type Type of data to add.
         * @param value Data to add.
         */
        DataTransfer.prototype.setData = function (type, value) {
            this._data[type.toLowerCase()] = value;
        };
        /**
         * Set the image to be used for dragging if a custom one is desired.
         *
         * @param img An image element to use as the drag feedback image.
         * @param offsetX The horizontal offset within the image.
         * @param offsetY The vertical offset within the image.
         */
        DataTransfer.prototype.setDragImage = function (img, offsetX, offsetY) {
            var ddt = DragDropTouch._instance;
            ddt._imgCustom = img;
            ddt._imgOffset = { x: offsetX, y: offsetY };
        };
        return DataTransfer;
    }());
    DragDropTouch_1.DataTransfer = DataTransfer;
    /**
     * Defines a class that adds support for touch-based HTML5 drag/drop operations.
     *
     * The @see:DragDropTouch class listens to touch events and raises the
     * appropriate HTML5 drag/drop events as if the events had been caused
     * by mouse actions.
     *
     * The purpose of this class is to enable using existing, standard HTML5
     * drag/drop code on mobile devices running IOS or Android.
     *
     * To use, include the DragDropTouch.js file on the page. The class will
     * automatically start monitoring touch events and will raise the HTML5
     * drag drop events (dragstart, dragenter, dragleave, drop, dragend) which
     * should be handled by the application.
     *
     * For details and examples on HTML drag and drop, see
     * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_operations.
     */
    var DragDropTouch = (function () {
        /**
         * Initializes the single instance of the @see:DragDropTouch class.
         */
        function DragDropTouch() {
            this._lastClick = 0;
            // enforce singleton pattern
            if (DragDropTouch._instance) {
                throw 'DragDropTouch instance already created.';
            }
            // detect passive event support
            // https://github.com/Modernizr/Modernizr/issues/1894
            var supportsPassive = false;
            document.addEventListener('test', function () { }, {
                get passive() {
                    supportsPassive = true;
                    return true;
                }
            });
            // listen to touch events
            if (navigator.maxTouchPoints) {
                var d = document, 
                    ts = this._touchstart.bind(this), 
                    tm = this._touchmove.bind(this), 
                    te = this._touchend.bind(this), 
                    opt = supportsPassive ? { passive: false, capture: false } : false;
                d.addEventListener('touchstart', ts, opt);
                d.addEventListener('touchmove', tm, opt);
                d.addEventListener('touchend', te);
                d.addEventListener('touchcancel', te);
            }
        }
        /**
         * Gets a reference to the @see:DragDropTouch singleton.
         */
        DragDropTouch.getInstance = function () {
            return DragDropTouch._instance;
        };
        // ** event handlers
        DragDropTouch.prototype._touchstart = function (e) {
            var _this = this;
            if (this._shouldHandle(e)) {
                // raise double-click and prevent zooming
                if (Date.now() - this._lastClick < DragDropTouch._DBLCLICK) {
                    if (this._dispatchEvent(e, 'dblclick', e.target)) {
                        e.preventDefault();
                        this._reset();
                        return;
                    }
                }
                // clear all variables
                this._reset();
                // get nearest draggable element
                var src = this._closestDraggable(e.target);
                if (src) {
                    // give caller a chance to handle the hover/move events
                    if (!this._dispatchEvent(e, 'mousemove', e.target) &&
                        !this._dispatchEvent(e, 'mousedown', e.target)) {
                        // get ready to start dragging
                        this._dragSource = src;
                        this._ptDown = this._getPoint(e);
                        this._lastTouch = e;
                        e.preventDefault();
                        // show context menu if the user hasn't started dragging after a while
                        setTimeout(function () {
                            if (_this._dragSource == src && _this._img == null) {
                                if (_this._dispatchEvent(e, 'contextmenu', src)) {
                                    _this._reset();
                                }
                            }
                        }, DragDropTouch._CTXMENU);
                        if (DragDropTouch._ISPRESSHOLDMODE) {
                            this._pressHoldInterval = setTimeout(function () {
                                _this._isDragEnabled = true;
                                _this._touchmove(e);
                            }, DragDropTouch._PRESSHOLDAWAIT);
                        }
                    }
                }
            }
        };
        DragDropTouch.prototype._touchmove = function (e) {
            if (this._shouldCancelPressHoldMove(e)) {
              this._reset();
              return;
            }
            if (this._shouldHandleMove(e) || this._shouldHandlePressHoldMove(e)) {
                // see if target wants to handle move
                var target = this._getTarget(e);
                if (this._dispatchEvent(e, 'mousemove', target)) {
                    this._lastTouch = e;
                    e.preventDefault();
                    return;
                }
                // start dragging
                if (this._dragSource && !this._img && this._shouldStartDragging(e)) {
                    this._dispatchEvent(e, 'dragstart', this._dragSource);
                    this._createImage(e);
                    this._dispatchEvent(e, 'dragenter', target);
                }
                // continue dragging
                if (this._img) {
                    this._lastTouch = e;
                    e.preventDefault(); // prevent scrolling
                    this._dispatchEvent(e, 'drag', this._dragSource);
                    if (target != this._lastTarget) {
                        this._dispatchEvent(this._lastTouch, 'dragleave', this._lastTarget);
                        this._dispatchEvent(e, 'dragenter', target);
                        this._lastTarget = target;
                    }
                    this._moveImage(e);
                    this._isDropZone = this._dispatchEvent(e, 'dragover', target);
                }
            }
        };
        DragDropTouch.prototype._touchend = function (e) {
            if (this._shouldHandle(e)) {
                // see if target wants to handle up
                if (this._dispatchEvent(this._lastTouch, 'mouseup', e.target)) {
                    e.preventDefault();
                    return;
                }
                // user clicked the element but didn't drag, so clear the source and simulate a click
                if (!this._img) {
                    this._dragSource = null;
                    this._dispatchEvent(this._lastTouch, 'click', e.target);
                    this._lastClick = Date.now();
                }
                // finish dragging
                this._destroyImage();
                if (this._dragSource) {
                    if (e.type.indexOf('cancel') < 0 && this._isDropZone) {
                        this._dispatchEvent(this._lastTouch, 'drop', this._lastTarget);
                    }
                    this._dispatchEvent(this._lastTouch, 'dragend', this._dragSource);
                    this._reset();
                }
            }
        };
        // ** utilities
        // ignore events that have been handled or that involve more than one touch
        DragDropTouch.prototype._shouldHandle = function (e) {
            return e &&
                !e.defaultPrevented &&
                e.touches && e.touches.length < 2;
        };

        // use regular condition outside of press & hold mode
        DragDropTouch.prototype._shouldHandleMove = function (e) {
          return !DragDropTouch._ISPRESSHOLDMODE && this._shouldHandle(e);
        };

        // allow to handle moves that involve many touches for press & hold
        DragDropTouch.prototype._shouldHandlePressHoldMove = function (e) {
          return DragDropTouch._ISPRESSHOLDMODE &&
              this._isDragEnabled && e && e.touches && e.touches.length;
        };

        // reset data if user drags without pressing & holding
        DragDropTouch.prototype._shouldCancelPressHoldMove = function (e) {
          return DragDropTouch._ISPRESSHOLDMODE && !this._isDragEnabled &&
              this._getDelta(e) > DragDropTouch._PRESSHOLDMARGIN;
        };

        // start dragging when specified delta is detected
        DragDropTouch.prototype._shouldStartDragging = function (e) {
            var delta = this._getDelta(e);
            return delta > DragDropTouch._THRESHOLD ||
                (DragDropTouch._ISPRESSHOLDMODE && delta >= DragDropTouch._PRESSHOLDTHRESHOLD);
        }

        // clear all members
        DragDropTouch.prototype._reset = function () {
            this._destroyImage();
            this._dragSource = null;
            this._lastTouch = null;
            this._lastTarget = null;
            this._ptDown = null;
            this._isDragEnabled = false;
            this._isDropZone = false;
            this._dataTransfer = new DataTransfer();
            clearInterval(this._pressHoldInterval);
        };
        // get point for a touch event
        DragDropTouch.prototype._getPoint = function (e, page) {
            if (e && e.touches) {
                e = e.touches[0];
            }
            return { x: page ? e.pageX : e.clientX, y: page ? e.pageY : e.clientY };
        };
        // get distance between the current touch event and the first one
        DragDropTouch.prototype._getDelta = function (e) {
            if (DragDropTouch._ISPRESSHOLDMODE && !this._ptDown) { return 0; }
            var p = this._getPoint(e);
            return Math.abs(p.x - this._ptDown.x) + Math.abs(p.y - this._ptDown.y);
        };
        // get the element at a given touch event
        DragDropTouch.prototype._getTarget = function (e) {
            var pt = this._getPoint(e), el = document.elementFromPoint(pt.x, pt.y);
            while (el && getComputedStyle(el).pointerEvents == 'none') {
                el = el.parentElement;
            }
            return el;
        };
        // create drag image from source element
        DragDropTouch.prototype._createImage = function (e) {
            // just in case...
            if (this._img) {
                this._destroyImage();
            }
            // create drag image from custom element or drag source
            var src = this._imgCustom || this._dragSource;
            this._img = src.cloneNode(true);
            this._copyStyle(src, this._img);
            this._img.style.top = this._img.style.left = '-9999px';
            // if creating from drag source, apply offset and opacity
            if (!this._imgCustom) {
                var rc = src.getBoundingClientRect(), pt = this._getPoint(e);
                this._imgOffset = { x: pt.x - rc.left, y: pt.y - rc.top };
                this._img.style.opacity = DragDropTouch._OPACITY.toString();
            }
            // add image to document
            this._moveImage(e);
            document.body.appendChild(this._img);
        };
        // dispose of drag image element
        DragDropTouch.prototype._destroyImage = function () {
            if (this._img && this._img.parentElement) {
                this._img.parentElement.removeChild(this._img);
            }
            this._img = null;
            this._imgCustom = null;
        };
        // move the drag image element
        DragDropTouch.prototype._moveImage = function (e) {
            var _this = this;
            requestAnimationFrame(function () {
                if (_this._img) {
                    var pt = _this._getPoint(e, true), s = _this._img.style;
                    s.position = 'absolute';
                    s.pointerEvents = 'none';
                    s.zIndex = '999999';
                    s.left = Math.round(pt.x - _this._imgOffset.x) + 'px';
                    s.top = Math.round(pt.y - _this._imgOffset.y) + 'px';
                }
            });
        };
        // copy properties from an object to another
        DragDropTouch.prototype._copyProps = function (dst, src, props) {
            for (var i = 0; i < props.length; i++) {
                var p = props[i];
                dst[p] = src[p];
            }
        };
        DragDropTouch.prototype._copyStyle = function (src, dst) {
            // remove potentially troublesome attributes
            DragDropTouch._rmvAtts.forEach(function (att) {
                dst.removeAttribute(att);
            });
            // copy canvas content
            if (src instanceof HTMLCanvasElement) {
                var cSrc = src, cDst = dst;
                cDst.width = cSrc.width;
                cDst.height = cSrc.height;
                cDst.getContext('2d').drawImage(cSrc, 0, 0);
            }
            // copy style (without transitions)
            var cs = getComputedStyle(src);
            for (var i = 0; i < cs.length; i++) {
                var key = cs[i];
                if (key.indexOf('transition') < 0) {
                    dst.style[key] = cs[key];
                }
            }
            dst.style.pointerEvents = 'none';
            // and repeat for all children
            for (var i = 0; i < src.children.length; i++) {
                this._copyStyle(src.children[i], dst.children[i]);
            }
        };
        DragDropTouch.prototype._dispatchEvent = function (e, type, target) {
            if (e && target) {
                var evt = document.createEvent('Event'), t = e.touches ? e.touches[0] : e;
                evt.initEvent(type, true, true);
                evt.button = 0;
                evt.which = evt.buttons = 1;
                this._copyProps(evt, e, DragDropTouch._kbdProps);
                this._copyProps(evt, t, DragDropTouch._ptProps);
                evt.dataTransfer = this._dataTransfer;
                target.dispatchEvent(evt);
                return evt.defaultPrevented;
            }
            return false;
        };
        // gets an element's closest draggable ancestor
        DragDropTouch.prototype._closestDraggable = function (e) {
            for (; e; e = e.parentElement) {
                if (e.hasAttribute('draggable') && e.draggable) {
                    return e;
                }
            }
            return null;
        };
        return DragDropTouch;
    }());
    /*private*/ DragDropTouch._instance = new DragDropTouch(); // singleton
    // constants
    DragDropTouch._THRESHOLD = 5; // pixels to move before drag starts
    DragDropTouch._OPACITY = 0.5; // drag image opacity
    DragDropTouch._DBLCLICK = 500; // max ms between clicks in a double click
    DragDropTouch._CTXMENU = 900; // ms to hold before raising 'contextmenu' event
    DragDropTouch._ISPRESSHOLDMODE = false; // decides of press & hold mode presence
    DragDropTouch._PRESSHOLDAWAIT = 400; // ms to wait before press & hold is detected
    DragDropTouch._PRESSHOLDMARGIN = 25; // pixels that finger might shiver while pressing
    DragDropTouch._PRESSHOLDTHRESHOLD = 0; // pixels to move before drag starts
    // copy styles/attributes from drag source to drag image element
    DragDropTouch._rmvAtts = 'id,class,style,draggable'.split(',');
    // synthesize and dispatch an event
    // returns true if the event has been handled (e.preventDefault == true)
    DragDropTouch._kbdProps = 'altKey,ctrlKey,metaKey,shiftKey'.split(',');
    DragDropTouch._ptProps = 'pageX,pageY,clientX,clientY,screenX,screenY,offsetX,offsetY'.split(',');
    DragDropTouch_1.DragDropTouch = DragDropTouch;
})(DragDropTouch || (DragDropTouch = {}));


/***/ }),

/***/ 78273:
/*!*****************************************************!*\
  !*** ./runestone/dragndrop/js/dragndrop-i18n.en.js ***!
  \*****************************************************/
/***/ (() => {

$.i18n().load({
    en: {
        msg_dragndrop_correct_answer: "You are correct!",
        msg_dragndrop_incorrect_answer:
            "Incorret. You got $1 correct and $2 incorrect out of $3. You left $4 blank.",
        msg_dragndrop_check_me: "Check me",
        msg_dragndrop_reset: "Reset",
    },
});


/***/ }),

/***/ 26254:
/*!********************************************************!*\
  !*** ./runestone/dragndrop/js/dragndrop-i18n.pt-br.js ***!
  \********************************************************/
/***/ (() => {

$.i18n().load({
    "pt-br": {
        msg_dragndrop_correct_answer: "Correto!",
        msg_dragndrop_incorrect_answer:
            "Incorreto. Você teve $1 correto(s) e $2 incorreto(s) de $3. Você deixou $4 em branco.",
        msg_dragndrop_check_me: "Verificar",
        msg_dragndrop_reset: "Resetar",
    },
});


/***/ }),

/***/ 70225:
/*!*********************************************!*\
  !*** ./runestone/dragndrop/js/dragndrop.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ddList": () => (/* binding */ ddList),
/* harmony export */   "default": () => (/* binding */ DragNDrop)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 2568);
/* harmony import */ var _css_dragndrop_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/dragndrop.css */ 80329);
/* harmony import */ var _dragndrop_i18n_en_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dragndrop-i18n.en.js */ 78273);
/* harmony import */ var _dragndrop_i18n_en_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_dragndrop_i18n_en_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _dragndrop_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dragndrop-i18n.pt-br.js */ 26254);
/* harmony import */ var _dragndrop_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_dragndrop_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _DragDropTouch_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DragDropTouch.js */ 33426);
/* harmony import */ var _DragDropTouch_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_DragDropTouch_js__WEBPACK_IMPORTED_MODULE_4__);
/*==========================================
=======     Master dragndrop.js     ========
============================================
===     This file contains the JS for    ===
=== the Runestone Drag n drop component. ===
============================================
===              Created by              ===
===           Isaiah Mayerchak           ===
===                7/6/15                ===
===              Brad MIller             ===
===                2/7/19                ===
==========================================*/








var ddList = {}; // Dictionary that contains all instances of dragndrop objects

class DragNDrop extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; // entire <ul> element that will be replaced by new HTML
        this.origElem = orig;
        this.divid = orig.id;
        this.useRunestoneServices = opts.useRunestoneServices;
        this.random = false;
        if ($(this.origElem).is("[data-random]")) {
            this.random = true;
        }
        this.feedback = "";
        this.dragPairArray = [];
        this.question = "";
        this.populate(); // Populates this.dragPairArray, this.feedback and this.question
        this.createNewElements();
        this.caption = "Drag-N-Drop";
        this.addCaption("runestone");
        if (typeof Prism !== "undefined") {
            Prism.highlightAllUnder(this.containerDiv);
        }
    }
    /*======================
    === Update variables ===
    ======================*/
    populate() {
        for (var i = 0; i < this.origElem.childNodes.length; i++) {
            if (
                $(this.origElem.childNodes[i]).data("subcomponent") ===
                "dropzone"
            ) {
                var tmp = $(this.origElem).find(
                    `#${$(this.origElem.childNodes[i]).attr("for")}`
                )[0];
                var replaceSpan = document.createElement("span");
                replaceSpan.innerHTML = tmp.innerHTML;
                replaceSpan.id = this.divid + tmp.id;
                $(replaceSpan).attr("draggable", "true");
                $(replaceSpan).addClass("draggable-drag");
                var otherReplaceSpan = document.createElement("span");
                otherReplaceSpan.innerHTML =
                    this.origElem.childNodes[i].innerHTML;
                $(otherReplaceSpan).addClass("draggable-drop");
                this.setEventListeners(replaceSpan, otherReplaceSpan);
                var tmpArr = [];
                tmpArr.push(replaceSpan);
                tmpArr.push(otherReplaceSpan);
                this.dragPairArray.push(tmpArr);
            } else if (
                $(this.origElem.childNodes[i]).data("subcomponent") ===
                "question"
            ) {
                this.question = this.origElem.childNodes[i].innerHTML;
            } else if (
                $(this.origElem.childNodes[i]).data("subcomponent") ===
                "feedback"
            ) {
                this.feedback = this.origElem.childNodes[i].innerHTML;
            }
        }
    }
    /*========================================
    == Create new HTML elements and replace ==
    ==      original element with them      ==
    ========================================*/
    createNewElements() {
        this.containerDiv = document.createElement("div");
        this.containerDiv.id = this.divid;
        $(this.containerDiv).addClass("draggable-container");
        $(this.containerDiv).html(this.question);
        this.containerDiv.appendChild(document.createElement("br"));
        this.dragDropWrapDiv = document.createElement("div"); // Holds the draggables/dropzones, prevents feedback from bleeding in
        $(this.dragDropWrapDiv).css("display", "block");
        this.containerDiv.appendChild(this.dragDropWrapDiv);
        this.draggableDiv = document.createElement("div");
        $(this.draggableDiv).addClass("rsdraggable dragzone");
        this.addDragDivListeners();
        this.dropZoneDiv = document.createElement("div");
        $(this.dropZoneDiv).addClass("rsdraggable");
        this.dragDropWrapDiv.appendChild(this.draggableDiv);
        this.dragDropWrapDiv.appendChild(this.dropZoneDiv);
        this.createButtons();
        this.checkServer("dragNdrop", true);
        self = this;
        self.queueMathJax(self.containerDiv);

    }
    finishSettingUp() {
        this.appendReplacementSpans();
        this.renderFeedbackDiv();
        $(this.origElem).replaceWith(this.containerDiv);
        if (!this.hasStoredDropzones) {
            this.minheight = $(this.draggableDiv).height();
        }
        this.draggableDiv.style.minHeight = this.minheight.toString() + "px";
        if ($(this.dropZoneDiv).height() > this.minheight) {
            this.dragDropWrapDiv.style.minHeight =
                $(this.dropZoneDiv).height().toString() + "px";
        } else {
            this.dragDropWrapDiv.style.minHeight =
                this.minheight.toString() + "px";
        }
    }
    addDragDivListeners() {
        let self = this;
        this.draggableDiv.addEventListener(
            "dragover",
            function (ev) {
                ev.preventDefault();
                if ($(this.draggableDiv).hasClass("possibleDrop")) {
                    return;
                }
                $(this.draggableDiv).addClass("possibleDrop");
            }.bind(this)
        );
        this.draggableDiv.addEventListener(
            "drop",
            function (ev) {
                self.isAnswered = true;
                ev.preventDefault();
                if ($(this.draggableDiv).hasClass("possibleDrop")) {
                    $(this.draggableDiv).removeClass("possibleDrop");
                }
                var data = ev.dataTransfer.getData("draggableID");
                var draggedSpan = document.getElementById(data);
                if (
                    !$(this.draggableDiv).has(draggedSpan).length &&
                    !this.strangerDanger(draggedSpan)
                ) {
                    // Make sure element isn't already there--prevents erros w/appending child
                    this.draggableDiv.appendChild(draggedSpan);
                }
            }.bind(this)
        );
        this.draggableDiv.addEventListener(
            "dragleave",
            function (e) {
                if (!$(this.draggableDiv).hasClass("possibleDrop")) {
                    return;
                }
                $(this.draggableDiv).removeClass("possibleDrop");
            }.bind(this)
        );
    }
    createButtons() {
        this.buttonDiv = document.createElement("div");
        this.submitButton = document.createElement("button"); // Check me button
        this.submitButton.textContent = $.i18n("msg_dragndrop_check_me");
        $(this.submitButton).attr({
            class: "btn btn-success drag-button",
            name: "do answer",
            type: "button",
        });
        this.submitButton.onclick = function () {
            this.checkCurrentAnswer();
            this.renderFeedback();
            this.logCurrentAnswer();
        }.bind(this);
        this.resetButton = document.createElement("button"); // Check me button
        this.resetButton.textContent = $.i18n("msg_dragndrop_reset");
        $(this.resetButton).attr({
            class: "btn btn-default drag-button drag-reset",
            name: "do answer",
        });
        this.resetButton.onclick = function () {
            this.resetDraggables();
        }.bind(this);
        this.buttonDiv.appendChild(this.submitButton);
        this.buttonDiv.appendChild(this.resetButton);
        this.containerDiv.appendChild(this.buttonDiv);
    }
    appendReplacementSpans() {
        this.createIndexArray();
        this.randomizeIndexArray();
        for (let i = 0; i < this.dragPairArray.length; i++) {
            if (this.hasStoredDropzones) {
                if (
                    $.inArray(this.indexArray[i][0], this.pregnantIndexArray) <
                    0
                ) {
                    this.draggableDiv.appendChild(
                        this.dragPairArray[this.indexArray[i]][0]
                    );
                }
            } else {
                this.draggableDiv.appendChild(
                    this.dragPairArray[this.indexArray[i]][0]
                );
            }
        }
        this.randomizeIndexArray();
        for (let i = 0; i < this.dragPairArray.length; i++) {
            if (this.hasStoredDropzones) {
                if (this.pregnantIndexArray[this.indexArray[i]] !== "-1") {
                    this.dragPairArray[this.indexArray[i]][1].appendChild(
                        this.dragPairArray[
                            this.pregnantIndexArray[this.indexArray[i]]
                        ][0]
                    );
                }
            }
            this.dropZoneDiv.appendChild(
                this.dragPairArray[this.indexArray[i]][1]
            );
        }
    }
    setEventListeners(dgSpan, dpSpan) {
        // Adds HTML5 "drag and drop" UI functionality
        let self = this;
        dgSpan.addEventListener("dragstart", function (ev) {
            ev.dataTransfer.setData("draggableID", ev.target.id);
        });
        dgSpan.addEventListener("dragover", function (ev) {
            ev.preventDefault();
        });
        dgSpan.addEventListener(
            "drop",
            function (ev) {
                self.isAnswered = true;
                ev.preventDefault();
                var data = ev.dataTransfer.getData("draggableID");
                var draggedSpan = document.getElementById(data);
                if (
                    this.hasNoDragChild(ev.target) &&
                    draggedSpan != ev.target &&
                    !this.strangerDanger(draggedSpan)
                ) {
                    // Make sure element isn't already there--prevents erros w/appending child
                    this.draggableDiv.appendChild(draggedSpan);
                }
            }.bind(this)
        );
        dpSpan.addEventListener(
            "dragover",
            function (ev) {
                self.isAnswered = true;
                ev.preventDefault();
                if ($(ev.target).hasClass("possibleDrop")) {
                    return;
                }
                if (
                    $(ev.target).hasClass("draggable-drop") &&
                    this.hasNoDragChild(ev.target)
                ) {
                    $(ev.target).addClass("possibleDrop");
                }
            }.bind(this)
        );
        dpSpan.addEventListener("dragleave", function (ev) {
            self.isAnswered = true;
            ev.preventDefault();
            if (!$(ev.target).hasClass("possibleDrop")) {
                return;
            }
            $(ev.target).removeClass("possibleDrop");
        });
        dpSpan.addEventListener(
            "drop",
            function (ev) {
                self.isAnswered = true;
                ev.preventDefault();
                if ($(ev.target).hasClass("possibleDrop")) {
                    $(ev.target).removeClass("possibleDrop");
                }
                var data = ev.dataTransfer.getData("draggableID");
                var draggedSpan = document.getElementById(data);
                if (
                    $(ev.target).hasClass("draggable-drop") &&
                    this.hasNoDragChild(ev.target) &&
                    !this.strangerDanger(draggedSpan)
                ) {
                    // Make sure element isn't already there--prevents erros w/appending child
                    ev.target.appendChild(draggedSpan);
                }
            }.bind(this)
        );
    }
    renderFeedbackDiv() {
        if (!this.feedBackDiv) {
            this.feedBackDiv = document.createElement("div");
            this.feedBackDiv.id = this.divid + "_feedback";
            this.containerDiv.appendChild(document.createElement("br"));
            this.containerDiv.appendChild(this.feedBackDiv);
        }
    }
    /*=======================
    == Auxiliary functions ==
    =======================*/
    strangerDanger(testSpan) {
        // Returns true if the test span doesn't belong to this instance of DragNDrop
        var strangerDanger = true;
        for (var i = 0; i < this.dragPairArray.length; i++) {
            if (testSpan === this.dragPairArray[i][0]) {
                strangerDanger = false;
            }
        }
        return strangerDanger;
    }
    hasNoDragChild(parent) {
        // Ensures that each dropZoneDiv can have only one draggable child
        var counter = 0;
        for (var i = 0; i < parent.childNodes.length; i++) {
            if ($(parent.childNodes[i]).attr("draggable") === "true") {
                counter++;
            }
        }
        if (counter >= 1) {
            return false;
        } else {
            return true;
        }
    }
    createIndexArray() {
        this.indexArray = [];
        for (var i = 0; i < this.dragPairArray.length; i++) {
            this.indexArray.push(i);
        }
    }
    randomizeIndexArray() {
        // Shuffles around indices so the matchable elements aren't in a predictable order
        var currentIndex = this.indexArray.length,
            temporaryValue,
            randomIndex;
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = this.indexArray[currentIndex];
            this.indexArray[currentIndex] = this.indexArray[randomIndex];
            this.indexArray[randomIndex] = temporaryValue;
        }
    }
    /*==============================
    == Reset button functionality ==
    ==============================*/
    resetDraggables() {
        for (var i = 0; i < this.dragPairArray.length; i++) {
            for (
                var j = 0;
                j < this.dragPairArray[i][1].childNodes.length;
                j++
            ) {
                if (
                    $(this.dragPairArray[i][1].childNodes[j]).attr(
                        "draggable"
                    ) === "true"
                ) {
                    this.draggableDiv.appendChild(
                        this.dragPairArray[i][1].childNodes[j]
                    );
                }
            }
        }
        this.feedBackDiv.style.display = "none";
    }
    /*===========================
    == Evaluation and feedback ==
    ===========================*/

    checkCurrentAnswer() {
        this.correct = true;
        this.unansweredNum = 0;
        this.incorrectNum = 0;
        this.dragNum = this.dragPairArray.length;
        for (var i = 0; i < this.dragPairArray.length; i++) {
            if (
                !$(this.dragPairArray[i][1]).has(this.dragPairArray[i][0])
                    .length
            ) {
                this.correct = false;
                this.incorrectNum++;
            }
            if (this.hasNoDragChild(this.dragPairArray[i][1])) {
                this.unansweredNum++;
                this.incorrectNum -= 1;
            }
        }
        this.correctNum = this.dragNum - this.incorrectNum - this.unansweredNum;
        this.percent = this.correctNum / this.dragPairArray.length;
        this.setLocalStorage({ correct: this.correct ? "T" : "F" });
    }

    async logCurrentAnswer(sid) {
        let answer = this.pregnantIndexArray.join(";");
        let data = {
            event: "dragNdrop",
            act: answer,
            answer: answer,
            min_height: this.minheight,
            div_id: this.divid,
            correct: this.correct,
            correctNum: this.correctNum,
            dragNum: this.dragNum,
        };
        if (typeof sid !== "undefined") {
            data.sid = sid;
        }
        await this.logBookEvent(data);
    }
    renderFeedback() {
        for (var i = 0; i < this.dragPairArray.length; i++) {
            if (
                !$(this.dragPairArray[i][1]).has(this.dragPairArray[i][0])
                    .length
            ) {
                $(this.dragPairArray[i][1]).addClass("drop-incorrect");
            } else {
                $(this.dragPairArray[i][1]).removeClass("drop-incorrect");
            }
        }

        if (!this.feedBackDiv) {
            this.renderFeedbackDiv();
        }
        this.feedBackDiv.style.display = "block";
        if (this.correct) {
            var msgCorrect = $.i18n("msg_dragndrop_correct_answer");
            $(this.feedBackDiv).html(msgCorrect);
            $(this.feedBackDiv).attr(
                "class",
                "alert alert-info draggable-feedback"
            );
        } else {
            var msgIncorrect = $.i18n(
                $.i18n("msg_dragndrop_incorrect_answer"),
                this.correctNum,
                this.incorrectNum,
                this.dragNum,
                this.unansweredNum
            );
            $(this.feedBackDiv).html(msgIncorrect + " " + this.feedback);
            $(this.feedBackDiv).attr(
                "class",
                "alert alert-danger draggable-feedback"
            );
        }
    }
    /*===================================
    === Checking/restoring from storage ===
    ===================================*/
    restoreAnswers(data) {
        // Restore answers from storage retrieval done in RunestoneBase
        this.hasStoredDropzones = true;
        this.minheight = data.min_height;
        this.pregnantIndexArray = data.answer.split(";");
        this.finishSettingUp();
    }
    checkLocalStorage() {
        if (this.graderactive) {
            return;
        }
        var storedObj;
        this.hasStoredDropzones = false;
        var len = localStorage.length;
        if (len > 0) {
            var ex = localStorage.getItem(this.localStorageKey());
            if (ex !== null) {
                this.hasStoredDropzones = true;
                try {
                    storedObj = JSON.parse(ex);
                    this.minheight = storedObj.min_height;
                } catch (err) {
                    // error while parsing; likely due to bad value stored in storage
                    console.log(err.message);
                    localStorage.removeItem(this.localStorageKey());
                    this.hasStoredDropzones = false;
                    this.finishSettingUp();
                    return;
                }
                this.pregnantIndexArray = storedObj.answer.split(";");
                if (this.useRunestoneServices) {
                    // store answer in database
                    var answer = this.pregnantIndexArray.join(";");
                    this.logBookEvent({
                        event: "dragNdrop",
                        act: answer,
                        answer: answer,
                        min_height: this.minheight,
                        div_id: this.divid,
                        correct: storedObj.correct,
                    });
                }
            }
        }
        this.finishSettingUp();
    }

    setLocalStorage(data) {
        if (data.answer === undefined) {
            // If we didn't load from the server, we must generate the data
            this.pregnantIndexArray = [];
            for (var i = 0; i < this.dragPairArray.length; i++) {
                if (!this.hasNoDragChild(this.dragPairArray[i][1])) {
                    for (var j = 0; j < this.dragPairArray.length; j++) {
                        if (
                            $(this.dragPairArray[i][1]).has(
                                this.dragPairArray[j][0]
                            ).length
                        ) {
                            this.pregnantIndexArray.push(j);
                        }
                    }
                } else {
                    this.pregnantIndexArray.push(-1);
                }
            }
        }
        var timeStamp = new Date();
        var correct = data.correct;
        var storageObj = {
            answer: this.pregnantIndexArray.join(";"),
            min_height: this.minheight,
            timestamp: timeStamp,
            correct: correct,
        };
        localStorage.setItem(
            this.localStorageKey(),
            JSON.stringify(storageObj)
        );
    }

    disableInteraction() {
        $(this.resetButton).hide();
        for (var i = 0; i < this.dragPairArray.length; i++) {
            // No more dragging
            $(this.dragPairArray[i][0]).attr("draggable", "false");
            $(this.dragPairArray[i][0]).css("cursor", "initial");
        }
    }
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/
$(document).on("runestone:login-complete", function () {
    $("[data-component=dragndrop]").each(function (index) {
        var opts = {
            orig: this,
            useRunestoneServices: eBookConfig.useRunestoneServices,
        };
        if ($(this).closest("[data-component=timedAssessment]").length == 0) {
            // If this element exists within a timed component, don't render it here
            try {
                ddList[this.id] = new DragNDrop(opts);
            } catch (err) {
                console.log(`Error rendering DragNDrop Problem ${this.id}`);
            }
        }
    });
});


/***/ }),

/***/ 47496:
/*!********************************************!*\
  !*** ./runestone/dragndrop/js/timeddnd.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimedDragNDrop)
/* harmony export */ });
/* harmony import */ var _dragndrop_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dragndrop.js */ 70225);




class TimedDragNDrop extends _dragndrop_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        this.finishSettingUp();
        this.renderTimedIcon(this.containerDiv);
        this.hideButtons();
    }
    hideButtons() {
        $(this.submitButton).hide();
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
        // Returns if the question was correct.    Used for timed assessment grading.
        if (this.unansweredNum === this.dragPairArray.length) {
            this.correct = null;
        }
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
        $(this.feedBackDiv).hide();
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory["dragndrop"] = function (opts) {
    if (opts.timed) {
        return new TimedDragNDrop(opts);
    }
    return new _dragndrop_js__WEBPACK_IMPORTED_MODULE_0__["default"](opts);
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2RyYWduZHJvcF9qc190aW1lZGRuZF9qcy5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2REFBNkQ7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLGlDQUFpQztBQUMvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxx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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOERBQThEO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsNkRBQTZEO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsK0JBQStCO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsK0JBQStCO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFD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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxxREFBUztBQUN4QiIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZHJhZ25kcm9wL2Nzcy9kcmFnbmRyb3AuY3NzPzZkNWMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9kcmFnbmRyb3AvanMvRHJhZ0Ryb3BUb3VjaC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2RyYWduZHJvcC9qcy9kcmFnbmRyb3AtaTE4bi5lbi5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2RyYWduZHJvcC9qcy9kcmFnbmRyb3AtaTE4bi5wdC1ici5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2RyYWduZHJvcC9qcy9kcmFnbmRyb3AuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9kcmFnbmRyb3AvanMvdGltZWRkbmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwidmFyIERyYWdEcm9wVG91Y2g7XHJcbihmdW5jdGlvbiAoRHJhZ0Ryb3BUb3VjaF8xKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICAvKipcclxuICAgICAqIE9iamVjdCB1c2VkIHRvIGhvbGQgdGhlIGRhdGEgdGhhdCBpcyBiZWluZyBkcmFnZ2VkIGR1cmluZyBkcmFnIGFuZCBkcm9wIG9wZXJhdGlvbnMuXHJcbiAgICAgKlxyXG4gICAgICogSXQgbWF5IGhvbGQgb25lIG9yIG1vcmUgZGF0YSBpdGVtcyBvZiBkaWZmZXJlbnQgdHlwZXMuIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0XHJcbiAgICAgKiBkcmFnIGFuZCBkcm9wIG9wZXJhdGlvbnMgYW5kIGRhdGEgdHJhbnNmZXIgb2JqZWN0cywgc2VlXHJcbiAgICAgKiA8YSBocmVmPVwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0RhdGFUcmFuc2ZlclwiPkhUTUwgRHJhZyBhbmQgRHJvcCBBUEk8L2E+LlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgb2JqZWN0IGlzIGNyZWF0ZWQgYXV0b21hdGljYWxseSBieSB0aGUgQHNlZTpEcmFnRHJvcFRvdWNoIHNpbmdsZXRvbiBhbmQgaXNcclxuICAgICAqIGFjY2Vzc2libGUgdGhyb3VnaCB0aGUgQHNlZTpkYXRhVHJhbnNmZXIgcHJvcGVydHkgb2YgYWxsIGRyYWcgZXZlbnRzLlxyXG4gICAgICovXHJcbiAgICB2YXIgRGF0YVRyYW5zZmVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmdW5jdGlvbiBEYXRhVHJhbnNmZXIoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Ryb3BFZmZlY3QgPSAnbW92ZSc7XHJcbiAgICAgICAgICAgIHRoaXMuX2VmZmVjdEFsbG93ZWQgPSAnYWxsJztcclxuICAgICAgICAgICAgdGhpcy5fZGF0YSA9IHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRGF0YVRyYW5zZmVyLnByb3RvdHlwZSwgXCJkcm9wRWZmZWN0XCIsIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEdldHMgb3Igc2V0cyB0aGUgdHlwZSBvZiBkcmFnLWFuZC1kcm9wIG9wZXJhdGlvbiBjdXJyZW50bHkgc2VsZWN0ZWQuXHJcbiAgICAgICAgICAgICAqIFRoZSB2YWx1ZSBtdXN0IGJlICdub25lJywgICdjb3B5JywgICdsaW5rJywgb3IgJ21vdmUnLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZHJvcEVmZmVjdDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Ryb3BFZmZlY3QgPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KERhdGFUcmFuc2Zlci5wcm90b3R5cGUsIFwiZWZmZWN0QWxsb3dlZFwiLCB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBHZXRzIG9yIHNldHMgdGhlIHR5cGVzIG9mIG9wZXJhdGlvbnMgdGhhdCBhcmUgcG9zc2libGUuXHJcbiAgICAgICAgICAgICAqIE11c3QgYmUgb25lIG9mICdub25lJywgJ2NvcHknLCAnY29weUxpbmsnLCAnY29weU1vdmUnLCAnbGluaycsXHJcbiAgICAgICAgICAgICAqICdsaW5rTW92ZScsICdtb3ZlJywgJ2FsbCcgb3IgJ3VuaW5pdGlhbGl6ZWQnLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZWZmZWN0QWxsb3dlZDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2VmZmVjdEFsbG93ZWQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KERhdGFUcmFuc2Zlci5wcm90b3R5cGUsIFwidHlwZXNcIiwge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogR2V0cyBhbiBhcnJheSBvZiBzdHJpbmdzIGdpdmluZyB0aGUgZm9ybWF0cyB0aGF0IHdlcmUgc2V0IGluIHRoZSBAc2VlOmRyYWdzdGFydCBldmVudC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuX2RhdGEpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZW1vdmVzIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBhIGdpdmVuIHR5cGUuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBUaGUgdHlwZSBhcmd1bWVudCBpcyBvcHRpb25hbC4gSWYgdGhlIHR5cGUgaXMgZW1wdHkgb3Igbm90IHNwZWNpZmllZCwgdGhlIGRhdGFcclxuICAgICAgICAgKiBhc3NvY2lhdGVkIHdpdGggYWxsIHR5cGVzIGlzIHJlbW92ZWQuIElmIGRhdGEgZm9yIHRoZSBzcGVjaWZpZWQgdHlwZSBkb2VzIG5vdCBleGlzdCxcclxuICAgICAgICAgKiBvciB0aGUgZGF0YSB0cmFuc2ZlciBjb250YWlucyBubyBkYXRhLCB0aGlzIG1ldGhvZCB3aWxsIGhhdmUgbm8gZWZmZWN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHR5cGUgVHlwZSBvZiBkYXRhIHRvIHJlbW92ZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBEYXRhVHJhbnNmZXIucHJvdG90eXBlLmNsZWFyRGF0YSA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhW3R5cGUudG9Mb3dlckNhc2UoKV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kYXRhID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJldHJpZXZlcyB0aGUgZGF0YSBmb3IgYSBnaXZlbiB0eXBlLCBvciBhbiBlbXB0eSBzdHJpbmcgaWYgZGF0YSBmb3IgdGhhdCB0eXBlIGRvZXNcclxuICAgICAgICAgKiBub3QgZXhpc3Qgb3IgdGhlIGRhdGEgdHJhbnNmZXIgY29udGFpbnMgbm8gZGF0YS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB0eXBlIFR5cGUgb2YgZGF0YSB0byByZXRyaWV2ZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBEYXRhVHJhbnNmZXIucHJvdG90eXBlLmdldERhdGEgPSBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVt0eXBlLnRvTG93ZXJDYXNlKCldIHx8ICcnO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2V0IHRoZSBkYXRhIGZvciBhIGdpdmVuIHR5cGUuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBGb3IgYSBsaXN0IG9mIHJlY29tbWVuZGVkIGRyYWcgdHlwZXMsIHBsZWFzZSBzZWVcclxuICAgICAgICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9HdWlkZS9IVE1ML1JlY29tbWVuZGVkX0RyYWdfVHlwZXMuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gdHlwZSBUeXBlIG9mIGRhdGEgdG8gYWRkLlxyXG4gICAgICAgICAqIEBwYXJhbSB2YWx1ZSBEYXRhIHRvIGFkZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBEYXRhVHJhbnNmZXIucHJvdG90eXBlLnNldERhdGEgPSBmdW5jdGlvbiAodHlwZSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGF0YVt0eXBlLnRvTG93ZXJDYXNlKCldID0gdmFsdWU7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTZXQgdGhlIGltYWdlIHRvIGJlIHVzZWQgZm9yIGRyYWdnaW5nIGlmIGEgY3VzdG9tIG9uZSBpcyBkZXNpcmVkLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGltZyBBbiBpbWFnZSBlbGVtZW50IHRvIHVzZSBhcyB0aGUgZHJhZyBmZWVkYmFjayBpbWFnZS5cclxuICAgICAgICAgKiBAcGFyYW0gb2Zmc2V0WCBUaGUgaG9yaXpvbnRhbCBvZmZzZXQgd2l0aGluIHRoZSBpbWFnZS5cclxuICAgICAgICAgKiBAcGFyYW0gb2Zmc2V0WSBUaGUgdmVydGljYWwgb2Zmc2V0IHdpdGhpbiB0aGUgaW1hZ2UuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgRGF0YVRyYW5zZmVyLnByb3RvdHlwZS5zZXREcmFnSW1hZ2UgPSBmdW5jdGlvbiAoaW1nLCBvZmZzZXRYLCBvZmZzZXRZKSB7XHJcbiAgICAgICAgICAgIHZhciBkZHQgPSBEcmFnRHJvcFRvdWNoLl9pbnN0YW5jZTtcclxuICAgICAgICAgICAgZGR0Ll9pbWdDdXN0b20gPSBpbWc7XHJcbiAgICAgICAgICAgIGRkdC5faW1nT2Zmc2V0ID0geyB4OiBvZmZzZXRYLCB5OiBvZmZzZXRZIH07XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gRGF0YVRyYW5zZmVyO1xyXG4gICAgfSgpKTtcclxuICAgIERyYWdEcm9wVG91Y2hfMS5EYXRhVHJhbnNmZXIgPSBEYXRhVHJhbnNmZXI7XHJcbiAgICAvKipcclxuICAgICAqIERlZmluZXMgYSBjbGFzcyB0aGF0IGFkZHMgc3VwcG9ydCBmb3IgdG91Y2gtYmFzZWQgSFRNTDUgZHJhZy9kcm9wIG9wZXJhdGlvbnMuXHJcbiAgICAgKlxyXG4gICAgICogVGhlIEBzZWU6RHJhZ0Ryb3BUb3VjaCBjbGFzcyBsaXN0ZW5zIHRvIHRvdWNoIGV2ZW50cyBhbmQgcmFpc2VzIHRoZVxyXG4gICAgICogYXBwcm9wcmlhdGUgSFRNTDUgZHJhZy9kcm9wIGV2ZW50cyBhcyBpZiB0aGUgZXZlbnRzIGhhZCBiZWVuIGNhdXNlZFxyXG4gICAgICogYnkgbW91c2UgYWN0aW9ucy5cclxuICAgICAqXHJcbiAgICAgKiBUaGUgcHVycG9zZSBvZiB0aGlzIGNsYXNzIGlzIHRvIGVuYWJsZSB1c2luZyBleGlzdGluZywgc3RhbmRhcmQgSFRNTDVcclxuICAgICAqIGRyYWcvZHJvcCBjb2RlIG9uIG1vYmlsZSBkZXZpY2VzIHJ1bm5pbmcgSU9TIG9yIEFuZHJvaWQuXHJcbiAgICAgKlxyXG4gICAgICogVG8gdXNlLCBpbmNsdWRlIHRoZSBEcmFnRHJvcFRvdWNoLmpzIGZpbGUgb24gdGhlIHBhZ2UuIFRoZSBjbGFzcyB3aWxsXHJcbiAgICAgKiBhdXRvbWF0aWNhbGx5IHN0YXJ0IG1vbml0b3JpbmcgdG91Y2ggZXZlbnRzIGFuZCB3aWxsIHJhaXNlIHRoZSBIVE1MNVxyXG4gICAgICogZHJhZyBkcm9wIGV2ZW50cyAoZHJhZ3N0YXJ0LCBkcmFnZW50ZXIsIGRyYWdsZWF2ZSwgZHJvcCwgZHJhZ2VuZCkgd2hpY2hcclxuICAgICAqIHNob3VsZCBiZSBoYW5kbGVkIGJ5IHRoZSBhcHBsaWNhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBGb3IgZGV0YWlscyBhbmQgZXhhbXBsZXMgb24gSFRNTCBkcmFnIGFuZCBkcm9wLCBzZWVcclxuICAgICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0d1aWRlL0hUTUwvRHJhZ19vcGVyYXRpb25zLlxyXG4gICAgICovXHJcbiAgICB2YXIgRHJhZ0Ryb3BUb3VjaCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSW5pdGlhbGl6ZXMgdGhlIHNpbmdsZSBpbnN0YW5jZSBvZiB0aGUgQHNlZTpEcmFnRHJvcFRvdWNoIGNsYXNzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIERyYWdEcm9wVG91Y2goKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xhc3RDbGljayA9IDA7XHJcbiAgICAgICAgICAgIC8vIGVuZm9yY2Ugc2luZ2xldG9uIHBhdHRlcm5cclxuICAgICAgICAgICAgaWYgKERyYWdEcm9wVG91Y2guX2luc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyAnRHJhZ0Ryb3BUb3VjaCBpbnN0YW5jZSBhbHJlYWR5IGNyZWF0ZWQuJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBkZXRlY3QgcGFzc2l2ZSBldmVudCBzdXBwb3J0XHJcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9Nb2Rlcm5penIvTW9kZXJuaXpyL2lzc3Vlcy8xODk0XHJcbiAgICAgICAgICAgIHZhciBzdXBwb3J0c1Bhc3NpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndGVzdCcsIGZ1bmN0aW9uICgpIHsgfSwge1xyXG4gICAgICAgICAgICAgICAgZ2V0IHBhc3NpdmUoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VwcG9ydHNQYXNzaXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vIGxpc3RlbiB0byB0b3VjaCBldmVudHNcclxuICAgICAgICAgICAgaWYgKG5hdmlnYXRvci5tYXhUb3VjaFBvaW50cykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGQgPSBkb2N1bWVudCwgXHJcbiAgICAgICAgICAgICAgICAgICAgdHMgPSB0aGlzLl90b3VjaHN0YXJ0LmJpbmQodGhpcyksIFxyXG4gICAgICAgICAgICAgICAgICAgIHRtID0gdGhpcy5fdG91Y2htb3ZlLmJpbmQodGhpcyksIFxyXG4gICAgICAgICAgICAgICAgICAgIHRlID0gdGhpcy5fdG91Y2hlbmQuYmluZCh0aGlzKSwgXHJcbiAgICAgICAgICAgICAgICAgICAgb3B0ID0gc3VwcG9ydHNQYXNzaXZlID8geyBwYXNzaXZlOiBmYWxzZSwgY2FwdHVyZTogZmFsc2UgfSA6IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgZC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdHMsIG9wdCk7XHJcbiAgICAgICAgICAgICAgICBkLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRtLCBvcHQpO1xyXG4gICAgICAgICAgICAgICAgZC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRlKTtcclxuICAgICAgICAgICAgICAgIGQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0cyBhIHJlZmVyZW5jZSB0byB0aGUgQHNlZTpEcmFnRHJvcFRvdWNoIHNpbmdsZXRvbi5cclxuICAgICAgICAgKi9cclxuICAgICAgICBEcmFnRHJvcFRvdWNoLmdldEluc3RhbmNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gRHJhZ0Ryb3BUb3VjaC5faW5zdGFuY2U7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvLyAqKiBldmVudCBoYW5kbGVyc1xyXG4gICAgICAgIERyYWdEcm9wVG91Y2gucHJvdG90eXBlLl90b3VjaHN0YXJ0ID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3Nob3VsZEhhbmRsZShlKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gcmFpc2UgZG91YmxlLWNsaWNrIGFuZCBwcmV2ZW50IHpvb21pbmdcclxuICAgICAgICAgICAgICAgIGlmIChEYXRlLm5vdygpIC0gdGhpcy5fbGFzdENsaWNrIDwgRHJhZ0Ryb3BUb3VjaC5fREJMQ0xJQ0spIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fZGlzcGF0Y2hFdmVudChlLCAnZGJsY2xpY2snLCBlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNldCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gY2xlYXIgYWxsIHZhcmlhYmxlc1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzZXQoKTtcclxuICAgICAgICAgICAgICAgIC8vIGdldCBuZWFyZXN0IGRyYWdnYWJsZSBlbGVtZW50XHJcbiAgICAgICAgICAgICAgICB2YXIgc3JjID0gdGhpcy5fY2xvc2VzdERyYWdnYWJsZShlLnRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3JjKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZ2l2ZSBjYWxsZXIgYSBjaGFuY2UgdG8gaGFuZGxlIHRoZSBob3Zlci9tb3ZlIGV2ZW50c1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fZGlzcGF0Y2hFdmVudChlLCAnbW91c2Vtb3ZlJywgZS50YXJnZXQpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICF0aGlzLl9kaXNwYXRjaEV2ZW50KGUsICdtb3VzZWRvd24nLCBlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IHJlYWR5IHRvIHN0YXJ0IGRyYWdnaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2RyYWdTb3VyY2UgPSBzcmM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3B0RG93biA9IHRoaXMuX2dldFBvaW50KGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sYXN0VG91Y2ggPSBlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNob3cgY29udGV4dCBtZW51IGlmIHRoZSB1c2VyIGhhc24ndCBzdGFydGVkIGRyYWdnaW5nIGFmdGVyIGEgd2hpbGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX3RoaXMuX2RyYWdTb3VyY2UgPT0gc3JjICYmIF90aGlzLl9pbWcgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfdGhpcy5fZGlzcGF0Y2hFdmVudChlLCAnY29udGV4dG1lbnUnLCBzcmMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9yZXNldCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgRHJhZ0Ryb3BUb3VjaC5fQ1RYTUVOVSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChEcmFnRHJvcFRvdWNoLl9JU1BSRVNTSE9MRE1PREUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ByZXNzSG9sZEludGVydmFsID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2lzRHJhZ0VuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl90b3VjaG1vdmUoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBEcmFnRHJvcFRvdWNoLl9QUkVTU0hPTERBV0FJVCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIERyYWdEcm9wVG91Y2gucHJvdG90eXBlLl90b3VjaG1vdmUgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2hvdWxkQ2FuY2VsUHJlc3NIb2xkTW92ZShlKSkge1xyXG4gICAgICAgICAgICAgIHRoaXMuX3Jlc2V0KCk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zaG91bGRIYW5kbGVNb3ZlKGUpIHx8IHRoaXMuX3Nob3VsZEhhbmRsZVByZXNzSG9sZE1vdmUoZSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIHNlZSBpZiB0YXJnZXQgd2FudHMgdG8gaGFuZGxlIG1vdmVcclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLl9nZXRUYXJnZXQoZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZGlzcGF0Y2hFdmVudChlLCAnbW91c2Vtb3ZlJywgdGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RUb3VjaCA9IGU7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIHN0YXJ0IGRyYWdnaW5nXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZHJhZ1NvdXJjZSAmJiAhdGhpcy5faW1nICYmIHRoaXMuX3Nob3VsZFN0YXJ0RHJhZ2dpbmcoZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KGUsICdkcmFnc3RhcnQnLCB0aGlzLl9kcmFnU291cmNlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jcmVhdGVJbWFnZShlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KGUsICdkcmFnZW50ZXInLCB0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gY29udGludWUgZHJhZ2dpbmdcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pbWcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sYXN0VG91Y2ggPSBlO1xyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTsgLy8gcHJldmVudCBzY3JvbGxpbmdcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KGUsICdkcmFnJywgdGhpcy5fZHJhZ1NvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldCAhPSB0aGlzLl9sYXN0VGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQodGhpcy5fbGFzdFRvdWNoLCAnZHJhZ2xlYXZlJywgdGhpcy5fbGFzdFRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoZSwgJ2RyYWdlbnRlcicsIHRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RUYXJnZXQgPSB0YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21vdmVJbWFnZShlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pc0Ryb3Bab25lID0gdGhpcy5fZGlzcGF0Y2hFdmVudChlLCAnZHJhZ292ZXInLCB0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBEcmFnRHJvcFRvdWNoLnByb3RvdHlwZS5fdG91Y2hlbmQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2hvdWxkSGFuZGxlKGUpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBzZWUgaWYgdGFyZ2V0IHdhbnRzIHRvIGhhbmRsZSB1cFxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2Rpc3BhdGNoRXZlbnQodGhpcy5fbGFzdFRvdWNoLCAnbW91c2V1cCcsIGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyB1c2VyIGNsaWNrZWQgdGhlIGVsZW1lbnQgYnV0IGRpZG4ndCBkcmFnLCBzbyBjbGVhciB0aGUgc291cmNlIGFuZCBzaW11bGF0ZSBhIGNsaWNrXHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2ltZykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RyYWdTb3VyY2UgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQodGhpcy5fbGFzdFRvdWNoLCAnY2xpY2snLCBlLnRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGFzdENsaWNrID0gRGF0ZS5ub3coKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGZpbmlzaCBkcmFnZ2luZ1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVzdHJveUltYWdlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZHJhZ1NvdXJjZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlLnR5cGUuaW5kZXhPZignY2FuY2VsJykgPCAwICYmIHRoaXMuX2lzRHJvcFpvbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudCh0aGlzLl9sYXN0VG91Y2gsICdkcm9wJywgdGhpcy5fbGFzdFRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQodGhpcy5fbGFzdFRvdWNoLCAnZHJhZ2VuZCcsIHRoaXMuX2RyYWdTb3VyY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vICoqIHV0aWxpdGllc1xyXG4gICAgICAgIC8vIGlnbm9yZSBldmVudHMgdGhhdCBoYXZlIGJlZW4gaGFuZGxlZCBvciB0aGF0IGludm9sdmUgbW9yZSB0aGFuIG9uZSB0b3VjaFxyXG4gICAgICAgIERyYWdEcm9wVG91Y2gucHJvdG90eXBlLl9zaG91bGRIYW5kbGUgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZSAmJlxyXG4gICAgICAgICAgICAgICAgIWUuZGVmYXVsdFByZXZlbnRlZCAmJlxyXG4gICAgICAgICAgICAgICAgZS50b3VjaGVzICYmIGUudG91Y2hlcy5sZW5ndGggPCAyO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIHVzZSByZWd1bGFyIGNvbmRpdGlvbiBvdXRzaWRlIG9mIHByZXNzICYgaG9sZCBtb2RlXHJcbiAgICAgICAgRHJhZ0Ryb3BUb3VjaC5wcm90b3R5cGUuX3Nob3VsZEhhbmRsZU1vdmUgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgcmV0dXJuICFEcmFnRHJvcFRvdWNoLl9JU1BSRVNTSE9MRE1PREUgJiYgdGhpcy5fc2hvdWxkSGFuZGxlKGUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIGFsbG93IHRvIGhhbmRsZSBtb3ZlcyB0aGF0IGludm9sdmUgbWFueSB0b3VjaGVzIGZvciBwcmVzcyAmIGhvbGRcclxuICAgICAgICBEcmFnRHJvcFRvdWNoLnByb3RvdHlwZS5fc2hvdWxkSGFuZGxlUHJlc3NIb2xkTW92ZSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICByZXR1cm4gRHJhZ0Ryb3BUb3VjaC5fSVNQUkVTU0hPTERNT0RFICYmXHJcbiAgICAgICAgICAgICAgdGhpcy5faXNEcmFnRW5hYmxlZCAmJiBlICYmIGUudG91Y2hlcyAmJiBlLnRvdWNoZXMubGVuZ3RoO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIHJlc2V0IGRhdGEgaWYgdXNlciBkcmFncyB3aXRob3V0IHByZXNzaW5nICYgaG9sZGluZ1xyXG4gICAgICAgIERyYWdEcm9wVG91Y2gucHJvdG90eXBlLl9zaG91bGRDYW5jZWxQcmVzc0hvbGRNb3ZlID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgIHJldHVybiBEcmFnRHJvcFRvdWNoLl9JU1BSRVNTSE9MRE1PREUgJiYgIXRoaXMuX2lzRHJhZ0VuYWJsZWQgJiZcclxuICAgICAgICAgICAgICB0aGlzLl9nZXREZWx0YShlKSA+IERyYWdEcm9wVG91Y2guX1BSRVNTSE9MRE1BUkdJTjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBzdGFydCBkcmFnZ2luZyB3aGVuIHNwZWNpZmllZCBkZWx0YSBpcyBkZXRlY3RlZFxyXG4gICAgICAgIERyYWdEcm9wVG91Y2gucHJvdG90eXBlLl9zaG91bGRTdGFydERyYWdnaW5nID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgdmFyIGRlbHRhID0gdGhpcy5fZ2V0RGVsdGEoZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWx0YSA+IERyYWdEcm9wVG91Y2guX1RIUkVTSE9MRCB8fFxyXG4gICAgICAgICAgICAgICAgKERyYWdEcm9wVG91Y2guX0lTUFJFU1NIT0xETU9ERSAmJiBkZWx0YSA+PSBEcmFnRHJvcFRvdWNoLl9QUkVTU0hPTERUSFJFU0hPTEQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY2xlYXIgYWxsIG1lbWJlcnNcclxuICAgICAgICBEcmFnRHJvcFRvdWNoLnByb3RvdHlwZS5fcmVzZXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rlc3Ryb3lJbWFnZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9kcmFnU291cmNlID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5fbGFzdFRvdWNoID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5fbGFzdFRhcmdldCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX3B0RG93biA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzRHJhZ0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5faXNEcm9wWm9uZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLl9kYXRhVHJhbnNmZXIgPSBuZXcgRGF0YVRyYW5zZmVyKCk7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fcHJlc3NIb2xkSW50ZXJ2YWwpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gZ2V0IHBvaW50IGZvciBhIHRvdWNoIGV2ZW50XHJcbiAgICAgICAgRHJhZ0Ryb3BUb3VjaC5wcm90b3R5cGUuX2dldFBvaW50ID0gZnVuY3Rpb24gKGUsIHBhZ2UpIHtcclxuICAgICAgICAgICAgaWYgKGUgJiYgZS50b3VjaGVzKSB7XHJcbiAgICAgICAgICAgICAgICBlID0gZS50b3VjaGVzWzBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB7IHg6IHBhZ2UgPyBlLnBhZ2VYIDogZS5jbGllbnRYLCB5OiBwYWdlID8gZS5wYWdlWSA6IGUuY2xpZW50WSB9O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gZ2V0IGRpc3RhbmNlIGJldHdlZW4gdGhlIGN1cnJlbnQgdG91Y2ggZXZlbnQgYW5kIHRoZSBmaXJzdCBvbmVcclxuICAgICAgICBEcmFnRHJvcFRvdWNoLnByb3RvdHlwZS5fZ2V0RGVsdGEgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBpZiAoRHJhZ0Ryb3BUb3VjaC5fSVNQUkVTU0hPTERNT0RFICYmICF0aGlzLl9wdERvd24pIHsgcmV0dXJuIDA7IH1cclxuICAgICAgICAgICAgdmFyIHAgPSB0aGlzLl9nZXRQb2ludChlKTtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguYWJzKHAueCAtIHRoaXMuX3B0RG93bi54KSArIE1hdGguYWJzKHAueSAtIHRoaXMuX3B0RG93bi55KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIGdldCB0aGUgZWxlbWVudCBhdCBhIGdpdmVuIHRvdWNoIGV2ZW50XHJcbiAgICAgICAgRHJhZ0Ryb3BUb3VjaC5wcm90b3R5cGUuX2dldFRhcmdldCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIHZhciBwdCA9IHRoaXMuX2dldFBvaW50KGUpLCBlbCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQocHQueCwgcHQueSk7XHJcbiAgICAgICAgICAgIHdoaWxlIChlbCAmJiBnZXRDb21wdXRlZFN0eWxlKGVsKS5wb2ludGVyRXZlbnRzID09ICdub25lJykge1xyXG4gICAgICAgICAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBlbDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIGNyZWF0ZSBkcmFnIGltYWdlIGZyb20gc291cmNlIGVsZW1lbnRcclxuICAgICAgICBEcmFnRHJvcFRvdWNoLnByb3RvdHlwZS5fY3JlYXRlSW1hZ2UgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAvLyBqdXN0IGluIGNhc2UuLi5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2ltZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVzdHJveUltYWdlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gY3JlYXRlIGRyYWcgaW1hZ2UgZnJvbSBjdXN0b20gZWxlbWVudCBvciBkcmFnIHNvdXJjZVxyXG4gICAgICAgICAgICB2YXIgc3JjID0gdGhpcy5faW1nQ3VzdG9tIHx8IHRoaXMuX2RyYWdTb3VyY2U7XHJcbiAgICAgICAgICAgIHRoaXMuX2ltZyA9IHNyYy5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvcHlTdHlsZShzcmMsIHRoaXMuX2ltZyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2ltZy5zdHlsZS50b3AgPSB0aGlzLl9pbWcuc3R5bGUubGVmdCA9ICctOTk5OXB4JztcclxuICAgICAgICAgICAgLy8gaWYgY3JlYXRpbmcgZnJvbSBkcmFnIHNvdXJjZSwgYXBwbHkgb2Zmc2V0IGFuZCBvcGFjaXR5XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5faW1nQ3VzdG9tKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmMgPSBzcmMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksIHB0ID0gdGhpcy5fZ2V0UG9pbnQoZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pbWdPZmZzZXQgPSB7IHg6IHB0LnggLSByYy5sZWZ0LCB5OiBwdC55IC0gcmMudG9wIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pbWcuc3R5bGUub3BhY2l0eSA9IERyYWdEcm9wVG91Y2guX09QQUNJVFkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBhZGQgaW1hZ2UgdG8gZG9jdW1lbnRcclxuICAgICAgICAgICAgdGhpcy5fbW92ZUltYWdlKGUpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuX2ltZyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvLyBkaXNwb3NlIG9mIGRyYWcgaW1hZ2UgZWxlbWVudFxyXG4gICAgICAgIERyYWdEcm9wVG91Y2gucHJvdG90eXBlLl9kZXN0cm95SW1hZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pbWcgJiYgdGhpcy5faW1nLnBhcmVudEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ltZy5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuX2ltZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5faW1nID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5faW1nQ3VzdG9tID0gbnVsbDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIG1vdmUgdGhlIGRyYWcgaW1hZ2UgZWxlbWVudFxyXG4gICAgICAgIERyYWdEcm9wVG91Y2gucHJvdG90eXBlLl9tb3ZlSW1hZ2UgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLl9pbWcpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcHQgPSBfdGhpcy5fZ2V0UG9pbnQoZSwgdHJ1ZSksIHMgPSBfdGhpcy5faW1nLnN0eWxlO1xyXG4gICAgICAgICAgICAgICAgICAgIHMucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gICAgICAgICAgICAgICAgICAgIHMucG9pbnRlckV2ZW50cyA9ICdub25lJztcclxuICAgICAgICAgICAgICAgICAgICBzLnpJbmRleCA9ICc5OTk5OTknO1xyXG4gICAgICAgICAgICAgICAgICAgIHMubGVmdCA9IE1hdGgucm91bmQocHQueCAtIF90aGlzLl9pbWdPZmZzZXQueCkgKyAncHgnO1xyXG4gICAgICAgICAgICAgICAgICAgIHMudG9wID0gTWF0aC5yb3VuZChwdC55IC0gX3RoaXMuX2ltZ09mZnNldC55KSArICdweCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gY29weSBwcm9wZXJ0aWVzIGZyb20gYW4gb2JqZWN0IHRvIGFub3RoZXJcclxuICAgICAgICBEcmFnRHJvcFRvdWNoLnByb3RvdHlwZS5fY29weVByb3BzID0gZnVuY3Rpb24gKGRzdCwgc3JjLCBwcm9wcykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcCA9IHByb3BzW2ldO1xyXG4gICAgICAgICAgICAgICAgZHN0W3BdID0gc3JjW3BdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBEcmFnRHJvcFRvdWNoLnByb3RvdHlwZS5fY29weVN0eWxlID0gZnVuY3Rpb24gKHNyYywgZHN0KSB7XHJcbiAgICAgICAgICAgIC8vIHJlbW92ZSBwb3RlbnRpYWxseSB0cm91Ymxlc29tZSBhdHRyaWJ1dGVzXHJcbiAgICAgICAgICAgIERyYWdEcm9wVG91Y2guX3JtdkF0dHMuZm9yRWFjaChmdW5jdGlvbiAoYXR0KSB7XHJcbiAgICAgICAgICAgICAgICBkc3QucmVtb3ZlQXR0cmlidXRlKGF0dCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvLyBjb3B5IGNhbnZhcyBjb250ZW50XHJcbiAgICAgICAgICAgIGlmIChzcmMgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNTcmMgPSBzcmMsIGNEc3QgPSBkc3Q7XHJcbiAgICAgICAgICAgICAgICBjRHN0LndpZHRoID0gY1NyYy53aWR0aDtcclxuICAgICAgICAgICAgICAgIGNEc3QuaGVpZ2h0ID0gY1NyYy5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBjRHN0LmdldENvbnRleHQoJzJkJykuZHJhd0ltYWdlKGNTcmMsIDAsIDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNvcHkgc3R5bGUgKHdpdGhvdXQgdHJhbnNpdGlvbnMpXHJcbiAgICAgICAgICAgIHZhciBjcyA9IGdldENvbXB1dGVkU3R5bGUoc3JjKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IGNzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleS5pbmRleE9mKCd0cmFuc2l0aW9uJykgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZHN0LnN0eWxlW2tleV0gPSBjc1trZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRzdC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xyXG4gICAgICAgICAgICAvLyBhbmQgcmVwZWF0IGZvciBhbGwgY2hpbGRyZW5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcmMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvcHlTdHlsZShzcmMuY2hpbGRyZW5baV0sIGRzdC5jaGlsZHJlbltpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIERyYWdEcm9wVG91Y2gucHJvdG90eXBlLl9kaXNwYXRjaEV2ZW50ID0gZnVuY3Rpb24gKGUsIHR5cGUsIHRhcmdldCkge1xyXG4gICAgICAgICAgICBpZiAoZSAmJiB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKSwgdCA9IGUudG91Y2hlcyA/IGUudG91Y2hlc1swXSA6IGU7XHJcbiAgICAgICAgICAgICAgICBldnQuaW5pdEV2ZW50KHR5cGUsIHRydWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgZXZ0LmJ1dHRvbiA9IDA7XHJcbiAgICAgICAgICAgICAgICBldnQud2hpY2ggPSBldnQuYnV0dG9ucyA9IDE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb3B5UHJvcHMoZXZ0LCBlLCBEcmFnRHJvcFRvdWNoLl9rYmRQcm9wcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb3B5UHJvcHMoZXZ0LCB0LCBEcmFnRHJvcFRvdWNoLl9wdFByb3BzKTtcclxuICAgICAgICAgICAgICAgIGV2dC5kYXRhVHJhbnNmZXIgPSB0aGlzLl9kYXRhVHJhbnNmZXI7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudChldnQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGV2dC5kZWZhdWx0UHJldmVudGVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIGdldHMgYW4gZWxlbWVudCdzIGNsb3Nlc3QgZHJhZ2dhYmxlIGFuY2VzdG9yXHJcbiAgICAgICAgRHJhZ0Ryb3BUb3VjaC5wcm90b3R5cGUuX2Nsb3Nlc3REcmFnZ2FibGUgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBmb3IgKDsgZTsgZSA9IGUucGFyZW50RWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGUuaGFzQXR0cmlidXRlKCdkcmFnZ2FibGUnKSAmJiBlLmRyYWdnYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIERyYWdEcm9wVG91Y2g7XHJcbiAgICB9KCkpO1xyXG4gICAgLypwcml2YXRlKi8gRHJhZ0Ryb3BUb3VjaC5faW5zdGFuY2UgPSBuZXcgRHJhZ0Ryb3BUb3VjaCgpOyAvLyBzaW5nbGV0b25cclxuICAgIC8vIGNvbnN0YW50c1xyXG4gICAgRHJhZ0Ryb3BUb3VjaC5fVEhSRVNIT0xEID0gNTsgLy8gcGl4ZWxzIHRvIG1vdmUgYmVmb3JlIGRyYWcgc3RhcnRzXHJcbiAgICBEcmFnRHJvcFRvdWNoLl9PUEFDSVRZID0gMC41OyAvLyBkcmFnIGltYWdlIG9wYWNpdHlcclxuICAgIERyYWdEcm9wVG91Y2guX0RCTENMSUNLID0gNTAwOyAvLyBtYXggbXMgYmV0d2VlbiBjbGlja3MgaW4gYSBkb3VibGUgY2xpY2tcclxuICAgIERyYWdEcm9wVG91Y2guX0NUWE1FTlUgPSA5MDA7IC8vIG1zIHRvIGhvbGQgYmVmb3JlIHJhaXNpbmcgJ2NvbnRleHRtZW51JyBldmVudFxyXG4gICAgRHJhZ0Ryb3BUb3VjaC5fSVNQUkVTU0hPTERNT0RFID0gZmFsc2U7IC8vIGRlY2lkZXMgb2YgcHJlc3MgJiBob2xkIG1vZGUgcHJlc2VuY2VcclxuICAgIERyYWdEcm9wVG91Y2guX1BSRVNTSE9MREFXQUlUID0gNDAwOyAvLyBtcyB0byB3YWl0IGJlZm9yZSBwcmVzcyAmIGhvbGQgaXMgZGV0ZWN0ZWRcclxuICAgIERyYWdEcm9wVG91Y2guX1BSRVNTSE9MRE1BUkdJTiA9IDI1OyAvLyBwaXhlbHMgdGhhdCBmaW5nZXIgbWlnaHQgc2hpdmVyIHdoaWxlIHByZXNzaW5nXHJcbiAgICBEcmFnRHJvcFRvdWNoLl9QUkVTU0hPTERUSFJFU0hPTEQgPSAwOyAvLyBwaXhlbHMgdG8gbW92ZSBiZWZvcmUgZHJhZyBzdGFydHNcclxuICAgIC8vIGNvcHkgc3R5bGVzL2F0dHJpYnV0ZXMgZnJvbSBkcmFnIHNvdXJjZSB0byBkcmFnIGltYWdlIGVsZW1lbnRcclxuICAgIERyYWdEcm9wVG91Y2guX3JtdkF0dHMgPSAnaWQsY2xhc3Msc3R5bGUsZHJhZ2dhYmxlJy5zcGxpdCgnLCcpO1xyXG4gICAgLy8gc3ludGhlc2l6ZSBhbmQgZGlzcGF0Y2ggYW4gZXZlbnRcclxuICAgIC8vIHJldHVybnMgdHJ1ZSBpZiB0aGUgZXZlbnQgaGFzIGJlZW4gaGFuZGxlZCAoZS5wcmV2ZW50RGVmYXVsdCA9PSB0cnVlKVxyXG4gICAgRHJhZ0Ryb3BUb3VjaC5fa2JkUHJvcHMgPSAnYWx0S2V5LGN0cmxLZXksbWV0YUtleSxzaGlmdEtleScuc3BsaXQoJywnKTtcclxuICAgIERyYWdEcm9wVG91Y2guX3B0UHJvcHMgPSAncGFnZVgscGFnZVksY2xpZW50WCxjbGllbnRZLHNjcmVlblgsc2NyZWVuWSxvZmZzZXRYLG9mZnNldFknLnNwbGl0KCcsJyk7XHJcbiAgICBEcmFnRHJvcFRvdWNoXzEuRHJhZ0Ryb3BUb3VjaCA9IERyYWdEcm9wVG91Y2g7XHJcbn0pKERyYWdEcm9wVG91Y2ggfHwgKERyYWdEcm9wVG91Y2ggPSB7fSkpO1xyXG4iLCIkLmkxOG4oKS5sb2FkKHtcbiAgICBlbjoge1xuICAgICAgICBtc2dfZHJhZ25kcm9wX2NvcnJlY3RfYW5zd2VyOiBcIllvdSBhcmUgY29ycmVjdCFcIixcbiAgICAgICAgbXNnX2RyYWduZHJvcF9pbmNvcnJlY3RfYW5zd2VyOlxuICAgICAgICAgICAgXCJJbmNvcnJldC4gWW91IGdvdCAkMSBjb3JyZWN0IGFuZCAkMiBpbmNvcnJlY3Qgb3V0IG9mICQzLiBZb3UgbGVmdCAkNCBibGFuay5cIixcbiAgICAgICAgbXNnX2RyYWduZHJvcF9jaGVja19tZTogXCJDaGVjayBtZVwiLFxuICAgICAgICBtc2dfZHJhZ25kcm9wX3Jlc2V0OiBcIlJlc2V0XCIsXG4gICAgfSxcbn0pO1xuIiwiJC5pMThuKCkubG9hZCh7XG4gICAgXCJwdC1iclwiOiB7XG4gICAgICAgIG1zZ19kcmFnbmRyb3BfY29ycmVjdF9hbnN3ZXI6IFwiQ29ycmV0byFcIixcbiAgICAgICAgbXNnX2RyYWduZHJvcF9pbmNvcnJlY3RfYW5zd2VyOlxuICAgICAgICAgICAgXCJJbmNvcnJldG8uIFZvY8OqIHRldmUgJDEgY29ycmV0byhzKSBlICQyIGluY29ycmV0byhzKSBkZSAkMy4gVm9jw6ogZGVpeG91ICQ0IGVtIGJyYW5jby5cIixcbiAgICAgICAgbXNnX2RyYWduZHJvcF9jaGVja19tZTogXCJWZXJpZmljYXJcIixcbiAgICAgICAgbXNnX2RyYWduZHJvcF9yZXNldDogXCJSZXNldGFyXCIsXG4gICAgfSxcbn0pO1xuIiwiLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT0gICAgIE1hc3RlciBkcmFnbmRyb3AuanMgICAgID09PT09PT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09ICAgICBUaGlzIGZpbGUgY29udGFpbnMgdGhlIEpTIGZvciAgICA9PT1cbj09PSB0aGUgUnVuZXN0b25lIERyYWcgbiBkcm9wIGNvbXBvbmVudC4gPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09ICAgICAgICAgICAgICBDcmVhdGVkIGJ5ICAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgSXNhaWFoIE1heWVyY2hhayAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgICAgICAgNy82LzE1ICAgICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgICBCcmFkIE1JbGxlciAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgICAyLzcvMTkgICAgICAgICAgICAgICAgPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qc1wiO1xuaW1wb3J0IFwiLi4vY3NzL2RyYWduZHJvcC5jc3NcIjtcbmltcG9ydCBcIi4vZHJhZ25kcm9wLWkxOG4uZW4uanNcIjtcbmltcG9ydCBcIi4vZHJhZ25kcm9wLWkxOG4ucHQtYnIuanNcIjtcbmltcG9ydCBcIi4vRHJhZ0Ryb3BUb3VjaC5qc1wiO1xuXG5leHBvcnQgdmFyIGRkTGlzdCA9IHt9OyAvLyBEaWN0aW9uYXJ5IHRoYXQgY29udGFpbnMgYWxsIGluc3RhbmNlcyBvZiBkcmFnbmRyb3Agb2JqZWN0c1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEcmFnTkRyb3AgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB2YXIgb3JpZyA9IG9wdHMub3JpZzsgLy8gZW50aXJlIDx1bD4gZWxlbWVudCB0aGF0IHdpbGwgYmUgcmVwbGFjZWQgYnkgbmV3IEhUTUxcbiAgICAgICAgdGhpcy5vcmlnRWxlbSA9IG9yaWc7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcmlnLmlkO1xuICAgICAgICB0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzID0gb3B0cy51c2VSdW5lc3RvbmVTZXJ2aWNlcztcbiAgICAgICAgdGhpcy5yYW5kb20gPSBmYWxzZTtcbiAgICAgICAgaWYgKCQodGhpcy5vcmlnRWxlbSkuaXMoXCJbZGF0YS1yYW5kb21dXCIpKSB7XG4gICAgICAgICAgICB0aGlzLnJhbmRvbSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mZWVkYmFjayA9IFwiXCI7XG4gICAgICAgIHRoaXMuZHJhZ1BhaXJBcnJheSA9IFtdO1xuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gXCJcIjtcbiAgICAgICAgdGhpcy5wb3B1bGF0ZSgpOyAvLyBQb3B1bGF0ZXMgdGhpcy5kcmFnUGFpckFycmF5LCB0aGlzLmZlZWRiYWNrIGFuZCB0aGlzLnF1ZXN0aW9uXG4gICAgICAgIHRoaXMuY3JlYXRlTmV3RWxlbWVudHMoKTtcbiAgICAgICAgdGhpcy5jYXB0aW9uID0gXCJEcmFnLU4tRHJvcFwiO1xuICAgICAgICB0aGlzLmFkZENhcHRpb24oXCJydW5lc3RvbmVcIik7XG4gICAgICAgIGlmICh0eXBlb2YgUHJpc20gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIFByaXNtLmhpZ2hsaWdodEFsbFVuZGVyKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT0gVXBkYXRlIHZhcmlhYmxlcyA9PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICBwb3B1bGF0ZSgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9yaWdFbGVtLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAkKHRoaXMub3JpZ0VsZW0uY2hpbGROb2Rlc1tpXSkuZGF0YShcInN1YmNvbXBvbmVudFwiKSA9PT1cbiAgICAgICAgICAgICAgICBcImRyb3B6b25lXCJcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHZhciB0bXAgPSAkKHRoaXMub3JpZ0VsZW0pLmZpbmQoXG4gICAgICAgICAgICAgICAgICAgIGAjJHskKHRoaXMub3JpZ0VsZW0uY2hpbGROb2Rlc1tpXSkuYXR0cihcImZvclwiKX1gXG4gICAgICAgICAgICAgICAgKVswXTtcbiAgICAgICAgICAgICAgICB2YXIgcmVwbGFjZVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgICAgICByZXBsYWNlU3Bhbi5pbm5lckhUTUwgPSB0bXAuaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgIHJlcGxhY2VTcGFuLmlkID0gdGhpcy5kaXZpZCArIHRtcC5pZDtcbiAgICAgICAgICAgICAgICAkKHJlcGxhY2VTcGFuKS5hdHRyKFwiZHJhZ2dhYmxlXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAgICAgICAkKHJlcGxhY2VTcGFuKS5hZGRDbGFzcyhcImRyYWdnYWJsZS1kcmFnXCIpO1xuICAgICAgICAgICAgICAgIHZhciBvdGhlclJlcGxhY2VTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICAgICAgb3RoZXJSZXBsYWNlU3Bhbi5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9yaWdFbGVtLmNoaWxkTm9kZXNbaV0uaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgICQob3RoZXJSZXBsYWNlU3BhbikuYWRkQ2xhc3MoXCJkcmFnZ2FibGUtZHJvcFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEV2ZW50TGlzdGVuZXJzKHJlcGxhY2VTcGFuLCBvdGhlclJlcGxhY2VTcGFuKTtcbiAgICAgICAgICAgICAgICB2YXIgdG1wQXJyID0gW107XG4gICAgICAgICAgICAgICAgdG1wQXJyLnB1c2gocmVwbGFjZVNwYW4pO1xuICAgICAgICAgICAgICAgIHRtcEFyci5wdXNoKG90aGVyUmVwbGFjZVNwYW4pO1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1BhaXJBcnJheS5wdXNoKHRtcEFycik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICQodGhpcy5vcmlnRWxlbS5jaGlsZE5vZGVzW2ldKS5kYXRhKFwic3ViY29tcG9uZW50XCIpID09PVxuICAgICAgICAgICAgICAgIFwicXVlc3Rpb25cIlxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvbiA9IHRoaXMub3JpZ0VsZW0uY2hpbGROb2Rlc1tpXS5pbm5lckhUTUw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICQodGhpcy5vcmlnRWxlbS5jaGlsZE5vZGVzW2ldKS5kYXRhKFwic3ViY29tcG9uZW50XCIpID09PVxuICAgICAgICAgICAgICAgIFwiZmVlZGJhY2tcIlxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkYmFjayA9IHRoaXMub3JpZ0VsZW0uY2hpbGROb2Rlc1tpXS5pbm5lckhUTUw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT0gQ3JlYXRlIG5ldyBIVE1MIGVsZW1lbnRzIGFuZCByZXBsYWNlID09XG4gICAgPT0gICAgICBvcmlnaW5hbCBlbGVtZW50IHdpdGggdGhlbSAgICAgID09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgY3JlYXRlTmV3RWxlbWVudHMoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICAkKHRoaXMuY29udGFpbmVyRGl2KS5hZGRDbGFzcyhcImRyYWdnYWJsZS1jb250YWluZXJcIik7XG4gICAgICAgICQodGhpcy5jb250YWluZXJEaXYpLmh0bWwodGhpcy5xdWVzdGlvbik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJiclwiKSk7XG4gICAgICAgIHRoaXMuZHJhZ0Ryb3BXcmFwRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTsgLy8gSG9sZHMgdGhlIGRyYWdnYWJsZXMvZHJvcHpvbmVzLCBwcmV2ZW50cyBmZWVkYmFjayBmcm9tIGJsZWVkaW5nIGluXG4gICAgICAgICQodGhpcy5kcmFnRHJvcFdyYXBEaXYpLmNzcyhcImRpc3BsYXlcIiwgXCJibG9ja1wiKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5kcmFnRHJvcFdyYXBEaXYpO1xuICAgICAgICB0aGlzLmRyYWdnYWJsZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICQodGhpcy5kcmFnZ2FibGVEaXYpLmFkZENsYXNzKFwicnNkcmFnZ2FibGUgZHJhZ3pvbmVcIik7XG4gICAgICAgIHRoaXMuYWRkRHJhZ0Rpdkxpc3RlbmVycygpO1xuICAgICAgICB0aGlzLmRyb3Bab25lRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgJCh0aGlzLmRyb3Bab25lRGl2KS5hZGRDbGFzcyhcInJzZHJhZ2dhYmxlXCIpO1xuICAgICAgICB0aGlzLmRyYWdEcm9wV3JhcERpdi5hcHBlbmRDaGlsZCh0aGlzLmRyYWdnYWJsZURpdik7XG4gICAgICAgIHRoaXMuZHJhZ0Ryb3BXcmFwRGl2LmFwcGVuZENoaWxkKHRoaXMuZHJvcFpvbmVEaXYpO1xuICAgICAgICB0aGlzLmNyZWF0ZUJ1dHRvbnMoKTtcbiAgICAgICAgdGhpcy5jaGVja1NlcnZlcihcImRyYWdOZHJvcFwiLCB0cnVlKTtcbiAgICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYucXVldWVNYXRoSmF4KHNlbGYuY29udGFpbmVyRGl2KTtcblxuICAgIH1cbiAgICBmaW5pc2hTZXR0aW5nVXAoKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kUmVwbGFjZW1lbnRTcGFucygpO1xuICAgICAgICB0aGlzLnJlbmRlckZlZWRiYWNrRGl2KCk7XG4gICAgICAgICQodGhpcy5vcmlnRWxlbSkucmVwbGFjZVdpdGgodGhpcy5jb250YWluZXJEaXYpO1xuICAgICAgICBpZiAoIXRoaXMuaGFzU3RvcmVkRHJvcHpvbmVzKSB7XG4gICAgICAgICAgICB0aGlzLm1pbmhlaWdodCA9ICQodGhpcy5kcmFnZ2FibGVEaXYpLmhlaWdodCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LnN0eWxlLm1pbkhlaWdodCA9IHRoaXMubWluaGVpZ2h0LnRvU3RyaW5nKCkgKyBcInB4XCI7XG4gICAgICAgIGlmICgkKHRoaXMuZHJvcFpvbmVEaXYpLmhlaWdodCgpID4gdGhpcy5taW5oZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0Ryb3BXcmFwRGl2LnN0eWxlLm1pbkhlaWdodCA9XG4gICAgICAgICAgICAgICAgJCh0aGlzLmRyb3Bab25lRGl2KS5oZWlnaHQoKS50b1N0cmluZygpICsgXCJweFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kcmFnRHJvcFdyYXBEaXYuc3R5bGUubWluSGVpZ2h0ID1cbiAgICAgICAgICAgICAgICB0aGlzLm1pbmhlaWdodC50b1N0cmluZygpICsgXCJweFwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFkZERyYWdEaXZMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiZHJhZ292ZXJcIixcbiAgICAgICAgICAgIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcy5kcmFnZ2FibGVEaXYpLmhhc0NsYXNzKFwicG9zc2libGVEcm9wXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJCh0aGlzLmRyYWdnYWJsZURpdikuYWRkQ2xhc3MoXCJwb3NzaWJsZURyb3BcIik7XG4gICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiZHJvcFwiLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5pc0Fuc3dlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMuZHJhZ2dhYmxlRGl2KS5oYXNDbGFzcyhcInBvc3NpYmxlRHJvcFwiKSkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMuZHJhZ2dhYmxlRGl2KS5yZW1vdmVDbGFzcyhcInBvc3NpYmxlRHJvcFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBldi5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImRyYWdnYWJsZUlEXCIpO1xuICAgICAgICAgICAgICAgIHZhciBkcmFnZ2VkU3BhbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRhdGEpO1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgISQodGhpcy5kcmFnZ2FibGVEaXYpLmhhcyhkcmFnZ2VkU3BhbikubGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgICAgICF0aGlzLnN0cmFuZ2VyRGFuZ2VyKGRyYWdnZWRTcGFuKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgZWxlbWVudCBpc24ndCBhbHJlYWR5IHRoZXJlLS1wcmV2ZW50cyBlcnJvcyB3L2FwcGVuZGluZyBjaGlsZFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdnYWJsZURpdi5hcHBlbmRDaGlsZChkcmFnZ2VkU3Bhbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcImRyYWdsZWF2ZVwiLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoISQodGhpcy5kcmFnZ2FibGVEaXYpLmhhc0NsYXNzKFwicG9zc2libGVEcm9wXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJCh0aGlzLmRyYWdnYWJsZURpdikucmVtb3ZlQ2xhc3MoXCJwb3NzaWJsZURyb3BcIik7XG4gICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICB9XG4gICAgY3JlYXRlQnV0dG9ucygpIHtcbiAgICAgICAgdGhpcy5idXR0b25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7IC8vIENoZWNrIG1lIGJ1dHRvblxuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi50ZXh0Q29udGVudCA9ICQuaTE4bihcIm1zZ19kcmFnbmRyb3BfY2hlY2tfbWVcIik7XG4gICAgICAgICQodGhpcy5zdWJtaXRCdXR0b24pLmF0dHIoe1xuICAgICAgICAgICAgY2xhc3M6IFwiYnRuIGJ0bi1zdWNjZXNzIGRyYWctYnV0dG9uXCIsXG4gICAgICAgICAgICBuYW1lOiBcImRvIGFuc3dlclwiLFxuICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIixcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrQ3VycmVudEFuc3dlcigpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJGZWVkYmFjaygpO1xuICAgICAgICAgICAgdGhpcy5sb2dDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5yZXNldEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7IC8vIENoZWNrIG1lIGJ1dHRvblxuICAgICAgICB0aGlzLnJlc2V0QnV0dG9uLnRleHRDb250ZW50ID0gJC5pMThuKFwibXNnX2RyYWduZHJvcF9yZXNldFwiKTtcbiAgICAgICAgJCh0aGlzLnJlc2V0QnV0dG9uKS5hdHRyKHtcbiAgICAgICAgICAgIGNsYXNzOiBcImJ0biBidG4tZGVmYXVsdCBkcmFnLWJ1dHRvbiBkcmFnLXJlc2V0XCIsXG4gICAgICAgICAgICBuYW1lOiBcImRvIGFuc3dlclwiLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZXNldEJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5yZXNldERyYWdnYWJsZXMoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmJ1dHRvbkRpdi5hcHBlbmRDaGlsZCh0aGlzLnN1Ym1pdEJ1dHRvbik7XG4gICAgICAgIHRoaXMuYnV0dG9uRGl2LmFwcGVuZENoaWxkKHRoaXMucmVzZXRCdXR0b24pO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmJ1dHRvbkRpdik7XG4gICAgfVxuICAgIGFwcGVuZFJlcGxhY2VtZW50U3BhbnMoKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlSW5kZXhBcnJheSgpO1xuICAgICAgICB0aGlzLnJhbmRvbWl6ZUluZGV4QXJyYXkoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmRyYWdQYWlyQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc1N0b3JlZERyb3B6b25lcykge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgJC5pbkFycmF5KHRoaXMuaW5kZXhBcnJheVtpXVswXSwgdGhpcy5wcmVnbmFudEluZGV4QXJyYXkpIDxcbiAgICAgICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdnYWJsZURpdi5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1BhaXJBcnJheVt0aGlzLmluZGV4QXJyYXlbaV1dWzBdXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdnYWJsZURpdi5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnUGFpckFycmF5W3RoaXMuaW5kZXhBcnJheVtpXV1bMF1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucmFuZG9taXplSW5kZXhBcnJheSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZHJhZ1BhaXJBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuaGFzU3RvcmVkRHJvcHpvbmVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJlZ25hbnRJbmRleEFycmF5W3RoaXMuaW5kZXhBcnJheVtpXV0gIT09IFwiLTFcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdQYWlyQXJyYXlbdGhpcy5pbmRleEFycmF5W2ldXVsxXS5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1BhaXJBcnJheVtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByZWduYW50SW5kZXhBcnJheVt0aGlzLmluZGV4QXJyYXlbaV1dXG4gICAgICAgICAgICAgICAgICAgICAgICBdWzBdXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kcm9wWm9uZURpdi5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdQYWlyQXJyYXlbdGhpcy5pbmRleEFycmF5W2ldXVsxXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzZXRFdmVudExpc3RlbmVycyhkZ1NwYW4sIGRwU3Bhbikge1xuICAgICAgICAvLyBBZGRzIEhUTUw1IFwiZHJhZyBhbmQgZHJvcFwiIFVJIGZ1bmN0aW9uYWxpdHlcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBkZ1NwYW4uYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIGV2LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwiZHJhZ2dhYmxlSURcIiwgZXYudGFyZ2V0LmlkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRnU3Bhbi5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZGdTcGFuLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcImRyb3BcIixcbiAgICAgICAgICAgIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgICAgIHNlbGYuaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IGV2LmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiZHJhZ2dhYmxlSURcIik7XG4gICAgICAgICAgICAgICAgdmFyIGRyYWdnZWRTcGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGF0YSk7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc05vRHJhZ0NoaWxkKGV2LnRhcmdldCkgJiZcbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dlZFNwYW4gIT0gZXYudGFyZ2V0ICYmXG4gICAgICAgICAgICAgICAgICAgICF0aGlzLnN0cmFuZ2VyRGFuZ2VyKGRyYWdnZWRTcGFuKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgZWxlbWVudCBpc24ndCBhbHJlYWR5IHRoZXJlLS1wcmV2ZW50cyBlcnJvcyB3L2FwcGVuZGluZyBjaGlsZFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdnYWJsZURpdi5hcHBlbmRDaGlsZChkcmFnZ2VkU3Bhbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG4gICAgICAgIGRwU3Bhbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJkcmFnb3ZlclwiLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5pc0Fuc3dlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmICgkKGV2LnRhcmdldCkuaGFzQ2xhc3MoXCJwb3NzaWJsZURyb3BcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICQoZXYudGFyZ2V0KS5oYXNDbGFzcyhcImRyYWdnYWJsZS1kcm9wXCIpICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzTm9EcmFnQ2hpbGQoZXYudGFyZ2V0KVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAkKGV2LnRhcmdldCkuYWRkQ2xhc3MoXCJwb3NzaWJsZURyb3BcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG4gICAgICAgIGRwU3Bhbi5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgc2VsZi5pc0Fuc3dlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAoISQoZXYudGFyZ2V0KS5oYXNDbGFzcyhcInBvc3NpYmxlRHJvcFwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQoZXYudGFyZ2V0KS5yZW1vdmVDbGFzcyhcInBvc3NpYmxlRHJvcFwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRwU3Bhbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJkcm9wXCIsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmlzQW5zd2VyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKCQoZXYudGFyZ2V0KS5oYXNDbGFzcyhcInBvc3NpYmxlRHJvcFwiKSkge1xuICAgICAgICAgICAgICAgICAgICAkKGV2LnRhcmdldCkucmVtb3ZlQ2xhc3MoXCJwb3NzaWJsZURyb3BcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gZXYuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJkcmFnZ2FibGVJRFwiKTtcbiAgICAgICAgICAgICAgICB2YXIgZHJhZ2dlZFNwYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkYXRhKTtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICQoZXYudGFyZ2V0KS5oYXNDbGFzcyhcImRyYWdnYWJsZS1kcm9wXCIpICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzTm9EcmFnQ2hpbGQoZXYudGFyZ2V0KSAmJlxuICAgICAgICAgICAgICAgICAgICAhdGhpcy5zdHJhbmdlckRhbmdlcihkcmFnZ2VkU3BhbilcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTWFrZSBzdXJlIGVsZW1lbnQgaXNuJ3QgYWxyZWFkeSB0aGVyZS0tcHJldmVudHMgZXJyb3Mgdy9hcHBlbmRpbmcgY2hpbGRcbiAgICAgICAgICAgICAgICAgICAgZXYudGFyZ2V0LmFwcGVuZENoaWxkKGRyYWdnZWRTcGFuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICB9XG4gICAgcmVuZGVyRmVlZGJhY2tEaXYoKSB7XG4gICAgICAgIGlmICghdGhpcy5mZWVkQmFja0Rpdikge1xuICAgICAgICAgICAgdGhpcy5mZWVkQmFja0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmlkID0gdGhpcy5kaXZpZCArIFwiX2ZlZWRiYWNrXCI7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5mZWVkQmFja0Rpdik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09IEF1eGlsaWFyeSBmdW5jdGlvbnMgPT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgc3RyYW5nZXJEYW5nZXIodGVzdFNwYW4pIHtcbiAgICAgICAgLy8gUmV0dXJucyB0cnVlIGlmIHRoZSB0ZXN0IHNwYW4gZG9lc24ndCBiZWxvbmcgdG8gdGhpcyBpbnN0YW5jZSBvZiBEcmFnTkRyb3BcbiAgICAgICAgdmFyIHN0cmFuZ2VyRGFuZ2VyID0gdHJ1ZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRyYWdQYWlyQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0ZXN0U3BhbiA9PT0gdGhpcy5kcmFnUGFpckFycmF5W2ldWzBdKSB7XG4gICAgICAgICAgICAgICAgc3RyYW5nZXJEYW5nZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RyYW5nZXJEYW5nZXI7XG4gICAgfVxuICAgIGhhc05vRHJhZ0NoaWxkKHBhcmVudCkge1xuICAgICAgICAvLyBFbnN1cmVzIHRoYXQgZWFjaCBkcm9wWm9uZURpdiBjYW4gaGF2ZSBvbmx5IG9uZSBkcmFnZ2FibGUgY2hpbGRcbiAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcmVudC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoJChwYXJlbnQuY2hpbGROb2Rlc1tpXSkuYXR0cihcImRyYWdnYWJsZVwiKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvdW50ZXIgPj0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY3JlYXRlSW5kZXhBcnJheSgpIHtcbiAgICAgICAgdGhpcy5pbmRleEFycmF5ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5kcmFnUGFpckFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmluZGV4QXJyYXkucHVzaChpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByYW5kb21pemVJbmRleEFycmF5KCkge1xuICAgICAgICAvLyBTaHVmZmxlcyBhcm91bmQgaW5kaWNlcyBzbyB0aGUgbWF0Y2hhYmxlIGVsZW1lbnRzIGFyZW4ndCBpbiBhIHByZWRpY3RhYmxlIG9yZGVyXG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSB0aGlzLmluZGV4QXJyYXkubGVuZ3RoLFxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUsXG4gICAgICAgICAgICByYW5kb21JbmRleDtcbiAgICAgICAgLy8gV2hpbGUgdGhlcmUgcmVtYWluIGVsZW1lbnRzIHRvIHNodWZmbGUuLi5cbiAgICAgICAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xuICAgICAgICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW50Li4uXG4gICAgICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcbiAgICAgICAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gdGhpcy5pbmRleEFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgICAgICAgICB0aGlzLmluZGV4QXJyYXlbY3VycmVudEluZGV4XSA9IHRoaXMuaW5kZXhBcnJheVtyYW5kb21JbmRleF07XG4gICAgICAgICAgICB0aGlzLmluZGV4QXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PSBSZXNldCBidXR0b24gZnVuY3Rpb25hbGl0eSA9PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgcmVzZXREcmFnZ2FibGVzKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZHJhZ1BhaXJBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChcbiAgICAgICAgICAgICAgICB2YXIgaiA9IDA7XG4gICAgICAgICAgICAgICAgaiA8IHRoaXMuZHJhZ1BhaXJBcnJheVtpXVsxXS5jaGlsZE5vZGVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBqKytcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLmRyYWdQYWlyQXJyYXlbaV1bMV0uY2hpbGROb2Rlc1tqXSkuYXR0cihcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZHJhZ2dhYmxlXCJcbiAgICAgICAgICAgICAgICAgICAgKSA9PT0gXCJ0cnVlXCJcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuYXBwZW5kQ2hpbGQoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdQYWlyQXJyYXlbaV1bMV0uY2hpbGROb2Rlc1tqXVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PSBFdmFsdWF0aW9uIGFuZCBmZWVkYmFjayA9PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbiAgICBjaGVja0N1cnJlbnRBbnN3ZXIoKSB7XG4gICAgICAgIHRoaXMuY29ycmVjdCA9IHRydWU7XG4gICAgICAgIHRoaXMudW5hbnN3ZXJlZE51bSA9IDA7XG4gICAgICAgIHRoaXMuaW5jb3JyZWN0TnVtID0gMDtcbiAgICAgICAgdGhpcy5kcmFnTnVtID0gdGhpcy5kcmFnUGFpckFycmF5Lmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRyYWdQYWlyQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAhJCh0aGlzLmRyYWdQYWlyQXJyYXlbaV1bMV0pLmhhcyh0aGlzLmRyYWdQYWlyQXJyYXlbaV1bMF0pXG4gICAgICAgICAgICAgICAgICAgIC5sZW5ndGhcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0TnVtKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5oYXNOb0RyYWdDaGlsZCh0aGlzLmRyYWdQYWlyQXJyYXlbaV1bMV0pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51bmFuc3dlcmVkTnVtKys7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmNvcnJlY3ROdW0gLT0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvcnJlY3ROdW0gPSB0aGlzLmRyYWdOdW0gLSB0aGlzLmluY29ycmVjdE51bSAtIHRoaXMudW5hbnN3ZXJlZE51bTtcbiAgICAgICAgdGhpcy5wZXJjZW50ID0gdGhpcy5jb3JyZWN0TnVtIC8gdGhpcy5kcmFnUGFpckFycmF5Lmxlbmd0aDtcbiAgICAgICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2UoeyBjb3JyZWN0OiB0aGlzLmNvcnJlY3QgPyBcIlRcIiA6IFwiRlwiIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGxvZ0N1cnJlbnRBbnN3ZXIoc2lkKSB7XG4gICAgICAgIGxldCBhbnN3ZXIgPSB0aGlzLnByZWduYW50SW5kZXhBcnJheS5qb2luKFwiO1wiKTtcbiAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICBldmVudDogXCJkcmFnTmRyb3BcIixcbiAgICAgICAgICAgIGFjdDogYW5zd2VyLFxuICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXIsXG4gICAgICAgICAgICBtaW5faGVpZ2h0OiB0aGlzLm1pbmhlaWdodCxcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgIGNvcnJlY3Q6IHRoaXMuY29ycmVjdCxcbiAgICAgICAgICAgIGNvcnJlY3ROdW06IHRoaXMuY29ycmVjdE51bSxcbiAgICAgICAgICAgIGRyYWdOdW06IHRoaXMuZHJhZ051bSxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHR5cGVvZiBzaWQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGRhdGEuc2lkID0gc2lkO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHRoaXMubG9nQm9va0V2ZW50KGRhdGEpO1xuICAgIH1cbiAgICByZW5kZXJGZWVkYmFjaygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRyYWdQYWlyQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAhJCh0aGlzLmRyYWdQYWlyQXJyYXlbaV1bMV0pLmhhcyh0aGlzLmRyYWdQYWlyQXJyYXlbaV1bMF0pXG4gICAgICAgICAgICAgICAgICAgIC5sZW5ndGhcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICQodGhpcy5kcmFnUGFpckFycmF5W2ldWzFdKS5hZGRDbGFzcyhcImRyb3AtaW5jb3JyZWN0XCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMuZHJhZ1BhaXJBcnJheVtpXVsxXSkucmVtb3ZlQ2xhc3MoXCJkcm9wLWluY29ycmVjdFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5mZWVkQmFja0Rpdikge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJGZWVkYmFja0RpdigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgaWYgKHRoaXMuY29ycmVjdCkge1xuICAgICAgICAgICAgdmFyIG1zZ0NvcnJlY3QgPSAkLmkxOG4oXCJtc2dfZHJhZ25kcm9wX2NvcnJlY3RfYW5zd2VyXCIpO1xuICAgICAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5odG1sKG1zZ0NvcnJlY3QpO1xuICAgICAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5hdHRyKFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIixcbiAgICAgICAgICAgICAgICBcImFsZXJ0IGFsZXJ0LWluZm8gZHJhZ2dhYmxlLWZlZWRiYWNrXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbXNnSW5jb3JyZWN0ID0gJC5pMThuKFxuICAgICAgICAgICAgICAgICQuaTE4bihcIm1zZ19kcmFnbmRyb3BfaW5jb3JyZWN0X2Fuc3dlclwiKSxcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3ROdW0sXG4gICAgICAgICAgICAgICAgdGhpcy5pbmNvcnJlY3ROdW0sXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnTnVtLFxuICAgICAgICAgICAgICAgIHRoaXMudW5hbnN3ZXJlZE51bVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICQodGhpcy5mZWVkQmFja0RpdikuaHRtbChtc2dJbmNvcnJlY3QgKyBcIiBcIiArIHRoaXMuZmVlZGJhY2spO1xuICAgICAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5hdHRyKFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIixcbiAgICAgICAgICAgICAgICBcImFsZXJ0IGFsZXJ0LWRhbmdlciBkcmFnZ2FibGUtZmVlZGJhY2tcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09IENoZWNraW5nL3Jlc3RvcmluZyBmcm9tIHN0b3JhZ2UgPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIHJlc3RvcmVBbnN3ZXJzKGRhdGEpIHtcbiAgICAgICAgLy8gUmVzdG9yZSBhbnN3ZXJzIGZyb20gc3RvcmFnZSByZXRyaWV2YWwgZG9uZSBpbiBSdW5lc3RvbmVCYXNlXG4gICAgICAgIHRoaXMuaGFzU3RvcmVkRHJvcHpvbmVzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5taW5oZWlnaHQgPSBkYXRhLm1pbl9oZWlnaHQ7XG4gICAgICAgIHRoaXMucHJlZ25hbnRJbmRleEFycmF5ID0gZGF0YS5hbnN3ZXIuc3BsaXQoXCI7XCIpO1xuICAgICAgICB0aGlzLmZpbmlzaFNldHRpbmdVcCgpO1xuICAgIH1cbiAgICBjaGVja0xvY2FsU3RvcmFnZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0b3JlZE9iajtcbiAgICAgICAgdGhpcy5oYXNTdG9yZWREcm9wem9uZXMgPSBmYWxzZTtcbiAgICAgICAgdmFyIGxlbiA9IGxvY2FsU3RvcmFnZS5sZW5ndGg7XG4gICAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgICAgICB2YXIgZXggPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgIGlmIChleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFzU3RvcmVkRHJvcHpvbmVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBzdG9yZWRPYmogPSBKU09OLnBhcnNlKGV4KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5taW5oZWlnaHQgPSBzdG9yZWRPYmoubWluX2hlaWdodDtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZXJyb3Igd2hpbGUgcGFyc2luZzsgbGlrZWx5IGR1ZSB0byBiYWQgdmFsdWUgc3RvcmVkIGluIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNTdG9yZWREcm9wem9uZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5pc2hTZXR0aW5nVXAoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnByZWduYW50SW5kZXhBcnJheSA9IHN0b3JlZE9iai5hbnN3ZXIuc3BsaXQoXCI7XCIpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIGFuc3dlciBpbiBkYXRhYmFzZVxuICAgICAgICAgICAgICAgICAgICB2YXIgYW5zd2VyID0gdGhpcy5wcmVnbmFudEluZGV4QXJyYXkuam9pbihcIjtcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50OiBcImRyYWdOZHJvcFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0OiBhbnN3ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXI6IGFuc3dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbl9oZWlnaHQ6IHRoaXMubWluaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29ycmVjdDogc3RvcmVkT2JqLmNvcnJlY3QsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZpbmlzaFNldHRpbmdVcCgpO1xuICAgIH1cblxuICAgIHNldExvY2FsU3RvcmFnZShkYXRhKSB7XG4gICAgICAgIGlmIChkYXRhLmFuc3dlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBJZiB3ZSBkaWRuJ3QgbG9hZCBmcm9tIHRoZSBzZXJ2ZXIsIHdlIG11c3QgZ2VuZXJhdGUgdGhlIGRhdGFcbiAgICAgICAgICAgIHRoaXMucHJlZ25hbnRJbmRleEFycmF5ID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZHJhZ1BhaXJBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5oYXNOb0RyYWdDaGlsZCh0aGlzLmRyYWdQYWlyQXJyYXlbaV1bMV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5kcmFnUGFpckFycmF5Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzLmRyYWdQYWlyQXJyYXlbaV1bMV0pLmhhcyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnUGFpckFycmF5W2pdWzBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKS5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJlZ25hbnRJbmRleEFycmF5LnB1c2goaik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZWduYW50SW5kZXhBcnJheS5wdXNoKC0xKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRpbWVTdGFtcCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHZhciBjb3JyZWN0ID0gZGF0YS5jb3JyZWN0O1xuICAgICAgICB2YXIgc3RvcmFnZU9iaiA9IHtcbiAgICAgICAgICAgIGFuc3dlcjogdGhpcy5wcmVnbmFudEluZGV4QXJyYXkuam9pbihcIjtcIiksXG4gICAgICAgICAgICBtaW5faGVpZ2h0OiB0aGlzLm1pbmhlaWdodCxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogdGltZVN0YW1wLFxuICAgICAgICAgICAgY29ycmVjdDogY29ycmVjdCxcbiAgICAgICAgfTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZUtleSgpLFxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoc3RvcmFnZU9iailcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBkaXNhYmxlSW50ZXJhY3Rpb24oKSB7XG4gICAgICAgICQodGhpcy5yZXNldEJ1dHRvbikuaGlkZSgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZHJhZ1BhaXJBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy8gTm8gbW9yZSBkcmFnZ2luZ1xuICAgICAgICAgICAgJCh0aGlzLmRyYWdQYWlyQXJyYXlbaV1bMF0pLmF0dHIoXCJkcmFnZ2FibGVcIiwgXCJmYWxzZVwiKTtcbiAgICAgICAgICAgICQodGhpcy5kcmFnUGFpckFycmF5W2ldWzBdKS5jc3MoXCJjdXJzb3JcIiwgXCJpbml0aWFsXCIpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT0gRmluZCB0aGUgY3VzdG9tIEhUTUwgdGFncyBhbmQgPT1cbj09ICAgZXhlY3V0ZSBvdXIgY29kZSBvbiB0aGVtICAgID09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuJChkb2N1bWVudCkub24oXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuICAgICQoXCJbZGF0YS1jb21wb25lbnQ9ZHJhZ25kcm9wXVwiKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB2YXIgb3B0cyA9IHtcbiAgICAgICAgICAgIG9yaWc6IHRoaXMsXG4gICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMsXG4gICAgICAgIH07XG4gICAgICAgIGlmICgkKHRoaXMpLmNsb3Nlc3QoXCJbZGF0YS1jb21wb25lbnQ9dGltZWRBc3Nlc3NtZW50XVwiKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBlbGVtZW50IGV4aXN0cyB3aXRoaW4gYSB0aW1lZCBjb21wb25lbnQsIGRvbid0IHJlbmRlciBpdCBoZXJlXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGRkTGlzdFt0aGlzLmlkXSA9IG5ldyBEcmFnTkRyb3Aob3B0cyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgcmVuZGVyaW5nIERyYWdORHJvcCBQcm9ibGVtICR7dGhpcy5pZH1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IERyYWdORHJvcCBmcm9tIFwiLi9kcmFnbmRyb3AuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWREcmFnTkRyb3AgZXh0ZW5kcyBEcmFnTkRyb3Age1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHRoaXMuZmluaXNoU2V0dGluZ1VwKCk7XG4gICAgICAgIHRoaXMucmVuZGVyVGltZWRJY29uKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICAgICAgdGhpcy5oaWRlQnV0dG9ucygpO1xuICAgIH1cbiAgICBoaWRlQnV0dG9ucygpIHtcbiAgICAgICAgJCh0aGlzLnN1Ym1pdEJ1dHRvbikuaGlkZSgpO1xuICAgIH1cbiAgICByZW5kZXJUaW1lZEljb24oY29tcG9uZW50KSB7XG4gICAgICAgIC8vIHJlbmRlcnMgdGhlIGNsb2NrIGljb24gb24gdGltZWQgY29tcG9uZW50cy4gICAgVGhlIGNvbXBvbmVudCBwYXJhbWV0ZXJcbiAgICAgICAgLy8gaXMgdGhlIGVsZW1lbnQgdGhhdCB0aGUgaWNvbiBzaG91bGQgYmUgYXBwZW5kZWQgdG8uXG4gICAgICAgIHZhciB0aW1lSWNvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHZhciB0aW1lSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICAgICQodGltZUljb24pLmF0dHIoe1xuICAgICAgICAgICAgc3JjOiBcIi4uL19zdGF0aWMvY2xvY2sucG5nXCIsXG4gICAgICAgICAgICBzdHlsZTogXCJ3aWR0aDoxNXB4O2hlaWdodDoxNXB4XCIsXG4gICAgICAgIH0pO1xuICAgICAgICB0aW1lSWNvbkRpdi5jbGFzc05hbWUgPSBcInRpbWVUaXBcIjtcbiAgICAgICAgdGltZUljb25EaXYudGl0bGUgPSBcIlwiO1xuICAgICAgICB0aW1lSWNvbkRpdi5hcHBlbmRDaGlsZCh0aW1lSWNvbik7XG4gICAgICAgICQoY29tcG9uZW50KS5wcmVwZW5kKHRpbWVJY29uRGl2KTtcbiAgICB9XG4gICAgY2hlY2tDb3JyZWN0VGltZWQoKSB7XG4gICAgICAgIC8vIFJldHVybnMgaWYgdGhlIHF1ZXN0aW9uIHdhcyBjb3JyZWN0LiAgICBVc2VkIGZvciB0aW1lZCBhc3Nlc3NtZW50IGdyYWRpbmcuXG4gICAgICAgIGlmICh0aGlzLnVuYW5zd2VyZWROdW0gPT09IHRoaXMuZHJhZ1BhaXJBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0aGlzLmNvcnJlY3QpIHtcbiAgICAgICAgICAgIGNhc2UgdHJ1ZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJUXCI7XG4gICAgICAgICAgICBjYXNlIGZhbHNlOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIkZcIjtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaGlkZUZlZWRiYWNrKCkge1xuICAgICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmhpZGUoKTtcbiAgICB9XG59XG5cbmlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID0ge307XG59XG53aW5kb3cuY29tcG9uZW50X2ZhY3RvcnlbXCJkcmFnbmRyb3BcIl0gPSBmdW5jdGlvbiAob3B0cykge1xuICAgIGlmIChvcHRzLnRpbWVkKSB7XG4gICAgICAgIHJldHVybiBuZXcgVGltZWREcmFnTkRyb3Aob3B0cyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgRHJhZ05Ecm9wKG9wdHMpO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==