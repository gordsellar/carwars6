/*
 Car Wars is a trademark of Steve Jackson Games, and its rules and art are copyrighted by Steve Jackson Games.
 All rights are reserved by Steve Jackson Games.

 This game aid is the original creation of Aaron Mulder and is released for free distribution, and not for resale,
 under the permissions granted in the Steve Jackson Games Online Policy.

 Application code for this game aid (except for the Car Wars rules as noted above) copyright 2013 Aaron Mulder.
 */

/* global CW, CWD */

(function() {
    "use strict";

    CW.versionOfExport = "$Revision: 1179 $";

    CW.exportDesign = function (car) {
        var context = {type: "pdf"};
        var data = [];
        var oldTransform = CWD.globalTransform;
        CWD.globalTransform = [1, 0, 0, 1, 0, 0];

        var getFill = function () {
            if (this.fillStyle === CWD.backgroundColor) return '#FFFFFF';
            if (this.fillStyle === CWD.dpFill) return '#DDDDDD';
            if (this.fillStyle === car.colorScheme.mainColor) return '#DDDDDD';
            return this.fillStyle;
        };

        context.moveTo = function (x, y) {
            data.push("moveTo " + x + " " + y);
        };
        context.lineTo = function (x, y) {
            data.push("lineTo " + x + " " + y);
        };
        context.fillRect = function (x, y, w, h) {
            data.push("fillRect " + x + " " + y + " " + w + " " + h + " " + getFill.apply(this));
        };
        context.strokeRect = function (x, y, w, h) {
            data.push("strokeRect " + x + " " + y + " " + w + " " + h);
        };
        context.rect = function (x, y, w, h) {
            data.push("rect " + x + " " + y + " " + w + " " + h);
        };
        context.beginPath = function () {
            data.push("beginPath");
        };
        context.closePath = function () {
            data.push("closePath");
        };
        context.stroke = function () {
            data.push("stroke");
        };
        context.fill = function () {
            data.push("fill " + getFill.apply(this));
        };
        context.quadraticCurveTo = function (cpx, cpy, finalx, finaly) {
            data.push("quadraticCurveTo " + cpx + " " + cpy + " " + finalx + " " + finaly);
        };
        context.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, finalx, finaly) {
            data.push("bezierCurveTo " + cp1x + " " + cp1y + " " + cp2x + " " + cp2y + " " + finalx + " " + finaly);
        };
        context.createLinearGradient = function (x1, y1, x2, y2) {
            data.push("createLinearGradient " + x1 + " " + y1 + " " + x2 + " " + y2);
            return null;
        };
        context.arc = function (centerx, centery, radius, startAngle, endAngle, anticlockwise) {
            data.push("arc " + centerx + " " + centery + " " + radius + " " + startAngle + " " + endAngle + " " + anticlockwise);
        };
        context.fillText = function (text, x, y) {
            data.push("fontSize " + this.font.substring(0, this.font.indexOf('px')));
            data.push("fillText '" + text + "' " + x + " " + y);
        };
        context.arcTo = function (intersectionx, intersectiony, endx, endy, radius) {
            data.push("arcTo " + intersectionx + " " + intersectiony + " " + endx + " " + endy + " " + radius);
        };
        context.measureText = function (text) {
            return null;
        };
        context.transform = function (a, b, c, d, e, f) {
            if ((a > 0 && b === 0 && c === 0 && d > 0) || (a !== 0 && b !== 0 && c !== 0 && d !== 0))
                data.push('transform ' + a + " " + b + " " + c + " " + d + " " + e + " " + f);
            else
                data.push('setTransform ' + a + " " + b + " " + c + " " + d + " " + e + " " + f);
        };
        context.setTransform = function (a, b, c, d, e, f) {
            data.push('setTransform ' + a + " " + b + " " + c + " " + d + " " + e + " " + f);
        };
        var width = car.bodyStyle.width(car);
        data.push("totalSize " + car.totalHeight + " " + width.width + " " + width.offset);
        car.drawLower(context, true);
        car.drawMiddle(context, true);
        car.drawUpper(context, true);

        CWD.globalTransform = oldTransform;

        return data.join("\n");
    };

    CW.exportStatistics = function (car, designId) {
        var out = {
            version: CW.latestRevision(),
            techLevel: car.techLevel,
            name: car.designName,
            body: car.body.name.replace("Standard", "Std.").replace("Sleeper", "Slp."),
            chassis: car.type === 'SemiTrailer' ? ' ' : car.chassis.name,
            suspension: car.type === 'CarTrailer' || car.type === 'SemiTractor' || car.type === 'SemiTrailer' || car.type === 'TenWheeler' ? ' ' : (car.body.racingFrame ? 'Racing' : car.suspension.name) + (car.activeSuspension ? " Active" : ""),
            cost: (car.totalCost + (car.sidecar ? car.sidecar.totalCost() : 0)) + "",
            weight: car.weightUsed - car.reservedWeight + (car.sidecar ? car.sidecar.totalWeight() : 0),
            topSpeed: car.type === 'CarTrailer' || car.type === 'SemiTrailer' ? ' ' : car.currentTopSpeed + '',
            acceleration: car.type === 'CarTrailer' || car.type === 'SemiTrailer' ? ' ' : car.displayAcceleration,
            loadedTopSpeed: car.type === 'CarTrailer' || car.type === 'SemiTrailer' ? ' ' : car.loadedTopSpeed + '',
            loadedAcceleration: car.type === 'CarTrailer' || car.type === 'SemiTrailer' ? ' ' : car.loadedAcceleration + '',
            handlingClass: car.type === 'CarTrailer' || car.type === 'SemiTrailer' ? ' ' : car.modifiedHandlingClass + '',
            cargoSpace: car.totalCargoSpace(),
            useGE: !car.personalEquipmentWeight,
            crew: [],
            passengers: car.passengerCount()
        };
        var range = car.range();
        if (range) out.range = range;
        if (designId) out.save_id = designId;
        var cargoWeight = car.totalCargoWeight();
        if (car.type === 'SemiTractor' || (out.cargoSpace > 0 && cargoWeight >= 20))
            out.cargoWeight = cargoWeight;
        if (car.sidecar) {
            var test = Math.round((car.sidecar.spaceAvailable() - car.sidecar.spaceUsed()) * 100) / 100;
            if (test > 0) {
                out.sidecarCargoSpace = test;
                test = Math.round(car.sidecar.maxWeight - car.sidecar.totalWeight());
                if (test > 0) out.sidecarCargoWeight = test;
            }
        }
        if (out.cost.length > 3) {
            out.cost = out.cost.substr(0, out.cost.length - 3) + "," + out.cost.substr(out.cost.length - 3);
        }
        var gunner = false;
        for (var i = 0; i < car.crew.length; i++) {
            if (car.crew[i].name !== 'Gunner') out.crew.push(car.crew[i].name);
            else if (!gunner) {
                out.crew.push("Gunner" + (car.gunnerCount() > 1 ? "s" : ""));
                gunner = true;
            }
        }
        return out;
    };

    CW.exportWorksheet = function (car) {
        var i, rows = [];

        var createRow = function (name, cost, weight, space, maxWeight, spaceAvailable, cargoSpaceAvailable) {
            rows.push({name: name, cost: cost, weight: weight, space: space,
                maxWeight: maxWeight, maxSpace: spaceAvailable,
                maxCargoSpace: cargoSpaceAvailable, vehicularSpace: true, cargo: false});
        };
        var createHandWeaponRow = function (weapon, includeWeight, vest, ignoreWeight) {
            createRow(weapon.count > 1 ? weapon.count+" "+weapon.name+"s" : weapon.name,
                    weapon.cost*weapon.count, includeWeight ? weapon.count*weapon.weight : 0, 0);
            rows[rows.length - 1].ge = weapon.ge * weapon.count;
            var adjust = 0;
            if (ignoreWeight) rows[rows.length - 1].ignoreWeight = true;
            if (vest) {
                if (weapon.isPistol() && vest.pistol < 1) {
                    rows[rows.length - 1].vehicularSpace = false;
                    vest.pistol += 1;
                } else if (weapon.isGrenade() && vest.grenade < 2) {
                    if(2-vest.grenade >= weapon.count) {
                        rows[rows.length - 1].vehicularSpace = false;
                        vest.grenade += weapon.count;
                    } else {
                        adjust = 2-vest.grenade;
                        vest.grenade += adjust;
                        rows[rows.length - 1].ge -= adjust;
                    }
                } else if (weapon.name === CW.handWeapons.BwK.name && vest.bowie < 1) {
                    rows[rows.length - 1].vehicularSpace = false;
                    vest.bowie += 1;
                }
            }
            if (weapon.impactFused) {
                createRow("Impact Fuse"+(weapon.count > 1 ? "s" : ""), weapon.count*50, 0, 0);
                rows[rows.length - 1].ge = 0;
            }
            if (weapon.extendedClips > 0) {
                createRow((weapon.extendedClips > 1 || weapon.count > 1 ? weapon.extendedClips + " Extended Clips" : "Extended Clip"),
                        80 * weapon.extendedClips*weapon.count, includeWeight ? Math.round(weapon.weight * 0.3 * weapon.extendedClips)*weapon.count : 0, 0);
                rows[rows.length - 1].ge = weapon.abbv === 'SMG' || weapon.abbv === 'GL' ? weapon.extendedClips*weapon.count : weapon.extendedClips*weapon.count / 2;
                if (ignoreWeight) rows[rows.length - 1].ignoreWeight = true;
                if (vest && (2-vest.magazine) >= weapon.count*weapon.extendedClips) { // TODO: split up rows if not enough space left in vest
                    rows[rows.length - 1].vehicularSpace = false;
                    vest.magazine += weapon.extendedClips*weapon.count;
                }
            }
            if (weapon.extraClips > 0) {
                createRow((weapon.extraClips > 1 || weapon.count > 1 ? weapon.extraClips + " Extra Clips" : "Extra Clip"),
                    50 * weapon.extraClips * weapon.count,
                    includeWeight ? Math.round(weapon.weight * 0.2 * weapon.extraClips)*weapon.count : 0, 0);
                rows[rows.length - 1].ge = weapon.abbv === 'SMG' || weapon.abbv === 'GL' ? weapon.extraClips*weapon.count : weapon.extraClips*weapon.count / 2;
                if (ignoreWeight) rows[rows.length - 1].ignoreWeight = true;
                if (vest && (2-vest.magazine) >= weapon.count*weapon.extraClips) { // TODO: split up rows if not enough space left in vest
                    rows[rows.length - 1].vehicularSpace = false;
                    vest.magazine += weapon.extraClips*weapon.count;
                }
            }
            if (weapon.foldingStock) {
                createRow("Folding Stock", 10*weapon.count, includeWeight ? weapon.isPistol() ? 3*weapon.count : -3*weapon.count : 0, 0);
                rows[rows.length - 1].ge = weapon.isPistol() ? weapon.count : -weapon.count;
                if (ignoreWeight) rows[rows.length - 1].ignoreWeight = true;
            }
            if (weapon.laserScope) {
                createRow("Laser Targeting Scope", 500*weapon.count, 0, 0);
                rows[rows.length - 1].ge = 0;
            }
            if (weapon.powerPack) {
                createRow("Power Backpack", 1000*weapon.count, includeWeight ? 30*weapon.count : 0, 0);
                rows[rows.length - 1].ge = 3*weapon.count;
                if (ignoreWeight) rows[rows.length - 1].ignoreWeight = true;
            }
            for (var a = 0; a < weapon.ammo.length; a++) {
                createRow(weapon.ammo[a].textDescription(),
                    Math.round(weapon.ammo[a].shots * weapon.ammo[a].modifiedCost())*weapon.count,
                    includeWeight ? Math.round(weapon.ammo[a].shots * weapon.ammo[a].modifiedWeight())*weapon.count : 0, 0);
                rows[rows.length - 1].ge = 0;
                if (ignoreWeight) rows[rows.length - 1].ignoreWeight = true;
            }
        };
        var createWeaponRow = function (weapon) {
            if (weapon.fake) {
                if (weapon.isDischarger())
                    createRow((weapon.count > 1 ? weapon.count + "x " : "") + "Fake " + weapon.name, weapon.count * 5, weapon.count * 5, 0);
                else
                    createRow((weapon.count > 1 ? weapon.count + "x " : "") + "Fake " + weapon.name, weapon.count * 100, weapon.count * 20, 0);
            } else {
                for (var w = 0; w < weapon.count; w++) {
                    if (weapon.totalCapacity() === 1 && weapon.ammoTotal() === 1) {
                        if (weapon.ammo[0].name === 'Normal' && !weapon.ammo[0].isModified()) {
                            createRow(weapon.name, weapon.cost + weapon.ammo[0].modifiedCost(),
                                    weapon.weight + weapon.ammo[0].weightPerShot, weapon.space);
                        } else {
                            createRow(weapon.ammo[0].modifiedName(weapon.ammo.length > 1) + " " + weapon.name,
                                    weapon.cost + Math.round(weapon.ammo[0].modifiedCost()),
                                    weapon.weight + Math.round(weapon.ammo[0].weightPerShot),
                                weapon.space);
                        }
                    } else {
                        createRow(weapon.name + (weapon.isSingleShotRocket() && weapon.space <= 1 ? " Launcher" : ""),
                            weapon.cost, weapon.weight, weapon.space);
                    }
                    if (!weapon.showLocation) rows[rows.length - 1].vehicularSpace = false;
                    if (weapon.isLaser()) {
                        if (weapon.infrared) createRow("Infrared Laser", weapon.cost, 0, 0);
                        if (weapon.pulse) createRow("Pulse Laser", Math.ceil(weapon.cost * 0.5 - 0.0001), 0, 0);
                        if (weapon.blueGreen) createRow("Blue-Green Laser", Math.ceil(weapon.cost * 0.25 - 0.0001), 0, 0);
                    }
                    if (weapon.concealment) {
                        createRow("Weapon Concealment", 250 * weapon.spaceForConcealment(), 50 * weapon.spaceForConcealment(), weapon.spaceForConcealment() > 2 ? 1 : 0);
                        if (!weapon.showLocation) rows[rows.length - 1].vehicularSpace = false;
                    }
                    if (weapon.blowThroughConcealment) createRow("Blow-through Concealment", 100, 10, 0);
                    if (weapon.extraMagazines) createRow((weapon.extraMagazines > 1 ? weapon.extraMagazines + " Extra Magazines" : "Extra Magazine"),
                            weapon.extraMagazines * 50, weapon.extraMagazines * 15, weapon.extraMagazines);
                    if (weapon.dualWeaponMagazines) createRow((weapon.dualWeaponMagazines > 1 ? weapon.dualWeaponMagazines + " Dual-Weapon Magazines" : "Dual-Weapon Magazine"),
                            weapon.dualWeaponMagazines * 150, weapon.dualWeaponMagazines * 50, weapon.dualWeaponMagazines);
                    if (weapon.rocketMagazine) createRow(weapon.rocketMagazine + "-space Rocket Magazine", weapon.rocketMagazine * 50, weapon.rocketMagazine * 15, weapon.rocketMagazine);
                    if (weapon.rotaryMagazine) createRow("Rotary Magazine", 500, 10, 0);
                    // Bumper trigger handled one-per-side on car
                    if (weapon.magazineSwitch) createRow("Magazine Switch", 250, 0, 0);
                    if (weapon.totalCapacity() !== 1 || weapon.ammoTotal() !== 1) {
                        for (var a = 0; a < weapon.ammo.length; a++) {
                            createRow(weapon.ammo[a].textDescription(),
                                Math.round(weapon.ammo[a].shots * weapon.ammo[a].modifiedCost()),
                                Math.round(weapon.ammo[a].shots * weapon.ammo[a].modifiedWeight()), 0);
                        }
                    }
                    if (weapon.fireRetardantInsulator) {
                        createRow("Fire-Retardant Insulator for " + weapon.abbv,
                                150 * (weapon.unarmoredSpace() - 1), 25 * (weapon.unarmoredSpace() - 1), 1);
                        if (!weapon.showLocation) rows[rows.length - 1].vehicularSpace = false;
                    }
                    if (weapon.laserGuidanceLink) createRow("Laser Guidance Link", 500, 0, 0);
                }
                if (weapon.componentArmor) {
                    createRow(weapon.componentArmor.textDescription() + " for " + weapon.abbv + (weapon.count > 1 ? "s" : ""),
                        weapon.componentArmor.totalCost(), weapon.componentArmor.totalWeight(),
                        weapon.componentArmor.totalSpace());
                    if (!weapon.showLocation) rows[rows.length - 1].vehicularSpace = false;
                }
            }
        };
        var createTurretRow = function (turret) {
            if (turret.fake) {
                createRow("Fake " + turret.name, 250, 50, 0);
            } else {
                if (turret.builtIn) {
                    createRow(turret.size + "-space " + turret.name, 0, 0, 0);
                } else {
                    createRow(turret.size + "-space " + turret.name,
                        turret.costBySize[turret.size],
                        turret.weightBySize[turret.size],
                        turret.spaceBySize[turret.size]);
                }
                if (turret.universal) createRow("Universal " + turret.name, 1000, 0, 0);
                if ((turret.name === CW.turrets.EWP.name || turret.name === CW.turrets.Pintle_Mount.name) && turret.armor)
                    createRow(turret.armor.textDescription() + (turret.name === CW.turrets.EWP.name ? ' EWP armor' : " Tripod Gunshield"),
                        turret.armor.totalCost(10), turret.armor.totalWeight(4), 0);
                if ((turret.name === CW.turrets.EWP.name || turret.name === CW.turrets.Rocket_EWP.name) && turret.ewpEjectionSystem)
                    createRow("EWP Ejection System", 250, 0, 0);
                for (i = 0; i < turret.boosters.length; i++) {
                    createRow(turret.boosters[i].totalWeight() + " lbs. " + (turret.boosters[i].jumpJet ? "Jump Jets" : "Rocket Boosters"), turret.boosters[i].totalCost(),
                        turret.boosters[i].totalWeight(), turret.boosters[i].totalSpace());
                    rows[rows.length - 1].vehicularSpace = false;
                }
                if (turret.gunner) createCrewRow(turret.gunner, false, false, true);
            }
            for (i = 0; i < turret.weapons.length; i++) {
                createWeaponRow(turret.weapons[i]);
            }
        };
        var processWeapons = function (weapons) {
            var trigger = null;
            for (var w = 0; w < weapons.length; w++) {
                createWeaponRow(weapons[w]);
                if (weapons[w].bumperTrigger && weapons[w].showLocation) trigger = weapons[w].location;
            }
            if (trigger) createRow("Bumper Trigger " + trigger, 50, 0, 0);
        };
        var createCrewRow = function (crew, cargo, firstCyclePassenger, cupolaGunner) {
            var i, bv = null;
            createRow(cupolaGunner ? "Cupola Gunner" : crew.name, 0, car.type === 'Bus' && crew.name === 'Passenger' ? 200 : 150, crew.name === 'Passenger' ? (car.type === 'Cycle' && firstCyclePassenger ? 0 :
                    car.type === 'SemiTractor' || car.type === 'SemiTrailer' || car.type === 'Bus' ? 2 : 1) : 2);
            var ignoreWeight = car.type === 'Bus' && crew.name === 'Passenger' && car.personalEquipmentWeight;
            if (cupolaGunner) rows[rows.length - 1].vehicularSpace = false;
            if (cargo && car.modifiedCargoSpaceAvailable > 0) rows[rows.length - 1].cargo = true;
            if (crew.singleWeaponComputer) createRow('Single-Weapon Computer', 500, 0, 0);
            if (crew.highResSingleWeaponComputer) createRow('High-Res Single-Weapon Computer', 2500, 0, 0);
            if (crew.targetingComputer) createRow('Targeting Computer', 1000, 0, 0);
            if (crew.highResComputer) createRow('High-Res Targeting Computer', 4000, 0, 0);
            if (crew.cyberlink) {
                createRow('Cyberlink', 16000, 100, 1);
                if (cupolaGunner) rows[rows.length - 1].vehicularSpace = false;
            }
            if (crew.bodyArmor) {
                createRow('Body Armor', 250, car.personalEquipmentWeight ? 10 : 0, 0);
                rows[rows.length - 1].ge = 0;
                if (ignoreWeight) rows[rows.length - 1].ignoreWeight = true;
            }
            if (crew.improvedBodyArmor) {
                createRow('Improved Body Armor', 1500, car.personalEquipmentWeight ? 25 : 0, 0);
                rows[rows.length - 1].ge = 0;
                if (ignoreWeight) rows[rows.length - 1].ignoreWeight = true;
            }
            if (crew.impactArmor) {
                createRow('Impact Armor', 2000, car.personalEquipmentWeight ? 25 : 0, 0);
                rows[rows.length - 1].ge = 0;
                if (ignoreWeight) rows[rows.length - 1].ignoreWeight = true;
            }
            if (crew.fireproofSuit) {
                createRow('Fireproof Suit', 500, car.personalEquipmentWeight ? 3 : 0, 0);
                rows[rows.length - 1].ge = 0;
                if (ignoreWeight) rows[rows.length - 1].ignoreWeight = true;
            }
            if (crew.portableFireExtinguisher) {
                createRow('Portable Fire Extinguisher', 150, car.personalEquipmentWeight ? 20 : 0, 0);
                rows[rows.length - 1].ge = 3;
                if (ignoreWeight) rows[rows.length - 1].ignoreWeight = true;
            }
            if (crew.flakJacket) {
                createRow('Flak Jacket', 150, car.personalEquipmentWeight ? 5 : 0, 0);
                rows[rows.length - 1].ge = 3;
                if (ignoreWeight) rows[rows.length - 1].ignoreWeight = true;
            }
            if (crew.battleVest) {
                createRow('Battle Vest', 75, car.personalEquipmentWeight ? 5 : 0, 0);
                rows[rows.length - 1].ge = 3;
                bv = {pistol: 0, grenade: 0, bowie: 0, magazine: 0};
                if (ignoreWeight) rows[rows.length - 1].ignoreWeight = true;
            }
            if (crew.armoredBattleVest) {
                createRow('Armored Battle Vest', 225, car.personalEquipmentWeight ? 5 : 0, 0);
                rows[rows.length - 1].ge = 3;
                if (ignoreWeight) rows[rows.length - 1].ignoreWeight = true;
                bv = {pistol: 0, grenade: 0, bowie: 0, magazine: 0};
            }
            if (crew.safetySeat) createRow('Safety Seat', 500, 25, 0);
            if (crew.radioDetonator) {
                createRow('Radio Detonator', 500, 0, 0);
                rows[rows.length - 1].ge = 1;
            }
            if (crew.extraDriverControls) createRow('Extra Driver Controls', 1000, 50, 0);
            if (crew.ejectionSeat) createRow('Ejection Seat', 500, 100, 0);
            if (crew.unsafeEjectionSeat) createRow('Ejection Seat (no chute)', 400, 100, 0);
            if (crew.componentArmor) {
                createRow(crew.componentArmor.textDescription() + " for " + crew.name,
                    crew.componentArmor.totalCost(), crew.componentArmor.totalWeight(),
                    crew.componentArmor.totalSpace());
                if (cargo && car.modifiedCargoSpaceAvailable > 0) rows[rows.length - 1].cargo = true;
                if (cupolaGunner) rows[rows.length - 1].vehicularSpace = false;
            }
            for (i = 0; i < crew.handWeapons.length; i++)
                createHandWeaponRow(crew.handWeapons[i], car.personalEquipmentWeight, bv, ignoreWeight);
            for (i = 0; i < crew.gear.length; i++) {
                createRow(crew.gear[i].textDescription(), crew.gear[i].totalCost(),
                    car.personalEquipmentWeight ? crew.gear[i].totalWeight() : 0, 0);
                if (ignoreWeight) rows[rows.length - 1].ignoreWeight = true;
                rows[rows.length - 1].ge = crew.gear[i].totalGE();
            }
        };

        createRow(car.body.name, car.body.cost, car.body.weight, 0, car.body.maxWeight, car.body.spaces, car.body.cargoSpaces);
        var bodyCost = car.body.cost;
        if (car.type === 'Trike' && car.reversed) {
            bodyCost = bodyCost * 1.5;
            createRow("Reversed Trike", car.body.cost / 2, 0, 0, null, car.body.spaces - 1, car.body.cargoSpaces);
        }
        if (car.trailerStyle) {
            bodyCost = bodyCost + Math.ceil(car.body.cost * car.trailerStyle.costFactor - 0.0001);
            createRow(car.trailerStyle.name, bodyCost - car.body.cost,
                Math.ceil(car.body.weight * car.trailerStyle.weightFactor - 0.0001),
                Math.ceil(car.body.spaces * car.trailerStyle.spaceFactor - 0.0001));
        }
        if (car.carbonAluminumFrame) {
            createRow('CA Frame', bodyCost * 3,
                    -car.body.weight / 2 - (car.trailerStyle ? Math.ceil(car.body.weight * car.trailerStyle.weightFactor / 2 - 0.0001) : 0), 0);
        }
        if (car.type !== 'Cycle' && car.type !== 'SemiTrailer' && car.type !== 'TenWheelerCarrier')
            createRow(car.chassis.name + " Chassis", Math.round(car.modifiedBodyCost() * car.chassis.costFactor), 0, 0,
                Math.floor(car.body.maxWeight * car.chassis.weightFactor));
        if (car.type === 'Car' && car.tireCount() === 6) {
            createRow("Six-Wheeled Chassis", 100, 0, 0);
        }
        if (car.body.racingFrame)
            createRow("Racing suspension", 0, 0, 0);
        else if (car.type !== 'CarTrailer' && car.type !== 'SemiTrailer' && car.type !== 'TenWheeler' && car.type !== 'TenWheelerCarrier')
            createRow(car.suspension.name + " Suspension", Math.round(car.modifiedBodyCost() * car.suspension.costFactor), 0, 0);
        if (car.windshell) {
            createRow("Cycle Windshell", 500, 50, 0);
            if (car.windshell.armor)
                createRow(car.windshell.armor.plasticPoints + " pts " + car.frontArmor.plasticType.name + " Windshell Armor",
                    car.windshell.armorCost(), car.windshell.armorWeight(), 0);
        }
        if (car.windjammer) {
            createRow("Windjammer", 500, 70, 0);
            if (car.windjammer.retractable) createRow("Windjammer Retractor", 200, 30, 1);
            if (car.windjammer.armor) createRow(car.windjammer.armor.plasticPoints + " pts " + car.windjammer.armor.plasticType.name + " Windjammer Armor",
                car.windjammer.armor.totalCost(18), car.windjammer.armor.totalWeight(9), 0);
        }
        if (car.explosiveKingpin) createRow("Explosive Kingpin", 500, 0, 0);
        else if (car.quickReleaseKingpin) createRow("Quick-Release Kingpin", 1000, 0, 0);
        else if (car.type === 'SemiTrailer') createRow("Standard Kingpin", 100, 0, 0);
        if (car.activeSuspension) createRow("Active Suspension", 4000, 100, 0);
        if (car.streamlined) createRow("Streamlining", Math.round(car.modifiedBodyCost() / 2), 0, 0, 0, Math.floor(car.body.spaces * 0.9), Math.floor(car.body.cargoSpaces * 0.9));
        if (car.engine) {
            if (car.engine.electric) {
                createRow(car.engine.name + " Power Plant", car.engine.cost, car.engine.weight, car.engine.space);
                if (car.engine.totalPowerFactors() * 3 < car.modifiedMaxWeight) rows[rows.length - 1].maxWeight = car.engine.totalPowerFactors() * 3;
                if (car.engine.platinumCatalysts) createRow("Platinum Catalysts", car.engine.optionData('platinumCatalysts').cost, 0, 0);
                if (car.engine.superconductors) createRow("Superconductors", car.engine.optionData('superconductors').cost, 0, 0);
                if (car.engine.extraPowerCells) createRow((car.engine.extraPowerCells > 1 ? car.engine.extraPowerCells + " " : "") + "Extra Power Cells",
                    car.engine.optionData('extraPowerCells').cost,
                    car.engine.optionData('extraPowerCells').weight,
                    car.engine.optionData('extraPowerCells').space);
                if (car.engine.improvedSuperchargerCapacitors) createRow((car.engine.improvedSuperchargerCapacitors > 1 ? car.engine.improvedSuperchargerCapacitors + " " : "") + "ISC",
                    car.engine.optionData('improvedSuperchargerCapacitors').cost,
                    car.engine.optionData('improvedSuperchargerCapacitors').weight,
                    car.engine.optionData('improvedSuperchargerCapacitors').space);
                if (car.engine.highTorqueMotors) createRow("High-Torque Motors", car.engine.optionData('highTorqueMotors', car.tireCount()).cost, 0, 0);
                if (car.engine.heavyDutyHighTorqueMotors) createRow("HD High-Torque Motors", car.engine.optionData('heavyDutyHighTorqueMotors', car.tireCount()).cost, 0, 0);
                if (car.engine.fireRetardantInsulator) createRow("Fire-Retardant Insulator (Engine)",
                    car.engine.optionData('fireRetardantInsulator').cost, car.engine.optionData('fireRetardantInsulator').weight,
                    car.engine.optionData('fireRetardantInsulator').space);
            } else {
                createRow(car.engine.name + " Engine", car.engine.cost, car.engine.weight, car.engine.space);
                if (car.engine.totalPowerFactors() * 3 < car.modifiedMaxWeight) rows[rows.length - 1].maxWeight = car.engine.totalPowerFactors() * 3;
                if (car.engine.carburetor) createRow("Carburetor", car.engine.optionData('carburetor').cost, 0, 0);
                if (car.engine.multibarrelCarburetor) createRow("Multibarrel Carburetor", car.engine.optionData('multibarrelCarburetor').cost, 0, 0);
                if (car.engine.tubularHeaders) createRow("Tubular Headers", car.engine.optionData('tubularHeaders').cost, 0, 0);
                if (car.engine.blueprinted) createRow("Blueprinting", car.engine.optionData('blueprinted').cost, 0, 0);
                if (car.engine.turbocharger) createRow("Turbocharger", car.engine.optionData('turbocharger').cost, car.engine.optionData('turbocharger').weight, car.engine.optionData('turbocharger').space);
                if (car.engine.variablePitchTurbocharger) createRow("Variable-pitch Turbocharger", car.engine.optionData('variablePitchTurbocharger').cost, 0, 0);
                if (car.engine.supercharger) createRow("Supercharger", car.engine.optionData('supercharger').cost,
                    car.engine.optionData('supercharger').weight, car.engine.optionData('supercharger').space);
                if (car.engine.nitrousOxide) createRow((car.engine.nitrousOxide > 1 ? car.engine.nitrousOxide + " " : "") + "Nitrous Oxide",
                    car.engine.optionData('nitrousOxide').cost, car.engine.optionData('nitrousOxide').weight,
                    car.engine.optionData('nitrousOxide').space);
            }
            for (i = 0; i < car.engine.laserBatteries; i++)
                createRow("Laser Battery", car.engine.optionData('laserBattery').cost, car.engine.optionData('laserBattery').weight,
                    car.engine.optionData('laserBattery').space);
            if (car.engine.fireExtinguisher) createRow("Fire Extinguisher", car.engine.optionData('fireExtinguisher').cost,
                car.engine.optionData('fireExtinguisher').weight, car.engine.optionData('fireExtinguisher').space);
            if (car.engine.improvedFireExtinguisher) createRow("Improved Fire Extinguisher", car.engine.optionData('improvedFireExtinguisher').cost,
                car.engine.optionData('improvedFireExtinguisher').weight, car.engine.optionData('improvedFireExtinguisher').space);
            if (car.engine.componentArmor) createRow(car.engine.componentArmor.textDescription() + " for Engine",
                car.engine.componentArmor.totalCost(), car.engine.componentArmor.totalWeight(),
                car.engine.componentArmor.totalSpace());
        }
        if (car.gasTank) {
            createRow(car.gasTank.capacity + "-gal " + car.gasTank.name + " Tank",
                    car.gasTank.costPerGallon * car.gasTank.capacity,
                    car.gasTank.weightPerGallon * car.gasTank.capacity,
                car.gasTank.unarmoredSpace());
            createRow(car.gasTank.capacity + " gallons gas",
                    car.gasTank.gasCostPerGallon * car.gasTank.capacity,
                    car.gasTank.gasWeightPerGallon * car.gasTank.capacity, 0);
            if (car.gasTank.fireRetardantInsulator) createRow("Fire-Retardant Insulator (Tank)",
                    150 * Math.max(1, car.gasTank.unarmoredSpace()), 25 * Math.max(1, car.gasTank.unarmoredSpace()), 1);
            if (car.gasTank.componentArmor) createRow(car.gasTank.componentArmor.textDescription() + " for Gas Tank",
                car.gasTank.componentArmor.totalCost(), car.gasTank.componentArmor.totalWeight(),
                car.gasTank.componentArmor.totalSpace());
        }
        if (car.heavyDutyTransmission) {
            createRow("Heavy-Duty Transmission", car.modifiedBodyCost() * (1 + car.chassis.costFactor), 300, 2);
            // If the max load was previously artificially low, bump it up
            if (car.engine.totalPowerFactors() * 3 < car.modifiedMaxWeight) rows[rows.length - 1].maxWeight = Math.min(car.modifiedMaxWeight, car.engine.totalPowerFactors() * 6);
        }
        if (car.overdrive) createRow("Overdrive", car.tireCount() * 100, 0, 0);
        // Tires and etc.
        if (car.frontTires) {
            if (car.frontTireCount() === 1)
                createRow(car.frontTires.textDescription() + " Tire Front",
                    Math.ceil(car.frontTires.totalCost(true) - 0.0001), Math.ceil(car.frontTires.totalWeight(true) - 0.0001), 0);
            else
                createRow(car.frontTireCount() + " " + car.frontTires.textDescription() + " Tires Front",
                    Math.ceil(car.frontTires.totalCost(true) * car.frontTireCount() - 0.0001),
                    Math.ceil(car.frontTires.totalWeight(true) * car.frontTireCount() - 0.0001), 0);
            if (car.frontTires.tireChains)
                createRow((car.frontTireCount() === 1 ? "" : car.frontTireCount() + " ") + "Tire Chains", 25 * car.frontTireCount(), 5 * car.frontTireCount(), 0);
        }
        if (car.middleOrOuterTires) {
            createRow(car.middleTireCount() + " " + car.middleOrOuterTires.textDescription() +
                    (car.thirdRowTiresInMiddle ? " Tires Middle" : " Tires Back Outer"),
                Math.ceil(car.middleOrOuterTires.totalCost(true) * car.middleTireCount() - 0.0001),
                Math.ceil(car.middleOrOuterTires.totalWeight(true) * car.middleTireCount() - 0.0001), 0);
            if (car.middleOrOuterTires.tireChains)
                createRow((car.middleTireCount() === 1 ? "" : car.middleTireCount() + " ") + "Tire Chains", 25 * car.middleTireCount(), 5 * car.middleTireCount(), 0);
        }
        if (car.backTireCount() === 1)
            createRow(car.backTires.textDescription() + " Tire " +
                    (car.middleOrOuterTires && !car.thirdRowTiresInMiddle ? "Back Inner" : "Back"),
                Math.ceil(car.backTires.totalCost(true) - 0.0001), Math.ceil(car.backTires.totalWeight(true) - 0.0001), 0);
        else if (car.backTireCount() > 0)
            createRow(car.backTireCount() + " " + car.backTires.textDescription() + " Tires " +
                    (car.middleOrOuterTires && !car.thirdRowTiresInMiddle ? "Back Inner" : "Back"),
                Math.ceil(car.backTires.totalCost(true) * car.backTireCount() - 0.0001),
                Math.ceil(car.backTires.totalWeight(true) * car.backTireCount() - 0.0001), 0);
        if (car.backTires.tireChains)
            createRow((car.backTireCount() === 1 ? "" : car.backTireCount() + " ") + "Tire Chains", 25 * car.backTireCount(), 5 * car.backTireCount(), 0);

        for (i = 0; i < car.crew.length; i++) {
            createCrewRow(car.crew[i], false, false);
        }
        if (car.crewCompartmentCA) createRow(car.crewCompartmentCA.textDescription() + " for all crew",
            car.crewCompartmentCA.totalCost(), car.crewCompartmentCA.totalWeight(),
            car.crewCompartmentCA.totalSpace());
        for (i = 0; i < car.passengers.length; i++) {
            createCrewRow(car.passengers[i], true, i === 0);
        }
        if(car.type === 'Bus' && car.busExcessCargo > 0)
            createRow('Excess passenger cargo weight', 0, car.busExcessCargo, 0);
        if (car.topTurret) createTurretRow(car.topTurret);
        if (car.hasOversizeWeaponFacings() && car.topBackTurret) createTurretRow(car.topBackTurret);
        if (car.sideTurret) {
            createTurretRow(car.sideTurret); // left
            createTurretRow(car.sideTurret); // right
        }
        if (car.hasOversizeWeaponFacings() && car.sideBackTurret) {
            createTurretRow(car.sideBackTurret); // left
            createTurretRow(car.sideBackTurret); // right
        }
        processWeapons(car.frontWeapons);
        processWeapons(car.leftWeapons);
        if (car.hasOversizeWeaponFacings() && car.leftBackWeapons) processWeapons(car.leftBackWeapons);
        processWeapons(car.rightWeapons);
        if (car.hasOversizeWeaponFacings() && car.rightBackWeapons) processWeapons(car.rightBackWeapons);
        processWeapons(car.backWeapons);
        processWeapons(car.frontRightWeapons);
        processWeapons(car.frontLeftWeapons);
        processWeapons(car.backRightWeapons);
        processWeapons(car.backLeftWeapons);
        processWeapons(car.topWeapons);
        if (car.hasOversizeWeaponFacings() && car.topBackWeapons) processWeapons(car.topBackWeapons);
        processWeapons(car.underbodyWeapons);
        if (car.hasOversizeWeaponFacings() && car.underbodyBackWeapons) processWeapons(car.underbodyBackWeapons);
        if (car.fifthWheelArmor) createRow(car.fifthWheelArmor.plasticPoints + " pts " + car.fifthWheelArmor.plasticType.name + " Fifth Wheel Armor",
            car.fifthWheelArmor.totalCost(15), car.fifthWheelArmor.totalWeight(10), 0);
        var plastic = car.plasticArmorPoints();
        var metal = car.metalArmorPoints();
        if (car.sloped) {
            if (plastic > 0) {
                createRow(plastic + " pts Sloped " + car.frontArmor.plasticType.name + " Armor",
                    Math.ceil(plastic * car.frontArmor.plasticType.costFactor * 1.1 * car.body.armorCost - 0.0001),
                    Math.ceil(plastic * car.frontArmor.plasticType.weightFactor * car.body.armorWeight - 0.0001), 0);
                rows[rows.length - 1].maxSpace = Math.floor(car.body.spaces * (car.streamlined ? 0.85 : 0.9));
            }
            if (metal > 0) {
                createRow(metal + " pts Sloped " + car.frontArmor.metalType.name + " Armor",
                    Math.ceil(metal * car.frontArmor.metalType.costFactor * 1.1 * car.body.armorCost - 0.0001),
                    Math.ceil(metal * car.frontArmor.metalType.weightFactor * car.body.armorWeight - 0.0001), 0);
                if (plastic === 0)
                    rows[rows.length - 1].maxSpace = Math.floor(car.body.spaces * (car.streamlined ? 0.85 : 0.9));
            }
        } else {
            if (plastic > 0)
                createRow(plastic + " pts " + car.frontArmor.plasticType.name + " Armor",
                    Math.ceil(plastic * car.frontArmor.plasticType.costFactor * car.body.armorCost - 0.0001),
                    Math.ceil(plastic * car.frontArmor.plasticType.weightFactor * car.body.armorWeight - 0.0001), 0);
            if (metal > 0)
                createRow(metal + " pts " + car.frontArmor.metalType.name + " Armor",
                    Math.ceil(metal * car.frontArmor.metalType.costFactor * car.body.armorCost - 0.0001),
                    Math.ceil(metal * car.frontArmor.metalType.weightFactor * car.body.armorWeight - 0.0001), 0);
        }
        if (/Flatbed/.test(car.body.name)) {
            plastic = car.boxPlasticArmorPoints();
            metal = car.boxMetalArmorPoints();
            var boxCost = /40/.test(car.body.name) ? 11 : 9;
            var boxWeight = 5;
            if (car.sloped) {
                if (plastic > 0) {
                    createRow(plastic + " pts Sloped " + car.frontArmor.plasticType.name + " Box Armor",
                        Math.ceil(plastic * car.frontArmor.plasticType.costFactor * 1.1 * boxCost - 0.0001),
                        Math.ceil(plastic * car.frontArmor.plasticType.weightFactor * boxWeight - 0.0001), 0);
                }
                if (metal > 0) {
                    createRow(metal + " pts Sloped " + car.frontArmor.metalType.name + " Box Armor",
                        Math.ceil(metal * car.frontArmor.metalType.costFactor * 1.1 * boxCost - 0.0001),
                        Math.ceil(metal * car.frontArmor.metalType.weightFactor * boxWeight - 0.0001), 0);
                }
            } else {
                if (plastic > 0)
                    createRow(plastic + " pts " + car.frontArmor.plasticType.name + " Box Armor",
                        Math.ceil(plastic * car.frontArmor.plasticType.costFactor * boxCost - 0.0001),
                        Math.ceil(plastic * car.frontArmor.plasticType.weightFactor * boxWeight - 0.0001), 0);
                if (metal > 0)
                    createRow(metal + " pts " + car.frontArmor.metalType.name + " Box Armor",
                        Math.ceil(metal * car.frontArmor.metalType.costFactor * boxCost - 0.0001),
                        Math.ceil(metal * car.frontArmor.metalType.weightFactor * boxWeight - 0.0001), 0);
            }
        }
        if (car.backDoor) createRow("Back Door", 200, 0, 0);
        if (car.ramplate) createRow("Ramplate", car.ramplateCost(), car.ramplateWeight(), 0);
        if (car.fakeRamplate) createRow("Fake Ramplate", Math.ceil(5 * car.body.armorCost * car.armorTypeToMatch().costFactor * (car.sloped ? 1.1 : 1) - 0.0001),
            Math.ceil(5 * car.body.armorWeight * car.armorTypeToMatch().weightFactor - 0.0001), 0);
        if (car.frontWheelguards && car.frontExposedTireCount() > 0)
            createRow((car.frontExposedTireCount() === 1 ? "" : car.frontExposedTireCount() + " ") + car.frontWheelguards.textDescription() + " Wheelguard" + (car.frontExposedTireCount() === 1 ? "" : "s") + " Front",
                    car.frontWheelguards.totalCost() * car.frontExposedTireCount(), car.frontWheelguards.totalWeight(car.techLevel) * car.frontExposedTireCount(), 0);
        if (car.frontWheelhubs && car.frontExposedTireCount() > 0)
            createRow((car.frontExposedTireCount() === 1 ? "" : car.frontExposedTireCount() + " ") + car.frontWheelhubs.textDescription() + " Wheelhub" + (car.frontExposedTireCount() === 1 ? car.frontWheelhubs.motorcycle ? " pair" : "" : "s") + " Front",
                    car.frontWheelhubs.totalCost() * car.frontExposedTireCount(), car.frontWheelhubs.totalWeight(car.techLevel) * car.frontExposedTireCount(), 0);
        if (car.middleWheelguards && car.middleTireCount() > 0)
            createRow((car.middleTireCount() === 1 ? "" : car.middleTireCount() + " ") + car.middleWheelguards.textDescription() + " Wheelguard" + (car.middleTireCount() === 1 ? "" : "s") + " Middle",
                    car.middleWheelguards.totalCost() * car.middleTireCount(), car.middleWheelguards.totalWeight(car.techLevel) * car.middleTireCount(), 0);
        if (car.middleWheelhubs && car.middleTireCount() > 0)
            createRow((car.middleTireCount() === 1 ? "" : car.middleTireCount() + " ") + car.middleWheelhubs.textDescription() + " Wheelhub" + (car.middleTireCount() === 1 ? "" : "s") + " Middle",
                    car.middleWheelhubs.totalCost() * car.middleTireCount(), car.middleWheelhubs.totalWeight(car.techLevel) * car.middleTireCount(), 0);
        if (car.backWheelguards && car.backExposedTireCount() > 0)
            createRow((car.backExposedTireCount() === 1 ? "" : car.backExposedTireCount() + " ") + car.backWheelguards.textDescription() + " Wheelguard" + (car.backExposedTireCount() === 1 ? "" : "s") + " Back",
                    car.backWheelguards.totalCost() * car.backExposedTireCount(), car.backWheelguards.totalWeight(car.techLevel) * car.backExposedTireCount(), 0);
        if (car.backWheelhubs && car.backExposedTireCount() > 0)
            createRow((car.backExposedTireCount() === 1 ? "" : car.backExposedTireCount() + " ") + car.backWheelhubs.textDescription() + " Wheelhub" + (car.backExposedTireCount() === 1 ? car.backWheelhubs.motorcycle ? " pair" : "" : "s") + " Back",
                    car.backWheelhubs.totalCost() * car.backExposedTireCount(), car.backWheelhubs.totalWeight(car.techLevel) * car.backExposedTireCount(), 0);
        if (car.heavyDutyShocks) createRow("Heavy-Duty Shocks", car.tireCount() * 400, car.tireCount() * 5, 0);
        if (car.heavyDutyBrakes) createRow("Heavy-Duty Brakes", car.tireCount() * 100, 0, 0);
        if (car.antilockBrakes) createRow("Antilock Brakes", 1000, 0, 0);
        if (car.rollCage) createRow("Roll Cage", 900, 30 * car.body.armorWeight, 0);
        if (car.sunroof) createRow("Sunroof", 500, 25, 0);
        if (car.convertibleHardtop) createRow("Convertible Hardtop", 1500, 50, car.body.name === 'Pickup' ? 2 : Math.ceil(car.modifiedSpaceAvailable / 6 - 0.0001));
        if (car.hitch) {
            createRow(car.hitch.name, car.hitch.cost, car.hitch.weight, 0);
            if (car.hitch.explosive) createRow("Explosive Release", 400, 0, 0);
            if (car.hitch.quickRelease) createRow("Quick Release", 900, 0, 0);
            if (car.hitch.armor) createRow(car.hitch.armor.plasticPoints + " pts " + car.hitch.armor.plasticType.name + " Hitch Armor", car.hitch.armor.totalCost(15), car.hitch.armor.totalWeight(4), 0);
        }


        var spoilerName = 'Spoiler', airdamName = 'Airdam';
        if (car.techLevel === 'All') {
            if (car.spoiler && car.backArmor.metalPoints > 0) {
                spoilerName = "Metal " + spoilerName;
            }
            if (car.airdam && car.frontArmor.metalPoints > 0) {
                airdamName = "Metal " + airdamName;
            }
        }
        if (car.spoilerCost > 0) createRow(spoilerName, car.spoilerCost, car.spoilerWeight, 0);
        if (car.airdamCost > 0) createRow(airdamName, car.airdamCost, car.airdamWeight, 0);

        if (car.bodyBlades) createRow(car.bodyBladeText(), car.bodyBladeCost(), car.bodyBladeWeight(), 0);
        if (car.fakeBodyBlades) createRow("Fake Body Blades", 20, 0, 0);
        if (car.brushcutter) createRow("Brushcutter", 100, 20, 0);
        if (car.bumperSpikes) createRow("Bumper Spikes (Front)", Math.ceil(5 * car.body.armorCost * car.armorTypeToMatch().costFactor - 0.0001),
            Math.ceil(5 * car.body.armorWeight * car.armorTypeToMatch().weightFactor - 0.0001), 0);
        if (car.backBumperSpikes) createRow("Bumper Spikes (Back)", Math.ceil(5 * car.body.armorCost * car.armorTypeToMatch().costFactor - 0.0001),
            Math.ceil(5 * car.body.armorWeight * car.armorTypeToMatch().weightFactor - 0.0001), 0);
        for (i = 0; i < car.boosters.length; i++) {
            createRow(car.boosters[i].totalWeight() + " lbs. " + (car.boosters[i].jumpJet ? "Jump Jets" : "Rocket Boosters"), car.boosters[i].totalCost(),
                car.boosters[i].totalWeight(), car.boosters[i].totalSpace());
        }
        if (car.noPaintWindshield) createRow("No-Paint Windshield", 1000, 0, 0);
        if (car.stealthKoteLocations.length > 0) createRow("StealthKote Shield (" + car.stealthKoteLocations.length + " location" + (car.stealthKoteLocations.length > 1 ? "s" : "") + ")",
                car.body.armorCost * car.stealthKoteLocations.length * 10, car.body.armorWeight * car.stealthKoteLocations.length, 0);
        for (i = 0; i < car.accessories.length; i++) {
            createRow(car.accessories[i].textDescription(), car.accessories[i].totalCost(),
                car.accessories[i].totalWeight(), car.accessories[i].totalSpace());
            if (car.accessories[i].cargo && car.modifiedCargoSpaceAvailable > 0) rows[rows.length - 1].cargo = true;
        }
        if (car.links.length) createRow(car.links.length > 1 ? car.links.length + " Links" : "Link",
                car.links.length * 50, 0, 0);
        if (car.smartLinks.length) createRow(car.smartLinks.length > 1 ? car.smartLinks.length + " Smart Links" : "Smart Link",
                car.smartLinks.length * 500, 0, 0);

        if (car.sidecar) {
            createRow("", 0, 0, 0);
            createRow(car.sidecar.name, car.sidecar.cost, car.sidecar.weight, 0, car.sidecar.maxWeight, car.sidecar.spaces, 0);
            if (car.carbonAluminumFrame) createRow("CA Frame", car.sidecar.cost * 3, -car.sidecar.weight / 2, 0);
            createRow(car.sidecar.suspension.name + " Suspension", car.sidecar.modifiedBodyCost() * car.sidecar.suspension.costFactor, 0, 0);
            if (car.streamlined) createRow("Streamlining", car.sidecar.modifiedBodyCost() / 2, 0, 0, 0, Math.floor(car.sidecar.spaces * 0.9 + 0.0001), 0);
            createRow(car.sidecar.tireCount === 1 ? car.sidecar.tires.name + " Tire" : "2 " + car.sidecar.tires.name + " Tires",
                Math.ceil(car.sidecar.tireCount * car.sidecar.tires.totalCost() - 0.0001), Math.ceil(car.sidecar.tireCount * car.sidecar.tires.totalWeight() - 0.0001), 0);
            if (car.sidecar.jettisonJoinings) createRow("Jettison Joinings", 300, 0, 0);
            if (car.overdrive) createRow("Overdrive", car.sidecar.tireCount * 100, 0, 0);
            if (car.heavyDutyShocks) createRow("Heavy-Duty Shocks", car.sidecar.tireCount * 400, car.sidecar.tireCount * 5, 0);
            if (car.heavyDutyBrakes) createRow("Heavy-Duty Brakes", car.sidecar.tireCount * 100, 0, 0);
            if (car.engine.highTorqueMotors) createRow("High-Torque Motors", car.sidecar.tireCount * 100, 0, 0);
            if (car.engine.heavyDutyHighTorqueMotors) createRow("HD High-Torque Motors", car.sidecar.tireCount * 200, 0, 0);
            if (car.rollCage) createRow("Roll Cage", 900, 30 * car.sidecar.armorWeight, 0);

            for (i = 0; i < car.sidecar.crew.length; i++) {
                createCrewRow(car.sidecar.crew[i], false, false);
            }
            for (i = 0; i < car.sidecar.passengers.length; i++) {
                createCrewRow(car.sidecar.passengers[i], false, false);
            }
            processWeapons(car.sidecar.frontWeapons);
            processWeapons(car.sidecar.rightWeapons);
            processWeapons(car.sidecar.backWeapons);
            if (car.sidecar.topTurret) createTurretRow(car.sidecar.topTurret);
            for (i = 0; i < car.sidecar.accessories.length; i++) {
                createRow((car.sidecar.accessories[i].count > 1 ? car.sidecar.accessories[i].count + "x " : "") + car.sidecar.accessories[i].name,
                    car.sidecar.accessories[i].totalCost(),
                    car.sidecar.accessories[i].totalWeight(), car.sidecar.accessories[i].totalSpace());
            }

            plastic = car.sidecar.frontArmor.plasticPoints + car.sidecar.leftArmor.plasticPoints
                + car.sidecar.rightArmor.plasticPoints + car.sidecar.backArmor.plasticPoints
                + car.sidecar.topArmor.plasticPoints + car.sidecar.underbodyArmor.plasticPoints;
            metal = car.sidecar.frontArmor.metalPoints + car.sidecar.leftArmor.metalPoints
                + car.sidecar.rightArmor.metalPoints + car.sidecar.backArmor.metalPoints
                + car.sidecar.topArmor.metalPoints + car.sidecar.underbodyArmor.metalPoints;
            if (car.sloped) {
                if (plastic > 0) {
                    createRow(plastic + " pts Sloped " + car.sidecar.frontArmor.plasticType.name + " Armor",
                        Math.ceil(plastic * car.sidecar.frontArmor.plasticType.costFactor * 1.1 * car.sidecar.armorCost - 0.0001),
                        Math.ceil(plastic * car.sidecar.frontArmor.plasticType.weightFactor * car.sidecar.armorWeight - 0.0001), 0);
                    rows[rows.length - 1].maxSpace = Math.floor(car.sidecar.spaces * (car.streamlined ? 0.85 : 0.9));
                }
                if (metal > 0) {
                    createRow(plastic + " pts Sloped " + car.sidecar.frontArmor.metalType.name + " Armor",
                        Math.ceil(plastic * car.sidecar.frontArmor.metalType.costFactor * 1.1 * car.sidecar.armorCost - 0.0001),
                        Math.ceil(plastic * car.sidecar.frontArmor.metalType.weightFactor * car.sidecar.armorWeight - 0.0001), 0);
                    if (plastic === 0)
                        rows[rows.length - 1].maxSpace = Math.floor(car.sidecar.spaces * (car.streamlined ? 0.85 : 0.9));
                }
            } else {
                if (plastic > 0)
                    createRow(plastic + " pts " + car.sidecar.frontArmor.plasticType.name + " Armor",
                        Math.ceil(plastic * car.sidecar.frontArmor.plasticType.costFactor * car.sidecar.armorCost - 0.0001),
                        Math.ceil(plastic * car.sidecar.frontArmor.plasticType.weightFactor * car.sidecar.armorWeight - 0.0001), 0);
                if (metal > 0)
                    createRow(plastic + " pts " + car.sidecar.frontArmor.metalType.name + " Armor",
                        Math.ceil(plastic * car.sidecar.frontArmor.metalType.costFactor * car.sidecar.armorCost - 0.0001),
                        Math.ceil(plastic * car.sidecar.frontArmor.metalType.weightFactor * car.sidecar.armorWeight - 0.0001), 0);
            }
            if (car.sidecar.wheelguards) createRow(car.sidecar.wheelguards.textDescription() + " Wheelguard" + (car.sidecar.tireCount === 1 ? "" : "s"),
                    car.sidecar.wheelguards.totalCost() * car.sidecar.tireCount, car.sidecar.wheelguards.totalWeight(car.techLevel) * car.sidecar.tireCount, 0);
            if (car.sidecar.wheelhubs) createRow(car.sidecar.wheelhubs.textDescription() + " Wheelhub" + (car.sidecar.tireCount === 1 ? "" : "s"),
                    car.sidecar.wheelhubs.totalCost() * car.sidecar.tireCount, car.sidecar.wheelhubs.totalWeight(car.techLevel) * car.sidecar.tireCount, 0);
        }

        if (car.carrier) {
            createRow("", 0, 0, 0);
            rows = rows.concat(CW.exportWorksheet(car.carrier));
        }

        return rows;
    };
})();