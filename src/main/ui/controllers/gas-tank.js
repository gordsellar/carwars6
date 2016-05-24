/* global angular */
angular.module('carwars').
    controller('GasTankCtrl', function($scope, vehicle, model) {
        "use strict";
        $scope.caSize = vehicle.componentArmorSpace();
        var update = function() {
            var tank = vehicle.gasTank();
            $scope.style = tank.name;
            $scope.capacity = tank.capacity;
            $scope.range = tank.capacity * vehicle.engine().totalMPG();
            $scope.fri = !!tank.fireRetardantInsulator;
            $scope.hasCA = !!tank.componentArmor;
            $scope.componentArmor = vehicle.componentArmorName(tank);
            $scope.spaces = vehicle.spaceRemaining();
            $scope.cost = tank.totalCost();
            $scope.weight = tank.totalWeight();
            $scope.space = tank.totalSpace();
            $scope.caAbbv = vehicle.armorAbbv(tank.componentArmor);
        };
        update();
        $scope.lowerCapacity = function() {
            var tank = vehicle.gasTank();
            if(tank.capacity > 1) {
                tank.capacity -= 1;
                vehicle.recalculate();
                model.redraw();
                update();
            }
        };
        $scope.higherCapacity = function() {
            var tank = vehicle.gasTank();
            tank.capacity += 1;
            vehicle.recalculate();
            model.redraw();
            update();
        };
        $scope.moreCA = function() {
            vehicle.nextComponentArmor(vehicle.gasTank());
            model.redraw();
            update();
        };
        $scope.lessCA = function() {
            vehicle.previousComponentArmor(vehicle.gasTank());
            model.redraw();
            update();
        };
        $scope.$watch('fri', function(newV, oldV) {
            if(newV !== oldV) {
                vehicle.gasTank().fireRetardantInsulator = newV;
                vehicle.recalculate();
                update();
            }
        });
        $scope.$watch('style', function(newV, oldV) {
            if(newV !== oldV) {
                if(vehicle.updateGasTank(newV))
                    model.redraw();
                update();
            }
        });
        $scope.changeCAType = function() {
            model.currentArmor = vehicle.gasTank().componentArmor;
            model.currentArmorItemName = "Gas Tank";
            model.currentArmorSource = "gasTank";
            $scope.openScreen("armorType");
        };
    });
