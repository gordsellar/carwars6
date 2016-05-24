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

    CW.versionOfValidate = "$Revision: 1180 $";

    CW.validateClassic = function(car, errors) {
        var error = function(item) {errors.push(item+(/s$/.test(item) ? " are" : " is")+" not available with Classic technology");};
        if((car.type === 'Car' && car.body.racingFrame) || (car.type !== 'Car' && car.type !== 'Cycle' && car.type !== 'Trike'))
            errors.push("Cannot have a "+(car.type === 'Car' ? "Race Car" : car.type)+" with Classic technology");
        if(car.carbonAluminumFrame) error("CA Frame");
        if(car.streamlined) error("Streamlining");
        if(car.heavyDutyShocks) error("Heavy-Duty Shocks");
        if(car.heavyDutyBrakes) error("Heavy-Duty Brakes");
        if(car.heavyDutyTransmission) error("Heavy-Duty Transmission");
        if(car.overdrive) error("Overdrive");
        if(car.sloped) error("Sloped Armor");
        if(car.convertibleHardtop) error("Convertible Hardtop");
        if(car.sunroof) error("Sunroof");
        if(car.noPaintWindshield) error("No-Paint Windshield");
        if(car.stealthKoteLocations.length > 0) error("StealthKote");
        if(car.hitch) error("Hitches");
        if(car.personalEquipmentWeight) error("The alternate encumbrance system");
        if(car.boosters.length > 0) error("Rocket Boosters and Jump Jets");
        if(car.frontLeftWeapons.length > 0 || car.frontRightWeapons.length > 0 || car.backLeftWeapons.length > 0 ||
            car.backRightWeapons.length > 0) error("Corner-mounted weapons");
        if((car.frontWheelguards && car.frontWheelguards.fake) || (car.backWheelguards && car.backWheelguards.fake) ||
            (car.middleWheelguards && car.middleWheelguards.fake)) error("Fake Wheelguards");
        if(car.frontWheelhubs || car.middleWheelhubs || car.backWheelhubs) error("Armored Wheel Hubs");
        if(car.type !== 'Car' && car.type !== 'Cycle' && car.type !== 'Trike')
            errors.push("Only cars, cycles, and trikes are available with Classic technology");
        else if(car.body.racingFrame) error("Racing Bodies");
        var rp = /RP|Radarproof/;
        if((car.frontArmor && car.frontArmor.plasticType && rp.test(car.frontArmor.plasticType.name)) ||
            (car.backArmor && car.backArmor.plasticType && rp.test(car.backArmor.plasticType.name)) ||
            (car.leftArmor && car.leftArmor.plasticType && rp.test(car.leftArmor.plasticType.name)) ||
            (car.rightArmor && car.rightArmor.plasticType && rp.test(car.rightArmor.plasticType.name)) ||
            (car.topArmor && car.topArmor.plasticType && rp.test(car.topArmor.plasticType.name)) ||
            (car.underbodyArmor && car.underbodyArmor.plasticType && rp.test(car.underbodyArmor.plasticType.name)))
            error("Radarproof Armor");
    };

    CW.baseValidate = function (car, type, errors, engineError) {
        var i;
        var sideDischargerLimit = car.sideDischargerLimit();
        var plural = type === 'Bus' ? 'Buses' : type + "s";
        if(car.techLevel === 'Classic') CW.validateClassic(car, errors);
        if (car.spaceUsed-car.reservedSpace > car.modifiedSpaceAvailable) errors.push("Used " + Math.ceil(car.spaceUsed) + " spaces but only " + car.modifiedSpaceAvailable + " spaces available");
        if (car.weightUsed-car.reservedWeight-(car.type === 'TenWheeler' ? car.carrier.reservedWeight : 0) > car.modifiedMaxWeight && !engineError) errors.push("Design weighs " + car.weightUsed + " lbs. but chassis can only handle " + car.modifiedMaxWeight + " lbs.");
        if (car.sideTurret && car.sideTurret.name !== CW.turrets.EWP.name && car.sideTurret.name !== CW.turrets.Rocket_EWP.name && car.sideTurret.name !== CW.turrets.Sponson_Turret.name)
            errors.push("Side turret must be an EWP or Rocket EWP or Sponson");

        for (i = 0; i < car.crew.length; i++) {
            CW.validateCrew(errors, car.crew[i], car.techLevel, !car.personalEquipmentWeight);
        }
        for (i = 0; i < car.passengers.length; i++) {
            CW.validateCrew(errors, car.passengers[i], car.techLevel, !car.personalEquipmentWeight);
        }
        if (car.crewCompartmentCA) CW.validateCA(errors, car.crewCompartmentCA, car.techLevel);
        if (car.frontTires) CW.validateTire(errors, car.frontTires, car.techLevel);
        if (car.middleOrOuterTires) CW.validateTire(errors, car.middleOrOuterTires, car.techLevel);
        CW.validateTire(errors, car.backTires, car.techLevel);
        if (car.engine) {
            if (car.engine.electric && car.gasTank) errors.push("Cannot have a gas tank with an electric power plant");
            if (!car.engine.electric && !car.gasTank) errors.push("Must have a gas tank for a " + type + " with a gas engine");
            if (car.engine.electric) CW.validateElectricEngine(errors, car.engine, car.techLevel);
            else {
                CW.validateGasEngine(errors, car.engine, car.techLevel);
                if (car.gasTank) CW.validateGasTank(errors, car.gasTank, car.techLevel);
            }
            if (!car.engine.electric && car.engine.laserBatteries < 1) {
                for (i = 0; i < car.frontWeapons.length; i++) if (car.frontWeapons[i].isLaser() && car.frontWeapons[i].abbv !== 'TL' && !car.frontWeapons[i].fake)
                    errors.push(plural + " with gas engines cannot fire non-targeting lasers (" + car.frontWeapons[i].abbv + ") without a laser battery");
                for (i = 0; i < car.backWeapons.length; i++) if (car.backWeapons[i].isLaser() && car.backWeapons[i].abbv !== 'TL' && !car.backWeapons[i].fake)
                    errors.push(plural + " with gas engines cannot fire non-targeting lasers (" + car.backWeapons[i].abbv + ") without a laser battery");
                for (i = 0; i < car.leftWeapons.length; i++) if (car.leftWeapons[i].isLaser() && car.leftWeapons[i].abbv !== 'TL' && !car.leftWeapons[i].fake)
                    errors.push(plural + " with gas engines cannot fire non-targeting lasers (" + car.leftWeapons[i].abbv + ") without a laser battery");
                for (i = 0; i < car.rightWeapons.length; i++) if (car.rightWeapons[i].isLaser() && car.rightWeapons[i].abbv !== 'TL' && !car.rightWeapons[i].fake)
                    errors.push(plural + " with gas engines cannot fire non-targeting lasers (" + car.rightWeapons[i].abbv + ") without a laser battery");
                for (i = 0; i < car.topWeapons.length; i++) if (car.topWeapons[i].isLaser() && car.topWeapons[i].abbv !== 'TL' && !car.topWeapons[i].fake)
                    errors.push(plural + " with gas engines cannot fire non-targeting lasers (" + car.topWeapons[i].abbv + ") without a laser battery");
                for (i = 0; i < car.underbodyWeapons.length; i++) if (car.underbodyWeapons[i].isLaser() && car.underbodyWeapons[i].abbv !== 'TL' && !car.underbodyWeapons[i].fake)
                    errors.push(plural + " with gas engines cannot fire non-targeting lasers (" + car.underbodyWeapons[i].abbv + ") without a laser battery");
                if (car.topTurret)
                    for (i = 0; i < car.topTurret.weapons.length; i++) if (car.topTurret.weapons[i].isLaser() && car.topTurret.weapons[i].abbv !== 'TL' && !car.topTurret.weapons[i].fake)
                        errors.push(plural + " with gas engines cannot fire non-targeting lasers (" + car.topTurret.weapons[i].abbv + ") without a laser battery");
                if (car.sideTurret)
                    for (i = 0; i < car.sideTurret.weapons.length; i++) if (car.sideTurret.weapons[i].isLaser() && car.sideTurret.weapons[i].abbv !== 'TL' && !car.sideTurret.weapons[i].fake)
                        errors.push(plural + " with gas engines cannot fire non-targeting lasers (" + car.sideTurret.weapons[i].abbv + ") without a laser battery");
                if (car.isOversize()) {
                    for (i = 0; i < car.leftBackWeapons.length; i++) if (car.leftBackWeapons[i].isLaser() && car.leftBackWeapons[i].abbv !== 'TL' && !car.leftBackWeapons[i].fake)
                        errors.push(plural + " with gas engines cannot fire non-targeting lasers (" + car.leftBackWeapons[i].abbv + ") without a laser battery");
                    for (i = 0; i < car.rightBackWeapons.length; i++) if (car.rightBackWeapons[i].isLaser() && car.rightBackWeapons[i].abbv !== 'TL' && !car.rightBackWeapons[i].fake)
                        errors.push(plural + " with gas engines cannot fire non-targeting lasers (" + car.rightBackWeapons[i].abbv + ") without a laser battery");
                    for (i = 0; i < car.topBackWeapons.length; i++) if (car.topBackWeapons[i].isLaser() && car.topBackWeapons[i].abbv !== 'TL' && !car.topBackWeapons[i].fake)
                        errors.push(plural + " with gas engines cannot fire non-targeting lasers (" + car.topBackWeapons[i].abbv + ") without a laser battery");
                    for (i = 0; i < car.underbodyBackWeapons.length; i++) if (car.underbodyBackWeapons[i].isLaser() && car.underbodyBackWeapons[i].abbv !== 'TL' && !car.underbodyBackWeapons[i].fake)
                        errors.push(plural + " with gas engines cannot fire non-targeting lasers (" + car.underbodyBackWeapons[i].abbv + ") without a laser battery");
                    if (car.topBackTurret)
                        for (i = 0; i < car.topBackTurret.weapons.length; i++) if (car.topBackTurret.weapons[i].isLaser() && car.topBackTurret.weapons[i].abbv !== 'TL' && !car.topBackTurret.weapons[i].fake)
                            errors.push(plural + " with gas engines cannot fire non-targeting lasers (" + car.topBackTurret.weapons[i].abbv + ") without a laser battery");
                    if (car.sideBackTurret)
                        for (i = 0; i < car.sideBackTurret.weapons.length; i++) if (car.sideBackTurret.weapons[i].isLaser() && car.sideBackTurret.weapons[i].abbv !== 'TL' && !car.sideBackTurret.weapons[i].fake)
                            errors.push(plural + " with gas engines cannot fire non-targeting lasers (" + car.sideBackTurret.weapons[i].abbv + ") without a laser battery");
                }
            }
        } else {
            if (car.gasTank) errors.push("A " + type + " cannot have a gas tank");
        }

        var radarDetector = false;
        for (i = 0; i < car.accessories.length; i++) {
            if (car.accessories[i].name === 'Radar Detector') radarDetector = true;
        }
        var front = 0, back = 0, left = 0, right = 0, top = 0, underbody = 0, leftBack = 0, rightBack = 0, topBack = 0, underBack = 0;
        var cornerFL = 0, cornerFR = 0, cornerBR = 0, cornerBL = 0;
        var frontCA = 0, backCA = 0, rightCA = 0, leftCA = 0, topCA = 0, underbodyCA = 0, leftBackCA = 0, rightBackCA = 0, topBackCA = 0, underBackCA = 0;
        var frontDischarger = 0, backDischarger = 0, leftDischarger = 0, rightDischarger = 0, topDischarger = 0, underbodyDischarger = 0;
        for (i = 0; i < car.frontWeapons.length; i++) {
            CW.validateWeapon(errors, radarDetector, car.frontWeapons[i], car.techLevel);
            front += car.frontWeapons[i].totalSpace();
            if (car.frontWeapons[i].componentArmor) frontCA += 1;
            if (car.frontWeapons[i].isDischarger()) frontDischarger += car.frontWeapons[i].count;
        }
        for (i = 0; i < car.backWeapons.length; i++) {
            CW.validateWeapon(errors, radarDetector, car.backWeapons[i], car.techLevel);
            back += car.backWeapons[i].totalSpace();
            if (car.backWeapons[i].componentArmor) backCA += 1;
            if (car.backWeapons[i].isDischarger()) backDischarger += car.backWeapons[i].count;
        }
        for (i = 0; i < car.leftWeapons.length; i++) {
            CW.validateWeapon(errors, radarDetector, car.leftWeapons[i], car.techLevel);
            left += car.leftWeapons[i].totalSpace();
            if (car.leftWeapons[i].componentArmor) leftCA += 1;
            if (car.leftWeapons[i].isDischarger()) leftDischarger += car.leftWeapons[i].count;
        }
        for (i = 0; i < car.rightWeapons.length; i++) {
            CW.validateWeapon(errors, radarDetector, car.rightWeapons[i], car.techLevel);
            right += car.rightWeapons[i].totalSpace();
            if (car.rightWeapons[i].componentArmor) rightCA += 1;
            if (car.rightWeapons[i].isDischarger()) rightDischarger += car.rightWeapons[i].count;
        }
        for (i = 0; i < car.topWeapons.length; i++) {
            CW.validateWeapon(errors, radarDetector, car.topWeapons[i], car.techLevel);
            top += car.topWeapons[i].totalSpace();
            if (car.topWeapons[i].componentArmor) topCA += 1;
            if (car.topWeapons[i].isDischarger()) topDischarger += car.topWeapons[i].count;
        }
        for (i = 0; i < car.underbodyWeapons.length; i++) {
            CW.validateWeapon(errors, radarDetector, car.underbodyWeapons[i], car.techLevel);
            underbody += car.underbodyWeapons[i].totalSpace();
            if (car.underbodyWeapons[i].componentArmor) underbodyCA += 1;
            if (car.underbodyWeapons[i].isDischarger()) underbodyDischarger += car.underbodyWeapons[i].count;
        }
        for (i = 0; i < car.frontLeftWeapons.length; i++) {
            CW.validateWeapon(errors, radarDetector, car.frontLeftWeapons[i], car.techLevel);
            if (car.frontLeftWeapons[i].category.indexOf('Dropped') !== 0)
                errors.push("Only dropped weapons may be corner-mounted");
            cornerFL += car.frontLeftWeapons[i].totalSpace();
            if (car.frontLeftWeapons[i].componentArmor) errors.push("Corner-mounted weapons may not use component armor");
            if (car.frontLeftWeapons[i].isDischarger()) errors.push("Dischargers may not be corner-mounted");
        }
        for (i = 0; i < car.frontRightWeapons.length; i++) {
            CW.validateWeapon(errors, radarDetector, car.frontRightWeapons[i], car.techLevel);
            if (car.frontRightWeapons[i].category.indexOf('Dropped') !== 0)
                errors.push("Only dropped weapons may be corner-mounted");
            cornerFR += car.frontRightWeapons[i].totalSpace();
            if (car.frontRightWeapons[i].componentArmor) errors.push("Corner-mounted weapons may not use component armor");
            if (car.frontRightWeapons[i].isDischarger()) errors.push("Dischargers may not be corner-mounted");
        }
        for (i = 0; i < car.backLeftWeapons.length; i++) {
            CW.validateWeapon(errors, radarDetector, car.backLeftWeapons[i], car.techLevel);
            if (car.backLeftWeapons[i].category.indexOf('Dropped') !== 0)
                errors.push("Only dropped weapons may be corner-mounted");
            cornerBL += car.backLeftWeapons[i].totalSpace();
            if (car.backLeftWeapons[i].componentArmor) errors.push("Corner-mounted weapons may not use component armor");
            if (car.backLeftWeapons[i].isDischarger()) errors.push("Dischargers may not be corner-mounted");
        }
        for (i = 0; i < car.backRightWeapons.length; i++) {
            CW.validateWeapon(errors, radarDetector, car.backRightWeapons[i], car.techLevel);
            if (car.backRightWeapons[i].category.indexOf('Dropped') !== 0)
                errors.push("Only dropped weapons may be corner-mounted");
            cornerBR += car.backRightWeapons[i].totalSpace();
            if (car.backRightWeapons[i].componentArmor) errors.push("Corner-mounted weapons may not use component armor");
            if (car.backRightWeapons[i].isDischarger()) errors.push("Dischargers may not be corner-mounted");
        }
        if (car.isOversize()) {
            for (i = 0; i < car.leftBackWeapons.length; i++) {
                CW.validateWeapon(errors, radarDetector, car.leftBackWeapons[i], car.techLevel);
                leftBack += car.leftBackWeapons[i].totalSpace();
                if (car.leftBackWeapons[i].componentArmor) leftBackCA += 1;
                if (car.leftBackWeapons[i].isDischarger()) leftDischarger += car.leftBackWeapons[i].count;
            }
            for (i = 0; i < car.rightBackWeapons.length; i++) {
                CW.validateWeapon(errors, radarDetector, car.rightBackWeapons[i], car.techLevel);
                rightBack += car.rightBackWeapons[i].totalSpace();
                if (car.rightBackWeapons[i].componentArmor) rightBackCA += 1;
                if (car.rightBackWeapons[i].isDischarger()) rightDischarger += car.rightBackWeapons[i].count;
            }
            for (i = 0; i < car.topBackWeapons.length; i++) {
                CW.validateWeapon(errors, radarDetector, car.topBackWeapons[i], car.techLevel);
                topBack += car.topBackWeapons[i].totalSpace();
                if (car.topBackWeapons[i].componentArmor) topBackCA += 1;
                if (car.topBackWeapons[i].isDischarger()) topDischarger += car.topBackWeapons[i].count;
            }
            for (i = 0; i < car.underbodyBackWeapons.length; i++) {
                CW.validateWeapon(errors, radarDetector, car.underbodyBackWeapons[i], car.techLevel);
                underBack += car.underbodyBackWeapons[i].totalSpace();
                if (car.underbodyBackWeapons[i].componentArmor) underBackCA += 1;
                if (car.underbodyBackWeapons[i].isDischarger()) underbodyDischarger += car.underbodyBackWeapons[i].count;
            }
        }
        if (frontDischarger > 1 || backDischarger > 1)
            errors.push("This " + type + " may only mount one discharger on the front and back facings");
        if (leftDischarger > sideDischargerLimit || rightDischarger > sideDischargerLimit
            || topDischarger > sideDischargerLimit || underbodyDischarger > sideDischargerLimit)
            errors.push("This " + type + " may only mount " + sideDischargerLimit + " dischargers on the left, right, top, and underbody facings");
        for (i = 0; i < car.boosters.length; i++) {
            if (car.boosters[i].jumpJet) {
                if (car.boosters[i].bottomOrRearFacing) underbody += car.boosters[i].totalSpace();
                else top += car.boosters[i].totalSpace();
            } else {
                if (car.boosters[i].bottomOrRearFacing) back += car.boosters[i].totalSpace();
                else front += car.boosters[i].totalSpace();
            }
        }
        front += cornerFL + cornerFR;
        back += cornerBL + cornerBR;
        if (car.isOversize()) {
            rightBack += cornerBR;
            leftBack += cornerBL;
            right += cornerFR;
            left += cornerFL;
        } else {
            right += cornerBR + cornerFR;
            left += cornerBL + cornerFL;
        }
        var cornerLimit = car.cornerMountLimit();
        if (cornerBL > cornerLimit || cornerBR > cornerLimit || cornerFL > cornerLimit || cornerFR > cornerLimit)
            errors.push("Only " + cornerLimit + " spaces of weaponry may be corner-mounted");
        if (car.body.name === "Dragster" && front > 2)
            errors.push("Dragsters may only have 2 spaces of front-mounted weaponry");
        if (front > car.maxWeaponSpacesPerSide || back > car.maxWeaponSpacesPerSide || left > car.maxWeaponSpacesPerSide
            || right > car.maxWeaponSpacesPerSide || top > car.maxWeaponSpacesPerSide || underbody > car.maxWeaponSpacesPerSide
            || topBack > car.maxWeaponSpacesPerSide || underBack > car.maxWeaponSpacesPerSide
            || leftBack > car.maxWeaponSpacesPerSide || rightBack > car.maxWeaponSpacesPerSide)
            errors.push("No more than " + car.maxWeaponSpacesPerSide + " spaces of weapons and boosters are allowed per side");
        if (car.type === 'CarTrailer' && !/Flatbed/.test(car.body.name) && car.trailerStyle && car.trailerStyle.name === CW.carTrailerMods.dumper.name && (front + back + left + right + top + underbody) > Math.floor(car.modifiedSpaceAvailable / 6 + 0.0001))
            errors.push("A dumper cannot use more than 1/6 of its spaces for weapons");
        if (car.type === 'TenWheelerCarrier' && car.body.name === CW.tenWheelerCarrierBody.dumper.name && (left + right + front + back + top + underbody) > 5)
            errors.push("A dumper cannot mount more than 5 spaces of weapons");
        if (frontCA > 1 || backCA > 1 || rightCA > 1 || leftCA > 1 || topCA > 1 || underbodyCA > 1 || leftBackCA > 1 || rightBackCA > 1 || topBackCA > 1 || underBackCA > 0)
            errors.push("No more than one weapon or group per facing may have component armor");
        if (car.topTurret) {
            CW.validateTurret(errors, car.body, radarDetector, car.topTurret, car.techLevel, car.maxWeaponSpacesPerSide);
            if (car.topTurret.name === 'Pintle Mount' && !car.sunroof && !car.convertibleHardtop)
                errors.push("A pintle mount must be adjacent to a sunroof or convertible hardtop");
        }
        if (car.hasOversizeWeaponFacings() && car.topBackTurret) {
            CW.validateTurret(errors, car.body, radarDetector, car.topBackTurret, car.techLevel, car.maxWeaponSpacesPerSide);
            if (car.topBackTurret.name === 'Pintle Mount' && !car.sunroof && !car.convertibleHardtop)
                errors.push("A pintle mount must be adjacent to a sunroof or convertible hardtop");
        }
        if (car.sideTurret) CW.validateTurret(errors, car.body, radarDetector, car.sideTurret, car.techLevel, car.maxWeaponSpacesPerSide);
        if (car.hasOversizeWeaponFacings() && car.sideBackTurret) CW.validateTurret(errors, car.body, radarDetector, car.sideBackTurret, car.techLevel, car.maxWeaponSpacesPerSide);
        if (car.tireCount() < 7 && (car.middleWheelguards || car.middleWheelhubs) && (!car.middleOrOuterTires || !car.thirdRowTiresInMiddle)) {
            errors.push("Cannot use middle-mounted wheelguards or wheelhubs unless the " + type + " has three rows of tires");
        }
        if (car.tireCount() === 4) {
            if (car.body.name === "Van" || car.body.name === "Camper" || car.body.name === "Pickup") {
                if (car.chassis.name === "Extra Heavy") {
                    errors.push("Pickups, Campers, and Vans with an Extra-Heavy chassis must have a six-wheeled chassis!");
                }
            }
        }
        var plastic = car.armorTypeToMatch();
        var metal = car.frontArmor ? car.frontArmor.metalType : CW.armor.metal;
        if (plastic) {
            if (car.frontWheelguards && !car.frontWheelguards.fake && car.frontWheelguards.plasticType && car.frontWheelguards.plasticType.name !== plastic.name)
                errors.push("Wheelguard plastic armor must match vehicular plastic armor!");
            if (car.backWheelguards && !car.backWheelguards.fake && car.backWheelguards.plasticType && car.backWheelguards.plasticType.name !== plastic.name)
                errors.push("Wheelguard plastic armor must match vehicular plastic armor!");
            if (car.middleWheelguards && !car.middleWheelguards.fake && car.middleWheelguards.plasticType && car.middleWheelguards.plasticType.name !== plastic.name)
                errors.push("Wheelguard plastic armor must match vehicular plastic armor!");
            if (car.frontWheelhubs && !car.frontWheelhubs.fake && car.frontWheelhubs.plasticType && car.frontWheelhubs.plasticType.name !== plastic.name)
                errors.push("Wheelhub plastic armor must match vehicular plastic armor!");
            if (car.backWheelhubs && !car.backWheelhubs.fake && car.backWheelhubs.plasticType && car.backWheelhubs.plasticType.name !== plastic.name)
                errors.push("Wheelhub plastic armor must match vehicular plastic armor!");
            if (car.middleWheelhubs && !car.middleWheelhubs.fake && car.middleWheelhubs.plasticType && car.middleWheelhubs.plasticType.name !== plastic.name)
                errors.push("Wheelhub plastic armor must match vehicular plastic armor!");
        }
        if (metal) {
            if (car.frontWheelguards && !car.frontWheelguards.fake && car.frontWheelguards.metalType && car.frontWheelguards.metalType.name !== metal.name)
                errors.push("Wheelguard metal armor must match vehicular metal armor!");
            if (car.backWheelguards && !car.backWheelguards.fake && car.backWheelguards.metalType && car.backWheelguards.metalType.name !== metal.name)
                errors.push("Wheelguard metal armor must match vehicular metal armor!");
            if (car.middleWheelguards && !car.middleWheelguards.fake && car.middleWheelguards.metalType && car.middleWheelguards.metalType.name !== metal.name)
                errors.push("Wheelguard metal armor must match vehicular metal armor!");
            if (car.frontWheelhubs && !car.frontWheelhubs.fake && car.frontWheelhubs.metalType && car.frontWheelhubs.metalType.name !== metal.name)
                errors.push("Wheelhub metal armor must match vehicular metal armor!");
            if (car.backWheelhubs && !car.backWheelhubs.fake && car.backWheelhubs.metalType && car.backWheelhubs.metalType.name !== metal.name)
                errors.push("Wheelhub metal armor must match vehicular metal armor!");
            if (car.middleWheelhubs && !car.middleWheelhubs.fake && car.middleWheelhubs.metalType && car.middleWheelhubs.metalType.name !== metal.name)
                errors.push("Wheelhub metal armor must match vehicular metal armor!");
        }
        var frontCycle = car.type === 'Cycle' || (car.type === 'Trike' && !car.reversed);
        var backCycle = car.type === 'Cycle' || (car.type === 'Trike' && car.reversed);
        if (car.frontWheelguards) CW.validateWheelArmor(errors, car.frontWheelguards, "Front Wheelguards", frontCycle, car.techLevel);
        if (car.frontWheelhubs) CW.validateWheelArmor(errors, car.frontWheelhubs, "Front Wheelhubs", frontCycle, car.techLevel);
        if (car.middleWheelguards) CW.validateWheelArmor(errors, car.middleWheelguards, "Middle Wheelguards", backCycle, car.techLevel);
        if (car.middleWheelhubs) CW.validateWheelArmor(errors, car.middleWheelhubs, "Middle Wheelhubs", backCycle, car.techLevel);
        if (car.backWheelguards) CW.validateWheelArmor(errors, car.backWheelguards, "Back Wheelguards", backCycle, car.techLevel);
        if (car.backWheelhubs) CW.validateWheelArmor(errors, car.backWheelhubs, "Back Wheelhubs", backCycle, car.techLevel);

        if (car.hitch) {
            if (car.hitch.armor && car.hitch.armor.totalWeight(4) > 40) errors.push("Hitch armor is limited to 40 lbs.");
            if (car.hitch.armor && plastic && car.hitch.armor.plasticType.name !== plastic.name) errors.push("Hitch armor must match vehicular armor!");
            if (car.hitch.explosive && car.hitch.quickRelease) errors.push("A hitch cannot be both explosive and quick-release");
        }
    };

    CW.validateAccessories = function (car, errors) {
        var i;
        if (car.convertibleHardtop) {
            if (car.topTurret && car.topTurret.name !== "Pintle Mount") errors.push("Cannot have a convertible hardtop and a " + car.topTurret.name);
            if (car.sunroof) errors.push("Cannot have a convertible hardtop and a sunroof");
            if (car.body.name === "Station Wagon") errors.push("Station wagons cannot use a convertible hardtop");
            else if (car.body.name === "Van") errors.push("Vans cannot use a convertible hardtop");
            else if (car.body.name === "Camper") errors.push("Campers cannot use a convertible hardtop");
            else if (car.type === "Cycle" || car.type === "Sidecar") errors.push("Cycles and sidecars cannot use a convertible hardtop");
            else if (car.type === "SemiTractor") errors.push("Semis cannot use a convertible hardtop");
            else if (car.type === "TenWheeler" || car.type === 'TenWheelerCarrier') errors.push("Ten Wheelers cannot use a convertible hardtop");
            else if (car.type === "CarTrailer" || car.type === 'SemiTrailer') errors.push("Trailers cannot use a convertible hardtop");
            else if (car.type === "Bus") errors.push("Buses cannot use a convertible hardtop");
            if (car.topArmor.plasticPoints > 20 || car.topArmor.metalPoints > 0) errors.push("Cannot use more than 20 points of top armor (plastic only) with a convertible hardtop");
            if (car.topWeapons.length > 0) errors.push("Cannot use top weapons with a convertible hardtop");
        }
        if (car.sunroof) {
            if (car.isOversize()) {
                if (car.topTurret && car.topTurret.name !== CW.turrets.Pintle_Mount.name &&
                    car.topBackTurret && car.topBackTurret.name !== CW.turrets.Pintle_Mount.name)
                    errors.push("Cannot have a sunroof and two top turrets");
            } else {
                if (car.topTurret && car.topTurret.name !== CW.turrets.Pintle_Mount.name) errors.push("Cannot have a sunroof and a " + car.topTurret.name);
            }
        }
        if (car.ramplate) {
            if (car.fakeRamplate) errors.push("Cannot have a real ramplate and a fake ramplate");
            if (car.bumperSpikes) errors.push("Cannot have a ramplate and front bumper spikes");
            if (car.brushcutter) errors.push("Cannot have a ramplate and a brushcutter");
        }
        if (car.fakeRamplate) {
            if (car.bumperSpikes) errors.push("Cannot have a fake ramplate and front bumper spikes");
            if (car.brushcutter) errors.push("Cannot have a fake ramplate and a brushcutter");
        }
        if (car.bumperSpikes) {
            if (car.brushcutter) errors.push("Cannot have bumper spikes and a brushcutter");
        }
        if (car.bodyBlades && car.fakeBodyBlades)
            errors.push("Cannot have both real and fake body blades");
        var carTopCount = 0;
        var carTopSpace = 0;
        var carTopFake = false;
        var cargoSafe = false, miniSafe = false, safeMods = false, autopilot = false, gunnerSoftware = false, autopilotSoftware = false, nav = false, radar = false, infrared = false, gunner = false, autopilotGunner = false, maps = false;
        for (i = 0; i < car.accessories.length; i++) {
            if (((!car.accessories[i].techLevel || car.accessories[i].techLevel === 'CWC') && car.techLevel === 'Classic') ||
                (car.accessories[i].techLevel && car.accessories[i].techLevel !== 'Classic' && car.accessories[i].techLevel !== 'CWC' && (car.techLevel === 'Classic' || car.techLevel === 'CWC')) ||
                (car.accessories[i].military && car.techLevel !== 'Military'))
                errors.push(car.accessories[i].name + " is not available with "+(car.techLevel === 'All' ? 'UACFH/Pyramid' : car.techLevel)+" technology");
            if (car.accessories[i].name === CW.accessories.LEFT_SIDE_DOOR.name || car.accessories[i].name === CW.accessories.RIGHT_SIDE_DOOR.name) {
                if (car.type === 'Car' && car.body.name !== "Van")
                    errors.push("Only vans and oversize vehicles may use a side door");
            } else if (car.accessories[i].name === CW.accessories.PASSENGER_ACCOMMODATIONS.name) {
                if (car.type === 'Car' && car.body.name !== "Van")
                    errors.push("Passenger accommodations require a Van or larger");
            } else if (car.accessories[i].name === CW.accessories.CAR_TOP_CARRIER_2.name) {
                ++carTopCount;
                if (carTopSpace < 2) carTopSpace = 2;
            } else if (car.accessories[i].name === CW.accessories.CAR_TOP_CARRIER_4.name) {
                ++carTopCount;
                if (carTopSpace < 4) carTopSpace = 4;
            } else if (car.accessories[i].name === CW.accessories.CAR_TOP_CARRIER_6.name) {
                ++carTopCount;
                if (carTopSpace < 6) carTopSpace = 6;
            } else if (car.accessories[i].name === CW.accessories.FAKE_CAR_TOP_CARRIER.name) {
                ++carTopCount;
                carTopFake = true;
            } else if (car.accessories[i].name === CW.accessories.CARGO_SAFE.name) {
                cargoSafe = true;
            } else if (car.accessories[i].name === CW.accessories.CARGO_SAFE_BREATHER.name ||
                car.accessories[i].name === CW.accessories.CARGO_SAFE_FRIDGE.name ||
                car.accessories[i].name === CW.accessories.CARGO_SAFE_SELF_DESTRUCT.name) {
                safeMods = true;
            } else if (car.accessories[i].name === CW.accessories.SMALL_MINI_SAFE.name) {
                miniSafe = true;
            } else if (car.accessories[i].name === CW.accessories.LARGE_MINI_SAFE.name) {
                miniSafe = true;
            } else if (car.accessories[i].name === CW.accessories.PORTABLE_EARTH_STATION.name && car.convertibleHardtop) {
                errors.push("Cannot use top-mounted accessories (Portable Earth Station) with a convertible hardtop");
            } else if (car.accessories[i].name === CW.accessories.SOLAR_PANEL.name && car.convertibleHardtop) {
                errors.push("Cannot use top-mounted accessories (Solar Panel) with a convertible hardtop");
            } else if (car.accessories[i].name === CW.accessories.COMPUTER_GUNNER.name) {
                gunner = true;
            } else if (car.accessories[i].name === CW.accessories.AUTOPILOT.name) {
                autopilot = true;
            } else if (car.accessories[i].name === CW.accessories.AUTOPILOT_SOFTWARE.name) {
                autopilotSoftware = true;
            } else if (car.accessories[i].name === CW.accessories.COMPUTER_GUNNER_SOFTWARE.name) {
                gunnerSoftware = true;
            } else if (car.accessories[i].name === CW.accessories.AUTOPILOT_GUNNER.name) {
                autopilotGunner = true;
            } else if (car.accessories[i].name === CW.accessories.COMPUTER_NAVIGATOR.name) {
                nav = true;
            } else if (car.accessories[i].name === CW.accessories.COMPUTER_NAVIGATOR_MAP.name) {
                maps = true;
            } else if (car.accessories[i].name === CW.accessories.RADAR.name) {
                radar = true;
            } else if (car.accessories[i].name === CW.accessories.LONG_RANGE_RADAR.name) {
                radar = true;
            } else if (car.accessories[i].name === CW.accessories.INFRARED_SIGHTING_SYSTEM.name) {
                infrared = true;
            }
        }
        if (carTopCount > 0 && car.convertibleHardtop)
            errors.push("Cannot use top-mounted accessories (Car-Top Carrier) with a convertible hardtop");
        if (carTopCount > (car.isOversize() ? 2 : 1))
            errors.push("This vehicle may only mount " + (car.isOversize() ? 2 : 1) + " car top carrier" + (car.isOversize() ? "s" : ""));
        if (carTopSpace > car.maxWeaponSpacesPerSide)
            errors.push("The selected car-top carrier is too large for this vehicle");
        if (car.isOversize()) {
            i = (car.topTurret ? 1 : 0) + (car.topBackTurret ? 1 : 0);
            if (i + carTopCount > 2) errors.push("This vehicle cannot use " + i + " turret" + (i > 1 ? "s" : "") + " and " + carTopCount + " car top carrier" + (carTopCount > 1 ? "s" : ""));
        } else {
            if (carTopCount > 0 && !carTopFake && car.topTurret)
                errors.push("A vehicle with a top " + car.topTurret.name + " cannot mount a car-top carrier");
        }
        if (safeMods && !cargoSafe) {
            if (miniSafe) errors.push("A mini-safe cannot use the normal cargo safe options");
            else errors.push("Cannot use cargo safe options without a cargo safe");
        }
        if (gunnerSoftware && !gunner) errors.push("Cannot use computer gunner software without a computer gunner");
        if (autopilotSoftware && !autopilot) errors.push("Cannot use autopilot software without an autopilot");
        if (autopilotGunner && (!autopilot || !gunner)) errors.push("Cannot use an autopilot/computer gunner link without both an autopilot and a computer gunner");
        if (maps && !nav) errors.push("Cannot use computer navigator maps without a computer navigator");
        if (autopilot && !nav) errors.push("Cannot use autopilot without a computer navigator");
        if (autopilot && (!radar && !infrared)) errors.push("Cannot use autopilot without either a radar or an infrared system");
    };

    CW.validateCar = function (car) {
        var errors = [], engineError = false;
        if (car.heavyDutyTransmission) {
            if (car.weightUsed > car.engine.totalPowerFactors() * 6 && car.engine.totalPowerFactors() * 6 < car.modifiedMaxWeight) {
                engineError = true;
                errors.push("Design weighs " + car.weightUsed + " lbs. but engine can only move " + (car.engine.totalPowerFactors() * 6) + " lbs.");
            }
            if (car.engine.name === "Thundercat")
                errors.push("Heavy-Duty Transmission can't be used with a Thundercat power plant");
            if (car.chassis.name === "Light" || car.chassis.name === "Standard")
                errors.push("Heavy-Duty Transmission requires a heavy or extra heavy chassis");
        } else {
            if (car.weightUsed > car.engine.totalPowerFactors() * 3 && car.engine.totalPowerFactors() * 3 < car.modifiedMaxWeight) {
                engineError = true;
                errors.push("Design weighs " + car.weightUsed + " lbs. but engine can only move " + (car.engine.totalPowerFactors() * 3) + " lbs.");
            }
        }
        if (car.body.racingFrame) {
            if (car.carbonAluminumFrame)
                errors.push("Race cars cannot take a CA frame (it's built in)");
            if ((car.crew.length > 1 || car.passengers.length > 0) && car.body.name !== "Can-Am")
                errors.push("This vehicle cannot hold crew or passengers other than the driver");
            if (car.crew.length + car.passengers.length > 2 && car.body.name === "Can-Am")
                errors.push("This vehicle cannot hold more than one gunner or passenger");
            if (car.suspension.name !== "Light")
                errors.push("Race cars cannot have modified suspensions");
            if ((car.body.name === "Formula One/Indy" || car.body.name === "Dragster" || car.body.name === "Sprint") &&
                (car.frontWheelguards || car.backWheelguards || car.middleWheelguards))
                errors.push("This vehicle cannot use wheelguards");
            if (car.body.name === "Dragster") {
                if (!car.frontTires.motorcycle)
                    errors.push("Dragsters must use motorcycle tires in front");
                if (car.backTires.motorcycle || (car.middleOrOuterTires && car.middleOrOuterTires.motorcycle))
                    errors.push("Dragsters should use motorcycle tires on the front wheels only");
            } else {
                if (car.frontTires.motorcycle || car.backTires.motorcycle || (car.middleOrOuterTires && car.middleOrOuterTires.motorcycle))
                    errors.push("Cars may not use motorcycle tires");
            }
            if ((car.body.name === "Funny Car" || car.body.name === "Dragster") && car.frontTires.slick)
                errors.push("This vehicle may only mount racing slicks on the rear tires");
        } else {
            if (car.frontTires.motorcycle || car.backTires.motorcycle || (car.middleOrOuterTires && car.middleOrOuterTires.motorcycle))
                errors.push("Cars may not use motorcycle tires");
            if ((car.body.name === CW.carBody.subcompact.name || car.body.name === CW.carBody.compact.name) && car.tireCount() === 6)
                errors.push("Subcompacts and compacts cannot use a six-wheeled chassis");
        }
        CW.baseValidate(car, "Car", errors, engineError);
        CW.validateAccessories(car, errors);

        return errors;
    };

    CW.validateWheelArmor = function (errors, armor, prefix, shouldBeMotorcycle, techLevel) {
        var max = 40, show = 40;
        if(armor.motorcycle) {
            if(!armor.wheelhub || techLevel === 'All') max = 20;
            show = max;
            if(armor.wheelhub) max *= 2;
        }
        if (armor.totalWeight(techLevel) > max) errors.push("Wheelguards and hubs are limited to "+show+" lbs. each");
        if (armor.fake && (armor.plasticPoints > 0 || armor.metalPoints > 0)) errors.push("Fake wheelguards and hubs must have 0 points of armor");
        if (shouldBeMotorcycle && !armor.motorcycle) errors.push(prefix + " must be the motorcycle kind");
        if (!shouldBeMotorcycle && armor.motorcycle) errors.push(prefix + " must not be the motorcycle kind");
    };

    CW.validateTurret = function (errors, body, radarDetector, turret, techLevel, oneThird) {
        if (turret.name === CW.turrets.Sponson_Turret.name) {
            if (techLevel === 'CWC' || techLevel === 'Classic')
                errors.push("Sponson Turrets are not available with " + techLevel + " technology");
        } else if(/Turret/.test(turret.name)) {
            if(turret.size === 0 && techLevel === 'Classic')
                errors.push("Zero-space turrets are not available with Classic technology");
        } else if(techLevel === 'Classic') {
            errors.push(turret.name+"s are not available with Classic technology");
        }
        if(techLevel === 'Classic') {
            if(turret.fake) errors.push("Fake turrets are not available with Classic technology");
            if(turret.boosters.length > 0) errors.push("Rocket Boosters and Jump Jets are not available with Classic technology");
        }
        if (turret.costBySize[turret.size] === 0) {
            errors.push("No such item as a " + turret.size + "-space " + turret.name);
            return;
        }
        if (turret.name === "Turret" || turret.name === "Pop-Up Turret" || turret.name === 'Cupola'
            || turret.name === 'Pop-Up Cupola' || turret.name === 'Pintle Mount' || turret.name === CW.turrets.Sponson_Turret.name) {
            if (CW.sidecarBody && CW.cycleBody) {
                if ((body.name === CW.sidecarBody.light.name || body.name === CW.sidecarBody.heavy.name) && /Turret/.test(turret.name) && turret.size > 0)
                    errors.push(techLevel === 'Classic' ? "Light and Heavy sidecars cannot use turrets" : "Light and Heavy sidecars can only use zero-space turrets");
                if (body.name === CW.sidecarBody.oneSpaceCTS.name && (turret.size !== 1 || turret.name !== CW.turrets.Turret.name))
                    errors.push("A 1-space CTS must have a one-space turret");
                if (body.name === CW.sidecarBody.twoSpaceCTS.name && (turret.size !== 2 || turret.name !== CW.turrets.Turret.name))
                    errors.push("A 2-space CTS must have a two-space turret");
                if (body.name === CW.cycleBody.light.name || body.name === CW.cycleBody.medium.name || body.name === CW.cycleBody.heavy.name)
                    errors.push("Cycles cannot use turrets");
            }
            if ((body.name === "Subcompact" || (CW.trikeBody && body.name === CW.trikeBody.light.name)) && turret.size > 0)
                errors.push(techLevel === 'Classic' ? "This vehicle cannot use a turret" : "This vehicle can only use zero-space turrets");
            if ((body.name === "Compact" || body.name === (CW.trikeBody && CW.trikeBody.medium.name)) && turret.size > 1)
                errors.push("This vehicle can only use up to 1-space turrets");
            if ((body.name === "Mid-sized" || body.name === "Sedan" || body.name === "Luxury"
                || body.name === "Station Wagon" || body.name === "Pickup"
                || (CW.trikeBody && (body.name === CW.trikeBody.heavy.name || body.name === CW.trikeBody.extra_heavy.name)))
                && turret.size > 2)
                errors.push("This vehicle can only use up to a 2-space turret");
            if ((body.name === "Camper" || body.name === "Van") && turret.size > 3)
                errors.push("This vehicle can only use up to a 3-space turret");
            if (body.racingFrame && turret.size > 2)
                errors.push("Race cars can only use up to a 2-space turret");
        } else if (turret.name === 'EWP' || turret.name === 'Rocket EWP') {
            if (CW.sidecarBody) {
                if (body.name === CW.sidecarBody.light.name || body.name === CW.sidecarBody.heavy.name ||
                    body.name === CW.sidecarBody.oneSpaceCTS.name || body.name === CW.sidecarBody.twoSpaceCTS.name)
                    errors.push("Sidecars cannot use EWPs");
            }
            if ((body.name === "Subcompact" || body.name === "Compact" || (CW.trikeBody && (body.name === CW.trikeBody.light.name
                || body.name === CW.trikeBody.medium.name || body.name === CW.trikeBody.heavy.name))
                || (CW.cycleBody && (body.name === CW.cycleBody.light.name || body.name === CW.cycleBody.medium.name
                    || body.name === CW.cycleBody.heavy.name)))
                && turret.size > 1)
                errors.push("This vehicle can only use up to a 1-space EWP");
            if ((body.name === "Mid-sized" || body.name === "Sedan" || body.name === "Luxury"
                || body.name === "Station Wagon" || body.name === "Pickup"
                || (CW.trikeBody && body.name === CW.trikeBody.extra_heavy.name))
                && turret.size > 2)
                errors.push("This vehicle can only use up to a 2-space EWP");
            if ((body.name === "Camper" || body.name === "Van") && turret.size > 3)
                errors.push("This vehicle can only use up to a 3-space EWP");
            if (body.racingFrame && turret.size > 2)
                errors.push("Race cars can only use up to a 2-space EWP");
        } else if (turret.name === 'Rocket Platform') {
            if (CW.sidecarBody && CW.cycleBody) {
                if (body.name === CW.sidecarBody.light.name || body.name === CW.sidecarBody.heavy.name ||
                    body.name === CW.sidecarBody.oneSpaceCTS.name || body.name === CW.sidecarBody.twoSpaceCTS.name)
                    errors.push("Sidecars cannot use rocket platforms");
                if (body.name === CW.cycleBody.light.name || body.name === CW.cycleBody.medium.name || body.name === CW.cycleBody.heavy.name)
                    errors.push("Cycles cannot use rocket platforms");
            }
            if ((body.name === "Subcompact" || (CW.trikeBody && body.name === CW.trikeBody.light.name)) && turret.size > 1)
                errors.push("This vehicle can only use 1-space rocket platforms");
            if ((body.name === "Mid-sized" || body.name === "Sedan" || body.name === "Luxury"
                || body.name === "Station Wagon" || body.name === "Pickup" || body.name === "Compact"
                || (CW.trikeBody && (body.name === CW.trikeBody.medium.name || body.name === CW.trikeBody.heavy.name
                    || body.name === CW.trikeBody.extra_heavy.name)))
                && turret.size > 2)
                errors.push("This vehicle can only use up to a 2-space rocket platform");
            if (body.racingFrame && turret.size > 2)
                errors.push("Race cars can only use up to a 2-space rocket platform");
        } else errors.push("Unknown turret type '" + turret.name + "'");
        if (turret.name !== 'EWP' && turret.boosters.length > 0)
            errors.push("Only standard EWPs can mount rocket boosters & jump jets");
        if (turret.fake && turret.boosters.length > 0)
            errors.push("Fake " + turret.name + "s cannot mount rocket boosters or jump jets");
        var total = 0, topTotal = 0;
        for (var i = 0; i < turret.weapons.length; i++) {
            total += turret.weapons[i].spaceInsideTurret();
            topTotal += turret.weapons[i].totalSpace();
            CW.validateWeapon(errors, radarDetector, turret.weapons[i], techLevel);
            if (turret.weapons[i].componentArmor && (turret.name === 'EWP' || turret.name === 'Rocket EWP'
                || turret.name === 'Pintle Mount' || turret.name === 'Rocket Platform')) {
                errors.push("Weapons in EWPs, Rocket Platforms, and Pintle Mounts cannot be protected by component armor");
            }
            if (turret.name === 'Rocket Platform') {
                if (!turret.weapons[i].isRocket() && turret.weapons[i].abbv !== "TL")
                    errors.push("Only rockets and targeting lasers may be mounted on a rocket platform");
                if (turret.weapons[i].isRocket() && turret.weapons[i].shots > 3)
                    errors.push("Only single-shot rockets may be mounted on a rocket platform");
                if (turret.weapons[i].extraMagazines > 0 || turret.weapons[i].rocketMagazine > 0 || turret.weapons[i].dualWeaponMagazines > 0)
                    errors.push("No extra/rocket magazines can feed rockets on a rocket platform");
            }
            if (turret.name === 'Rocket EWP') {
                if (!turret.weapons[i].isRocket())
                    errors.push("Only rockets may be mounted on a rocket EWP");
                if (turret.weapons[i].isRocket() && turret.weapons[i].shots > 3)
                    errors.push("Only single-shot rockets may be mounted on a rocket EWP");
            }
        }
        for (i = 0; i < turret.boosters.length; i++) {
            total += turret.boosters[i].totalSpace();
            topTotal += turret.boosters[i].totalSpace();
        }
        if (turret.gunner) {
            if(!/Cupola/.test(turret.name)) errors.push("Only a cupola can hold a gunner");
            total += turret.gunner.totalSpace();
            topTotal += turret.gunner.totalSpace();
        }
        if (total > turret.size) {
            errors.push("This " + turret.name + " can only hold " + turret.size + " spaces but there are " + total + " spaces of weapons & boosters" + (/Cupola/.test(turret.name) ? " & crew" : "") + " inside");
        }
        if (topTotal > oneThird) {
            errors.push("The weapons and boosters in the " + turret.name + " total " + topTotal + " spaces, but this vehicle can only have " + oneThird + " weapon+booster spaces per side");
        }
        if (turret.fake) {
            for (i = 0; i < turret.weapons.length; i++) {
                if (!turret.weapons[i].fake)
                    errors.push("A fake turret must contain only fake weapons (not " + turret.weapons[i].abbv + ")");
            }
        }
        if (turret.armor) {
            if (turret.name !== 'EWP' && turret.name !== 'Pintle Mount') {
                errors.push("Only standard EWPs and Pintle Mounts can mount armor");
            } else {
                CW.validateEWPArmor(errors, turret.armor);
            }
        }
    };

    CW.validateHandWeapon = function (errors, weapon, techLevel) {
        if(techLevel === 'Classic' && weapon.techLevel !== 'Classic')
            errors.push(weapon.name + " is not available with Classic technology");
        else if (techLevel === 'CWC' && weapon.techLevel !== 'CWC' && weapon.techLevel !== 'Classic')
            errors.push(weapon.name + " is not available with CWC technology");
        else if (techLevel !== 'Military' && weapon.military)
            errors.push(weapon.name + " is restricted military technology");
        var totalShots = 0;
        for (var i = 0; i < weapon.ammo.length; i++) {
            if (weapon.ammo[i].shots < 1) {
                errors.push("Weapon (" + weapon.abbv + ") should not list ammo (" + weapon.ammo[i].abbv + ") with " + weapon.ammo[i].shots + " shots");
                continue;
            }
            totalShots += weapon.ammo[i].shots;
        }
        if (totalShots > weapon.totalCapacity())
            errors.push("Not enough ammo capacity in " + weapon.name + " to hold selected ammo");
        if (weapon.impactFused && weapon.category !== 'Grenades')
            errors.push("Only grenades can be impact fused");
        if (weapon.extendedClips > 0 && !weapon.isPistol() && !/Rifle/.test(weapon.name) && weapon.abbv !== 'SMG') {
            errors.push("Extended clips are only available for pistols, rifles, and SMGs");
        }
        if (weapon.foldingStock && !weapon.isPistol() && !/Rifle/.test(weapon.name) && !/Shotgun/.test(weapon.name)
            && !/Gyroslugger/.test(weapon.name) && weapon.abbv !== 'SMG') {
            errors.push("A Folding Stock is only available on a pistol, rifle, shotgun, gyroslugger, or SMG");
        }
        if (weapon.powerPack && !/Gauss/.test(weapon.name) && weapon.name !== CW.handWeapons.LR.name) {
            errors.push("Only Laser Rifles and Gauss Pistols/Rifles require a power pack");
        }
        if(techLevel === 'Classic') {
            if(weapon.foldingStock) errors.push("A Folding Stock is not available with Classic technology");
            if(weapon.laserScope) errors.push("Laser Targeting Scopes are not available with Classic technology");
        }
        for (i = 0; i < weapon.ammo.length; i++) {
            CW.validateAmmo(errors, true, weapon, weapon.ammo[i], techLevel);
        }
    };

    CW.validateWeapon = function (errors, radarDetector, weapon, techLevel) {
        if(techLevel === 'Classic' && weapon.techLevel !== 'Classic')
            errors.push(weapon.name + " is not available with Classic technology");
        else if (techLevel === 'CWC' && weapon.techLevel !== 'CWC' && weapon.techLevel !== 'Classic')
            errors.push(weapon.name + " is not available with CWC technology");
        else if (techLevel !== 'Military' && weapon.military)
            errors.push(weapon.name + " is restricted military technology");
        if (weapon.fake && weapon.ammo.length > 0)
            errors.push("Fake weapons (" + weapon.abbv + ") cannot have ammunition");
        var totalShots = 0;
        var someCantMix = false;
        for (var i = 0; i < weapon.ammo.length; i++) {
            if (weapon.ammo[i].shots < 1) {
                errors.push("Weapon (" + weapon.abbv + ") should not list ammo (" + weapon.ammo[i].abbv + ") with " + weapon.ammo[i].shots + " shots");
                continue;
            }
            if (!weapon.ammo[i].mixInMagazine) someCantMix = true;
            totalShots += weapon.ammo[i].mixInMagazine ? weapon.ammo[i].shots : Math.ceil(weapon.ammo[i].shots / weapon.shots) * weapon.shots;
        }
        if (weapon.rocketMagazine > 0 && !weapon.isSingleShotRocket())
            errors.push("Rocket magazines can only hold rockets");
        if (weapon.rocketMagazine > 3)
            errors.push("Rocket magazines are limited to 1-3 spaces");
        if (totalShots > weapon.totalCapacity())
            errors.push("Not enough capacity in " + weapon.abbv + " to hold selected ammo" + (someCantMix ? " (some ammo types can't be mixed in a magazine)" : ""));
        if (weapon.concealment && weapon.blowThroughConcealment)
            errors.push(weapon.abbv + " can't have both regular and blow-through concealment");
        if (weapon.bumperTrigger) {
            if (weapon.location !== 'Front' && weapon.location !== 'Back' && weapon.location !== 'Right' && weapon.location !== 'Left'
                && weapon.location !== 'CarrierFront' && weapon.location !== 'CarrierBack' && weapon.location !== 'CarrierRight' && weapon.location !== 'CarrierLeft')
                errors.push("Bumper triggered weapons (" + weapon.abbv + ") must be mounted front, back, left, or right");
        }
        if (weapon.fireRetardantInsulator && weapon.componentArmor) {
            errors.push("Cannot combine Component Armor and Fire-Retardant Insulator on " + weapon.abbv);
        }
        if (weapon.isLaser()) {
            if (weapon.pulse && weapon.laserGuidanceLink) errors.push("A pulse " + weapon.abbv + " cannot be used with a laser-guidance link");
            if (weapon.infrared && weapon.blueGreen) errors.push("An infrared " + weapon.abbv + " cannot be blue-green");
            if (weapon.blueGreen && /X/.test(weapon.abbv)) errors.push("X-Ray lasers cannot be blue-green");
            if(techLevel === 'Classic') {
                if(weapon.pulse) errors.push("Pulse lasers are not available with Classic technology");
                if(weapon.blueGreen) errors.push("Blue-Green lasers are not available with Classic technology");
                if(weapon.laserGuidanceLink) errors.push("Laser-Guidance Links are not available with Classic technology");
            }
        } else {
            if (weapon.laserGuidanceLink) errors.push("Only a laser can have a laser guidance link (not " + weapon.abbv + ")");
            if (weapon.blueGreen) errors.push("Only a laser can be blue-green (not " + weapon.abbv + ")");
            if (weapon.infrared) errors.push("Only a laser can be infrared (not " + weapon.abbv + ")");
            if (weapon.pulse) errors.push("Only a laser can be pulse (not " + weapon.abbv + ")");
        }
        if(techLevel === 'Classic') {
            if(weapon.fake) errors.push("Fake weapons are not available with Classic technology");
            if(weapon.concealment) errors.push("Concealment is not available with Classic technology");
            if(weapon.blowThroughConcealment) errors.push("Blow-Through Concealment is not available with Classic technology");
            if(weapon.fireRetardantInsulator) errors.push("Fire-Retardant Insulators are not available with Classic technology");
            if(weapon.dualWeaponMagazines > 0) errors.push("Dual-Weapon Magazines are not available with Classic technology");
            if(weapon.rotaryMagazine) errors.push("Rotary Magazines are not available with Classic technology");
            if(weapon.bumperTrigger) errors.push("Bumper Triggers are not available with Classic technology");
        }
        for (i = 0; i < weapon.ammo.length; i++) {
            CW.validateAmmo(errors, radarDetector, weapon, weapon.ammo[i], techLevel);
        }
        if (weapon.componentArmor) CW.validateCA(errors, weapon.componentArmor, techLevel);
    };

    CW.validateAmmo = function (errors, radarDetector, weapon, ammo, techLevel) {
        if(techLevel === 'Classic' && ammo.techLevel !== 'Classic')
            errors.push(ammo.abbv + " ammo is not available for a " + weapon.name + " with Classic technology");
        else if (techLevel === 'CWC' && ammo.techLevel !== 'CWC' && ammo.techLevel !== 'Classic')
            errors.push(ammo.abbv + " ammo is not available for a " + weapon.name + " with CWC technology");
        else if (techLevel !== 'Military' && ammo.military)
            errors.push(ammo.abbv + " ammo is restricted military technology");
        if(techLevel === 'Classic') {
            if (ammo.laserGuided) errors.push("Laser-Guided rockets are not available with Classic technology");
            if (ammo.harm) errors.push("HARM rockets are not available with Classic technology");
            if (ammo.tracer) errors.push("Tracer rounds are not available with Classic technology");
            if (ammo.proximityFused) errors.push("Proximity-Fused mines are not available with Classic technology");
        }
        if ((techLevel === 'CWC' || techLevel === 'Classic') && ammo.programmable)
            errors.push("Programmable mines are not available with "+techLevel+" technology");
        if (weapon.type === 'Weapon' && weapon.isRocket()) {
            if (ammo.harm && !radarDetector) errors.push("HARM rockets require a radar detector");
        } else {
            if (ammo.laserGuided) errors.push("Only rockets can be laser-guided");
            if (ammo.harm) errors.push("Only rockets can be HARM");
        }
        if (weapon.type !== 'Weapon' || !weapon.isMachineGun()) {
            if (ammo.tracer) errors.push("Only bullets can be tracer");
        }
        if (weapon.type === 'Weapon' && weapon.isMinedropper()) {
            if (ammo.programmable) {
                if (ammo.name === 'Spider') errors.push("Spider mines cannot be programmable");
                if (ammo.radioDetonated) errors.push("Programmable mines cannot be radio detonated");
                if (ammo.proximityFused) errors.push("Programmable mines cannot be proximity-fused");
            }
        } else {
            if (ammo.proximityFused) errors.push("Only mines can be proximity-fused");
            if (ammo.radioDetonated) errors.push("Only mines can be radio or contact detonated");
            if (ammo.programmable) errors.push("Only mines can be programmable");
        }
        if (!weapon.isGrenadeLauncher()) {
            if (ammo.impactFused) errors.push("Only grenades can be impact-fused");
            if (ammo.highVelocity) errors.push("Only grenades can be high-velocity");
        } else {
            if (weapon.name !== CW.weapons.AGL.name && ammo.highVelocity)
                errors.push("Only the Auto-Grenade Launcher can use high-velocity grenades");
        }
    };

    CW.validateGasEngine = function (errors, engine, techLevel) {
        if(techLevel === 'Classic') errors.push("Gas engines are not available with Classic technology");
        if (engine.cost < 4000 && engine.supercharger)
            errors.push("Cannot have a supercharger on an engine smaller than 150cid");
        if (engine.fireExtinguisher && engine.improvedFireExtinguisher)
            errors.push("Cannot have both a regular and improved fire extinguisher");
        if (engine.turbocharger && engine.variablePitchTurbocharger)
            errors.push("Cannot have both a regular and variable-pitch turbocharger");
        if (engine.carburetor && engine.multibarrelCarburetor)
            errors.push("Cannot have both a regular and multibarrel carburetor");
        if (engine.componentArmor) CW.validateCA(errors, engine.componentArmor, techLevel);
        if (engine.truck) {
            if (engine.variablePitchTurbocharger) errors.push("Truck engines cannot have a VP Turbocharger");
            if (engine.supercharger) errors.push("Truck engines cannot have a Supercharger");
            if (engine.multibarrelCarburetor) errors.push("Truck engines cannot have a multibarrel carburetor");
        }
    };

    CW.validateGasTank = function (errors, tank, techLevel) {
        if (tank.capacity < 1) errors.push("Gas tank must have at least 1 gallon capacity");
        if (tank.componentArmor) CW.validateCA(errors, tank.componentArmor, techLevel);
        if(tank.fireRetardantInsulator && techLevel === 'Classic') errors.push("Fire-Retardant Insulators are not available with Classic technology");
    };

    CW.validateElectricEngine = function (errors, engine, techLevel) {
        if (engine.fireExtinguisher && engine.improvedFireExtinguisher)
            errors.push("Cannot have both a regular and improved fire extinguisher");
        if (engine.componentArmor) CW.validateCA(errors, engine.componentArmor, techLevel);
        if ((techLevel === 'Classic' || techLevel === 'CWC') && (engine.highTorqueMotors || engine.heavyDutyHighTorqueMotors))
            errors.push("High-Torque Motors are not available with "+techLevel+" technology");
        if(techLevel === 'Classic') {
            if(engine.platinumCatalysts) errors.push("Platinum Catalysts are not available with Classic technology");
            if(engine.superconductors) errors.push("Platinum Catalysts are not available with Classic technology");
            if(engine.fireRetardantInsulator) errors.push("Fire-Retardant Insulators are not available with Classic technology");
            if(engine.laserBatteries > 0) errors.push("Laser Batteries are not available with Classic technology");
            if(engine.extraPowerCells > 0) errors.push("Extra Power Cells are not available with Classic technology");
            if(engine.improvedSuperchargerCapacitors > 0) errors.push("ISCs are not available with Classic technology");
        }
    };

    CW.validateCrew = function (errors, crew, techLevel, useGE) {
        var computers = 0, i;
        if (crew.targetingComputer) ++computers;
        if (crew.highResComputer) ++computers;
        if (crew.singleWeaponComputer) ++computers;
        if (crew.highResSingleWeaponComputer) ++computers;
        if (crew.cyberlink) ++computers;
        if (computers > 1) errors.push("Only one computer/cyberlink is allowed per crew position");
        if (crew.name === 'Passenger' && computers > 0) errors.push("Passengers cannot use targeting computers");
        var armorCount = 0;
        if (crew.bodyArmor) ++armorCount;
        if (crew.improvedBodyArmor) ++armorCount;
        if (crew.impactArmor) ++armorCount;
        if (armorCount > 1) errors.push("Only one set of body armor is allowed per crew member");
        if (crew.battleVest && crew.armoredBattleVest) errors.push("Only one Battle Vest is allowed");
        if (crew.armoredBattleVest && (crew.improvedBodyArmor || crew.impactArmor))
            errors.push("An Armored Battle Vest cannot be worn over Improved BA or Impact Armor");
        if (crew.armoredBattleVest && crew.flakJacket) errors.push("An Armored Battle Vest cannot be worn with a Flak Jacket");
        if (crew.flakJacket && (crew.improvedBodyArmor || crew.impactArmor))
            errors.push("A Flak Jacket cannot be worn over Improved BA or Impact Armor");
        if(crew.flakJacket && (techLevel === 'CWC' || techLevel === 'Classic'))
            errors.push("Flak Jackets are not available with "+techLevel+" technology");
        if (crew.componentArmor) CW.validateCA(errors, crew.componentArmor, techLevel);
        if (crew.ejectionSeat && crew.unsafeEjectionSeat) errors.push("Only one ejection seat can be installed per crew member");
        if (useGE) {
            var ge = crew.totalGE();
            if (crew.improvedBodyArmor || crew.impactArmor) {
                if (ge > 5) {
                    errors.push(crew.name + " limited to 5 GE with "
                        + (crew.improvedBodyArmor ? "Improved Body" : "Impact") + " Armor (now " + ge + " GEs)");
                }
            } else if (ge > 6) {
                errors.push(crew.name + " cannot carry " + ge + " Grenade Equivalents of equipment");
            }
        }
        if(techLevel === 'Classic') {
            if(crew.ejectionSeat || crew.unsafeEjectionSeat) errors.push("Ejection Seats are not available with Classic technology");
            if(crew.extraDriverControls) errors.push("Extra Driver Controls are not available with Classic technology");
        }
        for (i = 0; i < crew.handWeapons.length; i++) CW.validateHandWeapon(errors, crew.handWeapons[i], techLevel);
    };

    CW.validateTire = function (errors, tire, techLevel) {
        if (tire.name === "Plasticore") {
            if (tire.steelbelted) errors.push("Plasticore tires cannot be steelbelted");
            if (tire.radial) errors.push("Plasticore tires cannot be radial");
            if (tire.offRoad) errors.push("Plasticore tires cannot be off-road");
            if (tire.slick) errors.push("Plasticore tires cannot be racing slicks");
            if(techLevel === 'Classic') errors.push("Plasticore tires are not available with Classic technology");
        }
        if (tire.radial) {
            if (tire.offRoad) errors.push("Tires cannot be both off-road and radial");
            if (tire.slick) errors.push("Tires cannot be both racing slicks and radial");
        }
        if (tire.offRoad) {
            if (tire.slick) errors.push("Tires cannot be both off-road and racing slicks");
        }
        if (tire.snowTires) {
            if (tire.slick) errors.push("Tires cannot be both snow tires and racing slicks");
            if (techLevel === 'CWC' || techLevel === 'Classic') errors.push("Snow Tires are not available with "+techLevel+" technology");
        }
        if (tire.tireChains) {
            if (techLevel === 'CWC' || techLevel === 'Classic') errors.push("Tire Chains are not available with "+techLevel+" technology");
        }
        if(tire.slick && techLevel === 'Classic') errors.push("Racing Slicks are not available with Classic technology");
        if (tire.truck) {
            if (tire.motorcycle) errors.push("A tire cannot be both a motorcycle tire and a truck tire");
            if (tire.radial) errors.push("Truck tires cannot be radial");
            if (tire.slick) errors.push("Truck tires cannot be racing slicks");
            if (tire.offRoad) errors.push("Truck tires cannot be off-road");
            if (tire.name === "Plasticore" && tire.fireproof) errors.push("Truck plasticore tires cannot be fireproof");
        }
    };

    CW.validateEWPArmor = function (errors, armor) {
        if (armor.totalWeight() > 40)
            errors.push("EWP and Pintle Mount armor is limited to 40lbs.");
    };

    CW.validateCA = function (errors, armor, techLevel) {
        if(techLevel === 'Classic') errors.push("Component Armor is not available with Classic technology");
        var protectedSpaces = armor.spacesProtected();
        if (protectedSpaces < 1) protectedSpaces = 1;
        else protectedSpaces = Math.ceil(protectedSpaces - 0.0001);
        var maxWeight = protectedSpaces * 20;
        if (armor.totalWeight() > maxWeight) {
            errors.push("Component armor is limited to " + maxWeight + " lbs. on " + (armor.item.length ? "the crew" : armor.item.name));
        }
    };
})();