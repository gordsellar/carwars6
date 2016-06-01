import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import geb.junit4.GebReportingTest
import org.junit.Test

@RunWith(JUnit4)
class CombatShowcaseTest extends GebReportingTest {
    void startCar() {
        go()
        at LoadingPage
        newDesignLink.click()
        at NewVehiclePage
        newCar.click()
        at DefaultPage
    }

    void startCycle() {
        go()
        at LoadingPage
        newDesignLink.click()
        at NewVehiclePage
        newCycle.click()
        at DefaultPage
    }

    void startTrike() {
        go()
        at LoadingPage
        newDesignLink.click()
        at NewVehiclePage
        newTrike.click()
        at DefaultPage
    }

    @Test
    public void buildSpitfire() {
        /* Spitfire -- Subcompact, Heavy chassis, Heavy suspension, Small power plant, 4 Heavy-Duty tires, Driver, Rocket Launcher Front w/9 shots Incendiary, Plastic Armor: F12, L10, R10, B10, T8, U8, Acceleration 5, Top Speed 90, HC 4, 2399 lbs., $3978 */
        startCar()
        diagramBody.click()
        previousChassis.click()
        classicButton.click()
        toolbarEngineButton.click()
        at EngineSelectorPage
        selectEngine(2).click()
        at EnginePage
        pcCheckbox.click()
        diagramFrontTires.click()
        at TirePage
        hdTires.click()
        diagramFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Rocket Launchers & Pods").click()
        at WeaponListPage
        weapon("RL").click()
        at WeaponPage
        ammoNone("Normal").click()
        ammoAddClip("Incendiary").click()
        ammoDown("Incendiary").click()
        toolbarArmorButton.click()
        singleFront.value("12");
        singleLeft.value("10");
        singleRight.value("10");
        singleBack.value("10");
        singleTop.value("8");
        singleUnderbody.value("8");
        diagramDesignName.click()
        designName.value("Spitfire")
        clickOnDiagram(1, 1)
        at DefaultPage
        confirmResult(3978, 2399, 7, "Spitfire")
        def text = modelTextDescription()
        assert text.contains('Rocket Launcher Front w/9 shots Incendiary')
    }

    @Test
    public void buildFlicker() {
        /* Flicker 2013 -- Light Cycle, Heavy suspension, Small Cycle power plant w/PC & SC, Heavy-Duty High-Torque Motors,
         2 Motorcycle Puncture-Resistant Radial tires, Cyclist w/BA, Spikedropper Back w/10 Explosive Spikes,
          Heavy-Duty Shocks, Overdrive, Plastic Armor: F16, B20, Acceleration 10 (x2 w/HDHTMs),
           Top Speed 130 +20 w/Overdrive, HC 3, 799 lbs., $5060 */
        startCycle()
        diagramBackTires.click()
        at TirePage
        assert carTireLabel.text() == "Back Tires"
        assert modelFrontTire()["name"] == "Standard"
        prTires.click()
        assert modelFrontTire()["name"] == "Puncture-Resistant"
        assert !modelFrontTire()["radial"]
        assert !radialValue
        radial.click()
        assert radialValue
        assert modelFrontTire()["radial"]
        diagramBackWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Dropped Solids").click()
        weapon("SD").click()
        at WeaponPage
        assert ammoText("Spikes") == "10 Spikes"
        assert ammoText("ExplosiveSpikes") == "0 Explosive Spikes"
        ammoNone("Spikes").click()
        classicButton.click()
        ammoAddClip("ExplosiveSpikes").click()
        toolbarArmorButton.click()
        singleFront.value("")
        waitFor { singleFront.value() == "" || singleFront.value() == "0" }
        assert statusCost != '$NaN'
        singleFront.value(16)
        waitFor { singleFront.value() == "16" }
        singleBack.value("")
        assert statusCost != '$NaN'
        singleBack.value("20")
        toolbarSportButton.click()
        hdShocks.click()
        overdrive.click()
        assert hdShocksValue
        diagramCyclist.click()
        at PersonPage
        nextBodyArmor.click()
        toolbarEngineButton.click()
        at EngineSelectorPage
        assert engineName(2) == 'Small Cycle'
        assert engineMods(2) == ''
        selectEngine(2).click()
        pcCheckbox.click()
        scCheckbox.click()
        assert hdhtmCheckbox.find('input').disabled
        cwcButton.click()
        assert !hdhtmCheckbox.find('input').disabled
        hdhtmCheckbox.click()
        diagramDesignName.click()
        at DesignPage
        designName.value("Flicker 2013")
        equipmentWeight.click()
//        blackCheckbox.click()  TODO: color
        clickOnDiagram(1, 5)
        at DefaultPage
        confirmResult(5060, 799, 4, "Flicker 2013")
        def text = modelTextDescription()
        assert text.contains('Spikedropper Back w/10 Explosive Spikes')
    }

    @Test
    public void buildQuicksilver() { // book way off
        /* Quicksilver -- Light Trike, Light chassis, Heavy suspension, Super Cycle power plant w/PC, 10-pt CA (Power Plant), 3 Motorcycle Puncture-Resistant tires, Driver w/10-pt CA, Spikedropper Back w/10 Explosive Spikes and 10-pt CA, Plastic Armor: F4, L6, R6, B7, T1, U1, Gear Allocation: [415 lbs. @ Accel 10/Top Speed 150 (25 lbs. @ Accel 15)], Acceleration 15, Top Speed 180, HC 2, 1025 lbs., $4825 */
        startTrike()
        diagramBody.click()
        at BodyPage
        previousChassis.click()
        previousChassis.click()
        previousChassis.click()
        diagramEngine.click()
        at EngineSelectorPage
        accelerationUp.click()
        classicButton.click()
        accelerationUp.click()
        selectEngine(3).click()
        at EnginePage
        smallerEngine.click()
        scCheckbox.click()
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
        diagramDriver.click()
        at PersonPage
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
        diagramBackWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Dropped Solids").click()
        at WeaponListPage
        weapon("SD").click()
        at WeaponPage
        ammoNone("Spikes").click()
        ammoAddClip("ExplosiveSpikes").click()
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
        diagramBackTires.click()
        at TirePage
        solidTires.click()
        prTires.click()
        toolbarArmorButton.click()
        singleFront.value("4")
        singleLeft.value("6")
        singleRight.value("6")
        singleBack.value("7")
        diagramEngine.click()
        at EnginePage
        clickOnDiagram(4,4)
        at DefaultPage
        diagramDesignName.click()
        at DesignPage
        designName.value("Quicksilver")
        clickOnDiagram(3,3)
        at DefaultPage

        confirmResult(4825, 1025, 8, "Quicksilver")
    }

    @Test
    public void buildTheWhip() { // Same cost, weight
        /* The Whip -- Reversed Medium Trike, Standard chassis, Light suspension, Medium Cycle power plant, 10-pt CA (Power Plant), 3 Motorcycle Heavy-Duty tires, Driver w/10-pt CA, Anti-Tank Gun Front, Plastic Armor: F10, L5, R5, B5, T2, U2, Gear Allocation: [6 lbs.], Acceleration 5, Top Speed 90, HC 1, 1794 lbs., $4748 */
        startTrike()
        diagramDesignName.click()
        at DesignPage
        designName.value("The Whip")
        toolbarBodyButton.click()
        bodyLabel('Medium Trike').click()
        reversed.click()
        previousSuspension.click()
        previousSuspension.click()
        previousChassis.click()
        previousChassis.click()
        previousChassis.click()
        toolbarCrewButton.click()
        carDriver.click()
        at PersonPage
        assert caUp.disabled
        classicButton.click()
        assert !caUp.disabled
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
        diagramEngine.click()
        at EngineSelectorPage
        assert engineName(2) == "Medium Cycle"
        assert engineMods(2) == ""
        selectEngine(2).click()
        at EnginePage
        diagramFrontTires.click()
        at TirePage
        hdTires.click()
        diagramFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Large Bore Projectile Wpns.").click()
        at WeaponListPage
        weapon("ATG").click()
        at WeaponPage
        toolbarEngineButton.click()
        at EnginePage
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
        toolbarArmorButton.click()
        singleFront.value("10")
        singleLeft.value("5")
        singleRight.value("5")
        singleBack.value("5")
        singleTop.value("2")
        singleUnderbody.value("2")
        toolbarBodyButton.click()
        nextChassis.click()
        clickOnDiagram(3,4)
        at DefaultPage

        confirmResult(4748, 1794, 8, "The Whip")
        assert modelTextDescription().contains('Anti-Tank Gun Front')
    }

    @Test
    public void buildGladiator() { // $50 cheaper here
        /* Gladiator -- Subcompact, Heavy chassis, Heavy suspension, Small power plant, 4 Heavy-Duty tires, Driver, Minedropper Back w/10 R&C det. Mines, Plastic Armor: F20 (Ramplate), L7, R7, B7, T3, U8, 2 5-pt Wheelguards Back, 2 5-pt Wheelhubs Front, Acceleration 5, Top Speed 90, HC 4, 2400 lbs., $4402 */
        startCar()
        toolbarDesignButton.click()
        designName.value("Gladiator")
        cwc.click()
        diagramBackWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Dropped Solids").click()
        at WeaponListPage
        weapon("MD").click()
        at WeaponPage
        radioDetonated.click()
        toolbarBodyButton.click()
        previousChassis.click()
        diagramEngine.click()
        at EngineSelectorPage
        assert engineName(2) == "Small"
        assert engineMods(2) == "PC"
        selectEngine(2).click()
        at EnginePage
        pcCheckbox.click()
        diagramFrontTires.click()
        at TirePage
        hdTires.click()
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
        toolbarModsButton.click()
        ramplate.click()
        toolbarArmorButton.click()
        singleFront.value("20")
        singleLeft.value("7")
        singleRight.value("7")
        singleBack.value("7")
        singleTop.value("3")
        singleUnderbody.value("8")
        clickOnDiagram(1, 1)
        at DefaultPage
        confirmResult(4402, 2400, 7, "Gladiator")
        assert modelTextDescription().contains('Minedropper Back w/10 Radio and Contact Detonated Mines')
    }

    @Test
    public void buildNeedle() { // $50 cheaper here
        /* Needle -- Subcompact, Heavy chassis, Heavy suspension, Small power plant, 4 Heavy-Duty tires, Driver, 2 Linked Flechette Guns Front each w/10 shots, Plastic Armor: F11, L10, R10, B10, T4, U7, 2 5-pt Wheelguards Back, 2 5-pt Wheelhubs Front, Acceleration 5, Top Speed 90, HC 4, 2400 lbs., $4222 */
        startCar()
//        clickOnDiagram
        diagramBody.click()
        at BodyPage
        previousChassis.click()
        diagramEngine.click()
        at EngineSelectorPage
        assert engineName(0) == "Small"
        assert engineMods(0) == ""
        selectEngine(0).click()
        at EnginePage
        diagramFrontTires.click()
        at TirePage
        hdTires.click()
        assert wheelhubUp.disabled
        classicButton.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        wheelhubUp.click()
        diagramBackTires.click()
        at TirePage
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        diagramFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Small Bore Projectile Wpns.").click()
        at WeaponListPage
        weapon("FG").click()
        at WeaponPage
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
        countUp.click()
        diagramRightArmor.click()
        at ArmorPage
        singleFront.value("11")
        singleLeft.value("10")
        singleRight.value("10")
        singleBack.value("10")
        singleTop.value("4")
        singleUnderbody.value("7")
        clickOnDiagram(1, 1)
        at DefaultPage
        diagramDesignName.click()
        at DesignPage
        designName.value("Needle")
        cwc.click()
        clickOnDiagram(1, 1)
        at DefaultPage
        confirmResult(4222, 2400, 7, "Needle")
        assert modelTextDescription().contains('2 Linked Flechette Guns Front each w/10 shots');
    }

    @Test
    public void buildCannon() { // Same cost, weight
        /* Cannon -- Reversed Light Trike, Standard chassis, Improved suspension, Medium Cycle power plant, 3 Motorcycle Heavy-Duty tires, Driver, Rocket Launcher Front, Plastic Armor: F40, L25, R25, B25, T7, U8, 2 4-pt Wheelguards Front, 1 4-pt Cycle Wheelguard Back, Acceleration 5, Top Speed 97.5, HC 1, 1600 lbs., $4950 */
        startTrike()
        diagramBody.click()
        at BodyPage
        reversed.click()
        diagramFrontTires.click()
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
        diagramBackTires.click()
        hdTires.click()
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
        wheelguardUp.click()
        wheelguardUp.click()
        diagramEngine.click()
        at EngineSelectorPage
        classicButton.click()
        assert engineName(2) == "Medium Cycle"
        assert engineMods(2) == "PC"
        selectEngine(2).click()
        at EnginePage
        pcCheckbox.click()
        diagramBody.click()
        at BodyPage
        previousChassis.click()
        previousChassis.click()
        diagramFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Rocket Launchers & Pods").click()
        at WeaponListPage
        weapon("RL").click()
        at WeaponPage
        diagramRightArmor.click()
        at ArmorPage
        singleFront.value("40")
        singleLeft.value("25")
        singleRight.value("25")
        singleBack.value("25")
        singleTop.value("7")
        singleUnderbody.value("8")
        diagramBody.click()
        at BodyPage
        previousSuspension.click()
        previousChassis.click()
        nextChassis.click()
        diagramFrontTires.click()
        at TirePage
        wheelguardDown.click()
        wheelguardDown.click()
        wheelguardDown.click()
        wheelguardDown.click()
        wheelguardDown.click()
        clickOnDiagram(2, 3)
        at DefaultPage
        diagramBackTires.click()
        at TirePage
        wheelguardDown.click()
        wheelguardDown.click()
        wheelguardDown.click()
        wheelguardDown.click()
        wheelguardDown.click()
        wheelguardDown.click()
        wheelguardDown.click()
        wheelguardDown.click()
        wheelguardUp.click()
        wheelguardUp.click()
        diagramFrontTires.click()
        wheelguardDown.click()
        clickOnDiagram(5, 1)
        at DefaultPage
        diagramDesignName.click()
        at DesignPage
        designName.value("Cannon")
        cwc.click()
        clickOnDiagram(3, 1)
        at DefaultPage
        confirmResult(4950, 1600, 5, "Cannon")
        assert modelTextDescription().contains('Rocket Launcher Front,');
    }

    @Test
    public void buildFirecracker() { // Same cost, weight
        /* Firecracker -- Subcompact, Extra-Heavy chassis, Heavy suspension, Medium power plant, 4 Puncture-Resistant tires, Driver, Spikedropper Back w/10 Explosive Spikes, Plastic Armor: F30 (Ramplate), L17, R17, B16, T5, U10, Gear Allocation: [85 lbs. @ Top Speed 120], Acceleration 10, Top Speed 122.5, HC 4, 2675 lbs., $4990 */
        startCar()
//        clickOnDiagram(239, 263)
        toolbarWeaponsButton.click()
        backWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Dropped Solids").click()
        at WeaponListPage
        classicButton.click()
        weapon("SD").click()
        at WeaponPage
        ammoNone("Spikes").click()
        ammoAddClip("ExplosiveSpikes").click()
//        clickOnDiagram(471, 200)
        toolbarEngineButton.click()
        at EngineSelectorPage
        accelerationUp.click()
        assert engineName(2) == "Medium"
        assert engineMods(2) == ""
        selectEngine(2).click()
        at EnginePage
//        clickOnDiagram(451, 319)
        toolbarTiresButton.click();
        frontTires.click()
        at TirePage
        prTires.click()
        toolbarModsButton.click()
        ramplate.click()
        toolbarArmorButton.click()
        singleFront.value("30")
        singleLeft.value("17")
        singleRight.value("17")
        singleBack.value("16")
        singleTop.value("5")
        singleUnderbody.value("10")
//        clickOnDiagram(386, 34)
        diagramDesignName.click()
        at DesignPage
        designName.value("Firecracker")
        cwc.click()
        clickOnDiagram(1, 1)
        at DefaultPage
        confirmResult(4990, 2675, 7, "Firecracker")
        assert modelTextDescription().contains('Spikedropper Back w/10 Explosive Spikes');
    }

    @Test
    public void buildCatapult() { // Cost, weight same
        /* Catapult -- Compact, Extra-Heavy chassis, Heavy suspension, Small power plant, Heavy-Duty Transmission, 4 Puncture-Resistant tires, Driver, Anti-Tank Gun Front, Composite Metal/Plastic Armor: F8/6, L8/6, R8/6, B8/6, T0/5, U4/6, Acceleration 2.5, Top Speed 52.5, HC 3, 4440 lbs., $7625 */
        startCar()
//        clickOnDiagram(393, 33)
        diagramDesignName.click()
        at DesignPage
        //color.value(0x2222DD)  TODO: setting an input[type=range] not supported by Selenium 2.43.1
        designName.value("Catapult")
        cwc.click()
//        clickOnDiagram(416, 205)
        toolbarBodyButton.click()
        at BodyPage
        bodyLabel('Compact').click()
        toolbarWeaponsButton.click()
        frontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Large Bore Projectile Wpns.").click()
        at WeaponListPage
        weapon("ATG").click()
        at WeaponPage
//        clickOnDiagram(396, 216)
        toolbarEngineButton.click()
        at EngineSelectorPage
        assert engineName(3) == "Medium"
        assert engineMods(3) == "SC"
        selectEngine(3).click()
        at EnginePage
        scCheckbox.click()
        smallerEngine.click()
        toolbarSportButton.click()
        hdTransmission.click()
//        clickOnDiagram(510, 318)
        toolbarTiresButton.click()
        backTires.click()
        at TirePage
        prTires.click()
        toolbarArmorButton.click()
        nextMetal.click()
        frontMetal.value("8")
        frontPlastic.value("6")
        leftMetal.value("8")
        leftPlastic.value("6")
        rightMetal.value("8")
        rightPlastic.value("6")
        backMetal.value("8")
        backPlastic.value("6")
        topPlastic.value("5")
        underbodyMetal.value("4")
        underbodyPlastic.value("6")
        clickOnDiagram(1, 1)
        at DefaultPage
        confirmResult(7625, 4440, 10, "Catapult")
        assert modelTextDescription().contains('Anti-Tank Gun Front,');
    }

    @Test
    public void build37Comet() { // Cost, weight same
        /* '37 Comet -- Heavy Cycle, Heavy suspension, Large Cycle power plant, 2 Motorcycle Puncture-Resistant Radial tires, Cyclist, Variable-Fire Rocket Pod Front, Plastic Armor: F12, B8, 2 5-pt Cycle Wheelguards, Acceleration 10, Top Speed 135, HC 3, 1300 lbs., $7090 */
        startCycle()
        toolbarBodyButton.click()
        bodyLabel('Heavy Cycle').click()
        toolbarTiresButton.click()
        frontTires.click()
        at TirePage
        prTires.click()
        radial.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        diagramBackTires.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        diagramFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Rocket Launchers & Pods").click()
        at WeaponListPage
        assert weapon("VFRP").hasClass('link-disabled')
        classicButton.click()
        assert !weapon("VFRP").hasClass('link-disabled')
        weapon("VFRP").click()
        at WeaponPage
        diagramEngine.click()
        at EngineSelectorPage
        accelerationUp.click()
        toolbarDesignButton.click()
        cwc.click()
        designName.value("'37 Comet")
        diagramEngine.click()
        at EngineSelectorPage
        accelerationUp.click()
        accelerationDown.click()
        assert engineName(2) == "Medium Cycle"
        assert engineMods(2) == "PC"
        selectEngine(2).click()
        at EnginePage
        pcCheckbox.click()
        biggerEngine.click()
        toolbarArmorButton.click()
        assert singleFront.displayed
        assert singleBack.displayed
        assert !singleLeft.displayed
        assert !singleRight.displayed
        assert !singleTop.displayed
        assert !singleUnderbody.displayed
        singleFront.value("12")
        singleBack.value("8")
        diagramEngine.click()
        at EnginePage
        clickOnDiagram(3, 2)
        at DefaultPage
        confirmResult(7090, 1300, 7, "'37 Comet")
        assert modelTextDescription().contains('Variable-Fire Rocket Pod Front,');
    }

    @Test
    public void buildTheSabre() { // Cost, weight same
        /* The Sabre -- Heavy Cycle, Heavy suspension, Large Cycle power plant, 2 Motorcycle Puncture-Resistant Radial tires, Cyclist, 2 Linked Flechette Guns Front each w/14 shots, Spikedropper Back w/10 Explosive Spikes, Plastic Armor: F19, B15, 2 4-pt Cycle Wheelguards, Acceleration 10, Top Speed 135, HC 3, 1300 lbs., $6518 */
        startCycle()
        at DefaultPage
        diagramBody.click()
        at BodyPage
        bodyLabel('Heavy Cycle').click()
        diagramEngine.click()
        at EngineSelectorPage
        classicButton.click()
        assert engineName(3) == "Small Cycle"
        assert engineMods(3) == "SC"
        selectEngine(3).click()
        at EnginePage
        scCheckbox.click()
        biggerEngine.click()
        biggerEngine.click()
        diagramBackTires.click()
        at TirePage
        prTires.click()
        radial.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        diagramFrontTires.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        diagramDesignName.click()
        at DesignPage
        designName.value("The Sabre")
        cwc.click()
//        $("label[for='CarColorBlack']").click() TODO: color
        diagramFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Small Bore Projectile Wpns.").click()
        at WeaponListPage
        weapon("FG").click()
        at WeaponPage
        countUp.click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        ammoDown("Normal").click()
        toolbarWeaponsButton.click()
        backWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Dropped Solids").click()
        at WeaponListPage
        weapon("SD").click()
        at WeaponPage
        ammoNone("Spikes").click()
        ammoAddClip("ExplosiveSpikes").click()
        toolbarArmorButton.click()
        singleFront.value("19")
        singleBack.value("15")
        clickOnDiagram(1, 2)
        at DefaultPage
        confirmResult(6518, 1300, 7, "The Sabre")
        def text = modelTextDescription();
        assert text.contains('Spikedropper Back w/10 Explosive Spikes,')
        assert text.contains('2 Linked Flechette Guns Front each w/14 shots,')
    }

    @Test
    public void buildTheRat() { // $50 less due to not linking MML to HR
        /* Rat -- Heavy Cycle, Heavy suspension, Large Cycle power plant, 2 Motorcycle Puncture-Resistant tires, Cyclist, Heavy Rocket Front, Micromissile Launcher Front, Micromissile Launcher Back, Link (all Front weapons), Plastic Armor: F16, B14, 2 10-pt Cycle Wheelguards, Gear Allocation: [5 lbs.], Acceleration 5, Top Speed 100, HC 3, 1295 lbs., $5810
           Heavy Sidecar, Improved Suspension, Motorcycle Puncture-Resistant tire, Gunner, Micromissile Launcher Front, Plastic Armor: F5, L1, R4, B4, U2, 1 2-pt Cycle Wheelguard, 750 lbs., $2150 */
        startCycle()
        at DefaultPage
        toolbarBodyButton.click()
        bodyLabel('Heavy Cycle').click()
        heavySidecar.click()
        nextSidecarSuspension.click()
        diagramSidecarTires.click()
        at TirePage
        prTires.click()
        wheelguardUp.click()
        wheelguardUp.click()
        diagramFrontTires.click()
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
        wheelguardUp.click()
        toolbarDesignButton.click()
        designName.value("Rat")
        diagramFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Rocket Launchers & Pods").click()
        at WeaponListPage
        weapon("MML").click()
        at WeaponPage
        toolbarWeaponsButton.click()
        frontWeapons.click()
        at WeaponsInLocationPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Single-Shot Rockets").click()
        at WeaponListPage
        weapon("HR").click()
        at WeaponPage
        diagramBackWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Rocket Launchers & Pods").click()
        at WeaponListPage
        weapon("MML").click()
        at WeaponPage
        toolbarWeaponsButton.click()
        sidecarFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Rocket Launchers & Pods").click()
        at WeaponListPage
        weapon("MML").click()
        at WeaponPage
        toolbarCrewButton.click()
        addSidecarGunner.click()
        sidecarGunner.click()
        at PersonPage
        toolbarDesignButton.click()
//        $("label[for='CarColorBlack']").click()  TODO: color
        toolbarArmorButton.click()
        singleFront.value("16")
        singleBack.value("14")
        singleBack.value("15")
        singleBack.value("14")
        clickOnDiagram(1, 1)
        at DefaultPage
        toolbarArmorButton.click()
        switchArmorLocation.click()
        singleFront.value("5")
        singleRight.value("4")
        singleBack.value("4")
        singleUnderbody.value("2")
        toolbarGearButton.click()
        linksButton.click()
        at LinksPage
        addLink.click()
        at LinkPage
        linkName("MML Front").click()
        linkName("HR Front").click()
        clickOnDiagram(2, 2)
        at DefaultPage
        confirmResult(5810, 1295, 7, "Rat")
        def text = modelTextDescription()
        assert text.contains('Heavy Rocket Front,')
        assert text.contains('Micromissile Launcher Front,')
        assert text.indexOf('Micromissile Launcher Front,', text.indexOf('Micromissile Launcher Front,') + 10) > 0
        assert text.contains('Micromissile Launcher Back,')
        assert text.contains('Link (both Front weapons),')
    }

    @Test
    public void buildAssassin() {
        /* Assassin -- Mid-sized, Light chassis, Heavy suspension, Medium power plant, 4 Heavy-Duty tires, Driver, Heavy Rocket Front, Variable-Fire Rocket Pod Front, 2 Linked Heavy Rockets Back, Link (all Front weapons), Plastic Armor: F25, L20, R20, B20, T9, U14, Acceleration 5, Top Speed 90, HC 3, 4199 lbs., $8258 */
        startCar()
//        clickOnDiagram(408, 33)
        toolbarDesignButton.click()
        at DesignPage
        designName.value("Assassin")
//        clickOnDiagram(419, 204)
        toolbarBodyButton.click()
        at BodyPage
        bodyLabel('Mid-sized').click()
        previousChassis.click()
        previousChassis.click()
        previousChassis.click()
//        clickOnDiagram(488, 224)
        toolbarEngineButton.click()
        at EngineSelectorPage
        assert engineName(0) == "Medium"
        assert engineMods(0) == ""
        selectEngine(0).click()
        at EnginePage
//        clickOnDiagram(561, 320)
        toolbarTiresButton.click()
        frontTires.click()
        at TirePage
        hdTires.click()
//        clickOnDiagram(581, 202)
        toolbarWeaponsButton.click()
        frontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Single-Shot Rockets").click()
        at WeaponListPage
        weapon("HR").click()
        at WeaponPage
//        clickOnDiagram(571, 239)
        toolbarWeaponsButton.click()
        frontWeapons.click()
        at WeaponsInLocationPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Rocket Launchers & Pods").click()
        at WeaponListPage
        classicButton.click()
        weapon("VFRP").click()
        at WeaponPage
        toolbarWeaponsButton.click()
        backWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Single-Shot Rockets").click()
        at WeaponListPage
        weapon("HR").click()
        at WeaponPage
        countUp.click()
//        clickOnDiagram(475, 300)
        toolbarArmorButton.click()
        at ArmorPage
        singleFront.value("25")
        singleLeft.value("20")
        singleRight.value("20")
        singleBack.value("20")
        singleTop.value("9")
        singleUnderbody.value("14")
        toolbarGearButton.click()
        linksButton.click()
        at LinksPage
        addLink.click()
        at LinkPage
        linkItem(0).click()
        linkItem(1).click()
        clickOnDiagram(1, 1)
        at DefaultPage
        confirmResult(8258, 4199, 12, "Assassin")
        def text = modelTextDescription()
        assert text.contains('Heavy Rocket Front,')
        assert text.contains('Variable-Fire Rocket Pod Front,')
        assert text.contains('2 Linked Heavy Rockets Back,')
        assert text.contains('Link (both Front weapons),')
    }

    @Test
    public void buildHighNoon() {
        /* High Noon -- Reversed Extra-Heavy Trike, Standard chassis, Heavy suspension, Super Trike power plant, 10-pt CA (Power Plant), 3 Motorcycle Heavy-Duty tires, Driver w/10-pt CA, Anti-Tank Gun Front w/10-pt CA, Metal Armor: F7, L7, R7, B7, T1, U1, Cargo: [2 spaces, 30 lbs. @ Top Speed 90], Acceleration 5, Top Speed 92.5, HC 3, 3470 lbs., $9875 */
        startTrike()
        diagramBody.click()
        at BodyPage
        reversed.click()
        bodyLabel('Extra-Heavy Trike').click()
        previousChassis.click()
        previousChassis.click()
        diagramFrontTires.click()
        at TirePage
        hdTires.click()
        diagramDesignName.click()
        at DesignPage
        designName.value("High Noon")
        cwc.click()
        diagramFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Large Bore Projectile Wpns.").click()
        at WeaponListPage
        weapon("ATG").click()
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
        caUp.click()
        diagramDriver.click()
        at PersonPage
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
        diagramEngine.click()
        at EngineSelectorPage
        assert engineName(2) == "Super Trike"
        assert engineMods(2) == ""
        selectEngine(2).click()
        at EnginePage
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
        diagramFrontArmor.click()
        at ArmorPage
        previousPlastic.click()
        nextMetal.click()
        singleFront.value("7")
        singleLeft.value("7")
        singleRight.value("7")
        singleBack.value("7")
        singleTop.value("1")
        singleUnderbody.value("1")
        sloped.click()
        assert !modelLegal()
        sloped.click()
        clickOnDiagram(2, 3)
        at DefaultPage
        confirmResult(9875, 3470, 11, "High Noon")
        assert modelTextDescription().contains('Anti-Tank Gun Front w/10-pt CA')
    }

    @Test
    public void buildBastille37() {
        /* '37 Bastille -- Compact, Heavy chassis, Heavy suspension, Large power plant, 4 Puncture-Resistant tires, Driver, Rocket Launcher Front, Spikedropper Back w/10 Explosive Spikes, Plastic Armor: F40 (Ramplate), L30, R30, B35, T15, U17, Gear Allocation: [73 lbs. @ Accel 5/Top Speed 117.5], Acceleration 10, Top Speed 120, HC 3, 3997 lbs., $8901 */
        startCar()
//        clickOnDiagram(422, 194)
        diagramBody.click()
        at BodyPage
        bodyLabel('Compact').click()
        previousChassis.click()
//        clickOnDiagram(432, 222)
        diagramEngine.click()
        at EngineSelectorPage
        toolbarDesignButton.click()
        cwc.click()
        designName.value("'37 Bastille")
//        clickOnDiagram(432, 196)
        diagramEngine.click()
        at EngineSelectorPage
        accelerationUp.click()
        assert engineName(2) == "Large"
        assert engineMods(2) == ""
        selectEngine(2).click()
        at EnginePage
//        clickOnDiagram(517, 72)
        diagramFrontTires.click()
        at TirePage
        prTires.click()
//        clickOnDiagram(601, 179)
        diagramRamplate.click()
//        clickOnDiagram(519, 199)
        diagramFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Rocket Launchers & Pods").click()
        at WeaponListPage
        weapon("RL").click()
        at WeaponPage
//        clickOnDiagram(178, 204)
        diagramBackWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Dropped Solids").click()
        at WeaponListPage
        weapon("SD").click()
        at WeaponPage
        ammoNone("Spikes").click()
        ammoAddClip("ExplosiveSpikes").click()
        toolbarArmorButton.click()
        singleFront.value("40")
        singleLeft.value("30")
        singleRight.value("30")
        singleBack.value("35")
        singleTop.value("15")
        singleUnderbody.value("17")
        clickOnDiagram(2, 2)
        at DefaultPage
        toolbarDesignButton.click()
//        color.value(0x2222DD)   TODO: setting an input[type=range] not supported by Selenium 2.43.1
        clickOnDiagram(3, 3)
        at DefaultPage
        confirmResult(8901, 3997, 10, "'37 Bastille")
    }

    @Test
    public void buildAvenger() {
        /* Avenger -- Compact, Heavy chassis, Heavy suspension, Medium power plant, 4 Puncture-Resistant tires, Driver, Anti-Tank Gun Front, Paint Spray Back, Plastic Armor: F27, L25, R25, B27, T11, U15, 2 10-pt Wheelguards Back, 2 10-pt Wheelhubs Front, Gear Allocation: [5 lbs.], Acceleration 5, Top Speed 90, HC 3, 4065 lbs., $8240 */
        startCar()
        diagramBody.click()
        bodyLabel('Compact').click()
        previousChassis.click()
        diagramFrontTires.click()
        prTires.click()
        classicButton.click()
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
        diagramFrontWeapons.click()
        at WeaponCategoriesPage
        toolbarWeaponsButton.click()
        frontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Large Bore Projectile Wpns.").click()
        at WeaponListPage
        weapon("ATG").click()
        at WeaponPage
        toolbarWeaponsButton.click()
        backWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Dropped Gasses").click()
        at WeaponListPage
        weapon("PS").click()
        at WeaponPage
        toolbarArmorButton.click()
        singleFront.value("27")
        singleLeft.value("25")
        singleRight.value("25")
        singleBack.value("27")
        singleTop.value("11")
        singleUnderbody.value("15")
        clickOnDiagram(2, 2)
        at DefaultPage
        diagramDesignName.click()
        at DesignPage
        designName.value("Avenger")
        clickOnDiagram(1, 1)
        at DefaultPage
        confirmResult(8240, 4065, 10, "Avenger")
    }

    @Test
    public void buildMarquisDeSade() {
        /* Marquis De Sade -- Compact, Extra-Heavy chassis, Heavy suspension, Medium power plant, 4 Puncture-Resistant tires, Driver, Vulcan Machine Gun Front w/20 shots High-Density, Light Rockets Left and Right, 2 Linked Light Rockets Back, Plastic Armor: F45, L37, R37, B45, T10, U26, Acceleration 5, Top Speed 90, HC 3, 4200 lbs., $9550 */
        startCar()
        diagramBody.click()
        at BodyPage
        classicButton.click()
        bodyLabel('Compact').click()
        previousChassis.click()
        nextChassis.click()
        diagramEngine.click()
        at EngineSelectorPage
        assert engineName(2) == "Medium"
        assert engineMods(2) == "PC"
        selectEngine(2).click()
        at EnginePage
        pcCheckbox.click()
        diagramDesignName.click()
        at DesignPage
        designName.value("Marquis De Sade")
        cwc.click()
        diagramFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Small Bore Projectile Wpns.").click()
        at WeaponListPage
        weapon("VMG").click()
        at WeaponPage
        ammoNone("Normal").click()
        ammoAddClip("HighDensity").click()
        diagramLeftWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Single-Shot Rockets").click()
        at WeaponListPage
        weapon("LtR").click()
        at WeaponPage
        toolbarWeaponsButton.click()
        rightWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Single-Shot Rockets").click()
        at WeaponListPage
        weapon("LtR").click()
        at WeaponPage
        toolbarWeaponsButton.click()
        backWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Single-Shot Rockets").click()
        at WeaponListPage
        weapon("LtR").click()
        at WeaponPage
        countUp.click()
        toolbarArmorButton.click()
        singleFront.value("45")
        singleLeft.value("37")
        singleRight.value("37")
        singleBack.value("45")
        singleTop.value("10")
        singleUnderbody.value("26")
        diagramFrontTires.click()
        at TirePage
        prTires.click()
        clickOnDiagram(1, 3)
        at DefaultPage
        confirmResult(9550, 4200, 10, "Marquis De Sade")
    }

    @Test
    void buildElToro() {
        /* El Toro -- Compact, Extra-Heavy chassis, Heavy suspension, Medium power plant, 4 Puncture-Resistant tires, Driver, Recoilless Rifle Front, Spoiler, Airdam, Plastic Armor: F50 (Ramplate), L30, R30, B30, T10, U15, 2 10-pt Wheelguards Back, 2 10-pt Wheelhubs Front, Cargo: [2 spaces, 80 lbs.], Acceleration 5, Top Speed 90, HC 3 (4 @60mph), 4120 lbs., $9220 */
        startCar()
        toolbarModsButton.click()
        ramplate.click()
        diagramAirdam.click()
        at SportPage
        diagramDesignName.click()
        at DesignPage
        designName.value("El Toro")
        cwc.click()
        diagramFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Small Bore Projectile Wpns.").click()
        at WeaponListPage
        weapon("RR").click()
        at WeaponPage
        diagramFrontTires.click()
        at TirePage
        prTires.click()
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
        diagramSpoiler.click()
        at SportPage
        diagramEngine.click()
        at EngineSelectorPage
        assert engineName(2) == "Small"
        assert engineMods(2) == "SC"
        selectEngine(2).click()
        at EnginePage
        biggerEngine.click()
        scCheckbox.click()
        diagramBody.click()
        at BodyPage
        bodyLabel('Compact').click()
        diagramFrontArmor.click()
        singleFront.value("50")
        singleLeft.value("30")
        singleRight.value("30")
        singleBack.value("30")
        singleTop.value("10")
        singleUnderbody.value("15")
        clickOnDiagram(5, 2)
        at DefaultPage
        confirmResult(9220, 4120, 8, "El Toro")
    }

    @Test
    void buildRhino() {
        /* Rhino -- Compact, Extra-Heavy chassis, Heavy suspension, Medium power plant, 4 Puncture-Resistant tires, Driver, Flaming Oil Jet Back Left, Spikedropper Back Right w/10 Explosive Spikes, Link (FOJ, SD), Plastic Armor: F85 (Ramplate), L40, R40, B40, T5, U16, 2 5-pt Wheelguards Back, 2 5-pt Wheelhubs Front, Acceleration 5, Top Speed 90, HC 3, 4196 lbs., $9821 */
        startCar()
        toolbarDesignButton.click()
        designName.value("Rhino")
        cwc.click()
        cwc.click()
        //color.value(0x2222DD) TODO
        diagramBody.click()
        at BodyPage
        bodyLabel('Compact').click()
        toolbarWeaponsButton.click()
        backLeftWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Dropped Liquids").click()
        at WeaponListPage
        weapon("FOJ").click()
        at WeaponPage
        toolbarWeaponsButton.click()
        backRightWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Dropped Solids").click()
        at WeaponListPage
        weapon("SD").click()
        at WeaponPage
        ammoNone("Spikes").click()
        ammoAddClip("ExplosiveSpikes").click()
        diagramRamplate.click()
        at BodyModsPage
        diagramFrontTires.click()
        at TirePage
        prTires.click()
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
        diagramEngine.click()
        at EngineSelectorPage
        assert engineName(3) == "Medium"
        assert engineMods(3) == "SC"
        selectEngine(3).click()
        at EnginePage
        scCheckbox.click()
        diagramFrontArmor.click()
        at ArmorPage
        singleFront.value("85")
        singleLeft.value("40")
        singleRight.value("40")
        singleBack.value("40")
        singleTop.value("5")
        singleUnderbody.value("16")
        toolbarGearButton.click()
        linksButton.click()
        at LinksPage
        addLink.click()
        at LinkPage
        linkItem(0).click()
        linkItem(1).click()
        clickOnDiagram(2, 4)
        at DefaultPage
        confirmResult(9821, 4196, 9, "Rhino")
    }

    @Test
    void buildUsurper() {
        // Original was 9750 with standard chassis, but illegal due to HD Trans requiring Heavy Chassis+
        /* Usurper -- Mid-sized, Heavy chassis, Heavy suspension, Small power plant, Heavy-Duty Transmission, 4 Puncture-Resistant tires, Driver, Anti-Tank Gun Front, Recoilless Rifle Back, Plastic Armor: F25, L25, R25, B25, T15, U10, Acceleration 2.5, Top Speed 50, HC 3, 4800 lbs., $10350 */
        startCar()
        toolbarWeaponsButton.click()
        frontWeapons.click()
        at WeaponCategoriesPage
        diagramBody.click()
        at BodyPage
        bodyLabel('Mid-sized').click()
        previousChassis.click()
        diagramEngine.click()
        at EngineSelectorPage
        assert engineName(0) == "Large"
        assert engineMods(0) == ""
        selectEngine(0).click()
        at EnginePage
        smallerEngine.click()
        smallerEngine.click()
        toolbarSportButton.click()
        assert hdTransmission.find('input').disabled
        classicButton.click()
        assert !hdTransmission.find('input').disabled
        hdTransmission.click()
        toolbarWeaponsButton.click()
        frontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Large Bore Projectile Wpns.").click()
        at WeaponListPage
        weapon("ATG").click()
        at WeaponPage
        toolbarWeaponsButton.click()
        backWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Small Bore Projectile Wpns.").click()
        at WeaponListPage
        weapon("RR").click();
        at WeaponPage
        diagramFrontTires.click()
        at TirePage
        prTires.click()
        diagramFrontArmor.click()
        at ArmorPage
        singleFront.value("25")
        singleLeft.value("25")
        singleRight.value("25")
        singleBack.value("25")
        singleTop.value("15")
        singleUnderbody.value("10")
        toolbarDesignButton.click()
        designName.value("Usurper")
        clickOnDiagram(1, 3)
        at DefaultPage
        confirmResult(10350, 4800, 12, "Usurper")
    }

    @Test
    void buildQuetzalcoatl() { // Off by $1000, 25lbs, 1 DP (Thunderkit?)
        /* Quetzalcoatl -- Medium Cycle, Heavy suspension, Medium Cycle power plant, 2 Motorcycle Puncture-Resistant Radial tires, Cyclist, Micromissile Launcher Front w/extra magazine and magazine switch and 10 shots Armor-Piercing and 10 shots Incendiary, Plastic Armor: F24, B15, 2 5-pt Cycle Wheelguards, Gear Allocation: [25 lbs.], Acceleration 5, Top Speed 90, HC 4, 1075 lbs., $5129
           Heavy Sidecar, Improved Suspension, Motorcycle Puncture-Resistant Radial tire, Heavy Flaming Oil Jet Back, Plastic Armor: F10, R10, B10, 700 lbs., $3500
         */
        startCycle()
        at DefaultPage
        diagramBody.click()
        at BodyPage
        bodyLabel('Medium Cycle').click()
        heavySidecar.click()
        nextSidecarSuspension.click()
        diagramFrontTires.click()
        at TirePage
        prTires.click()
        radial.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        diagramBackTires.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        wheelguardUp.click()
        diagramFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Rocket Launchers & Pods").click()
        at WeaponListPage
        weapon("MML").click()
        at WeaponPage
        ammoNone("Normal").click()
        classicButton.click()
        ammoAddClip("ArmorPiercing").click()
        ammoAddClip("Incendiary").click()
        magazineSwitch.click()
        toolbarWeaponsButton.click()
        sidecarBackWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Dropped Liquids").click()
        at WeaponListPage
        weapon("HFOJ").click()
        at WeaponPage
        toolbarArmorButton.click()
        singleFront.value("24")
        singleBack.value("15")
        switchArmorLocation.click()
        singleFront.value("10")
        singleLeft.value("0")
        singleRight.value("10")
        singleBack.value("10")
        singleTop.value("0")
        singleUnderbody.value("0")
        diagramEngine.click()
        at EngineSelectorPage
        toolbarDesignButton.click()
        cwc.click()
        designName.value("Quetzalcoatl")
        clickOnDiagram(5,5)
        at DefaultPage
        diagramEngine.click()
        at EngineSelectorPage
        accelerationUp.click()
        accelerationDown.click()
        assert engineName(2) == "Medium Cycle"
        assert engineMods(2) == ""
        selectEngine(2).click()
        at EnginePage
        clickOnDiagram(4,4)
        at DefaultPage
        diagramEngine.click()
        at EnginePage
        pcCheckbox.click()
        scCheckbox.click()
        scCheckbox.click()
        pcCheckbox.click()
        diagramBody.click()
        at BodyPage
        clickOnDiagram(2,2)
        at DefaultPage
        confirmResult(5129, 1075, 5, "Quetzalcoatl")
        confirmSidecar(3500, 700, 3)
    }

    @Test
    void buildHornet() {  // Same cost, weight
        /* Hornet -- Compact, Standard chassis, Heavy suspension, Medium power plant, 4 Puncture-Resistant tires, Driver, Light Laser in Turret w/Laser Guidance Link, 3x L/G Heavy Rocket Front, Plastic Armor: F25, L21, R21, B20, T18, U10, Gear Allocation: [10 lbs.], Acceleration 5, Top Speed 97.5, HC 3, 3690 lbs., $9995 */
        startCar()
        diagramBody.click()
        at BodyPage
        bodyLabel('Compact').click()
        toolbarTurretButton.click()
        at TurretListPage
        topTurret("Turret").click()
        at TurretPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Lasers").click()
        at WeaponListPage
        weapon("LL").click()
        at WeaponPage
        assert laserGuidanceLink.find('input').disabled
        classicButton.click()
        assert !laserGuidanceLink.find('input').disabled
        laserGuidanceLink.click()
        diagramFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Single-Shot Rockets").click()
        at WeaponListPage
        weapon("HR").click()
        at WeaponPage
        laserGuided.click()
        countUp.click()
        countUp.click()
        diagramFrontTires.click()
        at TirePage
        prTires.click()
        toolbarBodyButton.click();
        previousChassis.click()
        previousChassis.click()
        toolbarArmorButton.click()
        singleFront.value("25")
        singleLeft.value("21")
        singleRight.value("21")
        singleBack.value("20")
        singleTop.value("18")
        singleUnderbody.value("10")
        toolbarGearButton.click()
        linksButton.click()
        at LinksPage
        linkButton(0).click()
        at LinkPage
        removeButton.click()
        at LinksPage
        clickOnDiagram(4, 3)
        at DefaultPage
        toolbarDesignButton.click()
        designName.value("Hornet")
        cwc.click()
//        color.value(0x222222)  TODO
        clickOnDiagram(3, 1)
        at DefaultPage
        confirmResult(9995, 3690, 10, "Hornet")
        def text = modelTextDescription()
        assert text.contains('Light Laser in Turret w/Laser Guidance Link')
        assert text.contains('3 Laser-Guided Heavy Rockets Front')
    }

    @Test
    void buildKali() { // Cost $200 different, should use smart link?
        /* Kali -- Heavy Trike, Standard chassis, Heavy suspension, Super Cycle power plant, 3 Motorcycle Puncture-Resistant tires, Driver, Variable-Fire Rocket Pods Left and Right, Link (Both VFRPs), Plastic Armor: F25, L20, R20, B20, T20, U12, Gear Allocation: [6 lbs.], Acceleration 5, Top Speed 92.5, HC 2, 2794 lbs., $11588 */
        startTrike()
        classicButton.click()
        diagramFrontTires.click()
        at TirePage
        prTires.click()
        diagramBody.click()
        at BodyPage
        bodyLabel('Heavy Trike').click()
        previousChassis.click()
        previousChassis.click()
        diagramLeftWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Rocket Launchers & Pods").click()
        at WeaponListPage
        weapon("VFRP").click()
        at WeaponPage
        diagramRightWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Rocket Launchers & Pods").click()
        at WeaponListPage
        weapon("VFRP").click()
        at WeaponPage
        toolbarGearButton.click()
        linksButton.click()
        at LinksPage
        addLink.click()
        at LinkPage
        linkName("VFRP Left").click()
        linkName("VFRP Right").click()
        toolbarArmorButton.click()
        singleFront.value("25")
        singleLeft.value("20")
        singleRight.value("20")
        singleBack.value("20")
        singleTop.value("20")
        singleUnderbody.value("12")
        clickOnDiagram(2,1)
        at DefaultPage
        diagramDesignName.click()
        at DesignPage
        designName.value("Kali")
        clickOnDiagram(1, 2)
        at DefaultPage
        confirmResult(11588, 2794, 10, "Kali")
        def text = modelTextDescription()
        assert text.contains('Variable-Fire Rocket Pods Left and Right')
        assert text.contains('Link (both VFRPs)')
    }

    @Test
    void buildWarrior() {  // Same cost, weight
        /* Warrior -- Compact, Extra-Heavy chassis, Heavy suspension, Medium power plant, 4 Solid tires, Driver, Vulcan Machine Gun Front, 2 Linked Machine Guns Back, Plastic Armor: F35, L25, R25, B35, T15, U15, Acceleration 5, Top Speed 90, HC 3, 4200 lbs., $12100 */
        startCar()
        toolbarBodyButton.click();
        bodyLabel('Compact').click()
        diagramFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Small Bore Projectile Wpns.").click()
        at WeaponListPage
        weapon("VMG").click()
        at WeaponPage
        diagramFrontTires.click()
        at TirePage
        hdTires.click()
        prTires.click()
        solidTires.click()
        plasticoreTires.click()
        solidTires.click()
        toolbarBodyButton.click();
        previousChassis.click()
        nextChassis.click()
        diagramEngine.click()
        at EngineSelectorPage
        assert engineName(1) == "Large"
        assert engineMods(1) == ""
        selectEngine(1).click()
        at EnginePage
        smallerEngine.click()
        toolbarWeaponsButton.click()
        backWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Small Bore Projectile Wpns.").click()
        at WeaponListPage
        weapon("MG").click()
        at WeaponPage
        countUp.click()
        toolbarArmorButton.click()
        singleFront.value("35")
        singleLeft.value("25")
        singleRight.value("25")
        singleBack.value("35")
        singleTop.value("15")
        singleUnderbody.value("15")
        clickOnDiagram(2, 1)
        at DefaultPage
        diagramDesignName.click()
        at DesignPage
        designName.value("Warrior")
//        color.value(0x222222)  TODO
        clickOnDiagram(2, 3)
        at DefaultPage
        confirmResult(12100, 4200, 10, "Warrior")
        def text = modelTextDescription()
        assert text.contains('Vulcan Machine Gun Front')
        assert text.contains('2 Linked Machine Guns Back')
    }
}