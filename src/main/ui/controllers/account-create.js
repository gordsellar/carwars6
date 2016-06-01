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
                    alert("E-mail sent.  Please check your mail for the next step.");
                },
                function(errorResp) {
                    $scope.working = false;
                    if(errorResp.status === 403) {
                        alert("Unable to create account.  Maybe you already have one?\nYou can try to Sign In and if needed use the Forgot Password link there.\n\n\n");
                    } else {
                        alert("Unable to create account.  Please reload the page and try again.");
                    }
                });
        };

        $scope.closing = function() {
            if (vehicle.car) $scope.openScreen("overview");
            else $scope.createNewDesign();
        };
    });