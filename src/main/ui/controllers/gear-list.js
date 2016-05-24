/* global angular */
angular.module('carwars').
    controller('GearListCtrl', function($scope, vehicle, model) {
        "use strict";
        var update = function() {
            $scope.location = vehicle.isTenWheeler() ? model.gearInCarrier ? "Carrier" : "Cab" :
                vehicle.hasSidecar() ? model.gearInCarrier ? "Sidecar": "Cycle" : null;
            $scope.switch = vehicle.isTenWheeler() ? model.gearInCarrier ? "Cab" : "Carrier" :
                vehicle.hasSidecar() ? model.gearInCarrier ? "Cycle": "Sidecar" : null;
            $scope.category = model.currentGearCategory;
            $scope.multis = vehicle.multiSelectItems(model.currentGearCategory, vehicle.isTenWheeler() && model.gearInCarrier,
                    vehicle.hasSidecar() && model.gearInCarrier);
            $scope.singles = vehicle.singleSelectItems(model.currentGearCategory, vehicle.isTenWheeler() && model.gearInCarrier,
                    vehicle.hasSidecar() && model.gearInCarrier);
        };
        update();

        $scope.$watch('techLevel', function(newValue, oldValue) {
            if(newValue !== oldValue) update();
        });
        $scope.moreItems = function(item) {
            var carrier = vehicle.isTenWheeler() && model.gearInCarrier;
            var sidecar = vehicle.hasSidecar() && model.gearInCarrier;
            var result = vehicle.addAccessory(item.data, carrier, sidecar);
            model.addAccessory(result, carrier, sidecar);
            update();
        };
        $scope.fewerItems = function(item) {
            var carrier = vehicle.isTenWheeler() && model.gearInCarrier;
            var sidecar = vehicle.hasSidecar() && model.gearInCarrier;
            var result = vehicle.removeAccessory(item.data, carrier, sidecar);
            model.removeAccessory(result, carrier, sidecar);
            update();
        };
        $scope.checkbox = function(item) {
            var carrier = vehicle.isTenWheeler() && model.gearInCarrier;
            var sidecar = vehicle.hasSidecar() && model.gearInCarrier;
            if(item.present) {
                if(!vehicle.hasAccessory(item.data, carrier, sidecar))
                    model.addAccessory(vehicle.addAccessory(item.data, carrier, sidecar), carrier, sidecar);
            } else {
                model.removeAccessory(vehicle.removeAccessory(item.data, carrier, sidecar), carrier, sidecar);
            }
            update();
        };
        $scope.toggleCarrier = function() {
            model.gearInCarrier = !model.gearInCarrier;
            update();
        };
    });
