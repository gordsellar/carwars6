/* global angular, CW */
angular.module('carwars').
    controller('TireCtrl', function($scope, vehicle, model) {
        "use strict";
        $scope.truck = model.currentTire.truck;
        var update = function() {
            var cwc = vehicle.techLevelIsCWC(), classic = vehicle.techLevelIsClassic();
            var tire = model.currentTire;
            $scope.name = tire.name;
            $scope.steelbeltedDisabled = tire.isPlasticore();
            $scope.slickDisabled = tire.truck || tire.isPlasticore() || ($scope.location === 'Front' && (vehicle.isDragster() || vehicle.isFunnyCar()))
                || (!tire.slick && (tire.radial || tire.offRoad || tire.snowTires || classic));
            $scope.radialDisabled = tire.truck || tire.isPlasticore() || (!tire.radial && (tire.slick || tire.offRoad));
            $scope.offRoadDisabled = tire.truck || tire.isPlasticore() || (!tire.offRoad && (tire.slick || tire.radial));
            $scope.snowTiresDisabled = !tire.snowTires && (tire.slick || classic || cwc);
            $scope.tireChainsDisabled = !tire.tireChains && (classic || cwc);
            $scope.steelbelted = tire.steelbelted;
            $scope.radial = tire.radial;
            $scope.slick = tire.slick;
            $scope.offRoad = tire.offRoad;
            $scope.snowTires = tire.snowTires;
            $scope.fireproof = tire.fireproof;
            $scope.tireChains = tire.tireChains;
            $scope.wheelguards = vehicle.wheelguardName(model.currentTire);
            $scope.wheelguardDisabled = vehicle.isRaceCar() && (
                    vehicle.car.body.name === CW.carBody.FORMULA_ONE_INDY.name ||
                    vehicle.car.body.name === CW.carBody.DRAGSTER.name ||
                    vehicle.car.body.name === CW.carBody.SPRINT.name
                );
            $scope.wheelhubs = vehicle.wheelhubName(model.currentTire);
            $scope.noHubs = /^No /.test($scope.wheelhubs);
            $scope.allText = vehicle.tireCount() === 2 && !vehicle.car.sidecar ? "Both" : "All "+
                (vehicle.tireCount()+(vehicle.car.sidecar ? vehicle.car.sidecar.tireCount : 0));
        };
        var init = function() {
            var tire = model.currentTire;
            $scope.location = vehicle.tireLocation(tire);
            $scope.same = vehicle.isCycle() || vehicle.car.backTiresSame();
            $scope.sameDisabled = vehicle.isCycle();
            $scope.sameVisible = vehicle.car.frontTires && !vehicle.isTenWheeler() && !vehicle.isSemiTractor()
                && !vehicle.isSemiTrailer() && !vehicle.isBus();
            update();
        };
        init();

        $scope.$watch('techLevel', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                update();
            }
        });
        $scope.$watch('name', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                vehicle.setTire(model.currentTire, newValue, $scope.same);
                model.redraw();
                update();
            }
        });
        $scope.nextGuard = function() {
            vehicle.nextWheelguard(model.currentTire);
            model.syncGuardsAndHubs();
            update();
        };
        $scope.previousGuard = function() {
            vehicle.previousWheelguard(model.currentTire);
            model.syncGuardsAndHubs();
            update();
        };
        $scope.nextHub = function() {
            vehicle.nextWheelhub(model.currentTire);
            model.syncGuardsAndHubs();
            update();
        };
        $scope.previousHub = function() {
            vehicle.previousWheelhub(model.currentTire);
            model.syncGuardsAndHubs();
            update();
        };
        $scope.$watch('steelbelted', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                model.currentTire.steelbelted = !!newValue;
                vehicle.syncTires(model.currentTire, $scope.same, newValue ? 'steelbelted' : null, "Steelbelted");
                update();
                model.redraw();
            }
        });
        $scope.$watch('radial', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                model.currentTire.radial = !!newValue;
                vehicle.syncTires(model.currentTire, $scope.same, newValue ? 'radial' : null, "Radial");
                update();
                model.redraw();
            }
        });
        $scope.$watch('slick', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                model.currentTire.slick = !!newValue;
                vehicle.syncTires(model.currentTire, $scope.same, newValue ? 'slick' : null, "Slick");
                update();
                model.redraw();
            }
        });
        $scope.$watch('offRoad', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                model.currentTire.offRoad = !!newValue;
                vehicle.syncTires(model.currentTire, $scope.same, newValue ? 'offRoad' : null, "Off-Road");
                update();
                model.redraw();
            }
        });
        $scope.$watch('snowTires', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                model.currentTire.snowTires = !!newValue;
                vehicle.syncTires(model.currentTire, $scope.same, newValue ? 'snowTires' : null, "Snow Tires");
                update();
                model.redraw();
            }
        });
        $scope.$watch('fireproof', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                model.currentTire.fireproof = !!newValue;
                vehicle.syncTires(model.currentTire, $scope.same, newValue ? 'fireproof' : null, "Fireproof");
                update();
                model.redraw();
            }
        });
        $scope.$watch('tireChains', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                model.currentTire.tireChains = !!newValue;
                vehicle.syncTires(model.currentTire, $scope.same, newValue ? 'tireChains' : null, "Tire Chains");
                update();
                model.redraw();
            }
        });
        $scope.$watch('same', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                vehicle.syncTires(model.currentTire, $scope.same);
                model.redraw();
                update();
            }
        });
    });
