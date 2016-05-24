/* global angular */
angular.module('carwars').
    controller('HitchCtrl', function($scope, vehicle, model) {
        "use strict";
        var target = vehicle.isTenWheeler() ? vehicle.car.carrier : vehicle.car;
        $scope.hitch = target.hitch ? target.hitch.name.substr(0, target.hitch.name.length-6).replace("-", "_") : "None";
        $scope.explosive = target.hitch ? target.hitch.explosive : false;
        $scope.quickRelease = target.hitch ? target.hitch.quickRelease : false;
        var update = function() {
            var min = Math.min(target.towCapacity, target.hitch ? target.hitch.loadWeight : 0);
            $scope.engine = target.towCapacity > 0 ? target.towCapacity+" lbs." : "None";
            $scope.total = (min <= 0 ? "None" : min+" lbs.");
            $scope.hitchArmor = target.hitch ? vehicle.armorPointsName(target.hitch.armor)+" hitch armor" : "No hitch armor";
        };
        update();

        $scope.$watch('hitch', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                var old = target.hitch;
                vehicle.setHitch(newValue === 'None' ? null : newValue);
                if(old && !target.hitch) {
                    model.removeModification('hitch');
                    $scope.explosive = false;
                    $scope.quickRelease = false;
                } else if(!old && target.hitch) model.addModification('hitch');
                else model.redraw();
                update();
            }
        });
        $scope.moreArmor = function() {
            vehicle.nextArmor(target.hitch);
            model.redraw();
            update();
        };
        $scope.lessArmor = function() {
            vehicle.previousArmor(target.hitch);
            model.redraw();
            update();
        };
        $scope.$watch('explosive', function(newValue, oldValue) {
            if(newValue !== oldValue && target.hitch) {
                if(target.hitch) target.hitch.explosive = newValue;
                if(newValue) $scope.quickRelease = false;
                if(target.hitch) target.recalculate();
            }
        });
        $scope.$watch('quickRelease', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                if(target.hitch) target.hitch.quickRelease = newValue;
                if(newValue) $scope.explosive = false;
                if(target.hitch) target.recalculate();
            }
        });
    });
