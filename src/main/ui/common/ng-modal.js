/* global angular */
(function () {
    "use strict";
    angular.module("cwCommon")
        .directive('modalDialog', function ($timeout) {
            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                compile: function (element, attrs) {
                    var div, divs, spans, i, style;
                    if(attrs.width || attrs.height) {
                        style = {};
                        if (attrs.width) {
                            style.width = attrs.width;
                        }
                        if (attrs.height) {
                            style.height = attrs.height;
                        }
                    }
                    spans = element.find("span");
                    for(i=0; i<spans.length; i++) {
                        if(spans.eq(i).hasClass('ng-modal-title')) {
                            if(attrs.dialogTitle)
                                spans.eq(i).text(attrs.dialogTitle);
                            else
                                spans.eq(i).css({display: "none"});
                            break;
                        }
                    }
                    divs = element.find("div");
                    for(i=0; i<divs.length; i++) {
                        div = divs.eq(i);
                        if(div.hasClass('ng-modal-overlay') || div.hasClass('ng-modal-close')) {
                            if (!attrs.hasOwnProperty('force'))
                                div.attr("ng-click", attrs.ngShow + "=false");
                        } else if(style && div.hasClass('ng-modal-dialog')) {
                            div.css(style);
                        }
                    }
                    return function (scope, element, attrs, ctrl, transclude) {
                        scope.$watch(attrs.ngShow, function (newVal, oldVal) {
//                        if (newVal && !oldVal) {
//                            document.getElementsByTagName("body")[0].style.overflow = "hidden";
//                        } else {
//                            document.getElementsByTagName("body")[0].style.overflow = "";
//                        }
                            if ((!newVal && oldVal) && attrs.onClose) {
                                scope.$eval(attrs.onClose);
                            }
                        });
                        transclude(scope, function(clone) {
                            var divs = element.find("div");
                            for(var i=0; i<divs.length; i++) {
                                var div = divs.eq(i);
                                if(div.hasClass('ng-modal-dialog-content')) {
                                    div.append(clone);
                                    break;
                                }
                            }
                        });
                        var makeVisible = function() {element.removeClass('ng-modal-load');};
                        if(scope[attrs.ngShow]) makeVisible();
                        else $timeout(makeVisible);
                    };
                },
                template: "<div class='ng-modal ng-modal-load'>" +
                    "<div class='ng-modal-overlay'></div>" +
                    "<div class='ng-modal-dialog'>" +
                    "<span class='ng-modal-title'></span>" +
                    "<div class='ng-modal-close'>" +
                    "<i class='icon ion-close'></i>" +
                    "</div>" +
                    "<div class='ng-modal-dialog-content'></div>" +
                    "</div>" +
                    "</div>"
            };
        }
    );
})();


