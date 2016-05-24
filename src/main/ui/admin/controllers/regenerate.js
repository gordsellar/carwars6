/* global angular, CW, CWD */
(function() {
    "use strict";
    var app = angular.module('carwars');
    var ctrl = function($scope, $rootScope, $timeout, model2d, server) {
        $scope.running = false;
        $scope.count = 0;
        $scope.total = 0;
        $scope.generatePDF = false;
        $scope.generateImage = false;
        $scope.generateText = false;
        $scope.generateResults = '';
        $scope.generateCount = 0;
        var ids = [];
        var canvas = document.createElement('canvas');
        canvas.width=233;
        canvas.height=200;
        var hasNull = /null/;
        var hasUndef = /undefined/;

        var executeNext = function() {
            if($scope.count >= ids.length) {
                $scope.running = false;
                $rootScope.$broadcast('resize');
                return;
            }
            var id = ids[$scope.count];
            server.loadDesignAdmin(id, function(data) {
                var source;
                $scope.designName = data.designName;
                $scope.authorName = data.author_name ? data.author_name : data.author_email;
                $scope.errorID = data.designId;
                $scope.errorName = data.designName;
                $scope.stockColor = data.stock_car ? "red" : "black";
                if (!data.type || data.type === 'Car') {
                    source = CW.createCar();
                } else if (data.type === 'Cycle')
                    source = CW.createCycle();
                else if (data.type === 'Trike')
                    source = CW.createTrike();
                else if (data.type === 'CarTrailer')
                    source = CW.createCarTrailer();
                else if (data.type === 'TenWheeler')
                    source = CW.createTenWheeler();
                else if (data.type === 'SemiTractor')
                    source = CW.createSemiTractor();
                else if (data.type === 'SemiTrailer')
                    source = CW.createSemiTrailer();
                else if (data.type === 'Bus')
                    source = CW.createBus(data);
                else {
                    $scope.errorMessage = "Unknown design type: "+data.type;
                    return;
                }
                CW.importCar(source, data);
                var text = source.textDescription(true);
                var totalCost = source.totalCost+(source.sidecar ? source.sidecar.totalCost() : 0);
                var legal = source.legal;
                $scope.calculatedCost = totalCost;
                $scope.calculatedWeight = source.weightUsed;
                var originalTech = data.stock_tech_level;

                $scope.loadedCost = source.saved_cost;
                $scope.loadedWeight = source.saved_weight;
                $scope.costColor = totalCost !== source.saved_cost ? "red" : "green";
                $scope.weightColor = source.weightUsed !== source.saved_weight ? "red" : "green";
                var one = [], two = [];
                if(source.weightUsed !== source.saved_weight) {
                    one.push("weight="+source.weightUsed);
                    two.push("weight="+source.saved_weight);
                }
                if(totalCost !== source.saved_cost) {
                    one.push("cost="+totalCost);
                    two.push("cost="+source.saved_cost);
                }
                $scope.sql = one.length === 0 ? null : "update designs set "+one.join(",")+" where ui_id="+$scope.errorID+" and "+two.join(" and ")+";";
                if(!legal && (illegal.indexOf($scope.errorID) < 0 || data.stock_car)) {
                    console.log($scope.errorID+" "+(typeof $scope.errorID));
                    $scope.errorMessage = "Design loaded as illegal.";
                } else if(source.saved_weight !== source.weightUsed || source.saved_cost !== totalCost) {
                    $scope.errorMessage = "Cost/weight mismatch";
                } else if(hasNull.test(text) || hasUndef.test(text)) {
                    $scope.errorMessage = "Text has null/undefined";
                }

                var car = model2d.generateCarShape(source);
                var useX = car.maximumX + 4;
                var useY = car.totalHeight + 4;
                var factor = Math.min(233/useX, 200/useY);
                var paddingLeft = 233/2-Math.round((useX-2)*factor)/2;
                var paddingTop = 200/2-Math.round(useY*factor)/2;
                var ctx = CWD.setupCanvas(canvas, 233, 200, factor, paddingLeft, paddingTop);
                car.draw(ctx, true);
                if(source.type === 'Car' && car.layoutSize.height === 6) console.log("Height 6 for "+data.designId);
                $scope.thumbnail = canvas.toDataURL('image/png');
                var finish = function() {
                    $scope.count += 1;
                    if($scope.errorMessage) {
                        $scope.running = false;
                        $rootScope.$broadcast('resize');
                    } else {
                        $timeout(executeNext);
                    }
                };
                if(($scope.generatePDF || $scope.generateImage || $scope.generateText) && data.public) {
                    // Check tech level
                    if (source.techLevel === 'All') {
                        source.techLevel = 'CWC';
                        if (source.carrier) source.carrier.techLevel = 'CWC';
                        source.recalculate();
                        if (source.legal !== legal || source.totalCost + (source.sidecar ? source.sidecar.totalCost() : 0) !== totalCost ||
                            source.weightUsed !== $scope.calculatedWeight || text !== source.textDescription(true)) {
                            source.techLevel = 'All';
                            if (source.carrier) source.carrier.techLevel = 'All';
                            source.recalculate();
                            if (source.legal !== legal || source.totalCost + (source.sidecar ? source.sidecar.totalCost() : 0) !== totalCost ||
                                source.weightUsed !== $scope.calculatedWeight || text !== source.textDescription(true))
                                throw "Tech level test (CWC) resulted in unexpected change for "+data.designId+"!";
                        } else data.stock_tech_level = 'CWC';
                    }
                    if (source.techLevel === 'CWC' && (source.type === 'Car' || source.type === 'Cycle' || source.type === 'Trike')) {
                        source.techLevel = 'Classic';
                        source.recalculate();
                        if (source.legal !== legal || source.totalCost + (source.sidecar ? source.sidecar.totalCost() : 0) !== totalCost ||
                            source.weightUsed !== $scope.calculatedWeight || text !== source.textDescription(true)) {
                            source.techLevel = 'CWC';
                            source.recalculate();
                            if (source.legal !== legal || source.totalCost + (source.sidecar ? source.sidecar.totalCost() : 0) !== totalCost ||
                                source.weightUsed !== $scope.calculatedWeight || text !== source.textDescription(true))
                                throw "Tech level test (Classic) resulted in unexpected change for "+data.designId+"!";
                        }
                    }
                    if (source.techLevel !== originalTech) {
                        if ($scope.generateResults.length > 0) $scope.generateResults += "\n";
                        $scope.generateResults += "Tech " + source.techLevel + " (was JSON "+data.techLevel+" Stock " + originalTech + ") for " + data.designId;
                    }
                    server.updateStockCar(source, $scope.generatePDF ? car : null, $scope.generateImage ? $scope.thumbnail : null,
                        data.designId, $scope.generateText, function (result) {
                        if (result.legal) {
                            $scope.generateResults += "\n" + result.legal;
                            console.log(result.legal);
                        }
                        $scope.generateCount += 1;
                        if (result.page_count && result.page_count > 2) {
                            if ($scope.generateResults.length > 0) $scope.generateResults += "\n";
                            $scope.generateResults += result.page_count + " pages for " + source.type + " " + data.designId + " " + data.designName;
                            if (result.page_count > 3 || (source.type === 'Cycle' && result.page_count > 2)) console.log(result.page_count + " pages for " + source.type + " " + data.designId + " " + data.designName);
                        }
                        finish();
                    }, function () {
                        $scope.errorMessage = "Unable to update stock car";
                        $scope.running = false;
                        $rootScope.$broadcast('resize');
                    });
                } else
                    finish();

            }, function() {
                $scope.errorMessage = "Unable to load design";
                $scope.errorID = id;
                $scope.errorName = '???';
            });
        };

        $scope.start = function () {
            server.allCarIDs(function(data) {
                ids = data.ids;
                $scope.errorMessage = null;
                $scope.running = true;
                $scope.total = ids.length;
                executeNext();
            }, function() {
                $scope.alert("ID Load Failed");
            });
        };

        var illegal = [
            30453169753116,
            31637198990211,
            32031588711246,
            46983047228514,
            68930818438479,
            73724499162388,
            84468328626826,
            98490970037527,
            112033665107030,
            125686834333465,
            126686686417088,
            127217651085338,  // 200lbs (metal spoiler/dam @ 100ea, PR slicks @ 100ea)
            148249071557075,
            149553336435929,  // autopilot without computer navigator
            153229988683262,  // semi tractor with active suspension
            154517349321395,  // way over weight
            155798452258142,  // didn't count fake RL in fake turret
            156124157365412,  // Didn't enforce 1/3 space for turret+mags
            160486552062763,  // Bus with active suspension
            173643826334901,  // 10pt LR wheelguards
            174911816068752,  // autopilot without computer navigator
            185459186072689,  // overweight after fake weapon weight added
            194640315198904,  // 10pt LR wheelguards
            198583507130121,  // Flak Jacket over IBA
            216919407654797,  // 200lb overweight (metal spoiler/airdam)
            222477001836523,  // way over weight
            223838384315489,  // 10pt LR wheelguards
            224731796530327,  // Flak Jacket over IBA
            230285387852643,  // Way over weight
            241339582542019,  // Flak Jacket over IBA
            248263634042814,  // saved 290lbs overweight
            264091816550276,  // 10pt LR wheelguards
            270549216773361,  // autopilot without nav and radar/infrared
            275093508529631,  // 1lb of hand weapons overweight
            277129170396345,  // Flak Jacket over IBA
            288353789618928,  // Flak Jacket over IBA
            298862706171349,  // Bus with active suspension
            301320690894499,  // saved way overweight
            311732171956958,  // Overweight due to prior weapon concealment errors
            312008027823395,  // Flak Jacket over IBA
            346845361079355,  // saved way overweight
            352410406762771,  // saved way overweight
            354946587270465,  // illegal due to fake weapon bug
            355365606141548,  // saved way overweight
            357451506657526,  // saved way overweight
            371507903768397,  // Flak Jacket over IBA
            374878638423979,  // saved 2lbs overweight
            379255611110622,  // saved way overweight
            382098539266735,  // autopilot without nav and radar/infrared
            382446021074429,  // saved way overweight
            388499400345609,  // saved way overweight
            391838746922516,  // overweight due to fake weapon bug
            405531732433191,  // overweight due to fake weapon bug
            407579432940111,  // Didn't enforce 1/3 space for turret+mags
            412076924927533,  // Didn't enforce 1/3 space for turret+mags
            413624197710305,  // saved way overweight
            439269453985617,  // Didn't enforce 1/3 space for turret+mags
            440290312402048,  // Mini-safe with cargo safe options
            444857378655075,  // overweight
            480877773505183,  // overweight
            486799963284284,  // Flak Jacket over impact armor
            489915924463696,  // Flak Jacket over impact armor
            493833562126383,  // bus with active suspension
            515798518201336,  // Illegal for 100 reasons
            527327342563103,  // back turret bug
            528106643589186,  // fake weapon bug
            530569175956771,  // way over weight
            539820584934205,  // way over weight
            557126373285428,  // many reasons
            569850699091609,  // flak jacket & others
            571100390981883,  // 1/3 space and also weight
            574096953030676,  // autopilot w/o nav
            577277149778864,  // way over weight
            577363401264046,  // over weight
            594045604546522,  // flak jacket
            600813211129547,  // bus active suspension
            620715730125085,  // bus active suspension
            655572711901816,  // just plain overweight
            667713928269222,  // turret 1/3 spaces
            672406947007403,  // autopilot w/o nav
            683230279712007,  // autopilot w/o nav
            684723507147282,  // way over weight
            691893353126943,  // way over weight
            718793301779942,  // WG/WH type doesn't match armor type
            728958827676252,  // bus active suspension
            734136205865070,  // weapon concealment
            739697659621015,  // bus active suspension
            754739410318518,  // fake weapon
            760612221434712,  // saved over weight
            766844524070621,  // bus active suspension
            782535547753415,  // autopilot-gunner link without gunner STOCK CAR
            786766671109945,  // over weight, 1/3 space
            791016300208867,  // autopilot, no radar/infrared
            801456103460946,  // overweight (290) plastic
            829789885600297,  // WG type doesn't match armor type
            832847870987156,  // overweight (247) metal (ramplate 330 from metal, roll cage 330)
            842585935714637,  // 10pt LRFP CA, bus active suspension STOCK CAR
            845116731012240,  // autopilot no radar/infrared
            847335227205705,  // overweight (456) composite (450 front metal, 200 metal spoiler/airdam)
            860447331875820,  // flak jacket over IBA
            866477504139766,  // bus active suspension
            869514250194888,  // overweight (464) composite ramplate (460 from metal, 80 metal spoiler)?
            870886352352933,  // fake weapon
            873963668011236,  // flak jacket over IBA
            879936695696075,  // flak jacket over IBA
            886900392034234,  // flak jacket over IBA & 1/3 spaces
            898325444897637,  // overweight (31)
            917231568719153,  // flak jacket over IBA and overweight ejection seat & etc.
            924652948509902,  // six-wheeled compact
            925399502040818,  // autopilot w/o radar or infrared
            926884686574340,  // overweight (156) plastic, weight of sloping?
            930771096609533,  // bus active suspension
            937082538466156,  // flak jacket over IBA
            940090314291791,  // too many dischargers
            950625455021727,  // overweight (512) composite
            965208764308687,  // overweight (60) steelbelting?
            967890980282991,  // cyclist too many GEs
            972231302657888,  // overweight (656) composite ramplate
            983503747964278,  // overweight (26)
            986363527660005,  // semi tractor active suspension
            987694043433216,  // 10pt LRFP WG
            988802782958373,  // 10pt LR WG
            996597522181729,  // bus active suspension STOCK CAR
            233995472838944,  // mismatched sponson turret
            488667348399758,  // flak jacket at CWC tech
            582974132254093,  // overweight (4)
            608285133494064,  // flak jacket at CWC tech


            // UNDER HERE all wheelhub issues
            18075999338180,
            84757858527797,
            99918298190460,
            117744390387088,
            137233750894666,
            257455982792774,
            277123857522383,
            291875239927322,
            468620192492381,
            472627467941493,
            477687627309933,
            480143266363414,
            509075301932171,
            542964330175892,
            585238601313904,
            602564350469038,
            626496914541349,
            674794350517914,
            696030468679965,
            745861393399537,
            801838861778379,
            835442921979677,
            847993390867487,
            882275234907866,
            952944083139300,
            991536067100242,
            992843653308228

        ];
    };
    if(app.controllerProvider) app.controllerProvider.register('AdminRegenCtrl', ctrl);
    else app.controller('AdminRegenCtrl', ctrl);
})();

