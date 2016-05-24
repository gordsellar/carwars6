/* global CWD, THREE */
/* global CW3D: true */
CW3D = {};

(function() {
    "use strict";

    CWD.webgl.cloneObject = function (obj) {
        if (obj.material) obj.material = obj.material.clone();
        if (obj.geometry) obj.geometry = obj.geometry.clone();
        if (obj.children.length > 0) {
            for (var i = 0; i < obj.children.length; i++)
                this.cloneObject(obj.children[i]);
        }
    };
    CWD.webgl.cloneModel = function (model) {
        var result = model.clone();
        this.cloneObject(result);
        return result;
    };
    CWD.webgl.getWeaponBarrel = function (model, barrelSize) {
        var i, result;
        model = CWD.webgl[model.userData.original];
        for (i = 0; i < model.children.length; i++) {
            if (model.children[i].name === "Barrel" + barrelSize) {
                result = model.children[i];
                break;
            }
        }
        result = result.clone();
        this.cloneObject(result);
        this.recalculateModel(result); // Barrel alone doesn't have any statistics
        return result;
    };
    CWD.webgl.cloneWeapon = function (weaponType, barrelSize) {
        var result = CWD.webgl[weaponType].clone();
        // Select one of the barrel sizes
        var kids = [null, null];
        for (var k = 0; k < result.children.length; k++) {
            if (/Barrel/.test(result.children[k].name)) {
                if (result.children[k].name === "Barrel" + barrelSize) kids[1] = result.children[k];
            } else kids[0] = result.children[k];
        }
        result.children = kids;
        this.cloneObject(result);
        // Calculate bounds for the weapon body only
        result.name = "Weapon";
        result.userData.original = weaponType;
        this.recalculateModel(result);
        return result;
    };
    CWD.webgl.resizeModel = function (model, factor) {
        model.scale.multiplyScalar(factor);
        model.updateMatrix();
        model.updateMatrixWorld(true);
        return this.recalculateModel(model);
    };
    CWD.webgl.moveModel = function (model, dest) {
        model.position.add(new THREE.Vector3(dest.x - model.userData.center.x, dest.y - model.userData.center.y, dest.z - model.userData.center.z));
        model.updateMatrix();
        model.updateMatrixWorld(true);
        return this.recalculateModel(model);
    };


    //TODO: Discharger art & positions
    //TODO: Front Hood vs Grille Weapon positions
    //TODO: Hover Locations ("Weapon Bay")
    //TODO: Wheelguards, wheelhubs
    //TODO: Boosters & jump jets

    CW3D.createVehicleShape = function (car, scene, bodyStats, body, models) {
        var shape = {};

        // For dealing with 3D stuff
        shape.scene = scene;
        shape.models = models;
        shape.body = body;
        shape.bodyStats = bodyStats;
        shape.noSpoiler = body.getObjectByName("No_Spoiler", true);
        shape.spoiler = body.getObjectByName("Spoiler", true);
        shape.noAirdam = body.getObjectByName("No_Airdam", true);
        shape.airdam = body.getObjectByName("Airdam", true);
        // Set all the basic properties
        shape.engine = null;
        shape.tank = null;
        shape.frontWeapons = [];
        shape.leftWeapons = [];
        shape.rightWeapons = [];
        shape.backWeapons = [];
        shape.topWeapons = [];
        shape.underbodyWeapons = [];
        shape.cargoWeapons = [];
        shape.frontLeftWeapons = [];
        shape.frontRightWeapons = [];
        shape.backLeftWeapons = [];
        shape.backRightWeapons = [];
        shape.topTurretWeapons = [];
        shape.leftTurretWeapons = [];
        shape.rightTurretWeapons = [];
        shape.topTurretBoosters = [];
        shape.leftTurretBoosters = [];
        shape.rightTurretBoosters = [];
        shape.topTurretGunner = null;
        shape.leftDischargers = [];
        shape.rightDischargers = [];
        shape.frontDischargers = [];
        shape.backDischargers = [];
        shape.topDischargers = [];
        shape.underbodyDischargers = [];
        shape.frontWheelguards = [];
        shape.frontWheelhubs = [];
        shape.middleWheelguards = [];
        shape.middleWheelhubs = [];
        shape.backWheelguards = [];
        shape.backWheelhubs = [];
        shape.crew = [];
        shape.crewCompartmentCA = null;
        shape.frontCA = null;
        shape.backCA = null;
        shape.leftCA = null;
        shape.rightCA = null;
        shape.passengers = [];
        shape.accessories = [];
        shape.topTurret = null;
        shape.leftTurret = null;
        shape.rightTurret = null;
        shape.backBoosters = [];
        shape.frontBoosters = [];
        shape.jumpJets = [];
        shape.damagedArmor = [];

        shape.initializeVehicle = function () {
            var i, j;

            if (this.spoiler && this.noSpoiler) {
                if (car.spoiler) body.remove(this.noSpoiler);
                else body.remove(this.spoiler);
            }
            if (this.airdam && this.noAirdam) {
                if (car.airdam) body.remove(this.noAirdam);
                else body.remove(this.airdam);
            }

            // TODO: Car Only
            this.frontRightTire = CW3D.createTireShape(car.frontTires, "Front Tires", "editFrontTires", false);
            this.addShape(this.frontRightTire);
            this.frontLeftTire = CW3D.createTireShape(car.frontTires, "Front Tires", "editFrontTires", true);
            this.addShape(this.frontLeftTire);
            this.backRightTire = CW3D.createTireShape(car.backTires, "Back Tires", "editBackTires", false);
            this.addShape(this.backRightTire);
            this.backLeftTire = CW3D.createTireShape(car.backTires, "Back Tires", "editBackTires", true);
            this.addShape(this.backLeftTire);
            if (car.middleOrOuterTires) {
                this.addBackOuterTires(car.middleOrOuterTires, true);
            }

            if (car.engine) {
                this.engine = CW3D.createEngineShape(car.engine);
                this.addShape(this.engine);
            }
            for (i = 0; i < car.crew.length; i++) {
                this.addCrew(car.crew[i], true);
            }
            for (i = 0; i < car.passengers.length; i++) {
                this.addPassenger(car.passengers[i], true);
            }
            for (i = 0; i < car.accessories.length; i++) {
                // TODO: recognize spare tires and other specific shapes
                this.addAccessory(car.accessories[i], true);
            }
            //        if (car.crewCompartmentCA) {
            //            this.addCrewCompartmentCA(car.crewCompartmentCA, true);
            //        }
            if (car.gasTank) {
                this.addGasTank(car.gasTank, true);
            }
            for (i = 0; i < car.frontWeapons.length; i++) {
                this.addWeapon(car.frontWeapons[i], 'Front', true);
                for (j = 1; j < car.frontWeapons[i].count; j++) {
                    this.increaseWeaponCount(car.frontWeapons[i], 'Front', true);
                }
            }
            //        for (i = 0; i < car.backWeapons.length; i++) {
            //            this.addWeapon(car.backWeapons[i], 'Back', true);
            //            for (j = 1; j < car.backWeapons[i].count; j++) {
            //                this.increaseWeaponCount(car.backWeapons[i], 'Back', true);
            //            }
            //        }
            //        for (i = 0; i < car.leftWeapons.length; i++) {
            //            this.addWeapon(car.leftWeapons[i], 'Left', true);
            //            for (j = 1; j < car.leftWeapons[i].count; j++) {
            //                this.increaseWeaponCount(car.leftWeapons[i], 'Left', true);
            //            }
            //        }
            //        for (i = 0; i < car.rightWeapons.length; i++) {
            //            this.addWeapon(car.rightWeapons[i], 'Right', true);
            //            for (j = 1; j < car.rightWeapons[i].count; j++) {
            //                this.increaseWeaponCount(car.rightWeapons[i], 'Right', true);
            //            }
            //        }
            //        for (i = 0; i < car.topWeapons.length; i++) {
            //            this.addWeapon(car.topWeapons[i], 'Top', true);
            //            for (j = 1; j < car.topWeapons[i].count; j++) {
            //                this.increaseWeaponCount(car.topWeapons[i], 'Top', true);
            //            }
            //        }
            //        for (i = 0; i < car.underbodyWeapons.length; i++) {
            //            this.addWeapon(car.underbodyWeapons[i], 'Underbody', true);
            //            for (j = 1; j < car.underbodyWeapons[i].count; j++) {
            //                this.increaseWeaponCount(car.underbodyWeapons[i], 'Underbody', true);
            //            }
            //        }
            //        for (i = 0; i < car.frontRightWeapons.length; i++) {
            //            this.addWeapon(car.frontRightWeapons[i], 'FrontRight', true);
            //            for (j = 1; j < car.frontRightWeapons[i].count; j++) {
            //                this.increaseWeaponCount(car.frontRightWeapons[i], 'FrontRight', true);
            //            }
            //        }
            //        for (i = 0; i < car.frontLeftWeapons.length; i++) {
            //            this.addWeapon(car.frontLeftWeapons[i], 'FrontLeft', true);
            //            for (j = 1; j < car.frontLeftWeapons[i].count; j++) {
            //                this.increaseWeaponCount(car.frontLeftWeapons[i], 'FrontLeft', true);
            //            }
            //        }
            //        for (i = 0; i < car.backRightWeapons.length; i++) {
            //            this.addWeapon(car.backRightWeapons[i], 'BackRight', true);
            //            for (j = 1; j < car.backRightWeapons[i].count; j++) {
            //                this.increaseWeaponCount(car.backRightWeapons[i], 'BackRight', true);
            //            }
            //        }
            //        for (i = 0; i < car.backLeftWeapons.length; i++) {
            //            this.addWeapon(car.backLeftWeapons[i], 'BackLeft', true);
            //            for (j = 1; j < car.backLeftWeapons[i].count; j++) {
            //                this.increaseWeaponCount(car.backLeftWeapons[i], 'BackLeft', true);
            //            }
            //        }
            if (car.topTurret) {
                this.addTopTurret(car.topTurret, true);
                for (i = 0; i < car.topTurret.weapons.length; i++) {
                    this.addWeapon(car.topTurret.weapons[i], "topTurret", true);
                    for (j = 1; j < car.topTurret.weapons[i].count; j++) {
                        this.increaseWeaponCount(car.topTurret.weapons[i], "topTurret", true);
                    }
                }
                //            for (i = 0; i < this.car.topTurret.boosters.length; i++)
                //                this.addEWPBooster(this.car.topTurret.boosters[i], "topTurret", true);
            }
            //        if (car.leftTurret) {
            //            this.addLeftTurret(car.leftTurret, true);
            //            for (i = 0; i < car.leftTurret.weapons.length; i++) {
            //                this.addWeapon(car.leftTurret.weapons[i], "leftTurret", true);
            //                for (j = 1; j < car.leftTurret.weapons[i].count; j++) {
            //                    this.increaseWeaponCount(car.leftTurret.weapons[i], "leftTurret", true);
            //                }
            //            }
            //            for (i = 0; i < this.car.leftTurret.boosters.length; i++)
            //                this.addEWPBooster(this.car.leftTurret.boosters[i], "leftTurret", true);
            //        }
            //        if (car.rightTurret) {
            //            this.addRightTurret(car.rightTurret, true);
            //            for (i = 0; i < car.rightTurret.weapons.length; i++) {
            //                this.addWeapon(car.rightTurret.weapons[i], "rightTurret", true);
            //                for (j = 1; j < car.rightTurret.weapons[i].count; j++) {
            //                    this.increaseWeaponCount(car.rightTurret.weapons[i], "rightTurret", true);
            //                }
            //            }
            //            for (i = 0; i < this.car.rightTurret.boosters.length; i++)
            //                this.addEWPBooster(this.car.rightTurret.boosters[i], "rightTurret", true);
            //        }
            //        if (car.frontWheelhubs != null) {
            //            this.addFrontWheelhubs(car.frontWheelhubs, true);
            //        }
            //        if (car.frontWheelguards != null) {
            //            this.addFrontWheelguards(car.frontWheelguards, true);
            //        }
            //        if (car.backWheelhubs != null) {
            //            this.addBackWheelhubs(car.backWheelhubs, true);
            //        }
            //        if (car.backWheelguards != null) {
            //            this.addBackWheelguards(car.backWheelguards, true);
            //        }
            //        for (i = 0; i < car.boosters.length; i++) {
            //            this.addBooster(car.boosters[i], true);
            //        }

            //        if (car.appearance.colorScheme) this.colorScheme = car.appearance.colorScheme;
            //        if (car.appearance.engine) {
            //            this.engine.manuallyPlaced = true;
            //            this.engine.topColumn = car.appearance.engine.topColumn;
            //        }
            //        if (car.appearance.driver) {
            //            this.crew[0].manuallyPlaced = true;
            //            this.crew[0].topColumn = car.appearance.driver.topColumn;
            //        }
        };

        var layoutRow = function (items, bbox) {
            var lenX = (bbox.max.x - bbox.min.x) / items.length;
            var lenY = bbox.max.y - bbox.min.y;
            var lenZ = bbox.max.z - bbox.min.z;
            var midX = bbox.min.x + (bbox.max.x - bbox.min.x) / 2;
            var midY = bbox.min.y + (bbox.max.y - bbox.min.y) / 2;
            var midZ = bbox.min.z + (bbox.max.z - bbox.min.z) / 2;
            var xs, ys, zs, factor, midCell;
            for (var i = 0; i < items.length; i++) {
                //            console.log(items[i].model.name+": Cell Z from "+bbox.min.z+"-"+bbox.max.z+" initial "+items[i].boundingBox.min.z+"-"+items[i].boundingBox.max.z+" length "+(items[i].boundingBox.max.z-items[i].boundingBox.min.z)+" or "+items[i].size.z);
                xs = items[i].xScale ? items[i].xScale : 1;
                ys = items[i].yScale ? items[i].yScale : 1;
                zs = items[i].zScale ? items[i].zScale : 1;
                factor = Math.min(lenX / (items[i].userData.size.x * xs), lenY / (items[i].userData.size.y * ys), lenZ / (items[i].userData.size.z * zs));
                CWD.webgl.resizeModel(items[i], factor);
                midCell = midX - lenX * (i - (items.length - 1) / 2);
                CWD.webgl.moveModel(items[i], {x: midCell, y: midY, z: midZ + lenZ * (1 / zs - 1) / 2});
                //            console.log(items[i].model.name+": Cell Z from "+bbox.min.z+"-"+bbox.max.z+" final "+items[i].boundingBox.min.z+"-"+items[i].boundingBox.max.z+" length "+(items[i].boundingBox.max.z-items[i].boundingBox.min.z)+" or "+items[i].size.z+" factor "+factor);
            }
        };
        shape.layout = function () {
            var i, data = [], factor;

            CWD.webgl.resizeModel(this.frontLeftTire, this.bodyStats.frontTires.diameter / this.frontLeftTire.userData.size.y);
            CWD.webgl.moveModel(this.frontLeftTire, {x: this.bodyStats.frontTires.x + this.frontLeftTire.userData.size.x / 2, y: this.bodyStats.frontTires.y, z: this.bodyStats.frontTires.z});
            CWD.webgl.resizeModel(this.frontRightTire, this.bodyStats.frontTires.diameter / this.frontRightTire.userData.size.y);
            CWD.webgl.moveModel(this.frontRightTire, {x: -this.bodyStats.frontTires.x - this.frontRightTire.userData.size.x / 2, y: this.bodyStats.frontTires.y, z: this.bodyStats.frontTires.z});
            CWD.webgl.resizeModel(this.backLeftTire, this.bodyStats.backTires.diameter / this.backLeftTire.userData.size.y);
            CWD.webgl.moveModel(this.backLeftTire, {x: this.bodyStats.backTires.x + this.backLeftTire.userData.size.x / 2, y: this.bodyStats.backTires.y, z: this.bodyStats.backTires.z});
            CWD.webgl.resizeModel(this.backRightTire, this.bodyStats.backTires.diameter / this.backRightTire.userData.size.y);
            CWD.webgl.moveModel(this.backRightTire, {x: -this.bodyStats.backTires.x - this.backRightTire.userData.size.x / 2, y: this.bodyStats.backTires.y, z: this.bodyStats.backTires.z});
            if (this.backLeftOuterTire) {
                CWD.webgl.resizeModel(this.backLeftOuterTire, this.bodyStats.backTires.diameter / this.backLeftOuterTire.userData.size.y);
                CWD.webgl.moveModel(this.backLeftOuterTire, {x: this.bodyStats.backTires.x + this.backLeftOuterTire.userData.size.x * 3 / 2, y: this.bodyStats.backTires.y, z: this.bodyStats.backTires.z});
                CWD.webgl.resizeModel(this.backRightOuterTire, this.bodyStats.backTires.diameter / this.backRightOuterTire.userData.size.y);
                CWD.webgl.moveModel(this.backRightOuterTire, {x: -this.bodyStats.backTires.x - this.backRightOuterTire.userData.size.x * 3 / 2, y: this.bodyStats.backTires.y, z: this.bodyStats.backTires.z});
            }

            for (i = 0; i < this.bodyStats.rows.length; i++)
                data.push([]);
            for (i = 0; i < this.frontWeapons.length; i++)
                data[0].push(this.frontWeapons[i]);
            if (this.engine) data[1].push(this.engine);
            for (i = 0; i < this.crew.length; i++)
                data[2].push(this.crew[i]);
            for (i = 0; i < this.passengers.length; i++)
                data[3].push(this.passengers[i]);
            // TODO: split up accessories across rows, using back rows where appropriate
            for (i = 0; i < this.accessories.length; i++)
                data[3].push(this.accessories[i]);

            for (i = 0; i < data.length; i++)
                layoutRow(data[i], this.bodyStats.rows[i]);
            if (this.tank)
                layoutRow([this.tank], this.bodyStats.gasTank);

            if (this.topTurret) {
                if (this.topTurretWeapons.length < 2) factor = 3.5;
                else if (this.topTurretWeapons.length < 3) factor = 4.5;
                else factor = 5.2;
                CWD.webgl.resizeModel(this.topTurret, factor / this.topTurret.userData.size.x);
                CWD.webgl.moveModel(this.topTurret, {x: this.bodyStats.topTurret.x,
                    y: this.bodyStats.topTurret.y + this.topTurret.userData.size.y / 2,
                    z: this.bodyStats.topTurret.z});
                layoutRow(this.topTurretWeapons, getTurretBox(this.topTurret.userData.boundingBox, this.topTurret.userData.center, this.topTurret.userData.size, this.topTurretWeapons.length));
            }
        };
        var getTurretBox = function (box, center, size, count) {
            var offset = count < 2 ? 0 : count < 3 ? size.z * 0.1 : size.z * 0.2;
            return {
                min: {x: center.x - size.x * 0.28, y: box.min.y, z: box.min.z + offset},
                max: {x: center.x + size.x * 0.28, y: box.min.y + (box.max.y - box.min.y) * 0.7, z: box.max.z + offset}
            };
        };

        shape.addShape = function (shapeToAdd) {
            this.models.push(shapeToAdd);
            this.scene.add(shapeToAdd);
        };
        shape.removeShape = function (shapeToRemove) {
            for (var i = 0; i < this.models.length; i++) {
                if (this.models[i] === shapeToRemove) {
                    var temp = this.models.splice(i, 1)[0];
                    this.scene.remove(temp);
                    return true;
                }
            }
            console.log("SHAPE NOT FOUND!");
            return false;
        };

        shape.addCrew = function (crew, suppressLayout) {
            var temp = CW3D.createCrewShape(crew);
            this.crew.push(temp);
            this.addShape(temp);
            if (!suppressLayout) {
                shape.layout();
            }
        };
        shape.removeCrew = function (crew) {
            var i, crewShape = null;
            for (i = 0; i < this.crew.length; i++) {
                if (this.crew[i].userData.crew === crew) {
                    crewShape = this.crew.splice(i, 1)[0];
                    break;
                }
            }
            if (crewShape !== null) {
                this.removeShape(crewShape);
                this.layout();
            } else console.log("CREW NOT FOUND!");
        };
        shape.addPassenger = function (pass, suppressLayout) {
            var temp = CW3D.createCrewShape(pass);
            this.passengers.push(temp);
            if (this.passengers.length === 1) CW3D.setBodyColor(this.body, null, true);
            this.addShape(temp);
            if (!suppressLayout) {
                this.layout();
            }
        };
        shape.removePassenger = function (pass) {
            var i, crewShape = null;
            for (i = 0; i < this.passengers.length; i++) {
                if (this.passengers[i].userData.crew === pass) {
                    crewShape = this.passengers.splice(i, 1)[0];
                    break;
                }
            }
            if (crewShape !== null) {
                this.removeShape(crewShape);
                this.layout();
                if (this.passengers.length === 0) CW3D.setBodyColor(this.body, null, false);
            } else console.log("PASSENGER NOT FOUND!");
        };
        shape.removeGasTank = function () {
            if (this.tank) {
                this.removeShape(shape.tank);
                this.tank = null;
                this.layout();
            }
        };
        shape.addGasTank = function (tank, suppressLayout) {
            if (!this.tank) {
                this.tank = CW3D.createGasTankShape(tank);
                this.addShape(this.tank);
                if (!suppressLayout) {
                    this.layout();
                }
            }
        };
        shape.updateGasTank = function () {
            if (this.tank)
                this.tank.userData.hoverText = this.tank.userData.tank.shortDescription();
        };
        shape.addWeapon = function (weapon, location, suppressLayout) {
            var temp, list;
            //        if(weapon.isDischarger()) {
            //            if(this.car.hasOversizeWeaponFacings()) {
            //                if(location === 'LeftBack') location = 'Left';
            //                else if(location === 'RightBack') location = 'Right';
            //                else if(location === 'TopBack') location = 'Top';
            //                else if(location === 'UnderbodyBack') location = 'Underbody';
            //            }
            //            temp = CWD.createDischargerShape(weapon, location);
            //            list = shape[location.substr(0, 1).toLowerCase()+location.substring(1)+"Dischargers"];
            //        } else {
            temp = CW3D.createWeaponShape(weapon, location);
            list = shape[location.substr(0, 1).toLowerCase() + location.substring(1) + "Weapons"];
            if (/Turret/.test(location)) list = shape[location + 'Weapons'];
            //        }
            if (list) {
                list.push(temp);
                //            if(weapon.isDischarger()) {
                //                shape.shapes.splice(0, 0, temp);
                //            } else {
                this.addShape(temp);
                //            }
                //            if(location === 'Top' || location === 'Underbody' || location === 'TopBack' || location === 'UnderbodyBack') {
                //                temp.drawFullBarrel = false;
                //                shape.cargoShapes.push(temp);
                //            }
                if (!suppressLayout) {
                    shape.layout();
                }
                return temp;
            }
        };
        var removeWeapon = function (weapon, location, all) {
            var list;
            //        if(weapon.isDischarger()) {
            //            if(shape.car.hasOversizeWeaponFacings()) {
            //                if(location === 'LeftBack') location = 'Left';
            //                else if(location === 'RightBack') location = 'Right';
            //                else if(location === 'TopBack') location = 'Top';
            //                else if(location === 'UnderbodyBack') location = 'Underbody';
            //            }
            //            list = shape[location.substr(0, 1).toLowerCase()+location.substring(1)+"Dischargers"];
            //        } else {
            list = shape[location.substr(0, 1).toLowerCase() + location.substring(1) + "Weapons"];
            if (/Turret/.test(location)) list = shape[location + 'Weapons'];
            //        }
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].userData.weapon === weapon) {
                        var removed = list.splice(i, 1)[0];
                        shape.removeShape(removed);
                        //                    if(location === 'Top' || location === 'Underbody' || location === 'TopBack' || location === 'UnderbodyBack')
                        //                        shape.removeCargoShape(removed);
                        if (all) {
                            i -= 1;
                        } else {
                            break;
                        }
                    }
                }
                shape.layout();
            }
        };
        shape.removeWeapon = function (weapon, location) {
            removeWeapon(weapon, location, true);
        };
        shape.increaseWeaponCount = function (weapon, location, suppressLayout) {
            var list, temp, i;
            //        if(weapon.isDischarger()) {
            //            if(this.car.hasOversizeWeaponFacings()) {
            //                if(location === 'LeftBack') location = 'Left';
            //                else if(location === 'RightBack') location = 'Right';
            //                else if(location === 'TopBack') location = 'Top';
            //                else if(location === 'UnderbodyBack') location = 'Underbody';
            //            }
            //            temp = CWD.createDischargerShape(weapon, location);
            //            list = shape[location.substr(0, 1).toLowerCase()+location.substring(1)+"Dischargers"];
            //        } else if(weapon.isSingleShotRocket()) {
            //            list = shape[location.substr(0, 1).toLowerCase()+location.substring(1)+"Weapons"];
            //            if(/Turret/.test(location)) list = shape[location+'Weapons'];
            //            if(shouldCombineRockets(weapon, location)) {
            //                if(countWeaponsInList(weapon, list) > 1) {
            //                    removeWeapon(weapon, location, true);
            //                    temp = this.addWeapon(weapon, location);
            //                    temp.combineAllRockets = true;
            //                    temp.updateHoverText();
            //                    return;
            //                } else {
            //                    for(i=0; i<list.length; i++) {
            //                        if(list[i].weapon === weapon) {
            //                            list[i].combineAllRockets = true;
            //                            list[i].updateHoverText();
            //                        }
            //                    }
            //                    if(!suppressLayout) shape.layout(); // add/remove CA icon
            //                    return;
            //                }
            //            } else {
            //                temp = CWD.createWeaponShape(weapon, location);
            //            }
            //        } else {
            temp = CW3D.createWeaponShape(weapon, location);
            list = shape[location.substr(0, 1).toLowerCase() + location.substring(1) + "Weapons"];
            if (/Turret/.test(location)) list = shape[location + 'Weapons'];
            //        }
            if (list) {
                for (i = 0; i < list.length; i++) {
                    if (list[i].userData.weapon === weapon) {
                        list.splice(i + 1, 0, temp);
                        //                    if(weapon.isDischarger()) {
                        //                        shape.shapes.splice(0, 0, temp);
                        //                    } else {
                        this.addShape(temp);
                        //                    }
                        //                    if(location === 'Top' || location === 'Underbody' || location === 'TopBack' || location === 'UnderbodyBack') {
                        //                        temp.drawFullBarrel = false;
                        //                        shape.cargoShapes.push(temp);
                        //                    }
                        if (!suppressLayout) {
                            shape.layout();
                        }
                        return temp;
                    }
                }
            }
        };
        shape.decreaseWeaponCount = function (weapon, location) {
            //        if(weapon.isSingleShotRocket() && weapon.count > 0) {
            //            var i, list = shape[location.substr(0, 1).toLowerCase()+location.substring(1)+"Weapons"];
            //            if(/Turret/.test(location)) list = shape[location+'Weapons'];
            //            if(shouldCombineRockets(weapon, location)) {
            //                for(i=0; i<list.length; i++) {
            //                    if(list[i].weapon === weapon) list[i].updateHoverText();
            //                }
            //                shape.layout(); // add/remove CA icon
            //            } else if(weapon.count > 1 && countWeaponsInList(weapon, list) === 1) { // currently combined
            //                removeWeapon(weapon, location, true);
            //                for(i=0; i<weapon.count; i++) shape.addWeapon(weapon, location);
            //            } else {
            //                removeWeapon(weapon, location, false);
            //            }
            //        } else {
            removeWeapon(weapon, location, false);
            //        }
        };
        shape.addTopTurret = function (turret, suppressLayout) {
            this.topTurret = CW3D.createTurretShape(turret, "topTurret");
            this.addShape(this.topTurret);
            //        if(turret.gunner) {  TODO
            //            shape.topTurretGunner = CWD.createCrewShape(turret.gunner);
            //            shape.shapes.push(shape.topTurretGunner);
            //        }
            if (!suppressLayout) {
                this.layout();
            }
        };
        shape.removeTopTurret = function () {
            var i;
            for (i = 0; i < this.topTurretWeapons.length; i++) {
                this.removeShape(this.topTurretWeapons[i]);
            }
            for (i = 0; i < this.topTurretBoosters.length; i++) {
                this.removeShape(this.topTurretBoosters[i]);
            }
            if (this.topTurretGunner) this.removeShape(this.topTurretGunner);
            this.topTurretWeapons = [];
            this.topTurretBoosters = [];
            this.topTurretGunner = null;
            this.removeShape(this.topTurret);
            this.topTurret = null;
            this.layout();
        };
        shape.addAccessory = function (item, suppressLayout) {
            var temp;
            if (item.type === 'Tire') temp = CW3D.createTireShape(item, "Spare Tire", "tireList", false);
            else temp = CW3D.createBoxShape(item, item.name, item.category === 'Body Mods' ? "editBodyMods" : "editGear" + item.category);
            CWD.webgl.recalculateModel(temp);
            this.accessories.push(temp);
            this.addShape(temp);
            if (!suppressLayout) {
                this.layout();
            }
        };
        shape.removeAccessory = function (item) {
            var i, shape = null;
            for (i = 0; i < this.accessories.length; i++) {
                if (this.accessories[i].userData.data === item || this.accessories[i].userData.tire === item) {
                    shape = this.accessories.splice(i, 1)[0];
                    break;
                }
            }
            if (shape !== null) {
                this.removeShape(shape);
                this.layout();
            } else console.log("ACCESSORY NOT FOUND!");
        };

        shape.addBackOuterTires = function (tire, suppressLayout) {
            this.backRightOuterTire = CW3D.createTireShape(tire, "Back Tires", "editBackTires", false);
            this.addShape(this.backRightOuterTire);
            this.backLeftOuterTire = CW3D.createTireShape(tire, "Back Tires", "editBackTires", true);
            this.addShape(this.backLeftOuterTire);
            if (!suppressLayout) this.layout();
        };
        shape.removeBackOuterTires = function () {
            this.removeShape(this.backRightOuterTire);
            this.removeShape(this.backLeftOuterTire);
            this.backRightOuterTire = null;
            this.backLeftOuterTire = null;
            this.layout();
        };
        shape.hasBackOuterTires = function () {
            return !!this.backLeftOuterTire;
        };

        shape.hasFrontWheelguards = function () {
            return this.frontWheelguards && this.frontWheelguards.length > 0;
        };
        shape.hasFrontWheelhubs = function () {
            return this.frontWheelhubs && this.frontWheelhubs.length > 0;
        };
        shape.hasBackWheelguards = function () {
            return this.backWheelguards && this.backWheelguards.length > 0;
        };
        shape.hasBackWheelhubs = function () {
            return this.backWheelhubs && this.backWheelhubs.length > 0;
        };

        shape.addSpoiler = function () {
            if (this.spoiler && this.noSpoiler && !this.hasSpoiler()) {
                this.body.remove(this.noSpoiler);
                this.body.add(this.spoiler);
            }
        };
        shape.removeSpoiler = function () {
            if (this.spoiler && this.noSpoiler && this.hasSpoiler()) {
                this.body.remove(this.spoiler);
                this.body.add(this.noSpoiler);
            }
        };
        shape.hasSpoiler = function () {
            return !!this.body.getObjectByName("Spoiler", true);
        };
        shape.addAirdam = function () {
            if (this.airdam && this.noAirdam && !this.hasAirdam()) {
                this.body.remove(this.noAirdam);
                this.body.add(this.airdam);
            }
        };
        shape.removeAirdam = function () {
            if (this.airdam && this.noAirdam && this.hasAirdam()) {
                this.body.remove(this.airdam);
                this.body.add(this.noAirdam);
            }
        };
        shape.hasAirdam = function () {
            return !!this.body.getObjectByName("Airdam", true);
        };
        shape.setColor = function(color) {
            CW3D.setBodyColor(this.body, parseInt(color.substr(1), 16));
        };

        shape.initializeVehicle();
        shape.layout();
        return shape;
    };

    CW3D.bodyStats = {
        pickup: {
            rows: [// From bottom center
                {min: {x: -3.1, y: 0.5, z: 8},
                    max: {x: 3.1, y: 3.5, z: 11.2}},
                {min: {x: -3.1, y: 0.2, z: 4.8},
                    max: {x: 3.1, y: 4.4, z: 8}},
                {min: {x: -3.1, y: 0.05, z: -0.7},
                    max: {x: 3.1, y: 6.35, z: 3}},
                {min: {x: -3.1, y: 0.05, z: -4.4},
                    max: {x: 3.1, y: 6.35, z: -0.7}}
                //TODO: back 2 bed rows
            ],
            gasTank: {
                min: {x: -3, y: 0.2, z: -8.1},
                max: {x: 3, y: 1, z: -4.4}
            },
            frontTires: {
                x: 3.43,
                y: 0.9,
                z: 8,
                diameter: 3.8
            },
            backTires: {
                x: 3.54,
                y: 0.9,
                z: -7.35,
                diameter: 3.8
            },
            topTurret: {
                z: -1,
                x: 0,
                y: 6.85,
                width: 5.2
            },
            hoodWeaponHeight: 4.2
        },
        compact: {
            rows: [// From bottom center
                {min: {x: -2.8, y: 0.1, z: 5.7},
                    max: {x: 2.8, y: 2.5, z: 8.5}},
                {min: {x: -2.8, y: 0.05, z: 2.1},
                    max: {x: 2.8, y: 2.95, z: 5.7}},
                {min: {x: -3.1, y: 0.1, z: -1.3},
                    max: {x: 3.1, y: 4.7, z: 2.1}},
                {min: {x: -3.1, y: 0.1, z: -4.7},
                    max: {x: 3.1, y: 4.4, z: -1.3}}
                //TODO: back 2 rows
            ],
            gasTank: {
                min: {x: -2.7, y: 0.4, z: -7.7},
                max: {x: 2.7, y: 0.9, z: -4.7}
            },
            frontTires: {
                x: 2.85,
                y: 0.4,
                z: 5.94,
                diameter: 2.9
            },
            backTires: {
                x: 2.85,
                y: 0.4,
                z: -5.24,
                diameter: 2.9
            },
            topTurret: {
                z: -1.7,
                x: 0,
                y: 4.8,
                width: 4.8
            },
            hoodWeaponHeight: 2.4
        }
    };

    CW3D.createTireShape = function (source, text, link, left) {
        var tire = CWD.webgl.cloneModel(CWD.webgl.wheel);
        tire.name = "Tire";
        tire.userData.tire = source;
        tire.userData.hoverLink = link;
        tire.userData.hoverText = text;
        // Don't assign a name and track original colors for de-highlighting the tire as a whole
        tire.children[0].name = null; // wheel
        tire.children[1].name = null; // tire
        tire.children[2].name = null; // filler to catch select rays
        tire.children[0].children[0].userData.originalMaterial = tire.children[0].children[0].material;
        tire.children[1].children[0].userData.originalMaterial = tire.children[1].children[0].material;
        tire.children[2].children[0].material.transparent = true;
        tire.children[2].children[0].material.opacity = 0.05;
        tire.children[2].children[0].material.side = THREE.DoubleSide;
        tire.children[2].children[0].userData.originalMaterial = tire.children[2].children[0].material;
        tire.rotation.y = left ? Math.PI / 2 : -Math.PI / 2;
        return tire;
    };
    CW3D.createEngineShape = function (source) {
        var engine = CWD.webgl.cloneModel(CWD.webgl.engine);
        engine.name = "Engine";
        CWD.setEngineHoverText(engine.userData, source); // To update, send this with the new engine
        engine.userData.hoverLink = "editEngineList";
        return engine;
    };
    CW3D.createGasTankShape = function (source) {
        var tank = CWD.webgl.cloneModel(CWD.webgl.gasTank);
        tank.name = "Gas Tank";
        tank.userData.tank = source;
        tank.userData.hoverText = source.shortDescription();
        tank.userData.hoverLink = "editGasTank";
        return tank;
    };

    CW3D.createCrewShape = function (source) {
        var crew = CWD.webgl.cloneModel(CWD.webgl.seat);
        crew.name = "Crew";
        crew.children[0].material.color.set(0x927b51);
        crew.userData.crew = source;
        crew.userData.hoverText = source.name;
        crew.userData.hoverLink = "editCrew";
        return crew;
    };
    CW3D.createBoxShape = function (source, name, link) {
        var geom = new THREE.BoxGeometry(1, 1, 1);
        var mat = new THREE.MeshLambertMaterial({color: 0xAAAAAA});
        var box = new THREE.Mesh(geom, mat);
        box.name = name;
        box.userData.data = source;
        box.userData.hoverText = source.textDescription();
        box.userData.hoverLink = link;
        CWD.webgl.recalculateModel(box);
        return box;
    };
    CW3D.createTurretShape = function (source, location) {
        //var turret = CWD.webgl.cloneModel(CWD.webgl.turret);
        var turret = CWD.webgl.cloneModel(CWD.webgl.turretEdged);
        turret.name = "Turret";
        if (turret.material)
            turret.material = CW3D.lastBodyMaterial;
        else
            turret.children[0].material = CW3D.lastBodyMaterial;
        turret.userData.turret = source;
        turret.userData.hoverLink = "edit" + location.substr(0, 1).toUpperCase() + location.substr(1);
        turret.userData.hoverText = source.name;
        return turret;
    };
    CW3D.createWeaponShape = function (weapon, location, rotation) {
        var gun = CWD.webgl.cloneWeapon("smallBore", 3);
        var name = weapon.name + " " + weapon.displayLocation;
        if (name.length > 29) name = weapon.abbv + " " + weapon.displayLocation;
        gun.children[0].name = null; // barrel
        gun.children[1].name = null; // gun
        gun.name = "Weapon";
        gun.userData.weapon = weapon;
        gun.userData.hoverLink = "edit" + location + "Weapons";
        gun.userData.hoverText = name;
        gun.userData.location = location;
        gun.userData.rotation = rotation || location;
        gun.userData.turreted = /Turret/.test(location);
        return gun;
    };

    CW3D.setBodyColor = function (shape, color, showBackWindows) {
        var bodyMaterial;
        if (!color) bodyMaterial = CW3D.lastBodyMaterial;
        else {
            bodyMaterial = new THREE.MeshLambertMaterial({color: color});
            CW3D.lastBodyMaterial = bodyMaterial;
        }
        if (showBackWindows === undefined) showBackWindows = CW3D.lastShowBackWindows;
        else CW3D.lastShowBackWindows = showBackWindows;
        // Copy transparent/opacity in case the body is presently transparent to show interior details
        var windowMaterial = new THREE.MeshPhongMaterial({color: 0x666666, specular: 0x666666, shininess: 50, transparent: bodyMaterial.transparent, opacity: bodyMaterial.opacity});
        var processFace = function (name, face) {
            var j;
            if (face.children.length > 0) {
                for (j = 0; j < face.children.length; j++) {
                    processFace(name ? name : face.children[j].name, face.children[j]);
                }
            } else {
                if (/Side_Back_Window/.test(name))
                    face.material = showBackWindows ? windowMaterial : bodyMaterial;
                else if (/Wind/.test(name))
                    face.material = windowMaterial;
                else if (/Tail/.test(name))
                    face.material = new THREE.MeshPhongMaterial({color: 0x880000, specular: 0xffffff, shininess: 50, transparent: bodyMaterial.transparent, opacity: bodyMaterial.opacity});
                else if (/Head/.test(name))
                    face.material = new THREE.MeshPhongMaterial({color: 0xeeeeee, specular: 0xffffff, shininess: 50, transparent: bodyMaterial.transparent, opacity: bodyMaterial.opacity});
                else {
                    face.material = bodyMaterial;
                }
            }
        };
        processFace(null, shape);
    };
})();