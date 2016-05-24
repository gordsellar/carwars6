/* global angular, CW */
angular.module('carwars').
    controller('GearCategoriesCtrl', function($scope, vehicle, model) {
        "use strict";
        var update = function() {
            var rw = vehicle.car.reservedWeight+(vehicle.isTenWheeler() ? vehicle.car.carrier.reservedWeight : 0);
            var rs = vehicle.car.reservedSpace + (vehicle.isTenWheeler() ? vehicle.car.carrier.reservedSpace : 0);
            $scope.categories = [
                {name: "Links", icon: 'ion-network', count: vehicle.links().length, override: 'links'},
                {name: "Smart Links", icon: 'ion-fork-repo', count: vehicle.smartLinks().length, override: 'smartLinks'},
                {name: "Combat & Weapons", disabled: vehicle.techLevelIsClassic() && vehicle.spaceRemaining() < 1 &&
                    !vehicle.hasAccessory(CW.accessories.FIRE_EXTINGUISHER) && !vehicle.hasAccessory(CW.accessories.IMPROVED_FIRE_EXTINGUISHER) && !vehicle.hasAccessory(CW.accessories.LASER_BATTERY),
                    icon: 'ion-android-locate'},
                {name: "Sensors & Comm", disabled: vehicle.techLevelIsClassic() && vehicle.spaceRemaining() < 1 &&
                    !vehicle.hasAccessory(CW.accessories.SEARCHLIGHT) && !vehicle.hasAccessory(CW.accessories.ARMORED_SEARCHLIGHT),
                    icon: 'ion-android-wifi'},
                {name: "Electronics", disabled: false, icon: 'ion-videocamera'},
                {name: "Security", disabled: vehicle.techLevelIsClassic(), icon: 'ion-flash-off'},
                {name: "Recreational", disabled: vehicle.techLevelIsClassic(), icon: 'ion-beer'},
                {name: "Towing & Salvage", disabled: vehicle.techLevelIsClassic() && vehicle.cargoSpaceRemaining() < 4 && !vehicle.hasAccessory(CW.accessories.PORTABLE_SHOP), icon: 'ion-steam'},
                {name: "Cargo Allocation", disabled: false, icon: 'ion-android-calendar', override: 'cargo',
                    count: rs || rw ? rs+"/"+rw : null},
                {name: "Boosters & Jump Jets", disabled: vehicle.techLevelIsClassic(), icon: 'ion-nuclear', override: 'booster'}
            ];
        };
        update();

        $scope.selectCategory = function(category) {
            if(category.override) {
                if(category.override === 'smartLinks') {
                    model.currentLinkIsSmart = true;
                    $scope.openScreen('linkList');
                } else if(category.override === 'links') {
                    model.currentLinkIsSmart = false;
                    $scope.openScreen('linkList');
                } else {
                    model.currentTurret = null; // If boosters, in the car body not a turret
                    $scope.openScreen(category.override);
                }
            } else {
                model.currentGearCategory = category.name;
                $scope.openScreen("gearList");
            }
        };

        $scope.$watch('techLevel',function(newValue, oldValue) {
            if(newValue !== oldValue) update();
        });
    });
