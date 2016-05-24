/* global angular, CW */
angular.module('carwars').
    factory('model', function(vehicle, $rootScope) {
        "use strict";
        var mode = '2d';
        var model = null;
        return {
            // Engine Selector Fields
            engineSelected: false,
            engineAccel: 5,
            engineSpeed: 60,
            engineRange: 150,
            engineGas: vehicle.car ? !vehicle.techLevelIsClassic() : true,
            engineElectric: true,
            // Current X fields for other screens
            currentTurret: null,
            currentCrew: null,
            currentWeapon: {
                location: null,
                sidecar: false,
                carrier: false,
                weapon: null,
                isCorner: function() {
                    return CW.isCorner(this.location);
                },
                isTurret: function() {
                    return /[Tt]urret/.test(this.location);
                },
                clear: function() {
                    this.location = null;
                    this.sidecar = false;
                    this.carrier = false;
                    this.weapon = null;
                }
            },
            currentAmmoModifier: null,
            currentAmmoModifierName: null,
            currentWeaponCategory: null,
            currentGearCategory: null,
            currentLinkIsSmart: false,
            currentLink: null,
            currentHandWeapon: null,
            boosterCalculation: "Maximum",
            armorAlternate: false,
            gearInCarrier: false,
            stockConfig: {
                authorName: null,
                authorEmail: null,
                arena: null,
                tags: [],
                designerNotes: '',
                designerSignature: null,
                clear: function() {
                    this.authorEmail = null;
                    this.authorName = null;
                    this.arena = null;
                    this.tags = [];
                    this.designerNotes = '';
                    this.designerSignature = null;
                }
            },
            openedFromToolbar: false,
            currentArmor: null,
            currentArmorItemName: null,
            currentArmorSource: null,
            shareDesignID: null,
            shareDesignText: null,
            loginToScreen: null,

            reset: function() {
                this.engineSelected = false;
                this.engineAccel = 5;
                this.engineSpeed = 60;
                this.engineRange = 150;
                this.engineGas = !vehicle.techLevelIsClassic();
                this.engineElectric = true;
                this.currentTurret = null;
                this.currentCrew = null;
                this.currentWeapon.clear();
                this.currentWeaponCategory = null;
                this.currentGearCategory = null;
                this.currentLinkIsSmart = false;
                this.currentLink = null;
                this.currentHandWeapon = null;
                this.boosterCalculation = "Maximum";
                this.armorAlternate = false;
                this.gearInCarrier = false;
                this.currentAmmoModifier = null;
                this.currentAmmoModifierName = null;
                this.stockConfig.clear();
                this.openedFromToolbar = false;
                this.currentArmor = null;
                this.currentArmorItemName = null;
                this.currentArmorSource = null;
                this.shareDesignID = null;
                this.shareDesignText = null;
                this.loginToScreen = null;
            },

            // Diagram Stuff
            setModel: function(type, useModel) {
                if(model && model !== useModel) model.destroy();
                mode = type;
                model = useModel;
            },
            layout: function() {
                model.layout();
            },
            redraw: function() {
                $rootScope.$broadcast('redraw');
            },
            syncBody: function() {
                model.syncGuardsAndHubs();
                if(vehicle.isBus())
                    model.setOversize();
                else if(vehicle.isCarTrailer()) {
                    model.setOversize();
                    model.syncTireCount();
                }
                this.syncMiddleTires();
                model.bodyChanged();
            },
            syncMiddleTires: function() {
                if(vehicle.isCar()) {
                    model.syncMiddleTires();
                    model.redraw();
                }
            },
            syncTireCount: function() {
                if(vehicle.isCarTrailer() || vehicle.isSemiTrailer()) {
                    model.syncTireCount();
                    model.redraw();
                }
            },
            syncCycle: function() {
                if(vehicle.isCycle()) {
                    model.syncWindshell(vehicle.car.windshell);
                    model.syncSidecar(vehicle.car.sidecar);
                    model.redraw();
                }
            },
            updateEngine: function() {
                // TODO: change gas/electric appearance?
                if(model) {
                    model.updateEngineText();
                    model.syncGasTank();
                    model.redraw();
                }
            },
            checkForNewEngine: function(forcedElectric) {
                if(!this.engineSelected) {
                    if(vehicle.updateEngine(this.engineAccel, this.engineSpeed, this.engineRange, forcedElectric))
                        this.updateEngine();
                }
            },
            addGunner: function(gunner) {
                if(gunner) {
                    model.addCrew(gunner);
                    model.redraw();
                }
            },
            removeGunner: function(gunner) {
                model.removeCrew(gunner);
                model.syncCrewCompartmentCA();
                model.redraw();
            },
            addPassenger: function(passenger) {
                if(passenger) {
                    model.addPassenger(passenger);
                    model.redraw();
                }
            },
            removePassenger: function(passenger) {
                if(passenger) {
                    model.removePassenger(passenger);
                    model.redraw();
                }
            },
            syncCrewCompartmentCA: function() {
                return model.syncCrewCompartmentCA();
            },
            addWeapon: function(currentWeapon) {
                if(currentWeapon) {
                    model.addWeapon(currentWeapon.weapon, currentWeapon.location, currentWeapon.sidecar, currentWeapon.carrier);
                    model.redraw();
                }
            },
            removeWeapon: function(currentWeapon) {
                if(currentWeapon) {
                    model.removeWeapon(currentWeapon.weapon, currentWeapon.location, currentWeapon.sidecar, currentWeapon.carrier);
                    model.redraw();
                }
            },
            increaseWeaponCount: function(currentWeapon) {
                if(currentWeapon) {
                    model.increaseWeaponCount(currentWeapon.weapon, currentWeapon.location, currentWeapon.sidecar, currentWeapon.carrier);
                    model.redraw();
                }
            },
            decreaseWeaponCount: function(currentWeapon) {
                if(currentWeapon) {
                    model.decreaseWeaponCount(currentWeapon.weapon, currentWeapon.location, currentWeapon.sidecar, currentWeapon.carrier);
                    model.redraw();
                }
            },
            addAccessory: function(item, carrier, sidecar) {
                if(item && item.totalDP() > 0) {
                    model.addAccessory(item, carrier, sidecar);
                    model.redraw();
                }
            },
            removeAccessory: function(item, carrier, sidecar) {
                if(item) {
                    model.removeAccessory(item, carrier, sidecar);
                    model.redraw();
                }
            },
            addSpareTire: function(tire, carrier, sidecar) {
                if(tire) {
                    model.addAccessory(tire, carrier, sidecar);
                    model.redraw();
                }
            },
            removeSpareTire: function(tire, carrier, sidecar) {
                if(tire) {
                    model.removeAccessory(tire, carrier, sidecar);
                    model.redraw();
                }
            },
            addModification: function(name) {
                if(name === 'spoiler') model.addSpoiler();
                else if(name === 'airdam') model.addAirdam();
                else if(name === 'hitch') model.addHitch();
                model.layout();
            },
            removeModification: function(name) {
                if(name === 'spoiler') model.removeSpoiler();
                else if(name === 'airdam') model.removeAirdam();
                else if(name === 'hitch') model.removeHitch();
                model.layout();
            },
            syncGuardsAndHubs: function() {
                model.syncGuardsAndHubs();
                model.redraw();
            },
            addTopTurret: function(turret) {
                if(turret) {
                    model.addTopTurret(turret, turret !== vehicle.car.topTurret && turret !== vehicle.car.topBackTurret,
                            turret === vehicle.car.topBackTurret);
                    model.redraw();
                }
                return turret;
            },
            addSideTurret: function(turret) {
                if(turret) {
                    model.addSideTurret(turret, turret !== vehicle.car.sideTurret && turret !== vehicle.car.sideBackTurret,
                            turret === vehicle.car.sideBackTurret);
                    model.redraw();
                }
                return turret;
            },
            removeTurret: function(turret) {
                if(turret) {
                    model.removeTurret(turret);
                    model.redraw();
                }
            },
            setColor: function() {
                model.setColor(vehicle.car.appearance.colorScheme.mainColor);
                model.redraw();
            },
            syncBoosters: function() {
                model.syncBoosters();
                model.redraw();
            }
        };
    });