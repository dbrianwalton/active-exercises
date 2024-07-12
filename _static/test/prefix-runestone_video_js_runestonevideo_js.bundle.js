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
        window.componentMap[this.id] = new RunestoneVideo(opts);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZV92aWRlb19qc19ydW5lc3RvbmV2aWRlb19qcy5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7OztBQ0FhOztBQUU2QztBQUNoQzs7QUFFMUIsNkJBQTZCLGdFQUFhO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixXQUFXO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixnRUFBYTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLE1BQU07QUFDTix3Q0FBd0MsZUFBZTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1QsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3ZpZGVvL2Nzcy92aWRlby5jc3M/Y2MxNiIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3ZpZGVvL2pzL3J1bmVzdG9uZXZpZGVvLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2VcIjtcbmltcG9ydCBcIi4uL2Nzcy92aWRlby5jc3NcIjtcblxuY2xhc3MgUnVuZXN0b25lVmlkZW8gZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB0aGlzLmRpdmlkID0gb3B0cy5vcmlnLmlkO1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9ICQoYCMke3RoaXMuZGl2aWR9YCk7XG4gICAgICAgIHRoaXMuY2FwdGlvbiA9IFwiWW91VHViZVwiO1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ5b3V0dWJlc2NyaXB0XCIpID09IG51bGwpIHtcbiAgICAgICAgICAgIGxldCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICAgICAgc2NyaXB0LmlkID0gXCJ5b3V0dWJlc2NyaXB0XCI7XG4gICAgICAgICAgICBzY3JpcHQuc3JjID0gXCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9wbGF5ZXJfYXBpXCI7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYgPSB0aGlzLmNvbnRhaW5lclswXS5wYXJlbnRFbGVtZW50O1xuICAgICAgICB0aGlzLmFkZENhcHRpb24oXCJydW5lc3RvbmVcIik7XG4gICAgICAgIHRoaXMuaW5kaWNhdGVfY29tcG9uZW50X3JlYWR5KCk7XG4gICAgfVxufVxuXG53aW5kb3cub25QbGF5ZXJTdGF0ZUNoYW5nZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIGxldCByYiA9IG5ldyBSdW5lc3RvbmVCYXNlKCk7XG4gICAgbGV0IHZpZGVvVGltZSA9IGV2ZW50LnRhcmdldC5nZXRDdXJyZW50VGltZSgpO1xuICAgIGxldCBkYXRhID0ge1xuICAgICAgICBldmVudDogXCJ2aWRlb1wiLFxuICAgICAgICBkaXZfaWQ6IGV2ZW50LnRhcmdldC5nZXRJZnJhbWUoKS5pZCxcbiAgICB9O1xuICAgIGlmIChldmVudC5kYXRhID09IFlULlBsYXllclN0YXRlLlBMQVlJTkcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJwbGF5aW5nIFwiICsgZXZlbnQudGFyZ2V0LmdldElmcmFtZSgpLmlkKTtcbiAgICAgICAgZGF0YS5hY3QgPSBcInBsYXk6XCIgKyB2aWRlb1RpbWU7XG4gICAgfSBlbHNlIGlmIChldmVudC5kYXRhID09IFlULlBsYXllclN0YXRlLkVOREVEKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZW5kZWQgXCIgKyBldmVudC50YXJnZXQuZ2V0SWZyYW1lKCkuaWQpO1xuICAgICAgICBkYXRhLmFjdCA9IFwiY29tcGxldGVcIjtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LmRhdGEgPT0gWVQuUGxheWVyU3RhdGUuUEFVU0VEKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicGF1c2VkIGF0IFwiICsgdmlkZW9UaW1lKTtcbiAgICAgICAgZGF0YS5hY3QgPSBcInBhdXNlOlwiICsgdmlkZW9UaW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBZVCBQbGF5ZXIgU3RhdGU6ICR7WVQuUGxheWVyU3RhdGV9YCk7XG4gICAgICAgIGRhdGEuYWN0ID0gXCJyZWFkeVwiO1xuICAgIH1cbiAgICByYi5sb2dCb29rRXZlbnQoZGF0YSk7XG59O1xuXG4vL0NhbGxiYWNrIGZ1bmN0aW9uIHRvIGxvYWQgeW91dHViZSB2aWRlb3Mgb25jZSBJRnJhbWUgUGxheWVyIGxvYWRzXG53aW5kb3cub25Zb3VUdWJlSWZyYW1lQVBJUmVhZHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHZpZGVvbGlzdCA9ICQoXCIueW91dHViZS12aWRlb1wiKTtcbiAgICB2aWRlb2xpc3QuZWFjaChmdW5jdGlvbiAoaSwgdmlkZW8pIHtcbiAgICAgICAgbGV0IHBsYXllclZhcnMgPSB7fTtcbiAgICAgICAgcGxheWVyVmFyc1tcInN0YXJ0XCJdID0gJCh2aWRlbykuZGF0YShcInZpZGVvLXN0YXJ0XCIpO1xuICAgICAgICBpZiAoJCh2aWRlbykuZGF0YShcInZpZGVvLWVuZFwiKSAhPSAtMSlcbiAgICAgICAgICAgIHBsYXllclZhcnNbXCJlbmRcIl0gPSAkKHZpZGVvKS5kYXRhKFwidmlkZW8tZW5kXCIpO1xuICAgICAgICBsZXQgcGxheWVyID0gbmV3IFlULlBsYXllcigkKHZpZGVvKS5kYXRhKFwidmlkZW8tZGl2aWRcIiksIHtcbiAgICAgICAgICAgIGhlaWdodDogJCh2aWRlbykuZGF0YShcInZpZGVvLWhlaWdodFwiKSxcbiAgICAgICAgICAgIHdpZHRoOiAkKHZpZGVvKS5kYXRhKFwidmlkZW8td2lkdGhcIiksXG4gICAgICAgICAgICB2aWRlb0lkOiAkKHZpZGVvKS5kYXRhKFwidmlkZW8tdmlkZW9pZFwiKSxcbiAgICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgcGxheWVyVmFyczogcGxheWVyVmFycyxcbiAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICAgIG9uU3RhdGVDaGFuZ2U6IHdpbmRvdy5vblBsYXllclN0YXRlQ2hhbmdlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG4vL05lZWQgdG8gbWFrZSBzdXJlIHRoZSBZb3VUdWJlIElGcmFtZSBQbGF5ZXIgQVBJIGlzIG5vdCBsb2FkZWQgdW50aWwgYWZ0ZXJcbi8vIGFsbCBZb3VUdWJlIHZpZGVvcyBhcmUgaW4gdGhlIERPTS4gQWRkIGEgc2NyaXB0IHRhZyB3aXRoIGl0IGFmdGVyIGRvY3VtZW50IGlzIGxvYWRlZFxuJChmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgc2NyaXB0LnNyYyA9IFwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vcGxheWVyX2FwaVwiO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbn0pO1xuXG4kKGRvY3VtZW50KS5vbihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgJChcIltkYXRhLWNvbXBvbmVudD15b3V0dWJlXVwiKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAvLyBNQ1xuICAgICAgICB2YXIgb3B0cyA9IHtcbiAgICAgICAgICAgIG9yaWc6IHRoaXMsXG4gICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMsXG4gICAgICAgIH07XG4gICAgICAgIHdpbmRvdy5jb21wb25lbnRNYXBbdGhpcy5pZF0gPSBuZXcgUnVuZXN0b25lVmlkZW8ob3B0cyk7XG4gICAgfSk7XG59KTtcblxuaWYgKHR5cGVvZiB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPSB7fTtcbn1cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeS55b3V0dWJlID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICByZXR1cm4gbmV3IFJ1bmVzdG9uZVZpZGVvKG9wdHMpO1xufTtcblxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5LnZpbWVvID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICByZXR1cm4gbmV3IFJ1bmVzdG9uZVZpZGVvKG9wdHMpO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==