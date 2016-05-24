/*
 Car Wars is a trademark of Steve Jackson Games, and its rules and art are copyrighted by Steve Jackson Games.
 All rights are reserved by Steve Jackson Games.

 This game aid is the original creation of Aaron Mulder and is released for free distribution, and not for resale,
 under the permissions granted in the Steve Jackson Games Online Policy.

 Application code for this game aid (except for the Car Wars rules as noted above) copyright 2013 Aaron Mulder.
 */
/* global CW, CWD */

// ***** MUST LOAD CYCLES, VALIDATION FIRST!!!

(function() {
    "use strict";

    CW.trikeBody = {
        light: {
            name: 'Light Trike',
            cost: 250,
            weight: 300,
            maxWeight: 1600,
            spaces: 8,
            cargoSpaces: 0,
            armorCost: 11,
            armorWeight: 5,
            maxTurretSize: 0,
            maxRPSize: 1,
            maxEWPSize: 1
        },
        medium: {
            name: 'Medium Trike',
            cost: 300,
            weight: 500,
            maxWeight: 2100,
            spaces: 10,
            cargoSpaces: 0,
            armorCost: 12,
            armorWeight: 6,
            maxTurretSize: 1,
            maxRPSize: 2,
            maxEWPSize: 1
        },
        heavy: {
            name: 'Heavy Trike',
            cost: 400,
            weight: 700,
            maxWeight: 2800,
            spaces: 12,
            cargoSpaces: 0,
            armorCost: 14,
            armorWeight: 7,
            maxTurretSize: 2,
            maxRPSize: 2,
            maxEWPSize: 1
        },
        extra_heavy: {
            name: 'Extra-Heavy Trike',
            cost: 550,
            weight: 950,
            maxWeight: 3500,
            spaces: 14,
            cargoSpaces: 0,
            armorCost: 16,
            armorWeight: 8,
            maxTurretSize: 2,
            maxRPSize: 2,
            maxEWPSize: 2
        }
    };

    CW.createTrike = function () {
        var trike = CW.createVehicle();

        trike.body = CW.trikeBody.light;
        trike.engine = CW.createPowerPlant(CW.cyclePowerPlant.medium);
        trike.engine.superconductors = true;
        trike.chassis = CW.chassis.extra_heavy;
        trike.suspension = CW.cycleSuspension.heavy;
        trike.crew.push(CW.createCrew('Driver'));
        trike.frontTires = CW.createTire('Standard', true, false);
        trike.backTires = CW.createTire('Standard', true, false);
        trike.frontArmor = CW.createArmor(1);
        trike.leftArmor = CW.createArmor(1);
        trike.rightArmor = CW.createArmor(1);
        trike.backArmor = CW.createArmor(1);
        trike.topArmor = CW.createArmor(1);
        trike.underbodyArmor = CW.createArmor(1);
        trike.powerPlantList = CW.cyclePowerPlant;
        trike.reversed = false;
        trike.type = 'Trike';

        trike.tireCount = function () {
            return 3;
        };
        trike.frontTireCount = function () {
            return this.reversed ? 2 : 1;
        };
        trike.backTireCount = function () {
            return this.reversed ? 1 : 2;
        };
        trike.middleTireCount = function () {
            return 0;
        };

        trike.modifiedBodyCost = function () {
            var cost = this.body.cost;
            if (this.reversed) cost = cost * 1.5;
            return this.carbonAluminumFrame ? cost * 4 : cost;
        };

        trike.bodyName = function () {
            return (this.reversed ? "Reversed " : "") + this.body.name;
        };

        trike.initialSpaces = function () {
            return this.body.spaces - (this.reversed ? 1 : 0);
        };

        trike.setReversed = function(reversed) {
            this.reversed = reversed;
            if(this.reversed) {
                if(this.frontWheelguards) this.frontWheelguards.motorcycle = false;
                if(this.frontWheelhubs) this.frontWheelhubs.motorcycle = false;
                if(this.backWheelguards) this.backWheelguards.motorcycle = true;
                if(this.backWheelhubs) this.backWheelhubs.motorcycle = true;
            } else {
                if(this.frontWheelguards) this.frontWheelguards.motorcycle = true;
                if(this.frontWheelhubs) this.frontWheelhubs.motorcycle = true;
                if(this.backWheelguards) this.backWheelguards.motorcycle = false;
                if(this.backWheelhubs) this.backWheelhubs.motorcycle = false;
                this.ramplate = false;
                this.fakeRamplate = false;
                this.airdam = false;
            }
            this.recalculate();
        };

        trike.recalculate = function () {
            this.baseRecalculate();
            if (this.reversed) this.modifiedHandlingClass = this.modifiedHandlingClass + 1;
            if (this.onRecalculate) this.onRecalculate();
            if (CW.validateTrike) {
                var errors = CW.validateTrike(this);
                this.legal = errors.length === 0;
                if (this.onErrors)
                    this.onErrors(errors); // Call even when no errors so the prior list can be cleared
            } else {
                if (this.onErrors)
                    this.onErrors([]);
            }
        };

        trike.armorValues = function () {
            var composite = this.compositeArmor();
            return [
                {location: 'Front', value: this.frontArmor.armorPointDescription(composite)},
                {location: 'Left', value: this.leftArmor.armorPointDescription(composite)},
                {location: 'Right', value: this.rightArmor.armorPointDescription(composite)},
                {location: 'Back', value: this.backArmor.armorPointDescription(composite)},
                {location: 'Top', value: this.topArmor.armorPointDescription(composite)},
                {location: 'Under', value: this.underbodyArmor.armorPointDescription(composite)}
            ];
        };

        var bodyOptions = [CW.trikeBody.light, CW.trikeBody.medium, CW.trikeBody.heavy, CW.trikeBody.extra_heavy];
        var chassisOptions = [CW.chassis.light, CW.chassis.standard, CW.chassis.heavy, CW.chassis.extra_heavy];
        var suspensionOptions = [CW.cycleSuspension.light, CW.cycleSuspension.improved, CW.cycleSuspension.heavy, CW.cycleSuspension.off_road];

        trike.bodyOptions = function() {
            return bodyOptions;
        };
        trike.nextBody = function () {
            var i;
            for (i = 1; i < bodyOptions.length; i++) {
                if (this.body === bodyOptions[i - 1]) {
                    this.body = bodyOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        trike.previousBody = function () {
            var i;
            for (i = bodyOptions.length - 2; i >= 0; i--) {
                if (this.body === bodyOptions[i + 1]) {
                    this.body = bodyOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        trike.nextChassis = function () {
            var i;
            for (i = 1; i < chassisOptions.length; i++) {
                if (this.chassis === chassisOptions[i - 1]) {
                    this.chassis = chassisOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        trike.previousChassis = function () {
            var i;
            for (i = chassisOptions.length - 2; i >= 0; i--) {
                if (this.chassis === chassisOptions[i + 1]) {
                    this.chassis = chassisOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        trike.nextSuspension = function () {
            var i;
            for (i = 1; i < suspensionOptions.length; i++) {
                if (this.suspension === suspensionOptions[i - 1]) {
                    this.suspension = suspensionOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        trike.previousSuspension = function () {
            var i;
            for (i = suspensionOptions.length - 2; i >= 0; i--) {
                if (this.suspension === suspensionOptions[i + 1]) {
                    this.suspension = suspensionOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        trike.nextEngine = function () {
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
        trike.previousEngine = function () {
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

        trike.recalculate();

        return trike;
    };

    // ************************************* VALIDATION ROUTINES ******************************************

    CW.validateTrike = function (car) {
        var errors = [], engineError = false;
        if (car.heavyDutyTransmission) { // TODO: text says 'for cars only' -- not allowed for Trikes?
            if (car.weightUsed > car.engine.totalPowerFactors() * 6 && car.engine.totalPowerFactors() * 6 < car.modifiedMaxWeight) {
                engineError = true;
                errors.push("Design weighs " + car.weightUsed + " lbs. but engine can only move " + (car.engine.totalPowerFactors() * 6) + " lbs.");
            }
            if (car.chassis.name === "Light" || car.chassis.name === "Standard")
                errors.push("Heavy-Duty Transmission requires a heavy or extra heavy chassis");
        } else {
            if (car.weightUsed > car.engine.totalPowerFactors() * 3 && car.engine.totalPowerFactors() * 3 < car.modifiedMaxWeight) {
                engineError = true;
                errors.push("Design weighs " + car.weightUsed + " lbs. but engine can only move " + (car.engine.totalPowerFactors() * 3) + " lbs.");
            }
        }
        if (!car.frontTires.motorcycle || !car.backTires.motorcycle)
            errors.push("Trikes must use motorcycle tires");
        if (car.ramplate) {
            if (!car.reversed) errors.push("Trikes must be reversed to have a ramplate");
        }
        if (car.fakeRamplate) {
            if (!car.reversed) errors.push("Trikes must be reversed to have a (fake) ramplate");
        }
        if (car.airdam && !car.reversed)
            errors.push("Trikes must be reversed to use an airdam");
        CW.baseValidate(car, "Trike", errors, engineError);
        CW.validateAccessories(car, errors);

        return errors;
    };

    // ************************************* DRAWING ROUTINES ******************************************

    CWD.createTrikeShape = function (trike) {
        var shape = CWD.createVehicleShape(trike);
        shape.bodyType = "Trike";
        shape.bodyStyle = CWD.trikeBody1;
        shape.frontTire = CWD.createSingleTireShape(trike.frontTires, "Front Tire", "editFrontTires", true);
        shape.backRightTire = CWD.createTireShape(trike.backTires, "Back Tires", "editBackTires", false, true);
        shape.backLeftTire = CWD.createTireShape(trike.backTires, "Back Tires", "editBackTires", true, true);

        shape.phantomShapes = {
            frontWeapons: CWD.createShape("Front Weapons", "editFrontWeapons"),
            backWeapons: CWD.createShape("Back Weapons", "editBackWeapons"),
            leftWeapons: CWD.createShape("Left Weapons", "editLeftWeapons"),
            rightWeapons: CWD.createShape("Right Weapons", "editRightWeapons"),
            frontArmor: CWD.createShape("Front Armor", "editArmor"),
            backArmor: CWD.createShape("Back Armor", "editArmor"),
            leftArmor: CWD.createShape("Left Armor", "editArmor"),
            rightArmor: CWD.createShape("Right Armor", "editArmor"),
            body: CWD.createShape("Body Basics", "editBody")
        };

        shape.backWheelsWider = function() {return true;};

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
            shape.frontWheelhubs.push(temp); // Not added to "shapes" so they can be drawn under the body
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
            var temp = CWD.createWheelguardShape(guards, "Back Wheelguards", "editBackTires", false);
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

        // Trike Layout
        shape.layoutVehicle = function (forceSameSize) {
            var i, size, cols;

            shape.componentHeight = 100;
            shape.columnWidth = 100;

            if (forceSameSize) {
                size = shape.layoutSize;
                cols = shape.layoutColumns;
                this.configureLayout(size);
                if (!this.layoutContents(size, cols)) return false;
            } else {
                size = {width: 5, height: 4};
                shape.bodyStyle.humpForward = shape.crew.length === 2;
                this.configureLayout(size);
                cols = [
                    {height: 2},
                    {height: 2},
                    {height: shape.bodyStyle.humpForward ? 4 : 2},
                    {height: 4},
                    {height: 4}
                ];
                if (this.frontWeapons.length > 2 || !this.layoutContents(size, cols)) {
                    size = {width: 5, height: 6};
                    cols = [
                        {height: 4},
                        {height: 4},
                        {height: 4},
                        {height: 6},
                        {height: 6}
                    ];
                    shape.bodyStyle.humpForward = false;
                    this.configureLayout(size);
                    if (!this.layoutContents(size, cols)) {
                        shape.bodyStyle.humpForward = true;
                        cols[2].height = 6;
                        this.layoutContents(size, cols); // TODO: force it at this size
                    }
                }
            }
            if(shape.frontWheelguards.length > 0) shape.w += 80;
            for (i = 0; i < this.frontWeapons.length; i++) this.frontWeapons[i].drawFullBarrel = false;

            // Lay out Tires, Wheelguards, Wheelhubs
            shape.bodyStyle.layoutTires(shape);

            shape.layoutDischargers(shape.widthToBody + shape.bodyWidth - 100, shape.widthToBody + shape.bodyWidth - 55, 0, -5,
                -(size.height === 4 ? 27 : 35), size.height === 4 ? 35 : 53, size.height === 4 ? 40 : 58);
            shape.layoutTurrets(size, shape.widthToBody + 318, shape.bodyHeight / 2 - (size.height === 4 ? 32 : 49));
            shape.layoutToolbars();
            return true;
        };

        shape.frontGearWidth = function() {
            return - 10+this.bodyStyle.tireWidth+(shape.frontWheelguards.length > 0 ? 3+this.bodyStyle.wheelguardWidth : 0);
        };

        shape.initializeVehicle();
        shape.layout();

        shape.tireContains = function (mx, my) {
            for(var i=0; i<this.frontWheelhubs.length; i++) {
                if(this.frontWheelhubs[i].contains(mx, my))
                    return this.frontWheelhubs[i];
            }
            if (this.frontTire.contains(mx, my)) {
                return this.frontTire;
            }
            if (this.backLeftTire.contains(mx, my)) {
                return this.backLeftTire;
            }
            if (this.backRightTire.contains(mx, my)) {
                return this.backRightTire;
            }
            return null;
        };

        return shape;
    };

    CWD.createReversedTrikeShape = function (trike) {
        var shape = CWD.createVehicleShape(trike);
        shape.bodyStyle = CWD.reversedTrikeBody1;

        shape.backTire = CWD.createSingleTireShape(trike.backTires, "Back Tire", "editBackTires", false);
        shape.frontRightTire = CWD.createTireShape(trike.frontTires, "Front Tires", "editFrontTires", false, true);
        shape.frontLeftTire = CWD.createTireShape(trike.frontTires, "Front Tires", "editFrontTires", true, true);

        shape.phantomShapes = {
            frontWeapons: CWD.createShape("Front Weapons", "editFrontWeapons"),
            backWeapons: CWD.createShape("Back Weapons", "editBackWeapons"),
            leftWeapons: CWD.createShape("Left Weapons", "editLeftWeapons"),
            rightWeapons: CWD.createShape("Right Weapons", "editRightWeapons"),
            frontArmor: CWD.createShape("Front Armor", "editArmor"),
            backArmor: CWD.createShape("Back Armor", "editArmor"),
            leftArmor: CWD.createShape("Left Armor", "editArmor"),
            rightArmor: CWD.createShape("Right Armor", "editArmor"),
            body: CWD.createShape("Body Basics", "editBody")
        };

        shape.frontWheelsWider = function() {return true;};

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


        // Reversed Trike Layout
        shape.layoutVehicle = function (forceSameSize) {
            var i, size, cols;

            shape.componentHeight = 100;
            shape.columnWidth = 100;

            if (forceSameSize) {
                size = shape.layoutSize;
                cols = shape.layoutColumns;
                this.configureLayout(size);
                if (!this.layoutContents(size, cols)) return false;
            } else {
                size = {width: 5, height: 4};
                this.configureLayout(size);
                cols = [
                    {height: 4},
                    {height: 4},
                    {height: 2},
                    {height: 2},
                    {height: 2}
                ];
                if (this.backWeapons.length > 2 || !this.layoutContents(size, cols)) {
                    size = {width: 5, height: 6};
                    cols = [
                        {height: 6},
                        {height: 6},
                        {height: 4, componentHeight: 90},
                        {height: 4, componentHeight: 90},
                        {height: 4, componentHeight: 75}
                    ];
                    this.configureLayout(size);
                    this.layoutContents(size, cols); // TODO: force it at this size
                }
            }
            for (i = 0; i < this.backWeapons.length; i++) this.backWeapons[i].drawFullBarrel = false;

            // Lay out Tires, Wheelguards, Wheelhubs
            shape.bodyStyle.layoutTires(shape);

            shape.layoutDischargers(shape.widthToBody + shape.bodyWidth * 0.4 + 4, shape.widthToBody + shape.bodyWidth * 0.5, 2, 0,
                0, shape.bodyHeight / 5, shape.bodyHeight / 5);
            shape.layoutTurrets(size, shape.widthToBody + 100, shape.bodyHeight / 3 + 5 - (size.height > 4 ? 5 : 0));
            shape.layoutToolbars();
            return true;
        };

        shape.initializeVehicle();
        shape.layout();

        shape.tireContains = function (mx, my) {
            if (this.backTire.contains(mx, my)) {
                return this.backTire;
            }
            if (this.frontLeftTire.contains(mx, my)) {
                return this.frontLeftTire;
            }
            if (this.frontRightTire.contains(mx, my)) {
                return this.frontRightTire;
            }
            return null;
        };

        return shape;
    };
})();