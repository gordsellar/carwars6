/* global angular */
angular.module('carwars').
    controller('EngineCtrl', function($scope, $timeout, vehicle, model) {
        "use strict";
        $scope.caSize = vehicle.componentArmorSpace();
        var showStatus = function(message) {
            $scope.clearMessages();
            if(message) $scope.showMessage(message);
        };
        var update = function() {
            var engine = vehicle.engine();
            $scope.gas = !engine.electric;
            $scope.power = vehicle.enginePowerRating();
            $scope.pf = vehicle.isTruck() ? null : engine.totalPowerFactors();
            $scope.maxLoad = vehicle.isTruck() ? engine.modifiedMaxLoad() : null;
            $scope.space = engine.totalSpace();
            $scope.weight = engine.totalWeight();
            $scope.cost = engine.totalCost(vehicle.tireCount());
            $scope.name = engine.name+(engine.electric ? " Power Plant" : " Gas Engine");
            $scope.spaces = vehicle.spaceRemaining();
            if(engine.electric) {
                $scope.platCats = engine.platinumCatalysts;
                $scope.superCons = engine.superconductors;
                $scope.HTMs = engine.highTorqueMotors;
                $scope.hdHTMs = engine.heavyDutyHighTorqueMotors;
                $scope.fri = engine.fireRetardantInsulator;
                $scope.extraPowerCells = engine.extraPowerCells === 0 ? "No" : engine.extraPowerCells;
                $scope.hasEPCs = engine.extraPowerCells > 0;
                $scope.hasISCs = engine.improvedSuperchargerCapacitors > 0;
                $scope.ISCs = engine.improvedSuperchargerCapacitors > 0 ? engine.improvedSuperchargerCapacitors : "No";
            } else {
                $scope.carb = engine.carburetor;
                $scope.mbCarb = engine.multibarrelCarburetor;
                $scope.tubes = engine.tubularHeaders;
                $scope.bp = engine.blueprinted;
                $scope.turbo = engine.turbocharger;
                $scope.vpTurbo = engine.variablePitchTurbocharger;
                $scope.super = engine.supercharger;
                $scope.superTooSmall = engine.space < 3 || engine.truck;
                $scope.hasNitrous = engine.nitrousOxide > 0;
                $scope.nitrousOxide = engine.nitrousOxide > 0 ? engine.nitrousOxide+" canister"+(engine.nitrousOxide > 1 ? "s" : "") : "No";
            }
            $scope.hasCA = !!engine.componentArmor;
            $scope.caAbbv = vehicle.armorAbbv(engine.componentArmor);
            $scope.componentArmor = vehicle.componentArmorName(engine);
            $scope.fe = engine.fireExtinguisher;
            $scope.ife = engine.improvedFireExtinguisher;
            $scope.hasBattery = engine.laserBatteries > 0;
            $scope.laserBattery = engine.laserBatteries > 0 ? engine.laserBatteries : "No";
        };
        update();
        showStatus();

        $scope.biggerEngine = function() {
            vehicle.nextEngine();
            model.updateEngine();
            update();
            showStatus();
        };
        $scope.smallerEngine = function() {
            vehicle.previousEngine();
            model.updateEngine();
            update();
            showStatus();
        };
        $scope.changeToGas = function() {
            vehicle.changeToGasEngine(model.engineAccel, model.engineSpeed, model.engineRange);
            model.updateEngine();
            update();
            $timeout(showStatus);
        };
        $scope.changeToElectric = function() {
            vehicle.changeToElectricEngine(model.engineAccel, model.engineSpeed, model.engineRange);
            model.updateEngine();
            update();
            $timeout(showStatus);
        };
        $scope.useSelector = function() {
            model.engineSelected = false;
            model.openedFromToolbar = false;
            $scope.openScreen("engineList");
        };

        var updateEngineField = function(property, newValue, oldValue, opposite) {
            if(newValue !== oldValue) {
                vehicle.engine()[property] = !!newValue;
                if(newValue && opposite) vehicle.engine()[opposite] = false;
                vehicle.recalculate();
                model.updateEngine();
                update();
                var name = property.substr(0,1).toUpperCase()+property.substr(1).replace(/[A-Z]/g, " $&");
                if(newValue) {
                    var data = vehicle.car.engine.optionData(property, vehicle.tireCount());
                    var text = "Added "+name+" for ";
                    text += data.cost < 0 ? "-$"+Math.abs(data.cost) : "$"+data.cost;
                    if(data.weight) text += ", "+data.weight+" lbs";
                    if(data.space) text += ", "+data.space+" sp";
                    $timeout(function() {showStatus(text);});
                }
            }
        };
        $scope.$watch('platCats', function(newV, oldV) {updateEngineField('platinumCatalysts', newV, oldV);});
        $scope.$watch('superCons', function(newV, oldV) {updateEngineField('superconductors', newV, oldV);});
        $scope.$watch('HTMs', function(newV, oldV) {updateEngineField('highTorqueMotors', newV, oldV, 'heavyDutyHighTorqueMotors');});
        $scope.$watch('hdHTMs', function(newV, oldV) {updateEngineField('heavyDutyHighTorqueMotors', newV, oldV,'highTorqueMotors');});
        $scope.$watch('fri', function(newV, oldV) {updateEngineField('fireRetardantInsulator', newV, oldV);});
        $scope.$watch('carb', function(newV, oldV) {updateEngineField('carburetor', newV, oldV, 'multibarrelCarburetor');});
        $scope.$watch('mbCarb', function(newV, oldV) {updateEngineField('multibarrelCarburetor', newV, oldV, 'carburetor');});
        $scope.$watch('tubes', function(newV, oldV) {updateEngineField('tubularHeaders', newV, oldV);});
        $scope.$watch('bp', function(newV, oldV) {updateEngineField('blueprinted', newV, oldV);});
        $scope.$watch('turbo', function(newV, oldV) {updateEngineField('turbocharger', newV, oldV, 'variablePitchTurbocharger');});
        $scope.$watch('vpTurbo', function(newV, oldV) {updateEngineField('variablePitchTurbocharger', newV, oldV, 'turbocharger');});
        $scope.$watch('super', function(newV, oldV) {updateEngineField('supercharger', newV, oldV);});
        $scope.$watch('fe', function(newV, oldV) {updateEngineField('fireExtinguisher', newV, oldV, 'improvedFireExtinguisher');});
        $scope.$watch('ife', function(newV, oldV) {updateEngineField('improvedFireExtinguisher', newV, oldV, 'fireExtinguisher');});

        $scope.fewerPowerCells = function() {
            var engine = vehicle.engine();
            if(engine.electric && engine.extraPowerCells > 0) {
                engine.extraPowerCells -= 1;
                vehicle.recalculate();
                update();
                model.redraw();
            }
        };
        $scope.morePowerCells = function() {
            var data, engine = vehicle.engine();
            if(engine.electric) {
                engine.extraPowerCells += 1;
                vehicle.recalculate();
                update();
                model.redraw();
                data = engine.optionData("extraPowerCells");
                $scope.showMessage(engine.extraPowerCells+" set"+(engine.extraPowerCells > 1 ? "s" : "")+" Extra Power Cells, "+(engine.extraPowerCells > 1 ? "total " : "")+"$"+data.cost+" "+data.weight+" lbs"+(data.space > 0 ? " "+data.space+" sp" : ""));
            }
        };
        $scope.fewerISCs = function() {
            var engine = vehicle.engine();
            if(engine.electric && engine.improvedSuperchargerCapacitors > 0) {
                engine.improvedSuperchargerCapacitors -= 1;
                vehicle.recalculate();
                update();
                model.redraw();
            }
        };
        $scope.moreISCs = function() {
            var data, engine = vehicle.engine();
            if(engine.electric) {
                engine.improvedSuperchargerCapacitors += 1;
                vehicle.recalculate();
                update();
                model.redraw();
                data = engine.optionData("improvedSuperchargerCapacitors");
                $scope.showMessage(engine.improvedSuperchargerCapacitors+" set"+(engine.improvedSuperchargerCapacitors > 1 ? "s" : "")+" Improved Supercharger Capacitors, "+(engine.improvedSuperchargerCapacitors > 1 ? "total " : "")+"$"+data.cost+" "+data.weight+" lbs"+(data.space > 0 ? " "+data.space+" sp" : ""));
            }
        };
        $scope.fewerNitrous = function() {
            var engine = vehicle.engine();
            if(!engine.electric && engine.nitrousOxide > 0) {
                engine.nitrousOxide -= 1;
                vehicle.recalculate();
                update();
            }
        };
        $scope.moreNitrous = function() {
            var data, engine = vehicle.engine();
            if(!engine.electric) {
                engine.nitrousOxide += 1;
                vehicle.recalculate();
                update();
                data = engine.optionData("nitrousOxide");
                $scope.showMessage(engine.nitrousOxide+" canister"+(engine.nitrousOxide > 1 ? "s" : "")+" Nitrous Oxide, "+(engine.nitrousOxide > 1 ? "total " : "")+"$"+data.cost+" "+data.weight+" lbs"+(data.space > 0 ? " "+data.space+" sp" : ""));
            }
        };
        $scope.fewerLaserBatteries = function() {
            var engine = vehicle.engine();
            if(engine.laserBatteries > 0) {
                engine.laserBatteries -= 1;
                vehicle.recalculate();
                update();
                model.redraw();
            }
        };
        $scope.moreLaserBatteries = function() {
            var data, engine = vehicle.engine();
            engine.laserBatteries += 1;
            vehicle.recalculate();
            update();
            model.redraw();
            data = engine.optionData("laserBattery");
            $scope.showMessage(engine.laserBatteries+" Laser Batter"+(engine.laserBatteries > 1 ? "ies" : "y")+", "+(engine.laserBatteries > 1 ? "total " : "")+"$"+data.cost+" "+data.weight+" lbs"+(data.space > 0 ? " "+data.space+" sp" : ""));
        };
        $scope.moreComponentArmor = function() {
            if(vehicle.nextComponentArmor(vehicle.engine())) {
                model.redraw();
                update();
            }
        };
        $scope.lessComponentArmor = function() {
            if(vehicle.previousComponentArmor(vehicle.engine())) {
                model.redraw();
                update();
            }
        };
        $scope.changeCAType = function() {
            model.currentArmor = vehicle.engine().componentArmor;
            model.currentArmorItemName = "Engine";
            model.currentArmorSource = "engine";
            $scope.openScreen("armorType");
        };
    });
