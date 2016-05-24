/* global angular */
angular.module('carwars').
    constant('emailRegex', /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}$/i).
    controller('SaveCtrl', function($scope, vehicle, model, server, emailRegex) {
        "use strict";
        $scope.designName = vehicle.car.designName === "Unnamed Design" ? '' : vehicle.car.designName;
        $scope.authorName = server.userNameForSave() || '';
        $scope.authorEmail = server.userEmailForSave() || '';
        $scope.stockCar = !!$scope.designName && !!$scope.authorName && !!$scope.authorEmail && vehicle.isLegal();
        $scope.stockEnabled = $scope.stockCar;

        $scope.validate = function() {
            var wasEnabled = $scope.stockEnabled;
            $scope.stockEnabled = !!$scope.designName && !!$scope.authorName && !!$scope.authorEmail && vehicle.isLegal();
            if(!$scope.stockEnabled) $scope.stockCar = false;
            else if(!wasEnabled) $scope.stockCar = true;
        };

        $scope.$watch('designName', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                if(!$scope.designName) vehicle.car.designName = "Unnamed Design";
                else vehicle.car.designName = $scope.designName;
                $scope.setDesignName(vehicle.car.designName);
                $scope.validate();
            }
        });

        var save = function() {
            var id = vehicle.car.designId;
            $scope.showLoadingMessage("Saving "+vehicle.car.designName+"...");
            server.saveDesign(vehicle.car, $scope.authorName, $scope.authorEmail, $scope.stockCar, [], '', '', null,
                function() {
                    $scope.hideLoadingMessage();
                    $scope.setLastSavedID(id);
                    $scope.openScreen('confirmSave');
                }, function() {
                    $scope.hideLoadingMessage();
                    $scope.alert("Unable to save design.  Sorry!");
                });
        };
        var checkLegal = function() {
            if(vehicle.isLegal()) save();
            else $scope.confirm("Save even though the design is illegal?", save);
        };
        var openStock = function() {
            if(!vehicle.isLegal()) $scope.alert("Cannot submit illegal designs as stock cars!");
            else {
                model.stockConfig.authorEmail = $scope.authorEmail;
                model.stockConfig.authorName = $scope.authorName;
                $scope.openScreen('saveStock');
            }
        };
        var checkEmail = function(next) {
            if($scope.authorEmail && !emailRegex.test($scope.authorEmail))
                $scope.confirm("E-mail "+$scope.authorEmail+" looks unusual.\nContinue anyway?", next);
            else next();
        };
        $scope.saveDesign = function() {
            checkEmail(checkLegal);
        };

        $scope.configureStock = function() {
            checkEmail(openStock);
        };
    });
