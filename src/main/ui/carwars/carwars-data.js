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

    CW.versionOfData = "$Revision: 1172 $";

    CW.create = function (o) {
        var result = {};
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                result[i] = o[i];
            }
        }
        return result;
    };

    CW.findByName = function (list, name, carType) {
        if (!name) return null;
        var i;
        for (i in list) {
            if (list.hasOwnProperty(i)) {
                if (list[i].name === name &&
                    (!carType || !list[i].vehicleType || carType === list[i].vehicleType)) {
                        return list[i];
                }
            }
        }
        return null;
    };

    CW.carBody = {
        subcompact: {
            name: 'Subcompact',
            cost: 300,
            weight: 1000,
            maxWeight: 2300,
            spaces: 7,
            cargoSpaces: 0,
            armorCost: 11,
            armorWeight: 5,
            racingFrame: false,
            maxTurretSize: 0,
            maxRPSize: 1,
            maxEWPSize: 1
        },
        compact: {
            name: 'Compact',
            cost: 400,
            weight: 1300,
            maxWeight: 3700,
            spaces: 10,
            cargoSpaces: 0,
            armorCost: 13,
            armorWeight: 6,
            racingFrame: false,
            maxTurretSize: 1,
            maxRPSize: 2,
            maxEWPSize: 1
        },
        midsize: {
            name: 'Mid-sized',
            cost: 600,
            weight: 1600,
            maxWeight: 4800,
            spaces: 13,
            cargoSpaces: 0,
            armorCost: 16,
            armorWeight: 8,
            racingFrame: false,
            maxTurretSize: 2,
            maxRPSize: 2,
            maxEWPSize: 2
        },
        sedan: {
            name: 'Sedan',
            cost: 700,
            weight: 1700,
            maxWeight: 5100,
            spaces: 16,
            cargoSpaces: 0,
            armorCost: 18,
            armorWeight: 9,
            racingFrame: false,
            maxTurretSize: 2,
            maxRPSize: 2,
            maxEWPSize: 2
        },
        luxury: {
            name: 'Luxury',
            cost: 800,
            weight: 1800,
            maxWeight: 5500,
            spaces: 19,
            cargoSpaces: 0,
            armorCost: 20,
            armorWeight: 10,
            racingFrame: false,
            maxTurretSize: 2,
            maxRPSize: 2,
            maxEWPSize: 2
        },
        stationWagon: {
            name: 'Station Wagon',
            cost: 800,
            weight: 1800,
            maxWeight: 5500,
            spaces: 14,
            cargoSpaces: 7,
            armorCost: 20,
            armorWeight: 10,
            racingFrame: false,
            maxTurretSize: 2,
            maxRPSize: 2,
            maxEWPSize: 2
        },
        pickup: {
            name: 'Pickup',
            cost: 900,
            weight: 2100,
            maxWeight: 6500,
            spaces: 13,
            cargoSpaces: 11,
            armorCost: 22,
            armorWeight: 11,
            racingFrame: false,
            maxTurretSize: 2,
            maxRPSize: 2,
            maxEWPSize: 2
        },
        camper: {
            name: 'Camper',
            cost: 1400,
            weight: 2300,
            maxWeight: 6500,
            spaces: 17,
            cargoSpaces: 7,
            armorCost: 30,
            armorWeight: 14,
            racingFrame: false,
            maxTurretSize: 3,
            maxRPSize: 3,
            maxEWPSize: 3
        },
        van: {
            name: 'Van',
            cost: 1000,
            weight: 2000,
            maxWeight: 6000,
            spaces: 24,
            cargoSpaces: 6,
            armorCost: 30,
            armorWeight: 14,
            racingFrame: false,
            maxTurretSize: 3,
            maxRPSize: 3,
            maxEWPSize: 3
        },
        FORMULA_ONE_INDY: {
            name: 'Formula One/Indy',
            cost: 6500,
            weight: 600,
            maxWeight: 4000,
            spaces: 15,
            cargoSpaces: 0,
            armorCost: 22,
            armorWeight: 10,
            racingFrame: true,
            maxTurretSize: 2,
            maxRPSize: 2,
            maxEWPSize: 2
        },
        CAN_AM: {
            name: 'Can-Am',
            cost: 6500,
            weight: 800,
            maxWeight: 4500,
            spaces: 18,
            cargoSpaces: 0,
            armorCost: 24,
            armorWeight: 12,
            racingFrame: true,
            maxTurretSize: 2,
            maxRPSize: 2,
            maxEWPSize: 2
        },
        SPRINT: {
            name: 'Sprint',
            cost: 5600,
            weight: 300,
            maxWeight: 3200,
            spaces: 10,
            cargoSpaces: 0,
            armorCost: 15,
            armorWeight: 7,
            racingFrame: true,
            maxTurretSize: 2,
            maxRPSize: 2,
            maxEWPSize: 2
        },
        FUNNY_CAR: {
            name: 'Funny Car',
            cost: 6600,
            weight: 700,
            maxWeight: 4500,
            spaces: 20,
            cargoSpaces: 0,
            armorCost: 26,
            armorWeight: 13,
            racingFrame: true,
            maxTurretSize: 2,
            maxRPSize: 2,
            maxEWPSize: 2
        },
        DRAGSTER: {
            name: 'Dragster',
            cost: 6200,
            weight: 600,
            maxWeight: 4000,
            spaces: 16,
            cargoSpaces: 0,
            armorCost: 20,
            armorWeight: 8,
            racingFrame: true,
            maxTurretSize: 2,
            maxRPSize: 2,
            maxEWPSize: 2
        }
    };
    CW.raceCarBodies = [CW.carBody.SPRINT, CW.carBody.FORMULA_ONE_INDY, CW.carBody.DRAGSTER,
        CW.carBody.CAN_AM, CW.carBody.FUNNY_CAR];
    CW.carBodies = [CW.carBody.subcompact, CW.carBody.compact, CW.carBody.midsize, CW.carBody.sedan, CW.carBody.luxury,
        CW.carBody.stationWagon, CW.carBody.pickup, CW.carBody.camper, CW.carBody.van];

    CW.chassis = {
        light: {
            name: 'Light',
            costFactor: -0.2,
            weightFactor: 0.9
        },
        standard: {
            name: 'Standard',
            costFactor: 0,
            weightFactor: 1
        },
        heavy: {
            name: 'Heavy',
            costFactor: 0.5,
            weightFactor: 1.1
        },
        extra_heavy: {
            name: 'Extra-Heavy',
            costFactor: 1.0,
            weightFactor: 1.2
        }
    };

    CW.carSuspension = {
        light: {
            name: 'Light',
            costFactor: 0,
            hc: 1
        },
        standard: {
            name: 'Standard',
            costFactor: 1,
            hc: 2
        },
        heavy: {
            name: 'Heavy',
            costFactor: 1.5,
            hc: 3
        },
        off_road: {
            name: 'Off-Road',
            costFactor: 5,
            hc: 2,
            offRoad: true
        }
    };

    CW.carTire = {
        standard: {
            name: 'Standard',
            abbv: 'Std',
            cost: 50,
            weight: 30,
            dp: 4
        },
        hd: {
            name: 'Heavy-Duty',
            abbv: 'HD',
            cost: 100,
            weight: 40,
            dp: 6
        },
        pr: {
            name: 'Puncture-Resistant',
            abbv: 'PR',
            cost: 200,
            weight: 50,
            dp: 9
        },
        solid: {
            name: 'Solid',
            abbv: 'Sld',
            cost: 500,
            weight: 75,
            dp: 12
        },
        plasticore: {
            name: 'Plasticore',
            abbv: 'PC',
            cost: 1000,
            weight: 150,
            dp: 25
        }
    };

    CW.findGasEngine = function (name) {
        for (var e in CW.gasEngine) {
            if (CW.gasEngine.hasOwnProperty(e)) {
                if (CW.gasEngine[e].name === name) return CW.gasEngine[e];
            }
        }
        return null;
    };

    CW.gasEngine = {
        cid_10: {
            name: '10 cid',
            cost: 400,
            weight: 60,
            space: 1,
            dp: 1,
            powerFactors: 300,
            mpg: 80
        },
        cid_30: {
            name: '30 cid',
            cost: 750,
            weight: 115,
            space: 1,
            dp: 2,
            powerFactors: 500,
            mpg: 70
        },
        cid_50: {
            name: '50 cid',
            cost: 1250,
            weight: 150,
            space: 1,
            dp: 3,
            powerFactors: 700,
            mpg: 60
        },
        cid_100: {
            name: '100 cid',
            cost: 2500,
            weight: 265,
            space: 2,
            dp: 6,
            powerFactors: 1300,
            mpg: 50
        },
        cid_150: {
            name: '150 cid',
            cost: 4000,
            weight: 375,
            space: 3,
            dp: 9,
            powerFactors: 1900,
            mpg: 45
        },
        cid_200: {
            name: '200 cid',
            cost: 5500,
            weight: 480,
            space: 4,
            dp: 12,
            powerFactors: 2500,
            mpg: 35
        },
        cid_250: {
            name: '250 cid',
            cost: 6500,
            weight: 715,
            space: 5,
            dp: 14,
            powerFactors: 3200,
            mpg: 28
        },
        cid_300: {
            name: '300 cid',
            cost: 7800,
            weight: 825,
            space: 6,
            dp: 16,
            powerFactors: 4000,
            mpg: 22
        },
        cid_350: {
            name: '350 cid',
            cost: 9500,
            weight: 975,
            space: 7,
            dp: 19,
            powerFactors: 5000,
            mpg: 18
        },
        cid_400: {
            name: '400 cid',
            cost: 10500,
            weight: 1050,
            space: 8,
            dp: 22,
            powerFactors: 6300,
            mpg: 15
        },
        cid_450: {
            name: '450 cid',
            cost: 11700,
            weight: 1125,
            space: 9,
            dp: 24,
            powerFactors: 7800,
            mpg: 13
        },
        cid_500: {
            name: '500 cid',
            cost: 13000,
            weight: 1200,
            space: 10,
            dp: 26,
            powerFactors: 9500,
            mpg: 12
        },
        cid_700: {
            name: '700 cid',
            cost: 19000,
            weight: 1275,
            space: 14,
            dp: 30,
            powerFactors: 13000,
            mpg: 10
        }
    };

    CW.carPowerPlant = {
        small: {
            name: 'Small',
            cost: 500,
            weight: 500,
            space: 3,
            dp: 5,
            powerFactors: 800
        },
        medium: {
            name: 'Medium',
            cost: 1000,
            weight: 700,
            space: 4,
            dp: 8,
            powerFactors: 1400
        },
        large: {
            name: 'Large',
            cost: 2000,
            weight: 900,
            space: 5,
            dp: 10,
            powerFactors: 2000
        },
        supr: {
            name: 'Super',
            cost: 3000,
            weight: 1100,
            space: 6,
            dp: 12,
            powerFactors: 2600
        },
        sport: {
            name: 'Sport',
            cost: 6000,
            weight: 1000,
            space: 6,
            dp: 12,
            powerFactors: 3000
        },
        thundercat: {
            name: 'Thundercat',
            cost: 12000,
            weight: 2000,
            space: 8,
            dp: 15,
            powerFactors: 6700
        }
    };

    CW.truckPowerPlant = {
        small: {
            name: 'Small',
            cost: 8000,
            weight: 2500,
            space: 8,
            dp: 16,
            maxLoad: 15000,
            truck: true
        },
        medium: {
            name: 'Medium',
            cost: 10000,
            weight: 2800,
            space: 9,
            dp: 18,
            maxLoad: 20000,
            truck: true
        },
        regular: {
            name: 'Regular',
            cost: 15000,
            weight: 3000,
            space: 10,
            dp: 20,
            maxLoad: 40000,
            truck: true
        },
        large: {
            name: 'Large',
            cost: 20000,
            weight: 3500,
            space: 13,
            dp: 26,
            maxLoad: 60000,
            truck: true
        },
        super: {
            name: 'Super',
            cost: 25000,
            weight: 4000,
            space: 16,
            dp: 32,
            maxLoad: 80000,
            truck: true
        }
    };

    CW.truckEngine = {
        small: {
            name: 'Small',
            cost: 12000,
            weight: 1500,
            space: 6,
            dp: 18,
            maxLoad: 18000,
            mpg: 12,
            truck: true
        },
        medium: {
            name: 'Medium',
            cost: 18000,
            weight: 3000,
            space: 8,
            dp: 24,
            maxLoad: 25000,
            mpg: 10,
            truck: true
        },
        large: {
            name: 'Large',
            cost: 27500,
            weight: 4000,
            space: 12,
            dp: 32,
            maxLoad: 60000,
            mpg: 8,
            truck: true
        },
        super: {
            name: 'Super',
            cost: 35000,
            weight: 6500,
            space: 14,
            dp: 38,
            maxLoad: 90000,
            mpg: 5,
            truck: true
        }
    };

    CW.gasTank = {
        economy: {
            name: 'Economy',
            costPerGallon: 2,
            weightPerGallon: 1,
            dp: 2
        },
        heavy_duty: {
            name: 'Heavy-Duty',
            costPerGallon: 5,
            weightPerGallon: 2,
            dp: 4
        },
        racing: {
            name: 'Racing',
            costPerGallon: 10,
            weightPerGallon: 5,
            dp: 4
        },
        duelling: {
            name: 'Duelling',
            costPerGallon: 25,
            weightPerGallon: 10,
            dp: 8
        }
    };

    CW.armor = {
        plastic: {
            name: 'Plastic',
            costFactor: 1,
            weightFactor: 1
        },
        lr: {
            name: 'Laser-Reflective Plastic',
            costFactor: 1.1,
            weightFactor: 1.1,
            repairFactor: 2
        },
        fireproof: {
            name: 'Fireproof Plastic',
            costFactor: 2,
            weightFactor: 1,
            repairFactor: 3
        },
        lrfp: {
            name: 'L-R Fireproof Plastic',
            costFactor: 2.5,
            weightFactor: 1.1,
            repairFactor: 4
        },
        radarproof: {
            name: 'Radarproof Plastic',
            costFactor: 2,
            weightFactor: 1
        },
        rpfp: {
            name: 'RP Fireproof Plastic',
            costFactor: 4,
            weightFactor: 1,
            repairFactor: 6
        },
        metal: {
            name: 'Metal',
            costFactor: 2.5,
            weightFactor: 5
        },
        lr_metal: {
            name: 'Laser-Reflective Metal',
            costFactor: 2.75,
            weightFactor: 5
        }
    };

    CW.turrets = {
        Turret: {
            name: 'Turret',
            abbv: 'Turret',
            armor: false,
            costBySize: [750, 1000, 1500, 2500, 3500],
            weightBySize: [75, 150, 200, 300, 400],
            spaceBySize: [1, 1, 2, 2, 2],
            smallest: 0,
            techLevel: 'Classic'
        },
        Sponson_Turret: {
            name: 'Sponson Turret',
            abbv: 'Sponson',
            armor: false,
            costBySize: [0, 750, 1125, 1875, 2625],
            weightBySize: [0, 75, 100, 150, 200],
            spaceBySize: [0, 1, 2, 2, 2],
            smallest: 1,
            techLevel: 'UACFH'
        },
        Pop_Up_Turret: {
            name: 'Pop-Up Turret',
            abbv: 'Turret',
            armor: false,
            costBySize: [1750, 2000, 2500, 3500, 4500],
            weightBySize: [150, 300, 350, 450, 600],
            spaceBySize: [1, 3, 4, 5, 6],
            smallest: 0,
            techLevel: 'Classic'
        },
        Cupola: {
            name: 'Cupola',
            abbv: 'Cupola',
            armor: false,
            costBySize: [0, 0, 0, 3500, 5500],
            weightBySize: [0, 0, 0, 400, 500],
            spaceBySize: [0, 0, 0, 2, 2],
            smallest: 3,
            techLevel: 'CWC'
        },
        Pop_Up_Cupola: {
            name: 'Pop-Up Cupola',
            abbv: 'Cupola',
            armor: false,
            costBySize: [0, 0, 0, 4500, 6500],
            weightBySize: [0, 0, 0, 600, 750],
            spaceBySize: [0, 0, 0, 5, 6],
            smallest: 3,
            techLevel: 'CWC'
        },
        Rocket_Platform: {
            name: 'Rocket Platform',
            abbv: 'RP',
            armor: false,
            costBySize: [0, 75, 100, 150, 0],
            weightBySize: [0, 50, 100, 200, 0],
            spaceBySize: [0, 0, 0, 0, 0],
            smallest: 1,
            techLevel: 'CWC'
        },
        EWP: {
            name: 'EWP',
            abbv: 'EWP',
            armor: true,
            costBySize: [0, 500, 1000, 2000, 3000],
            weightBySize: [0, 150, 250, 400, 600],
            spaceBySize: [0, 0, 0, 0, 0],
            smallest: 1,
            techLevel: 'CWC'
        },
        Rocket_EWP: {
            name: 'Rocket EWP',
            abbv: 'REWP',
            armor: false,
            costBySize: [0, 250, 500, 1000, 1500],
            weightBySize: [0, 75, 125, 200, 300],
            spaceBySize: [0, 0, 0, 0, 0],
            smallest: 1,
            techLevel: 'CWC'
        },
        Pintle_Mount: {
            name: 'Pintle Mount',
            abbv: 'P.Mnt',
            armor: true,
            costBySize: [0, 150, 300, 0, 0],
            weightBySize: [0, 20, 40, 0, 0],
            spaceBySize: [0, 0, 0, 0, 0],
            smallest: 1,
            techLevel: 'CWC'
        }
    };

    CW.hitches = {
        Light: {
            name: 'Light Hitch',
            cost: 250,
            weight: 10,
            loadWeight: 2000,
            dp: 1
        },
        Standard: {
            name: 'Standard Hitch',
            cost: 350,
            weight: 20,
            loadWeight: 6000,
            dp: 1
        },
        Heavy: {
            name: 'Heavy Hitch',
            cost: 500,
            weight: 30,
            loadWeight: 12000,
            dp: 2
        },
        Extra_Heavy: {
            name: 'Extra-Heavy Hitch',
            cost: 650,
            weight: 40,
            loadWeight: 20000,
            dp: 3
        }
    };

    CW.grenades = [
        {
            name: 'Explosive',
            abbv: 'Explosive',
            costFormula: '+0',
            weightFormula: '+0',
            costPerShot: 25.0,
            weightPerShot: 4.0,
            mixInMagazine: true,
            damage: '1d',
            techLevel: 'Classic'
        },
        {
            name: 'Concussion',
            abbv: 'Concussion',
            costFormula: '+0',
            weightFormula: '+0',
            costPerShot: 40.0,
            weightPerShot: 4.0,
            mixInMagazine: true,
            damage: '1 hit',
            techLevel: 'Classic'
        },
        {
            name: 'Flechette',
            abbv: 'Flechette',
            costFormula: '+0',
            weightFormula: '+0',
            costPerShot: 20.0,
            weightPerShot: 4.0,
            mixInMagazine: true,
            damage: '1d',
            techLevel: 'Classic'
        },
        {
            name: 'Flaming Oil',
            abbv: 'Flaming Oil',
            costFormula: '+0',
            weightFormula: '+0',
            costPerShot: 75.0,
            weightPerShot: 4.0,
            mixInMagazine: true,
            damage: '1d-2',
            techLevel: 'Classic'
        },
        {
            name: 'Flash',
            abbv: 'Flash',
            costFormula: '+0',
            weightFormula: '+0',
            costPerShot: 150.0,
            weightPerShot: 4.0,
            mixInMagazine: true,
            damage: '0',
            techLevel: 'Classic'
        },
        {
            name: 'Foam',
            abbv: 'Foam',
            costFormula: '+0',
            weightFormula: '+0',
            costPerShot: 30.0,
            weightPerShot: 4.0,
            mixInMagazine: true,
            damage: '0',
            techLevel: 'Classic'
        },
        {
            name: 'Paint',
            abbv: 'Paint',
            costFormula: '+0',
            weightFormula: '+0',
            costPerShot: 20.0,
            weightPerShot: 4.0,
            mixInMagazine: true,
            damage: '0',
            techLevel: 'Classic'
        },
        {
            name: 'Smoke',
            abbv: 'Smoke',
            costFormula: '+0',
            weightFormula: '+0',
            costPerShot: 20.0,
            weightPerShot: 4.0,
            mixInMagazine: true,
            damage: '0',
            techLevel: 'Classic'
        },
        {
            name: 'Tear Gas',
            abbv: 'Tear Gas',
            costFormula: '+0',
            weightFormula: '+0',
            costPerShot: 30.0,
            weightPerShot: 4.0,
            mixInMagazine: true,
            damage: '0',
            techLevel: 'Classic'
        },
        {
            name: 'Thermite',
            abbv: 'Thermite',
            costFormula: '+0',
            weightFormula: '+0',
            costPerShot: 100.0,
            weightPerShot: 4.0,
            mixInMagazine: true,
            damage: '1d',
            fireModifier: 2,
            burnDuration: 1,
            techLevel: 'Classic'
        },
        {
            name: 'White Phosphorus',
            abbv: 'White Phosphorus',
            costFormula: '+0',
            weightFormula: '+0',
            costPerShot: 75.0,
            weightPerShot: 4.0,
            mixInMagazine: true,
            damage: '1d',
            fireModifier: 2,
            burnDuration: 1,
            techLevel: 'Classic'
        },
        {
            name: 'Hot Smoke',
            abbv: 'Hot Smoke',
            costFormula: '+0',
            weightFormula: '+0',
            costPerShot: 30.0,
            weightPerShot: 4.0,
            mixInMagazine: true,
            damage: '0',
            techLevel: 'UACFH'
        },
        {
            name: 'Chemical Laser',
            abbv: 'Chemical Laser',
            costFormula: '+0',
            weightFormula: '+0',
            costPerShot: 200.0,
            weightPerShot: 4.0,
            mixInMagazine: true,
            damage: '1d+1',
            techLevel: 'PYRAMID'
        },
        {
            name: 'HESH',
            abbv: 'HESH',
            costFormula: '+0',
            weightFormula: '+0',
            costPerShot: 40.0,
            weightPerShot: 4.0,
            mixInMagazine: true,
            damage: '2d',
            techLevel: 'PYRAMID'
        },
        {
            name: 'Net',
            abbv: 'Net',
            costFormula: '+0',
            weightFormula: '+0',
            costPerShot: 100.0,
            weightPerShot: 4.0,
            mixInMagazine: true,
            damage: '1d-5',
            techLevel: 'PYRAMID'
        },
        {
            name: 'Det-Cord Net',
            abbv: 'Det-Cord Net',
            costFormula: '+0',
            weightFormula: '+0',
            costPerShot: 200.0,
            weightPerShot: 4.0,
            mixInMagazine: true,
            damage: '1 hit',
            techLevel: 'PYRAMID'
        },
        {
            name: 'Fake',
            abbv: 'Fake',
            costFormula: '+0',
            weightFormula: '+0',
            costPerShot: 5.0,
            weightPerShot: 4.0,
            mixInMagazine: true,
            damage: '0',
            techLevel: 'Classic'
        }
    ];
    CW.autoGrenades = [];
    CW.handGrenades = {};
    (function () {
        var i, grenade;
        for (i = 0; i < CW.grenades.length; i++) {
            grenade = CW.create(CW.grenades[i]);
            grenade.name = grenade.name + " Grenade";
            grenade.abbv = grenade.name;
            grenade.cost = grenade.costPerShot;
            grenade.weight = 1;
            grenade.ge = 1;
            grenade.shots = 0;
            grenade.toHit = 9;
            grenade.damageType = 'Tires';
            grenade.category = "Grenades";
            CW.handGrenades[grenade.abbv] = grenade;
            CW.grenades[i].name = CW.grenades[i].name + " Grenades";
            CW.grenades[i].abbv = CW.grenades[i].name;
            CW.grenades[i].nameOnly = true;
            grenade = CW.create(CW.grenades[i]);
            grenade.costPerShot += 20;
            grenade.weightPerShot = 5;
            CW.autoGrenades.push(grenade);
        }
    })();


    CW.weapons = {
        LMG: {
            name: 'Light Machine Gun',
            category: 'Small Bore Projectile Weapons',
            abbv: 'LMG',
            cost: 850,
            weight: 100,
            space: 1.0,
            dp: 2,
            shots: 20,
            toHit: 7,
            techLevel: 'UACFH'
        },
        LMG_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 20.0,
                weightPerShot: 2.5,
                mixInMagazine: true,
                damage: '1d-1',
                techLevel: 'CWC'
            },
            {
                name: 'Anti-Personnel',
                abbv: 'Anti-Personnel',
                costPerShot: 100.0,
                weightPerShot: 2.5,
                mixInMagazine: true,
                damage: '1d-1',
                techLevel: 'CWC'
            },
            {
                name: 'Explosive',
                abbv: 'Explosive',
                costPerShot: 40.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '1d-1',
                techLevel: 'CWC'
            },
            {
                name: 'High-Density',
                abbv: 'High-Density',
                costPerShot: 40.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '1d',
                techLevel: 'CWC'
            },
            {
                name: 'Incendiary',
                abbv: 'Incendiary',
                costPerShot: 30.0,
                weightPerShot: 2.5,
                mixInMagazine: true,
                damage: '1d-1',
                fireModifier: 2,
                burnDuration: 1,
                techLevel: 'CWC'
            }
        ],
        MG: {
            name: 'Machine Gun',
            category: 'Small Bore Projectile Weapons',
            abbv: 'MG',
            cost: 1000,
            weight: 150,
            space: 1.0,
            dp: 3,
            shots: 20,
            toHit: 7,
            techLevel: 'Classic'
        },
        MG_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 25.0,
                weightPerShot: 2.5,
                mixInMagazine: true,
                damage: '1d',
                techLevel: 'Classic'
            },
            {
                name: 'Anti-Personnel',
                abbv: 'Anti-Personnel',
                costPerShot: 125.0,
                weightPerShot: 2.5,
                mixInMagazine: true,
                damage: '1d',
                techLevel: 'CWC'
            },
            {
                name: 'Explosive',
                abbv: 'Explosive',
                costPerShot: 50.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '1d',
                techLevel: 'CWC'
            },
            {
                name: 'High-Density',
                abbv: 'High-Density',
                costPerShot: 50.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '1d+1',
                techLevel: 'CWC'
            },
            {
                name: 'Incendiary',
                abbv: 'Incendiary',
                costPerShot: 37.5,
                weightPerShot: 2.5,
                mixInMagazine: true,
                damage: '1d',
                fireModifier: 2,
                burnDuration: 1,
                techLevel: 'CWC'
            }
        ],
        HMG: {
            name: 'Heavy Machine Gun',
            category: 'Small Bore Projectile Weapons',
            abbv: 'HMG',
            cost: 1500,
            weight: 250,
            space: 1.0,
            dp: 4,
            shots: 20,
            toHit: 7,
            techLevel: 'UACFH'
        },
        HMG_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 50.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '2d-2',
                techLevel: 'CWC'
            },
            {
                name: 'Anti-Personnel',
                abbv: 'Anti-Personnel',
                costPerShot: 250.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '2d-2',
                techLevel: 'CWC'
            },
            {
                name: 'Explosive',
                abbv: 'Explosive',
                costPerShot: 100.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                damage: '2d-2',
                techLevel: 'CWC'
            },
            {
                name: 'High-Density',
                abbv: 'High-Density',
                costPerShot: 100.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                damage: '2d',
                techLevel: 'CWC'
            },
            {
                name: 'Incendiary',
                abbv: 'Incendiary',
                costPerShot: 75.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '2d-2',
                fireModifier: 2,
                burnDuration: 1,
                techLevel: 'CWC'
            }
        ],
        VMG: {
            name: 'Vulcan Machine Gun',
            category: 'Small Bore Projectile Weapons',
            abbv: 'VMG',
            cost: 2000,
            weight: 350,
            space: 2.0,
            dp: 3,
            shots: 20,
            toHit: 6,
            techLevel: 'Classic'
        },
        VMG_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 35.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '2d',
                techLevel: 'Classic'
            },
            {
                name: 'Anti-Personnel',
                abbv: 'Anti-Personnel',
                costPerShot: 175.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '2d',
                techLevel: 'CWC'
            },
            {
                name: 'Explosive',
                abbv: 'Explosive',
                costPerShot: 70.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                damage: '2d',
                techLevel: 'CWC'
            },
            {
                name: 'High-Density',
                abbv: 'High-Density',
                costPerShot: 70.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                damage: '2d+2',
                techLevel: 'CWC'
            },
            {
                name: 'Incendiary',
                abbv: 'Incendiary',
                costPerShot: 52.5,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '2d',
                fireModifier: 2,
                burnDuration: 1,
                techLevel: 'CWC'
            }
        ],
        HVMG: {
            name: 'Heavy Vulcan Machine Gun',
            category: 'Small Bore Projectile Weapons',
            abbv: 'HVMG',
            cost: 7000,
            weight: 650,
            space: 3.0,
            dp: 5,
            shots: 10,
            toHit: 6,
            techLevel: 'UACFH'
        },
        HVMG_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 75.0,
                weightPerShot: 15.0,
                mixInMagazine: true,
                damage: '4d',
                techLevel: 'CWC'
            },
            {
                name: 'Anti-Personnel',
                abbv: 'Anti-Personnel',
                costPerShot: 375.0,
                weightPerShot: 15.0,
                mixInMagazine: true,
                damage: '4d',
                techLevel: 'CWC'
            },
            {
                name: 'Explosive',
                abbv: 'Explosive',
                costPerShot: 150.0,
                weightPerShot: 30.0,
                mixInMagazine: true,
                damage: '4d',
                techLevel: 'CWC'
            },
            {
                name: 'High-Density',
                abbv: 'High-Density',
                costPerShot: 150.0,
                weightPerShot: 30.0,
                mixInMagazine: true,
                damage: '4d+4',
                techLevel: 'CWC'
            },
            {
                name: 'Incendiary',
                abbv: 'Incendiary',
                costPerShot: 112.5,
                weightPerShot: 15.0,
                mixInMagazine: true,
                damage: '4d',
                fireModifier: 2,
                burnDuration: 1,
                techLevel: 'CWC'
            }
        ],
        FG: {
            name: 'Flechette Gun',
            category: 'Small Bore Projectile Weapons',
            abbv: 'FG',
            cost: 700,
            weight: 100,
            space: 1.0,
            dp: 2,
            shots: 20,
            toHit: 6,
            techLevel: 'CWC'
        },
        FG_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 10.0,
                weightPerShot: 2.5,
                mixInMagazine: true,
                damage: '1d+1',
                techLevel: 'CWC'
            }
        ],
        VS: {
            name: 'Vehicular Shotgun',
            category: 'Small Bore Projectile Weapons',
            abbv: 'VS',
            cost: 950,
            weight: 90,
            space: 1.0,
            dp: 2,
            shots: 10,
            toHit: 6,
            techLevel: 'CWC'
        },
        VS_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 5.0,
                weightPerShot: 1.0,
                mixInMagazine: true,
                damage: '2 hits',
                techLevel: 'CWC'
            }
        ],
        GG: {
            name: 'Gauss Gun',
            category: 'Small Bore Projectile Weapons',
            abbv: 'GG',
            cost: 10000,
            weight: 300,
            space: 2.0,
            dp: 3,
            shots: 10,
            toHit: 6,
            techLevel: 'CWC'
        },
        GG_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 50.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                damage: '3d',
                techLevel: 'CWC'
            }
        ],
        RR: {
            name: 'Recoilless Rifle',
            category: 'Small Bore Projectile Weapons',
            abbv: 'RR',
            cost: 1500,
            weight: 300,
            space: 2.0,
            dp: 4,
            shots: 10,
            toHit: 7,
            techLevel: 'Classic'
        },
        RR_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 35.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '2d',
                techLevel: 'Classic'
            },
            {
                name: 'HEAT',
                abbv: 'HEAT',
                costPerShot: 52.5,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '2d+2',
                techLevel: 'CWC'
            },
            {
                name: 'HESH',
                abbv: 'HESH',
                costPerShot: 52.5,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '2d',
                techLevel: 'CWC'
            }
        ],
        AC: {
            name: 'Autocannon',
            category: 'Small Bore Projectile Weapons',
            abbv: 'AC',
            cost: 6500,
            weight: 500,
            space: 3.0,
            dp: 4,
            shots: 10,
            toHit: 6,
            techLevel: 'Classic'
        },
        AC_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 75.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                damage: '3d',
                techLevel: 'Classic'
            },
            {
                name: 'High-Density',
                abbv: 'High-Density',
                costPerShot: 150.0,
                weightPerShot: 20.0,
                mixInMagazine: true,
                damage: '3d+3',
                techLevel: 'CWC'
            },
            {
                name: 'Incendiary',
                abbv: 'Incendiary',
                costPerShot: 112.5,
                weightPerShot: 10.0,
                mixInMagazine: true,
                damage: '3d',
                fireModifier: 2,
                burnDuration: 1,
                techLevel: 'CWC'
            },
            {
                name: 'DPU',
                abbv: 'DPU',
                costPerShot: 750.0,
                weightPerShot: 30.0,
                mixInMagazine: true,
                damage: '18',
                techLevel: 'UACFH',
                military: true
            }
        ],
        GC: {
            name: 'Gatling Cannon',
            category: 'Small Bore Projectile Weapons',
            abbv: 'GC',
            cost: 7000,
            weight: 750,
            space: 5.0,
            dp: 5,
            shots: 10,
            toHit: 6,
            techLevel: 'UACFH',
            military: true
        },
        GC_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 45.0,
                weightPerShot: 15.0,
                mixInMagazine: true,
                damage: '5d',
                techLevel: 'CWC'
            },
            {
                name: 'High-Density',
                abbv: 'High-Density',
                costPerShot: 90.0,
                weightPerShot: 30.0,
                mixInMagazine: true,
                damage: '5d+5',
                techLevel: 'CWC'
            },
            {
                name: 'Incendiary',
                abbv: 'Incendiary',
                costPerShot: 67.5,
                weightPerShot: 15.0,
                mixInMagazine: true,
                damage: '5d',
                fireModifier: 2,
                burnDuration: 1,
                techLevel: 'CWC'
            },
            {
                name: 'DPU',
                abbv: 'DPU',
                costPerShot: 450.0,
                weightPerShot: 45.0,
                mixInMagazine: true,
                damage: '30',
                techLevel: 'UACFH',
                military: true
            }
        ],
        SL: {
            name: 'Starshell Launcher',
            category: 'Large Bore Projectile Weapons',
            abbv: 'SL',
            cost: 500,
            weight: 100,
            space: 1.0,
            dp: 2,
            shots: 5,
            toHit: 0,
            techLevel: 'CWC'
        },
        SL_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 50.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            }
        ],
        SG: {
            name: 'Spike Gun',
            category: 'Large Bore Projectile Weapons',
            abbv: 'SG',
            cost: 750,
            weight: 150,
            space: 2.0,
            dp: 2,
            shots: 10,
            toHit: 7,
            techLevel: 'Classic'
        },
        SG_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 40.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                damage: '1d',
                techLevel: 'Classic'
            }
        ],
        GL: {
            name: 'Grenade Launcher',
            category: 'Large Bore Projectile Weapons',
            abbv: 'GL',
            cost: 1000,
            weight: 200,
            space: 2.0,
            dp: 2,
            shots: 10,
            toHit: 7,
            techLevel: 'Classic'
        },
        GL_ammo: CW.grenades,
        AGL: {
            name: 'Auto-Grenade Launcher',
            category: 'Large Bore Projectile Weapons',
            abbv: 'AGL',
            cost: 5000,
            weight: 250,
            space: 2.0,
            dp: 3,
            shots: 20,
            toHit: 7,
            techLevel: 'UACFH',
            military: true
        },
        AGL_ammo: CW.autoGrenades,
        ATG: {
            name: 'Anti-Tank Gun',
            category: 'Large Bore Projectile Weapons',
            abbv: 'ATG',
            cost: 2000,
            weight: 600,
            space: 3.0,
            dp: 5,
            shots: 10,
            toHit: 8,
            techLevel: 'Classic'
        },
        ATG_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 50.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                damage: '3d',
                techLevel: 'Classic'
            },
            {
                name: 'APFSDS',
                abbv: 'APFSDS',
                costPerShot: 100.0,
                weightPerShot: 15.0,
                mixInMagazine: false,
                damage: '3d+6',
                techLevel: 'CWC'
            },
            {
                name: 'HEAT',
                abbv: 'HEAT',
                costPerShot: 75.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                damage: '3d+3',
                techLevel: 'CWC'
            },
            {
                name: 'HESH',
                abbv: 'HESH',
                costPerShot: 75.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                damage: '3d',
                techLevel: 'CWC'
            },
            {
                name: 'DPU',
                abbv: 'DPU',
                costPerShot: 500.0,
                weightPerShot: 30.0,
                mixInMagazine: true,
                damage: '18',
                techLevel: 'UACFH',
                military: true
            }
        ],
        MF: {
            name: 'Mine Flinger',
            category: 'Large Bore Projectile Weapons',
            abbv: 'MF',
            cost: 2250,
            weight: 275,
            space: 3.0,
            dp: 3,
            shots: 5,
            toHit: 5,
            techLevel: 'CWC'
        },
        MF_ammo: [
            {
                name: 'Mines',
                abbv: 'Mines',
                costPerShot: 50.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '1d/2d',
                nameOnly: true,
                techLevel: 'CWC'
            },
            {
                name: 'Napalm Mines',
                abbv: 'Napalm Mines',
                costPerShot: 60.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '1d',
                fireModifier: 4,
                burnDuration: 3,
                nameOnly: true,
                techLevel: 'CWC'
            },
            {
                name: 'Beacon Mines',
                abbv: 'Beacon Mines',
                costPerShot: 200.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                nameOnly: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Smoke Mines',
                abbv: 'Smoke Mines',
                costPerShot: 45.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                nameOnly: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Hot Smoke Mines',
                abbv: 'Hot Smoke Mines',
                costPerShot: 55.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                nameOnly: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Paint Mines',
                abbv: 'Paint Mines',
                costPerShot: 45.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                nameOnly: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Tear Gas Mines',
                abbv: 'Tear Gas Mines',
                costPerShot: 65.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                nameOnly: true,
                damage: '0',
                techLevel: 'UACFH'
            }
        ],
        OG: {
            name: 'Oil Gun',
            category: 'Large Bore Projectile Weapons',
            abbv: 'OG',
            cost: 1000,
            weight: 250,
            space: 3.0,
            dp: 3,
            shots: 10,
            toHit: 5,
            techLevel: 'CWC'
        },
        OG_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 25.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Flaming Oil',
                abbv: 'Flaming Oil',
                costPerShot: 90.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '1d-2',
                fireModifier: 3,
                burnDuration: 2,
                techLevel: 'CWC'
            },
            {
                name: 'Ice',
                abbv: 'Ice',
                costPerShot: 40.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Sand',
                abbv: 'Sand',
                costPerShot: 10.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            }
        ],
        PG: {
            name: 'Paint Gun',
            category: 'Large Bore Projectile Weapons',
            abbv: 'PG',
            cost: 1000,
            weight: 250,
            space: 3.0,
            dp: 3,
            shots: 10,
            toHit: 5,
            techLevel: 'CWC'
        },
        PG_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 25.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Glow in the Dark',
                abbv: 'Glow in the Dark',
                costPerShot: 100.0,
                weightPerShot: 5.0,
                mixInMagazine: false,
                damage: '0',
                techLevel: 'CWC'
            }
        ],
        //    MC: {
        //        name: 'Magnetic Cannon',
        //        category: 'Large Bore Projectile Weapons',
        //        abbv: 'MC',
        //        cost: 250000,
        //        weight: 4000,
        //        space: 12.0,
        //        dp: 10,
        //        shots: 10,
        //        toHit: 7,
        //        techLevel: 'UACFH',
        //        military: true
        //    },
        //    MC_ammo: [
        //        {
        //            name: 'Normal',
        //            abbv: 'Normal',
        //            costPerShot: 100.0,
        //            weightPerShot: 10.0,
        //            mixInMagazine: true,
        //            damage: '13d+26',
        //            techLevel: 'CWC'
        //        }
        //    ],
        BC: {
            name: 'Blast Cannon',
            category: 'Large Bore Projectile Weapons',
            abbv: 'BC',
            cost: 4500,
            weight: 500,
            space: 4.0,
            dp: 5,
            shots: 10,
            toHit: 7,
            techLevel: 'CWC'
        },
        BC_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 100.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                damage: '4d',
                techLevel: 'CWC'
            },
            {
                name: 'HEAT',
                abbv: 'HEAT',
                costPerShot: 150.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                damage: '4d+4',
                techLevel: 'UACFH'
            },
            {
                name: 'HESH',
                abbv: 'HESH',
                costPerShot: 150.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                damage: '4d',
                techLevel: 'CWC'
            }
        ],
        HRR: {
            name: 'Heavy Recoilless Rifle',
            category: 'Large Bore Projectile Weapons',
            abbv: 'HRR',
            cost: 9000,
            weight: 1000,
            space: 8.0,
            dp: 9,
            shots: 10,
            toHit: 7,
            techLevel: 'UACFH',
            military: true
        },
        HRR_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 150.0,
                weightPerShot: 15.0,
                mixInMagazine: true,
                damage: '7d',
                techLevel: 'CWC'
            },
            {
                name: 'HEAT',
                abbv: 'HEAT',
                costPerShot: 225.0,
                weightPerShot: 15.0,
                mixInMagazine: true,
                damage: '7d+7',
                techLevel: 'CWC'
            },
            {
                name: 'HESH',
                abbv: 'HESH',
                costPerShot: 225.0,
                weightPerShot: 15.0,
                mixInMagazine: true,
                damage: '7d',
                techLevel: 'CWC'
            }
        ],
        RFTG: {
            name: 'Rapid Fire Tank Gun',
            category: 'Large Bore Projectile Weapons',
            abbv: 'RFTG',
            cost: 9500,
            weight: 900,
            space: 6.0,
            dp: 8,
            shots: 10,
            toHit: 6,
            techLevel: 'UACFH',
            military: true
        },
        RFTG_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 25.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                damage: '6d',
                techLevel: 'UACFH'
            },
            {
                name: 'APFSDS',
                abbv: 'APFSDS',
                costPerShot: 50.0,
                weightPerShot: 15.0,
                mixInMagazine: false,
                damage: '6d+12',
                techLevel: 'UACFH'
            },
            {
                name: 'HEAT',
                abbv: 'HEAT',
                costPerShot: 37.5,
                weightPerShot: 10.0,
                mixInMagazine: true,
                damage: '6d+6',
                techLevel: 'UACFH'
            },
            {
                name: 'HESH',
                abbv: 'HESH',
                costPerShot: 37.5,
                weightPerShot: 10.0,
                mixInMagazine: true,
                damage: '6d',
                techLevel: 'UACFH'
            },
            {
                name: 'DPU',
                abbv: 'DPU',
                costPerShot: 250.0,
                weightPerShot: 30.0,
                mixInMagazine: true,
                damage: '36',
                techLevel: 'UACFH',
                military: true
            }
        ],
        TG: {
            name: 'Tank Gun',
            category: 'Large Bore Projectile Weapons',
            abbv: 'TG',
            cost: 10000,
            weight: 1200,
            space: 10.0,
            dp: 10,
            shots: 10,
            toHit: 7,
            techLevel: 'CWC'
        },
        TG_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 100.0,
                weightPerShot: 20.0,
                mixInMagazine: true,
                damage: '8d',
                techLevel: 'CWC'
            },
            {
                name: 'APFSDS',
                abbv: 'APFSDS',
                costPerShot: 200.0,
                weightPerShot: 30.0,
                mixInMagazine: false,
                damage: '8d+16',
                techLevel: 'CWC'
            },
            {
                name: 'HEAT',
                abbv: 'HEAT',
                costPerShot: 150.0,
                weightPerShot: 20.0,
                mixInMagazine: true,
                damage: '8d+8',
                techLevel: 'CWC'
            },
            {
                name: 'HESH',
                abbv: 'HESH',
                costPerShot: 150.0,
                weightPerShot: 20.0,
                mixInMagazine: true,
                damage: '8d',
                techLevel: 'CWC'
            },
            {
                name: 'Beehive',
                abbv: 'Beehive',
                costPerShot: 200.0,
                weightPerShot: 30.0,
                mixInMagazine: true,
                techLevel: 'UACFH',
                damage: '4d',
                military: true
            },
            {
                name: 'DPU',
                abbv: 'DPU',
                costPerShot: 1000.0,
                weightPerShot: 60.0,
                mixInMagazine: true,
                techLevel: 'UACFH',
                damage: '48 hits',
                military: true
            }
        ],
        //    TG9: {
        //        name: 'Tank Gun 90mm',
        //        category: 'Large Bore Projectile Weapons',
        //        abbv: 'TG9',
        //        cost: 25000,
        //        weight: 1500,
        //        space: 12.0,
        //        dp: 15,
        //        shots: 10,
        //        toHit: 7,
        //        techLevel: 'EVERYTHING'
        //    },
        //    TG9_ammo: [
        //        {
        //            name: 'Normal',
        //            abbv: 'Normal',
        //            costPerShot: 150.0,
        //            weightPerShot: 35.0,
        //            mixInMagazine: true,
        //            techLevel: 'CWC'
        //        },
        //        {
        //            name: 'APFSDS',
        //            abbv: 'APFSDS',
        //            costPerShot: 300.0,
        //            weightPerShot: 52.5,
        //            mixInMagazine: false,
        //            techLevel: 'CWC'
        //        },
        //        {
        //            name: 'HEAT',
        //            abbv: 'HEAT',
        //            costPerShot: 225.0,
        //            weightPerShot: 35.0,
        //            mixInMagazine: true,
        //            techLevel: 'CWC'
        //        },
        //        {
        //            name: 'HESH',
        //            abbv: 'HESH',
        //            costPerShot: 225.0,
        //            weightPerShot: 35.0,
        //            mixInMagazine: true,
        //            techLevel: 'CWC'
        //        },
        //        {
        //            name: 'Beehive',
        //            abbv: 'Beehive',
        //            costPerShot: 300.0,
        //            weightPerShot: 52.5,
        //            mixInMagazine: true,
        //            techLevel: 'UACFH',
        //            military: true
        //        },
        //        {
        //            name: 'DPU',
        //            abbv: 'DPU',
        //            costPerShot: 1500.0,
        //            weightPerShot: 105.0,
        //            mixInMagazine: true,
        //            techLevel: 'UACFH',
        //            military: true
        //        }
        //    ],
        //    TG10: {
        //        name: 'Tank Gun 105mm',
        //        category: 'Large Bore Projectile Weapons',
        //        abbv: 'TG10',
        //        cost: 50000,
        //        weight: 2000,
        //        space: 14.0,
        //        dp: 20,
        //        shots: 5,
        //        toHit: 7,
        //        techLevel: 'EVERYTHING'
        //    },
        //    TG10_ammo: [
        //        {
        //            name: 'Normal',
        //            abbv: 'Normal',
        //            costPerShot: 500.0,
        //            weightPerShot: 70.0,
        //            mixInMagazine: true,
        //            techLevel: 'CWC'
        //        },
        //        {
        //            name: 'APFSDS',
        //            abbv: 'APFSDS',
        //            costPerShot: 1000.0,
        //            weightPerShot: 105.0,
        //            mixInMagazine: false,
        //            techLevel: 'CWC'
        //        },
        //        {
        //            name: 'HEAT',
        //            abbv: 'HEAT',
        //            costPerShot: 750.0,
        //            weightPerShot: 70.0,
        //            mixInMagazine: true,
        //            techLevel: 'CWC'
        //        },
        //        {
        //            name: 'HESH',
        //            abbv: 'HESH',
        //            costPerShot: 750.0,
        //            weightPerShot: 70.0,
        //            mixInMagazine: true,
        //            techLevel: 'CWC'
        //        },
        //        {
        //            name: 'Beehive',
        //            abbv: 'Beehive',
        //            costPerShot: 1000.0,
        //            weightPerShot: 105.0,
        //            mixInMagazine: true,
        //            techLevel: 'UACFH',
        //            military: true
        //        },
        //        {
        //            name: 'DPU',
        //            abbv: 'DPU',
        //            costPerShot: 5000.0,
        //            weightPerShot: 210.0,
        //            mixInMagazine: true,
        //            techLevel: 'UACFH',
        //            military: true
        //        }
        //    ],
        MNR: {
            name: 'Mini Rocket',
            category: 'Single-Shot Rockets',
            abbv: 'MNR',
            cost: 0,
            weight: 0,
            space: 0.3333,
            dp: 1,
            shots: 1,
            toHit: 9,
            techLevel: 'Classic'
        },
        MNR_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 50.0,
                weightPerShot: 20.0,
                mixInMagazine: true,
                damage: '1d-1',
                techLevel: 'Classic'
            },
            {
                name: 'Armor-Piercing',
                abbv: 'Armor-Piercing',
                costPerShot: 75.0,
                weightPerShot: 20.0,
                mixInMagazine: true,
                damage: '1d',
                techLevel: 'CWC'
            },
            {
                name: 'Incendiary',
                abbv: 'Incendiary',
                costPerShot: 100.0,
                weightPerShot: 30.0,
                mixInMagazine: true,
                damage: '1d',
                fireModifier: 1,
                burnDuration: 0,
                techLevel: 'CWC'
            },
            {
                name: 'Smoke',
                abbv: 'Smoke',
                costPerShot: 50.0,
                weightPerShot: 20.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Tear Gas',
                abbv: 'Tear Gas',
                costPerShot: 100.0,
                weightPerShot: 20.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Hot Smoke',
                abbv: 'Hot Smoke',
                costPerShot: 75.0,
                weightPerShot: 20.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Chaff',
                abbv: 'Chaff',
                costPerShot: 45.0,
                weightPerShot: 20.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Foam',
                abbv: 'Foam',
                costPerShot: 25.0,
                weightPerShot: 20.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            }
        ],
        LtR: {
            name: 'Light Rocket',
            category: 'Single-Shot Rockets',
            abbv: 'LtR',
            cost: 0,
            weight: 0,
            space: 0.5,
            dp: 1,
            shots: 1,
            toHit: 9,
            techLevel: 'Classic'
        },
        LtR_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 75.0,
                weightPerShot: 25.0,
                mixInMagazine: true,
                damage: '1d',
                techLevel: 'Classic'
            },
            {
                name: 'Armor-Piercing',
                abbv: 'Armor-Piercing',
                costPerShot: 112.5,
                weightPerShot: 25.0,
                mixInMagazine: true,
                damage: '1d+1',
                techLevel: 'CWC'
            },
            {
                name: 'Incendiary',
                abbv: 'Incendiary',
                costPerShot: 150.0,
                weightPerShot: 37.5,
                mixInMagazine: true,
                damage: '1d+1',
                fireModifier: 2,
                burnDuration: 1,
                techLevel: 'CWC'
            },
            {
                name: 'Smoke',
                abbv: 'Smoke',
                costPerShot: 75.0,
                weightPerShot: 25.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Tear Gas',
                abbv: 'Tear Gas',
                costPerShot: 150.0,
                weightPerShot: 25.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Hot Smoke',
                abbv: 'Hot Smoke',
                costPerShot: 112.5,
                weightPerShot: 25.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Chaff',
                abbv: 'Chaff',
                costPerShot: 70.0,
                weightPerShot: 25.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Foam',
                abbv: 'Foam',
                costPerShot: 37.5,
                weightPerShot: 25.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            }
        ],
        MR: {
            name: 'Medium Rocket',
            category: 'Single-Shot Rockets',
            abbv: 'MR',
            cost: 0,
            weight: 0,
            space: 1.0,
            dp: 2,
            shots: 1,
            toHit: 9,
            techLevel: 'Classic'
        },
        MR_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 140.0,
                weightPerShot: 50.0,
                mixInMagazine: true,
                damage: '2d',
                techLevel: 'Classic'
            },
            {
                name: 'Armor-Piercing',
                abbv: 'Armor-Piercing',
                costPerShot: 210.0,
                weightPerShot: 50.0,
                mixInMagazine: true,
                damage: '2d+2',
                techLevel: 'CWC'
            },
            {
                name: 'Incendiary',
                abbv: 'Incendiary',
                costPerShot: 280.0,
                weightPerShot: 75.0,
                mixInMagazine: true,
                damage: '2d+2',
                fireModifier: 3,
                burnDuration: 2,
                techLevel: 'CWC'
            },
            {
                name: 'Smoke',
                abbv: 'Smoke',
                costPerShot: 140.0,
                weightPerShot: 50.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Tear Gas',
                abbv: 'Tear Gas',
                costPerShot: 280.0,
                weightPerShot: 50.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Hot Smoke',
                abbv: 'Hot Smoke',
                costPerShot: 210.0,
                weightPerShot: 50.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Chaff',
                abbv: 'Chaff',
                costPerShot: 135.0,
                weightPerShot: 50.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Foam',
                abbv: 'Foam',
                costPerShot: 70.0,
                weightPerShot: 50.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            }
        ],
        HR: {
            name: 'Heavy Rocket',
            category: 'Single-Shot Rockets',
            abbv: 'HR',
            cost: 0,
            weight: 0,
            space: 1.0,
            dp: 2,
            shots: 1,
            toHit: 9,
            techLevel: 'Classic'
        },
        HR_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 200.0,
                weightPerShot: 100.0,
                mixInMagazine: true,
                damage: '3d',
                techLevel: 'Classic'
            },
            {
                name: 'Armor-Piercing',
                abbv: 'Armor-Piercing',
                costPerShot: 300.0,
                weightPerShot: 100.0,
                mixInMagazine: true,
                damage: '3d+3',
                techLevel: 'CWC'
            },
            {
                name: 'Incendiary',
                abbv: 'Incendiary',
                costPerShot: 400.0,
                weightPerShot: 150.0,
                mixInMagazine: true,
                damage: '3d+3',
                fireModifier: 4,
                burnDuration: 3,
                techLevel: 'CWC'
            },
            {
                name: 'Smoke',
                abbv: 'Smoke',
                costPerShot: 200.0,
                weightPerShot: 100.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Tear Gas',
                abbv: 'Tear Gas',
                costPerShot: 400.0,
                weightPerShot: 100.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Hot Smoke',
                abbv: 'Hot Smoke',
                costPerShot: 300.0,
                weightPerShot: 100.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Chaff',
                abbv: 'Chaff',
                costPerShot: 175.0,
                weightPerShot: 100.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Foam',
                abbv: 'Foam',
                costPerShot: 100.0,
                weightPerShot: 100.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            }
        ],
        SR: {
            name: 'Super Rocket',
            category: 'Single-Shot Rockets',
            abbv: 'SR',
            cost: 0,
            weight: 0,
            space: 1.0,
            dp: 2,
            shots: 1,
            toHit: 9,
            military: true,
            techLevel: 'UACFH'
        },
        SR_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 15000.0,
                weightPerShot: 150.0,
                mixInMagazine: true,
                damage: '9d',
                techLevel: 'UACFH'
            },
            {
                name: 'Armor-Piercing',
                abbv: 'Armor-Piercing',
                costPerShot: 22500.0,
                weightPerShot: 150.0,
                mixInMagazine: true,
                damage: '9d+9',
                techLevel: 'UACFH'
            },
            {
                name: 'Incendiary',
                abbv: 'Incendiary',
                costPerShot: 30000.0,
                weightPerShot: 225.0,
                mixInMagazine: true,
                damage: '9d+9',
                fireModifier: 6,
                burnDuration: 4,
                techLevel: 'UACFH'
            },
            {
                name: 'Smoke',
                abbv: 'Smoke',
                costPerShot: 15000.0,
                weightPerShot: 150.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Tear Gas',
                abbv: 'Tear Gas',
                costPerShot: 30000.0,
                weightPerShot: 150.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Hot Smoke',
                abbv: 'Hot Smoke',
                costPerShot: 22500.0,
                weightPerShot: 150.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Chaff',
                abbv: 'Chaff',
                costPerShot: 7500.0,
                weightPerShot: 150.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Foam',
                abbv: 'Foam',
                costPerShot: 7500.0,
                weightPerShot: 150.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            }
        ],
        APPR: {
            name: 'Anti-Power-Plant Rocket',
            category: 'Single-Shot Rockets',
            abbv: 'APPR',
            cost: 0,
            weight: 0,
            space: 1.0,
            dp: 1,
            shots: 1,
            toHit: 9,
            techLevel: 'CWC'
        },
        APPR_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 500.0,
                weightPerShot: 40.0,
                mixInMagazine: true,
                damage: '1d-1',
                techLevel: 'CWC'
            },
            {
                name: 'Armor-Piercing',
                abbv: 'Armor-Piercing',
                costPerShot: 750.0,
                weightPerShot: 40.0,
                mixInMagazine: true,
                damage: '1d',
                techLevel: 'CWC'
            }
        ],
        SAM: {
            name: 'Surface-to-Air Missile',
            category: 'Single-Shot Rockets',
            abbv: 'SAM',
            cost: 0,
            weight: 0,
            space: 1.0,
            dp: 3,
            shots: 1,
            toHit: 6,
            techLevel: 'CWC'
        },
        SAM_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 500.0,
                weightPerShot: 150.0,
                mixInMagazine: true,
                damage: '4d',
                techLevel: 'CWC'
            },
            {
                name: 'Armor-Piercing',
                abbv: 'Armor-Piercing',
                costPerShot: 750.0,
                weightPerShot: 150.0,
                mixInMagazine: true,
                damage: '4d+4',
                techLevel: 'CWC'
            },
            {
                name: 'Incendiary',
                abbv: 'Incendiary',
                costPerShot: 1000.0,
                weightPerShot: 225.0,
                mixInMagazine: true,
                damage: '4d+4',
                fireModifier: 4,
                burnDuration: 3,
                techLevel: 'CWC'
            },
            {
                name: 'Smoke',
                abbv: 'Smoke',
                costPerShot: 500.0,
                weightPerShot: 150.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Tear Gas',
                abbv: 'Tear Gas',
                costPerShot: 1000.0,
                weightPerShot: 150.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Hot Smoke',
                abbv: 'Hot Smoke',
                costPerShot: 750.0,
                weightPerShot: 150.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            }
        ],
        RGM: {
            name: 'Radar-Guided Missile',
            category: 'Single-Shot Rockets',
            abbv: 'RGM',
            cost: 0,
            weight: 0,
            space: 1.0,
            dp: 1,
            shots: 1,
            toHit: 7,
            techLevel: 'CWC'
        },
        RGM_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 3000.0,
                weightPerShot: 100.0,
                mixInMagazine: true,
                damage: '3d',
                techLevel: 'CWC'
            },
            {
                name: 'Armor-Piercing',
                abbv: 'Armor-Piercing',
                costPerShot: 4500.0,
                weightPerShot: 100.0,
                mixInMagazine: true,
                damage: '3d+3',
                techLevel: 'CWC'
            },
            {
                name: 'Incendiary',
                abbv: 'Incendiary',
                costPerShot: 6000.0,
                weightPerShot: 150.0,
                mixInMagazine: true,
                damage: '3d+3',
                fireModifier: 4,
                burnDuration: 3,
                techLevel: 'CWC'
            },
            {
                name: 'Smoke',
                abbv: 'Smoke',
                costPerShot: 3000.0,
                weightPerShot: 100.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Tear Gas',
                abbv: 'Tear Gas',
                costPerShot: 6000.0,
                weightPerShot: 100.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Hot Smoke',
                abbv: 'Hot Smoke',
                costPerShot: 4500.0,
                weightPerShot: 100.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Chaff',
                abbv: 'Chaff',
                costPerShot: 2975.0,
                weightPerShot: 100.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            }
        ],
        WGM: {
            name: 'Wire-Guided Missile',
            category: 'Single-Shot Rockets',
            abbv: 'WGM',
            cost: 0,
            weight: 0,
            space: 1.0,
            dp: 2,
            shots: 1,
            toHit: 6,
            techLevel: 'CWC'
        },
        WGM_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 2000.0,
                weightPerShot: 100.0,
                mixInMagazine: true,
                damage: '3d',
                techLevel: 'CWC'
            },
            {
                name: 'Armor-Piercing',
                abbv: 'Armor-Piercing',
                costPerShot: 3000.0,
                weightPerShot: 100.0,
                mixInMagazine: true,
                damage: '3d+3',
                techLevel: 'CWC'
            },
            {
                name: 'Incendiary',
                abbv: 'Incendiary',
                costPerShot: 4000.0,
                weightPerShot: 150.0,
                mixInMagazine: true,
                damage: '3d+3',
                fireModifier: 4,
                burnDuration: 3,
                techLevel: 'CWC'
            },
            {
                name: 'Smoke',
                abbv: 'Smoke',
                costPerShot: 2000.0,
                weightPerShot: 100.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Tear Gas',
                abbv: 'Tear Gas',
                costPerShot: 4000.0,
                weightPerShot: 100.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Hot Smoke',
                abbv: 'Hot Smoke',
                costPerShot: 3000.0,
                weightPerShot: 100.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Chaff',
                abbv: 'Chaff',
                costPerShot: 1975.0,
                weightPerShot: 100.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            }
        ],
        MFR: {
            name: 'Multi-Fire Rocket Pod',
            category: 'Rockets',
            abbv: 'MFR',
            cost: 0,
            weight: 0,
            space: 2.0,
            dp: 3,
            shots: 6,
            toHit: 9,
            techLevel: 'Classic'
        },
        MFR_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 75.0,
                weightPerShot: 25.0,
                mixInMagazine: true,
                damage: '1d',
                techLevel: 'Classic'
            },
            {
                name: 'Armor-Piercing',
                abbv: 'Armor-Piercing',
                costPerShot: 112.5,
                weightPerShot: 25.0,
                mixInMagazine: true,
                damage: '1d+1',
                techLevel: 'CWC'
            },
            {
                name: 'Incendiary',
                abbv: 'Incendiary',
                costPerShot: 150.0,
                weightPerShot: 37.5,
                mixInMagazine: true,
                damage: '1d+1',
                fireModifier: 0.5,
                burnDuration: 1,
                techLevel: 'CWC'
            },
            {
                name: 'Smoke',
                abbv: 'Smoke',
                costPerShot: 75.0,
                weightPerShot: 25.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Tear Gas',
                abbv: 'Tear Gas',
                costPerShot: 150.0,
                weightPerShot: 25.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Hot Smoke',
                abbv: 'Hot Smoke',
                costPerShot: 112.5,
                weightPerShot: 25.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Foam',
                abbv: 'Foam',
                costPerShot: 37.5,
                weightPerShot: 25.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            }
        ],
        MML: {
            name: 'Micromissile Launcher',
            category: 'Rockets',
            abbv: 'MML',
            cost: 750,
            weight: 100,
            space: 1.0,
            dp: 2,
            shots: 10,
            toHit: 8,
            techLevel: 'Classic'
        },
        MML_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 20.0,
                weightPerShot: 2.5,
                mixInMagazine: true,
                damage: '1d',
                techLevel: 'Classic'
            },
            {
                name: 'Armor-Piercing',
                abbv: 'Armor-Piercing',
                costPerShot: 30.0,
                weightPerShot: 2.5,
                mixInMagazine: true,
                damage: '1d+1',
                techLevel: 'CWC'
            },
            {
                name: 'Incendiary',
                abbv: 'Incendiary',
                costPerShot: 35.0,
                weightPerShot: 6.0,
                mixInMagazine: true,
                damage: '1d+1',
                fireModifier: 2,
                burnDuration: 1,
                techLevel: 'CWC'
            },
            {
                name: 'Smoke',
                abbv: 'Smoke',
                costPerShot: 20.0,
                weightPerShot: 2.5,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Tear Gas',
                abbv: 'Tear Gas',
                costPerShot: 40.0,
                weightPerShot: 2.5,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Hot Smoke',
                abbv: 'Hot Smoke',
                costPerShot: 30.0,
                weightPerShot: 2.5,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Chaff',
                abbv: 'Chaff',
                costPerShot: 15.0,
                weightPerShot: 2.5,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Foam',
                abbv: 'Foam',
                costPerShot: 10.0,
                weightPerShot: 2.5,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            }
        ],
        RL: {
            name: 'Rocket Launcher',
            category: 'Rockets',
            abbv: 'RL',
            cost: 1000,
            weight: 200,
            space: 2.0,
            dp: 2,
            shots: 10,
            toHit: 8,
            techLevel: 'Classic'
        },
        RL_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 35.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '2d',
                techLevel: 'Classic'
            },
            {
                name: 'Armor-Piercing',
                abbv: 'Armor-Piercing',
                costPerShot: 52.5,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '2d+2',
                techLevel: 'CWC'
            },
            {
                name: 'Incendiary',
                abbv: 'Incendiary',
                costPerShot: 60.0,
                weightPerShot: 11.0,
                mixInMagazine: false,
                damage: '2d+2',
                fireModifier: 3,
                burnDuration: 2,
                techLevel: 'CWC'
            },
            {
                name: 'Flare',
                abbv: 'Flare',
                costPerShot: 20.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Smoke',
                abbv: 'Smoke',
                costPerShot: 35.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Tear Gas',
                abbv: 'Tear Gas',
                costPerShot: 70.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Hot Smoke',
                abbv: 'Hot Smoke',
                costPerShot: 52.5,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Chaff',
                abbv: 'Chaff',
                costPerShot: 30.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Foam',
                abbv: 'Foam',
                costPerShot: 17.5,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            }
        ],
        VFRP: {
            name: 'Variable-Fire Rocket Pod',
            category: 'Rockets',
            abbv: 'VFRP',
            cost: 2000,
            weight: 200,
            space: 3.0,
            dp: 5,
            shots: 30,
            toHit: 9,
            techLevel: 'CWC'
        },
        VFRP_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 35.0,
                weightPerShot: 7.5,
                mixInMagazine: true,
                damage: '1d',
                techLevel: 'CWC'
            },
            {
                name: 'Armor-Piercing',
                abbv: 'Armor-Piercing',
                costPerShot: 52.5,
                weightPerShot: 7.5,
                mixInMagazine: true,
                damage: '1d+1',
                techLevel: 'CWC'
            },
            {
                name: 'Smoke',
                abbv: 'Smoke',
                costPerShot: 35.0,
                weightPerShot: 7.5,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Tear Gas',
                abbv: 'Tear Gas',
                costPerShot: 70.0,
                weightPerShot: 7.5,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Hot Smoke',
                abbv: 'Hot Smoke',
                costPerShot: 52.5,
                weightPerShot: 7.5,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Chaff',
                abbv: 'Chaff',
                costPerShot: 30.0,
                weightPerShot: 7.5,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Foam',
                abbv: 'Foam',
                costPerShot: 17.5,
                weightPerShot: 7.5,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            }
        ],
        MSL: {
            name: 'Missile Launcher',
            category: 'Rockets',
            abbv: 'MSL',
            cost: 20000,
            weight: 300,
            space: 3.0,
            dp: 4,
            shots: 1,
            toHit: 5,
            military: true,
            techLevel: 'UACFH'
        },
        MSL_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 5000,
                weightPerShot: 50,
                mixInMagazine: true,
                damage: '7d',
                techLevel: 'UACFH'
            },
            {
                name: 'Armor-Piercing',
                abbv: 'Armor-Piercing',
                costPerShot: 7500,
                weightPerShot: 50,
                mixInMagazine: true,
                damage: '7d+7',
                techLevel: 'UACFH'
            }
        ],
        TL: {
            name: 'Targeting Laser',
            category: 'Lasers',
            abbv: 'TL',
            cost: 1000,
            weight: 50,
            space: 0.0,
            dp: 1,
            shots: 0,
            toHit: 6,
            damage: '0',
            techLevel: 'CWC'
        },
        LL: {
            name: 'Light Laser',
            category: 'Lasers',
            abbv: 'LL',
            cost: 3000,
            weight: 200,
            space: 1.0,
            dp: 2,
            shots: 0,
            toHit: 6,
            damage: '1d',
            techLevel: 'Classic'
        },
        ML: {
            name: 'Medium Laser',
            category: 'Lasers',
            abbv: 'ML',
            cost: 5500,
            weight: 350,
            space: 2.0,
            dp: 2,
            shots: 0,
            toHit: 6,
            damage: '2d',
            fireModifier: 1,
            burnDuration: 0,
            techLevel: 'Classic'
        },
        L: {
            name: 'Laser',
            category: 'Lasers',
            abbv: 'L',
            cost: 8000,
            weight: 500,
            space: 2.0,
            dp: 2,
            shots: 0,
            toHit: 6,
            damage: '3d',
            fireModifier: 1,
            burnDuration: 0,
            techLevel: 'Classic'
        },
        TwL: {
            name: 'Twin Laser',
            category: 'Lasers',
            abbv: 'TwL',
            cost: 10000,
            weight: 750,
            space: 2.0,
            dp: 3,
            shots: 0,
            toHit: 6,
            damage: '2d+6',
            fireModifier: 1,
            burnDuration: 0,
            techLevel: 'CWC'
        },
        HL: {
            name: 'Heavy Laser',
            category: 'Lasers',
            abbv: 'HL',
            cost: 12000,
            weight: 1000,
            space: 3.0,
            dp: 2,
            shots: 0,
            toHit: 6,
            damage: '4d',
            fireModifier: 2,
            burnDuration: 0,
            techLevel: 'Classic'
        },
        XL: {
            name: 'X-Ray Laser',
            category: 'Lasers',
            abbv: 'XL',
            cost: 15000,
            weight: 750,
            space: 3.0,
            dp: 3,
            shots: 0,
            toHit: 7,
            damage: '4d',
            techLevel: 'CWC'
        },
        HXL: {
            name: 'Heavy X-Ray Laser',
            category: 'Lasers',
            abbv: 'HXL',
            cost: 20000,
            weight: 1500,
            space: 5.0,
            dp: 3,
            shots: 0,
            toHit: 7,
            damage: '5d',
            techLevel: 'CWC'
        },
        LFT: {
            name: 'Light Flamethrower',
            category: 'Flamethrowers',
            abbv: 'LFT',
            cost: 350,
            weight: 250,
            space: 1.0,
            dp: 1,
            shots: 10,
            toHit: 6,
            techLevel: 'CWC'
        },
        LFT_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 15.0,
                weightPerShot: 3.0,
                mixInMagazine: true,
                damage: '1d-2',
                fireModifier: 2,
                burnDuration: 3,
                techLevel: 'CWC'
            },
            {
                name: 'High-Temperature',
                abbv: 'High-Temperature',
                costPerShot: 60.0,
                weightPerShot: 4.5,
                mixInMagazine: false,
                damage: '1d',
                fireModifier: 3,
                burnDuration: 1,
                techLevel: 'CWC'
            }
        ],
        FT: {
            name: 'Flamethrower',
            category: 'Flamethrowers',
            abbv: 'FT',
            cost: 500,
            weight: 450,
            space: 2.0,
            dp: 2,
            shots: 10,
            toHit: 6,
            techLevel: 'Classic'
        },
        FT_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 25.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '1d',
                fireModifier: 4,
                burnDuration: 3,
                techLevel: 'Classic'
            },
            {
                name: 'High-Temperature',
                abbv: 'High-Temperature',
                costPerShot: 100.0,
                weightPerShot: 7.5,
                mixInMagazine: false,
                damage: '1d+2',
                fireModifier: 5,
                burnDuration: 1,
                techLevel: 'CWC'
            }
        ],
        HDFT: {
            name: 'Heavy-Duty Flamethrower',
            category: 'Flamethrowers',
            abbv: 'HDFT',
            cost: 1250,
            weight: 650,
            space: 3.0,
            dp: 3,
            shots: 10,
            toHit: 6,
            techLevel: 'CWC'
        },
        HDFT_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 50.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                damage: '2d',
                fireModifier: 5,
                burnDuration: 3,
                techLevel: 'CWC'
            },
            {
                name: 'High-Temperature',
                abbv: 'High-Temperature',
                costPerShot: 200.0,
                weightPerShot: 15.0,
                mixInMagazine: false,
                damage: '2d+4',
                fireModifier: 6,
                burnDuration: 1,
                techLevel: 'CWC'
            }
        ],
        SS: {
            name: 'Smokescreen',
            category: 'Dropped Gasses',
            abbv: 'SS',
            cost: 250,
            weight: 25,
            space: 1.0,
            dp: 4,
            shots: 10,
            toHit: 0,
            techLevel: 'Classic'
        },
        SS_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 10.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'Classic'
            },
            {
                name: 'Tear Gas',
                abbv: 'Tear Gas',
                costPerShot: 20.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Hot Smoke',
                abbv: 'Hot Smoke',
                costPerShot: 15.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            }
        ],
        PS: {
            name: 'Paint Spray',
            category: 'Dropped Gasses',
            abbv: 'PS',
            cost: 400,
            weight: 25,
            space: 1.0,
            dp: 2,
            shots: 25,
            toHit: 0,
            techLevel: 'Classic'
        },
        PS_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 10.0,
                weightPerShot: 2.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'Classic'
            },
            {
                name: 'Glow in the Dark',
                abbv: 'Glow in the Dark',
                costPerShot: 40.0,
                weightPerShot: 2.0,
                mixInMagazine: false,
                damage: '0',
                techLevel: 'CWC'
            }
        ],
        GS: {
            name: 'Gas Streamer',
            category: 'Dropped Gasses',
            abbv: 'GS',
            cost: 100,
            weight: 50,
            space: 1.0,
            dp: 1,
            shots: 2,
            toHit: 0,
            techLevel: 'CWC'
        },
        GS_ammo: [
            {
                name: 'Smoke',
                abbv: 'Smoke',
                costPerShot: 50.0,
                weightPerShot: 25.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Tear Gas',
                abbv: 'Tear Gas',
                costPerShot: 100.0,
                weightPerShot: 25.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Paint',
                abbv: 'Paint',
                costPerShot: 50.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Hot Smoke',
                abbv: 'Hot Smoke',
                costPerShot: 75.0,
                weightPerShot: 25.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Toxin Gas',
                abbv: 'Toxin Gas',
                costPerShot: 10000.0,
                weightPerShot: 25.0,
                mixInMagazine: true,
                military: true,
                damage: '0',
                techLevel: 'UACFH'
            }
        ],
        FCGS: {
            name: 'Flame Cloud Streamer',
            category: 'Dropped Gasses',
            abbv: 'FCGS',
            cost: 200,
            weight: 100,
            space: 2.0,
            dp: 1,
            shots: 2,
            toHit: 0,
            techLevel: 'CWC'
        },
        FCGS_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 300.0,
                weightPerShot: 25.0,
                mixInMagazine: true,
                damage: '1d-1',
                fireModifier: 3,
                burnDuration: 1,
                techLevel: 'CWC'
            }
        ],
        CBSS: {
            name: 'Cloud Bomb',
            category: 'Dropped Gasses',
            abbv: 'CBSS',
            cost: 0,
            weight: 0,
            space: 1.0,
            dp: 1,
            shots: 1,
            toHit: 6,
            techLevel: 'UACFH'
        },
        CBSS_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 1000.0,
                weightPerShot: 100.0,
                mixInMagazine: true,
                damage: '2d',
                techLevel: 'UACFH'
            }
        ],
        HDSS: {
            name: 'Heavy-Duty Smokescreen',
            category: 'Dropped Gasses',
            abbv: 'HDSS',
            cost: 500,
            weight: 50,
            space: 2.0,
            dp: 4,
            shots: 10,
            toHit: 0,
            techLevel: 'CWC'
        },
        HDSS_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 40.0,
                weightPerShot: 20.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Tear Gas',
                abbv: 'Tear Gas',
                costPerShot: 80.0,
                weightPerShot: 20.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Hot Smoke',
                abbv: 'Hot Smoke',
                costPerShot: 60.0,
                weightPerShot: 20.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            }
        ],
        HDPS: {
            name: 'Heavy-Duty Paint Spray',
            category: 'Dropped Gasses',
            abbv: 'HDPS',
            cost: 800,
            weight: 50,
            space: 2.0,
            dp: 3,
            shots: 10,
            toHit: 0,
            techLevel: 'CWC'
        },
        HDPS_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 40.0,
                weightPerShot: 8.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Glow in the Dark',
                abbv: 'Glow in the Dark',
                costPerShot: 160.0,
                weightPerShot: 8.0,
                mixInMagazine: false,
                damage: '0',
                techLevel: 'CWC'
            }
        ],
        FCE: {
            name: 'Flame Cloud Ejector',
            category: 'Dropped Gasses',
            abbv: 'FCE',
            cost: 500,
            weight: 50,
            space: 2.0,
            dp: 2, // CWC says 1 in charts but 2 in text, UACFH says 2 in both
            shots: 10,
            toHit: 0,
            techLevel: 'CWC'
        },
        FCE_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 60.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '1d-1',
                fireModifier: 3,
                burnDuration: 1,
                techLevel: 'CWC'
            }
        ],
        HDFCE: {
            name: 'Heavy-Duty Flame Cloud Ejector',
            category: 'Dropped Gasses',
            abbv: 'HDFCE',
            cost: 1000,
            weight: 100,
            space: 3.0,
            dp: 2,
            shots: 10,
            toHit: 0,
            techLevel: 'CWC'
        },
        HDFCE_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 240.0,
                weightPerShot: 20.0,
                mixInMagazine: true,
                damage: '1d-1',
                fireModifier: 3,
                burnDuration: 1,
                techLevel: 'CWC'
            }
        ],
        TXG: {
            name: 'Toxin Gas',
            category: 'Dropped Gasses',
            abbv: 'TXG',
            cost: 500,
            weight: 25,
            space: 1.0,
            dp: 3,
            shots: 10,
            toHit: 0,
            techLevel: 'UACFH',
            military: true
        },
        TXG_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 2000.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            }
        ],
        HDTXG: {
            name: 'Heavy-Duty Toxin Gas',
            category: 'Dropped Gasses',
            abbv: 'HDTXG',
            cost: 1000,
            weight: 50,
            space: 2.0,
            dp: 3,
            shots: 10,
            toHit: 0,
            techLevel: 'UACFH',
            military: true
        },
        HDTXG_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 8000.0,
                weightPerShot: 20.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'UACFH'
            }
        ],
        OJ: {
            name: 'Oil Jet',
            category: 'Dropped Liquids',
            abbv: 'OJ',
            cost: 250,
            weight: 25,
            space: 2.0,
            dp: 3,
            shots: 25,
            toHit: 0,
            techLevel: 'Classic'
        },
        OJ_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 10.0,
                weightPerShot: 2.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'Classic'
            },
            {
                name: 'Pyrophoric',
                abbv: 'Pyrophoric',
                costPerShot: 50.0,
                weightPerShot: 2.0,
                mixInMagazine: true,
                damage: '1d-2',
                fireModifier: 3,
                burnDuration: 2,
                techLevel: 'PYRAMID'
            }
        ],
        HDOJ: {
            name: 'Heavy-Duty Oil Jet',
            category: 'Dropped Liquids',
            abbv: 'HDOJ',
            cost: 500,
            weight: 50,
            space: 3.0,
            dp: 4,
            shots: 10,
            toHit: 0,
            techLevel: 'CWC'
        },
        HDOJ_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 40.0,
                weightPerShot: 8.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Pyrophoric',
                abbv: 'Pyrophoric',
                costPerShot: 200.0,
                weightPerShot: 8.0,
                mixInMagazine: true,
                damage: '1d-2',
                fireModifier: 3,
                burnDuration: 2,
                techLevel: 'PYRAMID'
            }
        ],
        FOJ: {
            name: 'Flaming Oil Jet',
            category: 'Dropped Liquids',
            abbv: 'FOJ',
            cost: 300,
            weight: 30,
            space: 2.0,
            dp: 3,
            shots: 25,
            toHit: 0,
            techLevel: 'Classic'
        },
        FOJ_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 35.0,
                weightPerShot: 2.0,
                mixInMagazine: true,
                damage: '1d-2',
                fireModifier: 3,
                burnDuration: 2,
                techLevel: 'Classic'
            },
            {
                name: 'High-Temperature',
                abbv: 'High-Temperature',
                costPerShot: 140.0,
                weightPerShot: 3.0,
                mixInMagazine: false,
                damage: '1d',
                fireModifier: 4,
                burnDuration: 1,
                techLevel: 'CWC'
            }
        ],
        HFOJ: {
            name: 'Heavy Flaming Oil Jet',
            category: 'Dropped Liquids',
            abbv: 'HFOJ',
            cost: 550,
            weight: 60,
            space: 3.0,
            dp: 4,
            shots: 10,
            toHit: 0,
            techLevel: 'CWC'
        },
        HFOJ_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 140.0,
                weightPerShot: 8.0,
                mixInMagazine: true,
                damage: '1d-2',
                fireModifier: 3,
                burnDuration: 2,
                techLevel: 'CWC'
            },
            {
                name: 'High-Temperature',
                abbv: 'High-Temperature',
                costPerShot: 560.0,
                weightPerShot: 12.0,
                mixInMagazine: false,
                damage: '1d',
                fireModifier: 4,
                burnDuration: 1,
                techLevel: 'CWC'
            }
        ],
        ID: {
            name: 'Ice Dropper',
            category: 'Dropped Liquids',
            abbv: 'ID',
            cost: 750,
            weight: 50,
            space: 2.0,
            dp: 3,
            shots: 25,
            toHit: 0,
            techLevel: 'CWC'
        },
        ID_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 20.0,
                weightPerShot: 2.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            }
        ],
        HDID: {
            name: 'Heavy-Duty Ice Dropper',
            category: 'Dropped Liquids',
            abbv: 'HDID',
            cost: 1000,
            weight: 100,
            space: 3.0,
            dp: 4,
            shots: 10,
            toHit: 0,
            techLevel: 'CWC'
        },
        HDID_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 100.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            }
        ],
        SfS: {
            name: 'Stickyfoam Sprayer',
            category: 'Dropped Liquids',
            abbv: 'SfS',
            cost: 750,
            weight: 25,
            space: 2.0,
            dp: 3,
            shots: 25,
            toHit: 0,
            techLevel: 'PYRAMID'
        },
        SfS_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 30.0,
                weightPerShot: 2.0,
                mixInMagazine: true,
                damage: '1 hit',
                techLevel: 'CWC'
            }
        ],
        CD: {
            name: 'Chaff Dispenser',
            category: 'Dropped Solids',
            abbv: 'CD',
            cost: 300,
            weight: 25,
            space: 1.0,
            dp: 2,
            shots: 10,
            toHit: 0,
            techLevel: 'CWC'
        },
        CD_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 10.0,
                weightPerShot: 2.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            }
        ],
        HDCD: {
            name: 'Heavy-Duty Chaff Dispenser',
            category: 'Dropped Solids',
            abbv: 'HDCD',
            cost: 600,
            weight: 50,
            space: 2.0,
            dp: 2,
            shots: 10,
            toHit: 0,
            techLevel: 'CWC'
        },
        HDCD_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 40.0,
                weightPerShot: 8.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'CWC'
            }
        ],
        SD: {
            name: 'Spikedropper',
            category: 'Dropped Solids',
            abbv: 'SD',
            cost: 100,
            weight: 25,
            space: 1.0,
            dp: 4,
            shots: 10,
            toHit: 0,
            techLevel: 'Classic'
        },
        SD_ammo: [
            {
                name: 'Spikes',
                abbv: 'Spikes',
                costPerShot: 20.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                nameOnly: true,
                damage: '1d*',
                techLevel: 'Classic'
            },
            {
                name: 'Explosive Spikes',
                abbv: 'Explosive Spikes',
                costPerShot: 50.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                nameOnly: true,
                damage: '1d+1*',
                techLevel: 'CWC'
            },
            {
                name: 'Incendiary Spikes',
                abbv: 'Incendiary Spikes',
                costPerShot: 50.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                nameOnly: true,
                fireModifier: 2,
                burnDuration: 2,
                damage: '1d-1',
                techLevel: 'UACFH'
            },
            {
                name: 'Catalytic Spikes',
                abbv: 'Catalytic Spikes',
                costFormula: '=60',
                weightFormula: '=5',
                costPerShot: 60.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                nameOnly: true,
                damage: '1d*',
                techLevel: 'PYRAMID'
            },
            {
                name: 'Crystal Spikes',
                abbv: 'Crystal Spikes',
                costPerShot: 30.0,
                weightPerShot: 5.0,
                nameOnly: true,
                mixInMagazine: true,
                damage: '1d',
                techLevel: 'PYRAMID'
            }
        ],
        DSP: {
            name: 'Drop Spike Plate',
            category: 'Dropped Solids',
            abbv: 'DSP',
            cost: 200,
            weight: 50,
            space: 1.0,
            dp: 4,
            shots: 0,
            toHit: 0,
            damage: '2d/1d',
            techLevel: 'CWC'
        },
        RDSP: {
            name: 'Radio-Controlled DSP',
            category: 'Dropped Solids',
            abbv: 'RDSP',
            cost: 400,
            weight: 50,
            space: 1.0,
            dp: 4,
            shots: 0,
            toHit: 0,
            damage: '2d/1d',
            techLevel: 'PYRAMID'
        },
        LDSP: {
            name: 'Large Drop Spike Plate',
            category: 'Dropped Solids',
            abbv: 'LDSP',
            cost: 350,
            weight: 100,
            space: 1.0,
            dp: 6,
            shots: 0,
            toHit: 0,
            damage: '2d/1d',
            techLevel: 'CWC'
        },
        RLDSP: {
            name: 'Large Radio-Controlled DSP',
            category: 'Dropped Solids',
            abbv: 'RLDSP',
            cost: 700,
            weight: 100,
            space: 1.0,
            dp: 6,
            shots: 0,
            toHit: 0,
            damage: '2d/1d',
            techLevel: 'PYRAMID'
        },
        JD: {
            name: 'Junk Dropper',
            category: 'Dropped Solids',
            abbv: 'JD',
            cost: 50,
            weight: 25,
            space: 1.0,
            dp: 4,
            shots: 10,
            toHit: 0,
            techLevel: 'CWC'
        },
        JD_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 0.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                damage: '1d-3',
                techLevel: 'CWC'
            },
            {
                name: 'Sand',
                abbv: 'Sand',
                costPerShot: 0.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                damage: '0',
                techLevel: 'PYRAMID'
            }
        ],
        MD: {
            name: 'Minedropper',
            category: 'Dropped Solids',
            abbv: 'MD',
            cost: 500,
            weight: 150,
            space: 2.0,
            dp: 2,
            shots: 10,
            toHit: 0,
            techLevel: 'Classic'
        },
        MD_ammo: [
            {
                name: 'Mines',
                abbv: 'Mines',
                costPerShot: 50.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                nameOnly: true,
                damage: '1d/2d',
                techLevel: 'Classic'
            },
            {
                name: 'Napalm Mines',
                abbv: 'Napalm Mines',
                costPerShot: 60.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                nameOnly: true,
                damage: '1d',
                fireModifier: 4,
                burnDuration: 3,
                techLevel: 'CWC'
            },
            {
                name: 'Beacon Mines',
                abbv: 'Beacon Mines',
                costPerShot: 200.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                nameOnly: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Anti-Ped. Mines',
                abbv: 'Anti-Ped. Mines',
                costPerShot: 25.0,
                weightPerShot: 3.0,
                mixInMagazine: true,
                nameOnly: true,
                damage: '2d/1d',
                techLevel: 'UACFH'
            },
            {
                name: 'Smoke Mines',
                abbv: 'Smoke Mines',
                costPerShot: 45.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                nameOnly: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Hot Smoke Mines',
                abbv: 'Hot Smoke Mines',
                costPerShot: 55.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                nameOnly: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Paint Mines',
                abbv: 'Paint Mines',
                costPerShot: 45.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                nameOnly: true,
                damage: '0',
                techLevel: 'UACFH'
            },
            {
                name: 'Tear Gas Mines',
                abbv: 'Tear Gas Mines',
                costPerShot: 65.0,
                weightPerShot: 5.0,
                mixInMagazine: true,
                nameOnly: true,
                damage: '0',
                techLevel: 'UACFH'
            }
        ],
        SMD: {
            name: 'Spear 1000 Minedropper',
            category: 'Dropped Solids',
            abbv: 'SMD',
            cost: 750,
            weight: 150,
            space: 2.0,
            dp: 2,
            shots: 5,
            toHit: 0,
            techLevel: 'Classic'
        },
        SMD_ammo: [
            {
                name: 'Mines',
                abbv: 'Mines',
                costPerShot: 100.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                nameOnly: true,
                damage: '1d-3/2d+3',
                techLevel: 'Classic'
            },
            {
                name: 'Napalm Mines',
                abbv: 'Napalm Mines',
                costPerShot: 150.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                nameOnly: true,
                damage: '1d/2d',
                fireModifier: 4,
                burnDuration: 3,
                techLevel: 'CWC'
            },
            {
                name: 'Spider Mines',
                abbv: 'Spider Mines',
                costPerShot: 150.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                nameOnly: true,
                damage: '1d/2d',
                techLevel: 'CWC'
            },
            {
                name: 'TDX Mines',
                abbv: 'TDX Mines',
                costPerShot: 100.0,
                weightPerShot: 10.0,
                mixInMagazine: true,
                nameOnly: true,
                damage: '1d+3/1d-1',
                techLevel: 'CWC'
            }
        ],
        ChD: {
            name: 'Chaff Discharger',
            category: 'Other Dischargers',
            abbv: 'ChD',
            cost: 50,
            weight: 5,
            space: 0.0,
            dp: 0,
            shots: 0,
            toHit: 0,
            damage: '0',
            techLevel: 'UACFH'
        },
        FOD: {
            name: 'Flaming Oil Discharger',
            category: 'Other Dischargers',
            abbv: 'FOD',
            cost: 100,
            weight: 5,
            space: 0.0,
            dp: 0,
            shots: 0,
            toHit: 0,
            damage: '1d-2',
            fireModifier: 3,
            burnDuration: 2,
            techLevel: 'CWC'
        },
        FD: {
            name: 'Flechette Discharger',
            category: 'Other Dischargers',
            abbv: 'FD',
            cost: 50,
            weight: 5,
            space: 0.0,
            dp: 0,
            shots: 0,
            toHit: 0,
            damage: '1d',
            techLevel: 'CWC'
        },
        FmD: {
            name: 'Foam Discharger',
            category: 'Other Dischargers',
            abbv: 'FmD',
            cost: 25,
            weight: 5,
            space: 0.0,
            dp: 0,
            shots: 0,
            toHit: 0,
            damage: '0',
            techLevel: 'UACFH'
        },
        IcD: {
            name: 'Ice Discharger',
            category: 'Other Dischargers',
            abbv: 'IcD',
            cost: 75,
            weight: 5,
            space: 0.0,
            dp: 0,
            shots: 0,
            toHit: 0,
            damage: '0',
            techLevel: 'CWC'
        },
        OD: {
            name: 'Oil Discharger',
            category: 'Other Dischargers',
            abbv: 'OD',
            cost: 50,
            weight: 5,
            space: 0.0,
            dp: 0,
            shots: 0,
            toHit: 0,
            damage: '0',
            techLevel: 'CWC'
        },
        PoD: {
            name: 'Pyrophoric Oil Discharger',
            category: 'Other Dischargers',
            abbv: 'PoD',
            cost: 250,
            weight: 5,
            space: 0.0,
            dp: 0,
            shots: 0,
            toHit: 0,
            damage: '1d-2',
            fireModifier: 3,
            burnDuration: 2,
            techLevel: 'PYRAMID'
        },
        PDG: {
            name: 'Point-Defense Grenade',
            category: 'Other Dischargers',
            abbv: 'PDG',
            cost: 150,
            weight: 5,
            space: 0.0,
            dp: 0,
            shots: 0,
            toHit: 0,
            damage: '1/2d',
            techLevel: 'CWC'
        },
        SaD: {
            name: 'Sand Discharger',
            category: 'Other Dischargers',
            abbv: 'SaD',
            cost: 25,
            weight: 5,
            space: 0.0,
            dp: 0,
            shots: 0,
            toHit: 0,
            damage: '0',
            techLevel: 'UACFH'
        },
        SfD: {
            name: 'Stickyfoam Discharger',
            category: 'Other Dischargers',
            abbv: 'SfD',
            cost: 75,
            weight: 5,
            space: 0.0,
            dp: 0,
            shots: 0,
            toHit: 0,
            damage: '1 hit',
            techLevel: 'PYRAMID'
        },
        FCD: {
            name: 'Flame Cloud Discharger',
            category: 'Gas Dischargers',
            abbv: 'FCD',
            cost: 150,
            weight: 5,
            space: 0.0,
            dp: 0,
            shots: 0,
            toHit: 0,
            damage: '1d-1',
            fireModifier: 3,
            burnDuration: 1,
            techLevel: 'CWC'
        },
        PD: {
            name: 'Paint Discharger',
            category: 'Gas Dischargers',
            abbv: 'PD',
            cost: 40,
            weight: 5,
            space: 0.0,
            dp: 0,
            shots: 0,
            toHit: 0,
            damage: '0',
            techLevel: 'CWC'
        },
        GPD: {
            name: 'Glow-in-the-Dark PD',
            category: 'Gas Dischargers',
            abbv: 'GPD',
            cost: 160,
            weight: 5,
            space: 0.0,
            dp: 0,
            shots: 0,
            toHit: 0,
            damage: '0',
            techLevel: 'UACFH'
        },
        SkD: {
            name: 'Smoke Discharger',
            category: 'Gas Dischargers',
            abbv: 'SkD',
            cost: 50,
            weight: 5,
            space: 0.0,
            dp: 0,
            shots: 0,
            toHit: 0,
            damage: '0',
            techLevel: 'CWC'
        },
        HsD: {
            name: 'Hot Smoke Discharger',
            category: 'Gas Dischargers',
            abbv: 'HsD',
            cost: 65,
            weight: 5,
            space: 0.0,
            dp: 0,
            shots: 0,
            toHit: 0,
            damage: '0',
            techLevel: 'UACFH'
        },
        TGD: {
            name: 'Tear Gas Discharger',
            category: 'Gas Dischargers',
            abbv: 'TGD',
            cost: 75,
            weight: 5,
            space: 0.0,
            dp: 0,
            shots: 0,
            toHit: 0,
            damage: '0',
            techLevel: 'CWC'
        },
        SLT: {
            name: 'Searchlight',
            category: 'Mounted Accessories',
            abbv: 'SLT',
            cost: 200,
            weight: 50,
            space: 1,
            dp: 1,
            shots: 0,
            toHit: 6,
            damage: '0',
            techLevel: 'Classic'
        },
        ASL: {
            name: 'Armored Searchlight',
            category: 'Mounted Accessories',
            abbv: 'ASL',
            cost: 500,
            weight: 75,
            space: 1,
            dp: 5,
            shots: 0,
            toHit: 6,
            damage: '0',
            techLevel: 'Classic'
        },
        VC: {
            name: 'Vehicular Camera',
            abbv: 'VC',
            category: 'Mounted Accessories',
            cost: 1500,
            weight: 25,
            space: 0.5,
            dp: 1,
            shots: 0,
            toHit: 0,
            damage: '0',
            techLevel: 'CWC'
        },
        LVC: {
            name: 'Large Vehicular Camera',
            abbv: 'LVC',
            category: 'Mounted Accessories',
            cost: 1700,
            weight: 25,
            space: 1,
            dp: 1,
            shots: 0,
            toHit: 0,
            damage: '0',
            techLevel: 'CWC'
        }
    };

    CW.accessories = {
        AMPHIBIOUS_MODIFICATIONS: {
            name: 'Amphibious Modifications',
            abbv: 'Amphibious',
            category: 'Body Mods',
            cost: 6000,
            weight: 200,
            space: 2,
            dp: 4,
            firingAction: true
        },
        ANTI_THEFT_SYSTEM: {
            name: 'Anti-Theft System',
            category: 'Security',
            cost: 1000,
            weight: 0,
            space: 0,
            dp: 0,
            linkable: true
        },
        ARMORED_BEER_REFRIGERATOR: {
            name: 'Armored Beer Refrigerator',
            abbv: 'A.B.Fridge',
            category: 'Recreational',
            cost: 250,
            weight: 50,
            space: 2,
            dp: 20,
            capacity: 60,
            cargo: true,
            linkable: false
        },
        ARMORED_MINIFRIDGE: {
            name: 'Armored Minifridge',
            abbv: 'A.M.Fridge',
            category: 'Recreational',
            cost: 100,
            weight: 30,
            space: 1,
            dp: 10,
            capacity: 24,
            cargo: true,
            linkable: false
        },
        ATAD: {
            name: 'ATAD',
            category: 'Combat & Weapons',
            cost: 5000,
            incrementalCost: 1000,
            weight: 0,
            space: 0,
            dp: 0,
            linkable: true,
            multiple: true
        },
        AUTOPILOT: {
            name: 'Autopilot',
            category: 'Electronics',
            cost: 9000,
            weight: 50,
            space: 0,
            dp: 0,
            linkable: false,
            destroyedWithPlant: true
        },
        AUTOPILOT_SOFTWARE: {
            name: 'Autopilot Software',
            category: 'Electronics',
            cost: 2500,
            weight: 0,
            space: 0,
            dp: 0,
            linkable: false
        },
        AUTOPILOT_GUNNER: {
            name: 'Autopilot Gunner Link',
            category: 'Electronics',
            cost: 500,
            weight: 0,
            space: 0,
            dp: 0,
            linkable: false
        },
        BOLLIX: {
            name: 'Bollix',
            abbv: 'Bollix',
            category: 'Sensors & Comm',
            cost: 5000,
            weight: 200,
            space: 2,
            dp: 1,
            linkable: true
        },
        BULK_AMMO_BOX: {
            name: 'Bulk Ammo Box',
            abbv: 'B.Ammo Box',
            category: 'Combat & Weapons',
            cost: 50,
            weight: 10,
            space: 1,
            dp: 5,
            linkable: false,
            cargo: true,
            multiple: true
        },
        HOLOCUBE: {
            name: 'Camera Holocube',
            category: 'Electronics',
            cost: 50,
            weight: 0,
            space: 0,
            dp: 0,
            linkable: false,
            multiple: true
        },
        CAMOUFLAGE_NETTING: {
            name: 'Camouflage Netting',
            category: 'Recreational',
            cost: 35,
            weight: 20,
            space: 0.5,
            dp: 0,
            cargo: true,
            linkable: false
        },
        ANTI_RADAR_NETTING: {
            name: 'Anti-Radar Netting',
            category: 'Sensors & Comm',
            cost: 105,
            weight: 60,
            space: 0.5,
            dp: 0,
            cargo: true,
            linkable: false
        },
        CAR_TOP_CARRIER_2: {
            name: '2-Space Car Top Carrier',
            category: 'Recreational',
            capacity: 2,
            cost: 100,
            weight: 50,
            space: 0,
            dp: 0,
            linkable: false
        },
        CAR_TOP_CARRIER_4: {
            name: '4-Space Car Top Carrier',
            category: 'Recreational',
            capacity: 4,
            cost: 200,
            weight: 100,
            space: 0,
            dp: 0,
            linkable: false
        },
        CAR_TOP_CARRIER_6: {
            name: '6-Space Car Top Carrier',
            category: 'Recreational',
            capacity: 6,
            cost: 400,
            weight: 150,
            space: 0,
            dp: 0,
            linkable: false
        },
        FAKE_CAR_TOP_CARRIER: {
            name: 'Fake Car Top Carrier w/E.B.',
            category: 'Recreational',
            cost: 100,
            weight: 17,
            space: 0,
            dp: 0,
            linkable: true
        },
        CARGO_SAFE: {
            name: 'Cargo Safe',
            abbv: 'Cargo Safe',
            category: 'Security',
            cost: 22000,
            weight: 12000,
            space: 15,
            dp: 0, // 100 armor per side
            cargo: true,
            linkable: false,
            capacity: 10
        },
        CARGO_SAFE_FRIDGE: {
            name: 'C.Safe Refrigerator',
            category: 'Security',
            cost: 2000,
            weight: 0,
            space: 0,
            dp: 0,
            cargo: true,
            linkable: false,
            safe: true
        },
        CARGO_SAFE_BREATHER: {
            name: 'C.Safe Rebreather',
            category: 'Security',
            cost: 4500,
            weight: 0,
            space: 0,
            dp: 0,
            cargo: true,
            linkable: false,
            safe: true
        },
        CARGO_SAFE_SELF_DESTRUCT: {
            name: 'C.Safe Self-Destruct',
            category: 'Security',
            cost: 900,
            weight: 0,
            space: 0,
            dp: 0,
            cargo: true,
            linkable: false,
            safe: true
        },
        COMPACT_TV: {
            name: 'Compact TV',
            category: 'Electronics',
            cost: 700,
            weight: 0,
            space: 0,
            dp: 0,
            linkable: false,
            techLevel: 'UACFH'
        },
        COMPUTER_GUNNER: {
            name: 'Computer Gunner',
            category: 'Combat & Weapons',
            cost: 6000,
            weight: 10,
            space: 0,
            dp: 0,
            linkable: true,
            destroyedWithPlant: true
        },
        COMPUTER_GUNNER_SOFTWARE: {
            name: 'Computer Gunner Software',
            category: 'Combat & Weapons',
            cost: 2500,
            weight: 0,
            space: 0,
            dp: 0,
            linkable: false
        },
        COMPUTER_NAVIGATOR: {
            name: 'Computer Navigator',
            category: 'Electronics',
            cost: 500,
            weight: 0,
            space: 0,
            dp: 0,
            linkable: false
        },
        COMPUTER_NAVIGATOR_MAP: {
            name: 'Computer Nav. Map Cube',
            category: 'Electronics',
            cost: 20,
            weight: 0,
            space: 0,
            dp: 0,
            multiple: true,
            linkable: false
        },
        DRAG_CHUTE: {
            name: 'Drag Chute',
            abbv: 'Drag Chute',
            category: 'Other',
            cost: 300,
            weight: 20,
            space: 1,
            dp: 1,
            linkable: true,
            techLevel: 'UACFH'
        },
        FP_DRAG_CHUTE: {
            name: 'Fireproof Drag Chute',
            abbv: 'FP D.Chute',
            category: 'Other',
            cost: 450,
            weight: 20,
            space: 1,
            dp: 1,
            linkable: true,
            techLevel: 'UACFH'
        },
        ERIS_TRANSMITTER: {
            name: 'ERIS Transmitter',
            category: 'Security',
            cost: 500,
            weight: 0,
            space: 0,
            dp: 0,
            linkable: false,
            multiple: true
        },
        ERIS_RECEIVER: {
            name: 'ERIS Receiver',
            category: 'Security',
            cost: 100,
            weight: 0,
            space: 0,
            dp: 0,
            linkable: false,
            destroyedWithPlant: true
        },
        FAKE_PASSENGER: {
            name: 'Fake Passenger',
            abbv: 'F.Pass',
            category: 'Recreational',
            cost: 50,
            weight: 25,
            space: 1,
            dp: 1,
            cargo: true,
            linkable: false,
            multiple: true
        },
        GALLEY: {
            name: 'Galley',
            category: 'Recreational',
            cost: 750,
            weight: 150,
            space: 2,
            dp: 0,
            linkable: false
        },
        MOTORIZED_FAKE_PASSENGER: {
            name: 'Moving Fake Passenger',
            abbv: 'M.F.Pass',
            category: 'Recreational',
            cost: 150,
            weight: 25,
            space: 1,
            dp: 1,
            cargo: true,
            linkable: false,
            multiple: true
        },
        IFF: {
            name: 'Identify Friend or Foe',
            category: 'Sensors & Comm',
            cost: 200,
            weight: 0,
            space: 0,
            dp: 0,
            linkable: false
        },
        INFRARED_SIGHTING_SYSTEM: {
            name: 'Infrared Sighting System',
            category: 'Sensors & Comm',
            cost: 4000,
            weight: 100,
            space: 1,
            dp: 0,
            linkable: false
        },
        LASER_REACTIVE_WEB: {
            name: 'Laser-Reactive Web',
            category: 'Combat & Weapons',
            cost: 100,
            weight: 0,
            space: 0,
            dp: 0,
            linkable: true,
            multiple: true
        },
        LONG_DISTANCE_RADIO: {
            name: 'Long-Distance Radio',
            category: 'Sensors & Comm',
            cost: 600,
            weight: 0,
            space: 0,
            dp: 0,
            linkable: false
        },
        SMALL_MINI_SAFE: {
            name: 'Mini-Safe (Small)',
            abbv: 'Mini-Safe',
            category: 'Security',
            cost: 150,
            weight: 20,
            space: 1,
            dp: 30,
            cargo: true,
            linkable: false,
            capacity: 0.5
        },
        LARGE_MINI_SAFE: {
            name: 'Mini-Safe (Large)',
            abbv: 'Mini-Safe',
            category: 'Security',
            cost: 700,
            weight: 150,
            space: 4,
            dp: 30,
            cargo: true,
            linkable: false,
            capacity: 2
        },
        NBC_SHIELDING: {
            name: 'N/B/C Shielding',
            category: 'Security',
            cost: 60000,
            weight: 50,
            space: 1,
            dp: 0,
            linkable: false
        },
        PASSENGER_ACCOMMODATIONS: {
            name: 'Pass. Accommodation',
            category: 'Recreational',
            cost: 500,
            weight: 100,
            space: 2,
            dp: 0,
            cargo: true,
            linkable: false,
            multiple: true
        },
        PORTABLE_EARTH_STATION: {
            name: 'Portable Earth Station',
            abbv: 'P.E.Station',
            category: 'Sensors & Comm',
            cost: 700,
            weight: 150,
            space: 2,
            dp: 1,
            linkable: true
        },
        PORTABLE_SHOP: {
            name: 'Portable Shop (4 cases)',
            abbv: 'P.Shop',
            category: 'Towing & Salvage',
            cost: 4000,
            weight: 300,
            space: 4,
            dp: 8,
            cargo: true,
            linkable: false,
            techLevel: 'Classic'
        },
        RADAR: {
            name: 'Radar',
            category: 'Sensors & Comm',
            cost: 2500,
            weight: 0,
            space: 0,
            dp: 0,
            linkable: false
        },
        LONG_RANGE_RADAR: {
            name: 'Long-Range Radar',
            category: 'Sensors & Comm',
            cost: 10000,
            weight: 100,
            space: 1,
            dp: 0,
            linkable: false
        },
        RADAR_DETECTOR: {
            name: 'Radar Detector',
            category: 'Sensors & Comm',
            cost: 300,
            weight: 0,
            space: 0,
            dp: 0,
            linkable: true
        },
        RADAR_JAMMER: {
            name: 'Radar Jammer',
            category: 'Sensors & Comm',
            cost: 3000,
            weight: 0,
            space: 0,
            dp: 0,
            linkable: true,
            destroyedWithPlant: true
        },
        ASSAULT_RAMP: {
            name: 'Assault Ramp',
            category: 'Body Mods',
            cost: 1000,
            weight: 100,
            space: 1,
            dp: 0,
            linkable: true
        },
        WHEEL_RAMP: {
            name: 'Wheel Ramps',
            category: 'Body Mods',
            cost: 300,
            weight: 200,
            space: 0,
            dp: 0,
            linkable: true
        },
        REMOTE_CONTROL_GUIDANCE_RECEIVER: {
            name: 'RC Guidance Receiver',
            category: 'Security',
            cost: 2000,
            weight: 0,
            space: 0,
            dp: 0,
            linkable: false,
            destroyedWithPlant: true
        },
        REMOTE_CONTROL_GUIDANCE_TRANSMITTER: {
            name: 'RC Transmitter',
            category: 'Security',
            cost: 2000,
            weight: 200,
            space: 3,
            dp: 0,
            linkable: false,
            multiple: true,
            destroyedWithPlant: true
        },
        SEARCHLIGHT: {
            name: 'Searchlight',
            abbv: 'S.Light',
            category: 'Sensors & Comm',
            cost: 200,
            weight: 50,
            space: 1,
            dp: 1,
            linkable: false,
            techLevel: 'Classic'
        },
        ARMORED_SEARCHLIGHT: {
            name: 'Armored Searchlight',
            abbv: 'S.Light',
            category: 'Sensors & Comm',
            cost: 500,
            weight: 75,
            space: 1,
            dp: 5,
            linkable: false,
            techLevel: 'Classic'
        },
        LEFT_SIDE_DOOR: {
            name: 'Left Side Door',
            category: 'Body Mods',
            cost: 1000,
            weight: 500,
            space: 0,
            dp: 0,
            linkable: true
        },
        RIGHT_SIDE_DOOR: {
            name: 'Right Side Door',
            category: 'Body Mods',
            cost: 1000,
            weight: 500,
            space: 0,
            dp: 0,
            linkable: true
        },
        SLEEPING_AREA: {
            name: 'Sleeping Area',
            category: 'Recreational',
            cost: 0,
            weight: 0,
            space: 3,
            dp: 0,
            linkable: false,
            multiple: true
        },
        SOLAR_PANEL: {
            name: 'Solar Panel',
            abbv: 'S.Panel',
            category: 'Electronics',
            cost: 1000,
            weight: 100,
            space: 2,
            dp: 1,
            linkable: true
        },
        SOUND_ENHANCEMENT: {
            name: 'Sound Enhancement',
            abbv: 'Sound Enh',
            category: 'Sensors & Comm',
            cost: 6000,
            weight: 150,
            space: 1,
            dp: 2,
            linkable: false
        },
        SOUND_SYSTEM: {
            name: 'Sound System',
            abbv: 'Sound Sys',
            category: 'Sensors & Comm',
            cost: 1000,
            weight: 100,
            space: 1,
            dp: 2,
            linkable: false
        },
        STEALTH_CAR: {
            name: 'Stealth',
            category: 'Sensors & Comm',
            cost: 6000,
            weight: 150,
            space: 1,
            dp: 0,
            vehicleType: 'Car',
            linkable: true
        },
        STEALTH_CYCLE: {
            name: 'Stealth',
            category: 'Sensors & Comm',
            cost: 3000,
            weight: 75,
            space: 1,
            dp: 0,
            vehicleType: 'Cycle',
            linkable: true
        },
        STEALTH_TRIKE: {
            name: 'Stealth',
            category: 'Sensors & Comm',
            cost: 3000,
            weight: 75,
            space: 1,
            dp: 0,
            vehicleType: 'Trike',
            linkable: true
        },
        SURGE_PROTECTOR: {
            name: 'Surge Protector',
            category: 'Electronics',
            cost: 250,
            weight: 0,
            space: 0,
            dp: 0,
            linkable: false
        },
        TINTED_WINDOWS: {
            name: 'Tinted Windows',
            category: 'Body Mods',
            cost: 500,
            weight: 0,
            space: 0,
            dp: 0,
            linkable: false
        },
        TOW_BAR: {
            name: 'Tow Bar',
            abbv: 'Tow Bar',
            category: 'Towing & Salvage',
            cost: 500,
            weight: 25,
            space: 1,
            dp: 2,
            cargo: true,
            linkable: false
        },
        VEHICULAR_COMPUTER: {
            name: 'Vehicular Computer',
            category: 'Electronics',
            cost: 4000,
            weight: 0,
            space: 0,
            dp: 0,
            linkable: false,
            destroyedWithPlant: true,
            techLevel: 'Classic'
        },
        WEAPON_TIMER: {
            name: 'Weapon Timer',
            category: 'Combat & Weapons',
            cost: 350,
            weight: 0,
            space: 0,
            dp: 0,
            linkable: true,
            multiple: true
        },
        WINCH: {
            name: 'Winch',
            abbv: 'Winch',
            category: 'Towing & Salvage',
            cost: 500,
            weight: 100,
            space: 1,
            dp: 1,
            linkable: false
        },
        // ITEMS WITH SPECIAL HANDLING AS THEY APPEAR ELSEWHERE NORMALLY
        LASER_BATTERY: {
            name: 'Laser Battery',
            abbv: 'Laser Battery',
            category: 'Combat & Weapons',
            cost: 500,
            weight: 100,
            space: 1,
            dp: 1,
            linkable: false,
            multiple: true,
            attachedToEngine: 'laserBatteries'
        },
        FIRE_EXTINGUISHER: {
            name: 'Fire Extinguisher',
            category: 'Combat & Weapons',
            cost: 300,
            weight: 150,
            space: 1,
            dp: 0,
            linkable: true,
            attachedToEngine: 'fireExtinguisher',
            opposite: 'improvedFireExtinguisher',
            techLevel: 'Classic'
        },
        IMPROVED_FIRE_EXTINGUISHER: {
            name: 'Improved Fire Extinguisher',
            category: 'Combat & Weapons',
            cost: 500,
            weight: 200,
            space: 1,
            dp: 0,
            linkable: true,
            attachedToEngine: 'improvedFireExtinguisher',
            opposite: 'fireExtinguisher',
            techLevel: 'Classic'
        },
        SEMI_TRAILER_EMERGENGY_PLATE: {
            name: 'Semi-Trailer Emergency Plate',
            abbv: 'STEP',
            category: 'Body Mods',
            cost: 1500,
            weight: 800,
            space: 2,
            dp: 8,
            linkable: false
        },
        // ONLY LISTED TO SUPPORT LEGACY DESIGNS TODO Remove once handled elsewhere; add migration to cw-import.js
        RETRACTABLE_WHEELGUARDS: {
            name: 'Retractable Wheelguards (Pair)',
            abbv: 'Retr. WG',
            category: 'Uncategorized',
            cost: 250,
            weight: 50,
            space: 1,
            dp: 0,
            linkable: true
        }
    };

    CW.personalGear = {
        BACKPACK: {
            name: 'Backpack',
            category: 'Backpacks',
            cost: 40,
            weight: 5,
            ge: 0
        },
        GAS_MASK: {
            name: 'Gas Mask',
            category: 'Other',
            cost: 30,
            weight: 3,
            ge: 1
        },
        IR_GOGGLES: {
            name: 'Infrared Goggles',
            category: 'Other',
            cost: 750,
            weight: 1,
            ge: 1,
            techLevel: 'CWC'
        },
        LI_GOGGLES: {
            name: 'Light Intensifier Goggles',
            category: 'Other',
            cost: 300,
            weight: 1,
            ge: 1
        },
        LI_GAS_MASK: {
            name: 'Light Intensifier Gas Mask',
            category: 'Other',
            cost: 400,
            weight: 3,
            ge: 1
        },
        LIMPET_MINE: {
            name: 'Limpet Mine',
            category: 'Explosives',
            cost: 60,
            weight: 2,
            ge: 1,
            multiple: true,
            techLevel: 'CWC'
        },
        MEDIKIT: {
            name: 'Medikit',
            category: 'Backpacks',
            cost: 1000,
            weight: 50,
            ge: 6
        },
        PORTABLE_MEDIKIT: {
            name: 'Portable Medikit',
            category: 'Backpacks',
            cost: 750,
            weight: 25,
            ge: 3
        },
        MINI_MECHANIC: {
            name: 'Mini-Mechanic',
            category: 'Other',
            cost: 50,
            weight: 1,
            ge: 1
        },
        PLASTIQUE: {
            name: 'Plastique Brick',
            category: 'Explosives',
            cost: 3000,
            weight: 5,
            ge: 1,
            multiple: true,
            techLevel: 'CWC'
        },
        SHAPED_PLASTIQUE: {
            name: 'Shaped Plastique Brick',
            category: 'Explosives',
            cost: 4500,
            weight: 5,
            ge: 1,
            multiple: true,
            techLevel: 'CWC'
        },
        TIMED_DETONATOR: {
            name: 'Timed Detonator',
            category: 'Explosives',
            cost: 50,
            weight: 0,
            ge: 0,
            multiple: true,
            techLevel: 'CWC'
        },
        REMOTE_DETONATOR: {
            name: 'Remote Detonator',
            category: 'Explosives',
            cost: 100,
            weight: 0,
            ge: 0,
            multiple: true,
            techLevel: 'CWC'
        },
        RADIO_DETONATOR: {
            name: 'Radio Detonator Control',
            category: 'Explosives',
            cost: 500,
            weight: 1,
            ge: 1,
            techLevel: 'CWC'
        },
        PLUNGER: {
            name: 'Plunger',
            category: 'Explosives',
            cost: 100,
            weight: 1,
            ge: 1,
            techLevel: 'CWC'
        },
        CONTACT_WIRE: {
            name: 'Contact Wire - 20" spool',
            category: 'Explosives',
            cost: 25,
            weight: 1,
            ge: 1,
            multiple: true,
            techLevel: 'CWC'
        },
        HANDHELD_CAMERA: {
            name: 'Handheld Camera',
            category: 'Other',
            cost: 400,
            weight: 0,
            ge: 0,
            techLevel: 'CWC'
        },
        HELMET_CAMERA: {
            name: 'Helmet Camera',
            category: 'Other',
            cost: 600,
            weight: 0,
            ge: 0,
            techLevel: 'CWC'
        },
        PORTABLE_FIELD_RADIO: {
            name: 'Portable Field Radio',
            category: 'Backpacks',
            cost: 500,
            weight: 15,
            ge: 3,
            techLevel: 'CWC'
        },
        PORTABLE_SEARCHLIGHT: {
            name: 'Portable Searchlight',
            category: 'Other',
            cost: 100,
            weight: 4,
            ge: 2,
            techLevel: 'CWC'
        },
        RIOT_SHIELD: {
            name: 'Riot Shield',
            category: 'Other',
            cost: 750,
            weight: 25,
            ge: 3,
            techLevel: 'CWC'
        },
        TINTED_GOGGLES: {
            name: 'Tinted Goggles',
            category: 'Other',
            cost: 20,
            weight: 1,
            ge: 0,
            techLevel: 'CWC'
        },
        TOOLKIT: {
            name: 'Tool Kit',
            category: 'Other',
            cost: 600,
            weight: 40,
            ge: 6
        },
        WALKIE_TALKIE: {
            name: 'Walkie-Talkie',
            category: 'Other',
            cost: 250,
            weight: 1,
            ge: 1
        }
    };

    CW.handWeapons = {
        AVR: {
            name: 'Anti-Vehicular Rifle',
            abbv: 'AVR',
            category: 'Rifles',
            cost: 600,
            weight: 25,
            ge: 3,
            shots: 10,
            toHit: 8,
            damageType: 'Full',
            techLevel: 'Classic'
        },
        AVR_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 5,
                weightPerShot: 0,
                damage: '1d',
                techLevel: 'Classic'
            }
        ],
        HAVR: {
            name: 'Heavy Anti-Vehicular Rifle',
            abbv: 'HAVR',
            category: 'Rifles',
            cost: 800,
            weight: 30,
            ge: 4,
            shots: 10,
            toHit: 8,
            damageType: 'Full',
            techLevel: 'Classic'
        },
        HAVR_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 10,
                weightPerShot: 0,
                damage: '1d+3',
                techLevel: 'Classic'
            }
        ],
        AR: {
            name: 'Assault Rifle',
            abbv: 'AR',
            category: 'Rifles',
            cost: 400,
            weight: 12,
            ge: 3,
            shots: 10,
            toHit: 7,
            damageType: 'Half',
            techLevel: 'Classic'
        },
        AR_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 15,
                weightPerShot: 0,
                damage: '1d+1',
                techLevel: 'Classic'
            },
            {
                name: 'Anti-Personnel',
                abbv: 'Anti-Personnel',
                costPerShot: 75,
                weightPerShot: 0,
                damage: '2d+2',
                techLevel: 'CWC'
            },
            {
                name: 'Hollow-Point',
                abbv: 'Hollow-Point',
                costPerShot: 30,
                weightPerShot: 0,
                damage: '1d+2',
                techLevel: 'CWC'
            }
        ],
        Bazooka: {
            name: 'Bazooka',
            abbv: 'Bazooka',
            category: 'Heavy Weapons',
            cost: 1500,
            weight: 20,
            ge: 4,
            shots: 1,
            toHit: 8,
            damageType: 'Full',
            techLevel: 'Classic'
        },
        Bazooka_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 10,
                weightPerShot: 2,
                damage: '3d',
                techLevel: 'Classic'
            }
        ],
        BwK: {
            name: 'Bowie Knife',
            abbv: 'BwK',
            category: 'Light Weapons',
            cost: 50,
            weight: 1,
            ge: 1,
            shots: 0,
            toHit: 8,
            damageType: 'Tires',
            damage: '1d-2',
            techLevel: 'Classic'
        },
        GP: {
            name: 'Gauss Pistol',
            abbv: 'GP',
            category: 'Light Weapons',
            cost: 500,
            weight: 2,
            ge: 1,
            shots: 20,
            toHit: 6,
            damageType: 'Tires',
            techLevel: 'Classic'
        },
        GP_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 5,
                weightPerShot: 0,
                damage: '1d-2',
                techLevel: 'Classic'
            }
        ],
        GR: {
            name: 'Gauss Rifle',
            abbv: 'GR',
            category: 'Rifles',
            cost: 1500,
            weight: 9,
            ge: 2,
            shots: 20,
            toHit: 6,
            damageType: 'Half',
            techLevel: 'Classic'
        },
        GR_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 15,
                weightPerShot: 0,
                damage: '1d',
                techLevel: 'Classic'
            }
        ],
        GL: {
            name: 'Grenade Launcher',
            abbv: 'GL',
            category: 'Launchers',
            cost: 300,
            weight: 11,
            ge: 2,
            shots: 5,
            toHit: 7,
            damageType: 'Tires',
            techLevel: 'Classic'
        },
        GL_ammo: CW.grenades,
        GS1: {
            name: 'Gyroslugger (1 barrel)',
            abbv: 'GS1',
            category: 'Launchers',
            cost: 1200,
            weight: 14,
            ge: 2,
            shots: 1,
            toHit: 8,
            damageType: 'Full',
            techLevel: 'CWC'
        },
        GS1_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 100,
                weightPerShot: 1,
                damage: '2d',
                techLevel: 'CWC'
            },
            {
                name: 'Armor-Piercing',
                abbv: 'AP',
                costPerShot: 150,
                weightPerShot: 1,
                damage: '2d+2',
                techLevel: 'CWC'
            },
            {
                name: 'HESH',
                abbv: 'HESH',
                costPerShot: 250,
                weightPerShot: 1,
                damage: '2d',
                techLevel: 'CWC'
            },
            {
                name: 'Incendiary',
                abbv: 'Incendiary',
                costPerShot: 300,
                weightPerShot: 1,
                damage: '1d',
                fireModifier: 2,
                burnDuration: 1,
                techLevel: 'CWC'
            },
            {
                name: 'Flare',
                abbv: 'Flare',
                costPerShot: 50,
                weightPerShot: 1,
                damage: '1/2d',
                fireModifier: 1,
                burnDuration: 0,
                techLevel: 'CWC'
            },
            {
                name: 'Smoke',
                abbv: 'Smoke',
                costPerShot: 50,
                weightPerShot: 1,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Paint',
                abbv: 'Paint',
                costPerShot: 100,
                weightPerShot: 1,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Hot Smoke',
                abbv: 'Hot Smoke',
                costPerShot: 75,
                weightPerShot: 1,
                damage: '0',
                techLevel: 'UACFH'
            }
        ],
        GS2: {
            name: 'Gyroslugger (2 barrels)',
            abbv: 'GS2',
            category: 'Launchers',
            cost: 1500,
            weight: 18,
            ge: 3,
            shots: 0,
            toHit: 0,
            damageType: 'Full',
            techLevel: 'CWC'
        },
        GS2_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 100,
                weightPerShot: 1,
                damage: '2d',
                techLevel: 'CWC'
            },
            {
                name: 'Armor-Piercing',
                abbv: 'AP',
                costPerShot: 150,
                weightPerShot: 1,
                damage: '2d+2',
                techLevel: 'CWC'
            },
            {
                name: 'HESH',
                abbv: 'HESH',
                costPerShot: 250,
                weightPerShot: 1,
                damage: '2d',
                techLevel: 'CWC'
            },
            {
                name: 'Incendiary',
                abbv: 'Incendiary',
                costPerShot: 300,
                weightPerShot: 1,
                damage: '1d',
                fireModifier: 2,
                burnDuration: 1,
                techLevel: 'CWC'
            },
            {
                name: 'Flare',
                abbv: 'Flare',
                costPerShot: 50,
                weightPerShot: 1,
                damage: '1/2d',
                fireModifier: 1,
                burnDuration: 0,
                techLevel: 'CWC'
            },
            {
                name: 'Smoke',
                abbv: 'Smoke',
                costPerShot: 50,
                weightPerShot: 1,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Paint',
                abbv: 'Paint',
                costPerShot: 100,
                weightPerShot: 1,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Hot Smoke',
                abbv: 'Hot Smoke',
                costPerShot: 50,
                weightPerShot: 1,
                damage: '0',
                techLevel: 'UACFH'
            }
        ],
        HP: {
            name: 'Heavy Pistol',
            abbv: 'HP',
            category: 'Light Weapons',
            cost: 100,
            weight: 3,
            ge: 1,
            shots: 8,
            toHit: 7,
            damageType: 'Tires',
            techLevel: 'Classic'
        },
        HP_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 1,
                weightPerShot: 0,
                damage: '2 hits',
                techLevel: 'Classic'
            },
            {
                name: 'Anti-Personnel',
                abbv: 'Anti-Personnel',
                costPerShot: 5,
                weightPerShot: 0,
                damage: '4 hits',
                techLevel: 'CWC'
            },
            {
                name: 'Hollow-Point',
                abbv: 'Hollow-Point',
                costPerShot: 2,
                weightPerShot: 0,
                damage: '3 hits',
                techLevel: 'CWC'
            }
        ],
        LR: {
            name: 'Laser Rifle',
            abbv: 'LR',
            category: 'Rifles',
            cost: 4500,
            weight: 10,
            ge: 2,
            shots: 2,
            toHit: 6,
            damageType: 'Full',
            techLevel: 'CWC'
        },
        LR_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 0,
                weightPerShot: 0,
                damage: '1d',
                techLevel: 'CWC'
            }
        ],
        LAW: {
            name: 'Light Anti-Tank Weapon',
            abbv: 'LAW',
            category: 'Heavy Weapons',
            cost: 500,
            weight: 20,
            ge: 2,
            shots: 0,
            toHit: 8,
            damage: '2d',
            damageType: 'Full',
            techLevel: 'Classic'
        },
        VLAW: {
            name: 'Very Light Anti-Tank Weapon',
            abbv: 'VLAW',
            category: 'Heavy Weapons',
            cost: 200,
            weight: 10,
            ge: 1,
            shots: 0,
            toHit: 8,
            damage: '1d',
            damageType: 'Full',
            techLevel: 'Classic'
        },
        LLAW: {
            name: 'Laser LAW',
            abbv: 'LLAW',
            category: 'Heavy Weapons',
            cost: 2000,
            weight: 25,
            ge: 3,
            shots: 0,
            toHit: 6,
            damage: '3d',
            damageType: 'Full',
            techLevel: 'CWC'
        },
        LVLAW: {
            name: 'Laser VLAW',
            abbv: 'LVLAW',
            category: 'Heavy Weapons',
            cost: 1500,
            weight: 18,
            ge: 2,
            shots: 0,
            toHit: 6,
            damage: '2d',
            damageType: 'Full',
            techLevel: 'CWC'
        },
        LP: {
            name: 'Light Pistol',
            abbv: 'LP',
            category: 'Light Weapons',
            cost: 75,
            weight: 1,
            ge: 1,
            shots: 8,
            toHit: 8,
            damageType: 'Tires',
            techLevel: 'Classic'
        },
        LP_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 1,
                weightPerShot: 0,
                damage: '1 hit',
                techLevel: 'Classic'
            },
            {
                name: 'Anti-Personnel',
                abbv: 'Anti-Personnel',
                costPerShot: 5,
                weightPerShot: 0,
                damage: '2 hits',
                techLevel: 'CWC'
            },
            {
                name: 'Hollow-Point',
                abbv: 'Hollow-Point',
                costPerShot: 2,
                weightPerShot: 0,
                damage: '2 hits',
                techLevel: 'CWC'
            }
        ],
        MP: {
            name: 'Machine Pistol',
            abbv: 'MP',
            category: 'Light Weapons',
            cost: 250,
            weight: 5,
            ge: 1,
            shots: 6,
            toHit: 7,
            damageType: 'Half',
            techLevel: 'Classic'
        },
        MP_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 12,
                weightPerShot: 0,
                damage: '1d-2',
                techLevel: 'Classic'
            },
            {
                name: 'Anti-Personnel',
                abbv: 'Anti-Personnel',
                costPerShot: 60,
                weightPerShot: 0,
                damage: '2d-4',
                techLevel: 'CWC'
            }
        ],
        PFT: {
            name: 'Portable Flamethrower',
            abbv: 'PFT',
            category: 'Heavy Weapons',
            cost: 750,
            weight: 50,
            ge: 5,
            shots: 5,
            toHit: 6,
            damageType: 'Tires',
            techLevel: 'CWC'
        },
        PFT_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 25,
                weightPerShot: 0,
                damage: '1d',
                fireModifier: 3,
                burnDuration: 2,
                techLevel: 'CWC'
            },
            {
                name: 'High-Temperature',
                abbv: 'High-Temperature',
                costPerShot: 100,
                weightPerShot: 0,
                damage: '1d+2',
                fireModifier: 4,
                burnDuration: 1,
                techLevel: 'CWC'
            }
        ],
        PMML: {
            name: 'Portable Micromissile Launcher',
            abbv: 'PMML',
            category: 'Heavy Weapons',
            cost: 900,
            weight: 30,
            ge: 5,
            shots: 8,
            toHit: 8,
            damageType: 'Full',
            techLevel: 'CWC'
        },
        PMML_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 30,
                weightPerShot: 0,
                damage: '1d',
                techLevel: 'CWC'
            },
            {
                name: 'Armor-Piercing',
                abbv: 'Armor-Piercing',
                costPerShot: 45,
                weightPerShot: 0,
                damage: '1d+1',
                techLevel: 'CWC'
            }
        ],
        MPRL: {
            name: 'Portable Rocket Launcher',
            abbv: 'MPRL',
            category: 'Heavy Weapons',
            cost: 800,
            weight: 35,
            ge: 6,
            shots: 4,
            toHit: 9,
            damageType: 'Full',
            techLevel: 'CWC'
        },
        MPRL_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 50,
                weightPerShot: 0,
                damage: '2d',
                techLevel: 'CWC'
            },
            {
                name: 'Armor-Piercing',
                abbv: 'Armor-Piercing',
                costPerShot: 75,
                weightPerShot: 0,
                damage: '2d+2',
                techLevel: 'CWC'
            }
        ],
        Rifle: {
            name: 'Rifle',
            abbv: 'Rifle',
            category: 'Rifles',
            cost: 120,
            weight: 10,
            ge: 2,
            shots: 20,
            toHit: 7,
            damageType: 'Tires',
            techLevel: 'Classic'
        },
        Rifle_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 1,
                weightPerShot: 0,
                damage: '3 hits',
                techLevel: 'Classic'
            },
            {
                name: 'Anti-Personnel',
                abbv: 'Anti-Personnel',
                costPerShot: 5,
                weightPerShot: 0,
                damage: '6 hits',
                techLevel: 'CWC'
            },
            {
                name: 'Hollow-Point',
                abbv: 'Hollow-Point',
                costPerShot: 2,
                weightPerShot: 0,
                damage: '4 hits',
                techLevel: 'CWC'
            }
        ],
        StG: {
            name: 'Shotgun',
            abbv: 'StG',
            category: 'Rifles',
            cost: 120,
            weight: 8,
            ge: 2,
            shots: 10,
            toHit: 6,
            damageType: 'Tires',
            techLevel: 'Classic'
        },
        StG_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 1,
                weightPerShot: 0,
                damage: '2 hits',
                techLevel: 'Classic'
            }
        ],
        DStG: {
            name: 'Double-Barreled Shotgun',
            abbv: 'DStG',
            category: 'Rifles',
            cost: 200,
            weight: 12,
            ge: 3,
            shots: 10,
            toHit: 6,
            damageType: 'Tires',
            techLevel: 'Classic'
        },
        DStG_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 1,
                weightPerShot: 0,
                damage: '2 hits',
                techLevel: 'Classic'
            }
        ],
        Stinger: {
            name: 'Stinger',
            abbv: 'Stinger',
            category: 'Heavy Weapons',
            cost: 1000,
            weight: 30,
            ge: 5,
            shots: 0,
            toHit: 7,
            damageType: 'Full',
            techLevel: 'CWC'
        },
        SMG: {
            name: 'Submachine Gun',
            abbv: 'SMG',
            category: 'Rifles',
            cost: 250,
            weight: 9,
            ge: 2,
            shots: 10,
            toHit: 6,
            damageType: 'Half',
            techLevel: 'Classic'
        },
        SMG_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 12,
                weightPerShot: 0,
                damage: '1d',
                techLevel: 'Classic'
            },
            {
                name: 'Anti-Personnel',
                abbv: 'Anti-Personnel',
                costPerShot: 60,
                weightPerShot: 0,
                damage: '2d',
                techLevel: 'CWC'
            },
            {
                name: 'Hollow-Point',
                abbv: 'Hollow-Point',
                costPerShot: 24,
                weightPerShot: 0,
                damage: '1d+1',
                techLevel: 'CWC'
            }
        ],
        URGL: {
            name: 'Under-Rifle Grenade Launcher',
            abbv: 'URGL',
            category: 'Launchers',
            cost: 200,
            weight: 8,
            ge: 1,
            shots: 1,
            toHit: 7,
            damageType: 'Tires',
            techLevel: 'CWC'
        },
        URGL_ammo: CW.grenades,
        URGS: {
            name: 'Under-Rifle Gyroslugger',
            abbv: 'URGS',
            category: 'Launchers',
            cost: 1200,
            weight: 8,
            ge: 1,
            shots: 1,
            toHit: 8,
            damageType: 'Full',
            techLevel: 'CWC'
        },
        URGS_ammo: [
            {
                name: 'Normal',
                abbv: 'Normal',
                costPerShot: 100,
                weightPerShot: 1,
                damage: '2d',
                techLevel: 'CWC'
            },
            {
                name: 'Armor-Piercing',
                abbv: 'AP',
                costPerShot: 150,
                weightPerShot: 1,
                damage: '2d+2',
                techLevel: 'CWC'
            },
            {
                name: 'HESH',
                abbv: 'HESH',
                costPerShot: 250,
                weightPerShot: 1,
                damage: '2d',
                techLevel: 'CWC'
            },
            {
                name: 'Incendiary',
                abbv: 'Incendiary',
                costPerShot: 300,
                weightPerShot: 1,
                damage: '1d',
                fireModifier: 2,
                burnDuration: 1,
                techLevel: 'CWC'
            },
            {
                name: 'Flare',
                abbv: 'Flare',
                costPerShot: 50,
                weightPerShot: 1,
                damage: '1/2d',
                fireModifier: 1,
                burnDuration: 0,
                techLevel: 'CWC'
            },
            {
                name: 'Smoke',
                abbv: 'Smoke',
                costPerShot: 50,
                weightPerShot: 1,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Paint',
                abbv: 'Paint',
                costPerShot: 100,
                weightPerShot: 1,
                damage: '0',
                techLevel: 'CWC'
            },
            {
                name: 'Hot Smoke',
                abbv: 'Hot Smoke',
                costPerShot: 50,
                weightPerShot: 1,
                damage: '0',
                techLevel: 'UACFH'
            }
        ]
    };
})();