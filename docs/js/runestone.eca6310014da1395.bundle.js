(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone"],{

/***/ 88288:
/*!*************************************************!*\
  !*** ./runestone/common/css/presenter_mode.css ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 64778:
/*!********************************************************************!*\
  !*** ./runestone/common/css/runestone-custom-sphinx-bootstrap.css ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 88874:
/*!**************************************************!*\
  !*** ./runestone/common/css/user-highlights.css ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 23746:
/*!*********************************************!*\
  !*** ./runestone/matrixeq/css/matrixeq.css ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 86324:
/*!******************************************************!*\
  !*** ./runestone/webgldemo/css/webglinteractive.css ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 21294:
/*!******************************************!*\
  !*** ./runestone/common/js/bookfuncs.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "pageProgressTracker": () => (/* binding */ pageProgressTracker)
/* harmony export */ });
/**
 *
 * User: bmiller
 * Original: 2011-04-20
 * Date: 2019-06-14
 * Time: 2:01 PM
 * This change marks the beginning of version 4.0 of the runestone components
 * Login/logout is no longer handled through javascript but rather server side.
 * Many of the components depend on the runestone:login event so we will keep that
 * for now to keep the churn fairly minimal.
 */

/*

 Copyright (C) 2011  Brad Miller  bonelake@gmail.com

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.

 */

//
// Page decoration functions
//

function addReadingList() {
    if (eBookConfig.readings) {
        var l, nxt, path_parts, nxt_link;
        let cur_path_parts = window.location.pathname.split("/");
        let name =
            cur_path_parts[cur_path_parts.length - 2] +
            "/" +
            cur_path_parts[cur_path_parts.length - 1];
        let position = eBookConfig.readings.indexOf(name);
        let num_readings = eBookConfig.readings.length;
        if (position == eBookConfig.readings.length - 1) {
            // no more readings
            l = $("<div />", {
                text: `Finished reading assignment. Page ${num_readings} of ${num_readings}.`,
            });
        } else if (position >= 0) {
            // get next name
            nxt = eBookConfig.readings[position + 1];
            path_parts = cur_path_parts.slice(0, cur_path_parts.length - 2);
            path_parts.push(nxt);
            nxt_link = path_parts.join("/");
            l = $("<a />", {
                name: "link",
                class: "btn btn-lg ' + 'buttonConfirmCompletion'",
                href: nxt_link,
                text: `Continue to page ${
                    position + 2
                } of ${num_readings} in the reading assignment.`,
            });
        } else {
            l = $("<div />", {
                text: "This page is not part of the last reading assignment you visited.",
            });
        }
        $("#main-content").append(l);
    }
}

function timedRefresh() {
    var timeoutPeriod = 900000; // 75 minutes
    $(document).on("idle.idleTimer", function () {
        // After timeout period send the user back to the index.  This will force a login
        // if needed when they want to go to a particular page.  This may not be perfect
        // but its an easy way to make sure laptop users are properly logged in when they
        // take quizzes and save stuff.
        if (location.href.indexOf("index.html") < 0) {
            console.log("Idle timer - " + location.pathname);
            location.href =
                eBookConfig.app +
                "/default/user/login?_next=" +
                location.pathname +
                location.search;
        }
    });
    $.idleTimer(timeoutPeriod);
}

class PageProgressBar {
    constructor(actDict) {
        this.possible = 0;
        this.total = 1;
        if (actDict && Object.keys(actDict).length > 0) {
            this.activities = actDict;
        } else {
            let activities = { page: 0 };
            $(".runestone").each(function (idx, e) {
                activities[e.firstElementChild.id] = 0;
            });
            this.activities = activities;
        }
        this.calculateProgress();
        if (
            window.location.pathname.match(
                /.*(index.html|toctree.html|Exercises.html|Glossary.html|search.html)$/i
            )
        ) {
            $("#scprogresscontainer").hide();
        }
        this.renderProgress();
    }

    calculateProgress() {
        for (let k in this.activities) {
            if (k !== undefined) {
                this.possible++;
                if (this.activities[k] > 0) {
                    this.total++;
                }
            }
        }
    }

    renderProgress() {
        let value = 0;
        $("#scprogresstotal").text(this.total);
        $("#scprogressposs").text(this.possible);
        try {
            value = (100 * this.total) / this.possible;
        } catch (e) {
            value = 0;
        }
        $("#subchapterprogress").progressbar({
            value: value,
        });
        if (!eBookConfig.isLoggedIn) {
            $("#subchapterprogress>div").addClass("loggedout");
        }
    }

    updateProgress(div_id) {
        this.activities[div_id]++;
        // Only update the progress bar on the first interaction with an object.
        if (this.activities[div_id] === 1) {
            this.total++;
            let val = (100 * this.total) / this.possible;
            $("#scprogresstotal").text(this.total);
            $("#scprogressposs").text(this.possible);
            $("#subchapterprogress").progressbar("option", "value", val);
            if (
                val == 100.0 &&
                $("#completionButton").text().toLowerCase() ===
                    "mark as completed"
            ) {
                $("#completionButton").click();
            }
        }
    }
}

var pageProgressTracker = {};

async function handlePageSetup() {
    var mess;
    if (eBookConfig.useRunestoneServices) {
        let headers = new Headers({
            "Content-type": "application/json; charset=utf-8",
            Accept: "application/json",
        });
        let data = { timezoneoffset: new Date().getTimezoneOffset() / 60 };
        let request = new Request(
            `${eBookConfig.new_server_prefix}/logger/set_tz_offset`,
            {
                method: "POST",
                body: JSON.stringify(data),
                headers: headers,
            }
        );
        try {
            let response = await fetch(request);
            if (!response.ok) {
                console.error(`Failed to set timezone! ${response.statusText}`);
            }
            data = await response.json();
        } catch (e) {
            console.error(`Error setting timezone ${e}`);
        }
    }
    if (eBookConfig.isLoggedIn) {
        mess = `username: ${eBookConfig.username}`;
        if (!eBookConfig.isInstructor) {
            $("#ip_dropdown_link").remove();
            $("#inst_peer_link").remove();
        }
        $(document).trigger("runestone:login");
        addReadingList();
        // Avoid the timedRefresh on the grading page.
        if (
            window.location.pathname.indexOf("/admin/grading") == -1 &&
            window.location.pathname.indexOf("/peer/") == -1
        ) {
            timedRefresh();
        }
    } else {
        mess = "Not logged in";
        $(document).trigger("runestone:logout");
        document.getElementById("browsing_warning").innerHTML =
            "<p class='navbar_message'>Saving and Logging are Disabled</p>";
    }
    $(".loggedinuser").html(mess);

    pageProgressTracker = new PageProgressBar(eBookConfig.activities);
    notifyRunestoneComponents();
}

function setupNavbarLoggedIn() {
    $("#profilelink").show();
    $("#passwordlink").show();
    $("#registerlink").hide();
    $("li.loginout").html(
        '<a href="' + eBookConfig.app + '/default/user/logout">Log Out</a>'
    );
}
$(document).bind("runestone:login", setupNavbarLoggedIn);

function setupNavbarLoggedOut() {
    if (eBookConfig.useRunestoneServices) {
        console.log("setup navbar for logged out");
        $("#registerlink").show();
        $("#profilelink").hide();
        $("#passwordlink").hide();
        $("#ip_dropdown_link").hide();
        $("#inst_peer_link").hide();
        $("li.loginout").html(
            '<a href="' + eBookConfig.app + '/default/user/login">Login</a>'
        );
        $(".footer").html("user not logged in");
    }
}
$(document).bind("runestone:logout", setupNavbarLoggedOut);

function notifyRunestoneComponents() {
    // Runestone components wait until login process is over to load components because of storage issues. This triggers the `dynamic import machinery`, which then sends the login complete signal when this and all dynamic imports are finished.
    $(document).trigger("runestone:pre-login-complete");
}

// initialize stuff
$(function () {
    if (eBookConfig) {
        handlePageSetup();
    } else {
        if (typeof eBookConfig === "undefined") {
            console.log(
                "eBookConfig is not defined.  This page must not be set up for Runestone"
            );
        }
    }
});

// misc stuff
// todo:  This could be further distributed but making a video.js file just for one function seems dumb.
window.addEventListener("load", function () {
    // add the video play button overlay image
    $(".video-play-overlay").each(function () {
        $(this).css(
            "background-image",
            "url('{{pathto('_static/play_overlay_icon.png', 1)}}')"
        );
    });

    // This function is needed to allow the dropdown search bar to work;
    // The default behaviour is that the dropdown menu closes when something in
    // it (like the search bar) is clicked
    $(function () {
        // Fix input element click problem
        $(".dropdown input, .dropdown label").click(function (e) {
            e.stopPropagation();
        });
    });

    if (location.href.includes("mode=browsing")) {
        let queryString = "?mode=browsing";
        document.querySelectorAll("a").forEach((link) => {
            if (link.href.includes("books/published")) {
                link.href = link.href.includes("?")
                    ? link.href + queryString.replace("?", "&")
                    : link.href + queryString;
            }
        });
    }
});


/***/ }),

/***/ 26886:
/*!**************************************************!*\
  !*** ./runestone/common/js/jquery.idle-timer.js ***!
  \**************************************************/
/***/ (() => {

/*!
 * jQuery idleTimer plugin
 * version 0.9.100511
 * by Paul Irish.
 *   http://github.com/paulirish/yui-misc/tree/
 * MIT license

 * adapted from YUI idle timer by nzakas:
 *   http://github.com/nzakas/yui-misc/
*/
/*
 * Copyright (c) 2009 Nicholas C. Zakas
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/* updated to fix Chrome setTimeout issue by Zaid Zawaideh */

 // API available in <= v0.8
 /*******************************

 // idleTimer() takes an optional argument that defines the idle timeout
 // timeout is in milliseconds; defaults to 30000
 $.idleTimer(10000);


 $(document).bind("idle.idleTimer", function(){
    // function you want to fire when the user goes idle
 });


 $(document).bind("active.idleTimer", function(){
  // function you want to fire when the user becomes active again
 });

 // pass the string 'destroy' to stop the timer
 $.idleTimer('destroy');

 // you can query if the user is idle or not with data()
 $.data(document,'idleTimer');  // 'idle'  or 'active'

 // you can get time elapsed since user when idle/active
 $.idleTimer('getElapsedTime'); // time since state change in ms

 ********/



 // API available in >= v0.9
 /*************************

 // bind to specific elements, allows for multiple timer instances
 $(elem).idleTimer(timeout|'destroy'|'getElapsedTime');
 $.data(elem,'idleTimer');  // 'idle'  or 'active'

 // if you're using the old $.idleTimer api, you should not do $(document).idleTimer(...)

 // element bound timers will only watch for events inside of them.
 // you may just want page-level activity, in which case you may set up
 //   your timers on document, document.documentElement, and document.body

 // You can optionally provide a second argument to override certain options.
 // Here are the defaults, so you can omit any or all of them.
 $(elem).idleTimer(timeout, {
   startImmediately: true, //starts a timeout as soon as the timer is set up; otherwise it waits for the first event.
   idle:    false,         //indicates if the user is idle
   enabled: true,          //indicates if the idle timer is enabled
   events:  'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove' // activity is one of these events
 });

 ********/

(function($){

$.idleTimer = function(newTimeout, elem, opts){

    // defaults that are to be stored as instance props on the elem

	opts = $.extend({
		startImmediately: true, //starts a timeout as soon as the timer is set up
		idle:    false,         //indicates if the user is idle
		enabled: true,          //indicates if the idle timer is enabled
		timeout: 30000,         //the amount of time (ms) before the user is considered idle
		events:  'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove' // activity is one of these events
	}, opts);


    elem = elem || document;

    /* (intentionally not documented)
     * Toggles the idle state and fires an appropriate event.
     * @return {void}
     */
    var toggleIdleState = function(myelem){

        // curse you, mozilla setTimeout lateness bug!
        if (typeof myelem === 'number'){
            myelem = undefined;
        }

        var obj = $.data(myelem || elem,'idleTimerObj');

        //toggle the state
        obj.idle = !obj.idle;

        // reset timeout 
        var elapsed = (+new Date()) - obj.olddate;
        obj.olddate = +new Date();

        // handle Chrome always triggering idle after js alert or comfirm popup
        if (obj.idle && (elapsed < opts.timeout)) {
                obj.idle = false;
                clearTimeout($.idleTimer.tId);
                if (opts.enabled)
                  $.idleTimer.tId = setTimeout(toggleIdleState, opts.timeout);
                return;
        }
        
        //fire appropriate event

        // create a custom event, but first, store the new state on the element
        // and then append that string to a namespace
        var event = jQuery.Event( $.data(elem,'idleTimer', obj.idle ? "idle" : "active" )  + '.idleTimer'   );

        // we do want this to bubble, at least as a temporary fix for jQuery 1.7
        // event.stopPropagation();
        $(elem).trigger(event);
    },

    /**
     * Stops the idle timer. This removes appropriate event handlers
     * and cancels any pending timeouts.
     * @return {void}
     * @method stop
     * @static
     */
    stop = function(elem){

        var obj = $.data(elem,'idleTimerObj') || {};

        //set to disabled
        obj.enabled = false;

        //clear any pending timeouts
        clearTimeout(obj.tId);

        //detach the event handlers
        $(elem).off('.idleTimer');
    },


    /* (intentionally not documented)
     * Handles a user event indicating that the user isn't idle.
     * @param {Event} event A DOM2-normalized event object.
     * @return {void}
     */
    handleUserEvent = function(){

        var obj = $.data(this,'idleTimerObj');

        //clear any existing timeout
        clearTimeout(obj.tId);



        //if the idle timer is enabled
        if (obj.enabled){


            //if it's idle, that means the user is no longer idle
            if (obj.idle){
                toggleIdleState(this);
            }

            //set a new timeout
            obj.tId = setTimeout(toggleIdleState, obj.timeout);

        }
     };


    /**
     * Starts the idle timer. This adds appropriate event handlers
     * and starts the first timeout.
     * @param {int} newTimeout (Optional) A new value for the timeout period in ms.
     * @return {void}
     * @method $.idleTimer
     * @static
     */


    var obj = $.data(elem,'idleTimerObj') || {};

    obj.olddate = obj.olddate || +new Date();

    //assign a new timeout if necessary
    if (typeof newTimeout === "number"){
        opts.timeout = newTimeout;
    } else if (newTimeout === 'destroy') {
        stop(elem);
        return this;
    } else if (newTimeout === 'getElapsedTime'){
        return (+new Date()) - obj.olddate;
    }

    //assign appropriate event handlers
    $(elem).on($.trim((opts.events+' ').split(' ').join('.idleTimer ')),handleUserEvent);


    obj.idle    = opts.idle;
    obj.enabled = opts.enabled;
    obj.timeout = opts.timeout;


    //set a timeout to toggle state. May wish to omit this in some situations
	if (opts.startImmediately) {
	    obj.tId = setTimeout(toggleIdleState, obj.timeout);
	}

    // assume the user is active for the first x seconds.
    $.data(elem,'idleTimer',"active");

    // store our instance on the object
    $.data(elem,'idleTimerObj',obj);



}; // end of $.idleTimer()


// v0.9 API for defining multiple timers.
$.fn.idleTimer = function(newTimeout,opts){
	// Allow omission of opts for backward compatibility
	if (!opts) {
		opts = {};
	}

    if(this[0]){
        $.idleTimer(newTimeout,this[0],opts);
    }

    return this;
};


})(jQuery);


/***/ }),

/***/ 43793:
/*!*********************************************************************!*\
  !*** ./runestone/common/js/jquery_i18n/jquery.i18n.emitter.bidi.js ***!
  \*********************************************************************/
/***/ (() => {

/*!
 * BIDI embedding support for jQuery.i18n
 *
 * Copyright (C) 2015, David Chan
 *
 * This code is dual licensed GPLv2 or later and MIT. You don't have to do
 * anything special to choose one license or the other and you don't have to
 * notify anyone which license you are using. You are free to use this code
 * in commercial projects as long as the copyright header is left intact.
 * See files GPL-LICENSE and MIT-LICENSE for details.
 *
 * @licence GNU General Public Licence 2.0 or later
 * @licence MIT License
 */

( function ( $ ) {
	'use strict';
	var strongDirRegExp;

	/**
	 * Matches the first strong directionality codepoint:
	 * - in group 1 if it is LTR
	 * - in group 2 if it is RTL
	 * Does not match if there is no strong directionality codepoint.
	 *
	 * Generated by UnicodeJS (see tools/strongDir) from the UCD; see
	 * https://phabricator.wikimedia.org/diffusion/GUJS/ .
	 */
	strongDirRegExp = new RegExp(
		'(?:' +
			'(' +
				'[\u0041-\u005a\u0061-\u007a\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u02bb-\u02c1\u02d0\u02d1\u02e0-\u02e4\u02ee\u0370-\u0373\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0482\u048a-\u052f\u0531-\u0556\u0559-\u055f\u0561-\u0587\u0589\u0903-\u0939\u093b\u093d-\u0940\u0949-\u094c\u094e-\u0950\u0958-\u0961\u0964-\u0980\u0982\u0983\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd-\u09c0\u09c7\u09c8\u09cb\u09cc\u09ce\u09d7\u09dc\u09dd\u09df-\u09e1\u09e6-\u09f1\u09f4-\u09fa\u0a03\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a3e-\u0a40\u0a59-\u0a5c\u0a5e\u0a66-\u0a6f\u0a72-\u0a74\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd-\u0ac0\u0ac9\u0acb\u0acc\u0ad0\u0ae0\u0ae1\u0ae6-\u0af0\u0af9\u0b02\u0b03\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b3e\u0b40\u0b47\u0b48\u0b4b\u0b4c\u0b57\u0b5c\u0b5d\u0b5f-\u0b61\u0b66-\u0b77\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe\u0bbf\u0bc1\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcc\u0bd0\u0bd7\u0be6-\u0bf2\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d\u0c41-\u0c44\u0c58-\u0c5a\u0c60\u0c61\u0c66-\u0c6f\u0c7f\u0c82\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd-\u0cc4\u0cc6-\u0cc8\u0cca\u0ccb\u0cd5\u0cd6\u0cde\u0ce0\u0ce1\u0ce6-\u0cef\u0cf1\u0cf2\u0d02\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d-\u0d40\u0d46-\u0d48\u0d4a-\u0d4c\u0d4e\u0d57\u0d5f-\u0d61\u0d66-\u0d75\u0d79-\u0d7f\u0d82\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dcf-\u0dd1\u0dd8-\u0ddf\u0de6-\u0def\u0df2-\u0df4\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e4f-\u0e5b\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0ed0-\u0ed9\u0edc-\u0edf\u0f00-\u0f17\u0f1a-\u0f34\u0f36\u0f38\u0f3e-\u0f47\u0f49-\u0f6c\u0f7f\u0f85\u0f88-\u0f8c\u0fbe-\u0fc5\u0fc7-\u0fcc\u0fce-\u0fda\u1000-\u102c\u1031\u1038\u103b\u103c\u103f-\u1057\u105a-\u105d\u1061-\u1070\u1075-\u1081\u1083\u1084\u1087-\u108c\u108e-\u109c\u109e-\u10c5\u10c7\u10cd\u10d0-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1360-\u137c\u1380-\u138f\u13a0-\u13f5\u13f8-\u13fd\u1401-\u167f\u1681-\u169a\u16a0-\u16f8\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1735\u1736\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17b6\u17be-\u17c5\u17c7\u17c8\u17d4-\u17da\u17dc\u17e0-\u17e9\u1810-\u1819\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191e\u1923-\u1926\u1929-\u192b\u1930\u1931\u1933-\u1938\u1946-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u19d0-\u19da\u1a00-\u1a16\u1a19\u1a1a\u1a1e-\u1a55\u1a57\u1a61\u1a63\u1a64\u1a6d-\u1a72\u1a80-\u1a89\u1a90-\u1a99\u1aa0-\u1aad\u1b04-\u1b33\u1b35\u1b3b\u1b3d-\u1b41\u1b43-\u1b4b\u1b50-\u1b6a\u1b74-\u1b7c\u1b82-\u1ba1\u1ba6\u1ba7\u1baa\u1bae-\u1be5\u1be7\u1bea-\u1bec\u1bee\u1bf2\u1bf3\u1bfc-\u1c2b\u1c34\u1c35\u1c3b-\u1c49\u1c4d-\u1c7f\u1cc0-\u1cc7\u1cd3\u1ce1\u1ce9-\u1cec\u1cee-\u1cf3\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u200e\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u214f\u2160-\u2188\u2336-\u237a\u2395\u249c-\u24e9\u26ac\u2800-\u28ff\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d70\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u3005-\u3007\u3021-\u3029\u302e\u302f\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u3190-\u31ba\u31f0-\u321c\u3220-\u324f\u3260-\u327b\u327f-\u32b0\u32c0-\u32cb\u32d0-\u32fe\u3300-\u3376\u337b-\u33dd\u33e0-\u33fe\u3400-\u4db5\u4e00-\u9fd5\ua000-\ua48c\ua4d0-\ua60c\ua610-\ua62b\ua640-\ua66e\ua680-\ua69d\ua6a0-\ua6ef\ua6f2-\ua6f7\ua722-\ua787\ua789-\ua7ad\ua7b0-\ua7b7\ua7f7-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua824\ua827\ua830-\ua837\ua840-\ua873\ua880-\ua8c3\ua8ce-\ua8d9\ua8f2-\ua8fd\ua900-\ua925\ua92e-\ua946\ua952\ua953\ua95f-\ua97c\ua983-\ua9b2\ua9b4\ua9b5\ua9ba\ua9bb\ua9bd-\ua9cd\ua9cf-\ua9d9\ua9de-\ua9e4\ua9e6-\ua9fe\uaa00-\uaa28\uaa2f\uaa30\uaa33\uaa34\uaa40-\uaa42\uaa44-\uaa4b\uaa4d\uaa50-\uaa59\uaa5c-\uaa7b\uaa7d-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaaeb\uaaee-\uaaf5\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab65\uab70-\uabe4\uabe6\uabe7\uabe9-\uabec\uabf0-\uabf9\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\ue000-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc]|\ud800[\udc00-\udc0b]|\ud800[\udc0d-\udc26]|\ud800[\udc28-\udc3a]|\ud800\udc3c|\ud800\udc3d|\ud800[\udc3f-\udc4d]|\ud800[\udc50-\udc5d]|\ud800[\udc80-\udcfa]|\ud800\udd00|\ud800\udd02|\ud800[\udd07-\udd33]|\ud800[\udd37-\udd3f]|\ud800[\uddd0-\uddfc]|\ud800[\ude80-\ude9c]|\ud800[\udea0-\uded0]|\ud800[\udf00-\udf23]|\ud800[\udf30-\udf4a]|\ud800[\udf50-\udf75]|\ud800[\udf80-\udf9d]|\ud800[\udf9f-\udfc3]|\ud800[\udfc8-\udfd5]|\ud801[\udc00-\udc9d]|\ud801[\udca0-\udca9]|\ud801[\udd00-\udd27]|\ud801[\udd30-\udd63]|\ud801\udd6f|\ud801[\ude00-\udf36]|\ud801[\udf40-\udf55]|\ud801[\udf60-\udf67]|\ud804\udc00|\ud804[\udc02-\udc37]|\ud804[\udc47-\udc4d]|\ud804[\udc66-\udc6f]|\ud804[\udc82-\udcb2]|\ud804\udcb7|\ud804\udcb8|\ud804[\udcbb-\udcc1]|\ud804[\udcd0-\udce8]|\ud804[\udcf0-\udcf9]|\ud804[\udd03-\udd26]|\ud804\udd2c|\ud804[\udd36-\udd43]|\ud804[\udd50-\udd72]|\ud804[\udd74-\udd76]|\ud804[\udd82-\uddb5]|\ud804[\uddbf-\uddc9]|\ud804\uddcd|\ud804[\uddd0-\udddf]|\ud804[\udde1-\uddf4]|\ud804[\ude00-\ude11]|\ud804[\ude13-\ude2e]|\ud804\ude32|\ud804\ude33|\ud804\ude35|\ud804[\ude38-\ude3d]|\ud804[\ude80-\ude86]|\ud804\ude88|\ud804[\ude8a-\ude8d]|\ud804[\ude8f-\ude9d]|\ud804[\ude9f-\udea9]|\ud804[\udeb0-\udede]|\ud804[\udee0-\udee2]|\ud804[\udef0-\udef9]|\ud804\udf02|\ud804\udf03|\ud804[\udf05-\udf0c]|\ud804\udf0f|\ud804\udf10|\ud804[\udf13-\udf28]|\ud804[\udf2a-\udf30]|\ud804\udf32|\ud804\udf33|\ud804[\udf35-\udf39]|\ud804[\udf3d-\udf3f]|\ud804[\udf41-\udf44]|\ud804\udf47|\ud804\udf48|\ud804[\udf4b-\udf4d]|\ud804\udf50|\ud804\udf57|\ud804[\udf5d-\udf63]|\ud805[\udc80-\udcb2]|\ud805\udcb9|\ud805[\udcbb-\udcbe]|\ud805\udcc1|\ud805[\udcc4-\udcc7]|\ud805[\udcd0-\udcd9]|\ud805[\udd80-\uddb1]|\ud805[\uddb8-\uddbb]|\ud805\uddbe|\ud805[\uddc1-\udddb]|\ud805[\ude00-\ude32]|\ud805\ude3b|\ud805\ude3c|\ud805\ude3e|\ud805[\ude41-\ude44]|\ud805[\ude50-\ude59]|\ud805[\ude80-\udeaa]|\ud805\udeac|\ud805\udeae|\ud805\udeaf|\ud805\udeb6|\ud805[\udec0-\udec9]|\ud805[\udf00-\udf19]|\ud805\udf20|\ud805\udf21|\ud805\udf26|\ud805[\udf30-\udf3f]|\ud806[\udca0-\udcf2]|\ud806\udcff|\ud806[\udec0-\udef8]|\ud808[\udc00-\udf99]|\ud809[\udc00-\udc6e]|\ud809[\udc70-\udc74]|\ud809[\udc80-\udd43]|\ud80c[\udc00-\udfff]|\ud80d[\udc00-\udc2e]|\ud811[\udc00-\ude46]|\ud81a[\udc00-\ude38]|\ud81a[\ude40-\ude5e]|\ud81a[\ude60-\ude69]|\ud81a\ude6e|\ud81a\ude6f|\ud81a[\uded0-\udeed]|\ud81a\udef5|\ud81a[\udf00-\udf2f]|\ud81a[\udf37-\udf45]|\ud81a[\udf50-\udf59]|\ud81a[\udf5b-\udf61]|\ud81a[\udf63-\udf77]|\ud81a[\udf7d-\udf8f]|\ud81b[\udf00-\udf44]|\ud81b[\udf50-\udf7e]|\ud81b[\udf93-\udf9f]|\ud82c\udc00|\ud82c\udc01|\ud82f[\udc00-\udc6a]|\ud82f[\udc70-\udc7c]|\ud82f[\udc80-\udc88]|\ud82f[\udc90-\udc99]|\ud82f\udc9c|\ud82f\udc9f|\ud834[\udc00-\udcf5]|\ud834[\udd00-\udd26]|\ud834[\udd29-\udd66]|\ud834[\udd6a-\udd72]|\ud834\udd83|\ud834\udd84|\ud834[\udd8c-\udda9]|\ud834[\uddae-\udde8]|\ud834[\udf60-\udf71]|\ud835[\udc00-\udc54]|\ud835[\udc56-\udc9c]|\ud835\udc9e|\ud835\udc9f|\ud835\udca2|\ud835\udca5|\ud835\udca6|\ud835[\udca9-\udcac]|\ud835[\udcae-\udcb9]|\ud835\udcbb|\ud835[\udcbd-\udcc3]|\ud835[\udcc5-\udd05]|\ud835[\udd07-\udd0a]|\ud835[\udd0d-\udd14]|\ud835[\udd16-\udd1c]|\ud835[\udd1e-\udd39]|\ud835[\udd3b-\udd3e]|\ud835[\udd40-\udd44]|\ud835\udd46|\ud835[\udd4a-\udd50]|\ud835[\udd52-\udea5]|\ud835[\udea8-\udeda]|\ud835[\udedc-\udf14]|\ud835[\udf16-\udf4e]|\ud835[\udf50-\udf88]|\ud835[\udf8a-\udfc2]|\ud835[\udfc4-\udfcb]|\ud836[\udc00-\uddff]|\ud836[\ude37-\ude3a]|\ud836[\ude6d-\ude74]|\ud836[\ude76-\ude83]|\ud836[\ude85-\ude8b]|\ud83c[\udd10-\udd2e]|\ud83c[\udd30-\udd69]|\ud83c[\udd70-\udd9a]|\ud83c[\udde6-\ude02]|\ud83c[\ude10-\ude3a]|\ud83c[\ude40-\ude48]|\ud83c\ude50|\ud83c\ude51|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6]|\ud869[\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34]|\ud86d[\udf40-\udfff]|\ud86e[\udc00-\udc1d]|\ud86e[\udc20-\udfff]|[\ud86f-\ud872][\udc00-\udfff]|\ud873[\udc00-\udea1]|\ud87e[\udc00-\ude1d]|[\udb80-\udbbe][\udc00-\udfff]|\udbbf[\udc00-\udffd]|[\udbc0-\udbfe][\udc00-\udfff]|\udbff[\udc00-\udffd]' +
			')|(' +
				'[\u0590\u05be\u05c0\u05c3\u05c6\u05c8-\u05ff\u07c0-\u07ea\u07f4\u07f5\u07fa-\u0815\u081a\u0824\u0828\u082e-\u0858\u085c-\u089f\u200f\ufb1d\ufb1f-\ufb28\ufb2a-\ufb4f\u0608\u060b\u060d\u061b-\u064a\u066d-\u066f\u0671-\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u0710\u0712-\u072f\u074b-\u07a5\u07b1-\u07bf\u08a0-\u08e2\ufb50-\ufd3d\ufd40-\ufdcf\ufdf0-\ufdfc\ufdfe\ufdff\ufe70-\ufefe]|\ud802[\udc00-\udd1e]|\ud802[\udd20-\ude00]|\ud802\ude04|\ud802[\ude07-\ude0b]|\ud802[\ude10-\ude37]|\ud802[\ude3b-\ude3e]|\ud802[\ude40-\udee4]|\ud802[\udee7-\udf38]|\ud802[\udf40-\udfff]|\ud803[\udc00-\ude5f]|\ud803[\ude7f-\udfff]|\ud83a[\udc00-\udccf]|\ud83a[\udcd7-\udfff]|\ud83b[\udc00-\uddff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\ude00-\udeef]|\ud83b[\udef2-\udeff]' +
			')' +
		')'
	);

	/**
	 * Gets directionality of the first strongly directional codepoint
	 *
	 * This is the rule the BIDI algorithm uses to determine the directionality of
	 * paragraphs ( http://unicode.org/reports/tr9/#The_Paragraph_Level ) and
	 * FSI isolates ( http://unicode.org/reports/tr9/#Explicit_Directional_Isolates ).
	 *
	 * TODO: Does not handle BIDI control characters inside the text.
	 * TODO: Does not handle unallocated characters.
	 *
	 * @param {string} text The text from which to extract initial directionality.
	 * @return {string} Directionality (either 'ltr' or 'rtl')
	 */
	function strongDirFromContent( text ) {
		var m = text.match( strongDirRegExp );
		if ( !m ) {
			return null;
		}
		if ( m[ 2 ] === undefined ) {
			return 'ltr';
		}
		return 'rtl';
	}

	$.extend( $.i18n.parser.emitter, {
		/**
		 * Wraps argument with unicode control characters for directionality safety
		 *
		 * This solves the problem where directionality-neutral characters at the edge of
		 * the argument string get interpreted with the wrong directionality from the
		 * enclosing context, giving renderings that look corrupted like "(Ben_(WMF".
		 *
		 * The wrapping is LRE...PDF or RLE...PDF, depending on the detected
		 * directionality of the argument string, using the BIDI algorithm's own "First
		 * strong directional codepoint" rule. Essentially, this works round the fact that
		 * there is no embedding equivalent of U+2068 FSI (isolation with heuristic
		 * direction inference). The latter is cleaner but still not widely supported.
		 *
		 * @param {string[]} nodes The text nodes from which to take the first item.
		 * @return {string} Wrapped String of content as needed.
		 */
		bidi: function ( nodes ) {
			var dir = strongDirFromContent( nodes[ 0 ] );
			if ( dir === 'ltr' ) {
				// Wrap in LEFT-TO-RIGHT EMBEDDING ... POP DIRECTIONAL FORMATTING
				return '\u202A' + nodes[ 0 ] + '\u202C';
			}
			if ( dir === 'rtl' ) {
				// Wrap in RIGHT-TO-LEFT EMBEDDING ... POP DIRECTIONAL FORMATTING
				return '\u202B' + nodes[ 0 ] + '\u202C';
			}
			// No strong directionality: do not wrap
			return nodes[ 0 ];
		}
	} );
}( jQuery ) );


/***/ }),

/***/ 30423:
/*!****************************************************************!*\
  !*** ./runestone/common/js/jquery_i18n/jquery.i18n.emitter.js ***!
  \****************************************************************/
/***/ (() => {

/*!
 * jQuery Internationalization library
 *
 * Copyright (C) 2011-2013 Santhosh Thottingal, Neil Kandalgaonkar
 *
 * jquery.i18n is dual licensed GPLv2 or later and MIT. You don't have to do
 * anything special to choose one license or the other and you don't have to
 * notify anyone which license you are using. You are free to use
 * UniversalLanguageSelector in commercial projects as long as the copyright
 * header is left intact. See files GPL-LICENSE and MIT-LICENSE for details.
 *
 * @licence GNU General Public Licence 2.0 or later
 * @licence MIT License
 */

( function ( $ ) {
	'use strict';

	var MessageParserEmitter = function () {
		this.language = $.i18n.languages[ String.locale ] || $.i18n.languages[ 'default' ];
	};

	MessageParserEmitter.prototype = {
		constructor: MessageParserEmitter,

		/**
		 * (We put this method definition here, and not in prototype, to make
		 * sure it's not overwritten by any magic.) Walk entire node structure,
		 * applying replacements and template functions when appropriate
		 *
		 * @param {Mixed} node abstract syntax tree (top node or subnode)
		 * @param {Array} replacements for $1, $2, ... $n
		 * @return {Mixed} single-string node or array of nodes suitable for
		 *  jQuery appending.
		 */
		emit: function ( node, replacements ) {
			var ret, subnodes, operation,
				messageParserEmitter = this;

			switch ( typeof node ) {
				case 'string':
				case 'number':
					ret = node;
					break;
				case 'object':
				// node is an array of nodes
					subnodes = $.map( node.slice( 1 ), function ( n ) {
						return messageParserEmitter.emit( n, replacements );
					} );

					operation = node[ 0 ].toLowerCase();

					if ( typeof messageParserEmitter[ operation ] === 'function' ) {
						ret = messageParserEmitter[ operation ]( subnodes, replacements );
					} else {
						throw new Error( 'unknown operation "' + operation + '"' );
					}

					break;
				case 'undefined':
				// Parsing the empty string (as an entire expression, or as a
				// paramExpression in a template) results in undefined
				// Perhaps a more clever parser can detect this, and return the
				// empty string? Or is that useful information?
				// The logical thing is probably to return the empty string here
				// when we encounter undefined.
					ret = '';
					break;
				default:
					throw new Error( 'unexpected type in AST: ' + typeof node );
			}

			return ret;
		},

		/**
		 * Parsing has been applied depth-first we can assume that all nodes
		 * here are single nodes Must return a single node to parents -- a
		 * jQuery with synthetic span However, unwrap any other synthetic spans
		 * in our children and pass them upwards
		 *
		 * @param {Array} nodes Mixed, some single nodes, some arrays of nodes.
		 * @return {string}
		 */
		concat: function ( nodes ) {
			var result = '';

			$.each( nodes, function ( i, node ) {
				// strings, integers, anything else
				result += node;
			} );

			return result;
		},

		/**
		 * Return escaped replacement of correct index, or string if
		 * unavailable. Note that we expect the parsed parameter to be
		 * zero-based. i.e. $1 should have become [ 0 ]. if the specified
		 * parameter is not found return the same string (e.g. "$99" ->
		 * parameter 98 -> not found -> return "$99" ) TODO throw error if
		 * nodes.length > 1 ?
		 *
		 * @param {Array} nodes One element, integer, n >= 0
		 * @param {Array} replacements for $1, $2, ... $n
		 * @return {string} replacement
		 */
		replace: function ( nodes, replacements ) {
			var index = parseInt( nodes[ 0 ], 10 );

			if ( index < replacements.length ) {
				// replacement is not a string, don't touch!
				return replacements[ index ];
			} else {
				// index not found, fallback to displaying variable
				return '$' + ( index + 1 );
			}
		},

		/**
		 * Transform parsed structure into pluralization n.b. The first node may
		 * be a non-integer (for instance, a string representing an Arabic
		 * number). So convert it back with the current language's
		 * convertNumber.
		 *
		 * @param {Array} nodes List [ {String|Number}, {String}, {String} ... ]
		 * @return {string} selected pluralized form according to current
		 *  language.
		 */
		plural: function ( nodes ) {
			var count = parseFloat( this.language.convertNumber( nodes[ 0 ], 10 ) ),
				forms = nodes.slice( 1 );

			return forms.length ? this.language.convertPlural( count, forms ) : '';
		},

		/**
		 * Transform parsed structure into gender Usage
		 * {{gender:gender|masculine|feminine|neutral}}.
		 *
		 * @param {Array} nodes List [ {String}, {String}, {String} , {String} ]
		 * @return {string} selected gender form according to current language
		 */
		gender: function ( nodes ) {
			var gender = nodes[ 0 ],
				forms = nodes.slice( 1 );

			return this.language.gender( gender, forms );
		},

		/**
		 * Transform parsed structure into grammar conversion. Invoked by
		 * putting {{grammar:form|word}} in a message
		 *
		 * @param {Array} nodes List [{Grammar case eg: genitive}, {String word}]
		 * @return {string} selected grammatical form according to current
		 *  language.
		 */
		grammar: function ( nodes ) {
			var form = nodes[ 0 ],
				word = nodes[ 1 ];

			return word && form && this.language.convertGrammar( word, form );
		}
	};

	$.extend( $.i18n.parser.emitter, new MessageParserEmitter() );
}( jQuery ) );


/***/ }),

/***/ 9001:
/*!******************************************************************!*\
  !*** ./runestone/common/js/jquery_i18n/jquery.i18n.fallbacks.js ***!
  \******************************************************************/
/***/ (() => {

/*!
 * jQuery Internationalization library
 *
 * Copyright (C) 2012 Santhosh Thottingal
 *
 * jquery.i18n is dual licensed GPLv2 or later and MIT. You don't have to do anything special to
 * choose one license or the other and you don't have to notify anyone which license you are using.
 * You are free to use UniversalLanguageSelector in commercial projects as long as the copyright
 * header is left intact. See files GPL-LICENSE and MIT-LICENSE for details.
 *
 * @licence GNU General Public Licence 2.0 or later
 * @licence MIT License
 */
( function ( $ ) {
	'use strict';

	$.i18n = $.i18n || {};
	$.extend( $.i18n.fallbacks, {
		ab: [ 'ru' ],
		ace: [ 'id' ],
		aln: [ 'sq' ],
		// Not so standard - als is supposed to be Tosk Albanian,
		// but in Wikipedia it's used for a Germanic language.
		als: [ 'gsw', 'de' ],
		an: [ 'es' ],
		anp: [ 'hi' ],
		arn: [ 'es' ],
		arz: [ 'ar' ],
		av: [ 'ru' ],
		ay: [ 'es' ],
		ba: [ 'ru' ],
		bar: [ 'de' ],
		'bat-smg': [ 'sgs', 'lt' ],
		bcc: [ 'fa' ],
		'be-x-old': [ 'be-tarask' ],
		bh: [ 'bho' ],
		bjn: [ 'id' ],
		bm: [ 'fr' ],
		bpy: [ 'bn' ],
		bqi: [ 'fa' ],
		bug: [ 'id' ],
		'cbk-zam': [ 'es' ],
		ce: [ 'ru' ],
		crh: [ 'crh-latn' ],
		'crh-cyrl': [ 'ru' ],
		csb: [ 'pl' ],
		cv: [ 'ru' ],
		'de-at': [ 'de' ],
		'de-ch': [ 'de' ],
		'de-formal': [ 'de' ],
		dsb: [ 'de' ],
		dtp: [ 'ms' ],
		egl: [ 'it' ],
		eml: [ 'it' ],
		ff: [ 'fr' ],
		fit: [ 'fi' ],
		'fiu-vro': [ 'vro', 'et' ],
		frc: [ 'fr' ],
		frp: [ 'fr' ],
		frr: [ 'de' ],
		fur: [ 'it' ],
		gag: [ 'tr' ],
		gan: [ 'gan-hant', 'zh-hant', 'zh-hans' ],
		'gan-hans': [ 'zh-hans' ],
		'gan-hant': [ 'zh-hant', 'zh-hans' ],
		gl: [ 'pt' ],
		glk: [ 'fa' ],
		gn: [ 'es' ],
		gsw: [ 'de' ],
		hif: [ 'hif-latn' ],
		hsb: [ 'de' ],
		ht: [ 'fr' ],
		ii: [ 'zh-cn', 'zh-hans' ],
		inh: [ 'ru' ],
		iu: [ 'ike-cans' ],
		jut: [ 'da' ],
		jv: [ 'id' ],
		kaa: [ 'kk-latn', 'kk-cyrl' ],
		kbd: [ 'kbd-cyrl' ],
		khw: [ 'ur' ],
		kiu: [ 'tr' ],
		kk: [ 'kk-cyrl' ],
		'kk-arab': [ 'kk-cyrl' ],
		'kk-latn': [ 'kk-cyrl' ],
		'kk-cn': [ 'kk-arab', 'kk-cyrl' ],
		'kk-kz': [ 'kk-cyrl' ],
		'kk-tr': [ 'kk-latn', 'kk-cyrl' ],
		kl: [ 'da' ],
		'ko-kp': [ 'ko' ],
		koi: [ 'ru' ],
		krc: [ 'ru' ],
		ks: [ 'ks-arab' ],
		ksh: [ 'de' ],
		ku: [ 'ku-latn' ],
		'ku-arab': [ 'ckb' ],
		kv: [ 'ru' ],
		lad: [ 'es' ],
		lb: [ 'de' ],
		lbe: [ 'ru' ],
		lez: [ 'ru' ],
		li: [ 'nl' ],
		lij: [ 'it' ],
		liv: [ 'et' ],
		lmo: [ 'it' ],
		ln: [ 'fr' ],
		ltg: [ 'lv' ],
		lzz: [ 'tr' ],
		mai: [ 'hi' ],
		'map-bms': [ 'jv', 'id' ],
		mg: [ 'fr' ],
		mhr: [ 'ru' ],
		min: [ 'id' ],
		mo: [ 'ro' ],
		mrj: [ 'ru' ],
		mwl: [ 'pt' ],
		myv: [ 'ru' ],
		mzn: [ 'fa' ],
		nah: [ 'es' ],
		nap: [ 'it' ],
		nds: [ 'de' ],
		'nds-nl': [ 'nl' ],
		'nl-informal': [ 'nl' ],
		no: [ 'nb' ],
		os: [ 'ru' ],
		pcd: [ 'fr' ],
		pdc: [ 'de' ],
		pdt: [ 'de' ],
		pfl: [ 'de' ],
		pms: [ 'it' ],
		pt: [ 'pt-br' ],
		'pt-br': [ 'pt' ],
		qu: [ 'es' ],
		qug: [ 'qu', 'es' ],
		rgn: [ 'it' ],
		rmy: [ 'ro' ],
		'roa-rup': [ 'rup' ],
		rue: [ 'uk', 'ru' ],
		ruq: [ 'ruq-latn', 'ro' ],
		'ruq-cyrl': [ 'mk' ],
		'ruq-latn': [ 'ro' ],
		sa: [ 'hi' ],
		sah: [ 'ru' ],
		scn: [ 'it' ],
		sg: [ 'fr' ],
		sgs: [ 'lt' ],
		sli: [ 'de' ],
		sr: [ 'sr-ec' ],
		srn: [ 'nl' ],
		stq: [ 'de' ],
		su: [ 'id' ],
		szl: [ 'pl' ],
		tcy: [ 'kn' ],
		tg: [ 'tg-cyrl' ],
		tt: [ 'tt-cyrl', 'ru' ],
		'tt-cyrl': [ 'ru' ],
		ty: [ 'fr' ],
		udm: [ 'ru' ],
		ug: [ 'ug-arab' ],
		uk: [ 'ru' ],
		vec: [ 'it' ],
		vep: [ 'et' ],
		vls: [ 'nl' ],
		vmf: [ 'de' ],
		vot: [ 'fi' ],
		vro: [ 'et' ],
		wa: [ 'fr' ],
		wo: [ 'fr' ],
		wuu: [ 'zh-hans' ],
		xal: [ 'ru' ],
		xmf: [ 'ka' ],
		yi: [ 'he' ],
		za: [ 'zh-hans' ],
		zea: [ 'nl' ],
		zh: [ 'zh-hans' ],
		'zh-classical': [ 'lzh' ],
		'zh-cn': [ 'zh-hans' ],
		'zh-hant': [ 'zh-hans' ],
		'zh-hk': [ 'zh-hant', 'zh-hans' ],
		'zh-min-nan': [ 'nan' ],
		'zh-mo': [ 'zh-hk', 'zh-hant', 'zh-hans' ],
		'zh-my': [ 'zh-sg', 'zh-hans' ],
		'zh-sg': [ 'zh-hans' ],
		'zh-tw': [ 'zh-hant', 'zh-hans' ],
		'zh-yue': [ 'yue' ]
	} );
}( jQuery ) );


/***/ }),

/***/ 99283:
/*!********************************************************!*\
  !*** ./runestone/common/js/jquery_i18n/jquery.i18n.js ***!
  \********************************************************/
/***/ (() => {

/*!
 * jQuery Internationalization library
 *
 * Copyright (C) 2012 Santhosh Thottingal
 *
 * jquery.i18n is dual licensed GPLv2 or later and MIT. You don't have to do
 * anything special to choose one license or the other and you don't have to
 * notify anyone which license you are using. You are free to use
 * UniversalLanguageSelector in commercial projects as long as the copyright
 * header is left intact. See files GPL-LICENSE and MIT-LICENSE for details.
 *
 * @licence GNU General Public Licence 2.0 or later
 * @licence MIT License
 */

( function ( $ ) {
	'use strict';

	var I18N,
		slice = Array.prototype.slice;
	/**
	 * @constructor
	 * @param {Object} options
	 */
	I18N = function ( options ) {
		// Load defaults
		this.options = $.extend( {}, I18N.defaults, options );

		this.parser = this.options.parser;
		this.locale = this.options.locale;
		this.messageStore = this.options.messageStore;
		this.languages = {};
	};

	I18N.prototype = {
		/**
		 * Localize a given messageKey to a locale.
		 * @param {String} messageKey
		 * @return {String} Localized message
		 */
		localize: function ( messageKey ) {
			var localeParts, localePartIndex, locale, fallbackIndex,
				tryingLocale, message;

			locale = this.locale;
			fallbackIndex = 0;

			while ( locale ) {
				// Iterate through locales starting at most-specific until
				// localization is found. As in fi-Latn-FI, fi-Latn and fi.
				localeParts = locale.split( '-' );
				localePartIndex = localeParts.length;

				do {
					tryingLocale = localeParts.slice( 0, localePartIndex ).join( '-' );
					message = this.messageStore.get( tryingLocale, messageKey );

					if ( message ) {
						return message;
					}

					localePartIndex--;
				} while ( localePartIndex );

				if ( locale === 'en' ) {
					break;
				}

				locale = ( $.i18n.fallbacks[ this.locale ] &&
						$.i18n.fallbacks[ this.locale ][ fallbackIndex ] ) ||
						this.options.fallbackLocale;
				$.i18n.log( 'Trying fallback locale for ' + this.locale + ': ' + locale + ' (' + messageKey + ')' );

				fallbackIndex++;
			}

			// key not found
			return '';
		},

		/*
		 * Destroy the i18n instance.
		 */
		destroy: function () {
			$.removeData( document, 'i18n' );
		},

		/**
		 * General message loading API This can take a URL string for
		 * the json formatted messages. Example:
		 * <code>load('path/to/all_localizations.json');</code>
		 *
		 * To load a localization file for a locale:
		 * <code>
		 * load('path/to/de-messages.json', 'de' );
		 * </code>
		 *
		 * To load a localization file from a directory:
		 * <code>
		 * load('path/to/i18n/directory', 'de' );
		 * </code>
		 * The above method has the advantage of fallback resolution.
		 * ie, it will automatically load the fallback locales for de.
		 * For most usecases, this is the recommended method.
		 * It is optional to have trailing slash at end.
		 *
		 * A data object containing message key- message translation mappings
		 * can also be passed. Example:
		 * <code>
		 * load( { 'hello' : 'Hello' }, optionalLocale );
		 * </code>
		 *
		 * A source map containing key-value pair of languagename and locations
		 * can also be passed. Example:
		 * <code>
		 * load( {
		 * bn: 'i18n/bn.json',
		 * he: 'i18n/he.json',
		 * en: 'i18n/en.json'
		 * } )
		 * </code>
		 *
		 * If the data argument is null/undefined/false,
		 * all cached messages for the i18n instance will get reset.
		 *
		 * @param {string|Object} source
		 * @param {string} locale Language tag
		 * @return {jQuery.Promise}
		 */
		load: function ( source, locale ) {
			var fallbackLocales, locIndex, fallbackLocale, sourceMap = {};
			if ( !source && !locale ) {
				source = 'i18n/' + $.i18n().locale + '.json';
				locale = $.i18n().locale;
			}
			if ( typeof source === 'string' &&
				// source extension should be json, but can have query params after that.
				source.split( '?' )[ 0 ].split( '.' ).pop() !== 'json'
			) {
				// Load specified locale then check for fallbacks when directory is
				// specified in load()
				sourceMap[ locale ] = source + '/' + locale + '.json';
				fallbackLocales = ( $.i18n.fallbacks[ locale ] || [] )
					.concat( this.options.fallbackLocale );
				for ( locIndex = 0; locIndex < fallbackLocales.length; locIndex++ ) {
					fallbackLocale = fallbackLocales[ locIndex ];
					sourceMap[ fallbackLocale ] = source + '/' + fallbackLocale + '.json';
				}
				return this.load( sourceMap );
			} else {
				return this.messageStore.load( source, locale );
			}

		},

		/**
		 * Does parameter and magic word substitution.
		 *
		 * @param {string} key Message key
		 * @param {Array} parameters Message parameters
		 * @return {string}
		 */
		parse: function ( key, parameters ) {
			var message = this.localize( key );
			// FIXME: This changes the state of the I18N object,
			// should probably not change the 'this.parser' but just
			// pass it to the parser.
			this.parser.language = $.i18n.languages[ $.i18n().locale ] || $.i18n.languages[ 'default' ];
			if ( message === '' ) {
				message = key;
			}
			return this.parser.parse( message, parameters );
		}
	};

	/**
	 * Process a message from the $.I18N instance
	 * for the current document, stored in jQuery.data(document).
	 *
	 * @param {string} key Key of the message.
	 * @param {string} param1 [param...] Variadic list of parameters for {key}.
	 * @return {string|$.I18N} Parsed message, or if no key was given
	 * the instance of $.I18N is returned.
	 */
	$.i18n = function ( key, param1 ) {
		var parameters,
			i18n = $.data( document, 'i18n' ),
			options = typeof key === 'object' && key;

		// If the locale option for this call is different then the setup so far,
		// update it automatically. This doesn't just change the context for this
		// call but for all future call as well.
		// If there is no i18n setup yet, don't do this. It will be taken care of
		// by the `new I18N` construction below.
		// NOTE: It should only change language for this one call.
		// Then cache instances of I18N somewhere.
		if ( options && options.locale && i18n && i18n.locale !== options.locale ) {
			i18n.locale = options.locale;
		}

		if ( !i18n ) {
			i18n = new I18N( options );
			$.data( document, 'i18n', i18n );
		}

		if ( typeof key === 'string' ) {
			if ( param1 !== undefined ) {
				parameters = slice.call( arguments, 1 );
			} else {
				parameters = [];
			}

			return i18n.parse( key, parameters );
		} else {
			// FIXME: remove this feature/bug.
			return i18n;
		}
	};

	$.fn.i18n = function () {
		var i18n = $.data( document, 'i18n' );

		if ( !i18n ) {
			i18n = new I18N();
			$.data( document, 'i18n', i18n );
		}

		return this.each( function () {
			var $this = $( this ),
				messageKey = $this.data( 'i18n' ),
				lBracket, rBracket, type, key;

			if ( messageKey ) {
				lBracket = messageKey.indexOf( '[' );
				rBracket = messageKey.indexOf( ']' );
				if ( lBracket !== -1 && rBracket !== -1 && lBracket < rBracket ) {
					type = messageKey.slice( lBracket + 1, rBracket );
					key = messageKey.slice( rBracket + 1 );
					if ( type === 'html' ) {
						$this.html( i18n.parse( key ) );
					} else {
						$this.attr( type, i18n.parse( key ) );
					}
				} else {
					$this.text( i18n.parse( messageKey ) );
				}
			} else {
				$this.find( '[data-i18n]' ).i18n();
			}
		} );
	};

	function getDefaultLocale() {
		var nav, locale = $( 'html' ).attr( 'lang' );

		if ( !locale ) {
			if ( typeof window.navigator !== undefined ) {
				nav = window.navigator;
				locale = nav.language || nav.userLanguage || '';
			} else {
				locale = '';
			}
		}
		return locale;
	}

	$.i18n.languages = {};
	$.i18n.messageStore = $.i18n.messageStore || {};
	$.i18n.parser = {
		// The default parser only handles variable substitution
		parse: function ( message, parameters ) {
			return message.replace( /\$(\d+)/g, function ( str, match ) {
				var index = parseInt( match, 10 ) - 1;
				return parameters[ index ] !== undefined ? parameters[ index ] : '$' + match;
			} );
		},
		emitter: {}
	};
	$.i18n.fallbacks = {};
	$.i18n.debug = false;
	$.i18n.log = function ( /* arguments */ ) {
		if ( window.console && $.i18n.debug ) {
			window.console.log.apply( window.console, arguments );
		}
	};
	/* Static members */
	I18N.defaults = {
		locale: getDefaultLocale(),
		fallbackLocale: 'en',
		parser: $.i18n.parser,
		messageStore: $.i18n.messageStore
	};

	// Expose constructor
	$.i18n.constructor = I18N;
}( jQuery ) );

/***/ }),

/***/ 64793:
/*!*****************************************************************!*\
  !*** ./runestone/common/js/jquery_i18n/jquery.i18n.language.js ***!
  \*****************************************************************/
/***/ (() => {

/* global pluralRuleParser */
( function ( $ ) {
	'use strict';

	// jscs:disable
	var language = {
		// CLDR plural rules generated using
		// libs/CLDRPluralRuleParser/tools/PluralXML2JSON.html
		pluralRules: {
			ak: {
				one: 'n = 0..1'
			},
			am: {
				one: 'i = 0 or n = 1'
			},
			ar: {
				zero: 'n = 0',
				one: 'n = 1',
				two: 'n = 2',
				few: 'n % 100 = 3..10',
				many: 'n % 100 = 11..99'
			},
			ars: {
				zero: 'n = 0',
				one: 'n = 1',
				two: 'n = 2',
				few: 'n % 100 = 3..10',
				many: 'n % 100 = 11..99'
			},
			as: {
				one: 'i = 0 or n = 1'
			},
			be: {
				one: 'n % 10 = 1 and n % 100 != 11',
				few: 'n % 10 = 2..4 and n % 100 != 12..14',
				many: 'n % 10 = 0 or n % 10 = 5..9 or n % 100 = 11..14'
			},
			bh: {
				one: 'n = 0..1'
			},
			bn: {
				one: 'i = 0 or n = 1'
			},
			br: {
				one: 'n % 10 = 1 and n % 100 != 11,71,91',
				two: 'n % 10 = 2 and n % 100 != 12,72,92',
				few: 'n % 10 = 3..4,9 and n % 100 != 10..19,70..79,90..99',
				many: 'n != 0 and n % 1000000 = 0'
			},
			bs: {
				one: 'v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11',
				few: 'v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14'
			},
			cs: {
				one: 'i = 1 and v = 0',
				few: 'i = 2..4 and v = 0',
				many: 'v != 0'
			},
			cy: {
				zero: 'n = 0',
				one: 'n = 1',
				two: 'n = 2',
				few: 'n = 3',
				many: 'n = 6'
			},
			da: {
				one: 'n = 1 or t != 0 and i = 0,1'
			},
			dsb: {
				one: 'v = 0 and i % 100 = 1 or f % 100 = 1',
				two: 'v = 0 and i % 100 = 2 or f % 100 = 2',
				few: 'v = 0 and i % 100 = 3..4 or f % 100 = 3..4'
			},
			fa: {
				one: 'i = 0 or n = 1'
			},
			ff: {
				one: 'i = 0,1'
			},
			fil: {
				one: 'v = 0 and i = 1,2,3 or v = 0 and i % 10 != 4,6,9 or v != 0 and f % 10 != 4,6,9'
			},
			fr: {
				one: 'i = 0,1'
			},
			ga: {
				one: 'n = 1',
				two: 'n = 2',
				few: 'n = 3..6',
				many: 'n = 7..10'
			},
			gd: {
				one: 'n = 1,11',
				two: 'n = 2,12',
				few: 'n = 3..10,13..19'
			},
			gu: {
				one: 'i = 0 or n = 1'
			},
			guw: {
				one: 'n = 0..1'
			},
			gv: {
				one: 'v = 0 and i % 10 = 1',
				two: 'v = 0 and i % 10 = 2',
				few: 'v = 0 and i % 100 = 0,20,40,60,80',
				many: 'v != 0'
			},
			he: {
				one: 'i = 1 and v = 0',
				two: 'i = 2 and v = 0',
				many: 'v = 0 and n != 0..10 and n % 10 = 0'
			},
			hi: {
				one: 'i = 0 or n = 1'
			},
			hr: {
				one: 'v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11',
				few: 'v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14'
			},
			hsb: {
				one: 'v = 0 and i % 100 = 1 or f % 100 = 1',
				two: 'v = 0 and i % 100 = 2 or f % 100 = 2',
				few: 'v = 0 and i % 100 = 3..4 or f % 100 = 3..4'
			},
			hy: {
				one: 'i = 0,1'
			},
			is: {
				one: 't = 0 and i % 10 = 1 and i % 100 != 11 or t != 0'
			},
			iu: {
				one: 'n = 1',
				two: 'n = 2'
			},
			iw: {
				one: 'i = 1 and v = 0',
				two: 'i = 2 and v = 0',
				many: 'v = 0 and n != 0..10 and n % 10 = 0'
			},
			kab: {
				one: 'i = 0,1'
			},
			kn: {
				one: 'i = 0 or n = 1'
			},
			kw: {
				one: 'n = 1',
				two: 'n = 2'
			},
			lag: {
				zero: 'n = 0',
				one: 'i = 0,1 and n != 0'
			},
			ln: {
				one: 'n = 0..1'
			},
			lt: {
				one: 'n % 10 = 1 and n % 100 != 11..19',
				few: 'n % 10 = 2..9 and n % 100 != 11..19',
				many: 'f != 0'
			},
			lv: {
				zero: 'n % 10 = 0 or n % 100 = 11..19 or v = 2 and f % 100 = 11..19',
				one: 'n % 10 = 1 and n % 100 != 11 or v = 2 and f % 10 = 1 and f % 100 != 11 or v != 2 and f % 10 = 1'
			},
			mg: {
				one: 'n = 0..1'
			},
			mk: {
				one: 'v = 0 and i % 10 = 1 or f % 10 = 1'
			},
			mo: {
				one: 'i = 1 and v = 0',
				few: 'v != 0 or n = 0 or n != 1 and n % 100 = 1..19'
			},
			mr: {
				one: 'i = 0 or n = 1'
			},
			mt: {
				one: 'n = 1',
				few: 'n = 0 or n % 100 = 2..10',
				many: 'n % 100 = 11..19'
			},
			naq: {
				one: 'n = 1',
				two: 'n = 2'
			},
			nso: {
				one: 'n = 0..1'
			},
			pa: {
				one: 'n = 0..1'
			},
			pl: {
				one: 'i = 1 and v = 0',
				few: 'v = 0 and i % 10 = 2..4 and i % 100 != 12..14',
				many: 'v = 0 and i != 1 and i % 10 = 0..1 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 12..14'
			},
			prg: {
				zero: 'n % 10 = 0 or n % 100 = 11..19 or v = 2 and f % 100 = 11..19',
				one: 'n % 10 = 1 and n % 100 != 11 or v = 2 and f % 10 = 1 and f % 100 != 11 or v != 2 and f % 10 = 1'
			},
			pt: {
				one: 'i = 0..1'
			},
			ro: {
				one: 'i = 1 and v = 0',
				few: 'v != 0 or n = 0 or n != 1 and n % 100 = 1..19'
			},
			ru: {
				one: 'v = 0 and i % 10 = 1 and i % 100 != 11',
				few: 'v = 0 and i % 10 = 2..4 and i % 100 != 12..14',
				many: 'v = 0 and i % 10 = 0 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 11..14'
			},
			se: {
				one: 'n = 1',
				two: 'n = 2'
			},
			sh: {
				one: 'v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11',
				few: 'v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14'
			},
			shi: {
				one: 'i = 0 or n = 1',
				few: 'n = 2..10'
			},
			si: {
				one: 'n = 0,1 or i = 0 and f = 1'
			},
			sk: {
				one: 'i = 1 and v = 0',
				few: 'i = 2..4 and v = 0',
				many: 'v != 0'
			},
			sl: {
				one: 'v = 0 and i % 100 = 1',
				two: 'v = 0 and i % 100 = 2',
				few: 'v = 0 and i % 100 = 3..4 or v != 0'
			},
			sma: {
				one: 'n = 1',
				two: 'n = 2'
			},
			smi: {
				one: 'n = 1',
				two: 'n = 2'
			},
			smj: {
				one: 'n = 1',
				two: 'n = 2'
			},
			smn: {
				one: 'n = 1',
				two: 'n = 2'
			},
			sms: {
				one: 'n = 1',
				two: 'n = 2'
			},
			sr: {
				one: 'v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11',
				few: 'v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14'
			},
			ti: {
				one: 'n = 0..1'
			},
			tl: {
				one: 'v = 0 and i = 1,2,3 or v = 0 and i % 10 != 4,6,9 or v != 0 and f % 10 != 4,6,9'
			},
			tzm: {
				one: 'n = 0..1 or n = 11..99'
			},
			uk: {
				one: 'v = 0 and i % 10 = 1 and i % 100 != 11',
				few: 'v = 0 and i % 10 = 2..4 and i % 100 != 12..14',
				many: 'v = 0 and i % 10 = 0 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 11..14'
			},
			wa: {
				one: 'n = 0..1'
			},
			zu: {
				one: 'i = 0 or n = 1'
			}
		},
		// jscs:enable

		/**
		 * Plural form transformations, needed for some languages.
		 *
		 * @param {integer} count
		 *            Non-localized quantifier
		 * @param {Array} forms
		 *            List of plural forms
		 * @return {string} Correct form for quantifier in this language
		 */
		convertPlural: function ( count, forms ) {
			var pluralRules,
				pluralFormIndex,
				index,
				explicitPluralPattern = new RegExp( '\\d+=', 'i' ),
				formCount,
				form;

			if ( !forms || forms.length === 0 ) {
				return '';
			}

			// Handle for Explicit 0= & 1= values
			for ( index = 0; index < forms.length; index++ ) {
				form = forms[ index ];
				if ( explicitPluralPattern.test( form ) ) {
					formCount = parseInt( form.slice( 0, form.indexOf( '=' ) ), 10 );
					if ( formCount === count ) {
						return ( form.slice( form.indexOf( '=' ) + 1 ) );
					}
					forms[ index ] = undefined;
				}
			}

			forms = $.map( forms, function ( form ) {
				if ( form !== undefined ) {
					return form;
				}
			} );

			pluralRules = this.pluralRules[ $.i18n().locale ];

			if ( !pluralRules ) {
				// default fallback.
				return ( count === 1 ) ? forms[ 0 ] : forms[ 1 ];
			}

			pluralFormIndex = this.getPluralForm( count, pluralRules );
			pluralFormIndex = Math.min( pluralFormIndex, forms.length - 1 );

			return forms[ pluralFormIndex ];
		},

		/**
		 * For the number, get the plural for index
		 *
		 * @param {integer} number
		 * @param {Object} pluralRules
		 * @return {integer} plural form index
		 */
		getPluralForm: function ( number, pluralRules ) {
			var i,
				pluralForms = [ 'zero', 'one', 'two', 'few', 'many', 'other' ],
				pluralFormIndex = 0;

			for ( i = 0; i < pluralForms.length; i++ ) {
				if ( pluralRules[ pluralForms[ i ] ] ) {
					if ( pluralRuleParser( pluralRules[ pluralForms[ i ] ], number ) ) {
						return pluralFormIndex;
					}

					pluralFormIndex++;
				}
			}

			return pluralFormIndex;
		},

		/**
		 * Converts a number using digitTransformTable.
		 *
		 * @param {number} num Value to be converted
		 * @param {boolean} integer Convert the return value to an integer
		 * @return {string} The number converted into a String.
		 */
		convertNumber: function ( num, integer ) {
			var tmp, item, i,
				transformTable, numberString, convertedNumber;

			// Set the target Transform table:
			transformTable = this.digitTransformTable( $.i18n().locale );
			numberString = String( num );
			convertedNumber = '';

			if ( !transformTable ) {
				return num;
			}

			// Check if the restore to Latin number flag is set:
			if ( integer ) {
				if ( parseFloat( num, 10 ) === num ) {
					return num;
				}

				tmp = [];

				for ( item in transformTable ) {
					tmp[ transformTable[ item ] ] = item;
				}

				transformTable = tmp;
			}

			for ( i = 0; i < numberString.length; i++ ) {
				if ( transformTable[ numberString[ i ] ] ) {
					convertedNumber += transformTable[ numberString[ i ] ];
				} else {
					convertedNumber += numberString[ i ];
				}
			}

			return integer ? parseFloat( convertedNumber, 10 ) : convertedNumber;
		},

		/**
		 * Grammatical transformations, needed for inflected languages.
		 * Invoked by putting {{grammar:form|word}} in a message.
		 * Override this method for languages that need special grammar rules
		 * applied dynamically.
		 *
		 * @param {string} word
		 * @param {string} form
		 * @return {string}
		 */
		// eslint-disable-next-line no-unused-vars
		convertGrammar: function ( word, form ) {
			return word;
		},

		/**
		 * Provides an alternative text depending on specified gender. Usage
		 * {{gender:[gender|user object]|masculine|feminine|neutral}}. If second
		 * or third parameter are not specified, masculine is used.
		 *
		 * These details may be overriden per language.
		 *
		 * @param {string} gender
		 *      male, female, or anything else for neutral.
		 * @param {Array} forms
		 *      List of gender forms
		 *
		 * @return {string}
		 */
		gender: function ( gender, forms ) {
			if ( !forms || forms.length === 0 ) {
				return '';
			}

			while ( forms.length < 2 ) {
				forms.push( forms[ forms.length - 1 ] );
			}

			if ( gender === 'male' ) {
				return forms[ 0 ];
			}

			if ( gender === 'female' ) {
				return forms[ 1 ];
			}

			return ( forms.length === 3 ) ? forms[ 2 ] : forms[ 0 ];
		},

		/**
		 * Get the digit transform table for the given language
		 * See http://cldr.unicode.org/translation/numbering-systems
		 *
		 * @param {string} language
		 * @return {Array|boolean} List of digits in the passed language or false
		 * representation, or boolean false if there is no information.
		 */
		digitTransformTable: function ( language ) {
			var tables = {
				ar: '٠١٢٣٤٥٦٧٨٩',
				fa: '۰۱۲۳۴۵۶۷۸۹',
				ml: '൦൧൨൩൪൫൬൭൮൯',
				kn: '೦೧೨೩೪೫೬೭೮೯',
				lo: '໐໑໒໓໔໕໖໗໘໙',
				or: '୦୧୨୩୪୫୬୭୮୯',
				kh: '០១២៣៤៥៦៧៨៩',
				pa: '੦੧੨੩੪੫੬੭੮੯',
				gu: '૦૧૨૩૪૫૬૭૮૯',
				hi: '०१२३४५६७८९',
				my: '၀၁၂၃၄၅၆၇၈၉',
				ta: '௦௧௨௩௪௫௬௭௮௯',
				te: '౦౧౨౩౪౫౬౭౮౯',
				th: '๐๑๒๓๔๕๖๗๘๙', // FIXME use iso 639 codes
				bo: '༠༡༢༣༤༥༦༧༨༩' // FIXME use iso 639 codes
			};

			if ( !tables[ language ] ) {
				return false;
			}

			return tables[ language ].split( '' );
		}
	};

	$.extend( $.i18n.languages, {
		'default': language
	} );
}( jQuery ) );


/***/ }),

/***/ 34517:
/*!*********************************************************************!*\
  !*** ./runestone/common/js/jquery_i18n/jquery.i18n.messagestore.js ***!
  \*********************************************************************/
/***/ (() => {

/*!
 * jQuery Internationalization library - Message Store
 *
 * Copyright (C) 2012 Santhosh Thottingal
 *
 * jquery.i18n is dual licensed GPLv2 or later and MIT. You don't have to do anything special to
 * choose one license or the other and you don't have to notify anyone which license you are using.
 * You are free to use UniversalLanguageSelector in commercial projects as long as the copyright
 * header is left intact. See files GPL-LICENSE and MIT-LICENSE for details.
 *
 * @licence GNU General Public Licence 2.0 or later
 * @licence MIT License
 */

( function ( $ ) {
	'use strict';

	var MessageStore = function () {
		this.messages = {};
		this.sources = {};
	};

	function jsonMessageLoader( url ) {
		var deferred = $.Deferred();

		$.getJSON( url )
			.done( deferred.resolve )
			.fail( function ( jqxhr, settings, exception ) {
				$.i18n.log( 'Error in loading messages from ' + url + ' Exception: ' + exception );
				// Ignore 404 exception, because we are handling fallabacks explicitly
				deferred.resolve();
			} );

		return deferred.promise();
	}

	/**
	 * See https://github.com/wikimedia/jquery.i18n/wiki/Specification#wiki-Message_File_Loading
	 */
	MessageStore.prototype = {

		/**
		 * General message loading API This can take a URL string for
		 * the json formatted messages.
		 * <code>load('path/to/all_localizations.json');</code>
		 *
		 * This can also load a localization file for a locale <code>
		 * load( 'path/to/de-messages.json', 'de' );
		 * </code>
		 * A data object containing message key- message translation mappings
		 * can also be passed Eg:
		 * <code>
		 * load( { 'hello' : 'Hello' }, optionalLocale );
		 * </code> If the data argument is
		 * null/undefined/false,
		 * all cached messages for the i18n instance will get reset.
		 *
		 * @param {string|Object} source
		 * @param {string} locale Language tag
		 * @return {jQuery.Promise}
		 */
		load: function ( source, locale ) {
			var key = null,
				deferred = null,
				deferreds = [],
				messageStore = this;

			if ( typeof source === 'string' ) {
				// This is a URL to the messages file.
				$.i18n.log( 'Loading messages from: ' + source );
				deferred = jsonMessageLoader( source )
					.done( function ( localization ) {
						messageStore.set( locale, localization );
					} );

				return deferred.promise();
			}

			if ( locale ) {
				// source is an key-value pair of messages for given locale
				messageStore.set( locale, source );

				return $.Deferred().resolve();
			} else {
				// source is a key-value pair of locales and their source
				for ( key in source ) {
					if ( Object.prototype.hasOwnProperty.call( source, key ) ) {
						locale = key;
						// No {locale} given, assume data is a group of languages,
						// call this function again for each language.
						deferreds.push( messageStore.load( source[ key ], locale ) );
					}
				}
				return $.when.apply( $, deferreds );
			}

		},

		/**
		 * Set messages to the given locale.
		 * If locale exists, add messages to the locale.
		 *
		 * @param {string} locale
		 * @param {Object} messages
		 */
		set: function ( locale, messages ) {
			if ( !this.messages[ locale ] ) {
				this.messages[ locale ] = messages;
			} else {
				this.messages[ locale ] = $.extend( this.messages[ locale ], messages );
			}
		},

		/**
		 *
		 * @param {string} locale
		 * @param {string} messageKey
		 * @return {boolean}
		 */
		get: function ( locale, messageKey ) {
			return this.messages[ locale ] && this.messages[ locale ][ messageKey ];
		}
	};

	$.extend( $.i18n.messageStore, new MessageStore() );
}( jQuery ) );


/***/ }),

/***/ 25252:
/*!***************************************************************!*\
  !*** ./runestone/common/js/jquery_i18n/jquery.i18n.parser.js ***!
  \***************************************************************/
/***/ (() => {

/*!
 * jQuery Internationalization library
 *
 * Copyright (C) 2011-2013 Santhosh Thottingal, Neil Kandalgaonkar
 *
 * jquery.i18n is dual licensed GPLv2 or later and MIT. You don't have to do
 * anything special to choose one license or the other and you don't have to
 * notify anyone which license you are using. You are free to use
 * UniversalLanguageSelector in commercial projects as long as the copyright
 * header is left intact. See files GPL-LICENSE and MIT-LICENSE for details.
 *
 * @licence GNU General Public Licence 2.0 or later
 * @licence MIT License
 */

( function ( $ ) {
	'use strict';

	var MessageParser = function ( options ) {
		this.options = $.extend( {}, $.i18n.parser.defaults, options );
		this.language = $.i18n.languages[ String.locale ] || $.i18n.languages[ 'default' ];
		this.emitter = $.i18n.parser.emitter;
	};

	MessageParser.prototype = {

		constructor: MessageParser,

		simpleParse: function ( message, parameters ) {
			return message.replace( /\$(\d+)/g, function ( str, match ) {
				var index = parseInt( match, 10 ) - 1;

				return parameters[ index ] !== undefined ? parameters[ index ] : '$' + match;
			} );
		},

		parse: function ( message, replacements ) {
			if ( message.indexOf( '{{' ) < 0 ) {
				return this.simpleParse( message, replacements );
			}

			this.emitter.language = $.i18n.languages[ $.i18n().locale ] ||
				$.i18n.languages[ 'default' ];

			return this.emitter.emit( this.ast( message ), replacements );
		},

		ast: function ( message ) {
			var pipe, colon, backslash, anyCharacter, dollar, digits, regularLiteral,
				regularLiteralWithoutBar, regularLiteralWithoutSpace, escapedOrLiteralWithoutBar,
				escapedOrRegularLiteral, templateContents, templateName, openTemplate,
				closeTemplate, expression, paramExpression, result,
				pos = 0;

			// Try parsers until one works, if none work return null
			function choice( parserSyntax ) {
				return function () {
					var i, result;

					for ( i = 0; i < parserSyntax.length; i++ ) {
						result = parserSyntax[ i ]();

						if ( result !== null ) {
							return result;
						}
					}

					return null;
				};
			}

			// Try several parserSyntax-es in a row.
			// All must succeed; otherwise, return null.
			// This is the only eager one.
			function sequence( parserSyntax ) {
				var i, res,
					originalPos = pos,
					result = [];

				for ( i = 0; i < parserSyntax.length; i++ ) {
					res = parserSyntax[ i ]();

					if ( res === null ) {
						pos = originalPos;

						return null;
					}

					result.push( res );
				}

				return result;
			}

			// Run the same parser over and over until it fails.
			// Must succeed a minimum of n times; otherwise, return null.
			function nOrMore( n, p ) {
				return function () {
					var originalPos = pos,
						result = [],
						parsed = p();

					while ( parsed !== null ) {
						result.push( parsed );
						parsed = p();
					}

					if ( result.length < n ) {
						pos = originalPos;

						return null;
					}

					return result;
				};
			}

			// Helpers -- just make parserSyntax out of simpler JS builtin types

			function makeStringParser( s ) {
				var len = s.length;

				return function () {
					var result = null;

					if ( message.slice( pos, pos + len ) === s ) {
						result = s;
						pos += len;
					}

					return result;
				};
			}

			function makeRegexParser( regex ) {
				return function () {
					var matches = message.slice( pos ).match( regex );

					if ( matches === null ) {
						return null;
					}

					pos += matches[ 0 ].length;

					return matches[ 0 ];
				};
			}

			pipe = makeStringParser( '|' );
			colon = makeStringParser( ':' );
			backslash = makeStringParser( '\\' );
			anyCharacter = makeRegexParser( /^./ );
			dollar = makeStringParser( '$' );
			digits = makeRegexParser( /^\d+/ );
			regularLiteral = makeRegexParser( /^[^{}[\]$\\]/ );
			regularLiteralWithoutBar = makeRegexParser( /^[^{}[\]$\\|]/ );
			regularLiteralWithoutSpace = makeRegexParser( /^[^{}[\]$\s]/ );

			// There is a general pattern:
			// parse a thing;
			// if it worked, apply transform,
			// otherwise return null.
			// But using this as a combinator seems to cause problems
			// when combined with nOrMore().
			// May be some scoping issue.
			function transform( p, fn ) {
				return function () {
					var result = p();

					return result === null ? null : fn( result );
				};
			}

			// Used to define "literals" within template parameters. The pipe
			// character is the parameter delimeter, so by default
			// it is not a literal in the parameter
			function literalWithoutBar() {
				var result = nOrMore( 1, escapedOrLiteralWithoutBar )();

				return result === null ? null : result.join( '' );
			}

			function literal() {
				var result = nOrMore( 1, escapedOrRegularLiteral )();

				return result === null ? null : result.join( '' );
			}

			function escapedLiteral() {
				var result = sequence( [ backslash, anyCharacter ] );

				return result === null ? null : result[ 1 ];
			}

			choice( [ escapedLiteral, regularLiteralWithoutSpace ] );
			escapedOrLiteralWithoutBar = choice( [ escapedLiteral, regularLiteralWithoutBar ] );
			escapedOrRegularLiteral = choice( [ escapedLiteral, regularLiteral ] );

			function replacement() {
				var result = sequence( [ dollar, digits ] );

				if ( result === null ) {
					return null;
				}

				return [ 'REPLACE', parseInt( result[ 1 ], 10 ) - 1 ];
			}

			templateName = transform(
				// see $wgLegalTitleChars
				// not allowing : due to the need to catch "PLURAL:$1"
				makeRegexParser( /^[ !"$&'()*,./0-9;=?@A-Z^_`a-z~\x80-\xFF+-]+/ ),

				function ( result ) {
					return result.toString();
				}
			);

			function templateParam() {
				var expr,
					result = sequence( [ pipe, nOrMore( 0, paramExpression ) ] );

				if ( result === null ) {
					return null;
				}

				expr = result[ 1 ];

				// use a "CONCAT" operator if there are multiple nodes,
				// otherwise return the first node, raw.
				return expr.length > 1 ? [ 'CONCAT' ].concat( expr ) : expr[ 0 ];
			}

			function templateWithReplacement() {
				var result = sequence( [ templateName, colon, replacement ] );

				return result === null ? null : [ result[ 0 ], result[ 2 ] ];
			}

			function templateWithOutReplacement() {
				var result = sequence( [ templateName, colon, paramExpression ] );

				return result === null ? null : [ result[ 0 ], result[ 2 ] ];
			}

			templateContents = choice( [
				function () {
					var res = sequence( [
						// templates can have placeholders for dynamic
						// replacement eg: {{PLURAL:$1|one car|$1 cars}}
						// or no placeholders eg:
						// {{GRAMMAR:genitive|{{SITENAME}}}
						choice( [ templateWithReplacement, templateWithOutReplacement ] ),
						nOrMore( 0, templateParam )
					] );

					return res === null ? null : res[ 0 ].concat( res[ 1 ] );
				},
				function () {
					var res = sequence( [ templateName, nOrMore( 0, templateParam ) ] );

					if ( res === null ) {
						return null;
					}

					return [ res[ 0 ] ].concat( res[ 1 ] );
				}
			] );

			openTemplate = makeStringParser( '{{' );
			closeTemplate = makeStringParser( '}}' );

			function template() {
				var result = sequence( [ openTemplate, templateContents, closeTemplate ] );

				return result === null ? null : result[ 1 ];
			}

			expression = choice( [ template, replacement, literal ] );
			paramExpression = choice( [ template, replacement, literalWithoutBar ] );

			function start() {
				var result = nOrMore( 0, expression )();

				if ( result === null ) {
					return null;
				}

				return [ 'CONCAT' ].concat( result );
			}

			result = start();

			/*
			 * For success, the pos must have gotten to the end of the input
			 * and returned a non-null.
			 * n.b. This is part of language infrastructure, so we do not throw an
			 * internationalizable message.
			 */
			if ( result === null || pos !== message.length ) {
				throw new Error( 'Parse error at position ' + pos.toString() + ' in input: ' + message );
			}

			return result;
		}

	};

	$.extend( $.i18n.parser, new MessageParser() );
}( jQuery ) );

/***/ }),

/***/ 66563:
/*!***********************************************!*\
  !*** ./runestone/common/js/presenter_mode.js ***!
  \***********************************************/
/***/ (() => {

var codeExercises;
var presenterCssLink;
var presentModeInitialized = false;

function presentToggle() {
    if (!presentModeInitialized) {
        presentModeSetup();
        presentModeInitialized = true;
    }
    let bod = $("body");
    let presentClass = "present";
    let fullHeightClass = "full-height";
    let bottomClass = "bottom";
    if (bod.hasClass(presentClass)) {
        $(".section *")
            .not(
                "h1, .presentation-title, .btn-presenter, .runestone, .runestone *, .section, .pre, code"
            )
            .removeClass("hidden"); //show everything
        $("#completionButton").removeClass("hidden");
        bod.removeClass(presentClass);
        $("." + fullHeightClass).removeClass(fullHeightClass);
        $("." + bottomClass).removeClass(bottomClass);
        localStorage.setItem("presentMode", "text");
        codeExercises.removeClass("hidden");
        presenterCssLink.disabled = true; // disable present_mode.css
    } else {
        $(".section *")
            .not(
                "h1, .presentation-title, .btn-presenter, .runestone, .runestone *, .section, .pre, code"
            )
            .addClass("hidden"); // hide extraneous stuff
        $("#completionButton").addClass("hidden");
        bod.addClass(presentClass);
        bod.addClass(fullHeightClass);
        $("html").addClass(fullHeightClass);
        $(".section .runestone").addClass(fullHeightClass);
        $(".ac-caption").addClass(bottomClass);
        localStorage.setItem("presentMode", presentClass);
        loadPresenterCss(); // present_mode.css should only apply when in presenter mode.
        activateExercise();
    }
}

function loadPresenterCss() {
    presenterCssLink = document.createElement("link");
    presenterCssLink.type = "text/css";
    presenterCssLink.href = "../_static/presenter_mode.css";
    presenterCssLink.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(presenterCssLink);
}

function presentModeSetup() {
    // moved this out of configure
    let dataComponent = $("[data-childcomponent]");

    // this still leaves some things semi-messed up when you exit presenter mode.
    // but instructors will probably just learn to refresh the page.
    dataComponent.addClass("runestone");
    dataComponent.parent().closest("div").not(".section").addClass("runestone");
    dataComponent.parent().closest("div").css("max-width", "none");

    dataComponent.each(function (index) {
        let me = $(this);
        $(this)
            .find(".ac_code_div, .ac_output")
            .wrapAll("<div class='ac-block' style='width: 100%;'></div>");
    });

    codelensListener(500);
    $(".section img").wrap('<div class="runestone">');
    codeExercises = $(".runestone").not(".runestone .runestone");
    // codeExercises.each(function(){
    $("h1").before(
        "<div class='presentation-title'> \
        <button class='prev-exercise btn-presenter btn-grey-outline' onclick='prevExercise()'>Back</button> \
        <button class='next-exercise btn-presenter btn-grey-solid' onclick='nextExercise()'>Next</button> \
      </div>"
    );
}
function getActiveExercise() {
    return (active = codeExercises.filter(".active"));
}

function activateExercise(index) {
    if (typeof index == "undefined") {
        index = 0;
    }

    let active = getActiveExercise();

    if (codeExercises.length) {
        active.removeClass("active");
        active = $(codeExercises[index]).addClass("active");
        active.removeClass("hidden");
        codeExercises.not(codeExercises.filter(".active")).addClass("hidden");
    }
}

function nextExercise() {
    let active = getActiveExercise();
    let nextIndex = codeExercises.index(active) + 1;
    if (nextIndex < codeExercises.length) {
        activateExercise(nextIndex);
    }
}

function prevExercise() {
    let active = getActiveExercise();
    let prevIndex = codeExercises.index(active) - 1;
    if (prevIndex >= 0) {
        activateExercise(prevIndex);
    }
}

function configure() {
    let rightNav = $(".navbar-right");
    rightNav.prepend(
        "<li class='dropdown view-toggle'> \
      <label>View: \
        <select class='mode-select'> \
          <option value='text'>Textbook</option> \
          <option value='present'>Code Presenter</option> \
        </select> \
      </label> \
    </li>"
    );

    let modeSelect = $(".mode-select").change(presentToggle);
}

function codelensListener(duration) {
    // $(".ExecutionVisualizer").length ? configureCodelens() : setTimeout(codelensListener, duration);
    // configureCodelens();
}

function configureCodelens() {
    let acCodeTitle = document.createElement("h4");
    acCodeTitle.textContent = "Active Code Window";
    let acCode = $(".ac_code_div").removeClass("col-md-12");
    $(".ac_code_div").addClass("col-md-6");
    acCode.prepend(acCodeTitle);

    acOutTitle = document.createElement("h4");
    acOutTitle.textContent = "Output Window";
    let acOut = $(".ac_output").addClass("col-md-6");
    $(".ac_output").prepend(acOutTitle);

    let sketchpadTitle = document.createElement("h4");
    sketchpadTitle.textContent = "Sketchpad";
    let sketchpad = document.createElement("span");
    $(sketchpad).addClass("sketchpad");
    let sketchpadContainer = document.createElement("div");
    $(sketchpadContainer).addClass("sketchpad-container");
    sketchpadContainer.appendChild(sketchpadTitle);
    sketchpadContainer.appendChild(sketchpad);
    //$('.ac_output').append(sketchpadContainer);

    let visualizers = $(".ExecutionVisualizer");

    console.log("Econtainer: ", this.eContainer);

    $("[data-childcomponent]").on("click", "button.row-mode", function () {
        $(this).closest("[data-childcomponent]").removeClass("card-mode");
        $(this).closest("[data-childcomponent]").addClass("row-mode");
        $(this).next(".card-mode").removeClass("active-layout");
        $(this).addClass("active-layout");
    });

    $("[data-childcomponent]").on("click", "button.card-mode", function () {
        $(this).closest("[data-childcomponent]").removeClass("row-mode");
        $(this).closest("[data-childcomponent]").addClass("card-mode");
        $(this).prev(".row-mode").removeClass("active-layout");
        $(this).addClass("active-layout");
    });

    $("[data-childcomponent] .ac_section").each(function () {
        $(this).prepend(
            '<div class="presentation-options"><button class="row-mode layout-btn"><img src="../_images/row-btn-content.png" alt="Rows"></button><button class="card-mode layout-btn"><img src="../_images/card-btn-content.png" alt="Card"></button></div>'
        );
    });

    visualizers.each(function (index) {
        let me = $(this);
        let col1 = me.find("#vizLayoutTdFirst");
        let col2 = me.find("#vizLayoutTdSecond");
        let dataVis = me.find("#dataViz");
        let stackHeapTable = me.find("#stackHeapTable");
        let output = me.find("#progOutputs");
        output.css("display", "block");
        me.parent().prepend(
            "<div class='presentation-title'><div class='title-text'> Example " +
                (Number(index) + 1) +
                "</div></div>"
        );
    });

    acCode.each(function () {
        let section = $(this).closest(".ac-block").parent();
        console.log(section, section.length);
        section.append(sketchpadContainer);
    });

    $("button.card-mode").click();

    let modeSelect = $(".mode-select");
    let mode = localStorage.getItem("presentMode");
    if (mode == "present") {
        modeSelect.val("present");
        modeSelect.change();
    }
}

$(document).bind("runestone:login-complete", function () {
    // if user is instructor, enable presenter mode
    if (eBookConfig.isInstructor) {
        configure();
    }
});


/***/ }),

/***/ 22538:
/*!****************************************!*\
  !*** ./runestone/common/js/pretext.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./runestonebase.js */ 2568);
/*
    Support functions for PreTeXt books running on Runestone

*/



function setupPTXEvents() {
    let rb = new _runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
    // log an event when a knowl is opened.
    $("[data-knowl").on("click", function () {
        let div_id = $(this).data("refid");
        rb.logBookEvent({ event: "knowl", act: "click", div_id: div_id });
    });
    // log an event when a sage cell is evaluated
    $(".sagecell_evalButton").on("click", function () {
        // find parents
        let container = $(this).closest(".sagecell-sage");
        let code = $(container[0]).find(".sagecell_input")[0].textContent;
        rb.logBookEvent({ event: "sage", act: "run", div_id: container[0].id });
    });
}

window.addEventListener("load", function () {
    console.log("setting up pretext");
    setupPTXEvents();
});


/***/ }),

/***/ 2568:
/*!**********************************************!*\
  !*** ./runestone/common/js/runestonebase.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RunestoneBase)
/* harmony export */ });
/* harmony import */ var _bookfuncs_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bookfuncs.js */ 21294);
/* ********************************
 * |docname| - Runestone Base Class
 * ********************************
 * All runestone components should inherit from RunestoneBase. In addition all runestone components should do the following things:
 *
 * 1.   Ensure that they are wrapped in a div with the class runestone
 * 2.   Write their source AND their generated html to the database if the database is configured
 * 3.   Properly save and restore their answers using the checkServer mechanism in this base class. Each component must provide an implementation of:
 *
 *      -    checkLocalStorage
 *      -    setLocalStorage
 *      -    restoreAnswers
 *      -    disableInteraction
 *
 * 4.   provide a Selenium based unit test
 */


//import "./../styles/runestone-custom-sphinx-bootstrap.css";

class RunestoneBase {
    constructor(opts) {
        this.component_ready_promise = new Promise(
            (resolve) => (this._component_ready_resolve_fn = resolve)
        );
        this.optional = false;
        if (typeof window.allComponents === "undefined") {
            window.allComponents = [];
        }
        window.allComponents.push(this);
        if (opts) {
            this.sid = opts.sid;
            this.graderactive = opts.graderactive;
            this.showfeedback = true;
            if (opts.timed) {
                this.isTimed = true;
            }
            if (opts.enforceDeadline) {
                this.deadline = opts.deadline;
            }
            if ($(opts.orig).data("optional")) {
                this.optional = true;
            } else {
                this.optional = false;
            }
            if (opts.selector_id) {
                this.selector_id = opts.selector_id;
            }
            if (typeof opts.assessmentTaken !== "undefined") {
                this.assessmentTaken = opts.assessmentTaken;
            } else {
                // default to true as this opt is only provided from a timedAssessment
                this.assessmentTaken = true;
            }
            // This is for the selectquestion points
            // If a selectquestion is part of a timed exam it will get
            // the timedWrapper options.
            if (typeof opts.timedWrapper !== "undefined") {
                this.timedWrapper = opts.timedWrapper;
            } else {
                // However sometimes selectquestions
                // are used in regular assignments.  The hacky way to detect this
                // is to look for doAssignment in the URL and then grab
                // the assignment name from the heading.
                if (location.href.indexOf("doAssignment") >= 0) {
                    this.timedWrapper = $("h1#assignment_name").text();
                } else {
                    this.timedWrapper = null;
                }
            }
            if ($(opts.orig).data("question_label")) {
                this.question_label = $(opts.orig).data("question_label");
            }
            this.is_toggle =  true ? opts.is_toggle : 0;
            this.is_select =  true ? opts.is_select : 0;
        }
        this.jsonHeaders = new Headers({
            "Content-type": "application/json; charset=utf-8",
            Accept: "application/json",
        });
    }

    // _`logBookEvent`
    //----------------
    // This function sends the provided ``eventInfo`` to the `hsblog endpoint` of the server. Awaiting this function returns either ``undefined`` (if Runestone services are not available) or the data returned by the server as a JavaScript object (already JSON-decoded).
    async logBookEvent(eventInfo) {
        if (this.graderactive) {
            return;
        }
        let post_return;
        eventInfo.course_name = eBookConfig.course;
        eventInfo.clientLoginStatus = eBookConfig.isLoggedIn;
        eventInfo.timezoneoffset = new Date().getTimezoneOffset() / 60;
        if (this.percent) {
            eventInfo.percent = this.percent;
        }
        if (eBookConfig.useRunestoneServices && eBookConfig.logLevel > 0) {
            post_return = this.postLogMessage(eventInfo);
        }
        if (!this.isTimed || eBookConfig.debug) {
            console.log("logging event " + JSON.stringify(eventInfo));
        }
        // When selectquestions are part of an assignment especially toggle questions
        // we need to count using the selector_id of the select question.
        // We  also need to log an event for that selector so that we will know
        // that interaction has taken place.  This is **independent** of how the
        // autograder will ultimately grade the question!
        if (this.selector_id) {
            eventInfo.div_id = this.selector_id.replace(
                "-toggleSelectedQuestion",
                ""
            );
            eventInfo.event = "selectquestion";
            eventInfo.act = "interaction";
            this.postLogMessage(eventInfo);
        }
        if (
            typeof _bookfuncs_js__WEBPACK_IMPORTED_MODULE_0__.pageProgressTracker.updateProgress === "function" &&
            eventInfo.act != "edit" &&
            this.optional == false
        ) {
            _bookfuncs_js__WEBPACK_IMPORTED_MODULE_0__.pageProgressTracker.updateProgress(eventInfo.div_id);
        }
        return post_return;
    }

    async postLogMessage(eventInfo) {
        var post_return;
        let request = new Request(
            `${eBookConfig.new_server_prefix}/logger/bookevent`,
            {
                method: "POST",
                headers: this.jsonHeaders,
                body: JSON.stringify(eventInfo),
            }
        );
        try {
            let response = await fetch(request);
            if (!response.ok) {
                if (response.status === 422) {
                    // Get details about why this is unprocesable.
                    post_return = await response.json();
                    console.log(post_return.detail);
                    throw new Error("Unprocessable Request");
                } else if (response.status == 401) {
                    post_return = await response.json();
                    console.log(
                        `Missing authentication token ${post_return.detail}`
                    );
                    throw new Error("Missing authentication token");
                }
                throw new Error(`Failed to save the log entry
                    Status: ${response.status}`);
            }
            post_return = response.json();
        } catch (e) {
            let detail = "none";
            if (post_return.detail) {
                detail = post_return.detail;
            }
            if (eBookConfig.loginRequired) {
                alert(`Error: Your action was not saved! 
                    The error was ${e} 
                    Detail: ${detail}. 
                    Please report this error!`);
            }
            // send a request to save this error
            console.log(`Error: ${e} Detail: ${detail}`);
        }
        return post_return;
    }
    // .. _logRunEvent:
    //
    // logRunEvent
    // -----------
    // This function sends the provided ``eventInfo`` to the `runlog endpoint`. When awaited, this function returns the data (decoded from JSON) the server sent back.
    async logRunEvent(eventInfo) {
        let post_promise = "done";
        if (this.graderactive) {
            return;
        }
        eventInfo.course = eBookConfig.course;
        eventInfo.clientLoginStatus = eBookConfig.isLoggedIn;
        eventInfo.timezoneoffset = new Date().getTimezoneOffset() / 60;
        if (this.forceSave || "to_save" in eventInfo === false) {
            eventInfo.save_code = "True";
        }
        if (eBookConfig.useRunestoneServices && eBookConfig.logLevel > 0) {
            let request = new Request(
                `${eBookConfig.new_server_prefix}/logger/runlog`,
                {
                    method: "POST",
                    headers: this.jsonHeaders,
                    body: JSON.stringify(eventInfo),
                }
            );
            let response = await fetch(request);
            if (!response.ok) {
                post_promise = await response.json();
                if (eBookConfig.loginRequired) {
                    alert(`Failed to save your code
                        Status is ${response.status}
                        Detail: ${post_promise.detail}`);
                } else {
                    console.log(
                        `Did not save the code. Status: ${response.status}`
                    );
                }
            } else {
                post_promise = await response.json();
            }
        }
        if (!this.isTimed || eBookConfig.debug) {
            console.log("running " + JSON.stringify(eventInfo));
        }
        if (
            typeof _bookfuncs_js__WEBPACK_IMPORTED_MODULE_0__.pageProgressTracker.updateProgress === "function" &&
            this.optional == false
        ) {
            _bookfuncs_js__WEBPACK_IMPORTED_MODULE_0__.pageProgressTracker.updateProgress(eventInfo.div_id);
        }
        return post_promise;
    }
    /* Checking/loading from storage
    **WARNING:**  DO NOT `await` this function!
    This function, although async, does not explicitly resolve its promise by returning a value.  The reason for this is because it is called by the constructor for nearly every component.  In Javascript constructors cannot be async!

    One of the recommended ways to handle the async requirements from within a constructor is to use an attribute as a promise and resolve that attribute at the appropriate time.
    */
    async checkServer(
        // A string specifying the event name to use for querying the :ref:`getAssessResults` endpoint.
        eventInfo,
        // If true, this function will invoke ``indicate_component_ready()`` just before it returns. This is provided since most components are ready after this function completes its work.
        //
        // TODO: This defaults to false, to avoid causing problems with any components that haven't been updated and tested. After all Runestone components have been updated, default this to true and remove the extra parameter from most calls to this function.
        will_be_ready = false
    ) {
        // Check if the server has stored answer
        let self = this;
        this.checkServerComplete = new Promise(function (resolve, reject) {
            self.csresolver = resolve;
        });
        if (
            eBookConfig.isLoggedIn &&
            (this.useRunestoneServices || this.graderactive)
        ) {
            let data = {};
            data.div_id = this.divid;
            data.course = eBookConfig.course;
            data.event = eventInfo;
            if (this.graderactive && this.deadline) {
                data.deadline = this.deadline;
                data.rawdeadline = this.rawdeadline;
                data.tzoff = this.tzoff;
            }
            if (this.sid) {
                data.sid = this.sid;
            }
            if (!(data.div_id && data.course && data.event)) {
                console.log(
                    `A required field is missing data ${data.div_id}:${data.course}:${data.event}`
                );
            }
            // If we are NOT in practice mode and we are not in a peer exercise
            // and assessmentTaken is true
            if (
                !eBookConfig.practice_mode &&
                !eBookConfig.peer &&
                this.assessmentTaken
            ) {
                let request = new Request(
                    `${eBookConfig.new_server_prefix}/assessment/results`,
                    {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: this.jsonHeaders,
                    }
                );
                try {
                    let response = await fetch(request);
                    if (response.ok) {
                        data = await response.json();
                        data = data.detail;
                        this.repopulateFromStorage(data);
                        this.csresolver("server");
                    } else {
                        console.log(
                            `HTTP Error getting results: ${response.statusText}`
                        );
                        this.checkLocalStorage(); // just go right to local storage
                        this.csresolver("local");
                    }
                } catch (err) {
                    try {
                        this.checkLocalStorage();
                    } catch (err) {
                        console.log(err);
                    }
                }
            } else {
                this.loadData({});
                this.csresolver("not taken");
            }
        } else {
            this.checkLocalStorage(); // just go right to local storage
            this.csresolver("local");
        }

        if (will_be_ready) {
            this.indicate_component_ready();
        }
    }

    // This method assumes that ``this.componentDiv`` refers to the ``div`` containing the component, and that this component's ID is set.
    indicate_component_ready() {
        // Add a class to indicate the component is now ready.
        this.containerDiv.classList.add("runestone-component-ready");
        // Resolve the ``this.component_ready_promise``.
        this._component_ready_resolve_fn();
    }

    loadData(data) {
        // for most classes, loadData doesn't do anything. But for Parsons, and perhaps others in the future,
        // initialization can happen even when there's no history to be loaded
        return null;
    }

    /**
     * repopulateFromStorage is called after a successful API call is made to ``getAssessResults`` in
     * the checkServer method in this class
     *
     * ``restoreAnswers,`` ``setLocalStorage`` and ``checkLocalStorage`` are defined in the child classes.
     *
     * @param {*} data - a JSON object representing the data needed to restore a previous answer for a component
     * @param {*} status - the http status
     * @param {*} whatever - ignored
     */
    repopulateFromStorage(data) {
        // decide whether to use the server's answer (if there is one) or to load from storage
        if (data !== null && data !== "no data" && this.shouldUseServer(data)) {
            this.restoreAnswers(data);
            this.setLocalStorage(data);
        } else {
            this.checkLocalStorage();
        }
    }
    shouldUseServer(data) {
        // returns true if server data is more recent than local storage or if server storage is correct
        if (
            data.correct === "T" ||
            localStorage.length === 0 ||
            this.graderactive === true ||
            this.isTimed
        ) {
            return true;
        }
        let ex = localStorage.getItem(this.localStorageKey());
        if (ex === null) {
            return true;
        }
        let storedData;
        try {
            storedData = JSON.parse(ex);
        } catch (err) {
            // error while parsing; likely due to bad value stored in storage
            console.log(err.message);
            localStorage.removeItem(this.localStorageKey());
            // definitely don't want to use local storage here
            return true;
        }
        if (data.answer == storedData.answer) return true;
        let storageDate = new Date(storedData.timestamp);
        let serverDate = new Date(data.timestamp);
        return serverDate >= storageDate;
    }
    // Return the key which to be used when accessing local storage.
    localStorageKey() {
        return (
            eBookConfig.email +
            ":" +
            eBookConfig.course +
            ":" +
            this.divid +
            "-given"
        );
    }
    addCaption(elType) {
        //someElement.parentNode.insertBefore(newElement, someElement.nextSibling);
        if (!this.isTimed) {
            var capDiv = document.createElement("p");
            if (this.question_label) {
                this.caption = `Activity: ${this.question_label} ${this.caption}  <span class="runestone_caption_divid">(${this.divid})</span>`;
                $(capDiv).html(this.caption);
                $(capDiv).addClass(`${elType}_caption`);
            } else {
                $(capDiv).html(this.caption + " (" + this.divid + ")");
                $(capDiv).addClass(`${elType}_caption`);
                $(capDiv).addClass(`${elType}_caption_text`);
            }
            this.capDiv = capDiv;
            //this.outerDiv.parentNode.insertBefore(capDiv, this.outerDiv.nextSibling);
            this.containerDiv.appendChild(capDiv);
        }
    }

    hasUserActivity() {
        return this.isAnswered;
    }

    checkCurrentAnswer() {
        console.log(
            "Each component should provide an implementation of checkCurrentAnswer"
        );
    }

    async logCurrentAnswer() {
        console.log(
            "Each component should provide an implementation of logCurrentAnswer"
        );
    }
    renderFeedback() {
        console.log(
            "Each component should provide an implementation of renderFeedback"
        );
    }
    disableInteraction() {
        console.log(
            "Each component should provide an implementation of disableInteraction"
        );
    }

    toString() {
        return `${this.constructor.name}: ${this.divid}`;
    }

    queueMathJax(component) {
        if (MathJax.version.substring(0, 1) === "2") {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, component]);
        } else {
            MathJax.typesetPromise([component]);
        }
    }
}

window.RunestoneBase = RunestoneBase;


/***/ }),

/***/ 75106:
/*!**************************************!*\
  !*** ./runestone/common/js/theme.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getSwitch": () => (/* binding */ getSwitch),
/* harmony export */   "switchTheme": () => (/* binding */ switchTheme)
/* harmony export */ });
function getSwitch() {
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);

        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
        }
    }
}

function switchTheme() {

	var checkBox = document.getElementById("checkbox");
    if (checkBox.checked == true) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark'); //add this
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light'); //add this
    }
}


/***/ }),

/***/ 70114:
/*!************************************************!*\
  !*** ./runestone/common/js/user-highlights.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _css_user_highlights_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css/user-highlights.css */ 88874);
/*global variable declarations*/






function getCompletions() {
    // Get the completion status
    if (
        window.location.href.match(
            /(index.html|toctree.html|genindex.html|navhelp.html|toc.html|assignments.html|Exercises.html)/
        )
    ) {
        return;
    }

    var currentPathname = window.location.pathname;
    if (currentPathname.indexOf("?") !== -1) {
        currentPathname = currentPathname.substring(
            0,
            currentPathname.lastIndexOf("?")
        );
    }
    var data = { lastPageUrl: currentPathname };
    jQuery
        .ajax({
            url: `${eBookConfig.new_server_prefix}/logger/getCompletionStatus`,
            data: data,
            async: false,
        })
        .done(function (data) {
            if (data != "None") {
                var completionData = data.detail;
                var completionClass, completionMsg;
                if (completionData[0].completionStatus == 1) {
                    completionClass = "buttonConfirmCompletion";
                    completionMsg =
                        "<i class='glyphicon glyphicon-ok'></i> Completed. Well Done!";
                } else {
                    completionClass = "buttonAskCompletion";
                    completionMsg = "Mark as Completed";
                }
                $("#main-content").append(
                    '<div style="text-align:center"><button class="btn btn-lg ' +
                    completionClass +
                    '" id="completionButton">' +
                    completionMsg +
                    "</button></div>"
                );
            }
        });
}

function showLastPositionBanner() {
    var lastPositionVal = $.getUrlVar("lastPosition");
    if (typeof lastPositionVal !== "undefined") {
        $("body").append(
            '<img src="../_static/last-point.png" style="position:absolute; padding-top:55px; left: 10px; top: ' +
            parseInt(lastPositionVal) +
            'px;"/>'
        );
        $("html, body").animate({ scrollTop: parseInt(lastPositionVal) }, 1000);
    }
}

function addNavigationAndCompletionButtons() {
    if (
        window.location.href.match(
            /(index.html|genindex.html|navhelp.html|toc.html|assignments.html|Exercises.html|toctree.html)/
        )
    ) {
        return;
    }
    var navLinkBgRightHiddenPosition = -$("#navLinkBgRight").outerWidth() - 5;
    var navLinkBgRightHalfOpen;
    var navLinkBgRightFullOpen = 0;

    if ($("#completionButton").hasClass("buttonAskCompletion")) {
        navLinkBgRightHalfOpen = navLinkBgRightHiddenPosition + 70;
    } else if ($("#completionButton").hasClass("buttonConfirmCompletion")) {
        navLinkBgRightHalfOpen = 0;
    }
    var relationsNextIconInitialPosition = $("#relations-next").css("right");
    var relationsNextIconNewPosition = -(navLinkBgRightHiddenPosition + 35);

    $("#navLinkBgRight").css("right", navLinkBgRightHiddenPosition).show();
    var navBgShown = false;
    $(window).scroll(function () {
        if (
            $(window).scrollTop() + $(window).height() ==
            $(document).height()
        ) {
            $("#navLinkBgRight").animate(
                { right: navLinkBgRightHalfOpen },
                200
            );
            $("#navLinkBgLeft").animate({ left: "0px" }, 200);
            if ($("#completionButton").hasClass("buttonConfirmCompletion")) {
                $("#relations-next").animate(
                    { right: relationsNextIconNewPosition },
                    200
                );
            }
            navBgShown = true;
        } else if (navBgShown) {
            $("#navLinkBgRight").animate(
                { right: navLinkBgRightHiddenPosition },
                200
            );
            $("#navLinkBgLeft").animate({ left: "-65px" }, 200);
            $("#relations-next").animate({
                right: relationsNextIconInitialPosition,
            });
            navBgShown = false;
        }
    });

    var completionFlag = 0;
    if ($("#completionButton").hasClass("buttonAskCompletion")) {
        completionFlag = 0;
    } else {
        completionFlag = 1;
    }
    // Make sure we mark this page as visited regardless of how flakey
    // the onunload handlers become.
    processPageState(completionFlag);
    $("#completionButton").on("click", function () {
        if ($(this).hasClass("buttonAskCompletion")) {
            $(this)
                .removeClass("buttonAskCompletion")
                .addClass("buttonConfirmCompletion")
                .html(
                    "<i class='glyphicon glyphicon-ok'></i> Completed. Well Done!"
                );
            $("#navLinkBgRight").animate({ right: navLinkBgRightFullOpen });
            $("#relations-next").animate({
                right: relationsNextIconNewPosition,
            });
            navLinkBgRightHalfOpen = 0;
            completionFlag = 1;
        } else if ($(this).hasClass("buttonConfirmCompletion")) {
            $(this)
                .removeClass("buttonConfirmCompletion")
                .addClass("buttonAskCompletion")
                .html("Mark as Completed");
            navLinkBgRightHalfOpen = navLinkBgRightHiddenPosition + 70;
            $("#navLinkBgRight").animate({ right: navLinkBgRightHalfOpen });
            $("#relations-next").animate({
                right: relationsNextIconInitialPosition,
            });
            completionFlag = 0;
        }
        processPageState(completionFlag);
    });

    $(window).on("beforeunload", function (e) {
        if (completionFlag == 0) {
            processPageState(completionFlag);
        }
    });
}

// _ decorateTableOfContents
// -------------------------
function decorateTableOfContents() {
    if (
        window.location.href.toLowerCase().indexOf("toc.html") != -1 ||
        window.location.href.toLowerCase().indexOf("index.html") != -1
    ) {
        jQuery.get(`${eBookConfig.new_server_prefix}/logger/getAllCompletionStatus`, function (
            data
        ) {
            var subChapterList;
            if (data != "None") {
                subChapterList = data.detail;

                var allSubChapterURLs = $("#main-content div li a");
                $.each(subChapterList, function (index, item) {
                    for (var s = 0; s < allSubChapterURLs.length; s++) {
                        if (
                            allSubChapterURLs[s].href.indexOf(
                                item.chapterName + "/" + item.subChapterName
                            ) != -1
                        ) {
                            if (item.completionStatus == 1) {
                                $(allSubChapterURLs[s].parentElement)
                                    .addClass("completed")
                                    .append(
                                        '<span class="infoTextCompleted">- Completed this topic on ' +
                                        item.endDate +
                                        "</span>"
                                    )
                                    .children()
                                    .first()
                                    .hover(
                                        function () {
                                            $(this)
                                                .next(".infoTextCompleted")
                                                .show();
                                        },
                                        function () {
                                            $(this)
                                                .next(".infoTextCompleted")
                                                .hide();
                                        }
                                    );
                            } else if (item.completionStatus == 0) {
                                $(allSubChapterURLs[s].parentElement)
                                    .addClass("active")
                                    .append(
                                        '<span class="infoTextActive">Last read this topic on ' +
                                        item.endDate +
                                        "</span>"
                                    )
                                    .children()
                                    .first()
                                    .hover(
                                        function () {
                                            $(this)
                                                .next(".infoTextActive")
                                                .show();
                                        },
                                        function () {
                                            $(this)
                                                .next(".infoTextActive")
                                                .hide();
                                        }
                                    );
                            }
                        }
                    }
                });
            }
        });
        var data = { course: eBookConfig.course };
        jQuery.get(`${eBookConfig.new_server_prefix}/logger/getlastpage`, data, function (data) {
            var lastPageData;
            if (data != "None") {
                lastPageData = data.detail;
                if (lastPageData.lastPageChapter != null) {
                    $("#continue-reading")
                        .show()
                        .html(
                            '<div id="jump-to-chapter" class="alert alert-info" ><strong>You were Last Reading:</strong> ' +
                            lastPageData.lastPageChapter +
                            (lastPageData.lastPageSubchapter
                                ? " &gt; " +
                                lastPageData.lastPageSubchapter
                                : "") +
                            ' <a href="' +
                            lastPageData.lastPageUrl +
                            "?lastPosition=" +
                            lastPageData.lastPageScrollLocation +
                            '">Continue Reading</a></div>'
                        );
                }
            }
        });
    }
}

function enableCompletions() {
    getCompletions();
    showLastPositionBanner();
    addNavigationAndCompletionButtons();
    decorateTableOfContents();
}

// call enable user highlights after login
$(document).bind("runestone:login", enableCompletions);

// _ processPageState
// -------------------------
function processPageState(completionFlag) {
    /*Log last page visited*/
    var currentPathname = window.location.pathname;
    if (currentPathname.indexOf("?") !== -1) {
        currentPathname = currentPathname.substring(
            0,
            currentPathname.lastIndexOf("?")
        );
    }
    var data = {
        lastPageUrl: currentPathname,
        lastPageScrollLocation: $(window).scrollTop(),
        completionFlag: completionFlag,
        course: eBookConfig.course,
    };
    $(document).ajaxError(function (e, jqhxr, settings, exception) {
        console.log("Request Failed for " + settings.url);
        console.log(e);
    });
    jQuery.ajax({
        url: `${eBookConfig.new_server_prefix}/logger/updatelastpage`,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
        method: "POST",
        async: true,
    });
}

$.extend({
    getUrlVars: function () {
        var vars = [],
            hash;
        var hashes = window.location.search
            .slice(window.location.search.indexOf("?") + 1)
            .split("&");
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split("=");
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function (name) {
        return $.getUrlVars()[name];
    },
});


/***/ }),

/***/ 11968:
/*!*****************************************************************************************************************!*\
  !*** ./runestone/common/project_template/_templates/plugin_layouts/sphinx_bootstrap/static/bootstrap-sphinx.js ***!
  \*****************************************************************************************************************/
/***/ (() => {

(function ($) {
  /**
   * Patch TOC list.
   *
   * Will mutate the underlying span to have a correct ul for nav.
   *
   * @param $span: Span containing nested UL's to mutate.
   * @param minLevel: Starting level for nested lists. (1: global, 2: local).
   */
  var patchToc = function ($ul, minLevel) {
    var findA,
      patchTables,
      $localLi;

    // Find all a "internal" tags, traversing recursively.
    findA = function ($elem, level) {
      level = level || 0;
      var $items = $elem.find("> li > a.internal, > ul, > li > ul");

      // Iterate everything in order.
      $items.each(function (index, item) {
        var $item = $(item),
          tag = item.tagName.toLowerCase(),
          $childrenLi = $item.children('li'),
          $parentLi = $($item.parent('li'), $item.parent().parent('li'));

        // Add dropdowns if more children and above minimum level.
        if (tag === 'ul' && level >= minLevel && $childrenLi.length > 0) {
          $parentLi
            .addClass('dropdown-submenu')
            .children('a').first().attr('tabindex', -1);

          $item.addClass('dropdown-menu');
        }

        findA($item, level + 1);
      });
    };

    findA($ul);
  };

  /**
   * Patch all tables to remove ``docutils`` class and add Bootstrap base
   * ``table`` class.
   */
  patchTables = function () {
    $("table.docutils")
      .removeClass("docutils")
      .addClass("table")
      .attr("border", 0);
  };

$(function () {

    /*
     * Scroll the window to avoid the topnav bar
     * https://github.com/twitter/bootstrap/issues/1768
     */
    if ($("#navbar.navbar-fixed-top").length > 0) {
      var navHeight = $("#navbar").height(),
        shiftWindow = function() { scrollBy(0, -navHeight - 10); };

      if (location.hash) {
        shiftWindow();
      }

      window.addEventListener("hashchange", shiftWindow);
    }

    // Add styling, structure to TOC's.
    $(".dropdown-menu").each(function () {
      $(this).find("ul").each(function (index, item){
        var $item = $(item);
        $item.addClass('unstyled');
      });
    });

    // Global TOC.
    if ($("ul.globaltoc li").length) {
      patchToc($("ul.globaltoc"), 1);
    } else {
      // Remove Global TOC.
      $(".globaltoc-container").remove();
    }

    // Local TOC.
    patchToc($("ul.localtoc"), 2);

    // Mutate sub-lists (for bs-2.3.0).
    $(".dropdown-menu ul").not(".dropdown-menu").each(function () {
      var $ul = $(this),
        $parent = $ul.parent(),
        tag = $parent[0].tagName.toLowerCase(),
        $kids = $ul.children().detach();

      // Replace list with items if submenu header.
      if (tag === "ul") {
        $ul.replaceWith($kids);
      } else if (tag === "li") {
        // Insert into previous list.
        $parent.after($kids);
        $ul.remove();
      }
    });

    // Add divider in page TOC.
    $localLi = $("ul.localtoc li");
    if ($localLi.length > 2) {
      $localLi.first().after('<li class="divider"></li>');
    }

    // Enable dropdown.
    $('.dropdown-toggle').dropdown();

    // Patch tables.
    patchTables();

    // Add Note, Warning styles.
    $('div.note').addClass('alert').addClass('alert-info');
    $('div.warning').addClass('alert').addClass('alert-warning');

    // Inline code styles to Bootstrap style.
    $('tt.docutils.literal').not(".xref").each(function (i, e) {
      // ignore references
      if (!$(e).parent().hasClass("reference")) {
        $(e).replaceWith(function () {
          return $("<code />").text($(this).text());
        });
      }});
  });
}(window.jQuery));


/***/ }),

/***/ 36350:
/*!**************************!*\
  !*** ./webpack.index.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "runestone_auto_import": () => (/* binding */ runestone_auto_import),
/* harmony export */   "runestone_import": () => (/* binding */ runestone_import)
/* harmony export */ });
/* harmony import */ var jquery_ui_jquery_ui_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery-ui/jquery-ui.js */ 86301);
/* harmony import */ var jquery_ui_jquery_ui_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery_ui_jquery_ui_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var jquery_ui_themes_base_jquery_ui_all_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jquery-ui/themes/base/jquery.ui.all.css */ 47581);
/* harmony import */ var _runestone_common_js_jquery_idle_timer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./runestone/common/js/jquery.idle-timer.js */ 26886);
/* harmony import */ var _runestone_common_js_jquery_idle_timer_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_jquery_idle_timer_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./runestone/common/js/jquery_i18n/jquery.i18n.js */ 99283);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_jquery_i18n_jquery_i18n_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_emitter_bidi_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./runestone/common/js/jquery_i18n/jquery.i18n.emitter.bidi.js */ 43793);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_emitter_bidi_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_jquery_i18n_jquery_i18n_emitter_bidi_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_emitter_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./runestone/common/js/jquery_i18n/jquery.i18n.emitter.js */ 30423);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_emitter_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_jquery_i18n_jquery_i18n_emitter_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_fallbacks_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./runestone/common/js/jquery_i18n/jquery.i18n.fallbacks.js */ 9001);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_fallbacks_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_jquery_i18n_jquery_i18n_fallbacks_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_messagestore_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./runestone/common/js/jquery_i18n/jquery.i18n.messagestore.js */ 34517);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_messagestore_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_jquery_i18n_jquery_i18n_messagestore_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_parser_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./runestone/common/js/jquery_i18n/jquery.i18n.parser.js */ 25252);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_parser_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_jquery_i18n_jquery_i18n_parser_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_language_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./runestone/common/js/jquery_i18n/jquery.i18n.language.js */ 64793);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_language_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_jquery_i18n_jquery_i18n_language_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var bootstrap_dist_js_bootstrap_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! bootstrap/dist/js/bootstrap.js */ 43734);
/* harmony import */ var bootstrap_dist_js_bootstrap_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(bootstrap_dist_js_bootstrap_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var bootstrap_dist_css_bootstrap_css__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! bootstrap/dist/css/bootstrap.css */ 97318);
/* harmony import */ var _runestone_common_project_template_templates_plugin_layouts_sphinx_bootstrap_static_bootstrap_sphinx_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./runestone/common/project_template/_templates/plugin_layouts/sphinx_bootstrap/static/bootstrap-sphinx.js */ 11968);
/* harmony import */ var _runestone_common_project_template_templates_plugin_layouts_sphinx_bootstrap_static_bootstrap_sphinx_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_project_template_templates_plugin_layouts_sphinx_bootstrap_static_bootstrap_sphinx_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _runestone_common_css_runestone_custom_sphinx_bootstrap_css__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./runestone/common/css/runestone-custom-sphinx-bootstrap.css */ 64778);
/* harmony import */ var _runestone_common_js_bookfuncs_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./runestone/common/js/bookfuncs.js */ 21294);
/* harmony import */ var _runestone_common_js_user_highlights_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./runestone/common/js/user-highlights.js */ 70114);
/* harmony import */ var _runestone_common_js_pretext_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./runestone/common/js/pretext.js */ 22538);
/* harmony import */ var _runestone_matrixeq_css_matrixeq_css__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./runestone/matrixeq/css/matrixeq.css */ 23746);
/* harmony import */ var _runestone_webgldemo_css_webglinteractive_css__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./runestone/webgldemo/css/webglinteractive.css */ 86324);
/* harmony import */ var _runestone_common_js_theme_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./runestone/common/js/theme.js */ 75106);
/* harmony import */ var _runestone_common_js_presenter_mode_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./runestone/common/js/presenter_mode.js */ 66563);
/* harmony import */ var _runestone_common_js_presenter_mode_js__WEBPACK_IMPORTED_MODULE_20___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_presenter_mode_js__WEBPACK_IMPORTED_MODULE_20__);
/* harmony import */ var _runestone_common_css_presenter_mode_css__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./runestone/common/css/presenter_mode.css */ 88288);
// ***********************************************************************************
// |docname| - A framework allowing a Runestone component to load only the JS it needs
// ***********************************************************************************
// The JavaScript required by all Runestone components is quite large and results in slow page loads. This approach enables a Runestone component to load only the JavaScript it needs, rather than loading JavaScript for all the components regardless of which are actually used.
//
// To accomplish this, webpack's split-chunks ability analyzes all JS, starting from this file. The dynamic imports below are transformed by webpack into the dynamic fetches of just the JS required by each file and all its dependencies. (If using static imports, webpack will assume that all files are already statically loaded via script tags, defeating the purpose of this framework.)
//
// However, this approach leads to complexity:
//
// -    The ``data-component`` attribute of each component must be kept in sync with the keys of the ``module_map`` below.
// -    The values in the ``module_map`` must be kept in sync with the JavaScript files which implement each of the components.



// Static imports
// ==============
// These imports are (we assume) needed by all pages. However, it would be much better to load these in the modules that actually use them.
//
// These are static imports; code in `dynamically loaded components`_ deals with dynamic imports.
//
// jQuery-related imports.











// Bootstrap





// Misc




// These belong in dynamic imports for the obvious component; however, these components don't include a ``data-component`` attribute.



// These are only needed for the Runestone book, but not in a library mode (such as pretext). I would prefer to dynamically load them. However, these scripts are so small I haven't bothered to do so.




// Dynamically loaded components
// =============================
// This provides a list of modules that components can dynamically import. Webpack will create a list of imports for each based on its analysis.
const module_map = {
    // Wrap each import in a function, so that it won't occur until the function is called. While something cleaner would be nice, webpack can't analyze things like ``import(expression)``.
    //
    // The keys must match the value of each component's ``data-component`` attribute -- the ``runestone_import`` and ``runestone_auto_import`` functions assume this.
    activecode: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_handsontable_es_index_js-node_modules_handsontable_dist_handsontable_ful-dcc440"), __webpack_require__.e("vendors-node_modules_codemirror_mode_clike_clike_js-node_modules_codemirror_mode_javascript_j-f062af"), __webpack_require__.e("vendors-node_modules_codemirror_addon_edit_matchbrackets_js-node_modules_codemirror_addon_hin-ab90ac"), __webpack_require__.e("runestone_codelens_js_pytutor-embed_bundle_js"), __webpack_require__.e("node_modules_moment_locale_sync_recursive_-runestone_activecode_js_acfactory_js-node_modules_-ef73b3")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/activecode/js/acfactory.js */ 86902)),
    ble: () => __webpack_require__.e(/*! import() */ "runestone_cellbotics_js_ble_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/cellbotics/js/ble.js */ 14818)),
    // Always import the timed version of a component if available, since the timed components also define the component's factory and include the component as well. Note that ``acfactory`` imports the timed components of ActiveCode, so it follows this pattern.
    clickablearea: () =>
        Promise.all(/*! import() */[__webpack_require__.e("runestone_clickableArea_js_timedclickable_js"), __webpack_require__.e("runestone_clickableArea_css_clickable_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/clickableArea/js/timedclickable.js */ 61581)),
    codelens: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_codelens_js_pytutor-embed_bundle_js"), __webpack_require__.e("runestone_codelens_js_codelens_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/codelens/js/codelens.js */ 12882)),
    datafile: () => __webpack_require__.e(/*! import() */ "runestone_datafile_js_datafile_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/datafile/js/datafile.js */ 55789)),
    dragndrop: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_dragndrop_js_timeddnd_js"), __webpack_require__.e("runestone_dragndrop_css_dragndrop_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/dragndrop/js/timeddnd.js */ 47496)),
    fillintheblank: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_fitb_js_timedfitb_js"), __webpack_require__.e("runestone_fitb_css_fitb_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/fitb/js/timedfitb.js */ 74309)),
    groupsub: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_select2_dist_css_select2_css-node_modules_select2_dist_js_select2_min_js"), __webpack_require__.e("runestone_groupsub_js_groupsub_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/groupsub/js/groupsub.js */ 45280)),
    khanex: () => __webpack_require__.e(/*! import() */ "runestone_khanex_js_khanex_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/khanex/js/khanex.js */ 13435)),
    lp_build: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_codemirror_mode_clike_clike_js-node_modules_codemirror_mode_javascript_j-f062af"), __webpack_require__.e("runestone_lp_js_lp_js-node_modules_codemirror_lib_codemirror_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/lp/js/lp.js */ 2013)),
    multiplechoice: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_mchoice_js_timedmc_js"), __webpack_require__.e("runestone_mchoice_css_mchoice_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/mchoice/js/timedmc.js */ 95983)),
    hparsons: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_handsontable_es_index_js-node_modules_handsontable_dist_handsontable_ful-dcc440"), __webpack_require__.e("node_modules_moment_locale_sync_recursive_-runestone_hparsons_js_hparsons-sql_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/hparsons/js/hparsons-sql.js */ 97664)),
    parsons: () => __webpack_require__.e(/*! import() */ "runestone_parsons_js_timedparsons_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/parsons/js/timedparsons.js */ 79661)),
    poll: () => __webpack_require__.e(/*! import() */ "runestone_poll_js_poll_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/poll/js/poll.js */ 37350)),
    quizly: () => __webpack_require__.e(/*! import() */ "runestone_quizly_js_quizly_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/quizly/js/quizly.js */ 16207)),
    reveal: () => __webpack_require__.e(/*! import() */ "runestone_reveal_js_reveal_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/reveal/js/reveal.js */ 12632)),
    selectquestion: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_selectquestion_js_selectone_js"), __webpack_require__.e("runestone_selectquestion_css_selectquestion_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/selectquestion/js/selectone.js */ 63931)),
    shortanswer: () =>
        Promise.all(/*! import() */[__webpack_require__.e("runestone_shortanswer_js_timed_shortanswer_js"), __webpack_require__.e("runestone_shortanswer_css_shortanswer_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/shortanswer/js/timed_shortanswer.js */ 87483)),
    showeval: () => __webpack_require__.e(/*! import() */ "runestone_showeval_js_showEval_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/showeval/js/showEval.js */ 6224)),
    simple_sensor: () => __webpack_require__.e(/*! import() */ "runestone_cellbotics_js_simple_sensor_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/cellbotics/js/simple_sensor.js */ 72389)),
    spreadsheet: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_jexcel_dist_jexcel_js-node_modules_jexcel_dist_jexcel_css"), __webpack_require__.e("runestone_spreadsheet_js_spreadsheet_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/spreadsheet/js/spreadsheet.js */ 60611)),
    tabbedStuff: () => __webpack_require__.e(/*! import() */ "runestone_tabbedStuff_js_tabbedstuff_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/tabbedStuff/js/tabbedstuff.js */ 97887)),
    timedAssessment: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_handsontable_es_index_js-node_modules_handsontable_dist_handsontable_ful-dcc440"), __webpack_require__.e("vendors-node_modules_codemirror_mode_clike_clike_js-node_modules_codemirror_mode_javascript_j-f062af"), __webpack_require__.e("vendors-node_modules_codemirror_addon_edit_matchbrackets_js-node_modules_codemirror_addon_hin-ab90ac"), __webpack_require__.e("runestone_codelens_js_pytutor-embed_bundle_js"), __webpack_require__.e("node_modules_moment_locale_sync_recursive_-runestone_activecode_js_acfactory_js-node_modules_-ef73b3"), __webpack_require__.e("runestone_parsons_js_timedparsons_js"), __webpack_require__.e("runestone_fitb_js_timedfitb_js"), __webpack_require__.e("runestone_mchoice_js_timedmc_js"), __webpack_require__.e("runestone_selectquestion_js_selectone_js"), __webpack_require__.e("runestone_dragndrop_js_timeddnd_js"), __webpack_require__.e("runestone_clickableArea_js_timedclickable_js"), __webpack_require__.e("runestone_shortanswer_js_timed_shortanswer_js"), __webpack_require__.e("runestone_timed_js_timed_js-runestone_clickableArea_css_clickable_css-runestone_dragndrop_css-8bfd54")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/timed/js/timed.js */ 58707)),
    wavedrom: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_wavedrom_skins_default_js-node_modules_wavedrom_wavedrom_min_js"), __webpack_require__.e("runestone_wavedrom_js_wavedrom_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/wavedrom/js/wavedrom.js */ 32405)),
    // TODO: since this isn't in a ``data-component``, need to trigger an import of this code manually.
    webwork: () => __webpack_require__.e(/*! import() */ "runestone_webwork_js_webwork_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/webwork/js/webwork.js */ 66142)),
    youtube: () => __webpack_require__.e(/*! import() */ "runestone_video_js_runestonevideo_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/video/js/runestonevideo.js */ 48657)),
};

// .. _dynamic import machinery:
//
// Dynamic import machinery
// ========================
// Fulfill a promise when the Runestone pre-login complete event occurs.
let pre_login_complete_promise = new Promise((resolve) =>
    $(document).bind("runestone:pre-login-complete", resolve)
);
let loadedComponents;
// Provide a simple function to import the JS for all components on the page.
function runestone_auto_import() {
    // Create a set of ``data-component`` values, to avoid duplication.
    const s = new Set(
        // All Runestone components have a ``data-component`` attribute.
        $("[data-component]")
            .map(
                // Extract the value of the data-component attribute.
                (index, element) => $(element).attr("data-component")
                // Switch from a jQuery object back to an array, passing that to the Set constructor.
            )
            .get()
    );

    // Load JS for each of the components found.
    const a = [...s].map((value) =>
        // If there's no JS for this component, return an empty Promise.
        (module_map[value] || (() => Promise.resolve()))()
    );

    // Send the Runestone login complete event when all JS is loaded and the pre-login is also complete.
    Promise.all([pre_login_complete_promise, ...a]).then(() =>
        $(document).trigger("runestone:login-complete")
    );
}

// Load component JS when the document is ready.
$(document).ready(runestone_auto_import);

// Provide a function to import one specific Runestone component.
// the import function inside module_map is async -- runestone_import
// should be awaited when necessary to ensure the import completes
async function runestone_import(component_name) {
    return module_map[component_name]();
}

async function popupScratchAC() {
    // load the activecode bundle
    await runestone_import("activecode");
    // scratchDiv will be defined if we have already created a scratch
    // activecode.  If its not defined then we need to get it ready to toggle
    if (!eBookConfig.scratchDiv) {
        window.ACFactory.createScratchActivecode();
        let divid = eBookConfig.scratchDiv;
        window.edList[divid] = ACFactory.createActiveCode(
            $(`#${divid}`)[0],
            eBookConfig.acDefaultLanguage
        );
        if (eBookConfig.isLoggedIn) {
            window.edList[divid].enableSaveLoad();
        }
    }
    window.ACFactory.toggleScratchActivecode();
}

// Set the directory containing this script as the `path <https://webpack.js.org/guides/public-path/#on-the-fly>`_ for all webpacked scripts.
const script_src = document.currentScript.src;
__webpack_require__.p = script_src.substring(
    0,
    script_src.lastIndexOf("/") + 1
);

// Manual exports
// ==============
// Webpack's ``output.library`` setting doesn't seem to work with the split chunks plugin; do all exports manually through the ``window`` object instead.
const rc = {};
rc.runestone_import = runestone_import;
rc.runestone_auto_import = runestone_auto_import;
rc.getSwitch = _runestone_common_js_theme_js__WEBPACK_IMPORTED_MODULE_19__.getSwitch;
rc.switchTheme = _runestone_common_js_theme_js__WEBPACK_IMPORTED_MODULE_19__.switchTheme;
rc.popupScratchAC = popupScratchAC;
window.runestoneComponents = rc;


/***/ }),

/***/ 65311:
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = jQuery;

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendors-node_modules_bootstrap_dist_js_bootstrap_js-node_modules_jquery-ui_jquery-ui_js-node_-72cd89"], () => (__webpack_exec__(36350)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lLmVjYTYzMTAwMTRkYTEzOTUuYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELGNBQWMsS0FBSyxhQUFhO0FBQzNGLGFBQWE7QUFDYixVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixLQUFLLGNBQWM7QUFDckMsYUFBYTtBQUNiLFVBQVU7QUFDVjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQSxTQUFTO0FBQ1QscUJBQXFCO0FBQ3JCO0FBQ0EsZUFBZSw4QkFBOEI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlELG9CQUFvQjtBQUM3RTtBQUNBO0FBQ0EsVUFBVTtBQUNWLG9EQUFvRCxFQUFFO0FBQ3REO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixxQkFBcUI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsNENBQTRDO0FBQ2hFO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDQUFDOzs7Ozs7Ozs7OztBQ3RTRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBZ0M7QUFDaEM7OztBQUdBO0FBQ0E7QUFDQSxFQUFFOzs7QUFHRjtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBOztBQUVBO0FBQ0EsZ0NBQWdDOztBQUVoQztBQUNBLGdDQUFnQzs7QUFFaEM7Ozs7QUFJQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0QkFBNEI7O0FBRTVCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4RUFBOEU7QUFDOUU7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOzs7QUFHRjs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7O0FBR0w7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOzs7O0FBSUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLEtBQUs7QUFDcEIsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7OztBQUlBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0EsQ0FBQzs7Ozs7Ozs7Ozs7QUNyUUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0RBQStEO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFFBQVE7QUFDcEIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsVUFBVTtBQUN2QixjQUFjLFFBQVE7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDOzs7Ozs7Ozs7OztBQzdGRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsY0FBYyxPQUFPO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixjQUFjO0FBQ2Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsUUFBUTtBQUN0QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPLGNBQWMsY0FBYyxHQUFHLE9BQU8sR0FBRyxRQUFRO0FBQ3JFLGNBQWMsUUFBUTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsT0FBTywwQ0FBMEM7QUFDakQ7QUFDQSxhQUFhLE9BQU8sY0FBYyxPQUFPLEdBQUcsT0FBTyxHQUFHLFFBQVEsR0FBRyxRQUFRO0FBQ3pFLGNBQWMsUUFBUTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLGVBQWUsb0JBQW9CO0FBQ25DO0FBQ0EsYUFBYSxPQUFPLGFBQWEsMEJBQTBCLEdBQUcsWUFBWTtBQUMxRSxjQUFjLFFBQVE7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDOzs7Ozs7Ozs7OztBQ3ZLRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCO0FBQ0EsYUFBYSxPQUFPO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0QsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDMU5EO0FBQ0E7O0FBRUE7O0FBRStDOztBQUUvQztBQUNBLGlCQUFpQix5REFBYTtBQUM5QjtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsOENBQThDO0FB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LHNSQUFvRDtBQUM5RTtBQUNBLFFBQVEsMFJBQXlEO0FBQ2pFLG9CQUFvQiwrS0FBNkM7QUFDakUseUJBQXlCLDhMQUFvRDtBQUM3RSx1QkFBdUIsbVRBQW1EO0FBQzFFLHVCQUF1Qiw0TEFBbUQ7QUFDMUUsMkJBQTJCLGd3Q0FBdUM7QUFDbEUsb0JBQW9CLDZTQUE2QztBQUNqRTtBQUNBLG1CQUFtQiw0S0FBMkM7QUFDOUQsbUJBQW1CLHNMQUFnRDtBQUNuRTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLE1BQU07QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMkZBQTJGO0FBQzNGO0FBQ0E7QUFDQTtBQUNBLGVBQWUscUVBQVM7QUFDeEIsaUJBQWlCLHVFQUFXO0FBQzVCO0FBQ0E7Ozs7Ozs7Ozs7OztBQzNLQSIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2Nzcy9wcmVzZW50ZXJfbW9kZS5jc3M/ZWQ0MSIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9jc3MvcnVuZXN0b25lLWN1c3RvbS1zcGhpbngtYm9vdHN0cmFwLmNzcz9hZDI2Iiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2Nzcy91c2VyLWhpZ2hsaWdodHMuY3NzP2E5NWUiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9tYXRyaXhlcS9jc3MvbWF0cml4ZXEuY3NzP2MzNGMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS93ZWJnbGRlbW8vY3NzL3dlYmdsaW50ZXJhY3RpdmUuY3NzPzQ2NjMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvYm9va2Z1bmNzLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeS5pZGxlLXRpbWVyLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeV9pMThuL2pxdWVyeS5pMThuLmVtaXR0ZXIuYmlkaS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9qcXVlcnlfaTE4bi9qcXVlcnkuaTE4bi5lbWl0dGVyLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeV9pMThuL2pxdWVyeS5pMThuLmZhbGxiYWNrcy5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9qcXVlcnlfaTE4bi9qcXVlcnkuaTE4bi5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9qcXVlcnlfaTE4bi9qcXVlcnkuaTE4bi5sYW5ndWFnZS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9qcXVlcnlfaTE4bi9qcXVlcnkuaTE4bi5tZXNzYWdlc3RvcmUuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4ucGFyc2VyLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL3ByZXNlbnRlcl9tb2RlLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL3ByZXRleHQuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy90aGVtZS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy91c2VyLWhpZ2hsaWdodHMuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vcHJvamVjdF90ZW1wbGF0ZS9fdGVtcGxhdGVzL3BsdWdpbl9sYXlvdXRzL3NwaGlueF9ib290c3RyYXAvc3RhdGljL2Jvb3RzdHJhcC1zcGhpbnguanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3dlYnBhY2suaW5kZXguanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy9leHRlcm5hbCB2YXIgXCJqUXVlcnlcIiJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvKipcbiAqXG4gKiBVc2VyOiBibWlsbGVyXG4gKiBPcmlnaW5hbDogMjAxMS0wNC0yMFxuICogRGF0ZTogMjAxOS0wNi0xNFxuICogVGltZTogMjowMSBQTVxuICogVGhpcyBjaGFuZ2UgbWFya3MgdGhlIGJlZ2lubmluZyBvZiB2ZXJzaW9uIDQuMCBvZiB0aGUgcnVuZXN0b25lIGNvbXBvbmVudHNcbiAqIExvZ2luL2xvZ291dCBpcyBubyBsb25nZXIgaGFuZGxlZCB0aHJvdWdoIGphdmFzY3JpcHQgYnV0IHJhdGhlciBzZXJ2ZXIgc2lkZS5cbiAqIE1hbnkgb2YgdGhlIGNvbXBvbmVudHMgZGVwZW5kIG9uIHRoZSBydW5lc3RvbmU6bG9naW4gZXZlbnQgc28gd2Ugd2lsbCBrZWVwIHRoYXRcbiAqIGZvciBub3cgdG8ga2VlcCB0aGUgY2h1cm4gZmFpcmx5IG1pbmltYWwuXG4gKi9cblxuLypcblxuIENvcHlyaWdodCAoQykgMjAxMSAgQnJhZCBNaWxsZXIgIGJvbmVsYWtlQGdtYWlsLmNvbVxuXG4gVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4gKi9cblxuLy9cbi8vIFBhZ2UgZGVjb3JhdGlvbiBmdW5jdGlvbnNcbi8vXG5cbmZ1bmN0aW9uIGFkZFJlYWRpbmdMaXN0KCkge1xuICAgIGlmIChlQm9va0NvbmZpZy5yZWFkaW5ncykge1xuICAgICAgICB2YXIgbCwgbnh0LCBwYXRoX3BhcnRzLCBueHRfbGluaztcbiAgICAgICAgbGV0IGN1cl9wYXRoX3BhcnRzID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgbGV0IG5hbWUgPVxuICAgICAgICAgICAgY3VyX3BhdGhfcGFydHNbY3VyX3BhdGhfcGFydHMubGVuZ3RoIC0gMl0gK1xuICAgICAgICAgICAgXCIvXCIgK1xuICAgICAgICAgICAgY3VyX3BhdGhfcGFydHNbY3VyX3BhdGhfcGFydHMubGVuZ3RoIC0gMV07XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IGVCb29rQ29uZmlnLnJlYWRpbmdzLmluZGV4T2YobmFtZSk7XG4gICAgICAgIGxldCBudW1fcmVhZGluZ3MgPSBlQm9va0NvbmZpZy5yZWFkaW5ncy5sZW5ndGg7XG4gICAgICAgIGlmIChwb3NpdGlvbiA9PSBlQm9va0NvbmZpZy5yZWFkaW5ncy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAvLyBubyBtb3JlIHJlYWRpbmdzXG4gICAgICAgICAgICBsID0gJChcIjxkaXYgLz5cIiwge1xuICAgICAgICAgICAgICAgIHRleHQ6IGBGaW5pc2hlZCByZWFkaW5nIGFzc2lnbm1lbnQuIFBhZ2UgJHtudW1fcmVhZGluZ3N9IG9mICR7bnVtX3JlYWRpbmdzfS5gLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAocG9zaXRpb24gPj0gMCkge1xuICAgICAgICAgICAgLy8gZ2V0IG5leHQgbmFtZVxuICAgICAgICAgICAgbnh0ID0gZUJvb2tDb25maWcucmVhZGluZ3NbcG9zaXRpb24gKyAxXTtcbiAgICAgICAgICAgIHBhdGhfcGFydHMgPSBjdXJfcGF0aF9wYXJ0cy5zbGljZSgwLCBjdXJfcGF0aF9wYXJ0cy5sZW5ndGggLSAyKTtcbiAgICAgICAgICAgIHBhdGhfcGFydHMucHVzaChueHQpO1xuICAgICAgICAgICAgbnh0X2xpbmsgPSBwYXRoX3BhcnRzLmpvaW4oXCIvXCIpO1xuICAgICAgICAgICAgbCA9ICQoXCI8YSAvPlwiLCB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJsaW5rXCIsXG4gICAgICAgICAgICAgICAgY2xhc3M6IFwiYnRuIGJ0bi1sZyAnICsgJ2J1dHRvbkNvbmZpcm1Db21wbGV0aW9uJ1wiLFxuICAgICAgICAgICAgICAgIGhyZWY6IG54dF9saW5rLFxuICAgICAgICAgICAgICAgIHRleHQ6IGBDb250aW51ZSB0byBwYWdlICR7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uICsgMlxuICAgICAgICAgICAgICAgIH0gb2YgJHtudW1fcmVhZGluZ3N9IGluIHRoZSByZWFkaW5nIGFzc2lnbm1lbnQuYCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbCA9ICQoXCI8ZGl2IC8+XCIsIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIlRoaXMgcGFnZSBpcyBub3QgcGFydCBvZiB0aGUgbGFzdCByZWFkaW5nIGFzc2lnbm1lbnQgeW91IHZpc2l0ZWQuXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAkKFwiI21haW4tY29udGVudFwiKS5hcHBlbmQobCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiB0aW1lZFJlZnJlc2goKSB7XG4gICAgdmFyIHRpbWVvdXRQZXJpb2QgPSA5MDAwMDA7IC8vIDc1IG1pbnV0ZXNcbiAgICAkKGRvY3VtZW50KS5vbihcImlkbGUuaWRsZVRpbWVyXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gQWZ0ZXIgdGltZW91dCBwZXJpb2Qgc2VuZCB0aGUgdXNlciBiYWNrIHRvIHRoZSBpbmRleC4gIFRoaXMgd2lsbCBmb3JjZSBhIGxvZ2luXG4gICAgICAgIC8vIGlmIG5lZWRlZCB3aGVuIHRoZXkgd2FudCB0byBnbyB0byBhIHBhcnRpY3VsYXIgcGFnZS4gIFRoaXMgbWF5IG5vdCBiZSBwZXJmZWN0XG4gICAgICAgIC8vIGJ1dCBpdHMgYW4gZWFzeSB3YXkgdG8gbWFrZSBzdXJlIGxhcHRvcCB1c2VycyBhcmUgcHJvcGVybHkgbG9nZ2VkIGluIHdoZW4gdGhleVxuICAgICAgICAvLyB0YWtlIHF1aXp6ZXMgYW5kIHNhdmUgc3R1ZmYuXG4gICAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluZGV4T2YoXCJpbmRleC5odG1sXCIpIDwgMCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJJZGxlIHRpbWVyIC0gXCIgKyBsb2NhdGlvbi5wYXRobmFtZSk7XG4gICAgICAgICAgICBsb2NhdGlvbi5ocmVmID1cbiAgICAgICAgICAgICAgICBlQm9va0NvbmZpZy5hcHAgK1xuICAgICAgICAgICAgICAgIFwiL2RlZmF1bHQvdXNlci9sb2dpbj9fbmV4dD1cIiArXG4gICAgICAgICAgICAgICAgbG9jYXRpb24ucGF0aG5hbWUgK1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uLnNlYXJjaDtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICQuaWRsZVRpbWVyKHRpbWVvdXRQZXJpb2QpO1xufVxuXG5jbGFzcyBQYWdlUHJvZ3Jlc3NCYXIge1xuICAgIGNvbnN0cnVjdG9yKGFjdERpY3QpIHtcbiAgICAgICAgdGhpcy5wb3NzaWJsZSA9IDA7XG4gICAgICAgIHRoaXMudG90YWwgPSAxO1xuICAgICAgICBpZiAoYWN0RGljdCAmJiBPYmplY3Qua2V5cyhhY3REaWN0KS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2aXRpZXMgPSBhY3REaWN0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGFjdGl2aXRpZXMgPSB7IHBhZ2U6IDAgfTtcbiAgICAgICAgICAgICQoXCIucnVuZXN0b25lXCIpLmVhY2goZnVuY3Rpb24gKGlkeCwgZSkge1xuICAgICAgICAgICAgICAgIGFjdGl2aXRpZXNbZS5maXJzdEVsZW1lbnRDaGlsZC5pZF0gPSAwO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmFjdGl2aXRpZXMgPSBhY3Rpdml0aWVzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlUHJvZ3Jlc3MoKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKFxuICAgICAgICAgICAgICAgIC8uKihpbmRleC5odG1sfHRvY3RyZWUuaHRtbHxFeGVyY2lzZXMuaHRtbHxHbG9zc2FyeS5odG1sfHNlYXJjaC5odG1sKSQvaVxuICAgICAgICAgICAgKVxuICAgICAgICApIHtcbiAgICAgICAgICAgICQoXCIjc2Nwcm9ncmVzc2NvbnRhaW5lclwiKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW5kZXJQcm9ncmVzcygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZVByb2dyZXNzKCkge1xuICAgICAgICBmb3IgKGxldCBrIGluIHRoaXMuYWN0aXZpdGllcykge1xuICAgICAgICAgICAgaWYgKGsgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucG9zc2libGUrKztcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hY3Rpdml0aWVzW2tdID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyUHJvZ3Jlc3MoKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IDA7XG4gICAgICAgICQoXCIjc2Nwcm9ncmVzc3RvdGFsXCIpLnRleHQodGhpcy50b3RhbCk7XG4gICAgICAgICQoXCIjc2Nwcm9ncmVzc3Bvc3NcIikudGV4dCh0aGlzLnBvc3NpYmxlKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhbHVlID0gKDEwMCAqIHRoaXMudG90YWwpIC8gdGhpcy5wb3NzaWJsZTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFsdWUgPSAwO1xuICAgICAgICB9XG4gICAgICAgICQoXCIjc3ViY2hhcHRlcnByb2dyZXNzXCIpLnByb2dyZXNzYmFyKHtcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghZUJvb2tDb25maWcuaXNMb2dnZWRJbikge1xuICAgICAgICAgICAgJChcIiNzdWJjaGFwdGVycHJvZ3Jlc3M+ZGl2XCIpLmFkZENsYXNzKFwibG9nZ2Vkb3V0XCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlUHJvZ3Jlc3MoZGl2X2lkKSB7XG4gICAgICAgIHRoaXMuYWN0aXZpdGllc1tkaXZfaWRdKys7XG4gICAgICAgIC8vIE9ubHkgdXBkYXRlIHRoZSBwcm9ncmVzcyBiYXIgb24gdGhlIGZpcnN0IGludGVyYWN0aW9uIHdpdGggYW4gb2JqZWN0LlxuICAgICAgICBpZiAodGhpcy5hY3Rpdml0aWVzW2Rpdl9pZF0gPT09IDEpIHtcbiAgICAgICAgICAgIHRoaXMudG90YWwrKztcbiAgICAgICAgICAgIGxldCB2YWwgPSAoMTAwICogdGhpcy50b3RhbCkgLyB0aGlzLnBvc3NpYmxlO1xuICAgICAgICAgICAgJChcIiNzY3Byb2dyZXNzdG90YWxcIikudGV4dCh0aGlzLnRvdGFsKTtcbiAgICAgICAgICAgICQoXCIjc2Nwcm9ncmVzc3Bvc3NcIikudGV4dCh0aGlzLnBvc3NpYmxlKTtcbiAgICAgICAgICAgICQoXCIjc3ViY2hhcHRlcnByb2dyZXNzXCIpLnByb2dyZXNzYmFyKFwib3B0aW9uXCIsIFwidmFsdWVcIiwgdmFsKTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB2YWwgPT0gMTAwLjAgJiZcbiAgICAgICAgICAgICAgICAkKFwiI2NvbXBsZXRpb25CdXR0b25cIikudGV4dCgpLnRvTG93ZXJDYXNlKCkgPT09XG4gICAgICAgICAgICAgICAgICAgIFwibWFyayBhcyBjb21wbGV0ZWRcIlxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgJChcIiNjb21wbGV0aW9uQnV0dG9uXCIpLmNsaWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB2YXIgcGFnZVByb2dyZXNzVHJhY2tlciA9IHt9O1xuXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVQYWdlU2V0dXAoKSB7XG4gICAgdmFyIG1lc3M7XG4gICAgaWYgKGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoe1xuICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIsXG4gICAgICAgICAgICBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IGRhdGEgPSB7IHRpbWV6b25lb2Zmc2V0OiBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCB9O1xuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2xvZ2dlci9zZXRfdHpfb2Zmc2V0YCxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gc2V0IHRpbWV6b25lISAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBzZXR0aW5nIHRpbWV6b25lICR7ZX1gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoZUJvb2tDb25maWcuaXNMb2dnZWRJbikge1xuICAgICAgICBtZXNzID0gYHVzZXJuYW1lOiAke2VCb29rQ29uZmlnLnVzZXJuYW1lfWA7XG4gICAgICAgIGlmICghZUJvb2tDb25maWcuaXNJbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICAkKFwiI2lwX2Ryb3Bkb3duX2xpbmtcIikucmVtb3ZlKCk7XG4gICAgICAgICAgICAkKFwiI2luc3RfcGVlcl9saW5rXCIpLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgICQoZG9jdW1lbnQpLnRyaWdnZXIoXCJydW5lc3RvbmU6bG9naW5cIik7XG4gICAgICAgIGFkZFJlYWRpbmdMaXN0KCk7XG4gICAgICAgIC8vIEF2b2lkIHRoZSB0aW1lZFJlZnJlc2ggb24gdGhlIGdyYWRpbmcgcGFnZS5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoXCIvYWRtaW4vZ3JhZGluZ1wiKSA9PSAtMSAmJlxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoXCIvcGVlci9cIikgPT0gLTFcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aW1lZFJlZnJlc2goKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIG1lc3MgPSBcIk5vdCBsb2dnZWQgaW5cIjtcbiAgICAgICAgJChkb2N1bWVudCkudHJpZ2dlcihcInJ1bmVzdG9uZTpsb2dvdXRcIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnJvd3Npbmdfd2FybmluZ1wiKS5pbm5lckhUTUwgPVxuICAgICAgICAgICAgXCI8cCBjbGFzcz0nbmF2YmFyX21lc3NhZ2UnPlNhdmluZyBhbmQgTG9nZ2luZyBhcmUgRGlzYWJsZWQ8L3A+XCI7XG4gICAgfVxuICAgICQoXCIubG9nZ2VkaW51c2VyXCIpLmh0bWwobWVzcyk7XG5cbiAgICBwYWdlUHJvZ3Jlc3NUcmFja2VyID0gbmV3IFBhZ2VQcm9ncmVzc0JhcihlQm9va0NvbmZpZy5hY3Rpdml0aWVzKTtcbiAgICBub3RpZnlSdW5lc3RvbmVDb21wb25lbnRzKCk7XG59XG5cbmZ1bmN0aW9uIHNldHVwTmF2YmFyTG9nZ2VkSW4oKSB7XG4gICAgJChcIiNwcm9maWxlbGlua1wiKS5zaG93KCk7XG4gICAgJChcIiNwYXNzd29yZGxpbmtcIikuc2hvdygpO1xuICAgICQoXCIjcmVnaXN0ZXJsaW5rXCIpLmhpZGUoKTtcbiAgICAkKFwibGkubG9naW5vdXRcIikuaHRtbChcbiAgICAgICAgJzxhIGhyZWY9XCInICsgZUJvb2tDb25maWcuYXBwICsgJy9kZWZhdWx0L3VzZXIvbG9nb3V0XCI+TG9nIE91dDwvYT4nXG4gICAgKTtcbn1cbiQoZG9jdW1lbnQpLmJpbmQoXCJydW5lc3RvbmU6bG9naW5cIiwgc2V0dXBOYXZiYXJMb2dnZWRJbik7XG5cbmZ1bmN0aW9uIHNldHVwTmF2YmFyTG9nZ2VkT3V0KCkge1xuICAgIGlmIChlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcInNldHVwIG5hdmJhciBmb3IgbG9nZ2VkIG91dFwiKTtcbiAgICAgICAgJChcIiNyZWdpc3RlcmxpbmtcIikuc2hvdygpO1xuICAgICAgICAkKFwiI3Byb2ZpbGVsaW5rXCIpLmhpZGUoKTtcbiAgICAgICAgJChcIiNwYXNzd29yZGxpbmtcIikuaGlkZSgpO1xuICAgICAgICAkKFwiI2lwX2Ryb3Bkb3duX2xpbmtcIikuaGlkZSgpO1xuICAgICAgICAkKFwiI2luc3RfcGVlcl9saW5rXCIpLmhpZGUoKTtcbiAgICAgICAgJChcImxpLmxvZ2lub3V0XCIpLmh0bWwoXG4gICAgICAgICAgICAnPGEgaHJlZj1cIicgKyBlQm9va0NvbmZpZy5hcHAgKyAnL2RlZmF1bHQvdXNlci9sb2dpblwiPkxvZ2luPC9hPidcbiAgICAgICAgKTtcbiAgICAgICAgJChcIi5mb290ZXJcIikuaHRtbChcInVzZXIgbm90IGxvZ2dlZCBpblwiKTtcbiAgICB9XG59XG4kKGRvY3VtZW50KS5iaW5kKFwicnVuZXN0b25lOmxvZ291dFwiLCBzZXR1cE5hdmJhckxvZ2dlZE91dCk7XG5cbmZ1bmN0aW9uIG5vdGlmeVJ1bmVzdG9uZUNvbXBvbmVudHMoKSB7XG4gICAgLy8gUnVuZXN0b25lIGNvbXBvbmVudHMgd2FpdCB1bnRpbCBsb2dpbiBwcm9jZXNzIGlzIG92ZXIgdG8gbG9hZCBjb21wb25lbnRzIGJlY2F1c2Ugb2Ygc3RvcmFnZSBpc3N1ZXMuIFRoaXMgdHJpZ2dlcnMgdGhlIGBkeW5hbWljIGltcG9ydCBtYWNoaW5lcnlgLCB3aGljaCB0aGVuIHNlbmRzIHRoZSBsb2dpbiBjb21wbGV0ZSBzaWduYWwgd2hlbiB0aGlzIGFuZCBhbGwgZHluYW1pYyBpbXBvcnRzIGFyZSBmaW5pc2hlZC5cbiAgICAkKGRvY3VtZW50KS50cmlnZ2VyKFwicnVuZXN0b25lOnByZS1sb2dpbi1jb21wbGV0ZVwiKTtcbn1cblxuLy8gaW5pdGlhbGl6ZSBzdHVmZlxuJChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGVCb29rQ29uZmlnKSB7XG4gICAgICAgIGhhbmRsZVBhZ2VTZXR1cCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgZUJvb2tDb25maWcgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgIFwiZUJvb2tDb25maWcgaXMgbm90IGRlZmluZWQuICBUaGlzIHBhZ2UgbXVzdCBub3QgYmUgc2V0IHVwIGZvciBSdW5lc3RvbmVcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG4vLyBtaXNjIHN0dWZmXG4vLyB0b2RvOiAgVGhpcyBjb3VsZCBiZSBmdXJ0aGVyIGRpc3RyaWJ1dGVkIGJ1dCBtYWtpbmcgYSB2aWRlby5qcyBmaWxlIGp1c3QgZm9yIG9uZSBmdW5jdGlvbiBzZWVtcyBkdW1iLlxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAvLyBhZGQgdGhlIHZpZGVvIHBsYXkgYnV0dG9uIG92ZXJsYXkgaW1hZ2VcbiAgICAkKFwiLnZpZGVvLXBsYXktb3ZlcmxheVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5jc3MoXG4gICAgICAgICAgICBcImJhY2tncm91bmQtaW1hZ2VcIixcbiAgICAgICAgICAgIFwidXJsKCd7e3BhdGh0bygnX3N0YXRpYy9wbGF5X292ZXJsYXlfaWNvbi5wbmcnLCAxKX19JylcIlxuICAgICAgICApO1xuICAgIH0pO1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBpcyBuZWVkZWQgdG8gYWxsb3cgdGhlIGRyb3Bkb3duIHNlYXJjaCBiYXIgdG8gd29yaztcbiAgICAvLyBUaGUgZGVmYXVsdCBiZWhhdmlvdXIgaXMgdGhhdCB0aGUgZHJvcGRvd24gbWVudSBjbG9zZXMgd2hlbiBzb21ldGhpbmcgaW5cbiAgICAvLyBpdCAobGlrZSB0aGUgc2VhcmNoIGJhcikgaXMgY2xpY2tlZFxuICAgICQoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBGaXggaW5wdXQgZWxlbWVudCBjbGljayBwcm9ibGVtXG4gICAgICAgICQoXCIuZHJvcGRvd24gaW5wdXQsIC5kcm9wZG93biBsYWJlbFwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpZiAobG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIm1vZGU9YnJvd3NpbmdcIikpIHtcbiAgICAgICAgbGV0IHF1ZXJ5U3RyaW5nID0gXCI/bW9kZT1icm93c2luZ1wiO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiYVwiKS5mb3JFYWNoKChsaW5rKSA9PiB7XG4gICAgICAgICAgICBpZiAobGluay5ocmVmLmluY2x1ZGVzKFwiYm9va3MvcHVibGlzaGVkXCIpKSB7XG4gICAgICAgICAgICAgICAgbGluay5ocmVmID0gbGluay5ocmVmLmluY2x1ZGVzKFwiP1wiKVxuICAgICAgICAgICAgICAgICAgICA/IGxpbmsuaHJlZiArIHF1ZXJ5U3RyaW5nLnJlcGxhY2UoXCI/XCIsIFwiJlwiKVxuICAgICAgICAgICAgICAgICAgICA6IGxpbmsuaHJlZiArIHF1ZXJ5U3RyaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59KTtcbiIsIi8qIVxuICogalF1ZXJ5IGlkbGVUaW1lciBwbHVnaW5cbiAqIHZlcnNpb24gMC45LjEwMDUxMVxuICogYnkgUGF1bCBJcmlzaC5cbiAqICAgaHR0cDovL2dpdGh1Yi5jb20vcGF1bGlyaXNoL3l1aS1taXNjL3RyZWUvXG4gKiBNSVQgbGljZW5zZVxuXG4gKiBhZGFwdGVkIGZyb20gWVVJIGlkbGUgdGltZXIgYnkgbnpha2FzOlxuICogICBodHRwOi8vZ2l0aHViLmNvbS9uemFrYXMveXVpLW1pc2MvXG4qL1xuLypcbiAqIENvcHlyaWdodCAoYykgMjAwOSBOaWNob2xhcyBDLiBaYWthc1xuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cblxuLyogdXBkYXRlZCB0byBmaXggQ2hyb21lIHNldFRpbWVvdXQgaXNzdWUgYnkgWmFpZCBaYXdhaWRlaCAqL1xuXG4gLy8gQVBJIGF2YWlsYWJsZSBpbiA8PSB2MC44XG4gLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuIC8vIGlkbGVUaW1lcigpIHRha2VzIGFuIG9wdGlvbmFsIGFyZ3VtZW50IHRoYXQgZGVmaW5lcyB0aGUgaWRsZSB0aW1lb3V0XG4gLy8gdGltZW91dCBpcyBpbiBtaWxsaXNlY29uZHM7IGRlZmF1bHRzIHRvIDMwMDAwXG4gJC5pZGxlVGltZXIoMTAwMDApO1xuXG5cbiAkKGRvY3VtZW50KS5iaW5kKFwiaWRsZS5pZGxlVGltZXJcIiwgZnVuY3Rpb24oKXtcbiAgICAvLyBmdW5jdGlvbiB5b3Ugd2FudCB0byBmaXJlIHdoZW4gdGhlIHVzZXIgZ29lcyBpZGxlXG4gfSk7XG5cblxuICQoZG9jdW1lbnQpLmJpbmQoXCJhY3RpdmUuaWRsZVRpbWVyXCIsIGZ1bmN0aW9uKCl7XG4gIC8vIGZ1bmN0aW9uIHlvdSB3YW50IHRvIGZpcmUgd2hlbiB0aGUgdXNlciBiZWNvbWVzIGFjdGl2ZSBhZ2FpblxuIH0pO1xuXG4gLy8gcGFzcyB0aGUgc3RyaW5nICdkZXN0cm95JyB0byBzdG9wIHRoZSB0aW1lclxuICQuaWRsZVRpbWVyKCdkZXN0cm95Jyk7XG5cbiAvLyB5b3UgY2FuIHF1ZXJ5IGlmIHRoZSB1c2VyIGlzIGlkbGUgb3Igbm90IHdpdGggZGF0YSgpXG4gJC5kYXRhKGRvY3VtZW50LCdpZGxlVGltZXInKTsgIC8vICdpZGxlJyAgb3IgJ2FjdGl2ZSdcblxuIC8vIHlvdSBjYW4gZ2V0IHRpbWUgZWxhcHNlZCBzaW5jZSB1c2VyIHdoZW4gaWRsZS9hY3RpdmVcbiAkLmlkbGVUaW1lcignZ2V0RWxhcHNlZFRpbWUnKTsgLy8gdGltZSBzaW5jZSBzdGF0ZSBjaGFuZ2UgaW4gbXNcblxuICoqKioqKioqL1xuXG5cblxuIC8vIEFQSSBhdmFpbGFibGUgaW4gPj0gdjAuOVxuIC8qKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAvLyBiaW5kIHRvIHNwZWNpZmljIGVsZW1lbnRzLCBhbGxvd3MgZm9yIG11bHRpcGxlIHRpbWVyIGluc3RhbmNlc1xuICQoZWxlbSkuaWRsZVRpbWVyKHRpbWVvdXR8J2Rlc3Ryb3knfCdnZXRFbGFwc2VkVGltZScpO1xuICQuZGF0YShlbGVtLCdpZGxlVGltZXInKTsgIC8vICdpZGxlJyAgb3IgJ2FjdGl2ZSdcblxuIC8vIGlmIHlvdSdyZSB1c2luZyB0aGUgb2xkICQuaWRsZVRpbWVyIGFwaSwgeW91IHNob3VsZCBub3QgZG8gJChkb2N1bWVudCkuaWRsZVRpbWVyKC4uLilcblxuIC8vIGVsZW1lbnQgYm91bmQgdGltZXJzIHdpbGwgb25seSB3YXRjaCBmb3IgZXZlbnRzIGluc2lkZSBvZiB0aGVtLlxuIC8vIHlvdSBtYXkganVzdCB3YW50IHBhZ2UtbGV2ZWwgYWN0aXZpdHksIGluIHdoaWNoIGNhc2UgeW91IG1heSBzZXQgdXBcbiAvLyAgIHlvdXIgdGltZXJzIG9uIGRvY3VtZW50LCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGFuZCBkb2N1bWVudC5ib2R5XG5cbiAvLyBZb3UgY2FuIG9wdGlvbmFsbHkgcHJvdmlkZSBhIHNlY29uZCBhcmd1bWVudCB0byBvdmVycmlkZSBjZXJ0YWluIG9wdGlvbnMuXG4gLy8gSGVyZSBhcmUgdGhlIGRlZmF1bHRzLCBzbyB5b3UgY2FuIG9taXQgYW55IG9yIGFsbCBvZiB0aGVtLlxuICQoZWxlbSkuaWRsZVRpbWVyKHRpbWVvdXQsIHtcbiAgIHN0YXJ0SW1tZWRpYXRlbHk6IHRydWUsIC8vc3RhcnRzIGEgdGltZW91dCBhcyBzb29uIGFzIHRoZSB0aW1lciBpcyBzZXQgdXA7IG90aGVyd2lzZSBpdCB3YWl0cyBmb3IgdGhlIGZpcnN0IGV2ZW50LlxuICAgaWRsZTogICAgZmFsc2UsICAgICAgICAgLy9pbmRpY2F0ZXMgaWYgdGhlIHVzZXIgaXMgaWRsZVxuICAgZW5hYmxlZDogdHJ1ZSwgICAgICAgICAgLy9pbmRpY2F0ZXMgaWYgdGhlIGlkbGUgdGltZXIgaXMgZW5hYmxlZFxuICAgZXZlbnRzOiAgJ21vdXNlbW92ZSBrZXlkb3duIERPTU1vdXNlU2Nyb2xsIG1vdXNld2hlZWwgbW91c2Vkb3duIHRvdWNoc3RhcnQgdG91Y2htb3ZlJyAvLyBhY3Rpdml0eSBpcyBvbmUgb2YgdGhlc2UgZXZlbnRzXG4gfSk7XG5cbiAqKioqKioqKi9cblxuKGZ1bmN0aW9uKCQpe1xuXG4kLmlkbGVUaW1lciA9IGZ1bmN0aW9uKG5ld1RpbWVvdXQsIGVsZW0sIG9wdHMpe1xuXG4gICAgLy8gZGVmYXVsdHMgdGhhdCBhcmUgdG8gYmUgc3RvcmVkIGFzIGluc3RhbmNlIHByb3BzIG9uIHRoZSBlbGVtXG5cblx0b3B0cyA9ICQuZXh0ZW5kKHtcblx0XHRzdGFydEltbWVkaWF0ZWx5OiB0cnVlLCAvL3N0YXJ0cyBhIHRpbWVvdXQgYXMgc29vbiBhcyB0aGUgdGltZXIgaXMgc2V0IHVwXG5cdFx0aWRsZTogICAgZmFsc2UsICAgICAgICAgLy9pbmRpY2F0ZXMgaWYgdGhlIHVzZXIgaXMgaWRsZVxuXHRcdGVuYWJsZWQ6IHRydWUsICAgICAgICAgIC8vaW5kaWNhdGVzIGlmIHRoZSBpZGxlIHRpbWVyIGlzIGVuYWJsZWRcblx0XHR0aW1lb3V0OiAzMDAwMCwgICAgICAgICAvL3RoZSBhbW91bnQgb2YgdGltZSAobXMpIGJlZm9yZSB0aGUgdXNlciBpcyBjb25zaWRlcmVkIGlkbGVcblx0XHRldmVudHM6ICAnbW91c2Vtb3ZlIGtleWRvd24gRE9NTW91c2VTY3JvbGwgbW91c2V3aGVlbCBtb3VzZWRvd24gdG91Y2hzdGFydCB0b3VjaG1vdmUnIC8vIGFjdGl2aXR5IGlzIG9uZSBvZiB0aGVzZSBldmVudHNcblx0fSwgb3B0cyk7XG5cblxuICAgIGVsZW0gPSBlbGVtIHx8IGRvY3VtZW50O1xuXG4gICAgLyogKGludGVudGlvbmFsbHkgbm90IGRvY3VtZW50ZWQpXG4gICAgICogVG9nZ2xlcyB0aGUgaWRsZSBzdGF0ZSBhbmQgZmlyZXMgYW4gYXBwcm9wcmlhdGUgZXZlbnQuXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICB2YXIgdG9nZ2xlSWRsZVN0YXRlID0gZnVuY3Rpb24obXllbGVtKXtcblxuICAgICAgICAvLyBjdXJzZSB5b3UsIG1vemlsbGEgc2V0VGltZW91dCBsYXRlbmVzcyBidWchXG4gICAgICAgIGlmICh0eXBlb2YgbXllbGVtID09PSAnbnVtYmVyJyl7XG4gICAgICAgICAgICBteWVsZW0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb2JqID0gJC5kYXRhKG15ZWxlbSB8fCBlbGVtLCdpZGxlVGltZXJPYmonKTtcblxuICAgICAgICAvL3RvZ2dsZSB0aGUgc3RhdGVcbiAgICAgICAgb2JqLmlkbGUgPSAhb2JqLmlkbGU7XG5cbiAgICAgICAgLy8gcmVzZXQgdGltZW91dCBcbiAgICAgICAgdmFyIGVsYXBzZWQgPSAoK25ldyBEYXRlKCkpIC0gb2JqLm9sZGRhdGU7XG4gICAgICAgIG9iai5vbGRkYXRlID0gK25ldyBEYXRlKCk7XG5cbiAgICAgICAgLy8gaGFuZGxlIENocm9tZSBhbHdheXMgdHJpZ2dlcmluZyBpZGxlIGFmdGVyIGpzIGFsZXJ0IG9yIGNvbWZpcm0gcG9wdXBcbiAgICAgICAgaWYgKG9iai5pZGxlICYmIChlbGFwc2VkIDwgb3B0cy50aW1lb3V0KSkge1xuICAgICAgICAgICAgICAgIG9iai5pZGxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KCQuaWRsZVRpbWVyLnRJZCk7XG4gICAgICAgICAgICAgICAgaWYgKG9wdHMuZW5hYmxlZClcbiAgICAgICAgICAgICAgICAgICQuaWRsZVRpbWVyLnRJZCA9IHNldFRpbWVvdXQodG9nZ2xlSWRsZVN0YXRlLCBvcHRzLnRpbWVvdXQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy9maXJlIGFwcHJvcHJpYXRlIGV2ZW50XG5cbiAgICAgICAgLy8gY3JlYXRlIGEgY3VzdG9tIGV2ZW50LCBidXQgZmlyc3QsIHN0b3JlIHRoZSBuZXcgc3RhdGUgb24gdGhlIGVsZW1lbnRcbiAgICAgICAgLy8gYW5kIHRoZW4gYXBwZW5kIHRoYXQgc3RyaW5nIHRvIGEgbmFtZXNwYWNlXG4gICAgICAgIHZhciBldmVudCA9IGpRdWVyeS5FdmVudCggJC5kYXRhKGVsZW0sJ2lkbGVUaW1lcicsIG9iai5pZGxlID8gXCJpZGxlXCIgOiBcImFjdGl2ZVwiICkgICsgJy5pZGxlVGltZXInICAgKTtcblxuICAgICAgICAvLyB3ZSBkbyB3YW50IHRoaXMgdG8gYnViYmxlLCBhdCBsZWFzdCBhcyBhIHRlbXBvcmFyeSBmaXggZm9yIGpRdWVyeSAxLjdcbiAgICAgICAgLy8gZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICQoZWxlbSkudHJpZ2dlcihldmVudCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN0b3BzIHRoZSBpZGxlIHRpbWVyLiBUaGlzIHJlbW92ZXMgYXBwcm9wcmlhdGUgZXZlbnQgaGFuZGxlcnNcbiAgICAgKiBhbmQgY2FuY2VscyBhbnkgcGVuZGluZyB0aW1lb3V0cy5cbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqIEBtZXRob2Qgc3RvcFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdG9wID0gZnVuY3Rpb24oZWxlbSl7XG5cbiAgICAgICAgdmFyIG9iaiA9ICQuZGF0YShlbGVtLCdpZGxlVGltZXJPYmonKSB8fCB7fTtcblxuICAgICAgICAvL3NldCB0byBkaXNhYmxlZFxuICAgICAgICBvYmouZW5hYmxlZCA9IGZhbHNlO1xuXG4gICAgICAgIC8vY2xlYXIgYW55IHBlbmRpbmcgdGltZW91dHNcbiAgICAgICAgY2xlYXJUaW1lb3V0KG9iai50SWQpO1xuXG4gICAgICAgIC8vZGV0YWNoIHRoZSBldmVudCBoYW5kbGVyc1xuICAgICAgICAkKGVsZW0pLm9mZignLmlkbGVUaW1lcicpO1xuICAgIH0sXG5cblxuICAgIC8qIChpbnRlbnRpb25hbGx5IG5vdCBkb2N1bWVudGVkKVxuICAgICAqIEhhbmRsZXMgYSB1c2VyIGV2ZW50IGluZGljYXRpbmcgdGhhdCB0aGUgdXNlciBpc24ndCBpZGxlLlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IEEgRE9NMi1ub3JtYWxpemVkIGV2ZW50IG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIGhhbmRsZVVzZXJFdmVudCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIG9iaiA9ICQuZGF0YSh0aGlzLCdpZGxlVGltZXJPYmonKTtcblxuICAgICAgICAvL2NsZWFyIGFueSBleGlzdGluZyB0aW1lb3V0XG4gICAgICAgIGNsZWFyVGltZW91dChvYmoudElkKTtcblxuXG5cbiAgICAgICAgLy9pZiB0aGUgaWRsZSB0aW1lciBpcyBlbmFibGVkXG4gICAgICAgIGlmIChvYmouZW5hYmxlZCl7XG5cblxuICAgICAgICAgICAgLy9pZiBpdCdzIGlkbGUsIHRoYXQgbWVhbnMgdGhlIHVzZXIgaXMgbm8gbG9uZ2VyIGlkbGVcbiAgICAgICAgICAgIGlmIChvYmouaWRsZSl7XG4gICAgICAgICAgICAgICAgdG9nZ2xlSWRsZVN0YXRlKHRoaXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL3NldCBhIG5ldyB0aW1lb3V0XG4gICAgICAgICAgICBvYmoudElkID0gc2V0VGltZW91dCh0b2dnbGVJZGxlU3RhdGUsIG9iai50aW1lb3V0KTtcblxuICAgICAgICB9XG4gICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIFN0YXJ0cyB0aGUgaWRsZSB0aW1lci4gVGhpcyBhZGRzIGFwcHJvcHJpYXRlIGV2ZW50IGhhbmRsZXJzXG4gICAgICogYW5kIHN0YXJ0cyB0aGUgZmlyc3QgdGltZW91dC5cbiAgICAgKiBAcGFyYW0ge2ludH0gbmV3VGltZW91dCAoT3B0aW9uYWwpIEEgbmV3IHZhbHVlIGZvciB0aGUgdGltZW91dCBwZXJpb2QgaW4gbXMuXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKiBAbWV0aG9kICQuaWRsZVRpbWVyXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuXG5cbiAgICB2YXIgb2JqID0gJC5kYXRhKGVsZW0sJ2lkbGVUaW1lck9iaicpIHx8IHt9O1xuXG4gICAgb2JqLm9sZGRhdGUgPSBvYmoub2xkZGF0ZSB8fCArbmV3IERhdGUoKTtcblxuICAgIC8vYXNzaWduIGEgbmV3IHRpbWVvdXQgaWYgbmVjZXNzYXJ5XG4gICAgaWYgKHR5cGVvZiBuZXdUaW1lb3V0ID09PSBcIm51bWJlclwiKXtcbiAgICAgICAgb3B0cy50aW1lb3V0ID0gbmV3VGltZW91dDtcbiAgICB9IGVsc2UgaWYgKG5ld1RpbWVvdXQgPT09ICdkZXN0cm95Jykge1xuICAgICAgICBzdG9wKGVsZW0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2UgaWYgKG5ld1RpbWVvdXQgPT09ICdnZXRFbGFwc2VkVGltZScpe1xuICAgICAgICByZXR1cm4gKCtuZXcgRGF0ZSgpKSAtIG9iai5vbGRkYXRlO1xuICAgIH1cblxuICAgIC8vYXNzaWduIGFwcHJvcHJpYXRlIGV2ZW50IGhhbmRsZXJzXG4gICAgJChlbGVtKS5vbigkLnRyaW0oKG9wdHMuZXZlbnRzKycgJykuc3BsaXQoJyAnKS5qb2luKCcuaWRsZVRpbWVyICcpKSxoYW5kbGVVc2VyRXZlbnQpO1xuXG5cbiAgICBvYmouaWRsZSAgICA9IG9wdHMuaWRsZTtcbiAgICBvYmouZW5hYmxlZCA9IG9wdHMuZW5hYmxlZDtcbiAgICBvYmoudGltZW91dCA9IG9wdHMudGltZW91dDtcblxuXG4gICAgLy9zZXQgYSB0aW1lb3V0IHRvIHRvZ2dsZSBzdGF0ZS4gTWF5IHdpc2ggdG8gb21pdCB0aGlzIGluIHNvbWUgc2l0dWF0aW9uc1xuXHRpZiAob3B0cy5zdGFydEltbWVkaWF0ZWx5KSB7XG5cdCAgICBvYmoudElkID0gc2V0VGltZW91dCh0b2dnbGVJZGxlU3RhdGUsIG9iai50aW1lb3V0KTtcblx0fVxuXG4gICAgLy8gYXNzdW1lIHRoZSB1c2VyIGlzIGFjdGl2ZSBmb3IgdGhlIGZpcnN0IHggc2Vjb25kcy5cbiAgICAkLmRhdGEoZWxlbSwnaWRsZVRpbWVyJyxcImFjdGl2ZVwiKTtcblxuICAgIC8vIHN0b3JlIG91ciBpbnN0YW5jZSBvbiB0aGUgb2JqZWN0XG4gICAgJC5kYXRhKGVsZW0sJ2lkbGVUaW1lck9iaicsb2JqKTtcblxuXG5cbn07IC8vIGVuZCBvZiAkLmlkbGVUaW1lcigpXG5cblxuLy8gdjAuOSBBUEkgZm9yIGRlZmluaW5nIG11bHRpcGxlIHRpbWVycy5cbiQuZm4uaWRsZVRpbWVyID0gZnVuY3Rpb24obmV3VGltZW91dCxvcHRzKXtcblx0Ly8gQWxsb3cgb21pc3Npb24gb2Ygb3B0cyBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuXHRpZiAoIW9wdHMpIHtcblx0XHRvcHRzID0ge307XG5cdH1cblxuICAgIGlmKHRoaXNbMF0pe1xuICAgICAgICAkLmlkbGVUaW1lcihuZXdUaW1lb3V0LHRoaXNbMF0sb3B0cyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbn0pKGpRdWVyeSk7XG4iLCIvKiFcbiAqIEJJREkgZW1iZWRkaW5nIHN1cHBvcnQgZm9yIGpRdWVyeS5pMThuXG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDE1LCBEYXZpZCBDaGFuXG4gKlxuICogVGhpcyBjb2RlIGlzIGR1YWwgbGljZW5zZWQgR1BMdjIgb3IgbGF0ZXIgYW5kIE1JVC4gWW91IGRvbid0IGhhdmUgdG8gZG9cbiAqIGFueXRoaW5nIHNwZWNpYWwgdG8gY2hvb3NlIG9uZSBsaWNlbnNlIG9yIHRoZSBvdGhlciBhbmQgeW91IGRvbid0IGhhdmUgdG9cbiAqIG5vdGlmeSBhbnlvbmUgd2hpY2ggbGljZW5zZSB5b3UgYXJlIHVzaW5nLiBZb3UgYXJlIGZyZWUgdG8gdXNlIHRoaXMgY29kZVxuICogaW4gY29tbWVyY2lhbCBwcm9qZWN0cyBhcyBsb25nIGFzIHRoZSBjb3B5cmlnaHQgaGVhZGVyIGlzIGxlZnQgaW50YWN0LlxuICogU2VlIGZpbGVzIEdQTC1MSUNFTlNFIGFuZCBNSVQtTElDRU5TRSBmb3IgZGV0YWlscy5cbiAqXG4gKiBAbGljZW5jZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5jZSAyLjAgb3IgbGF0ZXJcbiAqIEBsaWNlbmNlIE1JVCBMaWNlbnNlXG4gKi9cblxuKCBmdW5jdGlvbiAoICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIHN0cm9uZ0RpclJlZ0V4cDtcblxuXHQvKipcblx0ICogTWF0Y2hlcyB0aGUgZmlyc3Qgc3Ryb25nIGRpcmVjdGlvbmFsaXR5IGNvZGVwb2ludDpcblx0ICogLSBpbiBncm91cCAxIGlmIGl0IGlzIExUUlxuXHQgKiAtIGluIGdyb3VwIDIgaWYgaXQgaXMgUlRMXG5cdCAqIERvZXMgbm90IG1hdGNoIGlmIHRoZXJlIGlzIG5vIHN0cm9uZyBkaXJlY3Rpb25hbGl0eSBjb2RlcG9pbnQuXG5cdCAqXG5cdCAqIEdlbmVyYXRlZCBieSBVbmljb2RlSlMgKHNlZSB0b29scy9zdHJvbmdEaXIpIGZyb20gdGhlIFVDRDsgc2VlXG5cdCAqIGh0dHBzOi8vcGhhYnJpY2F0b3Iud2lraW1lZGlhLm9yZy9kaWZmdXNpb24vR1VKUy8gLlxuXHQgKi9cblx0c3Ryb25nRGlyUmVnRXhwID0gbmV3IFJlZ0V4cChcblx0XHQnKD86JyArXG5cdFx0XHQnKCcgK1xuXHRcdFx0XHQnW1xcdTAwNDEtXFx1MDA1YVxcdTAwNjEtXFx1MDA3YVxcdTAwYWFcXHUwMGI1XFx1MDBiYVxcdTAwYzAtXFx1MDBkNlxcdTAwZDgtXFx1MDBmNlxcdTAwZjgtXFx1MDJiOFxcdTAyYmItXFx1MDJjMVxcdTAyZDBcXHUwMmQxXFx1MDJlMC1cXHUwMmU0XFx1MDJlZVxcdTAzNzAtXFx1MDM3M1xcdTAzNzZcXHUwMzc3XFx1MDM3YS1cXHUwMzdkXFx1MDM3ZlxcdTAzODZcXHUwMzg4LVxcdTAzOGFcXHUwMzhjXFx1MDM4ZS1cXHUwM2ExXFx1MDNhMy1cXHUwM2Y1XFx1MDNmNy1cXHUwNDgyXFx1MDQ4YS1cXHUwNTJmXFx1MDUzMS1cXHUwNTU2XFx1MDU1OS1cXHUwNTVmXFx1MDU2MS1cXHUwNTg3XFx1MDU4OVxcdTA5MDMtXFx1MDkzOVxcdTA5M2JcXHUwOTNkLVxcdTA5NDBcXHUwOTQ5LVxcdTA5NGNcXHUwOTRlLVxcdTA5NTBcXHUwOTU4LVxcdTA5NjFcXHUwOTY0LVxcdTA5ODBcXHUwOTgyXFx1MDk4M1xcdTA5ODUtXFx1MDk4Y1xcdTA5OGZcXHUwOTkwXFx1MDk5My1cXHUwOWE4XFx1MDlhYS1cXHUwOWIwXFx1MDliMlxcdTA5YjYtXFx1MDliOVxcdTA5YmQtXFx1MDljMFxcdTA5YzdcXHUwOWM4XFx1MDljYlxcdTA5Y2NcXHUwOWNlXFx1MDlkN1xcdTA5ZGNcXHUwOWRkXFx1MDlkZi1cXHUwOWUxXFx1MDllNi1cXHUwOWYxXFx1MDlmNC1cXHUwOWZhXFx1MGEwM1xcdTBhMDUtXFx1MGEwYVxcdTBhMGZcXHUwYTEwXFx1MGExMy1cXHUwYTI4XFx1MGEyYS1cXHUwYTMwXFx1MGEzMlxcdTBhMzNcXHUwYTM1XFx1MGEzNlxcdTBhMzhcXHUwYTM5XFx1MGEzZS1cXHUwYTQwXFx1MGE1OS1cXHUwYTVjXFx1MGE1ZVxcdTBhNjYtXFx1MGE2ZlxcdTBhNzItXFx1MGE3NFxcdTBhODNcXHUwYTg1LVxcdTBhOGRcXHUwYThmLVxcdTBhOTFcXHUwYTkzLVxcdTBhYThcXHUwYWFhLVxcdTBhYjBcXHUwYWIyXFx1MGFiM1xcdTBhYjUtXFx1MGFiOVxcdTBhYmQtXFx1MGFjMFxcdTBhYzlcXHUwYWNiXFx1MGFjY1xcdTBhZDBcXHUwYWUwXFx1MGFlMVxcdTBhZTYtXFx1MGFmMFxcdTBhZjlcXHUwYjAyXFx1MGIwM1xcdTBiMDUtXFx1MGIwY1xcdTBiMGZcXHUwYjEwXFx1MGIxMy1cXHUwYjI4XFx1MGIyYS1cXHUwYjMwXFx1MGIzMlxcdTBiMzNcXHUwYjM1LVxcdTBiMzlcXHUwYjNkXFx1MGIzZVxcdTBiNDBcXHUwYjQ3XFx1MGI0OFxcdTBiNGJcXHUwYjRjXFx1MGI1N1xcdTBiNWNcXHUwYjVkXFx1MGI1Zi1cXHUwYjYxXFx1MGI2Ni1cXHUwYjc3XFx1MGI4M1xcdTBiODUtXFx1MGI4YVxcdTBiOGUtXFx1MGI5MFxcdTBiOTItXFx1MGI5NVxcdTBiOTlcXHUwYjlhXFx1MGI5Y1xcdTBiOWVcXHUwYjlmXFx1MGJhM1xcdTBiYTRcXHUwYmE4LVxcdTBiYWFcXHUwYmFlLVxcdTBiYjlcXHUwYmJlXFx1MGJiZlxcdTBiYzFcXHUwYmMyXFx1MGJjNi1cXHUwYmM4XFx1MGJjYS1cXHUwYmNjXFx1MGJkMFxcdTBiZDdcXHUwYmU2LVxcdTBiZjJcXHUwYzAxLVxcdTBjMDNcXHUwYzA1LVxcdTBjMGNcXHUwYzBlLVxcdTBjMTBcXHUwYzEyLVxcdTBjMjhcXHUwYzJhLVxcdTBjMzlcXHUwYzNkXFx1MGM0MS1cXHUwYzQ0XFx1MGM1OC1cXHUwYzVhXFx1MGM2MFxcdTBjNjFcXHUwYzY2LVxcdTBjNmZcXHUwYzdmXFx1MGM4MlxcdTBjODNcXHUwYzg1LVxcdTBjOGNcXHUwYzhlLVxcdTBjOTBcXHUwYzkyLVxcdTBjYThcXHUwY2FhLVxcdTBjYjNcXHUwY2I1LVxcdTBjYjlcXHUwY2JkLVxcdTBjYzRcXHUwY2M2LVxcdTBjYzhcXHUwY2NhXFx1MGNjYlxcdTBjZDVcXHUwY2Q2XFx1MGNkZVxcdTBjZTBcXHUwY2UxXFx1MGNlNi1cXHUwY2VmXFx1MGNmMVxcdTBjZjJcXHUwZDAyXFx1MGQwM1xcdTBkMDUtXFx1MGQwY1xcdTBkMGUtXFx1MGQxMFxcdTBkMTItXFx1MGQzYVxcdTBkM2QtXFx1MGQ0MFxcdTBkNDYtXFx1MGQ0OFxcdTBkNGEtXFx1MGQ0Y1xcdTBkNGVcXHUwZDU3XFx1MGQ1Zi1cXHUwZDYxXFx1MGQ2Ni1cXHUwZDc1XFx1MGQ3OS1cXHUwZDdmXFx1MGQ4MlxcdTBkODNcXHUwZDg1LVxcdTBkOTZcXHUwZDlhLVxcdTBkYjFcXHUwZGIzLVxcdTBkYmJcXHUwZGJkXFx1MGRjMC1cXHUwZGM2XFx1MGRjZi1cXHUwZGQxXFx1MGRkOC1cXHUwZGRmXFx1MGRlNi1cXHUwZGVmXFx1MGRmMi1cXHUwZGY0XFx1MGUwMS1cXHUwZTMwXFx1MGUzMlxcdTBlMzNcXHUwZTQwLVxcdTBlNDZcXHUwZTRmLVxcdTBlNWJcXHUwZTgxXFx1MGU4MlxcdTBlODRcXHUwZTg3XFx1MGU4OFxcdTBlOGFcXHUwZThkXFx1MGU5NC1cXHUwZTk3XFx1MGU5OS1cXHUwZTlmXFx1MGVhMS1cXHUwZWEzXFx1MGVhNVxcdTBlYTdcXHUwZWFhXFx1MGVhYlxcdTBlYWQtXFx1MGViMFxcdTBlYjJcXHUwZWIzXFx1MGViZFxcdTBlYzAtXFx1MGVjNFxcdTBlYzZcXHUwZWQwLVxcdTBlZDlcXHUwZWRjLVxcdTBlZGZcXHUwZjAwLVxcdTBmMTdcXHUwZjFhLVxcdTBmMzRcXHUwZjM2XFx1MGYzOFxcdTBmM2UtXFx1MGY0N1xcdTBmNDktXFx1MGY2Y1xcdTBmN2ZcXHUwZjg1XFx1MGY4OC1cXHUwZjhjXFx1MGZiZS1cXHUwZmM1XFx1MGZjNy1cXHUwZmNjXFx1MGZjZS1cXHUwZmRhXFx1MTAwMC1cXHUxMDJjXFx1MTAzMVxcdTEwMzhcXHUxMDNiXFx1MTAzY1xcdTEwM2YtXFx1MTA1N1xcdTEwNWEtXFx1MTA1ZFxcdTEwNjEtXFx1MTA3MFxcdTEwNzUtXFx1MTA4MVxcdTEwODNcXHUxMDg0XFx1MTA4Ny1cXHUxMDhjXFx1MTA4ZS1cXHUxMDljXFx1MTA5ZS1cXHUxMGM1XFx1MTBjN1xcdTEwY2RcXHUxMGQwLVxcdTEyNDhcXHUxMjRhLVxcdTEyNGRcXHUxMjUwLVxcdTEyNTZcXHUxMjU4XFx1MTI1YS1cXHUxMjVkXFx1MTI2MC1cXHUxMjg4XFx1MTI4YS1cXHUxMjhkXFx1MTI5MC1cXHUxMmIwXFx1MTJiMi1cXHUxMmI1XFx1MTJiOC1cXHUxMmJlXFx1MTJjMFxcdTEyYzItXFx1MTJjNVxcdTEyYzgtXFx1MTJkNlxcdTEyZDgtXFx1MTMxMFxcdTEzMTItXFx1MTMxNVxcdTEzMTgtXFx1MTM1YVxcdTEzNjAtXFx1MTM3Y1xcdTEzODAtXFx1MTM4ZlxcdTEzYTAtXFx1MTNmNVxcdTEzZjgtXFx1MTNmZFxcdTE0MDEtXFx1MTY3ZlxcdTE2ODEtXFx1MTY5YVxcdTE2YTAtXFx1MTZmOFxcdTE3MDAtXFx1MTcwY1xcdTE3MGUtXFx1MTcxMVxcdTE3MjAtXFx1MTczMVxcdTE3MzVcXHUxNzM2XFx1MTc0MC1cXHUxNzUxXFx1MTc2MC1cXHUxNzZjXFx1MTc2ZS1cXHUxNzcwXFx1MTc4MC1cXHUxN2IzXFx1MTdiNlxcdTE3YmUtXFx1MTdjNVxcdTE3YzdcXHUxN2M4XFx1MTdkNC1cXHUxN2RhXFx1MTdkY1xcdTE3ZTAtXFx1MTdlOVxcdTE4MTAtXFx1MTgxOVxcdTE4MjAtXFx1MTg3N1xcdTE4ODAtXFx1MThhOFxcdTE4YWFcXHUxOGIwLVxcdTE4ZjVcXHUxOTAwLVxcdTE5MWVcXHUxOTIzLVxcdTE5MjZcXHUxOTI5LVxcdTE5MmJcXHUxOTMwXFx1MTkzMVxcdTE5MzMtXFx1MTkzOFxcdTE5NDYtXFx1MTk2ZFxcdTE5NzAtXFx1MTk3NFxcdTE5ODAtXFx1MTlhYlxcdTE5YjAtXFx1MTljOVxcdTE5ZDAtXFx1MTlkYVxcdTFhMDAtXFx1MWExNlxcdTFhMTlcXHUxYTFhXFx1MWExZS1cXHUxYTU1XFx1MWE1N1xcdTFhNjFcXHUxYTYzXFx1MWE2NFxcdTFhNmQtXFx1MWE3MlxcdTFhODAtXFx1MWE4OVxcdTFhOTAtXFx1MWE5OVxcdTFhYTAtXFx1MWFhZFxcdTFiMDQtXFx1MWIzM1xcdTFiMzVcXHUxYjNiXFx1MWIzZC1cXHUxYjQxXFx1MWI0My1cXHUxYjRiXFx1MWI1MC1cXHUxYjZhXFx1MWI3NC1cXHUxYjdjXFx1MWI4Mi1cXHUxYmExXFx1MWJhNlxcdTFiYTdcXHUxYmFhXFx1MWJhZS1cXHUxYmU1XFx1MWJlN1xcdTFiZWEtXFx1MWJlY1xcdTFiZWVcXHUxYmYyXFx1MWJmM1xcdTFiZmMtXFx1MWMyYlxcdTFjMzRcXHUxYzM1XFx1MWMzYi1cXHUxYzQ5XFx1MWM0ZC1cXHUxYzdmXFx1MWNjMC1cXHUxY2M3XFx1MWNkM1xcdTFjZTFcXHUxY2U5LVxcdTFjZWNcXHUxY2VlLVxcdTFjZjNcXHUxY2Y1XFx1MWNmNlxcdTFkMDAtXFx1MWRiZlxcdTFlMDAtXFx1MWYxNVxcdTFmMTgtXFx1MWYxZFxcdTFmMjAtXFx1MWY0NVxcdTFmNDgtXFx1MWY0ZFxcdTFmNTAtXFx1MWY1N1xcdTFmNTlcXHUxZjViXFx1MWY1ZFxcdTFmNWYtXFx1MWY3ZFxcdTFmODAtXFx1MWZiNFxcdTFmYjYtXFx1MWZiY1xcdTFmYmVcXHUxZmMyLVxcdTFmYzRcXHUxZmM2LVxcdTFmY2NcXHUxZmQwLVxcdTFmZDNcXHUxZmQ2LVxcdTFmZGJcXHUxZmUwLVxcdTFmZWNcXHUxZmYyLVxcdTFmZjRcXHUxZmY2LVxcdTFmZmNcXHUyMDBlXFx1MjA3MVxcdTIwN2ZcXHUyMDkwLVxcdTIwOWNcXHUyMTAyXFx1MjEwN1xcdTIxMGEtXFx1MjExM1xcdTIxMTVcXHUyMTE5LVxcdTIxMWRcXHUyMTI0XFx1MjEyNlxcdTIxMjhcXHUyMTJhLVxcdTIxMmRcXHUyMTJmLVxcdTIxMzlcXHUyMTNjLVxcdTIxM2ZcXHUyMTQ1LVxcdTIxNDlcXHUyMTRlXFx1MjE0ZlxcdTIxNjAtXFx1MjE4OFxcdTIzMzYtXFx1MjM3YVxcdTIzOTVcXHUyNDljLVxcdTI0ZTlcXHUyNmFjXFx1MjgwMC1cXHUyOGZmXFx1MmMwMC1cXHUyYzJlXFx1MmMzMC1cXHUyYzVlXFx1MmM2MC1cXHUyY2U0XFx1MmNlYi1cXHUyY2VlXFx1MmNmMlxcdTJjZjNcXHUyZDAwLVxcdTJkMjVcXHUyZDI3XFx1MmQyZFxcdTJkMzAtXFx1MmQ2N1xcdTJkNmZcXHUyZDcwXFx1MmQ4MC1cXHUyZDk2XFx1MmRhMC1cXHUyZGE2XFx1MmRhOC1cXHUyZGFlXFx1MmRiMC1cXHUyZGI2XFx1MmRiOC1cXHUyZGJlXFx1MmRjMC1cXHUyZGM2XFx1MmRjOC1cXHUyZGNlXFx1MmRkMC1cXHUyZGQ2XFx1MmRkOC1cXHUyZGRlXFx1MzAwNS1cXHUzMDA3XFx1MzAyMS1cXHUzMDI5XFx1MzAyZVxcdTMwMmZcXHUzMDMxLVxcdTMwMzVcXHUzMDM4LVxcdTMwM2NcXHUzMDQxLVxcdTMwOTZcXHUzMDlkLVxcdTMwOWZcXHUzMGExLVxcdTMwZmFcXHUzMGZjLVxcdTMwZmZcXHUzMTA1LVxcdTMxMmRcXHUzMTMxLVxcdTMxOGVcXHUzMTkwLVxcdTMxYmFcXHUzMWYwLVxcdTMyMWNcXHUzMjIwLVxcdTMyNGZcXHUzMjYwLVxcdTMyN2JcXHUzMjdmLVxcdTMyYjBcXHUzMmMwLVxcdTMyY2JcXHUzMmQwLVxcdTMyZmVcXHUzMzAwLVxcdTMzNzZcXHUzMzdiLVxcdTMzZGRcXHUzM2UwLVxcdTMzZmVcXHUzNDAwLVxcdTRkYjVcXHU0ZTAwLVxcdTlmZDVcXHVhMDAwLVxcdWE0OGNcXHVhNGQwLVxcdWE2MGNcXHVhNjEwLVxcdWE2MmJcXHVhNjQwLVxcdWE2NmVcXHVhNjgwLVxcdWE2OWRcXHVhNmEwLVxcdWE2ZWZcXHVhNmYyLVxcdWE2ZjdcXHVhNzIyLVxcdWE3ODdcXHVhNzg5LVxcdWE3YWRcXHVhN2IwLVxcdWE3YjdcXHVhN2Y3LVxcdWE4MDFcXHVhODAzLVxcdWE4MDVcXHVhODA3LVxcdWE4MGFcXHVhODBjLVxcdWE4MjRcXHVhODI3XFx1YTgzMC1cXHVhODM3XFx1YTg0MC1cXHVhODczXFx1YTg4MC1cXHVhOGMzXFx1YThjZS1cXHVhOGQ5XFx1YThmMi1cXHVhOGZkXFx1YTkwMC1cXHVhOTI1XFx1YTkyZS1cXHVhOTQ2XFx1YTk1MlxcdWE5NTNcXHVhOTVmLVxcdWE5N2NcXHVhOTgzLVxcdWE5YjJcXHVhOWI0XFx1YTliNVxcdWE5YmFcXHVhOWJiXFx1YTliZC1cXHVhOWNkXFx1YTljZi1cXHVhOWQ5XFx1YTlkZS1cXHVhOWU0XFx1YTllNi1cXHVhOWZlXFx1YWEwMC1cXHVhYTI4XFx1YWEyZlxcdWFhMzBcXHVhYTMzXFx1YWEzNFxcdWFhNDAtXFx1YWE0MlxcdWFhNDQtXFx1YWE0YlxcdWFhNGRcXHVhYTUwLVxcdWFhNTlcXHVhYTVjLVxcdWFhN2JcXHVhYTdkLVxcdWFhYWZcXHVhYWIxXFx1YWFiNVxcdWFhYjZcXHVhYWI5LVxcdWFhYmRcXHVhYWMwXFx1YWFjMlxcdWFhZGItXFx1YWFlYlxcdWFhZWUtXFx1YWFmNVxcdWFiMDEtXFx1YWIwNlxcdWFiMDktXFx1YWIwZVxcdWFiMTEtXFx1YWIxNlxcdWFiMjAtXFx1YWIyNlxcdWFiMjgtXFx1YWIyZVxcdWFiMzAtXFx1YWI2NVxcdWFiNzAtXFx1YWJlNFxcdWFiZTZcXHVhYmU3XFx1YWJlOS1cXHVhYmVjXFx1YWJmMC1cXHVhYmY5XFx1YWMwMC1cXHVkN2EzXFx1ZDdiMC1cXHVkN2M2XFx1ZDdjYi1cXHVkN2ZiXFx1ZTAwMC1cXHVmYTZkXFx1ZmE3MC1cXHVmYWQ5XFx1ZmIwMC1cXHVmYjA2XFx1ZmIxMy1cXHVmYjE3XFx1ZmYyMS1cXHVmZjNhXFx1ZmY0MS1cXHVmZjVhXFx1ZmY2Ni1cXHVmZmJlXFx1ZmZjMi1cXHVmZmM3XFx1ZmZjYS1cXHVmZmNmXFx1ZmZkMi1cXHVmZmQ3XFx1ZmZkYS1cXHVmZmRjXXxcXHVkODAwW1xcdWRjMDAtXFx1ZGMwYl18XFx1ZDgwMFtcXHVkYzBkLVxcdWRjMjZdfFxcdWQ4MDBbXFx1ZGMyOC1cXHVkYzNhXXxcXHVkODAwXFx1ZGMzY3xcXHVkODAwXFx1ZGMzZHxcXHVkODAwW1xcdWRjM2YtXFx1ZGM0ZF18XFx1ZDgwMFtcXHVkYzUwLVxcdWRjNWRdfFxcdWQ4MDBbXFx1ZGM4MC1cXHVkY2ZhXXxcXHVkODAwXFx1ZGQwMHxcXHVkODAwXFx1ZGQwMnxcXHVkODAwW1xcdWRkMDctXFx1ZGQzM118XFx1ZDgwMFtcXHVkZDM3LVxcdWRkM2ZdfFxcdWQ4MDBbXFx1ZGRkMC1cXHVkZGZjXXxcXHVkODAwW1xcdWRlODAtXFx1ZGU5Y118XFx1ZDgwMFtcXHVkZWEwLVxcdWRlZDBdfFxcdWQ4MDBbXFx1ZGYwMC1cXHVkZjIzXXxcXHVkODAwW1xcdWRmMzAtXFx1ZGY0YV18XFx1ZDgwMFtcXHVkZjUwLVxcdWRmNzVdfFxcdWQ4MDBbXFx1ZGY4MC1cXHVkZjlkXXxcXHVkODAwW1xcdWRmOWYtXFx1ZGZjM118XFx1ZDgwMFtcXHVkZmM4LVxcdWRmZDVdfFxcdWQ4MDFbXFx1ZGMwMC1cXHVkYzlkXXxcXHVkODAxW1xcdWRjYTAtXFx1ZGNhOV18XFx1ZDgwMVtcXHVkZDAwLVxcdWRkMjddfFxcdWQ4MDFbXFx1ZGQzMC1cXHVkZDYzXXxcXHVkODAxXFx1ZGQ2ZnxcXHVkODAxW1xcdWRlMDAtXFx1ZGYzNl18XFx1ZDgwMVtcXHVkZjQwLVxcdWRmNTVdfFxcdWQ4MDFbXFx1ZGY2MC1cXHVkZjY3XXxcXHVkODA0XFx1ZGMwMHxcXHVkODA0W1xcdWRjMDItXFx1ZGMzN118XFx1ZDgwNFtcXHVkYzQ3LVxcdWRjNGRdfFxcdWQ4MDRbXFx1ZGM2Ni1cXHVkYzZmXXxcXHVkODA0W1xcdWRjODItXFx1ZGNiMl18XFx1ZDgwNFxcdWRjYjd8XFx1ZDgwNFxcdWRjYjh8XFx1ZDgwNFtcXHVkY2JiLVxcdWRjYzFdfFxcdWQ4MDRbXFx1ZGNkMC1cXHVkY2U4XXxcXHVkODA0W1xcdWRjZjAtXFx1ZGNmOV18XFx1ZDgwNFtcXHVkZDAzLVxcdWRkMjZdfFxcdWQ4MDRcXHVkZDJjfFxcdWQ4MDRbXFx1ZGQzNi1cXHVkZDQzXXxcXHVkODA0W1xcdWRkNTAtXFx1ZGQ3Ml18XFx1ZDgwNFtcXHVkZDc0LVxcdWRkNzZdfFxcdWQ4MDRbXFx1ZGQ4Mi1cXHVkZGI1XXxcXHVkODA0W1xcdWRkYmYtXFx1ZGRjOV18XFx1ZDgwNFxcdWRkY2R8XFx1ZDgwNFtcXHVkZGQwLVxcdWRkZGZdfFxcdWQ4MDRbXFx1ZGRlMS1cXHVkZGY0XXxcXHVkODA0W1xcdWRlMDAtXFx1ZGUxMV18XFx1ZDgwNFtcXHVkZTEzLVxcdWRlMmVdfFxcdWQ4MDRcXHVkZTMyfFxcdWQ4MDRcXHVkZTMzfFxcdWQ4MDRcXHVkZTM1fFxcdWQ4MDRbXFx1ZGUzOC1cXHVkZTNkXXxcXHVkODA0W1xcdWRlODAtXFx1ZGU4Nl18XFx1ZDgwNFxcdWRlODh8XFx1ZDgwNFtcXHVkZThhLVxcdWRlOGRdfFxcdWQ4MDRbXFx1ZGU4Zi1cXHVkZTlkXXxcXHVkODA0W1xcdWRlOWYtXFx1ZGVhOV18XFx1ZDgwNFtcXHVkZWIwLVxcdWRlZGVdfFxcdWQ4MDRbXFx1ZGVlMC1cXHVkZWUyXXxcXHVkODA0W1xcdWRlZjAtXFx1ZGVmOV18XFx1ZDgwNFxcdWRmMDJ8XFx1ZDgwNFxcdWRmMDN8XFx1ZDgwNFtcXHVkZjA1LVxcdWRmMGNdfFxcdWQ4MDRcXHVkZjBmfFxcdWQ4MDRcXHVkZjEwfFxcdWQ4MDRbXFx1ZGYxMy1cXHVkZjI4XXxcXHVkODA0W1xcdWRmMmEtXFx1ZGYzMF18XFx1ZDgwNFxcdWRmMzJ8XFx1ZDgwNFxcdWRmMzN8XFx1ZDgwNFtcXHVkZjM1LVxcdWRmMzldfFxcdWQ4MDRbXFx1ZGYzZC1cXHVkZjNmXXxcXHVkODA0W1xcdWRmNDEtXFx1ZGY0NF18XFx1ZDgwNFxcdWRmNDd8XFx1ZDgwNFxcdWRmNDh8XFx1ZDgwNFtcXHVkZjRiLVxcdWRmNGRdfFxcdWQ4MDRcXHVkZjUwfFxcdWQ4MDRcXHVkZjU3fFxcdWQ4MDRbXFx1ZGY1ZC1cXHVkZjYzXXxcXHVkODA1W1xcdWRjODAtXFx1ZGNiMl18XFx1ZDgwNVxcdWRjYjl8XFx1ZDgwNVtcXHVkY2JiLVxcdWRjYmVdfFxcdWQ4MDVcXHVkY2MxfFxcdWQ4MDVbXFx1ZGNjNC1cXHVkY2M3XXxcXHVkODA1W1xcdWRjZDAtXFx1ZGNkOV18XFx1ZDgwNVtcXHVkZDgwLVxcdWRkYjFdfFxcdWQ4MDVbXFx1ZGRiOC1cXHVkZGJiXXxcXHVkODA1XFx1ZGRiZXxcXHVkODA1W1xcdWRkYzEtXFx1ZGRkYl18XFx1ZDgwNVtcXHVkZTAwLVxcdWRlMzJdfFxcdWQ4MDVcXHVkZTNifFxcdWQ4MDVcXHVkZTNjfFxcdWQ4MDVcXHVkZTNlfFxcdWQ4MDVbXFx1ZGU0MS1cXHVkZTQ0XXxcXHVkODA1W1xcdWRlNTAtXFx1ZGU1OV18XFx1ZDgwNVtcXHVkZTgwLVxcdWRlYWFdfFxcdWQ4MDVcXHVkZWFjfFxcdWQ4MDVcXHVkZWFlfFxcdWQ4MDVcXHVkZWFmfFxcdWQ4MDVcXHVkZWI2fFxcdWQ4MDVbXFx1ZGVjMC1cXHVkZWM5XXxcXHVkODA1W1xcdWRmMDAtXFx1ZGYxOV18XFx1ZDgwNVxcdWRmMjB8XFx1ZDgwNVxcdWRmMjF8XFx1ZDgwNVxcdWRmMjZ8XFx1ZDgwNVtcXHVkZjMwLVxcdWRmM2ZdfFxcdWQ4MDZbXFx1ZGNhMC1cXHVkY2YyXXxcXHVkODA2XFx1ZGNmZnxcXHVkODA2W1xcdWRlYzAtXFx1ZGVmOF18XFx1ZDgwOFtcXHVkYzAwLVxcdWRmOTldfFxcdWQ4MDlbXFx1ZGMwMC1cXHVkYzZlXXxcXHVkODA5W1xcdWRjNzAtXFx1ZGM3NF18XFx1ZDgwOVtcXHVkYzgwLVxcdWRkNDNdfFxcdWQ4MGNbXFx1ZGMwMC1cXHVkZmZmXXxcXHVkODBkW1xcdWRjMDAtXFx1ZGMyZV18XFx1ZDgxMVtcXHVkYzAwLVxcdWRlNDZdfFxcdWQ4MWFbXFx1ZGMwMC1cXHVkZTM4XXxcXHVkODFhW1xcdWRlNDAtXFx1ZGU1ZV18XFx1ZDgxYVtcXHVkZTYwLVxcdWRlNjldfFxcdWQ4MWFcXHVkZTZlfFxcdWQ4MWFcXHVkZTZmfFxcdWQ4MWFbXFx1ZGVkMC1cXHVkZWVkXXxcXHVkODFhXFx1ZGVmNXxcXHVkODFhW1xcdWRmMDAtXFx1ZGYyZl18XFx1ZDgxYVtcXHVkZjM3LVxcdWRmNDVdfFxcdWQ4MWFbXFx1ZGY1MC1cXHVkZjU5XXxcXHVkODFhW1xcdWRmNWItXFx1ZGY2MV18XFx1ZDgxYVtcXHVkZjYzLVxcdWRmNzddfFxcdWQ4MWFbXFx1ZGY3ZC1cXHVkZjhmXXxcXHVkODFiW1xcdWRmMDAtXFx1ZGY0NF18XFx1ZDgxYltcXHVkZjUwLVxcdWRmN2VdfFxcdWQ4MWJbXFx1ZGY5My1cXHVkZjlmXXxcXHVkODJjXFx1ZGMwMHxcXHVkODJjXFx1ZGMwMXxcXHVkODJmW1xcdWRjMDAtXFx1ZGM2YV18XFx1ZDgyZltcXHVkYzcwLVxcdWRjN2NdfFxcdWQ4MmZbXFx1ZGM4MC1cXHVkYzg4XXxcXHVkODJmW1xcdWRjOTAtXFx1ZGM5OV18XFx1ZDgyZlxcdWRjOWN8XFx1ZDgyZlxcdWRjOWZ8XFx1ZDgzNFtcXHVkYzAwLVxcdWRjZjVdfFxcdWQ4MzRbXFx1ZGQwMC1cXHVkZDI2XXxcXHVkODM0W1xcdWRkMjktXFx1ZGQ2Nl18XFx1ZDgzNFtcXHVkZDZhLVxcdWRkNzJdfFxcdWQ4MzRcXHVkZDgzfFxcdWQ4MzRcXHVkZDg0fFxcdWQ4MzRbXFx1ZGQ4Yy1cXHVkZGE5XXxcXHVkODM0W1xcdWRkYWUtXFx1ZGRlOF18XFx1ZDgzNFtcXHVkZjYwLVxcdWRmNzFdfFxcdWQ4MzVbXFx1ZGMwMC1cXHVkYzU0XXxcXHVkODM1W1xcdWRjNTYtXFx1ZGM5Y118XFx1ZDgzNVxcdWRjOWV8XFx1ZDgzNVxcdWRjOWZ8XFx1ZDgzNVxcdWRjYTJ8XFx1ZDgzNVxcdWRjYTV8XFx1ZDgzNVxcdWRjYTZ8XFx1ZDgzNVtcXHVkY2E5LVxcdWRjYWNdfFxcdWQ4MzVbXFx1ZGNhZS1cXHVkY2I5XXxcXHVkODM1XFx1ZGNiYnxcXHVkODM1W1xcdWRjYmQtXFx1ZGNjM118XFx1ZDgzNVtcXHVkY2M1LVxcdWRkMDVdfFxcdWQ4MzVbXFx1ZGQwNy1cXHVkZDBhXXxcXHVkODM1W1xcdWRkMGQtXFx1ZGQxNF18XFx1ZDgzNVtcXHVkZDE2LVxcdWRkMWNdfFxcdWQ4MzVbXFx1ZGQxZS1cXHVkZDM5XXxcXHVkODM1W1xcdWRkM2ItXFx1ZGQzZV18XFx1ZDgzNVtcXHVkZDQwLVxcdWRkNDRdfFxcdWQ4MzVcXHVkZDQ2fFxcdWQ4MzVbXFx1ZGQ0YS1cXHVkZDUwXXxcXHVkODM1W1xcdWRkNTItXFx1ZGVhNV18XFx1ZDgzNVtcXHVkZWE4LVxcdWRlZGFdfFxcdWQ4MzVbXFx1ZGVkYy1cXHVkZjE0XXxcXHVkODM1W1xcdWRmMTYtXFx1ZGY0ZV18XFx1ZDgzNVtcXHVkZjUwLVxcdWRmODhdfFxcdWQ4MzVbXFx1ZGY4YS1cXHVkZmMyXXxcXHVkODM1W1xcdWRmYzQtXFx1ZGZjYl18XFx1ZDgzNltcXHVkYzAwLVxcdWRkZmZdfFxcdWQ4MzZbXFx1ZGUzNy1cXHVkZTNhXXxcXHVkODM2W1xcdWRlNmQtXFx1ZGU3NF18XFx1ZDgzNltcXHVkZTc2LVxcdWRlODNdfFxcdWQ4MzZbXFx1ZGU4NS1cXHVkZThiXXxcXHVkODNjW1xcdWRkMTAtXFx1ZGQyZV18XFx1ZDgzY1tcXHVkZDMwLVxcdWRkNjldfFxcdWQ4M2NbXFx1ZGQ3MC1cXHVkZDlhXXxcXHVkODNjW1xcdWRkZTYtXFx1ZGUwMl18XFx1ZDgzY1tcXHVkZTEwLVxcdWRlM2FdfFxcdWQ4M2NbXFx1ZGU0MC1cXHVkZTQ4XXxcXHVkODNjXFx1ZGU1MHxcXHVkODNjXFx1ZGU1MXxbXFx1ZDg0MC1cXHVkODY4XVtcXHVkYzAwLVxcdWRmZmZdfFxcdWQ4NjlbXFx1ZGMwMC1cXHVkZWQ2XXxcXHVkODY5W1xcdWRmMDAtXFx1ZGZmZl18W1xcdWQ4NmEtXFx1ZDg2Y11bXFx1ZGMwMC1cXHVkZmZmXXxcXHVkODZkW1xcdWRjMDAtXFx1ZGYzNF18XFx1ZDg2ZFtcXHVkZjQwLVxcdWRmZmZdfFxcdWQ4NmVbXFx1ZGMwMC1cXHVkYzFkXXxcXHVkODZlW1xcdWRjMjAtXFx1ZGZmZl18W1xcdWQ4NmYtXFx1ZDg3Ml1bXFx1ZGMwMC1cXHVkZmZmXXxcXHVkODczW1xcdWRjMDAtXFx1ZGVhMV18XFx1ZDg3ZVtcXHVkYzAwLVxcdWRlMWRdfFtcXHVkYjgwLVxcdWRiYmVdW1xcdWRjMDAtXFx1ZGZmZl18XFx1ZGJiZltcXHVkYzAwLVxcdWRmZmRdfFtcXHVkYmMwLVxcdWRiZmVdW1xcdWRjMDAtXFx1ZGZmZl18XFx1ZGJmZltcXHVkYzAwLVxcdWRmZmRdJyArXG5cdFx0XHQnKXwoJyArXG5cdFx0XHRcdCdbXFx1MDU5MFxcdTA1YmVcXHUwNWMwXFx1MDVjM1xcdTA1YzZcXHUwNWM4LVxcdTA1ZmZcXHUwN2MwLVxcdTA3ZWFcXHUwN2Y0XFx1MDdmNVxcdTA3ZmEtXFx1MDgxNVxcdTA4MWFcXHUwODI0XFx1MDgyOFxcdTA4MmUtXFx1MDg1OFxcdTA4NWMtXFx1MDg5ZlxcdTIwMGZcXHVmYjFkXFx1ZmIxZi1cXHVmYjI4XFx1ZmIyYS1cXHVmYjRmXFx1MDYwOFxcdTA2MGJcXHUwNjBkXFx1MDYxYi1cXHUwNjRhXFx1MDY2ZC1cXHUwNjZmXFx1MDY3MS1cXHUwNmQ1XFx1MDZlNVxcdTA2ZTZcXHUwNmVlXFx1MDZlZlxcdTA2ZmEtXFx1MDcxMFxcdTA3MTItXFx1MDcyZlxcdTA3NGItXFx1MDdhNVxcdTA3YjEtXFx1MDdiZlxcdTA4YTAtXFx1MDhlMlxcdWZiNTAtXFx1ZmQzZFxcdWZkNDAtXFx1ZmRjZlxcdWZkZjAtXFx1ZmRmY1xcdWZkZmVcXHVmZGZmXFx1ZmU3MC1cXHVmZWZlXXxcXHVkODAyW1xcdWRjMDAtXFx1ZGQxZV18XFx1ZDgwMltcXHVkZDIwLVxcdWRlMDBdfFxcdWQ4MDJcXHVkZTA0fFxcdWQ4MDJbXFx1ZGUwNy1cXHVkZTBiXXxcXHVkODAyW1xcdWRlMTAtXFx1ZGUzN118XFx1ZDgwMltcXHVkZTNiLVxcdWRlM2VdfFxcdWQ4MDJbXFx1ZGU0MC1cXHVkZWU0XXxcXHVkODAyW1xcdWRlZTctXFx1ZGYzOF18XFx1ZDgwMltcXHVkZjQwLVxcdWRmZmZdfFxcdWQ4MDNbXFx1ZGMwMC1cXHVkZTVmXXxcXHVkODAzW1xcdWRlN2YtXFx1ZGZmZl18XFx1ZDgzYVtcXHVkYzAwLVxcdWRjY2ZdfFxcdWQ4M2FbXFx1ZGNkNy1cXHVkZmZmXXxcXHVkODNiW1xcdWRjMDAtXFx1ZGRmZl18XFx1ZDgzYltcXHVkZjAwLVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGYwMC1cXHVkZmZmXXxcXHVkODNiW1xcdWRmMDAtXFx1ZGZmZl18XFx1ZDgzYltcXHVkZjAwLVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGYwMC1cXHVkZmZmXXxcXHVkODNiW1xcdWRmMDAtXFx1ZGZmZl18XFx1ZDgzYltcXHVkZjAwLVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGYwMC1cXHVkZmZmXXxcXHVkODNiW1xcdWRmMDAtXFx1ZGZmZl18XFx1ZDgzYltcXHVkZjAwLVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGYwMC1cXHVkZmZmXXxcXHVkODNiW1xcdWRmMDAtXFx1ZGZmZl18XFx1ZDgzYltcXHVkZjAwLVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGUwMC1cXHVkZWVmXXxcXHVkODNiW1xcdWRlZjItXFx1ZGVmZl0nICtcblx0XHRcdCcpJyArXG5cdFx0JyknXG5cdCk7XG5cblx0LyoqXG5cdCAqIEdldHMgZGlyZWN0aW9uYWxpdHkgb2YgdGhlIGZpcnN0IHN0cm9uZ2x5IGRpcmVjdGlvbmFsIGNvZGVwb2ludFxuXHQgKlxuXHQgKiBUaGlzIGlzIHRoZSBydWxlIHRoZSBCSURJIGFsZ29yaXRobSB1c2VzIHRvIGRldGVybWluZSB0aGUgZGlyZWN0aW9uYWxpdHkgb2Zcblx0ICogcGFyYWdyYXBocyAoIGh0dHA6Ly91bmljb2RlLm9yZy9yZXBvcnRzL3RyOS8jVGhlX1BhcmFncmFwaF9MZXZlbCApIGFuZFxuXHQgKiBGU0kgaXNvbGF0ZXMgKCBodHRwOi8vdW5pY29kZS5vcmcvcmVwb3J0cy90cjkvI0V4cGxpY2l0X0RpcmVjdGlvbmFsX0lzb2xhdGVzICkuXG5cdCAqXG5cdCAqIFRPRE86IERvZXMgbm90IGhhbmRsZSBCSURJIGNvbnRyb2wgY2hhcmFjdGVycyBpbnNpZGUgdGhlIHRleHQuXG5cdCAqIFRPRE86IERvZXMgbm90IGhhbmRsZSB1bmFsbG9jYXRlZCBjaGFyYWN0ZXJzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dCBmcm9tIHdoaWNoIHRvIGV4dHJhY3QgaW5pdGlhbCBkaXJlY3Rpb25hbGl0eS5cblx0ICogQHJldHVybiB7c3RyaW5nfSBEaXJlY3Rpb25hbGl0eSAoZWl0aGVyICdsdHInIG9yICdydGwnKVxuXHQgKi9cblx0ZnVuY3Rpb24gc3Ryb25nRGlyRnJvbUNvbnRlbnQoIHRleHQgKSB7XG5cdFx0dmFyIG0gPSB0ZXh0Lm1hdGNoKCBzdHJvbmdEaXJSZWdFeHAgKTtcblx0XHRpZiAoICFtICkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHRcdGlmICggbVsgMiBdID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRyZXR1cm4gJ2x0cic7XG5cdFx0fVxuXHRcdHJldHVybiAncnRsJztcblx0fVxuXG5cdCQuZXh0ZW5kKCAkLmkxOG4ucGFyc2VyLmVtaXR0ZXIsIHtcblx0XHQvKipcblx0XHQgKiBXcmFwcyBhcmd1bWVudCB3aXRoIHVuaWNvZGUgY29udHJvbCBjaGFyYWN0ZXJzIGZvciBkaXJlY3Rpb25hbGl0eSBzYWZldHlcblx0XHQgKlxuXHRcdCAqIFRoaXMgc29sdmVzIHRoZSBwcm9ibGVtIHdoZXJlIGRpcmVjdGlvbmFsaXR5LW5ldXRyYWwgY2hhcmFjdGVycyBhdCB0aGUgZWRnZSBvZlxuXHRcdCAqIHRoZSBhcmd1bWVudCBzdHJpbmcgZ2V0IGludGVycHJldGVkIHdpdGggdGhlIHdyb25nIGRpcmVjdGlvbmFsaXR5IGZyb20gdGhlXG5cdFx0ICogZW5jbG9zaW5nIGNvbnRleHQsIGdpdmluZyByZW5kZXJpbmdzIHRoYXQgbG9vayBjb3JydXB0ZWQgbGlrZSBcIihCZW5fKFdNRlwiLlxuXHRcdCAqXG5cdFx0ICogVGhlIHdyYXBwaW5nIGlzIExSRS4uLlBERiBvciBSTEUuLi5QREYsIGRlcGVuZGluZyBvbiB0aGUgZGV0ZWN0ZWRcblx0XHQgKiBkaXJlY3Rpb25hbGl0eSBvZiB0aGUgYXJndW1lbnQgc3RyaW5nLCB1c2luZyB0aGUgQklESSBhbGdvcml0aG0ncyBvd24gXCJGaXJzdFxuXHRcdCAqIHN0cm9uZyBkaXJlY3Rpb25hbCBjb2RlcG9pbnRcIiBydWxlLiBFc3NlbnRpYWxseSwgdGhpcyB3b3JrcyByb3VuZCB0aGUgZmFjdCB0aGF0XG5cdFx0ICogdGhlcmUgaXMgbm8gZW1iZWRkaW5nIGVxdWl2YWxlbnQgb2YgVSsyMDY4IEZTSSAoaXNvbGF0aW9uIHdpdGggaGV1cmlzdGljXG5cdFx0ICogZGlyZWN0aW9uIGluZmVyZW5jZSkuIFRoZSBsYXR0ZXIgaXMgY2xlYW5lciBidXQgc3RpbGwgbm90IHdpZGVseSBzdXBwb3J0ZWQuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ1tdfSBub2RlcyBUaGUgdGV4dCBub2RlcyBmcm9tIHdoaWNoIHRvIHRha2UgdGhlIGZpcnN0IGl0ZW0uXG5cdFx0ICogQHJldHVybiB7c3RyaW5nfSBXcmFwcGVkIFN0cmluZyBvZiBjb250ZW50IGFzIG5lZWRlZC5cblx0XHQgKi9cblx0XHRiaWRpOiBmdW5jdGlvbiAoIG5vZGVzICkge1xuXHRcdFx0dmFyIGRpciA9IHN0cm9uZ0RpckZyb21Db250ZW50KCBub2Rlc1sgMCBdICk7XG5cdFx0XHRpZiAoIGRpciA9PT0gJ2x0cicgKSB7XG5cdFx0XHRcdC8vIFdyYXAgaW4gTEVGVC1UTy1SSUdIVCBFTUJFRERJTkcgLi4uIFBPUCBESVJFQ1RJT05BTCBGT1JNQVRUSU5HXG5cdFx0XHRcdHJldHVybiAnXFx1MjAyQScgKyBub2Rlc1sgMCBdICsgJ1xcdTIwMkMnO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCBkaXIgPT09ICdydGwnICkge1xuXHRcdFx0XHQvLyBXcmFwIGluIFJJR0hULVRPLUxFRlQgRU1CRURESU5HIC4uLiBQT1AgRElSRUNUSU9OQUwgRk9STUFUVElOR1xuXHRcdFx0XHRyZXR1cm4gJ1xcdTIwMkInICsgbm9kZXNbIDAgXSArICdcXHUyMDJDJztcblx0XHRcdH1cblx0XHRcdC8vIE5vIHN0cm9uZyBkaXJlY3Rpb25hbGl0eTogZG8gbm90IHdyYXBcblx0XHRcdHJldHVybiBub2Rlc1sgMCBdO1xuXHRcdH1cblx0fSApO1xufSggalF1ZXJ5ICkgKTtcbiIsIi8qIVxuICogalF1ZXJ5IEludGVybmF0aW9uYWxpemF0aW9uIGxpYnJhcnlcbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTEtMjAxMyBTYW50aG9zaCBUaG90dGluZ2FsLCBOZWlsIEthbmRhbGdhb25rYXJcbiAqXG4gKiBqcXVlcnkuaTE4biBpcyBkdWFsIGxpY2Vuc2VkIEdQTHYyIG9yIGxhdGVyIGFuZCBNSVQuIFlvdSBkb24ndCBoYXZlIHRvIGRvXG4gKiBhbnl0aGluZyBzcGVjaWFsIHRvIGNob29zZSBvbmUgbGljZW5zZSBvciB0aGUgb3RoZXIgYW5kIHlvdSBkb24ndCBoYXZlIHRvXG4gKiBub3RpZnkgYW55b25lIHdoaWNoIGxpY2Vuc2UgeW91IGFyZSB1c2luZy4gWW91IGFyZSBmcmVlIHRvIHVzZVxuICogVW5pdmVyc2FsTGFuZ3VhZ2VTZWxlY3RvciBpbiBjb21tZXJjaWFsIHByb2plY3RzIGFzIGxvbmcgYXMgdGhlIGNvcHlyaWdodFxuICogaGVhZGVyIGlzIGxlZnQgaW50YWN0LiBTZWUgZmlsZXMgR1BMLUxJQ0VOU0UgYW5kIE1JVC1MSUNFTlNFIGZvciBkZXRhaWxzLlxuICpcbiAqIEBsaWNlbmNlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbmNlIDIuMCBvciBsYXRlclxuICogQGxpY2VuY2UgTUlUIExpY2Vuc2VcbiAqL1xuXG4oIGZ1bmN0aW9uICggJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBNZXNzYWdlUGFyc2VyRW1pdHRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLmxhbmd1YWdlID0gJC5pMThuLmxhbmd1YWdlc1sgU3RyaW5nLmxvY2FsZSBdIHx8ICQuaTE4bi5sYW5ndWFnZXNbICdkZWZhdWx0JyBdO1xuXHR9O1xuXG5cdE1lc3NhZ2VQYXJzZXJFbWl0dGVyLnByb3RvdHlwZSA9IHtcblx0XHRjb25zdHJ1Y3RvcjogTWVzc2FnZVBhcnNlckVtaXR0ZXIsXG5cblx0XHQvKipcblx0XHQgKiAoV2UgcHV0IHRoaXMgbWV0aG9kIGRlZmluaXRpb24gaGVyZSwgYW5kIG5vdCBpbiBwcm90b3R5cGUsIHRvIG1ha2Vcblx0XHQgKiBzdXJlIGl0J3Mgbm90IG92ZXJ3cml0dGVuIGJ5IGFueSBtYWdpYy4pIFdhbGsgZW50aXJlIG5vZGUgc3RydWN0dXJlLFxuXHRcdCAqIGFwcGx5aW5nIHJlcGxhY2VtZW50cyBhbmQgdGVtcGxhdGUgZnVuY3Rpb25zIHdoZW4gYXBwcm9wcmlhdGVcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7TWl4ZWR9IG5vZGUgYWJzdHJhY3Qgc3ludGF4IHRyZWUgKHRvcCBub2RlIG9yIHN1Ym5vZGUpXG5cdFx0ICogQHBhcmFtIHtBcnJheX0gcmVwbGFjZW1lbnRzIGZvciAkMSwgJDIsIC4uLiAkblxuXHRcdCAqIEByZXR1cm4ge01peGVkfSBzaW5nbGUtc3RyaW5nIG5vZGUgb3IgYXJyYXkgb2Ygbm9kZXMgc3VpdGFibGUgZm9yXG5cdFx0ICogIGpRdWVyeSBhcHBlbmRpbmcuXG5cdFx0ICovXG5cdFx0ZW1pdDogZnVuY3Rpb24gKCBub2RlLCByZXBsYWNlbWVudHMgKSB7XG5cdFx0XHR2YXIgcmV0LCBzdWJub2Rlcywgb3BlcmF0aW9uLFxuXHRcdFx0XHRtZXNzYWdlUGFyc2VyRW1pdHRlciA9IHRoaXM7XG5cblx0XHRcdHN3aXRjaCAoIHR5cGVvZiBub2RlICkge1xuXHRcdFx0XHRjYXNlICdzdHJpbmcnOlxuXHRcdFx0XHRjYXNlICdudW1iZXInOlxuXHRcdFx0XHRcdHJldCA9IG5vZGU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ29iamVjdCc6XG5cdFx0XHRcdC8vIG5vZGUgaXMgYW4gYXJyYXkgb2Ygbm9kZXNcblx0XHRcdFx0XHRzdWJub2RlcyA9ICQubWFwKCBub2RlLnNsaWNlKCAxICksIGZ1bmN0aW9uICggbiApIHtcblx0XHRcdFx0XHRcdHJldHVybiBtZXNzYWdlUGFyc2VyRW1pdHRlci5lbWl0KCBuLCByZXBsYWNlbWVudHMgKTtcblx0XHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0XHRvcGVyYXRpb24gPSBub2RlWyAwIF0udG9Mb3dlckNhc2UoKTtcblxuXHRcdFx0XHRcdGlmICggdHlwZW9mIG1lc3NhZ2VQYXJzZXJFbWl0dGVyWyBvcGVyYXRpb24gXSA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHRcdHJldCA9IG1lc3NhZ2VQYXJzZXJFbWl0dGVyWyBvcGVyYXRpb24gXSggc3Vibm9kZXMsIHJlcGxhY2VtZW50cyApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoICd1bmtub3duIG9wZXJhdGlvbiBcIicgKyBvcGVyYXRpb24gKyAnXCInICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ3VuZGVmaW5lZCc6XG5cdFx0XHRcdC8vIFBhcnNpbmcgdGhlIGVtcHR5IHN0cmluZyAoYXMgYW4gZW50aXJlIGV4cHJlc3Npb24sIG9yIGFzIGFcblx0XHRcdFx0Ly8gcGFyYW1FeHByZXNzaW9uIGluIGEgdGVtcGxhdGUpIHJlc3VsdHMgaW4gdW5kZWZpbmVkXG5cdFx0XHRcdC8vIFBlcmhhcHMgYSBtb3JlIGNsZXZlciBwYXJzZXIgY2FuIGRldGVjdCB0aGlzLCBhbmQgcmV0dXJuIHRoZVxuXHRcdFx0XHQvLyBlbXB0eSBzdHJpbmc/IE9yIGlzIHRoYXQgdXNlZnVsIGluZm9ybWF0aW9uP1xuXHRcdFx0XHQvLyBUaGUgbG9naWNhbCB0aGluZyBpcyBwcm9iYWJseSB0byByZXR1cm4gdGhlIGVtcHR5IHN0cmluZyBoZXJlXG5cdFx0XHRcdC8vIHdoZW4gd2UgZW5jb3VudGVyIHVuZGVmaW5lZC5cblx0XHRcdFx0XHRyZXQgPSAnJztcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoICd1bmV4cGVjdGVkIHR5cGUgaW4gQVNUOiAnICsgdHlwZW9mIG5vZGUgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogUGFyc2luZyBoYXMgYmVlbiBhcHBsaWVkIGRlcHRoLWZpcnN0IHdlIGNhbiBhc3N1bWUgdGhhdCBhbGwgbm9kZXNcblx0XHQgKiBoZXJlIGFyZSBzaW5nbGUgbm9kZXMgTXVzdCByZXR1cm4gYSBzaW5nbGUgbm9kZSB0byBwYXJlbnRzIC0tIGFcblx0XHQgKiBqUXVlcnkgd2l0aCBzeW50aGV0aWMgc3BhbiBIb3dldmVyLCB1bndyYXAgYW55IG90aGVyIHN5bnRoZXRpYyBzcGFuc1xuXHRcdCAqIGluIG91ciBjaGlsZHJlbiBhbmQgcGFzcyB0aGVtIHVwd2FyZHNcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7QXJyYXl9IG5vZGVzIE1peGVkLCBzb21lIHNpbmdsZSBub2Rlcywgc29tZSBhcnJheXMgb2Ygbm9kZXMuXG5cdFx0ICogQHJldHVybiB7c3RyaW5nfVxuXHRcdCAqL1xuXHRcdGNvbmNhdDogZnVuY3Rpb24gKCBub2RlcyApIHtcblx0XHRcdHZhciByZXN1bHQgPSAnJztcblxuXHRcdFx0JC5lYWNoKCBub2RlcywgZnVuY3Rpb24gKCBpLCBub2RlICkge1xuXHRcdFx0XHQvLyBzdHJpbmdzLCBpbnRlZ2VycywgYW55dGhpbmcgZWxzZVxuXHRcdFx0XHRyZXN1bHQgKz0gbm9kZTtcblx0XHRcdH0gKTtcblxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogUmV0dXJuIGVzY2FwZWQgcmVwbGFjZW1lbnQgb2YgY29ycmVjdCBpbmRleCwgb3Igc3RyaW5nIGlmXG5cdFx0ICogdW5hdmFpbGFibGUuIE5vdGUgdGhhdCB3ZSBleHBlY3QgdGhlIHBhcnNlZCBwYXJhbWV0ZXIgdG8gYmVcblx0XHQgKiB6ZXJvLWJhc2VkLiBpLmUuICQxIHNob3VsZCBoYXZlIGJlY29tZSBbIDAgXS4gaWYgdGhlIHNwZWNpZmllZFxuXHRcdCAqIHBhcmFtZXRlciBpcyBub3QgZm91bmQgcmV0dXJuIHRoZSBzYW1lIHN0cmluZyAoZS5nLiBcIiQ5OVwiIC0+XG5cdFx0ICogcGFyYW1ldGVyIDk4IC0+IG5vdCBmb3VuZCAtPiByZXR1cm4gXCIkOTlcIiApIFRPRE8gdGhyb3cgZXJyb3IgaWZcblx0XHQgKiBub2Rlcy5sZW5ndGggPiAxID9cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7QXJyYXl9IG5vZGVzIE9uZSBlbGVtZW50LCBpbnRlZ2VyLCBuID49IDBcblx0XHQgKiBAcGFyYW0ge0FycmF5fSByZXBsYWNlbWVudHMgZm9yICQxLCAkMiwgLi4uICRuXG5cdFx0ICogQHJldHVybiB7c3RyaW5nfSByZXBsYWNlbWVudFxuXHRcdCAqL1xuXHRcdHJlcGxhY2U6IGZ1bmN0aW9uICggbm9kZXMsIHJlcGxhY2VtZW50cyApIHtcblx0XHRcdHZhciBpbmRleCA9IHBhcnNlSW50KCBub2Rlc1sgMCBdLCAxMCApO1xuXG5cdFx0XHRpZiAoIGluZGV4IDwgcmVwbGFjZW1lbnRzLmxlbmd0aCApIHtcblx0XHRcdFx0Ly8gcmVwbGFjZW1lbnQgaXMgbm90IGEgc3RyaW5nLCBkb24ndCB0b3VjaCFcblx0XHRcdFx0cmV0dXJuIHJlcGxhY2VtZW50c1sgaW5kZXggXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIGluZGV4IG5vdCBmb3VuZCwgZmFsbGJhY2sgdG8gZGlzcGxheWluZyB2YXJpYWJsZVxuXHRcdFx0XHRyZXR1cm4gJyQnICsgKCBpbmRleCArIDEgKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogVHJhbnNmb3JtIHBhcnNlZCBzdHJ1Y3R1cmUgaW50byBwbHVyYWxpemF0aW9uIG4uYi4gVGhlIGZpcnN0IG5vZGUgbWF5XG5cdFx0ICogYmUgYSBub24taW50ZWdlciAoZm9yIGluc3RhbmNlLCBhIHN0cmluZyByZXByZXNlbnRpbmcgYW4gQXJhYmljXG5cdFx0ICogbnVtYmVyKS4gU28gY29udmVydCBpdCBiYWNrIHdpdGggdGhlIGN1cnJlbnQgbGFuZ3VhZ2Unc1xuXHRcdCAqIGNvbnZlcnROdW1iZXIuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge0FycmF5fSBub2RlcyBMaXN0IFsge1N0cmluZ3xOdW1iZXJ9LCB7U3RyaW5nfSwge1N0cmluZ30gLi4uIF1cblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd9IHNlbGVjdGVkIHBsdXJhbGl6ZWQgZm9ybSBhY2NvcmRpbmcgdG8gY3VycmVudFxuXHRcdCAqICBsYW5ndWFnZS5cblx0XHQgKi9cblx0XHRwbHVyYWw6IGZ1bmN0aW9uICggbm9kZXMgKSB7XG5cdFx0XHR2YXIgY291bnQgPSBwYXJzZUZsb2F0KCB0aGlzLmxhbmd1YWdlLmNvbnZlcnROdW1iZXIoIG5vZGVzWyAwIF0sIDEwICkgKSxcblx0XHRcdFx0Zm9ybXMgPSBub2Rlcy5zbGljZSggMSApO1xuXG5cdFx0XHRyZXR1cm4gZm9ybXMubGVuZ3RoID8gdGhpcy5sYW5ndWFnZS5jb252ZXJ0UGx1cmFsKCBjb3VudCwgZm9ybXMgKSA6ICcnO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBUcmFuc2Zvcm0gcGFyc2VkIHN0cnVjdHVyZSBpbnRvIGdlbmRlciBVc2FnZVxuXHRcdCAqIHt7Z2VuZGVyOmdlbmRlcnxtYXNjdWxpbmV8ZmVtaW5pbmV8bmV1dHJhbH19LlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtBcnJheX0gbm9kZXMgTGlzdCBbIHtTdHJpbmd9LCB7U3RyaW5nfSwge1N0cmluZ30gLCB7U3RyaW5nfSBdXG5cdFx0ICogQHJldHVybiB7c3RyaW5nfSBzZWxlY3RlZCBnZW5kZXIgZm9ybSBhY2NvcmRpbmcgdG8gY3VycmVudCBsYW5ndWFnZVxuXHRcdCAqL1xuXHRcdGdlbmRlcjogZnVuY3Rpb24gKCBub2RlcyApIHtcblx0XHRcdHZhciBnZW5kZXIgPSBub2Rlc1sgMCBdLFxuXHRcdFx0XHRmb3JtcyA9IG5vZGVzLnNsaWNlKCAxICk7XG5cblx0XHRcdHJldHVybiB0aGlzLmxhbmd1YWdlLmdlbmRlciggZ2VuZGVyLCBmb3JtcyApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBUcmFuc2Zvcm0gcGFyc2VkIHN0cnVjdHVyZSBpbnRvIGdyYW1tYXIgY29udmVyc2lvbi4gSW52b2tlZCBieVxuXHRcdCAqIHB1dHRpbmcge3tncmFtbWFyOmZvcm18d29yZH19IGluIGEgbWVzc2FnZVxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtBcnJheX0gbm9kZXMgTGlzdCBbe0dyYW1tYXIgY2FzZSBlZzogZ2VuaXRpdmV9LCB7U3RyaW5nIHdvcmR9XVxuXHRcdCAqIEByZXR1cm4ge3N0cmluZ30gc2VsZWN0ZWQgZ3JhbW1hdGljYWwgZm9ybSBhY2NvcmRpbmcgdG8gY3VycmVudFxuXHRcdCAqICBsYW5ndWFnZS5cblx0XHQgKi9cblx0XHRncmFtbWFyOiBmdW5jdGlvbiAoIG5vZGVzICkge1xuXHRcdFx0dmFyIGZvcm0gPSBub2Rlc1sgMCBdLFxuXHRcdFx0XHR3b3JkID0gbm9kZXNbIDEgXTtcblxuXHRcdFx0cmV0dXJuIHdvcmQgJiYgZm9ybSAmJiB0aGlzLmxhbmd1YWdlLmNvbnZlcnRHcmFtbWFyKCB3b3JkLCBmb3JtICk7XG5cdFx0fVxuXHR9O1xuXG5cdCQuZXh0ZW5kKCAkLmkxOG4ucGFyc2VyLmVtaXR0ZXIsIG5ldyBNZXNzYWdlUGFyc2VyRW1pdHRlcigpICk7XG59KCBqUXVlcnkgKSApO1xuIiwiLyohXG4gKiBqUXVlcnkgSW50ZXJuYXRpb25hbGl6YXRpb24gbGlicmFyeVxuICpcbiAqIENvcHlyaWdodCAoQykgMjAxMiBTYW50aG9zaCBUaG90dGluZ2FsXG4gKlxuICoganF1ZXJ5LmkxOG4gaXMgZHVhbCBsaWNlbnNlZCBHUEx2MiBvciBsYXRlciBhbmQgTUlULiBZb3UgZG9uJ3QgaGF2ZSB0byBkbyBhbnl0aGluZyBzcGVjaWFsIHRvXG4gKiBjaG9vc2Ugb25lIGxpY2Vuc2Ugb3IgdGhlIG90aGVyIGFuZCB5b3UgZG9uJ3QgaGF2ZSB0byBub3RpZnkgYW55b25lIHdoaWNoIGxpY2Vuc2UgeW91IGFyZSB1c2luZy5cbiAqIFlvdSBhcmUgZnJlZSB0byB1c2UgVW5pdmVyc2FsTGFuZ3VhZ2VTZWxlY3RvciBpbiBjb21tZXJjaWFsIHByb2plY3RzIGFzIGxvbmcgYXMgdGhlIGNvcHlyaWdodFxuICogaGVhZGVyIGlzIGxlZnQgaW50YWN0LiBTZWUgZmlsZXMgR1BMLUxJQ0VOU0UgYW5kIE1JVC1MSUNFTlNFIGZvciBkZXRhaWxzLlxuICpcbiAqIEBsaWNlbmNlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbmNlIDIuMCBvciBsYXRlclxuICogQGxpY2VuY2UgTUlUIExpY2Vuc2VcbiAqL1xuKCBmdW5jdGlvbiAoICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHQkLmkxOG4gPSAkLmkxOG4gfHwge307XG5cdCQuZXh0ZW5kKCAkLmkxOG4uZmFsbGJhY2tzLCB7XG5cdFx0YWI6IFsgJ3J1JyBdLFxuXHRcdGFjZTogWyAnaWQnIF0sXG5cdFx0YWxuOiBbICdzcScgXSxcblx0XHQvLyBOb3Qgc28gc3RhbmRhcmQgLSBhbHMgaXMgc3VwcG9zZWQgdG8gYmUgVG9zayBBbGJhbmlhbixcblx0XHQvLyBidXQgaW4gV2lraXBlZGlhIGl0J3MgdXNlZCBmb3IgYSBHZXJtYW5pYyBsYW5ndWFnZS5cblx0XHRhbHM6IFsgJ2dzdycsICdkZScgXSxcblx0XHRhbjogWyAnZXMnIF0sXG5cdFx0YW5wOiBbICdoaScgXSxcblx0XHRhcm46IFsgJ2VzJyBdLFxuXHRcdGFyejogWyAnYXInIF0sXG5cdFx0YXY6IFsgJ3J1JyBdLFxuXHRcdGF5OiBbICdlcycgXSxcblx0XHRiYTogWyAncnUnIF0sXG5cdFx0YmFyOiBbICdkZScgXSxcblx0XHQnYmF0LXNtZyc6IFsgJ3NncycsICdsdCcgXSxcblx0XHRiY2M6IFsgJ2ZhJyBdLFxuXHRcdCdiZS14LW9sZCc6IFsgJ2JlLXRhcmFzaycgXSxcblx0XHRiaDogWyAnYmhvJyBdLFxuXHRcdGJqbjogWyAnaWQnIF0sXG5cdFx0Ym06IFsgJ2ZyJyBdLFxuXHRcdGJweTogWyAnYm4nIF0sXG5cdFx0YnFpOiBbICdmYScgXSxcblx0XHRidWc6IFsgJ2lkJyBdLFxuXHRcdCdjYmstemFtJzogWyAnZXMnIF0sXG5cdFx0Y2U6IFsgJ3J1JyBdLFxuXHRcdGNyaDogWyAnY3JoLWxhdG4nIF0sXG5cdFx0J2NyaC1jeXJsJzogWyAncnUnIF0sXG5cdFx0Y3NiOiBbICdwbCcgXSxcblx0XHRjdjogWyAncnUnIF0sXG5cdFx0J2RlLWF0JzogWyAnZGUnIF0sXG5cdFx0J2RlLWNoJzogWyAnZGUnIF0sXG5cdFx0J2RlLWZvcm1hbCc6IFsgJ2RlJyBdLFxuXHRcdGRzYjogWyAnZGUnIF0sXG5cdFx0ZHRwOiBbICdtcycgXSxcblx0XHRlZ2w6IFsgJ2l0JyBdLFxuXHRcdGVtbDogWyAnaXQnIF0sXG5cdFx0ZmY6IFsgJ2ZyJyBdLFxuXHRcdGZpdDogWyAnZmknIF0sXG5cdFx0J2ZpdS12cm8nOiBbICd2cm8nLCAnZXQnIF0sXG5cdFx0ZnJjOiBbICdmcicgXSxcblx0XHRmcnA6IFsgJ2ZyJyBdLFxuXHRcdGZycjogWyAnZGUnIF0sXG5cdFx0ZnVyOiBbICdpdCcgXSxcblx0XHRnYWc6IFsgJ3RyJyBdLFxuXHRcdGdhbjogWyAnZ2FuLWhhbnQnLCAnemgtaGFudCcsICd6aC1oYW5zJyBdLFxuXHRcdCdnYW4taGFucyc6IFsgJ3poLWhhbnMnIF0sXG5cdFx0J2dhbi1oYW50JzogWyAnemgtaGFudCcsICd6aC1oYW5zJyBdLFxuXHRcdGdsOiBbICdwdCcgXSxcblx0XHRnbGs6IFsgJ2ZhJyBdLFxuXHRcdGduOiBbICdlcycgXSxcblx0XHRnc3c6IFsgJ2RlJyBdLFxuXHRcdGhpZjogWyAnaGlmLWxhdG4nIF0sXG5cdFx0aHNiOiBbICdkZScgXSxcblx0XHRodDogWyAnZnInIF0sXG5cdFx0aWk6IFsgJ3poLWNuJywgJ3poLWhhbnMnIF0sXG5cdFx0aW5oOiBbICdydScgXSxcblx0XHRpdTogWyAnaWtlLWNhbnMnIF0sXG5cdFx0anV0OiBbICdkYScgXSxcblx0XHRqdjogWyAnaWQnIF0sXG5cdFx0a2FhOiBbICdray1sYXRuJywgJ2trLWN5cmwnIF0sXG5cdFx0a2JkOiBbICdrYmQtY3lybCcgXSxcblx0XHRraHc6IFsgJ3VyJyBdLFxuXHRcdGtpdTogWyAndHInIF0sXG5cdFx0a2s6IFsgJ2trLWN5cmwnIF0sXG5cdFx0J2trLWFyYWInOiBbICdray1jeXJsJyBdLFxuXHRcdCdray1sYXRuJzogWyAna2stY3lybCcgXSxcblx0XHQna2stY24nOiBbICdray1hcmFiJywgJ2trLWN5cmwnIF0sXG5cdFx0J2trLWt6JzogWyAna2stY3lybCcgXSxcblx0XHQna2stdHInOiBbICdray1sYXRuJywgJ2trLWN5cmwnIF0sXG5cdFx0a2w6IFsgJ2RhJyBdLFxuXHRcdCdrby1rcCc6IFsgJ2tvJyBdLFxuXHRcdGtvaTogWyAncnUnIF0sXG5cdFx0a3JjOiBbICdydScgXSxcblx0XHRrczogWyAna3MtYXJhYicgXSxcblx0XHRrc2g6IFsgJ2RlJyBdLFxuXHRcdGt1OiBbICdrdS1sYXRuJyBdLFxuXHRcdCdrdS1hcmFiJzogWyAnY2tiJyBdLFxuXHRcdGt2OiBbICdydScgXSxcblx0XHRsYWQ6IFsgJ2VzJyBdLFxuXHRcdGxiOiBbICdkZScgXSxcblx0XHRsYmU6IFsgJ3J1JyBdLFxuXHRcdGxlejogWyAncnUnIF0sXG5cdFx0bGk6IFsgJ25sJyBdLFxuXHRcdGxpajogWyAnaXQnIF0sXG5cdFx0bGl2OiBbICdldCcgXSxcblx0XHRsbW86IFsgJ2l0JyBdLFxuXHRcdGxuOiBbICdmcicgXSxcblx0XHRsdGc6IFsgJ2x2JyBdLFxuXHRcdGx6ejogWyAndHInIF0sXG5cdFx0bWFpOiBbICdoaScgXSxcblx0XHQnbWFwLWJtcyc6IFsgJ2p2JywgJ2lkJyBdLFxuXHRcdG1nOiBbICdmcicgXSxcblx0XHRtaHI6IFsgJ3J1JyBdLFxuXHRcdG1pbjogWyAnaWQnIF0sXG5cdFx0bW86IFsgJ3JvJyBdLFxuXHRcdG1yajogWyAncnUnIF0sXG5cdFx0bXdsOiBbICdwdCcgXSxcblx0XHRteXY6IFsgJ3J1JyBdLFxuXHRcdG16bjogWyAnZmEnIF0sXG5cdFx0bmFoOiBbICdlcycgXSxcblx0XHRuYXA6IFsgJ2l0JyBdLFxuXHRcdG5kczogWyAnZGUnIF0sXG5cdFx0J25kcy1ubCc6IFsgJ25sJyBdLFxuXHRcdCdubC1pbmZvcm1hbCc6IFsgJ25sJyBdLFxuXHRcdG5vOiBbICduYicgXSxcblx0XHRvczogWyAncnUnIF0sXG5cdFx0cGNkOiBbICdmcicgXSxcblx0XHRwZGM6IFsgJ2RlJyBdLFxuXHRcdHBkdDogWyAnZGUnIF0sXG5cdFx0cGZsOiBbICdkZScgXSxcblx0XHRwbXM6IFsgJ2l0JyBdLFxuXHRcdHB0OiBbICdwdC1icicgXSxcblx0XHQncHQtYnInOiBbICdwdCcgXSxcblx0XHRxdTogWyAnZXMnIF0sXG5cdFx0cXVnOiBbICdxdScsICdlcycgXSxcblx0XHRyZ246IFsgJ2l0JyBdLFxuXHRcdHJteTogWyAncm8nIF0sXG5cdFx0J3JvYS1ydXAnOiBbICdydXAnIF0sXG5cdFx0cnVlOiBbICd1aycsICdydScgXSxcblx0XHRydXE6IFsgJ3J1cS1sYXRuJywgJ3JvJyBdLFxuXHRcdCdydXEtY3lybCc6IFsgJ21rJyBdLFxuXHRcdCdydXEtbGF0bic6IFsgJ3JvJyBdLFxuXHRcdHNhOiBbICdoaScgXSxcblx0XHRzYWg6IFsgJ3J1JyBdLFxuXHRcdHNjbjogWyAnaXQnIF0sXG5cdFx0c2c6IFsgJ2ZyJyBdLFxuXHRcdHNnczogWyAnbHQnIF0sXG5cdFx0c2xpOiBbICdkZScgXSxcblx0XHRzcjogWyAnc3ItZWMnIF0sXG5cdFx0c3JuOiBbICdubCcgXSxcblx0XHRzdHE6IFsgJ2RlJyBdLFxuXHRcdHN1OiBbICdpZCcgXSxcblx0XHRzemw6IFsgJ3BsJyBdLFxuXHRcdHRjeTogWyAna24nIF0sXG5cdFx0dGc6IFsgJ3RnLWN5cmwnIF0sXG5cdFx0dHQ6IFsgJ3R0LWN5cmwnLCAncnUnIF0sXG5cdFx0J3R0LWN5cmwnOiBbICdydScgXSxcblx0XHR0eTogWyAnZnInIF0sXG5cdFx0dWRtOiBbICdydScgXSxcblx0XHR1ZzogWyAndWctYXJhYicgXSxcblx0XHR1azogWyAncnUnIF0sXG5cdFx0dmVjOiBbICdpdCcgXSxcblx0XHR2ZXA6IFsgJ2V0JyBdLFxuXHRcdHZsczogWyAnbmwnIF0sXG5cdFx0dm1mOiBbICdkZScgXSxcblx0XHR2b3Q6IFsgJ2ZpJyBdLFxuXHRcdHZybzogWyAnZXQnIF0sXG5cdFx0d2E6IFsgJ2ZyJyBdLFxuXHRcdHdvOiBbICdmcicgXSxcblx0XHR3dXU6IFsgJ3poLWhhbnMnIF0sXG5cdFx0eGFsOiBbICdydScgXSxcblx0XHR4bWY6IFsgJ2thJyBdLFxuXHRcdHlpOiBbICdoZScgXSxcblx0XHR6YTogWyAnemgtaGFucycgXSxcblx0XHR6ZWE6IFsgJ25sJyBdLFxuXHRcdHpoOiBbICd6aC1oYW5zJyBdLFxuXHRcdCd6aC1jbGFzc2ljYWwnOiBbICdsemgnIF0sXG5cdFx0J3poLWNuJzogWyAnemgtaGFucycgXSxcblx0XHQnemgtaGFudCc6IFsgJ3poLWhhbnMnIF0sXG5cdFx0J3poLWhrJzogWyAnemgtaGFudCcsICd6aC1oYW5zJyBdLFxuXHRcdCd6aC1taW4tbmFuJzogWyAnbmFuJyBdLFxuXHRcdCd6aC1tbyc6IFsgJ3poLWhrJywgJ3poLWhhbnQnLCAnemgtaGFucycgXSxcblx0XHQnemgtbXknOiBbICd6aC1zZycsICd6aC1oYW5zJyBdLFxuXHRcdCd6aC1zZyc6IFsgJ3poLWhhbnMnIF0sXG5cdFx0J3poLXR3JzogWyAnemgtaGFudCcsICd6aC1oYW5zJyBdLFxuXHRcdCd6aC15dWUnOiBbICd5dWUnIF1cblx0fSApO1xufSggalF1ZXJ5ICkgKTtcbiIsIi8qIVxuICogalF1ZXJ5IEludGVybmF0aW9uYWxpemF0aW9uIGxpYnJhcnlcbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTIgU2FudGhvc2ggVGhvdHRpbmdhbFxuICpcbiAqIGpxdWVyeS5pMThuIGlzIGR1YWwgbGljZW5zZWQgR1BMdjIgb3IgbGF0ZXIgYW5kIE1JVC4gWW91IGRvbid0IGhhdmUgdG8gZG9cbiAqIGFueXRoaW5nIHNwZWNpYWwgdG8gY2hvb3NlIG9uZSBsaWNlbnNlIG9yIHRoZSBvdGhlciBhbmQgeW91IGRvbid0IGhhdmUgdG9cbiAqIG5vdGlmeSBhbnlvbmUgd2hpY2ggbGljZW5zZSB5b3UgYXJlIHVzaW5nLiBZb3UgYXJlIGZyZWUgdG8gdXNlXG4gKiBVbml2ZXJzYWxMYW5ndWFnZVNlbGVjdG9yIGluIGNvbW1lcmNpYWwgcHJvamVjdHMgYXMgbG9uZyBhcyB0aGUgY29weXJpZ2h0XG4gKiBoZWFkZXIgaXMgbGVmdCBpbnRhY3QuIFNlZSBmaWxlcyBHUEwtTElDRU5TRSBhbmQgTUlULUxJQ0VOU0UgZm9yIGRldGFpbHMuXG4gKlxuICogQGxpY2VuY2UgR05VIEdlbmVyYWwgUHVibGljIExpY2VuY2UgMi4wIG9yIGxhdGVyXG4gKiBAbGljZW5jZSBNSVQgTGljZW5zZVxuICovXG5cbiggZnVuY3Rpb24gKCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIEkxOE4sXG5cdFx0c2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cdC8qKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcblx0ICovXG5cdEkxOE4gPSBmdW5jdGlvbiAoIG9wdGlvbnMgKSB7XG5cdFx0Ly8gTG9hZCBkZWZhdWx0c1xuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKCB7fSwgSTE4Ti5kZWZhdWx0cywgb3B0aW9ucyApO1xuXG5cdFx0dGhpcy5wYXJzZXIgPSB0aGlzLm9wdGlvbnMucGFyc2VyO1xuXHRcdHRoaXMubG9jYWxlID0gdGhpcy5vcHRpb25zLmxvY2FsZTtcblx0XHR0aGlzLm1lc3NhZ2VTdG9yZSA9IHRoaXMub3B0aW9ucy5tZXNzYWdlU3RvcmU7XG5cdFx0dGhpcy5sYW5ndWFnZXMgPSB7fTtcblx0fTtcblxuXHRJMThOLnByb3RvdHlwZSA9IHtcblx0XHQvKipcblx0XHQgKiBMb2NhbGl6ZSBhIGdpdmVuIG1lc3NhZ2VLZXkgdG8gYSBsb2NhbGUuXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VLZXlcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9IExvY2FsaXplZCBtZXNzYWdlXG5cdFx0ICovXG5cdFx0bG9jYWxpemU6IGZ1bmN0aW9uICggbWVzc2FnZUtleSApIHtcblx0XHRcdHZhciBsb2NhbGVQYXJ0cywgbG9jYWxlUGFydEluZGV4LCBsb2NhbGUsIGZhbGxiYWNrSW5kZXgsXG5cdFx0XHRcdHRyeWluZ0xvY2FsZSwgbWVzc2FnZTtcblxuXHRcdFx0bG9jYWxlID0gdGhpcy5sb2NhbGU7XG5cdFx0XHRmYWxsYmFja0luZGV4ID0gMDtcblxuXHRcdFx0d2hpbGUgKCBsb2NhbGUgKSB7XG5cdFx0XHRcdC8vIEl0ZXJhdGUgdGhyb3VnaCBsb2NhbGVzIHN0YXJ0aW5nIGF0IG1vc3Qtc3BlY2lmaWMgdW50aWxcblx0XHRcdFx0Ly8gbG9jYWxpemF0aW9uIGlzIGZvdW5kLiBBcyBpbiBmaS1MYXRuLUZJLCBmaS1MYXRuIGFuZCBmaS5cblx0XHRcdFx0bG9jYWxlUGFydHMgPSBsb2NhbGUuc3BsaXQoICctJyApO1xuXHRcdFx0XHRsb2NhbGVQYXJ0SW5kZXggPSBsb2NhbGVQYXJ0cy5sZW5ndGg7XG5cblx0XHRcdFx0ZG8ge1xuXHRcdFx0XHRcdHRyeWluZ0xvY2FsZSA9IGxvY2FsZVBhcnRzLnNsaWNlKCAwLCBsb2NhbGVQYXJ0SW5kZXggKS5qb2luKCAnLScgKTtcblx0XHRcdFx0XHRtZXNzYWdlID0gdGhpcy5tZXNzYWdlU3RvcmUuZ2V0KCB0cnlpbmdMb2NhbGUsIG1lc3NhZ2VLZXkgKTtcblxuXHRcdFx0XHRcdGlmICggbWVzc2FnZSApIHtcblx0XHRcdFx0XHRcdHJldHVybiBtZXNzYWdlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGxvY2FsZVBhcnRJbmRleC0tO1xuXHRcdFx0XHR9IHdoaWxlICggbG9jYWxlUGFydEluZGV4ICk7XG5cblx0XHRcdFx0aWYgKCBsb2NhbGUgPT09ICdlbicgKSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsb2NhbGUgPSAoICQuaTE4bi5mYWxsYmFja3NbIHRoaXMubG9jYWxlIF0gJiZcblx0XHRcdFx0XHRcdCQuaTE4bi5mYWxsYmFja3NbIHRoaXMubG9jYWxlIF1bIGZhbGxiYWNrSW5kZXggXSApIHx8XG5cdFx0XHRcdFx0XHR0aGlzLm9wdGlvbnMuZmFsbGJhY2tMb2NhbGU7XG5cdFx0XHRcdCQuaTE4bi5sb2coICdUcnlpbmcgZmFsbGJhY2sgbG9jYWxlIGZvciAnICsgdGhpcy5sb2NhbGUgKyAnOiAnICsgbG9jYWxlICsgJyAoJyArIG1lc3NhZ2VLZXkgKyAnKScgKTtcblxuXHRcdFx0XHRmYWxsYmFja0luZGV4Kys7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGtleSBub3QgZm91bmRcblx0XHRcdHJldHVybiAnJztcblx0XHR9LFxuXG5cdFx0Lypcblx0XHQgKiBEZXN0cm95IHRoZSBpMThuIGluc3RhbmNlLlxuXHRcdCAqL1xuXHRcdGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcblx0XHRcdCQucmVtb3ZlRGF0YSggZG9jdW1lbnQsICdpMThuJyApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBHZW5lcmFsIG1lc3NhZ2UgbG9hZGluZyBBUEkgVGhpcyBjYW4gdGFrZSBhIFVSTCBzdHJpbmcgZm9yXG5cdFx0ICogdGhlIGpzb24gZm9ybWF0dGVkIG1lc3NhZ2VzLiBFeGFtcGxlOlxuXHRcdCAqIDxjb2RlPmxvYWQoJ3BhdGgvdG8vYWxsX2xvY2FsaXphdGlvbnMuanNvbicpOzwvY29kZT5cblx0XHQgKlxuXHRcdCAqIFRvIGxvYWQgYSBsb2NhbGl6YXRpb24gZmlsZSBmb3IgYSBsb2NhbGU6XG5cdFx0ICogPGNvZGU+XG5cdFx0ICogbG9hZCgncGF0aC90by9kZS1tZXNzYWdlcy5qc29uJywgJ2RlJyApO1xuXHRcdCAqIDwvY29kZT5cblx0XHQgKlxuXHRcdCAqIFRvIGxvYWQgYSBsb2NhbGl6YXRpb24gZmlsZSBmcm9tIGEgZGlyZWN0b3J5OlxuXHRcdCAqIDxjb2RlPlxuXHRcdCAqIGxvYWQoJ3BhdGgvdG8vaTE4bi9kaXJlY3RvcnknLCAnZGUnICk7XG5cdFx0ICogPC9jb2RlPlxuXHRcdCAqIFRoZSBhYm92ZSBtZXRob2QgaGFzIHRoZSBhZHZhbnRhZ2Ugb2YgZmFsbGJhY2sgcmVzb2x1dGlvbi5cblx0XHQgKiBpZSwgaXQgd2lsbCBhdXRvbWF0aWNhbGx5IGxvYWQgdGhlIGZhbGxiYWNrIGxvY2FsZXMgZm9yIGRlLlxuXHRcdCAqIEZvciBtb3N0IHVzZWNhc2VzLCB0aGlzIGlzIHRoZSByZWNvbW1lbmRlZCBtZXRob2QuXG5cdFx0ICogSXQgaXMgb3B0aW9uYWwgdG8gaGF2ZSB0cmFpbGluZyBzbGFzaCBhdCBlbmQuXG5cdFx0ICpcblx0XHQgKiBBIGRhdGEgb2JqZWN0IGNvbnRhaW5pbmcgbWVzc2FnZSBrZXktIG1lc3NhZ2UgdHJhbnNsYXRpb24gbWFwcGluZ3Ncblx0XHQgKiBjYW4gYWxzbyBiZSBwYXNzZWQuIEV4YW1wbGU6XG5cdFx0ICogPGNvZGU+XG5cdFx0ICogbG9hZCggeyAnaGVsbG8nIDogJ0hlbGxvJyB9LCBvcHRpb25hbExvY2FsZSApO1xuXHRcdCAqIDwvY29kZT5cblx0XHQgKlxuXHRcdCAqIEEgc291cmNlIG1hcCBjb250YWluaW5nIGtleS12YWx1ZSBwYWlyIG9mIGxhbmd1YWdlbmFtZSBhbmQgbG9jYXRpb25zXG5cdFx0ICogY2FuIGFsc28gYmUgcGFzc2VkLiBFeGFtcGxlOlxuXHRcdCAqIDxjb2RlPlxuXHRcdCAqIGxvYWQoIHtcblx0XHQgKiBibjogJ2kxOG4vYm4uanNvbicsXG5cdFx0ICogaGU6ICdpMThuL2hlLmpzb24nLFxuXHRcdCAqIGVuOiAnaTE4bi9lbi5qc29uJ1xuXHRcdCAqIH0gKVxuXHRcdCAqIDwvY29kZT5cblx0XHQgKlxuXHRcdCAqIElmIHRoZSBkYXRhIGFyZ3VtZW50IGlzIG51bGwvdW5kZWZpbmVkL2ZhbHNlLFxuXHRcdCAqIGFsbCBjYWNoZWQgbWVzc2FnZXMgZm9yIHRoZSBpMThuIGluc3RhbmNlIHdpbGwgZ2V0IHJlc2V0LlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd8T2JqZWN0fSBzb3VyY2Vcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gbG9jYWxlIExhbmd1YWdlIHRhZ1xuXHRcdCAqIEByZXR1cm4ge2pRdWVyeS5Qcm9taXNlfVxuXHRcdCAqL1xuXHRcdGxvYWQ6IGZ1bmN0aW9uICggc291cmNlLCBsb2NhbGUgKSB7XG5cdFx0XHR2YXIgZmFsbGJhY2tMb2NhbGVzLCBsb2NJbmRleCwgZmFsbGJhY2tMb2NhbGUsIHNvdXJjZU1hcCA9IHt9O1xuXHRcdFx0aWYgKCAhc291cmNlICYmICFsb2NhbGUgKSB7XG5cdFx0XHRcdHNvdXJjZSA9ICdpMThuLycgKyAkLmkxOG4oKS5sb2NhbGUgKyAnLmpzb24nO1xuXHRcdFx0XHRsb2NhbGUgPSAkLmkxOG4oKS5sb2NhbGU7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIHR5cGVvZiBzb3VyY2UgPT09ICdzdHJpbmcnICYmXG5cdFx0XHRcdC8vIHNvdXJjZSBleHRlbnNpb24gc2hvdWxkIGJlIGpzb24sIGJ1dCBjYW4gaGF2ZSBxdWVyeSBwYXJhbXMgYWZ0ZXIgdGhhdC5cblx0XHRcdFx0c291cmNlLnNwbGl0KCAnPycgKVsgMCBdLnNwbGl0KCAnLicgKS5wb3AoKSAhPT0gJ2pzb24nXG5cdFx0XHQpIHtcblx0XHRcdFx0Ly8gTG9hZCBzcGVjaWZpZWQgbG9jYWxlIHRoZW4gY2hlY2sgZm9yIGZhbGxiYWNrcyB3aGVuIGRpcmVjdG9yeSBpc1xuXHRcdFx0XHQvLyBzcGVjaWZpZWQgaW4gbG9hZCgpXG5cdFx0XHRcdHNvdXJjZU1hcFsgbG9jYWxlIF0gPSBzb3VyY2UgKyAnLycgKyBsb2NhbGUgKyAnLmpzb24nO1xuXHRcdFx0XHRmYWxsYmFja0xvY2FsZXMgPSAoICQuaTE4bi5mYWxsYmFja3NbIGxvY2FsZSBdIHx8IFtdIClcblx0XHRcdFx0XHQuY29uY2F0KCB0aGlzLm9wdGlvbnMuZmFsbGJhY2tMb2NhbGUgKTtcblx0XHRcdFx0Zm9yICggbG9jSW5kZXggPSAwOyBsb2NJbmRleCA8IGZhbGxiYWNrTG9jYWxlcy5sZW5ndGg7IGxvY0luZGV4KysgKSB7XG5cdFx0XHRcdFx0ZmFsbGJhY2tMb2NhbGUgPSBmYWxsYmFja0xvY2FsZXNbIGxvY0luZGV4IF07XG5cdFx0XHRcdFx0c291cmNlTWFwWyBmYWxsYmFja0xvY2FsZSBdID0gc291cmNlICsgJy8nICsgZmFsbGJhY2tMb2NhbGUgKyAnLmpzb24nO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLmxvYWQoIHNvdXJjZU1hcCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMubWVzc2FnZVN0b3JlLmxvYWQoIHNvdXJjZSwgbG9jYWxlICk7XG5cdFx0XHR9XG5cblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogRG9lcyBwYXJhbWV0ZXIgYW5kIG1hZ2ljIHdvcmQgc3Vic3RpdHV0aW9uLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGtleSBNZXNzYWdlIGtleVxuXHRcdCAqIEBwYXJhbSB7QXJyYXl9IHBhcmFtZXRlcnMgTWVzc2FnZSBwYXJhbWV0ZXJzXG5cdFx0ICogQHJldHVybiB7c3RyaW5nfVxuXHRcdCAqL1xuXHRcdHBhcnNlOiBmdW5jdGlvbiAoIGtleSwgcGFyYW1ldGVycyApIHtcblx0XHRcdHZhciBtZXNzYWdlID0gdGhpcy5sb2NhbGl6ZSgga2V5ICk7XG5cdFx0XHQvLyBGSVhNRTogVGhpcyBjaGFuZ2VzIHRoZSBzdGF0ZSBvZiB0aGUgSTE4TiBvYmplY3QsXG5cdFx0XHQvLyBzaG91bGQgcHJvYmFibHkgbm90IGNoYW5nZSB0aGUgJ3RoaXMucGFyc2VyJyBidXQganVzdFxuXHRcdFx0Ly8gcGFzcyBpdCB0byB0aGUgcGFyc2VyLlxuXHRcdFx0dGhpcy5wYXJzZXIubGFuZ3VhZ2UgPSAkLmkxOG4ubGFuZ3VhZ2VzWyAkLmkxOG4oKS5sb2NhbGUgXSB8fCAkLmkxOG4ubGFuZ3VhZ2VzWyAnZGVmYXVsdCcgXTtcblx0XHRcdGlmICggbWVzc2FnZSA9PT0gJycgKSB7XG5cdFx0XHRcdG1lc3NhZ2UgPSBrZXk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5wYXJzZXIucGFyc2UoIG1lc3NhZ2UsIHBhcmFtZXRlcnMgKTtcblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIFByb2Nlc3MgYSBtZXNzYWdlIGZyb20gdGhlICQuSTE4TiBpbnN0YW5jZVxuXHQgKiBmb3IgdGhlIGN1cnJlbnQgZG9jdW1lbnQsIHN0b3JlZCBpbiBqUXVlcnkuZGF0YShkb2N1bWVudCkuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgS2V5IG9mIHRoZSBtZXNzYWdlLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW0xIFtwYXJhbS4uLl0gVmFyaWFkaWMgbGlzdCBvZiBwYXJhbWV0ZXJzIGZvciB7a2V5fS5cblx0ICogQHJldHVybiB7c3RyaW5nfCQuSTE4Tn0gUGFyc2VkIG1lc3NhZ2UsIG9yIGlmIG5vIGtleSB3YXMgZ2l2ZW5cblx0ICogdGhlIGluc3RhbmNlIG9mICQuSTE4TiBpcyByZXR1cm5lZC5cblx0ICovXG5cdCQuaTE4biA9IGZ1bmN0aW9uICgga2V5LCBwYXJhbTEgKSB7XG5cdFx0dmFyIHBhcmFtZXRlcnMsXG5cdFx0XHRpMThuID0gJC5kYXRhKCBkb2N1bWVudCwgJ2kxOG4nICksXG5cdFx0XHRvcHRpb25zID0gdHlwZW9mIGtleSA9PT0gJ29iamVjdCcgJiYga2V5O1xuXG5cdFx0Ly8gSWYgdGhlIGxvY2FsZSBvcHRpb24gZm9yIHRoaXMgY2FsbCBpcyBkaWZmZXJlbnQgdGhlbiB0aGUgc2V0dXAgc28gZmFyLFxuXHRcdC8vIHVwZGF0ZSBpdCBhdXRvbWF0aWNhbGx5LiBUaGlzIGRvZXNuJ3QganVzdCBjaGFuZ2UgdGhlIGNvbnRleHQgZm9yIHRoaXNcblx0XHQvLyBjYWxsIGJ1dCBmb3IgYWxsIGZ1dHVyZSBjYWxsIGFzIHdlbGwuXG5cdFx0Ly8gSWYgdGhlcmUgaXMgbm8gaTE4biBzZXR1cCB5ZXQsIGRvbid0IGRvIHRoaXMuIEl0IHdpbGwgYmUgdGFrZW4gY2FyZSBvZlxuXHRcdC8vIGJ5IHRoZSBgbmV3IEkxOE5gIGNvbnN0cnVjdGlvbiBiZWxvdy5cblx0XHQvLyBOT1RFOiBJdCBzaG91bGQgb25seSBjaGFuZ2UgbGFuZ3VhZ2UgZm9yIHRoaXMgb25lIGNhbGwuXG5cdFx0Ly8gVGhlbiBjYWNoZSBpbnN0YW5jZXMgb2YgSTE4TiBzb21ld2hlcmUuXG5cdFx0aWYgKCBvcHRpb25zICYmIG9wdGlvbnMubG9jYWxlICYmIGkxOG4gJiYgaTE4bi5sb2NhbGUgIT09IG9wdGlvbnMubG9jYWxlICkge1xuXHRcdFx0aTE4bi5sb2NhbGUgPSBvcHRpb25zLmxvY2FsZTtcblx0XHR9XG5cblx0XHRpZiAoICFpMThuICkge1xuXHRcdFx0aTE4biA9IG5ldyBJMThOKCBvcHRpb25zICk7XG5cdFx0XHQkLmRhdGEoIGRvY3VtZW50LCAnaTE4bicsIGkxOG4gKTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnICkge1xuXHRcdFx0aWYgKCBwYXJhbTEgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0cGFyYW1ldGVycyA9IHNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cGFyYW1ldGVycyA9IFtdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gaTE4bi5wYXJzZSgga2V5LCBwYXJhbWV0ZXJzICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIEZJWE1FOiByZW1vdmUgdGhpcyBmZWF0dXJlL2J1Zy5cblx0XHRcdHJldHVybiBpMThuO1xuXHRcdH1cblx0fTtcblxuXHQkLmZuLmkxOG4gPSBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGkxOG4gPSAkLmRhdGEoIGRvY3VtZW50LCAnaTE4bicgKTtcblxuXHRcdGlmICggIWkxOG4gKSB7XG5cdFx0XHRpMThuID0gbmV3IEkxOE4oKTtcblx0XHRcdCQuZGF0YSggZG9jdW1lbnQsICdpMThuJywgaTE4biApO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmVhY2goIGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKSxcblx0XHRcdFx0bWVzc2FnZUtleSA9ICR0aGlzLmRhdGEoICdpMThuJyApLFxuXHRcdFx0XHRsQnJhY2tldCwgckJyYWNrZXQsIHR5cGUsIGtleTtcblxuXHRcdFx0aWYgKCBtZXNzYWdlS2V5ICkge1xuXHRcdFx0XHRsQnJhY2tldCA9IG1lc3NhZ2VLZXkuaW5kZXhPZiggJ1snICk7XG5cdFx0XHRcdHJCcmFja2V0ID0gbWVzc2FnZUtleS5pbmRleE9mKCAnXScgKTtcblx0XHRcdFx0aWYgKCBsQnJhY2tldCAhPT0gLTEgJiYgckJyYWNrZXQgIT09IC0xICYmIGxCcmFja2V0IDwgckJyYWNrZXQgKSB7XG5cdFx0XHRcdFx0dHlwZSA9IG1lc3NhZ2VLZXkuc2xpY2UoIGxCcmFja2V0ICsgMSwgckJyYWNrZXQgKTtcblx0XHRcdFx0XHRrZXkgPSBtZXNzYWdlS2V5LnNsaWNlKCByQnJhY2tldCArIDEgKTtcblx0XHRcdFx0XHRpZiAoIHR5cGUgPT09ICdodG1sJyApIHtcblx0XHRcdFx0XHRcdCR0aGlzLmh0bWwoIGkxOG4ucGFyc2UoIGtleSApICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCR0aGlzLmF0dHIoIHR5cGUsIGkxOG4ucGFyc2UoIGtleSApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCR0aGlzLnRleHQoIGkxOG4ucGFyc2UoIG1lc3NhZ2VLZXkgKSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkdGhpcy5maW5kKCAnW2RhdGEtaTE4bl0nICkuaTE4bigpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fTtcblxuXHRmdW5jdGlvbiBnZXREZWZhdWx0TG9jYWxlKCkge1xuXHRcdHZhciBuYXYsIGxvY2FsZSA9ICQoICdodG1sJyApLmF0dHIoICdsYW5nJyApO1xuXG5cdFx0aWYgKCAhbG9jYWxlICkge1xuXHRcdFx0aWYgKCB0eXBlb2Ygd2luZG93Lm5hdmlnYXRvciAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRuYXYgPSB3aW5kb3cubmF2aWdhdG9yO1xuXHRcdFx0XHRsb2NhbGUgPSBuYXYubGFuZ3VhZ2UgfHwgbmF2LnVzZXJMYW5ndWFnZSB8fCAnJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxvY2FsZSA9ICcnO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbG9jYWxlO1xuXHR9XG5cblx0JC5pMThuLmxhbmd1YWdlcyA9IHt9O1xuXHQkLmkxOG4ubWVzc2FnZVN0b3JlID0gJC5pMThuLm1lc3NhZ2VTdG9yZSB8fCB7fTtcblx0JC5pMThuLnBhcnNlciA9IHtcblx0XHQvLyBUaGUgZGVmYXVsdCBwYXJzZXIgb25seSBoYW5kbGVzIHZhcmlhYmxlIHN1YnN0aXR1dGlvblxuXHRcdHBhcnNlOiBmdW5jdGlvbiAoIG1lc3NhZ2UsIHBhcmFtZXRlcnMgKSB7XG5cdFx0XHRyZXR1cm4gbWVzc2FnZS5yZXBsYWNlKCAvXFwkKFxcZCspL2csIGZ1bmN0aW9uICggc3RyLCBtYXRjaCApIHtcblx0XHRcdFx0dmFyIGluZGV4ID0gcGFyc2VJbnQoIG1hdGNoLCAxMCApIC0gMTtcblx0XHRcdFx0cmV0dXJuIHBhcmFtZXRlcnNbIGluZGV4IF0gIT09IHVuZGVmaW5lZCA/IHBhcmFtZXRlcnNbIGluZGV4IF0gOiAnJCcgKyBtYXRjaDtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGVtaXR0ZXI6IHt9XG5cdH07XG5cdCQuaTE4bi5mYWxsYmFja3MgPSB7fTtcblx0JC5pMThuLmRlYnVnID0gZmFsc2U7XG5cdCQuaTE4bi5sb2cgPSBmdW5jdGlvbiAoIC8qIGFyZ3VtZW50cyAqLyApIHtcblx0XHRpZiAoIHdpbmRvdy5jb25zb2xlICYmICQuaTE4bi5kZWJ1ZyApIHtcblx0XHRcdHdpbmRvdy5jb25zb2xlLmxvZy5hcHBseSggd2luZG93LmNvbnNvbGUsIGFyZ3VtZW50cyApO1xuXHRcdH1cblx0fTtcblx0LyogU3RhdGljIG1lbWJlcnMgKi9cblx0STE4Ti5kZWZhdWx0cyA9IHtcblx0XHRsb2NhbGU6IGdldERlZmF1bHRMb2NhbGUoKSxcblx0XHRmYWxsYmFja0xvY2FsZTogJ2VuJyxcblx0XHRwYXJzZXI6ICQuaTE4bi5wYXJzZXIsXG5cdFx0bWVzc2FnZVN0b3JlOiAkLmkxOG4ubWVzc2FnZVN0b3JlXG5cdH07XG5cblx0Ly8gRXhwb3NlIGNvbnN0cnVjdG9yXG5cdCQuaTE4bi5jb25zdHJ1Y3RvciA9IEkxOE47XG59KCBqUXVlcnkgKSApOyIsIi8qIGdsb2JhbCBwbHVyYWxSdWxlUGFyc2VyICovXG4oIGZ1bmN0aW9uICggJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vIGpzY3M6ZGlzYWJsZVxuXHR2YXIgbGFuZ3VhZ2UgPSB7XG5cdFx0Ly8gQ0xEUiBwbHVyYWwgcnVsZXMgZ2VuZXJhdGVkIHVzaW5nXG5cdFx0Ly8gbGlicy9DTERSUGx1cmFsUnVsZVBhcnNlci90b29scy9QbHVyYWxYTUwySlNPTi5odG1sXG5cdFx0cGx1cmFsUnVsZXM6IHtcblx0XHRcdGFrOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAwLi4xJ1xuXHRcdFx0fSxcblx0XHRcdGFtOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwIG9yIG4gPSAxJ1xuXHRcdFx0fSxcblx0XHRcdGFyOiB7XG5cdFx0XHRcdHplcm86ICduID0gMCcsXG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInLFxuXHRcdFx0XHRmZXc6ICduICUgMTAwID0gMy4uMTAnLFxuXHRcdFx0XHRtYW55OiAnbiAlIDEwMCA9IDExLi45OSdcblx0XHRcdH0sXG5cdFx0XHRhcnM6IHtcblx0XHRcdFx0emVybzogJ24gPSAwJyxcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMicsXG5cdFx0XHRcdGZldzogJ24gJSAxMDAgPSAzLi4xMCcsXG5cdFx0XHRcdG1hbnk6ICduICUgMTAwID0gMTEuLjk5J1xuXHRcdFx0fSxcblx0XHRcdGFzOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwIG9yIG4gPSAxJ1xuXHRcdFx0fSxcblx0XHRcdGJlOiB7XG5cdFx0XHRcdG9uZTogJ24gJSAxMCA9IDEgYW5kIG4gJSAxMDAgIT0gMTEnLFxuXHRcdFx0XHRmZXc6ICduICUgMTAgPSAyLi40IGFuZCBuICUgMTAwICE9IDEyLi4xNCcsXG5cdFx0XHRcdG1hbnk6ICduICUgMTAgPSAwIG9yIG4gJSAxMCA9IDUuLjkgb3IgbiAlIDEwMCA9IDExLi4xNCdcblx0XHRcdH0sXG5cdFx0XHRiaDoge1xuXHRcdFx0XHRvbmU6ICduID0gMC4uMSdcblx0XHRcdH0sXG5cdFx0XHRibjoge1xuXHRcdFx0XHRvbmU6ICdpID0gMCBvciBuID0gMSdcblx0XHRcdH0sXG5cdFx0XHRicjoge1xuXHRcdFx0XHRvbmU6ICduICUgMTAgPSAxIGFuZCBuICUgMTAwICE9IDExLDcxLDkxJyxcblx0XHRcdFx0dHdvOiAnbiAlIDEwID0gMiBhbmQgbiAlIDEwMCAhPSAxMiw3Miw5MicsXG5cdFx0XHRcdGZldzogJ24gJSAxMCA9IDMuLjQsOSBhbmQgbiAlIDEwMCAhPSAxMC4uMTksNzAuLjc5LDkwLi45OScsXG5cdFx0XHRcdG1hbnk6ICduICE9IDAgYW5kIG4gJSAxMDAwMDAwID0gMCdcblx0XHRcdH0sXG5cdFx0XHRiczoge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSAlIDEwID0gMSBhbmQgaSAlIDEwMCAhPSAxMSBvciBmICUgMTAgPSAxIGFuZCBmICUgMTAwICE9IDExJyxcblx0XHRcdFx0ZmV3OiAndiA9IDAgYW5kIGkgJSAxMCA9IDIuLjQgYW5kIGkgJSAxMDAgIT0gMTIuLjE0IG9yIGYgJSAxMCA9IDIuLjQgYW5kIGYgJSAxMDAgIT0gMTIuLjE0J1xuXHRcdFx0fSxcblx0XHRcdGNzOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAxIGFuZCB2ID0gMCcsXG5cdFx0XHRcdGZldzogJ2kgPSAyLi40IGFuZCB2ID0gMCcsXG5cdFx0XHRcdG1hbnk6ICd2ICE9IDAnXG5cdFx0XHR9LFxuXHRcdFx0Y3k6IHtcblx0XHRcdFx0emVybzogJ24gPSAwJyxcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMicsXG5cdFx0XHRcdGZldzogJ24gPSAzJyxcblx0XHRcdFx0bWFueTogJ24gPSA2J1xuXHRcdFx0fSxcblx0XHRcdGRhOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxIG9yIHQgIT0gMCBhbmQgaSA9IDAsMSdcblx0XHRcdH0sXG5cdFx0XHRkc2I6IHtcblx0XHRcdFx0b25lOiAndiA9IDAgYW5kIGkgJSAxMDAgPSAxIG9yIGYgJSAxMDAgPSAxJyxcblx0XHRcdFx0dHdvOiAndiA9IDAgYW5kIGkgJSAxMDAgPSAyIG9yIGYgJSAxMDAgPSAyJyxcblx0XHRcdFx0ZmV3OiAndiA9IDAgYW5kIGkgJSAxMDAgPSAzLi40IG9yIGYgJSAxMDAgPSAzLi40J1xuXHRcdFx0fSxcblx0XHRcdGZhOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwIG9yIG4gPSAxJ1xuXHRcdFx0fSxcblx0XHRcdGZmOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwLDEnXG5cdFx0XHR9LFxuXHRcdFx0ZmlsOiB7XG5cdFx0XHRcdG9uZTogJ3YgPSAwIGFuZCBpID0gMSwyLDMgb3IgdiA9IDAgYW5kIGkgJSAxMCAhPSA0LDYsOSBvciB2ICE9IDAgYW5kIGYgJSAxMCAhPSA0LDYsOSdcblx0XHRcdH0sXG5cdFx0XHRmcjoge1xuXHRcdFx0XHRvbmU6ICdpID0gMCwxJ1xuXHRcdFx0fSxcblx0XHRcdGdhOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInLFxuXHRcdFx0XHRmZXc6ICduID0gMy4uNicsXG5cdFx0XHRcdG1hbnk6ICduID0gNy4uMTAnXG5cdFx0XHR9LFxuXHRcdFx0Z2Q6IHtcblx0XHRcdFx0b25lOiAnbiA9IDEsMTEnLFxuXHRcdFx0XHR0d286ICduID0gMiwxMicsXG5cdFx0XHRcdGZldzogJ24gPSAzLi4xMCwxMy4uMTknXG5cdFx0XHR9LFxuXHRcdFx0Z3U6IHtcblx0XHRcdFx0b25lOiAnaSA9IDAgb3IgbiA9IDEnXG5cdFx0XHR9LFxuXHRcdFx0Z3V3OiB7XG5cdFx0XHRcdG9uZTogJ24gPSAwLi4xJ1xuXHRcdFx0fSxcblx0XHRcdGd2OiB7XG5cdFx0XHRcdG9uZTogJ3YgPSAwIGFuZCBpICUgMTAgPSAxJyxcblx0XHRcdFx0dHdvOiAndiA9IDAgYW5kIGkgJSAxMCA9IDInLFxuXHRcdFx0XHRmZXc6ICd2ID0gMCBhbmQgaSAlIDEwMCA9IDAsMjAsNDAsNjAsODAnLFxuXHRcdFx0XHRtYW55OiAndiAhPSAwJ1xuXHRcdFx0fSxcblx0XHRcdGhlOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAxIGFuZCB2ID0gMCcsXG5cdFx0XHRcdHR3bzogJ2kgPSAyIGFuZCB2ID0gMCcsXG5cdFx0XHRcdG1hbnk6ICd2ID0gMCBhbmQgbiAhPSAwLi4xMCBhbmQgbiAlIDEwID0gMCdcblx0XHRcdH0sXG5cdFx0XHRoaToge1xuXHRcdFx0XHRvbmU6ICdpID0gMCBvciBuID0gMSdcblx0XHRcdH0sXG5cdFx0XHRocjoge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSAlIDEwID0gMSBhbmQgaSAlIDEwMCAhPSAxMSBvciBmICUgMTAgPSAxIGFuZCBmICUgMTAwICE9IDExJyxcblx0XHRcdFx0ZmV3OiAndiA9IDAgYW5kIGkgJSAxMCA9IDIuLjQgYW5kIGkgJSAxMDAgIT0gMTIuLjE0IG9yIGYgJSAxMCA9IDIuLjQgYW5kIGYgJSAxMDAgIT0gMTIuLjE0J1xuXHRcdFx0fSxcblx0XHRcdGhzYjoge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSAlIDEwMCA9IDEgb3IgZiAlIDEwMCA9IDEnLFxuXHRcdFx0XHR0d286ICd2ID0gMCBhbmQgaSAlIDEwMCA9IDIgb3IgZiAlIDEwMCA9IDInLFxuXHRcdFx0XHRmZXc6ICd2ID0gMCBhbmQgaSAlIDEwMCA9IDMuLjQgb3IgZiAlIDEwMCA9IDMuLjQnXG5cdFx0XHR9LFxuXHRcdFx0aHk6IHtcblx0XHRcdFx0b25lOiAnaSA9IDAsMSdcblx0XHRcdH0sXG5cdFx0XHRpczoge1xuXHRcdFx0XHRvbmU6ICd0ID0gMCBhbmQgaSAlIDEwID0gMSBhbmQgaSAlIDEwMCAhPSAxMSBvciB0ICE9IDAnXG5cdFx0XHR9LFxuXHRcdFx0aXU6IHtcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMidcblx0XHRcdH0sXG5cdFx0XHRpdzoge1xuXHRcdFx0XHRvbmU6ICdpID0gMSBhbmQgdiA9IDAnLFxuXHRcdFx0XHR0d286ICdpID0gMiBhbmQgdiA9IDAnLFxuXHRcdFx0XHRtYW55OiAndiA9IDAgYW5kIG4gIT0gMC4uMTAgYW5kIG4gJSAxMCA9IDAnXG5cdFx0XHR9LFxuXHRcdFx0a2FiOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwLDEnXG5cdFx0XHR9LFxuXHRcdFx0a246IHtcblx0XHRcdFx0b25lOiAnaSA9IDAgb3IgbiA9IDEnXG5cdFx0XHR9LFxuXHRcdFx0a3c6IHtcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMidcblx0XHRcdH0sXG5cdFx0XHRsYWc6IHtcblx0XHRcdFx0emVybzogJ24gPSAwJyxcblx0XHRcdFx0b25lOiAnaSA9IDAsMSBhbmQgbiAhPSAwJ1xuXHRcdFx0fSxcblx0XHRcdGxuOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAwLi4xJ1xuXHRcdFx0fSxcblx0XHRcdGx0OiB7XG5cdFx0XHRcdG9uZTogJ24gJSAxMCA9IDEgYW5kIG4gJSAxMDAgIT0gMTEuLjE5Jyxcblx0XHRcdFx0ZmV3OiAnbiAlIDEwID0gMi4uOSBhbmQgbiAlIDEwMCAhPSAxMS4uMTknLFxuXHRcdFx0XHRtYW55OiAnZiAhPSAwJ1xuXHRcdFx0fSxcblx0XHRcdGx2OiB7XG5cdFx0XHRcdHplcm86ICduICUgMTAgPSAwIG9yIG4gJSAxMDAgPSAxMS4uMTkgb3IgdiA9IDIgYW5kIGYgJSAxMDAgPSAxMS4uMTknLFxuXHRcdFx0XHRvbmU6ICduICUgMTAgPSAxIGFuZCBuICUgMTAwICE9IDExIG9yIHYgPSAyIGFuZCBmICUgMTAgPSAxIGFuZCBmICUgMTAwICE9IDExIG9yIHYgIT0gMiBhbmQgZiAlIDEwID0gMSdcblx0XHRcdH0sXG5cdFx0XHRtZzoge1xuXHRcdFx0XHRvbmU6ICduID0gMC4uMSdcblx0XHRcdH0sXG5cdFx0XHRtazoge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSAlIDEwID0gMSBvciBmICUgMTAgPSAxJ1xuXHRcdFx0fSxcblx0XHRcdG1vOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAxIGFuZCB2ID0gMCcsXG5cdFx0XHRcdGZldzogJ3YgIT0gMCBvciBuID0gMCBvciBuICE9IDEgYW5kIG4gJSAxMDAgPSAxLi4xOSdcblx0XHRcdH0sXG5cdFx0XHRtcjoge1xuXHRcdFx0XHRvbmU6ICdpID0gMCBvciBuID0gMSdcblx0XHRcdH0sXG5cdFx0XHRtdDoge1xuXHRcdFx0XHRvbmU6ICduID0gMScsXG5cdFx0XHRcdGZldzogJ24gPSAwIG9yIG4gJSAxMDAgPSAyLi4xMCcsXG5cdFx0XHRcdG1hbnk6ICduICUgMTAwID0gMTEuLjE5J1xuXHRcdFx0fSxcblx0XHRcdG5hcToge1xuXHRcdFx0XHRvbmU6ICduID0gMScsXG5cdFx0XHRcdHR3bzogJ24gPSAyJ1xuXHRcdFx0fSxcblx0XHRcdG5zbzoge1xuXHRcdFx0XHRvbmU6ICduID0gMC4uMSdcblx0XHRcdH0sXG5cdFx0XHRwYToge1xuXHRcdFx0XHRvbmU6ICduID0gMC4uMSdcblx0XHRcdH0sXG5cdFx0XHRwbDoge1xuXHRcdFx0XHRvbmU6ICdpID0gMSBhbmQgdiA9IDAnLFxuXHRcdFx0XHRmZXc6ICd2ID0gMCBhbmQgaSAlIDEwID0gMi4uNCBhbmQgaSAlIDEwMCAhPSAxMi4uMTQnLFxuXHRcdFx0XHRtYW55OiAndiA9IDAgYW5kIGkgIT0gMSBhbmQgaSAlIDEwID0gMC4uMSBvciB2ID0gMCBhbmQgaSAlIDEwID0gNS4uOSBvciB2ID0gMCBhbmQgaSAlIDEwMCA9IDEyLi4xNCdcblx0XHRcdH0sXG5cdFx0XHRwcmc6IHtcblx0XHRcdFx0emVybzogJ24gJSAxMCA9IDAgb3IgbiAlIDEwMCA9IDExLi4xOSBvciB2ID0gMiBhbmQgZiAlIDEwMCA9IDExLi4xOScsXG5cdFx0XHRcdG9uZTogJ24gJSAxMCA9IDEgYW5kIG4gJSAxMDAgIT0gMTEgb3IgdiA9IDIgYW5kIGYgJSAxMCA9IDEgYW5kIGYgJSAxMDAgIT0gMTEgb3IgdiAhPSAyIGFuZCBmICUgMTAgPSAxJ1xuXHRcdFx0fSxcblx0XHRcdHB0OiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwLi4xJ1xuXHRcdFx0fSxcblx0XHRcdHJvOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAxIGFuZCB2ID0gMCcsXG5cdFx0XHRcdGZldzogJ3YgIT0gMCBvciBuID0gMCBvciBuICE9IDEgYW5kIG4gJSAxMDAgPSAxLi4xOSdcblx0XHRcdH0sXG5cdFx0XHRydToge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSAlIDEwID0gMSBhbmQgaSAlIDEwMCAhPSAxMScsXG5cdFx0XHRcdGZldzogJ3YgPSAwIGFuZCBpICUgMTAgPSAyLi40IGFuZCBpICUgMTAwICE9IDEyLi4xNCcsXG5cdFx0XHRcdG1hbnk6ICd2ID0gMCBhbmQgaSAlIDEwID0gMCBvciB2ID0gMCBhbmQgaSAlIDEwID0gNS4uOSBvciB2ID0gMCBhbmQgaSAlIDEwMCA9IDExLi4xNCdcblx0XHRcdH0sXG5cdFx0XHRzZToge1xuXHRcdFx0XHRvbmU6ICduID0gMScsXG5cdFx0XHRcdHR3bzogJ24gPSAyJ1xuXHRcdFx0fSxcblx0XHRcdHNoOiB7XG5cdFx0XHRcdG9uZTogJ3YgPSAwIGFuZCBpICUgMTAgPSAxIGFuZCBpICUgMTAwICE9IDExIG9yIGYgJSAxMCA9IDEgYW5kIGYgJSAxMDAgIT0gMTEnLFxuXHRcdFx0XHRmZXc6ICd2ID0gMCBhbmQgaSAlIDEwID0gMi4uNCBhbmQgaSAlIDEwMCAhPSAxMi4uMTQgb3IgZiAlIDEwID0gMi4uNCBhbmQgZiAlIDEwMCAhPSAxMi4uMTQnXG5cdFx0XHR9LFxuXHRcdFx0c2hpOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwIG9yIG4gPSAxJyxcblx0XHRcdFx0ZmV3OiAnbiA9IDIuLjEwJ1xuXHRcdFx0fSxcblx0XHRcdHNpOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAwLDEgb3IgaSA9IDAgYW5kIGYgPSAxJ1xuXHRcdFx0fSxcblx0XHRcdHNrOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAxIGFuZCB2ID0gMCcsXG5cdFx0XHRcdGZldzogJ2kgPSAyLi40IGFuZCB2ID0gMCcsXG5cdFx0XHRcdG1hbnk6ICd2ICE9IDAnXG5cdFx0XHR9LFxuXHRcdFx0c2w6IHtcblx0XHRcdFx0b25lOiAndiA9IDAgYW5kIGkgJSAxMDAgPSAxJyxcblx0XHRcdFx0dHdvOiAndiA9IDAgYW5kIGkgJSAxMDAgPSAyJyxcblx0XHRcdFx0ZmV3OiAndiA9IDAgYW5kIGkgJSAxMDAgPSAzLi40IG9yIHYgIT0gMCdcblx0XHRcdH0sXG5cdFx0XHRzbWE6IHtcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMidcblx0XHRcdH0sXG5cdFx0XHRzbWk6IHtcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMidcblx0XHRcdH0sXG5cdFx0XHRzbWo6IHtcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMidcblx0XHRcdH0sXG5cdFx0XHRzbW46IHtcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMidcblx0XHRcdH0sXG5cdFx0XHRzbXM6IHtcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMidcblx0XHRcdH0sXG5cdFx0XHRzcjoge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSAlIDEwID0gMSBhbmQgaSAlIDEwMCAhPSAxMSBvciBmICUgMTAgPSAxIGFuZCBmICUgMTAwICE9IDExJyxcblx0XHRcdFx0ZmV3OiAndiA9IDAgYW5kIGkgJSAxMCA9IDIuLjQgYW5kIGkgJSAxMDAgIT0gMTIuLjE0IG9yIGYgJSAxMCA9IDIuLjQgYW5kIGYgJSAxMDAgIT0gMTIuLjE0J1xuXHRcdFx0fSxcblx0XHRcdHRpOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAwLi4xJ1xuXHRcdFx0fSxcblx0XHRcdHRsOiB7XG5cdFx0XHRcdG9uZTogJ3YgPSAwIGFuZCBpID0gMSwyLDMgb3IgdiA9IDAgYW5kIGkgJSAxMCAhPSA0LDYsOSBvciB2ICE9IDAgYW5kIGYgJSAxMCAhPSA0LDYsOSdcblx0XHRcdH0sXG5cdFx0XHR0em06IHtcblx0XHRcdFx0b25lOiAnbiA9IDAuLjEgb3IgbiA9IDExLi45OSdcblx0XHRcdH0sXG5cdFx0XHR1azoge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSAlIDEwID0gMSBhbmQgaSAlIDEwMCAhPSAxMScsXG5cdFx0XHRcdGZldzogJ3YgPSAwIGFuZCBpICUgMTAgPSAyLi40IGFuZCBpICUgMTAwICE9IDEyLi4xNCcsXG5cdFx0XHRcdG1hbnk6ICd2ID0gMCBhbmQgaSAlIDEwID0gMCBvciB2ID0gMCBhbmQgaSAlIDEwID0gNS4uOSBvciB2ID0gMCBhbmQgaSAlIDEwMCA9IDExLi4xNCdcblx0XHRcdH0sXG5cdFx0XHR3YToge1xuXHRcdFx0XHRvbmU6ICduID0gMC4uMSdcblx0XHRcdH0sXG5cdFx0XHR6dToge1xuXHRcdFx0XHRvbmU6ICdpID0gMCBvciBuID0gMSdcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vIGpzY3M6ZW5hYmxlXG5cblx0XHQvKipcblx0XHQgKiBQbHVyYWwgZm9ybSB0cmFuc2Zvcm1hdGlvbnMsIG5lZWRlZCBmb3Igc29tZSBsYW5ndWFnZXMuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge2ludGVnZXJ9IGNvdW50XG5cdFx0ICogICAgICAgICAgICBOb24tbG9jYWxpemVkIHF1YW50aWZpZXJcblx0XHQgKiBAcGFyYW0ge0FycmF5fSBmb3Jtc1xuXHRcdCAqICAgICAgICAgICAgTGlzdCBvZiBwbHVyYWwgZm9ybXNcblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd9IENvcnJlY3QgZm9ybSBmb3IgcXVhbnRpZmllciBpbiB0aGlzIGxhbmd1YWdlXG5cdFx0ICovXG5cdFx0Y29udmVydFBsdXJhbDogZnVuY3Rpb24gKCBjb3VudCwgZm9ybXMgKSB7XG5cdFx0XHR2YXIgcGx1cmFsUnVsZXMsXG5cdFx0XHRcdHBsdXJhbEZvcm1JbmRleCxcblx0XHRcdFx0aW5kZXgsXG5cdFx0XHRcdGV4cGxpY2l0UGx1cmFsUGF0dGVybiA9IG5ldyBSZWdFeHAoICdcXFxcZCs9JywgJ2knICksXG5cdFx0XHRcdGZvcm1Db3VudCxcblx0XHRcdFx0Zm9ybTtcblxuXHRcdFx0aWYgKCAhZm9ybXMgfHwgZm9ybXMubGVuZ3RoID09PSAwICkge1xuXHRcdFx0XHRyZXR1cm4gJyc7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEhhbmRsZSBmb3IgRXhwbGljaXQgMD0gJiAxPSB2YWx1ZXNcblx0XHRcdGZvciAoIGluZGV4ID0gMDsgaW5kZXggPCBmb3Jtcy5sZW5ndGg7IGluZGV4KysgKSB7XG5cdFx0XHRcdGZvcm0gPSBmb3Jtc1sgaW5kZXggXTtcblx0XHRcdFx0aWYgKCBleHBsaWNpdFBsdXJhbFBhdHRlcm4udGVzdCggZm9ybSApICkge1xuXHRcdFx0XHRcdGZvcm1Db3VudCA9IHBhcnNlSW50KCBmb3JtLnNsaWNlKCAwLCBmb3JtLmluZGV4T2YoICc9JyApICksIDEwICk7XG5cdFx0XHRcdFx0aWYgKCBmb3JtQ291bnQgPT09IGNvdW50ICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuICggZm9ybS5zbGljZSggZm9ybS5pbmRleE9mKCAnPScgKSArIDEgKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRmb3Jtc1sgaW5kZXggXSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRmb3JtcyA9ICQubWFwKCBmb3JtcywgZnVuY3Rpb24gKCBmb3JtICkge1xuXHRcdFx0XHRpZiAoIGZvcm0gIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0XHRyZXR1cm4gZm9ybTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXG5cdFx0XHRwbHVyYWxSdWxlcyA9IHRoaXMucGx1cmFsUnVsZXNbICQuaTE4bigpLmxvY2FsZSBdO1xuXG5cdFx0XHRpZiAoICFwbHVyYWxSdWxlcyApIHtcblx0XHRcdFx0Ly8gZGVmYXVsdCBmYWxsYmFjay5cblx0XHRcdFx0cmV0dXJuICggY291bnQgPT09IDEgKSA/IGZvcm1zWyAwIF0gOiBmb3Jtc1sgMSBdO1xuXHRcdFx0fVxuXG5cdFx0XHRwbHVyYWxGb3JtSW5kZXggPSB0aGlzLmdldFBsdXJhbEZvcm0oIGNvdW50LCBwbHVyYWxSdWxlcyApO1xuXHRcdFx0cGx1cmFsRm9ybUluZGV4ID0gTWF0aC5taW4oIHBsdXJhbEZvcm1JbmRleCwgZm9ybXMubGVuZ3RoIC0gMSApO1xuXG5cdFx0XHRyZXR1cm4gZm9ybXNbIHBsdXJhbEZvcm1JbmRleCBdO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBGb3IgdGhlIG51bWJlciwgZ2V0IHRoZSBwbHVyYWwgZm9yIGluZGV4XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge2ludGVnZXJ9IG51bWJlclxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBwbHVyYWxSdWxlc1xuXHRcdCAqIEByZXR1cm4ge2ludGVnZXJ9IHBsdXJhbCBmb3JtIGluZGV4XG5cdFx0ICovXG5cdFx0Z2V0UGx1cmFsRm9ybTogZnVuY3Rpb24gKCBudW1iZXIsIHBsdXJhbFJ1bGVzICkge1xuXHRcdFx0dmFyIGksXG5cdFx0XHRcdHBsdXJhbEZvcm1zID0gWyAnemVybycsICdvbmUnLCAndHdvJywgJ2ZldycsICdtYW55JywgJ290aGVyJyBdLFxuXHRcdFx0XHRwbHVyYWxGb3JtSW5kZXggPSAwO1xuXG5cdFx0XHRmb3IgKCBpID0gMDsgaSA8IHBsdXJhbEZvcm1zLmxlbmd0aDsgaSsrICkge1xuXHRcdFx0XHRpZiAoIHBsdXJhbFJ1bGVzWyBwbHVyYWxGb3Jtc1sgaSBdIF0gKSB7XG5cdFx0XHRcdFx0aWYgKCBwbHVyYWxSdWxlUGFyc2VyKCBwbHVyYWxSdWxlc1sgcGx1cmFsRm9ybXNbIGkgXSBdLCBudW1iZXIgKSApIHtcblx0XHRcdFx0XHRcdHJldHVybiBwbHVyYWxGb3JtSW5kZXg7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cGx1cmFsRm9ybUluZGV4Kys7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHBsdXJhbEZvcm1JbmRleDtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogQ29udmVydHMgYSBudW1iZXIgdXNpbmcgZGlnaXRUcmFuc2Zvcm1UYWJsZS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBudW0gVmFsdWUgdG8gYmUgY29udmVydGVkXG5cdFx0ICogQHBhcmFtIHtib29sZWFufSBpbnRlZ2VyIENvbnZlcnQgdGhlIHJldHVybiB2YWx1ZSB0byBhbiBpbnRlZ2VyXG5cdFx0ICogQHJldHVybiB7c3RyaW5nfSBUaGUgbnVtYmVyIGNvbnZlcnRlZCBpbnRvIGEgU3RyaW5nLlxuXHRcdCAqL1xuXHRcdGNvbnZlcnROdW1iZXI6IGZ1bmN0aW9uICggbnVtLCBpbnRlZ2VyICkge1xuXHRcdFx0dmFyIHRtcCwgaXRlbSwgaSxcblx0XHRcdFx0dHJhbnNmb3JtVGFibGUsIG51bWJlclN0cmluZywgY29udmVydGVkTnVtYmVyO1xuXG5cdFx0XHQvLyBTZXQgdGhlIHRhcmdldCBUcmFuc2Zvcm0gdGFibGU6XG5cdFx0XHR0cmFuc2Zvcm1UYWJsZSA9IHRoaXMuZGlnaXRUcmFuc2Zvcm1UYWJsZSggJC5pMThuKCkubG9jYWxlICk7XG5cdFx0XHRudW1iZXJTdHJpbmcgPSBTdHJpbmcoIG51bSApO1xuXHRcdFx0Y29udmVydGVkTnVtYmVyID0gJyc7XG5cblx0XHRcdGlmICggIXRyYW5zZm9ybVRhYmxlICkge1xuXHRcdFx0XHRyZXR1cm4gbnVtO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDaGVjayBpZiB0aGUgcmVzdG9yZSB0byBMYXRpbiBudW1iZXIgZmxhZyBpcyBzZXQ6XG5cdFx0XHRpZiAoIGludGVnZXIgKSB7XG5cdFx0XHRcdGlmICggcGFyc2VGbG9hdCggbnVtLCAxMCApID09PSBudW0gKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG51bTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRtcCA9IFtdO1xuXG5cdFx0XHRcdGZvciAoIGl0ZW0gaW4gdHJhbnNmb3JtVGFibGUgKSB7XG5cdFx0XHRcdFx0dG1wWyB0cmFuc2Zvcm1UYWJsZVsgaXRlbSBdIF0gPSBpdGVtO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dHJhbnNmb3JtVGFibGUgPSB0bXA7XG5cdFx0XHR9XG5cblx0XHRcdGZvciAoIGkgPSAwOyBpIDwgbnVtYmVyU3RyaW5nLmxlbmd0aDsgaSsrICkge1xuXHRcdFx0XHRpZiAoIHRyYW5zZm9ybVRhYmxlWyBudW1iZXJTdHJpbmdbIGkgXSBdICkge1xuXHRcdFx0XHRcdGNvbnZlcnRlZE51bWJlciArPSB0cmFuc2Zvcm1UYWJsZVsgbnVtYmVyU3RyaW5nWyBpIF0gXTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb252ZXJ0ZWROdW1iZXIgKz0gbnVtYmVyU3RyaW5nWyBpIF07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGludGVnZXIgPyBwYXJzZUZsb2F0KCBjb252ZXJ0ZWROdW1iZXIsIDEwICkgOiBjb252ZXJ0ZWROdW1iZXI7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEdyYW1tYXRpY2FsIHRyYW5zZm9ybWF0aW9ucywgbmVlZGVkIGZvciBpbmZsZWN0ZWQgbGFuZ3VhZ2VzLlxuXHRcdCAqIEludm9rZWQgYnkgcHV0dGluZyB7e2dyYW1tYXI6Zm9ybXx3b3JkfX0gaW4gYSBtZXNzYWdlLlxuXHRcdCAqIE92ZXJyaWRlIHRoaXMgbWV0aG9kIGZvciBsYW5ndWFnZXMgdGhhdCBuZWVkIHNwZWNpYWwgZ3JhbW1hciBydWxlc1xuXHRcdCAqIGFwcGxpZWQgZHluYW1pY2FsbHkuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gd29yZFxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtXG5cdFx0ICogQHJldHVybiB7c3RyaW5nfVxuXHRcdCAqL1xuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuXHRcdGNvbnZlcnRHcmFtbWFyOiBmdW5jdGlvbiAoIHdvcmQsIGZvcm0gKSB7XG5cdFx0XHRyZXR1cm4gd29yZDtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogUHJvdmlkZXMgYW4gYWx0ZXJuYXRpdmUgdGV4dCBkZXBlbmRpbmcgb24gc3BlY2lmaWVkIGdlbmRlci4gVXNhZ2Vcblx0XHQgKiB7e2dlbmRlcjpbZ2VuZGVyfHVzZXIgb2JqZWN0XXxtYXNjdWxpbmV8ZmVtaW5pbmV8bmV1dHJhbH19LiBJZiBzZWNvbmRcblx0XHQgKiBvciB0aGlyZCBwYXJhbWV0ZXIgYXJlIG5vdCBzcGVjaWZpZWQsIG1hc2N1bGluZSBpcyB1c2VkLlxuXHRcdCAqXG5cdFx0ICogVGhlc2UgZGV0YWlscyBtYXkgYmUgb3ZlcnJpZGVuIHBlciBsYW5ndWFnZS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBnZW5kZXJcblx0XHQgKiAgICAgIG1hbGUsIGZlbWFsZSwgb3IgYW55dGhpbmcgZWxzZSBmb3IgbmV1dHJhbC5cblx0XHQgKiBAcGFyYW0ge0FycmF5fSBmb3Jtc1xuXHRcdCAqICAgICAgTGlzdCBvZiBnZW5kZXIgZm9ybXNcblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge3N0cmluZ31cblx0XHQgKi9cblx0XHRnZW5kZXI6IGZ1bmN0aW9uICggZ2VuZGVyLCBmb3JtcyApIHtcblx0XHRcdGlmICggIWZvcm1zIHx8IGZvcm1zLmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdFx0cmV0dXJuICcnO1xuXHRcdFx0fVxuXG5cdFx0XHR3aGlsZSAoIGZvcm1zLmxlbmd0aCA8IDIgKSB7XG5cdFx0XHRcdGZvcm1zLnB1c2goIGZvcm1zWyBmb3Jtcy5sZW5ndGggLSAxIF0gKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBnZW5kZXIgPT09ICdtYWxlJyApIHtcblx0XHRcdFx0cmV0dXJuIGZvcm1zWyAwIF07XG5cdFx0XHR9XG5cblx0XHRcdGlmICggZ2VuZGVyID09PSAnZmVtYWxlJyApIHtcblx0XHRcdFx0cmV0dXJuIGZvcm1zWyAxIF07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAoIGZvcm1zLmxlbmd0aCA9PT0gMyApID8gZm9ybXNbIDIgXSA6IGZvcm1zWyAwIF07XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEdldCB0aGUgZGlnaXQgdHJhbnNmb3JtIHRhYmxlIGZvciB0aGUgZ2l2ZW4gbGFuZ3VhZ2Vcblx0XHQgKiBTZWUgaHR0cDovL2NsZHIudW5pY29kZS5vcmcvdHJhbnNsYXRpb24vbnVtYmVyaW5nLXN5c3RlbXNcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBsYW5ndWFnZVxuXHRcdCAqIEByZXR1cm4ge0FycmF5fGJvb2xlYW59IExpc3Qgb2YgZGlnaXRzIGluIHRoZSBwYXNzZWQgbGFuZ3VhZ2Ugb3IgZmFsc2Vcblx0XHQgKiByZXByZXNlbnRhdGlvbiwgb3IgYm9vbGVhbiBmYWxzZSBpZiB0aGVyZSBpcyBubyBpbmZvcm1hdGlvbi5cblx0XHQgKi9cblx0XHRkaWdpdFRyYW5zZm9ybVRhYmxlOiBmdW5jdGlvbiAoIGxhbmd1YWdlICkge1xuXHRcdFx0dmFyIHRhYmxlcyA9IHtcblx0XHRcdFx0YXI6ICfZoNmh2aLZo9mk2aXZptmn2ajZqScsXG5cdFx0XHRcdGZhOiAn27Dbsduy27PbtNu127bbt9u427knLFxuXHRcdFx0XHRtbDogJ+C1puC1p+C1qOC1qeC1quC1q+C1rOC1reC1ruC1rycsXG5cdFx0XHRcdGtuOiAn4LOm4LOn4LOo4LOp4LOq4LOr4LOs4LOt4LOu4LOvJyxcblx0XHRcdFx0bG86ICfgu5Dgu5Hgu5Lgu5Pgu5Tgu5Xgu5bgu5fgu5jgu5knLFxuXHRcdFx0XHRvcjogJ+CtpuCtp+CtqOCtqeCtquCtq+CtrOCtreCtruCtrycsXG5cdFx0XHRcdGtoOiAn4Z+g4Z+h4Z+i4Z+j4Z+k4Z+l4Z+m4Z+n4Z+o4Z+pJyxcblx0XHRcdFx0cGE6ICfgqabgqafgqajgqangqargqavgqazgqa3gqa7gqa8nLFxuXHRcdFx0XHRndTogJ+CrpuCrp+CrqOCrqeCrquCrq+CrrOCrreCrruCrrycsXG5cdFx0XHRcdGhpOiAn4KWm4KWn4KWo4KWp4KWq4KWr4KWs4KWt4KWu4KWvJyxcblx0XHRcdFx0bXk6ICfhgYDhgYHhgYLhgYPhgYThgYXhgYbhgYfhgYjhgYknLFxuXHRcdFx0XHR0YTogJ+CvpuCvp+CvqOCvqeCvquCvq+CvrOCvreCvruCvrycsXG5cdFx0XHRcdHRlOiAn4LGm4LGn4LGo4LGp4LGq4LGr4LGs4LGt4LGu4LGvJyxcblx0XHRcdFx0dGg6ICfguZDguZHguZLguZPguZTguZXguZbguZfguZjguZknLCAvLyBGSVhNRSB1c2UgaXNvIDYzOSBjb2Rlc1xuXHRcdFx0XHRibzogJ+C8oOC8oeC8ouC8o+C8pOC8peC8puC8p+C8qOC8qScgLy8gRklYTUUgdXNlIGlzbyA2MzkgY29kZXNcblx0XHRcdH07XG5cblx0XHRcdGlmICggIXRhYmxlc1sgbGFuZ3VhZ2UgXSApIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGFibGVzWyBsYW5ndWFnZSBdLnNwbGl0KCAnJyApO1xuXHRcdH1cblx0fTtcblxuXHQkLmV4dGVuZCggJC5pMThuLmxhbmd1YWdlcywge1xuXHRcdCdkZWZhdWx0JzogbGFuZ3VhZ2Vcblx0fSApO1xufSggalF1ZXJ5ICkgKTtcbiIsIi8qIVxuICogalF1ZXJ5IEludGVybmF0aW9uYWxpemF0aW9uIGxpYnJhcnkgLSBNZXNzYWdlIFN0b3JlXG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDEyIFNhbnRob3NoIFRob3R0aW5nYWxcbiAqXG4gKiBqcXVlcnkuaTE4biBpcyBkdWFsIGxpY2Vuc2VkIEdQTHYyIG9yIGxhdGVyIGFuZCBNSVQuIFlvdSBkb24ndCBoYXZlIHRvIGRvIGFueXRoaW5nIHNwZWNpYWwgdG9cbiAqIGNob29zZSBvbmUgbGljZW5zZSBvciB0aGUgb3RoZXIgYW5kIHlvdSBkb24ndCBoYXZlIHRvIG5vdGlmeSBhbnlvbmUgd2hpY2ggbGljZW5zZSB5b3UgYXJlIHVzaW5nLlxuICogWW91IGFyZSBmcmVlIHRvIHVzZSBVbml2ZXJzYWxMYW5ndWFnZVNlbGVjdG9yIGluIGNvbW1lcmNpYWwgcHJvamVjdHMgYXMgbG9uZyBhcyB0aGUgY29weXJpZ2h0XG4gKiBoZWFkZXIgaXMgbGVmdCBpbnRhY3QuIFNlZSBmaWxlcyBHUEwtTElDRU5TRSBhbmQgTUlULUxJQ0VOU0UgZm9yIGRldGFpbHMuXG4gKlxuICogQGxpY2VuY2UgR05VIEdlbmVyYWwgUHVibGljIExpY2VuY2UgMi4wIG9yIGxhdGVyXG4gKiBAbGljZW5jZSBNSVQgTGljZW5zZVxuICovXG5cbiggZnVuY3Rpb24gKCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIE1lc3NhZ2VTdG9yZSA9IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLm1lc3NhZ2VzID0ge307XG5cdFx0dGhpcy5zb3VyY2VzID0ge307XG5cdH07XG5cblx0ZnVuY3Rpb24ganNvbk1lc3NhZ2VMb2FkZXIoIHVybCApIHtcblx0XHR2YXIgZGVmZXJyZWQgPSAkLkRlZmVycmVkKCk7XG5cblx0XHQkLmdldEpTT04oIHVybCApXG5cdFx0XHQuZG9uZSggZGVmZXJyZWQucmVzb2x2ZSApXG5cdFx0XHQuZmFpbCggZnVuY3Rpb24gKCBqcXhociwgc2V0dGluZ3MsIGV4Y2VwdGlvbiApIHtcblx0XHRcdFx0JC5pMThuLmxvZyggJ0Vycm9yIGluIGxvYWRpbmcgbWVzc2FnZXMgZnJvbSAnICsgdXJsICsgJyBFeGNlcHRpb246ICcgKyBleGNlcHRpb24gKTtcblx0XHRcdFx0Ly8gSWdub3JlIDQwNCBleGNlcHRpb24sIGJlY2F1c2Ugd2UgYXJlIGhhbmRsaW5nIGZhbGxhYmFja3MgZXhwbGljaXRseVxuXHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKCk7XG5cdFx0XHR9ICk7XG5cblx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vd2lraW1lZGlhL2pxdWVyeS5pMThuL3dpa2kvU3BlY2lmaWNhdGlvbiN3aWtpLU1lc3NhZ2VfRmlsZV9Mb2FkaW5nXG5cdCAqL1xuXHRNZXNzYWdlU3RvcmUucHJvdG90eXBlID0ge1xuXG5cdFx0LyoqXG5cdFx0ICogR2VuZXJhbCBtZXNzYWdlIGxvYWRpbmcgQVBJIFRoaXMgY2FuIHRha2UgYSBVUkwgc3RyaW5nIGZvclxuXHRcdCAqIHRoZSBqc29uIGZvcm1hdHRlZCBtZXNzYWdlcy5cblx0XHQgKiA8Y29kZT5sb2FkKCdwYXRoL3RvL2FsbF9sb2NhbGl6YXRpb25zLmpzb24nKTs8L2NvZGU+XG5cdFx0ICpcblx0XHQgKiBUaGlzIGNhbiBhbHNvIGxvYWQgYSBsb2NhbGl6YXRpb24gZmlsZSBmb3IgYSBsb2NhbGUgPGNvZGU+XG5cdFx0ICogbG9hZCggJ3BhdGgvdG8vZGUtbWVzc2FnZXMuanNvbicsICdkZScgKTtcblx0XHQgKiA8L2NvZGU+XG5cdFx0ICogQSBkYXRhIG9iamVjdCBjb250YWluaW5nIG1lc3NhZ2Uga2V5LSBtZXNzYWdlIHRyYW5zbGF0aW9uIG1hcHBpbmdzXG5cdFx0ICogY2FuIGFsc28gYmUgcGFzc2VkIEVnOlxuXHRcdCAqIDxjb2RlPlxuXHRcdCAqIGxvYWQoIHsgJ2hlbGxvJyA6ICdIZWxsbycgfSwgb3B0aW9uYWxMb2NhbGUgKTtcblx0XHQgKiA8L2NvZGU+IElmIHRoZSBkYXRhIGFyZ3VtZW50IGlzXG5cdFx0ICogbnVsbC91bmRlZmluZWQvZmFsc2UsXG5cdFx0ICogYWxsIGNhY2hlZCBtZXNzYWdlcyBmb3IgdGhlIGkxOG4gaW5zdGFuY2Ugd2lsbCBnZXQgcmVzZXQuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ3xPYmplY3R9IHNvdXJjZVxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhbGUgTGFuZ3VhZ2UgdGFnXG5cdFx0ICogQHJldHVybiB7alF1ZXJ5LlByb21pc2V9XG5cdFx0ICovXG5cdFx0bG9hZDogZnVuY3Rpb24gKCBzb3VyY2UsIGxvY2FsZSApIHtcblx0XHRcdHZhciBrZXkgPSBudWxsLFxuXHRcdFx0XHRkZWZlcnJlZCA9IG51bGwsXG5cdFx0XHRcdGRlZmVycmVkcyA9IFtdLFxuXHRcdFx0XHRtZXNzYWdlU3RvcmUgPSB0aGlzO1xuXG5cdFx0XHRpZiAoIHR5cGVvZiBzb3VyY2UgPT09ICdzdHJpbmcnICkge1xuXHRcdFx0XHQvLyBUaGlzIGlzIGEgVVJMIHRvIHRoZSBtZXNzYWdlcyBmaWxlLlxuXHRcdFx0XHQkLmkxOG4ubG9nKCAnTG9hZGluZyBtZXNzYWdlcyBmcm9tOiAnICsgc291cmNlICk7XG5cdFx0XHRcdGRlZmVycmVkID0ganNvbk1lc3NhZ2VMb2FkZXIoIHNvdXJjZSApXG5cdFx0XHRcdFx0LmRvbmUoIGZ1bmN0aW9uICggbG9jYWxpemF0aW9uICkge1xuXHRcdFx0XHRcdFx0bWVzc2FnZVN0b3JlLnNldCggbG9jYWxlLCBsb2NhbGl6YXRpb24gKTtcblx0XHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2UoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBsb2NhbGUgKSB7XG5cdFx0XHRcdC8vIHNvdXJjZSBpcyBhbiBrZXktdmFsdWUgcGFpciBvZiBtZXNzYWdlcyBmb3IgZ2l2ZW4gbG9jYWxlXG5cdFx0XHRcdG1lc3NhZ2VTdG9yZS5zZXQoIGxvY2FsZSwgc291cmNlICk7XG5cblx0XHRcdFx0cmV0dXJuICQuRGVmZXJyZWQoKS5yZXNvbHZlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBzb3VyY2UgaXMgYSBrZXktdmFsdWUgcGFpciBvZiBsb2NhbGVzIGFuZCB0aGVpciBzb3VyY2Vcblx0XHRcdFx0Zm9yICgga2V5IGluIHNvdXJjZSApIHtcblx0XHRcdFx0XHRpZiAoIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCggc291cmNlLCBrZXkgKSApIHtcblx0XHRcdFx0XHRcdGxvY2FsZSA9IGtleTtcblx0XHRcdFx0XHRcdC8vIE5vIHtsb2NhbGV9IGdpdmVuLCBhc3N1bWUgZGF0YSBpcyBhIGdyb3VwIG9mIGxhbmd1YWdlcyxcblx0XHRcdFx0XHRcdC8vIGNhbGwgdGhpcyBmdW5jdGlvbiBhZ2FpbiBmb3IgZWFjaCBsYW5ndWFnZS5cblx0XHRcdFx0XHRcdGRlZmVycmVkcy5wdXNoKCBtZXNzYWdlU3RvcmUubG9hZCggc291cmNlWyBrZXkgXSwgbG9jYWxlICkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuICQud2hlbi5hcHBseSggJCwgZGVmZXJyZWRzICk7XG5cdFx0XHR9XG5cblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogU2V0IG1lc3NhZ2VzIHRvIHRoZSBnaXZlbiBsb2NhbGUuXG5cdFx0ICogSWYgbG9jYWxlIGV4aXN0cywgYWRkIG1lc3NhZ2VzIHRvIHRoZSBsb2NhbGUuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gbG9jYWxlXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IG1lc3NhZ2VzXG5cdFx0ICovXG5cdFx0c2V0OiBmdW5jdGlvbiAoIGxvY2FsZSwgbWVzc2FnZXMgKSB7XG5cdFx0XHRpZiAoICF0aGlzLm1lc3NhZ2VzWyBsb2NhbGUgXSApIHtcblx0XHRcdFx0dGhpcy5tZXNzYWdlc1sgbG9jYWxlIF0gPSBtZXNzYWdlcztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMubWVzc2FnZXNbIGxvY2FsZSBdID0gJC5leHRlbmQoIHRoaXMubWVzc2FnZXNbIGxvY2FsZSBdLCBtZXNzYWdlcyApO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhbGVcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZUtleVxuXHRcdCAqIEByZXR1cm4ge2Jvb2xlYW59XG5cdFx0ICovXG5cdFx0Z2V0OiBmdW5jdGlvbiAoIGxvY2FsZSwgbWVzc2FnZUtleSApIHtcblx0XHRcdHJldHVybiB0aGlzLm1lc3NhZ2VzWyBsb2NhbGUgXSAmJiB0aGlzLm1lc3NhZ2VzWyBsb2NhbGUgXVsgbWVzc2FnZUtleSBdO1xuXHRcdH1cblx0fTtcblxuXHQkLmV4dGVuZCggJC5pMThuLm1lc3NhZ2VTdG9yZSwgbmV3IE1lc3NhZ2VTdG9yZSgpICk7XG59KCBqUXVlcnkgKSApO1xuIiwiLyohXG4gKiBqUXVlcnkgSW50ZXJuYXRpb25hbGl6YXRpb24gbGlicmFyeVxuICpcbiAqIENvcHlyaWdodCAoQykgMjAxMS0yMDEzIFNhbnRob3NoIFRob3R0aW5nYWwsIE5laWwgS2FuZGFsZ2FvbmthclxuICpcbiAqIGpxdWVyeS5pMThuIGlzIGR1YWwgbGljZW5zZWQgR1BMdjIgb3IgbGF0ZXIgYW5kIE1JVC4gWW91IGRvbid0IGhhdmUgdG8gZG9cbiAqIGFueXRoaW5nIHNwZWNpYWwgdG8gY2hvb3NlIG9uZSBsaWNlbnNlIG9yIHRoZSBvdGhlciBhbmQgeW91IGRvbid0IGhhdmUgdG9cbiAqIG5vdGlmeSBhbnlvbmUgd2hpY2ggbGljZW5zZSB5b3UgYXJlIHVzaW5nLiBZb3UgYXJlIGZyZWUgdG8gdXNlXG4gKiBVbml2ZXJzYWxMYW5ndWFnZVNlbGVjdG9yIGluIGNvbW1lcmNpYWwgcHJvamVjdHMgYXMgbG9uZyBhcyB0aGUgY29weXJpZ2h0XG4gKiBoZWFkZXIgaXMgbGVmdCBpbnRhY3QuIFNlZSBmaWxlcyBHUEwtTElDRU5TRSBhbmQgTUlULUxJQ0VOU0UgZm9yIGRldGFpbHMuXG4gKlxuICogQGxpY2VuY2UgR05VIEdlbmVyYWwgUHVibGljIExpY2VuY2UgMi4wIG9yIGxhdGVyXG4gKiBAbGljZW5jZSBNSVQgTGljZW5zZVxuICovXG5cbiggZnVuY3Rpb24gKCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIE1lc3NhZ2VQYXJzZXIgPSBmdW5jdGlvbiAoIG9wdGlvbnMgKSB7XG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoIHt9LCAkLmkxOG4ucGFyc2VyLmRlZmF1bHRzLCBvcHRpb25zICk7XG5cdFx0dGhpcy5sYW5ndWFnZSA9ICQuaTE4bi5sYW5ndWFnZXNbIFN0cmluZy5sb2NhbGUgXSB8fCAkLmkxOG4ubGFuZ3VhZ2VzWyAnZGVmYXVsdCcgXTtcblx0XHR0aGlzLmVtaXR0ZXIgPSAkLmkxOG4ucGFyc2VyLmVtaXR0ZXI7XG5cdH07XG5cblx0TWVzc2FnZVBhcnNlci5wcm90b3R5cGUgPSB7XG5cblx0XHRjb25zdHJ1Y3RvcjogTWVzc2FnZVBhcnNlcixcblxuXHRcdHNpbXBsZVBhcnNlOiBmdW5jdGlvbiAoIG1lc3NhZ2UsIHBhcmFtZXRlcnMgKSB7XG5cdFx0XHRyZXR1cm4gbWVzc2FnZS5yZXBsYWNlKCAvXFwkKFxcZCspL2csIGZ1bmN0aW9uICggc3RyLCBtYXRjaCApIHtcblx0XHRcdFx0dmFyIGluZGV4ID0gcGFyc2VJbnQoIG1hdGNoLCAxMCApIC0gMTtcblxuXHRcdFx0XHRyZXR1cm4gcGFyYW1ldGVyc1sgaW5kZXggXSAhPT0gdW5kZWZpbmVkID8gcGFyYW1ldGVyc1sgaW5kZXggXSA6ICckJyArIG1hdGNoO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cblx0XHRwYXJzZTogZnVuY3Rpb24gKCBtZXNzYWdlLCByZXBsYWNlbWVudHMgKSB7XG5cdFx0XHRpZiAoIG1lc3NhZ2UuaW5kZXhPZiggJ3t7JyApIDwgMCApIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuc2ltcGxlUGFyc2UoIG1lc3NhZ2UsIHJlcGxhY2VtZW50cyApO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmVtaXR0ZXIubGFuZ3VhZ2UgPSAkLmkxOG4ubGFuZ3VhZ2VzWyAkLmkxOG4oKS5sb2NhbGUgXSB8fFxuXHRcdFx0XHQkLmkxOG4ubGFuZ3VhZ2VzWyAnZGVmYXVsdCcgXTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuZW1pdHRlci5lbWl0KCB0aGlzLmFzdCggbWVzc2FnZSApLCByZXBsYWNlbWVudHMgKTtcblx0XHR9LFxuXG5cdFx0YXN0OiBmdW5jdGlvbiAoIG1lc3NhZ2UgKSB7XG5cdFx0XHR2YXIgcGlwZSwgY29sb24sIGJhY2tzbGFzaCwgYW55Q2hhcmFjdGVyLCBkb2xsYXIsIGRpZ2l0cywgcmVndWxhckxpdGVyYWwsXG5cdFx0XHRcdHJlZ3VsYXJMaXRlcmFsV2l0aG91dEJhciwgcmVndWxhckxpdGVyYWxXaXRob3V0U3BhY2UsIGVzY2FwZWRPckxpdGVyYWxXaXRob3V0QmFyLFxuXHRcdFx0XHRlc2NhcGVkT3JSZWd1bGFyTGl0ZXJhbCwgdGVtcGxhdGVDb250ZW50cywgdGVtcGxhdGVOYW1lLCBvcGVuVGVtcGxhdGUsXG5cdFx0XHRcdGNsb3NlVGVtcGxhdGUsIGV4cHJlc3Npb24sIHBhcmFtRXhwcmVzc2lvbiwgcmVzdWx0LFxuXHRcdFx0XHRwb3MgPSAwO1xuXG5cdFx0XHQvLyBUcnkgcGFyc2VycyB1bnRpbCBvbmUgd29ya3MsIGlmIG5vbmUgd29yayByZXR1cm4gbnVsbFxuXHRcdFx0ZnVuY3Rpb24gY2hvaWNlKCBwYXJzZXJTeW50YXggKSB7XG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dmFyIGksIHJlc3VsdDtcblxuXHRcdFx0XHRcdGZvciAoIGkgPSAwOyBpIDwgcGFyc2VyU3ludGF4Lmxlbmd0aDsgaSsrICkge1xuXHRcdFx0XHRcdFx0cmVzdWx0ID0gcGFyc2VyU3ludGF4WyBpIF0oKTtcblxuXHRcdFx0XHRcdFx0aWYgKCByZXN1bHQgIT09IG51bGwgKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRyeSBzZXZlcmFsIHBhcnNlclN5bnRheC1lcyBpbiBhIHJvdy5cblx0XHRcdC8vIEFsbCBtdXN0IHN1Y2NlZWQ7IG90aGVyd2lzZSwgcmV0dXJuIG51bGwuXG5cdFx0XHQvLyBUaGlzIGlzIHRoZSBvbmx5IGVhZ2VyIG9uZS5cblx0XHRcdGZ1bmN0aW9uIHNlcXVlbmNlKCBwYXJzZXJTeW50YXggKSB7XG5cdFx0XHRcdHZhciBpLCByZXMsXG5cdFx0XHRcdFx0b3JpZ2luYWxQb3MgPSBwb3MsXG5cdFx0XHRcdFx0cmVzdWx0ID0gW107XG5cblx0XHRcdFx0Zm9yICggaSA9IDA7IGkgPCBwYXJzZXJTeW50YXgubGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdFx0cmVzID0gcGFyc2VyU3ludGF4WyBpIF0oKTtcblxuXHRcdFx0XHRcdGlmICggcmVzID09PSBudWxsICkge1xuXHRcdFx0XHRcdFx0cG9zID0gb3JpZ2luYWxQb3M7XG5cblx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJlc3VsdC5wdXNoKCByZXMgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJ1biB0aGUgc2FtZSBwYXJzZXIgb3ZlciBhbmQgb3ZlciB1bnRpbCBpdCBmYWlscy5cblx0XHRcdC8vIE11c3Qgc3VjY2VlZCBhIG1pbmltdW0gb2YgbiB0aW1lczsgb3RoZXJ3aXNlLCByZXR1cm4gbnVsbC5cblx0XHRcdGZ1bmN0aW9uIG5Pck1vcmUoIG4sIHAgKSB7XG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dmFyIG9yaWdpbmFsUG9zID0gcG9zLFxuXHRcdFx0XHRcdFx0cmVzdWx0ID0gW10sXG5cdFx0XHRcdFx0XHRwYXJzZWQgPSBwKCk7XG5cblx0XHRcdFx0XHR3aGlsZSAoIHBhcnNlZCAhPT0gbnVsbCApIHtcblx0XHRcdFx0XHRcdHJlc3VsdC5wdXNoKCBwYXJzZWQgKTtcblx0XHRcdFx0XHRcdHBhcnNlZCA9IHAoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIHJlc3VsdC5sZW5ndGggPCBuICkge1xuXHRcdFx0XHRcdFx0cG9zID0gb3JpZ2luYWxQb3M7XG5cblx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdC8vIEhlbHBlcnMgLS0ganVzdCBtYWtlIHBhcnNlclN5bnRheCBvdXQgb2Ygc2ltcGxlciBKUyBidWlsdGluIHR5cGVzXG5cblx0XHRcdGZ1bmN0aW9uIG1ha2VTdHJpbmdQYXJzZXIoIHMgKSB7XG5cdFx0XHRcdHZhciBsZW4gPSBzLmxlbmd0aDtcblxuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZhciByZXN1bHQgPSBudWxsO1xuXG5cdFx0XHRcdFx0aWYgKCBtZXNzYWdlLnNsaWNlKCBwb3MsIHBvcyArIGxlbiApID09PSBzICkge1xuXHRcdFx0XHRcdFx0cmVzdWx0ID0gcztcblx0XHRcdFx0XHRcdHBvcyArPSBsZW47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gbWFrZVJlZ2V4UGFyc2VyKCByZWdleCApIHtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgbWF0Y2hlcyA9IG1lc3NhZ2Uuc2xpY2UoIHBvcyApLm1hdGNoKCByZWdleCApO1xuXG5cdFx0XHRcdFx0aWYgKCBtYXRjaGVzID09PSBudWxsICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cG9zICs9IG1hdGNoZXNbIDAgXS5sZW5ndGg7XG5cblx0XHRcdFx0XHRyZXR1cm4gbWF0Y2hlc1sgMCBdO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHRwaXBlID0gbWFrZVN0cmluZ1BhcnNlciggJ3wnICk7XG5cdFx0XHRjb2xvbiA9IG1ha2VTdHJpbmdQYXJzZXIoICc6JyApO1xuXHRcdFx0YmFja3NsYXNoID0gbWFrZVN0cmluZ1BhcnNlciggJ1xcXFwnICk7XG5cdFx0XHRhbnlDaGFyYWN0ZXIgPSBtYWtlUmVnZXhQYXJzZXIoIC9eLi8gKTtcblx0XHRcdGRvbGxhciA9IG1ha2VTdHJpbmdQYXJzZXIoICckJyApO1xuXHRcdFx0ZGlnaXRzID0gbWFrZVJlZ2V4UGFyc2VyKCAvXlxcZCsvICk7XG5cdFx0XHRyZWd1bGFyTGl0ZXJhbCA9IG1ha2VSZWdleFBhcnNlciggL15bXnt9W1xcXSRcXFxcXS8gKTtcblx0XHRcdHJlZ3VsYXJMaXRlcmFsV2l0aG91dEJhciA9IG1ha2VSZWdleFBhcnNlciggL15bXnt9W1xcXSRcXFxcfF0vICk7XG5cdFx0XHRyZWd1bGFyTGl0ZXJhbFdpdGhvdXRTcGFjZSA9IG1ha2VSZWdleFBhcnNlciggL15bXnt9W1xcXSRcXHNdLyApO1xuXG5cdFx0XHQvLyBUaGVyZSBpcyBhIGdlbmVyYWwgcGF0dGVybjpcblx0XHRcdC8vIHBhcnNlIGEgdGhpbmc7XG5cdFx0XHQvLyBpZiBpdCB3b3JrZWQsIGFwcGx5IHRyYW5zZm9ybSxcblx0XHRcdC8vIG90aGVyd2lzZSByZXR1cm4gbnVsbC5cblx0XHRcdC8vIEJ1dCB1c2luZyB0aGlzIGFzIGEgY29tYmluYXRvciBzZWVtcyB0byBjYXVzZSBwcm9ibGVtc1xuXHRcdFx0Ly8gd2hlbiBjb21iaW5lZCB3aXRoIG5Pck1vcmUoKS5cblx0XHRcdC8vIE1heSBiZSBzb21lIHNjb3BpbmcgaXNzdWUuXG5cdFx0XHRmdW5jdGlvbiB0cmFuc2Zvcm0oIHAsIGZuICkge1xuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZhciByZXN1bHQgPSBwKCk7XG5cblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0ID09PSBudWxsID8gbnVsbCA6IGZuKCByZXN1bHQgKTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVXNlZCB0byBkZWZpbmUgXCJsaXRlcmFsc1wiIHdpdGhpbiB0ZW1wbGF0ZSBwYXJhbWV0ZXJzLiBUaGUgcGlwZVxuXHRcdFx0Ly8gY2hhcmFjdGVyIGlzIHRoZSBwYXJhbWV0ZXIgZGVsaW1ldGVyLCBzbyBieSBkZWZhdWx0XG5cdFx0XHQvLyBpdCBpcyBub3QgYSBsaXRlcmFsIGluIHRoZSBwYXJhbWV0ZXJcblx0XHRcdGZ1bmN0aW9uIGxpdGVyYWxXaXRob3V0QmFyKCkge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gbk9yTW9yZSggMSwgZXNjYXBlZE9yTGl0ZXJhbFdpdGhvdXRCYXIgKSgpO1xuXG5cdFx0XHRcdHJldHVybiByZXN1bHQgPT09IG51bGwgPyBudWxsIDogcmVzdWx0LmpvaW4oICcnICk7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIGxpdGVyYWwoKSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBuT3JNb3JlKCAxLCBlc2NhcGVkT3JSZWd1bGFyTGl0ZXJhbCApKCk7XG5cblx0XHRcdFx0cmV0dXJuIHJlc3VsdCA9PT0gbnVsbCA/IG51bGwgOiByZXN1bHQuam9pbiggJycgKTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gZXNjYXBlZExpdGVyYWwoKSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBzZXF1ZW5jZSggWyBiYWNrc2xhc2gsIGFueUNoYXJhY3RlciBdICk7XG5cblx0XHRcdFx0cmV0dXJuIHJlc3VsdCA9PT0gbnVsbCA/IG51bGwgOiByZXN1bHRbIDEgXTtcblx0XHRcdH1cblxuXHRcdFx0Y2hvaWNlKCBbIGVzY2FwZWRMaXRlcmFsLCByZWd1bGFyTGl0ZXJhbFdpdGhvdXRTcGFjZSBdICk7XG5cdFx0XHRlc2NhcGVkT3JMaXRlcmFsV2l0aG91dEJhciA9IGNob2ljZSggWyBlc2NhcGVkTGl0ZXJhbCwgcmVndWxhckxpdGVyYWxXaXRob3V0QmFyIF0gKTtcblx0XHRcdGVzY2FwZWRPclJlZ3VsYXJMaXRlcmFsID0gY2hvaWNlKCBbIGVzY2FwZWRMaXRlcmFsLCByZWd1bGFyTGl0ZXJhbCBdICk7XG5cblx0XHRcdGZ1bmN0aW9uIHJlcGxhY2VtZW50KCkge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gc2VxdWVuY2UoIFsgZG9sbGFyLCBkaWdpdHMgXSApO1xuXG5cdFx0XHRcdGlmICggcmVzdWx0ID09PSBudWxsICkge1xuXHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIFsgJ1JFUExBQ0UnLCBwYXJzZUludCggcmVzdWx0WyAxIF0sIDEwICkgLSAxIF07XG5cdFx0XHR9XG5cblx0XHRcdHRlbXBsYXRlTmFtZSA9IHRyYW5zZm9ybShcblx0XHRcdFx0Ly8gc2VlICR3Z0xlZ2FsVGl0bGVDaGFyc1xuXHRcdFx0XHQvLyBub3QgYWxsb3dpbmcgOiBkdWUgdG8gdGhlIG5lZWQgdG8gY2F0Y2ggXCJQTFVSQUw6JDFcIlxuXHRcdFx0XHRtYWtlUmVnZXhQYXJzZXIoIC9eWyAhXCIkJicoKSosLi8wLTk7PT9AQS1aXl9gYS16flxceDgwLVxceEZGKy1dKy8gKSxcblxuXHRcdFx0XHRmdW5jdGlvbiAoIHJlc3VsdCApIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0LnRvU3RyaW5nKCk7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHRcdGZ1bmN0aW9uIHRlbXBsYXRlUGFyYW0oKSB7XG5cdFx0XHRcdHZhciBleHByLFxuXHRcdFx0XHRcdHJlc3VsdCA9IHNlcXVlbmNlKCBbIHBpcGUsIG5Pck1vcmUoIDAsIHBhcmFtRXhwcmVzc2lvbiApIF0gKTtcblxuXHRcdFx0XHRpZiAoIHJlc3VsdCA9PT0gbnVsbCApIHtcblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGV4cHIgPSByZXN1bHRbIDEgXTtcblxuXHRcdFx0XHQvLyB1c2UgYSBcIkNPTkNBVFwiIG9wZXJhdG9yIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBub2Rlcyxcblx0XHRcdFx0Ly8gb3RoZXJ3aXNlIHJldHVybiB0aGUgZmlyc3Qgbm9kZSwgcmF3LlxuXHRcdFx0XHRyZXR1cm4gZXhwci5sZW5ndGggPiAxID8gWyAnQ09OQ0FUJyBdLmNvbmNhdCggZXhwciApIDogZXhwclsgMCBdO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiB0ZW1wbGF0ZVdpdGhSZXBsYWNlbWVudCgpIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHNlcXVlbmNlKCBbIHRlbXBsYXRlTmFtZSwgY29sb24sIHJlcGxhY2VtZW50IF0gKTtcblxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0ID09PSBudWxsID8gbnVsbCA6IFsgcmVzdWx0WyAwIF0sIHJlc3VsdFsgMiBdIF07XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIHRlbXBsYXRlV2l0aE91dFJlcGxhY2VtZW50KCkge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gc2VxdWVuY2UoIFsgdGVtcGxhdGVOYW1lLCBjb2xvbiwgcGFyYW1FeHByZXNzaW9uIF0gKTtcblxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0ID09PSBudWxsID8gbnVsbCA6IFsgcmVzdWx0WyAwIF0sIHJlc3VsdFsgMiBdIF07XG5cdFx0XHR9XG5cblx0XHRcdHRlbXBsYXRlQ29udGVudHMgPSBjaG9pY2UoIFtcblx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZhciByZXMgPSBzZXF1ZW5jZSggW1xuXHRcdFx0XHRcdFx0Ly8gdGVtcGxhdGVzIGNhbiBoYXZlIHBsYWNlaG9sZGVycyBmb3IgZHluYW1pY1xuXHRcdFx0XHRcdFx0Ly8gcmVwbGFjZW1lbnQgZWc6IHt7UExVUkFMOiQxfG9uZSBjYXJ8JDEgY2Fyc319XG5cdFx0XHRcdFx0XHQvLyBvciBubyBwbGFjZWhvbGRlcnMgZWc6XG5cdFx0XHRcdFx0XHQvLyB7e0dSQU1NQVI6Z2VuaXRpdmV8e3tTSVRFTkFNRX19fVxuXHRcdFx0XHRcdFx0Y2hvaWNlKCBbIHRlbXBsYXRlV2l0aFJlcGxhY2VtZW50LCB0ZW1wbGF0ZVdpdGhPdXRSZXBsYWNlbWVudCBdICksXG5cdFx0XHRcdFx0XHRuT3JNb3JlKCAwLCB0ZW1wbGF0ZVBhcmFtIClcblx0XHRcdFx0XHRdICk7XG5cblx0XHRcdFx0XHRyZXR1cm4gcmVzID09PSBudWxsID8gbnVsbCA6IHJlc1sgMCBdLmNvbmNhdCggcmVzWyAxIF0gKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZhciByZXMgPSBzZXF1ZW5jZSggWyB0ZW1wbGF0ZU5hbWUsIG5Pck1vcmUoIDAsIHRlbXBsYXRlUGFyYW0gKSBdICk7XG5cblx0XHRcdFx0XHRpZiAoIHJlcyA9PT0gbnVsbCApIHtcblx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBbIHJlc1sgMCBdIF0uY29uY2F0KCByZXNbIDEgXSApO1xuXHRcdFx0XHR9XG5cdFx0XHRdICk7XG5cblx0XHRcdG9wZW5UZW1wbGF0ZSA9IG1ha2VTdHJpbmdQYXJzZXIoICd7eycgKTtcblx0XHRcdGNsb3NlVGVtcGxhdGUgPSBtYWtlU3RyaW5nUGFyc2VyKCAnfX0nICk7XG5cblx0XHRcdGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gc2VxdWVuY2UoIFsgb3BlblRlbXBsYXRlLCB0ZW1wbGF0ZUNvbnRlbnRzLCBjbG9zZVRlbXBsYXRlIF0gKTtcblxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0ID09PSBudWxsID8gbnVsbCA6IHJlc3VsdFsgMSBdO1xuXHRcdFx0fVxuXG5cdFx0XHRleHByZXNzaW9uID0gY2hvaWNlKCBbIHRlbXBsYXRlLCByZXBsYWNlbWVudCwgbGl0ZXJhbCBdICk7XG5cdFx0XHRwYXJhbUV4cHJlc3Npb24gPSBjaG9pY2UoIFsgdGVtcGxhdGUsIHJlcGxhY2VtZW50LCBsaXRlcmFsV2l0aG91dEJhciBdICk7XG5cblx0XHRcdGZ1bmN0aW9uIHN0YXJ0KCkge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gbk9yTW9yZSggMCwgZXhwcmVzc2lvbiApKCk7XG5cblx0XHRcdFx0aWYgKCByZXN1bHQgPT09IG51bGwgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gWyAnQ09OQ0FUJyBdLmNvbmNhdCggcmVzdWx0ICk7XG5cdFx0XHR9XG5cblx0XHRcdHJlc3VsdCA9IHN0YXJ0KCk7XG5cblx0XHRcdC8qXG5cdFx0XHQgKiBGb3Igc3VjY2VzcywgdGhlIHBvcyBtdXN0IGhhdmUgZ290dGVuIHRvIHRoZSBlbmQgb2YgdGhlIGlucHV0XG5cdFx0XHQgKiBhbmQgcmV0dXJuZWQgYSBub24tbnVsbC5cblx0XHRcdCAqIG4uYi4gVGhpcyBpcyBwYXJ0IG9mIGxhbmd1YWdlIGluZnJhc3RydWN0dXJlLCBzbyB3ZSBkbyBub3QgdGhyb3cgYW5cblx0XHRcdCAqIGludGVybmF0aW9uYWxpemFibGUgbWVzc2FnZS5cblx0XHRcdCAqL1xuXHRcdFx0aWYgKCByZXN1bHQgPT09IG51bGwgfHwgcG9zICE9PSBtZXNzYWdlLmxlbmd0aCApIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCAnUGFyc2UgZXJyb3IgYXQgcG9zaXRpb24gJyArIHBvcy50b1N0cmluZygpICsgJyBpbiBpbnB1dDogJyArIG1lc3NhZ2UgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cblx0fTtcblxuXHQkLmV4dGVuZCggJC5pMThuLnBhcnNlciwgbmV3IE1lc3NhZ2VQYXJzZXIoKSApO1xufSggalF1ZXJ5ICkgKTsiLCJ2YXIgY29kZUV4ZXJjaXNlcztcbnZhciBwcmVzZW50ZXJDc3NMaW5rO1xudmFyIHByZXNlbnRNb2RlSW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuZnVuY3Rpb24gcHJlc2VudFRvZ2dsZSgpIHtcbiAgICBpZiAoIXByZXNlbnRNb2RlSW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgcHJlc2VudE1vZGVTZXR1cCgpO1xuICAgICAgICBwcmVzZW50TW9kZUluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9XG4gICAgbGV0IGJvZCA9ICQoXCJib2R5XCIpO1xuICAgIGxldCBwcmVzZW50Q2xhc3MgPSBcInByZXNlbnRcIjtcbiAgICBsZXQgZnVsbEhlaWdodENsYXNzID0gXCJmdWxsLWhlaWdodFwiO1xuICAgIGxldCBib3R0b21DbGFzcyA9IFwiYm90dG9tXCI7XG4gICAgaWYgKGJvZC5oYXNDbGFzcyhwcmVzZW50Q2xhc3MpKSB7XG4gICAgICAgICQoXCIuc2VjdGlvbiAqXCIpXG4gICAgICAgICAgICAubm90KFxuICAgICAgICAgICAgICAgIFwiaDEsIC5wcmVzZW50YXRpb24tdGl0bGUsIC5idG4tcHJlc2VudGVyLCAucnVuZXN0b25lLCAucnVuZXN0b25lICosIC5zZWN0aW9uLCAucHJlLCBjb2RlXCJcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhcImhpZGRlblwiKTsgLy9zaG93IGV2ZXJ5dGhpbmdcbiAgICAgICAgJChcIiNjb21wbGV0aW9uQnV0dG9uXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpO1xuICAgICAgICBib2QucmVtb3ZlQ2xhc3MocHJlc2VudENsYXNzKTtcbiAgICAgICAgJChcIi5cIiArIGZ1bGxIZWlnaHRDbGFzcykucmVtb3ZlQ2xhc3MoZnVsbEhlaWdodENsYXNzKTtcbiAgICAgICAgJChcIi5cIiArIGJvdHRvbUNsYXNzKS5yZW1vdmVDbGFzcyhib3R0b21DbGFzcyk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicHJlc2VudE1vZGVcIiwgXCJ0ZXh0XCIpO1xuICAgICAgICBjb2RlRXhlcmNpc2VzLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpO1xuICAgICAgICBwcmVzZW50ZXJDc3NMaW5rLmRpc2FibGVkID0gdHJ1ZTsgLy8gZGlzYWJsZSBwcmVzZW50X21vZGUuY3NzXG4gICAgfSBlbHNlIHtcbiAgICAgICAgJChcIi5zZWN0aW9uICpcIilcbiAgICAgICAgICAgIC5ub3QoXG4gICAgICAgICAgICAgICAgXCJoMSwgLnByZXNlbnRhdGlvbi10aXRsZSwgLmJ0bi1wcmVzZW50ZXIsIC5ydW5lc3RvbmUsIC5ydW5lc3RvbmUgKiwgLnNlY3Rpb24sIC5wcmUsIGNvZGVcIlxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZENsYXNzKFwiaGlkZGVuXCIpOyAvLyBoaWRlIGV4dHJhbmVvdXMgc3R1ZmZcbiAgICAgICAgJChcIiNjb21wbGV0aW9uQnV0dG9uXCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpO1xuICAgICAgICBib2QuYWRkQ2xhc3MocHJlc2VudENsYXNzKTtcbiAgICAgICAgYm9kLmFkZENsYXNzKGZ1bGxIZWlnaHRDbGFzcyk7XG4gICAgICAgICQoXCJodG1sXCIpLmFkZENsYXNzKGZ1bGxIZWlnaHRDbGFzcyk7XG4gICAgICAgICQoXCIuc2VjdGlvbiAucnVuZXN0b25lXCIpLmFkZENsYXNzKGZ1bGxIZWlnaHRDbGFzcyk7XG4gICAgICAgICQoXCIuYWMtY2FwdGlvblwiKS5hZGRDbGFzcyhib3R0b21DbGFzcyk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicHJlc2VudE1vZGVcIiwgcHJlc2VudENsYXNzKTtcbiAgICAgICAgbG9hZFByZXNlbnRlckNzcygpOyAvLyBwcmVzZW50X21vZGUuY3NzIHNob3VsZCBvbmx5IGFwcGx5IHdoZW4gaW4gcHJlc2VudGVyIG1vZGUuXG4gICAgICAgIGFjdGl2YXRlRXhlcmNpc2UoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxvYWRQcmVzZW50ZXJDc3MoKSB7XG4gICAgcHJlc2VudGVyQ3NzTGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xuICAgIHByZXNlbnRlckNzc0xpbmsudHlwZSA9IFwidGV4dC9jc3NcIjtcbiAgICBwcmVzZW50ZXJDc3NMaW5rLmhyZWYgPSBcIi4uL19zdGF0aWMvcHJlc2VudGVyX21vZGUuY3NzXCI7XG4gICAgcHJlc2VudGVyQ3NzTGluay5yZWwgPSBcInN0eWxlc2hlZXRcIjtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQocHJlc2VudGVyQ3NzTGluayk7XG59XG5cbmZ1bmN0aW9uIHByZXNlbnRNb2RlU2V0dXAoKSB7XG4gICAgLy8gbW92ZWQgdGhpcyBvdXQgb2YgY29uZmlndXJlXG4gICAgbGV0IGRhdGFDb21wb25lbnQgPSAkKFwiW2RhdGEtY2hpbGRjb21wb25lbnRdXCIpO1xuXG4gICAgLy8gdGhpcyBzdGlsbCBsZWF2ZXMgc29tZSB0aGluZ3Mgc2VtaS1tZXNzZWQgdXAgd2hlbiB5b3UgZXhpdCBwcmVzZW50ZXIgbW9kZS5cbiAgICAvLyBidXQgaW5zdHJ1Y3RvcnMgd2lsbCBwcm9iYWJseSBqdXN0IGxlYXJuIHRvIHJlZnJlc2ggdGhlIHBhZ2UuXG4gICAgZGF0YUNvbXBvbmVudC5hZGRDbGFzcyhcInJ1bmVzdG9uZVwiKTtcbiAgICBkYXRhQ29tcG9uZW50LnBhcmVudCgpLmNsb3Nlc3QoXCJkaXZcIikubm90KFwiLnNlY3Rpb25cIikuYWRkQ2xhc3MoXCJydW5lc3RvbmVcIik7XG4gICAgZGF0YUNvbXBvbmVudC5wYXJlbnQoKS5jbG9zZXN0KFwiZGl2XCIpLmNzcyhcIm1heC13aWR0aFwiLCBcIm5vbmVcIik7XG5cbiAgICBkYXRhQ29tcG9uZW50LmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIGxldCBtZSA9ICQodGhpcyk7XG4gICAgICAgICQodGhpcylcbiAgICAgICAgICAgIC5maW5kKFwiLmFjX2NvZGVfZGl2LCAuYWNfb3V0cHV0XCIpXG4gICAgICAgICAgICAud3JhcEFsbChcIjxkaXYgY2xhc3M9J2FjLWJsb2NrJyBzdHlsZT0nd2lkdGg6IDEwMCU7Jz48L2Rpdj5cIik7XG4gICAgfSk7XG5cbiAgICBjb2RlbGVuc0xpc3RlbmVyKDUwMCk7XG4gICAgJChcIi5zZWN0aW9uIGltZ1wiKS53cmFwKCc8ZGl2IGNsYXNzPVwicnVuZXN0b25lXCI+Jyk7XG4gICAgY29kZUV4ZXJjaXNlcyA9ICQoXCIucnVuZXN0b25lXCIpLm5vdChcIi5ydW5lc3RvbmUgLnJ1bmVzdG9uZVwiKTtcbiAgICAvLyBjb2RlRXhlcmNpc2VzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAkKFwiaDFcIikuYmVmb3JlKFxuICAgICAgICBcIjxkaXYgY2xhc3M9J3ByZXNlbnRhdGlvbi10aXRsZSc+IFxcXG4gICAgICAgIDxidXR0b24gY2xhc3M9J3ByZXYtZXhlcmNpc2UgYnRuLXByZXNlbnRlciBidG4tZ3JleS1vdXRsaW5lJyBvbmNsaWNrPSdwcmV2RXhlcmNpc2UoKSc+QmFjazwvYnV0dG9uPiBcXFxuICAgICAgICA8YnV0dG9uIGNsYXNzPSduZXh0LWV4ZXJjaXNlIGJ0bi1wcmVzZW50ZXIgYnRuLWdyZXktc29saWQnIG9uY2xpY2s9J25leHRFeGVyY2lzZSgpJz5OZXh0PC9idXR0b24+IFxcXG4gICAgICA8L2Rpdj5cIlxuICAgICk7XG59XG5mdW5jdGlvbiBnZXRBY3RpdmVFeGVyY2lzZSgpIHtcbiAgICByZXR1cm4gKGFjdGl2ZSA9IGNvZGVFeGVyY2lzZXMuZmlsdGVyKFwiLmFjdGl2ZVwiKSk7XG59XG5cbmZ1bmN0aW9uIGFjdGl2YXRlRXhlcmNpc2UoaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIGluZGV4ID09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaW5kZXggPSAwO1xuICAgIH1cblxuICAgIGxldCBhY3RpdmUgPSBnZXRBY3RpdmVFeGVyY2lzZSgpO1xuXG4gICAgaWYgKGNvZGVFeGVyY2lzZXMubGVuZ3RoKSB7XG4gICAgICAgIGFjdGl2ZS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgYWN0aXZlID0gJChjb2RlRXhlcmNpc2VzW2luZGV4XSkuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgIGFjdGl2ZS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKTtcbiAgICAgICAgY29kZUV4ZXJjaXNlcy5ub3QoY29kZUV4ZXJjaXNlcy5maWx0ZXIoXCIuYWN0aXZlXCIpKS5hZGRDbGFzcyhcImhpZGRlblwiKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG5leHRFeGVyY2lzZSgpIHtcbiAgICBsZXQgYWN0aXZlID0gZ2V0QWN0aXZlRXhlcmNpc2UoKTtcbiAgICBsZXQgbmV4dEluZGV4ID0gY29kZUV4ZXJjaXNlcy5pbmRleChhY3RpdmUpICsgMTtcbiAgICBpZiAobmV4dEluZGV4IDwgY29kZUV4ZXJjaXNlcy5sZW5ndGgpIHtcbiAgICAgICAgYWN0aXZhdGVFeGVyY2lzZShuZXh0SW5kZXgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcHJldkV4ZXJjaXNlKCkge1xuICAgIGxldCBhY3RpdmUgPSBnZXRBY3RpdmVFeGVyY2lzZSgpO1xuICAgIGxldCBwcmV2SW5kZXggPSBjb2RlRXhlcmNpc2VzLmluZGV4KGFjdGl2ZSkgLSAxO1xuICAgIGlmIChwcmV2SW5kZXggPj0gMCkge1xuICAgICAgICBhY3RpdmF0ZUV4ZXJjaXNlKHByZXZJbmRleCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjb25maWd1cmUoKSB7XG4gICAgbGV0IHJpZ2h0TmF2ID0gJChcIi5uYXZiYXItcmlnaHRcIik7XG4gICAgcmlnaHROYXYucHJlcGVuZChcbiAgICAgICAgXCI8bGkgY2xhc3M9J2Ryb3Bkb3duIHZpZXctdG9nZ2xlJz4gXFxcbiAgICAgIDxsYWJlbD5WaWV3OiBcXFxuICAgICAgICA8c2VsZWN0IGNsYXNzPSdtb2RlLXNlbGVjdCc+IFxcXG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT0ndGV4dCc+VGV4dGJvb2s8L29wdGlvbj4gXFxcbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPSdwcmVzZW50Jz5Db2RlIFByZXNlbnRlcjwvb3B0aW9uPiBcXFxuICAgICAgICA8L3NlbGVjdD4gXFxcbiAgICAgIDwvbGFiZWw+IFxcXG4gICAgPC9saT5cIlxuICAgICk7XG5cbiAgICBsZXQgbW9kZVNlbGVjdCA9ICQoXCIubW9kZS1zZWxlY3RcIikuY2hhbmdlKHByZXNlbnRUb2dnbGUpO1xufVxuXG5mdW5jdGlvbiBjb2RlbGVuc0xpc3RlbmVyKGR1cmF0aW9uKSB7XG4gICAgLy8gJChcIi5FeGVjdXRpb25WaXN1YWxpemVyXCIpLmxlbmd0aCA/IGNvbmZpZ3VyZUNvZGVsZW5zKCkgOiBzZXRUaW1lb3V0KGNvZGVsZW5zTGlzdGVuZXIsIGR1cmF0aW9uKTtcbiAgICAvLyBjb25maWd1cmVDb2RlbGVucygpO1xufVxuXG5mdW5jdGlvbiBjb25maWd1cmVDb2RlbGVucygpIHtcbiAgICBsZXQgYWNDb2RlVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDRcIik7XG4gICAgYWNDb2RlVGl0bGUudGV4dENvbnRlbnQgPSBcIkFjdGl2ZSBDb2RlIFdpbmRvd1wiO1xuICAgIGxldCBhY0NvZGUgPSAkKFwiLmFjX2NvZGVfZGl2XCIpLnJlbW92ZUNsYXNzKFwiY29sLW1kLTEyXCIpO1xuICAgICQoXCIuYWNfY29kZV9kaXZcIikuYWRkQ2xhc3MoXCJjb2wtbWQtNlwiKTtcbiAgICBhY0NvZGUucHJlcGVuZChhY0NvZGVUaXRsZSk7XG5cbiAgICBhY091dFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg0XCIpO1xuICAgIGFjT3V0VGl0bGUudGV4dENvbnRlbnQgPSBcIk91dHB1dCBXaW5kb3dcIjtcbiAgICBsZXQgYWNPdXQgPSAkKFwiLmFjX291dHB1dFwiKS5hZGRDbGFzcyhcImNvbC1tZC02XCIpO1xuICAgICQoXCIuYWNfb3V0cHV0XCIpLnByZXBlbmQoYWNPdXRUaXRsZSk7XG5cbiAgICBsZXQgc2tldGNocGFkVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDRcIik7XG4gICAgc2tldGNocGFkVGl0bGUudGV4dENvbnRlbnQgPSBcIlNrZXRjaHBhZFwiO1xuICAgIGxldCBza2V0Y2hwYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAkKHNrZXRjaHBhZCkuYWRkQ2xhc3MoXCJza2V0Y2hwYWRcIik7XG4gICAgbGV0IHNrZXRjaHBhZENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgJChza2V0Y2hwYWRDb250YWluZXIpLmFkZENsYXNzKFwic2tldGNocGFkLWNvbnRhaW5lclwiKTtcbiAgICBza2V0Y2hwYWRDb250YWluZXIuYXBwZW5kQ2hpbGQoc2tldGNocGFkVGl0bGUpO1xuICAgIHNrZXRjaHBhZENvbnRhaW5lci5hcHBlbmRDaGlsZChza2V0Y2hwYWQpO1xuICAgIC8vJCgnLmFjX291dHB1dCcpLmFwcGVuZChza2V0Y2hwYWRDb250YWluZXIpO1xuXG4gICAgbGV0IHZpc3VhbGl6ZXJzID0gJChcIi5FeGVjdXRpb25WaXN1YWxpemVyXCIpO1xuXG4gICAgY29uc29sZS5sb2coXCJFY29udGFpbmVyOiBcIiwgdGhpcy5lQ29udGFpbmVyKTtcblxuICAgICQoXCJbZGF0YS1jaGlsZGNvbXBvbmVudF1cIikub24oXCJjbGlja1wiLCBcImJ1dHRvbi5yb3ctbW9kZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykuY2xvc2VzdChcIltkYXRhLWNoaWxkY29tcG9uZW50XVwiKS5yZW1vdmVDbGFzcyhcImNhcmQtbW9kZVwiKTtcbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KFwiW2RhdGEtY2hpbGRjb21wb25lbnRdXCIpLmFkZENsYXNzKFwicm93LW1vZGVcIik7XG4gICAgICAgICQodGhpcykubmV4dChcIi5jYXJkLW1vZGVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmUtbGF5b3V0XCIpO1xuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlLWxheW91dFwiKTtcbiAgICB9KTtcblxuICAgICQoXCJbZGF0YS1jaGlsZGNvbXBvbmVudF1cIikub24oXCJjbGlja1wiLCBcImJ1dHRvbi5jYXJkLW1vZGVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoXCJbZGF0YS1jaGlsZGNvbXBvbmVudF1cIikucmVtb3ZlQ2xhc3MoXCJyb3ctbW9kZVwiKTtcbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KFwiW2RhdGEtY2hpbGRjb21wb25lbnRdXCIpLmFkZENsYXNzKFwiY2FyZC1tb2RlXCIpO1xuICAgICAgICAkKHRoaXMpLnByZXYoXCIucm93LW1vZGVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmUtbGF5b3V0XCIpO1xuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlLWxheW91dFwiKTtcbiAgICB9KTtcblxuICAgICQoXCJbZGF0YS1jaGlsZGNvbXBvbmVudF0gLmFjX3NlY3Rpb25cIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykucHJlcGVuZChcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicHJlc2VudGF0aW9uLW9wdGlvbnNcIj48YnV0dG9uIGNsYXNzPVwicm93LW1vZGUgbGF5b3V0LWJ0blwiPjxpbWcgc3JjPVwiLi4vX2ltYWdlcy9yb3ctYnRuLWNvbnRlbnQucG5nXCIgYWx0PVwiUm93c1wiPjwvYnV0dG9uPjxidXR0b24gY2xhc3M9XCJjYXJkLW1vZGUgbGF5b3V0LWJ0blwiPjxpbWcgc3JjPVwiLi4vX2ltYWdlcy9jYXJkLWJ0bi1jb250ZW50LnBuZ1wiIGFsdD1cIkNhcmRcIj48L2J1dHRvbj48L2Rpdj4nXG4gICAgICAgICk7XG4gICAgfSk7XG5cbiAgICB2aXN1YWxpemVycy5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICBsZXQgbWUgPSAkKHRoaXMpO1xuICAgICAgICBsZXQgY29sMSA9IG1lLmZpbmQoXCIjdml6TGF5b3V0VGRGaXJzdFwiKTtcbiAgICAgICAgbGV0IGNvbDIgPSBtZS5maW5kKFwiI3ZpekxheW91dFRkU2Vjb25kXCIpO1xuICAgICAgICBsZXQgZGF0YVZpcyA9IG1lLmZpbmQoXCIjZGF0YVZpelwiKTtcbiAgICAgICAgbGV0IHN0YWNrSGVhcFRhYmxlID0gbWUuZmluZChcIiNzdGFja0hlYXBUYWJsZVwiKTtcbiAgICAgICAgbGV0IG91dHB1dCA9IG1lLmZpbmQoXCIjcHJvZ091dHB1dHNcIik7XG4gICAgICAgIG91dHB1dC5jc3MoXCJkaXNwbGF5XCIsIFwiYmxvY2tcIik7XG4gICAgICAgIG1lLnBhcmVudCgpLnByZXBlbmQoXG4gICAgICAgICAgICBcIjxkaXYgY2xhc3M9J3ByZXNlbnRhdGlvbi10aXRsZSc+PGRpdiBjbGFzcz0ndGl0bGUtdGV4dCc+IEV4YW1wbGUgXCIgK1xuICAgICAgICAgICAgICAgIChOdW1iZXIoaW5kZXgpICsgMSkgK1xuICAgICAgICAgICAgICAgIFwiPC9kaXY+PC9kaXY+XCJcbiAgICAgICAgKTtcbiAgICB9KTtcblxuICAgIGFjQ29kZS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHNlY3Rpb24gPSAkKHRoaXMpLmNsb3Nlc3QoXCIuYWMtYmxvY2tcIikucGFyZW50KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHNlY3Rpb24sIHNlY3Rpb24ubGVuZ3RoKTtcbiAgICAgICAgc2VjdGlvbi5hcHBlbmQoc2tldGNocGFkQ29udGFpbmVyKTtcbiAgICB9KTtcblxuICAgICQoXCJidXR0b24uY2FyZC1tb2RlXCIpLmNsaWNrKCk7XG5cbiAgICBsZXQgbW9kZVNlbGVjdCA9ICQoXCIubW9kZS1zZWxlY3RcIik7XG4gICAgbGV0IG1vZGUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInByZXNlbnRNb2RlXCIpO1xuICAgIGlmIChtb2RlID09IFwicHJlc2VudFwiKSB7XG4gICAgICAgIG1vZGVTZWxlY3QudmFsKFwicHJlc2VudFwiKTtcbiAgICAgICAgbW9kZVNlbGVjdC5jaGFuZ2UoKTtcbiAgICB9XG59XG5cbiQoZG9jdW1lbnQpLmJpbmQoXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuICAgIC8vIGlmIHVzZXIgaXMgaW5zdHJ1Y3RvciwgZW5hYmxlIHByZXNlbnRlciBtb2RlXG4gICAgaWYgKGVCb29rQ29uZmlnLmlzSW5zdHJ1Y3Rvcikge1xuICAgICAgICBjb25maWd1cmUoKTtcbiAgICB9XG59KTtcbiIsIi8qXG4gICAgU3VwcG9ydCBmdW5jdGlvbnMgZm9yIFByZVRlWHQgYm9va3MgcnVubmluZyBvbiBSdW5lc3RvbmVcblxuKi9cblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4vcnVuZXN0b25lYmFzZS5qc1wiO1xuXG5mdW5jdGlvbiBzZXR1cFBUWEV2ZW50cygpIHtcbiAgICBsZXQgcmIgPSBuZXcgUnVuZXN0b25lQmFzZSgpO1xuICAgIC8vIGxvZyBhbiBldmVudCB3aGVuIGEga25vd2wgaXMgb3BlbmVkLlxuICAgICQoXCJbZGF0YS1rbm93bFwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IGRpdl9pZCA9ICQodGhpcykuZGF0YShcInJlZmlkXCIpO1xuICAgICAgICByYi5sb2dCb29rRXZlbnQoeyBldmVudDogXCJrbm93bFwiLCBhY3Q6IFwiY2xpY2tcIiwgZGl2X2lkOiBkaXZfaWQgfSk7XG4gICAgfSk7XG4gICAgLy8gbG9nIGFuIGV2ZW50IHdoZW4gYSBzYWdlIGNlbGwgaXMgZXZhbHVhdGVkXG4gICAgJChcIi5zYWdlY2VsbF9ldmFsQnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBmaW5kIHBhcmVudHNcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9ICQodGhpcykuY2xvc2VzdChcIi5zYWdlY2VsbC1zYWdlXCIpO1xuICAgICAgICBsZXQgY29kZSA9ICQoY29udGFpbmVyWzBdKS5maW5kKFwiLnNhZ2VjZWxsX2lucHV0XCIpWzBdLnRleHRDb250ZW50O1xuICAgICAgICByYi5sb2dCb29rRXZlbnQoeyBldmVudDogXCJzYWdlXCIsIGFjdDogXCJydW5cIiwgZGl2X2lkOiBjb250YWluZXJbMF0uaWQgfSk7XG4gICAgfSk7XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coXCJzZXR0aW5nIHVwIHByZXRleHRcIik7XG4gICAgc2V0dXBQVFhFdmVudHMoKTtcbn0pO1xuIiwiLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIHxkb2NuYW1lfCAtIFJ1bmVzdG9uZSBCYXNlIENsYXNzXG4gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogQWxsIHJ1bmVzdG9uZSBjb21wb25lbnRzIHNob3VsZCBpbmhlcml0IGZyb20gUnVuZXN0b25lQmFzZS4gSW4gYWRkaXRpb24gYWxsIHJ1bmVzdG9uZSBjb21wb25lbnRzIHNob3VsZCBkbyB0aGUgZm9sbG93aW5nIHRoaW5nczpcbiAqXG4gKiAxLiAgIEVuc3VyZSB0aGF0IHRoZXkgYXJlIHdyYXBwZWQgaW4gYSBkaXYgd2l0aCB0aGUgY2xhc3MgcnVuZXN0b25lXG4gKiAyLiAgIFdyaXRlIHRoZWlyIHNvdXJjZSBBTkQgdGhlaXIgZ2VuZXJhdGVkIGh0bWwgdG8gdGhlIGRhdGFiYXNlIGlmIHRoZSBkYXRhYmFzZSBpcyBjb25maWd1cmVkXG4gKiAzLiAgIFByb3Blcmx5IHNhdmUgYW5kIHJlc3RvcmUgdGhlaXIgYW5zd2VycyB1c2luZyB0aGUgY2hlY2tTZXJ2ZXIgbWVjaGFuaXNtIGluIHRoaXMgYmFzZSBjbGFzcy4gRWFjaCBjb21wb25lbnQgbXVzdCBwcm92aWRlIGFuIGltcGxlbWVudGF0aW9uIG9mOlxuICpcbiAqICAgICAgLSAgICBjaGVja0xvY2FsU3RvcmFnZVxuICogICAgICAtICAgIHNldExvY2FsU3RvcmFnZVxuICogICAgICAtICAgIHJlc3RvcmVBbnN3ZXJzXG4gKiAgICAgIC0gICAgZGlzYWJsZUludGVyYWN0aW9uXG4gKlxuICogNC4gICBwcm92aWRlIGEgU2VsZW5pdW0gYmFzZWQgdW5pdCB0ZXN0XG4gKi9cblxuaW1wb3J0IHsgcGFnZVByb2dyZXNzVHJhY2tlciB9IGZyb20gXCIuL2Jvb2tmdW5jcy5qc1wiO1xuLy9pbXBvcnQgXCIuLy4uL3N0eWxlcy9ydW5lc3RvbmUtY3VzdG9tLXNwaGlueC1ib290c3RyYXAuY3NzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnRfcmVhZHlfcHJvbWlzZSA9IG5ldyBQcm9taXNlKFxuICAgICAgICAgICAgKHJlc29sdmUpID0+ICh0aGlzLl9jb21wb25lbnRfcmVhZHlfcmVzb2x2ZV9mbiA9IHJlc29sdmUpXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMub3B0aW9uYWwgPSBmYWxzZTtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cuYWxsQ29tcG9uZW50cyA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgd2luZG93LmFsbENvbXBvbmVudHMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cuYWxsQ29tcG9uZW50cy5wdXNoKHRoaXMpO1xuICAgICAgICBpZiAob3B0cykge1xuICAgICAgICAgICAgdGhpcy5zaWQgPSBvcHRzLnNpZDtcbiAgICAgICAgICAgIHRoaXMuZ3JhZGVyYWN0aXZlID0gb3B0cy5ncmFkZXJhY3RpdmU7XG4gICAgICAgICAgICB0aGlzLnNob3dmZWVkYmFjayA9IHRydWU7XG4gICAgICAgICAgICBpZiAob3B0cy50aW1lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNUaW1lZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0cy5lbmZvcmNlRGVhZGxpbmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWRsaW5lID0gb3B0cy5kZWFkbGluZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkKG9wdHMub3JpZykuZGF0YShcIm9wdGlvbmFsXCIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25hbCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9uYWwgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRzLnNlbGVjdG9yX2lkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rvcl9pZCA9IG9wdHMuc2VsZWN0b3JfaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdHMuYXNzZXNzbWVudFRha2VuICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hc3Nlc3NtZW50VGFrZW4gPSBvcHRzLmFzc2Vzc21lbnRUYWtlbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZGVmYXVsdCB0byB0cnVlIGFzIHRoaXMgb3B0IGlzIG9ubHkgcHJvdmlkZWQgZnJvbSBhIHRpbWVkQXNzZXNzbWVudFxuICAgICAgICAgICAgICAgIHRoaXMuYXNzZXNzbWVudFRha2VuID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFRoaXMgaXMgZm9yIHRoZSBzZWxlY3RxdWVzdGlvbiBwb2ludHNcbiAgICAgICAgICAgIC8vIElmIGEgc2VsZWN0cXVlc3Rpb24gaXMgcGFydCBvZiBhIHRpbWVkIGV4YW0gaXQgd2lsbCBnZXRcbiAgICAgICAgICAgIC8vIHRoZSB0aW1lZFdyYXBwZXIgb3B0aW9ucy5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0cy50aW1lZFdyYXBwZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVkV3JhcHBlciA9IG9wdHMudGltZWRXcmFwcGVyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBIb3dldmVyIHNvbWV0aW1lcyBzZWxlY3RxdWVzdGlvbnNcbiAgICAgICAgICAgICAgICAvLyBhcmUgdXNlZCBpbiByZWd1bGFyIGFzc2lnbm1lbnRzLiAgVGhlIGhhY2t5IHdheSB0byBkZXRlY3QgdGhpc1xuICAgICAgICAgICAgICAgIC8vIGlzIHRvIGxvb2sgZm9yIGRvQXNzaWdubWVudCBpbiB0aGUgVVJMIGFuZCB0aGVuIGdyYWJcbiAgICAgICAgICAgICAgICAvLyB0aGUgYXNzaWdubWVudCBuYW1lIGZyb20gdGhlIGhlYWRpbmcuXG4gICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5kZXhPZihcImRvQXNzaWdubWVudFwiKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZWRXcmFwcGVyID0gJChcImgxI2Fzc2lnbm1lbnRfbmFtZVwiKS50ZXh0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lZFdyYXBwZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkKG9wdHMub3JpZykuZGF0YShcInF1ZXN0aW9uX2xhYmVsXCIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvbl9sYWJlbCA9ICQob3B0cy5vcmlnKS5kYXRhKFwicXVlc3Rpb25fbGFiZWxcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmlzX3RvZ2dsZSA9IHRydWUgPyBvcHRzLmlzX3RvZ2dsZSA6IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5pc19zZWxlY3QgPSB0cnVlID8gb3B0cy5pc19zZWxlY3QgOiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmpzb25IZWFkZXJzID0gbmV3IEhlYWRlcnMoe1xuICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIsXG4gICAgICAgICAgICBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBfYGxvZ0Jvb2tFdmVudGBcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHNlbmRzIHRoZSBwcm92aWRlZCBgYGV2ZW50SW5mb2BgIHRvIHRoZSBgaHNibG9nIGVuZHBvaW50YCBvZiB0aGUgc2VydmVyLiBBd2FpdGluZyB0aGlzIGZ1bmN0aW9uIHJldHVybnMgZWl0aGVyIGBgdW5kZWZpbmVkYGAgKGlmIFJ1bmVzdG9uZSBzZXJ2aWNlcyBhcmUgbm90IGF2YWlsYWJsZSkgb3IgdGhlIGRhdGEgcmV0dXJuZWQgYnkgdGhlIHNlcnZlciBhcyBhIEphdmFTY3JpcHQgb2JqZWN0IChhbHJlYWR5IEpTT04tZGVjb2RlZCkuXG4gICAgYXN5bmMgbG9nQm9va0V2ZW50KGV2ZW50SW5mbykge1xuICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcG9zdF9yZXR1cm47XG4gICAgICAgIGV2ZW50SW5mby5jb3Vyc2VfbmFtZSA9IGVCb29rQ29uZmlnLmNvdXJzZTtcbiAgICAgICAgZXZlbnRJbmZvLmNsaWVudExvZ2luU3RhdHVzID0gZUJvb2tDb25maWcuaXNMb2dnZWRJbjtcbiAgICAgICAgZXZlbnRJbmZvLnRpbWV6b25lb2Zmc2V0ID0gbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjA7XG4gICAgICAgIGlmICh0aGlzLnBlcmNlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50SW5mby5wZXJjZW50ID0gdGhpcy5wZXJjZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmIChlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyAmJiBlQm9va0NvbmZpZy5sb2dMZXZlbCA+IDApIHtcbiAgICAgICAgICAgIHBvc3RfcmV0dXJuID0gdGhpcy5wb3N0TG9nTWVzc2FnZShldmVudEluZm8pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5pc1RpbWVkIHx8IGVCb29rQ29uZmlnLmRlYnVnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvZ2dpbmcgZXZlbnQgXCIgKyBKU09OLnN0cmluZ2lmeShldmVudEluZm8pKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBXaGVuIHNlbGVjdHF1ZXN0aW9ucyBhcmUgcGFydCBvZiBhbiBhc3NpZ25tZW50IGVzcGVjaWFsbHkgdG9nZ2xlIHF1ZXN0aW9uc1xuICAgICAgICAvLyB3ZSBuZWVkIHRvIGNvdW50IHVzaW5nIHRoZSBzZWxlY3Rvcl9pZCBvZiB0aGUgc2VsZWN0IHF1ZXN0aW9uLlxuICAgICAgICAvLyBXZSAgYWxzbyBuZWVkIHRvIGxvZyBhbiBldmVudCBmb3IgdGhhdCBzZWxlY3RvciBzbyB0aGF0IHdlIHdpbGwga25vd1xuICAgICAgICAvLyB0aGF0IGludGVyYWN0aW9uIGhhcyB0YWtlbiBwbGFjZS4gIFRoaXMgaXMgKippbmRlcGVuZGVudCoqIG9mIGhvdyB0aGVcbiAgICAgICAgLy8gYXV0b2dyYWRlciB3aWxsIHVsdGltYXRlbHkgZ3JhZGUgdGhlIHF1ZXN0aW9uIVxuICAgICAgICBpZiAodGhpcy5zZWxlY3Rvcl9pZCkge1xuICAgICAgICAgICAgZXZlbnRJbmZvLmRpdl9pZCA9IHRoaXMuc2VsZWN0b3JfaWQucmVwbGFjZShcbiAgICAgICAgICAgICAgICBcIi10b2dnbGVTZWxlY3RlZFF1ZXN0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGV2ZW50SW5mby5ldmVudCA9IFwic2VsZWN0cXVlc3Rpb25cIjtcbiAgICAgICAgICAgIGV2ZW50SW5mby5hY3QgPSBcImludGVyYWN0aW9uXCI7XG4gICAgICAgICAgICB0aGlzLnBvc3RMb2dNZXNzYWdlKGV2ZW50SW5mbyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdHlwZW9mIHBhZ2VQcm9ncmVzc1RyYWNrZXIudXBkYXRlUHJvZ3Jlc3MgPT09IFwiZnVuY3Rpb25cIiAmJlxuICAgICAgICAgICAgZXZlbnRJbmZvLmFjdCAhPSBcImVkaXRcIiAmJlxuICAgICAgICAgICAgdGhpcy5vcHRpb25hbCA9PSBmYWxzZVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHBhZ2VQcm9ncmVzc1RyYWNrZXIudXBkYXRlUHJvZ3Jlc3MoZXZlbnRJbmZvLmRpdl9pZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBvc3RfcmV0dXJuO1xuICAgIH1cblxuICAgIGFzeW5jIHBvc3RMb2dNZXNzYWdlKGV2ZW50SW5mbykge1xuICAgICAgICB2YXIgcG9zdF9yZXR1cm47XG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vbG9nZ2VyL2Jvb2tldmVudGAsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmpzb25IZWFkZXJzLFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGV2ZW50SW5mbyksXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MjIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGRldGFpbHMgYWJvdXQgd2h5IHRoaXMgaXMgdW5wcm9jZXNhYmxlLlxuICAgICAgICAgICAgICAgICAgICBwb3N0X3JldHVybiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocG9zdF9yZXR1cm4uZGV0YWlsKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5wcm9jZXNzYWJsZSBSZXF1ZXN0XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDQwMSkge1xuICAgICAgICAgICAgICAgICAgICBwb3N0X3JldHVybiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgICAgICBgTWlzc2luZyBhdXRoZW50aWNhdGlvbiB0b2tlbiAke3Bvc3RfcmV0dXJuLmRldGFpbH1gXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1pc3NpbmcgYXV0aGVudGljYXRpb24gdG9rZW5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIHNhdmUgdGhlIGxvZyBlbnRyeVxuICAgICAgICAgICAgICAgICAgICBTdGF0dXM6ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9zdF9yZXR1cm4gPSByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGxldCBkZXRhaWwgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIGlmIChwb3N0X3JldHVybi5kZXRhaWwpIHtcbiAgICAgICAgICAgICAgICBkZXRhaWwgPSBwb3N0X3JldHVybi5kZXRhaWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZUJvb2tDb25maWcubG9naW5SZXF1aXJlZCkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KGBFcnJvcjogWW91ciBhY3Rpb24gd2FzIG5vdCBzYXZlZCEgXG4gICAgICAgICAgICAgICAgICAgIFRoZSBlcnJvciB3YXMgJHtlfSBcbiAgICAgICAgICAgICAgICAgICAgRGV0YWlsOiAke2RldGFpbH0uIFxuICAgICAgICAgICAgICAgICAgICBQbGVhc2UgcmVwb3J0IHRoaXMgZXJyb3IhYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzZW5kIGEgcmVxdWVzdCB0byBzYXZlIHRoaXMgZXJyb3JcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvcjogJHtlfSBEZXRhaWw6ICR7ZGV0YWlsfWApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwb3N0X3JldHVybjtcbiAgICB9XG4gICAgLy8gLi4gX2xvZ1J1bkV2ZW50OlxuICAgIC8vXG4gICAgLy8gbG9nUnVuRXZlbnRcbiAgICAvLyAtLS0tLS0tLS0tLVxuICAgIC8vIFRoaXMgZnVuY3Rpb24gc2VuZHMgdGhlIHByb3ZpZGVkIGBgZXZlbnRJbmZvYGAgdG8gdGhlIGBydW5sb2cgZW5kcG9pbnRgLiBXaGVuIGF3YWl0ZWQsIHRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgZGF0YSAoZGVjb2RlZCBmcm9tIEpTT04pIHRoZSBzZXJ2ZXIgc2VudCBiYWNrLlxuICAgIGFzeW5jIGxvZ1J1bkV2ZW50KGV2ZW50SW5mbykge1xuICAgICAgICBsZXQgcG9zdF9wcm9taXNlID0gXCJkb25lXCI7XG4gICAgICAgIGlmICh0aGlzLmdyYWRlcmFjdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50SW5mby5jb3Vyc2UgPSBlQm9va0NvbmZpZy5jb3Vyc2U7XG4gICAgICAgIGV2ZW50SW5mby5jbGllbnRMb2dpblN0YXR1cyA9IGVCb29rQ29uZmlnLmlzTG9nZ2VkSW47XG4gICAgICAgIGV2ZW50SW5mby50aW1lem9uZW9mZnNldCA9IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwO1xuICAgICAgICBpZiAodGhpcy5mb3JjZVNhdmUgfHwgXCJ0b19zYXZlXCIgaW4gZXZlbnRJbmZvID09PSBmYWxzZSkge1xuICAgICAgICAgICAgZXZlbnRJbmZvLnNhdmVfY29kZSA9IFwiVHJ1ZVwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyAmJiBlQm9va0NvbmZpZy5sb2dMZXZlbCA+IDApIHtcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2xvZ2dlci9ydW5sb2dgLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5qc29uSGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZXZlbnRJbmZvKSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG4gICAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgcG9zdF9wcm9taXNlID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgICAgIGlmIChlQm9va0NvbmZpZy5sb2dpblJlcXVpcmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGBGYWlsZWQgdG8gc2F2ZSB5b3VyIGNvZGVcbiAgICAgICAgICAgICAgICAgICAgICAgIFN0YXR1cyBpcyAke3Jlc3BvbnNlLnN0YXR1c31cbiAgICAgICAgICAgICAgICAgICAgICAgIERldGFpbDogJHtwb3N0X3Byb21pc2UuZGV0YWlsfWApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgYERpZCBub3Qgc2F2ZSB0aGUgY29kZS4gU3RhdHVzOiAke3Jlc3BvbnNlLnN0YXR1c31gXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwb3N0X3Byb21pc2UgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmlzVGltZWQgfHwgZUJvb2tDb25maWcuZGVidWcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicnVubmluZyBcIiArIEpTT04uc3RyaW5naWZ5KGV2ZW50SW5mbykpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHR5cGVvZiBwYWdlUHJvZ3Jlc3NUcmFja2VyLnVwZGF0ZVByb2dyZXNzID09PSBcImZ1bmN0aW9uXCIgJiZcbiAgICAgICAgICAgIHRoaXMub3B0aW9uYWwgPT0gZmFsc2VcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBwYWdlUHJvZ3Jlc3NUcmFja2VyLnVwZGF0ZVByb2dyZXNzKGV2ZW50SW5mby5kaXZfaWQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwb3N0X3Byb21pc2U7XG4gICAgfVxuICAgIC8qIENoZWNraW5nL2xvYWRpbmcgZnJvbSBzdG9yYWdlXG4gICAgKipXQVJOSU5HOioqICBETyBOT1QgYGF3YWl0YCB0aGlzIGZ1bmN0aW9uIVxuICAgIFRoaXMgZnVuY3Rpb24sIGFsdGhvdWdoIGFzeW5jLCBkb2VzIG5vdCBleHBsaWNpdGx5IHJlc29sdmUgaXRzIHByb21pc2UgYnkgcmV0dXJuaW5nIGEgdmFsdWUuICBUaGUgcmVhc29uIGZvciB0aGlzIGlzIGJlY2F1c2UgaXQgaXMgY2FsbGVkIGJ5IHRoZSBjb25zdHJ1Y3RvciBmb3IgbmVhcmx5IGV2ZXJ5IGNvbXBvbmVudC4gIEluIEphdmFzY3JpcHQgY29uc3RydWN0b3JzIGNhbm5vdCBiZSBhc3luYyFcblxuICAgIE9uZSBvZiB0aGUgcmVjb21tZW5kZWQgd2F5cyB0byBoYW5kbGUgdGhlIGFzeW5jIHJlcXVpcmVtZW50cyBmcm9tIHdpdGhpbiBhIGNvbnN0cnVjdG9yIGlzIHRvIHVzZSBhbiBhdHRyaWJ1dGUgYXMgYSBwcm9taXNlIGFuZCByZXNvbHZlIHRoYXQgYXR0cmlidXRlIGF0IHRoZSBhcHByb3ByaWF0ZSB0aW1lLlxuICAgICovXG4gICAgYXN5bmMgY2hlY2tTZXJ2ZXIoXG4gICAgICAgIC8vIEEgc3RyaW5nIHNwZWNpZnlpbmcgdGhlIGV2ZW50IG5hbWUgdG8gdXNlIGZvciBxdWVyeWluZyB0aGUgOnJlZjpgZ2V0QXNzZXNzUmVzdWx0c2AgZW5kcG9pbnQuXG4gICAgICAgIGV2ZW50SW5mbyxcbiAgICAgICAgLy8gSWYgdHJ1ZSwgdGhpcyBmdW5jdGlvbiB3aWxsIGludm9rZSBgYGluZGljYXRlX2NvbXBvbmVudF9yZWFkeSgpYGAganVzdCBiZWZvcmUgaXQgcmV0dXJucy4gVGhpcyBpcyBwcm92aWRlZCBzaW5jZSBtb3N0IGNvbXBvbmVudHMgYXJlIHJlYWR5IGFmdGVyIHRoaXMgZnVuY3Rpb24gY29tcGxldGVzIGl0cyB3b3JrLlxuICAgICAgICAvL1xuICAgICAgICAvLyBUT0RPOiBUaGlzIGRlZmF1bHRzIHRvIGZhbHNlLCB0byBhdm9pZCBjYXVzaW5nIHByb2JsZW1zIHdpdGggYW55IGNvbXBvbmVudHMgdGhhdCBoYXZlbid0IGJlZW4gdXBkYXRlZCBhbmQgdGVzdGVkLiBBZnRlciBhbGwgUnVuZXN0b25lIGNvbXBvbmVudHMgaGF2ZSBiZWVuIHVwZGF0ZWQsIGRlZmF1bHQgdGhpcyB0byB0cnVlIGFuZCByZW1vdmUgdGhlIGV4dHJhIHBhcmFtZXRlciBmcm9tIG1vc3QgY2FsbHMgdG8gdGhpcyBmdW5jdGlvbi5cbiAgICAgICAgd2lsbF9iZV9yZWFkeSA9IGZhbHNlXG4gICAgKSB7XG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBzZXJ2ZXIgaGFzIHN0b3JlZCBhbnN3ZXJcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmNoZWNrU2VydmVyQ29tcGxldGUgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBzZWxmLmNzcmVzb2x2ZXIgPSByZXNvbHZlO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgZUJvb2tDb25maWcuaXNMb2dnZWRJbiAmJlxuICAgICAgICAgICAgKHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMgfHwgdGhpcy5ncmFkZXJhY3RpdmUpXG4gICAgICAgICkge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSB7fTtcbiAgICAgICAgICAgIGRhdGEuZGl2X2lkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgICAgIGRhdGEuY291cnNlID0gZUJvb2tDb25maWcuY291cnNlO1xuICAgICAgICAgICAgZGF0YS5ldmVudCA9IGV2ZW50SW5mbztcbiAgICAgICAgICAgIGlmICh0aGlzLmdyYWRlcmFjdGl2ZSAmJiB0aGlzLmRlYWRsaW5lKSB7XG4gICAgICAgICAgICAgICAgZGF0YS5kZWFkbGluZSA9IHRoaXMuZGVhZGxpbmU7XG4gICAgICAgICAgICAgICAgZGF0YS5yYXdkZWFkbGluZSA9IHRoaXMucmF3ZGVhZGxpbmU7XG4gICAgICAgICAgICAgICAgZGF0YS50em9mZiA9IHRoaXMudHpvZmY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5zaWQpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnNpZCA9IHRoaXMuc2lkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEoZGF0YS5kaXZfaWQgJiYgZGF0YS5jb3Vyc2UgJiYgZGF0YS5ldmVudCkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICAgICAgYEEgcmVxdWlyZWQgZmllbGQgaXMgbWlzc2luZyBkYXRhICR7ZGF0YS5kaXZfaWR9OiR7ZGF0YS5jb3Vyc2V9OiR7ZGF0YS5ldmVudH1gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIElmIHdlIGFyZSBOT1QgaW4gcHJhY3RpY2UgbW9kZSBhbmQgd2UgYXJlIG5vdCBpbiBhIHBlZXIgZXhlcmNpc2VcbiAgICAgICAgICAgIC8vIGFuZCBhc3Nlc3NtZW50VGFrZW4gaXMgdHJ1ZVxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICFlQm9va0NvbmZpZy5wcmFjdGljZV9tb2RlICYmXG4gICAgICAgICAgICAgICAgIWVCb29rQ29uZmlnLnBlZXIgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmFzc2Vzc21lbnRUYWtlblxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdChcbiAgICAgICAgICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2Fzc2Vzc21lbnQvcmVzdWx0c2AsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuanNvbkhlYWRlcnMsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5kZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlcG9wdWxhdGVGcm9tU3RvcmFnZShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3NyZXNvbHZlcihcInNlcnZlclwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBIVFRQIEVycm9yIGdldHRpbmcgcmVzdWx0czogJHtyZXNwb25zZS5zdGF0dXNUZXh0fWBcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrTG9jYWxTdG9yYWdlKCk7IC8vIGp1c3QgZ28gcmlnaHQgdG8gbG9jYWwgc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jc3Jlc29sdmVyKFwibG9jYWxcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tMb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWREYXRhKHt9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNzcmVzb2x2ZXIoXCJub3QgdGFrZW5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrTG9jYWxTdG9yYWdlKCk7IC8vIGp1c3QgZ28gcmlnaHQgdG8gbG9jYWwgc3RvcmFnZVxuICAgICAgICAgICAgdGhpcy5jc3Jlc29sdmVyKFwibG9jYWxcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2lsbF9iZV9yZWFkeSkge1xuICAgICAgICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoaXMgbWV0aG9kIGFzc3VtZXMgdGhhdCBgYHRoaXMuY29tcG9uZW50RGl2YGAgcmVmZXJzIHRvIHRoZSBgYGRpdmBgIGNvbnRhaW5pbmcgdGhlIGNvbXBvbmVudCwgYW5kIHRoYXQgdGhpcyBjb21wb25lbnQncyBJRCBpcyBzZXQuXG4gICAgaW5kaWNhdGVfY29tcG9uZW50X3JlYWR5KCkge1xuICAgICAgICAvLyBBZGQgYSBjbGFzcyB0byBpbmRpY2F0ZSB0aGUgY29tcG9uZW50IGlzIG5vdyByZWFkeS5cbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuY2xhc3NMaXN0LmFkZChcInJ1bmVzdG9uZS1jb21wb25lbnQtcmVhZHlcIik7XG4gICAgICAgIC8vIFJlc29sdmUgdGhlIGBgdGhpcy5jb21wb25lbnRfcmVhZHlfcHJvbWlzZWBgLlxuICAgICAgICB0aGlzLl9jb21wb25lbnRfcmVhZHlfcmVzb2x2ZV9mbigpO1xuICAgIH1cblxuICAgIGxvYWREYXRhKGRhdGEpIHtcbiAgICAgICAgLy8gZm9yIG1vc3QgY2xhc3NlcywgbG9hZERhdGEgZG9lc24ndCBkbyBhbnl0aGluZy4gQnV0IGZvciBQYXJzb25zLCBhbmQgcGVyaGFwcyBvdGhlcnMgaW4gdGhlIGZ1dHVyZSxcbiAgICAgICAgLy8gaW5pdGlhbGl6YXRpb24gY2FuIGhhcHBlbiBldmVuIHdoZW4gdGhlcmUncyBubyBoaXN0b3J5IHRvIGJlIGxvYWRlZFxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXBvcHVsYXRlRnJvbVN0b3JhZ2UgaXMgY2FsbGVkIGFmdGVyIGEgc3VjY2Vzc2Z1bCBBUEkgY2FsbCBpcyBtYWRlIHRvIGBgZ2V0QXNzZXNzUmVzdWx0c2BgIGluXG4gICAgICogdGhlIGNoZWNrU2VydmVyIG1ldGhvZCBpbiB0aGlzIGNsYXNzXG4gICAgICpcbiAgICAgKiBgYHJlc3RvcmVBbnN3ZXJzLGBgIGBgc2V0TG9jYWxTdG9yYWdlYGAgYW5kIGBgY2hlY2tMb2NhbFN0b3JhZ2VgYCBhcmUgZGVmaW5lZCBpbiB0aGUgY2hpbGQgY2xhc3Nlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0gZGF0YSAtIGEgSlNPTiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBkYXRhIG5lZWRlZCB0byByZXN0b3JlIGEgcHJldmlvdXMgYW5zd2VyIGZvciBhIGNvbXBvbmVudFxuICAgICAqIEBwYXJhbSB7Kn0gc3RhdHVzIC0gdGhlIGh0dHAgc3RhdHVzXG4gICAgICogQHBhcmFtIHsqfSB3aGF0ZXZlciAtIGlnbm9yZWRcbiAgICAgKi9cbiAgICByZXBvcHVsYXRlRnJvbVN0b3JhZ2UoZGF0YSkge1xuICAgICAgICAvLyBkZWNpZGUgd2hldGhlciB0byB1c2UgdGhlIHNlcnZlcidzIGFuc3dlciAoaWYgdGhlcmUgaXMgb25lKSBvciB0byBsb2FkIGZyb20gc3RvcmFnZVxuICAgICAgICBpZiAoZGF0YSAhPT0gbnVsbCAmJiBkYXRhICE9PSBcIm5vIGRhdGFcIiAmJiB0aGlzLnNob3VsZFVzZVNlcnZlcihkYXRhKSkge1xuICAgICAgICAgICAgdGhpcy5yZXN0b3JlQW5zd2VycyhkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKGRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jaGVja0xvY2FsU3RvcmFnZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNob3VsZFVzZVNlcnZlcihkYXRhKSB7XG4gICAgICAgIC8vIHJldHVybnMgdHJ1ZSBpZiBzZXJ2ZXIgZGF0YSBpcyBtb3JlIHJlY2VudCB0aGFuIGxvY2FsIHN0b3JhZ2Ugb3IgaWYgc2VydmVyIHN0b3JhZ2UgaXMgY29ycmVjdFxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBkYXRhLmNvcnJlY3QgPT09IFwiVFwiIHx8XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UubGVuZ3RoID09PSAwIHx8XG4gICAgICAgICAgICB0aGlzLmdyYWRlcmFjdGl2ZSA9PT0gdHJ1ZSB8fFxuICAgICAgICAgICAgdGhpcy5pc1RpbWVkXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGV4ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG4gICAgICAgIGlmIChleCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN0b3JlZERhdGE7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzdG9yZWREYXRhID0gSlNPTi5wYXJzZShleCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgLy8gZXJyb3Igd2hpbGUgcGFyc2luZzsgbGlrZWx5IGR1ZSB0byBiYWQgdmFsdWUgc3RvcmVkIGluIHN0b3JhZ2VcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgICAgLy8gZGVmaW5pdGVseSBkb24ndCB3YW50IHRvIHVzZSBsb2NhbCBzdG9yYWdlIGhlcmVcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLmFuc3dlciA9PSBzdG9yZWREYXRhLmFuc3dlcikgcmV0dXJuIHRydWU7XG4gICAgICAgIGxldCBzdG9yYWdlRGF0ZSA9IG5ldyBEYXRlKHN0b3JlZERhdGEudGltZXN0YW1wKTtcbiAgICAgICAgbGV0IHNlcnZlckRhdGUgPSBuZXcgRGF0ZShkYXRhLnRpbWVzdGFtcCk7XG4gICAgICAgIHJldHVybiBzZXJ2ZXJEYXRlID49IHN0b3JhZ2VEYXRlO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gdGhlIGtleSB3aGljaCB0byBiZSB1c2VkIHdoZW4gYWNjZXNzaW5nIGxvY2FsIHN0b3JhZ2UuXG4gICAgbG9jYWxTdG9yYWdlS2V5KCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgZUJvb2tDb25maWcuZW1haWwgK1xuICAgICAgICAgICAgXCI6XCIgK1xuICAgICAgICAgICAgZUJvb2tDb25maWcuY291cnNlICtcbiAgICAgICAgICAgIFwiOlwiICtcbiAgICAgICAgICAgIHRoaXMuZGl2aWQgK1xuICAgICAgICAgICAgXCItZ2l2ZW5cIlxuICAgICAgICApO1xuICAgIH1cbiAgICBhZGRDYXB0aW9uKGVsVHlwZSkge1xuICAgICAgICAvL3NvbWVFbGVtZW50LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5ld0VsZW1lbnQsIHNvbWVFbGVtZW50Lm5leHRTaWJsaW5nKTtcbiAgICAgICAgaWYgKCF0aGlzLmlzVGltZWQpIHtcbiAgICAgICAgICAgIHZhciBjYXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnF1ZXN0aW9uX2xhYmVsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYXB0aW9uID0gYEFjdGl2aXR5OiAke3RoaXMucXVlc3Rpb25fbGFiZWx9ICR7dGhpcy5jYXB0aW9ufSAgPHNwYW4gY2xhc3M9XCJydW5lc3RvbmVfY2FwdGlvbl9kaXZpZFwiPigke3RoaXMuZGl2aWR9KTwvc3Bhbj5gO1xuICAgICAgICAgICAgICAgICQoY2FwRGl2KS5odG1sKHRoaXMuY2FwdGlvbik7XG4gICAgICAgICAgICAgICAgJChjYXBEaXYpLmFkZENsYXNzKGAke2VsVHlwZX1fY2FwdGlvbmApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKGNhcERpdikuaHRtbCh0aGlzLmNhcHRpb24gKyBcIiAoXCIgKyB0aGlzLmRpdmlkICsgXCIpXCIpO1xuICAgICAgICAgICAgICAgICQoY2FwRGl2KS5hZGRDbGFzcyhgJHtlbFR5cGV9X2NhcHRpb25gKTtcbiAgICAgICAgICAgICAgICAkKGNhcERpdikuYWRkQ2xhc3MoYCR7ZWxUeXBlfV9jYXB0aW9uX3RleHRgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2FwRGl2ID0gY2FwRGl2O1xuICAgICAgICAgICAgLy90aGlzLm91dGVyRGl2LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGNhcERpdiwgdGhpcy5vdXRlckRpdi5uZXh0U2libGluZyk7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChjYXBEaXYpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFzVXNlckFjdGl2aXR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0Fuc3dlcmVkO1xuICAgIH1cblxuICAgIGNoZWNrQ3VycmVudEFuc3dlcigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBcIkVhY2ggY29tcG9uZW50IHNob3VsZCBwcm92aWRlIGFuIGltcGxlbWVudGF0aW9uIG9mIGNoZWNrQ3VycmVudEFuc3dlclwiXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9nQ3VycmVudEFuc3dlcigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBcIkVhY2ggY29tcG9uZW50IHNob3VsZCBwcm92aWRlIGFuIGltcGxlbWVudGF0aW9uIG9mIGxvZ0N1cnJlbnRBbnN3ZXJcIlxuICAgICAgICApO1xuICAgIH1cbiAgICByZW5kZXJGZWVkYmFjaygpIHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBcIkVhY2ggY29tcG9uZW50IHNob3VsZCBwcm92aWRlIGFuIGltcGxlbWVudGF0aW9uIG9mIHJlbmRlckZlZWRiYWNrXCJcbiAgICAgICAgKTtcbiAgICB9XG4gICAgZGlzYWJsZUludGVyYWN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIFwiRWFjaCBjb21wb25lbnQgc2hvdWxkIHByb3ZpZGUgYW4gaW1wbGVtZW50YXRpb24gb2YgZGlzYWJsZUludGVyYWN0aW9uXCJcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuY29uc3RydWN0b3IubmFtZX06ICR7dGhpcy5kaXZpZH1gO1xuICAgIH1cblxuICAgIHF1ZXVlTWF0aEpheChjb21wb25lbnQpIHtcbiAgICAgICAgaWYgKE1hdGhKYXgudmVyc2lvbi5zdWJzdHJpbmcoMCwgMSkgPT09IFwiMlwiKSB7XG4gICAgICAgICAgICBNYXRoSmF4Lkh1Yi5RdWV1ZShbXCJUeXBlc2V0XCIsIE1hdGhKYXguSHViLCBjb21wb25lbnRdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIE1hdGhKYXgudHlwZXNldFByb21pc2UoW2NvbXBvbmVudF0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG53aW5kb3cuUnVuZXN0b25lQmFzZSA9IFJ1bmVzdG9uZUJhc2U7XG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0U3dpdGNoKCkge1xuICAgIGNvbnN0IHRvZ2dsZVN3aXRjaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aGVtZS1zd2l0Y2ggaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyk7XG4gICAgY29uc3QgY3VycmVudFRoZW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RoZW1lJykgPyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndGhlbWUnKSA6IG51bGw7XG5cbiAgICBpZiAoY3VycmVudFRoZW1lKSB7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGhlbWUnLCBjdXJyZW50VGhlbWUpO1xuXG4gICAgICAgIGlmIChjdXJyZW50VGhlbWUgPT09ICdkYXJrJykge1xuICAgICAgICAgICAgdG9nZ2xlU3dpdGNoLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3dpdGNoVGhlbWUoKSB7XG5cblx0dmFyIGNoZWNrQm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGVja2JveFwiKTtcbiAgICBpZiAoY2hlY2tCb3guY2hlY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGhlbWUnLCAnZGFyaycpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndGhlbWUnLCAnZGFyaycpOyAvL2FkZCB0aGlzXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLXRoZW1lJywgJ2xpZ2h0Jyk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0aGVtZScsICdsaWdodCcpOyAvL2FkZCB0aGlzXG4gICAgfVxufVxuIiwiLypnbG9iYWwgdmFyaWFibGUgZGVjbGFyYXRpb25zKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBcIi4uL2Nzcy91c2VyLWhpZ2hsaWdodHMuY3NzXCI7XG5cblxuZnVuY3Rpb24gZ2V0Q29tcGxldGlvbnMoKSB7XG4gICAgLy8gR2V0IHRoZSBjb21wbGV0aW9uIHN0YXR1c1xuICAgIGlmIChcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYubWF0Y2goXG4gICAgICAgICAgICAvKGluZGV4Lmh0bWx8dG9jdHJlZS5odG1sfGdlbmluZGV4Lmh0bWx8bmF2aGVscC5odG1sfHRvYy5odG1sfGFzc2lnbm1lbnRzLmh0bWx8RXhlcmNpc2VzLmh0bWwpL1xuICAgICAgICApXG4gICAgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgY3VycmVudFBhdGhuYW1lID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgIGlmIChjdXJyZW50UGF0aG5hbWUuaW5kZXhPZihcIj9cIikgIT09IC0xKSB7XG4gICAgICAgIGN1cnJlbnRQYXRobmFtZSA9IGN1cnJlbnRQYXRobmFtZS5zdWJzdHJpbmcoXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgY3VycmVudFBhdGhuYW1lLmxhc3RJbmRleE9mKFwiP1wiKVxuICAgICAgICApO1xuICAgIH1cbiAgICB2YXIgZGF0YSA9IHsgbGFzdFBhZ2VVcmw6IGN1cnJlbnRQYXRobmFtZSB9O1xuICAgIGpRdWVyeVxuICAgICAgICAuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9sb2dnZXIvZ2V0Q29tcGxldGlvblN0YXR1c2AsXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICB9KVxuICAgICAgICAuZG9uZShmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgaWYgKGRhdGEgIT0gXCJOb25lXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29tcGxldGlvbkRhdGEgPSBkYXRhLmRldGFpbDtcbiAgICAgICAgICAgICAgICB2YXIgY29tcGxldGlvbkNsYXNzLCBjb21wbGV0aW9uTXNnO1xuICAgICAgICAgICAgICAgIGlmIChjb21wbGV0aW9uRGF0YVswXS5jb21wbGV0aW9uU3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGlvbkNsYXNzID0gXCJidXR0b25Db25maXJtQ29tcGxldGlvblwiO1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0aW9uTXNnID1cbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPGkgY2xhc3M9J2dseXBoaWNvbiBnbHlwaGljb24tb2snPjwvaT4gQ29tcGxldGVkLiBXZWxsIERvbmUhXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGlvbkNsYXNzID0gXCJidXR0b25Bc2tDb21wbGV0aW9uXCI7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRpb25Nc2cgPSBcIk1hcmsgYXMgQ29tcGxldGVkXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQoXCIjbWFpbi1jb250ZW50XCIpLmFwcGVuZChcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOmNlbnRlclwiPjxidXR0b24gY2xhc3M9XCJidG4gYnRuLWxnICcgK1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0aW9uQ2xhc3MgK1xuICAgICAgICAgICAgICAgICAgICAnXCIgaWQ9XCJjb21wbGV0aW9uQnV0dG9uXCI+JyArXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRpb25Nc2cgK1xuICAgICAgICAgICAgICAgICAgICBcIjwvYnV0dG9uPjwvZGl2PlwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNob3dMYXN0UG9zaXRpb25CYW5uZXIoKSB7XG4gICAgdmFyIGxhc3RQb3NpdGlvblZhbCA9ICQuZ2V0VXJsVmFyKFwibGFzdFBvc2l0aW9uXCIpO1xuICAgIGlmICh0eXBlb2YgbGFzdFBvc2l0aW9uVmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICQoXCJib2R5XCIpLmFwcGVuZChcbiAgICAgICAgICAgICc8aW1nIHNyYz1cIi4uL19zdGF0aWMvbGFzdC1wb2ludC5wbmdcIiBzdHlsZT1cInBvc2l0aW9uOmFic29sdXRlOyBwYWRkaW5nLXRvcDo1NXB4OyBsZWZ0OiAxMHB4OyB0b3A6ICcgK1xuICAgICAgICAgICAgcGFyc2VJbnQobGFzdFBvc2l0aW9uVmFsKSArXG4gICAgICAgICAgICAncHg7XCIvPidcbiAgICAgICAgKTtcbiAgICAgICAgJChcImh0bWwsIGJvZHlcIikuYW5pbWF0ZSh7IHNjcm9sbFRvcDogcGFyc2VJbnQobGFzdFBvc2l0aW9uVmFsKSB9LCAxMDAwKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFkZE5hdmlnYXRpb25BbmRDb21wbGV0aW9uQnV0dG9ucygpIHtcbiAgICBpZiAoXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmLm1hdGNoKFxuICAgICAgICAgICAgLyhpbmRleC5odG1sfGdlbmluZGV4Lmh0bWx8bmF2aGVscC5odG1sfHRvYy5odG1sfGFzc2lnbm1lbnRzLmh0bWx8RXhlcmNpc2VzLmh0bWx8dG9jdHJlZS5odG1sKS9cbiAgICAgICAgKVxuICAgICkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBuYXZMaW5rQmdSaWdodEhpZGRlblBvc2l0aW9uID0gLSQoXCIjbmF2TGlua0JnUmlnaHRcIikub3V0ZXJXaWR0aCgpIC0gNTtcbiAgICB2YXIgbmF2TGlua0JnUmlnaHRIYWxmT3BlbjtcbiAgICB2YXIgbmF2TGlua0JnUmlnaHRGdWxsT3BlbiA9IDA7XG5cbiAgICBpZiAoJChcIiNjb21wbGV0aW9uQnV0dG9uXCIpLmhhc0NsYXNzKFwiYnV0dG9uQXNrQ29tcGxldGlvblwiKSkge1xuICAgICAgICBuYXZMaW5rQmdSaWdodEhhbGZPcGVuID0gbmF2TGlua0JnUmlnaHRIaWRkZW5Qb3NpdGlvbiArIDcwO1xuICAgIH0gZWxzZSBpZiAoJChcIiNjb21wbGV0aW9uQnV0dG9uXCIpLmhhc0NsYXNzKFwiYnV0dG9uQ29uZmlybUNvbXBsZXRpb25cIikpIHtcbiAgICAgICAgbmF2TGlua0JnUmlnaHRIYWxmT3BlbiA9IDA7XG4gICAgfVxuICAgIHZhciByZWxhdGlvbnNOZXh0SWNvbkluaXRpYWxQb3NpdGlvbiA9ICQoXCIjcmVsYXRpb25zLW5leHRcIikuY3NzKFwicmlnaHRcIik7XG4gICAgdmFyIHJlbGF0aW9uc05leHRJY29uTmV3UG9zaXRpb24gPSAtKG5hdkxpbmtCZ1JpZ2h0SGlkZGVuUG9zaXRpb24gKyAzNSk7XG5cbiAgICAkKFwiI25hdkxpbmtCZ1JpZ2h0XCIpLmNzcyhcInJpZ2h0XCIsIG5hdkxpbmtCZ1JpZ2h0SGlkZGVuUG9zaXRpb24pLnNob3coKTtcbiAgICB2YXIgbmF2QmdTaG93biA9IGZhbHNlO1xuICAgICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyAkKHdpbmRvdykuaGVpZ2h0KCkgPT1cbiAgICAgICAgICAgICQoZG9jdW1lbnQpLmhlaWdodCgpXG4gICAgICAgICkge1xuICAgICAgICAgICAgJChcIiNuYXZMaW5rQmdSaWdodFwiKS5hbmltYXRlKFxuICAgICAgICAgICAgICAgIHsgcmlnaHQ6IG5hdkxpbmtCZ1JpZ2h0SGFsZk9wZW4gfSxcbiAgICAgICAgICAgICAgICAyMDBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAkKFwiI25hdkxpbmtCZ0xlZnRcIikuYW5pbWF0ZSh7IGxlZnQ6IFwiMHB4XCIgfSwgMjAwKTtcbiAgICAgICAgICAgIGlmICgkKFwiI2NvbXBsZXRpb25CdXR0b25cIikuaGFzQ2xhc3MoXCJidXR0b25Db25maXJtQ29tcGxldGlvblwiKSkge1xuICAgICAgICAgICAgICAgICQoXCIjcmVsYXRpb25zLW5leHRcIikuYW5pbWF0ZShcbiAgICAgICAgICAgICAgICAgICAgeyByaWdodDogcmVsYXRpb25zTmV4dEljb25OZXdQb3NpdGlvbiB9LFxuICAgICAgICAgICAgICAgICAgICAyMDBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmF2QmdTaG93biA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAobmF2QmdTaG93bikge1xuICAgICAgICAgICAgJChcIiNuYXZMaW5rQmdSaWdodFwiKS5hbmltYXRlKFxuICAgICAgICAgICAgICAgIHsgcmlnaHQ6IG5hdkxpbmtCZ1JpZ2h0SGlkZGVuUG9zaXRpb24gfSxcbiAgICAgICAgICAgICAgICAyMDBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAkKFwiI25hdkxpbmtCZ0xlZnRcIikuYW5pbWF0ZSh7IGxlZnQ6IFwiLTY1cHhcIiB9LCAyMDApO1xuICAgICAgICAgICAgJChcIiNyZWxhdGlvbnMtbmV4dFwiKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICByaWdodDogcmVsYXRpb25zTmV4dEljb25Jbml0aWFsUG9zaXRpb24sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG5hdkJnU2hvd24gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGNvbXBsZXRpb25GbGFnID0gMDtcbiAgICBpZiAoJChcIiNjb21wbGV0aW9uQnV0dG9uXCIpLmhhc0NsYXNzKFwiYnV0dG9uQXNrQ29tcGxldGlvblwiKSkge1xuICAgICAgICBjb21wbGV0aW9uRmxhZyA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29tcGxldGlvbkZsYWcgPSAxO1xuICAgIH1cbiAgICAvLyBNYWtlIHN1cmUgd2UgbWFyayB0aGlzIHBhZ2UgYXMgdmlzaXRlZCByZWdhcmRsZXNzIG9mIGhvdyBmbGFrZXlcbiAgICAvLyB0aGUgb251bmxvYWQgaGFuZGxlcnMgYmVjb21lLlxuICAgIHByb2Nlc3NQYWdlU3RhdGUoY29tcGxldGlvbkZsYWcpO1xuICAgICQoXCIjY29tcGxldGlvbkJ1dHRvblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoXCJidXR0b25Bc2tDb21wbGV0aW9uXCIpKSB7XG4gICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKFwiYnV0dG9uQXNrQ29tcGxldGlvblwiKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhcImJ1dHRvbkNvbmZpcm1Db21wbGV0aW9uXCIpXG4gICAgICAgICAgICAgICAgLmh0bWwoXG4gICAgICAgICAgICAgICAgICAgIFwiPGkgY2xhc3M9J2dseXBoaWNvbiBnbHlwaGljb24tb2snPjwvaT4gQ29tcGxldGVkLiBXZWxsIERvbmUhXCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgJChcIiNuYXZMaW5rQmdSaWdodFwiKS5hbmltYXRlKHsgcmlnaHQ6IG5hdkxpbmtCZ1JpZ2h0RnVsbE9wZW4gfSk7XG4gICAgICAgICAgICAkKFwiI3JlbGF0aW9ucy1uZXh0XCIpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIHJpZ2h0OiByZWxhdGlvbnNOZXh0SWNvbk5ld1Bvc2l0aW9uLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBuYXZMaW5rQmdSaWdodEhhbGZPcGVuID0gMDtcbiAgICAgICAgICAgIGNvbXBsZXRpb25GbGFnID0gMTtcbiAgICAgICAgfSBlbHNlIGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiYnV0dG9uQ29uZmlybUNvbXBsZXRpb25cIikpIHtcbiAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoXCJidXR0b25Db25maXJtQ29tcGxldGlvblwiKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhcImJ1dHRvbkFza0NvbXBsZXRpb25cIilcbiAgICAgICAgICAgICAgICAuaHRtbChcIk1hcmsgYXMgQ29tcGxldGVkXCIpO1xuICAgICAgICAgICAgbmF2TGlua0JnUmlnaHRIYWxmT3BlbiA9IG5hdkxpbmtCZ1JpZ2h0SGlkZGVuUG9zaXRpb24gKyA3MDtcbiAgICAgICAgICAgICQoXCIjbmF2TGlua0JnUmlnaHRcIikuYW5pbWF0ZSh7IHJpZ2h0OiBuYXZMaW5rQmdSaWdodEhhbGZPcGVuIH0pO1xuICAgICAgICAgICAgJChcIiNyZWxhdGlvbnMtbmV4dFwiKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICByaWdodDogcmVsYXRpb25zTmV4dEljb25Jbml0aWFsUG9zaXRpb24sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbXBsZXRpb25GbGFnID0gMDtcbiAgICAgICAgfVxuICAgICAgICBwcm9jZXNzUGFnZVN0YXRlKGNvbXBsZXRpb25GbGFnKTtcbiAgICB9KTtcblxuICAgICQod2luZG93KS5vbihcImJlZm9yZXVubG9hZFwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoY29tcGxldGlvbkZsYWcgPT0gMCkge1xuICAgICAgICAgICAgcHJvY2Vzc1BhZ2VTdGF0ZShjb21wbGV0aW9uRmxhZyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLy8gXyBkZWNvcmF0ZVRhYmxlT2ZDb250ZW50c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gZGVjb3JhdGVUYWJsZU9mQ29udGVudHMoKSB7XG4gICAgaWYgKFxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZi50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJ0b2MuaHRtbFwiKSAhPSAtMSB8fFxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZi50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJpbmRleC5odG1sXCIpICE9IC0xXG4gICAgKSB7XG4gICAgICAgIGpRdWVyeS5nZXQoYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2xvZ2dlci9nZXRBbGxDb21wbGV0aW9uU3RhdHVzYCwgZnVuY3Rpb24gKFxuICAgICAgICAgICAgZGF0YVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHZhciBzdWJDaGFwdGVyTGlzdDtcbiAgICAgICAgICAgIGlmIChkYXRhICE9IFwiTm9uZVwiKSB7XG4gICAgICAgICAgICAgICAgc3ViQ2hhcHRlckxpc3QgPSBkYXRhLmRldGFpbDtcblxuICAgICAgICAgICAgICAgIHZhciBhbGxTdWJDaGFwdGVyVVJMcyA9ICQoXCIjbWFpbi1jb250ZW50IGRpdiBsaSBhXCIpO1xuICAgICAgICAgICAgICAgICQuZWFjaChzdWJDaGFwdGVyTGlzdCwgZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHMgPSAwOyBzIDwgYWxsU3ViQ2hhcHRlclVSTHMubGVuZ3RoOyBzKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxTdWJDaGFwdGVyVVJMc1tzXS5ocmVmLmluZGV4T2YoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uY2hhcHRlck5hbWUgKyBcIi9cIiArIGl0ZW0uc3ViQ2hhcHRlck5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApICE9IC0xXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21wbGV0aW9uU3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChhbGxTdWJDaGFwdGVyVVJMc1tzXS5wYXJlbnRFbGVtZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKFwiY29tcGxldGVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImluZm9UZXh0Q29tcGxldGVkXCI+LSBDb21wbGV0ZWQgdGhpcyB0b3BpYyBvbiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmVuZERhdGUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiPC9zcGFuPlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2hpbGRyZW4oKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpcnN0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5ob3ZlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5uZXh0KFwiLmluZm9UZXh0Q29tcGxldGVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubmV4dChcIi5pbmZvVGV4dENvbXBsZXRlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5jb21wbGV0aW9uU3RhdHVzID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChhbGxTdWJDaGFwdGVyVVJMc1tzXS5wYXJlbnRFbGVtZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKFwiYWN0aXZlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImluZm9UZXh0QWN0aXZlXCI+TGFzdCByZWFkIHRoaXMgdG9waWMgb24gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5lbmREYXRlICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjwvc3Bhbj5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNoaWxkcmVuKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maXJzdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaG92ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubmV4dChcIi5pbmZvVGV4dEFjdGl2ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm5leHQoXCIuaW5mb1RleHRBY3RpdmVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBkYXRhID0geyBjb3Vyc2U6IGVCb29rQ29uZmlnLmNvdXJzZSB9O1xuICAgICAgICBqUXVlcnkuZ2V0KGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9sb2dnZXIvZ2V0bGFzdHBhZ2VgLCBkYXRhLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdmFyIGxhc3RQYWdlRGF0YTtcbiAgICAgICAgICAgIGlmIChkYXRhICE9IFwiTm9uZVwiKSB7XG4gICAgICAgICAgICAgICAgbGFzdFBhZ2VEYXRhID0gZGF0YS5kZXRhaWw7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RQYWdlRGF0YS5sYXN0UGFnZUNoYXB0ZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAkKFwiI2NvbnRpbnVlLXJlYWRpbmdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zaG93KClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5odG1sKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGlkPVwianVtcC10by1jaGFwdGVyXCIgY2xhc3M9XCJhbGVydCBhbGVydC1pbmZvXCIgPjxzdHJvbmc+WW91IHdlcmUgTGFzdCBSZWFkaW5nOjwvc3Ryb25nPiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0UGFnZURhdGEubGFzdFBhZ2VDaGFwdGVyICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobGFzdFBhZ2VEYXRhLmxhc3RQYWdlU3ViY2hhcHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiICZndDsgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0UGFnZURhdGEubGFzdFBhZ2VTdWJjaGFwdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJcIikgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgPGEgaHJlZj1cIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RQYWdlRGF0YS5sYXN0UGFnZVVybCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCI/bGFzdFBvc2l0aW9uPVwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0UGFnZURhdGEubGFzdFBhZ2VTY3JvbGxMb2NhdGlvbiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1wiPkNvbnRpbnVlIFJlYWRpbmc8L2E+PC9kaXY+J1xuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZW5hYmxlQ29tcGxldGlvbnMoKSB7XG4gICAgZ2V0Q29tcGxldGlvbnMoKTtcbiAgICBzaG93TGFzdFBvc2l0aW9uQmFubmVyKCk7XG4gICAgYWRkTmF2aWdhdGlvbkFuZENvbXBsZXRpb25CdXR0b25zKCk7XG4gICAgZGVjb3JhdGVUYWJsZU9mQ29udGVudHMoKTtcbn1cblxuLy8gY2FsbCBlbmFibGUgdXNlciBoaWdobGlnaHRzIGFmdGVyIGxvZ2luXG4kKGRvY3VtZW50KS5iaW5kKFwicnVuZXN0b25lOmxvZ2luXCIsIGVuYWJsZUNvbXBsZXRpb25zKTtcblxuLy8gXyBwcm9jZXNzUGFnZVN0YXRlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBwcm9jZXNzUGFnZVN0YXRlKGNvbXBsZXRpb25GbGFnKSB7XG4gICAgLypMb2cgbGFzdCBwYWdlIHZpc2l0ZWQqL1xuICAgIHZhciBjdXJyZW50UGF0aG5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgaWYgKGN1cnJlbnRQYXRobmFtZS5pbmRleE9mKFwiP1wiKSAhPT0gLTEpIHtcbiAgICAgICAgY3VycmVudFBhdGhuYW1lID0gY3VycmVudFBhdGhuYW1lLnN1YnN0cmluZyhcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICBjdXJyZW50UGF0aG5hbWUubGFzdEluZGV4T2YoXCI/XCIpXG4gICAgICAgICk7XG4gICAgfVxuICAgIHZhciBkYXRhID0ge1xuICAgICAgICBsYXN0UGFnZVVybDogY3VycmVudFBhdGhuYW1lLFxuICAgICAgICBsYXN0UGFnZVNjcm9sbExvY2F0aW9uOiAkKHdpbmRvdykuc2Nyb2xsVG9wKCksXG4gICAgICAgIGNvbXBsZXRpb25GbGFnOiBjb21wbGV0aW9uRmxhZyxcbiAgICAgICAgY291cnNlOiBlQm9va0NvbmZpZy5jb3Vyc2UsXG4gICAgfTtcbiAgICAkKGRvY3VtZW50KS5hamF4RXJyb3IoZnVuY3Rpb24gKGUsIGpxaHhyLCBzZXR0aW5ncywgZXhjZXB0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVxdWVzdCBGYWlsZWQgZm9yIFwiICsgc2V0dGluZ3MudXJsKTtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgfSk7XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICB1cmw6IGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9sb2dnZXIvdXBkYXRlbGFzdHBhZ2VgLFxuICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIsXG4gICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGFzeW5jOiB0cnVlLFxuICAgIH0pO1xufVxuXG4kLmV4dGVuZCh7XG4gICAgZ2V0VXJsVmFyczogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdmFycyA9IFtdLFxuICAgICAgICAgICAgaGFzaDtcbiAgICAgICAgdmFyIGhhc2hlcyA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2hcbiAgICAgICAgICAgIC5zbGljZSh3aW5kb3cubG9jYXRpb24uc2VhcmNoLmluZGV4T2YoXCI/XCIpICsgMSlcbiAgICAgICAgICAgIC5zcGxpdChcIiZcIik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGFzaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBoYXNoID0gaGFzaGVzW2ldLnNwbGl0KFwiPVwiKTtcbiAgICAgICAgICAgIHZhcnMucHVzaChoYXNoWzBdKTtcbiAgICAgICAgICAgIHZhcnNbaGFzaFswXV0gPSBoYXNoWzFdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YXJzO1xuICAgIH0sXG4gICAgZ2V0VXJsVmFyOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICByZXR1cm4gJC5nZXRVcmxWYXJzKClbbmFtZV07XG4gICAgfSxcbn0pO1xuIiwiKGZ1bmN0aW9uICgkKSB7XG4gIC8qKlxuICAgKiBQYXRjaCBUT0MgbGlzdC5cbiAgICpcbiAgICogV2lsbCBtdXRhdGUgdGhlIHVuZGVybHlpbmcgc3BhbiB0byBoYXZlIGEgY29ycmVjdCB1bCBmb3IgbmF2LlxuICAgKlxuICAgKiBAcGFyYW0gJHNwYW46IFNwYW4gY29udGFpbmluZyBuZXN0ZWQgVUwncyB0byBtdXRhdGUuXG4gICAqIEBwYXJhbSBtaW5MZXZlbDogU3RhcnRpbmcgbGV2ZWwgZm9yIG5lc3RlZCBsaXN0cy4gKDE6IGdsb2JhbCwgMjogbG9jYWwpLlxuICAgKi9cbiAgdmFyIHBhdGNoVG9jID0gZnVuY3Rpb24gKCR1bCwgbWluTGV2ZWwpIHtcbiAgICB2YXIgZmluZEEsXG4gICAgICBwYXRjaFRhYmxlcyxcbiAgICAgICRsb2NhbExpO1xuXG4gICAgLy8gRmluZCBhbGwgYSBcImludGVybmFsXCIgdGFncywgdHJhdmVyc2luZyByZWN1cnNpdmVseS5cbiAgICBmaW5kQSA9IGZ1bmN0aW9uICgkZWxlbSwgbGV2ZWwpIHtcbiAgICAgIGxldmVsID0gbGV2ZWwgfHwgMDtcbiAgICAgIHZhciAkaXRlbXMgPSAkZWxlbS5maW5kKFwiPiBsaSA+IGEuaW50ZXJuYWwsID4gdWwsID4gbGkgPiB1bFwiKTtcblxuICAgICAgLy8gSXRlcmF0ZSBldmVyeXRoaW5nIGluIG9yZGVyLlxuICAgICAgJGl0ZW1zLmVhY2goZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XG4gICAgICAgIHZhciAkaXRlbSA9ICQoaXRlbSksXG4gICAgICAgICAgdGFnID0gaXRlbS50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgJGNoaWxkcmVuTGkgPSAkaXRlbS5jaGlsZHJlbignbGknKSxcbiAgICAgICAgICAkcGFyZW50TGkgPSAkKCRpdGVtLnBhcmVudCgnbGknKSwgJGl0ZW0ucGFyZW50KCkucGFyZW50KCdsaScpKTtcblxuICAgICAgICAvLyBBZGQgZHJvcGRvd25zIGlmIG1vcmUgY2hpbGRyZW4gYW5kIGFib3ZlIG1pbmltdW0gbGV2ZWwuXG4gICAgICAgIGlmICh0YWcgPT09ICd1bCcgJiYgbGV2ZWwgPj0gbWluTGV2ZWwgJiYgJGNoaWxkcmVuTGkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICRwYXJlbnRMaVxuICAgICAgICAgICAgLmFkZENsYXNzKCdkcm9wZG93bi1zdWJtZW51JylcbiAgICAgICAgICAgIC5jaGlsZHJlbignYScpLmZpcnN0KCkuYXR0cigndGFiaW5kZXgnLCAtMSk7XG5cbiAgICAgICAgICAkaXRlbS5hZGRDbGFzcygnZHJvcGRvd24tbWVudScpO1xuICAgICAgICB9XG5cbiAgICAgICAgZmluZEEoJGl0ZW0sIGxldmVsICsgMSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgZmluZEEoJHVsKTtcbiAgfTtcblxuICAvKipcbiAgICogUGF0Y2ggYWxsIHRhYmxlcyB0byByZW1vdmUgYGBkb2N1dGlsc2BgIGNsYXNzIGFuZCBhZGQgQm9vdHN0cmFwIGJhc2VcbiAgICogYGB0YWJsZWBgIGNsYXNzLlxuICAgKi9cbiAgcGF0Y2hUYWJsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgJChcInRhYmxlLmRvY3V0aWxzXCIpXG4gICAgICAucmVtb3ZlQ2xhc3MoXCJkb2N1dGlsc1wiKVxuICAgICAgLmFkZENsYXNzKFwidGFibGVcIilcbiAgICAgIC5hdHRyKFwiYm9yZGVyXCIsIDApO1xuICB9O1xuXG4kKGZ1bmN0aW9uICgpIHtcblxuICAgIC8qXG4gICAgICogU2Nyb2xsIHRoZSB3aW5kb3cgdG8gYXZvaWQgdGhlIHRvcG5hdiBiYXJcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vdHdpdHRlci9ib290c3RyYXAvaXNzdWVzLzE3NjhcbiAgICAgKi9cbiAgICBpZiAoJChcIiNuYXZiYXIubmF2YmFyLWZpeGVkLXRvcFwiKS5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgbmF2SGVpZ2h0ID0gJChcIiNuYXZiYXJcIikuaGVpZ2h0KCksXG4gICAgICAgIHNoaWZ0V2luZG93ID0gZnVuY3Rpb24oKSB7IHNjcm9sbEJ5KDAsIC1uYXZIZWlnaHQgLSAxMCk7IH07XG5cbiAgICAgIGlmIChsb2NhdGlvbi5oYXNoKSB7XG4gICAgICAgIHNoaWZ0V2luZG93KCk7XG4gICAgICB9XG5cbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiaGFzaGNoYW5nZVwiLCBzaGlmdFdpbmRvdyk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHN0eWxpbmcsIHN0cnVjdHVyZSB0byBUT0Mncy5cbiAgICAkKFwiLmRyb3Bkb3duLW1lbnVcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAkKHRoaXMpLmZpbmQoXCJ1bFwiKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgaXRlbSl7XG4gICAgICAgIHZhciAkaXRlbSA9ICQoaXRlbSk7XG4gICAgICAgICRpdGVtLmFkZENsYXNzKCd1bnN0eWxlZCcpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBHbG9iYWwgVE9DLlxuICAgIGlmICgkKFwidWwuZ2xvYmFsdG9jIGxpXCIpLmxlbmd0aCkge1xuICAgICAgcGF0Y2hUb2MoJChcInVsLmdsb2JhbHRvY1wiKSwgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlbW92ZSBHbG9iYWwgVE9DLlxuICAgICAgJChcIi5nbG9iYWx0b2MtY29udGFpbmVyXCIpLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIC8vIExvY2FsIFRPQy5cbiAgICBwYXRjaFRvYygkKFwidWwubG9jYWx0b2NcIiksIDIpO1xuXG4gICAgLy8gTXV0YXRlIHN1Yi1saXN0cyAoZm9yIGJzLTIuMy4wKS5cbiAgICAkKFwiLmRyb3Bkb3duLW1lbnUgdWxcIikubm90KFwiLmRyb3Bkb3duLW1lbnVcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHVsID0gJCh0aGlzKSxcbiAgICAgICAgJHBhcmVudCA9ICR1bC5wYXJlbnQoKSxcbiAgICAgICAgdGFnID0gJHBhcmVudFswXS50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICRraWRzID0gJHVsLmNoaWxkcmVuKCkuZGV0YWNoKCk7XG5cbiAgICAgIC8vIFJlcGxhY2UgbGlzdCB3aXRoIGl0ZW1zIGlmIHN1Ym1lbnUgaGVhZGVyLlxuICAgICAgaWYgKHRhZyA9PT0gXCJ1bFwiKSB7XG4gICAgICAgICR1bC5yZXBsYWNlV2l0aCgka2lkcyk7XG4gICAgICB9IGVsc2UgaWYgKHRhZyA9PT0gXCJsaVwiKSB7XG4gICAgICAgIC8vIEluc2VydCBpbnRvIHByZXZpb3VzIGxpc3QuXG4gICAgICAgICRwYXJlbnQuYWZ0ZXIoJGtpZHMpO1xuICAgICAgICAkdWwucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBBZGQgZGl2aWRlciBpbiBwYWdlIFRPQy5cbiAgICAkbG9jYWxMaSA9ICQoXCJ1bC5sb2NhbHRvYyBsaVwiKTtcbiAgICBpZiAoJGxvY2FsTGkubGVuZ3RoID4gMikge1xuICAgICAgJGxvY2FsTGkuZmlyc3QoKS5hZnRlcignPGxpIGNsYXNzPVwiZGl2aWRlclwiPjwvbGk+Jyk7XG4gICAgfVxuXG4gICAgLy8gRW5hYmxlIGRyb3Bkb3duLlxuICAgICQoJy5kcm9wZG93bi10b2dnbGUnKS5kcm9wZG93bigpO1xuXG4gICAgLy8gUGF0Y2ggdGFibGVzLlxuICAgIHBhdGNoVGFibGVzKCk7XG5cbiAgICAvLyBBZGQgTm90ZSwgV2FybmluZyBzdHlsZXMuXG4gICAgJCgnZGl2Lm5vdGUnKS5hZGRDbGFzcygnYWxlcnQnKS5hZGRDbGFzcygnYWxlcnQtaW5mbycpO1xuICAgICQoJ2Rpdi53YXJuaW5nJykuYWRkQ2xhc3MoJ2FsZXJ0JykuYWRkQ2xhc3MoJ2FsZXJ0LXdhcm5pbmcnKTtcblxuICAgIC8vIElubGluZSBjb2RlIHN0eWxlcyB0byBCb290c3RyYXAgc3R5bGUuXG4gICAgJCgndHQuZG9jdXRpbHMubGl0ZXJhbCcpLm5vdChcIi54cmVmXCIpLmVhY2goZnVuY3Rpb24gKGksIGUpIHtcbiAgICAgIC8vIGlnbm9yZSByZWZlcmVuY2VzXG4gICAgICBpZiAoISQoZSkucGFyZW50KCkuaGFzQ2xhc3MoXCJyZWZlcmVuY2VcIikpIHtcbiAgICAgICAgJChlKS5yZXBsYWNlV2l0aChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuICQoXCI8Y29kZSAvPlwiKS50ZXh0KCQodGhpcykudGV4dCgpKTtcbiAgICAgICAgfSk7XG4gICAgICB9fSk7XG4gIH0pO1xufSh3aW5kb3cualF1ZXJ5KSk7XG4iLCIvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gfGRvY25hbWV8IC0gQSBmcmFtZXdvcmsgYWxsb3dpbmcgYSBSdW5lc3RvbmUgY29tcG9uZW50IHRvIGxvYWQgb25seSB0aGUgSlMgaXQgbmVlZHNcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBUaGUgSmF2YVNjcmlwdCByZXF1aXJlZCBieSBhbGwgUnVuZXN0b25lIGNvbXBvbmVudHMgaXMgcXVpdGUgbGFyZ2UgYW5kIHJlc3VsdHMgaW4gc2xvdyBwYWdlIGxvYWRzLiBUaGlzIGFwcHJvYWNoIGVuYWJsZXMgYSBSdW5lc3RvbmUgY29tcG9uZW50IHRvIGxvYWQgb25seSB0aGUgSmF2YVNjcmlwdCBpdCBuZWVkcywgcmF0aGVyIHRoYW4gbG9hZGluZyBKYXZhU2NyaXB0IGZvciBhbGwgdGhlIGNvbXBvbmVudHMgcmVnYXJkbGVzcyBvZiB3aGljaCBhcmUgYWN0dWFsbHkgdXNlZC5cbi8vXG4vLyBUbyBhY2NvbXBsaXNoIHRoaXMsIHdlYnBhY2sncyBzcGxpdC1jaHVua3MgYWJpbGl0eSBhbmFseXplcyBhbGwgSlMsIHN0YXJ0aW5nIGZyb20gdGhpcyBmaWxlLiBUaGUgZHluYW1pYyBpbXBvcnRzIGJlbG93IGFyZSB0cmFuc2Zvcm1lZCBieSB3ZWJwYWNrIGludG8gdGhlIGR5bmFtaWMgZmV0Y2hlcyBvZiBqdXN0IHRoZSBKUyByZXF1aXJlZCBieSBlYWNoIGZpbGUgYW5kIGFsbCBpdHMgZGVwZW5kZW5jaWVzLiAoSWYgdXNpbmcgc3RhdGljIGltcG9ydHMsIHdlYnBhY2sgd2lsbCBhc3N1bWUgdGhhdCBhbGwgZmlsZXMgYXJlIGFscmVhZHkgc3RhdGljYWxseSBsb2FkZWQgdmlhIHNjcmlwdCB0YWdzLCBkZWZlYXRpbmcgdGhlIHB1cnBvc2Ugb2YgdGhpcyBmcmFtZXdvcmsuKVxuLy9cbi8vIEhvd2V2ZXIsIHRoaXMgYXBwcm9hY2ggbGVhZHMgdG8gY29tcGxleGl0eTpcbi8vXG4vLyAtICAgIFRoZSBgYGRhdGEtY29tcG9uZW50YGAgYXR0cmlidXRlIG9mIGVhY2ggY29tcG9uZW50IG11c3QgYmUga2VwdCBpbiBzeW5jIHdpdGggdGhlIGtleXMgb2YgdGhlIGBgbW9kdWxlX21hcGBgIGJlbG93LlxuLy8gLSAgICBUaGUgdmFsdWVzIGluIHRoZSBgYG1vZHVsZV9tYXBgYCBtdXN0IGJlIGtlcHQgaW4gc3luYyB3aXRoIHRoZSBKYXZhU2NyaXB0IGZpbGVzIHdoaWNoIGltcGxlbWVudCBlYWNoIG9mIHRoZSBjb21wb25lbnRzLlxuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8gU3RhdGljIGltcG9ydHNcbi8vID09PT09PT09PT09PT09XG4vLyBUaGVzZSBpbXBvcnRzIGFyZSAod2UgYXNzdW1lKSBuZWVkZWQgYnkgYWxsIHBhZ2VzLiBIb3dldmVyLCBpdCB3b3VsZCBiZSBtdWNoIGJldHRlciB0byBsb2FkIHRoZXNlIGluIHRoZSBtb2R1bGVzIHRoYXQgYWN0dWFsbHkgdXNlIHRoZW0uXG4vL1xuLy8gVGhlc2UgYXJlIHN0YXRpYyBpbXBvcnRzOyBjb2RlIGluIGBkeW5hbWljYWxseSBsb2FkZWQgY29tcG9uZW50c2BfIGRlYWxzIHdpdGggZHluYW1pYyBpbXBvcnRzLlxuLy9cbi8vIGpRdWVyeS1yZWxhdGVkIGltcG9ydHMuXG5pbXBvcnQgXCJqcXVlcnktdWkvanF1ZXJ5LXVpLmpzXCI7XG5pbXBvcnQgXCJqcXVlcnktdWkvdGhlbWVzL2Jhc2UvanF1ZXJ5LnVpLmFsbC5jc3NcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy9qcXVlcnkuaWRsZS10aW1lci5qc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeV9pMThuL2pxdWVyeS5pMThuLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4uZW1pdHRlci5iaWRpLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4uZW1pdHRlci5qc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeV9pMThuL2pxdWVyeS5pMThuLmZhbGxiYWNrcy5qc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeV9pMThuL2pxdWVyeS5pMThuLm1lc3NhZ2VzdG9yZS5qc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeV9pMThuL2pxdWVyeS5pMThuLnBhcnNlci5qc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeV9pMThuL2pxdWVyeS5pMThuLmxhbmd1YWdlLmpzXCI7XG5cbi8vIEJvb3RzdHJhcFxuaW1wb3J0IFwiYm9vdHN0cmFwL2Rpc3QvanMvYm9vdHN0cmFwLmpzXCI7XG5pbXBvcnQgXCJib290c3RyYXAvZGlzdC9jc3MvYm9vdHN0cmFwLmNzc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL3Byb2plY3RfdGVtcGxhdGUvX3RlbXBsYXRlcy9wbHVnaW5fbGF5b3V0cy9zcGhpbnhfYm9vdHN0cmFwL3N0YXRpYy9ib290c3RyYXAtc3BoaW54LmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vY3NzL3J1bmVzdG9uZS1jdXN0b20tc3BoaW54LWJvb3RzdHJhcC5jc3NcIjtcblxuLy8gTWlzY1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL2Jvb2tmdW5jcy5qc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL3VzZXItaGlnaGxpZ2h0cy5qc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL3ByZXRleHQuanNcIjtcblxuLy8gVGhlc2UgYmVsb25nIGluIGR5bmFtaWMgaW1wb3J0cyBmb3IgdGhlIG9idmlvdXMgY29tcG9uZW50OyBob3dldmVyLCB0aGVzZSBjb21wb25lbnRzIGRvbid0IGluY2x1ZGUgYSBgYGRhdGEtY29tcG9uZW50YGAgYXR0cmlidXRlLlxuaW1wb3J0IFwiLi9ydW5lc3RvbmUvbWF0cml4ZXEvY3NzL21hdHJpeGVxLmNzc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvd2ViZ2xkZW1vL2Nzcy93ZWJnbGludGVyYWN0aXZlLmNzc1wiO1xuXG4vLyBUaGVzZSBhcmUgb25seSBuZWVkZWQgZm9yIHRoZSBSdW5lc3RvbmUgYm9vaywgYnV0IG5vdCBpbiBhIGxpYnJhcnkgbW9kZSAoc3VjaCBhcyBwcmV0ZXh0KS4gSSB3b3VsZCBwcmVmZXIgdG8gZHluYW1pY2FsbHkgbG9hZCB0aGVtLiBIb3dldmVyLCB0aGVzZSBzY3JpcHRzIGFyZSBzbyBzbWFsbCBJIGhhdmVuJ3QgYm90aGVyZWQgdG8gZG8gc28uXG5pbXBvcnQgeyBnZXRTd2l0Y2gsIHN3aXRjaFRoZW1lIH0gZnJvbSBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy90aGVtZS5qc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL3ByZXNlbnRlcl9tb2RlLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vY3NzL3ByZXNlbnRlcl9tb2RlLmNzc1wiO1xuXG4vLyBEeW5hbWljYWxseSBsb2FkZWQgY29tcG9uZW50c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRoaXMgcHJvdmlkZXMgYSBsaXN0IG9mIG1vZHVsZXMgdGhhdCBjb21wb25lbnRzIGNhbiBkeW5hbWljYWxseSBpbXBvcnQuIFdlYnBhY2sgd2lsbCBjcmVhdGUgYSBsaXN0IG9mIGltcG9ydHMgZm9yIGVhY2ggYmFzZWQgb24gaXRzIGFuYWx5c2lzLlxuY29uc3QgbW9kdWxlX21hcCA9IHtcbiAgICAvLyBXcmFwIGVhY2ggaW1wb3J0IGluIGEgZnVuY3Rpb24sIHNvIHRoYXQgaXQgd29uJ3Qgb2NjdXIgdW50aWwgdGhlIGZ1bmN0aW9uIGlzIGNhbGxlZC4gV2hpbGUgc29tZXRoaW5nIGNsZWFuZXIgd291bGQgYmUgbmljZSwgd2VicGFjayBjYW4ndCBhbmFseXplIHRoaW5ncyBsaWtlIGBgaW1wb3J0KGV4cHJlc3Npb24pYGAuXG4gICAgLy9cbiAgICAvLyBUaGUga2V5cyBtdXN0IG1hdGNoIHRoZSB2YWx1ZSBvZiBlYWNoIGNvbXBvbmVudCdzIGBgZGF0YS1jb21wb25lbnRgYCBhdHRyaWJ1dGUgLS0gdGhlIGBgcnVuZXN0b25lX2ltcG9ydGBgIGFuZCBgYHJ1bmVzdG9uZV9hdXRvX2ltcG9ydGBgIGZ1bmN0aW9ucyBhc3N1bWUgdGhpcy5cbiAgICBhY3RpdmVjb2RlOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9hY3RpdmVjb2RlL2pzL2FjZmFjdG9yeS5qc1wiKSxcbiAgICBibGU6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2NlbGxib3RpY3MvanMvYmxlLmpzXCIpLFxuICAgIC8vIEFsd2F5cyBpbXBvcnQgdGhlIHRpbWVkIHZlcnNpb24gb2YgYSBjb21wb25lbnQgaWYgYXZhaWxhYmxlLCBzaW5jZSB0aGUgdGltZWQgY29tcG9uZW50cyBhbHNvIGRlZmluZSB0aGUgY29tcG9uZW50J3MgZmFjdG9yeSBhbmQgaW5jbHVkZSB0aGUgY29tcG9uZW50IGFzIHdlbGwuIE5vdGUgdGhhdCBgYGFjZmFjdG9yeWBgIGltcG9ydHMgdGhlIHRpbWVkIGNvbXBvbmVudHMgb2YgQWN0aXZlQ29kZSwgc28gaXQgZm9sbG93cyB0aGlzIHBhdHRlcm4uXG4gICAgY2xpY2thYmxlYXJlYTogKCkgPT5cbiAgICAgICAgaW1wb3J0KFwiLi9ydW5lc3RvbmUvY2xpY2thYmxlQXJlYS9qcy90aW1lZGNsaWNrYWJsZS5qc1wiKSxcbiAgICBjb2RlbGVuczogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvY29kZWxlbnMvanMvY29kZWxlbnMuanNcIiksXG4gICAgZGF0YWZpbGU6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2RhdGFmaWxlL2pzL2RhdGFmaWxlLmpzXCIpLFxuICAgIGRyYWduZHJvcDogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvZHJhZ25kcm9wL2pzL3RpbWVkZG5kLmpzXCIpLFxuICAgIGZpbGxpbnRoZWJsYW5rOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9maXRiL2pzL3RpbWVkZml0Yi5qc1wiKSxcbiAgICBncm91cHN1YjogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvZ3JvdXBzdWIvanMvZ3JvdXBzdWIuanNcIiksXG4gICAga2hhbmV4OiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9raGFuZXgvanMva2hhbmV4LmpzXCIpLFxuICAgIGxwX2J1aWxkOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9scC9qcy9scC5qc1wiKSxcbiAgICBtdWx0aXBsZWNob2ljZTogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvbWNob2ljZS9qcy90aW1lZG1jLmpzXCIpLFxuICAgIGhwYXJzb25zOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9ocGFyc29ucy9qcy9ocGFyc29ucy1zcWwuanNcIiksXG4gICAgcGFyc29uczogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvcGFyc29ucy9qcy90aW1lZHBhcnNvbnMuanNcIiksXG4gICAgcG9sbDogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvcG9sbC9qcy9wb2xsLmpzXCIpLFxuICAgIHF1aXpseTogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvcXVpemx5L2pzL3F1aXpseS5qc1wiKSxcbiAgICByZXZlYWw6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3JldmVhbC9qcy9yZXZlYWwuanNcIiksXG4gICAgc2VsZWN0cXVlc3Rpb246ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3NlbGVjdHF1ZXN0aW9uL2pzL3NlbGVjdG9uZS5qc1wiKSxcbiAgICBzaG9ydGFuc3dlcjogKCkgPT5cbiAgICAgICAgaW1wb3J0KFwiLi9ydW5lc3RvbmUvc2hvcnRhbnN3ZXIvanMvdGltZWRfc2hvcnRhbnN3ZXIuanNcIiksXG4gICAgc2hvd2V2YWw6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3Nob3dldmFsL2pzL3Nob3dFdmFsLmpzXCIpLFxuICAgIHNpbXBsZV9zZW5zb3I6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2NlbGxib3RpY3MvanMvc2ltcGxlX3NlbnNvci5qc1wiKSxcbiAgICBzcHJlYWRzaGVldDogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvc3ByZWFkc2hlZXQvanMvc3ByZWFkc2hlZXQuanNcIiksXG4gICAgdGFiYmVkU3R1ZmY6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3RhYmJlZFN0dWZmL2pzL3RhYmJlZHN0dWZmLmpzXCIpLFxuICAgIHRpbWVkQXNzZXNzbWVudDogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvdGltZWQvanMvdGltZWQuanNcIiksXG4gICAgd2F2ZWRyb206ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3dhdmVkcm9tL2pzL3dhdmVkcm9tLmpzXCIpLFxuICAgIC8vIFRPRE86IHNpbmNlIHRoaXMgaXNuJ3QgaW4gYSBgYGRhdGEtY29tcG9uZW50YGAsIG5lZWQgdG8gdHJpZ2dlciBhbiBpbXBvcnQgb2YgdGhpcyBjb2RlIG1hbnVhbGx5LlxuICAgIHdlYndvcms6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3dlYndvcmsvanMvd2Vid29yay5qc1wiKSxcbiAgICB5b3V0dWJlOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS92aWRlby9qcy9ydW5lc3RvbmV2aWRlby5qc1wiKSxcbn07XG5cbi8vIC4uIF9keW5hbWljIGltcG9ydCBtYWNoaW5lcnk6XG4vL1xuLy8gRHluYW1pYyBpbXBvcnQgbWFjaGluZXJ5XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEZ1bGZpbGwgYSBwcm9taXNlIHdoZW4gdGhlIFJ1bmVzdG9uZSBwcmUtbG9naW4gY29tcGxldGUgZXZlbnQgb2NjdXJzLlxubGV0IHByZV9sb2dpbl9jb21wbGV0ZV9wcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+XG4gICAgJChkb2N1bWVudCkuYmluZChcInJ1bmVzdG9uZTpwcmUtbG9naW4tY29tcGxldGVcIiwgcmVzb2x2ZSlcbik7XG5sZXQgbG9hZGVkQ29tcG9uZW50cztcbi8vIFByb3ZpZGUgYSBzaW1wbGUgZnVuY3Rpb24gdG8gaW1wb3J0IHRoZSBKUyBmb3IgYWxsIGNvbXBvbmVudHMgb24gdGhlIHBhZ2UuXG5leHBvcnQgZnVuY3Rpb24gcnVuZXN0b25lX2F1dG9faW1wb3J0KCkge1xuICAgIC8vIENyZWF0ZSBhIHNldCBvZiBgYGRhdGEtY29tcG9uZW50YGAgdmFsdWVzLCB0byBhdm9pZCBkdXBsaWNhdGlvbi5cbiAgICBjb25zdCBzID0gbmV3IFNldChcbiAgICAgICAgLy8gQWxsIFJ1bmVzdG9uZSBjb21wb25lbnRzIGhhdmUgYSBgYGRhdGEtY29tcG9uZW50YGAgYXR0cmlidXRlLlxuICAgICAgICAkKFwiW2RhdGEtY29tcG9uZW50XVwiKVxuICAgICAgICAgICAgLm1hcChcbiAgICAgICAgICAgICAgICAvLyBFeHRyYWN0IHRoZSB2YWx1ZSBvZiB0aGUgZGF0YS1jb21wb25lbnQgYXR0cmlidXRlLlxuICAgICAgICAgICAgICAgIChpbmRleCwgZWxlbWVudCkgPT4gJChlbGVtZW50KS5hdHRyKFwiZGF0YS1jb21wb25lbnRcIilcbiAgICAgICAgICAgICAgICAvLyBTd2l0Y2ggZnJvbSBhIGpRdWVyeSBvYmplY3QgYmFjayB0byBhbiBhcnJheSwgcGFzc2luZyB0aGF0IHRvIHRoZSBTZXQgY29uc3RydWN0b3IuXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuZ2V0KClcbiAgICApO1xuXG4gICAgLy8gTG9hZCBKUyBmb3IgZWFjaCBvZiB0aGUgY29tcG9uZW50cyBmb3VuZC5cbiAgICBjb25zdCBhID0gWy4uLnNdLm1hcCgodmFsdWUpID0+XG4gICAgICAgIC8vIElmIHRoZXJlJ3Mgbm8gSlMgZm9yIHRoaXMgY29tcG9uZW50LCByZXR1cm4gYW4gZW1wdHkgUHJvbWlzZS5cbiAgICAgICAgKG1vZHVsZV9tYXBbdmFsdWVdIHx8ICgoKSA9PiBQcm9taXNlLnJlc29sdmUoKSkpKClcbiAgICApO1xuXG4gICAgLy8gU2VuZCB0aGUgUnVuZXN0b25lIGxvZ2luIGNvbXBsZXRlIGV2ZW50IHdoZW4gYWxsIEpTIGlzIGxvYWRlZCBhbmQgdGhlIHByZS1sb2dpbiBpcyBhbHNvIGNvbXBsZXRlLlxuICAgIFByb21pc2UuYWxsKFtwcmVfbG9naW5fY29tcGxldGVfcHJvbWlzZSwgLi4uYV0pLnRoZW4oKCkgPT5cbiAgICAgICAgJChkb2N1bWVudCkudHJpZ2dlcihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiKVxuICAgICk7XG59XG5cbi8vIExvYWQgY29tcG9uZW50IEpTIHdoZW4gdGhlIGRvY3VtZW50IGlzIHJlYWR5LlxuJChkb2N1bWVudCkucmVhZHkocnVuZXN0b25lX2F1dG9faW1wb3J0KTtcblxuLy8gUHJvdmlkZSBhIGZ1bmN0aW9uIHRvIGltcG9ydCBvbmUgc3BlY2lmaWMgUnVuZXN0b25lIGNvbXBvbmVudC5cbi8vIHRoZSBpbXBvcnQgZnVuY3Rpb24gaW5zaWRlIG1vZHVsZV9tYXAgaXMgYXN5bmMgLS0gcnVuZXN0b25lX2ltcG9ydFxuLy8gc2hvdWxkIGJlIGF3YWl0ZWQgd2hlbiBuZWNlc3NhcnkgdG8gZW5zdXJlIHRoZSBpbXBvcnQgY29tcGxldGVzXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcnVuZXN0b25lX2ltcG9ydChjb21wb25lbnRfbmFtZSkge1xuICAgIHJldHVybiBtb2R1bGVfbWFwW2NvbXBvbmVudF9uYW1lXSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBwb3B1cFNjcmF0Y2hBQygpIHtcbiAgICAvLyBsb2FkIHRoZSBhY3RpdmVjb2RlIGJ1bmRsZVxuICAgIGF3YWl0IHJ1bmVzdG9uZV9pbXBvcnQoXCJhY3RpdmVjb2RlXCIpO1xuICAgIC8vIHNjcmF0Y2hEaXYgd2lsbCBiZSBkZWZpbmVkIGlmIHdlIGhhdmUgYWxyZWFkeSBjcmVhdGVkIGEgc2NyYXRjaFxuICAgIC8vIGFjdGl2ZWNvZGUuICBJZiBpdHMgbm90IGRlZmluZWQgdGhlbiB3ZSBuZWVkIHRvIGdldCBpdCByZWFkeSB0byB0b2dnbGVcbiAgICBpZiAoIWVCb29rQ29uZmlnLnNjcmF0Y2hEaXYpIHtcbiAgICAgICAgd2luZG93LkFDRmFjdG9yeS5jcmVhdGVTY3JhdGNoQWN0aXZlY29kZSgpO1xuICAgICAgICBsZXQgZGl2aWQgPSBlQm9va0NvbmZpZy5zY3JhdGNoRGl2O1xuICAgICAgICB3aW5kb3cuZWRMaXN0W2RpdmlkXSA9IEFDRmFjdG9yeS5jcmVhdGVBY3RpdmVDb2RlKFxuICAgICAgICAgICAgJChgIyR7ZGl2aWR9YClbMF0sXG4gICAgICAgICAgICBlQm9va0NvbmZpZy5hY0RlZmF1bHRMYW5ndWFnZVxuICAgICAgICApO1xuICAgICAgICBpZiAoZUJvb2tDb25maWcuaXNMb2dnZWRJbikge1xuICAgICAgICAgICAgd2luZG93LmVkTGlzdFtkaXZpZF0uZW5hYmxlU2F2ZUxvYWQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB3aW5kb3cuQUNGYWN0b3J5LnRvZ2dsZVNjcmF0Y2hBY3RpdmVjb2RlKCk7XG59XG5cbi8vIFNldCB0aGUgZGlyZWN0b3J5IGNvbnRhaW5pbmcgdGhpcyBzY3JpcHQgYXMgdGhlIGBwYXRoIDxodHRwczovL3dlYnBhY2suanMub3JnL2d1aWRlcy9wdWJsaWMtcGF0aC8jb24tdGhlLWZseT5gXyBmb3IgYWxsIHdlYnBhY2tlZCBzY3JpcHRzLlxuY29uc3Qgc2NyaXB0X3NyYyA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuX193ZWJwYWNrX3B1YmxpY19wYXRoX18gPSBzY3JpcHRfc3JjLnN1YnN0cmluZyhcbiAgICAwLFxuICAgIHNjcmlwdF9zcmMubGFzdEluZGV4T2YoXCIvXCIpICsgMVxuKTtcblxuLy8gTWFudWFsIGV4cG9ydHNcbi8vID09PT09PT09PT09PT09XG4vLyBXZWJwYWNrJ3MgYGBvdXRwdXQubGlicmFyeWBgIHNldHRpbmcgZG9lc24ndCBzZWVtIHRvIHdvcmsgd2l0aCB0aGUgc3BsaXQgY2h1bmtzIHBsdWdpbjsgZG8gYWxsIGV4cG9ydHMgbWFudWFsbHkgdGhyb3VnaCB0aGUgYGB3aW5kb3dgYCBvYmplY3QgaW5zdGVhZC5cbmNvbnN0IHJjID0ge307XG5yYy5ydW5lc3RvbmVfaW1wb3J0ID0gcnVuZXN0b25lX2ltcG9ydDtcbnJjLnJ1bmVzdG9uZV9hdXRvX2ltcG9ydCA9IHJ1bmVzdG9uZV9hdXRvX2ltcG9ydDtcbnJjLmdldFN3aXRjaCA9IGdldFN3aXRjaDtcbnJjLnN3aXRjaFRoZW1lID0gc3dpdGNoVGhlbWU7XG5yYy5wb3B1cFNjcmF0Y2hBQyA9IHBvcHVwU2NyYXRjaEFDO1xud2luZG93LnJ1bmVzdG9uZUNvbXBvbmVudHMgPSByYztcbiIsIm1vZHVsZS5leHBvcnRzID0galF1ZXJ5OyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==