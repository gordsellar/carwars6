/* global angular, CW */
angular.module('carwars').
    controller('HandWeaponCtrl', function($scope, vehicle, model) {
        "use strict";
        var configureAmmo = function() {
            var wpn = model.currentHandWeapon;
            var ammo = CW.handWeapons[wpn.abbv+"_ammo"];
            var i;
            $scope.ammo = [];
            if(ammo && wpn.totalCapacity() > 0) {
                for(i=0;i<ammo.length; i++) {
                    $scope.ammo.push({
                        count: 0,
                        ammo: ammo[i],
                        tag: ammo[i].name.replace(/[ -]/, ""),
                        requiredTech: ammo[i].military ? 'Military' : ammo[i].techLevel === 'CWC' ? 'CWC' : ammo[i].techLevel === 'Classic' ? 'Classic' : 'All'
                    });
                }
            }
        };
        var update = function() {
            var index, i, count;
            var wpn = model.currentHandWeapon;
            $scope.name = wpn.name+(wpn.totalCapacity() > 0 ?
                " -- "+wpn.totalCapacity()+" shot"+(wpn.totalCapacity() !== 1 ? "s" : "") : "");
            $scope.abbv = wpn.abbv;
            $scope.shots = wpn.totalCapacity();
            $scope.cost = wpn.totalCost();
            $scope.weight = vehicle.car.personalEquipmentWeight ? wpn.totalWeight()+" lbs." : wpn.totalGE()+" GE";
            $scope.impactFused = wpn.impactFused || (wpn.ammo.length > 0 && wpn.ammo[0].impactFused);
            $scope.extendedMags = wpn.extendedClips+" Extended Clip"+(wpn.extendedClips === 1 ? "" : "s");
            $scope.foldingStock = wpn.foldingStock;
            $scope.laserScope = wpn.laserScope;
            $scope.powerPack = wpn.powerPack;
            $scope.count = wpn.count;
            for(index=0; index<$scope.ammo.length; index++) {
                count = 0;
                for(i=0; i<wpn.ammo.length; i++) {
                    if(wpn.ammo[i].name === $scope.ammo[index].ammo.name) {
                        count += wpn.ammo[i].shots;
                    }
                }
                $scope.ammo[index].count = count;
            }
        };
        configureAmmo();
        update();

        $scope.increaseAmmo = function(ammo) {
            vehicle.addHandWeaponAmmo(model.currentHandWeapon, ammo, 1);
            update();
        };
        $scope.decreaseAmmo = function(ammo) {
            vehicle.removeHandWeaponAmmo(model.currentHandWeapon, ammo, 1);
            update();
        };
        $scope.removeAmmo = function(ammo) {
            vehicle.removeAllHandWeaponAmmo(model.currentHandWeapon, ammo);
            update();
        };
        $scope.addClip = function(ammo) {
            vehicle.addHandWeaponAmmo(model.currentHandWeapon, ammo, model.currentHandWeapon.shots);
            update();
        };
        $scope.updateAmmo = function(name) {
            var wpn = model.currentHandWeapon;
            var on = $scope[name];
            var changed = false;
            for(var i=wpn.ammo.length-1; i >= 0; i--) {
                if(!on && i > 0 && wpn.ammo[i].abbv === wpn.ammo[i-1].abbv) {
                    wpn.ammo[i-1].shots += wpn.ammo[i].shots;
                    wpn.ammo.splice(i, 1);
                    changed = true;
                } else if(wpn.ammo[i][name] !== on) {
                    wpn.ammo[i][name] = on;
                    changed = true;
                }
            }
            if(changed) {
                vehicle.recalculate();
                update();
            }
        };
        $scope.updateWeapon = function(name) {
            var wpn = model.currentHandWeapon;
            var on = $scope[name];
            if(wpn.isGrenadeLauncher() && name === 'impactFused') {
                for(var i=0; i<wpn.ammo.length; i++)
                    wpn.ammo[i].impactFused = on;
                vehicle.recalculate();
                update();
            } else {
                if (wpn[name] !== on) {
                    wpn[name] = on;
                    vehicle.recalculate();
                    update();
                }
            }
        };
        $scope.moreExtendedMags = function() {
            model.currentHandWeapon.extendedClips += 1;
            vehicle.recalculate();
            update();
        };
        $scope.fewerExtendedMags = function() {
            if(model.currentHandWeapon.extendedClips > 0) {
                model.currentHandWeapon.extendedClips -= 1;
                vehicle.recalculate();
                update();
            }
        };
        $scope.removeWeapon = function() {
            vehicle.removeHandWeapon(model.currentCrew, model.currentHandWeapon);
            $scope.openScreen("crewGear");
        };
        $scope.increaseCount = function() {
            model.currentHandWeapon.count += 1;
            vehicle.recalculate();
            update();
        };
        $scope.decreaseCount = function() {
            if(model.currentHandWeapon.count > 1) {
                model.currentHandWeapon.count -= 1;
                vehicle.recalculate();
                update();
            } else $scope.removeWeapon();
        };

        var setup = function() {
            var wpn = model.currentHandWeapon;
            var knife = wpn.abbv === 'BwK';
            var grenade = wpn.category === 'Grenades';
            var pistol = wpn.category === 'Light Weapons' && !knife;
            var rifle = wpn.category === 'Rifles' || wpn.abbv === 'GS1' || wpn.abbv === 'GS2';
            var pistolRifleSMG = pistol || (/Rifle/.test(wpn.name) && !/^Under/.test(wpn.name)) || wpn.abbv === 'SMG';

            $scope.grenade = grenade;
            $scope.noFuse = !grenade && !wpn.isGrenadeLauncher();
            $scope.noScope = grenade || knife || /^Under-Rifle/.test(wpn.name);
            $scope.noStock = !pistol && !rifle;
            $scope.noPower = wpn.abbv !== 'LR' && wpn.abbv !== 'GR' && wpn.abbv !== 'GP';
            $scope.noExtended = !pistolRifleSMG;
        };
        setup();
    });
