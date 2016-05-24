/* global angular */
angular.module('carwars').
    controller('TurretCtrl', function($scope, vehicle, model) {
        "use strict";
        var update = function() {
            vehicle.setTurretLocation(model.currentWeapon, model.currentTurret);
            model.currentWeapon.weapon = null;
            var turret = model.currentTurret;
            $scope.spaces = turret.remainingSpace();
            $scope.name = turret.name;
            $scope.size = turret.size;
            $scope.weapons = turret.weapons;
            $scope.boosters = turret.boosters;
            $scope.fake = turret.fake;
            $scope.universal = turret.universal;
            $scope.ejection = turret.ewpEjectionSystem;
            $scope.boosterAllowed = turret.name === 'EWP' && $scope.boosters.length === 0;
            $scope.ewp = /EWP/.test(turret.name);
            $scope.laser = vehicle.hasLaser(model.currentWeapon);
            $scope.ewpArmor = vehicle.armorPointsName(model.currentTurret.armor)+" EWP armor";
            $scope.totalWeight = vehicle.car.weightUsed;
            $scope.canRemove = !turret.builtIn;
        };
        update();

        $scope.smallerTurret = function() {
            vehicle.makeTurretSmaller(model.currentTurret);
            update();
        };
        $scope.biggerTurret = function() {
            vehicle.makeTurretLarger(model.currentTurret);
            update();
        };

        $scope.addWeapon = function() {
            $scope.openScreen("weaponTypes");
        };
        $scope.addBooster = function() {
            $scope.openScreen("booster");
        };
        $scope.addTL = function() {
            vehicle.addWeapon('TL', model.currentWeapon);
            model.addWeapon(model.currentWeapon);
            $scope.openScreen('weapon');
        };
        $scope.editWeapon = function(weapon) {
            model.currentWeapon.weapon = weapon;
            $scope.openScreen('weapon');
        };
        $scope.editBooster = function(booster) {
            $scope.openScreen("booster");
        };

        $scope.removeTurret = function() {
            model.removeTurret(vehicle.removeTurret(model.currentTurret));
            $scope.openScreen("turretList");
        };

        $scope.$watch('fake', function(newValue, oldValue) {
            if(oldValue !== newValue) {
                model.currentTurret.setFake(newValue, vehicle.car);
                vehicle.recalculate();
                model.redraw();
                update();
            }
        });

        $scope.$watch('universal', function(newValue, oldValue) {
            if(oldValue !== newValue) {
                model.currentTurret.universal = newValue;
                vehicle.recalculate();
                update();
            }
        });

        $scope.$watch('ejection', function(newValue, oldValue) {
            if(oldValue !== newValue) {
                model.currentTurret.ewpEjectionSystem = newValue;
                vehicle.recalculate();
                update();
            }
        });
        $scope.moreArmor = function() {
            vehicle.nextArmor(model.currentTurret);
            model.redraw();
            update();
        };
        $scope.lessArmor = function() {
            vehicle.previousArmor(model.currentTurret);
            model.redraw();
            update();
        };
    });
