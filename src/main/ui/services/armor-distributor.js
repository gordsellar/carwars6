/* global angular */
angular.module('carwars').
    constant('MAX_DISTRIBUTE_PLASTIC_UNDERBODY', 15).
    constant('MAX_DISTRIBUTE_PLASTIC_TOP', 10).
    factory('distributor', function(vehicle, MAX_DISTRIBUTE_PLASTIC_UNDERBODY, MAX_DISTRIBUTE_PLASTIC_TOP) {
        "use strict";
        var availableArmorWeight = function (sidecar) {
            if (sidecar) {
                return Math.min(vehicle.car.sidecar.maxWeight - vehicle.car.sidecar.totalWeight(), vehicle.car.engine.totalPowerFactors() * (vehicle.car.heavyDutyTransmission ? 6 : 3) - vehicle.car.weightUsed - vehicle.car.sidecar.totalWeight());
            } else if (vehicle.isTenWheeler()) { // Cab or Carrier
                return vehicle.car.maxEffectiveWeight - vehicle.car.weightUsed;
            } else if (!vehicle.hasEngine()) {
                return vehicle.car.modifiedMaxWeight - vehicle.car.weightUsed;
            } else {
                if (vehicle.isTruck()) return Math.min(vehicle.car.modifiedMaxWeight - vehicle.car.weightUsed, vehicle.car.engine.modifiedMaxLoad() - vehicle.car.weightUsed);
                return Math.min(vehicle.car.modifiedMaxWeight - vehicle.car.weightUsed, vehicle.car.engine.totalPowerFactors() * (vehicle.car.heavyDutyTransmission ? 6 : 3) - vehicle.car.weightUsed);
            }
        };
        var availableArmorPoints = function (sidecar, carrier) {
            var stats, points, weight = availableArmorWeight(sidecar);
            var target = sidecar ? vehicle.car.sidecar : carrier ? vehicle.car.carrier : vehicle.car;
            if (!target.frontArmor.plasticType && target.frontArmor.metalType) {
                stats = target.metalArmorStats();
                if (!sidecar && !carrier && vehicle.car.ramplate) {
                    if (weight < stats.weight * 1.5 && weight >= stats.weight) return 1;
                    points = weight / stats.weight;
                    return Math.max(0, Math.floor(points * 6 / 6.5 + 0.0001));
                } else {
                    return Math.max(0, Math.floor(weight / stats.weight + 0.0001));
                }
            } else if (target.frontArmor.plasticType && !target.frontArmor.metalType) {
                stats = target.plasticArmorStats();
                if (!sidecar && !carrier && vehicle.car.ramplate) {
                    if (weight < stats.weight * 1.5 && weight >= stats.weight) return 1;
                    points = weight / stats.weight;
                    return Math.max(0, Math.floor(points * 6 / 6.5 + 0.0001));
                } else {
                    return Math.max(0, Math.floor(weight / stats.weight + 0.0001));
                }
            }
            return null;
        };
        var configureForRamplate = function (result, armorWeight) {
            var available = availableArmorWeight();
            var used = result.total() * armorWeight + Math.ceil(result.front * armorWeight * 0.5 - 0.0001);
            if (used > available) {
                var difference = (used - available) / armorWeight;
                while (difference > 0) {
                    if (difference > 1) {
                        result.left -= 1;
                        result.right -= 1;
                    } else {
                        result.back -= 1;
                    }
                    if (difference > 2) result.back -= 1;
                    used = result.total() * armorWeight + Math.ceil(result.front * armorWeight * 0.5 - 0.0001);
                    difference = (used - available) / armorWeight;
                }
            }
            return result;
        };
        return {
            calculateArmorDistribution: function (sidecar, carrier) {
                var target = sidecar ? vehicle.car.sidecar : carrier ? vehicle.car.carrier : vehicle.car;
                var result = {
                    front: 0,
                    left: 0,
                    right: 0,
                    back: 0,
                    top: 0,
                    topBack: 0,
                    underbodyBack: 0,
                    leftBack: 0,
                    rightBack: 0,
                    underbody: 0,
                    total: function () {
                        return Math.max(0, this.front + this.left + this.right + this.back + this.top + this.underbody
                            + this.topBack + this.underbodyBack + this.leftBack + this.rightBack);
                    },
                    index: 0,
                    allocate: function (sides, topLimit, backLimit, underbodyLimit, topBackLimit, underbodyBackLimit) {
                        switch (this.index) {
                            case 0:
                                this.front += 1;
                                this.index += this.back < backLimit ? 1 : 2;
                                break;
                            case 1:
                                this.back += 1;
                                if (sides === 2) this.index = 0;
                                else this.index += 1;
                                break;
                            case 2:
                                this.left += 1;
                                this.index += 1;
                                break;
                            case 3:
                                this.right += 1;
                                if (this.underbody < underbodyLimit) this.index += 1;
                                else if (this.top < topLimit) this.index += 2;
                                else if (sides === 6) this.index = 0;
                                else this.index += 3;
                                break;
                            case 4:
                                this.underbody += 1;
                                if (this.top < topLimit) this.index += 1;
                                else if (sides === 6) this.index = 0;
                                else this.index += 2;
                                break;
                            case 5:
                                this.top += 1;
                                if (sides === 6) this.index = 0;
                                else this.index += 1;
                                break;
                            case 6:
                                this.leftBack += 1;
                                this.index += 1;
                                break;
                            case 7:
                                this.rightBack += 1;
                                if (this.underbodyBack < underbodyBackLimit) this.index += 1;
                                else if (this.topBack < topBackLimit) this.index += 2;
                                else this.index = 0;
                                break;
                            case 8:
                                this.underbodyBack += 1;
                                if (this.topBack < topBackLimit) this.index += 1;
                                else this.index = 0;
                                break;
                            case 9:
                                this.topBack += 1;
                                this.index = 0;
                                break;
                        }
                    }
                };
                var points = availableArmorPoints(sidecar, carrier);
                if(points <= 0) return result;
                var fullTop = vehicle.car.topTurret || vehicle.car.topBackTurret || vehicle.isTrike();
                var fullBack = !vehicle.isSemiTractor();
                var sides = 6;
                if (vehicle.isCycle() && !sidecar) sides = 2;
                if (!sidecar && !carrier && vehicle.isOversize()) sides = 10;
                var topMax, underbodyMax, underbodyBackMax, topBackMax, backMax, baseWeight;
                if (target.frontArmor.metalType) {
                    if (target.frontArmor.plasticType) return; // TODO: support composite armor
                    topMax = Math.max(0, 3 - target.topArmor.metalPoints);
                    topBackMax = sidecar || carrier || !vehicle.isOversize() ? 0 : Math.max(0, 3 - target.topBackArmor.metalPoints);
                    backMax = Math.max(0, 5 - target.backArmor.metalPoints);
                    underbodyMax = Math.max(0, 4 - target.underbodyArmor.metalPoints);
                    underbodyBackMax = sidecar || carrier || !vehicle.isOversize() ? 0 : Math.max(0, 4 - target.underbodyBackArmor.metalPoints);
                    baseWeight = target.metalArmorStats().weight;
                } else {
                    topMax = Math.max(0, MAX_DISTRIBUTE_PLASTIC_TOP - target.topArmor.plasticPoints);
                    topBackMax = sidecar || carrier || !vehicle.isOversize() ? 0 : Math.max(0, MAX_DISTRIBUTE_PLASTIC_TOP - target.topBackArmor.plasticPoints);
                    backMax = Math.max(0, MAX_DISTRIBUTE_PLASTIC_TOP - target.backArmor.plasticPoints);
                    underbodyMax = Math.max(0, MAX_DISTRIBUTE_PLASTIC_UNDERBODY - target.underbodyArmor.plasticPoints);
                    underbodyBackMax = sidecar || carrier || !vehicle.isOversize() ? 0 : Math.max(0, MAX_DISTRIBUTE_PLASTIC_UNDERBODY - target.underbodyBackArmor.plasticPoints);
                    baseWeight = target.plasticArmorStats().weight;
                }
                for (var i = 0; i < points; i++)
                    result.allocate(sides, fullTop ? 9999 : topMax, fullBack ? 9999 : backMax, underbodyMax, fullTop ? 9999 : topBackMax, underbodyBackMax);
                if (!sidecar && !carrier && vehicle.car.ramplate) configureForRamplate(result, baseWeight);
                return result;
            },
            distributeArmor: function(sidecar, carrier) {
                var distribution = this.calculateArmorDistribution(sidecar, carrier);
                var target = sidecar ? vehicle.car.sidecar : carrier ? vehicle.car.carrier : vehicle.car;
                if(target.frontArmor.plasticType) {
                    target.frontArmor.plasticPoints += distribution.front;
                    target.leftArmor.plasticPoints += distribution.left;
                    target.rightArmor.plasticPoints += distribution.right;
                    target.backArmor.plasticPoints += distribution.back;
                    target.topArmor.plasticPoints += distribution.top;
                    target.underbodyArmor.plasticPoints += distribution.underbody;
                    if(!sidecar && !carrier && target.isOversize()) {
                        target.leftBackArmor.plasticPoints += distribution.leftBack;
                        target.rightBackArmor.plasticPoints += distribution.rightBack;
                        target.topBackArmor.plasticPoints += distribution.topBack;
                        target.underbodyBackArmor.plasticPoints += distribution.underbodyBack;
                    }
                } else {
                    target.frontArmor.metalPoints += distribution.front;
                    target.leftArmor.metalPoints += distribution.left;
                    target.rightArmor.metalPoints += distribution.right;
                    target.backArmor.metalPoints += distribution.back;
                    target.topArmor.metalPoints += distribution.top;
                    target.underbodyArmor.metalPoints += distribution.underbody;
                    if(!sidecar && !carrier && target.isOversize()) {
                        target.leftBackArmor.metalPoints += distribution.leftBack;
                        target.rightBackArmor.metalPoints += distribution.rightBack;
                        target.topBackArmor.metalPoints += distribution.topBack;
                        target.underbodyBackArmor.metalPoints += distribution.underbodyBack;
                    }
                }
            }
        };
    });