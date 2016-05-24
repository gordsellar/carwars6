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

    CW.tenWheelerBody = {
        cabover: {
            name: 'Cabover',
            cost: 10500,
            weight: 3000,
            maxWeight: 15000,
            spaces: 17,
            cargoSpaces: 0,
            armorCost: 30,
            armorWeight: 14,
            maxTurretSize: 4,
            maxRPSize: 3,
            maxEWPSize: 3
        },
        longnose: {
            name: 'Longnose',
            cost: 12500,
            weight: 3200,
            maxWeight: 16500,
            spaces: 20,
            cargoSpaces: 0,
            armorCost: 32,
            armorWeight: 15,
            maxTurretSize: 4,
            maxRPSize: 3,
            maxEWPSize: 3
        }
    };

    CW.tenWheelerCarrierBody = {
        flatbed: {
            name: "15' Flatbed",
            cost: 1100,
            weight: 750,
            spaces: 6,
            cargoSpaces: 20,
            armorCost: 30,
            armorWeight: 14,
            maxTurretSize: 0,
            maxRPSize: 0,
            maxEWPSize: 0,
            dischargers: 2,
            facings: 6
        },
        van: {
            name: "15' Van",
            cost: 2300,
            weight: 1150,
            spaces: 30,
            cargoSpaces: 0,
            armorCost: 30,
            armorWeight: 14,
            maxTurretSize: 4,
            maxRPSize: 3,
            maxEWPSize: 3,
            dischargers: 2,
            facings: 6
        },
        reefer: {
            name: "15' Reefer",
            cost: 3800,
            weight: 1350,
            spaces: 25,
            cargoSpaces: 0,
            armorCost: 30,
            armorWeight: 14,
            maxTurretSize: 4,
            maxRPSize: 3,
            maxEWPSize: 3,
            dischargers: 2,
            facings: 6
        },
        tanker: {
            name: "15' Tanker",
            cost: 6150,
            weight: 1900,
            spaces: 25,
            cargoSpaces: 0,
            armorCost: 30,
            armorWeight: 14,
            maxTurretSize: 4,
            maxRPSize: 3,
            maxEWPSize: 3,
            dischargers: 2,
            facings: 6
        },
        dumper: {
            name: "15' Dumper",
            cost: 4000,
            weight: 2300,
            spaces: 30,
            cargoSpaces: 0,
            armorCost: 30,
            armorWeight: 14,
            maxTurretSize: 4,
            maxRPSize: 3,
            maxEWPSize: 3,
            dischargers: 2,
            facings: 6
        }
    };

    CW.carrierLocation = function (location) {
        return /Turret/.test(location) ? location.substr(7, 1).toLowerCase() + location.substr(8) : location.substr(7);
    };

    CW.createTenWheelerCarrier = function () {
        var carrier = CW.createOversizeVehicle();
        carrier.body = CW.tenWheelerCarrierBody.van;
        carrier.chassis = CW.chassis.standard;
        carrier.suspension = CW.carSuspension.light;
        carrier.frontArmor = CW.createArmor(1);
        carrier.leftArmor = CW.createArmor(1);
        carrier.rightArmor = CW.createArmor(1);
        carrier.backArmor = CW.createArmor(1);
        carrier.topArmor = CW.createArmor(1);
        carrier.underbodyArmor = CW.createArmor(1);
        // Inherits flatbedArmor
        carrier.type = 'TenWheelerCarrier';

        carrier.tireCount = function () {
            return 0;
        };
        carrier.frontTireCount = function () {
            return 0;
        };
        carrier.backTireCount = function () {
            return 0;
        };

        carrier.hasDoubleWheels = function () {
            return true;
        };
        carrier.hasWheelguardsAndHubs = function () {
            return this.cab.hasWheelguardsAndHubs();
        };
        carrier.hasWheelguardsOrHubs = function () {
            return this.cab.hasWheelguardsOrHubs();
        };

        carrier.recalculate = function () {
            this.baseRecalculate();
            if (this.isFlatbed()) {
                this.maxWeaponSpacesPerSide = 6; // No 1/3 spaces
            }
        };

        carrier.textDescription = function (suppressName) {
            return this.baseDescription(suppressName)
                + ".  Overall Cargo " + this.cab.totalCargoSpace() + " spaces and " + Math.max(0, this.cab.maxEffectiveWeight - this.cab.weightUsed) + " lbs.";
        };

        carrier.tireToCopy = function() {return this.cab.backTires;};

        carrier.isVan = function() {
            return this.body.name === CW.tenWheelerCarrierBody.van.name;
        };

        return carrier;
    };

    CW.createTenWheeler = function () {
        var cab = CW.createVehicle();
        cab.body = CW.tenWheelerBody.cabover;
        cab.engine = CW.createPowerPlant(CW.truckPowerPlant.small);
        cab.chassis = CW.chassis.standard;
        cab.suspension = CW.carSuspension.light;
        cab.crew.push(CW.createCrew('Driver'));
        cab.frontTires = CW.createTire('Standard', false, true);
        cab.backTires = CW.createTire('Standard', false, true);
        cab.frontArmor = CW.createArmor(1);
        cab.leftArmor = CW.createArmor(1);
        cab.rightArmor = CW.createArmor(1);
        cab.backArmor = CW.createArmor(1);
        cab.topArmor = CW.createArmor(1);
        cab.underbodyArmor = CW.createArmor(1);
        cab.powerPlantList = CW.truckPowerPlant;
        cab.type = 'TenWheeler';
        cab.carrier = CW.createTenWheelerCarrier();
        cab.carrier.cab = cab;
        cab.carrier.backTires = cab.backTires;
        cab.backDoor = false;

        cab.tireCount = function () {
            return 10;
        };
        cab.frontTireCount = function () {
            return 2;
        };
        cab.backTireCount = function () {
            return 8;
        };
        cab.backExposedTireCount = function () {
            return 4;
        };
        cab.hasDoubleWheels = function () {
            return true;
        };

        cab.textDescription = function (suppressName) {
            return this.baseDescription(suppressName)
                + ".  Max carrier weight " + (Math.min(this.engine.modifiedMaxLoad(), this.modifiedMaxWeight) - (this.weightUsed - this.carrier.weightUsed)) + " lbs."
                + "\n\n" + this.carrier.textDescription(true);
        };

        cab.recalculateAccessories = function () {
            this.carrier.personalEquipmentWeight = this.personalEquipmentWeight;
            this.carrier.recalculate();
            this.totalCost += this.carrier.totalCost;
            this.weightUsed += this.carrier.weightUsed;
            this.carrier.towCapacity = Math.max(0, this.engine.modifiedMaxLoad() - this.weightUsed + this.reservedWeight);
            if (this.backDoor) this.totalCost += 200;
        };
        cab.accessoryDescription = function () {
            if (this.backDoor) return "Back Door, ";
            else return "";
        };

        cab.recalculate = function () {
            this.baseRecalculate();

            if (this.onRecalculate) this.onRecalculate();
            if (CW.validateTenWheeler) {
                var errors = CW.validateTenWheeler(this);
                this.legal = errors.length === 0;
                if (this.onErrors)
                    this.onErrors(errors); // Call even when no errors so the prior list can be cleared
            } else {
                if (this.onErrors)
                    this.onErrors([]);
            }
        };

        cab.armorValues = function () {
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

        var bodyOptions = [CW.tenWheelerBody.cabover, CW.tenWheelerBody.longnose];
        var chassisOptions = [CW.chassis.standard, CW.chassis.heavy, CW.chassis.extra_heavy];

        cab.bodyOptions = function() {
            return bodyOptions;
        };
        cab.nextBody = function () {
            var i;
            for (i = 1; i < bodyOptions.length; i++) {
                if (this.body === bodyOptions[i - 1]) {
                    this.body = bodyOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        cab.previousBody = function () {
            var i;
            for (i = bodyOptions.length - 2; i >= 0; i--) {
                if (this.body === bodyOptions[i + 1]) {
                    this.body = bodyOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        cab.nextChassis = function () {
            var i;
            for (i = 1; i < chassisOptions.length; i++) {
                if (this.chassis === chassisOptions[i - 1]) {
                    this.chassis = chassisOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        cab.previousChassis = function () {
            var i;
            for (i = chassisOptions.length - 2; i >= 0; i--) {
                if (this.chassis === chassisOptions[i + 1]) {
                    this.chassis = chassisOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        cab.nextEngine = function () {
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
        cab.previousEngine = function () {
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

        cab.setCarrierType = function(type) {
            this.carrier.body = CW.tenWheelerCarrierBody[type.toLowerCase()];
            if(type === 'Tanker' || type === 'Dumper') this.backDoor = false;
            if(type === 'Flatbed')
                this.carrier.flatbedArmor = CW.createArmor(1);
            else
                this.carrier.flatbedArmor = null;
            this.recalculate();
        };

        cab.recalculate();
        return cab;
    };

    // ************************************* VALIDATION ROUTINES ******************************************

    CW.validateTenWheeler = function (car) {
        var errors = [], engineError = false;
        if (car.weightUsed-car.reservedWeight-car.carrier.reservedWeight > car.engine.modifiedMaxLoad()) {
            errors.push("Ten wheeler cab and carrier weigh " + car.weightUsed + " lbs. but engine can only move " + car.engine.modifiedMaxLoad() + " lbs.");
            engineError = true;
        }
        if (!car.engine.truck)
            errors.push("Ten wheelers cannot use car engines");

        CW.baseValidate(car, "Ten Wheeler", errors, engineError);
        CW.validateAccessories(car, errors);
        if (car.activeSuspension)
            errors.push("Only cars, cycles, and trikes can use an Active Suspension");
        CW.baseValidate(car.carrier, "Carrier", errors, engineError);
        CW.validateAccessories(car.carrier, errors);

        if (car.carrier.body.name === CW.tenWheelerCarrierBody.dumper.name) {
            if (car.carrier.topTurret || car.carrier.sunroof) errors.push("A dumper cannot mount a turret or sunroof");
            if (car.carrier.topArmor.plasticPoints > 0 || car.carrier.topArmor.metalPoints > 0) errors.push("A dumper cannot have top armor");
        } else if (car.carrier.body.name === CW.tenWheelerCarrierBody.tanker.name) {
            if ((car.carrier.frontArmor.plasticPoints < 20 && car.carrier.frontArmor.metalPoints < 4) ||
                (car.carrier.backArmor.plasticPoints < 20 && car.carrier.backArmor.metalPoints < 4) ||
                (car.carrier.leftArmor.plasticPoints < 20 && car.carrier.leftArmor.metalPoints < 4) ||
                (car.carrier.rightArmor.plasticPoints < 20 && car.carrier.rightArmor.metalPoints < 4) ||
                (car.carrier.topArmor.plasticPoints < 20 && car.carrier.topArmor.metalPoints < 4) ||
                (car.carrier.underbodyArmor.plasticPoints < 20 && car.carrier.underbodyArmor.metalPoints < 4))
                errors.push("A tanker must have at least 20 points of plastic or 4 points of metal armor in every location");
        } else if (car.carrier.body.name === CW.tenWheelerCarrierBody.flatbed.name) {
            if (car.carrier.topTurret || car.carrier.sideTurret)
                errors.push("A flatbed cannot mount a turret");
            if (car.carrier.sunroof || car.carrier.noPaintWindshield)
                errors.push("A flatbed cannot use a sunroof or no-paint windshield");
        }
        if (car.carrier.heavyDutyTransmission) errors.push("A carrier cannot use a heavy-duty transmission");
        if (car.carrier.ramplate || car.carrier.fakeRamplate) errors.push("A carrier cannot use a ramplate");
        if (car.carrier.brushcutter) errors.push("A carrier cannot use a brushcutter");
        if (car.carrier.bumperSpikes) errors.push("A carrier cannot use front bumper spikes");

        return errors;
    };

    // ************************************* DRAWING ROUTINES ******************************************

    CWD.createTenWheelerCarrierShape = function (carrier) {
        var i, shape = CWD.createVehicleShape(carrier);

        shape.bodyType = "TenWheelerCarrier";
        shape.bodyStyle = CWD.semiTrailerBody;
        shape.leftTires = [];
        shape.rightTires = [];
        for (i = 0; i < 4; i++) {
            shape.leftTires.push(CWD.createTireShape(carrier.backTires, "Back Tires", "editBackTires", true, i < 2));
            shape.rightTires.push(CWD.createTireShape(carrier.backTires, "Back Tires", "editBackTires", false, i < 2));
        }
        shape.phantomShapes = {
            backWeapons: CWD.createShape("Back Weapons", "editCarrierBackWeapons"),
            leftWeapons: CWD.createShape("Left Weapons", "editCarrierLeftWeapons"),
            rightWeapons: CWD.createShape("Right Weapons", "editCarrierRightWeapons"),
            frontArmor: CWD.createShape("Front Armor", "editCarrierArmor"),
            backArmor: CWD.createShape("Back Armor", "editCarrierArmor"),
            leftArmor: CWD.createShape("Left Armor", "editCarrierArmor"),
            rightArmor: CWD.createShape("Right Armor", "editCarrierArmor"),
            body: CWD.createShape("Body Basics", "editBody")
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

        // 10-wheeler carrier layout
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
                    size = {width: 2, height: 6};
                else
                    size = {width: 4, height: 6};
                this.configureLayout(size);
                while (!this.layoutContents(size)) {
                    if(size.height < 6) size.height = 6;
                    else {
                        size.width += 1;
                        this.configureLayout(size);
                    }
                }
            }

            // Lay out Tires, Wheelguards, Wheelhubs
            offset = shape.bodyStyle.layoutTires(shape, flatbed);

            shape.layoutTurrets(size, offset, shape.bodyHeight / 2);
            voffset = flatbed ? -5 : 0;
            if (shape.leftTurret || shape.rightTurret)
                shape.layoutDischargers(offset + 110, offset + 110, 0, 0, 0, voffset, voffset - 15);
            else
                shape.layoutDischargers(offset, offset + 50, -15, 0, 40, voffset, voffset);

            shape.phantomShapes.frontArmor.layout(shape.widthToBody + shape.bodyWidth - 20, shape.heightToBody + 20, 20, shape.bodyHeight - 40);
            shape.phantomShapes.backWeapons.layout(shape.widthToBody + 20, shape.heightToBody + 20, 40, shape.bodyHeight - 40);
            shape.phantomShapes.backArmor.layout(shape.widthToBody, shape.heightToBody + 20, 20, shape.bodyHeight - 40);
            shape.phantomShapes.leftWeapons.layout(shape.widthToBody, shape.heightToBody + 20, shape.bodyWidth - 40, 40);
            shape.phantomShapes.leftArmor.layout(shape.widthToBody, shape.heightToBody, shape.bodyWidth - 40, 20);
            shape.phantomShapes.rightWeapons.layout(shape.widthToBody, shape.heightToBody + shape.bodyHeight - 60, shape.bodyWidth - 40, 40);
            shape.phantomShapes.rightArmor.layout(shape.widthToBody, shape.heightToBody + shape.bodyHeight - 20, shape.bodyWidth - 40, 20);
            shape.phantomShapes.body.layout(shape.widthToBody + 60, shape.heightToBody + 60, shape.bodyWidth - 120, shape.bodyHeight - 120);

            return true;
        };

        shape.initializeVehicle();

        shape.tireContains = function (mx, my) {
            for (var j = 0; j < shape.leftTires.length; j++) {
                if (this.leftTires[j].contains(mx, my)) return this.leftTires[j];
                if (this.rightTires[j].contains(mx, my)) return this.rightTires[j];
            }

            return null;
        };

        shape.hasSideTurret = function() {
            return shape.leftTurret || shape.rightTurret || shape.cab.leftTurret || shape.cab.rightTurret;
        };

        shape.layout = function() {
            this.cab.layout();
        };

        return shape;
    };

    CWD.createTenWheelerShape = function (car) {
        var shape = CWD.createVehicleShape(car);

        shape.bodyType = "TenWheeler";
        shape.bodyStyle = CWD.tenWheelerBody1;

        shape.frontRightTire = CWD.createTireShape(car.frontTires, "Front Tires", "editFrontTires", false, true);
        shape.frontLeftTire = CWD.createTireShape(car.frontTires, "Front Tires", "editFrontTires", true, true);

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
        shape.hasBackWheelguards = function () {
            return this.carrier.hasBackWheelguards();
        };
        shape.hasBackWheelhubs = function () {
            return this.carrier.hasBackWheelhubs();
        };
        shape.addBackWheelguards = function (guards, suppressLayout) {
            this.carrier.addBackWheelguards(guards, suppressLayout);
            if (!suppressLayout) this.layout();
        };
        shape.removeBackWheelguards = function (suppressLayout) {
            this.carrier.removeBackWheelguards(suppressLayout);
            if (!suppressLayout) this.layout();
        };
        shape.addBackWheelhubs = function (hubs, suppressLayout) {
            this.carrier.addBackWheelhubs(hubs, suppressLayout);
            if (!suppressLayout) this.layout();
        };
        shape.removeBackWheelhubs = function (suppressLayout) {
            this.carrier.removeBackWheelhubs(suppressLayout);
            if (!suppressLayout) this.layout();
        };

        shape.carrier = CWD.createTenWheelerCarrierShape(car.carrier);
        shape.carrier.cab = shape;
        shape.initializeVehicle();
        shape.carrier.colorScheme = shape.colorScheme;
        var oldLower = shape.drawLower;
        var oldMiddle = shape.drawMiddle;
        var oldUpper = shape.drawUpper;
        shape.drawLower = function (ctx, carOnly) {
            oldLower.apply(this, [ctx, carOnly]);
            if (!this.suppressDrawing) this.carrier.drawLower(ctx, true);
        };
        shape.drawMiddle = function (ctx, carOnly) {
            if (!this.suppressDrawing) this.carrier.drawMiddle(ctx, true);
            oldMiddle.apply(this, [ctx, carOnly]);
        };
        shape.drawUpper = function (ctx, carOnly) {
            if (!this.suppressDrawing) this.carrier.drawUpper(ctx, true);
            oldUpper.apply(this, [ctx, carOnly]);
        };

        shape.calculateWidthToBody = function() {
            return this.carrier.widthToBody + this.carrier.bodyWidth + 5 + (this.car.carrier.isFlatbed() ? 105 : 0);
        };

        var oldGearWidth = shape.frontGearWidth;
        shape.frontGearWidth = function() {
            var result = oldGearWidth.apply(this);
            if(result <= 18 && this.frontDischargers.length > 0) return 18;
            return result;
        };

        // Ten Wheeler layout
        shape.layoutVehicle = function (forceSameSize) {
            var offset, size;

            shape.carrier.layoutVehicle(forceSameSize);

            shape.componentHeight = 100;
            shape.columnWidth = 100;

            if (forceSameSize) {
                size = shape.layoutSize;
            } else {
                if (this.leftTurret || this.rightTurret || /Longnose/.test(this.car.body.name))
                    size = {width: 3, height: 6};
                else
                    size = {width: 2, height: 6};
            }
            this.configureLayout(size);
            while (!this.layoutContents(size)) {
                size.width += 1;
                this.configureLayout(size);
            }
            shape.w -= shape.widthToBody;
            shape.x = shape.widthToBody;

            // Lay out Tires, Wheelguards, Wheelhubs
            shape.bodyStyle.layoutTires(shape);

            if (shape.backWheelhubs.length > 0) {
                shape.backWheelhubs[0].layout(
                    30, shape.heightToBody + shape.bodyHeight * 3 / 4 + CWD.tireHeight * 2,
                    CWD.tireWidth, CWD.whHeight);
                shape.backWheelhubs[1].layout(
                    30, shape.heightToBody + shape.bodyHeight / 4 - CWD.tireHeight * 2 - CWD.whHeight,
                    CWD.tireWidth, CWD.whHeight);
                shape.backWheelhubs[2].layout(
                        53 + CWD.tireWidth, shape.heightToBody + shape.bodyHeight * 3 / 4 + CWD.tireHeight * 2,
                    CWD.tireWidth, CWD.whHeight);
                shape.backWheelhubs[3].layout(
                        53 + CWD.tireWidth, shape.heightToBody + shape.bodyHeight / 4 - CWD.tireHeight * 2 - CWD.whHeight,
                    CWD.tireWidth, CWD.whHeight);
            }
            if (shape.backWheelguards.length > 0) {
                offset = shape.backWheelhubs.length > 0 ? CWD.whHeight : 0;
                shape.backWheelguards[0].layout(
                    30, shape.heightToBody + shape.bodyHeight * 3 / 4 + CWD.tireHeight * 2 + offset,
                    CWD.tireWidth, CWD.wgHeight);
                shape.backWheelguards[1].layout(
                    30, shape.heightToBody + shape.bodyHeight / 4 - CWD.tireHeight * 2 - CWD.whHeight - offset,
                    CWD.tireWidth, CWD.wgHeight);
                shape.backWheelguards[2].layout(
                        53 + CWD.tireWidth, shape.heightToBody + shape.bodyHeight * 3 / 4 + CWD.tireHeight * 2 + offset,
                    CWD.tireWidth, CWD.wgHeight);
                shape.backWheelguards[3].layout(
                        53 + CWD.tireWidth, shape.heightToBody + shape.bodyHeight / 4 - CWD.tireHeight * 2 - CWD.whHeight - offset,
                    CWD.tireWidth, CWD.wgHeight);
            }
            if (size.width === 3)
                shape.layoutDischargers(shape.widthToBody + 140, 0, 3, -3, 0, -6, 0);
            else
                shape.layoutDischargers(shape.widthToBody + 35, 0, 3, -3, 0, -6, 0);
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
            var result = this.carrier.contains(mx, my);
            if (result && result.type !== 'Tire') result.carrier = true;
            return result;
        };

        var oldContains = shape.contains;
        shape.contains = function (mx, my) {
            var result = oldContains.apply(this, [mx, my]);
            if (result && !result.carrier) result.cab = true;
            return result;
        };

        shape.hasSideTurret = function() {
            return shape.leftTurret || shape.rightTurret || shape.carrier.leftTurret || shape.carrier.rightTurret;
        };

        return shape;
    };
})();
