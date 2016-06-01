import geb.junit4.GebReportingTest
import org.junit.Test

class StockCarTest extends GebReportingTest {
    void startApp() {
        go()
        at LoadingPage
        newDesignLink.click()
        at NewVehiclePage
    }

    @Test
    void createCarHoneyBadger() {
        /*  Honey Badger -- Luxury, Extra-Heavy chassis, Heavy suspension, Sport power plant w/PC & SC,
           10-pt CA (Power Plant), 4 Steelbelted Solid tires, Driver w/HRSWC and 10-pt CA, Bumper-Triggered
            Incendiary Heavy Rocket Front, 2 Linked Bumper-Triggered Rocket Launchers Front each w/10 shots
            Incendiary and 10-pt CA on the pair, Bumper-Triggered Flame Cloud Ejector Back w/10-pt CA,
            Flame Cloud Dischargers (1 Left, 1 Right), Spoiler, Airdam, Link (Both FCDs, FCE),
            Plastic Armor: F40 (Ramplate), L30, R30, B38, T3, U7, 2 10-pt Wheelguards Back, 2 10-pt Wheelhubs Front,
            Acceleration 10, Top Speed 122.5, HC 3 (4 @60mph), 6600 lbs., $29960
        */
        startApp()
        newCar.click()
        toolbarDesignButton.click()
        designName.value("Honey Badger")
        cwc.click()
        diagramBody.click()
        at BodyPage
        bodyLabel('Luxury').click()
        diagramEngine.click()
        at EngineSelectorPage
        accelerationUp.click()
        assert engineName(3) == "Sport"
        assert engineMods(3) == "SC"
        selectEngine(3).click()
        at EnginePage
        pcCheckbox.click()
//        checkCostPopup()  TODO
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        diagramFrontTires.click()
        at TirePage
        steelbelted.click()
        solidTires.click()
        diagramDriver.click()
        at PersonPage
        nextComputer.click()
        nextComputer.click()
        nextComputer.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        diagramFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Rocket Launchers & Pods").click()
        at WeaponListPage
        weapon("RL").click()
        at WeaponPage
        ammoNone("Normal").click()
        ammoAddClip("Incendiary").click()
        countUp.click()
        bumperTrigger.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        toolbarWeaponsButton.click()
        frontWeapons.click()
        at WeaponsInLocationPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Single-Shot Rockets").click()
        at WeaponListPage
        weapon("HR").click()
        at WeaponPage
        ammoNone("Normal").click()
        ammoAddClip("Incendiary").click()
        bumperTrigger.click()
        diagramRightWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Gas Dischargers").click()
        at WeaponListPage
        weapon("FCD").click()
        at DischargerDialog
        closeButton.click()
        at WeaponPage
        diagramLeftWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Gas Dischargers").click()
        at WeaponListPage
        weapon("FCD").click()
        at WeaponPage
        diagramBackWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Dropped Gasses").click()
        at WeaponListPage
        weapon("FCE").click()
        at WeaponPage
        bumperTrigger.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        toolbarModsButton.click()
        performancePage.click()
        at SportPage
        spoiler.click()
        airdam.click()
        toolbarGearButton.click()
        linksButton.click()
        at LinksPage
        addLink.click()
        at LinkPage
        linkItem(2).click()
        linkItem(3).click()
        linkItem(4).click()
        toolbarModsButton.click()
        ramplate.click()
        toolbarArmorButton.click()
        singleFront.value("40")
        singleLeft.value("30")
        singleRight.value("30")
        singleBack.value("38")
        singleTop.value("3")
        singleUnderbody.value("7")
        diagramFrontTires.click()
        at TirePage
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        diagramBackTires.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        confirmResult(29960, 6600, 19, "Honey Badger")
        def text = modelTextDescription()
        assert text.contains('2 Linked Bumper-Triggered Rocket Launchers Front each w/10 shots Incendiary')
        assert text.contains('Flame Cloud Dischargers (1 Left, 1 Right)')
        assert text.contains('Link (both FCDs, FCE)')
    }

    @Test
    void createCarTrailerRoadScavenger() {
        /* Road Scavenger -- 30' Van, Extra-Heavy chassis, 8 Puncture-Resistant tires, 2 Gunners each w/HRTC,
          10-pt CA on crew, Passenger w/Medikit, Passenger, Turret Top Front w/2 Linked Rocket Launchers
          each w/xrotary magazine and extra magazine and magazine switch and 10 shots L/G Normal and
          10 shots Armor-Piercing and Targeting Laser w/Laser Guidance Link, Turret Top Back
          w/2 Linked Rocket Launchers each w/rotary magazine and extra magazine and magazine switch and 10 shots
          L/G Normal and 10 shots Armor-Piercing and Targeting Laser w/Laser Guidance Link,
          Spikedroppers Left Back and Right Back and Back each w/10 Explosive Spikes, Assault Ramp, Fire Extinguisher,
          Radar, Radar Detector, Radar Jammer, Anti-Theft System, Portable Shop (4 cases),
          Plastic Armor: F5, LF20, LB20, RF20, RB20, B25, TF20, TB20, UF5, UB5, 4 10-pt Wheelguards Back,
          4 10-pt Wheelhubs Back, Cargo: [30 spaces, 6165 lbs.], 10755 lbs., $64500
         */
        startApp()
        newCarTrailer.click()
        toolbarDesignButton.click()
        designName.value("Road Scavenger")
        cwc.click()
//        equipmentWeight.click()
        diagramBody.click()
        at BodyPage
        bodyLabel("30' Trailer").click()
        nextChassis.click()
        nextChassis.click()
        diagramBackTires.click()
        at TirePage
        prTires.click()
        toolbarCrewButton.click()
        addGunner.click()
        addGunner.click()
        gunner.click()
        at PersonPage
        nextComputer.click()
        nextComputer.click()
        nextComputer.click()
        nextComputer.click()
        clickOnCanvas("editCrew",false, false, "crew",1)
        nextComputer.click()
        nextComputer.click()
        nextComputer.click()
        nextComputer.click()
        multiCAUp.click()
        multiCAUp.click()
        multiCAUp.click()
        multiCAUp.click()
        multiCAUp.click()
        multiCAUp.click()
        multiCAUp.click()
        multiCAUp.click()
        multiCAUp.click()
        multiCAUp.click()
        toolbarCrewButton.click()
        addPassenger.click()
        addPassenger.click()
        clickOnCanvas("editCrew", false, false, "passengers", 0)
        at PersonPage
        gearButton.click()
        at CrewGearPage
        backpacks.click()
        medikit.click()
        toolbarTurretButton.click()
        at TurretListPage
        topTurret("Turret").click()
        at TurretPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Rocket Launchers & Pods").click()
        at WeaponListPage
        weapon("RL").click()
        at WeaponPage
        countUp.click()
        rotaryMagazine.click() // DISABLED: no effect as of v.1174
        laserGuided.click()
        ammoUp("ArmorPiercing").click()
        ammoUp("ArmorPiercing").click()
        ammoUp("ArmorPiercing").click()
        ammoUp("ArmorPiercing").click()
        ammoUp("ArmorPiercing").click()
        ammoUp("ArmorPiercing").click()
        ammoUp("ArmorPiercing").click()
        ammoUp("ArmorPiercing").click()
        ammoUp("ArmorPiercing").click()
        ammoUp("ArmorPiercing").click()
        magazineSwitch.click()
        laserGuidedCount.click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        back.click()
        at WeaponPage
        diagramTopTurret.click()
        at TurretPage
        addTL.click()
        at WeaponPage
        clickOnCanvas('')
        at DefaultPage
        toolbarTurretButton.click()
        at TurretListPage
        switchOversizeTurrets.click()
        at TurretListPage
        topTurret("Turret").click()
        at TurretPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Rocket Launchers & Pods").click()
        at WeaponListPage
        weapon("RL").click()
        at WeaponPage
        countUp.click()
        ammoUp("ArmorPiercing").click()
        ammoUp("ArmorPiercing").click()
        ammoUp("ArmorPiercing").click()
        ammoUp("ArmorPiercing").click()
        ammoUp("ArmorPiercing").click()
        ammoUp("ArmorPiercing").click()
        ammoUp("ArmorPiercing").click()
        ammoUp("ArmorPiercing").click()
        ammoUp("ArmorPiercing").click()
        ammoUp("ArmorPiercing").click()
        laserGuided.click()
        laserGuidedCount.click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        back.click()
        at WeaponPage
        rotaryMagazine.click() // DISABLED: no effect as of v.1174
        magazineSwitch.click()
        clickOnCanvas("editRightBackWeapons")
        at WeaponCategoriesPage
        weaponCategory("Dropped Solids").click()
        at WeaponListPage
        weapon("SD").click()
        at WeaponPage
        ammoNone("Spikes").click()
        ammoAddClip("ExplosiveSpikes").click()
        clickOnCanvas("editLeftBackWeapons")
        at WeaponCategoriesPage
        weaponCategory("Dropped Solids").click()
        at WeaponListPage
        weapon("SD").click()
        at WeaponPage
        ammoNone("Spikes").click()
        ammoAddClip("ExplosiveSpikes").click()
        diagramBackWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Dropped Solids").click()
        at WeaponListPage
        weapon("SD").click()
        at WeaponPage
        ammoNone("Spikes").click()
        ammoAddClip("ExplosiveSpikes").click()
        toolbarModsButton.click()
        assaultRamp.click()
        toolbarGearButton.click()
        combatButton.click()
        at GearListPage
        fireExtinguisher.click()
        backButton.click()
        at GearCategoriesPage
        sensorsButton.click()
        at GearListPage
        radar.click()
        detector.click()
        jammer.click()
        backButton.click()
        at GearCategoriesPage
        securityButton.click()
        at GearListPage
        antiTheft.click()
        backButton.click()
        at GearCategoriesPage
        towingButton.click()
        at GearListPage
        portableShop.click()
        diagramBackTires.click()
        at TirePage
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        toolbarArmorButton.click()
        singleFront.value("5")
        singleLeft.value("20")
        singleLeftBack.value("20")
        singleRight.value("20")
        singleRightBack.value("20")
        singleBack.value("25")
        singleTop.value("20")
        singleTopBack.value("20")
        singleUnderbody.value("5")
        singleUnderbodyBack.value("5")
        clickOnDiagram(1, 3)
        at DefaultPage
        clickOnCanvas("editTopBackTurret")
        at TurretPage
        addTL.click()
        clickOnCanvas('')
        confirmResult(62500, 10715, 24, "Road Scavenger")
        def text = modelTextDescription()
        assert text.contains('Turret Top Front w/2 Linked Rocket Launchers each w/extra magazine and magazine switch and 10 shots Laser-Guided Armor-Piercing and 10 shots Normal and Targeting Laser w/Laser Guidance Link')
        assert text.contains('Turret Top Back w/2 Linked Rocket Launchers each w/extra magazine and magazine switch and 10 shots Laser-Guided Armor-Piercing and 10 shots Normal and Targeting Laser w/Laser Guidance Link')
        assert text.contains('Spikedroppers Left Back and Right Back and Back each w/10 Explosive Spikes')
    }

    @Test
    void createSemiTractorBuzzard() {
        /* Buzzard -- Sleeper Longnose, Extra-Heavy chassis, Super power plant w/PC & SC, Improved Fire Extinguisher,
           10 Fireproof Steelbelted Solid tires, Driver w/HRTC and Safety Seat and 10-pt CA, Gunner w/HRTC
           and Safety Seat and Extra Driver Controls and 10-pt CA, Universal Turret w/2 Linked Rocket Launchers
           each w/extra magazine and magazine switch and 10 shots L/G Normal and 10 shots Normal and Targeting Laser
           w/Laser Guidance Link, Flechette Dischargers (1 Front, 1 Back, 1 Left, 1 Right, 1 Top, 1 Underbody),
           No-Paint Windshield, 10-pt Fifth Wheel Armor, Radar, Radar Detector, Radar Jammer, Computer Navigator,
           Tinted Windows, Anti-Theft System, Surge Protector, Link (All FDs), Composite Laser-Reflective
           Metal/RP Fireproof Plastic Armor: F1/54, L1/40, R1/40, B0/10, T1/40, U0/13, 6 10-pt RP Fireproof Wheelguards,
           6 10-pt RP Fireproof Wheelhubs, Gear Allocation: [8 lbs.], Acceleration 2.5, Top Speed 170, HC 1,
           16192 lbs., $193766. Max trailer weight 75808 lbs.
          */
        startApp()
        newSemiTractor.click()
        toolbarDesignButton.click()
        designName.value("Buzzard")
        cwc.click()
        diagramBody.click()
        at BodyPage
        bodyLabel('Sleeper Longnose').click()
        nextChassis.click()
        nextChassis.click()
        diagramEngine.click()
        at EngineSelectorPage
        assert engineName(2) == 'Regular'
        assert engineMods(2) == ''
        selectEngine(2).click()
        at EnginePage
        biggerEngine.click()
        biggerEngine.click()
        pcCheckbox.click()
        checkCostPopup()
        scCheckbox.click()
        checkCostPopup()
        feCheckbox.click()
        checkCostPopup()
        ifeCheckbox.click()
        checkCostPopup()
        diagramFrontTires.click()
        at TirePage
        solidTires.click()
        steelbelted.click()
        fireproof.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        diagramBackTires.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        diagramDriver.click()
        at PersonPage
        nextComputer.click()
        nextComputer.click()
        nextComputer.click()
        nextComputer.click()
        nextSeat.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        addGunner.click()
        diagramGunner.click()
        nextComputer.click()
        nextComputer.click()
        nextComputer.click()
        nextComputer.click()
        nextSeat.click()
        extraControls.click()
        multiCAUp.click()
        multiCAUp.click()
        multiCAUp.click()
        multiCAUp.click()
        multiCADown.click()
        multiCADown.click()
        multiCADown.click()
        multiCADown.click()
        diagramDriver.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        diagramGunner.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        toolbarTurretButton.click()
        at TurretListPage
        topTurret("Turret").click()
        at TurretPage
        universal.click()
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Rocket Launchers & Pods").click()
        at WeaponListPage
        weapon("RL").click()
        at WeaponPage
        countUp.click()
        ammoAddClip("Normal").click()
        laserGuided.click()
        laserGuidedCount.click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        back.click()
        at WeaponPage
        magazineSwitch.click()
        diagramTopTurret.click()
        at TurretPage
        addTL.click()
        at WeaponPage
        diagramFrontWeapons.click()
        at WeaponsInLocationPage
        addDischarger.click()
        at WeaponCategoriesPage
        weaponCategory("Other Dischargers").click()
        at WeaponListPage
        weapon("FD").click()
        at DischargerDialog
        closeButton.click()
        at WeaponPage
        diagramLeftWeapons.click()
        at WeaponsInLocationPage
        addDischarger.click()
        at WeaponCategoriesPage
        weaponCategory("Other Dischargers").click()
        at WeaponListPage
        weapon("FD").click()
        at WeaponPage
        diagramRightWeapons.click()
        at WeaponsInLocationPage
        addDischarger.click()
        at WeaponCategoriesPage
        weaponCategory("Other Dischargers").click()
        at WeaponListPage
        weapon("FD").click()
        at WeaponPage
        toolbarWeaponsButton.click()
        backWeapons.click()
        at WeaponsInLocationPage
        addDischarger.click()
        at WeaponCategoriesPage
        weaponCategory("Other Dischargers").click()
        at WeaponListPage
        weapon("FD").click()
        at WeaponPage
        toolbarWeaponsButton.click()
        topWeapons.click()
        at WeaponsInLocationPage
        addDischarger.click()
        at WeaponCategoriesPage
        weaponCategory("Other Dischargers").click()
        at WeaponListPage
        weapon("FD").click()
        at WeaponPage
        toolbarWeaponsButton.click()
        underbodyWeapons.click()
        at WeaponsInLocationPage
        addDischarger.click()
        at WeaponCategoriesPage
        weaponCategory("Other Dischargers").click()
        at WeaponListPage
        weapon("FD").click()
        at WeaponPage
        toolbarModsButton.click()
        noPaint.click()
        diagramFifthWheel.click()
        at BodyPage
        moreFifthWheelArmor.click()
        moreFifthWheelArmor.click()
        moreFifthWheelArmor.click()
        moreFifthWheelArmor.click()
        moreFifthWheelArmor.click()
        moreFifthWheelArmor.click()
        moreFifthWheelArmor.click()
        moreFifthWheelArmor.click()
        moreFifthWheelArmor.click()
        moreFifthWheelArmor.click()
        toolbarGearButton.click()
        sensorsButton.click()
        at GearListPage
        radar.click()
        detector.click()
        jammer.click()
        backButton.click()
        at GearCategoriesPage
        electronicsButton.click()
        at GearListPage
        navigator.click()
        toolbarModsButton.click()
        tinted.click()
        toolbarGearButton.click()
        securityButton.click()
        at GearListPage
        antiTheft.click()
        backButton.click()
        at GearCategoriesPage
        electronicsButton.click()
        at GearListPage
        surge.click()
        backButton.click()
        at GearCategoriesPage
        linksButton.click()
        at LinksPage
        addLink.click()
        at LinkPage
        linkName("FD Front").click()
        linkName("FD Left").click()
        linkName("FD Right").click()
        linkName("FD Back").click()
        linkName("FD Top").click()
        linkName("FD Underbody").click()
        toolbarArmorButton.click()
        nextPlastic.click()
        nextPlastic.click()
        nextPlastic.click()
        nextPlastic.click()
        nextPlastic.click()
        assert plasticName == 'RP Fireproof Plastic'
        nextMetal.click()
        nextMetal.click()
        assert metalName == 'Laser-Reflective Metal'
        frontMetal.value("1")
        frontPlastic.value("54")
        leftMetal.value("1")
        leftPlastic.value("40")
        rightMetal.value("1")
        rightPlastic.value("40")
        backPlastic.value("10")
        topMetal.value("1")
        topPlastic.value("40")
        underbodyPlastic.value("13")
        clickOnDiagram(1, 3)
        at DefaultPage
        confirmResult(193766, 16192, 27, "Buzzard")
        def text = modelTextDescription()
        assert text.contains('Universal Turret w/2 Linked Rocket Launchers each w/extra magazine and magazine switch and 10 shots Laser-Guided Normal and 10 shots Normal and Targeting Laser w/Laser Guidance Link,')
        assert text.contains('Flechette Dischargers (1 Front, 1 Back, 1 Left, 1 Right, 1 Top, 1 Underbody),')
    }

    @Test
    void createSemiTrailerBuzzard() {
        /* Buzzard Trailer -- 40' Van, 8 Fireproof Steelbelted Solid tires, Gunner w/HRTC and Safety Seat and 10-pt CA
           and Medikit, Gunner w/HRTC and Safety Seat and 10-pt CA, Turret Top Front w/2 Linked Rocket Launchers
           each w/extra magazine and magazine switch and 10 shots L/G Normal and 10 shots Normal and Targeting Laser
           w/Laser Guidance Link, Turret Top Back w/2 Linked Rocket Launchers each w/extra magazine and 10 shots
           L/G Normal and 10 shots Normal and Targeting Laser w/Laser Guidance Link, Minedroppers Left Back
           and Right Back each w/10 Mines, Spikedroppers Left Back and Right Back each w/10 Explosive Spikes,
           2 Linked Rocket Launchers Back each w/extra magazine and 10 shots L/G Normal and 10 shots Normal,
           Targeting Laser Back w/Laser Guidance Link, Quick-Release Kingpin, Left Side Door, Assault Ramp,
           Improved Fire Ext., Portable Shop (4 cases), Link (all Left Back weapons), Link (all Right Back weapons),
           Link (all Dropped weapons), Smart Link (2 RLs Back, 2 RLs in Turret), Smart Link (4 RLs in Turret),
           Composite Laser-Reflective Metal/RP Fireproof Plastic Armor: F1/10, LF8/35, LB8/35, RF8/35, RB8/35,
           B10/50, TF8/30, TB8/30, UF0/20, UB0/20, 4 10-pt RP Fireproof Wheelguards Back,
           4 10-pt RP Fireproof Wheelhubs Back, Cargo: [48 spaces], 20750 lbs., $156390
          */
        startApp()
        newSemiTrailer.click()
        diagramBackTires.click()
        at TirePage
        solidTires.click()
        steelbelted.click()
        fireproof.click()
        toolbarDesignButton.click()
        designName.value("Buzzard Trailer")
        cwc.click()
        toolbarCrewButton.click()
        addGunner.click()
        gunner.click()
        at PersonPage
        nextComputer.click()
        nextComputer.click()
        nextComputer.click()
        nextComputer.click()
        nextSeat.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        gearButton.click()
        at CrewGearPage
        backpacks.click()
        at CrewGearListPage
        medikit.click()
        toolbarTurretButton.click()
        at TurretListPage
        topTurret("Turret").click()
        at TurretPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Rocket Launchers & Pods").click()
        at WeaponListPage
        weapon("RL").click()
        at WeaponPage
        countUp.click()
        ammoAddClip("Normal").click()
        laserGuided.click()
        laserGuidedCount.click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        back.click()
        at WeaponPage
        diagramTopTurret.click()
        at TurretPage
        addTL.click()
        at WeaponPage
        toolbarTurretButton.click()
        at TurretListPage
        switchOversizeTurrets.click()
        topTurret("Turret").click()
        at TurretPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Rocket Launchers & Pods").click()
        at WeaponListPage
        weapon("RL").click()
        at WeaponPage
        ammoAddClip("Normal").click()
        laserGuided.click()
        laserGuidedCount.click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        back.click()
        at WeaponPage
        countUp.click()
        diagramTopBackTurret.click()
        at TurretPage
        addTL.click()
        at WeaponPage
        clickOnCanvas("edittopTurretWeapons", false, false, null, 0)
        magazineSwitch.click()
        diagramLeftBackWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Dropped Solids").click()
        at WeaponListPage
        weapon("MD").click()
        at WeaponPage
        diagramLeftBackWeapons.click()
        at WeaponsInLocationPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Dropped Solids").click()
        at WeaponListPage
        weapon("SD").click()
        at WeaponPage
        ammoNone("Spikes").click()
        ammoAddClip("ExplosiveSpikes").click()
        diagramRightBackWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Dropped Solids").click()
        at WeaponListPage
        weapon("MD").click()
        at WeaponPage
        diagramRightBackWeapons.click()
        at WeaponsInLocationPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Dropped Solids").click()
        at WeaponListPage
        weapon("SD").click()
        at WeaponPage
        ammoNone("Spikes").click()
        ammoAddClip("ExplosiveSpikes").click()
        diagramBackWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Rocket Launchers & Pods").click()
        at WeaponListPage
        weapon("RL").click()
        at WeaponPage
        countUp.click()
        ammoUp("ArmorPiercing").click()
        ammoUp("ArmorPiercing").click()
        ammoNone("ArmorPiercing").click()
        ammoUp("Normal").click()
        ammoUp("Normal").click()
        ammoUp("Normal").click()
        ammoUp("Normal").click()
        ammoUp("Normal").click()
        ammoUp("Normal").click()
        ammoUp("Normal").click()
        ammoUp("Normal").click()
        ammoUp("Normal").click()
        ammoUp("Normal").click()
        laserGuided.click()
        laserGuidedCount.click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        back.click()
        at WeaponPage
        diagramLeftBackWeapons.click()
        at WeaponsInLocationPage
        diagramBackWeapons.click()
        at WeaponsInLocationPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Lasers").click()
        at WeaponListPage
        weapon("TL").click()
        at WeaponPage
        diagramBody.click()
        at BodyPage
        qrKingpin.click()
        toolbarModsButton.click()
        leftSideDoor.click()
        assaultRamp.click()
        clickOnDiagram(3, 1)
        at DefaultPage
        toolbarGearButton.click()
        combatButton.click()
        at GearListPage
        ife.click()
        backButton.click()
        at GearCategoriesPage
        towingButton.click()
        at GearListPage
        portableShop.click()
        backButton.click()
        at GearCategoriesPage
        linksButton.click()
        at LinksPage
        backButton.click()
        at GearCategoriesPage
        linksButton.click()
        at LinksPage
        addLink.click()
        at LinkPage
        linkName("MD Left Back").click()
        linkName("SD Left Back").click()
        backButton.click()
        at LinksPage
        addLink.click()
        at LinkPage
        linkName("MD Left Back").click()
        linkName("SD Left Back").click()
        backButton.click()
        at LinksPage
        addLink.click()
        at LinkPage
        linkName("MD Left Back").click()
        linkName("SD Left Back").click()
        linkName("MD Right Back").click()
        linkName("SD Right Back").click()
        backButton.click()
        at LinksPage
        linkButton(3).click()
        at LinkPage
        backButton.click()
        at LinksPage
        linkButton(4).click()
        at LinkPage
        linkName("MD Left Back").click()
        linkName("SD Left Back").click()
        linkName("MD Right Back").click()
        linkName("SD Right Back").click()
        backButton.click()
        at LinksPage
        linkButton(3).click()
        at LinkPage
        backButton.click()
        at LinksPage
        linkButton(4).click()
        at LinkPage
        backButton.click()
        at LinksPage
        addLink.click()
        at LinkPage
        removeButton.click()
        at LinksPage
        backButton.click()
        at GearCategoriesPage
        smartLinksButton.click()
        at LinksPage
        addLink.click()
        at LinkPage
        linkName("2x RL in Turret").click()
        linkName("2x RL in Back Turret").click()
        backButton.click()
        at LinksPage
        addLink.click()
        at LinkPage
        linkName("2x RL in Back Turret").click()
        linkName("2x RL Back").click()
        backButton.click()
        at LinksPage
        linkButton(0).click()
        at LinkPage
        backButton.click()
        at LinksPage
        diagramBackTires.click()
        at TirePage
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        toolbarArmorButton.click()
        nextPlastic.click()
        nextPlastic.click()
        nextPlastic.click()
        nextPlastic.click()
        nextPlastic.click()
        nextMetal.click()
        nextMetal.click()
        frontMetal.value("1")
        frontPlastic.value("10")
        leftMetal.value("8")
        leftPlastic.value("35")
        leftBackMetal.value("8")
        leftBackPlastic.value("35")
        rightMetal.value("8")
        rightPlastic.value("35")
        rightBackMetal.value("8")
        rightBackPlastic.value("35")
        backMetal.value("8")
        backMetal.value("10")
        backPlastic.value("50")
        topMetal.value("8")
        topPlastic.value("30")
        topBackMetal.value("8")
        topBackPlastic.value("30")
        underbodyPlastic.value("20")
        underbodyBackPlastic.value("20")
        clickOnDiagram(1, 2)
        at DefaultPage
        toolbarCrewButton.click()
        addGunner.click()
        clickOnCanvas("editCrew", false, false, "crew", 1);
        at PersonPage
        nextSeat.click()
        nextComputer.click()
        nextComputer.click()
        nextComputer.click()
        nextComputer.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        clickOnDiagram(3, 4)
        at DefaultPage
//        toolbarDesignButton.click()
//        equipmentWeight.click()
        clickOnDiagram(1, 2)
        at DefaultPage
        confirmResult(156390, 20750, 32, "Buzzard Trailer")
        def text = modelTextDescription()
        assert text.contains('Turret Top Front w/2 Linked Rocket Launchers each w/extra magazine and magazine switch and 10 shots Laser-Guided Normal and 10 shots Normal and Targeting Laser w/Laser Guidance Link,')
        assert text.contains('Turret Top Back w/2 Linked Rocket Launchers each w/extra magazine and 10 shots Laser-Guided Normal and 10 shots Normal and Targeting Laser w/Laser Guidance Link,')
        assert text.contains('Minedroppers Left Back and Right Back each w/10 Mines,')
        assert text.contains('Spikedroppers Left Back and Right Back each w/10 Explosive Spikes,')
        assert text.contains('2 Linked Rocket Launchers Back each w/extra magazine and 10 shots Laser-Guided Normal and 10 shots Normal,')
        assert text.contains('Targeting Laser Back w/Laser Guidance Link,')
    }

    @Test
    void createBusLaBelle() {
        /* La Belle -- 30' Bus, Extra-Heavy chassis, Medium power plant, Improved Fire Extinguisher, 10 Fireproof
           Solid tires, Driver, Gunner, 2 Passengers, 2 Linked Heavy X-Ray Lasers Front, Heavy-Duty Smokescreens
           Left Back and Right Back and Back each w/extra magazine and 20 shots Hot Smoke, 2 Linked Blast Cannons Back
           each w/10 shots HESH, Hot Smoke Dischargers (1 Front, 4 Left, 4 Right, 4 Top, 4 Underbody),
           Long-Distance Radio, Radar, Radar Detector, Radar Jammer, Compact TV, Vehicular Computer, Surge Protector,
           Plastic Armor: F43, LF30, LB30, RF30, RB30, B42, TF3, TB3, UF7, UB7, 6 10-pt Wheelguards, 6 10-pt Wheelhubs,
           Gear Allocation: [15 lbs.], Acceleration 2.5, Top Speed 100, HC 1, 19185 lbs., $129380
          */
        startApp()
        newBus.click()
        diagramBody.click()
        at BodyPage
        bodyLabel("30' Bus").click()
        nextChassis.click()
        nextChassis.click()
        diagramEngine.click()
        at EngineSelectorPage
        assert engineName(2) == "Medium"
        assert engineMods(2) == ""
        selectEngine(2).click()
        at EnginePage
        ifeCheckbox.click()
        diagramFrontTires.click()
        at TirePage
        solidTires.click()
        fireproof.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        diagramBackTires.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        diagramDriver.click()
        at PersonPage
        addGunner.click()
        toolbarCrewButton.click()
        addPassenger.click()
        addPassenger.click()
        diagramFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Lasers").click()
        at WeaponListPage
        weapon("HXL").click()
        at WeaponPage
        countUp.click()
        diagramFrontWeapons.click()
        at WeaponsInLocationPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Gas Dischargers").click()
        at WeaponListPage
        assert weapon("HsD").classes().contains("link-disabled")
        cwcButton.click()
        assert !weapon("HsD").classes().contains("link-disabled")
        weapon("HsD").click()
        at DischargerDialog
        closeButton.click()
        at WeaponPage
        diagramLeftFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Gas Dischargers").click()
        at WeaponListPage
        weapon("HsD").click()
        at WeaponPage
        countUp.click()
        countUp.click()
        countUp.click()
        diagramRightFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Gas Dischargers").click()
        at WeaponListPage
        weapon("HsD").click()
        at WeaponPage
        countUp.click()
        countUp.click()
        countUp.click()
        diagramLeftBackWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Dropped Gasses").click()
        at WeaponListPage
        weapon("HDSS").click()
        at WeaponPage
        ammoNone("Normal").click()
        ammoAddClip("HotSmoke").click()
        ammoAddClip("HotSmoke").click()
        diagramRightBackWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Dropped Gasses").click()
        at WeaponListPage
        weapon("HDSS").click()
        at WeaponPage
        ammoNone("Normal").click()
        ammoAddClip("HotSmoke").click()
        ammoAddClip("HotSmoke").click()
        toolbarWeaponsButton.click()
        bottomSwitchOversize.click()
        topFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Gas Dischargers").click()
        at WeaponListPage
        weapon("HsD").click()
        at WeaponPage
        countUp.click()
        countUp.click()
        countUp.click()
        toolbarWeaponsButton.click()
        bottomSwitchOversize.click()
        underbodyFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Gas Dischargers").click()
        at WeaponListPage
        weapon("HsD").click()
        at WeaponPage
        countUp.click()
        countUp.click()
        countUp.click()
        countUp.click()
        diagramBackWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Large Bore Projectile Wpns.").click()
        at WeaponListPage
        weapon("BC").click()
        at WeaponPage
        ammoNone("Normal").click()
        ammoAddClip("HESH").click()
        countUp.click()
        diagramBackArmor.click()
        at ArmorPage
        diagramBackWeapons.click()
        at WeaponsInLocationPage
        toolbarWeaponsButton.click()
        backWeapons.click()
        at WeaponsInLocationPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Dropped Gasses").click()
        at WeaponListPage
        weapon("HDSS").click()
        at WeaponPage
        ammoNone("Normal").click()
        ammoAddClip("HotSmoke").click()
        ammoAddClip("HotSmoke").click()
        toolbarGearButton.click()
        sensorsButton.click()
        at GearListPage
        ldRadio.click()
        radar.click()
        detector.click()
        jammer.click()
        backButton.click()
        at GearCategoriesPage
        electronicsButton.click()
        at GearListPage
        tv.click()
        computer.click()
        surge.click()
        toolbarArmorButton.click()
        singleFront.value("43")
        singleLeft.value("30")
        singleLeftBack.value("30")
        singleRight.value("30")
        singleRightBack.value("30")
        singleBack.value("42")
        singleTop.value("3")
        singleTopBack.value("3")
        singleUnderbody.value("7")
        singleUnderbodyBack.value("7")
        toolbarDesignButton.click()
        designName.value("La Belle")
        clickOnDiagram(1, 1)
        at DefaultPage
        confirmResult(129380, 19185, 45, "La Belle")
        def text = modelTextDescription()
        assert text.contains('2 Linked Heavy X-Ray Lasers Front,')
        assert text.contains('Heavy-Duty Smokescreens Left Back and Right Back and Back each w/extra magazine and 20 shots Hot Smoke,')
        assert text.contains('2 Linked Blast Cannons Back each w/10 shots HESH,')
        assert text.contains('Hot Smoke Dischargers (1 Front, 4 Left, 4 Right, 4 Top, 4 Underbody),')
    }

    @Test
    void createCarBomblet() {
        /* Subcompact, Heavy chassis, Heavy suspension, Small power plant w/PC, 4 Standard tires, Driver w/BA,
           Medium Rocket on Rocket Platform, Medium Rockets in Rocket EWPs Left and Right each,
           2 Linked Medium Rockets Front, Bumper Spikes (Front), Link (2 MRs in Rocket EWP),
           Plastic Armor: F15, L10, R10, B10, T5, U5, Acceleration 5, Top Speed 80, HC 4, 2520 lbs., $3985
          */
        startApp()
        newCar.click()
        diagramBody.click()
        at BodyPage
        previousChassis.click()
        diagramDriver.click()
        at PersonPage
        nextBodyArmor.click()
        toolbarTurretButton.click()
        at TurretListPage
        classicButton.click()
        topTurret("Rocket Platform").click()
        at TurretPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Single-Shot Rockets").click()
        at WeaponListPage
        weapon("MR").click()
        at WeaponPage
        toolbarTurretButton.click()
        at TurretListPage
        sideTurret("Rocket EWP").click()
        at TurretPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Single-Shot Rockets").click()
        at WeaponListPage
        weapon("MR").click()
        at WeaponPage
        diagramFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Single-Shot Rockets").click()
        at WeaponListPage
        weapon("MR").click()
        at WeaponPage
        countUp.click()
        toolbarSportButton.click()
        toolbarModsButton.click()
        bumperSpikes.click()
        toolbarGearButton.click()
        linksButton.click()
        at LinksPage
        addLink.click()
        at LinkPage
        linkName("MR in Left REWP").click()
        linkName("MR in Right REWP").click()
        toolbarArmorButton.click()
        singleFront.value("15")
        singleLeft.value("10")
        singleRight.value("10")
        singleBack.value("10")
        singleTop.value("5")
        singleUnderbody.value("5")
        clickOnDiagram(1, 2)
        at DefaultPage
        diagramEngine.click()
        at EngineSelectorPage
        assert engineName(2) == "Small"
        assert engineMods(2) == "PC"
        selectEngine(2).click()
        at EnginePage
        toolbarDesignButton.click()
//        equipmentWeight.click()
        designName.value("Bomblet")
        clickOnDiagram(4, 1)
        at DefaultPage
        confirmResult(3985, 2520, 7, "Bomblet")
        def text = modelTextDescription()
//        println text
        assert text.contains('Medium Rocket on Rocket Platform,')
        assert text.contains('Medium Rockets in Rocket EWPs Left and Right,')
        assert text.contains('2 Linked Medium Rockets Front,')
        assert text.contains('Link (MRs in Rocket EWPs)')
    }

    @Test
    void createTenWheelerOxRocket() {
        go()
        at LoadingPage
        newDesignLink.click()
        at NewVehiclePage
//    clickOnCanvasXY(552,291)
        clickOnCanvas('createNewTenWheeler')
        at DefaultPage
//    clickOnCanvasXY(295,211)
        clickOnCanvas('editBody')
        at BodyPage
        bodyLabel('Longnose').click()
        nextChassis.click()
        nextChassis.click()
//    clickOnCanvasXY(564,234)
        clickOnCanvas('editEngineList')
        at EngineSelectorPage
        selectEngine(2).click()
        at EnginePage
        ifeCheckbox.click()
//    clickOnCanvasXY(583,41)
        clickOnCanvas('editFrontTires')
        at TirePage
        prTires.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        clickOnCanvas('editBackTires')
        at TirePage
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
//    clickOnCanvasXY(497,187)
//        clickOnCanvas('editCrew')
        diagramDriver.click()
        at PersonPage
        nextComputer.click()
        nextComputer.click()
        nextComputer.click()
        nextBodyArmor.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        toolbarTurretButton.click()
        at TurretListPage
        topTurret('Turret').click()
        at TurretPage
        sizeDown.click()
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory('Rocket Launchers & Pods').click()
        at WeaponListPage
        weapon('VFRP').click()
        at WeaponPage
        ammoAddClip('ArmorPiercing').click()
        magazineSwitch.click()
//    clickOnCanvasXY(572,297)
        clickOnCanvas('editFrontWeapons')
        at WeaponCategoriesPage
        weaponCategory('Single-Shot Rockets').click()
        at WeaponListPage
        weapon('MNR').click()
        at WeaponPage
        ammoNone('Normal').click()
        ammoAddClip('Smoke').click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        toolbarWeaponsButton.click()
        at AllWeaponsPage
        rightWeapons.click()
        at WeaponCategoriesPage
        weaponCategory('Single-Shot Rockets').click()
        at WeaponListPage
        weapon('MNR').click()
        at WeaponPage
        ammoNone('Normal').click()
        ammoUp('Smoke').click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        toolbarWeaponsButton.click()
        at AllWeaponsPage
        leftWeapons.click()
        at WeaponCategoriesPage
        weaponCategory('Single-Shot Rockets').click()
        at WeaponListPage
        weapon('MNR').click()
        at WeaponPage
        ammoNone('Normal').click()
        ammoUp('Smoke').click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
//    clickOnCanvasXY(688,143)
        clickOnCanvas('editFrontWeapons')
        at WeaponsInLocationPage
//    clickOnCanvasXY(711,143)
        clickOnCanvas('editArmor')
        at ArmorPage
        singleFront.value('50')
        singleLeft.value('50')
        singleRight.value('50')
        singleBack.value('0')
        singleTop.value('40')
        singleUnderbody.value('15')
        toolbarCrewButton.click()
        at AllCrewPage
        addCarrierGunner.click()
        carrierGunner.click()
        at PersonPage
        nextBodyArmor.click()
//    clickOnCanvasXY(471,289)
//        clickOnCanvas('edittopTurretWeapons')
        clickOnCanvas('editTopTurret', false, true)
        at TurretPage
//    clickOnCanvasXY(287,247)
        clickOnCanvas('editCrew', false, true, "crew", 0)
        at PersonPage
        nextComputer.click()
        nextComputer.click()
        nextComputer.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        toolbarTurretButton.click()
        at TurretListPage
        switchTurrets.click()
        topTurret('Turret').click()
        at TurretPage
        sizeDown.click()
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory('Rocket Launchers & Pods').click()
        at WeaponListPage
        weapon('VFRP').click()
        at WeaponPage
        ammoAddClip('ArmorPiercing').click()
        magazineSwitch.click()
//    clickOnCanvasXY(197,112)
        clickOnCanvas('editCarrierLeftWeapons')
        at WeaponCategoriesPage
        weaponCategory('Dropped Solids').click()
        at WeaponListPage
        weapon('SD').click()
        at WeaponPage
        ammoNone('Spikes').click()
        ammoAddClip('ExplosiveSpikes').click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        toolbarWeaponsButton.click()
        at AllWeaponsPage
        switchWeaponsLocation.click()
        rightWeapons.click()
        at WeaponCategoriesPage
        weaponCategory('Dropped Solids').click()
        at WeaponListPage
        weapon('SD').click()
        at WeaponPage
        ammoNone('Spikes').click()
        ammoAddClip('ExplosiveSpikes').click()
        clickOnCanvas('editCarrierArmor')
        at ArmorPage
        clickOnCanvas('editCarrierRightWeapons', false, true, null, 0)
        at WeaponPage
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
//    clickOnCanvasXY(35,295)
        clickOnCanvas('editCarrierBackWeapons')
        at WeaponCategoriesPage
        weaponCategory('Dropped Liquids').click()
        at WeaponListPage
        weapon('FOJ').click()
        at WeaponPage
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        toolbarGearButton.click()
        linksButton.click()
        addLink.click()
//    clickOnCanvasXY(373,373)
        clickOnCanvas('editCarrierArmor')
        at ArmorPage
        singleFront.value('20')
        singleLeft.value('44')
        singleRight.value('44')
        singleBack.value('50')
        singleTop.value('40')
        singleUnderbody.value('15')
        diagramDesignName.click()
        at DesignPage
        designName.value('Ox Rocket')
//        equipmentWeight.click()
        clickOnCanvas('')
        at DefaultPage
        confirmResult(80825, 17387, 20, "Ox Rocket")
        confirmCarrier(21540, 5597, 13)
    }

    @Test
    void createTenWheelerLeviathan() {
        go()
        at LoadingPage
        newDesignLink.click()
        at NewVehiclePage
//    clickOnCanvasXY(544,283)
        clickOnCanvas('createNewTenWheeler')
        at DefaultPage
//    clickOnCanvasXY(513,147)
        clickOnCanvas('editBody')
        at BodyPage
        bodyLabel('Longnose').click()
//    clickOnCanvasXY(595,230)
        clickOnCanvas('editEngineList')
        at EngineSelectorPage
        selectEngine(1).click()
        at EnginePage
        ifeCheckbox.click()
//    clickOnCanvasXY(483,283)
        clickOnCanvas('editGasTank')
        at GasTankPage
        sizeUp.click()
        sizeUp.click()
        sizeUp.click()
        sizeUp.click()
        racing.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
//    clickOnCanvasXY(557,49)
        clickOnCanvas('editFrontTires')
        at TirePage
        solidTires.click()
        steelbelted.click()
//    clickOnCanvasXY(503,190)
        clickOnCanvas('editCrew', false, false, 'crew', 0)
        at PersonPage
        nextComputer.click()
        nextComputer.click()
        nextComputer.click()
        nextComputer.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        addGunner.click()
//    clickOnCanvasXY(467,228)
        clickOnCanvas('editCrew', false, false, 'crew', 1)
        at PersonPage
        nextComputer.click()
        nextComputer.click()
        nextComputer.click()
        nextComputer.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
        caUp.click()
//    clickOnCanvasXY(586,146)
        clickOnCanvas('editFrontWeapons')
        at WeaponCategoriesPage
        weaponCategory('Large Bore Projectile Wpns.').click()
        at WeaponListPage
        weapon('BC').click()
        at WeaponPage
        ammoNone('Normal').click()
        ammoAddClip('HESH').click()
        toolbarModsButton.click()
        at BodyModsPage
        bodyBlades.click()
        toolbarGearButton.click()
        at GearCategoriesPage
        sensorsButton.click()
        at GearListPage
        ldRadio.click()
        backButton.click()
        at GearCategoriesPage
        electronicsButton.click()
        at GearListPage
//    clickOnCanvasXY(632,319)
        clickOnCanvas('editAddRamplate')
        at BodyModsPage
//    clickOnCanvasXY(610,348)
        clickOnCanvas('editArmor')
        at ArmorPage
        singleFront.value('35')
        singleLeft.value('30')
        singleRight.value('30')
        singleBack.value('2')
        singleTop.value('7')
        singleUnderbody.value('15')
//    clickOnCanvasXY(588,45)
        clickOnCanvas('editFrontTires')
        at TirePage
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        clickOnCanvas('editBackTires')
        at TirePage
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        diagramDesignName.click()
        at DesignPage
        designName.value('Leviathan')
        equipmentWeight.click()
//    clickOnCanvasXY(256,100)
        clickOnCanvas('editCarrierLeftWeapons')
        at WeaponCategoriesPage
        weaponCategory('Dropped Gasses').click()
        at WeaponListPage
        weapon('HDSS').click()
        at WeaponPage
//    clickOnCanvasXY(160,335)
        clickOnCanvas('editCarrierRightWeapons')
        at WeaponCategoriesPage
        weaponCategory('Dropped Gasses').click()
        at WeaponListPage
        weapon('HDSS').click()
        at WeaponPage
//    clickOnCanvasXY(238,111)
        clickOnCanvas('editCarrierLeftWeapons')
        at WeaponsInLocationPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory('Dropped Solids').click()
        at WeaponListPage
        weapon('SD').click()
        at WeaponPage
        ammoNone('Spikes').click()
        ammoAddClip('ExplosiveSpikes').click()
//    clickOnCanvasXY(246,335)
        clickOnCanvas('editCarrierRightWeapons')
        at WeaponsInLocationPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory('Dropped Solids').click()
        at WeaponListPage
        weapon('SD').click()
        at WeaponPage
        ammoNone('Spikes').click()
        ammoAddClip('ExplosiveSpikes').click()
//    clickOnCanvasXY(44,233)
        clickOnCanvas('editCarrierBackWeapons')
        at WeaponCategoriesPage
        weaponCategory('Large Bore Projectile Wpns.').click()
        at WeaponListPage
        weapon('BC').click()
        at WeaponPage
        ammoNone('Normal').click()
        ammoAddClip('HESH').click()
        toolbarArmorButton.click()
        at ArmorPage
        switchArmorLocation.click()
        singleFront.value('25')
        singleLeft.value('25')
        singleRight.value('25')
        singleBack.value('30')
        singleTop.value('7')
        singleUnderbody.value('15')
        toolbarGearButton.click()
        at GearCategoriesPage
        linksButton.click()
        at LinksPage
        addLink.click()
        at LinkPage
        linkName('HDSS Carrier Left').click()
        linkName('SD Carrier Left').click()
        backButton.click()
        at LinksPage
        addLink.click()
        at LinkPage
        linkName('HDSS Carrier Right').click()
        linkName('SD Carrier Right').click()
        backButton.click()
        at LinksPage
        addLink.click()
        at LinkPage
        linkName('HDSS Carrier Left').click()
        linkName('HDSS Carrier Right').click()
        backButton.click()
        at LinksPage
        addLink.click()
        at LinkPage
        linkName('HDSS Carrier Left').click()
        linkName('SD Carrier Left').click()
        linkName('HDSS Carrier Right').click()
        linkName('SD Carrier Right').click()
        backButton.click()
        at LinksPage
        clickOnCanvas('')
        confirmResult(85344,15108,20,"Leviathan")
        confirmCarrier(15110,4178,10)
    }
}
