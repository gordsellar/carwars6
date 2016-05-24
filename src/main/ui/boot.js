/*
 Car Wars is a trademark of Steve Jackson Games, and its rules and art are copyrighted by Steve Jackson Games.
 All rights are reserved by Steve Jackson Games.

 This game aid is the original creation of Aaron Mulder and is released for free distribution, and not for resale,
 under the permissions granted in the Steve Jackson Games Online Policy.

 Application code for this game aid (except for the Car Wars rules as noted above) copyright 2014 Aaron Mulder.
 */
/* global CW: true, CWD: true, angular, LazyLoad, THREE */
var CW = {}, CWD = {};

(function() {
    "use strict";

    CW.preload = {
        present: function() {return this.design || this.name || this.list || this.tag || this.confirm;}
    };
    CW.readCookie = function(name) {
        if(!document.cookie) return null;
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)===' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) === 0) {
                var result = c.substring(nameEQ.length,c.length);
                return decodeURIComponent(result.replace(/\+/g, '%20'));
            }
        }
        return null;
    };
    CW.clearCookie = function(name) {
        document.cookie = name+"=0; expires=Thu, 2 Aug 2001 20:47:11 UTC";
    };

    CW.writeAccessory = function (textChunks, hasItem, itemName, first, join) {
        if (!hasItem) return first;
        if (!first) textChunks.push(join ? join : " and ");
        textChunks.push(itemName);
        return false;
    };
    CWD.webgl = {
        recalculateModel: function (model) {
            var target = model;
            if (target.name === 'Weapon' && target.children.length === 2) {
                target = target.children[0];
            }
            var helper = new THREE.BoundingBoxHelper(target, 0xff0000);
            helper.update();
//            if(target !== model) console.log(helper.box.min.z+"-"+helper.box.max.z);
            model.userData.boundingBox = helper.box;
            model.userData.size = {
                x: helper.box.max.x - helper.box.min.x,
                y: helper.box.max.y - helper.box.min.y,
                z: helper.box.max.z - helper.box.min.z
            };
            model.userData.center = {
                x: helper.box.max.x - model.userData.size.x / 2,
                y: helper.box.max.y - model.userData.size.y / 2,
                z: helper.box.max.z - model.userData.size.z / 2
            };
            return model;
        }
    };

    var yellowText = "#FFCC33";
    CWD.outlineColor = "#996633";
    CWD.screenBackground = "#DDDDDD";
    var bootLoadTotal = 0;
    var bootLoadCount = 0;

    CWD.boot = function () {
        // TODO: Check for basic Canvas support
        var checkWebGL = function () {
            try {
                var canvas = document.createElement('canvas');
                return !!(window.WebGLRenderingContext
                    && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
                    && window.requestAnimationFrame);
            } catch (e) {
                return false;
            }
        };
        CWD.webgl.enabled = checkWebGL();
        var loadFile = function (type, url, callback, arg) {
            if (!callback) callback = showLoadProgress;
            ++bootLoadTotal;
            LazyLoad[type].apply(LazyLoad, [url, callback, arg]);
        };

        if (CWD.webgl.enabled) {
            loadFile('js', 'lib/three-r67.js');
            loadFile('js', 'lib/three-STLExporter-r67.js');
            loadFile('js', 'lib/FileSaver-2014-07-25.js');
            loadFile('js', 'lib/three-ColladaLoader-r67.js', function (arg) {
                // TODO: maybe account for these before Collada is loaded?
                loadFile('dae', 'models/compact.dae', modelLoaded, 'compact');
                loadFile('dae', 'models/pickup.dae', modelLoaded, 'pickup');
                loadFile('dae', 'models/seat.dae', modelLoaded, 'seat');
                loadFile('dae', 'models/engine.dae', modelLoaded, 'engine');
                loadFile('dae', 'models/wheel-for-screen.dae', modelLoaded, 'wheel');
                loadFile('dae', 'models/wheel-for-stl.dae', modelLoaded, 'wheelSTL');
                loadFile('dae', 'models/small-bore.dae', modelLoaded, 'smallBore');
                loadFile('dae', 'models/gas-tank.dae', modelLoaded, 'gasTank');
                loadFile('dae', 'models/turret-round.dae', modelLoaded, 'turret');
                loadFile('dae', 'models/turret-edged.dae', modelLoaded, 'turretEdged');
                showLoadProgress(arg);
            });
            //        loadFile('js','../lib/stats-r11.min.js');
        }
        loadFile('js', 'js/carwars.js');
//        loadFile('js', 'cdn/angular-1.2.25.min.js');
//        loadFile('js', 'cdn/angular-route-1.2.25.min.js');
//        loadFile('js', 'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.9/angular.min.js');
//        loadFile('js', 'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.9/angular-route.min.js');
        loadFile('js', 'http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js');
        loadFile('js', 'http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-route.min.js');
        if("ontouchstart" in window)
            loadFile('js', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-touch.min.js');
            //loadFile('js', 'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.9/angular-touch.min.js');
        loadFile('js', 'js/angular-app.js');
        if(CW.readCookie('role') === 'Admin')
            loadFile('js', 'js/admin.js');
        loadFile('js', 'js/views.js');
        loadFile('js', 'js/routing.js');
        //loadFile('css', 'cdn/ionic-1.0.0b14.css');
        //loadFile('css', 'http://code.ionicframework.com/1.0.0-beta.14/css/ionic.css');
        loadFile('css', 'http://code.ionicframework.com/1.0.1/css/ionic.css');
        loadFile('css', 'css/ng-modal.css');

        var hash = window.location.hash;
//        console.log("Found initial hash '"+hash+"'");
        var id;
        if(/^#\/?load\//.test(hash)) {
            hash = hash.replace(/^#\/?load\//, "");
            if(/^car\//.test(hash)) {
                id = hash.substr(4);
                if(/^[0-9]+$/.test(id)) {
                    ++bootLoadTotal;
                    var request = new XMLHttpRequest();
                    request.onreadystatechange = function() {
                        if(request.readyState === 4) {
                            if(request.status === 200)
                                CW.preload.design = JSON.parse(request.responseText);
                            else
                                alert("Unable to load requested design ("+request.status+": "+request.statusText+")");
                            showLoadProgress();
                        }
                    };
                    request.open("GET", "/designs/"+id, true);
                    request.send(null);
                }
            } else if(/^list\//.test(hash)) {
                CW.preload.list = hash.substr(5);
            } else if(/^tag\//.test(hash)) {
                CW.preload.tag = hash.substr(4);
            } else if(/^search\//.test(hash)) {
                CW.preload.name = hash.substr(7);
            } else if(/^confirm\//.test(hash)) {
                CW.preload.confirm = hash.substr(8);
                if(CW.preload.confirm.indexOf('%') > -1) CW.preload.confirm = decodeURIComponent(CW.preload.confirm);
            }
        }

        console.log("Loading " + bootLoadTotal + " files");
    };

    var fullyLoaded = false;
    var loadComplete = function () {
        if (fullyLoaded) return;
        fullyLoaded = true;
        angular.bootstrap(document, ['carwars']);
    };

    CWD.drawLoadingScreen = function () {
        var ctx = CWD.loadingCtx;
        ctx.fillStyle = CWD.screenBackground;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = yellowText;
        ctx.font = '100px sans-serif';
        ctx.strokeStyle = CWD.outlineColor;
        ctx.transform(1, 0, -0.7, 1, 0, 0);
        ctx.fillText('Car Wars', 150, 100);
        ctx.strokeText('Car Wars', 150, 100);
        ctx.setTransform.apply(ctx, CWD.globalTransform);
        ctx.fillText('Combat Garage', 30, 200);
        ctx.strokeText('Combat Garage', 30, 200);
        ctx.setTransform.apply(ctx, CWD.globalTransform);
        ctx.strokeRect(0, 0, CWD.canvasSize.width, CWD.canvasSize.height);
        drawCar();
    };

    var modelLoaded = function (result, name) {
        var data = result.scene;
        //    console.log(name+" has "+data.model.children.length+" children");
        if (data.children.length === 1) data = data.children[0];
        data.position.set(0, 0, 0);
        data.scale.set(1, 1, 1);
        CWD.webgl.recalculateModel(data);
        CWD.webgl[name] = data;
        //    console.log(name+" loaded with center "+data.center.x+","+data.center.y+","+data.center.z+" dims "+data.size.x+","+data.size.y+","+data.size.z);
        showLoadProgress();
    };

     var showLoadProgress = function () {
        bootLoadCount += 1;
        drawCar();
    };

    var drawCar = function() {
        var percent = Math.round(bootLoadCount * 100 / bootLoadTotal);
        var ctx = CWD.loadingCtx;
        if (!ctx) return;
        ctx.setTransform.apply(ctx, CWD.globalTransform);
        ctx.fillStyle = CWD.screenBackground;
        ctx.fillRect(530, 300, 400, 200);
        if (percent < 99) {
            ctx.fillStyle = yellowText;
            ctx.strokeStyle = CWD.outlineColor;
            ctx.font = '30px sans-serif';
            ctx.fillText(percent + '% Loaded', 530, 400);
            ctx.strokeText(percent + '% Loaded', 530, 400);
        }

        // Body, Tires, Engine, Driver, Gunner,
        // RL 1(F), RL 2(F), Turret, L(T), MD (B),
        // Spoiler & Airdam
        if (percent >= 9 && CWD.carBody1 && !CWD.loadingScreenCar) {
            CWD.loadingScreenCar = {
                body: CWD.carBody1,
                car: {
                    tire: {
                        abbv: "PR",
                        totalDP: function () {
                            return 9;
                        }
                    },
                    engine: {
                        name: "Large w/PC",
                        totalDP: function () {
                            return 10;
                        }
                    },
                    driver: {
                        name: "Driver",
                        totalDP: function () {
                            return 6;
                        }
                    },
                    gunner: {
                        name: "Gunner",
                        totalDP: function () {
                            return 6;
                        }
                    },
                    rl: {
                        abbv: "RL",
                        fake: false,
                        ammoTotal: function () {
                            return 10;
                        },
                        totalCapacity: function () {
                            return 10;
                        },
                        isRocket: function () {
                            return true;
                        },
                        isSingleShotRocket: function () {
                            return false;
                        },
                        isLaser: function() {
                            return false;
                        },
                        totalDP: function () {
                            return 2;
                        }
                    },
                    turret: {
                        name: "Turret",
                        weapons: [],
                        boosters: []
                    },
                    laser: {
                        abbv: "L",
                        category: 'Lasers',
                        fake: false,
                        ammoTotal: function () {
                            return 0;
                        },
                        totalCapacity: function () {
                            return 0;
                        },
                        isRocket: function () {
                            return false;
                        },
                        isLaser: function() {
                            return true;
                        },
                        isSingleShotRocket: function () {
                            return false;
                        },
                        totalDP: function () {
                            return 2;
                        }
                    },
                    md: {
                        abbv: "MD",
                        category: 'Dropped Solids',
                        fake: false,
                        ammoTotal: function () {
                            return 10;
                        },
                        totalCapacity: function () {
                            return 10;
                        },
                        isRocket: function () {
                            return false;
                        },
                        isSingleShotRocket: function () {
                            return false;
                        },
                        isLaser: function() {
                            return false;
                        },
                        totalDP: function () {
                            return 2;
                        }
                    }
                },
                widthToBody: 50,
                bodyWidth: 415,
                heightToBody: 250,
                bodyHeight: 215,
                frontWheelhubs: [],
                frontWheelguards: [],
                backWheelhubs: [],
                backWheelguards: [],
                shapes: []
            };
        }
        var car = CWD.loadingScreenCar;
        if (car) {
            if (percent >= 18 && !car.frontRightTire) {
                car.frontRightTire = CWD.createTireShape(car.car.tire, "Front Tires", null, false, true);
                car.frontLeftTire = CWD.createTireShape(car.car.tire, "Front Tires", null, true, true);
                car.backRightTire = CWD.createTireShape(car.car.tire, "Back Tires", null, false, true);
                car.backLeftTire = CWD.createTireShape(car.car.tire, "Back Tires", null, true, true);
                car.body.layoutTires(car);
            }
            if (percent >= 27 && !car.engine) {
                car.engine = CWD.createEngineShape(car.car);
                car.engine.layout(car.widthToBody + 210, car.heightToBody + car.bodyHeight / 2 - 50, 100, 100);
                car.shapes.push(car.engine);
            }
            if (percent >= 36 && !car.driver) {
                car.driver = CWD.createCrewShape(car.car.driver);
                car.driver.layout(car.widthToBody + 105, car.heightToBody + 5, 100, 100);
                car.shapes.push(car.driver);
            }
            if (percent >= 45 && !car.gunner) {
                car.gunner = CWD.createCrewShape(car.car.gunner);
                car.gunner.layout(car.widthToBody + 105, car.heightToBody + 110, 100, 100);
                car.shapes.push(car.gunner);
            }
            if (percent >= 54 && !car.rl1) {
                car.rl1 = CWD.createWeaponShape(car.car.rl, "Front");
                car.rl1.layout(car.widthToBody + 315, car.heightToBody + 5, 100, 100);
                car.shapes.push(car.rl1);
            }
            if (percent >= 63 && !car.rl2) {
                car.rl2 = CWD.createWeaponShape(car.car.rl, "Front");
                car.rl2.layout(car.widthToBody + 315, car.heightToBody + 110, 100, 100);
                car.shapes.push(car.rl2);
            }
            if (percent >= 72 && !car.turret) {
                car.turret = CWD.createTurretShape(car.car.turret);
                car.turret.layout(car.widthToBody, car.heightToBody + 110, 100, 100);
                car.shapes.push(car.turret);
            }
            if (percent >= 81 && !car.laser) {
                car.laser = CWD.createWeaponShape(car.car.laser, "Turret");
                car.laser.layout(car.widthToBody + 5, car.heightToBody + 115, 90, 50);
                car.car.turret.weapons.push(car.car.laser);
                car.shapes.push(car.laser);
            }
            if (percent >= 90 && !car.md) {
                car.md = CWD.createWeaponShape(car.car.md, "Back");
                car.md.layout(car.widthToBody, car.heightToBody + 5, 100, 100);
                car.shapes.push(car.md);
            }
            if (percent >= 99 && !car.car.spoiler) {
                car.car.spoiler = true;
                car.car.airdam = true;
            }

            if (!car.gradient) {
                car.gradient = ctx.createLinearGradient(car.widthToBody, car.heightToBody, car.widthToBody, car.heightToBody + car.bodyHeight);
                if (car.gradient) {
                    car.gradient.addColorStop(0, '#AA2222');
                    car.gradient.addColorStop(0.5, '#EE3030');
                    car.gradient.addColorStop(1, '#AA2222');
                } else {
                    car.gradient = 'black';
                }
            }

            if (car.body.drawLowerBody) {
                car.body.drawLowerBody(car, ctx, null, CWD.outlineColor, car.widthToBody, car.bodyWidth, car.heightToBody, car.bodyHeight, false);
                ctx.strokeStyle = CWD.outlineColor;
                ctx.fillStyle = CWD.screenBackground;
                ctx.fill();
                ctx.stroke();
            }
            car.body.draw(car, ctx, null, CWD.outlineColor, car.widthToBody, car.bodyWidth, car.heightToBody, car.bodyHeight, false);
            ctx.strokeStyle = CWD.outlineColor;
            ctx.fillStyle = car.gradient;
            ctx.fill();
            ctx.stroke();
            if (car.body.drawUpperAccessories)
                car.body.drawUpperAccessories(car, ctx, null, CWD.outlineColor, car.widthToBody, car.bodyWidth, car.heightToBody, car.bodyHeight, false);
            for (var i = 0; i < car.shapes.length; i++) {
                car.shapes[i].draw(ctx, yellowText);
            }

            if (percent >= 99) loadComplete();
        }
    };

    var getDevicePixelRatio = function () {
        var mediaQuery;
        // Fix fake window.devicePixelRatio on mobile Firefox
        var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (window.devicePixelRatio !== undefined && !is_firefox) {
            return window.devicePixelRatio;
        } else if (window.matchMedia) {
            mediaQuery = "(-webkit-min-device-pixel-ratio: 2),"+
                "(min--moz-device-pixel-ratio: 2),"+
                "(-o-min-device-pixel-ratio: 2/1),"+
                "(min-resolution: 2dppx)";
            if (window.matchMedia(mediaQuery).matches)
                return 2;
            mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),"+
                "(min--moz-device-pixel-ratio: 1.5),"+
                "(-o-min-device-pixel-ratio: 3/2),"+
                "(min-resolution: 1.5dppx)";
            if (window.matchMedia(mediaQuery).matches)
                return 1.5;
            mediaQuery = "(-webkit-min-device-pixel-ratio: 1.3),"+
                "(min--moz-device-pixel-ratio: 1.3),"+
                "(-o-min-device-pixel-ratio: 13/10),"+
                "(min-resolution: 1.3dppx)";
            if (window.matchMedia(mediaQuery).matches)
                return 1.3;
        }
        return 1;
    };

    var getCanvasRatio = function (ctx) {
        var devicePixelRatio = getDevicePixelRatio();
        //    console.log("Browser: "+window.devicePixelRatio+" calculated: "+devicePixelRatio);
        var backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;
        return devicePixelRatio / backingStoreRatio;
    };

    CWD.setupFullScreenCanvas = function (canvas, name, width, height) {
        width = width || window.innerWidth;
        height = height || window.innerHeight;
        CWD[name] = CWD.setupCanvas(canvas, width, height, 1);
        return CWD;
    };

    CWD.setupCanvas = function (canvas, width, height, extra, shiftX, shiftY) {
        canvas.width = width;
        canvas.height = height;
        shiftX = shiftX || 0;
        shiftY = shiftY || 0;
        var ctx = canvas.getContext("2d");
        var ratio = getCanvasRatio(ctx);

        CWD.canvasSize = {width: canvas.width, height: canvas.height};
        if (ratio !== 1.0) {
            var oldWidth = canvas.width;
            var oldHeight = canvas.height;
            canvas.width = oldWidth * ratio;
            canvas.height = oldHeight * ratio;
            canvas.style.width = oldWidth + 'px';
            canvas.style.height = oldHeight + 'px';
            // now scale the context to counter
            // the fact that we've manually scaled
            // our canvas element
            CWD.baseTransform = [ratio, 0, 0, ratio, 0, 0];
            CWD.globalTransform = [ratio * extra, 0, 0, ratio * extra, shiftX*ratio, shiftY*ratio];
            ctx.setTransform.apply(ctx, CWD.globalTransform);
        } else {
            CWD.globalTransform = [extra, 0, 0, extra, shiftX, shiftY];
        }
        return ctx;
    };
})();