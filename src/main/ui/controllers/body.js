/* global angular, CW */
angular.module('carwars').
    controller('BodyCtrl', function($rootScope, $scope, $timeout, vehicle, model) {
        "use strict";

        if(model.openedFromToolbar) {
            var bodies = vehicle.bodyOptions().slice(0);
            for (var i = 0; i < bodies.length; i++) {
                bodies[i] = {name: bodies[i].name, click: "bodyType = '" + bodies[i].name.replace("'", "\\'") + "'",
                    disable: "bodyName === '" + bodies[i].name.replace("'", "\\'") + "'"};
            }
            if(vehicle.isCycle()) {
                bodies.push({name: "Med w/Lt Sidecar", click: "setCycleCombo(true);", disable: "bodyName === 'Medium Cycle'"});
                bodies.push({name: "Hvy w/Hvy Sidecar", click: "setCycleCombo(false);", disable: "bodyName === 'Heavy Cycle'"});
            }
            $scope.configurePopup("left", bodies);
        }

        var updateBodyStats = function() {
            $scope.bodyName = vehicle.isCarTrailer() ? vehicle.car.body.name.replace(/ Van| Flatbed/, " Trailer") : vehicle.car.body.name;
            $scope.spaces = vehicle.bodyCargoSpaces() ? vehicle.bodySpaces()+"/"+vehicle.bodyCargoSpaces() : vehicle.bodySpaces();
            $scope.oneThird = vehicle.bodyOneThirdSpaces();
            $scope.maxWeight = vehicle.bodyMaxWeight();
            $scope.chassisName = vehicle.car.chassis.name;
            $scope.chassisMaxWeight = vehicle.car.modifiedMaxWeight;
            $scope.sixWheelVisible = vehicle.isCar();
            $scope.sixWheelDisabled = !vehicle.sixWheelChoice();
            $scope.sixWheel = vehicle.hasSixWheeledChassis();
            $scope.suspensionName = vehicle.car.suspension.name;
            $scope.suspensionHC = vehicle.suspensionHC();

            $scope.suspensionVisible = !vehicle.isRaceCar() && !vehicle.isTenWheeler() && !vehicle.isCarTrailer() &&
                !vehicle.isSemiTractor() && !vehicle.isSemiTrailer() && !vehicle.isBus();
            $scope.chassisVisible = !vehicle.isCycle() && !vehicle.isSemiTrailer();

            // Cycle
            if(vehicle.isCycle()) {
                $scope.bodyTypes = CW.cycleBody;
                $scope.bodyType = vehicle.car.body.name;
                $scope.cycleVisible = true;
                $scope.sidecarDisabled = !vehicle.isCycle() || $scope.bodyName === CW.cycleBody.light.name;
                $scope.sidecar = vehicle.car.sidecar ? vehicle.car.sidecar.name : vehicle.car.windshell ? "Windshell" : "None";
                $scope.windshellArmor = vehicle.armorPointsName(vehicle.car.windshell ? vehicle.car.windshell.armor : null)+" extra Windshell armor";
                if(vehicle.car.sidecar) {
                    $scope.sidecarSuspension = "Sidecar "+vehicle.car.sidecar.suspension.name+" Suspension";
                    $scope.sidecarTwoTire = vehicle.car.sidecar.tireCount === 2;
                    $scope.jettisonJoinings = vehicle.car.sidecar.jettisonJoinings;
                } else {
                    $scope.sidecarSuspension = "";
                    $scope.sidecarTwoTire = false;
                    $scope.jettisonJoinings = false;
                }
            }
            if(vehicle.isRaceCar()) {
                $scope.bodyTypes = CW.raceCarBodies;
                $scope.bodyType = vehicle.car.body.name;
            } else if(vehicle.isCar()) {
                $scope.bodyTypes = CW.carBodies;
                $scope.bodyType = vehicle.car.body.name;
            }
            if(vehicle.isTrike()) {
                $scope.trike = true;
                $scope.bodyTypes = CW.trikeBody;
                $scope.bodyType = vehicle.car.body.name;
                $scope.reversed = vehicle.isReversedTrike();
            }
            if(vehicle.isTenWheeler()) {
                $scope.tenWheeler = true;
                $scope.bodyTypes = CW.tenWheelerBody;
                $scope.bodyType = vehicle.car.body.name;
                $scope.carrier = vehicle.carrierBody();
                $scope.cabBackDoor = vehicle.car.backDoor;
            }

            if(vehicle.isCarTrailer()) {
                $scope.trailer = true;
                $scope.carrier = vehicle.car.trailerType();
                $scope.bodyTypes = ['Mini-Van', "6' Trailer", "10' Trailer", "15' Trailer", "20' Trailer", "25' Trailer", "30' Trailer"];
                $scope.bodyType = vehicle.car.body.name.replace(/ Van| Flatbed/, " Trailer");
            }

            if(vehicle.isSemiTractor()) {
                $scope.tractor = true;
                $scope.bodyTypes = CW.semiTractorBody;
                $scope.bodyType = vehicle.car.body.name;
                $scope.windjammer = !!vehicle.car.windjammer;
                $scope.windjammerRetractor = $scope.windjammer && vehicle.car.windjammer.retractable;
                $scope.fifthWheelArmor = vehicle.car.fifthWheelArmor ? vehicle.armorPointsName(vehicle.car.fifthWheelArmor)+" fifth wheel armor" : "No fifth wheel armor";
                $scope.windjammerArmor = vehicle.car.windjammer ? vehicle.armorPointsName(vehicle.car.windjammer.armor)+" windjammer armor" : "No windjammer armor";
                $scope.hasFifthWheelArmor = !!vehicle.car.fifthWheelArmor;
                $scope.fifthWheelArmorAbbv = vehicle.armorAbbv(vehicle.car.fifthWheelArmor);
                $scope.hasWindjammerArmor = vehicle.car.windjammer && vehicle.car.windjammer.armor;
                $scope.windjammerArmorAbbv = vehicle.car.windjammer ? vehicle.armorAbbv(vehicle.car.windjammer.armor) : "None";
            }

            if(vehicle.isSemiTrailer()) {
                $scope.semiTrailer = true;
                $scope.carrier = vehicle.car.trailerType();
                $scope.explosiveKingpin = vehicle.car.explosiveKingpin;
                $scope.qrKingpin = vehicle.car.quickReleaseKingpin;
                $scope.step = vehicle.hasAccessory(CW.accessories.SEMI_TRAILER_EMERGENGY_PLATE);
                $scope.trailerTires2 = vehicle.car.fullTrailerTires === 2;
                $scope.trailerTires4 = vehicle.car.fullTrailerTires === 4;
            }

            if(vehicle.isBus()) {
                $scope.bodyTypes = CW.busBody;
                $scope.bodyType = vehicle.car.body.name;
            }
        };
        updateBodyStats();
        $scope.setCycleCombo = function(medium) {
            if(medium) {
                $scope.bodyType = "Medium Cycle";
                $timeout(function() {$scope.sidecar = "Light Sidecar";});
            } else {
                $scope.bodyType = "Heavy Cycle";
                $timeout(function() {$scope.sidecar = "Heavy Sidecar";});
            }
        };
        var changeBody = function(newValue, oldValue) {
            if(newValue !== oldValue) {
                vehicle.setBody(newValue);
                vehicle.recalculate();
                model.syncBody();
                if(!vehicle.isSemiTractor() && vehicle.hasEngine()) model.checkForNewEngine();
                model.layout();
                updateBodyStats();
            }
        };
        $scope.$watch('bodyType', changeBody);
        $scope.previousChassis = function() {
            vehicle.previousChassis();
            model.checkForNewEngine();
            model.redraw();
            updateBodyStats();
        };
        $scope.nextChassis = function() {
            vehicle.nextChassis();
            model.checkForNewEngine();
            model.redraw();
            updateBodyStats();
        };
        $scope.$watch('sixWheel', function(newValue) {
            vehicle.setSixWheelChassis(newValue);
            model.syncMiddleTires();
        });
        $scope.nextSuspension = function() {
            vehicle.nextSuspension();
            updateBodyStats();
        };
        $scope.previousSuspension = function() {
            vehicle.previousSuspension();
            updateBodyStats();
        };

        $scope.$watch('jettisonJoinings', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                if(vehicle.car.sidecar) {
                    vehicle.car.sidecar.jettisonJoinings = newValue;
                    vehicle.recalculate();
                }
            }
        });
        $scope.$watch('sidecarTwoTire', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                if(vehicle.car.sidecar) {
                    vehicle.car.sidecar.tireCount = newValue ? 2 : 1;
                    vehicle.recalculate();
                    model.syncCycle();
                }
            }
        });
        $scope.$watch('sidecar', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                if(newValue === 'None') {
                    vehicle.car.sidecar = null; // TODO: move to vehicle.
                    vehicle.car.windshell = null;
                    vehicle.recalculate();
                } else if(newValue === 'Windshell') {
                    vehicle.addWindshell();
                } else {
                    vehicle.setSidecar(newValue);
                }
                model.syncCycle();
                model.checkForNewEngine();
                updateBodyStats();
            }
        });
        $scope.moreWindshellArmor = function() {
            vehicle.nextArmor(vehicle.car.windshell);
            model.redraw();
            updateBodyStats();
        };
        $scope.lessWindshellArmor = function() {
            vehicle.previousArmor(vehicle.car.windshell);
            model.redraw();
            updateBodyStats();
        };
        $scope.previousSidecarSuspension = function() {
            vehicle.car.sidecar.previousSuspension();
            updateBodyStats();
        };
        $scope.nextSidecarSuspension = function() {
            vehicle.car.sidecar.nextSuspension();
            updateBodyStats();
        };

        $scope.$watch('reversed', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                vehicle.car.setReversed(newValue);
                updateBodyStats();
                $rootScope.$broadcast('new-vehicle', vehicle.car);
            }
        });

        $scope.$watch('carrier', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                if(vehicle.isTenWheeler()) vehicle.car.setCarrierType(newValue);
                else if(vehicle.isCarTrailer()) vehicle.car.setTrailerType(newValue);
                else if(vehicle.isSemiTrailer()) vehicle.car.setTrailerType(newValue);
                model.syncBody();
                model.layout();
                updateBodyStats();
            }
        });
        $scope.$watch('cabBackDoor', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                vehicle.car.backDoor = newValue;
                vehicle.recalculate();
            }
        });
        $scope.moreFifthWheelArmor = function() {
            var temp = {armor: vehicle.car.fifthWheelArmor};
            vehicle.nextArmor(temp, 20);
            vehicle.car.fifthWheelArmor = temp.armor;
            vehicle.recalculate();
            model.redraw();
            updateBodyStats();
        };
        $scope.lessFifthWheelArmor = function() {
            var temp = {armor: vehicle.car.fifthWheelArmor};
            vehicle.previousArmor(temp);
            vehicle.car.fifthWheelArmor = temp.armor;
            vehicle.recalculate();
            model.redraw();
            updateBodyStats();
        };
        $scope.$watch('windjammer', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                if(!newValue) vehicle.car.removeWindjammer();
                else vehicle.car.addWindjammer();
                updateBodyStats();
            }
        });
        $scope.$watch('windjammerRetractor', function(newValue, oldValue) {
            if(newValue !== oldValue && vehicle.car.windjammer) {
                vehicle.car.windjammer.retractable = newValue;
                vehicle.recalculate();
            }
        });
        $scope.moreWindjammerArmor = function() {
            vehicle.nextArmor(vehicle.car.windjammer);
            updateBodyStats();
        };
        $scope.lessWindjammerArmor = function() {
            vehicle.previousArmor(vehicle.car.windjammer);
            updateBodyStats();
        };
        $scope.setKingpin = function(explosive, qr) {
            vehicle.car.explosiveKingpin = explosive;
            vehicle.car.quickReleaseKingpin = qr;
            updateBodyStats();
        };
        $scope.setSTEP = function(on) {
            if(on) {
                model.addAccessory(vehicle.addAccessory(CW.accessories.SEMI_TRAILER_EMERGENGY_PLATE));
                vehicle.car.setFullTrailerTireCount(0);
                model.syncTireCount();
            } else
                model.removeAccessory(vehicle.removeAccessory(CW.accessories.SEMI_TRAILER_EMERGENGY_PLATE));
            updateBodyStats();
        };
        $scope.setTrailerTires = function(count) {
            vehicle.car.setFullTrailerTireCount(count);
            model.syncTireCount();
            if(count > 0) $scope.setSTEP(false);
            else updateBodyStats();
        };

        $scope.changeFifthWheelArmorType = function() {
            model.currentArmor = vehicle.car.fifthWheelArmor;
            model.currentArmorItemName = "Body";
            model.currentArmorSource = "body";
            $scope.openScreen("armorType");
        };
        $scope.changeWindjammerArmorType = function() {
            model.currentArmor = vehicle.car.windjammer.armor;
            model.currentArmorItemName = "Body";
            model.currentArmorSource = "body";
            $scope.openScreen("armorType");
        };
    });
