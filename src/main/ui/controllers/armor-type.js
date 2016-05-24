/* global angular, CW */
angular.module('carwars').
    controller('ArmorTypeCtrl', function($scope, $window, vehicle, model) {
        "use strict";

        var armor = model.currentArmor;
        $scope.itemName = model.currentArmorItemName;

        var costPerPoint = function(type) {
            return Math.ceil((armor.spacesProtected ? armor.spacesProtected() : 2)*5*type.costFactor*10-0.0001)/10;
        };

        var weightPerPoint = function(type) {
            return Math.ceil((armor.spacesProtected ? armor.spacesProtected() : 2)*2*type.weightFactor*10-0.0001)/10;
        };

        $scope.available = [];
        for(var i in CW.armor) {
            if(CW.armor.hasOwnProperty(i)) {
                $scope.available.push({
                    armor: CW.armor[i],
                    name: i,
                    costPerPoint: costPerPoint(CW.armor[i]),
                    weightPerPoint: weightPerPoint(CW.armor[i])
                });
                if((/Plastic/.test(CW.armor[i].name) && armor.plasticType && armor.plasticPoints > 0 && armor.plasticType === CW.armor[i]) ||
                    (/Metal/.test(CW.armor[i].name) && armor.metalType && armor.metalPoints > 0 && armor.metalType === CW.armor[i]))
                    $scope.armorType = i;
            }
        }

        var applyArmorType = function(name) {
            if(/metal/.test(name)) {
                armor.metalType = CW.armor[name];
                if(armor.plasticPoints > 0) {
                    if(armor.plasticPoints < 6) armor.metalPoints = 1;
                    else if(armor.plasticPoints < 11) armor.metalPoints = 2;
                    else if(armor.plasticPoints < 16) armor.metalPoints = 3;
                    else armor.metalPoints = 4;
                    armor.plasticPoints = 0;
                    armor.plasticType = null;
                }
            } else {
                armor.plasticType = CW.armor[name];
                if(armor.metalPoints > 0) {
                    armor.plasticPoints = armor.metalPoints * 5;
                    if(armor.plasticType.weightFactor > 1) {
                        if(armor.plasticPoints === 10) armor.plasticPoints = 9;
                        else if(armor.plasticPoints > 18) armor.plasticPoints = 18;
                    }
                    armor.metalPoints = 0;
                    armor.metalType = null;
                }
            }
        };

        $scope.$watch('armorType', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                applyArmorType(newValue);
                vehicle.recalculate();
                model.redraw();
                $scope.goBack();
            }
        });

        $scope.goBack = function() {
            $scope.openScreen(model.currentArmorSource);
        };
    });
