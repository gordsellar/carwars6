/* global angular, CW */
angular.module('carwars').
    controller('DischargerCtrl', function($scope, vehicle, model) {
        "use strict";
        var update = function() {
            $scope.visible = true;
            $scope.dischargerName = model.currentWeapon.weapon.name+"s";
            $scope.sideCount = vehicle.sideDischargerLimit(model.currentWeapon);
            $scope.front = vehicle.countWeaponsIn(model.currentWeapon, "Front") === 1;
            $scope.back = vehicle.countWeaponsIn(model.currentWeapon, "Back") === 1;
            $scope.left = vehicle.countWeaponsIn(model.currentWeapon, "Left") === $scope.sideCount;
            $scope.right = vehicle.countWeaponsIn(model.currentWeapon, "Right") === $scope.sideCount;
            $scope.top = vehicle.countWeaponsIn(model.currentWeapon, "Top") === $scope.sideCount;
            $scope.underbody = vehicle.countWeaponsIn(model.currentWeapon, "Underbody") === $scope.sideCount;
            $scope.bumperTrigger = vehicle.dischargersBumperTriggered(model.currentWeapon);
            $scope.antiTheft = vehicle.hasAccessory(CW.accessories.ANTI_THEFT_SYSTEM, model.currentWeapon.carrier, model.currentWeapon.sidecar);
        };
        update();

        $scope.saveDischargers = function() {
            var side = $scope.sideCount;
            if($scope.front) createDischargers("Front", 1);
            if($scope.back) createDischargers("Back", 1);
            if($scope.left) createDischargers("Left", side);
            if($scope.right) createDischargers("Right", side);
            if($scope.top) createDischargers("Top", side);
            if($scope.underbody) createDischargers("Underbody", side);

            var link, list, item;
            if($scope.antiTheft) {
                item = vehicle.getAccessory(CW.accessories.ANTI_THEFT_SYSTEM, model.currentWeapon.carrier, model.currentWeapon.sidecar);
                if(!item) item = vehicle.addAccessory(CW.accessories.ANTI_THEFT_SYSTEM, model.currentWeapon.carrier, model.currentWeapon.sidecar);
                link = vehicle.addLink(false);
                link.items.push(item);
            }
            if($scope.antiTheft || $scope.bumperTrigger) {
                list = vehicle.linkableWeapons(model.currentWeapon);
                for(var i=0; i<list.length; i++) {
                    if(list[i].abbv === model.currentWeapon.weapon.abbv) {
                        if($scope.bumperTrigger && list[i].location !== 'Top' && list[i].location !== 'Underbody') list[i].bumperTrigger = true;
                        if($scope.antiTheft && link.items.indexOf(list[i]) < 0) link.items.push(list[i]);
                    }
                }
                vehicle.recalculate();
            }

            $scope.openScreen('weapon');
        };

        var createDischargers = function(location, count) {
            var data = {
                location: location,
                carrier: model.currentWeapon.carrier,
                sidecar: model.currentWeapon.sidecar,
                isTurret: function() {return false;}
            };
            data.weapon = vehicle.getWeaponIn(model.currentWeapon, location);
            if(!data.weapon) {
                vehicle.addWeapon(model.currentWeapon.weapon.abbv, data);
                model.addWeapon(data);
            }
            while(vehicle.countWeaponsIn(data, location) < count) {
                data.weapon.count += 1;
                model.increaseWeaponCount(data);
            }
        };
    });