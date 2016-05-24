/* global angular */
angular.module('carwars').
    controller('CreateAccountCtrl', function($scope, $timeout, vehicle, server) {
        "use strict";
        $scope.visible = true;
        $scope.working = false;
        var update = function() {
            $scope.ready = !!$scope.email;
        };
        update();

        $scope.validate = function() {update();};
        $scope.createAccount = function() {
            $scope.working = true;
            $scope.ready = false;
            server.createAccount($scope.email,
                function() {
                    $scope.working = false;
                    $scope.visible = false;
                    $timeout(function() {
                        alert("E-mail sent.  Please check your mail for the next step.");
                    });
                },
                function() {
                    $scope.working = false;
                    $timeout(function() {alert("Unable to create account.  Maybe you already have one?\nYou can try to Sign In and if needed use the Forgot Password link there.\n\n\n");});
                });
        };

        $scope.closing = function() {
            if (vehicle.car) $scope.openScreen("overview");
            else $scope.createNewDesign();
        };
    });