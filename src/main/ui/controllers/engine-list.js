/* global angular, CW */
angular.module('carwars').
    controller('EngineListCtrl', function($scope, vehicle, model) {
        "use strict";

        if(model.openedFromToolbar) {
            var options = [
                {name: 'Customize Current Engine', click: 'editCurrentEngine()'}
            ];
            if(vehicle.hasGasEngine()) options.push({name: 'Change to Electric', click: 'changeToElectric()'});
            else options.push({name: 'Change to Gas', click: 'changeToGas()', disable: "techLevel === 'Classic'"});
            $scope.configurePopup("left", options);
        }

        $scope.engines = [];
        $scope.truck = vehicle.isTruck();
        var update = function() {
            $scope.acceleration = model.engineAccel;
            $scope.topSpeed = model.engineSpeed;
            $scope.range = model.engineRange;
            $scope.gas = model.engineGas;
            $scope.electric = model.engineElectric;
            $scope.updateList();
        };
        $scope.updateList = function() {
            var neither = !model.engineGas && !model.engineElectric;
            $scope.engines = vehicle.searchEngines(model.engineAccel, model.engineSpeed, model.engineRange,
                model.engineGas || neither, model.engineElectric || neither);
            if($scope.engines.length === 0 && model.engineAccel === 5 && model.engineSpeed <= 90 && model.engineRange <= 200) {
                var engine = vehicle.engine();
                if(vehicle.techLevelIsClassic() && !engine.electric) {
                    $scope.engines = [
                        {
                            name: vehicle.car.powerPlantList.small.name,
                            electric: true,
                            cost: vehicle.car.powerPlantList.small.cost,
                            weight: vehicle.car.powerPlantList.small.weight,
                            space: vehicle.car.powerPlantList.small.space,
                            current: false,
                            powerFactors: vehicle.car.powerPlantList.small.powerFactors
                        }
                    ];
                } else {
                    $scope.engines = [
                        {
                            name: engine.name,
                            electric: engine.electric,
                            cost: engine.totalCost(),
                            weight: engine.totalWeight(),
                            space: engine.totalSpace(),
                            acceleration: vehicle.car.currentAcceleration,
                            topSpeed: vehicle.car.currentTopSpeed,
                            current: true,
                            powerFactors: engine.totalPowerFactors()
                        }
                    ];
                    CW.engineMods(engine, $scope.engines[0], engine.electric ? 0 : vehicle.car.gasTank.capacity,
                        engine.electric ? 0 : vehicle.car.gasTank.costPerGallon, engine.electric ? 0 : vehicle.car.gasTank.weightPerGallon);
                }
            }
        };
        update();
        $scope.editCurrentEngine = function() {
            model.engineSelected = true;
            $scope.openScreen("engine");
        };
        $scope.changeToGas = function() {
            vehicle.changeToGasEngine(model.engineAccel, model.engineSpeed, model.engineRange);
            model.updateEngine();
            update();
        };
        $scope.changeToElectric = function() {
            vehicle.changeToElectricEngine(model.engineAccel, model.engineSpeed, model.engineRange);
            model.updateEngine();
            update();
        };

        $scope.editEngine = function(engine) {
            vehicle.applyNewEngine(engine);
            model.updateEngine();
            model.engineSelected = true;
            $scope.openScreen("engine");
        };
        $scope.modsPresent = function(text) {
            return text && text.length > 0;
        };
        $scope.lowerAcceleration = function() {
            if(model.engineAccel > 5) {
                model.engineAccel -= 5;
                update();
            }
        };
        $scope.higherAcceleration = function() {
            if(model.engineAccel < 30) {
                model.engineAccel += 5;
                update();
            }
        };
        $scope.lowerTopSpeed = function() {
            if(model.engineSpeed > 60) {
                model.engineSpeed -= 10;
                update();
            }
        };
        $scope.higherTopSpeed = function() {
            if(model.engineSpeed < 300) {
                model.engineSpeed += 10;
                update();
            }
        };
        $scope.lowerRange = function() {
            if(model.engineRange > 10) {
                model.engineRange -= 10;
                update();
            }
        };
        $scope.higherRange = function() {
            if(model.engineRange < 500) {
                model.engineRange += 10;
                update();
            }
        };
        $scope.$watch('electric', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                model.engineElectric = newValue;
                $scope.updateList();
            }
        });
        $scope.$watch('gas', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                model.engineGas = newValue;
                $scope.updateList();
            }
        });
        $scope.$watch('techLevel', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                if($scope.gas !== model.engineGas)
                    $scope.gas = model.engineGas;
                else
                    $scope.updateList();
            }
        });
    });
