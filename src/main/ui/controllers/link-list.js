/* global angular */
angular.module('carwars').
    controller('LinkListCtrl', function($scope, vehicle, model) {
        "use strict";
        var update = function () {
            $scope.links = model.currentLinkIsSmart ? vehicle.smartLinks() : vehicle.links();
            $scope.caption = model.currentLinkIsSmart ? "Smart Links" : "Links";
        };
        update();
        $scope.editWeaponLink = function(weapon) {
            model.currentWeapon.weapon = weapon;
            $scope.openScreen('weapon');
        };
        $scope.editLink = function(link) {
            model.currentLink = link;
            $scope.openScreen("link");
        };
        $scope.addLink = function() {
            model.currentLink = vehicle.addLink(model.currentLinkIsSmart);
            $scope.openScreen("link");
        };
    });
