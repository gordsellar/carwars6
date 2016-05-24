/* global angular, CW, LazyLoad */
angular.module('carwars').
    controller('LoginCtrl', function($scope, $timeout, vehicle, model, server, emailRegex) {
        "use strict";
        var success = false;
        $scope.visible = true;
        $scope.working = false;
        var update = function() {
            $scope.ready = $scope.email && $scope.password;
        };
        update();

        var loginSuccess = function() {
            success = true;
            $scope.working = false;
            $scope.visible = false;
            $scope.checkLogin();
            $timeout(function() {$scope.openScreen(model.loginToScreen);});
        };
        var loginComplete = function() {
            if(!server.isAdmin() || CW.adminLoaded) loginSuccess();
            else LazyLoad.js('js/admin.js', loginSuccess);
        };

        $scope.validate = function() {update();};
        $scope.login = function() {
            $scope.working = true;
            $scope.ready = false;
            server.login($scope.email, $scope.password, loginComplete,
                function() {
                    $scope.working = false;
                    $timeout(function() {alert("Login failed.  Please try again.");});
                });
        };

        var doReset = function() {
            $scope.showLoadingMessage("Sending password reset e-mail...");
            server.resetPassword($scope.email, function() {
                $scope.hideLoadingMessage();
                $scope.alert("E-mail sent.  Please check your mail for the next step.\n\n\n");
                $scope.openScreen('overview');
            }, function() {
                $scope.hideLoadingMessage();
                $scope.alert("Unable to reset password.\nMaybe this e-mail doesn't have an account?\nYou can try to Create an Account from the main menu.\n\n\n");
            });
        };
        var confirmReset = function() {
            $scope.confirm("Even if you remember your password,\nyou will not be able to sign in\nuntil you complete the reset process.\n\nReset your password now?\n\n\n", doReset);
        };
        var resetPassword = function() {
            if(emailRegex.test($scope.email)) confirmReset();
            else $scope.confirm("E-mail "+$scope.email+" looks unusual.\nContinue anyway?\n\n\n", confirmReset);
        };

        $scope.forgotPassword = function() {
            if($scope.email) {
                resetPassword();
            } else {
                $scope.prompt("Enter e-mail address to reset password for:", function(addr) {
                    $scope.email = addr;
                    resetPassword();
                });
            }
        };

        $scope.closing = function() {
            if(!success) {
                if(model.loginToScreen !== 'designList') $scope.openScreen(model.loginToScreen);
                else if (vehicle.car) $scope.openScreen("overview");
                else $scope.createNewDesign();
            }
        };
    });