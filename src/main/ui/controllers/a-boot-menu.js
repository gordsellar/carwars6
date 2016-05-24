/* global angular, CW, CWD */
(function() {
    "use strict";
    var deps = ['ngRoute', 'cwCommon'];
    var isTouch = "ontouchstart" in window;
    if(isTouch) deps.push('ngTouch');
    var app = angular.module('carwars', deps);
    app.config(function($controllerProvider) {
        app.controllerProvider = $controllerProvider;
    }).
        controller('CarWarsCtrl', function ($scope, $window, $document, $location, $rootScope, $route, $timeout,
                                            vehicle, model, server, statusConfig, stockList) {
            $rootScope.started = false;
            $rootScope.openScreen = function (url) {
                $timeout(function () {
                    if ($location.path() === '/' + url) $route.reload();
                    else $location.path(url);
                });
            };

            $scope.toolbarOffset = 0;
            $scope.popupVisible = false;
            $scope.hoverOffset = '70px';
            $scope.show3D = false;
            $scope.show2D = false;
            $scope.electric = true;
            $scope.engine = true;
            $scope.turretDisabled = false;
            $scope.legal = true;
            $scope.errorMessages = [];
            $scope.infoMessages = [];
            $scope.preload = CW.preload.present();
            $scope.loadingMessage = null;
            $scope.lastSavedID = null;
            $scope.tourRunning = false;
            $scope.touchEnabled = isTouch;
            var lastWarnings = [];
            var warn3d = false;

            var attempt3D = function () {
                $scope.show3D = CWD.webgl.enabled && vehicle.car && vehicle.isCar();
            };
            attempt3D();
            // Configure resize behavior ---------------------------------
            $scope.layoutWindow = function (width, height) {
                width = width || $window.innerWidth;
                height = height || $window.innerHeight;
//                alert("Window: "+window.innerWidth+","+window.innerHeight+" Screen "+screen.width+","+screen.height+
//                    "\nUsing: "+width+","+height);
                $scope.mainDimensions = {
                    height: Math.min(731, height - 20),
                    width: width - 324
                };
                $rootScope.$broadcast('resize', true);
            };
            if (!isTouch) {
                angular.element($window).on('resize', function () {
                    $scope.$apply(function () {
                        $scope.layoutWindow();
                    });
                });
                $scope.layoutWindow();
            }
            $scope.$on('moveToolbar', function (event, offset) {
                $scope.toolbarOffset = offset + "px";
                $scope.popupOffset = (offset + 47) + "px";
                $scope.hoverOffset = (offset + 70) + "px";
            });
            // Functions for sub-scopes to call ---------------------------------
            $scope.checkLogin = function () {
                $scope.loggedIn = !!server.currentUser();
            };
            $scope.checkLogin();
            $scope.logout = function (callback) {
                server.logout(function () {
                    $scope.checkLogin();
                    stockList.clear();
                    if (callback) callback();
                }, function () {
                    $scope.checkLogin();
                    if (callback) callback();
                    $scope.alert("Log out failed.");
                });
            };
            $scope.createAccount = function () {
                startApplication();
                $scope.openScreen('createAccount');
            };

            $scope.setDesignName = function (text) {
                $scope.hoverName = text === "Unnamed Design" ? text : '"' + text + '"';
                $scope.clearLastSavedID();
            };
            $scope.setTechLevel = function (tech) {
                if($scope.techLevel === 'Classic' && tech !== 'Classic') model.engineGas = true;
                else if($scope.techLevel !== 'Classic' && tech === 'Classic') {
                    model.engineGas = false;
                    vehicle.car.personalEquipmentWeight = false;
                }
                $scope.techLevel = tech;
                $scope.classicTech = tech === 'Classic';
                $scope.cwcClassicTech = tech === 'Classic' || tech === 'CWC';
                model.checkForNewEngine(tech === 'Classic' ? true : undefined);
            };
            $scope.showMinimumTechLevel = function() {
                $scope.setHoverText((vehicle.isCar() && !vehicle.isRaceCar()) || vehicle.isCycle() || vehicle.isTrike() ? 'Change to Classic Tech' : 'Change to CWC Tech');
            };
            $scope.setHoverText = function (text) {
                if (text) {
                    if ($scope.errorMessages.length > 0 && /^Change to.* Tech$/.test(text)) return;
                    $scope.clearMessages(true);
                    $scope.popupVisible = false;
                }
                $scope.hoverText = text;
            };
            $scope.toolbarHover = function (text) {
                if (text) $scope.clearMessages(true);
                if (!$scope.popupVisible) $scope.hoverText = text;
            };
            $scope.clearMessages = function (bothTypes) {
                if (bothTypes) $scope.errorMessages = [];
                $scope.infoMessages = [];
            };
            $scope.showMessage = function (message) {
                if ($scope.infoMessages.indexOf(message) < 0) {
                    $scope.infoMessages.push(message);
                    $scope.hoverText = '';
                    $scope.popupVisible = false;
                }
            };
            $scope.showWarning = function (message) {
                //            console.log("WARN: "+message);
                if ($scope.errorMessages.indexOf(message) < 0) {
                    if ($scope.errorMessages.length === 0) lastWarnings = [];
                    $scope.errorMessages.push(message);
                    lastWarnings.push(message);
                    $scope.hoverText = '';
                    $scope.popupVisible = false;
                }
            };
            $scope.configurePopup = function (align, buttons) {
                $scope.showInToolbar(this, align, buttons);
                $scope.popupVisible = true;
                $scope.hoverText = '';
            };
            $scope.hidePopup = function () {
                $scope.popupVisible = false;
            };
            $scope.revealWarnings = function () {
                $scope.errorMessages = lastWarnings;
            };
            $scope.$on('message', function (event, message) {
                $scope.showMessage(message);
            });
            $scope.$on('warning', function (event, message) {
                $scope.showWarning(message);
            });
            $scope.$on('recalculate', function (event, car) {
                $scope.checkEngine = vehicle.checkEngine();
                $scope.sidecar = vehicle.isCycle() && car.sidecar;
                $scope.sidecarWeight = car.sidecar ? car.sidecar.totalWeight() + "/" + car.sidecar.maxWeight : 0;
                $scope.sidecarOverweight = car.sidecar && car.sidecar.totalWeight() > car.sidecar.maxWeight ? statusConfig.badColor : statusConfig.goodColor;
                $scope.sidecarSpace = car.sidecar ? Math.ceil(car.sidecar.spaceUsed() - 0.0001) + "/" + car.sidecar.spaceAvailable() : 0;
                $scope.sidecarOverspace = car.sidecar && car.sidecar.spaceUsed() > car.sidecar.spaceAvailable() ? statusConfig.badColor : statusConfig.goodColor;
                $scope.engine = !!car.engine;
                $scope.turretDisabled = (vehicle.isCarTrailer() || vehicle.isSemiTrailer()) && car.isFlatbed() && !vehicle.hasTurret();
            });
            $scope.$on('validate-car', function (event, messages) {
                $scope.clearMessages(true);
                for (var i = 0; i < messages.length; i++)
                    $scope.showWarning(messages[i]);
                $scope.legal = messages.length === 0;
            });
            $scope.$on('change-engine', function (event, isElectric) {
                $scope.electric = isElectric;
            });
            $scope.showLoadingMessage = function (message) {
                $scope.loadingMessage = message;
            };
            $scope.hideLoadingMessage = function () {
                $scope.loadingMessage = null;
            };
            $scope.notYetImplemented = function () {
                $scope.alert("Sorry, you can't do that yet.");
            };
            $scope.clearLastSavedID = function () {
                $scope.lastSavedID = null;
            };
            $scope.setLastSavedID = function (id) {
                $scope.lastSavedID = id;
            };
            // Functions for widgets and dialogs to call ---------------------------------
            $scope.startTour = function () {
                startApplication();
                if (!vehicle.car) {
                    $scope.createCar();
                    $timeout($scope.initializeTour);
                } else
                    $scope.initializeTour();
            };
            $scope.reviewStock = function() {
                startApplication();
                $scope.openScreen('adminReview');
            };
            $scope.showMainMenu = function () {
                $scope.processClick('mainMenu');
            };
            $scope.createNewDesign = function () {
                startApplication();
                $scope.mainDisplay = 'selector';
                $scope.openScreen("overview");
            };
            $scope.listDesigns = function () {
                startApplication();
                if ($scope.loggedIn)
                    $scope.openScreen('designList');
                else {
                    model.loginToScreen = 'designList';
                    $scope.openScreen('login');
                }
            };
            $scope.searchDesigns = function () {
                startApplication();
                $scope.mainDisplay = 'stockList';
                stockList.setNameSearch(true);
                $scope.openScreen('stock');
            };
            $scope.browseStock = function () {
                startApplication();
                $scope.mainDisplay = 'stockList';
                stockList.setNameSearch(false);
                $scope.openScreen('stock');
            };
            $scope.alert = function(message) {
                $timeout(function() {$window.alert(message);});
            };
            $scope.confirm = function(message, onConfirm) {
                $timeout(function() {
                    if($window.confirm(message)) onConfirm();
                });
            };
            $scope.prompt = function(message, onConfirm) {
                $timeout(function() {
                    var value = $window.prompt(message);
                    if(value) onConfirm(value);
                });
            };
            $scope.setDisplay = function (type, nowarn) {
                if (type === '3D') {
                    $scope.show3D = false;
                    $scope.show2D = true;
                    $scope.mainDisplay = '3d';
                    if(!warn3d && !nowarn) {
                        warn3d = true;
                        $scope.alert("Just as an FYI, the 3D view is still a\nwork in progress.  Some weapons\nand equipment do not yet appear.");
                    }
                } else if (type === 'STL') {
                    $scope.show3D = false;
                    $scope.show2D = false;
                    $scope.mainDisplay = 'stl';
                } else if (type === 'StockList') {
                    $scope.show3D = false;
                    $scope.show2D = false;
                    $scope.mainDisplay = 'stockList';
                } else {
                    $scope.show2D = false;
                    attempt3D();
                    $scope.mainDisplay = '2d';
                }
                $scope.hoverText = '';
            };
            $scope.mouseNotify = function (event) {
                $rootScope.$broadcast(event);
            };
            // Click Handler ---------------------------------
            $scope.processClick = function (address, item, fromToolbar) {
                var temp;
                $scope.popupVisible = false;
                model.openedFromToolbar = !!fromToolbar;
                switch (address) {
                    case "overview":
                    case "turretList":
                    case "crewList":
                    case "tireList":
                    case "performanceMods":
                    case "armor":
                    case "ammo":
                    case "bodyMods":
                    case "gearTypes":
                    case "gearList":
                    case "linkList":
                    case "link":
                    case "design":
                    case "hitch":
                    case "dischargers":
                    case "mainMenu":
                    case "crewGear":
                    case "handWeaponList":
                    case "handWeaponCategories":
                    case "handWeapon":
                    case "weaponLocations":
                    case "createAccount":
                    case "confirmAccount":
                        $scope.openScreen(address);
                        break;
                    case "editBody":
                        $scope.openScreen("body");
                        break;
                    case "editArmor":
                        $scope.openScreen("armor");
                        break;
                    case "editCarrierArmor":
                    case "editSidecarArmor":
                        model.armorAlternate = true;
                        $scope.openScreen("armor");
                        break;
                    case "editAllTires":
                        $scope.openScreen("tireList");
                        break;
                    case "engineList":
                    case "editEngineList":
                        $scope.openScreen(model.engineSelected ? "engine" : "engineList");
                        break;
                    case "editGasTank":
                        if (vehicle.gasTank())
                            $scope.openScreen("gasTank");
                        break;
                    case "editCrew":
                        model.currentCrew = item.crew instanceof Array ? item.crew[0] : item.crew;
                        $scope.openScreen("crew");
                        break;
                    case "editBackTopTurret":
                    case "editTopBackTurret":
                        model.currentTurret = vehicle.car.topBackTurret;
                        $scope.openScreen("turret");
                        break;
                    case "editTopTurret":
                        model.currentTurret = item && item.sidecar ? vehicle.car.sidecar.topTurret :
                                item && item.carrier ? vehicle.car.carrier.topTurret : vehicle.car.topTurret;
                        $scope.openScreen("turret");
                        break;
                    case "editLeftTurret":
                    case "editRightTurret":
                    case "editSideTurret":
                        model.currentTurret = item && item.carrier ? vehicle.car.carrier.sideTurret : vehicle.car.sideTurret;
                        $scope.openScreen("turret");
                        break;
                    case "editLeftBackTurret":
                    case "editRightBackTurret":
                    case "editSideBackTurret":
                    case "editBackSideTurret":
                        model.currentTurret = vehicle.car.sideBackTurret;
                        $scope.openScreen("turret");
                        break;
                    case "editCarrierTopTurret":
                        model.currentTurret = vehicle.car.carrier.topTurret;
                        $scope.openScreen("turret");
                        break;
                    case "editCarrierSideTurret":
                        model.currentTurret = vehicle.car.carrier.sideTurret;
                        $scope.openScreen("turret");
                        break;
                    case "editSidecarTurret":
                        model.currentTurret = vehicle.car.sidecar.topTurret;
                        $scope.openScreen("turret");
                        break;
                    case "editTurret":
                        if (item) model.currentTurret = item.turret;
                        $scope.openScreen("turret");
                        break;
                    case "editFrontTires":
                        if (item.tire) model.currentTire = item.tire;
                        else model.currentTire = vehicle.car.frontTires;
                        $scope.openScreen("tire");
                        break;
                    case "editBackTires":
                        if (item.tire) model.currentTire = item.tire;
                        else model.currentTire = vehicle.car.backTires;
                        $scope.openScreen("tire");
                        break;
                    case "editSidecarTires":
                        if (item.tire) model.currentTire = item.tire;
                        else model.currentTire = vehicle.car.sidecar.tires;
                        $scope.openScreen("tire");
                        break;
                    case 'editAddSpoiler':
                        if (!vehicle.car.spoiler) {
                            vehicle.car.spoiler = true;
                            vehicle.recalculate();
                            //                        CW.addInfoMessage("Added spoiler for $"+car.spoilerCost+", "+car.spoilerWeight+" lbs.");   TODO
                            model.addModification("spoiler");
                        }
                        $scope.openScreen("performanceMods");
                        break;
                    case 'editAddAirdam':
                        if (!vehicle.car.airdam) {
                            vehicle.car.airdam = true;
                            vehicle.recalculate();
                            //                        CW.addInfoMessage("Added airdam for $"+car.airdamCost+", "+car.airdamWeight+" lbs.");  TODO
                            model.addModification("airdam");
                        }
                        $scope.openScreen("performanceMods");
                        break;
                    case 'editAddHitch':
                        if (!vehicle.car.hitch) {
                            vehicle.setHitch('Light');
                            vehicle.recalculate();
                            model.addModification('hitch');
                        }
                        $scope.openScreen("hitch");
                        break;
                    case 'editAddRamplate':
                        if (!vehicle.car.ramplate && !vehicle.car.fakeRamplate) {
                            vehicle.car.ramplate = true;
                            if (vehicle.car.bumperSpikes) model.removeModification("bumperSpikes");
                            vehicle.car.bumperSpikes = false;
                            if (vehicle.car.bumperSpikes) model.removeModification("brushcutter");
                            vehicle.car.brushcutter = false;
                            if (vehicle.car.bumperSpikes) model.removeModification("ramplate");
                            vehicle.car.fakeRamplate = false;
                            vehicle.recalculate();
                            model.addModification("ramplate");
                        }
                        $scope.openScreen("bodyMods");
                        break;
                    case 'techLevelClassic':
                        temp = (vehicle.isCar() && !vehicle.isRaceCar()) || vehicle.isCycle() || vehicle.isTrike() ? 'Classic' : 'CWC';
                        vehicle.techLevel(temp);
                        $scope.setTechLevel(temp);
                        vehicle.recalculate();
                        break;
                    case 'techLevelCWC':
                        vehicle.techLevel('CWC');
                        $scope.setTechLevel('CWC');
                        vehicle.recalculate();
                        break;
                    case 'techLevelUACFH':
                        vehicle.techLevel('All');
                        $scope.setTechLevel('All');
                        vehicle.recalculate();
                        break;
                    case 'editBoosters':
                        model.currentTurret = null;
                        $scope.openScreen('booster');
                        break;
                    default:
                        if (/^edit.*Weapons$/.test(address)) {
                            var cur = model.currentWeapon;
                            cur.location = address.substring(4, address.length - 7);
                            if (/(left|right)(Back)?Turret/.test(cur.location)) cur.location = cur.location.replace(/left|right/, "side");
                            cur.sidecar = item && item.sidecar;
                            cur.carrier = item && item.carrier;
                            if (/^Sidecar/.test(cur.location)) {
                                cur.sidecar = true;
                                cur.location = cur.location.substr(7);
                            } else if (/^Carrier/.test(cur.location)) {
                                cur.carrier = true;
                                cur.location = cur.location.substr(7);
                            }
                            if (item && item.weapon) {
                                cur.weapon = item.weapon;
                                $scope.openScreen('weapon');
                            } else {
                                cur.weapon = null;
                                if (vehicle.weaponsInLocation(cur).length > 0 || vehicle.spacesForWeapon(cur) === 0)
                                    $scope.openScreen('weaponLocation');
                                else
                                    $scope.openScreen('weaponTypes');
                            }
                            break;
                        } else if (/^edit.+Boosters$/.test(address)) {
                            // item.booster holds the actual booster
                            temp = address.substring(4, address.length - 8);
                            if (/(left|right)(Back)?Turret/.test(temp)) temp = temp.replace(/left|right/, "side");
                            model.currentTurret = vehicle.car[temp];
                            $scope.openScreen('booster');
                            break;
                        } else if(/^editGear/.test(address)) {
                            model.currentGearCategory = address.substr(8);
                            $scope.openScreen("gearList");
                            break;
                        }
                        console.log("Clicked on " + address);
                        console.log("NAVIGATION NOT IMPLEMENTED FOR THIS");
                }
            };

            $scope.loadCar = function (name, id) {
                $scope.showLoadingMessage("Loading " + name + "...");
                server.loadDesign(id, function (data) {
                    $scope.hideLoadingMessage();
                    processDesignToLoad(data);
                }, function () {
                    $scope.hideLoadingMessage();
                    $timeout(function () {
                        alert("Unable to load design.  Please report this.");
                    });
                });
            };

            $scope.loadDesign = function(data) {
                processDesignToLoad(data);
            };

            var processDesignToLoad = function (data) {
                if (!data.type || data.type === 'Car') {
                    if (data.body.racingFrame)
                        $scope.createRaceCar(data);
                    else
                        $scope.createCar(data);
                } else if (data.type === 'Cycle')
                    $scope.createCycle(data);
                else if (data.type === 'Trike')
                    $scope.createTrike(data);
                else if (data.type === 'CarTrailer')
                    $scope.createCarTrailer(data);
                else if (data.type === 'TenWheeler')
                    $scope.createTenWheeler(data);
                else if (data.type === 'SemiTractor')
                    $scope.createSemiTractor(data);
                else if (data.type === 'SemiTrailer')
                    $scope.createSemiTrailer(data);
                else if (data.type === 'Bus')
                    $scope.createBus(data);
                else $scope.alert("Unable to load vehicle: unknown vehicle type '" + data.type + "'");
            };

            var prepareVehicle = function (setupFunction, optionalCarData) {
                if (vehicle.car) {
                    vehicle.car.onErrors = null;
                    vehicle.car.onRecalculate = null;
                }
                setupFunction();
                vehicle.car.onErrors = function (errors) {
                    $rootScope.$broadcast('validate-car', errors);
                };
                vehicle.car.onRecalculate = function () {
                    $rootScope.$broadcast('recalculate', vehicle.car);
                };
                if((!vehicle.isCar() && !vehicle.isCycle() && !vehicle.isTrike()) || vehicle.isRaceCar()) vehicle.techLevel('CWC');
                // If omitted, just use a default car
                if (optionalCarData) CW.importCar(vehicle.car, optionalCarData);
                else vehicle.recalculate();
                $scope.setDisplay('2D');

                $rootScope.$broadcast('new-vehicle', vehicle.car);
                model.reset();
                // NOTE: model2d is not yet up-to-date because setDisplay('2D') has not taken effect yet
                $scope.setDesignName(vehicle.car.designName);
                if (optionalCarData) { // Must set engine flag before changing tech level
                    model.engineSelected = true;
                    $scope.lastSavedID = optionalCarData.designId;
                }
                $scope.setTechLevel(vehicle.techLevel());
                $scope.openScreen("overview");
            };

            $scope.setCar = function (car) {
                prepareVehicle(function () {
                    vehicle.car = car;
                });
            };
            $scope.createCar = function (optionalCarData) {
                prepareVehicle(function () {
                    vehicle.createNewCar();
                }, optionalCarData);
            };

            $scope.createRaceCar = function (optionalCarData) {
                prepareVehicle(function () {
                    vehicle.createNewCar();
                    vehicle.car.engine = CW.createPowerPlant(CW.carPowerPlant.medium);
                    vehicle.car.body = CW.carBody.SPRINT;
                    vehicle.car.suspension = CW.carSuspension.light;
                }, optionalCarData);
            };

            $scope.createCycle = function (optionalCarData) {
                prepareVehicle(function () {
                    vehicle.createNewCycle();
                }, optionalCarData);
            };

            $scope.createTrike = function (optionalCarData) {
                prepareVehicle(function () {
                    vehicle.createNewTrike();
                }, optionalCarData);
            };

            $scope.createTenWheeler = function (optionalCarData) {
                prepareVehicle(function () {
                    vehicle.createNewTenWheeler();
                }, optionalCarData);
            };

            $scope.createCarTrailer = function (optionalCarData) {
                prepareVehicle(function () {
                    vehicle.createNewCarTrailer();
                }, optionalCarData);
            };

            $scope.createSemiTrailer = function (optionalCarData) {
                prepareVehicle(function () {
                    vehicle.createNewSemiTrailer();
                }, optionalCarData);
            };

            $scope.createSemiTractor = function (optionalCarData) {
                prepareVehicle(function () {
                    vehicle.createNewSemiTractor();
                }, optionalCarData);
            };

            $scope.createBus = function (optionalCarData) {
                prepareVehicle(function () {
                    vehicle.createNewBus();
                }, optionalCarData);
            };

            var startApplication = function () {
                if (!$rootScope.started) {
                    $window.onresize = null;
                    $rootScope.started = true;
                    angular.element($document[0].querySelector('#Loading')).remove();
                    if (isTouch) CWD.orientationChange();
                }
            };

            var executePreload = function (callback) {
                $timeout(function () { // Otherwise screen hasn't fully laid out yet
                    startApplication();
                    $timeout(callback); // Otherwise 2D canvas is not in place
                });
            };
            if ($scope.preload) { // Uses the value in the scope to suppress the initial menu
                var working;
                if (CW.preload.design) {
                    working = CW.preload.design;
                    delete CW.preload.design;
                    executePreload(function () {
                        processDesignToLoad(working);
                        delete $scope.preload;
                    });
                } else if (CW.preload.name) {
                    executePreload($scope.searchDesigns);
                } else if (CW.preload.tag || CW.preload.list) {
                    executePreload($scope.browseStock);
                } else if (CW.preload.confirm) {
                    executePreload(function () {
                        $scope.mainDisplay = 'selector';
                        $scope.openScreen('confirmAccount');
                    });
                }
            }
        });
})();
