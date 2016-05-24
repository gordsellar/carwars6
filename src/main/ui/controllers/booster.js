/* global angular */
angular.module('carwars').
    controller('BoosterCtrl', function($scope, vehicle, model) {
        "use strict";
        $scope.calculate = model.boosterCalculation;
        var list = (model.currentTurret || vehicle.car).boosters;
        if(list.length === 0) {
            $scope.type = "Booster";
            $scope.location = "Back";
        } else {
            $scope.type = list[0].jumpJet ? "Jet" : "Booster";
            $scope.location = list[0].bottomOrRearFacing ? "Back" : "Front";
        }
        $scope.turret = !!model.currentTurret;
        var weightToUse = function() {
            return $scope.calculate === 'Maximum' ? $scope.maxWeight : $scope.currentWeight;
        };
        var update = function() {
            var booster = list.length === 0 ? null : list[0];
            $scope.name = (booster && booster.jumpJet) || (!booster && $scope.type !== 'Booster') ? "Jump Jets" : "Booster";
            $scope.maxWeight = vehicle.car.maxEffectiveWeight;
            $scope.currentWeight = vehicle.car.weightUsed;
            $scope.thrust = booster ? booster.accelerationForWeight(weightToUse()) : 0;
            $scope.boosterThrust = $scope.thrust+"mph Thrust";
            $scope.weight = booster ? booster.weight : 0;
            $scope.space = booster ? booster.totalSpace() : 0;
            $scope.cost = booster ? booster.totalCost() : 0;
            $scope.dp = booster ? booster.totalDP() : 0;
        };
        update();

        $scope.$watch('calculate', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                model.boosterCalculation = newValue;
                update();
            }
        });
        $scope.$watch('type', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                if(list.length > 0) {
                    list[0].jumpJet = newValue !== 'Booster';
                    vehicle.recalculate();
                    model.syncBoosters();
                }
                update();
            }
        });
        $scope.$watch('location', function(newValue, oldValue) {
            if(newValue !== oldValue && list.length > 0) {
                list[0].bottomOrRearFacing = newValue === 'Back';
                vehicle.recalculate();
                model.syncBoosters();
            }
        });
        $scope.lowerThrust = function() {
            if($scope.thrust <= 0) return;
            var weight = weightToUse();
            if($scope.thrust >= 12.5) $scope.thrust -= 2.5;
            else $scope.thrust = 0;
            var booster = vehicle.configureBooster(weight, $scope.calculate !== 'Maximum', $scope.thrust,
                    $scope.type === 'Booster', $scope.location === 'Back', model.currentTurret);
            if($scope.thrust === 0 && booster) model.syncBoosters();
            else model.redraw(); // DP change
            update();
        };
        $scope.higherThrust = function() {
            var weight = weightToUse();
            var newBooster = $scope.thrust === 0;
            if(newBooster)
                $scope.thrust = 10;
            else
                $scope.thrust += 2.5;
            var booster = vehicle.configureBooster(weight, $scope.calculate !== 'Maximum', $scope.thrust,
                    $scope.type === 'Booster', $scope.location === 'Back', model.currentTurret);
            if(newBooster && booster) model.syncBoosters();
            else model.redraw(); // DP change
            update();
        };
    });
