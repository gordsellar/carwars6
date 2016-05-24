/* global angular, CWD, CW3D */
angular.module('carwars').
    controller('StockReviewCtrl', function($scope, $rootScope, aadaTags, nonAADATags, stockList, model, server) {
        "use strict";

        $scope.tagOptions = aadaTags.concat(nonAADATags);
        $scope.selectedTags = {};
        $scope.loggedIn = !!server.currentUser();
        $scope.sameAsAuthor = server.currentUser() === stockList.currentDesign.author_email;
        $scope.designId = stockList.currentDesign.id;
        $scope.stockConfirmed = stockList.currentDesign.stock_confirmed;
        $scope.shareVisible = false;
        $scope.changed = false;

        var i, myReview = null, originalTags = [];
        for (i = 0; i < stockList.currentDesign.ratings.length; i++)
            if (stockList.currentDesign.ratings[i].current)
                myReview = stockList.currentDesign.ratings[i];
        $scope.reviewed = !!myReview;

        if(myReview) {
            $scope.comments = myReview.comments;
            angular.forEach(myReview.tags, function(tag) {
                $scope.selectedTags[tag] = true;
                originalTags.push(tag);
            });
            originalTags = originalTags.sort().join(',');
            if(myReview.rating && !$scope.sameAsAuthor) $scope.rating = myReview.rating;
        }
        var changeWatch = function(newValue, oldValue) {
            if(newValue !== oldValue) {
                checkChanged();
            }
        };
        $scope.$watch('comments', changeWatch);
        $scope.$watch('rating', changeWatch);
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
            checkChanged();
        };
        var buildTagList = function() {
            var list = [];
            for(var i in $scope.selectedTags)
                if($scope.selectedTags.hasOwnProperty(i) && $scope.selectedTags[i]) {
                    list.push(i);
                }
            $scope.tags = list.sort().join(',');
        };
        buildTagList();

        var checkChanged = function() {
            if(myReview) {
                $scope.changed = $scope.comments !== myReview.comments || $scope.rating !== myReview.rating ||
                    $scope.tags !== originalTags;
            } else {
                $scope.changed = $scope.comments || $scope.rating || $scope.tags;
            }
        };

        $scope.editDesign = function() {
            $scope.loadCar(stockList.currentDesign.name, stockList.currentDesign.id);
        };

        $scope.shareDesign = function() {
            $scope.designName = stockList.currentDesign.name;
            $scope.designText = stockList.currentDesign.name+" -- "+stockList.currentDesign.summary;
            $scope.designURL = server.loadDesignURL(stockList.currentDesign.id);
            $scope.designPDF = stockList.currentDesign.stock_confirmed ? server.pdfURL(stockList.currentDesign.id) : null;
            $scope.shareVisible = true;
        };

        $scope.returnToList = function() {
            var close = function() {
                $scope.openScreen('stock');
                $rootScope.$broadcast('stock-car-return');
            };
            if($scope.changed) {
                save(close);
            } else close();
        };

        $scope.login = function() {
            model.loginToScreen = 'stockReview';
            $scope.openScreen('login');
        };

        var save = function(onComplete) {
            var tags = [];
            angular.forEach($scope.selectedTags, function(value, key) {
                if(value) tags.push(key);
            });
            $scope.showLoadingMessage("Saving your review...");
            server.saveReview(stockList.currentDesign.id, $scope.rating, $scope.comments, tags.sort(), function(data) {
                $scope.hideLoadingMessage();
                stockList.currentDesign.average_rating = data.average;
                stockList.currentDesign.tags = data.tags;
                stockList.currentDesign.tagList = data.tags.map(function(tag) {return tag.tag;}).join(", ");
                if(!myReview) {
                    myReview = {email: server.currentUser(), user: server.currentUserName(), current: true};
                    stockList.currentDesign.ratings.push(myReview);
                }
                myReview.comments = $scope.comments;
                myReview.rating = $scope.rating;
                myReview.tags = tags;
                originalTags = tags.join(',');
                $scope.changed = false;
                $scope.reviewed = true;
                if(onComplete) onComplete();
            }, function() {
                $scope.hideLoadingMessage();
                $scope.alert("Unable to save review.  Sorry!");
                if(onComplete) onComplete();
            });
        };

        $scope.saveReview = function() {
            save();
        };
    });
