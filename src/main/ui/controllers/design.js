/* global angular, CWQA */
angular.module('carwars').
    controller('DesignCtrl', function($scope, $window, vehicle, model, server) {
        "use strict";
        var update = function() {
            $scope.designName = vehicle.car.designName === "Unnamed Design" ? null : vehicle.car.designName;
            $scope.tech = vehicle.techLevel();
            $scope.handWeaponWeight = vehicle.car.personalEquipmentWeight;
            $scope.qaPresent = !!window.CWQA;
            $scope.showQA = false;
            $scope.qaScript = "";
        };
        update();
        $scope.color = vehicle.car.appearance.colorScheme.mainColor;
        $scope.colorPicker = false;

        $scope.tempColor = function(color) {
            vehicle.setColor(color);
            model.setColor();
        };
        $scope.setColor = function(color) {
            $scope.tempColor(color);
            $scope.color = color;
            if(!$scope.touchEnabled) $scope.colorPicker = false;
        };
        $scope.clearColor = function() {
            $scope.tempColor($scope.color);
        };
        $scope.changeName = function() {
            if(!$scope.designName) vehicle.car.designName = "Unnamed Design";
            else vehicle.car.designName = $scope.designName;
            $scope.setDesignName(vehicle.car.designName);
        };
        $scope.$watch('techLevel', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                $scope.tech = newValue;
                $scope.handWeaponWeight = vehicle.car.personalEquipmentWeight;
            }
        });
        $scope.$watch('tech', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                vehicle.techLevel(newValue);
                $scope.setTechLevel(newValue);
                vehicle.recalculate();
            }
        });
        $scope.$watch('handWeaponWeight', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                vehicle.car.personalEquipmentWeight = newValue;
                vehicle.recalculate();
            }
        });

        $scope.saveDesign = function() {
            $scope.openScreen('save');
        };
        $scope.shareDesign = function() {
            if($scope.lastSavedID) {
                $scope.designText = vehicle.textWithIllegal();
                $scope.designURL = server.loadDesignURL($scope.lastSavedID);
                $scope.shareVisible = true;
                console.log($scope.designText);
                console.log($scope.designURL);
            }
            else $scope.alert("You can only share a design that you have just saved or loaded.\nPlease save this design and try again.");
        };
        $scope.addToList = function() {$scope.notYetImplemented();};

        var pdfURL = null;
        $scope.downloadPDF = function() {
            $scope.showLoadingMessage("Generating PDF...");
            server.generatePDF(vehicle.car, $scope.lastSavedID, function(data) {
                $scope.hideLoadingMessage();
                if(!$window.open(data.url, '_blank')) {
                    pdfURL = data.url;
                    $scope.popupBlocked = true;
                }
            }, function() {
                $scope.hideLoadingMessage();
                $scope.alert("Unable to generate PDF.  Sorry.  It makes me sad too.");
            });
        };

        $scope.openBlockedPDF = function() {
            $scope.popupBlocked = false;
            $window.open(pdfURL, '_blank');
            pdfURL = null;
        };

        $scope.showScript = function() {
            $scope.qaScript = window.CWQA.getScript();
            $scope.showQA = true;
        };

        var createColors = function() {
            var result = [], row;
            var cols = 6;
            var rows = 12;
            var l;
            var hc, sc, c, hp, x, m, r1, g1, b1, r, g, b;
            var h, hInc = 360/rows;
            var s, sInc = 1/(cols+2);
            // From http://en.wikipedia.org/wiki/HSL_and_HSV#From_HSL
            for(hc = 0; hc < rows; hc++) {
                row = [];
                h = hc*hInc;
                s = 1;
                for(sc = 0; sc < cols; sc ++) {
                    if(sc === cols-1) {
                        l = 0.5;
                        s = 1/cols;
                    } else l = sc*sInc+sInc;
                    c = (1-Math.abs(2*l-1)) * s;
                    hp = h/60;
                    x = c*(1-Math.abs(hp%2-1));
                    if(hp < 1) {r1 = c; g1 = x; b1 = 0;}
                    else if(hp < 2) {r1 = x; g1 = c; b1 = 0;}
                    else if(hp < 3) {r1 = 0; g1 = c; b1 = x;}
                    else if(hp < 4) {r1 = 0; g1 = x; b1 = c;}
                    else if(hp < 5) {r1 = x; g1 = 0; b1 = c;}
                    else if(hp < 6) {r1 = c; g1 = 0; b1 = x;}
                    m = l - c/2;
                    r = Math.round((r1 + m)*255).toString(16);
                    g = Math.round((g1 + m)*255).toString(16);
                    b = Math.round((b1 + m)*255).toString(16);
                    if(r.length === 1) r = "0"+r;
                    if(g.length === 1) g = "0"+g;
                    if(b.length === 1) b = "0"+b;
                    row.push("#"+r+g+b);
                }
                result.push(row);
            }
            // Add greyscale
            c = 255/(cols+3);
            row = [];
            for(sc = 0; sc < cols; sc++) {
//                r = Math.round(c+(sc === 0 ? 10 : c*sc)).toString(16);
                r = Math.round(c*2+(c*sc)-10).toString(16);
                row.push("#"+r+r+r);
            }
            result.push(row);
            $scope.colorGrid = result;
        };
        createColors();
    });
