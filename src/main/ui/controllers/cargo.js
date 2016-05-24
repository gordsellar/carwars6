/* global angular */
angular.module('carwars').
    controller('CargoCtrl', function($scope, vehicle, model) {
        "use strict";
        var update = function () {
            $scope.weight = vehicle.isTenWheeler() && model.gearInCarrier ? vehicle.car.carrier.reservedWeight
                : vehicle.car.reservedWeight;
            $scope.space = vehicle.isTenWheeler() && model.gearInCarrier ? vehicle.car.carrier.reservedSpace
                : vehicle.car.reservedSpace;
            $scope.switch = vehicle.isTenWheeler() ? model.gearInCarrier ? "Cab" : "Carrier" : null;
        };
        update();

        $scope.$watch('weight', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                if(vehicle.isTenWheeler() && model.gearInCarrier) vehicle.car.carrier.reservedWeight = newValue ? parseInt(newValue) : 0;
                else vehicle.car.reservedWeight = newValue ? parseInt(newValue) : 0;
                vehicle.recalculate();
            }
        });
        $scope.$watch('space', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                if(vehicle.isTenWheeler() && model.gearInCarrier) vehicle.car.carrier.reservedSpace = newValue ? parseInt(newValue) : 0;
                else vehicle.car.reservedSpace = newValue ? parseInt(newValue) : 0;
                vehicle.recalculate();
            }
        });

        $scope.toggleCarrier = function() {
            model.gearInCarrier = !model.gearInCarrier;
            update();
        };
    });
