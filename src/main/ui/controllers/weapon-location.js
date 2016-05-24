/* global angular */
angular.module('carwars').
    controller('WeaponLocationCtrl', function($scope, vehicle, model) {
        "use strict";
        var update = function () {
            $scope.corner = vehicle.isCorner(model.currentWeapon);
            $scope.caption = vehicle.locationName(model.currentWeapon)+" Weapons";
            $scope.weapons = vehicle.weaponsInLocation(model.currentWeapon);
            $scope.spaces = vehicle.spacesForWeapon(model.currentWeapon);
            if(model.currentWeapon.sidecar || model.currentWeapon.carrier) $scope.spacesText = $scope.spaces+" sp.";
            else $scope.spacesText = $scope.spaces+" space"+($scope.spaces === 1 ? "" : "s");
            var laser = vehicle.hasLaser(model.currentWeapon);
            $scope.tl = $scope.spaces === 0 && !laser && !model.currentWeapon.isCorner();
            $scope.discharger = $scope.spaces === 0 && !model.currentWeapon.isCorner()
                && vehicle.dischargersAllowed(model.currentWeapon);
        };
        update();
        $scope.editWeapon = function(weapon) {
            model.currentWeapon.weapon = weapon;
            $scope.openScreen('weapon');
        };
        $scope.addWeapon = function() {
            $scope.openScreen("weaponTypes");
        };
        $scope.addTL = function() {
            vehicle.addWeapon('TL', model.currentWeapon);
            model.addWeapon(model.currentWeapon);
            $scope.openScreen('weapon');
        };
        $scope.showSpaces = function() {
            if(model.currentWeapon.sidecar)
                $scope.showMessage('Sidecar Space: '+vehicle.sidecarSpaceRemaining());
            else if(model.currentWeapon.carrier) {
                $scope.showMessage('Body Space Remaining: '+vehicle.carrierSpaceRemaining());
                $scope.showMessage('1/3 Space Remaining: '+vehicle.oneThirdSpaces(model.currentWeapon.location, true));
            } else {
                $scope.showMessage('Body Space Remaining: ' + vehicle.spaceRemaining());
                $scope.showMessage('1/3 Space Remaining: ' + vehicle.oneThirdSpaces(model.currentWeapon.location)); // TODO: types exempt from the rule
            }
        };
    });
