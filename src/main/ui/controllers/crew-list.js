/* global angular */
angular.module('carwars').
    controller('CrewListCtrl', function($scope, vehicle, model) {
        "use strict";
        var update = function() {
            $scope.crew = vehicle.allOccupants();
            $scope.spaces = vehicle.spaceRemaining();
            $scope.cargoSpaces = vehicle.cargoSpaceRemaining();
            $scope.sidecar = vehicle.hasSidecar();
            $scope.sidecarCrew = vehicle.sidecarOccupants().length === 0;
            $scope.sidecarSpace = vehicle.sidecarSpaceRemaining();
            $scope.carrier = vehicle.hasCarrier();
            $scope.carrierSpace = vehicle.carrierSpaceRemaining();
            $scope.passengerSize = vehicle.isSemiTractor() || vehicle.isSemiTrailer() || vehicle.isBus() ? 2 : 1;
        };
        update();
        $scope.addGunner = function(sidecar, carrier) {
            model.addGunner(vehicle.addGunner(sidecar, carrier));
            update();
        };
        $scope.addPassenger = function(sidecar, carrier) {
            model.addPassenger(vehicle.addPassenger(sidecar, carrier));
            update();
        };
        $scope.editCrew = function(crew) {
            model.currentCrew = crew;
            $scope.openScreen("crew");
        };
    });
