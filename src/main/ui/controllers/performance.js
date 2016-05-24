/* global angular, CW */
angular.module('carwars').
    controller('PerformanceModsCtrl', function($scope, vehicle, model) {
        "use strict";
        var update = function() {
            $scope.spaces = vehicle.spaceRemaining();
            var cwc = vehicle.techLevelIsCWC();
            var classic = vehicle.techLevelIsClassic();
            var car = vehicle.car;
            $scope.CAFrame = car.carbonAluminumFrame;
            $scope.activeSuspension = car.activeSuspension;
            $scope.spoiler = car.spoiler;
            $scope.airdam = car.airdam;
            $scope.streamlined = car.streamlined;
            $scope.HDShocks = car.heavyDutyShocks;
            $scope.HDBrakes = car.heavyDutyBrakes;
            $scope.antilockBrakes = car.antilockBrakes;
            $scope.HDTransmission = car.heavyDutyTransmission;
            $scope.overdrive = car.overdrive;
            $scope.rollCage = car.rollCage;
            $scope.dragChute = !!car.getAccessory(CW.accessories.DRAG_CHUTE);
            $scope.FPDragChute = !!car.getAccessory(CW.accessories.FP_DRAG_CHUTE);
            $scope.asDisabled = !vehicle.isCar() && !vehicle.isCycle() && !vehicle.isTrike();
            $scope.airdamDisabled = vehicle.isCycle() || vehicle.isNormalTrike() || vehicle.isCarTrailer() || vehicle.isSemiTrailer();
            $scope.spoilerDisabled = vehicle.isCarTrailer() || vehicle.isSemiTrailer();
            $scope.caDisabled = classic || vehicle.isRaceCar();
            $scope.hdTransDisabled = classic || $scope.spaces < 2;
            $scope.dragChuteDisabled = classic || cwc;
        };
        update();

        var updateBodyField = function(property, newValue, oldValue) {
            if(newValue !== oldValue) {
                vehicle.car[property] = !!newValue;
                vehicle.recalculate();
                if(newValue) model.addModification(property);
                else model.removeModification(property);
                update();
            }
        };
        var setAccessory = function(item, newValue, oldValue) {
            if(newValue !== oldValue) {
                if(newValue) model.addAccessory(vehicle.car.addAccessory(item));
                else model.removeAccessory(vehicle.car.removeAccessory(item));
            }
            update();
        };
        $scope.$watch('CAFrame', function(newV, oldV) {updateBodyField('carbonAluminumFrame', newV, oldV);});
        $scope.$watch('activeSuspension', function(newV, oldV) {updateBodyField('activeSuspension', newV, oldV);});
        $scope.$watch('spoiler', function(newV, oldV) {updateBodyField('spoiler', newV, oldV);});
        $scope.$watch('airdam', function(newV, oldV) {updateBodyField('airdam', newV, oldV);});
        $scope.$watch('streamlined', function(newV, oldV) {updateBodyField('streamlined', newV, oldV);});
        $scope.$watch('HDShocks', function(newV, oldV) {updateBodyField('heavyDutyShocks', newV, oldV);});
        $scope.$watch('HDBrakes', function(newV, oldV) {updateBodyField('heavyDutyBrakes', newV, oldV);});
        $scope.$watch('antilockBrakes', function(newV, oldV) {updateBodyField('antilockBrakes', newV, oldV);});
        $scope.$watch('HDTransmission', function(newV, oldV) {updateBodyField('heavyDutyTransmission', newV, oldV);});
        $scope.$watch('overdrive', function(newV, oldV) {updateBodyField('overdrive', newV, oldV);});
        $scope.$watch('rollCage', function(newV, oldV) {updateBodyField('rollCage', newV, oldV);});
        $scope.$watch('dragChute', function(newV, oldV) {setAccessory(CW.accessories.DRAG_CHUTE, newV, oldV);});
        $scope.$watch('FPDragChute', function(newV, oldV) {setAccessory(CW.accessories.FP_DRAG_CHUTE, newV, oldV);});
        $scope.$watch('techLevel', function(newValue, oldValue) {
            if(newValue !== oldValue) update();
        });
    });
