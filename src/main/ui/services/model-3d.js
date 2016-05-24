/* global angular, CW, CWD, CW3D, THREE */

(function() {
    "use strict";
    CW.versionOf3D = "$Revision: 1118 $";

    angular.module('carwars').
        factory('model3d', function(vehicle, stl, $rootScope) {
            var car;
            var collection;
            return {
                scene: null,
                models: [],
                createNewCar: function(source) {
                    this.scene = new THREE.Scene();
                    var vehicle, stats;
                    if(source.body.name === CW.carBody.pickup.name || source.body.name === CW.carBody.camper.name) {
                        vehicle = CWD.webgl.cloneModel(CWD.webgl.pickup);
                        stats = CW3D.bodyStats.pickup;
                    } else {
                        vehicle = CWD.webgl.cloneModel(CWD.webgl.compact);
                        stats = CW3D.bodyStats.compact;
                    }
                    vehicle.name = "Body";
                    vehicle.userData.hoverText = "Body Basics";
                    vehicle.userData.hoverLink = "editBody";
                    CW3D.setBodyColor(vehicle,
                        source.appearance.colorScheme ? source.appearance.colorScheme.mainColor : 0xAA2222
                    );
//                CWD.webgl.resizeModel(vehicle, 10/vehicle.size.x);
                    CWD.webgl.moveModel(vehicle, {x:0, y:vehicle.userData.size.y/2, z:0});
                    collection = new THREE.Object3D();
                    this.scene.add(collection);
                    collection.add(vehicle);
                    this.models.splice(0, this.models.length);
                    car = CW3D.createVehicleShape(source, collection, stats, vehicle, this.models);
                    $rootScope.$broadcast('scene-changed', this.scene);
                },
                destroy: function() {
                    car = null;
                    this.models.splice(0, this.models.length);
                    for(var i=this.scene.children.length-1; i>=0; i--)
                        this.scene.remove(this.scene.children[i]);
                    this.scene = null;
                },
                generateSTL: function() {
                    stl.generateSTL(car);
                },
                layout: function() {
                    car.layout();
                    this.redraw();
                },
                redraw: function() {
                    $rootScope.$broadcast('redraw');
                },
                bodyChanged: function() {
                    this.createNewCar(vehicle.car);
                },
                syncMiddleTires: function() { // TODO on 3D model
                    if(vehicle.car.middleOrOuterTires === null && car.hasBackOuterTires())
                        car.removeBackOuterTires();
                    else if(vehicle.car.middleOrOuterTires !== null && !car.hasBackOuterTires())
                        car.addBackOuterTires(vehicle.car.middleOrOuterTires);
                },
                syncTireCount: function() { // Car trailers or semi trailers
                    if(vehicle.isCarTrailer() || vehicle.isSemiTrailer())
                        car.updateTires(); // TODO on 3D model
                },
                syncGasTank: function() {
                    if(vehicle.hasGasEngine()) // TODO on 3D model
                        car.addGasTank(vehicle.car.gasTank);
                    else
                        car.removeGasTank();
                    car.updateGasTank();
                },
                updateEngineText: function() { // hover text
                    CWD.setEngineHoverText(car.engine.userData, vehicle.car.engine);
                },
                addCrew: function(crew) {
                    car.addCrew(crew);
                },
                removeCrew: function(crew) {
                    car.removeCrew(crew);
                },
                addPassenger: function(passenger) {
                    car.addPassenger(passenger);
                },
                removePassenger: function(passenger) {
                    car.removePassenger(passenger);
                },
                setOversize: function() {
                    // TODO
                    alert("3D NOT IMPLEMENTED");
                },
                syncCrewCompartmentCA: function() {
                    // TODO: show this somehow?
                    return false;
                },
                addWeapon: function(weapon, location, sidecar, carrier) {
                    if(sidecar) {
                        // TODO: old app used location/array SidecarFront etc. on cycle for sidecar weapons -- ick
                    } else if(carrier) {
                        // TODO car.carrier.addWeapon(weapon, location);
                    } else {
                        car.addWeapon(weapon, location);
                    }
                },
                removeWeapon: function(weapon, location, sidecar, carrier) {
                    if(sidecar) {
                        // TODO: old app used location/array SidecarFront etc. on cycle for sidecar weapons -- ick
                    } else if(carrier) {
                        // TODO car.carrier.removeWeapon(weapon, location);
                    } else {
                        car.removeWeapon(weapon, location);
                    }
                },
                increaseWeaponCount: function(weapon, location, sidecar, carrier) {
                    if(sidecar) {
                        // TODO: old app used location/array SidecarFront etc. on cycle for sidecar weapons -- ick
                    } else if(carrier) {
                        // TODO car.carrier.increaseWeaponCount(weapon, location);
                    } else {
                        car.increaseWeaponCount(weapon, location);
                    }
                },
                decreaseWeaponCount: function(weapon, location, sidecar, carrier) {
                    if(sidecar) {
                        // TODO: old app used location/array SidecarFront etc. on cycle for sidecar weapons -- ick
                    } else if(carrier) {
                        // TODO: car.carrier.decreaseWeaponCount(weapon, location);
                    } else {
                        car.decreaseWeaponCount(weapon, location);
                    }
                },
                addAccessory: function(item) {
                    car.addAccessory(item);
                },
                removeAccessory: function(item) {
                    car.removeAccessory(item);
                },
                addSpoiler: function() {
                    car.addSpoiler();
                },
                removeSpoiler: function() {
                    car.removeSpoiler();
                },
                addAirdam: function() {
                    car.addAirdam();
                },
                removeAirdam: function() {
                    car.removeAirdam();
                },
                addHitch: function() {},// TODO
                removeHitch: function() {},// TODO
                syncGuardsAndHubs: function() {
                    if(vehicle.car.frontWheelguards === null && car.hasFrontWheelguards())
                        car.removeFrontWheelguards();
                    if(vehicle.car.frontWheelguards !== null && !car.hasFrontWheelguards())
                        car.addFrontWheelguards(vehicle.car.frontWheelguards);
                    if(vehicle.car.backWheelguards === null && car.hasBackWheelguards())
                        car.removeBackWheelguards();
                    if(vehicle.car.backWheelguards !== null && !car.hasBackWheelguards())
                        car.addBackWheelguards(vehicle.car.backWheelguards);
                    // TODO
                },
                addTopTurret: function(turret, carrier, back) {
//                if(carrier) TODO
//                else if(back) TODO
//                else
                    car.addTopTurret(turret);
                },
                addSideTurret: function(turret, carrier, back) {
                    // TODO add left and right turrets
                },
                removeTurret: function(turret) {
                    if(car.topTurret && turret === car.topTurret.userData.turret)
                        car.removeTopTurret(turret);
                },
                setColor: function(color) {
                    car.setColor(color);
                },
                syncBoosters: function() {}, // TODO
                syncWindshell: function(windshell) {}, // TODO
                syncSidecar: function(sidecar) {} // TODO
            };
        });
})();

