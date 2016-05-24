/* global angular */
angular.module('carwars').
    controller('LinkCtrl', function($scope, vehicle, model) {
        "use strict";
        var update = function () {
            $scope.caption = model.currentLinkIsSmart ? "Smart Link" : "Link";
            $scope.items = vehicle.linkableItems(model.currentLink);
            // TODO: more items than will fit on screen
        };
        update();
        $scope.removeLink = function() {
            vehicle.removeLink(model.currentLink);
            model.currentLink = null;
            $scope.openScreen("linkList");
        };
        $scope.checkbox = function(item) {
            if(item.present) {
                model.currentLink.addItem(item.item);
            } else {
                model.currentLink.removeItem(item.item);
            }
        };
    });
