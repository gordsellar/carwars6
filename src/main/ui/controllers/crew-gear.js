/* global angular */
angular.module('carwars').
    controller('CrewGearCtrl', function($scope, vehicle, model) {
        "use strict";
        $scope.name = model.currentCrew.name;
        $scope.handWeaponWeight = vehicle.car.personalEquipmentWeight;
        $scope.weaponCategories = [
            "Light Weapons",
            "Hand Grenades",
            "Rifles",
            "Launchers",
            "Heavy Weapons"
        ];
        $scope.weapons = model.currentCrew.handWeapons;
        var update = function() {
            $scope.equipmentWeight = vehicle.car.personalEquipmentWeight ? model.currentCrew.equipmentWeight()+" lbs."
                : model.currentCrew.totalGE()+" GE (limit "+model.currentCrew.maximumGE()+")";
        };
        update();

        $scope.selectGearCategory = function(category) {
            model.currentGearCategory = category;
            $scope.openScreen("crewGearList");
        };
        $scope.selectWeaponCategory = function(category) {
            model.currentWeaponCategory = category;
            $scope.openScreen("handWeaponList");
        };
        $scope.editWeapon = function(weapon) {
            model.currentHandWeapon = weapon;
            $scope.openScreen("handWeapon");
        };
        $scope.$watch('handWeaponWeight', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                vehicle.car.personalEquipmentWeight = newValue;
                vehicle.recalculate();
                update();
            }
        });
        $scope.$watch('techLevel', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                $scope.handWeaponWeight = vehicle.car.personalEquipmentWeight;
            }
        });
    });
