/* global angular, CW */
angular.module('carwars').
    controller('HandWeaponListCtrl', function($scope, vehicle, model) {
        "use strict";
        var update = function() {
            $scope.weapons = vehicle.handWeaponsByType(model.currentWeaponCategory);
        };
        update();

        $scope.goBack = function() {
            if(model.currentCrew.handWeapons.length > 0) {
                $scope.openScreen("handWeaponCategories");
            } else {
                $scope.openScreen("crewGear");
            }
        };

        $scope.createWeapon = function(weapon) {
            model.currentHandWeapon = vehicle.addHandWeapon(weapon.abbv, model.currentCrew);
            $scope.openScreen("handWeapon");
        };

        $scope.$watch('techLevel', function(newValue, oldValue) {
            if(newValue !== oldValue) update();
        });
    });
