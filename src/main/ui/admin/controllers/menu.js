/* global angular */
(function() {
    "use strict";
    var app = angular.module('carwars');
    var ctrl = function($scope, server) {
        $scope.pendingCount = '...';
        server.countPendingStockCars(function(data) {
            $scope.pendingCount = data.count;
        }, function() {
            $scope.pendingCount = '??';
        });
    };
    if(app.controllerProvider) app.controllerProvider.register('AdminMenuCtrl', ctrl);
    else app.controller('AdminMenuCtrl', ctrl);
})();
