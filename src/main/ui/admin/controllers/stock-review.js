/* global angular, CW */
(function() {
    "use strict";
    CW.adminLoaded = true;
    var app = angular.module('carwars');
    var ctrl = function($scope, $rootScope, aadaTags, nonAADATags,
                        vehicle, stockList, server) {
        $scope.tagOptions = nonAADATags;
        $scope.selectedTags = {};
        $scope.setDisplay('StockList');
        $scope.zoom = false;
        $scope.working = true;
        stockList.adminReview = true;
        var currentDesigns = [];
        var currentCar = null;

        var reload = function() {
            server.pendingStockCars(function (designs) {
                $scope.working = false;
                $rootScope.$broadcast('stock-car-list', designs, null, null,
                        designs.length === 0 ? "No more pending stock cars" : "Pending stock cars");
                currentDesigns = designs;
            }, function () {
                $rootScope.$broadcast('stock-car-list', [], null, null, "Unable to load stock cars");
                $scope.working = false;
            });
        };
        reload();

        $scope.$on('stock-car-selected', function() {
            var i;
            $scope.zoom = true;
            var design = stockList.currentDesign;
            $scope.sameUser = design.author_email === server.currentUser();
            $scope.division = null;
            $scope.arena = false;
            $scope.selectedTags = {};
            if(design.vehicle === 'Car' || design.vehicle === 'Cycle' || design.vehicle === 'Trike') {
                if(design.cost <= 5000) $scope.division = 5;
                else if(design.cost <= 7500) $scope.division = 7.5;
                else if(design.cost <= 10000) $scope.division = 10;
                else if(design.cost <= 15000) $scope.division = 15;
                else if(design.cost <= 20000) $scope.division = 20;
                else if(design.cost <= 25000) $scope.division = 25;
                else if(design.cost <= 30000) $scope.division = 30;
                else if(design.cost <= 40000) $scope.division = 40;
                else if(design.cost <= 60000) $scope.division = 60;
                else if(design.cost <= 80000) $scope.division = 80;
                else if(design.cost <= 100000) $scope.division = 100;
            }
            for(i=0; i<design.tags.length; i++) {
                if(/^Div/.test(design.tags[i].tag)) $scope.arena = !!$scope.division;
                else $scope.selectedTags[design.tags[i].tag] = true;
            }
            buildTagList();
            $scope.designerSignature = design.signature;
            $scope.reviewerNotes = '';
            $scope.reviewerRating = '';
            $scope.designerNotes = '';
            $scope.designerName = design.author_name;
            for (i = 0; i < design.ratings.length; i++) {
                if (!$scope.sameUser && design.ratings[i].current) {
                    $scope.reviewerNotes = design.ratings[i].comments;
                    $scope.reviewerRating = design.ratings[i].rating;
                } else if(design.ratings[i].email === design.author_email) {
                    $scope.designerNotes = design.ratings[i].comments;
                }
            }
            checkTechLevel(stockList.currentDesign);
        });

        var removeFromList = function(id) {
            for(var i=0; i<currentDesigns.length; i++) {
                if(currentDesigns[i].id === id) {
                    currentDesigns.splice(i, 1);
                    break;
                }
            }
        };

        $scope.toggleTagging = function() {
            $scope.tagging = !$scope.tagging;
        };
        $scope.selectTag = function(name) {
            $scope.selectedTags[name] = !$scope.selectedTags[name];
            if($scope.selectedTags[name] && /^Div /.test(name)) {
                for(var i in $scope.selectedTags) {
                    if($scope.selectedTags.hasOwnProperty(i) && i !== name && /^Div /.test(i)) {
                        $scope.selectedTags[i] = false;
                    }
                }
            }
            buildTagList();
        };
        var buildTagList = function() {
            var list = [];
            for(var i in $scope.selectedTags)
                if($scope.selectedTags.hasOwnProperty(i) && $scope.selectedTags[i]) {
                    list.push(i);
                }
            $scope.tags = list.sort().join(',');
        };

        var doDefer = function() {
            $scope.showLoadingMessage("Deferring "+stockList.currentDesign.name+"...");
            server.deferStockCar(stockList.currentDesign.id, function() {
                $scope.hideLoadingMessage();
                removeFromList(stockList.currentDesign.id);
                stockList.currentDesign = null;
                $scope.returnToList();
            }, function() {
                $scope.hideLoadingMessage();
            });
        };
        var doApprove = function() {
            $scope.showLoadingMessage("Publishing "+stockList.currentDesign.name+"...");
            var tags = [];
            for(var i in $scope.selectedTags) {
                if($scope.selectedTags.hasOwnProperty(i) && $scope.selectedTags[i]) {
                    tags.push(i);
                }
            }
            if($scope.arena && $scope.division) tags.push("Div "+$scope.division);
            server.approveStockCar(stockList.currentDesign.id, currentCar, $scope.designerNotes,
                $scope.designerSignature, $scope.reviewerNotes, $scope.reviewerRating, tags, function(data) {
                    $scope.hideLoadingMessage();
                    removeFromList(stockList.currentDesign.id);
                    var name = stockList.currentDesign.name;
                    stockList.currentDesign = null;
                    $scope.returnToList();
                    if(data.page_count) $scope.alert("Generated "+data.page_count+"-page PDF for "+name);
                    else if(data.error) $scope.alert(data.error);
                }, function() {
                    $scope.hideLoadingMessage();
                });
        };

        $scope.deferDesign = function() {
            if($scope.reviewerRating || $scope.reviewerNotes) {
                $scope.confirm("You entered comments or a rating.  Really defer this design?", doDefer);
            } else doDefer();
        };

        $scope.approveDesign = function() {
            if(!$scope.sameUser && !$scope.reviewerRating && !$scope.reviewerNotes) {
                $scope.confirm("You did not enter comments or a rating.  Really approve this design?", doApprove);
            } else doApprove();
        };

        $scope.refreshList = function() {
            $scope.working = true;
            $rootScope.$broadcast('stock-car-list', [], null, null, "Refreshing stock car list...");
            reload();
        };

        $scope.returnToList = function() {
            $scope.zoom = false;
            $rootScope.$broadcast('stock-car-return');
        };

        $scope.returnToDesigner = function() {
            if (vehicle.car) {
                $scope.setDisplay('2D');
                $scope.openScreen("overview");
            }
            else $scope.createNewDesign();
        };

        var checkTechLevel = function(stockCar) {
            $scope.showLoadingMessage("Checking tech level...");
            server.loadDesign(stockCar.id, function(data) {
                $scope.hideLoadingMessage();
                if (!data.type || data.type === 'Car') {
                    currentCar = CW.createCar();
                } else if (data.type === 'Cycle')
                    currentCar = CW.createCycle();
                else if (data.type === 'Trike')
                    currentCar = CW.createTrike();
                else if (data.type === 'CarTrailer')
                    currentCar = CW.createCarTrailer();
                else if (data.type === 'TenWheeler')
                    currentCar = CW.createTenWheeler();
                else if (data.type === 'SemiTractor')
                    currentCar = CW.createSemiTractor();
                else if (data.type === 'SemiTrailer')
                    currentCar = CW.createSemiTrailer();
                else if (data.type === 'Bus')
                    currentCar = CW.createBus(data);
                else {
                    console.log("Unknown design type: " + data.type);
                    return;
                }
                CW.importCar(currentCar, data);
                var text = currentCar.textDescription(true);
                var totalCost = currentCar.totalCost + (currentCar.sidecar ? currentCar.sidecar.totalCost() : 0);
                var oldWeight = currentCar.weightUsed;
                var legal = currentCar.legal;
                $scope.illegal = !currentCar.legal;
                if (currentCar.techLevel === 'All') {
                    currentCar.techLevel = 'CWC';
                    if (currentCar.carrier) currentCar.carrier.techLevel = 'CWC';
                    currentCar.recalculate();
                    if (currentCar.legal !== legal || currentCar.totalCost + (currentCar.sidecar ? currentCar.sidecar.totalCost() : 0) !== totalCost ||
                        currentCar.weightUsed !== oldWeight || text !== currentCar.textDescription(true)) {
                        currentCar.techLevel = 'All';
                        if (currentCar.carrier) currentCar.carrier.techLevel = 'All';
                        currentCar.recalculate();
                        if (currentCar.legal !== legal || currentCar.totalCost + (currentCar.sidecar ? currentCar.sidecar.totalCost() : 0) !== totalCost ||
                            currentCar.weightUsed !== oldWeight || text !== currentCar.textDescription(true))
                            throw "Tech level test (CWC) resulted in unexpected change for " + data.designId + "!";
                    } else data.stock_tech_level = 'CWC';
                }
                if (currentCar.techLevel === 'CWC' && (currentCar.type === 'Car' || currentCar.type === 'Cycle' || currentCar.type === 'Trike')) {
                    currentCar.techLevel = 'Classic';
                    currentCar.recalculate();
                    if (currentCar.legal !== legal || currentCar.totalCost + (currentCar.sidecar ? currentCar.sidecar.totalCost() : 0) !== totalCost ||
                        currentCar.weightUsed !== oldWeight || text !== currentCar.textDescription(true)) {
                        currentCar.techLevel = 'CWC';
                        currentCar.recalculate();
                        if (currentCar.legal !== legal || currentCar.totalCost + (currentCar.sidecar ? currentCar.sidecar.totalCost() : 0) !== totalCost ||
                            currentCar.weightUsed !== oldWeight || text !== currentCar.textDescription(true))
                            throw "Tech level test (Classic) resulted in unexpected change for " + data.designId + "!";
                    }
                }
                stockCar.tech_level = currentCar.techLevel === 'All' ? "UACFH/Pyramid" :
                        currentCar.techLevel === 'CWC' ? "CWC 2.5" : currentCar.techLevel; // Classic or Military
            }, function() {
                $scope.hideLoadingMessage();
            });
        };
    };
    if(app.controllerProvider) app.controllerProvider.register('AdminReviewStockCtrl', ctrl);
    else app.controller('AdminReviewStockCtrl', ctrl);
})();
