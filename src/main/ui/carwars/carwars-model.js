/*
 Car Wars is a trademark of Steve Jackson Games, and its rules and art are copyrighted by Steve Jackson Games.
 All rights are reserved by Steve Jackson Games.

 This game aid is the original creation of Aaron Mulder and is released for free distribution, and not for resale,
 under the permissions granted in the Steve Jackson Games Online Policy.

 Application code for this game aid (except for the Car Wars rules as noted above) copyright 2013 Aaron Mulder.
 */
/* global CW */

(function() {
    "use strict";

    CW.versionOfModel = "$Revision: 1190 $";

    CW.createVehicle = function () {
        var vehicle = {};

        vehicle.personalEquipmentWeight = false;
        vehicle.techLevel = "Classic"; // 'Classic' or 'CWC' or 'All' or 'Military'

        vehicle.designName = 'Unnamed Design';
        vehicle.designId = Math.round(Math.random() * 1000000000000000);
        vehicle.history = [];

        vehicle.legal = true;
        vehicle.aada = true;

        vehicle.body = null;
        vehicle.engine = null;
        vehicle.chassis = null;
        vehicle.suspension = null;
        vehicle.crew = [];
        vehicle.crewCompartmentCA = null;
        vehicle.gasTank = null;
        vehicle.frontWeapons = [];
        vehicle.leftWeapons = [];
        vehicle.rightWeapons = [];
        vehicle.topWeapons = [];
        vehicle.underbodyWeapons = [];
        vehicle.backWeapons = [];
        vehicle.frontLeftWeapons = [];
        vehicle.frontRightWeapons = [];
        vehicle.backLeftWeapons = [];
        vehicle.backRightWeapons = [];
        vehicle.boosters = [];
        vehicle.topTurret = null;
        vehicle.sideTurret = null;
        vehicle.accessories = [];
        vehicle.passengers = [];
        vehicle.spareTires = [];

        vehicle.carbonAluminumFrame = false;
        vehicle.heavyDutyShocks = false;
        vehicle.heavyDutyBrakes = false;
        vehicle.antilockBrakes = false;
        vehicle.heavyDutyTransmission = false;
        vehicle.overdrive = false;
        vehicle.rollCage = false;
        vehicle.activeSuspension = false;
        vehicle.spoiler = false;
        vehicle.airdam = false;
        vehicle.streamlined = false;
        vehicle.sloped = false;
        vehicle.bodyBlades = false;
        vehicle.fakeBodyBlades = false;
        vehicle.brushcutter = false;
        vehicle.bumperSpikes = false;
        vehicle.backBumperSpikes = false;
        vehicle.ramplate = false;
        vehicle.fakeRamplate = false;
        vehicle.convertibleHardtop = false;
        vehicle.sunroof = false;
        vehicle.noPaintWindshield = false;
        vehicle.links = [];
        vehicle.smartLinks = [];
        vehicle.stealthKoteLocations = [];
        vehicle.hitch = null;
        vehicle.reservedSpace = 0;
        vehicle.reservedWeight = 0;

        vehicle.weightUsed = 0;
        vehicle.spaceUsed = 0;
        vehicle.cargoSpaceUsed = 0;
        vehicle.totalCost = 0;
        vehicle.modifiedSpaceAvailable = 0;
        vehicle.maxWeaponSpacesPerSide = 0;
        vehicle.modifiedCargoSpaceAvailable = 0;
        vehicle.modifiedHandlingClass = 0;
        vehicle.modifiedMaxWeight = 0;
        vehicle.maxEffectiveWeight = 0;
        vehicle.enginePowerRating = 0;
        vehicle.modifiedMPG = 0;
        vehicle.baseAcceleration = 0; // Only PF; no extra bonuses from HTMs, VPTC, SC, etc.
        vehicle.currentAcceleration = 0;
        vehicle.loadedAcceleration = 0;
        vehicle.displayAcceleration = "";
        vehicle.currentTopSpeed = 0;
        vehicle.loadedTopSpeed = 0;
        vehicle.towCapacity = 0;
        vehicle.frontTires = null;
        vehicle.backTires = null;
        vehicle.middleOrOuterTires = null;
        vehicle.thirdRowTiresInMiddle = false;
        vehicle.leftArmor = null;
        vehicle.rightArmor = null;
        vehicle.frontArmor = null;
        vehicle.backArmor = null;
        vehicle.topArmor = null;
        vehicle.underbodyArmor = null;
        vehicle.frontWheelguards = null;
        vehicle.frontWheelhubs = null;
        vehicle.backWheelguards = null;
        vehicle.backWheelhubs = null;
        vehicle.middleWheelguards = null;
        vehicle.middleWheelhubs = null;

        vehicle.appearance = {
            colorScheme: {
                mainColor: '#AA2222'
            }
        };
        vehicle.onRecalculate = null;
        vehicle.onErrors = null;

        vehicle.isOversize = function () {
            return this.body.facings && this.body.facings > 6;
        };
        vehicle.hasOversizeWeaponFacings = function () {
            return this.isOversize();
        };

        var applyWeapons = function (vehicle, weapons) {
            if (weapons) {
                var bumper = false;
                for (var i = 0; i < weapons.length; i++) {
                    vehicle.weightUsed += weapons[i].totalWeight();
                    vehicle.spaceUsed += weapons[i].totalSpace();
                    vehicle.totalCost += weapons[i].totalCost();
                    if (weapons[i].bumperTrigger) bumper = true;
                }
                if (bumper) vehicle.totalCost += 50; // Only one bumper-trigger needed per side, under this theory
            }
        };

        vehicle.initialSpaces = function () {
            return this.body.spaces;
        };

        var allocateCargo = function (spaces) {
            var cargo = 0, remaining = spaces;
            if (!/Flatbed/.test(this.body.name) && this.modifiedCargoSpaceAvailable - this.cargoSpaceUsed > 0) {
                cargo = Math.min(remaining, this.modifiedCargoSpaceAvailable - this.cargoSpaceUsed);
                this.cargoSpaceUsed += cargo;
                remaining -= cargo;
            }
            this.spaceUsed += remaining;
        };

        vehicle.extraWheelCost = function () {
            return 0;
        };

        vehicle.recalculateAccessories = function () {
        };

        vehicle.baseRecalculate = function () {
            var i, carTopCarrier = false, temp, gear, gearLimit;
            var speed, modifier = 0;
            this.modifiedSpaceAvailable = this.initialSpaces();
            this.modifiedCargoSpaceAvailable = this.body.cargoSpaces;
            if (this.sloped && this.streamlined) {
                this.modifiedSpaceAvailable = Math.floor(this.modifiedSpaceAvailable * 0.85);
                this.modifiedCargoSpaceAvailable = Math.floor(this.modifiedCargoSpaceAvailable * 0.85);
            } else if (this.sloped || this.streamlined) {
                this.modifiedSpaceAvailable = Math.floor(this.modifiedSpaceAvailable * 0.9);
                this.modifiedCargoSpaceAvailable = Math.floor(this.modifiedCargoSpaceAvailable * 0.9);
            }
            this.modifiedMaxWeight = Math.round(this.body.maxWeight * this.chassis.weightFactor);
            this.weightUsed = (this.carbonAluminumFrame ? this.body.weight / 2 : this.body.weight)
                + (this.frontTires ? Math.ceil(this.frontTireCount() * this.frontTires.totalWeight() - 0.0001) : 0)
                + Math.ceil(this.backTireCount() * this.backTires.totalWeight() - 0.0001)
                + (this.middleOrOuterTires ? Math.ceil(this.middleTireCount() * this.middleOrOuterTires.totalWeight() - 0.0001) : 0)
                + (this.engine ? this.engine.totalWeight() + (this.gasTank ? this.gasTank.totalWeight() : 0) : 0)
                + (this.crewCompartmentCA ? this.crewCompartmentCA.totalWeight() : 0)
                + (!this.frontWheelguards ? 0 : this.frontWheelguards.totalWeight(this.techLevel) * this.frontExposedTireCount())
                + (!this.backWheelguards ? 0 : this.backWheelguards.totalWeight(this.techLevel) * this.backExposedTireCount())
                + (!this.middleWheelguards ? 0 : this.middleWheelguards.totalWeight(this.techLevel) * this.middleTireCount())
                + (!this.frontWheelhubs ? 0 : this.frontWheelhubs.totalWeight(this.techLevel) * this.frontExposedTireCount())
                + (!this.backWheelhubs ? 0 : this.backWheelhubs.totalWeight(this.techLevel) * this.backExposedTireCount())
                + (!this.middleWheelhubs ? 0 : this.middleWheelhubs.totalWeight(this.techLevel) * this.middleTireCount())
                + (!this.topTurret ? 0 : this.topTurret.totalWeight(this.personalEquipmentWeight))
                + (!this.sideTurret ? 0 : this.sideTurret.totalWeight(this.personalEquipmentWeight)*2)
                + (this.heavyDutyShocks ? this.tireCount() * 5 : 0)
                + (this.heavyDutyTransmission ? 300 : 0)
                + (this.activeSuspension ? 100 : 0)
                + (this.rollCage ? 30 * this.body.armorWeight : 0)
                + (this.bodyBlades ? this.bodyBladeWeight() : 0)
                + (this.brushcutter ? 20 : 0)
                + (this.bumperSpikes ? Math.ceil(5 * this.body.armorWeight * this.armorTypeToMatch().weightFactor - 0.0001) : 0)
                + (this.backBumperSpikes ? Math.ceil(5 * this.body.armorWeight * this.armorTypeToMatch().weightFactor - 0.0001) : 0)
                + (this.ramplate ? this.ramplateWeight() : 0)
                + (this.fakeRamplate ? Math.ceil(5 * this.body.armorWeight * this.armorTypeToMatch().weightFactor - 0.0001) : 0)
                + (this.convertibleHardtop ? 50 : 0)
                + (this.sunroof ? 25 : 0)
                + (this.hitch ? this.hitch.totalWeight() : 0)
                + this.stealthKoteLocations.length * this.body.armorWeight
                + this.reservedWeight;

            this.totalCost = this.modifiedBodyCost() + Math.round(this.modifiedBodyCost() * this.chassis.costFactor)
                + Math.round(this.modifiedBodyCost() * this.suspension.costFactor)
                + (this.streamlined ? Math.round(this.modifiedBodyCost() / 2) : 0)
                + (this.middleOrOuterTires ? Math.ceil(this.middleTireCount() * this.middleOrOuterTires.totalCost() - 0.0001) : 0)
                + (this.frontTires ? Math.ceil(this.frontTireCount() * this.frontTires.totalCost() - 0.0001) : 0)
                + Math.ceil(this.backTireCount() * this.backTires.totalCost() - 0.0001)
                + this.extraWheelCost()
                + (this.engine ? this.engine.totalCost(this.tireCount()) + (this.gasTank ? this.gasTank.totalCost() : 0) : 0)
                + (this.crewCompartmentCA ? this.crewCompartmentCA.totalCost() : 0)
                + (!this.frontWheelguards ? 0 : this.frontWheelguards.totalCost() * this.frontExposedTireCount())
                + (!this.backWheelguards ? 0 : this.backWheelguards.totalCost() * this.backExposedTireCount())
                + (!this.middleWheelguards ? 0 : this.middleWheelguards.totalCost() * this.middleTireCount())
                + (!this.frontWheelhubs ? 0 : this.frontWheelhubs.totalCost() * this.frontExposedTireCount())
                + (!this.backWheelhubs ? 0 : this.backWheelhubs.totalCost() * this.backExposedTireCount())
                + (!this.middleWheelhubs ? 0 : this.middleWheelhubs.totalCost() * this.middleTireCount())
                + (!this.topTurret ? 0 : this.topTurret.totalCost())
                + (!this.sideTurret ? 0 : this.sideTurret.totalCost()*2)
                + (this.heavyDutyShocks ? this.tireCount() * 400 : 0)
                + (this.heavyDutyBrakes ? this.tireCount() * 100 : 0)
                + (this.antilockBrakes ? 1000 : 0)
                + (this.heavyDutyTransmission ? this.modifiedBodyCost() + Math.round(this.modifiedBodyCost() * this.chassis.costFactor) : 0)
                + (this.activeSuspension ? 4000 : 0)
                + (this.rollCage ? 900 : 0)
                + (this.overdrive ? this.tireCount() * 100 : 0)
                + (this.bodyBlades ? this.bodyBladeCost() : 0)
                + (this.fakeBodyBlades ? 20 : 0)
                + (this.brushcutter ? 100 : 0)
                + (this.bumperSpikes ? Math.ceil(5 * this.body.armorCost * this.armorTypeToMatch().costFactor - 0.0001) : 0)
                + (this.backBumperSpikes ? Math.ceil(5 * this.body.armorCost * this.armorTypeToMatch().costFactor - 0.0001) : 0)
                + (this.ramplate ? this.ramplateCost() : 0)
                + (this.fakeRamplate ? this.fakeRamplateCost() : 0)
                + (this.convertibleHardtop ? 1500 : 0)
                + (this.sunroof ? 500 : 0)
                + (this.noPaintWindshield ? 1000 : 0)
                + this.links.length * 50 + this.smartLinks.length * 500
                + (this.hitch ? this.hitch.totalCost() : 0)
                + this.stealthKoteLocations.length * 10 * this.body.armorCost;
            this.spaceUsed = (this.engine ? this.engine.totalSpace() + (this.gasTank ? this.gasTank.totalSpace() : 0) : 0)
                + (!this.topTurret ? 0 : this.topTurret.totalSpace())
                + (!this.sideTurret ? 0 : this.sideTurret.totalSpace()*2)
                + (this.crewCompartmentCA ? this.crewCompartmentCA.totalSpace() : 0)
                + (this.heavyDutyTransmission ? 2 : 0)
                + (this.rollCage ? 1 : 0)
                + (this.convertibleHardtop ? (this.body.name === "Pickup" ? 2 : Math.ceil(this.modifiedSpaceAvailable / 6 - 0.0001)) : 0)
                + this.reservedSpace;
            this.cargoSpaceUsed = 0;

            var plasticPoints = this.plasticArmorPoints();
            var metalPoints = this.metalArmorPoints();
            this.weightUsed += Math.ceil(plasticPoints * (this.frontArmor.plasticType ? this.frontArmor.plasticType.weightFactor : 0) * this.body.armorWeight - 0.0001);
            this.weightUsed += Math.ceil(metalPoints * (this.frontArmor.metalType ? this.frontArmor.metalType.weightFactor : 0) * this.body.armorWeight - 0.0001);
            this.totalCost += Math.ceil(plasticPoints * (this.frontArmor.plasticType ? this.frontArmor.plasticType.costFactor : 0) * (this.sloped ? 1.1 : 1) * this.body.armorCost - 0.0001);
            this.totalCost += Math.ceil(metalPoints * (this.frontArmor.metalType ? this.frontArmor.metalType.costFactor : 0) * (this.sloped ? 1.1 : 1) * this.body.armorCost - 0.0001);


            for (i = 0; i < this.crew.length; i++) {
                this.weightUsed += this.crew[i].totalWeight(this.personalEquipmentWeight);
                this.spaceUsed += this.crew[i].totalSpace();
                this.totalCost += this.crew[i].totalCost();
            }
            gear = 0;
            gearLimit = 0;
            for (i = 0; i < this.passengers.length; i++) {
                if (this.type === 'Bus') {
                    gearLimit += 50;
                    temp = this.passengers[i].totalWeight(false);
                    if (this.personalEquipmentWeight) gear += this.passengers[i].totalWeight(true) - temp;
                    temp += 50;
                } else {
                    temp = this.passengers[i].totalWeight(this.personalEquipmentWeight);
                }
                this.weightUsed += temp;
                temp = this.passengers[i].totalSpace();
                if (this.type === 'SemiTractor' || this.type === 'SemiTrailer' || this.type === 'Bus') temp += 1;
                if (this.type !== 'Cycle' || i > 0)
                    allocateCargo.apply(this, [temp]);
                this.totalCost += this.passengers[i].totalCost();
            }
            if(this.type === 'Bus') {
                this.busExcessCargo = Math.max(0, gear - gearLimit);
                this.weightUsed += this.busExcessCargo;
            }
            for (i = 0; i < this.accessories.length; i++) {
                this.weightUsed += Math.ceil(this.accessories[i].totalWeight() - 0.0001);
                if (this.accessories[i].cargo)
                    allocateCargo.apply(this, [this.accessories[i].totalSpace()]);
                else
                    this.spaceUsed += this.accessories[i].totalSpace();
                this.totalCost += Math.ceil(this.accessories[i].totalCost() - 0.0001);
                if (/Car Top Carrier/.test(this.accessories[i].name)) carTopCarrier = true;
            }
            for (i = 0; i < this.boosters.length; i++) {
                this.weightUsed += this.boosters[i].totalWeight();
                this.spaceUsed += this.boosters[i].totalSpace();
                this.totalCost += this.boosters[i].totalCost();
            }
            applyWeapons(this, this.frontWeapons);
            applyWeapons(this, this.leftWeapons);
            applyWeapons(this, this.rightWeapons);
            applyWeapons(this, this.topWeapons);
            applyWeapons(this, this.underbodyWeapons);
            applyWeapons(this, this.backWeapons);
            applyWeapons(this, this.frontLeftWeapons); // Corner Mounts
            applyWeapons(this, this.frontRightWeapons);
            applyWeapons(this, this.backLeftWeapons);
            applyWeapons(this, this.backRightWeapons);
            if (this.hasOversizeWeaponFacings()) {
                applyWeapons(this, this.topBackWeapons); // Split facings
                applyWeapons(this, this.underbodyBackWeapons);
                applyWeapons(this, this.leftBackWeapons);
                applyWeapons(this, this.rightBackWeapons);
            }
            this.spoilerWeight = 0;
            this.spoilerCost = 0;
            this.airdamWeight = 0;
            this.airdamCost = 0;
            if (this.spoiler) {
                this.spoilerCost = Math.ceil(25 * this.body.armorCost * this.armorTypeToMatch().costFactor - 0.0001);
                this.spoilerWeight = Math.ceil(10 * this.body.armorWeight * this.armorTypeToMatch().weightFactor - 0.0001);
            }
            if (this.airdam) {
                this.airdamCost = Math.ceil(25 * this.body.armorCost * this.armorTypeToMatch().costFactor - 0.0001);
                this.airdamWeight = Math.ceil(10 * this.body.armorWeight * this.armorTypeToMatch().weightFactor - 0.0001);
            }
            if (this.techLevel === 'All') {
                if (this.spoiler && this.backArmor.metalPoints > 0) {
                    this.spoilerCost = Math.ceil(10 * this.body.armorCost * this.backArmor.metalType.costFactor - 0.0001);
                    this.spoilerWeight = Math.ceil(2 * this.body.armorWeight * this.backArmor.metalType.weightFactor - 0.0001);
                }
                if (this.airdam && this.frontArmor.metalPoints > 0) {
                    this.airdamCost = Math.ceil(10 * this.body.armorCost * this.frontArmor.metalType.costFactor - 0.0001);
                    this.airdamWeight = Math.ceil(2 * this.body.armorWeight * this.frontArmor.metalType.weightFactor - 0.0001);
                }
            }
            this.totalCost += this.airdamCost + this.spoilerCost;
            this.weightUsed += this.airdamWeight + this.spoilerWeight;

            this.spaceUsed = roundIfClose(this.spaceUsed);
            this.recalculateAccessories();

            // Movement & Handling
            this.modifiedHandlingClass = this.suspension.hc;
            if (this.body.name === "Van") {
                this.modifiedHandlingClass -= 1;
            } else if (this.body.name === "Pickup" || this.body.name === "Camper") {
                if (this.weightUsed > 5500) {
                    this.modifiedHandlingClass -= 1;
                }
            } else if (this.body.name === "Subcompact") {
                this.modifiedHandlingClass += 1;
            } else if (this.body.racingFrame) {
                if (this.body.name === "Formula One/Indy") {
                    this.modifiedHandlingClass = 6;
                } else {
                    this.modifiedHandlingClass = 5;
                }
            }
            if (this.allTiresAreRadial()) {
                this.modifiedHandlingClass += 1;
            } else {
                if (this.frontTires && this.frontTires.slick && !this.frontTires.tireChains) {
                    this.modifiedHandlingClass += 1;
                }
                if (this.backTires.slick && (!this.middleOrOuterTires || (this.middleOrOuterTires.slick && !this.middleOrOuterTires.tireChains))
                    && !this.backTires.tireChains) {
                    this.modifiedHandlingClass += 1;
                }
            }
            if ((this.frontTires && this.frontTires.tireChains) || this.backTires.tireChains || (this.middleOrOuterTires && this.middleOrOuterTires.tireChains)) {
                this.modifiedHandlingClass -= 1;
            }
            if (this.activeSuspension) this.modifiedHandlingClass += 1;
            if (this.frontWheelguards && !this.frontWheelguards.fake && !this.frontWheelguards.motorcycle
                && this.type !== 'SemiTractor' && this.type !== 'Bus' && this.type !== 'SemiTrailer' && this.type !== 'TenWheeler') {
                this.modifiedHandlingClass -= 1;
            }

            if (this.engine) {
                var useWeight = this.weightUsed - this.reservedWeight;
                if (this.engine.truck) {
                    this.maxEffectiveWeight = Math.min(this.modifiedMaxWeight, this.engine.modifiedMaxLoad());
                    this.currentAcceleration = 2.5;
                    this.loadedAcceleration = this.modifiedMaxWeight > this.engine.modifiedMaxLoad() ? 0 : 2.5;
                    this.towCapacity = Math.max(0, this.engine.modifiedMaxLoad() - useWeight);
                    this.baseAcceleration = this.currentAcceleration;
                    this.displayAcceleration = "2.5/5";
                    speed = this.engine.calculateTopSpeed(useWeight);
                    this.currentTopSpeed = 2.5 * Math.floor(speed / 2.5 + 0.0001);
                    //                this.loadedTopSpeed = 100;      Technically true, if pulling a loaded trailer
                    speed = this.engine.calculateTopSpeed(this.modifiedMaxWeight);
                    this.loadedTopSpeed = 2.5 * Math.floor(speed / 2.5 + 0.0001);
                    if (!this.engine.electric) {
                        this.modifiedMPG = this.engine.totalMPG();
                        //if(this.streamlined) this.modifiedMPG = Math.floor(this.modifiedMPG*1.1);
                    }
                } else {
                    var pf = this.engine.totalPowerFactors();
                    var maxPower = pf * (this.heavyDutyTransmission ? 6 : 3);
                    var useMaxWeight = this.modifiedMaxWeight + (this.sidecar ? this.sidecar.maxWeight : 0);
                    if (this.heavyDutyTransmission || maxPower < useMaxWeight)
                        this.enginePowerRating = Math.floor(maxPower * 100 / useMaxWeight);
                    else if (pf * 2 < useMaxWeight)
                        this.enginePowerRating = 100 + Math.floor((pf - useMaxWeight / 3) * 600 / useMaxWeight);
                    else if (pf < useMaxWeight)
                        this.enginePowerRating = 200 + Math.floor((pf - useMaxWeight / 2) * 200 / useMaxWeight);
                    else if (this.body.name === "Dragster" || this.body.name === "Funny Car" && pf >= useMaxWeight * 2)
                        this.enginePowerRating = 300 + Math.floor(pf * 50 / useMaxWeight);
                    else
                        this.enginePowerRating = 200 + Math.floor(pf * 100 / useMaxWeight);
                    this.maxEffectiveWeight = Math.min(this.modifiedMaxWeight, maxPower);

                    useWeight = useWeight + (this.sidecar ? this.sidecar.totalWeight() : 0);
                    this.towCapacity = Math.max(0, maxPower - useWeight);

                    if (pf < useWeight / 3) this.currentAcceleration = 0;
                    else if (pf < useWeight / 2) this.currentAcceleration = 5;
                    else if (pf < useWeight) this.currentAcceleration = 10;
                    else if ((this.body.name === "Dragster" || this.body.name === "Funny Car") && pf >= useWeight * 2) this.currentAcceleration = 20;
                    else this.currentAcceleration = 15;
                    var tempWeight = Math.min(this.modifiedMaxWeight + (this.sidecar ? this.sidecar.maxWeight : 0), pf * (this.heavyDutyTransmission ? 6 : 3));
                    if (pf < tempWeight / 3) this.loadedAcceleration = 0; // Should never happen
                    else if (pf < tempWeight / 2) this.loadedAcceleration = 5;
                    else if (pf < tempWeight) this.loadedAcceleration = 10;
                    else if ((this.body.name === "Dragster" || this.body.name === "Funny Car") && pf >= tempWeight * 2) this.loadedAcceleration = 20;
                    else this.loadedAcceleration = 15;
                    this.baseAcceleration = this.currentAcceleration;
                    if (this.engine.supercharger) {
                        if (this.currentAcceleration > 0) this.currentAcceleration += 5;
                        if (this.loadedAcceleration > 0) this.loadedAcceleration += 5;
                    }
                    if (this.engine.variablePitchTurbocharger) {
                        if (this.currentAcceleration > 0) this.currentAcceleration += 5;
                        if (this.loadedAcceleration > 0) this.loadedAcceleration += 5;
                    }
                    if (this.engine.turbocharger || this.engine.highTorqueMotors) {
                        if (this.currentAcceleration > 0) this.displayAcceleration = this.currentAcceleration + "/" + (this.currentAcceleration + 5);
                    } else if (this.engine.heavyDutyHighTorqueMotors) {
                        if (this.currentAcceleration > 0) this.displayAcceleration = this.currentAcceleration + "/" + (this.currentAcceleration * 2);
                    } else {
                        this.displayAcceleration = this.currentAcceleration + "";
                    }
                    if (this.heavyDutyTransmission) {
                        if (pf * 6 >= useWeight) {
                            this.currentAcceleration = 2.5;
                            this.displayAcceleration = "2.5/5";
                        }
                        if (pf * 6 >= this.modifiedMaxWeight) {
                            this.loadedAcceleration = 2.5;
                        }
                    }
                    if ((this.topTurret && this.topTurret.isEWP()) ||
                        (this.sideTurret && this.sideTurret.isEWP()) ||
                        (this.sideBackTurret && this.sideBackTurret.isEWP())) {
                        modifier -= 0.1;
                    }
                    if (carTopCarrier) {
                        modifier -= 0.1;
                    }
                    if (this.streamlined) modifier += 0.1;
                    if (this.windshell) modifier += 0.1;

                    speed = this.engine.calculateTopSpeed(useWeight);
                    if (modifier !== 0) speed = speed * (1 + modifier);
                    this.currentTopSpeed = 2.5 * Math.floor(speed / 2.5 + 0.0001);
                    speed = this.engine.calculateTopSpeed(Math.min(this.modifiedMaxWeight + (this.sidecar ? this.sidecar.maxWeight : 0), pf * (this.heavyDutyTransmission ? 6 : 3)));
                    if (modifier !== 0) speed = speed * (1 + modifier);
                    this.loadedTopSpeed = 2.5 * Math.floor(speed / 2.5 + 0.0001);
                    if ((this.frontTires && this.frontTires.tireChains) || this.backTires.tireChains || (this.middleOrOuterTires && this.middleOrOuterTires.tireChains)) {
                        this.currentTopSpeed -= 10;
                        this.loadedTopSpeed -= 10;
                    }

                    if (!this.engine.electric) {
                        this.modifiedMPG = this.engine.totalMPG();
                        if (this.streamlined) this.modifiedMPG = Math.floor(this.modifiedMPG * 1.1);
                    }
                }
            } else {
                this.maxEffectiveWeight = this.modifiedMaxWeight;
            }

            this.maxWeaponSpacesPerSide = Math.floor((this.modifiedSpaceAvailable + this.modifiedCargoSpaceAvailable) / 3 + 0.0001);
        };

        vehicle.bodyName = function () {
            return this.body.name;
        };
        vehicle.setBody = function(name) {
            this.body = CW.findByName(this.bodyOptions(), name);
            this.recalculate();
        };

        vehicle.textDescription = function (suppressName) {
            return this.baseDescription(suppressName);
        };

        var combineWeapons = function (all, leftProp, rightProp, otherProp, text, textOf2, textOf3, combineIfNot3) {
            var start, same, i, location;
            if (all[leftProp].length > 0 && all[rightProp].length > 0) {
                same = all[leftProp].length === all[rightProp].length;
                if (same) {
                    for (i = 0; i < all[leftProp].length; i++) {
                        if (all[leftProp][i].compareTo(all[rightProp][i], true) !== 0 || all[leftProp][i].count > 1) {
                            same = false;
                            break;
                        }
                    }
                }
                if (same) {
                    if (all[otherProp].length >= all[leftProp].length) {
                        start = -1;
                        for (i = 0; i < all[otherProp].length; i++) {
                            if (start < 0) {
                                if (all[leftProp][0].compareTo(all[otherProp][i], true) === 0)
                                    start = i;
                            } else if (i - start >= all[leftProp].length) {
                                break;
                            } else if (all[leftProp][i - start].compareTo(all[otherProp][i], true) !== 0) {
                                same = false;
                                break;
                            }
                        }
                    }
                    if (combineIfNot3 || same && start >= 0) {
                        for (i = 0; i < all[leftProp].length; i++) {
                            location = same && start >= 0 ? textOf3 : textOf2;
                            if (all[leftProp][i].isDischarger() && vehicle.hasOversizeWeaponFacings()) {
                                location = location.replace("Left Front", "Left");
                                location = location.replace("Right Front", "Right");
                                location = location.replace("Left Back", "Left");
                                location = location.replace("Right Back", "Right");
                            }
                            text += all[leftProp][i].textDescription(true, location) + ", ";
                        }
                        if (same && start >= 0) all[otherProp].splice(start, all[leftProp].length);
                        all[leftProp] = [];
                        all[rightProp] = [];
                    }
                }
            }
            return text;
        };
        var hasMultipleLocations = function (type) {
            return (type.left > 0 ? 1 : 0) + (type.right > 0 ? 1 : 0) + (type.top > 0 ? 1 : 0) + (type.underbody > 0 ? 1 : 0) + (type.front > 0 ? 1 : 0) + (type.back > 0 ? 1 : 0) > 1;
        };
        var clearFromList = function (list, abbv) {
            for (var i = list.length - 1; i >= 0; i--)
                if (list[i].abbv === abbv) list.splice(i, 1);
        };
        var processSide = function (all, property, types) {
            var i, temp, key;
            for (i = all[property].length - 1; i >= 0; i--)
                if (all[property][i].isDischarger()) {
                    key = all[property][i].abbv + (all[property][i].bumperTrigger ? "_BT" : '');
                    temp = types[key];
                    if (!temp) {
                        temp = {left: 0, right: 0, top: 0, underbody: 0, front: 0, back: 0, first: all[property][i], mixed: false};
                        types[key] = temp;
                    } else {
                        if (all[property][i].compareTo(temp.first, true, true) !== 0) temp.mixed = true;
                    }
                    temp[property.substr(0, property.indexOf('Weapons'))] += all[property][i].count;
                }
        };
        var findDischargers = function (all) {
            var i, types = {}, text = '', first;
            processSide(all, 'leftWeapons', types);
            processSide(all, 'rightWeapons', types);
            processSide(all, 'frontWeapons', types);
            processSide(all, 'backWeapons', types);
            processSide(all, 'topWeapons', types);
            processSide(all, 'underbodyWeapons', types);
            for (i in types)
                if (types.hasOwnProperty(i))
                    if (!types[i].mixed && hasMultipleLocations(types[i])) {
                        text += types[i].first.textDescription(true, '') + "(";
                        first = true;
                        if (types[i].front > 0) {
                            if (first) first = false;
                            else text += ', ';
                            text += types[i].front + " Front";
                            clearFromList(all.frontWeapons, types[i].first.abbv);
                        }
                        if (types[i].back > 0) {
                            if (first) first = false;
                            else text += ', ';
                            text += types[i].back + " Back";
                            clearFromList(all.backWeapons, types[i].first.abbv);
                        }
                        if (types[i].left > 0) {
                            if (first) first = false;
                            else text += ', ';
                            text += types[i].left + " Left";
                            clearFromList(all.leftWeapons, types[i].first.abbv);
                        }
                        if (types[i].right > 0) {
                            if (first) first = false;
                            else text += ', ';
                            text += types[i].right + " Right";
                            clearFromList(all.rightWeapons, types[i].first.abbv);
                        }
                        if (types[i].top > 0) {
                            if (first) first = false;
                            else text += ', ';
                            text += types[i].top + " Top";
                            clearFromList(all.topWeapons, types[i].first.abbv);
                        }
                        if (types[i].underbody > 0) {
                            if (first) first = false;
                            else text += ', ';
                            text += types[i].underbody + " Underbody";
                            clearFromList(all.underbodyWeapons, types[i].first.abbv);
                        }
                        text += "), ";
                    }
            return text;
        };
        var allWeaponText = function (links) {
            var i, text = '', all = {}, dischargers;
            all.leftWeapons = CW.sortItems(vehicle.leftWeapons);
            all.rightWeapons = CW.sortItems(vehicle.rightWeapons);
            all.leftBackWeapons = vehicle.hasOversizeWeaponFacings() ? CW.sortItems(vehicle.leftBackWeapons) : [];
            all.rightBackWeapons = vehicle.hasOversizeWeaponFacings() ? CW.sortItems(vehicle.rightBackWeapons) : [];
            all.frontWeapons = CW.sortItems(vehicle.frontWeapons);
            all.backWeapons = CW.sortItems(vehicle.backWeapons);
            all.frontWeapons = CW.sortItems(vehicle.frontWeapons);
            all.topWeapons = CW.sortItems(vehicle.topWeapons);
            all.underbodyWeapons = CW.sortItems(vehicle.underbodyWeapons);
            dischargers = findDischargers(all);
            if (vehicle.hasOversizeWeaponFacings()) {
                text = combineWeapons(all, 'leftWeapons', 'rightWeapons', 'frontWeapons', text, "Left Front and Right Front", "Front and Left Front and Right Front", true);
            } else {
                text = combineWeapons(all, 'leftWeapons', 'rightWeapons', 'frontWeapons', text, "Left and Right", "Front and Left and Right", false);
            }
            text += CW.weaponText(all.frontWeapons, links);
            if (vehicle.hasOversizeWeaponFacings()) {
                text = combineWeapons(all, 'leftBackWeapons', 'rightBackWeapons', 'backWeapons', text, "Left Back and Right Back", "Left Back and Right Back and Back", true);
            } else {
                text = combineWeapons(all, 'leftWeapons', 'rightWeapons', 'backWeapons', text, "Left and Right", "Left and Right and Back", true);
            }
            text += CW.weaponText(all.leftWeapons, links);
            text += CW.weaponText(all.leftBackWeapons, links);
            text += CW.weaponText(all.rightWeapons, links);
            text += CW.weaponText(all.rightBackWeapons, links);
            text += CW.weaponText(all.topWeapons, links);
            if (vehicle.hasOversizeWeaponFacings()) text += CW.weaponText(vehicle.topBackWeapons, links);
            text += CW.weaponText(all.underbodyWeapons, links);
            if (vehicle.hasOversizeWeaponFacings()) text += CW.weaponText(vehicle.underbodyBackWeapons, links);
            text += CW.weaponText(all.backWeapons, links);
            for (i = 0; i < vehicle.frontLeftWeapons.length; i++) text += vehicle.frontLeftWeapons[i].textDescription() + ", ";
            for (i = 0; i < vehicle.frontRightWeapons.length; i++) text += vehicle.frontRightWeapons[i].textDescription() + ", ";
            for (i = 0; i < vehicle.backLeftWeapons.length; i++) text += vehicle.backLeftWeapons[i].textDescription() + ", ";
            for (i = 0; i < vehicle.backRightWeapons.length; i++) text += vehicle.backRightWeapons[i].textDescription() + ", ";
            return text + dischargers;
        };

        vehicle.accessoryDescription = function () {
            return '';
        };

        var crewDescription = function () {
            var i = 0, j, text = '', count, used = [], temp;
            if (vehicle.crew.length === 0) return '';
            else if (vehicle.crew.length === 1) return vehicle.crew[0].textDescription() + ", ";
            if (vehicle.crew[0].name === 'Driver') {
                text = vehicle.crew[0].textDescription() + ", ";
                i = 1;
            }
            for (; i < vehicle.crew.length; i++) {
                if (used.indexOf(i) >= 0) continue;
                temp = vehicle.crew[i].textDescription();
                count = 1;
                for (j = i + 1; j < vehicle.crew.length; j++) {
                    if (vehicle.crew[j].textDescription() === temp) {
                        count += 1;
                        used.push(j);
                    }
                }
                text += (count > 1 ? count + " " + vehicle.crew[i].textDescription(true) : temp) + ", ";
            }
            return text;
        };

        vehicle.baseDescription = function (suppressName) {
            var i, same, phrase, test;
            var text = '';
            if (!suppressName) text += this.designName + " -- ";
            if (this.streamlined) text += "Streamlined ";
            text += this.bodyName();
            if (this.carbonAluminumFrame) text += " w/CA Frame";
            text += ", ";
            if (this.type !== 'Cycle' && this.type !== 'SemiTrailer' && this.type !== 'TenWheelerCarrier')
                text += this.chassis.name + " chassis, ";
            if (this.body.racingFrame) {
                if (this.activeSuspension) text += "Active ";
                text += "Racing suspension, ";
            } else if (this.engine && !this.engine.truck) { // Exclude trucks and car/truck trailers
                text += this.suspension.name;
                if (this.activeSuspension) text += " Active";
                text += " suspension, ";
            }
            if (this.engine) {
                text += this.engine.textDescription() + ", ";
                if (!this.engine.electric) text += this.gasTank.textDescription() + ", ";
                if (this.heavyDutyTransmission) text += "Heavy-Duty Transmission, ";
            }
            if (this.tireCount() > 0) {
                if (this.backTiresSame() && !this.dragsterTires()) {
                    text += this.tireCount() + " " + (this.frontTires ? this.frontTires.textDescription() : this.backTires.textDescription()) + " tires" + ((this.frontTires && this.frontTires.tireChains) || this.backTires.tireChains ? " w/Tire Chains" : "") + ", ";
                } else {
                    text += this.frontTireCount() === 1 ? this.frontTires.textDescription() + " tire front" + (this.frontTires.tireChains ? " w/Tire Chains" : "") + ", " : this.frontTireCount() + " " + this.frontTires.textDescription() + " tires front" + (this.frontTires.tireChains ? " w/Tire Chains" : "") + ", ";
                    if (!this.middleOrOuterTires) {
                        text += this.backTireCount() === 1 ? this.backTires.textDescription() + " tire back" + (this.backTires.tireChains ? " w/Tire Chains" : "") + ", " : this.backTireCount() + " " + this.backTires.textDescription() + " tires back" + (this.backTires.tireChains ? " w/Tire Chains" : "") + ", ";
                    } else if (this.thirdRowTiresInMiddle) {
                        text += this.middleTireCount() + " " + this.middleOrOuterTires.textDescription() + " tires middle" + (this.middleOrOuterTires.tireChains ? " w/Tire Chains" : "") + ", ";
                        text += this.backTireCount() === 1 ? this.backTires.textDescription() + " tire back" + (this.backTires.tireChains ? " w/Tire Chains" : "") + ", " : this.backTireCount() + " " + this.backTires.textDescription() + " tires back" + (this.backTires.tireChains ? " w/Tire Chains" : "") + ", ";
                    } else {
                        text += this.backTireCount() + " " + this.backTires.textDescription() + " tires back inner" + (this.backTires.tireChains ? " w/Tire Chains" : "") + ", ";
                        text += this.middleTireCount() + " " + this.middleOrOuterTires.textDescription() + " tires back outer" + (this.middleOrOuterTires.tireChains ? " w/Tire Chains" : "") + ", ";
                    }
                }
            }
            text += crewDescription();
            if (this.crewCompartmentCA) text += this.crewCompartmentCA.textDescription() + " on crew, ";
            same = 0;
            for (i = 1; i < this.passengers.length; i++) {
                if (this.passengers[i].textDescription() === this.passengers[0].textDescription())
                    same += 1;
                else
                    text += this.passengers[i].textDescription() + ", ";
            }
            if (this.passengers.length > 0) {
                if (same > 0) text += (same + 1) + " " + this.passengers[0].textDescription(true) + ", ";
                else text += this.passengers[0].textDescription() + ", ";
            }
            var links = this.links.slice(0);
            if (this.topTurret) text += this.topTurret.textDescription(this.hasOversizeWeaponFacings() ? 'Top Front' : 'Top', this.weightUsed, links) + ", ";
            if (this.hasOversizeWeaponFacings() && this.topBackTurret) text += this.topBackTurret.textDescription('Top Back', this.weightUsed, links) + ", ";
            if (this.sideTurret) {
                text += this.sideTurret.textDescription(this.hasOversizeWeaponFacings() ? 'Left Front and Right Front' : 'Left and Right', this.weightUsed, links) + ", ";
            }
            if (this.hasOversizeWeaponFacings() && this.sideBackTurret) {
                text += this.sideBackTurret.textDescription('Left Back and Right Back', this.weightUsed, links) + ", ";
            }
            // Remove any links that the sidecar is going to consume later
            if(this.sidecar && this.sidecar.topTurret) this.sidecar.topTurret.textDescription("Top", 1000, links);

            text += allWeaponText(links);
            for (i = 0; i < this.boosters.length; i++) text += this.boosters[i].textDescription(this.weightUsed) + ", ";
            if (this.heavyDutyShocks) text += "Heavy-Duty Shocks, ";
            if (this.heavyDutyBrakes) text += "Heavy-Duty Brakes, ";
            if (this.antilockBrakes) text += "Antilock Brakes, ";
            if (this.overdrive) text += "Overdrive, ";
            if (this.rollCage) text += "Roll Cage, ";
            if (this.convertibleHardtop) text += "Convertible Hardtop, ";
            if (this.sunroof) text += "Sunroof, ";
            if (this.spoiler) {
                if (this.techLevel === 'All' && this.backArmor.metalPoints > 0) text += "Metal ";
                text += "Spoiler, ";
            }
            if (this.airdam) {
                if (this.techLevel === 'All' && this.frontArmor.metalPoints > 0) text += "Metal ";
                text += "Airdam, ";
            }
            if (this.bodyBlades) text += this.bodyBladeText() + ", ";
            if (this.fakeBodyBlades) text += "Fake " + this.bodyBladeText() + ", ";
            if (this.brushcutter) text += "Brushcutter, ";
            if (this.bumperSpikes) text += "Bumper Spikes (Front), ";
            if (this.backBumperSpikes) text += "Bumper Spikes (Back), ";
            if (this.noPaintWindshield) text += "No-Paint Windshield, ";
            text += this.accessoryDescription();
            var totalWeight = this.weightUsed + (this.sidecar ? this.sidecar.totalWeight() : 0);
            if (this.hitch) text += this.hitch.textDescription() + " (Tow Capacity " + Math.min(this.hitch.loadWeight, this.towCapacity) + " lbs.), ";
            for (i = 0; i < this.accessories.length; i++) {
                text += this.accessories[i].textDescription() + ", ";
            }
            for (i = 0; i < links.length; i++) text += links[i].textDescription() + ", ";
            for (i = 0; i < this.smartLinks.length; i++) text += this.smartLinks[i].textDescription() + ", ";
            if (this.stealthKoteLocations.length > 0) {
                text += "StealthKote Shield (";
                for (i = 0; i < this.stealthKoteLocations.length; i++) {
                    if (i > 0) text += ", ";
                    text += this.stealthKoteLocations[i];
                }
                text += "), ";
            }
            var composite = this.compositeArmor();
            if (this.sloped) text += "Sloped ";
            var flatbed = /Flatbed/.test(this.body.name);
            if (flatbed) text += "Box ";
            text += this.armorDescription() + ": ";
            if (this.frontArmor.present()) {
                text += "F" + this.frontArmor.armorPointDescription(composite);
                if (this.stealthKoteIn('Front')) text += "+1SK";
                if (this.ramplate) text += " (Ramplate)";
                if (this.fakeRamplate) text += " (Fake Ramplate)";
            }
            var oversize = this.hasOversizeWeaponFacings();
            if (this.leftArmor.present() || this.stealthKoteIn('Left')) {
                text += ", L" + (oversize ? "F" : "") + this.leftArmor.armorPointDescription(composite);
                if (this.stealthKoteIn('Left')) text += "+1SK";
            }
            if (oversize && (this.leftBackArmor.present() || this.stealthKoteIn('LeftBack'))) {
                text += ", LB" + this.leftBackArmor.armorPointDescription(composite);
                if (this.stealthKoteIn('LeftBack')) text += "+1SK";
            }
            if (this.rightArmor.present() || this.stealthKoteIn('Right')) {
                text += ", R" + (oversize ? "F" : "") + this.rightArmor.armorPointDescription(composite);
                if (this.stealthKoteIn('Right')) text += "+1SK";
            }
            if (oversize && (this.rightBackArmor.present() || this.stealthKoteIn('RightBack'))) {
                text += ", RB" + this.rightBackArmor.armorPointDescription(composite);
                if (this.stealthKoteIn('RightBack')) text += "+1SK";
            }
            if (this.backArmor.present() || this.stealthKoteIn('Back')) {
                text += ", B" + this.backArmor.armorPointDescription(composite);
                if (this.stealthKoteIn('Back')) text += "+1SK";
            }
            if (this.topArmor.present() || this.stealthKoteIn('Top')) {
                text += ", T" + (oversize ? "F" : "") + this.topArmor.armorPointDescription(composite);
                if (this.stealthKoteIn('Top')) text += "+1SK";
            }
            if (oversize && (this.topBackArmor.present() || this.stealthKoteIn('TopBack'))) {
                text += ", TB" + this.topBackArmor.armorPointDescription(composite);
                if (this.stealthKoteIn('TopBack')) text += "+1SK";
            }
            if (this.underbodyArmor.present() || this.stealthKoteIn('Underbody')) {
                text += ", U" + (oversize ? "F" : "") + this.underbodyArmor.armorPointDescription(composite);
                if (this.stealthKoteIn('Underbody')) text += "+1SK";
            }
            if (oversize && (this.underbodyBackArmor.present() || this.stealthKoteIn('UnderbodyBack'))) {
                text += ", UB" + this.underbodyBackArmor.armorPointDescription(composite);
                if (this.stealthKoteIn('UnderbodyBack')) text += "+1SK";
            }
            if (flatbed) {
                if (this.isOversize()) {
                    if((this.flatbedArmor && this.flatbedArmor.present()) || (this.flatbedBackArmor && this.flatbedBackArmor.present())) {
                        text += ", "+(this.isDualFlatbed() ? "Lower " : "")+"Bed ";
                        if (this.flatbedArmor && this.flatbedArmor.present()) text += "F " + this.flatbedArmor.armorPointDescription(composite);
                        if (this.flatbedBackArmor && this.flatbedBackArmor.present()) {
                            if(this.flatbedArmor && this.flatbedArmor.present()) text += ", ";
                            text += "B " + this.flatbedBackArmor.armorPointDescription(composite);
                        }
                    }
                    if (this.isDualFlatbed()) {
                        if((this.upperFlatbedArmor && this.upperFlatbedArmor.present())||(this.upperFlatbedBackArmor && this.upperFlatbedBackArmor.present())) {
                            text += ", Upper Bed ";
                            if (this.upperFlatbedArmor && this.upperFlatbedArmor.present()) text += "F " + this.upperFlatbedArmor.armorPointDescription(composite);
                            if (this.upperFlatbedBackArmor && this.upperFlatbedBackArmor.present()) {
                                if(this.upperFlatbedArmor && this.upperFlatbedArmor.present()) text += ", ";
                                text += "B " + this.upperFlatbedBackArmor.armorPointDescription(composite);
                            }
                        }
                    }
                } else if (this.flatbedArmor && this.flatbedArmor.present()) text += ", Bed " + this.flatbedArmor.armorPointDescription(composite);
            }
            text += ", ";

            if (this.frontWheelguards || this.backWheelguards || this.middleWheelguards) {
                same = true;
                if (!this.middleOrOuterTires || !this.thirdRowTiresInMiddle) {
                    if (!this.frontWheelguards || !this.backWheelguards || !this.frontWheelguards.sameAs(this.backWheelguards)) {
                        same = false;
                    }
                    if (same) {
                        text += (this.frontExposedTireCount() + this.backExposedTireCount()) + " " + this.frontWheelguards.textDescription() + " Wheelguards, ";
                    }
                } else {
                    if (!this.frontWheelguards || !this.backWheelguards || !this.middleWheelguards || !this.frontWheelguards.sameAs(this.backWheelguards) || !this.frontWheelguards.sameAs(this.middleWheelguards)) {
                        same = false;
                    }
                    if (same) {
                        text += (this.frontExposedTireCount() + this.middleTireCount() + this.backExposedTireCount()) + " " + this.frontWheelguards.textDescription() + " Wheelguards, ";
                    }
                }
                if (!same) {
                    if (this.frontWheelguards && this.frontExposedTireCount() > 0) text += (this.frontExposedTireCount() > 1 ? this.frontExposedTireCount() + " " : "") + this.frontWheelguards.textDescription() + " Wheelguard" + (this.frontExposedTireCount() === 1 ? "" : "s") + " Front, ";
                    if (this.middleWheelguards && this.middleTireCount() > 0) text += this.middleTireCount() + " " + this.middleWheelguards.textDescription() + " Wheelguard" + (this.middleTireCount() === 1 ? "" : "s") + " Middle, ";
                    if (this.backWheelguards && this.backExposedTireCount() > 0) text += (this.backExposedTireCount() > 1 ? this.backExposedTireCount() + " " : "") + this.backWheelguards.textDescription() + " Wheelguard" + (this.backExposedTireCount() === 1 ? "" : "s") + " Back, ";
                }
            }
            if (this.frontWheelhubs || this.backWheelhubs || this.middleWheelhubs) {
                same = true;
                if (!this.middleOrOuterTires || !this.thirdRowTiresInMiddle) {
                    if (!this.frontWheelhubs || !this.backWheelhubs || !this.frontWheelhubs.sameAs(this.backWheelhubs)) {
                        same = false;
                    }
                    if (same) {
                        text += (this.frontExposedTireCount() + this.backExposedTireCount()) + " " + this.frontWheelhubs.textDescription() + " Wheelhub"+(this.frontWheelhubs.motorcycle ? " pairs" : "s")+", ";
                    }
                } else {
                    if (!this.frontWheelhubs || !this.backWheelhubs || !this.middleWheelhubs || !this.frontWheelhubs.sameAs(this.backWheelhubs) || !this.frontWheelhubs.sameAs(this.middleWheelhubs)) {
                        same = false;
                    }
                    if (same) {
                        text += (this.frontExposedTireCount() + this.middleTireCount() + this.backExposedTireCount()) + " " + this.frontWheelhubs.textDescription() + " Wheelhubs, ";
                    }
                }
                if (!same) {
                    if (this.frontWheelhubs && this.frontExposedTireCount() > 0) text += (this.frontExposedTireCount() > 1 ? this.frontExposedTireCount() + " " : "") + this.frontWheelhubs.textDescription() + " Wheelhub" + (this.frontExposedTireCount() === 1 ? this.frontWheelhubs.motorcycle && (this.type === 'Cycle' || (this.type === 'Trike' && !this.reversed)) ? " pair" : "" : "s") + " Front, ";
                    if (this.middleWheelhubs && this.middleTireCount() > 0) text += this.middleTireCount() + " " + this.middleWheelhubs.textDescription() + " Wheelhub" + (this.middleTireCount() === 1 ? "" : "s") + " Middle, ";
                    if (this.backWheelhubs && this.backExposedTireCount() > 0) text += (this.backExposedTireCount() > 1 ? this.backExposedTireCount() + " " : "") + this.backWheelhubs.textDescription() + " Wheelhub" + (this.backExposedTireCount() === 1 ? this.backWheelhubs.motorcycle && (this.type === 'Cycle' || (this.type === 'Trike' && this.reversed)) ? " pair" : "" : "s") + " Back, ";
                }
            }
            //TODO: tow, range
            var cargo, accCap;
            var useTotalWeight = this.weightUsed - this.reservedWeight;
            var useTotalSpace = this.spaceUsed - this.reservedSpace;
            var safes = this.accessoryCargoSpace();
            if (this.sidecar) {
                var pfLimit = this.engine.totalPowerFactors() * 3;
                if (totalWeight < pfLimit - 5 && useTotalWeight <= this.maxEffectiveWeight - 5) {
                    cargo = Math.round((this.modifiedSpaceAvailable - useTotalSpace) * 100) / 100;
                    var cargoWeight = Math.min(pfLimit - totalWeight, this.maxEffectiveWeight - useTotalWeight);
                    if ((cargo >= 0.5 || !safes.empty) && cargoWeight >= 20)
                        text += "Cargo: [" + (cargo > 0 ? cargo + " space" + (cargo === 1 ? "" : "s") : '') + (!safes.empty ? (cargo > 0 ? " plus " : '') + safes.description : '') + ", " + cargoWeight + " lbs.";
                    else
                        text += "Gear Allocation: [" + cargoWeight + " lbs.";
                    if (this.loadedTopSpeed < this.currentTopSpeed) {
                        if (this.loadedAcceleration < this.currentAcceleration) {
                            text += " @ Accel " + this.loadedAcceleration + "/Top Speed " + this.loadedTopSpeed;
                        } else {
                            text += " @ Top Speed " + this.loadedTopSpeed;
                        }
                    }
                    if (this.baseAcceleration > 5) {
                        if (this.baseAcceleration === 10) accCap = this.engine.totalPowerFactors() * 2;
                        else if (this.baseAcceleration === 15) accCap = this.engine.totalPowerFactors();
                        if (accCap - 5 > useTotalWeight && accCap - useTotalWeight < cargoWeight)
                            text += " (" + (accCap - useTotalWeight) + " lbs. @ Accel " + this.currentAcceleration + ")";
                    }
                    text += "], ";
                }
            } else if (!this.engine) {
                cargo = this.modifiedSpaceAvailable + this.modifiedCargoSpaceAvailable - useTotalSpace - this.cargoSpaceUsed;
                if (this.modifiedMaxWeight) {
                    if ((cargo > 0 || !safes.empty) && this.modifiedMaxWeight > useTotalWeight)
                        text += "Cargo: [" + (cargo > 0 ? cargo + " space" + (cargo > 1 ? "s" : "") : '') + (!safes.empty ? (cargo > 0 ? " plus " : '') + safes.description : '') + ", " + (this.modifiedMaxWeight - useTotalWeight) + " lbs.], ";
                    else if (this.modifiedMaxWeight - useTotalWeight >= 5)
                        text += "Gear Allocation: [" + (this.modifiedMaxWeight - useTotalWeight) + " lbs.], ";
                } else if (cargo > 0 || !safes.empty) {
                    text += "Cargo: [" + (cargo > 0 ? cargo + " space" + (cargo > 1 ? "s" : "") : '') + (!safes.empty ? (cargo > 0 ? " plus " : '') + safes.description : '') + "], ";
                }
            } else {
                if (useTotalWeight <= this.maxEffectiveWeight - 5) {
                    cargo = Math.round((this.modifiedSpaceAvailable + this.modifiedCargoSpaceAvailable
                        - useTotalSpace - this.cargoSpaceUsed) * 100) / 100;
                    if ((cargo >= 0.5 || !safes.empty) && this.maxEffectiveWeight - useTotalWeight >= 20)
                        text += "Cargo: [" + (cargo > 0 ? cargo + " space" + (cargo === 1 ? "" : "s") : '') + (!safes.empty ? (cargo > 0 ? " plus " : '') + safes.description : '') + (this.type === 'TenWheeler' ? "], " : ", " + (this.maxEffectiveWeight - useTotalWeight) + " lbs.");
                    else if (this.type !== 'TenWheeler')
                        text += "Gear Allocation: [" + (this.maxEffectiveWeight - useTotalWeight) + " lbs.";
                    if (this.type !== 'TenWheeler') {
                        if (this.loadedTopSpeed < this.currentTopSpeed) {
                            if (this.loadedAcceleration < this.currentAcceleration) {
                                text += " @ Accel " + this.loadedAcceleration + "/Top Speed " + this.loadedTopSpeed;
                            } else {
                                text += " @ Top Speed " + this.loadedTopSpeed;
                            }
                        }
                        if (this.baseAcceleration > 5) {
                            if (this.baseAcceleration === 10) accCap = this.engine.totalPowerFactors() * 2;
                            else if (this.baseAcceleration === 15) accCap = this.engine.totalPowerFactors();
                            else if (this.baseAcceleration === 20) accCap = this.engine.totalPowerFactors() / 2;
                            if (accCap - 5 > useTotalWeight && accCap < this.maxEffectiveWeight)
                                text += " (" + (accCap - useTotalWeight) + " lbs. @ Accel " + this.currentAcceleration + ")";
                        }
                        text += "], ";
                    }
                }
            }

            if (this.engine) {
                text += "Acceleration " + this.currentAcceleration;
                phrase = "";
                if (this.engine.turbocharger || this.engine.highTorqueMotors || this.engine.heavyDutyHighTorqueMotors) {
                    if (phrase.length > 0) phrase += ", ";
                    phrase += (this.engine.heavyDutyHighTorqueMotors ? "x2" : "+5") + " w/" + (this.engine.turbocharger ? "Turbo" : this.engine.heavyDutyHighTorqueMotors ? "HDHTMs" : "HTMs");
                }
                if (phrase.length > 0) text += " (" + phrase + ")";
                text += ", Top Speed " + this.currentTopSpeed;
                if (this.overdrive) text += " +20 w/Overdrive";
                text += ", ";

                text += "HC " + this.modifiedHandlingClass;
                if (this.spoiler || this.airdam || this.windshell) text += " (" + (this.modifiedHandlingClass + 1) + " @60mph)";
                text += ", ";
            }
            text += (this.carrier ? useTotalWeight - this.carrier.weightUsed : useTotalWeight) + " lbs., ";
            text += "$" + (this.carrier ? this.totalCost - this.carrier.totalCost : this.totalCost);

            return text;
        };

        vehicle.accessoryCargoSpace = function () {
            var result = {
                total: 0,
                description: '',
                empty: true,
                cans: 0
            };
            for (var i = 0; i < this.accessories.length; i++)
                if (this.accessories[i].capacity) {
                    if (/Carrier/.test(this.accessories[i].name)) {
                        result.total += this.accessories[i].capacity;
                        if (result.description.length > 0) result.description += ", ";
                        result.description += this.accessories[i].capacity + " spaces in Car-Top Carrier";
                    } else if (/Safe/.test(this.accessories[i].name)) {
                        result.total += this.accessories[i].capacity * this.accessories[i].count;
                        if (result.description.length > 0) result.description += ", ";
                        result.description += this.accessories[i].capacity * this.accessories[i].count + " spaces in " + this.accessories[i].abbv +
                            (this.accessories[i].count > 1 ? "s" : "");
                    } else if (/Fridge/.test(this.accessories[i].abbv)) {
                        result.cans += this.accessories[i].count * this.accessories[i].capacity;
                    }
                }
            if (result.cans) {
                if (result.description.length > 0) result.description += ", ";
                result.description += result.cans + " beverages";
            }
            if (result.total > 0 || result.description.length > 0) result.empty = false;
            return result;
        };

        vehicle.totalCargoSpace = function () {
            var total = 0;
            total += Math.max(0, this.modifiedSpaceAvailable - this.spaceUsed);
            total += Math.max(0, this.modifiedCargoSpaceAvailable - this.cargoSpaceUsed);
            if (this.carrier) {
                total += Math.max(0, this.carrier.modifiedSpaceAvailable - this.carrier.spaceUsed);
                total += Math.max(0, this.carrier.modifiedCargoSpaceAvailable - this.carrier.cargoSpaceUsed);
            }
            total += this.accessoryCargoSpace().total;
            return Math.round(total * 100) / 100;
        };

        vehicle.totalCargoWeight = function () {
            var weight = this.weightUsed - this.reservedWeight + (this.sidecar ? this.sidecar.totalWeight() : 0);
            if (this.type === 'SemiTractor') {
                return Math.round(this.engine.modifiedMaxLoad() - weight);
            } else if (this.type !== 'SemiTrailer') {
                return Math.round(this.maxEffectiveWeight - weight);
            }
            return null;
        };

        vehicle.passengerCount = function() {
            var total = vehicle.passengers.length;
            if(vehicle.carrier) total += vehicle.carrier.passengers.length;
            if(vehicle.sidecar) total += vehicle.sidecar.passengers.length;
            return total;
        };

        vehicle.hasPersonalEquipment = function () {
            var i;
            for (i = 0; i < vehicle.crew.length; i++)
                if (vehicle.crew[i].hasPersonalEquipment()) return true;
            for (i = 0; i < vehicle.passengers.length; i++)
                if (vehicle.passengers[i].hasPersonalEquipment()) return true;
            if (vehicle.sidecar)
                for (i = 0; i < vehicle.sidecar.crew.length; i++)
                    if (vehicle.sidecar.crew[i].hasPersonalEquipment()) return true;
            if (vehicle.carrier) {
                for (i = 0; i < vehicle.carrier.crew.length; i++)
                    if (vehicle.carrier.crew[i].hasPersonalEquipment()) return true;
                for (i = 0; i < vehicle.carrier.passengers.length; i++)
                    if (vehicle.carrier.passengers[i].hasPersonalEquipment()) return true;
            }
            return false;
        };

        vehicle.stealthKoteIn = function (location) {
            for (var i = 0; i < this.stealthKoteLocations.length; i++)
                if (this.stealthKoteLocations[i] === location) return true;
            return false;
        };
        vehicle.addStealthKote = function (location) {
            if (!vehicle.stealthKoteIn(location)) {
                vehicle.stealthKoteLocations.push(location);
                vehicle.recalculate();
            }
        };
        vehicle.removeStealthKote = function (location) {
            for (var i = 0; i < this.stealthKoteLocations.length; i++) {
                if (this.stealthKoteLocations[i] === location) {
                    this.stealthKoteLocations.splice(i, 1);
                    this.recalculate();
                    break;
                }
            }
        };

        vehicle.walkaroundDescription = function () {
            var i, text = "", fakeCTC = false, first, count;
            //      Don't include the design name since it might be a giveaway!
            if (this.streamlined) text += "Streamlined ";
            text += this.body.name + ", ";
            if (this.suspension.offRoad) text += "Off-Road Suspension, ";
            if (this.tireCount() > 0) {
                text += this.tireCount() + (this.allTiresAreSlick() ? " racing slicks" : " tires"
                    + (this.frontTires && this.frontTires.slick ? " (racing slicks front)" : "")
                    + (this.backTires.slick && (!this.middleOrOuterTires || this.middleOrOuterTires.slick) ? " (racing slicks back)" : ""));
                if (this.frontTires && this.frontTires.tireChains) {
                    if (this.backTires.tireChains && (!this.middleOrOuterTires || this.middleOrOuterTires.tireChains)) {
                        text += " w/Tire Chains";
                    } else {
                        text += " w/Tire Chains (front)";
                    }
                } else if (this.backTires.tireChains && (!this.middleOrOuterTires || this.middleOrOuterTires.tireChains)) {
                    text += " w/Tire Chains (back)";
                }
                text += ", ";
            }
            if (this.engine)
                text += this.engine.electric ? "Electric Power Plant, " : "Gas Engine, ";
            for (i = 0; i < this.crew.length; i++) {
                text += this.crew[i].name + ", ";
            }
            count = this.passengers.length;
            for (i = 0; i < this.accessories.length; i++) {
                if (/Fake Passenger/.test(this.accessories[i].name)) {
                    count += 1;
                }
            }
            if (count > 1) text += count + " Passengers, ";
            else if (count === 1) text += "Passenger, ";
            for (i = 0; i < this.accessories.length; i++) {
                if (/Carrier/.test(this.accessories[i].name)) {
                    text += "Car-Top Carrier, ";
                    if (/Fake/.test(this.accessories[i].name)) fakeCTC = true;
                } else if (this.accessories[i].name === CW.accessories.SEARCHLIGHT.name
                    || this.accessories[i].name === CW.accessories.ARMORED_SEARCHLIGHT.name
                    || this.accessories[i].name === CW.accessories.AMPHIBIOUS_MODIFICATIONS.name
                    || this.accessories[i].name === CW.accessories.LEFT_SIDE_DOOR.name
                    || this.accessories[i].name === CW.accessories.RIGHT_SIDE_DOOR.name) {
                    text += this.accessories[i].name + ", ";
                }
            }
            if (this.sunroof) text += "Sunroof, ";

            if (this.topTurret && !fakeCTC && !/Pop-Up/.test(this.topTurret.name)) {
                text += this.topTurret.name + " Top " + (this.hasOversizeWeaponFacings() ? "Front " : "") + "with ";
                first = true;
                for (i = 0; i < this.topTurret.weapons.length; i++) {
                    if (first) first = false;
                    else text += " and ";
                    if (this.topTurret.weapons[i].count > 1) text += this.topTurret.weapons[i].count + "x ";
                    text += this.topTurret.weapons[i].walkaroundCategory();
                }
                for (i = 0; i < this.topTurret.boosters.length; i++) {
                    if (first) first = false;
                    else text += " and ";
                    text += this.topTurret.boosters[i].jumpJet ? "Jump Jets" : "Rocket Boosters";
                    if(!this.topTurret.boosters[i].bottomOrRearFacing)
                        text += " facing "+(this.topTurret.boosters[i].jumpJet ? " Top" : " Front");
                }
                text += ", ";
            }
            if (this.hasOversizeWeaponFacings() && this.topBackTurret && !/Pop-Up/.test(this.topBackTurret.name)) {
                text += this.topBackTurret.name + " Top Back with ";
                first = true;
                for (i = 0; i < this.topBackTurret.weapons.length; i++) {
                    if (first) first = false;
                    else text += " and ";
                    if (this.topBackTurret.weapons[i].count > 1) text += this.topBackTurret.weapons[i].count + "x ";
                    text += this.topBackTurret.weapons[i].walkaroundCategory();
                }
                for (i = 0; i < this.topBackTurret.boosters.length; i++) {
                    if (first) first = false;
                    else text += " and ";
                    text += this.topBackTurret.boosters[i].jumpJet ? "Jump Jets" : "Rocket Boosters";
                    if(!this.topBackTurret.boosters[i].bottomOrRearFacing)
                        text += " facing "+(this.topBackTurret.boosters[i].jumpJet ? " Top" : " Front");
                }
                text += ", ";
            }
            if (this.sideTurret) {
                text += "2 " + this.sideTurret.name + "s Left " + (this.hasOversizeWeaponFacings() ? "Front " : "") + "and Right" + (this.hasOversizeWeaponFacings() ? " Front" : "");
                first = true;
                for (i = 0; i < this.sideTurret.weapons.length; i++) {
                    if (first) {
                        text += " with ";
                        first = false;
                    } else text += " and ";
                    if (this.sideTurret.weapons[i].count > 1) text += this.sideTurret.weapons[i].count + "x ";
                    text += this.sideTurret.weapons[i].walkaroundCategory();
                }
                for (i = 0; i < this.sideTurret.boosters.length; i++) {
                    if (first) {
                        text += " with ";
                        first = false;
                    } else text += " and ";
                    text += this.sideTurret.boosters[i].jumpJet ? "Jump Jets" : "Rocket Boosters";
                    if(!this.sideTurret.boosters[i].bottomOrRearFacing)
                        text += " facing "+(this.sideTurret.boosters[i].jumpJet ? " Top" : " Front");
                }
                text += ", ";
            }
            if (this.hasOversizeWeaponFacings() && this.sideBackTurret) {
                text += "2 " + this.sideBackTurret.name + "s Left Back and Right Back";
                first = true;
                for (i = 0; i < this.sideBackTurret.weapons.length; i++) {
                    if (first) {
                        text += " with ";
                        first = false;
                    } else text += " and ";
                    if (this.sideBackTurret.weapons[i].count > 1) text += this.sideBackTurret.weapons[i].count + "x ";
                    text += this.sideBackTurret.weapons[i].walkaroundCategory();
                }
                for (i = 0; i < this.sideBackTurret.boosters.length; i++) {
                    if (first) {
                        text += " with ";
                        first = false;
                    } else text += " and ";
                    text += this.sideBackTurret.boosters[i].jumpJet ? "Jump Jets" : "Rocket Boosters";
                    if(!this.sideBackTurret.boosters[i].bottomOrRearFacing)
                        text += " facing "+(this.sideBackTurret.boosters[i].jumpJet ? " Top" : " Front");
                }
                text += ", ";
            }
            for (i = 0; i < this.frontWeapons.length; i++) {
                if (this.frontWeapons[i].concealment || this.frontWeapons[i].blowThroughConcealment) continue;
                if (this.frontWeapons[i].count > 1) text += this.frontWeapons[i].count + "x ";
                text += this.frontWeapons[i].walkaroundCategory() + " Front, ";
            }
            for (i = 0; i < this.leftWeapons.length; i++) {
                if (this.leftWeapons[i].concealment || this.leftWeapons[i].blowThroughConcealment) continue;
                if (this.leftWeapons[i].count > 1) text += this.leftWeapons[i].count + "x ";
                text += this.leftWeapons[i].walkaroundCategory() + " Left" + (this.hasOversizeWeaponFacings() ? " Front" : "") + ", ";
            }
            if (this.hasOversizeWeaponFacings())
                for (i = 0; i < this.leftBackWeapons.length; i++) {
                    if (this.leftBackWeapons[i].concealment || this.leftBackWeapons[i].blowThroughConcealment) continue;
                    if (this.leftBackWeapons[i].count > 1) text += this.leftBackWeapons[i].count + "x ";
                    text += this.leftBackWeapons[i].walkaroundCategory() + " Left Back, ";
                }
            for (i = 0; i < this.rightWeapons.length; i++) {
                if (this.rightWeapons[i].concealment || this.rightWeapons[i].blowThroughConcealment) continue;
                if (this.rightWeapons[i].count > 1) text += this.rightWeapons[i].count + "x ";
                text += this.rightWeapons[i].walkaroundCategory() + " Right" + (this.hasOversizeWeaponFacings() ? " Front" : "") + ", ";
            }
            if (this.hasOversizeWeaponFacings())
                for (i = 0; i < this.rightBackWeapons.length; i++) {
                    if (this.rightBackWeapons[i].concealment || this.rightBackWeapons[i].blowThroughConcealment) continue;
                    if (this.rightBackWeapons[i].count > 1) text += this.rightBackWeapons[i].count + "x ";
                    text += this.rightBackWeapons[i].walkaroundCategory() + " Right Back, ";
                }
            for (i = 0; i < this.backWeapons.length; i++) {
                if (this.backWeapons[i].concealment || this.backWeapons[i].blowThroughConcealment) continue;
                if (this.backWeapons[i].count > 1) text += this.backWeapons[i].count + "x ";
                text += this.backWeapons[i].walkaroundCategory() + " Back, ";
            }
            for (i = 0; i < this.topWeapons.length; i++) {
                if (this.topWeapons[i].concealment || this.topWeapons[i].blowThroughConcealment) continue;
                if (this.topWeapons[i].count > 1) text += this.topWeapons[i].count + "x ";
                text += this.topWeapons[i].walkaroundCategory() + " Top" + (this.hasOversizeWeaponFacings() ? " Front" : "") + ", ";
            }
            if (this.hasOversizeWeaponFacings())
                for (i = 0; i < this.topBackWeapons.length; i++) {
                    if (this.topBackWeapons[i].concealment || this.topBackWeapons[i].blowThroughConcealment) continue;
                    if (this.topBackWeapons[i].count > 1) text += this.topBackWeapons[i].count + "x ";
                    text += this.topBackWeapons[i].walkaroundCategory() + " Top Back, ";
                }
            for (i = 0; i < this.frontLeftWeapons.length; i++) {
                if (this.frontLeftWeapons[i].concealment || this.frontLeftWeapons[i].blowThroughConcealment) continue;
                if (this.frontLeftWeapons[i].count > 1) text += this.frontLeftWeapons[i].count + "x ";
                text += this.frontLeftWeapons[i].walkaroundCategory() + " Front Left Corner, ";
            }
            for (i = 0; i < this.frontRightWeapons.length; i++) {
                if (this.frontRightWeapons[i].concealment || this.frontRightWeapons[i].blowThroughConcealment) continue;
                if (this.frontRightWeapons[i].count > 1) text += this.frontRightWeapons[i].count + "x ";
                text += this.frontRightWeapons[i].walkaroundCategory() + " Front Right Corner, ";
            }
            for (i = 0; i < this.backLeftWeapons.length; i++) {
                if (this.backLeftWeapons[i].concealment || this.backLeftWeapons[i].blowThroughConcealment) continue;
                if (this.backLeftWeapons[i].count > 1) text += this.backLeftWeapons[i].count + "x ";
                text += this.backLeftWeapons[i].walkaroundCategory() + " Back Left Corner, ";
            }
            for (i = 0; i < this.backRightWeapons.length; i++) {
                if (this.backRightWeapons[i].concealment || this.backRightWeapons[i].blowThroughConcealment) continue;
                if (this.backRightWeapons[i].count > 1) text += this.backRightWeapons[i].count + "x ";
                text += this.backRightWeapons[i].walkaroundCategory() + " Back Right Corner, ";
            }

            for (i = 0; i < this.boosters.length; i++) {
                text += this.boosters[i].walkaroundDescription() + ", ";
            }
            if (this.spoiler) text += "Spoiler, ";
            if (this.airdam) text += "Airdam, ";
            if (this.windshell) text += "Cycle Windshell, ";
            if (this.hitch) text += this.hitch.walkaroundDescription() + ", ";
            if (this.frontWheelguards && this.backWheelguards && (this.tireCount() < 6 || this.middleWheelguards)) {
                text += this.tireCount() + " Wheelguards, ";
            } else {
                if (this.frontWheelguards && this.frontExposedTireCount() > 0) text += this.frontExposedTireCount() + " Wheelguards Front, ";
                if (this.middleWheelguards && this.middleTireCount() > 0) text += this.middleTireCount() + " Wheelguards Middle, ";
                if (this.backWheelguards && this.backExposedTireCount() > 0) text += this.backExposedTireCount() + " Wheelguards Back, ";
            }
            if (this.frontWheelhubs && this.backWheelhubs && (this.tireCount() < 6 || this.middleWheelhubs)) {
                text += this.tireCount() + " Wheelhubs, ";
            } else {
                if (this.frontWheelhubs && this.frontExposedTireCount() > 0) text += this.frontExposedTireCount() + " Wheelhubs Front, ";
                if (this.middleWheelhubs && this.middleTireCount() > 0) text += this.middleTireCount() + " Wheelhubs Middle, ";
                if (this.backWheelhubs && this.backExposedTireCount() > 0) text += this.backExposedTireCount() + " Wheelhubs Back, ";
            }
            if (this.sloped) text += "Sloped Armor, ";
            if (this.ramplate || this.fakeRamplate) text += "Ramplate, ";
            if (this.bumperSpikes) text += "Bumper Spikes Front, ";
            if (this.backBumperSpikes) text += "Bumper Spikes Back, ";
            if (this.bodyBlades || this.fakeBodyBlades) text += this.bodyBladeText() + ", ";
            // TODO: retractible wheelguards??
            if (/, $/.test(text)) text = text.substring(0, text.length - 2);
            if (this.sidecar) text = text + "\n" + this.sidecarWalkaround();
            if (this.carrier) text = text + "\n" + this.carrier.walkaroundDescription();
            return text;
        };

        vehicle.hasBoosters = function() {
            var i;
            for(i=0; i<this.boosters.length; i++)
                if(!this.boosters[i].jumpJet) return true;
            if(this.topTurret)
                for(i=0; i<this.topTurret.boosters.length; i++)
                    if(!this.topTurret.boosters[i].jumpJet) return true;
            if(this.sideTurret)
                for(i=0; i<this.sideTurret.boosters.length; i++)
                    if(!this.sideTurret.boosters[i].jumpJet) return true;
            if(this.isOversize()) {
                if (this.topBackTurret)
                    for (i = 0; i < this.topBackTurret.boosters.length; i++)
                        if (!this.topBackTurret.boosters[i].jumpJet) return true;
                if (this.sideBackTurret)
                    for (i = 0; i < this.sideBackTurret.boosters.length; i++)
                        if (!this.sideBackTurret.boosters[i].jumpJet) return true;
            }
            if(this.carrier) return this.carrier.hasBoosters();
            return false;
        };

        vehicle.totalArmorCost = function () {
            return Math.ceil(this.plasticArmorPoints() * (this.frontArmor.plasticType ? this.frontArmor.plasticType.costFactor : 0) * (this.sloped ? 1.1 : 1) * this.body.armorCost - 0.0001)
                + Math.ceil(this.metalArmorPoints() * (this.frontArmor.metalType ? this.frontArmor.metalType.costFactor : 0) * (this.sloped ? 1.1 : 1) * this.body.armorCost - 0.0001);
        };

        vehicle.cornerMountLimit = function () {
            if (this.type === 'Cycle' || this.type === 'Trike') return 0;
            if (this.type === 'SemiTractor' || this.type === 'SemiTrailer' || this.type === 'Bus') return 4;
            if (this.type === 'CarTrailer' && this.isOversize()) return 4;
            return 2;
        };

        vehicle.sideDischargerLimit = function () {
            var limit = 2;
            if (this.type === 'Cycle') limit = 0;
            else if (this.type === 'SemiTractor' || (CW.busBody && this.body.name === CW.busBody.minibus.name)) limit = 3;
            else if (this.type === 'Bus') {
                if (this.body.name === CW.busBody.bus_30.name) limit = 4;
                else limit = 5;
            }
            else if (this.type === 'CarTrailer') limit = this.body.dischargers;
            else if (this.type === 'SemiTrailer') limit = 5;
            else if (this.type === 'TenWheeler') limit = 1;
            return limit;
        };

        vehicle.dischargersAllowed = function (location) {
            if (this.isOversize()) {
                if (location === 'LeftBack') location = 'Left';
                else if (location === 'RightBack') location = 'Right';
                else if (location === 'TopBack') location = 'Top';
                else if (location === 'UnderbodyBack') location = 'Underbody';
            }
            var list = vehicle[location.substr(0, 1).toLowerCase() + location.substring(1) + "Weapons"];
            // CWC p108 -- Dischargers every 7.5'
            if (!list) return false;
            var count = 0;
            for (var i = 0; i < list.length; i++) if (list[i].isDischarger()) count += list[i].count;
            if (location === 'Front' || location === 'Back' || location.indexOf('Sidecar') === 0) return count === 0;
            return count < this.sideDischargerLimit();
        };

        vehicle.hasDischargers = function () {
            var list = this.linkableWeapons(true);
            for (var i = 0; i < list.length; i++)
                if (list[i].isDischarger())
                    return true;
            return false;
        };

        // Only meant for sides, not turrets/sidecars/etc.
        vehicle.countWeaponsIn = function (weaponName, location) {
            var list = vehicle[location.substr(0, 1).toLowerCase() + location.substring(1) + "Weapons"];
            var total = 0;
            for (var i = 0; i < list.length; i++)
                if (list[i].name === weaponName) total += list[i].count;
            return total;
        };

        // Returns the first one or null
        vehicle.getWeaponIn = function (weaponName, location) {
            var list = vehicle[location.substr(0, 1).toLowerCase() + location.substring(1) + "Weapons"];
            for (var i = 0; i < list.length; i++)
                if (list[i].name === weaponName) return list[i];
            return null;
        };

        vehicle.dischargersBumperTriggered = function () {
            var dischargers = false, trigger = true;
            var list = this.linkableWeapons();
            for (var i = 0; i < list.length; i++)
                if (list[i].isDischarger()) {
                    dischargers = true;
                    if (!list[i].bumperTrigger) trigger = false;
                }
            return dischargers && trigger;
        };

        vehicle.hasDriver = function () {
            for (var i = 0; i < this.crew.length; i++) if (this.crew[i].name === 'Driver' || this.crew[i].name === 'Cyclist') return true;
            return false;
        };
        vehicle.hasGunner = function () {
            for (var i = 0; i < this.crew.length; i++) if (this.crew[i].name === 'Gunner') return true;
            return false;
        };
        vehicle.crewCount = function () {
            return this.crew.length;
        };
        vehicle.gunnerCount = function () {
            var total = 0;
            for (var i = 0; i < this.crew.length; i++) if (this.crew[i].name === 'Gunner') total += 1;
            return total;
        };

        vehicle.tireToCopy = function() {return this.backTires;};
        vehicle.addSpareTireStandard = function () {
            var tire = CW.createTire('Standard', this.tireToCopy().motorcycle, this.tireToCopy().truck);
            tire.alwaysStandard = true;
            tire.count = 1;
            tire.cargo = true;
            tire.abbv = "Spare " + tire.abbv;
            var old = tire.textDescription;
            tire.textDescription = function () {
                return "Spare " + old() + " tire";
            };
            this.accessories.push(tire);
            this.spareTires.push(tire);
            vehicle.recalculate();
            return tire;
        };

        vehicle.addSpareTireMatching = function () {
            var tire = CW.createTire(this.tireToCopy().name, this.tireToCopy().motorcycle, this.tireToCopy().truck);
            tire.duplicate(this.tireToCopy());
            tire.count = 1;
            tire.cargo = true;
            tire.abbv = "Spare " + tire.abbv;
            var old = tire.textDescription;
            tire.textDescription = function () {
                return "Spare " + old() + " tire";
            };
            this.accessories.push(tire);
            this.spareTires.push(tire);
            vehicle.recalculate();
            return tire;
        };

        vehicle.hasSpareTireStandard = function () {
            for (var i = 0; i < this.spareTires.length; i++) {
                if (this.spareTires[i].alwaysStandard) return true;
            }
            return false;
        };

        vehicle.hasSpareTireMatching = function () {
            for (var i = 0; i < this.spareTires.length; i++) {
                if (!this.spareTires[i].alwaysStandard) return true;
            }
            return false;
        };

        vehicle.removeSpareTireStandard = function () {
            for (var i = 0; i < this.spareTires.length; i++) {
                if (this.spareTires[i].alwaysStandard) {
                    var result = this.spareTires.splice(i, 1)[0];
                    for (var j = 0; j < this.accessories.length; j++) {
                        if (this.accessories[j] === result) {
                            this.accessories.splice(j, 1);
                            break;
                        }
                    }
                    vehicle.recalculate();
                    return result;
                }
            }
            return null;
        };

        vehicle.removeSpareTireMatching = function () {
            for (var i = 0; i < this.spareTires.length; i++) {
                if (!this.spareTires[i].alwaysStandard) {
                    var result = this.spareTires.splice(i, 1)[0];
                    for (var j = 0; j < this.accessories.length; j++) {
                        if (this.accessories[j] === result) {
                            this.accessories.splice(j, 1);
                            break;
                        }
                    }
                    vehicle.recalculate();
                    return result;
                }
            }
            return null;
        };

        vehicle.updateSpareTire = function () {
            for (var i = 0; i < this.spareTires.length; i++) {
                if (!this.spareTires[i].alwaysStandard) {
                    this.spareTires[i].duplicate(this.tireToCopy());
                    this.spareTires[i].abbv = "Spare " + this.spareTires[i].abbv;
                }
            }
        };

        vehicle.prepareForSave = function () {
            var i;
            // Clean up armor
            if (!this.frontArmor.plasticType) this.frontArmor.plasticPoints = 0;
            if (!this.frontArmor.metalType) this.frontArmor.metalPoints = 0;
            if (this.leftArmor && !this.leftArmor.plasticType) this.leftArmor.plasticPoints = 0;
            if (this.leftArmor && !this.leftArmor.metalType) this.leftArmor.metalPoints = 0;
            if (this.leftBackArmor && !this.leftBackArmor.plasticType) this.leftBackArmor.plasticPoints = 0;
            if (this.leftBackArmor && !this.leftBackArmor.metalType) this.leftBackArmor.metalPoints = 0;
            if (this.rightArmor && !this.rightArmor.plasticType) this.rightArmor.plasticPoints = 0;
            if (this.rightArmor && !this.rightArmor.metalType) this.rightArmor.metalPoints = 0;
            if (this.rightBackArmor && !this.rightBackArmor.plasticType) this.rightBackArmor.plasticPoints = 0;
            if (this.rightBackArmor && !this.rightBackArmor.metalType) this.rightBackArmor.metalPoints = 0;
            if (!this.backArmor.plasticType) this.backArmor.plasticPoints = 0;
            if (!this.backArmor.metalType) this.backArmor.metalPoints = 0;
            if (this.topArmor && !this.topArmor.plasticType) this.topArmor.plasticPoints = 0;
            if (this.topArmor && !this.topArmor.metalType) this.topArmor.metalPoints = 0;
            if (this.topBackArmor && !this.topBackArmor.plasticType) this.topBackArmor.plasticPoints = 0;
            if (this.topBackArmor && !this.topBackArmor.metalType) this.topBackArmor.metalPoints = 0;
            if (this.underbodyArmor && !this.underbodyArmor.plasticType) this.underbodyArmor.plasticPoints = 0;
            if (this.underbodyArmor && !this.underbodyArmor.metalType) this.underbodyArmor.metalPoints = 0;
            if (this.underbodyBackArmor && !this.underbodyBackArmor.plasticType) this.underbodyBackArmor.plasticPoints = 0;
            if (this.underbodyBackArmor && !this.underbodyBackArmor.metalType) this.underbodyBackArmor.metalPoints = 0;
            if (this.flatbedArmor && !this.flatbedArmor.plasticType) this.flatbedArmor.plasticPoints = 0;
            if (this.flatbedArmor && !this.flatbedArmor.metalType) this.flatbedArmor.metalPoints = 0;
            if (this.flatbedBackArmor && !this.flatbedBackArmor.plasticType) this.flatbedBackArmor.plasticPoints = 0;
            if (this.flatbedBackArmor && !this.flatbedBackArmor.metalType) this.flatbedBackArmor.metalPoints = 0;
            if (this.frontWheelguards && !this.frontWheelguards.plasticType) this.frontWheelguards.plasticPoints = 0;
            if (this.middleWheelguards && !this.middleWheelguards.plasticType) this.middleWheelguards.plasticPoints = 0;
            if (this.backWheelguards && !this.backWheelguards.plasticType) this.backWheelguards.plasticPoints = 0;
            if (this.frontWheelhubs && !this.frontWheelhubs.plasticType) this.frontWheelhubs.plasticPoints = 0;
            if (this.middleWheelhubs && !this.middleWheelhubs.plasticType) this.middleWheelhubs.plasticPoints = 0;
            if (this.backWheelhubs && !this.backWheelhubs.plasticType) this.backWheelhubs.plasticPoints = 0;
            // Clean up non-oversize stuff
            if(!this.hasOversizeWeaponFacings()) {
                if(this.topBackTurret) {
                    this.removeFromLinks(this.topBackTurret.weapons);
                    this.removeFromLinks(this.topBackTurret.boosters);
                    this.topBackTurret = null;
                }
                if(this.sideBackTurret) {
                    this.removeFromLinks(this.sideBackTurret.linkableWeapons(true));
                    this.removeFromLinks(this.sideBackTurret.linkableWeapons(false));
                    this.removeFromLinks(this.sideBackTurret.boosters);
                    this.sideBackTurret = null;
                }
                this.removeFromLinks(this.leftBackWeapons);
                if('leftBackWeapons' in this) this.leftBackWeapons = [];
                this.removeFromLinks(this.rightBackWeapons);
                if('rightBackWeapons' in this) this.rightBackWeapons = [];
                this.removeFromLinks(this.topBackWeapons);
                if('topBackWeapons' in this) this.topBackWeapons = [];
                this.removeFromLinks(this.underbodyBackWeapons);
                if('underbodyBackWeapons' in this) this.underbodyBackWeapons = [];
            }
            this.checkLinkableModifications();
            // This stuff doesn't need to be saved; will be populated on load
            if (this.designer_comments) delete this.designer_comments;
            if (this.signature) delete this.signature;
            if (this.designer_name) delete this.designer_name;
            if (this.tags) delete this.tags;
            // Revision that saved the design
            this.garageVersion = CW.latestRevision();
        };

        vehicle.spaceForEngine = function () {
            return Math.max(0, this.modifiedSpaceAvailable - this.spaceUsed) + this.engine.totalSpace() + (this.gasTank ? this.gasTank.totalSpace() : 0);
        };
        vehicle.weightForEngine = function () {
            return Math.max(0, this.modifiedMaxWeight - this.weightUsed) + this.engine.totalWeight() + (this.gasTank ? this.gasTank.totalWeight() : 0);
        };

        vehicle.range = function () {
            if (this.engine) {
                if (this.engine.electric) return "200mi @" + Math.floor(this.currentTopSpeed / 2 + 0.0001);
                else return this.modifiedMPG * this.gasTank.capacity + "mi @" + Math.floor(this.currentTopSpeed * 0.6 + 0.0001);
            } else return null;
        };

        vehicle.bodyBladeCost = function () {
            return this.body.armorCost * 3;
        };
        vehicle.bodyBladeWeight = function () {
            return this.body.armorWeight * 3;
        };
        vehicle.bodyBladeText = function () {
            return "Body Blades";
        };

        var getWeaponStats = function (hash, weapon) {
            if (weapon.fake) return;
            if (weapon.shots > 0) {
                for (var j = 0; j < weapon.ammo.length; j++)
                    if (!hash.hasOwnProperty(weapon.abbv + weapon.ammo[j].abbv))
                        hash[weapon.abbv + weapon.ammo[j].abbv] = {
                            weapon: weapon.name.replace("Heavy-Duty", "HD"),
                            ammo: weapon.ammo[j].modifiedName(weapon.ammo.length > 1),
                            toHit: weapon.ammo[j].laserGuided ? "4*" : "" + weapon.toHit,
                            damage: weapon.ammo[j].modifiedDamage(),
                            fireModifier: weapon.ammo[j].fireModifier ? weapon.ammo[j].fireModifier : 0,
                            burnDuration: weapon.ammo[j].burnDuration ? weapon.ammo[j].burnDuration : 0
                        };
            } else {
                if (!hash.hasOwnProperty(weapon.abbv))
                    hash[weapon.abbv] = {
                        weapon: weapon.name.replace("Discharger", "Disch."),
                        ammo: '',
                        toHit: ""+weapon.toHit,
                        damage: weapon.modifiedDamage(),
                        fireModifier: weapon.fireModifier ? weapon.fireModifier : 0,
                        burnDuration: weapon.burnDuration ? weapon.burnDuration : 0
                    };
            }
        };

        vehicle.weaponValues = function () {
            var i, hash = {}, result = [];
            for (i = 0; i < this.frontWeapons.length; i++) getWeaponStats(hash, this.frontWeapons[i]);
            for (i = 0; i < this.backWeapons.length; i++) getWeaponStats(hash, this.backWeapons[i]);
            for (i = 0; i < this.leftWeapons.length; i++) getWeaponStats(hash, this.leftWeapons[i]);
            if (this.hasOversizeWeaponFacings()) for (i = 0; i < this.leftBackWeapons.length; i++) getWeaponStats(hash, this.leftBackWeapons[i]);
            for (i = 0; i < this.rightWeapons.length; i++) getWeaponStats(hash, this.rightWeapons[i]);
            if (this.hasOversizeWeaponFacings()) for (i = 0; i < this.rightBackWeapons.length; i++) getWeaponStats(hash, this.rightBackWeapons[i]);
            for (i = 0; i < this.topWeapons.length; i++) getWeaponStats(hash, this.topWeapons[i]);
            if (this.hasOversizeWeaponFacings()) for (i = 0; i < this.topBackWeapons.length; i++) getWeaponStats(hash, this.topBackWeapons[i]);
            for (i = 0; i < this.underbodyWeapons.length; i++) getWeaponStats(hash, this.underbodyWeapons[i]);
            if (this.hasOversizeWeaponFacings()) for (i = 0; i < this.underbodyBackWeapons.length; i++) getWeaponStats(hash, this.underbodyBackWeapons[i]);
            for (i = 0; i < this.frontLeftWeapons.length; i++) getWeaponStats(hash, this.frontLeftWeapons[i]);
            for (i = 0; i < this.backLeftWeapons.length; i++) getWeaponStats(hash, this.backLeftWeapons[i]);
            for (i = 0; i < this.frontRightWeapons.length; i++) getWeaponStats(hash, this.frontRightWeapons[i]);
            for (i = 0; i < this.backRightWeapons.length; i++) getWeaponStats(hash, this.backRightWeapons[i]);
            if (this.topTurret) for (i = 0; i < this.topTurret.weapons.length; i++) getWeaponStats(hash, this.topTurret.weapons[i]);
            if (this.hasOversizeWeaponFacings() && this.topBackTurret)
                for (i = 0; i < this.topBackTurret.weapons.length; i++) getWeaponStats(hash, this.topBackTurret.weapons[i]);
            if (this.sideTurret) for (i = 0; i < this.sideTurret.weapons.length; i++) getWeaponStats(hash, this.sideTurret.weapons[i]);
            if (this.hasOversizeWeaponFacings() && this.sideBackTurret)
                for (i = 0; i < this.sideBackTurret.weapons.length; i++) getWeaponStats(hash, this.sideBackTurret.weapons[i]);
            for (i in hash) {
                if (hash.hasOwnProperty(i)) {
                    if (hash[i].toHit > 0 || (hash[i].damage && hash[i].damage !== '0') || hash[i].fireModifier > 0)
                        result.push(hash[i]);
                }
            }
            return result;
        };

        vehicle.modifiedBodyCost = function () {
            return this.carbonAluminumFrame ? this.body.cost * 4 : this.body.cost;
        };

        vehicle.ramplateCost = function () {
            return this.ramplate ? Math.ceil(this.frontArmor.totalCost(this.body.armorCost) * 1.5 * (this.sloped ? 1.1 : 1.0) - 0.0001) : 0;
        };

        vehicle.fakeRamplateCost = function () {
            return this.fakeRamplate ? Math.ceil(5 * this.body.armorCost * this.armorTypeToMatch().costFactor * (this.sloped ? 1.1 : 1) - 0.0001) : 0;
        };

        vehicle.ramplateWeight = function () {
            return this.ramplate ? Math.ceil(this.frontArmor.totalWeight(this.body.armorWeight) * 0.5 - 0.0001) : 0;
        };

        vehicle.armorTypeToMatch = function () {
            if (this.frontArmor.plasticType) return this.frontArmor.plasticType;
            return CW.armor.plastic;
        };
        vehicle.compositeArmor = function () {
            return (this.plasticArmorPoints() > 0 || this.boxPlasticArmorPoints() > 0) &&
                (this.metalArmorPoints() > 0 || this.boxMetalArmorPoints() > 0);
        };
        vehicle.armorDescription = function () {
            if (this.compositeArmor()) {
                return "Composite " + this.frontArmor.metalType.name + "/" + this.frontArmor.plasticType.name + " Armor";
            }
            if (this.frontArmor.plasticType && (this.plasticArmorPoints() > 0 || this.boxPlasticArmorPoints() > 0))
                return this.frontArmor.plasticType.name + " Armor";
            if (this.frontArmor.metalType)
                return this.frontArmor.metalType.name + " Armor";
            return "No Armor";
        };

        vehicle.allTiresAreRadial = function () {
            return (!this.frontTires || this.frontTires.radial) && this.backTires.radial &&
                (!this.middleOrOuterTires || this.middleOrOuterTires.radial)
                && (!this.frontTires || !this.frontTires.tireChains) && !this.backTires.tireChains
                && (!this.middleOrOuterTires || !this.middleOrOuterTires.tireChains);
        };

        vehicle.allTiresAreSlick = function () {
            return (!this.frontTires || this.frontTires.slick) && this.backTires.slick &&
                (!this.middleOrOuterTires || this.middleOrOuterTires.slick) &&
                (!this.frontTires || !this.frontTires.tireChains) && !this.backTires.tireChains &&
                (!this.middleOrOuterTires || !this.middleOrOuterTires.tireChains);
        };

        vehicle.hasWheelguardsOrHubs = function () {
            if (this.hasDoubleWheels()) { // Assuming they're on the back
                return (this.backWheelguards && !this.backWheelhubs) || (this.backWheelhubs && !this.backWheelguards);
            }
            var guards = !!this.frontWheelguards;
            var hubs = !!this.frontWheelhubs;
            var something = guards || hubs;
            if (guards && hubs) return false;
            guards = !!this.backWheelguards;
            hubs = !!this.backWheelhubs;
            something = something || guards || hubs;
            if (guards && hubs) return false;
            guards = !!this.middleWheelguards;
            hubs = !!this.middleWheelhubs;
            something = something || guards || hubs;
            if (guards && hubs) return false;
            if (!something) return false;
            return true;
        };
        vehicle.hasWheelguardsAndHubs = function () {
            if (this.hasDoubleWheels()) {
                return this.backWheelguards && this.backWheelhubs;
            }
            return (this.frontWheelguards && this.frontWheelhubs) ||
                (this.backWheelguards && this.backWheelhubs) ||
                (this.middleWheelguards && this.middleWheelhubs);
        };
        vehicle.tireCount = function () {
            return this.middleOrOuterTires ? 6 : 4;
        };
        vehicle.frontTireCount = function () {
            return 2;
        };
        vehicle.backTireCount = function () {
            return 2;
        };
        vehicle.frontExposedTireCount = function () {
            return this.frontTireCount();
        };
        vehicle.backExposedTireCount = function () {
            return this.backTireCount();
        };
        vehicle.middleTireCount = function () {
            return this.middleOrOuterTires ? 2 : 0;
        };
        vehicle.hasDoubleWheels = function () {
            return this.middleOrOuterTires && !this.thirdRowTiresInMiddle;
        };

        vehicle.addThirdRowTires = function () {
            if (!this.middleOrOuterTires) {
                this.middleOrOuterTires = CW.createTire(this.backTires.name, false);
                this.middleOrOuterTires.duplicate(this.backTires);
                this.recalculate();
            }
        };
        vehicle.removeThirdRowTires = function () {
            if (this.middleOrOuterTires) {
                this.middleOrOuterTires = null;
                this.recalculate();
            }
        };
        vehicle.nextHitch = function () {
            if (!this.hitch) {
                this.hitch = CW.createHitch(CW.hitches.Light);
            } else if (this.hitch.name === CW.hitches.Light.name) {
                this.hitch.changeType(CW.hitches.Standard);
            } else if (this.hitch.name === CW.hitches.Standard.name) {
                this.hitch.changeType(CW.hitches.Heavy);
            } else if (this.hitch.name === CW.hitches.Heavy.name) {
                this.hitch.changeType(CW.hitches.Extra_Heavy);
            }
            this.recalculate();
        };
        vehicle.previousHitch = function () {
            if (!this.hitch) return;
            if (this.hitch.name === CW.hitches.Extra_Heavy.name) {
                this.hitch.changeType(CW.hitches.Heavy);
            } else if (this.hitch.name === CW.hitches.Heavy.name) {
                this.hitch.changeType(CW.hitches.Standard);
            } else if (this.hitch.name === CW.hitches.Standard.name) {
                this.hitch.changeType(CW.hitches.Light);
            } else if (this.hitch.name === CW.hitches.Light.name) {
                this.hitch = null;
            }
            this.recalculate();
        };
        vehicle.backTiresSame = function () {
            if (!this.frontTires && !this.middleOrOuterTires) return true;
            if (this.backTires.name !== this.frontTires.name) return false;
            if (this.backTires.fireproof !== this.frontTires.fireproof) return false;
            if (this.backTires.offRoad !== this.frontTires.offRoad) return false;
            if (this.backTires.steelbelted !== this.frontTires.steelbelted) return false;
            if (this.backTires.radial !== this.frontTires.radial) return false;
            if (this.backTires.slick !== this.frontTires.slick) return false;
            if (this.backTires.tireChains !== this.frontTires.tireChains) return false;
            if (this.backTires.snowTires !== this.frontTires.snowTires) return false;
            if (this.middleOrOuterTires) {
                if (this.middleOrOuterTires.name !== this.frontTires.name) return false;
                if (this.middleOrOuterTires.fireproof !== this.frontTires.fireproof) return false;
                if (this.middleOrOuterTires.offRoad !== this.frontTires.offRoad) return false;
                if (this.middleOrOuterTires.steelbelted !== this.frontTires.steelbelted) return false;
                if (this.middleOrOuterTires.radial !== this.frontTires.radial) return false;
                if (this.middleOrOuterTires.slick !== this.frontTires.slick) return false;
                if (this.middleOrOuterTires.tireChains !== this.frontTires.tireChains) return false;
                if (this.middleOrOuterTires.snowTires !== this.frontTires.snowTires) return false;
            }
            return true;
        };
        vehicle.dragsterTires = function () {
            if (!this.frontTires) return false; // Trailers
            if (this.backTires.motorcycle !== this.frontTires.motorcycle) return true;
            if (this.middleOrOuterTires && this.middleOrOuterTires.motorcycle !== this.frontTires.motorcycle) return true;
            return false;
        };
        vehicle.previousFrontWheelguard = function () {
            if (!this.frontWheelguards) return;
            if (this.frontWheelguards.fake) {
                this.frontWheelguards = null;
            } else if (this.frontWheelguards.plasticPoints === 1) {
                this.frontWheelguards.plasticPoints = 0;
                this.frontWheelguards.fake = true;
            } else {
                this.frontWheelguards.plasticPoints -= 1;
            }
            this.recalculate();
        };
        vehicle.previousFrontWheelhub = function () {
            if (!this.frontWheelhubs) return;
            if (this.frontWheelhubs.fake) {
                this.frontWheelhubs = null;
            } else if (this.frontWheelhubs.plasticPoints === 1) {
                this.frontWheelhubs.plasticPoints = 0;
                this.frontWheelhubs.fake = true;
            } else {
                this.frontWheelhubs.plasticPoints -= 1;
            }
            this.recalculate();
        };
        vehicle.previousBackWheelguard = function () {
            if (!this.backWheelguards) return;
            if (this.backWheelguards.fake) {
                this.backWheelguards = null;
                this.middleWheelguards = null;
            } else if (this.backWheelguards.plasticPoints === 1) {
                this.backWheelguards.plasticPoints = 0;
                this.backWheelguards.fake = true;
                if (this.middleWheelguards) {
                    this.middleWheelguards.plasticPoints = 0;
                    this.middleWheelguards.fake = true;
                }
            } else {
                this.backWheelguards.plasticPoints -= 1;
                if (this.middleWheelguards) {
                    this.middleWheelguards.plasticPoints -= 1;
                }
            }
            this.recalculate();
        };
        vehicle.previousBackWheelhub = function () {
            if (!this.backWheelhubs) return;
            if (this.backWheelhubs.fake) {
                this.backWheelhubs = null;
                this.middleWheelhubs = null;
            } else if (this.backWheelhubs.plasticPoints === 1) {
                this.backWheelhubs.plasticPoints = 0;
                this.backWheelhubs.fake = true;
                if (this.middleWheelhubs) {
                    this.middleWheelhubs.plasticPoints = 0;
                    this.middleWheelhubs.fake = true;
                }
            } else {
                this.backWheelhubs.plasticPoints -= 1;
                if (this.middleWheelhubs) {
                    this.middleWheelhubs.plasticPoints -= 1;
                }
            }
            this.recalculate();
        };
        vehicle.removeGunner = function (gunner) {
            for (var i = 0; i < this.crew.length; i++) {
                if (this.crew[i] === gunner) {
                    this.crew.splice(i, 1);
                    if (this.crew.length < 2 && this.crewCompartmentCA) {
                        if(this.crew.length === 1) {
                            this.crewCompartmentCA.item = this.crew[0];
                            this.crew[0].componentArmor = this.crewCompartmentCA;
                        }
                        this.crewCompartmentCA = null;
                    }
                    this.recalculate();
                    return gunner;
                }
            }
            return null;
        };
        vehicle.nextGasTank = function () {
            if (this.gasTank.name === 'Economy') {
                this.gasTank.changeType(CW.gasTank.heavy_duty);
            } else if (this.gasTank.name === 'Heavy-Duty') {
                this.gasTank.changeType(CW.gasTank.racing);
            } else if (this.gasTank.name === 'Racing') {
                this.gasTank.changeType(CW.gasTank.duelling);
            } else if (this.gasTank.name === 'Duelling') {
                return;
            }
            this.recalculate();
        };
        vehicle.previousGasTank = function () {
            if (this.gasTank.name === 'Duelling') {
                this.gasTank.changeType(CW.gasTank.racing);
            } else if (this.gasTank.name === 'Racing') {
                this.gasTank.changeType(CW.gasTank.heavy_duty);
            } else if (this.gasTank.name === 'Heavy-Duty') {
                this.gasTank.changeType(CW.gasTank.economy);
            } else if (this.gasTank.name === 'Economy') {
                return;
            }
            this.recalculate();
        };
        vehicle.removePassenger = function (pass) {
            for (var i = 0; i < this.passengers.length; i++) {
                if (this.passengers[i] === pass) {
                    this.passengers.splice(i, 1);
                    this.recalculate();
                    return pass;
                }
            }
            return null;
        };

        vehicle.plasticArmorPoints = function () {
            var total = this.frontArmor.plasticPoints + this.leftArmor.plasticPoints
                + this.rightArmor.plasticPoints + this.backArmor.plasticPoints
                + this.topArmor.plasticPoints + this.underbodyArmor.plasticPoints;
            if (this.hasOversizeWeaponFacings()) {
                total += this.leftBackArmor.plasticPoints + this.rightBackArmor.plasticPoints
                    + this.topBackArmor.plasticPoints + this.underbodyBackArmor.plasticPoints;
            }
            return total;
        };
        vehicle.metalArmorPoints = function () {
            var total = this.frontArmor.metalPoints + this.leftArmor.metalPoints
                + this.rightArmor.metalPoints + this.backArmor.metalPoints
                + this.topArmor.metalPoints + this.underbodyArmor.metalPoints;
            if (this.hasOversizeWeaponFacings()) {
                total += this.leftBackArmor.metalPoints + this.rightBackArmor.metalPoints
                    + this.topBackArmor.metalPoints + this.underbodyBackArmor.metalPoints;
            }
            return total;
        };
        vehicle.boxPlasticArmorPoints = function () {
            return 0;
        };
        vehicle.boxMetalArmorPoints = function () {
            return 0;
        };

        vehicle.nextPlasticArmor = function () {
            if (!this.frontArmor.plasticType) {
                this.setPlasticArmor(CW.armor.plastic);
            } else if (this.frontArmor.plasticType === CW.armor.plastic) {
                this.setPlasticArmor(CW.armor.lr);
            } else if (this.frontArmor.plasticType === CW.armor.lr) {
                this.setPlasticArmor(CW.armor.fireproof);
            } else if (this.frontArmor.plasticType === CW.armor.fireproof) {
                this.setPlasticArmor(CW.armor.lrfp);
            } else if (this.frontArmor.plasticType === CW.armor.lrfp) {
                if(this.techLevel === 'Classic') return;
                this.setPlasticArmor(CW.armor.radarproof);
            } else if (this.frontArmor.plasticType === CW.armor.radarproof) {
                if(this.techLevel === 'Classic') return;
                this.setPlasticArmor(CW.armor.rpfp);
            } else {
                return;
            }
            this.recalculate();
        };
        vehicle.previousPlasticArmor = function () {
            if (this.frontArmor.plasticType === CW.armor.rpfp) {
                if(this.techLevel === 'Classic') this.setPlasticArmor(CW.armor.lrfp);
                else this.setPlasticArmor(CW.armor.radarproof);
            } else if (this.frontArmor.plasticType === CW.armor.radarproof) {
                this.setPlasticArmor(CW.armor.lrfp);
            } else if (this.frontArmor.plasticType === CW.armor.lrfp) {
                this.setPlasticArmor(CW.armor.fireproof);
            } else if (this.frontArmor.plasticType === CW.armor.fireproof) {
                this.setPlasticArmor(CW.armor.lr);
            } else if (this.frontArmor.plasticType === CW.armor.lr) {
                this.setPlasticArmor(CW.armor.plastic);
            } else if (this.frontArmor.plasticType === CW.armor.plastic) {
                this.setPlasticArmor(null);
            } else {
                return;
            }
            this.recalculate();
        };
        vehicle.nextMetalArmor = function () {
            if (!this.frontArmor.metalType) {
                this.setMetalArmor(CW.armor.metal);
            } else if (this.frontArmor.metalType === CW.armor.metal) {
                this.setMetalArmor(CW.armor.lr_metal);
            } else {
                return;
            }
            this.recalculate();
        };
        vehicle.previousMetalArmor = function () {
            if (this.frontArmor.metalType === CW.armor.lr_metal) {
                this.setMetalArmor(CW.armor.metal);
            } else if (this.frontArmor.metalType === CW.armor.metal) {
                this.setMetalArmor(null);
            } else {
                return;
            }
            this.recalculate();
        };
        vehicle.setPlasticArmor = function (type) {
            this.frontArmor.plasticType = type;
            this.leftArmor.plasticType = type;
            this.rightArmor.plasticType = type;
            this.backArmor.plasticType = type;
            this.topArmor.plasticType = type;
            this.underbodyArmor.plasticType = type;
            if (this.hasOversizeWeaponFacings()) {
                this.leftBackArmor.plasticType = type;
                this.rightBackArmor.plasticType = type;
                this.topBackArmor.plasticType = type;
                this.underbodyBackArmor.plasticType = type;
            }
            if (!type) {
                this.frontArmor.plasticPoints = 0;
                this.leftArmor.plasticPoints = 0;
                this.rightArmor.plasticPoints = 0;
                this.backArmor.plasticPoints = 0;
                this.topArmor.plasticPoints = 0;
                this.underbodyArmor.plasticPoints = 0;
                if (this.hasOversizeWeaponFacings()) {
                    this.leftBackArmor.plasticPoints = 0;
                    this.rightBackArmor.plasticPoints = 0;
                    this.topBackArmor.plasticPoints = 0;
                    this.underbodyBackArmor.plasticPoints = 0;
                }
            } else {
                if (this.hitch && this.hitch.armor) this.hitch.armor.plasticType = type;
                if (this.frontWheelguards && this.frontWheelguards.plasticPoints > 0) this.frontWheelguards.plasticType = type;
                if (this.frontWheelhubs && this.frontWheelhubs.plasticPoints > 0) this.frontWheelhubs.plasticType = type;
                if (this.middleWheelguards && this.middleWheelguards.plasticPoints > 0) this.middleWheelguards.plasticType = type;
                if (this.middleWheelhubs && this.middleWheelhubs.plasticPoints > 0) this.middleWheelhubs.plasticType = type;
                if (this.backWheelguards && this.backWheelguards.plasticPoints > 0) this.backWheelguards.plasticType = type;
                if (this.backWheelhubs && this.backWheelhubs.plasticPoints > 0) this.backWheelhubs.plasticType = type;
                // The following for when this is run against a sidecar
                if (this.wheelguards && this.wheelguards.plasticPoints > 0) this.wheelguards.plasticType = type;
                if (this.wheelhubs && this.wheelhubs.plasticPoints > 0) this.wheelhubs.plasticType = type;
            }
        };
        vehicle.setMetalArmor = function (type) {
            this.frontArmor.metalType = type;
            this.leftArmor.metalType = type;
            this.rightArmor.metalType = type;
            this.backArmor.metalType = type;
            this.topArmor.metalType = type;
            this.underbodyArmor.metalType = type;
            if (this.hasOversizeWeaponFacings()) {
                this.leftBackArmor.metalType = type;
                this.rightBackArmor.metalType = type;
                this.topBackArmor.metalType = type;
                this.underbodyBackArmor.metalType = type;
            }
            if (!type) {
                this.frontArmor.metalPoints = 0;
                this.leftArmor.metalPoints = 0;
                this.rightArmor.metalPoints = 0;
                this.backArmor.metalPoints = 0;
                this.topArmor.metalPoints = 0;
                this.underbodyArmor.metalPoints = 0;
                if (this.hasOversizeWeaponFacings()) {
                    this.leftBackArmor.metalPoints = 0;
                    this.rightBackArmor.metalPoints = 0;
                    this.topBackArmor.metalPoints = 0;
                    this.underbodyBackArmor.metalPoints = 0;
                }
            } else {
                if (this.frontWheelguards && this.frontWheelguards.metalPoints > 0) this.frontWheelguards.metalType = type;
                if (this.frontWheelhubs && this.frontWheelhubs.metalPoints > 0) this.frontWheelhubs.metalType = type;
                if (this.middleWheelguards && this.middleWheelguards.metalPoints > 0) this.middleWheelguards.metalType = type;
                if (this.middleWheelhubs && this.middleWheelhubs.metalPoints > 0) this.middleWheelhubs.metalType = type;
                if (this.backWheelguards && this.backWheelguards.metalPoints > 0) this.backWheelguards.metalType = type;
                if (this.backWheelhubs && this.backWheelhubs.metalPoints > 0) this.backWheelhubs.metalType = type;
                // The following for when this is run against a sidecar
                if (this.wheelguards && this.wheelguards.metalPoints > 0) this.wheelguards.metalType = type;
                if (this.wheelhubs && this.wheelhubs.metalPoints > 0) this.wheelhubs.metalType = type;
            }
        };
        vehicle.metalArmorStats = function () {
            if (!this.frontArmor.metalType) return null;
            return {
                cost: Math.round(this.frontArmor.metalType.costFactor * this.body.armorCost * 100 * (this.sloped ? 1.1 : 1)) / 100,
                weight: Math.round(this.frontArmor.metalType.weightFactor * this.body.armorWeight * 100) / 100
            };
        };
        vehicle.plasticArmorStats = function () {
            if (!this.frontArmor.plasticType) return null;
            return {
                cost: Math.round(this.frontArmor.plasticType.costFactor * this.body.armorCost * 100 * (this.sloped ? 1.1 : 1)) / 100,
                weight: Math.round(this.frontArmor.plasticType.weightFactor * this.body.armorWeight * 100) / 100
            };
        };
        vehicle.addWeapon = function (weapon, location) {
            var list, override;
            if (this.hasOversizeWeaponFacings()) {
                if (weapon.isDischarger()) {
                    if (location === 'RightBack') {
                        weapon.location = "Right";
                        weapon.displayLocation = "Right";
                        vehicle.rightWeapons.push(weapon);
                        return;
                    } else if (location === 'LeftBack') {
                        weapon.location = "Left";
                        weapon.displayLocation = "Left";
                        vehicle.leftWeapons.push(weapon);
                        return;
                    } else if (location === 'TopBack') {
                        weapon.location = "Top";
                        weapon.displayLocation = "Top";
                        vehicle.topWeapons.push(weapon);
                        return;
                    } else if (location === 'UnderbodyBack') {
                        weapon.location = "Underbody";
                        weapon.displayLocation = "Underbody";
                        vehicle.underbodyWeapons.push(weapon);
                        return;
                    }
                } else if (location === 'Right') override = "RightFront";
                else if (location === 'Left') override = "LeftFront";
                else if (location === 'Top') override = "TopFront";
                else if (location === 'Underbody') override = "UnderbodyFront";
                if (override) {
                    weapon.setDisplayLocation(override);
                }
            }
            if (/Turret/.test(location)) {
                list = vehicle[location].weapons;
                if (vehicle[location].fake) weapon.setFake(true);
            } else {
                list = vehicle[location.substr(0, 1).toLowerCase() + location.substring(1) + "Weapons"];
            }
            list.push(weapon);
            vehicle.recalculate();
        };
        vehicle.removeFromLinks = function (item) {
            if(!item) return;
            if(!Array.isArray(item)) item = [item];
            var i, j;
            for(j=0; j<item.length; j++) {
                for (i = 0; i < vehicle.links.length; i++)
                    vehicle.links[i].removeItem(item[j]);
                for (i = 0; i < vehicle.smartLinks.length; i++)
                    vehicle.smartLinks[i].removeItem(item[j]);
            }
        };
        vehicle.removeWeapon = function (weapon, location) { // NOTE: do not alter "this" or "vehicle" because e.g. sidecar.removeWeapon
            var i, list;
            if (weapon.isDischarger() && vehicle.isOversize()) {
                if (location === 'LeftBack') location = 'Left';
                else if (location === 'RightBack') location = 'Right';
                else if (location === 'TopBack') location = 'Top';
                else if (location === 'UnderbodyBack') location = 'Underbody';
            }
            if (/Turret/.test(location)) list = this[location].weapons;
            else list = this[location.substr(0, 1).toLowerCase() + location.substring(1) + "Weapons"];

            var found = false;
            for (i = 0; i < list.length; i++) {
                if (list[i] === weapon) {
                    list.splice(i, 1);
                    found = true;
                    if (weapon.concealment) vehicle.checkLinkableModifications();
                    vehicle.removeFromLinks(weapon);
                    vehicle.recalculate();
                    break;
                }
            }
            return found;
        };
        vehicle.hasWeaponsIn = function (location) {
            // TODO: check sidecar
            if (/Carrier/.test(location)) {
                return this.carrier.hasWeaponsIn(CW.carrierLocation(location));
            } else if (/Turret/.test(location)) {
                return vehicle[location].weapons.length > 0;
            } else if (location.indexOf('Sidecar') === 0) {
                return vehicle.sidecar[location.substr(7, 1).toLowerCase() + location.substring(8) + "Weapons"].length > 0;
            } else {
                return vehicle[location.substr(0, 1).toLowerCase() + location.substring(1) + "Weapons"].length > 0;
            }
        };
        vehicle.copyEWP = function (from, to) {
            to.size = from.size;
            to.fake = from.fake;
            to.ewpEjectionSystem = from.ewpEjectionSystem;
            to.universal = from.universal;
            if (from.armor) {
                if (!to.armor) to.armor = CW.createArmor(0, 0);
                to.armor.plasticType = from.armor.plasticType;
                to.armor.plasticPoints = from.armor.plasticPoints;
                to.armor.metalType = from.armor.metalType;
                to.armor.metalPoints = from.armor.metalPoints;
            } else if (to.armor) to.armor = null;
            for (var i = 0; i < from.weapons.length; i++) { // Assuming the list of weapons will be kept in sync
                to.weapons[i].duplicate(from.weapons[i]);
            }
            for (i = 0; i < from.boosters.length; i++) {
                to.boosters[i].jumpJet = from.boosters[i].jumpJet;
                to.boosters[i].bottomOrRearFacing = from.boosters[i].bottomOrRearFacing;
                to.boosters[i].weight = from.boosters[i].weight;
            }
            to.builtIn = from.builtIn;
        };
        vehicle.removeWeaponCAExcept = function (weapon, location) {
            var list;
            // TODO: check sidecar
            if (location.indexOf('Sidecar') > -1) list = this.sidecar[location.substr(7, 1).toLowerCase() + location.substring(8) + "Weapons"];
            else if (/Turret/.test(location)) list = vehicle[location].weapons;
            else list = vehicle[location.substr(0, 1).toLowerCase() + location.substring(1) + "Weapons"];
            for (var i = 0; i < list.length; i++) {
                if (list[i] !== weapon && list[i].componentArmor) {
                    list[i].componentArmor = null;
                    return list[i];
                }
            }
            return null;
        };
        // The following does not work for locations with sidecar/carrier in the name!
        vehicle.weaponSpacesRemainingIn = function (location, ignoreTotalSpace) { // iTS: true if moving around within, false if adding new
            var turret = /Turret/.test(location);
            if (this.type === 'Cycle' && !turret) { // No 1/3 spaces for cycles
                return ignoreTotalSpace ? this.modifiedSpaceAvailable : Math.max(0, this.modifiedSpaceAvailable - this.spaceUsed);
            }
            var list1, list2, list3;
            var i, total = 0, turretMax;
            if (turret) {
                list1 = vehicle[location].weapons;
                list2 = [];
                list3 = [];
                turretMax = vehicle[location].size;
                total += CW.countBoosterSpace(vehicle[location].boosters, 'All');
                if(vehicle[location].isCupola()) total += vehicle[location].gunner.totalSpace();
            } else if (location === 'Top' || location === 'Underbody') {
                list1 = vehicle[location.substr(0, 1).toLowerCase() + location.substring(1) + "Weapons"];
                list2 = [];
                list3 = [];
                if (this.topTurret) total += this.topTurret.totalSpace();
            } else if (location === 'Front') {
                list1 = this.frontLeftWeapons;
                list2 = this.frontWeapons;
                list3 = this.frontRightWeapons;
            } else if (location === 'Left') {
                list1 = this.frontLeftWeapons;
                list2 = this.leftWeapons;
                list3 = this.hasOversizeWeaponFacings() ? [] : this.backLeftWeapons;
                if (this.sideTurret) total += this.sideTurret.totalSpace();
            } else if (location === 'Right') {
                list1 = this.frontRightWeapons;
                list2 = this.rightWeapons;
                list3 = this.hasOversizeWeaponFacings() ? [] : this.backRightWeapons;
                if (this.sideTurret) total += this.sideTurret.totalSpace();
            } else if (location === 'Back') {
                list1 = this.backLeftWeapons;
                list2 = this.backWeapons;
                list3 = this.backRightWeapons;
            } else if (location === 'LeftBack') {
                list1 = [];
                list2 = this.leftBackWeapons;
                list3 = this.backLeftWeapons;
                if (this.sideBackTurret) total += this.sideBackTurret.totalSpace();
            } else if (location === 'RightBack') {
                list1 = [];
                list2 = this.rightBackWeapons;
                list3 = this.backRightWeapons;
                if (this.sideBackTurret) total += this.sideBackTurret.totalSpace();
            } else if (location === 'TopBack') {
                list1 = [];
                list2 = this.topBackWeapons;
                list3 = [];
                if (this.topBackTurret) total += this.topBackTurret.totalSpace();
            } else if (location === 'UnderbodyBack') {
                list1 = [];
                list2 = this.underbodyBackWeapons;
                list3 = [];
            } else { // Corner Mount
                list1 = vehicle[location.substr(0, 1).toLowerCase() + location.substring(1) + "Weapons"];
                for (i = 0; i < list1.length; i++) total += list1[i].totalSpace();
                if (location === 'FrontLeft')
                    return Math.max(0, Math.min(this.cornerMountLimit() - total, this.weaponSpacesRemainingIn('Front'), this.weaponSpacesRemainingIn('Left'), ignoreTotalSpace ? 99 : this.modifiedSpaceAvailable - this.spaceUsed));
                else if (location === 'FrontRight')
                    return Math.max(0, Math.min(this.cornerMountLimit() - total, this.weaponSpacesRemainingIn('Front'), this.weaponSpacesRemainingIn('Right'), ignoreTotalSpace ? 99 : this.modifiedSpaceAvailable - this.spaceUsed));
                else if (location === 'BackLeft')
                    return Math.max(0, Math.min(this.cornerMountLimit() - total, this.weaponSpacesRemainingIn('Back'), this.weaponSpacesRemainingIn('Left'), ignoreTotalSpace ? 99 : this.modifiedSpaceAvailable - this.spaceUsed));
                else if (location === 'BackRight')
                    return Math.max(0, Math.min(this.cornerMountLimit() - total, this.weaponSpacesRemainingIn('Back'), this.weaponSpacesRemainingIn('Right'), ignoreTotalSpace ? 99 : this.modifiedSpaceAvailable - this.spaceUsed));
            }
            for (i = 0; i < list1.length; i++) {
                total += turret ? list1[i].spaceInsideTurret() : list1[i].totalSpace();
            }
            for (i = 0; i < list2.length; i++) {
                total += turret ? list2[i].spaceInsideTurret() : list2[i].totalSpace();
            }
            for (i = 0; i < list3.length; i++) {
                total += turret ? list3[i].spaceInsideTurret() : list3[i].totalSpace();
            }
            total += CW.countBoosterSpace(this.boosters, location);
            if (turret) return Math.max(0, turretMax - total);
            return Math.max(0, Math.min(this.maxWeaponSpacesPerSide - total, ignoreTotalSpace ? 99 : this.modifiedSpaceAvailable - this.spaceUsed));
        };

        vehicle.linkableWeapons = function (noCarrier) {
            var i, result = [], tempL, tempR;
            for (i = 0; i < this.frontWeapons.length; i++) if (!this.frontWeapons[i].fake) result.push(this.frontWeapons[i]);
            for (i = 0; i < this.backWeapons.length; i++) if (!this.backWeapons[i].fake) result.push(this.backWeapons[i]);
            for (i = 0; i < this.leftWeapons.length; i++) if (!this.leftWeapons[i].fake) result.push(this.leftWeapons[i]);
            for (i = 0; i < this.rightWeapons.length; i++) if (!this.rightWeapons[i].fake) result.push(this.rightWeapons[i]);
            for (i = 0; i < this.topWeapons.length; i++) if (!this.topWeapons[i].fake) result.push(this.topWeapons[i]);
            for (i = 0; i < this.underbodyWeapons.length; i++) if (!this.underbodyWeapons[i].fake) result.push(this.underbodyWeapons[i]);
            for (i = 0; i < this.frontRightWeapons.length; i++) if (!this.frontRightWeapons[i].fake) result.push(this.frontRightWeapons[i]);
            for (i = 0; i < this.frontLeftWeapons.length; i++) if (!this.frontLeftWeapons[i].fake) result.push(this.frontLeftWeapons[i]);
            for (i = 0; i < this.backRightWeapons.length; i++) if (!this.backRightWeapons[i].fake) result.push(this.backRightWeapons[i]);
            for (i = 0; i < this.backLeftWeapons.length; i++) if (!this.backLeftWeapons[i].fake) result.push(this.backLeftWeapons[i]);
            if (this.topTurret) for (i = 0; i < this.topTurret.weapons.length; i++) if (!this.topTurret.weapons[i].fake) result.push(this.topTurret.weapons[i]);
            if (this.sideTurret) {
                tempL = this.sideTurret.linkableWeapons(true);
                tempR = this.sideTurret.linkableWeapons(false);
                for (i = 0; i < this.sideTurret.weapons.length; i++) {
                    if (!this.sideTurret.weapons[i].fake) {
                        result.push(tempL[i]);
                        result.push(tempR[i]);
                    }
                }
            }
            if (this.hasOversizeWeaponFacings()) {
                for (i = 0; i < this.leftBackWeapons.length; i++) if (!this.leftBackWeapons[i].fake) result.push(this.leftBackWeapons[i]);
                for (i = 0; i < this.rightBackWeapons.length; i++) if (!this.rightBackWeapons[i].fake) result.push(this.rightBackWeapons[i]);
                for (i = 0; i < this.topBackWeapons.length; i++) if (!this.topBackWeapons[i].fake) result.push(this.topBackWeapons[i]);
                for (i = 0; i < this.underbodyBackWeapons.length; i++) if (!this.underbodyBackWeapons[i].fake) result.push(this.underbodyBackWeapons[i]);
                if (this.topBackTurret) for (i = 0; i < this.topBackTurret.weapons.length; i++) if (!this.topBackTurret.weapons[i].fake) result.push(this.topBackTurret.weapons[i]);
                if (this.sideBackTurret) {
                    tempL = this.sideBackTurret.linkableWeapons(true);
                    tempR = this.sideBackTurret.linkableWeapons(false);
                    for (i = 0; i < this.sideBackTurret.weapons.length; i++) {
                        if (!this.sideBackTurret.weapons[i].fake) {
                            result.push(tempL[i]);
                            result.push(tempR[i]);
                        }
                    }
                }
            }
            if (this.carrier && !noCarrier) return result.concat(this.carrier.linkableWeapons());
            return result;
        };
        vehicle.createWeaponLink = function (weapon, force) {
            if(!force) {
                for (var i = 0; i < this.links.length; i++)
                    if (this.links[i].items.length === 1 && this.links[i].items[0] === weapon)
                        return this.links[i];
            }
            var link = CW.createLink(this, false);
            link.items.push(weapon);
            this.links.push(link);
            return link;
        };
        vehicle.removeWeaponLink = function (weapon) {
            for (var i = 0; i < this.links.length; i++) {
                if (this.links[i].items.length === 1 && this.links[i].contains(weapon)) {
                    return this.links.splice(i, 1)[0];
                }
            }
            return null;
        };
        vehicle.removeLink = function (link) {
            for (var i = 0; i < this.links.length; i++) {
                if (this.links[i] === link) {
                    this.links.splice(i, 1);
                    this.recalculate();
                    return link;
                }
            }
            return null;
        };
        vehicle.removeSmartLink = function (link) {
            for (var i = 0; i < this.smartLinks.length; i++) {
                if (this.smartLinks[i] === link) {
                    this.smartLinks.splice(i, 1);
                    this.recalculate();
                    return link;
                }
            }
            return null;
        };
        vehicle.addAccessory = function (type) {
            if(type.attachedToEngine && this.engine) {
                if(type.multiple) this.engine[type.attachedToEngine] += 1;
                else this.engine[type.attachedToEngine] = true;
                if(type.opposite) this.engine[type.opposite] = false;
                this.recalculate();
                return null;
            }
            for (var i = 0; i < this.accessories.length; i++) {
                if (this.accessories[i].name === type.name) {
                    this.accessories[i].count += 1;
                    this.recalculate();
                    return this.accessories[i];
                }
            }
            var item = CW.createAccessory(type);
            this.accessories.push(item);
            this.recalculate();
            return item;
        };
        vehicle.removeAccessory = function (type) {
            if(type.attachedToEngine && this.engine) {
                if(type.multiple) {
                    if(this.engine[type.attachedToEngine] > 0)this.engine[type.attachedToEngine] -= 1;
                } else this.engine[type.attachedToEngine] = false;
                this.recalculate();
                return null;
            }
            var item = null, i;
            for (i = 0; i < this.accessories.length; i++) {
                if (this.accessories[i].name === type.name) {
                    item = this.accessories[i];
                    item.count -= 1;
                    if (item.count === 0) {
                        this.accessories.splice(i, 1);
                        if (item.linkable) this.removeFromLinks(item);
                    }
                    this.recalculate();
                    return item;
                }
            }
            return null;
        };
        vehicle.getAccessory = function (type) {
            if(type.attachedToEngine && this.engine) {
                return this.engine[type.attachedToEngine];
            }
            for (var i = 0; i < this.accessories.length; i++) {
                if (this.accessories[i].name === type.name) {
                    return this.accessories[i];
                }
            }
            return null;
        };
        vehicle.linkableModifications = function () {
            var result = [];
            if (this.overdrive) result.push("Overdrive");
            if (this.engine) {
                if (this.engine.highTorqueMotors) result.push("High-Torque Motors");
                if (this.engine.heavyDutyHighTorqueMotors) result.push("HD High-Torque Motors");
                if (this.engine.improvedSuperchargerCapacitors) result.push("ISC");
                if (this.engine.nitrousOxide) result.push("Nitrous Oxide");
                if (this.engine.fireExtinguisher || this.engine.improvedFireExtinguisher) result.push("Fire Extinguisher");
            }
            var items = this.linkableWeapons();
            for (var i = 0; i < items.length; i++) {
                if (items[i].concealment) {
                    result.push("Weapon Concealment");
                    break;
                }
            }
            if (this.topTurret && /Pop-Up/.test(this.topTurret.name)) {
                result.push(this.topTurret.name);
            }
            if (this.topBackTurret && /Pop-Up/.test(this.topBackTurret.name)) {
                result.push(this.topBackTurret.name);
            }
            if((this.sideTurret && this.sideTurret.isEWP() && this.sideTurret.ewpEjectionSystem) ||
                (this.sideBackTurret && this.sideBackTurret.isEWP() && this.sideBackTurret.ewpEjectionSystem))
                result.push("EWP Ejection System");
            return result;
        };
        vehicle.checkLinkableModifications = function () {
            if (this.links.length === 0 && this.smartLinks.length === 0) return;
            if (!this.overdrive) this.removeFromLinks("Overdrive");
            if (this.engine) {
                if (!this.engine.highTorqueMotors) this.removeFromLinks("High-Torque Motors");
                if (!this.engine.heavyDutyHighTorqueMotors) this.removeFromLinks("HD High-Torque Motors");
                if (!this.engine.improvedSuperchargerCapacitors) this.removeFromLinks("ISC");
                if (!this.engine.nitrousOxide) this.removeFromLinks("Nitrous Oxide");
                if (!this.engine.fireExtinguisher && !this.engine.improvedFireExtinguisher) this.removeFromLinks("Fire Extinguisher");
            }
            var concealment = false;
            var items = this.linkableWeapons();
            for (var i = 0; i < items.length; i++) {
                if (items[i].concealment) {
                    concealment = true;
                    break;
                }
            }
            if (!concealment) this.removeFromLinks("Weapon Concealment");
            if ((!this.topTurret || !/Pop-Up/.test(this.topTurret.name)) && (!this.topBackTurret || !/Pop-Up/.test(this.topBackTurret.name))) {
                this.removeFromLinks(CW.turrets.Pop_Up_Cupola.name);
                this.removeFromLinks(CW.turrets.Pop_Up_Turret.name);
            }
            if((!this.sideTurret || !this.sideTurret.isEWP() || !this.sideTurret.ewpEjectionSystem) &&
                (!this.sideBackTurret || !this.sideBackTurret.isEWP() || !this.sideBackTurret.ewpEjectionSystem))
                this.removeFromLinks("EWP Ejection System");
        };

        return vehicle;
    };

    CW.createCar = function () {
        var car = CW.createVehicle();

        car.body = CW.carBody.subcompact;
        car.engine = CW.createPowerPlant(CW.carPowerPlant.medium);
        car.chassis = CW.chassis.extra_heavy;
        car.suspension = CW.carSuspension.heavy;
        car.crew.push(CW.createCrew('Driver'));
        car.frontTires = CW.createTire('Standard', false);
        car.backTires = CW.createTire('Standard', false);
        car.frontArmor = CW.createArmor(1);
        car.leftArmor = CW.createArmor(1);
        car.rightArmor = CW.createArmor(1);
        car.backArmor = CW.createArmor(1);
        car.topArmor = CW.createArmor(1);
        car.underbodyArmor = CW.createArmor(1);
        car.powerPlantList = CW.carPowerPlant;
        car.type = 'Car';

        car.recalculate = function () {
            this.baseRecalculate();
            if (this.onRecalculate) this.onRecalculate();
            if (CW.validateCar) {
                var errors = CW.validateCar(this);
                this.legal = errors.length === 0;
                if (this.onErrors)
                    this.onErrors(errors); // Call even when no errors so the prior list can be cleared
            } else {
                this.legal = true;
                if (this.onErrors)
                    this.onErrors([]);
            }
        };

        car.extraWheelCost = function () {
            return this.tireCount() > 4 ? 100 : 0;
        };

        car.armorValues = function () {
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

        car.sixWheeledChassisRequired = function () {
            return (this.body === CW.carBody.pickup || this.body === CW.carBody.camper || this.body === CW.carBody.van) &&
                this.chassis === CW.chassis.extra_heavy;
        };

        var chassisOptions = [CW.chassis.light, CW.chassis.standard, CW.chassis.heavy, CW.chassis.extra_heavy];
        var suspensionOptions = [CW.carSuspension.light, CW.carSuspension.standard, CW.carSuspension.heavy, CW.carSuspension.off_road];

        car.bodyOptions = function() {
            return this.body.racingFrame ? CW.raceCarBodies : CW.carBodies;
        };
        car.setBody = function(name) {
            var i;
            this.body = CW.findByName(CW.carBody, name);
            if (this.sixWheeledChassisRequired() && !this.middleOrOuterTires) {
                this.addThirdRowTires();
            } else if (this.middleOrOuterTires && (this.body.name === CW.carBody.subcompact.name || this.body.name === CW.carBody.compact.name)) {
                this.removeThirdRowTires();
            }
            if(name !== CW.carBody.van.name) {
                this.removeAccessory(CW.accessories.LEFT_SIDE_DOOR);
                this.removeAccessory(CW.accessories.RIGHT_SIDE_DOOR);
                var accom = this.removeAccessory(CW.accessories.PASSENGER_ACCOMMODATIONS);
                if (accom) {
                    for (i = accom.count; i > 0; i--) this.removeAccessory(CW.accessories.PASSENGER_ACCOMMODATIONS);
                }
            }
            if (this.body.name === CW.carBody.DRAGSTER.name) {
                this.frontTires.motorcycle = true;
                this.frontTires.slick = false;
            } else if (this.body.name === CW.carBody.FUNNY_CAR.name) {
                this.frontTires.motorcycle = false;
                this.frontTires.slick = false;
            } else if(this.body.racingFrame) {
                this.frontTires.motorcycle = false;
                if (this.backTires.slick) this.frontTires.slick = true;
            }
            if (this.body.name === CW.carBody.FORMULA_ONE_INDY.name || this.body.name === CW.carBody.DRAGSTER.name ||
                this.body.name === CW.carBody.SPRINT.name) {
                this.frontWheelguards = null;
                this.middleWheelguards = null;
                this.backWheelguards = null;
            }
            this.recalculate();
        };
        car.nextBody = function () {
            var i;
            for (i = 1; i < CW.carBodies.length; i++) {
                if (this.body === CW.carBodies[i - 1]) {
                    this.body = CW.carBodies[i];
                    break;
                }
            }
            if (this.sixWheeledChassisRequired() && !this.middleOrOuterTires) {
                this.addThirdRowTires();
            }
            this.recalculate();
        };
        car.previousBody = function () {
            var i;
            for (i = CW.carBodies.length - 2; i >= 0; i--) {
                if (this.body === CW.carBodies[i + 1]) {
                    this.body = CW.carBodies[i];
                    break;
                }
            }
            this.removeAccessory(CW.accessories.LEFT_SIDE_DOOR);
            this.removeAccessory(CW.accessories.RIGHT_SIDE_DOOR);
            var accom = this.removeAccessory(CW.accessories.PASSENGER_ACCOMMODATIONS);
            if (accom) {
                for (i = accom.count; i > 0; i--) this.removeAccessory(CW.accessories.PASSENGER_ACCOMMODATIONS);
            }
            if (this.middleOrOuterTires && (this.body.name === CW.carBody.subcompact.name || this.body.name === CW.carBody.compact.name))
                this.removeThirdRowTires();
            this.recalculate();
        };
        car.nextRacingBody = function () {
            var i;
            for (i = 1; i < CW.raceCarBodies.length; i++) {
                if (this.body === CW.raceCarBodies[i - 1]) {
                    this.body = CW.raceCarBodies[i];
                    break;
                }
            }
            if (this.body.name === CW.carBody.DRAGSTER.name) {
                this.frontTires.motorcycle = true;
                this.frontTires.slick = false;
            } else if (this.body.name === CW.carBody.FUNNY_CAR.name) {
                this.frontTires.motorcycle = false;
                this.frontTires.slick = false;
            } else {
                this.frontTires.motorcycle = false;
                if (this.backTires.slick) this.frontTires.slick = true;
            }
            if (this.body.name === CW.carBody.FORMULA_ONE_INDY.name || this.body.name === CW.carBody.DRAGSTER.name ||
                this.body.name === CW.carBody.SPRINT.name) {
                this.frontWheelguards = null;
                this.middleWheelguards = null;
                this.backWheelguards = null;
            }
            this.recalculate();
        };
        car.previousRacingBody = function () {
            var i;
            for (i = CW.raceCarBodies.length - 2; i >= 0; i--) {
                if (this.body === CW.raceCarBodies[i + 1]) {
                    this.body = CW.raceCarBodies[i];
                    break;
                }
            }
            if (this.body.name === CW.carBody.DRAGSTER.name) {
                this.frontTires.motorcycle = true;
                this.frontTires.slick = false;
            } else if (this.body.name === CW.carBody.FUNNY_CAR.name) {
                this.frontTires.motorcycle = false;
                this.frontTires.slick = false;
            } else {
                this.frontTires.motorcycle = false;
                if (this.backTires.slick) this.frontTires.slick = true;
            }
            if (this.body.name === CW.carBody.FORMULA_ONE_INDY.name || this.body.name === CW.carBody.DRAGSTER.name ||
                this.body.name === CW.carBody.SPRINT.name) {
                this.frontWheelguards = null;
                this.middleWheelguards = null;
                this.backWheelguards = null;
            }
            this.recalculate();
        };
        car.nextChassis = function () {
            var i;
            for (i = 1; i < chassisOptions.length; i++) {
                if (this.chassis === chassisOptions[i - 1]) {
                    this.chassis = chassisOptions[i];
                    break;
                }
            }
            if (this.sixWheeledChassisRequired() && !this.middleOrOuterTires) {
                this.addThirdRowTires();
            }
            this.recalculate();
        };
        car.previousChassis = function () {
            var i;
            for (i = chassisOptions.length - 2; i >= 0; i--) {
                if (this.chassis === chassisOptions[i + 1]) {
                    this.chassis = chassisOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        car.nextSuspension = function () {
            var i;
            for (i = 1; i < suspensionOptions.length; i++) {
                if (this.suspension === suspensionOptions[i - 1]) {
                    this.suspension = suspensionOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        car.previousSuspension = function () {
            var i;
            for (i = suspensionOptions.length - 2; i >= 0; i--) {
                if (this.suspension === suspensionOptions[i + 1]) {
                    this.suspension = suspensionOptions[i];
                    break;
                }
            }
            this.recalculate();
        };
        car.nextEngine = function () {
            if (this.engine.electric) {
                if (this.engine.name === 'Small') {
                    this.engine.changeType(CW.carPowerPlant.medium);
                } else if (this.engine.name === 'Medium') {
                    this.engine.changeType(CW.carPowerPlant.large);
                } else if (this.engine.name === 'Large') {
                    this.engine.changeType(CW.carPowerPlant.supr);
                } else if (this.engine.name === 'Super') {
                    this.engine.changeType(CW.carPowerPlant.sport);
                } else if (this.engine.name === 'Sport') {
                    this.engine.changeType(CW.carPowerPlant.thundercat);
                } else if (this.engine.name === 'Thundercat') {
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
        car.previousEngine = function () {
            if (this.engine.electric) {
                if (this.engine.name === 'Thundercat') {
                    this.engine.changeType(CW.carPowerPlant.sport);
                } else if (this.engine.name === 'Sport') {
                    this.engine.changeType(CW.carPowerPlant.supr);
                } else if (this.engine.name === 'Super') {
                    this.engine.changeType(CW.carPowerPlant.large);
                } else if (this.engine.name === 'Large') {
                    this.engine.changeType(CW.carPowerPlant.medium);
                } else if (this.engine.name === 'Medium') {
                    this.engine.changeType(CW.carPowerPlant.small);
                } else if (this.engine.name === 'Small') {
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

        car.recalculate();

        return car;
    };

    CW.createOversizeVehicle = function () {
        var car = CW.createVehicle();
        car.leftBackArmor = null;
        car.rightBackArmor = null;
        car.topBackArmor = null;
        car.underbodyBackArmor = null;
        car.topBackTurret = null;
        car.sideBackTurret = null;
        car.topBackWeapons = [];
        car.underbodyBackWeapons = [];
        car.rightBackWeapons = [];
        car.leftBackWeapons = [];
        car.flatbedArmor = null;
        car.flatbedBackArmor = null;
        car.trailerStyle = null;

        car.isFlatbed = function () {
            return /Flatbed/.test(this.body.name);
        };
        car.isDualFlatbed = function () {
            return /Dual.*Flatbed/.test(this.body.name);
        };
        car.bodyName = function () {
            if (/Van/.test(this.body.name) && this.trailerStyle)
                return this.body.name.replace('Van', this.trailerStyle.name);
            return this.body.name;
        };
        car.modifiedBodyCost = function () {
            var cost = this.body.cost;
            if (this.trailerStyle) cost += Math.ceil(cost * this.trailerStyle.costFactor - 0.0001);
            if (this.carbonAluminumFrame) return cost * 4;
            return cost;
        };
        car.initialSpaces = function () {
            var space = this.body.spaces;
            if (this.trailerStyle) space -= Math.ceil(space * this.trailerStyle.spaceFactor - 0.0001);
            return space;
        };
        var oldPlasticPoints = car.plasticArmorPoints;
        car.plasticArmorPoints = function () {
            if (this.isFlatbed()) {
                var total = this.flatbedArmor ? this.flatbedArmor.plasticPoints + (this.isOversize() ? this.flatbedBackArmor.plasticPoints : 0) : 0;
                if(this.isDualFlatbed()) total += this.upperFlatbedArmor.plasticPoints + this.upperFlatbedBackArmor.plasticPoints;
                return total;
            }
            return oldPlasticPoints.apply(this, []);
        };
        car.boxPlasticArmorPoints = function () {
            if (this.isFlatbed()) return oldPlasticPoints.apply(this, []);
            return 0;
        };
        var oldMetalPoints = car.metalArmorPoints;
        car.metalArmorPoints = function () {
            if (this.isFlatbed()) {
                var total = this.flatbedArmor ? this.flatbedArmor.metalPoints + (this.isOversize() ? this.flatbedBackArmor.metalPoints : 0) : 0;
                if(this.isDualFlatbed()) total += this.upperFlatbedArmor.metalPoints + this.upperFlatbedBackArmor.metalPoints;
                return total;
            }
            return oldMetalPoints.apply(this, []);
        };
        car.boxMetalArmorPoints = function () {
            if (this.isFlatbed()) return oldMetalPoints.apply(this, []);
            return 0;
        };
        var oldSetPlastic = car.setPlasticArmor;
        car.setPlasticArmor = function (type) {
            oldSetPlastic.apply(this, [type]);
            if (this.flatbedArmor) {
                this.flatbedArmor.plasticType = type;
                if (!type) this.flatbedArmor.plasticPoints = 0;
                if (this.isOversize()) {
                    this.flatbedBackArmor.plasticType = type;
                    if (!type) this.flatbedArmor.plasticPoints = 0;
                    if(this.isDualFlatbed()) {
                        this.upperFlatbedArmor.plasticType = type;
                        this.upperFlatbedBackArmor.plasticType = type;
                        if(!type) {
                            this.upperFlatbedArmor.plasticPoints = 0;
                            this.upperFlatbedBackArmor.plasticPoints = 0;
                        }
                    }
                }
            }
        };
        var oldSetMetal = car.setMetalArmor;
        car.setMetalArmor = function (type) {
            oldSetMetal.apply(this, [type]);
            if (this.flatbedArmor) {
                this.flatbedArmor.metalType = type;
                if (!type) this.flatbedArmor.metalPoints = 0;
                if (this.isOversize()) {
                    this.flatbedBackArmor.metalType = type;
                    if (!type) this.flatbedBackArmor.metalPoints = 0;
                    if(this.isDualFlatbed()) {
                        this.upperFlatbedArmor.metalType = type;
                        this.upperFlatbedBackArmor.metalType = type;
                        if(!type) {
                            this.upperFlatbedArmor.metalPoints = 0;
                            this.upperFlatbedBackArmor.metalPoints = 0;
                        }
                    }
                }
            }
        };
        car.createFlatbedArmor = function () {
            if(!this.flatbedArmor) {
                this.flatbedArmor = CW.createArmor(this.frontArmor.plasticType ? 1 : 0,
                        this.frontArmor.metalType && !this.frontArmor.plasticType ? 1 : 0);
                this.flatbedArmor.plasticType = this.frontArmor.plasticType;
                this.flatbedArmor.metalType = this.frontArmor.metalType;
            }
            if (this.isOversize()) {
                if(!this.flatbedBackArmor) {
                    this.flatbedBackArmor = CW.createArmor(this.frontArmor.plasticType ? 1 : 0,
                            this.frontArmor.metalType && !this.frontArmor.plasticType ? 1 : 0);
                    this.flatbedBackArmor.plasticType = this.frontArmor.plasticType;
                    this.flatbedBackArmor.metalType = this.frontArmor.metalType;
                }
                if(this.isDualFlatbed()) {
                    if(!this.upperFlatbedArmor) {
                        this.upperFlatbedArmor = CW.createArmor(this.frontArmor.plasticType ? 1 : 0,
                                this.frontArmor.metalType && !this.frontArmor.plasticType ? 1 : 0);
                        this.upperFlatbedBackArmor = CW.createArmor(this.frontArmor.plasticType ? 1 : 0,
                                this.frontArmor.metalType && !this.frontArmor.plasticType ? 1 : 0);
                        this.upperFlatbedArmor.plasticType = this.frontArmor.plasticType;
                        this.upperFlatbedArmor.metalType = this.frontArmor.metalType;
                        this.upperFlatbedBackArmor.plasticType = this.frontArmor.plasticType;
                        this.upperFlatbedBackArmor.metalType = this.frontArmor.metalType;
                    }
                }
            }
        };
        car.removeFlatbedArmor = function() {
            this.flatbedArmor = null;
            this.flatbedBackArmor = null;
            this.upperFlatbedArmor = null;
            this.upperFlatbedBackArmor = null;
        };
        car.compositeArmor = function () {
            var plastic = this.plasticArmorPoints();
            var metal = this.metalArmorPoints();
            if (this.isFlatbed()) {
                plastic += oldPlasticPoints.apply(this);
                metal += oldMetalPoints.apply(this);
            }
            return plastic > 0 && metal > 0;
        };

        car.recalculateAccessories = function () {
            if (this.trailerStyle) this.weightUsed += Math.ceil((this.carbonAluminumFrame ? this.body.weight / 2 : this.body.weight) * this.trailerStyle.weightFactor - 0.0001);
            if (this.isFlatbed()) {
                var boxCost = /40/.test(this.body.name) ? 11 : 9;
                this.totalCost += Math.ceil(boxCost * oldPlasticPoints.apply(this, []) * (this.frontArmor.plasticType ? this.frontArmor.plasticType.costFactor : 0) * (this.sloped ? 1.1 : 1) - 0.0001);
                this.totalCost += Math.ceil(boxCost * oldMetalPoints.apply(this, []) * (this.frontArmor.metalType ? this.frontArmor.metalType.costFactor : 0) * (this.sloped ? 1.1 : 1) - 0.0001);
                this.weightUsed += Math.ceil(5 * oldPlasticPoints.apply(this, []) * (this.frontArmor.plasticType ? this.frontArmor.plasticType.weightFactor : 0) - 0.0001);
                this.weightUsed += Math.ceil(5 * oldMetalPoints.apply(this, []) * (this.frontArmor.metalType ? this.frontArmor.metalType.weightFactor : 0) - 0.0001);
            }
            // Weapons taken care of in superclass to use helper methods
            if (this.isOversize()) {
                if (this.sideBackTurret) {
                    this.totalCost += this.sideBackTurret.totalCost()*2;
                    this.weightUsed += this.sideBackTurret.totalWeight(this.personalEquipmentWeight)*2;
                    this.spaceUsed += this.sideBackTurret.totalSpace()*2;
                }
                if (this.topBackTurret) {
                    this.totalCost += this.topBackTurret.totalCost();
                    this.weightUsed += this.topBackTurret.totalWeight(this.personalEquipmentWeight);
                    this.spaceUsed += this.topBackTurret.totalSpace();
                }
            }
        };

        car.armorValues = function () {
            var result, composite = this.compositeArmor();
            if (this.isOversize()) {
                result = [
                    {location: 'Front', value: this.frontArmor.armorPointDescription(composite) + (this.stealthKoteIn('Front') ? "+1" : "")},
                    {location: 'Left Front', value: this.leftArmor.armorPointDescription(composite) + (this.stealthKoteIn('Left') ? "+1" : "")},
                    {location: 'Left Back', value: this.leftBackArmor.armorPointDescription(composite) + (this.stealthKoteIn('LeftBack') ? "+1" : "")},
                    {location: 'Right Front', value: this.rightArmor.armorPointDescription(composite) + (this.stealthKoteIn('Right') ? "+1" : "")},
                    {location: 'Right Back', value: this.rightBackArmor.armorPointDescription(composite) + (this.stealthKoteIn('RightBack') ? "+1" : "")},
                    {location: 'Back', value: this.backArmor.armorPointDescription(composite) + (this.stealthKoteIn('Back') ? "+1" : "")},
                    {location: 'Top Front', value: this.topArmor.armorPointDescription(composite) + (this.stealthKoteIn('Top') ? "+1" : "")},
                    {location: 'Top Back', value: this.topBackArmor.armorPointDescription(composite) + (this.stealthKoteIn('TopBack') ? "+1" : "")},
                    {location: 'Under Front', value: this.underbodyArmor.armorPointDescription(composite) + (this.stealthKoteIn('Underbody') ? "+1" : "")},
                    {location: 'Under Back', value: this.underbodyBackArmor.armorPointDescription(composite) + (this.stealthKoteIn('UnderbodyBack') ? "+1" : "")}
                ];
            } else {
                result = [
                    {location: 'Front', value: this.frontArmor.armorPointDescription(composite) + (this.stealthKoteIn('Front') ? "+1" : "")},
                    {location: 'Left', value: this.leftArmor.armorPointDescription(composite) + (this.stealthKoteIn('Left') ? "+1" : "")},
                    {location: 'Right', value: this.rightArmor.armorPointDescription(composite) + (this.stealthKoteIn('Right') ? "+1" : "")},
                    {location: 'Back', value: this.backArmor.armorPointDescription(composite) + (this.stealthKoteIn('Back') ? "+1" : "")},
                    {location: 'Top', value: this.topArmor.armorPointDescription(composite) + (this.stealthKoteIn('Top') ? "+1" : "")},
                    {location: 'Under', value: this.underbodyArmor.armorPointDescription(composite) + (this.stealthKoteIn('Underbody') ? "+1" : "")}
                ];
            }
            if (this.flatbedArmor) {
                if (this.isOversize()) {
                    result.push({location: 'Bed Front', value: this.flatbedArmor.armorPointDescription(composite)});
                    result.push({location: 'Bed Back', value: this.flatbedBackArmor.armorPointDescription(composite)});
                    if(this.isDualFlatbed()) {
                        result.push({location: 'Upper Front', value: this.upperFlatbedArmor.armorPointDescription(composite)});
                        result.push({location: 'Upper Back', value: this.upperFlatbedBackArmor.armorPointDescription(composite)});
                    }
                } else {
                    result.push({location: 'Flatbed', value: this.flatbedArmor.armorPointDescription(composite)});
                }
            }
            return result;
        };

        return car;
    };

    CW.createTire = function (type, motorcycle, truck) {
        var tire;
        if (type === 'Heavy-Duty') {
            tire = CW.create(CW.carTire.hd);
        } else if (type === 'Puncture-Resistant') {
            tire = CW.create(CW.carTire.pr);
        } else if (type === 'Solid') {
            tire = CW.create(CW.carTire.solid);
        } else if (type === 'Plasticore') {
            tire = CW.create(CW.carTire.plasticore);
        } else {
            tire = CW.create(CW.carTire.standard);
        }
        tire.steelbelted = false;
        tire.radial = false;
        tire.offRoad = false;
        tire.slick = false;
        tire.fireproof = false;
        tire.tireChains = false;
        tire.snowTires = false;
        tire.motorcycle = motorcycle ? true : false;
        tire.truck = truck ? true : false;
        tire.type = 'Tire';

        tire.baseWeight = function() {
            return tire.weight * (tire.motorcycle ? 0.5 : 1) * (tire.truck ? 2 : 1);
        };
        tire.baseCost = function() {
            return tire.cost * (tire.truck ? 3 : 1);
        };

        tire.optionData = function (option) {
            var baseWeight = this.baseWeight();
            var baseCost = this.baseCost();
            if (option === "steelbelted") return {
                cost: baseCost * 0.5,
                weight: baseWeight * 0.5
            };
            if (option === "radial") return {
                cost: (tire.steelbelted ? baseCost * 1.5 : baseCost) * 1.5,
                weight: (tire.steelbelted ? baseWeight * 1.5 : baseWeight) * 0.2
            };
            if (option === "offRoad") return {
                cost: (tire.steelbelted ? baseCost * 1.5 : baseCost) * 0.2,
                weight: (tire.motorcycle ? 2.5 : 5)
            };
            if (option === "slick") return {
                cost: (tire.steelbelted ? baseCost * 1.5 : baseCost) * 3,
                weight: (tire.steelbelted ? baseWeight * 1.5 : baseWeight)
            };
            if (option === 'snowTires') return {
                cost: (tire.offRoad ? 50 : 100)
            };
            if (option === "fireproof") return {
                cost: tire.totalCost() * (tire.fireproof ? 0.5 : 1)
            };
            if (option === 'tireChains') return {
                cost: 25,
                weight: 5
            };
            return null;
        };

        tire.isPlasticore = function () {
            return tire.name === 'Plasticore';
        };

        tire.totalCost = function (ignoreChains) {
            var total = tire.cost * (tire.truck ? 3 : 1);
            if (tire.steelbelted) total += (total * 0.5);
            if (tire.radial) total += (total * 1.5);
            if (tire.offRoad) total += (total * 0.2);
            if (tire.slick) total += (total * 3);
            if (tire.snowTires) total += (tire.offRoad ? 50 : 100);
            if (tire.fireproof) total *= 2;
            if (!ignoreChains && tire.tireChains) total += 25;
            return total;
        };

        tire.totalWeight = function (ignoreChains) {
            var total = tire.weight;
            if (tire.steelbelted) total += total * 0.5;
            if (tire.radial) total += total * 0.2;
            if (tire.offRoad) total += 5;
            if (tire.slick) total *= 2;
            if (tire.motorcycle) total /= 2;
            if (tire.truck) total *= 2;
            if (!ignoreChains && tire.tireChains) total += 5;
            return total;
        };

        tire.totalSpace = function () {
            return 1; // This is only used when carrying it as cargo
        };

        tire.ownDP = function () {
            var total = tire.truck && tire.name === 'Plasticore' ? 40 : tire.dp * (tire.truck ? 2 : 1);
            if (tire.steelbelted) total += Math.floor(total * 0.25);
            if (tire.radial) total -= 1;
            if (tire.slick) total += 1;
            return total;
        };
        tire.totalDP = function () {
            return this.ownDP();
        };
        tire.singleItemDP = function () {
            return this.ownDP();
        };

        tire.changeType = function (type) {
            if (typeof type === 'string') {
                type = CW.findByName(CW.carTire, type);
            }
            if (type) {
                this.name = type.name;
                this.abbv = type.abbv;
                this.cost = type.cost;
                this.weight = type.weight;
                this.dp = type.dp;
                if (this.abbv === 'PC') {
                    this.steelbelted = false;
                    this.radial = false;
                    this.offRoad = false;
                    this.slick = false;
                    if (this.truck) this.fireproof = false;
                }
                return true;
            }
            return false;
        };

        tire.next = function () {
            if (this.abbv === 'Std') {
                this.changeType(CW.carTire.hd);
            } else if (this.abbv === 'HD') {
                this.changeType(CW.carTire.pr);
            } else if (this.abbv === 'PR') {
                this.changeType(CW.carTire.solid);
            } else if (this.abbv === 'Sld') {
                this.changeType(CW.carTire.plasticore);
            } else if (this.abbv === 'PC') {
                return false;
            }
            return true;
        };

        tire.previous = function () {
            if (this.abbv === 'PC') {
                this.changeType(CW.carTire.solid);
            } else if (this.abbv === 'Sld') {
                this.changeType(CW.carTire.pr);
            } else if (this.abbv === 'PR') {
                this.changeType(CW.carTire.hd);
            } else if (this.abbv === 'HD') {
                this.changeType(CW.carTire.standard);
            } else if (this.abbv === 'Std') {
                return false;
            }
            return true;
        };

        tire.duplicate = function (other) {
            if (tire !== other) {
                this.name = other.name;
                this.abbv = other.abbv;
                this.cost = other.cost;
                this.weight = other.weight;
                this.dp = other.dp;
                this.steelbelted = other.steelbelted;
                this.radial = other.radial;
                this.offRoad = other.offRoad;
                this.slick = other.slick;
                this.fireproof = other.fireproof;
                this.tireChains = other.tireChains;
                this.snowTires = other.snowTires;
                // Don't copy motorcycle flag due to dragsters
                this.truck = other.truck;
            }
        };

        tire.textDescription = function () {
            var text = "";
            if (tire.motorcycle) text += "Motorcycle ";
            if (tire.fireproof) text += "Fireproof ";
            if (tire.offRoad) text += "Off-Road ";
            if (tire.steelbelted) text += "Steelbelted ";
            text += tire.name;
            if (tire.radial) text += " Radial";
            if (tire.slick) text += " Slick";
            if (tire.snowTires) text += " Snow";
            return text;
        };

        return tire;
    };

    CW.createCrew = function (type) {
        var crew = {
            type: 'Crew',
            name: type || 'Driver',
            weight: 150,
            singleWeaponComputer: false,
            highResSingleWeaponComputer: false,
            targetingComputer: false,
            highResComputer: false,
            cyberlink: false,
            bodyArmor: false,
            improvedBodyArmor: false,
            impactArmor: false,
            fireproofSuit: false,
            flakJacket: false,
            battleVest: false,
            armoredBattleVest: false,
            portableFireExtinguisher: false,
            safetySeat: false,
            ejectionSeat: false,
            unsafeEjectionSeat: false,
            extraDriverControls: false,
            handWeapons: [],
            gear: [],
            componentArmor: null,
            inSidecar: false
        };
        crew.space = crew.name === 'Driver' || crew.name === 'Cyclist' || crew.name === 'Gunner' ? 2 : 1;

        crew.hasPersonalEquipment = function () {
            var i;
            if (this.bodyArmor || this.improvedBodyArmor || this.impactArmor || this.fireproofSuit || this.flakJacket ||
                this.battleVest || this.armoredBattleVest || this.portableFireExtinguisher) return true;
            for (i = 0; i < this.gear.length; i++)
                if (this.gear[i].weight > 0) return true;
            for (i = 0; i < this.handWeapons.length; i++)
                if (this.handWeapons[i].totalWeight() > 0) return true;
            return false;
        };

        crew.getGear = function (type) {
            for (var i = 0; i < this.gear.length; i++) {
                if (this.gear[i].name === type.name) {
                    return this.gear[i];
                }
            }
            return null;
        };
        crew.hasGear = function(type) {
            return !!crew.getGear(type);
        };
        crew.addGear = function (type) {
            for (var i = 0; i < this.gear.length; i++) {
                if (this.gear[i].name === type.name) {
                    this.gear[i].count += 1;
                    return this.gear[i];
                }
            }
            var item = CW.createPersonalGear(type);
            this.gear.push(item);
            return item;
        };
        crew.removeGear = function (type) {
            var item = null, i;
            for (i = 0; i < this.gear.length; i++) {
                if (this.gear[i].name === type.name) {
                    item = this.gear[i];
                    item.count -= 1;
                    if (item.count === 0) {
                        this.gear.splice(i, 1);
                    }
                    return item;
                }
            }
            return null;
        };

        crew.currentBodyArmorAbbv = function () {
            if (crew.impactArmor) return "ImpA";
            if (crew.improvedBodyArmor) return "IBA";
            if (crew.bodyArmor) return "BA";
            return null;
        };
        crew.currentBodyArmorDP = function () {
            if (crew.impactArmor) return 6;
            if (crew.improvedBodyArmor) return 6;
            if (crew.bodyArmor) return 3;
            return 0;
        };
        crew.currentBodyArmorCost = function () {
            if (crew.impactArmor) return 2000;
            if (crew.improvedBodyArmor) return 1500;
            if (crew.bodyArmor) return 250;
            return 0;
        };
        crew.currentBodyArmorName = function () {
            if (crew.impactArmor) return "Impact Armor";
            if (crew.improvedBodyArmor) return "Improved Body Armor";
            if (crew.bodyArmor) return "Body Armor";
            return "No personal armor";
        };
        crew.currentBodyArmor = function () {
            if (crew.impactArmor) return "Impact Armor ($2000, 25 lbs.)";
            if (crew.improvedBodyArmor) return "Improved Body Armor ($1500, 25 lbs.)";
            if (crew.bodyArmor) return "Body Armor ($250, 10 lbs.)";
            return null;
        };
        crew.nextBodyArmor = function () {
            if (crew.impactArmor) {
                return null;
            } else if (crew.improvedBodyArmor) {
                crew.improvedBodyArmor = false;
                crew.impactArmor = true;
            } else if (crew.bodyArmor) {
                crew.bodyArmor = false;
                crew.improvedBodyArmor = true;
            } else {
                crew.bodyArmor = true;
            }
            return this.currentBodyArmor();
        };
        crew.previousBodyArmor = function () {
            if (crew.bodyArmor) {
                crew.bodyArmor = false;
            } else if (crew.improvedBodyArmor) {
                crew.improvedBodyArmor = false;
                crew.bodyArmor = true;
            } else if (crew.impactArmor) {
                crew.impactArmor = false;
                crew.improvedBodyArmor = true;
            }
            return this.currentBodyArmor();
        };

        crew.currentComputerName = function () {
            if (this.singleWeaponComputer) return "Single-Wpn Computer";
            if (this.targetingComputer) return "Targeting Computer";
            if (this.highResSingleWeaponComputer) return "High-Res S.W. Computer";
            if (this.highResComputer) return "High-Res Computer";
            if (this.cyberlink) return "Cyberlink";
            return "No computer";
        };
        crew.currentComputer = function () {
            if (this.singleWeaponComputer) return "Single-Weapon Computer ($500)";
            if (this.targetingComputer) return "Targeting Computer ($1000)";
            if (this.highResSingleWeaponComputer) return "High-Res Single-Weapon Computer ($2500)";
            if (this.highResComputer) return "High-Res Computer ($4000)";
            if (this.cyberlink) return "Cyberlink ($16000, 100 lbs., 1 space)";
            return null;
        };
        crew.currentComputerCost = function () {
            if (this.singleWeaponComputer) return 500;
            if (this.targetingComputer) return 1000;
            if (this.highResSingleWeaponComputer) return 2500;
            if (this.highResComputer) return 4000;
            if (this.cyberlink) return 16000;
            return null;
        };
        crew.nextComputer = function () {
            if (crew.cyberlink) {
                return null;
            } else if (crew.highResComputer) {
                crew.highResComputer = false;
                crew.cyberlink = true;
            } else if (crew.highResSingleWeaponComputer) {
                crew.highResSingleWeaponComputer = false;
                crew.highResComputer = true;
            } else if (crew.targetingComputer) {
                crew.targetingComputer = false;
                crew.highResSingleWeaponComputer = true;
            } else if (crew.singleWeaponComputer) {
                crew.singleWeaponComputer = false;
                crew.targetingComputer = true;
            } else {
                crew.singleWeaponComputer = true;
            }
            return this.currentComputer();
        };

        crew.previousComputer = function () {
            if (crew.singleWeaponComputer) {
                crew.singleWeaponComputer = false;
            } else if (crew.targetingComputer) {
                crew.targetingComputer = false;
                crew.singleWeaponComputer = true;
            } else if (crew.highResSingleWeaponComputer) {
                crew.highResSingleWeaponComputer = false;
                crew.targetingComputer = true;
            } else if (crew.highResComputer) {
                crew.highResComputer = false;
                crew.highResSingleWeaponComputer = true;
            } else if (crew.cyberlink) {
                crew.cyberlink = false;
                crew.highResComputer = true;
            }
            return this.currentComputer();
        };

        crew.currentSeatName = function () {
            if (crew.safetySeat) return "Safety Seat";
            if (crew.ejectionSeat) return "Ejection Seat";
            if (crew.unsafeEjectionSeat) return "Ej. Seat/no chute";
            return "Normal seat";
        };
        crew.currentSeat = function () {
            if (crew.safetySeat) return "Safety Seat ($500, 25 lbs.)";
            if (crew.ejectionSeat) return "Ejection Seat ($500, 100 lbs.)";
            if (crew.unsafeEjectionSeat) return "Ejection Seat sans glider or parachute ($400, 100 lbs.)";
            return null;
        };
        crew.nextSeat = function () {
            if (crew.unsafeEjectionSeat) {
                return null;
            } else if (crew.ejectionSeat) {
                crew.ejectionSeat = false;
                crew.unsafeEjectionSeat = true;
            } else if (crew.safetySeat) {
                crew.safetySeat = false;
                crew.ejectionSeat = true;
            } else {
                crew.safetySeat = true;
            }
            return this.currentSeat();
        };
        crew.previousSeat = function () {
            if (crew.safetySeat) {
                crew.safetySeat = false;
            } else if (crew.ejectionSeat) {
                crew.ejectionSeat = false;
                crew.safetySeat = true;
            } else if (crew.unsafeEjectionSeat) {
                crew.unsafeEjectionSeat = false;
                crew.ejectionSeat = true;
            }
            return this.currentSeat();
        };
        crew.maximumGE = function() {
            return crew.improvedBodyArmor || crew.impactArmor ? 5 : 6;
        };
        crew.totalGE = function() {
            var i, ge = 0, bv = false, bvp = 0, bvg = 0, bvb = 0, bvm = 0, count;
            if (crew.battleVest) {
                ge += 3;
                bv = true;
            }
            if (crew.armoredBattleVest) {
                ge += 3;
                bv = true;
            }
            for (i = 0; i < crew.handWeapons.length; i++) {
                if (bv) {
                    if (bvp < 1 && crew.handWeapons[i].isPistol()) {
                        bvp += 1;
                        ge -= crew.handWeapons[i].ge;
                    }
                    if (bvg < 2 && crew.handWeapons[i].isGrenade()) {
                        ge -= Math.min(2-bvg, crew.handWeapons[i].count);
                        bvg += Math.min(2-bvg, crew.handWeapons[i].count);
                    }
                    if (bvb < 1 && crew.handWeapons[i].name === CW.handWeapons.BwK.name) {
                        bvb += 1;
                        ge -= CW.handWeapons.BwK.ge;
                    }
                    if (bvm < 2 && crew.handWeapons[i].extendedClips > 0) {
                        count = Math.min(2 - bvm, crew.handWeapons[i].extendedClips*crew.handWeapons[i].count);
                        bvm += count;
                        ge -= count * (crew.handWeapons[i].abbv === 'SMG' || crew.handWeapons[i].abbv === 'GL' ? 2 : 1);
                    } // TODO: stash all extended mags first?
                    if (bvm < 2 && crew.handWeapons[i].extraClips > 0) {
                        count = Math.min(2 - bvm, crew.handWeapons[i].extraClips*crew.handWeapons[i].count);
                        bvm += count;
                        ge -= count * (crew.handWeapons[i].abbv === 'SMG' || crew.handWeapons[i].abbv === 'GL' ? 1 : 0.5);
                    }
                }
                ge += crew.handWeapons[i].totalGE();
            }
            for (i = 0; i < crew.gear.length; i++) ge += crew.gear[i].totalGE();
            if (crew.portableFireExtinguisher) ge += 3;
            if (crew.flakJacket) ge += 3;
            return ge;
        };

        crew.unarmoredSpace = function () {
            return crew.space + (crew.cyberlink ? 1 : 0);
        };
        crew.totalSpace = function () {
            return crew.unarmoredSpace() + (crew.componentArmor ? crew.componentArmor.totalSpace() : 0);
        };
        crew.equipmentWeight = function() {
            var i, total = 0;
            if (crew.bodyArmor) total += 10;
            if (crew.flakJacket) total += 5;
            if (crew.battleVest || crew.armoredBattleVest) total += 5;
            if (crew.improvedBodyArmor) total += 25;
            if (crew.impactArmor) total += 25;
            if (crew.fireproofSuit) total += 3;
            if (crew.portableFireExtinguisher) total += 20;
            for (i = 0; i < crew.handWeapons.length; i++) total += crew.handWeapons[i].totalWeight();
            for (i = 0; i < crew.gear.length; i++) total += crew.gear[i].totalWeight();
            return total;
        };
        crew.totalWeight = function (handWeaponWeight) {
            var i, total = crew.weight;
            if (crew.cyberlink) total += 100;
            if (crew.safetySeat) total += 25;
            if (crew.ejectionSeat || crew.unsafeEjectionSeat) total += 100;
            if (crew.extraDriverControls) total += 50;
            if (handWeaponWeight) total += this.equipmentWeight();
            if (crew.componentArmor) total += crew.componentArmor.totalWeight();
            return total;
        };
        crew.totalCost = function () {
            var i, total = 0;
            if (crew.singleWeaponComputer) total += 500;
            if (crew.highResSingleWeaponComputer) total += 2500;
            if (crew.targetingComputer) total += 1000;
            if (crew.highResComputer) total += 4000;
            if (crew.cyberlink) total += 16000;
            if (crew.bodyArmor) total += 250;
            if (crew.improvedBodyArmor) total += 1500;
            if (crew.impactArmor) total += 2000;
            if (crew.fireproofSuit) total += 500;
            if (crew.flakJacket) total += 150;
            if (crew.battleVest) total += 75;
            if (crew.armoredBattleVest) total += 225;
            if (crew.portableFireExtinguisher) total += 150;
            if (crew.safetySeat) total += 500;
            if (crew.ejectionSeat) total += 500;
            if (crew.unsafeEjectionSeat) total += 400;
            if (crew.extraDriverControls) total += 1000;
            for (i = 0; i < crew.handWeapons.length; i++) total += crew.handWeapons[i].totalCost();
            for (i = 0; i < crew.gear.length; i++) total += crew.gear[i].totalCost();
            if (crew.componentArmor) total += crew.componentArmor.totalCost();
            return total;
        };
        crew.totalDP = function () {
            var total = this.ownDP();
            if (crew.impactArmor || crew.improvedBodyArmor) total += 6;
            else if (crew.bodyArmor) total += 3;
            if (crew.componentArmor) total += crew.componentArmor.totalDP();
            return total;
        };
        crew.ownDP = function () {
            return 3;
        }; // TODO: bodybuilding?

        crew.fullName = function() {
            var text = '';
            if(this.inSidecar) text += 'Sidecar ';
            else if(this.inCarrier) text += 'Carrier ';
            return text+this.name;
        };

        crew.textDescription = function (plural) {
            var i, text = [crew.name + (plural ? 's' : '')], first, count, same;
            if (crew.singleWeaponComputer || crew.highResSingleWeaponComputer || crew.targetingComputer || crew.highResComputer
                || crew.cyberlink || crew.bodyArmor || crew.improvedBodyArmor || crew.impactArmor || crew.fireproofSuit
                || crew.battleVest || crew.armoredBattleVest
                || crew.portableFireExtinguisher || crew.componentArmor || crew.safetySeat
                || crew.ejectionSeat || crew.unsafeEjectionSeat || crew.handWeapons.length > 0 || crew.gear.length > 0
                || crew.extraDriverControls) {
                if (plural) text.push(" each");
                text.push(" w/");
                first = true;
                first = CW.writeAccessory(text, crew.singleWeaponComputer, "SWC", first);
                first = CW.writeAccessory(text, crew.highResSingleWeaponComputer, "HRSWC", first);
                first = CW.writeAccessory(text, crew.targetingComputer, "TC", first);
                first = CW.writeAccessory(text, crew.highResComputer, "HRTC", first);
                first = CW.writeAccessory(text, crew.cyberlink, "Cyberlink", first);
                first = CW.writeAccessory(text, crew.fireproofSuit, "Fireproof Suit", first);
                first = CW.writeAccessory(text, crew.flakJacket, "Flak Jacket", first);
                first = CW.writeAccessory(text, crew.bodyArmor, "BA", first);
                first = CW.writeAccessory(text, crew.improvedBodyArmor, "IBA", first);
                first = CW.writeAccessory(text, crew.impactArmor, "Impact Armor", first);
                first = CW.writeAccessory(text, crew.battleVest, "Battle Vest", first);
                first = CW.writeAccessory(text, crew.armoredBattleVest, "Armored Battle Vest", first);
                first = CW.writeAccessory(text, crew.portableFireExtinguisher, "PFE", first);
                first = CW.writeAccessory(text, crew.safetySeat, "Safety Seat", first);
                first = CW.writeAccessory(text, crew.ejectionSeat, "Ejection Seat", first);
                first = CW.writeAccessory(text, crew.unsafeEjectionSeat, "Ejection Seat (no chute)", first);
                first = CW.writeAccessory(text, crew.extraDriverControls, "Extra Driver Controls", first);
                first = CW.writeAccessory(text, !!crew.componentArmor, crew.componentArmor ? crew.componentArmor.textDescription() : "", first);
                var weapons = CW.sortItems(crew.handWeapons);
                for (i = 0; i < weapons.length; i++) {
                    count = 1;
                    same = weapons[i].textDescription();
                    while(i+1 < weapons.length && weapons[i+1].textDescription() === same) {
                        i += 1;
                        count += 1;
                    }
                    if(count > 1) first = CW.writeAccessory(text, true, count+" "+weapons[i].textDescription(true), first);
                    else first = CW.writeAccessory(text, true, same, first);
                }
                for (i = 0; i < crew.gear.length; i++){
                    first = CW.writeAccessory(text, true, crew.gear[i].textDescription(), first);}
            }
            return text.join('');
        };

        return crew;
    };

    CW.expectedTime = function (rollOn2D6) {
        if (rollOn2D6 > 12) return 99999;
        switch (rollOn2D6) {
            case 12:
                return 36;
            case 11:
                return 12;
            case 10:
                return 6;
            case 9:
                return 3.6;
            case 8:
                return 2.4;
            case 7:
                return 1.71;
            case 6:
                return 1.38;
            case 5:
                return 1.2;
            case 4:
                return 1.09;
            case 3:
                return 1.03;
            default:
                return 1;
        }
    };

    CW.mechanicRoll = function (mechanicLevel, bonus, difficulty) {
        if (mechanicLevel === 0) {
            if (difficulty === 'Hard') return 12 - bonus;
            else if (difficulty === 'Medium') return 11 - bonus;
            else if (difficulty === 'Easy') return 9 - bonus;
            else if (difficulty === 'Trivial') return 1 - bonus;
        } else if (mechanicLevel === 1) {
            if (difficulty === 'Hard') return 11 - bonus;
            else if (difficulty === 'Medium') return 9 - bonus;
            else if (difficulty === 'Easy') return 7 - bonus;
            else if (difficulty === 'Trivial') return 1 - bonus;
        } else if (mechanicLevel === 2) {
            if (difficulty === 'Hard') return 9 - bonus;
            else if (difficulty === 'Medium') return 7 - bonus;
            else if (difficulty === 'Easy') return 5 - bonus;
            else if (difficulty === 'Trivial') return 1 - bonus;
        } else if (mechanicLevel === 3) {
            if (difficulty === 'Hard') return 7 - bonus;
            else if (difficulty === 'Medium') return 5 - bonus;
            else if (difficulty === 'Easy') return 3 - bonus;
            else if (difficulty === 'Trivial') return 1 - bonus;
        }
        return 13;
    };

    CW.repairCost = function (itemCost, itemDP, damage) {
        var cost = itemCost;
        if (damage < itemDP) {
            switch (damage) {
                case 1:
                    cost = cost * 0.1;
                    break;
                case 2:
                    cost = cost * 0.3;
                    break;
                case 3:
                    cost = cost * 0.5;
                    break;
                case 4:
                    cost = cost * 0.7;
                    break;
                case 5:
                    cost = cost * 0.9;
                    break;
            }
        }
        return Math.ceil(cost - 0.0001);
    };

    CW.createPowerPlant = function (type) {
        var plant;
        plant = CW.create(type);
        plant.powerUnits = plant.space * 50;
        plant.platinumCatalysts = false;
        plant.superconductors = false;
        plant.extraPowerCells = 0;
        plant.improvedSuperchargerCapacitors = 0;
        plant.fireExtinguisher = false;
        plant.improvedFireExtinguisher = false;
        plant.componentArmor = null;
        plant.highTorqueMotors = false;
        plant.heavyDutyHighTorqueMotors = false;
        plant.fireRetardantInsulator = false;
        plant.laserBatteries = 0;
        plant.electric = true;

        plant.changeType = function (type) {
            plant.name = type.name;
            plant.cost = type.cost;
            plant.weight = type.weight;
            plant.space = type.space;
            plant.dp = type.dp;
            plant.powerFactors = type.powerFactors;
            plant.maxLoad = type.maxLoad;
        };

        plant.optionData = function (option, wheelCount) {
            if (option === "platinumCatalysts") return {
                cost: Math.floor(plant.cost * 0.2 + 0.0001)
            };
            if (option === 'superconductors') return {
                cost: Math.floor(plant.cost * 0.5 + 0.0001)
            };
            if (option === 'highTorqueMotors') return {
                cost: wheelCount * 100
            };
            if (option === 'heavyDutyHighTorqueMotors') return {
                cost: wheelCount * 200
            };
            if (option === 'laserBattery') return {
                cost: 500,
                weight: 100,
                space: 1
            };
            if (option === 'fireExtinguisher') return {
                cost: 300,
                weight: 150,
                space: 1
            };
            if (option === 'improvedFireExtinguisher') return {
                cost: 500,
                weight: 200,
                space: 1
            };
            if (option === 'extraPowerCells') return {
                cost: Math.ceil(plant.extraPowerCells * plant.cost * 0.25 - 0.0001),
                weight: Math.ceil(plant.extraPowerCells * plant.weight * 0.25 - 0.0001),
                space: Math.ceil(plant.extraPowerCells * plant.space * 0.1 - 0.0001)
            };
            if (option === 'improvedSuperchargerCapacitors') return {
                cost: plant.improvedSuperchargerCapacitors * 500,
                weight: plant.improvedSuperchargerCapacitors * 75,
                space: plant.improvedSuperchargerCapacitors
            };
            if (option === 'fireRetardantInsulator') return {
                cost: 150 * plant.unarmoredSpace(),
                weight: 25 * plant.unarmoredSpace(),
                space: 1
            };
            if (option === 'componentArmor') return {
                cost: plant.componentArmor.totalCost(),
                weight: plant.componentArmor.totalWeight(),
                space: plant.componentArmor.totalSpace()
            };
            return null;
        };

        plant.costPerTire = function () {
            if (this.highTorqueMotors) return 100;
            else if (this.heavyDutyHighTorqueMotors) return 200;
            return 0;
        };

        plant.totalCost = function (wheelCount) {
            var total = plant.cost;
            if (plant.platinumCatalysts) total += Math.floor(plant.cost * 0.2 + 0.0001);
            if (plant.superconductors) total += Math.floor(plant.cost * 0.5 + 0.0001);
            total += Math.ceil(plant.extraPowerCells * plant.cost * 0.25 - 0.0001);
            total += plant.improvedSuperchargerCapacitors * 500;
            if (plant.fireExtinguisher) total += 300;
            if (plant.improvedFireExtinguisher) total += 500;
            if (plant.highTorqueMotors) total += wheelCount * 100;
            if (plant.heavyDutyHighTorqueMotors) total += wheelCount * 200;
            if (plant.componentArmor) total += plant.componentArmor.totalCost();
            if (plant.fireRetardantInsulator) total += 150 * plant.unarmoredSpace();
            total += plant.laserBatteries * 500;
            return total;
        };

        plant.engineOnlyCost = function () {
            var total = plant.cost;
            if (plant.platinumCatalysts) total += Math.floor(plant.cost * 0.2 + 0.0001);
            if (plant.superconductors) total += Math.floor(plant.cost * 0.5 + 0.0001);
            total += Math.ceil(plant.extraPowerCells * plant.cost * 0.25 - 0.0001);
            total += plant.improvedSuperchargerCapacitors * 500;
            return total;
        };

        plant.totalWeight = function () {
            var total = plant.weight;
            total += Math.ceil(plant.extraPowerCells * plant.weight * 0.25 - 0.0001);
            total += plant.improvedSuperchargerCapacitors * 75;
            if (plant.fireExtinguisher) total += 150;
            if (plant.improvedFireExtinguisher) total += 200;
            if (plant.componentArmor) total += plant.componentArmor.totalWeight();
            if (plant.fireRetardantInsulator) total += 25 * plant.unarmoredSpace();
            total += plant.laserBatteries * 100;
            return total;
        };

        plant.unarmoredSpace = function () {
            var total = plant.space;
            total += plant.improvedSuperchargerCapacitors;
            total += Math.ceil(plant.extraPowerCells * plant.space * 0.1 - 0.0001);
            if (plant.fireExtinguisher) total += 1;
            if (plant.improvedFireExtinguisher) total += 1;
            total += plant.laserBatteries;
            return total;
        };

        plant.totalSpace = function () {
            return plant.unarmoredSpace() + (plant.componentArmor ? plant.componentArmor.totalSpace() : 0) + (plant.fireRetardantInsulator ? 1 : 0);
        };

        plant.totalPowerFactors = function () {
            var total = plant.powerFactors;
            if (plant.platinumCatalysts) total += Math.floor(plant.powerFactors * 0.05);
            if (plant.superconductors) total += Math.floor(plant.powerFactors * 0.1);
            return total;
        };

        plant.modifiedMaxLoad = function () {
            if (!this.truck) return null;
            var total = this.maxLoad;
            if (plant.platinumCatalysts) total += Math.floor(plant.maxLoad * 0.05);
            if (plant.superconductors) total += Math.floor(plant.maxLoad * 0.1);
            return total;
        };

        plant.calculateTopSpeed = function (weight) {
            if (this.truck) return 200 * this.modifiedMaxLoad() / (this.modifiedMaxLoad() + weight);
            return 360 * this.totalPowerFactors() / (this.totalPowerFactors() + weight);
        };

        plant.ownDP = function () {
            var total = plant.dp;
            total += plant.improvedSuperchargerCapacitors;
            total += Math.ceil(plant.extraPowerCells * plant.dp * 0.1 - 0.0001);
            return total;
        };
        plant.totalDP = function () {
            var total = plant.ownDP();
            if (plant.componentArmor) total += plant.componentArmor.totalDP();
            total += plant.laserBatteries;
            return total;
        };

        plant.textDescription = function () {
            var text = plant.name + " power plant";
            if (plant.platinumCatalysts || plant.superconductors) {
                text += " w/";
                if (plant.platinumCatalysts) {
                    text += "PC";
                    if (plant.superconductors) {
                        text += " & SC";
                    }
                } else {
                    text += "SC";
                }
            }
            if (plant.highTorqueMotors) text += ", High-Torque Motors";
            if (plant.heavyDutyHighTorqueMotors) text += ", Heavy-Duty High-Torque Motors";
            if (plant.improvedSuperchargerCapacitors > 0) text += ", " + (plant.improvedSuperchargerCapacitors > 1 ? plant.improvedSuperchargerCapacitors + " " : "") + "ISC" + (plant.improvedSuperchargerCapacitors > 1 ? "s" : "");
            if (plant.extraPowerCells > 0) text += ", " + (plant.extraPowerCells > 1 ? plant.extraPowerCells + " " : "") + "Extra Power Cells";
            if (plant.fireRetardantInsulator) text += ", Fire-Retardant Insulator";
            if (plant.componentArmor) text += ", " + plant.componentArmor.textDescription() + " (Power Plant)";
            if (plant.fireExtinguisher) text += ", Fire Extinguisher";
            if (plant.improvedFireExtinguisher) text += ", Improved Fire Extinguisher";
            if (plant.laserBatteries > 0) text += ", " + (plant.laserBatteries > 1 ? plant.laserBatteries + " " : "") + "Laser Batter" + (plant.laserBatteries > 1 ? "ies" : "y");

            return text;
        };

        return plant;
    };

    CW.createGasEngine = function (type) {
        var engine;
        if (type === '10 cid') {
            engine = CW.create(CW.gasEngine.cid_10);
        } else if (type === '30 cid') {
            engine = CW.create(CW.gasEngine.cid_30);
        } else if (type === '50 cid') {
            engine = CW.create(CW.gasEngine.cid_50);
        } else if (type === '100 cid') {
            engine = CW.create(CW.gasEngine.cid_100);
        } else if (type === '150 cid') {
            engine = CW.create(CW.gasEngine.cid_150);
        } else if (type === '200 cid') {
            engine = CW.create(CW.gasEngine.cid_200);
        } else if (type === '250 cid') {
            engine = CW.create(CW.gasEngine.cid_250);
        } else if (type === '300 cid') {
            engine = CW.create(CW.gasEngine.cid_300);
        } else if (type === '350 cid') {
            engine = CW.create(CW.gasEngine.cid_350);
        } else if (type === '400 cid') {
            engine = CW.create(CW.gasEngine.cid_400);
        } else if (type === '450 cid') {
            engine = CW.create(CW.gasEngine.cid_450);
        } else if (type === '500 cid') {
            engine = CW.create(CW.gasEngine.cid_500);
        } else if (type === '700 cid') {
            engine = CW.create(CW.gasEngine.cid_700);
        } else if (type.truck) {
            engine = CW.create(type);
        }
        engine.carburetor = false;
        engine.multibarrelCarburetor = false;
        engine.tubularHeaders = false;
        engine.blueprinted = false;
        engine.turbocharger = false; // not with VP turbo
        engine.variablePitchTurbocharger = false; // not with turbo
        engine.supercharger = false; // not smaller than 150 cid
        engine.laserBatteries = 0;
        engine.nitrousOxide = 0;
        engine.fireExtinguisher = false;
        engine.improvedFireExtinguisher = false;
        engine.componentArmor = null;
        engine.electric = false;

        engine.changeType = function (type) {
            engine.name = type.name;
            engine.cost = type.cost;
            engine.weight = type.weight;
            engine.space = type.space;
            engine.dp = type.dp;
            engine.powerFactors = type.powerFactors;
            engine.maxLoad = type.maxLoad;
            engine.mpg = type.mpg;
        };

        engine.optionData = function (option, wheelCount) {
            if (option === "carburetor") return {
                cost: -Math.floor(engine.cost * 0.25 + 0.0001)
            };
            if (option === 'multibarrelCarburetor') return {
                cost: -Math.floor(engine.cost * 0.15 + 0.0001)
            };
            if (option === "tubularHeaders") return {
                cost: Math.floor(engine.cost * 0.2 + 0.0001)
            };
            if (option === 'blueprinted') return {
                cost: Math.floor(engine.cost * 0.5 + 0.0001)
            };
            if (option === 'turbocharger')
                if (this.truck) {
                    return {
                        cost: 2000,
                        weight: 50,
                        space: 1
                    };
                } else {
                    return {
                        cost: 1000 + Math.floor(engine.powerFactors * 0.25 + 0.0001),
                        weight: 0,
                        space: 0
                    };
                }
            if (option === 'variablePitchTurbocharger') return {
                cost: 2000 + Math.floor(engine.powerFactors * 0.25 + 0.0001)
            };
            if (option === 'supercharger') return {
                cost: 3000 + Math.floor(engine.powerFactors * 0.4 + 0.0001),
                weight: Math.floor(engine.weight * 0.2 + 0.0001),
                space: 1
            };
            if (option === 'laserBattery') return {
                cost: 500,
                weight: 100,
                space: 1
            };
            if (option === 'fireExtinguisher') return {
                cost: 300,
                weight: 150,
                space: 1
            };
            if (option === 'improvedFireExtinguisher') return {
                cost: 500,
                weight: 200,
                space: 1
            };
            if (option === 'nitrousOxide') return {
                cost: engine.nitrousOxide * 500,
                weight: engine.nitrousOxide * 20,
                space: engine.nitrousOxide
            };
            if (option === 'componentArmor') return {
                cost: engine.componentArmor.totalCost(),
                weight: engine.componentArmor.totalWeight(),
                space: engine.componentArmor.totalSpace()
            };
            return null;
        };

        engine.costPerTire = function () {
            return 0;
        };

        engine.totalCost = function (wheelCount) {
            var total = engine.cost;
            if (engine.carburetor) total -= Math.floor(engine.cost * 0.25 + 0.0001);
            if (engine.multibarrelCarburetor) total -= Math.floor(engine.cost * 0.15 + 0.0001);
            if (engine.tubularHeaders) total += Math.floor(engine.cost * 0.2 + 0.0001);
            if (engine.blueprinted) total += Math.floor(engine.cost * 0.5 + 0.0001);
            if (engine.turbocharger) total += this.truck ? 2000 : 1000 + Math.floor(engine.powerFactors * 0.25 + 0.0001);
            if (engine.variablePitchTurbocharger) total += 2000 + Math.floor(engine.powerFactors * 0.25 + 0.0001);
            if (engine.supercharger) total += 3000 + Math.floor(engine.powerFactors * 0.4 + 0.0001);
            total += engine.nitrousOxide * 500;
            total += engine.laserBatteries * 500;
            if (engine.fireExtinguisher) total += 300;
            if (engine.improvedFireExtinguisher) total += 500;
            if (engine.componentArmor) total += engine.componentArmor.totalCost();
            return total;
        };

        engine.engineOnlyCost = function () {
            var total = engine.cost;
            if (engine.carburetor) total -= Math.floor(engine.cost * 0.25 + 0.0001);
            if (engine.multibarrelCarburetor) total -= Math.floor(engine.cost * 0.15 + 0.0001);
            if (engine.tubularHeaders) total += Math.floor(engine.cost * 0.2 + 0.0001);
            if (engine.blueprinted) total += Math.floor(engine.cost * 0.5 + 0.0001);
            if (engine.turbocharger) total += this.truck ? 2000 : 1000 + Math.floor(engine.powerFactors * 0.25 + 0.0001);
            if (engine.variablePitchTurbocharger) total += 2000 + Math.floor(engine.powerFactors * 0.25 + 0.0001);
            if (engine.supercharger) total += 3000 + Math.floor(engine.powerFactors * 0.4 + 0.0001);
            total += engine.nitrousOxide * 500;
            return total;
        };

        engine.totalWeight = function () {
            var total = engine.weight;
            if (engine.truck && engine.turbocharger) total += 50;
            if (engine.supercharger) total += Math.floor(engine.weight * 0.2 + 0.0001);
            total += engine.nitrousOxide * 20;
            total += engine.laserBatteries * 100;
            if (engine.fireExtinguisher) total += 150;
            if (engine.improvedFireExtinguisher) total += 200;
            if (engine.componentArmor) total += engine.componentArmor.totalWeight();
            return total;
        };

        engine.unarmoredSpace = function () {
            var total = engine.space;
            if (engine.truck && engine.turbocharger) total += 1;
            if (engine.supercharger) total += 1;
            total += engine.nitrousOxide;
            total += engine.laserBatteries;
            if (engine.fireExtinguisher) total += 1;
            if (engine.improvedFireExtinguisher) total += 1;
            return total;
        };

        engine.totalSpace = function () {
            return engine.unarmoredSpace() + (engine.componentArmor ? engine.componentArmor.totalSpace() : 0);
        };

        engine.totalPowerFactors = function () {
            var total = engine.powerFactors;
            if (engine.carburetor) total -= Math.floor(engine.powerFactors * 0.15);
            if (engine.multibarrelCarburetor) total -= Math.floor(engine.powerFactors * 0.1);
            if (engine.tubularHeaders) total += Math.floor(engine.powerFactors * 0.05);
            if (engine.blueprinted) total += Math.floor(engine.powerFactors * 0.1);
            if (engine.turbocharger || engine.variablePitchTurbocharger) total += Math.floor(engine.powerFactors * 0.25);
            if (engine.supercharger) total += Math.floor(engine.powerFactors * 0.4);
            return total;
        };

        engine.modifiedMaxLoad = function () {
            if (!this.truck) return null;
            var total = this.maxLoad;
            if (engine.carburetor) total -= Math.floor(engine.maxLoad * 0.15);
            if (engine.tubularHeaders) total += Math.floor(engine.maxLoad * 0.05);
            if (engine.blueprinted) total += Math.floor(engine.maxLoad * 0.1);
            return total;
        };

        engine.calculateTopSpeed = function (weight) {
            if (this.truck) return 200 * this.modifiedMaxLoad() / (this.modifiedMaxLoad() + weight);
            return 240 * this.totalPowerFactors() / (this.totalPowerFactors() + weight);
        };

        engine.ownDP = function () {
            return engine.dp;
        };
        engine.totalDP = function () {
            return engine.ownDP() + engine.laserBatteries + (engine.componentArmor ? engine.componentArmor.totalDP() : 0);
        };

        engine.textDescription = function () {
            var buf = [];
            var first = true;
            if (engine.blueprinted) buf.push("Blueprinted ");
            buf.push(engine.name);
            buf.push(" engine");
            if (engine.carburetor || engine.multibarrelCarburetor || engine.turbocharger || engine.variablePitchTurbocharger
                || engine.supercharger || engine.nitrousOxide > 0 || engine.tubularHeaders || engine.componentArmor) {
                buf.push(" w/");
            }
            first = CW.writeAccessory(buf, engine.carburetor, "Carburetor", first);
            first = CW.writeAccessory(buf, engine.multibarrelCarburetor, "Multibarrel Carb", first);
            first = CW.writeAccessory(buf, engine.tubularHeaders, "Tubular Headers", first);
            first = CW.writeAccessory(buf, engine.turbocharger, "Turbocharger", first);
            first = CW.writeAccessory(buf, engine.variablePitchTurbocharger, "VP Turbocharger", first);
            first = CW.writeAccessory(buf, engine.supercharger, "Supercharger", first);
            if (engine.nitrousOxide > 0) {
                if (!first) buf.push(" and ");
                first = false;
                buf.push(engine.nitrousOxide + " tank");
                if (engine.nitrousOxide > 1) buf.push("s");
                buf.push(" of Nitrous Oxide");
            }
            if (engine.componentArmor) {
                if (!first) buf.push(", ");
                buf.push(engine.componentArmor.textDescription());
                if (!first) buf.push(" (Engine)");
            }
            if (engine.fireExtinguisher) buf.push(", Fire Extinguisher");
            if (engine.improvedFireExtinguisher) buf.push(", Improved Fire Extinguisher");
            if (engine.laserBatteries > 0) buf.push(", " + (engine.laserBatteries > 1 ? engine.laserBatteries + " " : "") + "Laser Batter" + (engine.laserBatteries > 1 ? "ies" : "y"));
            return buf.join('');
        };

        engine.totalMPG = function () {
            var total = engine.mpg;
            if (engine.carburetor) total -= 2;
            if (engine.multibarrelCarburetor) total -= 1;
            if (engine.supercharger) total -= 1;
            return total;
        };

        return engine;
    };

    CW.createGasTank = function (type) {
        var tank;
        if (type === 'Economy') {
            tank = CW.create(CW.gasTank.economy);
        } else if (type === 'Heavy-Duty') {
            tank = CW.create(CW.gasTank.heavy_duty);
        } else if (type === 'Racing') {
            tank = CW.create(CW.gasTank.racing);
        } else if (type === 'Duelling') {
            tank = CW.create(CW.gasTank.duelling);
        }
        tank.capacity = 5;
        tank.gasCostPerGallon = 40;
        tank.gasWeightPerGallon = 6;
        tank.fireRetardantInsulator = false;
        tank.componentArmor = null;

        tank.totalCost = function () {
            return tank.capacity * (tank.gasCostPerGallon + tank.costPerGallon) + (tank.fireRetardantInsulator ? 150 * Math.max(1, tank.unarmoredSpace()) : 0)
                + (tank.componentArmor ? tank.componentArmor.totalCost() : 0);
        };

        tank.totalWeight = function () {
            return tank.capacity * (tank.gasWeightPerGallon + tank.weightPerGallon) + (tank.fireRetardantInsulator ? 25 * Math.max(1, tank.unarmoredSpace()) : 0)
                + (tank.componentArmor ? tank.componentArmor.totalWeight() : 0);
        };

        tank.ownDP = function () {
            return tank.dp;
        };
        tank.totalDP = function () {
            return tank.ownDP() + (tank.componentArmor ? tank.componentArmor.totalDP() : 0);
        };

        tank.unarmoredSpace = function () {
            return Math.floor((tank.capacity + 4) / 10 + 0.0001);
        };

        tank.totalSpace = function () {
            return tank.unarmoredSpace() + (tank.componentArmor ? tank.componentArmor.totalSpace() : 0) + (tank.fireRetardantInsulator ? 1 : 0);
        };

        tank.changeType = function (type) {
            tank.name = type.name;
            tank.costPerGallon = type.costPerGallon;
            tank.weightPerGallon = type.weightPerGallon;
            tank.dp = type.dp;
        };

        tank.shortDescription = function () {
            return tank.capacity + "-gal " + tank.name + " Tank";
        };

        tank.textDescription = function () {
            var text = tank.capacity + "-gal " + tank.name + " Tank";
            if (tank.fireRetardantInsulator) text += " w/Fire-Retardant Insulator";
            if (tank.componentArmor) text += " w/" + tank.componentArmor.textDescription();
            return text;
        };

        return tank;
    };

    CW.createAccessory = function (type) {
        var item = CW.create(type);
        item.type = "Accessory";
        item.count = 1;

        item.totalCost = function () {
            if (item.incrementalCost) {
                return item.cost + (item.count - 1) * item.incrementalCost;
            }
            return item.count * item.cost;
        };
        item.totalWeight = function () {
            return item.count * item.weight;
        };
        item.totalSpace = function () {
            return item.count * item.space;
        };
        item.singleItemDP = function () {
            return item.dp;
        };
        item.ownDP = function () {
            return item.count * item.singleItemDP();
        };
        item.totalDP = function () {
            return this.ownDP();
        };
        item.textDescription = function () {
            return (item.count > 1 ? item.count + "x " : "") + item.name;
        };

        return item;
    };

    CW.createPersonalGear = function (type) {
        var item = CW.create(type);
        item.type = "Gear";
        item.count = 1;

        item.totalCost = function () {
            return item.count * item.cost;
        };
        item.totalWeight = function () {
            return item.count * item.weight;
        };
        item.totalGE = function () {
            return item.count * item.ge;
        };
        item.textDescription = function () {
            return (item.count > 1 ? item.count + "x " : "") + item.name;
        };

        return item;
    };

    CW.createAmmo = function (weapon, ammoType, shots) {
        var ammo = CW.create(ammoType);
        ammo.shots = shots;
        ammo.laserGuided = false;     // Rockets
        ammo.harm = false;            // Rockets
        ammo.tracer = false;          // Machine guns
        ammo.proximityFused = false;  // Minedroppers
        ammo.radioDetonated = false;  // Minedroppers
        ammo.programmable = false;    // Minedroppers (pyramid)
        ammo.impactFused = false;     // Launched Grenades
        ammo.highVelocity = false;    // Grenades (UACFH/AGL -- MILITARY TECH)

        ammo.duplicate = function (other) { // Assuming it started with the right weapon and ammo
            this.shots = other.shots;
            this.laserGuided = other.laserGuided;
            this.harm = other.harm;
            this.tracer = other.tracer;
            this.proximityFused = other.proximityFused;
            this.radioDetonated = other.radioDetonated;
            this.programmable = other.programmable;
            this.impactFused = other.impactFused;
            this.highVelocity = other.highVelocity;
        };

        ammo.compareTo = function (other) {
            if (!other.hasOwnProperty('shots')) return 1;
            if (this.abbv !== other.abbv) return this.abbv > other.abbv ? 1 : -1;
            if (this.shots !== other.shots) return this.shots - other.shots;
            if (this.laserGuided !== other.laserGuided) return this.laserGuided ? 1 : -1;
            if (this.harm !== other.harm) return this.harm ? 1 : -1;
            if (this.tracer !== other.tracer) return this.tracer ? 1 : -1;
            if (this.proximityFused !== other.proximityFused) return this.proximityFused ? 1 : -1;
            if (this.radioDetonated !== other.radioDetonated) return this.radioDetonated ? 1 : -1;
            if (this.programmable !== other.programmable) return this.programmable ? 1 : -1;
            if (this.impactFused !== other.impactFused) return this.impactFused ? 1 : -1;
            if (this.highVelocity !== other.highVelocity) return this.highVelocity ? 1 : -1;
            return 0;
        };

        ammo.modifiedCost = function () {
            var cost = ammo.costPerShot;
            if (ammo.laserGuided) cost += 200;
            if (ammo.harm) cost += 100;
            // Tracer: no change
            if (ammo.proximityFused) cost += 100;
            if (ammo.radioDetonated) cost *= 2;
            if (ammo.impactFused) cost += 50;
            if (ammo.programmable) cost *= 2;
            if (ammo.highVelocity) cost += 30;
            return cost;
        };

        ammo.modifiedWeight = function () {
            return ammo.highVelocity ? 8 : ammo.weightPerShot;
        };

        ammo.modifiedDamage = function () {
            if (ammo.tracer) {
                var old, mod = parseInt(ammo.damage.substring(0, 1));
                if (ammo.damage.length === 2) return ammo.damage + "-" + mod;
                if (ammo.damage.substring(2, 3) === '+') {
                    old = parseInt(ammo.damage.substring(3, 4));
                    if (old === mod) return ammo.damage.substring(0, 2);
                    else if (old > mod) return ammo.damage.substring(0, 3) + (old - mod);
                    return ammo.damage.substring(0, 2) + "-" + (mod - old);
                } else {
                    old = parseInt(ammo.damage.substring(3, 4));
                    return ammo.damage.substring(0, 3) + (old + mod);
                }
            }
            return ammo.damage;
        };

        ammo.textDescription = function (multipleTypes, hideShots) {
            //        if(weapon.totalCapacity() == 1 && !this.laserGuided && !this.harm) return this.abbv;
            var abbv = this.abbv;
            if(this.shots === 1 && / Grenades$/.test(abbv)) abbv = abbv.substr(0, abbv.length-1);
            var text = (hideShots ? '' : this.shots + (this.nameOnly ? "" : " shot" + (this.shots > 1 ? "s" : ""))) +
                (this.laserGuided ? " Laser-Guided" : "") +
                (this.harm ? " HARM" : "") +
                (this.tracer ? " Tracer" : "") +
                (this.proximityFused ? " Proximity Fused" : "") +
                (this.radioDetonated ? " Radio and Contact Detonated" : "") +
                (this.programmable ? " Programmable" : "") +
                (this.impactFused ? " Impact Fused" : "") +
                (this.highVelocity ? " High Velocity" : "") +
                (this.name === 'Normal' && !multipleTypes ? "" : " " + abbv);
            return text.length > 0 && text.substr(0, 1) === ' ' ? text.substr(1) : text;
        };

        ammo.modifiedName = function (multipleTypes, showShots) {
            var abbv = this.abbv;
            if(/ Grenades$/.test(abbv)) abbv = abbv.substr(0, abbv.length-9);
            var text = (showShots ? this.shots + (this.nameOnly ? "" : " shot" + (this.shots > 1 ? "s" : "")) : '') +
                (this.laserGuided ? " L/G" : "") +
                (this.harm ? " HARM" : "") +
                (this.tracer ? " Tracer" : "") +
                (this.proximityFused ? " Prox. Fused" : "") +
                (this.radioDetonated ? " R&C det." : "") +
                (this.programmable ? " Prog." : "") +
                (this.impactFused ? " Imp. Fused" : "") +
                (this.highVelocity ? " H/V" : "") +
                ((this.name === 'Normal' || this.name === 'Spikes' || this.name === 'Mines') && !multipleTypes ? "" : " " + abbv);
            if(/ Mines$/.test(text) && abbv !== "Mines" && text.length > 25) text = text.substr(0, text.length-6);
            return text.length > 0 && text.substr(0, 1) === ' ' ? text.substr(1) : text;
        };

        ammo.isModified = function () {
            return ammo.laserGuided || ammo.harm || ammo.tracer || ammo.proximityFused || ammo.radioDetonated
                || ammo.impactFused || ammo.programmable || ammo.highVelocity;
        };

        return ammo;
    };

    CW.createHandWeapon = function (abbv) {
        var source = CW.handWeapons[abbv];
        if (!source) source = CW.handGrenades[abbv];
        var weapon = CW.create(source);
        weapon.type = 'Hand Weapon';
        weapon.ammo = [];
        if (weapon.shots > 0) {
            weapon.ammo.push(CW.createAmmo(weapon, CW.handWeapons[abbv + "_ammo"][0], weapon.shots));
        }
        weapon.count = 1;
        weapon.extendedClips = 0;
        weapon.extraClips = 0;
        weapon.foldingStock = false;
        weapon.laserScope = false;
        weapon.impactFused = false;
        weapon.powerPack = false;

        weapon.compareTo = function (other) { // ignores count
            if (!other.type || other.type !== this.type) return 1;
            if(this.abbv.indexOf('Grenade') > -1 && other.abbv.indexOf('Grenade') < 0) return 1;
            if(this.abbv.indexOf('Grenade') < 0 && other.abbv.indexOf('Grenade') > -1) return -1;
            if (this.abbv > other.abbv) return 1;
            if (other.abbv > this.abbv) return -1;
            if (this.ammo.length !== other.ammo.length) return this.ammo.length - other.ammo.length;
            for (var i = 0; i < this.ammo.length; i++) {
                var test = this.ammo[i].compareTo(other.ammo[i]);
                if (test !== 0) return test;
            }
            if (this.extendedClips !== other.extendedClips) return this.extendedClips - other.extendedClips;
            if (this.extraClips !== other.extraClips) return this.extraClips - other.extraClips;
            if (this.foldingStock !== other.foldingStock) return this.foldingStock ? 1 : -1;
            if (this.laserScope !== other.laserScope) return this.laserScope ? 1 : -1;
            if (this.impactFused !== other.impactFused) return this.impactFused ? 1 : -1;
            if (this.powerPack !== other.powerPack) return this.powerPack ? 1 : -1;
            return 0;
        };

        weapon.modifiedToHit = function () {
            if (weapon.laserScope) return (weapon.toHit - 1) + "(LTS)";
            return weapon.toHit + "";
        };

        weapon.isPistol = function () {
            return /Pistol/.test(this.name);
        };

        weapon.isGrenade = function () {
            return "Grenades" === this.category;
        };

        weapon.isGrenadeLauncher = function () {
            return "GL" === this.abbv || "URGL" === this.abbv;
        };

        weapon.totalGE = function () {
            var total = weapon.ge;
            if (weapon.abbv === 'SMG' || weapon.abbv === 'GL') {
                total += weapon.extraClips;
                total += weapon.extendedClips * 2;
            } else {
                total += weapon.extraClips / 2;
                total += weapon.extendedClips;
            }
            if (weapon.foldingStock) {
                if (weapon.isPistol()) total += 1;
                else total -= 1;
            }
            if (weapon.powerPack) total += 3;
            return total * this.count;
        };

        weapon.totalCost = function () {
            var total = weapon.cost, ammoCost = 0;
            for (var i = 0; i < weapon.ammo.length; i++) {
                ammoCost += weapon.ammo[i].modifiedCost() * weapon.ammo[i].shots;
            }
            total += Math.round(ammoCost);
            total += weapon.extendedClips * 80;
            total += weapon.extraClips * 50;
            if (weapon.foldingStock) total += 10;
            if (weapon.laserScope) total += 500;
            if (weapon.impactFused) total += 50;
            if (weapon.powerPack) total += 1000;
            return total * this.count;
        };

        weapon.totalWeight = function () {
            var total = weapon.weight, ammoWeight = 0;
            for (var i = 0; i < weapon.ammo.length; i++) {
                ammoWeight += weapon.ammo[i].modifiedWeight() * weapon.ammo[i].shots;
            }
            total += Math.round(ammoWeight);
            total += Math.round(weapon.extraClips * weapon.weight * 0.2);
            total += Math.round(weapon.extendedClips * weapon.weight * 0.3);
            if (weapon.foldingStock) {
                if (weapon.isPistol()) total += 3;
                else total -= 3;
            }
            if (weapon.powerPack) total += 30;
            return total * this.count;
        };

        weapon.totalCapacity = function () {
            var total = weapon.shots;
            total += weapon.extraClips * weapon.shots;
            total += weapon.extendedClips * weapon.shots * 2;
            return total;
        };

        weapon.remainingCapacity = function () {
            return Math.max(0, weapon.totalCapacity() - weapon.ammoTotal());
        };

        weapon.ammoTotal = function () {
            var total = 0;
            for (var i = 0; i < weapon.ammo.length; i++) {
                total += weapon.ammo[i].shots;
            }
            return total;
        };

        weapon.textDescription = function (plural) {
            var text = "", i;
            if(this.count > 1 && !plural) text = this.count+" ";
            if (weapon.impactFused) text += "Impact-Fused ";
            text += weapon.name;
            if(this.count > 1 || plural) text += "s";
            text += " w/";
            if (weapon.extraClips > 0) {
                if (weapon.extraClips > 1) {
                    text += weapon.extraClips + " extra clips and ";
                } else {
                    text += "extra clip and ";
                }
            }
            if (weapon.extendedClips > 0) {
                if (weapon.extendedClips > 1) {
                    text += weapon.extendedClips + " extended clips and ";
                } else {
                    text += "extended clip and ";
                }
            }
            if (weapon.ammo.length === 0) {
                if (weapon.shots > 0) {
                    text += "no ammo and ";
                }
            } else if (weapon.ammo.length === 1 && weapon.ammo[0].name === 'Normal' && weapon.ammo[0].shots === weapon.totalCapacity() && !weapon.ammo[0].isModified()) {
                // Full load of standard ammo -- no need to mention anything at all
            } else {
                for (i = 0; i < weapon.ammo.length; i++) {
                    text += weapon.ammo[i].textDescription(weapon.ammo.length > 1);
                    text += " and ";
                }
            }
            if (weapon.foldingStock) text += "folding stock and ";
            if (weapon.laserScope) text += "laser targeting scope and ";
            if (weapon.powerPack) text += "power backpack and ";
            if (/ each w\/$/.test(text)) text = text.substr(0, text.length - 8);
            if (/ w\/$/.test(text)) text = text.substr(0, text.length - 3);
            else if (/, $/.test(text)) text = text.substr(0, text.length - 2);
            else if (/ and $/.test(text)) text = text.substr(0, text.length - 5);
            return text;
        };

        return weapon;
    };

    CW.createWeapon = function (abbv, location, turret) {
        var weapon = CW.create(CW.weapons[abbv]);
        weapon.type = 'Weapon';
        weapon.location = location;
        weapon.showLocation = turret ? false : true;
        weapon.ammo = [];
        if (weapon.shots > 0) {
            weapon.ammo.push(CW.createAmmo(weapon, CW.weapons[abbv + "_ammo"][0], weapon.shots));
        }
        weapon.count = 1;
        weapon.fake = false;
        weapon.concealment = false;
        weapon.blowThroughConcealment = false;
        weapon.fireRetardantInsulator = false;
        weapon.extraMagazines = 0;
        weapon.dualWeaponMagazines = 0;
        weapon.rocketMagazine = 0;
        weapon.rotaryMagazine = false;
        weapon.bumperTrigger = false;
        weapon.magazineSwitch = false;
        weapon.componentArmor = null;
        weapon.laserGuidanceLink = abbv === 'TL';
        weapon.infrared = false;
        weapon.blueGreen = false;
        weapon.pulse = false;

        weapon.setDisplayLocation = function (location) {
            if (/^[s|S]idecar/.test(location)) this.displayLocation = "Sidecar " + location.substring(7);
            else if (turret) this.displayLocation = turret.name === 'Rocket Platform' ? 'on Rkt Platform' : 'in ' + turret.name;
            else if (/^Carrier/.test(location)) this.displayLocation = location.substr(7);
            else if (location === "TopBack" || location === "TopFront") this.displayLocation = location.substring(0, 3) + " " + location.substring(3);
            else if (location === "UnderbodyBack" || location === "UnderbodyFront") this.displayLocation = location.substring(0, 9) + " " + location.substring(9);
            else if (location === 'BackLeft' || location === 'BackRight' || location === "LeftBack" || location === "LeftFront") this.displayLocation = location.substring(0, 4) + " " + location.substring(4);
            else if (location === 'FrontLeft' || location === 'FrontRight' || location === "RightFront" || location === "RightBack") this.displayLocation = location.substring(0, 5) + " " + location.substring(5);
            else this.displayLocation = location;
        };
        weapon.setDisplayLocation(weapon.location);

        weapon.compareTo = function (other, noLocation, noCount) {
            if (!other.type || other.type !== 'Weapon') return 1;
            if (this.abbv > other.abbv) return 1;
            else if (other.abbv > this.abbv) return -1;
            if (!noLocation) {
                if (this.displayLocation > other.displayLocation) return 1;
                else if (this.displayLocation < other.displayLocation) return -1;
            }
            if(other.wraps) other = other.wraps;
            if (!noCount && this.count !== other.count) return this.count - other.count;
            if (this.fake !== other.fake) return this.fake ? -1 : 1;
            if (this.ammo.length !== other.ammo.length) return this.ammo.length - other.ammo.length;
            for (var i = 0; i < this.ammo.length; i++) {
                var test = this.ammo[i].compareTo(other.ammo[i]);
                if (test !== 0) return test;
            }
            if (this.concealment !== other.concealment) return this.concealment ? 1 : -1;
            if (this.blowThroughConcealment !== other.blowThroughConcealment) return this.blowThroughConcealment ? 1 : -1;
            if (this.fireRetardantInsulator !== other.fireRetardantInsulator) return this.fireRetardantInsulator ? 1 : -1;
            if (this.extraMagazines !== other.extraMagazines) return this.extraMagazines - other.extraMagazines;
            if (this.dualWeaponMagazines !== other.dualWeaponMagazines) return this.dualWeaponMagazines - other.dualWeaponMagazines;
            if (this.rocketMagazine !== other.rocketMagazine) return this.rocketMagazine - other.rocketMagazine;
            if (this.rotaryMagazine !== other.rotaryMagazine) return this.rotaryMagazine - other.rotaryMagazine;
            if (this.bumperTrigger !== other.bumperTrigger) return this.bumperTrigger ? 1 : -1;
            if (this.magazineSwitch !== other.magazineSwitch) return this.magazineSwitch ? 1 : -1;
            if (this.componentArmor && !other.componentArmor) return 1;
            else if (other.componentArmor && !this.componentArmor) return -1;
            else if (this.componentArmor) return this.componentArmor.compareTo(other.componentArmor); // TODO
            if (this.laserGuidanceLink !== other.laserGuidanceLink) return this.laserGuidanceLink ? 1 : -1;
            if (this.infrared !== other.infrared) return this.infrared ? 1 : -1;
            if (this.blueGreen !== other.blueGreen) return this.blueGreen ? 1 : -1;
            if (this.pulse !== other.pulse) return this.pulse ? 1 : -1;
            return 0;
        };

        weapon.duplicate = function (other) { // Assuming it started as the same weapon and has the correct location and etc.
            this.count = other.count;
            this.fake = other.fake;
            this.concealment = other.concealment;
            this.blowThroughConcealment = other.blowThroughConcealment;
            this.fireRetardantInsulator = other.fireRetardantInsulator;
            this.extraMagazines = other.extraMagazines;
            this.dualWeaponMagazines = other.dualWeaponMagazines;
            this.rocketMagazine = other.rocketMagazine;
            this.rotaryMagazine = other.rotaryMagazine;
            this.bumperTrigger = other.bumperTrigger;
            this.magazineSwitch = other.magazineSwitch;
            this.laserGuidanceLink = other.laserGuidanceLink;
            this.infrared = other.infrared;
            this.blueGreen = other.blueGreen;
            this.pulse = other.pulse;
            if (other.componentArmor) {
                if (!this.componentArmor) this.componentArmor = CW.createComponentArmor(this, other.componentArmor.vehicleType);
                this.componentArmor.plasticType = other.componentArmor.plasticType;
                this.componentArmor.plasticPoints = other.componentArmor.plasticPoints;
                this.componentArmor.metalType = other.componentArmor.metalType;
                this.componentArmor.metalPoints = other.componentArmor.metalPoints;
            } else this.componentArmor = null;
            this.ammo = [];
            for (var i = 0; i < other.ammo.length; i++) {
                this.ammo.push(CW.create(other.ammo[i]));
            }
        };

        weapon.setFake = function (fake, car) {
            var turret;
            weapon.fake = fake;
            if (fake) {
                weapon.ammo = [];
                weapon.fireRetardantInsulator = false;
                weapon.extraMagazines = 0;
                weapon.rocketMagazine = 0;
                weapon.dualWeaponMagazines = 0;
                weapon.rotaryMagazine = false;
                weapon.bumperTrigger = false;
                weapon.magazineSwitch = false;
                weapon.componentArmor = null;
                weapon.laserGuidanceLink = false;
                weapon.blueGreen = false;
                weapon.infrared = false;
                weapon.pulse = false;
                if (weapon.count > 1) {
                    if(weapon.location === 'sideTurret' || weapon.location === 'sideBackTurret') {
                        turret = car[weapon.location];
                        car.removeWeaponLink(turret.linkableWeapon(weapon, true));
                        car.removeWeaponLink(turret.linkableWeapon(weapon, false));
                    } else car.removeWeaponLink(weapon);
                }
            } else if (weapon.shots > 0) {
                var ammo = CW.createAmmo(weapon, CW.weapons[weapon.abbv + "_ammo"][0], weapon.shots);
                weapon.ammo.push(ammo);
                if (weapon.count > 1) {
                    if(weapon.location === 'sideTurret' || weapon.location === 'sideBackTurret') {
                        turret = car[weapon.location];
                        car.createWeaponLink(turret.linkableWeapon(weapon, true));
                        car.createWeaponLink(turret.linkableWeapon(weapon, false));
                    } else car.createWeaponLink(weapon);
                }
            }
        };

        weapon.walkaroundCategory = function () {
            if (/Discharger/.test(this.category)) return "Discharger";
            else if (/Rocket/.test(this.category)) return "Rocket";
            else if (/Gasses$/.test(this.category)) return this.category.substr(0, this.category.length - 3);
            return this.category.substr(0, this.category.length - 1);
        };

        weapon.modifiedDamage = function () {
            if (weapon.pulse) {
                var old, mod = parseInt(weapon.damage.substring(0, 1));
                if (weapon.damage.length === 2) return weapon.damage + "+" + mod;
                old = parseInt(weapon.damage.substring(3, 4));
                return weapon.damage.substring(0, 3) + (old + mod);
            }
            return weapon.damage;
        };

        weapon.totalCost = function () {
            var total = weapon.cost, ammoCost = 0;
            // Bumper Trigger handled by the car body (one per side)
            if (weapon.fake) {
                if (this.isDischarger()) return 5;
                total = 100;
                if (weapon.blowThroughConcealment) total += 100;
                if (weapon.concealment) total += 250;
                return total * weapon.count;
            }
            if (weapon.pulse) total += Math.ceil(weapon.cost * 0.5 - 0.0001);
            if (weapon.blueGreen) total += Math.ceil(weapon.cost * 0.25 - 0.0001);
            if (weapon.infrared) total += weapon.cost;
            if (weapon.laserGuidanceLink) total += 500;
            if (weapon.concealment) total += 250 * weapon.spaceForConcealment();
            if (weapon.blowThroughConcealment) total += 100;
            total += weapon.extraMagazines * 50;
            total += weapon.dualWeaponMagazines * 150;
            total += weapon.rocketMagazine * 50;
            if (weapon.rotaryMagazine) total += 500;
            if (weapon.magazineSwitch) total += 250;
            if (weapon.fireRetardantInsulator) total += 150 * (Math.max(1, weapon.unarmoredSpace() - 1));
            for (var i = 0; i < weapon.ammo.length; i++) {
                ammoCost += Math.ceil(weapon.ammo[i].modifiedCost() * weapon.ammo[i].shots - 0.0001);
            }
            total += Math.round(ammoCost);
            total *= weapon.count;
            if (weapon.componentArmor) total += weapon.componentArmor.totalCost();
            return total;
        };

        weapon.totalWeight = function () {
            var total = weapon.weight, ammoWeight = 0;
            if (weapon.fake) {
                if (this.isDischarger()) return 5;
                total = 20;
                if (weapon.concealment) total += 50;
                if (weapon.blowThroughConcealment) total += 10;
                return total * weapon.count;
            }
            if (weapon.concealment) total += 50 * weapon.spaceForConcealment();
            if (weapon.blowThroughConcealment) total += 10;
            total += weapon.extraMagazines * 15;
            total += weapon.dualWeaponMagazines * 50;
            total += weapon.rocketMagazine * 15;
            if (weapon.rotaryMagazine) total += 10;
            if (weapon.fireRetardantInsulator) total += 25 * (Math.max(1, weapon.unarmoredSpace() - 1));
            for (var i = 0; i < weapon.ammo.length; i++) {
                ammoWeight += Math.ceil(weapon.ammo[i].modifiedWeight() * weapon.ammo[i].shots - 0.0001);
            }
            total += Math.round(ammoWeight);
            total *= weapon.count;
            if (weapon.componentArmor) total += weapon.componentArmor.totalWeight();
            return total;
        };

        weapon.singleWeaponSpaceInsideTurret = function () {
            var total = weapon.space;
            if (weapon.fireRetardantInsulator) ++total;
            if (weapon.concealment && weapon.spaceForConcealment() > 2) ++total;
            return total;
        };

        weapon.spaceInsideTurret = function () {  // includes CA
            var total = weapon.count * weapon.singleWeaponSpaceInsideTurret();
            if (weapon.componentArmor) total += weapon.componentArmor.totalSpace();
            return total;
        };

        weapon.spaceOutsideTurret = function () {
            return weapon.count * (weapon.extraMagazines + weapon.dualWeaponMagazines + weapon.rocketMagazine);
        };

        weapon.spaceForConcealment = function () {
            if (weapon.fake) return 1;
            var total = weapon.space;
            total += weapon.extraMagazines;
            total += weapon.dualWeaponMagazines;
            total += weapon.rocketMagazine;
            if (weapon.fireRetardantInsulator) total += 1;
            if (weapon.componentArmor && weapon.count === 1) total += weapon.componentArmor.totalSpace();
            total = Math.ceil(total - 0.0001); // Round up
            return Math.max(1, total);
        };

        weapon.singleWeaponSpace = function () {
            if (weapon.fake) return 0;
            var total = weapon.space;
            total += weapon.extraMagazines;
            total += weapon.dualWeaponMagazines;
            total += weapon.rocketMagazine;
            if (weapon.fireRetardantInsulator) total += 1;
            if (weapon.concealment && weapon.spaceForConcealment() > 2) total += 1; // concealment calculation includes FRI, component armor, extra mag
            return total;
        };

        weapon.unarmoredSpace = function () {
            return weapon.count * weapon.singleWeaponSpace();
        };

        weapon.totalSpace = function () {
            return weapon.unarmoredSpace() + (weapon.componentArmor ? weapon.componentArmor.totalSpace() : 0);
        };
        weapon.roundedTotalSpace = function () {
            var total = this.totalSpace();
            if (total !== Math.floor(total + 0.0001)) return Math.round(total * 100) / 100;
            return total;
        };

        weapon.ownDP = function () {
            if (weapon.fake) return 0;
            // One-shot rocket with no shots has no DP
            if (weapon.isRocket() && weapon.shots === 1 && weapon.ammo.length === 0) return 0;
            // Rockets in rocket magazines have their normal DP
            if (weapon.rocketMagazine > 0) {
                return weapon.dp * weapon.ammoTotal();
            }
            return weapon.dp + weapon.extraMagazines;
        };
        weapon.totalDP = function () { // Includes CA DP if there's only one weapon and it has CA
            if (weapon.fake) return 0;
            return weapon.ownDP() + (weapon.count === 1 && weapon.componentArmor ? weapon.componentArmor.totalDP() : 0);
        };

        weapon.isDischarger = function () {
            return /Discharger/.test(weapon.category);
        };

        weapon.isLaser = function () {
            return weapon.category === 'Lasers';
        };

        weapon.isFlamethrower = function () {
            return weapon.category === 'Flamethrowers';
        };

        weapon.isLargeBore = function() {
            return weapon.category === 'Large Bore Projectile Weapons';
        };

        weapon.isSmallBore = function() {
            return weapon.category === 'Small Bore Projectile Weapons';
        };

        weapon.isRocket = function () {
            return /Rockets/.test(weapon.category);
        };

        weapon.isSingleShotRocket = function () {
            return weapon.shots === 1 && weapon.space <= 1 && weapon.isRocket();
        };

        weapon.isMinedropper = function () {
            return /Minedropper/.test(weapon.name);
        };

        weapon.isMachineGun = function () {
            return /MG/.test(weapon.abbv) || 'AC' === weapon.abbv; //TODO: GC?!?
        };

        weapon.isGrenadeLauncher = function () {
            return /GL/.test(weapon.abbv);
        };

        weapon.isDropped = function () {
            return /Dropped/.test(this.category);
        };

        weapon.magazineCapacity = function () {
            if (weapon.space > 0 && weapon.space < 1 && weapon.shots === 1) { // Light and Mini rockets, but not dischargers
                return Math.round(1 / weapon.space);
            } else {
                return weapon.shots;
            }
        };

        weapon.hasMagazines = function () {
            return weapon.extraMagazines > 0 || weapon.rocketMagazine > 0 || weapon.dualWeaponMagazines > 0;
        };

        weapon.removeMagazine = function () {
            if (weapon.extraMagazines > 0) weapon.extraMagazines -= 1;
            else if (weapon.rocketMagazine > 0) weapon.rocketMagazine -= 1;
            else if (weapon.dualWeaponMagazines > 0) weapon.dualWeaponMagazines -= 1;
        };

        weapon.totalCapacity = function () {
            if (weapon.fake) return 0;
            var total = weapon.shots;
            var increment = weapon.magazineCapacity();
            total += weapon.extraMagazines * increment;
            total += weapon.dualWeaponMagazines * increment;
            total += weapon.rocketMagazine * increment;
            return total;
        };

        weapon.remainingCapacity = function () {
            return Math.max(0, weapon.totalCapacity() - weapon.ammoTotal());
        };

        weapon.ammoTotal = function () {
            if (weapon.fake) return 0;
            var total = 0;
            for (var i = 0; i < weapon.ammo.length; i++) {
                total += weapon.ammo[i].shots;
            }
            return total;
        };

        weapon.shortDescription = function (forcePlural) {
            return (this.count > 1 ? this.count + "x " : '') + (this.abbv.length === 1 ? this.name : this.abbv) + (forcePlural || this.count > 1 ? 's' : '') + " " + this.displayLocation;
        };

        weapon.textDescription = function (plural, locationOverride, linked) {
            if (weapon.fake) return (weapon.count > 1 ? weapon.count + "x " : "") + "Fake " + weapon.name + (typeof locationOverride === 'string' ? locationOverride : weapon.showLocation ? " " + weapon.displayLocation : "");
            var text = "", i;
            if (weapon.concealment) text += "Concealed ";
            if (weapon.blowThroughConcealment) text += "Blow-through Concealed ";
            if (weapon.bumperTrigger) text += "Bumper-Triggered ";
            if (weapon.infrared) text += "IR ";
            else if (weapon.blueGreen) text += "Bluegreen ";
            if (weapon.pulse) text += "Pulse ";

            if (weapon.isSingleShotRocket()) {
                if (weapon.ammo.length > 0) text += weapon.ammo[0].textDescription(false, true);
                if (text.length > 0) text += ' ';
                text += weapon.name + (weapon.count > 1 || plural ? 's' : '');
                text += typeof locationOverride === 'string' ? ' ' + locationOverride : this.showLocation ?
                    ' ' + (/Sidecar /.test(weapon.displayLocation) ? weapon.displayLocation.substring(8) : weapon.displayLocation) : '';
                if (weapon.count > 1 || plural) text += " each";
                text += " w/";
                if (weapon.totalCapacity() > 1) {
                    var first = true;
                    if (weapon.ammo.length > 0 && weapon.ammo[0].shots > 1) {
                        text += (weapon.ammo[0].shots - 1) + " shot" + (weapon.ammo[0].shots > 2 ? "s " : " ") + weapon.ammo[0].textDescription(weapon.ammo.length > 1, true);
                        first = false;
                    }
                    for (i = 1; i < weapon.ammo.length; i++) {
                        if (!first) text += " and ";
                        text += weapon.ammo[i].textDescription(first ? i < weapon.ammo.length - 1 || (weapon.ammo[0].name !== 'Normal' || weapon.ammo[0].isModified()) : true, false);
                        first = false;
                    }
                    if (weapon.rocketMagazine > 0 || weapon.extraMagazines > 0) { // should always be true
                        text += " in " + (weapon.rotaryMagazine ? "rotary " : '') + "rocket magazine";
                        if (weapon.magazineSwitch) text += " with magazine switch";
                        text += " and ";
                    }
                } else if (weapon.rotaryMagazine) text += "rotary magazine and ";
            } else {
                if (weapon.totalCapacity() !== 1) {
                    text += weapon.name;
                    if (weapon.count > 1 || plural) text += "s";
                    if (typeof locationOverride === 'string') text += " " + locationOverride;
                    else if (weapon.showLocation) text += " " + (/Sidecar /.test(weapon.displayLocation) ? weapon.displayLocation.substring(8) : weapon.displayLocation);
                    if (weapon.count > 1 || plural) text += " each";
                    text += " w/";
                    if (weapon.rotaryMagazine) text += "rotary magazine and ";
                    if (weapon.extraMagazines > 0) {
                        if (weapon.extraMagazines > 1) {
                            text += weapon.extraMagazines + " extra magazines and ";
                        } else {
                            text += "extra magazine and ";
                        }
                    }
                    if (weapon.dualWeaponMagazines > 0) {
                        if (weapon.dualWeaponMagazines > 1) {
                            text += weapon.dualWeaponMagazines + " dual-weapon magazines and ";
                        } else {
                            text += "dual-weapon magazine and ";
                        }
                    }
                    if (weapon.rocketMagazine > 0) {
                        text += weapon.rocketMagazine + "-space rocket magazine and ";
                    }
                    if (weapon.magazineSwitch) text += "magazine switch and ";
                    if (weapon.ammo.length === 0) {
                        if (weapon.shots > 0) {
                            text += "no ammo and ";
                        }
                    } else if (weapon.ammo.length === 1 && weapon.ammo[0].name === 'Normal' && weapon.ammo[0].shots === weapon.shots
                        && weapon.shots === weapon.totalCapacity() && !weapon.ammo[0].isModified()) {
                        // Standard load of standard ammo -- no need to mention anything at all
                    } else {
                        for (i = 0; i < weapon.ammo.length; i++) {
                            text += weapon.ammo[i].textDescription(weapon.ammo.length > 1, false);
                            text += " and ";
                        }
                    }
                } else {
                    if (weapon.ammo.length === 1 && weapon.ammo[0].name === 'Normal' && weapon.ammo[0].shots === weapon.totalCapacity()
                        && !weapon.ammo[0].isModified()) {
                        // One shot of standard ammo -- no need to mention it
                    } else if (weapon.ammo.length === 1) {
                        text += weapon.ammo[0].textDescription(weapon.ammo.length > 1, weapon.ammo[0].shots === weapon.shots && weapon.shots === weapon.totalCapacity()) + " ";
                    } else {
                        text += "Messed up ammunition load for ";
                    }
                    text += weapon.name;
                    if (weapon.count > 1 || plural) text += "s";
                    if (typeof locationOverride === 'string') text += " " + locationOverride;
                    else if (weapon.showLocation) text += " " + weapon.displayLocation;
                    if (weapon.count > 1 || plural) text += " each";
                    text += " w/";
                }
            }
            if (weapon.count === 1 && weapon.componentArmor) text += weapon.componentArmor.textDescription() + " and ";
            if (weapon.fireRetardantInsulator) text += "Fire-Retardant Insulator and ";
            if (weapon.laserGuidanceLink) text += "Laser Guidance Link and ";
            if (weapon.count > 1 && weapon.componentArmor) {
                if (/ each w\/$/.test(text)) text = text.substr(0, text.length - 8) + " w/";
                text += weapon.componentArmor.textDescription() + " on the " + (weapon.count === 2 ? "pair" : "set of " + weapon.count);
            }

            if (weapon.count > 1 && locationOverride !== '') {
                if (linked) text = " Linked " + text;
                else text = " " + text;
                text = weapon.count + text;
            }
            if (/ each w\/$/.test(text)) text = text.substr(0, text.length - 8);
            if (/ w\/$/.test(text)) text = text.substr(0, text.length - 3);
            else if (/, $/.test(text)) text = text.substr(0, text.length - 2);
            else if (/ and $/.test(text)) text = text.substr(0, text.length - 5);
            return text;
        };

        return weapon;
    };

    CW.createArmor = function (plasticPoints, metalPoints) {
        var armor = {
            plasticType: plasticPoints && plasticPoints > 0 ? CW.armor.plastic : null,
            plasticPoints: plasticPoints || 0,
            metalType: metalPoints && metalPoints > 0 ? CW.armor.metal : null,
            metalPoints: metalPoints || 0,
            type: 'Armor'
        };
        armor.compareTo = function (other) {
            if (!other.type) return 1;
            if (other.type !== this.type) return this.type > other.type ? 1 : -1;
            if (this.plasticType && !other.plasticType) return 1;
            else if (other.plasticType && !this.plasticType) return -1;
            else if (this.plasticType) {
                if (this.plasticType.name !== other.plasticType.name) return this.plasticType.name > other.plasticType.name ? 1 : -1;
                if (this.plasticPoints !== other.plasticPoints) return this.plasticPoints - other.plasticPoints;
            }
            if (this.metalType && !other.metalType) return 1;
            else if (other.metalType && !this.metalType) return -1;
            else if (this.metalType) {
                if (this.metalType.name !== other.metalType.name) return this.metalType.name > other.metalType.name ? 1 : -1;
                if (this.metalPoints !== other.metalPoints) return this.metalPoints - other.metalPoints;
            }
            return 0;
        };
        armor.totalCost = function (baseCost) {
            return (!this.plasticType ? 0 : Math.ceil(baseCost * this.plasticType.costFactor * this.plasticPoints - 0.0001))
                + (!this.metalType ? 0 : Math.ceil(baseCost * this.metalType.costFactor * this.metalPoints - 0.0001));
        };
        armor.totalWeight = function (baseWeight) {
            return (!this.plasticType ? 0 : Math.ceil(baseWeight * this.plasticType.weightFactor * this.plasticPoints - 0.0001))
                + (!this.metalType ? 0 : Math.ceil(baseWeight * this.metalType.weightFactor * this.metalPoints - 0.0001));
        };
        armor.armorPointDescription = function (composite) {
            if (this.metalType && this.metalPoints > 0 && this.plasticType && this.plasticPoints > 0) {
                return this.metalPoints + "/" + this.plasticPoints;
            }
            if (this.metalType && this.metalPoints > 0) {
                return this.metalPoints + (composite ? "/0" : "");
            }
            if (this.plasticType && this.plasticPoints > 0) {
                return (composite ? "0/" : "") + this.plasticPoints;
            }
            return "";
        };
        armor.textDescription = function () {
            if (!this.metalType || this.metalPoints === 0) {
                if (this.plasticType === CW.armor.plastic || !this.plasticType) {
                    return this.plasticPoints + "-pt";
                } else if (this.plasticType) {
                    var name = this.plasticType.name;
                    if (/ Plastic$/.test(name)) name = name.substring(0, name.length - 8);
                    return this.plasticPoints + "-pt " + name;
                }
            } else if (!this.plasticType || this.plasticPoints === 0) {
                return this.metalPoints + "-pt" + (this.metalType ? " " + this.metalType.name : '');
            }
            return this.metalPoints + "/" + this.plasticPoints + "-pt Composite " + this.metalType.name + "/" + this.plasticType.name;
        };
        armor.present = function () {
            return this.plasticPoints > 0 || this.metalPoints > 0;
        };

        return armor;
    };

    CW.createWheelArmor = function (plasticType, metalType, wheelhub) {
        var armor = CW.createArmor(0, 0);
        armor.plasticType = plasticType;
        armor.metalType = metalType;
        armor.fake = false;
        armor.motorcycle = false;
        armor.wheelhub = wheelhub ? true : false;
        if (!armor.plasticType && !armor.metalType) armor.plasticType = CW.armor.plastic;

        armor.totalCost = function (sidecarOverride) {
            var total = 0;
            if (this.fake) total = 2;
            else total = (!this.plasticType ? 0 : Math.ceil(10 * this.plasticType.costFactor * this.plasticPoints - 0.0001))
                + (!this.metalType ? 0 : Math.ceil(10 * this.metalType.costFactor * this.metalPoints - 0.0001));
            if(this.motorcycle && this.wheelhub && !sidecarOverride) total *= 2;
            return total;
        };

        armor.totalWeight = function (techLevel, sidecarOverride) { // sidecarOverride: only one per sidecar tire even if it's a motorcycle wheelhub
            var total = 0;
            if (this.fake) total = 1;
            else total = (!this.plasticType ? 0 : Math.ceil((this.motorcycle && (!this.wheelhub || techLevel === 'All') ? 2 : 4) * this.plasticType.weightFactor * this.plasticPoints - 0.0001))
                + (!this.metalType ? 0 : Math.ceil((this.motorcycle && (!this.wheelhub || techLevel === 'All') ? 2 : 4) * this.metalType.weightFactor * this.metalPoints - 0.0001));
            if(this.motorcycle && this.wheelhub && !sidecarOverride) total *= 2;
            return total;
        };

        armor.totalDP = function () {
            return this.plasticPoints > 0 ? this.plasticPoints : this.metalPoints;
        };

        armor.textDescription = function () {
            if (this.fake) return "Fake" + (this.motorcycle ? " Cycle" : "");
            if (!this.metalType || this.metalPoints === 0) {
                if (this.plasticType === CW.armor.plastic || !this.plasticType) {
                    return this.plasticPoints + "-pt" + (this.motorcycle ? " Cycle" : "");
                } else {
                    var name = this.plasticType.name;
                    if (/ Plastic$/.test(name)) name = name.substring(0, name.length - 8);
                    return this.plasticPoints + "-pt " + name + (this.motorcycle ? " Cycle" : "");
                }
            } else if (!this.plasticType || this.plasticPoints === 0) {
                return this.metalPoints + "-pt" + (this.metalType ? " " + this.metalType.name : "") + (this.motorcycle ? " Cycle" : "");
            }
            return this.metalPoints + "/" + this.plasticPoints + "-pt Composite " + this.metalType.name + "/" + this.plasticType.name + (this.motorcycle ? " Cycle" : "");
        };

        armor.sameAs = function (other) {
            if (other.plasticType !== this.plasticType) return false;
            if (other.metalType !== this.metalType) return false;
            if (other.plasticPoints !== this.plasticPoints) return false;
            if (other.metalPoints !== this.metalPoints) return false;
            if (other.fake !== this.fake) return false;
            if (other.motorcycle !== this.motorcycle) return false;
            if(other.wheelhub !== this.wheelhub) return false;
            return true;
        };

        return armor;
    };

    CW.createComponentArmor = function (item, vehicleType) {
        var armor = CW.createArmor(1, 0);
        armor.item = item;
        armor.type = "Component Armor";
        armor.vehicleType = vehicleType;

        armor.spacesProtected = function () {
            var size = 0;
            if (armor.item.length) {
                for (var i = 0; i < armor.item.length; i++) {
                    size += armor.item[i].unarmoredSpace();
                }
            } else {
                size = armor.item.unarmoredSpace();
            }
            return size < 1 ? 1 : Math.ceil(size - 0.0001);
        };

        armor.totalCost = function () {
            var factor = this.spacesProtected();
            return (!this.plasticType ? 0 : Math.ceil(5 * factor * this.plasticType.costFactor * this.plasticPoints - 0.0001))
                + (!this.metalType ? 0 : Math.ceil(5 * factor * this.metalType.costFactor * this.metalPoints - 0.0001));
        };

        armor.totalWeight = function () {
            var factor = this.spacesProtected();
            return (!this.plasticType ? 0 : Math.ceil(2 * factor * this.plasticType.weightFactor * this.plasticPoints - 0.0001))
                + (!this.metalType ? 0 : Math.ceil(2 * factor * this.metalType.weightFactor * this.metalPoints - 0.0001));
        };

        armor.totalSpace = function () {
            return this.vehicleType === 'Cycle' ? 0.5 : 1;
        };

        armor.totalDP = function () {
            return this.plasticPoints > 0 ? this.plasticPoints : this.metalPoints;
        };

        armor.textDescription = function () {
            if (!this.metalType || this.metalPoints === 0) {
                if (this.plasticType === CW.armor.plastic || !this.plasticType) {
                    return this.plasticPoints + "-pt CA";
                } else {
                    var name = this.plasticType.name;
                    if (/ Plastic$/.test(name)) name = name.substring(0, name.length - 8);
                    return this.plasticPoints + "-pt " + name + " CA";
                }
            } else if (!this.plasticType || this.plasticPoints === 0) {
                return this.metalPoints + "-pt" + (this.metalType ? " " + this.metalType.name : "") + " CA";
            }
            return this.metalPoints + "/" + this.plasticPoints + "-pt Composite " + this.metalType.name + "/" + this.plasticType.name + " CA";
        };

        return armor;
    };

    CW.createTurret = function (type, spaces, side) {
        var turret = CW.create(CW.turrets[type.replace(' ', '_').replace('-', '_')]);
        turret.size = spaces;
        while (turret.size >= 0 && turret.costBySize[turret.size] === 0) turret.size -= 1;
        turret.fake = false;
        turret.ewpEjectionSystem = false;
        turret.universal = false;
        turret.armor = null;
        turret.weapons = [];
        turret.boosters = []; // EWPs only
        turret.builtIn = false;
        turret.gunner = /Cupola/.test(type) ? CW.createCrew("Gunner") : null;
        turret.side = side;
        if (turret.gunner) turret.gunner.cupola = true;

        var dropped = function() {return this.wraps.isDropped();};
        var compare = function(o, nl, nc) {return this.wraps.compareTo(o, nl, nc);};

        turret.linkableWeapons = function(left) {
            var result = [], loc;
            if(!this.side) return result;
            for(var i=0; i<this.weapons.length; i++) {
                loc = this.weapons[i].displayLocation;
                if(/^in /.test(loc)) loc = "in "+(left ? "Left" : "Right")+loc.substr(2);
                else loc = loc+(left ? " Left" : " Right");
                result.push({
                    type: 'Weapon',
                    abbv: this.weapons[i].abbv,
                    name: this.weapons[i].name,
                    count: this.weapons[i].count,
                    location: this.weapons[i].location,
                    displayLocation: loc,
                    wraps: this.weapons[i],
                    left: left,
                    isDropped: dropped,
                    compareTo: compare,
                    shortDescription: this.weapons[i].shortDescription
                });
            }
            return result;
        };
        turret.linkableWeapon = function(weapon, left) {
            var list = this.linkableWeapons(left);
            for(var i=0; i<list.length; i++)
                if(list[i].wraps === weapon) return list[i];
            return null;
        };

        turret.isEWP = function () {
            return /EWP/.test(this.name);
        };
        turret.isRocketEWP = function () {
            return this.name === CW.turrets.Rocket_EWP.name;
        };
        turret.isRocketPlatform = function () {
            return this.name === CW.turrets.Rocket_Platform.name;
        };
        turret.isCupola = function() {
            return /Cupola/.test(this.name);
        };

        turret.makeBigger = function (limit) {
            if (turret.size < limit && turret.costBySize.length > turret.size && turret.costBySize[turret.size + 1] > 0) {
                turret.size += 1;
            }
        };

        turret.makeSmaller = function () {
            if (turret.size > 0 && turret.costBySize[turret.size - 1] > 0) {
                turret.size -= 1;
            }
        };

        turret.setFake = function (fake, car) {
            this.fake = fake;
            for (var i = 0; i < this.weapons.length; i++) {
                this.weapons[i].setFake(fake, car);
            }
        };

        turret.baseCost = function () {
            return turret.fake ? 250 : this.builtIn ? 0 : this.costBySize[this.size];
        };

        turret.totalCost = function () {
            var i, total;
            if (turret.fake) {
                total = 250;
                for (i = 0; i < turret.weapons.length; i++) { // Fake Weapons
                    total += turret.weapons[i].totalCost();
                }
                return total;
            }
            total = this.builtIn ? 0 : this.costBySize[this.size];
            if (turret.name === 'EWP') {
                if (turret.ewpEjectionSystem) total += 250;
                if (turret.armor) total += turret.armor.totalCost(10);
            } else if (turret.name === 'Rocket EWP') {
                if (turret.ewpEjectionSystem) total += 250;
            } else if (turret.name === 'Pintle Mount') {
                if (turret.armor) total += turret.armor.totalCost(10);
            } else if (this.isCupola()) {
                total += turret.gunner.totalCost();
            }
            if (turret.universal) total += 1000;
            for (i = 0; i < turret.weapons.length; i++) {
                total += turret.weapons[i].totalCost();
            }
            for (i = 0; i < turret.boosters.length; i++) {
                total += turret.boosters[i].totalCost();
            }
            return total;
        };

        turret.baseWeight = function () {
            return turret.fake ? 50 : this.builtIn ? 0 : this.weightBySize[this.size];
        };
        turret.totalWeight = function (cupolaAltEncumbrance) {
            var i, total;
            if (turret.fake) {
                total = 50;
                for (i = 0; i < turret.weapons.length; i++) { // Fake Weapons
                    total += turret.weapons[i].totalWeight();
                }
                return total;
            }
            total = this.builtIn ? 0 : this.weightBySize[this.size];
            if (turret.name === 'EWP' || turret.name === 'Pintle Mount') {
                if (turret.armor) total += turret.armor.totalWeight(4);
            }
            if (this.isCupola()) total += turret.gunner.totalWeight(cupolaAltEncumbrance);
            for (i = 0; i < turret.weapons.length; i++) {
                total += turret.weapons[i].totalWeight();
            }
            for (i = 0; i < turret.boosters.length; i++) {
                total += turret.boosters[i].totalWeight();
            }
            return total;
        };

        turret.totalSpace = function () {
            if (turret.fake || turret.builtIn) return 0;
            var total = this.spaceBySize[this.size];
            for (var i = 0; i < turret.weapons.length; i++) {
                total += turret.weapons[i].spaceOutsideTurret();
            }
            return total;
        };

        turret.remainingSpace = function () {
            // Don't return 0 for a fake turret because you can pick fake weapons for it
            var total = turret.size;
            if (this.isCupola()) total -= turret.gunner.totalSpace();
            for (var i = 0; i < turret.weapons.length; i++) {
                total -= turret.weapons[i].spaceInsideTurret();
            }
            for (i = 0; i < turret.boosters.length; i++) {
                total -= turret.boosters[i].totalSpace();
            }
            return total < 0.3 ? 0 : total;
        };

        turret.textDescription = function (location, carWeight, links) {
            var i, text = '', linked = false, linkL = null, linkR = null, wpnL, wpnR;
            if (!this.fake && this.weapons.length === 1 && this.boosters.length === 0 && !this.isCupola()) {
                if(this.weapons[0].count > 1) {
                    if(this.side) {
                        wpnL = this.linkableWeapons(true)[0];
                        wpnR = this.linkableWeapons(false)[0];
                        for(i=0; i<links.length; i++) {
                            if(links[i].items.length === 1) {
                                if (links[i].contains(wpnL)) linkL = i;
                                else if (links[i].contains(wpnR)) linkR = i;
                            }
                        }
                        if(linkL !== null && linkR !== null) {
                            links.splice(Math.max(linkL, linkR), 1);
                            links.splice(Math.min(linkL, linkR), 1);
                            linked = true;
                        }
                    } else {
                        for (i = 0; i < links.length; i++)
                            if (links[i].items.length === 1 && links[i].items[0] === this.weapons[0]) {
                                linked = true;
                                links.splice(i, 1);
                                break;
                            }
                    }
                }
                text += this.weapons[0].textDescription(/ and /.test(location), (this.name === 'Rocket Platform' ? 'on ' : 'in ')
                    + (this.universal ? "universal " : '') + this.name + (/ and /.test(location) ? 's' : '') + (location === 'Top' ? '' : ' ' + location),
                    linked);
            } else {
                if (turret.fake) text += "Fake ";
                if (turret.universal) text += "Universal ";
                text += /*turret.size+"-space "+*/turret.name;
                if (/ and /.test(location)) text += "s";
                if (/EWP/.test(this.name) || location !== 'Top')
                    text += " " + location;
                text += " w/";
                if ((turret.name === CW.turrets.EWP.name || turret.name === CW.turrets.Pintle_Mount.name) && turret.armor) text += turret.armor.textDescription() + (this.name === CW.turrets.EWP.name ? ' EWP armor' : " Tripod Gunshield") + " and ";
                if (/EWP/.test(turret.name) && turret.ewpEjectionSystem) text += "EWP Ejection System and ";
                var weapons = CW.sortItems(turret.weapons);
                text += CW.weaponText(weapons, links, " and ");
                if (turret.weapons.length === 0 && turret.boosters.length === 0) text += "no weapons";
                for (i = 0; i < turret.boosters.length; i++) {
                    text += (i > 0 || turret.weapons.length > 0 ? " and " : "") + turret.boosters[i].textDescription(carWeight)
                        + (turret.boosters[i].bottomOrRearFacing ? "" : " facing front");
                }
                if (this.isCupola()) text += " and " + turret.gunner.textDescription();
            }
            return text;
        };

        return turret;
    };

    var linkContains = function(list, item) {
        for (var i = 0; i < list.length; i++) {
            if(item.wraps) {
                if(list[i].wraps &&
                    item.wraps === list[i].wraps && item.left === list[i].left)
                    return true;
            } else if(list[i] === item) return true;
        }
        return false;
    };

    CW.createLink = function (car, isSmartLink) {
        var link = {};
        link.type = 'Link';
        link.smartLink = isSmartLink;
        link.items = [];

        link.contains = function (item) {
            return linkContains(this.items, item);
        };

        link.addItem = function (item) {
            if(!this.contains(item))
                this.items.push(item);
        };

        link.removeItem = function (item) {
            for (var i = 0; i < link.items.length; i++) {
                if (link.items[i] === item || link.items[i].wraps === item) {
                    link.items.splice(i, 1);
                    return;
                }
            }
        };

        link.displayName = function () {
            if (link.items.length === 0) return (link.smartLink ? "Smart " : "") + "Link (not configured)";
            var text = "";
            for (var i = 0; i < link.items.length; i++) {
                if (typeof link.items[i] === 'string') text += link.items[i];
                else if (link.items[i].type === 'Booster') text += link.items[i].boosterName();
                else {
                    if (link.items[i].count && link.items[i].count > 1) text += link.items[i].count + "x ";
                    if (link.items[i].abbv) text += link.items[i].abbv;
                    else text += link.items[i].name;
                }
                if (i < link.items.length - 1) text += ",";
            }
            return text;
        };

        link.textDescription = function () {
            if (link.items.length === 0) return (link.smartLink ? "Smart " : "") + "Link";
            var i, j, items = CW.sortItems(link.items), all = car.linkableWeapons(), complete, count,
                locationCount, locations, otherLocations, used = [], useName, list, started, sameType;
            var text = (link.smartLink ? "Smart " : "") + "Link (";
            started = false;
            // First check whether all weapons in a single location are included
            count = 0;
            complete = true;
            locations = null;
            for (i = 0; i < items.length; i++) {
                if (typeof items[i] !== 'string' && items[i].type === 'Weapon') {
                    if (!locations) {
                        locations = items[i].location;
                        otherLocations = items[i].displayLocation;
                    } else if (items[i].location !== locations) {
                        complete = false;
                        break;
                    }
                    count += 1;
                }
            }
            if (complete && locations && count > 1) {
                i = /Carrier/.test(locations) ? car.carrier : car;
                j = /Carrier/.test(locations) ? CW.carrierLocation(locations) : locations;
                list = i[j.substr(0, 1).toLowerCase() + j.substr(1) + "Weapons"];
                if (list && list.length === count) {
                    if (started) text += ', ';
                    text += (count > 2 ? 'all ' : 'both ') + (/Carrier/.test(location) ? "Carrier " : "") + otherLocations + " weapons";
                    for (i = 0; i < items.length; i++)
                        if (typeof items[i] !== 'string' && items[i].type === 'Weapon')
                            used.push(items[i]);
                    started = true;
                }
            }
            // Next check for all dropped weapons
            count = 0;
            sameType = null;
            for (i = 0; i < items.length; i++) {
                if (used.indexOf(items[i]) >= 0) continue;
                if (typeof items[i] !== 'string' && items[i].type === 'Weapon') {
                    if (!items[i].isDropped()) continue;
                    if(sameType === null) sameType = items[i].abbv;
                    else if(sameType && sameType !== items[i].abbv) sameType = false;
                    count += 1;
                }
            }
            if (count > 2) {
                for (i = 0; i < all.length; i++)
                    if (all[i].isDropped()) count -= 1;
                if (count === 0) {
                    if (started) text += ', ';
                    if(sameType) text += 'all '+sameType+"s";
                    else text += 'all Dropped weapons';
                    started = true;
                    for (i = 0; i < items.length; i++)
                        if (typeof items[i] !== 'string' && items[i].type === 'Weapon' && items[i].isDropped())
                            used.push(items[i]);
                }
            }
            // Now check for non-weapons and other weapon configurations
            for (i = 0; i < items.length; i++) {
                if (linkContains(used, items[i])) continue;
                if (started) text += ', ';
                started = true;
                if (typeof items[i] === 'string') text += items[i];
                else if (items[i].type === 'Booster') text += items[i].shortDescription();
                else if (items[i].type === 'Accessory') text += items[i].textDescription();
                else if (items[i].type === 'Weapon') {
                    complete = true;
                    count = 0;
                    locations = {};
                    otherLocations = [];
                    locationCount = 0;
                    for (j = 0; j < all.length; j++) {
                        if (all[j].abbv === items[i].abbv) {
                            if (!link.contains(all[j])) {
                                complete = false;
                                if (!locations[all[j].displayLocation] && otherLocations.indexOf(all[j].displayLocation) < 0)
                                    otherLocations.push(all[j].displayLocation);
                            } else {
                                count += all[j].count;
                                if (!locations[all[j].displayLocation]) {
                                    locations[all[j].displayLocation] = all[j].count;
                                    locationCount += 1;
                                } else locations[all[j].displayLocation] += all[j].count;
                                if (otherLocations.indexOf(all[j].displayLocation) >= 0)
                                    otherLocations.splice(otherLocations.indexOf(all[j].displayLocation), 1);
                                used.push(all[j]);
                            }
                        }
                    }
                    useName = items[i].abbv.length === 1 ? items[i].name : items[i].abbv;
                    if (count === 1) {
                        if (complete)
                            text += useName;
                        else
                            text += items[i].shortDescription(); // with location
                    } else if (complete) {
                        text += (count > 2 ? 'all ' : 'both ') + useName + "s";
                        j = i;
                        while (i + 1 < items.length && typeof items[i + 1] !== 'string' && items[i + 1].type === 'Weapon'
                            && items[i + 1].abbv === items[j].abbv) i += 1;
                    } else if(car.sideTurret && car.sideTurret.weapons.length === 1 && items.length === 2 && this.contains(car.sideTurret.linkableWeapons(true)[0])
                        && this.contains(car.sideTurret.linkableWeapons(false)[0])) {
                        text += (items[0].abbv.length === 1 ? items[0].name : items[0].abbv)+"s in "+car.sideTurret.name+"s";
                        break;
                    } else {
                        if (locationCount === 1) {
                            text += count + " " + useName + "s";
                            if (otherLocations.length > 0)
                                for (j in locations)
                                    if (locations.hasOwnProperty(j))
                                        text += " " + j;
                        } else {
                            count = 0;
                            for (j in locations)
                                if (locations.hasOwnProperty(j)) {
                                    if (count > 0) text += ", ";
                                    text += (locations[j] === 1 ? "" : locations[j] + " ") + useName + (locations[j] > 1 ? "s" : '') + " " + j;
                                    count += 1;
                                }
                        }
                    }
                } else {
                    console.log("Link Problem");
                    console.log(items[i]);
                }
            }
            return text + ")";
        };

        link.toJSON = function () {
            var out = {
                items: []
            };
            var item, i, location, sidecar, carrier, index, list, use, side, result;
            for (i = 0; i < link.items.length; i++) {
                sidecar = false;
                carrier = false;
                side = null;
                index = -1;
                item = link.items[i];
                if (typeof item === 'string') {
                    out.items.push(item);
                } else if (item.type === 'Weapon') {
                    if(item.wraps) use = item.wraps;
                    list = car[item.location.substr(0, 1).toLowerCase() + item.location.substring(1) + "Weapons"];
                    if (list && list.indexOf(item) > -1) {
                        out.items.push({
                            type: 'Weapon',
                            location: item.location,
                            index: list.indexOf(item)
                        });
                    } else { // Must be in a turret?  Or sidecar or something?
                        if (car.topTurret) {
                            index = car.topTurret.weapons.indexOf(item);
                            location = 'topTurret';
                        }
                        if (index < 0) {
                            if (car.sideTurret) {
                                index = car.sideTurret.weapons.indexOf(use);
                                location = 'sideTurret';
                                if(index >= 0) side = item.left;
                            }
                            if (index < 0) {
                                if (car.topBackTurret) {
                                    index = car.topBackTurret.weapons.indexOf(item);
                                    location = 'topBackTurret';
                                }
                                if (index < 0) {
                                    if (car.sideBackTurret) {
                                        index = car.sideBackTurret.weapons.indexOf(use);
                                        location = 'sideBackTurret';
                                        if(index >= 0) side = item.left;
                                    }
                                    if (index < 0) {
                                        if (car.sidecar) {
                                            list = car.sidecar[item.location.substr(0, 1).toLowerCase() + item.location.substring(1) + "Weapons"];
                                            if (list && list.indexOf(item) > -1) {
                                                index = list.indexOf(item);
                                                location = item.location;
                                                sidecar = true;
                                            } else if (car.sidecar.topTurret) {
                                                index = car.sidecar.topTurret.weapons.indexOf(item);
                                                location = 'topTurret';
                                                sidecar = true;
                                            } else console.log("Unable to save sidecar item location " + item.location);
                                        } else if (car.carrier) {
                                            location = item.location;
                                            if (/^Carrier/.test(location)) location = CW.carrierLocation(location);
                                            list = car.carrier[location.substr(0, 1).toLowerCase() + location.substring(1) + "Weapons"];
                                            if (list && list.indexOf(item) > -1) {
                                                index = list.indexOf(item);
                                                carrier = true;
                                            } else { // Must be in a turret
                                                if (car.carrier.topTurret) {
                                                    index = car.carrier.topTurret.weapons.indexOf(item);
                                                    location = 'topTurret';
                                                    carrier = true;
                                                }
                                                if (index < 0) {
                                                    if (car.carrier.sideTurret) {
                                                        index = car.carrier.sideTurret.weapons.indexOf(use);
                                                        location = 'sideTurret';
                                                        carrier = true;
                                                        if(index >= 0) side = item.left;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        result = {
                            type: 'Weapon',
                            location: location,
                            index: index,
                            sidecar: sidecar,
                            carrier: carrier
                        };
                        if(side !== null) result.leftSide = side;
                        out.items.push(result);
                    }
                } else if (item.type === 'Accessory') {
                    if (car.accessories.indexOf(item) > -1) {
                        out.items.push({
                            type: 'Accessory',
                            index: car.accessories.indexOf(item)
                        });
                    } else if (car.sidecar && car.sidecar.accessories.indexOf(item) > -1) {
                        out.items.push({
                            type: 'Accessory',
                            sidecar: true,
                            index: car.sidecar.accessories.indexOf(item)
                        });
                    } else if (car.carrier && car.carrier.accessories.indexOf(item) > -1) {
                        out.items.push({
                            type: 'Accessory',
                            carrier: true,
                            index: car.carrier.accessories.indexOf(item)
                        });
                    }
                } else if (item.type === 'Booster') {
                    if (car.boosters.indexOf(item) > -1) {
                        out.items.push({
                            type: 'Booster',
                            index: car.boosters.indexOf(item)
                        });
                    } else if (car.topTurret && car.topTurret.boosters.indexOf(item) > -1) {
                        out.items.push({
                            type: 'Booster',
                            location: 'topTurret',
                            index: car.topTurret.boosters.indexOf(item)
                        });
                    } else if (car.sideTurret && car.sideTurret.boosters.indexOf(item) > -1) {
                        out.items.push({
                            type: 'Booster',
                            location: 'sideTurret',
                            index: car.sideTurret.boosters.indexOf(item)
                        });
                    } else if (car.topBackTurret && car.topBackTurret.boosters.indexOf(item) > -1) {
                        out.items.push({
                            type: 'Booster',
                            location: 'topBackTurret',
                            index: car.topBackTurret.boosters.indexOf(item)
                        });
                    } else if (car.sideBackTurret && car.sideBackTurret.boosters.indexOf(item) > -1) {
                        out.items.push({
                            type: 'Booster',
                            location: 'sideBackTurret',
                            index: car.sideBackTurret.boosters.indexOf(item)
                        });
                    } else if (car.carrier && car.carrier.boosters.indexOf(item) > -1) {
                        out.items.push({
                            type: 'Booster',
                            carrier: true,
                            index: car.carrier.boosters.indexOf(item)
                        });
                    } else if (car.carrier && car.carrier.topTurret && car.carrier.topTurret.boosters.indexOf(item) > -1) {
                        out.items.push({
                            type: 'Booster',
                            carrier: true,
                            location: 'topTurret',
                            index: car.carrier.topTurret.boosters.indexOf(item)
                        });
                    } else if (car.carrier && car.carrier.sideTurret && car.carrier.sideTurret.boosters.indexOf(item) > -1) {
                        out.items.push({
                            type: 'Booster',
                            carrier: true,
                            location: 'sideTurret',
                            index: car.carrier.sideTurret.boosters.indexOf(item)
                        });
                    }
                }
            }
            return out;
        };

        return link;
    };

    CW.createHitch = function (type) {
        var hitch = CW.create(type);
        hitch.type = "Hitch";
        hitch.explosive = false;
        hitch.quickRelease = false;
        hitch.armor = null;

        hitch.changeType = function (type) {
            this.name = type.name;
            this.loadWeight = type.loadWeight;
            this.cost = type.cost;
            this.weight = type.weight;
            this.dp = type.dp;
        };

        hitch.totalCost = function () {
            return this.cost
                + (this.explosive ? 400 : 0)
                + (this.quickRelease ? 900 : 0)
                + (this.armor ? this.armor.totalCost(15) : 0);
        };

        hitch.totalWeight = function () {
            return this.weight + (this.armor ? this.armor.totalWeight(4) : 0);
        };

        hitch.ownDP = function () {
            return this.dp;
        };
        hitch.totalDP = function () {
            return this.ownDP() + (this.armor ? this.armor.plasticPoints : 0);
        };

        hitch.walkaroundDescription = function () {
            return (this.armor ? "Armored " : "") + "Hitch";
        };

        hitch.textDescription = function () {
            var text = "";
            if (this.explosive) text += "Explosive ";
            if (this.quickRelease) text += "Quick-Release ";
            text += this.name;
            if (this.armor) text += " w/" + this.armor.textDescription() + " armor";
            return text;
        };

        hitch.nextArmor = function (car) {
            if (!hitch.armor) {
                hitch.armor = CW.createArmor(1);
                hitch.armor.plasticType = car.armorTypeToMatch();
            } else {
                hitch.armor.plasticPoints += 1;
                while (hitch.armor.totalWeight(4) > 40) {
                    hitch.armor.plasticPoints -= 1;
                }
            }
            car.recalculate();
        };

        hitch.previousArmor = function (car) {
            hitch.armor.plasticPoints -= 1;
            if (hitch.armor.plasticPoints < 1) hitch.armor = null;
            car.recalculate();
        };

        return hitch;
    };

    CW.createBooster = function (isJumpJet, bottomOrRearFacing) {
        var booster = {};
        booster.weight = 100;
        booster.jumpJet = isJumpJet;
        booster.bottomOrRearFacing = bottomOrRearFacing;
        booster.type = "Booster";
        booster.showFacing = true;

        booster.totalWeight = function () {
            return this.weight;
        };

        booster.totalSpace = function () {
            return Math.ceil(this.weight / 100 - 0.0001);
        };

        booster.totalCost = function () {
            return Math.ceil(this.weight / 10 - 0.0001) * 50;
        };

        booster.ownDP = function () {
            return this.totalSpace();
        };
        booster.totalDP = function () {
            return this.ownDP();
        };

        booster.accelerationForWeight = function (carWeight) {
            return Math.floor((this.weight * 1000 / carWeight) / 2.5 + 0.000001) * 2.5;
        };

        booster.boosterName = function () {
            return this.jumpJet ? "Jump Jet" : "Booster";
        };

        booster.shortDescription = function () {
            if (this.jumpJet) {
                return "Jump Jets" + (this.showFacing ? this.bottomOrRearFacing ? " Underbody" : " Top" : "");
            } else {
                return "Rocket Boosters" + (this.showFacing ? this.bottomOrRearFacing ? " Back" : " Front" : "");
            }
        };

        booster.walkaroundDescription = function () {
            if (this.jumpJet) {
                return "Jump Jets " + (this.bottomOrRearFacing ? "Underbody" : "Top");
            } else {
                return "Rocket Boosters " + (this.bottomOrRearFacing ? "Back" : "Front");
            }
        };

        booster.textDescription = function (carWeight) {
            return this.accelerationForWeight(carWeight) + "mph of " + this.shortDescription();
        };

        booster.compareTo = function (other) {
            if (this.jumpJet && !other.jumpJet) return 1;
            if (other.jumpJet && !this.jumpJet) return -1;
            if (this.bottomOrRearFacing && !other.bottomOrRearFacing) return 1;
            if (other.bottomOrRearFacing && !this.bottomOrRearFacing) return -1;
            return this.weight - other.weight;
        };

        return booster;
    };

    CW.countBoosterSpace = function (booster, location) {
        var total = 0;
        for (var i = 0; i < booster.length; i++) {
            if (location === 'All') total += booster[i].totalSpace();
            else if (location === 'Front') {
                if (!booster[i].jumpJet && !booster[i].bottomOrRearFacing) total += booster[i].totalSpace();
            } else if (location === 'Back') {
                if (!booster[i].jumpJet && booster[i].bottomOrRearFacing) total += booster[i].totalSpace();
            } else if (location === 'Top') {
                if (booster[i].jumpJet && !booster[i].bottomOrRearFacing) total += booster[i].totalSpace();
            } else if (location === 'Underbody') {
                if (booster[i].jumpJet && booster[i].bottomOrRearFacing) total += booster[i].totalSpace();
            }
        }
        return total;
    };


    CW.isCorner = function (location) {
        return location === 'FrontLeft' || location === 'FrontRight'
            || location === 'BackLeft' || location === 'BackRight'
            || location === 'CarrierFrontLeft' || location === 'CarrierFrontRight'
            || location === 'CarrierBackLeft' || location === 'CarrierBackRight';
    };

    CW.latestRevision = function () {
        var rev = 0, temp, i;
        var all = [CW.versionOfData, CW.versionOfDraw, CW.versionOfEngines, CW.versionOfExport, CW.versionOfImport,
            CW.versionOfModel, CW.versionOfValidate, CW.versionOfRouting, CW.versionOf2D, CW.versionOf3D];
        for (i = 0; i < all.length; i++) {
            if (!all[i]) continue;
            temp = parseInt(/[0-9]+/.exec(all[i]));
            if (temp > rev) rev = temp;
        }
        return rev;
    };

    CW.sortItems = function (items) {
        var clone = items.slice(0);
        clone.sort(function (a, b) {
            if (typeof a === 'string') {
                if (typeof b === 'string') {
                    if (a > b) return 1;
                    else if (b > a) return -1;
                    return 0;
                }
                return 1;
            } else if (typeof b === 'string') return -1;
            if (a.type > b.type) return 1;
            else if (b.type > a.type) return -1;
            if (a.type === 'Booster' || a.type === 'Weapon' || a.type === 'Hand Weapon') return a.compareTo(b);
            return 0;
        });
        return clone;
    };

    CW.linkMatches = function (weapons, count, link) {
        if (link.items.length !== count) return false;
        for (var i = 0; i < count; i++) {
            if (!link.contains(weapons[i])) return false;
        }
        return true;
    };

    CW.weaponText = function (weapons, links, joiner) {
        var result = '', i;
        var linked = false;
        if (weapons.length === 0) return "";
        if (weapons.length === 1) {
            for (i = 0; i < links.length; i++)
                if (CW.linkMatches(weapons, 1, links[i])) {
                    links.splice(i, 1);
                    return weapons[0].textDescription(true, null, true) + (joiner ? '' : ", ");
                }
            return weapons[0].textDescription() + (joiner ? '' : ", ");
        }
        var text, index, test, start = 0;
        while (start < weapons.length) {
            text = weapons[start].textDescription();
            if (result.length > 0) result += (joiner ? joiner : ', ');
            for (index = start + 1; index < weapons.length; index++) {
                test = weapons[index].textDescription();
                if (test !== text) break;
            }
            if (index - start > 1) {
                for (i = 0; i < links.length; i++) {
                    if (CW.linkMatches(weapons.slice(start), index-start, links[i])) {
                        linked = true;
                        links.splice(i, 1);
                        break;
                    }
                }
                result += (index - start) + " " + (linked ? "Linked " : "") + weapons[start].textDescription(true);
            } else if(weapons[start].count > 1) {
                for (i = 0; i < links.length; i++) {
                    if (CW.linkMatches(weapons.slice(start), 1, links[i])) {
                        linked = true;
                        links.splice(i, 1);
                        result += weapons[start].textDescription(true, null, true);
                        break;
                    }
                }
                if(!linked) result += text;
            } else result += text;
            start = index;
        }
        if (!joiner) result += ", ";
        return result;
    };

    CW.weaponsByType = function (type, maxSize, oversize, rocketPlatform) {
        var ammo, name, weapon, weapons = [];
        for (name in CW.weapons) {
            if (!/_ammo$/.test(name) && CW.weapons.hasOwnProperty(name)) {
                weapon = CW.weapons[name];
                if (weapon.category === type) {
                    weapons.push({
                        weapon: weapon,
                        requiredTech: weapon.military ? 'Military' : weapon.techLevel === 'CWC' ? 'CWC' : weapon.techLevel === 'Classic' ? 'Classic' : 'All',
                        disabled: (weapon.space < 1 ? weapon.space.toFixed(2) : weapon.space) > maxSize ||
                            (weapon.abbv === 'TG' && !oversize) ||
                            (rocketPlatform && weapon.abbv !== 'TL' && (!/Rockets/.test(weapon.category) || weapon.shots > 1)),
                        loadedCost: weapon.cost,
                        loadedWeight: weapon.weight,
                        toHit: weapon.toHit > 0 ? "TH " + weapon.toHit : null,
                        damage: weapon.damage && weapon.damage !== '0' ? weapon.damage : null,
                        space: weapon.space === 0 ? 0 : weapon.space < 0.4 ? "1/3" : weapon.space < 0.9 ? "1/2" : weapon.space
                    });
                    ammo = CW.weapons[weapon.abbv + "_ammo"];
                    if (weapon.shots > 0 && ammo && ammo.length > 0) {
                        weapons[weapons.length - 1].loadedCost += ammo[0].costPerShot * weapon.shots;
                        weapons[weapons.length - 1].loadedWeight += ammo[0].weightPerShot * weapon.shots;
                        if (!weapons[weapons.length - 1].damage && ammo[0].damage && ammo[0].damage !== '0')
                            weapons[weapons.length - 1].damage = ammo[0].damage;
                    }
                }
            }
        }
        return weapons;
    };

    var roundIfClose = function(source) {
        if(source.toString().indexOf('.') < 0) return source;
        var fixed = source.toFixed(2);
        return fixed.indexOf(".00") > -1 ? parseInt(fixed) : parseFloat(fixed);
    };
})();