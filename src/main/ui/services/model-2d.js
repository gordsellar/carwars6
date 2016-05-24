/* global angular, CWD, CW */

(function() {
    "use strict";
    CW.versionOf2D = "$Revision: 1172 $";

    angular.module('carwars').
        factory('model2d', function(vehicle, $rootScope) {
            return {
                car: null,
                createNewCar: function(car, offscreen) {
                    if(this.car) this.car.onLayoutSizeChange = null;
                    this.car = this.generateCarShape(car);
                    if(!offscreen) {
                        this.car.onLayoutSizeChange = function () {
                            $rootScope.$broadcast('resize');
                        };
                    }
                },
                generateCarShape: function(car) {
                    if(car.type === 'Car') return CWD.createCarShape(car);
                    else if(car.type === 'Cycle') return CWD.createCycleShape(car);
                    else if(car.type === 'Trike' && car.reversed) return CWD.createReversedTrikeShape(car);
                    else if(car.type === 'Trike') return CWD.createTrikeShape(car);
                    else if(car.type === 'TenWheeler') return CWD.createTenWheelerShape(car);
                    else if(car.type === 'CarTrailer') return CWD.createCarTrailerShape(car);
                    else if(car.type === 'SemiTractor') return CWD.createSemiTractorShape(car);
                    else if(car.type === 'SemiTrailer') return CWD.createSemiTrailerShape(car);
                    else if(car.type === 'Bus') return CWD.createBusShape(car);
                    else return null;
                },
                destroy: function() {
                    if(this.car) this.car.onLayoutSizeChange = null;
                    this.car = null;
                },
                layout: function() {
                    this.car.layout();
                    this.redraw();
                },
                redraw: function() {
                    $rootScope.$broadcast('redraw');
                },
                bodyChanged: function() {},
                syncWindshell: function(windshell) {},
                syncSidecar: function(sidecar) {
                    if(sidecar && !this.car.sidecar) this.car.addSidecar(sidecar);
                    else if(!sidecar && this.car.sidecar) this.car.removeSidecar();
                    if(sidecar) {
                        if (sidecar.tireCount === 2 && !this.car.sidecar.hasTwoTires()) this.car.sidecar.addSecondTire();
                        else if (sidecar.tireCount === 1 && this.car.sidecar.hasTwoTires()) this.car.sidecar.removeSecondTire();
                        // Remove and re-add in case switching between CTS and non-CTS w/0-sp Regular/Pop-Up Turret (contents changed)
                        this.car.sidecar.removeTopTurret();
                        if(sidecar.topTurret) this.car.sidecar.addTopTurret(sidecar.topTurret);
                    }
                },
                syncMiddleTires: function() {
                    if(vehicle.car.middleOrOuterTires === null && this.car.middleLeftTire)
                        this.car.removeMiddleTires();
                    else if(vehicle.car.middleOrOuterTires !== null && !this.car.middleLeftTire)
                        this.car.addMiddleTires();
                },
                syncTireCount: function() {
                    if(vehicle.isCarTrailer() || vehicle.isSemiTrailer())
                        this.car.updateTires();
                },
                syncGasTank: function() {
                    if(vehicle.hasGasEngine())
                        this.car.addGasTank(vehicle.car.gasTank);
                    else
                        this.car.removeGasTank();
                },
                updateEngineText: function() {
                    if(this.car && this.car.engine)
                        this.car.engine.updateHoverText();
                },
                addCrew: function(crew) {
                    if(crew.inSidecar) this.car.sidecar.addCrew(crew);
                    else if(crew.inCarrier) this.car.carrier.addCrew(crew);
                    else this.car.addCrew(crew);
                },
                removeCrew: function(crew) {
                    if(crew.inSidecar) this.car.sidecar.removeCrew(crew);
                    else if(crew.inCarrier) this.car.carrier.removeCrew(crew);
                    else this.car.removeCrew(crew);
                },
                addPassenger: function(passenger) {
                    if(passenger.inSidecar) this.car.sidecar.addPassenger(passenger);
                    else if(passenger.inCarrier) this.car.carrier.addPassenger(passenger);
                    else this.car.addPassenger(passenger);
                },
                removePassenger: function(passenger) {
                    if(passenger.inSidecar) this.car.sidecar.removePassenger(passenger);
                    else if(passenger.inCarrier) this.car.carrier.removePassenger(passenger);
                    else this.car.removePassenger(passenger);
                },
                setOversize: function() {
                    this.car.setOversize();
                },
                syncCrewCompartmentCA: function() {
                    if(vehicle.car.crewCompartmentCA && !this.car.crewCompartmentCA) {
                        this.car.addCrewCompartmentCA(vehicle.car.crewCompartmentCA);
                        return true;
                    } else if(!vehicle.car.crewCompartmentCA && this.car.crewCompartmentCA) {
                        this.car.removeCrewCompartmentCA();
                        return true;
                    }
                    if(this.car.carrier) {
                        if(vehicle.car.carrier.crewCompartmentCA && !this.car.carrier.crewCompartmentCA) {
                            this.car.carrier.addCrewCompartmentCA(vehicle.car.carrier.crewCompartmentCA);
                            return true;
                        } else if(!vehicle.car.carrier.crewCompartmentCA && this.car.carrier.crewCompartmentCA) {
                            this.car.carrier.removeCrewCompartmentCA();
                            return true;
                        }
                    }
                    return false;
                },
                addWeapon: function(weapon, location, sidecar, carrier) {
                    if(sidecar) {
                        this.car.sidecar.addWeapon(weapon, location);
                    } else {
                        var target = carrier ? this.car.carrier : this.car;
                        if(location === "sideTurret") {
                            target.addWeapon(weapon, "leftTurret");
                            target.addWeapon(weapon, "rightTurret");
                        } else if(location === "sideBackTurret") {
                            target.addWeapon(weapon, "leftBackTurret");
                            target.addWeapon(weapon, "rightBackTurret");
                        } else {
                            target.addWeapon(weapon, location);
                        }
                    }
                },
                removeWeapon: function(weapon, location, sidecar, carrier) {
                    if(sidecar) {
                        this.car.sidecar.removeWeapon(weapon, location);
                    } else {
                        var target = carrier ? this.car.carrier : this.car;
                        if(location === "sideTurret") {
                            target.removeWeapon(weapon, "leftTurret");
                            target.removeWeapon(weapon, "rightTurret");
                        } else if(location === "sideBackTurret") {
                            target.removeWeapon(weapon, "leftBackTurret");
                            target.removeWeapon(weapon, "rightBackTurret");
                        } else {
                            target.removeWeapon(weapon, location);
                        }
                    }
                },
                increaseWeaponCount: function(weapon, location, sidecar, carrier) {
                    if(sidecar) {
                        this.car.sidecar.increaseWeaponCount(weapon, location);
                    } else {
                        var target = carrier ? this.car.carrier : this.car;
                        if(location === "sideTurret") {
                            target.increaseWeaponCount(weapon, "leftTurret");
                            target.increaseWeaponCount(weapon, "rightTurret");
                        } else if(location === "sideBackTurret") {
                            target.increaseWeaponCount(weapon, "leftBackTurret");
                            target.increaseWeaponCount(weapon, "rightBackTurret");
                        } else {
                            target.increaseWeaponCount(weapon, location);
                        }
                    }
                },
                decreaseWeaponCount: function(weapon, location, sidecar, carrier) {
                    if(sidecar) {
                        this.car.sidecar.decreaseWeaponCount(weapon, location);
                    } else {
                        var target = carrier ? this.car.carrier : this.car;
                        if(location === "sideTurret") {
                            target.decreaseWeaponCount(weapon, "leftTurret");
                            target.decreaseWeaponCount(weapon, "rightTurret");
                        } else if(location === "sideBackTurret") {
                            target.decreaseWeaponCount(weapon, "leftBackTurret");
                            target.decreaseWeaponCount(weapon, "rightBackTurret");
                        } else {
                            target.decreaseWeaponCount(weapon, location);
                        }
                    }
                },
                addAccessory: function(item, carrier, sidecar) {
                    if(carrier) this.car.carrier.addAccessory(item);
                    else if(sidecar) this.car.sidecar.addAccessory(item);
                    else this.car.addAccessory(item);
                },
                removeAccessory: function(item, carrier, sidecar) {
                    if(carrier) this.car.carrier.removeAccessory(item);
                    else if(sidecar) this.car.sidecar.removeAccessory(item);
                    else this.car.removeAccessory(item);
                },
                // the next few are handled in body drawing logic on each frame
                addSpoiler: function() {},
                removeSpoiler: function() {},
                addAirdam: function() {},
                removeAirdam: function() {},
                addHitch: function() {},
                removeHitch: function() {},
                syncGuardsAndHubs: function() {
                    if(vehicle.car.frontWheelguards) {
                        if(!this.car.hasFrontWheelguards()) this.car.addFrontWheelguards(vehicle.car.frontWheelguards);
                    } else {
                        if(this.car.hasFrontWheelguards()) this.car.removeFrontWheelguards();
                    }
                    if(vehicle.car.frontWheelhubs) {
                        if(!this.car.hasFrontWheelhubs()) this.car.addFrontWheelhubs(vehicle.car.frontWheelhubs);
                    } else {
                        if(this.car.hasFrontWheelhubs()) this.car.removeFrontWheelhubs();
                    }
                    if(vehicle.car.backWheelguards) {
                        if(!this.car.hasBackWheelguards()) this.car.addBackWheelguards(vehicle.car.backWheelguards);
                    } else {
                        if(this.car.hasBackWheelguards()) this.car.removeBackWheelguards();
                    }
                    if(vehicle.car.backWheelhubs) {
                        if(!this.car.hasBackWheelhubs()) this.car.addBackWheelhubs(vehicle.car.backWheelhubs);
                    } else {
                        if(this.car.hasBackWheelhubs()) this.car.removeBackWheelhubs();
                    }
                    if(vehicle.car.sidecar) {
                        if(vehicle.car.sidecar.wheelguards && this.car.sidecar.backWheelguards.length === 0)
                            this.car.sidecar.addWheelguards(vehicle.car.sidecar.wheelguards);
                        else if(!vehicle.car.sidecar.wheelguards && this.car.sidecar.backWheelguards.length > 0)
                            this.car.sidecar.removeWheelguards();
                        if(vehicle.car.sidecar.wheelhubs && this.car.sidecar.backWheelhubs.length === 0)
                            this.car.sidecar.addWheelhubs(vehicle.car.sidecar.wheelhubs);
                        else if(!vehicle.car.sidecar.wheelhubs && this.car.sidecar.backWheelhubs.length > 0)
                            this.car.sidecar.removeWheelhubs();
                    }
                },
                addTopTurret: function(turret, carrier, back) {
                    if(carrier)
                        this.car.carrier.addTopTurret(turret);
                    else if(back)
                        this.car.addTopBackTurret(turret);
                    else
                        this.car.addTopTurret(turret);
                },
                addSideTurret: function(turret, carrier, back) {
                    if(carrier) {
                        this.car.carrier.addLeftTurret(turret, true);
                        this.car.carrier.addRightTurret(turret);
                    } else if(back) {
                        this.car.addLeftBackTurret(turret, true);
                        this.car.addRightBackTurret(turret);
                    } else {
                        this.car.addLeftTurret(turret, true);
                        this.car.addRightTurret(turret);
                    }
                },
                removeTurret: function(turret) {
                    if(this.car.topTurret && this.car.topTurret.turret === turret)
                        this.car.removeTopTurret();
                    if(this.car.leftTurret && this.car.leftTurret.turret === turret)
                        this.car.removeLeftTurret();
                    if(this.car.rightTurret && this.car.rightTurret.turret === turret)
                        this.car.removeRightTurret();
                    if(this.car.sidecar && this.car.sidecar.topTurret && this.car.sidecar.topTurret.turret === turret)
                        this.car.sidecar.removeTopTurret();
                    if(this.car.carrier && this.car.carrier.topTurret && this.car.carrier.topTurret.turret === turret)
                        this.car.carrier.removeTopTurret();
                    if(this.car.carrier && this.car.carrier.leftTurret && this.car.carrier.leftTurret.turret === turret)
                        this.car.carrier.removeLeftTurret();
                    if(this.car.carrier && this.car.carrier.rightTurret && this.car.carrier.rightTurret.turret === turret)
                        this.car.carrier.removeRightTurret();
                },
                setColor: function(color) {
                    this.car.setColor(color);
                },
                syncBoosters: function() {
                    var i;
                    for(i=0; i<this.car.jumpJets.length; i++) this.car.removeBooster(this.car.jumpJets[i].booster);
                    for(i=0; i<this.car.backBoosters.length; i++) this.car.removeBooster(this.car.backBoosters[i].booster);
                    for(i=0; i<this.car.frontBoosters.length; i++) this.car.removeBooster(this.car.frontBoosters[i].booster);
                    for(i=0; i<this.car.topTurretBoosters.length; i++) this.car.removeBooster(this.car.topTurretBoosters[i].booster);
                    for(i=0; i<this.car.leftTurretBoosters.length; i++) this.car.removeBooster(this.car.leftTurretBoosters[i].booster);
                    for(i=0; i<this.car.rightTurretBoosters.length; i++) this.car.removeBooster(this.car.rightTurretBoosters[i].booster);
                    if(this.car.topBackTurretBoosters)
                        for(i=0; i<this.car.topBackTurretBoosters.length; i++) this.car.removeBooster(this.car.topBackTurretBoosters[i].booster);
                    if(this.car.leftBackTurretBoosters)
                        for(i=0; i<this.car.leftBackTurretBoosters.length; i++) this.car.removeBooster(this.car.leftBackTurretBoosters[i].booster);
                    if(this.car.rightBackTurretBoosters)
                        for(i=0; i<this.car.rightBackTurretBoosters.length; i++) this.car.removeBooster(this.car.rightBackTurretBoosters[i].booster);
                    this.car.configureVehicleBoosters();
                    this.car.layout();
                }
            };
        });

    CWD.createVehicleShape = function(car) {
        var shape = CWD.createShape();

        // Set all the basic properties
        shape.car = car;
        shape.hoverShape = null;
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
        shape.shapes = [];
        shape.cargoShapes = [];
        shape.colorScheme = {
            mainColor: '#AA2222',
            highlightColor: '#EE3030'
        };

        shape.initializeVehicle = function() {
            var i, j;
            if(shape.car.engine) {
                this.engine = CWD.createEngineShape(shape.car);
                this.shapes.push(shape.engine);
            }
            for(i=0; i<car.crew.length; i++) {
                this.addCrew(car.crew[i], true);
            }
            for(i=0; i<car.passengers.length; i++) {
                this.addPassenger(car.passengers[i], true);
            }
            for(i=0; i<car.accessories.length; i++) {
                this.addAccessory(car.accessories[i], true);
            }
            if(car.crewCompartmentCA) {
                this.addCrewCompartmentCA(car.crewCompartmentCA, true);
            }
            if(car.gasTank) {
                this.addGasTank(car.gasTank, true);
            }
            for(i=0; i<car.frontWeapons.length; i++) {
                this.addWeapon(car.frontWeapons[i], 'Front', true);
                for(j=1; j<car.frontWeapons[i].count; j++) {
                    this.increaseWeaponCount(car.frontWeapons[i], 'Front', true);
                }
            }
            for(i=0; i<car.backWeapons.length; i++) {
                this.addWeapon(car.backWeapons[i], 'Back', true);
                for(j=1; j<car.backWeapons[i].count; j++) {
                    this.increaseWeaponCount(car.backWeapons[i], 'Back', true);
                }
            }
            for(i=0; i<car.rightWeapons.length; i++) {
                this.addWeapon(car.rightWeapons[i], 'Right', true);
                for(j=1; j<car.rightWeapons[i].count; j++) {
                    this.increaseWeaponCount(car.rightWeapons[i], 'Right', true);
                }
            }
            if(car.leftWeapons) { // Not a sidecar
                for(i=0; i<car.leftWeapons.length; i++) {
                    this.addWeapon(car.leftWeapons[i], 'Left', true);
                    for(j=1; j<car.leftWeapons[i].count; j++) {
                        this.increaseWeaponCount(car.leftWeapons[i], 'Left', true);
                    }
                }
                for(i=0; i<car.topWeapons.length; i++) {
                    this.addWeapon(car.topWeapons[i], 'Top', true);
                    for(j=1; j<car.topWeapons[i].count; j++) {
                        this.increaseWeaponCount(car.topWeapons[i], 'Top', true);
                    }
                }
                for(i=0; i<car.underbodyWeapons.length; i++) {
                    this.addWeapon(car.underbodyWeapons[i], 'Underbody', true);
                    for(j=1; j<car.underbodyWeapons[i].count; j++) {
                        this.increaseWeaponCount(car.underbodyWeapons[i], 'Underbody', true);
                    }
                }
                for (i = 0; i < car.frontRightWeapons.length; i++) {
                    this.addWeapon(car.frontRightWeapons[i], 'FrontRight', true);
                    for (j = 1; j < car.frontRightWeapons[i].count; j++) {
                        this.increaseWeaponCount(car.frontRightWeapons[i], 'FrontRight', true);
                    }
                }
                for (i = 0; i < car.frontLeftWeapons.length; i++) {
                    this.addWeapon(car.frontLeftWeapons[i], 'FrontLeft', true);
                    for (j = 1; j < car.frontLeftWeapons[i].count; j++) {
                        this.increaseWeaponCount(car.frontLeftWeapons[i], 'FrontLeft', true);
                    }
                }
                for (i = 0; i < car.backRightWeapons.length; i++) {
                    this.addWeapon(car.backRightWeapons[i], 'BackRight', true);
                    for (j = 1; j < car.backRightWeapons[i].count; j++) {
                        this.increaseWeaponCount(car.backRightWeapons[i], 'BackRight', true);
                    }
                }
                for (i = 0; i < car.backLeftWeapons.length; i++) {
                    this.addWeapon(car.backLeftWeapons[i], 'BackLeft', true);
                    for (j = 1; j < car.backLeftWeapons[i].count; j++) {
                        this.increaseWeaponCount(car.backLeftWeapons[i], 'BackLeft', true);
                    }
                }
            }
            if(car.topTurret) this.addTopTurret(car.topTurret, true);
            if(car.sideTurret) {
                this.addLeftTurret(car.sideTurret, true);
                this.addRightTurret(car.sideTurret, true);
            }
            if(car.frontWheelhubs) {
                this.addFrontWheelhubs(car.frontWheelhubs, true);
            }
            if(car.frontWheelguards) {
                this.addFrontWheelguards(car.frontWheelguards, true);
            }
            if(car.backWheelhubs) {
                this.addBackWheelhubs(car.backWheelhubs, true);
            }
            if(car.backWheelguards) {
                this.addBackWheelguards(car.backWheelguards, true);
            }
            this.configureVehicleBoosters();
            // TODO: middle wheelhubs, middle wheelguards
            if(car.appearance.colorScheme) {
                this.setColor(car.appearance.colorScheme.mainColor);
            }
            if(car.appearance.engine) {
                this.engine.manuallyPlaced = true;
                this.engine.topColumn = car.appearance.engine.topColumn;
            }
            if(car.appearance.driver && this.crew.length > 0) {
                this.crew[0].manuallyPlaced = true;
                this.crew[0].topColumn = car.appearance.driver.topColumn;
            }

            if(CW.QA) CW.QA.initializeCar(shape);
        };

        shape.configureVehicleBoosters = function() {
            var i;
            if(car.topTurret) {
                for(i=0; i<this.car.topTurret.boosters.length; i++)
                    this.addEWPBooster(this.car.topTurret.boosters[i], "topTurret", true);
            }
            if(car.sideTurret) {
                for(i=0; i<this.car.sideTurret.boosters.length; i++) {
                    this.addEWPBooster(this.car.sideTurret.boosters[i], "leftTurret", true);
                    this.addEWPBooster(this.car.sideTurret.boosters[i], "rightTurret", true);
                }
            }
            if(car.topBackTurret) {
                for(i=0; i<this.car.topBackTurret.boosters.length; i++)
                    this.addEWPBooster(this.car.topBackTurret.boosters[i], "topBackTurret", true);
            }
            if(car.sideBackTurret) {
                for(i=0; i<this.car.sideBackTurret.boosters.length; i++) {
                    this.addEWPBooster(this.car.sideBackTurret.boosters[i], "leftBackTurret", true);
                    this.addEWPBooster(this.car.sideBackTurret.boosters[i], "rightBackTurret", true);
                }
            }
            for(i=0; i<car.boosters.length; i++) {
                this.addBooster(car.boosters[i], true);
            }
        };

        shape.setColor = function(color) {
            this.colorScheme.mainColor = color;
            this.colorScheme.highlightColor = getHighlightColor(color);
        };

        var getHighlightColor = function(color) {
            var factor = 1.5;
            var r = parseInt(color.substr(1, 2), 16);
            var g = parseInt(color.substr(3, 2), 16);
            var b = parseInt(color.substr(5, 2), 16);
            r = r*factor;
            g = g*factor;
            b = b*factor;
            var threshold = 254.999;
            var m = Math.max(r, g, b);
            if(m <= threshold)
                return "#"+ zeroPad(Math.round(r).toString(16))+zeroPad(Math.round(g).toString(16))+zeroPad(Math.round(b).toString(16));
            var total = r + g + b;
            if(total >= 3 * threshold)
                return "#FFFFFF";
            var x = (3 * threshold - total) / (3 * m - total);
            var gray = threshold - x * m;
            return "#"+zeroPad(Math.round(gray + x * r).toString(16))+zeroPad(Math.round(gray + x * g).toString(16))
                +zeroPad(Math.round(gray + x * b).toString(16));
        };
        var zeroPad = function(value) {
            return value.length === 1 ? "0"+value : value;
        };

        shape.removeShape = function(shapeToRemove) {
            for(var i =0; i<shape.shapes.length; i++) {
                if(shape.shapes[i] === shapeToRemove) {
                    shape.shapes.splice(i, 1);
                    return true;
                }
            }
            return false;
        };
        shape.removeCargoShape = function(shapeToRemove) {
            for(var i =0; i<shape.cargoShapes.length; i++) {
                if(shape.cargoShapes[i] === shapeToRemove) {
                    shape.cargoShapes.splice(i, 1);
                    return true;
                }
            }
            return false;
        };

        shape.layout = function(forceSameSize) {
            shape.lastLayoutSize = shape.layoutSize;
            shape.lastMaxX = shape.maximumX;
            shape.lastMaxY = shape.totalHeight;
            var result = this.layoutVehicle(forceSameSize);

            if(shape.onLayoutSizeChange &&
                (!shape.lastLayoutSize || shape.layoutSize.width !== shape.lastLayoutSize.width
                    || shape.layoutSize.height !== shape.lastLayoutSize.height || shape.lastMaxX !== shape.maximumX
                    || shape.lastMaxY !== shape.totalHeight))
                shape.onLayoutSizeChange();

            return result;
        };


        shape.removeGasTank = function() {
            if(shape.tank) {
                shape.removeShape(shape.tank);
                shape.removeCargoShape(shape.tank);
                shape.tank = null;
                shape.layout();
            }
        };
        shape.addGasTank = function(tank, suppressLayout) {
            if(!shape.tank) {
                shape.tank = CWD.createGasTankShape(tank);
                shape.shapes.push(shape.tank);
                shape.cargoShapes.push(shape.tank);
                if(!suppressLayout) {
                    shape.layout();
                }
            }
        };
        shape.addCrew = function(crew, suppressLayout) {
            var temp = CWD.createCrewShape(crew);
            shape.crew.push(temp);
            shape.shapes.push(temp);
            if(!suppressLayout) {
                shape.layout();
            }
        };
        shape.removeCrew = function(crew) {
            var i, crewShape = null;
            for(i=0;i<shape.crew.length;i++) {
                if(shape.crew[i].crew === crew) {
                    crewShape = shape.crew.splice(i, 1)[0];
                    break;
                }
            }
            if(crewShape !== null) {
                shape.removeShape(crewShape);
                shape.layout();
            }
        };
        shape.addPassenger = function(pass, suppressLayout) {
            var temp = CWD.createCrewShape(pass);
            shape.passengers.push(temp);
            shape.shapes.push(temp);
            shape.cargoShapes.push(temp);
            if(!suppressLayout) {
                shape.layout();
            }
        };
        shape.removePassenger = function(pass) {
            var i, crewShape = null;
            for(i=0;i<shape.passengers.length;i++) {
                if(shape.passengers[i].crew === pass) {
                    crewShape = shape.passengers.splice(i, 1)[0];
                    break;
                }
            }
            if(crewShape !== null) {
                shape.removeShape(crewShape);
                shape.removeCargoShape(crewShape);
                shape.layout();
            }
        };
        shape.addEWPBooster = function(booster, location, suppressLayout) {
            var list = shape[location+'Boosters'];
            var item = CWD.createBoosterShape(booster, booster.bottomOrRearFacing, "edit"+location+"Boosters");
            list.push(item);
            shape.shapes.push(item);
            if(!suppressLayout) shape.layout();
        };
        shape.removeEWPBooster = function(booster, location) {
            var list = shape[location+'Boosters'];
            if(list[0].booster === booster) {
                shape.removeShape(list.pop());
            }
            shape.layout();
        };
        shape.addBooster = function(booster, suppressLayout) {
            var item;
            if(booster.jumpJet) {
                item = CWD.createBoosterShape(booster, booster.bottomOrRearFacing, "editBoosters");
                shape.jumpJets.push(item);
                shape.shapes.push(item);
                shape.cargoShapes.push(item);
            } else {
                item = CWD.createBoosterShape(booster, booster.bottomOrRearFacing, "editBoosters");
                if(booster.bottomOrRearFacing)
                    shape.backBoosters.push(item);
                else
                    shape.frontBoosters.push(item);
                shape.shapes.push(item);
            }
            if(!suppressLayout) shape.layout();
        };
        shape.removeBooster = function(target) {
            var removeBoosterFromList = function(list, booster) {
                var i;
                if(list)
                    for(i=0; i<list.length; i++)
                        if(list[i].booster === booster) {
                            shape.removeShape(list[i]);
                            shape.removeCargoShape(list[i]); // Jump Jets
                            return list.splice(i, 1)[0];
                        }
                return null;
            };
            removeBoosterFromList(shape.jumpJets, target);
            removeBoosterFromList(shape.backBoosters, target);
            removeBoosterFromList(shape.frontBoosters, target);
            removeBoosterFromList(shape.topTurretBoosters, target);
            removeBoosterFromList(shape.leftTurretBoosters, target);
            removeBoosterFromList(shape.rightTurretBoosters, target);
            removeBoosterFromList(shape.topBackTurretBoosters, target);
            removeBoosterFromList(shape.leftBackTurretBoosters, target);
            removeBoosterFromList(shape.rightBackTurretBoosters, target);
            shape.layout();
        };
        shape.addWeapon = function(weapon, location, suppressLayout) {
            var temp, list;
            if(weapon.isDischarger()) {
                if(this.car.hasOversizeWeaponFacings()) {
                    if(location === 'LeftBack') location = 'Left';
                    else if(location === 'RightBack') location = 'Right';
                    else if(location === 'TopBack') location = 'Top';
                    else if(location === 'UnderbodyBack') location = 'Underbody';
                }
                temp = CWD.createDischargerShape(weapon, location);
                list = shape[location.substr(0, 1).toLowerCase()+location.substring(1)+"Dischargers"];
            } else {
                temp = CWD.createWeaponShape(weapon, location);
                if(/Turret/.test(location)) list = shape[location+'Weapons'];
                else list = shape[location.substr(0, 1).toLowerCase()+location.substring(1)+"Weapons"];
            }
            if(list) {
                list.push(temp);
                if(weapon.isDischarger()) {
                    shape.shapes.splice(0, 0, temp);
                } else {
                    shape.shapes.push(temp);
                }
                if(location === 'Top' || location === 'Underbody' || location === 'TopBack' || location === 'UnderbodyBack') {
                    temp.drawFullBarrel = false;
                    shape.cargoShapes.push(temp);
                }
                if(!suppressLayout) {
                    shape.layout();
                }
                return temp;
            }
        };
        var removeWeapon = function(weapon, location, all) {
            var list;
            if(weapon.isDischarger()) {
                if(shape.car.hasOversizeWeaponFacings()) {
                    if(location === 'LeftBack') location = 'Left';
                    else if(location === 'RightBack') location = 'Right';
                    else if(location === 'TopBack') location = 'Top';
                    else if(location === 'UnderbodyBack') location = 'Underbody';
                }
                list = shape[location.substr(0, 1).toLowerCase()+location.substring(1)+"Dischargers"];
            } else {
                list = shape[location.substr(0, 1).toLowerCase()+location.substring(1)+"Weapons"];
                if(/Turret/.test(location)) list = shape[location+'Weapons'];
            }
            if(list) {
                for(var i=0; i<list.length; i++) {
                    if(list[i].weapon === weapon) {
                        var removed = list.splice(i, 1)[0];
                        shape.removeShape(removed);
                        if(location === 'Top' || location === 'Underbody' || location === 'TopBack' || location === 'UnderbodyBack')
                            shape.removeCargoShape(removed);
                        if(all) {
                            i -= 1;
                        } else {
                            break;
                        }
                    }
                }
                shape.layout();
            }
        };
        shape.removeWeapon = function(weapon, location) {
            removeWeapon(weapon, location, true);
        };
        var shouldCombineRockets = function(weapon, location) {
            return weapon.count > (/Turret/.test(location) ? 2 : 3); // TODO: Maybe use up to 3 or 4 spaces in turret including TL?
        };
        var countWeaponsInList = function(weapon, list) {
            var total = 0;
            for(var i=0; i<list.length; i++) {
                if(list[i].weapon === weapon) ++total;
            }
            return total;
        };
        shape.increaseWeaponCount = function(weapon, location, suppressLayout) {
            var list = null, temp, i;
            if(weapon.isDischarger()) {
                if(this.car.hasOversizeWeaponFacings()) {
                    if(location === 'LeftBack') location = 'Left';
                    else if(location === 'RightBack') location = 'Right';
                    else if(location === 'TopBack') location = 'Top';
                    else if(location === 'UnderbodyBack') location = 'Underbody';
                }
                temp = CWD.createDischargerShape(weapon, location);
                list = shape[location.substr(0, 1).toLowerCase()+location.substring(1)+"Dischargers"];
            } else if(weapon.isSingleShotRocket()) {
                list = shape[location.substr(0, 1).toLowerCase()+location.substring(1)+"Weapons"];
                if(/Turret/.test(location)) list = shape[location+'Weapons'];
                if(shouldCombineRockets(weapon, location)) {
                    if(countWeaponsInList(weapon, list) > 1) {
                        removeWeapon(weapon, location, true);
                        temp = this.addWeapon(weapon, location);
                        temp.combineAllRockets = true;
                        temp.updateHoverText();
                        return;
                    } else {
                        for(i=0; i<list.length; i++) {
                            if(list[i].weapon === weapon) {
                                list[i].combineAllRockets = true;
                                list[i].updateHoverText();
                            }
                        }
                        if(!suppressLayout) shape.layout(); // add/remove CA icon
                        return;
                    }
                } else {
                    temp = CWD.createWeaponShape(weapon, location);
                }
            } else {
                temp = CWD.createWeaponShape(weapon, location);
                list = shape[location.substr(0, 1).toLowerCase()+location.substring(1)+"Weapons"];
                if(/Turret/.test(location)) list = shape[location+'Weapons'];
            }
            if(list) {
                for(i=0; i<list.length; i++) {
                    if(list[i].weapon === weapon) {
                        list.splice(i+1, 0, temp);
                        if(weapon.isDischarger()) {
                            shape.shapes.splice(0, 0, temp);
                        } else {
                            shape.shapes.push(temp);
                        }
                        if(location === 'Top' || location === 'Underbody' || location === 'TopBack' || location === 'UnderbodyBack') {
                            temp.drawFullBarrel = false;
                            shape.cargoShapes.push(temp);
                        }
                        if(!suppressLayout) {
                            shape.layout();
                        }
                        return temp;
                    }
                }
            }
        };
        shape.decreaseWeaponCount = function(weapon, location) {
            if(weapon.isSingleShotRocket() && weapon.count > 0) {
                var i, list = shape[location.substr(0, 1).toLowerCase()+location.substring(1)+"Weapons"];
                if(/Turret/.test(location)) list = shape[location+'Weapons'];
                if(shouldCombineRockets(weapon, location)) {
                    for(i=0; i<list.length; i++) {
                        if(list[i].weapon === weapon) list[i].updateHoverText();
                    }
                    shape.layout(); // add/remove CA icon
                } else if(weapon.count > 1 && countWeaponsInList(weapon, list) === 1) { // currently combined
                    removeWeapon(weapon, location, true);
                    for(i=0; i<weapon.count; i++) shape.addWeapon(weapon, location);
                } else {
                    removeWeapon(weapon, location, false);
                }
            } else {
                removeWeapon(weapon, location, false);
            }
        };
        shape.removeTopTurret = function() {
            var i;
            for(i=0; i<shape.topTurretWeapons.length; i++) {
                shape.removeShape(shape.topTurretWeapons[i]);
            }
            for(i=0; i<shape.topTurretBoosters.length; i++) {
                shape.removeShape(shape.topTurretBoosters[i]);
            }
            if(shape.topTurretGunner) shape.removeShape(shape.topTurretGunner);
            shape.topTurretWeapons = [];
            shape.topTurretBoosters = [];
            shape.topTurretGunner = null;
            shape.removeShape(shape.topTurret);
            shape.removeCargoShape(shape.topTurret);
            shape.topTurret = null;
            shape.layout();
        };
        shape.addTopTurret = function(turret, suppressLayout) {
            shape.topTurret = CWD.createTurretShape(turret, "editTopTurret");
            shape.shapes.push(shape.topTurret);
            shape.cargoShapes.push(shape.topTurret);
            if(turret.gunner) {
                shape.topTurretGunner = CWD.createCrewShape(turret.gunner);
                shape.shapes.push(shape.topTurretGunner);
            }
            for(var i=0; i<turret.weapons.length; i++) {
                this.addWeapon(turret.weapons[i], "topTurret", true);
                for(var j=1; j<turret.weapons[i].count; j++) {
                    this.increaseWeaponCount(turret.weapons[i], "topTurret", true);
                }
            }
            if(!suppressLayout) {
                shape.layout();
            }
        };
        shape.addLeftTurret = function(turret, suppressLayout) {
            shape.leftTurret = turret.isEWP() ? CWD.createEWPShape(turret, true) : CWD.createSponsonShape(turret, true);
            shape.shapes.push(shape.leftTurret);
            for(var i=0; i<turret.weapons.length; i++) {
                this.addWeapon(turret.weapons[i], "leftTurret", true);
                for(var j=1; j<turret.weapons[i].count; j++) {
                    this.increaseWeaponCount(turret.weapons[i], "leftTurret", true);
                }
            }
            if(!suppressLayout) shape.layout();
        };
        shape.addRightTurret = function(turret, suppressLayout) {
            shape.rightTurret = turret.isEWP() ? CWD.createEWPShape(turret, false) : CWD.createSponsonShape(turret, false);
            shape.shapes.push(shape.rightTurret);
            for(var i=0; i<turret.weapons.length; i++) {
                this.addWeapon(turret.weapons[i], "rightTurret", true);
                for(var j=1; j<turret.weapons[i].count; j++) {
                    this.increaseWeaponCount(turret.weapons[i], "rightTurret", true);
                }
            }
            if(!suppressLayout) shape.layout();
        };
        shape.removeLeftTurret = function() {
            var i;
            for(i=0; i<shape.leftTurretWeapons.length; i++) {
                shape.removeShape(shape.leftTurretWeapons[i]);
            }
            for(i=0; i<shape.leftTurretBoosters.length; i++) {
                shape.removeShape(shape.leftTurretBoosters[i]);
            }
            shape.leftTurretWeapons = [];
            shape.leftTurretBoosters = [];
            shape.removeShape(shape.leftTurret);
            shape.leftTurret = null;
            shape.layout();
        };
        shape.removeRightTurret = function() {
            var i;
            for(i=0; i<shape.rightTurretWeapons.length; i++) {
                shape.removeShape(shape.rightTurretWeapons[i]);
            }
            for(i=0; i<shape.rightTurretBoosters.length; i++) {
                shape.removeShape(shape.rightTurretBoosters[i]);
            }
            shape.rightTurretWeapons = [];
            shape.rightTurretBoosters = [];
            shape.removeShape(shape.rightTurret);
            shape.rightTurret = null;
            shape.layout();
        };
        shape.addMiddleTires = function(suppressLayout) {
            shape.middleLeftTire = CWD.createTireShape(car.middleOrOuterTires, "Back Tires", "editBackTires", true, false);
            shape.middleRightTire = CWD.createTireShape(car.middleOrOuterTires, "Back Tires", "editBackTires", false, false);
            if(!suppressLayout) {
                shape.layout();
            }
        };
        shape.removeMiddleTires = function() {
            if(shape.middleLeftTire || shape.middleRightTire) {
                shape.middleLeftTire = null;
                shape.middleRightTire = null;
                shape.layout();
            }
        };
        shape.hasFrontWheelguards = function() {return this.frontWheelguards && this.frontWheelguards.length > 0;};
        shape.hasFrontWheelhubs = function() {return this.frontWheelhubs && this.frontWheelhubs.length > 0;};
        shape.hasBackWheelguards = function() {return this.backWheelguards && this.backWheelguards.length > 0;};
        shape.hasBackWheelhubs = function() {return this.backWheelhubs && this.backWheelhubs.length > 0;};
        shape.addAccessory = function(item, suppressLayout) {
            if(item.totalDP() === 0) return;
            var thing = CWD.createAccessoryShape(item, item.name, item.category === 'Body Mods' ? "editBodyMods" : item.type === 'Tire' ? "editAllTires" : "editGear"+item.category);
            this.accessories.push(thing);
            this.shapes.push(thing);
            this.cargoShapes.push(thing);
            if(!suppressLayout) {
                this.layout();
            }
        };
        shape.removeAccessory = function(item) {
            for(var i=0; i<shape.accessories.length; i++) {
                if(shape.accessories[i].item.name === item.name) {
                    var thing = shape.accessories.splice(i, 1)[0];
                    this.removeShape(thing);
                    this.removeCargoShape(thing);
                    this.layout();
                    return;
                }
            }
        };
        shape.addCrewCompartmentCA = function(armor, suppressLayout) {
            shape.crewCompartmentCA = CWD.createComponentArmorShape(armor, "Crew CA", "editCrew");
            shape.shapes.push(shape.crewCompartmentCA);
            if(!suppressLayout) {
                shape.layout();
            }
        };
        shape.removeCrewCompartmentCA = function() {
            if(shape.crewCompartmentCA) {
                shape.removeShape(shape.crewCompartmentCA);
                shape.crewCompartmentCA = null;
                shape.layout();
            }
        };
        shape.addWeaponCA = function(weapon, location) {
            if(shape[location+"CA"]) shape[location+"CA"].update(weapon.componentArmor);
            else {
                shape[location+"CA"] = CWD.createComponentArmorShape(weapon.componentArmor, weapon.abbv+" "+weapon.location, "edit"+weapon.location+"Weapons");
                shape.shapes.push(shape[location+"CA"]);
            }
            return shape[location+"CA"];
        };
        shape.removeWeaponCA = function(location) {
            if(shape[location+"CA"]) {
                shape.removeShape(shape[location+"CA"]);
                shape[location+"CA"] = null;
            }
        };

        shape.weaponsAcross = function() { // Note: counts both corners if either corner has weapons
            var total = 0, max;
            total += this.frontWeapons.length;
            total += this.frontLeftWeapons.length > 0 || this.frontRightWeapons.length > 0 ? 2 : 0;
            total += this.frontBoosters.length;
            max = total;
            total = 0;
            total += this.backWeapons.length;
            total += this.backLeftWeapons.length > 0 || this.backRightWeapons.length > 0 ? 2 : 0;
            total += this.backBoosters.length;
            return total > max ? total : max;
        };
        shape.weaponsAcrossSide = function() {
            var total = 0, max;
            total += this.leftWeapons.length;
            total += this.frontLeftWeapons.length;
            total += this.backLeftWeapons.length;
            max = total;
            total = 0;
            total += this.rightWeapons.length;
            total += this.backRightWeapons.length;
            total += this.frontRightWeapons.length;
            return total > max ? total : max;
        };
        shape.weaponsAcrossSideMiddle = function() {
            var total = 0, max, count;
            total += this.leftWeapons.length;
            count=this.frontLeftWeapons.length;
            total += Math.max(0, count-1);
            count = this.backLeftWeapons.length;
            total += Math.max(0, count-1);
            max = total;
            total = 0;
            total += this.rightWeapons.length;
            count = this.backRightWeapons.length;
            total += Math.max(0, count-1);
            count = this.frontRightWeapons.length;
            total += Math.max(0, count-1);
            return total > max ? total : max;
        };

        shape.draw = function(ctx, carOnly) {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            if(carOnly) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            } else {
                ctx.fillStyle = CWD.screenBackground;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            }
            this.drawLower(ctx, carOnly);
            this.drawMiddle(ctx, carOnly);
            this.drawUpper(ctx, carOnly);
        };

        shape.drawLower = function(ctx, carOnly) {
            var borderColor = ctx.type === 'pdf' ? 'black' : CWD.mainStroke;
            ctx.setTransform.apply(ctx, CWD.globalTransform);
            if(!this.suppressDrawing) {
                this.bodyStyle.drawLowerBody(shape, ctx, shape.hoverShape, borderColor, this.widthToBody, this.bodyWidth, this.heightToBody, this.bodyHeight);
                ctx.fillStyle = carOnly ? CWD.backgroundColor : this.colorScheme.mainColor;
                ctx.fill();
                ctx.stroke();
            }
        };

        shape.drawMiddle = function(ctx, carOnly) {
            var borderColor = ctx.type === 'pdf' ? 'black' : CWD.mainStroke;
            if(!this.suppressDrawing) {
                // Draw the Vehicle Body
                this.bodyStyle.draw(shape, ctx, shape.hoverShape, borderColor, this.widthToBody, this.bodyWidth, this.heightToBody, this.bodyHeight, carOnly);
                // Car Body Color
                var gradient = ctx.createLinearGradient(this.widthToBody, this.heightToBody, this.widthToBody, this.heightToBody+this.bodyHeight);
                if(gradient) {
                    gradient.addColorStop(0, this.colorScheme.mainColor);
                    gradient.addColorStop(0.5, this.colorScheme.highlightColor);
                    gradient.addColorStop(1, this.colorScheme.mainColor);
                    ctx.fillStyle = gradient;
                } else {
                    ctx.fillStyle = CWD.backgroundColor;
                }
                ctx.fill();
                ctx.stroke();
            }
        };

        shape.drawUpper = function(ctx, carOnly) {
            var i;
            var borderColor = ctx.type === 'pdf' ? 'black' : CWD.mainStroke;
            if(!this.suppressDrawing) {
                if(this.bodyStyle.drawUpperAccessories)
                    this.bodyStyle.drawUpperAccessories(shape, ctx, shape.hoverShape, borderColor, this.widthToBody, this.bodyWidth, this.heightToBody, this.bodyHeight);

                for(i = 0; i < this.shapes.length; i++) {
                    if(!carOnly || !this.shapes[i].uiWidget) {
                        this.shapes[i].draw(ctx,
                                this.shapes[i] === this.hoverShape ? CWD.hoverStroke : borderColor
                        );
                    }
                }
            }
//        ctx.lineWidth = 4;
//        ctx.strokeStyle = "blue";
//        ctx.strokeRect(shape.widthToBody, shape.heightToBody, shape.bodyWidth, shape.bodyHeight);
//        ctx.strokeStyle = "green";
//        ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
//        ctx.lineWidth = 1;
        };

        shape.contains = function(mx, my) {
            var i, test;
            this.hoverShape = null;
            if ((this.x <= mx) && (this.x + this.w >= mx) &&
                (this.y <= my) && (this.y + this.h >= my)) {
                for(i=0; i<this.shapes.length; i++) {
                    if(this.shapes[i].contains(mx, my)) {
                        this.hoverShape = this.shapes[i];
                        if(this.shapes[i].hoverLink && !this.shapes[i].turret) return this.shapes[i];
                    }
                }
                if(this.hoverShape) {
                    if(!this.hoverShape.hoverLink) { // Something we don't want to highlight, like CA
                        this.hoverShape = null;
                        return null;
                    } else return this.hoverShape; // If it was a turret with no contents
                }
                for(i in this.phantomShapes) {
                    if(this.phantomShapes.hasOwnProperty(i)) {
                        if(this.phantomShapes[i].contains(mx, my)) {
                            this.hoverShape = this.phantomShapes[i];
                            return this.hoverShape;
                        }
                    }
                }
                // Don't bother returning that it's over the car...  we don't care...
            }
            test = this.tireContains(mx, my);
            if(test) {
                this.hoverShape = test;
                return this.hoverShape;
            }
            if(this.bodyStyle.contains) {
                test = this.bodyStyle.contains(this, mx, my);
                if (test) {
                    this.hoverShape = test;
                    return this.hoverShape;
                }
            }
            return null;
        };

        // UTILITY METHODS FOR TYPE-SPECIFIC LAYOUT FUNCTIONS
        var columnSpace = function(items, max) {
            var total = 0;
            for(var i=0; i<items.length; i++) total += items[i].rowHeight;
            return max-total;
        };
        var findColumn = function(grid, name, size, colDefs, max) {
            var col = -1;
            for(var c = 1; c<grid.length-1; c++) {
                if(columnSpace(grid[c], colDefs ? colDefs[c].height : max) >= size) {
                    col = c;
                    break;
                }
            }
            if(col < 0 && columnSpace(grid[0],  colDefs ? colDefs[0].height : max) >= size) col = 0;
            if(col < 0 && columnSpace(grid[grid.length-1],  colDefs ? colDefs[grid.length-1].height : max) >= size) col = grid.length-1;
//        if(col < 0) {     // Not going to bother logging since it might just cause an increase in size
//            console.log("Unable to place item "+name+" with size "+size+" in grid!");
//        }
            return col;
        };
        var sortWeapons = function(weapons) {
            var i, result = [];
            for(i=0; i<weapons.length; i++) {
                if(weapons[i].weapon.isDropped()) result.push(weapons[i]);
            }
            for(i=0; i<weapons.length; i++) {
                if(!weapons[i].weapon.isDropped()) result.push(weapons[i]);
            }
            return result;
        };
        var dummyHalfLeft = {dummy: true, left: true, rowHeight: 1};
        var dummyFullLeft = {dummy: true, left: true, rowHeight: 2};
        var dummyHalfRight = {dummy: true, left: false, rowHeight: 1};
        var dummyFullRight = {dummy: true, left: false, rowHeight: 2};
        var hasDropped = function(weapons) {
            for(var i=0; i<weapons.length; i++) if(weapons[i].weapon.isDropped()) return true;
            return false;
        };
        var hasDummyLeft = function(col) {
            for(var i=0; i<col.length; i++)
                if(col[i].dummy && col[i].left) return col[i].rowHeight === 1 ? 1 : 3;
            return 0;
        };
        var hasDummyRight = function(col) {
            for(var i=0; i<col.length; i++)
                if(col[i].dummy && !col[i].left) return col[i].rowHeight === 1 ? 1 : 3;
            return 0;
        };
        var upgradeDummyLeft = function(col) {
            for(var i=0; i<col.length; i++) if(col[i].dummy && col[i].left) col[i] = dummyFullLeft;
        };
        var upgradeDummyRight = function(col) {
            for(var i=0; i<col.length; i++) if(col[i].dummy && !col[i].left) col[i] = dummyFullRight;
        };
        var reserveWeapons = function(leftWeapons, rightWeapons, minCol, maxCol, cols, colDefs, size) {
            var i, test, half = 0, full = 0, total, existing;
            for(i=maxCol-1; i>= minCol; i--) {
                test = columnSpace(cols[i], colDefs ? colDefs[i].height : size.height);
                if(test >= 4) full += 1;
                else if(test >= 2) half += 1;
            }
//            console.log("Full: "+full+" Half: "+half+" total "+(full*3+half)+" Left: "+leftWeapons.length+" Right: "+rightWeapons.length);
//            for(i=maxCol-1; i>= minCol; i--) {
//                test = columnSpace(cols[i], colDefs ? colDefs[i].height : size.height);
//                if(test >= 4) console.log("Before: "+i+": Full");
//                else if(test >= 2) console.log("Before: "+i+": Half");
//            }
            if(leftWeapons.length > full*3+half) return false;
            if(rightWeapons.length > full*3+half) return false;
            if(leftWeapons.length > 0) {
                total = 0;
                if(hasDropped(leftWeapons)) {
                    for(i=maxCol-1; i>= minCol; i--) {
                        test = columnSpace(cols[i], colDefs ? colDefs[i].height : size.height);
                        if(test > 1 && leftWeapons.length > 1 && leftWeapons.length < 4) {
                            cols[i].splice(0,0,dummyFullLeft);
                            total += 3;
                            break;
                        }  else if(test > 0) {
                            cols[i].splice(0,0, dummyHalfLeft);
                            total += 1;
                            break;
                        }
                    }
                }
                for(i=minCol; i<maxCol; i++) {
                    if(total >= leftWeapons.length) break;
                    test = columnSpace(cols[i], colDefs ? colDefs[i].height : size.height);
                    existing = hasDummyLeft(cols[i]);
                    if(existing === 3) continue;
                    if(existing === 1 && test > 1) {
                        upgradeDummyLeft(cols[i]);
                        total += 2;
                    } else {
//                        if(test === 1 || (total+1 === leftWeapons.length && test > 0)) {
                        if(test > 0 && test < 4) {
                            cols[i].splice(0,0,dummyHalfLeft);
                            total += 1;
                        } else if(test > 1) {
                            cols[i].splice(0,0,dummyFullLeft);
                            total += 3;
                        }
                    }
                }
                if(total < leftWeapons.length) console.log("LEFT LOGIC ERROR!");
            }
//            for(i=maxCol-1; i>= minCol; i--) {
//                test = columnSpace(cols[i], colDefs ? colDefs[i].height : size.height);
//                if(test >= 2) console.log("After L: "+i+": Full");
//                else if(test >= 1) console.log("After L: "+i+": Half");
//            }
            if(rightWeapons.length > 0) {
                total = 0;
                if(hasDropped(rightWeapons)) {
                    for(i=maxCol-1; i>= minCol; i--) {
                        test = columnSpace(cols[i], colDefs ? colDefs[i].height : size.height);
                        if(test > 1 && rightWeapons.length > 1 && rightWeapons.length < 4) {
                            cols[i].push(dummyFullRight);
                            total += 3;
                            break;
                        }  else if(test > 0) {
                            cols[i].push(dummyHalfRight);
                            total += 1;
                            break;
                        }
                    }
                }
                for(i=minCol; i<maxCol; i++) {
                    if(total >= rightWeapons.length) break;
                    test = columnSpace(cols[i], colDefs ? colDefs[i].height : size.height);
                    existing = hasDummyRight(cols[i]);
                    if(existing === 3) continue;
                    if(existing === 1 && test > 0) {
                        upgradeDummyRight(cols[i]);
                        total += 2;
                    } else {
                        if(test === 1 || (total+1 === rightWeapons.length && test > 0)) {
                            cols[i].push(dummyHalfRight);
                            total += 1;
                        } else if(test > 1) {
                            cols[i].push(dummyFullRight);
                            total += 3;
                        }
                    }
                }
                if(total < rightWeapons.length) console.log("RIGHT LOGIC ERROR!");
            }
            return true;
        };
        var clearReserved = function(col, left) {
            for(var i=col.length-1; i>=0; i--)
                if(col[i].dummy && col[i].left === left) col.splice(i, 1);
        };
        var placeLeftWeapons = function(leftWeapons, rightWeapons, minCol, maxCol, cols, colDefs, size) {
            var sorted, fullSize, halfSize, extra, total, i, j, weapons;
            sorted = sortWeapons(leftWeapons); // put dropped first
            fullSize = 0;
            halfSize = 0;
            extra = 0;
            for(i=minCol; i<maxCol; i++) {
                total = columnSpace(cols[i], colDefs ? colDefs[i].height : size.height);
                if(total === 1) ++halfSize;
                else if(total > 1) {
                    fullSize += 1;
                    if(total > 3 || hasDummyRight(cols[i]) > 1) extra += 1;
                } else if(hasDummyRight(cols[i]) > 1) extra += 1;
            } // TODO: if 2 full spaces/side and 2 wpns left and 3 right, make left weapons lay out full?
            if(fullSize >= sorted.length && fullSize+extra >= sorted.length+rightWeapons.length) {
                j=0;
                for(i=maxCol-1; i>=minCol; i--) { // Dropped from rear
                    if(j >= sorted.length || !sorted[j].weapon.isDropped()) break;
                    total = columnSpace(cols[i], colDefs ? colDefs[i].height : size.height);
                    if(total > 1) {
                        cols[i].splice(0, 0, CWD.createWeaponPlace(sorted[j], false));
                        if(sorted[j].weapon.componentArmor && sorted[j].weapon.count > 1) cols[i][0].sideCA = true;
                        j += 1;
                    }
                }
                for(i=minCol; i<maxCol; i++) { // Aimed from front
                    if(j >= sorted.length) break;
                    total = columnSpace(cols[i], colDefs ? colDefs[i].height : size.height);
                    if(total > 1) {
                        cols[i].splice(0, 0, CWD.createWeaponPlace(sorted[j], false));
                        if(sorted[j].weapon.componentArmor && sorted[j].weapon.count > 1) cols[i][0].sideCA = true;
                        j += 1;
                    }
                }
            } else if(fullSize*3 + halfSize >= sorted.length) {
                var caItems = [], caCol = -1;
                j=0;
                sorted.reverse();
                for(i=minCol; i<maxCol; i++) {
                    if(j >= sorted.length) break;
                    total = columnSpace(cols[i], colDefs ? colDefs[i].height : size.height);
                    if(total > 1) {
                        weapons = [sorted[j]];
                        if(sorted[j].weapon.componentArmor && sorted[j].weapon.count > 1) {
                            if(caItems.length > 0 && caCol > -1) {
                                if(caCol === i) caItems.push(sorted[j]);
                                else caCol = -1;
                            } else if(caItems.length === 0 && caCol < 0) {
                                caCol = i;
                                caItems.push(sorted[j]);
                            }
                        }
                        j += 1;
                        if(j<sorted.length) {
                            weapons.splice(0, 0, sorted[j]);
                            if(sorted[j].weapon.componentArmor && sorted[j].weapon.count > 1) {
                                if(caItems.length > 0 && caCol > -1) {
                                    if(caCol === i) caItems.push(sorted[j]);
                                    else caCol = -1;
                                } else if(caItems.length === 0 && caCol < 0) {
                                    caCol = i;
                                    caItems.push(sorted[j]);
                                }
                            }
                        }
                        j += 1;
                        if(j<sorted.length) {
                            weapons.splice(0, 0, sorted[j]);
                            if(sorted[j].weapon.componentArmor && sorted[j].weapon.count > 1) {
                                if(caItems.length > 0 && caCol > -1) {
                                    if(caCol === i) caItems.push(sorted[j]);
                                    else caCol = -1;
                                } else if(caItems.length === 0 && caCol < 0) {
                                    caCol = i;
                                    caItems.push(sorted[j]);
                                }
                            }
                        }
                        j += 1;
                        cols[i].splice(0, 0, CWD.createWeaponPlace(weapons, false));
                        if(caItems.length > 0 && caCol >= 0) cols[i][0].sideCA = true;
                    }
                }
                for(i=minCol; i<maxCol; i++) {
                    if(j >= sorted.length) break;
                    total = columnSpace(cols[i], colDefs ? colDefs[i].height : size.height);
                    if(total === 1) {
                        cols[i].splice(0, 0, CWD.createWeaponPlace(sorted[j], false));
                        j += 1;
                    }
                }
            } else {
//            console.log("COLS:"+minCol+"-"+maxCol+" LW: "+leftWeapons.length+" RW: "+rightWeapons.length+" FULL: "+fullSize+" HALF: "+halfSize+" EXTRA: "+extra+" SORTED: "+sorted.length);
                return false;
            }
            var caStart = null, caEnd = null;
            for(i=minCol; i<maxCol; i++) {
                if(cols[i].length > 0 && cols[i][0].type === 'weapons' && cols[i][0].sideCA) {
                    if(!caStart) caStart = cols[i][0].weapons[cols[i][0].weapons.length-1];
                    caEnd = cols[i][0].weapons[0];
                }
            }
            if(caStart) {
                var ca = shape.addWeaponCA(caStart.weapon, caStart.weapon.location.substr(0, 1).toLowerCase()+caStart.weapon.location.substr(1));
                ca.rightWeapon = caStart;
                ca.leftWeapon = caEnd;
                ca.rotated = true;
            }
            return true;
        };
        var placeRightWeapons = function(rightWeapons, minCol, maxCol, cols, colDefs, size) {
            var sorted, fullSize, halfSize, total, i, j, weapons;
            sorted = sortWeapons(rightWeapons);
            fullSize = 0;
            halfSize = 0;
            for(i=minCol; i<maxCol; i++) {
                total = columnSpace(cols[i], colDefs ? colDefs[i].height : size.height);
                if(total === 1) ++halfSize;
                else if(total > 1) ++fullSize;
            }
            if(fullSize >= sorted.length) {
                j=0;
                for(i=maxCol-1; i>= minCol; i--) {
                    if(j >= sorted.length || !sorted[j].weapon.isDropped()) break;
                    total = columnSpace(cols[i], colDefs ? colDefs[i].height : size.height);
                    if(total > 1) {
                        cols[i].push(CWD.createWeaponPlace(sorted[j], false));
                        if(sorted[j].weapon.componentArmor && sorted[j].weapon.count > 1) cols[i][cols[i].length-1].sideCA = true;
                        j += 1;
                    }
                }
                for(i=minCol; i<maxCol; i++) {
                    if(j >= sorted.length) break;
                    total = columnSpace(cols[i], colDefs ? colDefs[i].height : size.height);
                    if(total > 1) {
                        cols[i].push(CWD.createWeaponPlace(sorted[j], false));
                        if(sorted[j].weapon.componentArmor && sorted[j].weapon.count > 1) cols[i][cols[i].length-1].sideCA = true;
                        j += 1;
                    }
                }
            } else if(fullSize*3 + halfSize >= sorted.length) {
                var caItems = [], caCol = -1;
                j=0;
                sorted.reverse();
                for(i=minCol; i<maxCol; i++) {
                    if(j >= sorted.length) break;
                    total = columnSpace(cols[i], colDefs ? colDefs[i].height : size.height);
                    if(total > 1) {
                        weapons = [sorted[j]];
                        if(sorted[j].weapon.componentArmor && sorted[j].weapon.count > 1) {
                            if(caItems.length > 0 && caCol > -1) {
                                if(caCol === i) caItems.push(sorted[j]);
                                else caCol = -1;
                            } else if(caItems.length === 0 && caCol < 0) {
                                caCol = i;
                                caItems.push(sorted[j]);
                            }
                        }
                        j += 1;
                        if(j<sorted.length) {
                            weapons.splice(0, 0, sorted[j]);
                            if(sorted[j].weapon.componentArmor && sorted[j].weapon.count > 1) {
                                if(caItems.length > 0 && caCol > -1) {
                                    if(caCol === i) caItems.push(sorted[j]);
                                    else caCol = -1;
                                } else if(caItems.length === 0 && caCol < 0) {
                                    caCol = i;
                                    caItems.push(sorted[j]);
                                }
                            }
                        }
                        j += 1;
                        if(j<sorted.length) {
                            weapons.splice(0, 0, sorted[j]);
                            if(sorted[j].weapon.componentArmor && sorted[j].weapon.count > 1) {
                                if(caItems.length > 0 && caCol > -1) {
                                    if(caCol === i) caItems.push(sorted[j]);
                                    else caCol = -1;
                                } else if(caItems.length === 0 && caCol < 0) {
                                    caCol = i;
                                    caItems.push(sorted[j]);
                                }
                            }
                        }
                        j += 1;
                        cols[i].push(CWD.createWeaponPlace(weapons, false));
                        if(caItems.length > 0 && caCol >= 0) cols[i][cols[i].length-1].sideCA = true;
                    }
                }
                for(i=minCol; i<maxCol; i++) {
                    if(j >= sorted.length) break;
                    total = columnSpace(cols[i], colDefs ? colDefs[i].height : size.height);
                    if(total === 1) {
                        cols[i].push(CWD.createWeaponPlace(sorted[j], false));
                        j += 1;
                    }
                }
            } else {
                return false;
            }
            var caStart = null, caEnd = null;
            for(i=minCol; i<maxCol; i++) {
                j = cols[i].length-1;
                if(cols[i].length > 0 && cols[i][j].type === 'weapons' && isRight(cols[i][j].weapons[0]) && cols[i][j].sideCA) {
                    if(!caStart) caStart = cols[i][j].weapons[cols[i][j].weapons.length-1];
                    caEnd = cols[i][j].weapons[0];
                }
            }
            if(caStart) {
                var ca = shape.addWeaponCA(caStart.weapon, caStart.weapon.location.substr(0, 1).toLowerCase()+caStart.weapon.location.substr(1));
                ca.rightWeapon = caStart;
                ca.leftWeapon = caEnd;
                ca.rotated = true;
                ca.topText = true;
            }
            return true;
        };
        shape.layoutContents = function(size, colDefs) {
            var i, j, total, cols = [], extra, left, right, height, dischargers, item, gunner = false, passengers = [];
            for(i=0; i<shape.frontWeapons.length; i++) shape.frontWeapons[i].configureSize(); // TODO: maybe only when changing count/CA?
            for(i=0; i<shape.leftWeapons.length; i++) shape.leftWeapons[i].configureSize();
            for(i=0; i<shape.rightWeapons.length; i++) shape.rightWeapons[i].configureSize();
            for(i=0; i<shape.backWeapons.length; i++) shape.backWeapons[i].configureSize();
            for(i=0; i<shape.topWeapons.length; i++) shape.topWeapons[i].configureSize();
            for(i=0; i<shape.underbodyWeapons.length; i++) shape.underbodyWeapons[i].configureSize();
            for(i=0; i<shape.frontLeftWeapons.length; i++) shape.frontLeftWeapons[i].configureSize();
            for(i=0; i<shape.frontRightWeapons.length; i++) shape.frontRightWeapons[i].configureSize();
            for(i=0; i<shape.backLeftWeapons.length; i++) shape.backLeftWeapons[i].configureSize();
            for(i=0; i<shape.backRightWeapons.length; i++) shape.backRightWeapons[i].configureSize();
            if(shape.car.hasOversizeWeaponFacings()) {
                for(i=0; i<shape.leftBackWeapons.length; i++) shape.leftBackWeapons[i].configureSize();
                for(i=0; i<shape.rightBackWeapons.length; i++) shape.rightBackWeapons[i].configureSize();
                for(i=0; i<shape.topBackWeapons.length; i++) shape.topBackWeapons[i].configureSize();
                for(i=0; i<shape.underbodyBackWeapons.length; i++) shape.underbodyBackWeapons[i].configureSize();
            }
            shape.layoutSize = size;
            shape.layoutColumns = colDefs;
            shape.removeWeaponCA('front');
            shape.removeWeaponCA('back');
            shape.removeWeaponCA('left');
            shape.removeWeaponCA('right');
            for(i=0; i<size.width; i++) cols.push([]);
            var engineCol = -1, crewCol = -1;
            // Start with corner-mount weapons in the front and back columns
            if(shape.frontLeftWeapons.length > 0 || shape.frontRightWeapons.length > 0) cols[0].push(
                CWD.createCornerPlace(shape.frontLeftWeapons, shape.frontRightWeapons)
            );
            if(shape.backLeftWeapons.length > 0 || shape.backRightWeapons.length > 0) cols[cols.length-1].push(
                CWD.createCornerPlace(shape.backLeftWeapons, shape.backRightWeapons)
            );
            // Reserve space for front/rear weapons
            if(shape.frontWeapons.length > 0 || shape.frontBoosters.length > 0) cols[0].push(CWD.createWeaponPlace(shape.frontWeapons.concat(shape.frontBoosters), true));
            if(shape.backWeapons.length > 0 || shape.backBoosters.length > 0) cols[cols.length-1].push(CWD.createWeaponPlace(shape.backWeapons.concat(shape.backBoosters), true));
            // Reserve space for front/rear boosters
//        for(i=0; i<shape.frontBoosters.length; i++) cols[0].push(shape.frontBoosters[i]);
//        for(i=0; i<shape.backBoosters.length; i++) cols[cols.length-1].push(shape.backBoosters[i]);
            // Find columns for engine and crew
            if(shape.engine && shape.engine.manuallyPlaced && shape.engine.topColumn < size.width) engineCol = shape.engine.topColumn;
            if(shape.crew.length > 0 && shape.crew[0].manuallyPlaced && shape.crew[0].topColumn < size.width) crewCol = shape.crew[0].topColumn;
            if(shape.engine) {
                if(engineCol < 0) {
                    if(size.width === 2) { // Engine in front unless no back weapons and crew fixed in middle
                        engineCol = 0;
                    } else if(size.width === 3) { // Engine in front unless no back weapons and crew fixed in middle
                        if(this.backWeapons.length > 0 && crewCol !== 0) engineCol = 0;
                        else engineCol = crewCol === 1 ? 2 : 1;
                    } else {
                        engineCol = crewCol === 1 ? 2 : 1;
                    }
                    if(columnSpace(cols[engineCol], colDefs ? colDefs[engineCol].height : size.height) < shape.engine.minRowHeight) {
                        engineCol = findColumn(cols, "Engine", shape.engine.minRowHeight, colDefs, size.height);
                    }
                }
                if(engineCol < 0) return false;
                cols[engineCol].push(shape.engine);
            }
            if(engineCol === 0 && cols[0][0].weapons && cols.length === 2) { // Don't cram a ten-wheeler cab with engine and small guns in front row
                total = 0;
                for(i=0; i<cols[0][0].weapons.length; i++) total += cols[0][0].weapons[i].maxRowHeight;
                if(total + 2 > (colDefs ? colDefs[0].height : size.height)) return false;
            }
            if(shape.crew.length > 0) {
                if(crewCol < 0) {
                    if(engineCol === 0) crewCol = 1;
                    else if(size.width === 3) {
                        if(engineCol === 1) crewCol = this.backWeapons.length > 0 ? 0 : 2;
                        else crewCol = 1;
                    }
                    else if(engineCol === 1) crewCol = 2;
                    else crewCol = 1;
                    if(columnSpace(cols[crewCol], colDefs ? colDefs[crewCol].height : size.height) < shape.crew[0].minRowHeight*((shape.car.hasDriver() ? 1 : 0)+(shape.car.hasGunner() ? 1 : 0))) {
                        crewCol = findColumn(cols, "Crew", shape.crew[0].minRowHeight*shape.crew.length, colDefs, size.height);
                    }
                }
                if(crewCol < 0) return false;
                for(i=0; i<shape.crew.length; i++) {
                    if(shape.crew[i].crew.name !== 'Gunner') cols[crewCol].push(shape.crew[i]);
                    else if(!gunner) {
                        cols[crewCol].push(shape.crew[i]);
                        gunner = true;
                    }
                }
            }
            // Temporarily block space for left and right weapons
            reserveWeapons(shape.leftWeapons, shape.rightWeapons, 1, this.car.hasOversizeWeaponFacings() ? size.width/2 : size.width-1, cols, colDefs, size);
            if(this.car.hasOversizeWeaponFacings())
                reserveWeapons(shape.leftBackWeapons, shape.rightBackWeapons, size.width/2, size.width-1, cols, colDefs, size);
            // Reserve space for cargo items
            for(i=0; i<shape.cargoShapes.length; i++) {
                if(shape.cargoShapes[i].manuallyPlaced) {
                    if(columnSpace(cols[shape.cargoShapes[i].topColumn], colDefs ? colDefs[shape.cargoShapes[i].topColumn].height : size.height) < shape.cargoShapes[i].minRowHeight)
                        return false; // Manually placed stuff doesn't all fit!
                    cols[shape.cargoShapes[i].topColumn].push(shape.cargoShapes[i]);
                }
            }
            var found, start = size.width === 2 ? 0 : Math.floor(size.width/2);
            if(cols[start].length > 0 && cols[start+1].length === 0) start += 1;
            var done1, done2;
            if(this.car.hasOversizeWeaponFacings()) {
                if(this.topTurret) {
                    for(i=size.width/2-1; i>= 0; i--)
                        if(columnSpace(cols[i], colDefs ? colDefs[i].height : size.height) >= this.topTurret.minRowHeight) {
                            cols[i].push(this.topTurret);
                            done1 = this.topTurret;
                            break;
                        }
                    if(!done1) return false;
                }
                if(this.topBackTurret) {
                    for(i=size.width/2; i < size.width; i++)
                        if(columnSpace(cols[i], colDefs ? colDefs[i].height : size.height) >= this.topBackTurret.minRowHeight) {
                            cols[i].push(this.topBackTurret);
                            done2 = this.topBackTurret;
                            break;
                        }
                    if(!done2) return false;
                }
            }
            left = shape.backLeftWeapons.length+shape.backRightWeapons.length+shape.backWeapons.length > (colDefs ? colDefs[cols.length-1].height : size.height)*3/2-3 ?
                size.width-1 : size.width;
            for(i=0; i<shape.cargoShapes.length; i++) {
                if(!shape.cargoShapes[i].manuallyPlaced && shape.cargoShapes[i] !== done1 && shape.cargoShapes[i] !== done2) {
                    if(shape.cargoShapes[i].type === 'Discharger') {
                        if(dischargers) {
                            if(shape.cargoShapes[i].location === 'Top') dischargers.top.push(shape.cargoShapes[i]);
                            else dischargers.under.push(shape.cargoShapes[i]);
                            dischargers.checkHeight();
                            continue;
                        } else {
                            dischargers = CWD.createDischargerPlace(shape.cargoShapes[i]);
                            item = dischargers;
                        }
                    } else if(shape.cargoShapes[i].crew && shape.cargoShapes[i].crew.name === 'Passenger' && car.passengers.length > 2) {
                        if(passengers.length > 0 && passengers[passengers.length-1].passengers.length < 9) {
                            passengers[passengers.length-1].passengers.push(shape.cargoShapes[i]);
                            continue;
                        } else {
                            item = CWD.createShape();
                            item.type = 'PassengerArea';
                            item.minRowHeight = 2;
                            item.maxRowHeight = 2;
                            item.rowHeight = 2;
                            item.passengers = [shape.cargoShapes[i]];
                            passengers.push(item);
                        }
                    } else item = shape.cargoShapes[i];
                    found = false;
                    // If lots of side weapons, fill in cargo from the back forward
                    if(this.leftWeapons.length > size.width-3 || this.rightWeapons.length > size.width-3) {
                        for(j=left-1; j >= 0; j--) {
                            if(columnSpace(cols[j], colDefs ? colDefs[j].height : size.height) >= item.minRowHeight) {
                                cols[j].push(item);
                                found = true;
                                break;
                            }
                        }
                    } else { // Otherwise, fill in from the middle back and then from the back forward
                        for(j=start; j<left; j++) {
                            if(columnSpace(cols[j], colDefs ? colDefs[j].height : size.height) >= item.minRowHeight) {
                                cols[j].push(item);
                                found = true;
                                break;
                            }
                        }
                        if(!found) {
                            for(j=start-1; j >= 0; j--) {
                                if(columnSpace(cols[j], colDefs ? colDefs[j].height : size.height) >= item.minRowHeight) {
                                    cols[j].push(item);
                                    found = true;
                                    break;
                                }
                            }
                        }
                    }
                    if(!found) {
                        if(columnSpace(cols[0], colDefs ? colDefs[j].height : size.height) >= item.minRowHeight) {
                            cols[0].push(item);
                        } else {
                            if(size.height >= 6) console.log("Unable to place cargo shape ("+shape.cargoShapes[i].name+")");
                            return false;
                        }
                    }
                }
            }
            for(i=0; i<cols.length; i++) clearReserved(cols[i], true);
            // Reserve space for side weapons
            if(this.leftWeapons.length > 0 &&
                !placeLeftWeapons(this.leftWeapons, this.rightWeapons, 1, size.width === 2 ? 2 : this.car.hasOversizeWeaponFacings() ? size.width/2 : size.width-1 ,cols, colDefs, size))
            {/*if(size.height >= 6) console.log("Unable to place left weapons");*/ return false;}
            if(this.car.hasOversizeWeaponFacings() && this.leftBackWeapons.length&& this.leftBackWeapons.length > 0 &&
                !placeLeftWeapons(this.leftBackWeapons, this.rightBackWeapons, size.width/2, size.width-1, cols, colDefs, size))
            {/*if(size.height >= 6) console.log("Unable to place left back weapons");*/ return false;}
            for(i=0; i<cols.length; i++) clearReserved(cols[i], false);
            if(this.rightWeapons.length > 0 &&
                !placeRightWeapons(this.rightWeapons, 1, size.width === 2 ? 2 : this.car.hasOversizeWeaponFacings() ? size.width/2 : size.width-1 ,cols, colDefs, size))
            {/*if(size.height >= 6) console.log("Unable to place right weapons");*/ return false;}
            if(this.car.hasOversizeWeaponFacings() && this.rightBackWeapons.length > 0 &&
                !placeRightWeapons(this.rightBackWeapons, size.width/2, size.width-1 , cols, colDefs, size))
            {/*if(size.height >= 6) console.log("Unable to place right back weapons");*/ return false;}
            // Place everything within columns
            for(i=0; i<cols.length; i++) {
                total = 0;
                if(colDefs) {
                    left = shape.heightToBody + shape.bodyHeight/2;
                    right = left;
                    height = ((cols[i].length > 1 || (cols[i].length === 1 && cols[i][0].weapons && cols[i][0].weapons.length > 1))
                        && colDefs[i].componentHeight ? colDefs[i].componentHeight : shape.componentHeight);
                    extra = (colDefs[i].height*(height+5)+5)/4;
                    left = left - extra;
                    right = right + extra;
                } else {
                    left = shape.heightToBody;
                    right = shape.heightToBody+shape.bodyHeight;
                    height = shape.componentHeight;
                }
                extra = (colDefs ? colDefs[i].height : size.height);
                for(j=0; j<cols[i].length; j++) {
                    total += cols[i][j].maxRowHeight;
                    cols[i][j].topColumn = i;
                }
                if(total <= extra) {
                    this.layoutColumn(cols[i], shape.widthToBody+(size.width-i-1)*(shape.columnWidth+5), true, extra,
                        left, right, height);
                } else {
                    total = 0;
                    for(j=0; j<cols[i].length; j++) total += cols[i][j].minRowHeight;
                    if(total <= extra) {
                        this.layoutColumn(cols[i], shape.widthToBody+(size.width-i-1)*(shape.columnWidth+5), false, extra,
                            left, right, height);
                    } else {
//                    console.log("Too much stuff in column "+i+": "+total);
                        return false; // Only happens when dragging things on top of others
                    }
                }
            }
            if(shape.leftCA) {
                shape.leftCA.layout(shape.leftCA.leftWeapon.x-5, shape.leftCA.leftWeapon.y,
                    (shape.leftCA.rightWeapon.x+shape.leftCA.rightWeapon.h-shape.leftCA.leftWeapon.x+10), shape.leftCA.leftWeapon.w+15);
            }
            if(shape.rightCA) {
                shape.rightCA.layout(shape.rightCA.leftWeapon.x-5, shape.rightCA.leftWeapon.y-15,
                    (shape.rightCA.rightWeapon.x+shape.rightCA.rightWeapon.h-shape.rightCA.leftWeapon.x+10),
                        shape.rightCA.leftWeapon.w+15);
            }
            return true;
        };
        var isLeft = function(weaponShape) {
            return weaponShape.location === 'Left' || weaponShape.location === 'LeftFront' || weaponShape.location === 'LeftBack';
        };
        var isRight = function(weaponShape) {
            return weaponShape.location === 'Right' || weaponShape.location === 'RightFront' || weaponShape.location === 'RightBack';
        };
        shape.layoutColumn = function(col, backX, fullSize, maxHeight, left, right, componentHeight) {
            if(col.length === 0) return;
            var corner = null;
            var i, first = 0, last = col.length- 1, width, temp, delta = 0, caRocket = 0;
            for(i=0; i<col.length; i++) {
                col[i].rowHeight = fullSize ? col[i].maxRowHeight : col[i].minRowHeight;
                delta += col[i].rowHeight;
                if(col[i].weapons)
                    for(temp = 0; temp < col[i].weapons.length; temp++)
                        col[i].weapons[temp].rowHeight = fullSize ? col[i].weapons[temp].maxRowHeight : col[i].weapons[temp].minRowHeight;
                if(col[i].leftWeapons)
                    for(temp = 0; temp < col[i].leftWeapons.length; temp++)
                        col[i].leftWeapons[temp].rowHeight = fullSize ? col[i].leftWeapons[temp].maxRowHeight : col[i].leftWeapons[temp].minRowHeight;
                if(col[i].rightWeapons)
                    for(temp = 0; temp < col[i].rightWeapons.length; temp++)
                        col[i].rightWeapons[temp].rowHeight = fullSize ? col[i].rightWeapons[temp].maxRowHeight : col[i].rightWeapons[temp].minRowHeight;
            }
            delta = fullSize ? 0 : maxHeight-delta; // unused cells
            if(col[first].type === 'weapons') {
                if(col[first].leftWeapons) { // Corner mount left
                    corner = col[first];
                    // Lay out left weapon
                    if(col[first].leftWeapons.length === 1) {
                        col[first].leftWeapons[0].layout(backX, left, shape.columnWidth,
                                componentHeight*col[first].leftWeapons[0].rowHeight/2);
                        left += componentHeight*col[first].leftWeapons[0].rowHeight/2+5;
                    } else if(col[first].leftWeapons.length === 2) {
                        col[first].leftWeapons[0].layout(backX, left, shape.columnWidth,
                                componentHeight*col[first].leftWeapons[0].rowHeight/4);
                        left += componentHeight*col[first].leftWeapons[0].rowHeight/4+2.5;
                        col[first].leftWeapons[1].layout(backX, left, shape.columnWidth,
                                componentHeight*col[first].leftWeapons[1].rowHeight/4);
                        left += componentHeight*col[first].leftWeapons[1].rowHeight/4+2.5;
                    } else {
                        left += componentHeight*col[first].rightWeapons[0].rowHeight/2+5;
                    }
                    first+=1;
                } else if(isLeft(col[first].weapons[0])) {
                    // Lay out left weapon(s)
                    if(col[first].weapons.length === 1) {
                        if(col[first].rowHeight === 1) {
                            col[first].weapons[0].layout(backX, left,
                                shape.columnWidth, componentHeight*col[first].weapons[0].rowHeight/2);
                            col[first].weapons[0].drawFullBarrel = false;
                            col[first].weapons[0].rotation = "Front";
                        } else {
                            temp = col[first].sideCA ? 5 : 0;
                            col[first].weapons[0].layout(backX+temp, left,
                                    componentHeight-3*temp, shape.columnWidth*col[first].weapons[0].rowHeight/2-2*temp);
                            if(col[first].weapons[0].weapon.isSingleShotRocket() && col[first].weapons[0].h>50)
                                col[first].weapons[0].h = 50; // Otherwise comes out to 80 and weapon moves
                            col[first].weapons[0].drawFullBarrel = true;
                            col[first].weapons[0].rotation = "Left";
                        }
                    } else { // Up to 3
                        temp = col[first].sideCA ? 5 : 0;
                        width = col[first].weapons.length === 3 ? (shape.columnWidth-4-temp*3)/3 : (shape.columnWidth-2-temp*3)/2;
                        for(i=0; i<col[first].weapons.length; i++) {
                            col[first].weapons[i].layout(backX+temp+i*(width+2), left,
                                    componentHeight-temp*3, width);
                            col[first].weapons[i].drawFullBarrel = true;
                            col[first].weapons[i].rotation = "Left";
                        }
                    }
                    left += componentHeight*col[first].rowHeight/2+5;
                    first+=1;
                } // Ignore right/front/back weapons for now
            }
            if(last >= first && col[last].type === 'weapons') {
                // Any corner mount should have been found already, so this should only be front/back/right-facing weapons
                if(isRight(col[last].weapons[0])) {
                    // Lay out right weapon(s)
                    if(col[last].weapons.length === 1) {
                        if(col[last].rowHeight === 1) {
                            col[last].weapons[0].layout(backX, right-componentHeight*col[last].rowHeight/2, shape.columnWidth,
                                    componentHeight*col[last].weapons[0].rowHeight/2);
                            col[last].weapons[0].drawFullBarrel = false;
                            col[last].weapons[0].rotation = "Front";
                        } else {
                            temp = col[last].sideCA ? 5 : 0;
                            col[last].weapons[0].layout(backX+temp, right-(componentHeight*col[last].rowHeight/2-2*temp), componentHeight-2*temp,
                                    shape.columnWidth*col[last].weapons[0].rowHeight/2-3*temp);
                            if(col[last].weapons[0].weapon.isSingleShotRocket() && col[last].weapons[0].h>50)
                                col[last].weapons[0].h = 50; // Otherwise comes out to 80 and weapon moves
                            col[last].weapons[0].drawFullBarrel = true;
                            col[last].weapons[0].rotation = "Right";
                        }
                    } else { // Up to 3
                        temp = col[last].sideCA ? 5 : 0;
                        width = col[last].weapons.length === 3 ? (shape.columnWidth-4-temp*3)/3 : (shape.columnWidth-2-temp*3)/2;
                        for(i=0; i<col[last].weapons.length; i++) {
                            col[last].weapons[i].layout(backX+temp+i*(width+2), right-componentHeight*col[last].rowHeight/2+temp*3,
                                    componentHeight-temp*3, width);
                            col[last].weapons[i].drawFullBarrel = true;
                            col[last].weapons[i].rotation = "Right";
                        }
                    }
                    right -= componentHeight*col[last].rowHeight/2+5;
                    last -= 1;
                } // Ignore front/back weapons for now
            }
            // Right-hand corner mounts
            if(corner && corner.rightWeapons.length === 1) {
                temp = componentHeight*corner.rightWeapons[0].rowHeight/2;
                corner.rightWeapons[0].layout(backX, right-temp, shape.columnWidth, temp);
                right -= temp+5;
            } else if(corner && corner.rightWeapons.length === 2) {
                temp = componentHeight*corner.rightWeapons[0].rowHeight/4;
                corner.rightWeapons[0].layout(backX, right-temp, shape.columnWidth, temp);
                right -= temp+2.5;
                temp = componentHeight*corner.rightWeapons[1].rowHeight/4;
                corner.rightWeapons[1].layout(backX, right-temp, shape.columnWidth, temp);
                right -= temp+2.5;
            }
            var j, caStart, caEnd, crewPadding, offset, leftOffset, totalCells = 0, gunnerBox;
            // Lay out interior items and weapons
            if(last >= first) {
                temp = 0;
                for(i=first; i<=last; i++) {
                    temp += col[i].rowHeight;
                    if(col[i].weapons) temp += delta;
                }
                left += ((right-left)-(componentHeight*temp/2+(last-first)*5))/2;
                for(i=first; i<=last; i++) {
                    if(col[i].weapons) {
                        caStart = -1;
                        caEnd = -1;
                        for(j=0; j<col[i].weapons.length; j++) totalCells += col[i].weapons[j].maxHeight;
                        for(j=0; j<col[i].weapons.length; j++) {
                            if(col[i].weapons[j].weapon && col[i].weapons[j].weapon.componentArmor && col[i].weapons[j].weapon.count > 1) {
                                temp = col[i].weapons[j].weapon.location.toLowerCase();
                                if(caStart < 0) {
                                    caStart = j;
                                    shape.addWeaponCA(col[i].weapons[j].weapon, temp);
                                    if(col[i].weapons[j].weapon.isSingleShotRocket()) caEnd = j;
                                } else if(col[i].weapons[j].weapon === col[i].weapons[caStart].weapon) caEnd = j;
                            }
                        }
                        leftOffset = left;
                        for(j=0; j<col[i].weapons.length; j++) {
                            // (The double-cell height/2 plus any unused cells in the col) * # of cells - space between each weapon,
                            //   all divided by # of weapons in this bunch
                            width = (componentHeight*(col[i].rowHeight+delta)/2-col[i].weapons.length*2+2)*col[i].weapons[j].maxHeight/totalCells;
                            if(j === caStart) leftOffset += 5;
                            if(j >= caStart && j <= caEnd) offset = Math.ceil(20/(caEnd+1-caStart));
                            else offset = 0;
                            col[i].weapons[j].layout(backX+(offset > 0 ? 5 : 0), leftOffset, shape.columnWidth-(offset > 0 ? 10 : 0),
                                    width-offset);
                            leftOffset += width-offset+2;
                            if(j === caEnd) leftOffset += 15;
                        }
                        if(caStart > -1) {
                            caRocket = 0;
                            if(col[i].weapons[caStart].weapon.isSingleShotRocket() && col[i].weapons[caStart].h > 60) caRocket = 60-col[i].weapons[caStart].h;
                            shape[temp+'CA'].layout(col[i].weapons[caStart].x-5, col[i].weapons[caStart].y-5,
                                shape.columnWidth,
                                    col[i].weapons[caEnd].y+col[i].weapons[caEnd].h-col[i].weapons[caStart].y+caRocket+20);
                        }
                        left = leftOffset;
                    } else if(col[i].crew && (col[i].crew.name === 'Driver' || col[i].crew.name === 'Gunner') && shape.crewCompartmentCA) {
                        crewPadding = 5;
                        // Reminder: only one gunner ever put into the column, so they only ever take up one layout spot
                        if(col[i].crew.name === 'Gunner' && this.car.gunnerCount() > 1) {
                            gunnerBox = {x: backX+crewPadding, y: left+1, w: shape.columnWidth-2*crewPadding,
                                h: componentHeight*col[i].rowHeight/2-3*crewPadding};
                        } else { // Driver or solo gunner
                            col[i].layout(backX+crewPadding, left+crewPadding, shape.columnWidth-2*crewPadding,
                                    componentHeight*col[i].rowHeight/2-2*crewPadding);
                        }
                        if(i<last && col[i+1].crew) { // Driver and one or more Gunners
                            shape.crewCompartmentCA.layout(backX, left, shape.columnWidth, componentHeight*col[i].rowHeight/2+componentHeight*col[i+1].rowHeight/2+5);
                            i+=1;
                            left += componentHeight*col[i].rowHeight/2+7-crewPadding*2;
                            if(col[i].crew.name === 'Gunner' && this.car.gunnerCount() > 1) {
                                gunnerBox = {x: backX+crewPadding, y: left, w: shape.columnWidth-2*crewPadding,
                                    h: componentHeight*col[i].rowHeight/2-2*crewPadding};
                            } else {
                                col[i].layout(backX+crewPadding, left, shape.columnWidth-2*crewPadding,
                                        componentHeight*col[i].rowHeight/2-2*crewPadding);
                            }
                            left += crewPadding*2-2;
                        } else if(col[i].crew.name === 'Gunner' && this.car.gunnerCount() > 1) { // Multiple Gunners
                            shape.crewCompartmentCA.layout(backX, left, shape.columnWidth, componentHeight*col[i].rowHeight/2);
                        }
                        left += componentHeight*col[i].rowHeight/2+5;
                    } else {
                        if(col[i].type === 'dischargers') {
                            for(j=0; j<col[i].top.length && j < 5; j++)
                                col[i].top[j].layout(backX+21*j, left, 15, 40);
                            for(j=0; j<col[i].under.length && j < 5; j++)
                                col[i].under[j].layout(backX+21*j, left+60, 15, 40);
                        } else if(col[i].crew && col[i].crew.name === 'Gunner' && this.car.gunnerCount() > 1) {
                            gunnerBox = {x:backX, y: left, w: shape.columnWidth, h: componentHeight*col[i].rowHeight/2};
                        } else
                            col[i].layout(backX, left, shape.columnWidth, componentHeight*col[i].rowHeight/2);
                        left += componentHeight*col[i].rowHeight/2+5;
                    }
                }
            }
            if(gunnerBox) layoutPeople(gunnerBox, shape.crew, 'Gunner');
            for(i=0; i<col.length; i++)
                if(col[i].type === 'PassengerArea')
                    layoutPeople(col[i], col[i].passengers, 'Passenger');
        };
        var layoutPeople = function(bounds, people, type) {
            var i, index = 0, total = 0;
            for(i=0; i<people.length; i++) if(people[i].crew.name === type) total += 1;
            if(total === 1) {
                for(i=0; i<people.length; i++) {
                    if(people[i].crew.name !== type) continue;
                    people[i].layout(bounds.x, bounds.y, bounds.w, bounds.h);
                }
            } else if(total <= 4) {
                for(i=0; i<people.length; i++) {
                    if(people[i].crew.name !== type) continue;
                    if(index === 0) people[i].layout(bounds.x, bounds.y, bounds.w/2-2, bounds.h/2-2);
                    else if(index === 1) people[i].layout(bounds.x+bounds.w/2+2, bounds.y+bounds.h/2+2, bounds.w/2-2, bounds.h/2-2);
                    else if(index === 2) people[i].layout(bounds.x, bounds.y+bounds.h/2+2, bounds.w/2-2, bounds.h/2-2);
                    else if(index === 3) people[i].layout(bounds.x+bounds.w/2+2, bounds.y, bounds.w/2-2, bounds.h/2-2);
                    index += 1;
                }
            } else if(total <= 6) {
                for(i=0; i<people.length; i++) {
                    if(people[i].crew.name !== type) continue;
                    if(index === 0) people[i].layout(bounds.x, bounds.y, bounds.w/2-2, bounds.h/3-2);
                    else if(index === 1) people[i].layout(bounds.x+bounds.w/2+2, bounds.y+bounds.h/3+1, bounds.w/2-2, bounds.h/3-2);
                    else if(index === 2) people[i].layout(bounds.x, bounds.y+bounds.h*2/3+2, bounds.w/2-2, bounds.h/3-2);
                    else if(index === 3) people[i].layout(bounds.x+bounds.w/2+2, bounds.y, bounds.w/2-2, bounds.h/3-2);
                    else if(index === 4) people[i].layout(bounds.x, bounds.y+bounds.h/3+1, bounds.w/2-2, bounds.h/3-2);
                    else if(index === 5) people[i].layout(bounds.x+bounds.w/2+2, bounds.y+bounds.h*2/3+2, bounds.w/2-2, bounds.h/3-2);
                    index += 1;
                }
            } else {
                for(i=0; i<people.length; i++) {
                    if(people[i].crew.name !== type) continue;
                    if(index === 0) people[i].layout(bounds.x, bounds.y, bounds.w/3-2, bounds.h/3-2);
                    else if(index === 1) people[i].layout(bounds.x+bounds.w/3+1, bounds.y+bounds.h/3+1, bounds.w/3-2, bounds.h/3-2);
                    else if(index === 2) people[i].layout(bounds.x+bounds.w*2/3+2, bounds.y+bounds.h*2/3+2, bounds.w/3-2, bounds.h/3-2);
                    else if(index === 3) people[i].layout(bounds.x, bounds.y+bounds.h*2/3+2, bounds.w/3-2, bounds.h/3-2);
                    else if(index === 4) people[i].layout(bounds.x+bounds.w*2/3+2, bounds.y, bounds.w/3-2, bounds.h/3-2);
                    else if(index === 5) people[i].layout(bounds.x+bounds.w/3+1, bounds.y, bounds.w/3-2, bounds.h/3-2);
                    else if(index === 6) people[i].layout(bounds.x, bounds.y+bounds.h/3+1, bounds.w/3-2, bounds.h/3-2);
                    else if(index === 7) people[i].layout(bounds.x+bounds.w*2/3+2, bounds.y+bounds.h/3+1, bounds.w/3-2, bounds.h/3-2);
                    else if(index === 8) people[i].layout(bounds.x+bounds.w/3+1, bounds.y+bounds.h*2/3+2, bounds.w/3-2, bounds.h/3-2);
                    index += 1;
                }
            }
        };
        shape.calculateWidthToBody = function() {
            var total = 0;
            for(var i=0; i<shape.backWeapons.length; i++)
                total = Math.max(total, shape.backWeapons[i].projectionDistance());
            if(shape.backDischargers.length > 0) total = Math.max(total, 15);

            return Math.max(-this.bodyStyle.getMinimumX(shape, 0, this.bodyWidth, this.heightToBody, this.bodyHeight),
                total)+2;
        };
        shape.hasSideTurret = function() {
            return shape.leftTurret || shape.rightTurret || shape.leftBackTurret || shape.rightBackTurret;
        };
        shape.backWheelsWider = function() {return false;};
        shape.frontWheelsWider = function() {return false;};
        shape.configureLayout = function(size) {
            var i, total;
            this.bodyWidth = size.width*105-5;
            this.bodyHeight = size.height*105/2+5;
            this.heightToBody = CWD.tireHeight;
            this.widthToBody = this.calculateWidthToBody();

            if(car.hasDoubleWheels())
                shape.heightToBody += CWD.tireHeight;
            if(shape.hasSideTurret() && this.car.type !== 'Trike') {
                if (car.hasDoubleWheels()) shape.heightToBody += 70 - 2 * CWD.tireHeight;
                else shape.heightToBody += 70 - CWD.tireHeight;
            }
            if(this.frontWheelsWider()) {
                if(this.car.frontWheelguards && this.car.frontWheelhubs) {
                    shape.heightToBody += CWD.wgHeight+CWD.whHeight;
                } else if(this.car.frontWheelguards || this.car.frontWheelhubs) {
                    shape.heightToBody += CWD.wgHeight;
                }
            } else if(this.backWheelsWider()) {
                if(this.car.backWheelguards && this.car.backWheelhubs) {
                    shape.heightToBody += CWD.wgHeight+CWD.whHeight;
                } else if(this.car.backWheelguards || this.car.backWheelhubs) {
                    shape.heightToBody += CWD.wgHeight;
                }
            } else {
                if(car.hasWheelguardsAndHubs()) {
                    shape.heightToBody += CWD.wgHeight+CWD.whHeight;
                } else if(car.hasWheelguardsOrHubs()) {
                    shape.heightToBody += CWD.wgHeight;
                }
            }
            total = 0;
            if(shape.leftWeapons) {
                for(i=0; i<shape.leftWeapons.length; i++)
                    total = Math.max(total, shape.leftWeapons[i].projectionDistance());
                for(i=0; i<shape.rightWeapons.length; i++)
                    total = Math.max(total, shape.rightWeapons[i].projectionDistance());
                if(shape.leftBackWeapons) {
                    for(i=0; i<shape.leftBackWeapons.length; i++)
                        total = Math.max(total, shape.leftBackWeapons[i].projectionDistance());
                    for(i=0; i<shape.rightBackWeapons.length; i++)
                        total = Math.max(total, shape.rightBackWeapons[i].projectionDistance());
                }
            }
            if(shape.leftDischargers.length > 0 || shape.rightDischargers.length > 0) total = Math.max(15, total);
            this.heightToBody = Math.max(this.heightToBody, total);

            shape.totalHeight = shape.heightToBody*2+shape.bodyHeight; // TODO: left/right weapons sticking out?
            // What is this?  Size of vehicle plus road lines and front/back padding???  Maybe for contains()??
            shape.w = shape.widthToBody+shape.bodyWidth+shape.frontGearWidth();
            shape.h = shape.heightToBody*2+shape.bodyHeight;
        };
        shape.findMinimumSize = function(size) {
            this.configureLayout(size);
            while(!this.layoutContents(size)) {
                if(size.width < 5) {
                    size.width += 1;
                } else if(size.width === 5) {
                    if(size.height === 4)
                        size.height = 6;
                    else
                        size.width = 6;
                } else if(size.width === 6 && size.height < 6) {
                    size.height = 6;
                } else if(size.width > 10) { // Some limit to prevent infinite recursion
                    console.log("Unable to fit everything in "+size.width+"x"+size.height+" grid!");
                    break;
                } else size.width += 1;
                this.configureLayout(size);
            }
            return size;
        };
        shape.layoutDischargers = function(sideBackOffset, sideFrontOffset, frontOffset, backOffset, frontYOffset,
                                           sideBackYOffset, sideFrontYOffset, thirdXOffset, thirdYOffset,
                                           fourthXOffset, fourthYOffset, fifthXOffset, fifthYOffset) {
            var i, limit;
            if(shape.frontDischargers.length > 0) {
                shape.frontDischargers[0].layout(shape.widthToBody+shape.bodyWidth+frontOffset,
                        shape.heightToBody+shape.bodyHeight/2-20+(frontYOffset ? frontYOffset : 0), 15, 40);
                for(i=1; i<shape.frontDischargers.length; i++) shape.frontDischargers[i].layout(-100, -100, 0, 0);
            }
            limit = shape.car.sideDischargerLimit();
            if(shape.leftDischargers.length > 0 && limit > 0)
                shape.leftDischargers[0].layout(sideBackOffset,
                        shape.heightToBody-15+(sideBackYOffset ? sideBackYOffset : 0), 40, 15);
            if(shape.leftDischargers.length > 1 && limit > 1)
                shape.leftDischargers[1].layout(sideFrontOffset,
                        shape.heightToBody-15+(sideFrontYOffset ? sideFrontYOffset : 0), 40, 15);
            if(shape.leftDischargers.length > 2 && limit > 2)
                shape.leftDischargers[2].layout(thirdXOffset,
                        shape.heightToBody-15+(thirdYOffset ? thirdYOffset : 0), 40, 15);
            if(shape.leftDischargers.length > 3 && limit > 3 && fourthXOffset)
                shape.leftDischargers[3].layout(fourthXOffset, shape.heightToBody-15+fourthYOffset, 40, 15);
            if(shape.leftDischargers.length > 4 && limit > 4 && fifthXOffset)
                shape.leftDischargers[4].layout(fifthXOffset, shape.heightToBody-15+fifthYOffset, 40, 15);
            for(i=limit; i<shape.leftDischargers.length; i++) shape.leftDischargers[i].layout(-100, -100, 0, 0);

            if(shape.rightDischargers.length > 0 && limit > 0)
                shape.rightDischargers[0].layout(sideBackOffset,
                        shape.heightToBody+shape.bodyHeight-(sideBackYOffset ? sideBackYOffset : 0), 40, 15);
            if(shape.rightDischargers.length > 1 && limit > 1)
                shape.rightDischargers[1].layout(sideFrontOffset,
                        shape.heightToBody+shape.bodyHeight-(sideFrontYOffset ? sideFrontYOffset : 0), 40, 15);
            if(shape.rightDischargers.length > 2 && limit > 2)
                shape.rightDischargers[2].layout(thirdXOffset,
                        shape.heightToBody+shape.bodyHeight-(thirdYOffset ? thirdYOffset : 0), 40, 15);
            if(shape.rightDischargers.length > 3 && limit > 3 && fourthXOffset)
                shape.rightDischargers[3].layout(fourthXOffset, shape.heightToBody+shape.bodyHeight-fourthYOffset, 40, 15);
            if(shape.rightDischargers.length > 4 && limit > 4 && fifthXOffset)
                shape.rightDischargers[4].layout(fifthXOffset, shape.heightToBody+shape.bodyHeight-fifthYOffset, 40, 15);
            for(i=limit; i<shape.rightDischargers.length; i++) shape.rightDischargers[i].layout(-100, -100, 0, 0);

            if(shape.backDischargers.length > 0) {
                shape.backDischargers[0].layout(shape.widthToBody+backOffset-15,
                        shape.heightToBody+shape.bodyHeight/2-20, 15, 40);
                for(i=1; i<shape.backDischargers.length; i++) shape.backDischargers[i].layout(-100, -100, 0, 0);
            }
        };
        shape.layoutTurrets = function(size, sideOffset, centerOffset) {
            shape.layout3Turrets(size, sideOffset, centerOffset, shape.leftTurret, shape.rightTurret, shape.topTurret);
        };
        shape.layout3Turrets = function(size, sideOffset, centerOffset, leftTurret, rightTurret, topTurret) {
            var i, j, total, weapons, boosters, gunner;
            if(leftTurret) {
                weapons = leftTurret === shape.leftTurret ? shape.leftTurretWeapons : shape.leftBackTurretWeapons;
                boosters = leftTurret === shape.leftTurret ? shape.leftTurretBoosters : shape.leftBackTurretBoosters;
                leftTurret.layout(sideOffset, shape.heightToBody+shape.bodyHeight/2-centerOffset-60, 100, 60);
                if(weapons.length > 0 || boosters.length > 0) {
                    total = (leftTurret.h-10)/(weapons.length+boosters.length);
                    for(i=0; i<weapons.length; i++) {
                        weapons[i].layout(
                                leftTurret.x+5,leftTurret.y+5+i*total, leftTurret.w-10, Math.min(total, weapons[i].maxHeight)
                        );
                    }
                    j=i;
                    for(i=0; i<boosters.length; i++) {
                        boosters[i].layout(
                                leftTurret.x+5, leftTurret.y+5+i*total+j*total, leftTurret.w-10, total
                        );
                    }
                }
            }
            if(rightTurret) {
                weapons = rightTurret === shape.rightTurret ? shape.rightTurretWeapons : shape.rightBackTurretWeapons;
                boosters = rightTurret === shape.rightTurret ? shape.rightTurretBoosters : shape.rightBackTurretBoosters;
                rightTurret.layout(sideOffset, shape.heightToBody+shape.bodyHeight/2+centerOffset, 100, 60);
                if(weapons.length > 0 || boosters.length > 0) {
                    total = (rightTurret.h-10)/(weapons.length+boosters.length);
                    for(i=0; i<weapons.length; i++) {
                        weapons[i].layout(
                                rightTurret.x+5, rightTurret.y+5+i*total, rightTurret.w-10, Math.min(total, weapons[i].maxHeight)
                        );
                    }
                    j=i;
                    for(i=0; i<boosters.length; i++) {
                        boosters[i].layout(
                                rightTurret.x+5, rightTurret.y+5+i*total+j*total, rightTurret.w-10, total
                        );
                    }
                }
            }

            weapons = topTurret === shape.topTurret ? shape.topTurretWeapons : shape.topBackTurretWeapons;
            boosters = topTurret === shape.topTurret ? shape.topTurretBoosters : shape.topBackTurretBoosters;
            gunner = topTurret === shape.topTurret ? shape.topTurretGunner : shape.topBackTurretGunner;
            if(weapons.length > 0 || boosters.length > 0 || gunner) {
                total = (topTurret.h-10)/(weapons.length+boosters.length+(gunner ? 1 : 0));
                for(i=0; i<weapons.length; i++) {
                    weapons[i].layout(
                            topTurret.x+5, topTurret.y+5+i*total, topTurret.w-10, Math.min(total, weapons[i].maxHeight)
                    );
                }
                j=i;
                for(i=0; i<boosters.length; i++) {
                    boosters[i].layout(
                            topTurret.x+5, topTurret.y+5+j*total+i*total, topTurret.w-10, total
                    );
                }
                j+=i;
                if(gunner) {
                    var gunnerWidth = topTurret.w-10;
                    if(total < gunnerWidth-10) gunnerWidth = (gunnerWidth+total)/2;
                    gunner.layout(topTurret.x+(topTurret.w-gunnerWidth)/2, topTurret.y+5+j*total, gunnerWidth, total);
                }
            }
        };
        shape.frontGearWidth = function() {
            var total = 0;
            for(var i=0; i<shape.frontWeapons.length; i++)
                total = Math.max(total, shape.frontWeapons[i].projectionDistance());
            if(shape.frontDischargers.length > 0) total = Math.max(15, total);
            if(((shape.car.ramplate || shape.car.fakeRamplate) && shape.bodyStyle.hoverRamplate)
                || (shape.bumperSpikes && shape.bodyStyle.hoverFrontSpikes))
                total = Math.max(total, shape.bodyStyle.ramplateWidth);
            if(shape.airdam && shape.bodyStyle.hoverAirdam)
                total = Math.max(total, 37);
            return Math.max(total, shape.bodyStyle.frontHoverPadding(shape));
        };
        shape.layoutToolbars = function() {
            shape.maximumX = shape.widthToBody+shape.bodyWidth+shape.frontGearWidth();

            shape.phantomShapes.frontWeapons.layout(shape.widthToBody+shape.bodyWidth-60,
                    shape.heightToBody+20, 40, shape.bodyHeight-40);
            shape.phantomShapes.frontArmor.layout(shape.widthToBody+shape.bodyWidth-20,
                    shape.heightToBody+20, 20, shape.bodyHeight-40);
            if(shape.phantomShapes.backWeapons)
                shape.phantomShapes.backWeapons.layout(shape.widthToBody+20,
                        shape.heightToBody+20, 40, shape.bodyHeight-40);
            shape.phantomShapes.backArmor.layout(shape.widthToBody,
                    shape.heightToBody+20, 20, shape.bodyHeight-40);
            if(shape.phantomShapes.leftWeapons) {
                shape.phantomShapes.leftWeapons.layout(shape.widthToBody+20,
                        shape.heightToBody+20, shape.bodyWidth-40, 40);
                shape.phantomShapes.leftArmor.layout(shape.widthToBody+20,
                    shape.heightToBody, shape.bodyWidth-40, 20);
                shape.phantomShapes.rightWeapons.layout(shape.widthToBody+20,
                        shape.heightToBody+shape.bodyHeight-60,
                        shape.bodyWidth-40, 40);
                shape.phantomShapes.rightArmor.layout(shape.widthToBody+20,
                        shape.heightToBody+shape.bodyHeight-20, shape.bodyWidth-40, 20);
            }
            shape.phantomShapes.body.layout(shape.widthToBody+60, shape.heightToBody+60,
                    shape.bodyWidth-120, shape.bodyHeight-120);
        };

        shape.hoverText = "Vehicle Information";

        return shape;
    };
})();



// ROAD LINES  --------------------------------------
//if(!carOnly) {
//    ctx.fillStyle = 'WhiteSmoke';
//    if(this.car.sidecar || this.suppressDrawing) {
//        ctx.fillRect(0, this.totalHeight/2-10, 100, 20);
//        ctx.fillRect(300, this.totalHeight/2-10, 100, 20);
//        ctx.fillRect(600, this.totalHeight/2-10, 100, 20);
//    } else {
//        ctx.fillRect(0, this.totalHeight/2-10, this.widthToBody/2,20);
//        ctx.fillRect(this.widthToBody+this.bodyWidth, this.totalHeight/2-10, 40, 20);
//        ctx.fillRect(ctx.canvas.width-20, this.totalHeight/2-10, 20, 20);
//    }
//    ctx.fillRect(0, 0, ctx.canvas.width, 20);
//    ctx.fillRect(0, this.totalHeight-20, ctx.canvas.width, 20);
//    ctx.closePath();
//}

//shape.componentArmorRepair = function(data, name, componentArmor, damage, mechanicLevel, bonus) {
//    this.armorRepair(data, name, componentArmor.totalCost(), componentArmor,
//            componentArmor.plasticPoints > 0 ? damage : 0, componentArmor.metalPoints > 0 ? damage : 0,
//        mechanicLevel, bonus);
//};
//shape.armorRepair = function(data, name, originalArmorCost, armorTypes, plasticDamage, metalDamage, mechanicLevel, bonus) {
//    var plasticCost = armorTypes.plasticType ? 50*("repairFactor" in armorTypes.plasticType ? armorTypes.plasticType.repairFactor : armorTypes.plasticType.costFactor)*plasticDamage : 0;
//    var metalCost = armorTypes.metalType ? 50*armorTypes.metalType.costFactor*metalDamage : 0;
//    var replaceCost = Math.ceil(originalArmorCost*1.1-0.0001);
//    if(replaceCost < plasticCost+metalCost)
//        this.includeRepair2(data, name, {repairCost: replaceCost}, replaceCost, 0, mechanicLevel, bonus, "Impossible", plasticDamage+metalDamage, true);
//    else {
//        if(plasticDamage > 0)
//            this.includeRepair2(data, name+(metalDamage > 0 ? " (Plastic)" : ""), {repairCost: plasticCost}, replaceCost, 0, mechanicLevel, bonus, "Medium", plasticDamage, true);
//        if(metalDamage > 0)
//            this.includeRepair2(data, name+(plasticDamage > 0 ? " (Metal)" : ""), {repairCost: metalCost}, replaceCost, 0, mechanicLevel, bonus, "Medium", metalDamage, true);
//    }
//};
//shape.includeRepair = function(data, name, item, mechanicLevel, bonus, difficulty, damage) {
//    this.includeRepair2(data, name, item, item.totalCost(), item.ownDP(), mechanicLevel, bonus, difficulty, damage, false);
//};
//shape.includeRepair2 = function(data, name, item, totalCost, totalDP, mechanicLevel, bonus, difficulty, damage, isArmor) {
//    var i, rollCount;
//    var repairCost = "repairCost" in item ? item.repairCost : CW.repairCost(totalCost, totalDP, damage);
//    var canRepair = difficulty !== 'Impossible' && repairCost < totalCost;
//    data.totalCost += canRepair ? repairCost : totalCost;
//    data.partsCost += item.nonVehicular || !canRepair ? totalCost : Math.ceil(repairCost*2/3-0.0001);
//    var salvage = repairCost < totalCost && !isArmor ? Math.floor((totalCost-repairCost)/2+0.0001) : 0;
//    data.salvagePrice += canRepair ? 0 : salvage;
//    var time = 0;
//    var mechanicRoll = 99;
//    var rolls = [];
//    if(canRepair) {
//        rollCount = isArmor ? Math.ceil(damage/3-0.0001) : damage;
//        for(i=0; i<rollCount; i++) {
//            time += CW.expectedTime(mechanicRoll = CW.mechanicRoll(mechanicLevel, bonus, difficulty));
//        }
//        rolls.push(rollCount > 1 ? mechanicRoll+" (x"+rollCount+")" : mechanicRoll);
//    } else if(!item.nonVehicular) {
//        // Remove (salvage) the old item
//        if("electric" in item) time += CW.expectedTime(mechanicRoll = CW.mechanicRoll(mechanicLevel, bonus, 'Medium'));
//        else if(item.type === 'Tire') time += CW.expectedTime(mechanicRoll = CW.mechanicRoll(mechanicLevel, bonus, 'Trivial'));
//        else time += CW.expectedTime(mechanicRoll = CW.mechanicRoll(mechanicLevel, bonus, 'Easy'));
//        rolls.push(mechanicRoll);
//        // Install the new item
//        if(item.type === 'Tire')
//            time += CW.expectedTime(mechanicRoll = CW.mechanicRoll(mechanicLevel, bonus, 'Trivial'));
//        else if(difficulty === 'Impossible') // Impossible to repair, but now we're replacing instead
//            time += CW.expectedTime(mechanicRoll = CW.mechanicRoll(mechanicLevel, bonus, 'Medium'));
//        else
//            time += CW.expectedTime(mechanicRoll = CW.mechanicRoll(mechanicLevel, bonus, difficulty));
//        rolls.push(mechanicRoll);
//    }
//    if(mechanicLevel === 3) time = time/2;
//    time = Math.round(time*100)/100;
//    data.repairTime += time;
//    data.items.push({item: name, damage: damage, repair: canRepair, salvage: canRepair ? 0 : salvage,
//        cost: canRepair ? repairCost : totalCost, difficulty: difficulty, rolls: rolls, time: time});
//};
//shape.includeAmmoRefill = function(data, name, cost, mechanicLevel, bonus) {
//    data.totalCost += cost;
//    data.partsCost += cost;
//    data.salvagePrice = 0;
//    var mechanicRoll = CW.mechanicRoll(mechanicLevel, bonus, 'Trivial');
//    var time = CW.expectedTime(mechanicRoll);
//    if(mechanicLevel === 3) time = time/2;
//    time = Math.round(time*100)/100;
//    data.repairTime += time;
//    data.items.push({item: name, damage: 0, repair: false, salvage: 0, cost: cost, difficulty: 'Trivial', rolls: [mechanicRoll], time: time});
//};
//
//shape.repairWeapons = function(data, weapons, mechanicLevel, bonus) {
//    var i, j;
//    for(i=0; i<weapons.length; i++) {
//        if(weapons[i].damage > 0) {
//            if(weapons[i].damage > weapons[i].caDamage)
//                this.includeRepair(data, weapons[i].hoverText, weapons[i].weapon, mechanicLevel, bonus,
//                        weapons[i].weapon.isRocket() || weapons[i].weapon.isLaser() ? "Hard" : "Medium",
//                        weapons[i].damage-weapons[i].caDamage);
//            if(weapons[i].caDamage > 0)
//                this.componentArmorRepair(data, weapons[i].weapon.abbv+" CA", weapons[i].weapon.componentArmor,
//                    weapons[i].caDamage, mechanicLevel, bonus);
//        }
//        for(j=0; j<weapons[i].weapon.ammo.length; j++) {
//            if(weapons[i].ammoUsed && weapons[i].ammoUsed.length > j && weapons[i].ammoUsed[j] > 0)
//                this.includeAmmoRefill(data, weapons[i].ammoUsed[j]+" shots "+weapons[i].weapon.abbv+" "+weapons[i].weapon.ammo[j].modifiedName(true),
//                    Math.ceil(weapons[i].ammoUsed[j]*weapons[i].weapon.ammo[j].modifiedCost()-0.0001),
//                    mechanicLevel, bonus);
//        }
//    }
//};
//shape.repairDischargers = function(data, weapons, mechanicLevel, bonus) {
//    for(var i=0; i<weapons.length; i++) {
//        if(weapons[i].destroyed)
//            this.includeRepair(data, weapons[i].hoverText, weapons[i].weapon, mechanicLevel, bonus, "Impossible", 0);
//    }
//};
//
//shape.clearWeaponRepair = function(list) {
//    for(var i=0; i<list.length; i++) {
//        if("destroyed" in list[i]) list[i].destroyed = false;
//        else if("damage" in list[i]) {
//            list[i].damage = 0;
//            list[i].caDamage = 0;
//            list[i].ammoUsed = [];
//        }
//    }
//};
//shape.baseClearRepairs = function() {
//    var i;
//    if(shape.engine) {
//        shape.engine.damage = 0;
//        shape.engine.caDamage = 0;
//    }
//    for(i=0; i<shape.crew.length; i++) {
//        shape.crew[i].damage = 0;
//        shape.crew[i].caDamage = 0;
//        shape.crew[i].baDamage = 0;
//    }
//    this.damagedArmor = [];
//    this.clearWeaponRepair(this.frontWeapons);
//    this.clearWeaponRepair(this.leftWeapons);
//    this.clearWeaponRepair(this.rightWeapons);
//    this.clearWeaponRepair(this.backWeapons);
//    this.clearWeaponRepair(this.topWeapons);
//    this.clearWeaponRepair(this.underbodyWeapons);
//    this.clearWeaponRepair(this.frontDischargers);
//    this.clearWeaponRepair(this.leftDischargers);
//    this.clearWeaponRepair(this.rightDischargers);
//    this.clearWeaponRepair(this.backDischargers);
//    this.clearWeaponRepair(this.topDischargers);
//    this.clearWeaponRepair(this.underbodyDischargers);
//    for(i=0; i<shape.frontWheelguards.length; i++) shape.frontWheelguards.damage = 0;
//    for(i=0; i<shape.frontWheelhubs.length; i++) shape.frontWheelhubs.damage = 0;
//    for(i=0; i<shape.backWheelguards.length; i++) shape.backWheelguards.damage = 0;
//    for(i=0; i<shape.backWheelhubs.length; i++) shape.backWheelhubs.damage = 0;
//    for(i=0; i<shape.middleWheelguards.length; i++) shape.middleWheelguards.damage = 0;
//    for(i=0; i<shape.middleWheelhubs.length; i++) shape.middleWheelhubs.damage = 0;
//    for(i=0; i<shape.accessories.length; i++) shape.accessories[i].damage = 0;
//};
//shape.baseRepair = function(mechanicLevel, bonus) {
//    var i, crew, cost, dp, result = {totalCost: 0, partsCost: 0, salvagePrice: 0, repairTime: 0, items: []};
//    if(shape.engine && shape.engine.damage > 0) {
//        if(shape.engine.damage > shape.engine.caDamage) {
//            this.includeRepair2(result, "Engine", shape.car.engine, shape.car.engine.engineOnlyCost(), shape.car.engine.ownDP(), mechanicLevel, bonus, 'Hard', shape.engine.damage-shape.engine.caDamage, false);
//            for(i=shape.car.engine.ownDP(); i<shape.engine.damage-shape.engine.caDamage; i++) {
//                this.includeRepair2(result, "Laser Battery", {}, 500, 1, mechanicLevel, bonus, "Medium", 1, false);
//            }
//            if(shape.engine.damage-shape.engine.caDamage >= shape.car.engine.ownDP()+shape.car.engine.laserBatteries
//                && !shape.car.getAccessory(CW.accessories.SURGE_PROTECTOR)) {
//                for(i=0; i<shape.crew.length; i++) {
//                    if(shape.crew[i].crew.currentComputer())
//                        this.includeRepair2(result, shape.crew[i].crew.name+" "+shape.crew[i].crew.currentComputerName(),
//                            {}, shape.crew[i].crew.currentComputerCost(), 0, mechanicLevel, bonus,
//                            "Impossible", 0, false);
//                }
//                for(i=0; i<shape.car.accessories.length; i++) {
//                    if(shape.car.accessories[i].destroyedWithPlant)
//                        this.includeRepair2(result, shape.car.accessories[i].textDescription(), {}, shape.car.accessories[i].totalCost(),
//                            0, mechanicLevel, bonus, "Medium", 0, false);
//                }
//            }
//        }
//        if(shape.engine.caDamage > 0)
//            this.componentArmorRepair(result, "Engine CA", shape.car.engine.componentArmor, shape.engine.caDamage, mechanicLevel, bonus);
//    }
//    for(i=0; i<this.crew.length; i++) {
//        crew = this.crew[i];
//        if(crew.caDamage) this.componentArmorRepair(result, crew.crew.name+" CA", crew.crew.componentArmor,
//            crew.caDamage, mechanicLevel, bonus);
//        if(crew.baDamage) {
//            cost = crew.crew.currentBodyArmorCost();
//            dp = crew.crew.currentBodyArmorDP();
//            this.includeRepair2(result, crew.crew.name+" "+crew.crew.currentBodyArmorAbbv(),
//                {nonVehicular: true}, cost, dp, mechanicLevel, bonus, "Impossible", crew.baDamage, true);
//        }
//    }
//    this.repairWeapons(result, this.frontWeapons, mechanicLevel, bonus);
//    this.repairDischargers(result, this.frontDischargers, mechanicLevel, bonus);
//    this.repairWeapons(result, this.backWeapons, mechanicLevel, bonus);
//    this.repairDischargers(result, this.backDischargers, mechanicLevel, bonus);
//    this.repairWeapons(result, this.leftWeapons, mechanicLevel, bonus);
//    this.repairDischargers(result, this.leftDischargers, mechanicLevel, bonus);
//    this.repairWeapons(result, this.rightWeapons, mechanicLevel, bonus);
//    this.repairDischargers(result, this.rightDischargers, mechanicLevel, bonus);
//    this.repairWeapons(result, this.topWeapons, mechanicLevel, bonus);
//    this.repairDischargers(result, this.topDischargers, mechanicLevel, bonus);
//    this.repairWeapons(result, this.underbodyWeapons, mechanicLevel, bonus);
//    this.repairDischargers(result, this.underbodyDischargers, mechanicLevel, bonus);
//    var plastic = 0, metal = 0;
//    for(i=0; i<this.damagedArmor.length; i++) {
//        plastic += this.damagedArmor[i].plasticDamage;
//        metal += this.damagedArmor[i].metalDamage;
//    }
//    this.armorRepair(result, "Armor", this.car.totalArmorCost(), this.car.frontArmor, plastic, metal, mechanicLevel, bonus);
//    var armorDamage = this.findArmorDamage(this.frontArmor);
//    if(armorDamage.plasticDamage >= this.car.frontArmor.plasticPoints && armorDamage.metalDamage >= this.car.frontArmor.metalArmorPoints()) {
//        if(this.car.ramplate) this.includeRepair2(result, "Ramplate", {}, this.car.ramplateCost(), 0, mechanicLevel, bonus, "Impossible", 0, false);
//        else if(this.car.fakeRamplate) this.includeRepair2(result, "Fake Ramplate", {}, this.car.fakeRamplateCost(), 0, mechanicLevel, bonus, "Impossible", 0, false);
//        else if(this.car.brushcutter) this.includeRepair2(result, "Fake Ramplate", {}, 100, 0, mechanicLevel, bonus, "Impossible", 0, false);
//        else if(this.car.bumperSpikes) this.includeRepair2(result, "Bumper Spikes", {}, this.car.fakeRamplateCost(), 0, mechanicLevel, bonus, "Impossible", 0, false);
//        if(this.car.airdam) this.includeRepair2(result, "Airdam", {}, this.car.airdamCost, 0, mechanicLevel, bonus, "Impossible", 0, false);
//    }
//    armorDamage = this.findArmorDamage(this.backArmor);
//    if(armorDamage.plasticDamage >= this.car.backArmor.plasticPoints && armorDamage.metalDamage >= this.car.backArmor.metalArmorPoints()) {
//        if(this.car.spoiler) this.includeRepair2(result, "Spoiler", {}, this.car.spoilerCost, 0, mechanicLevel, bonus, "Impossible", 0, false);
//        if(this.car.backBumperSpikes) this.includeRepair2(result, "Back Bumper Spikes", {}, this.car.fakeRamplateCost(), 0, mechanicLevel, bonus, "Impossible", 0, false);
//    }
//    for(i=0; i<this.accessories.length; i++) {
//        if(this.accessories[i].damage > 0) {
//            if(this.accessories[i].item.type === 'Tire')
//                this.includeRepair(result, "Spare Tire", this.accessories[i].item, mechanicLevel, bonus, "Impossible", this.accessories[i].damage);
//            else
//                this.includeRepair(result, this.accessories[i].item.name, this.accessories[i].item, mechanicLevel, bonus, "Medium", this.accessories[i].damage);
//        }
//    }
//
//    return result;
//};
//
//shape.armorDamage = function(armor, plastic, metal) {
//    var entry;
//    for (var i = 0; i < shape.damagedArmor.length; i++) {
//        var test = shape.damagedArmor[i];
//        if(test.armor === armor) {
//            entry = test;
//            break;
//        }
//    }
//    if(!entry) {
//        entry = {armor: armor, plasticDamage: 0, metalDamage: 0};
//        shape.damagedArmor.push(entry);
//    }
//    if(plastic !== null) entry.plasticDamage = plastic;
//    if(metal !== null) entry.metalDamage = metal;
//};
//shape.findArmorDamage = function(armor) {
//    for (var i = 0; i < shape.damagedArmor.length; i++) {
//        var test = shape.damagedArmor[i];
//        if(test.armor === armor) return test.plasticDamage > 0 ? test.plasticDamage : test.metalDamage;
//    }
//    return 0;
//};
//shape.findPlasticArmorDamage = function(armor) {
//    for (var i = 0; i < shape.damagedArmor.length; i++) {
//        var test = shape.damagedArmor[i];
//        if(test.armor === armor) return test.plasticDamage;
//    }
//    return 0;
//};
//shape.findMetalArmorDamage = function(armor) {
//    for (var i = 0; i < shape.damagedArmor.length; i++) {
//        var test = shape.damagedArmor[i];
//        if(test.armor === armor) return test.metalDamage;
//    }
//    return 0;
//};
