/* global angular, CW */
angular.module('carwars').
    controller('BodyModsCtrl', function($scope, vehicle, model) {
        "use strict";

        $scope.bodyBladeText = vehicle.car.bodyBladeText();
        $scope.trailer = vehicle.isCarTrailer() || vehicle.isSemiTrailer();
        $scope.showDoors = vehicle.isBus() || vehicle.isSemiTrailer() || vehicle.isCarTrailer()
            || vehicle.isTenWheeler() || vehicle.car.body.name === 'Van';
        $scope.showConvertible = vehicle.convertibleAllowed();
        $scope.ramplateDisabled = vehicle.isCycle() || vehicle.isNormalTrike();
        $scope.showAmphibious = vehicle.isCar() || vehicle.isTrike();
        $scope.showAssaultRamp = vehicle.isBus() || vehicle.isSemiTrailer() || vehicle.isCarTrailer() || vehicle.isTenWheeler();
        $scope.showWheelRamps = vehicle.isSemiTrailer() || vehicle.isCarTrailer() || vehicle.isTenWheeler();
        $scope.assaultRampDisabled = ((vehicle.isCarTrailer() || vehicle.isSemiTrailer()) && !vehicle.isVan())
            || (vehicle.isTenWheeler() && !vehicle.car.carrier.isVan());
        $scope.wheelRampsDisabled = ((vehicle.isCarTrailer() || vehicle.isSemiTrailer()) && !vehicle.isVan() && !vehicle.isFlatbed())
            || (vehicle.isTenWheeler() && !vehicle.car.carrier.isVan() && !vehicle.car.carrier.isFlatbed());

        var update = function() {
            $scope.spaces = vehicle.spaceRemaining();
            var classic = vehicle.techLevelIsClassic();
            var car = vehicle.car;
            var carOrCarrier = vehicle.isTenWheeler() ? vehicle.car.carrier : car;
            $scope.ramplate = car.ramplate;
            $scope.fakeRamplate = car.fakeRamplate;
            $scope.brushcutter = car.brushcutter;
            $scope.bumperSpikes = car.bumperSpikes;
            $scope.backBumperSpikes = car.backBumperSpikes;
            $scope.bodyBlades = car.bodyBlades;
            $scope.fakeBodyBlades = car.fakeBodyBlades;
            $scope.convertible = car.convertibleHardtop;
            $scope.sunroof = car.sunroof;
            $scope.noPaintWindshield = car.noPaintWindshield;
            $scope.tintedWindows = !!car.getAccessory(CW.accessories.TINTED_WINDOWS);
            $scope.amphibious = !!car.getAccessory(CW.accessories.AMPHIBIOUS_MODIFICATIONS);
            $scope.leftSideDoor = !!carOrCarrier.getAccessory(CW.accessories.LEFT_SIDE_DOOR);
            $scope.rightSideDoor = !!carOrCarrier.getAccessory(CW.accessories.RIGHT_SIDE_DOOR);
            $scope.assaultRamp = !!carOrCarrier.getAccessory(CW.accessories.ASSAULT_RAMP);
            $scope.wheelRamps = !!carOrCarrier.getAccessory(CW.accessories.WHEEL_RAMP);
            $scope.convertibleDisabled = !vehicle.convertibleEnabled() || classic;
            $scope.doorsDisabled = vehicle.isFlatbed() || (vehicle.isTenWheeler() && vehicle.car.carrier.isFlatbed()) || classic;
            $scope.sunroofDisabled = classic || vehicle.isCycle() ||
                (car.topTurret && car.topTurret.name !== CW.turrets.Pintle_Mount.name);
            $scope.noPaintDisabled = classic;
            $scope.tintedDisabled = classic;
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
        var setAccessory = function(item, newValue, oldValue, carrier) {
            if(newValue !== oldValue) {
                if(newValue) model.addAccessory(vehicle.addAccessory(item, carrier), carrier);
                else model.removeAccessory(vehicle.removeAccessory(item, carrier), carrier);
            }
            update();
        };
        $scope.$watch('ramplate', function(newV, oldV) {updateBodyField('ramplate', newV, oldV);});
        $scope.$watch('fakeRamplate', function(newV, oldV) {updateBodyField('fakeRamplate', newV, oldV);});
        $scope.$watch('brushcutter', function(newV, oldV) {updateBodyField('brushcutter', newV, oldV);});
        $scope.$watch('bumperSpikes', function(newV, oldV) {updateBodyField('bumperSpikes', newV, oldV);});
        $scope.$watch('backBumperSpikes', function(newV, oldV) {updateBodyField('backBumperSpikes', newV, oldV);});
        $scope.$watch('bodyBlades', function(newV, oldV) {updateBodyField('bodyBlades', newV, oldV);});
        $scope.$watch('fakeBodyBlades', function(newV, oldV) {updateBodyField('fakeBodyBlades', newV, oldV);});
        $scope.$watch('convertible', function(newV, oldV) {updateBodyField('convertibleHardtop', newV, oldV);});
        $scope.$watch('sunroof', function(newV, oldV) {updateBodyField('sunroof', newV, oldV);});
        $scope.$watch('noPaintWindshield', function(newV, oldV) {updateBodyField('noPaintWindshield', newV, oldV);});

        $scope.$watch('tintedWindows', function(newV, oldV) {setAccessory(CW.accessories.TINTED_WINDOWS, newV, oldV);});
        $scope.$watch('amphibious', function(newV, oldV) {setAccessory(CW.accessories.AMPHIBIOUS_MODIFICATIONS, newV, oldV);});
        $scope.$watch('assaultRamp', function(newV, oldV) {setAccessory(CW.accessories.ASSAULT_RAMP, newV, oldV, vehicle.isTenWheeler());});
        $scope.$watch('wheelRamps', function(newV, oldV) {setAccessory(CW.accessories.WHEEL_RAMP, newV, oldV, vehicle.isTenWheeler());});
        $scope.$watch('leftSideDoor', function(newV, oldV) {setAccessory(CW.accessories.LEFT_SIDE_DOOR, newV, oldV, vehicle.isTenWheeler());});
        $scope.$watch('rightSideDoor', function(newV, oldV) {setAccessory(CW.accessories.RIGHT_SIDE_DOOR, newV, oldV, vehicle.isTenWheeler());});

        $scope.$watch('techLevel', function(newValue, oldValue) {
            if(newValue !== oldValue) update();
        });
    });
