/* global angular */
angular.module('cwCommon', [])
    .directive('checkboxItem', function() {
        "use strict";
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<label class="item item-checkbox">'+
                          '<div class="checkbox checkbox-input-hidden">'+
                              '<input type="checkbox">'+
                              '<i class="checkbox-icon"></i>'+
                          '</div>' +
                          '<span ng-transclude></span>'+
                      '</label>',
            compile: function(element, attr) {
                var input = element.find('input');
                angular.forEach({
                    'name': attr.name,
                    'ng-model': attr.ngModel,
                    'ng-disabled': attr.ngDisabled,
                    'ng-change': attr.ngChange
                }, function(value, name) {
                    if(angular.isDefined(value)) {
                        input.attr(name, value);
                    }
                });
                if(angular.isDefined(attr.ngDisabled)) {
                    element.find('span').attr("ng-class", "{'text-disabled': "+attr.ngDisabled+"}");
                    element.find('div').attr('ng-class', "{'disabled': "+attr.ngDisabled+"}");
                }
            }
        };
    });
