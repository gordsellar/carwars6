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

    CW.semiTrailerBody = {
        flatbed: {
            name: "40' Flatbed",
            cost: 3000,
            weight: 2000,
            spaces: 6,
            cargoSpaces: 50,
            armorCost: 40,
            armorWeight: 18,
            maxTurretSize: 0,
            maxRPSize: 0,
            maxEWPSize: 0,
            dischargers: 5,
            facings: 10
        },
        dual_flatbed: {
            name: "40' Dual-Level Flatbed",
            cost: 4500,
            weight: 3000,
            spaces: 6,
            cargoSpaces: 70,
            armorCost: 40,
            armorWeight: 18,
            maxTurretSize: 0,
            maxRPSize: 0,
            maxEWPSize: 0,
            dischargers: 5,
            facings: 10
        },
        van: {
            name: "40' Van",
            cost: 6000,
            weight: 3000,
            spaces: 80,
            cargoSpaces: 0,
            armorCost: 40,
            armorWeight: 18,
            maxTurretSize: 4,
            maxRPSize: 3,
            maxEWPSize: 4,
            dischargers: 5,
            facings: 10
        },
        reefer: {
            name: "40' Reefer",
            cost: 10000,
            weight: 3500,
            spaces: 75,
            cargoSpaces: 0,
            armorCost: 40,
            armorWeight: 18,
            maxTurretSize: 4,
            maxRPSize: 3,
            maxEWPSize: 4,
            dischargers: 5,
            facings: 10
        },
        tanker: {
            name: "40' Tanker",
            cost: 16000,
            weight: 5000,
            spaces: 60,
            cargoSpaces: 0,
            armorCost: 40,
            armorWeight: 18,
            maxTurretSize: 4,
            maxRPSize: 3,
            maxEWPSize: 4,
            dischargers: 5,
            facings: 10
        },
        dumper: {
            name: "40' Dumper",
            cost: 11000,
            weight: 6000,
            spaces: 70,
            cargoSpaces: 0,
            armorCost: 40,
            armorWeight: 18,
            maxTurretSize: 4,
            maxRPSize: 3,
            maxEWPSize: 4,
            dischargers: 5,
            facings: 10
        }
    };

    CW.createSemiTrailer = function () {
        var trailer = CW.createOversizeVehicle();
        trailer.body = CW.semiTrailerBody.van;
        trailer.engine = null;
        trailer.chassis = CW.chassis.standard;
        trailer.suspension = CW.carSuspension.light;
        trailer.crew = [];
        trailer.frontTires = null;
        trailer.middleOrOuterTires = null;
        trailer.backTires = CW.createTire('Standard', false, true);
        trailer.powerPlantList = [];
        trailer.frontArmor = CW.createArmor(1);
        trailer.leftArmor = CW.createArmor(1);
        trailer.rightArmor = CW.createArmor(1);
        trailer.backArmor = CW.createArmor(1);
        trailer.topArmor = CW.createArmor(1);
        trailer.underbodyArmor = CW.createArmor(1);
        trailer.leftBackArmor = CW.createArmor(1);
        trailer.rightBackArmor = CW.createArmor(1);
        trailer.topBackArmor = CW.createArmor(1);
        trailer.underbodyBackArmor = CW.createArmor(1);
        trailer.type = "SemiTrailer";
        trailer.fullTrailerTires = 0;
        trailer.explosiveKingpin = false;
        trailer.quickReleaseKingpin = false;

        trailer.tireCount = function () {
            return 8 + this.fullTrailerTires;
        };
        trailer.frontTireCount = function () {
            return this.fullTrailerTires;
        };
        trailer.frontExposedTireCount = function () {
            return this.fullTrailerTires === 0 ? 0 : 2;
        };
        trailer.middleTireCount = function () {
            return 0;
        };
        trailer.backTireCount = function () {
            return 8;
        };
        trailer.backExposedTireCount = function () {
            return 4;
        };

        trailer.setFullTrailerTireCount = function (count) {
            this.fullTrailerTires = count;
            if (count > 0 && !this.frontTires) {
                this.frontTires = CW.createTire(this.backTires.name, false, true);
                this.frontTires.duplicate(this.backTires);
            } else if (count === 0)
                this.frontTires = null;
            this.recalculate();
        };

        var oldAccessories = trailer.recalculateAccessories;
        trailer.recalculateAccessories = function () {
            oldAccessories.apply(this);
            if (this.quickReleaseKingpin)
                this.totalCost += 1000;
            else if (this.explosiveKingpin)
                this.totalCost += 500;
            else
                this.totalCost += 100;
        };
        trailer.accessoryDescription = function () {
            var text = '';
            if (this.quickReleaseKingpin) text += "Quick-Release Kingpin, ";
            else if (this.explosiveKingpin) text += "Explosive Kingpin, ";
            else text += "Standard Kingpin, ";
            return text;
        };
        trailer.recalculate = function () {
            this.baseRecalculate();
            if (this.isFlatbed()) {
                this.maxWeaponSpacesPerSide = 6; // No 1/3 spaces
            }

            if (this.onRecalculate) this.onRecalculate();
            if (CW.validateSemiTrailer) {
                var errors = CW.validateSemiTrailer(this);
                this.legal = errors.length === 0;
                if (this.onErrors)
                    this.onErrors(errors); // Call even when no errors so the prior list can be cleared
            } else {
                if (this.onErrors)
                    this.onErrors([]);
            }
        };

        trailer.hasDoubleWheels = function () {
            return true;
        };
        trailer.hasOversizeWeaponFacings = function () {
            return !this.isFlatbed();
        };

        trailer.bodyOptions = function() {
            return [CW.semiTrailerBody.van, CW.semiTrailerBody.flatbed, CW.semiTrailerBody.dual_flatbed,
                    CW.semiTrailerBody.reefer, CW.semiTrailerBody.tanker, CW.semiTrailerBody.dumper];
        };
        trailer.trailerType = function() {
            return this.body.name.substr(4);
        };
        trailer.setBody = function(name) {
            this.body = CW.findByName(CW.semiTrailerBody, name);
            if (this.isFlatbed()) {
                this.createFlatbedArmor();
            } else {
                this.removeFlatbedArmor();
            }
            this.recalculate();
        };
        trailer.setTrailerType = function(type) {
            this.body = CW.findByName(CW.semiTrailerBody, "40' "+type);
            if (this.isFlatbed()) {
                this.createFlatbedArmor();
            } else {
                this.removeFlatbedArmor();
            }
            this.recalculate();
        };
        var oldNext = trailer.nextFrontTire;
        var oldPrev = trailer.previousFrontTire;
        trailer.nextFrontTire = function () {
            if (this.fullTrailerTires === 0) return;
            oldNext.apply(this);
        };
        trailer.previousFrontTire = function () {
            if (this.fullTrailerTires === 0) return;
            oldPrev.apply(this);
        };
        trailer.isDumper = function() {
            return this.body === CW.semiTrailerBody.dumper;
        };
        trailer.isVan = function() {
            return this.body === CW.semiTrailerBody.van;
        };

        trailer.recalculate();

        return trailer;
    };

    // ************************************* VALIDATION ROUTINES ******************************************

    CW.validateSemiTrailer = function (car) {
        var errors = [], i;
        var flatbed = car.isFlatbed();
        if (car.body.name === CW.semiTrailerBody.tanker.name) {
            if ((car.frontArmor.plasticPoints < 20 && car.frontArmor.metalPoints < 4) ||
                (car.backArmor.plasticPoints < 20 && car.backArmor.metalPoints < 4) ||
                (car.leftArmor.plasticPoints < 20 && car.leftArmor.metalPoints < 4) ||
                (car.rightArmor.plasticPoints < 20 && car.rightArmor.metalPoints < 4) ||
                (car.topArmor.plasticPoints < 20 && car.topArmor.metalPoints < 4) ||
                (car.underbodyArmor.plasticPoints < 20 && car.underbodyArmor.metalPoints < 4))
                errors.push("A tanker must have 20 points of plastic or 4 points of metal armor in every location");
        }
        if (car.body.name === CW.semiTrailerBody.dumper.name) {
            if (car.topTurret || car.sunroof) errors.push("A dumper cannot mount a turret or sunroof");
            if (car.topArmor.plasticPoints > 0 || car.topArmor.metalPoints > 0) errors.push("A dumper cannot have top armor");
        }

        if (car.middleOrOuterTires || car.middleWheelguards || car.middleWheelhubs)
            errors.push("A semi trailer should not have middle tires or tire armor");
        if (car.backTires.motorcycle || !car.backTires.truck || (car.frontTires && (car.frontTires.motorcycle || !car.frontTires.truck)))
            errors.push("Semi trailers must use truck tires");
        if (car.sunroof) {
            if (flatbed) errors.push("A flatbed cannot have a sunroof");
            if (car.topTurret && car.topTurret.name !== CW.turrets.Pintle_Mount.name &&
                car.topBackTurret && car.topBackTurret.name !== CW.turrets.Pintle_Mount.name)
                errors.push("Cannot have a sunroof and two top turrets");
        }
        if (flatbed) {
            if (car.noPaintWindshield)
                errors.push("A flatbed trailer cannot have a no-paint windshield");
            if ((car.sideTurret || car.topTurret)) errors.push("A flatbed cannot mount a turret/EWP/etc.");
        }
        if (car.activeSuspension)
            errors.push("Only cars, cycles, and trikes can use an Active Suspension");
        if (car.heavyDutyTransmission) errors.push("A semi trailer cannot use a heavy-duty transmission");
        if (car.ramplate || car.fakeRamplate) errors.push("A semi trailer cannot use a ramplate");
        if (car.brushcutter) errors.push("A semi trailer cannot use a brushcutter");
        if (car.bumperSpikes) errors.push("A semi trailer cannot use front bumper spikes");
        if (car.bodyBlades && car.fakeBodyBlades)
            errors.push("Cannot have both real and fake body blades");
        var carTopCount = 0;
        var carTopSpace = 0;
        var feCount = 0;
        var carTopFake = false;
        var cargoSafe = false, miniSafe = false, safeMods = false;
        var wheelRamp = false, assaultRamp = false;
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
            } else if (car.accessories[i].name === CW.accessories.WHEEL_RAMP.name) {
                wheelRamp = true;
            } else if (car.accessories[i].name === CW.accessories.ASSAULT_RAMP.name) {
                assaultRamp = true;
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
        if (wheelRamp && assaultRamp)
            errors.push("Cannot mount both wheel ramps and an assault ramp");

        CW.baseValidate(car, "Semi Trailer", errors, false);
        for (i = 0; i < car.frontWeapons.length; i++)
            if (!car.frontWeapons[i].isDischarger()) {
                errors.push("Semi trailers cannot mount front-firing weapons");
                break;
            }
        for (i = 0; i < car.leftWeapons.length; i++)
            if (car.leftWeapons[i].isDropped()) errors.push("No dropped weapons allowed in front half of vehicle");
        for (i = 0; i < car.rightWeapons.length; i++)
            if (car.rightWeapons[i].isDropped()) errors.push("No dropped weapons allowed in front half of vehicle");
        for (i = 0; i < car.topWeapons.length; i++)
            if (car.topWeapons[i].isDropped()) errors.push("No dropped weapons allowed in front half of vehicle");
        for (i = 0; i < car.underbodyWeapons.length; i++)
            if (car.underbodyWeapons[i].isDropped()) errors.push("No dropped weapons allowed in front half of vehicle");

        return errors;
    };

    // ************************************* DRAWING ROUTINES ******************************************

    CWD.createSemiTrailerShape = function (trailer) {
        var i, shape = CWD.createOversizeVehicleShape(trailer);
        shape.bodyType = "SemiTrailer";
        shape.bodyStyle = CWD.semiTrailerBody;
        shape.leftTires = [];
        shape.rightTires = [];
        for (i = 0; i < 4; i++) {
            shape.leftTires.push(CWD.createTireShape(trailer.backTires, "Tires", "editBackTires", true, i < 2));
            shape.rightTires.push(CWD.createTireShape(trailer.backTires, "Tires", "editBackTires", false, i < 2));
        }
        if (trailer.fullTrailerTires > 0) {
            shape.leftTires.push(CWD.createTireShape(trailer.frontTires, "Tires", "editFrontTires", true, true));
            shape.rightTires.push(CWD.createTireShape(trailer.frontTires, "Tires", "editFrontTires", false, true));
        }
        if (trailer.fullTrailerTires > 2) {
            shape.leftTires.push(CWD.createTireShape(trailer.frontTires, "Tires", "editFrontTires", true, false));
            shape.rightTires.push(CWD.createTireShape(trailer.frontTires, "Tires", "editFrontTires", false, false));
        }

        // Semi Trailer Layout
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
                if (flatbed)
                    size = {width: 3, height: 4};
                else
                    size = {width: 6, height: 4};
                size = this.findMinimumSize(size);
            }

            // Lay out Tires, Wheelguards, Wheelhubs
            var compress = (shape.leftTurret || shape.rightTurret) && (shape.leftDischargers.length > 0 || shape.rightDischargers.length > 0) &&
                shape.leftTires.length > 4;
            offset = shape.bodyStyle.layoutTires(shape, flatbed, compress);

            if (shape.leftBackTurret || shape.rightBackTurret) offset += 10;
            var backTurret = offset + 10;
            shape.layout3Turrets(size, offset, shape.bodyHeight / 2, shape.leftBackTurret, shape.rightBackTurret, shape.topBackTurret);
            offset += compress ? 122 : 125;
            shape.layoutTurrets(size, offset, shape.bodyHeight / 2);
            if (shape.leftTurret || shape.rightTurret) offset += compress ? 100 : 125;
            if (shape.frontWheelguards.length === 0 || (!shape.leftBackTurret && !shape.rightBackTurret)) offset += 3;
            voffset = flatbed ? -5 : 0;
            if (compress) {
                if (shape.leftBackTurret || shape.rightBackTurret)
                    shape.layoutDischargers(offset, offset, 0, 0, 0, voffset, voffset - 15, offset, voffset - 30, offset, voffset - 45, offset, voffset - 60);
                else
                    shape.layoutDischargers(backTurret, backTurret + 50, 0, 0, 0, voffset, voffset, backTurret, voffset - 15, backTurret + 50, voffset - 15, backTurret, voffset - 30);
            } else
                shape.layoutDischargers(offset, offset + 50, 0, 0, 0, voffset, voffset, offset, voffset - 15, offset + 50, voffset - 15, offset, voffset - 30);

            shape.maximumX = shape.widthToBody+shape.bodyWidth+shape.frontGearWidth();

            shape.phantomShapes.frontWeapons.layout(-1, -1, 0, 0);
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

            return true;
        };


        shape.addBackWheelguards = function (guards, suppressLayout) {
            var temp;
            for (var i = 0; i < 2; i++) {
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
            for (var i = 0; i < 2; i++) {
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
        shape.addFrontWheelguards = function (guards, suppressLayout) {
            var temp = CWD.createWheelguardShape(guards, "Front Wheelguards", "editFrontTires", false);
            shape.frontWheelguards.push(temp);
            shape.shapes.push(temp);
            temp = CWD.createWheelguardShape(guards, "Front Wheelguards", "editFrontTires", true);
            shape.frontWheelguards.push(temp);
            shape.shapes.push(temp);
            if (!suppressLayout) {
                shape.layout();
            }
        };
        shape.removeFrontWheelguards = function (suppressLayout) {
            for (var i = 0; i < shape.frontWheelguards.length; i++) {
                shape.removeShape(shape.frontWheelguards[i]);
            }
            shape.frontWheelguards = [];
            if (!suppressLayout) shape.layout();
        };
        shape.addFrontWheelhubs = function (hubs, suppressLayout) {
            var temp = CWD.createWheelhubShape(hubs, "Front Wheelhubs", "editFrontTires", false);
            shape.frontWheelhubs.push(temp);
            shape.shapes.push(temp);
            temp = CWD.createWheelhubShape(hubs, "Front Wheelhubs", "editFrontTires", true);
            shape.frontWheelhubs.push(temp);
            shape.shapes.push(temp);
            if (!suppressLayout) {
                shape.layout();
            }
        };
        shape.removeFrontWheelhubs = function (suppressLayout) {
            for (var i = 0; i < shape.frontWheelhubs.length; i++) {
                shape.removeShape(shape.frontWheelhubs[i]);
            }
            shape.frontWheelhubs = [];
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
            var count = 4 + this.car.fullTrailerTires / 2;
            var changed = false;
            while (shape.leftTires.length < count) {
                shape.leftTires.push(CWD.createTireShape(trailer.frontTires, "Tires", "editFrontTires", true, shape.leftTires.length === 4));
                shape.rightTires.push(CWD.createTireShape(trailer.frontTires, "Tires", "editFrontTires", false, shape.rightTires.length === 4));
                changed = true;
                if (this.car.frontWheelguards && this.frontWheelguards.length === 0)
                    this.addFrontWheelguards(this.car.frontWheelguards, true);
                if (this.car.frontWheelhubs && this.frontWheelhubs.length === 0)
                    this.addFrontWheelhubs(this.car.frontWheelhubs, true);
            }
            while (shape.leftTires.length > count) {
                shape.leftTires.pop();
                shape.rightTires.pop();
                changed = true;
            }
            if (this.frontWheelguards.length > 0 && this.car.fullTrailerTires === 0)
                this.removeFrontWheelguards(true);
            if (this.frontWheelhubs.length > 0 && this.car.fullTrailerTires === 0)
                this.removeFrontWheelhubs(true);
            if (changed) {
                this.layout();
            }
        };

        return shape;
    };
})();
