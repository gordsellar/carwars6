/* global angular */
angular.module('carwars').
    controller('STLOptionsCtrl', function($scope, vehicle, model3d, stl) {
        "use strict";
        var oldDisplay = $scope.mainDisplay;
        if(oldDisplay !== '3d' && oldDisplay !== 'stl') model3d.createNewCar(vehicle.car);
        model3d.generateSTL();

        $scope.setDisplay('STL');

        var update = function() {
            $scope.raiseFront = stl.frontWeaponsRaised;
            $scope.frontWeapons = vehicle.car.frontWeapons.length > 0; // TODO: not dischargers
        };
        update();

        $scope.$watch('raiseFront', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                stl.frontWeaponsRaised = newValue;
                stl.updateSTL();
            }
        });

        $scope.download = function() {
            stl.exportSTL();
            $scope.openScreen('overview');
        };
        $scope.cancel = function() {
            $scope.openScreen('overview');
        };
        // Switch back to 3D view when this screen closed
        $scope.$on('$routeChangeStart', function() {
            $scope.setDisplay(oldDisplay.toUpperCase());
            if(oldDisplay !== '3d' && oldDisplay !== 'stl') model3d.destroy();
        });
    });
