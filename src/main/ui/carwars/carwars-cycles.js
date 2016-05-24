/*
 Car Wars is a trademark of Steve Jackson Games, and its rules and art are copyrighted by Steve Jackson Games.
 All rights are reserved by Steve Jackson Games.

 This game aid is the original creation of Aaron Mulder and is released for free distribution, and not for resale,
 under the permissions granted in the Steve Jackson Games Online Policy.

 Application code for this game aid (except for the Car Wars rules as noted above) copyright 2013 Aaron Mulder.
 */
/* global CW, CWD */

// ***** MUST LOAD VALIDATION FIRST!!!

(function() {
    "use strict";

    CW.cycleBody = {
        light: {
            name: 'Light Cycle',
            cost: 200,
            weight: 250,
            maxWeight: 800,
            spaces: 4,
            cargoSpaces: 0,
            armorCost: 10,
            armorWeight: 4,
            maxTurretSize: -1,
            maxRPSize: 0,
            maxEWPSize: 1
        },
        medium: {
            name: 'Medium Cycle',
            cost: 300,
            weight: 300,
            maxWeight: 1100,
            spaces: 5,
            cargoSpaces: 0,
            armorCost: 11,
            armorWeight: 5,
            maxTurretSize: -1,
            maxRPSize: 0,
            maxEWPSize: 1
        },
        heavy: {
            name: 'Heavy Cycle',
            cost: 400,
            weight: 350,
            maxWeight: 1300,
            spaces: 7,
            cargoSpaces: 0,
            armorCost: 12,
            armorWeight: 6,
            maxTurretSize: -1,
            maxRPSize: 0,
            maxEWPSize: 1
        }
    };

    CW.sidecarBody = {
        light: {
            name: 'Light Sidecar',
            cost: 300,
            weight: 200,
            maxWeight: 400,
            spaces: 2,
            armorCost: 5,
            armorWeight: 5
        },
        heavy: {
            name: 'Heavy Sidecar',
            cost: 450,
            weight: 350,
            maxWeight: 750,
            spaces: 3,
            armorCost: 5,
            armorWeight: 6
        },
        oneSpaceCTS: {
            name: '1-Space Turret Sidecar',
            cost: 1500,
            weight: 250,
            maxWeight: 550,
            spaces: 1,
            armorCost: 5,
            armorWeight: 5
        },
        twoSpaceCTS: {
            name: '2-Space Turret Sidecar',
            cost: 2500,
            weight: 450,
            maxWeight: 800,
            spaces: 1,
            armorCost: 5,
            armorWeight: 6
        }
    };

    CW.cycleSuspension = {
        light: {
            name: 'Light',
            costFactor: 0,
            hc: 0
        },
        improved: {
            name: 'Improved',
            costFactor: 1,
            hc: 1
        },
        heavy: {
            name: 'Heavy',
            costFactor: 2,
            hc: 2
        },
        off_road: {
            name: 'Off-Road',
            costFactor: 3,
            hc: 2,
            offRoad: true
        }
    };

    CW.cyclePowerPlant = {
        small: {
            name: 'Small Cycle',
            cost: 500,
            weight: 100,
            space: 1,
            dp: 2,
            powerFactors: 400
        },
        medium: {
            name: 'Medium Cycle',
            cost: 1000,
            weight: 150,
            space: 1,
            dp: 3,
            powerFactors: 600
        },
        large: {
            name: 'Large Cycle',
            cost: 1500,
            weight: 175,
            space: 2,
            dp: 4,
            powerFactors: 800
        },
        superCycle: {
            name: 'Super Cycle',
            cost: 2000,
            weight: 200,
            space: 2,
            dp: 5,
            powerFactors: 1000
        },
        superTrike: {
            name: 'Super Trike',
            cost: 3000,
            weight: 250,
            space: 3,
            dp: 6,
            powerFactors: 1200
        }
    };

    CW.createCycle = function () {
        var cycle = CW.createVehicle();

        cycle.body = CW.cycleBody.light;
        cycle.engine = CW.createPowerPlant(CW.cyclePowerPlant.small);
        cycle.chassis = CW.chassis.standard;
        cycle.suspension = CW.cycleSuspension.heavy;
        cycle.crew.push(CW.createCrew('Cyclist'));
        cycle.frontTires = CW.createTire('Standard', true, false);
        cycle.backTires = CW.createTire('Standard', true, false);
        cycle.frontArmor = CW.createArmor(1);
        cycle.backArmor = CW.createArmor(1);
        cycle.leftArmor = CW.createArmor(0, 0);
        cycle.rightArmor = CW.createArmor(0, 0);
        cycle.topArmor = CW.createArmor(0, 0);
        cycle.underbodyArmor = CW.createArmor(0, 0);
        cycle.powerPlantList = CW.cyclePowerPlant;
        cycle.type = 'Cycle';
        cycle.windshell = null;
        cycle.sidecar = null;

        cycle.tireCount = function () {
            return 2;
        };
        cycle.frontTireCount = function () {
            return 1;
        };
        cycle.backTireCount = function () {
            return 1;
        };
        cycle.middleTireCount = function () {
            return 0;
        };

        cycle.addWindshell = function () {
            this.windshell = CW.createWindshell(this);
            this.sidecar = null;
            this.recalculate();
        };

        cycle.addSidecar = function (type) {
            this.sidecar = CW.createSidecar(this, type);
            this.sidecar.tires.duplicate(this.frontTires);
            this.sidecar.frontArmor.plasticType = this.frontArmor.plasticType;
            this.sidecar.frontArmor.metalType = this.frontArmor.metalType;
            this.sidecar.backArmor.plasticType = this.frontArmor.plasticType;
            this.sidecar.backArmor.metalType = this.frontArmor.metalType;
            this.sidecar.leftArmor.plasticType = this.frontArmor.plasticType;
            this.sidecar.leftArmor.metalType = this.frontArmor.metalType;
            this.sidecar.rightArmor.plasticType = this.frontArmor.plasticType;
            this.sidecar.rightArmor.metalType = this.frontArmor.metalType;
            this.sidecar.topArmor.plasticType = this.frontArmor.plasticType;
            this.sidecar.topArmor.metalType = this.frontArmor.metalType;
            this.sidecar.underbodyArmor.plasticType = this.frontArmor.plasticType;
            this.sidecar.underbodyArmor.metalType = this.frontArmor.metalType;
            this.windshell = null;
            this.recalculate();
        };

        cycle.setSidecar = function(type) {
            this.sidecar.changeType(type);
            this.recalculate();
        };

        cycle.nextSidecar = function () {
            if (!this.sidecar) this.addSidecar(CW.sidecarBody.light);
            else if (this.sidecar.name === CW.sidecarBody.light.name) this.sidecar.changeType(CW.sidecarBody.oneSpaceCTS);
            else if (this.sidecar.name === CW.sidecarBody.oneSpaceCTS.name) this.sidecar.changeType(CW.sidecarBody.heavy);
            else if (this.sidecar.name === CW.sidecarBody.heavy.name) this.sidecar.changeType(CW.sidecarBody.twoSpaceCTS);
            else return;
            this.recalculate();
        };

        cycle.previousSidecar = function () {
            if (this.sidecar === null) {
                this.recalculate();
                return;
            }
            if (this.sidecar.name === CW.sidecarBody.twoSpaceCTS.name) this.sidecar.changeType(CW.sidecarBody.heavy);
            else if (this.sidecar.name === CW.sidecarBody.heavy.name) this.sidecar.changeType(CW.sidecarBody.oneSpaceCTS);
            else if (this.sidecar.name === CW.sidecarBody.oneSpaceCTS.name) this.sidecar.changeType(CW.sidecarBody.light);
            else if (this.sidecar.name === CW.sidecarBody.light.name) this.sidecar = null;
            else return;
            this.recalculate();
        };
        cycle.recalculateAccessories = function () {
            if (this.windshell) {
                this.weightUsed += this.windshell.totalWeight();
                this.totalCost += this.windshell.totalCost();
            }
        };
        cycle.recalculate = function () {
            this.baseRecalculate();
            this.maxWeaponSpacesPerSide = 99; // no 1/3 spaces
            if (this.sidecar) this.modifiedHandlingClass += this.sidecar.totalHC();
            if (this.onRecalculate) this.onRecalculate();
            if (CW.validateCycle) {
                var errors = CW.validateCycle(this);
                this.legal = errors.length === 0;
                if (this.onErrors)
                    this.onErrors(errors); // Call even when no errors so the prior list can be cleared
            } else {
                if (this.onErrors)
                    this.onErrors([]);
            }
        };

        var carLinkableWeapons = cycle.linkableWeapons;
        cycle.linkableWeapons = function () {
            var i, result = carLinkableWeapons.apply(this); // Call super
            if (this.sidecar) {
                for (i = 0; i < this.sidecar.frontWeapons.length; i++) if (!this.sidecar.frontWeapons[i].fake) result.push(this.sidecar.frontWeapons[i]);
                for (i = 0; i < this.sidecar.backWeapons.length; i++) if (!this.sidecar.backWeapons[i].fake) result.push(this.sidecar.backWeapons[i]);
                for (i = 0; i < this.sidecar.rightWeapons.length; i++) if (!this.sidecar.rightWeapons[i].fake) result.push(this.sidecar.rightWeapons[i]);
                if (this.sidecar.topTurret) for (i = 0; i < this.sidecar.topTurret.weapons.length; i++) if (!this.sidecar.topTurret.weapons[i].fake) result.push(this.sidecar.topTurret.weapons[i]);
            }
            return result;
        };

        var carTotalWeight = cycle.totalCargoWeight;
        cycle.totalCargoWeight = function () {
            if (!this.sidecar) return carTotalWeight;
            var cycleCargo = this.modifiedMaxWeight - this.weightUsed + this.reservedWeight;
            var sidecarCargo = this.sidecar.maxWeight - this.sidecar.totalWeight();
            var engineLimit = this.engine.totalPowerFactors() * 3 - this.weightUsed + this.reservedWeight - this.sidecar.totalWeight();
            return Math.min(cycleCargo + sidecarCargo, engineLimit);
        };

        cycle.textDescription = function (suppressName) {
            var text = this.baseDescription(suppressName);
            if (this.sidecar) {
                text += "\n\n" + this.sidecar.textDescription();
            }
            if (this.windshell) {
                var add = 'Cycle Windshell';
                if (this.windshell.armor) add += ' w/' + this.windshell.armor.plasticPoints + " pts extra " + this.armorTypeToMatch().name + " armor";
                text = text.replace('Cyclist', add + ", Cyclist");
            }
            return text;
        };

        cycle.sidecarWalkaround = function () {
            if (!this.sidecar) return null;
            var i, text = "", first;
            text += "Sidecar, ";
            text += this.sidecar.tireCount + " wheel" + (this.sidecar.tireCount > 1 ? "s" : "") + ", ";
            for (i = 0; i < this.sidecar.crew.length; i++) {
                text += this.crew[i].name + ", ";
            }
            for (i = 0; i < this.sidecar.passengers.length; i++) {
                text += "Passenger, ";
            }
            for (i = 0; i < this.sidecar.accessories.length; i++) {
                if (/Fake Passenger/.test(this.accessories[i].name)) {
                    text += "Passenger, ";
                }
            }
            for (i = 0; i < this.accessories.length; i++) {
                if (this.accessories[i].name === CW.accessories.SEARCHLIGHT.name
                    || this.accessories[i].name === CW.accessories.ARMORED_SEARCHLIGHT.name) {
                    text += this.accessories[i].name + ", ";
                }
            }

            if (this.sidecar.topTurret) {
                text += this.sidecar.topTurret.name + " with ";
                first = true;
                for (i = 0; i < this.sidecar.topTurret.weapons.length; i++) {
                    if (first) first = false;
                    else text += " and ";
                    if (this.sidecar.topTurret.weapons[i].count > 1) text += this.sidecar.topTurret.weapons[i].count + "x ";
                    text += this.sidecar.topTurret.weapons[i].walkaroundCategory();
                }
            }
            for (i = 0; i < this.sidecar.frontWeapons.length; i++) {
                if (this.sidecar.frontWeapons[i].count > 1) text += this.sidecar.frontWeapons[i].count + "x ";
                text += this.sidecar.frontWeapons[i].walkaroundCategory() + " Front, ";
            }
            for (i = 0; i < this.sidecar.rightWeapons.length; i++) {
                if (this.sidecar.rightWeapons[i].count > 1) text += this.sidecar.rightWeapons[i].count + "x ";
                text += this.sidecar.rightWeapons[i].walkaroundCategory() + " Right, ";
            }
            for (i = 0; i < this.sidecar.backWeapons.length; i++) {
                if (this.sidecar.backWeapons[i].count > 1) text += this.sidecar.backWeapons[i].count + "x ";
                text += this.sidecar.backWeapons[i].walkaroundCategory() + " Back, ";
            }
            // TODO: boosters in sidecar
            //        for(i=0; i<this.boosters.length; i++) {
            //            text += this.boosters[i].walkaroundDescription();
            //        }
            if (this.sidecar.wheelguards) {
                text += this.sidecar.tireCount + " Wheelguards, ";
            }
            if (this.sidecar.wheelhubs) {
                text += this.sidecar.tireCount + " Wheelhubs, ";
            }
            if (this.sloped) text += "Sloped Armor, ";
            if (/, $/.test(text)) return text.substring(0, text.length - 2);
            return text;
        };

        cycle.armorValues = function () {
            var composite = this.compositeArmor();
            var locations = [
                {location: 'Front', value: this.frontArmor.armorPointDescription(composite)},
                {location: 'Back', value: this.backArmor.armorPointDescription(composite)}
            ];
            if (this.sidecar) {
                locations.push({location: 'SC Front', value: this.sidecar.frontArmor.armorPointDescription(composite)});
                locations.push({location: 'SC Left', value: this.sidecar.leftArmor.armorPointDescription(composite)});
                locations.push({location: 'SC Right', value: this.sidecar.rightArmor.armorPointDescription(composite)});
                locations.push({location: 'SC Back', value: this.sidecar.backArmor.armorPointDescription(composite)});
                locations.push({location: 'SC Top', value: this.sidecar.topArmor.armorPointDescription(composite)});
                locations.push({location: 'SC Under', value: this.sidecar.underbodyArmor.armorPointDescription(composite)});
            }
            return locations;
        };

        var bodyOptions = [CW.cycleBody.light, CW.cycleBody.medium, CW.cycleBody.heavy];
        var suspensionOptions = [CW.cycleSuspension.light, CW.cycleSuspension.improved, CW.cycleSuspension.heavy, CW.cycleSuspension.off_road];

        cycle.bodyOptions = function() {
            return bodyOptions;
        };
        cycle.nextBody = function () {
            var i;
            for (i = 1; i < bodyOptions.length; i++) {
                if (this.body === bodyOptions[i - 1]) {
                    this.body = bodyOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        cycle.previousBody = function () {
            var i;
            for (i = bodyOptions.length - 2; i >= 0; i--) {
                if (this.body === bodyOptions[i + 1]) {
                    this.body = bodyOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        cycle.nextSuspension = function () {
            var i;
            for (i = 1; i < suspensionOptions.length; i++) {
                if (this.suspension === suspensionOptions[i - 1]) {
                    this.suspension = suspensionOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        cycle.previousSuspension = function () {
            var i;
            for (i = suspensionOptions.length - 2; i >= 0; i--) {
                if (this.suspension === suspensionOptions[i + 1]) {
                    this.suspension = suspensionOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        cycle.nextEngine = function () {
            if (this.engine.electric) {
                if (this.engine.name === CW.cyclePowerPlant.small.name) {
                    this.engine.changeType(CW.cyclePowerPlant.medium);
                } else if (this.engine.name === CW.cyclePowerPlant.medium.name) {
                    this.engine.changeType(CW.cyclePowerPlant.large);
                } else if (this.engine.name === CW.cyclePowerPlant.large.name) {
                    this.engine.changeType(CW.cyclePowerPlant.superCycle);
                } else if (this.engine.name === CW.cyclePowerPlant.superCycle.name) {
                    this.engine.changeType(CW.cyclePowerPlant.superTrike);
                } else if (this.engine.name === CW.cyclePowerPlant.superTrike.name) {
                    return;
                }
            } else {
                if (this.engine.name === '10 cid') {
                    this.engine.changeType(CW.gasEngine.cid_30);
                } else if (this.engine.name === '30 cid') {
                    this.engine.changeType(CW.gasEngine.cid_50);
                } else if (this.engine.name === '50 cid') {
                    this.engine.changeType(CW.gasEngine.cid_100);
                } else if (this.engine.name === '100 cid') {
                    this.engine.changeType(CW.gasEngine.cid_150);
                } else if (this.engine.name === '150 cid') {
                    this.engine.changeType(CW.gasEngine.cid_200);
                } else if (this.engine.name === '200 cid') {
                    this.engine.changeType(CW.gasEngine.cid_250);
                } else if (this.engine.name === '250 cid') {
                    this.engine.changeType(CW.gasEngine.cid_300);
                } else if (this.engine.name === '300 cid') {
                    this.engine.changeType(CW.gasEngine.cid_350);
                } else if (this.engine.name === '350 cid') {
                    this.engine.changeType(CW.gasEngine.cid_400);
                } else if (this.engine.name === '400 cid') {
                    this.engine.changeType(CW.gasEngine.cid_450);
                } else if (this.engine.name === '450 cid') {
                    this.engine.changeType(CW.gasEngine.cid_500);
                } else if (this.engine.name === '500 cid') {
                    this.engine.changeType(CW.gasEngine.cid_700);
                } else if (this.engine.name === '700 cid') {
                    return;
                }
            }
            this.recalculate();
        };
        cycle.previousEngine = function () {
            if (this.engine.electric) {
                if (this.engine.name === CW.cyclePowerPlant.superTrike.name) {
                    this.engine.changeType(CW.cyclePowerPlant.superCycle);
                } else if (this.engine.name === CW.cyclePowerPlant.superCycle.name) {
                    this.engine.changeType(CW.cyclePowerPlant.large);
                } else if (this.engine.name === CW.cyclePowerPlant.large.name) {
                    this.engine.changeType(CW.cyclePowerPlant.medium);
                } else if (this.engine.name === CW.cyclePowerPlant.medium.name) {
                    this.engine.changeType(CW.cyclePowerPlant.small);
                } else if (this.engine.name === CW.cyclePowerPlant.small.name) {
                    return;
                }
            } else {
                if (this.engine.name === '700 cid') {
                    this.engine.changeType(CW.gasEngine.cid_500);
                } else if (this.engine.name === '500 cid') {
                    this.engine.changeType(CW.gasEngine.cid_450);
                } else if (this.engine.name === '450 cid') {
                    this.engine.changeType(CW.gasEngine.cid_400);
                } else if (this.engine.name === '400 cid') {
                    this.engine.changeType(CW.gasEngine.cid_350);
                } else if (this.engine.name === '350 cid') {
                    this.engine.changeType(CW.gasEngine.cid_300);
                } else if (this.engine.name === '300 cid') {
                    this.engine.changeType(CW.gasEngine.cid_250);
                } else if (this.engine.name === '250 cid') {
                    this.engine.changeType(CW.gasEngine.cid_200);
                } else if (this.engine.name === '200 cid') {
                    this.engine.changeType(CW.gasEngine.cid_150);
                } else if (this.engine.name === '150 cid') {
                    this.engine.changeType(CW.gasEngine.cid_100);
                    this.engine.supercharger = false;
                } else if (this.engine.name === '100 cid') {
                    this.engine.changeType(CW.gasEngine.cid_50);
                } else if (this.engine.name === '50 cid') {
                    this.engine.changeType(CW.gasEngine.cid_30);
                } else if (this.engine.name === '30 cid') {
                    this.engine.changeType(CW.gasEngine.cid_10);
                } else if (this.engine.name === '10 cid') {
                    return;
                }
            }
            this.recalculate();
        };

        cycle.bodyBladeCost = function () {
            return 50;
        };
        cycle.bodyBladeWeight = function () {
            return 20;
        };
        cycle.bodyBladeText = function () {
            return "Cycle Blades";
        };

        cycle.recalculate();

        return cycle;
    };

    CW.createSidecar = function (cycle, type) {
        var car = CW.create(type);
        car.type = 'Sidecar';
        car.cycle = cycle;
        car.suspension = CW.cycleSuspension.light;
        car.crew = [];
        car.passengers = [];
        car.accessories = [];
        car.spareTires = [];
        car.frontWeapons = [];
        car.rightWeapons = [];
        car.backWeapons = [];
        car.boosters = [];
        car.tires = CW.createTire('Standard', true); // Must match cycle tires!
        car.tireCount = 1;
        car.wheelguards = null;
        car.wheelhubs = null;
        car.frontArmor = CW.createArmor(1, 0);
        car.leftArmor = CW.createArmor(1, 0);
        car.rightArmor = CW.createArmor(1, 0);
        car.backArmor = CW.createArmor(1, 0);
        car.topArmor = CW.createArmor(1, 0);
        car.underbodyArmor = CW.createArmor(1, 0);
        car.topTurret = car.name === CW.sidecarBody.oneSpaceCTS.name ? CW.createTurret("Turret", 1) :
                car.name === CW.sidecarBody.twoSpaceCTS.name ? CW.createTurret("Turret", 2) : null;
        if (car.topTurret) car.topTurret.builtIn = true;
        car.jettisonJoinings = false;
        car.rollCage = false;
        car.appearance = {colorScheme: {mainColor: '#AA2222'}};


        car.modifiedBodyCost = function () {
            return this.cycle.carbonAluminumFrame ? this.cost * 4 : this.cost;
        };

        car.isOversize = function() {return false;};

        car.totalCost = function () {
            var i, total = this.modifiedBodyCost()
                + this.modifiedBodyCost() * this.suspension.costFactor
                + (this.cycle.streamlined ? this.modifiedBodyCost() / 2 : 0)
                + Math.ceil(this.tireCount * this.tires.totalCost() - 0.0001)
                + (this.wheelguards ? this.wheelguards.totalCost(true) * this.tireCount : 0)
                + (this.wheelhubs ? this.wheelhubs.totalCost(true) * this.tireCount : 0)
                + (this.cycle.heavyDutyShocks ? this.tireCount * 400 : 0)
                + (this.cycle.heavyDutyBrakes ? this.tireCount * 100 : 0)
                + (this.cycle.overdrive ? this.tireCount * 100 : 0)
                + (this.cycle.engine.highTorqueMotors ? this.tireCount * 100 : 0)
                + (this.cycle.engine.heavyDutyHighTorqueMotors ? this.tireCount * 200 : 0)
                + (this.rollCage ? 900 : 0);
            for (i = 0; i < this.crew.length; i++) total += this.crew[i].totalCost();
            for (i = 0; i < this.passengers.length; i++) total += this.passengers[i].totalCost();
            for (i = 0; i < this.accessories.length; i++) total += this.accessories[i].totalCost();
            for (i = 0; i < this.frontWeapons.length; i++) total += this.frontWeapons[i].totalCost();
            for (i = 0; i < this.backWeapons.length; i++) total += this.backWeapons[i].totalCost();
            for (i = 0; i < this.rightWeapons.length; i++) total += this.rightWeapons[i].totalCost();
            if (this.topTurret) total += this.topTurret.totalCost();
            var plasticPoints = this.frontArmor.plasticPoints + this.leftArmor.plasticPoints
                + this.rightArmor.plasticPoints + this.backArmor.plasticPoints
                + this.topArmor.plasticPoints + this.underbodyArmor.plasticPoints;
            var metalPoints = this.frontArmor.metalPoints + this.leftArmor.metalPoints
                + this.rightArmor.metalPoints + this.backArmor.metalPoints
                + this.topArmor.metalPoints + this.underbodyArmor.metalPoints;
            total += Math.ceil(plasticPoints * (this.frontArmor.plasticType ? this.frontArmor.plasticType.costFactor : 0) * (this.cycle.sloped ? 1.1 : 1) * this.armorCost - 0.0001);
            total += Math.ceil(metalPoints * (this.frontArmor.metalType ? this.frontArmor.metalType.costFactor : 0) * (this.cycle.sloped ? 1.1 : 1) * this.armorCost - 0.0001);
            if (this.jettisonJoinings) total += 300;

            return total;
        };
        car.totalWeight = function () {
            var i, total = (this.cycle.carbonAluminumFrame ? this.weight / 2 : this.weight)
                + Math.ceil(this.tireCount * this.tires.totalWeight() - 0.0001)
                + (this.wheelguards ? this.wheelguards.totalWeight(this.cycle.techLevel, true) * this.tireCount : 0)
                + (this.wheelhubs ? this.wheelhubs.totalWeight(this.cycle.techLevel, true) * this.tireCount : 0)
                + (this.cycle.heavyDutyShocks ? this.tireCount * 5 : 0)
                + (this.rollCage ? 30 * this.armorWeight : 0);
            for (i = 0; i < this.crew.length; i++) total += this.crew[i].totalWeight(this.cycle.personalEquipmentWeight);
            for (i = 0; i < this.passengers.length; i++) total += this.passengers[i].totalWeight(this.cycle.personalEquipmentWeight);
            for (i = 0; i < this.accessories.length; i++) total += this.accessories[i].totalWeight();
            for (i = 0; i < this.frontWeapons.length; i++) total += this.frontWeapons[i].totalWeight();
            for (i = 0; i < this.backWeapons.length; i++) total += this.backWeapons[i].totalWeight();
            for (i = 0; i < this.rightWeapons.length; i++) total += this.rightWeapons[i].totalWeight();
            if (this.topTurret) total += this.topTurret.totalWeight();
            var plasticPoints = this.frontArmor.plasticPoints + this.leftArmor.plasticPoints
                + this.rightArmor.plasticPoints + this.backArmor.plasticPoints
                + this.topArmor.plasticPoints + this.underbodyArmor.plasticPoints;
            var metalPoints = this.frontArmor.metalPoints + this.leftArmor.metalPoints
                + this.rightArmor.metalPoints + this.backArmor.metalPoints
                + this.topArmor.metalPoints + this.underbodyArmor.metalPoints;
            total += Math.ceil(plasticPoints * (this.frontArmor.plasticType ? this.frontArmor.plasticType.weightFactor : 0) * this.armorWeight - 0.0001);
            total += Math.ceil(metalPoints * (this.frontArmor.metalType ? this.frontArmor.metalType.weightFactor : 0) * this.armorWeight - 0.0001);

            return total;
        };
        car.spaceUsed = function () {
            var i, total = 0;
            for (i = 0; i < this.crew.length; i++) total += this.crew[i].totalSpace();
            for (i = 0; i < this.passengers.length; i++) total += this.passengers[i].totalSpace();
            for (i = 0; i < this.accessories.length; i++) total += this.accessories[i].totalSpace();
            for (i = 0; i < this.frontWeapons.length; i++) total += this.frontWeapons[i].totalSpace();
            for (i = 0; i < this.backWeapons.length; i++) total += this.backWeapons[i].totalSpace();
            for (i = 0; i < this.rightWeapons.length; i++) total += this.rightWeapons[i].totalSpace();
            if (this.topTurret) total += this.topTurret.totalSpace();
            return total;
        };
        car.spaceAvailable = function () {
            var total = this.spaces;
            if (this.cycle.streamlined) {
                if (this.cycle.sloped)
                    return Math.floor(total * 0.85);
                return Math.floor(total * 0.9);
            } else if (this.cycle.sloped) return Math.floor(total * 0.9);
            return total;
        };
        car.weaponSpacesRemainingIn = function (location, ignoreTotalSpace) { // iTS: true if moving around within, false if adding new
            if (/Turret/.test(location)) {
                return this.topTurret.remainingSpace();
            } else {
                return ignoreTotalSpace ? this.spaceAvailable() : Math.max(0, this.spaceAvailable() - this.spaceUsed());
            }
        };
        car.addWeapon = function (weapon, location) {
            var list;
            if (/[Tt]urret/.test(location)) {
                list = this.topTurret.weapons;
                if (this.topTurret.fake) weapon.setFake(true);
            } else {
                list = this[location.substr(0, 1).toLowerCase() + location.substring(1) + "Weapons"];
            }
            list.push(weapon);
            this.cycle.recalculate();
        };
        car.removeWeapon = function(weapon, location) {
            return this.cycle.removeWeapon.apply(this, [weapon, location]);
        };

        car.totalHC = function () {
            return this.suspension.hc;
        };

        car.changeType = function (type) {
            this.name = type.name;
            this.cost = type.cost;
            this.weight = type.weight;
            this.maxWeight = type.maxWeight;
            this.spaces = type.spaces;
            this.armorCost = type.armorCost;
            this.armorWeight = type.armorWeight;
            if (this.name === CW.sidecarBody.light.name || this.name === CW.sidecarBody.heavy.name) {
                if(this.topTurret && this.topTurret.builtIn) this.topTurret = null;
            } else if (this.name === CW.sidecarBody.oneSpaceCTS.name) {
                if (this.topTurret === null || !this.topTurret.builtIn) {
                    this.topTurret = CW.createTurret("Turret", 1);
                    this.topTurret.builtIn = true;
                }
                else this.topTurret.size = 1;
            } else if (this.name === CW.sidecarBody.twoSpaceCTS.name) {
                if (this.topTurret === null || !this.topTurret.builtIn) {
                    this.topTurret = CW.createTurret("Turret", 2);
                    this.topTurret.builtIn = true;
                }
                else this.topTurret.size = 2;
            }
        };

        car.nextSuspension = function () {
            if (this.suspension.name === CW.cycleSuspension.light.name) this.suspension = CW.cycleSuspension.improved;
            else if (this.suspension.name === CW.cycleSuspension.improved.name) this.suspension = CW.cycleSuspension.heavy;
            else if (this.suspension.name === CW.cycleSuspension.heavy.name) this.suspension = CW.cycleSuspension.off_road;
            else return;
            this.cycle.recalculate();
        };

        car.previousSuspension = function () {
            if (this.suspension.name === CW.cycleSuspension.off_road.name) this.suspension = CW.cycleSuspension.heavy;
            else if (this.suspension.name === CW.cycleSuspension.heavy.name) this.suspension = CW.cycleSuspension.improved;
            else if (this.suspension.name === CW.cycleSuspension.improved.name) this.suspension = CW.cycleSuspension.light;
            else return;
            this.cycle.recalculate();
        };

        car.recalculate = function () {
            this.cycle.recalculate();
        };
        car.hasOversizeWeaponFacings = function () {return false;};
        car.plasticArmorPoints = function () {
            return this.frontArmor.plasticPoints + this.leftArmor.plasticPoints
                + this.rightArmor.plasticPoints + this.backArmor.plasticPoints
                + this.topArmor.plasticPoints + this.underbodyArmor.plasticPoints;
        };
        car.metalArmorPoints = function () {
            return this.frontArmor.metalPoints + this.leftArmor.metalPoints
                + this.rightArmor.metalPoints + this.backArmor.metalPoints
                + this.topArmor.metalPoints + this.underbodyArmor.metalPoints;
        };
        car.boxPlasticArmorPoints = function () {
            return 0;
        };
        car.boxMetalArmorPoints = function () {
            return 0;
        };
        car.compositeArmor = car.cycle.compositeArmor;
        car.armorDescription = car.cycle.armorDescription;
        car.nextPlasticArmor = car.cycle.nextPlasticArmor;
        car.previousPlasticArmor = car.cycle.previousPlasticArmor;
        car.nextMetalArmor = car.cycle.nextMetalArmor;
        car.previousMetalArmor = car.cycle.previousMetalArmor;
        car.setPlasticArmor = car.cycle.setPlasticArmor;
        car.setMetalArmor = car.cycle.setMetalArmor;
        car.metalArmorStats = function () {
            if (this.frontArmor.metalType === null) return null;
            return {
                cost: Math.round(this.frontArmor.metalType.costFactor * this.armorCost * 100 * (this.cycle.sloped ? 1.1 : 1)) / 100,
                weight: Math.round(this.frontArmor.metalType.weightFactor * this.armorWeight * 100) / 100
            };
        };
        car.plasticArmorStats = function () {
            if (this.frontArmor.plasticType === null) return null;
            return {
                cost: Math.round(this.frontArmor.plasticType.costFactor * this.armorCost * 100 * (this.cycle.sloped ? 1.1 : 1)) / 100,
                weight: Math.round(this.frontArmor.plasticType.weightFactor * this.armorWeight * 100) / 100
            };
        };

        car.nextWheelguard = function () {
            if (this.wheelguards === null) {
                this.wheelguards = CW.createWheelArmor(this.frontArmor.plasticType, this.frontArmor.metalType, false);
                this.wheelguards.motorcycle = true;
                this.wheelguards.fake = true;
            } else if (this.wheelguards.fake) {
                this.wheelguards.fake = false;
                this.wheelguards.plasticPoints = 1;
            } else if (this.wheelguards.plasticPoints < Math.floor(10 / this.wheelguards.plasticType.weightFactor)) {
                this.wheelguards.plasticPoints += 1;
            }
            this.recalculate();
        };
        car.previousWheelguard = function () {
            if (this.wheelguards === null) return;
            if (this.wheelguards.fake) {
                this.wheelguards = null;
            } else if (this.wheelguards.plasticPoints === 1) {
                this.wheelguards.plasticPoints = 0;
                this.wheelguards.fake = true;
            } else {
                this.wheelguards.plasticPoints -= 1;
            }
            this.recalculate();
        };
        car.nextWheelhub = function () {
            if (this.wheelhubs === null) {
                this.wheelhubs = CW.createWheelArmor(this.frontArmor.plasticType, this.frontArmor.metalType, true);
                this.wheelhubs.motorcycle = true;
                this.wheelhubs.fake = true;
            } else if (this.wheelhubs.fake) {
                this.wheelhubs.fake = false;
                this.wheelhubs.plasticPoints = 1;
            } else if (this.wheelhubs.plasticPoints < Math.floor(10 / this.wheelhubs.plasticType.weightFactor)) {
                this.wheelhubs.plasticPoints += 1;
            }
            this.recalculate();
        };
        car.previousWheelhub = function () {
            if (this.wheelhubs === null) return;
            if (this.wheelhubs.fake) {
                this.wheelhubs = null;
            } else if (this.wheelhubs.plasticPoints === 1) {
                this.wheelhubs.plasticPoints = 0;
                this.wheelhubs.fake = true;
            } else {
                this.wheelhubs.plasticPoints -= 1;
            }
            this.recalculate();
        };

        car.addAccessory = car.cycle.addAccessory;
        car.removeAccessory = car.cycle.removeAccessory;
        car.getAccessory = car.cycle.getAccessory;

        car.tireToCopy = function() {return car.tires;};
        car.addSpareTireMatching = car.cycle.addSpareTireMatching;
        car.addSpareTireStandard = car.cycle.addSpareTireStandard;
        car.hasSpareTireMatching = car.cycle.hasSpareTireMatching;
        car.hasSpareTireStandard = car.cycle.hasSpareTireStandard;
        car.removeSpareTireMatching = car.cycle.removeSpareTireMatching;
        car.removeSpareTireStandard = car.cycle.removeSpareTireStandard;
        car.updateSpareTire = car.cycle.updateSpareTire;

        car.textDescription = function () {
            var i, text = "";
            if (this.cycle.streamlined) text += "Streamlined ";
            text += this.name + ", ";
            text += this.suspension.name + " Suspension, ";
            text += (this.tireCount === 2 ? "2 " + this.tires.textDescription() + " tires, " : this.tires.textDescription() + " tire, ");
            for (i = 0; i < this.crew.length; i++) text += this.crew[i].textDescription() + ", ";
            for (i = 0; i < this.passengers.length; i++) text += this.passengers[i].textDescription() + ", ";
            if (this.jettisonJoinings) text += "Jettison Joinings, ";
            if (this.rollCage) text += "Roll Cage, ";
            for (i = 0; i < this.frontWeapons.length; i++) text += this.frontWeapons[i].textDescription() + ", ";
            for (i = 0; i < this.rightWeapons.length; i++) text += this.rightWeapons[i].textDescription() + ", ";
            for (i = 0; i < this.backWeapons.length; i++) text += this.backWeapons[i].textDescription() + ", ";
            if (this.topTurret !== null) text += this.topTurret.textDescription('Top', this.cycle.weightUsed+this.totalWeight(), this.cycle.links.slice(0)) + ", ";
            for (i = 0; i < this.accessories.length; i++) {
                text += this.accessories[i].textDescription() + ", ";
            }
            var composite = this.compositeArmor();
            if (this.sloped) text += "Sloped ";
            text += this.armorDescription();
            var first = true;
            if (this.frontArmor.present()) {
                text += ": F" + this.frontArmor.armorPointDescription(composite);
                first = false;
            }
            if (this.leftArmor.present()) {
                if (!first) text += ', ';
                else text += ': ';
                text += "L" + this.leftArmor.armorPointDescription(composite);
                first = false;
            }
            if (this.rightArmor.present()) {
                if (!first) text += ', ';
                else text += ': ';
                text += "R" + this.rightArmor.armorPointDescription(composite);
                first = false;
            }
            if (this.backArmor.present()) {
                if (!first) text += ', ';
                else text += ': ';
                text += "B" + this.backArmor.armorPointDescription(composite);
                first = false;
            }
            if (this.topArmor.present()) {
                if (!first) text += ', ';
                else text += ': ';
                text += "T" + this.topArmor.armorPointDescription(composite);
                first = false;
            }
            if (this.underbodyArmor.present()) {
                if (!first) text += ', ';
                else text += ': ';
                text += "U" + this.underbodyArmor.armorPointDescription(composite);
            }
            text += ", ";
            if (this.wheelguards) text += (this.tireCount > 1 ? this.tireCount + " " : "") + this.wheelguards.textDescription() + " Wheelguard" + (this.tireCount > 1 ? "s" : "") + ", ";
            if (this.wheelhubs) text += (this.tireCount > 1 ? this.tireCount + " " : "") + this.wheelhubs.textDescription() + " Wheelhub" + (this.tireCount > 1 ? "s" : "") + ", ";
            text += this.totalWeight() + " lbs., ";
            text += "$" + this.totalCost();
            var weight = this.totalWeight();
            if (this.cycle.weightUsed + weight <= this.cycle.engine.totalPowerFactors() * 3 - 10 && weight <= this.maxWeight - 10 && Math.ceil(this.spaceUsed() * 10 - 0.0001) / 10 < this.spaceAvailable()) {
                var cargo = this.spaceAvailable() - Math.ceil(this.spaceUsed() * 10 - 0.0001) / 10;
                text += ", Cargo " + cargo + " space" + (cargo === 1 ? "" : "s") + " and " + Math.min(this.cycle.engine.totalPowerFactors() * 3 - this.cycle.weightUsed - weight, this.maxWeight - weight) + " lbs.";
            }
            return text;
        };

        return car;
    };

    CW.createWindshell = function (cycle) {
        var shell = {
            name: 'Cycle Windshell',
            cycle: cycle
        };
        shell.armor = null;

        shell.totalCost = function () {
            return 500 + this.armorCost();
        };

        shell.totalWeight = function () {
            return 50 + this.armorWeight();
        };

        shell.armorCost = function () {
            return this.armor ? Math.ceil(this.armor.totalCost(10) * this.cycle.armorTypeToMatch().costFactor - 0.0001) : 0;
        };

        shell.armorWeight = function () {
            return this.armor ? Math.ceil(this.armor.totalWeight(5) * this.cycle.armorTypeToMatch().weightFactor - 0.0001) : 0;
        };

        shell.totalDP = function () {
            return 2 + (this.armor ? this.armor.plasticPoints : 0);
        };

        return shell;
    };

    // ************************************* VALIDATION ROUTINES ******************************************

    CW.validateCycle = function (car) {
        var errors = [], i, engineError = false;
        var totalWeight = car.weightUsed + (car.sidecar ? car.sidecar.totalWeight() : 0);
        if (car.heavyDutyTransmission) {
            errors.push("Cycles cannot use HD Transmission");
        } else {
            if (totalWeight > car.engine.totalPowerFactors() * 3) {
                errors.push("Total vehicle weight " + totalWeight + " lbs. but engine can only move " + (car.engine.totalPowerFactors() * 3) + " lbs.");
                engineError = true;
            }
        }
        if (!car.frontTires.motorcycle || !car.backTires.motorcycle)
            errors.push("Cycles must use motorcycle tires");
        if (car.chassis.name !== CW.chassis.standard.name)
            errors.push("Cycles cannot have a modified chassis");
        if (car.sunroof) {
            errors.push("Cycles cannot use a sunroof");
        }
        if (car.ramplate || car.fakeRamplate) {
            errors.push("Cycles cannot use ramplates");
        }
        if (car.bumperSpikes) {
            if (car.brushcutter) errors.push("Cannot have bumper spikes and a brushcutter");
        }
        if (car.bodyBlades && car.fakeBodyBlades)
            errors.push("Cannot have both real and fake cycle blades");
        if (car.airdam)
            errors.push("Cycles cannot use an airdam");
        var cargoSafe = false, miniSafe = false, safeMods = false;
        for (i = 0; i < car.accessories.length; i++) {
            if (car.accessories[i].name === CW.accessories.LEFT_SIDE_DOOR.name || car.accessories[i].name === CW.accessories.RIGHT_SIDE_DOOR.name) {
                errors.push("Only vans and oversize vehicles may use a side door");
            } else if (car.accessories[i].name === CW.accessories.PASSENGER_ACCOMMODATIONS.name) {
                errors.push("Passenger accommodations require a Van or larger");
            } else if (car.accessories[i].name === CW.accessories.AMPHIBIOUS_MODIFICATIONS.name) {
                errors.push("Cycles cannot use amphibious modifications");
            } else if (car.accessories[i].name === CW.accessories.AUTOPILOT.name && !car.sidecar) {
                errors.push("Cycles cannot use an autopilot without a sidecar");
            } else if (car.accessories[i].name === CW.accessories.CAR_TOP_CARRIER_2.name
                || car.accessories[i].name === CW.accessories.CAR_TOP_CARRIER_4.name
                || car.accessories[i].name === CW.accessories.CAR_TOP_CARRIER_6.name
                || car.accessories[i].name === CW.accessories.FAKE_CAR_TOP_CARRIER.name) {
                errors.push("Cycles cannot use car top carriers");
            } else if (car.accessories[i].name === CW.accessories.CARGO_SAFE.name) {
                cargoSafe = true;
            } else if (car.accessories[i].name === CW.accessories.CARGO_SAFE_BREATHER.name ||
                car.accessories[i].name === CW.accessories.CARGO_SAFE_FRIDGE.name ||
                car.accessories[i].name === CW.accessories.CARGO_SAFE_SELF_DESTRUCT.name) {
                safeMods = true;
            } else if (car.accessories[i].name === CW.accessories.SMALL_MINI_SAFE.name) {
                miniSafe = true;
            } else if (car.accessories[i].name === CW.accessories.LARGE_MINI_SAFE.name) {
                miniSafe = true;
            }
            if (((!car.accessories[i].techLevel || car.accessories[i].techLevel === 'CWC') && car.techLevel === 'Classic') ||
                (car.accessories[i].techLevel && car.accessories[i].techLevel !== 'Classic' && car.accessories[i].techLevel !== 'CWC' && (car.techLevel === 'Classic' || car.techLevel === 'CWC')) ||
                (car.accessories[i].military && car.techLevel !== 'Military'))
                errors.push(car.accessories[i].name + " is not available with "+(car.techLevel === 'All' ? 'UACFH/Pyramid' : car.techLevel)+" technology");
        }
        CW.baseValidate(car, "Cycle", errors, engineError);
        if (safeMods && !cargoSafe) {
            if (miniSafe) errors.push("A mini-safe cannot use the normal cargo safe options");
            else errors.push("Cannot use cargo safe options without a cargo safe");
        }
        if(car.windshell) {
            if(car.techLevel === 'Classic') errors.push("Cycle Windshells are not available with Classic technology");
            if(car.windshell.armorWeight() > 50) errors.push("Cycle Windshells are limited to 50 lbs. of armor");
        }
        if (car.sidecar) {
            var radarDetector = false;
            for (i = 0; i < car.accessories.length; i++) {
                if (car.accessories[i].name === 'Radar Detector') radarDetector = true;
            }
            CW.validateAccessories(car.sidecar, errors);
            if(car.techLevel === 'Classic') {
                if (car.sidecar.tireCount > 1) errors.push("Sidecars may only have one tire with Classic technology");
                if(/Turret/.test(car.sidecar.name)) errors.push("Cycle Turret Sidecars are not available with Classic technology");
                if(car.sidecar.wheelhubs) errors.push("Armored Wheel Hubs are not available with Classic technology");
                if(car.sidecar.wheelguards && car.sidecar.wheelguards.fake) errors.push("Fake Wheelguards are not available with Classic technology");
            }
            if (car.windshell) errors.push("Cannot use both a cycle windshell and a sidecar");
            if (car.body.name === CW.cycleBody.light.name) errors.push("Light cycles cannot pull a sidecar");
            if (car.sidecar.totalWeight() > car.sidecar.maxWeight)
                errors.push("Sidecar weighs " + car.sidecar.totalWeight() + " lbs. but chassis can only handle " + car.sidecar.maxWeight + " lbs.");
            if (car.sidecar.spaceUsed() > car.sidecar.spaces)
                errors.push("Sidecar used " + car.sidecar.spaceUsed() + " spaces but only " + car.sidecar.spaces + " spaces available");
            if (!car.sidecar.tires.motorcycle)
                errors.push("Sidecars must use motorcycle tires");
            if (car.sidecar.topTurret) {
                if (car.sidecar.topTurret.name !== CW.turrets.Turret.name
                    && car.sidecar.topTurret.name !== CW.turrets.Pop_Up_Turret.name
                    && car.sidecar.topTurret.name !== CW.turrets.Pintle_Mount.name)
                    errors.push("The only sidecar turrets allowed are Turrets, Pop-Up Turrets, and Pintle Mounts");
            }
            for (i = 0; i < car.sidecar.crew.length; i++) {
                CW.validateCrew(errors, car.sidecar.crew[i], car.techLevel, !car.personalEquipmentWeight);
            }
            for (i = 0; i < car.sidecar.passengers.length; i++) {
                CW.validateCrew(errors, car.sidecar.passengers[i], car.techLevel, !car.personalEquipmentWeight);
            }
            CW.validateTire(errors, car.sidecar.tires, car.techLevel);
            if (!car.engine.electric && car.engine.laserBatteries < 1) {
                for (i = 0; i < car.sidecar.frontWeapons.length; i++) if (car.sidecar.frontWeapons[i].isLaser() && car.sidecar.frontWeapons[i].abbv !== 'TL')
                    errors.push("Cycles with gas engines cannot fire non-targeting lasers (" + car.sidecar.frontWeapons[i].abbv + ") without a laser battery");
                for (i = 0; i < car.sidecar.backWeapons.length; i++) if (car.sidecar.backWeapons[i].isLaser() && car.sidecar.backWeapons[i].abbv !== 'TL')
                    errors.push("Cycles with gas engines cannot fire non-targeting lasers (" + car.sidecar.backWeapons[i].abbv + ") without a laser battery");
                for (i = 0; i < car.sidecar.rightWeapons.length; i++) if (car.sidecar.rightWeapons[i].isLaser() && car.sidecar.rightWeapons[i].abbv !== 'TL')
                    errors.push("Cycles with gas engines cannot fire non-targeting lasers (" + car.sidecar.rightWeapons[i].abbv + ") without a laser battery");
                if (car.sidecar.topTurret)
                    for (i = 0; i < car.sidecar.topTurret.weapons.length; i++) if (car.sidecar.topTurret.weapons[i].isLaser() && car.sidecar.topTurret.weapons[i].abbv !== 'TL')
                        errors.push("Cycles with gas engines cannot fire non-targeting lasers (" + car.sidecar.topTurret.weapons[i].abbv + ") without a laser battery");
            }
            var front = 0, back = 0, frontCA = 0, backCA = 0, frontDischarger = 0, backDischarger = 0;
            var right = 0, rightCA = 0, rightDischarger = 0;
            for (i = 0; i < car.sidecar.frontWeapons.length; i++) {
                CW.validateWeapon(errors, radarDetector, car.sidecar.frontWeapons[i], car.techLevel);
                front += car.sidecar.frontWeapons[i].totalSpace();
                if (car.sidecar.frontWeapons[i].componentArmor) frontCA += 1;
                if (car.sidecar.frontWeapons[i].isDischarger()) frontDischarger += car.sidecar.frontWeapons[i].count;
            }
            for (i = 0; i < car.sidecar.backWeapons.length; i++) {
                CW.validateWeapon(errors, radarDetector, car.sidecar.backWeapons[i], car.techLevel);
                back += car.sidecar.backWeapons[i].totalSpace();
                if (car.sidecar.backWeapons[i].componentArmor) backCA += 1;
                if (car.sidecar.backWeapons[i].isDischarger()) backDischarger += car.sidecar.backWeapons[i].count;
            }
            for (i = 0; i < car.sidecar.rightWeapons.length; i++) {
                CW.validateWeapon(errors, radarDetector, car.sidecar.rightWeapons[i], car.techLevel);
                right += car.sidecar.rightWeapons[i].totalSpace();
                if (car.sidecar.rightWeapons[i].componentArmor) rightCA += 1;
                if (car.sidecar.rightWeapons[i].isDischarger()) rightDischarger += car.sidecar.rightWeapons[i].count;
            }
            if (frontDischarger > 1 || backDischarger > 1 || rightDischarger > 1)
                errors.push("A sidecar may only mount one discharger per facing");
            if (frontCA > 1 || backCA > 1 || rightCA > 1)
                errors.push("No more than one weapon or group per sidecar facing may have component armor");
            if (car.sidecar.topTurret) {
                CW.validateTurret(errors, car.sidecar, radarDetector, car.sidecar.topTurret, car.techLevel, 99);
            }
            var plastic = car.sidecar.frontArmor.plasticType;
            var metal = car.sidecar.frontArmor.metalType;
            if (car.sidecar.wheelguards && !car.sidecar.wheelguards.fake && car.sidecar.wheelguards.plasticType && car.sidecar.wheelguards.plasticType.name !== plastic.name)
                errors.push("Wheelguard plastic armor must match sidecar plastic armor!");
            if (car.sidecar.wheelguards && !car.sidecar.wheelguards.fake && car.sidecar.wheelguards.metalType && car.sidecar.wheelguards.metalType.name !== metal.name)
                errors.push("Wheelguard metal armor must match sidecar metal armor!");
            if (car.sidecar.wheelhubs && !car.sidecar.wheelhubs.fake && car.sidecar.wheelhubs.plasticType && car.sidecar.wheelhubs.plasticType.name !== plastic.name)
                errors.push("Wheelhub plastic armor must match sidecar plastic armor!");
            if (car.sidecar.wheelhubs && !car.sidecar.wheelhubs.fake && car.sidecar.wheelhubs.metalType && car.sidecar.wheelhubs.metalType.name !== metal.name)
                errors.push("Wheelhub metal armor must match sidecar metal armor!");
            // TODO: reference for whether sidecars should use car or cycle guards & hubs
            if (car.sidecar.wheelguards) CW.validateWheelArmor(errors, car.sidecar.wheelguards, "Sidecar Wheelguards", true, car.techLevel);
            if (car.sidecar.wheelhubs) CW.validateWheelArmor(errors, car.sidecar.wheelhubs, "Sidecar Wheelhubs", true, car.techLevel);
        }

        return errors;
    };

    // ************************************* DRAWING ROUTINES ******************************************

    CWD.createSidecarShape = function(sidecar) {
        var shape = CWD.createVehicleShape(sidecar);
        shape.bodyType = "Sidecar";
        shape.bodyStyle = CWD.sidecarBody1;
        shape.leftTire = null;
        shape.rightTire = CWD.createTireShape(sidecar.tires, "Sidecar Tires", "editSidecarTires", false, false);
        shape.rightTire.offset = 27;
        shape.phantomShapes = {
            frontWeapons: CWD.createShape("Sidecar Front Weapons", "editFrontWeapons"),
            backWeapons: CWD.createShape("Sidecar Back Weapons", "editBackWeapons"),
            rightWeapons: CWD.createShape("Sidecar Right Weapons", "editRightWeapons"),
            sidecar: CWD.createShape("Sidecar Options", "editBody")
        };

        var oldInitialize = shape.initializeVehicle;
        shape.initializeVehicle = function() {
            var i, j;
            oldInitialize.apply(this);
            if(this.car.tireCount === 2) this.addSecondTire(true);
            if(this.car.wheelguards) this.addWheelguards(this.car.wheelguards, true);
            if(this.car.wheelhubs) this.addWheelhubs(this.car.wheelhubs, true);
        };

        shape.hasTwoTires = function() {
            return !!this.leftTire;
        };
        shape.addSecondTire = function (suppressLayout) {
            this.leftTire = CWD.createTireShape(this.car.tires, "Sidecar Tires", "editSidecarTires", true, false);
            this.leftTire.offset = 27;
            var temp;
            if (this.backWheelhubs.length === 1) {
                temp = CWD.createWheelhubShape(this.backWheelhubs[0].wheelArmor, "Sidecar Wheelhubs", "editSidecarTires", true);
                shape.backWheelhubs.push(temp);
            }
            if (this.backWheelguards.length === 1) {
                temp = CWD.createWheelguardShape(this.backWheelguards[0].wheelArmor, "Sidecar Wheelguards", "editSidecarTires", true);
                shape.backWheelguards.push(temp);
            }
            if (!suppressLayout)
                this.layout();
        };
        shape.removeSecondTire = function () {
            this.leftTire = null;
            if (this.backWheelhubs.length === 2) this.backWheelhubs.pop();
            if (this.backWheelguards.length === 2) this.backWheelguards.pop();
        };
        shape.addWheelguards = function (guards, suppressLayout) {
            var temp = CWD.createWheelguardShape(guards, "Sidecar Wheelguards", "editSidecarTires", false);
            shape.backWheelguards.push(temp);
            if (this.car.tireCount === 2) {
                temp = CWD.createWheelguardShape(guards, "Sidecar Wheelguards", "editSidecarTires", true);
                shape.backWheelguards.push(temp);
            }
            if (!suppressLayout) {
                shape.layout();
            }
        };
        shape.removeWheelguards = function (suppressLayout) {
            shape.backWheelguards = [];
            if(!suppressLayout) shape.layout();
        };
        shape.addWheelhubs = function (hubs, suppressLayout) {
            var temp = CWD.createWheelhubShape(hubs, "Sidecar Wheelhubs", "editSidecarTires", false);
            shape.backWheelhubs.push(temp);
            if (this.car.tireCount === 2) {
                temp = CWD.createWheelhubShape(hubs, "Sidecar Wheelhubs", "editSidecarTires", true);
                shape.backWheelhubs.push(temp);
            }
            if (!suppressLayout) {
                shape.layout();
            }
        };
        shape.removeWheelhubs = function (suppressLayout) {
            shape.backWheelhubs = [];
            if(!suppressLayout) shape.layout();
        };

        shape.layoutVehicle = function(forceSameSize) {
            var offset, total, i;

            shape.componentHeight = 100;
            shape.columnWidth = 100;

            // Basics
            shape.cycle.totalHeight = shape.cycle.cycleOnlyHeight;
            shape.heightToBody = shape.cycle.heightToBody + shape.cycle.bodyHeight - 30;
            shape.bodyHeight = shape.componentHeight * 2 + CWD.padding;
            shape.widthToBody = 170;
            shape.bodyWidth = shape.columnWidth * 2 + CWD.padding;
            shape.cycle.totalHeight = shape.cycle.totalHeight - 30 + shape.bodyHeight; // TODO
            shape.x = shape.widthToBody;
            shape.y = shape.heightToBody;
            shape.w = shape.bodyWidth;
            shape.h = shape.bodyHeight;
            // Tires
            shape.rightTire.layout(shape.widthToBody + shape.bodyWidth / 4 + 20, shape.heightToBody + shape.bodyHeight - CWD.tireHeight - 10,
                CWD.tireWidth, CWD.tireHeight);
            if (shape.leftTire)
                shape.leftTire.layout(shape.widthToBody + shape.bodyWidth / 4 + 20, shape.heightToBody + 10,
                    CWD.tireWidth, CWD.tireHeight);
            if (shape.backWheelhubs.length > 0) {
                shape.cycle.totalHeight += CWD.whHeight;
                shape.backWheelhubs[0].layout( // Right
                        shape.widthToBody + shape.bodyWidth / 4 + 20, shape.heightToBody + shape.bodyHeight - 10,
                    CWD.tireWidth, CWD.whHeight
                );
                if (shape.backWheelhubs.length > 1) shape.backWheelhubs[1].layout( // Left
                        shape.widthToBody + shape.bodyWidth / 4 + 20, shape.heightToBody + 10 - CWD.whHeight,
                    CWD.tireWidth, CWD.whHeight
                );
            }
            if (shape.backWheelguards.length > 0) {
                shape.cycle.totalHeight += CWD.wgHeight;
                offset = shape.backWheelhubs.length > 0 ? CWD.whHeight : 0;
                shape.backWheelguards[0].layout( // Right
                        shape.widthToBody + shape.bodyWidth / 4 + 20, shape.heightToBody + shape.bodyHeight - 10 + offset,
                    CWD.tireWidth, CWD.wgHeight
                );
                if (shape.backWheelguards.length > 1) shape.backWheelguards[1].layout( // Left
                        shape.widthToBody + shape.bodyWidth / 4 + 20, shape.heightToBody + 10 - CWD.wgHeight - offset,
                    CWD.tireWidth, CWD.wgHeight
                );
            }
            // Contents  TODO: use new layout LASERS SHOULD BE HALF-HEIGHT!
            var top = null, bottom = null, front = null;
            if (shape.frontWeapons.length > 0) front = shape.frontWeapons;
            if (shape.rightWeapons.length > 0) bottom = shape.rightWeapons;
            if (shape.backWeapons.length > 0) top = shape.backWeapons;
            var people = shape.crew.concat(shape.passengers);
            if (people.length > 0) {
                if (!top) top = people;
                else if (!bottom) bottom = people;
                else if (!front) front = people;
            }
            if (shape.accessories.length > 0) {
                if (!top) top = shape.accessories;
                else if (!bottom) bottom = shape.accessories;
                else if (!front) front = shape.accessories;
            }
            if (shape.topTurret) {
                if (!front) front = [shape.topTurret];
                else if (!bottom) bottom = [shape.topTurret];
                else if (!top) top = [shape.topTurret];
            }

            if (front) {
                if (front.length === 1) {
                    front[0].layout(shape.widthToBody + (shape.columnWidth + CWD.padding) / (top || bottom ? 1 : 2),
                            shape.heightToBody + shape.componentHeight / 2, shape.columnWidth, shape.componentHeight);
                } else {
                    total = (top || bottom ? shape.componentHeight - 10 : shape.componentHeight * 2 - 60) / front.length;
                    offset = 10 / front.length;
                    for (i = 0; i < front.length; i++) {
                        front[i].layout(shape.widthToBody + (shape.columnWidth + CWD.padding) / (top || bottom ? 1 : 2),
                                shape.heightToBody + (top || bottom ? shape.componentHeight / 2 : 25) + i * (total + offset),
                            shape.columnWidth, total);
                    }
                }
            }
            if (top) {
                if (top.length === 1) {
                    top[0].layout(shape.widthToBody, shape.heightToBody + (bottom ? 0 : shape.componentHeight / 2 + 2),
                        shape.columnWidth, shape.componentHeight);
                } else {
                    total = (bottom ? shape.componentHeight - 10 : shape.componentHeight * 2 - 20) / top.length;
                    offset = (bottom ? 10 : 20) / top.length;
                    for (i = 0; i < top.length; i++) {
                        top[i].layout(shape.widthToBody,
                                shape.heightToBody + i * (total + offset),
                            shape.columnWidth, total);
                    }
                }
            }
            if (bottom) {
                if (bottom.length === 1) {
                    bottom[0].layout(shape.widthToBody, shape.heightToBody + (shape.componentHeight + CWD.padding) / (top ? 1 : 2),
                        shape.columnWidth, shape.componentHeight);
                    if (bottom[0].weapon) bottom[0].drawFullBarrel = top ? false : true; // Don't stick too far out the side
                } else {
                    if (bottom[0].weapon) {
                        total = (top || front ? shape.componentHeight - 10 : shape.componentHeight * 2 - 20) / bottom.length;
                        offset = (top || front ? 10 : 20) / bottom.length;
                        for (i = 0; i < bottom.length; i++) {
                            bottom[i].layout(shape.widthToBody + i * (total + offset),
                                    shape.heightToBody + (shape.componentHeight + CWD.padding) / (top ? 1 : 2),
                                shape.columnWidth, total);
                            bottom[i].drawFullBarrel = false; // To avoid overlapping the wheel
                        }
                    } else {
                        total = (top ? shape.componentHeight - 10 : shape.componentHeight * 2 - 20) / bottom.length;
                        offset = (top ? 10 : 20) / bottom.length;
                        for (i = 0; i < bottom.length; i++) {
                            bottom[i].layout(shape.widthToBody,
                                    shape.heightToBody + (shape.componentHeight + CWD.padding) * (top ? 1 : 0) + i * (total + offset),
                                shape.columnWidth, total);
                        }
                    }
                }
            }
            if (shape.topTurretWeapons.length === 1) {
                shape.topTurretWeapons[0].layout(
                        shape.topTurret.x + 5, shape.topTurret.y + 5, shape.topTurret.w - 10, shape.topTurret.h - 10);
            } else if (shape.topTurretWeapons.length > 1) {
                total = (shape.topTurret.h - 10) / shape.topTurretWeapons.length;
                for (i = 0; i < shape.topTurretWeapons.length; i++) {
                    shape.topTurretWeapons[i].layout(
                            shape.topTurret.x + 5, shape.topTurret.y + 5 + i * total, shape.topTurret.w - 10, total
                    );
                }
            }
            shape.phantomShapes.backWeapons.layout(this.widthToBody, this.heightToBody, 40, this.bodyHeight-40);
            shape.phantomShapes.rightWeapons.layout(this.widthToBody, this.heightToBody+this.bodyHeight-40, this.bodyWidth/2, 40);
            shape.phantomShapes.frontWeapons.layout(this.widthToBody+this.bodyWidth-50, this.heightToBody+40, 50, this.bodyHeight-90);

            return true;
        };

        shape.tireContains = function (mx, my) {
            var i;
            if (this.leftTire && this.leftTire.contains(mx, my)) return this.leftTire;
            if (this.rightTire.contains(mx, my)) return this.rightTire;
            for(i=0; i<this.backWheelguards.length; i++)
                if(this.backWheelguards[i].contains(mx, my)) return this.backWheelguards[i];
            for(i=0; i<this.backWheelhubs.length; i++)
                if(this.backWheelhubs[i].contains(mx, my)) return this.backWheelhubs[i];

            if (mx >= this.widthToBody && mx <= this.widthToBody + this.bodyWidth
                && my >= this.heightToBody && my <= this.heightToBody + this.bodyHeight) {
                return this.phantomShapes.sidecar;
            }

            return null;
        };

        shape.initializeVehicle();

        return shape;
    };

    CWD.createCycleShape = function (cycle) {
        var shape = CWD.createVehicleShape(cycle);
        shape.bodyType = "Cycle";
        shape.bodyStyle = CWD.cycleBody1;

        shape.frontTire = CWD.createSingleTireShape(cycle.frontTires, "Front Tire", "editFrontTires", true);
        shape.backTire = CWD.createSingleTireShape(cycle.backTires, "Back Tire", "editBackTires", false);
        shape.sidecar = null;

        shape.phantomShapes = {
            frontWeapons: CWD.createShape("Front Weapons", "editFrontWeapons"),
            backWeapons: CWD.createShape("Back Weapons", "editBackWeapons"),
            frontArmor: CWD.createShape("Front Armor", "editArmor"),
            backArmor: CWD.createShape("Back Armor", "editArmor"),
            body: CWD.createShape("Body Basics", "editBody")
        };

        shape.addFrontWheelguards = function (guards, suppressLayout) {
            var temp = CWD.createCycleWheelguardShape(guards, "Front Wheelguard", "editFrontTires", true);
            shape.frontWheelguards.push(temp);
            shape.shapes.push(temp);
            if (!suppressLayout) {
                shape.layout();
            }
        };
        shape.removeFrontWheelguards = function () {
            for (var i = 0; i < shape.frontWheelguards.length; i++) {
                shape.removeShape(shape.frontWheelguards[i]);
            }
            shape.frontWheelguards = [];
            shape.layout();
        };
        shape.addFrontWheelhubs = function (hubs, suppressLayout) {
            var temp = CWD.createWheelhubShape(hubs, "Front Wheelhubs", "editFrontTires", false);
            shape.frontWheelhubs.push(temp);
            temp = CWD.createWheelhubShape(hubs, "Front Wheelhubs", "editFrontTires", true);
            shape.frontWheelhubs.push(temp);
            if (!suppressLayout) {
                shape.layout();
            }
        };
        shape.removeFrontWheelhubs = function () {
            shape.frontWheelhubs = [];
            shape.layout();
        };
        shape.addBackWheelguards = function (guards, suppressLayout) {
            var temp = CWD.createCycleWheelguardShape(guards, "Back Wheelguard", "editBackTires", false);
            shape.backWheelguards.push(temp);
            shape.shapes.push(temp);
            if (!suppressLayout) {
                shape.layout();
            }
        };
        shape.removeBackWheelguards = function () {
            for (var i = 0; i < shape.backWheelguards.length; i++) {
                shape.removeShape(shape.backWheelguards[i]);
            }
            shape.backWheelguards = [];
            shape.layout();
        };
        shape.addBackWheelhubs = function (hubs, suppressLayout) {
            var temp = CWD.createWheelhubShape(hubs, "Back Wheelhubs", "editBackTires", false);
            shape.backWheelhubs.push(temp);
            temp = CWD.createWheelhubShape(hubs, "Back Wheelhubs", "editBackTires", true);
            shape.backWheelhubs.push(temp);
            if (!suppressLayout) {
                shape.layout();
            }
        };
        shape.removeBackWheelhubs = function () {
            shape.backWheelhubs = [];
            shape.layout();
        };

        shape.addSidecar = function(sidecar) {
            this.sidecar = CWD.createSidecarShape(sidecar);
            this.sidecar.colorScheme = this.colorScheme;
            this.sidecar.cycle = this;
            this.layout();
        };

        shape.removeSidecar = function() {
            this.sidecar = null;
            this.layout();
        };

        shape.configureLayout = function (size) {
            shape.bodyWidth = size.width * 105 - 5;
            shape.bodyHeight = 2 * 105 + 5;
            if (size.height > 2) {
                shape.bodyHeight += 60;
            }
            shape.heightToBody = 0;  // Just need the small +2 adjustment to have it center properly
            shape.widthToBody = -this.bodyStyle.getMinimumX(shape, 0, this.bodyWidth, this.heightToBody, this.bodyHeight)+2;
            shape.totalHeight = shape.heightToBody * 2 + shape.bodyHeight;
            shape.cycleOnlyHeight = shape.totalHeight;
            shape.w = shape.widthToBody + shape.bodyWidth + shape.frontGearWidth() +
                (shape.frontWheelguards.length > 0 && shape.backWheelguards.length === 0 ? 24 : 0);
            shape.h = shape.heightToBody * 2 + shape.bodyHeight;
        };
        shape.frontGearWidth = function() {
            return 5+this.bodyStyle.tireWidth+(shape.frontWheelguards.length > 0 ? this.bodyStyle.wheelguardWidth : 0);
        };

        // Cycle layout
        shape.layoutVehicle = function (forceSameSize) {
            var i, offset, size, cols = null, total;

            shape.componentHeight = 100;
            shape.columnWidth = 100;

            if (forceSameSize) {
                size = shape.layoutSize;
                cols = shape.layoutColumns;
            } else {
                size = {width: 5, height: 2};
                if (shape.weaponsAcross() > 1 || shape.cargoShapes.length > 1 || shape.crew.length > 1) {
                    size.height = 4;
                    cols = [
                        {height: 4},
                        {height: 4, componentHeight: 90},
                        {height: 2},
                        {height: 4, componentHeight: 75},
                        {height: 2, componentHeight: 140}
                    ];
                }
            }
            this.configureLayout(size);
            if (!this.layoutContents(size, cols)) {
                if (forceSameSize) return false;
            } // TODO: force it to lay out without expecting to expand
            for (i = 0; i < this.frontWeapons.length; i++) this.frontWeapons[i].drawFullBarrel = false;
            for (i = 0; i < this.backWeapons.length; i++) this.backWeapons[i].drawFullBarrel = false;

            // Lay out Tires, Wheelguards, Wheelhubs
            shape.bodyStyle.layoutTires(shape);

            shape.layoutDischargers(shape.widthToBody, shape.widthToBody + shape.bodyWidth, 0, 0);
            shape.layoutTurrets(size, shape.widthToBody + 90 + (size.width > 5 ? 50 : 0), shape.bodyHeight * 0.3 - 10);
            shape.layoutToolbars();
            shape.phantomShapes.backWeapons.layout(this.widthToBody, this.heightToBody+this.bodyHeight/4, 40, this.bodyHeight/2);

            return this.sidecar ? this.sidecar.layoutVehicle(forceSameSize) : true;
        };

        shape.initializeVehicle();
        if(shape.car.sidecar) shape.addSidecar(shape.car.sidecar);
        else shape.layout();

        shape.tireContains = function (mx, my) {
            var i;
            if (this.frontTire.contains(mx, my)) {
                return this.frontTire;
            }
            if (this.backTire.contains(mx, my)) {
                return this.backTire;
            }
            for (i = 0; i < this.frontWheelhubs.length; i++) if (this.frontWheelhubs[i].contains(mx, my)) return this.frontWheelhubs[i];
            for (i = 0; i < this.backWheelhubs.length; i++) if (this.backWheelhubs[i].contains(mx, my)) return this.backWheelhubs[i];
            var result = this.sidecar ? this.sidecar.contains(mx, my) : null;
            if (result && result.type !== 'Tire') result.sidecar = true;
            return result;
        };

        var oldLower = shape.drawLower;
        var oldMiddle = shape.drawMiddle;
        var oldUpper = shape.drawUpper;
        shape.drawLower = function (ctx, carOnly) {
            if(!this.suppressDrawing && this.sidecar) {
                // Bar between sidecar and car
                ctx.setTransform.apply(ctx, CWD.globalTransform);
                ctx.fillStyle = this.colorScheme.mainColor;
                ctx.fillRect(this.sidecar.widthToBody+this.sidecar.bodyWidth/4-10, this.heightToBody+this.bodyHeight/2,
                    20, (this.sidecar.heightToBody+this.sidecar.bodyHeight/2)-(this.heightToBody+this.bodyHeight/2));
            }
            oldLower.apply(this, [ctx, carOnly]);
            if (!this.suppressDrawing && this.sidecar) this.sidecar.drawLower(ctx, true);
        };
        shape.drawMiddle = function (ctx, carOnly) {
            if (!this.suppressDrawing && this.sidecar) this.sidecar.drawMiddle(ctx, true);
            oldMiddle.apply(this, [ctx, carOnly]);
        };
        shape.drawUpper = function (ctx, carOnly) {
            if (!this.suppressDrawing && this.sidecar) this.sidecar.drawUpper(ctx, true);
            oldUpper.apply(this, [ctx, carOnly]);
        };

        return shape;
    };

    CWD.createCycleWheelguardShape = function (wheelArmor, hoverText, hoverLink, isFront) {
        var shape = CWD.createShape(hoverText, hoverLink);
        shape.wheelArmor = wheelArmor;
        shape.damage = 0;

        shape.draw = function (ctx, borderColor) {
            if (isFront) {
                ctx.beginPath();
                ctx.strokeStyle = borderColor;
                ctx.fillStyle = CWD.backgroundColor;
                ctx.moveTo(this.x, this.y + this.h / 2);
                ctx.arcTo(this.x, this.y, this.x - 10, this.y, 8);
                ctx.lineTo(this.x - 10, this.y);
                ctx.arcTo(this.x - 50, this.y, this.x - 50, this.y - 5, 5);
                ctx.lineTo(this.x - 50, this.y - 5);
                ctx.arcTo(this.x - 50, this.y - 10, this.x - 40, this.y - 10, 5);
                ctx.lineTo(this.x - 40, this.y - 10);
                ctx.arcTo(this.x + this.w, this.y - 10, this.x + this.w, this.y, 8);
                ctx.lineTo(this.x + this.w, this.y);
                ctx.arcTo(this.x + this.w, this.y + this.h + 10, this.x + this.w - 10, this.y + this.h + 10, 8);
                ctx.lineTo(this.x + this.w - 10, this.y + this.h + 10);
                ctx.arcTo(this.x - 50, this.y + this.h + 10, this.x - 50, this.y + this.h + 5, 5);
                ctx.lineTo(this.x - 50, this.y + this.h + 5);
                ctx.arcTo(this.x - 50, this.y + this.h, this.x - 40, this.y + this.h, 5);
                ctx.lineTo(this.x - 40, this.y + this.h);
                ctx.arcTo(this.x, this.y + this.h, this.x, this.y + this.h - 10, 8);

                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.strokeStyle = borderColor;
                ctx.fillStyle = CWD.backgroundColor;
                ctx.moveTo(this.x + this.w, this.y + this.h / 2);
                ctx.arcTo(this.x + this.w, this.y, this.x + this.w + 10, this.y, 8);
                ctx.lineTo(this.x + this.w + 10, this.y);
                ctx.arcTo(this.x + this.w + 50, this.y, this.x + this.w + 50, this.y - 5, 5);
                ctx.lineTo(this.x + this.w + 50, this.y - 5);
                ctx.arcTo(this.x + this.w + 50, this.y - 10, this.x + this.w + 40, this.y - 10, 5);
                ctx.lineTo(this.x + this.w + 40, this.y - 10);
                ctx.arcTo(this.x, this.y - 10, this.x, this.y, 8);
                ctx.lineTo(this.x, this.y);
                ctx.arcTo(this.x, this.y + this.h + 10, this.x + 10, this.y + this.h + 10, 8);
                ctx.lineTo(this.x + 10, this.y + this.h + 10);
                ctx.arcTo(this.x + this.w + 50, this.y + this.h + 10, this.x + this.w + 50, this.y + this.h + 5, 5);
                ctx.lineTo(this.x + this.w + 50, this.y + this.h + 5);
                ctx.arcTo(this.x + this.w + 50, this.y + this.h, this.x + this.w + 40, this.y + this.h, 5);
                ctx.lineTo(this.x + this.w + 40, this.y + this.h);
                ctx.arcTo(this.x + this.w, this.y + this.h, this.x + this.w, this.y + this.h - 10, 8);

                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }

            var dpRows, dpCols, dph = 9, dpw;
            if (wheelArmor.plasticPoints < 6) {
                dpRows = wheelArmor.plasticPoints;
                dpCols = 1;
                dpw = 9;
            } else {
                dpCols = 2;
                dpRows = Math.ceil(wheelArmor.plasticPoints / 2 - 0.0001);
                dpw = 8;
            }
            ctx.beginPath();
            ctx.fillStyle = CWD.dpFill;
            ctx.strokeStyle = CWD.mainStroke;
            var dpx = this.x + this.w / 2 - (dpCols * dpw) / 2;
            var dpy = this.y + this.h / 2 - (dpRows * dph) / 2;
            CWD.drawDP(ctx, dpx, dpy, dpw, dph, wheelArmor.plasticPoints, {rows: dpRows, cols: dpCols}, this.damage);

        };

        return shape;
    };
})();