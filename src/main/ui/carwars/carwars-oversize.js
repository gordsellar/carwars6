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
    CWD.createOversizeVehicleShape = function (car) {
        var shape = CWD.createVehicleShape(car);
        shape.leftBackWeapons = null;
        shape.rightBackWeapons = null;
        shape.topBackWeapons = null;
        shape.underbodyBackWeapons = null;
        shape.topBackTurret = null;
        shape.rightBackTurret = null;
        shape.leftBackTurret = null;
        shape.topBackTurretWeapons = [];
        shape.leftBackTurretWeapons = [];
        shape.rightBackTurretWeapons = [];
        shape.topBackTurretBoosters = [];
        shape.leftBackTurretBoosters = [];
        shape.rightBackTurretBoosters = [];
        shape.topBackTurretGunner = null;

        shape.phantomShapes = {
            frontWeapons: CWD.createShape("Front Weapons", "editFrontWeapons"),
            leftWeapons: CWD.createShape("Left Weapons", "editLeftWeapons"),
            rightWeapons: CWD.createShape("Right Weapons", "editRightWeapons"),
            leftBackWeapons: CWD.createShape("Left Back Weapons", "editLeftBackWeapons"),
            rightBackWeapons: CWD.createShape("Right Back Weapons", "editRightBackWeapons"),
            backWeapons: CWD.createShape("Back Weapons", "editBackWeapons"),
            frontArmor: CWD.createShape("Front Armor", "editArmor"),
            backArmor: CWD.createShape("Back Armor", "editArmor"),
            leftArmor: CWD.createShape("Left Armor", "editArmor"),
            rightArmor: CWD.createShape("Right Armor", "editArmor"),
            leftBackArmor: CWD.createShape("Left Back Armor", "editArmor"),
            rightBackArmor: CWD.createShape("Right Back Armor", "editArmor"),
            body: CWD.createShape("Body Basics", "editBody")
        };

        shape.setOversize = function () {
            var i, j;
            var front = / Front$/;
            if (this.car.hasOversizeWeaponFacings()) {
                if (!this.leftBackWeapons) {
                    this.leftBackWeapons = [];
                    for (i = 0; i < this.car.leftBackWeapons.length; i++) {
                        this.addWeapon(this.car.leftBackWeapons[i], "LeftBack", true);
                        for (j = 1; j < this.car.leftBackWeapons[i].count; j++)
                            this.increaseWeaponCount(this.car.leftBackWeapons[i], "LeftBack", true);
                    }
                }
                if (!this.rightBackWeapons) {
                    this.rightBackWeapons = [];
                    for (i = 0; i < this.car.rightBackWeapons.length; i++) {
                        this.addWeapon(this.car.rightBackWeapons[i], "RightBack", true);
                        for (j = 1; j < this.car.rightBackWeapons[i].count; j++)
                            this.increaseWeaponCount(this.car.rightBackWeapons[i], "RightBack", true);
                    }
                }
                if (!this.topBackWeapons) {
                    this.topBackWeapons = [];
                    for (i = 0; i < this.car.topBackWeapons.length; i++) {
                        this.addWeapon(this.car.topBackWeapons[i], "TopBack", true);
                        for (j = 1; j < this.car.topBackWeapons[i].count; j++)
                            this.increaseWeaponCount(this.car.topBackWeapons[i], "TopBack", true);
                    }
                }
                if (!this.underbodyBackWeapons) {
                    this.underbodyBackWeapons = [];
                    for (i = 0; i < this.car.underbodyBackWeapons.length; i++) {
                        this.addWeapon(this.car.underbodyBackWeapons[i], "UnderbodyBack", true);
                        for (j = 1; j < this.car.underbodyBackWeapons[i].count; j++)
                            this.increaseWeaponCount(this.car.underbodyBackWeapons[i], "UnderbodyBack", true);
                    }
                }
                if (this.car.topBackTurret && !this.topBackTurret) {
                    this.addTopBackTurret(this.car.topBackTurret, true);
                    for (i = 0; i < this.car.topBackTurret.weapons.length; i++) {
                        this.addWeapon(this.car.topBackTurret.weapons[i], "topBackTurret", true);
                        for (j = 1; j < this.car.topBackTurret.weapons[i].count; j++)
                            this.increaseWeaponCount(this.car.topBackTurret.weapons[i], "topBackTurret", true);
                    }
                    for (i = 0; i < this.car.topBackTurret.boosters.length; i++)
                        this.addEWPBooster(this.car.topBackTurret.boosters[i], "topBackTurret", true);
                }
                if (this.car.sideBackTurret && !this.leftBackTurret) {
                    this.addLeftBackTurret(this.car.sideBackTurret, true);
                    for (i = 0; i < this.car.sideBackTurret.weapons.length; i++) {
                        this.addWeapon(this.car.sideBackTurret.weapons[i], "leftBackTurret", true);
                        for (j = 1; j < this.car.sideBackTurret.weapons[i].count; j++)
                            this.increaseWeaponCount(this.car.sideBackTurret.weapons[i], "leftBackTurret", true);
                    }
                    for (i = 0; i < this.car.sideBackTurret.boosters.length; i++)
                        this.addEWPBooster(this.car.sideBackTurret.boosters[i], "leftBackTurret", true);
                }
                if (this.car.sideBackTurret && !this.rightBackTurret) {
                    this.addRightBackTurret(this.car.sideBackTurret, true);
                    for (i = 0; i < this.car.sideBackTurret.weapons.length; i++) {
                        this.addWeapon(this.car.sideBackTurret.weapons[i], "rightBackTurret", true);
                        for (j = 1; j < this.car.sideBackTurret.weapons[i].count; j++)
                            this.increaseWeaponCount(this.car.sideBackTurret.weapons[i], "rightBackTurret", true);
                    }
                    for (i = 0; i < this.car.sideBackTurret.boosters.length; i++)
                        this.addEWPBooster(this.car.sideBackTurret.boosters[i], "rightBackTurret", true);
                }
                if (this.leftTurret && !front.test(this.leftTurret.hoverText))
                    this.leftTurret.hoverText += " Front";
                if (this.rightTurret && !front.test(this.rightTurret.hoverText))
                    this.rightTurret.hoverText += " Front";
                if (this.topTurret && !front.test(this.topTurret.hoverText))
                    this.topTurret.hoverText += " Front";
                for (i = 0; i < this.car.leftWeapons.length; i++)
                    if (!this.car.leftWeapons[i].isDischarger())
                        this.car.leftWeapons[i].setDisplayLocation("LeftFront");
                for (i = 0; i < this.car.rightWeapons.length; i++)
                    if (!this.car.rightWeapons[i].isDischarger())
                        this.car.rightWeapons[i].setDisplayLocation("RightFront");
                for (i = 0; i < this.car.topWeapons.length; i++)
                    if (!this.car.topWeapons[i].isDischarger())
                        this.car.topWeapons[i].setDisplayLocation("TopFront");
                for (i = 0; i < this.car.underbodyWeapons.length; i++)
                    if (!this.car.underbodyWeapons[i].isDischarger())
                        this.car.underbodyWeapons[i].setDisplayLocation("UnderbodyFront");
                for (i = 0; i < this.leftWeapons.length; i++) {
                    this.leftWeapons[i].updateHoverText();
                    if (!front.test(this.leftWeapons[i].hoverText) && !this.leftWeapons[i].weapon.isDischarger())
                        this.leftWeapons[i].hoverText += ' Front';
                }
                for (i = 0; i < this.rightWeapons.length; i++) {
                    this.rightWeapons[i].updateHoverText();
                    if (!front.test(this.rightWeapons[i].hoverText) && !this.rightWeapons[i].weapon.isDischarger())
                        this.rightWeapons[i].hoverText += ' Front';
                }
                for (i = 0; i < this.topWeapons.length; i++) {
                    this.topWeapons[i].updateHoverText();
                    if (!front.test(this.topWeapons[i].hoverText) && !this.topWeapons[i].weapon.isDischarger())
                        this.topWeapons[i].hoverText += ' Front';
                }
                for (i = 0; i < this.underbodyWeapons.length; i++) {
                    this.underbodyWeapons[i].updateHoverText();
                    if (!front.test(this.underbodyWeapons[i].hoverText) && !this.underbodyWeapons[i].weapon.isDischarger())
                        this.underbodyWeapons[i].hoverText += ' Front';
                }
                shape.phantomShapes.rightArmor.hoverText = "Right Front Armor";
                shape.phantomShapes.leftArmor.hoverText = "Left Front Armor";
                shape.phantomShapes.rightWeapons.hoverText = "Right Front Weapons";
                shape.phantomShapes.leftWeapons.hoverText = "Left Front Weapons";
            } else {
                if (this.car.leftBackWeapons)
                    for (i = this.car.leftBackWeapons.length - 1; i >= 0; i--)
                        this.removeWeapon(this.car.leftBackWeapons[i], "LeftBack");
                if (this.car.rightBackWeapons)
                    for (i = this.car.rightBackWeapons.length - 1; i >= 0; i--)
                        this.removeWeapon(this.car.rightBackWeapons[i], "RightBack");
                if (this.car.topBackWeapons)
                    for (i = this.car.topBackWeapons.length - 1; i >= 0; i--)
                        this.removeWeapon(this.car.topBackWeapons[i], "TopBack");
                if (this.car.underbodyBackWeapons)
                    for (i = this.car.underbodyBackWeapons.length - 1; i >= 0; i--)
                        this.removeWeapon(this.car.underbodyBackWeapons[i], "UnderbodyBack");
                if (this.topBackTurret) this.removeTopBackTurret();
                if (this.leftBackTurret) this.removeLeftBackTurret();
                if (this.rightBackTurret) this.removeRightBackTurret();
                this.leftBackWeapons = null;
                this.rightBackWeapons = null;
                this.topBackWeapons = null;
                this.underbodyBackWeapons = null;
                for (i = 0; i < this.leftWeapons.length; i++)
                    if (front.test(this.leftWeapons[i].hoverText))
                        this.leftWeapons[i].hoverText = this.leftWeapons[i].hoverText.substr(0, this.leftWeapons[i].hoverText.length - 6);
                for (i = 0; i < this.rightWeapons.length; i++)
                    if (front.test(this.rightWeapons[i].hoverText))
                        this.rightWeapons[i].hoverText = this.rightWeapons[i].hoverText.substr(0, this.rightWeapons[i].hoverText.length - 6);
                for (i = 0; i < this.topWeapons.length; i++)
                    if (front.test(this.topWeapons[i].hoverText))
                        this.topWeapons[i].hoverText = this.topWeapons[i].hoverText.substr(0, this.topWeapons[i].hoverText.length - 6);
                for (i = 0; i < this.underbodyWeapons.length; i++)
                    if (front.test(this.underbodyWeapons[i].hoverText))
                        this.underbodyWeapons[i].hoverText = this.underbodyWeapons[i].hoverText.substr(0, this.underbodyWeapons[i].hoverText.length - 6);
                if (this.topTurret && front.test(this.topTurret.hoverText))
                    this.topTurret.hoverText = this.topTurret.hoverText.substr(0, this.topTurret.hoverText.length - 6);
                if (this.leftTurret && front.test(this.leftTurret.hoverText))
                    this.leftTurret.hoverText = this.leftTurret.hoverText.substr(0, this.leftTurret.hoverText.length - 6);
                if (this.rightTurret && front.test(this.rightTurret.hoverText))
                    this.rightTurret.hoverText = this.rightTurret.hoverText.substr(0, this.rightTurret.hoverText.length - 6);
                for (i = 0; i < this.car.leftWeapons.length; i++)
                    this.car.leftWeapons[i].setDisplayLocation("Left");
                for (i = 0; i < this.car.rightWeapons.length; i++)
                    this.car.rightWeapons[i].setDisplayLocation("Right");
                for (i = 0; i < this.car.topWeapons.length; i++)
                    this.car.topWeapons[i].setDisplayLocation("Top");
                for (i = 0; i < this.car.underbodyWeapons.length; i++)
                    this.car.underbodyWeapons[i].setDisplayLocation("Underbody");
                shape.phantomShapes.rightArmor.hoverText = "Right Armor";
                shape.phantomShapes.leftArmor.hoverText = "Left Armor";
                shape.phantomShapes.rightWeapons.hoverText = "Right Weapons";
                shape.phantomShapes.leftWeapons.hoverText = "Left Weapons";
            }
        };
        shape.removeTopBackTurret = function () {
            var i;
            for (i = 0; i < shape.topBackTurretWeapons.length; i++) {
                shape.removeShape(shape.topBackTurretWeapons[i]);
            }
            for (i = 0; i < shape.topBackTurretBoosters.length; i++) {
                shape.removeShape(shape.topBackTurretBoosters[i]);
            }
            if (shape.topBackTurretGunner) shape.removeShape(shape.topBackTurretGunner);
            shape.topBackTurretWeapons = [];
            shape.topBackTurretBoosters = [];
            shape.topBackTurretGunner = null;
            shape.removeShape(shape.topBackTurret);
            shape.removeCargoShape(shape.topBackTurret);
            shape.topBackTurret = null;
            shape.layout();
        };
        shape.addTopBackTurret = function (turret, suppressLayout) {
            shape.topBackTurret = CWD.createTurretShape(turret, "editTopBackTurret");
            shape.topBackTurret.hoverLink = "editTopBackTurret";
            shape.topBackTurret.hoverText += " Back";
            shape.shapes.push(shape.topBackTurret);
            shape.cargoShapes.push(shape.topBackTurret);
            if (turret.gunner) {
                shape.topBackTurretGunner = CWD.createCrewShape(turret.gunner);
                shape.shapes.push(shape.topBackTurretGunner);
            }
            if (!suppressLayout) {
                shape.layout();
            }
        };
        shape.addLeftBackTurret = function (turret, suppressLayout) {
            shape.leftBackTurret = turret.isEWP() ? CWD.createEWPShape(turret, true) : CWD.createSponsonShape(turret, true);
            shape.leftBackTurret.hoverLink = "editLeftBackTurret";
            shape.leftBackTurret.hoverText += " Back";
            shape.shapes.push(shape.leftBackTurret);
            if (!suppressLayout) shape.layout();
        };
        shape.addRightBackTurret = function (turret, suppressLayout) {
            shape.rightBackTurret = turret.isEWP() ? CWD.createEWPShape(turret, false) : CWD.createSponsonShape(turret, false);
            shape.rightBackTurret.hoverLink = "editRightBackTurret";
            shape.rightBackTurret.hoverText += " Back";
            shape.shapes.push(shape.rightBackTurret);
            if (!suppressLayout) shape.layout();
        };
        shape.removeLeftBackTurret = function () {
            var i;
            for (i = 0; i < shape.leftBackTurretWeapons.length; i++) {
                shape.removeShape(shape.leftBackTurretWeapons[i]);
            }
            for (i = 0; i < shape.leftBackTurretBoosters.length; i++) {
                shape.removeShape(shape.leftBackTurretBoosters[i]);
            }
            shape.leftBackTurretWeapons = [];
            shape.leftBackTurretBoosters = [];
            shape.removeShape(shape.leftBackTurret);
            shape.leftBackTurret = null;
            shape.layout();
        };
        shape.removeRightBackTurret = function () {
            var i;
            for (i = 0; i < shape.rightBackTurretWeapons.length; i++) {
                shape.removeShape(shape.rightBackTurretWeapons[i]);
            }
            for (i = 0; i < shape.rightBackTurretBoosters.length; i++) {
                shape.removeShape(shape.rightBackTurretBoosters[i]);
            }
            shape.rightBackTurretWeapons = [];
            shape.rightBackTurretBoosters = [];
            shape.removeShape(shape.rightBackTurret);
            shape.rightBackTurret = null;
            shape.layout();
        };
        var oldAddLeft = shape.addLeftTurret;
        var oldAddRight = shape.addRightTurret;
        var oldAddTop = shape.addTopTurret;
        shape.addLeftTurret = function (turret, suppressLayout) {
            oldAddLeft.apply(this, [turret, suppressLayout]);
            if (this.car.hasOversizeWeaponFacings()) this.leftTurret.hoverText += " Front";
        };
        shape.addRightTurret = function (turret, suppressLayout) {
            oldAddRight.apply(this, [turret, suppressLayout]);
            if (this.car.hasOversizeWeaponFacings()) this.rightTurret.hoverText += " Front";
        };
        shape.addTopTurret = function (turret, suppressLayout) {
            oldAddTop.apply(this, [turret, suppressLayout]);
            if (this.car.hasOversizeWeaponFacings()) this.topTurret.hoverText += " Front";
        };

        return shape;
    };
})();