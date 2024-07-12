(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone"],{

/***/ 17230:
/*!******************************!*\
  !*** ./ptxrs-bootstrap.less ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 88288:
/*!*************************************************!*\
  !*** ./runestone/common/css/presenter_mode.css ***!
  \*************************************************/
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
/* harmony export */   pageProgressTracker: () => (/* binding */ pageProgressTracker)
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
        // Hide the progress bar on the index page.
        if (
            window.location.pathname.match(
                /.*\/(index.html|toctree.html|Exercises.html|search.html)$/i
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
    console.log("triggering runestone:pre-login-complete");
    document.dispatchEvent(new Event("runestone:pre-login-complete"));
}

function placeAdCopy() {
    if (typeof showAd !== "undefined" && showAd) {
        let adNum = Math.floor(Math.random() * 2) + 1;
        let adBlock = document.getElementById(`adcopy_${adNum}`);
        let rsElements = document.querySelectorAll(".runestone");
        if (rsElements.length > 0) {
            let randomIndex = Math.floor(Math.random() * rsElements.length);
            rsElements[randomIndex].after(adBlock);
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
            if (
                link.href.includes("books/published") &&
                !link.href.includes("?mode=browsing")
            ) {
                if (link.href.includes("#")) {
                    let aPoint = link.href.indexOf("#");
                    anchorText = link.href.substring(aPoint);
                    link.href = link.href.substring(0, aPoint);
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
        $("section *")
            .not(
                "h1, .presentation-title, .btn-presenter, .runestone, .runestone *, section, .pre, code"
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
        $("section *")
            .not(
                "h1, .presentation-title, .btn-presenter, .runestone, .runestone *, section, .pre, code"
            )
            .addClass("hidden"); // hide extraneous stuff
        $("#completionButton").addClass("hidden");
        bod.addClass(presentClass);
        bod.addClass(fullHeightClass);
        $("html").addClass(fullHeightClass);
        $("section .runestone").addClass(fullHeightClass);
        $(".ac-caption").addClass(bottomClass);
        localStorage.setItem("presentMode", presentClass);
        // presenter_mode.css is loaded by webpack
        //loadPresenterCss(); // present_mode.css should only apply when in presenter mode.
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
    dataComponent.parent().closest("div").not("section").addClass("runestone");
    dataComponent.parent().closest("div").css("max-width", "none");

    dataComponent.each(function (index) {
        let me = $(this);
        $(this)
            .find(".ac_code_div, .ac_output")
            .wrapAll("<div class='ac-block' style='width: 100%;'></div>");
    });

    codelensListener(500);
    $("section img").wrap('<div class="runestone">');
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

window.nextExercise = function() {
    let active = getActiveExercise();
    let nextIndex = codeExercises.index(active) + 1;
    if (nextIndex < codeExercises.length) {
        activateExercise(nextIndex);
    }
}

window.prevExercise = function() {
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
    let acCode = $(".ac_code_div");
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
    $("[data-knowl]").on("click", function () {
        let div_id = $(this).data("knowl");
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
        wrap.style.overflow = "visible";
    }
});


/***/ }),

/***/ 72773:
/*!************************************************!*\
  !*** ./runestone/common/js/renderComponent.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTimedComponent: () => (/* binding */ createTimedComponent),
/* harmony export */   renderOneComponent: () => (/* binding */ renderOneComponent),
/* harmony export */   renderRunestoneComponent: () => (/* binding */ renderRunestoneComponent)
/* harmony export */ });
/* harmony import */ var _webpack_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../webpack.index.js */ 36350);


async function renderRunestoneComponent(
    componentSrc,
    whereDiv,
    moreOpts
) {
    /**
     *  The easy part is adding the componentSrc to the existing div.
     *  The tedious part is calling the right functions to turn the
     *  source into the actual component.
     */
    if (!componentSrc) {
        jQuery(`#${whereDiv}`).html(
            `<p>Sorry, no source is available for preview.</p>`
        );
        return;
    }
    let patt = /..\/_images/g;
    componentSrc = componentSrc.replace(
        patt,
        `${eBookConfig.app}/books/published/${eBookConfig.basecourse}/_images`
    );
    jQuery(`#${whereDiv}`).html(componentSrc);

    if (typeof window.componentMap === "undefined") {
        window.componentMap = {};
    }

    let componentKind = $($(`#${whereDiv} [data-component]`)[0]).data(
        "component"
    );
    // Import the JavaScript for this component before proceeding.
    await (0,_webpack_index_js__WEBPACK_IMPORTED_MODULE_0__.runestone_import)(componentKind);
    let opt = {};
    opt.orig = jQuery(`#${whereDiv} [data-component]`)[0];
    if (opt.orig) {
        opt.lang = $(opt.orig).data("lang");
        opt.useRunestoneServices = true;
        opt.graderactive = false;
        opt.python3 = true;
        if (typeof moreOpts !== "undefined") {
            for (let key in moreOpts) {
                opt[key] = moreOpts[key];
            }
        }
    }

    if (typeof component_factory === "undefined") {
        alert("Error:  Missing the component factory!");
    } else {
        if (
            !window.component_factory[componentKind] &&
            !jQuery(`#${whereDiv}`).html()
        ) {
            jQuery(`#${whereDiv}`).html(
                `<p>Preview not available for ${componentKind}</p>`
            );
        } else {
            let res = window.component_factory[componentKind](opt);
            if (componentKind === "activecode") {
                if (moreOpts.multiGrader) {
                    window.componentMap[
                        `${moreOpts.gradingContainer} ${res.divid}`
                    ] = res;
                } else {
                    window.componentMap[res.divid] = res;
                }
            }
        }
    }
}

function createTimedComponent(componentSrc, moreOpts) {
    /* The important distinction is that the component does not really need to be rendered
    into the page, in fact, due to the async nature of getting the source the list of questions
    is made and the original html is replaced by the look of the exam.
    */

    let patt = /..\/_images/g;
    componentSrc = componentSrc.replace(
        patt,
        `${eBookConfig.app}/books/published/${eBookConfig.basecourse}/_images`
    );

    let componentKind = $($(componentSrc).find("[data-component]")[0]).data(
        "component"
    );

    let origId = $(componentSrc).find("[data-component]").first().attr("id");

    // Double check -- if the component source is not in the DOM, then briefly add it
    // and call the constructor.
    let hdiv;
    if (!document.getElementById(origId)) {
        hdiv = $("<div/>", {
            css: { display: "none" },
        }).appendTo("body");
        hdiv.html(componentSrc);
    }
    // at this point hdiv is a jquery object

    let ret;
    let opts = {
        orig: document.getElementById(origId),
        timed: true,
    };
    if (typeof moreOpts !== "undefined") {
        for (let key in moreOpts) {
            opts[key] = moreOpts[key];
        }
    }

    if (componentKind in window.component_factory) {
        ret = window.component_factory[componentKind](opts);
    }

    let rdict = {};
    rdict.question = ret;
    return rdict;
}

// For integration with the React overhault of Pretext
// 1. Disable the automatic instantiation at the end of each component.js
// 2. react will search for all ".runestone" and will call this function for each of them.
async function renderOneComponent(rsDiv) {
    // Find the actual component inside the runestone component.
    let component = rsDiv.querySelector("[data-component]");
    if (component == null) {
        console.log("Render was called for a component, but now [data-component] attribute is present. This may mean the component has already been rendered.")
        return;
    }
    let componentKind = component.dataset.component;
    await (0,_webpack_index_js__WEBPACK_IMPORTED_MODULE_0__.runestone_import)(componentKind);
    if ($(this).closest("[data-component=timedAssessment]").length == 0) {
        // If this element exists within a timed component, don't render it here
        try {
            let divid = component.id;
            window.componentMap[divid] = window.component_factory[
                componentKind
            ]({
                orig: component,
                useRunestoneServices: eBookConfig.useRunestoneServices,
            });
        } catch (err) {
            console.log(`Error rendering ${componentKind} Problem ${this.id}
                         Details: ${err}`);
        }
    }
}


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
        this.mjReady = new Promise(function (resolve, reject) {
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
        if (typeof this.percent === "number") {
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
            `${eBookConfig.new_server_prefix}/logger/bookevent`,
            {
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
                    console.log(JSON.stringify(post_return.detail, null, 4));
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
            if (eBookConfig.useRunestoneServices) {
                alert(`Error: Your action was not saved!
                    The error was ${e}
                    Status Code: ${response.status}
                    Detail: ${JSON.stringify(detail, null, 4)}.
                    Please report this error!`);
            }
            // send a request to save this error
            console.log(
                `Error: ${e} Detail: ${detail} Status Code: ${response.status}`
            );
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
        if (typeof eventInfo.errinfo !== "undefined") {
            eventInfo.errinfo = eventInfo.errinfo.toString();
        }
        if (
            eBookConfig.isLoggedIn &&
            eBookConfig.useRunestoneServices &&
            eBookConfig.logLevel > 0
        ) {
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
                if (eBookConfig.useRunestoneServices) {
                    alert(`Failed to save your code
                        Status is ${response.status}
                        Detail: ${JSON.stringify(
                            post_promise.detail,
                            null,
                            4
                        )}`);
                } else {
                    console.log(
                        `Did not save the code.
                         Status: ${response.status}
                         Detail: ${JSON.stringify(
                             post_promise.detail,
                             null,
                             4
                         )}`
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
                        this.attempted = true;
                        if (typeof data.correct !== "undefined") {
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
                    console.log(`Error getting results: ${err}`);
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
            data.correct === true ||
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
                // Display caption based on whether Runestone services have been detected
                this.caption = eBookConfig.useRunestoneServices
                    ? `Activity: ${this.question_label} ${this.caption}  <span class="runestone_caption_divid">(${this.divid})</span>`
                    : `Activity: ${this.question_label} ${this.caption}`; // Without runestone
                $(capDiv).html(this.caption);
                $(capDiv).addClass(`${elType}_caption`);
            } else {
                // Display caption based on whether Runestone services have been detected
                $(capDiv).html(
                    eBookConfig.useRunestoneServices
                        ? this.caption + " (" + this.divid + ")"
                        : this.caption
                ); // Without runestone
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
        if (typeof MathJax === "undefined") {
            console.log("Error -- MathJax is not loaded");
            return Promise.resolve(null);
        } else {
            // See - https://docs.mathjax.org/en/latest/advanced/typeset.html
            // Per the above we should keep track of the promises and only call this
            // a second time if all previous promises have resolved.
            // Create a queue of components
            // should wait until defaultPageReady is defined
            // If defaultPageReady is not defined then just enqueue the components.
            // Once defaultPageReady is defined
            // the window.runestoneMathReady promise will be fulfilled when the
            // initial typesetting is complete.
            if (MathJax.typesetPromise) {
                if (typeof window.runestoneMathReady !== "undefined") {
                    return window.runestoneMathReady.then(() =>
                        this.mjresolver(this.aQueue.enqueue(component))
                    );
                } else {
                    return this.mjresolver(this.aQueue.enqueue(component));
                }
            } else {
                console.log(`Waiting on MathJax!! ${MathJax.typesetPromise}`);
                setTimeout(() => this.queueMathJax(component), 200);
                console.log(`Returning mjready promise: ${this.mjReady}`);
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
    constructor() {
        this._items = [];
    }
    enqueue(item) {
        this._items.push(item);
    }
    dequeue() {
        return this._items.shift();
    }
    get size() {
        return this._items.length;
    }
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

            let payload = await window.runestoneMathReady
                .then(async function () {
                    console.log(
                        `MathJax Ready -- dequeing a typesetting run for ${item.component.id}`
                    );
                    return await MathJax.typesetPromise([item.component]);
                });

            this._pendingPromise = false;
            item.resolve(payload);
        } catch (e) {
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
/* harmony export */   getSwitch: () => (/* binding */ getSwitch),
/* harmony export */   switchTheme: () => (/* binding */ switchTheme)
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
        isPtxBook: isPreTeXt(),
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
                let scp = document.querySelector("#scprogresscontainer");
                if (scp) {
                    scp.classList.add("ptx-runestone-container");
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
    processPageState(completionFlag, true, false, false);
    $("#completionButton").on("click", function () {
        var markingComplete = false;
        var markingIncomplete = false;
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
            markingComplete = true;
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
            markingIncomplete = true;
        }
        processPageState(
            completionFlag,
            false,
            markingComplete,
            markingIncomplete
        );
    });

    // we cannot afford to do this at both load and unload especially as users
    // go from page to page. This just doubles the load.  So, try without this one.
    // $(window).on("beforeunload", function (e) {
    //     if (completionFlag == 0) {
    //         processPageState(completionFlag, false, false, false);
    //     }
    // });
}

// _ decorateTableOfContents
// -------------------------
function decorateTableOfContents() {
    if (
        window.location.href.toLowerCase().indexOf("toc.html") != -1 ||
        window.location.href.toLowerCase().indexOf("index.html") != -1 ||
        window.location.href.toLowerCase().indexOf("frontmatter") != -1
    ) {
        if (!isPreTeXt()) {
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
                                        item.chapterName +
                                            "/" +
                                            item.subChapterName
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
                                                        .next(
                                                            ".infoTextCompleted"
                                                        )
                                                        .show();
                                                },
                                                function () {
                                                    $(this)
                                                        .next(
                                                            ".infoTextCompleted"
                                                        )
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
        }
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
function processPageState(
    completionFlag,
    pageLoad,
    markingComplete,
    markingIncomplete
) {
    /*Log last page visited*/
    var currentPathname = window.location.pathname;
    if (currentPathname.indexOf("?") !== -1) {
        currentPathname = currentPathname.substring(
            0,
            currentPathname.lastIndexOf("?")
        );
    }
    // Is this a ptx book?
    let isPtxBook = isPreTeXt();
    var data = {
        lastPageUrl: currentPathname,
        lastPageScrollLocation: Math.round($(window).scrollTop()),
        completionFlag: completionFlag,
        pageLoad: pageLoad,
        markingComplete: markingComplete,
        markingIncomplete: markingIncomplete,
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
/* harmony export */   runestone_auto_import: () => (/* binding */ runestone_auto_import),
/* harmony export */   runestone_import: () => (/* binding */ runestone_import)
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
/* harmony import */ var _ptxrs_bootstrap_less__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./ptxrs-bootstrap.less */ 17230);
/* harmony import */ var _runestone_common_project_template_templates_plugin_layouts_sphinx_bootstrap_static_bootstrap_sphinx_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./runestone/common/project_template/_templates/plugin_layouts/sphinx_bootstrap/static/bootstrap-sphinx.js */ 11968);
/* harmony import */ var _runestone_common_project_template_templates_plugin_layouts_sphinx_bootstrap_static_bootstrap_sphinx_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_project_template_templates_plugin_layouts_sphinx_bootstrap_static_bootstrap_sphinx_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _runestone_common_js_bookfuncs_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./runestone/common/js/bookfuncs.js */ 21294);
/* harmony import */ var _runestone_common_js_user_highlights_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./runestone/common/js/user-highlights.js */ 70114);
/* harmony import */ var _runestone_common_js_pretext_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./runestone/common/js/pretext.js */ 22538);
/* harmony import */ var _runestone_matrixeq_css_matrixeq_css__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./runestone/matrixeq/css/matrixeq.css */ 23746);
/* harmony import */ var _runestone_webgldemo_css_webglinteractive_css__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./runestone/webgldemo/css/webglinteractive.css */ 86324);
/* harmony import */ var _runestone_common_js_theme_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./runestone/common/js/theme.js */ 75106);
/* harmony import */ var _runestone_common_js_presenter_mode_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./runestone/common/js/presenter_mode.js */ 66563);
/* harmony import */ var _runestone_common_js_presenter_mode_js__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_presenter_mode_js__WEBPACK_IMPORTED_MODULE_19__);
/* harmony import */ var _runestone_common_css_presenter_mode_css__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./runestone/common/css/presenter_mode.css */ 88288);
/* harmony import */ var _runestone_common_js_renderComponent_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./runestone/common/js/renderComponent.js */ 72773);
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











// Bootstrap -- comment out for React instructor UI

// comment out for overhaul
//import "bootstrap/dist/css/bootstrap.css";



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
    activecode: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_handsontable_es_index_js-node_modules_handsontable_dist_handsontable_ful-dcc440"), __webpack_require__.e("vendors-node_modules_codemirror_mode_clike_clike_js-node_modules_codemirror_mode_javascript_j-f062af"), __webpack_require__.e("vendors-node_modules_byte-base64_lib_js-node_modules_codemirror_addon_edit_matchbrackets_js-n-017008"), __webpack_require__.e("runestone_codelens_js_pytutor-embed_bundle_js"), __webpack_require__.e("node_modules_moment_locale_sync_recursive_-runestone_activecode_js_acfactory_js-node_modules_-ef73b3")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/activecode/js/acfactory.js */ 86902)),
    ble: () => __webpack_require__.e(/*! import() */ "runestone_cellbotics_js_ble_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/cellbotics/js/ble.js */ 14818)),
    // Always import the timed version of a component if available, since the timed components also define the component's factory and include the component as well. Note that ``acfactory`` imports the timed components of ActiveCode, so it follows this pattern.
    clickablearea: () =>
        Promise.all(/*! import() */[__webpack_require__.e("runestone_clickableArea_js_timedclickable_js"), __webpack_require__.e("runestone_clickableArea_css_clickable_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/clickableArea/js/timedclickable.js */ 61581)),
    codelens: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_codelens_js_pytutor-embed_bundle_js"), __webpack_require__.e("runestone_codelens_js_codelens_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/codelens/js/codelens.js */ 12882)),
    datafile: () => __webpack_require__.e(/*! import() */ "runestone_datafile_js_datafile_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/datafile/js/datafile.js */ 55789)),
    dragndrop: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_dragndrop_js_timeddnd_js"), __webpack_require__.e("runestone_dragndrop_css_dragndrop_less")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/dragndrop/js/timeddnd.js */ 47496)),
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
    timedAssessment: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_handsontable_es_index_js-node_modules_handsontable_dist_handsontable_ful-dcc440"), __webpack_require__.e("vendors-node_modules_codemirror_mode_clike_clike_js-node_modules_codemirror_mode_javascript_j-f062af"), __webpack_require__.e("vendors-node_modules_byte-base64_lib_js-node_modules_codemirror_addon_edit_matchbrackets_js-n-017008"), __webpack_require__.e("runestone_codelens_js_pytutor-embed_bundle_js"), __webpack_require__.e("node_modules_moment_locale_sync_recursive_-runestone_activecode_js_acfactory_js-node_modules_-ef73b3"), __webpack_require__.e("runestone_parsons_js_timedparsons_js"), __webpack_require__.e("runestone_fitb_js_timedfitb_js"), __webpack_require__.e("runestone_dragndrop_js_timeddnd_js"), __webpack_require__.e("runestone_mchoice_js_timedmc_js"), __webpack_require__.e("runestone_selectquestion_js_selectone_js"), __webpack_require__.e("runestone_clickableArea_js_timedclickable_js"), __webpack_require__.e("runestone_shortanswer_js_timed_shortanswer_js"), __webpack_require__.e("runestone_timed_js_timed_js-runestone_dragndrop_css_dragndrop_less-runestone_clickableArea_cs-e2a9c9")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/timed/js/timed.js */ 58707)),
    wavedrom: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_wavedrom_skins_default_js-node_modules_wavedrom_wavedrom_min_js"), __webpack_require__.e("runestone_wavedrom_js_wavedrom_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/wavedrom/js/wavedrom.js */ 32405)),
    // TODO: since this isn't in a ``data-component``, need to trigger an import of this code manually.
    webwork: () => __webpack_require__.e(/*! import() */ "runestone_webwork_js_webwork_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/webwork/js/webwork.js */ 66142)),
    youtube: () => __webpack_require__.e(/*! import() */ "runestone_video_js_runestonevideo_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/video/js/runestonevideo.js */ 48657)),
};

const module_map_cache = {};
const QUEUE_FLUSH_TIME_MS = 10;
const queue = [];
let queueLastFlush = 0;
/**
 * Queue imports that are requested within `QUEUE_FLUSH_TIME_MS` of each other.
 * All such imports are imported at once, and then a promise is fired after all
 * the imports in the queue window have completed.
 */
function queueImport(component_name) {
    let resolve = null;
    let reject = null;
    const retPromise = new Promise((r, rej) => {
        resolve = r;
        reject = rej;
    });
    const item = { component_name, resolve, reject };
    queue.push(item);
    window.setTimeout(flushQueue, QUEUE_FLUSH_TIME_MS + 1);

    return retPromise;
}
async function flushQueue() {
    if (queue.length === 0) {
        return;
    }
    if (Date.now() - queueLastFlush < QUEUE_FLUSH_TIME_MS) {
        window.setTimeout(flushQueue, QUEUE_FLUSH_TIME_MS + 1);
        return;
    }
    // If we made it here, it has been at least QUEUE_FLUSH_TIME_MS since
    // the last time we flushed the queue. Therefore, we should start flushing.
    // We copy everything we flush and empty the array first.
    queueLastFlush = Date.now();
    const toFlush = [...queue];
    queue.length = 0;
    console.log(
        "Webpack is starting the loading process for the following Runestone modules",
        toFlush.map((item) => item.component_name)
    );
    const flushedPromise = toFlush.map(async (item) => {
        try {
            await module_map[item.component_name]();
            return item;
        } catch (e) {
            item.reject(e);
        }
    });
    const flushed = await Promise.all(flushedPromise);
    flushed.forEach((item) => item.resolve());
}

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
    Promise.all([pre_login_complete_promise, ...a]).then(function () {
        if (!document.body.dataset.reactInUse) {
            $(document).trigger("runestone:login-complete");
        }
    });
}

pre_login_complete_promise.then(() => {
    console.log("Runestone pre-login complete");
});

// Load component JS when the document is ready.
$(document).ready(runestone_auto_import);

// Provide a function to import one specific `Runestone` component.
// the import function inside module_map is async -- runestone_import
// should be awaited when necessary to ensure the import completes
async function runestone_import(component_name) {
    if (module_map_cache[component_name]) {
        return module_map_cache[component_name];
    }
    const promise = queueImport(component_name);
    module_map_cache[component_name] = promise;
    return promise;
}

async function popupScratchAC() {
    // load the activecode bundle
    await runestone_import("activecode");
    // scratchDiv will be defined if we have already created a scratch
    // activecode.  If its not defined then we need to get it ready to toggle
    if (!eBookConfig.scratchDiv) {
        window.ACFactory.createScratchActivecode();
        let divid = eBookConfig.scratchDiv;
        window.componentMap[divid] = ACFactory.createActiveCode(
            $(`#${divid}`)[0],
            eBookConfig.acDefaultLanguage
        );
        if (eBookConfig.isLoggedIn) {
            window.componentMap[divid].enableSaveLoad();
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

// SPLICE Events
window.addEventListener("message", (event) => {
    if (event.data.subject == "SPLICE.reportScoreAndState") {
        console.log(event.data.score);
        console.log(event.data.state);
    } else if (event.data.subject == "SPLICE.sendEvent") {
        console.log(event.data.location);
        console.log(event.data.name);
        console.log(event.data.data);
    }
});

// Manual exports
// ==============
// Webpack's ``output.library`` setting doesn't seem to work with the split chunks plugin; do all exports manually through the ``window`` object instead.

const rc = {};
rc.runestone_import = runestone_import;
rc.runestone_auto_import = runestone_auto_import;
rc.getSwitch = _runestone_common_js_theme_js__WEBPACK_IMPORTED_MODULE_18__.getSwitch;
rc.switchTheme = _runestone_common_js_theme_js__WEBPACK_IMPORTED_MODULE_18__.switchTheme;
rc.popupScratchAC = popupScratchAC;
rc.renderOneComponent = _runestone_common_js_renderComponent_js__WEBPACK_IMPORTED_MODULE_21__.renderOneComponent;
window.componentMap = {};
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
/******/ __webpack_require__.O(0, ["vendors-node_modules_bootstrap_dist_js_bootstrap_js-node_modules_jquery-ui_jquery-ui_js-node_-d3d74f"], () => (__webpack_exec__(36350)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZS5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyREFBMkQsY0FBYyxLQUFLLGFBQWE7QUFDM0YsYUFBYTtBQUNiLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLEtBQUssY0FBYztBQUNyQyxhQUFhO0FBQ2IsVUFBVTtBQUNWO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBZ0M7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDO0FBQy9DO0FBQ0EsU0FBUztBQUNULHFCQUFxQjtBQUNyQjtBQUNBLGVBQWUsOEJBQThCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxvQkFBb0I7QUFDN0U7QUFDQTtBQUNBLFVBQVU7QUFDVixvREFBb0QsRUFBRTtBQUN0RDtBQUNBO0FBQ0EsdUNBQXVDLHNCQUFzQjtBQUM3RDtBQUNBLDRCQUE0QixxQkFBcUI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrSEFBa0g7QUFDbEg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELE1BQU07QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsNENBQTRDO0FBQ2hFO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLENBQUM7Ozs7Ozs7Ozs7O0FDNVVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGdDQUFnQztBQUNoQzs7O0FBR0E7QUFDQTtBQUNBLEVBQUU7OztBQUdGO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBZ0M7O0FBRWhDO0FBQ0EsZ0NBQWdDOztBQUVoQzs7OztBQUlBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRCQUE0Qjs7QUFFNUI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDhFQUE4RTtBQUM5RTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7OztBQUdGOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7QUN6TEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxRQUFRO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLDZCQUE2Qjs7QUFFN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsY0FBYyxRQUFRO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxtQkFBbUI7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLGVBQWU7QUFDNUIsYUFBYSxRQUFRO0FBQ3JCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixtQ0FBbUM7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLE9BQU87QUFDcEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxRQUFRO0FBQ3BCLFlBQVksUUFBUSxtREFBbUQsSUFBSTtBQUMzRSxhQUFhLGVBQWU7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7QUN2U0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FB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QTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0MscURBQXFEO0FBQ3JELHVEQUF1RDs7QUFFdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3Qzs7QUFFeEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0EsV0FBVyxtQkFBbUI7QUFDOUI7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx1Q0FBdUM7QUFDdkMsd0NBQXdDOztBQUV4QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsQ0FBQzs7Ozs7Ozs7OztBQ3JURDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUMsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0RBQStEO0FBQy9ELEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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Q3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLG1CQUFtQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7Ozs7Ozs7Ozs7QUNsWEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQzs7QUFFbkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULFFBQVE7QUFDUixHQUFHO0FBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbklEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNnQztBQUNpQjtBQUNHO0FBQ007QUFDYTtBQUNMO0FBQ0U7QUFDRztBQUNOO0FBQ0U7O0FBRW5FO0FBQ3dDO0FBQ3hDO0FBQ0E7QUFDZ0M7QUFDbUY7O0FBRW5IO0FBQzRDO0FBQ007QUFDUjs7QUFFMUMsOERBQThEO0FBQ2Y7QUFDUzs7QUFFeEQ7QUFDd0U7QUFDdkI7QUFDRTtBQUMyQjs7QUFFOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IseXNCQUFnRDtBQUN0RSxlQUFlLDBLQUEwQztBQUN6RDtBQUNBO0FBQ0EsUUFBUSx3UkFBd0Q7QUFDaEUsb0JBQW9CLHNRQUE2QztBQUNqRSxvQkFBb0IsZ0xBQTZDO0FBQ2pFLHFCQUFxQixpUUFBOEM7QUFDbkUsMEJBQTBCLDhPQUEwQztBQUNwRSxvQkFBb0Isc1RBQTZDO0FBQ2pFLGtCQUFrQix3S0FBeUM7QUFDM0Qsb0JBQW9CLCtVQUFpQztBQUNyRCwwQkFBMEIsc1BBQTJDO0FBQ3JFLG9CQUFvQiwrZkFBNkM7QUFDakUsbUJBQW1CLHNMQUFnRDtBQUNuRSxnQkFBZ0IsZ0tBQXFDO0FBQ3JELGtCQUFrQix3S0FBeUM7QUFDM0Qsa0JBQWtCLHdLQUF5QztBQUMzRCwwQkFBMEIsc1JBQW9EO0FBQzlFO0FBQ0EsUUFBUSwwUkFBeUQ7QUFDakUsb0JBQW9CLCtLQUE2QztBQUNqRSx5QkFBeUIsOExBQW9EO0FBQzdFLHVCQUF1QixtVEFBbUQ7QUFDMUUsdUJBQXVCLDRMQUFtRDtBQUMxRSwyQkFBMkIsZ3dDQUF1QztBQUNsRSxvQkFBb0IsNlNBQTZDO0FBQ2pFO0FBQ0EsbUJBQW1CLDRLQUEyQztBQUM5RCxtQkFBbUIsc0xBQWdEO0FBQ25FOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxtQkFBbUI7QUFDbkI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixNQUFNO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLDJGQUEyRjs7QUFFM0Y7QUFDQTtBQUNBO0FBQ0EsZUFBZSxxRUFBUztBQUN4QixpQkFBaUIsdUVBQVc7QUFDNUI7QUFDQSx3QkFBd0Isd0ZBQWtCO0FBQzFDO0FBQ0E7Ozs7Ozs7Ozs7OztBQzdQQSIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9wdHhycy1ib290c3RyYXAubGVzcz9mZjliIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2Nzcy9wcmVzZW50ZXJfbW9kZS5jc3M/ZWQ0MSIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9jc3MvdXNlci1oaWdobGlnaHRzLmNzcz9hOTVlIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvbWF0cml4ZXEvY3NzL21hdHJpeGVxLmNzcz9jMzRjIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvd2ViZ2xkZW1vL2Nzcy93ZWJnbGludGVyYWN0aXZlLmNzcz80NjYzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL2Jvb2tmdW5jcy5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9qcXVlcnkuaWRsZS10aW1lci5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9qcXVlcnlfaTE4bi9qcXVlcnkuaTE4bi5lbWl0dGVyLmJpZGkuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4uZW1pdHRlci5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9qcXVlcnlfaTE4bi9qcXVlcnkuaTE4bi5mYWxsYmFja3MuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4uanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4ubGFuZ3VhZ2UuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4ubWVzc2FnZXN0b3JlLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeV9pMThuL2pxdWVyeS5pMThuLnBhcnNlci5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9wcmVzZW50ZXJfbW9kZS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9wcmV0ZXh0LmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL3JlbmRlckNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL3RoZW1lLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL3VzZXItaGlnaGxpZ2h0cy5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9wcm9qZWN0X3RlbXBsYXRlL190ZW1wbGF0ZXMvcGx1Z2luX2xheW91dHMvc3BoaW54X2Jvb3RzdHJhcC9zdGF0aWMvYm9vdHN0cmFwLXNwaGlueC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vd2VicGFjay5pbmRleC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzL2V4dGVybmFsIHZhciBcImpRdWVyeVwiIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8qKlxuICpcbiAqIFVzZXI6IGJtaWxsZXJcbiAqIE9yaWdpbmFsOiAyMDExLTA0LTIwXG4gKiBEYXRlOiAyMDE5LTA2LTE0XG4gKiBUaW1lOiAyOjAxIFBNXG4gKiBUaGlzIGNoYW5nZSBtYXJrcyB0aGUgYmVnaW5uaW5nIG9mIHZlcnNpb24gNC4wIG9mIHRoZSBydW5lc3RvbmUgY29tcG9uZW50c1xuICogTG9naW4vbG9nb3V0IGlzIG5vIGxvbmdlciBoYW5kbGVkIHRocm91Z2ggamF2YXNjcmlwdCBidXQgcmF0aGVyIHNlcnZlciBzaWRlLlxuICogTWFueSBvZiB0aGUgY29tcG9uZW50cyBkZXBlbmQgb24gdGhlIHJ1bmVzdG9uZTpsb2dpbiBldmVudCBzbyB3ZSB3aWxsIGtlZXAgdGhhdFxuICogZm9yIG5vdyB0byBrZWVwIHRoZSBjaHVybiBmYWlybHkgbWluaW1hbC5cbiAqL1xuXG4vKlxuXG4gQ29weXJpZ2h0IChDKSAyMDExICBCcmFkIE1pbGxlciAgYm9uZWxha2VAZ21haWwuY29tXG5cbiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4gVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiAqL1xuXG4vL1xuLy8gUGFnZSBkZWNvcmF0aW9uIGZ1bmN0aW9uc1xuLy9cblxuZnVuY3Rpb24gYWRkUmVhZGluZ0xpc3QoKSB7XG4gICAgaWYgKGVCb29rQ29uZmlnLnJlYWRpbmdzKSB7XG4gICAgICAgIHZhciBsLCBueHQsIHBhdGhfcGFydHMsIG54dF9saW5rO1xuICAgICAgICBsZXQgY3VyX3BhdGhfcGFydHMgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoXCIvXCIpO1xuICAgICAgICBsZXQgbmFtZSA9XG4gICAgICAgICAgICBjdXJfcGF0aF9wYXJ0c1tjdXJfcGF0aF9wYXJ0cy5sZW5ndGggLSAyXSArXG4gICAgICAgICAgICBcIi9cIiArXG4gICAgICAgICAgICBjdXJfcGF0aF9wYXJ0c1tjdXJfcGF0aF9wYXJ0cy5sZW5ndGggLSAxXTtcbiAgICAgICAgbGV0IHBvc2l0aW9uID0gZUJvb2tDb25maWcucmVhZGluZ3MuaW5kZXhPZihuYW1lKTtcbiAgICAgICAgbGV0IG51bV9yZWFkaW5ncyA9IGVCb29rQ29uZmlnLnJlYWRpbmdzLmxlbmd0aDtcbiAgICAgICAgaWYgKHBvc2l0aW9uID09IGVCb29rQ29uZmlnLnJlYWRpbmdzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIC8vIG5vIG1vcmUgcmVhZGluZ3NcbiAgICAgICAgICAgIGwgPSAkKFwiPGRpdiAvPlwiLCB7XG4gICAgICAgICAgICAgICAgdGV4dDogYEZpbmlzaGVkIHJlYWRpbmcgYXNzaWdubWVudC4gUGFnZSAke251bV9yZWFkaW5nc30gb2YgJHtudW1fcmVhZGluZ3N9LmAsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChwb3NpdGlvbiA+PSAwKSB7XG4gICAgICAgICAgICAvLyBnZXQgbmV4dCBuYW1lXG4gICAgICAgICAgICBueHQgPSBlQm9va0NvbmZpZy5yZWFkaW5nc1twb3NpdGlvbiArIDFdO1xuICAgICAgICAgICAgcGF0aF9wYXJ0cyA9IGN1cl9wYXRoX3BhcnRzLnNsaWNlKDAsIGN1cl9wYXRoX3BhcnRzLmxlbmd0aCAtIDIpO1xuICAgICAgICAgICAgcGF0aF9wYXJ0cy5wdXNoKG54dCk7XG4gICAgICAgICAgICBueHRfbGluayA9IHBhdGhfcGFydHMuam9pbihcIi9cIik7XG4gICAgICAgICAgICBsID0gJChcIjxhIC8+XCIsIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcImxpbmtcIixcbiAgICAgICAgICAgICAgICBjbGFzczogXCJidG4gYnRuLWxnICcgKyAnYnV0dG9uQ29uZmlybUNvbXBsZXRpb24nXCIsXG4gICAgICAgICAgICAgICAgaHJlZjogbnh0X2xpbmssXG4gICAgICAgICAgICAgICAgdGV4dDogYENvbnRpbnVlIHRvIHBhZ2UgJHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24gKyAyXG4gICAgICAgICAgICAgICAgfSBvZiAke251bV9yZWFkaW5nc30gaW4gdGhlIHJlYWRpbmcgYXNzaWdubWVudC5gLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsID0gJChcIjxkaXYgLz5cIiwge1xuICAgICAgICAgICAgICAgIHRleHQ6IFwiVGhpcyBwYWdlIGlzIG5vdCBwYXJ0IG9mIHRoZSBsYXN0IHJlYWRpbmcgYXNzaWdubWVudCB5b3UgdmlzaXRlZC5cIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgICQoXCIjbWFpbi1jb250ZW50XCIpLmFwcGVuZChsKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHRpbWVkUmVmcmVzaCgpIHtcbiAgICB2YXIgdGltZW91dFBlcmlvZCA9IDkwMDAwMDsgLy8gNzUgbWludXRlc1xuICAgICQoZG9jdW1lbnQpLm9uKFwiaWRsZS5pZGxlVGltZXJcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBBZnRlciB0aW1lb3V0IHBlcmlvZCBzZW5kIHRoZSB1c2VyIGJhY2sgdG8gdGhlIGluZGV4LiAgVGhpcyB3aWxsIGZvcmNlIGEgbG9naW5cbiAgICAgICAgLy8gaWYgbmVlZGVkIHdoZW4gdGhleSB3YW50IHRvIGdvIHRvIGEgcGFydGljdWxhciBwYWdlLiAgVGhpcyBtYXkgbm90IGJlIHBlcmZlY3RcbiAgICAgICAgLy8gYnV0IGl0cyBhbiBlYXN5IHdheSB0byBtYWtlIHN1cmUgbGFwdG9wIHVzZXJzIGFyZSBwcm9wZXJseSBsb2dnZWQgaW4gd2hlbiB0aGV5XG4gICAgICAgIC8vIHRha2UgcXVpenplcyBhbmQgc2F2ZSBzdHVmZi5cbiAgICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5kZXhPZihcImluZGV4Lmh0bWxcIikgPCAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIklkbGUgdGltZXIgLSBcIiArIGxvY2F0aW9uLnBhdGhuYW1lKTtcbiAgICAgICAgICAgIGxvY2F0aW9uLmhyZWYgPVxuICAgICAgICAgICAgICAgIGVCb29rQ29uZmlnLmFwcCArXG4gICAgICAgICAgICAgICAgXCIvZGVmYXVsdC91c2VyL2xvZ2luP19uZXh0PVwiICtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5wYXRobmFtZSArXG4gICAgICAgICAgICAgICAgbG9jYXRpb24uc2VhcmNoO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgJC5pZGxlVGltZXIodGltZW91dFBlcmlvZCk7XG59XG5cbmNsYXNzIFBhZ2VQcm9ncmVzc0JhciB7XG4gICAgY29uc3RydWN0b3IoYWN0RGljdCkge1xuICAgICAgICB0aGlzLnBvc3NpYmxlID0gMDtcbiAgICAgICAgdGhpcy50b3RhbCA9IDE7XG4gICAgICAgIGlmIChhY3REaWN0ICYmIE9iamVjdC5rZXlzKGFjdERpY3QpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZpdGllcyA9IGFjdERpY3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgYWN0aXZpdGllcyA9IHsgcGFnZTogMCB9O1xuICAgICAgICAgICAgJChcIi5ydW5lc3RvbmVcIikuZWFjaChmdW5jdGlvbiAoaWR4LCBlKSB7XG4gICAgICAgICAgICAgICAgYWN0aXZpdGllc1tlLmZpcnN0RWxlbWVudENoaWxkLmlkXSA9IDA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZpdGllcyA9IGFjdGl2aXRpZXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVQcm9ncmVzcygpO1xuICAgICAgICAvLyBIaWRlIHRoZSBwcm9ncmVzcyBiYXIgb24gdGhlIGluZGV4IHBhZ2UuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5tYXRjaChcbiAgICAgICAgICAgICAgICAvLipcXC8oaW5kZXguaHRtbHx0b2N0cmVlLmh0bWx8RXhlcmNpc2VzLmh0bWx8c2VhcmNoLmh0bWwpJC9pXG4gICAgICAgICAgICApXG4gICAgICAgICkge1xuICAgICAgICAgICAgJChcIiNzY3Byb2dyZXNzY29udGFpbmVyXCIpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbmRlclByb2dyZXNzKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlUHJvZ3Jlc3MoKSB7XG4gICAgICAgIGZvciAobGV0IGsgaW4gdGhpcy5hY3Rpdml0aWVzKSB7XG4gICAgICAgICAgICBpZiAoayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3NzaWJsZSsrO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmFjdGl2aXRpZXNba10gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWwrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXJQcm9ncmVzcygpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gMDtcbiAgICAgICAgJChcIiNzY3Byb2dyZXNzdG90YWxcIikudGV4dCh0aGlzLnRvdGFsKTtcbiAgICAgICAgJChcIiNzY3Byb2dyZXNzcG9zc1wiKS50ZXh0KHRoaXMucG9zc2libGUpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFsdWUgPSAoMTAwICogdGhpcy50b3RhbCkgLyB0aGlzLnBvc3NpYmxlO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgJChcIiNzdWJjaGFwdGVycHJvZ3Jlc3NcIikucHJvZ3Jlc3NiYXIoe1xuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFlQm9va0NvbmZpZy5pc0xvZ2dlZEluKSB7XG4gICAgICAgICAgICAkKFwiI3N1YmNoYXB0ZXJwcm9ncmVzcz5kaXZcIikuYWRkQ2xhc3MoXCJsb2dnZWRvdXRcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVQcm9ncmVzcyhkaXZfaWQpIHtcbiAgICAgICAgdGhpcy5hY3Rpdml0aWVzW2Rpdl9pZF0rKztcbiAgICAgICAgLy8gT25seSB1cGRhdGUgdGhlIHByb2dyZXNzIGJhciBvbiB0aGUgZmlyc3QgaW50ZXJhY3Rpb24gd2l0aCBhbiBvYmplY3QuXG4gICAgICAgIGlmICh0aGlzLmFjdGl2aXRpZXNbZGl2X2lkXSA9PT0gMSkge1xuICAgICAgICAgICAgdGhpcy50b3RhbCsrO1xuICAgICAgICAgICAgbGV0IHZhbCA9ICgxMDAgKiB0aGlzLnRvdGFsKSAvIHRoaXMucG9zc2libGU7XG4gICAgICAgICAgICAkKFwiI3NjcHJvZ3Jlc3N0b3RhbFwiKS50ZXh0KHRoaXMudG90YWwpO1xuICAgICAgICAgICAgJChcIiNzY3Byb2dyZXNzcG9zc1wiKS50ZXh0KHRoaXMucG9zc2libGUpO1xuICAgICAgICAgICAgJChcIiNzdWJjaGFwdGVycHJvZ3Jlc3NcIikucHJvZ3Jlc3NiYXIoXCJvcHRpb25cIiwgXCJ2YWx1ZVwiLCB2YWwpO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHZhbCA9PSAxMDAuMCAmJlxuICAgICAgICAgICAgICAgICQoXCIjY29tcGxldGlvbkJ1dHRvblwiKS50ZXh0KCkudG9Mb3dlckNhc2UoKSA9PT1cbiAgICAgICAgICAgICAgICAgICAgXCJtYXJrIGFzIGNvbXBsZXRlZFwiXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAkKFwiI2NvbXBsZXRpb25CdXR0b25cIikuY2xpY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHZhciBwYWdlUHJvZ3Jlc3NUcmFja2VyID0ge307XG5cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVBhZ2VTZXR1cCgpIHtcbiAgICB2YXIgbWVzcztcbiAgICBpZiAoZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7XG4gICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIixcbiAgICAgICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgZGF0YSA9IHsgdGltZXpvbmVvZmZzZXQ6IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwIH07XG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vbG9nZ2VyL3NldF90el9vZmZzZXRgLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBzZXQgdGltZXpvbmUhICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIHNldHRpbmcgdGltZXpvbmUgJHtlfWApO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKGBUaGlzIHBhZ2Ugc2VydmVkIGJ5ICR7ZUJvb2tDb25maWcuc2VydmVkX2J5fWApO1xuICAgIGlmIChlQm9va0NvbmZpZy5pc0xvZ2dlZEluKSB7XG4gICAgICAgIG1lc3MgPSBgdXNlcm5hbWU6ICR7ZUJvb2tDb25maWcudXNlcm5hbWV9YDtcbiAgICAgICAgaWYgKCFlQm9va0NvbmZpZy5pc0luc3RydWN0b3IpIHtcbiAgICAgICAgICAgICQoXCIjaXBfZHJvcGRvd25fbGlua1wiKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICQoXCIjaW5zdF9wZWVyX2xpbmtcIikucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgJChkb2N1bWVudCkudHJpZ2dlcihcInJ1bmVzdG9uZTpsb2dpblwiKTtcbiAgICAgICAgYWRkUmVhZGluZ0xpc3QoKTtcbiAgICAgICAgLy8gQXZvaWQgdGhlIHRpbWVkUmVmcmVzaCBvbiB0aGUgZ3JhZGluZyBwYWdlLlxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZihcIi9hZG1pbi9ncmFkaW5nXCIpID09IC0xICYmXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZihcIi9wZWVyL1wiKSA9PSAtMVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRpbWVkUmVmcmVzaCgpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbWVzcyA9IFwiTm90IGxvZ2dlZCBpblwiO1xuICAgICAgICAkKGRvY3VtZW50KS50cmlnZ2VyKFwicnVuZXN0b25lOmxvZ291dFwiKTtcbiAgICAgICAgbGV0IGJ3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJicm93c2luZ193YXJuaW5nXCIpO1xuICAgICAgICBpZiAoYncpIHtcbiAgICAgICAgICAgIGJ3LmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgXCI8cCBjbGFzcz0nbmF2YmFyX21lc3NhZ2UnPlNhdmluZyBhbmQgTG9nZ2luZyBhcmUgRGlzYWJsZWQ8L3A+XCI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGF3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhZF93YXJuaW5nXCIpO1xuICAgICAgICBpZiAoYXcpIHtcbiAgICAgICAgICAgIGF3LmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgXCI8cCBjbGFzcz0nbmF2YmFyX21lc3NhZ2UnPvCfmqsgTG9nLWluIHRvIFJlbW92ZSA8YSBocmVmPScvcnVuZXN0b25lL2RlZmF1bHQvYWRzJz5BZHMhPC9hPiDwn5qrICZuYnNwOzwvcD5cIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAkKFwiLmxvZ2dlZGludXNlclwiKS5odG1sKG1lc3MpO1xuXG4gICAgcGFnZVByb2dyZXNzVHJhY2tlciA9IG5ldyBQYWdlUHJvZ3Jlc3NCYXIoZUJvb2tDb25maWcuYWN0aXZpdGllcyk7XG4gICAgbm90aWZ5UnVuZXN0b25lQ29tcG9uZW50cygpO1xufVxuXG5mdW5jdGlvbiBzZXR1cE5hdmJhckxvZ2dlZEluKCkge1xuICAgICQoXCIjcHJvZmlsZWxpbmtcIikuc2hvdygpO1xuICAgICQoXCIjcGFzc3dvcmRsaW5rXCIpLnNob3coKTtcbiAgICAkKFwiI3JlZ2lzdGVybGlua1wiKS5oaWRlKCk7XG4gICAgJChcImxpLmxvZ2lub3V0XCIpLmh0bWwoXG4gICAgICAgICc8YSBocmVmPVwiJyArIGVCb29rQ29uZmlnLmFwcCArICcvZGVmYXVsdC91c2VyL2xvZ291dFwiPkxvZyBPdXQ8L2E+J1xuICAgICk7XG59XG4kKGRvY3VtZW50KS5vbihcInJ1bmVzdG9uZTpsb2dpblwiLCBzZXR1cE5hdmJhckxvZ2dlZEluKTtcblxuZnVuY3Rpb24gc2V0dXBOYXZiYXJMb2dnZWRPdXQoKSB7XG4gICAgaWYgKGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwic2V0dXAgbmF2YmFyIGZvciBsb2dnZWQgb3V0XCIpO1xuICAgICAgICAkKFwiI3JlZ2lzdGVybGlua1wiKS5zaG93KCk7XG4gICAgICAgICQoXCIjcHJvZmlsZWxpbmtcIikuaGlkZSgpO1xuICAgICAgICAkKFwiI3Bhc3N3b3JkbGlua1wiKS5oaWRlKCk7XG4gICAgICAgICQoXCIjaXBfZHJvcGRvd25fbGlua1wiKS5oaWRlKCk7XG4gICAgICAgICQoXCIjaW5zdF9wZWVyX2xpbmtcIikuaGlkZSgpO1xuICAgICAgICAkKFwibGkubG9naW5vdXRcIikuaHRtbChcbiAgICAgICAgICAgICc8YSBocmVmPVwiJyArIGVCb29rQ29uZmlnLmFwcCArICcvZGVmYXVsdC91c2VyL2xvZ2luXCI+TG9naW48L2E+J1xuICAgICAgICApO1xuICAgICAgICAkKFwiLmZvb3RlclwiKS5odG1sKFwidXNlciBub3QgbG9nZ2VkIGluXCIpO1xuICAgIH1cbn1cbiQoZG9jdW1lbnQpLm9uKFwicnVuZXN0b25lOmxvZ291dFwiLCBzZXR1cE5hdmJhckxvZ2dlZE91dCk7XG5cbmZ1bmN0aW9uIG5vdGlmeVJ1bmVzdG9uZUNvbXBvbmVudHMoKSB7XG4gICAgLy8gUnVuZXN0b25lIGNvbXBvbmVudHMgd2FpdCB1bnRpbCBsb2dpbiBwcm9jZXNzIGlzIG92ZXIgdG8gbG9hZCBjb21wb25lbnRzIGJlY2F1c2Ugb2Ygc3RvcmFnZSBpc3N1ZXMuIFRoaXMgdHJpZ2dlcnMgdGhlIGBkeW5hbWljIGltcG9ydCBtYWNoaW5lcnlgLCB3aGljaCB0aGVuIHNlbmRzIHRoZSBsb2dpbiBjb21wbGV0ZSBzaWduYWwgd2hlbiB0aGlzIGFuZCBhbGwgZHluYW1pYyBpbXBvcnRzIGFyZSBmaW5pc2hlZC5cbiAgICBjb25zb2xlLmxvZyhcInRyaWdnZXJpbmcgcnVuZXN0b25lOnByZS1sb2dpbi1jb21wbGV0ZVwiKTtcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInJ1bmVzdG9uZTpwcmUtbG9naW4tY29tcGxldGVcIikpO1xufVxuXG5mdW5jdGlvbiBwbGFjZUFkQ29weSgpIHtcbiAgICBpZiAodHlwZW9mIHNob3dBZCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBzaG93QWQpIHtcbiAgICAgICAgbGV0IGFkTnVtID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMikgKyAxO1xuICAgICAgICBsZXQgYWRCbG9jayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBhZGNvcHlfJHthZE51bX1gKTtcbiAgICAgICAgbGV0IHJzRWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnJ1bmVzdG9uZVwiKTtcbiAgICAgICAgaWYgKHJzRWxlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcnNFbGVtZW50cy5sZW5ndGgpO1xuICAgICAgICAgICAgcnNFbGVtZW50c1tyYW5kb21JbmRleF0uYWZ0ZXIoYWRCbG9jayk7XG4gICAgICAgICAgICBhZEJsb2NrLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIGluaXRpYWxpemUgc3R1ZmZcbiQoZnVuY3Rpb24gKCkge1xuICAgIGlmIChlQm9va0NvbmZpZykge1xuICAgICAgICBoYW5kbGVQYWdlU2V0dXAoKTtcbiAgICAgICAgcGxhY2VBZENvcHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIGVCb29rQ29uZmlnID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICBcImVCb29rQ29uZmlnIGlzIG5vdCBkZWZpbmVkLiAgVGhpcyBwYWdlIG11c3Qgbm90IGJlIHNldCB1cCBmb3IgUnVuZXN0b25lXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuLy8gbWlzYyBzdHVmZlxuLy8gdG9kbzogIFRoaXMgY291bGQgYmUgZnVydGhlciBkaXN0cmlidXRlZCBidXQgbWFraW5nIGEgdmlkZW8uanMgZmlsZSBqdXN0IGZvciBvbmUgZnVuY3Rpb24gc2VlbXMgZHVtYi5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgLy8gYWRkIHRoZSB2aWRlbyBwbGF5IGJ1dHRvbiBvdmVybGF5IGltYWdlXG4gICAgJChcIi52aWRlby1wbGF5LW92ZXJsYXlcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykuY3NzKFxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWltYWdlXCIsXG4gICAgICAgICAgICBcInVybCgne3twYXRodG8oJ19zdGF0aWMvcGxheV9vdmVybGF5X2ljb24ucG5nJywgMSl9fScpXCJcbiAgICAgICAgKTtcbiAgICB9KTtcblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gaXMgbmVlZGVkIHRvIGFsbG93IHRoZSBkcm9wZG93biBzZWFyY2ggYmFyIHRvIHdvcms7XG4gICAgLy8gVGhlIGRlZmF1bHQgYmVoYXZpb3VyIGlzIHRoYXQgdGhlIGRyb3Bkb3duIG1lbnUgY2xvc2VzIHdoZW4gc29tZXRoaW5nIGluXG4gICAgLy8gaXQgKGxpa2UgdGhlIHNlYXJjaCBiYXIpIGlzIGNsaWNrZWRcbiAgICAkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gRml4IGlucHV0IGVsZW1lbnQgY2xpY2sgcHJvYmxlbVxuICAgICAgICAkKFwiLmRyb3Bkb3duIGlucHV0LCAuZHJvcGRvd24gbGFiZWxcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gcmUtd3JpdGUgc29tZSB1cmxzXG4gICAgLy8gVGhpcyBpcyB0cmlja2VyIHRoYW4gaXQgbG9va3MgYW5kIHlvdSBoYXZlIHRvIG9iZXkgdGhlIHJ1bGVzIGZvciAjIGFuY2hvcnNcbiAgICAvLyBUaGUgI2FuY2hvcnMgbXVzdCBjb21lIGFmdGVyIHRoZSBxdWVyeSBzdHJpbmcgYXMgdGhlIHNlcnZlciBiYXNpY2FsbHkgaWdub3JlcyBhbnkgcGFydFxuICAgIC8vIG9mIGEgdXJsIHRoYXQgY29tZXMgYWZ0ZXIgIyAtIGxpa2UgYSBjb21tZW50Li4uXG4gICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJtb2RlPWJyb3dzaW5nXCIpKSB7XG4gICAgICAgIGxldCBxdWVyeVN0cmluZyA9IFwiP21vZGU9YnJvd3NpbmdcIjtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImFcIikuZm9yRWFjaCgobGluaykgPT4ge1xuICAgICAgICAgICAgbGV0IGFuY2hvclRleHQgPSBcIlwiO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGxpbmsuaHJlZi5pbmNsdWRlcyhcImJvb2tzL3B1Ymxpc2hlZFwiKSAmJlxuICAgICAgICAgICAgICAgICFsaW5rLmhyZWYuaW5jbHVkZXMoXCI/bW9kZT1icm93c2luZ1wiKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpbmsuaHJlZi5pbmNsdWRlcyhcIiNcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFQb2ludCA9IGxpbmsuaHJlZi5pbmRleE9mKFwiI1wiKTtcbiAgICAgICAgICAgICAgICAgICAgYW5jaG9yVGV4dCA9IGxpbmsuaHJlZi5zdWJzdHJpbmcoYVBvaW50KTtcbiAgICAgICAgICAgICAgICAgICAgbGluay5ocmVmID0gbGluay5ocmVmLnN1YnN0cmluZygwLCBhUG9pbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsaW5rLmhyZWYgPSBsaW5rLmhyZWYuaW5jbHVkZXMoXCI/XCIpXG4gICAgICAgICAgICAgICAgICAgID8gbGluay5ocmVmICsgcXVlcnlTdHJpbmcucmVwbGFjZShcIj9cIiwgXCImXCIpICsgYW5jaG9yVGV4dFxuICAgICAgICAgICAgICAgICAgICA6IGxpbmsuaHJlZiArIHF1ZXJ5U3RyaW5nICsgYW5jaG9yVGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG4iLCIvKiFcbiAqIGpRdWVyeSBpZGxlVGltZXIgcGx1Z2luXG4gKiB2ZXJzaW9uIDAuOS4xMDA1MTFcbiAqIGJ5IFBhdWwgSXJpc2guXG4gKiAgIGh0dHA6Ly9naXRodWIuY29tL3BhdWxpcmlzaC95dWktbWlzYy90cmVlL1xuICogTUlUIGxpY2Vuc2VcblxuICogYWRhcHRlZCBmcm9tIFlVSSBpZGxlIHRpbWVyIGJ5IG56YWthczpcbiAqICAgaHR0cDovL2dpdGh1Yi5jb20vbnpha2FzL3l1aS1taXNjL1xuKi9cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMDkgTmljaG9sYXMgQy4gWmFrYXNcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5cbi8qIHVwZGF0ZWQgdG8gZml4IENocm9tZSBzZXRUaW1lb3V0IGlzc3VlIGJ5IFphaWQgWmF3YWlkZWggKi9cblxuIC8vIEFQSSBhdmFpbGFibGUgaW4gPD0gdjAuOFxuIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAvLyBpZGxlVGltZXIoKSB0YWtlcyBhbiBvcHRpb25hbCBhcmd1bWVudCB0aGF0IGRlZmluZXMgdGhlIGlkbGUgdGltZW91dFxuIC8vIHRpbWVvdXQgaXMgaW4gbWlsbGlzZWNvbmRzOyBkZWZhdWx0cyB0byAzMDAwMFxuICQuaWRsZVRpbWVyKDEwMDAwKTtcblxuXG4gJChkb2N1bWVudCkuYmluZChcImlkbGUuaWRsZVRpbWVyXCIsIGZ1bmN0aW9uKCl7XG4gICAgLy8gZnVuY3Rpb24geW91IHdhbnQgdG8gZmlyZSB3aGVuIHRoZSB1c2VyIGdvZXMgaWRsZVxuIH0pO1xuXG5cbiAkKGRvY3VtZW50KS5iaW5kKFwiYWN0aXZlLmlkbGVUaW1lclwiLCBmdW5jdGlvbigpe1xuICAvLyBmdW5jdGlvbiB5b3Ugd2FudCB0byBmaXJlIHdoZW4gdGhlIHVzZXIgYmVjb21lcyBhY3RpdmUgYWdhaW5cbiB9KTtcblxuIC8vIHBhc3MgdGhlIHN0cmluZyAnZGVzdHJveScgdG8gc3RvcCB0aGUgdGltZXJcbiAkLmlkbGVUaW1lcignZGVzdHJveScpO1xuXG4gLy8geW91IGNhbiBxdWVyeSBpZiB0aGUgdXNlciBpcyBpZGxlIG9yIG5vdCB3aXRoIGRhdGEoKVxuICQuZGF0YShkb2N1bWVudCwnaWRsZVRpbWVyJyk7ICAvLyAnaWRsZScgIG9yICdhY3RpdmUnXG5cbiAvLyB5b3UgY2FuIGdldCB0aW1lIGVsYXBzZWQgc2luY2UgdXNlciB3aGVuIGlkbGUvYWN0aXZlXG4gJC5pZGxlVGltZXIoJ2dldEVsYXBzZWRUaW1lJyk7IC8vIHRpbWUgc2luY2Ugc3RhdGUgY2hhbmdlIGluIG1zXG5cbiAqKioqKioqKi9cblxuXG5cbiAvLyBBUEkgYXZhaWxhYmxlIGluID49IHYwLjlcbiAvKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gLy8gYmluZCB0byBzcGVjaWZpYyBlbGVtZW50cywgYWxsb3dzIGZvciBtdWx0aXBsZSB0aW1lciBpbnN0YW5jZXNcbiAkKGVsZW0pLmlkbGVUaW1lcih0aW1lb3V0fCdkZXN0cm95J3wnZ2V0RWxhcHNlZFRpbWUnKTtcbiAkLmRhdGEoZWxlbSwnaWRsZVRpbWVyJyk7ICAvLyAnaWRsZScgIG9yICdhY3RpdmUnXG5cbiAvLyBpZiB5b3UncmUgdXNpbmcgdGhlIG9sZCAkLmlkbGVUaW1lciBhcGksIHlvdSBzaG91bGQgbm90IGRvICQoZG9jdW1lbnQpLmlkbGVUaW1lciguLi4pXG5cbiAvLyBlbGVtZW50IGJvdW5kIHRpbWVycyB3aWxsIG9ubHkgd2F0Y2ggZm9yIGV2ZW50cyBpbnNpZGUgb2YgdGhlbS5cbiAvLyB5b3UgbWF5IGp1c3Qgd2FudCBwYWdlLWxldmVsIGFjdGl2aXR5LCBpbiB3aGljaCBjYXNlIHlvdSBtYXkgc2V0IHVwXG4gLy8gICB5b3VyIHRpbWVycyBvbiBkb2N1bWVudCwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBhbmQgZG9jdW1lbnQuYm9keVxuXG4gLy8gWW91IGNhbiBvcHRpb25hbGx5IHByb3ZpZGUgYSBzZWNvbmQgYXJndW1lbnQgdG8gb3ZlcnJpZGUgY2VydGFpbiBvcHRpb25zLlxuIC8vIEhlcmUgYXJlIHRoZSBkZWZhdWx0cywgc28geW91IGNhbiBvbWl0IGFueSBvciBhbGwgb2YgdGhlbS5cbiAkKGVsZW0pLmlkbGVUaW1lcih0aW1lb3V0LCB7XG4gICBzdGFydEltbWVkaWF0ZWx5OiB0cnVlLCAvL3N0YXJ0cyBhIHRpbWVvdXQgYXMgc29vbiBhcyB0aGUgdGltZXIgaXMgc2V0IHVwOyBvdGhlcndpc2UgaXQgd2FpdHMgZm9yIHRoZSBmaXJzdCBldmVudC5cbiAgIGlkbGU6ICAgIGZhbHNlLCAgICAgICAgIC8vaW5kaWNhdGVzIGlmIHRoZSB1c2VyIGlzIGlkbGVcbiAgIGVuYWJsZWQ6IHRydWUsICAgICAgICAgIC8vaW5kaWNhdGVzIGlmIHRoZSBpZGxlIHRpbWVyIGlzIGVuYWJsZWRcbiAgIGV2ZW50czogICdtb3VzZW1vdmUga2V5ZG93biBET01Nb3VzZVNjcm9sbCBtb3VzZXdoZWVsIG1vdXNlZG93biB0b3VjaHN0YXJ0IHRvdWNobW92ZScgLy8gYWN0aXZpdHkgaXMgb25lIG9mIHRoZXNlIGV2ZW50c1xuIH0pO1xuXG4gKioqKioqKiovXG5cbihmdW5jdGlvbigkKXtcblxuJC5pZGxlVGltZXIgPSBmdW5jdGlvbihuZXdUaW1lb3V0LCBlbGVtLCBvcHRzKXtcblxuICAgIC8vIGRlZmF1bHRzIHRoYXQgYXJlIHRvIGJlIHN0b3JlZCBhcyBpbnN0YW5jZSBwcm9wcyBvbiB0aGUgZWxlbVxuXG5cdG9wdHMgPSAkLmV4dGVuZCh7XG5cdFx0c3RhcnRJbW1lZGlhdGVseTogdHJ1ZSwgLy9zdGFydHMgYSB0aW1lb3V0IGFzIHNvb24gYXMgdGhlIHRpbWVyIGlzIHNldCB1cFxuXHRcdGlkbGU6ICAgIGZhbHNlLCAgICAgICAgIC8vaW5kaWNhdGVzIGlmIHRoZSB1c2VyIGlzIGlkbGVcblx0XHRlbmFibGVkOiB0cnVlLCAgICAgICAgICAvL2luZGljYXRlcyBpZiB0aGUgaWRsZSB0aW1lciBpcyBlbmFibGVkXG5cdFx0dGltZW91dDogMzAwMDAsICAgICAgICAgLy90aGUgYW1vdW50IG9mIHRpbWUgKG1zKSBiZWZvcmUgdGhlIHVzZXIgaXMgY29uc2lkZXJlZCBpZGxlXG5cdFx0ZXZlbnRzOiAgJ21vdXNlbW92ZSBrZXlkb3duIERPTU1vdXNlU2Nyb2xsIG1vdXNld2hlZWwgbW91c2Vkb3duIHRvdWNoc3RhcnQgdG91Y2htb3ZlJyAvLyBhY3Rpdml0eSBpcyBvbmUgb2YgdGhlc2UgZXZlbnRzXG5cdH0sIG9wdHMpO1xuXG5cbiAgICBlbGVtID0gZWxlbSB8fCBkb2N1bWVudDtcblxuICAgIC8qIChpbnRlbnRpb25hbGx5IG5vdCBkb2N1bWVudGVkKVxuICAgICAqIFRvZ2dsZXMgdGhlIGlkbGUgc3RhdGUgYW5kIGZpcmVzIGFuIGFwcHJvcHJpYXRlIGV2ZW50LlxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgdmFyIHRvZ2dsZUlkbGVTdGF0ZSA9IGZ1bmN0aW9uKG15ZWxlbSl7XG5cbiAgICAgICAgLy8gY3Vyc2UgeW91LCBtb3ppbGxhIHNldFRpbWVvdXQgbGF0ZW5lc3MgYnVnIVxuICAgICAgICBpZiAodHlwZW9mIG15ZWxlbSA9PT0gJ251bWJlcicpe1xuICAgICAgICAgICAgbXllbGVtID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9iaiA9ICQuZGF0YShteWVsZW0gfHwgZWxlbSwnaWRsZVRpbWVyT2JqJyk7XG5cbiAgICAgICAgLy90b2dnbGUgdGhlIHN0YXRlXG4gICAgICAgIG9iai5pZGxlID0gIW9iai5pZGxlO1xuXG4gICAgICAgIC8vIHJlc2V0IHRpbWVvdXQgXG4gICAgICAgIHZhciBlbGFwc2VkID0gKCtuZXcgRGF0ZSgpKSAtIG9iai5vbGRkYXRlO1xuICAgICAgICBvYmoub2xkZGF0ZSA9ICtuZXcgRGF0ZSgpO1xuXG4gICAgICAgIC8vIGhhbmRsZSBDaHJvbWUgYWx3YXlzIHRyaWdnZXJpbmcgaWRsZSBhZnRlciBqcyBhbGVydCBvciBjb21maXJtIHBvcHVwXG4gICAgICAgIGlmIChvYmouaWRsZSAmJiAoZWxhcHNlZCA8IG9wdHMudGltZW91dCkpIHtcbiAgICAgICAgICAgICAgICBvYmouaWRsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCgkLmlkbGVUaW1lci50SWQpO1xuICAgICAgICAgICAgICAgIGlmIChvcHRzLmVuYWJsZWQpXG4gICAgICAgICAgICAgICAgICAkLmlkbGVUaW1lci50SWQgPSBzZXRUaW1lb3V0KHRvZ2dsZUlkbGVTdGF0ZSwgb3B0cy50aW1lb3V0KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vZmlyZSBhcHByb3ByaWF0ZSBldmVudFxuXG4gICAgICAgIC8vIGNyZWF0ZSBhIGN1c3RvbSBldmVudCwgYnV0IGZpcnN0LCBzdG9yZSB0aGUgbmV3IHN0YXRlIG9uIHRoZSBlbGVtZW50XG4gICAgICAgIC8vIGFuZCB0aGVuIGFwcGVuZCB0aGF0IHN0cmluZyB0byBhIG5hbWVzcGFjZVxuICAgICAgICB2YXIgZXZlbnQgPSBqUXVlcnkuRXZlbnQoICQuZGF0YShlbGVtLCdpZGxlVGltZXInLCBvYmouaWRsZSA/IFwiaWRsZVwiIDogXCJhY3RpdmVcIiApICArICcuaWRsZVRpbWVyJyAgICk7XG5cbiAgICAgICAgLy8gd2UgZG8gd2FudCB0aGlzIHRvIGJ1YmJsZSwgYXQgbGVhc3QgYXMgYSB0ZW1wb3JhcnkgZml4IGZvciBqUXVlcnkgMS43XG4gICAgICAgIC8vIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAkKGVsZW0pLnRyaWdnZXIoZXZlbnQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTdG9wcyB0aGUgaWRsZSB0aW1lci4gVGhpcyByZW1vdmVzIGFwcHJvcHJpYXRlIGV2ZW50IGhhbmRsZXJzXG4gICAgICogYW5kIGNhbmNlbHMgYW55IHBlbmRpbmcgdGltZW91dHMuXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKiBAbWV0aG9kIHN0b3BcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RvcCA9IGZ1bmN0aW9uKGVsZW0pe1xuXG4gICAgICAgIHZhciBvYmogPSAkLmRhdGEoZWxlbSwnaWRsZVRpbWVyT2JqJykgfHwge307XG5cbiAgICAgICAgLy9zZXQgdG8gZGlzYWJsZWRcbiAgICAgICAgb2JqLmVuYWJsZWQgPSBmYWxzZTtcblxuICAgICAgICAvL2NsZWFyIGFueSBwZW5kaW5nIHRpbWVvdXRzXG4gICAgICAgIGNsZWFyVGltZW91dChvYmoudElkKTtcblxuICAgICAgICAvL2RldGFjaCB0aGUgZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgJChlbGVtKS5vZmYoJy5pZGxlVGltZXInKTtcbiAgICB9LFxuXG5cbiAgICAvKiAoaW50ZW50aW9uYWxseSBub3QgZG9jdW1lbnRlZClcbiAgICAgKiBIYW5kbGVzIGEgdXNlciBldmVudCBpbmRpY2F0aW5nIHRoYXQgdGhlIHVzZXIgaXNuJ3QgaWRsZS5cbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBBIERPTTItbm9ybWFsaXplZCBldmVudCBvYmplY3QuXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBoYW5kbGVVc2VyRXZlbnQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBvYmogPSAkLmRhdGEodGhpcywnaWRsZVRpbWVyT2JqJyk7XG5cbiAgICAgICAgLy9jbGVhciBhbnkgZXhpc3RpbmcgdGltZW91dFxuICAgICAgICBjbGVhclRpbWVvdXQob2JqLnRJZCk7XG5cblxuXG4gICAgICAgIC8vaWYgdGhlIGlkbGUgdGltZXIgaXMgZW5hYmxlZFxuICAgICAgICBpZiAob2JqLmVuYWJsZWQpe1xuXG5cbiAgICAgICAgICAgIC8vaWYgaXQncyBpZGxlLCB0aGF0IG1lYW5zIHRoZSB1c2VyIGlzIG5vIGxvbmdlciBpZGxlXG4gICAgICAgICAgICBpZiAob2JqLmlkbGUpe1xuICAgICAgICAgICAgICAgIHRvZ2dsZUlkbGVTdGF0ZSh0aGlzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9zZXQgYSBuZXcgdGltZW91dFxuICAgICAgICAgICAgb2JqLnRJZCA9IHNldFRpbWVvdXQodG9nZ2xlSWRsZVN0YXRlLCBvYmoudGltZW91dCk7XG5cbiAgICAgICAgfVxuICAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBTdGFydHMgdGhlIGlkbGUgdGltZXIuIFRoaXMgYWRkcyBhcHByb3ByaWF0ZSBldmVudCBoYW5kbGVyc1xuICAgICAqIGFuZCBzdGFydHMgdGhlIGZpcnN0IHRpbWVvdXQuXG4gICAgICogQHBhcmFtIHtpbnR9IG5ld1RpbWVvdXQgKE9wdGlvbmFsKSBBIG5ldyB2YWx1ZSBmb3IgdGhlIHRpbWVvdXQgcGVyaW9kIGluIG1zLlxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICogQG1ldGhvZCAkLmlkbGVUaW1lclxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cblxuXG4gICAgdmFyIG9iaiA9ICQuZGF0YShlbGVtLCdpZGxlVGltZXJPYmonKSB8fCB7fTtcblxuICAgIG9iai5vbGRkYXRlID0gb2JqLm9sZGRhdGUgfHwgK25ldyBEYXRlKCk7XG5cbiAgICAvL2Fzc2lnbiBhIG5ldyB0aW1lb3V0IGlmIG5lY2Vzc2FyeVxuICAgIGlmICh0eXBlb2YgbmV3VGltZW91dCA9PT0gXCJudW1iZXJcIil7XG4gICAgICAgIG9wdHMudGltZW91dCA9IG5ld1RpbWVvdXQ7XG4gICAgfSBlbHNlIGlmIChuZXdUaW1lb3V0ID09PSAnZGVzdHJveScpIHtcbiAgICAgICAgc3RvcChlbGVtKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSBlbHNlIGlmIChuZXdUaW1lb3V0ID09PSAnZ2V0RWxhcHNlZFRpbWUnKXtcbiAgICAgICAgcmV0dXJuICgrbmV3IERhdGUoKSkgLSBvYmoub2xkZGF0ZTtcbiAgICB9XG5cbiAgICAvL2Fzc2lnbiBhcHByb3ByaWF0ZSBldmVudCBoYW5kbGVyc1xuICAgICQoZWxlbSkub24oJC50cmltKChvcHRzLmV2ZW50cysnICcpLnNwbGl0KCcgJykuam9pbignLmlkbGVUaW1lciAnKSksaGFuZGxlVXNlckV2ZW50KTtcblxuXG4gICAgb2JqLmlkbGUgICAgPSBvcHRzLmlkbGU7XG4gICAgb2JqLmVuYWJsZWQgPSBvcHRzLmVuYWJsZWQ7XG4gICAgb2JqLnRpbWVvdXQgPSBvcHRzLnRpbWVvdXQ7XG5cblxuICAgIC8vc2V0IGEgdGltZW91dCB0byB0b2dnbGUgc3RhdGUuIE1heSB3aXNoIHRvIG9taXQgdGhpcyBpbiBzb21lIHNpdHVhdGlvbnNcblx0aWYgKG9wdHMuc3RhcnRJbW1lZGlhdGVseSkge1xuXHQgICAgb2JqLnRJZCA9IHNldFRpbWVvdXQodG9nZ2xlSWRsZVN0YXRlLCBvYmoudGltZW91dCk7XG5cdH1cblxuICAgIC8vIGFzc3VtZSB0aGUgdXNlciBpcyBhY3RpdmUgZm9yIHRoZSBmaXJzdCB4IHNlY29uZHMuXG4gICAgJC5kYXRhKGVsZW0sJ2lkbGVUaW1lcicsXCJhY3RpdmVcIik7XG5cbiAgICAvLyBzdG9yZSBvdXIgaW5zdGFuY2Ugb24gdGhlIG9iamVjdFxuICAgICQuZGF0YShlbGVtLCdpZGxlVGltZXJPYmonLG9iaik7XG5cblxuXG59OyAvLyBlbmQgb2YgJC5pZGxlVGltZXIoKVxuXG5cbi8vIHYwLjkgQVBJIGZvciBkZWZpbmluZyBtdWx0aXBsZSB0aW1lcnMuXG4kLmZuLmlkbGVUaW1lciA9IGZ1bmN0aW9uKG5ld1RpbWVvdXQsb3B0cyl7XG5cdC8vIEFsbG93IG9taXNzaW9uIG9mIG9wdHMgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcblx0aWYgKCFvcHRzKSB7XG5cdFx0b3B0cyA9IHt9O1xuXHR9XG5cbiAgICBpZih0aGlzWzBdKXtcbiAgICAgICAgJC5pZGxlVGltZXIobmV3VGltZW91dCx0aGlzWzBdLG9wdHMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuXG59KShqUXVlcnkpO1xuIiwiLyohXG4gKiBCSURJIGVtYmVkZGluZyBzdXBwb3J0IGZvciBqUXVlcnkuaTE4blxuICpcbiAqIENvcHlyaWdodCAoQykgMjAxNSwgRGF2aWQgQ2hhblxuICpcbiAqIFRoaXMgY29kZSBpcyBkdWFsIGxpY2Vuc2VkIEdQTHYyIG9yIGxhdGVyIGFuZCBNSVQuIFlvdSBkb24ndCBoYXZlIHRvIGRvXG4gKiBhbnl0aGluZyBzcGVjaWFsIHRvIGNob29zZSBvbmUgbGljZW5zZSBvciB0aGUgb3RoZXIgYW5kIHlvdSBkb24ndCBoYXZlIHRvXG4gKiBub3RpZnkgYW55b25lIHdoaWNoIGxpY2Vuc2UgeW91IGFyZSB1c2luZy4gWW91IGFyZSBmcmVlIHRvIHVzZSB0aGlzIGNvZGVcbiAqIGluIGNvbW1lcmNpYWwgcHJvamVjdHMgYXMgbG9uZyBhcyB0aGUgY29weXJpZ2h0IGhlYWRlciBpcyBsZWZ0IGludGFjdC5cbiAqIFNlZSBmaWxlcyBHUEwtTElDRU5TRSBhbmQgTUlULUxJQ0VOU0UgZm9yIGRldGFpbHMuXG4gKlxuICogQGxpY2VuY2UgR05VIEdlbmVyYWwgUHVibGljIExpY2VuY2UgMi4wIG9yIGxhdGVyXG4gKiBAbGljZW5jZSBNSVQgTGljZW5zZVxuICovXG5cbiggZnVuY3Rpb24gKCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBzdHJvbmdEaXJSZWdFeHA7XG5cblx0LyoqXG5cdCAqIE1hdGNoZXMgdGhlIGZpcnN0IHN0cm9uZyBkaXJlY3Rpb25hbGl0eSBjb2RlcG9pbnQ6XG5cdCAqIC0gaW4gZ3JvdXAgMSBpZiBpdCBpcyBMVFJcblx0ICogLSBpbiBncm91cCAyIGlmIGl0IGlzIFJUTFxuXHQgKiBEb2VzIG5vdCBtYXRjaCBpZiB0aGVyZSBpcyBubyBzdHJvbmcgZGlyZWN0aW9uYWxpdHkgY29kZXBvaW50LlxuXHQgKlxuXHQgKiBHZW5lcmF0ZWQgYnkgVW5pY29kZUpTIChzZWUgdG9vbHMvc3Ryb25nRGlyKSBmcm9tIHRoZSBVQ0Q7IHNlZVxuXHQgKiBodHRwczovL3BoYWJyaWNhdG9yLndpa2ltZWRpYS5vcmcvZGlmZnVzaW9uL0dVSlMvIC5cblx0ICovXG5cdHN0cm9uZ0RpclJlZ0V4cCA9IG5ldyBSZWdFeHAoXG5cdFx0Jyg/OicgK1xuXHRcdFx0JygnICtcblx0XHRcdFx0J1tcXHUwMDQxLVxcdTAwNWFcXHUwMDYxLVxcdTAwN2FcXHUwMGFhXFx1MDBiNVxcdTAwYmFcXHUwMGMwLVxcdTAwZDZcXHUwMGQ4LVxcdTAwZjZcXHUwMGY4LVxcdTAyYjhcXHUwMmJiLVxcdTAyYzFcXHUwMmQwXFx1MDJkMVxcdTAyZTAtXFx1MDJlNFxcdTAyZWVcXHUwMzcwLVxcdTAzNzNcXHUwMzc2XFx1MDM3N1xcdTAzN2EtXFx1MDM3ZFxcdTAzN2ZcXHUwMzg2XFx1MDM4OC1cXHUwMzhhXFx1MDM4Y1xcdTAzOGUtXFx1MDNhMVxcdTAzYTMtXFx1MDNmNVxcdTAzZjctXFx1MDQ4MlxcdTA0OGEtXFx1MDUyZlxcdTA1MzEtXFx1MDU1NlxcdTA1NTktXFx1MDU1ZlxcdTA1NjEtXFx1MDU4N1xcdTA1ODlcXHUwOTAzLVxcdTA5MzlcXHUwOTNiXFx1MDkzZC1cXHUwOTQwXFx1MDk0OS1cXHUwOTRjXFx1MDk0ZS1cXHUwOTUwXFx1MDk1OC1cXHUwOTYxXFx1MDk2NC1cXHUwOTgwXFx1MDk4MlxcdTA5ODNcXHUwOTg1LVxcdTA5OGNcXHUwOThmXFx1MDk5MFxcdTA5OTMtXFx1MDlhOFxcdTA5YWEtXFx1MDliMFxcdTA5YjJcXHUwOWI2LVxcdTA5YjlcXHUwOWJkLVxcdTA5YzBcXHUwOWM3XFx1MDljOFxcdTA5Y2JcXHUwOWNjXFx1MDljZVxcdTA5ZDdcXHUwOWRjXFx1MDlkZFxcdTA5ZGYtXFx1MDllMVxcdTA5ZTYtXFx1MDlmMVxcdTA5ZjQtXFx1MDlmYVxcdTBhMDNcXHUwYTA1LVxcdTBhMGFcXHUwYTBmXFx1MGExMFxcdTBhMTMtXFx1MGEyOFxcdTBhMmEtXFx1MGEzMFxcdTBhMzJcXHUwYTMzXFx1MGEzNVxcdTBhMzZcXHUwYTM4XFx1MGEzOVxcdTBhM2UtXFx1MGE0MFxcdTBhNTktXFx1MGE1Y1xcdTBhNWVcXHUwYTY2LVxcdTBhNmZcXHUwYTcyLVxcdTBhNzRcXHUwYTgzXFx1MGE4NS1cXHUwYThkXFx1MGE4Zi1cXHUwYTkxXFx1MGE5My1cXHUwYWE4XFx1MGFhYS1cXHUwYWIwXFx1MGFiMlxcdTBhYjNcXHUwYWI1LVxcdTBhYjlcXHUwYWJkLVxcdTBhYzBcXHUwYWM5XFx1MGFjYlxcdTBhY2NcXHUwYWQwXFx1MGFlMFxcdTBhZTFcXHUwYWU2LVxcdTBhZjBcXHUwYWY5XFx1MGIwMlxcdTBiMDNcXHUwYjA1LVxcdTBiMGNcXHUwYjBmXFx1MGIxMFxcdTBiMTMtXFx1MGIyOFxcdTBiMmEtXFx1MGIzMFxcdTBiMzJcXHUwYjMzXFx1MGIzNS1cXHUwYjM5XFx1MGIzZFxcdTBiM2VcXHUwYjQwXFx1MGI0N1xcdTBiNDhcXHUwYjRiXFx1MGI0Y1xcdTBiNTdcXHUwYjVjXFx1MGI1ZFxcdTBiNWYtXFx1MGI2MVxcdTBiNjYtXFx1MGI3N1xcdTBiODNcXHUwYjg1LVxcdTBiOGFcXHUwYjhlLVxcdTBiOTBcXHUwYjkyLVxcdTBiOTVcXHUwYjk5XFx1MGI5YVxcdTBiOWNcXHUwYjllXFx1MGI5ZlxcdTBiYTNcXHUwYmE0XFx1MGJhOC1cXHUwYmFhXFx1MGJhZS1cXHUwYmI5XFx1MGJiZVxcdTBiYmZcXHUwYmMxXFx1MGJjMlxcdTBiYzYtXFx1MGJjOFxcdTBiY2EtXFx1MGJjY1xcdTBiZDBcXHUwYmQ3XFx1MGJlNi1cXHUwYmYyXFx1MGMwMS1cXHUwYzAzXFx1MGMwNS1cXHUwYzBjXFx1MGMwZS1cXHUwYzEwXFx1MGMxMi1cXHUwYzI4XFx1MGMyYS1cXHUwYzM5XFx1MGMzZFxcdTBjNDEtXFx1MGM0NFxcdTBjNTgtXFx1MGM1YVxcdTBjNjBcXHUwYzYxXFx1MGM2Ni1cXHUwYzZmXFx1MGM3ZlxcdTBjODJcXHUwYzgzXFx1MGM4NS1cXHUwYzhjXFx1MGM4ZS1cXHUwYzkwXFx1MGM5Mi1cXHUwY2E4XFx1MGNhYS1cXHUwY2IzXFx1MGNiNS1cXHUwY2I5XFx1MGNiZC1cXHUwY2M0XFx1MGNjNi1cXHUwY2M4XFx1MGNjYVxcdTBjY2JcXHUwY2Q1XFx1MGNkNlxcdTBjZGVcXHUwY2UwXFx1MGNlMVxcdTBjZTYtXFx1MGNlZlxcdTBjZjFcXHUwY2YyXFx1MGQwMlxcdTBkMDNcXHUwZDA1LVxcdTBkMGNcXHUwZDBlLVxcdTBkMTBcXHUwZDEyLVxcdTBkM2FcXHUwZDNkLVxcdTBkNDBcXHUwZDQ2LVxcdTBkNDhcXHUwZDRhLVxcdTBkNGNcXHUwZDRlXFx1MGQ1N1xcdTBkNWYtXFx1MGQ2MVxcdTBkNjYtXFx1MGQ3NVxcdTBkNzktXFx1MGQ3ZlxcdTBkODJcXHUwZDgzXFx1MGQ4NS1cXHUwZDk2XFx1MGQ5YS1cXHUwZGIxXFx1MGRiMy1cXHUwZGJiXFx1MGRiZFxcdTBkYzAtXFx1MGRjNlxcdTBkY2YtXFx1MGRkMVxcdTBkZDgtXFx1MGRkZlxcdTBkZTYtXFx1MGRlZlxcdTBkZjItXFx1MGRmNFxcdTBlMDEtXFx1MGUzMFxcdTBlMzJcXHUwZTMzXFx1MGU0MC1cXHUwZTQ2XFx1MGU0Zi1cXHUwZTViXFx1MGU4MVxcdTBlODJcXHUwZTg0XFx1MGU4N1xcdTBlODhcXHUwZThhXFx1MGU4ZFxcdTBlOTQtXFx1MGU5N1xcdTBlOTktXFx1MGU5ZlxcdTBlYTEtXFx1MGVhM1xcdTBlYTVcXHUwZWE3XFx1MGVhYVxcdTBlYWJcXHUwZWFkLVxcdTBlYjBcXHUwZWIyXFx1MGViM1xcdTBlYmRcXHUwZWMwLVxcdTBlYzRcXHUwZWM2XFx1MGVkMC1cXHUwZWQ5XFx1MGVkYy1cXHUwZWRmXFx1MGYwMC1cXHUwZjE3XFx1MGYxYS1cXHUwZjM0XFx1MGYzNlxcdTBmMzhcXHUwZjNlLVxcdTBmNDdcXHUwZjQ5LVxcdTBmNmNcXHUwZjdmXFx1MGY4NVxcdTBmODgtXFx1MGY4Y1xcdTBmYmUtXFx1MGZjNVxcdTBmYzctXFx1MGZjY1xcdTBmY2UtXFx1MGZkYVxcdTEwMDAtXFx1MTAyY1xcdTEwMzFcXHUxMDM4XFx1MTAzYlxcdTEwM2NcXHUxMDNmLVxcdTEwNTdcXHUxMDVhLVxcdTEwNWRcXHUxMDYxLVxcdTEwNzBcXHUxMDc1LVxcdTEwODFcXHUxMDgzXFx1MTA4NFxcdTEwODctXFx1MTA4Y1xcdTEwOGUtXFx1MTA5Y1xcdTEwOWUtXFx1MTBjNVxcdTEwYzdcXHUxMGNkXFx1MTBkMC1cXHUxMjQ4XFx1MTI0YS1cXHUxMjRkXFx1MTI1MC1cXHUxMjU2XFx1MTI1OFxcdTEyNWEtXFx1MTI1ZFxcdTEyNjAtXFx1MTI4OFxcdTEyOGEtXFx1MTI4ZFxcdTEyOTAtXFx1MTJiMFxcdTEyYjItXFx1MTJiNVxcdTEyYjgtXFx1MTJiZVxcdTEyYzBcXHUxMmMyLVxcdTEyYzVcXHUxMmM4LVxcdTEyZDZcXHUxMmQ4LVxcdTEzMTBcXHUxMzEyLVxcdTEzMTVcXHUxMzE4LVxcdTEzNWFcXHUxMzYwLVxcdTEzN2NcXHUxMzgwLVxcdTEzOGZcXHUxM2EwLVxcdTEzZjVcXHUxM2Y4LVxcdTEzZmRcXHUxNDAxLVxcdTE2N2ZcXHUxNjgxLVxcdTE2OWFcXHUxNmEwLVxcdTE2ZjhcXHUxNzAwLVxcdTE3MGNcXHUxNzBlLVxcdTE3MTFcXHUxNzIwLVxcdTE3MzFcXHUxNzM1XFx1MTczNlxcdTE3NDAtXFx1MTc1MVxcdTE3NjAtXFx1MTc2Y1xcdTE3NmUtXFx1MTc3MFxcdTE3ODAtXFx1MTdiM1xcdTE3YjZcXHUxN2JlLVxcdTE3YzVcXHUxN2M3XFx1MTdjOFxcdTE3ZDQtXFx1MTdkYVxcdTE3ZGNcXHUxN2UwLVxcdTE3ZTlcXHUxODEwLVxcdTE4MTlcXHUxODIwLVxcdTE4NzdcXHUxODgwLVxcdTE4YThcXHUxOGFhXFx1MThiMC1cXHUxOGY1XFx1MTkwMC1cXHUxOTFlXFx1MTkyMy1cXHUxOTI2XFx1MTkyOS1cXHUxOTJiXFx1MTkzMFxcdTE5MzFcXHUxOTMzLVxcdTE5MzhcXHUxOTQ2LVxcdTE5NmRcXHUxOTcwLVxcdTE5NzRcXHUxOTgwLVxcdTE5YWJcXHUxOWIwLVxcdTE5YzlcXHUxOWQwLVxcdTE5ZGFcXHUxYTAwLVxcdTFhMTZcXHUxYTE5XFx1MWExYVxcdTFhMWUtXFx1MWE1NVxcdTFhNTdcXHUxYTYxXFx1MWE2M1xcdTFhNjRcXHUxYTZkLVxcdTFhNzJcXHUxYTgwLVxcdTFhODlcXHUxYTkwLVxcdTFhOTlcXHUxYWEwLVxcdTFhYWRcXHUxYjA0LVxcdTFiMzNcXHUxYjM1XFx1MWIzYlxcdTFiM2QtXFx1MWI0MVxcdTFiNDMtXFx1MWI0YlxcdTFiNTAtXFx1MWI2YVxcdTFiNzQtXFx1MWI3Y1xcdTFiODItXFx1MWJhMVxcdTFiYTZcXHUxYmE3XFx1MWJhYVxcdTFiYWUtXFx1MWJlNVxcdTFiZTdcXHUxYmVhLVxcdTFiZWNcXHUxYmVlXFx1MWJmMlxcdTFiZjNcXHUxYmZjLVxcdTFjMmJcXHUxYzM0XFx1MWMzNVxcdTFjM2ItXFx1MWM0OVxcdTFjNGQtXFx1MWM3ZlxcdTFjYzAtXFx1MWNjN1xcdTFjZDNcXHUxY2UxXFx1MWNlOS1cXHUxY2VjXFx1MWNlZS1cXHUxY2YzXFx1MWNmNVxcdTFjZjZcXHUxZDAwLVxcdTFkYmZcXHUxZTAwLVxcdTFmMTVcXHUxZjE4LVxcdTFmMWRcXHUxZjIwLVxcdTFmNDVcXHUxZjQ4LVxcdTFmNGRcXHUxZjUwLVxcdTFmNTdcXHUxZjU5XFx1MWY1YlxcdTFmNWRcXHUxZjVmLVxcdTFmN2RcXHUxZjgwLVxcdTFmYjRcXHUxZmI2LVxcdTFmYmNcXHUxZmJlXFx1MWZjMi1cXHUxZmM0XFx1MWZjNi1cXHUxZmNjXFx1MWZkMC1cXHUxZmQzXFx1MWZkNi1cXHUxZmRiXFx1MWZlMC1cXHUxZmVjXFx1MWZmMi1cXHUxZmY0XFx1MWZmNi1cXHUxZmZjXFx1MjAwZVxcdTIwNzFcXHUyMDdmXFx1MjA5MC1cXHUyMDljXFx1MjEwMlxcdTIxMDdcXHUyMTBhLVxcdTIxMTNcXHUyMTE1XFx1MjExOS1cXHUyMTFkXFx1MjEyNFxcdTIxMjZcXHUyMTI4XFx1MjEyYS1cXHUyMTJkXFx1MjEyZi1cXHUyMTM5XFx1MjEzYy1cXHUyMTNmXFx1MjE0NS1cXHUyMTQ5XFx1MjE0ZVxcdTIxNGZcXHUyMTYwLVxcdTIxODhcXHUyMzM2LVxcdTIzN2FcXHUyMzk1XFx1MjQ5Yy1cXHUyNGU5XFx1MjZhY1xcdTI4MDAtXFx1MjhmZlxcdTJjMDAtXFx1MmMyZVxcdTJjMzAtXFx1MmM1ZVxcdTJjNjAtXFx1MmNlNFxcdTJjZWItXFx1MmNlZVxcdTJjZjJcXHUyY2YzXFx1MmQwMC1cXHUyZDI1XFx1MmQyN1xcdTJkMmRcXHUyZDMwLVxcdTJkNjdcXHUyZDZmXFx1MmQ3MFxcdTJkODAtXFx1MmQ5NlxcdTJkYTAtXFx1MmRhNlxcdTJkYTgtXFx1MmRhZVxcdTJkYjAtXFx1MmRiNlxcdTJkYjgtXFx1MmRiZVxcdTJkYzAtXFx1MmRjNlxcdTJkYzgtXFx1MmRjZVxcdTJkZDAtXFx1MmRkNlxcdTJkZDgtXFx1MmRkZVxcdTMwMDUtXFx1MzAwN1xcdTMwMjEtXFx1MzAyOVxcdTMwMmVcXHUzMDJmXFx1MzAzMS1cXHUzMDM1XFx1MzAzOC1cXHUzMDNjXFx1MzA0MS1cXHUzMDk2XFx1MzA5ZC1cXHUzMDlmXFx1MzBhMS1cXHUzMGZhXFx1MzBmYy1cXHUzMGZmXFx1MzEwNS1cXHUzMTJkXFx1MzEzMS1cXHUzMThlXFx1MzE5MC1cXHUzMWJhXFx1MzFmMC1cXHUzMjFjXFx1MzIyMC1cXHUzMjRmXFx1MzI2MC1cXHUzMjdiXFx1MzI3Zi1cXHUzMmIwXFx1MzJjMC1cXHUzMmNiXFx1MzJkMC1cXHUzMmZlXFx1MzMwMC1cXHUzMzc2XFx1MzM3Yi1cXHUzM2RkXFx1MzNlMC1cXHUzM2ZlXFx1MzQwMC1cXHU0ZGI1XFx1NGUwMC1cXHU5ZmQ1XFx1YTAwMC1cXHVhNDhjXFx1YTRkMC1cXHVhNjBjXFx1YTYxMC1cXHVhNjJiXFx1YTY0MC1cXHVhNjZlXFx1YTY4MC1cXHVhNjlkXFx1YTZhMC1cXHVhNmVmXFx1YTZmMi1cXHVhNmY3XFx1YTcyMi1cXHVhNzg3XFx1YTc4OS1cXHVhN2FkXFx1YTdiMC1cXHVhN2I3XFx1YTdmNy1cXHVhODAxXFx1YTgwMy1cXHVhODA1XFx1YTgwNy1cXHVhODBhXFx1YTgwYy1cXHVhODI0XFx1YTgyN1xcdWE4MzAtXFx1YTgzN1xcdWE4NDAtXFx1YTg3M1xcdWE4ODAtXFx1YThjM1xcdWE4Y2UtXFx1YThkOVxcdWE4ZjItXFx1YThmZFxcdWE5MDAtXFx1YTkyNVxcdWE5MmUtXFx1YTk0NlxcdWE5NTJcXHVhOTUzXFx1YTk1Zi1cXHVhOTdjXFx1YTk4My1cXHVhOWIyXFx1YTliNFxcdWE5YjVcXHVhOWJhXFx1YTliYlxcdWE5YmQtXFx1YTljZFxcdWE5Y2YtXFx1YTlkOVxcdWE5ZGUtXFx1YTllNFxcdWE5ZTYtXFx1YTlmZVxcdWFhMDAtXFx1YWEyOFxcdWFhMmZcXHVhYTMwXFx1YWEzM1xcdWFhMzRcXHVhYTQwLVxcdWFhNDJcXHVhYTQ0LVxcdWFhNGJcXHVhYTRkXFx1YWE1MC1cXHVhYTU5XFx1YWE1Yy1cXHVhYTdiXFx1YWE3ZC1cXHVhYWFmXFx1YWFiMVxcdWFhYjVcXHVhYWI2XFx1YWFiOS1cXHVhYWJkXFx1YWFjMFxcdWFhYzJcXHVhYWRiLVxcdWFhZWJcXHVhYWVlLVxcdWFhZjVcXHVhYjAxLVxcdWFiMDZcXHVhYjA5LVxcdWFiMGVcXHVhYjExLVxcdWFiMTZcXHVhYjIwLVxcdWFiMjZcXHVhYjI4LVxcdWFiMmVcXHVhYjMwLVxcdWFiNjVcXHVhYjcwLVxcdWFiZTRcXHVhYmU2XFx1YWJlN1xcdWFiZTktXFx1YWJlY1xcdWFiZjAtXFx1YWJmOVxcdWFjMDAtXFx1ZDdhM1xcdWQ3YjAtXFx1ZDdjNlxcdWQ3Y2ItXFx1ZDdmYlxcdWUwMDAtXFx1ZmE2ZFxcdWZhNzAtXFx1ZmFkOVxcdWZiMDAtXFx1ZmIwNlxcdWZiMTMtXFx1ZmIxN1xcdWZmMjEtXFx1ZmYzYVxcdWZmNDEtXFx1ZmY1YVxcdWZmNjYtXFx1ZmZiZVxcdWZmYzItXFx1ZmZjN1xcdWZmY2EtXFx1ZmZjZlxcdWZmZDItXFx1ZmZkN1xcdWZmZGEtXFx1ZmZkY118XFx1ZDgwMFtcXHVkYzAwLVxcdWRjMGJdfFxcdWQ4MDBbXFx1ZGMwZC1cXHVkYzI2XXxcXHVkODAwW1xcdWRjMjgtXFx1ZGMzYV18XFx1ZDgwMFxcdWRjM2N8XFx1ZDgwMFxcdWRjM2R8XFx1ZDgwMFtcXHVkYzNmLVxcdWRjNGRdfFxcdWQ4MDBbXFx1ZGM1MC1cXHVkYzVkXXxcXHVkODAwW1xcdWRjODAtXFx1ZGNmYV18XFx1ZDgwMFxcdWRkMDB8XFx1ZDgwMFxcdWRkMDJ8XFx1ZDgwMFtcXHVkZDA3LVxcdWRkMzNdfFxcdWQ4MDBbXFx1ZGQzNy1cXHVkZDNmXXxcXHVkODAwW1xcdWRkZDAtXFx1ZGRmY118XFx1ZDgwMFtcXHVkZTgwLVxcdWRlOWNdfFxcdWQ4MDBbXFx1ZGVhMC1cXHVkZWQwXXxcXHVkODAwW1xcdWRmMDAtXFx1ZGYyM118XFx1ZDgwMFtcXHVkZjMwLVxcdWRmNGFdfFxcdWQ4MDBbXFx1ZGY1MC1cXHVkZjc1XXxcXHVkODAwW1xcdWRmODAtXFx1ZGY5ZF18XFx1ZDgwMFtcXHVkZjlmLVxcdWRmYzNdfFxcdWQ4MDBbXFx1ZGZjOC1cXHVkZmQ1XXxcXHVkODAxW1xcdWRjMDAtXFx1ZGM5ZF18XFx1ZDgwMVtcXHVkY2EwLVxcdWRjYTldfFxcdWQ4MDFbXFx1ZGQwMC1cXHVkZDI3XXxcXHVkODAxW1xcdWRkMzAtXFx1ZGQ2M118XFx1ZDgwMVxcdWRkNmZ8XFx1ZDgwMVtcXHVkZTAwLVxcdWRmMzZdfFxcdWQ4MDFbXFx1ZGY0MC1cXHVkZjU1XXxcXHVkODAxW1xcdWRmNjAtXFx1ZGY2N118XFx1ZDgwNFxcdWRjMDB8XFx1ZDgwNFtcXHVkYzAyLVxcdWRjMzddfFxcdWQ4MDRbXFx1ZGM0Ny1cXHVkYzRkXXxcXHVkODA0W1xcdWRjNjYtXFx1ZGM2Zl18XFx1ZDgwNFtcXHVkYzgyLVxcdWRjYjJdfFxcdWQ4MDRcXHVkY2I3fFxcdWQ4MDRcXHVkY2I4fFxcdWQ4MDRbXFx1ZGNiYi1cXHVkY2MxXXxcXHVkODA0W1xcdWRjZDAtXFx1ZGNlOF18XFx1ZDgwNFtcXHVkY2YwLVxcdWRjZjldfFxcdWQ4MDRbXFx1ZGQwMy1cXHVkZDI2XXxcXHVkODA0XFx1ZGQyY3xcXHVkODA0W1xcdWRkMzYtXFx1ZGQ0M118XFx1ZDgwNFtcXHVkZDUwLVxcdWRkNzJdfFxcdWQ4MDRbXFx1ZGQ3NC1cXHVkZDc2XXxcXHVkODA0W1xcdWRkODItXFx1ZGRiNV18XFx1ZDgwNFtcXHVkZGJmLVxcdWRkYzldfFxcdWQ4MDRcXHVkZGNkfFxcdWQ4MDRbXFx1ZGRkMC1cXHVkZGRmXXxcXHVkODA0W1xcdWRkZTEtXFx1ZGRmNF18XFx1ZDgwNFtcXHVkZTAwLVxcdWRlMTFdfFxcdWQ4MDRbXFx1ZGUxMy1cXHVkZTJlXXxcXHVkODA0XFx1ZGUzMnxcXHVkODA0XFx1ZGUzM3xcXHVkODA0XFx1ZGUzNXxcXHVkODA0W1xcdWRlMzgtXFx1ZGUzZF18XFx1ZDgwNFtcXHVkZTgwLVxcdWRlODZdfFxcdWQ4MDRcXHVkZTg4fFxcdWQ4MDRbXFx1ZGU4YS1cXHVkZThkXXxcXHVkODA0W1xcdWRlOGYtXFx1ZGU5ZF18XFx1ZDgwNFtcXHVkZTlmLVxcdWRlYTldfFxcdWQ4MDRbXFx1ZGViMC1cXHVkZWRlXXxcXHVkODA0W1xcdWRlZTAtXFx1ZGVlMl18XFx1ZDgwNFtcXHVkZWYwLVxcdWRlZjldfFxcdWQ4MDRcXHVkZjAyfFxcdWQ4MDRcXHVkZjAzfFxcdWQ4MDRbXFx1ZGYwNS1cXHVkZjBjXXxcXHVkODA0XFx1ZGYwZnxcXHVkODA0XFx1ZGYxMHxcXHVkODA0W1xcdWRmMTMtXFx1ZGYyOF18XFx1ZDgwNFtcXHVkZjJhLVxcdWRmMzBdfFxcdWQ4MDRcXHVkZjMyfFxcdWQ4MDRcXHVkZjMzfFxcdWQ4MDRbXFx1ZGYzNS1cXHVkZjM5XXxcXHVkODA0W1xcdWRmM2QtXFx1ZGYzZl18XFx1ZDgwNFtcXHVkZjQxLVxcdWRmNDRdfFxcdWQ4MDRcXHVkZjQ3fFxcdWQ4MDRcXHVkZjQ4fFxcdWQ4MDRbXFx1ZGY0Yi1cXHVkZjRkXXxcXHVkODA0XFx1ZGY1MHxcXHVkODA0XFx1ZGY1N3xcXHVkODA0W1xcdWRmNWQtXFx1ZGY2M118XFx1ZDgwNVtcXHVkYzgwLVxcdWRjYjJdfFxcdWQ4MDVcXHVkY2I5fFxcdWQ4MDVbXFx1ZGNiYi1cXHVkY2JlXXxcXHVkODA1XFx1ZGNjMXxcXHVkODA1W1xcdWRjYzQtXFx1ZGNjN118XFx1ZDgwNVtcXHVkY2QwLVxcdWRjZDldfFxcdWQ4MDVbXFx1ZGQ4MC1cXHVkZGIxXXxcXHVkODA1W1xcdWRkYjgtXFx1ZGRiYl18XFx1ZDgwNVxcdWRkYmV8XFx1ZDgwNVtcXHVkZGMxLVxcdWRkZGJdfFxcdWQ4MDVbXFx1ZGUwMC1cXHVkZTMyXXxcXHVkODA1XFx1ZGUzYnxcXHVkODA1XFx1ZGUzY3xcXHVkODA1XFx1ZGUzZXxcXHVkODA1W1xcdWRlNDEtXFx1ZGU0NF18XFx1ZDgwNVtcXHVkZTUwLVxcdWRlNTldfFxcdWQ4MDVbXFx1ZGU4MC1cXHVkZWFhXXxcXHVkODA1XFx1ZGVhY3xcXHVkODA1XFx1ZGVhZXxcXHVkODA1XFx1ZGVhZnxcXHVkODA1XFx1ZGViNnxcXHVkODA1W1xcdWRlYzAtXFx1ZGVjOV18XFx1ZDgwNVtcXHVkZjAwLVxcdWRmMTldfFxcdWQ4MDVcXHVkZjIwfFxcdWQ4MDVcXHVkZjIxfFxcdWQ4MDVcXHVkZjI2fFxcdWQ4MDVbXFx1ZGYzMC1cXHVkZjNmXXxcXHVkODA2W1xcdWRjYTAtXFx1ZGNmMl18XFx1ZDgwNlxcdWRjZmZ8XFx1ZDgwNltcXHVkZWMwLVxcdWRlZjhdfFxcdWQ4MDhbXFx1ZGMwMC1cXHVkZjk5XXxcXHVkODA5W1xcdWRjMDAtXFx1ZGM2ZV18XFx1ZDgwOVtcXHVkYzcwLVxcdWRjNzRdfFxcdWQ4MDlbXFx1ZGM4MC1cXHVkZDQzXXxcXHVkODBjW1xcdWRjMDAtXFx1ZGZmZl18XFx1ZDgwZFtcXHVkYzAwLVxcdWRjMmVdfFxcdWQ4MTFbXFx1ZGMwMC1cXHVkZTQ2XXxcXHVkODFhW1xcdWRjMDAtXFx1ZGUzOF18XFx1ZDgxYVtcXHVkZTQwLVxcdWRlNWVdfFxcdWQ4MWFbXFx1ZGU2MC1cXHVkZTY5XXxcXHVkODFhXFx1ZGU2ZXxcXHVkODFhXFx1ZGU2ZnxcXHVkODFhW1xcdWRlZDAtXFx1ZGVlZF18XFx1ZDgxYVxcdWRlZjV8XFx1ZDgxYVtcXHVkZjAwLVxcdWRmMmZdfFxcdWQ4MWFbXFx1ZGYzNy1cXHVkZjQ1XXxcXHVkODFhW1xcdWRmNTAtXFx1ZGY1OV18XFx1ZDgxYVtcXHVkZjViLVxcdWRmNjFdfFxcdWQ4MWFbXFx1ZGY2My1cXHVkZjc3XXxcXHVkODFhW1xcdWRmN2QtXFx1ZGY4Zl18XFx1ZDgxYltcXHVkZjAwLVxcdWRmNDRdfFxcdWQ4MWJbXFx1ZGY1MC1cXHVkZjdlXXxcXHVkODFiW1xcdWRmOTMtXFx1ZGY5Zl18XFx1ZDgyY1xcdWRjMDB8XFx1ZDgyY1xcdWRjMDF8XFx1ZDgyZltcXHVkYzAwLVxcdWRjNmFdfFxcdWQ4MmZbXFx1ZGM3MC1cXHVkYzdjXXxcXHVkODJmW1xcdWRjODAtXFx1ZGM4OF18XFx1ZDgyZltcXHVkYzkwLVxcdWRjOTldfFxcdWQ4MmZcXHVkYzljfFxcdWQ4MmZcXHVkYzlmfFxcdWQ4MzRbXFx1ZGMwMC1cXHVkY2Y1XXxcXHVkODM0W1xcdWRkMDAtXFx1ZGQyNl18XFx1ZDgzNFtcXHVkZDI5LVxcdWRkNjZdfFxcdWQ4MzRbXFx1ZGQ2YS1cXHVkZDcyXXxcXHVkODM0XFx1ZGQ4M3xcXHVkODM0XFx1ZGQ4NHxcXHVkODM0W1xcdWRkOGMtXFx1ZGRhOV18XFx1ZDgzNFtcXHVkZGFlLVxcdWRkZThdfFxcdWQ4MzRbXFx1ZGY2MC1cXHVkZjcxXXxcXHVkODM1W1xcdWRjMDAtXFx1ZGM1NF18XFx1ZDgzNVtcXHVkYzU2LVxcdWRjOWNdfFxcdWQ4MzVcXHVkYzllfFxcdWQ4MzVcXHVkYzlmfFxcdWQ4MzVcXHVkY2EyfFxcdWQ4MzVcXHVkY2E1fFxcdWQ4MzVcXHVkY2E2fFxcdWQ4MzVbXFx1ZGNhOS1cXHVkY2FjXXxcXHVkODM1W1xcdWRjYWUtXFx1ZGNiOV18XFx1ZDgzNVxcdWRjYmJ8XFx1ZDgzNVtcXHVkY2JkLVxcdWRjYzNdfFxcdWQ4MzVbXFx1ZGNjNS1cXHVkZDA1XXxcXHVkODM1W1xcdWRkMDctXFx1ZGQwYV18XFx1ZDgzNVtcXHVkZDBkLVxcdWRkMTRdfFxcdWQ4MzVbXFx1ZGQxNi1cXHVkZDFjXXxcXHVkODM1W1xcdWRkMWUtXFx1ZGQzOV18XFx1ZDgzNVtcXHVkZDNiLVxcdWRkM2VdfFxcdWQ4MzVbXFx1ZGQ0MC1cXHVkZDQ0XXxcXHVkODM1XFx1ZGQ0NnxcXHVkODM1W1xcdWRkNGEtXFx1ZGQ1MF18XFx1ZDgzNVtcXHVkZDUyLVxcdWRlYTVdfFxcdWQ4MzVbXFx1ZGVhOC1cXHVkZWRhXXxcXHVkODM1W1xcdWRlZGMtXFx1ZGYxNF18XFx1ZDgzNVtcXHVkZjE2LVxcdWRmNGVdfFxcdWQ4MzVbXFx1ZGY1MC1cXHVkZjg4XXxcXHVkODM1W1xcdWRmOGEtXFx1ZGZjMl18XFx1ZDgzNVtcXHVkZmM0LVxcdWRmY2JdfFxcdWQ4MzZbXFx1ZGMwMC1cXHVkZGZmXXxcXHVkODM2W1xcdWRlMzctXFx1ZGUzYV18XFx1ZDgzNltcXHVkZTZkLVxcdWRlNzRdfFxcdWQ4MzZbXFx1ZGU3Ni1cXHVkZTgzXXxcXHVkODM2W1xcdWRlODUtXFx1ZGU4Yl18XFx1ZDgzY1tcXHVkZDEwLVxcdWRkMmVdfFxcdWQ4M2NbXFx1ZGQzMC1cXHVkZDY5XXxcXHVkODNjW1xcdWRkNzAtXFx1ZGQ5YV18XFx1ZDgzY1tcXHVkZGU2LVxcdWRlMDJdfFxcdWQ4M2NbXFx1ZGUxMC1cXHVkZTNhXXxcXHVkODNjW1xcdWRlNDAtXFx1ZGU0OF18XFx1ZDgzY1xcdWRlNTB8XFx1ZDgzY1xcdWRlNTF8W1xcdWQ4NDAtXFx1ZDg2OF1bXFx1ZGMwMC1cXHVkZmZmXXxcXHVkODY5W1xcdWRjMDAtXFx1ZGVkNl18XFx1ZDg2OVtcXHVkZjAwLVxcdWRmZmZdfFtcXHVkODZhLVxcdWQ4NmNdW1xcdWRjMDAtXFx1ZGZmZl18XFx1ZDg2ZFtcXHVkYzAwLVxcdWRmMzRdfFxcdWQ4NmRbXFx1ZGY0MC1cXHVkZmZmXXxcXHVkODZlW1xcdWRjMDAtXFx1ZGMxZF18XFx1ZDg2ZVtcXHVkYzIwLVxcdWRmZmZdfFtcXHVkODZmLVxcdWQ4NzJdW1xcdWRjMDAtXFx1ZGZmZl18XFx1ZDg3M1tcXHVkYzAwLVxcdWRlYTFdfFxcdWQ4N2VbXFx1ZGMwMC1cXHVkZTFkXXxbXFx1ZGI4MC1cXHVkYmJlXVtcXHVkYzAwLVxcdWRmZmZdfFxcdWRiYmZbXFx1ZGMwMC1cXHVkZmZkXXxbXFx1ZGJjMC1cXHVkYmZlXVtcXHVkYzAwLVxcdWRmZmZdfFxcdWRiZmZbXFx1ZGMwMC1cXHVkZmZkXScgK1xuXHRcdFx0Jyl8KCcgK1xuXHRcdFx0XHQnW1xcdTA1OTBcXHUwNWJlXFx1MDVjMFxcdTA1YzNcXHUwNWM2XFx1MDVjOC1cXHUwNWZmXFx1MDdjMC1cXHUwN2VhXFx1MDdmNFxcdTA3ZjVcXHUwN2ZhLVxcdTA4MTVcXHUwODFhXFx1MDgyNFxcdTA4MjhcXHUwODJlLVxcdTA4NThcXHUwODVjLVxcdTA4OWZcXHUyMDBmXFx1ZmIxZFxcdWZiMWYtXFx1ZmIyOFxcdWZiMmEtXFx1ZmI0ZlxcdTA2MDhcXHUwNjBiXFx1MDYwZFxcdTA2MWItXFx1MDY0YVxcdTA2NmQtXFx1MDY2ZlxcdTA2NzEtXFx1MDZkNVxcdTA2ZTVcXHUwNmU2XFx1MDZlZVxcdTA2ZWZcXHUwNmZhLVxcdTA3MTBcXHUwNzEyLVxcdTA3MmZcXHUwNzRiLVxcdTA3YTVcXHUwN2IxLVxcdTA3YmZcXHUwOGEwLVxcdTA4ZTJcXHVmYjUwLVxcdWZkM2RcXHVmZDQwLVxcdWZkY2ZcXHVmZGYwLVxcdWZkZmNcXHVmZGZlXFx1ZmRmZlxcdWZlNzAtXFx1ZmVmZV18XFx1ZDgwMltcXHVkYzAwLVxcdWRkMWVdfFxcdWQ4MDJbXFx1ZGQyMC1cXHVkZTAwXXxcXHVkODAyXFx1ZGUwNHxcXHVkODAyW1xcdWRlMDctXFx1ZGUwYl18XFx1ZDgwMltcXHVkZTEwLVxcdWRlMzddfFxcdWQ4MDJbXFx1ZGUzYi1cXHVkZTNlXXxcXHVkODAyW1xcdWRlNDAtXFx1ZGVlNF18XFx1ZDgwMltcXHVkZWU3LVxcdWRmMzhdfFxcdWQ4MDJbXFx1ZGY0MC1cXHVkZmZmXXxcXHVkODAzW1xcdWRjMDAtXFx1ZGU1Zl18XFx1ZDgwM1tcXHVkZTdmLVxcdWRmZmZdfFxcdWQ4M2FbXFx1ZGMwMC1cXHVkY2NmXXxcXHVkODNhW1xcdWRjZDctXFx1ZGZmZl18XFx1ZDgzYltcXHVkYzAwLVxcdWRkZmZdfFxcdWQ4M2JbXFx1ZGYwMC1cXHVkZmZmXXxcXHVkODNiW1xcdWRmMDAtXFx1ZGZmZl18XFx1ZDgzYltcXHVkZjAwLVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGYwMC1cXHVkZmZmXXxcXHVkODNiW1xcdWRmMDAtXFx1ZGZmZl18XFx1ZDgzYltcXHVkZjAwLVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGYwMC1cXHVkZmZmXXxcXHVkODNiW1xcdWRmMDAtXFx1ZGZmZl18XFx1ZDgzYltcXHVkZjAwLVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGYwMC1cXHVkZmZmXXxcXHVkODNiW1xcdWRmMDAtXFx1ZGZmZl18XFx1ZDgzYltcXHVkZjAwLVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGYwMC1cXHVkZmZmXXxcXHVkODNiW1xcdWRlMDAtXFx1ZGVlZl18XFx1ZDgzYltcXHVkZWYyLVxcdWRlZmZdJyArXG5cdFx0XHQnKScgK1xuXHRcdCcpJ1xuXHQpO1xuXG5cdC8qKlxuXHQgKiBHZXRzIGRpcmVjdGlvbmFsaXR5IG9mIHRoZSBmaXJzdCBzdHJvbmdseSBkaXJlY3Rpb25hbCBjb2RlcG9pbnRcblx0ICpcblx0ICogVGhpcyBpcyB0aGUgcnVsZSB0aGUgQklESSBhbGdvcml0aG0gdXNlcyB0byBkZXRlcm1pbmUgdGhlIGRpcmVjdGlvbmFsaXR5IG9mXG5cdCAqIHBhcmFncmFwaHMgKCBodHRwOi8vdW5pY29kZS5vcmcvcmVwb3J0cy90cjkvI1RoZV9QYXJhZ3JhcGhfTGV2ZWwgKSBhbmRcblx0ICogRlNJIGlzb2xhdGVzICggaHR0cDovL3VuaWNvZGUub3JnL3JlcG9ydHMvdHI5LyNFeHBsaWNpdF9EaXJlY3Rpb25hbF9Jc29sYXRlcyApLlxuXHQgKlxuXHQgKiBUT0RPOiBEb2VzIG5vdCBoYW5kbGUgQklESSBjb250cm9sIGNoYXJhY3RlcnMgaW5zaWRlIHRoZSB0ZXh0LlxuXHQgKiBUT0RPOiBEb2VzIG5vdCBoYW5kbGUgdW5hbGxvY2F0ZWQgY2hhcmFjdGVycy5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHRleHQgZnJvbSB3aGljaCB0byBleHRyYWN0IGluaXRpYWwgZGlyZWN0aW9uYWxpdHkuXG5cdCAqIEByZXR1cm4ge3N0cmluZ30gRGlyZWN0aW9uYWxpdHkgKGVpdGhlciAnbHRyJyBvciAncnRsJylcblx0ICovXG5cdGZ1bmN0aW9uIHN0cm9uZ0RpckZyb21Db250ZW50KCB0ZXh0ICkge1xuXHRcdHZhciBtID0gdGV4dC5tYXRjaCggc3Ryb25nRGlyUmVnRXhwICk7XG5cdFx0aWYgKCAhbSApIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0XHRpZiAoIG1bIDIgXSA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0cmV0dXJuICdsdHInO1xuXHRcdH1cblx0XHRyZXR1cm4gJ3J0bCc7XG5cdH1cblxuXHQkLmV4dGVuZCggJC5pMThuLnBhcnNlci5lbWl0dGVyLCB7XG5cdFx0LyoqXG5cdFx0ICogV3JhcHMgYXJndW1lbnQgd2l0aCB1bmljb2RlIGNvbnRyb2wgY2hhcmFjdGVycyBmb3IgZGlyZWN0aW9uYWxpdHkgc2FmZXR5XG5cdFx0ICpcblx0XHQgKiBUaGlzIHNvbHZlcyB0aGUgcHJvYmxlbSB3aGVyZSBkaXJlY3Rpb25hbGl0eS1uZXV0cmFsIGNoYXJhY3RlcnMgYXQgdGhlIGVkZ2Ugb2Zcblx0XHQgKiB0aGUgYXJndW1lbnQgc3RyaW5nIGdldCBpbnRlcnByZXRlZCB3aXRoIHRoZSB3cm9uZyBkaXJlY3Rpb25hbGl0eSBmcm9tIHRoZVxuXHRcdCAqIGVuY2xvc2luZyBjb250ZXh0LCBnaXZpbmcgcmVuZGVyaW5ncyB0aGF0IGxvb2sgY29ycnVwdGVkIGxpa2UgXCIoQmVuXyhXTUZcIi5cblx0XHQgKlxuXHRcdCAqIFRoZSB3cmFwcGluZyBpcyBMUkUuLi5QREYgb3IgUkxFLi4uUERGLCBkZXBlbmRpbmcgb24gdGhlIGRldGVjdGVkXG5cdFx0ICogZGlyZWN0aW9uYWxpdHkgb2YgdGhlIGFyZ3VtZW50IHN0cmluZywgdXNpbmcgdGhlIEJJREkgYWxnb3JpdGhtJ3Mgb3duIFwiRmlyc3Rcblx0XHQgKiBzdHJvbmcgZGlyZWN0aW9uYWwgY29kZXBvaW50XCIgcnVsZS4gRXNzZW50aWFsbHksIHRoaXMgd29ya3Mgcm91bmQgdGhlIGZhY3QgdGhhdFxuXHRcdCAqIHRoZXJlIGlzIG5vIGVtYmVkZGluZyBlcXVpdmFsZW50IG9mIFUrMjA2OCBGU0kgKGlzb2xhdGlvbiB3aXRoIGhldXJpc3RpY1xuXHRcdCAqIGRpcmVjdGlvbiBpbmZlcmVuY2UpLiBUaGUgbGF0dGVyIGlzIGNsZWFuZXIgYnV0IHN0aWxsIG5vdCB3aWRlbHkgc3VwcG9ydGVkLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmdbXX0gbm9kZXMgVGhlIHRleHQgbm9kZXMgZnJvbSB3aGljaCB0byB0YWtlIHRoZSBmaXJzdCBpdGVtLlxuXHRcdCAqIEByZXR1cm4ge3N0cmluZ30gV3JhcHBlZCBTdHJpbmcgb2YgY29udGVudCBhcyBuZWVkZWQuXG5cdFx0ICovXG5cdFx0YmlkaTogZnVuY3Rpb24gKCBub2RlcyApIHtcblx0XHRcdHZhciBkaXIgPSBzdHJvbmdEaXJGcm9tQ29udGVudCggbm9kZXNbIDAgXSApO1xuXHRcdFx0aWYgKCBkaXIgPT09ICdsdHInICkge1xuXHRcdFx0XHQvLyBXcmFwIGluIExFRlQtVE8tUklHSFQgRU1CRURESU5HIC4uLiBQT1AgRElSRUNUSU9OQUwgRk9STUFUVElOR1xuXHRcdFx0XHRyZXR1cm4gJ1xcdTIwMkEnICsgbm9kZXNbIDAgXSArICdcXHUyMDJDJztcblx0XHRcdH1cblx0XHRcdGlmICggZGlyID09PSAncnRsJyApIHtcblx0XHRcdFx0Ly8gV3JhcCBpbiBSSUdIVC1UTy1MRUZUIEVNQkVERElORyAuLi4gUE9QIERJUkVDVElPTkFMIEZPUk1BVFRJTkdcblx0XHRcdFx0cmV0dXJuICdcXHUyMDJCJyArIG5vZGVzWyAwIF0gKyAnXFx1MjAyQyc7XG5cdFx0XHR9XG5cdFx0XHQvLyBObyBzdHJvbmcgZGlyZWN0aW9uYWxpdHk6IGRvIG5vdCB3cmFwXG5cdFx0XHRyZXR1cm4gbm9kZXNbIDAgXTtcblx0XHR9XG5cdH0gKTtcbn0oIGpRdWVyeSApICk7XG4iLCIvKiFcbiAqIGpRdWVyeSBJbnRlcm5hdGlvbmFsaXphdGlvbiBsaWJyYXJ5XG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDExLTIwMTMgU2FudGhvc2ggVGhvdHRpbmdhbCwgTmVpbCBLYW5kYWxnYW9ua2FyXG4gKlxuICoganF1ZXJ5LmkxOG4gaXMgZHVhbCBsaWNlbnNlZCBHUEx2MiBvciBsYXRlciBhbmQgTUlULiBZb3UgZG9uJ3QgaGF2ZSB0byBkb1xuICogYW55dGhpbmcgc3BlY2lhbCB0byBjaG9vc2Ugb25lIGxpY2Vuc2Ugb3IgdGhlIG90aGVyIGFuZCB5b3UgZG9uJ3QgaGF2ZSB0b1xuICogbm90aWZ5IGFueW9uZSB3aGljaCBsaWNlbnNlIHlvdSBhcmUgdXNpbmcuIFlvdSBhcmUgZnJlZSB0byB1c2VcbiAqIFVuaXZlcnNhbExhbmd1YWdlU2VsZWN0b3IgaW4gY29tbWVyY2lhbCBwcm9qZWN0cyBhcyBsb25nIGFzIHRoZSBjb3B5cmlnaHRcbiAqIGhlYWRlciBpcyBsZWZ0IGludGFjdC4gU2VlIGZpbGVzIEdQTC1MSUNFTlNFIGFuZCBNSVQtTElDRU5TRSBmb3IgZGV0YWlscy5cbiAqXG4gKiBAbGljZW5jZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5jZSAyLjAgb3IgbGF0ZXJcbiAqIEBsaWNlbmNlIE1JVCBMaWNlbnNlXG4gKi9cblxuKCBmdW5jdGlvbiAoICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgTWVzc2FnZVBhcnNlckVtaXR0ZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5sYW5ndWFnZSA9ICQuaTE4bi5sYW5ndWFnZXNbIFN0cmluZy5sb2NhbGUgXSB8fCAkLmkxOG4ubGFuZ3VhZ2VzWyAnZGVmYXVsdCcgXTtcblx0fTtcblxuXHRNZXNzYWdlUGFyc2VyRW1pdHRlci5wcm90b3R5cGUgPSB7XG5cdFx0Y29uc3RydWN0b3I6IE1lc3NhZ2VQYXJzZXJFbWl0dGVyLFxuXG5cdFx0LyoqXG5cdFx0ICogKFdlIHB1dCB0aGlzIG1ldGhvZCBkZWZpbml0aW9uIGhlcmUsIGFuZCBub3QgaW4gcHJvdG90eXBlLCB0byBtYWtlXG5cdFx0ICogc3VyZSBpdCdzIG5vdCBvdmVyd3JpdHRlbiBieSBhbnkgbWFnaWMuKSBXYWxrIGVudGlyZSBub2RlIHN0cnVjdHVyZSxcblx0XHQgKiBhcHBseWluZyByZXBsYWNlbWVudHMgYW5kIHRlbXBsYXRlIGZ1bmN0aW9ucyB3aGVuIGFwcHJvcHJpYXRlXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge01peGVkfSBub2RlIGFic3RyYWN0IHN5bnRheCB0cmVlICh0b3Agbm9kZSBvciBzdWJub2RlKVxuXHRcdCAqIEBwYXJhbSB7QXJyYXl9IHJlcGxhY2VtZW50cyBmb3IgJDEsICQyLCAuLi4gJG5cblx0XHQgKiBAcmV0dXJuIHtNaXhlZH0gc2luZ2xlLXN0cmluZyBub2RlIG9yIGFycmF5IG9mIG5vZGVzIHN1aXRhYmxlIGZvclxuXHRcdCAqICBqUXVlcnkgYXBwZW5kaW5nLlxuXHRcdCAqL1xuXHRcdGVtaXQ6IGZ1bmN0aW9uICggbm9kZSwgcmVwbGFjZW1lbnRzICkge1xuXHRcdFx0dmFyIHJldCwgc3Vibm9kZXMsIG9wZXJhdGlvbixcblx0XHRcdFx0bWVzc2FnZVBhcnNlckVtaXR0ZXIgPSB0aGlzO1xuXG5cdFx0XHRzd2l0Y2ggKCB0eXBlb2Ygbm9kZSApIHtcblx0XHRcdFx0Y2FzZSAnc3RyaW5nJzpcblx0XHRcdFx0Y2FzZSAnbnVtYmVyJzpcblx0XHRcdFx0XHRyZXQgPSBub2RlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdvYmplY3QnOlxuXHRcdFx0XHQvLyBub2RlIGlzIGFuIGFycmF5IG9mIG5vZGVzXG5cdFx0XHRcdFx0c3Vibm9kZXMgPSAkLm1hcCggbm9kZS5zbGljZSggMSApLCBmdW5jdGlvbiAoIG4gKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbWVzc2FnZVBhcnNlckVtaXR0ZXIuZW1pdCggbiwgcmVwbGFjZW1lbnRzICk7XG5cdFx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdFx0b3BlcmF0aW9uID0gbm9kZVsgMCBdLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRcdFx0XHRpZiAoIHR5cGVvZiBtZXNzYWdlUGFyc2VyRW1pdHRlclsgb3BlcmF0aW9uIF0gPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdFx0XHRyZXQgPSBtZXNzYWdlUGFyc2VyRW1pdHRlclsgb3BlcmF0aW9uIF0oIHN1Ym5vZGVzLCByZXBsYWNlbWVudHMgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCAndW5rbm93biBvcGVyYXRpb24gXCInICsgb3BlcmF0aW9uICsgJ1wiJyApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICd1bmRlZmluZWQnOlxuXHRcdFx0XHQvLyBQYXJzaW5nIHRoZSBlbXB0eSBzdHJpbmcgKGFzIGFuIGVudGlyZSBleHByZXNzaW9uLCBvciBhcyBhXG5cdFx0XHRcdC8vIHBhcmFtRXhwcmVzc2lvbiBpbiBhIHRlbXBsYXRlKSByZXN1bHRzIGluIHVuZGVmaW5lZFxuXHRcdFx0XHQvLyBQZXJoYXBzIGEgbW9yZSBjbGV2ZXIgcGFyc2VyIGNhbiBkZXRlY3QgdGhpcywgYW5kIHJldHVybiB0aGVcblx0XHRcdFx0Ly8gZW1wdHkgc3RyaW5nPyBPciBpcyB0aGF0IHVzZWZ1bCBpbmZvcm1hdGlvbj9cblx0XHRcdFx0Ly8gVGhlIGxvZ2ljYWwgdGhpbmcgaXMgcHJvYmFibHkgdG8gcmV0dXJuIHRoZSBlbXB0eSBzdHJpbmcgaGVyZVxuXHRcdFx0XHQvLyB3aGVuIHdlIGVuY291bnRlciB1bmRlZmluZWQuXG5cdFx0XHRcdFx0cmV0ID0gJyc7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCAndW5leHBlY3RlZCB0eXBlIGluIEFTVDogJyArIHR5cGVvZiBub2RlICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXQ7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFBhcnNpbmcgaGFzIGJlZW4gYXBwbGllZCBkZXB0aC1maXJzdCB3ZSBjYW4gYXNzdW1lIHRoYXQgYWxsIG5vZGVzXG5cdFx0ICogaGVyZSBhcmUgc2luZ2xlIG5vZGVzIE11c3QgcmV0dXJuIGEgc2luZ2xlIG5vZGUgdG8gcGFyZW50cyAtLSBhXG5cdFx0ICogalF1ZXJ5IHdpdGggc3ludGhldGljIHNwYW4gSG93ZXZlciwgdW53cmFwIGFueSBvdGhlciBzeW50aGV0aWMgc3BhbnNcblx0XHQgKiBpbiBvdXIgY2hpbGRyZW4gYW5kIHBhc3MgdGhlbSB1cHdhcmRzXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge0FycmF5fSBub2RlcyBNaXhlZCwgc29tZSBzaW5nbGUgbm9kZXMsIHNvbWUgYXJyYXlzIG9mIG5vZGVzLlxuXHRcdCAqIEByZXR1cm4ge3N0cmluZ31cblx0XHQgKi9cblx0XHRjb25jYXQ6IGZ1bmN0aW9uICggbm9kZXMgKSB7XG5cdFx0XHR2YXIgcmVzdWx0ID0gJyc7XG5cblx0XHRcdCQuZWFjaCggbm9kZXMsIGZ1bmN0aW9uICggaSwgbm9kZSApIHtcblx0XHRcdFx0Ly8gc3RyaW5ncywgaW50ZWdlcnMsIGFueXRoaW5nIGVsc2Vcblx0XHRcdFx0cmVzdWx0ICs9IG5vZGU7XG5cdFx0XHR9ICk7XG5cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFJldHVybiBlc2NhcGVkIHJlcGxhY2VtZW50IG9mIGNvcnJlY3QgaW5kZXgsIG9yIHN0cmluZyBpZlxuXHRcdCAqIHVuYXZhaWxhYmxlLiBOb3RlIHRoYXQgd2UgZXhwZWN0IHRoZSBwYXJzZWQgcGFyYW1ldGVyIHRvIGJlXG5cdFx0ICogemVyby1iYXNlZC4gaS5lLiAkMSBzaG91bGQgaGF2ZSBiZWNvbWUgWyAwIF0uIGlmIHRoZSBzcGVjaWZpZWRcblx0XHQgKiBwYXJhbWV0ZXIgaXMgbm90IGZvdW5kIHJldHVybiB0aGUgc2FtZSBzdHJpbmcgKGUuZy4gXCIkOTlcIiAtPlxuXHRcdCAqIHBhcmFtZXRlciA5OCAtPiBub3QgZm91bmQgLT4gcmV0dXJuIFwiJDk5XCIgKSBUT0RPIHRocm93IGVycm9yIGlmXG5cdFx0ICogbm9kZXMubGVuZ3RoID4gMSA/XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge0FycmF5fSBub2RlcyBPbmUgZWxlbWVudCwgaW50ZWdlciwgbiA+PSAwXG5cdFx0ICogQHBhcmFtIHtBcnJheX0gcmVwbGFjZW1lbnRzIGZvciAkMSwgJDIsIC4uLiAkblxuXHRcdCAqIEByZXR1cm4ge3N0cmluZ30gcmVwbGFjZW1lbnRcblx0XHQgKi9cblx0XHRyZXBsYWNlOiBmdW5jdGlvbiAoIG5vZGVzLCByZXBsYWNlbWVudHMgKSB7XG5cdFx0XHR2YXIgaW5kZXggPSBwYXJzZUludCggbm9kZXNbIDAgXSwgMTAgKTtcblxuXHRcdFx0aWYgKCBpbmRleCA8IHJlcGxhY2VtZW50cy5sZW5ndGggKSB7XG5cdFx0XHRcdC8vIHJlcGxhY2VtZW50IGlzIG5vdCBhIHN0cmluZywgZG9uJ3QgdG91Y2ghXG5cdFx0XHRcdHJldHVybiByZXBsYWNlbWVudHNbIGluZGV4IF07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBpbmRleCBub3QgZm91bmQsIGZhbGxiYWNrIHRvIGRpc3BsYXlpbmcgdmFyaWFibGVcblx0XHRcdFx0cmV0dXJuICckJyArICggaW5kZXggKyAxICk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFRyYW5zZm9ybSBwYXJzZWQgc3RydWN0dXJlIGludG8gcGx1cmFsaXphdGlvbiBuLmIuIFRoZSBmaXJzdCBub2RlIG1heVxuXHRcdCAqIGJlIGEgbm9uLWludGVnZXIgKGZvciBpbnN0YW5jZSwgYSBzdHJpbmcgcmVwcmVzZW50aW5nIGFuIEFyYWJpY1xuXHRcdCAqIG51bWJlcikuIFNvIGNvbnZlcnQgaXQgYmFjayB3aXRoIHRoZSBjdXJyZW50IGxhbmd1YWdlJ3Ncblx0XHQgKiBjb252ZXJ0TnVtYmVyLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtBcnJheX0gbm9kZXMgTGlzdCBbIHtTdHJpbmd8TnVtYmVyfSwge1N0cmluZ30sIHtTdHJpbmd9IC4uLiBdXG5cdFx0ICogQHJldHVybiB7c3RyaW5nfSBzZWxlY3RlZCBwbHVyYWxpemVkIGZvcm0gYWNjb3JkaW5nIHRvIGN1cnJlbnRcblx0XHQgKiAgbGFuZ3VhZ2UuXG5cdFx0ICovXG5cdFx0cGx1cmFsOiBmdW5jdGlvbiAoIG5vZGVzICkge1xuXHRcdFx0dmFyIGNvdW50ID0gcGFyc2VGbG9hdCggdGhpcy5sYW5ndWFnZS5jb252ZXJ0TnVtYmVyKCBub2Rlc1sgMCBdLCAxMCApICksXG5cdFx0XHRcdGZvcm1zID0gbm9kZXMuc2xpY2UoIDEgKTtcblxuXHRcdFx0cmV0dXJuIGZvcm1zLmxlbmd0aCA/IHRoaXMubGFuZ3VhZ2UuY29udmVydFBsdXJhbCggY291bnQsIGZvcm1zICkgOiAnJztcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogVHJhbnNmb3JtIHBhcnNlZCBzdHJ1Y3R1cmUgaW50byBnZW5kZXIgVXNhZ2Vcblx0XHQgKiB7e2dlbmRlcjpnZW5kZXJ8bWFzY3VsaW5lfGZlbWluaW5lfG5ldXRyYWx9fS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7QXJyYXl9IG5vZGVzIExpc3QgWyB7U3RyaW5nfSwge1N0cmluZ30sIHtTdHJpbmd9ICwge1N0cmluZ30gXVxuXHRcdCAqIEByZXR1cm4ge3N0cmluZ30gc2VsZWN0ZWQgZ2VuZGVyIGZvcm0gYWNjb3JkaW5nIHRvIGN1cnJlbnQgbGFuZ3VhZ2Vcblx0XHQgKi9cblx0XHRnZW5kZXI6IGZ1bmN0aW9uICggbm9kZXMgKSB7XG5cdFx0XHR2YXIgZ2VuZGVyID0gbm9kZXNbIDAgXSxcblx0XHRcdFx0Zm9ybXMgPSBub2Rlcy5zbGljZSggMSApO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5sYW5ndWFnZS5nZW5kZXIoIGdlbmRlciwgZm9ybXMgKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogVHJhbnNmb3JtIHBhcnNlZCBzdHJ1Y3R1cmUgaW50byBncmFtbWFyIGNvbnZlcnNpb24uIEludm9rZWQgYnlcblx0XHQgKiBwdXR0aW5nIHt7Z3JhbW1hcjpmb3JtfHdvcmR9fSBpbiBhIG1lc3NhZ2Vcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7QXJyYXl9IG5vZGVzIExpc3QgW3tHcmFtbWFyIGNhc2UgZWc6IGdlbml0aXZlfSwge1N0cmluZyB3b3JkfV1cblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd9IHNlbGVjdGVkIGdyYW1tYXRpY2FsIGZvcm0gYWNjb3JkaW5nIHRvIGN1cnJlbnRcblx0XHQgKiAgbGFuZ3VhZ2UuXG5cdFx0ICovXG5cdFx0Z3JhbW1hcjogZnVuY3Rpb24gKCBub2RlcyApIHtcblx0XHRcdHZhciBmb3JtID0gbm9kZXNbIDAgXSxcblx0XHRcdFx0d29yZCA9IG5vZGVzWyAxIF07XG5cblx0XHRcdHJldHVybiB3b3JkICYmIGZvcm0gJiYgdGhpcy5sYW5ndWFnZS5jb252ZXJ0R3JhbW1hciggd29yZCwgZm9ybSApO1xuXHRcdH1cblx0fTtcblxuXHQkLmV4dGVuZCggJC5pMThuLnBhcnNlci5lbWl0dGVyLCBuZXcgTWVzc2FnZVBhcnNlckVtaXR0ZXIoKSApO1xufSggalF1ZXJ5ICkgKTtcbiIsIi8qIVxuICogalF1ZXJ5IEludGVybmF0aW9uYWxpemF0aW9uIGxpYnJhcnlcbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTIgU2FudGhvc2ggVGhvdHRpbmdhbFxuICpcbiAqIGpxdWVyeS5pMThuIGlzIGR1YWwgbGljZW5zZWQgR1BMdjIgb3IgbGF0ZXIgYW5kIE1JVC4gWW91IGRvbid0IGhhdmUgdG8gZG8gYW55dGhpbmcgc3BlY2lhbCB0b1xuICogY2hvb3NlIG9uZSBsaWNlbnNlIG9yIHRoZSBvdGhlciBhbmQgeW91IGRvbid0IGhhdmUgdG8gbm90aWZ5IGFueW9uZSB3aGljaCBsaWNlbnNlIHlvdSBhcmUgdXNpbmcuXG4gKiBZb3UgYXJlIGZyZWUgdG8gdXNlIFVuaXZlcnNhbExhbmd1YWdlU2VsZWN0b3IgaW4gY29tbWVyY2lhbCBwcm9qZWN0cyBhcyBsb25nIGFzIHRoZSBjb3B5cmlnaHRcbiAqIGhlYWRlciBpcyBsZWZ0IGludGFjdC4gU2VlIGZpbGVzIEdQTC1MSUNFTlNFIGFuZCBNSVQtTElDRU5TRSBmb3IgZGV0YWlscy5cbiAqXG4gKiBAbGljZW5jZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5jZSAyLjAgb3IgbGF0ZXJcbiAqIEBsaWNlbmNlIE1JVCBMaWNlbnNlXG4gKi9cbiggZnVuY3Rpb24gKCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0JC5pMThuID0gJC5pMThuIHx8IHt9O1xuXHQkLmV4dGVuZCggJC5pMThuLmZhbGxiYWNrcywge1xuXHRcdGFiOiBbICdydScgXSxcblx0XHRhY2U6IFsgJ2lkJyBdLFxuXHRcdGFsbjogWyAnc3EnIF0sXG5cdFx0Ly8gTm90IHNvIHN0YW5kYXJkIC0gYWxzIGlzIHN1cHBvc2VkIHRvIGJlIFRvc2sgQWxiYW5pYW4sXG5cdFx0Ly8gYnV0IGluIFdpa2lwZWRpYSBpdCdzIHVzZWQgZm9yIGEgR2VybWFuaWMgbGFuZ3VhZ2UuXG5cdFx0YWxzOiBbICdnc3cnLCAnZGUnIF0sXG5cdFx0YW46IFsgJ2VzJyBdLFxuXHRcdGFucDogWyAnaGknIF0sXG5cdFx0YXJuOiBbICdlcycgXSxcblx0XHRhcno6IFsgJ2FyJyBdLFxuXHRcdGF2OiBbICdydScgXSxcblx0XHRheTogWyAnZXMnIF0sXG5cdFx0YmE6IFsgJ3J1JyBdLFxuXHRcdGJhcjogWyAnZGUnIF0sXG5cdFx0J2JhdC1zbWcnOiBbICdzZ3MnLCAnbHQnIF0sXG5cdFx0YmNjOiBbICdmYScgXSxcblx0XHQnYmUteC1vbGQnOiBbICdiZS10YXJhc2snIF0sXG5cdFx0Ymg6IFsgJ2JobycgXSxcblx0XHRiam46IFsgJ2lkJyBdLFxuXHRcdGJtOiBbICdmcicgXSxcblx0XHRicHk6IFsgJ2JuJyBdLFxuXHRcdGJxaTogWyAnZmEnIF0sXG5cdFx0YnVnOiBbICdpZCcgXSxcblx0XHQnY2JrLXphbSc6IFsgJ2VzJyBdLFxuXHRcdGNlOiBbICdydScgXSxcblx0XHRjcmg6IFsgJ2NyaC1sYXRuJyBdLFxuXHRcdCdjcmgtY3lybCc6IFsgJ3J1JyBdLFxuXHRcdGNzYjogWyAncGwnIF0sXG5cdFx0Y3Y6IFsgJ3J1JyBdLFxuXHRcdCdkZS1hdCc6IFsgJ2RlJyBdLFxuXHRcdCdkZS1jaCc6IFsgJ2RlJyBdLFxuXHRcdCdkZS1mb3JtYWwnOiBbICdkZScgXSxcblx0XHRkc2I6IFsgJ2RlJyBdLFxuXHRcdGR0cDogWyAnbXMnIF0sXG5cdFx0ZWdsOiBbICdpdCcgXSxcblx0XHRlbWw6IFsgJ2l0JyBdLFxuXHRcdGZmOiBbICdmcicgXSxcblx0XHRmaXQ6IFsgJ2ZpJyBdLFxuXHRcdCdmaXUtdnJvJzogWyAndnJvJywgJ2V0JyBdLFxuXHRcdGZyYzogWyAnZnInIF0sXG5cdFx0ZnJwOiBbICdmcicgXSxcblx0XHRmcnI6IFsgJ2RlJyBdLFxuXHRcdGZ1cjogWyAnaXQnIF0sXG5cdFx0Z2FnOiBbICd0cicgXSxcblx0XHRnYW46IFsgJ2dhbi1oYW50JywgJ3poLWhhbnQnLCAnemgtaGFucycgXSxcblx0XHQnZ2FuLWhhbnMnOiBbICd6aC1oYW5zJyBdLFxuXHRcdCdnYW4taGFudCc6IFsgJ3poLWhhbnQnLCAnemgtaGFucycgXSxcblx0XHRnbDogWyAncHQnIF0sXG5cdFx0Z2xrOiBbICdmYScgXSxcblx0XHRnbjogWyAnZXMnIF0sXG5cdFx0Z3N3OiBbICdkZScgXSxcblx0XHRoaWY6IFsgJ2hpZi1sYXRuJyBdLFxuXHRcdGhzYjogWyAnZGUnIF0sXG5cdFx0aHQ6IFsgJ2ZyJyBdLFxuXHRcdGlpOiBbICd6aC1jbicsICd6aC1oYW5zJyBdLFxuXHRcdGluaDogWyAncnUnIF0sXG5cdFx0aXU6IFsgJ2lrZS1jYW5zJyBdLFxuXHRcdGp1dDogWyAnZGEnIF0sXG5cdFx0anY6IFsgJ2lkJyBdLFxuXHRcdGthYTogWyAna2stbGF0bicsICdray1jeXJsJyBdLFxuXHRcdGtiZDogWyAna2JkLWN5cmwnIF0sXG5cdFx0a2h3OiBbICd1cicgXSxcblx0XHRraXU6IFsgJ3RyJyBdLFxuXHRcdGtrOiBbICdray1jeXJsJyBdLFxuXHRcdCdray1hcmFiJzogWyAna2stY3lybCcgXSxcblx0XHQna2stbGF0bic6IFsgJ2trLWN5cmwnIF0sXG5cdFx0J2trLWNuJzogWyAna2stYXJhYicsICdray1jeXJsJyBdLFxuXHRcdCdray1reic6IFsgJ2trLWN5cmwnIF0sXG5cdFx0J2trLXRyJzogWyAna2stbGF0bicsICdray1jeXJsJyBdLFxuXHRcdGtsOiBbICdkYScgXSxcblx0XHQna28ta3AnOiBbICdrbycgXSxcblx0XHRrb2k6IFsgJ3J1JyBdLFxuXHRcdGtyYzogWyAncnUnIF0sXG5cdFx0a3M6IFsgJ2tzLWFyYWInIF0sXG5cdFx0a3NoOiBbICdkZScgXSxcblx0XHRrdTogWyAna3UtbGF0bicgXSxcblx0XHQna3UtYXJhYic6IFsgJ2NrYicgXSxcblx0XHRrdjogWyAncnUnIF0sXG5cdFx0bGFkOiBbICdlcycgXSxcblx0XHRsYjogWyAnZGUnIF0sXG5cdFx0bGJlOiBbICdydScgXSxcblx0XHRsZXo6IFsgJ3J1JyBdLFxuXHRcdGxpOiBbICdubCcgXSxcblx0XHRsaWo6IFsgJ2l0JyBdLFxuXHRcdGxpdjogWyAnZXQnIF0sXG5cdFx0bG1vOiBbICdpdCcgXSxcblx0XHRsbjogWyAnZnInIF0sXG5cdFx0bHRnOiBbICdsdicgXSxcblx0XHRseno6IFsgJ3RyJyBdLFxuXHRcdG1haTogWyAnaGknIF0sXG5cdFx0J21hcC1ibXMnOiBbICdqdicsICdpZCcgXSxcblx0XHRtZzogWyAnZnInIF0sXG5cdFx0bWhyOiBbICdydScgXSxcblx0XHRtaW46IFsgJ2lkJyBdLFxuXHRcdG1vOiBbICdybycgXSxcblx0XHRtcmo6IFsgJ3J1JyBdLFxuXHRcdG13bDogWyAncHQnIF0sXG5cdFx0bXl2OiBbICdydScgXSxcblx0XHRtem46IFsgJ2ZhJyBdLFxuXHRcdG5haDogWyAnZXMnIF0sXG5cdFx0bmFwOiBbICdpdCcgXSxcblx0XHRuZHM6IFsgJ2RlJyBdLFxuXHRcdCduZHMtbmwnOiBbICdubCcgXSxcblx0XHQnbmwtaW5mb3JtYWwnOiBbICdubCcgXSxcblx0XHRubzogWyAnbmInIF0sXG5cdFx0b3M6IFsgJ3J1JyBdLFxuXHRcdHBjZDogWyAnZnInIF0sXG5cdFx0cGRjOiBbICdkZScgXSxcblx0XHRwZHQ6IFsgJ2RlJyBdLFxuXHRcdHBmbDogWyAnZGUnIF0sXG5cdFx0cG1zOiBbICdpdCcgXSxcblx0XHRwdDogWyAncHQtYnInIF0sXG5cdFx0J3B0LWJyJzogWyAncHQnIF0sXG5cdFx0cXU6IFsgJ2VzJyBdLFxuXHRcdHF1ZzogWyAncXUnLCAnZXMnIF0sXG5cdFx0cmduOiBbICdpdCcgXSxcblx0XHRybXk6IFsgJ3JvJyBdLFxuXHRcdCdyb2EtcnVwJzogWyAncnVwJyBdLFxuXHRcdHJ1ZTogWyAndWsnLCAncnUnIF0sXG5cdFx0cnVxOiBbICdydXEtbGF0bicsICdybycgXSxcblx0XHQncnVxLWN5cmwnOiBbICdtaycgXSxcblx0XHQncnVxLWxhdG4nOiBbICdybycgXSxcblx0XHRzYTogWyAnaGknIF0sXG5cdFx0c2FoOiBbICdydScgXSxcblx0XHRzY246IFsgJ2l0JyBdLFxuXHRcdHNnOiBbICdmcicgXSxcblx0XHRzZ3M6IFsgJ2x0JyBdLFxuXHRcdHNsaTogWyAnZGUnIF0sXG5cdFx0c3I6IFsgJ3NyLWVjJyBdLFxuXHRcdHNybjogWyAnbmwnIF0sXG5cdFx0c3RxOiBbICdkZScgXSxcblx0XHRzdTogWyAnaWQnIF0sXG5cdFx0c3psOiBbICdwbCcgXSxcblx0XHR0Y3k6IFsgJ2tuJyBdLFxuXHRcdHRnOiBbICd0Zy1jeXJsJyBdLFxuXHRcdHR0OiBbICd0dC1jeXJsJywgJ3J1JyBdLFxuXHRcdCd0dC1jeXJsJzogWyAncnUnIF0sXG5cdFx0dHk6IFsgJ2ZyJyBdLFxuXHRcdHVkbTogWyAncnUnIF0sXG5cdFx0dWc6IFsgJ3VnLWFyYWInIF0sXG5cdFx0dWs6IFsgJ3J1JyBdLFxuXHRcdHZlYzogWyAnaXQnIF0sXG5cdFx0dmVwOiBbICdldCcgXSxcblx0XHR2bHM6IFsgJ25sJyBdLFxuXHRcdHZtZjogWyAnZGUnIF0sXG5cdFx0dm90OiBbICdmaScgXSxcblx0XHR2cm86IFsgJ2V0JyBdLFxuXHRcdHdhOiBbICdmcicgXSxcblx0XHR3bzogWyAnZnInIF0sXG5cdFx0d3V1OiBbICd6aC1oYW5zJyBdLFxuXHRcdHhhbDogWyAncnUnIF0sXG5cdFx0eG1mOiBbICdrYScgXSxcblx0XHR5aTogWyAnaGUnIF0sXG5cdFx0emE6IFsgJ3poLWhhbnMnIF0sXG5cdFx0emVhOiBbICdubCcgXSxcblx0XHR6aDogWyAnemgtaGFucycgXSxcblx0XHQnemgtY2xhc3NpY2FsJzogWyAnbHpoJyBdLFxuXHRcdCd6aC1jbic6IFsgJ3poLWhhbnMnIF0sXG5cdFx0J3poLWhhbnQnOiBbICd6aC1oYW5zJyBdLFxuXHRcdCd6aC1oayc6IFsgJ3poLWhhbnQnLCAnemgtaGFucycgXSxcblx0XHQnemgtbWluLW5hbic6IFsgJ25hbicgXSxcblx0XHQnemgtbW8nOiBbICd6aC1oaycsICd6aC1oYW50JywgJ3poLWhhbnMnIF0sXG5cdFx0J3poLW15JzogWyAnemgtc2cnLCAnemgtaGFucycgXSxcblx0XHQnemgtc2cnOiBbICd6aC1oYW5zJyBdLFxuXHRcdCd6aC10dyc6IFsgJ3poLWhhbnQnLCAnemgtaGFucycgXSxcblx0XHQnemgteXVlJzogWyAneXVlJyBdXG5cdH0gKTtcbn0oIGpRdWVyeSApICk7XG4iLCIvKiFcbiAqIGpRdWVyeSBJbnRlcm5hdGlvbmFsaXphdGlvbiBsaWJyYXJ5XG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDEyIFNhbnRob3NoIFRob3R0aW5nYWxcbiAqXG4gKiBqcXVlcnkuaTE4biBpcyBkdWFsIGxpY2Vuc2VkIEdQTHYyIG9yIGxhdGVyIGFuZCBNSVQuIFlvdSBkb24ndCBoYXZlIHRvIGRvXG4gKiBhbnl0aGluZyBzcGVjaWFsIHRvIGNob29zZSBvbmUgbGljZW5zZSBvciB0aGUgb3RoZXIgYW5kIHlvdSBkb24ndCBoYXZlIHRvXG4gKiBub3RpZnkgYW55b25lIHdoaWNoIGxpY2Vuc2UgeW91IGFyZSB1c2luZy4gWW91IGFyZSBmcmVlIHRvIHVzZVxuICogVW5pdmVyc2FsTGFuZ3VhZ2VTZWxlY3RvciBpbiBjb21tZXJjaWFsIHByb2plY3RzIGFzIGxvbmcgYXMgdGhlIGNvcHlyaWdodFxuICogaGVhZGVyIGlzIGxlZnQgaW50YWN0LiBTZWUgZmlsZXMgR1BMLUxJQ0VOU0UgYW5kIE1JVC1MSUNFTlNFIGZvciBkZXRhaWxzLlxuICpcbiAqIEBsaWNlbmNlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbmNlIDIuMCBvciBsYXRlclxuICogQGxpY2VuY2UgTUlUIExpY2Vuc2VcbiAqL1xuXG4oIGZ1bmN0aW9uICggJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBJMThOLFxuXHRcdHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXHQvKipcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG5cdCAqL1xuXHRJMThOID0gZnVuY3Rpb24gKCBvcHRpb25zICkge1xuXHRcdC8vIExvYWQgZGVmYXVsdHNcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCgge30sIEkxOE4uZGVmYXVsdHMsIG9wdGlvbnMgKTtcblxuXHRcdHRoaXMucGFyc2VyID0gdGhpcy5vcHRpb25zLnBhcnNlcjtcblx0XHR0aGlzLmxvY2FsZSA9IHRoaXMub3B0aW9ucy5sb2NhbGU7XG5cdFx0dGhpcy5tZXNzYWdlU3RvcmUgPSB0aGlzLm9wdGlvbnMubWVzc2FnZVN0b3JlO1xuXHRcdHRoaXMubGFuZ3VhZ2VzID0ge307XG5cdH07XG5cblx0STE4Ti5wcm90b3R5cGUgPSB7XG5cdFx0LyoqXG5cdFx0ICogTG9jYWxpemUgYSBnaXZlbiBtZXNzYWdlS2V5IHRvIGEgbG9jYWxlLlxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlS2V5XG5cdFx0ICogQHJldHVybiB7U3RyaW5nfSBMb2NhbGl6ZWQgbWVzc2FnZVxuXHRcdCAqL1xuXHRcdGxvY2FsaXplOiBmdW5jdGlvbiAoIG1lc3NhZ2VLZXkgKSB7XG5cdFx0XHR2YXIgbG9jYWxlUGFydHMsIGxvY2FsZVBhcnRJbmRleCwgbG9jYWxlLCBmYWxsYmFja0luZGV4LFxuXHRcdFx0XHR0cnlpbmdMb2NhbGUsIG1lc3NhZ2U7XG5cblx0XHRcdGxvY2FsZSA9IHRoaXMubG9jYWxlO1xuXHRcdFx0ZmFsbGJhY2tJbmRleCA9IDA7XG5cblx0XHRcdHdoaWxlICggbG9jYWxlICkge1xuXHRcdFx0XHQvLyBJdGVyYXRlIHRocm91Z2ggbG9jYWxlcyBzdGFydGluZyBhdCBtb3N0LXNwZWNpZmljIHVudGlsXG5cdFx0XHRcdC8vIGxvY2FsaXphdGlvbiBpcyBmb3VuZC4gQXMgaW4gZmktTGF0bi1GSSwgZmktTGF0biBhbmQgZmkuXG5cdFx0XHRcdGxvY2FsZVBhcnRzID0gbG9jYWxlLnNwbGl0KCAnLScgKTtcblx0XHRcdFx0bG9jYWxlUGFydEluZGV4ID0gbG9jYWxlUGFydHMubGVuZ3RoO1xuXG5cdFx0XHRcdGRvIHtcblx0XHRcdFx0XHR0cnlpbmdMb2NhbGUgPSBsb2NhbGVQYXJ0cy5zbGljZSggMCwgbG9jYWxlUGFydEluZGV4ICkuam9pbiggJy0nICk7XG5cdFx0XHRcdFx0bWVzc2FnZSA9IHRoaXMubWVzc2FnZVN0b3JlLmdldCggdHJ5aW5nTG9jYWxlLCBtZXNzYWdlS2V5ICk7XG5cblx0XHRcdFx0XHRpZiAoIG1lc3NhZ2UgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbWVzc2FnZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRsb2NhbGVQYXJ0SW5kZXgtLTtcblx0XHRcdFx0fSB3aGlsZSAoIGxvY2FsZVBhcnRJbmRleCApO1xuXG5cdFx0XHRcdGlmICggbG9jYWxlID09PSAnZW4nICkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bG9jYWxlID0gKCAkLmkxOG4uZmFsbGJhY2tzWyB0aGlzLmxvY2FsZSBdICYmXG5cdFx0XHRcdFx0XHQkLmkxOG4uZmFsbGJhY2tzWyB0aGlzLmxvY2FsZSBdWyBmYWxsYmFja0luZGV4IF0gKSB8fFxuXHRcdFx0XHRcdFx0dGhpcy5vcHRpb25zLmZhbGxiYWNrTG9jYWxlO1xuXHRcdFx0XHQkLmkxOG4ubG9nKCAnVHJ5aW5nIGZhbGxiYWNrIGxvY2FsZSBmb3IgJyArIHRoaXMubG9jYWxlICsgJzogJyArIGxvY2FsZSArICcgKCcgKyBtZXNzYWdlS2V5ICsgJyknICk7XG5cblx0XHRcdFx0ZmFsbGJhY2tJbmRleCsrO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBrZXkgbm90IGZvdW5kXG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fSxcblxuXHRcdC8qXG5cdFx0ICogRGVzdHJveSB0aGUgaTE4biBpbnN0YW5jZS5cblx0XHQgKi9cblx0XHRkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHQkLnJlbW92ZURhdGEoIGRvY3VtZW50LCAnaTE4bicgKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogR2VuZXJhbCBtZXNzYWdlIGxvYWRpbmcgQVBJIFRoaXMgY2FuIHRha2UgYSBVUkwgc3RyaW5nIGZvclxuXHRcdCAqIHRoZSBqc29uIGZvcm1hdHRlZCBtZXNzYWdlcy4gRXhhbXBsZTpcblx0XHQgKiA8Y29kZT5sb2FkKCdwYXRoL3RvL2FsbF9sb2NhbGl6YXRpb25zLmpzb24nKTs8L2NvZGU+XG5cdFx0ICpcblx0XHQgKiBUbyBsb2FkIGEgbG9jYWxpemF0aW9uIGZpbGUgZm9yIGEgbG9jYWxlOlxuXHRcdCAqIDxjb2RlPlxuXHRcdCAqIGxvYWQoJ3BhdGgvdG8vZGUtbWVzc2FnZXMuanNvbicsICdkZScgKTtcblx0XHQgKiA8L2NvZGU+XG5cdFx0ICpcblx0XHQgKiBUbyBsb2FkIGEgbG9jYWxpemF0aW9uIGZpbGUgZnJvbSBhIGRpcmVjdG9yeTpcblx0XHQgKiA8Y29kZT5cblx0XHQgKiBsb2FkKCdwYXRoL3RvL2kxOG4vZGlyZWN0b3J5JywgJ2RlJyApO1xuXHRcdCAqIDwvY29kZT5cblx0XHQgKiBUaGUgYWJvdmUgbWV0aG9kIGhhcyB0aGUgYWR2YW50YWdlIG9mIGZhbGxiYWNrIHJlc29sdXRpb24uXG5cdFx0ICogaWUsIGl0IHdpbGwgYXV0b21hdGljYWxseSBsb2FkIHRoZSBmYWxsYmFjayBsb2NhbGVzIGZvciBkZS5cblx0XHQgKiBGb3IgbW9zdCB1c2VjYXNlcywgdGhpcyBpcyB0aGUgcmVjb21tZW5kZWQgbWV0aG9kLlxuXHRcdCAqIEl0IGlzIG9wdGlvbmFsIHRvIGhhdmUgdHJhaWxpbmcgc2xhc2ggYXQgZW5kLlxuXHRcdCAqXG5cdFx0ICogQSBkYXRhIG9iamVjdCBjb250YWluaW5nIG1lc3NhZ2Uga2V5LSBtZXNzYWdlIHRyYW5zbGF0aW9uIG1hcHBpbmdzXG5cdFx0ICogY2FuIGFsc28gYmUgcGFzc2VkLiBFeGFtcGxlOlxuXHRcdCAqIDxjb2RlPlxuXHRcdCAqIGxvYWQoIHsgJ2hlbGxvJyA6ICdIZWxsbycgfSwgb3B0aW9uYWxMb2NhbGUgKTtcblx0XHQgKiA8L2NvZGU+XG5cdFx0ICpcblx0XHQgKiBBIHNvdXJjZSBtYXAgY29udGFpbmluZyBrZXktdmFsdWUgcGFpciBvZiBsYW5ndWFnZW5hbWUgYW5kIGxvY2F0aW9uc1xuXHRcdCAqIGNhbiBhbHNvIGJlIHBhc3NlZC4gRXhhbXBsZTpcblx0XHQgKiA8Y29kZT5cblx0XHQgKiBsb2FkKCB7XG5cdFx0ICogYm46ICdpMThuL2JuLmpzb24nLFxuXHRcdCAqIGhlOiAnaTE4bi9oZS5qc29uJyxcblx0XHQgKiBlbjogJ2kxOG4vZW4uanNvbidcblx0XHQgKiB9IClcblx0XHQgKiA8L2NvZGU+XG5cdFx0ICpcblx0XHQgKiBJZiB0aGUgZGF0YSBhcmd1bWVudCBpcyBudWxsL3VuZGVmaW5lZC9mYWxzZSxcblx0XHQgKiBhbGwgY2FjaGVkIG1lc3NhZ2VzIGZvciB0aGUgaTE4biBpbnN0YW5jZSB3aWxsIGdldCByZXNldC5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfE9iamVjdH0gc291cmNlXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGxvY2FsZSBMYW5ndWFnZSB0YWdcblx0XHQgKiBAcmV0dXJuIHtqUXVlcnkuUHJvbWlzZX1cblx0XHQgKi9cblx0XHRsb2FkOiBmdW5jdGlvbiAoIHNvdXJjZSwgbG9jYWxlICkge1xuXHRcdFx0dmFyIGZhbGxiYWNrTG9jYWxlcywgbG9jSW5kZXgsIGZhbGxiYWNrTG9jYWxlLCBzb3VyY2VNYXAgPSB7fTtcblx0XHRcdGlmICggIXNvdXJjZSAmJiAhbG9jYWxlICkge1xuXHRcdFx0XHRzb3VyY2UgPSAnaTE4bi8nICsgJC5pMThuKCkubG9jYWxlICsgJy5qc29uJztcblx0XHRcdFx0bG9jYWxlID0gJC5pMThuKCkubG9jYWxlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCB0eXBlb2Ygc291cmNlID09PSAnc3RyaW5nJyAmJlxuXHRcdFx0XHQvLyBzb3VyY2UgZXh0ZW5zaW9uIHNob3VsZCBiZSBqc29uLCBidXQgY2FuIGhhdmUgcXVlcnkgcGFyYW1zIGFmdGVyIHRoYXQuXG5cdFx0XHRcdHNvdXJjZS5zcGxpdCggJz8nIClbIDAgXS5zcGxpdCggJy4nICkucG9wKCkgIT09ICdqc29uJ1xuXHRcdFx0KSB7XG5cdFx0XHRcdC8vIExvYWQgc3BlY2lmaWVkIGxvY2FsZSB0aGVuIGNoZWNrIGZvciBmYWxsYmFja3Mgd2hlbiBkaXJlY3RvcnkgaXNcblx0XHRcdFx0Ly8gc3BlY2lmaWVkIGluIGxvYWQoKVxuXHRcdFx0XHRzb3VyY2VNYXBbIGxvY2FsZSBdID0gc291cmNlICsgJy8nICsgbG9jYWxlICsgJy5qc29uJztcblx0XHRcdFx0ZmFsbGJhY2tMb2NhbGVzID0gKCAkLmkxOG4uZmFsbGJhY2tzWyBsb2NhbGUgXSB8fCBbXSApXG5cdFx0XHRcdFx0LmNvbmNhdCggdGhpcy5vcHRpb25zLmZhbGxiYWNrTG9jYWxlICk7XG5cdFx0XHRcdGZvciAoIGxvY0luZGV4ID0gMDsgbG9jSW5kZXggPCBmYWxsYmFja0xvY2FsZXMubGVuZ3RoOyBsb2NJbmRleCsrICkge1xuXHRcdFx0XHRcdGZhbGxiYWNrTG9jYWxlID0gZmFsbGJhY2tMb2NhbGVzWyBsb2NJbmRleCBdO1xuXHRcdFx0XHRcdHNvdXJjZU1hcFsgZmFsbGJhY2tMb2NhbGUgXSA9IHNvdXJjZSArICcvJyArIGZhbGxiYWNrTG9jYWxlICsgJy5qc29uJztcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5sb2FkKCBzb3VyY2VNYXAgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLm1lc3NhZ2VTdG9yZS5sb2FkKCBzb3VyY2UsIGxvY2FsZSApO1xuXHRcdFx0fVxuXG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIERvZXMgcGFyYW1ldGVyIGFuZCBtYWdpYyB3b3JkIHN1YnN0aXR1dGlvbi5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgTWVzc2FnZSBrZXlcblx0XHQgKiBAcGFyYW0ge0FycmF5fSBwYXJhbWV0ZXJzIE1lc3NhZ2UgcGFyYW1ldGVyc1xuXHRcdCAqIEByZXR1cm4ge3N0cmluZ31cblx0XHQgKi9cblx0XHRwYXJzZTogZnVuY3Rpb24gKCBrZXksIHBhcmFtZXRlcnMgKSB7XG5cdFx0XHR2YXIgbWVzc2FnZSA9IHRoaXMubG9jYWxpemUoIGtleSApO1xuXHRcdFx0Ly8gRklYTUU6IFRoaXMgY2hhbmdlcyB0aGUgc3RhdGUgb2YgdGhlIEkxOE4gb2JqZWN0LFxuXHRcdFx0Ly8gc2hvdWxkIHByb2JhYmx5IG5vdCBjaGFuZ2UgdGhlICd0aGlzLnBhcnNlcicgYnV0IGp1c3Rcblx0XHRcdC8vIHBhc3MgaXQgdG8gdGhlIHBhcnNlci5cblx0XHRcdHRoaXMucGFyc2VyLmxhbmd1YWdlID0gJC5pMThuLmxhbmd1YWdlc1sgJC5pMThuKCkubG9jYWxlIF0gfHwgJC5pMThuLmxhbmd1YWdlc1sgJ2RlZmF1bHQnIF07XG5cdFx0XHRpZiAoIG1lc3NhZ2UgPT09ICcnICkge1xuXHRcdFx0XHRtZXNzYWdlID0ga2V5O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMucGFyc2VyLnBhcnNlKCBtZXNzYWdlLCBwYXJhbWV0ZXJzICk7XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBQcm9jZXNzIGEgbWVzc2FnZSBmcm9tIHRoZSAkLkkxOE4gaW5zdGFuY2Vcblx0ICogZm9yIHRoZSBjdXJyZW50IGRvY3VtZW50LCBzdG9yZWQgaW4galF1ZXJ5LmRhdGEoZG9jdW1lbnQpLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30ga2V5IEtleSBvZiB0aGUgbWVzc2FnZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtMSBbcGFyYW0uLi5dIFZhcmlhZGljIGxpc3Qgb2YgcGFyYW1ldGVycyBmb3Ige2tleX0uXG5cdCAqIEByZXR1cm4ge3N0cmluZ3wkLkkxOE59IFBhcnNlZCBtZXNzYWdlLCBvciBpZiBubyBrZXkgd2FzIGdpdmVuXG5cdCAqIHRoZSBpbnN0YW5jZSBvZiAkLkkxOE4gaXMgcmV0dXJuZWQuXG5cdCAqL1xuXHQkLmkxOG4gPSBmdW5jdGlvbiAoIGtleSwgcGFyYW0xICkge1xuXHRcdHZhciBwYXJhbWV0ZXJzLFxuXHRcdFx0aTE4biA9ICQuZGF0YSggZG9jdW1lbnQsICdpMThuJyApLFxuXHRcdFx0b3B0aW9ucyA9IHR5cGVvZiBrZXkgPT09ICdvYmplY3QnICYmIGtleTtcblxuXHRcdC8vIElmIHRoZSBsb2NhbGUgb3B0aW9uIGZvciB0aGlzIGNhbGwgaXMgZGlmZmVyZW50IHRoZW4gdGhlIHNldHVwIHNvIGZhcixcblx0XHQvLyB1cGRhdGUgaXQgYXV0b21hdGljYWxseS4gVGhpcyBkb2Vzbid0IGp1c3QgY2hhbmdlIHRoZSBjb250ZXh0IGZvciB0aGlzXG5cdFx0Ly8gY2FsbCBidXQgZm9yIGFsbCBmdXR1cmUgY2FsbCBhcyB3ZWxsLlxuXHRcdC8vIElmIHRoZXJlIGlzIG5vIGkxOG4gc2V0dXAgeWV0LCBkb24ndCBkbyB0aGlzLiBJdCB3aWxsIGJlIHRha2VuIGNhcmUgb2Zcblx0XHQvLyBieSB0aGUgYG5ldyBJMThOYCBjb25zdHJ1Y3Rpb24gYmVsb3cuXG5cdFx0Ly8gTk9URTogSXQgc2hvdWxkIG9ubHkgY2hhbmdlIGxhbmd1YWdlIGZvciB0aGlzIG9uZSBjYWxsLlxuXHRcdC8vIFRoZW4gY2FjaGUgaW5zdGFuY2VzIG9mIEkxOE4gc29tZXdoZXJlLlxuXHRcdGlmICggb3B0aW9ucyAmJiBvcHRpb25zLmxvY2FsZSAmJiBpMThuICYmIGkxOG4ubG9jYWxlICE9PSBvcHRpb25zLmxvY2FsZSApIHtcblx0XHRcdGkxOG4ubG9jYWxlID0gb3B0aW9ucy5sb2NhbGU7XG5cdFx0fVxuXG5cdFx0aWYgKCAhaTE4biApIHtcblx0XHRcdGkxOG4gPSBuZXcgSTE4Tiggb3B0aW9ucyApO1xuXHRcdFx0JC5kYXRhKCBkb2N1bWVudCwgJ2kxOG4nLCBpMThuICk7XG5cdFx0fVxuXG5cdFx0aWYgKCB0eXBlb2Yga2V5ID09PSAnc3RyaW5nJyApIHtcblx0XHRcdGlmICggcGFyYW0xICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdHBhcmFtZXRlcnMgPSBzbGljZS5jYWxsKCBhcmd1bWVudHMsIDEgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHBhcmFtZXRlcnMgPSBbXTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGkxOG4ucGFyc2UoIGtleSwgcGFyYW1ldGVycyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBGSVhNRTogcmVtb3ZlIHRoaXMgZmVhdHVyZS9idWcuXG5cdFx0XHRyZXR1cm4gaTE4bjtcblx0XHR9XG5cdH07XG5cblx0JC5mbi5pMThuID0gZnVuY3Rpb24gKCkge1xuXHRcdHZhciBpMThuID0gJC5kYXRhKCBkb2N1bWVudCwgJ2kxOG4nICk7XG5cblx0XHRpZiAoICFpMThuICkge1xuXHRcdFx0aTE4biA9IG5ldyBJMThOKCk7XG5cdFx0XHQkLmRhdGEoIGRvY3VtZW50LCAnaTE4bicsIGkxOG4gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKCB0aGlzICksXG5cdFx0XHRcdG1lc3NhZ2VLZXkgPSAkdGhpcy5kYXRhKCAnaTE4bicgKSxcblx0XHRcdFx0bEJyYWNrZXQsIHJCcmFja2V0LCB0eXBlLCBrZXk7XG5cblx0XHRcdGlmICggbWVzc2FnZUtleSApIHtcblx0XHRcdFx0bEJyYWNrZXQgPSBtZXNzYWdlS2V5LmluZGV4T2YoICdbJyApO1xuXHRcdFx0XHRyQnJhY2tldCA9IG1lc3NhZ2VLZXkuaW5kZXhPZiggJ10nICk7XG5cdFx0XHRcdGlmICggbEJyYWNrZXQgIT09IC0xICYmIHJCcmFja2V0ICE9PSAtMSAmJiBsQnJhY2tldCA8IHJCcmFja2V0ICkge1xuXHRcdFx0XHRcdHR5cGUgPSBtZXNzYWdlS2V5LnNsaWNlKCBsQnJhY2tldCArIDEsIHJCcmFja2V0ICk7XG5cdFx0XHRcdFx0a2V5ID0gbWVzc2FnZUtleS5zbGljZSggckJyYWNrZXQgKyAxICk7XG5cdFx0XHRcdFx0aWYgKCB0eXBlID09PSAnaHRtbCcgKSB7XG5cdFx0XHRcdFx0XHQkdGhpcy5odG1sKCBpMThuLnBhcnNlKCBrZXkgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkdGhpcy5hdHRyKCB0eXBlLCBpMThuLnBhcnNlKCBrZXkgKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkdGhpcy50ZXh0KCBpMThuLnBhcnNlKCBtZXNzYWdlS2V5ICkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHRoaXMuZmluZCggJ1tkYXRhLWkxOG5dJyApLmkxOG4oKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH07XG5cblx0ZnVuY3Rpb24gZ2V0RGVmYXVsdExvY2FsZSgpIHtcblx0XHR2YXIgbmF2LCBsb2NhbGUgPSAkKCAnaHRtbCcgKS5hdHRyKCAnbGFuZycgKTtcblxuXHRcdGlmICggIWxvY2FsZSApIHtcblx0XHRcdGlmICggdHlwZW9mIHdpbmRvdy5uYXZpZ2F0b3IgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0bmF2ID0gd2luZG93Lm5hdmlnYXRvcjtcblx0XHRcdFx0bG9jYWxlID0gbmF2Lmxhbmd1YWdlIHx8IG5hdi51c2VyTGFuZ3VhZ2UgfHwgJyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsb2NhbGUgPSAnJztcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGxvY2FsZTtcblx0fVxuXG5cdCQuaTE4bi5sYW5ndWFnZXMgPSB7fTtcblx0JC5pMThuLm1lc3NhZ2VTdG9yZSA9ICQuaTE4bi5tZXNzYWdlU3RvcmUgfHwge307XG5cdCQuaTE4bi5wYXJzZXIgPSB7XG5cdFx0Ly8gVGhlIGRlZmF1bHQgcGFyc2VyIG9ubHkgaGFuZGxlcyB2YXJpYWJsZSBzdWJzdGl0dXRpb25cblx0XHRwYXJzZTogZnVuY3Rpb24gKCBtZXNzYWdlLCBwYXJhbWV0ZXJzICkge1xuXHRcdFx0cmV0dXJuIG1lc3NhZ2UucmVwbGFjZSggL1xcJChcXGQrKS9nLCBmdW5jdGlvbiAoIHN0ciwgbWF0Y2ggKSB7XG5cdFx0XHRcdHZhciBpbmRleCA9IHBhcnNlSW50KCBtYXRjaCwgMTAgKSAtIDE7XG5cdFx0XHRcdHJldHVybiBwYXJhbWV0ZXJzWyBpbmRleCBdICE9PSB1bmRlZmluZWQgPyBwYXJhbWV0ZXJzWyBpbmRleCBdIDogJyQnICsgbWF0Y2g7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRlbWl0dGVyOiB7fVxuXHR9O1xuXHQkLmkxOG4uZmFsbGJhY2tzID0ge307XG5cdCQuaTE4bi5kZWJ1ZyA9IGZhbHNlO1xuXHQkLmkxOG4ubG9nID0gZnVuY3Rpb24gKCAvKiBhcmd1bWVudHMgKi8gKSB7XG5cdFx0aWYgKCB3aW5kb3cuY29uc29sZSAmJiAkLmkxOG4uZGVidWcgKSB7XG5cdFx0XHR3aW5kb3cuY29uc29sZS5sb2cuYXBwbHkoIHdpbmRvdy5jb25zb2xlLCBhcmd1bWVudHMgKTtcblx0XHR9XG5cdH07XG5cdC8qIFN0YXRpYyBtZW1iZXJzICovXG5cdEkxOE4uZGVmYXVsdHMgPSB7XG5cdFx0bG9jYWxlOiBnZXREZWZhdWx0TG9jYWxlKCksXG5cdFx0ZmFsbGJhY2tMb2NhbGU6ICdlbicsXG5cdFx0cGFyc2VyOiAkLmkxOG4ucGFyc2VyLFxuXHRcdG1lc3NhZ2VTdG9yZTogJC5pMThuLm1lc3NhZ2VTdG9yZVxuXHR9O1xuXG5cdC8vIEV4cG9zZSBjb25zdHJ1Y3RvclxuXHQkLmkxOG4uY29uc3RydWN0b3IgPSBJMThOO1xufSggalF1ZXJ5ICkgKTsiLCIvKiBnbG9iYWwgcGx1cmFsUnVsZVBhcnNlciAqL1xuKCBmdW5jdGlvbiAoICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvLyBqc2NzOmRpc2FibGVcblx0dmFyIGxhbmd1YWdlID0ge1xuXHRcdC8vIENMRFIgcGx1cmFsIHJ1bGVzIGdlbmVyYXRlZCB1c2luZ1xuXHRcdC8vIGxpYnMvQ0xEUlBsdXJhbFJ1bGVQYXJzZXIvdG9vbHMvUGx1cmFsWE1MMkpTT04uaHRtbFxuXHRcdHBsdXJhbFJ1bGVzOiB7XG5cdFx0XHRhazoge1xuXHRcdFx0XHRvbmU6ICduID0gMC4uMSdcblx0XHRcdH0sXG5cdFx0XHRhbToge1xuXHRcdFx0XHRvbmU6ICdpID0gMCBvciBuID0gMSdcblx0XHRcdH0sXG5cdFx0XHRhcjoge1xuXHRcdFx0XHR6ZXJvOiAnbiA9IDAnLFxuXHRcdFx0XHRvbmU6ICduID0gMScsXG5cdFx0XHRcdHR3bzogJ24gPSAyJyxcblx0XHRcdFx0ZmV3OiAnbiAlIDEwMCA9IDMuLjEwJyxcblx0XHRcdFx0bWFueTogJ24gJSAxMDAgPSAxMS4uOTknXG5cdFx0XHR9LFxuXHRcdFx0YXJzOiB7XG5cdFx0XHRcdHplcm86ICduID0gMCcsXG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInLFxuXHRcdFx0XHRmZXc6ICduICUgMTAwID0gMy4uMTAnLFxuXHRcdFx0XHRtYW55OiAnbiAlIDEwMCA9IDExLi45OSdcblx0XHRcdH0sXG5cdFx0XHRhczoge1xuXHRcdFx0XHRvbmU6ICdpID0gMCBvciBuID0gMSdcblx0XHRcdH0sXG5cdFx0XHRiZToge1xuXHRcdFx0XHRvbmU6ICduICUgMTAgPSAxIGFuZCBuICUgMTAwICE9IDExJyxcblx0XHRcdFx0ZmV3OiAnbiAlIDEwID0gMi4uNCBhbmQgbiAlIDEwMCAhPSAxMi4uMTQnLFxuXHRcdFx0XHRtYW55OiAnbiAlIDEwID0gMCBvciBuICUgMTAgPSA1Li45IG9yIG4gJSAxMDAgPSAxMS4uMTQnXG5cdFx0XHR9LFxuXHRcdFx0Ymg6IHtcblx0XHRcdFx0b25lOiAnbiA9IDAuLjEnXG5cdFx0XHR9LFxuXHRcdFx0Ym46IHtcblx0XHRcdFx0b25lOiAnaSA9IDAgb3IgbiA9IDEnXG5cdFx0XHR9LFxuXHRcdFx0YnI6IHtcblx0XHRcdFx0b25lOiAnbiAlIDEwID0gMSBhbmQgbiAlIDEwMCAhPSAxMSw3MSw5MScsXG5cdFx0XHRcdHR3bzogJ24gJSAxMCA9IDIgYW5kIG4gJSAxMDAgIT0gMTIsNzIsOTInLFxuXHRcdFx0XHRmZXc6ICduICUgMTAgPSAzLi40LDkgYW5kIG4gJSAxMDAgIT0gMTAuLjE5LDcwLi43OSw5MC4uOTknLFxuXHRcdFx0XHRtYW55OiAnbiAhPSAwIGFuZCBuICUgMTAwMDAwMCA9IDAnXG5cdFx0XHR9LFxuXHRcdFx0YnM6IHtcblx0XHRcdFx0b25lOiAndiA9IDAgYW5kIGkgJSAxMCA9IDEgYW5kIGkgJSAxMDAgIT0gMTEgb3IgZiAlIDEwID0gMSBhbmQgZiAlIDEwMCAhPSAxMScsXG5cdFx0XHRcdGZldzogJ3YgPSAwIGFuZCBpICUgMTAgPSAyLi40IGFuZCBpICUgMTAwICE9IDEyLi4xNCBvciBmICUgMTAgPSAyLi40IGFuZCBmICUgMTAwICE9IDEyLi4xNCdcblx0XHRcdH0sXG5cdFx0XHRjczoge1xuXHRcdFx0XHRvbmU6ICdpID0gMSBhbmQgdiA9IDAnLFxuXHRcdFx0XHRmZXc6ICdpID0gMi4uNCBhbmQgdiA9IDAnLFxuXHRcdFx0XHRtYW55OiAndiAhPSAwJ1xuXHRcdFx0fSxcblx0XHRcdGN5OiB7XG5cdFx0XHRcdHplcm86ICduID0gMCcsXG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInLFxuXHRcdFx0XHRmZXc6ICduID0gMycsXG5cdFx0XHRcdG1hbnk6ICduID0gNidcblx0XHRcdH0sXG5cdFx0XHRkYToge1xuXHRcdFx0XHRvbmU6ICduID0gMSBvciB0ICE9IDAgYW5kIGkgPSAwLDEnXG5cdFx0XHR9LFxuXHRcdFx0ZHNiOiB7XG5cdFx0XHRcdG9uZTogJ3YgPSAwIGFuZCBpICUgMTAwID0gMSBvciBmICUgMTAwID0gMScsXG5cdFx0XHRcdHR3bzogJ3YgPSAwIGFuZCBpICUgMTAwID0gMiBvciBmICUgMTAwID0gMicsXG5cdFx0XHRcdGZldzogJ3YgPSAwIGFuZCBpICUgMTAwID0gMy4uNCBvciBmICUgMTAwID0gMy4uNCdcblx0XHRcdH0sXG5cdFx0XHRmYToge1xuXHRcdFx0XHRvbmU6ICdpID0gMCBvciBuID0gMSdcblx0XHRcdH0sXG5cdFx0XHRmZjoge1xuXHRcdFx0XHRvbmU6ICdpID0gMCwxJ1xuXHRcdFx0fSxcblx0XHRcdGZpbDoge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSA9IDEsMiwzIG9yIHYgPSAwIGFuZCBpICUgMTAgIT0gNCw2LDkgb3IgdiAhPSAwIGFuZCBmICUgMTAgIT0gNCw2LDknXG5cdFx0XHR9LFxuXHRcdFx0ZnI6IHtcblx0XHRcdFx0b25lOiAnaSA9IDAsMSdcblx0XHRcdH0sXG5cdFx0XHRnYToge1xuXHRcdFx0XHRvbmU6ICduID0gMScsXG5cdFx0XHRcdHR3bzogJ24gPSAyJyxcblx0XHRcdFx0ZmV3OiAnbiA9IDMuLjYnLFxuXHRcdFx0XHRtYW55OiAnbiA9IDcuLjEwJ1xuXHRcdFx0fSxcblx0XHRcdGdkOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxLDExJyxcblx0XHRcdFx0dHdvOiAnbiA9IDIsMTInLFxuXHRcdFx0XHRmZXc6ICduID0gMy4uMTAsMTMuLjE5J1xuXHRcdFx0fSxcblx0XHRcdGd1OiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwIG9yIG4gPSAxJ1xuXHRcdFx0fSxcblx0XHRcdGd1dzoge1xuXHRcdFx0XHRvbmU6ICduID0gMC4uMSdcblx0XHRcdH0sXG5cdFx0XHRndjoge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSAlIDEwID0gMScsXG5cdFx0XHRcdHR3bzogJ3YgPSAwIGFuZCBpICUgMTAgPSAyJyxcblx0XHRcdFx0ZmV3OiAndiA9IDAgYW5kIGkgJSAxMDAgPSAwLDIwLDQwLDYwLDgwJyxcblx0XHRcdFx0bWFueTogJ3YgIT0gMCdcblx0XHRcdH0sXG5cdFx0XHRoZToge1xuXHRcdFx0XHRvbmU6ICdpID0gMSBhbmQgdiA9IDAnLFxuXHRcdFx0XHR0d286ICdpID0gMiBhbmQgdiA9IDAnLFxuXHRcdFx0XHRtYW55OiAndiA9IDAgYW5kIG4gIT0gMC4uMTAgYW5kIG4gJSAxMCA9IDAnXG5cdFx0XHR9LFxuXHRcdFx0aGk6IHtcblx0XHRcdFx0b25lOiAnaSA9IDAgb3IgbiA9IDEnXG5cdFx0XHR9LFxuXHRcdFx0aHI6IHtcblx0XHRcdFx0b25lOiAndiA9IDAgYW5kIGkgJSAxMCA9IDEgYW5kIGkgJSAxMDAgIT0gMTEgb3IgZiAlIDEwID0gMSBhbmQgZiAlIDEwMCAhPSAxMScsXG5cdFx0XHRcdGZldzogJ3YgPSAwIGFuZCBpICUgMTAgPSAyLi40IGFuZCBpICUgMTAwICE9IDEyLi4xNCBvciBmICUgMTAgPSAyLi40IGFuZCBmICUgMTAwICE9IDEyLi4xNCdcblx0XHRcdH0sXG5cdFx0XHRoc2I6IHtcblx0XHRcdFx0b25lOiAndiA9IDAgYW5kIGkgJSAxMDAgPSAxIG9yIGYgJSAxMDAgPSAxJyxcblx0XHRcdFx0dHdvOiAndiA9IDAgYW5kIGkgJSAxMDAgPSAyIG9yIGYgJSAxMDAgPSAyJyxcblx0XHRcdFx0ZmV3OiAndiA9IDAgYW5kIGkgJSAxMDAgPSAzLi40IG9yIGYgJSAxMDAgPSAzLi40J1xuXHRcdFx0fSxcblx0XHRcdGh5OiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwLDEnXG5cdFx0XHR9LFxuXHRcdFx0aXM6IHtcblx0XHRcdFx0b25lOiAndCA9IDAgYW5kIGkgJSAxMCA9IDEgYW5kIGkgJSAxMDAgIT0gMTEgb3IgdCAhPSAwJ1xuXHRcdFx0fSxcblx0XHRcdGl1OiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInXG5cdFx0XHR9LFxuXHRcdFx0aXc6IHtcblx0XHRcdFx0b25lOiAnaSA9IDEgYW5kIHYgPSAwJyxcblx0XHRcdFx0dHdvOiAnaSA9IDIgYW5kIHYgPSAwJyxcblx0XHRcdFx0bWFueTogJ3YgPSAwIGFuZCBuICE9IDAuLjEwIGFuZCBuICUgMTAgPSAwJ1xuXHRcdFx0fSxcblx0XHRcdGthYjoge1xuXHRcdFx0XHRvbmU6ICdpID0gMCwxJ1xuXHRcdFx0fSxcblx0XHRcdGtuOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwIG9yIG4gPSAxJ1xuXHRcdFx0fSxcblx0XHRcdGt3OiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInXG5cdFx0XHR9LFxuXHRcdFx0bGFnOiB7XG5cdFx0XHRcdHplcm86ICduID0gMCcsXG5cdFx0XHRcdG9uZTogJ2kgPSAwLDEgYW5kIG4gIT0gMCdcblx0XHRcdH0sXG5cdFx0XHRsbjoge1xuXHRcdFx0XHRvbmU6ICduID0gMC4uMSdcblx0XHRcdH0sXG5cdFx0XHRsdDoge1xuXHRcdFx0XHRvbmU6ICduICUgMTAgPSAxIGFuZCBuICUgMTAwICE9IDExLi4xOScsXG5cdFx0XHRcdGZldzogJ24gJSAxMCA9IDIuLjkgYW5kIG4gJSAxMDAgIT0gMTEuLjE5Jyxcblx0XHRcdFx0bWFueTogJ2YgIT0gMCdcblx0XHRcdH0sXG5cdFx0XHRsdjoge1xuXHRcdFx0XHR6ZXJvOiAnbiAlIDEwID0gMCBvciBuICUgMTAwID0gMTEuLjE5IG9yIHYgPSAyIGFuZCBmICUgMTAwID0gMTEuLjE5Jyxcblx0XHRcdFx0b25lOiAnbiAlIDEwID0gMSBhbmQgbiAlIDEwMCAhPSAxMSBvciB2ID0gMiBhbmQgZiAlIDEwID0gMSBhbmQgZiAlIDEwMCAhPSAxMSBvciB2ICE9IDIgYW5kIGYgJSAxMCA9IDEnXG5cdFx0XHR9LFxuXHRcdFx0bWc6IHtcblx0XHRcdFx0b25lOiAnbiA9IDAuLjEnXG5cdFx0XHR9LFxuXHRcdFx0bWs6IHtcblx0XHRcdFx0b25lOiAndiA9IDAgYW5kIGkgJSAxMCA9IDEgb3IgZiAlIDEwID0gMSdcblx0XHRcdH0sXG5cdFx0XHRtbzoge1xuXHRcdFx0XHRvbmU6ICdpID0gMSBhbmQgdiA9IDAnLFxuXHRcdFx0XHRmZXc6ICd2ICE9IDAgb3IgbiA9IDAgb3IgbiAhPSAxIGFuZCBuICUgMTAwID0gMS4uMTknXG5cdFx0XHR9LFxuXHRcdFx0bXI6IHtcblx0XHRcdFx0b25lOiAnaSA9IDAgb3IgbiA9IDEnXG5cdFx0XHR9LFxuXHRcdFx0bXQ6IHtcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHRmZXc6ICduID0gMCBvciBuICUgMTAwID0gMi4uMTAnLFxuXHRcdFx0XHRtYW55OiAnbiAlIDEwMCA9IDExLi4xOSdcblx0XHRcdH0sXG5cdFx0XHRuYXE6IHtcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMidcblx0XHRcdH0sXG5cdFx0XHRuc286IHtcblx0XHRcdFx0b25lOiAnbiA9IDAuLjEnXG5cdFx0XHR9LFxuXHRcdFx0cGE6IHtcblx0XHRcdFx0b25lOiAnbiA9IDAuLjEnXG5cdFx0XHR9LFxuXHRcdFx0cGw6IHtcblx0XHRcdFx0b25lOiAnaSA9IDEgYW5kIHYgPSAwJyxcblx0XHRcdFx0ZmV3OiAndiA9IDAgYW5kIGkgJSAxMCA9IDIuLjQgYW5kIGkgJSAxMDAgIT0gMTIuLjE0Jyxcblx0XHRcdFx0bWFueTogJ3YgPSAwIGFuZCBpICE9IDEgYW5kIGkgJSAxMCA9IDAuLjEgb3IgdiA9IDAgYW5kIGkgJSAxMCA9IDUuLjkgb3IgdiA9IDAgYW5kIGkgJSAxMDAgPSAxMi4uMTQnXG5cdFx0XHR9LFxuXHRcdFx0cHJnOiB7XG5cdFx0XHRcdHplcm86ICduICUgMTAgPSAwIG9yIG4gJSAxMDAgPSAxMS4uMTkgb3IgdiA9IDIgYW5kIGYgJSAxMDAgPSAxMS4uMTknLFxuXHRcdFx0XHRvbmU6ICduICUgMTAgPSAxIGFuZCBuICUgMTAwICE9IDExIG9yIHYgPSAyIGFuZCBmICUgMTAgPSAxIGFuZCBmICUgMTAwICE9IDExIG9yIHYgIT0gMiBhbmQgZiAlIDEwID0gMSdcblx0XHRcdH0sXG5cdFx0XHRwdDoge1xuXHRcdFx0XHRvbmU6ICdpID0gMC4uMSdcblx0XHRcdH0sXG5cdFx0XHRybzoge1xuXHRcdFx0XHRvbmU6ICdpID0gMSBhbmQgdiA9IDAnLFxuXHRcdFx0XHRmZXc6ICd2ICE9IDAgb3IgbiA9IDAgb3IgbiAhPSAxIGFuZCBuICUgMTAwID0gMS4uMTknXG5cdFx0XHR9LFxuXHRcdFx0cnU6IHtcblx0XHRcdFx0b25lOiAndiA9IDAgYW5kIGkgJSAxMCA9IDEgYW5kIGkgJSAxMDAgIT0gMTEnLFxuXHRcdFx0XHRmZXc6ICd2ID0gMCBhbmQgaSAlIDEwID0gMi4uNCBhbmQgaSAlIDEwMCAhPSAxMi4uMTQnLFxuXHRcdFx0XHRtYW55OiAndiA9IDAgYW5kIGkgJSAxMCA9IDAgb3IgdiA9IDAgYW5kIGkgJSAxMCA9IDUuLjkgb3IgdiA9IDAgYW5kIGkgJSAxMDAgPSAxMS4uMTQnXG5cdFx0XHR9LFxuXHRcdFx0c2U6IHtcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMidcblx0XHRcdH0sXG5cdFx0XHRzaDoge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSAlIDEwID0gMSBhbmQgaSAlIDEwMCAhPSAxMSBvciBmICUgMTAgPSAxIGFuZCBmICUgMTAwICE9IDExJyxcblx0XHRcdFx0ZmV3OiAndiA9IDAgYW5kIGkgJSAxMCA9IDIuLjQgYW5kIGkgJSAxMDAgIT0gMTIuLjE0IG9yIGYgJSAxMCA9IDIuLjQgYW5kIGYgJSAxMDAgIT0gMTIuLjE0J1xuXHRcdFx0fSxcblx0XHRcdHNoaToge1xuXHRcdFx0XHRvbmU6ICdpID0gMCBvciBuID0gMScsXG5cdFx0XHRcdGZldzogJ24gPSAyLi4xMCdcblx0XHRcdH0sXG5cdFx0XHRzaToge1xuXHRcdFx0XHRvbmU6ICduID0gMCwxIG9yIGkgPSAwIGFuZCBmID0gMSdcblx0XHRcdH0sXG5cdFx0XHRzazoge1xuXHRcdFx0XHRvbmU6ICdpID0gMSBhbmQgdiA9IDAnLFxuXHRcdFx0XHRmZXc6ICdpID0gMi4uNCBhbmQgdiA9IDAnLFxuXHRcdFx0XHRtYW55OiAndiAhPSAwJ1xuXHRcdFx0fSxcblx0XHRcdHNsOiB7XG5cdFx0XHRcdG9uZTogJ3YgPSAwIGFuZCBpICUgMTAwID0gMScsXG5cdFx0XHRcdHR3bzogJ3YgPSAwIGFuZCBpICUgMTAwID0gMicsXG5cdFx0XHRcdGZldzogJ3YgPSAwIGFuZCBpICUgMTAwID0gMy4uNCBvciB2ICE9IDAnXG5cdFx0XHR9LFxuXHRcdFx0c21hOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInXG5cdFx0XHR9LFxuXHRcdFx0c21pOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInXG5cdFx0XHR9LFxuXHRcdFx0c21qOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInXG5cdFx0XHR9LFxuXHRcdFx0c21uOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInXG5cdFx0XHR9LFxuXHRcdFx0c21zOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInXG5cdFx0XHR9LFxuXHRcdFx0c3I6IHtcblx0XHRcdFx0b25lOiAndiA9IDAgYW5kIGkgJSAxMCA9IDEgYW5kIGkgJSAxMDAgIT0gMTEgb3IgZiAlIDEwID0gMSBhbmQgZiAlIDEwMCAhPSAxMScsXG5cdFx0XHRcdGZldzogJ3YgPSAwIGFuZCBpICUgMTAgPSAyLi40IGFuZCBpICUgMTAwICE9IDEyLi4xNCBvciBmICUgMTAgPSAyLi40IGFuZCBmICUgMTAwICE9IDEyLi4xNCdcblx0XHRcdH0sXG5cdFx0XHR0aToge1xuXHRcdFx0XHRvbmU6ICduID0gMC4uMSdcblx0XHRcdH0sXG5cdFx0XHR0bDoge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSA9IDEsMiwzIG9yIHYgPSAwIGFuZCBpICUgMTAgIT0gNCw2LDkgb3IgdiAhPSAwIGFuZCBmICUgMTAgIT0gNCw2LDknXG5cdFx0XHR9LFxuXHRcdFx0dHptOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAwLi4xIG9yIG4gPSAxMS4uOTknXG5cdFx0XHR9LFxuXHRcdFx0dWs6IHtcblx0XHRcdFx0b25lOiAndiA9IDAgYW5kIGkgJSAxMCA9IDEgYW5kIGkgJSAxMDAgIT0gMTEnLFxuXHRcdFx0XHRmZXc6ICd2ID0gMCBhbmQgaSAlIDEwID0gMi4uNCBhbmQgaSAlIDEwMCAhPSAxMi4uMTQnLFxuXHRcdFx0XHRtYW55OiAndiA9IDAgYW5kIGkgJSAxMCA9IDAgb3IgdiA9IDAgYW5kIGkgJSAxMCA9IDUuLjkgb3IgdiA9IDAgYW5kIGkgJSAxMDAgPSAxMS4uMTQnXG5cdFx0XHR9LFxuXHRcdFx0d2E6IHtcblx0XHRcdFx0b25lOiAnbiA9IDAuLjEnXG5cdFx0XHR9LFxuXHRcdFx0enU6IHtcblx0XHRcdFx0b25lOiAnaSA9IDAgb3IgbiA9IDEnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvLyBqc2NzOmVuYWJsZVxuXG5cdFx0LyoqXG5cdFx0ICogUGx1cmFsIGZvcm0gdHJhbnNmb3JtYXRpb25zLCBuZWVkZWQgZm9yIHNvbWUgbGFuZ3VhZ2VzLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtpbnRlZ2VyfSBjb3VudFxuXHRcdCAqICAgICAgICAgICAgTm9uLWxvY2FsaXplZCBxdWFudGlmaWVyXG5cdFx0ICogQHBhcmFtIHtBcnJheX0gZm9ybXNcblx0XHQgKiAgICAgICAgICAgIExpc3Qgb2YgcGx1cmFsIGZvcm1zXG5cdFx0ICogQHJldHVybiB7c3RyaW5nfSBDb3JyZWN0IGZvcm0gZm9yIHF1YW50aWZpZXIgaW4gdGhpcyBsYW5ndWFnZVxuXHRcdCAqL1xuXHRcdGNvbnZlcnRQbHVyYWw6IGZ1bmN0aW9uICggY291bnQsIGZvcm1zICkge1xuXHRcdFx0dmFyIHBsdXJhbFJ1bGVzLFxuXHRcdFx0XHRwbHVyYWxGb3JtSW5kZXgsXG5cdFx0XHRcdGluZGV4LFxuXHRcdFx0XHRleHBsaWNpdFBsdXJhbFBhdHRlcm4gPSBuZXcgUmVnRXhwKCAnXFxcXGQrPScsICdpJyApLFxuXHRcdFx0XHRmb3JtQ291bnQsXG5cdFx0XHRcdGZvcm07XG5cblx0XHRcdGlmICggIWZvcm1zIHx8IGZvcm1zLmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdFx0cmV0dXJuICcnO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBIYW5kbGUgZm9yIEV4cGxpY2l0IDA9ICYgMT0gdmFsdWVzXG5cdFx0XHRmb3IgKCBpbmRleCA9IDA7IGluZGV4IDwgZm9ybXMubGVuZ3RoOyBpbmRleCsrICkge1xuXHRcdFx0XHRmb3JtID0gZm9ybXNbIGluZGV4IF07XG5cdFx0XHRcdGlmICggZXhwbGljaXRQbHVyYWxQYXR0ZXJuLnRlc3QoIGZvcm0gKSApIHtcblx0XHRcdFx0XHRmb3JtQ291bnQgPSBwYXJzZUludCggZm9ybS5zbGljZSggMCwgZm9ybS5pbmRleE9mKCAnPScgKSApLCAxMCApO1xuXHRcdFx0XHRcdGlmICggZm9ybUNvdW50ID09PSBjb3VudCApIHtcblx0XHRcdFx0XHRcdHJldHVybiAoIGZvcm0uc2xpY2UoIGZvcm0uaW5kZXhPZiggJz0nICkgKyAxICkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Zm9ybXNbIGluZGV4IF0gPSB1bmRlZmluZWQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Zm9ybXMgPSAkLm1hcCggZm9ybXMsIGZ1bmN0aW9uICggZm9ybSApIHtcblx0XHRcdFx0aWYgKCBmb3JtICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZvcm07XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0cGx1cmFsUnVsZXMgPSB0aGlzLnBsdXJhbFJ1bGVzWyAkLmkxOG4oKS5sb2NhbGUgXTtcblxuXHRcdFx0aWYgKCAhcGx1cmFsUnVsZXMgKSB7XG5cdFx0XHRcdC8vIGRlZmF1bHQgZmFsbGJhY2suXG5cdFx0XHRcdHJldHVybiAoIGNvdW50ID09PSAxICkgPyBmb3Jtc1sgMCBdIDogZm9ybXNbIDEgXTtcblx0XHRcdH1cblxuXHRcdFx0cGx1cmFsRm9ybUluZGV4ID0gdGhpcy5nZXRQbHVyYWxGb3JtKCBjb3VudCwgcGx1cmFsUnVsZXMgKTtcblx0XHRcdHBsdXJhbEZvcm1JbmRleCA9IE1hdGgubWluKCBwbHVyYWxGb3JtSW5kZXgsIGZvcm1zLmxlbmd0aCAtIDEgKTtcblxuXHRcdFx0cmV0dXJuIGZvcm1zWyBwbHVyYWxGb3JtSW5kZXggXTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogRm9yIHRoZSBudW1iZXIsIGdldCB0aGUgcGx1cmFsIGZvciBpbmRleFxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtpbnRlZ2VyfSBudW1iZXJcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gcGx1cmFsUnVsZXNcblx0XHQgKiBAcmV0dXJuIHtpbnRlZ2VyfSBwbHVyYWwgZm9ybSBpbmRleFxuXHRcdCAqL1xuXHRcdGdldFBsdXJhbEZvcm06IGZ1bmN0aW9uICggbnVtYmVyLCBwbHVyYWxSdWxlcyApIHtcblx0XHRcdHZhciBpLFxuXHRcdFx0XHRwbHVyYWxGb3JtcyA9IFsgJ3plcm8nLCAnb25lJywgJ3R3bycsICdmZXcnLCAnbWFueScsICdvdGhlcicgXSxcblx0XHRcdFx0cGx1cmFsRm9ybUluZGV4ID0gMDtcblxuXHRcdFx0Zm9yICggaSA9IDA7IGkgPCBwbHVyYWxGb3Jtcy5sZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0aWYgKCBwbHVyYWxSdWxlc1sgcGx1cmFsRm9ybXNbIGkgXSBdICkge1xuXHRcdFx0XHRcdGlmICggcGx1cmFsUnVsZVBhcnNlciggcGx1cmFsUnVsZXNbIHBsdXJhbEZvcm1zWyBpIF0gXSwgbnVtYmVyICkgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcGx1cmFsRm9ybUluZGV4O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHBsdXJhbEZvcm1JbmRleCsrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBwbHVyYWxGb3JtSW5kZXg7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIENvbnZlcnRzIGEgbnVtYmVyIHVzaW5nIGRpZ2l0VHJhbnNmb3JtVGFibGUuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge251bWJlcn0gbnVtIFZhbHVlIHRvIGJlIGNvbnZlcnRlZFxuXHRcdCAqIEBwYXJhbSB7Ym9vbGVhbn0gaW50ZWdlciBDb252ZXJ0IHRoZSByZXR1cm4gdmFsdWUgdG8gYW4gaW50ZWdlclxuXHRcdCAqIEByZXR1cm4ge3N0cmluZ30gVGhlIG51bWJlciBjb252ZXJ0ZWQgaW50byBhIFN0cmluZy5cblx0XHQgKi9cblx0XHRjb252ZXJ0TnVtYmVyOiBmdW5jdGlvbiAoIG51bSwgaW50ZWdlciApIHtcblx0XHRcdHZhciB0bXAsIGl0ZW0sIGksXG5cdFx0XHRcdHRyYW5zZm9ybVRhYmxlLCBudW1iZXJTdHJpbmcsIGNvbnZlcnRlZE51bWJlcjtcblxuXHRcdFx0Ly8gU2V0IHRoZSB0YXJnZXQgVHJhbnNmb3JtIHRhYmxlOlxuXHRcdFx0dHJhbnNmb3JtVGFibGUgPSB0aGlzLmRpZ2l0VHJhbnNmb3JtVGFibGUoICQuaTE4bigpLmxvY2FsZSApO1xuXHRcdFx0bnVtYmVyU3RyaW5nID0gU3RyaW5nKCBudW0gKTtcblx0XHRcdGNvbnZlcnRlZE51bWJlciA9ICcnO1xuXG5cdFx0XHRpZiAoICF0cmFuc2Zvcm1UYWJsZSApIHtcblx0XHRcdFx0cmV0dXJuIG51bTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ2hlY2sgaWYgdGhlIHJlc3RvcmUgdG8gTGF0aW4gbnVtYmVyIGZsYWcgaXMgc2V0OlxuXHRcdFx0aWYgKCBpbnRlZ2VyICkge1xuXHRcdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG51bSwgMTAgKSA9PT0gbnVtICkge1xuXHRcdFx0XHRcdHJldHVybiBudW07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0bXAgPSBbXTtcblxuXHRcdFx0XHRmb3IgKCBpdGVtIGluIHRyYW5zZm9ybVRhYmxlICkge1xuXHRcdFx0XHRcdHRtcFsgdHJhbnNmb3JtVGFibGVbIGl0ZW0gXSBdID0gaXRlbTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRyYW5zZm9ybVRhYmxlID0gdG1wO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKCBpID0gMDsgaSA8IG51bWJlclN0cmluZy5sZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0aWYgKCB0cmFuc2Zvcm1UYWJsZVsgbnVtYmVyU3RyaW5nWyBpIF0gXSApIHtcblx0XHRcdFx0XHRjb252ZXJ0ZWROdW1iZXIgKz0gdHJhbnNmb3JtVGFibGVbIG51bWJlclN0cmluZ1sgaSBdIF07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29udmVydGVkTnVtYmVyICs9IG51bWJlclN0cmluZ1sgaSBdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBpbnRlZ2VyID8gcGFyc2VGbG9hdCggY29udmVydGVkTnVtYmVyLCAxMCApIDogY29udmVydGVkTnVtYmVyO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBHcmFtbWF0aWNhbCB0cmFuc2Zvcm1hdGlvbnMsIG5lZWRlZCBmb3IgaW5mbGVjdGVkIGxhbmd1YWdlcy5cblx0XHQgKiBJbnZva2VkIGJ5IHB1dHRpbmcge3tncmFtbWFyOmZvcm18d29yZH19IGluIGEgbWVzc2FnZS5cblx0XHQgKiBPdmVycmlkZSB0aGlzIG1ldGhvZCBmb3IgbGFuZ3VhZ2VzIHRoYXQgbmVlZCBzcGVjaWFsIGdyYW1tYXIgcnVsZXNcblx0XHQgKiBhcHBsaWVkIGR5bmFtaWNhbGx5LlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHdvcmRcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gZm9ybVxuXHRcdCAqIEByZXR1cm4ge3N0cmluZ31cblx0XHQgKi9cblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcblx0XHRjb252ZXJ0R3JhbW1hcjogZnVuY3Rpb24gKCB3b3JkLCBmb3JtICkge1xuXHRcdFx0cmV0dXJuIHdvcmQ7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFByb3ZpZGVzIGFuIGFsdGVybmF0aXZlIHRleHQgZGVwZW5kaW5nIG9uIHNwZWNpZmllZCBnZW5kZXIuIFVzYWdlXG5cdFx0ICoge3tnZW5kZXI6W2dlbmRlcnx1c2VyIG9iamVjdF18bWFzY3VsaW5lfGZlbWluaW5lfG5ldXRyYWx9fS4gSWYgc2Vjb25kXG5cdFx0ICogb3IgdGhpcmQgcGFyYW1ldGVyIGFyZSBub3Qgc3BlY2lmaWVkLCBtYXNjdWxpbmUgaXMgdXNlZC5cblx0XHQgKlxuXHRcdCAqIFRoZXNlIGRldGFpbHMgbWF5IGJlIG92ZXJyaWRlbiBwZXIgbGFuZ3VhZ2UuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gZ2VuZGVyXG5cdFx0ICogICAgICBtYWxlLCBmZW1hbGUsIG9yIGFueXRoaW5nIGVsc2UgZm9yIG5ldXRyYWwuXG5cdFx0ICogQHBhcmFtIHtBcnJheX0gZm9ybXNcblx0XHQgKiAgICAgIExpc3Qgb2YgZ2VuZGVyIGZvcm1zXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0Z2VuZGVyOiBmdW5jdGlvbiAoIGdlbmRlciwgZm9ybXMgKSB7XG5cdFx0XHRpZiAoICFmb3JtcyB8fCBmb3Jtcy5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRcdHJldHVybiAnJztcblx0XHRcdH1cblxuXHRcdFx0d2hpbGUgKCBmb3Jtcy5sZW5ndGggPCAyICkge1xuXHRcdFx0XHRmb3Jtcy5wdXNoKCBmb3Jtc1sgZm9ybXMubGVuZ3RoIC0gMSBdICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggZ2VuZGVyID09PSAnbWFsZScgKSB7XG5cdFx0XHRcdHJldHVybiBmb3Jtc1sgMCBdO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGdlbmRlciA9PT0gJ2ZlbWFsZScgKSB7XG5cdFx0XHRcdHJldHVybiBmb3Jtc1sgMSBdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gKCBmb3Jtcy5sZW5ndGggPT09IDMgKSA/IGZvcm1zWyAyIF0gOiBmb3Jtc1sgMCBdO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBHZXQgdGhlIGRpZ2l0IHRyYW5zZm9ybSB0YWJsZSBmb3IgdGhlIGdpdmVuIGxhbmd1YWdlXG5cdFx0ICogU2VlIGh0dHA6Ly9jbGRyLnVuaWNvZGUub3JnL3RyYW5zbGF0aW9uL251bWJlcmluZy1zeXN0ZW1zXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gbGFuZ3VhZ2Vcblx0XHQgKiBAcmV0dXJuIHtBcnJheXxib29sZWFufSBMaXN0IG9mIGRpZ2l0cyBpbiB0aGUgcGFzc2VkIGxhbmd1YWdlIG9yIGZhbHNlXG5cdFx0ICogcmVwcmVzZW50YXRpb24sIG9yIGJvb2xlYW4gZmFsc2UgaWYgdGhlcmUgaXMgbm8gaW5mb3JtYXRpb24uXG5cdFx0ICovXG5cdFx0ZGlnaXRUcmFuc2Zvcm1UYWJsZTogZnVuY3Rpb24gKCBsYW5ndWFnZSApIHtcblx0XHRcdHZhciB0YWJsZXMgPSB7XG5cdFx0XHRcdGFyOiAn2aDZodmi2aPZpNml2abZp9mo2aknLFxuXHRcdFx0XHRmYTogJ9uw27Hbstuz27Tbtdu227fbuNu5Jyxcblx0XHRcdFx0bWw6ICfgtabgtafgtajgtangtargtavgtazgta3gta7gta8nLFxuXHRcdFx0XHRrbjogJ+CzpuCzp+CzqOCzqeCzquCzq+CzrOCzreCzruCzrycsXG5cdFx0XHRcdGxvOiAn4LuQ4LuR4LuS4LuT4LuU4LuV4LuW4LuX4LuY4LuZJyxcblx0XHRcdFx0b3I6ICfgrabgrafgrajgrangrargravgrazgra3gra7gra8nLFxuXHRcdFx0XHRraDogJ+GfoOGfoeGfouGfo+GfpOGfpeGfpuGfp+GfqOGfqScsXG5cdFx0XHRcdHBhOiAn4Kmm4Kmn4Kmo4Kmp4Kmq4Kmr4Kms4Kmt4Kmu4KmvJyxcblx0XHRcdFx0Z3U6ICfgq6bgq6fgq6jgq6ngq6rgq6vgq6zgq63gq67gq68nLFxuXHRcdFx0XHRoaTogJ+ClpuClp+ClqOClqeClquClq+ClrOClreClruClrycsXG5cdFx0XHRcdG15OiAn4YGA4YGB4YGC4YGD4YGE4YGF4YGG4YGH4YGI4YGJJyxcblx0XHRcdFx0dGE6ICfgr6bgr6fgr6jgr6ngr6rgr6vgr6zgr63gr67gr68nLFxuXHRcdFx0XHR0ZTogJ+CxpuCxp+CxqOCxqeCxquCxq+CxrOCxreCxruCxrycsXG5cdFx0XHRcdHRoOiAn4LmQ4LmR4LmS4LmT4LmU4LmV4LmW4LmX4LmY4LmZJywgLy8gRklYTUUgdXNlIGlzbyA2MzkgY29kZXNcblx0XHRcdFx0Ym86ICfgvKDgvKHgvKLgvKPgvKTgvKXgvKbgvKfgvKjgvKknIC8vIEZJWE1FIHVzZSBpc28gNjM5IGNvZGVzXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoICF0YWJsZXNbIGxhbmd1YWdlIF0gKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRhYmxlc1sgbGFuZ3VhZ2UgXS5zcGxpdCggJycgKTtcblx0XHR9XG5cdH07XG5cblx0JC5leHRlbmQoICQuaTE4bi5sYW5ndWFnZXMsIHtcblx0XHQnZGVmYXVsdCc6IGxhbmd1YWdlXG5cdH0gKTtcbn0oIGpRdWVyeSApICk7XG4iLCIvKiFcbiAqIGpRdWVyeSBJbnRlcm5hdGlvbmFsaXphdGlvbiBsaWJyYXJ5IC0gTWVzc2FnZSBTdG9yZVxuICpcbiAqIENvcHlyaWdodCAoQykgMjAxMiBTYW50aG9zaCBUaG90dGluZ2FsXG4gKlxuICoganF1ZXJ5LmkxOG4gaXMgZHVhbCBsaWNlbnNlZCBHUEx2MiBvciBsYXRlciBhbmQgTUlULiBZb3UgZG9uJ3QgaGF2ZSB0byBkbyBhbnl0aGluZyBzcGVjaWFsIHRvXG4gKiBjaG9vc2Ugb25lIGxpY2Vuc2Ugb3IgdGhlIG90aGVyIGFuZCB5b3UgZG9uJ3QgaGF2ZSB0byBub3RpZnkgYW55b25lIHdoaWNoIGxpY2Vuc2UgeW91IGFyZSB1c2luZy5cbiAqIFlvdSBhcmUgZnJlZSB0byB1c2UgVW5pdmVyc2FsTGFuZ3VhZ2VTZWxlY3RvciBpbiBjb21tZXJjaWFsIHByb2plY3RzIGFzIGxvbmcgYXMgdGhlIGNvcHlyaWdodFxuICogaGVhZGVyIGlzIGxlZnQgaW50YWN0LiBTZWUgZmlsZXMgR1BMLUxJQ0VOU0UgYW5kIE1JVC1MSUNFTlNFIGZvciBkZXRhaWxzLlxuICpcbiAqIEBsaWNlbmNlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbmNlIDIuMCBvciBsYXRlclxuICogQGxpY2VuY2UgTUlUIExpY2Vuc2VcbiAqL1xuXG4oIGZ1bmN0aW9uICggJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBNZXNzYWdlU3RvcmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5tZXNzYWdlcyA9IHt9O1xuXHRcdHRoaXMuc291cmNlcyA9IHt9O1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGpzb25NZXNzYWdlTG9hZGVyKCB1cmwgKSB7XG5cdFx0dmFyIGRlZmVycmVkID0gJC5EZWZlcnJlZCgpO1xuXG5cdFx0JC5nZXRKU09OKCB1cmwgKVxuXHRcdFx0LmRvbmUoIGRlZmVycmVkLnJlc29sdmUgKVxuXHRcdFx0LmZhaWwoIGZ1bmN0aW9uICgganF4aHIsIHNldHRpbmdzLCBleGNlcHRpb24gKSB7XG5cdFx0XHRcdCQuaTE4bi5sb2coICdFcnJvciBpbiBsb2FkaW5nIG1lc3NhZ2VzIGZyb20gJyArIHVybCArICcgRXhjZXB0aW9uOiAnICsgZXhjZXB0aW9uICk7XG5cdFx0XHRcdC8vIElnbm9yZSA0MDQgZXhjZXB0aW9uLCBiZWNhdXNlIHdlIGFyZSBoYW5kbGluZyBmYWxsYWJhY2tzIGV4cGxpY2l0bHlcblx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZSgpO1xuXHRcdFx0fSApO1xuXG5cdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2UoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3dpa2ltZWRpYS9qcXVlcnkuaTE4bi93aWtpL1NwZWNpZmljYXRpb24jd2lraS1NZXNzYWdlX0ZpbGVfTG9hZGluZ1xuXHQgKi9cblx0TWVzc2FnZVN0b3JlLnByb3RvdHlwZSA9IHtcblxuXHRcdC8qKlxuXHRcdCAqIEdlbmVyYWwgbWVzc2FnZSBsb2FkaW5nIEFQSSBUaGlzIGNhbiB0YWtlIGEgVVJMIHN0cmluZyBmb3Jcblx0XHQgKiB0aGUganNvbiBmb3JtYXR0ZWQgbWVzc2FnZXMuXG5cdFx0ICogPGNvZGU+bG9hZCgncGF0aC90by9hbGxfbG9jYWxpemF0aW9ucy5qc29uJyk7PC9jb2RlPlxuXHRcdCAqXG5cdFx0ICogVGhpcyBjYW4gYWxzbyBsb2FkIGEgbG9jYWxpemF0aW9uIGZpbGUgZm9yIGEgbG9jYWxlIDxjb2RlPlxuXHRcdCAqIGxvYWQoICdwYXRoL3RvL2RlLW1lc3NhZ2VzLmpzb24nLCAnZGUnICk7XG5cdFx0ICogPC9jb2RlPlxuXHRcdCAqIEEgZGF0YSBvYmplY3QgY29udGFpbmluZyBtZXNzYWdlIGtleS0gbWVzc2FnZSB0cmFuc2xhdGlvbiBtYXBwaW5nc1xuXHRcdCAqIGNhbiBhbHNvIGJlIHBhc3NlZCBFZzpcblx0XHQgKiA8Y29kZT5cblx0XHQgKiBsb2FkKCB7ICdoZWxsbycgOiAnSGVsbG8nIH0sIG9wdGlvbmFsTG9jYWxlICk7XG5cdFx0ICogPC9jb2RlPiBJZiB0aGUgZGF0YSBhcmd1bWVudCBpc1xuXHRcdCAqIG51bGwvdW5kZWZpbmVkL2ZhbHNlLFxuXHRcdCAqIGFsbCBjYWNoZWQgbWVzc2FnZXMgZm9yIHRoZSBpMThuIGluc3RhbmNlIHdpbGwgZ2V0IHJlc2V0LlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd8T2JqZWN0fSBzb3VyY2Vcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gbG9jYWxlIExhbmd1YWdlIHRhZ1xuXHRcdCAqIEByZXR1cm4ge2pRdWVyeS5Qcm9taXNlfVxuXHRcdCAqL1xuXHRcdGxvYWQ6IGZ1bmN0aW9uICggc291cmNlLCBsb2NhbGUgKSB7XG5cdFx0XHR2YXIga2V5ID0gbnVsbCxcblx0XHRcdFx0ZGVmZXJyZWQgPSBudWxsLFxuXHRcdFx0XHRkZWZlcnJlZHMgPSBbXSxcblx0XHRcdFx0bWVzc2FnZVN0b3JlID0gdGhpcztcblxuXHRcdFx0aWYgKCB0eXBlb2Ygc291cmNlID09PSAnc3RyaW5nJyApIHtcblx0XHRcdFx0Ly8gVGhpcyBpcyBhIFVSTCB0byB0aGUgbWVzc2FnZXMgZmlsZS5cblx0XHRcdFx0JC5pMThuLmxvZyggJ0xvYWRpbmcgbWVzc2FnZXMgZnJvbTogJyArIHNvdXJjZSApO1xuXHRcdFx0XHRkZWZlcnJlZCA9IGpzb25NZXNzYWdlTG9hZGVyKCBzb3VyY2UgKVxuXHRcdFx0XHRcdC5kb25lKCBmdW5jdGlvbiAoIGxvY2FsaXphdGlvbiApIHtcblx0XHRcdFx0XHRcdG1lc3NhZ2VTdG9yZS5zZXQoIGxvY2FsZSwgbG9jYWxpemF0aW9uICk7XG5cdFx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggbG9jYWxlICkge1xuXHRcdFx0XHQvLyBzb3VyY2UgaXMgYW4ga2V5LXZhbHVlIHBhaXIgb2YgbWVzc2FnZXMgZm9yIGdpdmVuIGxvY2FsZVxuXHRcdFx0XHRtZXNzYWdlU3RvcmUuc2V0KCBsb2NhbGUsIHNvdXJjZSApO1xuXG5cdFx0XHRcdHJldHVybiAkLkRlZmVycmVkKCkucmVzb2x2ZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gc291cmNlIGlzIGEga2V5LXZhbHVlIHBhaXIgb2YgbG9jYWxlcyBhbmQgdGhlaXIgc291cmNlXG5cdFx0XHRcdGZvciAoIGtleSBpbiBzb3VyY2UgKSB7XG5cdFx0XHRcdFx0aWYgKCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoIHNvdXJjZSwga2V5ICkgKSB7XG5cdFx0XHRcdFx0XHRsb2NhbGUgPSBrZXk7XG5cdFx0XHRcdFx0XHQvLyBObyB7bG9jYWxlfSBnaXZlbiwgYXNzdW1lIGRhdGEgaXMgYSBncm91cCBvZiBsYW5ndWFnZXMsXG5cdFx0XHRcdFx0XHQvLyBjYWxsIHRoaXMgZnVuY3Rpb24gYWdhaW4gZm9yIGVhY2ggbGFuZ3VhZ2UuXG5cdFx0XHRcdFx0XHRkZWZlcnJlZHMucHVzaCggbWVzc2FnZVN0b3JlLmxvYWQoIHNvdXJjZVsga2V5IF0sIGxvY2FsZSApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiAkLndoZW4uYXBwbHkoICQsIGRlZmVycmVkcyApO1xuXHRcdFx0fVxuXG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFNldCBtZXNzYWdlcyB0byB0aGUgZ2l2ZW4gbG9jYWxlLlxuXHRcdCAqIElmIGxvY2FsZSBleGlzdHMsIGFkZCBtZXNzYWdlcyB0byB0aGUgbG9jYWxlLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGxvY2FsZVxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBtZXNzYWdlc1xuXHRcdCAqL1xuXHRcdHNldDogZnVuY3Rpb24gKCBsb2NhbGUsIG1lc3NhZ2VzICkge1xuXHRcdFx0aWYgKCAhdGhpcy5tZXNzYWdlc1sgbG9jYWxlIF0gKSB7XG5cdFx0XHRcdHRoaXMubWVzc2FnZXNbIGxvY2FsZSBdID0gbWVzc2FnZXM7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLm1lc3NhZ2VzWyBsb2NhbGUgXSA9ICQuZXh0ZW5kKCB0aGlzLm1lc3NhZ2VzWyBsb2NhbGUgXSwgbWVzc2FnZXMgKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gbG9jYWxlXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VLZXlcblx0XHQgKiBAcmV0dXJuIHtib29sZWFufVxuXHRcdCAqL1xuXHRcdGdldDogZnVuY3Rpb24gKCBsb2NhbGUsIG1lc3NhZ2VLZXkgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5tZXNzYWdlc1sgbG9jYWxlIF0gJiYgdGhpcy5tZXNzYWdlc1sgbG9jYWxlIF1bIG1lc3NhZ2VLZXkgXTtcblx0XHR9XG5cdH07XG5cblx0JC5leHRlbmQoICQuaTE4bi5tZXNzYWdlU3RvcmUsIG5ldyBNZXNzYWdlU3RvcmUoKSApO1xufSggalF1ZXJ5ICkgKTtcbiIsIi8qIVxuICogalF1ZXJ5IEludGVybmF0aW9uYWxpemF0aW9uIGxpYnJhcnlcbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTEtMjAxMyBTYW50aG9zaCBUaG90dGluZ2FsLCBOZWlsIEthbmRhbGdhb25rYXJcbiAqXG4gKiBqcXVlcnkuaTE4biBpcyBkdWFsIGxpY2Vuc2VkIEdQTHYyIG9yIGxhdGVyIGFuZCBNSVQuIFlvdSBkb24ndCBoYXZlIHRvIGRvXG4gKiBhbnl0aGluZyBzcGVjaWFsIHRvIGNob29zZSBvbmUgbGljZW5zZSBvciB0aGUgb3RoZXIgYW5kIHlvdSBkb24ndCBoYXZlIHRvXG4gKiBub3RpZnkgYW55b25lIHdoaWNoIGxpY2Vuc2UgeW91IGFyZSB1c2luZy4gWW91IGFyZSBmcmVlIHRvIHVzZVxuICogVW5pdmVyc2FsTGFuZ3VhZ2VTZWxlY3RvciBpbiBjb21tZXJjaWFsIHByb2plY3RzIGFzIGxvbmcgYXMgdGhlIGNvcHlyaWdodFxuICogaGVhZGVyIGlzIGxlZnQgaW50YWN0LiBTZWUgZmlsZXMgR1BMLUxJQ0VOU0UgYW5kIE1JVC1MSUNFTlNFIGZvciBkZXRhaWxzLlxuICpcbiAqIEBsaWNlbmNlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbmNlIDIuMCBvciBsYXRlclxuICogQGxpY2VuY2UgTUlUIExpY2Vuc2VcbiAqL1xuXG4oIGZ1bmN0aW9uICggJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBNZXNzYWdlUGFyc2VyID0gZnVuY3Rpb24gKCBvcHRpb25zICkge1xuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKCB7fSwgJC5pMThuLnBhcnNlci5kZWZhdWx0cywgb3B0aW9ucyApO1xuXHRcdHRoaXMubGFuZ3VhZ2UgPSAkLmkxOG4ubGFuZ3VhZ2VzWyBTdHJpbmcubG9jYWxlIF0gfHwgJC5pMThuLmxhbmd1YWdlc1sgJ2RlZmF1bHQnIF07XG5cdFx0dGhpcy5lbWl0dGVyID0gJC5pMThuLnBhcnNlci5lbWl0dGVyO1xuXHR9O1xuXG5cdE1lc3NhZ2VQYXJzZXIucHJvdG90eXBlID0ge1xuXG5cdFx0Y29uc3RydWN0b3I6IE1lc3NhZ2VQYXJzZXIsXG5cblx0XHRzaW1wbGVQYXJzZTogZnVuY3Rpb24gKCBtZXNzYWdlLCBwYXJhbWV0ZXJzICkge1xuXHRcdFx0cmV0dXJuIG1lc3NhZ2UucmVwbGFjZSggL1xcJChcXGQrKS9nLCBmdW5jdGlvbiAoIHN0ciwgbWF0Y2ggKSB7XG5cdFx0XHRcdHZhciBpbmRleCA9IHBhcnNlSW50KCBtYXRjaCwgMTAgKSAtIDE7XG5cblx0XHRcdFx0cmV0dXJuIHBhcmFtZXRlcnNbIGluZGV4IF0gIT09IHVuZGVmaW5lZCA/IHBhcmFtZXRlcnNbIGluZGV4IF0gOiAnJCcgKyBtYXRjaDtcblx0XHRcdH0gKTtcblx0XHR9LFxuXG5cdFx0cGFyc2U6IGZ1bmN0aW9uICggbWVzc2FnZSwgcmVwbGFjZW1lbnRzICkge1xuXHRcdFx0aWYgKCBtZXNzYWdlLmluZGV4T2YoICd7eycgKSA8IDAgKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnNpbXBsZVBhcnNlKCBtZXNzYWdlLCByZXBsYWNlbWVudHMgKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5lbWl0dGVyLmxhbmd1YWdlID0gJC5pMThuLmxhbmd1YWdlc1sgJC5pMThuKCkubG9jYWxlIF0gfHxcblx0XHRcdFx0JC5pMThuLmxhbmd1YWdlc1sgJ2RlZmF1bHQnIF07XG5cblx0XHRcdHJldHVybiB0aGlzLmVtaXR0ZXIuZW1pdCggdGhpcy5hc3QoIG1lc3NhZ2UgKSwgcmVwbGFjZW1lbnRzICk7XG5cdFx0fSxcblxuXHRcdGFzdDogZnVuY3Rpb24gKCBtZXNzYWdlICkge1xuXHRcdFx0dmFyIHBpcGUsIGNvbG9uLCBiYWNrc2xhc2gsIGFueUNoYXJhY3RlciwgZG9sbGFyLCBkaWdpdHMsIHJlZ3VsYXJMaXRlcmFsLFxuXHRcdFx0XHRyZWd1bGFyTGl0ZXJhbFdpdGhvdXRCYXIsIHJlZ3VsYXJMaXRlcmFsV2l0aG91dFNwYWNlLCBlc2NhcGVkT3JMaXRlcmFsV2l0aG91dEJhcixcblx0XHRcdFx0ZXNjYXBlZE9yUmVndWxhckxpdGVyYWwsIHRlbXBsYXRlQ29udGVudHMsIHRlbXBsYXRlTmFtZSwgb3BlblRlbXBsYXRlLFxuXHRcdFx0XHRjbG9zZVRlbXBsYXRlLCBleHByZXNzaW9uLCBwYXJhbUV4cHJlc3Npb24sIHJlc3VsdCxcblx0XHRcdFx0cG9zID0gMDtcblxuXHRcdFx0Ly8gVHJ5IHBhcnNlcnMgdW50aWwgb25lIHdvcmtzLCBpZiBub25lIHdvcmsgcmV0dXJuIG51bGxcblx0XHRcdGZ1bmN0aW9uIGNob2ljZSggcGFyc2VyU3ludGF4ICkge1xuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZhciBpLCByZXN1bHQ7XG5cblx0XHRcdFx0XHRmb3IgKCBpID0gMDsgaSA8IHBhcnNlclN5bnRheC5sZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0XHRcdHJlc3VsdCA9IHBhcnNlclN5bnRheFsgaSBdKCk7XG5cblx0XHRcdFx0XHRcdGlmICggcmVzdWx0ICE9PSBudWxsICkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUcnkgc2V2ZXJhbCBwYXJzZXJTeW50YXgtZXMgaW4gYSByb3cuXG5cdFx0XHQvLyBBbGwgbXVzdCBzdWNjZWVkOyBvdGhlcndpc2UsIHJldHVybiBudWxsLlxuXHRcdFx0Ly8gVGhpcyBpcyB0aGUgb25seSBlYWdlciBvbmUuXG5cdFx0XHRmdW5jdGlvbiBzZXF1ZW5jZSggcGFyc2VyU3ludGF4ICkge1xuXHRcdFx0XHR2YXIgaSwgcmVzLFxuXHRcdFx0XHRcdG9yaWdpbmFsUG9zID0gcG9zLFxuXHRcdFx0XHRcdHJlc3VsdCA9IFtdO1xuXG5cdFx0XHRcdGZvciAoIGkgPSAwOyBpIDwgcGFyc2VyU3ludGF4Lmxlbmd0aDsgaSsrICkge1xuXHRcdFx0XHRcdHJlcyA9IHBhcnNlclN5bnRheFsgaSBdKCk7XG5cblx0XHRcdFx0XHRpZiAoIHJlcyA9PT0gbnVsbCApIHtcblx0XHRcdFx0XHRcdHBvcyA9IG9yaWdpbmFsUG9zO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXN1bHQucHVzaCggcmVzICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSdW4gdGhlIHNhbWUgcGFyc2VyIG92ZXIgYW5kIG92ZXIgdW50aWwgaXQgZmFpbHMuXG5cdFx0XHQvLyBNdXN0IHN1Y2NlZWQgYSBtaW5pbXVtIG9mIG4gdGltZXM7IG90aGVyd2lzZSwgcmV0dXJuIG51bGwuXG5cdFx0XHRmdW5jdGlvbiBuT3JNb3JlKCBuLCBwICkge1xuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZhciBvcmlnaW5hbFBvcyA9IHBvcyxcblx0XHRcdFx0XHRcdHJlc3VsdCA9IFtdLFxuXHRcdFx0XHRcdFx0cGFyc2VkID0gcCgpO1xuXG5cdFx0XHRcdFx0d2hpbGUgKCBwYXJzZWQgIT09IG51bGwgKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQucHVzaCggcGFyc2VkICk7XG5cdFx0XHRcdFx0XHRwYXJzZWQgPSBwKCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCByZXN1bHQubGVuZ3RoIDwgbiApIHtcblx0XHRcdFx0XHRcdHBvcyA9IG9yaWdpbmFsUG9zO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBIZWxwZXJzIC0tIGp1c3QgbWFrZSBwYXJzZXJTeW50YXggb3V0IG9mIHNpbXBsZXIgSlMgYnVpbHRpbiB0eXBlc1xuXG5cdFx0XHRmdW5jdGlvbiBtYWtlU3RyaW5nUGFyc2VyKCBzICkge1xuXHRcdFx0XHR2YXIgbGVuID0gcy5sZW5ndGg7XG5cblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgcmVzdWx0ID0gbnVsbDtcblxuXHRcdFx0XHRcdGlmICggbWVzc2FnZS5zbGljZSggcG9zLCBwb3MgKyBsZW4gKSA9PT0gcyApIHtcblx0XHRcdFx0XHRcdHJlc3VsdCA9IHM7XG5cdFx0XHRcdFx0XHRwb3MgKz0gbGVuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIG1ha2VSZWdleFBhcnNlciggcmVnZXggKSB7XG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dmFyIG1hdGNoZXMgPSBtZXNzYWdlLnNsaWNlKCBwb3MgKS5tYXRjaCggcmVnZXggKTtcblxuXHRcdFx0XHRcdGlmICggbWF0Y2hlcyA9PT0gbnVsbCApIHtcblx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHBvcyArPSBtYXRjaGVzWyAwIF0ubGVuZ3RoO1xuXG5cdFx0XHRcdFx0cmV0dXJuIG1hdGNoZXNbIDAgXTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0cGlwZSA9IG1ha2VTdHJpbmdQYXJzZXIoICd8JyApO1xuXHRcdFx0Y29sb24gPSBtYWtlU3RyaW5nUGFyc2VyKCAnOicgKTtcblx0XHRcdGJhY2tzbGFzaCA9IG1ha2VTdHJpbmdQYXJzZXIoICdcXFxcJyApO1xuXHRcdFx0YW55Q2hhcmFjdGVyID0gbWFrZVJlZ2V4UGFyc2VyKCAvXi4vICk7XG5cdFx0XHRkb2xsYXIgPSBtYWtlU3RyaW5nUGFyc2VyKCAnJCcgKTtcblx0XHRcdGRpZ2l0cyA9IG1ha2VSZWdleFBhcnNlciggL15cXGQrLyApO1xuXHRcdFx0cmVndWxhckxpdGVyYWwgPSBtYWtlUmVnZXhQYXJzZXIoIC9eW157fVtcXF0kXFxcXF0vICk7XG5cdFx0XHRyZWd1bGFyTGl0ZXJhbFdpdGhvdXRCYXIgPSBtYWtlUmVnZXhQYXJzZXIoIC9eW157fVtcXF0kXFxcXHxdLyApO1xuXHRcdFx0cmVndWxhckxpdGVyYWxXaXRob3V0U3BhY2UgPSBtYWtlUmVnZXhQYXJzZXIoIC9eW157fVtcXF0kXFxzXS8gKTtcblxuXHRcdFx0Ly8gVGhlcmUgaXMgYSBnZW5lcmFsIHBhdHRlcm46XG5cdFx0XHQvLyBwYXJzZSBhIHRoaW5nO1xuXHRcdFx0Ly8gaWYgaXQgd29ya2VkLCBhcHBseSB0cmFuc2Zvcm0sXG5cdFx0XHQvLyBvdGhlcndpc2UgcmV0dXJuIG51bGwuXG5cdFx0XHQvLyBCdXQgdXNpbmcgdGhpcyBhcyBhIGNvbWJpbmF0b3Igc2VlbXMgdG8gY2F1c2UgcHJvYmxlbXNcblx0XHRcdC8vIHdoZW4gY29tYmluZWQgd2l0aCBuT3JNb3JlKCkuXG5cdFx0XHQvLyBNYXkgYmUgc29tZSBzY29waW5nIGlzc3VlLlxuXHRcdFx0ZnVuY3Rpb24gdHJhbnNmb3JtKCBwLCBmbiApIHtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgcmVzdWx0ID0gcCgpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdCA9PT0gbnVsbCA/IG51bGwgOiBmbiggcmVzdWx0ICk7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdC8vIFVzZWQgdG8gZGVmaW5lIFwibGl0ZXJhbHNcIiB3aXRoaW4gdGVtcGxhdGUgcGFyYW1ldGVycy4gVGhlIHBpcGVcblx0XHRcdC8vIGNoYXJhY3RlciBpcyB0aGUgcGFyYW1ldGVyIGRlbGltZXRlciwgc28gYnkgZGVmYXVsdFxuXHRcdFx0Ly8gaXQgaXMgbm90IGEgbGl0ZXJhbCBpbiB0aGUgcGFyYW1ldGVyXG5cdFx0XHRmdW5jdGlvbiBsaXRlcmFsV2l0aG91dEJhcigpIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IG5Pck1vcmUoIDEsIGVzY2FwZWRPckxpdGVyYWxXaXRob3V0QmFyICkoKTtcblxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0ID09PSBudWxsID8gbnVsbCA6IHJlc3VsdC5qb2luKCAnJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBsaXRlcmFsKCkge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gbk9yTW9yZSggMSwgZXNjYXBlZE9yUmVndWxhckxpdGVyYWwgKSgpO1xuXG5cdFx0XHRcdHJldHVybiByZXN1bHQgPT09IG51bGwgPyBudWxsIDogcmVzdWx0LmpvaW4oICcnICk7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIGVzY2FwZWRMaXRlcmFsKCkge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gc2VxdWVuY2UoIFsgYmFja3NsYXNoLCBhbnlDaGFyYWN0ZXIgXSApO1xuXG5cdFx0XHRcdHJldHVybiByZXN1bHQgPT09IG51bGwgPyBudWxsIDogcmVzdWx0WyAxIF07XG5cdFx0XHR9XG5cblx0XHRcdGNob2ljZSggWyBlc2NhcGVkTGl0ZXJhbCwgcmVndWxhckxpdGVyYWxXaXRob3V0U3BhY2UgXSApO1xuXHRcdFx0ZXNjYXBlZE9yTGl0ZXJhbFdpdGhvdXRCYXIgPSBjaG9pY2UoIFsgZXNjYXBlZExpdGVyYWwsIHJlZ3VsYXJMaXRlcmFsV2l0aG91dEJhciBdICk7XG5cdFx0XHRlc2NhcGVkT3JSZWd1bGFyTGl0ZXJhbCA9IGNob2ljZSggWyBlc2NhcGVkTGl0ZXJhbCwgcmVndWxhckxpdGVyYWwgXSApO1xuXG5cdFx0XHRmdW5jdGlvbiByZXBsYWNlbWVudCgpIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHNlcXVlbmNlKCBbIGRvbGxhciwgZGlnaXRzIF0gKTtcblxuXHRcdFx0XHRpZiAoIHJlc3VsdCA9PT0gbnVsbCApIHtcblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBbICdSRVBMQUNFJywgcGFyc2VJbnQoIHJlc3VsdFsgMSBdLCAxMCApIC0gMSBdO1xuXHRcdFx0fVxuXG5cdFx0XHR0ZW1wbGF0ZU5hbWUgPSB0cmFuc2Zvcm0oXG5cdFx0XHRcdC8vIHNlZSAkd2dMZWdhbFRpdGxlQ2hhcnNcblx0XHRcdFx0Ly8gbm90IGFsbG93aW5nIDogZHVlIHRvIHRoZSBuZWVkIHRvIGNhdGNoIFwiUExVUkFMOiQxXCJcblx0XHRcdFx0bWFrZVJlZ2V4UGFyc2VyKCAvXlsgIVwiJCYnKCkqLC4vMC05Oz0/QEEtWl5fYGEten5cXHg4MC1cXHhGRistXSsvICksXG5cblx0XHRcdFx0ZnVuY3Rpb24gKCByZXN1bHQgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdC50b1N0cmluZygpO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0XHRmdW5jdGlvbiB0ZW1wbGF0ZVBhcmFtKCkge1xuXHRcdFx0XHR2YXIgZXhwcixcblx0XHRcdFx0XHRyZXN1bHQgPSBzZXF1ZW5jZSggWyBwaXBlLCBuT3JNb3JlKCAwLCBwYXJhbUV4cHJlc3Npb24gKSBdICk7XG5cblx0XHRcdFx0aWYgKCByZXN1bHQgPT09IG51bGwgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRleHByID0gcmVzdWx0WyAxIF07XG5cblx0XHRcdFx0Ly8gdXNlIGEgXCJDT05DQVRcIiBvcGVyYXRvciBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgbm9kZXMsXG5cdFx0XHRcdC8vIG90aGVyd2lzZSByZXR1cm4gdGhlIGZpcnN0IG5vZGUsIHJhdy5cblx0XHRcdFx0cmV0dXJuIGV4cHIubGVuZ3RoID4gMSA/IFsgJ0NPTkNBVCcgXS5jb25jYXQoIGV4cHIgKSA6IGV4cHJbIDAgXTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gdGVtcGxhdGVXaXRoUmVwbGFjZW1lbnQoKSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBzZXF1ZW5jZSggWyB0ZW1wbGF0ZU5hbWUsIGNvbG9uLCByZXBsYWNlbWVudCBdICk7XG5cblx0XHRcdFx0cmV0dXJuIHJlc3VsdCA9PT0gbnVsbCA/IG51bGwgOiBbIHJlc3VsdFsgMCBdLCByZXN1bHRbIDIgXSBdO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiB0ZW1wbGF0ZVdpdGhPdXRSZXBsYWNlbWVudCgpIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHNlcXVlbmNlKCBbIHRlbXBsYXRlTmFtZSwgY29sb24sIHBhcmFtRXhwcmVzc2lvbiBdICk7XG5cblx0XHRcdFx0cmV0dXJuIHJlc3VsdCA9PT0gbnVsbCA/IG51bGwgOiBbIHJlc3VsdFsgMCBdLCByZXN1bHRbIDIgXSBdO1xuXHRcdFx0fVxuXG5cdFx0XHR0ZW1wbGF0ZUNvbnRlbnRzID0gY2hvaWNlKCBbXG5cdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgcmVzID0gc2VxdWVuY2UoIFtcblx0XHRcdFx0XHRcdC8vIHRlbXBsYXRlcyBjYW4gaGF2ZSBwbGFjZWhvbGRlcnMgZm9yIGR5bmFtaWNcblx0XHRcdFx0XHRcdC8vIHJlcGxhY2VtZW50IGVnOiB7e1BMVVJBTDokMXxvbmUgY2FyfCQxIGNhcnN9fVxuXHRcdFx0XHRcdFx0Ly8gb3Igbm8gcGxhY2Vob2xkZXJzIGVnOlxuXHRcdFx0XHRcdFx0Ly8ge3tHUkFNTUFSOmdlbml0aXZlfHt7U0lURU5BTUV9fX1cblx0XHRcdFx0XHRcdGNob2ljZSggWyB0ZW1wbGF0ZVdpdGhSZXBsYWNlbWVudCwgdGVtcGxhdGVXaXRoT3V0UmVwbGFjZW1lbnQgXSApLFxuXHRcdFx0XHRcdFx0bk9yTW9yZSggMCwgdGVtcGxhdGVQYXJhbSApXG5cdFx0XHRcdFx0XSApO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHJlcyA9PT0gbnVsbCA/IG51bGwgOiByZXNbIDAgXS5jb25jYXQoIHJlc1sgMSBdICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgcmVzID0gc2VxdWVuY2UoIFsgdGVtcGxhdGVOYW1lLCBuT3JNb3JlKCAwLCB0ZW1wbGF0ZVBhcmFtICkgXSApO1xuXG5cdFx0XHRcdFx0aWYgKCByZXMgPT09IG51bGwgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gWyByZXNbIDAgXSBdLmNvbmNhdCggcmVzWyAxIF0gKTtcblx0XHRcdFx0fVxuXHRcdFx0XSApO1xuXG5cdFx0XHRvcGVuVGVtcGxhdGUgPSBtYWtlU3RyaW5nUGFyc2VyKCAne3snICk7XG5cdFx0XHRjbG9zZVRlbXBsYXRlID0gbWFrZVN0cmluZ1BhcnNlciggJ319JyApO1xuXG5cdFx0XHRmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHNlcXVlbmNlKCBbIG9wZW5UZW1wbGF0ZSwgdGVtcGxhdGVDb250ZW50cywgY2xvc2VUZW1wbGF0ZSBdICk7XG5cblx0XHRcdFx0cmV0dXJuIHJlc3VsdCA9PT0gbnVsbCA/IG51bGwgOiByZXN1bHRbIDEgXTtcblx0XHRcdH1cblxuXHRcdFx0ZXhwcmVzc2lvbiA9IGNob2ljZSggWyB0ZW1wbGF0ZSwgcmVwbGFjZW1lbnQsIGxpdGVyYWwgXSApO1xuXHRcdFx0cGFyYW1FeHByZXNzaW9uID0gY2hvaWNlKCBbIHRlbXBsYXRlLCByZXBsYWNlbWVudCwgbGl0ZXJhbFdpdGhvdXRCYXIgXSApO1xuXG5cdFx0XHRmdW5jdGlvbiBzdGFydCgpIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IG5Pck1vcmUoIDAsIGV4cHJlc3Npb24gKSgpO1xuXG5cdFx0XHRcdGlmICggcmVzdWx0ID09PSBudWxsICkge1xuXHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIFsgJ0NPTkNBVCcgXS5jb25jYXQoIHJlc3VsdCApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXN1bHQgPSBzdGFydCgpO1xuXG5cdFx0XHQvKlxuXHRcdFx0ICogRm9yIHN1Y2Nlc3MsIHRoZSBwb3MgbXVzdCBoYXZlIGdvdHRlbiB0byB0aGUgZW5kIG9mIHRoZSBpbnB1dFxuXHRcdFx0ICogYW5kIHJldHVybmVkIGEgbm9uLW51bGwuXG5cdFx0XHQgKiBuLmIuIFRoaXMgaXMgcGFydCBvZiBsYW5ndWFnZSBpbmZyYXN0cnVjdHVyZSwgc28gd2UgZG8gbm90IHRocm93IGFuXG5cdFx0XHQgKiBpbnRlcm5hdGlvbmFsaXphYmxlIG1lc3NhZ2UuXG5cdFx0XHQgKi9cblx0XHRcdGlmICggcmVzdWx0ID09PSBudWxsIHx8IHBvcyAhPT0gbWVzc2FnZS5sZW5ndGggKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvciggJ1BhcnNlIGVycm9yIGF0IHBvc2l0aW9uICcgKyBwb3MudG9TdHJpbmcoKSArICcgaW4gaW5wdXQ6ICcgKyBtZXNzYWdlICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXG5cdH07XG5cblx0JC5leHRlbmQoICQuaTE4bi5wYXJzZXIsIG5ldyBNZXNzYWdlUGFyc2VyKCkgKTtcbn0oIGpRdWVyeSApICk7IiwidmFyIGNvZGVFeGVyY2lzZXM7XG52YXIgcHJlc2VudGVyQ3NzTGluaztcbnZhciBwcmVzZW50TW9kZUluaXRpYWxpemVkID0gZmFsc2U7XG5cbmZ1bmN0aW9uIHByZXNlbnRUb2dnbGUoKSB7XG4gICAgaWYgKCFwcmVzZW50TW9kZUluaXRpYWxpemVkKSB7XG4gICAgICAgIHByZXNlbnRNb2RlU2V0dXAoKTtcbiAgICAgICAgcHJlc2VudE1vZGVJbml0aWFsaXplZCA9IHRydWU7XG4gICAgfVxuICAgIGxldCBib2QgPSAkKFwiYm9keVwiKTtcbiAgICBsZXQgcHJlc2VudENsYXNzID0gXCJwcmVzZW50XCI7XG4gICAgbGV0IGZ1bGxIZWlnaHRDbGFzcyA9IFwiZnVsbC1oZWlnaHRcIjtcbiAgICBsZXQgYm90dG9tQ2xhc3MgPSBcImJvdHRvbVwiO1xuICAgIGlmIChib2QuaGFzQ2xhc3MocHJlc2VudENsYXNzKSkge1xuICAgICAgICAkKFwic2VjdGlvbiAqXCIpXG4gICAgICAgICAgICAubm90KFxuICAgICAgICAgICAgICAgIFwiaDEsIC5wcmVzZW50YXRpb24tdGl0bGUsIC5idG4tcHJlc2VudGVyLCAucnVuZXN0b25lLCAucnVuZXN0b25lICosIHNlY3Rpb24sIC5wcmUsIGNvZGVcIlxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpOyAvL3Nob3cgZXZlcnl0aGluZ1xuICAgICAgICAkKFwiI2NvbXBsZXRpb25CdXR0b25cIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XG4gICAgICAgIGJvZC5yZW1vdmVDbGFzcyhwcmVzZW50Q2xhc3MpO1xuICAgICAgICAkKFwiLlwiICsgZnVsbEhlaWdodENsYXNzKS5yZW1vdmVDbGFzcyhmdWxsSGVpZ2h0Q2xhc3MpO1xuICAgICAgICAkKFwiLlwiICsgYm90dG9tQ2xhc3MpLnJlbW92ZUNsYXNzKGJvdHRvbUNsYXNzKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJwcmVzZW50TW9kZVwiLCBcInRleHRcIik7XG4gICAgICAgIGNvZGVFeGVyY2lzZXMucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XG4gICAgICAgIHByZXNlbnRlckNzc0xpbmsuZGlzYWJsZWQgPSB0cnVlOyAvLyBkaXNhYmxlIHByZXNlbnRfbW9kZS5jc3NcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKFwic2VjdGlvbiAqXCIpXG4gICAgICAgICAgICAubm90KFxuICAgICAgICAgICAgICAgIFwiaDEsIC5wcmVzZW50YXRpb24tdGl0bGUsIC5idG4tcHJlc2VudGVyLCAucnVuZXN0b25lLCAucnVuZXN0b25lICosIHNlY3Rpb24sIC5wcmUsIGNvZGVcIlxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZENsYXNzKFwiaGlkZGVuXCIpOyAvLyBoaWRlIGV4dHJhbmVvdXMgc3R1ZmZcbiAgICAgICAgJChcIiNjb21wbGV0aW9uQnV0dG9uXCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpO1xuICAgICAgICBib2QuYWRkQ2xhc3MocHJlc2VudENsYXNzKTtcbiAgICAgICAgYm9kLmFkZENsYXNzKGZ1bGxIZWlnaHRDbGFzcyk7XG4gICAgICAgICQoXCJodG1sXCIpLmFkZENsYXNzKGZ1bGxIZWlnaHRDbGFzcyk7XG4gICAgICAgICQoXCJzZWN0aW9uIC5ydW5lc3RvbmVcIikuYWRkQ2xhc3MoZnVsbEhlaWdodENsYXNzKTtcbiAgICAgICAgJChcIi5hYy1jYXB0aW9uXCIpLmFkZENsYXNzKGJvdHRvbUNsYXNzKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJwcmVzZW50TW9kZVwiLCBwcmVzZW50Q2xhc3MpO1xuICAgICAgICAvLyBwcmVzZW50ZXJfbW9kZS5jc3MgaXMgbG9hZGVkIGJ5IHdlYnBhY2tcbiAgICAgICAgLy9sb2FkUHJlc2VudGVyQ3NzKCk7IC8vIHByZXNlbnRfbW9kZS5jc3Mgc2hvdWxkIG9ubHkgYXBwbHkgd2hlbiBpbiBwcmVzZW50ZXIgbW9kZS5cbiAgICAgICAgYWN0aXZhdGVFeGVyY2lzZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbG9hZFByZXNlbnRlckNzcygpIHtcbiAgICBwcmVzZW50ZXJDc3NMaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG4gICAgcHJlc2VudGVyQ3NzTGluay50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuICAgIHByZXNlbnRlckNzc0xpbmsuaHJlZiA9IFwiLi4vX3N0YXRpYy9wcmVzZW50ZXJfbW9kZS5jc3NcIjtcbiAgICBwcmVzZW50ZXJDc3NMaW5rLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXS5hcHBlbmRDaGlsZChwcmVzZW50ZXJDc3NMaW5rKTtcbn1cblxuZnVuY3Rpb24gcHJlc2VudE1vZGVTZXR1cCgpIHtcbiAgICAvLyBtb3ZlZCB0aGlzIG91dCBvZiBjb25maWd1cmVcbiAgICBsZXQgZGF0YUNvbXBvbmVudCA9ICQoXCJbZGF0YS1jaGlsZGNvbXBvbmVudF1cIik7XG5cbiAgICAvLyB0aGlzIHN0aWxsIGxlYXZlcyBzb21lIHRoaW5ncyBzZW1pLW1lc3NlZCB1cCB3aGVuIHlvdSBleGl0IHByZXNlbnRlciBtb2RlLlxuICAgIC8vIGJ1dCBpbnN0cnVjdG9ycyB3aWxsIHByb2JhYmx5IGp1c3QgbGVhcm4gdG8gcmVmcmVzaCB0aGUgcGFnZS5cbiAgICBkYXRhQ29tcG9uZW50LmFkZENsYXNzKFwicnVuZXN0b25lXCIpO1xuICAgIGRhdGFDb21wb25lbnQucGFyZW50KCkuY2xvc2VzdChcImRpdlwiKS5ub3QoXCJzZWN0aW9uXCIpLmFkZENsYXNzKFwicnVuZXN0b25lXCIpO1xuICAgIGRhdGFDb21wb25lbnQucGFyZW50KCkuY2xvc2VzdChcImRpdlwiKS5jc3MoXCJtYXgtd2lkdGhcIiwgXCJub25lXCIpO1xuXG4gICAgZGF0YUNvbXBvbmVudC5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICBsZXQgbWUgPSAkKHRoaXMpO1xuICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAuZmluZChcIi5hY19jb2RlX2RpdiwgLmFjX291dHB1dFwiKVxuICAgICAgICAgICAgLndyYXBBbGwoXCI8ZGl2IGNsYXNzPSdhYy1ibG9jaycgc3R5bGU9J3dpZHRoOiAxMDAlOyc+PC9kaXY+XCIpO1xuICAgIH0pO1xuXG4gICAgY29kZWxlbnNMaXN0ZW5lcig1MDApO1xuICAgICQoXCJzZWN0aW9uIGltZ1wiKS53cmFwKCc8ZGl2IGNsYXNzPVwicnVuZXN0b25lXCI+Jyk7XG4gICAgY29kZUV4ZXJjaXNlcyA9ICQoXCIucnVuZXN0b25lXCIpLm5vdChcIi5ydW5lc3RvbmUgLnJ1bmVzdG9uZVwiKTtcbiAgICAvLyBjb2RlRXhlcmNpc2VzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAkKFwiaDFcIikuYmVmb3JlKFxuICAgICAgICBcIjxkaXYgY2xhc3M9J3ByZXNlbnRhdGlvbi10aXRsZSc+IFxcXG4gICAgICAgIDxidXR0b24gY2xhc3M9J3ByZXYtZXhlcmNpc2UgYnRuLXByZXNlbnRlciBidG4tZ3JleS1vdXRsaW5lJyBvbmNsaWNrPSdwcmV2RXhlcmNpc2UoKSc+QmFjazwvYnV0dG9uPiBcXFxuICAgICAgICA8YnV0dG9uIGNsYXNzPSduZXh0LWV4ZXJjaXNlIGJ0bi1wcmVzZW50ZXIgYnRuLWdyZXktc29saWQnIG9uY2xpY2s9J25leHRFeGVyY2lzZSgpJz5OZXh0PC9idXR0b24+IFxcXG4gICAgICA8L2Rpdj5cIlxuICAgICk7XG59XG5mdW5jdGlvbiBnZXRBY3RpdmVFeGVyY2lzZSgpIHtcbiAgICByZXR1cm4gKGFjdGl2ZSA9IGNvZGVFeGVyY2lzZXMuZmlsdGVyKFwiLmFjdGl2ZVwiKSk7XG59XG5cbmZ1bmN0aW9uIGFjdGl2YXRlRXhlcmNpc2UoaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIGluZGV4ID09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaW5kZXggPSAwO1xuICAgIH1cblxuICAgIGxldCBhY3RpdmUgPSBnZXRBY3RpdmVFeGVyY2lzZSgpO1xuXG4gICAgaWYgKGNvZGVFeGVyY2lzZXMubGVuZ3RoKSB7XG4gICAgICAgIGFjdGl2ZS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgYWN0aXZlID0gJChjb2RlRXhlcmNpc2VzW2luZGV4XSkuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgIGFjdGl2ZS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKTtcbiAgICAgICAgY29kZUV4ZXJjaXNlcy5ub3QoY29kZUV4ZXJjaXNlcy5maWx0ZXIoXCIuYWN0aXZlXCIpKS5hZGRDbGFzcyhcImhpZGRlblwiKTtcbiAgICB9XG59XG5cbndpbmRvdy5uZXh0RXhlcmNpc2UgPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgYWN0aXZlID0gZ2V0QWN0aXZlRXhlcmNpc2UoKTtcbiAgICBsZXQgbmV4dEluZGV4ID0gY29kZUV4ZXJjaXNlcy5pbmRleChhY3RpdmUpICsgMTtcbiAgICBpZiAobmV4dEluZGV4IDwgY29kZUV4ZXJjaXNlcy5sZW5ndGgpIHtcbiAgICAgICAgYWN0aXZhdGVFeGVyY2lzZShuZXh0SW5kZXgpO1xuICAgIH1cbn1cblxud2luZG93LnByZXZFeGVyY2lzZSA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBhY3RpdmUgPSBnZXRBY3RpdmVFeGVyY2lzZSgpO1xuICAgIGxldCBwcmV2SW5kZXggPSBjb2RlRXhlcmNpc2VzLmluZGV4KGFjdGl2ZSkgLSAxO1xuICAgIGlmIChwcmV2SW5kZXggPj0gMCkge1xuICAgICAgICBhY3RpdmF0ZUV4ZXJjaXNlKHByZXZJbmRleCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjb25maWd1cmUoKSB7XG4gICAgbGV0IHJpZ2h0TmF2ID0gJChcIi5uYXZiYXItcmlnaHRcIik7XG4gICAgcmlnaHROYXYucHJlcGVuZChcbiAgICAgICAgXCI8bGkgY2xhc3M9J2Ryb3Bkb3duIHZpZXctdG9nZ2xlJz4gXFxcbiAgICAgIDxsYWJlbD5WaWV3OiBcXFxuICAgICAgICA8c2VsZWN0IGNsYXNzPSdtb2RlLXNlbGVjdCc+IFxcXG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT0ndGV4dCc+VGV4dGJvb2s8L29wdGlvbj4gXFxcbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPSdwcmVzZW50Jz5Db2RlIFByZXNlbnRlcjwvb3B0aW9uPiBcXFxuICAgICAgICA8L3NlbGVjdD4gXFxcbiAgICAgIDwvbGFiZWw+IFxcXG4gICAgPC9saT5cIlxuICAgICk7XG5cbiAgICBsZXQgbW9kZVNlbGVjdCA9ICQoXCIubW9kZS1zZWxlY3RcIikuY2hhbmdlKHByZXNlbnRUb2dnbGUpO1xufVxuXG5mdW5jdGlvbiBjb2RlbGVuc0xpc3RlbmVyKGR1cmF0aW9uKSB7XG4gICAgLy8gJChcIi5FeGVjdXRpb25WaXN1YWxpemVyXCIpLmxlbmd0aCA/IGNvbmZpZ3VyZUNvZGVsZW5zKCkgOiBzZXRUaW1lb3V0KGNvZGVsZW5zTGlzdGVuZXIsIGR1cmF0aW9uKTtcbiAgICAvLyBjb25maWd1cmVDb2RlbGVucygpO1xufVxuXG5mdW5jdGlvbiBjb25maWd1cmVDb2RlbGVucygpIHtcbiAgICBsZXQgYWNDb2RlVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDRcIik7XG4gICAgYWNDb2RlVGl0bGUudGV4dENvbnRlbnQgPSBcIkFjdGl2ZSBDb2RlIFdpbmRvd1wiO1xuICAgIGxldCBhY0NvZGUgPSAkKFwiLmFjX2NvZGVfZGl2XCIpO1xuICAgICQoXCIuYWNfY29kZV9kaXZcIikuYWRkQ2xhc3MoXCJjb2wtbWQtNlwiKTtcbiAgICBhY0NvZGUucHJlcGVuZChhY0NvZGVUaXRsZSk7XG5cbiAgICBhY091dFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg0XCIpO1xuICAgIGFjT3V0VGl0bGUudGV4dENvbnRlbnQgPSBcIk91dHB1dCBXaW5kb3dcIjtcbiAgICBsZXQgYWNPdXQgPSAkKFwiLmFjX291dHB1dFwiKS5hZGRDbGFzcyhcImNvbC1tZC02XCIpO1xuICAgICQoXCIuYWNfb3V0cHV0XCIpLnByZXBlbmQoYWNPdXRUaXRsZSk7XG5cbiAgICBsZXQgc2tldGNocGFkVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDRcIik7XG4gICAgc2tldGNocGFkVGl0bGUudGV4dENvbnRlbnQgPSBcIlNrZXRjaHBhZFwiO1xuICAgIGxldCBza2V0Y2hwYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAkKHNrZXRjaHBhZCkuYWRkQ2xhc3MoXCJza2V0Y2hwYWRcIik7XG4gICAgbGV0IHNrZXRjaHBhZENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgJChza2V0Y2hwYWRDb250YWluZXIpLmFkZENsYXNzKFwic2tldGNocGFkLWNvbnRhaW5lclwiKTtcbiAgICBza2V0Y2hwYWRDb250YWluZXIuYXBwZW5kQ2hpbGQoc2tldGNocGFkVGl0bGUpO1xuICAgIHNrZXRjaHBhZENvbnRhaW5lci5hcHBlbmRDaGlsZChza2V0Y2hwYWQpO1xuICAgIC8vJCgnLmFjX291dHB1dCcpLmFwcGVuZChza2V0Y2hwYWRDb250YWluZXIpO1xuXG4gICAgbGV0IHZpc3VhbGl6ZXJzID0gJChcIi5FeGVjdXRpb25WaXN1YWxpemVyXCIpO1xuXG4gICAgY29uc29sZS5sb2coXCJFY29udGFpbmVyOiBcIiwgdGhpcy5lQ29udGFpbmVyKTtcblxuICAgICQoXCJbZGF0YS1jaGlsZGNvbXBvbmVudF1cIikub24oXCJjbGlja1wiLCBcImJ1dHRvbi5yb3ctbW9kZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykuY2xvc2VzdChcIltkYXRhLWNoaWxkY29tcG9uZW50XVwiKS5yZW1vdmVDbGFzcyhcImNhcmQtbW9kZVwiKTtcbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KFwiW2RhdGEtY2hpbGRjb21wb25lbnRdXCIpLmFkZENsYXNzKFwicm93LW1vZGVcIik7XG4gICAgICAgICQodGhpcykubmV4dChcIi5jYXJkLW1vZGVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmUtbGF5b3V0XCIpO1xuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlLWxheW91dFwiKTtcbiAgICB9KTtcblxuICAgICQoXCJbZGF0YS1jaGlsZGNvbXBvbmVudF1cIikub24oXCJjbGlja1wiLCBcImJ1dHRvbi5jYXJkLW1vZGVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoXCJbZGF0YS1jaGlsZGNvbXBvbmVudF1cIikucmVtb3ZlQ2xhc3MoXCJyb3ctbW9kZVwiKTtcbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KFwiW2RhdGEtY2hpbGRjb21wb25lbnRdXCIpLmFkZENsYXNzKFwiY2FyZC1tb2RlXCIpO1xuICAgICAgICAkKHRoaXMpLnByZXYoXCIucm93LW1vZGVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmUtbGF5b3V0XCIpO1xuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlLWxheW91dFwiKTtcbiAgICB9KTtcblxuICAgICQoXCJbZGF0YS1jaGlsZGNvbXBvbmVudF0gLmFjX3NlY3Rpb25cIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykucHJlcGVuZChcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicHJlc2VudGF0aW9uLW9wdGlvbnNcIj48YnV0dG9uIGNsYXNzPVwicm93LW1vZGUgbGF5b3V0LWJ0blwiPjxpbWcgc3JjPVwiLi4vX2ltYWdlcy9yb3ctYnRuLWNvbnRlbnQucG5nXCIgYWx0PVwiUm93c1wiPjwvYnV0dG9uPjxidXR0b24gY2xhc3M9XCJjYXJkLW1vZGUgbGF5b3V0LWJ0blwiPjxpbWcgc3JjPVwiLi4vX2ltYWdlcy9jYXJkLWJ0bi1jb250ZW50LnBuZ1wiIGFsdD1cIkNhcmRcIj48L2J1dHRvbj48L2Rpdj4nXG4gICAgICAgICk7XG4gICAgfSk7XG5cbiAgICB2aXN1YWxpemVycy5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICBsZXQgbWUgPSAkKHRoaXMpO1xuICAgICAgICBsZXQgY29sMSA9IG1lLmZpbmQoXCIjdml6TGF5b3V0VGRGaXJzdFwiKTtcbiAgICAgICAgbGV0IGNvbDIgPSBtZS5maW5kKFwiI3ZpekxheW91dFRkU2Vjb25kXCIpO1xuICAgICAgICBsZXQgZGF0YVZpcyA9IG1lLmZpbmQoXCIjZGF0YVZpelwiKTtcbiAgICAgICAgbGV0IHN0YWNrSGVhcFRhYmxlID0gbWUuZmluZChcIiNzdGFja0hlYXBUYWJsZVwiKTtcbiAgICAgICAgbGV0IG91dHB1dCA9IG1lLmZpbmQoXCIjcHJvZ091dHB1dHNcIik7XG4gICAgICAgIG91dHB1dC5jc3MoXCJkaXNwbGF5XCIsIFwiYmxvY2tcIik7XG4gICAgICAgIG1lLnBhcmVudCgpLnByZXBlbmQoXG4gICAgICAgICAgICBcIjxkaXYgY2xhc3M9J3ByZXNlbnRhdGlvbi10aXRsZSc+PGRpdiBjbGFzcz0ndGl0bGUtdGV4dCc+IEV4YW1wbGUgXCIgK1xuICAgICAgICAgICAgICAgIChOdW1iZXIoaW5kZXgpICsgMSkgK1xuICAgICAgICAgICAgICAgIFwiPC9kaXY+PC9kaXY+XCJcbiAgICAgICAgKTtcbiAgICB9KTtcblxuICAgIGFjQ29kZS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHNlY3Rpb24gPSAkKHRoaXMpLmNsb3Nlc3QoXCIuYWMtYmxvY2tcIikucGFyZW50KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHNlY3Rpb24sIHNlY3Rpb24ubGVuZ3RoKTtcbiAgICAgICAgc2VjdGlvbi5hcHBlbmQoc2tldGNocGFkQ29udGFpbmVyKTtcbiAgICB9KTtcblxuICAgICQoXCJidXR0b24uY2FyZC1tb2RlXCIpLmNsaWNrKCk7XG5cbiAgICBsZXQgbW9kZVNlbGVjdCA9ICQoXCIubW9kZS1zZWxlY3RcIik7XG4gICAgbGV0IG1vZGUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInByZXNlbnRNb2RlXCIpO1xuICAgIGlmIChtb2RlID09IFwicHJlc2VudFwiKSB7XG4gICAgICAgIG1vZGVTZWxlY3QudmFsKFwicHJlc2VudFwiKTtcbiAgICAgICAgbW9kZVNlbGVjdC5jaGFuZ2UoKTtcbiAgICB9XG59XG5cbiQoZG9jdW1lbnQpLm9uKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAvLyBpZiB1c2VyIGlzIGluc3RydWN0b3IsIGVuYWJsZSBwcmVzZW50ZXIgbW9kZVxuICAgIGlmIChlQm9va0NvbmZpZy5pc0luc3RydWN0b3IpIHtcbiAgICAgICAgY29uZmlndXJlKCk7XG4gICAgfVxufSk7XG4iLCIvKlxuICAgIFN1cHBvcnQgZnVuY3Rpb25zIGZvciBQcmVUZVh0IGJvb2tzIHJ1bm5pbmcgb24gUnVuZXN0b25lXG5cbiovXG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuL3J1bmVzdG9uZWJhc2UuanNcIjtcblxuZnVuY3Rpb24gc2V0dXBQVFhFdmVudHMoKSB7XG4gICAgbGV0IHJiID0gbmV3IFJ1bmVzdG9uZUJhc2UoKTtcbiAgICAvLyBsb2cgYW4gZXZlbnQgd2hlbiBhIGtub3dsIGlzIG9wZW5lZC5cbiAgICAkKFwiW2RhdGEta25vd2xdXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgZGl2X2lkID0gJCh0aGlzKS5kYXRhKFwia25vd2xcIik7XG4gICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7IGV2ZW50OiBcImtub3dsXCIsIGFjdDogXCJjbGlja1wiLCBkaXZfaWQ6IGRpdl9pZCB9KTtcbiAgICB9KTtcbiAgICAvLyBsb2cgYW4gZXZlbnQgd2hlbiBhIHNhZ2UgY2VsbCBpcyBldmFsdWF0ZWRcbiAgICAkKFwiLnNhZ2VjZWxsX2V2YWxCdXR0b25cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGZpbmQgcGFyZW50c1xuICAgICAgICBsZXQgY29udGFpbmVyID0gJCh0aGlzKS5jbG9zZXN0KFwiLnNhZ2VjZWxsLXNhZ2VcIik7XG4gICAgICAgIGxldCBjb2RlID0gJChjb250YWluZXJbMF0pLmZpbmQoXCIuc2FnZWNlbGxfaW5wdXRcIilbMF0udGV4dENvbnRlbnQ7XG4gICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7IGV2ZW50OiBcInNhZ2VcIiwgYWN0OiBcInJ1blwiLCBkaXZfaWQ6IGNvbnRhaW5lclswXS5pZCB9KTtcbiAgICB9KTtcbiAgICBpZiAoIWVCb29rQ29uZmlnLmlzSW5zdHJ1Y3Rvcikge1xuICAgICAgICAkKFwiLmNvbW1lbnRhcnlcIikuaGlkZSgpO1xuICAgIH1cbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZyhcInNldHRpbmcgdXAgcHJldGV4dFwiKTtcbiAgICBzZXR1cFBUWEV2ZW50cygpO1xuICAgIGxldCB3cmFwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmltYXJ5LW5hdmJhci1zdGlja3ktd3JhcHBlclwiKTtcbiAgICBpZiAod3JhcCkge1xuICAgICAgICB3cmFwLnN0eWxlLm92ZXJmbG93ID0gXCJ2aXNpYmxlXCI7XG4gICAgfVxufSk7XG4iLCJpbXBvcnQgeyBydW5lc3RvbmVfaW1wb3J0IH0gZnJvbSBcIi4uLy4uLy4uL3dlYnBhY2suaW5kZXguanNcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbmRlclJ1bmVzdG9uZUNvbXBvbmVudChcbiAgICBjb21wb25lbnRTcmMsXG4gICAgd2hlcmVEaXYsXG4gICAgbW9yZU9wdHNcbikge1xuICAgIC8qKlxuICAgICAqICBUaGUgZWFzeSBwYXJ0IGlzIGFkZGluZyB0aGUgY29tcG9uZW50U3JjIHRvIHRoZSBleGlzdGluZyBkaXYuXG4gICAgICogIFRoZSB0ZWRpb3VzIHBhcnQgaXMgY2FsbGluZyB0aGUgcmlnaHQgZnVuY3Rpb25zIHRvIHR1cm4gdGhlXG4gICAgICogIHNvdXJjZSBpbnRvIHRoZSBhY3R1YWwgY29tcG9uZW50LlxuICAgICAqL1xuICAgIGlmICghY29tcG9uZW50U3JjKSB7XG4gICAgICAgIGpRdWVyeShgIyR7d2hlcmVEaXZ9YCkuaHRtbChcbiAgICAgICAgICAgIGA8cD5Tb3JyeSwgbm8gc291cmNlIGlzIGF2YWlsYWJsZSBmb3IgcHJldmlldy48L3A+YFxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBwYXR0ID0gLy4uXFwvX2ltYWdlcy9nO1xuICAgIGNvbXBvbmVudFNyYyA9IGNvbXBvbmVudFNyYy5yZXBsYWNlKFxuICAgICAgICBwYXR0LFxuICAgICAgICBgJHtlQm9va0NvbmZpZy5hcHB9L2Jvb2tzL3B1Ymxpc2hlZC8ke2VCb29rQ29uZmlnLmJhc2Vjb3Vyc2V9L19pbWFnZXNgXG4gICAgKTtcbiAgICBqUXVlcnkoYCMke3doZXJlRGl2fWApLmh0bWwoY29tcG9uZW50U3JjKTtcblxuICAgIGlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudE1hcCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwID0ge307XG4gICAgfVxuXG4gICAgbGV0IGNvbXBvbmVudEtpbmQgPSAkKCQoYCMke3doZXJlRGl2fSBbZGF0YS1jb21wb25lbnRdYClbMF0pLmRhdGEoXG4gICAgICAgIFwiY29tcG9uZW50XCJcbiAgICApO1xuICAgIC8vIEltcG9ydCB0aGUgSmF2YVNjcmlwdCBmb3IgdGhpcyBjb21wb25lbnQgYmVmb3JlIHByb2NlZWRpbmcuXG4gICAgYXdhaXQgcnVuZXN0b25lX2ltcG9ydChjb21wb25lbnRLaW5kKTtcbiAgICBsZXQgb3B0ID0ge307XG4gICAgb3B0Lm9yaWcgPSBqUXVlcnkoYCMke3doZXJlRGl2fSBbZGF0YS1jb21wb25lbnRdYClbMF07XG4gICAgaWYgKG9wdC5vcmlnKSB7XG4gICAgICAgIG9wdC5sYW5nID0gJChvcHQub3JpZykuZGF0YShcImxhbmdcIik7XG4gICAgICAgIG9wdC51c2VSdW5lc3RvbmVTZXJ2aWNlcyA9IHRydWU7XG4gICAgICAgIG9wdC5ncmFkZXJhY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgb3B0LnB5dGhvbjMgPSB0cnVlO1xuICAgICAgICBpZiAodHlwZW9mIG1vcmVPcHRzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gbW9yZU9wdHMpIHtcbiAgICAgICAgICAgICAgICBvcHRba2V5XSA9IG1vcmVPcHRzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGFsZXJ0KFwiRXJyb3I6ICBNaXNzaW5nIHRoZSBjb21wb25lbnQgZmFjdG9yeSFcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgIXdpbmRvdy5jb21wb25lbnRfZmFjdG9yeVtjb21wb25lbnRLaW5kXSAmJlxuICAgICAgICAgICAgIWpRdWVyeShgIyR7d2hlcmVEaXZ9YCkuaHRtbCgpXG4gICAgICAgICkge1xuICAgICAgICAgICAgalF1ZXJ5KGAjJHt3aGVyZURpdn1gKS5odG1sKFxuICAgICAgICAgICAgICAgIGA8cD5QcmV2aWV3IG5vdCBhdmFpbGFibGUgZm9yICR7Y29tcG9uZW50S2luZH08L3A+YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCByZXMgPSB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnlbY29tcG9uZW50S2luZF0ob3B0KTtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnRLaW5kID09PSBcImFjdGl2ZWNvZGVcIikge1xuICAgICAgICAgICAgICAgIGlmIChtb3JlT3B0cy5tdWx0aUdyYWRlcikge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW1xuICAgICAgICAgICAgICAgICAgICAgICAgYCR7bW9yZU9wdHMuZ3JhZGluZ0NvbnRhaW5lcn0gJHtyZXMuZGl2aWR9YFxuICAgICAgICAgICAgICAgICAgICBdID0gcmVzO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jb21wb25lbnRNYXBbcmVzLmRpdmlkXSA9IHJlcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUaW1lZENvbXBvbmVudChjb21wb25lbnRTcmMsIG1vcmVPcHRzKSB7XG4gICAgLyogVGhlIGltcG9ydGFudCBkaXN0aW5jdGlvbiBpcyB0aGF0IHRoZSBjb21wb25lbnQgZG9lcyBub3QgcmVhbGx5IG5lZWQgdG8gYmUgcmVuZGVyZWRcbiAgICBpbnRvIHRoZSBwYWdlLCBpbiBmYWN0LCBkdWUgdG8gdGhlIGFzeW5jIG5hdHVyZSBvZiBnZXR0aW5nIHRoZSBzb3VyY2UgdGhlIGxpc3Qgb2YgcXVlc3Rpb25zXG4gICAgaXMgbWFkZSBhbmQgdGhlIG9yaWdpbmFsIGh0bWwgaXMgcmVwbGFjZWQgYnkgdGhlIGxvb2sgb2YgdGhlIGV4YW0uXG4gICAgKi9cblxuICAgIGxldCBwYXR0ID0gLy4uXFwvX2ltYWdlcy9nO1xuICAgIGNvbXBvbmVudFNyYyA9IGNvbXBvbmVudFNyYy5yZXBsYWNlKFxuICAgICAgICBwYXR0LFxuICAgICAgICBgJHtlQm9va0NvbmZpZy5hcHB9L2Jvb2tzL3B1Ymxpc2hlZC8ke2VCb29rQ29uZmlnLmJhc2Vjb3Vyc2V9L19pbWFnZXNgXG4gICAgKTtcblxuICAgIGxldCBjb21wb25lbnRLaW5kID0gJCgkKGNvbXBvbmVudFNyYykuZmluZChcIltkYXRhLWNvbXBvbmVudF1cIilbMF0pLmRhdGEoXG4gICAgICAgIFwiY29tcG9uZW50XCJcbiAgICApO1xuXG4gICAgbGV0IG9yaWdJZCA9ICQoY29tcG9uZW50U3JjKS5maW5kKFwiW2RhdGEtY29tcG9uZW50XVwiKS5maXJzdCgpLmF0dHIoXCJpZFwiKTtcblxuICAgIC8vIERvdWJsZSBjaGVjayAtLSBpZiB0aGUgY29tcG9uZW50IHNvdXJjZSBpcyBub3QgaW4gdGhlIERPTSwgdGhlbiBicmllZmx5IGFkZCBpdFxuICAgIC8vIGFuZCBjYWxsIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICBsZXQgaGRpdjtcbiAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9yaWdJZCkpIHtcbiAgICAgICAgaGRpdiA9ICQoXCI8ZGl2Lz5cIiwge1xuICAgICAgICAgICAgY3NzOiB7IGRpc3BsYXk6IFwibm9uZVwiIH0sXG4gICAgICAgIH0pLmFwcGVuZFRvKFwiYm9keVwiKTtcbiAgICAgICAgaGRpdi5odG1sKGNvbXBvbmVudFNyYyk7XG4gICAgfVxuICAgIC8vIGF0IHRoaXMgcG9pbnQgaGRpdiBpcyBhIGpxdWVyeSBvYmplY3RcblxuICAgIGxldCByZXQ7XG4gICAgbGV0IG9wdHMgPSB7XG4gICAgICAgIG9yaWc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9yaWdJZCksXG4gICAgICAgIHRpbWVkOiB0cnVlLFxuICAgIH07XG4gICAgaWYgKHR5cGVvZiBtb3JlT3B0cyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gbW9yZU9wdHMpIHtcbiAgICAgICAgICAgIG9wdHNba2V5XSA9IG1vcmVPcHRzW2tleV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29tcG9uZW50S2luZCBpbiB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkpIHtcbiAgICAgICAgcmV0ID0gd2luZG93LmNvbXBvbmVudF9mYWN0b3J5W2NvbXBvbmVudEtpbmRdKG9wdHMpO1xuICAgIH1cblxuICAgIGxldCByZGljdCA9IHt9O1xuICAgIHJkaWN0LnF1ZXN0aW9uID0gcmV0O1xuICAgIHJldHVybiByZGljdDtcbn1cblxuLy8gRm9yIGludGVncmF0aW9uIHdpdGggdGhlIFJlYWN0IG92ZXJoYXVsdCBvZiBQcmV0ZXh0XG4vLyAxLiBEaXNhYmxlIHRoZSBhdXRvbWF0aWMgaW5zdGFudGlhdGlvbiBhdCB0aGUgZW5kIG9mIGVhY2ggY29tcG9uZW50LmpzXG4vLyAyLiByZWFjdCB3aWxsIHNlYXJjaCBmb3IgYWxsIFwiLnJ1bmVzdG9uZVwiIGFuZCB3aWxsIGNhbGwgdGhpcyBmdW5jdGlvbiBmb3IgZWFjaCBvZiB0aGVtLlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbmRlck9uZUNvbXBvbmVudChyc0Rpdikge1xuICAgIC8vIEZpbmQgdGhlIGFjdHVhbCBjb21wb25lbnQgaW5zaWRlIHRoZSBydW5lc3RvbmUgY29tcG9uZW50LlxuICAgIGxldCBjb21wb25lbnQgPSByc0Rpdi5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtY29tcG9uZW50XVwiKTtcbiAgICBpZiAoY29tcG9uZW50ID09IG51bGwpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZW5kZXIgd2FzIGNhbGxlZCBmb3IgYSBjb21wb25lbnQsIGJ1dCBub3cgW2RhdGEtY29tcG9uZW50XSBhdHRyaWJ1dGUgaXMgcHJlc2VudC4gVGhpcyBtYXkgbWVhbiB0aGUgY29tcG9uZW50IGhhcyBhbHJlYWR5IGJlZW4gcmVuZGVyZWQuXCIpXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGNvbXBvbmVudEtpbmQgPSBjb21wb25lbnQuZGF0YXNldC5jb21wb25lbnQ7XG4gICAgYXdhaXQgcnVuZXN0b25lX2ltcG9ydChjb21wb25lbnRLaW5kKTtcbiAgICBpZiAoJCh0aGlzKS5jbG9zZXN0KFwiW2RhdGEtY29tcG9uZW50PXRpbWVkQXNzZXNzbWVudF1cIikubGVuZ3RoID09IDApIHtcbiAgICAgICAgLy8gSWYgdGhpcyBlbGVtZW50IGV4aXN0cyB3aXRoaW4gYSB0aW1lZCBjb21wb25lbnQsIGRvbid0IHJlbmRlciBpdCBoZXJlXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgZGl2aWQgPSBjb21wb25lbnQuaWQ7XG4gICAgICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW2RpdmlkXSA9IHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeVtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRLaW5kXG4gICAgICAgICAgICBdKHtcbiAgICAgICAgICAgICAgICBvcmlnOiBjb21wb25lbnQsXG4gICAgICAgICAgICAgICAgdXNlUnVuZXN0b25lU2VydmljZXM6IGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHJlbmRlcmluZyAke2NvbXBvbmVudEtpbmR9IFByb2JsZW0gJHt0aGlzLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgIERldGFpbHM6ICR7ZXJyfWApO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIHxkb2NuYW1lfCAtIFJ1bmVzdG9uZSBCYXNlIENsYXNzXG4gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogQWxsIHJ1bmVzdG9uZSBjb21wb25lbnRzIHNob3VsZCBpbmhlcml0IGZyb20gUnVuZXN0b25lQmFzZS4gSW4gYWRkaXRpb24gYWxsIHJ1bmVzdG9uZSBjb21wb25lbnRzIHNob3VsZCBkbyB0aGUgZm9sbG93aW5nIHRoaW5nczpcbiAqXG4gKiAxLiAgIEVuc3VyZSB0aGF0IHRoZXkgYXJlIHdyYXBwZWQgaW4gYSBkaXYgd2l0aCB0aGUgY2xhc3MgcnVuZXN0b25lXG4gKiAyLiAgIFdyaXRlIHRoZWlyIHNvdXJjZSBBTkQgdGhlaXIgZ2VuZXJhdGVkIGh0bWwgdG8gdGhlIGRhdGFiYXNlIGlmIHRoZSBkYXRhYmFzZSBpcyBjb25maWd1cmVkXG4gKiAzLiAgIFByb3Blcmx5IHNhdmUgYW5kIHJlc3RvcmUgdGhlaXIgYW5zd2VycyB1c2luZyB0aGUgY2hlY2tTZXJ2ZXIgbWVjaGFuaXNtIGluIHRoaXMgYmFzZSBjbGFzcy4gRWFjaCBjb21wb25lbnQgbXVzdCBwcm92aWRlIGFuIGltcGxlbWVudGF0aW9uIG9mOlxuICpcbiAqICAgICAgLSAgICBjaGVja0xvY2FsU3RvcmFnZVxuICogICAgICAtICAgIHNldExvY2FsU3RvcmFnZVxuICogICAgICAtICAgIHJlc3RvcmVBbnN3ZXJzXG4gKiAgICAgIC0gICAgZGlzYWJsZUludGVyYWN0aW9uXG4gKlxuICogNC4gICBwcm92aWRlIGEgU2VsZW5pdW0gYmFzZWQgdW5pdCB0ZXN0XG4gKi9cblxuaW1wb3J0IHsgcGFnZVByb2dyZXNzVHJhY2tlciB9IGZyb20gXCIuL2Jvb2tmdW5jcy5qc1wiO1xuLy9pbXBvcnQgXCIuLy4uL3N0eWxlcy9ydW5lc3RvbmUtY3VzdG9tLXNwaGlueC1ib290c3RyYXAuY3NzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnRfcmVhZHlfcHJvbWlzZSA9IG5ldyBQcm9taXNlKFxuICAgICAgICAgICAgKHJlc29sdmUpID0+ICh0aGlzLl9jb21wb25lbnRfcmVhZHlfcmVzb2x2ZV9mbiA9IHJlc29sdmUpXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMub3B0aW9uYWwgPSBmYWxzZTtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cuYWxsQ29tcG9uZW50cyA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgd2luZG93LmFsbENvbXBvbmVudHMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cuYWxsQ29tcG9uZW50cy5wdXNoKHRoaXMpO1xuICAgICAgICBpZiAob3B0cykge1xuICAgICAgICAgICAgdGhpcy5zaWQgPSBvcHRzLnNpZDtcbiAgICAgICAgICAgIHRoaXMuZ3JhZGVyYWN0aXZlID0gb3B0cy5ncmFkZXJhY3RpdmU7XG4gICAgICAgICAgICB0aGlzLnNob3dmZWVkYmFjayA9IHRydWU7XG4gICAgICAgICAgICBpZiAob3B0cy50aW1lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNUaW1lZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0cy5lbmZvcmNlRGVhZGxpbmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWRsaW5lID0gb3B0cy5kZWFkbGluZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkKG9wdHMub3JpZykuZGF0YShcIm9wdGlvbmFsXCIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25hbCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9uYWwgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRzLnNlbGVjdG9yX2lkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rvcl9pZCA9IG9wdHMuc2VsZWN0b3JfaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdHMuYXNzZXNzbWVudFRha2VuICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hc3Nlc3NtZW50VGFrZW4gPSBvcHRzLmFzc2Vzc21lbnRUYWtlbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZGVmYXVsdCB0byB0cnVlIGFzIHRoaXMgb3B0IGlzIG9ubHkgcHJvdmlkZWQgZnJvbSBhIHRpbWVkQXNzZXNzbWVudFxuICAgICAgICAgICAgICAgIHRoaXMuYXNzZXNzbWVudFRha2VuID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFRoaXMgaXMgZm9yIHRoZSBzZWxlY3RxdWVzdGlvbiBwb2ludHNcbiAgICAgICAgICAgIC8vIElmIGEgc2VsZWN0cXVlc3Rpb24gaXMgcGFydCBvZiBhIHRpbWVkIGV4YW0gaXQgd2lsbCBnZXRcbiAgICAgICAgICAgIC8vIHRoZSB0aW1lZFdyYXBwZXIgb3B0aW9ucy5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0cy50aW1lZFdyYXBwZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVkV3JhcHBlciA9IG9wdHMudGltZWRXcmFwcGVyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBIb3dldmVyIHNvbWV0aW1lcyBzZWxlY3RxdWVzdGlvbnNcbiAgICAgICAgICAgICAgICAvLyBhcmUgdXNlZCBpbiByZWd1bGFyIGFzc2lnbm1lbnRzLiAgVGhlIGhhY2t5IHdheSB0byBkZXRlY3QgdGhpc1xuICAgICAgICAgICAgICAgIC8vIGlzIHRvIGxvb2sgZm9yIGRvQXNzaWdubWVudCBpbiB0aGUgVVJMIGFuZCB0aGVuIGdyYWJcbiAgICAgICAgICAgICAgICAvLyB0aGUgYXNzaWdubWVudCBuYW1lIGZyb20gdGhlIGhlYWRpbmcuXG4gICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5kZXhPZihcImRvQXNzaWdubWVudFwiKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZWRXcmFwcGVyID0gJChcImgxI2Fzc2lnbm1lbnRfbmFtZVwiKS50ZXh0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lZFdyYXBwZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkKG9wdHMub3JpZykuZGF0YShcInF1ZXN0aW9uX2xhYmVsXCIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvbl9sYWJlbCA9ICQob3B0cy5vcmlnKS5kYXRhKFwicXVlc3Rpb25fbGFiZWxcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmlzX3RvZ2dsZSA9IHRydWUgPyBvcHRzLmlzX3RvZ2dsZSA6IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5pc19zZWxlY3QgPSB0cnVlID8gb3B0cy5pc19zZWxlY3QgOiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1qZWxlbWVudHMgPSBbXTtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLm1qUmVhZHkgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBzZWxmLm1qcmVzb2x2ZXIgPSByZXNvbHZlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hUXVldWUgPSBuZXcgQXV0b1F1ZXVlKCk7XG4gICAgICAgIHRoaXMuanNvbkhlYWRlcnMgPSBuZXcgSGVhZGVycyh7XG4gICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIixcbiAgICAgICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIF9gbG9nQm9va0V2ZW50YFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFRoaXMgZnVuY3Rpb24gc2VuZHMgdGhlIHByb3ZpZGVkIGBgZXZlbnRJbmZvYGAgdG8gdGhlIGBoc2Jsb2cgZW5kcG9pbnRgIG9mIHRoZSBzZXJ2ZXIuIEF3YWl0aW5nIHRoaXMgZnVuY3Rpb24gcmV0dXJucyBlaXRoZXIgYGB1bmRlZmluZWRgYCAoaWYgUnVuZXN0b25lIHNlcnZpY2VzIGFyZSBub3QgYXZhaWxhYmxlKSBvciB0aGUgZGF0YSByZXR1cm5lZCBieSB0aGUgc2VydmVyIGFzIGEgSmF2YVNjcmlwdCBvYmplY3QgKGFscmVhZHkgSlNPTi1kZWNvZGVkKS5cbiAgICBhc3luYyBsb2dCb29rRXZlbnQoZXZlbnRJbmZvKSB7XG4gICAgICAgIGlmICh0aGlzLmdyYWRlcmFjdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwb3N0X3JldHVybjtcbiAgICAgICAgZXZlbnRJbmZvLmNvdXJzZV9uYW1lID0gZUJvb2tDb25maWcuY291cnNlO1xuICAgICAgICBldmVudEluZm8uY2xpZW50TG9naW5TdGF0dXMgPSBlQm9va0NvbmZpZy5pc0xvZ2dlZEluO1xuICAgICAgICBldmVudEluZm8udGltZXpvbmVvZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MDtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnBlcmNlbnQgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIGV2ZW50SW5mby5wZXJjZW50ID0gdGhpcy5wZXJjZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmlzTG9nZ2VkSW4gJiZcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzICYmXG4gICAgICAgICAgICBlQm9va0NvbmZpZy5sb2dMZXZlbCA+IDBcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBwb3N0X3JldHVybiA9IHRoaXMucG9zdExvZ01lc3NhZ2UoZXZlbnRJbmZvKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuaXNUaW1lZCB8fCBlQm9va0NvbmZpZy5kZWJ1Zykge1xuICAgICAgICAgICAgbGV0IHByZWZpeCA9IGVCb29rQ29uZmlnLmlzTG9nZ2VkSW4gPyBcIlNhdmVcIiA6IFwiTm90XCI7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtwcmVmaXh9IGxvZ2dpbmcgZXZlbnQgYCArIEpTT04uc3RyaW5naWZ5KGV2ZW50SW5mbykpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFdoZW4gc2VsZWN0cXVlc3Rpb25zIGFyZSBwYXJ0IG9mIGFuIGFzc2lnbm1lbnQgZXNwZWNpYWxseSB0b2dnbGUgcXVlc3Rpb25zXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gY291bnQgdXNpbmcgdGhlIHNlbGVjdG9yX2lkIG9mIHRoZSBzZWxlY3QgcXVlc3Rpb24uXG4gICAgICAgIC8vIFdlICBhbHNvIG5lZWQgdG8gbG9nIGFuIGV2ZW50IGZvciB0aGF0IHNlbGVjdG9yIHNvIHRoYXQgd2Ugd2lsbCBrbm93XG4gICAgICAgIC8vIHRoYXQgaW50ZXJhY3Rpb24gaGFzIHRha2VuIHBsYWNlLiAgVGhpcyBpcyAqKmluZGVwZW5kZW50Kiogb2YgaG93IHRoZVxuICAgICAgICAvLyBhdXRvZ3JhZGVyIHdpbGwgdWx0aW1hdGVseSBncmFkZSB0aGUgcXVlc3Rpb24hXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdG9yX2lkKSB7XG4gICAgICAgICAgICBldmVudEluZm8uZGl2X2lkID0gdGhpcy5zZWxlY3Rvcl9pZC5yZXBsYWNlKFxuICAgICAgICAgICAgICAgIFwiLXRvZ2dsZVNlbGVjdGVkUXVlc3Rpb25cIixcbiAgICAgICAgICAgICAgICBcIlwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZXZlbnRJbmZvLmV2ZW50ID0gXCJzZWxlY3RxdWVzdGlvblwiO1xuICAgICAgICAgICAgZXZlbnRJbmZvLmFjdCA9IFwiaW50ZXJhY3Rpb25cIjtcbiAgICAgICAgICAgIHRoaXMucG9zdExvZ01lc3NhZ2UoZXZlbnRJbmZvKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0eXBlb2YgcGFnZVByb2dyZXNzVHJhY2tlci51cGRhdGVQcm9ncmVzcyA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgICAgICBldmVudEluZm8uYWN0ICE9IFwiZWRpdFwiICYmXG4gICAgICAgICAgICB0aGlzLm9wdGlvbmFsID09IGZhbHNlXG4gICAgICAgICkge1xuICAgICAgICAgICAgcGFnZVByb2dyZXNzVHJhY2tlci51cGRhdGVQcm9ncmVzcyhldmVudEluZm8uZGl2X2lkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcG9zdF9yZXR1cm47XG4gICAgfVxuXG4gICAgYXN5bmMgcG9zdExvZ01lc3NhZ2UoZXZlbnRJbmZvKSB7XG4gICAgICAgIHZhciBwb3N0X3JldHVybjtcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdChcbiAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9sb2dnZXIvYm9va2V2ZW50YCxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuanNvbkhlYWRlcnMsXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZXZlbnRJbmZvKSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQyMikge1xuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgZGV0YWlscyBhYm91dCB3aHkgdGhpcyBpcyB1bnByb2Nlc2FibGUuXG4gICAgICAgICAgICAgICAgICAgIHBvc3RfcmV0dXJuID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShwb3N0X3JldHVybi5kZXRhaWwsIG51bGwsIDQpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5wcm9jZXNzYWJsZSBSZXF1ZXN0XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDQwMSkge1xuICAgICAgICAgICAgICAgICAgICBwb3N0X3JldHVybiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgICAgICBgTWlzc2luZyBhdXRoZW50aWNhdGlvbiB0b2tlbiAke3Bvc3RfcmV0dXJuLmRldGFpbH1gXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1pc3NpbmcgYXV0aGVudGljYXRpb24gdG9rZW5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIHNhdmUgdGhlIGxvZyBlbnRyeVxuICAgICAgICAgICAgICAgICAgICBTdGF0dXM6ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9zdF9yZXR1cm4gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGxldCBkZXRhaWwgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIGlmIChwb3N0X3JldHVybiAmJiBwb3N0X3JldHVybi5kZXRhaWwpIHtcbiAgICAgICAgICAgICAgICBkZXRhaWwgPSBwb3N0X3JldHVybi5kZXRhaWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgICAgICAgICBhbGVydChgRXJyb3I6IFlvdXIgYWN0aW9uIHdhcyBub3Qgc2F2ZWQhXG4gICAgICAgICAgICAgICAgICAgIFRoZSBlcnJvciB3YXMgJHtlfVxuICAgICAgICAgICAgICAgICAgICBTdGF0dXMgQ29kZTogJHtyZXNwb25zZS5zdGF0dXN9XG4gICAgICAgICAgICAgICAgICAgIERldGFpbDogJHtKU09OLnN0cmluZ2lmeShkZXRhaWwsIG51bGwsIDQpfS5cbiAgICAgICAgICAgICAgICAgICAgUGxlYXNlIHJlcG9ydCB0aGlzIGVycm9yIWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc2VuZCBhIHJlcXVlc3QgdG8gc2F2ZSB0aGlzIGVycm9yXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICBgRXJyb3I6ICR7ZX0gRGV0YWlsOiAke2RldGFpbH0gU3RhdHVzIENvZGU6ICR7cmVzcG9uc2Uuc3RhdHVzfWBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBvc3RfcmV0dXJuO1xuICAgIH1cbiAgICAvLyAuLiBfbG9nUnVuRXZlbnQ6XG4gICAgLy9cbiAgICAvLyBsb2dSdW5FdmVudFxuICAgIC8vIC0tLS0tLS0tLS0tXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBzZW5kcyB0aGUgcHJvdmlkZWQgYGBldmVudEluZm9gYCB0byB0aGUgYHJ1bmxvZyBlbmRwb2ludGAuIFdoZW4gYXdhaXRlZCwgdGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSBkYXRhIChkZWNvZGVkIGZyb20gSlNPTikgdGhlIHNlcnZlciBzZW50IGJhY2suXG4gICAgYXN5bmMgbG9nUnVuRXZlbnQoZXZlbnRJbmZvKSB7XG4gICAgICAgIGxldCBwb3N0X3Byb21pc2UgPSBcImRvbmVcIjtcbiAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnRJbmZvLmNvdXJzZSA9IGVCb29rQ29uZmlnLmNvdXJzZTtcbiAgICAgICAgZXZlbnRJbmZvLmNsaWVudExvZ2luU3RhdHVzID0gZUJvb2tDb25maWcuaXNMb2dnZWRJbjtcbiAgICAgICAgZXZlbnRJbmZvLnRpbWV6b25lb2Zmc2V0ID0gbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjA7XG4gICAgICAgIGlmICh0aGlzLmZvcmNlU2F2ZSB8fCBcInRvX3NhdmVcIiBpbiBldmVudEluZm8gPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBldmVudEluZm8uc2F2ZV9jb2RlID0gXCJUcnVlXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBldmVudEluZm8uZXJyaW5mbyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZXZlbnRJbmZvLmVycmluZm8gPSBldmVudEluZm8uZXJyaW5mby50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmlzTG9nZ2VkSW4gJiZcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzICYmXG4gICAgICAgICAgICBlQm9va0NvbmZpZy5sb2dMZXZlbCA+IDBcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9sb2dnZXIvcnVubG9nYCxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuanNvbkhlYWRlcnMsXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGV2ZW50SW5mbyksXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgIHBvc3RfcHJvbWlzZSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgICAgICBpZiAoZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoYEZhaWxlZCB0byBzYXZlIHlvdXIgY29kZVxuICAgICAgICAgICAgICAgICAgICAgICAgU3RhdHVzIGlzICR7cmVzcG9uc2Uuc3RhdHVzfVxuICAgICAgICAgICAgICAgICAgICAgICAgRGV0YWlsOiAke0pTT04uc3RyaW5naWZ5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RfcHJvbWlzZS5kZXRhaWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA0XG4gICAgICAgICAgICAgICAgICAgICAgICApfWApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgYERpZCBub3Qgc2F2ZSB0aGUgY29kZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICBTdGF0dXM6ICR7cmVzcG9uc2Uuc3RhdHVzfVxuICAgICAgICAgICAgICAgICAgICAgICAgIERldGFpbDogJHtKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zdF9wcm9taXNlLmRldGFpbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgNFxuICAgICAgICAgICAgICAgICAgICAgICAgICl9YFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcG9zdF9wcm9taXNlID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5pc1RpbWVkIHx8IGVCb29rQ29uZmlnLmRlYnVnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJ1bm5pbmcgXCIgKyBKU09OLnN0cmluZ2lmeShldmVudEluZm8pKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0eXBlb2YgcGFnZVByb2dyZXNzVHJhY2tlci51cGRhdGVQcm9ncmVzcyA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgICAgICB0aGlzLm9wdGlvbmFsID09IGZhbHNlXG4gICAgICAgICkge1xuICAgICAgICAgICAgcGFnZVByb2dyZXNzVHJhY2tlci51cGRhdGVQcm9ncmVzcyhldmVudEluZm8uZGl2X2lkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcG9zdF9wcm9taXNlO1xuICAgIH1cbiAgICAvKiBDaGVja2luZy9sb2FkaW5nIGZyb20gc3RvcmFnZVxuICAgICoqV0FSTklORzoqKiAgRE8gTk9UIGBhd2FpdGAgdGhpcyBmdW5jdGlvbiFcbiAgICBUaGlzIGZ1bmN0aW9uLCBhbHRob3VnaCBhc3luYywgZG9lcyBub3QgZXhwbGljaXRseSByZXNvbHZlIGl0cyBwcm9taXNlIGJ5IHJldHVybmluZyBhIHZhbHVlLiAgVGhlIHJlYXNvbiBmb3IgdGhpcyBpcyBiZWNhdXNlIGl0IGlzIGNhbGxlZCBieSB0aGUgY29uc3RydWN0b3IgZm9yIG5lYXJseSBldmVyeSBjb21wb25lbnQuICBJbiBKYXZhc2NyaXB0IGNvbnN0cnVjdG9ycyBjYW5ub3QgYmUgYXN5bmMhXG5cbiAgICBPbmUgb2YgdGhlIHJlY29tbWVuZGVkIHdheXMgdG8gaGFuZGxlIHRoZSBhc3luYyByZXF1aXJlbWVudHMgZnJvbSB3aXRoaW4gYSBjb25zdHJ1Y3RvciBpcyB0byB1c2UgYW4gYXR0cmlidXRlIGFzIGEgcHJvbWlzZSBhbmQgcmVzb2x2ZSB0aGF0IGF0dHJpYnV0ZSBhdCB0aGUgYXBwcm9wcmlhdGUgdGltZS5cbiAgICAqL1xuICAgIGFzeW5jIGNoZWNrU2VydmVyKFxuICAgICAgICAvLyBBIHN0cmluZyBzcGVjaWZ5aW5nIHRoZSBldmVudCBuYW1lIHRvIHVzZSBmb3IgcXVlcnlpbmcgdGhlIDpyZWY6YGdldEFzc2Vzc1Jlc3VsdHNgIGVuZHBvaW50LlxuICAgICAgICBldmVudEluZm8sXG4gICAgICAgIC8vIElmIHRydWUsIHRoaXMgZnVuY3Rpb24gd2lsbCBpbnZva2UgYGBpbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKWBgIGp1c3QgYmVmb3JlIGl0IHJldHVybnMuIFRoaXMgaXMgcHJvdmlkZWQgc2luY2UgbW9zdCBjb21wb25lbnRzIGFyZSByZWFkeSBhZnRlciB0aGlzIGZ1bmN0aW9uIGNvbXBsZXRlcyBpdHMgd29yay5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gVE9ETzogVGhpcyBkZWZhdWx0cyB0byBmYWxzZSwgdG8gYXZvaWQgY2F1c2luZyBwcm9ibGVtcyB3aXRoIGFueSBjb21wb25lbnRzIHRoYXQgaGF2ZW4ndCBiZWVuIHVwZGF0ZWQgYW5kIHRlc3RlZC4gQWZ0ZXIgYWxsIFJ1bmVzdG9uZSBjb21wb25lbnRzIGhhdmUgYmVlbiB1cGRhdGVkLCBkZWZhdWx0IHRoaXMgdG8gdHJ1ZSBhbmQgcmVtb3ZlIHRoZSBleHRyYSBwYXJhbWV0ZXIgZnJvbSBtb3N0IGNhbGxzIHRvIHRoaXMgZnVuY3Rpb24uXG4gICAgICAgIHdpbGxfYmVfcmVhZHkgPSBmYWxzZVxuICAgICkge1xuICAgICAgICAvLyBDaGVjayBpZiB0aGUgc2VydmVyIGhhcyBzdG9yZWQgYW5zd2VyXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5jaGVja1NlcnZlckNvbXBsZXRlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgc2VsZi5jc3Jlc29sdmVyID0gcmVzb2x2ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmlzTG9nZ2VkSW4gJiZcbiAgICAgICAgICAgICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzIHx8IHRoaXMuZ3JhZGVyYWN0aXZlKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGxldCBkYXRhID0ge307XG4gICAgICAgICAgICBkYXRhLmRpdl9pZCA9IHRoaXMuZGl2aWQ7XG4gICAgICAgICAgICBkYXRhLmNvdXJzZSA9IGVCb29rQ29uZmlnLmNvdXJzZTtcbiAgICAgICAgICAgIGRhdGEuZXZlbnQgPSBldmVudEluZm87XG4gICAgICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUgJiYgdGhpcy5kZWFkbGluZSkge1xuICAgICAgICAgICAgICAgIGRhdGEuZGVhZGxpbmUgPSB0aGlzLmRlYWRsaW5lO1xuICAgICAgICAgICAgICAgIGRhdGEucmF3ZGVhZGxpbmUgPSB0aGlzLnJhd2RlYWRsaW5lO1xuICAgICAgICAgICAgICAgIGRhdGEudHpvZmYgPSB0aGlzLnR6b2ZmO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuc2lkKSB7XG4gICAgICAgICAgICAgICAgZGF0YS5zaWQgPSB0aGlzLnNpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghKGRhdGEuZGl2X2lkICYmIGRhdGEuY291cnNlICYmIGRhdGEuZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgIGBBIHJlcXVpcmVkIGZpZWxkIGlzIG1pc3NpbmcgZGF0YSAke2RhdGEuZGl2X2lkfToke2RhdGEuY291cnNlfToke2RhdGEuZXZlbnR9YFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBJZiB3ZSBhcmUgTk9UIGluIHByYWN0aWNlIG1vZGUgYW5kIHdlIGFyZSBub3QgaW4gYSBwZWVyIGV4ZXJjaXNlXG4gICAgICAgICAgICAvLyBhbmQgYXNzZXNzbWVudFRha2VuIGlzIHRydWVcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAhZUJvb2tDb25maWcucHJhY3RpY2VfbW9kZSAmJlxuICAgICAgICAgICAgICAgICFlQm9va0NvbmZpZy5wZWVyICYmXG4gICAgICAgICAgICAgICAgdGhpcy5hc3Nlc3NtZW50VGFrZW5cbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9hc3Nlc3NtZW50L3Jlc3VsdHNgLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmpzb25IZWFkZXJzLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEuZGV0YWlsO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXBvcHVsYXRlRnJvbVN0b3JhZ2UoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dGVtcHRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEuY29ycmVjdCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IGRhdGEuY29ycmVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3NyZXNvbHZlcihcInNlcnZlclwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBIVFRQIEVycm9yIGdldHRpbmcgcmVzdWx0czogJHtyZXNwb25zZS5zdGF0dXNUZXh0fWBcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrTG9jYWxTdG9yYWdlKCk7IC8vIGp1c3QgZ28gcmlnaHQgdG8gbG9jYWwgc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jc3Jlc29sdmVyKFwibG9jYWxcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIGdldHRpbmcgcmVzdWx0czogJHtlcnJ9YCk7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrTG9jYWxTdG9yYWdlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkRGF0YSh7fSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jc3Jlc29sdmVyKFwibm90IHRha2VuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jaGVja0xvY2FsU3RvcmFnZSgpOyAvLyBqdXN0IGdvIHJpZ2h0IHRvIGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgICAgIHRoaXMuY3NyZXNvbHZlcihcImxvY2FsXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHdpbGxfYmVfcmVhZHkpIHtcbiAgICAgICAgICAgIHRoaXMuaW5kaWNhdGVfY29tcG9uZW50X3JlYWR5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUaGlzIG1ldGhvZCBhc3N1bWVzIHRoYXQgYGB0aGlzLmNvbXBvbmVudERpdmBgIHJlZmVycyB0byB0aGUgYGBkaXZgYCBjb250YWluaW5nIHRoZSBjb21wb25lbnQsIGFuZCB0aGF0IHRoaXMgY29tcG9uZW50J3MgSUQgaXMgc2V0LlxuICAgIGluZGljYXRlX2NvbXBvbmVudF9yZWFkeSgpIHtcbiAgICAgICAgLy8gQWRkIGEgY2xhc3MgdG8gaW5kaWNhdGUgdGhlIGNvbXBvbmVudCBpcyBub3cgcmVhZHkuXG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmNsYXNzTGlzdC5hZGQoXCJydW5lc3RvbmUtY29tcG9uZW50LXJlYWR5XCIpO1xuICAgICAgICAvLyBSZXNvbHZlIHRoZSBgYHRoaXMuY29tcG9uZW50X3JlYWR5X3Byb21pc2VgYC5cbiAgICAgICAgdGhpcy5fY29tcG9uZW50X3JlYWR5X3Jlc29sdmVfZm4oKTtcbiAgICB9XG5cbiAgICBsb2FkRGF0YShkYXRhKSB7XG4gICAgICAgIC8vIGZvciBtb3N0IGNsYXNzZXMsIGxvYWREYXRhIGRvZXNuJ3QgZG8gYW55dGhpbmcuIEJ1dCBmb3IgUGFyc29ucywgYW5kIHBlcmhhcHMgb3RoZXJzIGluIHRoZSBmdXR1cmUsXG4gICAgICAgIC8vIGluaXRpYWxpemF0aW9uIGNhbiBoYXBwZW4gZXZlbiB3aGVuIHRoZXJlJ3Mgbm8gaGlzdG9yeSB0byBiZSBsb2FkZWRcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmVwb3B1bGF0ZUZyb21TdG9yYWdlIGlzIGNhbGxlZCBhZnRlciBhIHN1Y2Nlc3NmdWwgQVBJIGNhbGwgaXMgbWFkZSB0byBgYGdldEFzc2Vzc1Jlc3VsdHNgYCBpblxuICAgICAqIHRoZSBjaGVja1NlcnZlciBtZXRob2QgaW4gdGhpcyBjbGFzc1xuICAgICAqXG4gICAgICogYGByZXN0b3JlQW5zd2VycyxgYCBgYHNldExvY2FsU3RvcmFnZWBgIGFuZCBgYGNoZWNrTG9jYWxTdG9yYWdlYGAgYXJlIGRlZmluZWQgaW4gdGhlIGNoaWxkIGNsYXNzZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyp9IGRhdGEgLSBhIEpTT04gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgZGF0YSBuZWVkZWQgdG8gcmVzdG9yZSBhIHByZXZpb3VzIGFuc3dlciBmb3IgYSBjb21wb25lbnRcbiAgICAgKiBAcGFyYW0geyp9IHN0YXR1cyAtIHRoZSBodHRwIHN0YXR1c1xuICAgICAqIEBwYXJhbSB7Kn0gd2hhdGV2ZXIgLSBpZ25vcmVkXG4gICAgICovXG4gICAgcmVwb3B1bGF0ZUZyb21TdG9yYWdlKGRhdGEpIHtcbiAgICAgICAgLy8gZGVjaWRlIHdoZXRoZXIgdG8gdXNlIHRoZSBzZXJ2ZXIncyBhbnN3ZXIgKGlmIHRoZXJlIGlzIG9uZSkgb3IgdG8gbG9hZCBmcm9tIHN0b3JhZ2VcbiAgICAgICAgaWYgKGRhdGEgIT09IG51bGwgJiYgZGF0YSAhPT0gXCJubyBkYXRhXCIgJiYgdGhpcy5zaG91bGRVc2VTZXJ2ZXIoZGF0YSkpIHtcbiAgICAgICAgICAgIHRoaXMucmVzdG9yZUFuc3dlcnMoZGF0YSk7XG4gICAgICAgICAgICB0aGlzLnNldExvY2FsU3RvcmFnZShkYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tMb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzaG91bGRVc2VTZXJ2ZXIoZGF0YSkge1xuICAgICAgICAvLyByZXR1cm5zIHRydWUgaWYgc2VydmVyIGRhdGEgaXMgbW9yZSByZWNlbnQgdGhhbiBsb2NhbCBzdG9yYWdlIG9yIGlmIHNlcnZlciBzdG9yYWdlIGlzIGNvcnJlY3RcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgZGF0YS5jb3JyZWN0ID09PSBcIlRcIiB8fFxuICAgICAgICAgICAgZGF0YS5jb3JyZWN0ID09PSB0cnVlIHx8XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UubGVuZ3RoID09PSAwIHx8XG4gICAgICAgICAgICB0aGlzLmdyYWRlcmFjdGl2ZSA9PT0gdHJ1ZSB8fFxuICAgICAgICAgICAgdGhpcy5pc1RpbWVkXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGV4ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG4gICAgICAgIGlmIChleCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN0b3JlZERhdGE7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzdG9yZWREYXRhID0gSlNPTi5wYXJzZShleCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgLy8gZXJyb3Igd2hpbGUgcGFyc2luZzsgbGlrZWx5IGR1ZSB0byBiYWQgdmFsdWUgc3RvcmVkIGluIHN0b3JhZ2VcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgICAgLy8gZGVmaW5pdGVseSBkb24ndCB3YW50IHRvIHVzZSBsb2NhbCBzdG9yYWdlIGhlcmVcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLmFuc3dlciA9PSBzdG9yZWREYXRhLmFuc3dlcikgcmV0dXJuIHRydWU7XG4gICAgICAgIGxldCBzdG9yYWdlRGF0ZSA9IG5ldyBEYXRlKHN0b3JlZERhdGEudGltZXN0YW1wKTtcbiAgICAgICAgbGV0IHNlcnZlckRhdGUgPSBuZXcgRGF0ZShkYXRhLnRpbWVzdGFtcCk7XG4gICAgICAgIHJldHVybiBzZXJ2ZXJEYXRlID49IHN0b3JhZ2VEYXRlO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gdGhlIGtleSB3aGljaCB0byBiZSB1c2VkIHdoZW4gYWNjZXNzaW5nIGxvY2FsIHN0b3JhZ2UuXG4gICAgbG9jYWxTdG9yYWdlS2V5KCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgZUJvb2tDb25maWcuZW1haWwgK1xuICAgICAgICAgICAgXCI6XCIgK1xuICAgICAgICAgICAgZUJvb2tDb25maWcuY291cnNlICtcbiAgICAgICAgICAgIFwiOlwiICtcbiAgICAgICAgICAgIHRoaXMuZGl2aWQgK1xuICAgICAgICAgICAgXCItZ2l2ZW5cIlxuICAgICAgICApO1xuICAgIH1cbiAgICBhZGRDYXB0aW9uKGVsVHlwZSkge1xuICAgICAgICAvL3NvbWVFbGVtZW50LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5ld0VsZW1lbnQsIHNvbWVFbGVtZW50Lm5leHRTaWJsaW5nKTtcbiAgICAgICAgaWYgKCF0aGlzLmlzVGltZWQpIHtcbiAgICAgICAgICAgIHZhciBjYXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnF1ZXN0aW9uX2xhYmVsKSB7XG4gICAgICAgICAgICAgICAgLy8gRGlzcGxheSBjYXB0aW9uIGJhc2VkIG9uIHdoZXRoZXIgUnVuZXN0b25lIHNlcnZpY2VzIGhhdmUgYmVlbiBkZXRlY3RlZFxuICAgICAgICAgICAgICAgIHRoaXMuY2FwdGlvbiA9IGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzXG4gICAgICAgICAgICAgICAgICAgID8gYEFjdGl2aXR5OiAke3RoaXMucXVlc3Rpb25fbGFiZWx9ICR7dGhpcy5jYXB0aW9ufSAgPHNwYW4gY2xhc3M9XCJydW5lc3RvbmVfY2FwdGlvbl9kaXZpZFwiPigke3RoaXMuZGl2aWR9KTwvc3Bhbj5gXG4gICAgICAgICAgICAgICAgICAgIDogYEFjdGl2aXR5OiAke3RoaXMucXVlc3Rpb25fbGFiZWx9ICR7dGhpcy5jYXB0aW9ufWA7IC8vIFdpdGhvdXQgcnVuZXN0b25lXG4gICAgICAgICAgICAgICAgJChjYXBEaXYpLmh0bWwodGhpcy5jYXB0aW9uKTtcbiAgICAgICAgICAgICAgICAkKGNhcERpdikuYWRkQ2xhc3MoYCR7ZWxUeXBlfV9jYXB0aW9uYCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIERpc3BsYXkgY2FwdGlvbiBiYXNlZCBvbiB3aGV0aGVyIFJ1bmVzdG9uZSBzZXJ2aWNlcyBoYXZlIGJlZW4gZGV0ZWN0ZWRcbiAgICAgICAgICAgICAgICAkKGNhcERpdikuaHRtbChcbiAgICAgICAgICAgICAgICAgICAgZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXNcbiAgICAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5jYXB0aW9uICsgXCIgKFwiICsgdGhpcy5kaXZpZCArIFwiKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHRoaXMuY2FwdGlvblxuICAgICAgICAgICAgICAgICk7IC8vIFdpdGhvdXQgcnVuZXN0b25lXG4gICAgICAgICAgICAgICAgJChjYXBEaXYpLmFkZENsYXNzKGAke2VsVHlwZX1fY2FwdGlvbmApO1xuICAgICAgICAgICAgICAgICQoY2FwRGl2KS5hZGRDbGFzcyhgJHtlbFR5cGV9X2NhcHRpb25fdGV4dGApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jYXBEaXYgPSBjYXBEaXY7XG4gICAgICAgICAgICAvL3RoaXMub3V0ZXJEaXYucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoY2FwRGl2LCB0aGlzLm91dGVyRGl2Lm5leHRTaWJsaW5nKTtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKGNhcERpdik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYXNVc2VyQWN0aXZpdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzQW5zd2VyZWQ7XG4gICAgfVxuXG4gICAgY2hlY2tDdXJyZW50QW5zd2VyKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIFwiRWFjaCBjb21wb25lbnQgc2hvdWxkIHByb3ZpZGUgYW4gaW1wbGVtZW50YXRpb24gb2YgY2hlY2tDdXJyZW50QW5zd2VyXCJcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBhc3luYyBsb2dDdXJyZW50QW5zd2VyKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIFwiRWFjaCBjb21wb25lbnQgc2hvdWxkIHByb3ZpZGUgYW4gaW1wbGVtZW50YXRpb24gb2YgbG9nQ3VycmVudEFuc3dlclwiXG4gICAgICAgICk7XG4gICAgfVxuICAgIHJlbmRlckZlZWRiYWNrKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIFwiRWFjaCBjb21wb25lbnQgc2hvdWxkIHByb3ZpZGUgYW4gaW1wbGVtZW50YXRpb24gb2YgcmVuZGVyRmVlZGJhY2tcIlxuICAgICAgICApO1xuICAgIH1cbiAgICBkaXNhYmxlSW50ZXJhY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgXCJFYWNoIGNvbXBvbmVudCBzaG91bGQgcHJvdmlkZSBhbiBpbXBsZW1lbnRhdGlvbiBvZiBkaXNhYmxlSW50ZXJhY3Rpb25cIlxuICAgICAgICApO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfTogJHt0aGlzLmRpdmlkfWA7XG4gICAgfVxuXG4gICAgcXVldWVNYXRoSmF4KGNvbXBvbmVudCkge1xuICAgICAgICBpZiAodHlwZW9mIE1hdGhKYXggPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgLS0gTWF0aEpheCBpcyBub3QgbG9hZGVkXCIpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFNlZSAtIGh0dHBzOi8vZG9jcy5tYXRoamF4Lm9yZy9lbi9sYXRlc3QvYWR2YW5jZWQvdHlwZXNldC5odG1sXG4gICAgICAgICAgICAvLyBQZXIgdGhlIGFib3ZlIHdlIHNob3VsZCBrZWVwIHRyYWNrIG9mIHRoZSBwcm9taXNlcyBhbmQgb25seSBjYWxsIHRoaXNcbiAgICAgICAgICAgIC8vIGEgc2Vjb25kIHRpbWUgaWYgYWxsIHByZXZpb3VzIHByb21pc2VzIGhhdmUgcmVzb2x2ZWQuXG4gICAgICAgICAgICAvLyBDcmVhdGUgYSBxdWV1ZSBvZiBjb21wb25lbnRzXG4gICAgICAgICAgICAvLyBzaG91bGQgd2FpdCB1bnRpbCBkZWZhdWx0UGFnZVJlYWR5IGlzIGRlZmluZWRcbiAgICAgICAgICAgIC8vIElmIGRlZmF1bHRQYWdlUmVhZHkgaXMgbm90IGRlZmluZWQgdGhlbiBqdXN0IGVucXVldWUgdGhlIGNvbXBvbmVudHMuXG4gICAgICAgICAgICAvLyBPbmNlIGRlZmF1bHRQYWdlUmVhZHkgaXMgZGVmaW5lZFxuICAgICAgICAgICAgLy8gdGhlIHdpbmRvdy5ydW5lc3RvbmVNYXRoUmVhZHkgcHJvbWlzZSB3aWxsIGJlIGZ1bGZpbGxlZCB3aGVuIHRoZVxuICAgICAgICAgICAgLy8gaW5pdGlhbCB0eXBlc2V0dGluZyBpcyBjb21wbGV0ZS5cbiAgICAgICAgICAgIGlmIChNYXRoSmF4LnR5cGVzZXRQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cucnVuZXN0b25lTWF0aFJlYWR5ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cucnVuZXN0b25lTWF0aFJlYWR5LnRoZW4oKCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWpyZXNvbHZlcih0aGlzLmFRdWV1ZS5lbnF1ZXVlKGNvbXBvbmVudCkpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWpyZXNvbHZlcih0aGlzLmFRdWV1ZS5lbnF1ZXVlKGNvbXBvbmVudCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFdhaXRpbmcgb24gTWF0aEpheCEhICR7TWF0aEpheC50eXBlc2V0UHJvbWlzZX1gKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMucXVldWVNYXRoSmF4KGNvbXBvbmVudCksIDIwMCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFJldHVybmluZyBtanJlYWR5IHByb21pc2U6ICR7dGhpcy5talJlYWR5fWApO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1qUmVhZHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZWNvcmF0ZVN0YXR1cygpIHtcbiAgICAgICAgbGV0IHJzRGl2ID0gJCh0aGlzLmNvbnRhaW5lckRpdikuY2xvc2VzdChcImRpdi5ydW5lc3RvbmVcIilbMF07XG4gICAgICAgIGlmICh0aGlzLmNvcnJlY3QpIHtcbiAgICAgICAgICAgIHJzRGl2LmNsYXNzTGlzdC5hZGQoXCJpc0NvcnJlY3RcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jb3JyZWN0ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcnNEaXYuY2xhc3NMaXN0LmFkZChcIm5vdEFuc3dlcmVkXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByc0Rpdi5jbGFzc0xpc3QuYWRkKFwiaXNJbkNvcnJlY3RcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIEluc3BpcmF0aW9uIGFuZCBsb3RzIG9mIGNvZGUgZm9yIHRoaXMgc29sdXRpb24gY29tZSBmcm9tXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MzU0MDM0OC9qcy1hc3luYy1hd2FpdC10YXNrcy1xdWV1ZVxuLy8gVGhlIGlkZWEgaGVyZSBpcyB0aGF0IHVudGlsIE1hdGhKYXggaXMgcmVhZHkgd2UgY2FuIGp1c3QgZW5xdWV1ZSB0aGluZ3Ncbi8vIG9uY2UgbWF0aGpheCBiZWNvbWVzIHJlYWR5IHRoZW4gd2UgY2FuIGRyYWluIHRoZSBxdWV1ZSBhbmQgY29udGludWUgYXMgdXN1YWwuXG5cbmNsYXNzIFF1ZXVlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5faXRlbXMgPSBbXTtcbiAgICB9XG4gICAgZW5xdWV1ZShpdGVtKSB7XG4gICAgICAgIHRoaXMuX2l0ZW1zLnB1c2goaXRlbSk7XG4gICAgfVxuICAgIGRlcXVldWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pdGVtcy5zaGlmdCgpO1xuICAgIH1cbiAgICBnZXQgc2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1zLmxlbmd0aDtcbiAgICB9XG59XG5cbmNsYXNzIEF1dG9RdWV1ZSBleHRlbmRzIFF1ZXVlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1Byb21pc2UgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBlbnF1ZXVlKGNvbXBvbmVudCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc3VwZXIuZW5xdWV1ZSh7IGNvbXBvbmVudCwgcmVzb2x2ZSwgcmVqZWN0IH0pO1xuICAgICAgICAgICAgdGhpcy5kZXF1ZXVlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGRlcXVldWUoKSB7XG4gICAgICAgIGlmICh0aGlzLl9wZW5kaW5nUHJvbWlzZSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGxldCBpdGVtID0gc3VwZXIuZGVxdWV1ZSgpO1xuXG4gICAgICAgIGlmICghaXRlbSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLl9wZW5kaW5nUHJvbWlzZSA9IHRydWU7XG5cbiAgICAgICAgICAgIGxldCBwYXlsb2FkID0gYXdhaXQgd2luZG93LnJ1bmVzdG9uZU1hdGhSZWFkeVxuICAgICAgICAgICAgICAgIC50aGVuKGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgICAgICBgTWF0aEpheCBSZWFkeSAtLSBkZXF1ZWluZyBhIHR5cGVzZXR0aW5nIHJ1biBmb3IgJHtpdGVtLmNvbXBvbmVudC5pZH1gXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBNYXRoSmF4LnR5cGVzZXRQcm9taXNlKFtpdGVtLmNvbXBvbmVudF0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLl9wZW5kaW5nUHJvbWlzZSA9IGZhbHNlO1xuICAgICAgICAgICAgaXRlbS5yZXNvbHZlKHBheWxvYWQpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLl9wZW5kaW5nUHJvbWlzZSA9IGZhbHNlO1xuICAgICAgICAgICAgaXRlbS5yZWplY3QoZSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB0aGlzLmRlcXVldWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxud2luZG93LlJ1bmVzdG9uZUJhc2UgPSBSdW5lc3RvbmVCYXNlO1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldFN3aXRjaCgpIHtcbiAgICBjb25zdCB0b2dnbGVTd2l0Y2ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGhlbWUtc3dpdGNoIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScpO1xuICAgIGNvbnN0IGN1cnJlbnRUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0aGVtZScpID8gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RoZW1lJykgOiBudWxsO1xuXG4gICAgaWYgKGN1cnJlbnRUaGVtZSkge1xuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLXRoZW1lJywgY3VycmVudFRoZW1lKTtcblxuICAgICAgICBpZiAoY3VycmVudFRoZW1lID09PSAnZGFyaycpIHtcbiAgICAgICAgICAgIHRvZ2dsZVN3aXRjaC5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN3aXRjaFRoZW1lKCkge1xuXG5cdHZhciBjaGVja0JveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hlY2tib3hcIik7XG4gICAgaWYgKGNoZWNrQm94LmNoZWNrZWQgPT0gdHJ1ZSkge1xuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLXRoZW1lJywgJ2RhcmsnKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RoZW1lJywgJ2RhcmsnKTsgLy9hZGQgdGhpc1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS10aGVtZScsICdsaWdodCcpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndGhlbWUnLCAnbGlnaHQnKTsgLy9hZGQgdGhpc1xuICAgIH1cbn1cbiIsIi8qZ2xvYmFsIHZhcmlhYmxlIGRlY2xhcmF0aW9ucyovXG5cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgXCIuLi9jc3MvdXNlci1oaWdobGlnaHRzLmNzc1wiO1xuXG5mdW5jdGlvbiBnZXRDb21wbGV0aW9ucygpIHtcbiAgICAvLyBHZXQgdGhlIGNvbXBsZXRpb24gc3RhdHVzXG4gICAgaWYgKFxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaChcbiAgICAgICAgICAgIC8oaW5kZXguaHRtbHx0b2N0cmVlLmh0bWx8Z2VuaW5kZXguaHRtbHxuYXZoZWxwLmh0bWx8dG9jLmh0bWx8YXNzaWdubWVudHMuaHRtbHxFeGVyY2lzZXMuaHRtbCkvXG4gICAgICAgIClcbiAgICApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBjdXJyZW50UGF0aG5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgaWYgKGN1cnJlbnRQYXRobmFtZS5pbmRleE9mKFwiP1wiKSAhPT0gLTEpIHtcbiAgICAgICAgY3VycmVudFBhdGhuYW1lID0gY3VycmVudFBhdGhuYW1lLnN1YnN0cmluZyhcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICBjdXJyZW50UGF0aG5hbWUubGFzdEluZGV4T2YoXCI/XCIpXG4gICAgICAgICk7XG4gICAgfVxuICAgIHZhciBkYXRhID0ge1xuICAgICAgICBsYXN0UGFnZVVybDogY3VycmVudFBhdGhuYW1lLFxuICAgICAgICBpc1B0eEJvb2s6IGlzUHJlVGVYdCgpLFxuICAgIH07XG4gICAgalF1ZXJ5XG4gICAgICAgIC5hamF4KHtcbiAgICAgICAgICAgIHVybDogYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2xvZ2dlci9nZXRDb21wbGV0aW9uU3RhdHVzYCxcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIH0pXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZGF0YSAhPSBcIk5vbmVcIikge1xuICAgICAgICAgICAgICAgIHZhciBjb21wbGV0aW9uRGF0YSA9IGRhdGEuZGV0YWlsO1xuICAgICAgICAgICAgICAgIHZhciBjb21wbGV0aW9uQ2xhc3MsIGNvbXBsZXRpb25Nc2c7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRpb25EYXRhWzBdLmNvbXBsZXRpb25TdGF0dXMgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0aW9uQ2xhc3MgPSBcImJ1dHRvbkNvbmZpcm1Db21wbGV0aW9uXCI7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRpb25Nc2cgPVxuICAgICAgICAgICAgICAgICAgICAgICAgXCI8aSBjbGFzcz0nZ2x5cGhpY29uIGdseXBoaWNvbi1vayc+PC9pPiBDb21wbGV0ZWQuIFdlbGwgRG9uZSFcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0aW9uQ2xhc3MgPSBcImJ1dHRvbkFza0NvbXBsZXRpb25cIjtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGlvbk1zZyA9IFwiTWFyayBhcyBDb21wbGV0ZWRcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IHNjcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2Nwcm9ncmVzc2NvbnRhaW5lclwiKTtcbiAgICAgICAgICAgICAgICBpZiAoc2NwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcC5jbGFzc0xpc3QuYWRkKFwicHR4LXJ1bmVzdG9uZS1jb250YWluZXJcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQoXCIjc2Nwcm9ncmVzc2NvbnRhaW5lclwiKS5hcHBlbmQoXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjpjZW50ZXJcIj48YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1sZyAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRpb25DbGFzcyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnXCIgaWQ9XCJjb21wbGV0aW9uQnV0dG9uXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0aW9uTXNnICtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPC9idXR0b24+PC9kaXY+XCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbn1cblxuZnVuY3Rpb24gc2hvd0xhc3RQb3NpdGlvbkJhbm5lcigpIHtcbiAgICB2YXIgbGFzdFBvc2l0aW9uVmFsID0gJC5nZXRVcmxWYXIoXCJsYXN0UG9zaXRpb25cIik7XG4gICAgaWYgKHR5cGVvZiBsYXN0UG9zaXRpb25WYWwgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgJChcImJvZHlcIikuYXBwZW5kKFxuICAgICAgICAgICAgJzxpbWcgc3JjPVwiLi4vX3N0YXRpYy9sYXN0LXBvaW50LnBuZ1wiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7IHBhZGRpbmctdG9wOjU1cHg7IGxlZnQ6IDEwcHg7IHRvcDogJyArXG4gICAgICAgICAgICAgICAgcGFyc2VJbnQobGFzdFBvc2l0aW9uVmFsKSArXG4gICAgICAgICAgICAgICAgJ3B4O1wiLz4nXG4gICAgICAgICk7XG4gICAgICAgICQoXCJodG1sLCBib2R5XCIpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IHBhcnNlSW50KGxhc3RQb3NpdGlvblZhbCkgfSwgMTAwMCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhZGROYXZpZ2F0aW9uQW5kQ29tcGxldGlvbkJ1dHRvbnMoKSB7XG4gICAgaWYgKFxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaChcbiAgICAgICAgICAgIC8oaW5kZXguaHRtbHxnZW5pbmRleC5odG1sfG5hdmhlbHAuaHRtbHx0b2MuaHRtbHxhc3NpZ25tZW50cy5odG1sfEV4ZXJjaXNlcy5odG1sfHRvY3RyZWUuaHRtbCkvXG4gICAgICAgIClcbiAgICApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgbmF2TGlua0JnUmlnaHRIaWRkZW5Qb3NpdGlvbiA9IC0kKFwiI25hdkxpbmtCZ1JpZ2h0XCIpLm91dGVyV2lkdGgoKSAtIDU7XG4gICAgdmFyIG5hdkxpbmtCZ1JpZ2h0SGFsZk9wZW47XG4gICAgdmFyIG5hdkxpbmtCZ1JpZ2h0RnVsbE9wZW4gPSAwO1xuXG4gICAgaWYgKCQoXCIjY29tcGxldGlvbkJ1dHRvblwiKS5oYXNDbGFzcyhcImJ1dHRvbkFza0NvbXBsZXRpb25cIikpIHtcbiAgICAgICAgbmF2TGlua0JnUmlnaHRIYWxmT3BlbiA9IG5hdkxpbmtCZ1JpZ2h0SGlkZGVuUG9zaXRpb24gKyA3MDtcbiAgICB9IGVsc2UgaWYgKCQoXCIjY29tcGxldGlvbkJ1dHRvblwiKS5oYXNDbGFzcyhcImJ1dHRvbkNvbmZpcm1Db21wbGV0aW9uXCIpKSB7XG4gICAgICAgIG5hdkxpbmtCZ1JpZ2h0SGFsZk9wZW4gPSAwO1xuICAgIH1cbiAgICB2YXIgcmVsYXRpb25zTmV4dEljb25Jbml0aWFsUG9zaXRpb24gPSAkKFwiI3JlbGF0aW9ucy1uZXh0XCIpLmNzcyhcInJpZ2h0XCIpO1xuICAgIHZhciByZWxhdGlvbnNOZXh0SWNvbk5ld1Bvc2l0aW9uID0gLShuYXZMaW5rQmdSaWdodEhpZGRlblBvc2l0aW9uICsgMzUpO1xuXG4gICAgJChcIiNuYXZMaW5rQmdSaWdodFwiKS5jc3MoXCJyaWdodFwiLCBuYXZMaW5rQmdSaWdodEhpZGRlblBvc2l0aW9uKS5zaG93KCk7XG4gICAgdmFyIG5hdkJnU2hvd24gPSBmYWxzZTtcbiAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgJCh3aW5kb3cpLmhlaWdodCgpID09XG4gICAgICAgICAgICAkKGRvY3VtZW50KS5oZWlnaHQoKVxuICAgICAgICApIHtcbiAgICAgICAgICAgICQoXCIjbmF2TGlua0JnUmlnaHRcIikuYW5pbWF0ZShcbiAgICAgICAgICAgICAgICB7IHJpZ2h0OiBuYXZMaW5rQmdSaWdodEhhbGZPcGVuIH0sXG4gICAgICAgICAgICAgICAgMjAwXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgJChcIiNuYXZMaW5rQmdMZWZ0XCIpLmFuaW1hdGUoeyBsZWZ0OiBcIjBweFwiIH0sIDIwMCk7XG4gICAgICAgICAgICBpZiAoJChcIiNjb21wbGV0aW9uQnV0dG9uXCIpLmhhc0NsYXNzKFwiYnV0dG9uQ29uZmlybUNvbXBsZXRpb25cIikpIHtcbiAgICAgICAgICAgICAgICAkKFwiI3JlbGF0aW9ucy1uZXh0XCIpLmFuaW1hdGUoXG4gICAgICAgICAgICAgICAgICAgIHsgcmlnaHQ6IHJlbGF0aW9uc05leHRJY29uTmV3UG9zaXRpb24gfSxcbiAgICAgICAgICAgICAgICAgICAgMjAwXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5hdkJnU2hvd24gPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKG5hdkJnU2hvd24pIHtcbiAgICAgICAgICAgICQoXCIjbmF2TGlua0JnUmlnaHRcIikuYW5pbWF0ZShcbiAgICAgICAgICAgICAgICB7IHJpZ2h0OiBuYXZMaW5rQmdSaWdodEhpZGRlblBvc2l0aW9uIH0sXG4gICAgICAgICAgICAgICAgMjAwXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgJChcIiNuYXZMaW5rQmdMZWZ0XCIpLmFuaW1hdGUoeyBsZWZ0OiBcIi02NXB4XCIgfSwgMjAwKTtcbiAgICAgICAgICAgICQoXCIjcmVsYXRpb25zLW5leHRcIikuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgcmlnaHQ6IHJlbGF0aW9uc05leHRJY29uSW5pdGlhbFBvc2l0aW9uLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBuYXZCZ1Nob3duID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjb21wbGV0aW9uRmxhZyA9IDA7XG4gICAgaWYgKCQoXCIjY29tcGxldGlvbkJ1dHRvblwiKS5oYXNDbGFzcyhcImJ1dHRvbkFza0NvbXBsZXRpb25cIikpIHtcbiAgICAgICAgY29tcGxldGlvbkZsYWcgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXBsZXRpb25GbGFnID0gMTtcbiAgICB9XG4gICAgLy8gTWFrZSBzdXJlIHdlIG1hcmsgdGhpcyBwYWdlIGFzIHZpc2l0ZWQgcmVnYXJkbGVzcyBvZiBob3cgZmxha2V5XG4gICAgLy8gdGhlIG9udW5sb2FkIGhhbmRsZXJzIGJlY29tZS5cbiAgICBwcm9jZXNzUGFnZVN0YXRlKGNvbXBsZXRpb25GbGFnLCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xuICAgICQoXCIjY29tcGxldGlvbkJ1dHRvblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG1hcmtpbmdDb21wbGV0ZSA9IGZhbHNlO1xuICAgICAgICB2YXIgbWFya2luZ0luY29tcGxldGUgPSBmYWxzZTtcbiAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoXCJidXR0b25Bc2tDb21wbGV0aW9uXCIpKSB7XG4gICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKFwiYnV0dG9uQXNrQ29tcGxldGlvblwiKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhcImJ1dHRvbkNvbmZpcm1Db21wbGV0aW9uXCIpXG4gICAgICAgICAgICAgICAgLmh0bWwoXG4gICAgICAgICAgICAgICAgICAgIFwiPGkgY2xhc3M9J2dseXBoaWNvbiBnbHlwaGljb24tb2snPjwvaT4gQ29tcGxldGVkLiBXZWxsIERvbmUhXCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgJChcIiNuYXZMaW5rQmdSaWdodFwiKS5hbmltYXRlKHsgcmlnaHQ6IG5hdkxpbmtCZ1JpZ2h0RnVsbE9wZW4gfSk7XG4gICAgICAgICAgICAkKFwiI3JlbGF0aW9ucy1uZXh0XCIpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIHJpZ2h0OiByZWxhdGlvbnNOZXh0SWNvbk5ld1Bvc2l0aW9uLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBuYXZMaW5rQmdSaWdodEhhbGZPcGVuID0gMDtcbiAgICAgICAgICAgIGNvbXBsZXRpb25GbGFnID0gMTtcbiAgICAgICAgICAgIG1hcmtpbmdDb21wbGV0ZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImJ1dHRvbkNvbmZpcm1Db21wbGV0aW9uXCIpKSB7XG4gICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKFwiYnV0dG9uQ29uZmlybUNvbXBsZXRpb25cIilcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoXCJidXR0b25Bc2tDb21wbGV0aW9uXCIpXG4gICAgICAgICAgICAgICAgLmh0bWwoXCJNYXJrIGFzIENvbXBsZXRlZFwiKTtcbiAgICAgICAgICAgIG5hdkxpbmtCZ1JpZ2h0SGFsZk9wZW4gPSBuYXZMaW5rQmdSaWdodEhpZGRlblBvc2l0aW9uICsgNzA7XG4gICAgICAgICAgICAkKFwiI25hdkxpbmtCZ1JpZ2h0XCIpLmFuaW1hdGUoeyByaWdodDogbmF2TGlua0JnUmlnaHRIYWxmT3BlbiB9KTtcbiAgICAgICAgICAgICQoXCIjcmVsYXRpb25zLW5leHRcIikuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgcmlnaHQ6IHJlbGF0aW9uc05leHRJY29uSW5pdGlhbFBvc2l0aW9uLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb21wbGV0aW9uRmxhZyA9IDA7XG4gICAgICAgICAgICBtYXJraW5nSW5jb21wbGV0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvY2Vzc1BhZ2VTdGF0ZShcbiAgICAgICAgICAgIGNvbXBsZXRpb25GbGFnLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICBtYXJraW5nQ29tcGxldGUsXG4gICAgICAgICAgICBtYXJraW5nSW5jb21wbGV0ZVxuICAgICAgICApO1xuICAgIH0pO1xuXG4gICAgLy8gd2UgY2Fubm90IGFmZm9yZCB0byBkbyB0aGlzIGF0IGJvdGggbG9hZCBhbmQgdW5sb2FkIGVzcGVjaWFsbHkgYXMgdXNlcnNcbiAgICAvLyBnbyBmcm9tIHBhZ2UgdG8gcGFnZS4gVGhpcyBqdXN0IGRvdWJsZXMgdGhlIGxvYWQuICBTbywgdHJ5IHdpdGhvdXQgdGhpcyBvbmUuXG4gICAgLy8gJCh3aW5kb3cpLm9uKFwiYmVmb3JldW5sb2FkXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgLy8gICAgIGlmIChjb21wbGV0aW9uRmxhZyA9PSAwKSB7XG4gICAgLy8gICAgICAgICBwcm9jZXNzUGFnZVN0YXRlKGNvbXBsZXRpb25GbGFnLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAvLyAgICAgfVxuICAgIC8vIH0pO1xufVxuXG4vLyBfIGRlY29yYXRlVGFibGVPZkNvbnRlbnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBkZWNvcmF0ZVRhYmxlT2ZDb250ZW50cygpIHtcbiAgICBpZiAoXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcInRvYy5odG1sXCIpICE9IC0xIHx8XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcImluZGV4Lmh0bWxcIikgIT0gLTEgfHxcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwiZnJvbnRtYXR0ZXJcIikgIT0gLTFcbiAgICApIHtcbiAgICAgICAgaWYgKCFpc1ByZVRlWHQoKSkge1xuICAgICAgICAgICAgalF1ZXJ5LmdldChcbiAgICAgICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vbG9nZ2VyL2dldEFsbENvbXBsZXRpb25TdGF0dXNgLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdWJDaGFwdGVyTGlzdDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgIT0gXCJOb25lXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YkNoYXB0ZXJMaXN0ID0gZGF0YS5kZXRhaWw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhbGxTdWJDaGFwdGVyVVJMcyA9ICQoXCIjbWFpbi1jb250ZW50IGRpdiBsaSBhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKHN1YkNoYXB0ZXJMaXN0LCBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBzID0gMDsgcyA8IGFsbFN1YkNoYXB0ZXJVUkxzLmxlbmd0aDsgcysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbFN1YkNoYXB0ZXJVUkxzW3NdLmhyZWYuaW5kZXhPZihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmNoYXB0ZXJOYW1lICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIvXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnN1YkNoYXB0ZXJOYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApICE9IC0xXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29tcGxldGlvblN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChhbGxTdWJDaGFwdGVyVVJMc1tzXS5wYXJlbnRFbGVtZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoXCJjb21wbGV0ZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImluZm9UZXh0Q29tcGxldGVkXCI+LSBDb21wbGV0ZWQgdGhpcyB0b3BpYyBvbiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmVuZERhdGUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiPC9zcGFuPlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNoaWxkcmVuKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpcnN0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmhvdmVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm5leHQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIi5pbmZvVGV4dENvbXBsZXRlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubmV4dChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiLmluZm9UZXh0Q29tcGxldGVkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtLmNvbXBsZXRpb25TdGF0dXMgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoYWxsU3ViQ2hhcHRlclVSTHNbc10ucGFyZW50RWxlbWVudClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKFwiYWN0aXZlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJpbmZvVGV4dEFjdGl2ZVwiPkxhc3QgcmVhZCB0aGlzIHRvcGljIG9uICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uZW5kRGF0ZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCI8L3NwYW4+XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2hpbGRyZW4oKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlyc3QoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaG92ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubmV4dChcIi5pbmZvVGV4dEFjdGl2ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5uZXh0KFwiLmluZm9UZXh0QWN0aXZlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRhdGEgPSB7IGNvdXJzZTogZUJvb2tDb25maWcuY291cnNlIH07XG4gICAgICAgIGpRdWVyeS5nZXQoXG4gICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vbG9nZ2VyL2dldGxhc3RwYWdlYCxcbiAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciBsYXN0UGFnZURhdGE7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEgIT0gXCJOb25lXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdFBhZ2VEYXRhID0gZGF0YS5kZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0UGFnZURhdGEubGFzdFBhZ2VDaGFwdGVyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIjY29udGludWUtcmVhZGluZ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zaG93KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaHRtbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJqdW1wLXRvLWNoYXB0ZXJcIiBjbGFzcz1cImFsZXJ0IGFsZXJ0LWluZm9cIiA+PHN0cm9uZz5Zb3Ugd2VyZSBMYXN0IFJlYWRpbmc6PC9zdHJvbmc+ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFBhZ2VEYXRhLmxhc3RQYWdlQ2hhcHRlciArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobGFzdFBhZ2VEYXRhLmxhc3RQYWdlU3ViY2hhcHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCIgJmd0OyBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0UGFnZURhdGEubGFzdFBhZ2VTdWJjaGFwdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIlwiKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnIDxhIGhyZWY9XCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RQYWdlRGF0YS5sYXN0UGFnZVVybCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIj9sYXN0UG9zaXRpb249XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFBhZ2VEYXRhLmxhc3RQYWdlU2Nyb2xsTG9jYXRpb24gK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1wiPkNvbnRpbnVlIFJlYWRpbmc8L2E+PC9kaXY+J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBlbmFibGVDb21wbGV0aW9ucygpIHtcbiAgICBnZXRDb21wbGV0aW9ucygpO1xuICAgIHNob3dMYXN0UG9zaXRpb25CYW5uZXIoKTtcbiAgICBhZGROYXZpZ2F0aW9uQW5kQ29tcGxldGlvbkJ1dHRvbnMoKTtcbiAgICBkZWNvcmF0ZVRhYmxlT2ZDb250ZW50cygpO1xufVxuXG4vLyBjYWxsIGVuYWJsZSB1c2VyIGhpZ2hsaWdodHMgYWZ0ZXIgbG9naW5cbiQoZG9jdW1lbnQpLm9uKFwicnVuZXN0b25lOmxvZ2luXCIsIGVuYWJsZUNvbXBsZXRpb25zKTtcblxuZnVuY3Rpb24gaXNQcmVUZVh0KCkge1xuICAgIGxldCBwdHhNYXJrZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keS5wcmV0ZXh0XCIpO1xuICAgIGlmIChwdHhNYXJrZXIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cbi8vIF8gcHJvY2Vzc1BhZ2VTdGF0ZVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gcHJvY2Vzc1BhZ2VTdGF0ZShcbiAgICBjb21wbGV0aW9uRmxhZyxcbiAgICBwYWdlTG9hZCxcbiAgICBtYXJraW5nQ29tcGxldGUsXG4gICAgbWFya2luZ0luY29tcGxldGVcbikge1xuICAgIC8qTG9nIGxhc3QgcGFnZSB2aXNpdGVkKi9cbiAgICB2YXIgY3VycmVudFBhdGhuYW1lID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgIGlmIChjdXJyZW50UGF0aG5hbWUuaW5kZXhPZihcIj9cIikgIT09IC0xKSB7XG4gICAgICAgIGN1cnJlbnRQYXRobmFtZSA9IGN1cnJlbnRQYXRobmFtZS5zdWJzdHJpbmcoXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgY3VycmVudFBhdGhuYW1lLmxhc3RJbmRleE9mKFwiP1wiKVxuICAgICAgICApO1xuICAgIH1cbiAgICAvLyBJcyB0aGlzIGEgcHR4IGJvb2s/XG4gICAgbGV0IGlzUHR4Qm9vayA9IGlzUHJlVGVYdCgpO1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgICBsYXN0UGFnZVVybDogY3VycmVudFBhdGhuYW1lLFxuICAgICAgICBsYXN0UGFnZVNjcm9sbExvY2F0aW9uOiBNYXRoLnJvdW5kKCQod2luZG93KS5zY3JvbGxUb3AoKSksXG4gICAgICAgIGNvbXBsZXRpb25GbGFnOiBjb21wbGV0aW9uRmxhZyxcbiAgICAgICAgcGFnZUxvYWQ6IHBhZ2VMb2FkLFxuICAgICAgICBtYXJraW5nQ29tcGxldGU6IG1hcmtpbmdDb21wbGV0ZSxcbiAgICAgICAgbWFya2luZ0luY29tcGxldGU6IG1hcmtpbmdJbmNvbXBsZXRlLFxuICAgICAgICBjb3Vyc2U6IGVCb29rQ29uZmlnLmNvdXJzZSxcbiAgICAgICAgaXNQdHhCb29rOiBpc1B0eEJvb2ssXG4gICAgfTtcbiAgICAkKGRvY3VtZW50KS5hamF4RXJyb3IoZnVuY3Rpb24gKGUsIGpxaHhyLCBzZXR0aW5ncywgZXhjZXB0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVxdWVzdCBGYWlsZWQgZm9yIFwiICsgc2V0dGluZ3MudXJsKTtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgfSk7XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICB1cmw6IGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9sb2dnZXIvdXBkYXRlbGFzdHBhZ2VgLFxuICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIsXG4gICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGFzeW5jOiB0cnVlLFxuICAgIH0pO1xufVxuXG4kLmV4dGVuZCh7XG4gICAgZ2V0VXJsVmFyczogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdmFycyA9IFtdLFxuICAgICAgICAgICAgaGFzaDtcbiAgICAgICAgdmFyIGhhc2hlcyA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2hcbiAgICAgICAgICAgIC5zbGljZSh3aW5kb3cubG9jYXRpb24uc2VhcmNoLmluZGV4T2YoXCI/XCIpICsgMSlcbiAgICAgICAgICAgIC5zcGxpdChcIiZcIik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGFzaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBoYXNoID0gaGFzaGVzW2ldLnNwbGl0KFwiPVwiKTtcbiAgICAgICAgICAgIHZhcnMucHVzaChoYXNoWzBdKTtcbiAgICAgICAgICAgIHZhcnNbaGFzaFswXV0gPSBoYXNoWzFdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YXJzO1xuICAgIH0sXG4gICAgZ2V0VXJsVmFyOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICByZXR1cm4gJC5nZXRVcmxWYXJzKClbbmFtZV07XG4gICAgfSxcbn0pO1xuIiwiKGZ1bmN0aW9uICgkKSB7XG4gIC8qKlxuICAgKiBQYXRjaCBUT0MgbGlzdC5cbiAgICpcbiAgICogV2lsbCBtdXRhdGUgdGhlIHVuZGVybHlpbmcgc3BhbiB0byBoYXZlIGEgY29ycmVjdCB1bCBmb3IgbmF2LlxuICAgKlxuICAgKiBAcGFyYW0gJHNwYW46IFNwYW4gY29udGFpbmluZyBuZXN0ZWQgVUwncyB0byBtdXRhdGUuXG4gICAqIEBwYXJhbSBtaW5MZXZlbDogU3RhcnRpbmcgbGV2ZWwgZm9yIG5lc3RlZCBsaXN0cy4gKDE6IGdsb2JhbCwgMjogbG9jYWwpLlxuICAgKi9cbiAgdmFyIHBhdGNoVG9jID0gZnVuY3Rpb24gKCR1bCwgbWluTGV2ZWwpIHtcbiAgICB2YXIgZmluZEEsXG4gICAgICBwYXRjaFRhYmxlcyxcbiAgICAgICRsb2NhbExpO1xuXG4gICAgLy8gRmluZCBhbGwgYSBcImludGVybmFsXCIgdGFncywgdHJhdmVyc2luZyByZWN1cnNpdmVseS5cbiAgICBmaW5kQSA9IGZ1bmN0aW9uICgkZWxlbSwgbGV2ZWwpIHtcbiAgICAgIGxldmVsID0gbGV2ZWwgfHwgMDtcbiAgICAgIHZhciAkaXRlbXMgPSAkZWxlbS5maW5kKFwiPiBsaSA+IGEuaW50ZXJuYWwsID4gdWwsID4gbGkgPiB1bFwiKTtcblxuICAgICAgLy8gSXRlcmF0ZSBldmVyeXRoaW5nIGluIG9yZGVyLlxuICAgICAgJGl0ZW1zLmVhY2goZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XG4gICAgICAgIHZhciAkaXRlbSA9ICQoaXRlbSksXG4gICAgICAgICAgdGFnID0gaXRlbS50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgJGNoaWxkcmVuTGkgPSAkaXRlbS5jaGlsZHJlbignbGknKSxcbiAgICAgICAgICAkcGFyZW50TGkgPSAkKCRpdGVtLnBhcmVudCgnbGknKSwgJGl0ZW0ucGFyZW50KCkucGFyZW50KCdsaScpKTtcblxuICAgICAgICAvLyBBZGQgZHJvcGRvd25zIGlmIG1vcmUgY2hpbGRyZW4gYW5kIGFib3ZlIG1pbmltdW0gbGV2ZWwuXG4gICAgICAgIGlmICh0YWcgPT09ICd1bCcgJiYgbGV2ZWwgPj0gbWluTGV2ZWwgJiYgJGNoaWxkcmVuTGkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICRwYXJlbnRMaVxuICAgICAgICAgICAgLmFkZENsYXNzKCdkcm9wZG93bi1zdWJtZW51JylcbiAgICAgICAgICAgIC5jaGlsZHJlbignYScpLmZpcnN0KCkuYXR0cigndGFiaW5kZXgnLCAtMSk7XG5cbiAgICAgICAgICAkaXRlbS5hZGRDbGFzcygnZHJvcGRvd24tbWVudScpO1xuICAgICAgICB9XG5cbiAgICAgICAgZmluZEEoJGl0ZW0sIGxldmVsICsgMSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgZmluZEEoJHVsKTtcbiAgfTtcblxuICAvKipcbiAgICogUGF0Y2ggYWxsIHRhYmxlcyB0byByZW1vdmUgYGBkb2N1dGlsc2BgIGNsYXNzIGFuZCBhZGQgQm9vdHN0cmFwIGJhc2VcbiAgICogYGB0YWJsZWBgIGNsYXNzLlxuICAgKi9cbiAgcGF0Y2hUYWJsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgJChcInRhYmxlLmRvY3V0aWxzXCIpXG4gICAgICAucmVtb3ZlQ2xhc3MoXCJkb2N1dGlsc1wiKVxuICAgICAgLmFkZENsYXNzKFwidGFibGVcIilcbiAgICAgIC5hdHRyKFwiYm9yZGVyXCIsIDApO1xuICB9O1xuXG4kKGZ1bmN0aW9uICgpIHtcblxuICAgIC8qXG4gICAgICogU2Nyb2xsIHRoZSB3aW5kb3cgdG8gYXZvaWQgdGhlIHRvcG5hdiBiYXJcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vdHdpdHRlci9ib290c3RyYXAvaXNzdWVzLzE3NjhcbiAgICAgKi9cbiAgICBpZiAoJChcIiNuYXZiYXIubmF2YmFyLWZpeGVkLXRvcFwiKS5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgbmF2SGVpZ2h0ID0gJChcIiNuYXZiYXJcIikuaGVpZ2h0KCksXG4gICAgICAgIHNoaWZ0V2luZG93ID0gZnVuY3Rpb24oKSB7IHNjcm9sbEJ5KDAsIC1uYXZIZWlnaHQgLSAxMCk7IH07XG5cbiAgICAgIGlmIChsb2NhdGlvbi5oYXNoKSB7XG4gICAgICAgIHNoaWZ0V2luZG93KCk7XG4gICAgICB9XG5cbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiaGFzaGNoYW5nZVwiLCBzaGlmdFdpbmRvdyk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHN0eWxpbmcsIHN0cnVjdHVyZSB0byBUT0Mncy5cbiAgICAkKFwiLmRyb3Bkb3duLW1lbnVcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAkKHRoaXMpLmZpbmQoXCJ1bFwiKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgaXRlbSl7XG4gICAgICAgIHZhciAkaXRlbSA9ICQoaXRlbSk7XG4gICAgICAgICRpdGVtLmFkZENsYXNzKCd1bnN0eWxlZCcpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBHbG9iYWwgVE9DLlxuICAgIGlmICgkKFwidWwuZ2xvYmFsdG9jIGxpXCIpLmxlbmd0aCkge1xuICAgICAgcGF0Y2hUb2MoJChcInVsLmdsb2JhbHRvY1wiKSwgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlbW92ZSBHbG9iYWwgVE9DLlxuICAgICAgJChcIi5nbG9iYWx0b2MtY29udGFpbmVyXCIpLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIC8vIExvY2FsIFRPQy5cbiAgICBwYXRjaFRvYygkKFwidWwubG9jYWx0b2NcIiksIDIpO1xuXG4gICAgLy8gTXV0YXRlIHN1Yi1saXN0cyAoZm9yIGJzLTIuMy4wKS5cbiAgICAkKFwiLmRyb3Bkb3duLW1lbnUgdWxcIikubm90KFwiLmRyb3Bkb3duLW1lbnVcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHVsID0gJCh0aGlzKSxcbiAgICAgICAgJHBhcmVudCA9ICR1bC5wYXJlbnQoKSxcbiAgICAgICAgdGFnID0gJHBhcmVudFswXS50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICRraWRzID0gJHVsLmNoaWxkcmVuKCkuZGV0YWNoKCk7XG5cbiAgICAgIC8vIFJlcGxhY2UgbGlzdCB3aXRoIGl0ZW1zIGlmIHN1Ym1lbnUgaGVhZGVyLlxuICAgICAgaWYgKHRhZyA9PT0gXCJ1bFwiKSB7XG4gICAgICAgICR1bC5yZXBsYWNlV2l0aCgka2lkcyk7XG4gICAgICB9IGVsc2UgaWYgKHRhZyA9PT0gXCJsaVwiKSB7XG4gICAgICAgIC8vIEluc2VydCBpbnRvIHByZXZpb3VzIGxpc3QuXG4gICAgICAgICRwYXJlbnQuYWZ0ZXIoJGtpZHMpO1xuICAgICAgICAkdWwucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBBZGQgZGl2aWRlciBpbiBwYWdlIFRPQy5cbiAgICAkbG9jYWxMaSA9ICQoXCJ1bC5sb2NhbHRvYyBsaVwiKTtcbiAgICBpZiAoJGxvY2FsTGkubGVuZ3RoID4gMikge1xuICAgICAgJGxvY2FsTGkuZmlyc3QoKS5hZnRlcignPGxpIGNsYXNzPVwiZGl2aWRlclwiPjwvbGk+Jyk7XG4gICAgfVxuXG4gICAgLy8gRW5hYmxlIGRyb3Bkb3duLlxuICAgICQoJy5kcm9wZG93bi10b2dnbGUnKS5kcm9wZG93bigpO1xuXG4gICAgLy8gUGF0Y2ggdGFibGVzLlxuICAgIHBhdGNoVGFibGVzKCk7XG5cbiAgICAvLyBBZGQgTm90ZSwgV2FybmluZyBzdHlsZXMuXG4gICAgJCgnZGl2Lm5vdGUnKS5hZGRDbGFzcygnYWxlcnQnKS5hZGRDbGFzcygnYWxlcnQtaW5mbycpO1xuICAgICQoJ2Rpdi53YXJuaW5nJykuYWRkQ2xhc3MoJ2FsZXJ0JykuYWRkQ2xhc3MoJ2FsZXJ0LXdhcm5pbmcnKTtcblxuICAgIC8vIElubGluZSBjb2RlIHN0eWxlcyB0byBCb290c3RyYXAgc3R5bGUuXG4gICAgJCgndHQuZG9jdXRpbHMubGl0ZXJhbCcpLm5vdChcIi54cmVmXCIpLmVhY2goZnVuY3Rpb24gKGksIGUpIHtcbiAgICAgIC8vIGlnbm9yZSByZWZlcmVuY2VzXG4gICAgICBpZiAoISQoZSkucGFyZW50KCkuaGFzQ2xhc3MoXCJyZWZlcmVuY2VcIikpIHtcbiAgICAgICAgJChlKS5yZXBsYWNlV2l0aChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuICQoXCI8Y29kZSAvPlwiKS50ZXh0KCQodGhpcykudGV4dCgpKTtcbiAgICAgICAgfSk7XG4gICAgICB9fSk7XG4gIH0pO1xufSh3aW5kb3cualF1ZXJ5KSk7XG4iLCIvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gfGRvY25hbWV8IC0gQSBmcmFtZXdvcmsgYWxsb3dpbmcgYSBSdW5lc3RvbmUgY29tcG9uZW50IHRvIGxvYWQgb25seSB0aGUgSlMgaXQgbmVlZHNcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBUaGUgSmF2YVNjcmlwdCByZXF1aXJlZCBieSBhbGwgUnVuZXN0b25lIGNvbXBvbmVudHMgaXMgcXVpdGUgbGFyZ2UgYW5kIHJlc3VsdHMgaW4gc2xvdyBwYWdlIGxvYWRzLiBUaGlzIGFwcHJvYWNoIGVuYWJsZXMgYSBSdW5lc3RvbmUgY29tcG9uZW50IHRvIGxvYWQgb25seSB0aGUgSmF2YVNjcmlwdCBpdCBuZWVkcywgcmF0aGVyIHRoYW4gbG9hZGluZyBKYXZhU2NyaXB0IGZvciBhbGwgdGhlIGNvbXBvbmVudHMgcmVnYXJkbGVzcyBvZiB3aGljaCBhcmUgYWN0dWFsbHkgdXNlZC5cbi8vXG4vLyBUbyBhY2NvbXBsaXNoIHRoaXMsIHdlYnBhY2sncyBzcGxpdC1jaHVua3MgYWJpbGl0eSBhbmFseXplcyBhbGwgSlMsIHN0YXJ0aW5nIGZyb20gdGhpcyBmaWxlLiBUaGUgZHluYW1pYyBpbXBvcnRzIGJlbG93IGFyZSB0cmFuc2Zvcm1lZCBieSB3ZWJwYWNrIGludG8gdGhlIGR5bmFtaWMgZmV0Y2hlcyBvZiBqdXN0IHRoZSBKUyByZXF1aXJlZCBieSBlYWNoIGZpbGUgYW5kIGFsbCBpdHMgZGVwZW5kZW5jaWVzLiAoSWYgdXNpbmcgc3RhdGljIGltcG9ydHMsIHdlYnBhY2sgd2lsbCBhc3N1bWUgdGhhdCBhbGwgZmlsZXMgYXJlIGFscmVhZHkgc3RhdGljYWxseSBsb2FkZWQgdmlhIHNjcmlwdCB0YWdzLCBkZWZlYXRpbmcgdGhlIHB1cnBvc2Ugb2YgdGhpcyBmcmFtZXdvcmsuKVxuLy9cbi8vIEhvd2V2ZXIsIHRoaXMgYXBwcm9hY2ggbGVhZHMgdG8gY29tcGxleGl0eTpcbi8vXG4vLyAtICAgIFRoZSBgYGRhdGEtY29tcG9uZW50YGAgYXR0cmlidXRlIG9mIGVhY2ggY29tcG9uZW50IG11c3QgYmUga2VwdCBpbiBzeW5jIHdpdGggdGhlIGtleXMgb2YgdGhlIGBgbW9kdWxlX21hcGBgIGJlbG93LlxuLy8gLSAgICBUaGUgdmFsdWVzIGluIHRoZSBgYG1vZHVsZV9tYXBgYCBtdXN0IGJlIGtlcHQgaW4gc3luYyB3aXRoIHRoZSBKYXZhU2NyaXB0IGZpbGVzIHdoaWNoIGltcGxlbWVudCBlYWNoIG9mIHRoZSBjb21wb25lbnRzLlxuXG4vLyBTdGF0aWMgaW1wb3J0c1xuLy8gPT09PT09PT09PT09PT1cbi8vIFRoZXNlIGltcG9ydHMgYXJlICh3ZSBhc3N1bWUpIG5lZWRlZCBieSBhbGwgcGFnZXMuIEhvd2V2ZXIsIGl0IHdvdWxkIGJlIG11Y2ggYmV0dGVyIHRvIGxvYWQgdGhlc2UgaW4gdGhlIG1vZHVsZXMgdGhhdCBhY3R1YWxseSB1c2UgdGhlbS5cbi8vXG4vLyBUaGVzZSBhcmUgc3RhdGljIGltcG9ydHM7IGNvZGUgaW4gYGR5bmFtaWNhbGx5IGxvYWRlZCBjb21wb25lbnRzYF8gZGVhbHMgd2l0aCBkeW5hbWljIGltcG9ydHMuXG4vL1xuLy8galF1ZXJ5LXJlbGF0ZWQgaW1wb3J0cy5cbmltcG9ydCBcImpxdWVyeS11aS9qcXVlcnktdWkuanNcIjtcbmltcG9ydCBcImpxdWVyeS11aS90aGVtZXMvYmFzZS9qcXVlcnkudWkuYWxsLmNzc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeS5pZGxlLXRpbWVyLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4uanNcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy9qcXVlcnlfaTE4bi9qcXVlcnkuaTE4bi5lbWl0dGVyLmJpZGkuanNcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy9qcXVlcnlfaTE4bi9qcXVlcnkuaTE4bi5lbWl0dGVyLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4uZmFsbGJhY2tzLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4ubWVzc2FnZXN0b3JlLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4ucGFyc2VyLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4ubGFuZ3VhZ2UuanNcIjtcblxuLy8gQm9vdHN0cmFwIC0tIGNvbW1lbnQgb3V0IGZvciBSZWFjdCBpbnN0cnVjdG9yIFVJXG5pbXBvcnQgXCJib290c3RyYXAvZGlzdC9qcy9ib290c3RyYXAuanNcIjtcbi8vIGNvbW1lbnQgb3V0IGZvciBvdmVyaGF1bFxuLy9pbXBvcnQgXCJib290c3RyYXAvZGlzdC9jc3MvYm9vdHN0cmFwLmNzc1wiO1xuaW1wb3J0IFwiLi9wdHhycy1ib290c3RyYXAubGVzc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL3Byb2plY3RfdGVtcGxhdGUvX3RlbXBsYXRlcy9wbHVnaW5fbGF5b3V0cy9zcGhpbnhfYm9vdHN0cmFwL3N0YXRpYy9ib290c3RyYXAtc3BoaW54LmpzXCI7XG5cbi8vIE1pc2NcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy9ib29rZnVuY3MuanNcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy91c2VyLWhpZ2hsaWdodHMuanNcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy9wcmV0ZXh0LmpzXCI7XG5cbi8vIFRoZXNlIGJlbG9uZyBpbiBkeW5hbWljIGltcG9ydHMgZm9yIHRoZSBvYnZpb3VzIGNvbXBvbmVudDsgaG93ZXZlciwgdGhlc2UgY29tcG9uZW50cyBkb24ndCBpbmNsdWRlIGEgYGBkYXRhLWNvbXBvbmVudGBgIGF0dHJpYnV0ZS5cbmltcG9ydCBcIi4vcnVuZXN0b25lL21hdHJpeGVxL2Nzcy9tYXRyaXhlcS5jc3NcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL3dlYmdsZGVtby9jc3Mvd2ViZ2xpbnRlcmFjdGl2ZS5jc3NcIjtcblxuLy8gVGhlc2UgYXJlIG9ubHkgbmVlZGVkIGZvciB0aGUgUnVuZXN0b25lIGJvb2ssIGJ1dCBub3QgaW4gYSBsaWJyYXJ5IG1vZGUgKHN1Y2ggYXMgcHJldGV4dCkuIEkgd291bGQgcHJlZmVyIHRvIGR5bmFtaWNhbGx5IGxvYWQgdGhlbS4gSG93ZXZlciwgdGhlc2Ugc2NyaXB0cyBhcmUgc28gc21hbGwgSSBoYXZlbid0IGJvdGhlcmVkIHRvIGRvIHNvLlxuaW1wb3J0IHsgZ2V0U3dpdGNoLCBzd2l0Y2hUaGVtZSB9IGZyb20gXCIuL3J1bmVzdG9uZS9jb21tb24vanMvdGhlbWUuanNcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy9wcmVzZW50ZXJfbW9kZS5qc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2Nzcy9wcmVzZW50ZXJfbW9kZS5jc3NcIjtcbmltcG9ydCB7IHJlbmRlck9uZUNvbXBvbmVudCB9IGZyb20gXCIuL3J1bmVzdG9uZS9jb21tb24vanMvcmVuZGVyQ29tcG9uZW50LmpzXCI7XG5cbi8vIER5bmFtaWNhbGx5IGxvYWRlZCBjb21wb25lbnRzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGhpcyBwcm92aWRlcyBhIGxpc3Qgb2YgbW9kdWxlcyB0aGF0IGNvbXBvbmVudHMgY2FuIGR5bmFtaWNhbGx5IGltcG9ydC4gV2VicGFjayB3aWxsIGNyZWF0ZSBhIGxpc3Qgb2YgaW1wb3J0cyBmb3IgZWFjaCBiYXNlZCBvbiBpdHMgYW5hbHlzaXMuXG5jb25zdCBtb2R1bGVfbWFwID0ge1xuICAgIC8vIFdyYXAgZWFjaCBpbXBvcnQgaW4gYSBmdW5jdGlvbiwgc28gdGhhdCBpdCB3b24ndCBvY2N1ciB1bnRpbCB0aGUgZnVuY3Rpb24gaXMgY2FsbGVkLiBXaGlsZSBzb21ldGhpbmcgY2xlYW5lciB3b3VsZCBiZSBuaWNlLCB3ZWJwYWNrIGNhbid0IGFuYWx5emUgdGhpbmdzIGxpa2UgYGBpbXBvcnQoZXhwcmVzc2lvbilgYC5cbiAgICAvL1xuICAgIC8vIFRoZSBrZXlzIG11c3QgbWF0Y2ggdGhlIHZhbHVlIG9mIGVhY2ggY29tcG9uZW50J3MgYGBkYXRhLWNvbXBvbmVudGBgIGF0dHJpYnV0ZSAtLSB0aGUgYGBydW5lc3RvbmVfaW1wb3J0YGAgYW5kIGBgcnVuZXN0b25lX2F1dG9faW1wb3J0YGAgZnVuY3Rpb25zIGFzc3VtZSB0aGlzLlxuICAgIGFjdGl2ZWNvZGU6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2FjdGl2ZWNvZGUvanMvYWNmYWN0b3J5LmpzXCIpLFxuICAgIGJsZTogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvY2VsbGJvdGljcy9qcy9ibGUuanNcIiksXG4gICAgLy8gQWx3YXlzIGltcG9ydCB0aGUgdGltZWQgdmVyc2lvbiBvZiBhIGNvbXBvbmVudCBpZiBhdmFpbGFibGUsIHNpbmNlIHRoZSB0aW1lZCBjb21wb25lbnRzIGFsc28gZGVmaW5lIHRoZSBjb21wb25lbnQncyBmYWN0b3J5IGFuZCBpbmNsdWRlIHRoZSBjb21wb25lbnQgYXMgd2VsbC4gTm90ZSB0aGF0IGBgYWNmYWN0b3J5YGAgaW1wb3J0cyB0aGUgdGltZWQgY29tcG9uZW50cyBvZiBBY3RpdmVDb2RlLCBzbyBpdCBmb2xsb3dzIHRoaXMgcGF0dGVybi5cbiAgICBjbGlja2FibGVhcmVhOiAoKSA9PlxuICAgICAgICBpbXBvcnQoXCIuL3J1bmVzdG9uZS9jbGlja2FibGVBcmVhL2pzL3RpbWVkY2xpY2thYmxlLmpzXCIpLFxuICAgIGNvZGVsZW5zOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9jb2RlbGVucy9qcy9jb2RlbGVucy5qc1wiKSxcbiAgICBkYXRhZmlsZTogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvZGF0YWZpbGUvanMvZGF0YWZpbGUuanNcIiksXG4gICAgZHJhZ25kcm9wOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9kcmFnbmRyb3AvanMvdGltZWRkbmQuanNcIiksXG4gICAgZmlsbGludGhlYmxhbms6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2ZpdGIvanMvdGltZWRmaXRiLmpzXCIpLFxuICAgIGdyb3Vwc3ViOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9ncm91cHN1Yi9qcy9ncm91cHN1Yi5qc1wiKSxcbiAgICBraGFuZXg6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2toYW5leC9qcy9raGFuZXguanNcIiksXG4gICAgbHBfYnVpbGQ6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2xwL2pzL2xwLmpzXCIpLFxuICAgIG11bHRpcGxlY2hvaWNlOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9tY2hvaWNlL2pzL3RpbWVkbWMuanNcIiksXG4gICAgaHBhcnNvbnM6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2hwYXJzb25zL2pzL2hwYXJzb25zLmpzXCIpLFxuICAgIHBhcnNvbnM6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3BhcnNvbnMvanMvdGltZWRwYXJzb25zLmpzXCIpLFxuICAgIHBvbGw6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3BvbGwvanMvcG9sbC5qc1wiKSxcbiAgICBxdWl6bHk6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3F1aXpseS9qcy9xdWl6bHkuanNcIiksXG4gICAgcmV2ZWFsOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9yZXZlYWwvanMvcmV2ZWFsLmpzXCIpLFxuICAgIHNlbGVjdHF1ZXN0aW9uOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9zZWxlY3RxdWVzdGlvbi9qcy9zZWxlY3RvbmUuanNcIiksXG4gICAgc2hvcnRhbnN3ZXI6ICgpID0+XG4gICAgICAgIGltcG9ydChcIi4vcnVuZXN0b25lL3Nob3J0YW5zd2VyL2pzL3RpbWVkX3Nob3J0YW5zd2VyLmpzXCIpLFxuICAgIHNob3dldmFsOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9zaG93ZXZhbC9qcy9zaG93RXZhbC5qc1wiKSxcbiAgICBzaW1wbGVfc2Vuc29yOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9jZWxsYm90aWNzL2pzL3NpbXBsZV9zZW5zb3IuanNcIiksXG4gICAgc3ByZWFkc2hlZXQ6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3NwcmVhZHNoZWV0L2pzL3NwcmVhZHNoZWV0LmpzXCIpLFxuICAgIHRhYmJlZFN0dWZmOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS90YWJiZWRTdHVmZi9qcy90YWJiZWRzdHVmZi5qc1wiKSxcbiAgICB0aW1lZEFzc2Vzc21lbnQ6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3RpbWVkL2pzL3RpbWVkLmpzXCIpLFxuICAgIHdhdmVkcm9tOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS93YXZlZHJvbS9qcy93YXZlZHJvbS5qc1wiKSxcbiAgICAvLyBUT0RPOiBzaW5jZSB0aGlzIGlzbid0IGluIGEgYGBkYXRhLWNvbXBvbmVudGBgLCBuZWVkIHRvIHRyaWdnZXIgYW4gaW1wb3J0IG9mIHRoaXMgY29kZSBtYW51YWxseS5cbiAgICB3ZWJ3b3JrOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS93ZWJ3b3JrL2pzL3dlYndvcmsuanNcIiksXG4gICAgeW91dHViZTogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvdmlkZW8vanMvcnVuZXN0b25ldmlkZW8uanNcIiksXG59O1xuXG5jb25zdCBtb2R1bGVfbWFwX2NhY2hlID0ge307XG5jb25zdCBRVUVVRV9GTFVTSF9USU1FX01TID0gMTA7XG5jb25zdCBxdWV1ZSA9IFtdO1xubGV0IHF1ZXVlTGFzdEZsdXNoID0gMDtcbi8qKlxuICogUXVldWUgaW1wb3J0cyB0aGF0IGFyZSByZXF1ZXN0ZWQgd2l0aGluIGBRVUVVRV9GTFVTSF9USU1FX01TYCBvZiBlYWNoIG90aGVyLlxuICogQWxsIHN1Y2ggaW1wb3J0cyBhcmUgaW1wb3J0ZWQgYXQgb25jZSwgYW5kIHRoZW4gYSBwcm9taXNlIGlzIGZpcmVkIGFmdGVyIGFsbFxuICogdGhlIGltcG9ydHMgaW4gdGhlIHF1ZXVlIHdpbmRvdyBoYXZlIGNvbXBsZXRlZC5cbiAqL1xuZnVuY3Rpb24gcXVldWVJbXBvcnQoY29tcG9uZW50X25hbWUpIHtcbiAgICBsZXQgcmVzb2x2ZSA9IG51bGw7XG4gICAgbGV0IHJlamVjdCA9IG51bGw7XG4gICAgY29uc3QgcmV0UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyLCByZWopID0+IHtcbiAgICAgICAgcmVzb2x2ZSA9IHI7XG4gICAgICAgIHJlamVjdCA9IHJlajtcbiAgICB9KTtcbiAgICBjb25zdCBpdGVtID0geyBjb21wb25lbnRfbmFtZSwgcmVzb2x2ZSwgcmVqZWN0IH07XG4gICAgcXVldWUucHVzaChpdGVtKTtcbiAgICB3aW5kb3cuc2V0VGltZW91dChmbHVzaFF1ZXVlLCBRVUVVRV9GTFVTSF9USU1FX01TICsgMSk7XG5cbiAgICByZXR1cm4gcmV0UHJvbWlzZTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGZsdXNoUXVldWUoKSB7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChEYXRlLm5vdygpIC0gcXVldWVMYXN0Rmx1c2ggPCBRVUVVRV9GTFVTSF9USU1FX01TKSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZsdXNoUXVldWUsIFFVRVVFX0ZMVVNIX1RJTUVfTVMgKyAxKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBJZiB3ZSBtYWRlIGl0IGhlcmUsIGl0IGhhcyBiZWVuIGF0IGxlYXN0IFFVRVVFX0ZMVVNIX1RJTUVfTVMgc2luY2VcbiAgICAvLyB0aGUgbGFzdCB0aW1lIHdlIGZsdXNoZWQgdGhlIHF1ZXVlLiBUaGVyZWZvcmUsIHdlIHNob3VsZCBzdGFydCBmbHVzaGluZy5cbiAgICAvLyBXZSBjb3B5IGV2ZXJ5dGhpbmcgd2UgZmx1c2ggYW5kIGVtcHR5IHRoZSBhcnJheSBmaXJzdC5cbiAgICBxdWV1ZUxhc3RGbHVzaCA9IERhdGUubm93KCk7XG4gICAgY29uc3QgdG9GbHVzaCA9IFsuLi5xdWV1ZV07XG4gICAgcXVldWUubGVuZ3RoID0gMDtcbiAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgXCJXZWJwYWNrIGlzIHN0YXJ0aW5nIHRoZSBsb2FkaW5nIHByb2Nlc3MgZm9yIHRoZSBmb2xsb3dpbmcgUnVuZXN0b25lIG1vZHVsZXNcIixcbiAgICAgICAgdG9GbHVzaC5tYXAoKGl0ZW0pID0+IGl0ZW0uY29tcG9uZW50X25hbWUpXG4gICAgKTtcbiAgICBjb25zdCBmbHVzaGVkUHJvbWlzZSA9IHRvRmx1c2gubWFwKGFzeW5jIChpdGVtKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBtb2R1bGVfbWFwW2l0ZW0uY29tcG9uZW50X25hbWVdKCk7XG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaXRlbS5yZWplY3QoZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBmbHVzaGVkID0gYXdhaXQgUHJvbWlzZS5hbGwoZmx1c2hlZFByb21pc2UpO1xuICAgIGZsdXNoZWQuZm9yRWFjaCgoaXRlbSkgPT4gaXRlbS5yZXNvbHZlKCkpO1xufVxuXG4vLyAuLiBfZHluYW1pYyBpbXBvcnQgbWFjaGluZXJ5OlxuLy9cbi8vIER5bmFtaWMgaW1wb3J0IG1hY2hpbmVyeVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBGdWxmaWxsIGEgcHJvbWlzZSB3aGVuIHRoZSBSdW5lc3RvbmUgcHJlLWxvZ2luIGNvbXBsZXRlIGV2ZW50IG9jY3Vycy5cbmxldCBwcmVfbG9naW5fY29tcGxldGVfcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PlxuICAgICQoZG9jdW1lbnQpLm9uKFwicnVuZXN0b25lOnByZS1sb2dpbi1jb21wbGV0ZVwiLCByZXNvbHZlKVxuKTtcbmxldCBsb2FkZWRDb21wb25lbnRzO1xuLy8gUHJvdmlkZSBhIHNpbXBsZSBmdW5jdGlvbiB0byBpbXBvcnQgdGhlIEpTIGZvciBhbGwgY29tcG9uZW50cyBvbiB0aGUgcGFnZS5cbmV4cG9ydCBmdW5jdGlvbiBydW5lc3RvbmVfYXV0b19pbXBvcnQoKSB7XG4gICAgLy8gQ3JlYXRlIGEgc2V0IG9mIGBgZGF0YS1jb21wb25lbnRgYCB2YWx1ZXMsIHRvIGF2b2lkIGR1cGxpY2F0aW9uLlxuICAgIGNvbnN0IHMgPSBuZXcgU2V0KFxuICAgICAgICAvLyBBbGwgUnVuZXN0b25lIGNvbXBvbmVudHMgaGF2ZSBhIGBgZGF0YS1jb21wb25lbnRgYCBhdHRyaWJ1dGUuXG4gICAgICAgICQoXCJbZGF0YS1jb21wb25lbnRdXCIpXG4gICAgICAgICAgICAubWFwKFxuICAgICAgICAgICAgICAgIC8vIEV4dHJhY3QgdGhlIHZhbHVlIG9mIHRoZSBkYXRhLWNvbXBvbmVudCBhdHRyaWJ1dGUuXG4gICAgICAgICAgICAgICAgKGluZGV4LCBlbGVtZW50KSA9PiAkKGVsZW1lbnQpLmF0dHIoXCJkYXRhLWNvbXBvbmVudFwiKVxuICAgICAgICAgICAgICAgIC8vIFN3aXRjaCBmcm9tIGEgalF1ZXJ5IG9iamVjdCBiYWNrIHRvIGFuIGFycmF5LCBwYXNzaW5nIHRoYXQgdG8gdGhlIFNldCBjb25zdHJ1Y3Rvci5cbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5nZXQoKVxuICAgICk7XG4gICAgLy8gd2Vid29yayBxdWVzdGlvbnMgYXJlIG5vdCB3cmFwcGVkIGluIGRpdiB3aXRoIGEgZGF0YS1jb21wb25lbnQgc28gd2UgaGF2ZSB0byBjaGVjayBhIGRpZmZlcmVudCB3YXlcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53ZWJ3b3JrLWJ1dHRvblwiKSkge1xuICAgICAgICBzLmFkZChcIndlYndvcmtcIik7XG4gICAgfVxuXG4gICAgLy8gTG9hZCBKUyBmb3IgZWFjaCBvZiB0aGUgY29tcG9uZW50cyBmb3VuZC5cbiAgICBjb25zdCBhID0gWy4uLnNdLm1hcCgodmFsdWUpID0+XG4gICAgICAgIC8vIElmIHRoZXJlJ3Mgbm8gSlMgZm9yIHRoaXMgY29tcG9uZW50LCByZXR1cm4gYW4gZW1wdHkgUHJvbWlzZS5cbiAgICAgICAgKG1vZHVsZV9tYXBbdmFsdWVdIHx8ICgoKSA9PiBQcm9taXNlLnJlc29sdmUoKSkpKClcbiAgICApO1xuXG4gICAgLy8gU2VuZCB0aGUgUnVuZXN0b25lIGxvZ2luIGNvbXBsZXRlIGV2ZW50IHdoZW4gYWxsIEpTIGlzIGxvYWRlZCBhbmQgdGhlIHByZS1sb2dpbiBpcyBhbHNvIGNvbXBsZXRlLlxuICAgIFByb21pc2UuYWxsKFtwcmVfbG9naW5fY29tcGxldGVfcHJvbWlzZSwgLi4uYV0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWRvY3VtZW50LmJvZHkuZGF0YXNldC5yZWFjdEluVXNlKSB7XG4gICAgICAgICAgICAkKGRvY3VtZW50KS50cmlnZ2VyKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbnByZV9sb2dpbl9jb21wbGV0ZV9wcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiUnVuZXN0b25lIHByZS1sb2dpbiBjb21wbGV0ZVwiKTtcbn0pO1xuXG4vLyBMb2FkIGNvbXBvbmVudCBKUyB3aGVuIHRoZSBkb2N1bWVudCBpcyByZWFkeS5cbiQoZG9jdW1lbnQpLnJlYWR5KHJ1bmVzdG9uZV9hdXRvX2ltcG9ydCk7XG5cbi8vIFByb3ZpZGUgYSBmdW5jdGlvbiB0byBpbXBvcnQgb25lIHNwZWNpZmljIGBSdW5lc3RvbmVgIGNvbXBvbmVudC5cbi8vIHRoZSBpbXBvcnQgZnVuY3Rpb24gaW5zaWRlIG1vZHVsZV9tYXAgaXMgYXN5bmMgLS0gcnVuZXN0b25lX2ltcG9ydFxuLy8gc2hvdWxkIGJlIGF3YWl0ZWQgd2hlbiBuZWNlc3NhcnkgdG8gZW5zdXJlIHRoZSBpbXBvcnQgY29tcGxldGVzXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcnVuZXN0b25lX2ltcG9ydChjb21wb25lbnRfbmFtZSkge1xuICAgIGlmIChtb2R1bGVfbWFwX2NhY2hlW2NvbXBvbmVudF9uYW1lXSkge1xuICAgICAgICByZXR1cm4gbW9kdWxlX21hcF9jYWNoZVtjb21wb25lbnRfbmFtZV07XG4gICAgfVxuICAgIGNvbnN0IHByb21pc2UgPSBxdWV1ZUltcG9ydChjb21wb25lbnRfbmFtZSk7XG4gICAgbW9kdWxlX21hcF9jYWNoZVtjb21wb25lbnRfbmFtZV0gPSBwcm9taXNlO1xuICAgIHJldHVybiBwcm9taXNlO1xufVxuXG5hc3luYyBmdW5jdGlvbiBwb3B1cFNjcmF0Y2hBQygpIHtcbiAgICAvLyBsb2FkIHRoZSBhY3RpdmVjb2RlIGJ1bmRsZVxuICAgIGF3YWl0IHJ1bmVzdG9uZV9pbXBvcnQoXCJhY3RpdmVjb2RlXCIpO1xuICAgIC8vIHNjcmF0Y2hEaXYgd2lsbCBiZSBkZWZpbmVkIGlmIHdlIGhhdmUgYWxyZWFkeSBjcmVhdGVkIGEgc2NyYXRjaFxuICAgIC8vIGFjdGl2ZWNvZGUuICBJZiBpdHMgbm90IGRlZmluZWQgdGhlbiB3ZSBuZWVkIHRvIGdldCBpdCByZWFkeSB0byB0b2dnbGVcbiAgICBpZiAoIWVCb29rQ29uZmlnLnNjcmF0Y2hEaXYpIHtcbiAgICAgICAgd2luZG93LkFDRmFjdG9yeS5jcmVhdGVTY3JhdGNoQWN0aXZlY29kZSgpO1xuICAgICAgICBsZXQgZGl2aWQgPSBlQm9va0NvbmZpZy5zY3JhdGNoRGl2O1xuICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW2RpdmlkXSA9IEFDRmFjdG9yeS5jcmVhdGVBY3RpdmVDb2RlKFxuICAgICAgICAgICAgJChgIyR7ZGl2aWR9YClbMF0sXG4gICAgICAgICAgICBlQm9va0NvbmZpZy5hY0RlZmF1bHRMYW5ndWFnZVxuICAgICAgICApO1xuICAgICAgICBpZiAoZUJvb2tDb25maWcuaXNMb2dnZWRJbikge1xuICAgICAgICAgICAgd2luZG93LmNvbXBvbmVudE1hcFtkaXZpZF0uZW5hYmxlU2F2ZUxvYWQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB3aW5kb3cuQUNGYWN0b3J5LnRvZ2dsZVNjcmF0Y2hBY3RpdmVjb2RlKCk7XG59XG5cbi8vIFNldCB0aGUgZGlyZWN0b3J5IGNvbnRhaW5pbmcgdGhpcyBzY3JpcHQgYXMgdGhlIGBwYXRoIDxodHRwczovL3dlYnBhY2suanMub3JnL2d1aWRlcy9wdWJsaWMtcGF0aC8jb24tdGhlLWZseT5gXyBmb3IgYWxsIHdlYnBhY2tlZCBzY3JpcHRzLlxuY29uc3Qgc2NyaXB0X3NyYyA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuX193ZWJwYWNrX3B1YmxpY19wYXRoX18gPSBzY3JpcHRfc3JjLnN1YnN0cmluZyhcbiAgICAwLFxuICAgIHNjcmlwdF9zcmMubGFzdEluZGV4T2YoXCIvXCIpICsgMVxuKTtcblxuLy8gU1BMSUNFIEV2ZW50c1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC5kYXRhLnN1YmplY3QgPT0gXCJTUExJQ0UucmVwb3J0U2NvcmVBbmRTdGF0ZVwiKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LmRhdGEuc2NvcmUpO1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudC5kYXRhLnN0YXRlKTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LmRhdGEuc3ViamVjdCA9PSBcIlNQTElDRS5zZW5kRXZlbnRcIikge1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudC5kYXRhLmxvY2F0aW9uKTtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQuZGF0YS5uYW1lKTtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQuZGF0YS5kYXRhKTtcbiAgICB9XG59KTtcblxuLy8gTWFudWFsIGV4cG9ydHNcbi8vID09PT09PT09PT09PT09XG4vLyBXZWJwYWNrJ3MgYGBvdXRwdXQubGlicmFyeWBgIHNldHRpbmcgZG9lc24ndCBzZWVtIHRvIHdvcmsgd2l0aCB0aGUgc3BsaXQgY2h1bmtzIHBsdWdpbjsgZG8gYWxsIGV4cG9ydHMgbWFudWFsbHkgdGhyb3VnaCB0aGUgYGB3aW5kb3dgYCBvYmplY3QgaW5zdGVhZC5cblxuY29uc3QgcmMgPSB7fTtcbnJjLnJ1bmVzdG9uZV9pbXBvcnQgPSBydW5lc3RvbmVfaW1wb3J0O1xucmMucnVuZXN0b25lX2F1dG9faW1wb3J0ID0gcnVuZXN0b25lX2F1dG9faW1wb3J0O1xucmMuZ2V0U3dpdGNoID0gZ2V0U3dpdGNoO1xucmMuc3dpdGNoVGhlbWUgPSBzd2l0Y2hUaGVtZTtcbnJjLnBvcHVwU2NyYXRjaEFDID0gcG9wdXBTY3JhdGNoQUM7XG5yYy5yZW5kZXJPbmVDb21wb25lbnQgPSByZW5kZXJPbmVDb21wb25lbnQ7XG53aW5kb3cuY29tcG9uZW50TWFwID0ge307XG53aW5kb3cucnVuZXN0b25lQ29tcG9uZW50cyA9IHJjO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBqUXVlcnk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9