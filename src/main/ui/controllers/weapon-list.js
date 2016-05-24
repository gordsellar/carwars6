/* global angular, CW */
angular.module('carwars').
    controller('WeaponListCtrl', function($scope, vehicle, model) {
        "use strict";
        var update = function() {
            $scope.weapons = vehicle.weaponsByType(model.currentWeaponCategory, vehicle.spacesForWeapon(model.currentWeapon),
                vehicle.isRocketPlatform(model.currentWeapon));
        };
        update();

        $scope.createWeapon = function(weapon) {
            vehicle.addWeapon(weapon.abbv, model.currentWeapon);
            model.addWeapon(model.currentWeapon);
            if(model.currentWeapon.firstDischarger && !vehicle.isCycle()) {
                $scope.openScreen('dischargers');
            } else {
                $scope.openScreen('weapon');
            }
        };

        $scope.$watch('techLevel', function(newValue, oldValue) {
            if(newValue !== oldValue) update();
        });
    });
