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
        if (this.percent) {
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
            post_return = await response.json();
        } catch (e) {
            let detail = "none";
            if (post_return && post_return.detail) {
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
    timedAssessment: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_handsontable_es_index_js-node_modules_handsontable_dist_handsontable_ful-dcc440"), __webpack_require__.e("vendors-node_modules_codemirror_mode_clike_clike_js-node_modules_codemirror_mode_javascript_j-f062af"), __webpack_require__.e("vendors-node_modules_codemirror_addon_edit_matchbrackets_js-node_modules_codemirror_addon_hin-ab90ac"), __webpack_require__.e("runestone_codelens_js_pytutor-embed_bundle_js"), __webpack_require__.e("node_modules_moment_locale_sync_recursive_-runestone_activecode_js_acfactory_js-node_modules_-ef73b3"), __webpack_require__.e("runestone_parsons_js_timedparsons_js"), __webpack_require__.e("runestone_dragndrop_js_timeddnd_js"), __webpack_require__.e("runestone_fitb_js_timedfitb_js"), __webpack_require__.e("runestone_mchoice_js_timedmc_js"), __webpack_require__.e("runestone_selectquestion_js_selectone_js"), __webpack_require__.e("runestone_clickableArea_js_timedclickable_js"), __webpack_require__.e("runestone_shortanswer_js_timed_shortanswer_js"), __webpack_require__.e("runestone_timed_js_timed_js-runestone_clickableArea_css_clickable_css-runestone_dragndrop_css-8bfd54")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/timed/js/timed.js */ 58707)),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDQUFDOzs7Ozs7Ozs7OztBQ3ZVRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBZ0M7QUFDaEM7OztBQUdBO0FBQ0E7QUFDQSxFQUFFOzs7QUFHRjtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBOztBQUVBO0FBQ0EsZ0NBQWdDOztBQUVoQztBQUNBLGdDQUFnQzs7QUFFaEM7Ozs7QUFJQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0QkFBNEI7O0FBRTVCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4RUFBOEU7QUFDOUU7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOzs7QUFHRjs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7O0FDdlNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDLHFEQUFxRDtBQUNyRCx1REFBdUQ7O0FBRXZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7O0FBRXhDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBLFdBQVcsbUJBQW1CO0FBQzlCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsdUNBQXVDO0FBQ3ZDLHdDQUF3Qzs7QUFFeEM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7QUNyVEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0QsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtB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bEUsb0JBQW9CLDZTQUE2QztBQUNqRTtBQUNBLG1CQUFtQiw0S0FBMkM7QUFDOUQsbUJBQW1CLHNMQUFnRDtBQUNuRTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsTUFBTTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBdUI7QUFDdkI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyRkFBMkY7QUFDM0Y7QUFDQTtBQUNBO0FBQ0EsZUFBZSxxRUFBUztBQUN4QixpQkFBaUIsdUVBQVc7QUFDNUI7QUFDQTs7Ozs7Ozs7Ozs7O0FDL0tBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vY3NzL3ByZXNlbnRlcl9tb2RlLmNzcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9jc3MvcnVuZXN0b25lLWN1c3RvbS1zcGhpbngtYm9vdHN0cmFwLmNzcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9jc3MvdXNlci1oaWdobGlnaHRzLmNzcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL21hdHJpeGVxL2Nzcy9tYXRyaXhlcS5jc3MiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS93ZWJnbGRlbW8vY3NzL3dlYmdsaW50ZXJhY3RpdmUuY3NzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL2Jvb2tmdW5jcy5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9qcXVlcnkuaWRsZS10aW1lci5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9qcXVlcnlfaTE4bi9qcXVlcnkuaTE4bi5lbWl0dGVyLmJpZGkuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4uZW1pdHRlci5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9qcXVlcnlfaTE4bi9qcXVlcnkuaTE4bi5mYWxsYmFja3MuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4uanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4ubGFuZ3VhZ2UuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4ubWVzc2FnZXN0b3JlLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeV9pMThuL2pxdWVyeS5pMThuLnBhcnNlci5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9wcmVzZW50ZXJfbW9kZS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9wcmV0ZXh0LmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvdGhlbWUuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvdXNlci1oaWdobGlnaHRzLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL3Byb2plY3RfdGVtcGxhdGUvX3RlbXBsYXRlcy9wbHVnaW5fbGF5b3V0cy9zcGhpbnhfYm9vdHN0cmFwL3N0YXRpYy9ib290c3RyYXAtc3BoaW54LmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi93ZWJwYWNrLmluZGV4LmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvZXh0ZXJuYWwgdmFyIFwialF1ZXJ5XCIiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLyoqXG4gKlxuICogVXNlcjogYm1pbGxlclxuICogT3JpZ2luYWw6IDIwMTEtMDQtMjBcbiAqIERhdGU6IDIwMTktMDYtMTRcbiAqIFRpbWU6IDI6MDEgUE1cbiAqIFRoaXMgY2hhbmdlIG1hcmtzIHRoZSBiZWdpbm5pbmcgb2YgdmVyc2lvbiA0LjAgb2YgdGhlIHJ1bmVzdG9uZSBjb21wb25lbnRzXG4gKiBMb2dpbi9sb2dvdXQgaXMgbm8gbG9uZ2VyIGhhbmRsZWQgdGhyb3VnaCBqYXZhc2NyaXB0IGJ1dCByYXRoZXIgc2VydmVyIHNpZGUuXG4gKiBNYW55IG9mIHRoZSBjb21wb25lbnRzIGRlcGVuZCBvbiB0aGUgcnVuZXN0b25lOmxvZ2luIGV2ZW50IHNvIHdlIHdpbGwga2VlcCB0aGF0XG4gKiBmb3Igbm93IHRvIGtlZXAgdGhlIGNodXJuIGZhaXJseSBtaW5pbWFsLlxuICovXG5cbi8qXG5cbiBDb3B5cmlnaHQgKEMpIDIwMTEgIEJyYWQgTWlsbGVyICBib25lbGFrZUBnbWFpbC5jb21cblxuIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuICovXG5cbi8vXG4vLyBQYWdlIGRlY29yYXRpb24gZnVuY3Rpb25zXG4vL1xuXG5mdW5jdGlvbiBhZGRSZWFkaW5nTGlzdCgpIHtcbiAgICBpZiAoZUJvb2tDb25maWcucmVhZGluZ3MpIHtcbiAgICAgICAgdmFyIGwsIG54dCwgcGF0aF9wYXJ0cywgbnh0X2xpbms7XG4gICAgICAgIGxldCBjdXJfcGF0aF9wYXJ0cyA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdChcIi9cIik7XG4gICAgICAgIGxldCBuYW1lID1cbiAgICAgICAgICAgIGN1cl9wYXRoX3BhcnRzW2N1cl9wYXRoX3BhcnRzLmxlbmd0aCAtIDJdICtcbiAgICAgICAgICAgIFwiL1wiICtcbiAgICAgICAgICAgIGN1cl9wYXRoX3BhcnRzW2N1cl9wYXRoX3BhcnRzLmxlbmd0aCAtIDFdO1xuICAgICAgICBsZXQgcG9zaXRpb24gPSBlQm9va0NvbmZpZy5yZWFkaW5ncy5pbmRleE9mKG5hbWUpO1xuICAgICAgICBsZXQgbnVtX3JlYWRpbmdzID0gZUJvb2tDb25maWcucmVhZGluZ3MubGVuZ3RoO1xuICAgICAgICBpZiAocG9zaXRpb24gPT0gZUJvb2tDb25maWcucmVhZGluZ3MubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgLy8gbm8gbW9yZSByZWFkaW5nc1xuICAgICAgICAgICAgbCA9ICQoXCI8ZGl2IC8+XCIsIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBgRmluaXNoZWQgcmVhZGluZyBhc3NpZ25tZW50LiBQYWdlICR7bnVtX3JlYWRpbmdzfSBvZiAke251bV9yZWFkaW5nc30uYCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHBvc2l0aW9uID49IDApIHtcbiAgICAgICAgICAgIC8vIGdldCBuZXh0IG5hbWVcbiAgICAgICAgICAgIG54dCA9IGVCb29rQ29uZmlnLnJlYWRpbmdzW3Bvc2l0aW9uICsgMV07XG4gICAgICAgICAgICBwYXRoX3BhcnRzID0gY3VyX3BhdGhfcGFydHMuc2xpY2UoMCwgY3VyX3BhdGhfcGFydHMubGVuZ3RoIC0gMik7XG4gICAgICAgICAgICBwYXRoX3BhcnRzLnB1c2gobnh0KTtcbiAgICAgICAgICAgIG54dF9saW5rID0gcGF0aF9wYXJ0cy5qb2luKFwiL1wiKTtcbiAgICAgICAgICAgIGwgPSAkKFwiPGEgLz5cIiwge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwibGlua1wiLFxuICAgICAgICAgICAgICAgIGNsYXNzOiBcImJ0biBidG4tbGcgJyArICdidXR0b25Db25maXJtQ29tcGxldGlvbidcIixcbiAgICAgICAgICAgICAgICBocmVmOiBueHRfbGluayxcbiAgICAgICAgICAgICAgICB0ZXh0OiBgQ29udGludWUgdG8gcGFnZSAke1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiArIDJcbiAgICAgICAgICAgICAgICB9IG9mICR7bnVtX3JlYWRpbmdzfSBpbiB0aGUgcmVhZGluZyBhc3NpZ25tZW50LmAsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGwgPSAkKFwiPGRpdiAvPlwiLCB7XG4gICAgICAgICAgICAgICAgdGV4dDogXCJUaGlzIHBhZ2UgaXMgbm90IHBhcnQgb2YgdGhlIGxhc3QgcmVhZGluZyBhc3NpZ25tZW50IHlvdSB2aXNpdGVkLlwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgJChcIiNtYWluLWNvbnRlbnRcIikuYXBwZW5kKGwpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gdGltZWRSZWZyZXNoKCkge1xuICAgIHZhciB0aW1lb3V0UGVyaW9kID0gOTAwMDAwOyAvLyA3NSBtaW51dGVzXG4gICAgJChkb2N1bWVudCkub24oXCJpZGxlLmlkbGVUaW1lclwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIEFmdGVyIHRpbWVvdXQgcGVyaW9kIHNlbmQgdGhlIHVzZXIgYmFjayB0byB0aGUgaW5kZXguICBUaGlzIHdpbGwgZm9yY2UgYSBsb2dpblxuICAgICAgICAvLyBpZiBuZWVkZWQgd2hlbiB0aGV5IHdhbnQgdG8gZ28gdG8gYSBwYXJ0aWN1bGFyIHBhZ2UuICBUaGlzIG1heSBub3QgYmUgcGVyZmVjdFxuICAgICAgICAvLyBidXQgaXRzIGFuIGVhc3kgd2F5IHRvIG1ha2Ugc3VyZSBsYXB0b3AgdXNlcnMgYXJlIHByb3Blcmx5IGxvZ2dlZCBpbiB3aGVuIHRoZXlcbiAgICAgICAgLy8gdGFrZSBxdWl6emVzIGFuZCBzYXZlIHN0dWZmLlxuICAgICAgICBpZiAobG9jYXRpb24uaHJlZi5pbmRleE9mKFwiaW5kZXguaHRtbFwiKSA8IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSWRsZSB0aW1lciAtIFwiICsgbG9jYXRpb24ucGF0aG5hbWUpO1xuICAgICAgICAgICAgbG9jYXRpb24uaHJlZiA9XG4gICAgICAgICAgICAgICAgZUJvb2tDb25maWcuYXBwICtcbiAgICAgICAgICAgICAgICBcIi9kZWZhdWx0L3VzZXIvbG9naW4/X25leHQ9XCIgK1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uLnBhdGhuYW1lICtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5zZWFyY2g7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkLmlkbGVUaW1lcih0aW1lb3V0UGVyaW9kKTtcbn1cblxuY2xhc3MgUGFnZVByb2dyZXNzQmFyIHtcbiAgICBjb25zdHJ1Y3RvcihhY3REaWN0KSB7XG4gICAgICAgIHRoaXMucG9zc2libGUgPSAwO1xuICAgICAgICB0aGlzLnRvdGFsID0gMTtcbiAgICAgICAgaWYgKGFjdERpY3QgJiYgT2JqZWN0LmtleXMoYWN0RGljdCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5hY3Rpdml0aWVzID0gYWN0RGljdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBhY3Rpdml0aWVzID0geyBwYWdlOiAwIH07XG4gICAgICAgICAgICAkKFwiLnJ1bmVzdG9uZVwiKS5lYWNoKGZ1bmN0aW9uIChpZHgsIGUpIHtcbiAgICAgICAgICAgICAgICBhY3Rpdml0aWVzW2UuZmlyc3RFbGVtZW50Q2hpbGQuaWRdID0gMDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5hY3Rpdml0aWVzID0gYWN0aXZpdGllcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVByb2dyZXNzKCk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5tYXRjaChcbiAgICAgICAgICAgICAgICAvLiooaW5kZXguaHRtbHx0b2N0cmVlLmh0bWx8RXhlcmNpc2VzLmh0bWx8R2xvc3NhcnkuaHRtbHxzZWFyY2guaHRtbCkkL2lcbiAgICAgICAgICAgIClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICAkKFwiI3NjcHJvZ3Jlc3Njb250YWluZXJcIikuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVuZGVyUHJvZ3Jlc3MoKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVQcm9ncmVzcygpIHtcbiAgICAgICAgZm9yIChsZXQgayBpbiB0aGlzLmFjdGl2aXRpZXMpIHtcbiAgICAgICAgICAgIGlmIChrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBvc3NpYmxlKys7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYWN0aXZpdGllc1trXSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlclByb2dyZXNzKCkge1xuICAgICAgICBsZXQgdmFsdWUgPSAwO1xuICAgICAgICAkKFwiI3NjcHJvZ3Jlc3N0b3RhbFwiKS50ZXh0KHRoaXMudG90YWwpO1xuICAgICAgICAkKFwiI3NjcHJvZ3Jlc3Nwb3NzXCIpLnRleHQodGhpcy5wb3NzaWJsZSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICgxMDAgKiB0aGlzLnRvdGFsKSAvIHRoaXMucG9zc2libGU7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhbHVlID0gMDtcbiAgICAgICAgfVxuICAgICAgICAkKFwiI3N1YmNoYXB0ZXJwcm9ncmVzc1wiKS5wcm9ncmVzc2Jhcih7XG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIWVCb29rQ29uZmlnLmlzTG9nZ2VkSW4pIHtcbiAgICAgICAgICAgICQoXCIjc3ViY2hhcHRlcnByb2dyZXNzPmRpdlwiKS5hZGRDbGFzcyhcImxvZ2dlZG91dFwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZVByb2dyZXNzKGRpdl9pZCkge1xuICAgICAgICB0aGlzLmFjdGl2aXRpZXNbZGl2X2lkXSsrO1xuICAgICAgICAvLyBPbmx5IHVwZGF0ZSB0aGUgcHJvZ3Jlc3MgYmFyIG9uIHRoZSBmaXJzdCBpbnRlcmFjdGlvbiB3aXRoIGFuIG9iamVjdC5cbiAgICAgICAgaWYgKHRoaXMuYWN0aXZpdGllc1tkaXZfaWRdID09PSAxKSB7XG4gICAgICAgICAgICB0aGlzLnRvdGFsKys7XG4gICAgICAgICAgICBsZXQgdmFsID0gKDEwMCAqIHRoaXMudG90YWwpIC8gdGhpcy5wb3NzaWJsZTtcbiAgICAgICAgICAgICQoXCIjc2Nwcm9ncmVzc3RvdGFsXCIpLnRleHQodGhpcy50b3RhbCk7XG4gICAgICAgICAgICAkKFwiI3NjcHJvZ3Jlc3Nwb3NzXCIpLnRleHQodGhpcy5wb3NzaWJsZSk7XG4gICAgICAgICAgICAkKFwiI3N1YmNoYXB0ZXJwcm9ncmVzc1wiKS5wcm9ncmVzc2JhcihcIm9wdGlvblwiLCBcInZhbHVlXCIsIHZhbCk7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdmFsID09IDEwMC4wICYmXG4gICAgICAgICAgICAgICAgJChcIiNjb21wbGV0aW9uQnV0dG9uXCIpLnRleHQoKS50b0xvd2VyQ2FzZSgpID09PVxuICAgICAgICAgICAgICAgICAgICBcIm1hcmsgYXMgY29tcGxldGVkXCJcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICQoXCIjY29tcGxldGlvbkJ1dHRvblwiKS5jbGljaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgdmFyIHBhZ2VQcm9ncmVzc1RyYWNrZXIgPSB7fTtcblxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlUGFnZVNldHVwKCkge1xuICAgIHZhciBtZXNzO1xuICAgIGlmIChlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHtcbiAgICAgICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiLFxuICAgICAgICAgICAgQWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBkYXRhID0geyB0aW1lem9uZW9mZnNldDogbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjAgfTtcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdChcbiAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9sb2dnZXIvc2V0X3R6X29mZnNldGAsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG4gICAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRmFpbGVkIHRvIHNldCB0aW1lem9uZSEgJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3Igc2V0dGluZyB0aW1lem9uZSAke2V9YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc29sZS5sb2coYFRoaXMgcGFnZSBzZXJ2ZWQgYnkgJHtlQm9va0NvbmZpZy5zZXJ2ZWRfYnl9YCk7XG4gICAgaWYgKGVCb29rQ29uZmlnLmlzTG9nZ2VkSW4pIHtcbiAgICAgICAgbWVzcyA9IGB1c2VybmFtZTogJHtlQm9va0NvbmZpZy51c2VybmFtZX1gO1xuICAgICAgICBpZiAoIWVCb29rQ29uZmlnLmlzSW5zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgJChcIiNpcF9kcm9wZG93bl9saW5rXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgJChcIiNpbnN0X3BlZXJfbGlua1wiKS5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgICAkKGRvY3VtZW50KS50cmlnZ2VyKFwicnVuZXN0b25lOmxvZ2luXCIpO1xuICAgICAgICBhZGRSZWFkaW5nTGlzdCgpO1xuICAgICAgICAvLyBBdm9pZCB0aGUgdGltZWRSZWZyZXNoIG9uIHRoZSBncmFkaW5nIHBhZ2UuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKFwiL2FkbWluL2dyYWRpbmdcIikgPT0gLTEgJiZcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKFwiL3BlZXIvXCIpID09IC0xXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGltZWRSZWZyZXNoKCk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBtZXNzID0gXCJOb3QgbG9nZ2VkIGluXCI7XG4gICAgICAgICQoZG9jdW1lbnQpLnRyaWdnZXIoXCJydW5lc3RvbmU6bG9nb3V0XCIpO1xuICAgICAgICBsZXQgYncgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJyb3dzaW5nX3dhcm5pbmdcIik7XG4gICAgICAgIGlmIChidykge1xuICAgICAgICAgICAgYncuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICBcIjxwIGNsYXNzPSduYXZiYXJfbWVzc2FnZSc+U2F2aW5nIGFuZCBMb2dnaW5nIGFyZSBEaXNhYmxlZDwvcD5cIjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYXcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFkX3dhcm5pbmdcIik7XG4gICAgICAgIGlmIChhdykge1xuICAgICAgICAgICAgYXcuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICBcIjxwIGNsYXNzPSduYXZiYXJfbWVzc2FnZSc+8J+aqyBMb2ctaW4gdG8gUmVtb3ZlIDxhIGhyZWY9Jy9ydW5lc3RvbmUvZGVmYXVsdC9hZHMnPkFkcyE8L2E+IPCfmqsgJm5ic3A7PC9wPlwiO1xuICAgICAgICB9XG4gICAgfVxuICAgICQoXCIubG9nZ2VkaW51c2VyXCIpLmh0bWwobWVzcyk7XG5cbiAgICBwYWdlUHJvZ3Jlc3NUcmFja2VyID0gbmV3IFBhZ2VQcm9ncmVzc0JhcihlQm9va0NvbmZpZy5hY3Rpdml0aWVzKTtcbiAgICBub3RpZnlSdW5lc3RvbmVDb21wb25lbnRzKCk7XG59XG5cbmZ1bmN0aW9uIHNldHVwTmF2YmFyTG9nZ2VkSW4oKSB7XG4gICAgJChcIiNwcm9maWxlbGlua1wiKS5zaG93KCk7XG4gICAgJChcIiNwYXNzd29yZGxpbmtcIikuc2hvdygpO1xuICAgICQoXCIjcmVnaXN0ZXJsaW5rXCIpLmhpZGUoKTtcbiAgICAkKFwibGkubG9naW5vdXRcIikuaHRtbChcbiAgICAgICAgJzxhIGhyZWY9XCInICsgZUJvb2tDb25maWcuYXBwICsgJy9kZWZhdWx0L3VzZXIvbG9nb3V0XCI+TG9nIE91dDwvYT4nXG4gICAgKTtcbn1cbiQoZG9jdW1lbnQpLm9uKFwicnVuZXN0b25lOmxvZ2luXCIsIHNldHVwTmF2YmFyTG9nZ2VkSW4pO1xuXG5mdW5jdGlvbiBzZXR1cE5hdmJhckxvZ2dlZE91dCgpIHtcbiAgICBpZiAoZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJzZXR1cCBuYXZiYXIgZm9yIGxvZ2dlZCBvdXRcIik7XG4gICAgICAgICQoXCIjcmVnaXN0ZXJsaW5rXCIpLnNob3coKTtcbiAgICAgICAgJChcIiNwcm9maWxlbGlua1wiKS5oaWRlKCk7XG4gICAgICAgICQoXCIjcGFzc3dvcmRsaW5rXCIpLmhpZGUoKTtcbiAgICAgICAgJChcIiNpcF9kcm9wZG93bl9saW5rXCIpLmhpZGUoKTtcbiAgICAgICAgJChcIiNpbnN0X3BlZXJfbGlua1wiKS5oaWRlKCk7XG4gICAgICAgICQoXCJsaS5sb2dpbm91dFwiKS5odG1sKFxuICAgICAgICAgICAgJzxhIGhyZWY9XCInICsgZUJvb2tDb25maWcuYXBwICsgJy9kZWZhdWx0L3VzZXIvbG9naW5cIj5Mb2dpbjwvYT4nXG4gICAgICAgICk7XG4gICAgICAgICQoXCIuZm9vdGVyXCIpLmh0bWwoXCJ1c2VyIG5vdCBsb2dnZWQgaW5cIik7XG4gICAgfVxufVxuJChkb2N1bWVudCkub24oXCJydW5lc3RvbmU6bG9nb3V0XCIsIHNldHVwTmF2YmFyTG9nZ2VkT3V0KTtcblxuZnVuY3Rpb24gbm90aWZ5UnVuZXN0b25lQ29tcG9uZW50cygpIHtcbiAgICAvLyBSdW5lc3RvbmUgY29tcG9uZW50cyB3YWl0IHVudGlsIGxvZ2luIHByb2Nlc3MgaXMgb3ZlciB0byBsb2FkIGNvbXBvbmVudHMgYmVjYXVzZSBvZiBzdG9yYWdlIGlzc3Vlcy4gVGhpcyB0cmlnZ2VycyB0aGUgYGR5bmFtaWMgaW1wb3J0IG1hY2hpbmVyeWAsIHdoaWNoIHRoZW4gc2VuZHMgdGhlIGxvZ2luIGNvbXBsZXRlIHNpZ25hbCB3aGVuIHRoaXMgYW5kIGFsbCBkeW5hbWljIGltcG9ydHMgYXJlIGZpbmlzaGVkLlxuICAgICQoZG9jdW1lbnQpLnRyaWdnZXIoXCJydW5lc3RvbmU6cHJlLWxvZ2luLWNvbXBsZXRlXCIpO1xufVxuXG5mdW5jdGlvbiBwbGFjZUFkQ29weSgpIHtcbiAgICBpZiAodHlwZW9mIHNob3dBZCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBzaG93QWQpIHtcbiAgICAgICAgbGV0IGFkTnVtID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMikgKyAxO1xuICAgICAgICBsZXQgYWRCbG9jayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBhZGNvcHlfJHthZE51bX1gKTtcbiAgICAgICAgbGV0IHJzRWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnJ1bmVzdG9uZVwiKTtcbiAgICAgICAgaWYgKHJzRWxlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcnNFbGVtZW50cy5sZW5ndGgpO1xuICAgICAgICAgICAgcnNFbGVtZW50c1tyYW5kb21JbmRleF0uYWZ0ZXIoYWRCbG9jaylcbiAgICAgICAgICAgIGFkQmxvY2suc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gaW5pdGlhbGl6ZSBzdHVmZlxuJChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGVCb29rQ29uZmlnKSB7XG4gICAgICAgIGhhbmRsZVBhZ2VTZXR1cCgpO1xuICAgICAgICBwbGFjZUFkQ29weSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgZUJvb2tDb25maWcgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgIFwiZUJvb2tDb25maWcgaXMgbm90IGRlZmluZWQuICBUaGlzIHBhZ2UgbXVzdCBub3QgYmUgc2V0IHVwIGZvciBSdW5lc3RvbmVcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG4vLyBtaXNjIHN0dWZmXG4vLyB0b2RvOiAgVGhpcyBjb3VsZCBiZSBmdXJ0aGVyIGRpc3RyaWJ1dGVkIGJ1dCBtYWtpbmcgYSB2aWRlby5qcyBmaWxlIGp1c3QgZm9yIG9uZSBmdW5jdGlvbiBzZWVtcyBkdW1iLlxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAvLyBhZGQgdGhlIHZpZGVvIHBsYXkgYnV0dG9uIG92ZXJsYXkgaW1hZ2VcbiAgICAkKFwiLnZpZGVvLXBsYXktb3ZlcmxheVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5jc3MoXG4gICAgICAgICAgICBcImJhY2tncm91bmQtaW1hZ2VcIixcbiAgICAgICAgICAgIFwidXJsKCd7e3BhdGh0bygnX3N0YXRpYy9wbGF5X292ZXJsYXlfaWNvbi5wbmcnLCAxKX19JylcIlxuICAgICAgICApO1xuICAgIH0pO1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBpcyBuZWVkZWQgdG8gYWxsb3cgdGhlIGRyb3Bkb3duIHNlYXJjaCBiYXIgdG8gd29yaztcbiAgICAvLyBUaGUgZGVmYXVsdCBiZWhhdmlvdXIgaXMgdGhhdCB0aGUgZHJvcGRvd24gbWVudSBjbG9zZXMgd2hlbiBzb21ldGhpbmcgaW5cbiAgICAvLyBpdCAobGlrZSB0aGUgc2VhcmNoIGJhcikgaXMgY2xpY2tlZFxuICAgICQoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBGaXggaW5wdXQgZWxlbWVudCBjbGljayBwcm9ibGVtXG4gICAgICAgICQoXCIuZHJvcGRvd24gaW5wdXQsIC5kcm9wZG93biBsYWJlbFwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyByZS13cml0ZSBzb21lIHVybHNcbiAgICAvLyBUaGlzIGlzIHRyaWNrZXIgdGhhbiBpdCBsb29rcyBhbmQgeW91IGhhdmUgdG8gb2JleSB0aGUgcnVsZXMgZm9yICMgYW5jaG9yc1xuICAgIC8vIFRoZSAjYW5jaG9ycyBtdXN0IGNvbWUgYWZ0ZXIgdGhlIHF1ZXJ5IHN0cmluZyBhcyB0aGUgc2VydmVyIGJhc2ljYWxseSBpZ25vcmVzIGFueSBwYXJ0XG4gICAgLy8gb2YgYSB1cmwgdGhhdCBjb21lcyBhZnRlciAjIC0gbGlrZSBhIGNvbW1lbnQuLi5cbiAgICBpZiAobG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIm1vZGU9YnJvd3NpbmdcIikpIHtcbiAgICAgICAgbGV0IHF1ZXJ5U3RyaW5nID0gXCI/bW9kZT1icm93c2luZ1wiO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiYVwiKS5mb3JFYWNoKChsaW5rKSA9PiB7XG4gICAgICAgICAgICBsZXQgYW5jaG9yVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICBpZiAobGluay5ocmVmLmluY2x1ZGVzKFwiYm9va3MvcHVibGlzaGVkXCIpICYmICEgbGluay5ocmVmLmluY2x1ZGVzKFwiP21vZGU9YnJvd3NpbmdcIikpIHtcbiAgICAgICAgICAgICAgICBpZiAobGluay5ocmVmLmluY2x1ZGVzKFwiI1wiKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYVBvaW50ID0gbGluay5ocmVmLmluZGV4T2YoXCIjXCIpO1xuICAgICAgICAgICAgICAgICAgICBhbmNob3JUZXh0ID0gbGluay5ocmVmLnN1YnN0cmluZyhhUG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICBsaW5rLmhyZWYgPSBsaW5rLmhyZWYuc3Vic3RyaW5nKDAsYVBvaW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGluay5ocmVmID0gbGluay5ocmVmLmluY2x1ZGVzKFwiP1wiKVxuICAgICAgICAgICAgICAgICAgICA/IGxpbmsuaHJlZiArIHF1ZXJ5U3RyaW5nLnJlcGxhY2UoXCI/XCIsIFwiJlwiKSArIGFuY2hvclRleHRcbiAgICAgICAgICAgICAgICAgICAgOiBsaW5rLmhyZWYgKyBxdWVyeVN0cmluZyArIGFuY2hvclRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuIiwiLyohXG4gKiBqUXVlcnkgaWRsZVRpbWVyIHBsdWdpblxuICogdmVyc2lvbiAwLjkuMTAwNTExXG4gKiBieSBQYXVsIElyaXNoLlxuICogICBodHRwOi8vZ2l0aHViLmNvbS9wYXVsaXJpc2gveXVpLW1pc2MvdHJlZS9cbiAqIE1JVCBsaWNlbnNlXG5cbiAqIGFkYXB0ZWQgZnJvbSBZVUkgaWRsZSB0aW1lciBieSBuemFrYXM6XG4gKiAgIGh0dHA6Ly9naXRodWIuY29tL256YWthcy95dWktbWlzYy9cbiovXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDA5IE5pY2hvbGFzIEMuIFpha2FzXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4vKiB1cGRhdGVkIHRvIGZpeCBDaHJvbWUgc2V0VGltZW91dCBpc3N1ZSBieSBaYWlkIFphd2FpZGVoICovXG5cbiAvLyBBUEkgYXZhaWxhYmxlIGluIDw9IHYwLjhcbiAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gLy8gaWRsZVRpbWVyKCkgdGFrZXMgYW4gb3B0aW9uYWwgYXJndW1lbnQgdGhhdCBkZWZpbmVzIHRoZSBpZGxlIHRpbWVvdXRcbiAvLyB0aW1lb3V0IGlzIGluIG1pbGxpc2Vjb25kczsgZGVmYXVsdHMgdG8gMzAwMDBcbiAkLmlkbGVUaW1lcigxMDAwMCk7XG5cblxuICQoZG9jdW1lbnQpLmJpbmQoXCJpZGxlLmlkbGVUaW1lclwiLCBmdW5jdGlvbigpe1xuICAgIC8vIGZ1bmN0aW9uIHlvdSB3YW50IHRvIGZpcmUgd2hlbiB0aGUgdXNlciBnb2VzIGlkbGVcbiB9KTtcblxuXG4gJChkb2N1bWVudCkuYmluZChcImFjdGl2ZS5pZGxlVGltZXJcIiwgZnVuY3Rpb24oKXtcbiAgLy8gZnVuY3Rpb24geW91IHdhbnQgdG8gZmlyZSB3aGVuIHRoZSB1c2VyIGJlY29tZXMgYWN0aXZlIGFnYWluXG4gfSk7XG5cbiAvLyBwYXNzIHRoZSBzdHJpbmcgJ2Rlc3Ryb3knIHRvIHN0b3AgdGhlIHRpbWVyXG4gJC5pZGxlVGltZXIoJ2Rlc3Ryb3knKTtcblxuIC8vIHlvdSBjYW4gcXVlcnkgaWYgdGhlIHVzZXIgaXMgaWRsZSBvciBub3Qgd2l0aCBkYXRhKClcbiAkLmRhdGEoZG9jdW1lbnQsJ2lkbGVUaW1lcicpOyAgLy8gJ2lkbGUnICBvciAnYWN0aXZlJ1xuXG4gLy8geW91IGNhbiBnZXQgdGltZSBlbGFwc2VkIHNpbmNlIHVzZXIgd2hlbiBpZGxlL2FjdGl2ZVxuICQuaWRsZVRpbWVyKCdnZXRFbGFwc2VkVGltZScpOyAvLyB0aW1lIHNpbmNlIHN0YXRlIGNoYW5nZSBpbiBtc1xuXG4gKioqKioqKiovXG5cblxuXG4gLy8gQVBJIGF2YWlsYWJsZSBpbiA+PSB2MC45XG4gLyoqKioqKioqKioqKioqKioqKioqKioqKipcblxuIC8vIGJpbmQgdG8gc3BlY2lmaWMgZWxlbWVudHMsIGFsbG93cyBmb3IgbXVsdGlwbGUgdGltZXIgaW5zdGFuY2VzXG4gJChlbGVtKS5pZGxlVGltZXIodGltZW91dHwnZGVzdHJveSd8J2dldEVsYXBzZWRUaW1lJyk7XG4gJC5kYXRhKGVsZW0sJ2lkbGVUaW1lcicpOyAgLy8gJ2lkbGUnICBvciAnYWN0aXZlJ1xuXG4gLy8gaWYgeW91J3JlIHVzaW5nIHRoZSBvbGQgJC5pZGxlVGltZXIgYXBpLCB5b3Ugc2hvdWxkIG5vdCBkbyAkKGRvY3VtZW50KS5pZGxlVGltZXIoLi4uKVxuXG4gLy8gZWxlbWVudCBib3VuZCB0aW1lcnMgd2lsbCBvbmx5IHdhdGNoIGZvciBldmVudHMgaW5zaWRlIG9mIHRoZW0uXG4gLy8geW91IG1heSBqdXN0IHdhbnQgcGFnZS1sZXZlbCBhY3Rpdml0eSwgaW4gd2hpY2ggY2FzZSB5b3UgbWF5IHNldCB1cFxuIC8vICAgeW91ciB0aW1lcnMgb24gZG9jdW1lbnQsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgYW5kIGRvY3VtZW50LmJvZHlcblxuIC8vIFlvdSBjYW4gb3B0aW9uYWxseSBwcm92aWRlIGEgc2Vjb25kIGFyZ3VtZW50IHRvIG92ZXJyaWRlIGNlcnRhaW4gb3B0aW9ucy5cbiAvLyBIZXJlIGFyZSB0aGUgZGVmYXVsdHMsIHNvIHlvdSBjYW4gb21pdCBhbnkgb3IgYWxsIG9mIHRoZW0uXG4gJChlbGVtKS5pZGxlVGltZXIodGltZW91dCwge1xuICAgc3RhcnRJbW1lZGlhdGVseTogdHJ1ZSwgLy9zdGFydHMgYSB0aW1lb3V0IGFzIHNvb24gYXMgdGhlIHRpbWVyIGlzIHNldCB1cDsgb3RoZXJ3aXNlIGl0IHdhaXRzIGZvciB0aGUgZmlyc3QgZXZlbnQuXG4gICBpZGxlOiAgICBmYWxzZSwgICAgICAgICAvL2luZGljYXRlcyBpZiB0aGUgdXNlciBpcyBpZGxlXG4gICBlbmFibGVkOiB0cnVlLCAgICAgICAgICAvL2luZGljYXRlcyBpZiB0aGUgaWRsZSB0aW1lciBpcyBlbmFibGVkXG4gICBldmVudHM6ICAnbW91c2Vtb3ZlIGtleWRvd24gRE9NTW91c2VTY3JvbGwgbW91c2V3aGVlbCBtb3VzZWRvd24gdG91Y2hzdGFydCB0b3VjaG1vdmUnIC8vIGFjdGl2aXR5IGlzIG9uZSBvZiB0aGVzZSBldmVudHNcbiB9KTtcblxuICoqKioqKioqL1xuXG4oZnVuY3Rpb24oJCl7XG5cbiQuaWRsZVRpbWVyID0gZnVuY3Rpb24obmV3VGltZW91dCwgZWxlbSwgb3B0cyl7XG5cbiAgICAvLyBkZWZhdWx0cyB0aGF0IGFyZSB0byBiZSBzdG9yZWQgYXMgaW5zdGFuY2UgcHJvcHMgb24gdGhlIGVsZW1cblxuXHRvcHRzID0gJC5leHRlbmQoe1xuXHRcdHN0YXJ0SW1tZWRpYXRlbHk6IHRydWUsIC8vc3RhcnRzIGEgdGltZW91dCBhcyBzb29uIGFzIHRoZSB0aW1lciBpcyBzZXQgdXBcblx0XHRpZGxlOiAgICBmYWxzZSwgICAgICAgICAvL2luZGljYXRlcyBpZiB0aGUgdXNlciBpcyBpZGxlXG5cdFx0ZW5hYmxlZDogdHJ1ZSwgICAgICAgICAgLy9pbmRpY2F0ZXMgaWYgdGhlIGlkbGUgdGltZXIgaXMgZW5hYmxlZFxuXHRcdHRpbWVvdXQ6IDMwMDAwLCAgICAgICAgIC8vdGhlIGFtb3VudCBvZiB0aW1lIChtcykgYmVmb3JlIHRoZSB1c2VyIGlzIGNvbnNpZGVyZWQgaWRsZVxuXHRcdGV2ZW50czogICdtb3VzZW1vdmUga2V5ZG93biBET01Nb3VzZVNjcm9sbCBtb3VzZXdoZWVsIG1vdXNlZG93biB0b3VjaHN0YXJ0IHRvdWNobW92ZScgLy8gYWN0aXZpdHkgaXMgb25lIG9mIHRoZXNlIGV2ZW50c1xuXHR9LCBvcHRzKTtcblxuXG4gICAgZWxlbSA9IGVsZW0gfHwgZG9jdW1lbnQ7XG5cbiAgICAvKiAoaW50ZW50aW9uYWxseSBub3QgZG9jdW1lbnRlZClcbiAgICAgKiBUb2dnbGVzIHRoZSBpZGxlIHN0YXRlIGFuZCBmaXJlcyBhbiBhcHByb3ByaWF0ZSBldmVudC5cbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHZhciB0b2dnbGVJZGxlU3RhdGUgPSBmdW5jdGlvbihteWVsZW0pe1xuXG4gICAgICAgIC8vIGN1cnNlIHlvdSwgbW96aWxsYSBzZXRUaW1lb3V0IGxhdGVuZXNzIGJ1ZyFcbiAgICAgICAgaWYgKHR5cGVvZiBteWVsZW0gPT09ICdudW1iZXInKXtcbiAgICAgICAgICAgIG15ZWxlbSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvYmogPSAkLmRhdGEobXllbGVtIHx8IGVsZW0sJ2lkbGVUaW1lck9iaicpO1xuXG4gICAgICAgIC8vdG9nZ2xlIHRoZSBzdGF0ZVxuICAgICAgICBvYmouaWRsZSA9ICFvYmouaWRsZTtcblxuICAgICAgICAvLyByZXNldCB0aW1lb3V0IFxuICAgICAgICB2YXIgZWxhcHNlZCA9ICgrbmV3IERhdGUoKSkgLSBvYmoub2xkZGF0ZTtcbiAgICAgICAgb2JqLm9sZGRhdGUgPSArbmV3IERhdGUoKTtcblxuICAgICAgICAvLyBoYW5kbGUgQ2hyb21lIGFsd2F5cyB0cmlnZ2VyaW5nIGlkbGUgYWZ0ZXIganMgYWxlcnQgb3IgY29tZmlybSBwb3B1cFxuICAgICAgICBpZiAob2JqLmlkbGUgJiYgKGVsYXBzZWQgPCBvcHRzLnRpbWVvdXQpKSB7XG4gICAgICAgICAgICAgICAgb2JqLmlkbGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoJC5pZGxlVGltZXIudElkKTtcbiAgICAgICAgICAgICAgICBpZiAob3B0cy5lbmFibGVkKVxuICAgICAgICAgICAgICAgICAgJC5pZGxlVGltZXIudElkID0gc2V0VGltZW91dCh0b2dnbGVJZGxlU3RhdGUsIG9wdHMudGltZW91dCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvL2ZpcmUgYXBwcm9wcmlhdGUgZXZlbnRcblxuICAgICAgICAvLyBjcmVhdGUgYSBjdXN0b20gZXZlbnQsIGJ1dCBmaXJzdCwgc3RvcmUgdGhlIG5ldyBzdGF0ZSBvbiB0aGUgZWxlbWVudFxuICAgICAgICAvLyBhbmQgdGhlbiBhcHBlbmQgdGhhdCBzdHJpbmcgdG8gYSBuYW1lc3BhY2VcbiAgICAgICAgdmFyIGV2ZW50ID0galF1ZXJ5LkV2ZW50KCAkLmRhdGEoZWxlbSwnaWRsZVRpbWVyJywgb2JqLmlkbGUgPyBcImlkbGVcIiA6IFwiYWN0aXZlXCIgKSAgKyAnLmlkbGVUaW1lcicgICApO1xuXG4gICAgICAgIC8vIHdlIGRvIHdhbnQgdGhpcyB0byBidWJibGUsIGF0IGxlYXN0IGFzIGEgdGVtcG9yYXJ5IGZpeCBmb3IgalF1ZXJ5IDEuN1xuICAgICAgICAvLyBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgJChlbGVtKS50cmlnZ2VyKGV2ZW50KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU3RvcHMgdGhlIGlkbGUgdGltZXIuIFRoaXMgcmVtb3ZlcyBhcHByb3ByaWF0ZSBldmVudCBoYW5kbGVyc1xuICAgICAqIGFuZCBjYW5jZWxzIGFueSBwZW5kaW5nIHRpbWVvdXRzLlxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICogQG1ldGhvZCBzdG9wXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0b3AgPSBmdW5jdGlvbihlbGVtKXtcblxuICAgICAgICB2YXIgb2JqID0gJC5kYXRhKGVsZW0sJ2lkbGVUaW1lck9iaicpIHx8IHt9O1xuXG4gICAgICAgIC8vc2V0IHRvIGRpc2FibGVkXG4gICAgICAgIG9iai5lbmFibGVkID0gZmFsc2U7XG5cbiAgICAgICAgLy9jbGVhciBhbnkgcGVuZGluZyB0aW1lb3V0c1xuICAgICAgICBjbGVhclRpbWVvdXQob2JqLnRJZCk7XG5cbiAgICAgICAgLy9kZXRhY2ggdGhlIGV2ZW50IGhhbmRsZXJzXG4gICAgICAgICQoZWxlbSkub2ZmKCcuaWRsZVRpbWVyJyk7XG4gICAgfSxcblxuXG4gICAgLyogKGludGVudGlvbmFsbHkgbm90IGRvY3VtZW50ZWQpXG4gICAgICogSGFuZGxlcyBhIHVzZXIgZXZlbnQgaW5kaWNhdGluZyB0aGF0IHRoZSB1c2VyIGlzbid0IGlkbGUuXG4gICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgQSBET00yLW5vcm1hbGl6ZWQgZXZlbnQgb2JqZWN0LlxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgaGFuZGxlVXNlckV2ZW50ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgb2JqID0gJC5kYXRhKHRoaXMsJ2lkbGVUaW1lck9iaicpO1xuXG4gICAgICAgIC8vY2xlYXIgYW55IGV4aXN0aW5nIHRpbWVvdXRcbiAgICAgICAgY2xlYXJUaW1lb3V0KG9iai50SWQpO1xuXG5cblxuICAgICAgICAvL2lmIHRoZSBpZGxlIHRpbWVyIGlzIGVuYWJsZWRcbiAgICAgICAgaWYgKG9iai5lbmFibGVkKXtcblxuXG4gICAgICAgICAgICAvL2lmIGl0J3MgaWRsZSwgdGhhdCBtZWFucyB0aGUgdXNlciBpcyBubyBsb25nZXIgaWRsZVxuICAgICAgICAgICAgaWYgKG9iai5pZGxlKXtcbiAgICAgICAgICAgICAgICB0b2dnbGVJZGxlU3RhdGUodGhpcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vc2V0IGEgbmV3IHRpbWVvdXRcbiAgICAgICAgICAgIG9iai50SWQgPSBzZXRUaW1lb3V0KHRvZ2dsZUlkbGVTdGF0ZSwgb2JqLnRpbWVvdXQpO1xuXG4gICAgICAgIH1cbiAgICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogU3RhcnRzIHRoZSBpZGxlIHRpbWVyLiBUaGlzIGFkZHMgYXBwcm9wcmlhdGUgZXZlbnQgaGFuZGxlcnNcbiAgICAgKiBhbmQgc3RhcnRzIHRoZSBmaXJzdCB0aW1lb3V0LlxuICAgICAqIEBwYXJhbSB7aW50fSBuZXdUaW1lb3V0IChPcHRpb25hbCkgQSBuZXcgdmFsdWUgZm9yIHRoZSB0aW1lb3V0IHBlcmlvZCBpbiBtcy5cbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqIEBtZXRob2QgJC5pZGxlVGltZXJcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG5cblxuICAgIHZhciBvYmogPSAkLmRhdGEoZWxlbSwnaWRsZVRpbWVyT2JqJykgfHwge307XG5cbiAgICBvYmoub2xkZGF0ZSA9IG9iai5vbGRkYXRlIHx8ICtuZXcgRGF0ZSgpO1xuXG4gICAgLy9hc3NpZ24gYSBuZXcgdGltZW91dCBpZiBuZWNlc3NhcnlcbiAgICBpZiAodHlwZW9mIG5ld1RpbWVvdXQgPT09IFwibnVtYmVyXCIpe1xuICAgICAgICBvcHRzLnRpbWVvdXQgPSBuZXdUaW1lb3V0O1xuICAgIH0gZWxzZSBpZiAobmV3VGltZW91dCA9PT0gJ2Rlc3Ryb3knKSB7XG4gICAgICAgIHN0b3AoZWxlbSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZSBpZiAobmV3VGltZW91dCA9PT0gJ2dldEVsYXBzZWRUaW1lJyl7XG4gICAgICAgIHJldHVybiAoK25ldyBEYXRlKCkpIC0gb2JqLm9sZGRhdGU7XG4gICAgfVxuXG4gICAgLy9hc3NpZ24gYXBwcm9wcmlhdGUgZXZlbnQgaGFuZGxlcnNcbiAgICAkKGVsZW0pLm9uKCQudHJpbSgob3B0cy5ldmVudHMrJyAnKS5zcGxpdCgnICcpLmpvaW4oJy5pZGxlVGltZXIgJykpLGhhbmRsZVVzZXJFdmVudCk7XG5cblxuICAgIG9iai5pZGxlICAgID0gb3B0cy5pZGxlO1xuICAgIG9iai5lbmFibGVkID0gb3B0cy5lbmFibGVkO1xuICAgIG9iai50aW1lb3V0ID0gb3B0cy50aW1lb3V0O1xuXG5cbiAgICAvL3NldCBhIHRpbWVvdXQgdG8gdG9nZ2xlIHN0YXRlLiBNYXkgd2lzaCB0byBvbWl0IHRoaXMgaW4gc29tZSBzaXR1YXRpb25zXG5cdGlmIChvcHRzLnN0YXJ0SW1tZWRpYXRlbHkpIHtcblx0ICAgIG9iai50SWQgPSBzZXRUaW1lb3V0KHRvZ2dsZUlkbGVTdGF0ZSwgb2JqLnRpbWVvdXQpO1xuXHR9XG5cbiAgICAvLyBhc3N1bWUgdGhlIHVzZXIgaXMgYWN0aXZlIGZvciB0aGUgZmlyc3QgeCBzZWNvbmRzLlxuICAgICQuZGF0YShlbGVtLCdpZGxlVGltZXInLFwiYWN0aXZlXCIpO1xuXG4gICAgLy8gc3RvcmUgb3VyIGluc3RhbmNlIG9uIHRoZSBvYmplY3RcbiAgICAkLmRhdGEoZWxlbSwnaWRsZVRpbWVyT2JqJyxvYmopO1xuXG5cblxufTsgLy8gZW5kIG9mICQuaWRsZVRpbWVyKClcblxuXG4vLyB2MC45IEFQSSBmb3IgZGVmaW5pbmcgbXVsdGlwbGUgdGltZXJzLlxuJC5mbi5pZGxlVGltZXIgPSBmdW5jdGlvbihuZXdUaW1lb3V0LG9wdHMpe1xuXHQvLyBBbGxvdyBvbWlzc2lvbiBvZiBvcHRzIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG5cdGlmICghb3B0cykge1xuXHRcdG9wdHMgPSB7fTtcblx0fVxuXG4gICAgaWYodGhpc1swXSl7XG4gICAgICAgICQuaWRsZVRpbWVyKG5ld1RpbWVvdXQsdGhpc1swXSxvcHRzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cblxufSkoalF1ZXJ5KTtcbiIsIi8qIVxuICogQklESSBlbWJlZGRpbmcgc3VwcG9ydCBmb3IgalF1ZXJ5LmkxOG5cbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTUsIERhdmlkIENoYW5cbiAqXG4gKiBUaGlzIGNvZGUgaXMgZHVhbCBsaWNlbnNlZCBHUEx2MiBvciBsYXRlciBhbmQgTUlULiBZb3UgZG9uJ3QgaGF2ZSB0byBkb1xuICogYW55dGhpbmcgc3BlY2lhbCB0byBjaG9vc2Ugb25lIGxpY2Vuc2Ugb3IgdGhlIG90aGVyIGFuZCB5b3UgZG9uJ3QgaGF2ZSB0b1xuICogbm90aWZ5IGFueW9uZSB3aGljaCBsaWNlbnNlIHlvdSBhcmUgdXNpbmcuIFlvdSBhcmUgZnJlZSB0byB1c2UgdGhpcyBjb2RlXG4gKiBpbiBjb21tZXJjaWFsIHByb2plY3RzIGFzIGxvbmcgYXMgdGhlIGNvcHlyaWdodCBoZWFkZXIgaXMgbGVmdCBpbnRhY3QuXG4gKiBTZWUgZmlsZXMgR1BMLUxJQ0VOU0UgYW5kIE1JVC1MSUNFTlNFIGZvciBkZXRhaWxzLlxuICpcbiAqIEBsaWNlbmNlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbmNlIDIuMCBvciBsYXRlclxuICogQGxpY2VuY2UgTUlUIExpY2Vuc2VcbiAqL1xuXG4oIGZ1bmN0aW9uICggJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgc3Ryb25nRGlyUmVnRXhwO1xuXG5cdC8qKlxuXHQgKiBNYXRjaGVzIHRoZSBmaXJzdCBzdHJvbmcgZGlyZWN0aW9uYWxpdHkgY29kZXBvaW50OlxuXHQgKiAtIGluIGdyb3VwIDEgaWYgaXQgaXMgTFRSXG5cdCAqIC0gaW4gZ3JvdXAgMiBpZiBpdCBpcyBSVExcblx0ICogRG9lcyBub3QgbWF0Y2ggaWYgdGhlcmUgaXMgbm8gc3Ryb25nIGRpcmVjdGlvbmFsaXR5IGNvZGVwb2ludC5cblx0ICpcblx0ICogR2VuZXJhdGVkIGJ5IFVuaWNvZGVKUyAoc2VlIHRvb2xzL3N0cm9uZ0RpcikgZnJvbSB0aGUgVUNEOyBzZWVcblx0ICogaHR0cHM6Ly9waGFicmljYXRvci53aWtpbWVkaWEub3JnL2RpZmZ1c2lvbi9HVUpTLyAuXG5cdCAqL1xuXHRzdHJvbmdEaXJSZWdFeHAgPSBuZXcgUmVnRXhwKFxuXHRcdCcoPzonICtcblx0XHRcdCcoJyArXG5cdFx0XHRcdCdbXFx1MDA0MS1cXHUwMDVhXFx1MDA2MS1cXHUwMDdhXFx1MDBhYVxcdTAwYjVcXHUwMGJhXFx1MDBjMC1cXHUwMGQ2XFx1MDBkOC1cXHUwMGY2XFx1MDBmOC1cXHUwMmI4XFx1MDJiYi1cXHUwMmMxXFx1MDJkMFxcdTAyZDFcXHUwMmUwLVxcdTAyZTRcXHUwMmVlXFx1MDM3MC1cXHUwMzczXFx1MDM3NlxcdTAzNzdcXHUwMzdhLVxcdTAzN2RcXHUwMzdmXFx1MDM4NlxcdTAzODgtXFx1MDM4YVxcdTAzOGNcXHUwMzhlLVxcdTAzYTFcXHUwM2EzLVxcdTAzZjVcXHUwM2Y3LVxcdTA0ODJcXHUwNDhhLVxcdTA1MmZcXHUwNTMxLVxcdTA1NTZcXHUwNTU5LVxcdTA1NWZcXHUwNTYxLVxcdTA1ODdcXHUwNTg5XFx1MDkwMy1cXHUwOTM5XFx1MDkzYlxcdTA5M2QtXFx1MDk0MFxcdTA5NDktXFx1MDk0Y1xcdTA5NGUtXFx1MDk1MFxcdTA5NTgtXFx1MDk2MVxcdTA5NjQtXFx1MDk4MFxcdTA5ODJcXHUwOTgzXFx1MDk4NS1cXHUwOThjXFx1MDk4ZlxcdTA5OTBcXHUwOTkzLVxcdTA5YThcXHUwOWFhLVxcdTA5YjBcXHUwOWIyXFx1MDliNi1cXHUwOWI5XFx1MDliZC1cXHUwOWMwXFx1MDljN1xcdTA5YzhcXHUwOWNiXFx1MDljY1xcdTA5Y2VcXHUwOWQ3XFx1MDlkY1xcdTA5ZGRcXHUwOWRmLVxcdTA5ZTFcXHUwOWU2LVxcdTA5ZjFcXHUwOWY0LVxcdTA5ZmFcXHUwYTAzXFx1MGEwNS1cXHUwYTBhXFx1MGEwZlxcdTBhMTBcXHUwYTEzLVxcdTBhMjhcXHUwYTJhLVxcdTBhMzBcXHUwYTMyXFx1MGEzM1xcdTBhMzVcXHUwYTM2XFx1MGEzOFxcdTBhMzlcXHUwYTNlLVxcdTBhNDBcXHUwYTU5LVxcdTBhNWNcXHUwYTVlXFx1MGE2Ni1cXHUwYTZmXFx1MGE3Mi1cXHUwYTc0XFx1MGE4M1xcdTBhODUtXFx1MGE4ZFxcdTBhOGYtXFx1MGE5MVxcdTBhOTMtXFx1MGFhOFxcdTBhYWEtXFx1MGFiMFxcdTBhYjJcXHUwYWIzXFx1MGFiNS1cXHUwYWI5XFx1MGFiZC1cXHUwYWMwXFx1MGFjOVxcdTBhY2JcXHUwYWNjXFx1MGFkMFxcdTBhZTBcXHUwYWUxXFx1MGFlNi1cXHUwYWYwXFx1MGFmOVxcdTBiMDJcXHUwYjAzXFx1MGIwNS1cXHUwYjBjXFx1MGIwZlxcdTBiMTBcXHUwYjEzLVxcdTBiMjhcXHUwYjJhLVxcdTBiMzBcXHUwYjMyXFx1MGIzM1xcdTBiMzUtXFx1MGIzOVxcdTBiM2RcXHUwYjNlXFx1MGI0MFxcdTBiNDdcXHUwYjQ4XFx1MGI0YlxcdTBiNGNcXHUwYjU3XFx1MGI1Y1xcdTBiNWRcXHUwYjVmLVxcdTBiNjFcXHUwYjY2LVxcdTBiNzdcXHUwYjgzXFx1MGI4NS1cXHUwYjhhXFx1MGI4ZS1cXHUwYjkwXFx1MGI5Mi1cXHUwYjk1XFx1MGI5OVxcdTBiOWFcXHUwYjljXFx1MGI5ZVxcdTBiOWZcXHUwYmEzXFx1MGJhNFxcdTBiYTgtXFx1MGJhYVxcdTBiYWUtXFx1MGJiOVxcdTBiYmVcXHUwYmJmXFx1MGJjMVxcdTBiYzJcXHUwYmM2LVxcdTBiYzhcXHUwYmNhLVxcdTBiY2NcXHUwYmQwXFx1MGJkN1xcdTBiZTYtXFx1MGJmMlxcdTBjMDEtXFx1MGMwM1xcdTBjMDUtXFx1MGMwY1xcdTBjMGUtXFx1MGMxMFxcdTBjMTItXFx1MGMyOFxcdTBjMmEtXFx1MGMzOVxcdTBjM2RcXHUwYzQxLVxcdTBjNDRcXHUwYzU4LVxcdTBjNWFcXHUwYzYwXFx1MGM2MVxcdTBjNjYtXFx1MGM2ZlxcdTBjN2ZcXHUwYzgyXFx1MGM4M1xcdTBjODUtXFx1MGM4Y1xcdTBjOGUtXFx1MGM5MFxcdTBjOTItXFx1MGNhOFxcdTBjYWEtXFx1MGNiM1xcdTBjYjUtXFx1MGNiOVxcdTBjYmQtXFx1MGNjNFxcdTBjYzYtXFx1MGNjOFxcdTBjY2FcXHUwY2NiXFx1MGNkNVxcdTBjZDZcXHUwY2RlXFx1MGNlMFxcdTBjZTFcXHUwY2U2LVxcdTBjZWZcXHUwY2YxXFx1MGNmMlxcdTBkMDJcXHUwZDAzXFx1MGQwNS1cXHUwZDBjXFx1MGQwZS1cXHUwZDEwXFx1MGQxMi1cXHUwZDNhXFx1MGQzZC1cXHUwZDQwXFx1MGQ0Ni1cXHUwZDQ4XFx1MGQ0YS1cXHUwZDRjXFx1MGQ0ZVxcdTBkNTdcXHUwZDVmLVxcdTBkNjFcXHUwZDY2LVxcdTBkNzVcXHUwZDc5LVxcdTBkN2ZcXHUwZDgyXFx1MGQ4M1xcdTBkODUtXFx1MGQ5NlxcdTBkOWEtXFx1MGRiMVxcdTBkYjMtXFx1MGRiYlxcdTBkYmRcXHUwZGMwLVxcdTBkYzZcXHUwZGNmLVxcdTBkZDFcXHUwZGQ4LVxcdTBkZGZcXHUwZGU2LVxcdTBkZWZcXHUwZGYyLVxcdTBkZjRcXHUwZTAxLVxcdTBlMzBcXHUwZTMyXFx1MGUzM1xcdTBlNDAtXFx1MGU0NlxcdTBlNGYtXFx1MGU1YlxcdTBlODFcXHUwZTgyXFx1MGU4NFxcdTBlODdcXHUwZTg4XFx1MGU4YVxcdTBlOGRcXHUwZTk0LVxcdTBlOTdcXHUwZTk5LVxcdTBlOWZcXHUwZWExLVxcdTBlYTNcXHUwZWE1XFx1MGVhN1xcdTBlYWFcXHUwZWFiXFx1MGVhZC1cXHUwZWIwXFx1MGViMlxcdTBlYjNcXHUwZWJkXFx1MGVjMC1cXHUwZWM0XFx1MGVjNlxcdTBlZDAtXFx1MGVkOVxcdTBlZGMtXFx1MGVkZlxcdTBmMDAtXFx1MGYxN1xcdTBmMWEtXFx1MGYzNFxcdTBmMzZcXHUwZjM4XFx1MGYzZS1cXHUwZjQ3XFx1MGY0OS1cXHUwZjZjXFx1MGY3ZlxcdTBmODVcXHUwZjg4LVxcdTBmOGNcXHUwZmJlLVxcdTBmYzVcXHUwZmM3LVxcdTBmY2NcXHUwZmNlLVxcdTBmZGFcXHUxMDAwLVxcdTEwMmNcXHUxMDMxXFx1MTAzOFxcdTEwM2JcXHUxMDNjXFx1MTAzZi1cXHUxMDU3XFx1MTA1YS1cXHUxMDVkXFx1MTA2MS1cXHUxMDcwXFx1MTA3NS1cXHUxMDgxXFx1MTA4M1xcdTEwODRcXHUxMDg3LVxcdTEwOGNcXHUxMDhlLVxcdTEwOWNcXHUxMDllLVxcdTEwYzVcXHUxMGM3XFx1MTBjZFxcdTEwZDAtXFx1MTI0OFxcdTEyNGEtXFx1MTI0ZFxcdTEyNTAtXFx1MTI1NlxcdTEyNThcXHUxMjVhLVxcdTEyNWRcXHUxMjYwLVxcdTEyODhcXHUxMjhhLVxcdTEyOGRcXHUxMjkwLVxcdTEyYjBcXHUxMmIyLVxcdTEyYjVcXHUxMmI4LVxcdTEyYmVcXHUxMmMwXFx1MTJjMi1cXHUxMmM1XFx1MTJjOC1cXHUxMmQ2XFx1MTJkOC1cXHUxMzEwXFx1MTMxMi1cXHUxMzE1XFx1MTMxOC1cXHUxMzVhXFx1MTM2MC1cXHUxMzdjXFx1MTM4MC1cXHUxMzhmXFx1MTNhMC1cXHUxM2Y1XFx1MTNmOC1cXHUxM2ZkXFx1MTQwMS1cXHUxNjdmXFx1MTY4MS1cXHUxNjlhXFx1MTZhMC1cXHUxNmY4XFx1MTcwMC1cXHUxNzBjXFx1MTcwZS1cXHUxNzExXFx1MTcyMC1cXHUxNzMxXFx1MTczNVxcdTE3MzZcXHUxNzQwLVxcdTE3NTFcXHUxNzYwLVxcdTE3NmNcXHUxNzZlLVxcdTE3NzBcXHUxNzgwLVxcdTE3YjNcXHUxN2I2XFx1MTdiZS1cXHUxN2M1XFx1MTdjN1xcdTE3YzhcXHUxN2Q0LVxcdTE3ZGFcXHUxN2RjXFx1MTdlMC1cXHUxN2U5XFx1MTgxMC1cXHUxODE5XFx1MTgyMC1cXHUxODc3XFx1MTg4MC1cXHUxOGE4XFx1MThhYVxcdTE4YjAtXFx1MThmNVxcdTE5MDAtXFx1MTkxZVxcdTE5MjMtXFx1MTkyNlxcdTE5MjktXFx1MTkyYlxcdTE5MzBcXHUxOTMxXFx1MTkzMy1cXHUxOTM4XFx1MTk0Ni1cXHUxOTZkXFx1MTk3MC1cXHUxOTc0XFx1MTk4MC1cXHUxOWFiXFx1MTliMC1cXHUxOWM5XFx1MTlkMC1cXHUxOWRhXFx1MWEwMC1cXHUxYTE2XFx1MWExOVxcdTFhMWFcXHUxYTFlLVxcdTFhNTVcXHUxYTU3XFx1MWE2MVxcdTFhNjNcXHUxYTY0XFx1MWE2ZC1cXHUxYTcyXFx1MWE4MC1cXHUxYTg5XFx1MWE5MC1cXHUxYTk5XFx1MWFhMC1cXHUxYWFkXFx1MWIwNC1cXHUxYjMzXFx1MWIzNVxcdTFiM2JcXHUxYjNkLVxcdTFiNDFcXHUxYjQzLVxcdTFiNGJcXHUxYjUwLVxcdTFiNmFcXHUxYjc0LVxcdTFiN2NcXHUxYjgyLVxcdTFiYTFcXHUxYmE2XFx1MWJhN1xcdTFiYWFcXHUxYmFlLVxcdTFiZTVcXHUxYmU3XFx1MWJlYS1cXHUxYmVjXFx1MWJlZVxcdTFiZjJcXHUxYmYzXFx1MWJmYy1cXHUxYzJiXFx1MWMzNFxcdTFjMzVcXHUxYzNiLVxcdTFjNDlcXHUxYzRkLVxcdTFjN2ZcXHUxY2MwLVxcdTFjYzdcXHUxY2QzXFx1MWNlMVxcdTFjZTktXFx1MWNlY1xcdTFjZWUtXFx1MWNmM1xcdTFjZjVcXHUxY2Y2XFx1MWQwMC1cXHUxZGJmXFx1MWUwMC1cXHUxZjE1XFx1MWYxOC1cXHUxZjFkXFx1MWYyMC1cXHUxZjQ1XFx1MWY0OC1cXHUxZjRkXFx1MWY1MC1cXHUxZjU3XFx1MWY1OVxcdTFmNWJcXHUxZjVkXFx1MWY1Zi1cXHUxZjdkXFx1MWY4MC1cXHUxZmI0XFx1MWZiNi1cXHUxZmJjXFx1MWZiZVxcdTFmYzItXFx1MWZjNFxcdTFmYzYtXFx1MWZjY1xcdTFmZDAtXFx1MWZkM1xcdTFmZDYtXFx1MWZkYlxcdTFmZTAtXFx1MWZlY1xcdTFmZjItXFx1MWZmNFxcdTFmZjYtXFx1MWZmY1xcdTIwMGVcXHUyMDcxXFx1MjA3ZlxcdTIwOTAtXFx1MjA5Y1xcdTIxMDJcXHUyMTA3XFx1MjEwYS1cXHUyMTEzXFx1MjExNVxcdTIxMTktXFx1MjExZFxcdTIxMjRcXHUyMTI2XFx1MjEyOFxcdTIxMmEtXFx1MjEyZFxcdTIxMmYtXFx1MjEzOVxcdTIxM2MtXFx1MjEzZlxcdTIxNDUtXFx1MjE0OVxcdTIxNGVcXHUyMTRmXFx1MjE2MC1cXHUyMTg4XFx1MjMzNi1cXHUyMzdhXFx1MjM5NVxcdTI0OWMtXFx1MjRlOVxcdTI2YWNcXHUyODAwLVxcdTI4ZmZcXHUyYzAwLVxcdTJjMmVcXHUyYzMwLVxcdTJjNWVcXHUyYzYwLVxcdTJjZTRcXHUyY2ViLVxcdTJjZWVcXHUyY2YyXFx1MmNmM1xcdTJkMDAtXFx1MmQyNVxcdTJkMjdcXHUyZDJkXFx1MmQzMC1cXHUyZDY3XFx1MmQ2ZlxcdTJkNzBcXHUyZDgwLVxcdTJkOTZcXHUyZGEwLVxcdTJkYTZcXHUyZGE4LVxcdTJkYWVcXHUyZGIwLVxcdTJkYjZcXHUyZGI4LVxcdTJkYmVcXHUyZGMwLVxcdTJkYzZcXHUyZGM4LVxcdTJkY2VcXHUyZGQwLVxcdTJkZDZcXHUyZGQ4LVxcdTJkZGVcXHUzMDA1LVxcdTMwMDdcXHUzMDIxLVxcdTMwMjlcXHUzMDJlXFx1MzAyZlxcdTMwMzEtXFx1MzAzNVxcdTMwMzgtXFx1MzAzY1xcdTMwNDEtXFx1MzA5NlxcdTMwOWQtXFx1MzA5ZlxcdTMwYTEtXFx1MzBmYVxcdTMwZmMtXFx1MzBmZlxcdTMxMDUtXFx1MzEyZFxcdTMxMzEtXFx1MzE4ZVxcdTMxOTAtXFx1MzFiYVxcdTMxZjAtXFx1MzIxY1xcdTMyMjAtXFx1MzI0ZlxcdTMyNjAtXFx1MzI3YlxcdTMyN2YtXFx1MzJiMFxcdTMyYzAtXFx1MzJjYlxcdTMyZDAtXFx1MzJmZVxcdTMzMDAtXFx1MzM3NlxcdTMzN2ItXFx1MzNkZFxcdTMzZTAtXFx1MzNmZVxcdTM0MDAtXFx1NGRiNVxcdTRlMDAtXFx1OWZkNVxcdWEwMDAtXFx1YTQ4Y1xcdWE0ZDAtXFx1YTYwY1xcdWE2MTAtXFx1YTYyYlxcdWE2NDAtXFx1YTY2ZVxcdWE2ODAtXFx1YTY5ZFxcdWE2YTAtXFx1YTZlZlxcdWE2ZjItXFx1YTZmN1xcdWE3MjItXFx1YTc4N1xcdWE3ODktXFx1YTdhZFxcdWE3YjAtXFx1YTdiN1xcdWE3ZjctXFx1YTgwMVxcdWE4MDMtXFx1YTgwNVxcdWE4MDctXFx1YTgwYVxcdWE4MGMtXFx1YTgyNFxcdWE4MjdcXHVhODMwLVxcdWE4MzdcXHVhODQwLVxcdWE4NzNcXHVhODgwLVxcdWE4YzNcXHVhOGNlLVxcdWE4ZDlcXHVhOGYyLVxcdWE4ZmRcXHVhOTAwLVxcdWE5MjVcXHVhOTJlLVxcdWE5NDZcXHVhOTUyXFx1YTk1M1xcdWE5NWYtXFx1YTk3Y1xcdWE5ODMtXFx1YTliMlxcdWE5YjRcXHVhOWI1XFx1YTliYVxcdWE5YmJcXHVhOWJkLVxcdWE5Y2RcXHVhOWNmLVxcdWE5ZDlcXHVhOWRlLVxcdWE5ZTRcXHVhOWU2LVxcdWE5ZmVcXHVhYTAwLVxcdWFhMjhcXHVhYTJmXFx1YWEzMFxcdWFhMzNcXHVhYTM0XFx1YWE0MC1cXHVhYTQyXFx1YWE0NC1cXHVhYTRiXFx1YWE0ZFxcdWFhNTAtXFx1YWE1OVxcdWFhNWMtXFx1YWE3YlxcdWFhN2QtXFx1YWFhZlxcdWFhYjFcXHVhYWI1XFx1YWFiNlxcdWFhYjktXFx1YWFiZFxcdWFhYzBcXHVhYWMyXFx1YWFkYi1cXHVhYWViXFx1YWFlZS1cXHVhYWY1XFx1YWIwMS1cXHVhYjA2XFx1YWIwOS1cXHVhYjBlXFx1YWIxMS1cXHVhYjE2XFx1YWIyMC1cXHVhYjI2XFx1YWIyOC1cXHVhYjJlXFx1YWIzMC1cXHVhYjY1XFx1YWI3MC1cXHVhYmU0XFx1YWJlNlxcdWFiZTdcXHVhYmU5LVxcdWFiZWNcXHVhYmYwLVxcdWFiZjlcXHVhYzAwLVxcdWQ3YTNcXHVkN2IwLVxcdWQ3YzZcXHVkN2NiLVxcdWQ3ZmJcXHVlMDAwLVxcdWZhNmRcXHVmYTcwLVxcdWZhZDlcXHVmYjAwLVxcdWZiMDZcXHVmYjEzLVxcdWZiMTdcXHVmZjIxLVxcdWZmM2FcXHVmZjQxLVxcdWZmNWFcXHVmZjY2LVxcdWZmYmVcXHVmZmMyLVxcdWZmYzdcXHVmZmNhLVxcdWZmY2ZcXHVmZmQyLVxcdWZmZDdcXHVmZmRhLVxcdWZmZGNdfFxcdWQ4MDBbXFx1ZGMwMC1cXHVkYzBiXXxcXHVkODAwW1xcdWRjMGQtXFx1ZGMyNl18XFx1ZDgwMFtcXHVkYzI4LVxcdWRjM2FdfFxcdWQ4MDBcXHVkYzNjfFxcdWQ4MDBcXHVkYzNkfFxcdWQ4MDBbXFx1ZGMzZi1cXHVkYzRkXXxcXHVkODAwW1xcdWRjNTAtXFx1ZGM1ZF18XFx1ZDgwMFtcXHVkYzgwLVxcdWRjZmFdfFxcdWQ4MDBcXHVkZDAwfFxcdWQ4MDBcXHVkZDAyfFxcdWQ4MDBbXFx1ZGQwNy1cXHVkZDMzXXxcXHVkODAwW1xcdWRkMzctXFx1ZGQzZl18XFx1ZDgwMFtcXHVkZGQwLVxcdWRkZmNdfFxcdWQ4MDBbXFx1ZGU4MC1cXHVkZTljXXxcXHVkODAwW1xcdWRlYTAtXFx1ZGVkMF18XFx1ZDgwMFtcXHVkZjAwLVxcdWRmMjNdfFxcdWQ4MDBbXFx1ZGYzMC1cXHVkZjRhXXxcXHVkODAwW1xcdWRmNTAtXFx1ZGY3NV18XFx1ZDgwMFtcXHVkZjgwLVxcdWRmOWRdfFxcdWQ4MDBbXFx1ZGY5Zi1cXHVkZmMzXXxcXHVkODAwW1xcdWRmYzgtXFx1ZGZkNV18XFx1ZDgwMVtcXHVkYzAwLVxcdWRjOWRdfFxcdWQ4MDFbXFx1ZGNhMC1cXHVkY2E5XXxcXHVkODAxW1xcdWRkMDAtXFx1ZGQyN118XFx1ZDgwMVtcXHVkZDMwLVxcdWRkNjNdfFxcdWQ4MDFcXHVkZDZmfFxcdWQ4MDFbXFx1ZGUwMC1cXHVkZjM2XXxcXHVkODAxW1xcdWRmNDAtXFx1ZGY1NV18XFx1ZDgwMVtcXHVkZjYwLVxcdWRmNjddfFxcdWQ4MDRcXHVkYzAwfFxcdWQ4MDRbXFx1ZGMwMi1cXHVkYzM3XXxcXHVkODA0W1xcdWRjNDctXFx1ZGM0ZF18XFx1ZDgwNFtcXHVkYzY2LVxcdWRjNmZdfFxcdWQ4MDRbXFx1ZGM4Mi1cXHVkY2IyXXxcXHVkODA0XFx1ZGNiN3xcXHVkODA0XFx1ZGNiOHxcXHVkODA0W1xcdWRjYmItXFx1ZGNjMV18XFx1ZDgwNFtcXHVkY2QwLVxcdWRjZThdfFxcdWQ4MDRbXFx1ZGNmMC1cXHVkY2Y5XXxcXHVkODA0W1xcdWRkMDMtXFx1ZGQyNl18XFx1ZDgwNFxcdWRkMmN8XFx1ZDgwNFtcXHVkZDM2LVxcdWRkNDNdfFxcdWQ4MDRbXFx1ZGQ1MC1cXHVkZDcyXXxcXHVkODA0W1xcdWRkNzQtXFx1ZGQ3Nl18XFx1ZDgwNFtcXHVkZDgyLVxcdWRkYjVdfFxcdWQ4MDRbXFx1ZGRiZi1cXHVkZGM5XXxcXHVkODA0XFx1ZGRjZHxcXHVkODA0W1xcdWRkZDAtXFx1ZGRkZl18XFx1ZDgwNFtcXHVkZGUxLVxcdWRkZjRdfFxcdWQ4MDRbXFx1ZGUwMC1cXHVkZTExXXxcXHVkODA0W1xcdWRlMTMtXFx1ZGUyZV18XFx1ZDgwNFxcdWRlMzJ8XFx1ZDgwNFxcdWRlMzN8XFx1ZDgwNFxcdWRlMzV8XFx1ZDgwNFtcXHVkZTM4LVxcdWRlM2RdfFxcdWQ4MDRbXFx1ZGU4MC1cXHVkZTg2XXxcXHVkODA0XFx1ZGU4OHxcXHVkODA0W1xcdWRlOGEtXFx1ZGU4ZF18XFx1ZDgwNFtcXHVkZThmLVxcdWRlOWRdfFxcdWQ4MDRbXFx1ZGU5Zi1cXHVkZWE5XXxcXHVkODA0W1xcdWRlYjAtXFx1ZGVkZV18XFx1ZDgwNFtcXHVkZWUwLVxcdWRlZTJdfFxcdWQ4MDRbXFx1ZGVmMC1cXHVkZWY5XXxcXHVkODA0XFx1ZGYwMnxcXHVkODA0XFx1ZGYwM3xcXHVkODA0W1xcdWRmMDUtXFx1ZGYwY118XFx1ZDgwNFxcdWRmMGZ8XFx1ZDgwNFxcdWRmMTB8XFx1ZDgwNFtcXHVkZjEzLVxcdWRmMjhdfFxcdWQ4MDRbXFx1ZGYyYS1cXHVkZjMwXXxcXHVkODA0XFx1ZGYzMnxcXHVkODA0XFx1ZGYzM3xcXHVkODA0W1xcdWRmMzUtXFx1ZGYzOV18XFx1ZDgwNFtcXHVkZjNkLVxcdWRmM2ZdfFxcdWQ4MDRbXFx1ZGY0MS1cXHVkZjQ0XXxcXHVkODA0XFx1ZGY0N3xcXHVkODA0XFx1ZGY0OHxcXHVkODA0W1xcdWRmNGItXFx1ZGY0ZF18XFx1ZDgwNFxcdWRmNTB8XFx1ZDgwNFxcdWRmNTd8XFx1ZDgwNFtcXHVkZjVkLVxcdWRmNjNdfFxcdWQ4MDVbXFx1ZGM4MC1cXHVkY2IyXXxcXHVkODA1XFx1ZGNiOXxcXHVkODA1W1xcdWRjYmItXFx1ZGNiZV18XFx1ZDgwNVxcdWRjYzF8XFx1ZDgwNVtcXHVkY2M0LVxcdWRjYzddfFxcdWQ4MDVbXFx1ZGNkMC1cXHVkY2Q5XXxcXHVkODA1W1xcdWRkODAtXFx1ZGRiMV18XFx1ZDgwNVtcXHVkZGI4LVxcdWRkYmJdfFxcdWQ4MDVcXHVkZGJlfFxcdWQ4MDVbXFx1ZGRjMS1cXHVkZGRiXXxcXHVkODA1W1xcdWRlMDAtXFx1ZGUzMl18XFx1ZDgwNVxcdWRlM2J8XFx1ZDgwNVxcdWRlM2N8XFx1ZDgwNVxcdWRlM2V8XFx1ZDgwNVtcXHVkZTQxLVxcdWRlNDRdfFxcdWQ4MDVbXFx1ZGU1MC1cXHVkZTU5XXxcXHVkODA1W1xcdWRlODAtXFx1ZGVhYV18XFx1ZDgwNVxcdWRlYWN8XFx1ZDgwNVxcdWRlYWV8XFx1ZDgwNVxcdWRlYWZ8XFx1ZDgwNVxcdWRlYjZ8XFx1ZDgwNVtcXHVkZWMwLVxcdWRlYzldfFxcdWQ4MDVbXFx1ZGYwMC1cXHVkZjE5XXxcXHVkODA1XFx1ZGYyMHxcXHVkODA1XFx1ZGYyMXxcXHVkODA1XFx1ZGYyNnxcXHVkODA1W1xcdWRmMzAtXFx1ZGYzZl18XFx1ZDgwNltcXHVkY2EwLVxcdWRjZjJdfFxcdWQ4MDZcXHVkY2ZmfFxcdWQ4MDZbXFx1ZGVjMC1cXHVkZWY4XXxcXHVkODA4W1xcdWRjMDAtXFx1ZGY5OV18XFx1ZDgwOVtcXHVkYzAwLVxcdWRjNmVdfFxcdWQ4MDlbXFx1ZGM3MC1cXHVkYzc0XXxcXHVkODA5W1xcdWRjODAtXFx1ZGQ0M118XFx1ZDgwY1tcXHVkYzAwLVxcdWRmZmZdfFxcdWQ4MGRbXFx1ZGMwMC1cXHVkYzJlXXxcXHVkODExW1xcdWRjMDAtXFx1ZGU0Nl18XFx1ZDgxYVtcXHVkYzAwLVxcdWRlMzhdfFxcdWQ4MWFbXFx1ZGU0MC1cXHVkZTVlXXxcXHVkODFhW1xcdWRlNjAtXFx1ZGU2OV18XFx1ZDgxYVxcdWRlNmV8XFx1ZDgxYVxcdWRlNmZ8XFx1ZDgxYVtcXHVkZWQwLVxcdWRlZWRdfFxcdWQ4MWFcXHVkZWY1fFxcdWQ4MWFbXFx1ZGYwMC1cXHVkZjJmXXxcXHVkODFhW1xcdWRmMzctXFx1ZGY0NV18XFx1ZDgxYVtcXHVkZjUwLVxcdWRmNTldfFxcdWQ4MWFbXFx1ZGY1Yi1cXHVkZjYxXXxcXHVkODFhW1xcdWRmNjMtXFx1ZGY3N118XFx1ZDgxYVtcXHVkZjdkLVxcdWRmOGZdfFxcdWQ4MWJbXFx1ZGYwMC1cXHVkZjQ0XXxcXHVkODFiW1xcdWRmNTAtXFx1ZGY3ZV18XFx1ZDgxYltcXHVkZjkzLVxcdWRmOWZdfFxcdWQ4MmNcXHVkYzAwfFxcdWQ4MmNcXHVkYzAxfFxcdWQ4MmZbXFx1ZGMwMC1cXHVkYzZhXXxcXHVkODJmW1xcdWRjNzAtXFx1ZGM3Y118XFx1ZDgyZltcXHVkYzgwLVxcdWRjODhdfFxcdWQ4MmZbXFx1ZGM5MC1cXHVkYzk5XXxcXHVkODJmXFx1ZGM5Y3xcXHVkODJmXFx1ZGM5ZnxcXHVkODM0W1xcdWRjMDAtXFx1ZGNmNV18XFx1ZDgzNFtcXHVkZDAwLVxcdWRkMjZdfFxcdWQ4MzRbXFx1ZGQyOS1cXHVkZDY2XXxcXHVkODM0W1xcdWRkNmEtXFx1ZGQ3Ml18XFx1ZDgzNFxcdWRkODN8XFx1ZDgzNFxcdWRkODR8XFx1ZDgzNFtcXHVkZDhjLVxcdWRkYTldfFxcdWQ4MzRbXFx1ZGRhZS1cXHVkZGU4XXxcXHVkODM0W1xcdWRmNjAtXFx1ZGY3MV18XFx1ZDgzNVtcXHVkYzAwLVxcdWRjNTRdfFxcdWQ4MzVbXFx1ZGM1Ni1cXHVkYzljXXxcXHVkODM1XFx1ZGM5ZXxcXHVkODM1XFx1ZGM5ZnxcXHVkODM1XFx1ZGNhMnxcXHVkODM1XFx1ZGNhNXxcXHVkODM1XFx1ZGNhNnxcXHVkODM1W1xcdWRjYTktXFx1ZGNhY118XFx1ZDgzNVtcXHVkY2FlLVxcdWRjYjldfFxcdWQ4MzVcXHVkY2JifFxcdWQ4MzVbXFx1ZGNiZC1cXHVkY2MzXXxcXHVkODM1W1xcdWRjYzUtXFx1ZGQwNV18XFx1ZDgzNVtcXHVkZDA3LVxcdWRkMGFdfFxcdWQ4MzVbXFx1ZGQwZC1cXHVkZDE0XXxcXHVkODM1W1xcdWRkMTYtXFx1ZGQxY118XFx1ZDgzNVtcXHVkZDFlLVxcdWRkMzldfFxcdWQ4MzVbXFx1ZGQzYi1cXHVkZDNlXXxcXHVkODM1W1xcdWRkNDAtXFx1ZGQ0NF18XFx1ZDgzNVxcdWRkNDZ8XFx1ZDgzNVtcXHVkZDRhLVxcdWRkNTBdfFxcdWQ4MzVbXFx1ZGQ1Mi1cXHVkZWE1XXxcXHVkODM1W1xcdWRlYTgtXFx1ZGVkYV18XFx1ZDgzNVtcXHVkZWRjLVxcdWRmMTRdfFxcdWQ4MzVbXFx1ZGYxNi1cXHVkZjRlXXxcXHVkODM1W1xcdWRmNTAtXFx1ZGY4OF18XFx1ZDgzNVtcXHVkZjhhLVxcdWRmYzJdfFxcdWQ4MzVbXFx1ZGZjNC1cXHVkZmNiXXxcXHVkODM2W1xcdWRjMDAtXFx1ZGRmZl18XFx1ZDgzNltcXHVkZTM3LVxcdWRlM2FdfFxcdWQ4MzZbXFx1ZGU2ZC1cXHVkZTc0XXxcXHVkODM2W1xcdWRlNzYtXFx1ZGU4M118XFx1ZDgzNltcXHVkZTg1LVxcdWRlOGJdfFxcdWQ4M2NbXFx1ZGQxMC1cXHVkZDJlXXxcXHVkODNjW1xcdWRkMzAtXFx1ZGQ2OV18XFx1ZDgzY1tcXHVkZDcwLVxcdWRkOWFdfFxcdWQ4M2NbXFx1ZGRlNi1cXHVkZTAyXXxcXHVkODNjW1xcdWRlMTAtXFx1ZGUzYV18XFx1ZDgzY1tcXHVkZTQwLVxcdWRlNDhdfFxcdWQ4M2NcXHVkZTUwfFxcdWQ4M2NcXHVkZTUxfFtcXHVkODQwLVxcdWQ4NjhdW1xcdWRjMDAtXFx1ZGZmZl18XFx1ZDg2OVtcXHVkYzAwLVxcdWRlZDZdfFxcdWQ4NjlbXFx1ZGYwMC1cXHVkZmZmXXxbXFx1ZDg2YS1cXHVkODZjXVtcXHVkYzAwLVxcdWRmZmZdfFxcdWQ4NmRbXFx1ZGMwMC1cXHVkZjM0XXxcXHVkODZkW1xcdWRmNDAtXFx1ZGZmZl18XFx1ZDg2ZVtcXHVkYzAwLVxcdWRjMWRdfFxcdWQ4NmVbXFx1ZGMyMC1cXHVkZmZmXXxbXFx1ZDg2Zi1cXHVkODcyXVtcXHVkYzAwLVxcdWRmZmZdfFxcdWQ4NzNbXFx1ZGMwMC1cXHVkZWExXXxcXHVkODdlW1xcdWRjMDAtXFx1ZGUxZF18W1xcdWRiODAtXFx1ZGJiZV1bXFx1ZGMwMC1cXHVkZmZmXXxcXHVkYmJmW1xcdWRjMDAtXFx1ZGZmZF18W1xcdWRiYzAtXFx1ZGJmZV1bXFx1ZGMwMC1cXHVkZmZmXXxcXHVkYmZmW1xcdWRjMDAtXFx1ZGZmZF0nICtcblx0XHRcdCcpfCgnICtcblx0XHRcdFx0J1tcXHUwNTkwXFx1MDViZVxcdTA1YzBcXHUwNWMzXFx1MDVjNlxcdTA1YzgtXFx1MDVmZlxcdTA3YzAtXFx1MDdlYVxcdTA3ZjRcXHUwN2Y1XFx1MDdmYS1cXHUwODE1XFx1MDgxYVxcdTA4MjRcXHUwODI4XFx1MDgyZS1cXHUwODU4XFx1MDg1Yy1cXHUwODlmXFx1MjAwZlxcdWZiMWRcXHVmYjFmLVxcdWZiMjhcXHVmYjJhLVxcdWZiNGZcXHUwNjA4XFx1MDYwYlxcdTA2MGRcXHUwNjFiLVxcdTA2NGFcXHUwNjZkLVxcdTA2NmZcXHUwNjcxLVxcdTA2ZDVcXHUwNmU1XFx1MDZlNlxcdTA2ZWVcXHUwNmVmXFx1MDZmYS1cXHUwNzEwXFx1MDcxMi1cXHUwNzJmXFx1MDc0Yi1cXHUwN2E1XFx1MDdiMS1cXHUwN2JmXFx1MDhhMC1cXHUwOGUyXFx1ZmI1MC1cXHVmZDNkXFx1ZmQ0MC1cXHVmZGNmXFx1ZmRmMC1cXHVmZGZjXFx1ZmRmZVxcdWZkZmZcXHVmZTcwLVxcdWZlZmVdfFxcdWQ4MDJbXFx1ZGMwMC1cXHVkZDFlXXxcXHVkODAyW1xcdWRkMjAtXFx1ZGUwMF18XFx1ZDgwMlxcdWRlMDR8XFx1ZDgwMltcXHVkZTA3LVxcdWRlMGJdfFxcdWQ4MDJbXFx1ZGUxMC1cXHVkZTM3XXxcXHVkODAyW1xcdWRlM2ItXFx1ZGUzZV18XFx1ZDgwMltcXHVkZTQwLVxcdWRlZTRdfFxcdWQ4MDJbXFx1ZGVlNy1cXHVkZjM4XXxcXHVkODAyW1xcdWRmNDAtXFx1ZGZmZl18XFx1ZDgwM1tcXHVkYzAwLVxcdWRlNWZdfFxcdWQ4MDNbXFx1ZGU3Zi1cXHVkZmZmXXxcXHVkODNhW1xcdWRjMDAtXFx1ZGNjZl18XFx1ZDgzYVtcXHVkY2Q3LVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGMwMC1cXHVkZGZmXXxcXHVkODNiW1xcdWRmMDAtXFx1ZGZmZl18XFx1ZDgzYltcXHVkZjAwLVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGYwMC1cXHVkZmZmXXxcXHVkODNiW1xcdWRmMDAtXFx1ZGZmZl18XFx1ZDgzYltcXHVkZjAwLVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGYwMC1cXHVkZmZmXXxcXHVkODNiW1xcdWRmMDAtXFx1ZGZmZl18XFx1ZDgzYltcXHVkZjAwLVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGYwMC1cXHVkZmZmXXxcXHVkODNiW1xcdWRmMDAtXFx1ZGZmZl18XFx1ZDgzYltcXHVkZjAwLVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGYwMC1cXHVkZmZmXXxcXHVkODNiW1xcdWRmMDAtXFx1ZGZmZl18XFx1ZDgzYltcXHVkZTAwLVxcdWRlZWZdfFxcdWQ4M2JbXFx1ZGVmMi1cXHVkZWZmXScgK1xuXHRcdFx0JyknICtcblx0XHQnKSdcblx0KTtcblxuXHQvKipcblx0ICogR2V0cyBkaXJlY3Rpb25hbGl0eSBvZiB0aGUgZmlyc3Qgc3Ryb25nbHkgZGlyZWN0aW9uYWwgY29kZXBvaW50XG5cdCAqXG5cdCAqIFRoaXMgaXMgdGhlIHJ1bGUgdGhlIEJJREkgYWxnb3JpdGhtIHVzZXMgdG8gZGV0ZXJtaW5lIHRoZSBkaXJlY3Rpb25hbGl0eSBvZlxuXHQgKiBwYXJhZ3JhcGhzICggaHR0cDovL3VuaWNvZGUub3JnL3JlcG9ydHMvdHI5LyNUaGVfUGFyYWdyYXBoX0xldmVsICkgYW5kXG5cdCAqIEZTSSBpc29sYXRlcyAoIGh0dHA6Ly91bmljb2RlLm9yZy9yZXBvcnRzL3RyOS8jRXhwbGljaXRfRGlyZWN0aW9uYWxfSXNvbGF0ZXMgKS5cblx0ICpcblx0ICogVE9ETzogRG9lcyBub3QgaGFuZGxlIEJJREkgY29udHJvbCBjaGFyYWN0ZXJzIGluc2lkZSB0aGUgdGV4dC5cblx0ICogVE9ETzogRG9lcyBub3QgaGFuZGxlIHVuYWxsb2NhdGVkIGNoYXJhY3RlcnMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IGZyb20gd2hpY2ggdG8gZXh0cmFjdCBpbml0aWFsIGRpcmVjdGlvbmFsaXR5LlxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9IERpcmVjdGlvbmFsaXR5IChlaXRoZXIgJ2x0cicgb3IgJ3J0bCcpXG5cdCAqL1xuXHRmdW5jdGlvbiBzdHJvbmdEaXJGcm9tQ29udGVudCggdGV4dCApIHtcblx0XHR2YXIgbSA9IHRleHQubWF0Y2goIHN0cm9uZ0RpclJlZ0V4cCApO1xuXHRcdGlmICggIW0gKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdFx0aWYgKCBtWyAyIF0gPT09IHVuZGVmaW5lZCApIHtcblx0XHRcdHJldHVybiAnbHRyJztcblx0XHR9XG5cdFx0cmV0dXJuICdydGwnO1xuXHR9XG5cblx0JC5leHRlbmQoICQuaTE4bi5wYXJzZXIuZW1pdHRlciwge1xuXHRcdC8qKlxuXHRcdCAqIFdyYXBzIGFyZ3VtZW50IHdpdGggdW5pY29kZSBjb250cm9sIGNoYXJhY3RlcnMgZm9yIGRpcmVjdGlvbmFsaXR5IHNhZmV0eVxuXHRcdCAqXG5cdFx0ICogVGhpcyBzb2x2ZXMgdGhlIHByb2JsZW0gd2hlcmUgZGlyZWN0aW9uYWxpdHktbmV1dHJhbCBjaGFyYWN0ZXJzIGF0IHRoZSBlZGdlIG9mXG5cdFx0ICogdGhlIGFyZ3VtZW50IHN0cmluZyBnZXQgaW50ZXJwcmV0ZWQgd2l0aCB0aGUgd3JvbmcgZGlyZWN0aW9uYWxpdHkgZnJvbSB0aGVcblx0XHQgKiBlbmNsb3NpbmcgY29udGV4dCwgZ2l2aW5nIHJlbmRlcmluZ3MgdGhhdCBsb29rIGNvcnJ1cHRlZCBsaWtlIFwiKEJlbl8oV01GXCIuXG5cdFx0ICpcblx0XHQgKiBUaGUgd3JhcHBpbmcgaXMgTFJFLi4uUERGIG9yIFJMRS4uLlBERiwgZGVwZW5kaW5nIG9uIHRoZSBkZXRlY3RlZFxuXHRcdCAqIGRpcmVjdGlvbmFsaXR5IG9mIHRoZSBhcmd1bWVudCBzdHJpbmcsIHVzaW5nIHRoZSBCSURJIGFsZ29yaXRobSdzIG93biBcIkZpcnN0XG5cdFx0ICogc3Ryb25nIGRpcmVjdGlvbmFsIGNvZGVwb2ludFwiIHJ1bGUuIEVzc2VudGlhbGx5LCB0aGlzIHdvcmtzIHJvdW5kIHRoZSBmYWN0IHRoYXRcblx0XHQgKiB0aGVyZSBpcyBubyBlbWJlZGRpbmcgZXF1aXZhbGVudCBvZiBVKzIwNjggRlNJIChpc29sYXRpb24gd2l0aCBoZXVyaXN0aWNcblx0XHQgKiBkaXJlY3Rpb24gaW5mZXJlbmNlKS4gVGhlIGxhdHRlciBpcyBjbGVhbmVyIGJ1dCBzdGlsbCBub3Qgd2lkZWx5IHN1cHBvcnRlZC5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nW119IG5vZGVzIFRoZSB0ZXh0IG5vZGVzIGZyb20gd2hpY2ggdG8gdGFrZSB0aGUgZmlyc3QgaXRlbS5cblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd9IFdyYXBwZWQgU3RyaW5nIG9mIGNvbnRlbnQgYXMgbmVlZGVkLlxuXHRcdCAqL1xuXHRcdGJpZGk6IGZ1bmN0aW9uICggbm9kZXMgKSB7XG5cdFx0XHR2YXIgZGlyID0gc3Ryb25nRGlyRnJvbUNvbnRlbnQoIG5vZGVzWyAwIF0gKTtcblx0XHRcdGlmICggZGlyID09PSAnbHRyJyApIHtcblx0XHRcdFx0Ly8gV3JhcCBpbiBMRUZULVRPLVJJR0hUIEVNQkVERElORyAuLi4gUE9QIERJUkVDVElPTkFMIEZPUk1BVFRJTkdcblx0XHRcdFx0cmV0dXJuICdcXHUyMDJBJyArIG5vZGVzWyAwIF0gKyAnXFx1MjAyQyc7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIGRpciA9PT0gJ3J0bCcgKSB7XG5cdFx0XHRcdC8vIFdyYXAgaW4gUklHSFQtVE8tTEVGVCBFTUJFRERJTkcgLi4uIFBPUCBESVJFQ1RJT05BTCBGT1JNQVRUSU5HXG5cdFx0XHRcdHJldHVybiAnXFx1MjAyQicgKyBub2Rlc1sgMCBdICsgJ1xcdTIwMkMnO1xuXHRcdFx0fVxuXHRcdFx0Ly8gTm8gc3Ryb25nIGRpcmVjdGlvbmFsaXR5OiBkbyBub3Qgd3JhcFxuXHRcdFx0cmV0dXJuIG5vZGVzWyAwIF07XG5cdFx0fVxuXHR9ICk7XG59KCBqUXVlcnkgKSApO1xuIiwiLyohXG4gKiBqUXVlcnkgSW50ZXJuYXRpb25hbGl6YXRpb24gbGlicmFyeVxuICpcbiAqIENvcHlyaWdodCAoQykgMjAxMS0yMDEzIFNhbnRob3NoIFRob3R0aW5nYWwsIE5laWwgS2FuZGFsZ2FvbmthclxuICpcbiAqIGpxdWVyeS5pMThuIGlzIGR1YWwgbGljZW5zZWQgR1BMdjIgb3IgbGF0ZXIgYW5kIE1JVC4gWW91IGRvbid0IGhhdmUgdG8gZG9cbiAqIGFueXRoaW5nIHNwZWNpYWwgdG8gY2hvb3NlIG9uZSBsaWNlbnNlIG9yIHRoZSBvdGhlciBhbmQgeW91IGRvbid0IGhhdmUgdG9cbiAqIG5vdGlmeSBhbnlvbmUgd2hpY2ggbGljZW5zZSB5b3UgYXJlIHVzaW5nLiBZb3UgYXJlIGZyZWUgdG8gdXNlXG4gKiBVbml2ZXJzYWxMYW5ndWFnZVNlbGVjdG9yIGluIGNvbW1lcmNpYWwgcHJvamVjdHMgYXMgbG9uZyBhcyB0aGUgY29weXJpZ2h0XG4gKiBoZWFkZXIgaXMgbGVmdCBpbnRhY3QuIFNlZSBmaWxlcyBHUEwtTElDRU5TRSBhbmQgTUlULUxJQ0VOU0UgZm9yIGRldGFpbHMuXG4gKlxuICogQGxpY2VuY2UgR05VIEdlbmVyYWwgUHVibGljIExpY2VuY2UgMi4wIG9yIGxhdGVyXG4gKiBAbGljZW5jZSBNSVQgTGljZW5zZVxuICovXG5cbiggZnVuY3Rpb24gKCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIE1lc3NhZ2VQYXJzZXJFbWl0dGVyID0gZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMubGFuZ3VhZ2UgPSAkLmkxOG4ubGFuZ3VhZ2VzWyBTdHJpbmcubG9jYWxlIF0gfHwgJC5pMThuLmxhbmd1YWdlc1sgJ2RlZmF1bHQnIF07XG5cdH07XG5cblx0TWVzc2FnZVBhcnNlckVtaXR0ZXIucHJvdG90eXBlID0ge1xuXHRcdGNvbnN0cnVjdG9yOiBNZXNzYWdlUGFyc2VyRW1pdHRlcixcblxuXHRcdC8qKlxuXHRcdCAqIChXZSBwdXQgdGhpcyBtZXRob2QgZGVmaW5pdGlvbiBoZXJlLCBhbmQgbm90IGluIHByb3RvdHlwZSwgdG8gbWFrZVxuXHRcdCAqIHN1cmUgaXQncyBub3Qgb3ZlcndyaXR0ZW4gYnkgYW55IG1hZ2ljLikgV2FsayBlbnRpcmUgbm9kZSBzdHJ1Y3R1cmUsXG5cdFx0ICogYXBwbHlpbmcgcmVwbGFjZW1lbnRzIGFuZCB0ZW1wbGF0ZSBmdW5jdGlvbnMgd2hlbiBhcHByb3ByaWF0ZVxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtNaXhlZH0gbm9kZSBhYnN0cmFjdCBzeW50YXggdHJlZSAodG9wIG5vZGUgb3Igc3Vibm9kZSlcblx0XHQgKiBAcGFyYW0ge0FycmF5fSByZXBsYWNlbWVudHMgZm9yICQxLCAkMiwgLi4uICRuXG5cdFx0ICogQHJldHVybiB7TWl4ZWR9IHNpbmdsZS1zdHJpbmcgbm9kZSBvciBhcnJheSBvZiBub2RlcyBzdWl0YWJsZSBmb3Jcblx0XHQgKiAgalF1ZXJ5IGFwcGVuZGluZy5cblx0XHQgKi9cblx0XHRlbWl0OiBmdW5jdGlvbiAoIG5vZGUsIHJlcGxhY2VtZW50cyApIHtcblx0XHRcdHZhciByZXQsIHN1Ym5vZGVzLCBvcGVyYXRpb24sXG5cdFx0XHRcdG1lc3NhZ2VQYXJzZXJFbWl0dGVyID0gdGhpcztcblxuXHRcdFx0c3dpdGNoICggdHlwZW9mIG5vZGUgKSB7XG5cdFx0XHRcdGNhc2UgJ3N0cmluZyc6XG5cdFx0XHRcdGNhc2UgJ251bWJlcic6XG5cdFx0XHRcdFx0cmV0ID0gbm9kZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnb2JqZWN0Jzpcblx0XHRcdFx0Ly8gbm9kZSBpcyBhbiBhcnJheSBvZiBub2Rlc1xuXHRcdFx0XHRcdHN1Ym5vZGVzID0gJC5tYXAoIG5vZGUuc2xpY2UoIDEgKSwgZnVuY3Rpb24gKCBuICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG1lc3NhZ2VQYXJzZXJFbWl0dGVyLmVtaXQoIG4sIHJlcGxhY2VtZW50cyApO1xuXHRcdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRcdG9wZXJhdGlvbiA9IG5vZGVbIDAgXS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0XHRcdFx0aWYgKCB0eXBlb2YgbWVzc2FnZVBhcnNlckVtaXR0ZXJbIG9wZXJhdGlvbiBdID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdFx0cmV0ID0gbWVzc2FnZVBhcnNlckVtaXR0ZXJbIG9wZXJhdGlvbiBdKCBzdWJub2RlcywgcmVwbGFjZW1lbnRzICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvciggJ3Vua25vd24gb3BlcmF0aW9uIFwiJyArIG9wZXJhdGlvbiArICdcIicgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAndW5kZWZpbmVkJzpcblx0XHRcdFx0Ly8gUGFyc2luZyB0aGUgZW1wdHkgc3RyaW5nIChhcyBhbiBlbnRpcmUgZXhwcmVzc2lvbiwgb3IgYXMgYVxuXHRcdFx0XHQvLyBwYXJhbUV4cHJlc3Npb24gaW4gYSB0ZW1wbGF0ZSkgcmVzdWx0cyBpbiB1bmRlZmluZWRcblx0XHRcdFx0Ly8gUGVyaGFwcyBhIG1vcmUgY2xldmVyIHBhcnNlciBjYW4gZGV0ZWN0IHRoaXMsIGFuZCByZXR1cm4gdGhlXG5cdFx0XHRcdC8vIGVtcHR5IHN0cmluZz8gT3IgaXMgdGhhdCB1c2VmdWwgaW5mb3JtYXRpb24/XG5cdFx0XHRcdC8vIFRoZSBsb2dpY2FsIHRoaW5nIGlzIHByb2JhYmx5IHRvIHJldHVybiB0aGUgZW1wdHkgc3RyaW5nIGhlcmVcblx0XHRcdFx0Ly8gd2hlbiB3ZSBlbmNvdW50ZXIgdW5kZWZpbmVkLlxuXHRcdFx0XHRcdHJldCA9ICcnO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvciggJ3VuZXhwZWN0ZWQgdHlwZSBpbiBBU1Q6ICcgKyB0eXBlb2Ygbm9kZSApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmV0O1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBQYXJzaW5nIGhhcyBiZWVuIGFwcGxpZWQgZGVwdGgtZmlyc3Qgd2UgY2FuIGFzc3VtZSB0aGF0IGFsbCBub2Rlc1xuXHRcdCAqIGhlcmUgYXJlIHNpbmdsZSBub2RlcyBNdXN0IHJldHVybiBhIHNpbmdsZSBub2RlIHRvIHBhcmVudHMgLS0gYVxuXHRcdCAqIGpRdWVyeSB3aXRoIHN5bnRoZXRpYyBzcGFuIEhvd2V2ZXIsIHVud3JhcCBhbnkgb3RoZXIgc3ludGhldGljIHNwYW5zXG5cdFx0ICogaW4gb3VyIGNoaWxkcmVuIGFuZCBwYXNzIHRoZW0gdXB3YXJkc1xuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtBcnJheX0gbm9kZXMgTWl4ZWQsIHNvbWUgc2luZ2xlIG5vZGVzLCBzb21lIGFycmF5cyBvZiBub2Rlcy5cblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0Y29uY2F0OiBmdW5jdGlvbiAoIG5vZGVzICkge1xuXHRcdFx0dmFyIHJlc3VsdCA9ICcnO1xuXG5cdFx0XHQkLmVhY2goIG5vZGVzLCBmdW5jdGlvbiAoIGksIG5vZGUgKSB7XG5cdFx0XHRcdC8vIHN0cmluZ3MsIGludGVnZXJzLCBhbnl0aGluZyBlbHNlXG5cdFx0XHRcdHJlc3VsdCArPSBub2RlO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBSZXR1cm4gZXNjYXBlZCByZXBsYWNlbWVudCBvZiBjb3JyZWN0IGluZGV4LCBvciBzdHJpbmcgaWZcblx0XHQgKiB1bmF2YWlsYWJsZS4gTm90ZSB0aGF0IHdlIGV4cGVjdCB0aGUgcGFyc2VkIHBhcmFtZXRlciB0byBiZVxuXHRcdCAqIHplcm8tYmFzZWQuIGkuZS4gJDEgc2hvdWxkIGhhdmUgYmVjb21lIFsgMCBdLiBpZiB0aGUgc3BlY2lmaWVkXG5cdFx0ICogcGFyYW1ldGVyIGlzIG5vdCBmb3VuZCByZXR1cm4gdGhlIHNhbWUgc3RyaW5nIChlLmcuIFwiJDk5XCIgLT5cblx0XHQgKiBwYXJhbWV0ZXIgOTggLT4gbm90IGZvdW5kIC0+IHJldHVybiBcIiQ5OVwiICkgVE9ETyB0aHJvdyBlcnJvciBpZlxuXHRcdCAqIG5vZGVzLmxlbmd0aCA+IDEgP1xuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtBcnJheX0gbm9kZXMgT25lIGVsZW1lbnQsIGludGVnZXIsIG4gPj0gMFxuXHRcdCAqIEBwYXJhbSB7QXJyYXl9IHJlcGxhY2VtZW50cyBmb3IgJDEsICQyLCAuLi4gJG5cblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd9IHJlcGxhY2VtZW50XG5cdFx0ICovXG5cdFx0cmVwbGFjZTogZnVuY3Rpb24gKCBub2RlcywgcmVwbGFjZW1lbnRzICkge1xuXHRcdFx0dmFyIGluZGV4ID0gcGFyc2VJbnQoIG5vZGVzWyAwIF0sIDEwICk7XG5cblx0XHRcdGlmICggaW5kZXggPCByZXBsYWNlbWVudHMubGVuZ3RoICkge1xuXHRcdFx0XHQvLyByZXBsYWNlbWVudCBpcyBub3QgYSBzdHJpbmcsIGRvbid0IHRvdWNoIVxuXHRcdFx0XHRyZXR1cm4gcmVwbGFjZW1lbnRzWyBpbmRleCBdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gaW5kZXggbm90IGZvdW5kLCBmYWxsYmFjayB0byBkaXNwbGF5aW5nIHZhcmlhYmxlXG5cdFx0XHRcdHJldHVybiAnJCcgKyAoIGluZGV4ICsgMSApO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBUcmFuc2Zvcm0gcGFyc2VkIHN0cnVjdHVyZSBpbnRvIHBsdXJhbGl6YXRpb24gbi5iLiBUaGUgZmlyc3Qgbm9kZSBtYXlcblx0XHQgKiBiZSBhIG5vbi1pbnRlZ2VyIChmb3IgaW5zdGFuY2UsIGEgc3RyaW5nIHJlcHJlc2VudGluZyBhbiBBcmFiaWNcblx0XHQgKiBudW1iZXIpLiBTbyBjb252ZXJ0IGl0IGJhY2sgd2l0aCB0aGUgY3VycmVudCBsYW5ndWFnZSdzXG5cdFx0ICogY29udmVydE51bWJlci5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7QXJyYXl9IG5vZGVzIExpc3QgWyB7U3RyaW5nfE51bWJlcn0sIHtTdHJpbmd9LCB7U3RyaW5nfSAuLi4gXVxuXHRcdCAqIEByZXR1cm4ge3N0cmluZ30gc2VsZWN0ZWQgcGx1cmFsaXplZCBmb3JtIGFjY29yZGluZyB0byBjdXJyZW50XG5cdFx0ICogIGxhbmd1YWdlLlxuXHRcdCAqL1xuXHRcdHBsdXJhbDogZnVuY3Rpb24gKCBub2RlcyApIHtcblx0XHRcdHZhciBjb3VudCA9IHBhcnNlRmxvYXQoIHRoaXMubGFuZ3VhZ2UuY29udmVydE51bWJlciggbm9kZXNbIDAgXSwgMTAgKSApLFxuXHRcdFx0XHRmb3JtcyA9IG5vZGVzLnNsaWNlKCAxICk7XG5cblx0XHRcdHJldHVybiBmb3Jtcy5sZW5ndGggPyB0aGlzLmxhbmd1YWdlLmNvbnZlcnRQbHVyYWwoIGNvdW50LCBmb3JtcyApIDogJyc7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFRyYW5zZm9ybSBwYXJzZWQgc3RydWN0dXJlIGludG8gZ2VuZGVyIFVzYWdlXG5cdFx0ICoge3tnZW5kZXI6Z2VuZGVyfG1hc2N1bGluZXxmZW1pbmluZXxuZXV0cmFsfX0uXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge0FycmF5fSBub2RlcyBMaXN0IFsge1N0cmluZ30sIHtTdHJpbmd9LCB7U3RyaW5nfSAsIHtTdHJpbmd9IF1cblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd9IHNlbGVjdGVkIGdlbmRlciBmb3JtIGFjY29yZGluZyB0byBjdXJyZW50IGxhbmd1YWdlXG5cdFx0ICovXG5cdFx0Z2VuZGVyOiBmdW5jdGlvbiAoIG5vZGVzICkge1xuXHRcdFx0dmFyIGdlbmRlciA9IG5vZGVzWyAwIF0sXG5cdFx0XHRcdGZvcm1zID0gbm9kZXMuc2xpY2UoIDEgKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMubGFuZ3VhZ2UuZ2VuZGVyKCBnZW5kZXIsIGZvcm1zICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFRyYW5zZm9ybSBwYXJzZWQgc3RydWN0dXJlIGludG8gZ3JhbW1hciBjb252ZXJzaW9uLiBJbnZva2VkIGJ5XG5cdFx0ICogcHV0dGluZyB7e2dyYW1tYXI6Zm9ybXx3b3JkfX0gaW4gYSBtZXNzYWdlXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge0FycmF5fSBub2RlcyBMaXN0IFt7R3JhbW1hciBjYXNlIGVnOiBnZW5pdGl2ZX0sIHtTdHJpbmcgd29yZH1dXG5cdFx0ICogQHJldHVybiB7c3RyaW5nfSBzZWxlY3RlZCBncmFtbWF0aWNhbCBmb3JtIGFjY29yZGluZyB0byBjdXJyZW50XG5cdFx0ICogIGxhbmd1YWdlLlxuXHRcdCAqL1xuXHRcdGdyYW1tYXI6IGZ1bmN0aW9uICggbm9kZXMgKSB7XG5cdFx0XHR2YXIgZm9ybSA9IG5vZGVzWyAwIF0sXG5cdFx0XHRcdHdvcmQgPSBub2Rlc1sgMSBdO1xuXG5cdFx0XHRyZXR1cm4gd29yZCAmJiBmb3JtICYmIHRoaXMubGFuZ3VhZ2UuY29udmVydEdyYW1tYXIoIHdvcmQsIGZvcm0gKTtcblx0XHR9XG5cdH07XG5cblx0JC5leHRlbmQoICQuaTE4bi5wYXJzZXIuZW1pdHRlciwgbmV3IE1lc3NhZ2VQYXJzZXJFbWl0dGVyKCkgKTtcbn0oIGpRdWVyeSApICk7XG4iLCIvKiFcbiAqIGpRdWVyeSBJbnRlcm5hdGlvbmFsaXphdGlvbiBsaWJyYXJ5XG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDEyIFNhbnRob3NoIFRob3R0aW5nYWxcbiAqXG4gKiBqcXVlcnkuaTE4biBpcyBkdWFsIGxpY2Vuc2VkIEdQTHYyIG9yIGxhdGVyIGFuZCBNSVQuIFlvdSBkb24ndCBoYXZlIHRvIGRvIGFueXRoaW5nIHNwZWNpYWwgdG9cbiAqIGNob29zZSBvbmUgbGljZW5zZSBvciB0aGUgb3RoZXIgYW5kIHlvdSBkb24ndCBoYXZlIHRvIG5vdGlmeSBhbnlvbmUgd2hpY2ggbGljZW5zZSB5b3UgYXJlIHVzaW5nLlxuICogWW91IGFyZSBmcmVlIHRvIHVzZSBVbml2ZXJzYWxMYW5ndWFnZVNlbGVjdG9yIGluIGNvbW1lcmNpYWwgcHJvamVjdHMgYXMgbG9uZyBhcyB0aGUgY29weXJpZ2h0XG4gKiBoZWFkZXIgaXMgbGVmdCBpbnRhY3QuIFNlZSBmaWxlcyBHUEwtTElDRU5TRSBhbmQgTUlULUxJQ0VOU0UgZm9yIGRldGFpbHMuXG4gKlxuICogQGxpY2VuY2UgR05VIEdlbmVyYWwgUHVibGljIExpY2VuY2UgMi4wIG9yIGxhdGVyXG4gKiBAbGljZW5jZSBNSVQgTGljZW5zZVxuICovXG4oIGZ1bmN0aW9uICggJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdCQuaTE4biA9ICQuaTE4biB8fCB7fTtcblx0JC5leHRlbmQoICQuaTE4bi5mYWxsYmFja3MsIHtcblx0XHRhYjogWyAncnUnIF0sXG5cdFx0YWNlOiBbICdpZCcgXSxcblx0XHRhbG46IFsgJ3NxJyBdLFxuXHRcdC8vIE5vdCBzbyBzdGFuZGFyZCAtIGFscyBpcyBzdXBwb3NlZCB0byBiZSBUb3NrIEFsYmFuaWFuLFxuXHRcdC8vIGJ1dCBpbiBXaWtpcGVkaWEgaXQncyB1c2VkIGZvciBhIEdlcm1hbmljIGxhbmd1YWdlLlxuXHRcdGFsczogWyAnZ3N3JywgJ2RlJyBdLFxuXHRcdGFuOiBbICdlcycgXSxcblx0XHRhbnA6IFsgJ2hpJyBdLFxuXHRcdGFybjogWyAnZXMnIF0sXG5cdFx0YXJ6OiBbICdhcicgXSxcblx0XHRhdjogWyAncnUnIF0sXG5cdFx0YXk6IFsgJ2VzJyBdLFxuXHRcdGJhOiBbICdydScgXSxcblx0XHRiYXI6IFsgJ2RlJyBdLFxuXHRcdCdiYXQtc21nJzogWyAnc2dzJywgJ2x0JyBdLFxuXHRcdGJjYzogWyAnZmEnIF0sXG5cdFx0J2JlLXgtb2xkJzogWyAnYmUtdGFyYXNrJyBdLFxuXHRcdGJoOiBbICdiaG8nIF0sXG5cdFx0YmpuOiBbICdpZCcgXSxcblx0XHRibTogWyAnZnInIF0sXG5cdFx0YnB5OiBbICdibicgXSxcblx0XHRicWk6IFsgJ2ZhJyBdLFxuXHRcdGJ1ZzogWyAnaWQnIF0sXG5cdFx0J2Niay16YW0nOiBbICdlcycgXSxcblx0XHRjZTogWyAncnUnIF0sXG5cdFx0Y3JoOiBbICdjcmgtbGF0bicgXSxcblx0XHQnY3JoLWN5cmwnOiBbICdydScgXSxcblx0XHRjc2I6IFsgJ3BsJyBdLFxuXHRcdGN2OiBbICdydScgXSxcblx0XHQnZGUtYXQnOiBbICdkZScgXSxcblx0XHQnZGUtY2gnOiBbICdkZScgXSxcblx0XHQnZGUtZm9ybWFsJzogWyAnZGUnIF0sXG5cdFx0ZHNiOiBbICdkZScgXSxcblx0XHRkdHA6IFsgJ21zJyBdLFxuXHRcdGVnbDogWyAnaXQnIF0sXG5cdFx0ZW1sOiBbICdpdCcgXSxcblx0XHRmZjogWyAnZnInIF0sXG5cdFx0Zml0OiBbICdmaScgXSxcblx0XHQnZml1LXZybyc6IFsgJ3ZybycsICdldCcgXSxcblx0XHRmcmM6IFsgJ2ZyJyBdLFxuXHRcdGZycDogWyAnZnInIF0sXG5cdFx0ZnJyOiBbICdkZScgXSxcblx0XHRmdXI6IFsgJ2l0JyBdLFxuXHRcdGdhZzogWyAndHInIF0sXG5cdFx0Z2FuOiBbICdnYW4taGFudCcsICd6aC1oYW50JywgJ3poLWhhbnMnIF0sXG5cdFx0J2dhbi1oYW5zJzogWyAnemgtaGFucycgXSxcblx0XHQnZ2FuLWhhbnQnOiBbICd6aC1oYW50JywgJ3poLWhhbnMnIF0sXG5cdFx0Z2w6IFsgJ3B0JyBdLFxuXHRcdGdsazogWyAnZmEnIF0sXG5cdFx0Z246IFsgJ2VzJyBdLFxuXHRcdGdzdzogWyAnZGUnIF0sXG5cdFx0aGlmOiBbICdoaWYtbGF0bicgXSxcblx0XHRoc2I6IFsgJ2RlJyBdLFxuXHRcdGh0OiBbICdmcicgXSxcblx0XHRpaTogWyAnemgtY24nLCAnemgtaGFucycgXSxcblx0XHRpbmg6IFsgJ3J1JyBdLFxuXHRcdGl1OiBbICdpa2UtY2FucycgXSxcblx0XHRqdXQ6IFsgJ2RhJyBdLFxuXHRcdGp2OiBbICdpZCcgXSxcblx0XHRrYWE6IFsgJ2trLWxhdG4nLCAna2stY3lybCcgXSxcblx0XHRrYmQ6IFsgJ2tiZC1jeXJsJyBdLFxuXHRcdGtodzogWyAndXInIF0sXG5cdFx0a2l1OiBbICd0cicgXSxcblx0XHRrazogWyAna2stY3lybCcgXSxcblx0XHQna2stYXJhYic6IFsgJ2trLWN5cmwnIF0sXG5cdFx0J2trLWxhdG4nOiBbICdray1jeXJsJyBdLFxuXHRcdCdray1jbic6IFsgJ2trLWFyYWInLCAna2stY3lybCcgXSxcblx0XHQna2sta3onOiBbICdray1jeXJsJyBdLFxuXHRcdCdray10cic6IFsgJ2trLWxhdG4nLCAna2stY3lybCcgXSxcblx0XHRrbDogWyAnZGEnIF0sXG5cdFx0J2tvLWtwJzogWyAna28nIF0sXG5cdFx0a29pOiBbICdydScgXSxcblx0XHRrcmM6IFsgJ3J1JyBdLFxuXHRcdGtzOiBbICdrcy1hcmFiJyBdLFxuXHRcdGtzaDogWyAnZGUnIF0sXG5cdFx0a3U6IFsgJ2t1LWxhdG4nIF0sXG5cdFx0J2t1LWFyYWInOiBbICdja2InIF0sXG5cdFx0a3Y6IFsgJ3J1JyBdLFxuXHRcdGxhZDogWyAnZXMnIF0sXG5cdFx0bGI6IFsgJ2RlJyBdLFxuXHRcdGxiZTogWyAncnUnIF0sXG5cdFx0bGV6OiBbICdydScgXSxcblx0XHRsaTogWyAnbmwnIF0sXG5cdFx0bGlqOiBbICdpdCcgXSxcblx0XHRsaXY6IFsgJ2V0JyBdLFxuXHRcdGxtbzogWyAnaXQnIF0sXG5cdFx0bG46IFsgJ2ZyJyBdLFxuXHRcdGx0ZzogWyAnbHYnIF0sXG5cdFx0bHp6OiBbICd0cicgXSxcblx0XHRtYWk6IFsgJ2hpJyBdLFxuXHRcdCdtYXAtYm1zJzogWyAnanYnLCAnaWQnIF0sXG5cdFx0bWc6IFsgJ2ZyJyBdLFxuXHRcdG1ocjogWyAncnUnIF0sXG5cdFx0bWluOiBbICdpZCcgXSxcblx0XHRtbzogWyAncm8nIF0sXG5cdFx0bXJqOiBbICdydScgXSxcblx0XHRtd2w6IFsgJ3B0JyBdLFxuXHRcdG15djogWyAncnUnIF0sXG5cdFx0bXpuOiBbICdmYScgXSxcblx0XHRuYWg6IFsgJ2VzJyBdLFxuXHRcdG5hcDogWyAnaXQnIF0sXG5cdFx0bmRzOiBbICdkZScgXSxcblx0XHQnbmRzLW5sJzogWyAnbmwnIF0sXG5cdFx0J25sLWluZm9ybWFsJzogWyAnbmwnIF0sXG5cdFx0bm86IFsgJ25iJyBdLFxuXHRcdG9zOiBbICdydScgXSxcblx0XHRwY2Q6IFsgJ2ZyJyBdLFxuXHRcdHBkYzogWyAnZGUnIF0sXG5cdFx0cGR0OiBbICdkZScgXSxcblx0XHRwZmw6IFsgJ2RlJyBdLFxuXHRcdHBtczogWyAnaXQnIF0sXG5cdFx0cHQ6IFsgJ3B0LWJyJyBdLFxuXHRcdCdwdC1icic6IFsgJ3B0JyBdLFxuXHRcdHF1OiBbICdlcycgXSxcblx0XHRxdWc6IFsgJ3F1JywgJ2VzJyBdLFxuXHRcdHJnbjogWyAnaXQnIF0sXG5cdFx0cm15OiBbICdybycgXSxcblx0XHQncm9hLXJ1cCc6IFsgJ3J1cCcgXSxcblx0XHRydWU6IFsgJ3VrJywgJ3J1JyBdLFxuXHRcdHJ1cTogWyAncnVxLWxhdG4nLCAncm8nIF0sXG5cdFx0J3J1cS1jeXJsJzogWyAnbWsnIF0sXG5cdFx0J3J1cS1sYXRuJzogWyAncm8nIF0sXG5cdFx0c2E6IFsgJ2hpJyBdLFxuXHRcdHNhaDogWyAncnUnIF0sXG5cdFx0c2NuOiBbICdpdCcgXSxcblx0XHRzZzogWyAnZnInIF0sXG5cdFx0c2dzOiBbICdsdCcgXSxcblx0XHRzbGk6IFsgJ2RlJyBdLFxuXHRcdHNyOiBbICdzci1lYycgXSxcblx0XHRzcm46IFsgJ25sJyBdLFxuXHRcdHN0cTogWyAnZGUnIF0sXG5cdFx0c3U6IFsgJ2lkJyBdLFxuXHRcdHN6bDogWyAncGwnIF0sXG5cdFx0dGN5OiBbICdrbicgXSxcblx0XHR0ZzogWyAndGctY3lybCcgXSxcblx0XHR0dDogWyAndHQtY3lybCcsICdydScgXSxcblx0XHQndHQtY3lybCc6IFsgJ3J1JyBdLFxuXHRcdHR5OiBbICdmcicgXSxcblx0XHR1ZG06IFsgJ3J1JyBdLFxuXHRcdHVnOiBbICd1Zy1hcmFiJyBdLFxuXHRcdHVrOiBbICdydScgXSxcblx0XHR2ZWM6IFsgJ2l0JyBdLFxuXHRcdHZlcDogWyAnZXQnIF0sXG5cdFx0dmxzOiBbICdubCcgXSxcblx0XHR2bWY6IFsgJ2RlJyBdLFxuXHRcdHZvdDogWyAnZmknIF0sXG5cdFx0dnJvOiBbICdldCcgXSxcblx0XHR3YTogWyAnZnInIF0sXG5cdFx0d286IFsgJ2ZyJyBdLFxuXHRcdHd1dTogWyAnemgtaGFucycgXSxcblx0XHR4YWw6IFsgJ3J1JyBdLFxuXHRcdHhtZjogWyAna2EnIF0sXG5cdFx0eWk6IFsgJ2hlJyBdLFxuXHRcdHphOiBbICd6aC1oYW5zJyBdLFxuXHRcdHplYTogWyAnbmwnIF0sXG5cdFx0emg6IFsgJ3poLWhhbnMnIF0sXG5cdFx0J3poLWNsYXNzaWNhbCc6IFsgJ2x6aCcgXSxcblx0XHQnemgtY24nOiBbICd6aC1oYW5zJyBdLFxuXHRcdCd6aC1oYW50JzogWyAnemgtaGFucycgXSxcblx0XHQnemgtaGsnOiBbICd6aC1oYW50JywgJ3poLWhhbnMnIF0sXG5cdFx0J3poLW1pbi1uYW4nOiBbICduYW4nIF0sXG5cdFx0J3poLW1vJzogWyAnemgtaGsnLCAnemgtaGFudCcsICd6aC1oYW5zJyBdLFxuXHRcdCd6aC1teSc6IFsgJ3poLXNnJywgJ3poLWhhbnMnIF0sXG5cdFx0J3poLXNnJzogWyAnemgtaGFucycgXSxcblx0XHQnemgtdHcnOiBbICd6aC1oYW50JywgJ3poLWhhbnMnIF0sXG5cdFx0J3poLXl1ZSc6IFsgJ3l1ZScgXVxuXHR9ICk7XG59KCBqUXVlcnkgKSApO1xuIiwiLyohXG4gKiBqUXVlcnkgSW50ZXJuYXRpb25hbGl6YXRpb24gbGlicmFyeVxuICpcbiAqIENvcHlyaWdodCAoQykgMjAxMiBTYW50aG9zaCBUaG90dGluZ2FsXG4gKlxuICoganF1ZXJ5LmkxOG4gaXMgZHVhbCBsaWNlbnNlZCBHUEx2MiBvciBsYXRlciBhbmQgTUlULiBZb3UgZG9uJ3QgaGF2ZSB0byBkb1xuICogYW55dGhpbmcgc3BlY2lhbCB0byBjaG9vc2Ugb25lIGxpY2Vuc2Ugb3IgdGhlIG90aGVyIGFuZCB5b3UgZG9uJ3QgaGF2ZSB0b1xuICogbm90aWZ5IGFueW9uZSB3aGljaCBsaWNlbnNlIHlvdSBhcmUgdXNpbmcuIFlvdSBhcmUgZnJlZSB0byB1c2VcbiAqIFVuaXZlcnNhbExhbmd1YWdlU2VsZWN0b3IgaW4gY29tbWVyY2lhbCBwcm9qZWN0cyBhcyBsb25nIGFzIHRoZSBjb3B5cmlnaHRcbiAqIGhlYWRlciBpcyBsZWZ0IGludGFjdC4gU2VlIGZpbGVzIEdQTC1MSUNFTlNFIGFuZCBNSVQtTElDRU5TRSBmb3IgZGV0YWlscy5cbiAqXG4gKiBAbGljZW5jZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5jZSAyLjAgb3IgbGF0ZXJcbiAqIEBsaWNlbmNlIE1JVCBMaWNlbnNlXG4gKi9cblxuKCBmdW5jdGlvbiAoICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgSTE4Tixcblx0XHRzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblx0LyoqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuXHQgKi9cblx0STE4TiA9IGZ1bmN0aW9uICggb3B0aW9ucyApIHtcblx0XHQvLyBMb2FkIGRlZmF1bHRzXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoIHt9LCBJMThOLmRlZmF1bHRzLCBvcHRpb25zICk7XG5cblx0XHR0aGlzLnBhcnNlciA9IHRoaXMub3B0aW9ucy5wYXJzZXI7XG5cdFx0dGhpcy5sb2NhbGUgPSB0aGlzLm9wdGlvbnMubG9jYWxlO1xuXHRcdHRoaXMubWVzc2FnZVN0b3JlID0gdGhpcy5vcHRpb25zLm1lc3NhZ2VTdG9yZTtcblx0XHR0aGlzLmxhbmd1YWdlcyA9IHt9O1xuXHR9O1xuXG5cdEkxOE4ucHJvdG90eXBlID0ge1xuXHRcdC8qKlxuXHRcdCAqIExvY2FsaXplIGEgZ2l2ZW4gbWVzc2FnZUtleSB0byBhIGxvY2FsZS5cblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZUtleVxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ30gTG9jYWxpemVkIG1lc3NhZ2Vcblx0XHQgKi9cblx0XHRsb2NhbGl6ZTogZnVuY3Rpb24gKCBtZXNzYWdlS2V5ICkge1xuXHRcdFx0dmFyIGxvY2FsZVBhcnRzLCBsb2NhbGVQYXJ0SW5kZXgsIGxvY2FsZSwgZmFsbGJhY2tJbmRleCxcblx0XHRcdFx0dHJ5aW5nTG9jYWxlLCBtZXNzYWdlO1xuXG5cdFx0XHRsb2NhbGUgPSB0aGlzLmxvY2FsZTtcblx0XHRcdGZhbGxiYWNrSW5kZXggPSAwO1xuXG5cdFx0XHR3aGlsZSAoIGxvY2FsZSApIHtcblx0XHRcdFx0Ly8gSXRlcmF0ZSB0aHJvdWdoIGxvY2FsZXMgc3RhcnRpbmcgYXQgbW9zdC1zcGVjaWZpYyB1bnRpbFxuXHRcdFx0XHQvLyBsb2NhbGl6YXRpb24gaXMgZm91bmQuIEFzIGluIGZpLUxhdG4tRkksIGZpLUxhdG4gYW5kIGZpLlxuXHRcdFx0XHRsb2NhbGVQYXJ0cyA9IGxvY2FsZS5zcGxpdCggJy0nICk7XG5cdFx0XHRcdGxvY2FsZVBhcnRJbmRleCA9IGxvY2FsZVBhcnRzLmxlbmd0aDtcblxuXHRcdFx0XHRkbyB7XG5cdFx0XHRcdFx0dHJ5aW5nTG9jYWxlID0gbG9jYWxlUGFydHMuc2xpY2UoIDAsIGxvY2FsZVBhcnRJbmRleCApLmpvaW4oICctJyApO1xuXHRcdFx0XHRcdG1lc3NhZ2UgPSB0aGlzLm1lc3NhZ2VTdG9yZS5nZXQoIHRyeWluZ0xvY2FsZSwgbWVzc2FnZUtleSApO1xuXG5cdFx0XHRcdFx0aWYgKCBtZXNzYWdlICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG1lc3NhZ2U7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bG9jYWxlUGFydEluZGV4LS07XG5cdFx0XHRcdH0gd2hpbGUgKCBsb2NhbGVQYXJ0SW5kZXggKTtcblxuXHRcdFx0XHRpZiAoIGxvY2FsZSA9PT0gJ2VuJyApIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxvY2FsZSA9ICggJC5pMThuLmZhbGxiYWNrc1sgdGhpcy5sb2NhbGUgXSAmJlxuXHRcdFx0XHRcdFx0JC5pMThuLmZhbGxiYWNrc1sgdGhpcy5sb2NhbGUgXVsgZmFsbGJhY2tJbmRleCBdICkgfHxcblx0XHRcdFx0XHRcdHRoaXMub3B0aW9ucy5mYWxsYmFja0xvY2FsZTtcblx0XHRcdFx0JC5pMThuLmxvZyggJ1RyeWluZyBmYWxsYmFjayBsb2NhbGUgZm9yICcgKyB0aGlzLmxvY2FsZSArICc6ICcgKyBsb2NhbGUgKyAnICgnICsgbWVzc2FnZUtleSArICcpJyApO1xuXG5cdFx0XHRcdGZhbGxiYWNrSW5kZXgrKztcblx0XHRcdH1cblxuXHRcdFx0Ly8ga2V5IG5vdCBmb3VuZFxuXHRcdFx0cmV0dXJuICcnO1xuXHRcdH0sXG5cblx0XHQvKlxuXHRcdCAqIERlc3Ryb3kgdGhlIGkxOG4gaW5zdGFuY2UuXG5cdFx0ICovXG5cdFx0ZGVzdHJveTogZnVuY3Rpb24gKCkge1xuXHRcdFx0JC5yZW1vdmVEYXRhKCBkb2N1bWVudCwgJ2kxOG4nICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEdlbmVyYWwgbWVzc2FnZSBsb2FkaW5nIEFQSSBUaGlzIGNhbiB0YWtlIGEgVVJMIHN0cmluZyBmb3Jcblx0XHQgKiB0aGUganNvbiBmb3JtYXR0ZWQgbWVzc2FnZXMuIEV4YW1wbGU6XG5cdFx0ICogPGNvZGU+bG9hZCgncGF0aC90by9hbGxfbG9jYWxpemF0aW9ucy5qc29uJyk7PC9jb2RlPlxuXHRcdCAqXG5cdFx0ICogVG8gbG9hZCBhIGxvY2FsaXphdGlvbiBmaWxlIGZvciBhIGxvY2FsZTpcblx0XHQgKiA8Y29kZT5cblx0XHQgKiBsb2FkKCdwYXRoL3RvL2RlLW1lc3NhZ2VzLmpzb24nLCAnZGUnICk7XG5cdFx0ICogPC9jb2RlPlxuXHRcdCAqXG5cdFx0ICogVG8gbG9hZCBhIGxvY2FsaXphdGlvbiBmaWxlIGZyb20gYSBkaXJlY3Rvcnk6XG5cdFx0ICogPGNvZGU+XG5cdFx0ICogbG9hZCgncGF0aC90by9pMThuL2RpcmVjdG9yeScsICdkZScgKTtcblx0XHQgKiA8L2NvZGU+XG5cdFx0ICogVGhlIGFib3ZlIG1ldGhvZCBoYXMgdGhlIGFkdmFudGFnZSBvZiBmYWxsYmFjayByZXNvbHV0aW9uLlxuXHRcdCAqIGllLCBpdCB3aWxsIGF1dG9tYXRpY2FsbHkgbG9hZCB0aGUgZmFsbGJhY2sgbG9jYWxlcyBmb3IgZGUuXG5cdFx0ICogRm9yIG1vc3QgdXNlY2FzZXMsIHRoaXMgaXMgdGhlIHJlY29tbWVuZGVkIG1ldGhvZC5cblx0XHQgKiBJdCBpcyBvcHRpb25hbCB0byBoYXZlIHRyYWlsaW5nIHNsYXNoIGF0IGVuZC5cblx0XHQgKlxuXHRcdCAqIEEgZGF0YSBvYmplY3QgY29udGFpbmluZyBtZXNzYWdlIGtleS0gbWVzc2FnZSB0cmFuc2xhdGlvbiBtYXBwaW5nc1xuXHRcdCAqIGNhbiBhbHNvIGJlIHBhc3NlZC4gRXhhbXBsZTpcblx0XHQgKiA8Y29kZT5cblx0XHQgKiBsb2FkKCB7ICdoZWxsbycgOiAnSGVsbG8nIH0sIG9wdGlvbmFsTG9jYWxlICk7XG5cdFx0ICogPC9jb2RlPlxuXHRcdCAqXG5cdFx0ICogQSBzb3VyY2UgbWFwIGNvbnRhaW5pbmcga2V5LXZhbHVlIHBhaXIgb2YgbGFuZ3VhZ2VuYW1lIGFuZCBsb2NhdGlvbnNcblx0XHQgKiBjYW4gYWxzbyBiZSBwYXNzZWQuIEV4YW1wbGU6XG5cdFx0ICogPGNvZGU+XG5cdFx0ICogbG9hZCgge1xuXHRcdCAqIGJuOiAnaTE4bi9ibi5qc29uJyxcblx0XHQgKiBoZTogJ2kxOG4vaGUuanNvbicsXG5cdFx0ICogZW46ICdpMThuL2VuLmpzb24nXG5cdFx0ICogfSApXG5cdFx0ICogPC9jb2RlPlxuXHRcdCAqXG5cdFx0ICogSWYgdGhlIGRhdGEgYXJndW1lbnQgaXMgbnVsbC91bmRlZmluZWQvZmFsc2UsXG5cdFx0ICogYWxsIGNhY2hlZCBtZXNzYWdlcyBmb3IgdGhlIGkxOG4gaW5zdGFuY2Ugd2lsbCBnZXQgcmVzZXQuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ3xPYmplY3R9IHNvdXJjZVxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhbGUgTGFuZ3VhZ2UgdGFnXG5cdFx0ICogQHJldHVybiB7alF1ZXJ5LlByb21pc2V9XG5cdFx0ICovXG5cdFx0bG9hZDogZnVuY3Rpb24gKCBzb3VyY2UsIGxvY2FsZSApIHtcblx0XHRcdHZhciBmYWxsYmFja0xvY2FsZXMsIGxvY0luZGV4LCBmYWxsYmFja0xvY2FsZSwgc291cmNlTWFwID0ge307XG5cdFx0XHRpZiAoICFzb3VyY2UgJiYgIWxvY2FsZSApIHtcblx0XHRcdFx0c291cmNlID0gJ2kxOG4vJyArICQuaTE4bigpLmxvY2FsZSArICcuanNvbic7XG5cdFx0XHRcdGxvY2FsZSA9ICQuaTE4bigpLmxvY2FsZTtcblx0XHRcdH1cblx0XHRcdGlmICggdHlwZW9mIHNvdXJjZSA9PT0gJ3N0cmluZycgJiZcblx0XHRcdFx0Ly8gc291cmNlIGV4dGVuc2lvbiBzaG91bGQgYmUganNvbiwgYnV0IGNhbiBoYXZlIHF1ZXJ5IHBhcmFtcyBhZnRlciB0aGF0LlxuXHRcdFx0XHRzb3VyY2Uuc3BsaXQoICc/JyApWyAwIF0uc3BsaXQoICcuJyApLnBvcCgpICE9PSAnanNvbidcblx0XHRcdCkge1xuXHRcdFx0XHQvLyBMb2FkIHNwZWNpZmllZCBsb2NhbGUgdGhlbiBjaGVjayBmb3IgZmFsbGJhY2tzIHdoZW4gZGlyZWN0b3J5IGlzXG5cdFx0XHRcdC8vIHNwZWNpZmllZCBpbiBsb2FkKClcblx0XHRcdFx0c291cmNlTWFwWyBsb2NhbGUgXSA9IHNvdXJjZSArICcvJyArIGxvY2FsZSArICcuanNvbic7XG5cdFx0XHRcdGZhbGxiYWNrTG9jYWxlcyA9ICggJC5pMThuLmZhbGxiYWNrc1sgbG9jYWxlIF0gfHwgW10gKVxuXHRcdFx0XHRcdC5jb25jYXQoIHRoaXMub3B0aW9ucy5mYWxsYmFja0xvY2FsZSApO1xuXHRcdFx0XHRmb3IgKCBsb2NJbmRleCA9IDA7IGxvY0luZGV4IDwgZmFsbGJhY2tMb2NhbGVzLmxlbmd0aDsgbG9jSW5kZXgrKyApIHtcblx0XHRcdFx0XHRmYWxsYmFja0xvY2FsZSA9IGZhbGxiYWNrTG9jYWxlc1sgbG9jSW5kZXggXTtcblx0XHRcdFx0XHRzb3VyY2VNYXBbIGZhbGxiYWNrTG9jYWxlIF0gPSBzb3VyY2UgKyAnLycgKyBmYWxsYmFja0xvY2FsZSArICcuanNvbic7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMubG9hZCggc291cmNlTWFwICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5tZXNzYWdlU3RvcmUubG9hZCggc291cmNlLCBsb2NhbGUgKTtcblx0XHRcdH1cblxuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBEb2VzIHBhcmFtZXRlciBhbmQgbWFnaWMgd29yZCBzdWJzdGl0dXRpb24uXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30ga2V5IE1lc3NhZ2Uga2V5XG5cdFx0ICogQHBhcmFtIHtBcnJheX0gcGFyYW1ldGVycyBNZXNzYWdlIHBhcmFtZXRlcnNcblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0cGFyc2U6IGZ1bmN0aW9uICgga2V5LCBwYXJhbWV0ZXJzICkge1xuXHRcdFx0dmFyIG1lc3NhZ2UgPSB0aGlzLmxvY2FsaXplKCBrZXkgKTtcblx0XHRcdC8vIEZJWE1FOiBUaGlzIGNoYW5nZXMgdGhlIHN0YXRlIG9mIHRoZSBJMThOIG9iamVjdCxcblx0XHRcdC8vIHNob3VsZCBwcm9iYWJseSBub3QgY2hhbmdlIHRoZSAndGhpcy5wYXJzZXInIGJ1dCBqdXN0XG5cdFx0XHQvLyBwYXNzIGl0IHRvIHRoZSBwYXJzZXIuXG5cdFx0XHR0aGlzLnBhcnNlci5sYW5ndWFnZSA9ICQuaTE4bi5sYW5ndWFnZXNbICQuaTE4bigpLmxvY2FsZSBdIHx8ICQuaTE4bi5sYW5ndWFnZXNbICdkZWZhdWx0JyBdO1xuXHRcdFx0aWYgKCBtZXNzYWdlID09PSAnJyApIHtcblx0XHRcdFx0bWVzc2FnZSA9IGtleTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLnBhcnNlci5wYXJzZSggbWVzc2FnZSwgcGFyYW1ldGVycyApO1xuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogUHJvY2VzcyBhIG1lc3NhZ2UgZnJvbSB0aGUgJC5JMThOIGluc3RhbmNlXG5cdCAqIGZvciB0aGUgY3VycmVudCBkb2N1bWVudCwgc3RvcmVkIGluIGpRdWVyeS5kYXRhKGRvY3VtZW50KS5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGtleSBLZXkgb2YgdGhlIG1lc3NhZ2UuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbTEgW3BhcmFtLi4uXSBWYXJpYWRpYyBsaXN0IG9mIHBhcmFtZXRlcnMgZm9yIHtrZXl9LlxuXHQgKiBAcmV0dXJuIHtzdHJpbmd8JC5JMThOfSBQYXJzZWQgbWVzc2FnZSwgb3IgaWYgbm8ga2V5IHdhcyBnaXZlblxuXHQgKiB0aGUgaW5zdGFuY2Ugb2YgJC5JMThOIGlzIHJldHVybmVkLlxuXHQgKi9cblx0JC5pMThuID0gZnVuY3Rpb24gKCBrZXksIHBhcmFtMSApIHtcblx0XHR2YXIgcGFyYW1ldGVycyxcblx0XHRcdGkxOG4gPSAkLmRhdGEoIGRvY3VtZW50LCAnaTE4bicgKSxcblx0XHRcdG9wdGlvbnMgPSB0eXBlb2Yga2V5ID09PSAnb2JqZWN0JyAmJiBrZXk7XG5cblx0XHQvLyBJZiB0aGUgbG9jYWxlIG9wdGlvbiBmb3IgdGhpcyBjYWxsIGlzIGRpZmZlcmVudCB0aGVuIHRoZSBzZXR1cCBzbyBmYXIsXG5cdFx0Ly8gdXBkYXRlIGl0IGF1dG9tYXRpY2FsbHkuIFRoaXMgZG9lc24ndCBqdXN0IGNoYW5nZSB0aGUgY29udGV4dCBmb3IgdGhpc1xuXHRcdC8vIGNhbGwgYnV0IGZvciBhbGwgZnV0dXJlIGNhbGwgYXMgd2VsbC5cblx0XHQvLyBJZiB0aGVyZSBpcyBubyBpMThuIHNldHVwIHlldCwgZG9uJ3QgZG8gdGhpcy4gSXQgd2lsbCBiZSB0YWtlbiBjYXJlIG9mXG5cdFx0Ly8gYnkgdGhlIGBuZXcgSTE4TmAgY29uc3RydWN0aW9uIGJlbG93LlxuXHRcdC8vIE5PVEU6IEl0IHNob3VsZCBvbmx5IGNoYW5nZSBsYW5ndWFnZSBmb3IgdGhpcyBvbmUgY2FsbC5cblx0XHQvLyBUaGVuIGNhY2hlIGluc3RhbmNlcyBvZiBJMThOIHNvbWV3aGVyZS5cblx0XHRpZiAoIG9wdGlvbnMgJiYgb3B0aW9ucy5sb2NhbGUgJiYgaTE4biAmJiBpMThuLmxvY2FsZSAhPT0gb3B0aW9ucy5sb2NhbGUgKSB7XG5cdFx0XHRpMThuLmxvY2FsZSA9IG9wdGlvbnMubG9jYWxlO1xuXHRcdH1cblxuXHRcdGlmICggIWkxOG4gKSB7XG5cdFx0XHRpMThuID0gbmV3IEkxOE4oIG9wdGlvbnMgKTtcblx0XHRcdCQuZGF0YSggZG9jdW1lbnQsICdpMThuJywgaTE4biApO1xuXHRcdH1cblxuXHRcdGlmICggdHlwZW9mIGtleSA9PT0gJ3N0cmluZycgKSB7XG5cdFx0XHRpZiAoIHBhcmFtMSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRwYXJhbWV0ZXJzID0gc2xpY2UuY2FsbCggYXJndW1lbnRzLCAxICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwYXJhbWV0ZXJzID0gW107XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBpMThuLnBhcnNlKCBrZXksIHBhcmFtZXRlcnMgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gRklYTUU6IHJlbW92ZSB0aGlzIGZlYXR1cmUvYnVnLlxuXHRcdFx0cmV0dXJuIGkxOG47XG5cdFx0fVxuXHR9O1xuXG5cdCQuZm4uaTE4biA9IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgaTE4biA9ICQuZGF0YSggZG9jdW1lbnQsICdpMThuJyApO1xuXG5cdFx0aWYgKCAhaTE4biApIHtcblx0XHRcdGkxOG4gPSBuZXcgSTE4TigpO1xuXHRcdFx0JC5kYXRhKCBkb2N1bWVudCwgJ2kxOG4nLCBpMThuICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyICR0aGlzID0gJCggdGhpcyApLFxuXHRcdFx0XHRtZXNzYWdlS2V5ID0gJHRoaXMuZGF0YSggJ2kxOG4nICksXG5cdFx0XHRcdGxCcmFja2V0LCByQnJhY2tldCwgdHlwZSwga2V5O1xuXG5cdFx0XHRpZiAoIG1lc3NhZ2VLZXkgKSB7XG5cdFx0XHRcdGxCcmFja2V0ID0gbWVzc2FnZUtleS5pbmRleE9mKCAnWycgKTtcblx0XHRcdFx0ckJyYWNrZXQgPSBtZXNzYWdlS2V5LmluZGV4T2YoICddJyApO1xuXHRcdFx0XHRpZiAoIGxCcmFja2V0ICE9PSAtMSAmJiByQnJhY2tldCAhPT0gLTEgJiYgbEJyYWNrZXQgPCByQnJhY2tldCApIHtcblx0XHRcdFx0XHR0eXBlID0gbWVzc2FnZUtleS5zbGljZSggbEJyYWNrZXQgKyAxLCByQnJhY2tldCApO1xuXHRcdFx0XHRcdGtleSA9IG1lc3NhZ2VLZXkuc2xpY2UoIHJCcmFja2V0ICsgMSApO1xuXHRcdFx0XHRcdGlmICggdHlwZSA9PT0gJ2h0bWwnICkge1xuXHRcdFx0XHRcdFx0JHRoaXMuaHRtbCggaTE4bi5wYXJzZSgga2V5ICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JHRoaXMuYXR0ciggdHlwZSwgaTE4bi5wYXJzZSgga2V5ICkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHRoaXMudGV4dCggaTE4bi5wYXJzZSggbWVzc2FnZUtleSApICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCR0aGlzLmZpbmQoICdbZGF0YS1pMThuXScgKS5pMThuKCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGdldERlZmF1bHRMb2NhbGUoKSB7XG5cdFx0dmFyIG5hdiwgbG9jYWxlID0gJCggJ2h0bWwnICkuYXR0ciggJ2xhbmcnICk7XG5cblx0XHRpZiAoICFsb2NhbGUgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiB3aW5kb3cubmF2aWdhdG9yICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdG5hdiA9IHdpbmRvdy5uYXZpZ2F0b3I7XG5cdFx0XHRcdGxvY2FsZSA9IG5hdi5sYW5ndWFnZSB8fCBuYXYudXNlckxhbmd1YWdlIHx8ICcnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bG9jYWxlID0gJyc7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBsb2NhbGU7XG5cdH1cblxuXHQkLmkxOG4ubGFuZ3VhZ2VzID0ge307XG5cdCQuaTE4bi5tZXNzYWdlU3RvcmUgPSAkLmkxOG4ubWVzc2FnZVN0b3JlIHx8IHt9O1xuXHQkLmkxOG4ucGFyc2VyID0ge1xuXHRcdC8vIFRoZSBkZWZhdWx0IHBhcnNlciBvbmx5IGhhbmRsZXMgdmFyaWFibGUgc3Vic3RpdHV0aW9uXG5cdFx0cGFyc2U6IGZ1bmN0aW9uICggbWVzc2FnZSwgcGFyYW1ldGVycyApIHtcblx0XHRcdHJldHVybiBtZXNzYWdlLnJlcGxhY2UoIC9cXCQoXFxkKykvZywgZnVuY3Rpb24gKCBzdHIsIG1hdGNoICkge1xuXHRcdFx0XHR2YXIgaW5kZXggPSBwYXJzZUludCggbWF0Y2gsIDEwICkgLSAxO1xuXHRcdFx0XHRyZXR1cm4gcGFyYW1ldGVyc1sgaW5kZXggXSAhPT0gdW5kZWZpbmVkID8gcGFyYW1ldGVyc1sgaW5kZXggXSA6ICckJyArIG1hdGNoO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0ZW1pdHRlcjoge31cblx0fTtcblx0JC5pMThuLmZhbGxiYWNrcyA9IHt9O1xuXHQkLmkxOG4uZGVidWcgPSBmYWxzZTtcblx0JC5pMThuLmxvZyA9IGZ1bmN0aW9uICggLyogYXJndW1lbnRzICovICkge1xuXHRcdGlmICggd2luZG93LmNvbnNvbGUgJiYgJC5pMThuLmRlYnVnICkge1xuXHRcdFx0d2luZG93LmNvbnNvbGUubG9nLmFwcGx5KCB3aW5kb3cuY29uc29sZSwgYXJndW1lbnRzICk7XG5cdFx0fVxuXHR9O1xuXHQvKiBTdGF0aWMgbWVtYmVycyAqL1xuXHRJMThOLmRlZmF1bHRzID0ge1xuXHRcdGxvY2FsZTogZ2V0RGVmYXVsdExvY2FsZSgpLFxuXHRcdGZhbGxiYWNrTG9jYWxlOiAnZW4nLFxuXHRcdHBhcnNlcjogJC5pMThuLnBhcnNlcixcblx0XHRtZXNzYWdlU3RvcmU6ICQuaTE4bi5tZXNzYWdlU3RvcmVcblx0fTtcblxuXHQvLyBFeHBvc2UgY29uc3RydWN0b3Jcblx0JC5pMThuLmNvbnN0cnVjdG9yID0gSTE4Tjtcbn0oIGpRdWVyeSApICk7IiwiLyogZ2xvYmFsIHBsdXJhbFJ1bGVQYXJzZXIgKi9cbiggZnVuY3Rpb24gKCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0Ly8ganNjczpkaXNhYmxlXG5cdHZhciBsYW5ndWFnZSA9IHtcblx0XHQvLyBDTERSIHBsdXJhbCBydWxlcyBnZW5lcmF0ZWQgdXNpbmdcblx0XHQvLyBsaWJzL0NMRFJQbHVyYWxSdWxlUGFyc2VyL3Rvb2xzL1BsdXJhbFhNTDJKU09OLmh0bWxcblx0XHRwbHVyYWxSdWxlczoge1xuXHRcdFx0YWs6IHtcblx0XHRcdFx0b25lOiAnbiA9IDAuLjEnXG5cdFx0XHR9LFxuXHRcdFx0YW06IHtcblx0XHRcdFx0b25lOiAnaSA9IDAgb3IgbiA9IDEnXG5cdFx0XHR9LFxuXHRcdFx0YXI6IHtcblx0XHRcdFx0emVybzogJ24gPSAwJyxcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMicsXG5cdFx0XHRcdGZldzogJ24gJSAxMDAgPSAzLi4xMCcsXG5cdFx0XHRcdG1hbnk6ICduICUgMTAwID0gMTEuLjk5J1xuXHRcdFx0fSxcblx0XHRcdGFyczoge1xuXHRcdFx0XHR6ZXJvOiAnbiA9IDAnLFxuXHRcdFx0XHRvbmU6ICduID0gMScsXG5cdFx0XHRcdHR3bzogJ24gPSAyJyxcblx0XHRcdFx0ZmV3OiAnbiAlIDEwMCA9IDMuLjEwJyxcblx0XHRcdFx0bWFueTogJ24gJSAxMDAgPSAxMS4uOTknXG5cdFx0XHR9LFxuXHRcdFx0YXM6IHtcblx0XHRcdFx0b25lOiAnaSA9IDAgb3IgbiA9IDEnXG5cdFx0XHR9LFxuXHRcdFx0YmU6IHtcblx0XHRcdFx0b25lOiAnbiAlIDEwID0gMSBhbmQgbiAlIDEwMCAhPSAxMScsXG5cdFx0XHRcdGZldzogJ24gJSAxMCA9IDIuLjQgYW5kIG4gJSAxMDAgIT0gMTIuLjE0Jyxcblx0XHRcdFx0bWFueTogJ24gJSAxMCA9IDAgb3IgbiAlIDEwID0gNS4uOSBvciBuICUgMTAwID0gMTEuLjE0J1xuXHRcdFx0fSxcblx0XHRcdGJoOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAwLi4xJ1xuXHRcdFx0fSxcblx0XHRcdGJuOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwIG9yIG4gPSAxJ1xuXHRcdFx0fSxcblx0XHRcdGJyOiB7XG5cdFx0XHRcdG9uZTogJ24gJSAxMCA9IDEgYW5kIG4gJSAxMDAgIT0gMTEsNzEsOTEnLFxuXHRcdFx0XHR0d286ICduICUgMTAgPSAyIGFuZCBuICUgMTAwICE9IDEyLDcyLDkyJyxcblx0XHRcdFx0ZmV3OiAnbiAlIDEwID0gMy4uNCw5IGFuZCBuICUgMTAwICE9IDEwLi4xOSw3MC4uNzksOTAuLjk5Jyxcblx0XHRcdFx0bWFueTogJ24gIT0gMCBhbmQgbiAlIDEwMDAwMDAgPSAwJ1xuXHRcdFx0fSxcblx0XHRcdGJzOiB7XG5cdFx0XHRcdG9uZTogJ3YgPSAwIGFuZCBpICUgMTAgPSAxIGFuZCBpICUgMTAwICE9IDExIG9yIGYgJSAxMCA9IDEgYW5kIGYgJSAxMDAgIT0gMTEnLFxuXHRcdFx0XHRmZXc6ICd2ID0gMCBhbmQgaSAlIDEwID0gMi4uNCBhbmQgaSAlIDEwMCAhPSAxMi4uMTQgb3IgZiAlIDEwID0gMi4uNCBhbmQgZiAlIDEwMCAhPSAxMi4uMTQnXG5cdFx0XHR9LFxuXHRcdFx0Y3M6IHtcblx0XHRcdFx0b25lOiAnaSA9IDEgYW5kIHYgPSAwJyxcblx0XHRcdFx0ZmV3OiAnaSA9IDIuLjQgYW5kIHYgPSAwJyxcblx0XHRcdFx0bWFueTogJ3YgIT0gMCdcblx0XHRcdH0sXG5cdFx0XHRjeToge1xuXHRcdFx0XHR6ZXJvOiAnbiA9IDAnLFxuXHRcdFx0XHRvbmU6ICduID0gMScsXG5cdFx0XHRcdHR3bzogJ24gPSAyJyxcblx0XHRcdFx0ZmV3OiAnbiA9IDMnLFxuXHRcdFx0XHRtYW55OiAnbiA9IDYnXG5cdFx0XHR9LFxuXHRcdFx0ZGE6IHtcblx0XHRcdFx0b25lOiAnbiA9IDEgb3IgdCAhPSAwIGFuZCBpID0gMCwxJ1xuXHRcdFx0fSxcblx0XHRcdGRzYjoge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSAlIDEwMCA9IDEgb3IgZiAlIDEwMCA9IDEnLFxuXHRcdFx0XHR0d286ICd2ID0gMCBhbmQgaSAlIDEwMCA9IDIgb3IgZiAlIDEwMCA9IDInLFxuXHRcdFx0XHRmZXc6ICd2ID0gMCBhbmQgaSAlIDEwMCA9IDMuLjQgb3IgZiAlIDEwMCA9IDMuLjQnXG5cdFx0XHR9LFxuXHRcdFx0ZmE6IHtcblx0XHRcdFx0b25lOiAnaSA9IDAgb3IgbiA9IDEnXG5cdFx0XHR9LFxuXHRcdFx0ZmY6IHtcblx0XHRcdFx0b25lOiAnaSA9IDAsMSdcblx0XHRcdH0sXG5cdFx0XHRmaWw6IHtcblx0XHRcdFx0b25lOiAndiA9IDAgYW5kIGkgPSAxLDIsMyBvciB2ID0gMCBhbmQgaSAlIDEwICE9IDQsNiw5IG9yIHYgIT0gMCBhbmQgZiAlIDEwICE9IDQsNiw5J1xuXHRcdFx0fSxcblx0XHRcdGZyOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwLDEnXG5cdFx0XHR9LFxuXHRcdFx0Z2E6IHtcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMicsXG5cdFx0XHRcdGZldzogJ24gPSAzLi42Jyxcblx0XHRcdFx0bWFueTogJ24gPSA3Li4xMCdcblx0XHRcdH0sXG5cdFx0XHRnZDoge1xuXHRcdFx0XHRvbmU6ICduID0gMSwxMScsXG5cdFx0XHRcdHR3bzogJ24gPSAyLDEyJyxcblx0XHRcdFx0ZmV3OiAnbiA9IDMuLjEwLDEzLi4xOSdcblx0XHRcdH0sXG5cdFx0XHRndToge1xuXHRcdFx0XHRvbmU6ICdpID0gMCBvciBuID0gMSdcblx0XHRcdH0sXG5cdFx0XHRndXc6IHtcblx0XHRcdFx0b25lOiAnbiA9IDAuLjEnXG5cdFx0XHR9LFxuXHRcdFx0Z3Y6IHtcblx0XHRcdFx0b25lOiAndiA9IDAgYW5kIGkgJSAxMCA9IDEnLFxuXHRcdFx0XHR0d286ICd2ID0gMCBhbmQgaSAlIDEwID0gMicsXG5cdFx0XHRcdGZldzogJ3YgPSAwIGFuZCBpICUgMTAwID0gMCwyMCw0MCw2MCw4MCcsXG5cdFx0XHRcdG1hbnk6ICd2ICE9IDAnXG5cdFx0XHR9LFxuXHRcdFx0aGU6IHtcblx0XHRcdFx0b25lOiAnaSA9IDEgYW5kIHYgPSAwJyxcblx0XHRcdFx0dHdvOiAnaSA9IDIgYW5kIHYgPSAwJyxcblx0XHRcdFx0bWFueTogJ3YgPSAwIGFuZCBuICE9IDAuLjEwIGFuZCBuICUgMTAgPSAwJ1xuXHRcdFx0fSxcblx0XHRcdGhpOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwIG9yIG4gPSAxJ1xuXHRcdFx0fSxcblx0XHRcdGhyOiB7XG5cdFx0XHRcdG9uZTogJ3YgPSAwIGFuZCBpICUgMTAgPSAxIGFuZCBpICUgMTAwICE9IDExIG9yIGYgJSAxMCA9IDEgYW5kIGYgJSAxMDAgIT0gMTEnLFxuXHRcdFx0XHRmZXc6ICd2ID0gMCBhbmQgaSAlIDEwID0gMi4uNCBhbmQgaSAlIDEwMCAhPSAxMi4uMTQgb3IgZiAlIDEwID0gMi4uNCBhbmQgZiAlIDEwMCAhPSAxMi4uMTQnXG5cdFx0XHR9LFxuXHRcdFx0aHNiOiB7XG5cdFx0XHRcdG9uZTogJ3YgPSAwIGFuZCBpICUgMTAwID0gMSBvciBmICUgMTAwID0gMScsXG5cdFx0XHRcdHR3bzogJ3YgPSAwIGFuZCBpICUgMTAwID0gMiBvciBmICUgMTAwID0gMicsXG5cdFx0XHRcdGZldzogJ3YgPSAwIGFuZCBpICUgMTAwID0gMy4uNCBvciBmICUgMTAwID0gMy4uNCdcblx0XHRcdH0sXG5cdFx0XHRoeToge1xuXHRcdFx0XHRvbmU6ICdpID0gMCwxJ1xuXHRcdFx0fSxcblx0XHRcdGlzOiB7XG5cdFx0XHRcdG9uZTogJ3QgPSAwIGFuZCBpICUgMTAgPSAxIGFuZCBpICUgMTAwICE9IDExIG9yIHQgIT0gMCdcblx0XHRcdH0sXG5cdFx0XHRpdToge1xuXHRcdFx0XHRvbmU6ICduID0gMScsXG5cdFx0XHRcdHR3bzogJ24gPSAyJ1xuXHRcdFx0fSxcblx0XHRcdGl3OiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAxIGFuZCB2ID0gMCcsXG5cdFx0XHRcdHR3bzogJ2kgPSAyIGFuZCB2ID0gMCcsXG5cdFx0XHRcdG1hbnk6ICd2ID0gMCBhbmQgbiAhPSAwLi4xMCBhbmQgbiAlIDEwID0gMCdcblx0XHRcdH0sXG5cdFx0XHRrYWI6IHtcblx0XHRcdFx0b25lOiAnaSA9IDAsMSdcblx0XHRcdH0sXG5cdFx0XHRrbjoge1xuXHRcdFx0XHRvbmU6ICdpID0gMCBvciBuID0gMSdcblx0XHRcdH0sXG5cdFx0XHRrdzoge1xuXHRcdFx0XHRvbmU6ICduID0gMScsXG5cdFx0XHRcdHR3bzogJ24gPSAyJ1xuXHRcdFx0fSxcblx0XHRcdGxhZzoge1xuXHRcdFx0XHR6ZXJvOiAnbiA9IDAnLFxuXHRcdFx0XHRvbmU6ICdpID0gMCwxIGFuZCBuICE9IDAnXG5cdFx0XHR9LFxuXHRcdFx0bG46IHtcblx0XHRcdFx0b25lOiAnbiA9IDAuLjEnXG5cdFx0XHR9LFxuXHRcdFx0bHQ6IHtcblx0XHRcdFx0b25lOiAnbiAlIDEwID0gMSBhbmQgbiAlIDEwMCAhPSAxMS4uMTknLFxuXHRcdFx0XHRmZXc6ICduICUgMTAgPSAyLi45IGFuZCBuICUgMTAwICE9IDExLi4xOScsXG5cdFx0XHRcdG1hbnk6ICdmICE9IDAnXG5cdFx0XHR9LFxuXHRcdFx0bHY6IHtcblx0XHRcdFx0emVybzogJ24gJSAxMCA9IDAgb3IgbiAlIDEwMCA9IDExLi4xOSBvciB2ID0gMiBhbmQgZiAlIDEwMCA9IDExLi4xOScsXG5cdFx0XHRcdG9uZTogJ24gJSAxMCA9IDEgYW5kIG4gJSAxMDAgIT0gMTEgb3IgdiA9IDIgYW5kIGYgJSAxMCA9IDEgYW5kIGYgJSAxMDAgIT0gMTEgb3IgdiAhPSAyIGFuZCBmICUgMTAgPSAxJ1xuXHRcdFx0fSxcblx0XHRcdG1nOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAwLi4xJ1xuXHRcdFx0fSxcblx0XHRcdG1rOiB7XG5cdFx0XHRcdG9uZTogJ3YgPSAwIGFuZCBpICUgMTAgPSAxIG9yIGYgJSAxMCA9IDEnXG5cdFx0XHR9LFxuXHRcdFx0bW86IHtcblx0XHRcdFx0b25lOiAnaSA9IDEgYW5kIHYgPSAwJyxcblx0XHRcdFx0ZmV3OiAndiAhPSAwIG9yIG4gPSAwIG9yIG4gIT0gMSBhbmQgbiAlIDEwMCA9IDEuLjE5J1xuXHRcdFx0fSxcblx0XHRcdG1yOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwIG9yIG4gPSAxJ1xuXHRcdFx0fSxcblx0XHRcdG10OiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0ZmV3OiAnbiA9IDAgb3IgbiAlIDEwMCA9IDIuLjEwJyxcblx0XHRcdFx0bWFueTogJ24gJSAxMDAgPSAxMS4uMTknXG5cdFx0XHR9LFxuXHRcdFx0bmFxOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInXG5cdFx0XHR9LFxuXHRcdFx0bnNvOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAwLi4xJ1xuXHRcdFx0fSxcblx0XHRcdHBhOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAwLi4xJ1xuXHRcdFx0fSxcblx0XHRcdHBsOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAxIGFuZCB2ID0gMCcsXG5cdFx0XHRcdGZldzogJ3YgPSAwIGFuZCBpICUgMTAgPSAyLi40IGFuZCBpICUgMTAwICE9IDEyLi4xNCcsXG5cdFx0XHRcdG1hbnk6ICd2ID0gMCBhbmQgaSAhPSAxIGFuZCBpICUgMTAgPSAwLi4xIG9yIHYgPSAwIGFuZCBpICUgMTAgPSA1Li45IG9yIHYgPSAwIGFuZCBpICUgMTAwID0gMTIuLjE0J1xuXHRcdFx0fSxcblx0XHRcdHByZzoge1xuXHRcdFx0XHR6ZXJvOiAnbiAlIDEwID0gMCBvciBuICUgMTAwID0gMTEuLjE5IG9yIHYgPSAyIGFuZCBmICUgMTAwID0gMTEuLjE5Jyxcblx0XHRcdFx0b25lOiAnbiAlIDEwID0gMSBhbmQgbiAlIDEwMCAhPSAxMSBvciB2ID0gMiBhbmQgZiAlIDEwID0gMSBhbmQgZiAlIDEwMCAhPSAxMSBvciB2ICE9IDIgYW5kIGYgJSAxMCA9IDEnXG5cdFx0XHR9LFxuXHRcdFx0cHQ6IHtcblx0XHRcdFx0b25lOiAnaSA9IDAuLjEnXG5cdFx0XHR9LFxuXHRcdFx0cm86IHtcblx0XHRcdFx0b25lOiAnaSA9IDEgYW5kIHYgPSAwJyxcblx0XHRcdFx0ZmV3OiAndiAhPSAwIG9yIG4gPSAwIG9yIG4gIT0gMSBhbmQgbiAlIDEwMCA9IDEuLjE5J1xuXHRcdFx0fSxcblx0XHRcdHJ1OiB7XG5cdFx0XHRcdG9uZTogJ3YgPSAwIGFuZCBpICUgMTAgPSAxIGFuZCBpICUgMTAwICE9IDExJyxcblx0XHRcdFx0ZmV3OiAndiA9IDAgYW5kIGkgJSAxMCA9IDIuLjQgYW5kIGkgJSAxMDAgIT0gMTIuLjE0Jyxcblx0XHRcdFx0bWFueTogJ3YgPSAwIGFuZCBpICUgMTAgPSAwIG9yIHYgPSAwIGFuZCBpICUgMTAgPSA1Li45IG9yIHYgPSAwIGFuZCBpICUgMTAwID0gMTEuLjE0J1xuXHRcdFx0fSxcblx0XHRcdHNlOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInXG5cdFx0XHR9LFxuXHRcdFx0c2g6IHtcblx0XHRcdFx0b25lOiAndiA9IDAgYW5kIGkgJSAxMCA9IDEgYW5kIGkgJSAxMDAgIT0gMTEgb3IgZiAlIDEwID0gMSBhbmQgZiAlIDEwMCAhPSAxMScsXG5cdFx0XHRcdGZldzogJ3YgPSAwIGFuZCBpICUgMTAgPSAyLi40IGFuZCBpICUgMTAwICE9IDEyLi4xNCBvciBmICUgMTAgPSAyLi40IGFuZCBmICUgMTAwICE9IDEyLi4xNCdcblx0XHRcdH0sXG5cdFx0XHRzaGk6IHtcblx0XHRcdFx0b25lOiAnaSA9IDAgb3IgbiA9IDEnLFxuXHRcdFx0XHRmZXc6ICduID0gMi4uMTAnXG5cdFx0XHR9LFxuXHRcdFx0c2k6IHtcblx0XHRcdFx0b25lOiAnbiA9IDAsMSBvciBpID0gMCBhbmQgZiA9IDEnXG5cdFx0XHR9LFxuXHRcdFx0c2s6IHtcblx0XHRcdFx0b25lOiAnaSA9IDEgYW5kIHYgPSAwJyxcblx0XHRcdFx0ZmV3OiAnaSA9IDIuLjQgYW5kIHYgPSAwJyxcblx0XHRcdFx0bWFueTogJ3YgIT0gMCdcblx0XHRcdH0sXG5cdFx0XHRzbDoge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSAlIDEwMCA9IDEnLFxuXHRcdFx0XHR0d286ICd2ID0gMCBhbmQgaSAlIDEwMCA9IDInLFxuXHRcdFx0XHRmZXc6ICd2ID0gMCBhbmQgaSAlIDEwMCA9IDMuLjQgb3IgdiAhPSAwJ1xuXHRcdFx0fSxcblx0XHRcdHNtYToge1xuXHRcdFx0XHRvbmU6ICduID0gMScsXG5cdFx0XHRcdHR3bzogJ24gPSAyJ1xuXHRcdFx0fSxcblx0XHRcdHNtaToge1xuXHRcdFx0XHRvbmU6ICduID0gMScsXG5cdFx0XHRcdHR3bzogJ24gPSAyJ1xuXHRcdFx0fSxcblx0XHRcdHNtajoge1xuXHRcdFx0XHRvbmU6ICduID0gMScsXG5cdFx0XHRcdHR3bzogJ24gPSAyJ1xuXHRcdFx0fSxcblx0XHRcdHNtbjoge1xuXHRcdFx0XHRvbmU6ICduID0gMScsXG5cdFx0XHRcdHR3bzogJ24gPSAyJ1xuXHRcdFx0fSxcblx0XHRcdHNtczoge1xuXHRcdFx0XHRvbmU6ICduID0gMScsXG5cdFx0XHRcdHR3bzogJ24gPSAyJ1xuXHRcdFx0fSxcblx0XHRcdHNyOiB7XG5cdFx0XHRcdG9uZTogJ3YgPSAwIGFuZCBpICUgMTAgPSAxIGFuZCBpICUgMTAwICE9IDExIG9yIGYgJSAxMCA9IDEgYW5kIGYgJSAxMDAgIT0gMTEnLFxuXHRcdFx0XHRmZXc6ICd2ID0gMCBhbmQgaSAlIDEwID0gMi4uNCBhbmQgaSAlIDEwMCAhPSAxMi4uMTQgb3IgZiAlIDEwID0gMi4uNCBhbmQgZiAlIDEwMCAhPSAxMi4uMTQnXG5cdFx0XHR9LFxuXHRcdFx0dGk6IHtcblx0XHRcdFx0b25lOiAnbiA9IDAuLjEnXG5cdFx0XHR9LFxuXHRcdFx0dGw6IHtcblx0XHRcdFx0b25lOiAndiA9IDAgYW5kIGkgPSAxLDIsMyBvciB2ID0gMCBhbmQgaSAlIDEwICE9IDQsNiw5IG9yIHYgIT0gMCBhbmQgZiAlIDEwICE9IDQsNiw5J1xuXHRcdFx0fSxcblx0XHRcdHR6bToge1xuXHRcdFx0XHRvbmU6ICduID0gMC4uMSBvciBuID0gMTEuLjk5J1xuXHRcdFx0fSxcblx0XHRcdHVrOiB7XG5cdFx0XHRcdG9uZTogJ3YgPSAwIGFuZCBpICUgMTAgPSAxIGFuZCBpICUgMTAwICE9IDExJyxcblx0XHRcdFx0ZmV3OiAndiA9IDAgYW5kIGkgJSAxMCA9IDIuLjQgYW5kIGkgJSAxMDAgIT0gMTIuLjE0Jyxcblx0XHRcdFx0bWFueTogJ3YgPSAwIGFuZCBpICUgMTAgPSAwIG9yIHYgPSAwIGFuZCBpICUgMTAgPSA1Li45IG9yIHYgPSAwIGFuZCBpICUgMTAwID0gMTEuLjE0J1xuXHRcdFx0fSxcblx0XHRcdHdhOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAwLi4xJ1xuXHRcdFx0fSxcblx0XHRcdHp1OiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwIG9yIG4gPSAxJ1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ly8ganNjczplbmFibGVcblxuXHRcdC8qKlxuXHRcdCAqIFBsdXJhbCBmb3JtIHRyYW5zZm9ybWF0aW9ucywgbmVlZGVkIGZvciBzb21lIGxhbmd1YWdlcy5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7aW50ZWdlcn0gY291bnRcblx0XHQgKiAgICAgICAgICAgIE5vbi1sb2NhbGl6ZWQgcXVhbnRpZmllclxuXHRcdCAqIEBwYXJhbSB7QXJyYXl9IGZvcm1zXG5cdFx0ICogICAgICAgICAgICBMaXN0IG9mIHBsdXJhbCBmb3Jtc1xuXHRcdCAqIEByZXR1cm4ge3N0cmluZ30gQ29ycmVjdCBmb3JtIGZvciBxdWFudGlmaWVyIGluIHRoaXMgbGFuZ3VhZ2Vcblx0XHQgKi9cblx0XHRjb252ZXJ0UGx1cmFsOiBmdW5jdGlvbiAoIGNvdW50LCBmb3JtcyApIHtcblx0XHRcdHZhciBwbHVyYWxSdWxlcyxcblx0XHRcdFx0cGx1cmFsRm9ybUluZGV4LFxuXHRcdFx0XHRpbmRleCxcblx0XHRcdFx0ZXhwbGljaXRQbHVyYWxQYXR0ZXJuID0gbmV3IFJlZ0V4cCggJ1xcXFxkKz0nLCAnaScgKSxcblx0XHRcdFx0Zm9ybUNvdW50LFxuXHRcdFx0XHRmb3JtO1xuXG5cdFx0XHRpZiAoICFmb3JtcyB8fCBmb3Jtcy5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRcdHJldHVybiAnJztcblx0XHRcdH1cblxuXHRcdFx0Ly8gSGFuZGxlIGZvciBFeHBsaWNpdCAwPSAmIDE9IHZhbHVlc1xuXHRcdFx0Zm9yICggaW5kZXggPSAwOyBpbmRleCA8IGZvcm1zLmxlbmd0aDsgaW5kZXgrKyApIHtcblx0XHRcdFx0Zm9ybSA9IGZvcm1zWyBpbmRleCBdO1xuXHRcdFx0XHRpZiAoIGV4cGxpY2l0UGx1cmFsUGF0dGVybi50ZXN0KCBmb3JtICkgKSB7XG5cdFx0XHRcdFx0Zm9ybUNvdW50ID0gcGFyc2VJbnQoIGZvcm0uc2xpY2UoIDAsIGZvcm0uaW5kZXhPZiggJz0nICkgKSwgMTAgKTtcblx0XHRcdFx0XHRpZiAoIGZvcm1Db3VudCA9PT0gY291bnQgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gKCBmb3JtLnNsaWNlKCBmb3JtLmluZGV4T2YoICc9JyApICsgMSApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGZvcm1zWyBpbmRleCBdID0gdW5kZWZpbmVkO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGZvcm1zID0gJC5tYXAoIGZvcm1zLCBmdW5jdGlvbiAoIGZvcm0gKSB7XG5cdFx0XHRcdGlmICggZm9ybSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdHJldHVybiBmb3JtO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdHBsdXJhbFJ1bGVzID0gdGhpcy5wbHVyYWxSdWxlc1sgJC5pMThuKCkubG9jYWxlIF07XG5cblx0XHRcdGlmICggIXBsdXJhbFJ1bGVzICkge1xuXHRcdFx0XHQvLyBkZWZhdWx0IGZhbGxiYWNrLlxuXHRcdFx0XHRyZXR1cm4gKCBjb3VudCA9PT0gMSApID8gZm9ybXNbIDAgXSA6IGZvcm1zWyAxIF07XG5cdFx0XHR9XG5cblx0XHRcdHBsdXJhbEZvcm1JbmRleCA9IHRoaXMuZ2V0UGx1cmFsRm9ybSggY291bnQsIHBsdXJhbFJ1bGVzICk7XG5cdFx0XHRwbHVyYWxGb3JtSW5kZXggPSBNYXRoLm1pbiggcGx1cmFsRm9ybUluZGV4LCBmb3Jtcy5sZW5ndGggLSAxICk7XG5cblx0XHRcdHJldHVybiBmb3Jtc1sgcGx1cmFsRm9ybUluZGV4IF07XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEZvciB0aGUgbnVtYmVyLCBnZXQgdGhlIHBsdXJhbCBmb3IgaW5kZXhcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7aW50ZWdlcn0gbnVtYmVyXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IHBsdXJhbFJ1bGVzXG5cdFx0ICogQHJldHVybiB7aW50ZWdlcn0gcGx1cmFsIGZvcm0gaW5kZXhcblx0XHQgKi9cblx0XHRnZXRQbHVyYWxGb3JtOiBmdW5jdGlvbiAoIG51bWJlciwgcGx1cmFsUnVsZXMgKSB7XG5cdFx0XHR2YXIgaSxcblx0XHRcdFx0cGx1cmFsRm9ybXMgPSBbICd6ZXJvJywgJ29uZScsICd0d28nLCAnZmV3JywgJ21hbnknLCAnb3RoZXInIF0sXG5cdFx0XHRcdHBsdXJhbEZvcm1JbmRleCA9IDA7XG5cblx0XHRcdGZvciAoIGkgPSAwOyBpIDwgcGx1cmFsRm9ybXMubGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdGlmICggcGx1cmFsUnVsZXNbIHBsdXJhbEZvcm1zWyBpIF0gXSApIHtcblx0XHRcdFx0XHRpZiAoIHBsdXJhbFJ1bGVQYXJzZXIoIHBsdXJhbFJ1bGVzWyBwbHVyYWxGb3Jtc1sgaSBdIF0sIG51bWJlciApICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHBsdXJhbEZvcm1JbmRleDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRwbHVyYWxGb3JtSW5kZXgrKztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcGx1cmFsRm9ybUluZGV4O1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBDb252ZXJ0cyBhIG51bWJlciB1c2luZyBkaWdpdFRyYW5zZm9ybVRhYmxlLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtudW1iZXJ9IG51bSBWYWx1ZSB0byBiZSBjb252ZXJ0ZWRcblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW59IGludGVnZXIgQ29udmVydCB0aGUgcmV0dXJuIHZhbHVlIHRvIGFuIGludGVnZXJcblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBudW1iZXIgY29udmVydGVkIGludG8gYSBTdHJpbmcuXG5cdFx0ICovXG5cdFx0Y29udmVydE51bWJlcjogZnVuY3Rpb24gKCBudW0sIGludGVnZXIgKSB7XG5cdFx0XHR2YXIgdG1wLCBpdGVtLCBpLFxuXHRcdFx0XHR0cmFuc2Zvcm1UYWJsZSwgbnVtYmVyU3RyaW5nLCBjb252ZXJ0ZWROdW1iZXI7XG5cblx0XHRcdC8vIFNldCB0aGUgdGFyZ2V0IFRyYW5zZm9ybSB0YWJsZTpcblx0XHRcdHRyYW5zZm9ybVRhYmxlID0gdGhpcy5kaWdpdFRyYW5zZm9ybVRhYmxlKCAkLmkxOG4oKS5sb2NhbGUgKTtcblx0XHRcdG51bWJlclN0cmluZyA9IFN0cmluZyggbnVtICk7XG5cdFx0XHRjb252ZXJ0ZWROdW1iZXIgPSAnJztcblxuXHRcdFx0aWYgKCAhdHJhbnNmb3JtVGFibGUgKSB7XG5cdFx0XHRcdHJldHVybiBudW07XG5cdFx0XHR9XG5cblx0XHRcdC8vIENoZWNrIGlmIHRoZSByZXN0b3JlIHRvIExhdGluIG51bWJlciBmbGFnIGlzIHNldDpcblx0XHRcdGlmICggaW50ZWdlciApIHtcblx0XHRcdFx0aWYgKCBwYXJzZUZsb2F0KCBudW0sIDEwICkgPT09IG51bSApIHtcblx0XHRcdFx0XHRyZXR1cm4gbnVtO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dG1wID0gW107XG5cblx0XHRcdFx0Zm9yICggaXRlbSBpbiB0cmFuc2Zvcm1UYWJsZSApIHtcblx0XHRcdFx0XHR0bXBbIHRyYW5zZm9ybVRhYmxlWyBpdGVtIF0gXSA9IGl0ZW07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0cmFuc2Zvcm1UYWJsZSA9IHRtcDtcblx0XHRcdH1cblxuXHRcdFx0Zm9yICggaSA9IDA7IGkgPCBudW1iZXJTdHJpbmcubGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdGlmICggdHJhbnNmb3JtVGFibGVbIG51bWJlclN0cmluZ1sgaSBdIF0gKSB7XG5cdFx0XHRcdFx0Y29udmVydGVkTnVtYmVyICs9IHRyYW5zZm9ybVRhYmxlWyBudW1iZXJTdHJpbmdbIGkgXSBdO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnZlcnRlZE51bWJlciArPSBudW1iZXJTdHJpbmdbIGkgXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gaW50ZWdlciA/IHBhcnNlRmxvYXQoIGNvbnZlcnRlZE51bWJlciwgMTAgKSA6IGNvbnZlcnRlZE51bWJlcjtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogR3JhbW1hdGljYWwgdHJhbnNmb3JtYXRpb25zLCBuZWVkZWQgZm9yIGluZmxlY3RlZCBsYW5ndWFnZXMuXG5cdFx0ICogSW52b2tlZCBieSBwdXR0aW5nIHt7Z3JhbW1hcjpmb3JtfHdvcmR9fSBpbiBhIG1lc3NhZ2UuXG5cdFx0ICogT3ZlcnJpZGUgdGhpcyBtZXRob2QgZm9yIGxhbmd1YWdlcyB0aGF0IG5lZWQgc3BlY2lhbCBncmFtbWFyIHJ1bGVzXG5cdFx0ICogYXBwbGllZCBkeW5hbWljYWxseS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB3b3JkXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGZvcm1cblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG5cdFx0Y29udmVydEdyYW1tYXI6IGZ1bmN0aW9uICggd29yZCwgZm9ybSApIHtcblx0XHRcdHJldHVybiB3b3JkO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBQcm92aWRlcyBhbiBhbHRlcm5hdGl2ZSB0ZXh0IGRlcGVuZGluZyBvbiBzcGVjaWZpZWQgZ2VuZGVyLiBVc2FnZVxuXHRcdCAqIHt7Z2VuZGVyOltnZW5kZXJ8dXNlciBvYmplY3RdfG1hc2N1bGluZXxmZW1pbmluZXxuZXV0cmFsfX0uIElmIHNlY29uZFxuXHRcdCAqIG9yIHRoaXJkIHBhcmFtZXRlciBhcmUgbm90IHNwZWNpZmllZCwgbWFzY3VsaW5lIGlzIHVzZWQuXG5cdFx0ICpcblx0XHQgKiBUaGVzZSBkZXRhaWxzIG1heSBiZSBvdmVycmlkZW4gcGVyIGxhbmd1YWdlLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGdlbmRlclxuXHRcdCAqICAgICAgbWFsZSwgZmVtYWxlLCBvciBhbnl0aGluZyBlbHNlIGZvciBuZXV0cmFsLlxuXHRcdCAqIEBwYXJhbSB7QXJyYXl9IGZvcm1zXG5cdFx0ICogICAgICBMaXN0IG9mIGdlbmRlciBmb3Jtc1xuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7c3RyaW5nfVxuXHRcdCAqL1xuXHRcdGdlbmRlcjogZnVuY3Rpb24gKCBnZW5kZXIsIGZvcm1zICkge1xuXHRcdFx0aWYgKCAhZm9ybXMgfHwgZm9ybXMubGVuZ3RoID09PSAwICkge1xuXHRcdFx0XHRyZXR1cm4gJyc7XG5cdFx0XHR9XG5cblx0XHRcdHdoaWxlICggZm9ybXMubGVuZ3RoIDwgMiApIHtcblx0XHRcdFx0Zm9ybXMucHVzaCggZm9ybXNbIGZvcm1zLmxlbmd0aCAtIDEgXSApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGdlbmRlciA9PT0gJ21hbGUnICkge1xuXHRcdFx0XHRyZXR1cm4gZm9ybXNbIDAgXTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBnZW5kZXIgPT09ICdmZW1hbGUnICkge1xuXHRcdFx0XHRyZXR1cm4gZm9ybXNbIDEgXTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuICggZm9ybXMubGVuZ3RoID09PSAzICkgPyBmb3Jtc1sgMiBdIDogZm9ybXNbIDAgXTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogR2V0IHRoZSBkaWdpdCB0cmFuc2Zvcm0gdGFibGUgZm9yIHRoZSBnaXZlbiBsYW5ndWFnZVxuXHRcdCAqIFNlZSBodHRwOi8vY2xkci51bmljb2RlLm9yZy90cmFuc2xhdGlvbi9udW1iZXJpbmctc3lzdGVtc1xuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGxhbmd1YWdlXG5cdFx0ICogQHJldHVybiB7QXJyYXl8Ym9vbGVhbn0gTGlzdCBvZiBkaWdpdHMgaW4gdGhlIHBhc3NlZCBsYW5ndWFnZSBvciBmYWxzZVxuXHRcdCAqIHJlcHJlc2VudGF0aW9uLCBvciBib29sZWFuIGZhbHNlIGlmIHRoZXJlIGlzIG5vIGluZm9ybWF0aW9uLlxuXHRcdCAqL1xuXHRcdGRpZ2l0VHJhbnNmb3JtVGFibGU6IGZ1bmN0aW9uICggbGFuZ3VhZ2UgKSB7XG5cdFx0XHR2YXIgdGFibGVzID0ge1xuXHRcdFx0XHRhcjogJ9mg2aHZotmj2aTZpdmm2afZqNmpJyxcblx0XHRcdFx0ZmE6ICfbsNux27Lbs9u027Xbttu327jbuScsXG5cdFx0XHRcdG1sOiAn4LWm4LWn4LWo4LWp4LWq4LWr4LWs4LWt4LWu4LWvJyxcblx0XHRcdFx0a246ICfgs6bgs6fgs6jgs6ngs6rgs6vgs6zgs63gs67gs68nLFxuXHRcdFx0XHRsbzogJ+C7kOC7keC7kuC7k+C7lOC7leC7luC7l+C7mOC7mScsXG5cdFx0XHRcdG9yOiAn4K2m4K2n4K2o4K2p4K2q4K2r4K2s4K2t4K2u4K2vJyxcblx0XHRcdFx0a2g6ICfhn6Dhn6Hhn6Lhn6Phn6Thn6Xhn6bhn6fhn6jhn6knLFxuXHRcdFx0XHRwYTogJ+CppuCpp+CpqOCpqeCpquCpq+CprOCpreCpruCprycsXG5cdFx0XHRcdGd1OiAn4Kum4Kun4Kuo4Kup4Kuq4Kur4Kus4Kut4Kuu4KuvJyxcblx0XHRcdFx0aGk6ICfgpabgpafgpajgpangpargpavgpazgpa3gpa7gpa8nLFxuXHRcdFx0XHRteTogJ+GBgOGBgeGBguGBg+GBhOGBheGBhuGBh+GBiOGBiScsXG5cdFx0XHRcdHRhOiAn4K+m4K+n4K+o4K+p4K+q4K+r4K+s4K+t4K+u4K+vJyxcblx0XHRcdFx0dGU6ICfgsabgsafgsajgsangsargsavgsazgsa3gsa7gsa8nLFxuXHRcdFx0XHR0aDogJ+C5kOC5keC5kuC5k+C5lOC5leC5luC5l+C5mOC5mScsIC8vIEZJWE1FIHVzZSBpc28gNjM5IGNvZGVzXG5cdFx0XHRcdGJvOiAn4Lyg4Lyh4Lyi4Lyj4Lyk4Lyl4Lym4Lyn4Lyo4LypJyAvLyBGSVhNRSB1c2UgaXNvIDYzOSBjb2Rlc1xuXHRcdFx0fTtcblxuXHRcdFx0aWYgKCAhdGFibGVzWyBsYW5ndWFnZSBdICkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0YWJsZXNbIGxhbmd1YWdlIF0uc3BsaXQoICcnICk7XG5cdFx0fVxuXHR9O1xuXG5cdCQuZXh0ZW5kKCAkLmkxOG4ubGFuZ3VhZ2VzLCB7XG5cdFx0J2RlZmF1bHQnOiBsYW5ndWFnZVxuXHR9ICk7XG59KCBqUXVlcnkgKSApO1xuIiwiLyohXG4gKiBqUXVlcnkgSW50ZXJuYXRpb25hbGl6YXRpb24gbGlicmFyeSAtIE1lc3NhZ2UgU3RvcmVcbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTIgU2FudGhvc2ggVGhvdHRpbmdhbFxuICpcbiAqIGpxdWVyeS5pMThuIGlzIGR1YWwgbGljZW5zZWQgR1BMdjIgb3IgbGF0ZXIgYW5kIE1JVC4gWW91IGRvbid0IGhhdmUgdG8gZG8gYW55dGhpbmcgc3BlY2lhbCB0b1xuICogY2hvb3NlIG9uZSBsaWNlbnNlIG9yIHRoZSBvdGhlciBhbmQgeW91IGRvbid0IGhhdmUgdG8gbm90aWZ5IGFueW9uZSB3aGljaCBsaWNlbnNlIHlvdSBhcmUgdXNpbmcuXG4gKiBZb3UgYXJlIGZyZWUgdG8gdXNlIFVuaXZlcnNhbExhbmd1YWdlU2VsZWN0b3IgaW4gY29tbWVyY2lhbCBwcm9qZWN0cyBhcyBsb25nIGFzIHRoZSBjb3B5cmlnaHRcbiAqIGhlYWRlciBpcyBsZWZ0IGludGFjdC4gU2VlIGZpbGVzIEdQTC1MSUNFTlNFIGFuZCBNSVQtTElDRU5TRSBmb3IgZGV0YWlscy5cbiAqXG4gKiBAbGljZW5jZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5jZSAyLjAgb3IgbGF0ZXJcbiAqIEBsaWNlbmNlIE1JVCBMaWNlbnNlXG4gKi9cblxuKCBmdW5jdGlvbiAoICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgTWVzc2FnZVN0b3JlID0gZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMubWVzc2FnZXMgPSB7fTtcblx0XHR0aGlzLnNvdXJjZXMgPSB7fTtcblx0fTtcblxuXHRmdW5jdGlvbiBqc29uTWVzc2FnZUxvYWRlciggdXJsICkge1xuXHRcdHZhciBkZWZlcnJlZCA9ICQuRGVmZXJyZWQoKTtcblxuXHRcdCQuZ2V0SlNPTiggdXJsIClcblx0XHRcdC5kb25lKCBkZWZlcnJlZC5yZXNvbHZlIClcblx0XHRcdC5mYWlsKCBmdW5jdGlvbiAoIGpxeGhyLCBzZXR0aW5ncywgZXhjZXB0aW9uICkge1xuXHRcdFx0XHQkLmkxOG4ubG9nKCAnRXJyb3IgaW4gbG9hZGluZyBtZXNzYWdlcyBmcm9tICcgKyB1cmwgKyAnIEV4Y2VwdGlvbjogJyArIGV4Y2VwdGlvbiApO1xuXHRcdFx0XHQvLyBJZ25vcmUgNDA0IGV4Y2VwdGlvbiwgYmVjYXVzZSB3ZSBhcmUgaGFuZGxpbmcgZmFsbGFiYWNrcyBleHBsaWNpdGx5XG5cdFx0XHRcdGRlZmVycmVkLnJlc29sdmUoKTtcblx0XHRcdH0gKTtcblxuXHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlKCk7XG5cdH1cblxuXHQvKipcblx0ICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93aWtpbWVkaWEvanF1ZXJ5LmkxOG4vd2lraS9TcGVjaWZpY2F0aW9uI3dpa2ktTWVzc2FnZV9GaWxlX0xvYWRpbmdcblx0ICovXG5cdE1lc3NhZ2VTdG9yZS5wcm90b3R5cGUgPSB7XG5cblx0XHQvKipcblx0XHQgKiBHZW5lcmFsIG1lc3NhZ2UgbG9hZGluZyBBUEkgVGhpcyBjYW4gdGFrZSBhIFVSTCBzdHJpbmcgZm9yXG5cdFx0ICogdGhlIGpzb24gZm9ybWF0dGVkIG1lc3NhZ2VzLlxuXHRcdCAqIDxjb2RlPmxvYWQoJ3BhdGgvdG8vYWxsX2xvY2FsaXphdGlvbnMuanNvbicpOzwvY29kZT5cblx0XHQgKlxuXHRcdCAqIFRoaXMgY2FuIGFsc28gbG9hZCBhIGxvY2FsaXphdGlvbiBmaWxlIGZvciBhIGxvY2FsZSA8Y29kZT5cblx0XHQgKiBsb2FkKCAncGF0aC90by9kZS1tZXNzYWdlcy5qc29uJywgJ2RlJyApO1xuXHRcdCAqIDwvY29kZT5cblx0XHQgKiBBIGRhdGEgb2JqZWN0IGNvbnRhaW5pbmcgbWVzc2FnZSBrZXktIG1lc3NhZ2UgdHJhbnNsYXRpb24gbWFwcGluZ3Ncblx0XHQgKiBjYW4gYWxzbyBiZSBwYXNzZWQgRWc6XG5cdFx0ICogPGNvZGU+XG5cdFx0ICogbG9hZCggeyAnaGVsbG8nIDogJ0hlbGxvJyB9LCBvcHRpb25hbExvY2FsZSApO1xuXHRcdCAqIDwvY29kZT4gSWYgdGhlIGRhdGEgYXJndW1lbnQgaXNcblx0XHQgKiBudWxsL3VuZGVmaW5lZC9mYWxzZSxcblx0XHQgKiBhbGwgY2FjaGVkIG1lc3NhZ2VzIGZvciB0aGUgaTE4biBpbnN0YW5jZSB3aWxsIGdldCByZXNldC5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfE9iamVjdH0gc291cmNlXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGxvY2FsZSBMYW5ndWFnZSB0YWdcblx0XHQgKiBAcmV0dXJuIHtqUXVlcnkuUHJvbWlzZX1cblx0XHQgKi9cblx0XHRsb2FkOiBmdW5jdGlvbiAoIHNvdXJjZSwgbG9jYWxlICkge1xuXHRcdFx0dmFyIGtleSA9IG51bGwsXG5cdFx0XHRcdGRlZmVycmVkID0gbnVsbCxcblx0XHRcdFx0ZGVmZXJyZWRzID0gW10sXG5cdFx0XHRcdG1lc3NhZ2VTdG9yZSA9IHRoaXM7XG5cblx0XHRcdGlmICggdHlwZW9mIHNvdXJjZSA9PT0gJ3N0cmluZycgKSB7XG5cdFx0XHRcdC8vIFRoaXMgaXMgYSBVUkwgdG8gdGhlIG1lc3NhZ2VzIGZpbGUuXG5cdFx0XHRcdCQuaTE4bi5sb2coICdMb2FkaW5nIG1lc3NhZ2VzIGZyb206ICcgKyBzb3VyY2UgKTtcblx0XHRcdFx0ZGVmZXJyZWQgPSBqc29uTWVzc2FnZUxvYWRlciggc291cmNlIClcblx0XHRcdFx0XHQuZG9uZSggZnVuY3Rpb24gKCBsb2NhbGl6YXRpb24gKSB7XG5cdFx0XHRcdFx0XHRtZXNzYWdlU3RvcmUuc2V0KCBsb2NhbGUsIGxvY2FsaXphdGlvbiApO1xuXHRcdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGxvY2FsZSApIHtcblx0XHRcdFx0Ly8gc291cmNlIGlzIGFuIGtleS12YWx1ZSBwYWlyIG9mIG1lc3NhZ2VzIGZvciBnaXZlbiBsb2NhbGVcblx0XHRcdFx0bWVzc2FnZVN0b3JlLnNldCggbG9jYWxlLCBzb3VyY2UgKTtcblxuXHRcdFx0XHRyZXR1cm4gJC5EZWZlcnJlZCgpLnJlc29sdmUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIHNvdXJjZSBpcyBhIGtleS12YWx1ZSBwYWlyIG9mIGxvY2FsZXMgYW5kIHRoZWlyIHNvdXJjZVxuXHRcdFx0XHRmb3IgKCBrZXkgaW4gc291cmNlICkge1xuXHRcdFx0XHRcdGlmICggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCBzb3VyY2UsIGtleSApICkge1xuXHRcdFx0XHRcdFx0bG9jYWxlID0ga2V5O1xuXHRcdFx0XHRcdFx0Ly8gTm8ge2xvY2FsZX0gZ2l2ZW4sIGFzc3VtZSBkYXRhIGlzIGEgZ3JvdXAgb2YgbGFuZ3VhZ2VzLFxuXHRcdFx0XHRcdFx0Ly8gY2FsbCB0aGlzIGZ1bmN0aW9uIGFnYWluIGZvciBlYWNoIGxhbmd1YWdlLlxuXHRcdFx0XHRcdFx0ZGVmZXJyZWRzLnB1c2goIG1lc3NhZ2VTdG9yZS5sb2FkKCBzb3VyY2VbIGtleSBdLCBsb2NhbGUgKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gJC53aGVuLmFwcGx5KCAkLCBkZWZlcnJlZHMgKTtcblx0XHRcdH1cblxuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBTZXQgbWVzc2FnZXMgdG8gdGhlIGdpdmVuIGxvY2FsZS5cblx0XHQgKiBJZiBsb2NhbGUgZXhpc3RzLCBhZGQgbWVzc2FnZXMgdG8gdGhlIGxvY2FsZS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhbGVcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gbWVzc2FnZXNcblx0XHQgKi9cblx0XHRzZXQ6IGZ1bmN0aW9uICggbG9jYWxlLCBtZXNzYWdlcyApIHtcblx0XHRcdGlmICggIXRoaXMubWVzc2FnZXNbIGxvY2FsZSBdICkge1xuXHRcdFx0XHR0aGlzLm1lc3NhZ2VzWyBsb2NhbGUgXSA9IG1lc3NhZ2VzO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5tZXNzYWdlc1sgbG9jYWxlIF0gPSAkLmV4dGVuZCggdGhpcy5tZXNzYWdlc1sgbG9jYWxlIF0sIG1lc3NhZ2VzICk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGxvY2FsZVxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlS2V5XG5cdFx0ICogQHJldHVybiB7Ym9vbGVhbn1cblx0XHQgKi9cblx0XHRnZXQ6IGZ1bmN0aW9uICggbG9jYWxlLCBtZXNzYWdlS2V5ICkge1xuXHRcdFx0cmV0dXJuIHRoaXMubWVzc2FnZXNbIGxvY2FsZSBdICYmIHRoaXMubWVzc2FnZXNbIGxvY2FsZSBdWyBtZXNzYWdlS2V5IF07XG5cdFx0fVxuXHR9O1xuXG5cdCQuZXh0ZW5kKCAkLmkxOG4ubWVzc2FnZVN0b3JlLCBuZXcgTWVzc2FnZVN0b3JlKCkgKTtcbn0oIGpRdWVyeSApICk7XG4iLCIvKiFcbiAqIGpRdWVyeSBJbnRlcm5hdGlvbmFsaXphdGlvbiBsaWJyYXJ5XG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDExLTIwMTMgU2FudGhvc2ggVGhvdHRpbmdhbCwgTmVpbCBLYW5kYWxnYW9ua2FyXG4gKlxuICoganF1ZXJ5LmkxOG4gaXMgZHVhbCBsaWNlbnNlZCBHUEx2MiBvciBsYXRlciBhbmQgTUlULiBZb3UgZG9uJ3QgaGF2ZSB0byBkb1xuICogYW55dGhpbmcgc3BlY2lhbCB0byBjaG9vc2Ugb25lIGxpY2Vuc2Ugb3IgdGhlIG90aGVyIGFuZCB5b3UgZG9uJ3QgaGF2ZSB0b1xuICogbm90aWZ5IGFueW9uZSB3aGljaCBsaWNlbnNlIHlvdSBhcmUgdXNpbmcuIFlvdSBhcmUgZnJlZSB0byB1c2VcbiAqIFVuaXZlcnNhbExhbmd1YWdlU2VsZWN0b3IgaW4gY29tbWVyY2lhbCBwcm9qZWN0cyBhcyBsb25nIGFzIHRoZSBjb3B5cmlnaHRcbiAqIGhlYWRlciBpcyBsZWZ0IGludGFjdC4gU2VlIGZpbGVzIEdQTC1MSUNFTlNFIGFuZCBNSVQtTElDRU5TRSBmb3IgZGV0YWlscy5cbiAqXG4gKiBAbGljZW5jZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5jZSAyLjAgb3IgbGF0ZXJcbiAqIEBsaWNlbmNlIE1JVCBMaWNlbnNlXG4gKi9cblxuKCBmdW5jdGlvbiAoICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgTWVzc2FnZVBhcnNlciA9IGZ1bmN0aW9uICggb3B0aW9ucyApIHtcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCgge30sICQuaTE4bi5wYXJzZXIuZGVmYXVsdHMsIG9wdGlvbnMgKTtcblx0XHR0aGlzLmxhbmd1YWdlID0gJC5pMThuLmxhbmd1YWdlc1sgU3RyaW5nLmxvY2FsZSBdIHx8ICQuaTE4bi5sYW5ndWFnZXNbICdkZWZhdWx0JyBdO1xuXHRcdHRoaXMuZW1pdHRlciA9ICQuaTE4bi5wYXJzZXIuZW1pdHRlcjtcblx0fTtcblxuXHRNZXNzYWdlUGFyc2VyLnByb3RvdHlwZSA9IHtcblxuXHRcdGNvbnN0cnVjdG9yOiBNZXNzYWdlUGFyc2VyLFxuXG5cdFx0c2ltcGxlUGFyc2U6IGZ1bmN0aW9uICggbWVzc2FnZSwgcGFyYW1ldGVycyApIHtcblx0XHRcdHJldHVybiBtZXNzYWdlLnJlcGxhY2UoIC9cXCQoXFxkKykvZywgZnVuY3Rpb24gKCBzdHIsIG1hdGNoICkge1xuXHRcdFx0XHR2YXIgaW5kZXggPSBwYXJzZUludCggbWF0Y2gsIDEwICkgLSAxO1xuXG5cdFx0XHRcdHJldHVybiBwYXJhbWV0ZXJzWyBpbmRleCBdICE9PSB1bmRlZmluZWQgPyBwYXJhbWV0ZXJzWyBpbmRleCBdIDogJyQnICsgbWF0Y2g7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblxuXHRcdHBhcnNlOiBmdW5jdGlvbiAoIG1lc3NhZ2UsIHJlcGxhY2VtZW50cyApIHtcblx0XHRcdGlmICggbWVzc2FnZS5pbmRleE9mKCAne3snICkgPCAwICkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5zaW1wbGVQYXJzZSggbWVzc2FnZSwgcmVwbGFjZW1lbnRzICk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZW1pdHRlci5sYW5ndWFnZSA9ICQuaTE4bi5sYW5ndWFnZXNbICQuaTE4bigpLmxvY2FsZSBdIHx8XG5cdFx0XHRcdCQuaTE4bi5sYW5ndWFnZXNbICdkZWZhdWx0JyBdO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5lbWl0dGVyLmVtaXQoIHRoaXMuYXN0KCBtZXNzYWdlICksIHJlcGxhY2VtZW50cyApO1xuXHRcdH0sXG5cblx0XHRhc3Q6IGZ1bmN0aW9uICggbWVzc2FnZSApIHtcblx0XHRcdHZhciBwaXBlLCBjb2xvbiwgYmFja3NsYXNoLCBhbnlDaGFyYWN0ZXIsIGRvbGxhciwgZGlnaXRzLCByZWd1bGFyTGl0ZXJhbCxcblx0XHRcdFx0cmVndWxhckxpdGVyYWxXaXRob3V0QmFyLCByZWd1bGFyTGl0ZXJhbFdpdGhvdXRTcGFjZSwgZXNjYXBlZE9yTGl0ZXJhbFdpdGhvdXRCYXIsXG5cdFx0XHRcdGVzY2FwZWRPclJlZ3VsYXJMaXRlcmFsLCB0ZW1wbGF0ZUNvbnRlbnRzLCB0ZW1wbGF0ZU5hbWUsIG9wZW5UZW1wbGF0ZSxcblx0XHRcdFx0Y2xvc2VUZW1wbGF0ZSwgZXhwcmVzc2lvbiwgcGFyYW1FeHByZXNzaW9uLCByZXN1bHQsXG5cdFx0XHRcdHBvcyA9IDA7XG5cblx0XHRcdC8vIFRyeSBwYXJzZXJzIHVudGlsIG9uZSB3b3JrcywgaWYgbm9uZSB3b3JrIHJldHVybiBudWxsXG5cdFx0XHRmdW5jdGlvbiBjaG9pY2UoIHBhcnNlclN5bnRheCApIHtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgaSwgcmVzdWx0O1xuXG5cdFx0XHRcdFx0Zm9yICggaSA9IDA7IGkgPCBwYXJzZXJTeW50YXgubGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQgPSBwYXJzZXJTeW50YXhbIGkgXSgpO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHJlc3VsdCAhPT0gbnVsbCApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVHJ5IHNldmVyYWwgcGFyc2VyU3ludGF4LWVzIGluIGEgcm93LlxuXHRcdFx0Ly8gQWxsIG11c3Qgc3VjY2VlZDsgb3RoZXJ3aXNlLCByZXR1cm4gbnVsbC5cblx0XHRcdC8vIFRoaXMgaXMgdGhlIG9ubHkgZWFnZXIgb25lLlxuXHRcdFx0ZnVuY3Rpb24gc2VxdWVuY2UoIHBhcnNlclN5bnRheCApIHtcblx0XHRcdFx0dmFyIGksIHJlcyxcblx0XHRcdFx0XHRvcmlnaW5hbFBvcyA9IHBvcyxcblx0XHRcdFx0XHRyZXN1bHQgPSBbXTtcblxuXHRcdFx0XHRmb3IgKCBpID0gMDsgaSA8IHBhcnNlclN5bnRheC5sZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0XHRyZXMgPSBwYXJzZXJTeW50YXhbIGkgXSgpO1xuXG5cdFx0XHRcdFx0aWYgKCByZXMgPT09IG51bGwgKSB7XG5cdFx0XHRcdFx0XHRwb3MgPSBvcmlnaW5hbFBvcztcblxuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmVzdWx0LnB1c2goIHJlcyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUnVuIHRoZSBzYW1lIHBhcnNlciBvdmVyIGFuZCBvdmVyIHVudGlsIGl0IGZhaWxzLlxuXHRcdFx0Ly8gTXVzdCBzdWNjZWVkIGEgbWluaW11bSBvZiBuIHRpbWVzOyBvdGhlcndpc2UsIHJldHVybiBudWxsLlxuXHRcdFx0ZnVuY3Rpb24gbk9yTW9yZSggbiwgcCApIHtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgb3JpZ2luYWxQb3MgPSBwb3MsXG5cdFx0XHRcdFx0XHRyZXN1bHQgPSBbXSxcblx0XHRcdFx0XHRcdHBhcnNlZCA9IHAoKTtcblxuXHRcdFx0XHRcdHdoaWxlICggcGFyc2VkICE9PSBudWxsICkge1xuXHRcdFx0XHRcdFx0cmVzdWx0LnB1c2goIHBhcnNlZCApO1xuXHRcdFx0XHRcdFx0cGFyc2VkID0gcCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggcmVzdWx0Lmxlbmd0aCA8IG4gKSB7XG5cdFx0XHRcdFx0XHRwb3MgPSBvcmlnaW5hbFBvcztcblxuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSGVscGVycyAtLSBqdXN0IG1ha2UgcGFyc2VyU3ludGF4IG91dCBvZiBzaW1wbGVyIEpTIGJ1aWx0aW4gdHlwZXNcblxuXHRcdFx0ZnVuY3Rpb24gbWFrZVN0cmluZ1BhcnNlciggcyApIHtcblx0XHRcdFx0dmFyIGxlbiA9IHMubGVuZ3RoO1xuXG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dmFyIHJlc3VsdCA9IG51bGw7XG5cblx0XHRcdFx0XHRpZiAoIG1lc3NhZ2Uuc2xpY2UoIHBvcywgcG9zICsgbGVuICkgPT09IHMgKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQgPSBzO1xuXHRcdFx0XHRcdFx0cG9zICs9IGxlbjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBtYWtlUmVnZXhQYXJzZXIoIHJlZ2V4ICkge1xuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZhciBtYXRjaGVzID0gbWVzc2FnZS5zbGljZSggcG9zICkubWF0Y2goIHJlZ2V4ICk7XG5cblx0XHRcdFx0XHRpZiAoIG1hdGNoZXMgPT09IG51bGwgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRwb3MgKz0gbWF0Y2hlc1sgMCBdLmxlbmd0aDtcblxuXHRcdFx0XHRcdHJldHVybiBtYXRjaGVzWyAwIF07XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdHBpcGUgPSBtYWtlU3RyaW5nUGFyc2VyKCAnfCcgKTtcblx0XHRcdGNvbG9uID0gbWFrZVN0cmluZ1BhcnNlciggJzonICk7XG5cdFx0XHRiYWNrc2xhc2ggPSBtYWtlU3RyaW5nUGFyc2VyKCAnXFxcXCcgKTtcblx0XHRcdGFueUNoYXJhY3RlciA9IG1ha2VSZWdleFBhcnNlciggL14uLyApO1xuXHRcdFx0ZG9sbGFyID0gbWFrZVN0cmluZ1BhcnNlciggJyQnICk7XG5cdFx0XHRkaWdpdHMgPSBtYWtlUmVnZXhQYXJzZXIoIC9eXFxkKy8gKTtcblx0XHRcdHJlZ3VsYXJMaXRlcmFsID0gbWFrZVJlZ2V4UGFyc2VyKCAvXltee31bXFxdJFxcXFxdLyApO1xuXHRcdFx0cmVndWxhckxpdGVyYWxXaXRob3V0QmFyID0gbWFrZVJlZ2V4UGFyc2VyKCAvXltee31bXFxdJFxcXFx8XS8gKTtcblx0XHRcdHJlZ3VsYXJMaXRlcmFsV2l0aG91dFNwYWNlID0gbWFrZVJlZ2V4UGFyc2VyKCAvXltee31bXFxdJFxcc10vICk7XG5cblx0XHRcdC8vIFRoZXJlIGlzIGEgZ2VuZXJhbCBwYXR0ZXJuOlxuXHRcdFx0Ly8gcGFyc2UgYSB0aGluZztcblx0XHRcdC8vIGlmIGl0IHdvcmtlZCwgYXBwbHkgdHJhbnNmb3JtLFxuXHRcdFx0Ly8gb3RoZXJ3aXNlIHJldHVybiBudWxsLlxuXHRcdFx0Ly8gQnV0IHVzaW5nIHRoaXMgYXMgYSBjb21iaW5hdG9yIHNlZW1zIHRvIGNhdXNlIHByb2JsZW1zXG5cdFx0XHQvLyB3aGVuIGNvbWJpbmVkIHdpdGggbk9yTW9yZSgpLlxuXHRcdFx0Ly8gTWF5IGJlIHNvbWUgc2NvcGluZyBpc3N1ZS5cblx0XHRcdGZ1bmN0aW9uIHRyYW5zZm9ybSggcCwgZm4gKSB7XG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dmFyIHJlc3VsdCA9IHAoKTtcblxuXHRcdFx0XHRcdHJldHVybiByZXN1bHQgPT09IG51bGwgPyBudWxsIDogZm4oIHJlc3VsdCApO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBVc2VkIHRvIGRlZmluZSBcImxpdGVyYWxzXCIgd2l0aGluIHRlbXBsYXRlIHBhcmFtZXRlcnMuIFRoZSBwaXBlXG5cdFx0XHQvLyBjaGFyYWN0ZXIgaXMgdGhlIHBhcmFtZXRlciBkZWxpbWV0ZXIsIHNvIGJ5IGRlZmF1bHRcblx0XHRcdC8vIGl0IGlzIG5vdCBhIGxpdGVyYWwgaW4gdGhlIHBhcmFtZXRlclxuXHRcdFx0ZnVuY3Rpb24gbGl0ZXJhbFdpdGhvdXRCYXIoKSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBuT3JNb3JlKCAxLCBlc2NhcGVkT3JMaXRlcmFsV2l0aG91dEJhciApKCk7XG5cblx0XHRcdFx0cmV0dXJuIHJlc3VsdCA9PT0gbnVsbCA/IG51bGwgOiByZXN1bHQuam9pbiggJycgKTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gbGl0ZXJhbCgpIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IG5Pck1vcmUoIDEsIGVzY2FwZWRPclJlZ3VsYXJMaXRlcmFsICkoKTtcblxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0ID09PSBudWxsID8gbnVsbCA6IHJlc3VsdC5qb2luKCAnJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBlc2NhcGVkTGl0ZXJhbCgpIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHNlcXVlbmNlKCBbIGJhY2tzbGFzaCwgYW55Q2hhcmFjdGVyIF0gKTtcblxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0ID09PSBudWxsID8gbnVsbCA6IHJlc3VsdFsgMSBdO1xuXHRcdFx0fVxuXG5cdFx0XHRjaG9pY2UoIFsgZXNjYXBlZExpdGVyYWwsIHJlZ3VsYXJMaXRlcmFsV2l0aG91dFNwYWNlIF0gKTtcblx0XHRcdGVzY2FwZWRPckxpdGVyYWxXaXRob3V0QmFyID0gY2hvaWNlKCBbIGVzY2FwZWRMaXRlcmFsLCByZWd1bGFyTGl0ZXJhbFdpdGhvdXRCYXIgXSApO1xuXHRcdFx0ZXNjYXBlZE9yUmVndWxhckxpdGVyYWwgPSBjaG9pY2UoIFsgZXNjYXBlZExpdGVyYWwsIHJlZ3VsYXJMaXRlcmFsIF0gKTtcblxuXHRcdFx0ZnVuY3Rpb24gcmVwbGFjZW1lbnQoKSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBzZXF1ZW5jZSggWyBkb2xsYXIsIGRpZ2l0cyBdICk7XG5cblx0XHRcdFx0aWYgKCByZXN1bHQgPT09IG51bGwgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gWyAnUkVQTEFDRScsIHBhcnNlSW50KCByZXN1bHRbIDEgXSwgMTAgKSAtIDEgXTtcblx0XHRcdH1cblxuXHRcdFx0dGVtcGxhdGVOYW1lID0gdHJhbnNmb3JtKFxuXHRcdFx0XHQvLyBzZWUgJHdnTGVnYWxUaXRsZUNoYXJzXG5cdFx0XHRcdC8vIG5vdCBhbGxvd2luZyA6IGR1ZSB0byB0aGUgbmVlZCB0byBjYXRjaCBcIlBMVVJBTDokMVwiXG5cdFx0XHRcdG1ha2VSZWdleFBhcnNlciggL15bICFcIiQmJygpKiwuLzAtOTs9P0BBLVpeX2BhLXp+XFx4ODAtXFx4RkYrLV0rLyApLFxuXG5cdFx0XHRcdGZ1bmN0aW9uICggcmVzdWx0ICkge1xuXHRcdFx0XHRcdHJldHVybiByZXN1bHQudG9TdHJpbmcoKTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblxuXHRcdFx0ZnVuY3Rpb24gdGVtcGxhdGVQYXJhbSgpIHtcblx0XHRcdFx0dmFyIGV4cHIsXG5cdFx0XHRcdFx0cmVzdWx0ID0gc2VxdWVuY2UoIFsgcGlwZSwgbk9yTW9yZSggMCwgcGFyYW1FeHByZXNzaW9uICkgXSApO1xuXG5cdFx0XHRcdGlmICggcmVzdWx0ID09PSBudWxsICkge1xuXHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZXhwciA9IHJlc3VsdFsgMSBdO1xuXG5cdFx0XHRcdC8vIHVzZSBhIFwiQ09OQ0FUXCIgb3BlcmF0b3IgaWYgdGhlcmUgYXJlIG11bHRpcGxlIG5vZGVzLFxuXHRcdFx0XHQvLyBvdGhlcndpc2UgcmV0dXJuIHRoZSBmaXJzdCBub2RlLCByYXcuXG5cdFx0XHRcdHJldHVybiBleHByLmxlbmd0aCA+IDEgPyBbICdDT05DQVQnIF0uY29uY2F0KCBleHByICkgOiBleHByWyAwIF07XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIHRlbXBsYXRlV2l0aFJlcGxhY2VtZW50KCkge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gc2VxdWVuY2UoIFsgdGVtcGxhdGVOYW1lLCBjb2xvbiwgcmVwbGFjZW1lbnQgXSApO1xuXG5cdFx0XHRcdHJldHVybiByZXN1bHQgPT09IG51bGwgPyBudWxsIDogWyByZXN1bHRbIDAgXSwgcmVzdWx0WyAyIF0gXTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gdGVtcGxhdGVXaXRoT3V0UmVwbGFjZW1lbnQoKSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBzZXF1ZW5jZSggWyB0ZW1wbGF0ZU5hbWUsIGNvbG9uLCBwYXJhbUV4cHJlc3Npb24gXSApO1xuXG5cdFx0XHRcdHJldHVybiByZXN1bHQgPT09IG51bGwgPyBudWxsIDogWyByZXN1bHRbIDAgXSwgcmVzdWx0WyAyIF0gXTtcblx0XHRcdH1cblxuXHRcdFx0dGVtcGxhdGVDb250ZW50cyA9IGNob2ljZSggW1xuXHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dmFyIHJlcyA9IHNlcXVlbmNlKCBbXG5cdFx0XHRcdFx0XHQvLyB0ZW1wbGF0ZXMgY2FuIGhhdmUgcGxhY2Vob2xkZXJzIGZvciBkeW5hbWljXG5cdFx0XHRcdFx0XHQvLyByZXBsYWNlbWVudCBlZzoge3tQTFVSQUw6JDF8b25lIGNhcnwkMSBjYXJzfX1cblx0XHRcdFx0XHRcdC8vIG9yIG5vIHBsYWNlaG9sZGVycyBlZzpcblx0XHRcdFx0XHRcdC8vIHt7R1JBTU1BUjpnZW5pdGl2ZXx7e1NJVEVOQU1FfX19XG5cdFx0XHRcdFx0XHRjaG9pY2UoIFsgdGVtcGxhdGVXaXRoUmVwbGFjZW1lbnQsIHRlbXBsYXRlV2l0aE91dFJlcGxhY2VtZW50IF0gKSxcblx0XHRcdFx0XHRcdG5Pck1vcmUoIDAsIHRlbXBsYXRlUGFyYW0gKVxuXHRcdFx0XHRcdF0gKTtcblxuXHRcdFx0XHRcdHJldHVybiByZXMgPT09IG51bGwgPyBudWxsIDogcmVzWyAwIF0uY29uY2F0KCByZXNbIDEgXSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dmFyIHJlcyA9IHNlcXVlbmNlKCBbIHRlbXBsYXRlTmFtZSwgbk9yTW9yZSggMCwgdGVtcGxhdGVQYXJhbSApIF0gKTtcblxuXHRcdFx0XHRcdGlmICggcmVzID09PSBudWxsICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIFsgcmVzWyAwIF0gXS5jb25jYXQoIHJlc1sgMSBdICk7XG5cdFx0XHRcdH1cblx0XHRcdF0gKTtcblxuXHRcdFx0b3BlblRlbXBsYXRlID0gbWFrZVN0cmluZ1BhcnNlciggJ3t7JyApO1xuXHRcdFx0Y2xvc2VUZW1wbGF0ZSA9IG1ha2VTdHJpbmdQYXJzZXIoICd9fScgKTtcblxuXHRcdFx0ZnVuY3Rpb24gdGVtcGxhdGUoKSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBzZXF1ZW5jZSggWyBvcGVuVGVtcGxhdGUsIHRlbXBsYXRlQ29udGVudHMsIGNsb3NlVGVtcGxhdGUgXSApO1xuXG5cdFx0XHRcdHJldHVybiByZXN1bHQgPT09IG51bGwgPyBudWxsIDogcmVzdWx0WyAxIF07XG5cdFx0XHR9XG5cblx0XHRcdGV4cHJlc3Npb24gPSBjaG9pY2UoIFsgdGVtcGxhdGUsIHJlcGxhY2VtZW50LCBsaXRlcmFsIF0gKTtcblx0XHRcdHBhcmFtRXhwcmVzc2lvbiA9IGNob2ljZSggWyB0ZW1wbGF0ZSwgcmVwbGFjZW1lbnQsIGxpdGVyYWxXaXRob3V0QmFyIF0gKTtcblxuXHRcdFx0ZnVuY3Rpb24gc3RhcnQoKSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBuT3JNb3JlKCAwLCBleHByZXNzaW9uICkoKTtcblxuXHRcdFx0XHRpZiAoIHJlc3VsdCA9PT0gbnVsbCApIHtcblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBbICdDT05DQVQnIF0uY29uY2F0KCByZXN1bHQgKTtcblx0XHRcdH1cblxuXHRcdFx0cmVzdWx0ID0gc3RhcnQoKTtcblxuXHRcdFx0Lypcblx0XHRcdCAqIEZvciBzdWNjZXNzLCB0aGUgcG9zIG11c3QgaGF2ZSBnb3R0ZW4gdG8gdGhlIGVuZCBvZiB0aGUgaW5wdXRcblx0XHRcdCAqIGFuZCByZXR1cm5lZCBhIG5vbi1udWxsLlxuXHRcdFx0ICogbi5iLiBUaGlzIGlzIHBhcnQgb2YgbGFuZ3VhZ2UgaW5mcmFzdHJ1Y3R1cmUsIHNvIHdlIGRvIG5vdCB0aHJvdyBhblxuXHRcdFx0ICogaW50ZXJuYXRpb25hbGl6YWJsZSBtZXNzYWdlLlxuXHRcdFx0ICovXG5cdFx0XHRpZiAoIHJlc3VsdCA9PT0gbnVsbCB8fCBwb3MgIT09IG1lc3NhZ2UubGVuZ3RoICkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoICdQYXJzZSBlcnJvciBhdCBwb3NpdGlvbiAnICsgcG9zLnRvU3RyaW5nKCkgKyAnIGluIGlucHV0OiAnICsgbWVzc2FnZSApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHR9O1xuXG5cdCQuZXh0ZW5kKCAkLmkxOG4ucGFyc2VyLCBuZXcgTWVzc2FnZVBhcnNlcigpICk7XG59KCBqUXVlcnkgKSApOyIsInZhciBjb2RlRXhlcmNpc2VzO1xudmFyIHByZXNlbnRlckNzc0xpbms7XG52YXIgcHJlc2VudE1vZGVJbml0aWFsaXplZCA9IGZhbHNlO1xuXG5mdW5jdGlvbiBwcmVzZW50VG9nZ2xlKCkge1xuICAgIGlmICghcHJlc2VudE1vZGVJbml0aWFsaXplZCkge1xuICAgICAgICBwcmVzZW50TW9kZVNldHVwKCk7XG4gICAgICAgIHByZXNlbnRNb2RlSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIH1cbiAgICBsZXQgYm9kID0gJChcImJvZHlcIik7XG4gICAgbGV0IHByZXNlbnRDbGFzcyA9IFwicHJlc2VudFwiO1xuICAgIGxldCBmdWxsSGVpZ2h0Q2xhc3MgPSBcImZ1bGwtaGVpZ2h0XCI7XG4gICAgbGV0IGJvdHRvbUNsYXNzID0gXCJib3R0b21cIjtcbiAgICBpZiAoYm9kLmhhc0NsYXNzKHByZXNlbnRDbGFzcykpIHtcbiAgICAgICAgJChcIi5zZWN0aW9uICpcIilcbiAgICAgICAgICAgIC5ub3QoXG4gICAgICAgICAgICAgICAgXCJoMSwgLnByZXNlbnRhdGlvbi10aXRsZSwgLmJ0bi1wcmVzZW50ZXIsIC5ydW5lc3RvbmUsIC5ydW5lc3RvbmUgKiwgLnNlY3Rpb24sIC5wcmUsIGNvZGVcIlxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpOyAvL3Nob3cgZXZlcnl0aGluZ1xuICAgICAgICAkKFwiI2NvbXBsZXRpb25CdXR0b25cIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XG4gICAgICAgIGJvZC5yZW1vdmVDbGFzcyhwcmVzZW50Q2xhc3MpO1xuICAgICAgICAkKFwiLlwiICsgZnVsbEhlaWdodENsYXNzKS5yZW1vdmVDbGFzcyhmdWxsSGVpZ2h0Q2xhc3MpO1xuICAgICAgICAkKFwiLlwiICsgYm90dG9tQ2xhc3MpLnJlbW92ZUNsYXNzKGJvdHRvbUNsYXNzKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJwcmVzZW50TW9kZVwiLCBcInRleHRcIik7XG4gICAgICAgIGNvZGVFeGVyY2lzZXMucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XG4gICAgICAgIHByZXNlbnRlckNzc0xpbmsuZGlzYWJsZWQgPSB0cnVlOyAvLyBkaXNhYmxlIHByZXNlbnRfbW9kZS5jc3NcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKFwiLnNlY3Rpb24gKlwiKVxuICAgICAgICAgICAgLm5vdChcbiAgICAgICAgICAgICAgICBcImgxLCAucHJlc2VudGF0aW9uLXRpdGxlLCAuYnRuLXByZXNlbnRlciwgLnJ1bmVzdG9uZSwgLnJ1bmVzdG9uZSAqLCAuc2VjdGlvbiwgLnByZSwgY29kZVwiXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkQ2xhc3MoXCJoaWRkZW5cIik7IC8vIGhpZGUgZXh0cmFuZW91cyBzdHVmZlxuICAgICAgICAkKFwiI2NvbXBsZXRpb25CdXR0b25cIikuYWRkQ2xhc3MoXCJoaWRkZW5cIik7XG4gICAgICAgIGJvZC5hZGRDbGFzcyhwcmVzZW50Q2xhc3MpO1xuICAgICAgICBib2QuYWRkQ2xhc3MoZnVsbEhlaWdodENsYXNzKTtcbiAgICAgICAgJChcImh0bWxcIikuYWRkQ2xhc3MoZnVsbEhlaWdodENsYXNzKTtcbiAgICAgICAgJChcIi5zZWN0aW9uIC5ydW5lc3RvbmVcIikuYWRkQ2xhc3MoZnVsbEhlaWdodENsYXNzKTtcbiAgICAgICAgJChcIi5hYy1jYXB0aW9uXCIpLmFkZENsYXNzKGJvdHRvbUNsYXNzKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJwcmVzZW50TW9kZVwiLCBwcmVzZW50Q2xhc3MpO1xuICAgICAgICBsb2FkUHJlc2VudGVyQ3NzKCk7IC8vIHByZXNlbnRfbW9kZS5jc3Mgc2hvdWxkIG9ubHkgYXBwbHkgd2hlbiBpbiBwcmVzZW50ZXIgbW9kZS5cbiAgICAgICAgYWN0aXZhdGVFeGVyY2lzZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbG9hZFByZXNlbnRlckNzcygpIHtcbiAgICBwcmVzZW50ZXJDc3NMaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG4gICAgcHJlc2VudGVyQ3NzTGluay50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuICAgIHByZXNlbnRlckNzc0xpbmsuaHJlZiA9IFwiLi4vX3N0YXRpYy9wcmVzZW50ZXJfbW9kZS5jc3NcIjtcbiAgICBwcmVzZW50ZXJDc3NMaW5rLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXS5hcHBlbmRDaGlsZChwcmVzZW50ZXJDc3NMaW5rKTtcbn1cblxuZnVuY3Rpb24gcHJlc2VudE1vZGVTZXR1cCgpIHtcbiAgICAvLyBtb3ZlZCB0aGlzIG91dCBvZiBjb25maWd1cmVcbiAgICBsZXQgZGF0YUNvbXBvbmVudCA9ICQoXCJbZGF0YS1jaGlsZGNvbXBvbmVudF1cIik7XG5cbiAgICAvLyB0aGlzIHN0aWxsIGxlYXZlcyBzb21lIHRoaW5ncyBzZW1pLW1lc3NlZCB1cCB3aGVuIHlvdSBleGl0IHByZXNlbnRlciBtb2RlLlxuICAgIC8vIGJ1dCBpbnN0cnVjdG9ycyB3aWxsIHByb2JhYmx5IGp1c3QgbGVhcm4gdG8gcmVmcmVzaCB0aGUgcGFnZS5cbiAgICBkYXRhQ29tcG9uZW50LmFkZENsYXNzKFwicnVuZXN0b25lXCIpO1xuICAgIGRhdGFDb21wb25lbnQucGFyZW50KCkuY2xvc2VzdChcImRpdlwiKS5ub3QoXCIuc2VjdGlvblwiKS5hZGRDbGFzcyhcInJ1bmVzdG9uZVwiKTtcbiAgICBkYXRhQ29tcG9uZW50LnBhcmVudCgpLmNsb3Nlc3QoXCJkaXZcIikuY3NzKFwibWF4LXdpZHRoXCIsIFwibm9uZVwiKTtcblxuICAgIGRhdGFDb21wb25lbnQuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgbGV0IG1lID0gJCh0aGlzKTtcbiAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgLmZpbmQoXCIuYWNfY29kZV9kaXYsIC5hY19vdXRwdXRcIilcbiAgICAgICAgICAgIC53cmFwQWxsKFwiPGRpdiBjbGFzcz0nYWMtYmxvY2snIHN0eWxlPSd3aWR0aDogMTAwJTsnPjwvZGl2PlwiKTtcbiAgICB9KTtcblxuICAgIGNvZGVsZW5zTGlzdGVuZXIoNTAwKTtcbiAgICAkKFwiLnNlY3Rpb24gaW1nXCIpLndyYXAoJzxkaXYgY2xhc3M9XCJydW5lc3RvbmVcIj4nKTtcbiAgICBjb2RlRXhlcmNpc2VzID0gJChcIi5ydW5lc3RvbmVcIikubm90KFwiLnJ1bmVzdG9uZSAucnVuZXN0b25lXCIpO1xuICAgIC8vIGNvZGVFeGVyY2lzZXMuZWFjaChmdW5jdGlvbigpe1xuICAgICQoXCJoMVwiKS5iZWZvcmUoXG4gICAgICAgIFwiPGRpdiBjbGFzcz0ncHJlc2VudGF0aW9uLXRpdGxlJz4gXFxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz0ncHJldi1leGVyY2lzZSBidG4tcHJlc2VudGVyIGJ0bi1ncmV5LW91dGxpbmUnIG9uY2xpY2s9J3ByZXZFeGVyY2lzZSgpJz5CYWNrPC9idXR0b24+IFxcXG4gICAgICAgIDxidXR0b24gY2xhc3M9J25leHQtZXhlcmNpc2UgYnRuLXByZXNlbnRlciBidG4tZ3JleS1zb2xpZCcgb25jbGljaz0nbmV4dEV4ZXJjaXNlKCknPk5leHQ8L2J1dHRvbj4gXFxcbiAgICAgIDwvZGl2PlwiXG4gICAgKTtcbn1cbmZ1bmN0aW9uIGdldEFjdGl2ZUV4ZXJjaXNlKCkge1xuICAgIHJldHVybiAoYWN0aXZlID0gY29kZUV4ZXJjaXNlcy5maWx0ZXIoXCIuYWN0aXZlXCIpKTtcbn1cblxuZnVuY3Rpb24gYWN0aXZhdGVFeGVyY2lzZShpbmRleCkge1xuICAgIGlmICh0eXBlb2YgaW5kZXggPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpbmRleCA9IDA7XG4gICAgfVxuXG4gICAgbGV0IGFjdGl2ZSA9IGdldEFjdGl2ZUV4ZXJjaXNlKCk7XG5cbiAgICBpZiAoY29kZUV4ZXJjaXNlcy5sZW5ndGgpIHtcbiAgICAgICAgYWN0aXZlLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICBhY3RpdmUgPSAkKGNvZGVFeGVyY2lzZXNbaW5kZXhdKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgYWN0aXZlLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpO1xuICAgICAgICBjb2RlRXhlcmNpc2VzLm5vdChjb2RlRXhlcmNpc2VzLmZpbHRlcihcIi5hY3RpdmVcIikpLmFkZENsYXNzKFwiaGlkZGVuXCIpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbmV4dEV4ZXJjaXNlKCkge1xuICAgIGxldCBhY3RpdmUgPSBnZXRBY3RpdmVFeGVyY2lzZSgpO1xuICAgIGxldCBuZXh0SW5kZXggPSBjb2RlRXhlcmNpc2VzLmluZGV4KGFjdGl2ZSkgKyAxO1xuICAgIGlmIChuZXh0SW5kZXggPCBjb2RlRXhlcmNpc2VzLmxlbmd0aCkge1xuICAgICAgICBhY3RpdmF0ZUV4ZXJjaXNlKG5leHRJbmRleCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBwcmV2RXhlcmNpc2UoKSB7XG4gICAgbGV0IGFjdGl2ZSA9IGdldEFjdGl2ZUV4ZXJjaXNlKCk7XG4gICAgbGV0IHByZXZJbmRleCA9IGNvZGVFeGVyY2lzZXMuaW5kZXgoYWN0aXZlKSAtIDE7XG4gICAgaWYgKHByZXZJbmRleCA+PSAwKSB7XG4gICAgICAgIGFjdGl2YXRlRXhlcmNpc2UocHJldkluZGV4KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNvbmZpZ3VyZSgpIHtcbiAgICBsZXQgcmlnaHROYXYgPSAkKFwiLm5hdmJhci1yaWdodFwiKTtcbiAgICByaWdodE5hdi5wcmVwZW5kKFxuICAgICAgICBcIjxsaSBjbGFzcz0nZHJvcGRvd24gdmlldy10b2dnbGUnPiBcXFxuICAgICAgPGxhYmVsPlZpZXc6IFxcXG4gICAgICAgIDxzZWxlY3QgY2xhc3M9J21vZGUtc2VsZWN0Jz4gXFxcbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPSd0ZXh0Jz5UZXh0Ym9vazwvb3B0aW9uPiBcXFxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9J3ByZXNlbnQnPkNvZGUgUHJlc2VudGVyPC9vcHRpb24+IFxcXG4gICAgICAgIDwvc2VsZWN0PiBcXFxuICAgICAgPC9sYWJlbD4gXFxcbiAgICA8L2xpPlwiXG4gICAgKTtcblxuICAgIGxldCBtb2RlU2VsZWN0ID0gJChcIi5tb2RlLXNlbGVjdFwiKS5jaGFuZ2UocHJlc2VudFRvZ2dsZSk7XG59XG5cbmZ1bmN0aW9uIGNvZGVsZW5zTGlzdGVuZXIoZHVyYXRpb24pIHtcbiAgICAvLyAkKFwiLkV4ZWN1dGlvblZpc3VhbGl6ZXJcIikubGVuZ3RoID8gY29uZmlndXJlQ29kZWxlbnMoKSA6IHNldFRpbWVvdXQoY29kZWxlbnNMaXN0ZW5lciwgZHVyYXRpb24pO1xuICAgIC8vIGNvbmZpZ3VyZUNvZGVsZW5zKCk7XG59XG5cbmZ1bmN0aW9uIGNvbmZpZ3VyZUNvZGVsZW5zKCkge1xuICAgIGxldCBhY0NvZGVUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNFwiKTtcbiAgICBhY0NvZGVUaXRsZS50ZXh0Q29udGVudCA9IFwiQWN0aXZlIENvZGUgV2luZG93XCI7XG4gICAgbGV0IGFjQ29kZSA9ICQoXCIuYWNfY29kZV9kaXZcIikucmVtb3ZlQ2xhc3MoXCJjb2wtbWQtMTJcIik7XG4gICAgJChcIi5hY19jb2RlX2RpdlwiKS5hZGRDbGFzcyhcImNvbC1tZC02XCIpO1xuICAgIGFjQ29kZS5wcmVwZW5kKGFjQ29kZVRpdGxlKTtcblxuICAgIGFjT3V0VGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDRcIik7XG4gICAgYWNPdXRUaXRsZS50ZXh0Q29udGVudCA9IFwiT3V0cHV0IFdpbmRvd1wiO1xuICAgIGxldCBhY091dCA9ICQoXCIuYWNfb3V0cHV0XCIpLmFkZENsYXNzKFwiY29sLW1kLTZcIik7XG4gICAgJChcIi5hY19vdXRwdXRcIikucHJlcGVuZChhY091dFRpdGxlKTtcblxuICAgIGxldCBza2V0Y2hwYWRUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNFwiKTtcbiAgICBza2V0Y2hwYWRUaXRsZS50ZXh0Q29udGVudCA9IFwiU2tldGNocGFkXCI7XG4gICAgbGV0IHNrZXRjaHBhZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICQoc2tldGNocGFkKS5hZGRDbGFzcyhcInNrZXRjaHBhZFwiKTtcbiAgICBsZXQgc2tldGNocGFkQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAkKHNrZXRjaHBhZENvbnRhaW5lcikuYWRkQ2xhc3MoXCJza2V0Y2hwYWQtY29udGFpbmVyXCIpO1xuICAgIHNrZXRjaHBhZENvbnRhaW5lci5hcHBlbmRDaGlsZChza2V0Y2hwYWRUaXRsZSk7XG4gICAgc2tldGNocGFkQ29udGFpbmVyLmFwcGVuZENoaWxkKHNrZXRjaHBhZCk7XG4gICAgLy8kKCcuYWNfb3V0cHV0JykuYXBwZW5kKHNrZXRjaHBhZENvbnRhaW5lcik7XG5cbiAgICBsZXQgdmlzdWFsaXplcnMgPSAkKFwiLkV4ZWN1dGlvblZpc3VhbGl6ZXJcIik7XG5cbiAgICBjb25zb2xlLmxvZyhcIkVjb250YWluZXI6IFwiLCB0aGlzLmVDb250YWluZXIpO1xuXG4gICAgJChcIltkYXRhLWNoaWxkY29tcG9uZW50XVwiKS5vbihcImNsaWNrXCIsIFwiYnV0dG9uLnJvdy1tb2RlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KFwiW2RhdGEtY2hpbGRjb21wb25lbnRdXCIpLnJlbW92ZUNsYXNzKFwiY2FyZC1tb2RlXCIpO1xuICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoXCJbZGF0YS1jaGlsZGNvbXBvbmVudF1cIikuYWRkQ2xhc3MoXCJyb3ctbW9kZVwiKTtcbiAgICAgICAgJCh0aGlzKS5uZXh0KFwiLmNhcmQtbW9kZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZS1sYXlvdXRcIik7XG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmUtbGF5b3V0XCIpO1xuICAgIH0pO1xuXG4gICAgJChcIltkYXRhLWNoaWxkY29tcG9uZW50XVwiKS5vbihcImNsaWNrXCIsIFwiYnV0dG9uLmNhcmQtbW9kZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykuY2xvc2VzdChcIltkYXRhLWNoaWxkY29tcG9uZW50XVwiKS5yZW1vdmVDbGFzcyhcInJvdy1tb2RlXCIpO1xuICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoXCJbZGF0YS1jaGlsZGNvbXBvbmVudF1cIikuYWRkQ2xhc3MoXCJjYXJkLW1vZGVcIik7XG4gICAgICAgICQodGhpcykucHJldihcIi5yb3ctbW9kZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZS1sYXlvdXRcIik7XG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmUtbGF5b3V0XCIpO1xuICAgIH0pO1xuXG4gICAgJChcIltkYXRhLWNoaWxkY29tcG9uZW50XSAuYWNfc2VjdGlvblwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5wcmVwZW5kKFxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwcmVzZW50YXRpb24tb3B0aW9uc1wiPjxidXR0b24gY2xhc3M9XCJyb3ctbW9kZSBsYXlvdXQtYnRuXCI+PGltZyBzcmM9XCIuLi9faW1hZ2VzL3Jvdy1idG4tY29udGVudC5wbmdcIiBhbHQ9XCJSb3dzXCI+PC9idXR0b24+PGJ1dHRvbiBjbGFzcz1cImNhcmQtbW9kZSBsYXlvdXQtYnRuXCI+PGltZyBzcmM9XCIuLi9faW1hZ2VzL2NhcmQtYnRuLWNvbnRlbnQucG5nXCIgYWx0PVwiQ2FyZFwiPjwvYnV0dG9uPjwvZGl2PidcbiAgICAgICAgKTtcbiAgICB9KTtcblxuICAgIHZpc3VhbGl6ZXJzLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIGxldCBtZSA9ICQodGhpcyk7XG4gICAgICAgIGxldCBjb2wxID0gbWUuZmluZChcIiN2aXpMYXlvdXRUZEZpcnN0XCIpO1xuICAgICAgICBsZXQgY29sMiA9IG1lLmZpbmQoXCIjdml6TGF5b3V0VGRTZWNvbmRcIik7XG4gICAgICAgIGxldCBkYXRhVmlzID0gbWUuZmluZChcIiNkYXRhVml6XCIpO1xuICAgICAgICBsZXQgc3RhY2tIZWFwVGFibGUgPSBtZS5maW5kKFwiI3N0YWNrSGVhcFRhYmxlXCIpO1xuICAgICAgICBsZXQgb3V0cHV0ID0gbWUuZmluZChcIiNwcm9nT3V0cHV0c1wiKTtcbiAgICAgICAgb3V0cHV0LmNzcyhcImRpc3BsYXlcIiwgXCJibG9ja1wiKTtcbiAgICAgICAgbWUucGFyZW50KCkucHJlcGVuZChcbiAgICAgICAgICAgIFwiPGRpdiBjbGFzcz0ncHJlc2VudGF0aW9uLXRpdGxlJz48ZGl2IGNsYXNzPSd0aXRsZS10ZXh0Jz4gRXhhbXBsZSBcIiArXG4gICAgICAgICAgICAgICAgKE51bWJlcihpbmRleCkgKyAxKSArXG4gICAgICAgICAgICAgICAgXCI8L2Rpdj48L2Rpdj5cIlxuICAgICAgICApO1xuICAgIH0pO1xuXG4gICAgYWNDb2RlLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgc2VjdGlvbiA9ICQodGhpcykuY2xvc2VzdChcIi5hYy1ibG9ja1wiKS5wYXJlbnQoKTtcbiAgICAgICAgY29uc29sZS5sb2coc2VjdGlvbiwgc2VjdGlvbi5sZW5ndGgpO1xuICAgICAgICBzZWN0aW9uLmFwcGVuZChza2V0Y2hwYWRDb250YWluZXIpO1xuICAgIH0pO1xuXG4gICAgJChcImJ1dHRvbi5jYXJkLW1vZGVcIikuY2xpY2soKTtcblxuICAgIGxldCBtb2RlU2VsZWN0ID0gJChcIi5tb2RlLXNlbGVjdFwiKTtcbiAgICBsZXQgbW9kZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicHJlc2VudE1vZGVcIik7XG4gICAgaWYgKG1vZGUgPT0gXCJwcmVzZW50XCIpIHtcbiAgICAgICAgbW9kZVNlbGVjdC52YWwoXCJwcmVzZW50XCIpO1xuICAgICAgICBtb2RlU2VsZWN0LmNoYW5nZSgpO1xuICAgIH1cbn1cblxuJChkb2N1bWVudCkub24oXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuICAgIC8vIGlmIHVzZXIgaXMgaW5zdHJ1Y3RvciwgZW5hYmxlIHByZXNlbnRlciBtb2RlXG4gICAgaWYgKGVCb29rQ29uZmlnLmlzSW5zdHJ1Y3Rvcikge1xuICAgICAgICBjb25maWd1cmUoKTtcbiAgICB9XG59KTtcbiIsIi8qXG4gICAgU3VwcG9ydCBmdW5jdGlvbnMgZm9yIFByZVRlWHQgYm9va3MgcnVubmluZyBvbiBSdW5lc3RvbmVcblxuKi9cblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4vcnVuZXN0b25lYmFzZS5qc1wiO1xuXG5mdW5jdGlvbiBzZXR1cFBUWEV2ZW50cygpIHtcbiAgICBsZXQgcmIgPSBuZXcgUnVuZXN0b25lQmFzZSgpO1xuICAgIC8vIGxvZyBhbiBldmVudCB3aGVuIGEga25vd2wgaXMgb3BlbmVkLlxuICAgICQoXCJbZGF0YS1rbm93bFwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IGRpdl9pZCA9ICQodGhpcykuZGF0YShcInJlZmlkXCIpO1xuICAgICAgICByYi5sb2dCb29rRXZlbnQoeyBldmVudDogXCJrbm93bFwiLCBhY3Q6IFwiY2xpY2tcIiwgZGl2X2lkOiBkaXZfaWQgfSk7XG4gICAgfSk7XG4gICAgLy8gbG9nIGFuIGV2ZW50IHdoZW4gYSBzYWdlIGNlbGwgaXMgZXZhbHVhdGVkXG4gICAgJChcIi5zYWdlY2VsbF9ldmFsQnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBmaW5kIHBhcmVudHNcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9ICQodGhpcykuY2xvc2VzdChcIi5zYWdlY2VsbC1zYWdlXCIpO1xuICAgICAgICBsZXQgY29kZSA9ICQoY29udGFpbmVyWzBdKS5maW5kKFwiLnNhZ2VjZWxsX2lucHV0XCIpWzBdLnRleHRDb250ZW50O1xuICAgICAgICByYi5sb2dCb29rRXZlbnQoeyBldmVudDogXCJzYWdlXCIsIGFjdDogXCJydW5cIiwgZGl2X2lkOiBjb250YWluZXJbMF0uaWQgfSk7XG4gICAgfSk7XG4gICAgaWYgKCFlQm9va0NvbmZpZy5pc0luc3RydWN0b3IpIHtcbiAgICAgICAgJChcIi5jb21tZW50YXJ5XCIpLmhpZGUoKTtcbiAgICB9XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coXCJzZXR0aW5nIHVwIHByZXRleHRcIik7XG4gICAgc2V0dXBQVFhFdmVudHMoKTtcbiAgICBsZXQgd3JhcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpbWFyeS1uYXZiYXItc3RpY2t5LXdyYXBwZXJcIik7XG4gICAgaWYgKHdyYXApIHtcbiAgICAgICAgd3JhcC5zdHlsZS5vdmVyZmxvdz1cInZpc2libGVcIjtcbiAgICB9XG59KTtcbiIsIi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiB8ZG9jbmFtZXwgLSBSdW5lc3RvbmUgQmFzZSBDbGFzc1xuICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIEFsbCBydW5lc3RvbmUgY29tcG9uZW50cyBzaG91bGQgaW5oZXJpdCBmcm9tIFJ1bmVzdG9uZUJhc2UuIEluIGFkZGl0aW9uIGFsbCBydW5lc3RvbmUgY29tcG9uZW50cyBzaG91bGQgZG8gdGhlIGZvbGxvd2luZyB0aGluZ3M6XG4gKlxuICogMS4gICBFbnN1cmUgdGhhdCB0aGV5IGFyZSB3cmFwcGVkIGluIGEgZGl2IHdpdGggdGhlIGNsYXNzIHJ1bmVzdG9uZVxuICogMi4gICBXcml0ZSB0aGVpciBzb3VyY2UgQU5EIHRoZWlyIGdlbmVyYXRlZCBodG1sIHRvIHRoZSBkYXRhYmFzZSBpZiB0aGUgZGF0YWJhc2UgaXMgY29uZmlndXJlZFxuICogMy4gICBQcm9wZXJseSBzYXZlIGFuZCByZXN0b3JlIHRoZWlyIGFuc3dlcnMgdXNpbmcgdGhlIGNoZWNrU2VydmVyIG1lY2hhbmlzbSBpbiB0aGlzIGJhc2UgY2xhc3MuIEVhY2ggY29tcG9uZW50IG11c3QgcHJvdmlkZSBhbiBpbXBsZW1lbnRhdGlvbiBvZjpcbiAqXG4gKiAgICAgIC0gICAgY2hlY2tMb2NhbFN0b3JhZ2VcbiAqICAgICAgLSAgICBzZXRMb2NhbFN0b3JhZ2VcbiAqICAgICAgLSAgICByZXN0b3JlQW5zd2Vyc1xuICogICAgICAtICAgIGRpc2FibGVJbnRlcmFjdGlvblxuICpcbiAqIDQuICAgcHJvdmlkZSBhIFNlbGVuaXVtIGJhc2VkIHVuaXQgdGVzdFxuICovXG5cbmltcG9ydCB7IHBhZ2VQcm9ncmVzc1RyYWNrZXIgfSBmcm9tIFwiLi9ib29rZnVuY3MuanNcIjtcbi8vaW1wb3J0IFwiLi8uLi9zdHlsZXMvcnVuZXN0b25lLWN1c3RvbS1zcGhpbngtYm9vdHN0cmFwLmNzc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50X3JlYWR5X3Byb21pc2UgPSBuZXcgUHJvbWlzZShcbiAgICAgICAgICAgIChyZXNvbHZlKSA9PiAodGhpcy5fY29tcG9uZW50X3JlYWR5X3Jlc29sdmVfZm4gPSByZXNvbHZlKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLm9wdGlvbmFsID0gZmFsc2U7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93LmFsbENvbXBvbmVudHMgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5hbGxDb21wb25lbnRzID0gW107XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93LmFsbENvbXBvbmVudHMucHVzaCh0aGlzKTtcbiAgICAgICAgaWYgKG9wdHMpIHtcbiAgICAgICAgICAgIHRoaXMuc2lkID0gb3B0cy5zaWQ7XG4gICAgICAgICAgICB0aGlzLmdyYWRlcmFjdGl2ZSA9IG9wdHMuZ3JhZGVyYWN0aXZlO1xuICAgICAgICAgICAgdGhpcy5zaG93ZmVlZGJhY2sgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKG9wdHMudGltZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzVGltZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdHMuZW5mb3JjZURlYWRsaW5lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWFkbGluZSA9IG9wdHMuZGVhZGxpbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJChvcHRzLm9yaWcpLmRhdGEoXCJvcHRpb25hbFwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9uYWwgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbmFsID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0cy5zZWxlY3Rvcl9pZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0b3JfaWQgPSBvcHRzLnNlbGVjdG9yX2lkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRzLmFzc2Vzc21lbnRUYWtlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuYXNzZXNzbWVudFRha2VuID0gb3B0cy5hc3Nlc3NtZW50VGFrZW47XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgdG8gdHJ1ZSBhcyB0aGlzIG9wdCBpcyBvbmx5IHByb3ZpZGVkIGZyb20gYSB0aW1lZEFzc2Vzc21lbnRcbiAgICAgICAgICAgICAgICB0aGlzLmFzc2Vzc21lbnRUYWtlbiA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUaGlzIGlzIGZvciB0aGUgc2VsZWN0cXVlc3Rpb24gcG9pbnRzXG4gICAgICAgICAgICAvLyBJZiBhIHNlbGVjdHF1ZXN0aW9uIGlzIHBhcnQgb2YgYSB0aW1lZCBleGFtIGl0IHdpbGwgZ2V0XG4gICAgICAgICAgICAvLyB0aGUgdGltZWRXcmFwcGVyIG9wdGlvbnMuXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdHMudGltZWRXcmFwcGVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lZFdyYXBwZXIgPSBvcHRzLnRpbWVkV3JhcHBlcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gSG93ZXZlciBzb21ldGltZXMgc2VsZWN0cXVlc3Rpb25zXG4gICAgICAgICAgICAgICAgLy8gYXJlIHVzZWQgaW4gcmVndWxhciBhc3NpZ25tZW50cy4gIFRoZSBoYWNreSB3YXkgdG8gZGV0ZWN0IHRoaXNcbiAgICAgICAgICAgICAgICAvLyBpcyB0byBsb29rIGZvciBkb0Fzc2lnbm1lbnQgaW4gdGhlIFVSTCBhbmQgdGhlbiBncmFiXG4gICAgICAgICAgICAgICAgLy8gdGhlIGFzc2lnbm1lbnQgbmFtZSBmcm9tIHRoZSBoZWFkaW5nLlxuICAgICAgICAgICAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluZGV4T2YoXCJkb0Fzc2lnbm1lbnRcIikgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVkV3JhcHBlciA9ICQoXCJoMSNhc3NpZ25tZW50X25hbWVcIikudGV4dCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZWRXcmFwcGVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJChvcHRzLm9yaWcpLmRhdGEoXCJxdWVzdGlvbl9sYWJlbFwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucXVlc3Rpb25fbGFiZWwgPSAkKG9wdHMub3JpZykuZGF0YShcInF1ZXN0aW9uX2xhYmVsXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pc190b2dnbGUgPSB0cnVlID8gb3B0cy5pc190b2dnbGUgOiBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuaXNfc2VsZWN0ID0gdHJ1ZSA/IG9wdHMuaXNfc2VsZWN0IDogZmFsc2U7XG5cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1qZWxlbWVudHMgPSBbXTtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLm1qUmVhZHkgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIHNlbGYubWpyZXNvbHZlciA9IHJlc29sdmU7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmFRdWV1ZSA9IG5ldyBBdXRvUXVldWUoKTtcbiAgICAgICAgdGhpcy5qc29uSGVhZGVycyA9IG5ldyBIZWFkZXJzKHtcbiAgICAgICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiLFxuICAgICAgICAgICAgQWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gX2Bsb2dCb29rRXZlbnRgXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBzZW5kcyB0aGUgcHJvdmlkZWQgYGBldmVudEluZm9gYCB0byB0aGUgYGhzYmxvZyBlbmRwb2ludGAgb2YgdGhlIHNlcnZlci4gQXdhaXRpbmcgdGhpcyBmdW5jdGlvbiByZXR1cm5zIGVpdGhlciBgYHVuZGVmaW5lZGBgIChpZiBSdW5lc3RvbmUgc2VydmljZXMgYXJlIG5vdCBhdmFpbGFibGUpIG9yIHRoZSBkYXRhIHJldHVybmVkIGJ5IHRoZSBzZXJ2ZXIgYXMgYSBKYXZhU2NyaXB0IG9iamVjdCAoYWxyZWFkeSBKU09OLWRlY29kZWQpLlxuICAgIGFzeW5jIGxvZ0Jvb2tFdmVudChldmVudEluZm8pIHtcbiAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHBvc3RfcmV0dXJuO1xuICAgICAgICBldmVudEluZm8uY291cnNlX25hbWUgPSBlQm9va0NvbmZpZy5jb3Vyc2U7XG4gICAgICAgIGV2ZW50SW5mby5jbGllbnRMb2dpblN0YXR1cyA9IGVCb29rQ29uZmlnLmlzTG9nZ2VkSW47XG4gICAgICAgIGV2ZW50SW5mby50aW1lem9uZW9mZnNldCA9IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwO1xuICAgICAgICBpZiAodGhpcy5wZXJjZW50KSB7XG4gICAgICAgICAgICBldmVudEluZm8ucGVyY2VudCA9IHRoaXMucGVyY2VudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBlQm9va0NvbmZpZy5pc0xvZ2dlZEluICYmXG4gICAgICAgICAgICBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyAmJlxuICAgICAgICAgICAgZUJvb2tDb25maWcubG9nTGV2ZWwgPiAwXG4gICAgICAgICkge1xuICAgICAgICAgICAgcG9zdF9yZXR1cm4gPSB0aGlzLnBvc3RMb2dNZXNzYWdlKGV2ZW50SW5mbyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmlzVGltZWQgfHwgZUJvb2tDb25maWcuZGVidWcpIHtcbiAgICAgICAgICAgIGxldCBwcmVmaXggPSBlQm9va0NvbmZpZy5pc0xvZ2dlZEluID8gXCJTYXZlXCIgOiBcIk5vdFwiO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYCR7cHJlZml4fSBsb2dnaW5nIGV2ZW50IGAgKyBKU09OLnN0cmluZ2lmeShldmVudEluZm8pKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBXaGVuIHNlbGVjdHF1ZXN0aW9ucyBhcmUgcGFydCBvZiBhbiBhc3NpZ25tZW50IGVzcGVjaWFsbHkgdG9nZ2xlIHF1ZXN0aW9uc1xuICAgICAgICAvLyB3ZSBuZWVkIHRvIGNvdW50IHVzaW5nIHRoZSBzZWxlY3Rvcl9pZCBvZiB0aGUgc2VsZWN0IHF1ZXN0aW9uLlxuICAgICAgICAvLyBXZSAgYWxzbyBuZWVkIHRvIGxvZyBhbiBldmVudCBmb3IgdGhhdCBzZWxlY3RvciBzbyB0aGF0IHdlIHdpbGwga25vd1xuICAgICAgICAvLyB0aGF0IGludGVyYWN0aW9uIGhhcyB0YWtlbiBwbGFjZS4gIFRoaXMgaXMgKippbmRlcGVuZGVudCoqIG9mIGhvdyB0aGVcbiAgICAgICAgLy8gYXV0b2dyYWRlciB3aWxsIHVsdGltYXRlbHkgZ3JhZGUgdGhlIHF1ZXN0aW9uIVxuICAgICAgICBpZiAodGhpcy5zZWxlY3Rvcl9pZCkge1xuICAgICAgICAgICAgZXZlbnRJbmZvLmRpdl9pZCA9IHRoaXMuc2VsZWN0b3JfaWQucmVwbGFjZShcbiAgICAgICAgICAgICAgICBcIi10b2dnbGVTZWxlY3RlZFF1ZXN0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGV2ZW50SW5mby5ldmVudCA9IFwic2VsZWN0cXVlc3Rpb25cIjtcbiAgICAgICAgICAgIGV2ZW50SW5mby5hY3QgPSBcImludGVyYWN0aW9uXCI7XG4gICAgICAgICAgICB0aGlzLnBvc3RMb2dNZXNzYWdlKGV2ZW50SW5mbyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdHlwZW9mIHBhZ2VQcm9ncmVzc1RyYWNrZXIudXBkYXRlUHJvZ3Jlc3MgPT09IFwiZnVuY3Rpb25cIiAmJlxuICAgICAgICAgICAgZXZlbnRJbmZvLmFjdCAhPSBcImVkaXRcIiAmJlxuICAgICAgICAgICAgdGhpcy5vcHRpb25hbCA9PSBmYWxzZVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHBhZ2VQcm9ncmVzc1RyYWNrZXIudXBkYXRlUHJvZ3Jlc3MoZXZlbnRJbmZvLmRpdl9pZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBvc3RfcmV0dXJuO1xuICAgIH1cblxuICAgIGFzeW5jIHBvc3RMb2dNZXNzYWdlKGV2ZW50SW5mbykge1xuICAgICAgICB2YXIgcG9zdF9yZXR1cm47XG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vbG9nZ2VyL2Jvb2tldmVudGAsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuanNvbkhlYWRlcnMsXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZXZlbnRJbmZvKSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQyMikge1xuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgZGV0YWlscyBhYm91dCB3aHkgdGhpcyBpcyB1bnByb2Nlc2FibGUuXG4gICAgICAgICAgICAgICAgICAgIHBvc3RfcmV0dXJuID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwb3N0X3JldHVybi5kZXRhaWwpO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbnByb2Nlc3NhYmxlIFJlcXVlc3RcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gNDAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvc3RfcmV0dXJuID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGBNaXNzaW5nIGF1dGhlbnRpY2F0aW9uIHRva2VuICR7cG9zdF9yZXR1cm4uZGV0YWlsfWBcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWlzc2luZyBhdXRoZW50aWNhdGlvbiB0b2tlblwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gc2F2ZSB0aGUgbG9nIGVudHJ5XG4gICAgICAgICAgICAgICAgICAgIFN0YXR1czogJHtyZXNwb25zZS5zdGF0dXN9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwb3N0X3JldHVybiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgbGV0IGRldGFpbCA9IFwibm9uZVwiO1xuICAgICAgICAgICAgaWYgKHBvc3RfcmV0dXJuICYmIHBvc3RfcmV0dXJuLmRldGFpbCkge1xuICAgICAgICAgICAgICAgIGRldGFpbCA9IHBvc3RfcmV0dXJuLmRldGFpbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlQm9va0NvbmZpZy5sb2dpblJlcXVpcmVkKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoYEVycm9yOiBZb3VyIGFjdGlvbiB3YXMgbm90IHNhdmVkIVxuICAgICAgICAgICAgICAgICAgICBUaGUgZXJyb3Igd2FzICR7ZX1cbiAgICAgICAgICAgICAgICAgICAgRGV0YWlsOiAke2RldGFpbH0uXG4gICAgICAgICAgICAgICAgICAgIFBsZWFzZSByZXBvcnQgdGhpcyBlcnJvciFgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNlbmQgYSByZXF1ZXN0IHRvIHNhdmUgdGhpcyBlcnJvclxuICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yOiAke2V9IERldGFpbDogJHtkZXRhaWx9YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBvc3RfcmV0dXJuO1xuICAgIH1cbiAgICAvLyAuLiBfbG9nUnVuRXZlbnQ6XG4gICAgLy9cbiAgICAvLyBsb2dSdW5FdmVudFxuICAgIC8vIC0tLS0tLS0tLS0tXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBzZW5kcyB0aGUgcHJvdmlkZWQgYGBldmVudEluZm9gYCB0byB0aGUgYHJ1bmxvZyBlbmRwb2ludGAuIFdoZW4gYXdhaXRlZCwgdGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSBkYXRhIChkZWNvZGVkIGZyb20gSlNPTikgdGhlIHNlcnZlciBzZW50IGJhY2suXG4gICAgYXN5bmMgbG9nUnVuRXZlbnQoZXZlbnRJbmZvKSB7XG4gICAgICAgIGxldCBwb3N0X3Byb21pc2UgPSBcImRvbmVcIjtcbiAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnRJbmZvLmNvdXJzZSA9IGVCb29rQ29uZmlnLmNvdXJzZTtcbiAgICAgICAgZXZlbnRJbmZvLmNsaWVudExvZ2luU3RhdHVzID0gZUJvb2tDb25maWcuaXNMb2dnZWRJbjtcbiAgICAgICAgZXZlbnRJbmZvLnRpbWV6b25lb2Zmc2V0ID0gbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjA7XG4gICAgICAgIGlmICh0aGlzLmZvcmNlU2F2ZSB8fCBcInRvX3NhdmVcIiBpbiBldmVudEluZm8gPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBldmVudEluZm8uc2F2ZV9jb2RlID0gXCJUcnVlXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgZUJvb2tDb25maWcuaXNMb2dnZWRJbiAmJlxuICAgICAgICAgICAgZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMgJiZcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmxvZ0xldmVsID4gMFxuICAgICAgICApIHtcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2xvZ2dlci9ydW5sb2dgLCB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuanNvbkhlYWRlcnMsXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGV2ZW50SW5mbyksXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgIHBvc3RfcHJvbWlzZSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgICAgICBpZiAoZUJvb2tDb25maWcubG9naW5SZXF1aXJlZCkge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChgRmFpbGVkIHRvIHNhdmUgeW91ciBjb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICBTdGF0dXMgaXMgJHtyZXNwb25zZS5zdGF0dXN9XG4gICAgICAgICAgICAgICAgICAgICAgICBEZXRhaWw6ICR7cG9zdF9wcm9taXNlLmRldGFpbH1gKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGBEaWQgbm90IHNhdmUgdGhlIGNvZGUuIFN0YXR1czogJHtyZXNwb25zZS5zdGF0dXN9YFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcG9zdF9wcm9taXNlID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5pc1RpbWVkIHx8IGVCb29rQ29uZmlnLmRlYnVnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJ1bm5pbmcgXCIgKyBKU09OLnN0cmluZ2lmeShldmVudEluZm8pKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0eXBlb2YgcGFnZVByb2dyZXNzVHJhY2tlci51cGRhdGVQcm9ncmVzcyA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgICAgICB0aGlzLm9wdGlvbmFsID09IGZhbHNlXG4gICAgICAgICkge1xuICAgICAgICAgICAgcGFnZVByb2dyZXNzVHJhY2tlci51cGRhdGVQcm9ncmVzcyhldmVudEluZm8uZGl2X2lkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcG9zdF9wcm9taXNlO1xuICAgIH1cbiAgICAvKiBDaGVja2luZy9sb2FkaW5nIGZyb20gc3RvcmFnZVxuICAgICoqV0FSTklORzoqKiAgRE8gTk9UIGBhd2FpdGAgdGhpcyBmdW5jdGlvbiFcbiAgICBUaGlzIGZ1bmN0aW9uLCBhbHRob3VnaCBhc3luYywgZG9lcyBub3QgZXhwbGljaXRseSByZXNvbHZlIGl0cyBwcm9taXNlIGJ5IHJldHVybmluZyBhIHZhbHVlLiAgVGhlIHJlYXNvbiBmb3IgdGhpcyBpcyBiZWNhdXNlIGl0IGlzIGNhbGxlZCBieSB0aGUgY29uc3RydWN0b3IgZm9yIG5lYXJseSBldmVyeSBjb21wb25lbnQuICBJbiBKYXZhc2NyaXB0IGNvbnN0cnVjdG9ycyBjYW5ub3QgYmUgYXN5bmMhXG5cbiAgICBPbmUgb2YgdGhlIHJlY29tbWVuZGVkIHdheXMgdG8gaGFuZGxlIHRoZSBhc3luYyByZXF1aXJlbWVudHMgZnJvbSB3aXRoaW4gYSBjb25zdHJ1Y3RvciBpcyB0byB1c2UgYW4gYXR0cmlidXRlIGFzIGEgcHJvbWlzZSBhbmQgcmVzb2x2ZSB0aGF0IGF0dHJpYnV0ZSBhdCB0aGUgYXBwcm9wcmlhdGUgdGltZS5cbiAgICAqL1xuICAgIGFzeW5jIGNoZWNrU2VydmVyKFxuICAgICAgICAvLyBBIHN0cmluZyBzcGVjaWZ5aW5nIHRoZSBldmVudCBuYW1lIHRvIHVzZSBmb3IgcXVlcnlpbmcgdGhlIDpyZWY6YGdldEFzc2Vzc1Jlc3VsdHNgIGVuZHBvaW50LlxuICAgICAgICBldmVudEluZm8sXG4gICAgICAgIC8vIElmIHRydWUsIHRoaXMgZnVuY3Rpb24gd2lsbCBpbnZva2UgYGBpbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKWBgIGp1c3QgYmVmb3JlIGl0IHJldHVybnMuIFRoaXMgaXMgcHJvdmlkZWQgc2luY2UgbW9zdCBjb21wb25lbnRzIGFyZSByZWFkeSBhZnRlciB0aGlzIGZ1bmN0aW9uIGNvbXBsZXRlcyBpdHMgd29yay5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gVE9ETzogVGhpcyBkZWZhdWx0cyB0byBmYWxzZSwgdG8gYXZvaWQgY2F1c2luZyBwcm9ibGVtcyB3aXRoIGFueSBjb21wb25lbnRzIHRoYXQgaGF2ZW4ndCBiZWVuIHVwZGF0ZWQgYW5kIHRlc3RlZC4gQWZ0ZXIgYWxsIFJ1bmVzdG9uZSBjb21wb25lbnRzIGhhdmUgYmVlbiB1cGRhdGVkLCBkZWZhdWx0IHRoaXMgdG8gdHJ1ZSBhbmQgcmVtb3ZlIHRoZSBleHRyYSBwYXJhbWV0ZXIgZnJvbSBtb3N0IGNhbGxzIHRvIHRoaXMgZnVuY3Rpb24uXG4gICAgICAgIHdpbGxfYmVfcmVhZHkgPSBmYWxzZVxuICAgICkge1xuICAgICAgICAvLyBDaGVjayBpZiB0aGUgc2VydmVyIGhhcyBzdG9yZWQgYW5zd2VyXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5jaGVja1NlcnZlckNvbXBsZXRlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBzZWxmLmNzcmVzb2x2ZXIgPSByZXNvbHZlO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgZUJvb2tDb25maWcuaXNMb2dnZWRJbiAmJlxuICAgICAgICAgICAgKHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMgfHwgdGhpcy5ncmFkZXJhY3RpdmUpXG4gICAgICAgICkge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSB7fTtcbiAgICAgICAgICAgIGRhdGEuZGl2X2lkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgICAgIGRhdGEuY291cnNlID0gZUJvb2tDb25maWcuY291cnNlO1xuICAgICAgICAgICAgZGF0YS5ldmVudCA9IGV2ZW50SW5mbztcbiAgICAgICAgICAgIGlmICh0aGlzLmdyYWRlcmFjdGl2ZSAmJiB0aGlzLmRlYWRsaW5lKSB7XG4gICAgICAgICAgICAgICAgZGF0YS5kZWFkbGluZSA9IHRoaXMuZGVhZGxpbmU7XG4gICAgICAgICAgICAgICAgZGF0YS5yYXdkZWFkbGluZSA9IHRoaXMucmF3ZGVhZGxpbmU7XG4gICAgICAgICAgICAgICAgZGF0YS50em9mZiA9IHRoaXMudHpvZmY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5zaWQpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnNpZCA9IHRoaXMuc2lkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEoZGF0YS5kaXZfaWQgJiYgZGF0YS5jb3Vyc2UgJiYgZGF0YS5ldmVudCkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICAgICAgYEEgcmVxdWlyZWQgZmllbGQgaXMgbWlzc2luZyBkYXRhICR7ZGF0YS5kaXZfaWR9OiR7ZGF0YS5jb3Vyc2V9OiR7ZGF0YS5ldmVudH1gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIElmIHdlIGFyZSBOT1QgaW4gcHJhY3RpY2UgbW9kZSBhbmQgd2UgYXJlIG5vdCBpbiBhIHBlZXIgZXhlcmNpc2VcbiAgICAgICAgICAgIC8vIGFuZCBhc3Nlc3NtZW50VGFrZW4gaXMgdHJ1ZVxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICFlQm9va0NvbmZpZy5wcmFjdGljZV9tb2RlICYmXG4gICAgICAgICAgICAgICAgIWVCb29rQ29uZmlnLnBlZXIgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmFzc2Vzc21lbnRUYWtlblxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdChcbiAgICAgICAgICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2Fzc2Vzc21lbnQvcmVzdWx0c2AsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuanNvbkhlYWRlcnMsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5kZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlcG9wdWxhdGVGcm9tU3RvcmFnZShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0ZW1wdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YoZGF0YS5jb3JyZWN0KSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IGRhdGEuY29ycmVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3NyZXNvbHZlcihcInNlcnZlclwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBIVFRQIEVycm9yIGdldHRpbmcgcmVzdWx0czogJHtyZXNwb25zZS5zdGF0dXNUZXh0fWBcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrTG9jYWxTdG9yYWdlKCk7IC8vIGp1c3QgZ28gcmlnaHQgdG8gbG9jYWwgc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jc3Jlc29sdmVyKFwibG9jYWxcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tMb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWREYXRhKHt9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNzcmVzb2x2ZXIoXCJub3QgdGFrZW5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrTG9jYWxTdG9yYWdlKCk7IC8vIGp1c3QgZ28gcmlnaHQgdG8gbG9jYWwgc3RvcmFnZVxuICAgICAgICAgICAgdGhpcy5jc3Jlc29sdmVyKFwibG9jYWxcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2lsbF9iZV9yZWFkeSkge1xuICAgICAgICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoaXMgbWV0aG9kIGFzc3VtZXMgdGhhdCBgYHRoaXMuY29tcG9uZW50RGl2YGAgcmVmZXJzIHRvIHRoZSBgYGRpdmBgIGNvbnRhaW5pbmcgdGhlIGNvbXBvbmVudCwgYW5kIHRoYXQgdGhpcyBjb21wb25lbnQncyBJRCBpcyBzZXQuXG4gICAgaW5kaWNhdGVfY29tcG9uZW50X3JlYWR5KCkge1xuICAgICAgICAvLyBBZGQgYSBjbGFzcyB0byBpbmRpY2F0ZSB0aGUgY29tcG9uZW50IGlzIG5vdyByZWFkeS5cbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuY2xhc3NMaXN0LmFkZChcInJ1bmVzdG9uZS1jb21wb25lbnQtcmVhZHlcIik7XG4gICAgICAgIC8vIFJlc29sdmUgdGhlIGBgdGhpcy5jb21wb25lbnRfcmVhZHlfcHJvbWlzZWBgLlxuICAgICAgICB0aGlzLl9jb21wb25lbnRfcmVhZHlfcmVzb2x2ZV9mbigpO1xuICAgIH1cblxuICAgIGxvYWREYXRhKGRhdGEpIHtcbiAgICAgICAgLy8gZm9yIG1vc3QgY2xhc3NlcywgbG9hZERhdGEgZG9lc24ndCBkbyBhbnl0aGluZy4gQnV0IGZvciBQYXJzb25zLCBhbmQgcGVyaGFwcyBvdGhlcnMgaW4gdGhlIGZ1dHVyZSxcbiAgICAgICAgLy8gaW5pdGlhbGl6YXRpb24gY2FuIGhhcHBlbiBldmVuIHdoZW4gdGhlcmUncyBubyBoaXN0b3J5IHRvIGJlIGxvYWRlZFxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXBvcHVsYXRlRnJvbVN0b3JhZ2UgaXMgY2FsbGVkIGFmdGVyIGEgc3VjY2Vzc2Z1bCBBUEkgY2FsbCBpcyBtYWRlIHRvIGBgZ2V0QXNzZXNzUmVzdWx0c2BgIGluXG4gICAgICogdGhlIGNoZWNrU2VydmVyIG1ldGhvZCBpbiB0aGlzIGNsYXNzXG4gICAgICpcbiAgICAgKiBgYHJlc3RvcmVBbnN3ZXJzLGBgIGBgc2V0TG9jYWxTdG9yYWdlYGAgYW5kIGBgY2hlY2tMb2NhbFN0b3JhZ2VgYCBhcmUgZGVmaW5lZCBpbiB0aGUgY2hpbGQgY2xhc3Nlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0gZGF0YSAtIGEgSlNPTiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBkYXRhIG5lZWRlZCB0byByZXN0b3JlIGEgcHJldmlvdXMgYW5zd2VyIGZvciBhIGNvbXBvbmVudFxuICAgICAqIEBwYXJhbSB7Kn0gc3RhdHVzIC0gdGhlIGh0dHAgc3RhdHVzXG4gICAgICogQHBhcmFtIHsqfSB3aGF0ZXZlciAtIGlnbm9yZWRcbiAgICAgKi9cbiAgICByZXBvcHVsYXRlRnJvbVN0b3JhZ2UoZGF0YSkge1xuICAgICAgICAvLyBkZWNpZGUgd2hldGhlciB0byB1c2UgdGhlIHNlcnZlcidzIGFuc3dlciAoaWYgdGhlcmUgaXMgb25lKSBvciB0byBsb2FkIGZyb20gc3RvcmFnZVxuICAgICAgICBpZiAoZGF0YSAhPT0gbnVsbCAmJiBkYXRhICE9PSBcIm5vIGRhdGFcIiAmJiB0aGlzLnNob3VsZFVzZVNlcnZlcihkYXRhKSkge1xuICAgICAgICAgICAgdGhpcy5yZXN0b3JlQW5zd2VycyhkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKGRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jaGVja0xvY2FsU3RvcmFnZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNob3VsZFVzZVNlcnZlcihkYXRhKSB7XG4gICAgICAgIC8vIHJldHVybnMgdHJ1ZSBpZiBzZXJ2ZXIgZGF0YSBpcyBtb3JlIHJlY2VudCB0aGFuIGxvY2FsIHN0b3JhZ2Ugb3IgaWYgc2VydmVyIHN0b3JhZ2UgaXMgY29ycmVjdFxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBkYXRhLmNvcnJlY3QgPT09IFwiVFwiIHx8XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UubGVuZ3RoID09PSAwIHx8XG4gICAgICAgICAgICB0aGlzLmdyYWRlcmFjdGl2ZSA9PT0gdHJ1ZSB8fFxuICAgICAgICAgICAgdGhpcy5pc1RpbWVkXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGV4ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG4gICAgICAgIGlmIChleCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN0b3JlZERhdGE7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzdG9yZWREYXRhID0gSlNPTi5wYXJzZShleCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgLy8gZXJyb3Igd2hpbGUgcGFyc2luZzsgbGlrZWx5IGR1ZSB0byBiYWQgdmFsdWUgc3RvcmVkIGluIHN0b3JhZ2VcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgICAgLy8gZGVmaW5pdGVseSBkb24ndCB3YW50IHRvIHVzZSBsb2NhbCBzdG9yYWdlIGhlcmVcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLmFuc3dlciA9PSBzdG9yZWREYXRhLmFuc3dlcikgcmV0dXJuIHRydWU7XG4gICAgICAgIGxldCBzdG9yYWdlRGF0ZSA9IG5ldyBEYXRlKHN0b3JlZERhdGEudGltZXN0YW1wKTtcbiAgICAgICAgbGV0IHNlcnZlckRhdGUgPSBuZXcgRGF0ZShkYXRhLnRpbWVzdGFtcCk7XG4gICAgICAgIHJldHVybiBzZXJ2ZXJEYXRlID49IHN0b3JhZ2VEYXRlO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gdGhlIGtleSB3aGljaCB0byBiZSB1c2VkIHdoZW4gYWNjZXNzaW5nIGxvY2FsIHN0b3JhZ2UuXG4gICAgbG9jYWxTdG9yYWdlS2V5KCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgZUJvb2tDb25maWcuZW1haWwgK1xuICAgICAgICAgICAgXCI6XCIgK1xuICAgICAgICAgICAgZUJvb2tDb25maWcuY291cnNlICtcbiAgICAgICAgICAgIFwiOlwiICtcbiAgICAgICAgICAgIHRoaXMuZGl2aWQgK1xuICAgICAgICAgICAgXCItZ2l2ZW5cIlxuICAgICAgICApO1xuICAgIH1cbiAgICBhZGRDYXB0aW9uKGVsVHlwZSkge1xuICAgICAgICAvL3NvbWVFbGVtZW50LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5ld0VsZW1lbnQsIHNvbWVFbGVtZW50Lm5leHRTaWJsaW5nKTtcbiAgICAgICAgaWYgKCF0aGlzLmlzVGltZWQpIHtcbiAgICAgICAgICAgIHZhciBjYXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnF1ZXN0aW9uX2xhYmVsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYXB0aW9uID0gYEFjdGl2aXR5OiAke3RoaXMucXVlc3Rpb25fbGFiZWx9ICR7dGhpcy5jYXB0aW9ufSAgPHNwYW4gY2xhc3M9XCJydW5lc3RvbmVfY2FwdGlvbl9kaXZpZFwiPigke3RoaXMuZGl2aWR9KTwvc3Bhbj5gO1xuICAgICAgICAgICAgICAgICQoY2FwRGl2KS5odG1sKHRoaXMuY2FwdGlvbik7XG4gICAgICAgICAgICAgICAgJChjYXBEaXYpLmFkZENsYXNzKGAke2VsVHlwZX1fY2FwdGlvbmApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKGNhcERpdikuaHRtbCh0aGlzLmNhcHRpb24gKyBcIiAoXCIgKyB0aGlzLmRpdmlkICsgXCIpXCIpO1xuICAgICAgICAgICAgICAgICQoY2FwRGl2KS5hZGRDbGFzcyhgJHtlbFR5cGV9X2NhcHRpb25gKTtcbiAgICAgICAgICAgICAgICAkKGNhcERpdikuYWRkQ2xhc3MoYCR7ZWxUeXBlfV9jYXB0aW9uX3RleHRgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2FwRGl2ID0gY2FwRGl2O1xuICAgICAgICAgICAgLy90aGlzLm91dGVyRGl2LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGNhcERpdiwgdGhpcy5vdXRlckRpdi5uZXh0U2libGluZyk7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChjYXBEaXYpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFzVXNlckFjdGl2aXR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0Fuc3dlcmVkO1xuICAgIH1cblxuICAgIGNoZWNrQ3VycmVudEFuc3dlcigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBcIkVhY2ggY29tcG9uZW50IHNob3VsZCBwcm92aWRlIGFuIGltcGxlbWVudGF0aW9uIG9mIGNoZWNrQ3VycmVudEFuc3dlclwiXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9nQ3VycmVudEFuc3dlcigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBcIkVhY2ggY29tcG9uZW50IHNob3VsZCBwcm92aWRlIGFuIGltcGxlbWVudGF0aW9uIG9mIGxvZ0N1cnJlbnRBbnN3ZXJcIlxuICAgICAgICApO1xuICAgIH1cbiAgICByZW5kZXJGZWVkYmFjaygpIHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBcIkVhY2ggY29tcG9uZW50IHNob3VsZCBwcm92aWRlIGFuIGltcGxlbWVudGF0aW9uIG9mIHJlbmRlckZlZWRiYWNrXCJcbiAgICAgICAgKTtcbiAgICB9XG4gICAgZGlzYWJsZUludGVyYWN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIFwiRWFjaCBjb21wb25lbnQgc2hvdWxkIHByb3ZpZGUgYW4gaW1wbGVtZW50YXRpb24gb2YgZGlzYWJsZUludGVyYWN0aW9uXCJcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuY29uc3RydWN0b3IubmFtZX06ICR7dGhpcy5kaXZpZH1gO1xuICAgIH1cblxuICAgIHF1ZXVlTWF0aEpheChjb21wb25lbnQpIHtcbiAgICAgICAgaWYgKHR5cGVvZihNYXRoSmF4KSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciAtLSBNYXRoSmF4IGlzIG5vdCBsb2FkZWRcIilcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBTZWUgLSBodHRwczovL2RvY3MubWF0aGpheC5vcmcvZW4vbGF0ZXN0L2FkdmFuY2VkL3R5cGVzZXQuaHRtbFxuICAgICAgICAgICAgLy8gUGVyIHRoZSBhYm92ZSB3ZSBzaG91bGQga2VlcCB0cmFjayBvZiB0aGUgcHJvbWlzZXMgYW5kIG9ubHkgY2FsbCB0aGlzXG4gICAgICAgICAgICAvLyBhIHNlY29uZCB0aW1lIGlmIGFsbCBwcmV2aW91cyBwcm9taXNlcyBoYXZlIHJlc29sdmVkLlxuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgcXVldWUgb2YgY29tcG9uZW50c1xuICAgICAgICAgICAgLy8gc2hvdWxkIHdhaXQgdW50aWwgZGVmYXVsdFBhZ2VSZWFkeSBpcyBkZWZpbmVkXG4gICAgICAgICAgICAvLyBJZiBkZWZhdWx0UGFnZVJlYWR5IGlzIG5vdCBkZWZpbmVkIHRoZW4ganVzdCBlbnF1ZXVlIHRoZSBjb21wb25lbnRzLlxuICAgICAgICAgICAgLy8gT25jZSBkZWZhdWx0UGFnZVJlYWR5IGlzIGRlZmluZWRcbiAgICAgICAgICAgIGlmIChNYXRoSmF4LnR5cGVzZXRQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWpyZXNvbHZlcih0aGlzLmFRdWV1ZS5lbnF1ZXVlKGNvbXBvbmVudCkpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBXYWl0aW5nIG9uIE1hdGhKYXghISAke01hdGhKYXgudHlwZXNldFByb21pc2V9YCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnF1ZXVlTWF0aEpheChjb21wb25lbnQpLCAyMDApO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBSZXR1cm5pbmcgbWpyZWFkeSBwcm9taXNlOiAke3RoaXMubWpSZWFkeX1gKVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1qUmVhZHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuXG4vLyBJbnNwaXJhdGlvbiBhbmQgbG90cyBvZiBjb2RlIGZvciB0aGlzIHNvbHV0aW9uIGNvbWUgZnJvbVxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTM1NDAzNDgvanMtYXN5bmMtYXdhaXQtdGFza3MtcXVldWVcbi8vIFRoZSBpZGVhIGhlcmUgaXMgdGhhdCB1bnRpbCBNYXRoSmF4IGlzIHJlYWR5IHdlIGNhbiBqdXN0IGVucXVldWUgdGhpbmdzXG4vLyBvbmNlIG1hdGhqYXggYmVjb21lcyByZWFkeSB0aGVuIHdlIGNhbiBkcmFpbiB0aGUgcXVldWUgYW5kIGNvbnRpbnVlIGFzIHVzdWFsLlxuXG5jbGFzcyBRdWV1ZSB7XG4gICAgY29uc3RydWN0b3IoKSB7IHRoaXMuX2l0ZW1zID0gW107IH1cbiAgICBlbnF1ZXVlKGl0ZW0pIHsgdGhpcy5faXRlbXMucHVzaChpdGVtKTsgfVxuICAgIGRlcXVldWUoKSB7IHJldHVybiB0aGlzLl9pdGVtcy5zaGlmdCgpOyB9XG4gICAgZ2V0IHNpemUoKSB7IHJldHVybiB0aGlzLl9pdGVtcy5sZW5ndGg7IH1cbn1cblxuY2xhc3MgQXV0b1F1ZXVlIGV4dGVuZHMgUXVldWUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9wZW5kaW5nUHJvbWlzZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGVucXVldWUoY29tcG9uZW50KSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBzdXBlci5lbnF1ZXVlKHsgY29tcG9uZW50LCByZXNvbHZlLCByZWplY3QgfSk7XG4gICAgICAgICAgICB0aGlzLmRlcXVldWUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZGVxdWV1ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3BlbmRpbmdQcm9taXNlKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgbGV0IGl0ZW0gPSBzdXBlci5kZXF1ZXVlKCk7XG5cbiAgICAgICAgaWYgKCFpdGVtKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuX3BlbmRpbmdQcm9taXNlID0gdHJ1ZTtcblxuICAgICAgICAgICAgbGV0IHBheWxvYWQgPSBhd2FpdCBNYXRoSmF4LnN0YXJ0dXAuZGVmYXVsdFBhZ2VSZWFkeSgpLnRoZW4oXG4gICAgICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBNYXRoSmF4IFJlYWR5IC0tIGRlcXVlaW5nIGEgdHlwZXNldHRpbmcgcnVuIGZvciAke2l0ZW0uY29tcG9uZW50LmlkfWApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBNYXRoSmF4LnR5cGVzZXRQcm9taXNlKFtpdGVtLmNvbXBvbmVudF0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3BlbmRpbmdQcm9taXNlID0gZmFsc2U7IGl0ZW0ucmVzb2x2ZShwYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGVuZGluZ1Byb21pc2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpdGVtLnJlamVjdChlKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZXF1ZXVlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICB3aW5kb3cuUnVuZXN0b25lQmFzZSA9IFJ1bmVzdG9uZUJhc2U7XG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0U3dpdGNoKCkge1xuICAgIGNvbnN0IHRvZ2dsZVN3aXRjaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aGVtZS1zd2l0Y2ggaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyk7XG4gICAgY29uc3QgY3VycmVudFRoZW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RoZW1lJykgPyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndGhlbWUnKSA6IG51bGw7XG5cbiAgICBpZiAoY3VycmVudFRoZW1lKSB7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGhlbWUnLCBjdXJyZW50VGhlbWUpO1xuXG4gICAgICAgIGlmIChjdXJyZW50VGhlbWUgPT09ICdkYXJrJykge1xuICAgICAgICAgICAgdG9nZ2xlU3dpdGNoLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3dpdGNoVGhlbWUoKSB7XG5cblx0dmFyIGNoZWNrQm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGVja2JveFwiKTtcbiAgICBpZiAoY2hlY2tCb3guY2hlY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGhlbWUnLCAnZGFyaycpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndGhlbWUnLCAnZGFyaycpOyAvL2FkZCB0aGlzXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLXRoZW1lJywgJ2xpZ2h0Jyk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0aGVtZScsICdsaWdodCcpOyAvL2FkZCB0aGlzXG4gICAgfVxufVxuIiwiLypnbG9iYWwgdmFyaWFibGUgZGVjbGFyYXRpb25zKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBcIi4uL2Nzcy91c2VyLWhpZ2hsaWdodHMuY3NzXCI7XG5cbmZ1bmN0aW9uIGdldENvbXBsZXRpb25zKCkge1xuICAgIC8vIEdldCB0aGUgY29tcGxldGlvbiBzdGF0dXNcbiAgICBpZiAoXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmLm1hdGNoKFxuICAgICAgICAgICAgLyhpbmRleC5odG1sfHRvY3RyZWUuaHRtbHxnZW5pbmRleC5odG1sfG5hdmhlbHAuaHRtbHx0b2MuaHRtbHxhc3NpZ25tZW50cy5odG1sfEV4ZXJjaXNlcy5odG1sKS9cbiAgICAgICAgKVxuICAgICkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGN1cnJlbnRQYXRobmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICBpZiAoY3VycmVudFBhdGhuYW1lLmluZGV4T2YoXCI/XCIpICE9PSAtMSkge1xuICAgICAgICBjdXJyZW50UGF0aG5hbWUgPSBjdXJyZW50UGF0aG5hbWUuc3Vic3RyaW5nKFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIGN1cnJlbnRQYXRobmFtZS5sYXN0SW5kZXhPZihcIj9cIilcbiAgICAgICAgKTtcbiAgICB9XG4gICAgdmFyIGRhdGEgPSB7IGxhc3RQYWdlVXJsOiBjdXJyZW50UGF0aG5hbWUgfTtcbiAgICBqUXVlcnlcbiAgICAgICAgLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vbG9nZ2VyL2dldENvbXBsZXRpb25TdGF0dXNgLFxuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgfSlcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChkYXRhICE9IFwiTm9uZVwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbXBsZXRpb25EYXRhID0gZGF0YS5kZXRhaWw7XG4gICAgICAgICAgICAgICAgdmFyIGNvbXBsZXRpb25DbGFzcywgY29tcGxldGlvbk1zZztcbiAgICAgICAgICAgICAgICBpZiAoY29tcGxldGlvbkRhdGFbMF0uY29tcGxldGlvblN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRpb25DbGFzcyA9IFwiYnV0dG9uQ29uZmlybUNvbXBsZXRpb25cIjtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGlvbk1zZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICBcIjxpIGNsYXNzPSdnbHlwaGljb24gZ2x5cGhpY29uLW9rJz48L2k+IENvbXBsZXRlZC4gV2VsbCBEb25lIVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRpb25DbGFzcyA9IFwiYnV0dG9uQXNrQ29tcGxldGlvblwiO1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0aW9uTXNnID0gXCJNYXJrIGFzIENvbXBsZXRlZFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkKFwiI21haW4tY29udGVudFwiKS5hcHBlbmQoXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjpjZW50ZXJcIj48YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1sZyAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRpb25DbGFzcyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnXCIgaWQ9XCJjb21wbGV0aW9uQnV0dG9uXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0aW9uTXNnICtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPC9idXR0b24+PC9kaXY+XCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbn1cblxuZnVuY3Rpb24gc2hvd0xhc3RQb3NpdGlvbkJhbm5lcigpIHtcbiAgICB2YXIgbGFzdFBvc2l0aW9uVmFsID0gJC5nZXRVcmxWYXIoXCJsYXN0UG9zaXRpb25cIik7XG4gICAgaWYgKHR5cGVvZiBsYXN0UG9zaXRpb25WYWwgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgJChcImJvZHlcIikuYXBwZW5kKFxuICAgICAgICAgICAgJzxpbWcgc3JjPVwiLi4vX3N0YXRpYy9sYXN0LXBvaW50LnBuZ1wiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7IHBhZGRpbmctdG9wOjU1cHg7IGxlZnQ6IDEwcHg7IHRvcDogJyArXG4gICAgICAgICAgICAgICAgcGFyc2VJbnQobGFzdFBvc2l0aW9uVmFsKSArXG4gICAgICAgICAgICAgICAgJ3B4O1wiLz4nXG4gICAgICAgICk7XG4gICAgICAgICQoXCJodG1sLCBib2R5XCIpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IHBhcnNlSW50KGxhc3RQb3NpdGlvblZhbCkgfSwgMTAwMCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhZGROYXZpZ2F0aW9uQW5kQ29tcGxldGlvbkJ1dHRvbnMoKSB7XG4gICAgaWYgKFxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaChcbiAgICAgICAgICAgIC8oaW5kZXguaHRtbHxnZW5pbmRleC5odG1sfG5hdmhlbHAuaHRtbHx0b2MuaHRtbHxhc3NpZ25tZW50cy5odG1sfEV4ZXJjaXNlcy5odG1sfHRvY3RyZWUuaHRtbCkvXG4gICAgICAgIClcbiAgICApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgbmF2TGlua0JnUmlnaHRIaWRkZW5Qb3NpdGlvbiA9IC0kKFwiI25hdkxpbmtCZ1JpZ2h0XCIpLm91dGVyV2lkdGgoKSAtIDU7XG4gICAgdmFyIG5hdkxpbmtCZ1JpZ2h0SGFsZk9wZW47XG4gICAgdmFyIG5hdkxpbmtCZ1JpZ2h0RnVsbE9wZW4gPSAwO1xuXG4gICAgaWYgKCQoXCIjY29tcGxldGlvbkJ1dHRvblwiKS5oYXNDbGFzcyhcImJ1dHRvbkFza0NvbXBsZXRpb25cIikpIHtcbiAgICAgICAgbmF2TGlua0JnUmlnaHRIYWxmT3BlbiA9IG5hdkxpbmtCZ1JpZ2h0SGlkZGVuUG9zaXRpb24gKyA3MDtcbiAgICB9IGVsc2UgaWYgKCQoXCIjY29tcGxldGlvbkJ1dHRvblwiKS5oYXNDbGFzcyhcImJ1dHRvbkNvbmZpcm1Db21wbGV0aW9uXCIpKSB7XG4gICAgICAgIG5hdkxpbmtCZ1JpZ2h0SGFsZk9wZW4gPSAwO1xuICAgIH1cbiAgICB2YXIgcmVsYXRpb25zTmV4dEljb25Jbml0aWFsUG9zaXRpb24gPSAkKFwiI3JlbGF0aW9ucy1uZXh0XCIpLmNzcyhcInJpZ2h0XCIpO1xuICAgIHZhciByZWxhdGlvbnNOZXh0SWNvbk5ld1Bvc2l0aW9uID0gLShuYXZMaW5rQmdSaWdodEhpZGRlblBvc2l0aW9uICsgMzUpO1xuXG4gICAgJChcIiNuYXZMaW5rQmdSaWdodFwiKS5jc3MoXCJyaWdodFwiLCBuYXZMaW5rQmdSaWdodEhpZGRlblBvc2l0aW9uKS5zaG93KCk7XG4gICAgdmFyIG5hdkJnU2hvd24gPSBmYWxzZTtcbiAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgJCh3aW5kb3cpLmhlaWdodCgpID09XG4gICAgICAgICAgICAkKGRvY3VtZW50KS5oZWlnaHQoKVxuICAgICAgICApIHtcbiAgICAgICAgICAgICQoXCIjbmF2TGlua0JnUmlnaHRcIikuYW5pbWF0ZShcbiAgICAgICAgICAgICAgICB7IHJpZ2h0OiBuYXZMaW5rQmdSaWdodEhhbGZPcGVuIH0sXG4gICAgICAgICAgICAgICAgMjAwXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgJChcIiNuYXZMaW5rQmdMZWZ0XCIpLmFuaW1hdGUoeyBsZWZ0OiBcIjBweFwiIH0sIDIwMCk7XG4gICAgICAgICAgICBpZiAoJChcIiNjb21wbGV0aW9uQnV0dG9uXCIpLmhhc0NsYXNzKFwiYnV0dG9uQ29uZmlybUNvbXBsZXRpb25cIikpIHtcbiAgICAgICAgICAgICAgICAkKFwiI3JlbGF0aW9ucy1uZXh0XCIpLmFuaW1hdGUoXG4gICAgICAgICAgICAgICAgICAgIHsgcmlnaHQ6IHJlbGF0aW9uc05leHRJY29uTmV3UG9zaXRpb24gfSxcbiAgICAgICAgICAgICAgICAgICAgMjAwXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5hdkJnU2hvd24gPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKG5hdkJnU2hvd24pIHtcbiAgICAgICAgICAgICQoXCIjbmF2TGlua0JnUmlnaHRcIikuYW5pbWF0ZShcbiAgICAgICAgICAgICAgICB7IHJpZ2h0OiBuYXZMaW5rQmdSaWdodEhpZGRlblBvc2l0aW9uIH0sXG4gICAgICAgICAgICAgICAgMjAwXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgJChcIiNuYXZMaW5rQmdMZWZ0XCIpLmFuaW1hdGUoeyBsZWZ0OiBcIi02NXB4XCIgfSwgMjAwKTtcbiAgICAgICAgICAgICQoXCIjcmVsYXRpb25zLW5leHRcIikuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgcmlnaHQ6IHJlbGF0aW9uc05leHRJY29uSW5pdGlhbFBvc2l0aW9uLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBuYXZCZ1Nob3duID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjb21wbGV0aW9uRmxhZyA9IDA7XG4gICAgaWYgKCQoXCIjY29tcGxldGlvbkJ1dHRvblwiKS5oYXNDbGFzcyhcImJ1dHRvbkFza0NvbXBsZXRpb25cIikpIHtcbiAgICAgICAgY29tcGxldGlvbkZsYWcgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXBsZXRpb25GbGFnID0gMTtcbiAgICB9XG4gICAgLy8gTWFrZSBzdXJlIHdlIG1hcmsgdGhpcyBwYWdlIGFzIHZpc2l0ZWQgcmVnYXJkbGVzcyBvZiBob3cgZmxha2V5XG4gICAgLy8gdGhlIG9udW5sb2FkIGhhbmRsZXJzIGJlY29tZS5cbiAgICBwcm9jZXNzUGFnZVN0YXRlKGNvbXBsZXRpb25GbGFnKTtcbiAgICAkKFwiI2NvbXBsZXRpb25CdXR0b25cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiYnV0dG9uQXNrQ29tcGxldGlvblwiKSkge1xuICAgICAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhcImJ1dHRvbkFza0NvbXBsZXRpb25cIilcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoXCJidXR0b25Db25maXJtQ29tcGxldGlvblwiKVxuICAgICAgICAgICAgICAgIC5odG1sKFxuICAgICAgICAgICAgICAgICAgICBcIjxpIGNsYXNzPSdnbHlwaGljb24gZ2x5cGhpY29uLW9rJz48L2k+IENvbXBsZXRlZC4gV2VsbCBEb25lIVwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICQoXCIjbmF2TGlua0JnUmlnaHRcIikuYW5pbWF0ZSh7IHJpZ2h0OiBuYXZMaW5rQmdSaWdodEZ1bGxPcGVuIH0pO1xuICAgICAgICAgICAgJChcIiNyZWxhdGlvbnMtbmV4dFwiKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICByaWdodDogcmVsYXRpb25zTmV4dEljb25OZXdQb3NpdGlvbixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbmF2TGlua0JnUmlnaHRIYWxmT3BlbiA9IDA7XG4gICAgICAgICAgICBjb21wbGV0aW9uRmxhZyA9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImJ1dHRvbkNvbmZpcm1Db21wbGV0aW9uXCIpKSB7XG4gICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKFwiYnV0dG9uQ29uZmlybUNvbXBsZXRpb25cIilcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoXCJidXR0b25Bc2tDb21wbGV0aW9uXCIpXG4gICAgICAgICAgICAgICAgLmh0bWwoXCJNYXJrIGFzIENvbXBsZXRlZFwiKTtcbiAgICAgICAgICAgIG5hdkxpbmtCZ1JpZ2h0SGFsZk9wZW4gPSBuYXZMaW5rQmdSaWdodEhpZGRlblBvc2l0aW9uICsgNzA7XG4gICAgICAgICAgICAkKFwiI25hdkxpbmtCZ1JpZ2h0XCIpLmFuaW1hdGUoeyByaWdodDogbmF2TGlua0JnUmlnaHRIYWxmT3BlbiB9KTtcbiAgICAgICAgICAgICQoXCIjcmVsYXRpb25zLW5leHRcIikuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgcmlnaHQ6IHJlbGF0aW9uc05leHRJY29uSW5pdGlhbFBvc2l0aW9uLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb21wbGV0aW9uRmxhZyA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcHJvY2Vzc1BhZ2VTdGF0ZShjb21wbGV0aW9uRmxhZyk7XG4gICAgfSk7XG5cbiAgICAkKHdpbmRvdykub24oXCJiZWZvcmV1bmxvYWRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGNvbXBsZXRpb25GbGFnID09IDApIHtcbiAgICAgICAgICAgIHByb2Nlc3NQYWdlU3RhdGUoY29tcGxldGlvbkZsYWcpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8vIF8gZGVjb3JhdGVUYWJsZU9mQ29udGVudHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIGRlY29yYXRlVGFibGVPZkNvbnRlbnRzKCkge1xuICAgIGlmIChcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwidG9jLmh0bWxcIikgIT0gLTEgfHxcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwiaW5kZXguaHRtbFwiKSAhPSAtMVxuICAgICkge1xuICAgICAgICBqUXVlcnkuZ2V0KFxuICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2xvZ2dlci9nZXRBbGxDb21wbGV0aW9uU3RhdHVzYCxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN1YkNoYXB0ZXJMaXN0O1xuICAgICAgICAgICAgICAgIGlmIChkYXRhICE9IFwiTm9uZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YkNoYXB0ZXJMaXN0ID0gZGF0YS5kZXRhaWw7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGFsbFN1YkNoYXB0ZXJVUkxzID0gJChcIiNtYWluLWNvbnRlbnQgZGl2IGxpIGFcIik7XG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChzdWJDaGFwdGVyTGlzdCwgZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBzID0gMDsgcyA8IGFsbFN1YkNoYXB0ZXJVUkxzLmxlbmd0aDsgcysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxTdWJDaGFwdGVyVVJMc1tzXS5ocmVmLmluZGV4T2YoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmNoYXB0ZXJOYW1lICsgXCIvXCIgKyBpdGVtLnN1YkNoYXB0ZXJOYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgIT0gLTFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29tcGxldGlvblN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGFsbFN1YkNoYXB0ZXJVUkxzW3NdLnBhcmVudEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKFwiY29tcGxldGVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiaW5mb1RleHRDb21wbGV0ZWRcIj4tIENvbXBsZXRlZCB0aGlzIHRvcGljIG9uICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5lbmREYXRlICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiPC9zcGFuPlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jaGlsZHJlbigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpcnN0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaG92ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubmV4dChcIi5pbmZvVGV4dENvbXBsZXRlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubmV4dChcIi5pbmZvVGV4dENvbXBsZXRlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0uY29tcGxldGlvblN0YXR1cyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGFsbFN1YkNoYXB0ZXJVUkxzW3NdLnBhcmVudEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKFwiYWN0aXZlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiaW5mb1RleHRBY3RpdmVcIj5MYXN0IHJlYWQgdGhpcyB0b3BpYyBvbiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uZW5kRGF0ZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjwvc3Bhbj5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2hpbGRyZW4oKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maXJzdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmhvdmVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm5leHQoXCIuaW5mb1RleHRBY3RpdmVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm5leHQoXCIuaW5mb1RleHRBY3RpdmVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICB2YXIgZGF0YSA9IHsgY291cnNlOiBlQm9va0NvbmZpZy5jb3Vyc2UgfTtcbiAgICAgICAgalF1ZXJ5LmdldChcbiAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9sb2dnZXIvZ2V0bGFzdHBhZ2VgLFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxhc3RQYWdlRGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSAhPSBcIk5vbmVcIikge1xuICAgICAgICAgICAgICAgICAgICBsYXN0UGFnZURhdGEgPSBkYXRhLmRldGFpbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RQYWdlRGF0YS5sYXN0UGFnZUNoYXB0ZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIiNjb250aW51ZS1yZWFkaW5nXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNob3coKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5odG1sKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cImp1bXAtdG8tY2hhcHRlclwiIGNsYXNzPVwiYWxlcnQgYWxlcnQtaW5mb1wiID48c3Ryb25nPllvdSB3ZXJlIExhc3QgUmVhZGluZzo8L3N0cm9uZz4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0UGFnZURhdGEubGFzdFBhZ2VDaGFwdGVyICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChsYXN0UGFnZURhdGEubGFzdFBhZ2VTdWJjaGFwdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcIiAmZ3Q7IFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RQYWdlRGF0YS5sYXN0UGFnZVN1YmNoYXB0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiXCIpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgPGEgaHJlZj1cIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFBhZ2VEYXRhLmxhc3RQYWdlVXJsICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiP2xhc3RQb3NpdGlvbj1cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0UGFnZURhdGEubGFzdFBhZ2VTY3JvbGxMb2NhdGlvbiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnXCI+Q29udGludWUgUmVhZGluZzwvYT48L2Rpdj4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGVuYWJsZUNvbXBsZXRpb25zKCkge1xuICAgIGdldENvbXBsZXRpb25zKCk7XG4gICAgc2hvd0xhc3RQb3NpdGlvbkJhbm5lcigpO1xuICAgIGFkZE5hdmlnYXRpb25BbmRDb21wbGV0aW9uQnV0dG9ucygpO1xuICAgIGRlY29yYXRlVGFibGVPZkNvbnRlbnRzKCk7XG59XG5cbi8vIGNhbGwgZW5hYmxlIHVzZXIgaGlnaGxpZ2h0cyBhZnRlciBsb2dpblxuJChkb2N1bWVudCkub24oXCJydW5lc3RvbmU6bG9naW5cIiwgZW5hYmxlQ29tcGxldGlvbnMpO1xuXG4vLyBfIHByb2Nlc3NQYWdlU3RhdGVcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIHByb2Nlc3NQYWdlU3RhdGUoY29tcGxldGlvbkZsYWcpIHtcbiAgICAvKkxvZyBsYXN0IHBhZ2UgdmlzaXRlZCovXG4gICAgdmFyIGN1cnJlbnRQYXRobmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICBpZiAoY3VycmVudFBhdGhuYW1lLmluZGV4T2YoXCI/XCIpICE9PSAtMSkge1xuICAgICAgICBjdXJyZW50UGF0aG5hbWUgPSBjdXJyZW50UGF0aG5hbWUuc3Vic3RyaW5nKFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIGN1cnJlbnRQYXRobmFtZS5sYXN0SW5kZXhPZihcIj9cIilcbiAgICAgICAgKTtcbiAgICB9XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIGxhc3RQYWdlVXJsOiBjdXJyZW50UGF0aG5hbWUsXG4gICAgICAgIGxhc3RQYWdlU2Nyb2xsTG9jYXRpb246ICQod2luZG93KS5zY3JvbGxUb3AoKSxcbiAgICAgICAgY29tcGxldGlvbkZsYWc6IGNvbXBsZXRpb25GbGFnLFxuICAgICAgICBjb3Vyc2U6IGVCb29rQ29uZmlnLmNvdXJzZSxcbiAgICB9O1xuICAgICQoZG9jdW1lbnQpLmFqYXhFcnJvcihmdW5jdGlvbiAoZSwganFoeHIsIHNldHRpbmdzLCBleGNlcHRpb24pIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZXF1ZXN0IEZhaWxlZCBmb3IgXCIgKyBzZXR0aW5ncy51cmwpO1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICB9KTtcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIHVybDogYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2xvZ2dlci91cGRhdGVsYXN0cGFnZWAsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIixcbiAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgYXN5bmM6IHRydWUsXG4gICAgfSk7XG59XG5cbiQuZXh0ZW5kKHtcbiAgICBnZXRVcmxWYXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB2YXJzID0gW10sXG4gICAgICAgICAgICBoYXNoO1xuICAgICAgICB2YXIgaGFzaGVzID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaFxuICAgICAgICAgICAgLnNsaWNlKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guaW5kZXhPZihcIj9cIikgKyAxKVxuICAgICAgICAgICAgLnNwbGl0KFwiJlwiKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoYXNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGhhc2ggPSBoYXNoZXNbaV0uc3BsaXQoXCI9XCIpO1xuICAgICAgICAgICAgdmFycy5wdXNoKGhhc2hbMF0pO1xuICAgICAgICAgICAgdmFyc1toYXNoWzBdXSA9IGhhc2hbMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhcnM7XG4gICAgfSxcbiAgICBnZXRVcmxWYXI6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHJldHVybiAkLmdldFVybFZhcnMoKVtuYW1lXTtcbiAgICB9LFxufSk7XG4iLCIoZnVuY3Rpb24gKCQpIHtcbiAgLyoqXG4gICAqIFBhdGNoIFRPQyBsaXN0LlxuICAgKlxuICAgKiBXaWxsIG11dGF0ZSB0aGUgdW5kZXJseWluZyBzcGFuIHRvIGhhdmUgYSBjb3JyZWN0IHVsIGZvciBuYXYuXG4gICAqXG4gICAqIEBwYXJhbSAkc3BhbjogU3BhbiBjb250YWluaW5nIG5lc3RlZCBVTCdzIHRvIG11dGF0ZS5cbiAgICogQHBhcmFtIG1pbkxldmVsOiBTdGFydGluZyBsZXZlbCBmb3IgbmVzdGVkIGxpc3RzLiAoMTogZ2xvYmFsLCAyOiBsb2NhbCkuXG4gICAqL1xuICB2YXIgcGF0Y2hUb2MgPSBmdW5jdGlvbiAoJHVsLCBtaW5MZXZlbCkge1xuICAgIHZhciBmaW5kQSxcbiAgICAgIHBhdGNoVGFibGVzLFxuICAgICAgJGxvY2FsTGk7XG5cbiAgICAvLyBGaW5kIGFsbCBhIFwiaW50ZXJuYWxcIiB0YWdzLCB0cmF2ZXJzaW5nIHJlY3Vyc2l2ZWx5LlxuICAgIGZpbmRBID0gZnVuY3Rpb24gKCRlbGVtLCBsZXZlbCkge1xuICAgICAgbGV2ZWwgPSBsZXZlbCB8fCAwO1xuICAgICAgdmFyICRpdGVtcyA9ICRlbGVtLmZpbmQoXCI+IGxpID4gYS5pbnRlcm5hbCwgPiB1bCwgPiBsaSA+IHVsXCIpO1xuXG4gICAgICAvLyBJdGVyYXRlIGV2ZXJ5dGhpbmcgaW4gb3JkZXIuXG4gICAgICAkaXRlbXMuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcbiAgICAgICAgdmFyICRpdGVtID0gJChpdGVtKSxcbiAgICAgICAgICB0YWcgPSBpdGVtLnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAkY2hpbGRyZW5MaSA9ICRpdGVtLmNoaWxkcmVuKCdsaScpLFxuICAgICAgICAgICRwYXJlbnRMaSA9ICQoJGl0ZW0ucGFyZW50KCdsaScpLCAkaXRlbS5wYXJlbnQoKS5wYXJlbnQoJ2xpJykpO1xuXG4gICAgICAgIC8vIEFkZCBkcm9wZG93bnMgaWYgbW9yZSBjaGlsZHJlbiBhbmQgYWJvdmUgbWluaW11bSBsZXZlbC5cbiAgICAgICAgaWYgKHRhZyA9PT0gJ3VsJyAmJiBsZXZlbCA+PSBtaW5MZXZlbCAmJiAkY2hpbGRyZW5MaS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgJHBhcmVudExpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ2Ryb3Bkb3duLXN1Ym1lbnUnKVxuICAgICAgICAgICAgLmNoaWxkcmVuKCdhJykuZmlyc3QoKS5hdHRyKCd0YWJpbmRleCcsIC0xKTtcblxuICAgICAgICAgICRpdGVtLmFkZENsYXNzKCdkcm9wZG93bi1tZW51Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBmaW5kQSgkaXRlbSwgbGV2ZWwgKyAxKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBmaW5kQSgkdWwpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBQYXRjaCBhbGwgdGFibGVzIHRvIHJlbW92ZSBgYGRvY3V0aWxzYGAgY2xhc3MgYW5kIGFkZCBCb290c3RyYXAgYmFzZVxuICAgKiBgYHRhYmxlYGAgY2xhc3MuXG4gICAqL1xuICBwYXRjaFRhYmxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAkKFwidGFibGUuZG9jdXRpbHNcIilcbiAgICAgIC5yZW1vdmVDbGFzcyhcImRvY3V0aWxzXCIpXG4gICAgICAuYWRkQ2xhc3MoXCJ0YWJsZVwiKVxuICAgICAgLmF0dHIoXCJib3JkZXJcIiwgMCk7XG4gIH07XG5cbiQoZnVuY3Rpb24gKCkge1xuXG4gICAgLypcbiAgICAgKiBTY3JvbGwgdGhlIHdpbmRvdyB0byBhdm9pZCB0aGUgdG9wbmF2IGJhclxuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2l0dGVyL2Jvb3RzdHJhcC9pc3N1ZXMvMTc2OFxuICAgICAqL1xuICAgIGlmICgkKFwiI25hdmJhci5uYXZiYXItZml4ZWQtdG9wXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBuYXZIZWlnaHQgPSAkKFwiI25hdmJhclwiKS5oZWlnaHQoKSxcbiAgICAgICAgc2hpZnRXaW5kb3cgPSBmdW5jdGlvbigpIHsgc2Nyb2xsQnkoMCwgLW5hdkhlaWdodCAtIDEwKTsgfTtcblxuICAgICAgaWYgKGxvY2F0aW9uLmhhc2gpIHtcbiAgICAgICAgc2hpZnRXaW5kb3coKTtcbiAgICAgIH1cblxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJoYXNoY2hhbmdlXCIsIHNoaWZ0V2luZG93KTtcbiAgICB9XG5cbiAgICAvLyBBZGQgc3R5bGluZywgc3RydWN0dXJlIHRvIFRPQydzLlxuICAgICQoXCIuZHJvcGRvd24tbWVudVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICQodGhpcykuZmluZChcInVsXCIpLmVhY2goZnVuY3Rpb24gKGluZGV4LCBpdGVtKXtcbiAgICAgICAgdmFyICRpdGVtID0gJChpdGVtKTtcbiAgICAgICAgJGl0ZW0uYWRkQ2xhc3MoJ3Vuc3R5bGVkJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIEdsb2JhbCBUT0MuXG4gICAgaWYgKCQoXCJ1bC5nbG9iYWx0b2MgbGlcIikubGVuZ3RoKSB7XG4gICAgICBwYXRjaFRvYygkKFwidWwuZ2xvYmFsdG9jXCIpLCAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmVtb3ZlIEdsb2JhbCBUT0MuXG4gICAgICAkKFwiLmdsb2JhbHRvYy1jb250YWluZXJcIikucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgLy8gTG9jYWwgVE9DLlxuICAgIHBhdGNoVG9jKCQoXCJ1bC5sb2NhbHRvY1wiKSwgMik7XG5cbiAgICAvLyBNdXRhdGUgc3ViLWxpc3RzIChmb3IgYnMtMi4zLjApLlxuICAgICQoXCIuZHJvcGRvd24tbWVudSB1bFwiKS5ub3QoXCIuZHJvcGRvd24tbWVudVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdWwgPSAkKHRoaXMpLFxuICAgICAgICAkcGFyZW50ID0gJHVsLnBhcmVudCgpLFxuICAgICAgICB0YWcgPSAkcGFyZW50WzBdLnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgJGtpZHMgPSAkdWwuY2hpbGRyZW4oKS5kZXRhY2goKTtcblxuICAgICAgLy8gUmVwbGFjZSBsaXN0IHdpdGggaXRlbXMgaWYgc3VibWVudSBoZWFkZXIuXG4gICAgICBpZiAodGFnID09PSBcInVsXCIpIHtcbiAgICAgICAgJHVsLnJlcGxhY2VXaXRoKCRraWRzKTtcbiAgICAgIH0gZWxzZSBpZiAodGFnID09PSBcImxpXCIpIHtcbiAgICAgICAgLy8gSW5zZXJ0IGludG8gcHJldmlvdXMgbGlzdC5cbiAgICAgICAgJHBhcmVudC5hZnRlcigka2lkcyk7XG4gICAgICAgICR1bC5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEFkZCBkaXZpZGVyIGluIHBhZ2UgVE9DLlxuICAgICRsb2NhbExpID0gJChcInVsLmxvY2FsdG9jIGxpXCIpO1xuICAgIGlmICgkbG9jYWxMaS5sZW5ndGggPiAyKSB7XG4gICAgICAkbG9jYWxMaS5maXJzdCgpLmFmdGVyKCc8bGkgY2xhc3M9XCJkaXZpZGVyXCI+PC9saT4nKTtcbiAgICB9XG5cbiAgICAvLyBFbmFibGUgZHJvcGRvd24uXG4gICAgJCgnLmRyb3Bkb3duLXRvZ2dsZScpLmRyb3Bkb3duKCk7XG5cbiAgICAvLyBQYXRjaCB0YWJsZXMuXG4gICAgcGF0Y2hUYWJsZXMoKTtcblxuICAgIC8vIEFkZCBOb3RlLCBXYXJuaW5nIHN0eWxlcy5cbiAgICAkKCdkaXYubm90ZScpLmFkZENsYXNzKCdhbGVydCcpLmFkZENsYXNzKCdhbGVydC1pbmZvJyk7XG4gICAgJCgnZGl2Lndhcm5pbmcnKS5hZGRDbGFzcygnYWxlcnQnKS5hZGRDbGFzcygnYWxlcnQtd2FybmluZycpO1xuXG4gICAgLy8gSW5saW5lIGNvZGUgc3R5bGVzIHRvIEJvb3RzdHJhcCBzdHlsZS5cbiAgICAkKCd0dC5kb2N1dGlscy5saXRlcmFsJykubm90KFwiLnhyZWZcIikuZWFjaChmdW5jdGlvbiAoaSwgZSkge1xuICAgICAgLy8gaWdub3JlIHJlZmVyZW5jZXNcbiAgICAgIGlmICghJChlKS5wYXJlbnQoKS5oYXNDbGFzcyhcInJlZmVyZW5jZVwiKSkge1xuICAgICAgICAkKGUpLnJlcGxhY2VXaXRoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gJChcIjxjb2RlIC8+XCIpLnRleHQoJCh0aGlzKS50ZXh0KCkpO1xuICAgICAgICB9KTtcbiAgICAgIH19KTtcbiAgfSk7XG59KHdpbmRvdy5qUXVlcnkpKTtcbiIsIi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyB8ZG9jbmFtZXwgLSBBIGZyYW1ld29yayBhbGxvd2luZyBhIFJ1bmVzdG9uZSBjb21wb25lbnQgdG8gbG9hZCBvbmx5IHRoZSBKUyBpdCBuZWVkc1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIFRoZSBKYXZhU2NyaXB0IHJlcXVpcmVkIGJ5IGFsbCBSdW5lc3RvbmUgY29tcG9uZW50cyBpcyBxdWl0ZSBsYXJnZSBhbmQgcmVzdWx0cyBpbiBzbG93IHBhZ2UgbG9hZHMuIFRoaXMgYXBwcm9hY2ggZW5hYmxlcyBhIFJ1bmVzdG9uZSBjb21wb25lbnQgdG8gbG9hZCBvbmx5IHRoZSBKYXZhU2NyaXB0IGl0IG5lZWRzLCByYXRoZXIgdGhhbiBsb2FkaW5nIEphdmFTY3JpcHQgZm9yIGFsbCB0aGUgY29tcG9uZW50cyByZWdhcmRsZXNzIG9mIHdoaWNoIGFyZSBhY3R1YWxseSB1c2VkLlxuLy9cbi8vIFRvIGFjY29tcGxpc2ggdGhpcywgd2VicGFjaydzIHNwbGl0LWNodW5rcyBhYmlsaXR5IGFuYWx5emVzIGFsbCBKUywgc3RhcnRpbmcgZnJvbSB0aGlzIGZpbGUuIFRoZSBkeW5hbWljIGltcG9ydHMgYmVsb3cgYXJlIHRyYW5zZm9ybWVkIGJ5IHdlYnBhY2sgaW50byB0aGUgZHluYW1pYyBmZXRjaGVzIG9mIGp1c3QgdGhlIEpTIHJlcXVpcmVkIGJ5IGVhY2ggZmlsZSBhbmQgYWxsIGl0cyBkZXBlbmRlbmNpZXMuIChJZiB1c2luZyBzdGF0aWMgaW1wb3J0cywgd2VicGFjayB3aWxsIGFzc3VtZSB0aGF0IGFsbCBmaWxlcyBhcmUgYWxyZWFkeSBzdGF0aWNhbGx5IGxvYWRlZCB2aWEgc2NyaXB0IHRhZ3MsIGRlZmVhdGluZyB0aGUgcHVycG9zZSBvZiB0aGlzIGZyYW1ld29yay4pXG4vL1xuLy8gSG93ZXZlciwgdGhpcyBhcHByb2FjaCBsZWFkcyB0byBjb21wbGV4aXR5OlxuLy9cbi8vIC0gICAgVGhlIGBgZGF0YS1jb21wb25lbnRgYCBhdHRyaWJ1dGUgb2YgZWFjaCBjb21wb25lbnQgbXVzdCBiZSBrZXB0IGluIHN5bmMgd2l0aCB0aGUga2V5cyBvZiB0aGUgYGBtb2R1bGVfbWFwYGAgYmVsb3cuXG4vLyAtICAgIFRoZSB2YWx1ZXMgaW4gdGhlIGBgbW9kdWxlX21hcGBgIG11c3QgYmUga2VwdCBpbiBzeW5jIHdpdGggdGhlIEphdmFTY3JpcHQgZmlsZXMgd2hpY2ggaW1wbGVtZW50IGVhY2ggb2YgdGhlIGNvbXBvbmVudHMuXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBTdGF0aWMgaW1wb3J0c1xuLy8gPT09PT09PT09PT09PT1cbi8vIFRoZXNlIGltcG9ydHMgYXJlICh3ZSBhc3N1bWUpIG5lZWRlZCBieSBhbGwgcGFnZXMuIEhvd2V2ZXIsIGl0IHdvdWxkIGJlIG11Y2ggYmV0dGVyIHRvIGxvYWQgdGhlc2UgaW4gdGhlIG1vZHVsZXMgdGhhdCBhY3R1YWxseSB1c2UgdGhlbS5cbi8vXG4vLyBUaGVzZSBhcmUgc3RhdGljIGltcG9ydHM7IGNvZGUgaW4gYGR5bmFtaWNhbGx5IGxvYWRlZCBjb21wb25lbnRzYF8gZGVhbHMgd2l0aCBkeW5hbWljIGltcG9ydHMuXG4vL1xuLy8galF1ZXJ5LXJlbGF0ZWQgaW1wb3J0cy5cbmltcG9ydCBcImpxdWVyeS11aS9qcXVlcnktdWkuanNcIjtcbmltcG9ydCBcImpxdWVyeS11aS90aGVtZXMvYmFzZS9qcXVlcnkudWkuYWxsLmNzc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeS5pZGxlLXRpbWVyLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4uanNcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy9qcXVlcnlfaTE4bi9qcXVlcnkuaTE4bi5lbWl0dGVyLmJpZGkuanNcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy9qcXVlcnlfaTE4bi9qcXVlcnkuaTE4bi5lbWl0dGVyLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4uZmFsbGJhY2tzLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4ubWVzc2FnZXN0b3JlLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4ucGFyc2VyLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4ubGFuZ3VhZ2UuanNcIjtcblxuLy8gQm9vdHN0cmFwXG5pbXBvcnQgXCJib290c3RyYXAvZGlzdC9qcy9ib290c3RyYXAuanNcIjtcbmltcG9ydCBcImJvb3RzdHJhcC9kaXN0L2Nzcy9ib290c3RyYXAuY3NzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vcHJvamVjdF90ZW1wbGF0ZS9fdGVtcGxhdGVzL3BsdWdpbl9sYXlvdXRzL3NwaGlueF9ib290c3RyYXAvc3RhdGljL2Jvb3RzdHJhcC1zcGhpbnguanNcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9jc3MvcnVuZXN0b25lLWN1c3RvbS1zcGhpbngtYm9vdHN0cmFwLmNzc1wiO1xuXG4vLyBNaXNjXG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvYm9va2Z1bmNzLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvdXNlci1oaWdobGlnaHRzLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvcHJldGV4dC5qc1wiO1xuXG4vLyBUaGVzZSBiZWxvbmcgaW4gZHluYW1pYyBpbXBvcnRzIGZvciB0aGUgb2J2aW91cyBjb21wb25lbnQ7IGhvd2V2ZXIsIHRoZXNlIGNvbXBvbmVudHMgZG9uJ3QgaW5jbHVkZSBhIGBgZGF0YS1jb21wb25lbnRgYCBhdHRyaWJ1dGUuXG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9tYXRyaXhlcS9jc3MvbWF0cml4ZXEuY3NzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS93ZWJnbGRlbW8vY3NzL3dlYmdsaW50ZXJhY3RpdmUuY3NzXCI7XG5cbi8vIFRoZXNlIGFyZSBvbmx5IG5lZWRlZCBmb3IgdGhlIFJ1bmVzdG9uZSBib29rLCBidXQgbm90IGluIGEgbGlicmFyeSBtb2RlIChzdWNoIGFzIHByZXRleHQpLiBJIHdvdWxkIHByZWZlciB0byBkeW5hbWljYWxseSBsb2FkIHRoZW0uIEhvd2V2ZXIsIHRoZXNlIHNjcmlwdHMgYXJlIHNvIHNtYWxsIEkgaGF2ZW4ndCBib3RoZXJlZCB0byBkbyBzby5cbmltcG9ydCB7IGdldFN3aXRjaCwgc3dpdGNoVGhlbWUgfSBmcm9tIFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL3RoZW1lLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvcHJlc2VudGVyX21vZGUuanNcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9jc3MvcHJlc2VudGVyX21vZGUuY3NzXCI7XG5cbi8vIER5bmFtaWNhbGx5IGxvYWRlZCBjb21wb25lbnRzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGhpcyBwcm92aWRlcyBhIGxpc3Qgb2YgbW9kdWxlcyB0aGF0IGNvbXBvbmVudHMgY2FuIGR5bmFtaWNhbGx5IGltcG9ydC4gV2VicGFjayB3aWxsIGNyZWF0ZSBhIGxpc3Qgb2YgaW1wb3J0cyBmb3IgZWFjaCBiYXNlZCBvbiBpdHMgYW5hbHlzaXMuXG5jb25zdCBtb2R1bGVfbWFwID0ge1xuICAgIC8vIFdyYXAgZWFjaCBpbXBvcnQgaW4gYSBmdW5jdGlvbiwgc28gdGhhdCBpdCB3b24ndCBvY2N1ciB1bnRpbCB0aGUgZnVuY3Rpb24gaXMgY2FsbGVkLiBXaGlsZSBzb21ldGhpbmcgY2xlYW5lciB3b3VsZCBiZSBuaWNlLCB3ZWJwYWNrIGNhbid0IGFuYWx5emUgdGhpbmdzIGxpa2UgYGBpbXBvcnQoZXhwcmVzc2lvbilgYC5cbiAgICAvL1xuICAgIC8vIFRoZSBrZXlzIG11c3QgbWF0Y2ggdGhlIHZhbHVlIG9mIGVhY2ggY29tcG9uZW50J3MgYGBkYXRhLWNvbXBvbmVudGBgIGF0dHJpYnV0ZSAtLSB0aGUgYGBydW5lc3RvbmVfaW1wb3J0YGAgYW5kIGBgcnVuZXN0b25lX2F1dG9faW1wb3J0YGAgZnVuY3Rpb25zIGFzc3VtZSB0aGlzLlxuICAgIGFjdGl2ZWNvZGU6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2FjdGl2ZWNvZGUvanMvYWNmYWN0b3J5LmpzXCIpLFxuICAgIGJsZTogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvY2VsbGJvdGljcy9qcy9ibGUuanNcIiksXG4gICAgLy8gQWx3YXlzIGltcG9ydCB0aGUgdGltZWQgdmVyc2lvbiBvZiBhIGNvbXBvbmVudCBpZiBhdmFpbGFibGUsIHNpbmNlIHRoZSB0aW1lZCBjb21wb25lbnRzIGFsc28gZGVmaW5lIHRoZSBjb21wb25lbnQncyBmYWN0b3J5IGFuZCBpbmNsdWRlIHRoZSBjb21wb25lbnQgYXMgd2VsbC4gTm90ZSB0aGF0IGBgYWNmYWN0b3J5YGAgaW1wb3J0cyB0aGUgdGltZWQgY29tcG9uZW50cyBvZiBBY3RpdmVDb2RlLCBzbyBpdCBmb2xsb3dzIHRoaXMgcGF0dGVybi5cbiAgICBjbGlja2FibGVhcmVhOiAoKSA9PlxuICAgICAgICBpbXBvcnQoXCIuL3J1bmVzdG9uZS9jbGlja2FibGVBcmVhL2pzL3RpbWVkY2xpY2thYmxlLmpzXCIpLFxuICAgIGNvZGVsZW5zOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9jb2RlbGVucy9qcy9jb2RlbGVucy5qc1wiKSxcbiAgICBkYXRhZmlsZTogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvZGF0YWZpbGUvanMvZGF0YWZpbGUuanNcIiksXG4gICAgZHJhZ25kcm9wOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9kcmFnbmRyb3AvanMvdGltZWRkbmQuanNcIiksXG4gICAgZmlsbGludGhlYmxhbms6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2ZpdGIvanMvdGltZWRmaXRiLmpzXCIpLFxuICAgIGdyb3Vwc3ViOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9ncm91cHN1Yi9qcy9ncm91cHN1Yi5qc1wiKSxcbiAgICBraGFuZXg6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2toYW5leC9qcy9raGFuZXguanNcIiksXG4gICAgbHBfYnVpbGQ6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2xwL2pzL2xwLmpzXCIpLFxuICAgIG11bHRpcGxlY2hvaWNlOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9tY2hvaWNlL2pzL3RpbWVkbWMuanNcIiksXG4gICAgaHBhcnNvbnM6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2hwYXJzb25zL2pzL2hwYXJzb25zLXNxbC5qc1wiKSxcbiAgICBwYXJzb25zOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9wYXJzb25zL2pzL3RpbWVkcGFyc29ucy5qc1wiKSxcbiAgICBwb2xsOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9wb2xsL2pzL3BvbGwuanNcIiksXG4gICAgcXVpemx5OiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9xdWl6bHkvanMvcXVpemx5LmpzXCIpLFxuICAgIHJldmVhbDogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvcmV2ZWFsL2pzL3JldmVhbC5qc1wiKSxcbiAgICBzZWxlY3RxdWVzdGlvbjogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvc2VsZWN0cXVlc3Rpb24vanMvc2VsZWN0b25lLmpzXCIpLFxuICAgIHNob3J0YW5zd2VyOiAoKSA9PlxuICAgICAgICBpbXBvcnQoXCIuL3J1bmVzdG9uZS9zaG9ydGFuc3dlci9qcy90aW1lZF9zaG9ydGFuc3dlci5qc1wiKSxcbiAgICBzaG93ZXZhbDogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvc2hvd2V2YWwvanMvc2hvd0V2YWwuanNcIiksXG4gICAgc2ltcGxlX3NlbnNvcjogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvY2VsbGJvdGljcy9qcy9zaW1wbGVfc2Vuc29yLmpzXCIpLFxuICAgIHNwcmVhZHNoZWV0OiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9zcHJlYWRzaGVldC9qcy9zcHJlYWRzaGVldC5qc1wiKSxcbiAgICB0YWJiZWRTdHVmZjogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvdGFiYmVkU3R1ZmYvanMvdGFiYmVkc3R1ZmYuanNcIiksXG4gICAgdGltZWRBc3Nlc3NtZW50OiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS90aW1lZC9qcy90aW1lZC5qc1wiKSxcbiAgICB3YXZlZHJvbTogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvd2F2ZWRyb20vanMvd2F2ZWRyb20uanNcIiksXG4gICAgLy8gVE9ETzogc2luY2UgdGhpcyBpc24ndCBpbiBhIGBgZGF0YS1jb21wb25lbnRgYCwgbmVlZCB0byB0cmlnZ2VyIGFuIGltcG9ydCBvZiB0aGlzIGNvZGUgbWFudWFsbHkuXG4gICAgd2Vid29yazogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvd2Vid29yay9qcy93ZWJ3b3JrLmpzXCIpLFxuICAgIHlvdXR1YmU6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3ZpZGVvL2pzL3J1bmVzdG9uZXZpZGVvLmpzXCIpLFxufTtcblxuLy8gLi4gX2R5bmFtaWMgaW1wb3J0IG1hY2hpbmVyeTpcbi8vXG4vLyBEeW5hbWljIGltcG9ydCBtYWNoaW5lcnlcbi8vID09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRnVsZmlsbCBhIHByb21pc2Ugd2hlbiB0aGUgUnVuZXN0b25lIHByZS1sb2dpbiBjb21wbGV0ZSBldmVudCBvY2N1cnMuXG5sZXQgcHJlX2xvZ2luX2NvbXBsZXRlX3Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT5cbiAgICAkKGRvY3VtZW50KS5vbihcInJ1bmVzdG9uZTpwcmUtbG9naW4tY29tcGxldGVcIiwgcmVzb2x2ZSlcbik7XG5sZXQgbG9hZGVkQ29tcG9uZW50cztcbi8vIFByb3ZpZGUgYSBzaW1wbGUgZnVuY3Rpb24gdG8gaW1wb3J0IHRoZSBKUyBmb3IgYWxsIGNvbXBvbmVudHMgb24gdGhlIHBhZ2UuXG5leHBvcnQgZnVuY3Rpb24gcnVuZXN0b25lX2F1dG9faW1wb3J0KCkge1xuICAgIC8vIENyZWF0ZSBhIHNldCBvZiBgYGRhdGEtY29tcG9uZW50YGAgdmFsdWVzLCB0byBhdm9pZCBkdXBsaWNhdGlvbi5cbiAgICBjb25zdCBzID0gbmV3IFNldChcbiAgICAgICAgLy8gQWxsIFJ1bmVzdG9uZSBjb21wb25lbnRzIGhhdmUgYSBgYGRhdGEtY29tcG9uZW50YGAgYXR0cmlidXRlLlxuICAgICAgICAkKFwiW2RhdGEtY29tcG9uZW50XVwiKVxuICAgICAgICAgICAgLm1hcChcbiAgICAgICAgICAgICAgICAvLyBFeHRyYWN0IHRoZSB2YWx1ZSBvZiB0aGUgZGF0YS1jb21wb25lbnQgYXR0cmlidXRlLlxuICAgICAgICAgICAgICAgIChpbmRleCwgZWxlbWVudCkgPT4gJChlbGVtZW50KS5hdHRyKFwiZGF0YS1jb21wb25lbnRcIilcbiAgICAgICAgICAgICAgICAvLyBTd2l0Y2ggZnJvbSBhIGpRdWVyeSBvYmplY3QgYmFjayB0byBhbiBhcnJheSwgcGFzc2luZyB0aGF0IHRvIHRoZSBTZXQgY29uc3RydWN0b3IuXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuZ2V0KClcbiAgICApO1xuICAgIC8vIHdlYndvcmsgcXVlc3Rpb25zIGFyZSBub3Qgd3JhcHBlZCBpbiBkaXYgd2l0aCBhIGRhdGEtY29tcG9uZW50IHNvIHdlIGhhdmUgdG8gY2hlY2sgYSBkaWZmZXJlbnQgd2F5XG4gICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2Vid29yay1idXR0b25cIikpIHtcbiAgICAgICAgcy5hZGQoXCJ3ZWJ3b3JrXCIpO1xuICAgIH1cblxuICAgIC8vIExvYWQgSlMgZm9yIGVhY2ggb2YgdGhlIGNvbXBvbmVudHMgZm91bmQuXG4gICAgY29uc3QgYSA9IFsuLi5zXS5tYXAoKHZhbHVlKSA9PlxuICAgICAgICAvLyBJZiB0aGVyZSdzIG5vIEpTIGZvciB0aGlzIGNvbXBvbmVudCwgcmV0dXJuIGFuIGVtcHR5IFByb21pc2UuXG4gICAgICAgIChtb2R1bGVfbWFwW3ZhbHVlXSB8fCAoKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCkpKSgpXG4gICAgKTtcblxuICAgIC8vIFNlbmQgdGhlIFJ1bmVzdG9uZSBsb2dpbiBjb21wbGV0ZSBldmVudCB3aGVuIGFsbCBKUyBpcyBsb2FkZWQgYW5kIHRoZSBwcmUtbG9naW4gaXMgYWxzbyBjb21wbGV0ZS5cbiAgICBQcm9taXNlLmFsbChbcHJlX2xvZ2luX2NvbXBsZXRlX3Byb21pc2UsIC4uLmFdKS50aGVuKCgpID0+XG4gICAgICAgICQoZG9jdW1lbnQpLnRyaWdnZXIoXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIilcbiAgICApO1xufVxuXG4vLyBMb2FkIGNvbXBvbmVudCBKUyB3aGVuIHRoZSBkb2N1bWVudCBpcyByZWFkeS5cbiQoZG9jdW1lbnQpLnJlYWR5KHJ1bmVzdG9uZV9hdXRvX2ltcG9ydCk7XG5cbi8vIFByb3ZpZGUgYSBmdW5jdGlvbiB0byBpbXBvcnQgb25lIHNwZWNpZmljIFJ1bmVzdG9uZSBjb21wb25lbnQuXG4vLyB0aGUgaW1wb3J0IGZ1bmN0aW9uIGluc2lkZSBtb2R1bGVfbWFwIGlzIGFzeW5jIC0tIHJ1bmVzdG9uZV9pbXBvcnRcbi8vIHNob3VsZCBiZSBhd2FpdGVkIHdoZW4gbmVjZXNzYXJ5IHRvIGVuc3VyZSB0aGUgaW1wb3J0IGNvbXBsZXRlc1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJ1bmVzdG9uZV9pbXBvcnQoY29tcG9uZW50X25hbWUpIHtcbiAgICByZXR1cm4gbW9kdWxlX21hcFtjb21wb25lbnRfbmFtZV0oKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcG9wdXBTY3JhdGNoQUMoKSB7XG4gICAgLy8gbG9hZCB0aGUgYWN0aXZlY29kZSBidW5kbGVcbiAgICBhd2FpdCBydW5lc3RvbmVfaW1wb3J0KFwiYWN0aXZlY29kZVwiKTtcbiAgICAvLyBzY3JhdGNoRGl2IHdpbGwgYmUgZGVmaW5lZCBpZiB3ZSBoYXZlIGFscmVhZHkgY3JlYXRlZCBhIHNjcmF0Y2hcbiAgICAvLyBhY3RpdmVjb2RlLiAgSWYgaXRzIG5vdCBkZWZpbmVkIHRoZW4gd2UgbmVlZCB0byBnZXQgaXQgcmVhZHkgdG8gdG9nZ2xlXG4gICAgaWYgKCFlQm9va0NvbmZpZy5zY3JhdGNoRGl2KSB7XG4gICAgICAgIHdpbmRvdy5BQ0ZhY3RvcnkuY3JlYXRlU2NyYXRjaEFjdGl2ZWNvZGUoKTtcbiAgICAgICAgbGV0IGRpdmlkID0gZUJvb2tDb25maWcuc2NyYXRjaERpdjtcbiAgICAgICAgd2luZG93LmVkTGlzdFtkaXZpZF0gPSBBQ0ZhY3RvcnkuY3JlYXRlQWN0aXZlQ29kZShcbiAgICAgICAgICAgICQoYCMke2RpdmlkfWApWzBdLFxuICAgICAgICAgICAgZUJvb2tDb25maWcuYWNEZWZhdWx0TGFuZ3VhZ2VcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGVCb29rQ29uZmlnLmlzTG9nZ2VkSW4pIHtcbiAgICAgICAgICAgIHdpbmRvdy5lZExpc3RbZGl2aWRdLmVuYWJsZVNhdmVMb2FkKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgd2luZG93LkFDRmFjdG9yeS50b2dnbGVTY3JhdGNoQWN0aXZlY29kZSgpO1xufVxuXG4vLyBTZXQgdGhlIGRpcmVjdG9yeSBjb250YWluaW5nIHRoaXMgc2NyaXB0IGFzIHRoZSBgcGF0aCA8aHR0cHM6Ly93ZWJwYWNrLmpzLm9yZy9ndWlkZXMvcHVibGljLXBhdGgvI29uLXRoZS1mbHk+YF8gZm9yIGFsbCB3ZWJwYWNrZWQgc2NyaXB0cy5cbmNvbnN0IHNjcmlwdF9zcmMgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyYztcbl9fd2VicGFja19wdWJsaWNfcGF0aF9fID0gc2NyaXB0X3NyYy5zdWJzdHJpbmcoXG4gICAgMCxcbiAgICBzY3JpcHRfc3JjLmxhc3RJbmRleE9mKFwiL1wiKSArIDFcbik7XG5cbi8vIE1hbnVhbCBleHBvcnRzXG4vLyA9PT09PT09PT09PT09PVxuLy8gV2VicGFjaydzIGBgb3V0cHV0LmxpYnJhcnlgYCBzZXR0aW5nIGRvZXNuJ3Qgc2VlbSB0byB3b3JrIHdpdGggdGhlIHNwbGl0IGNodW5rcyBwbHVnaW47IGRvIGFsbCBleHBvcnRzIG1hbnVhbGx5IHRocm91Z2ggdGhlIGBgd2luZG93YGAgb2JqZWN0IGluc3RlYWQuXG5jb25zdCByYyA9IHt9O1xucmMucnVuZXN0b25lX2ltcG9ydCA9IHJ1bmVzdG9uZV9pbXBvcnQ7XG5yYy5ydW5lc3RvbmVfYXV0b19pbXBvcnQgPSBydW5lc3RvbmVfYXV0b19pbXBvcnQ7XG5yYy5nZXRTd2l0Y2ggPSBnZXRTd2l0Y2g7XG5yYy5zd2l0Y2hUaGVtZSA9IHN3aXRjaFRoZW1lO1xucmMucG9wdXBTY3JhdGNoQUMgPSBwb3B1cFNjcmF0Y2hBQztcbndpbmRvdy5ydW5lc3RvbmVDb21wb25lbnRzID0gcmM7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGpRdWVyeTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=