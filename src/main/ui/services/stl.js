/* global angular, CWD, saveAs, THREE */
angular.module('carwars').
    constant('STLWeaponSize', 1).
    factory('stl', function (vehicle, STLWeaponSize, $rootScope) {
        "use strict";
        var frontWeapons;
        var car, parent;
        return {
            frontWeaponsRaised: false,
            generateSTL: function (car3d) {
                car = car3d;
                var x, y, z, t, wpn;
                this.scene = new THREE.Scene();
                parent = new THREE.Object3D();
                this.scene.overrideMaterial = new THREE.MeshLambertMaterial({color: 0xAAAAAA});
                this.scene.add(parent);
                var setupTires = function (tires) {
                    var tire, i;
                    for (i = 0; i < tires.length; i++) {
                        tire = tires[i];
                        parent.add(tire);
                        CWD.webgl.resizeModel(tire, car.bodyStats.frontTires.diameter / tire.userData.size.y);
                        tire.rotation.set(-Math.PI / 2, 0, 0, "XYZ");
                        CWD.webgl.recalculateModel(tire);
                        var width = car.bodyStats.frontTires.diameter * 1.2;
                        CWD.webgl.moveModel(tire, {
                            x: 9,
                            y: tire.userData.size.y / 2,
                            z: ((tires.length - 1) / 2 - i) * width
                        });
                    }
                };
                var tires = [];
                for (t = 0; t < vehicle.tireCount(); t++) tires.push(CWD.webgl.cloneModel(CWD.webgl.wheelSTL));
                setupTires(tires);
                var body = CWD.webgl.cloneModel(car.body);
                parent.add(body);
                if (car.topTurret) { // TODO: not hardcoded statistics
                    // up: 0-0.55, side-to-side: +- 0.5, front: 0.57--1
                    var turret = CWD.webgl.cloneModel(car.topTurret);
                    parent.add(turret);
                    if (car.topTurretWeapons.length > 0) {
                        y = turret.userData.boundingBox.min.y + turret.userData.size.y * 0.3;
                        z = turret.userData.boundingBox.min.z + turret.userData.size.z * 0.75;
                        for (t = 0; t < car.topTurretWeapons.length; t++) {
                            x = turret.userData.boundingBox.min.x + turret.userData.size.x * (t + 1) / (car.topTurretWeapons.length + 1);
                            wpn = CWD.webgl.getWeaponBarrel(car.topTurretWeapons[t], 2);
                            CWD.webgl.resizeModel(wpn, STLWeaponSize / wpn.userData.size.y);
                            CWD.webgl.moveModel(wpn, {x: x, y: y, z: z + wpn.userData.size.z / 2});
                            parent.add(wpn);
                        }
                    }
                }
                frontWeapons = [];
                for(t=0; t<car.frontWeapons.length; t++) {
                    wpn = CWD.webgl.getWeaponBarrel(car.frontWeapons[t], 2);
                    wpn.userData.scale = STLWeaponSize / wpn.userData.size.y;
                    parent.add(wpn);
                    frontWeapons.push(wpn);
                }

                parent.scale.multiplyScalar(76.2 / car.body.userData.size.z);
                parent.rotation.x = Math.PI / 2;
                this.updateSTL();
            },
            updateSTL: function() {
                var i, x, y, z, scale;
                for(i=0; i<frontWeapons.length; i++) {
                    scale = frontWeapons[i].userData.scale;
                    x = car.frontWeapons[i].userData.center.x;
                    if(this.frontWeaponsRaised) {
                        parent.remove(frontWeapons[i]);
                        frontWeapons[i] = CWD.webgl.cloneWeapon(car.frontWeapons[i].userData.original, 3);
                        frontWeapons[i].userData.scale = scale;
                        z = car.frontWeapons[i].userData.center.z;
                        y = car.bodyStats.hoodWeaponHeight;
                        CWD.webgl.resizeModel(frontWeapons[i], scale/2); // TODO: reset from original?
                        CWD.webgl.moveModel(frontWeapons[i], {x: x, y: y + frontWeapons[i].userData.size.y / 2 - 0.3, z: z});
                    } else {
                        parent.remove(frontWeapons[i]);
                        frontWeapons[i] = CWD.webgl.getWeaponBarrel(car.frontWeapons[i], 2);
                        frontWeapons[i].userData.scale = scale;
                        y = car.frontWeapons[i].userData.center.y;
                        z = car.frontWeapons[i].userData.boundingBox.max.z;
                        CWD.webgl.resizeModel(frontWeapons[i], scale); // TODO: reset from original?
                        CWD.webgl.moveModel(frontWeapons[i], {x: x, y: y, z: z + frontWeapons[i].userData.size.z / 2});
                    }
                    parent.add(frontWeapons[i]);
                }
                $rootScope.$broadcast('redraw');
            },
            exportSTL: function() {
                var blob = new Blob([new THREE.STLExporter().parse(this.scene)], {type: "text/plain;charset=utf-8"});
                saveAs(blob, "car.stl");
            }
        };
    });
