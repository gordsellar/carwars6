/* global angular */
angular.module('carwars')
    .directive('toolbarPopup', function($compile) {
        "use strict";
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                element.on('click', function() {
                    scope.$apply(function() {scope.hidePopup();});
                });
                scope.$parent.showInToolbar = function(useScope, align, buttons) {
                    element.empty();
                    var $html;
                    for(var i=0; i<buttons.length; i++) {
                        $html = angular.element("<button class=\"button\">"+buttons[i].name+"</button>");
                        if(buttons[i].click) $html.attr('ng-click', buttons[i].click);
                        if(buttons[i].disable) $html.attr('ng-disabled', buttons[i].disable);
                        if(buttons[i].icon) $html.addClass('icon-left').addClass(buttons[i].icon);
                        $html.addClass('button-light');
                        if(buttons.length > 6) $html.css('padding', '0 6px');
                        element.append($html);
                        element.css('text-align', align);
                    }
                    $compile(element.children())(useScope);
                };
            }
        };
    });
