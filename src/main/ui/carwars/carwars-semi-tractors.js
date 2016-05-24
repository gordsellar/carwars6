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

    CW.semiTractorBody = {
        cabover: {
            name: 'Standard Cabover',
            cost: 12000,
            weight: 3500,
            maxWeight: 10000,
            spaces: 19,
            cargoSpaces: 0,
            armorCost: 30,
            armorWeight: 14,
            maxTurretSize: 4,
            maxRPSize: 3,
            maxEWPSize: 3
        },
        longnose: {
            name: 'Standard Longnose',
            cost: 14000,
            weight: 3700,
            maxWeight: 11000,
            spaces: 22,
            cargoSpaces: 0,
            armorCost: 32,
            armorWeight: 15,
            maxTurretSize: 4,
            maxRPSize: 3,
            maxEWPSize: 3
        },
        sleeper_cabover: {
            name: 'Sleeper Cabover',
            cost: 17000,
            weight: 3900,
            maxWeight: 12000,
            spaces: 24,
            cargoSpaces: 0,
            armorCost: 32,
            armorWeight: 15,
            maxTurretSize: 4,
            maxRPSize: 3,
            maxEWPSize: 3
        },
        sleeper_longnose: {
            name: 'Sleeper Longnose',
            cost: 20000,
            weight: 4100,
            maxWeight: 13500,
            spaces: 27,
            cargoSpaces: 0,
            armorCost: 34,
            armorWeight: 16,
            maxTurretSize: 4,
            maxRPSize: 3,
            maxEWPSize: 3
        }
    };

    CW.createSemiTractor = function () {
        var tractor = CW.createVehicle();
        tractor.body = CW.semiTractorBody.cabover;
        tractor.engine = CW.createPowerPlant(CW.truckPowerPlant.regular);
        tractor.chassis = CW.chassis.standard;
        tractor.suspension = CW.carSuspension.light;
        tractor.crew.push(CW.createCrew('Driver'));
        tractor.frontTires = CW.createTire('Standard', false, true);
        tractor.backTires = CW.createTire('Standard', false, true);
        tractor.frontArmor = CW.createArmor(1);
        tractor.leftArmor = CW.createArmor(1);
        tractor.rightArmor = CW.createArmor(1);
        tractor.backArmor = CW.createArmor(1);
        tractor.topArmor = CW.createArmor(1);
        tractor.underbodyArmor = CW.createArmor(1);
        tractor.powerPlantList = CW.truckPowerPlant;
        tractor.windjammer = null;
        tractor.fifthWheelArmor = null;
        tractor.type = 'SemiTractor';

        tractor.tireCount = function () {
            return 10;
        };
        tractor.frontTireCount = function () {
            return 2;
        };
        tractor.backTireCount = function () {
            return 8;
        };
        tractor.backExposedTireCount = function () {
            return 4;
        };

        tractor.addWindjammer = function() {
            this.windjammer = CW.createWindjammer();
            this.recalculate();
        };
        tractor.removeWindjammer = function() {
            this.windjammer = null;
            this.recalculate();
        };

        tractor.textDescription = function (suppressName) {
            return this.baseDescription(suppressName) + ". Max trailer weight " + (this.engine.modifiedMaxLoad() - this.weightUsed) + " lbs.";
        };

        tractor.accessoryDescription = function () {
            var text = '';
            if (this.windjammer) text += this.windjammer.textDescription() + ", ";
            if (this.fifthWheelArmor) text += this.fifthWheelArmor.textDescription() + " Fifth Wheel Armor, ";
            return text;
        };

        tractor.recalculateAccessories = function () {
            if (this.windjammer) {
                this.totalCost += this.windjammer.totalCost();
                this.weightUsed += this.windjammer.totalWeight();
                this.spaceUsed += this.windjammer.totalSpace();
            }
            if (this.fifthWheelArmor) {
                this.totalCost += this.fifthWheelArmor.totalCost(15);
                this.weightUsed += this.fifthWheelArmor.totalWeight(10);
            }
        };

        tractor.recalculate = function () {
            this.baseRecalculate();

            if (this.onRecalculate) this.onRecalculate();
            if (CW.validateSemiTractor) {
                var errors = CW.validateSemiTractor(this);
                this.legal = errors.length === 0;
                if (this.onErrors)
                    this.onErrors(errors); // Call even when no errors so the prior list can be cleared
            } else {
                if (this.onErrors)
                    this.onErrors([]);
            }
        };

        tractor.armorValues = function () {
            var composite = this.compositeArmor();
            return [
                {location: 'Front', value: this.frontArmor.armorPointDescription(composite) + (this.stealthKoteIn('Front') ? "+1" : "")},
                {location: 'Left', value: this.leftArmor.armorPointDescription(composite) + (this.stealthKoteIn('Left') ? "+1" : "")},
                {location: 'Right', value: this.rightArmor.armorPointDescription(composite) + (this.stealthKoteIn('Right') ? "+1" : "")},
                {location: 'Back', value: this.backArmor.armorPointDescription(composite) + (this.stealthKoteIn('Back') ? "+1" : "")},
                {location: 'Top', value: this.topArmor.armorPointDescription(composite) + (this.stealthKoteIn('Top') ? "+1" : "")},
                {location: 'Under', value: this.underbodyArmor.armorPointDescription(composite) + (this.stealthKoteIn('Underbody') ? "+1" : "")}
            ];
        };

        var chassisOptions = [CW.chassis.standard, CW.chassis.heavy, CW.chassis.extra_heavy];

        tractor.fifthWheelDP = function () {
            return 8 + (this.fifthWheelArmor ?
                this.fifthWheelArmor.plasticType ? this.fifthWheelArmor.plasticPoints : this.fifthWheelArmor.metalPoints
                    : 0);
        };

        tractor.bodyOptions = function() {
            return [CW.semiTractorBody.cabover, CW.semiTractorBody.longnose,
                    CW.semiTractorBody.sleeper_cabover, CW.semiTractorBody.sleeper_longnose];
        };

        tractor.nextChassis = function () {
            var i;
            for (i = 1; i < chassisOptions.length; i++) {
                if (this.chassis === chassisOptions[i - 1]) {
                    this.chassis = chassisOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        tractor.previousChassis = function () {
            var i;
            for (i = chassisOptions.length - 2; i >= 0; i--) {
                if (this.chassis === chassisOptions[i + 1]) {
                    this.chassis = chassisOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        tractor.nextEngine = function () {
            if (this.engine.electric) {
                if (this.engine.name === CW.truckPowerPlant.regular.name) {
                    this.engine.changeType(CW.truckPowerPlant.large);
                } else if (this.engine.name === CW.truckPowerPlant.large.name) {
                    this.engine.changeType(CW.truckPowerPlant.super);
                } else if (this.engine.name === CW.truckPowerPlant.super.name) {
                    return;
                }
            } else {
                if (this.engine.name === CW.truckEngine.small.name) {
                    this.engine.changeType(CW.truckEngine.medium);
                } else if (this.engine.name === CW.truckEngine.medium.name) {
                    this.engine.changeType(CW.truckEngine.large);
                } else if (this.engine.name === CW.truckEngine.large.name) {
                    this.engine.changeType(CW.truckEngine.super);
                } else if (this.engine.name === CW.truckPowerPlant.super.name) {
                    return;
                }
            }
            this.recalculate();
        };
        tractor.previousEngine = function () {
            if (this.engine.electric) {
                if (this.engine.name === CW.truckPowerPlant.super.name) {
                    this.engine.changeType(CW.truckPowerPlant.large);
                } else if (this.engine.name === CW.truckPowerPlant.large.name) {
                    this.engine.changeType(CW.truckPowerPlant.regular);
                } else if (this.engine.name === CW.truckPowerPlant.regular.name) {
                    return;
                }
            } else {
                if (this.engine.name === CW.truckEngine.super.name) {
                    this.engine.changeType(CW.truckEngine.large);
                } else if (this.engine.name === CW.truckEngine.large.name) {
                    this.engine.changeType(CW.truckEngine.medium);
                } else if (this.engine.name === CW.truckEngine.medium.name) {
                    this.engine.changeType(CW.truckEngine.small);
                } else if (this.engine.name === CW.truckEngine.small.name) {
                    return;
                }
            }
            this.recalculate();
        };
        tractor.recalculate();
        return tractor;
    };

    CW.createWindjammer = function () {
        var jammer = {
            name: 'Windjammer',
            cost: 500,
            weight: 70,
            retractable: false,
            armor: null
        };

        jammer.totalCost = function () {
            return this.cost + (this.retractable ? 200 : 0) + this.armorCost();
        };

        jammer.totalWeight = function () {
            return this.weight + (this.retractable ? 30 : 0) + this.armorWeight();
        };

        jammer.totalSpace = function () {
            return this.retractable ? 1 : 0;
        };

        jammer.armorCost = function () {
            return this.armor ? this.armor.totalCost(18) : 0;
        };

        jammer.armorWeight = function () {
            return this.armor ? this.armor.totalWeight(9) : 0;
        };

        jammer.totalDP = function () {
            return this.armor ? this.armor.plasticPoints : 0;
        };

        jammer.textDescription = function () {
            return (this.retractable ? "Retractable " : "") + "Windjammer" + (this.armor ? " w/" + this.armor.textDescription() + " armor" : "");
        };

        return jammer;
    };

    // ************************************* VALIDATION ROUTINES ******************************************

    CW.validateSemiTractor = function (car) {
        var errors = [], engineError = false;
        if (car.weightUsed > car.engine.modifiedMaxLoad()) {
            errors.push("Semi tractor weighs " + car.weightUsed + " lbs. but engine can only move " + car.engine.modifiedMaxLoad() + " lbs.");
            engineError = true;
        }
        if (car.windjammer && car.windjammer.armor && car.windjammer.armor.totalWeight(9) > 90)
            errors.push("Windjammer armor is limited to 90 lbs.");
        if (car.fifthWheelArmor && car.fifthWheelArmor.totalWeight(10) > 200)
            errors.push("Fifth wheel armor is limited to 200 lbs.");
        if (!car.engine.truck)
            errors.push("Semi tractors cannot use car engines");
        if (car.engine.electric && (car.engine.name === CW.truckEngine.small.name || car.engine.name === CW.truckEngine.medium.name))
            errors.push("A small or medium truck plant cannot move a semi");
        if (car.windjammer && car.spoiler)
            errors.push("A semi tractor cannot use both a spoiler and a windjammer");

        CW.baseValidate(car, "Semi Tractor", errors, engineError);
        CW.validateAccessories(car, errors);
        if (car.activeSuspension)
            errors.push("Only cars, cycles, and trikes can use an Active Suspension");

        return errors;
    };

    // ************************************* DRAWING ROUTINES ******************************************

    CWD.createSemiTractorShape = function (car) {
        var shape = CWD.createVehicleShape(car);

        shape.bodyType = "SemiTractor";
        shape.bodyStyle = CWD.semiTractorBody1;

        shape.frontRightTire = CWD.createTireShape(car.frontTires, "Front Tires", "editFrontTires", false, true);
        shape.frontLeftTire = CWD.createTireShape(car.frontTires, "Front Tires", "editFrontTires", true, true);
        shape.middleRightTire = CWD.createTireShape(car.backTires, "Back Tires", "editBackTires", false, true);
        shape.middleLeftTire = CWD.createTireShape(car.backTires, "Back Tires", "editBackTires", true, true);
        shape.middleRightOuterTire = CWD.createTireShape(car.backTires, "Back Tires", "editBackTires", false, false);
        shape.middleLeftOuterTire = CWD.createTireShape(car.backTires, "Back Tires", "editBackTires", true, false);
        shape.backRightTire = CWD.createTireShape(car.backTires, "Back Tires", "editBackTires", false, true);
        shape.backLeftTire = CWD.createTireShape(car.backTires, "Back Tires", "editBackTires", true, true);
        shape.backRightOuterTire = CWD.createTireShape(car.backTires, "Back Tires", "editBackTires", false, false);
        shape.backLeftOuterTire = CWD.createTireShape(car.backTires, "Back Tires", "editBackTires", true, false);

        shape.phantomShapes = {
            frontWeapons: CWD.createShape("Front Weapons", "editFrontWeapons"),
            leftWeapons: CWD.createShape("Left Weapons", "editLeftWeapons"),
            rightWeapons: CWD.createShape("Right Weapons", "editRightWeapons"),
            frontArmor: CWD.createShape("Front Armor", "editArmor"),
            backArmor: CWD.createShape("Back Armor", "editArmor"),
            leftArmor: CWD.createShape("Left Armor", "editArmor"),
            rightArmor: CWD.createShape("Right Armor", "editArmor"),
            body: CWD.createShape("Body Basics", "editBody")
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
            shape.shapes.push(temp);
            temp = CWD.createWheelhubShape(hubs, "Front Wheelhubs", "editFrontTires", true);
            shape.frontWheelhubs.push(temp);
            shape.shapes.push(temp);
            if (!suppressLayout) {
                shape.layout();
            }
        };
        shape.removeFrontWheelhubs = function () {
            for (var i = 0; i < shape.frontWheelhubs.length; i++) {
                shape.removeShape(shape.frontWheelhubs[i]);
            }
            shape.frontWheelhubs = [];
            shape.layout();
        };
        shape.addBackWheelguards = function (guards, suppressLayout) {
            var temp = CWD.createWheelguardShape(guards, "Back Wheelguards", "editBackTires", false);
            shape.backWheelguards.push(temp);
            shape.shapes.push(temp);
            temp = CWD.createWheelguardShape(guards, "Back Wheelguards", "editBackTires", true);
            shape.backWheelguards.push(temp);
            shape.shapes.push(temp);
            temp = CWD.createWheelguardShape(guards, "Back Wheelguards", "editBackTires", false);
            shape.backWheelguards.push(temp);
            shape.shapes.push(temp);
            temp = CWD.createWheelguardShape(guards, "Back Wheelguards", "editBackTires", true);
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
            shape.shapes.push(temp);
            temp = CWD.createWheelhubShape(hubs, "Back Wheelhubs", "editBackTires", true);
            shape.backWheelhubs.push(temp);
            shape.shapes.push(temp);
            temp = CWD.createWheelhubShape(hubs, "Back Wheelhubs", "editBackTires", false);
            shape.backWheelhubs.push(temp);
            shape.shapes.push(temp);
            temp = CWD.createWheelhubShape(hubs, "Back Wheelhubs", "editBackTires", true);
            shape.backWheelhubs.push(temp);
            shape.shapes.push(temp);
            if (!suppressLayout) {
                shape.layout();
            }
        };
        shape.removeBackWheelhubs = function () {
            for (var i = 0; i < shape.backWheelhubs.length; i++) {
                shape.removeShape(shape.backWheelhubs[i]);
            }
            shape.backWheelhubs = [];
            shape.layout();
        };

        shape.initializeVehicle();

        shape.frontWheelsWider = function() {return true;};

        shape.calculateWidthToBody = function() {
            return 300;
        };

        var oldGearWidth = shape.frontGearWidth;
        shape.frontGearWidth = function() {
            var result = oldGearWidth.apply(this);
            if(result <= 18 && this.frontDischargers.length > 0) return 18;
            return result;
        };

            // Semi Tractor layout
        shape.layoutVehicle = function (forceSameSize) {
            var size;

            shape.componentHeight = 100;
            shape.columnWidth = 100;

            if (forceSameSize) {
                size = shape.layoutSize;
            } else {
                size = {width: 2, height: 6};
                if (/Longnose/.test(this.car.body.name)) size.width += 1;
                if (/Sleeper/.test(this.car.body.name)) size.width += 1;
            }
            this.findMinimumSize(size);
            shape.w -= shape.widthToBody;
            shape.x = shape.widthToBody;

            // Lay out Tires, Wheelguards, Wheelhubs
            shape.bodyStyle.layoutTires(shape);

            if (size.width === 3)
                shape.layoutDischargers(shape.widthToBody + 140, shape.widthToBody - 100, 3, -3, 0, -6, 80, shape.widthToBody - 50, 80);
            else
                shape.layoutDischargers(shape.widthToBody + 245, shape.widthToBody + 160, 3, -3, 0, -6, -10, shape.widthToBody + 7, -10);
            shape.layoutTurrets(size, shape.widthToBody + (size.width === 4 ? 53 : 10), shape.bodyHeight / 2 + 10);
            shape.layoutToolbars();
            return true;
        };

        shape.layout();

        shape.tireContains = function (mx, my) {
            if (this.frontLeftTire.contains(mx, my)) {
                return this.frontLeftTire;
            }
            if (this.frontRightTire.contains(mx, my)) {
                return this.frontRightTire;
            }
            if (this.backLeftTire.contains(mx, my)) {
                return this.backLeftTire;
            }
            if (this.backRightTire.contains(mx, my)) {
                return this.backRightTire;
            }
            if (this.backLeftOuterTire.contains(mx, my)) {
                return this.backLeftOuterTire;
            }
            if (this.backRightOuterTire.contains(mx, my)) {
                return this.backRightOuterTire;
            }
            if (this.middleLeftTire.contains(mx, my)) {
                return this.middleLeftTire;
            }
            if (this.middleRightTire.contains(mx, my)) {
                return this.middleRightTire;
            }
            if (this.middleLeftOuterTire.contains(mx, my)) {
                return this.middleLeftOuterTire;
            }
            if (this.middleRightOuterTire.contains(mx, my)) {
                return this.middleRightOuterTire;
            }
            return null;
        };

        return shape;
    };
})();