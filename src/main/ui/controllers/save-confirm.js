/* global angular */
angular.module('carwars').
    controller('ConfirmSaveCtrl', function($scope, $window, vehicle, model, server) {
        "use strict";
        $scope.designName = vehicle.car.designName;
        $scope.designURL = document.location.protocol+"//"+document.location.host+"/load/"+$scope.lastSavedID;
        $scope.email = server.lastSaveAuthorEmail();

        var pdfURL = null;
        $scope.downloadPDF = function() {
            $scope.showLoadingMessage("Generating PDF...");
            server.generatePDF(vehicle.car, $scope.lastSavedID, function(data) {
                $scope.hideLoadingMessage();
                if(!$window.open(data.url, '_blank')) {
                    pdfURL = data.url;
                    $scope.popupBlocked = true;
                }
            }, function() {
                $scope.hideLoadingMessage();
                $scope.alert("Unable to generate PDF.  Sorry.  It makes me sad too.");
            });
        };

        $scope.openBlockedPDF = function() {
            $scope.popupBlocked = false;
            $window.open(pdfURL, '_blank');
            pdfURL = null;
        };
    });
