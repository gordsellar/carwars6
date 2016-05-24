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

    CW.carTrailerBody = {
        mini_van: {
            name: 'Mini-Van',
            cost: 200,
            weight: 400,
            maxWeight: 900,
            spaces: 3,
            cargoSpaces: 0,
            tongueDP: 1,
            tirePairs: 1,
            armorCost: 9,
            armorWeight: 5,
            maxTurretSize: 0,
            maxRPSize: 1,
            maxEWPSize: 1,
            dischargers: 1,
            facings: 6
        },
        van_6: {
            name: "6' Van",
            cost: 450,
            weight: 1000,
            maxWeight: 2800,
            spaces: 12,
            cargoSpaces: 0,
            tongueDP: 2,
            tirePairs: 1,
            armorCost: 15,
            armorWeight: 7,
            maxTurretSize: 1,
            maxRPSize: 2,
            maxEWPSize: 1,
            dischargers: 1,
            facings: 6
        },
        flatbed_6: {
            name: "6' Flatbed",
            cost: 300,
            weight: 700,
            maxWeight: 3700,
            spaces: 4,
            cargoSpaces: 8,
            tongueDP: 2,
            tirePairs: 1,
            armorCost: 15,
            armorWeight: 7,
            maxTurretSize: 0,
            maxRPSize: 0,
            maxEWPSize: 0,
            dischargers: 1,
            facings: 6
        },
        van_10: {
            name: "10' Van",
            cost: 700,
            weight: 1600,
            maxWeight: 4700,
            spaces: 20,
            cargoSpaces: 0,
            tongueDP: 2,
            tirePairs: 1,
            armorCost: 10,
            armorWeight: 10,
            maxTurretSize: 2,
            maxRPSize: 2,
            maxEWPSize: 2,
            dischargers: 1,
            facings: 6
        },
        flatbed_10: {
            name: "10' Flatbed",
            cost: 475,
            weight: 1100,
            maxWeight: 6200,
            spaces: 4,
            cargoSpaces: 13,
            tongueDP: 2,
            tirePairs: 1,
            armorCost: 19,
            armorWeight: 10,
            maxTurretSize: 0,
            maxRPSize: 0,
            maxEWPSize: 0,
            dischargers: 1,
            facings: 6
        },
        van_15: {
            name: "15' Van",
            cost: 1000,
            weight: 2300,
            maxWeight: 7200,
            spaces: 30,
            cargoSpaces: 0,
            tongueDP: 3,
            tirePairs: 2,
            armorCost: 25,
            armorWeight: 13,
            maxTurretSize: 3,
            maxRPSize: 3,
            maxEWPSize: 3,
            dischargers: 2,
            facings: 6
        },
        flatbed_15: {
            name: "15' Flatbed",
            cost: 675,
            weight: 1500,
            maxWeight: 9500,
            spaces: 4,
            cargoSpaces: 19,
            tongueDP: 3,
            tirePairs: 2,
            armorCost: 25,
            armorWeight: 13,
            maxTurretSize: 0,
            maxRPSize: 0,
            maxEWPSize: 0,
            dischargers: 2,
            facings: 6
        },
        van_20: {
            name: "20' Van",
            cost: 1300,
            weight: 2800,
            maxWeight: 9400,
            spaces: 38,
            cargoSpaces: 0,
            tongueDP: 3,
            tirePairs: 2,
            armorCost: 30,
            armorWeight: 16,
            maxTurretSize: 4,
            maxRPSize: 3,
            maxEWPSize: 3,
            dischargers: 2,
            facings: 10
        },
        flatbed_20: {
            name: "20' Flatbed",
            cost: 875,
            weight: 1900,
            maxWeight: 12400,
            spaces: 4,
            cargoSpaces: 24,
            tongueDP: 3,
            tirePairs: 2,
            armorCost: 30,
            armorWeight: 16,
            maxTurretSize: 0,
            maxRPSize: 0,
            maxEWPSize: 0,
            dischargers: 2,
            facings: 10
        },
        van_25: {
            name: "25' Van",
            cost: 1600,
            weight: 3300,
            maxWeight: 11900,
            spaces: 46,
            cargoSpaces: 0,
            tongueDP: 4,
            tirePairs: 4,
            armorCost: 35,
            armorWeight: 17,
            maxTurretSize: 4,
            maxRPSize: 3,
            maxEWPSize: 3,
            dischargers: 3,
            facings: 10
        },
        flatbed_25: {
            name: "25' Flatbed",
            cost: 1075,
            weight: 2200,
            maxWeight: 15700,
            spaces: 4,
            cargoSpaces: 29,
            tongueDP: 4,
            tirePairs: 4,
            armorCost: 35,
            armorWeight: 17,
            maxTurretSize: 0,
            maxRPSize: 0,
            maxEWPSize: 0,
            dischargers: 3,
            facings: 10
        },
        van_30: {
            name: "30' Van",
            cost: 1900,
            weight: 3500,
            maxWeight: 14100,
            spaces: 54,
            cargoSpaces: 0,
            tongueDP: 4,
            tirePairs: 4,
            armorCost: 40,
            armorWeight: 18,
            maxTurretSize: 4,
            maxRPSize: 3,
            maxEWPSize: 3,
            dischargers: 4,
            facings: 10
        },
        flatbed_30: {
            name: "30' Flatbed",
            cost: 1250,
            weight: 2300,
            maxWeight: 18600,
            spaces: 4,
            cargoSpaces: 35,
            tongueDP: 4,
            tirePairs: 4,
            armorCost: 40,
            armorWeight: 18,
            maxTurretSize: 0,
            maxRPSize: 0,
            maxEWPSize: 0,
            dischargers: 4,
            facings: 10
        }
    };

    CW.carTrailerMods = {
        reefer: {
            name: 'Reefer',
            costFactor: 0.6,
            weightFactor: 0.15,
            spaceFactor: 0.15
        },
        tanker: {
            name: 'Tanker',
            costFactor: 1.5,
            weightFactor: 0.6,
            spaceFactor: 0.15
        },
        dumper: {
            name: 'Dumper',
            costFactor: 0.75,
            weightFactor: 1,
            spaceFactor: 0
        }
    };

    CW.createCarTrailer = function () {
        var trailer = CW.createOversizeVehicle();
        trailer.body = CW.carTrailerBody.mini_van;
        trailer.engine = null;
        trailer.chassis = CW.chassis.standard;
        trailer.suspension = CW.carSuspension.light;
        trailer.crew = [];
        trailer.frontTires = null;
        trailer.middleOrOuterTires = null;
        trailer.backTires = CW.createTire('Standard', true);
        trailer.powerPlantList = [];
        trailer.frontArmor = CW.createArmor(1);
        trailer.leftArmor = CW.createArmor(1);
        trailer.rightArmor = CW.createArmor(1);
        trailer.backArmor = CW.createArmor(1);
        trailer.topArmor = CW.createArmor(1);
        trailer.underbodyArmor = CW.createArmor(1);
        trailer.type = "CarTrailer";

        trailer.tireCount = function () {
            return this.body.tirePairs * 2;
        };
        trailer.frontTireCount = function () {
            return 0;
        };
        trailer.middleTireCount = function () {
            return 0;
        };
        trailer.backTireCount = function () {
            return this.body.tirePairs * 2;
        };
        trailer.backExposedTireCount = function () {
            return Math.min(2, this.body.tirePairs) * 2;
        };

        trailer.recalculate = function () {
            this.baseRecalculate();
            if (this.isFlatbed()) {
                this.maxWeaponSpacesPerSide = 4; // No 1/3 spaces
            } else if (this.body.name === CW.carTrailerBody.mini_van.name) {
                this.maxWeaponSpacesPerSide = 3; // No 1/3 spaces
            }

            if (this.onRecalculate) this.onRecalculate();
            if (CW.validateCarTrailer) {
                var errors = CW.validateCarTrailer(this);
                this.legal = errors.length === 0;
                if (this.onErrors)
                    this.onErrors(errors); // Call even when no errors so the prior list can be cleared
            } else {
                if (this.onErrors)
                    this.onErrors([]);
            }
        };

        trailer.hasDoubleWheels = function () {
            return this.body.tirePairs > 2;
        };
        trailer.hasOversizeWeaponFacings = function () {
            return trailer.isOversize() && !this.isFlatbed();
        };

        trailer.totalTongueDP = function () {
            if (trailer.chassis.name === CW.chassis.light.name) return this.body.tongueDP - Math.floor(this.body.tongueDP / 2 + 0.0001);
            if (trailer.chassis.name === CW.chassis.heavy.name) return this.body.tongueDP + Math.floor(this.body.tongueDP / 2 + 0.0001);
            if (trailer.chassis.name === CW.chassis.extra_heavy.name) return this.body.tongueDP * 2;
            return this.body.tongueDP;
        };

        var bodyOptions = [CW.carTrailerBody.mini_van, CW.carTrailerBody.van_6, CW.carTrailerBody.van_10,
            CW.carTrailerBody.van_15, CW.carTrailerBody.van_20, CW.carTrailerBody.van_25, CW.carTrailerBody.van_30];
        var flatbedOptions = [CW.carTrailerBody.mini_van, CW.carTrailerBody.flatbed_6, CW.carTrailerBody.flatbed_10,
            CW.carTrailerBody.flatbed_15, CW.carTrailerBody.flatbed_20, CW.carTrailerBody.flatbed_25,
            CW.carTrailerBody.flatbed_30];
        var chassisOptions = [CW.chassis.light, CW.chassis.standard, CW.chassis.heavy, CW.chassis.extra_heavy];

        trailer.bodyOptions = function() {
            return this.isFlatbed() ? flatbedOptions : bodyOptions;
        };
        trailer.setBody = function(name) {
            if(name.indexOf(" Trailer") > -1) {
                if(this.body.name.indexOf('Van') > -1) name = name.replace("Trailer", "Van");
                else if(this.body.name.indexOf('Flatbed') > -1) name = name.replace("Trailer", "Flatbed");
                else throw "Unknown current body type '"+this.body.name+"'";
            }
            this.body = CW.findByName(CW.carTrailerBody, name);
            if (this.body.name === CW.carTrailerBody.mini_van.name) {
                this.flatbedArmor = null;
                this.flatbedBackArmor = null;
                this.backTires.motorcycle = true;
            } else this.backTires.motorcycle = false;
            if (this.isOversize()) {
                if (!this.leftBackArmor) this.leftBackArmor = CW.createArmor(1);
                if (!this.rightBackArmor) this.rightBackArmor = CW.createArmor(1);
                if (!this.topBackArmor) this.topBackArmor = CW.createArmor(1);
                if (!this.underbodyBackArmor) this.underbodyBackArmor = CW.createArmor(1);
                if (this.isFlatbed() && !this.flatbedBackArmor) this.flatbedBackArmor = CW.createArmor(1);
            } else {
                this.leftBackArmor = null;
                this.rightBackArmor = null;
                this.topBackArmor = null;
                this.underbodyBackArmor = null;
                this.flatbedBackArmor = null;
            }
            this.recalculate();
        };
        trailer.nextBody = function () {
            var i;
            var options = this.isFlatbed() ? flatbedOptions : bodyOptions;
            for (i = 1; i < options.length; i++) {
                if (this.body === options[i - 1]) {
                    this.body = options[i];
                    break;
                }
            }
            this.backTires.motorcycle = false;
            if (this.isOversize()) {
                if (!this.leftBackArmor) this.leftBackArmor = CW.createArmor(1);
                if (!this.rightBackArmor) this.rightBackArmor = CW.createArmor(1);
                if (!this.topBackArmor) this.topBackArmor = CW.createArmor(1);
                if (!this.underbodyBackArmor) this.underbodyBackArmor = CW.createArmor(1);
                if (this.isFlatbed() && !this.flatbedBackArmor) this.flatbedBackArmor = CW.createArmor(1);
            } else {
                this.leftBackArmor = null;
                this.rightBackArmor = null;
                this.topBackArmor = null;
                this.underbodyBackArmor = null;
                this.flatbedBackArmor = null;
            }
            this.recalculate();
        };
        trailer.previousBody = function () {
            var i;
            var options = this.isFlatbed() ? flatbedOptions : bodyOptions;
            for (i = options.length - 2; i >= 0; i--) {
                if (this.body === options[i + 1]) {
                    this.body = options[i];
                    break;
                }
            }
            if (this.body.name === CW.carTrailerBody.mini_van.name) {
                this.flatbedArmor = null;
                this.flatbedBackArmor = null;
                this.backTires.motorcycle = true;
            }
            if (this.isOversize()) {
                if (!this.leftBackArmor) this.leftBackArmor = CW.createArmor(1);
                if (!this.rightBackArmor) this.rightBackArmor = CW.createArmor(1);
                if (!this.topBackArmor) this.topBackArmor = CW.createArmor(1);
                if (!this.underbodyBackArmor) this.underbodyBackArmor = CW.createArmor(1);
                if (this.isFlatbed() && !this.flatbedBackArmor) this.flatbedBackArmor = CW.createArmor(1);
            } else {
                this.leftBackArmor = null;
                this.rightBackArmor = null;
                this.topBackArmor = null;
                this.underbodyBackArmor = null;
                this.flatbedBackArmor = null;
            }
            this.recalculate();
        };

        trailer.setTrailerType = function(type) { // e.g. "Van" or "Reefer" or "Flatbed"
            if(type === "Flatbed") {
                if(this.body.name !== CW.carTrailerBody.mini_van.name && !this.isFlatbed()) {
                    this.trailerStyle = null;
                    this.body = CW.findByName(CW.carTrailerBody, this.body.name.replace("Van", "Flatbed"));
                    this.flatbedArmor = CW.createArmor(1);
                    if(this.isOversize()) this.flatbedBackArmor = CW.createArmor(1);
                }
            } else {
                if(this.isFlatbed()) {
                    this.body = CW.findByName(CW.carTrailerBody, this.body.name.replace("Flatbed", "Van"));
                    this.flatbedArmor = null;
                    this.flatbedBackArmor = null;
                }
                if(type === "Van") {
                    this.trailerStyle = null;
                } else if(type === "Reefer") {
                    this.trailerStyle = CW.carTrailerMods.reefer;
                } else if(type === "Tanker") {
                    this.trailerStyle = CW.carTrailerMods.tanker;
                } else if(type === "Dumper") {
                    this.trailerStyle = CW.carTrailerMods.dumper;
                }
            }
            this.recalculate();
        };
        trailer.trailerType = function() {
            if(this.isFlatbed()) return "Flatbed";
            if(!this.trailerStyle) return "Van";
            return this.trailerStyle.name;
        };

        trailer.nextChassis = function () {
            var i;
            for (i = 1; i < chassisOptions.length; i++) {
                if (this.chassis === chassisOptions[i - 1]) {
                    this.chassis = chassisOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        trailer.previousChassis = function () {
            var i;
            for (i = chassisOptions.length - 2; i >= 0; i--) {
                if (this.chassis === chassisOptions[i + 1]) {
                    this.chassis = chassisOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        trailer.nextFrontTire = function () {
        };
        trailer.previousFrontTire = function () {
        };
        trailer.isDumper = function() {
            return this.trailerStyle && this.trailerStyle === CW.carTrailerMods.dumper;
        };
        trailer.isVan = function() {
            return !this.trailerStyle && /Van/.test(this.body.name);
        };

        trailer.recalculate();

        return trailer;
    };

    // ************************************* VALIDATION ROUTINES ******************************************

    CW.validateCarTrailer = function (car) {
        var errors = [], i;
        var flatbed = car.isFlatbed();
        if (car.trailerStyle) {
            if (flatbed) {
                errors.push("A flatbed cannot be a reefer, tanker, or dumper");
            } else {
                if (car.trailerStyle.name === CW.carTrailerMods.tanker.name) {
                    if ((car.frontArmor.plasticPoints < 20 && car.frontArmor.metalPoints < 4) ||
                        (car.backArmor.plasticPoints < 20 && car.backArmor.metalPoints < 4) ||
                        (car.leftArmor.plasticPoints < 20 && car.leftArmor.metalPoints < 4) ||
                        (car.rightArmor.plasticPoints < 20 && car.rightArmor.metalPoints < 4) ||
                        (car.topArmor.plasticPoints < 20 && car.topArmor.metalPoints < 4) ||
                        (car.underbodyArmor.plasticPoints < 20 && car.underbodyArmor.metalPoints < 4))
                        errors.push("A tanker must have 20 points of plastic or 4 points of metal armor in every location");
                }
                if (car.trailerStyle.name === CW.carTrailerMods.dumper.name) {
                    if (car.topTurret || car.sunroof) errors.push("A dumper cannot mount a turret or sunroof");
                    if (car.topArmor.plasticPoints > 0 || car.topArmor.metalPoints > 0) errors.push("A dumper cannot have top armor");
                }
            }
        }

        if (car.frontTires || car.middleOrOuterTires || car.frontWheelguards || car.frontWheelhubs || car.middleWheelguards || car.middleWheelhubs)
            errors.push("A car trailer should only have back tires and back tire armor");
        if (car.body.name === CW.carTrailerBody.mini_van.name) {
            if (!car.backTires.motorcycle)
                errors.push("A mini-van trailer must use motorcycle tires");
        } else {
            if (car.backTires.motorcycle)
                errors.push("Trailers larger than a mini-van may not use motorcycle tires");
        }
        if (car.sunroof) {
            if (flatbed) errors.push("A flatbed cannot have a sunroof");
            if (car.isOversize()) {
                if (car.topTurret && car.topTurret.name !== CW.turrets.Pintle_Mount.name &&
                    car.topBackTurret && car.topBackTurret.name !== CW.turrets.Pintle_Mount.name)
                    errors.push("Cannot have a sunroof and two top turrets");
            } else {
                if (car.topTurret && car.topTurret.name !== CW.turrets.Pintle_Mount.name) errors.push("Cannot have a sunroof and a " + car.topTurret.name);
            }
        }
        if (flatbed) {
            if (car.noPaintWindshield)
                errors.push("A flatbed trailer cannot have a no-paint windshield");
            if (car.sideTurret || car.topTurret) errors.push("A flatbed cannot mount a turret/EWP/etc.");
        }
        if (car.activeSuspension)
            errors.push("Only cars, cycles, and trikes can use an Active Suspension");
        if (car.heavyDutyTransmission) errors.push("A car trailer cannot use a heavy-duty transmission");
        if (car.ramplate || car.fakeRamplate) errors.push("A car trailer cannot use a ramplate");
        if (car.brushcutter) errors.push("A car trailer cannot use a brushcutter");
        if (car.bumperSpikes) errors.push("A car trailer cannot use front bumper spikes");
        if (car.bodyBlades && car.fakeBodyBlades)
            errors.push("Cannot have both real and fake body blades");
        var carTopCount = 0;
        var carTopSpace = 0;
        var feCount = 0;
        var carTopFake = false;
        var cargoSafe = false, miniSafe = false, safeMods = false;
        for (i = 0; i < car.accessories.length; i++) {
            if (car.accessories[i].name === CW.accessories.CAR_TOP_CARRIER_2.name) {
                ++carTopCount;
                if (carTopSpace < 2) carTopSpace = 2;
            } else if (car.accessories[i].name === CW.accessories.CAR_TOP_CARRIER_4.name) {
                ++carTopCount;
                if (carTopSpace < 4) carTopSpace = 4;
            } else if (car.accessories[i].name === CW.accessories.CAR_TOP_CARRIER_6.name) {
                ++carTopCount;
                if (carTopSpace < 6) carTopSpace = 6;
            } else if (car.accessories[i].name === CW.accessories.FAKE_CAR_TOP_CARRIER.name) {
                ++carTopCount;
                carTopFake = true;
            } else if (car.accessories[i].name === CW.accessories.AMPHIBIOUS_MODIFICATIONS.name) {
                errors.push("A trailer cannot use amphibious modifications");
            } else if (car.accessories[i].name === CW.accessories.STEALTH_CAR.name) {
                errors.push("A trailer cannot use Stealth");
            } else if (car.accessories[i].name === CW.accessories.FIRE_EXTINGUISHER.name || car.accessories[i].name === CW.accessories.IMPROVED_FIRE_EXTINGUISHER.name) {
                feCount += 1;
            } else if (car.accessories[i].name === CW.accessories.TINTED_WINDOWS.name) {
                if (flatbed)
                    errors.push("A flatbed trailer cannot use tinted windows");
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
            } else if (
                ((!car.accessories[i].techLevel || car.accessories[i].techLevel === 'CWC') && car.techLevel === 'Classic') ||
                (car.accessories[i].techLevel && car.accessories[i].techLevel !== 'Classic' && car.accessories[i].techLevel !== 'CWC' && (car.techLevel === 'Classic' || car.techLevel === 'CWC')) ||
                (car.accessories[i].military && car.techLevel !== 'Military')) {
                errors.push("Cannot use " + car.accessories[i].name + " at the current tech level");
            }
        }
        if (feCount > 1)
            errors.push("A trailer may only mount a single fire extinguisher");
        if (carTopCount > 1)
            errors.push("A trailer may only mount a single car top carrier");
        if (carTopSpace > car.maxWeaponSpacesPerSide)
            errors.push("The selected car-top carrier is too large for this trailer");
        if (carTopCount > 0 && !carTopFake && car.topTurret) // TODO: oversize car trailers
            errors.push("A trailer with a top " + car.topTurret.name + " cannot mount a car-top carrier");
        if (safeMods && !cargoSafe) {
            if (miniSafe) errors.push("A mini-safe cannot use the normal cargo safe options");
            else errors.push("Cannot use cargo safe options without a cargo safe");
        }

        CW.baseValidate(car, "Car Trailer", errors, false);

        return errors;
    };

    // ************************************* DRAWING ROUTINES ******************************************

    CWD.createCarTrailerShape = function (trailer) {
        var i, shape = CWD.createOversizeVehicleShape(trailer);
        shape.bodyType = "CarTrailer";
        shape.bodyStyle = CWD.carTrailerBody;
        shape.leftTires = [];
        shape.rightTires = [];
        for (i = 0; i < trailer.body.tirePairs; i++) {
            shape.leftTires.push(CWD.createTireShape(trailer.backTires, "Tires", "editBackTires", true, false /*i < 2*/));
            shape.rightTires.push(CWD.createTireShape(trailer.backTires, "Tires", "editBackTires", false, false /*i < 2*/));
        }

        // Car Trailer Layout
        shape.layoutVehicle = function (forceSameSize) {
            var offset, voffset, size;

            shape.componentHeight = 100;
            shape.columnWidth = 100;

            var flatbed = this.car.isFlatbed();

            if (forceSameSize) {
                size = shape.layoutSize;
                this.configureLayout(size);
                if (!this.layoutContents(size)) return false;
            } else {
                if (this.car.body.name === CW.carTrailerBody.mini_van.name || flatbed) {
                    size = {width: 3, height: 4};
                    if (this.leftTurret || this.rightTurret)
                        size.width += 1;
                    if (this.leftBackTurret || this.rightBackTurret)
                        size.width += 1;
                }
                else if (this.car.body.name === CW.carTrailerBody.van_6.name || this.car.body.name === CW.carTrailerBody.flatbed_6.name)
                    size = {width: 4, height: 4};
                else if (this.car.body.facings > 6)
                    size = {width: 6, height: 4};
                else
                    size = {width: 5, height: 4};
                size = this.findMinimumSize(size);
            }

            // Lay out Tires, Wheelguards, Wheelhubs
            offset = shape.bodyStyle.layoutTires(shape, size, flatbed);

            if (shape.car.hasOversizeWeaponFacings()) {
                if (shape.leftBackTurret || shape.rightBackTurret) offset += 10;
                shape.layout3Turrets(size, offset, shape.bodyHeight / 2, shape.leftBackTurret, shape.rightBackTurret, shape.topBackTurret);
                offset += 125;
                shape.layoutTurrets(size, offset, shape.bodyHeight / 2);
            } else {
                shape.layoutTurrets(size, offset, shape.bodyHeight / 2);
            }
            if (shape.leftTurret || shape.rightTurret) offset += 125;
            voffset = flatbed ? -5 : 0;
            shape.layoutDischargers(offset, offset + 50, 0, 0, 0, voffset, voffset, offset, voffset - 15, offset + 50, voffset - 15);

            if (shape.car.hasOversizeWeaponFacings()) {
                shape.maximumX = shape.widthToBody+shape.bodyWidth+shape.frontGearWidth();
                shape.phantomShapes.frontWeapons.layout(shape.widthToBody + shape.bodyWidth - 60, shape.heightToBody + 20, 40, shape.bodyHeight - 40);
                shape.phantomShapes.frontArmor.layout(shape.widthToBody + shape.bodyWidth - 20, shape.heightToBody + 20, 20, shape.bodyHeight - 40);
                shape.phantomShapes.backWeapons.layout(shape.widthToBody + 20, shape.heightToBody + 20, 40, shape.bodyHeight - 40);
                shape.phantomShapes.backArmor.layout(shape.widthToBody, shape.heightToBody + 20, 20, shape.bodyHeight - 40);
                shape.phantomShapes.leftWeapons.layout(shape.widthToBody + shape.bodyWidth / 2, shape.heightToBody + 20, shape.bodyWidth / 2 - 20, 40);
                shape.phantomShapes.leftBackWeapons.layout(shape.widthToBody + 20, shape.heightToBody + 20, shape.bodyWidth / 2 - 20, 40);
                shape.phantomShapes.leftArmor.layout(shape.widthToBody + shape.bodyWidth / 2, shape.heightToBody, shape.bodyWidth / 2 - 20, 20);
                shape.phantomShapes.leftBackArmor.layout(shape.widthToBody + 20, shape.heightToBody, shape.bodyWidth / 2 - 20, 20);
                shape.phantomShapes.rightWeapons.layout(shape.widthToBody + shape.bodyWidth / 2, shape.heightToBody + shape.bodyHeight - 60, shape.bodyWidth / 2 - 20, 40);
                shape.phantomShapes.rightBackWeapons.layout(shape.widthToBody + 20, shape.heightToBody + shape.bodyHeight - 60, shape.bodyWidth / 2 - 20, 40);
                shape.phantomShapes.rightArmor.layout(shape.widthToBody + shape.bodyWidth / 2, shape.heightToBody + shape.bodyHeight - 20, shape.bodyWidth / 2 - 20, 20);
                shape.phantomShapes.rightBackArmor.layout(shape.widthToBody + 20, shape.heightToBody + shape.bodyHeight - 20, shape.bodyWidth / 2 - 20, 20);
                shape.phantomShapes.body.layout(shape.widthToBody + 60, shape.heightToBody + 60, shape.bodyWidth - 120, shape.bodyHeight - 120);
            } else {
                shape.layoutToolbars();
                shape.phantomShapes.leftBackWeapons.layout(-1, -1, 0, 0);
                shape.phantomShapes.leftBackArmor.layout(-1, -1, 0, 0);
                shape.phantomShapes.rightBackWeapons.layout(-1, -1, 0, 0);
                shape.phantomShapes.rightBackArmor.layout(-1, -1, 0, 0);
            }
            return true;
        };


        shape.addBackWheelguards = function (guards, suppressLayout) {
            var temp;
            for (var i = 0; i < Math.min(2, shape.car.body.tirePairs); i++) {
                temp = CWD.createWheelguardShape(guards, "Wheelguards", "editBackTires", false);
                shape.backWheelguards.push(temp);
                shape.shapes.push(temp);
                temp = CWD.createWheelguardShape(guards, "Wheelguards", "editBackTires", true);
                shape.backWheelguards.push(temp);
                shape.shapes.push(temp);
            }
            if (!suppressLayout) {
                shape.layout();
            }
        };
        shape.removeBackWheelguards = function (suppressLayout) {
            for (var i = 0; i < shape.backWheelguards.length; i++) {
                shape.removeShape(shape.backWheelguards[i]);
            }
            shape.backWheelguards = [];
            if (!suppressLayout) shape.layout();
        };
        shape.addBackWheelhubs = function (hubs, suppressLayout) {
            var temp;
            for (var i = 0; i < Math.min(2, shape.car.body.tirePairs); i++) {
                temp = CWD.createWheelhubShape(hubs, "Wheelhubs", "editBackTires", false);
                shape.backWheelhubs.push(temp);
                shape.shapes.push(temp);
                temp = CWD.createWheelhubShape(hubs, "Wheelhubs", "editBackTires", true);
                shape.backWheelhubs.push(temp);
                shape.shapes.push(temp);
            }
            if (!suppressLayout) {
                shape.layout();
            }
        };
        shape.removeBackWheelhubs = function (suppressLayout) {
            for (var i = 0; i < shape.backWheelhubs.length; i++) {
                shape.removeShape(shape.backWheelhubs[i]);
            }
            shape.backWheelhubs = [];
            if (!suppressLayout) shape.layout();
        };

        shape.initializeVehicle();
        shape.setOversize();
        shape.layout();

        shape.tireContains = function (mx, my) {
            for (var j = 0; j < shape.leftTires.length; j++) {
                if (this.leftTires[j].contains(mx, my)) return this.leftTires[j];
                if (this.rightTires[j].contains(mx, my)) return this.rightTires[j];
            }

            return null;
        };

        shape.updateTires = function () {
            var count = this.car.body.tirePairs;
            var changed = false;
            while (shape.leftTires.length < count) {
                shape.leftTires.push(CWD.createTireShape(trailer.backTires, "Tires", "editBackTires", true, false /*shape.leftTires.length < 2*/));
                shape.rightTires.push(CWD.createTireShape(trailer.backTires, "Tires", "editBackTires", false, false /*shape.rightTires.length < 2*/));
                changed = true;
            }
            while (shape.leftTires.length > count) {
                shape.leftTires.pop();
                shape.rightTires.pop();
                changed = true;
            }
            if (changed) {
                if (shape.backWheelguards.length > 0) {
                    shape.removeBackWheelguards(true);
                    shape.addBackWheelguards(this.car.backWheelguards, true);
                }
                if (shape.backWheelhubs.length > 0) {
                    shape.removeBackWheelhubs(true);
                    shape.addBackWheelhubs(this.car.backWheelhubs, true);
                }
                this.layout();
            }
        };

        return shape;
    };
})();
