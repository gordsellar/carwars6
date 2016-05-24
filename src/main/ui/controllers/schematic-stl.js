/* global angular */
angular.module('carwars').
    controller('STLCtrl', function($scope, stl) {
        "use strict";
        $scope.scene = stl.scene;
        $scope.cameraOnChild = true;
        $scope.click = function(address, item) {};
    });
