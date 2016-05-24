/* global angular, CW */
angular.module('carwars').
    controller('ConfirmAccountCtrl', function($scope, $timeout, vehicle, server) {
        "use strict";
        var success = false;
        var key = null;
        $scope.visible = false;
        $scope.working = false;
        $scope.email = null;
        var update = function() {
            $scope.ready = $scope.name && $scope.password;
        };
        update();

        $scope.validate = function() {update();};
        $scope.confirmAccount = function() {
            $scope.working = true;
            $scope.ready = false;
            server.confirmAccount($scope.email, $scope.name, $scope.password, key,
                function() {
                    success = true;
                    $scope.working = false;
                    $scope.visible = false;
                    $scope.checkLogin();
                    $timeout(function() {$scope.openScreen('designList');});
                },
                function() {
                    $scope.working = false;
                    $timeout(function() {alert("Confirmation failed.  Has this account already been activated?");});
                });
        };

        var closeScreen = function() {
            if (vehicle.car) $scope.openScreen("overview");
            else $scope.createNewDesign();
        };

        $scope.closing = function() {
            if(!success) closeScreen();
        };

        $scope.showLoadingMessage("Loading account details...");
        server.loadAccountConfirm(CW.preload.confirm, function(data) {
            $scope.hideLoadingMessage();
            $scope.email = data.email;
            $scope.name = data.name;
            key = CW.preload.confirm;
            delete CW.preload.confirm;
            $scope.visible = true;
        }, function() {
            $scope.hideLoadingMessage();
            $timeout(function() {alert("Confirmation failed.  Has this account already been activated?");});
            closeScreen();
        });
    });