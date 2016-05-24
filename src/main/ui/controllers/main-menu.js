/* global angular, CW */
angular.module('carwars').
    controller('MainMenuCtrl', function($scope, $timeout, $controller, server, stockList) {
        "use strict";
        $scope.visible = true;
        $scope.working = false;
        $scope.userName = server.currentUserName();
        $scope.admin = CW.adminLoaded && server.currentUser() === 'ammulder@alumni.princeton.edu';
        $scope.reviewer = CW.adminLoaded && !$scope.admin && server.isAdmin();
        var hasNext = false;

        $scope.menuNewDesign = function() {
            $scope.visible = false;
            hasNext = true;
            $scope.createNewDesign();
        };

        $scope.menuSaveDesign = function() {
            hasNext = true;
            $scope.openScreen('save');
        };

        $scope.menuListDesigns = function() {
            $scope.visible = false;
            hasNext = true;
            $scope.listDesigns();
        };

        $scope.menuSearchStock = function() {
            $scope.visible = false;
            hasNext = true;
            stockList.setNameSearch(true);
            $scope.openScreen('stock');
        };

        $scope.menuBrowseStock = function() {
            $scope.visible = false;
            hasNext = true;
            stockList.setNameSearch(false);
            $scope.openScreen('stock');
        };

        $scope.menuCreateAccount = function() {
            $scope.visible = false;
            hasNext = true;
            $scope.openScreen('createAccount');
        };

        $scope.menuLogout = function() {
            $scope.working = true;
            $scope.logout(function() {
                $scope.working = false;
                $scope.reviewer = false;
                $scope.admin = false;
            });
        };

        $scope.closeMenu = function() {
            if(!hasNext) $scope.openScreen('overview');
        };
    });
