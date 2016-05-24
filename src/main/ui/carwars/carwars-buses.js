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

    CW.busBody = {
        minibus: {
            name: 'Minibus',
            cost: 4000,
            weight: 3000,
            maxWeight: 12000,
            spaces: 35,
            cargoSpaces: 0,
            armorCost: 32,
            armorWeight: 14,
            maxTurretSize: 4,
            maxRPSize: 3,
            maxEWPSize: 3,
            facings: 6
        },
        bus_30: {
            name: '30\' Bus',
            cost: 5000,
            weight: 4000,
            maxWeight: 16000,
            spaces: 45,
            cargoSpaces: 0,
            armorCost: 35,
            armorWeight: 17,
            maxTurretSize: 4,
            maxRPSize: 3,
            maxEWPSize: 4,
            facings: 10
        },
        bus_40: {
            name: '40\' Bus',
            cost: 7000,
            weight: 5500,
            maxWeight: 21000,
            spaces: 60,
            cargoSpaces: 0,
            armorCost: 40,
            armorWeight: 18,
            maxTurretSize: 4,
            maxRPSize: 3,
            maxEWPSize: 4,
            facings: 10
        }
    };

    CW.createBus = function () {
        var bus = CW.createOversizeVehicle();
        bus.body = CW.busBody.minibus;
        bus.engine = CW.createPowerPlant(CW.truckPowerPlant.small);
        bus.chassis = CW.chassis.standard;
        bus.suspension = CW.carSuspension.light;
        bus.crew.push(CW.createCrew('Driver'));
        bus.frontTires = CW.createTire('Standard', false, true);
        bus.backTires = CW.createTire('Standard', false, true);
        bus.frontArmor = CW.createArmor(1);
        bus.leftArmor = CW.createArmor(1);
        bus.rightArmor = CW.createArmor(1);
        bus.backArmor = CW.createArmor(1);
        bus.topArmor = CW.createArmor(1);
        bus.underbodyArmor = CW.createArmor(1);
        bus.powerPlantList = CW.truckPowerPlant;
        bus.type = 'Bus';

        bus.tireCount = function () {
            return 10;
        };
        bus.frontTireCount = function () {
            return 2;
        };
        bus.backTireCount = function () {
            return 8;
        };
        bus.backExposedTireCount = function () {
            return 4;
        };
        bus.hasDoubleWheels = function() {
            return true;
        };

        bus.recalculate = function () {
            this.baseRecalculate();

            if (this.onRecalculate) this.onRecalculate();
            if (CW.validateBus) {
                var errors = CW.validateBus(this);
                this.legal = errors.length === 0;
                if (this.onErrors)
                    this.onErrors(errors); // Call even when no errors so the prior list can be cleared
            } else {
                if (this.onErrors)
                    this.onErrors([]);
            }
        };

        var bodyOptions = [CW.busBody.minibus, CW.busBody.bus_30, CW.busBody.bus_40];
        var chassisOptions = [CW.chassis.standard, CW.chassis.heavy, CW.chassis.extra_heavy];

        bus.bodyOptions = function() {
            return bodyOptions;
        };
        bus.setBody = function(name) {
            this.body = CW.findByName(bodyOptions, name);
            if (this.body.facings === 6) {
                this.leftBackArmor = null;
                this.rightBackArmor = null;
                this.topBackArmor = null;
                this.underbodyBackArmor = null;
            } else {
                if (!this.leftBackArmor) this.leftBackArmor = CW.createArmor(1);
                if (!this.rightBackArmor) this.rightBackArmor = CW.createArmor(1);
                if (!this.topBackArmor) this.topBackArmor = CW.createArmor(1);
                if (!this.underbodyBackArmor) this.underbodyBackArmor = CW.createArmor(1);
            }
            this.recalculate();
        };
        bus.nextBody = function () {
            var i;
            for (i = 1; i < bodyOptions.length; i++) {
                if (this.body === bodyOptions[i - 1]) {
                    this.body = bodyOptions[i];
                    break;
                }
            }
            if (!this.leftBackArmor) this.leftBackArmor = CW.createArmor(1);
            if (!this.rightBackArmor) this.rightBackArmor = CW.createArmor(1);
            if (!this.topBackArmor) this.topBackArmor = CW.createArmor(1);
            if (!this.underbodyBackArmor) this.underbodyBackArmor = CW.createArmor(1);
            this.recalculate();
        };
        bus.previousBody = function () {
            var i;
            for (i = bodyOptions.length - 2; i >= 0; i--) {
                if (this.body === bodyOptions[i + 1]) {
                    this.body = bodyOptions[i];
                    break;
                }
            }
            if (this.body.facings === 6) {
                this.leftBackArmor = null;
                this.rightBackArmor = null;
                this.topBackArmor = null;
                this.underbodyBackArmor = null;
            }
            this.recalculate();
        };
        bus.nextChassis = function () {
            var i;
            for (i = 1; i < chassisOptions.length; i++) {
                if (this.chassis === chassisOptions[i - 1]) {
                    this.chassis = chassisOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        bus.previousChassis = function () {
            var i;
            for (i = chassisOptions.length - 2; i >= 0; i--) {
                if (this.chassis === chassisOptions[i + 1]) {
                    this.chassis = chassisOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        bus.nextEngine = function () {
            if (this.engine.electric) {
                if (this.engine.name === CW.truckPowerPlant.small.name) {
                    this.engine.changeType(CW.truckPowerPlant.medium);
                } else if (this.engine.name === CW.truckPowerPlant.medium.name) {
                    this.engine.changeType(CW.truckPowerPlant.regular);
                } else if (this.engine.name === CW.truckPowerPlant.regular.name) {
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
        bus.previousEngine = function () {
            if (this.engine.electric) {
                if (this.engine.name === CW.truckPowerPlant.super.name) {
                    this.engine.changeType(CW.truckPowerPlant.large);
                } else if (this.engine.name === CW.truckPowerPlant.large.name) {
                    this.engine.changeType(CW.truckPowerPlant.regular);
                } else if (this.engine.name === CW.truckPowerPlant.regular.name) {
                    this.engine.changeType(CW.truckPowerPlant.medium);
                } else if (this.engine.name === CW.truckPowerPlant.medium.name) {
                    this.engine.changeType(CW.truckPowerPlant.small);
                } else if (this.engine.name === CW.truckPowerPlant.small.name) {
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
        bus.recalculate();
        return bus;
    };

    // ************************************* VALIDATION ROUTINES ******************************************

    CW.validateBus = function (car) {
        var i, errors = [], engineError = false;
        if (car.weightUsed > car.engine.modifiedMaxLoad()) {
            errors.push("Bus weighs " + car.weightUsed + " lbs. but engine can only move " + car.engine.modifiedMaxLoad() + " lbs.");
            engineError = true;
        }
        if (!car.engine.truck)
            errors.push("Buses cannot use car engines");

        CW.baseValidate(car, "Bus", errors, engineError);
        if (car.isOversize()) {
            for (i = 0; i < car.frontWeapons.length; i++)
                if (car.frontWeapons[i].isDropped()) errors.push("No dropped weapons allowed in front half of vehicle");
            for (i = 0; i < car.leftWeapons.length; i++)
                if (car.leftWeapons[i].isDropped()) errors.push("No dropped weapons allowed in front half of vehicle");
            for (i = 0; i < car.rightWeapons.length; i++)
                if (car.rightWeapons[i].isDropped()) errors.push("No dropped weapons allowed in front half of vehicle");
            for (i = 0; i < car.topWeapons.length; i++)
                if (car.topWeapons[i].isDropped()) errors.push("No dropped weapons allowed in front half of vehicle");
            for (i = 0; i < car.underbodyWeapons.length; i++)
                if (car.underbodyWeapons[i].isDropped()) errors.push("No dropped weapons allowed in front half of vehicle");
        }
        CW.validateAccessories(car, errors);
        if (car.activeSuspension)
            errors.push("Only cars, cycles, and trikes can use an Active Suspension");

        return errors;
    };

    // ************************************* DRAWING ROUTINES ******************************************

    CWD.createBusShape = function (car) {
        var shape = CWD.createOversizeVehicleShape(car);

        shape.bodyType = "Bus";
        shape.bodyStyle = CWD.busBody1;

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

        shape.backWheelsWider = function() {return true;};

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

        // Bus layout
        shape.layoutVehicle = function (forceSameSize) {
            var size;

            shape.componentHeight = 100;
            shape.columnWidth = 100;

            if (forceSameSize) {
                size = shape.layoutSize;
                this.configureLayout(size);
                if (!this.layoutContents(size)) return false;
            } else {
                if (this.car.body.name === CW.busBody.minibus.name &&
                    ((this.leftDischargers.length < 2 && this.rightDischargers.length < 2) || !this.sideTurret))
                    size = {width: 5, height: 6};
                else
                    size = {width: 6, height: 6};
                size = this.findMinimumSize(size);
            }

            // Lay out Tires, Wheelguards, Wheelhubs
            shape.bodyStyle.layoutTires(shape);

            if (size.width === 5) {
                shape.layoutDischargers(shape.widthToBody + 230, shape.widthToBody + 280, 0, 0, 0, 0, 0, shape.widthToBody + 330);
                shape.layoutTurrets(size, shape.widthToBody + 267, shape.bodyHeight / 2);
            } else {
                if (shape.leftTurret && shape.leftBackTurret) {
                    shape.layoutDischargers(shape.widthToBody + 100, shape.widthToBody + 100, 0, 0, 0, 0, -15, shape.widthToBody + 220, 0,
                            shape.widthToBody + 220, -15, shape.widthToBody + 220, -30);
                } else if (shape.leftTurret) {
                    shape.layoutDischargers(shape.widthToBody + 250, shape.widthToBody + 300, 0, 0, 0, 0, 0, shape.widthToBody + 100, 0,
                            shape.widthToBody + 250, -15, shape.widthToBody + 300, -15);
                } else if (shape.leftBackTurret) {
                    shape.layoutDischargers(shape.widthToBody + 380, shape.widthToBody + 430, 0, 0, 0, 0, 0, shape.widthToBody + 100, 0,
                            shape.widthToBody + 430, -15, shape.widthToBody + 380, -15);
                } else {
                    shape.layoutDischargers(shape.widthToBody + 230, shape.widthToBody + 280, 0, 0, 0, 0, 0, shape.widthToBody + 330, 0,
                            shape.widthToBody + 380, 0, shape.widthToBody + 430, 0);
                }
                shape.layoutTurrets(size, shape.widthToBody + 371, shape.bodyHeight / 2);
                shape.layout3Turrets(size, shape.widthToBody + 267, shape.bodyHeight / 2, shape.leftBackTurret, shape.rightBackTurret, shape.topBackTurret);
            }
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

        shape.setOversize();
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
