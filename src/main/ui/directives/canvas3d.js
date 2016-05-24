/* global angular, THREE, CWD, CW3D */
angular.module('carwars')
    .directive('carwarsCanvas3d', function($rootScope) {
        "use strict";
        return {
            link: function(scope, elem, attrs) {
                var bottom = attrs.bottom ? parseInt(attrs.bottom) : 0;
                var raw = elem[0];
                var offsetX = 0, offsetY = 0, elemW, elemH;
                var radiusMin = 20, radiusMax = 50;
                var test = raw;
                var inControls = false;
                if (test.offsetParent !== undefined) {
                    do {
                        offsetX += test.offsetLeft;
                        offsetY += test.offsetTop;
                    } while ((test = test.offsetParent));
                }

                var gl = {
//            stats: initStats(),
                    scene: null,
                    camera: new THREE.PerspectiveCamera(45, (scope.mainDimensions.width-offsetX) / (scope.mainDimensions.height-offsetY), 0.1, 1000),
                    ambient: new THREE.AmbientLight(0x101010),
                    light: new THREE.SpotLight(0xffffff),
                    renderer: new THREE.WebGLRenderer({canvas: raw}),
                    projector: new THREE.Projector()
                };
                var initScene = function(scene) {
                    gl.scene = scene;
                    if(scope.cameraOnChild) {
                        gl.scene.children[0].add(gl.camera);
                        gl.scene.children[0].add(gl.light);
                    } else {
                        gl.scene.add(gl.camera);
                        gl.scene.add(gl.light);
                    }
                    gl.scene.add(gl.ambient);
                };
                initScene(scope.scene);
                scope.$watch('scene', function(newValue, oldValue) {
                    if(newValue !== oldValue) {
                        initScene(newValue);
                        if(inControls) setTranslucent(getBody(), true);
                        draw();
                    }
                });
                gl.renderer.setClearColor(parseInt(CWD.screenBackground.replace("#", "0x")), 1.0);
//                gl.camera.position.set(-25, 10, 0); // Look at right side from slightly above middle
//                gl.camera.position.set(-25, 10, 18); //Look at right from above front
//                gl.light.position.copy(scope.lightPosition);

                var radius = radiusMin*1.5;
                var phi, theta;
                if(scope.cameraOnChild) {
                    phi = Math.PI /5; // azimuthal from Z axis
                    theta = Math.PI / 8; // inclination from horizon
                } else {
                    phi = Math.PI * 7 / 4; // azimuthal from Z axis
                    theta = Math.PI / 8; // inclination from horizon
                }
                var updateCamera = function() {
                    if(radius < radiusMin) radius = radiusMin;
                    if(radius > radiusMax) radius = radiusMax;
                    gl.camera.position.set(
                        radius*Math.cos(theta)*Math.sin(phi),
                        radius*Math.sin(theta),
                        radius*Math.cos(theta)*Math.cos(phi)
                    );
                    gl.camera.lookAt(gl.scene.position);
                    var lt = Math.max(Math.min(Math.PI/2, theta+Math.PI/8), -Math.PI/2);
                    var lp = phi+Math.PI/8;
                    gl.light.position.set(
                        radius*7*Math.cos(lt)*Math.sin(lp),
                        radius*7*Math.sin(lt),
                        radius*7*Math.cos(lt)*Math.cos(lp)
                    );
                };
                updateCamera();


                var layout = function(newValue) {
                    elemW = newValue.width-offsetX;
                    elemH = newValue.height-offsetY-bottom;
                    elem.css({width: elemW, height: elemH});
                    gl.renderer.setSize(elemW, elemH);
                    gl.camera.aspect = elemW/elemH;
                    gl.camera.updateProjectionMatrix();
                    draw();
                };
                var draw = function(capture) {
                    gl.renderer.render(gl.scene, gl.camera);
                    if(capture) {
//                        console.log("Capturing 3D screen shot.");
                        capture(raw);
                    }
                };
                layout(scope.mainDimensions);
                $rootScope.$broadcast('moveToolbar', 0);

                var getBody = function() {
                    return gl.scene.children[0].getObjectByName("Body");
                };
                var setTranslucent = function(obj, translucent) {
                    if(obj.material) {
                        obj.material.transparent = translucent;
                        obj.material.opacity=0.1;
                    } else for(var i=0; i<obj.children.length; i++) {
                        setTranslucent(obj.children[i], translucent);
                    }
                };
                var setMaterial = function(obj, mat, reset) {
                    var result, i;
                    if(reset && obj.userData.originalMaterial) {
                        result = obj.material;
                        obj.material = obj.userData.originalMaterial;
                    } else if(obj.material) {
                        if(!obj.material.transparent || obj.material.opacity > 0.09) {
                            result = obj.material;
                            obj.material = mat;
                        }
                    } else for(i=0; i<obj.children.length; i++) {
                        var temp = setMaterial(obj.children[i], mat, reset);
                        if(temp) result = temp;
                    }
                    return result;
                };
                var selectedMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
                var findHoverShape = function(x, y) {
                    if(!scope.models) return null;
                    var i, hit, overBody;
                    var body = getBody();
                    var vector = new THREE.Vector3((x/elemW)*2-1, -(y/elemH)*2+1, 0.5);
                    var ray = gl.projector.pickingRay(vector, gl.camera);
                    overBody = ray.intersectObject(body, true).length > 0;
                    var result = ray.intersectObjects(scope.models, true);
                    if(result.length > 0) { // Something other than body selected
                        if(!scope.hoverShape) setTranslucent(body, true);
                        for (i = 0; i < result.length; i++) {
                            result[i] = result[i].object;
                            while (!result[i].name && result[i].parent) result[i] = result[i].parent;
                        }
                        hit = result[0];
                        if (hit.name === "Turret") {
                            if (result.length > 1 && result[1].userData.turreted) hit = result[1];
                        }
                        if (scope.hoverShape && scope.hoverShape === hit) return scope.hoverShape;
                        if (scope.hoverComponent) setMaterial(scope.hoverComponent, scope.hoverMaterial, true);
                        scope.hoverShape = hit;
                        scope.hoverComponent = hit;
                        scope.hoverMaterial = setMaterial(scope.hoverComponent, selectedMaterial);
                    } else if(overBody) { // Only body selected
                        if(!scope.hoverShape) setTranslucent(body, true);
                        if (scope.hoverComponent) setMaterial(scope.hoverComponent, scope.hoverMaterial, true);
                        scope.hoverShape = body;
                        scope.hoverComponent = null;
                    } else { // Nothing selected
                        if(scope.hoverShape) setTranslucent(body, false);
                        if(scope.hoverComponent) setMaterial(scope.hoverComponent, scope.hoverMaterial, true);
                        scope.hoverShape = null;
                        scope.hoverComponent = null;
                    }

                    return scope.hoverShape;
                };
                var startX, startY, down=false, check=false;
                elem.on('mousedown', function(e) {
                    startX = e.pageX;
                    startY = e.pageY;
                    down=true;
                    check=true;
                }).on('mouseup', function(){
                    down=false;
                }).on('mousewheel', function(e) {
                    radius += e.wheelDelta;
                    updateCamera();
                    draw();
                }).on('DOMMouseScroll', function(e) {
                    radius -= e.detail;
                    updateCamera();
                    draw();
                }).on('mousemove', function(e) {
                    var oldShape = scope.hoverShape;
                    var newShape = findHoverShape(e.pageX-offsetX, e.pageY-offsetY);
                    if(oldShape !== newShape) {
                       draw();
                    }
                    if(check) {
                        if(newShape) down=false;
                        check = false;
                    }
                    if(down) {
                        var moveX = e.pageX-startX;
                        var moveY = e.pageY-startY;
                        phi += moveX/100;
                        theta += moveY/100;
                        // If unrestricted, sudden flip upside down
                        if(theta > Math.PI/2) theta = Math.PI/2;
                        if(theta < -Math.PI/2) theta = -Math.PI/2;
                        updateCamera();
                        draw();
                        startX = e.pageX;
                        startY = e.pageY;
                    }
                    scope.$apply(function() {scope.setHoverText(scope.hoverShape ? scope.hoverShape.userData.hoverText : '');});
                }).on('mouseout', function() {
                    down = false;
                    var redraw = false;
                    var hover = scope.hoverShape;
                    if (scope.hoverComponent) {
                        redraw = true;
                        setMaterial(scope.hoverComponent, scope.hoverMaterial, true);
                    }
                    scope.hoverShape = null;
                    scope.hoverComponent = null;
                    if(hover) {
                        setTranslucent(getBody(), false);
                        scope.$apply(function() {scope.setHoverText('');});
                        redraw = true;
                    }
                    if(redraw) draw();
                }).on('click', function() {
                    scope.$apply(function() {
                        scope.click(scope.hoverShape ? scope.hoverShape.userData.hoverLink : null,
                            scope.hoverShape ? scope.hoverShape.userData : null);
                    });
                });
                scope.$on('redraw', function(event, capture) {
                    draw(capture);
                });
                scope.$on('resize', function() { // The underlying model changed size
                    layout(scope.mainDimensions);
                });
                scope.$on('mouse-in-controls', function() {
                    inControls = true;
                    setTranslucent(getBody(), true);
                    draw();
                });
                scope.$on('mouse-out-controls', function() {
                    inControls = false;
                    setTranslucent(getBody(), false);
                    draw();
                });
            },
            restrict: 'E',
            replace: true,
            template: '<canvas></canvas>'
        };
    });