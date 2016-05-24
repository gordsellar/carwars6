/* global angular, CWD, CW3D */
angular.module('carwars').
    controller('SaveStockCtrl', function($rootScope, $scope, vehicle, model, model2d,
                                         server, nonAADATags) {
        "use strict";
        var i;
        var divTest = /^Div /;
        $scope.designName = vehicle.car.designName;
        $scope.authorName = model.stockConfig.authorName;
        if(model.stockConfig.tags.length === 0) {
            if(vehicle.car.tags && vehicle.car.tags.length > 0) {
                model.stockConfig.arena = false;
                for (i = 0; i < vehicle.car.tags.length; i++) {
                    if(divTest.test(vehicle.car.tags[i].tag))
                        model.stockConfig.arena = true;
                    else
                        model.stockConfig.tags.push(vehicle.car.tags[i].tag);
                }
            }
            if(vehicle.hasEngine()) {
                if(vehicle.hasGasEngine()) {
                    if (model.stockConfig.tags.indexOf('Gas') < 0)
                        model.stockConfig.tags.push('Gas');
                } else {
                    if (model.stockConfig.tags.indexOf('Electric') < 0)
                        model.stockConfig.tags.push('Electric');
                }
            }
        }
        if(!model.stockConfig.designerNotes && vehicle.car.designer_comments)
            model.stockConfig.designerNotes = vehicle.car.designer_comments;
        if(!model.stockConfig.designerSignature && vehicle.car.signature)
            model.stockConfig.designerSignature = vehicle.car.signature;
        $scope.tags = model.stockConfig.tags.join();
        $scope.tagging = false;
        var cost = vehicle.totalCost();
        if(vehicle.isCar() || vehicle.isCycle() || vehicle.isTrike()) {
            if(cost <= 5000) $scope.division = 5;
            else if(cost <= 7500) $scope.division = 7.5;
            else if(cost <= 10000) $scope.division = 10;
            else if(cost <= 15000) $scope.division = 15;
            else if(cost <= 20000) $scope.division = 20;
            else if(cost <= 25000) $scope.division = 25;
            else if(cost <= 30000) $scope.division = 30;
            else if(cost <= 40000) $scope.division = 40;
            else if(cost <= 60000) $scope.division = 60;
            else if(cost <= 80000) $scope.division = 80;
            else if(cost <= 100000) $scope.division = 100;
        }
        if(model.stockConfig.arena === null)
            model.stockConfig.arena = $scope.division && $scope.division < 40 && cost > ($scope.division*1000-500);
        $scope.arena = model.stockConfig.arena;
        if(model.stockConfig.designerSignature === null)
            model.stockConfig.designerSignature = server.currentUserSignature();
        $scope.designerNotes = model.stockConfig.designerNotes;
        $scope.designerSignature = model.stockConfig.designerSignature;
        $scope.tagOptions = nonAADATags;
        $scope.selectedTags = {};
        for(i=0; i<model.stockConfig.tags.length; i++) {
            $scope.selectedTags[model.stockConfig.tags[i]] = true;
        }

        // Generate the thumbnail
        var canvas = document.createElement('canvas');
        canvas.width=233;
        canvas.height=200;
        if($scope.mainDisplay !== '2d') model2d.createNewCar(vehicle.car, true);
        var car = model2d.car;
        var useX = car.maximumX + 4;
        var useY = car.totalHeight + 4;
        var factor = Math.min(233/useX, 200/useY);
        var paddingLeft = 233/2-Math.round((useX-2)*factor)/2;
        var paddingTop = 200/2-Math.round(useY*factor)/2;
        var ctx = CWD.setupCanvas(canvas, 233, 200, factor, paddingLeft, paddingTop);
        car.draw(ctx, true);
        $scope.thumbnail = canvas.toDataURL('image/png');
        if($scope.mainDisplay !== '2d') model2d.destroy();
        else $rootScope.$broadcast('resize');

        var save = function(prop, newV, oldV) {
            if(newV !== oldV) model.stockConfig[prop] = newV;
        };
        $scope.$watch('arena', function(newValue, oldValue) {save('arena', newValue, oldValue);});
        $scope.$watch('designerNotes', function(newValue, oldValue) {save('designerNotes', newValue, oldValue);});
        $scope.$watch('designerSignature', function(newValue, oldValue) {save('designerSignature', newValue, oldValue);});

        $scope.toggleTagging = function() {
            $scope.tagging = !$scope.tagging;
        };
        $scope.selectTag = function(tag) {
            if(model.stockConfig.tags.indexOf(tag) > -1) {
                model.stockConfig.tags.splice(model.stockConfig.tags.indexOf(tag), 1);
                $scope.selectedTags[tag] = false;
            } else {
                model.stockConfig.tags.push(tag);
                $scope.selectedTags[tag] = true;
            }
            $scope.tags = model.stockConfig.tags.join();
        };

        $scope.submitDesign = function() {
            var id = vehicle.car.designId;
            $scope.showLoadingMessage("Saving "+vehicle.car.designName+"...");
            for(var t=model.stockConfig.tags.length-1; t >= 0; t--)
                if(divTest.test(model.stockConfig.tags[t]))
                    model.stockConfig.tags.splice(t, 1);
            if($scope.arena) model.stockConfig.tags.push("Div "+$scope.division);
            server.saveDesign(vehicle.car, model.stockConfig.authorName, model.stockConfig.authorEmail, true,
                model.stockConfig.tags, model.stockConfig.designerNotes, model.stockConfig.designerSignature,
                $scope.thumbnail,
                function() {
                    $scope.hideLoadingMessage();
                    $scope.setLastSavedID(id);
                    $scope.openScreen('confirmSave');
                }, function() {
                    $scope.hideLoadingMessage();
                    $scope.alert("Unable to save design.  Sorry!");
                });
        };
    });

// Basic 3D screen capture
//        $rootScope.$broadcast('mouse-out-controls');
//        $rootScope.$broadcast('redraw', function(bigCanvas) {
//            var factor = bigCanvas.width/233;
//            factor = Math.max(factor, bigCanvas.height/200);
//            canvas.getContext('2d').drawImage(bigCanvas, 0, 0, bigCanvas.width/factor, bigCanvas.height/factor);
//            $scope.thumbnail = canvas.toDataURL();
//        });
