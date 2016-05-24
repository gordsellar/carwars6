/* global angular */
angular.module('cwCommon')
    .directive('checkradios', function($compile) {
        "use strict";
        var itemTemplate = '<label class="item item-radio radio-narrow">'+
                           '  <input type="radio">'+
                           '  <i class="radio-icon ion-checkmark"></i>'+
                           '  <div class="item-content"></div>'+
                           '</label>';
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                var items = scope.$eval(attrs.checkradios);
                if((!items && !attrs.live) || !attrs.ngModel) return;
                var layout = function(items) {
                    var i, name, child, div;
                    if (!Array.isArray(items)) {
                        child = [];
                        for (i in items) {
                            if (items.hasOwnProperty(i)) child.push(items[i]);
                        }
                        items = child;
                    }
                    element.empty();
                    for (i = 0; i < items.length; i++) {
                        if (typeof items[i] === 'string') name = items[i];
                        else if(items[i].name) name = items[i].name;
                        else name = items[i].description;
                        child = angular.element(itemTemplate);
                        child.find('input').attr('ng-model', attrs.ngModel).attr('value', name).attr('name', attrs.ngModel);
                        div = child.find('div');
                        div.text(name);
                        if(attrs.size) div.addClass(attrs.size);
                        element.append(child);
                    }
                    $compile(element.contents())(scope);
                };
                if(attrs.live) scope.$watch(attrs.checkradios, layout);
                else layout(items);
            }
        };
    });