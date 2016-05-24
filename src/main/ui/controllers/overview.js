/* global angular */
angular.module('carwars').
    controller('OverviewCtrl', function($scope, vehicle) {
        "use strict";
        $scope.designText="No design loaded...";
        $scope.history = [];
        var applyCar = function(car) {
            var text = vehicle.textWithIllegal();
            $scope.size = text.length;
            var second = null;
            var pos = text.indexOf("\n\n");
            if(pos > -1) {
                second = text.substr(pos+2).trim();
                text = text.substr(0, pos).trim();
            }
            $scope.designText = text;
            $scope.extraText = second;
            $scope.history = car.history ? car.history : [];
            $scope.designName = car.designName;
        };
        if(vehicle.car) applyCar(vehicle.car);
        $scope.$on('recalculate', function(event, car) {
            applyCar(car);
        });
        $scope.loadPrevious = function() {
            $scope.loadCar($scope.history[0].name, $scope.history[0].id);
        };
    });
