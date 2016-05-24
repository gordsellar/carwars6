/* global angular */
angular.module('carwars')
    .directive('assignStars', function() {
        "use strict";
        return {
            restrict: 'A',
            template:
                '<a class="rating-zero" title="No Rating">0</a>'+
                '<a title="1 Star">1</a>'+
                '<a class="rating-right" title="1 Star">1</a>' +
                '<a title="2 Stars">2</a>' +
                '<a class="rating-right" title="2 Stars">2</a>' +
                '<a title="3 Stars">3</a>' +
                '<a class="rating-right" title="3 Stars">3</a>' +
                '<a title="4 Stars">4</a>' +
                '<a class="rating-right" title="4 Stars">4</a>' +
                '<a title="5 Stars">5</a>' +
                '<a class="rating-right" title="5 Stars">5</a>',
            link: function(scope, element, attr) {
                element.addClass('CarStockZoomStars');
                var saveTo = attr.assignStars;
                var as = element.find('a');
                var disabled = false;
                if(attr.ngDisabled) {
                    scope.$watch(attr.ngDisabled, function(newValue) {
                        disabled = newValue;
                        if(disabled) as.addClass('StarDisabled');
                        else as.removeClass("StarDisabled");
                    });
                }

                var setStarRating = function(value) {
                    angular.forEach(as, function(a) {
                        var el = angular.element(a);
                        if(el.text() > 0 && el.text() <= value) el.addClass('rating');
                        else el.removeClass('rating');
                    });
                };
                as.on('click', function(event) {
                    if(disabled) return;
                    var value = angular.element(event.target).text();
                    setStarRating(value);
                    var result = parseInt(value);
                    if(result === 0) result = null;
                    scope.$apply(function() {scope[saveTo] = result;});
                }).on('mouseenter', function(event) {
                    if(disabled) return;
                    var value = angular.element(event.target).text();
                    angular.forEach(as, function(a) {
                        var el = angular.element(a);
                        if(el.text() > 0 && el.text() <= value) el.addClass('rating-over');
                    });
                }).on('mouseleave', function(event) {
                    as.removeClass('rating-over');
                });

                if(scope[saveTo]) setStarRating(scope[saveTo]);
            }
        };
    });
