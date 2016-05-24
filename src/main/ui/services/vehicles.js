/* global angular, CW */
angular.module('carwars').
    factory('vehicle', function($rootScope) {
        "use strict";
        var buildWeaponList = function(list) {
            var result = "";
            for(var i=0; i<list.length; i++) {
                if(i>0) result += ", ";
                result += list[i].abbv;
                if(list[i].count > 1) result += "x"+list[i].count;
            }
            return result;
        };
        var checkTurretLocation = function(currentWeapon, turret, testTurret, name, carrier, sidecar) {
            if(turret === testTurret) {
                currentWeapon.location = name;
                currentWeapon.carrier = carrier;
                currentWeapon.sidecar = sidecar;
            }
        };
        var turretAvailable = function(cost, space, size, limit) {
            if(limit === undefined) limit = 99;
            for(var i=size; i>= 0; i--) {
                if(cost[i] > 0 && space[i] <= limit) return i;
            }
            return -1;
        };
        var addTurretIf = function(result, config, max, space, carTechLevel) {
            var size = turretAvailable(config.costBySize, config.spaceBySize, max);
            if(size > -1)
                result.push({
                    name: config.name,
                    max: size,
                    range: size > config.smallest,
                    cost: config.costBySize[size],
                    weight: config.weightBySize[size],
                    disabled: config.spaceBySize[config.smallest] > space ||
                        ((config.techLevel === 'CWC' || size === 0) && carTechLevel === 'Classic') ||
                        (config.techLevel === 'UACFH' && (carTechLevel === 'Classic' || carTechLevel === 'CWC'))
                });
        };
        var nextTireProtection = function(car, property) {
            var armor = car[property];
            if(!armor) {
                car[property] = CW.createWheelArmor(car.frontArmor.plasticType, car.frontArmor.metalType, /hub/.test(property));
                armor = car[property];
                if((/ront/.test(property) && (this.isCycle() || this.isNormalTrike())) ||
                    (/ack/.test(property) && (this.isCycle() || this.isReversedTrike()))
                    || /Sidecar/.test(car.name)) armor.motorcycle = true; // TODO: should sidecars use cycle guards/hubs or not?
                if(this.car.techLevel === 'Classic') {
                    if(armor.plasticType) armor.plasticPoints = 1;
                    else if(armor.metalType) armor.metalPoints = 1;
                } else armor.fake = true;
                if(/back/.test(property) && car.middleOrOuterTires && car.thirdRowTiresInMiddle)
                    car[property.replace('back','middle')] = armor; // TODO: allow them to be separate
            } else if(armor.fake) {
                armor.fake = false;
                if(armor.plasticType) armor.plasticPoints = 1;
                else if(armor.metalType) armor.metalPoints = 1;
            } else if(armor.plasticPoints > 0 && armor.plasticPoints < Math.floor(10/armor.plasticType.weightFactor)) {
                armor.plasticPoints += 1;
            } else if(armor.metalPoints > 0 && armor.metalPoints < Math.floor(10/armor.metalType.weightFactor)) {
                armor.metalPoints += 1;
            }
            car.recalculate();
        };
        var previousTireProtection = function(car, property) {
            var armor = car[property];
            if(armor === null) return;
            if(armor.fake || (this.car.techLevel === 'Classic' && (/hub/.test(property) || armor.plasticPoints === 1 || armor.metalPoints === 1))) {
                car[property] = null;
                if(/back/.test(property)) car[property.replace('back','middle')] = null;
            } else if(armor.plasticPoints === 1 || armor.metalPoints === 1) {
                armor.plasticPoints = 0;
                armor.metalPoints = 0;
                armor.fake = true;
            } else if(armor.plasticPoints > 1) {
                armor.plasticPoints -= 1;
            } else if(armor.metalPoints > 1) {
                armor.metalPoints -= 1;
            }
            car.recalculate();
        };
        var roundIfNeeded = function(source) {
            if(source.toString().indexOf('.') < 0) return source;
            var fixed = source.toFixed(2);
            return fixed.indexOf(".00") > -1 ? parseInt(fixed) : fixed;
        };

        return {
            car: null,
            createNewCar: function () {
                this.car = CW.createCar();
            },
            createNewCycle: function () {
                this.car = CW.createCycle();
            },
            createNewTrike: function () {
                this.car = CW.createTrike();
            },
            createNewTenWheeler: function () {
                this.car = CW.createTenWheeler();
            },
            createNewCarTrailer: function () {
                this.car = CW.createCarTrailer();
            },
            createNewBus: function () {
                this.car = CW.createBus();
            },
            createNewSemiTrailer: function () {
                this.car = CW.createSemiTrailer();
            },
            createNewSemiTractor: function () {
                this.car = CW.createSemiTractor();
            },
            recalculate: function () {
                this.car.recalculate();
            },
            techLevel: function (value) {
                if(value) {
                    this.car.techLevel = value;
                    if(this.car.carrier) this.car.carrier.techLevel = value;
                }
                return this.car.techLevel;
            },
            techLevelIsClassic: function () {
                return this.car.techLevel === 'Classic';
            },
            techLevelIsCWC: function () {
                return this.car.techLevel === 'CWC';
            },
            textWithIllegal: function() {
                return this.car.designName + " -- " + (this.car.legal ? "" : "ILLEGAL DESIGN -- ") + this.car.textDescription(true);
            },
            isLegal: function() {
                return this.car.legal;
            },
            spaceUsed: function () {
                return this.car.spaceUsed;
            },
            carrierSpaceUsed: function () {
                return this.car.carrier.spaceUsed;
            },
            spaceRemaining: function () {
                return roundIfNeeded(this.car.modifiedSpaceAvailable - this.car.spaceUsed);
            },
            carrierSpaceRemaining: function () {
                return roundIfNeeded(this.car.carrier ? this.car.carrier.modifiedSpaceAvailable - this.car.carrier.spaceUsed : 0);
            },
            sidecarSpaceRemaining: function () {
                return roundIfNeeded(this.car.sidecar ? this.car.sidecar.spaceAvailable()-this.car.sidecar.spaceUsed() : 0);
            },
            cargoSpaceRemaining: function () { // Includes regular AND cargo space
                return this.spaceRemaining() + this.car.modifiedCargoSpaceAvailable - this.car.cargoSpaceUsed;
            },
            carrierCargoSpaceRemaining: function () {
                return this.car.carrier ?
                    this.carrierSpaceRemaining() + this.car.carrier.modifiedCargoSpaceAvailable - this.car.carrier.cargoSpaceUsed
                    : 0;
            },
            totalCost: function() {
                return this.car.totalCost+(this.car.sidecar ? this.car.sidecar.totalCost() : 0);
            },
            checkEngine: function() {
                if(!this.hasEngine()) return false;
                if(this.hasSidecar())
                    return this.engine().totalPowerFactors()*3 < this.car.body.maxWeight + this.car.sidecar.maxWeight ? this.car.body.maxWeight + this.car.sidecar.maxWeight - this.engine().totalPowerFactors()*3 : 0;
                return this.car.maxEffectiveWeight < this.car.modifiedMaxWeight ? this.car.modifiedMaxWeight - this.car.maxEffectiveWeight : 0;
            },
            maxWeaponSpacesPerSide: function (arg) {
                if (arg) {
                    if (arg.carrier) return this.car.carrier.maxWeaponSpacesPerSide;
                    if (arg.sidecar) return this.car.sidecar.spaceAvailable();
                }
                return this.car.maxWeaponSpacesPerSide;
            },
            isRaceCar: function () {
                return this.isCar() && this.car.body.racingFrame ? true : false;
            },
            isBus: function () {
                return this.car.type === 'Bus';
            },
            isCarTrailer: function () {
                return this.car.type === 'CarTrailer';
            },
            isCar: function () {
                return this.car.type === 'Car';
            },
            isCycle: function () {
                return this.car.type === 'Cycle';
            },
            hasSidecar: function() {
                return this.isCycle() && this.car.sidecar;
            },
            hasCarrier: function() {
                return this.isTenWheeler() && this.car.carrier;
            },
            isTrike: function () {
                return this.car.type === 'Trike';
            },
            isNormalTrike: function () {
                return this.isTrike() && !this.car.reversed;
            },
            isReversedTrike: function () {
                return this.isTrike() && this.car.reversed;
            },
            isSemiTractor: function () {
                return this.car.type === 'SemiTractor';
            },
            isSemiTrailer: function () {
                return this.car.type === 'SemiTrailer';
            },
            isTenWheeler: function () {
                return this.car.type === 'TenWheeler';
            },
            isDragster: function () {
                return this.isRaceCar() && this.car.body.name === CW.carBody.DRAGSTER.name;
            },
            isFunnyCar: function () {
                return this.isRaceCar() && this.car.body.name === CW.carBody.FUNNY_CAR.name;
            },
            isTruck: function () {
                return this.car.engine && this.car.engine.truck;
            },
            isFlatbed: function() { // NOT including 10-wheelers with flatbed carriers
                return (this.isCarTrailer() || this.isSemiTrailer()) && this.car.isFlatbed();
            },
            isDumper: function() { // NOT including 10-wheelers with dumper carriers
                return (this.isCarTrailer() || this.isSemiTrailer()) && this.car.isDumper();
            },
            isVan: function() { // NOT including 10-wheelers with dumper carriers
                return (this.isCarTrailer() || this.isSemiTrailer()) && this.car.isVan();
            },
            carrierBody: function() {
                if(!this.isTenWheeler()) return null;
                return this.car.carrier.body.name.substr(this.car.carrier.body.name.indexOf(' ')+1);
            },
            isOversize: function () {
                return this.car.isOversize();
            },
            hasOversizeWeaponFacings: function () { // False for an oversize flatbed with 6-facing armored box
                return this.car.hasOversizeWeaponFacings();
            },
            sixWheelChoice: function () {
                return this.isCar() && !this.sixWheeledChassisRequired() &&
                    this.car.body.name !== CW.carBody.subcompact.name &&
                    this.car.body.name !== CW.carBody.compact.name;
            },
            sixWheeledChassisRequired: function () {
                return this.isCar() && this.car.sixWheeledChassisRequired();
            },
            hasSixWheeledChassis: function () {
                return this.isCar() && this.car.middleTireCount() > 0;
            },
            setSixWheelChassis: function (six) {
                if (six) {
                    if (!this.car.middleOrOuterTires)
                        this.car.addThirdRowTires();
                } else {
                    if (this.car.middleOrOuterTires)
                        this.car.removeThirdRowTires();
                }
            },
            bodyOptions: function() {
                return this.car.bodyOptions();
            },
            setBody: function(bodyName) {
                this.car.setBody(bodyName);
            },
            nextBody: function () {
                if (this.isRaceCar()) this.car.nextRacingBody();
                else this.car.nextBody();
            },
            previousBody: function () {
                if (this.isRaceCar()) this.car.previousRacingBody();
                else this.car.previousBody();
            },
            nextChassis: function () {
                this.car.nextChassis();
            },
            previousChassis: function () {
                this.car.previousChassis();
            },
            nextSuspension: function () {
                this.car.nextSuspension();
            },
            previousSuspension: function () {
                this.car.previousSuspension();
            },
            suspensionHC: function () {
                var hc = this.car.suspension.hc;
                if (this.isCar()) {
                    if (this.car.body.name === 'Subcompact') hc += 1;
                    if (this.car.body.name === 'Van' || this.car.body.name === 'Pickup' || this.car.body.name === 'Camper')
                        hc -= 1;
                }
                if (this.isReversedTrike()) hc += 1;
                return hc;
            },
            bodySpaces: function () {
                return this.car.initialSpaces();
            },
            bodyCargoSpaces: function () {
                return this.car.body.cargoSpaces;
            },
            bodyOneThirdSpaces: function () { // For the body screen; not taking e.g. streamlining into account
                if(this.isCycle() || this.isFlatbed() ||
                    (this.isCarTrailer() && this.car.body.name === CW.carTrailerBody.mini_van.name)) return 0;
                return Math.floor((this.bodySpaces() + this.bodyCargoSpaces()) / 3 + 0.0001);
            },
            bodyMaxWeight: function () {
                return this.car.body.maxWeight;
            },
            hasEngine: function () {
                return this.car.engine ? true : false;
            },
            hasGasEngine: function () {
                return this.hasEngine() && !this.car.engine.electric;
            },
            possibleTotalWeight: function () {
                if (this.isTruck()) return this.car.modifiedMaxWeight;
                return this.car.modifiedMaxWeight + (this.car.sidecar ? this.car.sidecar.maxWeight : 0);
            },
            engineCapacity: function () {
                if (this.isTruck()) return this.car.engine.modifiedMaxLoad();
                return this.car.engine.totalPowerFactors() * (this.car.heavyDutyTransmission ? 6 : 3);
            },
            enginePowerRating: function () {
                if (this.isTruck()) return null;
                return this.car.enginePowerRating;
            },
            engine: function () {
                return this.car.engine;
            },
            gasTank: function () {
                return this.car.gasTank;
            },
            nextEngine: function () {
                this.car.nextEngine();
            },
            previousEngine: function () {
                this.car.previousEngine();
            },
            changeToGasEngine: function (accel, topSpeed, range) {
                if (this.car.engine.truck) {
                    this.updateEngine(1, 1, 1, false);
                } else {
                    this.updateEngine(accel, topSpeed, range, false) || this.updateEngine(5, 60, 150, false);
                }
            },
            changeToElectricEngine: function (accel, topSpeed, range) {
                if (this.car.engine.truck) {
                    this.updateEngine(1, 1, 1, true);
                } else {
                    this.updateEngine(accel, topSpeed, range, true) || this.updateEngine(5, 90, 150, true);
                }
            },
            searchEngines: function (accel, speed, range, gas, electric) {
                var weight = this.possibleTotalWeight();
                var list = CW.findEngines(this.car.type, weight, this.car.tireCount(), this.car.streamlined,
                    accel, speed, gas, electric, range, this.car.techLevel, false,
                    this.car.spaceForEngine(), this.car.weightForEngine());
                for (var i = 0; i < list.length; i++) {
                    if (list[i].usedMaxWeight < weight) list[i].weightSuffix = " @" + list[i].usedMaxWeight + "lbs";
                    else list[i].weightSuffix = "";
                    list[i].current = this.car.engine.name === list[i].name &&
                        (this.car.engine.truck ? this.car.engine.modifiedMaxLoad() : this.car.engine.totalPowerFactors()) === list[i].powerFactors
                        && (!list[i].costPerTire || this.car.engine.costPerTire() === list[i].costPerTire);
                }
                return list;
            },
            updateEngine: function (accel, speed, range, electric) {
                if (this.hasEngine()) {
                    var old;
                    var weight = this.possibleTotalWeight();
                    if (electric === undefined) {
                        electric = this.car.engine.electric;
                        var capacity = this.engineCapacity();
                        if (weight === capacity) return false;
                    }
                    var engines;
                    var selected;
                    engines = CW.findEngines(this.car.type, weight, this.car.tireCount(), this.car.streamlined,
                        accel, speed, !electric, electric, range,
                        this.car.techLevel, true, this.car.spaceForEngine(), this.car.weightForEngine());
                    if (engines && engines[0]) selected = engines[0];
                    if (!selected && !this.isTruck()) { // Find inadequate engine for Super Trike
                        engines = CW.findEngines(this.car.type, weight, this.car.tireCount(), this.car.streamlined,
                            1, 1, !this.car.engine.electric, this.car.engine.electric, 150,
                            this.car.techLevel, false, this.car.spaceForEngine(), this.car.weightForEngine());
                        if (engines && engines[0]) selected = engines[0];
                    }
                    if (selected) {
                        old = this.car.engine.textDescription();
                        this.applyNewEngine(selected);
                        if (old !== this.car.engine.textDescription())
                            $rootScope.$broadcast("message", "Engine updated to " + this.car.engine.textDescription());
                        return true;
                    }
                }
                return false;
            },
            applyNewEngine: function (newEngine) {
                if (newEngine.electric) {
                    if (!this.car.engine.electric) {
                        this.car.engine = CW.createPowerPlant(CW.findByName(this.car.powerPlantList, newEngine.name));
                        this.car.gasTank = null;
                    } else {
                        this.car.engine.changeType(CW.findByName(this.car.powerPlantList, newEngine.name));
                    }
                    this.car.engine.platinumCatalysts = !!newEngine.platinumCatalysts;
                    this.car.engine.superconductors = !!newEngine.superconductors;
                    this.car.engine.highTorqueMotors = !!newEngine.highTorqueMotors;
                    this.car.engine.heavyDutyHighTorqueMotors = !!newEngine.heavyDutyHighTorqueMotors;
                } else {
                    if (this.car.engine.electric) {
                        this.car.engine = CW.createGasEngine(this.car.engine.truck ? CW.findByName(CW.truckEngine, newEngine.name) : newEngine.name);
                        this.car.gasTank = CW.createGasTank('Economy');
                    } else {
                        this.car.engine.changeType(this.car.engine.truck ? CW.findByName(CW.truckEngine, newEngine.name) : CW.findGasEngine(newEngine.name));
                    }
                    if (newEngine.gasTankSize) this.car.gasTank.capacity = newEngine.gasTankSize;
                    this.car.engine.carburetor = newEngine.carburetor;
                    this.car.engine.multibarrelCarburetor = !!newEngine.multibarrelCarburetor;
                    this.car.engine.tubularHeaders = newEngine.tubularHeaders;
                    this.car.engine.blueprinted = newEngine.blueprinted;
                    if (newEngine.turbocharger) {
                        if (!this.car.engine.variablePitchTurbocharger) {
                            this.car.engine.turbocharger = true;
                        }
                    } else {
                        this.car.engine.turbocharger = false;
                        this.car.engine.variablePitchTurbocharger = false;
                    }
                    this.car.engine.supercharger = !!newEngine.supercharger;
                }
                this.car.checkLinkableModifications();
                this.car.recalculate();
                $rootScope.$broadcast('change-engine', this.car.engine.electric);
            },
            updateGasTank: function (type) {
                if (type === CW.gasTank.economy.name) this.car.gasTank.changeType(CW.gasTank.economy);
                else if (type === CW.gasTank.heavy_duty.name) this.car.gasTank.changeType(CW.gasTank.heavy_duty);
                else if (type === CW.gasTank.racing.name) this.car.gasTank.changeType(CW.gasTank.racing);
                else if (type === CW.gasTank.duelling.name) this.car.gasTank.changeType(CW.gasTank.duelling);
                else return false;
                this.car.recalculate();
                return true;
            },
            crewName: function(crew) {
                var i, total = 0, index = -1;
                if((crew.name !== 'Gunner' && crew.name !== 'Passenger') || crew.inSidecar)
                    return crew.name;
                var target = crew.inCarrier ? this.car.carrier : this.car;
                for(i=0; i<target.crew.length; i++) {
                    if(target.crew[i].name === crew.name) ++total;
                    if(target.crew[i] === crew) index = total;
                }
                for(i=0; i<target.passengers.length; i++) {
                    if(target.passengers[i].name === crew.name) ++total;
                    if(target.passengers[i] === crew) index = total;
                }
                if(index >= 0) {
                    if(total < 2) return crew.name;
                    return crew.name+" "+index;
                }
                return crew.name;
            },
            hasGunner: function(carrier) {
                if(carrier) return this.car.carrier.hasGunner();
                return this.car.hasGunner();
            },
            crewCount: function(carrier) {
                if(carrier) return this.car.carrier.crewCount();
                return this.car.crewCount();
            },
            addGunner: function (sidecar, carrier) {
                var crew = CW.createCrew('Gunner');
                if(sidecar) {
                    crew.inSidecar = true;
                    this.car.sidecar.crew.push(crew);
                    this.car.sidecar.topArmor.plasticPoints = 0;
                    this.car.sidecar.topArmor.metalPoints = 0;
                } else if(carrier) {
                    crew.inCarrier = true;
                    this.car.carrier.crew.push(crew);
                } else this.car.crew.push(crew);
                this.car.recalculate();
                return crew;
            },
            removeGunner: function (gone) {
                if (gone.inSidecar) {
                    this.car.sidecar.crew.pop();
                    if(this.car.sidecar.crew.length + this.car.sidecar.passengers.length === 0)
                        this.car.sidecar.topArmor.plasticPoints = 1;
                } else if (gone.inCarrier) {
                    this.car.carrier.removeGunner(gone);
                } else {
                    this.car.removeGunner(gone);
                }
                return gone;
            },
            addPassenger: function (sidecar, carrier) {
                var crew = CW.createCrew('Passenger');
                if(sidecar) {
                    crew.inSidecar = true;
                    this.car.sidecar.passengers.push(crew);
                    this.car.sidecar.topArmor.plasticPoints = 0;
                    this.car.sidecar.topArmor.metalPoints = 0;
                } else if(carrier) {
                    crew.inCarrier = true;
                    this.car.carrier.passengers.push(crew);
                } else this.car.passengers.push(crew);
                this.car.recalculate();
                return crew;
            },
            removePassenger: function (gone) {
                if (gone.inSidecar) {
                    var result = this.car.sidecar.passengers.pop();
                    if(this.car.sidecar.crew.length + this.car.sidecar.passengers.length === 0)
                        this.car.sidecar.topArmor.plasticPoints = 1;
                    this.car.recalculate();
                    return result;
                } else if (gone.inCarrier) {
                    var temp = this.car.carrier.removePassenger(gone);
                    this.car.recalculate(); // Otherwise only recalculates the carrier
                    return temp;
                } else {
                    return this.car.removePassenger(gone);
                }
            },
            allOccupants: function() {
                var list = this.car.crew;
                if(this.car.sidecar) list = list.concat(this.car.sidecar.crew);
                if(this.car.carrier) list = list.concat(this.car.carrier.crew);
                list = list.concat(this.car.passengers);
                if(this.car.sidecar) list = list.concat(this.car.sidecar.passengers);
                if(this.car.carrier) list = list.concat(this.car.carrier.passengers);
                return list;
            },
            sidecarOccupants: function() {
                if(this.isCycle() && this.car.sidecar) return this.car.sidecar.crew.concat(this.car.sidecar.passengers);
                return [];
            },
            armorAbbv: function(armor) {
                if(armor) {
                    if (armor.plasticType && armor.plasticPoints > 0) {
                        if (armor.plasticType === CW.armor.plastic) return "Plas";
                        else if (armor.plasticType === CW.armor.lr) return "L-R";
                        else if (armor.plasticType === CW.armor.lrfp) return "LRFP";
                        else if (armor.plasticType === CW.armor.fireproof) return "FP";
                        else if (armor.plasticType === CW.armor.radarproof) return "RP";
                        else if (armor.plasticType === CW.armor.rpfp) return "RPFP";
                    } else if (armor.metalType && armor.metalPoints > 0) {
                        if (armor.metalType === CW.armor.metal) return "Metl";
                        else if (armor.metalType === CW.armor.lr_metal) return "L-RM";
                    }
                }
                return "None";
            },
            componentArmorName: function (item) {
                return item.componentArmor ?
                    (item.componentArmor.plasticPoints > 0 ? item.componentArmor.plasticPoints : item.componentArmor.metalPoints)
                    + "-pt component armor" : "No component armor";
            },
            componentArmorSpace: function() {
                return this.isCycle() ? 0.5 : 1;
            },
            crewCompartmentCAName: function (carrier) {
                var target = carrier ? this.car.carrier : this.car;
                return target.crewCompartmentCA ? target.crewCompartmentCA.plasticPoints + "-pt component armor" :
                    "No component armor";
            },
            hasCrewCA: function(carrier) {
                var target = carrier ? this.car.carrier : this.car;
                for(var i=0; i<target.crew.length; i++)
                    if(target.crew[i].componentArmor) return true;
                return false;
            },
            hasCrewCompartmentCA: function(carrier) {
                var target = carrier ? this.car.carrier : this.car;
                return !!target.crewCompartmentCA;
            },
            crewCompartmentCA: function(carrier) {
                var target = carrier ? this.car.carrier : this.car;
                return target.crewCompartmentCA;
            },
            nextComponentArmor: function (item) {
                if (!item.componentArmor) item.componentArmor = CW.createComponentArmor(item, this.car.type);
                else if (item.componentArmor.plasticType && item.componentArmor.plasticPoints < 10) item.componentArmor.plasticPoints += 1;
                else if (item.componentArmor.metalType && item.componentArmor.metalPoints < 2) item.componentArmor.metalPoints += 1;
                else return false;
                if (item.type === 'Crew' && item.name !== 'Passenger') {
                    var target = item.inCarrier ? this.car.carrier : this.car;
                    target.crewCompartmentCA = null;
                }
                this.car.recalculate();
                return true;
            },
            previousComponentArmor: function (item) {
                if (item.componentArmor) {
                    if ((item.componentArmor.plasticType && item.componentArmor.plasticPoints === 1)
                        || (item.componentArmor.metalType && item.componentArmor.metalPoints === 1)) {
                        item.componentArmor = null;
                    } else {
                        if (item.componentArmor.plasticType) item.componentArmor.plasticPoints -= 1;
                        else if (item.componentArmor.metalType) item.componentArmor.metalPoints -= 1;
                        if (item.type === 'Crew' && item.name !== 'Passenger' && this.car.crewCompartmentCA) {
                            this.car.crewCompartmentCA = null;
                        }
                    }
                    this.car.recalculate();
                    return true;
                }
                return false;
            },
            nextArmor: function (item, max) {
                if(!max) max = 10;
                if (!item.armor) item.armor = CW.createArmor(1, 0);
                else if (item.armor.plasticType && item.armor.plasticPoints < max) item.armor.plasticPoints += 1;
                else if (item.armor.metalType && item.armor.metalPoints < max/5) item.armor.metalPoints += 1;
                else return false;
                this.car.recalculate();
                return true;
            },
            previousArmor: function (item) {
                if (item.armor) {
                    if ((item.armor.plasticType && item.armor.plasticPoints === 1)
                        || (item.armor.metalType && item.armor.metalPoints === 1)) {
                        item.armor = null;
                    } else {
                        if (item.armor.plasticType) item.armor.plasticPoints -= 1;
                        else if (item.armor.metalType) item.armor.metalPoints -= 1;
                    }
                    this.car.recalculate();
                    return true;
                }
                return false;
            },
            nextCrewCompartmentCA: function (carrier) {
                var target = carrier ? this.car.carrier : this.car;
                if (!target.crewCompartmentCA) target.crewCompartmentCA = CW.createComponentArmor(target.crew, target.type);
                else if (target.crewCompartmentCA.plasticType && target.crewCompartmentCA.plasticPoints < 10)
                    target.crewCompartmentCA.plasticPoints += 1;
                else if (target.crewCompartmentCA.metalType && target.crewCompartmentCA.metalPoints < 2)
                    target.crewCompartmentCA.metalPoints += 1;
                for (var i = 0; i < target.crew.length; i++) {
                    target.crew[i].componentArmor = null;
                }
                this.car.recalculate();
            },
            previousCrewCompartmentCA: function (carrier) {
                var target = carrier ? this.car.carrier : this.car;
                if (target.crewCompartmentCA) {
                    if ((target.crewCompartmentCA.plasticType && target.crewCompartmentCA.plasticPoints === 1)
                        || (target.crewCompartmentCA.metalType && target.crewCompartmentCA.metalPoints === 1)) {
                        target.crewCompartmentCA = null;
                    } else {
                        if (target.crewCompartmentCA.plasticType) target.crewCompartmentCA.plasticPoints -= 1;
                        else if (target.crewCompartmentCA.metalType) target.crewCompartmentCA.metalPoints -= 1;
                        for (var i = 0; i < this.car.crew.length; i++) {
                            target.crew[i].componentArmor = null;
                        }
                    }
                    this.car.recalculate();
                }
            },
            bodyWeaponList: function (carrier) {
                var result, oversize = this.hasOversizeWeaponFacings();
                if (this.isCycle()) {
                    result = [
                        {location: 'Front', contents: buildWeaponList(this.car.frontWeapons)},
                        {location: 'Back', contents: buildWeaponList(this.car.backWeapons)}
                    ];
                } else {
                    var target = carrier ? this.car.carrier : this.car;
                    result = [
                        {location: 'Front', contents: buildWeaponList(target.frontWeapons)},
                        {location: 'Left' + (oversize ? " Front" : ""), contents: buildWeaponList(target.leftWeapons)},
                        {location: 'Right' + (oversize ? " Front" : ""), contents: buildWeaponList(target.rightWeapons)},
                        {location: 'Back', contents: buildWeaponList(target.backWeapons)},
                        {location: 'Top' + (oversize ? " Front" : ""), contents: buildWeaponList(target.topWeapons)},
                        {location: 'Underbody' + (oversize ? " Front" : ""), contents: buildWeaponList(target.underbodyWeapons)}
                    ];
                }
                if (oversize) {
                    result.push({location: 'Underbody Back', contents: buildWeaponList(this.car.underbodyBackWeapons)});
                    result.splice(5, 0, {location: 'Top Back', contents: buildWeaponList(this.car.topBackWeapons)});
                    result.splice(3, 0, {location: 'Right Back', contents: buildWeaponList(this.car.rightBackWeapons)});
                    result.splice(2, 0, {location: 'Left Back', contents: buildWeaponList(this.car.leftBackWeapons)});
                }
                for(var i=0; i<result.length; i++) {
                    result[i].tag = result[i].location.replace(" ", "");
                }
                return result;
            },
            cornerWeaponList: function (carrier) {
                if (this.isCycle() || this.isTrike()) return [];
                var target = carrier ? this.car.carrier : this.car;
                var result = [];
                if(this.isFlatbed() || (carrier && target.isFlatbed())) return result;
                if(!this.isSemiTrailer() && !this.isBus()) {
                    result.push({location: 'Front Left', contents: buildWeaponList(target.frontLeftWeapons)});
                    result.push({location: 'Front Right', contents: buildWeaponList(target.frontRightWeapons)});
                }
                result.push({location: 'Back Left', contents: buildWeaponList(target.backLeftWeapons)});
                result.push({location: 'Back Right', contents: buildWeaponList(target.backRightWeapons)});
                for(var i=0; i<result.length; i++) {
                    result[i].tag = result[i].location.replace(" ", "");
                }
                return result;
            },
            sidecarWeaponList: function() {
                if(!this.isCycle() || !this.car.sidecar) return null;
                var result = [
                    {location: 'Sidecar Front', contents: buildWeaponList(this.car.sidecar.frontWeapons)},
                    {location: 'Sidecar Back', contents: buildWeaponList(this.car.sidecar.backWeapons)},
                    {location: 'Sidecar Right', contents: buildWeaponList(this.car.sidecar.rightWeapons)}
                ];
                for(var i=0; i<result.length; i++) {
                    result[i].tag = result[i].location.replace(" ", "");
                }
                return result;
            },
            weaponsInLocation: function (currentWeapon) {
                var location = currentWeapon.location;
                var list;
                if (!currentWeapon.isTurret())
                    location = location.substr(0, 1).toLowerCase() + location.substring(1) + "Weapons";
                if (currentWeapon.carrier) list = this.car.carrier[location];
                else if (currentWeapon.sidecar) list = this.car.sidecar[location];
                else list = this.car[location];
                if (currentWeapon.isTurret()) list = list.weapons;
                return list;
            },
            spacesForWeapon: function (location, carrier, sidecar) {
                if (location.location) { // Accept all args as an object
                    carrier = location.carrier;
                    sidecar = location.sidecar;
                    location = location.location;
                }
                if (carrier) return roundIfNeeded(this.car.carrier.weaponSpacesRemainingIn(location));
                else if (sidecar) return roundIfNeeded(this.car.sidecar.weaponSpacesRemainingIn(location));
                else return roundIfNeeded(this.car.weaponSpacesRemainingIn(location));
            },
            weaponSpacesInBody: function (currentWeapon) {
                var loc = currentWeapon.location;
                if (currentWeapon.sidecar) return this.car.sidecar.spaceAvailable() - this.sidecar.spaceUsed();
                if (currentWeapon.isTurret()) {
                    loc = loc.substr(0, 1).toUpperCase() + loc.substr(1).replace("Turret", '');
                    if(/^Side/.test(loc)) {
                        return Math.min(this.spacesForWeapon(loc.replace('Side', 'Left')), this.spacesForWeapon(loc.replace('Side', 'Right')));
                    }
                }
                if (currentWeapon.carrier) return this.car.carrier.weaponSpacesRemainingIn(loc);
                return roundIfNeeded(this.car.weaponSpacesRemainingIn(loc));
            },
            oneThirdSpaces: function(location, carrier) {
                if(carrier) return roundIfNeeded(this.car.carrier.weaponSpacesRemainingIn(location, true));
                return roundIfNeeded(this.car.weaponSpacesRemainingIn(location, true));
            },
            countWeaponsIn: function(currentWeapon, locationToCheck) {
                var target = currentWeapon.sidecar ? this.car.sidecar : currentWeapon.carrier ? this.car.carrier : this.car;
                return target.countWeaponsIn(currentWeapon.weapon.name, locationToCheck);
            },
            dischargersAllowed: function (location, carrier, sidecar) {
                if (location.location) { // Accept all args as an object
                    carrier = location.carrier;
                    sidecar = location.sidecar;
                    location = location.location;
                }
                if (sidecar) return false;
                if (carrier) return this.car.carrier.dischargersAllowed(location);
                return this.car.dischargersAllowed(location);
            },
            sideDischargerLimit: function(currentWeapon) {
                if(currentWeapon.sidecar) return 0;
                if(currentWeapon.carrier) return this.car.carrier.sideDischargerLimit();
                return this.car.sideDischargerLimit();
            },
            hasDischargers: function (location) {
                if (location.carrier) return this.car.carrier.hasDischargers();
                if (location.sidecar) return false;
                return this.car.hasDischargers();
            },
            dischargersBumperTriggered: function(currentWeapon) {
                var target = currentWeapon.sidecar ? this.car.sidecar : currentWeapon.carrier ? this.car.carrier : this.car;
                return target.dischargersBumperTriggered();
            },
            weaponsByType: function(type, maxSize, rocketPlatform) {
                return CW.weaponsByType(type, maxSize, this.isOversize() || this.isTenWheeler() || this.isSemiTractor() || this.isBus(), rocketPlatform);
            },
            handWeaponsByType: function(type) {
                var i, name, weapon, weapons = [], loadedCost, loadedWeight, ammo, toHit, damage;
                var techLevel = this.car.techLevel;
                if(type === 'Hand Grenades') {
                    for(name in CW.handGrenades) {
                        if(CW.handGrenades.hasOwnProperty(name)) {
                            weapons.push({weapon: CW.handGrenades[name]});
                        }
                    }
                } else {
                    for(name in CW.handWeapons) {
                        if(!/_ammo$/.test(name) && CW.handWeapons.hasOwnProperty(name)) {
                            if(CW.handWeapons[name].category === type) {
                                weapons.push({weapon: CW.handWeapons[name]});
                            }
                        }
                    }
                }
                for(i=0; i<weapons.length; i++) {
                    weapon = weapons[i].weapon;
                    loadedCost = weapon.cost;
                    loadedWeight = weapon.weight;
                    ammo = CW.handWeapons[weapon.abbv+"_ammo"];
                    if(weapon.shots > 0 && ammo && ammo.length > 0) {
                        loadedCost += ammo[0].costPerShot*weapon.shots;
                        loadedWeight += ammo[0].weightPerShot*weapon.shots;
                    }
                    loadedWeight = this.car.personalEquipmentWeight ? loadedWeight+" lbs." : weapon.ge+" GE";
                    toHit = weapon.toHit > 0 ? weapon.toHit : "";
                    damage = weapon.damage && weapon.damage !== '0' ? weapon.damage : ammo && ammo.length > 0 && ammo[0].damage !== '0' ? ammo[0].damage : "";
                    weapons[i].enabled = techLevel === 'Military' || (techLevel === 'All' && !weapon.military) ||
                        (techLevel === 'CWC' && (weapon.techLevel === 'CWC' || weapon.techLevel === 'Classic')) ||
                            (techLevel === 'Classic' && weapon.techLevel === 'Classic');
                    weapons[i].loadedCost = loadedCost;
                    weapons[i].loadedWeight = loadedWeight;
                    weapons[i].toHit = toHit;
                    weapons[i].damage = damage;
                }
                return weapons;
            },
            addHandWeapon: function(abbv, person) {
                var wpn = CW.createHandWeapon(abbv);
                person.handWeapons.push(wpn);
                this.recalculate();
                return wpn;
            },
            addWeapon: function (abbv, currentWeapon) {
                currentWeapon.weapon = CW.createWeapon(abbv, currentWeapon.location, this.getTurret(currentWeapon));
                var target = this.car;
                if(currentWeapon.sidecar) {
                    target = this.car.sidecar;
                    currentWeapon.weapon.displayLocation = "Sidecar "+currentWeapon.weapon.displayLocation;
                } else if(currentWeapon.carrier) {
                    target = this.car.carrier;
                    currentWeapon.weapon.displayLocation = "Carrier "+currentWeapon.weapon.displayLocation;
                }
                currentWeapon.firstDischarger = currentWeapon.weapon.isDischarger() && !target.hasDischargers();
                target.addWeapon(currentWeapon.weapon, currentWeapon.location);
                if(currentWeapon.carrier) this.car.recalculate();
                return currentWeapon.weapon;
            },
            getWeaponIn: function(currentWeapon, location) {
                var target = currentWeapon.sidecar ? this.car.sidecar : currentWeapon.carrier ? this.car.carrier : this.car;
                return target.getWeaponIn(currentWeapon.weapon.name, location);
            },
            removeWeapon: function (currentWeapon) {
                var target = currentWeapon.sidecar ? this.car.sidecar : currentWeapon.carrier ? this.car.carrier : this.car;
                return target.removeWeapon(currentWeapon.weapon, currentWeapon.weapon.location);
            },
            increaseWeaponCount: function (currentWeapon) {
                currentWeapon.weapon.count += 1;
                if (currentWeapon.weapon.count === 2 && !currentWeapon.weapon.isDischarger()) {
                    if(currentWeapon.isTurret() && this.getTurret(currentWeapon).side) {
                        this.car.createWeaponLink(this.getTurret(currentWeapon).linkableWeapon(currentWeapon.weapon, true));
                        this.car.createWeaponLink(this.getTurret(currentWeapon).linkableWeapon(currentWeapon.weapon, false));
                    } else this.car.createWeaponLink(currentWeapon.weapon);
                }
                this.recalculate();
            },
            decreaseWeaponCount: function (currentWeapon) {
                currentWeapon.weapon.count -= 1;
                if (currentWeapon.weapon.count === 1) {
                    if(currentWeapon.isTurret() && this.getTurret(currentWeapon).side) {
                        this.car.removeWeaponLink(this.getTurret(currentWeapon).linkableWeapon(currentWeapon.weapon, true));
                        this.car.removeWeaponLink(this.getTurret(currentWeapon).linkableWeapon(currentWeapon.weapon, false));
                    } else this.car.removeWeaponLink(currentWeapon.weapon);
                }
                this.recalculate();
            },
            setTurretLocation: function (currentWeapon, turret) {
                if (!turret) return;
                checkTurretLocation(currentWeapon, turret, this.car.topTurret, "topTurret", false, false);
                checkTurretLocation(currentWeapon, turret, this.car.sideTurret, "sideTurret", false, false);
                if (this.isOversize()) {
                    checkTurretLocation(currentWeapon, turret, this.car.topBackTurret, "topBackTurret", false, false);
                    checkTurretLocation(currentWeapon, turret, this.car.sideBackTurret, "sideBackTurret", false, false);
                }
                if (this.isTenWheeler()) {
                    checkTurretLocation(currentWeapon, turret, this.car.carrier.topTurret, "topTurret", true, false);
                    checkTurretLocation(currentWeapon, turret, this.car.carrier.sideTurret, "sideTurret", true, false);
                }
                if (this.isCycle() && this.car.sidecar) {
                    checkTurretLocation(currentWeapon, turret, this.car.sidecar.topTurret, "topTurret", false, true);
                }
            },
            findCupola: function(gunner) {
                if(this.car.topTurret && this.car.topTurret.gunner === gunner)
                    return this.car.topTurret;
                else if(this.car.topBackTurret && this.car.topBackTurret.gunner === gunner)
                    return this.car.topBackTurret;
                else if(this.hasCarrier() && this.car.carrier.topTurret && this.car.carrier.topTurret.gunner === gunner)
                    return this.car.carrier.topTurret;
                return null;
            },
            getTurret: function (currentWeapon) {
                if (!currentWeapon.isTurret()) return null;
                if (currentWeapon.carrier) return this.car.carrier[currentWeapon.location];
                if (currentWeapon.sidecar) return this.car.sidecar.topTurret;
                return this.car[currentWeapon.location];
            },
            isRocketPlatform: function (currentWeapon) {
                var turret = this.getTurret(currentWeapon);
                if (!turret) return false;
                return turret.isRocketPlatform();
            },
            isRocketEWP: function (currentWeapon) {
                var turret = this.getTurret(currentWeapon);
                if (!turret) return false;
                return turret.isRocketEWP();
            },
            makeTurretSmaller: function (turret) {
                if (turret.size > turret.smallest) {
                    turret.makeSmaller();
                    this.recalculate();
                    return true;
                }
                $rootScope.$broadcast('message', turret.name + " cannot be smaller than size " + turret.size);
                return false;
            },
            makeTurretLarger: function (turret) {
                var max = this.car.body.maxTurretSize;
                if (turret.isEWP()) max = this.car.body.maxEWPSize;
                else if (turret.isRocketPlatform()) max = this.car.body.maxRPSize;
                if (turret.size >= max) {
                    $rootScope.$broadcast('message', turret.name + " is already at the maximum size for this vehicle.");
                    return false;
                }
                turret.makeBigger(max);
                this.recalculate();
                return true;
            },
            isFrontOfBus: function (currentWeapon) {
                if (currentWeapon.carrier || currentWeapon.sidecar) return false;
                return (this.car.type === 'Bus' || this.car.type === 'SemiTrailer') && (currentWeapon.location === 'Front' ||
                    (this.car.isOversize() && (currentWeapon.location === 'Left' || currentWeapon.location === 'Right' ||
                        currentWeapon.location === 'Top' || currentWeapon.location === 'Underbody')));
            },
            hasLaser: function (currentWeapon) {
                var list = this.weaponsInLocation(currentWeapon);
                for (var i = 0; i < list.length; i++) {
                    if (list[i].isLaser()) {
                        return true;
                    }
                }
                return false;
            },
            isCorner: function(currentWeapon) {
                return CW.isCorner(currentWeapon.location);
            },
            locationName: function (currentWeapon) {
                var text = "";
                if (currentWeapon.sidecar) text = "Sidecar ";
                else if (currentWeapon.carrier) text = currentWeapon.isTurret() ? "Cr. " : "Carrier ";
                if (currentWeapon.isTurret()) {
                    text = "in "+text;
                    var name = this.getTurret(currentWeapon).abbv;
                    if(!currentWeapon.sidecar) {
                        if(currentWeapon.weapon.wraps) text += currentWeapon.weapon.left ? "Left " : "Right ";
                        if (/^top/.test(currentWeapon.location)) {
                            if (/EWP/.test(name)) text += "Top ";
                        }// else if (name !== "Sponson") text += "Side ";
                        if (/Back/.test(currentWeapon.location)) text += "Back ";
                    }
                    return text + name;
                }
                return text + currentWeapon.location.substr(0, 1) + currentWeapon.location.substr(1).replace(/([A-Z])/g, ' $1');
            },
            hasSpaceForAnotherWeapon: function (currentWeapon) {
                var weapon = currentWeapon.weapon;
                if (currentWeapon.isTurret()) {
                    var turret = this.getTurret(currentWeapon);
                    if (weapon.singleWeaponSpaceInsideTurret() > turret.remainingSpace()) {
                        $rootScope.$broadcast('warning', "No more space available in the " + turret.name + "." + (weapon.totalCapacity() > 0 &&
                            weapon.ammoTotal() === weapon.totalCapacity() && !turret.isRocketPlatform() ?
                            "  Use the add ammo buttons to add an extra magazine." : ""));
                        return false;
                    }
                } else {
                    if (this.spacesForWeapon(currentWeapon) < weapon.singleWeaponSpace()) {
                        var underTotal = weapon.singleWeaponSpace() <= (currentWeapon.carrier ? this.carrierSpaceRemaining()
                            : this.spaceRemaining());
                        var perSide = this.maxWeaponSpacesPerSide(currentWeapon);
                        $rootScope.$broadcast('warning', "Not enough space remaining for another " + weapon.name +
                            (underTotal ? " (limit " + perSide + " spaces of weaponry per side)" : "") + ".");
                        return false;
                    } else if (weapon.isDischarger() && !this.dischargersAllowed(currentWeapon)) {
                        var location = currentWeapon.location;
                        if (this.isOversize()) {
                            if (location === 'LeftBack') location = 'Left';
                            else if (location === 'RightBack') location = 'Right';
                            else if (location === 'TopBack') location = 'Top';
                            else if (location === 'UnderbodyBack') location = 'Underbody';
                        }
                        $rootScope.$broadcast('warning', "No more " + location + " dischargers allowed.");
                        return false;
                    }
                }
                return true;
            },
            canAddAmmo: function (currentWeapon, shots) {
                var turret, weapon = currentWeapon.weapon;
                if (weapon.ammoTotal() + shots > weapon.totalCapacity()) {
                    if (currentWeapon.isTurret()) {
                        turret = this.getTurret(currentWeapon);
                        if (turret.remainingSpace() < weapon.count && this.weaponSpacesInBody(currentWeapon) < weapon.count) {
                            $rootScope.$broadcast('warning', weapon.abbv + (weapon.count > 1 ? "s are" : " is") + " full and no more space available for " + (weapon.count > 1 ? "extra magazines" : "an extra magazine"));
                            return false;
                        }
                        if (turret.isRocketPlatform() && weapon.isSingleShotRocket()) {
                            $rootScope.$broadcast('warning', "Cannot add ammo: rocket magazines can't feed a rocket platform.");
                            return false;
                        }
                    } else {
                        if (this.spacesForWeapon(currentWeapon) < weapon.count) {
                            var limit = currentWeapon.sidecar ? 0 : currentWeapon.carrier ? this.carrierSpaceRemaining() : this.spaceRemaining();
                            var text = weapon.abbv + (weapon.count > 1 ? "s are" : " is") + " full and no more space available for " + (weapon.count > 1 ? "extra magazines" : "an extra magazine");
                            text += limit < weapon.count ? "." :
                                " (limit " + this.maxWeaponSpacesPerSide(currentWeapon) + " spaces of weaponry per side).";
                            $rootScope.$broadcast('warning', text);
                            return false;
                        }
                    }
                    if (weapon.isSingleShotRocket()) {
                        if (weapon.rocketMagazine >= 3) {
                            $rootScope.$broadcast('warning', "Cannot add ammo: rocket magazines are limited to 3 spaces.");
                            return false;
                        }
                    }
                }
                return true;
            },
            addHandWeaponAmmo: function(weapon, ammo, shots, impactFused) {
                while (weapon.ammoTotal() + shots > weapon.totalCapacity()) {
                    weapon.extraClips += 1;
                }
                var found = false;
                for (var i = 0; i < weapon.ammo.length; i++) {
                    if (weapon.ammo[i].name === ammo.name) {
                        if (!found) weapon.ammo[i].shots += shots;
                        found = true;
                    }
                }
                if (!found) {
                    var newAmmo = CW.createAmmo(weapon, ammo, shots);
                    if(weapon.isGrenadeLauncher() && impactFused) newAmmo.impactFused = impactFused;
                    weapon.ammo.push(newAmmo);
                }
                this.recalculate();
            },
            getAmmoOptions: function(ammo) {
                return {
                    laserGuided: ammo.laserGuided,
                    harm: ammo.harm,
                    tracer: ammo.tracer,
                    proximityFused: ammo.proximityFused,
                    radioDetonated: ammo.radioDetonated,
                    programmable: ammo.programmable,
                    impactFused: ammo.impactFused,
                    highVelocity: ammo.highVelocity
                };
            },
            addAmmo: function (currentWeapon, ammo, shots, options) {
                var weapon = currentWeapon.weapon;
                if (weapon.ammoTotal() + shots > weapon.totalCapacity()) {
                    if (weapon.isSingleShotRocket()) weapon.rocketMagazine += 1;
                    else weapon.extraMagazines += 1;
                }
                var found = false;
                for (var i = 0; i < weapon.ammo.length; i++) {
                    if (weapon.ammo[i].name === ammo.name) {
                        if (!found) weapon.ammo[i].shots += shots;
                        found = true;
                    }
                }
                if (!found) {
                    var newAmmo = CW.createAmmo(weapon, ammo, shots);
                    if(weapon.isRocket()) {
                        newAmmo.laserGuided = options.laserGuided;
                        newAmmo.harm = options.harm;
                    }
                    if(weapon.isMachineGun()) newAmmo.tracer = options.tracer;
                    if(weapon.isGrenadeLauncher()) {
                        newAmmo.impactFused = options.impactFused;
                        if(weapon.abbv === 'AGL') newAmmo.highVelocity = options.highVelocity;
                    }
                    if(weapon.isMinedropper()) {
                        newAmmo.proximityFused = options.proximityFused;
                        newAmmo.radioDetonated = options.radioDetonated;
                        newAmmo.programmable = options.programmable;
                    }
                    weapon.ammo.push(newAmmo);
                }
                this.recalculate();
            },
            removeAmmo: function (currentWeapon, ammo, shots) {
                var weapon = currentWeapon.weapon;
                var i;
                var remove = [];
                for (i = 0; i < weapon.ammo.length; i++) {
                    if (weapon.ammo[i].name === ammo.name) {
                        if (shots > 0) {
                            if (shots >= weapon.ammo[i].shots) {
                                remove.push(i);
                                shots -= weapon.ammo[i].shots;
                                weapon.ammo[i].shots = 0;
                            } else {
                                weapon.ammo[i].shots -= shots;
                                shots = 0;
                            }
                            if (weapon.hasMagazines() && weapon.ammoTotal() <= weapon.totalCapacity() - weapon.magazineCapacity()) {
                                weapon.removeMagazine();
                            }
                        }
                    }
                }
                for (i = remove.length - 1; i >= 0; i--)
                    weapon.ammo.splice(remove[i], 1);
                this.recalculate();
            },
            removeAllAmmo: function (currentWeapon, ammo) {
                var weapon = currentWeapon.weapon;
                for (var i = weapon.ammo.length - 1; i >= 0; i--) {
                    if (weapon.ammo[i].name === ammo.name) {
                        weapon.ammo.splice(i, 1);
                        while (weapon.hasMagazines() && weapon.ammoTotal() <= weapon.totalCapacity() - weapon.magazineCapacity()) {
                            weapon.removeMagazine();
                        }
                    }
                }
                this.recalculate();
            },
            removeHandWeaponAmmo: function (weapon, ammo, shots) {
                var i;
                var remove = [];
                for (i = 0; i < weapon.ammo.length; i++) {
                    if (weapon.ammo[i].name === ammo.name) {
                        if (shots > 0) {
                            if (shots >= weapon.ammo[i].shots) {
                                remove.push(i);
                                shots -= weapon.ammo[i].shots;
                            } else {
                                weapon.ammo[i].shots -= shots;
                                shots = 0;
                            }
                            while (weapon.extraClips > 0 && weapon.ammoTotal() <= weapon.totalCapacity() - weapon.shots) {
                                weapon.extraClips -= 1;
                            }
                        }
                    }
                }
                for (i = remove.length - 1; i >= 0; i--)
                    weapon.ammo.splice(remove[i], 1);
                this.recalculate();
            },
            removeAllHandWeaponAmmo: function (weapon, ammo) {
                for (var i = weapon.ammo.length - 1; i >= 0; i--) {
                    if (weapon.ammo[i].name === ammo.name) {
                        weapon.ammo.splice(i, 1);
                        while (weapon.extraClips > 0 && weapon.ammoTotal() <= weapon.totalCapacity() - weapon.shots) {
                            weapon.extraClips -= 1;
                        }
                    }
                }
                this.recalculate();
            },
            removeHandWeapon: function(crew, weapon) {
                for(var i=0; i<crew.handWeapons.length; i++) {
                    if(crew.handWeapons[i] === weapon) {
                        crew.handWeapons.splice(i, 1);
                        this.recalculate();
                    }
                }
            },
            countShotsWith: function(weapon, ammoModifier) {
                var total = 0;
                for(var i=0; i<weapon.ammo.length; i++) {
                    if(weapon.ammo[i][ammoModifier]) total += weapon.ammo[i].shots;
                }
                return total;
            },
            editableTires: function () {
                var tires = [];
                if (this.car.frontTires) tires.push({location: "Front", tire: this.car.frontTires});
                if (this.car.backTires) tires.push({location: "Back", tire: this.car.backTires});
                if (this.car.sidecar) tires.push({location: "Sidecar", tire: this.car.sidecar.tires});
                return tires;
            },
            tireLocation: function (tire) {
                if (tire === this.car.frontTires) return "Front";
                if (tire === this.car.backTires) return "Back";
                if (tire === this.car.middleOrOuterTires) return "Middle";
                if (this.car.sidecar && tire === this.car.sidecar.tires) return "Sidecar";
                return "Unknown";
            },
            syncTires: function (tire, allSame, field, name) {
                if (allSame || this.isCycle()) {
                    if (this.car.frontTires) this.car.frontTires.duplicate(tire);
                    if (this.car.backTires) this.car.backTires.duplicate(tire);
                    if (this.car.middleOrOuterTires) this.car.middleOrOuterTires.duplicate(tire);
                    this.car.updateSpareTire();
                    if (this.car.sidecar) {
                        this.car.sidecar.tires.duplicate(tire);
                        this.car.sidecar.updateSpareTire();
                    } else if(this.car.carrier) {
                        this.car.carrier.updateSpareTire();
                    }
                } else if (tire === this.car.backTires || tire === this.car.middleOrOuterTires) {
                    if (this.car.middleOrOuterTires) this.car.middleOrOuterTires.duplicate(tire);
                    if (this.car.backTires) this.car.backTires.duplicate(tire);
                    this.car.updateSpareTire();
                    if (this.car.sidecar) {
                        this.car.sidecar.updateSpareTire();
                    } else if(this.car.carrier) {
                        this.car.carrier.updateSpareTire();
                    }
                }
                this.car.recalculate();
                if (field) {
                    var data = tire.optionData(field);
                    var text = (field === 'tireChains' ? "Added " : "Made tires ") + name;
                    if (data) text += " for" + (data.cost ? " $" + data.cost : "") + (data.weight ? " and " + data.weight + " lbs." : "")
                        + " per tire";
                    if (!/\.$/.test(text)) text += ".";
                    $rootScope.$broadcast('message', text);
                }
            },
            setTire: function (tire, type, allSame) {
                if (tire.changeType(type)) {
                    this.syncTires(tire, allSame);
                    $rootScope.$broadcast('message', "Base $" + tire.baseCost() + "/" + tire.baseWeight() + " lbs." +
                        (tire.totalCost() !== tire.cost ? " Adjusted $" + tire.totalCost() + "/" + tire.totalWeight() + " lbs." : "") + " per tire");
                }
            },
            setHitch: function(type) {
                var target = this.isTenWheeler() ? this.car.carrier : this.car;
                if(type) {
                    var hitch = CW.hitches[type];
                    if(target.hitch) target.hitch.changeType(hitch);
                    else target.hitch = CW.createHitch(hitch);
                } else target.hitch = null;
                this.recalculate();
            },
            tireCount: function () {
                return this.car.tireCount();
            },
            nextWheelguard: function (tire) {
                if(this.car.sidecar && tire === this.car.sidecar.tires)
                    nextTireProtection.apply(this, [this.car.sidecar, "wheelguards"]);
                else
                    nextTireProtection.apply(this, [this.car, this.tireLocation(tire).toLowerCase() + "Wheelguards"]);
            },
            previousWheelguard: function (tire) {
                if(this.car.sidecar && tire === this.car.sidecar.tires)
                    previousTireProtection.apply(this, [this.car.sidecar, "wheelguards"]);
                else
                    previousTireProtection.apply(this, [this.car, this.tireLocation(tire).toLowerCase() + "Wheelguards"]);
            },
            nextWheelhub: function (tire) {
                if(this.car.sidecar && tire === this.car.sidecar.tires)
                    nextTireProtection.apply(this, [this.car.sidecar, "wheelhubs"]);
                else
                    nextTireProtection.apply(this, [this.car, this.tireLocation(tire).toLowerCase() + "Wheelhubs"]);
            },
            previousWheelhub: function (tire) {
                if(this.car.sidecar && tire === this.car.sidecar.tires)
                    previousTireProtection.apply(this, [this.car.sidecar, "wheelhubs"]);
                else
                    previousTireProtection.apply(this, [this.car, this.tireLocation(tire).toLowerCase() + "Wheelhubs"]);
            },
            wheelguardName: function (tire) {
                if(this.car.sidecar && tire === this.car.sidecar.tires)
                    return this.armorPointsName(this.car.sidecar.wheelguards) + " Wheelguards";
                return this.armorPointsName(this.car[this.tireLocation(tire).toLowerCase() + "Wheelguards"]) + " Wheelguards";
            },
            wheelhubName: function (tire) {
                if(this.car.sidecar && tire === this.car.sidecar.tires)
                    return this.armorPointsName(this.car.sidecar.wheelhubs) + " Wheelhubs";
                return this.armorPointsName(this.car[this.tireLocation(tire).toLowerCase() + "Wheelhubs"]) + " Wheelhubs";
            },
            armorPointsName: function(armor) {
                if(!armor) return "No";
                if(armor.plasticType && armor.plasticPoints > 0) return armor.plasticPoints+"-pt";
                if(armor.metalType && armor.metalPoints > 0) return armor.metalPoints+"-pt";
                if(armor.fake) return "Fake";
                return "Unknown";
            },
            hasTurret: function() {
                if(this.car.topTurret || this.car.sideTurret) return true;
                if(this.hasOversizeWeaponFacings() && (this.car.topBackTurret || this.car.sideBackTurret)) return true;
                if(this.hasSidecar() && this.car.sidecar.topTurret) return true;
                if(this.hasCarrier() && (this.car.carrier.topTurret || this.car.carrier.sideTurret)) return true;
                return false;
            },
            availableSidecarTurrets: function() {
                var list = [];
                if(!this.isCycle() || !this.car.sidecar) return list;
                var space = this.car.sidecar.spaceAvailable();
                addTurretIf(list, CW.turrets.Turret, 0, space);
                addTurretIf(list, CW.turrets.Pop_Up_Turret, 0, space);
                addTurretIf(list, CW.turrets.Pintle_Mount, 2, space);
                return list;
            },
            availableTopTurrets: function (carrier) {
                var list = [];
                var space = carrier ? this.carrierSpaceRemaining() : this.spaceRemaining();
                var target = carrier ? this.car.carrier : this.car;
                addTurretIf(list, CW.turrets.Turret, target.body.maxTurretSize, space, this.car.techLevel);
                addTurretIf(list, CW.turrets.Pop_Up_Turret, target.body.maxTurretSize, space, this.car.techLevel);
                addTurretIf(list, CW.turrets.Rocket_Platform, target.body.maxRPSize, space, this.car.techLevel);
                addTurretIf(list, CW.turrets.EWP, target.body.maxEWPSize, space, this.car.techLevel);
                addTurretIf(list, CW.turrets.Rocket_EWP, target.body.maxEWPSize, space, this.car.techLevel);
                addTurretIf(list, CW.turrets.Cupola, target.body.maxTurretSize, space, this.car.techLevel);
                addTurretIf(list, CW.turrets.Pop_Up_Cupola, target.body.maxTurretSize, space, this.car.techLevel);
                addTurretIf(list, CW.turrets.Pintle_Mount, target.body.maxTurretSize, space, this.car.techLevel);
                // Dumpers can't use top turrets, flatbeds can't use any
                if((carrier && (this.car.carrier.body.name === CW.tenWheelerCarrierBody.dumper.name
                    || this.car.carrier.body.name === CW.tenWheelerCarrierBody.flatbed.name))
                    || this.isDumper() || this.isFlatbed())
                    for(var i=0; i<list.length; i++)
                        list[i].disabled = true;
                return list;
            },
            availableSideTurrets: function (carrier) {
                var list = [];
                var space = carrier ? this.carrierSpaceRemaining() : this.spaceRemaining();
                var target = carrier ? this.car.carrier : this.car;
                addTurretIf(list, CW.turrets.EWP, target.body.maxEWPSize, space, this.car.techLevel);
                addTurretIf(list, CW.turrets.Rocket_EWP, target.body.maxEWPSize, space, this.car.techLevel);
                addTurretIf(list, CW.turrets.Sponson_Turret, target.body.maxTurretSize, space, this.car.techLevel);
                // Flatbeds can't use turrets
                if((carrier && this.car.carrier.body.name === CW.tenWheelerCarrierBody.flatbed.name)
                    || this.isFlatbed())
                    for(var i=0; i<list.length; i++)
                        list[i].disabled = true;
                return list;
            },
            addTopTurret: function (type, sidecar, carrier, back) {
                var topTurret = back ? "topBackTurret" : "topTurret";
                var target = sidecar ? this.car.sidecar : carrier ? this.car.carrier : this.car;
                if (!type || target[topTurret]) return null;
                var data = CW.turrets[type.replace(' ', '_').replace('-', '_')];
                if (!data) return null;
                var max;
                if(target.body) {
                    max = this.car.body.maxTurretSize;
                    if (/EWP/.test(type)) max = this.car.body.maxEWPSize;
                    else if (type === 'Rocket Platform') max = this.car.body.maxRPSize;
                } else max = /Pintle/.test(type) ? 2 : 0;
                var available = sidecar ? this.car.sidecar.spaceAvailable() : carrier ? this.carrierSpaceRemaining() : this.spaceRemaining();
                var size = turretAvailable(data.costBySize, data.spaceBySize, max, available);
                if (size >= 0) {
                    target[topTurret] = CW.createTurret(type, size);
                    if(size === 0)
                        target.addWeapon(CW.createWeapon("TL", topTurret, target[topTurret]), topTurret);
                    else
                        this.car.recalculate();
                }
                return target[topTurret];
            },
            addSideTurret: function (type, carrier, back) {
                var sideTurret = back ? "sideBackTurret" : "sideTurret";
                var target = carrier ? this.car.carrier : this.car;
                if (!type || target[sideTurret]) return null;
                var data = CW.turrets[type.replace(' ', '_').replace('-', '_')];
                if (!data) return null;
                var max = target.body.maxTurretSize; // Sponson
                if (/EWP/.test(type)) max = target.body.maxEWPSize;
                var size = turretAvailable(data.costBySize, data.spaceBySize, max,
                    carrier ? this.carrierSpaceRemaining() : this.spaceRemaining());
                if (size >= 0) {
                    target[sideTurret] = CW.createTurret(type, size, true);
                    this.car.recalculate();
                }
                return target[sideTurret];
            },
            removeTurret: function (turret) {
                if (turret === this.car.topTurret) {
                    this.car.topTurret = null;
                } else if (turret === this.car.sideTurret) {
                    this.car.sideTurret = null;
                } else if (this.car.sidecar && turret === this.car.sidecar.topTurret) {
                    if (this.car.sidecar.topTurret.builtIn) return null;
                    this.car.sidecar.topTurret = null;
                } else if(this.car.carrier && turret === this.car.carrier.topTurret) {
                    this.car.carrier.topTurret = null;
                } else if(this.car.carrier && turret === this.car.carrier.sideTurret) {
                    this.car.carrier.sideTurret = null;
                } else return null;
                // TODO: top/left/right back
                this.car.removeFromLinks(turret.weapons);
                this.car.removeFromLinks(turret.boosters);
                this.car.checkLinkableModifications();
                this.car.recalculate();
                return turret;
            },
            convertibleAllowed: function () {
                if (this.isCycle() || this.isBus()) return false;
                if (this.isCar()) {
                    if (this.car.body.name === CW.carBody.van.name || this.car.body.name === CW.carBody.camper.name
                        || this.car.body.name === CW.carBody.stationWagon.name)
                        return false;
                }
                return true;
            },
            convertibleEnabled: function() {
                if (this.car.body.name === CW.carBody.pickup.name) return this.spaceRemaining() >= 2;
                return this.spaceRemaining() >= Math.ceil(this.car.modifiedSpaceAvailable / 6 - 0.0001);
            },
            compositeArmorDefined: function (target) {
                target = target || this.car;
                return target.frontArmor.plasticType && target.frontArmor.metalType;
            },
            compositeArmorUsed: function (target) {
                target = target || this.car;
                return target.compositeArmor();
            },
            plasticArmorType: function (target) {
                target = target || this.car;
                return target.frontArmor.plasticType;
            },
            metalArmorType: function (target) {
                target = target || this.car;
                return target.frontArmor.metalType;
            },
            previousPlasticArmor: function (target) {
                target = target || this.car;
                return target.previousPlasticArmor();
            },
            nextPlasticArmor: function (target) {
                target = target || this.car;
                return target.nextPlasticArmor();
            },
            previousMetalArmor: function (target) {
                target = target || this.car;
                return target.previousMetalArmor();
            },
            nextMetalArmor: function (target) {
                target = target || this.car;
                return target.nextMetalArmor();
            },
            multiSelectGear: function(category, person) {
                var name, item, owned, result = [];
                for (name in CW.personalGear) {
                    if (CW.personalGear.hasOwnProperty(name)) {
                        item = CW.personalGear[name];
                        if (item.multiple && item.category === category) {
                            owned = person.getGear(item);
                            result.push({
                                name: item.name,
                                tag: item.name.replace(" ","").replace("-","").replace(".","").replace("\"", ""),
                                data: item,
                                count: owned ? owned.count : "No",
                                disabled: item.techLevel && item.techLevel === 'CWC' && this.car.techLevel === 'Classic'
                            });
                        }
                    }
                }
                return result;
            },
            singleSelectGear: function(category, person) {
                var name, item, owned, result = [];
                for (name in CW.personalGear) {
                    if (CW.personalGear.hasOwnProperty(name)) {
                        item = CW.personalGear[name];
                        if (!item.multiple && item.category === category) {
                            owned = person.getGear(item);
                            result.push({
                                name: item.name,
                                data: item,
                                present: !!owned,
                                disabled: item.techLevel && item.techLevel === 'CWC' && this.car.techLevel === 'Classic'
                            });
                        }
                    }
                }
                return result;
            },
            multiSelectItems: function (category, carrier, sidecar) {
                var name, i, item, items = [], result = [];
                var remaining = carrier ? this.carrierSpaceRemaining() : sidecar ? this.sidecarSpaceRemaining() : this.spaceRemaining();
                var cargo = carrier ? this.carrierCargoSpaceRemaining() : sidecar ? this.sidecarSpaceRemaining() : this.cargoSpaceRemaining();
                for (name in CW.accessories) {
                    if (CW.accessories.hasOwnProperty(name)) {
                        item = CW.accessories[name];
//                        if (item.attachedToEngine && this.hasEngine()) continue;
                        if (item.category === category) {
                            if (!item.vehicleType || item.vehicleType === this.car.type)
                                items.push(item);
                        }
                    }
                }
                for (i = 0; i < items.length; i++) {
                    if (sidecar) item = this.car.sidecar.getAccessory(items[i]);
                    else if (carrier) item = this.car.carrier.getAccessory(items[i]);
                    else item = this.car.getAccessory(items[i]);
                    if (items[i].multiple) {
                        result.push({
                            name: items[i].name,
                            tag: items[i].name.replace(" ","").replace("-","").replace(".",""),
                            data: items[i],
                            count: item === null || item === 0 ? "No" : typeof item === 'number' ? item : item.count,
                            suffix: /Box$/.test(items[i].name) ? "es" : "s",
                            disabled: (items[i].name === CW.accessories.PASSENGER_ACCOMMODATIONS.name &&
                                this.car.body.name !== CW.carBody.van.name && !this.isCarTrailer() && !this.isSemiTractor() && !this.isSemiTrailer() && !this.isBus())
                                || (items[i].cargo && items[i].space > cargo)
                                || (!items[i].cargo && items[i].space > remaining)
                                || (items[i].techLevel === 'UACFH' && (this.car.techLevel === 'CWC' || this.car.techLevel === 'Classic'))
                                || ((!items[i].techLevel || items[i].techLevel === 'CWC') && this.car.techLevel === 'Classic')
                        });
                    }
                }
                return result;
            },
            singleSelectItems: function (category, carrier, sidecar) {
                var name, i, enabled, item, items = [], result = [], remaining = this.spaceRemaining();
                var safe = this.hasAccessory(CW.accessories.CARGO_SAFE) ||
                    (remaining >= CW.accessories.CARGO_SAFE.space &&
                        (!this.car.modifiedMaxWeight || CW.accessories.CARGO_SAFE.weight <= this.car.modifiedMaxWeight));
                for (name in CW.accessories) {
                    if (CW.accessories.hasOwnProperty(name)) {
                        item = CW.accessories[name];
//                        if (item.attachedToEngine && this.hasEngine()) continue;
                        if (item.category === category) {
                            if (!item.vehicleType || item.vehicleType === this.car.type)
                                items.push(item);
                        }
                    }
                }
                for (i = 0; i < items.length; i++) {
                    if (sidecar) item = this.car.sidecar.getAccessory(items[i]);
                    else if (carrier) item = this.car.carrier.getAccessory(items[i]);
                    else item = this.car.getAccessory(items[i]);
                    if (!items[i].multiple) {
                        enabled = !(items[i].techLevel === 'UACFH' && (this.car.techLevel === 'CWC' || this.car.techLevel === 'Classic')) &&
                                  !((!items[i].techLevel || items[i].techLevel === 'CWC') && this.car.techLevel === 'Classic');
                        if(this.isCycle() && /Carrier/.test(items[i].name)) enabled = false;
                        else if(this.isCar() && /Car Top Carrier/.test(items[i].name) && (items[i].capacity > this.car.maxWeaponSpacesPerSide || this.car.topTurret)) enabled = false;
                        else if(items[i].safe && !safe) enabled = false;
                        else if(items[i].space > remaining) enabled = false;
                        else if(this.car.modifiedMaxWeight && items[i].weight > this.car.modifiedMaxWeight) enabled = false;
                        result.push({
                            name: items[i].name,
                            data: items[i],
                            present: !!item,
                            disabled: !enabled
                        });
                    }
                }
                return result;
            },
            addAccessory: function(item, carrier, sidecar) {
                if(carrier) return this.car.carrier.addAccessory(item);
                if(sidecar) return this.car.sidecar.addAccessory(item);
                return this.car.addAccessory(item);
            },
            removeAccessory: function(item, carrier, sidecar) {
                if(carrier) return this.car.carrier.removeAccessory(item);
                if(sidecar) return this.car.sidecar.removeAccessory(item);
                return this.car.removeAccessory(item);
            },
            getAccessory: function(item, carrier, sidecar) {
                if(carrier) return this.car.carrier.getAccessory(item);
                if(sidecar) return this.car.sidecar.getAccessory(item);
                return this.car.getAccessory(item);
            },
            hasAccessory: function(item, carrier, sidecar) {
                if(carrier) return !!this.car.carrier.getAccessory(item);
                if(sidecar) return !!this.car.sidecar.getAccessory(item);
                return !!this.car.getAccessory(item);
            },
            links: function() {
                return this.car.links;
            },
            smartLinks: function() {
                return this.car.smartLinks;
            },
            linkableWeapons: function(currentWeapon) {
                return currentWeapon.sidecar ? this.car.sidecar.linkableWeapons() :
                    currentWeapon.carrier ? this.car.carrier.linkableWeapons() : this.car.linkableWeapons();
            },
            linkableItems: function(link) {
                var result = [], items, i;
                var cw = {
                    location: null,
                    weapon: null,
                    sidecar: false,
                    carrier: false,
                    isTurret: function() {return /Turret/.test(this.location);},
                    configure: function(weapon) {
                        console.log(weapon.abbv+"/"+weapon.location+"/"+weapon.displayLocation);
                        this.location = weapon.location;
                        this.weapon = weapon;
                        this.sidecar = /[Ss]idecar/.test(weapon.displayLocation);
                        this.carrier = /[Cc]arrier/.test(weapon.displayLocation);
                    }
                };
                items = this.car.linkableWeapons();
                for(i=0; i<items.length; i++) {
                    cw.configure(items[i]);
                    result.push({
                        name: (items[i].count > 1 ? items[i].count+"x " : "")+items[i].abbv+" "+this.locationName(cw),
                        type: 'weapon',
                        item: items[i],
                        present: link.contains(items[i])
                    });
                }
                items = this.car.linkableModifications();
                for(i=0; i<items.length; i++) {
                    result.push({
                        name: items[i],
                        type: 'modification',
                        item: items[i],
                        present: link.contains(items[i])
                    });
                }
                items = this.car.accessories;
                if(this.car.sidecar) items = items.concat(this.car.sidecar.accessories);
                else if(this.car.carrier) items = items.concat(this.car.carrier.accessories);
                for(i=0; i<items.length; i++) {
                    if(items[i].linkable) {
                        result.push({
                            name: items[i].name,
                            type: 'accessory',
                            item: items[i],
                            present: link.contains(items[i])
                        });
                    }
                }
                items = this.car.boosters;
                if(this.car.topTurret) items = items.concat(this.car.topTurret.boosters);
                if(this.isOversize() && this.car.topBackTurret) items = items.concat(this.car.topBackTurret.boosters);
                if(this.car.sideTurret) items = items.concat(this.car.sideTurret.boosters);
                if(this.isOversize() && this.car.sideBackTurret) items = items.concat(this.car.sideBackTurret.boosters);
                if(this.car.carrier) {
                    items = items.concat(this.car.carrier.boosters);
                    if(this.car.carrier.topTurret) items = items.concat(this.car.carrier.topTurret.boosters);
                    if(this.car.carrier.sideTurret) items = items.concat(this.car.carrier.sideTurret.boosters);
                }
                for(i=0; i<items.length; i++) {
                    result.push({
                        name: items[i].shortDescription(),
                        type: 'booster',
                        item: items[i],
                        present: link.contains(items[i])
                    });
                }
                return result;
            },
            addLink: function(smart) {
                var link = CW.createLink(this.car, smart);
                if(smart)
                    this.car.smartLinks.push(link);
                else
                    this.car.links.push(link);
                this.car.recalculate();
                return link;
            },
            removeLink: function(link) {
                if(link.smartLink) this.car.removeSmartLink(link);
                else this.car.removeLink(link);
            },
            setColor: function(color) {
                this.car.appearance.colorScheme.mainColor = color;
            },
            configureBooster: function(baseWeight, adjustWeight, thrust, isBooster, isBackOrBottom, turret) {
                // TODO: support multiple boosters/jets per location
                var booster = null, target, space, weight = baseWeight, list = turret ? turret.boosters : this.car.boosters;
                if(list.length === 0) {
                    if (thrust > 0) {
                        if (adjustWeight) weight = weight * 1.01;
                        target = Math.ceil(weight / 100 - 0.0001);
                        space = Math.ceil(target / 100 - 0.0001);
                        if (turret) {
                            if (turret.remainingSpace() < space) {
                                $rootScope.$broadcast("message", "EWP requires at least " + space + " free space" + (space > 1 ? "s" : "") + " in order to add a rocket booster");
                                return null;
                            }
                        } else {
                            if (this.car.spaceUsed >= this.car.modifiedSpaceAvailable) {
                                $rootScope.$broadcast("message", "Vehicle requires at least " + space + " free space" + (space > 1 ? "s" : "") + " in order to add a rocket booster." + (this.car.sideTurret ? "" : "  You may be able to add an EWP with a rocket booster instead."));
                                return null;
                            }
                        }
                        booster = CW.createBooster(!isBooster, isBackOrBottom);
                        booster.weight = target;
                        list.push(booster);
                        if (turret) booster.showFacing = false;
                    } else booster = null;
                } else if(thrust === 0) {
                    if(list.length > 0) booster = list.splice(0, 1)[0];
                    else booster = null;
                } else {
                    booster = list[0];
                    if(adjustWeight) weight += (weight*thrust/1000-booster.weight);
                    if(turret) {
                        if(Math.ceil(weight*thrust/100000-0.0001) > booster.totalSpace() && turret.remainingSpace() < 1) {
                            $rootScope.$broadcast("message", "Cannot use larger booster; no more space in EWP");
                            return null;
                        }
                    } else {
                        if(Math.ceil(weight*thrust/100000-0.0001) > booster.totalSpace() && this.car.spaceUsed >= this.car.modifiedSpaceAvailable) {
                            $rootScope.$broadcast("message", "Cannot use larger booster; no more space remaining.");
                            return null;
                        }
                    }
                    booster.weight = Math.ceil(weight*thrust/1000);
                }
                this.recalculate();
                return booster;
            },
            setSidecar: function(typeName) {
                if(!this.isCycle()) return;
                var obj = CW.findByName(CW.sidecarBody, typeName);
                if(!this.car.sidecar) this.car.addSidecar(obj);
                else this.car.setSidecar(obj);
            },
            addWindshell: function() {
                if(!this.isCycle()) return;
                this.car.addWindshell();
            }
        };
    });