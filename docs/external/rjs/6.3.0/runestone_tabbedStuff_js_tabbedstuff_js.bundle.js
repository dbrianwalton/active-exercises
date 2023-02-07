"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_tabbedStuff_js_tabbedstuff_js"],{

/***/ 95766:
/*!***************************************************!*\
  !*** ./runestone/tabbedStuff/css/tabbedstuff.css ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 97887:
/*!*************************************************!*\
  !*** ./runestone/tabbedStuff/js/tabbedstuff.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase */ 2568);
/* harmony import */ var _css_tabbedstuff_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/tabbedstuff.css */ 95766);
/*==========================================
=======    Master tabbedstuff.js    ========
============================================
===     This file contains the JS for    ===
=== the Runestone tabbedStuff component. ===
============================================
===              Created by              ===
===           Isaiah Mayerchak           ===
===               06/15/15               ===
===             Brad Miller              ===
===               06/15/15               ===
==========================================*/


var TSList = {}; // Dictionary that contains all instances of TabbedStuff objects




// Define TabbedStuff object
class TabbedStuff extends _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig;
        this.origElem = orig; // entire original <div> element that will be replaced by new HTML
        this.divid = orig.id;
        this.inactive = false;
        if ($(this.origElem).is("[data-inactive]")) {
            this.inactive = true;
        }
        this.togglesList = []; // For use in Codemirror/Disqus
        this.childTabs = [];
        this.populateChildTabs();
        this.activeTab = 0; // default value--activeTab is the index of the tab that starts open
        this.findActiveTab();
        this.createTabContainer();
        this.indicate_component_ready();
    }
    /*===========================================
    == Update attributes of instance variables ==
    ==    variables according to specifications    ==
    ===========================================*/
    populateChildTabs() {
        for (var i = 0; i < this.origElem.childNodes.length; i++) {
            if ($(this.origElem.childNodes[i]).data("component") === "tab") {
                this.childTabs.push(this.origElem.childNodes[i]);
            }
        }
    }
    findActiveTab() {
        for (var i = 0; i < this.childTabs.length; i++) {
            if ($(this.childTabs[i]).is("[data-active]")) {
                this.activeTab = i;
            }
        }
    }
    /*==========================================
    == Creating/appending final HTML elements ==
    ==========================================*/
    createTabContainer() {
        this.containerDiv = document.createElement("div");
        this.containerDiv.id = this.divid;
        $(this.containerDiv).addClass(this.origElem.getAttribute("class"));
        $(this.containerDiv).attr({ role: "tabpanel" });
        this.tabsUL = document.createElement("ul");
        this.tabsUL.id = this.divid + "_tab";
        $(this.tabsUL).addClass("nav nav-tabs");
        $(this.tabsUL).attr({ role: "tablist" });
        this.tabContentDiv = document.createElement("div"); // Create tab content container that holds tab panes w/content
        $(this.tabContentDiv).addClass("tab-content");
        this.createTabs(); // create and append tabs to the <ul>
        this.containerDiv.appendChild(this.tabsUL);
        this.containerDiv.appendChild(this.tabContentDiv);
        this.addCMD(); // Adds fuctionality for Codemirror/Disqus
        $(this.origElem).replaceWith(this.containerDiv);
    }
    createTabs() {
        // Create tabs in format <li><a><span></span></a></li> to be appended to the <ul>
        for (var i = 0; i < this.childTabs.length; i++) {
            // First create tabname and tabfriendly name that has no spaces to be used for the id
            var tabListElement = document.createElement("li");
            $(tabListElement).attr({
                role: "presentation",
                "aria-controls": this.divid + "-" + i
            });
            // Using bootstrap tabs functionality
            var tabElement = document.createElement("a");
            $(tabElement).attr({
                "data-toggle": "tab",
                href: "#" + this.divid + "-" + i,
                role: "tab"
            });
            var tabTitle = document.createElement("span"); // Title of tab--what the user will see
            tabTitle.textContent = $(this.childTabs[i]).data("tabname");
            tabElement.appendChild(tabTitle);
            tabListElement.appendChild(tabElement);
            this.tabsUL.appendChild(tabListElement);
            // tabPane is what holds the contents of the tab
            var tabPaneDiv = document.createElement("div");
            tabPaneDiv.id = this.divid + "-" + i;
            $(tabPaneDiv).addClass("tab-pane");
            $(tabPaneDiv).attr({
                role: "tabpanel"
            });
            //var tabHTML = $(this.childTabs[i]).html();
            //$(tabPaneDiv).html(tabHTML);
            tabPaneDiv.appendChild(this.childTabs[i]);
            if (!this.inactive) {
                if (this.activeTab === i) {
                    $(tabListElement).addClass("active");
                    $(tabPaneDiv).addClass("active");
                }
            }
            this.togglesList.push(tabElement);
            this.tabContentDiv.appendChild(tabPaneDiv);
        }
    }
    /*===================================
    == Codemirror/Disqus functionality ==
    ===================================*/
    addCMD() {
        $(this.togglesList).on("shown.bs.tab", function(e) {
            var content_div = $(e.target.attributes.href.value);
            content_div.find(".disqus_thread_link").each(function() {
                $(this).click();
            });
            content_div.find(".CodeMirror").each(function(i, el) {
                el.CodeMirror.refresh();
            });
        });
    }
}

/*=================================
== Find the custom HTML tags and ==
==     execute our code on them        ==
=================================*/
$("load", function() {
    $("[data-component=tabbedStuff]").each(function(index) {
        TSList[this.id] = new TabbedStuff({ orig: this });
    });
});


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3RhYmJlZFN0dWZmX2pzX3RhYmJlZHN0dWZmX2pzLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2E7O0FBRWIsaUJBQWlCOztBQUV5QztBQUMxQjs7QUFFaEM7QUFDQSwwQkFBMEIsZ0VBQWE7QUFDdkM7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IscUNBQXFDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QiwyQkFBMkI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLGtCQUFrQjtBQUN0RDtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsaUJBQWlCO0FBQy9DLDREQUE0RDtBQUM1RDtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDJCQUEyQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYiwyREFBMkQ7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDLFlBQVk7QUFDeEQsS0FBSztBQUNMLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3RhYmJlZFN0dWZmL2Nzcy90YWJiZWRzdHVmZi5jc3M/MmZkNSIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3RhYmJlZFN0dWZmL2pzL3RhYmJlZHN0dWZmLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09ICAgIE1hc3RlciB0YWJiZWRzdHVmZi5qcyAgICA9PT09PT09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PSAgICAgVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBKUyBmb3IgICAgPT09XG49PT0gdGhlIFJ1bmVzdG9uZSB0YWJiZWRTdHVmZiBjb21wb25lbnQuID09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PSAgICAgICAgICAgICAgQ3JlYXRlZCBieSAgICAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgIElzYWlhaCBNYXllcmNoYWsgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgICAgMDYvMTUvMTUgICAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICBCcmFkIE1pbGxlciAgICAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgICAgICAwNi8xNS8xNSAgICAgICAgICAgICAgID09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgVFNMaXN0ID0ge307IC8vIERpY3Rpb25hcnkgdGhhdCBjb250YWlucyBhbGwgaW5zdGFuY2VzIG9mIFRhYmJlZFN0dWZmIG9iamVjdHNcblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlXCI7XG5pbXBvcnQgXCIuLi9jc3MvdGFiYmVkc3R1ZmYuY3NzXCI7XG5cbi8vIERlZmluZSBUYWJiZWRTdHVmZiBvYmplY3RcbmNsYXNzIFRhYmJlZFN0dWZmIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdmFyIG9yaWcgPSBvcHRzLm9yaWc7XG4gICAgICAgIHRoaXMub3JpZ0VsZW0gPSBvcmlnOyAvLyBlbnRpcmUgb3JpZ2luYWwgPGRpdj4gZWxlbWVudCB0aGF0IHdpbGwgYmUgcmVwbGFjZWQgYnkgbmV3IEhUTUxcbiAgICAgICAgdGhpcy5kaXZpZCA9IG9yaWcuaWQ7XG4gICAgICAgIHRoaXMuaW5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgaWYgKCQodGhpcy5vcmlnRWxlbSkuaXMoXCJbZGF0YS1pbmFjdGl2ZV1cIikpIHtcbiAgICAgICAgICAgIHRoaXMuaW5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudG9nZ2xlc0xpc3QgPSBbXTsgLy8gRm9yIHVzZSBpbiBDb2RlbWlycm9yL0Rpc3F1c1xuICAgICAgICB0aGlzLmNoaWxkVGFicyA9IFtdO1xuICAgICAgICB0aGlzLnBvcHVsYXRlQ2hpbGRUYWJzKCk7XG4gICAgICAgIHRoaXMuYWN0aXZlVGFiID0gMDsgLy8gZGVmYXVsdCB2YWx1ZS0tYWN0aXZlVGFiIGlzIHRoZSBpbmRleCBvZiB0aGUgdGFiIHRoYXQgc3RhcnRzIG9wZW5cbiAgICAgICAgdGhpcy5maW5kQWN0aXZlVGFiKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlVGFiQ29udGFpbmVyKCk7XG4gICAgICAgIHRoaXMuaW5kaWNhdGVfY29tcG9uZW50X3JlYWR5KCk7XG4gICAgfVxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09IFVwZGF0ZSBhdHRyaWJ1dGVzIG9mIGluc3RhbmNlIHZhcmlhYmxlcyA9PVxuICAgID09ICAgIHZhcmlhYmxlcyBhY2NvcmRpbmcgdG8gc3BlY2lmaWNhdGlvbnMgICAgPT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICBwb3B1bGF0ZUNoaWxkVGFicygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9yaWdFbGVtLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgkKHRoaXMub3JpZ0VsZW0uY2hpbGROb2Rlc1tpXSkuZGF0YShcImNvbXBvbmVudFwiKSA9PT0gXCJ0YWJcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRUYWJzLnB1c2godGhpcy5vcmlnRWxlbS5jaGlsZE5vZGVzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmaW5kQWN0aXZlVGFiKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRUYWJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoJCh0aGlzLmNoaWxkVGFic1tpXSkuaXMoXCJbZGF0YS1hY3RpdmVdXCIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVUYWIgPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT0gQ3JlYXRpbmcvYXBwZW5kaW5nIGZpbmFsIEhUTUwgZWxlbWVudHMgPT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIGNyZWF0ZVRhYkNvbnRhaW5lcigpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5pZCA9IHRoaXMuZGl2aWQ7XG4gICAgICAgICQodGhpcy5jb250YWluZXJEaXYpLmFkZENsYXNzKHRoaXMub3JpZ0VsZW0uZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikpO1xuICAgICAgICAkKHRoaXMuY29udGFpbmVyRGl2KS5hdHRyKHsgcm9sZTogXCJ0YWJwYW5lbFwiIH0pO1xuICAgICAgICB0aGlzLnRhYnNVTCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcbiAgICAgICAgdGhpcy50YWJzVUwuaWQgPSB0aGlzLmRpdmlkICsgXCJfdGFiXCI7XG4gICAgICAgICQodGhpcy50YWJzVUwpLmFkZENsYXNzKFwibmF2IG5hdi10YWJzXCIpO1xuICAgICAgICAkKHRoaXMudGFic1VMKS5hdHRyKHsgcm9sZTogXCJ0YWJsaXN0XCIgfSk7XG4gICAgICAgIHRoaXMudGFiQ29udGVudERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7IC8vIENyZWF0ZSB0YWIgY29udGVudCBjb250YWluZXIgdGhhdCBob2xkcyB0YWIgcGFuZXMgdy9jb250ZW50XG4gICAgICAgICQodGhpcy50YWJDb250ZW50RGl2KS5hZGRDbGFzcyhcInRhYi1jb250ZW50XCIpO1xuICAgICAgICB0aGlzLmNyZWF0ZVRhYnMoKTsgLy8gY3JlYXRlIGFuZCBhcHBlbmQgdGFicyB0byB0aGUgPHVsPlxuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnRhYnNVTCk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMudGFiQ29udGVudERpdik7XG4gICAgICAgIHRoaXMuYWRkQ01EKCk7IC8vIEFkZHMgZnVjdGlvbmFsaXR5IGZvciBDb2RlbWlycm9yL0Rpc3F1c1xuICAgICAgICAkKHRoaXMub3JpZ0VsZW0pLnJlcGxhY2VXaXRoKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICB9XG4gICAgY3JlYXRlVGFicygpIHtcbiAgICAgICAgLy8gQ3JlYXRlIHRhYnMgaW4gZm9ybWF0IDxsaT48YT48c3Bhbj48L3NwYW4+PC9hPjwvbGk+IHRvIGJlIGFwcGVuZGVkIHRvIHRoZSA8dWw+XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZFRhYnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIC8vIEZpcnN0IGNyZWF0ZSB0YWJuYW1lIGFuZCB0YWJmcmllbmRseSBuYW1lIHRoYXQgaGFzIG5vIHNwYWNlcyB0byBiZSB1c2VkIGZvciB0aGUgaWRcbiAgICAgICAgICAgIHZhciB0YWJMaXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgICAgICQodGFiTGlzdEVsZW1lbnQpLmF0dHIoe1xuICAgICAgICAgICAgICAgIHJvbGU6IFwicHJlc2VudGF0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJhcmlhLWNvbnRyb2xzXCI6IHRoaXMuZGl2aWQgKyBcIi1cIiArIGlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gVXNpbmcgYm9vdHN0cmFwIHRhYnMgZnVuY3Rpb25hbGl0eVxuICAgICAgICAgICAgdmFyIHRhYkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgICAgICAgICQodGFiRWxlbWVudCkuYXR0cih7XG4gICAgICAgICAgICAgICAgXCJkYXRhLXRvZ2dsZVwiOiBcInRhYlwiLFxuICAgICAgICAgICAgICAgIGhyZWY6IFwiI1wiICsgdGhpcy5kaXZpZCArIFwiLVwiICsgaSxcbiAgICAgICAgICAgICAgICByb2xlOiBcInRhYlwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciB0YWJUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpOyAvLyBUaXRsZSBvZiB0YWItLXdoYXQgdGhlIHVzZXIgd2lsbCBzZWVcbiAgICAgICAgICAgIHRhYlRpdGxlLnRleHRDb250ZW50ID0gJCh0aGlzLmNoaWxkVGFic1tpXSkuZGF0YShcInRhYm5hbWVcIik7XG4gICAgICAgICAgICB0YWJFbGVtZW50LmFwcGVuZENoaWxkKHRhYlRpdGxlKTtcbiAgICAgICAgICAgIHRhYkxpc3RFbGVtZW50LmFwcGVuZENoaWxkKHRhYkVsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy50YWJzVUwuYXBwZW5kQ2hpbGQodGFiTGlzdEVsZW1lbnQpO1xuICAgICAgICAgICAgLy8gdGFiUGFuZSBpcyB3aGF0IGhvbGRzIHRoZSBjb250ZW50cyBvZiB0aGUgdGFiXG4gICAgICAgICAgICB2YXIgdGFiUGFuZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICB0YWJQYW5lRGl2LmlkID0gdGhpcy5kaXZpZCArIFwiLVwiICsgaTtcbiAgICAgICAgICAgICQodGFiUGFuZURpdikuYWRkQ2xhc3MoXCJ0YWItcGFuZVwiKTtcbiAgICAgICAgICAgICQodGFiUGFuZURpdikuYXR0cih7XG4gICAgICAgICAgICAgICAgcm9sZTogXCJ0YWJwYW5lbFwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vdmFyIHRhYkhUTUwgPSAkKHRoaXMuY2hpbGRUYWJzW2ldKS5odG1sKCk7XG4gICAgICAgICAgICAvLyQodGFiUGFuZURpdikuaHRtbCh0YWJIVE1MKTtcbiAgICAgICAgICAgIHRhYlBhbmVEaXYuYXBwZW5kQ2hpbGQodGhpcy5jaGlsZFRhYnNbaV0pO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmluYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYWN0aXZlVGFiID09PSBpKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGFiTGlzdEVsZW1lbnQpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgICAgICAkKHRhYlBhbmVEaXYpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudG9nZ2xlc0xpc3QucHVzaCh0YWJFbGVtZW50KTtcbiAgICAgICAgICAgIHRoaXMudGFiQ29udGVudERpdi5hcHBlbmRDaGlsZCh0YWJQYW5lRGl2KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT0gQ29kZW1pcnJvci9EaXNxdXMgZnVuY3Rpb25hbGl0eSA9PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICBhZGRDTUQoKSB7XG4gICAgICAgICQodGhpcy50b2dnbGVzTGlzdCkub24oXCJzaG93bi5icy50YWJcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgdmFyIGNvbnRlbnRfZGl2ID0gJChlLnRhcmdldC5hdHRyaWJ1dGVzLmhyZWYudmFsdWUpO1xuICAgICAgICAgICAgY29udGVudF9kaXYuZmluZChcIi5kaXNxdXNfdGhyZWFkX2xpbmtcIikuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmNsaWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnRlbnRfZGl2LmZpbmQoXCIuQ29kZU1pcnJvclwiKS5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAgICAgICAgICAgZWwuQ29kZU1pcnJvci5yZWZyZXNoKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT0gRmluZCB0aGUgY3VzdG9tIEhUTUwgdGFncyBhbmQgPT1cbj09ICAgICBleGVjdXRlIG91ciBjb2RlIG9uIHRoZW0gICAgICAgID09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuJChcImxvYWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgJChcIltkYXRhLWNvbXBvbmVudD10YWJiZWRTdHVmZl1cIikuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICBUU0xpc3RbdGhpcy5pZF0gPSBuZXcgVGFiYmVkU3R1ZmYoeyBvcmlnOiB0aGlzIH0pO1xuICAgIH0pO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=