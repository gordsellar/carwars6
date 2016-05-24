/* global angular, CWD, CWQA */

angular.module('carwars')
    .directive('carwarsCanvas2d', function($rootScope) {
        "use strict";
        return {
            link: function(scope, elem, attrs) {
                var w = parseInt(attrs.baseWidth);
                var h = parseInt(attrs.baseHeight);
                var lastCSSW = 0, lastCSSH = 0;
                var bottom = attrs.bottom ? parseInt(attrs.bottom) : 0;
                var factor = 1;
                var paddingLeft = 0, paddingTop = 0;
                var ctx;
                var raw = elem[0];
                var temp, offsetX = 0, offsetY = 0;
                // Reserve 30 on top for Design Name, or 45 for 2D/3D/Menu
                var reserveTop = attrs.reserveTop ? parseInt(attrs.reserveTop) : 0;
                // Reserve 80 on bottom for Hover Text
                var reserveBottom = attrs.reserveBottom ? parseInt(attrs.reserveBottom) : 0;

                var draw = function(capture) {
                    scope.car.draw(ctx);
                    if(scope.lastSavedID && scope.car.car.garageVersion) {
                        ctx.fillStyle = 'black';
                        ctx.font = '10px sans-serif';
                        var text = "Saved by v."+scope.car.car.garageVersion;
                        ctx.setTransform.apply(ctx, CWD.baseTransform);
                        ctx.fillText(text, lastCSSW-ctx.measureText(text).width-10, lastCSSH-3);
                    }
//                    ctx.fillStyle = 'red';
//                    ctx.font = '50px sans-serif';
//                    ctx.fillText("Dims: "+scope.mainDimensions.width+"x"+scope.mainDimensions.height, 50, 100);
                    if(capture) capture(elem[0]);
                };

                var layout = function(newValue) {
                    var useH = newValue.height - (scope.tourRunning ? 200 : 0);
                    var useX = w, useY = h, newX = newValue.width-offsetX, newY = useH-offsetY-bottom;
                    // If the car is smaller than the canvas, zoom to the car dimensions

                    if(scope.car && scope.car.maximumX && scope.car.totalHeight) {
                        useX = scope.car.maximumX + 4;
                        useY = scope.car.totalHeight + 4;
                    }
                    elem.css({width: newX, height: newY});
                    lastCSSW = newX;
                    lastCSSH = newY;
                    factor = Math.min(newX/useX, (newY-reserveTop-reserveBottom)/useY);
                    paddingLeft = newX/2-Math.round((useX-2)*factor)/2;
                    paddingTop = reserveTop+(newY-reserveTop-reserveBottom)/2-Math.round(useY*factor)/2;
                    ctx = CWD.setupCanvas(elem[0], newX, newY, factor, paddingLeft, paddingTop);
                    if(scope.car) draw();
                    // Use the line below to keep the toolbar vertically close to the car
//                    $rootScope.$broadcast('moveToolbar', Math.max(0, Math.round(newY-useY*factor)));
                    $rootScope.$broadcast('moveToolbar', 0);
                };
                offsetX = 0;
                temp = elem.css('top');
                offsetY = temp ? temp.indexOf('px') > -1 ? parseInt(temp.substr(0, temp.indexOf('px'))) : parseInt(temp) : 0;
                // Doesn't work the first time; the parent is not in the DOM or something?
//                do {
//                    offsetX += raw.offsetLeft;
//                    offsetY += raw.offsetTop;
//                } while ((raw = raw.offsetParent));
                layout(scope.mainDimensions);

                var nx, ny;
                elem.on('mousemove', function(e) {
                    if(!scope.car) return;
                    var oldShape = scope.car.hoverShape;
                    nx = (e.pageX-offsetX-paddingLeft)/factor;
                    ny = (e.pageY-offsetY-paddingTop)/factor;
                    var newShape = scope.car.contains(nx, ny);
                    if(oldShape !== newShape) {
                        draw();
                        if(newShape) elem.css('cursor', 'pointer');
                        else elem.css('cursor', 'default');
                    }
                    scope.$apply(function(){scope.setHoverText(scope.car.hoverShape ? scope.car.hoverShape.hoverText : '');});
                }).on('mouseout', function() {
                    if(!scope.car) return;
                    var hover = scope.car.hoverShape;
                    scope.car.hoverShape = null;
                    if(hover) {
                        draw();
                        elem.css('cursor', 'default');
                        scope.$apply(function(){scope.setHoverText('');});
                    }
                }).on('click', function() {
                    if(!scope.car) return;
                    var link = scope.car.hoverShape ? scope.car.hoverShape.hoverLink : null;
                    if(window.CWQA && window.CWQA.clickOnCanvas) window.CWQA.clickOnCanvas(link, scope.car.hoverShape, Math.round(nx), Math.round(ny));
                    scope.$apply(function(){scope.click(link, scope.car.hoverShape);});
                });
                scope.$on('redraw', function(event, capture) {
                    draw(capture);
                });
                scope.$on('resize', function() {
                    layout(scope.mainDimensions);
                });
                scope.$parent.$parent.diagramCoordinates = function(itemX, itemY) {
                    return {
                        x: itemX*factor+offsetX+paddingLeft,
                        y: itemY*factor+offsetY+paddingTop
                    };
                };
            },
            restrict: 'E',
            replace: true,
            template: '<canvas></canvas>'
        };
    });