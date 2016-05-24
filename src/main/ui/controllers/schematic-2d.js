/* global angular */
angular.module('carwars').
    controller('Schematic2dCtrl', function($scope, vehicle, model2d, model) {
        "use strict";
        var update = function() {
            model2d.createNewCar(vehicle.car);
            model.setModel('2d', model2d);
            $scope.car = model2d.car;
        };
        update();
        $scope.$on('new-vehicle', function() {
            update();
            $scope.$broadcast('resize');
        });
        $scope.click = function(address, item) {
            if(!address) $scope.processClick("overview");
            else $scope.processClick(address, item);
        };
    });