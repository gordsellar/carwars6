/*
 Car Wars is a trademark of Steve Jackson Games, and its rules and art are copyrighted by Steve Jackson Games.
 All rights are reserved by Steve Jackson Games.

 This game aid is the original creation of Aaron Mulder and is released for free distribution, and not for resale,
 under the permissions granted in the Steve Jackson Games Online Policy.

 Application code for this game aid (except for the Car Wars rules as noted above) copyright 2013 Aaron Mulder.
 */
/* global CW */

(function() {
    "use strict";

    CW.copyObject = function (a, b, ignore) {
        var i;
        for (i in b) {
            if (b.hasOwnProperty(i)) {
                if (!ignore || !ignore.hasOwnProperty(i)) {
                    a[i] = b[i];
                }
            }
        }
    };

    CW.importFixWeapons = function (list) {
        var i, j, k, ammo;
        for (i = 0; i < list.length; i++) {
            for (j = 0; j < list[i].ammo.length; j++) {
                if (list[i].ammo[j].damage === ' ') {
                    ammo = CW.weapons[list[i].abbv + "_ammo"];
                    for (k = 0; k < ammo.length; k++) {
                        if (ammo[k].name === list[i].ammo[j].name) {
                            list[i].ammo[j].damage = ammo[k].damage;
                            break;
                        }
                    }
                }
            }
        }
    };
    CW.importFixHandWeapons = function (list) {
        var i, gun, ammo;
        for (i = 0; i < list.length; i++) {
            if (list[i].toHit !== ' ') continue;
            gun = CW.handWeapons[list[i].abbv];
            if (!gun) gun = CW.handGrenades[list[i].abbv];
            list[i].toHit = gun.toHit;
            list[i].shots = gun.shots;
            list[i].damageType = gun.damageType;
            if (gun.hasOwnProperty('damage')) list[i].damage = gun.damage;
            list[i].cost = gun.cost;
            list[i].weight = gun.weight;
            if (list[i].shots > 0 && list[i].ammo.length === 0) {
                ammo = CW.handWeapons[list[i].abbv + "_ammo"];
                if (ammo) {
                    list[i].ammo.push(CW.createAmmo(list[i], ammo[0], list[i].shots));
                }
            }
        }
    };
    var fixSideWeaponLinks = function(car, turret) {
        var i, tl, tr;
        tl = turret.linkableWeapons(true);
        tr = turret.linkableWeapons(false);
        for(i=0; i<turret.weapons.length; i++) {
            if(turret.weapons[i].linked) {
                delete turret.weapons[i].linked;
                car.createWeaponLink(tl[i]);
                car.createWeaponLink(tr[i]);
            }
        }
    };
    CW.importFixWeaponLinks = function (car) {
        var i, list = car.linkableWeapons();
        for (i = 0; i < list.length; i++) {
            if (list[i].linked) {
                delete list[i].linked;
                car.createWeaponLink(list[i], true);
            }
        }
        if(car.sideTurret) fixSideWeaponLinks(car, car.sideTurret);
        if(car.isOversize() && car.sideBackTurret) fixSideWeaponLinks(car, car.sideBackTurret);
    };

    CW.importCar = function (car, json) {
        var i, temp, j, list;
        // Blow away all the properties of the car
        CW.copyObject(car, json, {designId: 0, powerPlantList: 0, carrier: 0});
        // v5 import fix (changed property names):
        if ('convertableHardtop' in json) {
            car.convertibleHardtop = car.convertableHardtop;
            delete car.convertableHardtop;
        }
        if(json.designId === 701314512424201) car.techLevel = "Military";
        // Then go back and fix the ones that are supposed to be objects
        if (car.type === 'Car') {
            car.body = CW.findByName(CW.carBody, car.body.name);
            car.suspension = CW.findByName(CW.carSuspension, car.suspension.name);
        } else if (car.type === 'Cycle') {
            car.body = CW.findByName(CW.cycleBody, car.body.name);
            car.suspension = CW.findByName(CW.cycleSuspension, car.suspension.name);
        } else if (car.type === 'Trike') {
            car.body = CW.findByName(CW.trikeBody, car.body.name);
            car.suspension = CW.findByName(CW.cycleSuspension, car.suspension.name);
        } else if (car.type === 'CarTrailer') {
            car.body = CW.findByName(CW.carTrailerBody, car.body.name);
            car.suspension = CW.findByName(CW.carSuspension, car.suspension.name);
        } else if (car.type === 'SemiTractor') {
            car.body = CW.findByName(CW.semiTractorBody, car.body.name);
            car.suspension = CW.findByName(CW.carSuspension, car.suspension.name);
        } else if (car.type === 'SemiTrailer') {
            car.body = CW.findByName(CW.semiTrailerBody, car.body.name);
            car.suspension = CW.findByName(CW.carSuspension, car.suspension.name);
        } else if (car.type === 'Bus') {
            car.body = CW.findByName(CW.busBody, car.body.name);
            car.suspension = CW.findByName(CW.carSuspension, car.suspension.name);
        } else if (car.type === 'TenWheeler') {
            car.body = CW.findByName(CW.tenWheelerBody, car.body.name);
            car.suspension = CW.findByName(CW.carSuspension, car.suspension.name);
        } else if (car.type === 'TenWheelerCarrier') {
            car.body = CW.findByName(CW.tenWheelerCarrierBody, car.body.name);
            car.suspension = CW.findByName(CW.carSuspension, car.suspension.name);
        }
        car.chassis = CW.findByName(CW.chassis, car.chassis.name);
        if (car.engine) {
            if (car.engine.electric) {
                CW.importPowerPlant(car);
            } else if (car.engine.truck) {
                CW.importTruckEngine(car);
            } else {
                CW.importObject(car, 'engine', 'GasEngine');
            }
            if (car.engine.hasOwnProperty('laserBattery')) {
                car.engine.laserBatteries = car.engine.laserBattery ? 1 : 0;
                delete car.engine.laserBattery;
            }
        }
        for (i = 0; i < car.crew.length; i++)
            CW.importCrew(car.crew, i);
        if (car.crewCompartmentCA) {
            temp = car.crewCompartmentCA;
            car.crewCompartmentCA = CW.createComponentArmor(car.crew, car.type);
            CW.copyObject(car.crewCompartmentCA, temp, {item: 0});
            car.crewCompartmentCA.plasticType = car.crewCompartmentCA.plasticType ? CW.findByName(CW.armor, car.crewCompartmentCA.plasticType.name) : null;
            car.crewCompartmentCA.metalType = car.crewCompartmentCA.metalType ? CW.findByName(CW.armor, car.crewCompartmentCA.metalType.name) : null;
        }
        CW.importObject(car, 'gasTank', 'GasTank');
        CW.importObject(car, 'frontTires', 'Tire');
        CW.importObject(car, 'backTires', 'Tire');
        CW.importObject(car, 'middleOrOuterTires', 'Tire');
        CW.importArmor(car, 'frontArmor');
        CW.importArmor(car, 'backArmor');
        CW.importArmor(car, 'leftArmor');
        CW.importArmor(car, 'rightArmor');
        CW.importArmor(car, 'topArmor');
        CW.importArmor(car, 'underbodyArmor');
        if (car.flatbedArmor) CW.importArmor(car, 'flatbedArmor');
        for (i = 0; i < car.frontWeapons.length; i++) CW.importWeapon(car.frontWeapons, i);
        for (i = 0; i < car.backWeapons.length; i++) CW.importWeapon(car.backWeapons, i);
        for (i = 0; i < car.leftWeapons.length; i++) CW.importWeapon(car.leftWeapons, i);
        for (i = 0; i < car.rightWeapons.length; i++) CW.importWeapon(car.rightWeapons, i);
        for (i = 0; i < car.topWeapons.length; i++) CW.importWeapon(car.topWeapons, i);
        for (i = 0; i < car.underbodyWeapons.length; i++) CW.importWeapon(car.underbodyWeapons, i);
        for (i = 0; i < car.frontLeftWeapons.length; i++) CW.importWeapon(car.frontLeftWeapons, i);
        for (i = 0; i < car.frontRightWeapons.length; i++) CW.importWeapon(car.frontRightWeapons, i);
        for (i = 0; i < car.backLeftWeapons.length; i++) CW.importWeapon(car.backLeftWeapons, i);
        for (i = 0; i < car.backRightWeapons.length; i++) CW.importWeapon(car.backRightWeapons, i);
        CW.importObject(car, 'topTurret', 'Turret');
        if (car.topTurret) {
            if (car.topTurret.gunner) {
                CW.importCrew(car.topTurret, 'gunner');
                car.topTurret.gunner.cupola = true;
            }
            for (i = 0; i < car.topTurret.weapons.length; i++) {
                CW.importWeapon(car.topTurret.weapons, i, car.topTurret);
                car.topTurret.weapons[i].location = 'topTurret';
            }
            CW.importBoosters(car.topTurret, 'boosters');
            if (car.topTurret.armor) CW.importArmor(car.topTurret, 'armor');
        }
        if(car.leftTurret) {
            CW.importObject(car, 'leftTurret', 'Turret');
            if (car.leftTurret) {
                car.leftTurret.side = true;
                if (car.leftTurret.gunner) CW.importCrew(car.leftTurret, 'gunner');
                for (i = 0; i < car.leftTurret.weapons.length; i++) {
                    CW.importWeapon(car.leftTurret.weapons, i, car.leftTurret);
                    car.leftTurret.weapons[i].location = 'sideTurret';
                }
                CW.importBoosters(car.leftTurret, 'boosters');
                if (car.leftTurret.armor) CW.importArmor(car.leftTurret, 'armor');
            }
            car.sideTurret = car.leftTurret;
            delete car.leftTurret;
            delete car.rightTurret;
        } else if(car.sideTurret) {
            CW.importObject(car, 'sideTurret', 'Turret');
            if (car.sideTurret) {
                car.sideTurret.side = true;
                if (car.sideTurret.gunner) CW.importCrew(car.sideTurret, 'gunner');
                for (i = 0; i < car.sideTurret.weapons.length; i++) {
                    CW.importWeapon(car.sideTurret.weapons, i, car.sideTurret);
                    car.sideTurret.weapons[i].location = 'sideTurret';
                }
                CW.importBoosters(car.sideTurret, 'boosters');
                if (car.sideTurret.armor) CW.importArmor(car.sideTurret, 'armor');
            }
        }
        if (car.isOversize()) {
            CW.importArmor(car, 'leftBackArmor');
            CW.importArmor(car, 'rightBackArmor');
            CW.importArmor(car, 'topBackArmor');
            CW.importArmor(car, 'underbodyBackArmor');
            if (car.flatbedBackArmor) CW.importArmor(car, 'flatbedBackArmor');
            for (i = 0; i < car.leftBackWeapons.length; i++) CW.importWeapon(car.leftBackWeapons, i);
            for (i = 0; i < car.rightBackWeapons.length; i++) CW.importWeapon(car.rightBackWeapons, i);
            for (i = 0; i < car.topBackWeapons.length; i++) CW.importWeapon(car.topBackWeapons, i);
            for (i = 0; i < car.underbodyBackWeapons.length; i++) CW.importWeapon(car.underbodyBackWeapons, i);
            CW.importObject(car, 'topBackTurret', 'Turret');
            if (car.topBackTurret) {
                if (car.topBackTurret.gunner) {
                    CW.importCrew(car.topBackTurret, 'gunner');
                    car.topBackTurret.gunner.cupola = true;
                }
                for (i = 0; i < car.topBackTurret.weapons.length; i++) {
                    CW.importWeapon(car.topBackTurret.weapons, i, car.topBackTurret);
                    car.topBackTurret.weapons[i].location = 'topBackTurret';
                }
                CW.importBoosters(car.topBackTurret, 'boosters');
                if (car.topBackTurret.armor) CW.importArmor(car.topBackTurret, 'armor');
            }
            CW.importObject(car, 'leftBackTurret', 'Turret');
            if (car.leftBackTurret) {
                car.leftBackTurret.side = true;
                if (car.leftBackTurret.gunner) CW.importCrew(car.leftBackTurret, 'gunner');
                for (i = 0; i < car.leftBackTurret.weapons.length; i++) {
                    CW.importWeapon(car.leftBackTurret.weapons, i, car.leftBackTurret);
                    car.leftBackTurret.weapons[i].location = 'sideBackTurret';
                }
                CW.importBoosters(car.leftBackTurret, 'boosters');
                if (car.leftBackTurret.armor) CW.importArmor(car.leftBackTurret, 'armor');
                car.sideBackTurret = car.leftBackTurret;
                delete car.leftBackTurret;
            } else if(car.sideBackTurret) {
                car.sideBackTurret.side = true;
                if (car.sideBackTurret.gunner) CW.importCrew(car.sideBackTurret, 'gunner');
                for (i = 0; i < car.sideBackTurret.weapons.length; i++) {
                    CW.importWeapon(car.sideBackTurret.weapons, i, car.sideBackTurret);
                    car.sideBackTurret.weapons[i].location = 'sideBackTurret';
                }
                CW.importBoosters(car.sideBackTurret, 'boosters');
                if (car.sideBackTurret.armor) CW.importArmor(car.sideBackTurret, 'armor');
            }
        } else {
            if (car.leftBackArmor) car.leftBackArmor = null;
            if (car.rightBackArmor) car.rightBackArmor = null;
            if (car.topBackArmor) car.topBackArmor = null;
            if (car.underbodyBackArmor) car.underbodyBackArmor = null;
            if (car.flatbedBackArmor) car.flatbedBackArmor = null;
            if (car.leftBackWeapons) car.leftBackWeapons = [];
            if (car.rightBackWeapons) car.rightBackWeapons = [];
            if (car.topBackWeapons) car.topBackWeapons = [];
            if (car.underbodyBackWeapons) car.underbodyBackWeapons = [];
            if (car.topBackTurret) car.topBackTurret = null;
            if (car.leftBackTurret) delete car.leftBackTurret;
            if (car.rightBackTurret) delete car.rightBackTurret;
            if (car.sideBackTurret) car.sideBackTurret = null;
        }

        for (i = 0; i < car.passengers.length; i++)
            CW.importCrew(car.passengers, i);
        car.spareTires = [];
        for (i = car.accessories.length-1; i >= 0; i--) {
            temp = car.accessories[i];
            if (temp.type === 'Tire' || temp.hasOwnProperty('steelbelted')) {
                CW.importObject(car.accessories, i, 'Tire');
                CW.configureSpareTire(car.accessories[i]);
                car.spareTires.push(car.accessories[i]);
            } else {
                // v5 import fix:
                if(temp.name === 'Improved Fire Ext.') temp.name = "Improved Fire Extinguisher";
                else if(temp.name === 'Stealth (Car)') temp.name = "Stealth";
                else if(temp.name === 'ATAD (1 weapon)') temp.name = "ATAD";
                else if(temp.name === 'Side Door') temp.name = "Right Side Door";
                else if(temp.name === 'Comp. Gunner Software') temp.name = "Computer Gunner Software";
                else if(temp.name === 'Holocube') temp.name = "Camera Holocube";
                else if(temp.name === 'Armored Beer Fridge') temp.name = "Armored Beer Refrigerator";
                else if(temp.name === 'Fake C/T Carrier w/E.B.') temp.name = "Fake Car Top Carrier w/E.B.";
                else if(temp.name === 'Camera (Veh., 2 cubes)' || temp.name === 'Camera (Vehicular)') {
                    car.topWeapons.push(CW.createWeapon("VC", "Top"));
                    car.accessories.splice(i, 1);
                    continue;
                }
                car.accessories[i] = CW.createAccessory(CW.findByName(CW.accessories, temp.name, car.type));
                if(!('cost' in car.accessories[i])) throw "Unknown Accessory '"+temp.name+"'";
            }
            CW.copyObject(car.accessories[i], temp, {category: true, cost: true, weight: true, space: true, dp: true, linkable: true, cargo: true});
        }
        CW.importWheelArmor(car, 'frontWheelguards');
        CW.importWheelArmor(car, 'backWheelguards');
        CW.importWheelArmor(car, 'middleWheelguards');
        CW.importWheelArmor(car, 'frontWheelhubs');
        CW.importWheelArmor(car, 'backWheelhubs');
        CW.importWheelArmor(car, 'middleWheelhubs');
        if (car.sidecar) {
            CW.importSidecar(car);
        }
        if (car.windshell) {
            temp = car.windshell;
            car.windshell = CW.createWindshell(car);
            car.windshell.armor = temp.armor;
            CW.importArmor(car.windshell, 'armor');
        }
        if (car.windjammer) {
            temp = car.windjammer;
            car.windjammer = CW.createWindjammer();
            car.windjammer.retractable = temp.retractable;
            car.windjammer.armor = temp.armor;
            CW.importArmor(car.windjammer, 'armor');
        }
        if (car.fifthWheelArmor) CW.importArmor(car, 'fifthWheelArmor');
        if (car.carrier && json.carrier) {
            CW.importCar(car.carrier, json.carrier);
            car.carrier.cab = car;
            car.carrier.techLevel = car.techLevel;
        }
        CW.importBoosters(car, 'boosters');
        CW.importLinks(car, car.links, false);
        CW.importLinks(car, car.smartLinks, true);
        CW.importHitch(car);
        CW.importFixWeapons(car.frontWeapons);
        CW.importFixWeapons(car.leftWeapons);
        CW.importFixWeapons(car.rightWeapons);
        CW.importFixWeapons(car.backWeapons);
        CW.importFixWeapons(car.topWeapons);
        CW.importFixWeapons(car.underbodyWeapons);
        if (car.topTurret) CW.importFixWeapons(car.topTurret.weapons);
        if (car.sideTurret) CW.importFixWeapons(car.sideTurret.weapons);
        if(car.isOversize()) {
            CW.importFixWeapons(car.leftBackWeapons);
            CW.importFixWeapons(car.rightBackWeapons);
            CW.importFixWeapons(car.topBackWeapons);
            CW.importFixWeapons(car.underbodyBackWeapons);
            if (car.topBackTurret) CW.importFixWeapons(car.topBackTurret.weapons);
            if (car.sideBackTurret) CW.importFixWeapons(car.sideBackTurret.weapons);
        }
        // v5 import fix:
        CW.importFixWeaponLinks(car);
        if(!car.appearance.colorScheme) car.appearance.colorScheme = {mainColor: '#AA2222'};
        if(car.type === 'SemiTrailer' && car.isDualFlatbed()) {
            if(!car.upperFlatbedArmor) {
                car.upperFlatbedArmor = CW.createArmor(0, 0);
                car.upperFlatbedBackArmor = CW.createArmor(0, 0);
                car.upperFlatbedArmor.plasticType = car.frontArmor.plasticType;
                car.upperFlatbedArmor.metalType = car.frontArmor.metalType;
                car.upperFlatbedBackArmor.plasticType = car.frontArmor.plasticType;
                car.upperFlatbedBackArmor.metalType = car.frontArmor.metalType;
            }
        }
        // v5: Override the original tech level with the tech level saved during stock car review
        if (car.stock_tech_level) {
            car.techLevel = car.stock_tech_level;
            delete car.stock_tech_level;
        }
        // Fix various limitations in the designs imported from the old designer
        if (car.techLevel === 'CWC_2_5') car.techLevel = 'CWC';

        car.recalculate();

        return car;
    };

    CW.importLinks = function(car, links, smart) {
        var i, j, list, temp;
        for (i = 0; i < links.length; i++) {
            temp = links[i];
//            console.log(JSON.stringify(temp));
            links[i] = CW.createLink(car, smart);
            for (j = 0; j < temp.items.length; j++) {
                if (typeof temp.items[j] === 'string') {
                    links[i].items.push(temp.items[j]);
                } else if (temp.items[j].index > -1) {
                    if (temp.items[j].type === 'Accessory') {
                        if (temp.items[j].sidecar) {
                            links[i].items.push(car.sidecar.accessories[temp.items[j].index]);
                        } else if (temp.items[j].carrier) {
                            links[i].items.push(car.carrier.accessories[temp.items[j].index]);
                        } else {
                            links[i].items.push(car.accessories[temp.items[j].index]);
                        }
                    } else if (temp.items[j].type === 'Weapon') {
                        if(/(left|right)(Back)?Turret/.test(temp.items[j].location)) {
                            if(!car.hasOversizeWeaponFacings()) continue;
                            temp.items[j].leftSide = /left/.test(temp.items[j].location);
                            temp.items[j].location = temp.items[j].location.replace(/left|right/, "side");
                        } else if(!car.hasOversizeWeaponFacings() && (temp.items[j].location === 'topBackTurret' ||
                            temp.items[j].location === 'sideBackTurret' ||
                            temp.items[j].location === 'leftBack' ||
                            temp.items[j].location === 'rightBack' ||
                            temp.items[j].location === 'topBack' ||
                            temp.items[j].location === 'underbodyBack')) continue;
                        if (temp.items[j].sidecar) {
                            if (temp.items[j].location)
                                list = car.sidecar[temp.items[j].location.substr(0, 1).toLowerCase() + temp.items[j].location.substring(1) + "Weapons"];
                            else
                                continue;
                            if (!list) {
                                if(temp.items[j].location === 'turret') temp.items[j].location = 'topTurret';
                                list = car.sidecar[temp.items[j].location].weapons;
                            }
                        } else if (temp.items[j].carrier) {
                            if (temp.items[j].location)
                                list = car.carrier[temp.items[j].location.substr(0, 1).toLowerCase() + temp.items[j].location.substring(1) + "Weapons"];
                            else
                                continue;
                            if (!list) {
                                if('leftSide' in temp.items[j])
                                    list = car.carrier[temp.items[j].location].linkableWeapons(temp.items[j].leftSide);
                                else list = car.carrier[temp.items[j].location].weapons;
                            }
                        } else {
                            list = car[temp.items[j].location.substr(0, 1).toLowerCase() + temp.items[j].location.substring(1) + "Weapons"];
                            if (!list) {
                                if('leftSide' in temp.items[j])
                                    list = car[temp.items[j].location].linkableWeapons(temp.items[j].leftSide);
                                else list = car[temp.items[j].location].weapons;
                            }
                        }
                        links[i].items.push(list[temp.items[j].index]);
                    } else if (temp.items[j].type === 'Booster') { // TODO: boosters in carrier
                        if(/(left|right)(Back)?Turret/.test(temp.items[j].location)) temp.items[j].location = temp.items[j].location.replace(/left|right/, "side");
                        if (temp.items[j].location) {
                            list = car[temp.items[j].location].boosters;
                            links[i].items.push(list[temp.items[j].index]);
                        } else {
                            links[i].items.push(car.boosters[temp.items[j].index]);
                        }
                    }
                }
            }
        }
    };

    CW.configureSpareTire = function (tire) {
        var old = tire.textDescription;
        tire.textDescription = function () {
            return "Spare " + old() + " tire";
        };
    };

    CW.importCrew = function (object, index) {
        var j, temp;
        CW.importObject(object, index, 'Crew');
        for (j = 0; j < object[index].handWeapons.length; j++)
            CW.importHandWeapon(object[index].handWeapons, j);
        for (j = 0; j < object[index].gear.length; j++) {
            temp = object[index].gear[j];
            if(temp.name === 'Light Int. Gas Mask') temp.name = "Light Intensifier Gas Mask";
            object[index].gear[j] = CW.createPersonalGear(CW.findByName(CW.personalGear, temp.name));
            CW.copyObject(object[index].gear[j], temp);
        }
        CW.importFixHandWeapons(object[index].handWeapons);
        if (object[index].radioDetonator) object[index].addGear(CW.personalGear.RADIO_DETONATOR);
        delete object[index].radioDetonator;
    };

    CW.importHitch = function (car) {
        var temp = car.hitch;
        if (!temp) return;
        car.hitch = CW.createHitch(CW.findByName(CW.hitches, temp.name));
        CW.copyObject(car.hitch, temp);
        CW.importArmor(car.hitch, 'armor');
    };

    CW.importSidecar = function (car) {
        var i, j, temp = car.sidecar;
        car.sidecar = CW.createSidecar(car, CW.findByName(CW.sidecarBody, temp.name));
        CW.copyObject(car.sidecar, temp, {cycle: 0});
        car.sidecar.suspension = CW.findByName(CW.cycleSuspension, car.sidecar.suspension.name);
        for (i = 0; i < car.sidecar.crew.length; i++) {
            CW.importObject(car.sidecar.crew, i, 'Crew');
            for (j = 0; j < car.sidecar.crew[i].handWeapons.length; j++)
                CW.importHandWeapon(car.sidecar.crew[i].handWeapons, j);
        }
        for (i = 0; i < car.sidecar.passengers.length; i++) {
            CW.importObject(car.sidecar.passengers, i, 'Crew');
            for (j = 0; j < car.sidecar.passengers[i].handWeapons.length; j++)
                CW.importHandWeapon(car.sidecar.passengers[i].handWeapons, j);
        }
        // v5 import fix:
        for (i = car.sidecar.crew.length-1; i >= 0 ; i--) {
            if(car.sidecar.crew[i].name === 'Passenger') {
                car.sidecar.passengers.push(car.sidecar.crew[i]);
                car.sidecar.crew.splice(i, 1);
            }
        }
        for (i = 0; i < car.sidecar.accessories.length; i++) {
            temp = car.sidecar.accessories[i];
            car.sidecar.accessories[i] = CW.createAccessory(CW.findByName(CW.accessories, temp.name));
            CW.copyObject(car.sidecar.accessories[i], temp);
        }
        for (i = 0; i < car.sidecar.frontWeapons.length; i++) CW.importWeapon(car.sidecar.frontWeapons, i);
        for (i = 0; i < car.sidecar.backWeapons.length; i++) CW.importWeapon(car.sidecar.backWeapons, i);
        for (i = 0; i < car.sidecar.rightWeapons.length; i++) CW.importWeapon(car.sidecar.rightWeapons, i);
        CW.importObject(car.sidecar, 'tires', 'Tire');
        CW.importWheelArmor(car.sidecar, 'wheelguards');
        CW.importWheelArmor(car.sidecar, 'wheelhubs');
        CW.importArmor(car.sidecar, 'frontArmor');
        CW.importArmor(car.sidecar, 'backArmor');
        CW.importArmor(car.sidecar, 'leftArmor');
        CW.importArmor(car.sidecar, 'rightArmor');
        CW.importArmor(car.sidecar, 'topArmor');
        CW.importArmor(car.sidecar, 'underbodyArmor');
        CW.importObject(car.sidecar, 'turret', 'Turret');
        // v5 import fix:
        if (car.sidecar.turret) {
            car.sidecar.topTurret = car.sidecar.turret;
            delete car.sidecar.turret;
        }
        if (car.sidecar.topTurret) {
            for (i = 0; i < car.sidecar.topTurret.weapons.length; i++) {
                CW.importWeapon(car.sidecar.topTurret.weapons, i, car.sidecar.topTurret);
                car.sidecar.topTurret.weapons[i].location = "topTurret";
            }
        }
    };

    CW.importWeapon = function (list, index, turret) {
        var temp = list[index], aTemp, ammo;
//        if(/(left|right)(Back)?Turret/.test(temp.location)) temp.location = temp.location.replace(/left|right/, "side");
        if(!CW.weapons[temp.abbv]) throw "Unknown weapon "+temp.abbv;
        list[index] = CW.createWeapon(temp.abbv, temp.location, turret);
        CW.copyObject(list[index], temp, {techLevel: true});
        for (var i = 0; i < temp.ammo.length; i++) {
            aTemp = temp.ammo[i];
            // v5 import fix (changed names):
            if(aTemp.name === 'D.Cord Net Grenades') aTemp.name = 'Det-Cord Net Grenades';
            if(aTemp.name === 'Chem. Laser Grenades' || aTemp.name === 'Chm. Laser Grenades') aTemp.name = 'Chemical Laser Grenades';
            if(aTemp.name === 'White Phos. Grenades') aTemp.name = 'White Phosphorus Grenades';
            if(temp.abbv === 'SD') {
                if (aTemp.name === 'Normal') aTemp.name = 'Spikes';
                if (aTemp.name === 'Explosive') aTemp.name = 'Explosive Spikes';
            } else if(temp.abbv === 'MD' || temp.abbv === 'SMD' || temp.abbv === 'MF') {
                if (aTemp.name === 'Normal') aTemp.name = 'Mines';
                else if (aTemp.name === 'Napalm') aTemp.name = 'Napalm Mines';
                else if (aTemp.name === 'Spider') aTemp.name = 'Spider Mines';
                else if (aTemp.name === 'TDX') aTemp.name = 'TDX Mines';
            } else if(temp.abbv === 'GL' && !/Grenades$/.test(aTemp.name)) {
                aTemp.name += " Grenades";
            }
            ammo = CW.findByName(CW.weapons[temp.abbv + "_ammo"], aTemp.name);
            if(!ammo) throw "Unknown ammo type "+aTemp.name+" for weapon "+list[index].name;
            list[index].ammo[i] = CW.createAmmo(list[index], ammo, aTemp.shots);
            CW.copyObject(list[index].ammo[i], aTemp, {techLevel: true, name: true, abbv: true});
        }
        CW.importCA(list[index], temp);
    };

    CW.importHandWeapon = function (list, index) {
        var temp = list[index], aTemp, ammo;
        if(temp.abbv === 'White Phos. Grenade') temp.abbv = 'White Phosphorus Grenade';
        if(temp.abbv === 'D.Cord Net Grenade') temp.abbv = 'Det-Cord Net Grenade';
        if(temp.abbv === 'Chem. Laser Grenade' || temp.abbv === 'Chm. Laser Grenade') temp.abbv = 'Chemical Laser Grenade';
        if(!CW.handWeapons[temp.abbv] && !CW.handGrenades[temp.abbv]) throw "Unknown hand weapon '"+temp.abbv+"'";
        list[index] = CW.createHandWeapon(temp.abbv);
        CW.copyObject(list[index], temp, {techLevel: true, abbv: true, name: true});
        for (var i = 0; i < temp.ammo.length; i++) {
            aTemp = temp.ammo[i];
            ammo = CW.findByName(CW.handWeapons[temp.abbv + "_ammo"], aTemp.name);
            if(!ammo) throw "Unknown ammo type "+aTemp.name+" for hand weapon "+list[index].name;
            list[index].ammo[i] = CW.createAmmo(list[index], ammo, aTemp.shots);
            CW.copyObject(list[index].ammo[i], aTemp, {techLevel: true});
        }
    };

    CW.importObject = function (parent, property, type) {
        var temp = parent[property];
        if (!temp) return;
        parent[property] = CW['create' + type](temp.name);
        CW.copyObject(parent[property], temp);
        if (parent[property].hasOwnProperty('componentArmor')) {
            CW.importCA(parent[property], temp);
        }
    };

    CW.importBoosters = function (item, property) {
        var i, temp, list = item[property];
        for (i = 0; i < list.length; i++) {
            temp = list[i];
            list[i] = CW.createBooster(temp.jumpJet, temp.bottomOrRearFacing);
            list[i].weight = temp.weight;
            list[i].showFacing = temp.showFacing;
        }
    };

    CW.importPowerPlant = function (car) {
        var temp = car.engine;
        if (!temp) return;
        car.engine = CW.createPowerPlant(CW.findByName(car.powerPlantList, temp.name));
        CW.copyObject(car.engine, temp);
        CW.importCA(car.engine, temp);
    };

    CW.importTruckEngine = function (car) {
        var temp = car.engine;
        car.engine = CW.createGasEngine(temp);
        CW.copyObject(car.engine, temp);
        CW.importCA(car.engine, temp);
    };

    CW.importArmor = function (car, property) {
        var temp = car[property];
        if (!temp) return;
        car[property] = CW.createArmor(temp.plasticPoints, temp.metalPoints);
        car[property].plasticType = CW.findByName(CW.armor, temp.plasticType ? temp.plasticType.name : null);
        car[property].metalType = CW.findByName(CW.armor, temp.metalType ? temp.metalType.name : null);
    };

    CW.importWheelArmor = function (car, property) {
        var temp = car[property];
        if (!temp) return;
        car[property] = CW.createWheelArmor(null, null, temp.wheelhub);
        CW.copyObject(car[property], temp);
        car[property].plasticType = CW.findByName(CW.armor, temp.plasticType ? temp.plasticType.name : null);
        car[property].metalType = CW.findByName(CW.armor, temp.metalType ? temp.metalType.name : null);
        if (!car[property].plasticType && !car[property].metalType) car[property].plasticType = car.frontArmor.plasticType ? car.frontArmor.plasticType : CW.armor.plastic;
    };

    CW.importCA = function (component, json) {
        if (json.componentArmor) {
            component.componentArmor = CW.createComponentArmor(component, null);
            CW.copyObject(component.componentArmor, json.componentArmor, {item: 0});
            component.componentArmor.plasticType = CW.findByName(CW.armor, component.componentArmor.plasticType ? component.componentArmor.plasticType.name : null);
            component.componentArmor.metalType = CW.findByName(CW.armor, component.componentArmor.metalType ? component.componentArmor.metalType.name : null);
        }
    };
})();