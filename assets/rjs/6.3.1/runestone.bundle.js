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
                /.*(index.html|toctree.html|Exercises.html|search.html)$/i
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
    console.log(`This page served by ${eBookConfig.served_by}`);
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
        let bw = document.getElementById("browsing_warning");
        if (bw) {
            bw.innerHTML =
                "<p class='navbar_message'>Saving and Logging are Disabled</p>";
        }
        let aw = document.getElementById("ad_warning");
        if (aw) {
            aw.innerHTML =
                "<p class='navbar_message'>🚫 Log-in to Remove <a href='/runestone/default/ads'>Ads!</a> 🚫 &nbsp;</p>";
        }
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
$(document).on("runestone:login", setupNavbarLoggedIn);

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
$(document).on("runestone:logout", setupNavbarLoggedOut);

function notifyRunestoneComponents() {
    // Runestone components wait until login process is over to load components because of storage issues. This triggers the `dynamic import machinery`, which then sends the login complete signal when this and all dynamic imports are finished.
    $(document).trigger("runestone:pre-login-complete");
}

function placeAdCopy() {
    if (typeof showAd !== "undefined" && showAd) {
        let adNum = Math.floor(Math.random() * 2) + 1;
        let adBlock = document.getElementById(`adcopy_${adNum}`);
        let rsElements = document.querySelectorAll(".runestone");
        if (rsElements.length > 0) {
            let randomIndex = Math.floor(Math.random() * rsElements.length);
            rsElements[randomIndex].after(adBlock)
            adBlock.style.display = "block";
        }
    }
}

// initialize stuff
$(function () {
    if (eBookConfig) {
        handlePageSetup();
        placeAdCopy();
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

    // re-write some urls
    // This is tricker than it looks and you have to obey the rules for # anchors
    // The #anchors must come after the query string as the server basically ignores any part
    // of a url that comes after # - like a comment...
    if (location.href.includes("mode=browsing")) {
        let queryString = "?mode=browsing";
        document.querySelectorAll("a").forEach((link) => {
            let anchorText = "";
            if (link.href.includes("books/published") && ! link.href.includes("?mode=browsing")) {
                if (link.href.includes("#")) {
                    let aPoint = link.href.indexOf("#");
                    anchorText = link.href.substring(aPoint);
                    link.href = link.href.substring(0,aPoint);
                }
                link.href = link.href.includes("?")
                    ? link.href + queryString.replace("?", "&") + anchorText
                    : link.href + queryString + anchorText;
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

$(document).on("runestone:login-complete", function () {
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
    if (!eBookConfig.isInstructor) {
        $(".commentary").hide();
    }
}

window.addEventListener("load", function () {
    console.log("setting up pretext");
    setupPTXEvents();
    let wrap = document.getElementById("primary-navbar-sticky-wrapper");
    if (wrap) {
        wrap.style.overflow="visible";
    }
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
        this.mjelements = [];
        let self = this;
        this.mjReady = new Promise(function(resolve, reject) {
            self.mjresolver = resolve;
        });
        this.aQueue = new AutoQueue();
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
        if (typeof(this.percent) === "number") {
            eventInfo.percent = this.percent;
        }
        if (
            eBookConfig.isLoggedIn &&
            eBookConfig.useRunestoneServices &&
            eBookConfig.logLevel > 0
        ) {
            post_return = this.postLogMessage(eventInfo);
        }
        if (!this.isTimed || eBookConfig.debug) {
            let prefix = eBookConfig.isLoggedIn ? "Save" : "Not";
            console.log(`${prefix} logging event ` + JSON.stringify(eventInfo));
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
            `${eBookConfig.new_server_prefix}/logger/bookevent`, {
                method: "POST",
                headers: this.jsonHeaders,
                body: JSON.stringify(eventInfo),
            }
        );
        try {
            var response = await fetch(request);
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
            post_return = await response.json();
        } catch (e) {
            let detail = "none";
            if (post_return && post_return.detail) {
                detail = post_return.detail;
            }
            if (eBookConfig.loginRequired) {
                alert(`Error: Your action was not saved!
                    The error was ${e}
                    Status Code: ${response.status}
                    Detail: ${detail}.
                    Please report this error!`);
            }
            // send a request to save this error
            console.log(`Error: ${e} Detail: ${detail} Status Code: ${response.status}`);
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
        if (
            eBookConfig.isLoggedIn &&
            eBookConfig.useRunestoneServices &&
            eBookConfig.logLevel > 0
        ) {
            let request = new Request(
                `${eBookConfig.new_server_prefix}/logger/runlog`, {
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
        this.checkServerComplete = new Promise(function(resolve, reject) {
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
                    `${eBookConfig.new_server_prefix}/assessment/results`, {
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
                        this.attempted = true;
                        if (typeof(data.correct) !== "undefined") {
                            this.correct = data.correct;
                        } else {
                            this.correct = null;
                        }
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
        if (typeof(MathJax) === "undefined") {
            console.log("Error -- MathJax is not loaded")
            return Promise.resolve(null);
        } else {
            // See - https://docs.mathjax.org/en/latest/advanced/typeset.html
            // Per the above we should keep track of the promises and only call this
            // a second time if all previous promises have resolved.
            // Create a queue of components
            // should wait until defaultPageReady is defined
            // If defaultPageReady is not defined then just enqueue the components.
            // Once defaultPageReady is defined
            if (MathJax.typesetPromise) {
                return this.mjresolver(this.aQueue.enqueue(component))
            } else {
                console.log(`Waiting on MathJax!! ${MathJax.typesetPromise}`);
                setTimeout(() => this.queueMathJax(component), 200);
                console.log(`Returning mjready promise: ${this.mjReady}`)
                return this.mjReady;
            }
        }
    }

    decorateStatus() {
        let rsDiv = $(this.containerDiv).closest("div.runestone")[0];
        if (this.correct) {
            rsDiv.classList.add("isCorrect");
        } else {
            if (this.correct === null) {
                rsDiv.classList.add("notAnswered");
            } else {
                rsDiv.classList.add("isInCorrect");
            }
        }
    }

}


// Inspiration and lots of code for this solution come from
// https://stackoverflow.com/questions/53540348/js-async-await-tasks-queue
// The idea here is that until MathJax is ready we can just enqueue things
// once mathjax becomes ready then we can drain the queue and continue as usual.

class Queue {
    constructor() { this._items = []; }
    enqueue(item) { this._items.push(item); }
    dequeue() { return this._items.shift(); }
    get size() { return this._items.length; }
}

class AutoQueue extends Queue {
    constructor() {
        super();
        this._pendingPromise = false;
    }

    enqueue(component) {
        return new Promise((resolve, reject) => {
            super.enqueue({ component, resolve, reject });
            this.dequeue();
        });
    }

    async dequeue() {
        if (this._pendingPromise) return false;

        let item = super.dequeue();

        if (!item) return false;

        try {
            this._pendingPromise = true;

            let payload = await MathJax.startup.defaultPageReady().then(
                async function() {
                    console.log(`MathJax Ready -- dequeing a typesetting run for ${item.component.id}`)
                    return await MathJax.typesetPromise([item.component])
                }
            );

                this._pendingPromise = false; item.resolve(payload);
            }
            catch (e) {
                this._pendingPromise = false;
                item.reject(e);
            } finally {
                this.dequeue();
            }

            return true;
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
    var data = {
        lastPageUrl: currentPathname,
        isPtxBook: isPreTeXt()
     };
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
                $("#scprogresscontainer").append(
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
        jQuery.get(
            `${eBookConfig.new_server_prefix}/logger/getAllCompletionStatus`,
            function (data) {
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
            }
        );
        var data = { course: eBookConfig.course };
        jQuery.get(
            `${eBookConfig.new_server_prefix}/logger/getlastpage`,
            data,
            function (data) {
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
            }
        );
    }
}

function enableCompletions() {
    getCompletions();
    showLastPositionBanner();
    addNavigationAndCompletionButtons();
    decorateTableOfContents();
}

// call enable user highlights after login
$(document).on("runestone:login", enableCompletions);

function isPreTeXt() {
    let ptxMarker = document.querySelector("body.pretext");
    if (ptxMarker) {
        return true;
    } else {
        return false;
    }
}
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
    // Is this a ptx book?
    let isPtxBook = isPreTeXt()
    var data = {
        lastPageUrl: currentPathname,
        lastPageScrollLocation: $(window).scrollTop(),
        completionFlag: completionFlag,
        course: eBookConfig.course,
        isPtxBook: isPtxBook,
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
    hparsons: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_handsontable_es_index_js-node_modules_handsontable_dist_handsontable_ful-dcc440"), __webpack_require__.e("vendors-node_modules_micro-parsons_micro-parsons_micro-parsons_js-node_modules_micro-parsons_-974bff"), __webpack_require__.e("node_modules_moment_locale_sync_recursive_-runestone_hparsons_js_hparsons_js-node_modules_mic-5ea6d2")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/hparsons/js/hparsons.js */ 58722)),
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
    timedAssessment: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_handsontable_es_index_js-node_modules_handsontable_dist_handsontable_ful-dcc440"), __webpack_require__.e("vendors-node_modules_codemirror_mode_clike_clike_js-node_modules_codemirror_mode_javascript_j-f062af"), __webpack_require__.e("vendors-node_modules_codemirror_addon_edit_matchbrackets_js-node_modules_codemirror_addon_hin-ab90ac"), __webpack_require__.e("runestone_codelens_js_pytutor-embed_bundle_js"), __webpack_require__.e("node_modules_moment_locale_sync_recursive_-runestone_activecode_js_acfactory_js-node_modules_-ef73b3"), __webpack_require__.e("runestone_parsons_js_timedparsons_js"), __webpack_require__.e("runestone_fitb_js_timedfitb_js"), __webpack_require__.e("runestone_dragndrop_js_timeddnd_js"), __webpack_require__.e("runestone_mchoice_js_timedmc_js"), __webpack_require__.e("runestone_selectquestion_js_selectone_js"), __webpack_require__.e("runestone_clickableArea_js_timedclickable_js"), __webpack_require__.e("runestone_shortanswer_js_timed_shortanswer_js"), __webpack_require__.e("runestone_timed_js_timed_js-runestone_clickableArea_css_clickable_css-runestone_dragndrop_css-8bfd54")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/timed/js/timed.js */ 58707)),
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
    $(document).on("runestone:pre-login-complete", resolve)
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
    // webwork questions are not wrapped in div with a data-component so we have to check a different way
    if (document.querySelector(".webwork-button")) {
        s.add("webwork");
    }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDQUFDOzs7Ozs7Ozs7OztBQ3ZVRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBZ0M7QUFDaEM7OztBQUdBO0FBQ0E7QUFDQSxFQUFFOzs7QUFHRjtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBOztBQUVBO0FBQ0EsZ0NBQWdDOztBQUVoQztBQUNBLGdDQUFnQzs7QUFFaEM7Ozs7QUFJQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0QkFBNEI7O0FBRTVCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4RUFBOEU7QUFDOUU7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOzs7QUFHRjs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7O0FDdlNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDLHFEQUFxRDtBQUNyRCx1REFBdUQ7O0FBRXZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7O0FBRXhDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBLFdBQVcsbUJBQW1CO0FBQzlCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsdUNBQXVDO0FBQ3ZDLHdDQUF3Qzs7QUFFeEM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7QUNyVEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0QsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtB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RCxrQkFBa0Isd0tBQXlDO0FBQzNELDBCQUEwQixzUkFBb0Q7QUFDOUU7QUFDQSxRQUFRLDBSQUF5RDtBQUNqRSxvQkFBb0IsK0tBQTZDO0FBQ2pFLHlCQUF5Qiw4TEFBb0Q7QUFDN0UsdUJBQXVCLG1UQUFtRDtBQUMxRSx1QkFBdUIsNExBQW1EO0FBQzFFLDJCQUEyQixnd0NBQXVDO0FBQ2xFLG9CQUFvQiw2U0FBNkM7QUFDakU7QUFDQSxtQkFBbUIsNEtBQTJDO0FBQzlELG1CQUFtQixzTEFBZ0Q7QUFDbkU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLE1BQU07QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMkZBQTJGO0FBQzNGO0FBQ0E7QUFDQTtBQUNBLGVBQWUscUVBQVM7QUFDeEIsaUJBQWlCLHVFQUFXO0FBQzVCO0FBQ0E7Ozs7Ozs7Ozs7OztBQy9LQSIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2Nzcy9wcmVzZW50ZXJfbW9kZS5jc3MiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vY3NzL3J1bmVzdG9uZS1jdXN0b20tc3BoaW54LWJvb3RzdHJhcC5jc3MiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vY3NzL3VzZXItaGlnaGxpZ2h0cy5jc3MiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9tYXRyaXhlcS9jc3MvbWF0cml4ZXEuY3NzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvd2ViZ2xkZW1vL2Nzcy93ZWJnbGludGVyYWN0aXZlLmNzcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9ib29rZnVuY3MuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5LmlkbGUtdGltZXIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4uZW1pdHRlci5iaWRpLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeV9pMThuL2pxdWVyeS5pMThuLmVtaXR0ZXIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4uZmFsbGJhY2tzLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeV9pMThuL2pxdWVyeS5pMThuLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeV9pMThuL2pxdWVyeS5pMThuLmxhbmd1YWdlLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeV9pMThuL2pxdWVyeS5pMThuLm1lc3NhZ2VzdG9yZS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9qcXVlcnlfaTE4bi9qcXVlcnkuaTE4bi5wYXJzZXIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvcHJlc2VudGVyX21vZGUuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvcHJldGV4dC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL3RoZW1lLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL3VzZXItaGlnaGxpZ2h0cy5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9wcm9qZWN0X3RlbXBsYXRlL190ZW1wbGF0ZXMvcGx1Z2luX2xheW91dHMvc3BoaW54X2Jvb3RzdHJhcC9zdGF0aWMvYm9vdHN0cmFwLXNwaGlueC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vd2VicGFjay5pbmRleC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzL2V4dGVybmFsIHZhciBcImpRdWVyeVwiIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8qKlxuICpcbiAqIFVzZXI6IGJtaWxsZXJcbiAqIE9yaWdpbmFsOiAyMDExLTA0LTIwXG4gKiBEYXRlOiAyMDE5LTA2LTE0XG4gKiBUaW1lOiAyOjAxIFBNXG4gKiBUaGlzIGNoYW5nZSBtYXJrcyB0aGUgYmVnaW5uaW5nIG9mIHZlcnNpb24gNC4wIG9mIHRoZSBydW5lc3RvbmUgY29tcG9uZW50c1xuICogTG9naW4vbG9nb3V0IGlzIG5vIGxvbmdlciBoYW5kbGVkIHRocm91Z2ggamF2YXNjcmlwdCBidXQgcmF0aGVyIHNlcnZlciBzaWRlLlxuICogTWFueSBvZiB0aGUgY29tcG9uZW50cyBkZXBlbmQgb24gdGhlIHJ1bmVzdG9uZTpsb2dpbiBldmVudCBzbyB3ZSB3aWxsIGtlZXAgdGhhdFxuICogZm9yIG5vdyB0byBrZWVwIHRoZSBjaHVybiBmYWlybHkgbWluaW1hbC5cbiAqL1xuXG4vKlxuXG4gQ29weXJpZ2h0IChDKSAyMDExICBCcmFkIE1pbGxlciAgYm9uZWxha2VAZ21haWwuY29tXG5cbiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4gVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiAqL1xuXG4vL1xuLy8gUGFnZSBkZWNvcmF0aW9uIGZ1bmN0aW9uc1xuLy9cblxuZnVuY3Rpb24gYWRkUmVhZGluZ0xpc3QoKSB7XG4gICAgaWYgKGVCb29rQ29uZmlnLnJlYWRpbmdzKSB7XG4gICAgICAgIHZhciBsLCBueHQsIHBhdGhfcGFydHMsIG54dF9saW5rO1xuICAgICAgICBsZXQgY3VyX3BhdGhfcGFydHMgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoXCIvXCIpO1xuICAgICAgICBsZXQgbmFtZSA9XG4gICAgICAgICAgICBjdXJfcGF0aF9wYXJ0c1tjdXJfcGF0aF9wYXJ0cy5sZW5ndGggLSAyXSArXG4gICAgICAgICAgICBcIi9cIiArXG4gICAgICAgICAgICBjdXJfcGF0aF9wYXJ0c1tjdXJfcGF0aF9wYXJ0cy5sZW5ndGggLSAxXTtcbiAgICAgICAgbGV0IHBvc2l0aW9uID0gZUJvb2tDb25maWcucmVhZGluZ3MuaW5kZXhPZihuYW1lKTtcbiAgICAgICAgbGV0IG51bV9yZWFkaW5ncyA9IGVCb29rQ29uZmlnLnJlYWRpbmdzLmxlbmd0aDtcbiAgICAgICAgaWYgKHBvc2l0aW9uID09IGVCb29rQ29uZmlnLnJlYWRpbmdzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIC8vIG5vIG1vcmUgcmVhZGluZ3NcbiAgICAgICAgICAgIGwgPSAkKFwiPGRpdiAvPlwiLCB7XG4gICAgICAgICAgICAgICAgdGV4dDogYEZpbmlzaGVkIHJlYWRpbmcgYXNzaWdubWVudC4gUGFnZSAke251bV9yZWFkaW5nc30gb2YgJHtudW1fcmVhZGluZ3N9LmAsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChwb3NpdGlvbiA+PSAwKSB7XG4gICAgICAgICAgICAvLyBnZXQgbmV4dCBuYW1lXG4gICAgICAgICAgICBueHQgPSBlQm9va0NvbmZpZy5yZWFkaW5nc1twb3NpdGlvbiArIDFdO1xuICAgICAgICAgICAgcGF0aF9wYXJ0cyA9IGN1cl9wYXRoX3BhcnRzLnNsaWNlKDAsIGN1cl9wYXRoX3BhcnRzLmxlbmd0aCAtIDIpO1xuICAgICAgICAgICAgcGF0aF9wYXJ0cy5wdXNoKG54dCk7XG4gICAgICAgICAgICBueHRfbGluayA9IHBhdGhfcGFydHMuam9pbihcIi9cIik7XG4gICAgICAgICAgICBsID0gJChcIjxhIC8+XCIsIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcImxpbmtcIixcbiAgICAgICAgICAgICAgICBjbGFzczogXCJidG4gYnRuLWxnICcgKyAnYnV0dG9uQ29uZmlybUNvbXBsZXRpb24nXCIsXG4gICAgICAgICAgICAgICAgaHJlZjogbnh0X2xpbmssXG4gICAgICAgICAgICAgICAgdGV4dDogYENvbnRpbnVlIHRvIHBhZ2UgJHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24gKyAyXG4gICAgICAgICAgICAgICAgfSBvZiAke251bV9yZWFkaW5nc30gaW4gdGhlIHJlYWRpbmcgYXNzaWdubWVudC5gLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsID0gJChcIjxkaXYgLz5cIiwge1xuICAgICAgICAgICAgICAgIHRleHQ6IFwiVGhpcyBwYWdlIGlzIG5vdCBwYXJ0IG9mIHRoZSBsYXN0IHJlYWRpbmcgYXNzaWdubWVudCB5b3UgdmlzaXRlZC5cIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgICQoXCIjbWFpbi1jb250ZW50XCIpLmFwcGVuZChsKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHRpbWVkUmVmcmVzaCgpIHtcbiAgICB2YXIgdGltZW91dFBlcmlvZCA9IDkwMDAwMDsgLy8gNzUgbWludXRlc1xuICAgICQoZG9jdW1lbnQpLm9uKFwiaWRsZS5pZGxlVGltZXJcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBBZnRlciB0aW1lb3V0IHBlcmlvZCBzZW5kIHRoZSB1c2VyIGJhY2sgdG8gdGhlIGluZGV4LiAgVGhpcyB3aWxsIGZvcmNlIGEgbG9naW5cbiAgICAgICAgLy8gaWYgbmVlZGVkIHdoZW4gdGhleSB3YW50IHRvIGdvIHRvIGEgcGFydGljdWxhciBwYWdlLiAgVGhpcyBtYXkgbm90IGJlIHBlcmZlY3RcbiAgICAgICAgLy8gYnV0IGl0cyBhbiBlYXN5IHdheSB0byBtYWtlIHN1cmUgbGFwdG9wIHVzZXJzIGFyZSBwcm9wZXJseSBsb2dnZWQgaW4gd2hlbiB0aGV5XG4gICAgICAgIC8vIHRha2UgcXVpenplcyBhbmQgc2F2ZSBzdHVmZi5cbiAgICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5kZXhPZihcImluZGV4Lmh0bWxcIikgPCAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIklkbGUgdGltZXIgLSBcIiArIGxvY2F0aW9uLnBhdGhuYW1lKTtcbiAgICAgICAgICAgIGxvY2F0aW9uLmhyZWYgPVxuICAgICAgICAgICAgICAgIGVCb29rQ29uZmlnLmFwcCArXG4gICAgICAgICAgICAgICAgXCIvZGVmYXVsdC91c2VyL2xvZ2luP19uZXh0PVwiICtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5wYXRobmFtZSArXG4gICAgICAgICAgICAgICAgbG9jYXRpb24uc2VhcmNoO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgJC5pZGxlVGltZXIodGltZW91dFBlcmlvZCk7XG59XG5cbmNsYXNzIFBhZ2VQcm9ncmVzc0JhciB7XG4gICAgY29uc3RydWN0b3IoYWN0RGljdCkge1xuICAgICAgICB0aGlzLnBvc3NpYmxlID0gMDtcbiAgICAgICAgdGhpcy50b3RhbCA9IDE7XG4gICAgICAgIGlmIChhY3REaWN0ICYmIE9iamVjdC5rZXlzKGFjdERpY3QpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZpdGllcyA9IGFjdERpY3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgYWN0aXZpdGllcyA9IHsgcGFnZTogMCB9O1xuICAgICAgICAgICAgJChcIi5ydW5lc3RvbmVcIikuZWFjaChmdW5jdGlvbiAoaWR4LCBlKSB7XG4gICAgICAgICAgICAgICAgYWN0aXZpdGllc1tlLmZpcnN0RWxlbWVudENoaWxkLmlkXSA9IDA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZpdGllcyA9IGFjdGl2aXRpZXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVQcm9ncmVzcygpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUubWF0Y2goXG4gICAgICAgICAgICAgICAgLy4qKGluZGV4Lmh0bWx8dG9jdHJlZS5odG1sfEV4ZXJjaXNlcy5odG1sfHNlYXJjaC5odG1sKSQvaVxuICAgICAgICAgICAgKVxuICAgICAgICApIHtcbiAgICAgICAgICAgICQoXCIjc2Nwcm9ncmVzc2NvbnRhaW5lclwiKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW5kZXJQcm9ncmVzcygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZVByb2dyZXNzKCkge1xuICAgICAgICBmb3IgKGxldCBrIGluIHRoaXMuYWN0aXZpdGllcykge1xuICAgICAgICAgICAgaWYgKGsgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucG9zc2libGUrKztcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hY3Rpdml0aWVzW2tdID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyUHJvZ3Jlc3MoKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IDA7XG4gICAgICAgICQoXCIjc2Nwcm9ncmVzc3RvdGFsXCIpLnRleHQodGhpcy50b3RhbCk7XG4gICAgICAgICQoXCIjc2Nwcm9ncmVzc3Bvc3NcIikudGV4dCh0aGlzLnBvc3NpYmxlKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhbHVlID0gKDEwMCAqIHRoaXMudG90YWwpIC8gdGhpcy5wb3NzaWJsZTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFsdWUgPSAwO1xuICAgICAgICB9XG4gICAgICAgICQoXCIjc3ViY2hhcHRlcnByb2dyZXNzXCIpLnByb2dyZXNzYmFyKHtcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghZUJvb2tDb25maWcuaXNMb2dnZWRJbikge1xuICAgICAgICAgICAgJChcIiNzdWJjaGFwdGVycHJvZ3Jlc3M+ZGl2XCIpLmFkZENsYXNzKFwibG9nZ2Vkb3V0XCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlUHJvZ3Jlc3MoZGl2X2lkKSB7XG4gICAgICAgIHRoaXMuYWN0aXZpdGllc1tkaXZfaWRdKys7XG4gICAgICAgIC8vIE9ubHkgdXBkYXRlIHRoZSBwcm9ncmVzcyBiYXIgb24gdGhlIGZpcnN0IGludGVyYWN0aW9uIHdpdGggYW4gb2JqZWN0LlxuICAgICAgICBpZiAodGhpcy5hY3Rpdml0aWVzW2Rpdl9pZF0gPT09IDEpIHtcbiAgICAgICAgICAgIHRoaXMudG90YWwrKztcbiAgICAgICAgICAgIGxldCB2YWwgPSAoMTAwICogdGhpcy50b3RhbCkgLyB0aGlzLnBvc3NpYmxlO1xuICAgICAgICAgICAgJChcIiNzY3Byb2dyZXNzdG90YWxcIikudGV4dCh0aGlzLnRvdGFsKTtcbiAgICAgICAgICAgICQoXCIjc2Nwcm9ncmVzc3Bvc3NcIikudGV4dCh0aGlzLnBvc3NpYmxlKTtcbiAgICAgICAgICAgICQoXCIjc3ViY2hhcHRlcnByb2dyZXNzXCIpLnByb2dyZXNzYmFyKFwib3B0aW9uXCIsIFwidmFsdWVcIiwgdmFsKTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB2YWwgPT0gMTAwLjAgJiZcbiAgICAgICAgICAgICAgICAkKFwiI2NvbXBsZXRpb25CdXR0b25cIikudGV4dCgpLnRvTG93ZXJDYXNlKCkgPT09XG4gICAgICAgICAgICAgICAgICAgIFwibWFyayBhcyBjb21wbGV0ZWRcIlxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgJChcIiNjb21wbGV0aW9uQnV0dG9uXCIpLmNsaWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB2YXIgcGFnZVByb2dyZXNzVHJhY2tlciA9IHt9O1xuXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVQYWdlU2V0dXAoKSB7XG4gICAgdmFyIG1lc3M7XG4gICAgaWYgKGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoe1xuICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIsXG4gICAgICAgICAgICBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IGRhdGEgPSB7IHRpbWV6b25lb2Zmc2V0OiBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCB9O1xuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2xvZ2dlci9zZXRfdHpfb2Zmc2V0YCxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gc2V0IHRpbWV6b25lISAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBzZXR0aW5nIHRpbWV6b25lICR7ZX1gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhgVGhpcyBwYWdlIHNlcnZlZCBieSAke2VCb29rQ29uZmlnLnNlcnZlZF9ieX1gKTtcbiAgICBpZiAoZUJvb2tDb25maWcuaXNMb2dnZWRJbikge1xuICAgICAgICBtZXNzID0gYHVzZXJuYW1lOiAke2VCb29rQ29uZmlnLnVzZXJuYW1lfWA7XG4gICAgICAgIGlmICghZUJvb2tDb25maWcuaXNJbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICAkKFwiI2lwX2Ryb3Bkb3duX2xpbmtcIikucmVtb3ZlKCk7XG4gICAgICAgICAgICAkKFwiI2luc3RfcGVlcl9saW5rXCIpLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgICQoZG9jdW1lbnQpLnRyaWdnZXIoXCJydW5lc3RvbmU6bG9naW5cIik7XG4gICAgICAgIGFkZFJlYWRpbmdMaXN0KCk7XG4gICAgICAgIC8vIEF2b2lkIHRoZSB0aW1lZFJlZnJlc2ggb24gdGhlIGdyYWRpbmcgcGFnZS5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoXCIvYWRtaW4vZ3JhZGluZ1wiKSA9PSAtMSAmJlxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoXCIvcGVlci9cIikgPT0gLTFcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aW1lZFJlZnJlc2goKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIG1lc3MgPSBcIk5vdCBsb2dnZWQgaW5cIjtcbiAgICAgICAgJChkb2N1bWVudCkudHJpZ2dlcihcInJ1bmVzdG9uZTpsb2dvdXRcIik7XG4gICAgICAgIGxldCBidyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnJvd3Npbmdfd2FybmluZ1wiKTtcbiAgICAgICAgaWYgKGJ3KSB7XG4gICAgICAgICAgICBidy5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgIFwiPHAgY2xhc3M9J25hdmJhcl9tZXNzYWdlJz5TYXZpbmcgYW5kIExvZ2dpbmcgYXJlIERpc2FibGVkPC9wPlwiO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhdyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRfd2FybmluZ1wiKTtcbiAgICAgICAgaWYgKGF3KSB7XG4gICAgICAgICAgICBhdy5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgIFwiPHAgY2xhc3M9J25hdmJhcl9tZXNzYWdlJz7wn5qrIExvZy1pbiB0byBSZW1vdmUgPGEgaHJlZj0nL3J1bmVzdG9uZS9kZWZhdWx0L2Fkcyc+QWRzITwvYT4g8J+aqyAmbmJzcDs8L3A+XCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgJChcIi5sb2dnZWRpbnVzZXJcIikuaHRtbChtZXNzKTtcblxuICAgIHBhZ2VQcm9ncmVzc1RyYWNrZXIgPSBuZXcgUGFnZVByb2dyZXNzQmFyKGVCb29rQ29uZmlnLmFjdGl2aXRpZXMpO1xuICAgIG5vdGlmeVJ1bmVzdG9uZUNvbXBvbmVudHMoKTtcbn1cblxuZnVuY3Rpb24gc2V0dXBOYXZiYXJMb2dnZWRJbigpIHtcbiAgICAkKFwiI3Byb2ZpbGVsaW5rXCIpLnNob3coKTtcbiAgICAkKFwiI3Bhc3N3b3JkbGlua1wiKS5zaG93KCk7XG4gICAgJChcIiNyZWdpc3RlcmxpbmtcIikuaGlkZSgpO1xuICAgICQoXCJsaS5sb2dpbm91dFwiKS5odG1sKFxuICAgICAgICAnPGEgaHJlZj1cIicgKyBlQm9va0NvbmZpZy5hcHAgKyAnL2RlZmF1bHQvdXNlci9sb2dvdXRcIj5Mb2cgT3V0PC9hPidcbiAgICApO1xufVxuJChkb2N1bWVudCkub24oXCJydW5lc3RvbmU6bG9naW5cIiwgc2V0dXBOYXZiYXJMb2dnZWRJbik7XG5cbmZ1bmN0aW9uIHNldHVwTmF2YmFyTG9nZ2VkT3V0KCkge1xuICAgIGlmIChlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcInNldHVwIG5hdmJhciBmb3IgbG9nZ2VkIG91dFwiKTtcbiAgICAgICAgJChcIiNyZWdpc3RlcmxpbmtcIikuc2hvdygpO1xuICAgICAgICAkKFwiI3Byb2ZpbGVsaW5rXCIpLmhpZGUoKTtcbiAgICAgICAgJChcIiNwYXNzd29yZGxpbmtcIikuaGlkZSgpO1xuICAgICAgICAkKFwiI2lwX2Ryb3Bkb3duX2xpbmtcIikuaGlkZSgpO1xuICAgICAgICAkKFwiI2luc3RfcGVlcl9saW5rXCIpLmhpZGUoKTtcbiAgICAgICAgJChcImxpLmxvZ2lub3V0XCIpLmh0bWwoXG4gICAgICAgICAgICAnPGEgaHJlZj1cIicgKyBlQm9va0NvbmZpZy5hcHAgKyAnL2RlZmF1bHQvdXNlci9sb2dpblwiPkxvZ2luPC9hPidcbiAgICAgICAgKTtcbiAgICAgICAgJChcIi5mb290ZXJcIikuaHRtbChcInVzZXIgbm90IGxvZ2dlZCBpblwiKTtcbiAgICB9XG59XG4kKGRvY3VtZW50KS5vbihcInJ1bmVzdG9uZTpsb2dvdXRcIiwgc2V0dXBOYXZiYXJMb2dnZWRPdXQpO1xuXG5mdW5jdGlvbiBub3RpZnlSdW5lc3RvbmVDb21wb25lbnRzKCkge1xuICAgIC8vIFJ1bmVzdG9uZSBjb21wb25lbnRzIHdhaXQgdW50aWwgbG9naW4gcHJvY2VzcyBpcyBvdmVyIHRvIGxvYWQgY29tcG9uZW50cyBiZWNhdXNlIG9mIHN0b3JhZ2UgaXNzdWVzLiBUaGlzIHRyaWdnZXJzIHRoZSBgZHluYW1pYyBpbXBvcnQgbWFjaGluZXJ5YCwgd2hpY2ggdGhlbiBzZW5kcyB0aGUgbG9naW4gY29tcGxldGUgc2lnbmFsIHdoZW4gdGhpcyBhbmQgYWxsIGR5bmFtaWMgaW1wb3J0cyBhcmUgZmluaXNoZWQuXG4gICAgJChkb2N1bWVudCkudHJpZ2dlcihcInJ1bmVzdG9uZTpwcmUtbG9naW4tY29tcGxldGVcIik7XG59XG5cbmZ1bmN0aW9uIHBsYWNlQWRDb3B5KCkge1xuICAgIGlmICh0eXBlb2Ygc2hvd0FkICE9PSBcInVuZGVmaW5lZFwiICYmIHNob3dBZCkge1xuICAgICAgICBsZXQgYWROdW0gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKSArIDE7XG4gICAgICAgIGxldCBhZEJsb2NrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGFkY29weV8ke2FkTnVtfWApO1xuICAgICAgICBsZXQgcnNFbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucnVuZXN0b25lXCIpO1xuICAgICAgICBpZiAocnNFbGVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByc0VsZW1lbnRzLmxlbmd0aCk7XG4gICAgICAgICAgICByc0VsZW1lbnRzW3JhbmRvbUluZGV4XS5hZnRlcihhZEJsb2NrKVxuICAgICAgICAgICAgYWRCbG9jay5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBpbml0aWFsaXplIHN0dWZmXG4kKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoZUJvb2tDb25maWcpIHtcbiAgICAgICAgaGFuZGxlUGFnZVNldHVwKCk7XG4gICAgICAgIHBsYWNlQWRDb3B5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlQm9va0NvbmZpZyA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgXCJlQm9va0NvbmZpZyBpcyBub3QgZGVmaW5lZC4gIFRoaXMgcGFnZSBtdXN0IG5vdCBiZSBzZXQgdXAgZm9yIFJ1bmVzdG9uZVwiXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbi8vIG1pc2Mgc3R1ZmZcbi8vIHRvZG86ICBUaGlzIGNvdWxkIGJlIGZ1cnRoZXIgZGlzdHJpYnV0ZWQgYnV0IG1ha2luZyBhIHZpZGVvLmpzIGZpbGUganVzdCBmb3Igb25lIGZ1bmN0aW9uIHNlZW1zIGR1bWIuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICAgIC8vIGFkZCB0aGUgdmlkZW8gcGxheSBidXR0b24gb3ZlcmxheSBpbWFnZVxuICAgICQoXCIudmlkZW8tcGxheS1vdmVybGF5XCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLmNzcyhcbiAgICAgICAgICAgIFwiYmFja2dyb3VuZC1pbWFnZVwiLFxuICAgICAgICAgICAgXCJ1cmwoJ3t7cGF0aHRvKCdfc3RhdGljL3BsYXlfb3ZlcmxheV9pY29uLnBuZycsIDEpfX0nKVwiXG4gICAgICAgICk7XG4gICAgfSk7XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGlzIG5lZWRlZCB0byBhbGxvdyB0aGUgZHJvcGRvd24gc2VhcmNoIGJhciB0byB3b3JrO1xuICAgIC8vIFRoZSBkZWZhdWx0IGJlaGF2aW91ciBpcyB0aGF0IHRoZSBkcm9wZG93biBtZW51IGNsb3NlcyB3aGVuIHNvbWV0aGluZyBpblxuICAgIC8vIGl0IChsaWtlIHRoZSBzZWFyY2ggYmFyKSBpcyBjbGlja2VkXG4gICAgJChmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIEZpeCBpbnB1dCBlbGVtZW50IGNsaWNrIHByb2JsZW1cbiAgICAgICAgJChcIi5kcm9wZG93biBpbnB1dCwgLmRyb3Bkb3duIGxhYmVsXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIHJlLXdyaXRlIHNvbWUgdXJsc1xuICAgIC8vIFRoaXMgaXMgdHJpY2tlciB0aGFuIGl0IGxvb2tzIGFuZCB5b3UgaGF2ZSB0byBvYmV5IHRoZSBydWxlcyBmb3IgIyBhbmNob3JzXG4gICAgLy8gVGhlICNhbmNob3JzIG11c3QgY29tZSBhZnRlciB0aGUgcXVlcnkgc3RyaW5nIGFzIHRoZSBzZXJ2ZXIgYmFzaWNhbGx5IGlnbm9yZXMgYW55IHBhcnRcbiAgICAvLyBvZiBhIHVybCB0aGF0IGNvbWVzIGFmdGVyICMgLSBsaWtlIGEgY29tbWVudC4uLlxuICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwibW9kZT1icm93c2luZ1wiKSkge1xuICAgICAgICBsZXQgcXVlcnlTdHJpbmcgPSBcIj9tb2RlPWJyb3dzaW5nXCI7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJhXCIpLmZvckVhY2goKGxpbmspID0+IHtcbiAgICAgICAgICAgIGxldCBhbmNob3JUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChsaW5rLmhyZWYuaW5jbHVkZXMoXCJib29rcy9wdWJsaXNoZWRcIikgJiYgISBsaW5rLmhyZWYuaW5jbHVkZXMoXCI/bW9kZT1icm93c2luZ1wiKSkge1xuICAgICAgICAgICAgICAgIGlmIChsaW5rLmhyZWYuaW5jbHVkZXMoXCIjXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhUG9pbnQgPSBsaW5rLmhyZWYuaW5kZXhPZihcIiNcIik7XG4gICAgICAgICAgICAgICAgICAgIGFuY2hvclRleHQgPSBsaW5rLmhyZWYuc3Vic3RyaW5nKGFQb2ludCk7XG4gICAgICAgICAgICAgICAgICAgIGxpbmsuaHJlZiA9IGxpbmsuaHJlZi5zdWJzdHJpbmcoMCxhUG9pbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsaW5rLmhyZWYgPSBsaW5rLmhyZWYuaW5jbHVkZXMoXCI/XCIpXG4gICAgICAgICAgICAgICAgICAgID8gbGluay5ocmVmICsgcXVlcnlTdHJpbmcucmVwbGFjZShcIj9cIiwgXCImXCIpICsgYW5jaG9yVGV4dFxuICAgICAgICAgICAgICAgICAgICA6IGxpbmsuaHJlZiArIHF1ZXJ5U3RyaW5nICsgYW5jaG9yVGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG4iLCIvKiFcbiAqIGpRdWVyeSBpZGxlVGltZXIgcGx1Z2luXG4gKiB2ZXJzaW9uIDAuOS4xMDA1MTFcbiAqIGJ5IFBhdWwgSXJpc2guXG4gKiAgIGh0dHA6Ly9naXRodWIuY29tL3BhdWxpcmlzaC95dWktbWlzYy90cmVlL1xuICogTUlUIGxpY2Vuc2VcblxuICogYWRhcHRlZCBmcm9tIFlVSSBpZGxlIHRpbWVyIGJ5IG56YWthczpcbiAqICAgaHR0cDovL2dpdGh1Yi5jb20vbnpha2FzL3l1aS1taXNjL1xuKi9cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMDkgTmljaG9sYXMgQy4gWmFrYXNcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5cbi8qIHVwZGF0ZWQgdG8gZml4IENocm9tZSBzZXRUaW1lb3V0IGlzc3VlIGJ5IFphaWQgWmF3YWlkZWggKi9cblxuIC8vIEFQSSBhdmFpbGFibGUgaW4gPD0gdjAuOFxuIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAvLyBpZGxlVGltZXIoKSB0YWtlcyBhbiBvcHRpb25hbCBhcmd1bWVudCB0aGF0IGRlZmluZXMgdGhlIGlkbGUgdGltZW91dFxuIC8vIHRpbWVvdXQgaXMgaW4gbWlsbGlzZWNvbmRzOyBkZWZhdWx0cyB0byAzMDAwMFxuICQuaWRsZVRpbWVyKDEwMDAwKTtcblxuXG4gJChkb2N1bWVudCkuYmluZChcImlkbGUuaWRsZVRpbWVyXCIsIGZ1bmN0aW9uKCl7XG4gICAgLy8gZnVuY3Rpb24geW91IHdhbnQgdG8gZmlyZSB3aGVuIHRoZSB1c2VyIGdvZXMgaWRsZVxuIH0pO1xuXG5cbiAkKGRvY3VtZW50KS5iaW5kKFwiYWN0aXZlLmlkbGVUaW1lclwiLCBmdW5jdGlvbigpe1xuICAvLyBmdW5jdGlvbiB5b3Ugd2FudCB0byBmaXJlIHdoZW4gdGhlIHVzZXIgYmVjb21lcyBhY3RpdmUgYWdhaW5cbiB9KTtcblxuIC8vIHBhc3MgdGhlIHN0cmluZyAnZGVzdHJveScgdG8gc3RvcCB0aGUgdGltZXJcbiAkLmlkbGVUaW1lcignZGVzdHJveScpO1xuXG4gLy8geW91IGNhbiBxdWVyeSBpZiB0aGUgdXNlciBpcyBpZGxlIG9yIG5vdCB3aXRoIGRhdGEoKVxuICQuZGF0YShkb2N1bWVudCwnaWRsZVRpbWVyJyk7ICAvLyAnaWRsZScgIG9yICdhY3RpdmUnXG5cbiAvLyB5b3UgY2FuIGdldCB0aW1lIGVsYXBzZWQgc2luY2UgdXNlciB3aGVuIGlkbGUvYWN0aXZlXG4gJC5pZGxlVGltZXIoJ2dldEVsYXBzZWRUaW1lJyk7IC8vIHRpbWUgc2luY2Ugc3RhdGUgY2hhbmdlIGluIG1zXG5cbiAqKioqKioqKi9cblxuXG5cbiAvLyBBUEkgYXZhaWxhYmxlIGluID49IHYwLjlcbiAvKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gLy8gYmluZCB0byBzcGVjaWZpYyBlbGVtZW50cywgYWxsb3dzIGZvciBtdWx0aXBsZSB0aW1lciBpbnN0YW5jZXNcbiAkKGVsZW0pLmlkbGVUaW1lcih0aW1lb3V0fCdkZXN0cm95J3wnZ2V0RWxhcHNlZFRpbWUnKTtcbiAkLmRhdGEoZWxlbSwnaWRsZVRpbWVyJyk7ICAvLyAnaWRsZScgIG9yICdhY3RpdmUnXG5cbiAvLyBpZiB5b3UncmUgdXNpbmcgdGhlIG9sZCAkLmlkbGVUaW1lciBhcGksIHlvdSBzaG91bGQgbm90IGRvICQoZG9jdW1lbnQpLmlkbGVUaW1lciguLi4pXG5cbiAvLyBlbGVtZW50IGJvdW5kIHRpbWVycyB3aWxsIG9ubHkgd2F0Y2ggZm9yIGV2ZW50cyBpbnNpZGUgb2YgdGhlbS5cbiAvLyB5b3UgbWF5IGp1c3Qgd2FudCBwYWdlLWxldmVsIGFjdGl2aXR5LCBpbiB3aGljaCBjYXNlIHlvdSBtYXkgc2V0IHVwXG4gLy8gICB5b3VyIHRpbWVycyBvbiBkb2N1bWVudCwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBhbmQgZG9jdW1lbnQuYm9keVxuXG4gLy8gWW91IGNhbiBvcHRpb25hbGx5IHByb3ZpZGUgYSBzZWNvbmQgYXJndW1lbnQgdG8gb3ZlcnJpZGUgY2VydGFpbiBvcHRpb25zLlxuIC8vIEhlcmUgYXJlIHRoZSBkZWZhdWx0cywgc28geW91IGNhbiBvbWl0IGFueSBvciBhbGwgb2YgdGhlbS5cbiAkKGVsZW0pLmlkbGVUaW1lcih0aW1lb3V0LCB7XG4gICBzdGFydEltbWVkaWF0ZWx5OiB0cnVlLCAvL3N0YXJ0cyBhIHRpbWVvdXQgYXMgc29vbiBhcyB0aGUgdGltZXIgaXMgc2V0IHVwOyBvdGhlcndpc2UgaXQgd2FpdHMgZm9yIHRoZSBmaXJzdCBldmVudC5cbiAgIGlkbGU6ICAgIGZhbHNlLCAgICAgICAgIC8vaW5kaWNhdGVzIGlmIHRoZSB1c2VyIGlzIGlkbGVcbiAgIGVuYWJsZWQ6IHRydWUsICAgICAgICAgIC8vaW5kaWNhdGVzIGlmIHRoZSBpZGxlIHRpbWVyIGlzIGVuYWJsZWRcbiAgIGV2ZW50czogICdtb3VzZW1vdmUga2V5ZG93biBET01Nb3VzZVNjcm9sbCBtb3VzZXdoZWVsIG1vdXNlZG93biB0b3VjaHN0YXJ0IHRvdWNobW92ZScgLy8gYWN0aXZpdHkgaXMgb25lIG9mIHRoZXNlIGV2ZW50c1xuIH0pO1xuXG4gKioqKioqKiovXG5cbihmdW5jdGlvbigkKXtcblxuJC5pZGxlVGltZXIgPSBmdW5jdGlvbihuZXdUaW1lb3V0LCBlbGVtLCBvcHRzKXtcblxuICAgIC8vIGRlZmF1bHRzIHRoYXQgYXJlIHRvIGJlIHN0b3JlZCBhcyBpbnN0YW5jZSBwcm9wcyBvbiB0aGUgZWxlbVxuXG5cdG9wdHMgPSAkLmV4dGVuZCh7XG5cdFx0c3RhcnRJbW1lZGlhdGVseTogdHJ1ZSwgLy9zdGFydHMgYSB0aW1lb3V0IGFzIHNvb24gYXMgdGhlIHRpbWVyIGlzIHNldCB1cFxuXHRcdGlkbGU6ICAgIGZhbHNlLCAgICAgICAgIC8vaW5kaWNhdGVzIGlmIHRoZSB1c2VyIGlzIGlkbGVcblx0XHRlbmFibGVkOiB0cnVlLCAgICAgICAgICAvL2luZGljYXRlcyBpZiB0aGUgaWRsZSB0aW1lciBpcyBlbmFibGVkXG5cdFx0dGltZW91dDogMzAwMDAsICAgICAgICAgLy90aGUgYW1vdW50IG9mIHRpbWUgKG1zKSBiZWZvcmUgdGhlIHVzZXIgaXMgY29uc2lkZXJlZCBpZGxlXG5cdFx0ZXZlbnRzOiAgJ21vdXNlbW92ZSBrZXlkb3duIERPTU1vdXNlU2Nyb2xsIG1vdXNld2hlZWwgbW91c2Vkb3duIHRvdWNoc3RhcnQgdG91Y2htb3ZlJyAvLyBhY3Rpdml0eSBpcyBvbmUgb2YgdGhlc2UgZXZlbnRzXG5cdH0sIG9wdHMpO1xuXG5cbiAgICBlbGVtID0gZWxlbSB8fCBkb2N1bWVudDtcblxuICAgIC8qIChpbnRlbnRpb25hbGx5IG5vdCBkb2N1bWVudGVkKVxuICAgICAqIFRvZ2dsZXMgdGhlIGlkbGUgc3RhdGUgYW5kIGZpcmVzIGFuIGFwcHJvcHJpYXRlIGV2ZW50LlxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgdmFyIHRvZ2dsZUlkbGVTdGF0ZSA9IGZ1bmN0aW9uKG15ZWxlbSl7XG5cbiAgICAgICAgLy8gY3Vyc2UgeW91LCBtb3ppbGxhIHNldFRpbWVvdXQgbGF0ZW5lc3MgYnVnIVxuICAgICAgICBpZiAodHlwZW9mIG15ZWxlbSA9PT0gJ251bWJlcicpe1xuICAgICAgICAgICAgbXllbGVtID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9iaiA9ICQuZGF0YShteWVsZW0gfHwgZWxlbSwnaWRsZVRpbWVyT2JqJyk7XG5cbiAgICAgICAgLy90b2dnbGUgdGhlIHN0YXRlXG4gICAgICAgIG9iai5pZGxlID0gIW9iai5pZGxlO1xuXG4gICAgICAgIC8vIHJlc2V0IHRpbWVvdXQgXG4gICAgICAgIHZhciBlbGFwc2VkID0gKCtuZXcgRGF0ZSgpKSAtIG9iai5vbGRkYXRlO1xuICAgICAgICBvYmoub2xkZGF0ZSA9ICtuZXcgRGF0ZSgpO1xuXG4gICAgICAgIC8vIGhhbmRsZSBDaHJvbWUgYWx3YXlzIHRyaWdnZXJpbmcgaWRsZSBhZnRlciBqcyBhbGVydCBvciBjb21maXJtIHBvcHVwXG4gICAgICAgIGlmIChvYmouaWRsZSAmJiAoZWxhcHNlZCA8IG9wdHMudGltZW91dCkpIHtcbiAgICAgICAgICAgICAgICBvYmouaWRsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCgkLmlkbGVUaW1lci50SWQpO1xuICAgICAgICAgICAgICAgIGlmIChvcHRzLmVuYWJsZWQpXG4gICAgICAgICAgICAgICAgICAkLmlkbGVUaW1lci50SWQgPSBzZXRUaW1lb3V0KHRvZ2dsZUlkbGVTdGF0ZSwgb3B0cy50aW1lb3V0KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vZmlyZSBhcHByb3ByaWF0ZSBldmVudFxuXG4gICAgICAgIC8vIGNyZWF0ZSBhIGN1c3RvbSBldmVudCwgYnV0IGZpcnN0LCBzdG9yZSB0aGUgbmV3IHN0YXRlIG9uIHRoZSBlbGVtZW50XG4gICAgICAgIC8vIGFuZCB0aGVuIGFwcGVuZCB0aGF0IHN0cmluZyB0byBhIG5hbWVzcGFjZVxuICAgICAgICB2YXIgZXZlbnQgPSBqUXVlcnkuRXZlbnQoICQuZGF0YShlbGVtLCdpZGxlVGltZXInLCBvYmouaWRsZSA/IFwiaWRsZVwiIDogXCJhY3RpdmVcIiApICArICcuaWRsZVRpbWVyJyAgICk7XG5cbiAgICAgICAgLy8gd2UgZG8gd2FudCB0aGlzIHRvIGJ1YmJsZSwgYXQgbGVhc3QgYXMgYSB0ZW1wb3JhcnkgZml4IGZvciBqUXVlcnkgMS43XG4gICAgICAgIC8vIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAkKGVsZW0pLnRyaWdnZXIoZXZlbnQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTdG9wcyB0aGUgaWRsZSB0aW1lci4gVGhpcyByZW1vdmVzIGFwcHJvcHJpYXRlIGV2ZW50IGhhbmRsZXJzXG4gICAgICogYW5kIGNhbmNlbHMgYW55IHBlbmRpbmcgdGltZW91dHMuXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKiBAbWV0aG9kIHN0b3BcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RvcCA9IGZ1bmN0aW9uKGVsZW0pe1xuXG4gICAgICAgIHZhciBvYmogPSAkLmRhdGEoZWxlbSwnaWRsZVRpbWVyT2JqJykgfHwge307XG5cbiAgICAgICAgLy9zZXQgdG8gZGlzYWJsZWRcbiAgICAgICAgb2JqLmVuYWJsZWQgPSBmYWxzZTtcblxuICAgICAgICAvL2NsZWFyIGFueSBwZW5kaW5nIHRpbWVvdXRzXG4gICAgICAgIGNsZWFyVGltZW91dChvYmoudElkKTtcblxuICAgICAgICAvL2RldGFjaCB0aGUgZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgJChlbGVtKS5vZmYoJy5pZGxlVGltZXInKTtcbiAgICB9LFxuXG5cbiAgICAvKiAoaW50ZW50aW9uYWxseSBub3QgZG9jdW1lbnRlZClcbiAgICAgKiBIYW5kbGVzIGEgdXNlciBldmVudCBpbmRpY2F0aW5nIHRoYXQgdGhlIHVzZXIgaXNuJ3QgaWRsZS5cbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBBIERPTTItbm9ybWFsaXplZCBldmVudCBvYmplY3QuXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBoYW5kbGVVc2VyRXZlbnQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBvYmogPSAkLmRhdGEodGhpcywnaWRsZVRpbWVyT2JqJyk7XG5cbiAgICAgICAgLy9jbGVhciBhbnkgZXhpc3RpbmcgdGltZW91dFxuICAgICAgICBjbGVhclRpbWVvdXQob2JqLnRJZCk7XG5cblxuXG4gICAgICAgIC8vaWYgdGhlIGlkbGUgdGltZXIgaXMgZW5hYmxlZFxuICAgICAgICBpZiAob2JqLmVuYWJsZWQpe1xuXG5cbiAgICAgICAgICAgIC8vaWYgaXQncyBpZGxlLCB0aGF0IG1lYW5zIHRoZSB1c2VyIGlzIG5vIGxvbmdlciBpZGxlXG4gICAgICAgICAgICBpZiAob2JqLmlkbGUpe1xuICAgICAgICAgICAgICAgIHRvZ2dsZUlkbGVTdGF0ZSh0aGlzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9zZXQgYSBuZXcgdGltZW91dFxuICAgICAgICAgICAgb2JqLnRJZCA9IHNldFRpbWVvdXQodG9nZ2xlSWRsZVN0YXRlLCBvYmoudGltZW91dCk7XG5cbiAgICAgICAgfVxuICAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBTdGFydHMgdGhlIGlkbGUgdGltZXIuIFRoaXMgYWRkcyBhcHByb3ByaWF0ZSBldmVudCBoYW5kbGVyc1xuICAgICAqIGFuZCBzdGFydHMgdGhlIGZpcnN0IHRpbWVvdXQuXG4gICAgICogQHBhcmFtIHtpbnR9IG5ld1RpbWVvdXQgKE9wdGlvbmFsKSBBIG5ldyB2YWx1ZSBmb3IgdGhlIHRpbWVvdXQgcGVyaW9kIGluIG1zLlxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICogQG1ldGhvZCAkLmlkbGVUaW1lclxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cblxuXG4gICAgdmFyIG9iaiA9ICQuZGF0YShlbGVtLCdpZGxlVGltZXJPYmonKSB8fCB7fTtcblxuICAgIG9iai5vbGRkYXRlID0gb2JqLm9sZGRhdGUgfHwgK25ldyBEYXRlKCk7XG5cbiAgICAvL2Fzc2lnbiBhIG5ldyB0aW1lb3V0IGlmIG5lY2Vzc2FyeVxuICAgIGlmICh0eXBlb2YgbmV3VGltZW91dCA9PT0gXCJudW1iZXJcIil7XG4gICAgICAgIG9wdHMudGltZW91dCA9IG5ld1RpbWVvdXQ7XG4gICAgfSBlbHNlIGlmIChuZXdUaW1lb3V0ID09PSAnZGVzdHJveScpIHtcbiAgICAgICAgc3RvcChlbGVtKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSBlbHNlIGlmIChuZXdUaW1lb3V0ID09PSAnZ2V0RWxhcHNlZFRpbWUnKXtcbiAgICAgICAgcmV0dXJuICgrbmV3IERhdGUoKSkgLSBvYmoub2xkZGF0ZTtcbiAgICB9XG5cbiAgICAvL2Fzc2lnbiBhcHByb3ByaWF0ZSBldmVudCBoYW5kbGVyc1xuICAgICQoZWxlbSkub24oJC50cmltKChvcHRzLmV2ZW50cysnICcpLnNwbGl0KCcgJykuam9pbignLmlkbGVUaW1lciAnKSksaGFuZGxlVXNlckV2ZW50KTtcblxuXG4gICAgb2JqLmlkbGUgICAgPSBvcHRzLmlkbGU7XG4gICAgb2JqLmVuYWJsZWQgPSBvcHRzLmVuYWJsZWQ7XG4gICAgb2JqLnRpbWVvdXQgPSBvcHRzLnRpbWVvdXQ7XG5cblxuICAgIC8vc2V0IGEgdGltZW91dCB0byB0b2dnbGUgc3RhdGUuIE1heSB3aXNoIHRvIG9taXQgdGhpcyBpbiBzb21lIHNpdHVhdGlvbnNcblx0aWYgKG9wdHMuc3RhcnRJbW1lZGlhdGVseSkge1xuXHQgICAgb2JqLnRJZCA9IHNldFRpbWVvdXQodG9nZ2xlSWRsZVN0YXRlLCBvYmoudGltZW91dCk7XG5cdH1cblxuICAgIC8vIGFzc3VtZSB0aGUgdXNlciBpcyBhY3RpdmUgZm9yIHRoZSBmaXJzdCB4IHNlY29uZHMuXG4gICAgJC5kYXRhKGVsZW0sJ2lkbGVUaW1lcicsXCJhY3RpdmVcIik7XG5cbiAgICAvLyBzdG9yZSBvdXIgaW5zdGFuY2Ugb24gdGhlIG9iamVjdFxuICAgICQuZGF0YShlbGVtLCdpZGxlVGltZXJPYmonLG9iaik7XG5cblxuXG59OyAvLyBlbmQgb2YgJC5pZGxlVGltZXIoKVxuXG5cbi8vIHYwLjkgQVBJIGZvciBkZWZpbmluZyBtdWx0aXBsZSB0aW1lcnMuXG4kLmZuLmlkbGVUaW1lciA9IGZ1bmN0aW9uKG5ld1RpbWVvdXQsb3B0cyl7XG5cdC8vIEFsbG93IG9taXNzaW9uIG9mIG9wdHMgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcblx0aWYgKCFvcHRzKSB7XG5cdFx0b3B0cyA9IHt9O1xuXHR9XG5cbiAgICBpZih0aGlzWzBdKXtcbiAgICAgICAgJC5pZGxlVGltZXIobmV3VGltZW91dCx0aGlzWzBdLG9wdHMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuXG59KShqUXVlcnkpO1xuIiwiLyohXG4gKiBCSURJIGVtYmVkZGluZyBzdXBwb3J0IGZvciBqUXVlcnkuaTE4blxuICpcbiAqIENvcHlyaWdodCAoQykgMjAxNSwgRGF2aWQgQ2hhblxuICpcbiAqIFRoaXMgY29kZSBpcyBkdWFsIGxpY2Vuc2VkIEdQTHYyIG9yIGxhdGVyIGFuZCBNSVQuIFlvdSBkb24ndCBoYXZlIHRvIGRvXG4gKiBhbnl0aGluZyBzcGVjaWFsIHRvIGNob29zZSBvbmUgbGljZW5zZSBvciB0aGUgb3RoZXIgYW5kIHlvdSBkb24ndCBoYXZlIHRvXG4gKiBub3RpZnkgYW55b25lIHdoaWNoIGxpY2Vuc2UgeW91IGFyZSB1c2luZy4gWW91IGFyZSBmcmVlIHRvIHVzZSB0aGlzIGNvZGVcbiAqIGluIGNvbW1lcmNpYWwgcHJvamVjdHMgYXMgbG9uZyBhcyB0aGUgY29weXJpZ2h0IGhlYWRlciBpcyBsZWZ0IGludGFjdC5cbiAqIFNlZSBmaWxlcyBHUEwtTElDRU5TRSBhbmQgTUlULUxJQ0VOU0UgZm9yIGRldGFpbHMuXG4gKlxuICogQGxpY2VuY2UgR05VIEdlbmVyYWwgUHVibGljIExpY2VuY2UgMi4wIG9yIGxhdGVyXG4gKiBAbGljZW5jZSBNSVQgTGljZW5zZVxuICovXG5cbiggZnVuY3Rpb24gKCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBzdHJvbmdEaXJSZWdFeHA7XG5cblx0LyoqXG5cdCAqIE1hdGNoZXMgdGhlIGZpcnN0IHN0cm9uZyBkaXJlY3Rpb25hbGl0eSBjb2RlcG9pbnQ6XG5cdCAqIC0gaW4gZ3JvdXAgMSBpZiBpdCBpcyBMVFJcblx0ICogLSBpbiBncm91cCAyIGlmIGl0IGlzIFJUTFxuXHQgKiBEb2VzIG5vdCBtYXRjaCBpZiB0aGVyZSBpcyBubyBzdHJvbmcgZGlyZWN0aW9uYWxpdHkgY29kZXBvaW50LlxuXHQgKlxuXHQgKiBHZW5lcmF0ZWQgYnkgVW5pY29kZUpTIChzZWUgdG9vbHMvc3Ryb25nRGlyKSBmcm9tIHRoZSBVQ0Q7IHNlZVxuXHQgKiBodHRwczovL3BoYWJyaWNhdG9yLndpa2ltZWRpYS5vcmcvZGlmZnVzaW9uL0dVSlMvIC5cblx0ICovXG5cdHN0cm9uZ0RpclJlZ0V4cCA9IG5ldyBSZWdFeHAoXG5cdFx0Jyg/OicgK1xuXHRcdFx0JygnICtcblx0XHRcdFx0J1tcXHUwMDQxLVxcdTAwNWFcXHUwMDYxLVxcdTAwN2FcXHUwMGFhXFx1MDBiNVxcdTAwYmFcXHUwMGMwLVxcdTAwZDZcXHUwMGQ4LVxcdTAwZjZcXHUwMGY4LVxcdTAyYjhcXHUwMmJiLVxcdTAyYzFcXHUwMmQwXFx1MDJkMVxcdTAyZTAtXFx1MDJlNFxcdTAyZWVcXHUwMzcwLVxcdTAzNzNcXHUwMzc2XFx1MDM3N1xcdTAzN2EtXFx1MDM3ZFxcdTAzN2ZcXHUwMzg2XFx1MDM4OC1cXHUwMzhhXFx1MDM4Y1xcdTAzOGUtXFx1MDNhMVxcdTAzYTMtXFx1MDNmNVxcdTAzZjctXFx1MDQ4MlxcdTA0OGEtXFx1MDUyZlxcdTA1MzEtXFx1MDU1NlxcdTA1NTktXFx1MDU1ZlxcdTA1NjEtXFx1MDU4N1xcdTA1ODlcXHUwOTAzLVxcdTA5MzlcXHUwOTNiXFx1MDkzZC1cXHUwOTQwXFx1MDk0OS1cXHUwOTRjXFx1MDk0ZS1cXHUwOTUwXFx1MDk1OC1cXHUwOTYxXFx1MDk2NC1cXHUwOTgwXFx1MDk4MlxcdTA5ODNcXHUwOTg1LVxcdTA5OGNcXHUwOThmXFx1MDk5MFxcdTA5OTMtXFx1MDlhOFxcdTA5YWEtXFx1MDliMFxcdTA5YjJcXHUwOWI2LVxcdTA5YjlcXHUwOWJkLVxcdTA5YzBcXHUwOWM3XFx1MDljOFxcdTA5Y2JcXHUwOWNjXFx1MDljZVxcdTA5ZDdcXHUwOWRjXFx1MDlkZFxcdTA5ZGYtXFx1MDllMVxcdTA5ZTYtXFx1MDlmMVxcdTA5ZjQtXFx1MDlmYVxcdTBhMDNcXHUwYTA1LVxcdTBhMGFcXHUwYTBmXFx1MGExMFxcdTBhMTMtXFx1MGEyOFxcdTBhMmEtXFx1MGEzMFxcdTBhMzJcXHUwYTMzXFx1MGEzNVxcdTBhMzZcXHUwYTM4XFx1MGEzOVxcdTBhM2UtXFx1MGE0MFxcdTBhNTktXFx1MGE1Y1xcdTBhNWVcXHUwYTY2LVxcdTBhNmZcXHUwYTcyLVxcdTBhNzRcXHUwYTgzXFx1MGE4NS1cXHUwYThkXFx1MGE4Zi1cXHUwYTkxXFx1MGE5My1cXHUwYWE4XFx1MGFhYS1cXHUwYWIwXFx1MGFiMlxcdTBhYjNcXHUwYWI1LVxcdTBhYjlcXHUwYWJkLVxcdTBhYzBcXHUwYWM5XFx1MGFjYlxcdTBhY2NcXHUwYWQwXFx1MGFlMFxcdTBhZTFcXHUwYWU2LVxcdTBhZjBcXHUwYWY5XFx1MGIwMlxcdTBiMDNcXHUwYjA1LVxcdTBiMGNcXHUwYjBmXFx1MGIxMFxcdTBiMTMtXFx1MGIyOFxcdTBiMmEtXFx1MGIzMFxcdTBiMzJcXHUwYjMzXFx1MGIzNS1cXHUwYjM5XFx1MGIzZFxcdTBiM2VcXHUwYjQwXFx1MGI0N1xcdTBiNDhcXHUwYjRiXFx1MGI0Y1xcdTBiNTdcXHUwYjVjXFx1MGI1ZFxcdTBiNWYtXFx1MGI2MVxcdTBiNjYtXFx1MGI3N1xcdTBiODNcXHUwYjg1LVxcdTBiOGFcXHUwYjhlLVxcdTBiOTBcXHUwYjkyLVxcdTBiOTVcXHUwYjk5XFx1MGI5YVxcdTBiOWNcXHUwYjllXFx1MGI5ZlxcdTBiYTNcXHUwYmE0XFx1MGJhOC1cXHUwYmFhXFx1MGJhZS1cXHUwYmI5XFx1MGJiZVxcdTBiYmZcXHUwYmMxXFx1MGJjMlxcdTBiYzYtXFx1MGJjOFxcdTBiY2EtXFx1MGJjY1xcdTBiZDBcXHUwYmQ3XFx1MGJlNi1cXHUwYmYyXFx1MGMwMS1cXHUwYzAzXFx1MGMwNS1cXHUwYzBjXFx1MGMwZS1cXHUwYzEwXFx1MGMxMi1cXHUwYzI4XFx1MGMyYS1cXHUwYzM5XFx1MGMzZFxcdTBjNDEtXFx1MGM0NFxcdTBjNTgtXFx1MGM1YVxcdTBjNjBcXHUwYzYxXFx1MGM2Ni1cXHUwYzZmXFx1MGM3ZlxcdTBjODJcXHUwYzgzXFx1MGM4NS1cXHUwYzhjXFx1MGM4ZS1cXHUwYzkwXFx1MGM5Mi1cXHUwY2E4XFx1MGNhYS1cXHUwY2IzXFx1MGNiNS1cXHUwY2I5XFx1MGNiZC1cXHUwY2M0XFx1MGNjNi1cXHUwY2M4XFx1MGNjYVxcdTBjY2JcXHUwY2Q1XFx1MGNkNlxcdTBjZGVcXHUwY2UwXFx1MGNlMVxcdTBjZTYtXFx1MGNlZlxcdTBjZjFcXHUwY2YyXFx1MGQwMlxcdTBkMDNcXHUwZDA1LVxcdTBkMGNcXHUwZDBlLVxcdTBkMTBcXHUwZDEyLVxcdTBkM2FcXHUwZDNkLVxcdTBkNDBcXHUwZDQ2LVxcdTBkNDhcXHUwZDRhLVxcdTBkNGNcXHUwZDRlXFx1MGQ1N1xcdTBkNWYtXFx1MGQ2MVxcdTBkNjYtXFx1MGQ3NVxcdTBkNzktXFx1MGQ3ZlxcdTBkODJcXHUwZDgzXFx1MGQ4NS1cXHUwZDk2XFx1MGQ5YS1cXHUwZGIxXFx1MGRiMy1cXHUwZGJiXFx1MGRiZFxcdTBkYzAtXFx1MGRjNlxcdTBkY2YtXFx1MGRkMVxcdTBkZDgtXFx1MGRkZlxcdTBkZTYtXFx1MGRlZlxcdTBkZjItXFx1MGRmNFxcdTBlMDEtXFx1MGUzMFxcdTBlMzJcXHUwZTMzXFx1MGU0MC1cXHUwZTQ2XFx1MGU0Zi1cXHUwZTViXFx1MGU4MVxcdTBlODJcXHUwZTg0XFx1MGU4N1xcdTBlODhcXHUwZThhXFx1MGU4ZFxcdTBlOTQtXFx1MGU5N1xcdTBlOTktXFx1MGU5ZlxcdTBlYTEtXFx1MGVhM1xcdTBlYTVcXHUwZWE3XFx1MGVhYVxcdTBlYWJcXHUwZWFkLVxcdTBlYjBcXHUwZWIyXFx1MGViM1xcdTBlYmRcXHUwZWMwLVxcdTBlYzRcXHUwZWM2XFx1MGVkMC1cXHUwZWQ5XFx1MGVkYy1cXHUwZWRmXFx1MGYwMC1cXHUwZjE3XFx1MGYxYS1cXHUwZjM0XFx1MGYzNlxcdTBmMzhcXHUwZjNlLVxcdTBmNDdcXHUwZjQ5LVxcdTBmNmNcXHUwZjdmXFx1MGY4NVxcdTBmODgtXFx1MGY4Y1xcdTBmYmUtXFx1MGZjNVxcdTBmYzctXFx1MGZjY1xcdTBmY2UtXFx1MGZkYVxcdTEwMDAtXFx1MTAyY1xcdTEwMzFcXHUxMDM4XFx1MTAzYlxcdTEwM2NcXHUxMDNmLVxcdTEwNTdcXHUxMDVhLVxcdTEwNWRcXHUxMDYxLVxcdTEwNzBcXHUxMDc1LVxcdTEwODFcXHUxMDgzXFx1MTA4NFxcdTEwODctXFx1MTA4Y1xcdTEwOGUtXFx1MTA5Y1xcdTEwOWUtXFx1MTBjNVxcdTEwYzdcXHUxMGNkXFx1MTBkMC1cXHUxMjQ4XFx1MTI0YS1cXHUxMjRkXFx1MTI1MC1cXHUxMjU2XFx1MTI1OFxcdTEyNWEtXFx1MTI1ZFxcdTEyNjAtXFx1MTI4OFxcdTEyOGEtXFx1MTI4ZFxcdTEyOTAtXFx1MTJiMFxcdTEyYjItXFx1MTJiNVxcdTEyYjgtXFx1MTJiZVxcdTEyYzBcXHUxMmMyLVxcdTEyYzVcXHUxMmM4LVxcdTEyZDZcXHUxMmQ4LVxcdTEzMTBcXHUxMzEyLVxcdTEzMTVcXHUxMzE4LVxcdTEzNWFcXHUxMzYwLVxcdTEzN2NcXHUxMzgwLVxcdTEzOGZcXHUxM2EwLVxcdTEzZjVcXHUxM2Y4LVxcdTEzZmRcXHUxNDAxLVxcdTE2N2ZcXHUxNjgxLVxcdTE2OWFcXHUxNmEwLVxcdTE2ZjhcXHUxNzAwLVxcdTE3MGNcXHUxNzBlLVxcdTE3MTFcXHUxNzIwLVxcdTE3MzFcXHUxNzM1XFx1MTczNlxcdTE3NDAtXFx1MTc1MVxcdTE3NjAtXFx1MTc2Y1xcdTE3NmUtXFx1MTc3MFxcdTE3ODAtXFx1MTdiM1xcdTE3YjZcXHUxN2JlLVxcdTE3YzVcXHUxN2M3XFx1MTdjOFxcdTE3ZDQtXFx1MTdkYVxcdTE3ZGNcXHUxN2UwLVxcdTE3ZTlcXHUxODEwLVxcdTE4MTlcXHUxODIwLVxcdTE4NzdcXHUxODgwLVxcdTE4YThcXHUxOGFhXFx1MThiMC1cXHUxOGY1XFx1MTkwMC1cXHUxOTFlXFx1MTkyMy1cXHUxOTI2XFx1MTkyOS1cXHUxOTJiXFx1MTkzMFxcdTE5MzFcXHUxOTMzLVxcdTE5MzhcXHUxOTQ2LVxcdTE5NmRcXHUxOTcwLVxcdTE5NzRcXHUxOTgwLVxcdTE5YWJcXHUxOWIwLVxcdTE5YzlcXHUxOWQwLVxcdTE5ZGFcXHUxYTAwLVxcdTFhMTZcXHUxYTE5XFx1MWExYVxcdTFhMWUtXFx1MWE1NVxcdTFhNTdcXHUxYTYxXFx1MWE2M1xcdTFhNjRcXHUxYTZkLVxcdTFhNzJcXHUxYTgwLVxcdTFhODlcXHUxYTkwLVxcdTFhOTlcXHUxYWEwLVxcdTFhYWRcXHUxYjA0LVxcdTFiMzNcXHUxYjM1XFx1MWIzYlxcdTFiM2QtXFx1MWI0MVxcdTFiNDMtXFx1MWI0YlxcdTFiNTAtXFx1MWI2YVxcdTFiNzQtXFx1MWI3Y1xcdTFiODItXFx1MWJhMVxcdTFiYTZcXHUxYmE3XFx1MWJhYVxcdTFiYWUtXFx1MWJlNVxcdTFiZTdcXHUxYmVhLVxcdTFiZWNcXHUxYmVlXFx1MWJmMlxcdTFiZjNcXHUxYmZjLVxcdTFjMmJcXHUxYzM0XFx1MWMzNVxcdTFjM2ItXFx1MWM0OVxcdTFjNGQtXFx1MWM3ZlxcdTFjYzAtXFx1MWNjN1xcdTFjZDNcXHUxY2UxXFx1MWNlOS1cXHUxY2VjXFx1MWNlZS1cXHUxY2YzXFx1MWNmNVxcdTFjZjZcXHUxZDAwLVxcdTFkYmZcXHUxZTAwLVxcdTFmMTVcXHUxZjE4LVxcdTFmMWRcXHUxZjIwLVxcdTFmNDVcXHUxZjQ4LVxcdTFmNGRcXHUxZjUwLVxcdTFmNTdcXHUxZjU5XFx1MWY1YlxcdTFmNWRcXHUxZjVmLVxcdTFmN2RcXHUxZjgwLVxcdTFmYjRcXHUxZmI2LVxcdTFmYmNcXHUxZmJlXFx1MWZjMi1cXHUxZmM0XFx1MWZjNi1cXHUxZmNjXFx1MWZkMC1cXHUxZmQzXFx1MWZkNi1cXHUxZmRiXFx1MWZlMC1cXHUxZmVjXFx1MWZmMi1cXHUxZmY0XFx1MWZmNi1cXHUxZmZjXFx1MjAwZVxcdTIwNzFcXHUyMDdmXFx1MjA5MC1cXHUyMDljXFx1MjEwMlxcdTIxMDdcXHUyMTBhLVxcdTIxMTNcXHUyMTE1XFx1MjExOS1cXHUyMTFkXFx1MjEyNFxcdTIxMjZcXHUyMTI4XFx1MjEyYS1cXHUyMTJkXFx1MjEyZi1cXHUyMTM5XFx1MjEzYy1cXHUyMTNmXFx1MjE0NS1cXHUyMTQ5XFx1MjE0ZVxcdTIxNGZcXHUyMTYwLVxcdTIxODhcXHUyMzM2LVxcdTIzN2FcXHUyMzk1XFx1MjQ5Yy1cXHUyNGU5XFx1MjZhY1xcdTI4MDAtXFx1MjhmZlxcdTJjMDAtXFx1MmMyZVxcdTJjMzAtXFx1MmM1ZVxcdTJjNjAtXFx1MmNlNFxcdTJjZWItXFx1MmNlZVxcdTJjZjJcXHUyY2YzXFx1MmQwMC1cXHUyZDI1XFx1MmQyN1xcdTJkMmRcXHUyZDMwLVxcdTJkNjdcXHUyZDZmXFx1MmQ3MFxcdTJkODAtXFx1MmQ5NlxcdTJkYTAtXFx1MmRhNlxcdTJkYTgtXFx1MmRhZVxcdTJkYjAtXFx1MmRiNlxcdTJkYjgtXFx1MmRiZVxcdTJkYzAtXFx1MmRjNlxcdTJkYzgtXFx1MmRjZVxcdTJkZDAtXFx1MmRkNlxcdTJkZDgtXFx1MmRkZVxcdTMwMDUtXFx1MzAwN1xcdTMwMjEtXFx1MzAyOVxcdTMwMmVcXHUzMDJmXFx1MzAzMS1cXHUzMDM1XFx1MzAzOC1cXHUzMDNjXFx1MzA0MS1cXHUzMDk2XFx1MzA5ZC1cXHUzMDlmXFx1MzBhMS1cXHUzMGZhXFx1MzBmYy1cXHUzMGZmXFx1MzEwNS1cXHUzMTJkXFx1MzEzMS1cXHUzMThlXFx1MzE5MC1cXHUzMWJhXFx1MzFmMC1cXHUzMjFjXFx1MzIyMC1cXHUzMjRmXFx1MzI2MC1cXHUzMjdiXFx1MzI3Zi1cXHUzMmIwXFx1MzJjMC1cXHUzMmNiXFx1MzJkMC1cXHUzMmZlXFx1MzMwMC1cXHUzMzc2XFx1MzM3Yi1cXHUzM2RkXFx1MzNlMC1cXHUzM2ZlXFx1MzQwMC1cXHU0ZGI1XFx1NGUwMC1cXHU5ZmQ1XFx1YTAwMC1cXHVhNDhjXFx1YTRkMC1cXHVhNjBjXFx1YTYxMC1cXHVhNjJiXFx1YTY0MC1cXHVhNjZlXFx1YTY4MC1cXHVhNjlkXFx1YTZhMC1cXHVhNmVmXFx1YTZmMi1cXHVhNmY3XFx1YTcyMi1cXHVhNzg3XFx1YTc4OS1cXHVhN2FkXFx1YTdiMC1cXHVhN2I3XFx1YTdmNy1cXHVhODAxXFx1YTgwMy1cXHVhODA1XFx1YTgwNy1cXHVhODBhXFx1YTgwYy1cXHVhODI0XFx1YTgyN1xcdWE4MzAtXFx1YTgzN1xcdWE4NDAtXFx1YTg3M1xcdWE4ODAtXFx1YThjM1xcdWE4Y2UtXFx1YThkOVxcdWE4ZjItXFx1YThmZFxcdWE5MDAtXFx1YTkyNVxcdWE5MmUtXFx1YTk0NlxcdWE5NTJcXHVhOTUzXFx1YTk1Zi1cXHVhOTdjXFx1YTk4My1cXHVhOWIyXFx1YTliNFxcdWE5YjVcXHVhOWJhXFx1YTliYlxcdWE5YmQtXFx1YTljZFxcdWE5Y2YtXFx1YTlkOVxcdWE5ZGUtXFx1YTllNFxcdWE5ZTYtXFx1YTlmZVxcdWFhMDAtXFx1YWEyOFxcdWFhMmZcXHVhYTMwXFx1YWEzM1xcdWFhMzRcXHVhYTQwLVxcdWFhNDJcXHVhYTQ0LVxcdWFhNGJcXHVhYTRkXFx1YWE1MC1cXHVhYTU5XFx1YWE1Yy1cXHVhYTdiXFx1YWE3ZC1cXHVhYWFmXFx1YWFiMVxcdWFhYjVcXHVhYWI2XFx1YWFiOS1cXHVhYWJkXFx1YWFjMFxcdWFhYzJcXHVhYWRiLVxcdWFhZWJcXHVhYWVlLVxcdWFhZjVcXHVhYjAxLVxcdWFiMDZcXHVhYjA5LVxcdWFiMGVcXHVhYjExLVxcdWFiMTZcXHVhYjIwLVxcdWFiMjZcXHVhYjI4LVxcdWFiMmVcXHVhYjMwLVxcdWFiNjVcXHVhYjcwLVxcdWFiZTRcXHVhYmU2XFx1YWJlN1xcdWFiZTktXFx1YWJlY1xcdWFiZjAtXFx1YWJmOVxcdWFjMDAtXFx1ZDdhM1xcdWQ3YjAtXFx1ZDdjNlxcdWQ3Y2ItXFx1ZDdmYlxcdWUwMDAtXFx1ZmE2ZFxcdWZhNzAtXFx1ZmFkOVxcdWZiMDAtXFx1ZmIwNlxcdWZiMTMtXFx1ZmIxN1xcdWZmMjEtXFx1ZmYzYVxcdWZmNDEtXFx1ZmY1YVxcdWZmNjYtXFx1ZmZiZVxcdWZmYzItXFx1ZmZjN1xcdWZmY2EtXFx1ZmZjZlxcdWZmZDItXFx1ZmZkN1xcdWZmZGEtXFx1ZmZkY118XFx1ZDgwMFtcXHVkYzAwLVxcdWRjMGJdfFxcdWQ4MDBbXFx1ZGMwZC1cXHVkYzI2XXxcXHVkODAwW1xcdWRjMjgtXFx1ZGMzYV18XFx1ZDgwMFxcdWRjM2N8XFx1ZDgwMFxcdWRjM2R8XFx1ZDgwMFtcXHVkYzNmLVxcdWRjNGRdfFxcdWQ4MDBbXFx1ZGM1MC1cXHVkYzVkXXxcXHVkODAwW1xcdWRjODAtXFx1ZGNmYV18XFx1ZDgwMFxcdWRkMDB8XFx1ZDgwMFxcdWRkMDJ8XFx1ZDgwMFtcXHVkZDA3LVxcdWRkMzNdfFxcdWQ4MDBbXFx1ZGQzNy1cXHVkZDNmXXxcXHVkODAwW1xcdWRkZDAtXFx1ZGRmY118XFx1ZDgwMFtcXHVkZTgwLVxcdWRlOWNdfFxcdWQ4MDBbXFx1ZGVhMC1cXHVkZWQwXXxcXHVkODAwW1xcdWRmMDAtXFx1ZGYyM118XFx1ZDgwMFtcXHVkZjMwLVxcdWRmNGFdfFxcdWQ4MDBbXFx1ZGY1MC1cXHVkZjc1XXxcXHVkODAwW1xcdWRmODAtXFx1ZGY5ZF18XFx1ZDgwMFtcXHVkZjlmLVxcdWRmYzNdfFxcdWQ4MDBbXFx1ZGZjOC1cXHVkZmQ1XXxcXHVkODAxW1xcdWRjMDAtXFx1ZGM5ZF18XFx1ZDgwMVtcXHVkY2EwLVxcdWRjYTldfFxcdWQ4MDFbXFx1ZGQwMC1cXHVkZDI3XXxcXHVkODAxW1xcdWRkMzAtXFx1ZGQ2M118XFx1ZDgwMVxcdWRkNmZ8XFx1ZDgwMVtcXHVkZTAwLVxcdWRmMzZdfFxcdWQ4MDFbXFx1ZGY0MC1cXHVkZjU1XXxcXHVkODAxW1xcdWRmNjAtXFx1ZGY2N118XFx1ZDgwNFxcdWRjMDB8XFx1ZDgwNFtcXHVkYzAyLVxcdWRjMzddfFxcdWQ4MDRbXFx1ZGM0Ny1cXHVkYzRkXXxcXHVkODA0W1xcdWRjNjYtXFx1ZGM2Zl18XFx1ZDgwNFtcXHVkYzgyLVxcdWRjYjJdfFxcdWQ4MDRcXHVkY2I3fFxcdWQ4MDRcXHVkY2I4fFxcdWQ4MDRbXFx1ZGNiYi1cXHVkY2MxXXxcXHVkODA0W1xcdWRjZDAtXFx1ZGNlOF18XFx1ZDgwNFtcXHVkY2YwLVxcdWRjZjldfFxcdWQ4MDRbXFx1ZGQwMy1cXHVkZDI2XXxcXHVkODA0XFx1ZGQyY3xcXHVkODA0W1xcdWRkMzYtXFx1ZGQ0M118XFx1ZDgwNFtcXHVkZDUwLVxcdWRkNzJdfFxcdWQ4MDRbXFx1ZGQ3NC1cXHVkZDc2XXxcXHVkODA0W1xcdWRkODItXFx1ZGRiNV18XFx1ZDgwNFtcXHVkZGJmLVxcdWRkYzldfFxcdWQ4MDRcXHVkZGNkfFxcdWQ4MDRbXFx1ZGRkMC1cXHVkZGRmXXxcXHVkODA0W1xcdWRkZTEtXFx1ZGRmNF18XFx1ZDgwNFtcXHVkZTAwLVxcdWRlMTFdfFxcdWQ4MDRbXFx1ZGUxMy1cXHVkZTJlXXxcXHVkODA0XFx1ZGUzMnxcXHVkODA0XFx1ZGUzM3xcXHVkODA0XFx1ZGUzNXxcXHVkODA0W1xcdWRlMzgtXFx1ZGUzZF18XFx1ZDgwNFtcXHVkZTgwLVxcdWRlODZdfFxcdWQ4MDRcXHVkZTg4fFxcdWQ4MDRbXFx1ZGU4YS1cXHVkZThkXXxcXHVkODA0W1xcdWRlOGYtXFx1ZGU5ZF18XFx1ZDgwNFtcXHVkZTlmLVxcdWRlYTldfFxcdWQ4MDRbXFx1ZGViMC1cXHVkZWRlXXxcXHVkODA0W1xcdWRlZTAtXFx1ZGVlMl18XFx1ZDgwNFtcXHVkZWYwLVxcdWRlZjldfFxcdWQ4MDRcXHVkZjAyfFxcdWQ4MDRcXHVkZjAzfFxcdWQ4MDRbXFx1ZGYwNS1cXHVkZjBjXXxcXHVkODA0XFx1ZGYwZnxcXHVkODA0XFx1ZGYxMHxcXHVkODA0W1xcdWRmMTMtXFx1ZGYyOF18XFx1ZDgwNFtcXHVkZjJhLVxcdWRmMzBdfFxcdWQ4MDRcXHVkZjMyfFxcdWQ4MDRcXHVkZjMzfFxcdWQ4MDRbXFx1ZGYzNS1cXHVkZjM5XXxcXHVkODA0W1xcdWRmM2QtXFx1ZGYzZl18XFx1ZDgwNFtcXHVkZjQxLVxcdWRmNDRdfFxcdWQ4MDRcXHVkZjQ3fFxcdWQ4MDRcXHVkZjQ4fFxcdWQ4MDRbXFx1ZGY0Yi1cXHVkZjRkXXxcXHVkODA0XFx1ZGY1MHxcXHVkODA0XFx1ZGY1N3xcXHVkODA0W1xcdWRmNWQtXFx1ZGY2M118XFx1ZDgwNVtcXHVkYzgwLVxcdWRjYjJdfFxcdWQ4MDVcXHVkY2I5fFxcdWQ4MDVbXFx1ZGNiYi1cXHVkY2JlXXxcXHVkODA1XFx1ZGNjMXxcXHVkODA1W1xcdWRjYzQtXFx1ZGNjN118XFx1ZDgwNVtcXHVkY2QwLVxcdWRjZDldfFxcdWQ4MDVbXFx1ZGQ4MC1cXHVkZGIxXXxcXHVkODA1W1xcdWRkYjgtXFx1ZGRiYl18XFx1ZDgwNVxcdWRkYmV8XFx1ZDgwNVtcXHVkZGMxLVxcdWRkZGJdfFxcdWQ4MDVbXFx1ZGUwMC1cXHVkZTMyXXxcXHVkODA1XFx1ZGUzYnxcXHVkODA1XFx1ZGUzY3xcXHVkODA1XFx1ZGUzZXxcXHVkODA1W1xcdWRlNDEtXFx1ZGU0NF18XFx1ZDgwNVtcXHVkZTUwLVxcdWRlNTldfFxcdWQ4MDVbXFx1ZGU4MC1cXHVkZWFhXXxcXHVkODA1XFx1ZGVhY3xcXHVkODA1XFx1ZGVhZXxcXHVkODA1XFx1ZGVhZnxcXHVkODA1XFx1ZGViNnxcXHVkODA1W1xcdWRlYzAtXFx1ZGVjOV18XFx1ZDgwNVtcXHVkZjAwLVxcdWRmMTldfFxcdWQ4MDVcXHVkZjIwfFxcdWQ4MDVcXHVkZjIxfFxcdWQ4MDVcXHVkZjI2fFxcdWQ4MDVbXFx1ZGYzMC1cXHVkZjNmXXxcXHVkODA2W1xcdWRjYTAtXFx1ZGNmMl18XFx1ZDgwNlxcdWRjZmZ8XFx1ZDgwNltcXHVkZWMwLVxcdWRlZjhdfFxcdWQ4MDhbXFx1ZGMwMC1cXHVkZjk5XXxcXHVkODA5W1xcdWRjMDAtXFx1ZGM2ZV18XFx1ZDgwOVtcXHVkYzcwLVxcdWRjNzRdfFxcdWQ4MDlbXFx1ZGM4MC1cXHVkZDQzXXxcXHVkODBjW1xcdWRjMDAtXFx1ZGZmZl18XFx1ZDgwZFtcXHVkYzAwLVxcdWRjMmVdfFxcdWQ4MTFbXFx1ZGMwMC1cXHVkZTQ2XXxcXHVkODFhW1xcdWRjMDAtXFx1ZGUzOF18XFx1ZDgxYVtcXHVkZTQwLVxcdWRlNWVdfFxcdWQ4MWFbXFx1ZGU2MC1cXHVkZTY5XXxcXHVkODFhXFx1ZGU2ZXxcXHVkODFhXFx1ZGU2ZnxcXHVkODFhW1xcdWRlZDAtXFx1ZGVlZF18XFx1ZDgxYVxcdWRlZjV8XFx1ZDgxYVtcXHVkZjAwLVxcdWRmMmZdfFxcdWQ4MWFbXFx1ZGYzNy1cXHVkZjQ1XXxcXHVkODFhW1xcdWRmNTAtXFx1ZGY1OV18XFx1ZDgxYVtcXHVkZjViLVxcdWRmNjFdfFxcdWQ4MWFbXFx1ZGY2My1cXHVkZjc3XXxcXHVkODFhW1xcdWRmN2QtXFx1ZGY4Zl18XFx1ZDgxYltcXHVkZjAwLVxcdWRmNDRdfFxcdWQ4MWJbXFx1ZGY1MC1cXHVkZjdlXXxcXHVkODFiW1xcdWRmOTMtXFx1ZGY5Zl18XFx1ZDgyY1xcdWRjMDB8XFx1ZDgyY1xcdWRjMDF8XFx1ZDgyZltcXHVkYzAwLVxcdWRjNmFdfFxcdWQ4MmZbXFx1ZGM3MC1cXHVkYzdjXXxcXHVkODJmW1xcdWRjODAtXFx1ZGM4OF18XFx1ZDgyZltcXHVkYzkwLVxcdWRjOTldfFxcdWQ4MmZcXHVkYzljfFxcdWQ4MmZcXHVkYzlmfFxcdWQ4MzRbXFx1ZGMwMC1cXHVkY2Y1XXxcXHVkODM0W1xcdWRkMDAtXFx1ZGQyNl18XFx1ZDgzNFtcXHVkZDI5LVxcdWRkNjZdfFxcdWQ4MzRbXFx1ZGQ2YS1cXHVkZDcyXXxcXHVkODM0XFx1ZGQ4M3xcXHVkODM0XFx1ZGQ4NHxcXHVkODM0W1xcdWRkOGMtXFx1ZGRhOV18XFx1ZDgzNFtcXHVkZGFlLVxcdWRkZThdfFxcdWQ4MzRbXFx1ZGY2MC1cXHVkZjcxXXxcXHVkODM1W1xcdWRjMDAtXFx1ZGM1NF18XFx1ZDgzNVtcXHVkYzU2LVxcdWRjOWNdfFxcdWQ4MzVcXHVkYzllfFxcdWQ4MzVcXHVkYzlmfFxcdWQ4MzVcXHVkY2EyfFxcdWQ4MzVcXHVkY2E1fFxcdWQ4MzVcXHVkY2E2fFxcdWQ4MzVbXFx1ZGNhOS1cXHVkY2FjXXxcXHVkODM1W1xcdWRjYWUtXFx1ZGNiOV18XFx1ZDgzNVxcdWRjYmJ8XFx1ZDgzNVtcXHVkY2JkLVxcdWRjYzNdfFxcdWQ4MzVbXFx1ZGNjNS1cXHVkZDA1XXxcXHVkODM1W1xcdWRkMDctXFx1ZGQwYV18XFx1ZDgzNVtcXHVkZDBkLVxcdWRkMTRdfFxcdWQ4MzVbXFx1ZGQxNi1cXHVkZDFjXXxcXHVkODM1W1xcdWRkMWUtXFx1ZGQzOV18XFx1ZDgzNVtcXHVkZDNiLVxcdWRkM2VdfFxcdWQ4MzVbXFx1ZGQ0MC1cXHVkZDQ0XXxcXHVkODM1XFx1ZGQ0NnxcXHVkODM1W1xcdWRkNGEtXFx1ZGQ1MF18XFx1ZDgzNVtcXHVkZDUyLVxcdWRlYTVdfFxcdWQ4MzVbXFx1ZGVhOC1cXHVkZWRhXXxcXHVkODM1W1xcdWRlZGMtXFx1ZGYxNF18XFx1ZDgzNVtcXHVkZjE2LVxcdWRmNGVdfFxcdWQ4MzVbXFx1ZGY1MC1cXHVkZjg4XXxcXHVkODM1W1xcdWRmOGEtXFx1ZGZjMl18XFx1ZDgzNVtcXHVkZmM0LVxcdWRmY2JdfFxcdWQ4MzZbXFx1ZGMwMC1cXHVkZGZmXXxcXHVkODM2W1xcdWRlMzctXFx1ZGUzYV18XFx1ZDgzNltcXHVkZTZkLVxcdWRlNzRdfFxcdWQ4MzZbXFx1ZGU3Ni1cXHVkZTgzXXxcXHVkODM2W1xcdWRlODUtXFx1ZGU4Yl18XFx1ZDgzY1tcXHVkZDEwLVxcdWRkMmVdfFxcdWQ4M2NbXFx1ZGQzMC1cXHVkZDY5XXxcXHVkODNjW1xcdWRkNzAtXFx1ZGQ5YV18XFx1ZDgzY1tcXHVkZGU2LVxcdWRlMDJdfFxcdWQ4M2NbXFx1ZGUxMC1cXHVkZTNhXXxcXHVkODNjW1xcdWRlNDAtXFx1ZGU0OF18XFx1ZDgzY1xcdWRlNTB8XFx1ZDgzY1xcdWRlNTF8W1xcdWQ4NDAtXFx1ZDg2OF1bXFx1ZGMwMC1cXHVkZmZmXXxcXHVkODY5W1xcdWRjMDAtXFx1ZGVkNl18XFx1ZDg2OVtcXHVkZjAwLVxcdWRmZmZdfFtcXHVkODZhLVxcdWQ4NmNdW1xcdWRjMDAtXFx1ZGZmZl18XFx1ZDg2ZFtcXHVkYzAwLVxcdWRmMzRdfFxcdWQ4NmRbXFx1ZGY0MC1cXHVkZmZmXXxcXHVkODZlW1xcdWRjMDAtXFx1ZGMxZF18XFx1ZDg2ZVtcXHVkYzIwLVxcdWRmZmZdfFtcXHVkODZmLVxcdWQ4NzJdW1xcdWRjMDAtXFx1ZGZmZl18XFx1ZDg3M1tcXHVkYzAwLVxcdWRlYTFdfFxcdWQ4N2VbXFx1ZGMwMC1cXHVkZTFkXXxbXFx1ZGI4MC1cXHVkYmJlXVtcXHVkYzAwLVxcdWRmZmZdfFxcdWRiYmZbXFx1ZGMwMC1cXHVkZmZkXXxbXFx1ZGJjMC1cXHVkYmZlXVtcXHVkYzAwLVxcdWRmZmZdfFxcdWRiZmZbXFx1ZGMwMC1cXHVkZmZkXScgK1xuXHRcdFx0Jyl8KCcgK1xuXHRcdFx0XHQnW1xcdTA1OTBcXHUwNWJlXFx1MDVjMFxcdTA1YzNcXHUwNWM2XFx1MDVjOC1cXHUwNWZmXFx1MDdjMC1cXHUwN2VhXFx1MDdmNFxcdTA3ZjVcXHUwN2ZhLVxcdTA4MTVcXHUwODFhXFx1MDgyNFxcdTA4MjhcXHUwODJlLVxcdTA4NThcXHUwODVjLVxcdTA4OWZcXHUyMDBmXFx1ZmIxZFxcdWZiMWYtXFx1ZmIyOFxcdWZiMmEtXFx1ZmI0ZlxcdTA2MDhcXHUwNjBiXFx1MDYwZFxcdTA2MWItXFx1MDY0YVxcdTA2NmQtXFx1MDY2ZlxcdTA2NzEtXFx1MDZkNVxcdTA2ZTVcXHUwNmU2XFx1MDZlZVxcdTA2ZWZcXHUwNmZhLVxcdTA3MTBcXHUwNzEyLVxcdTA3MmZcXHUwNzRiLVxcdTA3YTVcXHUwN2IxLVxcdTA3YmZcXHUwOGEwLVxcdTA4ZTJcXHVmYjUwLVxcdWZkM2RcXHVmZDQwLVxcdWZkY2ZcXHVmZGYwLVxcdWZkZmNcXHVmZGZlXFx1ZmRmZlxcdWZlNzAtXFx1ZmVmZV18XFx1ZDgwMltcXHVkYzAwLVxcdWRkMWVdfFxcdWQ4MDJbXFx1ZGQyMC1cXHVkZTAwXXxcXHVkODAyXFx1ZGUwNHxcXHVkODAyW1xcdWRlMDctXFx1ZGUwYl18XFx1ZDgwMltcXHVkZTEwLVxcdWRlMzddfFxcdWQ4MDJbXFx1ZGUzYi1cXHVkZTNlXXxcXHVkODAyW1xcdWRlNDAtXFx1ZGVlNF18XFx1ZDgwMltcXHVkZWU3LVxcdWRmMzhdfFxcdWQ4MDJbXFx1ZGY0MC1cXHVkZmZmXXxcXHVkODAzW1xcdWRjMDAtXFx1ZGU1Zl18XFx1ZDgwM1tcXHVkZTdmLVxcdWRmZmZdfFxcdWQ4M2FbXFx1ZGMwMC1cXHVkY2NmXXxcXHVkODNhW1xcdWRjZDctXFx1ZGZmZl18XFx1ZDgzYltcXHVkYzAwLVxcdWRkZmZdfFxcdWQ4M2JbXFx1ZGYwMC1cXHVkZmZmXXxcXHVkODNiW1xcdWRmMDAtXFx1ZGZmZl18XFx1ZDgzYltcXHVkZjAwLVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGYwMC1cXHVkZmZmXXxcXHVkODNiW1xcdWRmMDAtXFx1ZGZmZl18XFx1ZDgzYltcXHVkZjAwLVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGYwMC1cXHVkZmZmXXxcXHVkODNiW1xcdWRmMDAtXFx1ZGZmZl18XFx1ZDgzYltcXHVkZjAwLVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGYwMC1cXHVkZmZmXXxcXHVkODNiW1xcdWRmMDAtXFx1ZGZmZl18XFx1ZDgzYltcXHVkZjAwLVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGYwMC1cXHVkZmZmXXxcXHVkODNiW1xcdWRlMDAtXFx1ZGVlZl18XFx1ZDgzYltcXHVkZWYyLVxcdWRlZmZdJyArXG5cdFx0XHQnKScgK1xuXHRcdCcpJ1xuXHQpO1xuXG5cdC8qKlxuXHQgKiBHZXRzIGRpcmVjdGlvbmFsaXR5IG9mIHRoZSBmaXJzdCBzdHJvbmdseSBkaXJlY3Rpb25hbCBjb2RlcG9pbnRcblx0ICpcblx0ICogVGhpcyBpcyB0aGUgcnVsZSB0aGUgQklESSBhbGdvcml0aG0gdXNlcyB0byBkZXRlcm1pbmUgdGhlIGRpcmVjdGlvbmFsaXR5IG9mXG5cdCAqIHBhcmFncmFwaHMgKCBodHRwOi8vdW5pY29kZS5vcmcvcmVwb3J0cy90cjkvI1RoZV9QYXJhZ3JhcGhfTGV2ZWwgKSBhbmRcblx0ICogRlNJIGlzb2xhdGVzICggaHR0cDovL3VuaWNvZGUub3JnL3JlcG9ydHMvdHI5LyNFeHBsaWNpdF9EaXJlY3Rpb25hbF9Jc29sYXRlcyApLlxuXHQgKlxuXHQgKiBUT0RPOiBEb2VzIG5vdCBoYW5kbGUgQklESSBjb250cm9sIGNoYXJhY3RlcnMgaW5zaWRlIHRoZSB0ZXh0LlxuXHQgKiBUT0RPOiBEb2VzIG5vdCBoYW5kbGUgdW5hbGxvY2F0ZWQgY2hhcmFjdGVycy5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHRleHQgZnJvbSB3aGljaCB0byBleHRyYWN0IGluaXRpYWwgZGlyZWN0aW9uYWxpdHkuXG5cdCAqIEByZXR1cm4ge3N0cmluZ30gRGlyZWN0aW9uYWxpdHkgKGVpdGhlciAnbHRyJyBvciAncnRsJylcblx0ICovXG5cdGZ1bmN0aW9uIHN0cm9uZ0RpckZyb21Db250ZW50KCB0ZXh0ICkge1xuXHRcdHZhciBtID0gdGV4dC5tYXRjaCggc3Ryb25nRGlyUmVnRXhwICk7XG5cdFx0aWYgKCAhbSApIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0XHRpZiAoIG1bIDIgXSA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0cmV0dXJuICdsdHInO1xuXHRcdH1cblx0XHRyZXR1cm4gJ3J0bCc7XG5cdH1cblxuXHQkLmV4dGVuZCggJC5pMThuLnBhcnNlci5lbWl0dGVyLCB7XG5cdFx0LyoqXG5cdFx0ICogV3JhcHMgYXJndW1lbnQgd2l0aCB1bmljb2RlIGNvbnRyb2wgY2hhcmFjdGVycyBmb3IgZGlyZWN0aW9uYWxpdHkgc2FmZXR5XG5cdFx0ICpcblx0XHQgKiBUaGlzIHNvbHZlcyB0aGUgcHJvYmxlbSB3aGVyZSBkaXJlY3Rpb25hbGl0eS1uZXV0cmFsIGNoYXJhY3RlcnMgYXQgdGhlIGVkZ2Ugb2Zcblx0XHQgKiB0aGUgYXJndW1lbnQgc3RyaW5nIGdldCBpbnRlcnByZXRlZCB3aXRoIHRoZSB3cm9uZyBkaXJlY3Rpb25hbGl0eSBmcm9tIHRoZVxuXHRcdCAqIGVuY2xvc2luZyBjb250ZXh0LCBnaXZpbmcgcmVuZGVyaW5ncyB0aGF0IGxvb2sgY29ycnVwdGVkIGxpa2UgXCIoQmVuXyhXTUZcIi5cblx0XHQgKlxuXHRcdCAqIFRoZSB3cmFwcGluZyBpcyBMUkUuLi5QREYgb3IgUkxFLi4uUERGLCBkZXBlbmRpbmcgb24gdGhlIGRldGVjdGVkXG5cdFx0ICogZGlyZWN0aW9uYWxpdHkgb2YgdGhlIGFyZ3VtZW50IHN0cmluZywgdXNpbmcgdGhlIEJJREkgYWxnb3JpdGhtJ3Mgb3duIFwiRmlyc3Rcblx0XHQgKiBzdHJvbmcgZGlyZWN0aW9uYWwgY29kZXBvaW50XCIgcnVsZS4gRXNzZW50aWFsbHksIHRoaXMgd29ya3Mgcm91bmQgdGhlIGZhY3QgdGhhdFxuXHRcdCAqIHRoZXJlIGlzIG5vIGVtYmVkZGluZyBlcXVpdmFsZW50IG9mIFUrMjA2OCBGU0kgKGlzb2xhdGlvbiB3aXRoIGhldXJpc3RpY1xuXHRcdCAqIGRpcmVjdGlvbiBpbmZlcmVuY2UpLiBUaGUgbGF0dGVyIGlzIGNsZWFuZXIgYnV0IHN0aWxsIG5vdCB3aWRlbHkgc3VwcG9ydGVkLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmdbXX0gbm9kZXMgVGhlIHRleHQgbm9kZXMgZnJvbSB3aGljaCB0byB0YWtlIHRoZSBmaXJzdCBpdGVtLlxuXHRcdCAqIEByZXR1cm4ge3N0cmluZ30gV3JhcHBlZCBTdHJpbmcgb2YgY29udGVudCBhcyBuZWVkZWQuXG5cdFx0ICovXG5cdFx0YmlkaTogZnVuY3Rpb24gKCBub2RlcyApIHtcblx0XHRcdHZhciBkaXIgPSBzdHJvbmdEaXJGcm9tQ29udGVudCggbm9kZXNbIDAgXSApO1xuXHRcdFx0aWYgKCBkaXIgPT09ICdsdHInICkge1xuXHRcdFx0XHQvLyBXcmFwIGluIExFRlQtVE8tUklHSFQgRU1CRURESU5HIC4uLiBQT1AgRElSRUNUSU9OQUwgRk9STUFUVElOR1xuXHRcdFx0XHRyZXR1cm4gJ1xcdTIwMkEnICsgbm9kZXNbIDAgXSArICdcXHUyMDJDJztcblx0XHRcdH1cblx0XHRcdGlmICggZGlyID09PSAncnRsJyApIHtcblx0XHRcdFx0Ly8gV3JhcCBpbiBSSUdIVC1UTy1MRUZUIEVNQkVERElORyAuLi4gUE9QIERJUkVDVElPTkFMIEZPUk1BVFRJTkdcblx0XHRcdFx0cmV0dXJuICdcXHUyMDJCJyArIG5vZGVzWyAwIF0gKyAnXFx1MjAyQyc7XG5cdFx0XHR9XG5cdFx0XHQvLyBObyBzdHJvbmcgZGlyZWN0aW9uYWxpdHk6IGRvIG5vdCB3cmFwXG5cdFx0XHRyZXR1cm4gbm9kZXNbIDAgXTtcblx0XHR9XG5cdH0gKTtcbn0oIGpRdWVyeSApICk7XG4iLCIvKiFcbiAqIGpRdWVyeSBJbnRlcm5hdGlvbmFsaXphdGlvbiBsaWJyYXJ5XG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDExLTIwMTMgU2FudGhvc2ggVGhvdHRpbmdhbCwgTmVpbCBLYW5kYWxnYW9ua2FyXG4gKlxuICoganF1ZXJ5LmkxOG4gaXMgZHVhbCBsaWNlbnNlZCBHUEx2MiBvciBsYXRlciBhbmQgTUlULiBZb3UgZG9uJ3QgaGF2ZSB0byBkb1xuICogYW55dGhpbmcgc3BlY2lhbCB0byBjaG9vc2Ugb25lIGxpY2Vuc2Ugb3IgdGhlIG90aGVyIGFuZCB5b3UgZG9uJ3QgaGF2ZSB0b1xuICogbm90aWZ5IGFueW9uZSB3aGljaCBsaWNlbnNlIHlvdSBhcmUgdXNpbmcuIFlvdSBhcmUgZnJlZSB0byB1c2VcbiAqIFVuaXZlcnNhbExhbmd1YWdlU2VsZWN0b3IgaW4gY29tbWVyY2lhbCBwcm9qZWN0cyBhcyBsb25nIGFzIHRoZSBjb3B5cmlnaHRcbiAqIGhlYWRlciBpcyBsZWZ0IGludGFjdC4gU2VlIGZpbGVzIEdQTC1MSUNFTlNFIGFuZCBNSVQtTElDRU5TRSBmb3IgZGV0YWlscy5cbiAqXG4gKiBAbGljZW5jZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5jZSAyLjAgb3IgbGF0ZXJcbiAqIEBsaWNlbmNlIE1JVCBMaWNlbnNlXG4gKi9cblxuKCBmdW5jdGlvbiAoICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgTWVzc2FnZVBhcnNlckVtaXR0ZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5sYW5ndWFnZSA9ICQuaTE4bi5sYW5ndWFnZXNbIFN0cmluZy5sb2NhbGUgXSB8fCAkLmkxOG4ubGFuZ3VhZ2VzWyAnZGVmYXVsdCcgXTtcblx0fTtcblxuXHRNZXNzYWdlUGFyc2VyRW1pdHRlci5wcm90b3R5cGUgPSB7XG5cdFx0Y29uc3RydWN0b3I6IE1lc3NhZ2VQYXJzZXJFbWl0dGVyLFxuXG5cdFx0LyoqXG5cdFx0ICogKFdlIHB1dCB0aGlzIG1ldGhvZCBkZWZpbml0aW9uIGhlcmUsIGFuZCBub3QgaW4gcHJvdG90eXBlLCB0byBtYWtlXG5cdFx0ICogc3VyZSBpdCdzIG5vdCBvdmVyd3JpdHRlbiBieSBhbnkgbWFnaWMuKSBXYWxrIGVudGlyZSBub2RlIHN0cnVjdHVyZSxcblx0XHQgKiBhcHBseWluZyByZXBsYWNlbWVudHMgYW5kIHRlbXBsYXRlIGZ1bmN0aW9ucyB3aGVuIGFwcHJvcHJpYXRlXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge01peGVkfSBub2RlIGFic3RyYWN0IHN5bnRheCB0cmVlICh0b3Agbm9kZSBvciBzdWJub2RlKVxuXHRcdCAqIEBwYXJhbSB7QXJyYXl9IHJlcGxhY2VtZW50cyBmb3IgJDEsICQyLCAuLi4gJG5cblx0XHQgKiBAcmV0dXJuIHtNaXhlZH0gc2luZ2xlLXN0cmluZyBub2RlIG9yIGFycmF5IG9mIG5vZGVzIHN1aXRhYmxlIGZvclxuXHRcdCAqICBqUXVlcnkgYXBwZW5kaW5nLlxuXHRcdCAqL1xuXHRcdGVtaXQ6IGZ1bmN0aW9uICggbm9kZSwgcmVwbGFjZW1lbnRzICkge1xuXHRcdFx0dmFyIHJldCwgc3Vibm9kZXMsIG9wZXJhdGlvbixcblx0XHRcdFx0bWVzc2FnZVBhcnNlckVtaXR0ZXIgPSB0aGlzO1xuXG5cdFx0XHRzd2l0Y2ggKCB0eXBlb2Ygbm9kZSApIHtcblx0XHRcdFx0Y2FzZSAnc3RyaW5nJzpcblx0XHRcdFx0Y2FzZSAnbnVtYmVyJzpcblx0XHRcdFx0XHRyZXQgPSBub2RlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdvYmplY3QnOlxuXHRcdFx0XHQvLyBub2RlIGlzIGFuIGFycmF5IG9mIG5vZGVzXG5cdFx0XHRcdFx0c3Vibm9kZXMgPSAkLm1hcCggbm9kZS5zbGljZSggMSApLCBmdW5jdGlvbiAoIG4gKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbWVzc2FnZVBhcnNlckVtaXR0ZXIuZW1pdCggbiwgcmVwbGFjZW1lbnRzICk7XG5cdFx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdFx0b3BlcmF0aW9uID0gbm9kZVsgMCBdLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRcdFx0XHRpZiAoIHR5cGVvZiBtZXNzYWdlUGFyc2VyRW1pdHRlclsgb3BlcmF0aW9uIF0gPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdFx0XHRyZXQgPSBtZXNzYWdlUGFyc2VyRW1pdHRlclsgb3BlcmF0aW9uIF0oIHN1Ym5vZGVzLCByZXBsYWNlbWVudHMgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCAndW5rbm93biBvcGVyYXRpb24gXCInICsgb3BlcmF0aW9uICsgJ1wiJyApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICd1bmRlZmluZWQnOlxuXHRcdFx0XHQvLyBQYXJzaW5nIHRoZSBlbXB0eSBzdHJpbmcgKGFzIGFuIGVudGlyZSBleHByZXNzaW9uLCBvciBhcyBhXG5cdFx0XHRcdC8vIHBhcmFtRXhwcmVzc2lvbiBpbiBhIHRlbXBsYXRlKSByZXN1bHRzIGluIHVuZGVmaW5lZFxuXHRcdFx0XHQvLyBQZXJoYXBzIGEgbW9yZSBjbGV2ZXIgcGFyc2VyIGNhbiBkZXRlY3QgdGhpcywgYW5kIHJldHVybiB0aGVcblx0XHRcdFx0Ly8gZW1wdHkgc3RyaW5nPyBPciBpcyB0aGF0IHVzZWZ1bCBpbmZvcm1hdGlvbj9cblx0XHRcdFx0Ly8gVGhlIGxvZ2ljYWwgdGhpbmcgaXMgcHJvYmFibHkgdG8gcmV0dXJuIHRoZSBlbXB0eSBzdHJpbmcgaGVyZVxuXHRcdFx0XHQvLyB3aGVuIHdlIGVuY291bnRlciB1bmRlZmluZWQuXG5cdFx0XHRcdFx0cmV0ID0gJyc7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCAndW5leHBlY3RlZCB0eXBlIGluIEFTVDogJyArIHR5cGVvZiBub2RlICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXQ7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFBhcnNpbmcgaGFzIGJlZW4gYXBwbGllZCBkZXB0aC1maXJzdCB3ZSBjYW4gYXNzdW1lIHRoYXQgYWxsIG5vZGVzXG5cdFx0ICogaGVyZSBhcmUgc2luZ2xlIG5vZGVzIE11c3QgcmV0dXJuIGEgc2luZ2xlIG5vZGUgdG8gcGFyZW50cyAtLSBhXG5cdFx0ICogalF1ZXJ5IHdpdGggc3ludGhldGljIHNwYW4gSG93ZXZlciwgdW53cmFwIGFueSBvdGhlciBzeW50aGV0aWMgc3BhbnNcblx0XHQgKiBpbiBvdXIgY2hpbGRyZW4gYW5kIHBhc3MgdGhlbSB1cHdhcmRzXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge0FycmF5fSBub2RlcyBNaXhlZCwgc29tZSBzaW5nbGUgbm9kZXMsIHNvbWUgYXJyYXlzIG9mIG5vZGVzLlxuXHRcdCAqIEByZXR1cm4ge3N0cmluZ31cblx0XHQgKi9cblx0XHRjb25jYXQ6IGZ1bmN0aW9uICggbm9kZXMgKSB7XG5cdFx0XHR2YXIgcmVzdWx0ID0gJyc7XG5cblx0XHRcdCQuZWFjaCggbm9kZXMsIGZ1bmN0aW9uICggaSwgbm9kZSApIHtcblx0XHRcdFx0Ly8gc3RyaW5ncywgaW50ZWdlcnMsIGFueXRoaW5nIGVsc2Vcblx0XHRcdFx0cmVzdWx0ICs9IG5vZGU7XG5cdFx0XHR9ICk7XG5cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFJldHVybiBlc2NhcGVkIHJlcGxhY2VtZW50IG9mIGNvcnJlY3QgaW5kZXgsIG9yIHN0cmluZyBpZlxuXHRcdCAqIHVuYXZhaWxhYmxlLiBOb3RlIHRoYXQgd2UgZXhwZWN0IHRoZSBwYXJzZWQgcGFyYW1ldGVyIHRvIGJlXG5cdFx0ICogemVyby1iYXNlZC4gaS5lLiAkMSBzaG91bGQgaGF2ZSBiZWNvbWUgWyAwIF0uIGlmIHRoZSBzcGVjaWZpZWRcblx0XHQgKiBwYXJhbWV0ZXIgaXMgbm90IGZvdW5kIHJldHVybiB0aGUgc2FtZSBzdHJpbmcgKGUuZy4gXCIkOTlcIiAtPlxuXHRcdCAqIHBhcmFtZXRlciA5OCAtPiBub3QgZm91bmQgLT4gcmV0dXJuIFwiJDk5XCIgKSBUT0RPIHRocm93IGVycm9yIGlmXG5cdFx0ICogbm9kZXMubGVuZ3RoID4gMSA/XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge0FycmF5fSBub2RlcyBPbmUgZWxlbWVudCwgaW50ZWdlciwgbiA+PSAwXG5cdFx0ICogQHBhcmFtIHtBcnJheX0gcmVwbGFjZW1lbnRzIGZvciAkMSwgJDIsIC4uLiAkblxuXHRcdCAqIEByZXR1cm4ge3N0cmluZ30gcmVwbGFjZW1lbnRcblx0XHQgKi9cblx0XHRyZXBsYWNlOiBmdW5jdGlvbiAoIG5vZGVzLCByZXBsYWNlbWVudHMgKSB7XG5cdFx0XHR2YXIgaW5kZXggPSBwYXJzZUludCggbm9kZXNbIDAgXSwgMTAgKTtcblxuXHRcdFx0aWYgKCBpbmRleCA8IHJlcGxhY2VtZW50cy5sZW5ndGggKSB7XG5cdFx0XHRcdC8vIHJlcGxhY2VtZW50IGlzIG5vdCBhIHN0cmluZywgZG9uJ3QgdG91Y2ghXG5cdFx0XHRcdHJldHVybiByZXBsYWNlbWVudHNbIGluZGV4IF07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBpbmRleCBub3QgZm91bmQsIGZhbGxiYWNrIHRvIGRpc3BsYXlpbmcgdmFyaWFibGVcblx0XHRcdFx0cmV0dXJuICckJyArICggaW5kZXggKyAxICk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFRyYW5zZm9ybSBwYXJzZWQgc3RydWN0dXJlIGludG8gcGx1cmFsaXphdGlvbiBuLmIuIFRoZSBmaXJzdCBub2RlIG1heVxuXHRcdCAqIGJlIGEgbm9uLWludGVnZXIgKGZvciBpbnN0YW5jZSwgYSBzdHJpbmcgcmVwcmVzZW50aW5nIGFuIEFyYWJpY1xuXHRcdCAqIG51bWJlcikuIFNvIGNvbnZlcnQgaXQgYmFjayB3aXRoIHRoZSBjdXJyZW50IGxhbmd1YWdlJ3Ncblx0XHQgKiBjb252ZXJ0TnVtYmVyLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtBcnJheX0gbm9kZXMgTGlzdCBbIHtTdHJpbmd8TnVtYmVyfSwge1N0cmluZ30sIHtTdHJpbmd9IC4uLiBdXG5cdFx0ICogQHJldHVybiB7c3RyaW5nfSBzZWxlY3RlZCBwbHVyYWxpemVkIGZvcm0gYWNjb3JkaW5nIHRvIGN1cnJlbnRcblx0XHQgKiAgbGFuZ3VhZ2UuXG5cdFx0ICovXG5cdFx0cGx1cmFsOiBmdW5jdGlvbiAoIG5vZGVzICkge1xuXHRcdFx0dmFyIGNvdW50ID0gcGFyc2VGbG9hdCggdGhpcy5sYW5ndWFnZS5jb252ZXJ0TnVtYmVyKCBub2Rlc1sgMCBdLCAxMCApICksXG5cdFx0XHRcdGZvcm1zID0gbm9kZXMuc2xpY2UoIDEgKTtcblxuXHRcdFx0cmV0dXJuIGZvcm1zLmxlbmd0aCA/IHRoaXMubGFuZ3VhZ2UuY29udmVydFBsdXJhbCggY291bnQsIGZvcm1zICkgOiAnJztcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogVHJhbnNmb3JtIHBhcnNlZCBzdHJ1Y3R1cmUgaW50byBnZW5kZXIgVXNhZ2Vcblx0XHQgKiB7e2dlbmRlcjpnZW5kZXJ8bWFzY3VsaW5lfGZlbWluaW5lfG5ldXRyYWx9fS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7QXJyYXl9IG5vZGVzIExpc3QgWyB7U3RyaW5nfSwge1N0cmluZ30sIHtTdHJpbmd9ICwge1N0cmluZ30gXVxuXHRcdCAqIEByZXR1cm4ge3N0cmluZ30gc2VsZWN0ZWQgZ2VuZGVyIGZvcm0gYWNjb3JkaW5nIHRvIGN1cnJlbnQgbGFuZ3VhZ2Vcblx0XHQgKi9cblx0XHRnZW5kZXI6IGZ1bmN0aW9uICggbm9kZXMgKSB7XG5cdFx0XHR2YXIgZ2VuZGVyID0gbm9kZXNbIDAgXSxcblx0XHRcdFx0Zm9ybXMgPSBub2Rlcy5zbGljZSggMSApO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5sYW5ndWFnZS5nZW5kZXIoIGdlbmRlciwgZm9ybXMgKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogVHJhbnNmb3JtIHBhcnNlZCBzdHJ1Y3R1cmUgaW50byBncmFtbWFyIGNvbnZlcnNpb24uIEludm9rZWQgYnlcblx0XHQgKiBwdXR0aW5nIHt7Z3JhbW1hcjpmb3JtfHdvcmR9fSBpbiBhIG1lc3NhZ2Vcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7QXJyYXl9IG5vZGVzIExpc3QgW3tHcmFtbWFyIGNhc2UgZWc6IGdlbml0aXZlfSwge1N0cmluZyB3b3JkfV1cblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd9IHNlbGVjdGVkIGdyYW1tYXRpY2FsIGZvcm0gYWNjb3JkaW5nIHRvIGN1cnJlbnRcblx0XHQgKiAgbGFuZ3VhZ2UuXG5cdFx0ICovXG5cdFx0Z3JhbW1hcjogZnVuY3Rpb24gKCBub2RlcyApIHtcblx0XHRcdHZhciBmb3JtID0gbm9kZXNbIDAgXSxcblx0XHRcdFx0d29yZCA9IG5vZGVzWyAxIF07XG5cblx0XHRcdHJldHVybiB3b3JkICYmIGZvcm0gJiYgdGhpcy5sYW5ndWFnZS5jb252ZXJ0R3JhbW1hciggd29yZCwgZm9ybSApO1xuXHRcdH1cblx0fTtcblxuXHQkLmV4dGVuZCggJC5pMThuLnBhcnNlci5lbWl0dGVyLCBuZXcgTWVzc2FnZVBhcnNlckVtaXR0ZXIoKSApO1xufSggalF1ZXJ5ICkgKTtcbiIsIi8qIVxuICogalF1ZXJ5IEludGVybmF0aW9uYWxpemF0aW9uIGxpYnJhcnlcbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTIgU2FudGhvc2ggVGhvdHRpbmdhbFxuICpcbiAqIGpxdWVyeS5pMThuIGlzIGR1YWwgbGljZW5zZWQgR1BMdjIgb3IgbGF0ZXIgYW5kIE1JVC4gWW91IGRvbid0IGhhdmUgdG8gZG8gYW55dGhpbmcgc3BlY2lhbCB0b1xuICogY2hvb3NlIG9uZSBsaWNlbnNlIG9yIHRoZSBvdGhlciBhbmQgeW91IGRvbid0IGhhdmUgdG8gbm90aWZ5IGFueW9uZSB3aGljaCBsaWNlbnNlIHlvdSBhcmUgdXNpbmcuXG4gKiBZb3UgYXJlIGZyZWUgdG8gdXNlIFVuaXZlcnNhbExhbmd1YWdlU2VsZWN0b3IgaW4gY29tbWVyY2lhbCBwcm9qZWN0cyBhcyBsb25nIGFzIHRoZSBjb3B5cmlnaHRcbiAqIGhlYWRlciBpcyBsZWZ0IGludGFjdC4gU2VlIGZpbGVzIEdQTC1MSUNFTlNFIGFuZCBNSVQtTElDRU5TRSBmb3IgZGV0YWlscy5cbiAqXG4gKiBAbGljZW5jZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5jZSAyLjAgb3IgbGF0ZXJcbiAqIEBsaWNlbmNlIE1JVCBMaWNlbnNlXG4gKi9cbiggZnVuY3Rpb24gKCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0JC5pMThuID0gJC5pMThuIHx8IHt9O1xuXHQkLmV4dGVuZCggJC5pMThuLmZhbGxiYWNrcywge1xuXHRcdGFiOiBbICdydScgXSxcblx0XHRhY2U6IFsgJ2lkJyBdLFxuXHRcdGFsbjogWyAnc3EnIF0sXG5cdFx0Ly8gTm90IHNvIHN0YW5kYXJkIC0gYWxzIGlzIHN1cHBvc2VkIHRvIGJlIFRvc2sgQWxiYW5pYW4sXG5cdFx0Ly8gYnV0IGluIFdpa2lwZWRpYSBpdCdzIHVzZWQgZm9yIGEgR2VybWFuaWMgbGFuZ3VhZ2UuXG5cdFx0YWxzOiBbICdnc3cnLCAnZGUnIF0sXG5cdFx0YW46IFsgJ2VzJyBdLFxuXHRcdGFucDogWyAnaGknIF0sXG5cdFx0YXJuOiBbICdlcycgXSxcblx0XHRhcno6IFsgJ2FyJyBdLFxuXHRcdGF2OiBbICdydScgXSxcblx0XHRheTogWyAnZXMnIF0sXG5cdFx0YmE6IFsgJ3J1JyBdLFxuXHRcdGJhcjogWyAnZGUnIF0sXG5cdFx0J2JhdC1zbWcnOiBbICdzZ3MnLCAnbHQnIF0sXG5cdFx0YmNjOiBbICdmYScgXSxcblx0XHQnYmUteC1vbGQnOiBbICdiZS10YXJhc2snIF0sXG5cdFx0Ymg6IFsgJ2JobycgXSxcblx0XHRiam46IFsgJ2lkJyBdLFxuXHRcdGJtOiBbICdmcicgXSxcblx0XHRicHk6IFsgJ2JuJyBdLFxuXHRcdGJxaTogWyAnZmEnIF0sXG5cdFx0YnVnOiBbICdpZCcgXSxcblx0XHQnY2JrLXphbSc6IFsgJ2VzJyBdLFxuXHRcdGNlOiBbICdydScgXSxcblx0XHRjcmg6IFsgJ2NyaC1sYXRuJyBdLFxuXHRcdCdjcmgtY3lybCc6IFsgJ3J1JyBdLFxuXHRcdGNzYjogWyAncGwnIF0sXG5cdFx0Y3Y6IFsgJ3J1JyBdLFxuXHRcdCdkZS1hdCc6IFsgJ2RlJyBdLFxuXHRcdCdkZS1jaCc6IFsgJ2RlJyBdLFxuXHRcdCdkZS1mb3JtYWwnOiBbICdkZScgXSxcblx0XHRkc2I6IFsgJ2RlJyBdLFxuXHRcdGR0cDogWyAnbXMnIF0sXG5cdFx0ZWdsOiBbICdpdCcgXSxcblx0XHRlbWw6IFsgJ2l0JyBdLFxuXHRcdGZmOiBbICdmcicgXSxcblx0XHRmaXQ6IFsgJ2ZpJyBdLFxuXHRcdCdmaXUtdnJvJzogWyAndnJvJywgJ2V0JyBdLFxuXHRcdGZyYzogWyAnZnInIF0sXG5cdFx0ZnJwOiBbICdmcicgXSxcblx0XHRmcnI6IFsgJ2RlJyBdLFxuXHRcdGZ1cjogWyAnaXQnIF0sXG5cdFx0Z2FnOiBbICd0cicgXSxcblx0XHRnYW46IFsgJ2dhbi1oYW50JywgJ3poLWhhbnQnLCAnemgtaGFucycgXSxcblx0XHQnZ2FuLWhhbnMnOiBbICd6aC1oYW5zJyBdLFxuXHRcdCdnYW4taGFudCc6IFsgJ3poLWhhbnQnLCAnemgtaGFucycgXSxcblx0XHRnbDogWyAncHQnIF0sXG5cdFx0Z2xrOiBbICdmYScgXSxcblx0XHRnbjogWyAnZXMnIF0sXG5cdFx0Z3N3OiBbICdkZScgXSxcblx0XHRoaWY6IFsgJ2hpZi1sYXRuJyBdLFxuXHRcdGhzYjogWyAnZGUnIF0sXG5cdFx0aHQ6IFsgJ2ZyJyBdLFxuXHRcdGlpOiBbICd6aC1jbicsICd6aC1oYW5zJyBdLFxuXHRcdGluaDogWyAncnUnIF0sXG5cdFx0aXU6IFsgJ2lrZS1jYW5zJyBdLFxuXHRcdGp1dDogWyAnZGEnIF0sXG5cdFx0anY6IFsgJ2lkJyBdLFxuXHRcdGthYTogWyAna2stbGF0bicsICdray1jeXJsJyBdLFxuXHRcdGtiZDogWyAna2JkLWN5cmwnIF0sXG5cdFx0a2h3OiBbICd1cicgXSxcblx0XHRraXU6IFsgJ3RyJyBdLFxuXHRcdGtrOiBbICdray1jeXJsJyBdLFxuXHRcdCdray1hcmFiJzogWyAna2stY3lybCcgXSxcblx0XHQna2stbGF0bic6IFsgJ2trLWN5cmwnIF0sXG5cdFx0J2trLWNuJzogWyAna2stYXJhYicsICdray1jeXJsJyBdLFxuXHRcdCdray1reic6IFsgJ2trLWN5cmwnIF0sXG5cdFx0J2trLXRyJzogWyAna2stbGF0bicsICdray1jeXJsJyBdLFxuXHRcdGtsOiBbICdkYScgXSxcblx0XHQna28ta3AnOiBbICdrbycgXSxcblx0XHRrb2k6IFsgJ3J1JyBdLFxuXHRcdGtyYzogWyAncnUnIF0sXG5cdFx0a3M6IFsgJ2tzLWFyYWInIF0sXG5cdFx0a3NoOiBbICdkZScgXSxcblx0XHRrdTogWyAna3UtbGF0bicgXSxcblx0XHQna3UtYXJhYic6IFsgJ2NrYicgXSxcblx0XHRrdjogWyAncnUnIF0sXG5cdFx0bGFkOiBbICdlcycgXSxcblx0XHRsYjogWyAnZGUnIF0sXG5cdFx0bGJlOiBbICdydScgXSxcblx0XHRsZXo6IFsgJ3J1JyBdLFxuXHRcdGxpOiBbICdubCcgXSxcblx0XHRsaWo6IFsgJ2l0JyBdLFxuXHRcdGxpdjogWyAnZXQnIF0sXG5cdFx0bG1vOiBbICdpdCcgXSxcblx0XHRsbjogWyAnZnInIF0sXG5cdFx0bHRnOiBbICdsdicgXSxcblx0XHRseno6IFsgJ3RyJyBdLFxuXHRcdG1haTogWyAnaGknIF0sXG5cdFx0J21hcC1ibXMnOiBbICdqdicsICdpZCcgXSxcblx0XHRtZzogWyAnZnInIF0sXG5cdFx0bWhyOiBbICdydScgXSxcblx0XHRtaW46IFsgJ2lkJyBdLFxuXHRcdG1vOiBbICdybycgXSxcblx0XHRtcmo6IFsgJ3J1JyBdLFxuXHRcdG13bDogWyAncHQnIF0sXG5cdFx0bXl2OiBbICdydScgXSxcblx0XHRtem46IFsgJ2ZhJyBdLFxuXHRcdG5haDogWyAnZXMnIF0sXG5cdFx0bmFwOiBbICdpdCcgXSxcblx0XHRuZHM6IFsgJ2RlJyBdLFxuXHRcdCduZHMtbmwnOiBbICdubCcgXSxcblx0XHQnbmwtaW5mb3JtYWwnOiBbICdubCcgXSxcblx0XHRubzogWyAnbmInIF0sXG5cdFx0b3M6IFsgJ3J1JyBdLFxuXHRcdHBjZDogWyAnZnInIF0sXG5cdFx0cGRjOiBbICdkZScgXSxcblx0XHRwZHQ6IFsgJ2RlJyBdLFxuXHRcdHBmbDogWyAnZGUnIF0sXG5cdFx0cG1zOiBbICdpdCcgXSxcblx0XHRwdDogWyAncHQtYnInIF0sXG5cdFx0J3B0LWJyJzogWyAncHQnIF0sXG5cdFx0cXU6IFsgJ2VzJyBdLFxuXHRcdHF1ZzogWyAncXUnLCAnZXMnIF0sXG5cdFx0cmduOiBbICdpdCcgXSxcblx0XHRybXk6IFsgJ3JvJyBdLFxuXHRcdCdyb2EtcnVwJzogWyAncnVwJyBdLFxuXHRcdHJ1ZTogWyAndWsnLCAncnUnIF0sXG5cdFx0cnVxOiBbICdydXEtbGF0bicsICdybycgXSxcblx0XHQncnVxLWN5cmwnOiBbICdtaycgXSxcblx0XHQncnVxLWxhdG4nOiBbICdybycgXSxcblx0XHRzYTogWyAnaGknIF0sXG5cdFx0c2FoOiBbICdydScgXSxcblx0XHRzY246IFsgJ2l0JyBdLFxuXHRcdHNnOiBbICdmcicgXSxcblx0XHRzZ3M6IFsgJ2x0JyBdLFxuXHRcdHNsaTogWyAnZGUnIF0sXG5cdFx0c3I6IFsgJ3NyLWVjJyBdLFxuXHRcdHNybjogWyAnbmwnIF0sXG5cdFx0c3RxOiBbICdkZScgXSxcblx0XHRzdTogWyAnaWQnIF0sXG5cdFx0c3psOiBbICdwbCcgXSxcblx0XHR0Y3k6IFsgJ2tuJyBdLFxuXHRcdHRnOiBbICd0Zy1jeXJsJyBdLFxuXHRcdHR0OiBbICd0dC1jeXJsJywgJ3J1JyBdLFxuXHRcdCd0dC1jeXJsJzogWyAncnUnIF0sXG5cdFx0dHk6IFsgJ2ZyJyBdLFxuXHRcdHVkbTogWyAncnUnIF0sXG5cdFx0dWc6IFsgJ3VnLWFyYWInIF0sXG5cdFx0dWs6IFsgJ3J1JyBdLFxuXHRcdHZlYzogWyAnaXQnIF0sXG5cdFx0dmVwOiBbICdldCcgXSxcblx0XHR2bHM6IFsgJ25sJyBdLFxuXHRcdHZtZjogWyAnZGUnIF0sXG5cdFx0dm90OiBbICdmaScgXSxcblx0XHR2cm86IFsgJ2V0JyBdLFxuXHRcdHdhOiBbICdmcicgXSxcblx0XHR3bzogWyAnZnInIF0sXG5cdFx0d3V1OiBbICd6aC1oYW5zJyBdLFxuXHRcdHhhbDogWyAncnUnIF0sXG5cdFx0eG1mOiBbICdrYScgXSxcblx0XHR5aTogWyAnaGUnIF0sXG5cdFx0emE6IFsgJ3poLWhhbnMnIF0sXG5cdFx0emVhOiBbICdubCcgXSxcblx0XHR6aDogWyAnemgtaGFucycgXSxcblx0XHQnemgtY2xhc3NpY2FsJzogWyAnbHpoJyBdLFxuXHRcdCd6aC1jbic6IFsgJ3poLWhhbnMnIF0sXG5cdFx0J3poLWhhbnQnOiBbICd6aC1oYW5zJyBdLFxuXHRcdCd6aC1oayc6IFsgJ3poLWhhbnQnLCAnemgtaGFucycgXSxcblx0XHQnemgtbWluLW5hbic6IFsgJ25hbicgXSxcblx0XHQnemgtbW8nOiBbICd6aC1oaycsICd6aC1oYW50JywgJ3poLWhhbnMnIF0sXG5cdFx0J3poLW15JzogWyAnemgtc2cnLCAnemgtaGFucycgXSxcblx0XHQnemgtc2cnOiBbICd6aC1oYW5zJyBdLFxuXHRcdCd6aC10dyc6IFsgJ3poLWhhbnQnLCAnemgtaGFucycgXSxcblx0XHQnemgteXVlJzogWyAneXVlJyBdXG5cdH0gKTtcbn0oIGpRdWVyeSApICk7XG4iLCIvKiFcbiAqIGpRdWVyeSBJbnRlcm5hdGlvbmFsaXphdGlvbiBsaWJyYXJ5XG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDEyIFNhbnRob3NoIFRob3R0aW5nYWxcbiAqXG4gKiBqcXVlcnkuaTE4biBpcyBkdWFsIGxpY2Vuc2VkIEdQTHYyIG9yIGxhdGVyIGFuZCBNSVQuIFlvdSBkb24ndCBoYXZlIHRvIGRvXG4gKiBhbnl0aGluZyBzcGVjaWFsIHRvIGNob29zZSBvbmUgbGljZW5zZSBvciB0aGUgb3RoZXIgYW5kIHlvdSBkb24ndCBoYXZlIHRvXG4gKiBub3RpZnkgYW55b25lIHdoaWNoIGxpY2Vuc2UgeW91IGFyZSB1c2luZy4gWW91IGFyZSBmcmVlIHRvIHVzZVxuICogVW5pdmVyc2FsTGFuZ3VhZ2VTZWxlY3RvciBpbiBjb21tZXJjaWFsIHByb2plY3RzIGFzIGxvbmcgYXMgdGhlIGNvcHlyaWdodFxuICogaGVhZGVyIGlzIGxlZnQgaW50YWN0LiBTZWUgZmlsZXMgR1BMLUxJQ0VOU0UgYW5kIE1JVC1MSUNFTlNFIGZvciBkZXRhaWxzLlxuICpcbiAqIEBsaWNlbmNlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbmNlIDIuMCBvciBsYXRlclxuICogQGxpY2VuY2UgTUlUIExpY2Vuc2VcbiAqL1xuXG4oIGZ1bmN0aW9uICggJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBJMThOLFxuXHRcdHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXHQvKipcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG5cdCAqL1xuXHRJMThOID0gZnVuY3Rpb24gKCBvcHRpb25zICkge1xuXHRcdC8vIExvYWQgZGVmYXVsdHNcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCgge30sIEkxOE4uZGVmYXVsdHMsIG9wdGlvbnMgKTtcblxuXHRcdHRoaXMucGFyc2VyID0gdGhpcy5vcHRpb25zLnBhcnNlcjtcblx0XHR0aGlzLmxvY2FsZSA9IHRoaXMub3B0aW9ucy5sb2NhbGU7XG5cdFx0dGhpcy5tZXNzYWdlU3RvcmUgPSB0aGlzLm9wdGlvbnMubWVzc2FnZVN0b3JlO1xuXHRcdHRoaXMubGFuZ3VhZ2VzID0ge307XG5cdH07XG5cblx0STE4Ti5wcm90b3R5cGUgPSB7XG5cdFx0LyoqXG5cdFx0ICogTG9jYWxpemUgYSBnaXZlbiBtZXNzYWdlS2V5IHRvIGEgbG9jYWxlLlxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlS2V5XG5cdFx0ICogQHJldHVybiB7U3RyaW5nfSBMb2NhbGl6ZWQgbWVzc2FnZVxuXHRcdCAqL1xuXHRcdGxvY2FsaXplOiBmdW5jdGlvbiAoIG1lc3NhZ2VLZXkgKSB7XG5cdFx0XHR2YXIgbG9jYWxlUGFydHMsIGxvY2FsZVBhcnRJbmRleCwgbG9jYWxlLCBmYWxsYmFja0luZGV4LFxuXHRcdFx0XHR0cnlpbmdMb2NhbGUsIG1lc3NhZ2U7XG5cblx0XHRcdGxvY2FsZSA9IHRoaXMubG9jYWxlO1xuXHRcdFx0ZmFsbGJhY2tJbmRleCA9IDA7XG5cblx0XHRcdHdoaWxlICggbG9jYWxlICkge1xuXHRcdFx0XHQvLyBJdGVyYXRlIHRocm91Z2ggbG9jYWxlcyBzdGFydGluZyBhdCBtb3N0LXNwZWNpZmljIHVudGlsXG5cdFx0XHRcdC8vIGxvY2FsaXphdGlvbiBpcyBmb3VuZC4gQXMgaW4gZmktTGF0bi1GSSwgZmktTGF0biBhbmQgZmkuXG5cdFx0XHRcdGxvY2FsZVBhcnRzID0gbG9jYWxlLnNwbGl0KCAnLScgKTtcblx0XHRcdFx0bG9jYWxlUGFydEluZGV4ID0gbG9jYWxlUGFydHMubGVuZ3RoO1xuXG5cdFx0XHRcdGRvIHtcblx0XHRcdFx0XHR0cnlpbmdMb2NhbGUgPSBsb2NhbGVQYXJ0cy5zbGljZSggMCwgbG9jYWxlUGFydEluZGV4ICkuam9pbiggJy0nICk7XG5cdFx0XHRcdFx0bWVzc2FnZSA9IHRoaXMubWVzc2FnZVN0b3JlLmdldCggdHJ5aW5nTG9jYWxlLCBtZXNzYWdlS2V5ICk7XG5cblx0XHRcdFx0XHRpZiAoIG1lc3NhZ2UgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbWVzc2FnZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRsb2NhbGVQYXJ0SW5kZXgtLTtcblx0XHRcdFx0fSB3aGlsZSAoIGxvY2FsZVBhcnRJbmRleCApO1xuXG5cdFx0XHRcdGlmICggbG9jYWxlID09PSAnZW4nICkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bG9jYWxlID0gKCAkLmkxOG4uZmFsbGJhY2tzWyB0aGlzLmxvY2FsZSBdICYmXG5cdFx0XHRcdFx0XHQkLmkxOG4uZmFsbGJhY2tzWyB0aGlzLmxvY2FsZSBdWyBmYWxsYmFja0luZGV4IF0gKSB8fFxuXHRcdFx0XHRcdFx0dGhpcy5vcHRpb25zLmZhbGxiYWNrTG9jYWxlO1xuXHRcdFx0XHQkLmkxOG4ubG9nKCAnVHJ5aW5nIGZhbGxiYWNrIGxvY2FsZSBmb3IgJyArIHRoaXMubG9jYWxlICsgJzogJyArIGxvY2FsZSArICcgKCcgKyBtZXNzYWdlS2V5ICsgJyknICk7XG5cblx0XHRcdFx0ZmFsbGJhY2tJbmRleCsrO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBrZXkgbm90IGZvdW5kXG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fSxcblxuXHRcdC8qXG5cdFx0ICogRGVzdHJveSB0aGUgaTE4biBpbnN0YW5jZS5cblx0XHQgKi9cblx0XHRkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHQkLnJlbW92ZURhdGEoIGRvY3VtZW50LCAnaTE4bicgKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogR2VuZXJhbCBtZXNzYWdlIGxvYWRpbmcgQVBJIFRoaXMgY2FuIHRha2UgYSBVUkwgc3RyaW5nIGZvclxuXHRcdCAqIHRoZSBqc29uIGZvcm1hdHRlZCBtZXNzYWdlcy4gRXhhbXBsZTpcblx0XHQgKiA8Y29kZT5sb2FkKCdwYXRoL3RvL2FsbF9sb2NhbGl6YXRpb25zLmpzb24nKTs8L2NvZGU+XG5cdFx0ICpcblx0XHQgKiBUbyBsb2FkIGEgbG9jYWxpemF0aW9uIGZpbGUgZm9yIGEgbG9jYWxlOlxuXHRcdCAqIDxjb2RlPlxuXHRcdCAqIGxvYWQoJ3BhdGgvdG8vZGUtbWVzc2FnZXMuanNvbicsICdkZScgKTtcblx0XHQgKiA8L2NvZGU+XG5cdFx0ICpcblx0XHQgKiBUbyBsb2FkIGEgbG9jYWxpemF0aW9uIGZpbGUgZnJvbSBhIGRpcmVjdG9yeTpcblx0XHQgKiA8Y29kZT5cblx0XHQgKiBsb2FkKCdwYXRoL3RvL2kxOG4vZGlyZWN0b3J5JywgJ2RlJyApO1xuXHRcdCAqIDwvY29kZT5cblx0XHQgKiBUaGUgYWJvdmUgbWV0aG9kIGhhcyB0aGUgYWR2YW50YWdlIG9mIGZhbGxiYWNrIHJlc29sdXRpb24uXG5cdFx0ICogaWUsIGl0IHdpbGwgYXV0b21hdGljYWxseSBsb2FkIHRoZSBmYWxsYmFjayBsb2NhbGVzIGZvciBkZS5cblx0XHQgKiBGb3IgbW9zdCB1c2VjYXNlcywgdGhpcyBpcyB0aGUgcmVjb21tZW5kZWQgbWV0aG9kLlxuXHRcdCAqIEl0IGlzIG9wdGlvbmFsIHRvIGhhdmUgdHJhaWxpbmcgc2xhc2ggYXQgZW5kLlxuXHRcdCAqXG5cdFx0ICogQSBkYXRhIG9iamVjdCBjb250YWluaW5nIG1lc3NhZ2Uga2V5LSBtZXNzYWdlIHRyYW5zbGF0aW9uIG1hcHBpbmdzXG5cdFx0ICogY2FuIGFsc28gYmUgcGFzc2VkLiBFeGFtcGxlOlxuXHRcdCAqIDxjb2RlPlxuXHRcdCAqIGxvYWQoIHsgJ2hlbGxvJyA6ICdIZWxsbycgfSwgb3B0aW9uYWxMb2NhbGUgKTtcblx0XHQgKiA8L2NvZGU+XG5cdFx0ICpcblx0XHQgKiBBIHNvdXJjZSBtYXAgY29udGFpbmluZyBrZXktdmFsdWUgcGFpciBvZiBsYW5ndWFnZW5hbWUgYW5kIGxvY2F0aW9uc1xuXHRcdCAqIGNhbiBhbHNvIGJlIHBhc3NlZC4gRXhhbXBsZTpcblx0XHQgKiA8Y29kZT5cblx0XHQgKiBsb2FkKCB7XG5cdFx0ICogYm46ICdpMThuL2JuLmpzb24nLFxuXHRcdCAqIGhlOiAnaTE4bi9oZS5qc29uJyxcblx0XHQgKiBlbjogJ2kxOG4vZW4uanNvbidcblx0XHQgKiB9IClcblx0XHQgKiA8L2NvZGU+XG5cdFx0ICpcblx0XHQgKiBJZiB0aGUgZGF0YSBhcmd1bWVudCBpcyBudWxsL3VuZGVmaW5lZC9mYWxzZSxcblx0XHQgKiBhbGwgY2FjaGVkIG1lc3NhZ2VzIGZvciB0aGUgaTE4biBpbnN0YW5jZSB3aWxsIGdldCByZXNldC5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfE9iamVjdH0gc291cmNlXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGxvY2FsZSBMYW5ndWFnZSB0YWdcblx0XHQgKiBAcmV0dXJuIHtqUXVlcnkuUHJvbWlzZX1cblx0XHQgKi9cblx0XHRsb2FkOiBmdW5jdGlvbiAoIHNvdXJjZSwgbG9jYWxlICkge1xuXHRcdFx0dmFyIGZhbGxiYWNrTG9jYWxlcywgbG9jSW5kZXgsIGZhbGxiYWNrTG9jYWxlLCBzb3VyY2VNYXAgPSB7fTtcblx0XHRcdGlmICggIXNvdXJjZSAmJiAhbG9jYWxlICkge1xuXHRcdFx0XHRzb3VyY2UgPSAnaTE4bi8nICsgJC5pMThuKCkubG9jYWxlICsgJy5qc29uJztcblx0XHRcdFx0bG9jYWxlID0gJC5pMThuKCkubG9jYWxlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCB0eXBlb2Ygc291cmNlID09PSAnc3RyaW5nJyAmJlxuXHRcdFx0XHQvLyBzb3VyY2UgZXh0ZW5zaW9uIHNob3VsZCBiZSBqc29uLCBidXQgY2FuIGhhdmUgcXVlcnkgcGFyYW1zIGFmdGVyIHRoYXQuXG5cdFx0XHRcdHNvdXJjZS5zcGxpdCggJz8nIClbIDAgXS5zcGxpdCggJy4nICkucG9wKCkgIT09ICdqc29uJ1xuXHRcdFx0KSB7XG5cdFx0XHRcdC8vIExvYWQgc3BlY2lmaWVkIGxvY2FsZSB0aGVuIGNoZWNrIGZvciBmYWxsYmFja3Mgd2hlbiBkaXJlY3RvcnkgaXNcblx0XHRcdFx0Ly8gc3BlY2lmaWVkIGluIGxvYWQoKVxuXHRcdFx0XHRzb3VyY2VNYXBbIGxvY2FsZSBdID0gc291cmNlICsgJy8nICsgbG9jYWxlICsgJy5qc29uJztcblx0XHRcdFx0ZmFsbGJhY2tMb2NhbGVzID0gKCAkLmkxOG4uZmFsbGJhY2tzWyBsb2NhbGUgXSB8fCBbXSApXG5cdFx0XHRcdFx0LmNvbmNhdCggdGhpcy5vcHRpb25zLmZhbGxiYWNrTG9jYWxlICk7XG5cdFx0XHRcdGZvciAoIGxvY0luZGV4ID0gMDsgbG9jSW5kZXggPCBmYWxsYmFja0xvY2FsZXMubGVuZ3RoOyBsb2NJbmRleCsrICkge1xuXHRcdFx0XHRcdGZhbGxiYWNrTG9jYWxlID0gZmFsbGJhY2tMb2NhbGVzWyBsb2NJbmRleCBdO1xuXHRcdFx0XHRcdHNvdXJjZU1hcFsgZmFsbGJhY2tMb2NhbGUgXSA9IHNvdXJjZSArICcvJyArIGZhbGxiYWNrTG9jYWxlICsgJy5qc29uJztcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5sb2FkKCBzb3VyY2VNYXAgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLm1lc3NhZ2VTdG9yZS5sb2FkKCBzb3VyY2UsIGxvY2FsZSApO1xuXHRcdFx0fVxuXG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIERvZXMgcGFyYW1ldGVyIGFuZCBtYWdpYyB3b3JkIHN1YnN0aXR1dGlvbi5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgTWVzc2FnZSBrZXlcblx0XHQgKiBAcGFyYW0ge0FycmF5fSBwYXJhbWV0ZXJzIE1lc3NhZ2UgcGFyYW1ldGVyc1xuXHRcdCAqIEByZXR1cm4ge3N0cmluZ31cblx0XHQgKi9cblx0XHRwYXJzZTogZnVuY3Rpb24gKCBrZXksIHBhcmFtZXRlcnMgKSB7XG5cdFx0XHR2YXIgbWVzc2FnZSA9IHRoaXMubG9jYWxpemUoIGtleSApO1xuXHRcdFx0Ly8gRklYTUU6IFRoaXMgY2hhbmdlcyB0aGUgc3RhdGUgb2YgdGhlIEkxOE4gb2JqZWN0LFxuXHRcdFx0Ly8gc2hvdWxkIHByb2JhYmx5IG5vdCBjaGFuZ2UgdGhlICd0aGlzLnBhcnNlcicgYnV0IGp1c3Rcblx0XHRcdC8vIHBhc3MgaXQgdG8gdGhlIHBhcnNlci5cblx0XHRcdHRoaXMucGFyc2VyLmxhbmd1YWdlID0gJC5pMThuLmxhbmd1YWdlc1sgJC5pMThuKCkubG9jYWxlIF0gfHwgJC5pMThuLmxhbmd1YWdlc1sgJ2RlZmF1bHQnIF07XG5cdFx0XHRpZiAoIG1lc3NhZ2UgPT09ICcnICkge1xuXHRcdFx0XHRtZXNzYWdlID0ga2V5O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMucGFyc2VyLnBhcnNlKCBtZXNzYWdlLCBwYXJhbWV0ZXJzICk7XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBQcm9jZXNzIGEgbWVzc2FnZSBmcm9tIHRoZSAkLkkxOE4gaW5zdGFuY2Vcblx0ICogZm9yIHRoZSBjdXJyZW50IGRvY3VtZW50LCBzdG9yZWQgaW4galF1ZXJ5LmRhdGEoZG9jdW1lbnQpLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30ga2V5IEtleSBvZiB0aGUgbWVzc2FnZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtMSBbcGFyYW0uLi5dIFZhcmlhZGljIGxpc3Qgb2YgcGFyYW1ldGVycyBmb3Ige2tleX0uXG5cdCAqIEByZXR1cm4ge3N0cmluZ3wkLkkxOE59IFBhcnNlZCBtZXNzYWdlLCBvciBpZiBubyBrZXkgd2FzIGdpdmVuXG5cdCAqIHRoZSBpbnN0YW5jZSBvZiAkLkkxOE4gaXMgcmV0dXJuZWQuXG5cdCAqL1xuXHQkLmkxOG4gPSBmdW5jdGlvbiAoIGtleSwgcGFyYW0xICkge1xuXHRcdHZhciBwYXJhbWV0ZXJzLFxuXHRcdFx0aTE4biA9ICQuZGF0YSggZG9jdW1lbnQsICdpMThuJyApLFxuXHRcdFx0b3B0aW9ucyA9IHR5cGVvZiBrZXkgPT09ICdvYmplY3QnICYmIGtleTtcblxuXHRcdC8vIElmIHRoZSBsb2NhbGUgb3B0aW9uIGZvciB0aGlzIGNhbGwgaXMgZGlmZmVyZW50IHRoZW4gdGhlIHNldHVwIHNvIGZhcixcblx0XHQvLyB1cGRhdGUgaXQgYXV0b21hdGljYWxseS4gVGhpcyBkb2Vzbid0IGp1c3QgY2hhbmdlIHRoZSBjb250ZXh0IGZvciB0aGlzXG5cdFx0Ly8gY2FsbCBidXQgZm9yIGFsbCBmdXR1cmUgY2FsbCBhcyB3ZWxsLlxuXHRcdC8vIElmIHRoZXJlIGlzIG5vIGkxOG4gc2V0dXAgeWV0LCBkb24ndCBkbyB0aGlzLiBJdCB3aWxsIGJlIHRha2VuIGNhcmUgb2Zcblx0XHQvLyBieSB0aGUgYG5ldyBJMThOYCBjb25zdHJ1Y3Rpb24gYmVsb3cuXG5cdFx0Ly8gTk9URTogSXQgc2hvdWxkIG9ubHkgY2hhbmdlIGxhbmd1YWdlIGZvciB0aGlzIG9uZSBjYWxsLlxuXHRcdC8vIFRoZW4gY2FjaGUgaW5zdGFuY2VzIG9mIEkxOE4gc29tZXdoZXJlLlxuXHRcdGlmICggb3B0aW9ucyAmJiBvcHRpb25zLmxvY2FsZSAmJiBpMThuICYmIGkxOG4ubG9jYWxlICE9PSBvcHRpb25zLmxvY2FsZSApIHtcblx0XHRcdGkxOG4ubG9jYWxlID0gb3B0aW9ucy5sb2NhbGU7XG5cdFx0fVxuXG5cdFx0aWYgKCAhaTE4biApIHtcblx0XHRcdGkxOG4gPSBuZXcgSTE4Tiggb3B0aW9ucyApO1xuXHRcdFx0JC5kYXRhKCBkb2N1bWVudCwgJ2kxOG4nLCBpMThuICk7XG5cdFx0fVxuXG5cdFx0aWYgKCB0eXBlb2Yga2V5ID09PSAnc3RyaW5nJyApIHtcblx0XHRcdGlmICggcGFyYW0xICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdHBhcmFtZXRlcnMgPSBzbGljZS5jYWxsKCBhcmd1bWVudHMsIDEgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHBhcmFtZXRlcnMgPSBbXTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGkxOG4ucGFyc2UoIGtleSwgcGFyYW1ldGVycyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBGSVhNRTogcmVtb3ZlIHRoaXMgZmVhdHVyZS9idWcuXG5cdFx0XHRyZXR1cm4gaTE4bjtcblx0XHR9XG5cdH07XG5cblx0JC5mbi5pMThuID0gZnVuY3Rpb24gKCkge1xuXHRcdHZhciBpMThuID0gJC5kYXRhKCBkb2N1bWVudCwgJ2kxOG4nICk7XG5cblx0XHRpZiAoICFpMThuICkge1xuXHRcdFx0aTE4biA9IG5ldyBJMThOKCk7XG5cdFx0XHQkLmRhdGEoIGRvY3VtZW50LCAnaTE4bicsIGkxOG4gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKCB0aGlzICksXG5cdFx0XHRcdG1lc3NhZ2VLZXkgPSAkdGhpcy5kYXRhKCAnaTE4bicgKSxcblx0XHRcdFx0bEJyYWNrZXQsIHJCcmFja2V0LCB0eXBlLCBrZXk7XG5cblx0XHRcdGlmICggbWVzc2FnZUtleSApIHtcblx0XHRcdFx0bEJyYWNrZXQgPSBtZXNzYWdlS2V5LmluZGV4T2YoICdbJyApO1xuXHRcdFx0XHRyQnJhY2tldCA9IG1lc3NhZ2VLZXkuaW5kZXhPZiggJ10nICk7XG5cdFx0XHRcdGlmICggbEJyYWNrZXQgIT09IC0xICYmIHJCcmFja2V0ICE9PSAtMSAmJiBsQnJhY2tldCA8IHJCcmFja2V0ICkge1xuXHRcdFx0XHRcdHR5cGUgPSBtZXNzYWdlS2V5LnNsaWNlKCBsQnJhY2tldCArIDEsIHJCcmFja2V0ICk7XG5cdFx0XHRcdFx0a2V5ID0gbWVzc2FnZUtleS5zbGljZSggckJyYWNrZXQgKyAxICk7XG5cdFx0XHRcdFx0aWYgKCB0eXBlID09PSAnaHRtbCcgKSB7XG5cdFx0XHRcdFx0XHQkdGhpcy5odG1sKCBpMThuLnBhcnNlKCBrZXkgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkdGhpcy5hdHRyKCB0eXBlLCBpMThuLnBhcnNlKCBrZXkgKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkdGhpcy50ZXh0KCBpMThuLnBhcnNlKCBtZXNzYWdlS2V5ICkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHRoaXMuZmluZCggJ1tkYXRhLWkxOG5dJyApLmkxOG4oKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH07XG5cblx0ZnVuY3Rpb24gZ2V0RGVmYXVsdExvY2FsZSgpIHtcblx0XHR2YXIgbmF2LCBsb2NhbGUgPSAkKCAnaHRtbCcgKS5hdHRyKCAnbGFuZycgKTtcblxuXHRcdGlmICggIWxvY2FsZSApIHtcblx0XHRcdGlmICggdHlwZW9mIHdpbmRvdy5uYXZpZ2F0b3IgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0bmF2ID0gd2luZG93Lm5hdmlnYXRvcjtcblx0XHRcdFx0bG9jYWxlID0gbmF2Lmxhbmd1YWdlIHx8IG5hdi51c2VyTGFuZ3VhZ2UgfHwgJyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsb2NhbGUgPSAnJztcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGxvY2FsZTtcblx0fVxuXG5cdCQuaTE4bi5sYW5ndWFnZXMgPSB7fTtcblx0JC5pMThuLm1lc3NhZ2VTdG9yZSA9ICQuaTE4bi5tZXNzYWdlU3RvcmUgfHwge307XG5cdCQuaTE4bi5wYXJzZXIgPSB7XG5cdFx0Ly8gVGhlIGRlZmF1bHQgcGFyc2VyIG9ubHkgaGFuZGxlcyB2YXJpYWJsZSBzdWJzdGl0dXRpb25cblx0XHRwYXJzZTogZnVuY3Rpb24gKCBtZXNzYWdlLCBwYXJhbWV0ZXJzICkge1xuXHRcdFx0cmV0dXJuIG1lc3NhZ2UucmVwbGFjZSggL1xcJChcXGQrKS9nLCBmdW5jdGlvbiAoIHN0ciwgbWF0Y2ggKSB7XG5cdFx0XHRcdHZhciBpbmRleCA9IHBhcnNlSW50KCBtYXRjaCwgMTAgKSAtIDE7XG5cdFx0XHRcdHJldHVybiBwYXJhbWV0ZXJzWyBpbmRleCBdICE9PSB1bmRlZmluZWQgPyBwYXJhbWV0ZXJzWyBpbmRleCBdIDogJyQnICsgbWF0Y2g7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRlbWl0dGVyOiB7fVxuXHR9O1xuXHQkLmkxOG4uZmFsbGJhY2tzID0ge307XG5cdCQuaTE4bi5kZWJ1ZyA9IGZhbHNlO1xuXHQkLmkxOG4ubG9nID0gZnVuY3Rpb24gKCAvKiBhcmd1bWVudHMgKi8gKSB7XG5cdFx0aWYgKCB3aW5kb3cuY29uc29sZSAmJiAkLmkxOG4uZGVidWcgKSB7XG5cdFx0XHR3aW5kb3cuY29uc29sZS5sb2cuYXBwbHkoIHdpbmRvdy5jb25zb2xlLCBhcmd1bWVudHMgKTtcblx0XHR9XG5cdH07XG5cdC8qIFN0YXRpYyBtZW1iZXJzICovXG5cdEkxOE4uZGVmYXVsdHMgPSB7XG5cdFx0bG9jYWxlOiBnZXREZWZhdWx0TG9jYWxlKCksXG5cdFx0ZmFsbGJhY2tMb2NhbGU6ICdlbicsXG5cdFx0cGFyc2VyOiAkLmkxOG4ucGFyc2VyLFxuXHRcdG1lc3NhZ2VTdG9yZTogJC5pMThuLm1lc3NhZ2VTdG9yZVxuXHR9O1xuXG5cdC8vIEV4cG9zZSBjb25zdHJ1Y3RvclxuXHQkLmkxOG4uY29uc3RydWN0b3IgPSBJMThOO1xufSggalF1ZXJ5ICkgKTsiLCIvKiBnbG9iYWwgcGx1cmFsUnVsZVBhcnNlciAqL1xuKCBmdW5jdGlvbiAoICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvLyBqc2NzOmRpc2FibGVcblx0dmFyIGxhbmd1YWdlID0ge1xuXHRcdC8vIENMRFIgcGx1cmFsIHJ1bGVzIGdlbmVyYXRlZCB1c2luZ1xuXHRcdC8vIGxpYnMvQ0xEUlBsdXJhbFJ1bGVQYXJzZXIvdG9vbHMvUGx1cmFsWE1MMkpTT04uaHRtbFxuXHRcdHBsdXJhbFJ1bGVzOiB7XG5cdFx0XHRhazoge1xuXHRcdFx0XHRvbmU6ICduID0gMC4uMSdcblx0XHRcdH0sXG5cdFx0XHRhbToge1xuXHRcdFx0XHRvbmU6ICdpID0gMCBvciBuID0gMSdcblx0XHRcdH0sXG5cdFx0XHRhcjoge1xuXHRcdFx0XHR6ZXJvOiAnbiA9IDAnLFxuXHRcdFx0XHRvbmU6ICduID0gMScsXG5cdFx0XHRcdHR3bzogJ24gPSAyJyxcblx0XHRcdFx0ZmV3OiAnbiAlIDEwMCA9IDMuLjEwJyxcblx0XHRcdFx0bWFueTogJ24gJSAxMDAgPSAxMS4uOTknXG5cdFx0XHR9LFxuXHRcdFx0YXJzOiB7XG5cdFx0XHRcdHplcm86ICduID0gMCcsXG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInLFxuXHRcdFx0XHRmZXc6ICduICUgMTAwID0gMy4uMTAnLFxuXHRcdFx0XHRtYW55OiAnbiAlIDEwMCA9IDExLi45OSdcblx0XHRcdH0sXG5cdFx0XHRhczoge1xuXHRcdFx0XHRvbmU6ICdpID0gMCBvciBuID0gMSdcblx0XHRcdH0sXG5cdFx0XHRiZToge1xuXHRcdFx0XHRvbmU6ICduICUgMTAgPSAxIGFuZCBuICUgMTAwICE9IDExJyxcblx0XHRcdFx0ZmV3OiAnbiAlIDEwID0gMi4uNCBhbmQgbiAlIDEwMCAhPSAxMi4uMTQnLFxuXHRcdFx0XHRtYW55OiAnbiAlIDEwID0gMCBvciBuICUgMTAgPSA1Li45IG9yIG4gJSAxMDAgPSAxMS4uMTQnXG5cdFx0XHR9LFxuXHRcdFx0Ymg6IHtcblx0XHRcdFx0b25lOiAnbiA9IDAuLjEnXG5cdFx0XHR9LFxuXHRcdFx0Ym46IHtcblx0XHRcdFx0b25lOiAnaSA9IDAgb3IgbiA9IDEnXG5cdFx0XHR9LFxuXHRcdFx0YnI6IHtcblx0XHRcdFx0b25lOiAnbiAlIDEwID0gMSBhbmQgbiAlIDEwMCAhPSAxMSw3MSw5MScsXG5cdFx0XHRcdHR3bzogJ24gJSAxMCA9IDIgYW5kIG4gJSAxMDAgIT0gMTIsNzIsOTInLFxuXHRcdFx0XHRmZXc6ICduICUgMTAgPSAzLi40LDkgYW5kIG4gJSAxMDAgIT0gMTAuLjE5LDcwLi43OSw5MC4uOTknLFxuXHRcdFx0XHRtYW55OiAnbiAhPSAwIGFuZCBuICUgMTAwMDAwMCA9IDAnXG5cdFx0XHR9LFxuXHRcdFx0YnM6IHtcblx0XHRcdFx0b25lOiAndiA9IDAgYW5kIGkgJSAxMCA9IDEgYW5kIGkgJSAxMDAgIT0gMTEgb3IgZiAlIDEwID0gMSBhbmQgZiAlIDEwMCAhPSAxMScsXG5cdFx0XHRcdGZldzogJ3YgPSAwIGFuZCBpICUgMTAgPSAyLi40IGFuZCBpICUgMTAwICE9IDEyLi4xNCBvciBmICUgMTAgPSAyLi40IGFuZCBmICUgMTAwICE9IDEyLi4xNCdcblx0XHRcdH0sXG5cdFx0XHRjczoge1xuXHRcdFx0XHRvbmU6ICdpID0gMSBhbmQgdiA9IDAnLFxuXHRcdFx0XHRmZXc6ICdpID0gMi4uNCBhbmQgdiA9IDAnLFxuXHRcdFx0XHRtYW55OiAndiAhPSAwJ1xuXHRcdFx0fSxcblx0XHRcdGN5OiB7XG5cdFx0XHRcdHplcm86ICduID0gMCcsXG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInLFxuXHRcdFx0XHRmZXc6ICduID0gMycsXG5cdFx0XHRcdG1hbnk6ICduID0gNidcblx0XHRcdH0sXG5cdFx0XHRkYToge1xuXHRcdFx0XHRvbmU6ICduID0gMSBvciB0ICE9IDAgYW5kIGkgPSAwLDEnXG5cdFx0XHR9LFxuXHRcdFx0ZHNiOiB7XG5cdFx0XHRcdG9uZTogJ3YgPSAwIGFuZCBpICUgMTAwID0gMSBvciBmICUgMTAwID0gMScsXG5cdFx0XHRcdHR3bzogJ3YgPSAwIGFuZCBpICUgMTAwID0gMiBvciBmICUgMTAwID0gMicsXG5cdFx0XHRcdGZldzogJ3YgPSAwIGFuZCBpICUgMTAwID0gMy4uNCBvciBmICUgMTAwID0gMy4uNCdcblx0XHRcdH0sXG5cdFx0XHRmYToge1xuXHRcdFx0XHRvbmU6ICdpID0gMCBvciBuID0gMSdcblx0XHRcdH0sXG5cdFx0XHRmZjoge1xuXHRcdFx0XHRvbmU6ICdpID0gMCwxJ1xuXHRcdFx0fSxcblx0XHRcdGZpbDoge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSA9IDEsMiwzIG9yIHYgPSAwIGFuZCBpICUgMTAgIT0gNCw2LDkgb3IgdiAhPSAwIGFuZCBmICUgMTAgIT0gNCw2LDknXG5cdFx0XHR9LFxuXHRcdFx0ZnI6IHtcblx0XHRcdFx0b25lOiAnaSA9IDAsMSdcblx0XHRcdH0sXG5cdFx0XHRnYToge1xuXHRcdFx0XHRvbmU6ICduID0gMScsXG5cdFx0XHRcdHR3bzogJ24gPSAyJyxcblx0XHRcdFx0ZmV3OiAnbiA9IDMuLjYnLFxuXHRcdFx0XHRtYW55OiAnbiA9IDcuLjEwJ1xuXHRcdFx0fSxcblx0XHRcdGdkOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxLDExJyxcblx0XHRcdFx0dHdvOiAnbiA9IDIsMTInLFxuXHRcdFx0XHRmZXc6ICduID0gMy4uMTAsMTMuLjE5J1xuXHRcdFx0fSxcblx0XHRcdGd1OiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwIG9yIG4gPSAxJ1xuXHRcdFx0fSxcblx0XHRcdGd1dzoge1xuXHRcdFx0XHRvbmU6ICduID0gMC4uMSdcblx0XHRcdH0sXG5cdFx0XHRndjoge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSAlIDEwID0gMScsXG5cdFx0XHRcdHR3bzogJ3YgPSAwIGFuZCBpICUgMTAgPSAyJyxcblx0XHRcdFx0ZmV3OiAndiA9IDAgYW5kIGkgJSAxMDAgPSAwLDIwLDQwLDYwLDgwJyxcblx0XHRcdFx0bWFueTogJ3YgIT0gMCdcblx0XHRcdH0sXG5cdFx0XHRoZToge1xuXHRcdFx0XHRvbmU6ICdpID0gMSBhbmQgdiA9IDAnLFxuXHRcdFx0XHR0d286ICdpID0gMiBhbmQgdiA9IDAnLFxuXHRcdFx0XHRtYW55OiAndiA9IDAgYW5kIG4gIT0gMC4uMTAgYW5kIG4gJSAxMCA9IDAnXG5cdFx0XHR9LFxuXHRcdFx0aGk6IHtcblx0XHRcdFx0b25lOiAnaSA9IDAgb3IgbiA9IDEnXG5cdFx0XHR9LFxuXHRcdFx0aHI6IHtcblx0XHRcdFx0b25lOiAndiA9IDAgYW5kIGkgJSAxMCA9IDEgYW5kIGkgJSAxMDAgIT0gMTEgb3IgZiAlIDEwID0gMSBhbmQgZiAlIDEwMCAhPSAxMScsXG5cdFx0XHRcdGZldzogJ3YgPSAwIGFuZCBpICUgMTAgPSAyLi40IGFuZCBpICUgMTAwICE9IDEyLi4xNCBvciBmICUgMTAgPSAyLi40IGFuZCBmICUgMTAwICE9IDEyLi4xNCdcblx0XHRcdH0sXG5cdFx0XHRoc2I6IHtcblx0XHRcdFx0b25lOiAndiA9IDAgYW5kIGkgJSAxMDAgPSAxIG9yIGYgJSAxMDAgPSAxJyxcblx0XHRcdFx0dHdvOiAndiA9IDAgYW5kIGkgJSAxMDAgPSAyIG9yIGYgJSAxMDAgPSAyJyxcblx0XHRcdFx0ZmV3OiAndiA9IDAgYW5kIGkgJSAxMDAgPSAzLi40IG9yIGYgJSAxMDAgPSAzLi40J1xuXHRcdFx0fSxcblx0XHRcdGh5OiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwLDEnXG5cdFx0XHR9LFxuXHRcdFx0aXM6IHtcblx0XHRcdFx0b25lOiAndCA9IDAgYW5kIGkgJSAxMCA9IDEgYW5kIGkgJSAxMDAgIT0gMTEgb3IgdCAhPSAwJ1xuXHRcdFx0fSxcblx0XHRcdGl1OiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInXG5cdFx0XHR9LFxuXHRcdFx0aXc6IHtcblx0XHRcdFx0b25lOiAnaSA9IDEgYW5kIHYgPSAwJyxcblx0XHRcdFx0dHdvOiAnaSA9IDIgYW5kIHYgPSAwJyxcblx0XHRcdFx0bWFueTogJ3YgPSAwIGFuZCBuICE9IDAuLjEwIGFuZCBuICUgMTAgPSAwJ1xuXHRcdFx0fSxcblx0XHRcdGthYjoge1xuXHRcdFx0XHRvbmU6ICdpID0gMCwxJ1xuXHRcdFx0fSxcblx0XHRcdGtuOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwIG9yIG4gPSAxJ1xuXHRcdFx0fSxcblx0XHRcdGt3OiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInXG5cdFx0XHR9LFxuXHRcdFx0bGFnOiB7XG5cdFx0XHRcdHplcm86ICduID0gMCcsXG5cdFx0XHRcdG9uZTogJ2kgPSAwLDEgYW5kIG4gIT0gMCdcblx0XHRcdH0sXG5cdFx0XHRsbjoge1xuXHRcdFx0XHRvbmU6ICduID0gMC4uMSdcblx0XHRcdH0sXG5cdFx0XHRsdDoge1xuXHRcdFx0XHRvbmU6ICduICUgMTAgPSAxIGFuZCBuICUgMTAwICE9IDExLi4xOScsXG5cdFx0XHRcdGZldzogJ24gJSAxMCA9IDIuLjkgYW5kIG4gJSAxMDAgIT0gMTEuLjE5Jyxcblx0XHRcdFx0bWFueTogJ2YgIT0gMCdcblx0XHRcdH0sXG5cdFx0XHRsdjoge1xuXHRcdFx0XHR6ZXJvOiAnbiAlIDEwID0gMCBvciBuICUgMTAwID0gMTEuLjE5IG9yIHYgPSAyIGFuZCBmICUgMTAwID0gMTEuLjE5Jyxcblx0XHRcdFx0b25lOiAnbiAlIDEwID0gMSBhbmQgbiAlIDEwMCAhPSAxMSBvciB2ID0gMiBhbmQgZiAlIDEwID0gMSBhbmQgZiAlIDEwMCAhPSAxMSBvciB2ICE9IDIgYW5kIGYgJSAxMCA9IDEnXG5cdFx0XHR9LFxuXHRcdFx0bWc6IHtcblx0XHRcdFx0b25lOiAnbiA9IDAuLjEnXG5cdFx0XHR9LFxuXHRcdFx0bWs6IHtcblx0XHRcdFx0b25lOiAndiA9IDAgYW5kIGkgJSAxMCA9IDEgb3IgZiAlIDEwID0gMSdcblx0XHRcdH0sXG5cdFx0XHRtbzoge1xuXHRcdFx0XHRvbmU6ICdpID0gMSBhbmQgdiA9IDAnLFxuXHRcdFx0XHRmZXc6ICd2ICE9IDAgb3IgbiA9IDAgb3IgbiAhPSAxIGFuZCBuICUgMTAwID0gMS4uMTknXG5cdFx0XHR9LFxuXHRcdFx0bXI6IHtcblx0XHRcdFx0b25lOiAnaSA9IDAgb3IgbiA9IDEnXG5cdFx0XHR9LFxuXHRcdFx0bXQ6IHtcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHRmZXc6ICduID0gMCBvciBuICUgMTAwID0gMi4uMTAnLFxuXHRcdFx0XHRtYW55OiAnbiAlIDEwMCA9IDExLi4xOSdcblx0XHRcdH0sXG5cdFx0XHRuYXE6IHtcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMidcblx0XHRcdH0sXG5cdFx0XHRuc286IHtcblx0XHRcdFx0b25lOiAnbiA9IDAuLjEnXG5cdFx0XHR9LFxuXHRcdFx0cGE6IHtcblx0XHRcdFx0b25lOiAnbiA9IDAuLjEnXG5cdFx0XHR9LFxuXHRcdFx0cGw6IHtcblx0XHRcdFx0b25lOiAnaSA9IDEgYW5kIHYgPSAwJyxcblx0XHRcdFx0ZmV3OiAndiA9IDAgYW5kIGkgJSAxMCA9IDIuLjQgYW5kIGkgJSAxMDAgIT0gMTIuLjE0Jyxcblx0XHRcdFx0bWFueTogJ3YgPSAwIGFuZCBpICE9IDEgYW5kIGkgJSAxMCA9IDAuLjEgb3IgdiA9IDAgYW5kIGkgJSAxMCA9IDUuLjkgb3IgdiA9IDAgYW5kIGkgJSAxMDAgPSAxMi4uMTQnXG5cdFx0XHR9LFxuXHRcdFx0cHJnOiB7XG5cdFx0XHRcdHplcm86ICduICUgMTAgPSAwIG9yIG4gJSAxMDAgPSAxMS4uMTkgb3IgdiA9IDIgYW5kIGYgJSAxMDAgPSAxMS4uMTknLFxuXHRcdFx0XHRvbmU6ICduICUgMTAgPSAxIGFuZCBuICUgMTAwICE9IDExIG9yIHYgPSAyIGFuZCBmICUgMTAgPSAxIGFuZCBmICUgMTAwICE9IDExIG9yIHYgIT0gMiBhbmQgZiAlIDEwID0gMSdcblx0XHRcdH0sXG5cdFx0XHRwdDoge1xuXHRcdFx0XHRvbmU6ICdpID0gMC4uMSdcblx0XHRcdH0sXG5cdFx0XHRybzoge1xuXHRcdFx0XHRvbmU6ICdpID0gMSBhbmQgdiA9IDAnLFxuXHRcdFx0XHRmZXc6ICd2ICE9IDAgb3IgbiA9IDAgb3IgbiAhPSAxIGFuZCBuICUgMTAwID0gMS4uMTknXG5cdFx0XHR9LFxuXHRcdFx0cnU6IHtcblx0XHRcdFx0b25lOiAndiA9IDAgYW5kIGkgJSAxMCA9IDEgYW5kIGkgJSAxMDAgIT0gMTEnLFxuXHRcdFx0XHRmZXc6ICd2ID0gMCBhbmQgaSAlIDEwID0gMi4uNCBhbmQgaSAlIDEwMCAhPSAxMi4uMTQnLFxuXHRcdFx0XHRtYW55OiAndiA9IDAgYW5kIGkgJSAxMCA9IDAgb3IgdiA9IDAgYW5kIGkgJSAxMCA9IDUuLjkgb3IgdiA9IDAgYW5kIGkgJSAxMDAgPSAxMS4uMTQnXG5cdFx0XHR9LFxuXHRcdFx0c2U6IHtcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMidcblx0XHRcdH0sXG5cdFx0XHRzaDoge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSAlIDEwID0gMSBhbmQgaSAlIDEwMCAhPSAxMSBvciBmICUgMTAgPSAxIGFuZCBmICUgMTAwICE9IDExJyxcblx0XHRcdFx0ZmV3OiAndiA9IDAgYW5kIGkgJSAxMCA9IDIuLjQgYW5kIGkgJSAxMDAgIT0gMTIuLjE0IG9yIGYgJSAxMCA9IDIuLjQgYW5kIGYgJSAxMDAgIT0gMTIuLjE0J1xuXHRcdFx0fSxcblx0XHRcdHNoaToge1xuXHRcdFx0XHRvbmU6ICdpID0gMCBvciBuID0gMScsXG5cdFx0XHRcdGZldzogJ24gPSAyLi4xMCdcblx0XHRcdH0sXG5cdFx0XHRzaToge1xuXHRcdFx0XHRvbmU6ICduID0gMCwxIG9yIGkgPSAwIGFuZCBmID0gMSdcblx0XHRcdH0sXG5cdFx0XHRzazoge1xuXHRcdFx0XHRvbmU6ICdpID0gMSBhbmQgdiA9IDAnLFxuXHRcdFx0XHRmZXc6ICdpID0gMi4uNCBhbmQgdiA9IDAnLFxuXHRcdFx0XHRtYW55OiAndiAhPSAwJ1xuXHRcdFx0fSxcblx0XHRcdHNsOiB7XG5cdFx0XHRcdG9uZTogJ3YgPSAwIGFuZCBpICUgMTAwID0gMScsXG5cdFx0XHRcdHR3bzogJ3YgPSAwIGFuZCBpICUgMTAwID0gMicsXG5cdFx0XHRcdGZldzogJ3YgPSAwIGFuZCBpICUgMTAwID0gMy4uNCBvciB2ICE9IDAnXG5cdFx0XHR9LFxuXHRcdFx0c21hOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInXG5cdFx0XHR9LFxuXHRcdFx0c21pOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInXG5cdFx0XHR9LFxuXHRcdFx0c21qOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInXG5cdFx0XHR9LFxuXHRcdFx0c21uOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInXG5cdFx0XHR9LFxuXHRcdFx0c21zOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInXG5cdFx0XHR9LFxuXHRcdFx0c3I6IHtcblx0XHRcdFx0b25lOiAndiA9IDAgYW5kIGkgJSAxMCA9IDEgYW5kIGkgJSAxMDAgIT0gMTEgb3IgZiAlIDEwID0gMSBhbmQgZiAlIDEwMCAhPSAxMScsXG5cdFx0XHRcdGZldzogJ3YgPSAwIGFuZCBpICUgMTAgPSAyLi40IGFuZCBpICUgMTAwICE9IDEyLi4xNCBvciBmICUgMTAgPSAyLi40IGFuZCBmICUgMTAwICE9IDEyLi4xNCdcblx0XHRcdH0sXG5cdFx0XHR0aToge1xuXHRcdFx0XHRvbmU6ICduID0gMC4uMSdcblx0XHRcdH0sXG5cdFx0XHR0bDoge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSA9IDEsMiwzIG9yIHYgPSAwIGFuZCBpICUgMTAgIT0gNCw2LDkgb3IgdiAhPSAwIGFuZCBmICUgMTAgIT0gNCw2LDknXG5cdFx0XHR9LFxuXHRcdFx0dHptOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAwLi4xIG9yIG4gPSAxMS4uOTknXG5cdFx0XHR9LFxuXHRcdFx0dWs6IHtcblx0XHRcdFx0b25lOiAndiA9IDAgYW5kIGkgJSAxMCA9IDEgYW5kIGkgJSAxMDAgIT0gMTEnLFxuXHRcdFx0XHRmZXc6ICd2ID0gMCBhbmQgaSAlIDEwID0gMi4uNCBhbmQgaSAlIDEwMCAhPSAxMi4uMTQnLFxuXHRcdFx0XHRtYW55OiAndiA9IDAgYW5kIGkgJSAxMCA9IDAgb3IgdiA9IDAgYW5kIGkgJSAxMCA9IDUuLjkgb3IgdiA9IDAgYW5kIGkgJSAxMDAgPSAxMS4uMTQnXG5cdFx0XHR9LFxuXHRcdFx0d2E6IHtcblx0XHRcdFx0b25lOiAnbiA9IDAuLjEnXG5cdFx0XHR9LFxuXHRcdFx0enU6IHtcblx0XHRcdFx0b25lOiAnaSA9IDAgb3IgbiA9IDEnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvLyBqc2NzOmVuYWJsZVxuXG5cdFx0LyoqXG5cdFx0ICogUGx1cmFsIGZvcm0gdHJhbnNmb3JtYXRpb25zLCBuZWVkZWQgZm9yIHNvbWUgbGFuZ3VhZ2VzLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtpbnRlZ2VyfSBjb3VudFxuXHRcdCAqICAgICAgICAgICAgTm9uLWxvY2FsaXplZCBxdWFudGlmaWVyXG5cdFx0ICogQHBhcmFtIHtBcnJheX0gZm9ybXNcblx0XHQgKiAgICAgICAgICAgIExpc3Qgb2YgcGx1cmFsIGZvcm1zXG5cdFx0ICogQHJldHVybiB7c3RyaW5nfSBDb3JyZWN0IGZvcm0gZm9yIHF1YW50aWZpZXIgaW4gdGhpcyBsYW5ndWFnZVxuXHRcdCAqL1xuXHRcdGNvbnZlcnRQbHVyYWw6IGZ1bmN0aW9uICggY291bnQsIGZvcm1zICkge1xuXHRcdFx0dmFyIHBsdXJhbFJ1bGVzLFxuXHRcdFx0XHRwbHVyYWxGb3JtSW5kZXgsXG5cdFx0XHRcdGluZGV4LFxuXHRcdFx0XHRleHBsaWNpdFBsdXJhbFBhdHRlcm4gPSBuZXcgUmVnRXhwKCAnXFxcXGQrPScsICdpJyApLFxuXHRcdFx0XHRmb3JtQ291bnQsXG5cdFx0XHRcdGZvcm07XG5cblx0XHRcdGlmICggIWZvcm1zIHx8IGZvcm1zLmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdFx0cmV0dXJuICcnO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBIYW5kbGUgZm9yIEV4cGxpY2l0IDA9ICYgMT0gdmFsdWVzXG5cdFx0XHRmb3IgKCBpbmRleCA9IDA7IGluZGV4IDwgZm9ybXMubGVuZ3RoOyBpbmRleCsrICkge1xuXHRcdFx0XHRmb3JtID0gZm9ybXNbIGluZGV4IF07XG5cdFx0XHRcdGlmICggZXhwbGljaXRQbHVyYWxQYXR0ZXJuLnRlc3QoIGZvcm0gKSApIHtcblx0XHRcdFx0XHRmb3JtQ291bnQgPSBwYXJzZUludCggZm9ybS5zbGljZSggMCwgZm9ybS5pbmRleE9mKCAnPScgKSApLCAxMCApO1xuXHRcdFx0XHRcdGlmICggZm9ybUNvdW50ID09PSBjb3VudCApIHtcblx0XHRcdFx0XHRcdHJldHVybiAoIGZvcm0uc2xpY2UoIGZvcm0uaW5kZXhPZiggJz0nICkgKyAxICkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Zm9ybXNbIGluZGV4IF0gPSB1bmRlZmluZWQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Zm9ybXMgPSAkLm1hcCggZm9ybXMsIGZ1bmN0aW9uICggZm9ybSApIHtcblx0XHRcdFx0aWYgKCBmb3JtICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZvcm07XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0cGx1cmFsUnVsZXMgPSB0aGlzLnBsdXJhbFJ1bGVzWyAkLmkxOG4oKS5sb2NhbGUgXTtcblxuXHRcdFx0aWYgKCAhcGx1cmFsUnVsZXMgKSB7XG5cdFx0XHRcdC8vIGRlZmF1bHQgZmFsbGJhY2suXG5cdFx0XHRcdHJldHVybiAoIGNvdW50ID09PSAxICkgPyBmb3Jtc1sgMCBdIDogZm9ybXNbIDEgXTtcblx0XHRcdH1cblxuXHRcdFx0cGx1cmFsRm9ybUluZGV4ID0gdGhpcy5nZXRQbHVyYWxGb3JtKCBjb3VudCwgcGx1cmFsUnVsZXMgKTtcblx0XHRcdHBsdXJhbEZvcm1JbmRleCA9IE1hdGgubWluKCBwbHVyYWxGb3JtSW5kZXgsIGZvcm1zLmxlbmd0aCAtIDEgKTtcblxuXHRcdFx0cmV0dXJuIGZvcm1zWyBwbHVyYWxGb3JtSW5kZXggXTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogRm9yIHRoZSBudW1iZXIsIGdldCB0aGUgcGx1cmFsIGZvciBpbmRleFxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtpbnRlZ2VyfSBudW1iZXJcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gcGx1cmFsUnVsZXNcblx0XHQgKiBAcmV0dXJuIHtpbnRlZ2VyfSBwbHVyYWwgZm9ybSBpbmRleFxuXHRcdCAqL1xuXHRcdGdldFBsdXJhbEZvcm06IGZ1bmN0aW9uICggbnVtYmVyLCBwbHVyYWxSdWxlcyApIHtcblx0XHRcdHZhciBpLFxuXHRcdFx0XHRwbHVyYWxGb3JtcyA9IFsgJ3plcm8nLCAnb25lJywgJ3R3bycsICdmZXcnLCAnbWFueScsICdvdGhlcicgXSxcblx0XHRcdFx0cGx1cmFsRm9ybUluZGV4ID0gMDtcblxuXHRcdFx0Zm9yICggaSA9IDA7IGkgPCBwbHVyYWxGb3Jtcy5sZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0aWYgKCBwbHVyYWxSdWxlc1sgcGx1cmFsRm9ybXNbIGkgXSBdICkge1xuXHRcdFx0XHRcdGlmICggcGx1cmFsUnVsZVBhcnNlciggcGx1cmFsUnVsZXNbIHBsdXJhbEZvcm1zWyBpIF0gXSwgbnVtYmVyICkgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcGx1cmFsRm9ybUluZGV4O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHBsdXJhbEZvcm1JbmRleCsrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBwbHVyYWxGb3JtSW5kZXg7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIENvbnZlcnRzIGEgbnVtYmVyIHVzaW5nIGRpZ2l0VHJhbnNmb3JtVGFibGUuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge251bWJlcn0gbnVtIFZhbHVlIHRvIGJlIGNvbnZlcnRlZFxuXHRcdCAqIEBwYXJhbSB7Ym9vbGVhbn0gaW50ZWdlciBDb252ZXJ0IHRoZSByZXR1cm4gdmFsdWUgdG8gYW4gaW50ZWdlclxuXHRcdCAqIEByZXR1cm4ge3N0cmluZ30gVGhlIG51bWJlciBjb252ZXJ0ZWQgaW50byBhIFN0cmluZy5cblx0XHQgKi9cblx0XHRjb252ZXJ0TnVtYmVyOiBmdW5jdGlvbiAoIG51bSwgaW50ZWdlciApIHtcblx0XHRcdHZhciB0bXAsIGl0ZW0sIGksXG5cdFx0XHRcdHRyYW5zZm9ybVRhYmxlLCBudW1iZXJTdHJpbmcsIGNvbnZlcnRlZE51bWJlcjtcblxuXHRcdFx0Ly8gU2V0IHRoZSB0YXJnZXQgVHJhbnNmb3JtIHRhYmxlOlxuXHRcdFx0dHJhbnNmb3JtVGFibGUgPSB0aGlzLmRpZ2l0VHJhbnNmb3JtVGFibGUoICQuaTE4bigpLmxvY2FsZSApO1xuXHRcdFx0bnVtYmVyU3RyaW5nID0gU3RyaW5nKCBudW0gKTtcblx0XHRcdGNvbnZlcnRlZE51bWJlciA9ICcnO1xuXG5cdFx0XHRpZiAoICF0cmFuc2Zvcm1UYWJsZSApIHtcblx0XHRcdFx0cmV0dXJuIG51bTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ2hlY2sgaWYgdGhlIHJlc3RvcmUgdG8gTGF0aW4gbnVtYmVyIGZsYWcgaXMgc2V0OlxuXHRcdFx0aWYgKCBpbnRlZ2VyICkge1xuXHRcdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG51bSwgMTAgKSA9PT0gbnVtICkge1xuXHRcdFx0XHRcdHJldHVybiBudW07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0bXAgPSBbXTtcblxuXHRcdFx0XHRmb3IgKCBpdGVtIGluIHRyYW5zZm9ybVRhYmxlICkge1xuXHRcdFx0XHRcdHRtcFsgdHJhbnNmb3JtVGFibGVbIGl0ZW0gXSBdID0gaXRlbTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRyYW5zZm9ybVRhYmxlID0gdG1wO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKCBpID0gMDsgaSA8IG51bWJlclN0cmluZy5sZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0aWYgKCB0cmFuc2Zvcm1UYWJsZVsgbnVtYmVyU3RyaW5nWyBpIF0gXSApIHtcblx0XHRcdFx0XHRjb252ZXJ0ZWROdW1iZXIgKz0gdHJhbnNmb3JtVGFibGVbIG51bWJlclN0cmluZ1sgaSBdIF07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29udmVydGVkTnVtYmVyICs9IG51bWJlclN0cmluZ1sgaSBdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBpbnRlZ2VyID8gcGFyc2VGbG9hdCggY29udmVydGVkTnVtYmVyLCAxMCApIDogY29udmVydGVkTnVtYmVyO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBHcmFtbWF0aWNhbCB0cmFuc2Zvcm1hdGlvbnMsIG5lZWRlZCBmb3IgaW5mbGVjdGVkIGxhbmd1YWdlcy5cblx0XHQgKiBJbnZva2VkIGJ5IHB1dHRpbmcge3tncmFtbWFyOmZvcm18d29yZH19IGluIGEgbWVzc2FnZS5cblx0XHQgKiBPdmVycmlkZSB0aGlzIG1ldGhvZCBmb3IgbGFuZ3VhZ2VzIHRoYXQgbmVlZCBzcGVjaWFsIGdyYW1tYXIgcnVsZXNcblx0XHQgKiBhcHBsaWVkIGR5bmFtaWNhbGx5LlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHdvcmRcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gZm9ybVxuXHRcdCAqIEByZXR1cm4ge3N0cmluZ31cblx0XHQgKi9cblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcblx0XHRjb252ZXJ0R3JhbW1hcjogZnVuY3Rpb24gKCB3b3JkLCBmb3JtICkge1xuXHRcdFx0cmV0dXJuIHdvcmQ7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFByb3ZpZGVzIGFuIGFsdGVybmF0aXZlIHRleHQgZGVwZW5kaW5nIG9uIHNwZWNpZmllZCBnZW5kZXIuIFVzYWdlXG5cdFx0ICoge3tnZW5kZXI6W2dlbmRlcnx1c2VyIG9iamVjdF18bWFzY3VsaW5lfGZlbWluaW5lfG5ldXRyYWx9fS4gSWYgc2Vjb25kXG5cdFx0ICogb3IgdGhpcmQgcGFyYW1ldGVyIGFyZSBub3Qgc3BlY2lmaWVkLCBtYXNjdWxpbmUgaXMgdXNlZC5cblx0XHQgKlxuXHRcdCAqIFRoZXNlIGRldGFpbHMgbWF5IGJlIG92ZXJyaWRlbiBwZXIgbGFuZ3VhZ2UuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gZ2VuZGVyXG5cdFx0ICogICAgICBtYWxlLCBmZW1hbGUsIG9yIGFueXRoaW5nIGVsc2UgZm9yIG5ldXRyYWwuXG5cdFx0ICogQHBhcmFtIHtBcnJheX0gZm9ybXNcblx0XHQgKiAgICAgIExpc3Qgb2YgZ2VuZGVyIGZvcm1zXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0Z2VuZGVyOiBmdW5jdGlvbiAoIGdlbmRlciwgZm9ybXMgKSB7XG5cdFx0XHRpZiAoICFmb3JtcyB8fCBmb3Jtcy5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRcdHJldHVybiAnJztcblx0XHRcdH1cblxuXHRcdFx0d2hpbGUgKCBmb3Jtcy5sZW5ndGggPCAyICkge1xuXHRcdFx0XHRmb3Jtcy5wdXNoKCBmb3Jtc1sgZm9ybXMubGVuZ3RoIC0gMSBdICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggZ2VuZGVyID09PSAnbWFsZScgKSB7XG5cdFx0XHRcdHJldHVybiBmb3Jtc1sgMCBdO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGdlbmRlciA9PT0gJ2ZlbWFsZScgKSB7XG5cdFx0XHRcdHJldHVybiBmb3Jtc1sgMSBdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gKCBmb3Jtcy5sZW5ndGggPT09IDMgKSA/IGZvcm1zWyAyIF0gOiBmb3Jtc1sgMCBdO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBHZXQgdGhlIGRpZ2l0IHRyYW5zZm9ybSB0YWJsZSBmb3IgdGhlIGdpdmVuIGxhbmd1YWdlXG5cdFx0ICogU2VlIGh0dHA6Ly9jbGRyLnVuaWNvZGUub3JnL3RyYW5zbGF0aW9uL251bWJlcmluZy1zeXN0ZW1zXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gbGFuZ3VhZ2Vcblx0XHQgKiBAcmV0dXJuIHtBcnJheXxib29sZWFufSBMaXN0IG9mIGRpZ2l0cyBpbiB0aGUgcGFzc2VkIGxhbmd1YWdlIG9yIGZhbHNlXG5cdFx0ICogcmVwcmVzZW50YXRpb24sIG9yIGJvb2xlYW4gZmFsc2UgaWYgdGhlcmUgaXMgbm8gaW5mb3JtYXRpb24uXG5cdFx0ICovXG5cdFx0ZGlnaXRUcmFuc2Zvcm1UYWJsZTogZnVuY3Rpb24gKCBsYW5ndWFnZSApIHtcblx0XHRcdHZhciB0YWJsZXMgPSB7XG5cdFx0XHRcdGFyOiAn2aDZodmi2aPZpNml2abZp9mo2aknLFxuXHRcdFx0XHRmYTogJ9uw27Hbstuz27Tbtdu227fbuNu5Jyxcblx0XHRcdFx0bWw6ICfgtabgtafgtajgtangtargtavgtazgta3gta7gta8nLFxuXHRcdFx0XHRrbjogJ+CzpuCzp+CzqOCzqeCzquCzq+CzrOCzreCzruCzrycsXG5cdFx0XHRcdGxvOiAn4LuQ4LuR4LuS4LuT4LuU4LuV4LuW4LuX4LuY4LuZJyxcblx0XHRcdFx0b3I6ICfgrabgrafgrajgrangrargravgrazgra3gra7gra8nLFxuXHRcdFx0XHRraDogJ+GfoOGfoeGfouGfo+GfpOGfpeGfpuGfp+GfqOGfqScsXG5cdFx0XHRcdHBhOiAn4Kmm4Kmn4Kmo4Kmp4Kmq4Kmr4Kms4Kmt4Kmu4KmvJyxcblx0XHRcdFx0Z3U6ICfgq6bgq6fgq6jgq6ngq6rgq6vgq6zgq63gq67gq68nLFxuXHRcdFx0XHRoaTogJ+ClpuClp+ClqOClqeClquClq+ClrOClreClruClrycsXG5cdFx0XHRcdG15OiAn4YGA4YGB4YGC4YGD4YGE4YGF4YGG4YGH4YGI4YGJJyxcblx0XHRcdFx0dGE6ICfgr6bgr6fgr6jgr6ngr6rgr6vgr6zgr63gr67gr68nLFxuXHRcdFx0XHR0ZTogJ+CxpuCxp+CxqOCxqeCxquCxq+CxrOCxreCxruCxrycsXG5cdFx0XHRcdHRoOiAn4LmQ4LmR4LmS4LmT4LmU4LmV4LmW4LmX4LmY4LmZJywgLy8gRklYTUUgdXNlIGlzbyA2MzkgY29kZXNcblx0XHRcdFx0Ym86ICfgvKDgvKHgvKLgvKPgvKTgvKXgvKbgvKfgvKjgvKknIC8vIEZJWE1FIHVzZSBpc28gNjM5IGNvZGVzXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoICF0YWJsZXNbIGxhbmd1YWdlIF0gKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRhYmxlc1sgbGFuZ3VhZ2UgXS5zcGxpdCggJycgKTtcblx0XHR9XG5cdH07XG5cblx0JC5leHRlbmQoICQuaTE4bi5sYW5ndWFnZXMsIHtcblx0XHQnZGVmYXVsdCc6IGxhbmd1YWdlXG5cdH0gKTtcbn0oIGpRdWVyeSApICk7XG4iLCIvKiFcbiAqIGpRdWVyeSBJbnRlcm5hdGlvbmFsaXphdGlvbiBsaWJyYXJ5IC0gTWVzc2FnZSBTdG9yZVxuICpcbiAqIENvcHlyaWdodCAoQykgMjAxMiBTYW50aG9zaCBUaG90dGluZ2FsXG4gKlxuICoganF1ZXJ5LmkxOG4gaXMgZHVhbCBsaWNlbnNlZCBHUEx2MiBvciBsYXRlciBhbmQgTUlULiBZb3UgZG9uJ3QgaGF2ZSB0byBkbyBhbnl0aGluZyBzcGVjaWFsIHRvXG4gKiBjaG9vc2Ugb25lIGxpY2Vuc2Ugb3IgdGhlIG90aGVyIGFuZCB5b3UgZG9uJ3QgaGF2ZSB0byBub3RpZnkgYW55b25lIHdoaWNoIGxpY2Vuc2UgeW91IGFyZSB1c2luZy5cbiAqIFlvdSBhcmUgZnJlZSB0byB1c2UgVW5pdmVyc2FsTGFuZ3VhZ2VTZWxlY3RvciBpbiBjb21tZXJjaWFsIHByb2plY3RzIGFzIGxvbmcgYXMgdGhlIGNvcHlyaWdodFxuICogaGVhZGVyIGlzIGxlZnQgaW50YWN0LiBTZWUgZmlsZXMgR1BMLUxJQ0VOU0UgYW5kIE1JVC1MSUNFTlNFIGZvciBkZXRhaWxzLlxuICpcbiAqIEBsaWNlbmNlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbmNlIDIuMCBvciBsYXRlclxuICogQGxpY2VuY2UgTUlUIExpY2Vuc2VcbiAqL1xuXG4oIGZ1bmN0aW9uICggJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBNZXNzYWdlU3RvcmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5tZXNzYWdlcyA9IHt9O1xuXHRcdHRoaXMuc291cmNlcyA9IHt9O1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGpzb25NZXNzYWdlTG9hZGVyKCB1cmwgKSB7XG5cdFx0dmFyIGRlZmVycmVkID0gJC5EZWZlcnJlZCgpO1xuXG5cdFx0JC5nZXRKU09OKCB1cmwgKVxuXHRcdFx0LmRvbmUoIGRlZmVycmVkLnJlc29sdmUgKVxuXHRcdFx0LmZhaWwoIGZ1bmN0aW9uICgganF4aHIsIHNldHRpbmdzLCBleGNlcHRpb24gKSB7XG5cdFx0XHRcdCQuaTE4bi5sb2coICdFcnJvciBpbiBsb2FkaW5nIG1lc3NhZ2VzIGZyb20gJyArIHVybCArICcgRXhjZXB0aW9uOiAnICsgZXhjZXB0aW9uICk7XG5cdFx0XHRcdC8vIElnbm9yZSA0MDQgZXhjZXB0aW9uLCBiZWNhdXNlIHdlIGFyZSBoYW5kbGluZyBmYWxsYWJhY2tzIGV4cGxpY2l0bHlcblx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZSgpO1xuXHRcdFx0fSApO1xuXG5cdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2UoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3dpa2ltZWRpYS9qcXVlcnkuaTE4bi93aWtpL1NwZWNpZmljYXRpb24jd2lraS1NZXNzYWdlX0ZpbGVfTG9hZGluZ1xuXHQgKi9cblx0TWVzc2FnZVN0b3JlLnByb3RvdHlwZSA9IHtcblxuXHRcdC8qKlxuXHRcdCAqIEdlbmVyYWwgbWVzc2FnZSBsb2FkaW5nIEFQSSBUaGlzIGNhbiB0YWtlIGEgVVJMIHN0cmluZyBmb3Jcblx0XHQgKiB0aGUganNvbiBmb3JtYXR0ZWQgbWVzc2FnZXMuXG5cdFx0ICogPGNvZGU+bG9hZCgncGF0aC90by9hbGxfbG9jYWxpemF0aW9ucy5qc29uJyk7PC9jb2RlPlxuXHRcdCAqXG5cdFx0ICogVGhpcyBjYW4gYWxzbyBsb2FkIGEgbG9jYWxpemF0aW9uIGZpbGUgZm9yIGEgbG9jYWxlIDxjb2RlPlxuXHRcdCAqIGxvYWQoICdwYXRoL3RvL2RlLW1lc3NhZ2VzLmpzb24nLCAnZGUnICk7XG5cdFx0ICogPC9jb2RlPlxuXHRcdCAqIEEgZGF0YSBvYmplY3QgY29udGFpbmluZyBtZXNzYWdlIGtleS0gbWVzc2FnZSB0cmFuc2xhdGlvbiBtYXBwaW5nc1xuXHRcdCAqIGNhbiBhbHNvIGJlIHBhc3NlZCBFZzpcblx0XHQgKiA8Y29kZT5cblx0XHQgKiBsb2FkKCB7ICdoZWxsbycgOiAnSGVsbG8nIH0sIG9wdGlvbmFsTG9jYWxlICk7XG5cdFx0ICogPC9jb2RlPiBJZiB0aGUgZGF0YSBhcmd1bWVudCBpc1xuXHRcdCAqIG51bGwvdW5kZWZpbmVkL2ZhbHNlLFxuXHRcdCAqIGFsbCBjYWNoZWQgbWVzc2FnZXMgZm9yIHRoZSBpMThuIGluc3RhbmNlIHdpbGwgZ2V0IHJlc2V0LlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd8T2JqZWN0fSBzb3VyY2Vcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gbG9jYWxlIExhbmd1YWdlIHRhZ1xuXHRcdCAqIEByZXR1cm4ge2pRdWVyeS5Qcm9taXNlfVxuXHRcdCAqL1xuXHRcdGxvYWQ6IGZ1bmN0aW9uICggc291cmNlLCBsb2NhbGUgKSB7XG5cdFx0XHR2YXIga2V5ID0gbnVsbCxcblx0XHRcdFx0ZGVmZXJyZWQgPSBudWxsLFxuXHRcdFx0XHRkZWZlcnJlZHMgPSBbXSxcblx0XHRcdFx0bWVzc2FnZVN0b3JlID0gdGhpcztcblxuXHRcdFx0aWYgKCB0eXBlb2Ygc291cmNlID09PSAnc3RyaW5nJyApIHtcblx0XHRcdFx0Ly8gVGhpcyBpcyBhIFVSTCB0byB0aGUgbWVzc2FnZXMgZmlsZS5cblx0XHRcdFx0JC5pMThuLmxvZyggJ0xvYWRpbmcgbWVzc2FnZXMgZnJvbTogJyArIHNvdXJjZSApO1xuXHRcdFx0XHRkZWZlcnJlZCA9IGpzb25NZXNzYWdlTG9hZGVyKCBzb3VyY2UgKVxuXHRcdFx0XHRcdC5kb25lKCBmdW5jdGlvbiAoIGxvY2FsaXphdGlvbiApIHtcblx0XHRcdFx0XHRcdG1lc3NhZ2VTdG9yZS5zZXQoIGxvY2FsZSwgbG9jYWxpemF0aW9uICk7XG5cdFx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggbG9jYWxlICkge1xuXHRcdFx0XHQvLyBzb3VyY2UgaXMgYW4ga2V5LXZhbHVlIHBhaXIgb2YgbWVzc2FnZXMgZm9yIGdpdmVuIGxvY2FsZVxuXHRcdFx0XHRtZXNzYWdlU3RvcmUuc2V0KCBsb2NhbGUsIHNvdXJjZSApO1xuXG5cdFx0XHRcdHJldHVybiAkLkRlZmVycmVkKCkucmVzb2x2ZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gc291cmNlIGlzIGEga2V5LXZhbHVlIHBhaXIgb2YgbG9jYWxlcyBhbmQgdGhlaXIgc291cmNlXG5cdFx0XHRcdGZvciAoIGtleSBpbiBzb3VyY2UgKSB7XG5cdFx0XHRcdFx0aWYgKCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoIHNvdXJjZSwga2V5ICkgKSB7XG5cdFx0XHRcdFx0XHRsb2NhbGUgPSBrZXk7XG5cdFx0XHRcdFx0XHQvLyBObyB7bG9jYWxlfSBnaXZlbiwgYXNzdW1lIGRhdGEgaXMgYSBncm91cCBvZiBsYW5ndWFnZXMsXG5cdFx0XHRcdFx0XHQvLyBjYWxsIHRoaXMgZnVuY3Rpb24gYWdhaW4gZm9yIGVhY2ggbGFuZ3VhZ2UuXG5cdFx0XHRcdFx0XHRkZWZlcnJlZHMucHVzaCggbWVzc2FnZVN0b3JlLmxvYWQoIHNvdXJjZVsga2V5IF0sIGxvY2FsZSApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiAkLndoZW4uYXBwbHkoICQsIGRlZmVycmVkcyApO1xuXHRcdFx0fVxuXG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFNldCBtZXNzYWdlcyB0byB0aGUgZ2l2ZW4gbG9jYWxlLlxuXHRcdCAqIElmIGxvY2FsZSBleGlzdHMsIGFkZCBtZXNzYWdlcyB0byB0aGUgbG9jYWxlLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGxvY2FsZVxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBtZXNzYWdlc1xuXHRcdCAqL1xuXHRcdHNldDogZnVuY3Rpb24gKCBsb2NhbGUsIG1lc3NhZ2VzICkge1xuXHRcdFx0aWYgKCAhdGhpcy5tZXNzYWdlc1sgbG9jYWxlIF0gKSB7XG5cdFx0XHRcdHRoaXMubWVzc2FnZXNbIGxvY2FsZSBdID0gbWVzc2FnZXM7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLm1lc3NhZ2VzWyBsb2NhbGUgXSA9ICQuZXh0ZW5kKCB0aGlzLm1lc3NhZ2VzWyBsb2NhbGUgXSwgbWVzc2FnZXMgKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gbG9jYWxlXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VLZXlcblx0XHQgKiBAcmV0dXJuIHtib29sZWFufVxuXHRcdCAqL1xuXHRcdGdldDogZnVuY3Rpb24gKCBsb2NhbGUsIG1lc3NhZ2VLZXkgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5tZXNzYWdlc1sgbG9jYWxlIF0gJiYgdGhpcy5tZXNzYWdlc1sgbG9jYWxlIF1bIG1lc3NhZ2VLZXkgXTtcblx0XHR9XG5cdH07XG5cblx0JC5leHRlbmQoICQuaTE4bi5tZXNzYWdlU3RvcmUsIG5ldyBNZXNzYWdlU3RvcmUoKSApO1xufSggalF1ZXJ5ICkgKTtcbiIsIi8qIVxuICogalF1ZXJ5IEludGVybmF0aW9uYWxpemF0aW9uIGxpYnJhcnlcbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTEtMjAxMyBTYW50aG9zaCBUaG90dGluZ2FsLCBOZWlsIEthbmRhbGdhb25rYXJcbiAqXG4gKiBqcXVlcnkuaTE4biBpcyBkdWFsIGxpY2Vuc2VkIEdQTHYyIG9yIGxhdGVyIGFuZCBNSVQuIFlvdSBkb24ndCBoYXZlIHRvIGRvXG4gKiBhbnl0aGluZyBzcGVjaWFsIHRvIGNob29zZSBvbmUgbGljZW5zZSBvciB0aGUgb3RoZXIgYW5kIHlvdSBkb24ndCBoYXZlIHRvXG4gKiBub3RpZnkgYW55b25lIHdoaWNoIGxpY2Vuc2UgeW91IGFyZSB1c2luZy4gWW91IGFyZSBmcmVlIHRvIHVzZVxuICogVW5pdmVyc2FsTGFuZ3VhZ2VTZWxlY3RvciBpbiBjb21tZXJjaWFsIHByb2plY3RzIGFzIGxvbmcgYXMgdGhlIGNvcHlyaWdodFxuICogaGVhZGVyIGlzIGxlZnQgaW50YWN0LiBTZWUgZmlsZXMgR1BMLUxJQ0VOU0UgYW5kIE1JVC1MSUNFTlNFIGZvciBkZXRhaWxzLlxuICpcbiAqIEBsaWNlbmNlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbmNlIDIuMCBvciBsYXRlclxuICogQGxpY2VuY2UgTUlUIExpY2Vuc2VcbiAqL1xuXG4oIGZ1bmN0aW9uICggJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBNZXNzYWdlUGFyc2VyID0gZnVuY3Rpb24gKCBvcHRpb25zICkge1xuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKCB7fSwgJC5pMThuLnBhcnNlci5kZWZhdWx0cywgb3B0aW9ucyApO1xuXHRcdHRoaXMubGFuZ3VhZ2UgPSAkLmkxOG4ubGFuZ3VhZ2VzWyBTdHJpbmcubG9jYWxlIF0gfHwgJC5pMThuLmxhbmd1YWdlc1sgJ2RlZmF1bHQnIF07XG5cdFx0dGhpcy5lbWl0dGVyID0gJC5pMThuLnBhcnNlci5lbWl0dGVyO1xuXHR9O1xuXG5cdE1lc3NhZ2VQYXJzZXIucHJvdG90eXBlID0ge1xuXG5cdFx0Y29uc3RydWN0b3I6IE1lc3NhZ2VQYXJzZXIsXG5cblx0XHRzaW1wbGVQYXJzZTogZnVuY3Rpb24gKCBtZXNzYWdlLCBwYXJhbWV0ZXJzICkge1xuXHRcdFx0cmV0dXJuIG1lc3NhZ2UucmVwbGFjZSggL1xcJChcXGQrKS9nLCBmdW5jdGlvbiAoIHN0ciwgbWF0Y2ggKSB7XG5cdFx0XHRcdHZhciBpbmRleCA9IHBhcnNlSW50KCBtYXRjaCwgMTAgKSAtIDE7XG5cblx0XHRcdFx0cmV0dXJuIHBhcmFtZXRlcnNbIGluZGV4IF0gIT09IHVuZGVmaW5lZCA/IHBhcmFtZXRlcnNbIGluZGV4IF0gOiAnJCcgKyBtYXRjaDtcblx0XHRcdH0gKTtcblx0XHR9LFxuXG5cdFx0cGFyc2U6IGZ1bmN0aW9uICggbWVzc2FnZSwgcmVwbGFjZW1lbnRzICkge1xuXHRcdFx0aWYgKCBtZXNzYWdlLmluZGV4T2YoICd7eycgKSA8IDAgKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnNpbXBsZVBhcnNlKCBtZXNzYWdlLCByZXBsYWNlbWVudHMgKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5lbWl0dGVyLmxhbmd1YWdlID0gJC5pMThuLmxhbmd1YWdlc1sgJC5pMThuKCkubG9jYWxlIF0gfHxcblx0XHRcdFx0JC5pMThuLmxhbmd1YWdlc1sgJ2RlZmF1bHQnIF07XG5cblx0XHRcdHJldHVybiB0aGlzLmVtaXR0ZXIuZW1pdCggdGhpcy5hc3QoIG1lc3NhZ2UgKSwgcmVwbGFjZW1lbnRzICk7XG5cdFx0fSxcblxuXHRcdGFzdDogZnVuY3Rpb24gKCBtZXNzYWdlICkge1xuXHRcdFx0dmFyIHBpcGUsIGNvbG9uLCBiYWNrc2xhc2gsIGFueUNoYXJhY3RlciwgZG9sbGFyLCBkaWdpdHMsIHJlZ3VsYXJMaXRlcmFsLFxuXHRcdFx0XHRyZWd1bGFyTGl0ZXJhbFdpdGhvdXRCYXIsIHJlZ3VsYXJMaXRlcmFsV2l0aG91dFNwYWNlLCBlc2NhcGVkT3JMaXRlcmFsV2l0aG91dEJhcixcblx0XHRcdFx0ZXNjYXBlZE9yUmVndWxhckxpdGVyYWwsIHRlbXBsYXRlQ29udGVudHMsIHRlbXBsYXRlTmFtZSwgb3BlblRlbXBsYXRlLFxuXHRcdFx0XHRjbG9zZVRlbXBsYXRlLCBleHByZXNzaW9uLCBwYXJhbUV4cHJlc3Npb24sIHJlc3VsdCxcblx0XHRcdFx0cG9zID0gMDtcblxuXHRcdFx0Ly8gVHJ5IHBhcnNlcnMgdW50aWwgb25lIHdvcmtzLCBpZiBub25lIHdvcmsgcmV0dXJuIG51bGxcblx0XHRcdGZ1bmN0aW9uIGNob2ljZSggcGFyc2VyU3ludGF4ICkge1xuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZhciBpLCByZXN1bHQ7XG5cblx0XHRcdFx0XHRmb3IgKCBpID0gMDsgaSA8IHBhcnNlclN5bnRheC5sZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0XHRcdHJlc3VsdCA9IHBhcnNlclN5bnRheFsgaSBdKCk7XG5cblx0XHRcdFx0XHRcdGlmICggcmVzdWx0ICE9PSBudWxsICkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUcnkgc2V2ZXJhbCBwYXJzZXJTeW50YXgtZXMgaW4gYSByb3cuXG5cdFx0XHQvLyBBbGwgbXVzdCBzdWNjZWVkOyBvdGhlcndpc2UsIHJldHVybiBudWxsLlxuXHRcdFx0Ly8gVGhpcyBpcyB0aGUgb25seSBlYWdlciBvbmUuXG5cdFx0XHRmdW5jdGlvbiBzZXF1ZW5jZSggcGFyc2VyU3ludGF4ICkge1xuXHRcdFx0XHR2YXIgaSwgcmVzLFxuXHRcdFx0XHRcdG9yaWdpbmFsUG9zID0gcG9zLFxuXHRcdFx0XHRcdHJlc3VsdCA9IFtdO1xuXG5cdFx0XHRcdGZvciAoIGkgPSAwOyBpIDwgcGFyc2VyU3ludGF4Lmxlbmd0aDsgaSsrICkge1xuXHRcdFx0XHRcdHJlcyA9IHBhcnNlclN5bnRheFsgaSBdKCk7XG5cblx0XHRcdFx0XHRpZiAoIHJlcyA9PT0gbnVsbCApIHtcblx0XHRcdFx0XHRcdHBvcyA9IG9yaWdpbmFsUG9zO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXN1bHQucHVzaCggcmVzICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSdW4gdGhlIHNhbWUgcGFyc2VyIG92ZXIgYW5kIG92ZXIgdW50aWwgaXQgZmFpbHMuXG5cdFx0XHQvLyBNdXN0IHN1Y2NlZWQgYSBtaW5pbXVtIG9mIG4gdGltZXM7IG90aGVyd2lzZSwgcmV0dXJuIG51bGwuXG5cdFx0XHRmdW5jdGlvbiBuT3JNb3JlKCBuLCBwICkge1xuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZhciBvcmlnaW5hbFBvcyA9IHBvcyxcblx0XHRcdFx0XHRcdHJlc3VsdCA9IFtdLFxuXHRcdFx0XHRcdFx0cGFyc2VkID0gcCgpO1xuXG5cdFx0XHRcdFx0d2hpbGUgKCBwYXJzZWQgIT09IG51bGwgKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQucHVzaCggcGFyc2VkICk7XG5cdFx0XHRcdFx0XHRwYXJzZWQgPSBwKCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCByZXN1bHQubGVuZ3RoIDwgbiApIHtcblx0XHRcdFx0XHRcdHBvcyA9IG9yaWdpbmFsUG9zO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBIZWxwZXJzIC0tIGp1c3QgbWFrZSBwYXJzZXJTeW50YXggb3V0IG9mIHNpbXBsZXIgSlMgYnVpbHRpbiB0eXBlc1xuXG5cdFx0XHRmdW5jdGlvbiBtYWtlU3RyaW5nUGFyc2VyKCBzICkge1xuXHRcdFx0XHR2YXIgbGVuID0gcy5sZW5ndGg7XG5cblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgcmVzdWx0ID0gbnVsbDtcblxuXHRcdFx0XHRcdGlmICggbWVzc2FnZS5zbGljZSggcG9zLCBwb3MgKyBsZW4gKSA9PT0gcyApIHtcblx0XHRcdFx0XHRcdHJlc3VsdCA9IHM7XG5cdFx0XHRcdFx0XHRwb3MgKz0gbGVuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIG1ha2VSZWdleFBhcnNlciggcmVnZXggKSB7XG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dmFyIG1hdGNoZXMgPSBtZXNzYWdlLnNsaWNlKCBwb3MgKS5tYXRjaCggcmVnZXggKTtcblxuXHRcdFx0XHRcdGlmICggbWF0Y2hlcyA9PT0gbnVsbCApIHtcblx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHBvcyArPSBtYXRjaGVzWyAwIF0ubGVuZ3RoO1xuXG5cdFx0XHRcdFx0cmV0dXJuIG1hdGNoZXNbIDAgXTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0cGlwZSA9IG1ha2VTdHJpbmdQYXJzZXIoICd8JyApO1xuXHRcdFx0Y29sb24gPSBtYWtlU3RyaW5nUGFyc2VyKCAnOicgKTtcblx0XHRcdGJhY2tzbGFzaCA9IG1ha2VTdHJpbmdQYXJzZXIoICdcXFxcJyApO1xuXHRcdFx0YW55Q2hhcmFjdGVyID0gbWFrZVJlZ2V4UGFyc2VyKCAvXi4vICk7XG5cdFx0XHRkb2xsYXIgPSBtYWtlU3RyaW5nUGFyc2VyKCAnJCcgKTtcblx0XHRcdGRpZ2l0cyA9IG1ha2VSZWdleFBhcnNlciggL15cXGQrLyApO1xuXHRcdFx0cmVndWxhckxpdGVyYWwgPSBtYWtlUmVnZXhQYXJzZXIoIC9eW157fVtcXF0kXFxcXF0vICk7XG5cdFx0XHRyZWd1bGFyTGl0ZXJhbFdpdGhvdXRCYXIgPSBtYWtlUmVnZXhQYXJzZXIoIC9eW157fVtcXF0kXFxcXHxdLyApO1xuXHRcdFx0cmVndWxhckxpdGVyYWxXaXRob3V0U3BhY2UgPSBtYWtlUmVnZXhQYXJzZXIoIC9eW157fVtcXF0kXFxzXS8gKTtcblxuXHRcdFx0Ly8gVGhlcmUgaXMgYSBnZW5lcmFsIHBhdHRlcm46XG5cdFx0XHQvLyBwYXJzZSBhIHRoaW5nO1xuXHRcdFx0Ly8gaWYgaXQgd29ya2VkLCBhcHBseSB0cmFuc2Zvcm0sXG5cdFx0XHQvLyBvdGhlcndpc2UgcmV0dXJuIG51bGwuXG5cdFx0XHQvLyBCdXQgdXNpbmcgdGhpcyBhcyBhIGNvbWJpbmF0b3Igc2VlbXMgdG8gY2F1c2UgcHJvYmxlbXNcblx0XHRcdC8vIHdoZW4gY29tYmluZWQgd2l0aCBuT3JNb3JlKCkuXG5cdFx0XHQvLyBNYXkgYmUgc29tZSBzY29waW5nIGlzc3VlLlxuXHRcdFx0ZnVuY3Rpb24gdHJhbnNmb3JtKCBwLCBmbiApIHtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgcmVzdWx0ID0gcCgpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdCA9PT0gbnVsbCA/IG51bGwgOiBmbiggcmVzdWx0ICk7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdC8vIFVzZWQgdG8gZGVmaW5lIFwibGl0ZXJhbHNcIiB3aXRoaW4gdGVtcGxhdGUgcGFyYW1ldGVycy4gVGhlIHBpcGVcblx0XHRcdC8vIGNoYXJhY3RlciBpcyB0aGUgcGFyYW1ldGVyIGRlbGltZXRlciwgc28gYnkgZGVmYXVsdFxuXHRcdFx0Ly8gaXQgaXMgbm90IGEgbGl0ZXJhbCBpbiB0aGUgcGFyYW1ldGVyXG5cdFx0XHRmdW5jdGlvbiBsaXRlcmFsV2l0aG91dEJhcigpIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IG5Pck1vcmUoIDEsIGVzY2FwZWRPckxpdGVyYWxXaXRob3V0QmFyICkoKTtcblxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0ID09PSBudWxsID8gbnVsbCA6IHJlc3VsdC5qb2luKCAnJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBsaXRlcmFsKCkge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gbk9yTW9yZSggMSwgZXNjYXBlZE9yUmVndWxhckxpdGVyYWwgKSgpO1xuXG5cdFx0XHRcdHJldHVybiByZXN1bHQgPT09IG51bGwgPyBudWxsIDogcmVzdWx0LmpvaW4oICcnICk7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIGVzY2FwZWRMaXRlcmFsKCkge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gc2VxdWVuY2UoIFsgYmFja3NsYXNoLCBhbnlDaGFyYWN0ZXIgXSApO1xuXG5cdFx0XHRcdHJldHVybiByZXN1bHQgPT09IG51bGwgPyBudWxsIDogcmVzdWx0WyAxIF07XG5cdFx0XHR9XG5cblx0XHRcdGNob2ljZSggWyBlc2NhcGVkTGl0ZXJhbCwgcmVndWxhckxpdGVyYWxXaXRob3V0U3BhY2UgXSApO1xuXHRcdFx0ZXNjYXBlZE9yTGl0ZXJhbFdpdGhvdXRCYXIgPSBjaG9pY2UoIFsgZXNjYXBlZExpdGVyYWwsIHJlZ3VsYXJMaXRlcmFsV2l0aG91dEJhciBdICk7XG5cdFx0XHRlc2NhcGVkT3JSZWd1bGFyTGl0ZXJhbCA9IGNob2ljZSggWyBlc2NhcGVkTGl0ZXJhbCwgcmVndWxhckxpdGVyYWwgXSApO1xuXG5cdFx0XHRmdW5jdGlvbiByZXBsYWNlbWVudCgpIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHNlcXVlbmNlKCBbIGRvbGxhciwgZGlnaXRzIF0gKTtcblxuXHRcdFx0XHRpZiAoIHJlc3VsdCA9PT0gbnVsbCApIHtcblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBbICdSRVBMQUNFJywgcGFyc2VJbnQoIHJlc3VsdFsgMSBdLCAxMCApIC0gMSBdO1xuXHRcdFx0fVxuXG5cdFx0XHR0ZW1wbGF0ZU5hbWUgPSB0cmFuc2Zvcm0oXG5cdFx0XHRcdC8vIHNlZSAkd2dMZWdhbFRpdGxlQ2hhcnNcblx0XHRcdFx0Ly8gbm90IGFsbG93aW5nIDogZHVlIHRvIHRoZSBuZWVkIHRvIGNhdGNoIFwiUExVUkFMOiQxXCJcblx0XHRcdFx0bWFrZVJlZ2V4UGFyc2VyKCAvXlsgIVwiJCYnKCkqLC4vMC05Oz0/QEEtWl5fYGEten5cXHg4MC1cXHhGRistXSsvICksXG5cblx0XHRcdFx0ZnVuY3Rpb24gKCByZXN1bHQgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdC50b1N0cmluZygpO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0XHRmdW5jdGlvbiB0ZW1wbGF0ZVBhcmFtKCkge1xuXHRcdFx0XHR2YXIgZXhwcixcblx0XHRcdFx0XHRyZXN1bHQgPSBzZXF1ZW5jZSggWyBwaXBlLCBuT3JNb3JlKCAwLCBwYXJhbUV4cHJlc3Npb24gKSBdICk7XG5cblx0XHRcdFx0aWYgKCByZXN1bHQgPT09IG51bGwgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRleHByID0gcmVzdWx0WyAxIF07XG5cblx0XHRcdFx0Ly8gdXNlIGEgXCJDT05DQVRcIiBvcGVyYXRvciBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgbm9kZXMsXG5cdFx0XHRcdC8vIG90aGVyd2lzZSByZXR1cm4gdGhlIGZpcnN0IG5vZGUsIHJhdy5cblx0XHRcdFx0cmV0dXJuIGV4cHIubGVuZ3RoID4gMSA/IFsgJ0NPTkNBVCcgXS5jb25jYXQoIGV4cHIgKSA6IGV4cHJbIDAgXTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gdGVtcGxhdGVXaXRoUmVwbGFjZW1lbnQoKSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBzZXF1ZW5jZSggWyB0ZW1wbGF0ZU5hbWUsIGNvbG9uLCByZXBsYWNlbWVudCBdICk7XG5cblx0XHRcdFx0cmV0dXJuIHJlc3VsdCA9PT0gbnVsbCA/IG51bGwgOiBbIHJlc3VsdFsgMCBdLCByZXN1bHRbIDIgXSBdO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiB0ZW1wbGF0ZVdpdGhPdXRSZXBsYWNlbWVudCgpIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHNlcXVlbmNlKCBbIHRlbXBsYXRlTmFtZSwgY29sb24sIHBhcmFtRXhwcmVzc2lvbiBdICk7XG5cblx0XHRcdFx0cmV0dXJuIHJlc3VsdCA9PT0gbnVsbCA/IG51bGwgOiBbIHJlc3VsdFsgMCBdLCByZXN1bHRbIDIgXSBdO1xuXHRcdFx0fVxuXG5cdFx0XHR0ZW1wbGF0ZUNvbnRlbnRzID0gY2hvaWNlKCBbXG5cdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgcmVzID0gc2VxdWVuY2UoIFtcblx0XHRcdFx0XHRcdC8vIHRlbXBsYXRlcyBjYW4gaGF2ZSBwbGFjZWhvbGRlcnMgZm9yIGR5bmFtaWNcblx0XHRcdFx0XHRcdC8vIHJlcGxhY2VtZW50IGVnOiB7e1BMVVJBTDokMXxvbmUgY2FyfCQxIGNhcnN9fVxuXHRcdFx0XHRcdFx0Ly8gb3Igbm8gcGxhY2Vob2xkZXJzIGVnOlxuXHRcdFx0XHRcdFx0Ly8ge3tHUkFNTUFSOmdlbml0aXZlfHt7U0lURU5BTUV9fX1cblx0XHRcdFx0XHRcdGNob2ljZSggWyB0ZW1wbGF0ZVdpdGhSZXBsYWNlbWVudCwgdGVtcGxhdGVXaXRoT3V0UmVwbGFjZW1lbnQgXSApLFxuXHRcdFx0XHRcdFx0bk9yTW9yZSggMCwgdGVtcGxhdGVQYXJhbSApXG5cdFx0XHRcdFx0XSApO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHJlcyA9PT0gbnVsbCA/IG51bGwgOiByZXNbIDAgXS5jb25jYXQoIHJlc1sgMSBdICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgcmVzID0gc2VxdWVuY2UoIFsgdGVtcGxhdGVOYW1lLCBuT3JNb3JlKCAwLCB0ZW1wbGF0ZVBhcmFtICkgXSApO1xuXG5cdFx0XHRcdFx0aWYgKCByZXMgPT09IG51bGwgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gWyByZXNbIDAgXSBdLmNvbmNhdCggcmVzWyAxIF0gKTtcblx0XHRcdFx0fVxuXHRcdFx0XSApO1xuXG5cdFx0XHRvcGVuVGVtcGxhdGUgPSBtYWtlU3RyaW5nUGFyc2VyKCAne3snICk7XG5cdFx0XHRjbG9zZVRlbXBsYXRlID0gbWFrZVN0cmluZ1BhcnNlciggJ319JyApO1xuXG5cdFx0XHRmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHNlcXVlbmNlKCBbIG9wZW5UZW1wbGF0ZSwgdGVtcGxhdGVDb250ZW50cywgY2xvc2VUZW1wbGF0ZSBdICk7XG5cblx0XHRcdFx0cmV0dXJuIHJlc3VsdCA9PT0gbnVsbCA/IG51bGwgOiByZXN1bHRbIDEgXTtcblx0XHRcdH1cblxuXHRcdFx0ZXhwcmVzc2lvbiA9IGNob2ljZSggWyB0ZW1wbGF0ZSwgcmVwbGFjZW1lbnQsIGxpdGVyYWwgXSApO1xuXHRcdFx0cGFyYW1FeHByZXNzaW9uID0gY2hvaWNlKCBbIHRlbXBsYXRlLCByZXBsYWNlbWVudCwgbGl0ZXJhbFdpdGhvdXRCYXIgXSApO1xuXG5cdFx0XHRmdW5jdGlvbiBzdGFydCgpIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IG5Pck1vcmUoIDAsIGV4cHJlc3Npb24gKSgpO1xuXG5cdFx0XHRcdGlmICggcmVzdWx0ID09PSBudWxsICkge1xuXHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIFsgJ0NPTkNBVCcgXS5jb25jYXQoIHJlc3VsdCApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXN1bHQgPSBzdGFydCgpO1xuXG5cdFx0XHQvKlxuXHRcdFx0ICogRm9yIHN1Y2Nlc3MsIHRoZSBwb3MgbXVzdCBoYXZlIGdvdHRlbiB0byB0aGUgZW5kIG9mIHRoZSBpbnB1dFxuXHRcdFx0ICogYW5kIHJldHVybmVkIGEgbm9uLW51bGwuXG5cdFx0XHQgKiBuLmIuIFRoaXMgaXMgcGFydCBvZiBsYW5ndWFnZSBpbmZyYXN0cnVjdHVyZSwgc28gd2UgZG8gbm90IHRocm93IGFuXG5cdFx0XHQgKiBpbnRlcm5hdGlvbmFsaXphYmxlIG1lc3NhZ2UuXG5cdFx0XHQgKi9cblx0XHRcdGlmICggcmVzdWx0ID09PSBudWxsIHx8IHBvcyAhPT0gbWVzc2FnZS5sZW5ndGggKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvciggJ1BhcnNlIGVycm9yIGF0IHBvc2l0aW9uICcgKyBwb3MudG9TdHJpbmcoKSArICcgaW4gaW5wdXQ6ICcgKyBtZXNzYWdlICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXG5cdH07XG5cblx0JC5leHRlbmQoICQuaTE4bi5wYXJzZXIsIG5ldyBNZXNzYWdlUGFyc2VyKCkgKTtcbn0oIGpRdWVyeSApICk7IiwidmFyIGNvZGVFeGVyY2lzZXM7XG52YXIgcHJlc2VudGVyQ3NzTGluaztcbnZhciBwcmVzZW50TW9kZUluaXRpYWxpemVkID0gZmFsc2U7XG5cbmZ1bmN0aW9uIHByZXNlbnRUb2dnbGUoKSB7XG4gICAgaWYgKCFwcmVzZW50TW9kZUluaXRpYWxpemVkKSB7XG4gICAgICAgIHByZXNlbnRNb2RlU2V0dXAoKTtcbiAgICAgICAgcHJlc2VudE1vZGVJbml0aWFsaXplZCA9IHRydWU7XG4gICAgfVxuICAgIGxldCBib2QgPSAkKFwiYm9keVwiKTtcbiAgICBsZXQgcHJlc2VudENsYXNzID0gXCJwcmVzZW50XCI7XG4gICAgbGV0IGZ1bGxIZWlnaHRDbGFzcyA9IFwiZnVsbC1oZWlnaHRcIjtcbiAgICBsZXQgYm90dG9tQ2xhc3MgPSBcImJvdHRvbVwiO1xuICAgIGlmIChib2QuaGFzQ2xhc3MocHJlc2VudENsYXNzKSkge1xuICAgICAgICAkKFwiLnNlY3Rpb24gKlwiKVxuICAgICAgICAgICAgLm5vdChcbiAgICAgICAgICAgICAgICBcImgxLCAucHJlc2VudGF0aW9uLXRpdGxlLCAuYnRuLXByZXNlbnRlciwgLnJ1bmVzdG9uZSwgLnJ1bmVzdG9uZSAqLCAuc2VjdGlvbiwgLnByZSwgY29kZVwiXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7IC8vc2hvdyBldmVyeXRoaW5nXG4gICAgICAgICQoXCIjY29tcGxldGlvbkJ1dHRvblwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKTtcbiAgICAgICAgYm9kLnJlbW92ZUNsYXNzKHByZXNlbnRDbGFzcyk7XG4gICAgICAgICQoXCIuXCIgKyBmdWxsSGVpZ2h0Q2xhc3MpLnJlbW92ZUNsYXNzKGZ1bGxIZWlnaHRDbGFzcyk7XG4gICAgICAgICQoXCIuXCIgKyBib3R0b21DbGFzcykucmVtb3ZlQ2xhc3MoYm90dG9tQ2xhc3MpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInByZXNlbnRNb2RlXCIsIFwidGV4dFwiKTtcbiAgICAgICAgY29kZUV4ZXJjaXNlcy5yZW1vdmVDbGFzcyhcImhpZGRlblwiKTtcbiAgICAgICAgcHJlc2VudGVyQ3NzTGluay5kaXNhYmxlZCA9IHRydWU7IC8vIGRpc2FibGUgcHJlc2VudF9tb2RlLmNzc1xuICAgIH0gZWxzZSB7XG4gICAgICAgICQoXCIuc2VjdGlvbiAqXCIpXG4gICAgICAgICAgICAubm90KFxuICAgICAgICAgICAgICAgIFwiaDEsIC5wcmVzZW50YXRpb24tdGl0bGUsIC5idG4tcHJlc2VudGVyLCAucnVuZXN0b25lLCAucnVuZXN0b25lICosIC5zZWN0aW9uLCAucHJlLCBjb2RlXCJcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRDbGFzcyhcImhpZGRlblwiKTsgLy8gaGlkZSBleHRyYW5lb3VzIHN0dWZmXG4gICAgICAgICQoXCIjY29tcGxldGlvbkJ1dHRvblwiKS5hZGRDbGFzcyhcImhpZGRlblwiKTtcbiAgICAgICAgYm9kLmFkZENsYXNzKHByZXNlbnRDbGFzcyk7XG4gICAgICAgIGJvZC5hZGRDbGFzcyhmdWxsSGVpZ2h0Q2xhc3MpO1xuICAgICAgICAkKFwiaHRtbFwiKS5hZGRDbGFzcyhmdWxsSGVpZ2h0Q2xhc3MpO1xuICAgICAgICAkKFwiLnNlY3Rpb24gLnJ1bmVzdG9uZVwiKS5hZGRDbGFzcyhmdWxsSGVpZ2h0Q2xhc3MpO1xuICAgICAgICAkKFwiLmFjLWNhcHRpb25cIikuYWRkQ2xhc3MoYm90dG9tQ2xhc3MpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInByZXNlbnRNb2RlXCIsIHByZXNlbnRDbGFzcyk7XG4gICAgICAgIGxvYWRQcmVzZW50ZXJDc3MoKTsgLy8gcHJlc2VudF9tb2RlLmNzcyBzaG91bGQgb25seSBhcHBseSB3aGVuIGluIHByZXNlbnRlciBtb2RlLlxuICAgICAgICBhY3RpdmF0ZUV4ZXJjaXNlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBsb2FkUHJlc2VudGVyQ3NzKCkge1xuICAgIHByZXNlbnRlckNzc0xpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcbiAgICBwcmVzZW50ZXJDc3NMaW5rLnR5cGUgPSBcInRleHQvY3NzXCI7XG4gICAgcHJlc2VudGVyQ3NzTGluay5ocmVmID0gXCIuLi9fc3RhdGljL3ByZXNlbnRlcl9tb2RlLmNzc1wiO1xuICAgIHByZXNlbnRlckNzc0xpbmsucmVsID0gXCJzdHlsZXNoZWV0XCI7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLmFwcGVuZENoaWxkKHByZXNlbnRlckNzc0xpbmspO1xufVxuXG5mdW5jdGlvbiBwcmVzZW50TW9kZVNldHVwKCkge1xuICAgIC8vIG1vdmVkIHRoaXMgb3V0IG9mIGNvbmZpZ3VyZVxuICAgIGxldCBkYXRhQ29tcG9uZW50ID0gJChcIltkYXRhLWNoaWxkY29tcG9uZW50XVwiKTtcblxuICAgIC8vIHRoaXMgc3RpbGwgbGVhdmVzIHNvbWUgdGhpbmdzIHNlbWktbWVzc2VkIHVwIHdoZW4geW91IGV4aXQgcHJlc2VudGVyIG1vZGUuXG4gICAgLy8gYnV0IGluc3RydWN0b3JzIHdpbGwgcHJvYmFibHkganVzdCBsZWFybiB0byByZWZyZXNoIHRoZSBwYWdlLlxuICAgIGRhdGFDb21wb25lbnQuYWRkQ2xhc3MoXCJydW5lc3RvbmVcIik7XG4gICAgZGF0YUNvbXBvbmVudC5wYXJlbnQoKS5jbG9zZXN0KFwiZGl2XCIpLm5vdChcIi5zZWN0aW9uXCIpLmFkZENsYXNzKFwicnVuZXN0b25lXCIpO1xuICAgIGRhdGFDb21wb25lbnQucGFyZW50KCkuY2xvc2VzdChcImRpdlwiKS5jc3MoXCJtYXgtd2lkdGhcIiwgXCJub25lXCIpO1xuXG4gICAgZGF0YUNvbXBvbmVudC5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICBsZXQgbWUgPSAkKHRoaXMpO1xuICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAuZmluZChcIi5hY19jb2RlX2RpdiwgLmFjX291dHB1dFwiKVxuICAgICAgICAgICAgLndyYXBBbGwoXCI8ZGl2IGNsYXNzPSdhYy1ibG9jaycgc3R5bGU9J3dpZHRoOiAxMDAlOyc+PC9kaXY+XCIpO1xuICAgIH0pO1xuXG4gICAgY29kZWxlbnNMaXN0ZW5lcig1MDApO1xuICAgICQoXCIuc2VjdGlvbiBpbWdcIikud3JhcCgnPGRpdiBjbGFzcz1cInJ1bmVzdG9uZVwiPicpO1xuICAgIGNvZGVFeGVyY2lzZXMgPSAkKFwiLnJ1bmVzdG9uZVwiKS5ub3QoXCIucnVuZXN0b25lIC5ydW5lc3RvbmVcIik7XG4gICAgLy8gY29kZUV4ZXJjaXNlcy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgJChcImgxXCIpLmJlZm9yZShcbiAgICAgICAgXCI8ZGl2IGNsYXNzPSdwcmVzZW50YXRpb24tdGl0bGUnPiBcXFxuICAgICAgICA8YnV0dG9uIGNsYXNzPSdwcmV2LWV4ZXJjaXNlIGJ0bi1wcmVzZW50ZXIgYnRuLWdyZXktb3V0bGluZScgb25jbGljaz0ncHJldkV4ZXJjaXNlKCknPkJhY2s8L2J1dHRvbj4gXFxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz0nbmV4dC1leGVyY2lzZSBidG4tcHJlc2VudGVyIGJ0bi1ncmV5LXNvbGlkJyBvbmNsaWNrPSduZXh0RXhlcmNpc2UoKSc+TmV4dDwvYnV0dG9uPiBcXFxuICAgICAgPC9kaXY+XCJcbiAgICApO1xufVxuZnVuY3Rpb24gZ2V0QWN0aXZlRXhlcmNpc2UoKSB7XG4gICAgcmV0dXJuIChhY3RpdmUgPSBjb2RlRXhlcmNpc2VzLmZpbHRlcihcIi5hY3RpdmVcIikpO1xufVxuXG5mdW5jdGlvbiBhY3RpdmF0ZUV4ZXJjaXNlKGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBpbmRleCA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGluZGV4ID0gMDtcbiAgICB9XG5cbiAgICBsZXQgYWN0aXZlID0gZ2V0QWN0aXZlRXhlcmNpc2UoKTtcblxuICAgIGlmIChjb2RlRXhlcmNpc2VzLmxlbmd0aCkge1xuICAgICAgICBhY3RpdmUucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgIGFjdGl2ZSA9ICQoY29kZUV4ZXJjaXNlc1tpbmRleF0pLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICBhY3RpdmUucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XG4gICAgICAgIGNvZGVFeGVyY2lzZXMubm90KGNvZGVFeGVyY2lzZXMuZmlsdGVyKFwiLmFjdGl2ZVwiKSkuYWRkQ2xhc3MoXCJoaWRkZW5cIik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBuZXh0RXhlcmNpc2UoKSB7XG4gICAgbGV0IGFjdGl2ZSA9IGdldEFjdGl2ZUV4ZXJjaXNlKCk7XG4gICAgbGV0IG5leHRJbmRleCA9IGNvZGVFeGVyY2lzZXMuaW5kZXgoYWN0aXZlKSArIDE7XG4gICAgaWYgKG5leHRJbmRleCA8IGNvZGVFeGVyY2lzZXMubGVuZ3RoKSB7XG4gICAgICAgIGFjdGl2YXRlRXhlcmNpc2UobmV4dEluZGV4KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHByZXZFeGVyY2lzZSgpIHtcbiAgICBsZXQgYWN0aXZlID0gZ2V0QWN0aXZlRXhlcmNpc2UoKTtcbiAgICBsZXQgcHJldkluZGV4ID0gY29kZUV4ZXJjaXNlcy5pbmRleChhY3RpdmUpIC0gMTtcbiAgICBpZiAocHJldkluZGV4ID49IDApIHtcbiAgICAgICAgYWN0aXZhdGVFeGVyY2lzZShwcmV2SW5kZXgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY29uZmlndXJlKCkge1xuICAgIGxldCByaWdodE5hdiA9ICQoXCIubmF2YmFyLXJpZ2h0XCIpO1xuICAgIHJpZ2h0TmF2LnByZXBlbmQoXG4gICAgICAgIFwiPGxpIGNsYXNzPSdkcm9wZG93biB2aWV3LXRvZ2dsZSc+IFxcXG4gICAgICA8bGFiZWw+VmlldzogXFxcbiAgICAgICAgPHNlbGVjdCBjbGFzcz0nbW9kZS1zZWxlY3QnPiBcXFxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9J3RleHQnPlRleHRib29rPC9vcHRpb24+IFxcXG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT0ncHJlc2VudCc+Q29kZSBQcmVzZW50ZXI8L29wdGlvbj4gXFxcbiAgICAgICAgPC9zZWxlY3Q+IFxcXG4gICAgICA8L2xhYmVsPiBcXFxuICAgIDwvbGk+XCJcbiAgICApO1xuXG4gICAgbGV0IG1vZGVTZWxlY3QgPSAkKFwiLm1vZGUtc2VsZWN0XCIpLmNoYW5nZShwcmVzZW50VG9nZ2xlKTtcbn1cblxuZnVuY3Rpb24gY29kZWxlbnNMaXN0ZW5lcihkdXJhdGlvbikge1xuICAgIC8vICQoXCIuRXhlY3V0aW9uVmlzdWFsaXplclwiKS5sZW5ndGggPyBjb25maWd1cmVDb2RlbGVucygpIDogc2V0VGltZW91dChjb2RlbGVuc0xpc3RlbmVyLCBkdXJhdGlvbik7XG4gICAgLy8gY29uZmlndXJlQ29kZWxlbnMoKTtcbn1cblxuZnVuY3Rpb24gY29uZmlndXJlQ29kZWxlbnMoKSB7XG4gICAgbGV0IGFjQ29kZVRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg0XCIpO1xuICAgIGFjQ29kZVRpdGxlLnRleHRDb250ZW50ID0gXCJBY3RpdmUgQ29kZSBXaW5kb3dcIjtcbiAgICBsZXQgYWNDb2RlID0gJChcIi5hY19jb2RlX2RpdlwiKS5yZW1vdmVDbGFzcyhcImNvbC1tZC0xMlwiKTtcbiAgICAkKFwiLmFjX2NvZGVfZGl2XCIpLmFkZENsYXNzKFwiY29sLW1kLTZcIik7XG4gICAgYWNDb2RlLnByZXBlbmQoYWNDb2RlVGl0bGUpO1xuXG4gICAgYWNPdXRUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNFwiKTtcbiAgICBhY091dFRpdGxlLnRleHRDb250ZW50ID0gXCJPdXRwdXQgV2luZG93XCI7XG4gICAgbGV0IGFjT3V0ID0gJChcIi5hY19vdXRwdXRcIikuYWRkQ2xhc3MoXCJjb2wtbWQtNlwiKTtcbiAgICAkKFwiLmFjX291dHB1dFwiKS5wcmVwZW5kKGFjT3V0VGl0bGUpO1xuXG4gICAgbGV0IHNrZXRjaHBhZFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg0XCIpO1xuICAgIHNrZXRjaHBhZFRpdGxlLnRleHRDb250ZW50ID0gXCJTa2V0Y2hwYWRcIjtcbiAgICBsZXQgc2tldGNocGFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgJChza2V0Y2hwYWQpLmFkZENsYXNzKFwic2tldGNocGFkXCIpO1xuICAgIGxldCBza2V0Y2hwYWRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICQoc2tldGNocGFkQ29udGFpbmVyKS5hZGRDbGFzcyhcInNrZXRjaHBhZC1jb250YWluZXJcIik7XG4gICAgc2tldGNocGFkQ29udGFpbmVyLmFwcGVuZENoaWxkKHNrZXRjaHBhZFRpdGxlKTtcbiAgICBza2V0Y2hwYWRDb250YWluZXIuYXBwZW5kQ2hpbGQoc2tldGNocGFkKTtcbiAgICAvLyQoJy5hY19vdXRwdXQnKS5hcHBlbmQoc2tldGNocGFkQ29udGFpbmVyKTtcblxuICAgIGxldCB2aXN1YWxpemVycyA9ICQoXCIuRXhlY3V0aW9uVmlzdWFsaXplclwiKTtcblxuICAgIGNvbnNvbGUubG9nKFwiRWNvbnRhaW5lcjogXCIsIHRoaXMuZUNvbnRhaW5lcik7XG5cbiAgICAkKFwiW2RhdGEtY2hpbGRjb21wb25lbnRdXCIpLm9uKFwiY2xpY2tcIiwgXCJidXR0b24ucm93LW1vZGVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoXCJbZGF0YS1jaGlsZGNvbXBvbmVudF1cIikucmVtb3ZlQ2xhc3MoXCJjYXJkLW1vZGVcIik7XG4gICAgICAgICQodGhpcykuY2xvc2VzdChcIltkYXRhLWNoaWxkY29tcG9uZW50XVwiKS5hZGRDbGFzcyhcInJvdy1tb2RlXCIpO1xuICAgICAgICAkKHRoaXMpLm5leHQoXCIuY2FyZC1tb2RlXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlLWxheW91dFwiKTtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZS1sYXlvdXRcIik7XG4gICAgfSk7XG5cbiAgICAkKFwiW2RhdGEtY2hpbGRjb21wb25lbnRdXCIpLm9uKFwiY2xpY2tcIiwgXCJidXR0b24uY2FyZC1tb2RlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KFwiW2RhdGEtY2hpbGRjb21wb25lbnRdXCIpLnJlbW92ZUNsYXNzKFwicm93LW1vZGVcIik7XG4gICAgICAgICQodGhpcykuY2xvc2VzdChcIltkYXRhLWNoaWxkY29tcG9uZW50XVwiKS5hZGRDbGFzcyhcImNhcmQtbW9kZVwiKTtcbiAgICAgICAgJCh0aGlzKS5wcmV2KFwiLnJvdy1tb2RlXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlLWxheW91dFwiKTtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZS1sYXlvdXRcIik7XG4gICAgfSk7XG5cbiAgICAkKFwiW2RhdGEtY2hpbGRjb21wb25lbnRdIC5hY19zZWN0aW9uXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLnByZXBlbmQoXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cInByZXNlbnRhdGlvbi1vcHRpb25zXCI+PGJ1dHRvbiBjbGFzcz1cInJvdy1tb2RlIGxheW91dC1idG5cIj48aW1nIHNyYz1cIi4uL19pbWFnZXMvcm93LWJ0bi1jb250ZW50LnBuZ1wiIGFsdD1cIlJvd3NcIj48L2J1dHRvbj48YnV0dG9uIGNsYXNzPVwiY2FyZC1tb2RlIGxheW91dC1idG5cIj48aW1nIHNyYz1cIi4uL19pbWFnZXMvY2FyZC1idG4tY29udGVudC5wbmdcIiBhbHQ9XCJDYXJkXCI+PC9idXR0b24+PC9kaXY+J1xuICAgICAgICApO1xuICAgIH0pO1xuXG4gICAgdmlzdWFsaXplcnMuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgbGV0IG1lID0gJCh0aGlzKTtcbiAgICAgICAgbGV0IGNvbDEgPSBtZS5maW5kKFwiI3ZpekxheW91dFRkRmlyc3RcIik7XG4gICAgICAgIGxldCBjb2wyID0gbWUuZmluZChcIiN2aXpMYXlvdXRUZFNlY29uZFwiKTtcbiAgICAgICAgbGV0IGRhdGFWaXMgPSBtZS5maW5kKFwiI2RhdGFWaXpcIik7XG4gICAgICAgIGxldCBzdGFja0hlYXBUYWJsZSA9IG1lLmZpbmQoXCIjc3RhY2tIZWFwVGFibGVcIik7XG4gICAgICAgIGxldCBvdXRwdXQgPSBtZS5maW5kKFwiI3Byb2dPdXRwdXRzXCIpO1xuICAgICAgICBvdXRwdXQuY3NzKFwiZGlzcGxheVwiLCBcImJsb2NrXCIpO1xuICAgICAgICBtZS5wYXJlbnQoKS5wcmVwZW5kKFxuICAgICAgICAgICAgXCI8ZGl2IGNsYXNzPSdwcmVzZW50YXRpb24tdGl0bGUnPjxkaXYgY2xhc3M9J3RpdGxlLXRleHQnPiBFeGFtcGxlIFwiICtcbiAgICAgICAgICAgICAgICAoTnVtYmVyKGluZGV4KSArIDEpICtcbiAgICAgICAgICAgICAgICBcIjwvZGl2PjwvZGl2PlwiXG4gICAgICAgICk7XG4gICAgfSk7XG5cbiAgICBhY0NvZGUuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBzZWN0aW9uID0gJCh0aGlzKS5jbG9zZXN0KFwiLmFjLWJsb2NrXCIpLnBhcmVudCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhzZWN0aW9uLCBzZWN0aW9uLmxlbmd0aCk7XG4gICAgICAgIHNlY3Rpb24uYXBwZW5kKHNrZXRjaHBhZENvbnRhaW5lcik7XG4gICAgfSk7XG5cbiAgICAkKFwiYnV0dG9uLmNhcmQtbW9kZVwiKS5jbGljaygpO1xuXG4gICAgbGV0IG1vZGVTZWxlY3QgPSAkKFwiLm1vZGUtc2VsZWN0XCIpO1xuICAgIGxldCBtb2RlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJwcmVzZW50TW9kZVwiKTtcbiAgICBpZiAobW9kZSA9PSBcInByZXNlbnRcIikge1xuICAgICAgICBtb2RlU2VsZWN0LnZhbChcInByZXNlbnRcIik7XG4gICAgICAgIG1vZGVTZWxlY3QuY2hhbmdlKCk7XG4gICAgfVxufVxuXG4kKGRvY3VtZW50KS5vbihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgLy8gaWYgdXNlciBpcyBpbnN0cnVjdG9yLCBlbmFibGUgcHJlc2VudGVyIG1vZGVcbiAgICBpZiAoZUJvb2tDb25maWcuaXNJbnN0cnVjdG9yKSB7XG4gICAgICAgIGNvbmZpZ3VyZSgpO1xuICAgIH1cbn0pO1xuIiwiLypcbiAgICBTdXBwb3J0IGZ1bmN0aW9ucyBmb3IgUHJlVGVYdCBib29rcyBydW5uaW5nIG9uIFJ1bmVzdG9uZVxuXG4qL1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi9ydW5lc3RvbmViYXNlLmpzXCI7XG5cbmZ1bmN0aW9uIHNldHVwUFRYRXZlbnRzKCkge1xuICAgIGxldCByYiA9IG5ldyBSdW5lc3RvbmVCYXNlKCk7XG4gICAgLy8gbG9nIGFuIGV2ZW50IHdoZW4gYSBrbm93bCBpcyBvcGVuZWQuXG4gICAgJChcIltkYXRhLWtub3dsXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgZGl2X2lkID0gJCh0aGlzKS5kYXRhKFwicmVmaWRcIik7XG4gICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7IGV2ZW50OiBcImtub3dsXCIsIGFjdDogXCJjbGlja1wiLCBkaXZfaWQ6IGRpdl9pZCB9KTtcbiAgICB9KTtcbiAgICAvLyBsb2cgYW4gZXZlbnQgd2hlbiBhIHNhZ2UgY2VsbCBpcyBldmFsdWF0ZWRcbiAgICAkKFwiLnNhZ2VjZWxsX2V2YWxCdXR0b25cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGZpbmQgcGFyZW50c1xuICAgICAgICBsZXQgY29udGFpbmVyID0gJCh0aGlzKS5jbG9zZXN0KFwiLnNhZ2VjZWxsLXNhZ2VcIik7XG4gICAgICAgIGxldCBjb2RlID0gJChjb250YWluZXJbMF0pLmZpbmQoXCIuc2FnZWNlbGxfaW5wdXRcIilbMF0udGV4dENvbnRlbnQ7XG4gICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7IGV2ZW50OiBcInNhZ2VcIiwgYWN0OiBcInJ1blwiLCBkaXZfaWQ6IGNvbnRhaW5lclswXS5pZCB9KTtcbiAgICB9KTtcbiAgICBpZiAoIWVCb29rQ29uZmlnLmlzSW5zdHJ1Y3Rvcikge1xuICAgICAgICAkKFwiLmNvbW1lbnRhcnlcIikuaGlkZSgpO1xuICAgIH1cbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZyhcInNldHRpbmcgdXAgcHJldGV4dFwiKTtcbiAgICBzZXR1cFBUWEV2ZW50cygpO1xuICAgIGxldCB3cmFwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmltYXJ5LW5hdmJhci1zdGlja3ktd3JhcHBlclwiKTtcbiAgICBpZiAod3JhcCkge1xuICAgICAgICB3cmFwLnN0eWxlLm92ZXJmbG93PVwidmlzaWJsZVwiO1xuICAgIH1cbn0pO1xuIiwiLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIHxkb2NuYW1lfCAtIFJ1bmVzdG9uZSBCYXNlIENsYXNzXG4gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogQWxsIHJ1bmVzdG9uZSBjb21wb25lbnRzIHNob3VsZCBpbmhlcml0IGZyb20gUnVuZXN0b25lQmFzZS4gSW4gYWRkaXRpb24gYWxsIHJ1bmVzdG9uZSBjb21wb25lbnRzIHNob3VsZCBkbyB0aGUgZm9sbG93aW5nIHRoaW5nczpcbiAqXG4gKiAxLiAgIEVuc3VyZSB0aGF0IHRoZXkgYXJlIHdyYXBwZWQgaW4gYSBkaXYgd2l0aCB0aGUgY2xhc3MgcnVuZXN0b25lXG4gKiAyLiAgIFdyaXRlIHRoZWlyIHNvdXJjZSBBTkQgdGhlaXIgZ2VuZXJhdGVkIGh0bWwgdG8gdGhlIGRhdGFiYXNlIGlmIHRoZSBkYXRhYmFzZSBpcyBjb25maWd1cmVkXG4gKiAzLiAgIFByb3Blcmx5IHNhdmUgYW5kIHJlc3RvcmUgdGhlaXIgYW5zd2VycyB1c2luZyB0aGUgY2hlY2tTZXJ2ZXIgbWVjaGFuaXNtIGluIHRoaXMgYmFzZSBjbGFzcy4gRWFjaCBjb21wb25lbnQgbXVzdCBwcm92aWRlIGFuIGltcGxlbWVudGF0aW9uIG9mOlxuICpcbiAqICAgICAgLSAgICBjaGVja0xvY2FsU3RvcmFnZVxuICogICAgICAtICAgIHNldExvY2FsU3RvcmFnZVxuICogICAgICAtICAgIHJlc3RvcmVBbnN3ZXJzXG4gKiAgICAgIC0gICAgZGlzYWJsZUludGVyYWN0aW9uXG4gKlxuICogNC4gICBwcm92aWRlIGEgU2VsZW5pdW0gYmFzZWQgdW5pdCB0ZXN0XG4gKi9cblxuaW1wb3J0IHsgcGFnZVByb2dyZXNzVHJhY2tlciB9IGZyb20gXCIuL2Jvb2tmdW5jcy5qc1wiO1xuLy9pbXBvcnQgXCIuLy4uL3N0eWxlcy9ydW5lc3RvbmUtY3VzdG9tLXNwaGlueC1ib290c3RyYXAuY3NzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnRfcmVhZHlfcHJvbWlzZSA9IG5ldyBQcm9taXNlKFxuICAgICAgICAgICAgKHJlc29sdmUpID0+ICh0aGlzLl9jb21wb25lbnRfcmVhZHlfcmVzb2x2ZV9mbiA9IHJlc29sdmUpXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMub3B0aW9uYWwgPSBmYWxzZTtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cuYWxsQ29tcG9uZW50cyA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgd2luZG93LmFsbENvbXBvbmVudHMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cuYWxsQ29tcG9uZW50cy5wdXNoKHRoaXMpO1xuICAgICAgICBpZiAob3B0cykge1xuICAgICAgICAgICAgdGhpcy5zaWQgPSBvcHRzLnNpZDtcbiAgICAgICAgICAgIHRoaXMuZ3JhZGVyYWN0aXZlID0gb3B0cy5ncmFkZXJhY3RpdmU7XG4gICAgICAgICAgICB0aGlzLnNob3dmZWVkYmFjayA9IHRydWU7XG4gICAgICAgICAgICBpZiAob3B0cy50aW1lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNUaW1lZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0cy5lbmZvcmNlRGVhZGxpbmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWRsaW5lID0gb3B0cy5kZWFkbGluZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkKG9wdHMub3JpZykuZGF0YShcIm9wdGlvbmFsXCIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25hbCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9uYWwgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRzLnNlbGVjdG9yX2lkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rvcl9pZCA9IG9wdHMuc2VsZWN0b3JfaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdHMuYXNzZXNzbWVudFRha2VuICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hc3Nlc3NtZW50VGFrZW4gPSBvcHRzLmFzc2Vzc21lbnRUYWtlbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZGVmYXVsdCB0byB0cnVlIGFzIHRoaXMgb3B0IGlzIG9ubHkgcHJvdmlkZWQgZnJvbSBhIHRpbWVkQXNzZXNzbWVudFxuICAgICAgICAgICAgICAgIHRoaXMuYXNzZXNzbWVudFRha2VuID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFRoaXMgaXMgZm9yIHRoZSBzZWxlY3RxdWVzdGlvbiBwb2ludHNcbiAgICAgICAgICAgIC8vIElmIGEgc2VsZWN0cXVlc3Rpb24gaXMgcGFydCBvZiBhIHRpbWVkIGV4YW0gaXQgd2lsbCBnZXRcbiAgICAgICAgICAgIC8vIHRoZSB0aW1lZFdyYXBwZXIgb3B0aW9ucy5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0cy50aW1lZFdyYXBwZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVkV3JhcHBlciA9IG9wdHMudGltZWRXcmFwcGVyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBIb3dldmVyIHNvbWV0aW1lcyBzZWxlY3RxdWVzdGlvbnNcbiAgICAgICAgICAgICAgICAvLyBhcmUgdXNlZCBpbiByZWd1bGFyIGFzc2lnbm1lbnRzLiAgVGhlIGhhY2t5IHdheSB0byBkZXRlY3QgdGhpc1xuICAgICAgICAgICAgICAgIC8vIGlzIHRvIGxvb2sgZm9yIGRvQXNzaWdubWVudCBpbiB0aGUgVVJMIGFuZCB0aGVuIGdyYWJcbiAgICAgICAgICAgICAgICAvLyB0aGUgYXNzaWdubWVudCBuYW1lIGZyb20gdGhlIGhlYWRpbmcuXG4gICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5kZXhPZihcImRvQXNzaWdubWVudFwiKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZWRXcmFwcGVyID0gJChcImgxI2Fzc2lnbm1lbnRfbmFtZVwiKS50ZXh0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lZFdyYXBwZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkKG9wdHMub3JpZykuZGF0YShcInF1ZXN0aW9uX2xhYmVsXCIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvbl9sYWJlbCA9ICQob3B0cy5vcmlnKS5kYXRhKFwicXVlc3Rpb25fbGFiZWxcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmlzX3RvZ2dsZSA9IHRydWUgPyBvcHRzLmlzX3RvZ2dsZSA6IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5pc19zZWxlY3QgPSB0cnVlID8gb3B0cy5pc19zZWxlY3QgOiBmYWxzZTtcblxuICAgICAgICB9XG4gICAgICAgIHRoaXMubWplbGVtZW50cyA9IFtdO1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMubWpSZWFkeSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgc2VsZi5tanJlc29sdmVyID0gcmVzb2x2ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYVF1ZXVlID0gbmV3IEF1dG9RdWV1ZSgpO1xuICAgICAgICB0aGlzLmpzb25IZWFkZXJzID0gbmV3IEhlYWRlcnMoe1xuICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIsXG4gICAgICAgICAgICBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBfYGxvZ0Jvb2tFdmVudGBcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHNlbmRzIHRoZSBwcm92aWRlZCBgYGV2ZW50SW5mb2BgIHRvIHRoZSBgaHNibG9nIGVuZHBvaW50YCBvZiB0aGUgc2VydmVyLiBBd2FpdGluZyB0aGlzIGZ1bmN0aW9uIHJldHVybnMgZWl0aGVyIGBgdW5kZWZpbmVkYGAgKGlmIFJ1bmVzdG9uZSBzZXJ2aWNlcyBhcmUgbm90IGF2YWlsYWJsZSkgb3IgdGhlIGRhdGEgcmV0dXJuZWQgYnkgdGhlIHNlcnZlciBhcyBhIEphdmFTY3JpcHQgb2JqZWN0IChhbHJlYWR5IEpTT04tZGVjb2RlZCkuXG4gICAgYXN5bmMgbG9nQm9va0V2ZW50KGV2ZW50SW5mbykge1xuICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcG9zdF9yZXR1cm47XG4gICAgICAgIGV2ZW50SW5mby5jb3Vyc2VfbmFtZSA9IGVCb29rQ29uZmlnLmNvdXJzZTtcbiAgICAgICAgZXZlbnRJbmZvLmNsaWVudExvZ2luU3RhdHVzID0gZUJvb2tDb25maWcuaXNMb2dnZWRJbjtcbiAgICAgICAgZXZlbnRJbmZvLnRpbWV6b25lb2Zmc2V0ID0gbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjA7XG4gICAgICAgIGlmICh0eXBlb2YodGhpcy5wZXJjZW50KSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgZXZlbnRJbmZvLnBlcmNlbnQgPSB0aGlzLnBlcmNlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgZUJvb2tDb25maWcuaXNMb2dnZWRJbiAmJlxuICAgICAgICAgICAgZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMgJiZcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmxvZ0xldmVsID4gMFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHBvc3RfcmV0dXJuID0gdGhpcy5wb3N0TG9nTWVzc2FnZShldmVudEluZm8pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5pc1RpbWVkIHx8IGVCb29rQ29uZmlnLmRlYnVnKSB7XG4gICAgICAgICAgICBsZXQgcHJlZml4ID0gZUJvb2tDb25maWcuaXNMb2dnZWRJbiA/IFwiU2F2ZVwiIDogXCJOb3RcIjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke3ByZWZpeH0gbG9nZ2luZyBldmVudCBgICsgSlNPTi5zdHJpbmdpZnkoZXZlbnRJbmZvKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2hlbiBzZWxlY3RxdWVzdGlvbnMgYXJlIHBhcnQgb2YgYW4gYXNzaWdubWVudCBlc3BlY2lhbGx5IHRvZ2dsZSBxdWVzdGlvbnNcbiAgICAgICAgLy8gd2UgbmVlZCB0byBjb3VudCB1c2luZyB0aGUgc2VsZWN0b3JfaWQgb2YgdGhlIHNlbGVjdCBxdWVzdGlvbi5cbiAgICAgICAgLy8gV2UgIGFsc28gbmVlZCB0byBsb2cgYW4gZXZlbnQgZm9yIHRoYXQgc2VsZWN0b3Igc28gdGhhdCB3ZSB3aWxsIGtub3dcbiAgICAgICAgLy8gdGhhdCBpbnRlcmFjdGlvbiBoYXMgdGFrZW4gcGxhY2UuICBUaGlzIGlzICoqaW5kZXBlbmRlbnQqKiBvZiBob3cgdGhlXG4gICAgICAgIC8vIGF1dG9ncmFkZXIgd2lsbCB1bHRpbWF0ZWx5IGdyYWRlIHRoZSBxdWVzdGlvbiFcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0b3JfaWQpIHtcbiAgICAgICAgICAgIGV2ZW50SW5mby5kaXZfaWQgPSB0aGlzLnNlbGVjdG9yX2lkLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgXCItdG9nZ2xlU2VsZWN0ZWRRdWVzdGlvblwiLFxuICAgICAgICAgICAgICAgIFwiXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBldmVudEluZm8uZXZlbnQgPSBcInNlbGVjdHF1ZXN0aW9uXCI7XG4gICAgICAgICAgICBldmVudEluZm8uYWN0ID0gXCJpbnRlcmFjdGlvblwiO1xuICAgICAgICAgICAgdGhpcy5wb3N0TG9nTWVzc2FnZShldmVudEluZm8pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHR5cGVvZiBwYWdlUHJvZ3Jlc3NUcmFja2VyLnVwZGF0ZVByb2dyZXNzID09PSBcImZ1bmN0aW9uXCIgJiZcbiAgICAgICAgICAgIGV2ZW50SW5mby5hY3QgIT0gXCJlZGl0XCIgJiZcbiAgICAgICAgICAgIHRoaXMub3B0aW9uYWwgPT0gZmFsc2VcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBwYWdlUHJvZ3Jlc3NUcmFja2VyLnVwZGF0ZVByb2dyZXNzKGV2ZW50SW5mby5kaXZfaWQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwb3N0X3JldHVybjtcbiAgICB9XG5cbiAgICBhc3luYyBwb3N0TG9nTWVzc2FnZShldmVudEluZm8pIHtcbiAgICAgICAgdmFyIHBvc3RfcmV0dXJuO1xuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2xvZ2dlci9ib29rZXZlbnRgLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmpzb25IZWFkZXJzLFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGV2ZW50SW5mbyksXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MjIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGRldGFpbHMgYWJvdXQgd2h5IHRoaXMgaXMgdW5wcm9jZXNhYmxlLlxuICAgICAgICAgICAgICAgICAgICBwb3N0X3JldHVybiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocG9zdF9yZXR1cm4uZGV0YWlsKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5wcm9jZXNzYWJsZSBSZXF1ZXN0XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDQwMSkge1xuICAgICAgICAgICAgICAgICAgICBwb3N0X3JldHVybiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgICAgICBgTWlzc2luZyBhdXRoZW50aWNhdGlvbiB0b2tlbiAke3Bvc3RfcmV0dXJuLmRldGFpbH1gXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1pc3NpbmcgYXV0aGVudGljYXRpb24gdG9rZW5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIHNhdmUgdGhlIGxvZyBlbnRyeVxuICAgICAgICAgICAgICAgICAgICBTdGF0dXM6ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9zdF9yZXR1cm4gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGxldCBkZXRhaWwgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIGlmIChwb3N0X3JldHVybiAmJiBwb3N0X3JldHVybi5kZXRhaWwpIHtcbiAgICAgICAgICAgICAgICBkZXRhaWwgPSBwb3N0X3JldHVybi5kZXRhaWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZUJvb2tDb25maWcubG9naW5SZXF1aXJlZCkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KGBFcnJvcjogWW91ciBhY3Rpb24gd2FzIG5vdCBzYXZlZCFcbiAgICAgICAgICAgICAgICAgICAgVGhlIGVycm9yIHdhcyAke2V9XG4gICAgICAgICAgICAgICAgICAgIFN0YXR1cyBDb2RlOiAke3Jlc3BvbnNlLnN0YXR1c31cbiAgICAgICAgICAgICAgICAgICAgRGV0YWlsOiAke2RldGFpbH0uXG4gICAgICAgICAgICAgICAgICAgIFBsZWFzZSByZXBvcnQgdGhpcyBlcnJvciFgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNlbmQgYSByZXF1ZXN0IHRvIHNhdmUgdGhpcyBlcnJvclxuICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yOiAke2V9IERldGFpbDogJHtkZXRhaWx9IFN0YXR1cyBDb2RlOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcG9zdF9yZXR1cm47XG4gICAgfVxuICAgIC8vIC4uIF9sb2dSdW5FdmVudDpcbiAgICAvL1xuICAgIC8vIGxvZ1J1bkV2ZW50XG4gICAgLy8gLS0tLS0tLS0tLS1cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHNlbmRzIHRoZSBwcm92aWRlZCBgYGV2ZW50SW5mb2BgIHRvIHRoZSBgcnVubG9nIGVuZHBvaW50YC4gV2hlbiBhd2FpdGVkLCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIGRhdGEgKGRlY29kZWQgZnJvbSBKU09OKSB0aGUgc2VydmVyIHNlbnQgYmFjay5cbiAgICBhc3luYyBsb2dSdW5FdmVudChldmVudEluZm8pIHtcbiAgICAgICAgbGV0IHBvc3RfcHJvbWlzZSA9IFwiZG9uZVwiO1xuICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBldmVudEluZm8uY291cnNlID0gZUJvb2tDb25maWcuY291cnNlO1xuICAgICAgICBldmVudEluZm8uY2xpZW50TG9naW5TdGF0dXMgPSBlQm9va0NvbmZpZy5pc0xvZ2dlZEluO1xuICAgICAgICBldmVudEluZm8udGltZXpvbmVvZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MDtcbiAgICAgICAgaWYgKHRoaXMuZm9yY2VTYXZlIHx8IFwidG9fc2F2ZVwiIGluIGV2ZW50SW5mbyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGV2ZW50SW5mby5zYXZlX2NvZGUgPSBcIlRydWVcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBlQm9va0NvbmZpZy5pc0xvZ2dlZEluICYmXG4gICAgICAgICAgICBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyAmJlxuICAgICAgICAgICAgZUJvb2tDb25maWcubG9nTGV2ZWwgPiAwXG4gICAgICAgICkge1xuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdChcbiAgICAgICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vbG9nZ2VyL3J1bmxvZ2AsIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5qc29uSGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZXZlbnRJbmZvKSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG4gICAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgcG9zdF9wcm9taXNlID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgICAgIGlmIChlQm9va0NvbmZpZy5sb2dpblJlcXVpcmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGBGYWlsZWQgdG8gc2F2ZSB5b3VyIGNvZGVcbiAgICAgICAgICAgICAgICAgICAgICAgIFN0YXR1cyBpcyAke3Jlc3BvbnNlLnN0YXR1c31cbiAgICAgICAgICAgICAgICAgICAgICAgIERldGFpbDogJHtwb3N0X3Byb21pc2UuZGV0YWlsfWApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgYERpZCBub3Qgc2F2ZSB0aGUgY29kZS4gU3RhdHVzOiAke3Jlc3BvbnNlLnN0YXR1c31gXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwb3N0X3Byb21pc2UgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmlzVGltZWQgfHwgZUJvb2tDb25maWcuZGVidWcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicnVubmluZyBcIiArIEpTT04uc3RyaW5naWZ5KGV2ZW50SW5mbykpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHR5cGVvZiBwYWdlUHJvZ3Jlc3NUcmFja2VyLnVwZGF0ZVByb2dyZXNzID09PSBcImZ1bmN0aW9uXCIgJiZcbiAgICAgICAgICAgIHRoaXMub3B0aW9uYWwgPT0gZmFsc2VcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBwYWdlUHJvZ3Jlc3NUcmFja2VyLnVwZGF0ZVByb2dyZXNzKGV2ZW50SW5mby5kaXZfaWQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwb3N0X3Byb21pc2U7XG4gICAgfVxuICAgIC8qIENoZWNraW5nL2xvYWRpbmcgZnJvbSBzdG9yYWdlXG4gICAgKipXQVJOSU5HOioqICBETyBOT1QgYGF3YWl0YCB0aGlzIGZ1bmN0aW9uIVxuICAgIFRoaXMgZnVuY3Rpb24sIGFsdGhvdWdoIGFzeW5jLCBkb2VzIG5vdCBleHBsaWNpdGx5IHJlc29sdmUgaXRzIHByb21pc2UgYnkgcmV0dXJuaW5nIGEgdmFsdWUuICBUaGUgcmVhc29uIGZvciB0aGlzIGlzIGJlY2F1c2UgaXQgaXMgY2FsbGVkIGJ5IHRoZSBjb25zdHJ1Y3RvciBmb3IgbmVhcmx5IGV2ZXJ5IGNvbXBvbmVudC4gIEluIEphdmFzY3JpcHQgY29uc3RydWN0b3JzIGNhbm5vdCBiZSBhc3luYyFcblxuICAgIE9uZSBvZiB0aGUgcmVjb21tZW5kZWQgd2F5cyB0byBoYW5kbGUgdGhlIGFzeW5jIHJlcXVpcmVtZW50cyBmcm9tIHdpdGhpbiBhIGNvbnN0cnVjdG9yIGlzIHRvIHVzZSBhbiBhdHRyaWJ1dGUgYXMgYSBwcm9taXNlIGFuZCByZXNvbHZlIHRoYXQgYXR0cmlidXRlIGF0IHRoZSBhcHByb3ByaWF0ZSB0aW1lLlxuICAgICovXG4gICAgYXN5bmMgY2hlY2tTZXJ2ZXIoXG4gICAgICAgIC8vIEEgc3RyaW5nIHNwZWNpZnlpbmcgdGhlIGV2ZW50IG5hbWUgdG8gdXNlIGZvciBxdWVyeWluZyB0aGUgOnJlZjpgZ2V0QXNzZXNzUmVzdWx0c2AgZW5kcG9pbnQuXG4gICAgICAgIGV2ZW50SW5mbyxcbiAgICAgICAgLy8gSWYgdHJ1ZSwgdGhpcyBmdW5jdGlvbiB3aWxsIGludm9rZSBgYGluZGljYXRlX2NvbXBvbmVudF9yZWFkeSgpYGAganVzdCBiZWZvcmUgaXQgcmV0dXJucy4gVGhpcyBpcyBwcm92aWRlZCBzaW5jZSBtb3N0IGNvbXBvbmVudHMgYXJlIHJlYWR5IGFmdGVyIHRoaXMgZnVuY3Rpb24gY29tcGxldGVzIGl0cyB3b3JrLlxuICAgICAgICAvL1xuICAgICAgICAvLyBUT0RPOiBUaGlzIGRlZmF1bHRzIHRvIGZhbHNlLCB0byBhdm9pZCBjYXVzaW5nIHByb2JsZW1zIHdpdGggYW55IGNvbXBvbmVudHMgdGhhdCBoYXZlbid0IGJlZW4gdXBkYXRlZCBhbmQgdGVzdGVkLiBBZnRlciBhbGwgUnVuZXN0b25lIGNvbXBvbmVudHMgaGF2ZSBiZWVuIHVwZGF0ZWQsIGRlZmF1bHQgdGhpcyB0byB0cnVlIGFuZCByZW1vdmUgdGhlIGV4dHJhIHBhcmFtZXRlciBmcm9tIG1vc3QgY2FsbHMgdG8gdGhpcyBmdW5jdGlvbi5cbiAgICAgICAgd2lsbF9iZV9yZWFkeSA9IGZhbHNlXG4gICAgKSB7XG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBzZXJ2ZXIgaGFzIHN0b3JlZCBhbnN3ZXJcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmNoZWNrU2VydmVyQ29tcGxldGUgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIHNlbGYuY3NyZXNvbHZlciA9IHJlc29sdmU7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBlQm9va0NvbmZpZy5pc0xvZ2dlZEluICYmXG4gICAgICAgICAgICAodGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcyB8fCB0aGlzLmdyYWRlcmFjdGl2ZSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IHt9O1xuICAgICAgICAgICAgZGF0YS5kaXZfaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICAgICAgZGF0YS5jb3Vyc2UgPSBlQm9va0NvbmZpZy5jb3Vyc2U7XG4gICAgICAgICAgICBkYXRhLmV2ZW50ID0gZXZlbnRJbmZvO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlICYmIHRoaXMuZGVhZGxpbmUpIHtcbiAgICAgICAgICAgICAgICBkYXRhLmRlYWRsaW5lID0gdGhpcy5kZWFkbGluZTtcbiAgICAgICAgICAgICAgICBkYXRhLnJhd2RlYWRsaW5lID0gdGhpcy5yYXdkZWFkbGluZTtcbiAgICAgICAgICAgICAgICBkYXRhLnR6b2ZmID0gdGhpcy50em9mZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnNpZCkge1xuICAgICAgICAgICAgICAgIGRhdGEuc2lkID0gdGhpcy5zaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIShkYXRhLmRpdl9pZCAmJiBkYXRhLmNvdXJzZSAmJiBkYXRhLmV2ZW50KSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICBgQSByZXF1aXJlZCBmaWVsZCBpcyBtaXNzaW5nIGRhdGEgJHtkYXRhLmRpdl9pZH06JHtkYXRhLmNvdXJzZX06JHtkYXRhLmV2ZW50fWBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSWYgd2UgYXJlIE5PVCBpbiBwcmFjdGljZSBtb2RlIGFuZCB3ZSBhcmUgbm90IGluIGEgcGVlciBleGVyY2lzZVxuICAgICAgICAgICAgLy8gYW5kIGFzc2Vzc21lbnRUYWtlbiBpcyB0cnVlXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgIWVCb29rQ29uZmlnLnByYWN0aWNlX21vZGUgJiZcbiAgICAgICAgICAgICAgICAhZUJvb2tDb25maWcucGVlciAmJlxuICAgICAgICAgICAgICAgIHRoaXMuYXNzZXNzbWVudFRha2VuXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vYXNzZXNzbWVudC9yZXN1bHRzYCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5qc29uSGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhLmRldGFpbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVwb3B1bGF0ZUZyb21TdG9yYWdlKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRlbXB0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZihkYXRhLmNvcnJlY3QpICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gZGF0YS5jb3JyZWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jc3Jlc29sdmVyKFwic2VydmVyXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYEhUVFAgRXJyb3IgZ2V0dGluZyByZXN1bHRzOiAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tMb2NhbFN0b3JhZ2UoKTsgLy8ganVzdCBnbyByaWdodCB0byBsb2NhbCBzdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNzcmVzb2x2ZXIoXCJsb2NhbFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja0xvY2FsU3RvcmFnZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZERhdGEoe30pO1xuICAgICAgICAgICAgICAgIHRoaXMuY3NyZXNvbHZlcihcIm5vdCB0YWtlblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tMb2NhbFN0b3JhZ2UoKTsgLy8ganVzdCBnbyByaWdodCB0byBsb2NhbCBzdG9yYWdlXG4gICAgICAgICAgICB0aGlzLmNzcmVzb2x2ZXIoXCJsb2NhbFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh3aWxsX2JlX3JlYWR5KSB7XG4gICAgICAgICAgICB0aGlzLmluZGljYXRlX2NvbXBvbmVudF9yZWFkeSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVGhpcyBtZXRob2QgYXNzdW1lcyB0aGF0IGBgdGhpcy5jb21wb25lbnREaXZgYCByZWZlcnMgdG8gdGhlIGBgZGl2YGAgY29udGFpbmluZyB0aGUgY29tcG9uZW50LCBhbmQgdGhhdCB0aGlzIGNvbXBvbmVudCdzIElEIGlzIHNldC5cbiAgICBpbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKSB7XG4gICAgICAgIC8vIEFkZCBhIGNsYXNzIHRvIGluZGljYXRlIHRoZSBjb21wb25lbnQgaXMgbm93IHJlYWR5LlxuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5jbGFzc0xpc3QuYWRkKFwicnVuZXN0b25lLWNvbXBvbmVudC1yZWFkeVwiKTtcbiAgICAgICAgLy8gUmVzb2x2ZSB0aGUgYGB0aGlzLmNvbXBvbmVudF9yZWFkeV9wcm9taXNlYGAuXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudF9yZWFkeV9yZXNvbHZlX2ZuKCk7XG4gICAgfVxuXG4gICAgbG9hZERhdGEoZGF0YSkge1xuICAgICAgICAvLyBmb3IgbW9zdCBjbGFzc2VzLCBsb2FkRGF0YSBkb2Vzbid0IGRvIGFueXRoaW5nLiBCdXQgZm9yIFBhcnNvbnMsIGFuZCBwZXJoYXBzIG90aGVycyBpbiB0aGUgZnV0dXJlLFxuICAgICAgICAvLyBpbml0aWFsaXphdGlvbiBjYW4gaGFwcGVuIGV2ZW4gd2hlbiB0aGVyZSdzIG5vIGhpc3RvcnkgdG8gYmUgbG9hZGVkXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJlcG9wdWxhdGVGcm9tU3RvcmFnZSBpcyBjYWxsZWQgYWZ0ZXIgYSBzdWNjZXNzZnVsIEFQSSBjYWxsIGlzIG1hZGUgdG8gYGBnZXRBc3Nlc3NSZXN1bHRzYGAgaW5cbiAgICAgKiB0aGUgY2hlY2tTZXJ2ZXIgbWV0aG9kIGluIHRoaXMgY2xhc3NcbiAgICAgKlxuICAgICAqIGBgcmVzdG9yZUFuc3dlcnMsYGAgYGBzZXRMb2NhbFN0b3JhZ2VgYCBhbmQgYGBjaGVja0xvY2FsU3RvcmFnZWBgIGFyZSBkZWZpbmVkIGluIHRoZSBjaGlsZCBjbGFzc2VzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHsqfSBkYXRhIC0gYSBKU09OIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGRhdGEgbmVlZGVkIHRvIHJlc3RvcmUgYSBwcmV2aW91cyBhbnN3ZXIgZm9yIGEgY29tcG9uZW50XG4gICAgICogQHBhcmFtIHsqfSBzdGF0dXMgLSB0aGUgaHR0cCBzdGF0dXNcbiAgICAgKiBAcGFyYW0geyp9IHdoYXRldmVyIC0gaWdub3JlZFxuICAgICAqL1xuICAgIHJlcG9wdWxhdGVGcm9tU3RvcmFnZShkYXRhKSB7XG4gICAgICAgIC8vIGRlY2lkZSB3aGV0aGVyIHRvIHVzZSB0aGUgc2VydmVyJ3MgYW5zd2VyIChpZiB0aGVyZSBpcyBvbmUpIG9yIHRvIGxvYWQgZnJvbSBzdG9yYWdlXG4gICAgICAgIGlmIChkYXRhICE9PSBudWxsICYmIGRhdGEgIT09IFwibm8gZGF0YVwiICYmIHRoaXMuc2hvdWxkVXNlU2VydmVyKGRhdGEpKSB7XG4gICAgICAgICAgICB0aGlzLnJlc3RvcmVBbnN3ZXJzKGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2UoZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrTG9jYWxTdG9yYWdlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2hvdWxkVXNlU2VydmVyKGRhdGEpIHtcbiAgICAgICAgLy8gcmV0dXJucyB0cnVlIGlmIHNlcnZlciBkYXRhIGlzIG1vcmUgcmVjZW50IHRoYW4gbG9jYWwgc3RvcmFnZSBvciBpZiBzZXJ2ZXIgc3RvcmFnZSBpcyBjb3JyZWN0XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGRhdGEuY29ycmVjdCA9PT0gXCJUXCIgfHxcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5sZW5ndGggPT09IDAgfHxcbiAgICAgICAgICAgIHRoaXMuZ3JhZGVyYWN0aXZlID09PSB0cnVlIHx8XG4gICAgICAgICAgICB0aGlzLmlzVGltZWRcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZXggPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgaWYgKGV4ID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc3RvcmVkRGF0YTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHN0b3JlZERhdGEgPSBKU09OLnBhcnNlKGV4KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAvLyBlcnJvciB3aGlsZSBwYXJzaW5nOyBsaWtlbHkgZHVlIHRvIGJhZCB2YWx1ZSBzdG9yZWQgaW4gc3RvcmFnZVxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG4gICAgICAgICAgICAvLyBkZWZpbml0ZWx5IGRvbid0IHdhbnQgdG8gdXNlIGxvY2FsIHN0b3JhZ2UgaGVyZVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEuYW5zd2VyID09IHN0b3JlZERhdGEuYW5zd2VyKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgbGV0IHN0b3JhZ2VEYXRlID0gbmV3IERhdGUoc3RvcmVkRGF0YS50aW1lc3RhbXApO1xuICAgICAgICBsZXQgc2VydmVyRGF0ZSA9IG5ldyBEYXRlKGRhdGEudGltZXN0YW1wKTtcbiAgICAgICAgcmV0dXJuIHNlcnZlckRhdGUgPj0gc3RvcmFnZURhdGU7XG4gICAgfVxuICAgIC8vIFJldHVybiB0aGUga2V5IHdoaWNoIHRvIGJlIHVzZWQgd2hlbiBhY2Nlc3NpbmcgbG9jYWwgc3RvcmFnZS5cbiAgICBsb2NhbFN0b3JhZ2VLZXkoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBlQm9va0NvbmZpZy5lbWFpbCArXG4gICAgICAgICAgICBcIjpcIiArXG4gICAgICAgICAgICBlQm9va0NvbmZpZy5jb3Vyc2UgK1xuICAgICAgICAgICAgXCI6XCIgK1xuICAgICAgICAgICAgdGhpcy5kaXZpZCArXG4gICAgICAgICAgICBcIi1naXZlblwiXG4gICAgICAgICk7XG4gICAgfVxuICAgIGFkZENhcHRpb24oZWxUeXBlKSB7XG4gICAgICAgIC8vc29tZUVsZW1lbnQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobmV3RWxlbWVudCwgc29tZUVsZW1lbnQubmV4dFNpYmxpbmcpO1xuICAgICAgICBpZiAoIXRoaXMuaXNUaW1lZCkge1xuICAgICAgICAgICAgdmFyIGNhcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25fbGFiZWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhcHRpb24gPSBgQWN0aXZpdHk6ICR7dGhpcy5xdWVzdGlvbl9sYWJlbH0gJHt0aGlzLmNhcHRpb259ICA8c3BhbiBjbGFzcz1cInJ1bmVzdG9uZV9jYXB0aW9uX2RpdmlkXCI+KCR7dGhpcy5kaXZpZH0pPC9zcGFuPmA7XG4gICAgICAgICAgICAgICAgJChjYXBEaXYpLmh0bWwodGhpcy5jYXB0aW9uKTtcbiAgICAgICAgICAgICAgICAkKGNhcERpdikuYWRkQ2xhc3MoYCR7ZWxUeXBlfV9jYXB0aW9uYCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoY2FwRGl2KS5odG1sKHRoaXMuY2FwdGlvbiArIFwiIChcIiArIHRoaXMuZGl2aWQgKyBcIilcIik7XG4gICAgICAgICAgICAgICAgJChjYXBEaXYpLmFkZENsYXNzKGAke2VsVHlwZX1fY2FwdGlvbmApO1xuICAgICAgICAgICAgICAgICQoY2FwRGl2KS5hZGRDbGFzcyhgJHtlbFR5cGV9X2NhcHRpb25fdGV4dGApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jYXBEaXYgPSBjYXBEaXY7XG4gICAgICAgICAgICAvL3RoaXMub3V0ZXJEaXYucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoY2FwRGl2LCB0aGlzLm91dGVyRGl2Lm5leHRTaWJsaW5nKTtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKGNhcERpdik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYXNVc2VyQWN0aXZpdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzQW5zd2VyZWQ7XG4gICAgfVxuXG4gICAgY2hlY2tDdXJyZW50QW5zd2VyKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIFwiRWFjaCBjb21wb25lbnQgc2hvdWxkIHByb3ZpZGUgYW4gaW1wbGVtZW50YXRpb24gb2YgY2hlY2tDdXJyZW50QW5zd2VyXCJcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBhc3luYyBsb2dDdXJyZW50QW5zd2VyKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIFwiRWFjaCBjb21wb25lbnQgc2hvdWxkIHByb3ZpZGUgYW4gaW1wbGVtZW50YXRpb24gb2YgbG9nQ3VycmVudEFuc3dlclwiXG4gICAgICAgICk7XG4gICAgfVxuICAgIHJlbmRlckZlZWRiYWNrKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIFwiRWFjaCBjb21wb25lbnQgc2hvdWxkIHByb3ZpZGUgYW4gaW1wbGVtZW50YXRpb24gb2YgcmVuZGVyRmVlZGJhY2tcIlxuICAgICAgICApO1xuICAgIH1cbiAgICBkaXNhYmxlSW50ZXJhY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgXCJFYWNoIGNvbXBvbmVudCBzaG91bGQgcHJvdmlkZSBhbiBpbXBsZW1lbnRhdGlvbiBvZiBkaXNhYmxlSW50ZXJhY3Rpb25cIlxuICAgICAgICApO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfTogJHt0aGlzLmRpdmlkfWA7XG4gICAgfVxuXG4gICAgcXVldWVNYXRoSmF4KGNvbXBvbmVudCkge1xuICAgICAgICBpZiAodHlwZW9mKE1hdGhKYXgpID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIC0tIE1hdGhKYXggaXMgbm90IGxvYWRlZFwiKVxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFNlZSAtIGh0dHBzOi8vZG9jcy5tYXRoamF4Lm9yZy9lbi9sYXRlc3QvYWR2YW5jZWQvdHlwZXNldC5odG1sXG4gICAgICAgICAgICAvLyBQZXIgdGhlIGFib3ZlIHdlIHNob3VsZCBrZWVwIHRyYWNrIG9mIHRoZSBwcm9taXNlcyBhbmQgb25seSBjYWxsIHRoaXNcbiAgICAgICAgICAgIC8vIGEgc2Vjb25kIHRpbWUgaWYgYWxsIHByZXZpb3VzIHByb21pc2VzIGhhdmUgcmVzb2x2ZWQuXG4gICAgICAgICAgICAvLyBDcmVhdGUgYSBxdWV1ZSBvZiBjb21wb25lbnRzXG4gICAgICAgICAgICAvLyBzaG91bGQgd2FpdCB1bnRpbCBkZWZhdWx0UGFnZVJlYWR5IGlzIGRlZmluZWRcbiAgICAgICAgICAgIC8vIElmIGRlZmF1bHRQYWdlUmVhZHkgaXMgbm90IGRlZmluZWQgdGhlbiBqdXN0IGVucXVldWUgdGhlIGNvbXBvbmVudHMuXG4gICAgICAgICAgICAvLyBPbmNlIGRlZmF1bHRQYWdlUmVhZHkgaXMgZGVmaW5lZFxuICAgICAgICAgICAgaWYgKE1hdGhKYXgudHlwZXNldFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tanJlc29sdmVyKHRoaXMuYVF1ZXVlLmVucXVldWUoY29tcG9uZW50KSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFdhaXRpbmcgb24gTWF0aEpheCEhICR7TWF0aEpheC50eXBlc2V0UHJvbWlzZX1gKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMucXVldWVNYXRoSmF4KGNvbXBvbmVudCksIDIwMCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFJldHVybmluZyBtanJlYWR5IHByb21pc2U6ICR7dGhpcy5talJlYWR5fWApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWpSZWFkeTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRlY29yYXRlU3RhdHVzKCkge1xuICAgICAgICBsZXQgcnNEaXYgPSAkKHRoaXMuY29udGFpbmVyRGl2KS5jbG9zZXN0KFwiZGl2LnJ1bmVzdG9uZVwiKVswXTtcbiAgICAgICAgaWYgKHRoaXMuY29ycmVjdCkge1xuICAgICAgICAgICAgcnNEaXYuY2xhc3NMaXN0LmFkZChcImlzQ29ycmVjdFwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvcnJlY3QgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByc0Rpdi5jbGFzc0xpc3QuYWRkKFwibm90QW5zd2VyZWRcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJzRGl2LmNsYXNzTGlzdC5hZGQoXCJpc0luQ29ycmVjdFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5cbi8vIEluc3BpcmF0aW9uIGFuZCBsb3RzIG9mIGNvZGUgZm9yIHRoaXMgc29sdXRpb24gY29tZSBmcm9tXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MzU0MDM0OC9qcy1hc3luYy1hd2FpdC10YXNrcy1xdWV1ZVxuLy8gVGhlIGlkZWEgaGVyZSBpcyB0aGF0IHVudGlsIE1hdGhKYXggaXMgcmVhZHkgd2UgY2FuIGp1c3QgZW5xdWV1ZSB0aGluZ3Ncbi8vIG9uY2UgbWF0aGpheCBiZWNvbWVzIHJlYWR5IHRoZW4gd2UgY2FuIGRyYWluIHRoZSBxdWV1ZSBhbmQgY29udGludWUgYXMgdXN1YWwuXG5cbmNsYXNzIFF1ZXVlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHsgdGhpcy5faXRlbXMgPSBbXTsgfVxuICAgIGVucXVldWUoaXRlbSkgeyB0aGlzLl9pdGVtcy5wdXNoKGl0ZW0pOyB9XG4gICAgZGVxdWV1ZSgpIHsgcmV0dXJuIHRoaXMuX2l0ZW1zLnNoaWZ0KCk7IH1cbiAgICBnZXQgc2l6ZSgpIHsgcmV0dXJuIHRoaXMuX2l0ZW1zLmxlbmd0aDsgfVxufVxuXG5jbGFzcyBBdXRvUXVldWUgZXh0ZW5kcyBRdWV1ZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX3BlbmRpbmdQcm9taXNlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZW5xdWV1ZShjb21wb25lbnQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHN1cGVyLmVucXVldWUoeyBjb21wb25lbnQsIHJlc29sdmUsIHJlamVjdCB9KTtcbiAgICAgICAgICAgIHRoaXMuZGVxdWV1ZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBkZXF1ZXVlKCkge1xuICAgICAgICBpZiAodGhpcy5fcGVuZGluZ1Byb21pc2UpIHJldHVybiBmYWxzZTtcblxuICAgICAgICBsZXQgaXRlbSA9IHN1cGVyLmRlcXVldWUoKTtcblxuICAgICAgICBpZiAoIWl0ZW0pIHJldHVybiBmYWxzZTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5fcGVuZGluZ1Byb21pc2UgPSB0cnVlO1xuXG4gICAgICAgICAgICBsZXQgcGF5bG9hZCA9IGF3YWl0IE1hdGhKYXguc3RhcnR1cC5kZWZhdWx0UGFnZVJlYWR5KCkudGhlbihcbiAgICAgICAgICAgICAgICBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYE1hdGhKYXggUmVhZHkgLS0gZGVxdWVpbmcgYSB0eXBlc2V0dGluZyBydW4gZm9yICR7aXRlbS5jb21wb25lbnQuaWR9YClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IE1hdGhKYXgudHlwZXNldFByb21pc2UoW2l0ZW0uY29tcG9uZW50XSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fcGVuZGluZ1Byb21pc2UgPSBmYWxzZTsgaXRlbS5yZXNvbHZlKHBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wZW5kaW5nUHJvbWlzZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGl0ZW0ucmVqZWN0KGUpO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlcXVldWUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHdpbmRvdy5SdW5lc3RvbmVCYXNlID0gUnVuZXN0b25lQmFzZTtcbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRTd2l0Y2goKSB7XG4gICAgY29uc3QgdG9nZ2xlU3dpdGNoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRoZW1lLXN3aXRjaCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKTtcbiAgICBjb25zdCBjdXJyZW50VGhlbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndGhlbWUnKSA/IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0aGVtZScpIDogbnVsbDtcblxuICAgIGlmIChjdXJyZW50VGhlbWUpIHtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS10aGVtZScsIGN1cnJlbnRUaGVtZSk7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRUaGVtZSA9PT0gJ2RhcmsnKSB7XG4gICAgICAgICAgICB0b2dnbGVTd2l0Y2guY2hlY2tlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzd2l0Y2hUaGVtZSgpIHtcblxuXHR2YXIgY2hlY2tCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoZWNrYm94XCIpO1xuICAgIGlmIChjaGVja0JveC5jaGVja2VkID09IHRydWUpIHtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS10aGVtZScsICdkYXJrJyk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0aGVtZScsICdkYXJrJyk7IC8vYWRkIHRoaXNcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGhlbWUnLCAnbGlnaHQnKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RoZW1lJywgJ2xpZ2h0Jyk7IC8vYWRkIHRoaXNcbiAgICB9XG59XG4iLCIvKmdsb2JhbCB2YXJpYWJsZSBkZWNsYXJhdGlvbnMqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFwiLi4vY3NzL3VzZXItaGlnaGxpZ2h0cy5jc3NcIjtcblxuZnVuY3Rpb24gZ2V0Q29tcGxldGlvbnMoKSB7XG4gICAgLy8gR2V0IHRoZSBjb21wbGV0aW9uIHN0YXR1c1xuICAgIGlmIChcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYubWF0Y2goXG4gICAgICAgICAgICAvKGluZGV4Lmh0bWx8dG9jdHJlZS5odG1sfGdlbmluZGV4Lmh0bWx8bmF2aGVscC5odG1sfHRvYy5odG1sfGFzc2lnbm1lbnRzLmh0bWx8RXhlcmNpc2VzLmh0bWwpL1xuICAgICAgICApXG4gICAgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgY3VycmVudFBhdGhuYW1lID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgIGlmIChjdXJyZW50UGF0aG5hbWUuaW5kZXhPZihcIj9cIikgIT09IC0xKSB7XG4gICAgICAgIGN1cnJlbnRQYXRobmFtZSA9IGN1cnJlbnRQYXRobmFtZS5zdWJzdHJpbmcoXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgY3VycmVudFBhdGhuYW1lLmxhc3RJbmRleE9mKFwiP1wiKVxuICAgICAgICApO1xuICAgIH1cbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgbGFzdFBhZ2VVcmw6IGN1cnJlbnRQYXRobmFtZSxcbiAgICAgICAgaXNQdHhCb29rOiBpc1ByZVRlWHQoKVxuICAgICB9O1xuICAgIGpRdWVyeVxuICAgICAgICAuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9sb2dnZXIvZ2V0Q29tcGxldGlvblN0YXR1c2AsXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICB9KVxuICAgICAgICAuZG9uZShmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgaWYgKGRhdGEgIT0gXCJOb25lXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29tcGxldGlvbkRhdGEgPSBkYXRhLmRldGFpbDtcbiAgICAgICAgICAgICAgICB2YXIgY29tcGxldGlvbkNsYXNzLCBjb21wbGV0aW9uTXNnO1xuICAgICAgICAgICAgICAgIGlmIChjb21wbGV0aW9uRGF0YVswXS5jb21wbGV0aW9uU3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGlvbkNsYXNzID0gXCJidXR0b25Db25maXJtQ29tcGxldGlvblwiO1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0aW9uTXNnID1cbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPGkgY2xhc3M9J2dseXBoaWNvbiBnbHlwaGljb24tb2snPjwvaT4gQ29tcGxldGVkLiBXZWxsIERvbmUhXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGlvbkNsYXNzID0gXCJidXR0b25Bc2tDb21wbGV0aW9uXCI7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRpb25Nc2cgPSBcIk1hcmsgYXMgQ29tcGxldGVkXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQoXCIjc2Nwcm9ncmVzc2NvbnRhaW5lclwiKS5hcHBlbmQoXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjpjZW50ZXJcIj48YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1sZyAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRpb25DbGFzcyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnXCIgaWQ9XCJjb21wbGV0aW9uQnV0dG9uXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0aW9uTXNnICtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPC9idXR0b24+PC9kaXY+XCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbn1cblxuZnVuY3Rpb24gc2hvd0xhc3RQb3NpdGlvbkJhbm5lcigpIHtcbiAgICB2YXIgbGFzdFBvc2l0aW9uVmFsID0gJC5nZXRVcmxWYXIoXCJsYXN0UG9zaXRpb25cIik7XG4gICAgaWYgKHR5cGVvZiBsYXN0UG9zaXRpb25WYWwgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgJChcImJvZHlcIikuYXBwZW5kKFxuICAgICAgICAgICAgJzxpbWcgc3JjPVwiLi4vX3N0YXRpYy9sYXN0LXBvaW50LnBuZ1wiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7IHBhZGRpbmctdG9wOjU1cHg7IGxlZnQ6IDEwcHg7IHRvcDogJyArXG4gICAgICAgICAgICAgICAgcGFyc2VJbnQobGFzdFBvc2l0aW9uVmFsKSArXG4gICAgICAgICAgICAgICAgJ3B4O1wiLz4nXG4gICAgICAgICk7XG4gICAgICAgICQoXCJodG1sLCBib2R5XCIpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IHBhcnNlSW50KGxhc3RQb3NpdGlvblZhbCkgfSwgMTAwMCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhZGROYXZpZ2F0aW9uQW5kQ29tcGxldGlvbkJ1dHRvbnMoKSB7XG4gICAgaWYgKFxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaChcbiAgICAgICAgICAgIC8oaW5kZXguaHRtbHxnZW5pbmRleC5odG1sfG5hdmhlbHAuaHRtbHx0b2MuaHRtbHxhc3NpZ25tZW50cy5odG1sfEV4ZXJjaXNlcy5odG1sfHRvY3RyZWUuaHRtbCkvXG4gICAgICAgIClcbiAgICApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgbmF2TGlua0JnUmlnaHRIaWRkZW5Qb3NpdGlvbiA9IC0kKFwiI25hdkxpbmtCZ1JpZ2h0XCIpLm91dGVyV2lkdGgoKSAtIDU7XG4gICAgdmFyIG5hdkxpbmtCZ1JpZ2h0SGFsZk9wZW47XG4gICAgdmFyIG5hdkxpbmtCZ1JpZ2h0RnVsbE9wZW4gPSAwO1xuXG4gICAgaWYgKCQoXCIjY29tcGxldGlvbkJ1dHRvblwiKS5oYXNDbGFzcyhcImJ1dHRvbkFza0NvbXBsZXRpb25cIikpIHtcbiAgICAgICAgbmF2TGlua0JnUmlnaHRIYWxmT3BlbiA9IG5hdkxpbmtCZ1JpZ2h0SGlkZGVuUG9zaXRpb24gKyA3MDtcbiAgICB9IGVsc2UgaWYgKCQoXCIjY29tcGxldGlvbkJ1dHRvblwiKS5oYXNDbGFzcyhcImJ1dHRvbkNvbmZpcm1Db21wbGV0aW9uXCIpKSB7XG4gICAgICAgIG5hdkxpbmtCZ1JpZ2h0SGFsZk9wZW4gPSAwO1xuICAgIH1cbiAgICB2YXIgcmVsYXRpb25zTmV4dEljb25Jbml0aWFsUG9zaXRpb24gPSAkKFwiI3JlbGF0aW9ucy1uZXh0XCIpLmNzcyhcInJpZ2h0XCIpO1xuICAgIHZhciByZWxhdGlvbnNOZXh0SWNvbk5ld1Bvc2l0aW9uID0gLShuYXZMaW5rQmdSaWdodEhpZGRlblBvc2l0aW9uICsgMzUpO1xuXG4gICAgJChcIiNuYXZMaW5rQmdSaWdodFwiKS5jc3MoXCJyaWdodFwiLCBuYXZMaW5rQmdSaWdodEhpZGRlblBvc2l0aW9uKS5zaG93KCk7XG4gICAgdmFyIG5hdkJnU2hvd24gPSBmYWxzZTtcbiAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgJCh3aW5kb3cpLmhlaWdodCgpID09XG4gICAgICAgICAgICAkKGRvY3VtZW50KS5oZWlnaHQoKVxuICAgICAgICApIHtcbiAgICAgICAgICAgICQoXCIjbmF2TGlua0JnUmlnaHRcIikuYW5pbWF0ZShcbiAgICAgICAgICAgICAgICB7IHJpZ2h0OiBuYXZMaW5rQmdSaWdodEhhbGZPcGVuIH0sXG4gICAgICAgICAgICAgICAgMjAwXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgJChcIiNuYXZMaW5rQmdMZWZ0XCIpLmFuaW1hdGUoeyBsZWZ0OiBcIjBweFwiIH0sIDIwMCk7XG4gICAgICAgICAgICBpZiAoJChcIiNjb21wbGV0aW9uQnV0dG9uXCIpLmhhc0NsYXNzKFwiYnV0dG9uQ29uZmlybUNvbXBsZXRpb25cIikpIHtcbiAgICAgICAgICAgICAgICAkKFwiI3JlbGF0aW9ucy1uZXh0XCIpLmFuaW1hdGUoXG4gICAgICAgICAgICAgICAgICAgIHsgcmlnaHQ6IHJlbGF0aW9uc05leHRJY29uTmV3UG9zaXRpb24gfSxcbiAgICAgICAgICAgICAgICAgICAgMjAwXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5hdkJnU2hvd24gPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKG5hdkJnU2hvd24pIHtcbiAgICAgICAgICAgICQoXCIjbmF2TGlua0JnUmlnaHRcIikuYW5pbWF0ZShcbiAgICAgICAgICAgICAgICB7IHJpZ2h0OiBuYXZMaW5rQmdSaWdodEhpZGRlblBvc2l0aW9uIH0sXG4gICAgICAgICAgICAgICAgMjAwXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgJChcIiNuYXZMaW5rQmdMZWZ0XCIpLmFuaW1hdGUoeyBsZWZ0OiBcIi02NXB4XCIgfSwgMjAwKTtcbiAgICAgICAgICAgICQoXCIjcmVsYXRpb25zLW5leHRcIikuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgcmlnaHQ6IHJlbGF0aW9uc05leHRJY29uSW5pdGlhbFBvc2l0aW9uLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBuYXZCZ1Nob3duID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjb21wbGV0aW9uRmxhZyA9IDA7XG4gICAgaWYgKCQoXCIjY29tcGxldGlvbkJ1dHRvblwiKS5oYXNDbGFzcyhcImJ1dHRvbkFza0NvbXBsZXRpb25cIikpIHtcbiAgICAgICAgY29tcGxldGlvbkZsYWcgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXBsZXRpb25GbGFnID0gMTtcbiAgICB9XG4gICAgLy8gTWFrZSBzdXJlIHdlIG1hcmsgdGhpcyBwYWdlIGFzIHZpc2l0ZWQgcmVnYXJkbGVzcyBvZiBob3cgZmxha2V5XG4gICAgLy8gdGhlIG9udW5sb2FkIGhhbmRsZXJzIGJlY29tZS5cbiAgICBwcm9jZXNzUGFnZVN0YXRlKGNvbXBsZXRpb25GbGFnKTtcbiAgICAkKFwiI2NvbXBsZXRpb25CdXR0b25cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiYnV0dG9uQXNrQ29tcGxldGlvblwiKSkge1xuICAgICAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhcImJ1dHRvbkFza0NvbXBsZXRpb25cIilcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoXCJidXR0b25Db25maXJtQ29tcGxldGlvblwiKVxuICAgICAgICAgICAgICAgIC5odG1sKFxuICAgICAgICAgICAgICAgICAgICBcIjxpIGNsYXNzPSdnbHlwaGljb24gZ2x5cGhpY29uLW9rJz48L2k+IENvbXBsZXRlZC4gV2VsbCBEb25lIVwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICQoXCIjbmF2TGlua0JnUmlnaHRcIikuYW5pbWF0ZSh7IHJpZ2h0OiBuYXZMaW5rQmdSaWdodEZ1bGxPcGVuIH0pO1xuICAgICAgICAgICAgJChcIiNyZWxhdGlvbnMtbmV4dFwiKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICByaWdodDogcmVsYXRpb25zTmV4dEljb25OZXdQb3NpdGlvbixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbmF2TGlua0JnUmlnaHRIYWxmT3BlbiA9IDA7XG4gICAgICAgICAgICBjb21wbGV0aW9uRmxhZyA9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImJ1dHRvbkNvbmZpcm1Db21wbGV0aW9uXCIpKSB7XG4gICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKFwiYnV0dG9uQ29uZmlybUNvbXBsZXRpb25cIilcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoXCJidXR0b25Bc2tDb21wbGV0aW9uXCIpXG4gICAgICAgICAgICAgICAgLmh0bWwoXCJNYXJrIGFzIENvbXBsZXRlZFwiKTtcbiAgICAgICAgICAgIG5hdkxpbmtCZ1JpZ2h0SGFsZk9wZW4gPSBuYXZMaW5rQmdSaWdodEhpZGRlblBvc2l0aW9uICsgNzA7XG4gICAgICAgICAgICAkKFwiI25hdkxpbmtCZ1JpZ2h0XCIpLmFuaW1hdGUoeyByaWdodDogbmF2TGlua0JnUmlnaHRIYWxmT3BlbiB9KTtcbiAgICAgICAgICAgICQoXCIjcmVsYXRpb25zLW5leHRcIikuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgcmlnaHQ6IHJlbGF0aW9uc05leHRJY29uSW5pdGlhbFBvc2l0aW9uLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb21wbGV0aW9uRmxhZyA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcHJvY2Vzc1BhZ2VTdGF0ZShjb21wbGV0aW9uRmxhZyk7XG4gICAgfSk7XG5cbiAgICAkKHdpbmRvdykub24oXCJiZWZvcmV1bmxvYWRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGNvbXBsZXRpb25GbGFnID09IDApIHtcbiAgICAgICAgICAgIHByb2Nlc3NQYWdlU3RhdGUoY29tcGxldGlvbkZsYWcpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8vIF8gZGVjb3JhdGVUYWJsZU9mQ29udGVudHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIGRlY29yYXRlVGFibGVPZkNvbnRlbnRzKCkge1xuICAgIGlmIChcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwidG9jLmh0bWxcIikgIT0gLTEgfHxcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwiaW5kZXguaHRtbFwiKSAhPSAtMVxuICAgICkge1xuICAgICAgICBqUXVlcnkuZ2V0KFxuICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2xvZ2dlci9nZXRBbGxDb21wbGV0aW9uU3RhdHVzYCxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN1YkNoYXB0ZXJMaXN0O1xuICAgICAgICAgICAgICAgIGlmIChkYXRhICE9IFwiTm9uZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YkNoYXB0ZXJMaXN0ID0gZGF0YS5kZXRhaWw7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGFsbFN1YkNoYXB0ZXJVUkxzID0gJChcIiNtYWluLWNvbnRlbnQgZGl2IGxpIGFcIik7XG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChzdWJDaGFwdGVyTGlzdCwgZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBzID0gMDsgcyA8IGFsbFN1YkNoYXB0ZXJVUkxzLmxlbmd0aDsgcysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxTdWJDaGFwdGVyVVJMc1tzXS5ocmVmLmluZGV4T2YoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmNoYXB0ZXJOYW1lICsgXCIvXCIgKyBpdGVtLnN1YkNoYXB0ZXJOYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgIT0gLTFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29tcGxldGlvblN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGFsbFN1YkNoYXB0ZXJVUkxzW3NdLnBhcmVudEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKFwiY29tcGxldGVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiaW5mb1RleHRDb21wbGV0ZWRcIj4tIENvbXBsZXRlZCB0aGlzIHRvcGljIG9uICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5lbmREYXRlICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiPC9zcGFuPlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jaGlsZHJlbigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpcnN0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaG92ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubmV4dChcIi5pbmZvVGV4dENvbXBsZXRlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubmV4dChcIi5pbmZvVGV4dENvbXBsZXRlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0uY29tcGxldGlvblN0YXR1cyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGFsbFN1YkNoYXB0ZXJVUkxzW3NdLnBhcmVudEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKFwiYWN0aXZlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiaW5mb1RleHRBY3RpdmVcIj5MYXN0IHJlYWQgdGhpcyB0b3BpYyBvbiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uZW5kRGF0ZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjwvc3Bhbj5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2hpbGRyZW4oKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maXJzdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmhvdmVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm5leHQoXCIuaW5mb1RleHRBY3RpdmVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm5leHQoXCIuaW5mb1RleHRBY3RpdmVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICB2YXIgZGF0YSA9IHsgY291cnNlOiBlQm9va0NvbmZpZy5jb3Vyc2UgfTtcbiAgICAgICAgalF1ZXJ5LmdldChcbiAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9sb2dnZXIvZ2V0bGFzdHBhZ2VgLFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxhc3RQYWdlRGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSAhPSBcIk5vbmVcIikge1xuICAgICAgICAgICAgICAgICAgICBsYXN0UGFnZURhdGEgPSBkYXRhLmRldGFpbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RQYWdlRGF0YS5sYXN0UGFnZUNoYXB0ZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIiNjb250aW51ZS1yZWFkaW5nXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNob3coKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5odG1sKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cImp1bXAtdG8tY2hhcHRlclwiIGNsYXNzPVwiYWxlcnQgYWxlcnQtaW5mb1wiID48c3Ryb25nPllvdSB3ZXJlIExhc3QgUmVhZGluZzo8L3N0cm9uZz4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0UGFnZURhdGEubGFzdFBhZ2VDaGFwdGVyICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChsYXN0UGFnZURhdGEubGFzdFBhZ2VTdWJjaGFwdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcIiAmZ3Q7IFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RQYWdlRGF0YS5sYXN0UGFnZVN1YmNoYXB0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiXCIpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgPGEgaHJlZj1cIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFBhZ2VEYXRhLmxhc3RQYWdlVXJsICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiP2xhc3RQb3NpdGlvbj1cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0UGFnZURhdGEubGFzdFBhZ2VTY3JvbGxMb2NhdGlvbiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnXCI+Q29udGludWUgUmVhZGluZzwvYT48L2Rpdj4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGVuYWJsZUNvbXBsZXRpb25zKCkge1xuICAgIGdldENvbXBsZXRpb25zKCk7XG4gICAgc2hvd0xhc3RQb3NpdGlvbkJhbm5lcigpO1xuICAgIGFkZE5hdmlnYXRpb25BbmRDb21wbGV0aW9uQnV0dG9ucygpO1xuICAgIGRlY29yYXRlVGFibGVPZkNvbnRlbnRzKCk7XG59XG5cbi8vIGNhbGwgZW5hYmxlIHVzZXIgaGlnaGxpZ2h0cyBhZnRlciBsb2dpblxuJChkb2N1bWVudCkub24oXCJydW5lc3RvbmU6bG9naW5cIiwgZW5hYmxlQ29tcGxldGlvbnMpO1xuXG5mdW5jdGlvbiBpc1ByZVRlWHQoKSB7XG4gICAgbGV0IHB0eE1hcmtlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5LnByZXRleHRcIik7XG4gICAgaWYgKHB0eE1hcmtlcikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuLy8gXyBwcm9jZXNzUGFnZVN0YXRlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBwcm9jZXNzUGFnZVN0YXRlKGNvbXBsZXRpb25GbGFnKSB7XG4gICAgLypMb2cgbGFzdCBwYWdlIHZpc2l0ZWQqL1xuICAgIHZhciBjdXJyZW50UGF0aG5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgaWYgKGN1cnJlbnRQYXRobmFtZS5pbmRleE9mKFwiP1wiKSAhPT0gLTEpIHtcbiAgICAgICAgY3VycmVudFBhdGhuYW1lID0gY3VycmVudFBhdGhuYW1lLnN1YnN0cmluZyhcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICBjdXJyZW50UGF0aG5hbWUubGFzdEluZGV4T2YoXCI/XCIpXG4gICAgICAgICk7XG4gICAgfVxuICAgIC8vIElzIHRoaXMgYSBwdHggYm9vaz9cbiAgICBsZXQgaXNQdHhCb29rID0gaXNQcmVUZVh0KClcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgbGFzdFBhZ2VVcmw6IGN1cnJlbnRQYXRobmFtZSxcbiAgICAgICAgbGFzdFBhZ2VTY3JvbGxMb2NhdGlvbjogJCh3aW5kb3cpLnNjcm9sbFRvcCgpLFxuICAgICAgICBjb21wbGV0aW9uRmxhZzogY29tcGxldGlvbkZsYWcsXG4gICAgICAgIGNvdXJzZTogZUJvb2tDb25maWcuY291cnNlLFxuICAgICAgICBpc1B0eEJvb2s6IGlzUHR4Qm9vayxcbiAgICB9O1xuICAgICQoZG9jdW1lbnQpLmFqYXhFcnJvcihmdW5jdGlvbiAoZSwganFoeHIsIHNldHRpbmdzLCBleGNlcHRpb24pIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZXF1ZXN0IEZhaWxlZCBmb3IgXCIgKyBzZXR0aW5ncy51cmwpO1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICB9KTtcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIHVybDogYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2xvZ2dlci91cGRhdGVsYXN0cGFnZWAsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIixcbiAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgYXN5bmM6IHRydWUsXG4gICAgfSk7XG59XG5cbiQuZXh0ZW5kKHtcbiAgICBnZXRVcmxWYXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB2YXJzID0gW10sXG4gICAgICAgICAgICBoYXNoO1xuICAgICAgICB2YXIgaGFzaGVzID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaFxuICAgICAgICAgICAgLnNsaWNlKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guaW5kZXhPZihcIj9cIikgKyAxKVxuICAgICAgICAgICAgLnNwbGl0KFwiJlwiKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoYXNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGhhc2ggPSBoYXNoZXNbaV0uc3BsaXQoXCI9XCIpO1xuICAgICAgICAgICAgdmFycy5wdXNoKGhhc2hbMF0pO1xuICAgICAgICAgICAgdmFyc1toYXNoWzBdXSA9IGhhc2hbMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhcnM7XG4gICAgfSxcbiAgICBnZXRVcmxWYXI6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHJldHVybiAkLmdldFVybFZhcnMoKVtuYW1lXTtcbiAgICB9LFxufSk7XG4iLCIoZnVuY3Rpb24gKCQpIHtcbiAgLyoqXG4gICAqIFBhdGNoIFRPQyBsaXN0LlxuICAgKlxuICAgKiBXaWxsIG11dGF0ZSB0aGUgdW5kZXJseWluZyBzcGFuIHRvIGhhdmUgYSBjb3JyZWN0IHVsIGZvciBuYXYuXG4gICAqXG4gICAqIEBwYXJhbSAkc3BhbjogU3BhbiBjb250YWluaW5nIG5lc3RlZCBVTCdzIHRvIG11dGF0ZS5cbiAgICogQHBhcmFtIG1pbkxldmVsOiBTdGFydGluZyBsZXZlbCBmb3IgbmVzdGVkIGxpc3RzLiAoMTogZ2xvYmFsLCAyOiBsb2NhbCkuXG4gICAqL1xuICB2YXIgcGF0Y2hUb2MgPSBmdW5jdGlvbiAoJHVsLCBtaW5MZXZlbCkge1xuICAgIHZhciBmaW5kQSxcbiAgICAgIHBhdGNoVGFibGVzLFxuICAgICAgJGxvY2FsTGk7XG5cbiAgICAvLyBGaW5kIGFsbCBhIFwiaW50ZXJuYWxcIiB0YWdzLCB0cmF2ZXJzaW5nIHJlY3Vyc2l2ZWx5LlxuICAgIGZpbmRBID0gZnVuY3Rpb24gKCRlbGVtLCBsZXZlbCkge1xuICAgICAgbGV2ZWwgPSBsZXZlbCB8fCAwO1xuICAgICAgdmFyICRpdGVtcyA9ICRlbGVtLmZpbmQoXCI+IGxpID4gYS5pbnRlcm5hbCwgPiB1bCwgPiBsaSA+IHVsXCIpO1xuXG4gICAgICAvLyBJdGVyYXRlIGV2ZXJ5dGhpbmcgaW4gb3JkZXIuXG4gICAgICAkaXRlbXMuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcbiAgICAgICAgdmFyICRpdGVtID0gJChpdGVtKSxcbiAgICAgICAgICB0YWcgPSBpdGVtLnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAkY2hpbGRyZW5MaSA9ICRpdGVtLmNoaWxkcmVuKCdsaScpLFxuICAgICAgICAgICRwYXJlbnRMaSA9ICQoJGl0ZW0ucGFyZW50KCdsaScpLCAkaXRlbS5wYXJlbnQoKS5wYXJlbnQoJ2xpJykpO1xuXG4gICAgICAgIC8vIEFkZCBkcm9wZG93bnMgaWYgbW9yZSBjaGlsZHJlbiBhbmQgYWJvdmUgbWluaW11bSBsZXZlbC5cbiAgICAgICAgaWYgKHRhZyA9PT0gJ3VsJyAmJiBsZXZlbCA+PSBtaW5MZXZlbCAmJiAkY2hpbGRyZW5MaS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgJHBhcmVudExpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ2Ryb3Bkb3duLXN1Ym1lbnUnKVxuICAgICAgICAgICAgLmNoaWxkcmVuKCdhJykuZmlyc3QoKS5hdHRyKCd0YWJpbmRleCcsIC0xKTtcblxuICAgICAgICAgICRpdGVtLmFkZENsYXNzKCdkcm9wZG93bi1tZW51Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBmaW5kQSgkaXRlbSwgbGV2ZWwgKyAxKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBmaW5kQSgkdWwpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBQYXRjaCBhbGwgdGFibGVzIHRvIHJlbW92ZSBgYGRvY3V0aWxzYGAgY2xhc3MgYW5kIGFkZCBCb290c3RyYXAgYmFzZVxuICAgKiBgYHRhYmxlYGAgY2xhc3MuXG4gICAqL1xuICBwYXRjaFRhYmxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAkKFwidGFibGUuZG9jdXRpbHNcIilcbiAgICAgIC5yZW1vdmVDbGFzcyhcImRvY3V0aWxzXCIpXG4gICAgICAuYWRkQ2xhc3MoXCJ0YWJsZVwiKVxuICAgICAgLmF0dHIoXCJib3JkZXJcIiwgMCk7XG4gIH07XG5cbiQoZnVuY3Rpb24gKCkge1xuXG4gICAgLypcbiAgICAgKiBTY3JvbGwgdGhlIHdpbmRvdyB0byBhdm9pZCB0aGUgdG9wbmF2IGJhclxuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2l0dGVyL2Jvb3RzdHJhcC9pc3N1ZXMvMTc2OFxuICAgICAqL1xuICAgIGlmICgkKFwiI25hdmJhci5uYXZiYXItZml4ZWQtdG9wXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBuYXZIZWlnaHQgPSAkKFwiI25hdmJhclwiKS5oZWlnaHQoKSxcbiAgICAgICAgc2hpZnRXaW5kb3cgPSBmdW5jdGlvbigpIHsgc2Nyb2xsQnkoMCwgLW5hdkhlaWdodCAtIDEwKTsgfTtcblxuICAgICAgaWYgKGxvY2F0aW9uLmhhc2gpIHtcbiAgICAgICAgc2hpZnRXaW5kb3coKTtcbiAgICAgIH1cblxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJoYXNoY2hhbmdlXCIsIHNoaWZ0V2luZG93KTtcbiAgICB9XG5cbiAgICAvLyBBZGQgc3R5bGluZywgc3RydWN0dXJlIHRvIFRPQydzLlxuICAgICQoXCIuZHJvcGRvd24tbWVudVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICQodGhpcykuZmluZChcInVsXCIpLmVhY2goZnVuY3Rpb24gKGluZGV4LCBpdGVtKXtcbiAgICAgICAgdmFyICRpdGVtID0gJChpdGVtKTtcbiAgICAgICAgJGl0ZW0uYWRkQ2xhc3MoJ3Vuc3R5bGVkJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIEdsb2JhbCBUT0MuXG4gICAgaWYgKCQoXCJ1bC5nbG9iYWx0b2MgbGlcIikubGVuZ3RoKSB7XG4gICAgICBwYXRjaFRvYygkKFwidWwuZ2xvYmFsdG9jXCIpLCAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmVtb3ZlIEdsb2JhbCBUT0MuXG4gICAgICAkKFwiLmdsb2JhbHRvYy1jb250YWluZXJcIikucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgLy8gTG9jYWwgVE9DLlxuICAgIHBhdGNoVG9jKCQoXCJ1bC5sb2NhbHRvY1wiKSwgMik7XG5cbiAgICAvLyBNdXRhdGUgc3ViLWxpc3RzIChmb3IgYnMtMi4zLjApLlxuICAgICQoXCIuZHJvcGRvd24tbWVudSB1bFwiKS5ub3QoXCIuZHJvcGRvd24tbWVudVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdWwgPSAkKHRoaXMpLFxuICAgICAgICAkcGFyZW50ID0gJHVsLnBhcmVudCgpLFxuICAgICAgICB0YWcgPSAkcGFyZW50WzBdLnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgJGtpZHMgPSAkdWwuY2hpbGRyZW4oKS5kZXRhY2goKTtcblxuICAgICAgLy8gUmVwbGFjZSBsaXN0IHdpdGggaXRlbXMgaWYgc3VibWVudSBoZWFkZXIuXG4gICAgICBpZiAodGFnID09PSBcInVsXCIpIHtcbiAgICAgICAgJHVsLnJlcGxhY2VXaXRoKCRraWRzKTtcbiAgICAgIH0gZWxzZSBpZiAodGFnID09PSBcImxpXCIpIHtcbiAgICAgICAgLy8gSW5zZXJ0IGludG8gcHJldmlvdXMgbGlzdC5cbiAgICAgICAgJHBhcmVudC5hZnRlcigka2lkcyk7XG4gICAgICAgICR1bC5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEFkZCBkaXZpZGVyIGluIHBhZ2UgVE9DLlxuICAgICRsb2NhbExpID0gJChcInVsLmxvY2FsdG9jIGxpXCIpO1xuICAgIGlmICgkbG9jYWxMaS5sZW5ndGggPiAyKSB7XG4gICAgICAkbG9jYWxMaS5maXJzdCgpLmFmdGVyKCc8bGkgY2xhc3M9XCJkaXZpZGVyXCI+PC9saT4nKTtcbiAgICB9XG5cbiAgICAvLyBFbmFibGUgZHJvcGRvd24uXG4gICAgJCgnLmRyb3Bkb3duLXRvZ2dsZScpLmRyb3Bkb3duKCk7XG5cbiAgICAvLyBQYXRjaCB0YWJsZXMuXG4gICAgcGF0Y2hUYWJsZXMoKTtcblxuICAgIC8vIEFkZCBOb3RlLCBXYXJuaW5nIHN0eWxlcy5cbiAgICAkKCdkaXYubm90ZScpLmFkZENsYXNzKCdhbGVydCcpLmFkZENsYXNzKCdhbGVydC1pbmZvJyk7XG4gICAgJCgnZGl2Lndhcm5pbmcnKS5hZGRDbGFzcygnYWxlcnQnKS5hZGRDbGFzcygnYWxlcnQtd2FybmluZycpO1xuXG4gICAgLy8gSW5saW5lIGNvZGUgc3R5bGVzIHRvIEJvb3RzdHJhcCBzdHlsZS5cbiAgICAkKCd0dC5kb2N1dGlscy5saXRlcmFsJykubm90KFwiLnhyZWZcIikuZWFjaChmdW5jdGlvbiAoaSwgZSkge1xuICAgICAgLy8gaWdub3JlIHJlZmVyZW5jZXNcbiAgICAgIGlmICghJChlKS5wYXJlbnQoKS5oYXNDbGFzcyhcInJlZmVyZW5jZVwiKSkge1xuICAgICAgICAkKGUpLnJlcGxhY2VXaXRoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gJChcIjxjb2RlIC8+XCIpLnRleHQoJCh0aGlzKS50ZXh0KCkpO1xuICAgICAgICB9KTtcbiAgICAgIH19KTtcbiAgfSk7XG59KHdpbmRvdy5qUXVlcnkpKTtcbiIsIi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyB8ZG9jbmFtZXwgLSBBIGZyYW1ld29yayBhbGxvd2luZyBhIFJ1bmVzdG9uZSBjb21wb25lbnQgdG8gbG9hZCBvbmx5IHRoZSBKUyBpdCBuZWVkc1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIFRoZSBKYXZhU2NyaXB0IHJlcXVpcmVkIGJ5IGFsbCBSdW5lc3RvbmUgY29tcG9uZW50cyBpcyBxdWl0ZSBsYXJnZSBhbmQgcmVzdWx0cyBpbiBzbG93IHBhZ2UgbG9hZHMuIFRoaXMgYXBwcm9hY2ggZW5hYmxlcyBhIFJ1bmVzdG9uZSBjb21wb25lbnQgdG8gbG9hZCBvbmx5IHRoZSBKYXZhU2NyaXB0IGl0IG5lZWRzLCByYXRoZXIgdGhhbiBsb2FkaW5nIEphdmFTY3JpcHQgZm9yIGFsbCB0aGUgY29tcG9uZW50cyByZWdhcmRsZXNzIG9mIHdoaWNoIGFyZSBhY3R1YWxseSB1c2VkLlxuLy9cbi8vIFRvIGFjY29tcGxpc2ggdGhpcywgd2VicGFjaydzIHNwbGl0LWNodW5rcyBhYmlsaXR5IGFuYWx5emVzIGFsbCBKUywgc3RhcnRpbmcgZnJvbSB0aGlzIGZpbGUuIFRoZSBkeW5hbWljIGltcG9ydHMgYmVsb3cgYXJlIHRyYW5zZm9ybWVkIGJ5IHdlYnBhY2sgaW50byB0aGUgZHluYW1pYyBmZXRjaGVzIG9mIGp1c3QgdGhlIEpTIHJlcXVpcmVkIGJ5IGVhY2ggZmlsZSBhbmQgYWxsIGl0cyBkZXBlbmRlbmNpZXMuIChJZiB1c2luZyBzdGF0aWMgaW1wb3J0cywgd2VicGFjayB3aWxsIGFzc3VtZSB0aGF0IGFsbCBmaWxlcyBhcmUgYWxyZWFkeSBzdGF0aWNhbGx5IGxvYWRlZCB2aWEgc2NyaXB0IHRhZ3MsIGRlZmVhdGluZyB0aGUgcHVycG9zZSBvZiB0aGlzIGZyYW1ld29yay4pXG4vL1xuLy8gSG93ZXZlciwgdGhpcyBhcHByb2FjaCBsZWFkcyB0byBjb21wbGV4aXR5OlxuLy9cbi8vIC0gICAgVGhlIGBgZGF0YS1jb21wb25lbnRgYCBhdHRyaWJ1dGUgb2YgZWFjaCBjb21wb25lbnQgbXVzdCBiZSBrZXB0IGluIHN5bmMgd2l0aCB0aGUga2V5cyBvZiB0aGUgYGBtb2R1bGVfbWFwYGAgYmVsb3cuXG4vLyAtICAgIFRoZSB2YWx1ZXMgaW4gdGhlIGBgbW9kdWxlX21hcGBgIG11c3QgYmUga2VwdCBpbiBzeW5jIHdpdGggdGhlIEphdmFTY3JpcHQgZmlsZXMgd2hpY2ggaW1wbGVtZW50IGVhY2ggb2YgdGhlIGNvbXBvbmVudHMuXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBTdGF0aWMgaW1wb3J0c1xuLy8gPT09PT09PT09PT09PT1cbi8vIFRoZXNlIGltcG9ydHMgYXJlICh3ZSBhc3N1bWUpIG5lZWRlZCBieSBhbGwgcGFnZXMuIEhvd2V2ZXIsIGl0IHdvdWxkIGJlIG11Y2ggYmV0dGVyIHRvIGxvYWQgdGhlc2UgaW4gdGhlIG1vZHVsZXMgdGhhdCBhY3R1YWxseSB1c2UgdGhlbS5cbi8vXG4vLyBUaGVzZSBhcmUgc3RhdGljIGltcG9ydHM7IGNvZGUgaW4gYGR5bmFtaWNhbGx5IGxvYWRlZCBjb21wb25lbnRzYF8gZGVhbHMgd2l0aCBkeW5hbWljIGltcG9ydHMuXG4vL1xuLy8galF1ZXJ5LXJlbGF0ZWQgaW1wb3J0cy5cbmltcG9ydCBcImpxdWVyeS11aS9qcXVlcnktdWkuanNcIjtcbmltcG9ydCBcImpxdWVyeS11aS90aGVtZXMvYmFzZS9qcXVlcnkudWkuYWxsLmNzc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeS5pZGxlLXRpbWVyLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4uanNcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy9qcXVlcnlfaTE4bi9qcXVlcnkuaTE4bi5lbWl0dGVyLmJpZGkuanNcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy9qcXVlcnlfaTE4bi9qcXVlcnkuaTE4bi5lbWl0dGVyLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4uZmFsbGJhY2tzLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4ubWVzc2FnZXN0b3JlLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4ucGFyc2VyLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4ubGFuZ3VhZ2UuanNcIjtcblxuLy8gQm9vdHN0cmFwXG5pbXBvcnQgXCJib290c3RyYXAvZGlzdC9qcy9ib290c3RyYXAuanNcIjtcbmltcG9ydCBcImJvb3RzdHJhcC9kaXN0L2Nzcy9ib290c3RyYXAuY3NzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vcHJvamVjdF90ZW1wbGF0ZS9fdGVtcGxhdGVzL3BsdWdpbl9sYXlvdXRzL3NwaGlueF9ib290c3RyYXAvc3RhdGljL2Jvb3RzdHJhcC1zcGhpbnguanNcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9jc3MvcnVuZXN0b25lLWN1c3RvbS1zcGhpbngtYm9vdHN0cmFwLmNzc1wiO1xuXG4vLyBNaXNjXG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvYm9va2Z1bmNzLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvdXNlci1oaWdobGlnaHRzLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvcHJldGV4dC5qc1wiO1xuXG4vLyBUaGVzZSBiZWxvbmcgaW4gZHluYW1pYyBpbXBvcnRzIGZvciB0aGUgb2J2aW91cyBjb21wb25lbnQ7IGhvd2V2ZXIsIHRoZXNlIGNvbXBvbmVudHMgZG9uJ3QgaW5jbHVkZSBhIGBgZGF0YS1jb21wb25lbnRgYCBhdHRyaWJ1dGUuXG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9tYXRyaXhlcS9jc3MvbWF0cml4ZXEuY3NzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS93ZWJnbGRlbW8vY3NzL3dlYmdsaW50ZXJhY3RpdmUuY3NzXCI7XG5cbi8vIFRoZXNlIGFyZSBvbmx5IG5lZWRlZCBmb3IgdGhlIFJ1bmVzdG9uZSBib29rLCBidXQgbm90IGluIGEgbGlicmFyeSBtb2RlIChzdWNoIGFzIHByZXRleHQpLiBJIHdvdWxkIHByZWZlciB0byBkeW5hbWljYWxseSBsb2FkIHRoZW0uIEhvd2V2ZXIsIHRoZXNlIHNjcmlwdHMgYXJlIHNvIHNtYWxsIEkgaGF2ZW4ndCBib3RoZXJlZCB0byBkbyBzby5cbmltcG9ydCB7IGdldFN3aXRjaCwgc3dpdGNoVGhlbWUgfSBmcm9tIFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL3RoZW1lLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvcHJlc2VudGVyX21vZGUuanNcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9jc3MvcHJlc2VudGVyX21vZGUuY3NzXCI7XG5cbi8vIER5bmFtaWNhbGx5IGxvYWRlZCBjb21wb25lbnRzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGhpcyBwcm92aWRlcyBhIGxpc3Qgb2YgbW9kdWxlcyB0aGF0IGNvbXBvbmVudHMgY2FuIGR5bmFtaWNhbGx5IGltcG9ydC4gV2VicGFjayB3aWxsIGNyZWF0ZSBhIGxpc3Qgb2YgaW1wb3J0cyBmb3IgZWFjaCBiYXNlZCBvbiBpdHMgYW5hbHlzaXMuXG5jb25zdCBtb2R1bGVfbWFwID0ge1xuICAgIC8vIFdyYXAgZWFjaCBpbXBvcnQgaW4gYSBmdW5jdGlvbiwgc28gdGhhdCBpdCB3b24ndCBvY2N1ciB1bnRpbCB0aGUgZnVuY3Rpb24gaXMgY2FsbGVkLiBXaGlsZSBzb21ldGhpbmcgY2xlYW5lciB3b3VsZCBiZSBuaWNlLCB3ZWJwYWNrIGNhbid0IGFuYWx5emUgdGhpbmdzIGxpa2UgYGBpbXBvcnQoZXhwcmVzc2lvbilgYC5cbiAgICAvL1xuICAgIC8vIFRoZSBrZXlzIG11c3QgbWF0Y2ggdGhlIHZhbHVlIG9mIGVhY2ggY29tcG9uZW50J3MgYGBkYXRhLWNvbXBvbmVudGBgIGF0dHJpYnV0ZSAtLSB0aGUgYGBydW5lc3RvbmVfaW1wb3J0YGAgYW5kIGBgcnVuZXN0b25lX2F1dG9faW1wb3J0YGAgZnVuY3Rpb25zIGFzc3VtZSB0aGlzLlxuICAgIGFjdGl2ZWNvZGU6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2FjdGl2ZWNvZGUvanMvYWNmYWN0b3J5LmpzXCIpLFxuICAgIGJsZTogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvY2VsbGJvdGljcy9qcy9ibGUuanNcIiksXG4gICAgLy8gQWx3YXlzIGltcG9ydCB0aGUgdGltZWQgdmVyc2lvbiBvZiBhIGNvbXBvbmVudCBpZiBhdmFpbGFibGUsIHNpbmNlIHRoZSB0aW1lZCBjb21wb25lbnRzIGFsc28gZGVmaW5lIHRoZSBjb21wb25lbnQncyBmYWN0b3J5IGFuZCBpbmNsdWRlIHRoZSBjb21wb25lbnQgYXMgd2VsbC4gTm90ZSB0aGF0IGBgYWNmYWN0b3J5YGAgaW1wb3J0cyB0aGUgdGltZWQgY29tcG9uZW50cyBvZiBBY3RpdmVDb2RlLCBzbyBpdCBmb2xsb3dzIHRoaXMgcGF0dGVybi5cbiAgICBjbGlja2FibGVhcmVhOiAoKSA9PlxuICAgICAgICBpbXBvcnQoXCIuL3J1bmVzdG9uZS9jbGlja2FibGVBcmVhL2pzL3RpbWVkY2xpY2thYmxlLmpzXCIpLFxuICAgIGNvZGVsZW5zOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9jb2RlbGVucy9qcy9jb2RlbGVucy5qc1wiKSxcbiAgICBkYXRhZmlsZTogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvZGF0YWZpbGUvanMvZGF0YWZpbGUuanNcIiksXG4gICAgZHJhZ25kcm9wOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9kcmFnbmRyb3AvanMvdGltZWRkbmQuanNcIiksXG4gICAgZmlsbGludGhlYmxhbms6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2ZpdGIvanMvdGltZWRmaXRiLmpzXCIpLFxuICAgIGdyb3Vwc3ViOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9ncm91cHN1Yi9qcy9ncm91cHN1Yi5qc1wiKSxcbiAgICBraGFuZXg6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2toYW5leC9qcy9raGFuZXguanNcIiksXG4gICAgbHBfYnVpbGQ6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2xwL2pzL2xwLmpzXCIpLFxuICAgIG11bHRpcGxlY2hvaWNlOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9tY2hvaWNlL2pzL3RpbWVkbWMuanNcIiksXG4gICAgaHBhcnNvbnM6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2hwYXJzb25zL2pzL2hwYXJzb25zLmpzXCIpLFxuICAgIHBhcnNvbnM6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3BhcnNvbnMvanMvdGltZWRwYXJzb25zLmpzXCIpLFxuICAgIHBvbGw6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3BvbGwvanMvcG9sbC5qc1wiKSxcbiAgICBxdWl6bHk6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3F1aXpseS9qcy9xdWl6bHkuanNcIiksXG4gICAgcmV2ZWFsOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9yZXZlYWwvanMvcmV2ZWFsLmpzXCIpLFxuICAgIHNlbGVjdHF1ZXN0aW9uOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9zZWxlY3RxdWVzdGlvbi9qcy9zZWxlY3RvbmUuanNcIiksXG4gICAgc2hvcnRhbnN3ZXI6ICgpID0+XG4gICAgICAgIGltcG9ydChcIi4vcnVuZXN0b25lL3Nob3J0YW5zd2VyL2pzL3RpbWVkX3Nob3J0YW5zd2VyLmpzXCIpLFxuICAgIHNob3dldmFsOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9zaG93ZXZhbC9qcy9zaG93RXZhbC5qc1wiKSxcbiAgICBzaW1wbGVfc2Vuc29yOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9jZWxsYm90aWNzL2pzL3NpbXBsZV9zZW5zb3IuanNcIiksXG4gICAgc3ByZWFkc2hlZXQ6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3NwcmVhZHNoZWV0L2pzL3NwcmVhZHNoZWV0LmpzXCIpLFxuICAgIHRhYmJlZFN0dWZmOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS90YWJiZWRTdHVmZi9qcy90YWJiZWRzdHVmZi5qc1wiKSxcbiAgICB0aW1lZEFzc2Vzc21lbnQ6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3RpbWVkL2pzL3RpbWVkLmpzXCIpLFxuICAgIHdhdmVkcm9tOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS93YXZlZHJvbS9qcy93YXZlZHJvbS5qc1wiKSxcbiAgICAvLyBUT0RPOiBzaW5jZSB0aGlzIGlzbid0IGluIGEgYGBkYXRhLWNvbXBvbmVudGBgLCBuZWVkIHRvIHRyaWdnZXIgYW4gaW1wb3J0IG9mIHRoaXMgY29kZSBtYW51YWxseS5cbiAgICB3ZWJ3b3JrOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS93ZWJ3b3JrL2pzL3dlYndvcmsuanNcIiksXG4gICAgeW91dHViZTogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvdmlkZW8vanMvcnVuZXN0b25ldmlkZW8uanNcIiksXG59O1xuXG4vLyAuLiBfZHluYW1pYyBpbXBvcnQgbWFjaGluZXJ5OlxuLy9cbi8vIER5bmFtaWMgaW1wb3J0IG1hY2hpbmVyeVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBGdWxmaWxsIGEgcHJvbWlzZSB3aGVuIHRoZSBSdW5lc3RvbmUgcHJlLWxvZ2luIGNvbXBsZXRlIGV2ZW50IG9jY3Vycy5cbmxldCBwcmVfbG9naW5fY29tcGxldGVfcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PlxuICAgICQoZG9jdW1lbnQpLm9uKFwicnVuZXN0b25lOnByZS1sb2dpbi1jb21wbGV0ZVwiLCByZXNvbHZlKVxuKTtcbmxldCBsb2FkZWRDb21wb25lbnRzO1xuLy8gUHJvdmlkZSBhIHNpbXBsZSBmdW5jdGlvbiB0byBpbXBvcnQgdGhlIEpTIGZvciBhbGwgY29tcG9uZW50cyBvbiB0aGUgcGFnZS5cbmV4cG9ydCBmdW5jdGlvbiBydW5lc3RvbmVfYXV0b19pbXBvcnQoKSB7XG4gICAgLy8gQ3JlYXRlIGEgc2V0IG9mIGBgZGF0YS1jb21wb25lbnRgYCB2YWx1ZXMsIHRvIGF2b2lkIGR1cGxpY2F0aW9uLlxuICAgIGNvbnN0IHMgPSBuZXcgU2V0KFxuICAgICAgICAvLyBBbGwgUnVuZXN0b25lIGNvbXBvbmVudHMgaGF2ZSBhIGBgZGF0YS1jb21wb25lbnRgYCBhdHRyaWJ1dGUuXG4gICAgICAgICQoXCJbZGF0YS1jb21wb25lbnRdXCIpXG4gICAgICAgICAgICAubWFwKFxuICAgICAgICAgICAgICAgIC8vIEV4dHJhY3QgdGhlIHZhbHVlIG9mIHRoZSBkYXRhLWNvbXBvbmVudCBhdHRyaWJ1dGUuXG4gICAgICAgICAgICAgICAgKGluZGV4LCBlbGVtZW50KSA9PiAkKGVsZW1lbnQpLmF0dHIoXCJkYXRhLWNvbXBvbmVudFwiKVxuICAgICAgICAgICAgICAgIC8vIFN3aXRjaCBmcm9tIGEgalF1ZXJ5IG9iamVjdCBiYWNrIHRvIGFuIGFycmF5LCBwYXNzaW5nIHRoYXQgdG8gdGhlIFNldCBjb25zdHJ1Y3Rvci5cbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5nZXQoKVxuICAgICk7XG4gICAgLy8gd2Vid29yayBxdWVzdGlvbnMgYXJlIG5vdCB3cmFwcGVkIGluIGRpdiB3aXRoIGEgZGF0YS1jb21wb25lbnQgc28gd2UgaGF2ZSB0byBjaGVjayBhIGRpZmZlcmVudCB3YXlcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53ZWJ3b3JrLWJ1dHRvblwiKSkge1xuICAgICAgICBzLmFkZChcIndlYndvcmtcIik7XG4gICAgfVxuXG4gICAgLy8gTG9hZCBKUyBmb3IgZWFjaCBvZiB0aGUgY29tcG9uZW50cyBmb3VuZC5cbiAgICBjb25zdCBhID0gWy4uLnNdLm1hcCgodmFsdWUpID0+XG4gICAgICAgIC8vIElmIHRoZXJlJ3Mgbm8gSlMgZm9yIHRoaXMgY29tcG9uZW50LCByZXR1cm4gYW4gZW1wdHkgUHJvbWlzZS5cbiAgICAgICAgKG1vZHVsZV9tYXBbdmFsdWVdIHx8ICgoKSA9PiBQcm9taXNlLnJlc29sdmUoKSkpKClcbiAgICApO1xuXG4gICAgLy8gU2VuZCB0aGUgUnVuZXN0b25lIGxvZ2luIGNvbXBsZXRlIGV2ZW50IHdoZW4gYWxsIEpTIGlzIGxvYWRlZCBhbmQgdGhlIHByZS1sb2dpbiBpcyBhbHNvIGNvbXBsZXRlLlxuICAgIFByb21pc2UuYWxsKFtwcmVfbG9naW5fY29tcGxldGVfcHJvbWlzZSwgLi4uYV0pLnRoZW4oKCkgPT5cbiAgICAgICAgJChkb2N1bWVudCkudHJpZ2dlcihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiKVxuICAgICk7XG59XG5cbi8vIExvYWQgY29tcG9uZW50IEpTIHdoZW4gdGhlIGRvY3VtZW50IGlzIHJlYWR5LlxuJChkb2N1bWVudCkucmVhZHkocnVuZXN0b25lX2F1dG9faW1wb3J0KTtcblxuLy8gUHJvdmlkZSBhIGZ1bmN0aW9uIHRvIGltcG9ydCBvbmUgc3BlY2lmaWMgUnVuZXN0b25lIGNvbXBvbmVudC5cbi8vIHRoZSBpbXBvcnQgZnVuY3Rpb24gaW5zaWRlIG1vZHVsZV9tYXAgaXMgYXN5bmMgLS0gcnVuZXN0b25lX2ltcG9ydFxuLy8gc2hvdWxkIGJlIGF3YWl0ZWQgd2hlbiBuZWNlc3NhcnkgdG8gZW5zdXJlIHRoZSBpbXBvcnQgY29tcGxldGVzXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcnVuZXN0b25lX2ltcG9ydChjb21wb25lbnRfbmFtZSkge1xuICAgIHJldHVybiBtb2R1bGVfbWFwW2NvbXBvbmVudF9uYW1lXSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBwb3B1cFNjcmF0Y2hBQygpIHtcbiAgICAvLyBsb2FkIHRoZSBhY3RpdmVjb2RlIGJ1bmRsZVxuICAgIGF3YWl0IHJ1bmVzdG9uZV9pbXBvcnQoXCJhY3RpdmVjb2RlXCIpO1xuICAgIC8vIHNjcmF0Y2hEaXYgd2lsbCBiZSBkZWZpbmVkIGlmIHdlIGhhdmUgYWxyZWFkeSBjcmVhdGVkIGEgc2NyYXRjaFxuICAgIC8vIGFjdGl2ZWNvZGUuICBJZiBpdHMgbm90IGRlZmluZWQgdGhlbiB3ZSBuZWVkIHRvIGdldCBpdCByZWFkeSB0byB0b2dnbGVcbiAgICBpZiAoIWVCb29rQ29uZmlnLnNjcmF0Y2hEaXYpIHtcbiAgICAgICAgd2luZG93LkFDRmFjdG9yeS5jcmVhdGVTY3JhdGNoQWN0aXZlY29kZSgpO1xuICAgICAgICBsZXQgZGl2aWQgPSBlQm9va0NvbmZpZy5zY3JhdGNoRGl2O1xuICAgICAgICB3aW5kb3cuZWRMaXN0W2RpdmlkXSA9IEFDRmFjdG9yeS5jcmVhdGVBY3RpdmVDb2RlKFxuICAgICAgICAgICAgJChgIyR7ZGl2aWR9YClbMF0sXG4gICAgICAgICAgICBlQm9va0NvbmZpZy5hY0RlZmF1bHRMYW5ndWFnZVxuICAgICAgICApO1xuICAgICAgICBpZiAoZUJvb2tDb25maWcuaXNMb2dnZWRJbikge1xuICAgICAgICAgICAgd2luZG93LmVkTGlzdFtkaXZpZF0uZW5hYmxlU2F2ZUxvYWQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB3aW5kb3cuQUNGYWN0b3J5LnRvZ2dsZVNjcmF0Y2hBY3RpdmVjb2RlKCk7XG59XG5cbi8vIFNldCB0aGUgZGlyZWN0b3J5IGNvbnRhaW5pbmcgdGhpcyBzY3JpcHQgYXMgdGhlIGBwYXRoIDxodHRwczovL3dlYnBhY2suanMub3JnL2d1aWRlcy9wdWJsaWMtcGF0aC8jb24tdGhlLWZseT5gXyBmb3IgYWxsIHdlYnBhY2tlZCBzY3JpcHRzLlxuY29uc3Qgc2NyaXB0X3NyYyA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuX193ZWJwYWNrX3B1YmxpY19wYXRoX18gPSBzY3JpcHRfc3JjLnN1YnN0cmluZyhcbiAgICAwLFxuICAgIHNjcmlwdF9zcmMubGFzdEluZGV4T2YoXCIvXCIpICsgMVxuKTtcblxuLy8gTWFudWFsIGV4cG9ydHNcbi8vID09PT09PT09PT09PT09XG4vLyBXZWJwYWNrJ3MgYGBvdXRwdXQubGlicmFyeWBgIHNldHRpbmcgZG9lc24ndCBzZWVtIHRvIHdvcmsgd2l0aCB0aGUgc3BsaXQgY2h1bmtzIHBsdWdpbjsgZG8gYWxsIGV4cG9ydHMgbWFudWFsbHkgdGhyb3VnaCB0aGUgYGB3aW5kb3dgYCBvYmplY3QgaW5zdGVhZC5cbmNvbnN0IHJjID0ge307XG5yYy5ydW5lc3RvbmVfaW1wb3J0ID0gcnVuZXN0b25lX2ltcG9ydDtcbnJjLnJ1bmVzdG9uZV9hdXRvX2ltcG9ydCA9IHJ1bmVzdG9uZV9hdXRvX2ltcG9ydDtcbnJjLmdldFN3aXRjaCA9IGdldFN3aXRjaDtcbnJjLnN3aXRjaFRoZW1lID0gc3dpdGNoVGhlbWU7XG5yYy5wb3B1cFNjcmF0Y2hBQyA9IHBvcHVwU2NyYXRjaEFDO1xud2luZG93LnJ1bmVzdG9uZUNvbXBvbmVudHMgPSByYztcbiIsIm1vZHVsZS5leHBvcnRzID0galF1ZXJ5OyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==