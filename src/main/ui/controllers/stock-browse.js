/* global angular, CW */
angular.module('carwars').
    constant('nonAADATags', [
        ["Gas", "Electric", "Anti-Ped"],
        ["Tire Shot", "Incendiary", "Rammer"],
        ["Racer", "Sporty", "Off-Road"],
        ["Everyday", "Police", "Emergency"],
        ["Bandit", "Commercial", "Courier"],
        ["Convoy", "Front Man", "Tail-End"],
        ["Cargo", "Passenger", "Executive"]
    ]).
    constant('aadaTags', [
        ["Div 5", "Div 7.5", "Div 10"],
        ["Div 15", "Div 20", "Div 25"],
        ["Div 30", "Div 40", "Div 60"],
        ["Div 80", "Div 100"]
    ]).
    controller('StockBrowseCtrl', function($scope, $rootScope, $timeout,
                                           vehicle, stockList, aadaTags, nonAADATags) {
        "use strict";
        var x, oldDisplay, tag;
        $scope.car = !!vehicle.car;
        $scope.searchParams = {
            body: {},
            tags: {},
            encumbrance: null,
            techLevel: null
        };
        $scope.browseMode = !stockList.nameSearch;
        $scope.nameReady = false;
        stockList.adminReview = false;

        var selectTag = function(tag) {
            var i, found = false;
            for(i=0; i<nonAADATags.length; i++) {
                if(nonAADATags[i].indexOf(tag) > -1) {
                    $scope.searchParams.tags[tag] = true;
                    found = true;
                    break;
                }
            }
            if(!found) {
                for (i = 0; i < aadaTags.length; i++) {
                    if (aadaTags[i].indexOf(tag) > -1) {
                        $scope.searchParams.tags[tag] = true;
                        found = true;
                        break;
                    }
                }
            }
        };

        $scope.bodyOptions = [
            ['Car', 'Car Trailer'],
            ['Cycle','Trike'],
            ['Ten Wheeler', 'Bus'],
            ['Tractor', 'Trailer']
        ];
        $scope.aadaOptions = aadaTags;
        $scope.tagOptions = nonAADATags;
        $scope.working = false;
        var pending;

        if($scope.mainDisplay.length === 2) oldDisplay = $scope.mainDisplay;
        else if($scope.mainDisplay === 'stl') oldDisplay = '3d';
        $scope.setDisplay('StockList');

        var search = function() {
            var i, body = [], tags = [], c = $scope.searchParams;
            if(pending) pending.resolve("Canceled");
            for(i in c.body) {
                if(c.body.hasOwnProperty(i) && c.body[i]) {
                    i = i.replace(' ', '');
                    if(i === 'Tractor' || i === 'Trailer') i = 'Semi'+i;
                    body.push(i);
                }
            }
            for(i in c.tags) {
                if(c.tags.hasOwnProperty(i) && c.tags[i]) {
                    tags.push(i);
                }
            }
            buildTagText(c);
            if(stockList.setCriteria(body, tags, c.encumbrance, c.techLevel)) {
                executeSearch();
            } else {
                showRecent();
            }
        };

        var buildTagText = function(criteria) {
            var i, tagText = '', divText = '';
            if(Array.isArray(criteria.tags)) {
                for(i=0; i<criteria.tags.length; i++) {
                    if (/^Div /.test(criteria.tags[i])) {
                        if (divText.length > 0) divText += ',';
                        divText += criteria.tags[i];
                    } else {
                        if (tagText.length > 0) tagText += ',';
                        tagText += criteria.tags[i];
                    }
                }
            } else {
                for (i in criteria.tags) {
                    if (criteria.tags.hasOwnProperty(i) && criteria.tags[i]) {
                        if (/^Div /.test(i)) {
                            if (divText.length > 0) divText += ',';
                            divText += i;
                        } else {
                            if (tagText.length > 0) tagText += ',';
                            tagText += i;
                        }
                    }
                }
            }
            $scope.tagText = tagText;
            $scope.divText = divText;
        };

        var nextResults = function() {
            stockList.offset += 20;
            executeSearch();
        };
        var previousResults = function() {
            stockList.offset -= 20;
            executeSearch();
        };
        var executeSearch = function() {
            if(pending) pending.resolve("Canceled");
            $scope.working = true;
            pending = stockList.executeSearch(showResult, searchFailed);
        };
        var showRecent = function() {
            if(pending) pending.resolve("Canceled");
            $scope.working = true;
            pending = stockList.searchRecent(showResult, searchFailed);
        };

        var showResult = function (data) {
            pending = null;
            $scope.working = false;
            if(stockList.nameSearch) {
                if (data.designs.length > 0) $scope.nameSearchVisible = false;
                else $scope.alert("No matching designs found.");
            }
            var latest = !stockList.hasCriteria();
            $rootScope.$broadcast('stock-car-list', data.designs,
                    stockList.offset > 0 ? previousResults : null,
                    data.more ? nextResults : null,
                    data.designs.length === 0 ? "No matching results" :
                        stockList.nameSearch ? "Name Search Results" :
                            latest ? "Recent Stock Designs" : "Search Results");
        };
        var searchFailed = function () {
            pending = null;
            $scope.working = false;
        };

        $scope.searchByName = function() {
            stockList.setName($scope.name);
            executeSearch();
        };

        $scope.toggle = function(name) {
            if($scope[name]) $scope[name] = false;
            else {
                $scope.body = false;
                $scope.aada = false;
                $scope.tags = false;
                $scope.encumbrance = false;
                $scope.cost = false;
                $scope[name] = true;
            }
        };

        $scope.selectBody = function(name) {
            $scope.searchParams.body[name] = !$scope.searchParams.body[name];
            if($scope.searchParams.body[name]) {
                for(var i in $scope.searchParams.body) {
                    if($scope.searchParams.body.hasOwnProperty(i) && i !== name) {
                        $scope.searchParams.body[i] = false;
                    }
                }
                $scope.bodyText = name;
            } else $scope.bodyText = '';
            search();
        };
        $scope.selectTag = function(name) {
            $scope.searchParams.tags[name] = !$scope.searchParams.tags[name];
            if($scope.searchParams.tags[name] && /^Div /.test(name)) {
                for(var i in $scope.searchParams.tags) {
                    if($scope.searchParams.tags.hasOwnProperty(i) && i !== name && /^Div /.test(i)) {
                        $scope.searchParams.tags[i] = false;
                    }
                }
            }
            search();
        };
        $scope.selectEncumbrance = function(name) {
            $scope.searchParams.encumbrance = name === 'Any' ? null : name;
            search();
        };
        $scope.selectTechLevel = function(name) {
            if($scope.searchParams.techLevel === name) $scope.searchParams.techLevel = null;
            else $scope.searchParams.techLevel = name;
            search();
        };

        $scope.newNameSearch = function() {
            $scope.name = '';
            $scope.nameReady = false;
            $scope.working = false;
            $scope.nameSearchVisible = true;
            $timeout(function() {
                document.querySelector('#Controls div.ng-modal-dialog input[type=search]').focus();
            });
        };

        $scope.toDesigner = function() {
            $scope.setDisplay(oldDisplay ? oldDisplay.toUpperCase() : '2D');
            $scope.openScreen('overview');
        };

        $scope.$on('$routeChangeStart', function() {
            if(pending) pending.resolve("Canceled");
        });

        $scope.toggleMode = function() {
            stockList.results = null;
            $scope.browseMode = !$scope.browseMode;
            if($scope.browseMode) {
                stockList.setCriteria([], [], null, null);
                $scope.searchParams.body = {};
                $scope.searchParams.tags = {};
                $scope.searchParams.encumbrance = null;
                $scope.searchParams.techLevel = null;
                $scope.tagText = '';
                $scope.divText = '';
                $scope.bodyText = '';
                showRecent();
            } else {
                $scope.newNameSearch();
            }
        };

        $scope.nameSearchClosing = function() {
            if(!stockList.checkExistingResults()) {
                if (vehicle.car) $scope.toDesigner();
                else $scope.createNewDesign();
            }
        };

        // TODO: CW.preload.list
        if(CW.preload.tag) {
            tag = CW.preload.tag;
            delete CW.preload.tag;
            if(tag === 'Classic' || tag === 'CWC' || tag === 'UACFH')
                $scope.searchParams.techLevel = tag;
            else if(tag === 'Car' || tag === 'Car Trailer' || tag === 'Cycle' || tag === 'Trike' ||
                tag === 'Ten Wheeler' || tag === 'Bus' || tag === 'Tractor' || tag === 'Trailer') {
                $scope.searchParams.body[tag] = true;
                $scope.bodyText = tag;
            } else
                selectTag(tag);
            search();
        } else if(CW.preload.name) {
            $scope.name = CW.preload.name;
            delete CW.preload.name;
            $scope.searchByName();
        } else {
            // If currently on Name Search
            // Case 1: here for the first time
            // Case 2: returning from Zoom
            // Case 3: returning from an existing design, previously on Name Search
            // Case 4: returning from an existing design, previously on Browse
            if(stockList.nameSearch) {
                if(stockList.checkExistingResults()) {
                    if (oldDisplay) $timeout(function () {showResult(stockList.results);});
                } else
                    $scope.newNameSearch();
            } else {
            // If currently on Browse
            // Case 1: here for the first time or switching from Name Search
            // Case 2: returning from Zoom
            // Case 3: returning from an existing design, previously on Name Search
            // Case 4: returning from an existing design, previously on Browse
                if(stockList.checkExistingResults()) {
                    // If not already showing the stock list screen
                    if(oldDisplay) $timeout(function () {showResult(stockList.results);});
                    for(x=0; x<stockList.criteria.tags.length; x++)
                        $scope.searchParams.tags[stockList.criteria.tags[x]] = true;
                    buildTagText(stockList.criteria);
                    for(x=0; x<stockList.criteria.body.length; x++) {
                        tag = stockList.criteria.body[x].replace(/^Semi/, '');
                        tag = tag.substr(0, 1)+tag.substr(1).replace(/[A-Z]/, " $&");
                        $scope.searchParams.body[tag] = true;
                        $scope.bodyText = tag;
                    }
                    $scope.searchParams.encumbrance = stockList.criteria.encumbrance;
                    $scope.searchParams.techLevel = stockList.criteria.techLevel;
                } else {
                    stockList.setCriteria([], [], null, null);
                    showRecent();
                }
            }
        }
    });
