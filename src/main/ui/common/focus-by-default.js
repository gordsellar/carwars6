/* global angular */
angular.module('cwCommon')
    .directive('focusByDefault', function() {
        "use strict";
        return function(scope, elem, attr) {
            scope.$on("$viewContentLoaded", function() {
                elem[0].focus();
            });
        };
    })
    .directive('selectByDefault', function($timeout) {
        "use strict";
        return function(scope, elem) {
            scope.$on("$viewContentLoaded", function() {
                elem[0].focus();
                $timeout(function() {elem[0].select();});
            });
        };
    });