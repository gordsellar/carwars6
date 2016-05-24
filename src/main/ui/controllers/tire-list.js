/* global angular */
angular.module('carwars').
    controller('TireListCtrl', function($scope, vehicle, model) {
        "use strict";
        var update = function() {
            $scope.tires = vehicle.editableTires();
            $scope.spaces = vehicle.cargoSpaceRemaining();
            $scope.standardSpare = vehicle.car.hasSpareTireStandard();
            $scope.fullSpare = vehicle.car.hasSpareTireMatching();
            if(vehicle.hasSidecar()) {
                $scope.location1 = "Cycle ";
                $scope.location2 = "Sidecar ";
                $scope.otherStandardSpare = vehicle.car.sidecar.hasSpareTireStandard();
                $scope.otherFullSpare = vehicle.car.sidecar.hasSpareTireMatching();
                $scope.otherSpaces = vehicle.sidecarSpaceRemaining();
            } else if(vehicle.isTenWheeler()) {
                $scope.location1 = "Cab ";
                $scope.location2 = "Carrier ";
                $scope.otherStandardSpare = vehicle.car.carrier.hasSpareTireStandard();
                $scope.otherFullSpare = vehicle.car.carrier.hasSpareTireMatching();
                $scope.otherSpaces = vehicle.carrierSpaceRemaining();
            }
        };
        update();
        $scope.updateStandardSpare = function(add, carrier) {
            if(add) {
                if(carrier && vehicle.isTenWheeler()) model.addSpareTire(vehicle.car.carrier.addSpareTireStandard(), true, false);
                else if(carrier && vehicle.hasSidecar()) model.addSpareTire(vehicle.car.sidecar.addSpareTireStandard(), false, true);
                else model.addSpareTire(vehicle.car.addSpareTireStandard());
            } else {
                if(carrier && vehicle.isTenWheeler()) model.removeSpareTire(vehicle.car.carrier.removeSpareTireStandard(), true, false);
                else if(carrier && vehicle.hasSidecar()) model.removeSpareTire(vehicle.car.sidecar.removeSpareTireStandard(), false, true);
                else model.removeSpareTire(vehicle.car.removeSpareTireStandard());
            }
            update();
        };
        $scope.updateFullSpare = function(add, carrier) {
            if(add) {
                if(carrier && vehicle.isTenWheeler()) model.addSpareTire(vehicle.car.carrier.addSpareTireMatching(), true, false);
                else if(carrier && vehicle.hasSidecar()) model.addSpareTire(vehicle.car.sidecar.addSpareTireMatching(), false, true);
                else model.addSpareTire(vehicle.car.addSpareTireMatching());
            } else {
                if(carrier && vehicle.isTenWheeler()) model.removeSpareTire(vehicle.car.carrier.removeSpareTireMatching(), true, false);
                else if(carrier && vehicle.hasSidecar()) model.removeSpareTire(vehicle.car.sidecar.removeSpareTireMatching(), false, true);
                model.removeSpareTire(vehicle.car.removeSpareTireMatching());
            }
            update();
        };
        $scope.editTires = function(tire) {
            model.currentTire = tire.tire;
            $scope.openScreen("tire");
        };
    });
