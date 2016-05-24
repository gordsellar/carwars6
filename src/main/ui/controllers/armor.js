/* global angular */
angular.module('carwars').
    controller('ArmorCtrl', function($scope, vehicle, model, distributor) {
        "use strict";
        var target, alternate = model.armorAlternate;
        model.armorAlternate = false;
        var armorName = function(type, absent) {
            return type ? type.name : absent;
        };
        var update = function() {
            var flatbedCarrier = (alternate && vehicle.isTenWheeler() && vehicle.car.carrier.isFlatbed());
            target = alternate ? vehicle.isCycle() ? vehicle.car.sidecar : vehicle.car.carrier : vehicle.car;
            $scope.plasticName = armorName(vehicle.plasticArmorType(target), "No Plastic");
            $scope.metalName = armorName(vehicle.metalArmorType(target), "No Metal");
            $scope.noArmor = false;
            $scope.alternate = alternate ? vehicle.isCycle() ? "Cycle" : "Cab" :
                    vehicle.isCycle() && vehicle.car.sidecar ? "Sidecar" : vehicle.isTenWheeler() ? "Carrier" : null;
            if(vehicle.compositeArmorDefined(target) || vehicle.isFlatbed() || flatbedCarrier || vehicle.isSemiTrailer()) {
                $scope.autoHide = true;
            } else if(vehicle.plasticArmorType(target)) {
                $scope.autoType = "Plastic";
                $scope.autoHide = false;
            } else if(vehicle.metalArmorType(target)) {
                $scope.autoType = "Metal";
                $scope.autoHide = false;
            } else {
                $scope.autoHide = true;
                $scope.noArmor = true;
            }
            if(!$scope.autoHide)
                $scope.autoPoints = distributor.calculateArmorDistribution(alternate && vehicle.isCycle(), alternate && vehicle.isTenWheeler()).total();
            if(vehicle.isFlatbed() || flatbedCarrier)
                $scope.vehicle = "Armored Box";
            else
                $scope.vehicle = (alternate ? vehicle.isCycle() ? "Sidecar": "Carrier" :
                    vehicle.isCar() ? "Car" : vehicle.isCycle() ? "Cycle" : vehicle.isTrike() ? "Trike" :
                    vehicle.isTenWheeler() ? "Cab" : vehicle.isCarTrailer() ? "Trailer" :
                        vehicle.isBus() ? "Bus" : vehicle.isSemiTractor() ? "Semi Tractor" :
                            vehicle.isSemiTrailer() ? "Semi Trailer" : "FIXME")
                    +" Armor Distribution";
            $scope.cycle = vehicle.isCycle() && !alternate;
            $scope.sloped = vehicle.car.sloped;
            $scope.oversize = vehicle.isOversize();
            $scope.dual = $scope.oversize && vehicle.car.isDualFlatbed();
            $scope.composite = vehicle.compositeArmorDefined(target);
            if(vehicle.compositeArmorDefined(target)) {
                $scope.frontPlastic = target.frontArmor.plasticPoints;
                $scope.frontMetal = target.frontArmor.metalPoints;
                $scope.backPlastic = target.backArmor.plasticPoints;
                $scope.backMetal = target.backArmor.metalPoints;
                $scope.leftPlastic = target.leftArmor.plasticPoints;
                $scope.leftMetal = target.leftArmor.metalPoints;
                $scope.rightPlastic = target.rightArmor.plasticPoints;
                $scope.rightMetal = target.rightArmor.metalPoints;
                $scope.topPlastic = target.topArmor.plasticPoints;
                $scope.topMetal = target.topArmor.metalPoints;
                $scope.underbodyPlastic = target.underbodyArmor.plasticPoints;
                $scope.underbodyMetal = target.underbodyArmor.metalPoints;
                if(vehicle.isFlatbed() || flatbedCarrier) {
                    $scope.flatbedPlastic = target.flatbedArmor.plasticPoints;
                    $scope.flatbedMetal = target.flatbedArmor.metalPoints;
                }
                if(vehicle.isOversize()) {
                    if (vehicle.isFlatbed()) {
                        $scope.flatbedBackPlastic = target.flatbedBackArmor.plasticPoints;
                        $scope.flatbedBackMetal = target.flatbedBackArmor.metalPoints;
                        if($scope.dual) {
                            $scope.upperFlatbedPlastic = target.upperFlatbedArmor.plasticPoints;
                            $scope.upperFlatbedMetal = target.upperFlatbedArmor.metalPoints;
                            $scope.upperFlatbedBackPlastic = target.upperFlatbedBackArmor.plasticPoints;
                            $scope.upperFlatbedBackMetal = target.upperFlatbedBackArmor.metalPoints;
                        }
                    } else {
                        $scope.leftBackPlastic = target.leftBackArmor.plasticPoints;
                        $scope.leftBackMetal = target.leftBackArmor.metalPoints;
                        $scope.rightBackPlastic = target.rightBackArmor.plasticPoints;
                        $scope.rightBackMetal = target.rightBackArmor.metalPoints;
                        $scope.topBackPlastic = target.topBackArmor.plasticPoints;
                        $scope.topBackMetal = target.topBackArmor.metalPoints;
                        $scope.underbodyBackPlastic = target.underbodyBackArmor.plasticPoints;
                        $scope.underbodyBackMetal = target.underbodyBackArmor.metalPoints;
                    }
                }
            } else if(vehicle.plasticArmorType(target)) {
                $scope.frontSingle = target.frontArmor.plasticPoints;
                $scope.leftSingle = target.leftArmor.plasticPoints;
                $scope.rightSingle = target.rightArmor.plasticPoints;
                $scope.backSingle = target.backArmor.plasticPoints;
                $scope.topSingle = target.topArmor.plasticPoints;
                $scope.underbodySingle = target.underbodyArmor.plasticPoints;
                if(vehicle.isFlatbed() || flatbedCarrier) $scope.flatbedSingle = target.flatbedArmor.plasticPoints;
                if(vehicle.isOversize()) {
                    if(vehicle.isFlatbed()) {
                        $scope.flatbedBackSingle = target.flatbedBackArmor.plasticPoints;
                        if($scope.dual) {
                            $scope.upperFlatbedSingle = target.upperFlatbedArmor.plasticPoints;
                            $scope.upperFlatbedBackSingle = target.upperFlatbedBackArmor.plasticPoints;
                        }
                    } else {
                        $scope.leftBackSingle = target.leftBackArmor.plasticPoints;
                        $scope.rightBackSingle = target.rightBackArmor.plasticPoints;
                        $scope.topBackSingle = target.topBackArmor.plasticPoints;
                        $scope.underbodyBackSingle = target.underbodyBackArmor.plasticPoints;
                    }
                }
            } else {
                $scope.frontSingle = target.frontArmor.metalPoints;
                $scope.leftSingle = target.leftArmor.metalPoints;
                $scope.rightSingle = target.rightArmor.metalPoints;
                $scope.backSingle = target.backArmor.metalPoints;
                $scope.topSingle = target.topArmor.metalPoints;
                $scope.underbodySingle = target.underbodyArmor.metalPoints;
                if(vehicle.isFlatbed() || flatbedCarrier) $scope.flatbedSingle = target.flatbedArmor.metalPoints;
                if(vehicle.isOversize()) {
                    if(vehicle.isFlatbed()) {
                        $scope.flatbedBackSingle = target.flatbedBackArmor.metalPoints;
                        if($scope.dual) {
                            $scope.upperFlatbedSingle = target.upperFlatbedArmor.metalPoints;
                            $scope.upperFlatbedBackSingle = target.upperFlatbedBackArmor.metalPoints;
                        }
                    } else {
                        $scope.leftBackSingle = target.leftBackArmor.metalPoints;
                        $scope.rightBackSingle = target.rightBackArmor.metalPoints;
                        $scope.topBackSingle = target.topBackArmor.metalPoints;
                        $scope.underbodyBackSingle = target.underbodyBackArmor.metalPoints;
                    }
                }
            }
            $scope.flatbed = vehicle.isFlatbed() || flatbedCarrier;
        };
        update();
        $scope.nextPlasticType = function() {
            vehicle.nextPlasticArmor(target);
            update();
        };
        $scope.previousPlasticType = function() {
            vehicle.previousPlasticArmor(target);
            update();
        };
        $scope.nextMetalType = function() {
            vehicle.nextMetalArmor(target);
            update();
        };
        $scope.previousMetalType = function() {
            vehicle.previousMetalArmor(target);
            update();
        };
        $scope.$watch('sloped', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                vehicle.car.sloped = newValue;
                vehicle.recalculate();
            }
        });
        $scope.distributeArmor = function() {
            distributor.distributeArmor(alternate && vehicle.isCycle(), alternate && vehicle.isTenWheeler());
            vehicle.recalculate();
            update();
        };
        var updateSingle = function(position, newValue, oldValue) {
            if(newValue === oldValue) return;
            var type = vehicle.plasticArmorType(target) ? "plastic" : "metal";
            target[position+"Armor"][type+"Points"] = parseInt(newValue ? newValue : 0);
            vehicle.recalculate();
            update();
        };
        var updatePlastic = function(position, newValue, oldValue) {
            if(newValue === oldValue) return;
            target[position+"Armor"].plasticPoints = parseInt(newValue ? newValue : 0);
            vehicle.recalculate();
            update();
        };
        var updateMetal = function(position, newValue, oldValue) {
            if(newValue === oldValue) return;
            target[position+"Armor"].metalPoints = parseInt(newValue ? newValue : 0);
            vehicle.recalculate();
            update();
        };
        $scope.$watch('frontSingle', function(newValue, oldValue) {updateSingle('front', newValue, oldValue);});
        $scope.$watch('frontPlastic', function(newValue, oldValue) {updatePlastic('front', newValue, oldValue);});
        $scope.$watch('frontMetal', function(newValue, oldValue) {updateMetal('front', newValue, oldValue);});
        $scope.$watch('backSingle', function(newValue, oldValue) {updateSingle('back', newValue, oldValue);});
        $scope.$watch('backPlastic', function(newValue, oldValue) {updatePlastic('back', newValue, oldValue);});
        $scope.$watch('backMetal', function(newValue, oldValue) {updateMetal('back', newValue, oldValue);});
        $scope.$watch('leftSingle', function(newValue, oldValue) {updateSingle('left', newValue, oldValue);});
        $scope.$watch('leftPlastic', function(newValue, oldValue) {updatePlastic('left', newValue, oldValue);});
        $scope.$watch('leftMetal', function(newValue, oldValue) {updateMetal('left', newValue, oldValue);});
        $scope.$watch('rightSingle', function(newValue, oldValue) {updateSingle('right', newValue, oldValue);});
        $scope.$watch('rightPlastic', function(newValue, oldValue) {updatePlastic('right', newValue, oldValue);});
        $scope.$watch('rightMetal', function(newValue, oldValue) {updateMetal('right', newValue, oldValue);});
        $scope.$watch('topSingle', function(newValue, oldValue) {updateSingle('top', newValue, oldValue);});
        $scope.$watch('topPlastic', function(newValue, oldValue) {updatePlastic('top', newValue, oldValue);});
        $scope.$watch('topMetal', function(newValue, oldValue) {updateMetal('top', newValue, oldValue);});
        $scope.$watch('underbodySingle', function(newValue, oldValue) {updateSingle('underbody', newValue, oldValue);});
        $scope.$watch('underbodyPlastic', function(newValue, oldValue) {updatePlastic('underbody', newValue, oldValue);});
        $scope.$watch('underbodyMetal', function(newValue, oldValue) {updateMetal('underbody', newValue, oldValue);});
        $scope.$watch('flatbedSingle', function(newValue, oldValue) {updateSingle('flatbed', newValue, oldValue);});
        $scope.$watch('flatbedPlastic', function(newValue, oldValue) {updatePlastic('flatbed', newValue, oldValue);});
        $scope.$watch('flatbedMetal', function(newValue, oldValue) {updateMetal('flatbed', newValue, oldValue);});
        $scope.$watch('topBackSingle', function(newValue, oldValue) {updateSingle('topBack', newValue, oldValue);});
        $scope.$watch('topBackPlastic', function(newValue, oldValue) {updatePlastic('topBack', newValue, oldValue);});
        $scope.$watch('topBackMetal', function(newValue, oldValue) {updateMetal('topBack', newValue, oldValue);});
        $scope.$watch('underbodyBackSingle', function(newValue, oldValue) {updateSingle('underbodyBack', newValue, oldValue);});
        $scope.$watch('underbodyBackPlastic', function(newValue, oldValue) {updatePlastic('underbodyBack', newValue, oldValue);});
        $scope.$watch('underbodyBackMetal', function(newValue, oldValue) {updateMetal('underbodyBack', newValue, oldValue);});
        $scope.$watch('leftBackSingle', function(newValue, oldValue) {updateSingle('leftBack', newValue, oldValue);});
        $scope.$watch('leftBackPlastic', function(newValue, oldValue) {updatePlastic('leftBack', newValue, oldValue);});
        $scope.$watch('leftBackMetal', function(newValue, oldValue) {updateMetal('leftBack', newValue, oldValue);});
        $scope.$watch('rightBackSingle', function(newValue, oldValue) {updateSingle('rightBack', newValue, oldValue);});
        $scope.$watch('rightBackPlastic', function(newValue, oldValue) {updatePlastic('rightBack', newValue, oldValue);});
        $scope.$watch('rightBackMetal', function(newValue, oldValue) {updateMetal('rightBack', newValue, oldValue);});
        $scope.$watch('flatbedBackSingle', function(newValue, oldValue) {updateSingle('flatbedBack', newValue, oldValue);});
        $scope.$watch('flatbedBackPlastic', function(newValue, oldValue) {updatePlastic('flatbedBack', newValue, oldValue);});
        $scope.$watch('flatbedBackMetal', function(newValue, oldValue) {updateMetal('flatbedBack', newValue, oldValue);});
        $scope.$watch('upperFlatbedSingle', function(newValue, oldValue) {updateSingle('upperFlatbed', newValue, oldValue);});
        $scope.$watch('upperFlatbedPlastic', function(newValue, oldValue) {updatePlastic('upperFlatbed', newValue, oldValue);});
        $scope.$watch('upperFlatbedMetal', function(newValue, oldValue) {updateMetal('upperFlatbed', newValue, oldValue);});
        $scope.$watch('upperFlatbedBackSingle', function(newValue, oldValue) {updateSingle('upperFlatbedBack', newValue, oldValue);});
        $scope.$watch('upperFlatbedBackPlastic', function(newValue, oldValue) {updatePlastic('upperFlatbedBack', newValue, oldValue);});
        $scope.$watch('upperFlatbedBackMetal', function(newValue, oldValue) {updateMetal('upperFlatbedBack', newValue, oldValue);});

        $scope.toggleAlternate = function() {
            alternate = !alternate;
            update();
        };
    });
