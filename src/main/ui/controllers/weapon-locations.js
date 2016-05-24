/* global angular */
angular.module('carwars').
    controller('WeaponLocationsCtrl', function($scope, vehicle) {
        "use strict";
        var carrier = false;
        var topUnder = false;
        $scope.oversize = vehicle.hasOversizeWeaponFacings();
        var update = function() {
            var i, total;
            $scope.bodyMounts = vehicle.bodyWeaponList(carrier);
            $scope.cornerMounts = vehicle.cornerWeaponList(carrier);
            if($scope.oversize) {
                if(vehicle.isCarTrailer()) { // Don't toggle controls based on corner/top setting
                    total = 0;
                    for(i=0; i<$scope.bodyMounts.length; i++)
                        if($scope.bodyMounts[i].contents.length > 0) ++total;
                    for(i=0; i<$scope.cornerMounts.length; i++)
                        if($scope.cornerMounts[i].contents.length > 0) ++total;
                    $scope.trailerOverflow = total > 6;
                } // Now hide various items
                if (topUnder) $scope.cornerMounts = [];
                else for (i = $scope.bodyMounts.length - 1; i >= 0; i--)
                    if (/Top|Underbody/.test($scope.bodyMounts[i].location))
                        $scope.bodyMounts.splice(i, 1);
            }
            $scope.sidecarMounts = vehicle.sidecarWeaponList();
            $scope.bodyTitle = vehicle.isTenWheeler() ? carrier ? vehicle.car.carrier.isFlatbed() ? "Armored Box" : "Carrier" : "Cab" : vehicle.isFlatbed() ? "Armored Box" : "Body";
            $scope.cornerTitle = vehicle.isTenWheeler() ? carrier ? "Carrier " : "Cab " : "";
            $scope.tenWheeler = vehicle.isTenWheeler() ? carrier ? "Cab" : "Carrier" : null;
            $scope.topUnderName = topUnder ? "Corner Mounts" : "Top & Underbody";
            $scope.topUnderAbbv = topUnder ? "Corner" : "Top/Und.";
        };
        update();
        $scope.showWeapons = function(location) {
            if(/Sidecar/.test(location))
                location = location.replace(/\s/g, '');
            else
                location = location.replace(/ Front|\s/g, '');
            $scope.processClick("edit"+(carrier ? "Carrier" : "")+location+"Weapons");
        };
        $scope.toggleCarrier = function() {
            carrier = !carrier;
            update();
        };
        $scope.toggleTopUnder = function() {
            topUnder = !topUnder;
            update();
        };
    });
