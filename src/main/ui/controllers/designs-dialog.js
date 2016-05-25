/* global angular */
angular.module('carwars').
    controller('DesignListCtrl', function($scope, vehicle, server) {
        "use strict";
        var success = false;
        $scope.visible = true;
        $scope.working = true;
        $scope.edit = false;
        $scope.data = [
            {name: 'Division 5', designs: []},
            {name: 'Division 10', designs: []},
            {name: 'Division 15', designs: []},
            {name: 'Division 20', designs: []},
            {name: 'Division 25', designs: []},
            {name: 'Division 30', designs: []},
            {name: 'Buses', designs: []},
            {name: 'Semi Tractors', designs: []},
            {name: 'Semi Trailers', designs: []},
            {name: 'Ten Wheelers', designs: []},
            {name: 'Car Trailers', designs: []},
            {name: 'Other', designs: []}
        ];
        server.listDesigns(function(result) {
            $scope.data[0].designs.push.apply($scope.data[0].designs, result.div5);
            $scope.data[1].designs.push.apply($scope.data[1].designs, result.div10);
            $scope.data[2].designs.push.apply($scope.data[2].designs, result.div15);
            $scope.data[3].designs.push.apply($scope.data[3].designs, result.div20);
            $scope.data[4].designs.push.apply($scope.data[4].designs, result.div25);
            $scope.data[5].designs.push.apply($scope.data[5].designs, result.div30);
            $scope.data[6].designs.push.apply($scope.data[6].designs, result.bus);
            $scope.data[7].designs.push.apply($scope.data[7].designs, result.semiTractor);
            $scope.data[8].designs.push.apply($scope.data[8].designs, result.semiTrailer);
            $scope.data[9].designs.push.apply($scope.data[9].designs, result.tenWheeler);
            $scope.data[10].designs.push.apply($scope.data[10].designs, result.carTrailer);
            $scope.data[11].designs.push.apply($scope.data[11].designs, result.other);
            $scope.working = false;
        }, function() {
            alert("Unable to load designs!\nPlease log out and log back in and try again.");
            $scope.visible = false;
        });
        $scope.loadDesign = function(design) {
            success = true;
            $scope.visible = false;
            $scope.loadCar(design.name, design.id);
        };
        $scope.deleteDesign = function(design) {
            $scope.confirm("Delete design " + design.name + "?", function() {
                design.deleting = true;
                server.deleteDesign(design.id, function () {
                    for (var i = 0; $scope.data.length; i++)
                        for (var j = 0; j < $scope.data[i].designs.length; j++)
                            if ($scope.data[i].designs[j] === design) {
                                $scope.data[i].designs.splice(j, 1);
                                return;
                            }
                }, function () {
                    design.deleting = false;
                    $scope.alert("Unable to delete design.");
                });
            });
        };

        $scope.closing = function() {
            if(!success) {
                if (vehicle.car) $scope.openScreen("overview");
                else $scope.createNewDesign();
            }
        };
    });