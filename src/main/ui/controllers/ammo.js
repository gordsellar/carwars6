/* global angular, CW */
angular.module('carwars').
    controller('AmmoCtrl', function($scope, $window, vehicle, model) {
        "use strict";

        var wpn = model.currentWeapon.weapon;
        var modifier = model.currentAmmoModifier;
        $scope.weapon = (wpn.count > 1 ? wpn.count+" " : "")+wpn.abbv+" "+vehicle.locationName(model.currentWeapon);
        $scope.modifierName = model.currentAmmoModifierName;

        var update = function() {
            var i, entry, tag;
            var found = {};
            $scope.ammo = [];
            for(i=0; i<wpn.ammo.length; i++) {
                tag = wpn.ammo[i].name.replace(/[ -]/, "");
                if(found[tag]) {
                    found[tag].total += wpn.ammo[i].shots;
                    if(wpn.ammo[i][modifier]) found[tag].count += wpn.ammo[i].shots;
                } else {
                    entry = {
                        total: wpn.ammo[i].shots,
                        count: wpn.ammo[i][modifier] ? wpn.ammo[i].shots: 0,
                        ammo: wpn.ammo[i],
                        tag: tag
                    };
                    found[tag] = entry;
                    $scope.ammo.push(entry);
                }
            }
            $scope.ammo.sort(function(a, b) {
                if(a.ammo.name > b.ammo.name) return 1;
                if(a.ammo.name < b.ammo.name) return -1;
                return 0;
            });
        };
        update();

        $scope.decreaseShots = function(ammo) {
            // TODO: support 6 Prox+Radio & 4 plain and subtract 1 Prox to make 5 PFRD/1 RD/4 plain
            var i, working = [];
            for(i=0; i<wpn.ammo.length; i++)
                if(wpn.ammo[i].name === ammo.name)
                    working.push({ammo: wpn.ammo[i], index: i});
            for(i=working.length-1; i>= 0; i--) {
                if(working[i].ammo[modifier]) {
                    var options = vehicle.getAmmoOptions(working[i].ammo);
                    // Remove one shot with the modifier
                    if(working[i].ammo.shots === 1) {
                        wpn.ammo.splice(working[i].index, 1);
                    } else {
                        working[i].ammo.shots -= 1;
                    }
                    // Add one shot without the modifier
                    if(i === working.length-1) {
                        var created = CW.createAmmo(wpn, ammo, 1);
                        for(var name in options) {
                            if(options.hasOwnProperty(name) && options[name] && name !== modifier) {
                                created[name] = true;
                            }
                        }
                        wpn.ammo.push(created);
                    } else {
                        working[i+1].ammo.shots += 1;
                    }
                    break;
                }
            }
            vehicle.recalculate();
            update();
        };

        $scope.increaseShots = function(ammo) {
            var i, working = [];
            for(i=0; i<wpn.ammo.length; i++)
                if(wpn.ammo[i].name === ammo.name)
                    working.push({ammo: wpn.ammo[i], index: i});
            for(i=0; i<working.length; i++) {
                if(!working[i].ammo[modifier]) {
                    var options = vehicle.getAmmoOptions(working[i].ammo);
                    // Remove one shot without the modifier
                    if(working[i].ammo.shots === 1)
                        wpn.ammo.splice(working[i].index, 1);
                    else
                        working[i].ammo.shots -= 1;
                    // Add one shot with the modifier
                    if(i === 0) {
                        var created = CW.createAmmo(wpn, ammo, 1);
                        for(var name in options) {
                            if(options.hasOwnProperty(name) && options[name] && name !== modifier) {
                                created[name] = true;
                            }
                        }
                        created[modifier] = true;
                        wpn.ammo.splice(0, 0, created);
                    } else {
                        working[i-1].ammo.shots += 1;
                    }
                    break;
                }
            }
            vehicle.recalculate();
            update();
        };
    });
