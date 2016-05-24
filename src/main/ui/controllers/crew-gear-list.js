/* global angular */
angular.module('carwars').
    controller('CrewGearListCtrl', function($scope, vehicle, model) {
        "use strict";
        var update = function() {
            $scope.category = model.currentGearCategory;
            $scope.multis = vehicle.multiSelectGear(model.currentGearCategory, model.currentCrew);
            $scope.singles = vehicle.singleSelectGear(model.currentGearCategory, model.currentCrew);
        };
        update();

        $scope.moreItems = function(item) {
            var result = model.currentCrew.addGear(item.data);
            item.count = result ? result.count : "No";
            vehicle.recalculate();
        };
        $scope.fewerItems = function(item) {
            var result = model.currentCrew.removeGear(item.data);
            item.count = result && result.count > 0 ? result.count : "No";
            vehicle.recalculate();
        };
        $scope.checkbox = function(item) {
            if(item.present) {
                if(!model.currentCrew.hasGear(item.data))
                    model.currentCrew.addGear(item.data);
            } else {
                model.currentCrew.removeGear(item.data);
            }
            vehicle.recalculate();
        };

        $scope.$watch('techLevel', function(newValue, oldValue) {
            if(newValue !== oldValue) update();
        });
    });
