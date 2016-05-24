/* globals angular */

var CWQA = {};
(function() {
    "use strict";

    var active = false;
    var page = null;
    var result = "";

    var installAngularListener = function() {
        var $rootScope = angular.element(document.body).injector().get('$rootScope');
        $rootScope.$on('$routeChangeStart', function(event, arg) {
//            console.log(arg);
        });
        $rootScope.$on('$routeChangeSuccess', function(event, arg) {
            //console.log(arg);
            if(arg) {
                var url = arg.$$route.originalPath;
                page = null;
                for (var i = 0; i < pages.length; i++) {
                    if (pages[i].url === url) {
                        page = pages[i];
                        if(url === '/overview' &&
                            angular.element(document).find('canvas').attr('ng-controller') === 'VehicleSelectorCtrl')
                            emit("    at NewVehiclePage");
                        else
                            emit("    at "+page.name);
                        break;
                    }
                }
                if (!page) {
                    console.log("UNRECOGNIZED PAGE " + url);
                }
            } else {
//                console.log(event);
            }
        });
    };

    document.onclick = function(event) {
        var $target = angular.element(event.target);
        if(event.target.tagName === 'A') {
            processClickOnA($target);
        } else if(event.target.tagName === 'BUTTON') {
            clickOnPageButton($target);
        } else if(event.target.tagName === 'DIV') {
            if($target.hasClass('checkbox'))
                clickOnPageWidget($target.parent().text());
            else if($target.hasClass('item-content')) {
                var text = $target.text();
                if(page && page.name === 'BoosterPage' && /^Maximum Weight/.test(text))
                    emit("    maxWeight.click()");
                else if(page && page.name === 'BoosterPage' && /^Current Weight/.test(text))
                    emit("    currentWeight.click()");
                else
                    clickOnPageWidget(text);
            } else if($target.hasClass('hover-name'))
                emit("    diagramDesignName.click()");
        } else if(event.target.tagName === 'SPAN') {
            if($target.hasClass("customize")) {
                emit("    "+$target.attr('ng-show')+"Count.click()");
            } else findA($target);
        } else if(event.target.tagName === 'I') {
            if($target.hasClass('checkbox-icon'))
                clickOnPageWidget($target.parent().parent().text());
        } else if(event.target.tagName === 'CANVAS' || event.target.tagName === 'INPUT') {
            // Should be handled by the special clickOnCanvas invocation or other handlers herein
        } else {
            findA($target);
        }
    };
    var findA = function($target) {
        var found = false;
        var test = $target.parent();
        while(test && test.length > 0) {
            if(test[0].tagName === 'A') {
                processClickOnA(test);
                found = true;
                break;
            }
            test = test.parent();
        }
        if(!found) console.log(event);
    };
    var processClickOnA = function($target) {
        var i, all;
        if(!active) {
            installAngularListener();
            active = true;
        }
        if($target.hasClass('item')) {
            if ($target.hasClass('Engine0')) emit("    selectEngine(0).click()");
            else if ($target.hasClass('Engine1')) emit("    selectEngine(1).click()");
            else if ($target.hasClass('Engine2')) emit("    selectEngine(2).click()");
            else if ($target.hasClass('Engine3')) emit("    selectEngine(3).click()");
            else if(page && page.name === 'AllWeaponsPage') {
//                console.log("TEXT: --"+$target.text().trim()+"--");
                if($target.parent().children().length > 1) {
                    all = $target.children()[0].className.split(/\s+/);
                    for (i = 0; i < all.length; i++) {
                        if (all[i] !== 'ng-hide')
                            emit("    " + all[i].substr(0, 1).toLowerCase() + all[i].substr(1) + "Weapons.click()");
                    }
                } else if(/Carrier|Cab/.test($target.text())) {
                    emit("    switchWeaponsLocation.click()");
                } else if(/Corner|Top/.test($target.text())) {
                    emit("    bottomSwitchOversize.click()");
                }
            } else if(page && page.name === 'TurretListPage') {
                if($target.parent()[0].className !== 'list')
                    emit("    " + $target.parent()[0].className.substr(0, 1).toLowerCase() + $target.parent()[0].className.substr(1) +
                        "('" + $target.find("b").text() + "').click()");
                else if(/(Front|Back) Turrets/.test($target.text()))
                    emit("    switchOversizeTurrets.click()");
                else
                    emit("    switchTurrets.click()");
            } else if(page && page.name === 'WeaponListPage' || page.name === 'HandWeaponListPage') {
                all = $target[0].className.split(/\s+/);
                for (i = 0; i < all.length; i++) {
                    if (all[i] !== 'item' && all[i] !== 'item-icon-right' && all[i] !== 'narrow')
                        emit("    weapon('" + all[i] + "').click()");
                }
            } else if(page && page.name === 'ArmorPage') {
                if ($target.parent().children().length === 1)
                    emit("    switchArmorLocation.click()");
                else
                    clickOnPageA($target.text().trim(), 'item');
            } else if(page && page.name === 'LinksPage' && $target.text().trim() !== 'Add New Link') {
                all = $target.parent().children();
                for(i=0; i<all.length; i++) {
                    if(all[i] === $target[0]) {
                        emit("    linkButton("+i+").click()");
                    }
                }
            } else clickOnPageA($target.text().trim(), 'item');
        } else if($target.hasClass('button')) {
            clickOnPageA($target.text().trim(), 'button');
        }
    };
    document.onchange = function(event) {
        if(event.target.type === 'text') {
            changePageField(angular.element(event.target), event.target.value);
        }
//        console.log(event);
    };

    CWQA.clickOnCanvas = function(link, item, x, y) {
        var i, list, found;
        var vehicle = angular.element(document.body).injector().get('vehicle');
        emit("//    clickOnCanvasXY("+x+","+y+")");
        if(/^edit.*Weapons/.test(link)) {
            if (item && item.weapon) {
                found = -1;
                list = vehicle.weaponsInLocation({sidecar: item.sidecar, carrier: item.carrier, location: item.weapon.location, isTurret: function () {
                    return /Turret/.test(this.location);
                }});
                for (i = 0; i < list.length; i++) {
                    if (list[i] === item.weapon) {
                        found = i;
                        break;
                    }
                }
                if (found < 0) console.log("ERROR: weapon " + item.weapon.abbv + " not found in location " + item.weapon.location + " carrier " + item.carrier + " sidecar " + item.sidecar);
                else emit("    clickOnCanvas('" + link + "', " + (!!item.sidecar) + ", " + (!!item.carrier) + ", null, " + found + ")");
            } else emit("    clickOnCanvas('" + link + "')");
        } else if("editCrew" === link) {
            found = false;
            if (item.crew.name === 'Passenger') {
                for (i = 0; i < vehicle.car.passengers.length; i++)
                    if (vehicle.car.passengers[i] === item.crew) {
                        found = true;
                        emit("    clickOnCanvas('" + link + "', false, false, 'passengers', " + i + ")");
                        break;
                    }
                if (!found && vehicle.car.carrier)
                    for (i = 0; i < vehicle.car.carrier.passengers.length; i++)
                        if (vehicle.car.carrier.passengers[i] === item.crew) {
                            found = true;
                            emit("    clickOnCanvas('" + link + "', false, true, 'passengers', " + i + ")");
                            break;
                        }
                if (!found && vehicle.car.sidecar)
                    for (i = 0; i < vehicle.car.sidecar.passengers.length; i++)
                        if (vehicle.car.sidecar.passengers[i] === item.crew) {
                            found = true;
                            emit("    clickOnCanvas('" + link + "', true, false, 'passengers', " + i + ")");
                            break;
                        }
            } else {
                for (i = 0; i < vehicle.car.crew.length; i++)
                    if (vehicle.car.crew[i] === item.crew) {
                        found = true;
                        emit("    clickOnCanvas('" + link + "', false, false, 'crew', " + i + ")");
                        break;
                    }
                if (!found && vehicle.car.carrier)
                    for (i = 0; i < vehicle.car.carrier.crew.length; i++)
                        if (vehicle.car.carrier.crew[i] === item.crew) {
                            found = true;
                            emit("    clickOnCanvas('" + link + "', false, true, 'crew', " + i + ")");
                            break;
                        }
                if (!found && vehicle.car.sidecar)
                    for (i = 0; i < vehicle.car.sidecar.crew.length; i++)
                        if (vehicle.car.sidecar.crew[i] === item.crew) {
                            found = true;
                            emit("    clickOnCanvas('" + link + "', true, false, 'crew', " + i + ")");
                            break;
                        }
                if(!found && vehicle.car.topTurret && vehicle.car.topTurret.gunner === item.crew) {
                    found = true;
                    emit("    clickOnCanvas('"+link+"', false, false, 'topTurret','gunner')");
                }
                if(!found && vehicle.car.carrier && vehicle.car.carrier.topTurret && vehicle.car.carrier.topTurret.gunner === item.crew) {
                    found = true;
                    emit("    clickOnCanvas('"+link+"', false, true, 'topTurret','gunner')");
                }
            }
            if (!found) console.log("ERROR: crew " + item.crew.name + " NOT FOUND!");
        } else if(/^edit.*Turret/.test(link) && link !== "editSidecarTurret") {
            var sidecar = false, carrier = false;
            if (item) {
                sidecar = !!item.sidecar;
                carrier = !!item.carrier;
            }
            if (/Carrier/.test(link)) {
                link = link.replace("Carrier", "");
                carrier = true;
            }
            emit("    clickOnCanvas('" + link + "', " + sidecar + ", " + carrier + ")");
        } else if(!link) {
            emit("    clickOnCanvas('')");
        } else {
            emit("    clickOnCanvas('" + link + "')");
        }
    };

    var clickOnPageA = function(text, type) {
        var i;
        if(type === 'button') {
            for (i = 0; i < toolbar.length; i++) {
                if (text === toolbar[i].text) {
                    emit("    " + toolbar[i].name + ".click()");
                    return;
                }
            }
        } else if(type === 'item' && page && text === "Remove Turret") {
            emit("    removeTurret('Turret').click()");
            return;
        } else if(type === 'item' && page && text === "Remove Rocket Platform") {
            emit("    removeTurret('Rocket Platform').click()");
            return;
        } else if(type === 'item' && page && text === "Remove EWP") { // TODO
            emit("    removeTurret('EWP').click()");
            return;
        } else if(page.name === 'WeaponsInLocationPage' && text !== 'Add Weapon') {
            emit("    weapon(FILL IN INDEX).click()");
            return;
        } else if(page.name === 'WeaponCategoriesPage' || page.name === 'HandWeaponCategoriesPage') {
            emit("    weaponCategory('" + text + "').click()");
            return;
        } else if(page.name === 'GearCategoriesPage' && /Smart Links/.test(text)) {
            emit("    smartLinksButton.click()");
            return;
        } else if(page.name === 'GearCategoriesPage' && /Links/.test(text)) {
            emit("    linksButton.click()");
            return;
        } else if(page.name === 'ArmorPage' && /^Add/.test(text)) {
            emit("    distribute.click()");
            return;
        } else if(page.name === 'AmmoPage') {
            emit("    back.click()");
            return;
        } else if(type === 'item' && page && page.widgets) {
            if(clickOnPageWidget(text)) return;
        }
        console.log("Clicked on A with text "+text);
    };
    var clickOnPageButton = function($button) {
        var i, classifier;
        if($button.parent().hasClass("AmmoCount")) {
            var all = $button.parent()[0].className.split(/\s+/);
            for(i=0; i<all.length; i++)
                if(all[i] !== 'button-group' && all[i] !== 'AmmoCount')
                    classifier = all[i];
        }
        if(!page || !page.buttons) return;
        for(i=0; i<page.buttons.length; i++) {
            if($button.hasClass(page.buttons[i].buttonClass) && $button.parent().hasClass(page.buttons[i].groupClass)
                && (!page.buttons[i].text || page.buttons[i].text === $button.text())) {
                emit("    "+page.buttons[i].name+(classifier ? "('"+classifier+"')" : "")+".click()");
                return;
            }
        }
    };
    var clickOnPageWidget = function(text) {
        if(!page || !page.widgets) return false;
        if(page.name === 'LinkPage' && text !== 'Back' && text !== 'Remove Link') {
            emit("    linkName('"+text+"').click()");
            return true;
        }
        for(var i=0; i<page.widgets.length; i++) {
            if(page.widgets[i].text === text) {
                emit("    "+page.widgets[i].name+".click()");
                return true;
            }
        }
        return false;
    };
    var changePageField = function($field, value) {
        if(!page || !page.fields) return false;
        for(var i=0; i<page.fields.length; i++) {
            if($field.attr(page.fields[i].attr) === page.fields[i].value) {
                emit("    "+page.fields[i].name+".value('"+value+"')");
                return;
            }
        }
    };

    var emit = function(text) {
        console.log(text);
        result += text+"\n";
    };

    CWQA.getScript = function() {
        var vehicle = angular.element(document.body).injector().get('vehicle');
        var text = result+"    confirmResult("+ vehicle.car.totalCost + "," + vehicle.car.weightUsed + "," +
            (vehicle.car.spaceUsed + vehicle.car.cargoSpaceUsed) + ",\"" + vehicle.car.designName +"\")\n";
        if(vehicle.hasSidecar())
            text += "    confirmSidecar(" + vehicle.car.sidecar.totalCost() + "," + vehicle.car.sidecar.totalWeight() +
                "," + vehicle.car.sidecar.spaceUsed() + ")\n";
        if(vehicle.hasCarrier())
            text += "    confirmCarrier("+ vehicle.car.carrier.totalCost + "," + vehicle.car.carrier.weightUsed + "," +
                (vehicle.car.carrier.spaceUsed + vehicle.car.carrier.cargoSpaceUsed) + ")\n";
        return text;
    };
    CWQA.clearScript = function() {
        result = "    go()\n    at LoadingPage\n";
    };
    CWQA.clearScript();

    var toolbar = [
        {name: 'mainMenuButton', text: 'Menu'},
        {name: 'toolbarBodyButton', text: 'Body'},
        {name: 'toolbarCrewButton', text: 'Crew'},
        {name: 'toolbarEngineButton', text: 'Engine'},
        {name: 'toolbarGasTankButton', text: 'Gas Tank'},
        {name: 'toolbarTiresButton', text: 'Tires'},
        {name: 'toolbarSportButton', text: 'Sport'},
        {name: 'toolbarModsButton', text: 'Mods'},
        {name: 'toolbarTurretButton', text: 'Turret'},
        {name: 'toolbarWeaponsButton', text: 'Weapons'},
        {name: 'toolbarArmorButton', text: 'Armor'},
        {name: 'toolbarGearButton', text: 'Gear'},
        {name: 'toolbarDesignButton', text: 'Design'}
    ];
    var pages = [
        {
            name: 'LoadingPage',
            url: null,
            widgets: [
                {name: 'newDesignLink', text: "Create a New Design"}
            ]
        },
        // EVERYTHING AFTER HERE GENERATED
        {
            name: 'DefaultPage',
            url: '/overview'
        },
        {
            name: 'BodyPage',
            url: '/body'
            ,buttons: [
            {buttonClass: 'ion-plus-circled', groupClass: 'BodyType', name: 'nextBody'},
            {buttonClass: 'ion-minus-circled', groupClass: 'BodyType', name: 'previousBody'},
            {buttonClass: 'ion-plus-circled', groupClass: 'ChassisType', name: 'nextChassis'},
            {buttonClass: 'ion-minus-circled', groupClass: 'ChassisType', name: 'previousChassis'},
            {buttonClass: 'ion-plus-circled', groupClass: 'SuspensionType', name: 'nextSuspension'},
            {buttonClass: 'ion-minus-circled', groupClass: 'SuspensionType', name: 'previousSuspension'},
            {buttonClass: 'ion-plus-circled', groupClass: 'SidecarSuspension', name: 'nextSidecarSuspension'},
            {buttonClass: 'ion-minus-circled', groupClass: 'SidecarSuspension', name: 'previousSidecarSuspension'},
            {buttonClass: 'ion-plus-circled', groupClass: 'WindshellArmor', name: 'moreWindshellArmor'},
            {buttonClass: 'ion-minus-circled', groupClass: 'WindshellArmor', name: 'lessWindshellArmor'},
            {buttonClass: 'ion-plus-circled', groupClass: 'FifthWheel', name: 'moreFifthWheelArmor'},
            {buttonClass: 'ion-minus-circled', groupClass: 'FifthWheel', name: 'lessFifthWheelArmor'},
            {buttonClass: 'ion-plus-circled', groupClass: 'Windjammer', name: 'moreWindjammerArmor'},
            {buttonClass: 'ion-minus-circled', groupClass: 'Windjammer', name: 'lessWindjammerArmor'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarSubcompact', text: 'Subcompact'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarCompact', text: 'Compact'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarMidsize', text: 'Mid-sized'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarSedan', text: 'Sedan'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarLuxury', text: 'Luxury'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarStationWagon', text: 'Station Wagon'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarPickup', text: 'Pickup'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarCamper', text: 'Camper'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarVan', text: 'Van'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarLightCycle', text: 'Light Cycle'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarMediumCycle', text: 'Medium Cycle'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarHeavyCycle', text: 'Heavy Cycle'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarLightTrike', text: 'Light Trike'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarMediumTrike', text: 'Medium Trike'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarHeavyTrike', text: 'Heavy Trike'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarXHeavyTrike', text: 'Extra-Heavy Trike'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarSprint', text: 'Sprint'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarIndy', text: 'Formula One/Indy'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarDragster', text: 'Dragster'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarCanAm', text: 'Can-Am'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarFunnyCar', text: 'Funny Car'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarMiniVan', text: 'Mini-Van'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarVan6', text: '6\' Van'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarVan10', text: '10\' Van'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarVan15', text: '15\' Van'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarVan20', text: '20\' Van'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarVan25', text: '25\' Van'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarVan30', text: '30\' Van'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarFlatbed6', text: '6\' Flatbed'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarFlatbed10', text: '10\' Flatbed'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarFlatbed15', text: '15\' Flatbed'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarFlatbed20', text: '20\' Flatbed'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarFlatbed25', text: '25\' Flatbed'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarFlatbed30', text: '30\' Flatbed'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarCabover', text: 'Cabover'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarLongnose', text: 'Longnose'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarStandardCabover', text: 'Standard Cabover'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarStandardLongnose', text: 'Standard Longnose'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarSleeperCabover', text: 'Sleeper Cabover'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarSleeperLongnose', text: 'Sleeper Longnose'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarVan40', text: '40\' Van'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarFlatbed40', text: '40\' Flatbed'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarDualFlatbed40', text: '40\' Dual-Level Flatbed'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarReefer40', text: '40\' Reefer'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarTanker40', text: '40\' Tanker'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarDumper40', text: '40\' Dumper'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarMinibus', text: 'Minibus'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarBus30', text: '30\' Bus'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarBus40', text: '40\' Bus'}
        ]
            ,widgets: [
            {name: 'noSidecar', text: 'No Sidecar or Windshell'},
            {name: 'windshell', text: 'Cycle Windshell'},
            {name: 'lightSidecar', text: 'Light Sidecar'},
            {name: 'smallCTS', text: '1-Space Turret Sidecar'},
            {name: 'heavySidecar', text: 'Heavy Sidecar'},
            {name: 'largeCTS', text: '2-Space Turret Sidecar'},
            {name: 'cabover', text: 'Cabover'},
            {name: 'longnose', text: 'Longnose'},
            {name: 'van', text: 'Van'},
            {name: 'flatbed', text: 'Flatbed'},
            {name: 'dualLevel', text: 'Dual-Level Flatbed'},
            {name: 'reefer', text: 'Reefer'},
            {name: 'tanker', text: 'Tanker'},
            {name: 'dumper', text: 'Dumper'},
            {name: 'reversed', text: 'Reversed Trike'},
            {name: 'backDoor', text: 'Back Door in Cab (to Carrier)'},
            {name: 'standardCabover', text: 'Standard Cabover'},
            {name: 'standardLongnose', text: 'Standard Longnose'},
            {name: 'sleeperCabover', text: 'Sleeper Cabover'},
            {name: 'sleeperLongnose', text: 'Sleeper Longnose'},
            {name: 'windjammer', text: 'Windjammer'},
            {name: 'retractor', text: 'Windjammer Retractor'},
            {name: 'explosiveKingpin', text: 'Explosive Kingpin'},
            {name: 'qrKingpin', text: 'Quick-Release Kingpin'},
            {name: 'step', text: 'Semi Trailer Emergency Plate'},
            {name: 'trailer2', text: 'Full Trailer (2 front wheels)'},
            {name: 'trailer4', text: 'Full Trailer (4 front wheels)'}
        ]
        },
        {
            name: 'ArmorPage',
            url: '/armor'
            ,buttons: [
            {buttonClass: 'ion-plus-circled', groupClass: 'PlasticArmor', name: 'nextPlastic'},
            {buttonClass: 'ion-minus-circled', groupClass: 'PlasticArmor', name: 'previousPlastic'},
            {buttonClass: 'ion-plus-circled', groupClass: 'MetalArmor', name: 'nextMetal'},
            {buttonClass: 'ion-minus-circled', groupClass: 'MetalArmor', name: 'previousMetal'}
        ]
            ,widgets: [
            {name: 'sloped', text: 'Sloped Armor'}
        ]
            ,fields: [
            {name: 'singleFront', attr: 'ng-model', value: 'frontSingle'},
            {name: 'singleBack', attr: 'ng-model', value: 'backSingle'},
            {name: 'singleLeft', attr: 'ng-model', value: 'leftSingle'},
            {name: 'singleLeftBack', attr: 'ng-model', value: 'leftBackSingle'},
            {name: 'singleRight', attr: 'ng-model', value: 'rightSingle'},
            {name: 'singleRightBack', attr: 'ng-model', value: 'rightBackSingle'},
            {name: 'singleTop', attr: 'ng-model', value: 'topSingle'},
            {name: 'singleTopBack', attr: 'ng-model', value: 'topBackSingle'},
            {name: 'singleUnderbody', attr: 'ng-model', value: 'underbodySingle'},
            {name: 'singleUnderbodyBack', attr: 'ng-model', value: 'underbodyBackSingle'},
            {name: 'singleFlatbed', attr: 'ng-model', value: 'flatbedSingle'},
            {name: 'singleFlatbedBack', attr: 'ng-model', value: 'flatbedBackSingle'},
            {name: 'frontPlastic', attr: 'ng-model', value: 'frontPlastic'},
            {name: 'frontMetal', attr: 'ng-model', value: 'frontMetal'},
            {name: 'leftPlastic', attr: 'ng-model', value: 'leftPlastic'},
            {name: 'leftMetal', attr: 'ng-model', value: 'leftMetal'},
            {name: 'leftBackPlastic', attr: 'ng-model', value: 'leftBackPlastic'},
            {name: 'leftBackMetal', attr: 'ng-model', value: 'leftBackMetal'},
            {name: 'rightPlastic', attr: 'ng-model', value: 'rightPlastic'},
            {name: 'rightMetal', attr: 'ng-model', value: 'rightMetal'},
            {name: 'rightBackPlastic', attr: 'ng-model', value: 'rightBackPlastic'},
            {name: 'rightBackMetal', attr: 'ng-model', value: 'rightBackMetal'},
            {name: 'backPlastic', attr: 'ng-model', value: 'backPlastic'},
            {name: 'backMetal', attr: 'ng-model', value: 'backMetal'},
            {name: 'topPlastic', attr: 'ng-model', value: 'topPlastic'},
            {name: 'topMetal', attr: 'ng-model', value: 'topMetal'},
            {name: 'topBackPlastic', attr: 'ng-model', value: 'topBackPlastic'},
            {name: 'topBackMetal', attr: 'ng-model', value: 'topBackMetal'},
            {name: 'underbodyPlastic', attr: 'ng-model', value: 'underbodyPlastic'},
            {name: 'underbodyMetal', attr: 'ng-model', value: 'underbodyMetal'},
            {name: 'underbodyBackPlastic', attr: 'ng-model', value: 'underbodyBackPlastic'},
            {name: 'underbodyBackMetal', attr: 'ng-model', value: 'underbodyBackMetal'},
            {name: 'flatbedPlastic', attr: 'ng-model', value: 'flatbedPlastic'},
            {name: 'flatbedMetal', attr: 'ng-model', value: 'flatbedMetal'},
            {name: 'flatbedBackPlastic', attr: 'ng-model', value: 'flatbedBackPlastic'},
            {name: 'flatbedBackMetal', attr: 'ng-model', value: 'flatbedBackMetal'}
        ]
        },
        {
            name: 'AllTiresPage',
            url: '/tireList'
            ,widgets: [
            {name: 'frontTires', text: 'Front Tires'},
            {name: 'backTires', text: 'Back Tires'}
        ]
        },
        {
            name: 'TirePage',
            url: '/tire'
            ,buttons: [
            {buttonClass: 'ion-plus-circled', groupClass: 'Wheelguard', name: 'wheelguardUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'Wheelguard', name: 'wheelguardDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'Wheelhub', name: 'wheelhubUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'Wheelhub', name: 'wheelhubDown'}
        ]
            ,widgets: [
            {name: 'standardTires', text: 'Standard (4 DP)'},
            {name: 'hdTires', text: 'Heavy-Duty (6 DP)'},
            {name: 'prTires', text: 'Puncture-Resistant (9 DP)'},
            {name: 'solidTires', text: 'Solid (12 DP)'},
            {name: 'plasticoreTires', text: 'Plasticore (25 DP)'},
            {name: 'steelbelted', text: 'Steelbelted'},
            {name: 'radial', text: 'Radial'},
            {name: 'slick', text: 'Slick'},
            {name: 'offRoad', text: 'Off-Road'},
            {name: 'snowTires', text: 'Snow Tires'},
            {name: 'fireproof', text: 'Fireproof'},
            {name: 'tireChains', text: 'Tire Chains'}
        ]
        },
        {
            name: 'AllCrewPage',
            url: '/crewList'
            ,widgets: [
            {name: 'carDriver', text: 'Driver'},
            {name: 'gunner', text: 'Gunner'},
            {name: 'sidecarPassenger', text: 'Sidecar Passenger'},
            {name: 'sidecarGunner', text: 'Sidecar Gunner'},
            {name: 'carrierPassenger', text: 'Carrier Passenger'},
            {name: 'carrierGunner', text: 'Carrier Gunner'},
            {name: 'addGunner', text: 'Add Gunner'},
            {name: 'addPassenger', text: 'Add Passenger'},
            {name: 'addSidecarGunner', text: 'Add Sidecar Gunner'},
            {name: 'addSidecarPassenger', text: 'Add Sidecar Passenger'},
            {name: 'addCarrierGunner', text: 'Add Carrier Gunner'},
            {name: 'addCarrierPassenger', text: 'Add Carrier Passenger'}
        ]
        },
        {
            name: 'EngineSelectorPage',
            url: '/engineList'
            ,buttons: [
            {buttonClass: 'ion-plus-circled', groupClass: 'Acceleration', name: 'accelerationUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'Acceleration', name: 'accelerationDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'TopSpeed', name: 'topSpeedUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'TopSpeed', name: 'topSpeedDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'MaxRange', name: 'maxRangeUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'MaxRange', name: 'maxRangeDown'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarEditCurrent', text: 'Customize Current Engine'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarChangeToGas', text: 'Change to Gas'},
            {buttonClass: 'button', groupClass: 'toolbar', name: 'toolbarChangeToElectric', text: 'Change to Electric'}
        ]
        },
        {
            name: 'EnginePage',
            url: '/engine'
            ,buttons: [
            {buttonClass: 'ion-plus-circled', groupClass: 'EngineSize', name: 'biggerEngine'},
            {buttonClass: 'ion-minus-circled', groupClass: 'EngineSize', name: 'smallerEngine'},
            {buttonClass: 'ion-plus-circled', groupClass: 'CA', name: 'caUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'CA', name: 'caDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'EPC', name: 'epcUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'EPC', name: 'epcDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'ISC', name: 'iscUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'ISC', name: 'iscDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'NO2', name: 'noxUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'NO2', name: 'noxDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'FE', name: 'feUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'FE', name: 'feDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'LB', name: 'lbUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'LB', name: 'lbDown'}
        ]
            ,widgets: [
            {name: 'pcCheckbox', text: 'Platinum Catalysts'},
            {name: 'scCheckbox', text: 'Superconductors'},
            {name: 'htmCheckbox', text: 'High-Torque Motors'},
            {name: 'hdhtmCheckbox', text: 'HD High-Torque Motors'},
            {name: 'friCheckbox', text: 'Fire-Retardant Insulator'},
            {name: 'carbCheckbox', text: 'Carburetor'},
            {name: 'mbCarbCheckbox', text: 'Multibarrel Carburetor'},
            {name: 'thCheckbox', text: 'Tubular Headers'},
            {name: 'bpCheckbox', text: 'Blueprinted'},
            {name: 'turboCheckbox', text: 'Turbocharger'},
            {name: 'vpTurboCheckbox', text: 'V.P. Turbocharger'},
            {name: 'superchargerCheckbox', text: 'Supercharger'}
        ]
        },
        {
            name: 'GasTankPage',
            url: '/gasTank'
            ,buttons: [
            {buttonClass: 'ion-plus-circled', groupClass: 'TankSize', name: 'sizeUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'TankSize', name: 'sizeDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'CA', name: 'caUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'CA', name: 'caDown'}
        ]
            ,widgets: [
            {name: 'economy', text: 'Economy (2 DP)'},
            {name: 'heavyDuty', text: 'Heavy-Duty (4 DP)'},
            {name: 'racing', text: 'Racing (4 DP)'},
            {name: 'duelling', text: 'Duelling (8 DP)'},
            {name: 'fri', text: 'Fire-Retardant Insulator'}
        ]
        },
        {
            name: 'SportPage',
            url: '/performanceMods'
            ,widgets: [
            {name: 'caFrame', text: 'CA Frame'},
            {name: 'activeSuspension', text: 'Active Suspension'},
            {name: 'spoiler', text: 'Spoiler'},
            {name: 'airdam', text: 'Airdam'},
            {name: 'streamlined', text: 'Streamlined'},
            {name: 'hdShocks', text: 'HD Shocks'},
            {name: 'hdBrakes', text: 'HD Brakes'},
            {name: 'antilockBrakes', text: 'Antilock Brakes'},
            {name: 'hdTransmission', text: 'HD Transmission'},
            {name: 'overdrive', text: 'Overdrive'},
            {name: 'rollCage', text: 'Roll Cage'},
            {name: 'dragChute', text: 'Drag Chute'},
            {name: 'fpDragChute', text: 'Fireproof Drag Chute'},
            {name: 'bodyPage', text: 'Body Modifications'}
        ]
        },
        {
            name: 'BodyModsPage',
            url: '/bodyMods'
            ,widgets: [
            {name: 'ramplate', text: 'Ramplate'},
            {name: 'fakeRamplate', text: 'Fake Ramplate'},
            {name: 'brushcutter', text: 'Brushcutter'},
            {name: 'bumperSpikes', text: 'Bumper Spikes (Front)'},
            {name: 'backBumperSpikes', text: 'Bumper Spikes (Back)'},
            {name: 'bodyBlades', text: 'Body Blades'},
            {name: 'fakeBodyBlades', text: 'Fake Body Blades'},
            {name: 'amphibious', text: 'Amphibious Modification'},
            {name: 'assaultRamp', text: 'Assault Ramp'},
            {name: 'wheelRamps', text: 'Wheel Ramps'},
            {name: 'leftSideDoor', text: 'Left Side Door'},
            {name: 'rightSideDoor', text: 'Right Side Door'},
            {name: 'convertible', text: 'Convertible Hardtop'},
            {name: 'sunroof', text: 'Sunroof'},
            {name: 'noPaint', text: 'No-Paint Windshield'},
            {name: 'tinted', text: 'Tinted Windows'},
            {name: 'performancePage', text: 'Performance Modifications'}
        ]
        },
        {
            name: 'PersonPage',
            url: '/crew'
            ,buttons: [
            {buttonClass: 'ion-plus-circled', groupClass: 'Computer', name: 'nextComputer'},
            {buttonClass: 'ion-minus-circled', groupClass: 'Computer', name: 'previousComputer'},
            {buttonClass: 'ion-plus-circled', groupClass: 'Seat', name: 'nextSeat'},
            {buttonClass: 'ion-minus-circled', groupClass: 'Seat', name: 'previousSeat'},
            {buttonClass: 'ion-plus-circled', groupClass: 'BodyArmor', name: 'nextBodyArmor'},
            {buttonClass: 'ion-minus-circled', groupClass: 'BodyArmor', name: 'previousBodyArmor'},
            {buttonClass: 'ion-plus-circled', groupClass: 'CA', name: 'caUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'CA', name: 'caDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'MultiCA', name: 'multiCAUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'MultiCA', name: 'multiCADown'}
        ]
            ,widgets: [
            {name: 'fpSuit', text: 'Fireproof Suit'},
            {name: 'flakJacket', text: 'Flak Jacket'},
            {name: 'battleVest', text: 'Battle Vest'},
            {name: 'armoredVest', text: 'Armored Battle Vest'},
            {name: 'extraControls', text: 'Extra Driver Controls'},
            {name: 'pfe', text: 'Portable Fire Ext.'},
            {name: 'addGunner', text: 'Add Gunner'},
            {name: 'removeGunner', text: 'Remove Gunner'},
            {name: 'removePassenger', text: 'Remove Passenger'},
            {name: 'gearButton', text: 'Hand Weapons & Gear'}
        ]
        },
        {
            name: 'TurretListPage',
            url: '/turretList'
        },
        {
            name: 'TurretPage',
            url: '/turret'
            ,buttons: [
            {buttonClass: 'ion-plus-circled', groupClass: 'TurretSize', name: 'sizeUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'TurretSize', name: 'sizeDown'}
        ]
            ,widgets: [
            {name: 'fake', text: 'Fake'},
            {name: 'universal', text: 'Universal'},
            {name: 'addWeapon', text: 'Add Weapon'},
            {name: 'addTL', text: 'Add TL'}
        ]
        },
        {
            name: 'AllWeaponsPage',
            url: '/weaponLocations'
            ,buttons: [
            {buttonClass: 'button', groupClass: 'bar-header', name: 'topSwitchOversize'}
        ]
        },
        {
            name: 'WeaponsInLocationPage',
            url: '/weaponLocation'
            ,widgets: [
            {name: 'addWeapon', text: 'Add Weapon'},
            {name: 'addDischarger', text: 'Add Discharger'},
            {name: 'addTL', text: 'Add TL'}
        ]
        },
        {
            name: 'WeaponCategoriesPage',
            url: '/weaponTypes'
        },
        {
            name: 'WeaponListPage',
            url: '/weaponList'
        },
        {
            name: 'WeaponPage',
            url: '/weapon'
            ,buttons: [
            {buttonClass: 'ion-plus-circled', groupClass: 'WeaponCount', name: 'countUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'WeaponCount', name: 'countDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'AmmoCount', name: 'ammoUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'AmmoCount', name: 'ammoDown'},
            {buttonClass: 'ion-close-circled', groupClass: 'AmmoCount', name: 'ammoNone'},
            {buttonClass: 'ion-android-storage', groupClass: 'AmmoCount', name: 'ammoAddClip'},
            {buttonClass: 'ion-plus-circled', groupClass: 'CA', name: 'caUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'CA', name: 'caDown'}
        ]
            ,widgets: [
            {name: 'laserGuidanceLink', text: 'Laser Guidance Link'},
            {name: 'laserGuided', text: 'Laser-Guided'},
            {name: 'tracer', text: 'Tracer'},
            {name: 'proxFused', text: 'Proximity Fused'},
            {name: 'radioDetonated', text: 'Radio Detonated'},
            {name: 'programmable', text: 'Programmable'},
            {name: 'impactFused', text: 'Impact Fused'},
            {name: 'highVelocity', text: 'High-Velocity Grenades'},
            {name: 'fake', text: 'Fake'},
            {name: 'pulse', text: 'Pulse Laser'},
            {name: 'infrared', text: 'Infrared Laser'},
            {name: 'blueGreen', text: 'Bluegreen Laser'},
            {name: 'bumperTrigger', text: 'Bumper Trigger'},
            {name: 'rotaryMagazine', text: 'Rotary Magazine'},
            {name: 'magazineSwitch', text: 'Magazine Switch'},
            {name: 'fri', text: 'Fire Retardant Insulator'},
            {name: 'concealment', text: 'Concealment'},
            {name: 'blowThrough', text: 'Blow-Through Concealment'},
            {name: 'harm', text: 'Anti-Radar (HARM)'},
            {name: 'showAmmo', text: 'Show extra ammo types'},
            {name: 'hideAmmo', text: 'Hide extra ammo types'}
        ]
        },
        {
            name: 'AmmoPage',
            url: '/ammo'
            ,buttons: [
            {buttonClass: 'ion-plus-circled', groupClass: 'AmmoCount', name: 'ammoUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'AmmoCount', name: 'ammoDown'}
        ]
        },
        {
            name: 'CrewGearPage',
            url: '/crewGear'
            ,widgets: [
            {name: 'explosives', text: 'Explosives'},
            {name: 'backpacks', text: 'Backpack Items'},
            {name: 'otherGear', text: 'Goggles, Tools, & Other'},
            {name: 'addWeapon', text: 'Add Weapon'}
        ]
        },
        {
            name: 'HandWeaponCategoriesPage',
            url: '/handWeaponCategories'
        },
        {
            name: 'HandWeaponListPage',
            url: '/handWeaponList'
        },
        {
            name: 'HandWeaponPage',
            url: '/handWeapon'
            ,buttons: [
            {buttonClass: 'button', groupClass: 'bar-header', name: 'backButton', text: 'Back'},
            {buttonClass: 'ion-plus-circled', groupClass: 'AmmoCount', name: 'ammoUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'AmmoCount', name: 'ammoDown'},
            {buttonClass: 'ion-close-circled', groupClass: 'AmmoCount', name: 'ammoNone'},
            {buttonClass: 'ion-android-storage', groupClass: 'AmmoCount', name: 'ammoAddClip'},
            {buttonClass: 'ion-plus-circled', groupClass: 'Extended', name: 'caUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'Extended', name: 'caDown'}
        ]
            ,widgets: [
            {name: 'laserScope', text: 'Laser Scope'},
            {name: 'foldingStock', text: 'Folding Stock'},
            {name: 'impactFuse', text: 'Impact Fuse'},
            {name: 'powerPack', text: 'Power Pack'}
        ]
        },
        {
            name: 'CrewGearListPage',
            url: '/crewGearList'
            ,buttons: [
            {buttonClass: 'ion-plus-circled', groupClass: 'LimpetMine', name: 'limpetUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'LimpetMine', name: 'limpetDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'PlastiqueBrick', name: 'plastiqueUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'PlastiqueBrick', name: 'plastiqueDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'ShapedPlastiqueBrick', name: 'shapedPlastiqueUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'ShapedPlastiqueBrick', name: 'shapedPlastiqueDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'TimedDetonator', name: 'timedDetonatorUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'TimedDetonator', name: 'timedDetonatorDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'RemoteDetonator', name: 'remoteDetonatorUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'RemoteDetonator', name: 'remoteDetonatorDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'ContactWire20spool', name: 'wireUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'ContactWire20spool', name: 'wireDown'},
            {buttonClass: 'button', groupClass: 'bar-header', name: 'backButton', text: 'Back'}
        ]
            ,widgets: [
            {name: 'radioDetonator', text: 'Radio Detonator Control'},
            {name: 'plunger', text: 'Plunger'},
            {name: 'backpack', text: 'Backpack'},
            {name: 'medikit', text: 'Medikit'},
            {name: 'portableMedikit', text: 'Portable Medikit'},
            {name: 'fieldRadio', text: 'Portable Field Radio'},
            {name: 'gasMask', text: 'Gas Mask'},
            {name: 'infraredGoggles', text: 'Infrared Goggles'},
            {name: 'liGoggles', text: 'Light Intensifier Goggles'},
            {name: 'liGasMask', text: 'Light Intensifier Gas Mask'},
            {name: 'miniMechanic', text: 'Mini-Mechanic'},
            {name: 'handheldCamera', text: 'Handheld Camera'},
            {name: 'helmetCamera', text: 'Helmet Camera'},
            {name: 'searchlight', text: 'Portable Searchlight'},
            {name: 'riotShield', text: 'Riot Shield'},
            {name: 'tintedGoggles', text: 'Tinted Goggles'},
            {name: 'toolKit', text: 'Tool Kit'},
            {name: 'walkieTalkie', text: 'Walkie-Talkie'}
        ]
        },
        {
            name: 'GearListPage',
            url: '/gearList'
            ,buttons: [
            {buttonClass: 'ion-plus-circled', groupClass: 'ATAD', name: 'atadUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'ATAD', name: 'atadDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'BulkAmmoBox', name: 'ammoBoxUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'BulkAmmoBox', name: 'ammoBoxDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'LaserReactiveWeb', name: 'webUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'LaserReactiveWeb', name: 'webDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'WeaponTimer', name: 'timerUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'WeaponTimer', name: 'timerDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'CameraHolocube', name: 'holocubeUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'CameraHolocube', name: 'holocubeDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'ComputerNavMapCube', name: 'mapUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'ComputerNavMapCube', name: 'mapDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'ERISTransmitter', name: 'erisTransUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'ERISTransmitter', name: 'erisTransDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'RCTransmitter', name: 'rcTransUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'RCTransmitter', name: 'rcTransDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'FakePassenger', name: 'fakePassUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'FakePassenger', name: 'fakePassDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'MovingFakePassenger', name: 'movingPassUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'MovingFakePassenger', name: 'movingPassDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'PassAccommodation', name: 'accommodationUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'PassAccommodation', name: 'accommodationDown'},
            {buttonClass: 'ion-plus-circled', groupClass: 'SleepingArea', name: 'sleepingUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'SleepingArea', name: 'sleepingDown'},
            {buttonClass: 'button', groupClass: 'bar-header', name: 'backButton', text: 'Back'}
        ]
            ,widgets: [
            {name: 'bollix', text: 'Bollix'},
            {name: 'antiRadar', text: 'Anti-Radar Netting'},
            {name: 'iff', text: 'Identify Friend or Foe'},
            {name: 'infrared', text: 'Infrared Sighting System'},
            {name: 'ldRadio', text: 'Long-Distance Radio'},
            {name: 'earthStation', text: 'Portable Earth Station'},
            {name: 'radar', text: 'Radar'},
            {name: 'lrRadar', text: 'Long-Range Radar'},
            {name: 'detector', text: 'Radar Detector'},
            {name: 'jammer', text: 'Radar Jammer'},
            {name: 'searchlight', text: 'Searchlight'},
            {name: 'armoredSearchlight', text: 'Armored Searchlight'},
            {name: 'soundEnhancement', text: 'Sound Enhancement'},
            {name: 'soundSystem', text: 'Sound System'},
            {name: 'computerGunner', text: 'Computer Gunner'},
            {name: 'gunnerSoftware', text: 'Comp. Gunner Software'},
            {name: 'fireExtinguisher', text: 'Fire Extinguisher'},
            {name: 'ife', text: 'Improved Fire Ext.'},
            {name: 'autopilot', text: 'Autopilot'},
            {name: 'pilotSoftware', text: 'Autopilot Software'},
            {name: 'pilotGunner', text: 'Autopilot Gunner Link'},
            {name: 'tv', text: 'Compact TV'},
            {name: 'navigator', text: 'Computer Navigator'},
            {name: 'solar', text: 'Solar Panel'},
            {name: 'surge', text: 'Surge Protector'},
            {name: 'computer', text: 'Vehicular Computer'},
            {name: 'antiTheft', text: 'Anti-Theft System'},
            {name: 'safe', text: 'Cargo Safe'},
            {name: 'refrigerator', text: 'C.Safe Refrigerator'},
            {name: 'rebreather', text: 'C.Safe Rebreather'},
            {name: 'selfDestruct', text: 'C.Safe Self-Destruct'},
            {name: 'erisReceiver', text: 'ERIS Receiver'},
            {name: 'smallMini', text: 'Mini-Safe (Small)'},
            {name: 'largeMini', text: 'Mini-Safe (Large)'},
            {name: 'nbc', text: 'N/B/C Shielding'},
            {name: 'rcReceiver', text: 'RC Guidance Receiver'},
            {name: 'beerFridge', text: 'Armored Beer Fridge'},
            {name: 'miniFridge', text: 'Armored Minifridge'},
            {name: 'camouflage', text: 'Camouflage Netting'},
            {name: 'ctc2', text: '2-Space Car Top Carrier'},
            {name: 'ctc4', text: '4-Space Car Top Carrier'},
            {name: 'ctc6', text: '6-Space Car Top Carrier'},
            {name: 'fakeCTC', text: 'Fake C/T Carrier w/E.B.'},
            {name: 'galley', text: 'Galley'},
            {name: 'portableShop', text: 'Portable Shop (4 cases)'},
            {name: 'towBar', text: 'Tow Bar'},
            {name: 'winch', text: 'Winch'},
            {name: 'hitches', text: 'Hitches'}
        ]
        },
        {
            name: 'GearCategoriesPage',
            url: '/gearTypes'
            ,widgets: [
            {name: 'combatButton', text: 'Combat & Weapons'},
            {name: 'sensorsButton', text: 'Sensors & Comm'},
            {name: 'electronicsButton', text: 'Electronics'},
            {name: 'securityButton', text: 'Security'},
            {name: 'recreationalButton', text: 'Recreational'},
            {name: 'towingButton', text: 'Towing & Salvage'},
            {name: 'cargoButton', text: 'Cargo Allocation'},
            {name: 'boostersButton', text: 'Boosters & Jump Jets'}
        ]
        },
        {
            name: 'LinksPage',
            url: '/linkList'
            ,buttons: [
            {buttonClass: 'button', groupClass: 'bar-header', name: 'backButton', text: 'Back'}
        ]
            ,widgets: [
            {name: 'addLink', text: 'Add New Link'}
        ]
        },
        {
            name: 'LinkPage',
            url: '/link'
            ,buttons: [
            {buttonClass: 'button', groupClass: 'bar-header', name: 'backButton', text: 'Back'}
        ]
            ,widgets: [
            {name: 'removeButton', text: 'Remove Link'}
        ]
        },
        {
            name: 'BoosterPage',
            url: '/booster'
            ,buttons: [
            {buttonClass: 'ion-plus-circled', groupClass: 'Thrust', name: 'thrustUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'Thrust', name: 'thrustDown'}
        ]
            ,widgets: [
            {name: 'booster', text: 'Rocket Booster'},
            {name: 'jets', text: 'Jump Jets'},
            {name: 'rear', text: 'Rear-facing'},
            {name: 'front', text: 'Front-facing'},
            {name: 'bottom', text: 'Bottom-facing'},
            {name: 'top', text: 'Top-facing'}
        ]
        },
        {
            name: 'HitchPage',
            url: '/hitch'
            ,buttons: [
            {buttonClass: 'ion-plus-circled', groupClass: 'Armor', name: 'armorUp'},
            {buttonClass: 'ion-minus-circled', groupClass: 'Armor', name: 'armorDown'}
        ]
            ,widgets: [
            {name: 'explosive', text: 'Explosive Hitch'},
            {name: 'quickRelease', text: 'Quick-Release Hitch'},
            {name: 'noHitch', text: 'No hitch'},
            {name: 'lightHitch', text: 'Light Hitch (2,000 lbs. tow)'},
            {name: 'standardHitch', text: 'Standard Hitch (6,000 lbs. tow)'},
            {name: 'heavyHitch', text: 'Heavy Hitch (12,000 lbs. tow)'},
            {name: 'extraHeavyHitch', text: 'Extra-Heavy Hitch (20,000 lbs. tow)'}
        ]
        },
        {
            name: 'DesignPage',
            url: '/design'
            ,widgets: [
            {name: 'equipmentWeight', text: 'Weight for Personal Equipment'},
            {name: 'cwc', text: 'CWC Technology'},
            {name: 'uacfh', text: 'UACFH+Pyramid Technology'},
            {name: 'military', text: 'Military Technology'},
            {name: 'saveButton', text: 'Save Design'},
            {name: 'shareDesign', text: 'Share Design'},
            {name: 'addToList', text: 'Add to List'},
            {name: 'pdf', text: 'Download PDF'}
        ]
            ,fields: [
            {name: 'designName', attr: 'placeholder', value: 'Design Name'},
            {name: 'color', attr: 'ng-model', value: 'color'}
        ]
        },
        {
            name: 'SavePage',
            url: '/save'
            ,widgets: [
            {name: 'stockCar', text: 'Submit as Stock Car'},
            {name: 'stockPrepare', text: 'Prepare Stock Car'},
            {name: 'save', text: 'Save Design'}
        ]
        },
        {
            name: 'StockPage',
            url: '/saveStock'
            ,buttons: [
            {buttonClass: 'button', groupClass: 'col', name: 'gas', text: 'Gas'},
            {buttonClass: 'button', groupClass: 'col', name: 'electric', text: 'Electric'},
            {buttonClass: 'button', groupClass: 'col', name: 'antiPed', text: 'Anti-Ped'},
            {buttonClass: 'button', groupClass: 'col', name: 'tireShot', text: 'Tire Shot'},
            {buttonClass: 'button', groupClass: 'col', name: 'incendiary', text: 'Incendiary'},
            {buttonClass: 'button', groupClass: 'col', name: 'rammer', text: 'Rammer'},
            {buttonClass: 'button', groupClass: 'col', name: 'racer', text: 'Racer'},
            {buttonClass: 'button', groupClass: 'col', name: 'sporty', text: 'Sporty'},
            {buttonClass: 'button', groupClass: 'col', name: 'offRoad', text: 'Off-Road'},
            {buttonClass: 'button', groupClass: 'col', name: 'everyday', text: 'Everyday'},
            {buttonClass: 'button', groupClass: 'col', name: 'police', text: 'Police'},
            {buttonClass: 'button', groupClass: 'col', name: 'emergency', text: 'Emergency'},
            {buttonClass: 'button', groupClass: 'col', name: 'bandit', text: 'Bandit'},
            {buttonClass: 'button', groupClass: 'col', name: 'commercial', text: 'Commercial'},
            {buttonClass: 'button', groupClass: 'col', name: 'courier', text: 'Courier'},
            {buttonClass: 'button', groupClass: 'col', name: 'convoy', text: 'Convoy'},
            {buttonClass: 'button', groupClass: 'col', name: 'frontMan', text: 'Front Man'},
            {buttonClass: 'button', groupClass: 'col', name: 'tailEnd', text: 'Tail-End'},
            {buttonClass: 'button', groupClass: 'col', name: 'cargo', text: 'Cargo'},
            {buttonClass: 'button', groupClass: 'col', name: 'passenger', text: 'Passenger'},
            {buttonClass: 'button', groupClass: 'col', name: 'executive', text: 'Executive'}
        ]
            ,widgets: [
            {name: 'arena', text: 'Arena Design'},
            {name: 'finishTagging', text: 'Done tagging'},
            {name: 'save', text: 'Save Design'}
        ]
        },
        {
            name: 'ConfirmSavePage',
            url: '/confirmSave'
        },
        {
            name: 'StockListPage',
            url: '/stock'
            ,buttons: [
            {buttonClass: 'button', groupClass: 'col', name: 'car', text: 'Car'},
            {buttonClass: 'button', groupClass: 'col', name: 'carTrailer', text: 'Car Trailer'},
            {buttonClass: 'button', groupClass: 'col', name: 'cycle', text: 'Cycle'},
            {buttonClass: 'button', groupClass: 'col', name: 'trike', text: 'Trike'},
            {buttonClass: 'button', groupClass: 'col', name: 'tenWheeler', text: 'Ten Wheeler'},
            {buttonClass: 'button', groupClass: 'col', name: 'bus', text: 'Bus'},
            {buttonClass: 'button', groupClass: 'col', name: 'tractor', text: 'Tractor'},
            {buttonClass: 'button', groupClass: 'col', name: 'trailer', text: 'Trailer'},
            {buttonClass: 'button', groupClass: 'col', name: 'div5', text: 'Div 5'},
            {buttonClass: 'button', groupClass: 'col', name: 'div10', text: 'Div 10'},
            {buttonClass: 'button', groupClass: 'col', name: 'div15', text: 'Div 15'},
            {buttonClass: 'button', groupClass: 'col', name: 'div20', text: 'Div 20'},
            {buttonClass: 'button', groupClass: 'col', name: 'div25', text: 'Div 25'},
            {buttonClass: 'button', groupClass: 'col', name: 'div30', text: 'Div 30'},
            {buttonClass: 'button', groupClass: 'col', name: 'div40', text: 'Div 40'},
            {buttonClass: 'button', groupClass: 'col', name: 'div60', text: 'Div 60'},
            {buttonClass: 'button', groupClass: 'col', name: 'div100', text: 'Div 100'},
            {buttonClass: 'button', groupClass: 'col', name: 'gas', text: 'Gas'},
            {buttonClass: 'button', groupClass: 'col', name: 'electric', text: 'Electric'},
            {buttonClass: 'button', groupClass: 'col', name: 'antiPed', text: 'Anti-Ped'},
            {buttonClass: 'button', groupClass: 'col', name: 'tireShot', text: 'Tire Shot'},
            {buttonClass: 'button', groupClass: 'col', name: 'incendiary', text: 'Incendiary'},
            {buttonClass: 'button', groupClass: 'col', name: 'rammer', text: 'Rammer'},
            {buttonClass: 'button', groupClass: 'col', name: 'racer', text: 'Racer'},
            {buttonClass: 'button', groupClass: 'col', name: 'sporty', text: 'Sporty'},
            {buttonClass: 'button', groupClass: 'col', name: 'offRoad', text: 'Off-Road'},
            {buttonClass: 'button', groupClass: 'col', name: 'everyday', text: 'Everyday'},
            {buttonClass: 'button', groupClass: 'col', name: 'police', text: 'Police'},
            {buttonClass: 'button', groupClass: 'col', name: 'emergency', text: 'Emergency'},
            {buttonClass: 'button', groupClass: 'col', name: 'bandit', text: 'Bandit'},
            {buttonClass: 'button', groupClass: 'col', name: 'commercial', text: 'Commercial'},
            {buttonClass: 'button', groupClass: 'col', name: 'courier', text: 'Courier'},
            {buttonClass: 'button', groupClass: 'col', name: 'convoy', text: 'Convoy'},
            {buttonClass: 'button', groupClass: 'col', name: 'frontMan', text: 'Front Man'},
            {buttonClass: 'button', groupClass: 'col', name: 'tailEnd', text: 'Tail-End'},
            {buttonClass: 'button', groupClass: 'col', name: 'cargo', text: 'Cargo'},
            {buttonClass: 'button', groupClass: 'col', name: 'passenger', text: 'Passenger'},
            {buttonClass: 'button', groupClass: 'col', name: 'executive', text: 'Executive'},
            {buttonClass: 'button', groupClass: 'col', name: 'ge', text: 'GE'},
            {buttonClass: 'button', groupClass: 'col', name: 'weight', text: 'Weight'},
            {buttonClass: 'button', groupClass: 'col', name: 'any', text: 'Any'}
        ]
            ,widgets: [
            {name: 'bodyHeader', text: 'a.item").has("b", text:"Body:"'},
            {name: 'arenaHeader', text: 'a.item").has("b", text:"Arena Designs:"'},
            {name: 'tagsHeader', text: 'a.item").has("b", text:"Tags:"'},
            {name: 'encumbranceHeader', text: 'a.item").has("b", text:"Encumbrance:"'},
            {name: 'closeButton', text: 'Return to Current Design'}
        ]
        },
        {
            name: 'StockCarPage',
            url: '/FIXME'
        },
        {
            name: 'StockAdminListPage',
            url: '/FIXME'
        },
        {
            name: 'StockAdminCarPage',
            url: '/FIXME'
        },
        {
            name: 'TagsPage',
            url: '/FIXME'
        },
        {
            name: 'MainMenu',
            url: '/mainMenu'
            ,widgets: [
            {name: 'newDesign', text: 'Create a New Design'},
            {name: 'logout', text: 'Log Out'}
        ]
        },
        {
            name: 'NameSearchPage',
            url: '/searchByName'
            ,widgets: [
            {name: 'search', text: 'Search'}
        ]
            ,fields: [
            {name: 'email', attr: 'ng-model', value: 'name'}
        ]
        },
        {
            name: 'LoginPage',
            url: '/login'
            ,widgets: [
            {name: 'login', text: 'Log In'}
        ]
            ,fields: [
            {name: 'email', attr: 'ng-model', value: 'email'}
        ]
        },
        {
            name: 'DesignListDialog',
            url: '/designList'
        },
        {
            name: 'TourDialog',
            url: '/FIXME'
        },
        {
            name: 'DischargerDialog',
            url: '/dischargers'
            ,widgets: [
            {name: 'closeButton', text: 'Done'}
        ]
        },
        {
            name: 'StockCarDialog',
            url: '/FIXME'
        }
    ];
    page = pages[0];
})();