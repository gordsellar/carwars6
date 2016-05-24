/* global angular */
angular.module('carwars').
    controller('HandWeaponCategoriesCtrl', function($scope, vehicle, model) {
        "use strict";
        $scope.categories = [
            "Light Weapons",
            "Hand Grenades",
            "Rifles",
            "Launchers",
            "Heavy Weapons"
        ];

        $scope.selectCategory = function(category) {
            model.currentWeaponCategory = category;
            $scope.openScreen("handWeaponList");
        };
    });
