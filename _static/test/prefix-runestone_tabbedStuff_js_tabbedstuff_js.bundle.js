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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZV90YWJiZWRTdHVmZl9qc190YWJiZWRzdHVmZl9qcy5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNhOztBQUViLGlCQUFpQjs7QUFFeUM7QUFDMUI7O0FBRWhDO0FBQ0EsMEJBQTBCLGdFQUFhO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHFDQUFxQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsMkJBQTJCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxrQkFBa0I7QUFDdEQ7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLGlCQUFpQjtBQUMvQyw0REFBNEQ7QUFDNUQ7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QiwyQkFBMkI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsMkRBQTJEO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxZQUFZO0FBQ3hELEtBQUs7QUFDTCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS90YWJiZWRTdHVmZi9jc3MvdGFiYmVkc3R1ZmYuY3NzPzJmZDUiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS90YWJiZWRTdHVmZi9qcy90YWJiZWRzdHVmZi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PSAgICBNYXN0ZXIgdGFiYmVkc3R1ZmYuanMgICAgPT09PT09PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgIFRoaXMgZmlsZSBjb250YWlucyB0aGUgSlMgZm9yICAgID09PVxuPT09IHRoZSBSdW5lc3RvbmUgdGFiYmVkU3R1ZmYgY29tcG9uZW50LiA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgICAgICAgICAgIENyZWF0ZWQgYnkgICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICBJc2FpYWggTWF5ZXJjaGFrICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgIDA2LzE1LzE1ICAgICAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgICAgQnJhZCBNaWxsZXIgICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgICAgMDYvMTUvMTUgICAgICAgICAgICAgICA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIFRTTGlzdCA9IHt9OyAvLyBEaWN0aW9uYXJ5IHRoYXQgY29udGFpbnMgYWxsIGluc3RhbmNlcyBvZiBUYWJiZWRTdHVmZiBvYmplY3RzXG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZVwiO1xuaW1wb3J0IFwiLi4vY3NzL3RhYmJlZHN0dWZmLmNzc1wiO1xuXG4vLyBEZWZpbmUgVGFiYmVkU3R1ZmYgb2JqZWN0XG5jbGFzcyBUYWJiZWRTdHVmZiBleHRlbmRzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHZhciBvcmlnID0gb3B0cy5vcmlnO1xuICAgICAgICB0aGlzLm9yaWdFbGVtID0gb3JpZzsgLy8gZW50aXJlIG9yaWdpbmFsIDxkaXY+IGVsZW1lbnQgdGhhdCB3aWxsIGJlIHJlcGxhY2VkIGJ5IG5ldyBIVE1MXG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcmlnLmlkO1xuICAgICAgICB0aGlzLmluYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIGlmICgkKHRoaXMub3JpZ0VsZW0pLmlzKFwiW2RhdGEtaW5hY3RpdmVdXCIpKSB7XG4gICAgICAgICAgICB0aGlzLmluYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRvZ2dsZXNMaXN0ID0gW107IC8vIEZvciB1c2UgaW4gQ29kZW1pcnJvci9EaXNxdXNcbiAgICAgICAgdGhpcy5jaGlsZFRhYnMgPSBbXTtcbiAgICAgICAgdGhpcy5wb3B1bGF0ZUNoaWxkVGFicygpO1xuICAgICAgICB0aGlzLmFjdGl2ZVRhYiA9IDA7IC8vIGRlZmF1bHQgdmFsdWUtLWFjdGl2ZVRhYiBpcyB0aGUgaW5kZXggb2YgdGhlIHRhYiB0aGF0IHN0YXJ0cyBvcGVuXG4gICAgICAgIHRoaXMuZmluZEFjdGl2ZVRhYigpO1xuICAgICAgICB0aGlzLmNyZWF0ZVRhYkNvbnRhaW5lcigpO1xuICAgICAgICB0aGlzLmluZGljYXRlX2NvbXBvbmVudF9yZWFkeSgpO1xuICAgIH1cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PSBVcGRhdGUgYXR0cmlidXRlcyBvZiBpbnN0YW5jZSB2YXJpYWJsZXMgPT1cbiAgICA9PSAgICB2YXJpYWJsZXMgYWNjb3JkaW5nIHRvIHNwZWNpZmljYXRpb25zICAgID09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgcG9wdWxhdGVDaGlsZFRhYnMoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5vcmlnRWxlbS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoJCh0aGlzLm9yaWdFbGVtLmNoaWxkTm9kZXNbaV0pLmRhdGEoXCJjb21wb25lbnRcIikgPT09IFwidGFiXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkVGFicy5wdXNoKHRoaXMub3JpZ0VsZW0uY2hpbGROb2Rlc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmluZEFjdGl2ZVRhYigpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkVGFicy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKCQodGhpcy5jaGlsZFRhYnNbaV0pLmlzKFwiW2RhdGEtYWN0aXZlXVwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlVGFiID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09IENyZWF0aW5nL2FwcGVuZGluZyBmaW5hbCBIVE1MIGVsZW1lbnRzID09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICBjcmVhdGVUYWJDb250YWluZXIoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICAkKHRoaXMuY29udGFpbmVyRGl2KS5hZGRDbGFzcyh0aGlzLm9yaWdFbGVtLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpKTtcbiAgICAgICAgJCh0aGlzLmNvbnRhaW5lckRpdikuYXR0cih7IHJvbGU6IFwidGFicGFuZWxcIiB9KTtcbiAgICAgICAgdGhpcy50YWJzVUwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG4gICAgICAgIHRoaXMudGFic1VMLmlkID0gdGhpcy5kaXZpZCArIFwiX3RhYlwiO1xuICAgICAgICAkKHRoaXMudGFic1VMKS5hZGRDbGFzcyhcIm5hdiBuYXYtdGFic1wiKTtcbiAgICAgICAgJCh0aGlzLnRhYnNVTCkuYXR0cih7IHJvbGU6IFwidGFibGlzdFwiIH0pO1xuICAgICAgICB0aGlzLnRhYkNvbnRlbnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpOyAvLyBDcmVhdGUgdGFiIGNvbnRlbnQgY29udGFpbmVyIHRoYXQgaG9sZHMgdGFiIHBhbmVzIHcvY29udGVudFxuICAgICAgICAkKHRoaXMudGFiQ29udGVudERpdikuYWRkQ2xhc3MoXCJ0YWItY29udGVudFwiKTtcbiAgICAgICAgdGhpcy5jcmVhdGVUYWJzKCk7IC8vIGNyZWF0ZSBhbmQgYXBwZW5kIHRhYnMgdG8gdGhlIDx1bD5cbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy50YWJzVUwpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnRhYkNvbnRlbnREaXYpO1xuICAgICAgICB0aGlzLmFkZENNRCgpOyAvLyBBZGRzIGZ1Y3Rpb25hbGl0eSBmb3IgQ29kZW1pcnJvci9EaXNxdXNcbiAgICAgICAgJCh0aGlzLm9yaWdFbGVtKS5yZXBsYWNlV2l0aCh0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgfVxuICAgIGNyZWF0ZVRhYnMoKSB7XG4gICAgICAgIC8vIENyZWF0ZSB0YWJzIGluIGZvcm1hdCA8bGk+PGE+PHNwYW4+PC9zcGFuPjwvYT48L2xpPiB0byBiZSBhcHBlbmRlZCB0byB0aGUgPHVsPlxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRUYWJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBGaXJzdCBjcmVhdGUgdGFibmFtZSBhbmQgdGFiZnJpZW5kbHkgbmFtZSB0aGF0IGhhcyBubyBzcGFjZXMgdG8gYmUgdXNlZCBmb3IgdGhlIGlkXG4gICAgICAgICAgICB2YXIgdGFiTGlzdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgICAgICAkKHRhYkxpc3RFbGVtZW50KS5hdHRyKHtcbiAgICAgICAgICAgICAgICByb2xlOiBcInByZXNlbnRhdGlvblwiLFxuICAgICAgICAgICAgICAgIFwiYXJpYS1jb250cm9sc1wiOiB0aGlzLmRpdmlkICsgXCItXCIgKyBpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIFVzaW5nIGJvb3RzdHJhcCB0YWJzIGZ1bmN0aW9uYWxpdHlcbiAgICAgICAgICAgIHZhciB0YWJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgICAgICAkKHRhYkVsZW1lbnQpLmF0dHIoe1xuICAgICAgICAgICAgICAgIFwiZGF0YS10b2dnbGVcIjogXCJ0YWJcIixcbiAgICAgICAgICAgICAgICBocmVmOiBcIiNcIiArIHRoaXMuZGl2aWQgKyBcIi1cIiArIGksXG4gICAgICAgICAgICAgICAgcm9sZTogXCJ0YWJcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgdGFiVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTsgLy8gVGl0bGUgb2YgdGFiLS13aGF0IHRoZSB1c2VyIHdpbGwgc2VlXG4gICAgICAgICAgICB0YWJUaXRsZS50ZXh0Q29udGVudCA9ICQodGhpcy5jaGlsZFRhYnNbaV0pLmRhdGEoXCJ0YWJuYW1lXCIpO1xuICAgICAgICAgICAgdGFiRWxlbWVudC5hcHBlbmRDaGlsZCh0YWJUaXRsZSk7XG4gICAgICAgICAgICB0YWJMaXN0RWxlbWVudC5hcHBlbmRDaGlsZCh0YWJFbGVtZW50KTtcbiAgICAgICAgICAgIHRoaXMudGFic1VMLmFwcGVuZENoaWxkKHRhYkxpc3RFbGVtZW50KTtcbiAgICAgICAgICAgIC8vIHRhYlBhbmUgaXMgd2hhdCBob2xkcyB0aGUgY29udGVudHMgb2YgdGhlIHRhYlxuICAgICAgICAgICAgdmFyIHRhYlBhbmVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgdGFiUGFuZURpdi5pZCA9IHRoaXMuZGl2aWQgKyBcIi1cIiArIGk7XG4gICAgICAgICAgICAkKHRhYlBhbmVEaXYpLmFkZENsYXNzKFwidGFiLXBhbmVcIik7XG4gICAgICAgICAgICAkKHRhYlBhbmVEaXYpLmF0dHIoe1xuICAgICAgICAgICAgICAgIHJvbGU6IFwidGFicGFuZWxcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL3ZhciB0YWJIVE1MID0gJCh0aGlzLmNoaWxkVGFic1tpXSkuaHRtbCgpO1xuICAgICAgICAgICAgLy8kKHRhYlBhbmVEaXYpLmh0bWwodGFiSFRNTCk7XG4gICAgICAgICAgICB0YWJQYW5lRGl2LmFwcGVuZENoaWxkKHRoaXMuY2hpbGRUYWJzW2ldKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5pbmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZVRhYiA9PT0gaSkge1xuICAgICAgICAgICAgICAgICAgICAkKHRhYkxpc3RFbGVtZW50KS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0YWJQYW5lRGl2KS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZXNMaXN0LnB1c2godGFiRWxlbWVudCk7XG4gICAgICAgICAgICB0aGlzLnRhYkNvbnRlbnREaXYuYXBwZW5kQ2hpbGQodGFiUGFuZURpdik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09IENvZGVtaXJyb3IvRGlzcXVzIGZ1bmN0aW9uYWxpdHkgPT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgYWRkQ01EKCkge1xuICAgICAgICAkKHRoaXMudG9nZ2xlc0xpc3QpLm9uKFwic2hvd24uYnMudGFiXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciBjb250ZW50X2RpdiA9ICQoZS50YXJnZXQuYXR0cmlidXRlcy5ocmVmLnZhbHVlKTtcbiAgICAgICAgICAgIGNvbnRlbnRfZGl2LmZpbmQoXCIuZGlzcXVzX3RocmVhZF9saW5rXCIpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5jbGljaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb250ZW50X2Rpdi5maW5kKFwiLkNvZGVNaXJyb3JcIikuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgICAgICAgICAgIGVsLkNvZGVNaXJyb3IucmVmcmVzaCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09IEZpbmQgdGhlIGN1c3RvbSBIVE1MIHRhZ3MgYW5kID09XG49PSAgICAgZXhlY3V0ZSBvdXIgY29kZSBvbiB0aGVtICAgICAgICA9PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiQoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xuICAgICQoXCJbZGF0YS1jb21wb25lbnQ9dGFiYmVkU3R1ZmZdXCIpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgVFNMaXN0W3RoaXMuaWRdID0gbmV3IFRhYmJlZFN0dWZmKHsgb3JpZzogdGhpcyB9KTtcbiAgICB9KTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9