/* global angular */

angular.module('cwCommon')
    .directive('inline', function($http, $templateCache, $compile) {
        "use strict";
        return function(scope, element, attrs) {
            var templatePath = attrs.inline;
            $http.get(templatePath, { cache: $templateCache }).success(function(response) {
                var contents = element.html(response).contents();
                $compile(contents)(scope);
            });
        };
    });