/* global angular */
angular.module('carwars').
    controller('CrewCtrl', function($scope, vehicle, model) {
        "use strict";
        var update = function() {
            $scope.name = vehicle.crewName(model.currentCrew);
            $scope.driver = $scope.name === 'Driver' || $scope.name === 'Cyclist';
            $scope.bodyArmor = model.currentCrew.currentBodyArmorName();
            $scope.seat = model.currentCrew.currentSeatName();
            $scope.safetySeat = model.currentCrew.safetySeat;
            $scope.computer = model.currentCrew.currentComputerName();
            $scope.componentArmor = vehicle.componentArmorName(model.currentCrew);
            $scope.gunnerPresent = vehicle.hasGunner(model.currentCrew.inCarrier);
            $scope.crewCount = vehicle.crewCount(model.currentCrew.inCarrier);
            $scope.multiCA = vehicle.crewCompartmentCAName(model.currentCrew.inCarrier);
            $scope.fireproofSuit = model.currentCrew.fireproofSuit;
            $scope.flakJacket = model.currentCrew.flakJacket;
            $scope.battleVest = model.currentCrew.battleVest;
            $scope.armoredBattleVest = model.currentCrew.armoredBattleVest;
            $scope.extraDriverControls = model.currentCrew.extraDriverControls;
            $scope.portableFireExtinguisher = model.currentCrew.portableFireExtinguisher;
            if(model.currentCrew.cupola)
                $scope.spaces = vehicle.findCupola(model.currentCrew).remainingSpace();
            else
                $scope.spaces = model.currentCrew.inCarrier ? vehicle.carrierSpaceRemaining() : model.currentCrew.inSidecar ? vehicle.sidecarSpaceRemaining() : vehicle.spaceRemaining();
            $scope.hasCA = !!model.currentCrew.componentArmor;
            $scope.hasCrewCA = vehicle.hasCrewCA(model.currentCrew.inCarrier); // Any crew member has CA
            $scope.hasMultiCA = vehicle.hasCrewCompartmentCA(model.currentCrew.inCarrier);
            $scope.multiCAAllowed = !model.currentCrew.inSidecar && $scope.name !== 'Passenger' && $scope.crewCount > 1;
            $scope.caAbbv = vehicle.armorAbbv(model.currentCrew.componentArmor);
            $scope.multiCAAbbv = vehicle.armorAbbv(vehicle.crewCompartmentCA(model.currentCrew.inCarrier));
            $scope.caSize = vehicle.componentArmorSpace();
        };
        update();
        $scope.nextBodyArmor = function() {
            model.currentCrew.nextBodyArmor();
            vehicle.recalculate();
            model.redraw();
            update();
        };
        $scope.previousBodyArmor = function() {
            model.currentCrew.previousBodyArmor();
            vehicle.recalculate();
            model.redraw();
            update();
        };
        $scope.nextSeat = function() {
            model.currentCrew.nextSeat();
            vehicle.recalculate();
            update();
        };
        $scope.previousSeat = function() {
            model.currentCrew.previousSeat();
            vehicle.recalculate();
            update();
        };
        $scope.nextComputer = function() {
            model.currentCrew.nextComputer();
            vehicle.recalculate();
            update();
        };
        $scope.previousComputer = function() {
            model.currentCrew.previousComputer();
            vehicle.recalculate();
            update();
        };
        $scope.nextComponentArmor = function() {
            vehicle.nextComponentArmor(model.currentCrew);
            model.syncCrewCompartmentCA();
            model.redraw();
            update();
        };
        $scope.previousComponentArmor = function() {
            vehicle.previousComponentArmor(model.currentCrew);
            model.syncCrewCompartmentCA();
            model.redraw();
            update();
        };
        $scope.nextMultiCA = function() {
            vehicle.nextCrewCompartmentCA(model.currentCrew.inCarrier);
            model.syncCrewCompartmentCA();
            model.redraw();
            update();
        };
        $scope.previousMultiCA = function() {
            vehicle.previousCrewCompartmentCA(model.currentCrew.inCarrier);
            model.syncCrewCompartmentCA();
            model.redraw();
            update();
        };
        var setCrewItem = function(name, newValue, oldValue, opposite, another) {
            if(newValue !== oldValue) {
                model.currentCrew[name] = !!newValue;
                if(opposite && newValue) $scope[opposite] = false;
                if(another && newValue) $scope[another] = false;
                vehicle.recalculate();
            }
        };
        $scope.$watch('fireproofSuit', function(newV, oldV) {setCrewItem('fireproofSuit', newV, oldV);});
        $scope.$watch('flakJacket', function(newV, oldV) {setCrewItem('flakJacket', newV, oldV, 'armoredBattleVest');});
        $scope.$watch('battleVest', function(newV, oldV) {setCrewItem('battleVest', newV, oldV, 'armoredBattleVest');});
        $scope.$watch('armoredBattleVest', function(newV, oldV) {setCrewItem('armoredBattleVest', newV, oldV, 'battleVest', 'flakJacket');});
        $scope.$watch('extraDriverControls', function(newV, oldV) {setCrewItem('extraDriverControls', newV, oldV);});
        $scope.$watch('portableFireExtinguisher', function(newV, oldV) {setCrewItem('portableFireExtinguisher', newV, oldV);});
        $scope.$watch('safetySeat', function(newV, oldV) {setCrewItem('safetySeat', newV, oldV);});

        $scope.addGunner = function() {
            model.addGunner(vehicle.addGunner(model.currentCrew.inSidecar, model.currentCrew.inCarrier));
            update();
        };
        $scope.removePerson = function() {
            if(model.currentCrew.name === 'Gunner')
                model.removeGunner(vehicle.removeGunner(model.currentCrew));
            else
                model.removePassenger(vehicle.removePassenger(model.currentCrew));
            model.currentCrew = null;
            $scope.openScreen('crewList');
        };
        $scope.editGear = function() {
            $scope.openScreen('crewGear');
        };
        $scope.changeCAType = function() {
            model.currentArmor = model.currentCrew.componentArmor;
            model.currentArmorItemName = $scope.name;
            model.currentArmorSource = "crew";
            $scope.openScreen("armorType");
        };
        $scope.changeMultiCAType = function() {
            model.currentArmor = vehicle.crewCompartmentCA(model.currentCrew.inCarrier);
            model.currentArmorItemName = $scope.name;
            model.currentArmorSource = "crew";
            $scope.openScreen("armorType");
        };
    });
