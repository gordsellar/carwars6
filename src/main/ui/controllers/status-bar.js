/* global angular */
angular.module('carwars').
    constant('statusConfig', {
        badColor: 'red',
        goodColor: 'black',
        modColor: 'blue'
    }).
    controller('StatusCtrl', function($scope, statusConfig, vehicle) {
        "use strict";
        var update = function(event, car) { // TODO: push all these calculations into the model
            $scope.carCost = "$"+(car.totalCost+(car.sidecar ? car.sidecar.totalCost() : 0));
            $scope.carWeight = car.weightUsed+(car.maxEffectiveWeight ? "/"+car.maxEffectiveWeight : "");
            $scope.carOverweight = car.weightUsed > car.maxEffectiveWeight ? statusConfig.badColor : car.reservedWeight > 0 ? statusConfig.modColor : statusConfig.goodColor;
            $scope.carSpace = Math.ceil(car.spaceUsed)+"/"+car.modifiedSpaceAvailable;
            $scope.carOverspace = car.spaceUsed > car.modifiedSpaceAvailable ? statusConfig.badColor : car.reservedSpace > 0 ? statusConfig.modColor : statusConfig.goodColor;
            $scope.cargo = car.modifiedCargoSpaceAvailable > 0;
            $scope.cargoSpace = Math.ceil(car.cargoSpaceUsed)+"/"+car.modifiedCargoSpaceAvailable;
            $scope.cargoOverspace = car.cargoSpaceUsed > car.modifiedCargoSpaceAvailable ? statusConfig.badColor : statusConfig.goodColor;
            $scope.carHC = car.modifiedHandlingClass;
            $scope.carAcceleration = car.displayAcceleration;
            $scope.carUnderpowered = car.currentAcceleration === 0 ? statusConfig.badColor : statusConfig.goodColor;
            $scope.carTopSpeed = car.currentTopSpeed;
            $scope.engine = !!car.engine;
            if(vehicle.isTenWheeler()) {
                $scope.carrierSpace = Math.ceil(car.carrier.spaceUsed)+"/"+car.carrier.modifiedSpaceAvailable;
                $scope.carrierOverspace = car.carrier.spaceUsed > car.carrier.modifiedSpaceAvailable ? statusConfig.badColor : car.carrier.reservedSpace > 0 ? statusConfig.modColor : statusConfig.goodColor;
                $scope.carrierWeight = car.carrier.weightUsed;
                $scope.carrierOverweight = car.weightUsed > car.maxEffectiveWeight ? statusConfig.badColor : car.carrier.reservedWeight > 0 ? statusConfig.modColor : statusConfig.goodColor;
            } else {
                $scope.carrierSpace = null;
                $scope.carrierWeight = null;
            }
            //$('#statusCargoSpace', $status).text(state.car.suppressDrawing ? " " : this.modifiedCargoSpaceAvailable === 0 ? "--" : Math.ceil(this.cargoSpaceUsed)+"/"+this.modifiedCargoSpaceAvailable).css('color', this.cargoSpaceUsed > this.modifiedCargoSpaceAvailable ? 'red' : 'gold');
            $scope.clearLastSavedID();
        };
        //$scope.$on('new-vehicle', update);  Will recalculate the new vehicle right away anyway, just to be sure
        $scope.$on('recalculate', update);
//        if($scope.preload) update(null, vehicle.car);
    });