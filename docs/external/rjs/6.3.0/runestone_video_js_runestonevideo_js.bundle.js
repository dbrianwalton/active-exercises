"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_video_js_runestonevideo_js"],{

/***/ 31786:
/*!***************************************!*\
  !*** ./runestone/video/css/video.css ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 48657:
/*!**********************************************!*\
  !*** ./runestone/video/js/runestonevideo.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase */ 2568);
/* harmony import */ var _css_video_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/video.css */ 31786);





var vidList = [];
class RunestoneVideo extends _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        this.divid = opts.orig.id;
        this.container = $(`#${this.divid}`);
        this.caption = "YouTube";
        if (document.getElementById("youtubescript") == null) {
            let script = document.createElement("script");
            script.id = "youtubescript";
            script.src = "https://www.youtube.com/player_api";
            document.body.appendChild(script);
        }
        this.containerDiv = this.container[0].parentElement;
        this.addCaption("runestone");
        this.indicate_component_ready();
    }
}

window.onPlayerStateChange = function (event) {
    let rb = new _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"]();
    let videoTime = event.target.getCurrentTime();
    let data = {
        event: "video",
        div_id: event.target.getIframe().id,
    };
    if (event.data == YT.PlayerState.PLAYING) {
        console.log("playing " + event.target.getIframe().id);
        data.act = "play:" + videoTime;
    } else if (event.data == YT.PlayerState.ENDED) {
        console.log("ended " + event.target.getIframe().id);
        data.act = "complete";
    } else if (event.data == YT.PlayerState.PAUSED) {
        console.log("paused at " + videoTime);
        data.act = "pause:" + videoTime;
    } else {
        console.log(`YT Player State: ${YT.PlayerState}`);
        data.act = "ready";
    }
    rb.logBookEvent(data);
};

//Callback function to load youtube videos once IFrame Player loads
window.onYouTubeIframeAPIReady = function () {
    let videolist = $(".youtube-video");
    videolist.each(function (i, video) {
        let playerVars = {};
        playerVars["start"] = $(video).data("video-start");
        if ($(video).data("video-end") != -1)
            playerVars["end"] = $(video).data("video-end");
        let player = new YT.Player($(video).data("video-divid"), {
            height: $(video).data("video-height"),
            width: $(video).data("video-width"),
            videoId: $(video).data("video-videoid"),
            align: "center",
            playerVars: playerVars,
            events: {
                onStateChange: window.onPlayerStateChange,
            },
        });
    });
};

//Need to make sure the YouTube IFrame Player API is not loaded until after
// all YouTube videos are in the DOM. Add a script tag with it after document is loaded
$(function () {
    let script = document.createElement("script");
    script.src = "https://www.youtube.com/player_api";
    document.body.appendChild(script);
});

$(document).on("runestone:login-complete", function () {
    $("[data-component=youtube]").each(function (index) {
        // MC
        var opts = {
            orig: this,
            useRunestoneServices: eBookConfig.useRunestoneServices,
        };
        vidList[this.id] = new RunestoneVideo(opts);
    });
});

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory.youtube = function (opts) {
    return new RunestoneVideo(opts);
};

window.component_factory.vimeo = function (opts) {
    return new RunestoneVideo(opts);
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3ZpZGVvX2pzX3J1bmVzdG9uZXZpZGVvX2pzLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7O0FDQWE7O0FBRTZDO0FBQ2hDOztBQUUxQjtBQUNBLDZCQUE2QixnRUFBYTtBQUMxQztBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsV0FBVztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsZ0VBQWE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ04sd0NBQXdDLGVBQWU7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNULEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS92aWRlby9jc3MvdmlkZW8uY3NzP2NjMTYiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS92aWRlby9qcy9ydW5lc3RvbmV2aWRlby5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlXCI7XG5pbXBvcnQgXCIuLi9jc3MvdmlkZW8uY3NzXCI7XG5cbnZhciB2aWRMaXN0ID0gW107XG5jbGFzcyBSdW5lc3RvbmVWaWRlbyBleHRlbmRzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcHRzLm9yaWcuaWQ7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gJChgIyR7dGhpcy5kaXZpZH1gKTtcbiAgICAgICAgdGhpcy5jYXB0aW9uID0gXCJZb3VUdWJlXCI7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInlvdXR1YmVzY3JpcHRcIikgPT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQuaWQgPSBcInlvdXR1YmVzY3JpcHRcIjtcbiAgICAgICAgICAgIHNjcmlwdC5zcmMgPSBcImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3BsYXllcl9hcGlcIjtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IHRoaXMuY29udGFpbmVyWzBdLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIHRoaXMuYWRkQ2FwdGlvbihcInJ1bmVzdG9uZVwiKTtcbiAgICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbiAgICB9XG59XG5cbndpbmRvdy5vblBsYXllclN0YXRlQ2hhbmdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgbGV0IHJiID0gbmV3IFJ1bmVzdG9uZUJhc2UoKTtcbiAgICBsZXQgdmlkZW9UaW1lID0gZXZlbnQudGFyZ2V0LmdldEN1cnJlbnRUaW1lKCk7XG4gICAgbGV0IGRhdGEgPSB7XG4gICAgICAgIGV2ZW50OiBcInZpZGVvXCIsXG4gICAgICAgIGRpdl9pZDogZXZlbnQudGFyZ2V0LmdldElmcmFtZSgpLmlkLFxuICAgIH07XG4gICAgaWYgKGV2ZW50LmRhdGEgPT0gWVQuUGxheWVyU3RhdGUuUExBWUlORykge1xuICAgICAgICBjb25zb2xlLmxvZyhcInBsYXlpbmcgXCIgKyBldmVudC50YXJnZXQuZ2V0SWZyYW1lKCkuaWQpO1xuICAgICAgICBkYXRhLmFjdCA9IFwicGxheTpcIiArIHZpZGVvVGltZTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LmRhdGEgPT0gWVQuUGxheWVyU3RhdGUuRU5ERUQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJlbmRlZCBcIiArIGV2ZW50LnRhcmdldC5nZXRJZnJhbWUoKS5pZCk7XG4gICAgICAgIGRhdGEuYWN0ID0gXCJjb21wbGV0ZVwiO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQuZGF0YSA9PSBZVC5QbGF5ZXJTdGF0ZS5QQVVTRUQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJwYXVzZWQgYXQgXCIgKyB2aWRlb1RpbWUpO1xuICAgICAgICBkYXRhLmFjdCA9IFwicGF1c2U6XCIgKyB2aWRlb1RpbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coYFlUIFBsYXllciBTdGF0ZTogJHtZVC5QbGF5ZXJTdGF0ZX1gKTtcbiAgICAgICAgZGF0YS5hY3QgPSBcInJlYWR5XCI7XG4gICAgfVxuICAgIHJiLmxvZ0Jvb2tFdmVudChkYXRhKTtcbn07XG5cbi8vQ2FsbGJhY2sgZnVuY3Rpb24gdG8gbG9hZCB5b3V0dWJlIHZpZGVvcyBvbmNlIElGcmFtZSBQbGF5ZXIgbG9hZHNcbndpbmRvdy5vbllvdVR1YmVJZnJhbWVBUElSZWFkeSA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgdmlkZW9saXN0ID0gJChcIi55b3V0dWJlLXZpZGVvXCIpO1xuICAgIHZpZGVvbGlzdC5lYWNoKGZ1bmN0aW9uIChpLCB2aWRlbykge1xuICAgICAgICBsZXQgcGxheWVyVmFycyA9IHt9O1xuICAgICAgICBwbGF5ZXJWYXJzW1wic3RhcnRcIl0gPSAkKHZpZGVvKS5kYXRhKFwidmlkZW8tc3RhcnRcIik7XG4gICAgICAgIGlmICgkKHZpZGVvKS5kYXRhKFwidmlkZW8tZW5kXCIpICE9IC0xKVxuICAgICAgICAgICAgcGxheWVyVmFyc1tcImVuZFwiXSA9ICQodmlkZW8pLmRhdGEoXCJ2aWRlby1lbmRcIik7XG4gICAgICAgIGxldCBwbGF5ZXIgPSBuZXcgWVQuUGxheWVyKCQodmlkZW8pLmRhdGEoXCJ2aWRlby1kaXZpZFwiKSwge1xuICAgICAgICAgICAgaGVpZ2h0OiAkKHZpZGVvKS5kYXRhKFwidmlkZW8taGVpZ2h0XCIpLFxuICAgICAgICAgICAgd2lkdGg6ICQodmlkZW8pLmRhdGEoXCJ2aWRlby13aWR0aFwiKSxcbiAgICAgICAgICAgIHZpZGVvSWQ6ICQodmlkZW8pLmRhdGEoXCJ2aWRlby12aWRlb2lkXCIpLFxuICAgICAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgICAgICBwbGF5ZXJWYXJzOiBwbGF5ZXJWYXJzLFxuICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgICAgb25TdGF0ZUNoYW5nZTogd2luZG93Lm9uUGxheWVyU3RhdGVDaGFuZ2UsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cbi8vTmVlZCB0byBtYWtlIHN1cmUgdGhlIFlvdVR1YmUgSUZyYW1lIFBsYXllciBBUEkgaXMgbm90IGxvYWRlZCB1bnRpbCBhZnRlclxuLy8gYWxsIFlvdVR1YmUgdmlkZW9zIGFyZSBpbiB0aGUgRE9NLiBBZGQgYSBzY3JpcHQgdGFnIHdpdGggaXQgYWZ0ZXIgZG9jdW1lbnQgaXMgbG9hZGVkXG4kKGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICBzY3JpcHQuc3JjID0gXCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9wbGF5ZXJfYXBpXCI7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xufSk7XG5cbiQoZG9jdW1lbnQpLm9uKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAkKFwiW2RhdGEtY29tcG9uZW50PXlvdXR1YmVdXCIpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIC8vIE1DXG4gICAgICAgIHZhciBvcHRzID0ge1xuICAgICAgICAgICAgb3JpZzogdGhpcyxcbiAgICAgICAgICAgIHVzZVJ1bmVzdG9uZVNlcnZpY2VzOiBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyxcbiAgICAgICAgfTtcbiAgICAgICAgdmlkTGlzdFt0aGlzLmlkXSA9IG5ldyBSdW5lc3RvbmVWaWRlbyhvcHRzKTtcbiAgICB9KTtcbn0pO1xuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5LnlvdXR1YmUgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIHJldHVybiBuZXcgUnVuZXN0b25lVmlkZW8ob3B0cyk7XG59O1xuXG53aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkudmltZW8gPSBmdW5jdGlvbiAob3B0cykge1xuICAgIHJldHVybiBuZXcgUnVuZXN0b25lVmlkZW8ob3B0cyk7XG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9