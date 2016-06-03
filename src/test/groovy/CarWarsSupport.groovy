import geb.Page

class LoadingPage extends CarWarsPage {
    static at = { waitFor { $("#Loading").displayed } }
    static content = {
        loadingMenu { $("#LoadingMenu") }
        newDesignLink(to: NewVehiclePage) { $("a.item", text: "Create a New Design") }
        listDesigns { $("a.item", text: endsWith("View Your Designs")) }
        searchByName(to: NameSearchPage) { $("a.item", text: "Search Public Designs") }
        stockCars(to: StockListPage) { $("a.item", text: "Browse Stock Cars") }
        startTour(to:TourDialog) { $("a.item", text: "Take the Tour") }
        logout(required: false) { $("a.item", text: startsWith("Sign Out")) }
        createAccount(required: false, to: CreateAccountPage) { $("a.item", text: "Create an Account") }
    }
}

class CarWarsPage extends Page {
    static content = {
        diagram { $("canvas.ng-scope") }
        mainMenuButton(to: MainMenu) { $("a.tight-button", text: containsWord("Menu")) }
        classicButton { $("a.tight-button", text: "Classic") }
        cwcButton { $("a.tight-button", text: "CWC") }
        uacfhButton { $("a.tight-button", text: "UACFH") }
        diagramDesignName(to: DesignPage) { $("div.hover-name") }
        statusCostLabel { $("div.label.cost") }
        statusCost { $("div.field.cost").text() }
        toolbarBodyButton(to: BodyPage) { $("a.button").has("div.label", text: "Body") }
        toolbarCrewButton(to: AllCrewPage) { $("a.button").has("div.label", text: "Crew") }
        toolbarTiresButton(to: AllTiresPage) { $("a.button").has("div.label", text: "Tires") }
        toolbarSportButton(to: SportPage) { $("a.button").has("div.label", text: "Sport") }
        toolbarModsButton(to: BodyModsPage) { $("a.button").has("div.label", text: "Mods") }
        toolbarWeaponsButton(to: AllWeaponsPage) { $("a.button").has("div.label", text: "Weapons") }
        toolbarArmorButton(to: ArmorPage) { $("a.button").has("div.label", text: "Armor") }
        toolbarGearButton(to: GearCategoriesPage) { $("a.button").has("div.label", text: "Gear") }
        toolbarDesignButton(to: DesignPage) { $("a.button").has("div.label", text: "Design") }
        toolbarTurretButton() { $("a.button").has("div.label", text: "Turret") }
        toolbarEngineButton() { $("a.button").has("div.label", text: "Engine") }

        diagramBody(aliases: 'toolbarBodyButton') // (419, 198) (424, 203)
        diagramFifthWheel(aliases: 'toolbarBodyButton')
        diagramEngine(aliases: 'toolbarEngineButton') // (478, 199) (371, 214)
        diagramRightArmor(aliases: 'toolbarArmorButton') // (339, 312)?
        diagramLeftArmor(aliases: 'toolbarArmorButton')
        diagramBackArmor(aliases: 'toolbarArmorButton')
        diagramFrontArmor(aliases: 'toolbarArmorButton') // (553, 275)?
        diagramDriver(to: PersonPage) { // (388, 199)
            toolbarCrewButton.click()
            $("a.item", text: "Driver")
        }
        diagramCyclist(to: PersonPage) { // (388, 199)
            toolbarCrewButton.click()
            $("a.item", text: "Cyclist") // (354, 169)
        }
        diagramGunner(to: PersonPage) {
            toolbarCrewButton.click()
            $("a.item", text: "Gunner").first()
        }
        diagramFrontWeapons() { // (473, 193) (476, 213)
            toolbarWeaponsButton.click();
            $("a.item").has("span.Front")
        }
        diagramBackWeapons() { // (218, 262)
            toolbarWeaponsButton.click();
            $("a.item").has("span.Back")
        }
        diagramLeftWeapons() { // (358, 124)
            toolbarWeaponsButton.click();
            $("a.item").has("span.Left")
        }
        diagramLeftFrontWeapons() {
            toolbarWeaponsButton.click();
            $("a.item").has("span.LeftFront")
        }
        diagramLeftBackWeapons() { // (227,138)
            toolbarWeaponsButton.click();
            $("a.item").has("span.LeftBack")
        }
        diagramRightWeapons() {
            toolbarWeaponsButton.click();
            $("a.item").has("span.Right")
        }
        diagramRightFrontWeapons() {
            toolbarWeaponsButton.click();
            $("a.item").has("span.RightFront")
        }
        diagramRightBackWeapons() { // (183, 396)
            toolbarWeaponsButton.click();
            $("a.item").has("span.RightBack")
        }
        diagramFrontTires(to: TirePage) { // (471, 80) (457, 324) (447, 75)
            toolbarTiresButton.click()
            $("a.item", text: "Front Tires")
        }
        diagramBackTires(to: TirePage) { // (299, 337) (303, 326)
            toolbarTiresButton.click()
            $("a.item", text: "Back Tires")
        }
        diagramSidecarTires(to: TirePage) { //(325, 432)
            toolbarTiresButton.click()
            $("a.item", text: "Sidecar Tires")
        }
        diagramRamplate(to: BodyModsPage) {
            toolbarModsButton.click()
            $("label.item").has("span.ng-scope", text: "Ramplate")
        }
        diagramSpoiler(to: SportPage) {
            toolbarSportButton.click()
            $("label.item").has("span.ng-scope", text: "Spoiler")
        }
        diagramAirdam(to: SportPage) {
            toolbarSportButton.click()
            $("label.item").has("span.ng-scope", text: "Airdam")
        }
        diagramSideTurret(to: TurretPage) {
            toolbarTurretButton.click()
            $("div.SideTurret a.item")
        }
        diagramTopTurret(to: TurretPage) { // (294, 340)
            toolbarTurretButton.click()
            $("div.TopTurret a.item")
        }
        diagramTopBackTurret(to: TurretPage) { // (294, 340)
            toolbarTurretButton.click()
            $("div.content div.list").eq(2).find("a.item").click()
            $("div.TopTurret a.item")
        }
        diagramSidecarTurret(to: TurretPage) {
            toolbarTurretButton.click()
            $("div.SidecarTurret a.item")
        }
    }

    def clickOnCanvas(link) {
        clickOnCanvas(link, false, false, null, null);
    }
    def clickOnCanvas(link, sidecar, carrier) {
        clickOnCanvas(link, sidecar, carrier, null, null);
    }
    def clickOnCanvas(link, sidecar, carrier, location, index) {
        def arg;
        if(link =~ /Turret/ && index == null) {
            arg = link.substring(4);
            arg = arg.substring(0, 1).toLowerCase()+arg.substring(1);
            arg = "{isTurret: function() {return true;}, carrier: ${carrier ? true : false}, "+
                    "sidecar: ${sidecar ? true : false}, location: '${arg}'}";
            arg = "angular.element(document.body).injector().get('vehicle').getTurret("+arg+")";
        } else if(index != null) {
            if(link =~ /Crew/) {
                arg = "{crew: angular.element(document.body).injector().get('vehicle').car.${sidecar ? "sidecar." : carrier ? "carrier." : ""}${location}[${index}]}"
            } else if(link =~ /^edit.*Weapons$/) {
                arg = link.substring(4, link.length()-7);
                if(arg.contains("Sidecar") || arg.contains("Carrier")) arg = arg.substring(7);
                arg = arg.replace("leftTurret", "sideTurret");
                arg = arg.replace("rightTurret", "sideTurret");
                arg = arg.replace("leftBackTurret", "sideBackTurret");
                arg = arg.replace("rightBackTurret", "sideBackTurret");
                arg = "{sidecar: ${sidecar ? true : false}, carrier: ${carrier ? true : false}, location: '${arg}', isTurret: function() {return /Turret/.test(this.location);}}"
                arg = "angular.element(document.body).injector().get('vehicle').weaponsInLocation(${arg})[${index}]"
                arg = "{sidecar: ${sidecar ? true : false}, carrier: ${carrier ? true : false}, weapon: ${arg}}"
            }
        } else {
            arg = "{sidecar: ${sidecar ? true : false}, carrier: ${carrier ? true : false}}"
        }
//        println "angular.element(document.body).find('canvas').scope().click('${link}', ${arg});"
        js."angular.element(document.body).find('canvas').scope().click('${link}', ${arg});"
    }

    def clickOnDiagram(x, y) {
        interact {
            moveToElement diagram, x, y
            click()
        }
//        js.exec x, y, """
//var event = doc.createEvent("MouseEvents");
//event.initEvent(eventName, true, true);
//\$('blah')[0].dispatchEvent(event, true);
//
//      var evt = \$.Event('click', { pageX: "+arguments[0]+", pageY: "+(arguments[1]+55)+" } );
//      \$('#upperSchematic').trigger(evt);
//    """
    }

    def checkCostPopup() {
        def div = $("div.notifications div.notes")
        assert div.displayed
        assert div.size() == 1
        def text = div.text()
        assert text =~ "\$"
        assert !(text =~ "NaN")
        return true;
    }

    def setRange(css, value) { js.exec "document.querySelector('${css}').value=${value};" }

    def isVehicleSelector() { return $('div.ng-scope', 'ng-switch-when': 'selector').displayed }

    def isControlTitle(name) { return $("h1.title", text: name).displayed }

    def modelIsOversize() { js.exec "return angular.element(document.body).injector().get('vehicle').isOversize();" }

    def modelFrontTire() { js."angular.element(document.body).injector().get('vehicle').car.frontTires" }

    def modelBackTireDP() { js."angular.element(document.body).injector().get('vehicle').car.backTires.ownDP()" }

    def modelTotalCost() { js."angular.element(document.body).injector().get('vehicle').car.totalCost" }

    def modelTotalWeight() { js."angular.element(document.body).injector().get('vehicle').car.weightUsed" }

    def modelTechLevel() { js."angular.element(document.body).injector().get('vehicle').car.techLevel" }

    def modelSpaceUsed() {
        js."angular.element(document.body).injector().get('vehicle').car.spaceUsed" + js."angular.element(document.body).injector().get('vehicle').car.cargoSpaceUsed"
    }

    def modelSidecarCost() {
        js.exec "return angular.element(document.body).injector().get('vehicle').car.sidecar.totalCost()"
    }

    def modelSidecarWeight() {
        js.exec "return angular.element(document.body).injector().get('vehicle').car.sidecar.totalWeight()"
    }

    def modelSidecarSpaceUsed() {
        js.exec "return angular.element(document.body).injector().get('vehicle').car.sidecar.spaceUsed()"
    }

    def modelCarrierCost() {
        js.exec "return angular.element(document.body).injector().get('vehicle').car.carrier.totalCost"
    }

    def modelCarrierWeight() {
        js.exec "return angular.element(document.body).injector().get('vehicle').car.carrier.weightUsed"
    }

    def modelCarrierSpaceUsed() {
        js."angular.element(document.body).injector().get('vehicle').car.carrier.spaceUsed" + js."angular.element(document.body).injector().get('vehicle').car.carrier.cargoSpaceUsed"
    }

    def modelDesignName() { js."angular.element(document.body).injector().get('vehicle').car.designName" }

    def modelLegal() { js."angular.element(document.body).injector().get('vehicle').car.legal" }

    def modelType() { js."angular.element(document.body).injector().get('vehicle').car.type" }

    def modelRaceCar() { js."angular.element(document.body).injector().get('vehicle').car.body.racingFrame" }

    def modelTextDescription() {
        js.exec "return angular.element(document.body).injector().get('vehicle').car.textDescription()"
    }

    def diagramType() { js."angular.element(document.body).injector().get('model2d').car.bodyType" }

    def pdfWorksheet() {
        js.exec "return CW.exportWorksheet(angular.element(document.body).injector().get('vehicle').car)"
    }

    def confirmResult(cost, weight, space, name) {
        assert modelTotalCost() == cost
        assert modelTotalWeight() == weight
        assert modelSpaceUsed() == space
        if (name) assert modelDesignName() == name
        assert modelLegal()
        def text = modelTextDescription()
        if(modelType() != "TenWheeler") assert !text.contains("  ")
//    println text
    }

    def confirmSidecar(cost, weight, space) {
        assert modelSidecarCost() == cost
        assert modelSidecarWeight() == weight
        assert modelSidecarSpaceUsed() == space
    }

    def confirmCarrier(cost, weight, space) {
        assert modelCarrierCost() == cost
        assert modelCarrierWeight() == weight
        assert modelCarrierSpaceUsed() == space
    }
}

class NewVehiclePage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Car Summary") && isVehicleSelector() } }

    static content = {
        newCar(to: DefaultPage) {
            clickSelectorCar()
            statusCostLabel
        }
        newCycle(to: DefaultPage) {
//            clickSelectorCycle()
            js."angular.element(document.body).find('canvas').scope().click('createNewCycle');"
            statusCostLabel
        }
        newTrike(to: DefaultPage) {
            js."angular.element(document.body).find('canvas').scope().click('createNewTrike');"
//            clickSelectorTrike()
            statusCostLabel
        }
        newRaceCar(to: DefaultPage) {
            js."angular.element(document.body).find('canvas').scope().click('createNewRaceCar');"
//            clickSelectorRaceCar()
            statusCostLabel
        }
        newCarTrailer(to: DefaultPage) {
            js."angular.element(document.body).find('canvas').scope().click('createNewCarTrailer');"
//            clickSelectorCarTrailer()
            statusCostLabel
        }
        newTenWheeler(to: DefaultPage) {
            js."angular.element(document.body).find('canvas').scope().click('createNewTenWheeler');"
//            clickSelectorTenWheeler()
            statusCostLabel
        }
        newSemiTractor(to: DefaultPage) {
            js."angular.element(document.body).find('canvas').scope().click('createNewSemiTractor');"
//            clickSelectorSemiTractor()
            statusCostLabel
        }
        newSemiTrailer(to: DefaultPage) {
            js."angular.element(document.body).find('canvas').scope().click('createNewSemiTrailer');"
//            clickSelectorSemiTrailer()
            statusCostLabel
        }
        newBus(to: DefaultPage) {
            js."angular.element(document.body).find('canvas').scope().click('createNewBus');"
//            clickSelectorBus()
            statusCostLabel
        }
        startTour(to: TourDialog) { $('#CarTourStart') }
    }

    def clickSelectorCar() {
        clickOnDiagram(50, 50);
    }

    def clickSelectorCycle() {
        clickOnDiagram(350, 50);
    }

    def clickSelectorTrike() {
        clickOnDiagram(550, 50);
    }

    def clickSelectorRaceCar() {
        clickOnDiagram(50, 250);
    }

    def clickSelectorCarTrailer() {
        clickOnDiagram(350, 250);
    }

    def clickSelectorTenWheeler() {
        clickOnDiagram(550, 250);
    }

    def clickSelectorSemiTractor() {
        clickOnDiagram(50, 450);
    }

    def clickSelectorSemiTrailer() {
        clickOnDiagram(350, 450);
    }

    def clickSelectorBus() {
        clickOnDiagram(550, 450);
    }
}

class DefaultPage extends CarWarsPage {
    static at = {
        waitFor {
            isControlTitle("Car Summary") && !isVehicleSelector()
            // TODO && NOT STOCK CARS SHOWING
        }
    }
    static url = '/overview';
    static content = {
        designText { $("div.content p.ng-binding", 0) }
        startTour(to: TourDialog) { $('#CarTourStart') } // TODO
    }
}

class BodyPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Body Options") } }
    static url = '/body';
    static content = {
        bodyLabel { id -> $("#Controls label.item").has("div.item-content", text: id) }
        hasBody { id -> bodyLabel(id).find('input').value() != null }
        chassisType { $("span.button-group.ChassisType").text() }
        nextChassis { $("span.button-group.ChassisType button.ion-plus-circled") }
        previousChassis { $("span.button-group.ChassisType button.ion-minus-circled") }
        suspensionType { $("span.button-group.SuspensionType").text() }
        nextSuspension { $("span.button-group.SuspensionType button.ion-plus-circled") }
        previousSuspension { $("span.button-group.SuspensionType button.ion-minus-circled") }
        noSidecar { $("label.item").has("div.item-content", text: "No Sidecar or Windshell") }
        windshell { $("label.item").has("div.item-content", text: "Cycle Windshell") }
        lightSidecar { $("label.item").has("div.item-content", text: "Light Sidecar") }
        smallCTS { $("label.item").has("div.item-content", text: "1-Space Turret Sidecar") }
        heavySidecar { $("label.item").has("div.item-content", text: "Heavy Sidecar") }
        largeCTS { $("label.item").has("div.item-content", text: "2-Space Turret Sidecar") }
        van { $("label.item").has("div.item-content", text: "Van") }
        flatbed { $("label.item").has("div.item-content", text: "Flatbed") }
        dualLevel { $("label.item").has("div.item-content", text: "Dual-Level Flatbed") }
        reefer { $("label.item").has("div.item-content", text: "Reefer") }
        tanker { $("label.item").has("div.item-content", text: "Tanker") }
        dumper { $("label.item").has("div.item-content", text: "Dumper") }
        nextSidecarSuspension { $("span.button-group.SidecarSuspension button.ion-plus-circled") }
        previousSidecarSuspension { $("span.button-group.SidecarSuspension button.ion-minus-circled") }
        moreWindshellArmor { $("span.button-group.WindshellArmor button.ion-plus-circled") }
        lessWindshellArmor { $("span.button-group.WindshellArmor button.ion-minus-circled") }
        reversed { $("label.item").has("span.ng-scope", text: "Reversed Trike") }
        backDoor { $("label.item").has("span.ng-scope", text: "Back Door in Cab (to Carrier)") }
        moreFifthWheelArmor { $("span.button-group.FifthWheel button.ion-plus-circled") }
        lessFifthWheelArmor { $("span.button-group.FifthWheel button.ion-minus-circled") }
        windjammer { $("label.item").has("span.ng-scope", text: "Windjammer") }
        retractor { $("label.item").has("span.ng-scope", text: "Windjammer Retractor") }
        moreWindjammerArmor { $("span.button-group.Windjammer button.ion-plus-circled") }
        lessWindjammerArmor { $("span.button-group.Windjammer button.ion-minus-circled") }
        explosiveKingpin { $("label.item").has("span.ng-scope", text: "Explosive Kingpin") }
        qrKingpin { $("label.item").has("span.ng-scope", text: "Quick-Release Kingpin") }
        step { $("label.item").has("span.ng-scope", text: "Semi Trailer Emergency Plate") }
        trailer2 { $("label.item").has("span.ng-scope", text: "Full Trailer (2 front wheels)") }
        trailer4 { $("label.item").has("span.ng-scope", text: "Full Trailer (4 front wheels)") }

        toolbarSubcompact { $("button.button", text: "Subcompact") }
        toolbarCompact { $("button.button", text: "Compact") }
        toolbarMidsize { $("button.button", text: "Mid-sized") }
        toolbarSedan { $("button.button", text: "Sedan") }
        toolbarLuxury { $("button.button", text: "Luxury") }
        toolbarStationWagon { $("button.button", text: "Station Wagon") }
        toolbarPickup { $("button.button", text: "Pickup") }
        toolbarCamper { $("button.button", text: "Camper") }
        toolbarVan { $("button.button", text: "Van") }
        toolbarLightCycle { $("button.button", text: "Light Cycle") }
        toolbarMediumCycle { $("button.button", text: "Medium Cycle") }
        toolbarHeavyCycle { $("button.button", text: "Heavy Cycle") }
        toolbarMediumSidecar { $("button.button", text: "Med w/Lt Sidecar") }
        toolbarHeavySidecar { $("button.button", text: "Hvy w/Hvy Sidecar") }
        toolbarLightTrike { $("button.button", text: "Light Trike") }
        toolbarMediumTrike { $("button.button", text: "Medium Trike") }
        toolbarHeavyTrike { $("button.button", text: "Heavy Trike") }
        toolbarXHeavyTrike { $("button.button", text: "Extra-Heavy Trike") }
        toolbarSprint { $("button.button", text: "Sprint") }
        toolbarIndy { $("button.button", text: "Formula One/Indy") }
        toolbarDragster { $("button.button", text: "Dragster") }
        toolbarCanAm { $("button.button", text: "Can-Am") }
        toolbarFunnyCar { $("button.button", text: "Funny Car") }
        toolbarMiniVan { $("button.button", text: "Mini-Van") }
        toolbarVan6 { $("button.button", text: "6' Van") }
        toolbarVan10 { $("button.button", text: "10' Van") }
        toolbarVan15 { $("button.button", text: "15' Van") }
        toolbarVan20 { $("button.button", text: "20' Van") }
        toolbarVan25 { $("button.button", text: "25' Van") }
        toolbarVan30 { $("button.button", text: "30' Van") }
        toolbarFlatbed6 { $("button.button", text: "6' Flatbed") }
        toolbarFlatbed10 { $("button.button", text: "10' Flatbed") }
        toolbarFlatbed15 { $("button.button", text: "15' Flatbed") }
        toolbarFlatbed20 { $("button.button", text: "20' Flatbed") }
        toolbarFlatbed25 { $("button.button", text: "25' Flatbed") }
        toolbarFlatbed30 { $("button.button", text: "30' Flatbed") }
        toolbarCabover { $("button.button", text: "Cabover") }
        toolbarLongnose { $("button.button", text: "Longnose") }
        toolbarStandardCabover { $("button.button", text: "Standard Cabover") }
        toolbarStandardLongnose { $("button.button", text: "Standard Longnose") }
        toolbarSleeperCabover { $("button.button", text: "Sleeper Cabover") }
        toolbarSleeperLongnose { $("button.button", text: "Sleeper Longnose") }
        toolbarVan40 { $("button.button", text: "40' Van") }
        toolbarFlatbed40 { $("button.button", text: "40' Flatbed") }
        toolbarDualFlatbed40 { $("button.button", text: "40' Dual-Level Flatbed") }
        toolbarReefer40 { $("button.button", text: "40' Reefer") }
        toolbarTanker40 { $("button.button", text: "40' Tanker") }
        toolbarDumper40 { $("button.button", text: "40' Dumper") }
        toolbarMinibus { $("button.button", text: "Minibus") }
        toolbarBus30 { $("button.button", text: "30' Bus") }
        toolbarBus40 { $("button.button", text: "40' Bus") }
    }
}

class ArmorPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Armor") } }
    static url = '/armor';
    static content = {
        nextPlastic { $("span.button-group.PlasticArmor button.ion-plus-circled") }
        previousPlastic { $("span.button-group.PlasticArmor button.ion-minus-circled") }
        plasticName { $("span.button-group.PlasticArmor").text().trim() }
        nextMetal { $("span.button-group.MetalArmor button.ion-plus-circled") }
        previousMetal { $("span.button-group.MetalArmor button.ion-minus-circled") }
        metalName { $("span.button-group.MetalArmor").text().trim() }
        sloped { $("label.item").has("span.ng-scope", text: "Sloped Armor") }
        distribute { $("a.item", 'ng-click':'distributeArmor()') }
        singleFront { $("input", type: 'text', 'ng-model': 'frontSingle') }
        singleBack { $("input", type: 'text', 'ng-model': 'backSingle') }
        singleLeft(required: false) { $("input", type: 'text', 'ng-model': 'leftSingle') }
        singleLeftBack(required: false) { $("input", type: 'text', 'ng-model': 'leftBackSingle') }
        singleRight(required: false) { $("input", type: 'text', 'ng-model': 'rightSingle') }
        singleRightBack(required: false) { $("input", type: 'text', 'ng-model': 'rightBackSingle') }
        singleTop(required: false) { $("input", type: 'text', 'ng-model': 'topSingle') }
        singleTopBack(required: false) { $("input", type: 'text', 'ng-model': 'topBackSingle') }
        singleUnderbody(required: false) { $("input", type: 'text', 'ng-model': 'underbodySingle') }
        singleUnderbodyBack(required: false) { $("input", type: 'text', 'ng-model': 'underbodyBackSingle') }
        singleFlatbed(required: false) { $("input", type: 'text', 'ng-model': 'flatbedSingle') }
        singleFlatbedBack(required: false) { $("input", type: 'text', 'ng-model': 'flatbedBackSingle') }
        frontPlastic { $("input", 'ng-model': 'frontPlastic') }
        frontMetal { $("input", 'ng-model': 'frontMetal') }
        leftPlastic(required: false) { $("input", 'ng-model': 'leftPlastic') }
        leftMetal(required: false) { $("input", 'ng-model': 'leftMetal') }
        leftBackPlastic(required: false) { $("input", 'ng-model': 'leftBackPlastic') }
        leftBackMetal(required: false) { $("input", 'ng-model': 'leftBackMetal') }
        rightPlastic(required: false) { $("input", 'ng-model': 'rightPlastic') }
        rightMetal(required: false) { $("input", 'ng-model': 'rightMetal') }
        rightBackPlastic(required: false) { $("input", 'ng-model': 'rightBackPlastic') }
        rightBackMetal(required: false) { $("input", 'ng-model': 'rightBackMetal') }
        backPlastic { $("input", 'ng-model': 'backPlastic') }
        backMetal { $("input", 'ng-model': 'backMetal') }
        topPlastic(required: false) { $("input", 'ng-model': 'topPlastic') }
        topMetal(required: false) { $("input", 'ng-model': 'topMetal') }
        topBackPlastic(required: false) { $("input", 'ng-model': 'topBackPlastic') }
        topBackMetal(required: false) { $("input", 'ng-model': 'topBackMetal') }
        underbodyPlastic(required: false) { $("input", 'ng-model': 'underbodyPlastic') }
        underbodyMetal(required: false) { $("input", 'ng-model': 'underbodyMetal') }
        underbodyBackPlastic(required: false) { $("input", 'ng-model': 'underbodyBackPlastic') }
        underbodyBackMetal(required: false) { $("input", 'ng-model': 'underbodyBackMetal') }
        flatbedPlastic(required: false) { $("input", 'ng-model': 'flatbedPlastic') }
        flatbedMetal(required: false) { $("input", 'ng-model': 'flatbedMetal') }
        flatbedBackPlastic(required: false) { $("input", 'ng-model': 'flatbedBackPlastic') }
        flatbedBackMetal(required: false) { $("input", 'ng-model': 'flatbedBackMetal') }

        switchArmorLocation { $("div.content div.list").eq(1).find("a.item") }
    }
}

class AllTiresPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("All Tires") } }
    static url = '/tireList';
    static content = {
        frontTires(to: TirePage) { $("a.item", text: "Front Tires") }
        backTires(to: TirePage) { $("a.item", text: "Back Tires") }
    }
}

class TirePage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Front Tires") || isControlTitle("Back Tires") || isControlTitle("Sidecar Tires") } }
    static url = '/tire';
    static content = {
        standardTires { $("label.item").has("div.item-content", text: startsWith("Standard (")) }
        hdTires { $("label.item").has("div.item-content", text: startsWith("Heavy-Duty (")) }
        prTires { $("label.item").has("div.item-content", text: startsWith("Puncture-Resistant (")) }
        solidTires { $("label.item").has("div.item-content", text: startsWith("Solid (")) }
        plasticoreTires { $("label.item").has("div.item-content", text: startsWith("Plasticore (")) }
        wheelguardUp { $("span.button-group.Wheelguard button.ion-plus-circled") }
        wheelguardDown { $("span.button-group.Wheelguard button.ion-minus-circled") }
        wheelhubUp { $("span.button-group.Wheelhub button.ion-plus-circled") }
        wheelhubDown { $("span.button-group.Wheelhub button.ion-minus-circled") }
        steelbelted { $("label.item").has("span.ng-scope", text: "Steelbelted") }
        radial { $("label.item").has("span.ng-scope", text: "Radial") }
        slick { $("label.item").has("span.ng-scope", text: "Slick") }
        offRoad { $("label.item").has("span.ng-scope", text: "Off-Road") }
        snowTires { $("label.item").has("span.ng-scope", text: "Snow Tires") }
        fireproof { $("label.item").has("span.ng-scope", text: "Fireproof") }
        tireChains { $("label.item").has("span.ng-scope", text: "Tire Chains") }
        carTireLabel { $("div.ionic-body div.bar-header h1") }

        radialValue { radial.find('input').value() }

//        radialCheckbox { $("label[for='CarTireRadial']") }
    }
}

class AllCrewPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("All Crew") } }
    static url = '/crewList';
    static content = {
        carDriver(to: PersonPage) { $("a.item", text: "Driver") }
        gunner(to: PersonPage) { $("a.item", text: "Gunner") }
        sidecarPassenger(to: PersonPage) { $("a.item", text: "Sidecar Passenger") }
        sidecarGunner(to: PersonPage) { $("a.item", text: "Sidecar Gunner") }
        carrierPassenger(to: PersonPage) { $("a.item", text: "Carrier Passenger") }
        carrierGunner(to: PersonPage) { $("a.item", text: "Carrier Gunner") }
        addGunner { $("a.item", text: "Add Gunner") }
        addPassenger { $("a.item", text: "Add Passenger") }
        addSidecarGunner { $("a.item", text: "Add Sidecar Gunner") }
        addSidecarPassenger { $("a.item", text: "Add Sidecar Passenger") }
        addCarrierGunner { $("a.item", text: "Add Carrier Gunner") }
        addCarrierPassenger { $("a.item", text: "Add Carrier Passenger") }
    }
}

class EngineSelectorPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Engine List") } }
    static url = '/engineList';
    static content = {
        accelerationUp { $("span.button-group.Acceleration button.ion-plus-circled") }
        accelerationDown { $("span.button-group.Acceleration button.ion-minus-circled") }
        topSpeedUp { $("span.button-group.TopSpeed button.ion-plus-circled") }
        topSpeedDown { $("span.button-group.TopSpeed button.ion-minus-circled") }
        maxRangeUp { $("span.button-group.MaxRange button.ion-plus-circled") }
        maxRangeDown { $("span.button-group.MaxRange button.ion-minus-circled") }
        engineName { id -> $("a.item b span.ng-binding", id).text() }
        engineMods { id -> $("a.item span.EngineMods", id).text() }
        selectEngine(to: EnginePage) { id -> $("a.item", id, 'ng-repeat': 'engine in engines') }

        toolbarEditCurrent(to: EnginePage) { $("button.button", text: "Customize Current Engine") }
        toolbarChangeToGas { $("button.button", text: "Change to Gas") }
        toolbarChangeToElectric { $("button.button", text: "Change to Electric") }
    }
}

class EnginePage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Engine") || isControlTitle("Power Plant") } }
    static url = '/engine';
    static content = {
        biggerEngine { $("span.button-group.EngineSize button.ion-plus-circled") }
        smallerEngine { $("span.button-group.EngineSize button.ion-minus-circled") }
        pcCheckbox { $("label.item").has("span.ng-scope", text: "Platinum Catalysts") }
        pc { pcCheckbox.find("input").value() }
        scCheckbox { $("label.item").has("span.ng-scope", text: "Superconductors") }
        sc { scCheckbox.find("input").value() }
        htmCheckbox { $("label.item").has("span.ng-scope", text: "High-Torque Motors") }
        htm { htmCheckbox.find('input').value() }
        hdhtmCheckbox { $("label.item").has("span.ng-scope", text: "HD High-Torque Motors") }
        hdhtm { hdhtmCheckbox.find('input').value() }
        friCheckbox { $("label.item").has("span.ng-scope", text: "Fire-Retardant Insulator") }
        fri { friCheckbox.find('input').value() }
        carbCheckbox { $("label.item").has("span.ng-scope", text: "Carburetor") }
        carb { carbCheckbox.find('input').value() }
        mbCarbCheckbox { $("label.item").has("span.ng-scope", text: "Multibarrel Carburetor") }
        mbCarb { mbCarbCheckbox.find('input').value() }
        thCheckbox { $("label.item").has("span.ng-scope", text: "Tubular Headers") }
        th { thCheckbox.find('input').value() }
        bpCheckbox { $("label.item").has("span.ng-scope", text: "Blueprinted") }
        bp { bpCheckbox.find('input').value() }
        turboCheckbox { $("label.item").has("span.ng-scope", text: "Turbocharger") }
        turbo { turboCheckbox.find('input').value() }
        vpTurboCheckbox { $("label.item").has("span.ng-scope", text: "V.P. Turbocharger") }
        vpTurbo { vpTurboCheckbox.find('input').value() }
        superchargerCheckbox { $("label.item").has("span.ng-scope", text: "Supercharger") }
        supercharger { superchargerCheckbox.find('input').value() }
        feCheckbox { $("label.item").has("span.ng-scope", text: "Fire Extinguisher") }
        fe { feCheckbox.find('input').value() }
        ifeCheckbox { $("label.item").has("span.ng-scope", text: "Improved Fire Extinguisher") }
        ife { ifeCheckbox.find('input').value() }
        caUp { $("span.button-group.CA button.ion-plus-circled") }
        caDown { $("span.button-group.CA button.ion-minus-circled") }
        caText { $("span.button-group.CA").next() }
        epcUp { $("span.button-group.EPC button.ion-plus-circled") }
        epcDown { $("span.button-group.EPC button.ion-minus-circled") }
        epcText { $("span.button-group.EPC").text() }
        iscUp { $("span.button-group.ISC button.ion-plus-circled") }
        iscDown { $("span.button-group.ISC button.ion-minus-circled") }
        iscText { $("span.button-group.ISC").next() }
        noxUp { $("span.button-group.NO2 button.ion-plus-circled") }
        noxDown { $("span.button-group.NO2 button.ion-minus-circled") }
        noxText { $("span.button-group.NO2").next() }
        feUp { $("span.button-group.FE button.ion-plus-circled") }
        feDown { $("span.button-group.FE button.ion-minus-circled") }
        feText { $("span.button-group.FE").next() }
        lbUp { $("span.button-group.LB button.ion-plus-circled") }
        lbDown { $("span.button-group.LB button.ion-minus-circled") }
        lbText { $("span.button-group.LB").next() }

        engineModName { id -> $("#CarEngineOption${id}Label .ui-btn-text").text() }
        engineCountName { id -> $("#CarEngineCount${id}Text").text() }
    }
}

class GasTankPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Gas Tank") } }
    static url = '/gasTank'
    static content = {
        sizeUp { $("span.button-group.TankSize button.ion-plus-circled") }
        sizeDown { $("span.button-group.TankSize button.ion-minus-circled") }
        sizeText { $("span.button-group.TankSize").text() }
        economy { $("label.item").has("div.item-content", text: "Economy (2 DP)") }
        heavyDuty { $("label.item").has("div.item-content", text: "Heavy-Duty (4 DP)") }
        racing { $("label.item").has("div.item-content", text: "Racing (4 DP)") }
        duelling { $("label.item").has("div.item-content", text: "Duelling (8 DP)") }
        fri { $("label.item").has("span.ng-scope", text: "Fire-Retardant Insulator") }
        caUp { $("span.button-group.CA button.ion-plus-circled") }
        caDown { $("span.button-group.CA button.ion-minus-circled") }
        caText { $("span.button-group.CA").next() }
    }
}

class SportPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Performance Modifications") } }
    static url = '/performanceMods';
    static content = {
        caFrame { $("label.item").has("span.ng-scope", text: "Carbon-Aluminum Frame") }
        activeSuspension { $("label.item").has("span.ng-scope", text: "Active Suspension") }
        spoiler { $("label.item").has("span.ng-scope", text: "Spoiler") }
        airdam { $("label.item").has("span.ng-scope", text: "Airdam") }
        streamlined { $("label.item").has("span.ng-scope", text: "Streamlined") }
        hdShocks { $("label.item").has("span.ng-scope", text: "Heavy-Duty Shock Absorbers") }
        hdBrakes { $("label.item").has("span.ng-scope", text: "Heavy-Duty Brakes") }
        antilockBrakes { $("label.item").has("span.ng-scope", text: "Antilock Brakes") }
        hdTransmission { $("label.item").has("span.ng-scope", text: "Heavy-Duty Transmission") }
        overdrive { $("label.item").has("span.ng-scope", text: "Overdrive") }
        rollCage { $("label.item").has("span.ng-scope", text: "Roll Cage") }
        dragChute { $("label.item").has("span.ng-scope", text: "Drag Chute") }
        fpDragChute { $("label.item").has("span.ng-scope", text: "Fireproof Drag Chute") }

        bodyPage(to: BodyModsPage) { $("a.item", text: "Body Modifications") }

        hdShocksValue { hdShocks.find('input').value() }
    }
}

class BodyModsPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Body Modifications") } }
    static url = '/bodyMods';
    static content = {
        ramplate { $("label.item").has("span.ng-scope", text: "Ramplate") }
        fakeRamplate { $("label.item").has("span.ng-scope", text: "Fake Ramplate") }
        brushcutter { $("label.item").has("span.ng-scope", text: "Brushcutter") }
        bumperSpikes { $("label.item").has("span.ng-scope", text: "Bumper Spikes (Front)") }
        backBumperSpikes { $("label.item").has("span.ng-scope", text: "Bumper Spikes (Back)") }
        bodyBlades { $("label.item").has("span.ng-scope", text: "Body Blades") }
        fakeBodyBlades { $("label.item").has("span.ng-scope", text: "Fake Body Blades") }
        amphibious(required: false) { $("label.item").has("span.ng-scope", text: "Amphibious Modification") }
        assaultRamp { $("label.item").has("span.ng-scope", text: "Assault Ramp") }
        wheelRamps { $("label.item").has("span.ng-scope", text: "Wheel Ramps") }
        leftSideDoor { $("label.item").has("span.ng-scope", text: "Left Side Door") }
        rightSideDoor { $("label.item").has("span.ng-scope", text: "Right Side Door") }
        convertible { $("label.item").has("span.ng-scope", text: "Convertible Hardtop") }
        sunroof { $("label.item").has("span.ng-scope", text: "Sunroof") }
        noPaint { $("label.item").has("span.ng-scope", text: "No-Paint Windshield") }
        tinted { $("label.item").has("span.ng-scope", text: "Tinted Windows") }

        performancePage(to: SportPage) { $("a.item", text: "Performance Modifications") }
    }
}

class PersonPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Driver") || isControlTitle("Cyclist") ||
            isControlTitle("Gunner") || isControlTitle("Gunner 1") || isControlTitle("Gunner 2") ||
            isControlTitle("Passenger") || isControlTitle("Passenger 1") || isControlTitle("Passenger 2") } }
    static url = '/crew';
    static content = {
        nextComputer { $("span.button-group.Computer button.ion-plus-circled") }
        previousComputer { $("span.button-group.Computer button.ion-minus-circled") }
        computer { $("span.button-group.Computer").text() }
        nextSeat { $("span.button-group.Seat button.ion-plus-circled") }
        previousSeat { $("span.button-group.Seat button.ion-minus-circled") }
        seat { $("span.button-group.Seat").text() }
        nextBodyArmor { $("span.button-group.BodyArmor button.ion-plus-circled") }
        previousBodyArmor { $("span.button-group.BodyArmor button.ion-minus-circled") }
        bodyArmor { $("span.button-group.BodyArmor").text() }
        caUp { $("span.button-group.CA button.ion-plus-circled") }
        caDown { $("span.button-group.CA button.ion-minus-circled") }
        caText { $("span.button-group.CA").next() }
        multiCAUp { $("span.button-group.MultiCA button.ion-plus-circled") }
        multiCADown { $("span.button-group.MultiCA button.ion-minus-circled") }
        multiCAText { $("span.button-group.MultiCA").next() }

        fpSuit { $("label.item").has("span.ng-scope", text: "Fireproof Suit") }
        flakJacket { $("label.item").has("span.ng-scope", text: "Flak Jacket") }
        battleVest { $("label.item").has("span.ng-scope", text: "Battle Vest") }
        armoredVest { $("label.item").has("span.ng-scope", text: "Armored Battle Vest") }
        extraControls { $("label.item").has("span.ng-scope", text: "Extra Driver Controls") }
        pfe { $("label.item").has("span.ng-scope", text: "Portable Fire Ext.") }

        addGunner { $("a.item", text: "Add Gunner") }
        removeGunner { $("a.item", text: "Remove Gunner") }
        removePassenger { $("a.item", text: "Remove Passenger") }

        gearButton(to: CrewGearPage) { $("a.item", text: "Hand Weapons & Gear") }
    }
}

//class TurretLocationsPage extends CarWarsPage {
//    static at = { waitFor { isControlTitle("Turrets & EWPs") } }
//}

class TurretListPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Turrets & EWPs") } }
    static url = '/turretList';
    static content = {
        topTurret { id -> $("div.TopTurret a.item").has("b", text: id) }
        sideTurret { id -> $("div.SideTurret a.item").has("b", text: id) }
        switchTurrets { $("div.content div.list").eq(1).find("a.item") }
        switchOversizeTurrets { $("div.content div.list").eq(2).find("a.item") }
    }
}

class TurretPage extends CarWarsPage {
    static at = { waitFor { $("div.content.TurretPage").displayed } } // title e.g. "EWP"
    static url = '/turret';
    static content = {
        sizeUp { $("span.button-group.TurretSize button.ion-plus-circled") }
        sizeDown { $("span.button-group.TurretSize button.ion-minus-circled") }
        sizeText { $("span.button-group.TurretSize").text() }
        fake { $("label.item").has("span.ng-scope", text: "Fake") }
        universal { $("label.item").has("span.ng-scope", text: "Universal") }
        addWeapon { $("a.item", text: "Add Weapon") }
        addTL { $("a.item", text: "Add TL") }
        removeTurret { id -> $("a.item", text: "Remove ${id}") }
    }
}

class AllWeaponsPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("All Weapons") } }
    static url = '/weaponLocations';
    static content = {
        frontWeapons { $("a.item").has("span.Front") }
        backWeapons { $("a.item").has("span.Back") }
        leftWeapons { $("a.item").has("span.Left") }
        leftFrontWeapons { $("a.item").has("span.LeftFront") }
        leftBackWeapons { $("a.item").has("span.LeftBack") }
        rightWeapons { $("a.item").has("span.Right") }
        rightFrontWeapons { $("a.item").has("span.RightFront") }
        rightBackWeapons { $("a.item").has("span.RightBack") }
        topWeapons { $("a.item").has("span.Top") }
        topFrontWeapons { $("a.item").has("span.TopFront") }
        topBackWeapons { $("a.item").has("span.TopBack") }
        underbodyWeapons { $("a.item").has("span.Underbody") }
        underbodyFrontWeapons { $("a.item").has("span.UnderbodyFront") }
        underbodyBackWeapons { $("a.item").has("span.UnderbodyBack") }
        frontLeftWeapons { $("a.item").has("span.FrontLeft") }
        frontRightWeapons { $("a.item").has("span.FrontRight") }
        backLeftWeapons { $("a.item").has("span.BackLeft") }
        backRightWeapons { $("a.item").has("span.BackRight") }
        sidecarFrontWeapons { $("a.item").has("span.SidecarFront") }
        sidecarBackWeapons { $("a.item").has("span.SidecarBack") }
        sidecarRightWeapons { $("a.item").has("span.SidecarRight") }

        switchWeaponsLocation { $("div.content div.list").eq(1).find("a.item") }
        topSwitchOversize { $("div.bar-header button.button") }
        bottomSwitchOversize { $("div.content div.list").eq(2).find("a.item") }
    }
}

class WeaponsInLocationPage extends CarWarsPage {
    static at = { waitFor { $("div.content.WeaponLocationPage").displayed } }
    static url = '/weaponLocation';
    static content = {
        weapon(to: WeaponPage) { id -> $("a.item", id) }
        addWeapon(to: WeaponCategoriesPage) { $("a.item", text: "Add Weapon") }
        addDischarger(to: WeaponCategoriesPage) { $("a.item", text: "Add Discharger") }
        addTL(to: WeaponCategoriesPage) { $("a.item", text: "Add TL") }
    }
}

class WeaponCategoriesPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Weapon Types") } }
    static url = '/weaponTypes';
    static content = {
        weaponCategory(to: WeaponListPage) { id -> $("a.item", text: id) }
    }
}

class WeaponListPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Weapon List") } }
    static url = '/weaponList';
    static content = {
        // Doesn't always go to WeaponPage: maybe DischargerDialog
        weapon() { id -> $("a.item.${id}") }
    }
}

class WeaponPage extends CarWarsPage {
    static at = { waitFor { $("div.content.WeaponPage").displayed } }
    static url = '/weapon';
    static content = {
        countUp { $("span.button-group.WeaponCount button.ion-plus-circled") }
        countDown { $("span.button-group.WeaponCount button.ion-minus-circled") }
        ammoUp { id -> $("span.AmmoCount.${id} button.ion-plus-circled") }
        ammoDown { id -> $("span.AmmoCount.${id} button.ion-minus-circled") }
        ammoNone { id -> $("span.AmmoCount.${id} button.ion-close-circled") }
        ammoAddClip { id -> $("span.AmmoCount.${id} button.ion-android-list") }
        ammoText { id -> $("span.AmmoCount.${id}").parent().find("span.ng-binding").text() }
        caUp { $("span.button-group.CA button.ion-plus-circled") }
        caDown { $("span.button-group.CA button.ion-minus-circled") }
        caText { $("span.button-group.CA").next() }
        laserGuidanceLink { $("label.item").has("span.ng-scope", text: "Laser Guidance Link") }
        laserGuided { $("label.item").has("span.ng-scope", text: "Laser-Guided") }
        laserGuidedCount(to:AmmoPage) { laserGuided.next() }
        tracer { $("label.item").has("span.ng-scope", text: "Tracer") }
        tracerCount(to:AmmoPage) { tracer.next() }
        proxFused { $("label.item").has("span.ng-scope", text: "Proximity Fused") }
        proximityFusedCount(to:AmmoPage) { proxFused.next() }
        radioDetonated { $("label.item").has("span.ng-scope", text: "Radio Detonated") }
        radioDetonatedCount(to:AmmoPage) { radioDetonated.next() }
        programmable { $("label.item").has("span.ng-scope", text: "Programmable") }
        programmableCount(to:AmmoPage) { programmable.next() }
        impactFused { $("label.item").has("span.ng-scope", text: "Impact Fused") }
        impactFusedCount(to:AmmoPage) { impactFused.next() }
        highVelocity { $("label.item").has("span.ng-scope", text: "High-Velocity Grenades") }
        highVelocityCount(to:AmmoPage) { highVelocity.next() }
        fake { $("label.item").has("span.ng-scope", text: "Fake") }
        pulse { $("label.item").has("span.ng-scope", text: "Pulse Laser") }
        infrared { $("label.item").has("span.ng-scope", text: "Infrared Laser") }
        blueGreen { $("label.item").has("span.ng-scope", text: "Bluegreen Laser") }
        bumperTrigger { $("label.item").has("span.ng-scope", text: "Bumper Trigger") }
        rotaryMagazine { $("label.item").has("span.ng-scope", text: "Rotary Magazine") }
        magazineSwitch { $("label.item").has("span.ng-scope", text: "Magazine Switch") }
        fri { $("label.item").has("span.ng-scope", text: "Fire Retardant Insulator") }
        concealment { $("label.item").has("span.ng-scope", text: "Concealment") }
        blowThrough { $("label.item").has("span.ng-scope", text: "Blow-Through Concealment") }
        harm { $("label.item").has("span.ng-scope", text: "Anti-Radar (HARM)") }
        harmCount(to:AmmoPage) { harm.next() }

        showAmmo { $("a.item", text: "Show extra ammo types") }
        hideAmmo { $("a.item", text: "Hide extra ammo types") }
    }
}

class AmmoPage extends CarWarsPage {
    static at = { waitFor { $("div.bar-header.Ammo").displayed } }
    static url = '/ammo';
    static content = {
        ammoUp { id -> $("span.AmmoCount.${id} button.ion-plus-circled") }
        ammoDown { id -> $("span.AmmoCount.${id} button.ion-minus-circled") }
        back(to:WeaponPage) { $("div.content a.item") }
    }
}

class CrewGearPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Driver Gear") || isControlTitle("Gunner Gear") ||
            isControlTitle("Cyclist Gear") || isControlTitle("Passenger Gear") } }
    static url = '/crewGear';
    static content = {
        explosives(to: CrewGearListPage) { $("a.item", text: "Explosives") }
        backpacks(to: CrewGearListPage) { $("a.item", text: "Backpack Items") }
        otherGear(to: CrewGearListPage) { $("a.item", text: "Goggles, Tools, & Other") }
        weaponCategory(to: HandWeaponListPage) { name -> $("a.item", text: name) }
        addWeapon(to:HandWeaponCategoriesPage) { $("a.item", text: "Add Weapon") }
    }
}

class HandWeaponCategoriesPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Hand Weapons") } }
    static url = '/handWeaponCategories';
    static content = {
        weaponCategory(to: HandWeaponListPage) { name -> $("a.item", text: name) }
    }
}

class HandWeaponListPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Hand Weapons") } }
    static url = '/handWeaponList';
    static content = {
        weapon(to: HandWeaponPage) { id -> $("a.item.${id}") }
    }
}

class HandWeaponPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Hand Weapon") } }
    static url = '/handWeapon';
    static content = {
        name {
            def items = $("div.content div.list div.item");
            if(items.first().displayed) return items.first().text()
            else return items.eq(1).text()
        }
        backButton(to: CrewGearPage) { $("div.bar-header button", text:"Back") }
        countUp { $("span.button-group.WeaponCount button.ion-plus-circled") }
        countDown { $("span.button-group.WeaponCount button.ion-minus-circled") }
        ammoUp { id -> $("span.AmmoCount.${id} button.ion-plus-circled") }
        ammoDown { id -> $("span.AmmoCount.${id} button.ion-minus-circled") }
        ammoNone { id -> $("span.AmmoCount.${id} button.ion-close-circled") }
        ammoAddClip { id -> $("span.AmmoCount.${id} button.ion-android-storage") }
        ammoText { id -> $("span.AmmoCount.${id}").parent().find("span.ng-binding").text() }
        caUp { $("span.button-group.Extended button.ion-plus-circled") }
        caDown { $("span.button-group.Extended button.ion-minus-circled") }
        caText { $("span.button-group.Extended").text() }
        laserScope { $("label.item").has("span.ng-scope", text: "Laser Scope") }
        foldingStock { $("label.item").has("span.ng-scope", text: "Folding Stock") }
        impactFuse { $("label.item").has("span.ng-scope", text: "Impact Fuse") }
        powerPack { $("label.item").has("span.ng-scope", text: "Power Pack") }
    }
}

class CrewGearListPage extends CarWarsPage {
    static at = { waitFor { $("div.bar-header.CrewGearList").displayed } }
    static url = '/crewGearList';
    static content = {
        limpetUp { $("span.button-group.LimpetMine button.ion-plus-circled") }
        limpetDown { $("span.button-group.LimpetMine button.ion-minus-circled") }
        limpetText { $("span.button-group.LimpetMine").next() }
        plastiqueUp { $("span.button-group.PlastiqueBrick button.ion-plus-circled") }
        plastiqueDown { $("span.button-group.PlastiqueBrick button.ion-minus-circled") }
        plastiqueText { $("span.button-group.PlastiqueBrick").next() }
        shapedPlastiqueUp { $("span.button-group.ShapedPlastiqueBrick button.ion-plus-circled") }
        shapedPlastiqueDown { $("span.button-group.ShapedPlastiqueBrick button.ion-minus-circled") }
        shapedPlastiqueText { $("span.button-group.ShapedPlastiqueBrick").next() }
        timedDetonatorUp { $("span.button-group.TimedDetonator button.ion-plus-circled") }
        timedDetonatorDown { $("span.button-group.TimedDetonator button.ion-minus-circled") }
        timedDetonatorText { $("span.button-group.TimedDetonator").next() }
        remoteDetonatorUp { $("span.button-group.RemoteDetonator button.ion-plus-circled") }
        remoteDetonatorDown { $("span.button-group.RemoteDetonator button.ion-minus-circled") }
        remoteDetonatorText { $("span.button-group.RemoteDetonator").next() }
        wireUp { $("span.button-group.ContactWire20spool button.ion-plus-circled") }
        wireDown { $("span.button-group.ContactWire20spool button.ion-minus-circled") }
        wireText { $("span.button-group.ContactWire20spool").next() }

        radioDetonator { $("label.item").has("span.ng-scope", text: "Radio Detonator Control") }
        plunger { $("label.item").has("span.ng-scope", text: "Plunger") }
        backpack { $("label.item").has("span.ng-scope", text: "Backpack") }
        medikit { $("label.item").has("span.ng-scope", text: "Medikit") }
        portableMedikit { $("label.item").has("span.ng-scope", text: "Portable Medikit") }
        fieldRadio { $("label.item").has("span.ng-scope", text: "Portable Field Radio") }
        gasMask { $("label.item").has("span.ng-scope", text: "Gas Mask") }
        infraredGoggles { $("label.item").has("span.ng-scope", text: "Infrared Goggles") }
        liGoggles { $("label.item").has("span.ng-scope", text: "Light Intensifier Goggles") }
        liGasMask { $("label.item").has("span.ng-scope", text: "Light Intensifier Gas Mask") }
        miniMechanic { $("label.item").has("span.ng-scope", text: "Mini-Mechanic") }
        handheldCamera { $("label.item").has("span.ng-scope", text: "Handheld Camera") }
        helmetCamera { $("label.item").has("span.ng-scope", text: "Helmet Camera") }
        searchlight { $("label.item").has("span.ng-scope", text: "Portable Searchlight") }
        riotShield { $("label.item").has("span.ng-scope", text: "Riot Shield") }
        tintedGoggles { $("label.item").has("span.ng-scope", text: "Tinted Goggles") }
        toolKit { $("label.item").has("span.ng-scope", text: "Tool Kit") }
        walkieTalkie { $("label.item").has("span.ng-scope", text: "Walkie-Talkie") }

        backButton(to: CrewGearPage) { $("div.bar-header button", text:"Back") }
    }
}

class GearListPage extends CarWarsPage {
    static at = { waitFor { $("div.bar-header.GearList").displayed } }
    static url = '/gearList';
    static content = {
        atadUp { $("span.button-group.ATAD button.ion-plus-circled") }
        atadDown { $("span.button-group.ATAD button.ion-minus-circled") }
        atadText { $("span.button-group.ATAD").next() }
        ammoBoxUp { $("span.button-group.BulkAmmoBox button.ion-plus-circled") }
        ammoBoxDown { $("span.button-group.BulkAmmoBox button.ion-minus-circled") }
        ammoBoxText { $("span.button-group.BulkAmmoBox").next() }
        webUp { $("span.button-group.LaserReactiveWeb button.ion-plus-circled") }
        webDown { $("span.button-group.LaserReactiveWeb button.ion-minus-circled") }
        webText { $("span.button-group.LaserReactiveWeb").next() }
        timerUp { $("span.button-group.WeaponTimer button.ion-plus-circled") }
        timerDown { $("span.button-group.WeaponTimer button.ion-minus-circled") }
        timerText { $("span.button-group.WeaponTimer").next() }
        holocubeUp { $("span.button-group.CameraHolocube button.ion-plus-circled") }
        holocubeDown { $("span.button-group.CameraHolocube button.ion-minus-circled") }
        holocubeText { $("span.button-group.CameraHolocube").next() }
        mapUp { $("span.button-group.ComputerNavMapCube button.ion-plus-circled") }
        mapDown { $("span.button-group.ComputerNavMapCube button.ion-minus-circled") }
        mapText { $("span.button-group.ComputerNavMapCube").next() }
        erisTransUp { $("span.button-group.ERISTransmitter button.ion-plus-circled") }
        erisTransDown { $("span.button-group.ERISTransmitter button.ion-minus-circled") }
        erisTransText { $("span.button-group.ERISTransmitter").next() }
        rcTransUp { $("span.button-group.RCTransmitter button.ion-plus-circled") }
        rcTransDown { $("span.button-group.RCTransmitter button.ion-minus-circled") }
        rcTransText { $("span.button-group.RCTransmitter").next() }
        fakePassUp { $("span.button-group.FakePassenger button.ion-plus-circled") }
        fakePassDown { $("span.button-group.FakePassenger button.ion-minus-circled") }
        fakePassText { $("span.button-group.FakePassenger").next() }
        movingPassUp { $("span.button-group.MovingFakePassenger button.ion-plus-circled") }
        movingPassDown { $("span.button-group.MovingFakePassenger button.ion-minus-circled") }
        movingPassText { $("span.button-group.MovingFakePassenger").next() }
        accommodationUp { $("span.button-group.PassAccommodation button.ion-plus-circled") }
        accommodationDown { $("span.button-group.PassAccommodation button.ion-minus-circled") }
        accommodationText { $("span.button-group.PassAccommodation").next() }
        sleepingUp { $("span.button-group.SleepingArea button.ion-plus-circled") }
        sleepingDown { $("span.button-group.SleepingArea button.ion-minus-circled") }
        sleepingText { $("span.button-group.SleepingArea").next() }

        bollix { $("label.item").has("span.ng-scope", text: "Bollix") }
        antiRadar { $("label.item").has("span.ng-scope", text: "Anti-Radar Netting") }
        iff { $("label.item").has("span.ng-scope", text: "Identify Friend or Foe") }
        infrared { $("label.item").has("span.ng-scope", text: "Infrared Sighting System") }
        ldRadio { $("label.item").has("span.ng-scope", text: "Long-Distance Radio") }
        earthStation { $("label.item").has("span.ng-scope", text: "Portable Earth Station") }
        radar { $("label.item").has("span.ng-scope", text: "Radar") }
        lrRadar { $("label.item").has("span.ng-scope", text: "Long-Range Radar") }
        detector { $("label.item").has("span.ng-scope", text: "Radar Detector") }
        jammer { $("label.item").has("span.ng-scope", text: "Radar Jammer") }
        searchlight { $("label.item").has("span.ng-scope", text: "Searchlight") }
        armoredSearchlight { $("label.item").has("span.ng-scope", text: "Armored Searchlight") }
        soundEnhancement { $("label.item").has("span.ng-scope", text: "Sound Enhancement") }
        soundSystem { $("label.item").has("span.ng-scope", text: "Sound System") }
        computerGunner { $("label.item").has("span.ng-scope", text: "Computer Gunner") }
        gunnerSoftware { $("label.item").has("span.ng-scope", text: "Comp. Gunner Software") }
        fireExtinguisher { $("label.item").has("span.ng-scope", text: "Fire Extinguisher") }
        ife { $("label.item").has("span.ng-scope", text: "Improved Fire Extinguisher") }
        autopilot { $("label.item").has("span.ng-scope", text: "Autopilot") }
        pilotSoftware { $("label.item").has("span.ng-scope", text: "Autopilot Software") }
        pilotGunner { $("label.item").has("span.ng-scope", text: "Autopilot Gunner Link") }
        tv { $("label.item").has("span.ng-scope", text: "Compact TV") }
        navigator { $("label.item").has("span.ng-scope", text: "Computer Navigator") }
        solar { $("label.item").has("span.ng-scope", text: "Solar Panel") }
        surge { $("label.item").has("span.ng-scope", text: "Surge Protector") }
        computer { $("label.item").has("span.ng-scope", text: "Vehicular Computer") }
        antiTheft { $("label.item").has("span.ng-scope", text: "Anti-Theft System") }
        safe { $("label.item").has("span.ng-scope", text: "Cargo Safe") }
        refrigerator { $("label.item").has("span.ng-scope", text: "C.Safe Refrigerator") }
        rebreather { $("label.item").has("span.ng-scope", text: "C.Safe Rebreather") }
        selfDestruct { $("label.item").has("span.ng-scope", text: "C.Safe Self-Destruct") }
        erisReceiver { $("label.item").has("span.ng-scope", text: "ERIS Receiver") }
        smallMini { $("label.item").has("span.ng-scope", text: "Mini-Safe (Small)") }
        largeMini { $("label.item").has("span.ng-scope", text: "Mini-Safe (Large)") }
        nbc { $("label.item").has("span.ng-scope", text: "N/B/C Shielding") }
        rcReceiver { $("label.item").has("span.ng-scope", text: "RC Guidance Receiver") }
        beerFridge { $("label.item").has("span.ng-scope", text: "Armored Beer Fridge") }
        miniFridge { $("label.item").has("span.ng-scope", text: "Armored Minifridge") }
        camouflage { $("label.item").has("span.ng-scope", text: "Camouflage Netting") }
        ctc2 { $("label.item").has("span.ng-scope", text: "2-Space Car Top Carrier") }
        ctc4 { $("label.item").has("span.ng-scope", text: "4-Space Car Top Carrier") }
        ctc6 { $("label.item").has("span.ng-scope", text: "6-Space Car Top Carrier") }
        fakeCTC { $("label.item").has("span.ng-scope", text: "Fake C/T Carrier w/E.B.") }
        galley { $("label.item").has("span.ng-scope", text: "Galley") }
        portableShop { $("label.item").has("span.ng-scope", text: "Portable Shop (4 cases)") }
        towBar { $("label.item").has("span.ng-scope", text: "Tow Bar") }
        winch { $("label.item").has("span.ng-scope", text: "Winch") }

        hitches(to: HitchPage) { $("a.item", text: "Hitches") }
        backButton(to: GearCategoriesPage) { $("div.bar-header button", text:"Back") }
    }
}

class GearCategoriesPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Gear Types") } }
    static url = '/gearTypes';
    static content = {
        linksButton(to: LinksPage) { $("div.ionic-body div.list a.item", 0) }
        smartLinksButton(to: LinksPage) { $("div.ionic-body div.list a.item", 1) }
        combatButton(to: GearListPage) { $("a.item", text: "Combat & Weapons") }
        sensorsButton(to: GearListPage) { $("a.item", text: "Sensors & Comm") }
        electronicsButton(to: GearListPage) { $("a.item", text: "Electronics") }
        securityButton(to: GearListPage) { $("a.item", text: "Security") }
        recreationalButton(to: GearListPage) { $("a.item", text: "Recreational") }
        towingButton(to: GearListPage) { $("a.item", text: "Towing & Salvage") }
        cargoButton(to: CargoPage) { $("a.item", text: startsWith("Cargo Allocation")) }
        boostersButton(to: BoosterPage) { $("a.item", text: "Boosters & Jump Jets") }
    }
}

class LinksPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Links") || isControlTitle("Smart Links") } }
    static url = '/linkList';
    static content = {
        backButton(to: GearCategoriesPage) { $("div.bar-header button", text:"Back") }
        linkButton(to: LinkPage) { id -> $("div.ionic-body div.list a.item", id) }
        addLink(to: LinkPage) { $("a.item", text: "Add New Link") }
    }
}

class LinkPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Configure Link") || isControlTitle("Configure Smart Link") } }
    static url = '/link';
    static content = {
        backButton(to: LinksPage) { $("div.bar-header button", text:"Back") }
        removeButton(to: LinksPage) { $("a.item", text: "Remove Link") }
        linkItem { id -> $("label.item", id) }
        linkName { name -> $("label.item").has('span.ng-scope', text: name).first() }
    }
}

class CargoPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Reserved Cargo") } }
    static url = '/cargo';
    static content = {
        backButton(to: GearCategoriesPage) { $("div.bar-header button", text:"Back") }
        weight { $('input', 'ng-model': 'weight') }
        space { $('input', 'ng-model': 'space') }
        toggleCarrier(required: false) { $('a.item', text: startsWith('Reserved Cargo in ')) }
    }
}

class BoosterPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Rocket Booster") || isControlTitle("Jump Jets") } }
    static url = '/booster'
    static content = {
        thrustUp { $("span.button-group.Thrust button.ion-plus-circled") }
        thrustDown { $("span.button-group.Thrust button.ion-minus-circled") }
        thrustText { $("span.button-group.Thrust").text() }
        maxWeight { $("div.Weight label.item", 0) }
        currentWeight { $("div.Weight label.item", 1) }
        booster { $("label.item").has("div.item-content", text: "Rocket Booster") }
        jets { $("label.item").has("div.item-content", text: "Jump Jets") }
        rear { $("label.item").has("div.item-content", text: "Rear-facing") }
        front { $("label.item").has("div.item-content", text: "Front-facing") }
        bottom { $("label.item").has("div.item-content", text: "Bottom-facing") }
        top { $("label.item").has("div.item-content", text: "Top-facing") }
    }
}

class HitchPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Hitches") } }
    static url = "/hitch"
    static content = {
        explosive { $("label.item").has("span.ng-scope", text: "Explosive Hitch") }
        quickRelease { $("label.item").has("span.ng-scope", text: "Quick-Release Hitch") }
        armorUp { $("span.button-group.Armor button.ion-plus-circled") }
        armorDown { $("span.button-group.Armor button.ion-minus-circled") }
        armorText { $("span.button-group.Armor").text() }
        noHitch { $("label.item").has("div.item-content", text: "No hitch") }
        lightHitch { $("label.item").has("div.item-content", text: "Light Hitch (2,000 lbs. tow)") }
        standardHitch { $("label.item").has("div.item-content", text: "Standard Hitch (6,000 lbs. tow)") }
        heavyHitch { $("label.item").has("div.item-content", text: "Heavy Hitch (12,000 lbs. tow)") }
        extraHeavyHitch { $("label.item").has("div.item-content", text: "Extra-Heavy Hitch (20,000 lbs. tow)") }
    }
}

class DesignPage extends CarWarsPage {
    static at = { waitFor { $("div.content.DesignPage").displayed } }
    static url = '/design';
    static content = {
        designName { $("input", placeholder: "Design Name") }
        color { $("input", 'ng-model': 'color') } // Not settable in current Selenium
        equipmentWeight { $("label.item").has("span.ng-scope", text: "Weight for Personal Equipment") }
        classic { $("label.item").has("div.item-content", text: "Classic Technology") }
        cwc { $("label.item").has("div.item-content", text: "CWC Technology") }
        uacfh { $("label.item").has("div.item-content", text: "UACFH+Pyramid Technology") }
        military { $("label.item").has("div.item-content", text: "Military Technology") }
        saveButton(to: SavePage) { $("a.item", text: "Save Design") }
        shareDesign() { $("a.item", text: "Share Design") } // TODO: make this go someplace
        addToList() { $("a.item", text: "Add to List") } // TODO: make this go someplace
        pdf() { $("a.item", text: "Download PDF") }
    }
}

class SavePage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Save Design") } }
    static url = '/save';
    static content = {
        name { $("span.input-label", text: "Name:").next() }
        email { $("span.input-label", text: "E-mail:").next() }
        designName { $("span.input-label", text: "Design:").next() }
        stockCar { $("label.item").has("span.ng-scope", text: "Submit as Stock Car") }
        stockCheckbox { stockCar.find('input') }
        stockPrepare(to: StockPage) { $("a.item", text: "Prepare Stock Car") }
        save(to: ConfirmSavePage) { $("a.item", text: "Save Design") }
    }
}

class StockPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Save Stock Car") } }
    static url =  '/saveStock';
    static content = {
        arena { $("label.item").has("span.ng-scope", text: startsWith("Arena Design")) }
        startTagging { arena.next() }
        gas { $("button.button", text: "Gas") }
        electric { $("button.button", text: "Electric") }
        antiPed { $("button.button", text: "Anti-Ped") }
        tireShot { $("button.button", text: "Tire Shot") }
        incendiary { $("button.button", text: "Incendiary") }
        rammer { $("button.button", text: "Rammer") }
        racer { $("button.button", text: "Racer") }
        sporty { $("button.button", text: "Sporty") }
        offRoad { $("button.button", text: "Off-Road") }
        everyday { $("button.button", text: "Everyday") }
        police { $("button.button", text: "Police") }
        emergency { $("button.button", text: "Emergency") }
        bandit { $("button.button", text: "Bandit") }
        commercial { $("button.button", text: "Commercial") }
        courier { $("button.button", text: "Courier") }
        convoy { $("button.button", text: "Convoy") }
        frontMan { $("button.button", text: "Front Man") }
        tailEnd { $("button.button", text: "Tail-End") }
        cargo { $("button.button", text: "Cargo") }
        passenger { $("button.button", text: "Passenger") }
        executive { $("button.button", text: "Executive") }
        finishTagging { $("a.item", text: "Done tagging") }
        designerNotes { $("span.input-label", text: "Designer Notes:").next() }
        signature { $("span.input-label", text: "Designer Signature:").next() }
        save(to: ConfirmSavePage) { $("a.item").has("b", text: "Save Design") }
    }
}

class ConfirmSavePage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Design Saved") } }
    static url =  '/confirmSave';
    static content = {
        designId { stripPrefix($("a.DesignURL").@href) }
    }

    static stripPrefix(name) {
        int pos = name.indexOf("/load/");
        return pos < 0 ? name : name.substring(pos+6);
    }
}

class StockListPage extends Page {
    static at = { waitFor { $("h1.title", text: "Browse Stock Cars").displayed } }
    static url =  '/stock';

    static content = {
        bodyHeader { $("a.item").has("b", text:"Body:") }
        arenaHeader { $("a.item").has("b", text:"Arena Designs:") }
        tagsHeader { $("a.item").has("b", text:"Tags:") }
        encumbranceHeader { $("a.item").has("b", text:"Encumbrance:") }

        car { $("button.button", text: "Car") }
        carTrailer { $("button.button", text: "Car Trailer") }
        cycle { $("button.button", text: "Cycle") }
        trike { $("button.button", text: "Trike") }
        tenWheeler { $("button.button", text: "Ten Wheeler") }
        bus { $("button.button", text: "Bus") }
        tractor { $("button.button", text: "Tractor") }
        trailer { $("button.button", text: "Trailer") }
        div5 { $("button.button", text: "Div 5") }
        div10 { $("button.button", text: "Div 10") }
        div15 { $("button.button", text: "Div 15") }
        div20 { $("button.button", text: "Div 20") }
        div25 { $("button.button", text: "Div 25") }
        div30 { $("button.button", text: "Div 30") }
        div40 { $("button.button", text: "Div 40") }
        div60 { $("button.button", text: "Div 60") }
        div100 { $("button.button", text: "Div 100") }
        gas { $("button.button", text: "Gas") }
        electric { $("button.button", text: "Electric") }
        antiPed { $("button.button", text: "Anti-Ped") }
        tireShot { $("button.button", text: "Tire Shot") }
        incendiary { $("button.button", text: "Incendiary") }
        rammer { $("button.button", text: "Rammer") }
        racer { $("button.button", text: "Racer") }
        sporty { $("button.button", text: "Sporty") }
        offRoad { $("button.button", text: "Off-Road") }
        everyday { $("button.button", text: "Everyday") }
        police { $("button.button", text: "Police") }
        emergency { $("button.button", text: "Emergency") }
        bandit { $("button.button", text: "Bandit") }
        commercial { $("button.button", text: "Commercial") }
        courier { $("button.button", text: "Courier") }
        convoy { $("button.button", text: "Convoy") }
        frontMan { $("button.button", text: "Front Man") }
        tailEnd { $("button.button", text: "Tail-End") }
        cargo { $("button.button", text: "Cargo") }
        passenger { $("button.button", text: "Passenger") }
        executive { $("button.button", text: "Executive") }
        ge { $("button.button", text: "GE") }
        weight { $("button.button", text: "Weight") }
        either { $("button.button", text: "Any") }

        design(required: false) { id -> $("div:not(.Copy) > div.StockCarDiv.ID${id}") }
        designName(to: StockCarPage) { id -> design(id).find(".StockCarName") }
        designCost { id -> design(id).find(".StockCar.Cost.Field").text() }
        designBody { id -> design(id).find(".StockCar.Body.Field").text() }
        designCargoSpace { id -> design(id).find(".StockCar.CargoSpace.Field").findAll({it.displayed}).text() }
        designCargoWeight { id -> design(id).find(".StockCar.CargoWeight.Field", 0).text() }
        designMaxPull { id -> design(id).find(".StockCar.CargoWeight.Field", 1).text() }
        designTotalWeight { id -> design(id).find(".StockCar.CargoWeight.Field", 2).text() }
        designHC { id -> design(id).find(".StockHC .StockCar.HC.Field", 0).text() }
        designPassengers { id -> design(id).find(".StockPass .StockCar.HC.Field").text() }
        designTopSpeed { id -> design(id).find(".StockCar.Speed.Field").text() }
        designAcceleration { id -> design(id).find(".StockCar.Acceleration.Field").text() }
        designTags { id -> design(id).find(".StockCarTags").text() }
        designTechLevel { id -> design(id).find(".StockCar.Tech.Field").text() }
        designStars(required: false) { id -> design(id).find(".StockCarStars") }
        designStarChecked { id, value -> designStars(id).find(".StockCarStarRight", text: value).classes().contains("StockCarStarOn") }

        loading(required: false) { $("div.item", text: "Searching for designs...") }
        closeButton { $("a.item", text: "Return to Current Design") }
    }
}

class StockCarPage extends Page {
    static at = { waitFor { $("h1.title", text: "Review Stock Car").displayed } }
    static url = '/stockReview';

    static content = {
        signIn { $("a.item", text:startsWith("Sign in")) }

        yourRating { $("#Controls").find(".CarStockZoomStars") }
        ratingLink { id -> yourRating.find("a", id * 2) }
        ratingNot { id -> !ratingLink(id).classes().contains('rating') }
        ratingAtLeast { id -> ratingLink(id).classes().contains('rating') }
        yourComments { $("textarea", "ng-model":"comments") }
        yourTags { $("a.item", text: startsWith("Your Tags: ")) }
        saveReview { $("a.item", text: "Save Your Review") }
        customizeDesign { $("a.item", text: "Customize Design") }
        shareDesign { $("a.item", text: "Share Design") }
        downloadPDF { $("a.item", text: "Download PDF") }
        tag { name -> $("button.button", text: name) }
        tagged { name -> tag(name).classes().contains("button-positive") }
        doneTagging { $("a.item", text: "Done tagging") }

        selected(required: false) { $("#StockCarZoom") }
        selectedName { selected.find(".StockCarName") }
        selectedCost { selected.find(".StockCar.Cost.Field").text() }
        selectedBody { selected.find(".StockCar.Body.Field").text() }
        selectedHC { selected.find(".StockHC .StockCar.HC.Field").text() }
        selectedTopSpeed { selected.find(".StockCar.Speed.Field").text() }
        selectedAcceleration { selected.find(".StockCar.Acceleration.Field").text() }
        selectedTags { selected.find(".StockCarTags").text() }
        selectedTechLevel { selected.find(".StockCar.Tech.Field").text() }
        selectedStars(required: false) { selected.find(".StockCarStars", 0) }
        selectedStarChecked { value -> selectedStars.find(".StockCarStarRight", text: value).classes().contains("StockCarStarOn") }
        selectedSignature { selected.find(".StockCarSignature").text() }
        rating { id -> selected.find(".StockCarRating", id) }
        ratingUser { id -> rating(id).find(".StockReviewUser").text() }
        ratingComments { id -> rating(id).find(".StockReviewComments").text() }
        ratingStars(required: false) { id -> rating(id).find(".StockCarStars") }
        ratingStarChecked { id, value -> ratingStars(id).find(".StockCarStarRight", text: value).classes().contains("StockCarStarOn") }

        returnToList(to: StockListPage) { $("a.item", text: "Return to Stock Car List") }
    }
}

class AdminMenuPage extends CarWarsPage {
    static at = { waitFor { isControlTitle("Admin Options") } }
    static url =  '/adminMenu';
    static content = {
        reviewStock(to:AdminReviewPage) { $("a.item", text: contains("Pending Stock Cars")) }
        regenerate { $("a.item", text: "Regenerate Designs") }
    }
}

class AdminReviewPage extends Page {
    static at = { waitFor { $("h1.title", text: "Stock Car Review").displayed } }
    static url = "/adminReview"
    static content = {
        // Right-side list view
        loading(required: false) { $("div", text: "Loading designs...") }
        refreshList { $("a.item", text: "Refresh list") }
        returnToDesigner { $("a.item", text: "Return to Designer") }
        // Right-side detail view
        arenaCheckbox { $("label.item").has("span.ng-scope", text: startsWith("Arena Design")) }
        tagsButton { $("a.item", text: startsWith("Tags: ")) }
        designerNotes { $("textarea", "ng-model":"designerNotes") }
        designerSignature { $("textarea", "ng-model":"designerSignature") }
        reviewerNotes { $("textarea", "ng-model":"reviewerNotes") }
        reviewerStars { $("#Controls").find(".CarStockZoomStars") }
        ratingLink { id -> reviewerStars.find("a", id * 2) }
        ratingNot { id -> !ratingLink(id).classes().contains('rating') }
        ratingAtLeast { id -> ratingLink(id).classes().contains('rating') }
        returnToList { $("a.item", text: "Return to Pending List") }
        publish { $("a.item", text: "Publish Design") }
        defer { $("a.item", text: "Defer Design") }
        // Right-side tags view
        tag { name -> $("button.button", text: name) }
        tagged { name -> tag(name).classes().contains("button-positive") }
        doneTagging { $("a.item", text: "Done tagging") }

        // Left-side list view
        design(required: false) { id -> $("div.StockCarDiv.ID${id}") }
        designName() { id -> design(id).find(".StockCarName") }
        designCost { id -> design(id).find(".StockCar.Cost.Field").text() }
        designBody { id -> design(id).find(".StockCar.Body.Field").text() }
        designHC { id -> design(id).find(".StockHC .StockCar.HC.Field").text() }
        designTopSpeed { id -> design(id).find(".StockCar.Speed.Field").text() }
        designAcceleration { id -> design(id).find(".StockCar.Acceleration.Field").text() }
        designTags { id -> design(id).find(".StockCarTags").text() }
        designTechLevel { id -> design(id).find(".StockCar.Tech.Field").text() }
        designStars(required: false) { id -> design(id).find(".StockCarStars") }
        designStarChecked { id, value -> designStars(id).find(".StockCarStarRight", text: value).classes().contains("StockCarStarOn") }
        // Left-side detail view
        selected(required: false) { $("#StockCarZoom") }
        selectedName { selected.find(".StockCarName") }
        selectedCost { selected.find(".StockCar.Cost.Field").text() }
        selectedBody { selected.find(".StockCar.Body.Field").text() }
        selectedHC { selected.find(".StockHC .StockCar.HC.Field").text() }
        selectedTopSpeed { selected.find(".StockCar.Speed.Field").text() }
        selectedAcceleration { selected.find(".StockCar.Acceleration.Field").text() }
        selectedTags { selected.find(".StockCarTags").text() }
        selectedTechLevel { selected.find(".StockCar.Tech.Field").text() }
        selectedStars(required: false) { selected.find(".StockCarStars") }
        selectedStarChecked { id, value -> selectedStars(id).find(".StockCarStarRight", text: value).classes().contains("StockCarStarOn") }

    }
}


// ********************* DIALOGS **********************

class MainMenu extends Page {
    static at = { waitFor { $("h1.title", text: "Main Menu").displayed } }
    static url =  '/mainMenu';
    static content = {
        saveButton(to: SavePage) { $("a.item", text: "Save This Design") }
        newDesign(to: NewVehiclePage) { $("a.item", text: "Create a New Design") }
        listDesigns { $("a.item", text: endsWith("View Your Designs")) }
        searchByName(to: NameSearchPage) { $("a.item", text: "Search Designs ny Name") }
        stockCars(to: StockListPage) { $("a.item", text: "Browse Stock Cars") }
        reviewStock(to: AdminReviewPage) { $("a.item", text: "Review Pending Stock Cars") }
        adminMenu(to: AdminMenuPage) { $("a.item", text: "Admin Menu") }
        tour { $("a.item", text: "Take the Tour") }
        logout(required: false) { $("a.item", text: startsWith("Sign Out")) }
        createAccount(required: false, to: CreateAccountPage) { $("a.item", text: "Create an Account") }
    }
}

class CreateAccountPage extends Page {
    static at = { waitFor { $("h1.title", text: "Create Account").displayed } }
    static url = '/createAccount'
    static content = {
        email { $("input", type: 'email') }
        createAccount { $("a.item", text: "Create Account") }
    }
}

class ConfirmAccountPage extends Page {
    static at = { waitFor { $("h1.title", text: "Create Account").displayed } }
    static url = '/confirmAccount'
    static content = {
        name { $("input", type: 'text', 'ng-model': 'name') }
        password { $("input", type: 'password') }
        createAccount(to: DesignListDialog) { $("a.item", text: "Create Account") }
        email {
            def text = $("div.content p.ng-binding").text().trim()
            text.substring(text.indexOf(' ')+1)
        }
    }
}

class NameSearchPage extends Page { // TODO: no longer a separate page
    static at = { waitFor { $("h1.title", text: "Search Public Designs").displayed } }
    static url = '/searchByName'
    static content = {
        name { $("input", type: 'text', 'ng-model': 'name') }
        search { $("a.item", text: "Search") }
    }
}

class LoginPage extends Page {
    static at = { waitFor { $("h1.title", text: "Sign In").displayed } }
    static url = '/login'
    static content = {
        email { $("input", type: 'email', 'ng-model': 'email') }
        password { $("input", type: 'password') }
        login { $("a.item", text: "Sign In") }
    }
}

class DesignListDialog extends Page {
    static at = { waitFor { $("h1.title", text: "Your Designs").displayed &&
            !$("div.item", text: "Loading designs...").displayed } }
    static url =  '/designList';
    static content = {
        closeButton { $(".DesignList div.ng-modal-close") }
    }
}

class TourDialog extends Page {
    static at = { waitFor { $("div.TourDialog").displayed } }
    static content = {
        closeButton { $("button.InTour", text: "Close") }
    }
}

class DischargerDialog extends Page {
    static at = { waitFor { $("h1.title", text: "Configure Dischargers").displayed } }
    static url =  '/dischargers';
    static content = {
        closeButton(to: WeaponPage) { $("a.item", text: "Done") }
    }
}

// ********************* NON-APP (Admin, etc.) PAGES **********************

//class StockCarAdminPage extends Page {
//    static url = "/admin/stock"
//    static at = { title == "Car Wars Combat Garage: Stock Cars" && $("h2", text: "Available Designs").displayed }
//    static content = {
//        // Elements for every car in the list
//        designList { name -> $("p a", 0, text: name).parent() }
//        designButton { name -> designList(name).find("button") }
//        designDivision { name -> designList(name).find("b").text() }
//        designId { id -> $("#${id}") }
//        designIdButton { id -> designId(id).find("button") }
//        designIdDivision { id -> designId(id).find("b").text() }
//        // Elements populated once a car is selected
//        selectedName { $("#design_name").text() }
//        selectedAcceleration { $("#display_accel").text() }
//        selectedTopSpeed { $("#display_ts").text() }
//        selectedCost { $("#design_cost").text() }
//        selectedHC { $("#display_hc").text() }
//        selectedTechLevel { $("#design_tech_after").text() }
//        selectedBody { $("#design_body").text() }
//        selectedDesignerName { $("#designer_name").text() }
//        // Interactive elements
//        selectedDivision { $("#design_division") }
//        selectedDesignerNotes { $("#designer_notes") }
//        selectedDesignerSignature { $("#signature") }
//        selectedDescription { $("#design_text") }
//        selectedReviewerNotes { $("#design_notes") }
//        deferButton { $("#DeferButton") }
//        publishButton { $("#PublishButton") }
//    }
//}
//
//class StockCarListPage extends Page {
//    static url = "/stock"
//    static at = { title == "Car Wars Combat Garage: Stock Cars" }
//    static content = {
//        designs { name -> $("div.stock_car div.name", text: name).parent() }
//        designDivision { name -> designs(name).parent().parent().previous("h2").find("a").@name }
//        designCost { name -> designs(name).find("div.cost").text() }
//        designBody { name -> designs(name).find("div.body").text() }
//        designTechLevel { name -> designs(name).find("div.tech").text() }
//        designHC { name -> designs(name).find("div.hc").text() }
//        designAcceleration { name -> designs(name).find("div.acceleration").text() }
//        designTopSpeed { name -> designs(name).find("div.speed").text() }
//        designDescription { name -> designs(name).find("div.summary .summary_text").text() }
//        designSignature { name -> designs(name).find("div.summary .signature").text() }
//        designRatings { name, rater -> designs(name).find("div.ratings .rater", text: rater).parent() }
//        designRatingComments { name, rater -> designRatings(name, rater).find(".comments").text() }
//    }
//}