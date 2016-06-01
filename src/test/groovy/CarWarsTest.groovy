import geb.junit4.*
import org.junit.Test

import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import java.sql.Connection
import java.sql.DriverManager

@RunWith(JUnit4)
class CarWarsTest extends GebReportingTest {
    private static Connection connect() {
        Class.forName("com.mysql.jdbc.Driver")
        return DriverManager.getConnection("jdbc:mysql://localhost/opentool_carwars", "opentool_carwars", "checkyoursix");
    }

    void startApp() {
        go()
        at LoadingPage
        newDesignLink.click()
        at NewVehiclePage
    }

    void startCar() {
        startApp()
        newCar.click()
        at DefaultPage
    }

    @Test
    void visitBodyScreen() {
        startCar()
        toolbarBodyButton.click()
        at BodyPage
    }

    @Test
    void testTour() {
        go()
        at LoadingPage
        startTour.click()
        closeButton.click()
    }

    @Test
    void testRemoveLinkBug() {
        startCar()
        toolbarWeaponsButton.click()
        frontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Small Bore Projectile Wpns.").click()
        at WeaponListPage
        weapon("MG").click()
        at WeaponPage
        classicButton.click()
        countUp.click()
        toolbarGearButton.click()
        linksButton.click()
        at LinksPage
        linkButton(0).click()
        at LinkPage
        removeButton.click()
        at LinksPage
        confirmResult(5166, 2200, 7, "Unnamed Design")
    }

    @Test
    void testTurretAndLinkText1() {
        startCar()
        toolbarBodyButton.click()
        at BodyPage
        bodyLabel('Mid-sized').click()
        toolbarTurretButton.click()
        at TurretListPage
        topTurret('Turret').click()
        at TurretPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Single-Shot Rockets").click()
        at WeaponListPage
        weapon("HR").click()
        at WeaponPage
        ammoNone("Normal").click()
        classicButton.click()
        ammoAddClip("ArmorPiercing").click()
        ammoAddClip("Incendiary").click()
        toolbarTurretButton.click()
        at TurretListPage
        topTurret('Turret').click()
        at TurretPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Lasers").click()
        at WeaponListPage
        weapon("TL").click()
        at WeaponPage
        toolbarTurretButton.click()
        at TurretListPage
        topTurret('Turret').click()
        at TurretPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Single-Shot Rockets").click()
        at WeaponListPage
        weapon("HR").click()
        at WeaponPage
        ammoNone("Normal").click()
        ammoAddClip("ArmorPiercing").click()
        ammoAddClip("Incendiary").click()
        clickOnDiagram(1, 1)
        at DefaultPage
        toolbarWeaponsButton.click()
        backWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Dropped Solids").click()
        at WeaponListPage
        weapon("SD").click()
        at WeaponPage
        ammoNone("Spikes").click()
        ammoAddClip("ExplosiveSpikes").click()
        toolbarWeaponsButton.click()
        backWeapons.click()
        at WeaponsInLocationPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Dropped Gasses").click()
        at WeaponListPage
        weapon("PS").click()
        at WeaponPage
        toolbarGearButton.click()
        linksButton.click()
        linkButton(0).click()
        linkItem(0).click()
        linkItem(1).click()
        clickOnDiagram(1, 1)
        at DefaultPage
        def text = modelTextDescription()
        assert text.contains('Turret w/2 Armor-Piercing Heavy Rockets each w/1 shot Incendiary in rocket magazine and Targeting Laser w/Laser Guidance Link,')
        assert text.contains('Link (both Back weapons)')
    }

    @Test
    void testTireDP() {
        startApp()
        newCar.click()
        classicButton.click()
        toolbarTiresButton.click()
        backTires.click()
        assert standardTires.text().contains("4 DP")
        standardTires.click()
        assert modelBackTireDP() == 4
        assert hdTires.text().contains("6 DP")
        hdTires.click()
        assert modelBackTireDP() == 6
        assert prTires.text().contains("9 DP")
        prTires.click()
        assert modelBackTireDP() == 9
        assert solidTires.text().contains("12 DP")
        solidTires.click()
        assert modelBackTireDP() == 12
        assert plasticoreTires.text().contains("25 DP")
        plasticoreTires.click()
        assert modelBackTireDP() == 25
        mainMenuButton.click()
        newDesign.click()
        newTenWheeler.click()
        toolbarTiresButton.click()
        backTires.click()
        assert standardTires.text().contains("8 DP")
        standardTires.click()
        assert modelBackTireDP() == 8
        assert hdTires.text().contains("12 DP")
        hdTires.click()
        assert modelBackTireDP() == 12
        assert prTires.text().contains("18 DP")
        prTires.click()
        assert modelBackTireDP() == 18
        assert solidTires.text().contains("24 DP")
        solidTires.click()
        assert modelBackTireDP() == 24
        assert plasticoreTires.text().contains("40 DP")
        plasticoreTires.click()
        assert modelBackTireDP() == 40
    }

    @Test
    void testTrikeCAFrameBug() {
        startApp()
        newTrike.click()
        diagramBody.click()
        at BodyPage
        reversed.click()
        toolbarSportButton.click()
        classicButton.click()
        caFrame.click()
        confirmResult(7716, 525, 3, "Unnamed Design")
        def worksheet = pdfWorksheet()
        def found = false
        worksheet.each() { row ->
            if (row['name'] == 'CA Frame') {
                found = true
                assert row['cost'] == 1125
            }
        }
        assert found
    }

    @Test
    void testCreateAccount() {
        def con = connect()
        def ps = con.prepareStatement("delete from car_wars_users where email='foo@bar.com'")
        ps.execute()
        ps.close()
        go()
        at LoadingPage
        assert !logout.displayed
        assert createAccount.displayed
        assert listDesigns.displayed
        createAccount.click()
        assert createAccount.classes().contains("link-disabled")
        email.value('foo@bar.com')
        assert !createAccount.classes().contains("link-disabled")
        assert withAlert(wait: true) { createAccount.click() }.startsWith("E-mail sent.")
        ps = con.prepareStatement("select confirmation_key from car_wars_users where email='foo@bar.com' and confirmed=false")
        def rs = ps.executeQuery()
        assert rs.next()
        def key = rs.getString(1)
        rs.close()
        ps.close()
        con.close()
        go("http://google.com/")
        go("#/load/confirm/" + key)
        at ConfirmAccountPage
        assert email == 'foo@bar.com'
        assert createAccount.classes().contains("link-disabled")
        name.value('Foo Bar')
        assert createAccount.classes().contains("link-disabled")
        password.value('FooBar')
        assert !createAccount.classes().contains("link-disabled")
        createAccount.click()
        closeButton.click()
        at NewVehiclePage
        newCar.click()
        mainMenuButton.click()
        assert logout.displayed
        assert !createAccount.displayed
        assert listDesigns.displayed
    }

    @Test
    void testStockCarSystem() {
        def name = "Unit Test Stock Car"
        def sigText = "Smarter is boring"
        def noteText = "Eggshell with laser hammer"
        def reviewText = "Where the heck is the armor?"
        // Delete existing stock car
        def con = connect()
        def ps = con.prepareStatement("delete from design_ratings where design_id = (select id from designs where design_name='${name}')")
        ps.execute()
        ps.close()
        ps = con.prepareStatement("delete from design_tags where design_id = (select id from designs where design_name='${name}')")
        ps.execute()
        ps.close()
        ps = con.prepareStatement("delete from designs where design_name='${name}'")
        ps.execute()
        ps.close()
        con.close()
        // Create a stock car
        go()
        at LoadingPage
        listDesigns.click()
        at LoginPage
//        assert emailField.displayed
//        assert passwordField.displayed
//        assert loginButton.displayed
        email.value("ammulder@alumni.princeton.edu")
        password.value("none")
        login.click()
        at DesignListDialog
        closeButton.click()
        at NewVehiclePage
        newCar.click()
        at DefaultPage
        diagramFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Lasers").click()
        at WeaponListPage
        classicButton.click()
        weapon("L").click()
        at WeaponPage
        diagramEngine.click()
        at EngineSelectorPage
        accelerationUp.click()
        accelerationUp.click()
        accelerationDown.click()
        assert engineName(2).indexOf(" cid") > -1
        cwcButton.click()
        assert engineName(2) == "Small"
        assert engineMods(2) == "SC, HTM"
        selectEngine(2).click()
        at EnginePage
        pcCheckbox.click()
        diagramFrontTires.click()
        at TirePage
        prTires.click()
        radial.click()
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
        diagramAirdam.click()
        diagramSpoiler.click()
        diagramDriver.click()
        at PersonPage
        nextBodyArmor.click()
        nextComputer.click()
        toolbarArmorButton.click()
        distribute.click()
//        singleFront.value("6")
//        singleRight.value("6")
//        singleLeft.value("6")
//        singleBack.value("6")
//        singleTop.value("6")
//        singleUnderbody.value("6")
        at ArmorPage
        toolbarDesignButton.click()
        designName.value(name)
//        $("label[for='CarColorBlack']").click()
        // Save as a stock car
        saveButton.click()
        at SavePage
        stockPrepare.click()
        at StockPage
        assert !arena.find('input').value()
        arena.click()
        assert arena.find('input').value()
        designerNotes.value(noteText)
        signature.value(sigText)
        startTagging.click()
        sporty.click()
        finishTagging.click()
        save.click()
        def id = designId
//      // Confirm that it's listed on the pending stock car screen
        mainMenuButton.click()
        adminMenu.click()
        reviewStock.click()
        waitFor { design(id).displayed }
        assert designName(id).text() == name
        assert designCost(id) == "14218"
        assert designBody(id) == 'Subcompact'
        assert designTechLevel(id) == 'UACFH/Pyramid'
        assert designHC(id) == "5"
        assert designAcceleration(id) == '5/10'
        assert designTopSpeed(id) == "90"
        assert designTags(id).contains("Div 15")
        assert designTags(id).contains("Sporty")
        assert designTags(id).contains("Electric")
        assert !designStars(id).displayed
        designName(id).click()
        waitFor { selected.displayed && !$("div.ng-modal-dialog-content", text: startsWith("Checking tech level")).displayed }
        assert selectedName.text() == name
        assert selectedCost == "14218"
        assert selectedBody == 'Subcompact'
        assert selectedTechLevel == 'UACFH/Pyramid'
        assert selectedHC == "5"
        assert selectedAcceleration == '5/10'
        assert selectedTopSpeed == "90"
        assert selectedTags.contains("Div 15")
        assert selectedTags.contains("Sporty")
        assert selectedTags.contains("Electric")
        def text = tagsButton.text()
        assert text.contains("Electric")
        assert text.contains("Sporty")
        assert text.indexOf(',', text.indexOf(',')+1) < 0
        assert arenaCheckbox.text() == "Arena Design (Div 15)"
        assert arenaCheckbox.find('input').value()
        assert designerNotes.value() == noteText
        assert designerSignature.value() == sigText
        assert reviewerNotes.value() == ""
        assert ratingNot(1)
        assert ratingNot(2)
        assert ratingNot(3)
        assert ratingNot(4)
        assert ratingNot(5)
        tagsButton.click()
        assert !tagged("Gas")
        assert tagged("Electric")
        assert !tagged("Anti-Ped")
        assert !tagged("Tire Shot")
        assert !tagged("Incendiary")
        assert !tagged("Rammer")
        assert !tagged("Racer")
        assert tagged("Sporty")
        assert !tagged("Off-Road")
        assert !tagged("Everyday")
        assert !tagged("Police")
        assert !tagged("Emergency")
        assert !tagged("Bandit")
        assert !tagged("Commercial")
        assert !tagged("Courier")
        assert !tagged("Convoy")
        assert !tagged("Front Man")
        assert !tagged("Tail-End")
        assert !tagged("Cargo")
        assert !tagged("Passenger")
        assert !tagged("Executive")
        tag("Tire Shot").click()

        doneTagging.click()
        returnToList.click()
        returnToDesigner.click()
        // Log in as Juris and check everything for the car in the pending stock car screen
        at DefaultPage
        mainMenuButton.click()
        assert listDesigns.text() == 'View Your Designs'
        assert logout.displayed
        logout.click()
        waitFor { !logout.displayed }
        listDesigns.click()
        at LoginPage
        email.value("joneillaw@gmail.com")
        password.value("none")
        login.click()
        at DesignListDialog
        closeButton.click()
        at DefaultPage
        mainMenuButton.click()
        reviewStock.click()
        waitFor { design(id).displayed }
        assert designName(id).text() == name
        assert designCost(id) == "14218"
        assert designBody(id) == 'Subcompact'
        assert designTechLevel(id) == 'UACFH/Pyramid'
        assert designHC(id) == "5"
        assert designAcceleration(id) == '5/10'
        assert designTopSpeed(id) == "90"
        assert designTags(id).contains("Div 15")
        assert designTags(id).contains("Sporty")
        assert designTags(id).contains("Electric")
        assert !designStars(id).displayed
        designName(id).click()
        waitFor { selected.displayed && !$("div.ng-modal-dialog-content", text: startsWith("Checking tech level")).displayed }
        assert selectedName.text() == name
        assert selectedCost == "14218"
        assert selectedBody == 'Subcompact'
        assert selectedTechLevel == 'UACFH/Pyramid'
        assert selectedHC == "5"
        assert selectedAcceleration == '5/10'
        assert selectedTopSpeed == "90"
        assert selectedTags.contains("Div 15")
        assert selectedTags.contains("Sporty")
        assert selectedTags.contains("Electric")
        text = tagsButton.text()
        assert text.contains("Electric")
        assert text.contains("Sporty")
        assert text.indexOf(',', text.indexOf(',')+1) < 0
        assert arenaCheckbox.text() == "Arena Design (Div 15)"
        assert arenaCheckbox.find('input').value()
        assert designerNotes.value() == noteText
        assert designerSignature.value() == sigText
        assert reviewerNotes.value() == ""
        assert ratingNot(1)
        assert ratingNot(2)
        assert ratingNot(3)
        assert ratingNot(4)
        assert ratingNot(5)
        tagsButton.click()
        assert !tagged("Gas")
        assert tagged("Electric")
        assert !tagged("Anti-Ped")
        assert !tagged("Tire Shot")
        assert !tagged("Incendiary")
        assert !tagged("Rammer")
        assert !tagged("Racer")
        assert tagged("Sporty")
        assert !tagged("Off-Road")
        assert !tagged("Everyday")
        assert !tagged("Police")
        assert !tagged("Emergency")
        assert !tagged("Bandit")
        assert !tagged("Commercial")
        assert !tagged("Courier")
        assert !tagged("Convoy")
        assert !tagged("Front Man")
        assert !tagged("Tail-End")
        assert !tagged("Cargo")
        assert !tagged("Passenger")
        assert !tagged("Executive")
        tag("Tire Shot").click()

        doneTagging.click()
        // Review and publish the design as Juris
        reviewerNotes.value(reviewText);
        assert ratingNot(1)
        assert ratingNot(2)
        assert ratingNot(3)
        assert ratingNot(4)
        assert ratingNot(5)
        ratingLink(1).click()
        assert ratingAtLeast(1)
        assert ratingNot(2)
        assert ratingNot(3)
        assert ratingNot(4)
        assert ratingNot(5)
        withAlert(wait: 10) {publish.click()} == "Generated 2-page PDF for ${name}"
        returnToDesigner.click()
        at DefaultPage
//      // Check out the stock car listing as Juris
        mainMenuButton.click()
        stockCars.click()
        arenaHeader.click()
        div15.click()
        Thread.sleep(400)
        waitFor { !loading.displayed }
        assert designName(id).text() == name
        assert designCost(id) == "14218"
        assert designBody(id) == 'Subcompact'
        assert designTechLevel(id) == 'UACFH/Pyramid'
        assert designHC(id) == "5"
        assert designAcceleration(id) == '5/10'
        assert designTopSpeed(id) == "90"
        assert designTags(id).contains("Div 15")
        assert designTags(id).contains("Sporty")
        assert designTags(id).contains("Tire Shot")
        assert designTags(id).contains("Electric")
        assert designStars(id).displayed
        assert designStarChecked(id, "1")
        assert !designStarChecked(id, "2")
        assert !designStarChecked(id, "3")
        assert !designStarChecked(id, "4")
        assert !designStarChecked(id, "5")
        designName(id).click()
        assert selectedName.text() == name
        assert selectedCost == "14218"
        assert selectedBody == 'Subcompact'
        assert selectedTechLevel == 'UACFH/Pyramid'
        assert selectedHC == "5"
        assert selectedAcceleration == '5/10'
        assert selectedTopSpeed == "90"
        assert selectedTags.contains("Div 15")
        assert selectedTags.contains("Sporty")
        assert selectedTags.contains("Tire Shot")
        assert selectedTags.contains("Electric")
        text = yourTags.text()
        assert text.contains("Electric")
        assert text.contains("Sporty")
        assert text.contains("Tire Shot")
        assert text.indexOf(',', text.indexOf(',', text.indexOf(',', text.indexOf(',')+1)+1)+1) < 0
        assert selectedSignature == sigText
        assert rating(0).displayed
        assert rating(1).displayed
        assert ratingUser(0) == 'Designer Notes:'
        assert ratingUser(1) == 'Joe says:'
        assert ratingComments(0) == noteText
        assert ratingComments(1) == reviewText
        assert !ratingStars(0).displayed
        assert ratingStarChecked(1, "1")
        assert !ratingStarChecked(1, "2")
        assert !ratingStarChecked(1, "3")
        assert !ratingStarChecked(1, "4")
        assert !ratingStarChecked(1, "5")
        assert yourComments.value() == reviewText
        assert ratingAtLeast(1);
        assert ratingNot(2)
        assert ratingNot(3)
        assert ratingNot(4)
        assert ratingNot(5)
        returnToList.click();
        closeButton.click()
        at DefaultPage
        // Sign off and check values on the stock car list
        mainMenuButton.click()
        assert listDesigns.text() == 'View Your Designs'
        assert logout.displayed
        logout.click()
        waitFor { !logout.displayed }
        stockCars.click()
        arenaHeader.click()
        div15.click()
        waitFor { loading.displayed }
        waitFor { !loading.displayed }
        assert designName(id).text() == name
        assert designCost(id) == "14218"
        assert designBody(id) == 'Subcompact'
        assert designTechLevel(id) == 'UACFH/Pyramid'
        assert designHC(id) == "5"
        assert designAcceleration(id) == '5/10'
        assert designTopSpeed(id) == "90"
        assert designTags(id).contains("Div 15")
        assert designTags(id).contains("Sporty")
        assert designTags(id).contains("Tire Shot")
        assert designTags(id).contains("Electric")
        assert designStars(id).displayed
        assert designStarChecked(id, "1")
        assert !designStarChecked(id, "2")
        assert !designStarChecked(id, "3")
        assert !designStarChecked(id, "4")
        assert !designStarChecked(id, "5")
        designName(id).click()
        // Log in as Hemlock from the stock car screen
        signIn.click()
        at LoginPage
        email.value("LeonAdrian11@hotmail.com")
        password.value("none")
        login.click()
        at StockCarPage
        // Confirm values on the stock car screen
        assert selectedName.text() == name
        assert selectedCost == "14218"
        assert selectedBody == 'Subcompact'
        assert selectedTechLevel == 'UACFH/Pyramid'
        assert selectedHC == "5"
        assert selectedAcceleration == '5/10'
        assert selectedTopSpeed == "90"
        assert selectedTags.contains("Div 15")
        assert selectedTags.contains("Sporty")
        assert selectedTags.contains("Tire Shot")
        assert selectedTags.contains("Electric")
        assert yourTags.text().contains("none yet");
        assert selectedSignature == sigText
        assert rating(0).displayed
        assert rating(1).displayed
        assert ratingUser(0) == 'Designer Notes:'
        assert ratingUser(1) == 'Joe says:'
        assert ratingComments(0) == noteText
        assert ratingComments(1) == reviewText
        assert !ratingStars(0).displayed
        assert ratingStarChecked(1, "1")
        assert !ratingStarChecked(1, "2")
        assert !ratingStarChecked(1, "3")
        assert !ratingStarChecked(1, "4")
        assert !ratingStarChecked(1, "5")
        assert yourComments.value() == ''
        assert ratingNot(1);
        assert ratingNot(2)
        assert ratingNot(3)
        assert ratingNot(4)
        assert ratingNot(5)
        yourTags.click()
        tag('Electric').click()
        tag('Sporty').click()
        doneTagging.click()
        text = yourTags.text()
        assert text.contains("Electric")
        assert text.contains("Sporty")
        yourComments.value("Firepower is the best defense")
        ratingLink(3).click()
        saveReview.click()
        // Wait for the AJAX call to complete so new statistics are available
        waitFor { !$("div.ng-modal-dialog-content", text: startsWith("Saving your review")).displayed }
        assert rating(2).displayed
        assert ratingUser(2) == 'Leon Adrian says:'
        assert ratingComments(2) == 'Firepower is the best defense'
        assert !ratingStars(0).displayed
        assert ratingStarChecked(2, "1")
        assert ratingStarChecked(2, "2")
        assert ratingStarChecked(2, "3")
        assert !ratingStarChecked(2, "4")
        assert !ratingStarChecked(2, "5")
        returnToList.click()
        assert designTags(id).contains("Div 15")
        assert designTags(id).contains("Sporty")
        assert designTags(id).contains("Tire Shot")
        assert designTags(id).contains("Electric")
        // Make sure average rating is now 2 (1 + 3 / 2 reviews)
        assert designStarChecked(id, "1")
        assert designStarChecked(id, "2")
        assert !designStarChecked(id, "3")
        assert !designStarChecked(id, "4")
        assert !designStarChecked(id, "5")
        closeButton.click()
        at DefaultPage
        go("#/adminReview")
        at AdminReviewPage
        waitFor { !loading.displayed }
        assert $("#StockListScroll").text() == 'Unable to load stock cars'
        returnToDesigner.click()
        at DefaultPage
        // Must start logged in as an admin or the admin screens will just blow up
        mainMenuButton.click()
        logout.click()
        waitFor { !logout.displayed }
        listDesigns.click()
        at LoginPage
        email.value("joneillaw@gmail.com")
        password.value("none")
        login.click()
        at DesignListDialog
        go()
        at LoadingPage
        assert listDesigns.text() == 'View Your Designs'
        assert logout.displayed
        logout.click()
        waitFor { !logout.displayed }
        newDesignLink.click()
        at NewVehiclePage
        newCar.click()
        at DefaultPage
        go("#/adminReview")
        at AdminReviewPage
        waitFor { !loading.displayed }
        assert $("#StockListScroll").text() == 'Unable to load stock cars'
    }

    @Test
    void testHTMMessage() {
        startCar()
        classicButton.click()
        toolbarEngineButton.click()
        at EngineSelectorPage
        assert engineName(3) == "Small"
        assert engineMods(3) == "PC, SC"
        selectEngine(3).click()
        at EnginePage
        assert htmCheckbox.find('input').disabled
        cwcButton.click()
        assert !htmCheckbox.find('input').disabled
        htmCheckbox.click()
        assert htm
        checkCostPopup()
        toolbarBodyButton.click()
        at BodyPage
    }

    @Test
    void testHandWeaponsNoAmmo() {
        startCar()
        toolbarCrewButton.click()
        carDriver.click()
        at PersonPage
        gearButton.click()
        weaponCategory("Light Weapons").click()
        weapon("BwK").click()
        assert name == 'Bowie Knife'
        backButton.click()
        addWeapon.click()
        weaponCategory("Hand Grenades").click()
        weapon("ConcussionGrenade").click()
        assert name == '1 Concussion Grenade'
        def worksheet = pdfWorksheet()
        def found = false
        worksheet.each() { row ->
            if (row['name'] == 'Concussion Grenade') {
                found = true
                assert row['cost'] == 40
                assert row['weight'] == 0
                assert row['ge'] == 1
            }
        }
        assert found
        countUp.click()
        assert name == '2 Concussion Grenades'
        backButton.click()
        worksheet = pdfWorksheet()
        found = false
        worksheet.each() { row ->
            if (row['name'] == '2 Concussion Grenades') {
                found = true
                assert row['cost'] == 80
                assert row['weight'] == 0
                assert row['ge'] == 2
            }
        }
        assert found
    }

    @Test
    void testNumberInputs() {
        startCar()
        toolbarGearButton.click()
        cargoButton.click()
        def beforeWeight = modelTotalWeight()
        def beforeSpace = modelSpaceUsed()
        weight.value(100)
        space.value(1)
        assert modelTotalWeight() == beforeWeight + 100
        assert modelSpaceUsed() == beforeSpace + 1
    }

    @Test
    void testCAinEWP() {
        startCar()
        toolbarBodyButton.click()
        at BodyPage
        bodyLabel('Mid-sized').click()
        toolbarTurretButton.click()
        at TurretListPage
        classicButton.click()
        topTurret("EWP").click()
        at TurretPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Small Bore Projectile Wpns.").click()
        at WeaponListPage
        weapon("MG").click()
        at WeaponPage
        assert caUp.@disabled;
        assert caDown.@disabled;
        assert caText.classes().contains("text-disabled")
        countDown.click()
        at TurretPage
        removeTurret("EWP").click()
        at TurretListPage
        topTurret("Turret").click()
        at TurretPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Small Bore Projectile Wpns.").click()
        at WeaponListPage
        weapon("MG").click()
        at WeaponPage
        assert !caUp.@disabled;
        assert !caDown.@disabled;
        assert !caText.classes().contains("text-disabled")

        mainMenuButton.click()
        newDesign.click()
        at NewVehiclePage
        newCycle.click()
        at DefaultPage
        classicButton.click()
        diagramBody.click()
        at BodyPage
        bodyLabel('Heavy Cycle').click()
        smallCTS.click()
        toolbarTurretButton.click()
        at TurretListPage
        topTurret("EWP").click()
        at TurretPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Single-Shot Rockets").click()
        at WeaponListPage
        weapon("LtR").click()
        at WeaponPage
        assert caUp.@disabled
        assert caDown.@disabled
        assert caText.classes().contains("text-disabled")

        diagramSidecarTurret.click()
        at TurretPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Single-Shot Rockets").click()
        at WeaponListPage
        weapon("LtR").click()
        at WeaponPage
        assert !caUp.@disabled
        assert !caDown.@disabled
        assert !caText.classes().contains("text-disabled")
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
        // TODO: modelTextDescription contains CA?
    }

    @Test
    void testEWPSaveLoad() {
        startCar()
        toolbarBodyButton.click()
        at BodyPage
        bodyLabel('Mid-sized').click()
        toolbarTurretButton.click()
        at TurretListPage
        classicButton.click()
        sideTurret("EWP").click()
        at TurretPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Small Bore Projectile Wpns.").click()
        at WeaponListPage
        weapon("MG").click()
        at WeaponPage
        diagramSideTurret.click()
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Rocket Launchers & Pods").click()
        at WeaponListPage
        weapon("MML").click()
        at WeaponPage
        diagramFrontWeapons.click()
        at WeaponCategoriesPage
        weaponCategory("Small Bore Projectile Wpns.").click()
        at WeaponListPage
        weapon("MG").click()
        at WeaponPage
        diagramFrontWeapons.click()
        at WeaponsInLocationPage
        addWeapon.click()
        at WeaponCategoriesPage
        weaponCategory("Rocket Launchers & Pods").click()
        at WeaponListPage
        weapon("MML").click()
        at WeaponPage
        toolbarGearButton.click()
        linksButton.click()
        addLink.click()
        linkName("MG Front").click()
        linkName("MG in Left EWP").click()
        linkName("MG in Right EWP").click()
        backButton.click()
        addLink.click()
        linkName("MG Front").click()
        linkName("MG in Left EWP").click()
        backButton.click()
        addLink.click()
        linkName("MG Front").click()
        linkName("MG in Right EWP").click()
        backButton.click()
        addLink.click()
        linkName("MG in Left EWP").click()
        linkName("MG in Right EWP").click()
        backButton.click()
        addLink.click()
        linkName("MML Front").click()
        linkName("MML in Left EWP").click()
        linkName("MML in Right EWP").click()
        backButton.click()
        addLink.click()
        linkName("MML Front").click()
        linkName("MML in Left EWP").click()
        backButton.click()
        addLink.click()
        linkName("MML Front").click()
        linkName("MML in Right EWP").click()
        backButton.click()
        addLink.click()
        linkName("MML in Left EWP").click()
        linkName("MML in Right EWP").click()
        toolbarBodyButton.click()
        assert modelTextDescription().contains("Link (all MGs)");
        assert modelTextDescription().contains("Link (MG Front, MG in Left EWP)");
        assert modelTextDescription().contains("Link (MG Front, MG in Right EWP)");
        assert modelTextDescription().contains("Link (MG in Left EWP, MG in Right EWP)");
        assert modelTextDescription().contains("Link (all MMLs)");
        assert modelTextDescription().contains("Link (MML Front, MML in Left EWP)");
        assert modelTextDescription().contains("Link (MML Front, MML in Right EWP)");
        assert modelTextDescription().contains("Link (MML in Left EWP, MML in Right EWP)");
        def cost = modelTotalCost()
//        println js."angular.element(document.body).injector().get('server').generateDesignData(angular.element(document.body).injector().get('vehicle').car).design_data;"
        js."angular.element(document.body).scope().loadDesign(JSON.parse(angular.element(document.body).injector().get('server').generateDesignData(angular.element(document.body).injector().get('vehicle').car).design_data));"
        at DefaultPage
        assert modelLegal()
        assert cost == modelTotalCost()
        assert modelTextDescription().contains("Link (all MGs)");
        assert modelTextDescription().contains("Link (MG Front, MG in Left EWP)");
        assert modelTextDescription().contains("Link (MG Front, MG in Right EWP)");
        assert modelTextDescription().contains("Link (MG in Left EWP, MG in Right EWP)");
        assert modelTextDescription().contains("Link (all MMLs)");
        assert modelTextDescription().contains("Link (MML Front, MML in Left EWP)");
        assert modelTextDescription().contains("Link (MML Front, MML in Right EWP)");
        assert modelTextDescription().contains("Link (MML in Left EWP, MML in Right EWP)");
    }

    @Test
    public void testMagazineOptions() {
        go()
        at LoadingPage
        newDesignLink.click()
        at NewVehiclePage
//    clickOnCanvasXY(134,76)
        clickOnCanvas('createNewCar')
        at DefaultPage
//    clickOnCanvasXY(339,144)
        clickOnCanvas('editFrontWeapons')
        at WeaponCategoriesPage
        weaponCategory('Small Bore Projectile Wpns.').click()
        at WeaponListPage
        weapon('MG').click()
        at WeaponPage
        assert caText.classes().contains("text-disabled")
        assert rotaryMagazine.find('input').@disabled
        assert magazineSwitch.find('input').@disabled
        assert concealment.find('input').@disabled
        classicButton.click()
        assert !caText.classes().contains("text-disabled")
        assert rotaryMagazine.find('input').@disabled
        assert magazineSwitch.find('input').@disabled
        assert !concealment.find('input').@disabled
        ammoAddClip("Explosive").click()
        assert rotaryMagazine.find('input').@disabled
        assert !magazineSwitch.find('input').@disabled
        assert !concealment.find('input').@disabled
        ammoDown("Explosive").click()
        assert !rotaryMagazine.find('input').@disabled
        assert !magazineSwitch.find('input').@disabled
        assert !concealment.find('input').@disabled
    }

    @Test
    public void testSearchlightAccessories() {
        go()
        at LoadingPage
        newDesignLink.click()
        at NewVehiclePage
//    clickOnCanvasXY(134,76)
        clickOnCanvas('createNewCar')
        at DefaultPage
//    clickOnCanvasXY(339,144)
        clickOnCanvas('editFrontWeapons')
        at WeaponCategoriesPage
        weaponCategory('Mounted Accessories').click()
        at WeaponListPage
        weapon('SLT').click()
        at WeaponPage
        assert caText.classes().contains("text-disabled")
        assert rotaryMagazine.find('input').@disabled
        assert magazineSwitch.find('input').@disabled
        assert concealment.find('input').@disabled
        classicButton.click()
        // CA enabled due to more space from smaller engine
        // Rotary mag / mag switch never enabled
        // Concealment enabled for CWC tech and up
        assert !caText.classes().contains("text-disabled")
        assert rotaryMagazine.find('input').@disabled
        assert magazineSwitch.find('input').@disabled
        assert !concealment.find('input').@disabled
        cwcButton.click()
        assert !caText.classes().contains("text-disabled")
        assert rotaryMagazine.find('input').@disabled
        assert magazineSwitch.find('input').@disabled
        assert !concealment.find('input').@disabled
    }

    @Test
    public void testPopupBody() {
        startCar()
        toolbarBodyButton.click()
        toolbarMidsize.click()
        assert hasBody('Mid-sized')
        assert modelTextDescription().contains("Mid-sized")
        toolbarBodyButton.click()
        toolbarCompact.click()
        assert hasBody('Compact')
        assert modelTextDescription().contains("Compact")
        startApp()
        newCycle.click()
        at DefaultPage
        toolbarBodyButton.click()
        assert hasBody('Light Cycle')
        assert noSidecar.find('input').value() != null
        assert modelTextDescription().contains("Light Cycle")
        assert !modelTextDescription().contains("Sidecar")
        toolbarHeavyCycle.click()
        assert hasBody('Heavy Cycle')
        assert noSidecar.find('input').value() != null
        assert modelTextDescription().contains("Heavy Cycle")
        assert !modelTextDescription().contains("Sidecar")
        toolbarBodyButton.click()
        toolbarMediumSidecar.click()
        assert hasBody('Medium Cycle')
        assert lightSidecar.find('input').value() != null
        assert modelTextDescription().contains("Medium Cycle")
        assert modelTextDescription().contains("Light Sidecar")
    }
}
