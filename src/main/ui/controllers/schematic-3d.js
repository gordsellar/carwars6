/* global angular */
angular.module('carwars').
    controller('Schematic3dCtrl', function($scope, vehicle, model3d, model) {
        "use strict";
        var update = function() {
            model3d.createNewCar(vehicle.car);
            model.setModel('3d', model3d);
            $scope.scene = model3d.scene;
            $scope.models = model3d.models;
        };
        update();
        $scope.$on('new-vehicle', function() {
            update();
            $scope.$broadcast('resize');
        });

        $scope.click = function(address, item) {
            if(!address) $scope.processClick("overview");
            else $scope.processClick(address, item);
        };
        $scope.$on('scene-changed', function(event, scene) {
            $scope.scene = scene;
        });
    });