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
    CWD.createCarShape = function (car) {
        var shape = CWD.createVehicleShape(car);

        shape.bodyType = "Car";
        shape.bodyStyle = CWD.carBody1;

        shape.frontRightTire = CWD.createTireShape(car.frontTires, "Front Tires", "editFrontTires", false, true);
        shape.frontLeftTire = CWD.createTireShape(car.frontTires, "Front Tires", "editFrontTires", true, true);
        shape.backRightTire = CWD.createTireShape(car.backTires, "Back Tires", "editBackTires", false, true);
        shape.backLeftTire = CWD.createTireShape(car.backTires, "Back Tires", "editBackTires", true, true);
        shape.middleRightTire = car.middleOrOuterTires ? CWD.createTireShape(car.backTires, "Back Tires", "editBackTires", false, false) : null;
        shape.middleLeftTire = car.middleOrOuterTires ? CWD.createTireShape(car.backTires, "Back Tires", "editBackTires", true, false) : null;

        shape.clearRepairs = function () {
            this.baseClearRepairs();
            shape.frontRightTire.damage = 0;
            shape.frontLeftTire.damage = 0;
            shape.backRightTire.damage = 0;
            shape.backLeftTire.damage = 0;
            if (shape.middleRightTire) shape.middleRightTire.damage = 0;
            if (shape.middleLeftTire) shape.middleLeftTire.damage = 0;
        };
        shape.repair = function (mechanicLevel, bonus) {
            var result = this.baseRepair(mechanicLevel, bonus);
            if (shape.frontRightTire.damage > 0)
                this.includeRepair(result, "Tire", shape.frontRightTire.tire, mechanicLevel, bonus, 'Impossible', shape.frontRightTire.damage);
            if (shape.frontLeftTire.damage > 0)
                this.includeRepair(result, "Tire", shape.frontLeftTire.tire, mechanicLevel, bonus, 'Impossible', shape.frontLeftTire.damage);
            if (shape.backRightTire.damage > 0)
                this.includeRepair(result, "Tire", shape.backRightTire.tire, mechanicLevel, bonus, 'Impossible', shape.backRightTire.damage);
            if (shape.backLeftTire.damage > 0)
                this.includeRepair(result, "Tire", shape.backLeftTire.tire, mechanicLevel, bonus, 'Impossible', shape.backLeftTire.damage);
            if (shape.middleRightTire && shape.middleRightTire.damage > 0)
                this.includeRepair(result, "Tire", shape.middleRightTire.tire, mechanicLevel, bonus, 'Impossible', shape.middleRightTire.damage);
            if (shape.middleLeftTire && shape.middleLeftTire.damage > 0)
                this.includeRepair(result, "Tire", shape.middleLeftTire.tire, mechanicLevel, bonus, 'Impossible', shape.middleLeftTire.damage);

            return result;
        };
        shape.armorForTire = function (tireShape) {
            var armor = {};
            if (tireShape === this.frontRightTire) {
                armor.wheelguard = this.frontWheelguards.length > 0 ? this.frontWheelguards[0] : null;
                armor.wheelhub = this.frontWheelhubs.length > 0 ? this.frontWheelhubs[0] : null;
            } else if (tireShape === this.frontLeftTire) {
                armor.wheelguard = this.frontWheelguards.length > 0 ? this.frontWheelguards[1] : null;
                armor.wheelhub = this.frontWheelhubs.length > 0 ? this.frontWheelhubs[1] : null;
            } else if (tireShape === this.backRightTire || tireShape === this.middleRightTire) {
                armor.wheelguard = this.backWheelguards.length > 0 ? this.backWheelguards[0] : null;
                armor.wheelhub = this.backWheelhubs.length > 0 ? this.backWheelhubs[0] : null;
            } else if (tireShape === this.backLeftTire || tireShape === this.middleLeftTire) {
                armor.wheelguard = this.backWheelguards.length > 0 ? this.backWheelguards[1] : null;
                armor.wheelhub = this.backWheelhubs.length > 0 ? this.backWheelhubs[1] : null;
            }
            return armor;
        };

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

        shape.initializeVehicle();

        shape.backWheelsWider = function() {return this.car.hasDoubleWheels() && !this.car.thirdRowTiresInMiddle;};

        // Car layout
        shape.layoutVehicle = function (forceSameSize) {
            var size;

            shape.componentHeight = 100;
            shape.columnWidth = 100;

            if (forceSameSize) {
                size = shape.layoutSize;
                this.configureLayout(size);
                if (!this.layoutContents(size)) return false;
            } else {
                if ((this.leftTurret && this.leftDischargers.length > 0) || (this.rightTurret && this.rightDischargers.length > 0))
                    size = {width: 5, height: 4};
                else if (this.car.body.name === 'Subcompact') {
                    if (this.leftTurret || this.rightTurret || this.leftDischargers.length > 1 || this.rightDischargers.length > 1)
                        size = {width: 4, height: 4};
                    else
                        size = {width: 3, height: 4};
                }
                else if (this.car.body.name === 'Compact' || this.car.body.name === 'Sprint') size = {width: 4, height: 4};
                else size = {width: 5, height: 4};
                size = this.findMinimumSize(size);
            }

            // Lay out Tires, Wheelguards, Wheelhubs
            shape.bodyStyle.layoutTires(shape);
            shape.layoutDischargers(shape.widthToBody + 130, size.width === 4 ? shape.widthToBody + 190 : shape.widthToBody + shape.bodyWidth - 170, 5, -5);
            shape.layoutTurrets(size, shape.widthToBody + (size.width === 4 ? 140 : size.width === 5 ? 200 : 250) - (shape.leftTurret && shape.leftTurret.turret ? 5 : 0), shape.bodyHeight / 2);
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
            if (this.middleLeftTire && this.middleLeftTire.contains(mx, my)) {
                return this.middleLeftTire;
            }
            if (this.middleRightTire && this.middleRightTire.contains(mx, my)) {
                return this.middleRightTire;
            }
            return null;
        };

        return shape;
    };
})();
