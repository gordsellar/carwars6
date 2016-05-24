/* global angular, CW */
angular.module('carwars').
    controller('LoadedMenuCtrl', function($scope, server) {
        "use strict";
        $scope.working = false;
        $scope.userName = server.currentUserName();
        $scope.admin = server.isAdmin();

        $scope.menuLogout = function() {
            $scope.working = true;
            $scope.logout(function() {
                $scope.working = false;
                $scope.admin = false;
                $scope.userName = null;
            });
        };
    });