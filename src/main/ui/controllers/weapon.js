/* global angular, CW */
angular.module('carwars').
    controller('WeaponCtrl', function($scope, vehicle, model) {
        "use strict";

        var wpn = model.currentWeapon.weapon;
        $scope.turret = model.currentWeapon.isTurret();
        $scope.abbv = wpn.abbv;
        $scope.location = vehicle.locationName(model.currentWeapon);
        $scope.isMine = wpn.isMinedropper() && !wpn.fake;
        $scope.isRocket = wpn.isRocket() && !wpn.fake;
        $scope.isBullet = wpn.isMachineGun() && !wpn.fake;
        $scope.isLaser = wpn.isLaser() && !wpn.fake;
        $scope.isGrenade = wpn.isGrenadeLauncher() && !wpn.fake;
        $scope.noAmmo = wpn.shots === 0;

        var configureAmmo = function() {
            var wpn = model.currentWeapon.weapon;
            var ammo = CW.weapons[wpn.abbv+"_ammo"];
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
            $scope.count = wpn.count;
            $scope.shots = wpn.totalCapacity();
            $scope.totalCost = wpn.totalCost();
            $scope.totalWeight = wpn.totalWeight();
            $scope.totalSpace = wpn.totalSpace();
            $scope.spaceRemaining = vehicle.spacesForWeapon(model.currentWeapon);
            $scope.laserGuidanceLink = wpn.laserGuidanceLink;
            $scope.lgCount = vehicle.countShotsWith(wpn, "laserGuided");
            $scope.tracerCount = vehicle.countShotsWith(wpn, "tracer");
            $scope.proxCount = vehicle.countShotsWith(wpn, "proximityFused");
            $scope.radioCount = vehicle.countShotsWith(wpn, "radioDetonated");
            $scope.programCount = vehicle.countShotsWith(wpn, "programmable");
            $scope.impactCount = vehicle.countShotsWith(wpn, "impactFused");
            $scope.harmCount = vehicle.countShotsWith(wpn, "harm");
            $scope.highVelCount = vehicle.countShotsWith(wpn, "highVelocity");
            $scope.pulse = wpn.pulse;
            $scope.infrared = wpn.infrared;
            $scope.bluegreen = wpn.bluegreen;
            $scope.fake = wpn.fake;
            $scope.bumperTrigger = wpn.bumperTrigger;
            $scope.rotaryMagazine = wpn.rotaryMagazine;
            $scope.magazineSwitch = wpn.magazineSwitch;
            $scope.fireRetardantInsulator = wpn.fireRetardantInsulator;
            $scope.concealment = wpn.concealment;
            $scope.blowThroughConcealment = wpn.blowThroughConcealment;
            $scope.componentArmor = vehicle.componentArmorName(wpn);
            $scope.caDisabled = !wpn.componentArmor && ($scope.spaceRemaining < vehicle.componentArmorSpace()
                || (model.currentWeapon.isTurret() && vehicle.getTurret(model.currentWeapon).isEWP()));
            $scope.caAbbv = vehicle.armorAbbv(wpn.componentArmor);
            $scope.caPresent = wpn.componentArmor && (wpn.componentArmor.plasticPoints > 0 || wpn.componentArmor.metalPoints > 0);
            for(index=0; index<$scope.ammo.length; index++) {
                count = 0;
                for(i=0; i<wpn.ammo.length; i++) {
                    if(wpn.ammo[i].name === $scope.ammo[index].ammo.name) {
                        count += wpn.ammo[i].shots;
                    }
                }
                $scope.ammo[index].count = count;
            }
            var oddLoad = false;
            for(i=0; i<wpn.ammo.length; i++) {
                if((wpn.ammo[i].shots % wpn.shots) !== 0) {
                    oddLoad = true;
                    break;
                }
            }

            $scope.noMagazine = !wpn.hasMagazines();
            $scope.multipleAmmo = wpn.shots > 0 && wpn.ammo.length > 1 && oddLoad;
        };
        configureAmmo();
        update();
        $scope.laserGuided = wpn.ammo.length > 0 && $scope.lgCount > 0;
        $scope.tracer = wpn.ammo.length > 0 && $scope.tracerCount > 0;
        $scope.proximityFused = wpn.ammo.length > 0 && $scope.proxCount > 0;
        $scope.radioDetonated = wpn.ammo.length > 0 && $scope.radioCount > 0;
        $scope.programmable = wpn.ammo.length > 0 && $scope.programCount > 0;
        $scope.impactFused = wpn.ammo.length > 0 && $scope.impactCount > 0;
        $scope.harm = wpn.ammo.length > 0 && $scope.harmCount > 0;
        $scope.highVelocity = wpn.ammo.length > 0 && $scope.highVelCount > 0;


        $scope.showAllAmmo = function() {
            $scope.ammo = $scope.allAmmo;
        };
        $scope.hideAllAmmo = function() {
            $scope.ammo = $scope.ammo.slice(0,model.currentWeapon.weapon.abbv === 'MD' ? 3 : 5);
        };
        if($scope.ammo.length > 5) {
            $scope.allAmmo = $scope.ammo;
            $scope.hideAllAmmo();
        }
        $scope.noGrenades = function(name) {
            return name.replace(/ Grenades$/, '');
        };

        var ammoOptions = function() {
            return {
                laserGuided: $scope.laserGuided,
                tracer: $scope.tracer,
                proximityFused: $scope.proximityFused,
                radioDetonated: $scope.radioDetonated,
                programmable: $scope.programmable,
                impactFused: $scope.impactFused,
                harm: $scope.harm,
                highVelocity: $scope.highVelocity
            };
        };

        $scope.increaseCount = function() {
            var weapon = model.currentWeapon.weapon;
            var shots, cost = weapon.totalCost(), weight = weapon.totalWeight();
            if(vehicle.hasSpaceForAnotherWeapon(model.currentWeapon)) {
                vehicle.increaseWeaponCount(model.currentWeapon);
                update();
                model.increaseWeaponCount(model.currentWeapon);
                cost = weapon.totalCost() - cost;
                weight = weapon.totalWeight() - weight;
                shots = weapon.ammoTotal();
                if (weapon.isSingleShotRocket()) { // TODO: mention links?
                    $scope.showMessage("Added " + weapon.name + " launcher with " + shots + " shot" + (shots === 1 ? "" : "s") + " for $" + cost + ", " + weight + " lbs." + (shots === 1 && !vehicle.isRocketPlatform(model.currentWeapon) ? " Increase ammo to add a Rocket Magazine." : ""));
                } else {
                    $scope.showMessage("Added " + weapon.name + (shots > 0 ? " with " + shots + " shot" + (shots === 1 ? "" : "s") : "") + " for $" + cost + ", " + weight + " lbs.");
                }
            }
        };
        $scope.decreaseCount = function() {
            if(model.currentWeapon.weapon.count > 1) {
                vehicle.decreaseWeaponCount(model.currentWeapon);
                model.decreaseWeaponCount(model.currentWeapon);
                update();
            } else {
                if(vehicle.removeWeapon(model.currentWeapon)) {
                    model.removeWeapon(model.currentWeapon);
                    model.currentWeapon.weapon = null;
                    if (model.currentWeapon.isTurret()) {
                        model.currentTurret = vehicle.getTurret(model.currentWeapon);
                        $scope.openScreen('turret');
                    } else {
                        $scope.openScreen('weaponLocation');
                    }
                } else {
                    $scope.alert("Unable to remove weapon.  Sorry.");
                }
            }
        };
        $scope.increaseAmmo = function(ammo) {
            if(vehicle.canAddAmmo(model.currentWeapon, 1)) {
                vehicle.addAmmo(model.currentWeapon, ammo, 1, ammoOptions());
                update();
                model.redraw();
            }
        };
        $scope.decreaseAmmo = function(ammo) {
            vehicle.removeAmmo(model.currentWeapon, ammo, 1);
            update();
            model.redraw();
        };
        $scope.removeAmmo = function(ammo) {
            vehicle.removeAllAmmo(model.currentWeapon, ammo);
            update();
            model.redraw();
        };
        $scope.addClip = function(ammo) {
            if(vehicle.canAddAmmo(model.currentWeapon, model.currentWeapon.weapon.shots)) {
                vehicle.addAmmo(model.currentWeapon, ammo, model.currentWeapon.weapon.shots, ammoOptions());
                update();
                model.redraw();
            }
        };
        $scope.updateAmmo = function(name) {
            var wpn = model.currentWeapon.weapon;
            var on = $scope[name];
            var changed = false;
            for(var i=wpn.ammo.length-1; i >= 0; i--) {
                // Assumes higher index has options enabled TODO invalid for multiple options?  5 PF + 5 PF/RD turn off PF?
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
        $scope.adjustAmmoCount = function(type) {
            model.currentAmmoModifier = type;
            model.currentAmmoModifierName = type.substr(0,1).toUpperCase()+type.substr(1).replace(/[A-Z]/, ' $&');
            $scope.openScreen('ammo');
        };

        $scope.setFake = function() {
            var wpn = model.currentWeapon.weapon;
            if(wpn.fake !== $scope.fake) {
                wpn.setFake($scope.fake, vehicle.car);
                model.redraw();
            }
        };
        $scope.updateWeapon = function(name) {
            var wpn = model.currentWeapon.weapon;
            var on = $scope[name];
            if(wpn[name] !== on) {
                wpn[name] = on;
                vehicle.recalculate();
                update();
            }
        };
        $scope.nextComponentArmor = function() {
            vehicle.nextComponentArmor(model.currentWeapon.weapon);
            model.redraw();
            update();
        };
        $scope.previousComponentArmor = function() {
            vehicle.previousComponentArmor(model.currentWeapon.weapon);
            model.redraw();
            update();
        };

        $scope.changeCAType = function() {
            model.currentArmor = wpn.componentArmor;
            model.currentArmorItemName = "Weapon ("+wpn.abbv+")";
            model.currentArmorSource = "weapon";
            $scope.openScreen("armorType");
        };

        $scope.$watch('techLevel', function(newValue, oldValue) {
            if(newValue !== oldValue) update();
        });
    });
