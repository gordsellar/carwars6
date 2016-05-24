/* global angular, CW, CWD */
angular.module('carwars')
    .directive('garageTour', function($rootScope, $window, $timeout, vehicle, model, model2d, server) {
        "use strict";

        var STARTINDEX = -1;
        // To build more tour, replace the canvas in tour.html with this:
        // <canvas class="TourCanvas" ng-mousemove="mousePosition=$event.pageX+','+$event.pageY+' / '+($event.pageX <= mainDimensions.width ? ($event.pageX/mainDimensions.width).toFixed(2) : $event.pageX-mainDimensions.width)+','+($event.pageY <= mainDimensions.height ? ($event.pageY/mainDimensions.height).toFixed(2) : $event.pageY-mainDimensions.height)"></canvas>
        // <div style="position: absolute; bottom: 0; right: 0; color: red; z-index: 50">{{mousePosition}}</div>


        var screens = [
            {
                text: "Welcome to the Combat Garage Tour.<br />" +
                      "During this tour I point out things you can mouse over and click, but note that you " +
                        "won't be able to try that out until you close the tour.<br />" +
                      "Now, let's get started!",
                opacity: 0.5
            },
            {
                text: "Front and center you'll see the current vehicle design. " +
                        "You won't see every last accessory there, but most items that take space or have DP will show up.",
                arrows: {
                        target: function(car) {return car.phantomShapes.rightArmor;}
                    }
            },
            {
                text: "Along the top you'll find the status display with the key statistics for the design. "+
                        "These values are updated every time you make any change to the design.",
                arrows: function(dims) {
                            return {x: dims.width/3, y: 50};
                        }
            },
            {
                text: "If you hover your mouse over a component in the design view, it will highlight the edge and show " +
                        "the name of the component in green text (below).  You can click to edit that component.",
                hoverShape: function(car) {return car.engine;},
                arrows: {
                        target: function(car) {return car.engine;}
                    }
            },
            {
                text: "You can also click the area where something <i style='font-style: italic'>could</i> go " +
                        "(like weapon or armor) to work on that.<br />" +
                    "On a tablet, you can just touch the location.",
                hoverShape: function(car) {return car.phantomShapes.frontWeapons;},
                arrows: {
                        target: function(car) {return car.phantomShapes.frontWeapons;},
                        center: true
                    }
            },
            {
                text: "To edit other features of the car, you can click the toolbar " +
                    "buttons below the design view.",
                arrows: function(dims) {
                            return {x: dims.width*2.5/13, y: dims.height-47};
                        }
            },
            {
                text: "Whether you click a feature in the design view or a toolbar button, you\'ll see " +
                        "the related editing controls here.  As you manipulate the controls, the design " +
                        "and the status display above it are updated immediately.",
                arrows: function(dims) {
                            return {x: dims.width, y: 150};
                        },
                init: function(scope) {
                    scope.openScreen('body');
                }
            },
            {
                text: "For instance, if you increase the body size from a Subcompact to " +
                      "a Compact, the space available instantly changes from 7 to 10.",
                arrows: function(dims) {
                            return [
                                {x: dims.width, y: 154},
                                {x: 370, y: 50}
                                ];
                    },
                init: function() {
                    var bodyScope = angular.element(document.querySelector("#Controls div.ionic-body")).scope();
                    bodyScope.bodyType = 'Compact';
                }
            },
            {
                text: "You may also notice that I changed the engine size for you. " +
                        "I try to help out where it makes sense.",
                arrows: function(dims) {
                            return {x: dims.width/2-80, y: dims.height-75};
                        }
            },
            {
                text: "You can find ways to make an illegal design, though.  Here we've added a one-space " +
                        "turret and then downsized the body to a Subcompact (which can't handle a turret).",
                init: function(scope) {
                    var cancel = $rootScope.$on('$viewContentLoaded', function(event) {
                        var pageScope = event.targetScope;
                        if(pageScope.createTopTurret) {
                            pageScope.createTopTurret(CW.turrets.Turret.name);
                            scope.processClick('editBody');
                        } else if(pageScope.bodyType) {
                            $timeout(function() {pageScope.bodyType = 'Subcompact';});
                            cancel();
                        }
                    });
                    scope.processClick('turretList');
                }
            },
            {
                text: "You can see the notifications here.<br/>" +
                    "If you need to show the exact reason again, you can mouse over "+
                    "the <i style='font-style: italic'>Illegal Design</i> text.",
                arrows: function(dims) {
                        return [{x: 70, y: 95},
                            {x: 70, y: dims.height-95},
                            {x: dims.width-70, y: dims.height-95},
                            {x: dims.width/2-80, y: dims.height-75}];
                }
            },
            {
                text: "Remove the offending turret, and the complaint goes away.",
                init: function(scope) {
                    var cancel = $rootScope.$on('$viewContentLoaded', function(event) {
                        var pageScope = event.targetScope;
                        if(pageScope.removeTurret) {
                            pageScope.removeTurret();
                            cancel();
                        }
                    });
                    scope.processClick('editTopTurret');
                }
            },
            {
                text: "At any time, you can click on the background outside the vehicle " +
                        "diagram to get back to the design description.",
                arrows: function(dims) {
                        return [{x: dims.width-70, y: dims.height-300},
                            {x: dims.width, y: 120}];
                        },
                init: function(scope) {
                    scope.processClick('overview');
                }
            },
            {
                text: "When you're ready to save your design or start over, you can use the " +
                "main menu control here.  Click it to bring up the menu...",
                arrows: function(dims) {
                            return {x: dims.width-40, y: 100};
                        },
                hoverShape: function() {return {hoverText: 'Main Menu'};}
            },
            {
                text: "And here's the list of options from the menu. " +
                    "You can save the current design, start a new design, " +
                    "view stock cars, or list your existing designs.",
                init: function(scope) {
                    scope.processClick('mainMenu');
                    var cancel = $rootScope.$on('$viewContentLoaded', function(event) {
                        var pageScope = event.targetScope;
                        if(pageScope.menuNewDesign) {
                            angular.element(document.querySelector("#Controls div.ng-modal-dialog")).
                                addClass('ng-dialog-top');
                            cancel();
                        }
                    });
                }
            },
            {
                text: "You'll need to set up an account and log in to list designs.  If you " +
                    "haven't set up an account before, choose Create an Account from the main menu "+
                    "and I'll walk you through the process.",
                arrows: function(dims) {
                        return {x: dims.width/2, y: 415};
                        },
                canShow: function() {return !server.currentUser();}
            },
            {
                text: "There are a couple other options available from the main screen. " +
                    "You can quickly switch between Classic, Compendium, and " +
                    "UACFH/Pyramid equipment here.",
                init: function(scope) {
//                    var scope = angular.element(document.querySelector("#Controls div.ionic-ng-modal")).scope();
                    scope.openScreen('overview');
                },
                arrows: function(dims) {
                        return {x: dims.width-70, y: 102};
                }
            },
            {
                text: "If your browser supports 3D (WebGL) and I have a 3D model for " +
                    "the vehicle type you're working on, you'll be able to switch "+
                    "between the diagram and an exterior view.",
                init: function(scope) {
                    scope.show3D = true;
                },
                arrows: function(dims) {
                        return {x: dims.width-122, y: 102};
                }
            },
            {
                text: "Here's a sample of the exterior view.  You'll be able to mouse over the "+
                    "vehicle to see interior components, and click on them just as "+
                    "you would on the diagram.",
                init: function(scope) {
                    scope.setDisplay('3D', true);
                },
                canShow: function() {return CWD.webgl.enabled;}
            },
            {
                text: "You can drag your mouse left/right or up/down on the background to "+
                    "rotate the vehicle, and use your mouse wheel (or two finger drag) "+
                    "to zoom in and out.",
                canShow: function() {return CWD.webgl.enabled;}
            },
            {
                text: "Some of the toolbar buttons will show you additional buttons just " +
                    "above as a convenience.  For instance, the Body button gives you " +
                    "shortcuts to switch to a particular body type.",
                init: function(scope) {
                    scope.setDisplay('2D');
                    scope.processClick('editBody', null, true);
                },
                arrows: function(dims) {
                        return [{x: dims.width/26+10, y: dims.height-47},
                            {x: dims.width*0.6, y: dims.height-94}];
                }
            },
            {
                text: "There are some important options available from the Design screen.",
                arrows: function(dims) {
                        return {x: dims.width*25/26-10, y: dims.height-47};
                },
                init: function(scope) {
                    scope.setHoverText("Design Info");
                }
            },
            {
                text: "You can download your design as a PDF.  It shows the text " +
                    "description, key statistics, a walkaround description, the design diagram, " +
                    "and a worksheet listing the components individually.",
                init: function(scope) {
                    vehicle.car.designName = 'Cosmic Fireball';
                    scope.setDesignName('Cosmic Fireball');
                    scope.processClick('design', null, true);
                },
                arrows: function(dims) {
                    return {x: dims.width, y: 604};
                }
            },
            {
                text: "If you've just saved or loaded the design (so it doesn't have " +
                    "unsaved changes), you can get the full text of the design or a " +
                    "link to it to share.",
                arrows: function(dims) {
                    return {x: dims.width, y: 500};
                }
            },
            {
                text: "You can also save your design for later, or to submit it for " +
                    "inclusion in the stock car list.",
                arrows: function(dims) {
                    return {x: dims.width, y: 445};
                }
            },
            {
                text: "If you enter an e-mail address before you save your design, " +
                    "I'll e-mail you a link to the design, and you'll be able to " +
                    "list it later from the main main.",
                arrows: function(dims) {
                    return [{x: dims.width, y: 125},
                        {x: dims.width, y: 390}];
                },
                init: function(appScope) {
                    var cancel = $rootScope.$on('$viewContentLoaded', function(event) {
                        var scope = event.targetScope;
                        if(scope.validate) {
                            if(!scope.authorName || !scope.authorEmail) {
                                scope.authorName = 'Aaron Mulder';
                                scope.authorEmail = 'ammulder@alumni.princeton.edu';
                            }
                            scope.validate();
                            scope.stockCar = false;
                            cancel();
                        }
                    });
                    appScope.openScreen("save");
                }
            },
            {
                text: "You may choose to submit your design as a stock car.  If you do, " +
                    "it will be saved, searchable by its name, and considered for " +
                    "inclusion in the stock car list.",
                arrows: function(dims) {
                    return [{x: dims.width, y: 230},
                        {x: dims.width, y: 390}];
                },
                init: function() {
                    var scope = angular.element(document.querySelector("#Controls div.ionic-body")).scope();
                    scope.stockCar = true;
                }
            },
            {
                text: "For a stock car, you can fill out any of these optional fields " +
                    "that you like before you save and submit the design.",
                init: function() {
                    var scope = angular.element(document.querySelector("#Controls div.ionic-body")).scope();
                    model.stockConfig.authorEmail = scope.authorEmail;
                    model.stockConfig.authorName = scope.authorName;
                    scope.openScreen('saveStock');
                },
                arrows: function(dims) {
                    return [{x: dims.width, y: 365},
                        {x: dims.width+10, y: 680}];
                }
            },
            {
                text: "Once you save the design, I'll give you a link to get back to it " +
                    "later, as well as e-mailing it to you if you provided an address.",
                init: function(scope) {
                    scope.openScreen("confirmSave");
                },
                arrows: function(dims) {
                    return {x: dims.width+150, y: 130};
                }
            },
            {
                text: "And that about does it for the tour. " +
                    "Happy designing!"
            }
        ];

        return {
            restrict: 'A',
            templateUrl: 'views/tour.html',
            link: function(scope, element) {
                var i, dialog, e, canvas = element.find('canvas')[0], offset;
                for(i=0; i<element.children().length; i++) {
                    e = element.children().eq(i);
                    if(e.hasClass('TourDialog')) {
                        dialog = e;
                        break;
                    }
                }

                scope.$on('resize', function(event, windowChanged) {
                    if(windowChanged && scope.tourRunning) {
                        var dims = scope.mainDimensions;
                        offset = $window.innerHeight > 751 ? $window.innerHeight - 751 : 0;
                        dialog.css({left: (dims.width / 2) + 'px', bottom: (offset + 128) + 'px'});
                        canvas.width = $window.innerWidth;
                        canvas.height = $window.innerHeight;
                        renderScreen();
                    }
                });
                var index;
                var oldDisplay;
                var oldCar;
                scope.initializeTour = function() {
                    oldDisplay = scope.mainDisplay;
                    oldCar = vehicle.car;
                    scope.createCar();
                    index = STARTINDEX;
                    element.find('button').eq(1).css({display: 'block'});
                    scope.tourRunning = true;
                    $rootScope.$broadcast('resize', true);
                    nextScreen();
                };
                scope.stopTour = function() {
                    scope.tourRunning = false;
                    scope.setCar(oldCar);
                    if(oldDisplay !== '2d')
                        scope.setDisplay(oldDisplay.toUpperCase());
                    $rootScope.$broadcast('resize', true);
                };
                var nextScreen = function() {
                    index += 1;
                    while(screens[index].canShow && !screens[index].canShow()) index += 1;
                    renderScreen();
                    if(screens[index].init) screens[index].init(scope);
                };
                var renderScreen = function() {
                    if(index < 0) return;
                    var i, div;
                    var screen = screens[index];
                    var p = element.find('p');
                    p.empty();
                    p.append(screen.text);
                    var opacity = screen.opacity ? screen.opacity : 0;
                    for(i=0; i<element.children().length; i++) {
                        div = element.children().eq(i);
                        if(div.hasClass('TourOverlay')) {
                            div.css({opacity: opacity});
                            break;
                        }
                    }
                    if (screen.hoverShape) {
                        var shape = screen.hoverShape(model2d.car);
                        if(model2d.car) model2d.car.hoverShape = shape;
                        scope.setHoverText(shape.hoverText);
                    } else {
                        if(model2d.car) model2d.car.hoverShape = null;
                        scope.setHoverText('');
                    }
                    //TODO: highlight the selected object in 3D
                    //var canvasScope = angular.element(document.querySelector("div.ng-scope canvas")).scope();
                    $rootScope.$broadcast('redraw');
                    drawArrows(screen);
                    if(index >= screens.length-1)
                        element.find('button').eq(1).css({display: 'none'});
                };
                var drawArrows = function(screen) {
                    var x, y, i, j, temp, arrow, shape;
                    var ctx = canvas.getContext('2d'), arrows = screen.arrows;
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    if(arrows) {
                        if(typeof arrows === 'function' || !arrows.length) arrows = [arrows];
                        for (i = 0; i < arrows.length; i++) {
                            if(typeof arrows[i] === 'function') temp = arrows[i](scope.mainDimensions);
                            else if(arrows[i].target) temp = arrows[i].target(model2d.car);
                            else temp = arrows[i].coordinates(scope.mainDimensions);
                            if(!temp.length) temp = [temp];
                            for(j=0; j<temp.length; j++) {
                                if(arrows[i].target) {
                                    shape = temp[j];
                                    if(arrows[i].center) {
                                        y = shape.y + shape.h/2;
                                    } else {
                                        y = shape.y + shape.h;
                                    }
                                    x = shape.x + shape.w / 2;
                                    temp = scope.diagramCoordinates(x, y);
                                    x = temp.x;
                                    y = temp.y;
                                } else {
                                    x = temp[j].x;
                                    y = temp[j].y;
                                }
                                arrow = createArrow(scope.mainDimensions.width/2, $window.innerHeight-offset-230, x, y, 'blue');
                                arrow.draw(ctx);
                            }


//                            if(arrows[i].target) {
//                                var shape = arrows[i].target(model2d.car);
//                                if(arrows[i].center) {
//                                    y = shape.y + shape.h/2;
//                                } else {
//                                    y = shape.y + shape.h;
//                                }
//                                x = shape.x + shape.w / 2;
//                                temp = scope.diagramCoordinates(x, y);
//                                x = temp.x;
//                                y = temp.y;
//                            } else {
//                                temp = arrows[i].coordinates(scope.mainDimensions);
//                                x = temp.x;
//                                y = temp.y;
//                            }
////                            console.log("Dims "+scope.mainDimensions.width+"x"+scope.mainDimensions.height+" Canvas "+canvas.width+"x"+canvas.height+" Diagram Coords: "+x+","+y+" Canvas Coords: "+fixed.x+","+fixed.y);
//                            var arrow = createArrow(scope.mainDimensions.width/2, $window.innerHeight-offset-230, x, y, 'blue');
//                            arrow.draw(ctx);
                        }
                    }
                };
                var createArrow = function (startx, starty, x, y, color) {
                    return {
                        length: Math.sqrt((x - startx) * (x - startx) + (y - starty) * (y - starty)),
                        angle: Math.atan2((y - starty), (x - startx)),
                        color: color || "#008000",
                        draw: function (ctx) {
                            ctx.setTransform(1, 0, 0, 1, 0, 0);
                            ctx.translate(startx, starty);
                            ctx.rotate(this.angle);
                            ctx.beginPath();
                            ctx.strokeStyle = this.color;
                            ctx.fillStyle = this.color;
                            ctx.moveTo(0, 0);
                            ctx.lineTo(0, -10);
                            ctx.lineTo(this.length - 30, -10);
                            ctx.lineTo(this.length - 30, -25);
                            ctx.lineTo(this.length, 0);
                            ctx.lineTo(this.length - 30, 25);
                            ctx.lineTo(this.length - 30, 10);
                            ctx.lineTo(0, 10);
                            ctx.closePath();
                            ctx.fill();
                            ctx.stroke();
                        }
                    };
                };
                element.find('button').eq(1).on('click', function() {
                    scope.$apply(function() {nextScreen();});
                });
            }
        };
    });
