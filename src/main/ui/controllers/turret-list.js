/* global angular, CW */
angular.module('carwars').
    controller('TurretListCtrl', function($scope, vehicle, model) {
        "use strict";
        var carrier = false;
        var backHalf = false;
        var update = function() {
            $scope.spaces = vehicle.cargoSpaceRemaining();
            var target = vehicle.isTenWheeler() && carrier ? vehicle.car.carrier : vehicle.car;
            var topTurret = vehicle.isOversize() && backHalf ? "topBackTurret" : "topTurret";
            var sideTurret = vehicle.isOversize() && backHalf ? "sideBackTurret" : "sideTurret";
            if(target[topTurret]) {
                $scope.topTurret = target[topTurret];
                $scope.topOptions = [];
            } else {
                $scope.topTurret = null;
                $scope.topOptions = vehicle.availableTopTurrets(carrier);
            }
            if(target[sideTurret]) {
                $scope.sideTurret = target[sideTurret];
                $scope.sideOptions = [];
            } else {
                $scope.sideTurret = null;
                $scope.sideOptions = vehicle.availableSideTurrets(carrier);
            }
            if(vehicle.car.sidecar) {
                if(vehicle.car.sidecar.topTurret) {
                    $scope.sidecarTurret = vehicle.car.sidecar.topTurret;
                    $scope.sidecarOptions = [];
                } else {
                    $scope.sidecarTurret = null;
                    $scope.sidecarOptions = vehicle.availableSidecarTurrets();
                }
            }
            $scope.oversize = vehicle.isOversize() ? backHalf ? "Back " : "Front " : "";
            $scope.tenWheeler = vehicle.isTenWheeler() ? carrier ? "Carrier " : "Cab " : "";
            $scope.switchTitle = vehicle.isTenWheeler() ? carrier ? "Cab" : "Carrier" :
                vehicle.isOversize ? backHalf ? "Front" : "Back" : null;
            $scope.bigList = $scope.tenWheeler || $scope.oversize;
        };
        update();
        $scope.createTopTurret = function(type) {
            model.currentTurret = model.addTopTurret(vehicle.addTopTurret(type, false, carrier, backHalf));
            if(model.currentTurret) $scope.openScreen('turret');
        };
        $scope.createSideTurret = function(type) {
            model.currentTurret = model.addSideTurret(vehicle.addSideTurret(type, carrier, backHalf));
            if(model.currentTurret) $scope.openScreen('turret');
        };
        $scope.createSidecarTurret = function(type) {
            vehicle.addTopTurret(type, true);
            model.syncCycle();
            model.currentTurret = vehicle.car.sidecar.topTurret;
            if(model.currentTurret) $scope.openScreen('turret');
        };

        $scope.editTurret = function(location) {
            $scope.processClick('edit'+(carrier ? "Carrier" : "")+(backHalf ? "Back" : "")+location);
        };
        $scope.toggleCarrier = function() {
            carrier = !carrier;
            update();
        };
        $scope.switchHalf = function() {
            backHalf = !backHalf;
            update();
        };
        $scope.$watch('techLevel', function(newValue, oldValue) {
            if(newValue !== oldValue) update();
        });
    });
