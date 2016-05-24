/* global angular */
angular.module('carwars').
    controller('WeaponCategoriesCtrl', function($scope, vehicle, model) {
        "use strict";
        var update = function() {
            var rp = vehicle.isRocketPlatform(model.currentWeapon) || vehicle.isRocketEWP(model.currentWeapon);
            var corner = model.currentWeapon.isCorner();
            var max = vehicle.spacesForWeapon(model.currentWeapon);
            var bus = vehicle.isFrontOfBus(model.currentWeapon);
            var laser = vehicle.hasLaser(model.currentWeapon);
            var dischargers = vehicle.dischargersAllowed(model.currentWeapon);
            $scope.categories = [
                {name: "Small Bore Projectile Wpns.", override: "Small Bore Projectile Weapons", disabled: rp || corner || max<1},
                {name: "Large Bore Projectile Wpns.", override: "Large Bore Projectile Weapons", disabled: rp || corner || max<1 || (vehicle.techLevelIsClassic() && max < 2)},
                {name: "Single-Shot Rockets", disabled: corner || max < 0.3},
                {name: "Rocket Launchers & Pods", override: "Rockets", disabled: rp || corner || max < 1},
                {name: "Lasers", disabled: corner || (max < 1 && laser)},
                {name: "Flamethrowers", disabled: rp || corner || max < 1 || (vehicle.techLevelIsClassic() && max < 2)},
                {name: "Dropped Gasses", disabled: rp || max < 1 || bus},
                {name: "Dropped Liquids", disabled: rp || max < 2 || bus},
                {name: "Dropped Solids", disabled: rp || max < 1 || bus},
                {name: "Gas Dischargers", disabled: rp || corner || !dischargers || vehicle.techLevelIsClassic()},
                {name: "Other Dischargers", disabled: rp || corner || !dischargers || vehicle.techLevelIsClassic()},
                {name: "Mounted Accessories", disabled: rp || max < 1 || corner}
            ];
            $scope.spaces = vehicle.spacesForWeapon(model.currentWeapon);
        };
        update();

        $scope.selectCategory = function(category) {
            model.currentWeaponCategory = category.override ? category.override : category.name;
            $scope.openScreen("weaponList");
        };
        $scope.showSpaces = function() {
            if(model.currentWeapon.isTurret()) {
                $scope.showMessage('Turret Space Remaining: ' + $scope.spaces);
                $scope.showMessage('1/3 Space Remaining: ' + vehicle.weaponSpacesInBody(model.currentWeapon));
            } else if(model.currentWeapon.carrier) {
                $scope.showMessage('Body Space Remaining: '+vehicle.carrierSpaceRemaining());
                $scope.showMessage('1/3 Space Remaining: '+vehicle.oneThirdSpaces(model.currentWeapon.location, true));
            } else {
                $scope.showMessage('Body Space Remaining: '+vehicle.spaceRemaining());
                $scope.showMessage('1/3 Space Remaining: '+vehicle.oneThirdSpaces(model.currentWeapon.location)); // TODO: types exempt from the rule
            }
        };
        $scope.$watch('techLevel', function(newValue, oldValue) {
            if(newValue !== oldValue) update();
        });
    });
